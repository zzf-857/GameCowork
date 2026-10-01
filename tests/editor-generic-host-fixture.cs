using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

public static class GameCoworkGenericHostFixture
{
    static string root;
    static double started;
    public static EditorWindow Hierarchy, Inspector;
    public static GameCoworkGenericActualWindow Fifth;
    static GameObject alpha,beta;
    [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)]static extern bool MoveFileEx(string from,string to,uint flags);
    static void Write(string relative,string text){var target=root+"/Temp/"+relative;File.WriteAllText(target+".writing",text);if(!MoveFileEx(target+".writing",target,1|8))throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());}
    static string Q(string value){return "\""+(value??"").Replace("\\","\\\\").Replace("\"","\\\"")+"\"";}
    public static string Root {get{return root;}}
    public static void Boot()
    {
        root=Path.GetFullPath(Path.Combine(Application.dataPath,"..")).Replace('\\','/');
        if(!root.StartsWith("F:/AI/AgentMake/temp/GameCowork/tests/editor-bridge-generic-",StringComparison.OrdinalIgnoreCase))throw new InvalidOperationException("Owned project required");
        EditorSceneManager.NewScene(NewSceneSetup.EmptyScene,NewSceneMode.Single);
        alpha=new GameObject("Owned Alpha");beta=new GameObject("Owned Beta");
        var asm=typeof(EditorWindow).Assembly;
        Hierarchy=ScriptableObject.CreateInstance(asm.GetType("UnityEditor.SceneHierarchyWindow",true)) as EditorWindow;
        Inspector=ScriptableObject.CreateInstance(asm.GetType("UnityEditor.InspectorWindow",true)) as EditorWindow;
        Fifth=ScriptableObject.CreateInstance<GameCoworkGenericActualWindow>();
        Hierarchy.ShowUtility();Inspector.ShowUtility();Fifth.ShowUtility();
        Hierarchy.position=new Rect(80,90,360,520);Inspector.position=new Rect(460,90,360,560);Fifth.position=new Rect(840,90,320,380);
        Selection.activeGameObject=alpha;started=EditorApplication.timeSinceStartup;EditorApplication.update+=Tick;
        Write("generic-ready.json","{\"pid\":"+Process.GetCurrentProcess().Id+",\"hierarchyId\":"+Hierarchy.GetInstanceID()+",\"inspectorId\":"+Inspector.GetInstanceID()+",\"fifthId\":"+Fifth.GetInstanceID()+",\"alphaId\":"+alpha.GetInstanceID()+",\"betaId\":"+beta.GetInstanceID()+"}");
    }
    static void Tick()
    {
        if(File.Exists(root+"/Temp/request-exit")||EditorApplication.timeSinceStartup-started>480){EditorApplication.Exit(0);return;}
        if(File.Exists(root+"/Temp/request-select-beta")){File.Delete(root+"/Temp/request-select-beta");Selection.activeGameObject=beta;}
        if(File.Exists(root+"/Temp/request-select-alpha")){File.Delete(root+"/Temp/request-select-alpha");Selection.activeGameObject=alpha;}
        if(File.Exists(root+"/Temp/request-close-fifth")){File.Delete(root+"/Temp/request-close-fifth");Fifth.Close();Fifth=null;Write("fifth-closed","true");}
        if(File.Exists(root+"/Temp/request-close-window")){int id=int.Parse(File.ReadAllText(root+"/Temp/request-close-window"));File.Delete(root+"/Temp/request-close-window");foreach(var candidate in Resources.FindObjectsOfTypeAll<EditorWindow>())if(candidate.GetInstanceID()==id){candidate.Close();Write("window-closed",id.ToString());break;}}
        if(File.Exists(root+"/Temp/request-resize-hierarchy")){File.Delete(root+"/Temp/request-resize-hierarchy");Hierarchy.position=new Rect(80,90,520,420);}
        var windows=new System.Collections.Generic.List<string>();foreach(var current in Resources.FindObjectsOfTypeAll<GameCoworkGenericActualWindow>())windows.Add("{\"instanceId\":"+current.GetInstanceID()+",\"clicks\":"+current.Clicks+"}");
        Write("generic-observed.json","{\"selection\":"+Q(Selection.activeGameObject==null?null:Selection.activeGameObject.name)+",\"alphaX\":"+alpha.transform.localPosition.x.ToString("R",System.Globalization.CultureInfo.InvariantCulture)+",\"betaX\":"+beta.transform.localPosition.x.ToString("R",System.Globalization.CultureInfo.InvariantCulture)+",\"fifthClicks\":"+(Fifth==null?-1:Fifth.Clicks)+",\"dpi\":"+EditorGUIUtility.pixelsPerPoint.ToString("R",System.Globalization.CultureInfo.InvariantCulture)+",\"customWindows\":["+string.Join(",",windows.ToArray())+"]}");
        if(Hierarchy!=null)Hierarchy.Repaint();if(Inspector!=null)Inspector.Repaint();if(Fifth!=null)Fifth.Repaint();
    }
    public static void RecordInspectorButton(Rect screen,string targetName)
    {
        if(root==null || Inspector==null)return;var pos=Inspector.position;if(!pos.Contains(screen.center))return;
        Write("inspector-input.json","{\"targetName\":"+Q(targetName)+",\"x\":"+(screen.center.x-pos.x).ToString("R",System.Globalization.CultureInfo.InvariantCulture)+",\"y\":"+(screen.center.y-pos.y).ToString("R",System.Globalization.CultureInfo.InvariantCulture)+"}");
    }
}
[CustomEditor(typeof(Transform))]
public sealed class GameCoworkGenericFixtureTransformInspector:Editor
{
    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();
        if(GUILayout.Button("Owned fixture increment serialized X"))
        {serializedObject.Update();var value=serializedObject.FindProperty("m_LocalPosition");var position=value.vector3Value;position.x+=1;value.vector3Value=position;serializedObject.ApplyModifiedProperties();}
        if(Event.current.type==EventType.Repaint){var rect=GUILayoutUtility.GetLastRect();var point=GUIUtility.GUIToScreenPoint(rect.position);GameCoworkGenericHostFixture.RecordInspectorButton(new Rect(point,rect.size),target.name);}
    }
}
public sealed class GameCoworkGenericActualWindow:EditorWindow
{
    public int Clicks;
    void OnGUI(){EditorGUI.DrawRect(new Rect(0,0,position.width,24),Color.green);GUI.Label(new Rect(10,2,270,20),"Actual fifth EditorWindow toolbar");if(GUI.Button(new Rect(20,60,230,32),"Increment real window state"))Clicks++;GUI.Label(new Rect(20,110,250,20),"Input count: "+Clicks);}
}
