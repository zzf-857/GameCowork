using System;
using System.Diagnostics;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

public static class GameCoworkSceneQueryFixture
{
    [Serializable] sealed class Ready
    {
        public string projectRoot, unityVersion;
        public int pid, rootA, activeA, inactiveChild, peerOne, peerTwo, prefabId, closedId, previewId, unsavedId;
        public int sceneCount;
        public bool sceneADirty, sceneBDirty;
    }
    static string root;
    static Scene sceneA, sceneB;
    static double started;
    static GameObject Add(string name, Transform parent = null)
    { var value = new GameObject(name); if (parent != null) value.transform.SetParent(parent, false); return value; }
    public static void Boot()
    {
        root = Path.GetFullPath(Path.Combine(Application.dataPath, "..")).Replace('\\', '/');
        if (!root.StartsWith("F:/AI/AgentMake/temp/GameCowork/tests/editor-bridge-scene-queries-", StringComparison.OrdinalIgnoreCase)) throw new InvalidOperationException("Fixture must be in its exact own temp scope");
        sceneA = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        var rootA = Add("QueryRoot"); var activeA = Add("ActiveChild", rootA.transform); activeA.AddComponent<Light>(); activeA.AddComponent<GameCoworkQueryComponent>();
        var inactive = Add("InactiveParent", rootA.transform); inactive.SetActive(false); var child = Add("InactiveChild", inactive.transform);
        var twins = Add("Twins", rootA.transform); var peerOne = Add("Peer", twins.transform); var peerTwo = Add("Peer", twins.transform);
        if (!EditorSceneManager.SaveScene(sceneA, "Assets/QueriesA.unity")) throw new IOException("Cannot save own scene A");
        sceneB = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Additive);
        var rootB = Add("QueryRoot"); Add("ActiveChild", rootB.transform); Add("SceneBOnly", rootB.transform);
        if (!EditorSceneManager.SaveScene(sceneB, "Assets/QueriesB.unity")) throw new IOException("Cannot save own scene B");
        var closedScene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Additive); var closed = Add("ClosedSceneOnly"); int closedId = closed.GetInstanceID();
        if (!EditorSceneManager.SaveScene(closedScene, "Assets/QueriesClosed.unity") || !EditorSceneManager.CloseScene(closedScene, true)) throw new IOException("Cannot save/close own scene C");
        EditorSceneManager.SetActiveScene(sceneA); var prefabSource = Add("PrefabAssetOnly");
        var prefab = PrefabUtility.SaveAsPrefabAsset(prefabSource, "Assets/QueryAsset.prefab"); UnityEngine.Object.DestroyImmediate(prefabSource);
        if (!EditorSceneManager.SaveScene(sceneA)) throw new IOException("Cannot persist own fixture setup");
        var preview = EditorSceneManager.NewPreviewScene(); var previewObject = Add("PreviewOnly"); SceneManager.MoveGameObjectToScene(previewObject, preview);
        var unsaved = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Additive); var unsavedObject = Add("UnsavedOnly");
        EditorSceneManager.SetActiveScene(sceneA); Selection.activeGameObject = activeA;
        var ready = new Ready { projectRoot = root, unityVersion = Application.unityVersion, pid = Process.GetCurrentProcess().Id,
            rootA = rootA.GetInstanceID(), activeA = activeA.GetInstanceID(), inactiveChild = child.GetInstanceID(), peerOne = peerOne.GetInstanceID(), peerTwo = peerTwo.GetInstanceID(),
            prefabId = prefab.GetInstanceID(), closedId = closedId, previewId = previewObject.GetInstanceID(), unsavedId = unsavedObject.GetInstanceID(),
            sceneCount = SceneManager.sceneCount, sceneADirty = sceneA.isDirty, sceneBDirty = sceneB.isDirty };
        Directory.CreateDirectory(root + "/Temp"); File.WriteAllText(root + "/Temp/scene-query-ready.json", JsonUtility.ToJson(ready, true));
        started = EditorApplication.timeSinceStartup; EditorApplication.update += Tick;
    }
    static void Tick()
    {
        if (File.Exists(root + "/Temp/query-observe")) {
            File.Delete(root + "/Temp/query-observe");
            File.WriteAllText(root + "/Temp/query-observed.json", "{\"selection\":" + (Selection.activeGameObject == null ? 0 : Selection.activeGameObject.GetInstanceID()) +
                ",\"sceneCount\":" + SceneManager.sceneCount + ",\"sceneADirty\":" + (sceneA.isDirty ? "true" : "false") + ",\"sceneBDirty\":" + (sceneB.isDirty ? "true" : "false") + "}");
        }
        if (File.Exists(root + "/Temp/query-close-a")) {
            File.Delete(root + "/Temp/query-close-a"); EditorSceneManager.CloseScene(sceneA, true); File.WriteAllText(root + "/Temp/query-a-closed", "closed");
        }
        if (File.Exists(root + "/Temp/query-exit") || EditorApplication.timeSinceStartup - started > 240) {
            EditorApplication.update -= Tick; EditorApplication.Exit(0);
        }
    }
}
