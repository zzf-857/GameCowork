using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

// Copied only into a unique temp project by editor-bridge-smoke.mjs.
public static class GameCoworkBridgeFixture
{
    static GameObject cube;
    static SceneView view;
    static string root;
    static double started;
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern bool MoveFileEx(string from, string to, uint flags);
    static void WriteObservation(string path, string value)
    {
        string pending = path + ".writing";
        File.WriteAllText(pending, value);
        // Mono's managed File.Replace can expose a missing destination between
        // file operations. NT's same-volume rename is atomic for the observer.
        if (!MoveFileEx(pending, path, 1 | 8)) throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());
    }
    [Serializable] sealed class FixtureSession { public double started; public int pid; }
    [InitializeOnLoadMethod]
    static void OnLoad() { EditorApplication.delayCall += ResumeAfterReload; }
    static void ResumeAfterReload()
    {
        string candidate = Path.GetFullPath(Path.Combine(Application.dataPath, "..")).Replace('\\', '/');
        if (!candidate.StartsWith("F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests/editor-bridge-", StringComparison.OrdinalIgnoreCase)) return;
        string marker = candidate + "/Temp/fixture-session.json";
        if (!File.Exists(marker)) return;
        var session = JsonUtility.FromJson<FixtureSession>(File.ReadAllText(marker));
        if (session.pid != Process.GetCurrentProcess().Id) return;
        root = candidate; started = session.started;
        cube = GameObject.Find("GameCowork real preview fixture cube");
        foreach (var current in Resources.FindObjectsOfTypeAll<SceneView>()) { view = current; break; }
        EditorApplication.update -= Tick; EditorApplication.update += Tick;
        File.WriteAllText(root + "/Temp/fixture-reloaded.json", "{\"pid\":" + session.pid + ",\"at\":" + EditorApplication.timeSinceStartup.ToString("R", System.Globalization.CultureInfo.InvariantCulture) + "}");
    }
    public static void Boot()
    {
        root = Path.GetFullPath(Path.Combine(Application.dataPath, "..")).Replace('\\', '/');
        if (!root.StartsWith("F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests/editor-bridge-", StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Fixture only runs in its own temp project");
        EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
        cube.name = "GameCowork real preview fixture cube";
        var material = new Material(Shader.Find("Standard"));
        // A second independent test project uses a distinct real material and
        // camera background, so pixel isolation is observable without labels.
        bool secondProject = File.Exists(root + "/fixture-project-b.marker");
        material.color = secondProject ? Color.green : Color.red;
        cube.GetComponent<Renderer>().sharedMaterial = material;
        var cameraObject = new GameObject("GameCowork fixture camera");
        var camera = cameraObject.AddComponent<Camera>();
        cameraObject.AddComponent<GameCoworkBridgeRuntimeFixture>();
        camera.clearFlags = CameraClearFlags.SolidColor;
        camera.backgroundColor = secondProject ? new Color(0.32f, 0.04f, 0.12f) : new Color(0.02f, 0.15f, 0.35f);
        camera.transform.position = new Vector3(0, 1, -5);
        camera.transform.LookAt(Vector3.zero);
        var lightObject = new GameObject("GameCowork fixture light");
        lightObject.AddComponent<Light>().type = LightType.Directional;
        lightObject.transform.rotation = Quaternion.Euler(35, -30, 0);
        view = EditorWindow.GetWindow<SceneView>();
        view.LookAtDirect(Vector3.zero, Quaternion.Euler(20, 20, 0), 6);
        view.Show();
        var gameType = typeof(EditorWindow).Assembly.GetType("UnityEditor.GameView", true);
        EditorWindow.GetWindow(gameType).Show();
        EditorSceneManager.SaveScene(EditorSceneManager.GetActiveScene(), root + "/Assets/fixture.unity");
        started = EditorApplication.timeSinceStartup;
        File.WriteAllText(root + "/Temp/fixture-session.json", JsonUtility.ToJson(new FixtureSession { started = started, pid = Process.GetCurrentProcess().Id }));
        EditorApplication.update += Tick;
        Directory.CreateDirectory(root + "/Temp");
        File.WriteAllText(root + "/Temp/fixture-ready.json", "{\"pid\":" + Process.GetCurrentProcess().Id + "}");
    }
    static void Tick()
    {
        if (File.Exists(root + "/Temp/request-keyboard-play"))
        {
            File.Delete(root + "/Temp/request-keyboard-play");
            // This separate keyboard fixture keeps its streams across Play entry.
            // The controls gate independently verifies normal domain reload.
            EditorSettings.enterPlayModeOptionsEnabled = true;
            EditorSettings.enterPlayModeOptions = EnterPlayModeOptions.DisableDomainReload | EnterPlayModeOptions.DisableSceneReload;
            EditorApplication.isPlaying = true;
        }
        WriteObservation(Path.GetFullPath(Path.Combine(root, "../keyboard-play-state.json")),
            "{\"isPlaying\":" + (EditorApplication.isPlaying ? "true" : "false") + "}");
        if (File.Exists(root + "/Temp/request-reload"))
        {
            File.Delete(root + "/Temp/request-reload");
            AssetDatabase.Refresh(ImportAssetOptions.ForceUpdate);
            UnityEditor.Compilation.CompilationPipeline.RequestScriptCompilation();
            return;
        }
        if (File.Exists(root + "/Temp/request-exit")) { EditorApplication.Exit(0); return; }
        if (File.Exists(root + "/Temp/request-close-scene"))
        {
            File.Delete(root + "/Temp/request-close-scene");
            foreach (var candidate in Resources.FindObjectsOfTypeAll<SceneView>()) candidate.Close();
            view = null;
            File.WriteAllText(root + "/Temp/scene-closed", "closed");
        }
        if (EditorApplication.timeSinceStartup - started > 300) { EditorApplication.Exit(3); return; }
        if (cube != null) cube.transform.rotation = Quaternion.Euler(0, (float)(EditorApplication.timeSinceStartup * 45), 0);
        if (view != null)
        {
            view.Repaint();
            // Real state is sampled for input acceptance, not a simulated acknowledgement.
            WriteObservation(root + "/Temp/scene-camera-distance.txt", view.cameraDistance.ToString("R", System.Globalization.CultureInfo.InvariantCulture));
        }
        foreach (var window in Resources.FindObjectsOfTypeAll<EditorWindow>()) window.Repaint();
    }
}
