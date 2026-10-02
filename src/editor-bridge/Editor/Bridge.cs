using System;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using UnityEditor;
using UnityEngine;

namespace GameCowork.EditorBridge
{
    // Only this editor project is served. All Unity API access occurs on its main thread.
    [InitializeOnLoad]
    public static class Bridge
    {
        const int MaxPending = 64;
        static readonly ConcurrentQueue<Work> Pending = new ConcurrentQueue<Work>();
        static readonly string Instance = Guid.NewGuid().ToString("N");
        static LocalServer tcp, http;
        static int queued, stopping;
        static string projectRoot, configPath, configContents, token, httpPrefix;
        public static string ProjectRoot { get { return projectRoot; } }
        internal static string EditorDomain { get { return Instance; } }
        public static int ProcessId { get { return Process.GetCurrentProcess().Id; } }

        static Bridge()
        {
            EditorApplication.delayCall += Start;
            AssemblyReloadEvents.beforeAssemblyReload += Shutdown;
            EditorApplication.quitting += Shutdown;
        }

        static void Start()
        {
            if (tcp != null || Volatile.Read(ref stopping) != 0) return;
            projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..")).Replace('\\', '/');
            EditorControl.Initialize();
            EditorSceneMutations.Initialize();
            configPath = Path.Combine(projectRoot, "Temp", ".com-unity-gamecowork.json");
            try
            {
                byte[] secret = new byte[24];
                using (var random = RandomNumberGenerator.Create()) random.GetBytes(secret);
                token = BitConverter.ToString(secret).Replace("-", "").ToLowerInvariant();
                httpPrefix = "/api/tauri/window-bridge/local/" + token;
                tcp = new LocalServer(false, HandleTcp);
                tcp.Start();
                var config = new ConnectionInfo {
                    unity_host = "127.0.0.1", unity_port = tcp.Port,
                    project_path = Application.dataPath.Replace('\\', '/'),
                    reason = "GameCowork local editor bridge", last_updated = DateTime.UtcNow.ToString("o"),
                    bridge_instance = Instance, transport = "image-frames"
                };
                configContents = JsonUtility.ToJson(config, true);
                Directory.CreateDirectory(Path.GetDirectoryName(configPath));
                WriteOwnConfig(configPath, configContents);
                EditorApplication.update += Update;
                UnityEngine.Debug.Log("[GameCowork] Local editor bridge ready for " + projectRoot);
            }
            catch (Exception error)
            {
                if (tcp != null) tcp.Dispose();
                tcp = null;
                UnityEngine.Debug.LogError("[GameCowork] Editor bridge failed: " + error.Message);
            }
        }

        static void WriteOwnConfig(string file, string contents)
        {
            // Temp belongs to this project. Do not overwrite a different live GameCowork bridge.
            if (File.Exists(file))
            {
                var old = JsonUtility.FromJson<ConnectionInfo>(File.ReadAllText(file));
                if (old != null && old.unity_port > 0)
                {
                    using (var probe = new TcpClient())
                    {
                        var attempt = probe.BeginConnect("127.0.0.1", old.unity_port, null, null);
                        if (attempt.AsyncWaitHandle.WaitOne(100) && probe.Connected)
                            throw new IOException("Another live GameCowork bridge owns this project's connection file");
                    }
                }
            }
            string temporary = file + "." + Instance + ".tmp";
            File.WriteAllText(temporary, contents, new UTF8Encoding(false));
            if (File.Exists(file)) File.Replace(temporary, file, null);
            else File.Move(temporary, file);
        }

        static void Update()
        {
            for (int i = 0; i < 8; i++)
            {
                Work work;
                if (!Pending.TryDequeue(out work)) break;
                Interlocked.Decrement(ref queued);
                if (work.Cancelled || EditorCancellation.IsCancelled(work.Identity))
                { work.Error = new OperationCanceledException("Own Editor control was cancelled before execution"); work.Done.Set(); continue; }
                try { work.Result = work.Action(); }
                catch (Exception error) { work.Error = error; }
                work.Done.Set();
            }
            EditorControl.Tick();
            PreviewStreams.Tick();
        }

        static string OnMain(Func<string> action, EditorCancellation.Lease identity = null, Func<bool> disconnected = null)
        {
            if (Volatile.Read(ref stopping) != 0) throw new IOException("Editor bridge is shutting down");
            if (Interlocked.Increment(ref queued) > MaxPending)
            { Interlocked.Decrement(ref queued); throw new IOException("Editor bridge request queue is full"); }
            var work = new Work { Action = action, Identity = identity };
            Pending.Enqueue(work);
            var wait = Stopwatch.StartNew();
            while (!work.Done.Wait(50))
            {
                if (identity != null && (EditorCancellation.IsCancelled(identity) || (disconnected != null && disconnected())))
                {
                    EditorCancellation.CancelDisconnected(identity); work.Cancelled = true;
                    throw new OperationCanceledException("Own Editor control was cancelled before execution");
                }
                if (wait.ElapsedMilliseconds >= 5000)
                { EditorCancellation.CancelDisconnected(identity); work.Cancelled = true; throw new TimeoutException("Editor main thread did not finish the request"); }
            }
            if (work.Error != null) throw work.Error;
            return work.Result;
        }

