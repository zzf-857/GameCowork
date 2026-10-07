using System;
using System.Collections.Generic;
using System.Text;
using UnityEditor;
using UnityEngine;

namespace GameCowork.EditorBridge
{
    internal static class EditorReadOnly
    {
        // Called only through Bridge.OnMain. These operations need no model or account.
        public static string Invoke(string command, string action)
        {
            if (command == "_internal_asset_listening" && action == "status")
                return "{\"supported\":false,\"listening\":false,\"isListening\":false,\"reason\":\"The local asset generation/listening provider is not implemented or configured\"}";
            if (command != "manage_editor") throw new NotSupportedException("Unsupported editor tool: " + command);
            switch (action)
            {
                case "get_project_root": return "{\"projectRoot\":" + Bridge.Json(Bridge.ProjectRoot) + "}";
                case "get_state":
                    return EditorControl.StateJson();
                case "get_selection": return SelectionJson();
                default: throw new NotSupportedException("Unsupported manage_editor action: " + action);
            }
        }
        static string SelectionJson()
        {
            var entries = new StringBuilder("[");
            var paths = new List<string>();
            var objects = Selection.objects;
            if (objects.Length > 1024) throw new InvalidOperationException("Editor selection exceeds 1024 objects");
            foreach (var selected in objects)
            {
                if (selected == null) continue;
                if (entries.Length > 1) entries.Append(',');
                string asset = AssetDatabase.GetAssetPath(selected);
                if (!string.IsNullOrEmpty(asset)) paths.Add(Bridge.Json(asset));
                entries.Append("{\"instanceID\":").Append(selected.GetInstanceID()).Append(",\"instanceId\":").Append(selected.GetInstanceID())
                    .Append(",\"name\":").Append(Bridge.Json(selected.name)).Append(",\"type\":").Append(Bridge.Json(selected.GetType().FullName))
                    .Append(",\"assetPath\":").Append(Bridge.Json(asset)).Append('}');
            }
            entries.Append(']');
            var active = Selection.activeObject;
            return "{\"objects\":" + entries + ",\"selection\":" + entries + ",\"activeInstanceID\":" + (active == null ? 0 : active.GetInstanceID()) +
                ",\"activeAsset\":" + Bridge.Json(active == null ? null : AssetDatabase.GetAssetPath(active)) + ",\"assetPaths\":[" + string.Join(",", paths.ToArray()) + "]}";
        }
    }
}
