using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

// Preflight only. Created objects/scenes/assets belong to this unique temp
// project; none of these candidate query functions is a product bridge handler.
public static class GameCoworkQueriesPreflight
{
    [Serializable] public sealed class Check { public string name; public bool passed; }
    [Serializable] public sealed class SceneInfo { public string name, path, guid; public int handle, rootCount; public bool loaded, active, preview; }
    [Serializable] public sealed class Node { public string name, hierarchyPath, scenePath, globalObjectId; public int instanceID, parentID, sceneHandle, siblingIndex; public bool activeSelf, activeInHierarchy, persistent; public Node[] children; }
    [Serializable] public sealed class Query { public string method, term; public bool findAll, searchInactive; public Node[] matches; }
    [Serializable] public sealed class Report { public bool success; public string projectRoot, unityVersion, error; public int pid; public Check[] checks; public SceneInfo[] scenes; public Node[] hierarchy; public Query[] queries; public string prefabGuid, closedGlobalObjectId, unsavedGlobalObjectId; public int prefabInstanceID, closedInstanceID; }
    static readonly List<Check> checks = new List<Check>();
    static readonly List<Query> queries = new List<Query>();
    static string root;
    static double started;
    static void CheckThat(string name, bool passed)
    { checks.Add(new Check { name = name, passed = passed }); if (!passed) throw new InvalidOperationException(name); }
    static string HierarchyPath(GameObject value)
    { var segments = new List<string>(); for (var current = value.transform; current != null; current = current.parent) segments.Add(current.name); segments.Reverse(); return string.Join("/", segments.ToArray()); }
    static bool LoadedSceneObject(GameObject value)
    {
        if (value == null || EditorUtility.IsPersistent(value) || !value.scene.IsValid() || !value.scene.isLoaded || EditorSceneManager.IsPreviewScene(value.scene)) return false;
        for (int index = 0; index < SceneManager.sceneCount; index++) if (SceneManager.GetSceneAt(index).handle == value.scene.handle && SceneManager.GetSceneAt(index).isLoaded) return true;
        return false;
    }
    static IEnumerable<GameObject> Walk(Transform value)
    { yield return value.gameObject; for (int index = 0; index < value.childCount; index++) foreach (var child in Walk(value.GetChild(index))) yield return child; }
    static List<GameObject> LoadedObjects()
    {
        var result = new List<GameObject>();
        for (int index = 0; index < SceneManager.sceneCount; index++) {
            var scene = SceneManager.GetSceneAt(index); if (!scene.isLoaded || EditorSceneManager.IsPreviewScene(scene)) continue;
            foreach (var item in scene.GetRootGameObjects()) foreach (var node in Walk(item.transform)) if (LoadedSceneObject(node)) result.Add(node);
        }
        return result;
    }
    static Node Describe(GameObject value, bool recursive = false)
    {
        var children = new List<Node>(); if (recursive) for (int index = 0; index < value.transform.childCount; index++) children.Add(Describe(value.transform.GetChild(index).gameObject, true));
        return new Node { name = value.name, hierarchyPath = HierarchyPath(value), scenePath = value.scene.path, sceneHandle = value.scene.handle,
            instanceID = value.GetInstanceID(), parentID = value.transform.parent == null ? 0 : value.transform.parent.gameObject.GetInstanceID(), siblingIndex = value.transform.GetSiblingIndex(),
            activeSelf = value.activeSelf, activeInHierarchy = value.activeInHierarchy, persistent = EditorUtility.IsPersistent(value),
            globalObjectId = GlobalObjectId.GetGlobalObjectIdSlow(value).ToString(), children = children.ToArray() };
    }
    static Node[] Find(string method, string term, bool findAll = true, bool searchInactive = true)
    {
        var result = new List<Node>();
        if (method == "by_id") {
            int id; if (!int.TryParse(term, NumberStyles.Integer, CultureInfo.InvariantCulture, out id)) throw new ArgumentException("An integer instance ID is required");
            var value = EditorUtility.InstanceIDToObject(id) as GameObject;
            if (LoadedSceneObject(value) && (searchInactive || value.activeInHierarchy)) result.Add(Describe(value));
        } else {
            foreach (var value in LoadedObjects()) {
                if (!searchInactive && !value.activeInHierarchy) continue;
                bool matches = method == "by_name" ? string.Equals(value.name, term, StringComparison.OrdinalIgnoreCase) :
                    method == "by_path" ? string.Equals(HierarchyPath(value), term.Trim('/'), StringComparison.Ordinal) : false;
                if (!matches) continue; result.Add(Describe(value)); if (!findAll) break;
            }
        }
        var nodes = result.ToArray(); queries.Add(new Query { method = method, term = term, findAll = findAll, searchInactive = searchInactive, matches = nodes }); return nodes;
    }
    static GameObject Add(string name, Transform parent = null)
    { var value = new GameObject(name); if (parent != null) value.transform.SetParent(parent, false); return value; }
    static string GlobalId(GameObject value) { return GlobalObjectId.GetGlobalObjectIdSlow(value).ToString(); }
    static UnityEngine.Object ResolveGlobal(string text)
    { GlobalObjectId id; return GlobalObjectId.TryParse(text, out id) ? GlobalObjectId.GlobalObjectIdentifierToObjectSlow(id) : null; }
    static SceneInfo[] SceneSnapshot()
    {
        var scenes = new List<SceneInfo>(); for (int index = 0; index < SceneManager.sceneCount; index++) { var value = SceneManager.GetSceneAt(index); scenes.Add(new SceneInfo { name = value.name, path = value.path, guid = AssetDatabase.AssetPathToGUID(value.path), handle = value.handle, rootCount = value.rootCount, loaded = value.isLoaded, active = value == SceneManager.GetActiveScene(), preview = EditorSceneManager.IsPreviewScene(value) }); } return scenes.ToArray();
    }
    public static void Run()
    {
        root = Path.GetFullPath(Path.Combine(Application.dataPath, "..")).Replace('\\', '/');
        if (!root.StartsWith("F:/AI/AgentMake/temp/GameCowork/tests/editor-bridge-queries-", StringComparison.OrdinalIgnoreCase)) throw new InvalidOperationException("Query fixture must stay in its unique temp project");
        var report = new Report { projectRoot = root, unityVersion = Application.unityVersion, pid = Process.GetCurrentProcess().Id };
        try {
            var a = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var rootA = Add("QueryRoot"); var active = Add("ActiveChild", rootA.transform); active.AddComponent<Light>();
            var inactive = Add("InactiveParent", rootA.transform); inactive.SetActive(false); var nestedInactive = Add("InactiveDescendant", inactive.transform);
            var twins = Add("Twins", rootA.transform); var peerOne = Add("Peer", twins.transform); var peerTwo = Add("Peer", twins.transform);
            CheckThat("Save real scene A", EditorSceneManager.SaveScene(a, "Assets/QueriesA.unity"));
            var b = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Additive); EditorSceneManager.SetActiveScene(b);
            var rootB = Add("QueryRoot"); Add("ActiveChild", rootB.transform); Add("SceneBOnly", rootB.transform);
            CheckThat("Save real scene B", EditorSceneManager.SaveScene(b, "Assets/QueriesB.unity"));
            var c = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Additive); EditorSceneManager.SetActiveScene(c); var closed = Add("ClosedSceneOnly");
            CheckThat("Save real closed-only scene", EditorSceneManager.SaveScene(c, "Assets/QueriesClosed.unity")); report.closedGlobalObjectId = GlobalId(closed); report.closedInstanceID = closed.GetInstanceID();
            CheckThat("Close actual scene C", EditorSceneManager.CloseScene(c, true));
            EditorSceneManager.SetActiveScene(a); Directory.CreateDirectory(root + "/Assets/Prefabs"); var prefabSource = Add("PrefabAssetOnly");
            var prefab = PrefabUtility.SaveAsPrefabAsset(prefabSource, "Assets/Prefabs/QueryAsset.prefab"); UnityEngine.Object.DestroyImmediate(prefabSource);
            CheckThat("Save fixture-only prefab setup changes", EditorSceneManager.SaveScene(a));
            report.prefabInstanceID = prefab.GetInstanceID(); report.prefabGuid = AssetDatabase.AssetPathToGUID("Assets/Prefabs/QueryAsset.prefab");
            var preview = EditorSceneManager.NewPreviewScene(); var previewOnly = Add("PreviewOnly"); SceneManager.MoveGameObjectToScene(previewOnly, preview);
            var unsaved = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Additive); EditorSceneManager.SetActiveScene(unsaved); var unsavedOnly = Add("UnsavedOnly"); report.unsavedGlobalObjectId = GlobalId(unsavedOnly);
            var savedActiveId = active.GetInstanceID(); var savedGlobal = GlobalId(active);
            CheckThat("by_id resolves the exact loaded scene object", Find("by_id", savedActiveId.ToString(CultureInfo.InvariantCulture)).Length == 1);
            CheckThat("inactive parent hides its activeSelf descendant when searchInactive is false", nestedInactive.activeSelf && !nestedInactive.activeInHierarchy && Find("by_name", "InactiveDescendant", true, false).Length == 0);
            CheckThat("searchInactive true returns the actual inactive descendant", Find("by_name", "InactiveDescendant").Length == 1);
            CheckThat("same-name siblings remain distinguishable by instance ID", Find("by_name", "Peer").Length == 2 && peerOne.GetInstanceID() != peerTwo.GetInstanceID());
            CheckThat("by_path records sibling ambiguity rather than replacing identity", Find("by_path", "QueryRoot/Twins/Peer").Length == 2);
            CheckThat("additive scenes preserve duplicate hierarchy paths", Find("by_path", "QueryRoot/ActiveChild").Length == 2);
            CheckThat("by_name findAll false selects one actual candidate", Find("by_name", "Peer", false).Length == 1);
            CheckThat("missing name returns an empty actual match list", Find("by_name", "MissingOwnedObject").Length == 0);
            CheckThat("loaded scene enumeration excludes persistent Prefab assets", EditorUtility.IsPersistent(prefab) && Find("by_id", report.prefabInstanceID.ToString(CultureInfo.InvariantCulture)).Length == 0 && Find("by_name", "PrefabAssetOnly").Length == 0);
            CheckThat("loaded scene enumeration excludes Preview scenes", EditorSceneManager.IsPreviewScene(preview) && Find("by_name", "PreviewOnly").Length == 0);
            int beforeCount = SceneManager.sceneCount;
            CheckThat("unloaded scene by_id cannot resolve into a loaded scene", Find("by_id", report.closedInstanceID.ToString(CultureInfo.InvariantCulture)).Length == 0);
            CheckThat("GlobalObjectId for an unloaded scene does not load it", ResolveGlobal(report.closedGlobalObjectId) == null && SceneManager.sceneCount == beforeCount);
            CheckThat("saved scene object has a stable GlobalObjectId round trip", ResolveGlobal(savedGlobal) == active && !string.IsNullOrEmpty(AssetDatabase.AssetPathToGUID(a.path)));
            CheckThat("unsaved scene still has actual instance identity", Find("by_id", unsavedOnly.GetInstanceID().ToString(CultureInfo.InvariantCulture)).Length == 1);
            var tree = new List<Node>(); for (int index = 0; index < SceneManager.sceneCount; index++) { var scene = SceneManager.GetSceneAt(index); if (scene.isLoaded && !EditorSceneManager.IsPreviewScene(scene)) foreach (var item in scene.GetRootGameObjects()) tree.Add(Describe(item, true)); }
            report.hierarchy = tree.ToArray(); report.scenes = SceneSnapshot();
            CheckThat("hierarchy keeps parent/sibling/scene identity and inactive flags", report.hierarchy.Length == 3 && rootA.transform.childCount == 3 && inactive.transform.childCount == 1);
            CheckThat("real components remain queryable without changing the scene", active.GetComponent<Light>() != null && active.GetComponents<Component>().Length == 2);
            CheckThat("close A removes its objects from future queries", EditorSceneManager.CloseScene(a, true) && Find("by_id", savedActiveId.ToString(CultureInfo.InvariantCulture)).Length == 0);
            var reopened = EditorSceneManager.OpenScene("Assets/QueriesA.unity", OpenSceneMode.Additive); var resolved = ResolveGlobal(savedGlobal) as GameObject;
            CheckThat("GlobalObjectId resolves original identity after explicit fixture reopen", reopened.isLoaded && resolved != null && resolved.scene.path == "Assets/QueriesA.unity" && HierarchyPath(resolved) == "QueryRoot/ActiveChild");
            EditorSceneManager.ClosePreviewScene(preview); report.success = true;
        } catch (Exception error) { report.error = error.ToString(); report.success = false; }
        report.checks = checks.ToArray(); report.queries = queries.ToArray(); Directory.CreateDirectory(root + "/Temp"); File.WriteAllText(root + "/Temp/editor-queries-preflight.json", JsonUtility.ToJson(report, true));
        if (!report.success) { UnityEngine.Debug.LogError(report.error); EditorApplication.Exit(1); return; }
        started = EditorApplication.timeSinceStartup; EditorApplication.update += WaitForOwner;
    }
    static void WaitForOwner()
    { if (File.Exists(root + "/Temp/query-preflight-exit") || EditorApplication.timeSinceStartup - started > 120) { EditorApplication.update -= WaitForOwner; EditorApplication.Exit(0); } }
}
