using System;
using System.IO;
using System.Reflection;
using UnityEditor;
using UnityEngine;
public static class GameCoworkConsoleFixture
{
    static string root; static double started;
    public static void Boot()
    {
        root = Path.GetFullPath(Path.Combine(Application.dataPath, "..")).Replace('\\', '/');
        if (!root.StartsWith("F:/AI/AgentMake/temp/GameCowork/tests/editor-bridge-console-", StringComparison.OrdinalIgnoreCase)) throw new InvalidOperationException("Own console fixture scope required");
        Debug.Log("GCW_CONSOLE_LOG\nGCW_CONSOLE_MULTILINE"); Debug.LogWarning("GCW_CONSOLE_WARNING"); Debug.LogError("GCW_CONSOLE_ERROR");
        Debug.LogException(new InvalidOperationException("GCW_CONSOLE_EXCEPTION")); Debug.LogAssertion("GCW_CONSOLE_ASSERT");
        Debug.Log("GCW_CONSOLE_DUPLICATE"); Debug.Log("GCW_CONSOLE_DUPLICATE");
        started = EditorApplication.timeSinceStartup; EditorApplication.update += Tick;
        WriteState("ready.json");
        var methods = typeof(EditorWindow).Assembly.GetType("UnityEditor.LogEntries").GetMethods(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);
        var metadata = new System.Text.StringBuilder(); foreach (var method in methods) metadata.AppendLine(method.ToString());
        foreach (var type in typeof(EditorWindow).Assembly.GetTypes()) if (type.IsEnum && (type.FullName.Contains("Log") || type.FullName.Contains("Console"))) { metadata.AppendLine(type.FullName); foreach (var field in type.GetFields(BindingFlags.Public | BindingFlags.Static)) metadata.AppendLine(field.Name + "=" + field.GetRawConstantValue()); }
        File.WriteAllText(root + "/Temp/console-api-metadata.txt", metadata.ToString());
        var entryType = typeof(EditorWindow).Assembly.GetType("UnityEditor.LogEntry");
        var flagType = typeof(EditorWindow).Assembly.GetType("UnityEditor.LogMessageFlags");
        Type reader = null;
        foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies()) { reader = assembly.GetType("GameCowork.EditorBridge.EditorConsole"); if (reader != null) break; }
        var severity = reader.GetMethod("Severity", BindingFlags.NonPublic | BindingFlags.Static);
        var modes = new System.Text.StringBuilder();
        foreach (string name in new[] { "kScriptCompileError", "kScriptCompileWarning", "kScriptingError", "kScriptingWarning" }) {
            int mode = Convert.ToInt32(flagType.GetField(name).GetRawConstantValue()); var entry = Activator.CreateInstance(entryType);
            entryType.GetField("mode", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).SetValue(entry, mode);
            entryType.GetField("message", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).SetValue(entry, "GCW_CONSOLE_NATIVE_" + name);
            typeof(EditorWindow).Assembly.GetType("UnityEditor.LogEntries").GetMethod("AddMessageWithDoubleClickCallback", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static).Invoke(null, new[] { entry });
            modes.AppendLine(name + "=" + mode + ":" + severity.Invoke(null, new object[] { mode }));
        }
        modes.AppendLine("pure4096=" + severity.Invoke(null, new object[] { 4096 })); modes.AppendLine("pure8192=" + severity.Invoke(null, new object[] { 8192 }));
        var graphType = typeof(EditorWindow).Assembly.GetType("UnityEditor.ConsoleWindow+Mode"); int graphMode = Convert.ToInt32(graphType.GetField("GraphCompileError").GetRawConstantValue());
        var graphEntry = Activator.CreateInstance(entryType); entryType.GetField("mode", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).SetValue(graphEntry, graphMode); entryType.GetField("message", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).SetValue(graphEntry, "GCW_CONSOLE_NATIVE_GRAPH");
        typeof(EditorWindow).Assembly.GetType("UnityEditor.LogEntries").GetMethod("AddMessageWithDoubleClickCallback", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static).Invoke(null, new[] { graphEntry });
        modes.AppendLine("GraphCompileError=" + graphMode + ":" + severity.Invoke(null, new object[] { graphMode }));
        File.WriteAllText(root + "/Temp/native-mode-evidence.txt", modes.ToString());
    }
    static void WriteState(string file)
    {
        var type = typeof(EditorWindow).Assembly.GetType("UnityEditor.LogEntries");
        var flags = type.GetProperty("consoleFlags", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);
        var search = type.GetMethod("GetFilteringText", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);
        string filter = search == null ? "" : search.Invoke(null, null) as string ?? "";
        File.WriteAllText(root + "/Temp/" + file, "{\"pid\":" + System.Diagnostics.Process.GetCurrentProcess().Id + ",\"flags\":" + flags.GetValue(null, null) + ",\"filter\":" + JsonUtility.ToJson(new Filter { value = filter }) + "}");
    }
    [Serializable] sealed class Filter { public string value; }
    static void Tick()
    {
        if (File.Exists(root + "/Temp/observe")) { File.Delete(root + "/Temp/observe"); WriteState("observed.json"); }
        if (File.Exists(root + "/Temp/busy")) { File.Delete(root + "/Temp/busy"); File.WriteAllText(root + "/Temp/busy-started", "started"); System.Threading.Thread.Sleep(2000); }
        if (File.Exists(root + "/Temp/exit") || EditorApplication.timeSinceStartup - started > 240) { EditorApplication.update -= Tick; EditorApplication.Exit(0); }
    }
}
