using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using UnityEditor;

namespace GameCowork.EditorBridge
{
    // The editor owns a bounded registry, never a mutable global capture target.
    internal static class PreviewStreams
    {
        const int MaxStreams = 6, MaxSlots = 16, LeaseSeconds = 15;
        static readonly object Sync = new object();
        static readonly Dictionary<string, StreamState> Streams = new Dictionary<string, StreamState>();
        static readonly Dictionary<string, CompositeState> Composites = new Dictionary<string, CompositeState>();
        static readonly Regex Identifier = new Regex(@"^[A-Za-z0-9_.:\-]{1,160}$");
        static readonly Dictionary<string, string> Stopped = new Dictionary<string, string>();
        static readonly Dictionary<string,EditorCapture> RetiredOwned = new Dictionary<string,EditorCapture>();
        internal static string Key(string id)
        {
            id = string.IsNullOrEmpty(id) ? "default" : id;
            if (!Identifier.IsMatch(id)) throw new ArgumentException("Invalid preview stream identifier");
            return id;
        }
        static void Validate(PreviewRequest request)
        {
            if (request == null || request.fps < 1 || request.fps > 30) throw new ArgumentException("fps must be between 1 and 30");
            EditorCapture.ValidateRequest(request);
        }
        public static string Start(PreviewRequest request)
        {
            Validate(request);
            string id = Key(request.streamId);
            StreamState previous;
            lock (Sync)
            {
                Streams.TryGetValue(id, out previous);
                if (previous == null && Streams.Count >= MaxStreams) throw new InvalidOperationException("At most six real preview captures may run concurrently");
            }
            // Acquire the shared window before releasing a previous capture's reference.
            var next = new StreamState { Id = id, Capture = new EditorCapture(request), Fps = request.fps,
                NextFrame = previous == null ? 0 : previous.NextFrame, LastPoll = Stopwatch.GetTimestamp() };
            lock (Sync) { Streams[id] = next; Stopped.Remove(id);RetiredOwned.Remove(id); }
            if (previous != null) previous.Capture.Dispose();
            return Describe(next);
        }
        public static void Resize(PreviewRequest request)
        {
            StreamState state = Find(Key(request.streamId));
            state.Capture.Resize(request);
        }
        public static void Input(InputRequest input)
        {
            if (input == null) throw new ArgumentException("Input is required");
            // This resolves the capture on the main thread, after queueing.
            // A stream name can be reused; its old epoch cannot.
            var state=Find(Key(input.streamId));
            if(state.Latest==null || state.Error!=null)throw new InvalidOperationException("Editor input requires a valid current captured frame; "+(state.Error??"capture is not ready"));
            var capture=state.Capture;
            capture.ValidateInputIdentity(input);
            capture.Input(input);
        }
        static StreamState Find(string id)
        {
            StreamState result;
            lock (Sync) if (Streams.TryGetValue(id, out result)) return result;
            throw new InvalidOperationException("Preview stream is not active: " + id);
        }
        public static CapturedFrame Frame(string id, out string error)
        {
            id = Key(id);
            StreamState state;
            lock (Sync)
            {
                if (!Streams.TryGetValue(id, out state))
                { if (!Stopped.TryGetValue(id, out error)) error = "No preview is active for this stream"; return null; }
            }
            Interlocked.Exchange(ref state.LastPoll, Stopwatch.GetTimestamp());
            lock (Sync) { error = state.Error; return error == null ? state.Latest : null; }
        }
        public static void Tick()
        {
            StreamState[] states;
            lock (Sync) states = Streams.Values.ToArray();
            foreach (var state in states)
            {
                if(state.Capture.TargetClosed)
                { Stop(state.Id,false,"Preview stopped because its selected actual EditorWindow was closed");continue; }
                if ((Stopwatch.GetTimestamp() - Interlocked.Read(ref state.LastPoll)) / (double)Stopwatch.Frequency > LeaseSeconds)
                { Stop(state.Id, false, "Preview stopped because no frame consumer remained for 15 seconds"); continue; }
                if (EditorApplication.isCompiling || EditorApplication.isUpdating || EditorApplication.timeSinceStartup < state.NextCapture) continue;
                state.NextCapture = EditorApplication.timeSinceStartup + 1.0 / state.Fps;
                try
                {
                    var frame = state.Capture.ReadFrame(++state.NextFrame);
                    if (frame != null) { frame.StreamId = state.Id; lock (Sync) { state.Latest = frame; state.Error = null; } }
                }
                catch (Exception exception) { lock (Sync) state.Error = exception.Message; }
            }
        }
        public static void Stop(string id, bool closeOwned = true, string reason = null)
        {
            id = Key(id);
            StreamState state;
            lock (Sync)
            {
                if (!Streams.TryGetValue(id, out state))
                {
                    EditorCapture retired;
                    if(closeOwned && RetiredOwned.TryGetValue(id,out retired)){RetiredOwned.Remove(id);retired.CloseIdleOwnedWindow();}
                    return;
                }
                Streams.Remove(id);
                if (Stopped.Count >= 32) Stopped.Remove(Stopped.Keys.First());
                Stopped[id] = reason ?? "Preview stream was stopped";
            }
            state.Capture.Dispose(closeOwned);
            if(!closeOwned && state.Capture.OwnedTarget)
            {
                if(RetiredOwned.Count>=32)RetiredOwned.Remove(RetiredOwned.Keys.First());
                RetiredOwned[id]=state.Capture;
            }
        }
        public static void StopAll(bool closeOwned = true)
        {
            string[] keys;
            lock (Sync) keys = Streams.Keys.ToArray();
            foreach (string id in keys) Stop(id, closeOwned);
            if(closeOwned){EditorCapture.CloseIdleOwnedWindows();RetiredOwned.Clear();}
            Composites.Clear();
        }
        public static string StatusFields()
        {
            StreamState[] states;
            lock (Sync) states = Streams.Values.ToArray();
            return "\"capturing\":" + (states.Length > 0 ? "true" : "false") + ",\"streamCount\":" + states.Length +
                ",\"maxStreams\":6,\"maxSlots\":16,\"streams\":[" + string.Join(",", states.Select(Describe).ToArray()) +
                "],\"error\":" + Bridge.Json(states.Length == 0 ? Stopped.Values.LastOrDefault() : states.Select(s => s.Error).FirstOrDefault(s => s != null));
        }
        static string Describe(StreamState state)
        {
            return "{\"streamId\":" + Bridge.Json(state.Id) + ",\"windowType\":" + Bridge.Json(state.Capture.WindowType) +
                ",\"captureMode\":" + Bridge.Json(state.Capture.CaptureMode) + ",\"captureBackend\":" + Bridge.Json(state.Capture.CaptureBackend) +
                ",\"captureEpoch\":" + Bridge.Json(state.Capture.CaptureEpoch) + ",\"geometryRevision\":" + state.Capture.GeometryRevision +
                ",\"includesToolbar\":" + (state.Capture.CaptureMode == "editor-window" ? "true" : "false") +
                ",\"inputSupported\":true,\"popupSupported\":false,\"dragAndDropSupported\":false" +
                ",\"instanceId\":" + state.Capture.InstanceId + ",\"width\":" + state.Capture.Width + ",\"height\":" + state.Capture.Height +
                ",\"frameId\":" + (state.Latest == null ? 0 : state.Latest.Sequence) + ",\"error\":" + Bridge.Json(state.Error) + "}";
        }
        public static string Composite(CompositeRequest request)
        {
            ValidateComposite(request);
            string owner = Key(string.IsNullOrEmpty(request.compositeId) ? "legacy-composite" : request.compositeId);
            var supported = request.slots.Where(slot => EditorCapture.Supports(slot.windowType)).ToArray();
            var ownPrefix = "composite:" + owner + ":";
            var nextIds = new HashSet<string>(supported.Select(slot => Key(ownPrefix + slot.slotId)));
            StreamState[] existing;
            lock (Sync) existing = Streams.Values.ToArray();
            if (existing.Count(stream => !stream.Id.StartsWith(ownPrefix, StringComparison.Ordinal)) + nextIds.Count > MaxStreams)
                throw new InvalidOperationException("Composite would exceed six concurrent real captures");
            // Prepare all captures first. A bad selected instance cannot destroy another live slot.
            var prepared = new List<StreamState>();
            try
            {
                foreach (var slot in supported)
                {
                    var size = SlotRequest(request, slot, ownPrefix + slot.slotId);
                    Validate(size);
                    StreamState old = existing.FirstOrDefault(stream => stream.Id == size.streamId);
                    prepared.Add(new StreamState { Id = size.streamId, Capture = new EditorCapture(size), Fps = size.fps,
                        NextFrame = old == null ? 0 : old.NextFrame, LastPoll = Stopwatch.GetTimestamp() });
                }
            }
            catch { foreach (var draft in prepared) draft.Capture.Dispose(); throw; }
            foreach (var draft in prepared)
            {
                StreamState old;
                lock (Sync) { Streams.TryGetValue(draft.Id, out old); Streams[draft.Id] = draft; Stopped.Remove(draft.Id); }
                if (old != null) old.Capture.Dispose();
            }
            foreach (var old in existing) if (old.Id.StartsWith(ownPrefix, StringComparison.Ordinal) && !nextIds.Contains(old.Id)) Stop(old.Id);
            Composites[owner] = new CompositeState { Request = request, Prefix = ownPrefix };
            return CompositeJson(owner);
        }
        static PreviewRequest SlotRequest(CompositeRequest request, CompositeSlot slot, string id)
        {
            return new PreviewRequest { streamId = id, windowType = slot.windowType, instanceId = slot.instanceId, captureMode = slot.captureMode,
                width = Math.Max(16, (int)Math.Round(request.width * slot.rect.w)), height = Math.Max(16, (int)Math.Round(request.height * slot.rect.h)),
                dpr = request.dpr, fps = request.fps };
        }
        static void ValidateComposite(CompositeRequest request)
        {
            if (request == null || request.slots == null || request.slots.Length < 1 || request.slots.Length > MaxSlots)
                throw new ArgumentException("A composite must contain 1..16 actual or unsupported-placeholder slots");
            Key(string.IsNullOrEmpty(request.compositeId) ? "legacy-composite" : request.compositeId);
            var ids = new HashSet<string>();
            foreach (var slot in request.slots)
            {
                if (slot == null || string.IsNullOrEmpty(slot.slotId) || !ids.Add(Key(slot.slotId)) || slot.rect == null ||
                    float.IsNaN(slot.rect.x + slot.rect.y + slot.rect.w + slot.rect.h) ||
                    slot.rect.x < 0 || slot.rect.y < 0 || slot.rect.w <= 0 || slot.rect.h <= 0 ||
                    slot.rect.x + slot.rect.w > 1.001f || slot.rect.y + slot.rect.h > 1.001f)
                    throw new ArgumentException("Composite slots require unique IDs and bounded normalized rectangles");
            }
            if (request.width < 16 || request.width > 1920 || request.height < 16 || request.height > 1080 || float.IsNaN(request.dpr) || float.IsInfinity(request.dpr) || request.dpr < .5f || request.dpr > 4 || request.fps < 1 || request.fps > 30)
                throw new ArgumentException("Composite dimensions/fps are out of bounds");
        }
        public static string ResizeComposite(string owner, PreviewRequest resize)
        {
            owner = Key(owner);
            CompositeState composite;
            if (!Composites.TryGetValue(owner, out composite)) throw new InvalidOperationException("Composite is not active");
            composite.Request.width = resize.width; composite.Request.height = resize.height; composite.Request.dpr = resize.dpr;
            return Composite(composite.Request);
        }
        public static void StopComposite(string owner)
        {
            owner = Key(owner);
            CompositeState state;
            if (!Composites.TryGetValue(owner, out state)) return;
            foreach (var slot in state.Request.slots) if (EditorCapture.Supports(slot.windowType)) Stop(state.Prefix + slot.slotId);
            Composites.Remove(owner);
        }
        static string CompositeJson(string owner)
        {
            var state = Composites[owner];
            var output = new StringBuilder("{\"status\":\"success\",\"transport\":\"image-frames\",\"compositeId\":")
                .Append(Bridge.Json(owner)).Append(",\"width\":").Append(state.Request.width).Append(",\"height\":").Append(state.Request.height)
                .Append(",\"focusedSlotId\":").Append(Bridge.Json(state.Request.focusedSlotId)).Append(",\"slots\":[");
            foreach (var slot in state.Request.slots)
            {
                if (output[output.Length - 1] != '[') output.Append(',');
                bool supported = EditorCapture.Supports(slot.windowType);
                StreamState actual = null;
                if (supported) lock (Sync) Streams.TryGetValue(state.Prefix + slot.slotId, out actual);
                output.Append("{\"slotId\":").Append(Bridge.Json(slot.slotId)).Append(",\"windowType\":").Append(Bridge.Json(slot.windowType))
                    .Append(",\"title\":").Append(Bridge.Json(slot.title)).Append(",\"supported\":").Append(supported ? "true" : "false")
                    .Append(",\"streamId\":").Append(Bridge.Json(supported ? state.Prefix + slot.slotId : null))
                    .Append(",\"captureMode\":").Append(Bridge.Json(actual == null ? null : actual.Capture.CaptureMode))
                    .Append(",\"captureBackend\":").Append(Bridge.Json(actual == null ? null : actual.Capture.CaptureBackend))
                    .Append(",\"includesToolbar\":").Append(actual != null && actual.Capture.CaptureMode == "editor-window" ? "true" : "false")
                    .Append(",\"reason\":").Append(Bridge.Json(supported ? null : "This editor window capture is not implemented; this slot is a placeholder"))
                    .Append(",\"rect\":{\"x\":").Append(Number(slot.rect.x)).Append(",\"y\":").Append(Number(slot.rect.y))
                    .Append(",\"w\":").Append(Number(slot.rect.w)).Append(",\"h\":").Append(Number(slot.rect.h)).Append("}}");
            }
            return output.Append("]}").ToString();
        }
        static string Number(float value) { return value.ToString("R", System.Globalization.CultureInfo.InvariantCulture); }
        sealed class StreamState
        {
            public string Id, Error; public EditorCapture Capture; public CapturedFrame Latest;
            public long LastPoll, NextFrame; public int Fps; public double NextCapture;
        }
        sealed class CompositeState { public CompositeRequest Request; public string Prefix; }
    }
    [Serializable] public sealed class CompositeRequest
    {
        public string compositeId, focusedSlotId, layoutPreset, applyMode;
        public int width, height, fps; public float dpr; public CompositeSlot[] slots;
    }
    [Serializable] public sealed class CompositeSlot
    {
        public string slotId, windowType, title, captureMode; public int instanceId; public SlotRect rect;
    }
    [Serializable] public sealed class SlotRect { public float x, y, w, h; }
}
