using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using UnityEditor;
using PackageInfo = UnityEditor.PackageManager.PackageInfo;
using UnityEngine;

namespace GameCowork.EditorBridge
{
    // Called only by Bridge.OnMain. No refresh/import, selection, scene, prefs,
    // manifest or UPM mutation. Preview requests use real native preview pixels.
    internal static class EditorAssetQueries
    {
        const int ScanLimit = 4096, PageLimit = 100, ResponseLimit = 900000;
        const int PreviewLimit = 131072, PreviewBudget = 393216, PreviewCountLimit = 4;
        [Serializable] sealed class ComponentInfo { public string typeName; public int instanceID; public bool missingScript; }
        [Serializable] sealed class AssetInfo
        {
            public string path, guid, assetType, name, fileName, lastWriteTimeUtc;
            public bool isFolder, componentsTruncated, previewRequested, previewReady;
            public int instanceID, previewWidth, previewHeight;
            public string previewBase64, previewStatus = "not-requested", previewReason;
            public ComponentInfo[] components;
        }
        [Serializable] sealed class SearchData
        {
            public int totalAssets, pageSize, pageNumber, returnedCount, scannedAssetCount, nativeMatchCount, invalidAssetCount;
            public bool totalAssetsExact, queryComplete, truncated, scanTruncated;
            public AssetInfo[] assets;
            public QueryIssue[] warnings;
        }
        [Serializable] sealed class QueryIssue { public string path, error; }
        [Serializable] sealed class SearchResult
        {
            public bool success = true, readOnly = true, queryComplete, truncated;
            public string projectRoot, scope = "asset-database-assets-and-registered-packages", filterLimitation;
            public SearchData data;
        }
        [Serializable] sealed class InfoResult
        {
            public bool success = true, readOnly = true, queryComplete, truncated;
            public string projectRoot, scope = "asset-database-assets-and-registered-packages", filterLimitation;
            public AssetInfo data;
        }
        sealed class Location { public string path, disk, root; public bool folder; }
        static object Value(Dictionary<string, object> input, string key) { object value; return input.TryGetValue(key, out value) ? value : null; }
        static string Text(Dictionary<string, object> input, string key, string fallback = null)
        { var value = Value(input, key); if (value == null) return fallback; if (!(value is string)) throw new ArgumentException(key + " must be a string"); return (string)value; }
        static bool Flag(Dictionary<string, object> input, string key, bool fallback = false)
        { var value = Value(input, key); if (value == null) return fallback; if (!(value is bool)) throw new ArgumentException(key + " must be a boolean"); return (bool)value; }
        static int Number(Dictionary<string, object> input, string key, int fallback, int limit)
        {
            var value = Value(input, key); if (value == null) return fallback;
            if (!(value is double) || double.IsNaN((double)value) || double.IsInfinity((double)value) || (double)value % 1 != 0 || (double)value < 1 || (double)value > limit)
                throw new ArgumentException(key + " must be an integer in 1.." + limit);
            return (int)(double)value;
        }
        static string Clip(string value, int limit) { return value == null ? "" : value.Length <= limit ? value : value.Substring(0, limit) + " [truncated]"; }
        internal static string NormalizePath(string path)
        {
            if (string.IsNullOrWhiteSpace(path) || path.Length > 2048 || path.IndexOf('\0') >= 0) throw new ArgumentException("A bounded asset path is required");
            path = path.Trim().Replace('\\', '/').TrimEnd('/');
            if (path.StartsWith("/", StringComparison.Ordinal) || Path.IsPathRooted(path) || path.IndexOf(':') >= 0) throw new ArgumentException("Asset path must be project-relative, not an absolute path or URL");
            foreach (var part in path.Split('/')) if (part.Length == 0 || part == "." || part == "..") throw new ArgumentException("Asset path contains an empty or traversal segment");
            if (path == "Assets" || path.StartsWith("Assets/", StringComparison.Ordinal) || path == "Packages" || path.StartsWith("Packages/", StringComparison.Ordinal)) return path;
            if (path.Equals("Assets", StringComparison.OrdinalIgnoreCase) || path.StartsWith("Assets/", StringComparison.OrdinalIgnoreCase) || path.Equals("Packages", StringComparison.OrdinalIgnoreCase) || path.StartsWith("Packages/", StringComparison.OrdinalIgnoreCase) || path.StartsWith("Library/", StringComparison.OrdinalIgnoreCase) || path.StartsWith("ProjectSettings/", StringComparison.OrdinalIgnoreCase) || path.StartsWith("Temp/", StringComparison.OrdinalIgnoreCase))
                throw new ArgumentException("Asset path must use the actual Assets or registered Packages namespace");
            return "Assets/" + path; // Original safe bare-relative Assets compatibility.
        }
        static bool Inside(string file, string root)
        {
            file = Path.GetFullPath(file).TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
            root = Path.GetFullPath(root).TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
            return string.Equals(file, root, StringComparison.OrdinalIgnoreCase) || file.StartsWith(root + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase);
        }
        static void CheckDisk(string file, string root)
        {
            if (!Inside(file, root)) throw new ArgumentException("Asset path is outside its registered physical root");
            string current = Path.GetFullPath(root), relative = Path.GetFullPath(file).Substring(current.TrimEnd(Path.DirectorySeparatorChar).Length).TrimStart(Path.DirectorySeparatorChar);
            if ((File.GetAttributes(current) & FileAttributes.ReparsePoint) != 0) throw new NotSupportedException("Linked asset roots are not supported by this query");
            foreach (var part in relative.Split(new[] { Path.DirectorySeparatorChar }, StringSplitOptions.RemoveEmptyEntries)) {
                current = Path.Combine(current, part);
                if ((File.GetAttributes(current) & FileAttributes.ReparsePoint) != 0) throw new NotSupportedException("Asset query does not follow junction or symbolic-link paths");
            }
        }
        static Location Resolve(string path, PackageInfo[] packages)
        {
            path = NormalizePath(path); string root, disk;
            if (path == "Assets" || path.StartsWith("Assets/", StringComparison.Ordinal)) {
                root = Application.dataPath; disk = path == "Assets" ? root : Path.Combine(root, path.Substring(7));
            } else {
                PackageInfo selected = null;
                foreach (var package in packages) {
                    if (package == null || string.IsNullOrEmpty(package.assetPath) || string.IsNullOrEmpty(package.resolvedPath)) continue;
                    if (path == package.assetPath || path.StartsWith(package.assetPath + "/", StringComparison.Ordinal)) {
                        if (selected == null || package.assetPath.Length > selected.assetPath.Length) selected = package;
                    }
                }
                if (selected == null) throw new ArgumentException("Asset is not in a currently registered package");
                root = selected.resolvedPath; disk = path == selected.assetPath ? root : Path.Combine(root, path.Substring(selected.assetPath.Length + 1));
            }
            disk = Path.GetFullPath(disk); CheckDisk(disk, root);
            bool folder = Directory.Exists(disk);
            if (!folder && !File.Exists(disk)) throw new FileNotFoundException("Asset backing file is missing; refresh the Editor explicitly", path);
            if (folder != AssetDatabase.IsValidFolder(path)) throw new InvalidOperationException("AssetDatabase and backing path disagree; refresh the Editor explicitly");
            if (string.IsNullOrEmpty(AssetDatabase.AssetPathToGUID(path))) throw new InvalidOperationException("Path has no registered AssetDatabase GUID");
            return new Location { path = path, disk = disk, root = root, folder = folder };
        }
        static void Preview(UnityEngine.Object asset, AssetInfo info, ref int byteBudget, ref int countBudget)
        {
            if (info.isFolder || asset == null) { info.previewStatus = "unsupported"; info.previewReason = "This asset has no native renderable object preview"; return; }
            if (SystemInfo.graphicsDeviceType == UnityEngine.Rendering.GraphicsDeviceType.Null) { info.previewStatus = "unsupported-no-graphics"; info.previewReason = "This Editor has no graphics device; no preview pixels were generated"; return; }
            if (countBudget <= 0 || byteBudget <= 0) { info.previewStatus = "budget-exhausted"; info.previewReason = "Native preview count/byte budget reached"; return; }
            countBudget--;
            Texture2D source = AssetPreview.GetAssetPreview(asset);
            if (source == null) { info.previewStatus = AssetPreview.IsLoadingAssetPreview(asset.GetInstanceID()) ? "pending" : "unavailable"; info.previewReason = "Native AssetPreview did not return preview pixels; a later explicit query may retry"; return; }
            if (source.width < 1 || source.height < 1) { info.previewStatus = "unavailable"; info.previewReason = "Native preview dimensions are invalid"; return; }
            float scale = Math.Min(1f, 256f / Math.Max(source.width, source.height));
            int width = Math.Max(1, Mathf.RoundToInt(source.width * scale)), height = Math.Max(1, Mathf.RoundToInt(source.height * scale));
            RenderTexture previous = RenderTexture.active, temporary = null; Texture2D readable = null;
            try {
                temporary = RenderTexture.GetTemporary(width, height, 0, RenderTextureFormat.ARGB32); Graphics.Blit(source, temporary); RenderTexture.active = temporary;
                readable = new Texture2D(width, height, TextureFormat.RGBA32, false); readable.ReadPixels(new Rect(0, 0, width, height), 0, 0); readable.Apply();
                byte[] png = readable.EncodeToPNG();
                if (png == null || png.Length == 0 || png.Length > PreviewLimit || png.Length > byteBudget) { info.previewStatus = "too-large"; info.previewReason = "Native preview PNG exceeds 128 KiB or remaining response preview budget"; return; }
                byteBudget -= png.Length; info.previewBase64 = Convert.ToBase64String(png); info.previewWidth = width; info.previewHeight = height; info.previewReady = true; info.previewStatus = "ready";
            } catch (Exception error) { info.previewStatus = "failed"; info.previewReason = Clip(error.Message, 1024); }
            finally { RenderTexture.active = previous; if (temporary != null) RenderTexture.ReleaseTemporary(temporary); if (readable != null) UnityEngine.Object.DestroyImmediate(readable); }
        }
        static AssetInfo Describe(Location location, bool preview, ref int bytes, ref int previews)
        {
            Type type = AssetDatabase.GetMainAssetTypeAtPath(location.path);
            var asset = AssetDatabase.LoadMainAssetAtPath(location.path);
            if (!location.folder && (type == null || asset == null)) throw new InvalidOperationException("Asset has not produced a usable imported main object");
            var info = new AssetInfo { path = location.path, guid = AssetDatabase.AssetPathToGUID(location.path), assetType = type == null ? "Unknown" : Clip(type.FullName, 512),
                name = Path.GetFileNameWithoutExtension(location.path), fileName = Path.GetFileName(location.path), isFolder = location.folder, instanceID = asset == null ? 0 : asset.GetInstanceID(),
                lastWriteTimeUtc = File.GetLastWriteTimeUtc(location.disk).ToString("o", CultureInfo.InvariantCulture), previewRequested = preview, components = new ComponentInfo[0] };
            var gameObject = asset as GameObject;
            if (gameObject != null) {
                var components = gameObject.GetComponents<Component>(); var described = new List<ComponentInfo>();
                for (int index = 0; index < Math.Min(components.Length, 32); index++) {
                    var component = components[index]; described.Add(new ComponentInfo { typeName = component == null ? "Missing Script" : Clip(component.GetType().FullName, 512), instanceID = component == null ? 0 : component.GetInstanceID(), missingScript = component == null });
                }
                info.components = described.ToArray(); info.componentsTruncated = components.Length > described.Count;
            }
            if (preview) Preview(asset, info, ref bytes, ref previews);
            return info;
        }
        static string Encode(object result)
        { string json = JsonUtility.ToJson(result); if (Encoding.UTF8.GetByteCount(json) > ResponseLimit) throw new InvalidOperationException("Asset response exceeds 900000 bytes; narrow the page or disable previews"); return json; }
        internal static string Invoke(string raw)
        {
            var envelope = EditorCancellation.Parse(raw); var input = Value(envelope, "params") as Dictionary<string, object>;
            if (input == null) throw new ArgumentException("Asset params object is required");
            string action = Text(input, "action"); bool preview = Flag(input, "generatePreview");
            var packages = PackageInfo.GetAllRegisteredPackages(); if (packages == null) throw new InvalidOperationException("Registered package snapshot is unavailable");
            if (packages.Length > 4096) throw new InvalidOperationException("Registered package snapshot exceeds 4096 mounts");
            int previewBytes = PreviewBudget, previewCount = PreviewCountLimit;
            if (action == "get_info") {
                var info = Describe(Resolve(Text(input, "path"), packages), preview, ref previewBytes, ref previewCount);
                bool infoComplete = info.assetType != "Unknown" && !info.componentsTruncated && (!preview || info.previewReady);
                return Encode(new InfoResult { data = info, projectRoot = Bridge.ProjectRoot, queryComplete = infoComplete, truncated = info.componentsTruncated,
                    filterLimitation = infoComplete ? null : "Imported type metadata, component bounds or explicitly requested native preview availability limit this result; metadata is not a preview success" });
            }
            if (action != "search") throw new NotSupportedException("Supported asset query actions: search, get_info; asset mutations are not executed by this handler");
            string pattern = Text(input, "searchPattern", ""), filterType = Text(input, "filterType", ""), scopePath = Text(input, "path", ""), dateText = Text(input, "filterDateAfter", "");
            if (pattern.Length > 512 || pattern.IndexOf('\0') >= 0) throw new ArgumentException("searchPattern exceeds 512 characters or contains NUL");
            if (filterType.Length > 128 || (filterType.Length > 0 && !Regex.IsMatch(filterType, "^[A-Za-z_][A-Za-z0-9_.]*$"))) throw new ArgumentException("filterType must be a bounded Unity asset type name");
            int pageSize = Number(input, "pageSize", 50, PageLimit), pageNumber = Number(input, "pageNumber", 1, 100000);
            DateTime after = DateTime.MinValue; bool dateFilter = dateText.Length > 0;
            if (dateFilter && (dateText.Length > 128 || !DateTime.TryParse(dateText, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out after))) throw new ArgumentException("filterDateAfter must be a valid UTC/ISO date");
            string[] folders = null;
            if (scopePath.Length > 0) {
                string scope = NormalizePath(scopePath);
                if (scope == "Packages") {
                    var registered = new List<string>(); foreach (var package in packages) if (package != null && !string.IsNullOrEmpty(package.assetPath) && AssetDatabase.IsValidFolder(package.assetPath)) registered.Add(package.assetPath);
                    folders = registered.ToArray();
                } else { var location = Resolve(scope, packages); if (!location.folder) throw new ArgumentException("Asset search path must be an actual registered folder"); folders = new[] { location.path }; }
            }
            string filter = pattern + (filterType.Length == 0 ? "" : " t:" + filterType);
            string[] guids = folders != null && folders.Length == 0 ? new string[0] : folders == null ? AssetDatabase.FindAssets(filter.Trim()) : AssetDatabase.FindAssets(filter.Trim(), folders);
            if (guids == null) throw new InvalidOperationException("AssetDatabase did not return its search snapshot");
            var paths = new List<string>(); var warnings = new List<QueryIssue>(); var unique = new HashSet<string>(StringComparer.Ordinal); var watch = Stopwatch.StartNew(); int scanned = 0, invalid = 0;
            foreach (string guid in guids) {
                if (scanned >= ScanLimit || watch.ElapsedMilliseconds >= 2500) break; scanned++;
                string path = AssetDatabase.GUIDToAssetPath(guid);
                if (string.IsNullOrEmpty(path) || (!path.StartsWith("Assets/", StringComparison.Ordinal) && path != "Assets" && !path.StartsWith("Packages/", StringComparison.Ordinal))) continue;
                try { var location = Resolve(path, packages); if (dateFilter && File.GetLastWriteTimeUtc(location.disk) <= after) continue; if (unique.Add(location.path)) paths.Add(location.path); }
                catch (Exception error) { invalid++; if (warnings.Count < 16) warnings.Add(new QueryIssue { path = Clip(path, 2048), error = Clip(error.Message, 1024) }); }
            }
            paths.Sort(StringComparer.Ordinal); var assets = new List<AssetInfo>(); int outputBytes = 0; bool byteTruncated = false, detailIncomplete = false;
            long first = (long)(pageNumber - 1) * pageSize;
            for (long index = first; index < paths.Count && index < first + pageSize; index++) {
                var info = Describe(Resolve(paths[(int)index], packages), preview, ref previewBytes, ref previewCount);
                int size = Encoding.UTF8.GetByteCount(JsonUtility.ToJson(info)); if (outputBytes + size > 800000) { byteTruncated = true; break; }
                outputBytes += size; assets.Add(info); if (info.assetType == "Unknown" || info.componentsTruncated || (preview && !info.previewReady)) detailIncomplete = true;
            }
            bool scanTruncated = scanned < guids.Length, truncated = scanTruncated || byteTruncated || detailIncomplete;
            bool completeSearch = !scanTruncated && invalid == 0, complete = completeSearch && !byteTruncated && !detailIncomplete;
            return Encode(new SearchResult { projectRoot = Bridge.ProjectRoot, queryComplete = complete, truncated = truncated,
                filterLimitation = complete ? null : "Search scan/time/response/component/preview bounds or unreadable registered backing paths limit this result",
                data = new SearchData { assets = assets.ToArray(), totalAssets = paths.Count, totalAssetsExact = completeSearch, pageSize = pageSize, pageNumber = pageNumber, returnedCount = assets.Count,
                    scannedAssetCount = scanned, nativeMatchCount = guids.Length, invalidAssetCount = invalid, warnings = warnings.ToArray(), queryComplete = complete, truncated = truncated, scanTruncated = scanTruncated } });
        }
    }
}
