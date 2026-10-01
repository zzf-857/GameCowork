using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEngine;

// Real GameView input observed by an actual game's OnGUI, in this test project only.
[ExecuteAlways]
public sealed class GameCoworkBridgeRuntimeFixture : MonoBehaviour
{
    int mouseEvents;
    readonly List<KeyObservation> keys = new List<KeyObservation>();
    int keyDownCount, keyUpCount;
    [Serializable] public sealed class KeyObservation
    {
        public int sequence, character;
        public string type, rawType, keyCode;
        public bool control, shift, alt, command;
    }
    void OnGUI()
    {
        string root = Path.GetFullPath(Path.Combine(Application.dataPath, "..")).Replace('\\', '/');
        if (!root.StartsWith("F:/AI/AgentMake/temp/GameCowork/tests/editor-bridge-", StringComparison.OrdinalIgnoreCase)) return;
        if (Event.current.type == EventType.MouseDown)
            File.WriteAllText(root + "/Temp/game-input.txt", (++mouseEvents).ToString());
        if (Event.current.type == EventType.KeyDown || Event.current.type == EventType.KeyUp)
        {
            var current = Event.current;
            if (current.type == EventType.KeyDown) keyDownCount++; else keyUpCount++;
            keys.Add(new KeyObservation { sequence = keys.Count + 1, type = current.type == EventType.KeyDown ? "KeyDown" : "KeyUp", rawType = current.type.ToString(),
                keyCode = current.keyCode.ToString(), character = current.character,
                control = current.control, shift = current.shift, alt = current.alt, command = current.command });
            string destination = Path.GetFullPath(Path.Combine(root, "../runtime-keyboard.json")), temporary = destination + ".tmp";
            File.WriteAllText(temporary, KeyboardJson());
            if (File.Exists(destination)) File.Replace(temporary, destination, null); else File.Move(temporary, destination);
        }
    }
    string KeyboardJson()
    {
        // Only integers, booleans and EventType/KeyCode enum names are serialized.
        // This fixture needs no additional Unity JSON module in its local manifest.
        var json = new StringBuilder("{\"inPlayMode\":").Append(Application.isPlaying ? "true" : "false")
            .Append(",\"keyDownCount\":").Append(keyDownCount)
            .Append(",\"keyUpCount\":").Append(keyUpCount).Append(",\"events\":[");
        for (int index = 0; index < keys.Count; index++)
        {
            var key = keys[index];
            if (index > 0) json.Append(',');
            json.Append("{\"sequence\":").Append(key.sequence)
                .Append(",\"type\":\"").Append(key.type).Append("\",\"rawType\":\"").Append(key.rawType)
                .Append("\",\"keyCode\":\"").Append(key.keyCode)
                .Append("\",\"character\":").Append(key.character)
                .Append(",\"control\":").Append(key.control ? "true" : "false")
                .Append(",\"shift\":").Append(key.shift ? "true" : "false")
                .Append(",\"alt\":").Append(key.alt ? "true" : "false")
                .Append(",\"command\":").Append(key.command ? "true" : "false").Append('}');
        }
        return json.Append("]}").ToString();
    }
}
