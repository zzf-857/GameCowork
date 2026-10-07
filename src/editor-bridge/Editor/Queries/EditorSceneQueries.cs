using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace GameCowork.EditorBridge
{
    // Main-thread queries only. Loaded ordinary scenes are the complete scope:
    // no asset loading, scene opening, selection changes or arbitrary getters.
    internal static class EditorSceneQueries
    {
        const int MaxObjects = 4096, MaxDepth = 64, MaxProperties = 512, MaxResponse = 900000;
        [Serializable] sealed class SceneInfo { public string name, path, guid; public int handle, rootCount; public bool loaded, active, dirty; }
        [Serializable] internal sealed class Node
        {
            public string name, hierarchyPath, scenePath, globalObjectId, tag;
            public int instanceID, instanceId, parentID, sceneHandle, siblingIndex, layer;
            public bool activeSelf, activeInHierarchy;
            public Vector3 localPosition, localEulerAngles, localScale;
            public Node[] children;
        }
        [Serializable] sealed class NodesResult { public bool success = true; public Node[] data; public SceneInfo[] scenes; public string projectRoot; }
        [Serializable] sealed class PropertyInfo { public string name, path, type, value; public int objectInstanceID; public string objectType, assetPath; }
        [Serializable] sealed class ComponentInfo { public int instanceID, instanceId; public string type, name; public bool missing; public PropertyInfo[] properties; }
        [Serializable] sealed class ComponentsResult { public bool success = true; public Node target; public ComponentInfo[] data; public string projectRoot; }
        static object Entry(Dictionary<string, object> data, string key) { object value; return data != null && data.TryGetValue(key, out value) ? value : null; }
        static string Text(Dictionary<string, object> data, string key, string fallback = null)
        { var value = Entry(data, key); if (value == null) return fallback; if (!(value is string)) throw new ArgumentException(key + " must be a string"); return (string)value; }
        static bool Flag(Dictionary<string, object> data, string key, bool fallback)
        { var value = Entry(data, key); if (value == null) return fallback; if (!(value is bool)) throw new ArgumentException(key + " must be a boolean"); return (bool)value; }
        static int Id(object value)
        {
            int id;
            string text = value is string ? (string)value : value is double ? ((double)value).ToString("R", CultureInfo.InvariantCulture) : null;
            if (text == null || !int.TryParse(text, NumberStyles.AllowLeadingSign, CultureInfo.InvariantCulture, out id))
                throw new ArgumentException("An exact signed integer instance ID is required");
            return id;
        }
        internal static bool InScope(GameObject value)
        {
            if (value == null || EditorUtility.IsPersistent(value) || !value.scene.IsValid() || !value.scene.isLoaded || EditorSceneManager.IsPreviewScene(value.scene)) return false;
            for (int index = 0; index < SceneManager.sceneCount; index++)
                if (SceneManager.GetSceneAt(index).handle == value.scene.handle && SceneManager.GetSceneAt(index).isLoaded) return true;
            return false;
        }
        static void Walk(Transform item, int depth, List<GameObject> objects)
        {
            if (depth > MaxDepth || objects.Count >= MaxObjects) throw new InvalidOperationException("Scene query exceeds 4096 objects or 64 hierarchy levels; narrow the loaded scenes");
            if (InScope(item.gameObject)) objects.Add(item.gameObject);
            for (int index = 0; index < item.childCount; index++) Walk(item.GetChild(index), depth + 1, objects);
        }
        static List<GameObject> Objects()
        {
            var objects = new List<GameObject>();
            for (int index = 0; index < SceneManager.sceneCount; index++) {
                var scene = SceneManager.GetSceneAt(index); if (!scene.isLoaded || EditorSceneManager.IsPreviewScene(scene)) continue;
                foreach (var root in scene.GetRootGameObjects()) Walk(root.transform, 0, objects);
            }
            return objects;
        }
        static string HierarchyPath(GameObject value)
        {
            var parts = new List<string>();
            for (var current = value.transform; current != null; current = current.parent) {
                if (parts.Count > MaxDepth) throw new InvalidOperationException("Hierarchy exceeds 64 levels"); parts.Add(current.name);
            }
            parts.Reverse(); return string.Join("/", parts.ToArray());
        }
        internal static Node Describe(GameObject value, bool recursive = false, int depth = 0)
        {
            if (depth > MaxDepth) throw new InvalidOperationException("Hierarchy exceeds 64 levels");
            var children = new List<Node>();
            if (recursive) for (int index = 0; index < value.transform.childCount; index++) children.Add(Describe(value.transform.GetChild(index).gameObject, true, depth + 1));
            int id = value.GetInstanceID();
            return new Node { name = value.name, hierarchyPath = HierarchyPath(value), scenePath = value.scene.path, sceneHandle = value.scene.handle,
                instanceID = id, instanceId = id, parentID = value.transform.parent == null ? 0 : value.transform.parent.gameObject.GetInstanceID(),
                siblingIndex = value.transform.GetSiblingIndex(), activeSelf = value.activeSelf, activeInHierarchy = value.activeInHierarchy,
                globalObjectId = GlobalObjectId.GetGlobalObjectIdSlow(value).ToString(), tag = value.tag, layer = value.layer,
                localPosition = value.transform.localPosition, localEulerAngles = value.transform.localEulerAngles, localScale = value.transform.localScale,
                children = children.ToArray() };
        }
        static SceneInfo[] Scenes()
        {
            var result = new List<SceneInfo>();
            for (int index = 0; index < SceneManager.sceneCount; index++) {
                var scene = SceneManager.GetSceneAt(index); if (!scene.isLoaded || EditorSceneManager.IsPreviewScene(scene)) continue;
                result.Add(new SceneInfo { name = scene.name, path = scene.path, guid = AssetDatabase.AssetPathToGUID(scene.path), handle = scene.handle,
                    rootCount = scene.rootCount, loaded = scene.isLoaded, active = scene == SceneManager.GetActiveScene(), dirty = scene.isDirty });
            }
            return result.ToArray();
        }
        static List<GameObject> Find(string method, object term, bool all, bool inactive)
        {
            var result = new List<GameObject>();
            if (method == "by_id") {
                var value = EditorUtility.InstanceIDToObject(Id(term)) as GameObject;
                if (InScope(value) && (inactive || value.activeInHierarchy)) result.Add(value);
                return result;
            }
            if (method != "by_name" && method != "by_path") throw new ArgumentException("searchMethod must be by_id, by_name or by_path");
            var text = term as string; if (string.IsNullOrEmpty(text) || text.Length > 2048) throw new ArgumentException("A non-empty search term of at most 2048 characters is required");
            foreach (var value in Objects()) {
                if (!inactive && !value.activeInHierarchy) continue;
                bool match = method == "by_name" ? string.Equals(value.name, text, StringComparison.OrdinalIgnoreCase) : string.Equals(HierarchyPath(value), text.Trim('/'), StringComparison.Ordinal);
                if (!match) continue; result.Add(value); if (!all) break;
            }
            return result;
        }
        internal static GameObject Target(Dictionary<string, object> parameters)
        {
            object term = Entry(parameters, "target"); string method = Text(parameters, "searchMethod", "by_name");
            var target = term as Dictionary<string, object>;
            if (target != null) {
                int selectors = (Entry(target, "id") == null ? 0 : 1) + (Entry(target, "name") == null ? 0 : 1) + (Entry(target, "hierarchy_path") == null ? 0 : 1);
                if (selectors != 1 || target.Count != 1) throw new ArgumentException("target requires exactly one of id, name or hierarchy_path");
                if (Entry(target, "id") != null) { method = "by_id"; term = Entry(target, "id"); }
                else if (Entry(target, "hierarchy_path") != null) { method = "by_path"; term = Entry(target, "hierarchy_path"); }
                else { method = "by_name"; term = Entry(target, "name"); }
            }
            else if (term is double) method = "by_id";
            var matches = Find(method, term, true, true);
            if (matches.Count != 1) throw new ArgumentException(matches.Count == 0 ? "No loaded scene GameObject matches target" : "Target is ambiguous; use its exact instance ID from find/get_hierarchy");
            return matches[0];
        }
        static string Json(object value)
        { string json = JsonUtility.ToJson(value); if (Encoding.UTF8.GetByteCount(json) > MaxResponse) throw new InvalidOperationException("Scene query response exceeds its bounded limit; narrow the query"); return json; }
        static string Value(SerializedProperty property)
        {
            switch (property.propertyType) {
                case SerializedPropertyType.Integer: return property.longValue.ToString(CultureInfo.InvariantCulture);
                case SerializedPropertyType.Boolean: return property.boolValue ? "true" : "false";
                case SerializedPropertyType.Float: return property.doubleValue.ToString("R", CultureInfo.InvariantCulture);
                case SerializedPropertyType.String: return property.stringValue.Length > 8192 ? property.stringValue.Substring(0, 8192) + " [truncated]" : property.stringValue;
                case SerializedPropertyType.Enum: return property.enumValueIndex >= 0 && property.enumValueIndex < property.enumNames.Length ? property.enumNames[property.enumValueIndex] : property.enumValueIndex.ToString(CultureInfo.InvariantCulture);
                case SerializedPropertyType.Vector2: return property.vector2Value.ToString("R");
                case SerializedPropertyType.Vector3: return property.vector3Value.ToString("R");
                case SerializedPropertyType.Vector4: return property.vector4Value.ToString("R");
                case SerializedPropertyType.Color: return property.colorValue.ToString("R");
                case SerializedPropertyType.Quaternion: return property.quaternionValue.ToString("R");
                case SerializedPropertyType.ObjectReference: return property.objectReferenceValue == null ? null : property.objectReferenceValue.name;
                case SerializedPropertyType.ArraySize: return property.intValue.ToString(CultureInfo.InvariantCulture);
                default: return null;
            }
        }
        static ComponentInfo[] Components(GameObject target, bool nonPublic)
        {
            var result = new List<ComponentInfo>(); var components = target.GetComponents<Component>();
            if (components.Length > 256) throw new InvalidOperationException("GameObject exceeds 256 components");
            foreach (var component in components) {
                if (component == null) { result.Add(new ComponentInfo { missing = true, type = "MissingScript", properties = new PropertyInfo[0] }); continue; }
                var properties = new List<PropertyInfo>();
                using (var serialized = new SerializedObject(component)) {
                    var iterator = serialized.GetIterator();
                    while (nonPublic ? iterator.Next(true) : iterator.NextVisible(true)) {
                        if (iterator.depth > 32) throw new InvalidOperationException("Serialized component exceeds 32 nested levels");
                        if (properties.Count >= MaxProperties) throw new InvalidOperationException("Component exceeds 512 serialized properties");
                        var entry = new PropertyInfo { name = iterator.name, path = iterator.propertyPath, type = iterator.propertyType.ToString(), value = Value(iterator) };
                        if (iterator.propertyType == SerializedPropertyType.ObjectReference && iterator.objectReferenceValue != null) {
                            entry.objectInstanceID = iterator.objectReferenceValue.GetInstanceID(); entry.objectType = iterator.objectReferenceValue.GetType().FullName; entry.assetPath = AssetDatabase.GetAssetPath(iterator.objectReferenceValue);
                        }
                        properties.Add(entry);
                    }
                }
                int id = component.GetInstanceID(); result.Add(new ComponentInfo { instanceID = id, instanceId = id, type = component.GetType().FullName, name = component.name, properties = properties.ToArray() });
            }
            return result.ToArray();
        }
        internal static string Invoke(string command, string raw)
        {
            var envelope = EditorCancellation.Parse(raw); var parameters = Entry(envelope, "params") as Dictionary<string, object>;
            if (parameters == null) throw new ArgumentException("Query params object is required"); string action = Text(parameters, "action");
            if (command == "manage_scene") {
                if (action != "get_hierarchy") throw new NotSupportedException("Unsupported manage_scene action: " + action + "; available: get_hierarchy");
                Objects(); var roots = new List<Node>();
                for (int index = 0; index < SceneManager.sceneCount; index++) {
                    var scene = SceneManager.GetSceneAt(index); if (!scene.isLoaded || EditorSceneManager.IsPreviewScene(scene)) continue;
                    foreach (var root in scene.GetRootGameObjects()) roots.Add(Describe(root, true));
                }
                return Json(new NodesResult { data = roots.ToArray(), scenes = Scenes(), projectRoot = Bridge.ProjectRoot });
            }
            if (command != "manage_gameobject") throw new NotSupportedException("Unsupported scene query command: " + command);
            if (action == "get_components") {
                var value = Target(parameters); return Json(new ComponentsResult { target = Describe(value), data = Components(value, Flag(parameters, "includeNonPublicSerialized", false)), projectRoot = Bridge.ProjectRoot });
            }
            var nodes = new List<Node>();
            if (action == "find") {
                foreach (var value in Find(Text(parameters, "searchMethod", "by_name"), Entry(parameters, "searchTerm"), Flag(parameters, "findAll", false), Flag(parameters, "searchInactive", false))) nodes.Add(Describe(value));
            } else if (action == "list_children") {
                var value = Target(parameters); if (value.transform.childCount > MaxObjects) throw new InvalidOperationException("Child query exceeds 4096 objects");
                for (int index = 0; index < value.transform.childCount; index++) nodes.Add(Describe(value.transform.GetChild(index).gameObject));
            } else throw new NotSupportedException("Unsupported manage_gameobject action: " + action + "; available: find, list_children, get_components");
            return Json(new NodesResult { data = nodes.ToArray(), scenes = Scenes(), projectRoot = Bridge.ProjectRoot });
        }
    }
}
