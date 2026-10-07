using System;
using System.Diagnostics;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

public static class GameCoworkAssetPackageFixture
{
    [Serializable] sealed class Ready
    {
        public string projectRoot, unityVersion, texturePath, materialPath, prefabPath, boundedPrefabPath, packageAssetPath, graphicsDevice;
        public int pid, selectedId, sceneCount;
        public bool sceneDirty;
    }
    static string root;
    static double started;
    static Scene scene;
    public static void Boot()
    {
        root = Path.GetFullPath(Path.Combine(Application.dataPath, "..")).Replace('\\', '/');
        if (!root.StartsWith("F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests/editor-bridge-assets-packages-", StringComparison.OrdinalIgnoreCase)) throw new InvalidOperationException("Asset/package fixture must stay in its own temp directory");
        if (!AssetDatabase.IsValidFolder("Assets/AssetQueries")) AssetDatabase.CreateFolder("Assets", "AssetQueries");
        string texturePath = "Assets/AssetQueries/OwnedTexture.png", materialPath = "Assets/AssetQueries/OwnedMaterial.mat", prefabPath = "Assets/AssetQueries/OwnedPrefab.prefab";
        var texture = new Texture2D(4, 3, TextureFormat.RGBA32, false); var colors = new Color[12];
        for (int index = 0; index < colors.Length; index++) colors[index] = index % 2 == 0 ? Color.red : Color.blue;
        texture.SetPixels(colors); texture.Apply(); File.WriteAllBytes(root + "/" + texturePath, texture.EncodeToPNG()); UnityEngine.Object.DestroyImmediate(texture);
        AssetDatabase.ImportAsset(texturePath, ImportAssetOptions.ForceSynchronousImport);
        var shader = Shader.Find("Standard") ?? Shader.Find("Unlit/Color"); if (shader == null) throw new InvalidOperationException("Own material fixture needs an installed built-in shader");
        AssetDatabase.CreateAsset(new Material(shader) { name = "OwnedMaterial" }, materialPath);
        scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
        var value = new GameObject("OwnedSelectionSentinel"); PrefabUtility.SaveAsPrefabAsset(value, prefabPath);
        string boundedPrefabPath = "Assets/AssetQueries/BoundedPrefab.prefab";
        var bounded = new GameObject("ActualComponentBound"); for (int index = 0; index < 40; index++) bounded.AddComponent<GameCoworkAssetQueryComponent>();
        PrefabUtility.SaveAsPrefabAsset(bounded, boundedPrefabPath); UnityEngine.Object.DestroyImmediate(bounded);
        if (!EditorSceneManager.SaveScene(scene, "Assets/AssetQueries/OwnedScene.unity")) throw new IOException("Cannot save own scene fixture");
        Selection.activeGameObject = value;
        var ready = new Ready { projectRoot = root, unityVersion = Application.unityVersion, pid = Process.GetCurrentProcess().Id,
            texturePath = texturePath, materialPath = materialPath, prefabPath = prefabPath, boundedPrefabPath = boundedPrefabPath, packageAssetPath = "Packages/com.gamecowork.query-fixture/OwnedPackage.txt",
            selectedId = value.GetInstanceID(), sceneCount = SceneManager.sceneCount, sceneDirty = scene.isDirty, graphicsDevice = SystemInfo.graphicsDeviceType.ToString() };
        File.WriteAllText(root + "/Temp/asset-package-ready.json", JsonUtility.ToJson(ready, true));
        started = EditorApplication.timeSinceStartup; EditorApplication.update += Tick;
    }
    static void Tick()
    {
        if (File.Exists(root + "/Temp/asset-package-observe")) {
            File.Delete(root + "/Temp/asset-package-observe");
            File.WriteAllText(root + "/Temp/asset-package-observed.json", "{\"selectedId\":" + Selection.activeInstanceID + ",\"sceneCount\":" + SceneManager.sceneCount + ",\"sceneDirty\":" + (scene.isDirty ? "true" : "false") + "}");
        }
        if (File.Exists(root + "/Temp/asset-package-exit") || EditorApplication.timeSinceStartup - started > 240) {
            EditorApplication.update -= Tick; EditorApplication.Exit(0);
        }
    }
}
