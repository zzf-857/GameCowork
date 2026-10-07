using System;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using System.Text;
using UnityEditor;
using UnityEngine;

namespace GameCowork.EditorBridge
{
    // All APIs are invoked by Bridge.OnMain. Get never changes Console flags,
    // search, Collapse or EditorPrefs: it reports the current native view scope.
    internal static class EditorConsole
    {
        const BindingFlags Static = BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic;
        const BindingFlags Instance = BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic;
        const int ScanLimit = 8192, ByteLimit = 800000;
        [Serializable] sealed class Entry { public string type, message, file, stackTrace; public int line, count, nativeMode; public bool textTruncated; }
        [Serializable] sealed class Result
        {
            public bool success = true, truncated, scanTruncated, nativeConsoleFiltersApplied = true, editorPrefsModified = false, queryComplete;
            public int totalCount, matchedCount, returnedCount, consoleFlags, globalErrorCount, globalWarningCount, globalLogCount;
            public bool collapse;
            public string projectRoot, uiFilterText, scope = "current-native-console-view", timestampFilter = "unsupported", filterLimitation;
            public Entry[] data;
        }
        [Serializable] sealed class PlainResult
        {
            public bool success = true, truncated, scanTruncated, nativeConsoleFiltersApplied = true, editorPrefsModified = false, queryComplete;
            public int totalCount, matchedCount, returnedCount, consoleFlags, globalErrorCount, globalWarningCount, globalLogCount;
            public bool collapse;
            public string projectRoot, uiFilterText, scope = "current-native-console-view", timestampFilter = "unsupported", filterLimitation;
            public string[] data;
        }
        static object Value(Dictionary<string, object> input, string key) { object value; return input != null && input.TryGetValue(key, out value) ? value : null; }
        static string Text(Dictionary<string, object> input, string key, string fallback = null)
        { var value = Value(input, key); if (value == null) return fallback; if (!(value is string)) throw new ArgumentException(key + " must be a string"); return (string)value; }
        static Type LogEntries { get { return typeof(EditorWindow).Assembly.GetType("UnityEditor.LogEntries"); } }
        static MethodInfo Method(string name)
        { var type = LogEntries; var method = type == null ? null : type.GetMethod(name, Static); if (method == null) throw new NotSupportedException("This Editor does not expose Console " + name); return method; }
        static string Clip(string value, int limit) { return value != null && value.Length > limit ? value.Substring(0, limit) + " [truncated]" : value ?? ""; }
        static string Severity(int mode)
        {
            var type = typeof(EditorWindow).Assembly.GetType("UnityEditor.LogMessageFlags");
            if (type == null || !type.IsEnum) throw new NotSupportedException("This Editor lacks verifiable native Console severity flags");
            if ((mode & Flag(type, "kScriptingException")) != 0) return "exception";
            if ((mode & (Flag(type, "kAssert") | Flag(type, "kScriptingAssertion"))) != 0) return "assert";
            if ((mode & (Flag(type, "kError") | Flag(type, "kFatal") | Flag(type, "kAssetImportError") | Flag(type, "kScriptingError") | Flag(type, "kScriptCompileError") | CompatibleModeFlag(type, "GraphCompileError") | CompatibleModeFlag(type, "VisualScriptingError"))) != 0) return "error";
            if ((mode & (Flag(type, "kAssetImportWarning") | Flag(type, "kScriptingWarning") | Flag(type, "kScriptCompileWarning"))) != 0) return "warning";
            if ((mode & (Flag(type, "kLog") | Flag(type, "kScriptingLog"))) != 0) return "log";
            return "unknown";
        }
        static int Flag(Type type, string name)
        { var field = type.GetField(name, BindingFlags.Public | BindingFlags.Static); if (field == null) throw new NotSupportedException("Missing native Console severity flag " + name); return Convert.ToInt32(field.GetRawConstantValue()); }
        static int CompatibleModeFlag(Type nativeFlags, string name)
        {
            var type = typeof(EditorWindow).Assembly.GetType("UnityEditor.ConsoleWindow+Mode");
            var field = type == null ? null : type.GetField(name, BindingFlags.Public | BindingFlags.Static); if (field == null) return 0;
            int value = Convert.ToInt32(field.GetRawConstantValue());
            // Some ConsoleWindow enums retain obsolete names whose bit is now
            // native stacktrace metadata. Never turn that metadata into errors.
            foreach (var native in nativeFlags.GetFields(BindingFlags.Public | BindingFlags.Static))
                if ((Convert.ToInt32(native.GetRawConstantValue()) & value) != 0) return 0;
            return value;
        }
        static void Split(string raw, out string message, out string stack)
        {
            var lines = (raw ?? "").Replace("\r\n", "\n").Split('\n'); int first = lines.Length;
            for (int index = 0; index < lines.Length; index++) {
                string line = lines[index].TrimStart();
                if (line.StartsWith("UnityEngine.Debug:", StringComparison.Ordinal) || line.StartsWith("at ", StringComparison.Ordinal) || line.Contains(" (at ")) { first = index; break; }
            }
            message = string.Join("\n", lines, 0, first); stack = string.Join("\n", lines, first, lines.Length - first);
        }
        internal static string Invoke(string raw, EditorCancellation.Lease identity)
        {
            Dictionary<string, object> envelope = EditorCancellation.Parse(raw), input = Value(envelope, "params") as Dictionary<string, object>;
            if (input == null) throw new ArgumentException("Console params object is required");
            string action = Text(input, "action", "get");
            if (action == "clear") {
                if (Text(input, "scope", "all") != "all") throw new NotSupportedException("Selective errors_only clearing is unsupported; no Console entries were cleared");
                var clear = Method("Clear");
                if (identity == null) throw new ArgumentException("Console clear requires an originating secure request identity");
                string operation = Guid.NewGuid().ToString("N"); EditorCancellation.Accepted(identity, operation);
                if (!EditorCancellation.BeginEffect(identity)) throw new OperationCanceledException("Console clear cancelled before applying its effect");
                try {
                    clear.Invoke(null, null); EditorCancellation.Finish(identity, "completed");
                    return "{\"success\":true,\"cleared\":true,\"applied\":true,\"cancellationSupported\":true,\"scope\":\"all\",\"operationId\":" + Bridge.Json(operation) + ",\"projectRoot\":" + Bridge.Json(Bridge.ProjectRoot) + "}";
                } catch { EditorCancellation.Finish(identity, "failed"); throw; }
            }
            if (action != "get") throw new NotSupportedException("Unsupported read_console action: " + action + "; available: get, clear(all)");
            if (!string.IsNullOrEmpty(Text(input, "sinceTimestamp"))) throw new NotSupportedException("Timestamp filtering is unsupported; no incremental Console snapshot is claimed");
            int count = 200; var requested = Value(input, "count");
            if (requested != null) {
                if (!(requested is double) || (double)requested % 1 != 0 || (double)requested < 1 || (double)requested > 1000) throw new ArgumentException("count must be an integer in 1..1000");
                count = (int)(double)requested;
            }
            string format = Text(input, "format", "detailed"), filter = Text(input, "filterText", "");
            if (format != "plain" && format != "detailed" && format != "json") throw new ArgumentException("format must be plain, detailed or json");
            if (filter.Length > 2048) throw new ArgumentException("filterText exceeds 2048 characters");
            bool includeStack = true; var include = Value(input, "includeStacktrace");
            if (include != null) { if (!(include is bool)) throw new ArgumentException("includeStacktrace must be a boolean"); includeStack = (bool)include; }
            var types = new HashSet<string>(StringComparer.Ordinal); var requestedTypes = Value(input, "types");
            if (requestedTypes == null) types.UnionWith(new[] { "error", "warning", "log" });
            else {
                var list = requestedTypes as List<object>; if (list == null || list.Count > 6) throw new ArgumentException("types must be a bounded array");
                foreach (var item in list) { string type = item as string; if (type != "all" && type != "error" && type != "warning" && type != "log" && type != "assert" && type != "exception") throw new ArgumentException("Unknown Console type"); types.Add(type); }
            }
            var entryType = typeof(EditorWindow).Assembly.GetType("UnityEditor.LogEntry");
            if (entryType == null) throw new NotSupportedException("This Editor lacks structured Console entries");
            FieldInfo mode = entryType.GetField("mode", Instance), messageField = entryType.GetField("message", Instance), fileField = entryType.GetField("file", Instance), lineField = entryType.GetField("line", Instance);
            if (mode == null || messageField == null || fileField == null || lineField == null) throw new NotSupportedException("Structured Console fields are unavailable");
            MethodInfo start = Method("StartGettingEntries"), end = Method("EndGettingEntries"), get = Method("GetEntryInternal"), getCount = Method("GetCount");
            var flagsProperty = LogEntries.GetProperty("consoleFlags", Static);
            if (flagsProperty == null || !flagsProperty.CanRead) throw new NotSupportedException("Actual Console view flags are unavailable");
            var flagsType = typeof(EditorWindow).Assembly.GetType("UnityEditor.ConsoleWindow+ConsoleFlags");
            if (flagsType == null || !flagsType.IsEnum) throw new NotSupportedException("Native Console UI flag identities are unavailable");
            int flags = Convert.ToInt32(flagsProperty.GetValue(null, null)); bool collapse = (flags & Flag(flagsType, "Collapse")) != 0;
            MethodInfo frequency = LogEntries.GetMethod("GetEntryCount", Static), search = LogEntries.GetMethod("GetFilteringText", Static);
            if (collapse && frequency == null) throw new NotSupportedException("Actual collapsed occurrence counts are unavailable");
            if (search == null) throw new NotSupportedException("Native Console search scope is unavailable");
            string uiFilter = search.Invoke(null, null) as string;
            object[] counts = { 0, 0, 0 }; Method("GetCountsByType").Invoke(null, counts);
            var rows = new List<Entry>(); var plain = new List<string>(); int total = 0, matched = 0, bytes = 0; bool begun = false, byteTruncated = false;
            try {
                var begunCount = start.Invoke(null, null); begun = true; total = begunCount is int ? (int)begunCount : Convert.ToInt32(getCount.Invoke(null, null));
                if (total < 0) throw new InvalidOperationException("Console count is invalid");
                var entry = Activator.CreateInstance(entryType);
                for (int index = 0; index < Math.Min(total, ScanLimit); index++) {
                    object[] arguments = { index, entry }; var found = get.Invoke(null, arguments); if (found is bool && !(bool)found) continue; entry = arguments[1];
                    string type = Severity(Convert.ToInt32(mode.GetValue(entry))), rawMessage = messageField.GetValue(entry) as string ?? "";
                    if (type == "unknown" && !types.Contains("all")) throw new NotSupportedException("This native Console mode cannot be classified safely for the requested severity filter");
                    if (!types.Contains("all") && !types.Contains(type) && !(types.Contains("error") && (type == "assert" || type == "exception"))) continue;
                    if (filter.Length > 0 && rawMessage.IndexOf(filter, StringComparison.OrdinalIgnoreCase) < 0) continue; matched++;
                    if (rows.Count >= count) continue; string body, stack; Split(rawMessage, out body, out stack);
                    var row = new Entry { type = type, nativeMode = Convert.ToInt32(mode.GetValue(entry)), message = Clip(body, 8192), stackTrace = includeStack ? Clip(stack, 8192) : "", file = Clip(fileField.GetValue(entry) as string, 2048), line = Convert.ToInt32(lineField.GetValue(entry)), count = collapse ? Convert.ToInt32(frequency.Invoke(null, new object[] { index })) : 1, textTruncated = body.Length > 8192 || (includeStack && stack.Length > 8192) };
                    int size = Encoding.UTF8.GetByteCount(JsonUtility.ToJson(row)); if (bytes + size > ByteLimit) { byteTruncated = true; continue; } bytes += size; rows.Add(row); plain.Add("[" + type + "] " + row.message + (includeStack && row.stackTrace.Length > 0 ? "\n" + row.stackTrace : ""));
                }
            } finally { if (begun) end.Invoke(null, null); }
            bool scanTruncated = total > ScanLimit, truncated = scanTruncated || matched > rows.Count || byteTruncated;
            int requestedLevels = Flag(flagsType, "LogLevelLog") | Flag(flagsType, "LogLevelWarning") | Flag(flagsType, "LogLevelError");
            // Unseen native rows cannot be reclassified by this adapter. Require
            // every native source level before claiming a complete type filter.
            bool complete = (flags & requestedLevels) == requestedLevels && string.IsNullOrEmpty(uiFilter) && !collapse && !truncated;
            string limitation = complete ? null : "Native Console severity/search/Collapse filters or bounds limit this snapshot; hidden entries are unsupported without changing global Editor preferences";
            string result = format == "plain" ? JsonUtility.ToJson(new PlainResult { data = plain.ToArray(), totalCount = total, matchedCount = matched, returnedCount = rows.Count, truncated = truncated, scanTruncated = scanTruncated, consoleFlags = flags, collapse = collapse, projectRoot = Bridge.ProjectRoot, uiFilterText = Clip(uiFilter, 512), queryComplete = complete, filterLimitation = limitation, globalErrorCount = Convert.ToInt32(counts[0]), globalWarningCount = Convert.ToInt32(counts[1]), globalLogCount = Convert.ToInt32(counts[2]) }) :
                JsonUtility.ToJson(new Result { data = rows.ToArray(), totalCount = total, matchedCount = matched, returnedCount = rows.Count, truncated = truncated, scanTruncated = scanTruncated, consoleFlags = flags, collapse = collapse, projectRoot = Bridge.ProjectRoot, uiFilterText = Clip(uiFilter, 512), queryComplete = complete, filterLimitation = limitation, globalErrorCount = Convert.ToInt32(counts[0]), globalWarningCount = Convert.ToInt32(counts[1]), globalLogCount = Convert.ToInt32(counts[2]) });
            if (Encoding.UTF8.GetByteCount(result) > 900000) throw new InvalidOperationException("Console response exceeds its bounded limit"); return result;
        }
    }
}
