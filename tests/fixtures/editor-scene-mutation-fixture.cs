using System;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

public static class GameCoworkSceneMutationFixture
{
    [Serializable] sealed class State
    {
        public string projectRoot, unityVersion;
        public int pid, activeScene, sceneB, parent, existing, duplicateA, duplicateB, prefabId, previewId, unsavedId, unsavedScene, selection, sceneCount;
        public bool dirty, sceneBDirty, active;
        public Vector3 position, rotation, scale;
        public string[] names;
    }
    static string root; static double started; static bool reloaded; static Scene sceneA, sceneB; static GameObject parent, existing, duplicateA, duplicateB, prefab, previewObject, unsavedObject;
    [InitializeOnLoadMethod] static void ResumeAfterReload()
    {
        string ownRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..")).Replace('\\', '/');
        if (!ownRoot.StartsWith("F:/AI/AgentMake/temp/GameCowork/tests/editor-bridge-scene-mutations-", StringComparison.OrdinalIgnoreCase) || !File.Exists(ownRoot + "/Temp/reload-started")) return;
        root = ownRoot; reloaded = true; started = EditorApplication.timeSinceStartup; EditorApplication.update += Tick;
        File.WriteAllText(root + "/Temp/reload-resumed", "resumed");
    }
    public static void Boot()
    {
        root = Path.GetFullPath(Path.Combine(Application.dataPath, "..")).Replace('\\', '/');
        if (!root.StartsWith("F:/AI/AgentMake/temp/GameCowork/tests/editor-bridge-scene-mutations-", StringComparison.OrdinalIgnoreCase)) throw new InvalidOperationException("Own mutation fixture scope required");
        Directory.CreateDirectory(root + "/Assets/Scenes");
        sceneA = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        parent = new GameObject("MutationParent"); parent.transform.position = new Vector3(10, 20, 30);
        existing = new GameObject("MutationExisting"); existing.transform.SetParent(parent.transform, false); existing.transform.localPosition = new Vector3(1, 2, 3);
        duplicateA = new GameObject("MutationDuplicate");
        if (!EditorSceneManager.SaveScene(sceneA, "Assets/Scenes/MutationA.unity")) throw new IOException("Could not save fixture scene A");
        sceneB = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Additive); duplicateB = new GameObject("MutationDuplicate");
        if (!EditorSceneManager.SaveScene(sceneB, "Assets/Scenes/MutationB.unity")) throw new IOException("Could not save fixture scene B");
        EditorSceneManager.SetActiveScene(sceneA);
        var source = new GameObject("MutationPrefab"); prefab = PrefabUtility.SaveAsPrefabAsset(source, "Assets/MutationPrefab.prefab"); UnityEngine.Object.DestroyImmediate(source);
        if (!EditorSceneManager.SaveScene(sceneA)) throw new IOException("Could not preserve setup");
        var preview = EditorSceneManager.NewPreviewScene(); previewObject = new GameObject("MutationPreview"); SceneManager.MoveGameObjectToScene(previewObject, preview);
        EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Additive); unsavedObject = new GameObject("MutationUnsaved");
        EditorSceneManager.SetActiveScene(sceneA); Selection.activeGameObject = existing;
        Undo.ClearAll(); started = EditorApplication.timeSinceStartup; EditorApplication.update += Tick; WriteState("ready.json");
    }
    static void WriteState(string file)
    {
        var names = new System.Collections.Generic.List<string>(); foreach (var item in sceneA.GetRootGameObjects()) Walk(item.transform, names);
        File.WriteAllText(root + "/Temp/" + file, JsonUtility.ToJson(new State { projectRoot = root, unityVersion = Application.unityVersion,
            pid = System.Diagnostics.Process.GetCurrentProcess().Id, activeScene = sceneA.handle, sceneB = sceneB.handle, parent = parent.GetInstanceID(), existing = existing.GetInstanceID(),
            duplicateA = duplicateA.GetInstanceID(), duplicateB = duplicateB.GetInstanceID(), prefabId = prefab.GetInstanceID(), previewId = previewObject.GetInstanceID(), unsavedId = unsavedObject.GetInstanceID(),
            unsavedScene = unsavedObject.scene.handle, selection = Selection.activeGameObject == null ? 0 : Selection.activeGameObject.GetInstanceID(), sceneCount = SceneManager.sceneCount,
            dirty = sceneA.isDirty, sceneBDirty = sceneB.isDirty, active = existing.activeSelf, position = existing.transform.localPosition,
            rotation = existing.transform.localEulerAngles, scale = existing.transform.localScale, names = names.ToArray() }, true));
    }
    static void Walk(Transform value, System.Collections.Generic.List<string> names)
    { names.Add(value.name); for (int index = 0; index < value.childCount; index++) Walk(value.GetChild(index), names); }
    static void Tick()
    {
        if (File.Exists(root + "/Temp/exit") || EditorApplication.timeSinceStartup - started > 300) { EditorApplication.update -= Tick; EditorApplication.Exit(0); return; }
        if (reloaded) return;
        if (File.Exists(root + "/Temp/observe")) { File.Delete(root + "/Temp/observe"); WriteState("observed.json"); }
        if (File.Exists(root + "/Temp/undo")) { File.Delete(root + "/Temp/undo"); Undo.PerformUndo(); WriteState("undo-observed.json"); }
        if (File.Exists(root + "/Temp/busy")) { File.Delete(root + "/Temp/busy"); File.WriteAllText(root + "/Temp/busy-started", "started"); System.Threading.Thread.Sleep(2000); }
        if (File.Exists(root + "/Temp/close-b")) { File.Delete(root + "/Temp/close-b"); EditorSceneManager.CloseScene(sceneB, true); File.WriteAllText(root + "/Temp/b-closed", "closed"); }
        if (File.Exists(root + "/Temp/reload")) { File.Delete(root + "/Temp/reload"); File.WriteAllText(root + "/Temp/reload-started", "started"); EditorUtility.RequestScriptReload(); }
    }
}
