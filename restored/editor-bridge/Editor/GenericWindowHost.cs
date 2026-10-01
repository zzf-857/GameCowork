using System;
using System.Reflection;
using UnityEditor;
using UnityEngine;

namespace GameCowork.EditorBridge
{
    // Own C# host for any concrete EditorWindow with the real GUIView API.
    // Source reference: cn.tuanjie.codely.bridge@1.0.85 NativeWindowBridgeHost
    // TryCaptureViaGUIView/ComputeTabBarOffset. No original native DLL is loaded.
    internal sealed class GenericWindowHost : IDisposable
    {
        const BindingFlags Members = BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;
        static readonly FieldInfo Parent = typeof(EditorWindow).GetField("m_Parent", Members);
        readonly EditorWindow window;
        RenderTexture source, scaled;
        Texture2D pixels;
        bool disposed;
        string lastSelection;
        public FrameGeometry Geometry { get; private set; }
        public GenericWindowHost(EditorWindow target) { window=target;Geometry=new FrameGeometry(); }
        internal static Type ResolveType(string name)
        {
            if (string.IsNullOrEmpty(name) || name.Length > 512) return null;
            foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
            {
                var type=assembly.GetType(name,false);
                if (type!=null && typeof(EditorWindow).IsAssignableFrom(type) && !type.IsAbstract && !type.ContainsGenericParameters) return type;
            }
            return null;
        }
        internal static bool Available
        {
            get { var type=typeof(EditorWindow).Assembly.GetType("UnityEditor.GUIView",false);return Parent!=null && type!=null && Grab(type)!=null; }
        }
        static MethodInfo Grab(Type type) { return type.GetMethod("GrabPixels",Members,null,new[]{typeof(RenderTexture),typeof(Rect)},null); }
        object View()
        {
            if(window==null)throw new InvalidOperationException("The requested editor window was closed");
            var view=Parent==null?null:Parent.GetValue(window);
            if(view==null)throw new NotSupportedException("The selected EditorWindow has no live GUIView");
            var active=view.GetType().GetProperty("actualView",Members);
            if(active!=null && active.GetValue(view,null) as EditorWindow != window)
                throw new InvalidOperationException("The selected EditorWindow is not the active tab of its GUIView");
            return view;
        }
        public Vector2 MapInput(Vector2 output)
        {
            var view=View();var screen=view.GetType().GetProperty("screenPosition",Members);
            if(screen==null)throw new NotSupportedException("This editor's actual GUIView geometry is unavailable");
            var current=(Rect)screen.GetValue(view,null);var content=window.position;
            float offsetY=Mathf.Clamp(current.height-content.height,0,100),offsetX=Mathf.Clamp(current.width-content.width,0,100)*.5f;
            var currentWindowScreen=new Rect(current.x+offsetX,current.y+offsetY,content.width,content.height);
            if((view as UnityEngine.Object)==null || (view as UnityEngine.Object).GetInstanceID()!=Geometry.ViewInstanceId ||
                Math.Abs(current.x-Geometry.ViewScreenRect.x)>.1f || Math.Abs(current.y-Geometry.ViewScreenRect.y)>.1f ||
                Math.Abs(currentWindowScreen.x-Geometry.WindowScreenRect.x)>.1f || Math.Abs(currentWindowScreen.y-Geometry.WindowScreenRect.y)>.1f ||
                Math.Abs(current.width-Geometry.ViewScreenRect.width)>.1f || Math.Abs(current.height-Geometry.ViewScreenRect.height)>.1f ||
                Math.Abs(content.width-Geometry.WindowContentRect.width)>.1f || Math.Abs(content.height-Geometry.WindowContentRect.height)>.1f ||
                Math.Abs(EditorGUIUtility.pixelsPerPoint-Geometry.PixelsPerPoint)>.001f)
                throw new InvalidOperationException("Actual editor geometry changed; wait for a current captured frame before input");
            return Geometry.ToWindow(output);
        }
        public CapturedFrame ReadFrame(long sequence,int width,int height)
        {
            if(disposed)throw new ObjectDisposedException("GenericWindowHost");
            var view=View();var type=view.GetType();
            SynchronizeSelection();
            var screenProperty=type.GetProperty("screenPosition",Members);
            var grab=Grab(type);
            if(screenProperty==null || grab==null)throw new NotSupportedException("This editor's complete GUIView capture API is unavailable");
            var rect=(Rect)screenProperty.GetValue(view,null);float dpi=EditorGUIUtility.pixelsPerPoint;
            if(float.IsNaN(dpi)||float.IsInfinity(dpi)||dpi<.5f||dpi>4 || rect.width<16||rect.height<16 ||
                float.IsNaN(rect.width+rect.height)||float.IsInfinity(rect.width+rect.height)||rect.width*dpi>8192||rect.height*dpi>8192)
                throw new InvalidOperationException("The selected GUIView has not completed a finite layout");
            int sw=Mathf.RoundToInt(rect.width*dpi),sh=Mathf.RoundToInt(rect.height*dpi);
            if(sw>8192||sh>8192||(long)sw*sh>32L*1024*1024)throw new InvalidOperationException("The actual GUIView exceeds the bounded capture dimensions");
            EnsureSource(sw,sh);EnsureOutput(width,height);
            var position=window.position;
            float offsetY=Mathf.Clamp(rect.height-position.height,0,100);
            float offsetX=Mathf.Clamp(rect.width-position.width,0,100)*.5f;
            // EditorWindow.position x/y may be GUIView-local during GrabPixels
            // and screen-relative outside its GUI context. The actual GUIView
            // screen rectangle plus content offset is the stable screen mapping.
            var geometry=new FrameGeometry {SourceWidth=sw,SourceHeight=sh,PixelsPerPoint=dpi,ViewScreenRect=rect,
                WindowScreenRect=new Rect(rect.x+offsetX,rect.y+offsetY,position.width,position.height),
                ViewInstanceId=(view as UnityEngine.Object)==null?0:(view as UnityEngine.Object).GetInstanceID(),
                WindowContentRect=new Rect(offsetX,offsetY,position.width,position.height),OutputContentRect=EditorCapture.FitRect(sw,sh,width,height)};
            window.Repaint();
            var prior=RenderTexture.active;
            try {
                // Clear first so an unpainted/native-unavailable read cannot
                // silently reuse a prior valid window's pixels.
                RenderTexture.active=source;GL.Clear(true,true,Color.clear);
                grab.Invoke(view,new object[]{source,new Rect(0,0,sw,sh)});
                pixels.ReadPixels(new Rect(sw/2,sh/2,1,1),0,0,false);pixels.Apply(false,false);
                if(pixels.GetPixel(0,0).a<.5f)throw new InvalidOperationException("The actual GUIView has not painted a valid backbuffer yet");
                // GUIView.GrabPixels' D3D backbuffer has the opposite vertical
                // origin from our encoded image. Camera fallback is unchanged.
                EditorCapture.DrawFit(source,scaled,geometry.OutputContentRect,true);
                RenderTexture.active=scaled;pixels.ReadPixels(new Rect(0,0,width,height),0,0,false);pixels.Apply(false,false);
                var encoded=pixels.EncodeToJPG(75);
                if(encoded.Length>2*1024*1024)throw new InvalidOperationException("Encoded editor frame exceeds 2 MiB");
                Geometry=geometry;
                return new CapturedFrame {Bytes=encoded,Width=width,Height=height,Sequence=sequence,SourceWidth=sw,SourceHeight=sh,
                    ContentRect=geometry.OutputContentRect,CaptureMode="editor-window",CaptureBackend="unity-guiview",IncludesToolbar=true,
                    PixelsPerPoint=dpi,WindowContentRect=geometry.WindowContentRect};
            } catch(TargetInvocationException error) {throw new InvalidOperationException("Actual GUIView capture failed: "+(error.InnerException??error).Message,error.InnerException??error);}
            finally {RenderTexture.active=prior;}
        }
        void SynchronizeSelection()
        {
            string current=Selection.activeInstanceID+":"+string.Join(",",Array.ConvertAll(Selection.instanceIDs,id=>id.ToString()));
            if(current==lastSelection)return;
            // SendEvent selection changes may reach the capture loop before
            // Unity's deferred inspector tracker notification. Synchronize
            // only this streamed real window, preserving locked trackers.
            FieldInfo trackerField=null;
            for(Type type=window.GetType();type!=null && trackerField==null;type=type.BaseType)
                trackerField=type.GetField("m_Tracker",Members|BindingFlags.DeclaredOnly);
            if(trackerField!=null)
            {
                var tracker=trackerField.GetValue(window) as ActiveEditorTracker;
                if(tracker!=null && !tracker.isLocked)tracker.ForceRebuild();
            }
            MethodInfo handler=null;
            foreach(string name in new[]{"OnSelectionChange","OnSelectionChanged"})
            {
                for(Type type=window.GetType();type!=null && handler==null;type=type.BaseType)
                    handler=type.GetMethod(name,Members|BindingFlags.DeclaredOnly,null,Type.EmptyTypes,null);
                if(handler!=null)break;
            }
            if(handler!=null)handler.Invoke(window,null);
            lastSelection=current;window.Repaint();EditorApplication.QueuePlayerLoopUpdate();
        }
        void EnsureSource(int width,int height)
        {
            if(source!=null && source.width==width && source.height==height)return;
            Destroy(ref source);source=new RenderTexture(width,height,0,RenderTextureFormat.BGRA32,RenderTextureReadWrite.Linear)
                {name="GameCowork own GUIView capture",hideFlags=HideFlags.HideAndDontSave,useMipMap=false,autoGenerateMips=false};source.Create();
        }
        void EnsureOutput(int width,int height)
        {
            if(scaled!=null && scaled.width==width && scaled.height==height)return;
            Destroy(ref scaled);if(pixels!=null)UnityEngine.Object.DestroyImmediate(pixels);
            scaled=new RenderTexture(width,height,0,RenderTextureFormat.ARGB32,RenderTextureReadWrite.Linear){hideFlags=HideFlags.HideAndDontSave};scaled.Create();
            pixels=new Texture2D(width,height,TextureFormat.RGBA32,false,true){hideFlags=HideFlags.HideAndDontSave};
        }
        static void Destroy(ref RenderTexture texture) {if(texture==null)return;texture.Release();UnityEngine.Object.DestroyImmediate(texture);texture=null;}
        public void Dispose() {if(disposed)return;disposed=true;Destroy(ref source);Destroy(ref scaled);if(pixels!=null)UnityEngine.Object.DestroyImmediate(pixels);pixels=null;}
    }
}
