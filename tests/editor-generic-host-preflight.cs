using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

// Runs only in an isolated, caller-owned test project. This is not a product panel.
public static class GameCoworkGenericHostPreflight
{
    const BindingFlags Flags = BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;
    static string root;
    static EditorWindow hierarchy, inspector;
    static GameCoworkGenericProbeWindow fifth;
    static double started, next;
    static int phase;
    static readonly System.Collections.Generic.List<string> facts = new System.Collections.Generic.List<string>();
    public static void Boot()
    {
        root = Path.GetFullPath(Path.Combine(Application.dataPath, "..")).Replace('\\', '/');
        if (!root.StartsWith("F:/AI/AgentMake/temp/GameCowork/tests/editor-bridge-generic-", StringComparison.OrdinalIgnoreCase)) throw new InvalidOperationException("Own fixture path required");
        EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        new GameObject("Owned Alpha"); new GameObject("Owned Beta");
        var asm = typeof(EditorWindow).Assembly;
        hierarchy = ScriptableObject.CreateInstance(asm.GetType("UnityEditor.SceneHierarchyWindow", true)) as EditorWindow;
        inspector = ScriptableObject.CreateInstance(asm.GetType("UnityEditor.InspectorWindow", true)) as EditorWindow;
        fifth = ScriptableObject.CreateInstance<GameCoworkGenericProbeWindow>();
        hierarchy.ShowUtility(); inspector.ShowUtility(); fifth.ShowUtility();
        hierarchy.position = new Rect(80, 90, 360, 520); inspector.position = new Rect(460, 90, 360, 520); fifth.position = new Rect(840, 90, 320, 380);
        Selection.activeGameObject = GameObject.Find("Owned Alpha");
        started = EditorApplication.timeSinceStartup; next = started + 3;
        EditorApplication.update += Tick;
    }
    static void Fact(string key, string value) { facts.Add("\""+key+"\":"+value); }
    static string Q(string s) { return "\""+(s ?? "").Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\r", " ").Replace("\n", " ")+"\""; }
    static void Capture(EditorWindow window, string name)
    {
        var parent = typeof(EditorWindow).GetField("m_Parent", Flags).GetValue(window);
        var type = parent.GetType();
        var screen = (Rect)type.GetProperty("screenPosition", Flags).GetValue(parent, null);
        var grab = type.GetMethod("GrabPixels", Flags, null, new [] { typeof(RenderTexture), typeof(Rect) }, null);
        if (grab == null) throw new NotSupportedException("Real GUIView.GrabPixels unavailable");
        float dpi = EditorGUIUtility.pixelsPerPoint;
        int w = Mathf.RoundToInt(screen.width*dpi), h = Mathf.RoundToInt(screen.height*dpi);
        if (w<16 || h<16 || w>4096 || h>4096) throw new InvalidOperationException("Actual GUIView dimensions unavailable");
        var target = new RenderTexture(w,h,0,RenderTextureFormat.BGRA32,RenderTextureReadWrite.Linear);
        var readback = new Texture2D(w,h,TextureFormat.RGBA32,false,true); target.Create();
        var prior = RenderTexture.active;
        try {
            RenderTexture.active=target; GL.Clear(true,true,new Color(1,0,1,0));
            grab.Invoke(parent,new object[]{target,new Rect(0,0,w,h)});
            RenderTexture.active=target; readback.ReadPixels(new Rect(0,0,w,h),0,0);readback.Apply(false,false);
            var colors=readback.GetPixels32(); int occupied=0, different=0; var first=colors[0];
            foreach(var color in colors) { if(color.a>0)occupied++;if(color.r!=first.r || color.g!=first.g || color.b!=first.b)different++; }
            Fact(name,"{\"instanceId\":"+window.GetInstanceID()+",\"width\":"+w+",\"height\":"+h+",\"dpi\":"+dpi.ToString(System.Globalization.CultureInfo.InvariantCulture)+",\"occupied\":"+occupied+",\"different\":"+different+",\"parent\":"+Q(type.FullName)+",\"heightOffset\":"+(screen.height-window.position.height).ToString(System.Globalization.CultureInfo.InvariantCulture)+"}");
            File.WriteAllBytes(Path.GetDirectoryName(root)+"/"+name+".png",readback.EncodeToPNG());
            if(occupied<colors.Length/2 || different<colors.Length/100)throw new InvalidOperationException(name+" did not produce actual populated GUIView pixels");
        } finally { RenderTexture.active=prior;UnityEngine.Object.DestroyImmediate(readback);target.Release();UnityEngine.Object.DestroyImmediate(target); }
    }
    static void Tick()
    {
        if(File.Exists(root+"/Temp/request-exit") || EditorApplication.timeSinceStartup-started>90) { EditorApplication.Exit(0);return; }
        hierarchy.Repaint();inspector.Repaint();fifth.Repaint();
        if(EditorApplication.timeSinceStartup<next)return;
        next=EditorApplication.timeSinceStartup+1;
        try {
            if(phase==0) {Capture(hierarchy,"hierarchy");Capture(inspector,"inspector");Capture(fifth,"custom-fifth");
                fifth.Focus();fifth.SendEvent(new Event {type=EventType.MouseDown,button=0,mousePosition=new Vector2(100,75)});fifth.SendEvent(new Event {type=EventType.MouseUp,button=0,mousePosition=new Vector2(100,75)});phase++;return;}
            if(phase==1) {Fact("customInput",fifth.Clicks.ToString()); if(fifth.Clicks!=1)throw new InvalidOperationException("Fifth actual EditorWindow SendEvent did not execute");
                hierarchy.Focus();hierarchy.SendEvent(new Event{type=EventType.MouseDown,button=0,mousePosition=new Vector2(140,70)});hierarchy.SendEvent(new Event{type=EventType.MouseUp,button=0,mousePosition=new Vector2(140,70)});phase++;return;}
            if(phase==2) {Fact("hierarchySelection",Q(Selection.activeGameObject==null?null:Selection.activeGameObject.name));
                var parent=typeof(EditorWindow).GetField("m_Parent",Flags).GetValue(hierarchy);Fact("hierarchyFields",Q(string.Join(",",Array.ConvertAll(hierarchy.GetType().GetFields(Flags),f=>f.Name+":"+f.FieldType.Name))));
                Fact("success","true");Write();phase++;return;}
        } catch(Exception error){Fact("success","false");Fact("error",Q(error.ToString()));Write();phase=3;}
    }
    static void Write(){File.WriteAllText(root+"/Temp/generic-preflight.json","{\"pid\":"+Process.GetCurrentProcess().Id+",\"projectRoot\":"+Q(root)+",\"version\":"+Q(Application.unityVersion)+","+string.Join(",",facts.ToArray())+"}");}
}
public sealed class GameCoworkGenericProbeWindow : EditorWindow
{
    public int Clicks;
    void OnGUI(){EditorGUI.DrawRect(new Rect(0,0,position.width,24),Color.green);GUI.Label(new Rect(10,2,250,20),"Actual fifth EditorWindow toolbar");if(GUI.Button(new Rect(20,60,230,32),"Increment real window state"))Clicks++;GUI.Label(new Rect(20,110,250,20),"Input count: "+Clicks);}
}