        static void HandleTcp(TcpClient client)
        {
            var stream = client.GetStream();
            string owner = Guid.NewGuid().ToString("N");
            var owned = new System.Collections.Generic.HashSet<EditorCancellation.Lease>();
            byte[] welcome = Encoding.ASCII.GetBytes("WELCOME UNITY-TCP FRAMING=1 SERVER_VERSION=2 EDITOR_CONTROL_CANCEL=1 EDITOR_DOMAIN=" + Instance + " PROJECT_ROOT=" + Uri.EscapeDataString(projectRoot) + "\n");
            stream.Write(welcome, 0, welcome.Length);
            try {
            while (Volatile.Read(ref stopping) == 0)
            {
                byte[] header = LocalServer.ReadExact(stream, 8);
                if (header == null) return;
                ulong size = 0;
                for (int i = 0; i < 8; i++) size = (size << 8) | header[i];
                if (size == 0) continue;
                if (size > 1024 * 1024) throw new IOException("TCP request exceeds 1 MiB");
                string message = Encoding.UTF8.GetString(LocalServer.ReadExact(stream, (int)size));
                if (message.StartsWith("CLIENT_VERSION=") || message.StartsWith("PLATFORM=")) continue;
                string reply;
                if (message == "ping") reply = "{\"success\":true,\"message\":\"pong\"}";
                else
                {
                    string id = null;
                    EditorCancellation.Lease identity = null;
                    try
                    {
                        var envelope = EditorCancellation.Parse(message);
                        object entry;
                        if (envelope.TryGetValue("request_id", out entry)) id = entry as string;
                        string kind = envelope.TryGetValue("type", out entry) ? entry as string : null;
                        if (kind == "_gamecowork_cancel_editor_control" || kind == "_gamecowork_editor_control_status")
                            reply = Reply(id, true, EditorCancellation.Cancel(envelope, kind == "_gamecowork_cancel_editor_control"), null);
                        else
                        {
                            identity = EditorCancellation.Register(envelope, owner);
                            if (identity != null) owned.Add(identity);
                            var renewed = EditorCancellation.Renew(envelope, owner);
                            if (renewed != null) owned.Add(renewed);
                            reply = OnMain(() => {
                                if (!EditorCancellation.Begin(identity)) return Reply(id, false, "{\"cancelled\":true,\"applied\":false}", "Own Editor control was cancelled before execution");
                                return Dispatch(message, identity);
                            }, identity, () => client.Client.Poll(0, SelectMode.SelectRead) && client.Client.Available == 0);
                        }
                    }
                    catch (OperationCanceledException error)
                    { EditorCancellation.Finish(identity, "cancelled_or_failed"); reply = Reply(id, false, EditorCancellation.FailureJson(identity, error.Message, true), error.Message); }
                    catch (Exception error)
                    { EditorCancellation.Finish(identity, "failed"); reply = Reply(id, false, EditorCancellation.FailureJson(identity, error.Message, false), error.Message); }
                }
                byte[] payload = Encoding.UTF8.GetBytes(reply);
                for (int i = 0; i < 8; i++) header[7 - i] = (byte)((ulong)payload.Length >> (i * 8));
                stream.Write(header, 0, header.Length);
                stream.Write(payload, 0, payload.Length);
            }
            } finally { foreach (var lease in owned) EditorCancellation.CancelDisconnected(lease, owner); }
        }

