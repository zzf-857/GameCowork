using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using Microsoft.Win32.SafeHandles;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace GameCowork.EditorBridge
{
    // Approved Agent writes only. Bridge dispatch supplies a registered nonce
    // lease; all validation precedes the single effect submission on main thread.
    internal static class EditorSceneMutations
    {
        [Serializable] sealed class Result
        {
            public bool success = true, applied = true, cancellationSupported = true;
            public bool changed, saved, dirty, undoSupported;
            public string operationId, projectRoot, command, action, scenePath;
            public int sceneHandle;
            public EditorSceneQueries.Node target;
        }
        [StructLayout(LayoutKind.Sequential)] struct FileIdentity
        {
            public uint Attributes, CreationLow, CreationHigh, AccessLow, AccessHigh, WriteLow, WriteHigh;
            public uint Volume, SizeHigh, SizeLow, Links, IndexHigh, IndexLow;
            public string Key { get { return Volume.ToString("X8") + ":" + IndexHigh.ToString("X8") + IndexLow.ToString("X8"); } }
        }
        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        static extern SafeFileHandle CreateFile(string name, uint access, uint share, IntPtr security, uint creation, uint flags, IntPtr template);
        [DllImport("kernel32.dll", SetLastError = true)]
        static extern bool GetFileInformationByHandle(SafeFileHandle file, out FileIdentity identity);
        static string originalRoot, rootIdentity, assetsIdentity, unavailable;
        static readonly Dictionary<int, string> SceneFiles = new Dictionary<int, string>();

        internal static bool Handles(string command, string action)
        { return command == "manage_gameobject" && (action == "create" || action == "modify") || command == "manage_scene" && action == "save"; }
        internal static void Initialize()
        {
            // Capture the original directory generation at bridge bootstrap,
            // never at first write. Failure disables writes, not read-only tools.
            try {
                if (Environment.OSVersion.Platform != PlatformID.Win32NT) throw new NotSupportedException("Scene writes currently require the verified Windows file identity API");
                originalRoot = Canonical(Bridge.ProjectRoot); NoLinks(originalRoot);
                rootIdentity = Identity(originalRoot, false).Key;
                assetsIdentity = Identity(Path.Combine(originalRoot, "Assets"), false).Key;
                EditorSceneManager.sceneOpened += (scene, mode) => CaptureScene(scene);
                EditorSceneManager.sceneSaved += CaptureScene;
                EditorSceneManager.sceneClosed += scene => SceneFiles.Remove(scene.handle);
                for (int index = 0; index < SceneManager.sceneCount; index++) CaptureScene(SceneManager.GetSceneAt(index));
            } catch (Exception error) { unavailable = error.Message; }
        }
        static void CaptureScene(Scene scene)
        {
            try {
                if (!Ordinary(scene) || string.IsNullOrEmpty(scene.path)) return;
                string file = Canonical(Path.Combine(originalRoot, ScenePath(scene.path))); NoLinks(file);
                SceneFiles[scene.handle] = scene.path + "|" + Identity(file, true).Key;
            } catch { SceneFiles.Remove(scene.handle); } // Unsafe saved scenes remain ineligible for writes.
        }
        static string Canonical(string path) { return Path.GetFullPath(path).TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar); }
        static FileIdentity Identity(string path, bool file)
        {
            using (var handle = CreateFile(path, 0, 3, IntPtr.Zero, 3, 0x02000000 | 0x00200000, IntPtr.Zero)) {
                FileIdentity result;
                if (handle.IsInvalid || !GetFileInformationByHandle(handle, out result)) throw new IOException("Cannot verify scene storage identity", Marshal.GetLastWin32Error());
                if ((result.Attributes & (uint)FileAttributes.ReparsePoint) != 0 || file && result.Links != 1) throw new IOException("Scene storage links are unsupported");
                return result;
            }
        }
        static void NoLinks(string path)
        {
            for (string cursor = Canonical(path); !string.IsNullOrEmpty(cursor); cursor = Path.GetDirectoryName(cursor))
                if ((File.GetAttributes(cursor) & FileAttributes.ReparsePoint) != 0) throw new IOException("Linked scene storage is unsupported");
        }
        static void ValidateRoot(EditorCancellation.Lease lease)
        {
            if (lease == null) throw new ArgumentException("Scene mutation requires an originating secure request identity");
            if (!string.IsNullOrEmpty(unavailable) || string.IsNullOrEmpty(originalRoot)) throw new IOException("Scene mutation storage is unavailable: " + (unavailable ?? "Bridge bootstrap identity missing"));
            if (lease.DomainId != Bridge.EditorDomain || !string.Equals(Canonical(lease.Root), originalRoot, StringComparison.OrdinalIgnoreCase) ||
                !string.Equals(Canonical(Bridge.ProjectRoot), originalRoot, StringComparison.OrdinalIgnoreCase) ||
                !string.Equals(Canonical(Path.Combine(Application.dataPath, "..")), originalRoot, StringComparison.OrdinalIgnoreCase))
                throw new ArgumentException("Scene mutation targets an obsolete project or Editor domain");
            NoLinks(originalRoot); NoLinks(Path.Combine(originalRoot, "Assets"));
            if (Identity(originalRoot, false).Key != rootIdentity || Identity(Path.Combine(originalRoot, "Assets"), false).Key != assetsIdentity)
                throw new IOException("Original scene project storage was replaced");
        }
        static object Value(Dictionary<string, object> input, string key) { object value; return input.TryGetValue(key, out value) ? value : null; }
        static string Text(Dictionary<string, object> input, string key, string fallback = null)
        { object value = Value(input, key); if (value == null) return fallback; if (!(value is string)) throw new ArgumentException(key + " must be a string"); return (string)value; }
        static void Keys(Dictionary<string, object> input, params string[] allowed)
        { var keys = new HashSet<string>(allowed, StringComparer.Ordinal); foreach (string key in input.Keys) if (!keys.Contains(key)) throw new NotSupportedException("Unsupported scene mutation parameter: " + key); }
        static Vector3? Vector(Dictionary<string, object> input, string key)
        {
            if (!input.ContainsKey(key)) return null;
            var values = Value(input, key) as List<object>;
            if (values == null || values.Count != 3) throw new ArgumentException(key + " must contain exactly three finite numbers");
            var numbers = new float[3];
            for (int index = 0; index < 3; index++) {
                if (!(values[index] is double)) throw new ArgumentException(key + " must contain exactly three finite numbers");
                double value = (double)values[index];
                if (double.IsNaN(value) || double.IsInfinity(value) || Math.Abs(value) > 1000000) throw new ArgumentException(key + " contains an invalid or out-of-range number");
                numbers[index] = (float)value;
            }
            return new Vector3(numbers[0], numbers[1], numbers[2]);
        }
        static bool? Active(Dictionary<string, object> input)
        { if (!input.ContainsKey("setActive")) return null; var value = Value(input, "setActive"); if (!(value is bool)) throw new ArgumentException("setActive must be a boolean"); return (bool)value; }
        static void Budget(Dictionary<string, object> input)
        {
            if (!input.ContainsKey("timeoutSeconds")) return;
            var value = Value(input, "timeoutSeconds");
            if (!(value is double) || (double)value % 1 != 0 || (double)value < 1 || (double)value > 180)
                throw new ArgumentException("timeoutSeconds must be an integer in 1..180");
            // This is the client's response budget, never proof of completion.
            // The originating nonce cancellation still controls effect admission.
        }
        static bool Ordinary(Scene scene)
        {
            if (!scene.IsValid() || !scene.isLoaded || EditorSceneManager.IsPreviewScene(scene)) return false;
            for (int index = 0; index < SceneManager.sceneCount; index++) if (SceneManager.GetSceneAt(index).handle == scene.handle) return true;
            return false;
        }
        static int SceneHandle(object value)
        {
            if (!(value is double) || (double)value % 1 != 0 || (double)value < int.MinValue || (double)value > int.MaxValue) throw new ArgumentException("sceneHandle requires an exact signed integer");
            return (int)(double)value;
        }
        static string ScenePath(string path)
        {
            if (string.IsNullOrEmpty(path) || path.Length > 2048 || Path.IsPathRooted(path) || path.IndexOf(':') >= 0 || path.IndexOf('\\') >= 0 || !path.StartsWith("Assets/", StringComparison.Ordinal))
                throw new ArgumentException("Scene path must be an existing Assets-relative scene path");
            foreach (var part in path.Split('/')) if (part == ".." || part == "." || part.Length == 0) throw new ArgumentException("Scene path traversal is unsupported");
            if (!path.EndsWith(".unity", StringComparison.OrdinalIgnoreCase) && !path.EndsWith(".scene", StringComparison.OrdinalIgnoreCase)) throw new ArgumentException("Scene path requires .unity or .scene extension");
            return path;
        }
        static Scene SaveTarget(Dictionary<string, object> input)
        {
            string path = Text(input, "path"); if (input.ContainsKey("path")) path = ScenePath(path);
            int? handle = input.ContainsKey("sceneHandle") ? (int?)SceneHandle(Value(input, "sceneHandle")) : null;
            Scene result = default(Scene); int matches = 0;
            if (path == null && !handle.HasValue) result = SceneManager.GetActiveScene();
            else for (int index = 0; index < SceneManager.sceneCount; index++) {
                Scene current = SceneManager.GetSceneAt(index);
                if ((!handle.HasValue || current.handle == handle.Value) && (path == null || current.path == path)) { result = current; matches++; }
            }
            if ((path != null || handle.HasValue) && matches != 1 || !Ordinary(result)) throw new ArgumentException("Exactly one currently loaded ordinary scene must match; no scene was opened");
            ScenePath(result.path); return result;
        }
        static void Storage(Scene scene)
        {
            string relative = ScenePath(scene.path), full = Canonical(Path.Combine(originalRoot, relative));
            if (!full.StartsWith(originalRoot + Path.DirectorySeparatorChar + "Assets" + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase)) throw new ArgumentException("Scene storage is outside this project");
            NoLinks(full); string known;
            if (!SceneFiles.TryGetValue(scene.handle, out known) || known != scene.path + "|" + Identity(full, true).Key)
                throw new IOException("Loaded scene storage was replaced or its original identity is unavailable");
            if ((File.GetAttributes(full) & FileAttributes.ReadOnly) != 0) throw new IOException("Scene storage is read-only");
        }
        internal static string Invoke(string command, string raw, EditorCancellation.Lease identity)
        {
            var envelope = EditorCancellation.Parse(raw); var input = Value(envelope, "params") as Dictionary<string, object>;
            if (input == null) throw new ArgumentException("Scene mutation params object is required");
            string action = Text(input, "action"); if (!Handles(command, action)) throw new NotSupportedException("Unsupported scene mutation: " + command + "/" + action);
            Budget(input);
            ValidateRoot(identity);
            if (EditorApplication.isPlayingOrWillChangePlaymode || EditorApplication.isCompiling || EditorApplication.isUpdating) throw new InvalidOperationException("Scene authoring requires an idle Editor outside Play Mode");
            GameObject target = null, parent = null; Scene scene; Vector3? position = null, rotation = null, scale = null; bool? active = null; string name = null;
            if (action == "save") {
                Keys(input, "action", "path", "sceneHandle", "timeoutSeconds"); scene = SaveTarget(input); Storage(scene);
            } else {
                if (action == "create") {
                    Keys(input, "action", "name", "parent", "position", "rotation", "scale", "setActive", "timeoutSeconds"); name = Text(input, "name");
                    if (string.IsNullOrWhiteSpace(name) || name.Length > 256 || name.IndexOf('\0') >= 0) throw new ArgumentException("create requires a non-empty name of at most 256 characters");
                    if (input.ContainsKey("parent")) { var selector = new Dictionary<string, object> { { "target", Value(input, "parent") } }; parent = EditorSceneQueries.Target(selector); }
                    scene = parent == null ? SceneManager.GetActiveScene() : parent.scene;
                } else {
                    Keys(input, "action", "target", "searchMethod", "position", "rotation", "scale", "setActive", "timeoutSeconds"); target = EditorSceneQueries.Target(input); scene = target.scene;
                    if (!input.ContainsKey("position") && !input.ContainsKey("rotation") && !input.ContainsKey("scale") && !input.ContainsKey("setActive")) throw new ArgumentException("modify requires position, rotation, scale or setActive");
                }
                if (!Ordinary(scene)) throw new ArgumentException("Mutation requires a loaded ordinary scene");
                position = Vector(input, "position"); rotation = Vector(input, "rotation"); scale = Vector(input, "scale"); active = Active(input);
            }
            // Read/verify the original bytes before submitting any effect. A
            // queued cancellation during a large file hash still prevents save.
            byte[] beforeSave = action == "save" ? HashScene(scene.path) : null;
            string operation = Guid.NewGuid().ToString("N"); EditorCancellation.Accepted(identity, operation);
            // Repeat physical/root checks immediately before committing. There
            // is no automatic rollback after BeginEffect; failure remains failed.
            ValidateRoot(identity); if (action == "save") Storage(scene);
            if (!EditorCancellation.BeginEffect(identity)) throw new OperationCanceledException("Scene mutation cancelled before applying its effect");
            bool changed = false, saved = false;
            try {
                if (action == "save") {
                    saved = EditorSceneManager.SaveScene(scene); if (!saved) throw new IOException("Editor did not save the loaded scene; files may have changed");
                    changed = !EqualBytes(beforeSave, HashScene(scene.path));
                }
                else {
                    Undo.IncrementCurrentGroup(); int undo = Undo.GetCurrentGroup(); Undo.SetCurrentGroupName("GameCowork " + action);
                    if (action == "create") {
                        target = new GameObject(name); Undo.RegisterCreatedObjectUndo(target, "GameCowork create");
                        if (target.scene.handle != scene.handle) SceneManager.MoveGameObjectToScene(target, scene);
                        if (parent != null) Undo.SetTransformParent(target.transform, parent.transform, "GameCowork create parent"); changed = true;
                    }
                    Undo.RecordObjects(new UnityEngine.Object[] { target, target.transform }, "GameCowork " + action);
                    if (position.HasValue) { changed |= target.transform.localPosition != position.Value; target.transform.localPosition = position.Value; }
                    if (rotation.HasValue) { changed |= target.transform.localEulerAngles != rotation.Value; target.transform.localEulerAngles = rotation.Value; }
                    if (scale.HasValue) { changed |= target.transform.localScale != scale.Value; target.transform.localScale = scale.Value; }
                    if (active.HasValue) { changed |= target.activeSelf != active.Value; target.SetActive(active.Value); }
                    if (PrefabUtility.IsPartOfPrefabInstance(target)) { PrefabUtility.RecordPrefabInstancePropertyModifications(target); PrefabUtility.RecordPrefabInstancePropertyModifications(target.transform); }
                    if (changed) EditorSceneManager.MarkSceneDirty(scene);
                    Undo.FlushUndoRecordObjects(); Undo.CollapseUndoOperations(undo);
                }
                var result = new Result { operationId = operation, projectRoot = Bridge.ProjectRoot, command = command, action = action,
                    changed = changed, saved = saved, dirty = scene.isDirty, undoSupported = action != "save", scenePath = scene.path, sceneHandle = scene.handle,
                    target = target == null ? null : EditorSceneQueries.Describe(target) };
                EditorCancellation.Finish(identity, "completed"); return JsonUtility.ToJson(result);
            } catch { EditorCancellation.Finish(identity, "failed"); throw; }
        }
        static bool EqualBytes(byte[] a, byte[] b)
        { if (a.Length != b.Length) return false; for (int index = 0; index < a.Length; index++) if (a[index] != b[index]) return false; return true; }
        static byte[] HashScene(string relative)
        { using (var file = File.OpenRead(Path.Combine(originalRoot, ScenePath(relative)))) using (var hash = SHA256.Create()) return hash.ComputeHash(file); }
    }
}
