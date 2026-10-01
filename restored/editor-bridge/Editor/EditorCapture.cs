using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using UnityEditor;
using UnityEngine;
using UnityEngine.Rendering;

namespace GameCowork.EditorBridge
{
    internal sealed class EditorCapture : IDisposable
    {
        const BindingFlags InstanceMembers = BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;
        readonly EditorWindow window;
        readonly WindowLease lease;
        static readonly Dictionary<int, WindowLease> WindowLeases = new Dictionary<int, WindowLease>();
        bool disposed;
        readonly bool gameView;
        readonly GenericWindowHost generic;
        readonly string windowType;
        readonly string captureEpoch = Guid.NewGuid().ToString("N");
        long geometryRevision;
        string lastMapping;
        CapturedFrame lastFrame;
        Texture2D pixels;
        RenderTexture scenePixels;
        long sceneGeneration, lastReadSceneGeneration;
        readonly HashSet<KeyCode> heldKeys = new HashSet<KeyCode>();
        readonly HashSet<int> heldButtons = new HashSet<int>();
        Vector2 lastMouse;
        int width, height;
        int sourceWidth, sourceHeight;
        Rect contentRect;
        public EditorCapture(PreviewRequest request)
        {
            ValidateRequest(request);
            Type type = GenericWindowHost.ResolveType(request.windowType);
            bool fullWindow = request.captureMode == "editor-window" || !RenderContent(request.windowType);
            windowType = type.FullName;
            foreach (var current in Resources.FindObjectsOfTypeAll<EditorWindow>())
            {
                WindowLease existing;
                if (current.GetType() == type && (request.instanceId != 0 ? current.GetInstanceID() == request.instanceId :
                    !fullWindow || (WindowLeases.TryGetValue(current.GetInstanceID(), out existing) && existing.Owned))) { window = current; break; }
            }
            bool created = false;
            if (window == null)
            {
                if (request.instanceId != 0) throw new ArgumentException("The selected editor window instance is not available");
                window = fullWindow ? ScriptableObject.CreateInstance(type) as EditorWindow : EditorWindow.GetWindow(type); created = true;
                if (fullWindow)
                {
                    window.ShowUtility();
                    window.position = new Rect(80, 90, Math.Max(320, Math.Min(1920, request.width)), Math.Max(240, Math.Min(1080, request.height)));
                }
            }
            int instance = window.GetInstanceID();
            if (!WindowLeases.TryGetValue(instance, out lease))
            {
                lease = new WindowLease { Window = window, Owned = created, InstanceId = instance };
                WindowLeases[instance] = lease;
            }
            lease.References++;
            gameView = request.windowType == "UnityEditor.GameView";
            if (fullWindow) generic = new GenericWindowHost(window);
            width = request.width; height = request.height;
            contentRect = new Rect(0, 0, width, height);
            // Existing complete-GUI targets already have their own native host.
            // Show() can convert a utility window or change its active dock tab.
            if (!fullWindow) window.Show();
            window.Repaint();
            if (!gameView && generic == null)
            {
                // SceneView reuses/clears its RT for transparent handles after drawing
                // the scene. Snapshot at the camera's actual render callback, before
                // that reuse, rather than reading the empty overlay RT on update.
                Camera.onPostRender += SceneRendered;
                RenderPipelineManager.endCameraRendering += SceneRenderedSrp;
            }
        }
        public int InstanceId { get { return window == null ? 0 : window.GetInstanceID(); } }
        public bool TargetClosed { get { return window == null; } }
        internal bool OwnedTarget { get { return lease.Owned; } }
        internal void CloseIdleOwnedWindow()
        {
            WindowLease current;
            if(lease.References!=0 || !lease.Owned || !WindowLeases.TryGetValue(lease.InstanceId,out current) || current!=lease)return;
            WindowLeases.Remove(lease.InstanceId);
            if(lease.Window!=null)lease.Window.Close();
        }
        internal static void CloseIdleOwnedWindows()
        {
            foreach(var idle in new List<WindowLease>(WindowLeases.Values))
            {
                if(idle.References!=0 || !idle.Owned)continue;
                WindowLeases.Remove(idle.InstanceId);
                if(idle.Window!=null)idle.Window.Close();
            }
        }
        public string WindowType { get { return windowType; } }
        public string CaptureMode { get { return generic == null ? "render-content" : "editor-window"; } }
        public string CaptureBackend { get { return generic == null ? "unity-render-texture" : "unity-guiview"; } }
        public string CaptureEpoch { get { return captureEpoch; } }
        public long GeometryRevision { get { return geometryRevision; } }
        public int Width { get { return width; } }
        public int Height { get { return height; } }
        internal static bool RenderContent(string type) { return type == "UnityEditor.SceneView" || type == "UnityEditor.GameView"; }
        internal static bool Supports(string type) { return RenderContent(type) || (GenericWindowHost.Available && GenericWindowHost.ResolveType(type) != null); }
        internal static void ValidateRequest(PreviewRequest request)
        {
            ValidateSize(request);
            if (!Supports(request.windowType))
                throw new NotSupportedException("This editor has no complete GUIView capture API for the requested concrete EditorWindow type");
            if (!string.IsNullOrEmpty(request.captureMode) && request.captureMode != "editor-window" && request.captureMode != "render-content")
                throw new ArgumentException("Unknown editor capture mode");
            if (request.captureMode == "render-content" && !RenderContent(request.windowType)) throw new NotSupportedException("Render-content capture is only available for actual SceneView/GameView");
            if (request.captureMode == "editor-window" && !GenericWindowHost.Available) throw new NotSupportedException("This editor has no complete GUIView capture API");
        }
        static void ValidateSize(PreviewRequest request)
        {
            if (request == null || request.width < 16 || request.height < 16 || request.width > 1920 || request.height > 1080 ||
                (long)request.width * request.height > 1920L * 1080 || float.IsNaN(request.dpr) || float.IsInfinity(request.dpr) || request.dpr < 0.5f || request.dpr > 4)
                throw new ArgumentException("Preview dimensions must be 16..1920 by 16..1080, dpr 0.5..4");
        }
        public void Resize(PreviewRequest request)
        {
            ValidateSize(request);
            width = request.width; height = request.height;
            window.Repaint();
        }
        RenderTexture Source()
        {
            if (window == null) throw new InvalidOperationException("The requested editor window was closed");
            if (gameView)
            {
                FieldInfo field = window.GetType().GetField("m_RenderTexture", InstanceMembers);
                if (field == null) throw new NotSupportedException("This editor version has no compatible GameView render texture");
                return field.GetValue(window) as RenderTexture;
            }
            return scenePixels;
        }
        void SceneRenderedSrp(ScriptableRenderContext context, Camera camera) { SceneRendered(camera); }
        void SceneRendered(Camera camera)
        {
            if (window == null || gameView || camera != ((SceneView)window).camera) return;
            RenderTexture source = camera.targetTexture;
            if (source == null || !source.IsCreated()) return;
            if (scenePixels == null || scenePixels.width != width || scenePixels.height != height)
            {
                if (scenePixels != null) UnityEngine.Object.DestroyImmediate(scenePixels);
                scenePixels = new RenderTexture(width, height, 0, RenderTextureFormat.ARGB32)
                    { hideFlags = HideFlags.HideAndDontSave };
                scenePixels.Create();
            }
            var previous = RenderTexture.active;
            try { sourceWidth = source.width; sourceHeight = source.height; contentRect = FitRect(sourceWidth, sourceHeight, width, height); DrawFit(source, scenePixels, contentRect); sceneGeneration++; }
            finally { RenderTexture.active = previous; }
        }
        internal static Rect FitRect(int sourceWidth, int sourceHeight, int width, int height)
        {
            float scale = Math.Min((float)width / sourceWidth, (float)height / sourceHeight);
            // Float multiplication can exceed a fitted edge by one rounding
            // step. Keep the real content bounds inside the private texture.
            float contentWidth = Math.Min(width, sourceWidth * scale), contentHeight = Math.Min(height, sourceHeight * scale);
            return new Rect((width - contentWidth) / 2, (height - contentHeight) / 2, contentWidth, contentHeight);
        }
        internal static void DrawFit(RenderTexture source, RenderTexture target, Rect rect, bool flipY = false)
        {
            RenderTexture.active = target;
            GL.PushMatrix();
            try
            {
                GL.LoadPixelMatrix(0, target.width, target.height, 0);
                GL.Clear(true, true, Color.black);
                // This draws only into our private RT. It does not resize the
                // Editor window, change camera aspect or game resolution.
                if (flipY) Graphics.DrawTexture(rect, source, new Rect(0, 1, 1, -1), 0, 0, 0, 0);
                else Graphics.DrawTexture(rect, source);
            }
            finally { GL.PopMatrix(); }
        }
        public CapturedFrame ReadFrame(long sequence)
        {
            if (generic != null)
            {
                var frame=generic.ReadFrame(sequence,width,height);
                sourceWidth=frame.SourceWidth;sourceHeight=frame.SourceHeight;contentRect=frame.ContentRect;
                return Stamp(frame);
            }
            window.Repaint();
            if (!gameView) SceneView.RepaintAll();
            RenderTexture source = Source();
            if (source == null || !source.IsCreated()) return null;
            if (!gameView && sceneGeneration == lastReadSceneGeneration) return null;
            if (pixels == null || pixels.width != width || pixels.height != height)
            {
                if (pixels != null) UnityEngine.Object.DestroyImmediate(pixels);
                pixels = new Texture2D(width, height, TextureFormat.RGB24, false) { hideFlags = HideFlags.HideAndDontSave };
            }
            RenderTexture previous = RenderTexture.active;
            var scaled = RenderTexture.GetTemporary(width, height, 0, RenderTextureFormat.ARGB32, RenderTextureReadWrite.Default);
            try
            {
                if (gameView)
                {
                    sourceWidth = source.width; sourceHeight = source.height;
                    contentRect = FitRect(sourceWidth, sourceHeight, width, height);
                    DrawFit(source, scaled, contentRect);
                }
                else Graphics.Blit(source, scaled);
                RenderTexture.active = scaled;
                pixels.ReadPixels(new Rect(0, 0, width, height), 0, 0, false);
                pixels.Apply(false, false);
                byte[] encoded = pixels.EncodeToJPG(75);
                if (encoded.Length > 2 * 1024 * 1024) throw new InvalidOperationException("Encoded editor frame exceeds 2 MiB");
                lastReadSceneGeneration = sceneGeneration;
                return Stamp(new CapturedFrame { Bytes = encoded, Width = width, Height = height, Sequence = sequence,
                    SourceWidth = sourceWidth, SourceHeight = sourceHeight, ContentRect = contentRect,
                    CaptureMode = "render-content", CaptureBackend = "unity-render-texture", IncludesToolbar = false, PixelsPerPoint = EditorGUIUtility.pixelsPerPoint });
            }
            finally { RenderTexture.active = previous; RenderTexture.ReleaseTemporary(scaled); }
        }
        public void Input(InputRequest input)
        {
            if (input == null) throw new ArgumentException("Input is required");
            if (window == null) throw new InvalidOperationException("The requested editor window was closed");
            ValidateInputIdentity(input);
            if (lease.InputOwner != null && lease.InputOwner != this && (lease.InputOwner.heldKeys.Count != 0 || lease.InputOwner.heldButtons.Count != 0))
                throw new InvalidOperationException("Another preview capture still holds input on this actual EditorWindow");
            var ev = new Event();
            switch (input.type)
            {
                case "mousedown": ev.type = EventType.MouseDown; break;
                case "mouseup": ev.type = EventType.MouseUp; break;
                case "mousemove": ev.type = EventType.MouseMove; break;
                case "mousedrag": ev.type = EventType.MouseDrag; break;
                case "scroll": case "wheel": ev.type = EventType.ScrollWheel; ev.delta = new Vector2(input.deltaX, input.deltaY) / 20f; break;
                case "keydown": ev.type = EventType.KeyDown; break;
                case "keyup": ev.type = EventType.KeyUp; break;
                default: throw new NotSupportedException("Unsupported editor input type: " + input.type);
            }
            bool mouseButtonEvent = ev.type == EventType.MouseDown || ev.type == EventType.MouseUp || ev.type == EventType.MouseDrag;
            if ((mouseButtonEvent && (input.button < 0 || input.button > 2)) || float.IsNaN(input.x) || float.IsNaN(input.y) ||
                float.IsInfinity(input.x) || float.IsInfinity(input.y) || Math.Abs(input.x) > 1920 || Math.Abs(input.y) > 1080)
                throw new ArgumentException("Input coordinates or button are invalid");
            if (input.shift) ev.modifiers |= EventModifiers.Shift;
            if (input.ctrl) ev.modifiers |= EventModifiers.Control;
            if (input.alt) ev.modifiers |= EventModifiers.Alt;
            if (input.meta) ev.modifiers |= EventModifiers.Command;
            ev.button = mouseButtonEvent ? input.button : 0;
            bool keyEvent = ev.type == EventType.KeyDown || ev.type == EventType.KeyUp;
            if (!keyEvent && !contentRect.Contains(new Vector2(input.x, input.y)))
            {
                if (ev.type == EventType.MouseMove) return;
                if (ev.type == EventType.MouseUp && heldButtons.Contains(ev.button))
                { window.SendEvent(new Event { type = EventType.MouseUp, button = ev.button, mousePosition = lastMouse }); heldButtons.Remove(ev.button); return; }
                throw new ArgumentException("Pointer is outside the rendered editor content");
            }
            Rect target = new Rect(0, EditorGUIUtility.singleLineHeight + 3, window.position.width, Math.Max(1, window.position.height - EditorGUIUtility.singleLineHeight - 3));
            if (generic != null)
            {
                var mapped=generic.MapInput(new Vector2(input.x,input.y));
                if (!keyEvent && !generic.Geometry.InWindow(mapped))
                {
                    if (ev.type == EventType.MouseMove) return;
                    if (ev.type == EventType.MouseUp && heldButtons.Contains(ev.button)) mapped=lastMouse;
                    else throw new NotSupportedException("Dock tab/header input is not implemented for this GUIView host");
                }
                target=new Rect(0,0,window.position.width,window.position.height);
                ev.mousePosition=mapped;
            }
            else if (gameView)
            {
                PropertyInfo viewProperty = window.GetType().GetProperty("viewInWindow", InstanceMembers);
                PropertyInfo targetProperty = window.GetType().GetProperty("targetInView", InstanceMembers);
                if (viewProperty == null || targetProperty == null) throw new NotSupportedException("This editor's GameView input mapping is unavailable");
                Rect view = (Rect)viewProperty.GetValue(window, null);
                target = (Rect)targetProperty.GetValue(window, null);
                target.position += view.position;
            }
            else
            {
                Rect viewport = ((SceneView)window).cameraViewport;
                if (viewport.width > 0 && viewport.height > 0) target = viewport;
            }
            if (generic == null) ev.mousePosition = new Vector2(target.x + Mathf.Clamp((input.x - contentRect.x) / contentRect.width, 0, 1) * target.width,
                target.y + Mathf.Clamp((input.y - contentRect.y) / contentRect.height, 0, 1) * target.height);
            if (ev.isKey)
            {
                ev.keyCode = Key(input.key, input.code);
                if (input.key != null && input.key.Length == 1) ev.character = input.key[0];
                if (ev.type == EventType.KeyDown) heldKeys.Add(ev.keyCode);
                else heldKeys.Remove(ev.keyCode);
            }
            if (ev.type == EventType.MouseDown) heldButtons.Add(ev.button);
            else if (ev.type == EventType.MouseUp) heldButtons.Remove(ev.button);
            lastMouse = ev.mousePosition;
            lease.InputOwner = this;
            window.Focus();
            window.SendEvent(ev);
            window.Repaint();
        }
        static string Number(float value) { return value.ToString("R",System.Globalization.CultureInfo.InvariantCulture); }
        static string MappingRect(Rect rect) { return Number(rect.x)+","+Number(rect.y)+","+Number(rect.width)+","+Number(rect.height); }
        Rect RenderInputTarget()
        {
            if(gameView)
            {
                var viewProperty=window.GetType().GetProperty("viewInWindow",InstanceMembers);
                var targetProperty=window.GetType().GetProperty("targetInView",InstanceMembers);
                if(viewProperty==null||targetProperty==null)throw new NotSupportedException("This editor's GameView input mapping is unavailable");
                var view=(Rect)viewProperty.GetValue(window,null);var target=(Rect)targetProperty.GetValue(window,null);target.position+=view.position;return target;
            }
            var viewport=((SceneView)window).cameraViewport;
            return viewport.width>0&&viewport.height>0?viewport:new Rect(0,EditorGUIUtility.singleLineHeight+3,window.position.width,Math.Max(1,window.position.height-EditorGUIUtility.singleLineHeight-3));
        }
        string Mapping(CapturedFrame frame)
        {
            string value=frame.Width+","+frame.Height+","+frame.SourceWidth+","+frame.SourceHeight+","+MappingRect(frame.ContentRect)+","+Number(EditorGUIUtility.pixelsPerPoint)+","+Number(window.position.width)+","+Number(window.position.height);
            if(generic!=null)
            {
                var g=generic.Geometry;
                value+=","+g.ViewInstanceId+","+MappingRect(g.ViewScreenRect)+","+MappingRect(g.WindowScreenRect)+","+MappingRect(g.WindowContentRect);
            }
            else
            {
                var parentField=typeof(EditorWindow).GetField("m_Parent",InstanceMembers);var parent=parentField==null?null:parentField.GetValue(window);
                var screen=parent==null?null:parent.GetType().GetProperty("screenPosition",InstanceMembers);
                if(screen!=null)value+=","+MappingRect((Rect)screen.GetValue(parent,null));
                value+=","+MappingRect(RenderInputTarget());
            }
            return value;
        }
        CapturedFrame Stamp(CapturedFrame frame)
        {
            string next=Mapping(frame);
            if(next!=lastMapping)
            {
                if(lastMapping!=null)ReleaseHeldInput();
                geometryRevision=checked(geometryRevision+1);lastMapping=next;
            }
            frame.CaptureEpoch=captureEpoch;frame.GeometryRevision=geometryRevision;frame.InstanceId=InstanceId;lastFrame=frame;return frame;
        }
        void ReleaseHeldInput()
        {
            if(window!=null && lease.InputOwner==this)
            {
                // Cancel the original held interaction in its original window.
                // MouseUp outside every content rectangle clears capture without
                // converting a resize into a button click at a new coordinate.
                foreach(var button in heldButtons)window.SendEvent(new Event{type=EventType.MouseUp,button=button,mousePosition=new Vector2(-100000,-100000)});
                foreach(var key in heldKeys)window.SendEvent(new Event{type=EventType.KeyUp,keyCode=key});
                window.Repaint();
            }
            heldButtons.Clear();heldKeys.Clear();
            if(lease.InputOwner==this)lease.InputOwner=null;
        }
        internal void ValidateInputIdentity(InputRequest input)
        {
            if(disposed||window==null)throw new InvalidOperationException("The requested editor capture is no longer active");
            if(string.IsNullOrEmpty(input.captureEpoch)||input.geometryRevision<1||input.instanceId==0)
                throw new ArgumentException("Editor input requires captureEpoch, geometryRevision and the signed instanceId from a current real frame; refresh the preview client");
            if(input.captureEpoch!=captureEpoch || input.instanceId!=InstanceId)
                throw new InvalidOperationException("Editor input belongs to a replaced capture or different window instance");
            string currentMapping=lastFrame==null?null:Mapping(lastFrame);
            if(lastFrame==null || input.geometryRevision!=geometryRevision || width!=lastFrame.Width || height!=lastFrame.Height || sourceWidth!=lastFrame.SourceWidth || sourceHeight!=lastFrame.SourceHeight || currentMapping!=lastMapping)
                throw new InvalidOperationException("Editor input geometry is stale; wait for and use a current captured frame");
            if(generic!=null)generic.MapInput(new Vector2(input.x,input.y));
        }
        static KeyCode Key(string key, string code)
        {
            string value = key ?? "";
            if (value.Length == 1 && char.IsLetterOrDigit(value[0])) value = char.IsDigit(value[0]) ? "Alpha" + value : value.ToUpperInvariant();
            switch (value)
            {
                case " ": value = "Space"; break;
                case "Enter": value = "Return"; break;
                case "ArrowUp": value = "UpArrow"; break;
                case "ArrowDown": value = "DownArrow"; break;
                case "ArrowLeft": value = "LeftArrow"; break;
                case "ArrowRight": value = "RightArrow"; break;
                case "Control": value = code == "ControlRight" ? "RightControl" : "LeftControl"; break;
                case "Shift": value = code == "ShiftRight" ? "RightShift" : "LeftShift"; break;
                case "Alt": value = code == "AltRight" ? "RightAlt" : "LeftAlt"; break;
                case "Meta": value = code == "MetaRight" ? "RightCommand" : "LeftCommand"; break;
            }
            KeyCode result;
            if (!Enum.TryParse(value, true, out result)) throw new NotSupportedException("Unsupported editor key: " + key);
            return result;
        }
        public void Dispose() { Dispose(true); }
        public void Dispose(bool closeCreatedWindow)
        {
            if (disposed) return;
            disposed = true;
            ReleaseHeldInput();
            if (generic != null) generic.Dispose();
            if (!gameView && generic == null)
            {
                Camera.onPostRender -= SceneRendered;
                RenderPipelineManager.endCameraRendering -= SceneRenderedSrp;
            }
            if (pixels != null) UnityEngine.Object.DestroyImmediate(pixels);
            pixels = null;
            if (scenePixels != null) UnityEngine.Object.DestroyImmediate(scenePixels);
            scenePixels = null;
            lease.References--;
            if (lease.References == 0 && (closeCreatedWindow || !lease.Owned || lease.Window == null))
            {
                if (closeCreatedWindow && lease.Owned && lease.Window != null) lease.Window.Close();
                WindowLeases.Remove(lease.InstanceId);
            }
        }
        sealed class WindowLease { public EditorWindow Window; public bool Owned; public int References, InstanceId; public EditorCapture InputOwner; }
        public static string WindowsJson()
        {
            var output = new StringBuilder("[");
            var seen = new HashSet<int>();
            foreach (var window in Resources.FindObjectsOfTypeAll<EditorWindow>())
            {
                if (window == null || !seen.Add(window.GetInstanceID())) continue;
                if (output.Length > 1) output.Append(',');
                string type = window.GetType().FullName;
                output.Append("{\"title\":").Append(Bridge.Json(window.titleContent.text)).Append(",\"typeName\":")
                    .Append(Bridge.Json(type)).Append(",\"instanceId\":").Append(window.GetInstanceID())
                    .Append(",\"captureSupported\":").Append(Supports(type) ? "true" : "false")
                    .Append(",\"captureModes\":[").Append(RenderContent(type) ? "\"render-content\"" : "")
                    .Append(GenericWindowHost.Available ? (RenderContent(type) ? ",\"editor-window\"" : "\"editor-window\"") : "")
                    .Append("],\"fullWindowSupported\":").Append(GenericWindowHost.Available ? "true" : "false").Append('}');
            }
            return output.Append(']').ToString();
        }
    }
}