        static string Dispatch(string raw, EditorCancellation.Lease identity = null)
        {
            TcpRequest request = JsonUtility.FromJson<TcpRequest>(raw);
            if (request == null || string.IsNullOrEmpty(request.type)) throw new ArgumentException("Request type is required");
            string id = request.request_id;
            try
            {
                if (request.type == "manage_editor" || request.type == "_internal_asset_listening")
                {
                    string action = request.@params == null ? null : request.@params.action;
                    bool control = request.type == "manage_editor" &&
                        (action == "play" || action == "pause" || action == "resume" || action == "stop" || action == "refresh");
                    return Reply(id, true, control ? EditorControl.Invoke(request.@params, identity) :
                        request.type == "manage_editor" && EditorContextQueries.Handles(action) ? EditorContextQueries.Invoke(action) : EditorReadOnly.Invoke(request.type, action), null);
                }
                if (request.type == "manage_scene" || request.type == "manage_gameobject")
                    return Reply(id, true, EditorSceneMutations.Handles(request.type, request.@params == null ? null : request.@params.action) ?
                        EditorSceneMutations.Invoke(request.type, raw, identity) : EditorSceneQueries.Invoke(request.type, raw), null);
                if (request.type == "manage_asset")
                    return Reply(id, true, EditorAssetQueries.Invoke(raw), null);
                if (request.type == "manage_package")
                    return Reply(id, true, EditorPackageQueries.Invoke(raw), null);
                if (request.type == "read_console")
                    return Reply(id, true, EditorConsole.Invoke(raw, identity), null);
                if (request.type != "manage_window_bridge") return Reply(id, false, null, "Unsupported editor command: " + request.type);
                var parameters = request.@params ?? new PreviewRequest();
                switch (parameters.action)
                {
                    case "list_windows": return Reply(id, true, EditorCapture.WindowsJson(), null);
                    case "start_stream_server":
                        EnsureHttp(parameters.port);
                        return Reply(id, true, ServerStateJson(), null);
                    case "stop_stream_server":
                        StopPreview();
                        if (http != null) { http.Dispose(); http = null; }
                        return Reply(id, true, ServerStateJson(), null);
                    case "get_stream_server_status": return Reply(id, true, ServerStateJson(), null);
                    default: return Reply(id, false, null, "Unsupported manage_window_bridge action: " + parameters.action);
                }
            }
            catch (Exception error) { EditorCancellation.Finish(identity, "failed"); return Reply(id, false, EditorCancellation.FailureJson(identity, error.Message, error is OperationCanceledException), error.Message); }
        }

        static void EnsureHttp(int port)
        {
            if (http != null)
            {
                if (port != 0 && port != http.Port) throw new ArgumentException("Preview server is already running on a different port");
                return;
            }
            http = new LocalServer(true, HandleHttp, port);
            try { http.Start(); } catch { http.Dispose(); http = null; throw; }
        }

        static string ServerStateJson()
        {
            return "{\"status\":\"success\",\"running\":" + (http != null ? "true" : "false") +
                ",\"transport\":\"image-frames\",\"signalingUrl\":" + Json(http == null ? null : "http://127.0.0.1:" + http.Port + httpPrefix) +
                ",\"projectRoot\":" + Json(projectRoot) + ",\"pid\":" + ProcessId +
                "," + PreviewStreams.StatusFields() + "}";
        }

        static void HandleHttp(TcpClient client)
        {
            var request = LocalServer.ReadHttp(client.GetStream());
            if (!LocalServer.IsLocalOrigin(request.Origin)) { LocalServer.SendJson(client, 403, "{\"error\":\"Foreign browser Origin is forbidden\"}", null); return; }
            if (!request.Path.StartsWith(httpPrefix + "/", StringComparison.Ordinal))
            { LocalServer.SendJson(client, 404, "{\"error\":\"Unknown preview capability\"}", request.Origin); return; }
            string route = request.Path.Substring(httpPrefix.Length).Split('?')[0];
            if (request.Method == "OPTIONS") { LocalServer.SendJson(client, 204, "", request.Origin); return; }
            if (request.Method == "GET" && route == "/frame")
            {
                string streamId = null;
                int question = request.Path.IndexOf('?');
                if (question >= 0) foreach (string part in request.Path.Substring(question + 1).Split('&'))
                    if (part.StartsWith("streamId=", StringComparison.Ordinal)) streamId = Uri.UnescapeDataString(part.Substring(9));
                string error;
                CapturedFrame frame = PreviewStreams.Frame(streamId, out error);
                if (frame == null) { LocalServer.SendJson(client, 409, "{\"error\":" + Json(error ?? "No real editor frame has been rendered yet") + "}", request.Origin); return; }
                LocalServer.SendFrame(client, frame, request.Origin);
                return;
            }
            string result;
            try
            {
                result = OnMain(() => {
                    if (request.Method == "GET" && route == "/health")
                        return "{\"status\":\"ok\",\"transport\":\"image-frames\",\"multiStream\":true,\"maxStreams\":6,\"maxSlots\":16,\"projectRoot\":" + Json(projectRoot) + ",\"pid\":" + ProcessId + "}";
                    if (request.Method == "GET" && route == "/windows") return EditorCapture.WindowsJson();
                    if (request.Method == "GET" && route == "/stream/status") return ServerStateJson();
                    if (request.Method != "POST") throw new ArgumentException("Unsupported HTTP method or route");
                    if (route == "/stream/start-offscreen")
                    {
                        StartPreview(JsonUtility.FromJson<PreviewRequest>(request.Body));
                        return ServerStateJson();
                    }
                    if (route == "/stream/resize")
                    {
                        var resize = JsonUtility.FromJson<PreviewRequest>(request.Body);
                        if (!string.IsNullOrEmpty(resize.compositeId)) return PreviewStreams.ResizeComposite(resize.compositeId, resize);
                        PreviewStreams.Resize(resize);
                        return ServerStateJson();
                    }
                    if (route == "/stream/start-composite" || route == "/stream/update-composite")
                        return PreviewStreams.Composite(JsonUtility.FromJson<CompositeRequest>(request.Body));
                    if (route == "/stream/stop")
                    {
                        var target = string.IsNullOrEmpty(request.Body) ? new PreviewRequest() : JsonUtility.FromJson<PreviewRequest>(request.Body);
                        if (!string.IsNullOrEmpty(target.compositeId)) PreviewStreams.StopComposite(target.compositeId);
                        else if (!string.IsNullOrEmpty(target.streamId)) PreviewStreams.Stop(target.streamId);
                        else StopPreview();
                        return ServerStateJson();
                    }
                    if (route == "/input")
                    {
                        PreviewStreams.Input(JsonUtility.FromJson<InputRequest>(request.Body));
                        return "{\"success\":true}";
                    }
                    throw new ArgumentException("Unsupported preview route: " + route);
                });
                LocalServer.SendJson(client, 200, result, request.Origin);
            }
            catch (Exception error) { LocalServer.SendJson(client, error is TimeoutException ? 503 : 400, "{\"error\":" + Json(error.Message) + "}", request.Origin); }
        }

