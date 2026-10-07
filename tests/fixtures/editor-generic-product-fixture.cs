using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

// Only copied to a unique owned temp project. Observations come from actual
// Selection/Transform and actual GUIView.current/HostView.actualView; no Scene,
// window identity, input coordinates, or serialized effect is simulated.
public static class GameCoworkGenericProductFixture
{
    static string root;
    static double started;
    static GameObject alpha, beta;
    static readonly HashSet<int> initializedHierarchy = new HashSet<int>();
    static readonly BindingFlags Members = BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance;
    [DllImport("kernel32.dll", CharSet=CharSet.Unicode, SetLastError=true)] static extern bool MoveFileEx(string from,string to,uint flags);
    static string Q(string text) { return "\""+(text??"").Replace("\\","\\\\").Replace("\"","\\\"")+"\""; }
    static string F(float value) { return value.ToString("R",CultureInfo.InvariantCulture); }
    static void Write(string name,string text) { var path=root+"/Temp/"+name;File.WriteAllText(path+".writing",text);if(!MoveFileEx(path+".writing",path,1|8))throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error()); }
    public static void Boot()
    {
        root=Path.GetFullPath(Path.Combine(Application.dataPath,"..")).Replace('\\','/');
        if(!root.StartsWith("F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests/editor-bridge-generic-product-",StringComparison.OrdinalIgnoreCase))throw new InvalidOperationException("Owned product fixture required");
        EditorSceneManager.NewScene(NewSceneSetup.EmptyScene,NewSceneMode.Single);
        alpha=new GameObject("Owned Alpha");beta=new GameObject("Owned Beta");
        bool tuanjie=File.ReadAllText(root+"/ProjectSettings/ProjectVersion.txt").Contains("m_TuanjieEditorVersion:");
        EditorSceneManager.SaveScene(EditorSceneManager.GetActiveScene(),root+"/Assets/generic-product."+(tuanjie?"scene":"unity"));
        Selection.activeGameObject=alpha;started=EditorApplication.timeSinceStartup;EditorApplication.update+=Tick;
        EditorApplication.hierarchyWindowItemOnGUI+=RecordHierarchyRow;
        Write("generic-product-ready.json","{\"pid\":"+Process.GetCurrentProcess().Id+",\"root\":"+Q(root)+",\"alphaId\":"+alpha.GetInstanceID()+",\"betaId\":"+beta.GetInstanceID()+"}");
    }
    static void Tick()
    {
        if(File.Exists(root+"/Temp/request-exit")||EditorApplication.timeSinceStartup-started>480){EditorApplication.Exit(0);return;}
        Write("generic-product-observed.json","{\"selection\":"+Q(Selection.activeGameObject==null?null:Selection.activeGameObject.name)+",\"alphaX\":"+F(alpha.transform.localPosition.x)+",\"betaX\":"+F(beta.transform.localPosition.x)+",\"dpi\":"+F(EditorGUIUtility.pixelsPerPoint)+"}");
        foreach(var window in Resources.FindObjectsOfTypeAll<EditorWindow>())
        {
            if(window.GetType().FullName=="UnityEditor.SceneHierarchyWindow"&&!initializedHierarchy.Contains(window.GetInstanceID()))
            {
                var property=window.GetType().GetProperty("sceneHierarchy",Members);var hierarchy=property==null?null:property.GetValue(window,null);
                var expand=hierarchy==null?null:hierarchy.GetType().GetMethod("SetScenesExpanded",Members,null,new[]{typeof(List<string>)},null);
                if(expand!=null){var name=EditorSceneManager.GetActiveScene().name;expand.Invoke(hierarchy,new object[]{new List<string>{name}});initializedHierarchy.Add(window.GetInstanceID());Write("hierarchy-setup-"+window.GetInstanceID()+".json","{\"instanceId\":"+window.GetInstanceID()+",\"sceneName\":"+Q(name)+",\"fixtureSetup\":true,\"method\":\"SceneHierarchy.SetScenesExpanded\"}");}
            }
            if(window.GetType().FullName=="UnityEditor.SceneHierarchyWindow"||window.GetType().FullName=="UnityEditor.InspectorWindow")window.Repaint();
        }
        EditorApplication.QueuePlayerLoopUpdate();
    }
    public static void RecordInspectorControl(Rect local,string targetName)
    {
        RecordControl(local,targetName,"UnityEditor.InspectorWindow","inspector-control-");
    }
    static void RecordHierarchyRow(int id,Rect local)
    {
        if(beta==null||id!=beta.GetInstanceID())return;
        var witness=new Rect(local.xMax-14,local.y+2,10,Mathf.Max(2,local.height-4));
        EditorGUI.DrawRect(witness,Color.green);
        RecordControl(local,beta.name,"UnityEditor.SceneHierarchyWindow","hierarchy-row-");
        RecordControl(witness,beta.name,"UnityEditor.SceneHierarchyWindow","hierarchy-witness-");
    }
    static void RecordControl(Rect local,string targetName,string expectedType,string prefix)
    {
        if(root==null||Event.current.type!=EventType.Repaint)return;
        var type=typeof(EditorWindow).Assembly.GetType("UnityEditor.GUIView",false);
        var current=type==null?null:type.GetProperty("current",BindingFlags.Static|BindingFlags.Public|BindingFlags.NonPublic);
        var view=current==null?null:current.GetValue(null,null);
        var property=view==null?null:view.GetType().GetProperty("actualView",Members);
        var window=property==null?null:property.GetValue(view,null) as EditorWindow;
        if(window==null||window.GetType().FullName!=expectedType)return;
        var screenProperty=view.GetType().GetProperty("screenPosition",Members);if(screenProperty==null)return;
        var viewScreen=(Rect)screenProperty.GetValue(view,null);var position=window.position;var screen=GUIUtility.GUIToScreenPoint(local.center);
        var offset=new Vector2(Mathf.Max(0,(viewScreen.width-position.width)/2),Mathf.Max(0,viewScreen.height-position.height));
        var point=screen-viewScreen.position-offset;
        Write(prefix+window.GetInstanceID()+".json","{\"instanceId\":"+window.GetInstanceID()+",\"targetName\":"+Q(targetName)+",\"x\":"+F(point.x)+",\"y\":"+F(point.y)+",\"screenX\":"+F(screen.x)+",\"screenY\":"+F(screen.y)+",\"viewX\":"+F(viewScreen.x)+",\"viewY\":"+F(viewScreen.y)+",\"offsetX\":"+F(offset.x)+",\"offsetY\":"+F(offset.y)+",\"rawWindowX\":"+F(position.x)+",\"rawWindowY\":"+F(position.y)+",\"binding\":\"GUIView.current.actualView + authoritative screenPosition/contentOffset\"}");
    }
}
[CustomEditor(typeof(Transform))]
public sealed class GameCoworkGenericProductTransformInspector:Editor
{
    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();
        if(GUILayout.Button("Owned product increment serialized X"))
        {
            serializedObject.Update();var property=serializedObject.FindProperty("m_LocalPosition");var value=property.vector3Value;value.x+=1;property.vector3Value=value;serializedObject.ApplyModifiedProperties();
        }
        GameCoworkGenericProductFixture.RecordInspectorControl(GUILayoutUtility.GetLastRect(),target.name);
    }
}
