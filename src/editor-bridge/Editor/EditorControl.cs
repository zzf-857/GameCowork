using System;
using System.Reflection;
using UnityEditor;
using UnityEditor.Compilation;
using UnityEngine;

namespace GameCowork.EditorBridge
{
    // Main-thread state machine. Play/stop and compilation can reload this
    // assembly, so the operation identity is retained in this Editor session.
    internal static class EditorControl
    {
        const string SessionKey = "GameCowork.EditorControl.operation";
        static Operation operation;
        static EditorCancellation.Lease identity;
        static bool initialized;
        [Serializable] sealed class Operation
        {
            public string id, action, phase, status, error;
            public string clientId, cancelToken, requestId, projectRoot, domainId;
            public bool applied;
            public bool singleFrame, compilationObserved;
            public long deadline;
            public double settleUntil;
            public int startFrame;
        }
        public static void Initialize()
        {
            if (initialized) return;
            initialized = true;
            string saved = SessionState.GetString(SessionKey, "");
            if (!string.IsNullOrEmpty(saved))
            {
                try {
                    operation = JsonUtility.FromJson<Operation>(saved);
                    if (operation == null || string.IsNullOrEmpty(operation.projectRoot) ||
                        !string.Equals(System.IO.Path.GetFullPath(operation.projectRoot).Replace('\\', '/').TrimEnd('/'), Bridge.ProjectRoot.TrimEnd('/'), StringComparison.OrdinalIgnoreCase))
                        throw new ArgumentException("Saved Editor control belongs to another or unknown project");
                    identity = EditorCancellation.Restore(operation.clientId, operation.cancelToken, operation.requestId, operation.projectRoot,
                        operation.id, operation.applied, operation.status == "cancelled", operation.status != "pending", operation.domainId);
                }
                catch { operation = null; identity = null; SessionState.EraseString(SessionKey); }
            }
            CompilationPipeline.compilationStarted += CompilationStarted;
            CompilationPipeline.compilationFinished += CompilationFinished;
        }
        static void Save() { SessionState.SetString(SessionKey, JsonUtility.ToJson(operation)); }
        static void CompilationStarted(object context)
        {
            if (operation == null || operation.status != "pending" || operation.action != "refresh") return;
            operation.compilationObserved = true; Save();
        }
        static void CompilationFinished(object context)
        {
            if (operation == null || operation.status != "pending" || operation.action != "refresh") return;
            operation.settleUntil = EditorApplication.timeSinceStartup + 1; Save();
        }
        static string PlayMode { get { return EditorApplication.isPlaying ? EditorApplication.isPaused ? "paused" : "playing" : "stopped"; } }
        static bool Busy { get { return EditorApplication.isCompiling || EditorApplication.isUpdating; } }
        public static string Invoke(PreviewRequest request, EditorCancellation.Lease requestIdentity = null)
        {
            Initialize();
            string action = request == null ? null : request.action;
            if (action != "play" && action != "pause" && action != "resume" && action != "stop" && action != "refresh")
                throw new NotSupportedException("Unsupported manage_editor action: " + action);
            int budget = request.timeoutSeconds == 0 ? 60 : request.timeoutSeconds;
            if (budget < 1 || budget > 180) throw new ArgumentException("timeoutSeconds must be 1..180");
            if (operation != null && operation.status == "pending")
                throw new InvalidOperationException("Editor control operation " + operation.id + " is still pending");
            if ((action == "pause" || action == "resume") && !EditorApplication.isPlaying)
                throw new InvalidOperationException("Play Mode must be running before " + action);
            if (action == "resume" && request.singleFrame && !EditorApplication.isPaused)
                throw new InvalidOperationException("Single-frame resume requires paused Play Mode");
            operation = new Operation {
                id = Guid.NewGuid().ToString("N"), action = action,
                phase = "accepted", status = "pending", singleFrame = request.singleFrame,
                deadline = DateTime.UtcNow.AddSeconds(budget).Ticks,
                clientId = requestIdentity == null ? null : requestIdentity.ClientId,
                cancelToken = requestIdentity == null ? null : requestIdentity.Token,
                requestId = requestIdentity == null ? null : requestIdentity.RequestId,
                domainId = requestIdentity == null ? null : requestIdentity.DomainId,
                projectRoot = Bridge.ProjectRoot
            };
            identity = requestIdentity;
            EditorCancellation.Accepted(identity, operation.id);
            if (EditorCancellation.IsCancelled(identity)) { Finish("cancelled", "Own Editor control was cancelled before applying an effect"); return StateJson(); }
            Save();
            // Acceptance is deliberately not a completed control result.
            return StateJson();
        }
        public static void Tick()
        {
            Initialize();
            if (operation == null || operation.status != "pending") return;
            if (!operation.applied && EditorCancellation.IsCancelled(identity))
            { Finish("cancelled", "Own Editor control was cancelled before applying an effect"); return; }
            if (DateTime.UtcNow.Ticks >= operation.deadline)
            { Finish("error", "Editor did not reach the requested state before timeout"); return; }
            try
            {
                if (operation.phase == "accepted")
                {
                    if (Busy) return;
                    if (!EditorCancellation.HasOwner(identity)) return; // A reloaded secure caller must renew its original lease before a new effect.
                    if (!EditorCancellation.BeginEffect(identity))
                    { Finish("cancelled", "Own Editor control was cancelled before applying an effect"); return; }
                    operation.applied = true;
                    operation.phase = "waiting";
                    // Persist before any API that can schedule assembly reload.
                    Save();
                    switch (operation.action)
                    {
                        case "play": EditorApplication.isPaused = false; EditorApplication.isPlaying = true; break;
                        case "pause": EditorApplication.isPaused = true; break;
                        case "resume":
                            if (operation.singleFrame)
                            {
                                operation.startFrame = Time.frameCount; Save();
                                EditorApplication.Step();
                            }
                            else EditorApplication.isPaused = false;
                            break;
                        case "stop": EditorApplication.isPlaying = false; break;
                        case "refresh":
                            operation.phase = "stop_for_refresh"; Save();
                            if (EditorApplication.isPlayingOrWillChangePlaymode) EditorApplication.isPlaying = false;
                            break;
                    }
                    return;
                }
                if (operation.action == "refresh")
                {
                    if (operation.phase == "stop_for_refresh")
                    {
                        if (Busy || EditorApplication.isPlayingOrWillChangePlaymode) return;
                        // Do not block the main thread waiting for the subsequent
                        // compilation/reload. The next domain resumes this phase.
                        operation.phase = "importing";
                        operation.settleUntil = EditorApplication.timeSinceStartup + 2;
                        Save();
                        ClearConsole();
                        AssetDatabase.Refresh(ImportAssetOptions.ForceUpdate);
                        return;
                    }
                    if (Busy || EditorApplication.isPlayingOrWillChangePlaymode || EditorApplication.timeSinceStartup < operation.settleUntil) return;
                    Finish("completed", null);
                    return;
                }
                if (Busy) return;
                bool reached = operation.action == "play" ? EditorApplication.isPlaying && !EditorApplication.isPaused :
                    operation.action == "pause" ? EditorApplication.isPlaying && EditorApplication.isPaused :
                    operation.action == "stop" ? !EditorApplication.isPlayingOrWillChangePlaymode :
                    operation.singleFrame ? EditorApplication.isPlaying && EditorApplication.isPaused && Time.frameCount > operation.startFrame :
                    EditorApplication.isPlaying && !EditorApplication.isPaused;
                if (reached) Finish("completed", null);
            }
            catch (Exception error) { Finish("error", error.Message); }
        }
        static void Finish(string status, string error)
        {
            operation.status = status; operation.phase = status; operation.error = error; Save();
            EditorCancellation.Finish(identity, status);
        }
        // Main thread only, after the control channel has frozen its admission.
        // Persist a previously confirmed cancellation before static leases vanish.
        public static void PrepareShutdown()
        {
            if (operation != null && operation.status == "pending" && !operation.applied && EditorCancellation.IsCancelled(identity))
                Finish("cancelled", "Own Editor control was cancelled before applying an effect");
            else if (operation != null) Save();
        }
        static Type LogEntries { get { return typeof(EditorWindow).Assembly.GetType("UnityEditor.LogEntries"); } }
        static void ClearConsole()
        {
            Type type = LogEntries;
            MethodInfo clear = type == null ? null : type.GetMethod("Clear", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);
            if (clear == null) throw new NotSupportedException("This Editor version does not expose Console clearing for refresh");
            clear.Invoke(null, null);
        }
        static string ConsoleFields()
        {
            Type type = LogEntries;
            MethodInfo counts = type == null ? null : type.GetMethod("GetCountsByType", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);
            if (counts == null) return ",\"consoleSupported\":false";
            object[] values = { 0, 0, 0 };
            try
            {
                counts.Invoke(null, values);
                int errors = Convert.ToInt32(values[0]), warnings = Convert.ToInt32(values[1]);
                return ",\"consoleSupported\":true,\"hasErrors\":" + (errors > 0 ? "true" : "false") +
                    ",\"errors\":" + errors + ",\"warnings\":" + warnings;
            }
            catch { return ",\"consoleSupported\":false"; }
        }
        public static string StateJson()
        {
            Initialize();
            bool pending = operation != null && operation.status == "pending";
            string fields = "{\"isPlaying\":" + (EditorApplication.isPlaying ? "true" : "false") +
                ",\"isPaused\":" + (EditorApplication.isPaused ? "true" : "false") +
                ",\"playMode\":" + Bridge.Json(PlayMode) +
                ",\"isCompiling\":" + (EditorApplication.isCompiling ? "true" : "false") +
                ",\"isUpdating\":" + (EditorApplication.isUpdating ? "true" : "false") +
                ",\"unityVersion\":" + Bridge.Json(Application.unityVersion) +
                ",\"projectRoot\":" + Bridge.Json(Bridge.ProjectRoot) + ",\"pid\":" + Bridge.ProcessId +
                ",\"runtimeFrame\":" + Time.frameCount + ConsoleFields() + ",\"pending\":" + (pending ? "true" : "false");
            if (operation != null)
                fields += ",\"operationId\":" + Bridge.Json(operation.id) + ",\"controlAction\":" + Bridge.Json(operation.action) +
                    ",\"controlStatus\":" + Bridge.Json(operation.status) + ",\"controlPhase\":" + Bridge.Json(operation.phase) +
                    ",\"singleFrame\":" + (operation.singleFrame ? "true" : "false") +
                    ",\"startFrame\":" + operation.startFrame + ",\"compilationObserved\":" + (operation.compilationObserved ? "true" : "false") +
                    ",\"cancellationSupported\":" + (identity == null ? "false" : "true") + ",\"applied\":" + (operation.applied ? "true" : "false") +
                    (operation.error == null ? "" : ",\"controlError\":" + Bridge.Json(operation.error));
            return fields + "}";
        }
    }
}