        public static void StartPreview(PreviewRequest request)
        {
            if (request == null) throw new ArgumentException("Preview request is required");
            if (EditorApplication.isCompiling || EditorApplication.isUpdating) throw new InvalidOperationException("Editor is compiling or updating");
            PreviewStreams.Start(request);
        }

        public static void StopPreview(bool closeCreatedWindow = true)
        {
            PreviewStreams.StopAll(closeCreatedWindow);
        }

        static void Shutdown()
        {
            if (Interlocked.Exchange(ref stopping, 1) != 0) return;
            EditorCancellation.Freeze();
            EditorControl.PrepareShutdown();
            EditorApplication.update -= Update;
            StopPreview();
            if (tcp != null) { tcp.Dispose(); tcp = null; }
            if (http != null) { http.Dispose(); http = null; }
            Work work;
            while (Pending.TryDequeue(out work)) { work.Cancelled = true; work.Done.Set(); }
            try { if (configPath != null && File.Exists(configPath) && File.ReadAllText(configPath) == configContents) File.Delete(configPath); }
            catch (IOException) { /* A later instance may already own the Temp connection file. */ }
        }

        static string Reply(string id, bool success, string data, string error)
        {
            return "{\"request_id\":" + Json(id) + ",\"result\":{\"success\":" + (success ? "true" : "false") +
                (data != null ? ",\"data\":" + data : "") + (error != null ? ",\"error\":" + Json(error) : "") + "}}";
        }
        internal static string Json(string text)
        {
            if (text == null) return "null";
            var output = new StringBuilder("\"");
            foreach (char value in text)
            {
                if (value == '"' || value == '\\') output.Append('\\').Append(value);
                else if (value < 32) output.Append("\\u").Append(((int)value).ToString("x4"));
                else output.Append(value);
            }
            return output.Append('"').ToString();
        }
        sealed class Work
        {
            public Func<string> Action;
            public EditorCancellation.Lease Identity;
            public readonly ManualResetEventSlim Done = new ManualResetEventSlim(false);
            public volatile bool Cancelled;
            public string Result;
            public Exception Error;
        }
        [Serializable] sealed class ConnectionInfo
        {
            public string unity_host, project_path, reason, last_updated, bridge_instance, transport;
            public int unity_port;
        }
        [Serializable] sealed class TcpRequest { public string type, request_id; public PreviewRequest @params; }
    }

    [Serializable] public sealed class PreviewRequest
    {
        public string action, windowType, streamId, compositeId, captureMode;
        public int port, instanceId, width = 640, height = 480, fps = 10;
        public int timeoutSeconds;
        public bool singleFrame;
        public float dpr = 1;
    }
    [Serializable] public sealed class InputRequest
    {
        public string type, key, code, streamId, captureEpoch;
        public int button, keyCode, instanceId;
        public long geometryRevision;
        public float x, y, deltaX, deltaY, dx, dy;
        public bool shift, ctrl, alt, meta;
    }
    internal sealed class CapturedFrame
    {
        public byte[] Bytes;
        public long Sequence;
        public string StreamId;
        public int Width, Height;
        public int SourceWidth, SourceHeight;
        public Rect ContentRect;
        public string CaptureMode, CaptureBackend, CaptureEpoch;
        public long GeometryRevision;
        public int InstanceId;
        public bool IncludesToolbar;
        public float PixelsPerPoint;
        public Rect WindowContentRect;
    }
}
