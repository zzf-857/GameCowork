using System;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using System.Text;
using UnityEditor;
using UnityEditorInternal;
using UnityEngine;

namespace GameCowork.EditorBridge
{
    // Bridge.OnMain is the only production caller. These getters never create,
    // select, focus or mutate editor objects, tools, preferences or project data.
    internal static class EditorContextQueries
    {
        const int MaxWindows = 256, MaxTags = 1024, MaxName = 4096, MaxBytes = 900000;
        [Serializable] sealed class WindowInfo
        {
            public string title, typeName;
            public bool isFocused;
            public int instanceID, instanceId;
            public Position position;
        }
        [Serializable] sealed class Position { public float x, y, width, height; }
        [Serializable] sealed class WindowsResult { public bool success = true; public WindowInfo[] data; public string projectRoot; }
        [Serializable] sealed class TagsResult { public bool success = true; public string[] data; public string projectRoot; }
        [Serializable] sealed class ToolInfo
        {
            public string activeTool, pivotMode, pivotRotation, customToolType, customToolUnavailableReason;
            public bool isCustom;
            public float[] handleRotation, handlePosition;
        }
        [Serializable] sealed class ToolResult { public bool success = true; public ToolInfo data; public string projectRoot; }
        internal static bool Handles(string action)
        {
            return action == "get_selection" || action == "get_project_root" || action == "get_windows" ||
                action == "get_tags" || action == "get_layers" || action == "get_active_tool";
        }
        static string Name(string value)
        { if (value != null && value.Length > MaxName) throw new InvalidOperationException("Editor context name exceeds 4096 characters"); return value; }
        static string Bounded(string json)
        { if (Encoding.UTF8.GetByteCount(json) > MaxBytes) throw new InvalidOperationException("Editor context response exceeds 900000 bytes"); return json; }
        static float Number(float value)
        { if (float.IsNaN(value) || float.IsInfinity(value)) throw new InvalidOperationException("Editor context geometry is not finite"); return value; }
        static float[] Vector(Vector3 value) { return new[] { Number(value.x), Number(value.y), Number(value.z) }; }
        internal static string Invoke(string action)
        {
            switch (action)
            {
                case "get_selection":
                case "get_project_root": return Bounded(EditorReadOnly.Invoke("manage_editor", action));
                case "get_windows": return Windows();
                case "get_tags":
                    var tags = InternalEditorUtility.tags;
                    if (tags == null) throw new NotSupportedException("Editor tag list is unavailable");
                    if (tags.Length > MaxTags) throw new InvalidOperationException("Editor tags exceed 1024 names");
                    foreach (var tag in tags) Name(tag);
                    return Bounded(JsonUtility.ToJson(new TagsResult { data = tags, projectRoot = Bridge.ProjectRoot }));
                case "get_layers":
                    var layers = new StringBuilder("{\"success\":true,\"data\":{"); bool first = true;
                    for (int index = 0; index < 32; index++) {
                        string layer = Name(LayerMask.LayerToName(index)); if (string.IsNullOrEmpty(layer)) continue;
                        if (!first) layers.Append(','); first = false;
                        layers.Append(Bridge.Json(index.ToString(CultureInfo.InvariantCulture))).Append(':').Append(Bridge.Json(layer));
                    }
                    return Bounded(layers.Append("},\"projectRoot\":").Append(Bridge.Json(Bridge.ProjectRoot)).Append('}').ToString());
                case "get_active_tool": return ActiveTool();
                default: throw new NotSupportedException("Unsupported editor context action: " + action);
            }
        }
        static string Windows()
        {
            var rows = new List<WindowInfo>(); var seen = new HashSet<int>();
            var windows = Resources.FindObjectsOfTypeAll<EditorWindow>();
            foreach (var window in windows) {
                if (window == null) continue; int id = window.GetInstanceID(); if (!seen.Add(id)) continue;
                if (rows.Count >= MaxWindows) throw new InvalidOperationException("Editor windows exceed 256 instances");
                Rect position = window.position;
                rows.Add(new WindowInfo { title = Name(window.titleContent == null ? null : window.titleContent.text), typeName = Name(window.GetType().FullName),
                    instanceID = id, instanceId = id, isFocused = EditorWindow.focusedWindow == window,
                    position = new Position { x = Number(position.x), y = Number(position.y), width = Number(position.width), height = Number(position.height) } });
            }
            rows.Sort((left, right) => left.instanceID.CompareTo(right.instanceID));
            return Bounded(JsonUtility.ToJson(new WindowsResult { data = rows.ToArray(), projectRoot = Bridge.ProjectRoot }));
        }
        static string ActiveTool()
        {
            Tool current = Tools.current; bool custom = current == Tool.Custom;
            string typeName = null, unavailable = null;
            if (custom) {
                var manager = typeof(EditorWindow).Assembly.GetType("UnityEditor.EditorTools.ToolManager");
                var property = manager == null ? null : manager.GetProperty("activeToolType", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);
                if (property == null || !property.CanRead) unavailable = "This Editor does not expose the active custom tool type";
                else { var type = property.GetValue(null, null) as Type; if (type == null) unavailable = "The active custom tool type is unavailable"; else typeName = Name(type.FullName); }
            }
            var data = new ToolInfo { activeTool = typeName ?? current.ToString(), isCustom = custom, customToolType = typeName,
                customToolUnavailableReason = unavailable, pivotMode = Tools.pivotMode.ToString(), pivotRotation = Tools.pivotRotation.ToString(),
                handleRotation = Vector(Tools.handleRotation.eulerAngles), handlePosition = Vector(Tools.handlePosition) };
            return Bounded(JsonUtility.ToJson(new ToolResult { data = data, projectRoot = Bridge.ProjectRoot }));
        }
    }
}
