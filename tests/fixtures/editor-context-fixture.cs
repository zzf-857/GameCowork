using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEditorInternal;
using UnityEngine;
public sealed class GameCoworkContextWindow : EditorWindow { void OnGUI() { GUILayout.Label("Own context query fixture"); } }
public static class GameCoworkContextFixture
{
    static string root; static double started;
    [Serializable] sealed class WindowState { public int id; public string type, title; public Rect position; }
    [Serializable] sealed class State
    {
        public string projectRoot, tool, pivotMode, pivotRotation;
        public int pid, activeSelection, focus, lastUsedToolPref;
        public int[] selection;
        public string[] tags, layers;
        public Vector3 handlePosition, handleRotation;
        public bool sceneDirty, isPlaying, isPaused;
        public WindowState[] windows;
    }
    public static void Boot()
    {
        root = Path.GetFullPath(Path.Combine(Application.dataPath, "..")).Replace('\\', '/');
        if (!root.StartsWith("F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests/editor-bridge-context-", StringComparison.OrdinalIgnoreCase)) throw new InvalidOperationException("Own context fixture scope required");
        var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        var selected = new GameObject("GCW_CONTEXT_SELECTED"); selected.transform.position = new Vector3(2, 3, 4);
        var asset = new AnimationClip(); asset.name = "GCW_CONTEXT_ASSET"; AssetDatabase.CreateAsset(asset, "Assets/ContextAsset.anim");
        if (Array.IndexOf(InternalEditorUtility.tags, "GCW_CONTEXT_TAG") < 0) InternalEditorUtility.AddTag("GCW_CONTEXT_TAG");
        var tagManager = new SerializedObject(AssetDatabase.LoadAllAssetsAtPath("ProjectSettings/TagManager.asset")[0]);
        tagManager.FindProperty("layers").GetArrayElementAtIndex(29).stringValue = "GCW_CONTEXT_LAYER"; tagManager.ApplyModifiedPropertiesWithoutUndo();
        AssetDatabase.SaveAssets(); if (!EditorSceneManager.SaveScene(scene, "Assets/Context.unity")) throw new IOException("Cannot save own fixture scene");
        Selection.objects = new UnityEngine.Object[] { selected, asset }; Selection.activeObject = selected;
        var window = ScriptableObject.CreateInstance<GameCoworkContextWindow>(); window.titleContent = new GUIContent("OWN_CONTEXT_WINDOW"); window.position = new Rect(40, 60, 330, 190); window.ShowAuxWindow();
        Debug.LogError("GCW_CONTEXT_CONSOLE_PRESERVE_" + System.Diagnostics.Process.GetCurrentProcess().Id);
        started = EditorApplication.timeSinceStartup; EditorApplication.update += Tick;
        EditorApplication.delayCall += () => Write("before.json");
    }
    static void Write(string file)
    {
        var windows = new List<WindowState>(); foreach (var window in Resources.FindObjectsOfTypeAll<EditorWindow>()) if (window != null) windows.Add(new WindowState { id = window.GetInstanceID(), type = window.GetType().FullName, title = window.titleContent.text, position = window.position });
        windows.Sort((a, b) => a.id.CompareTo(b.id)); var ids = new List<int>(); foreach (var selected in Selection.objects) if (selected != null) ids.Add(selected.GetInstanceID());
        var layers = new string[32]; for (int index = 0; index < 32; index++) layers[index] = LayerMask.LayerToName(index);
        var state = new State { projectRoot = root, pid = System.Diagnostics.Process.GetCurrentProcess().Id, tool = Tools.current.ToString(), pivotMode = Tools.pivotMode.ToString(), pivotRotation = Tools.pivotRotation.ToString(),
            handlePosition = Tools.handlePosition, handleRotation = Tools.handleRotation.eulerAngles, selection = ids.ToArray(), activeSelection = Selection.activeObject == null ? 0 : Selection.activeObject.GetInstanceID(),
            focus = EditorWindow.focusedWindow == null ? 0 : EditorWindow.focusedWindow.GetInstanceID(), lastUsedToolPref = EditorPrefs.GetInt("LastUsedTool", -1),
            tags = InternalEditorUtility.tags, layers = layers, sceneDirty = EditorSceneManager.GetActiveScene().isDirty, isPlaying = EditorApplication.isPlaying, isPaused = EditorApplication.isPaused, windows = windows.ToArray() };
        File.WriteAllText(root + "/Temp/" + file, JsonUtility.ToJson(state, true));
    }
    static void Tick()
    {
        if (File.Exists(root + "/Temp/observe")) { File.Delete(root + "/Temp/observe"); Write("after.json"); }
        if (File.Exists(root + "/Temp/exit") || EditorApplication.timeSinceStartup - started > 180) { EditorApplication.update -= Tick; EditorApplication.Exit(0); }
    }
}
