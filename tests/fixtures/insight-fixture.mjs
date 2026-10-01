import fs from 'node:fs';
import path from 'node:path';

export function createInsightFixture(root, marker = 'GCW_INSIGHT_ALPHA') {
  for (const directory of ['Assets', 'Packages', 'ProjectSettings']) fs.mkdirSync(path.join(root, directory), { recursive: true });
  fs.writeFileSync(path.join(root, 'ProjectSettings/ProjectVersion.txt'), 'm_EditorVersion: 2022.3.28f1\n');
  fs.writeFileSync(path.join(root, 'Packages/manifest.json'), '{"dependencies":{}}\n');
  const write = (name, text, id) => {
    fs.writeFileSync(path.join(root, 'Assets', name), text);
    fs.writeFileSync(path.join(root, 'Assets', name + '.meta'), `fileFormatVersion: 2\nguid: ${id.repeat(32)}\n`);
  };
  write('Player.cs', `using UnityEngine;\nnamespace FixtureSpace {\n public class Player : MonoBehaviour {\n  public string marker = "${marker}";\n  public int Add(int n) {\n   return Helper.Compute(n);\n  }\n  public void Tick() {\n   Add(7);\n  }\n }\n}\n`, 'a');
  write('Helper.cs', 'namespace FixtureSpace {\n public static class Helper {\n  public static int Compute(int n) { return n + 1; }\n }\n}\n', 'e');
  write('Fixture.shader', 'Shader "Fixture/GCW_INSIGHT_SHADER" { Properties { _Tint("Tint", Color) = (1,1,1,1) } SubShader { Pass {} } }\n', 'd');
  write('Default.mat', `%YAML 1.1\n%TAG !u! tag:unity3d.com,2011:\n--- !u!21 &2100000\nMaterial:\n  m_Name: GCW_INSIGHT_MATERIAL\n  m_Shader: {fileID: 4800000, guid: ${'d'.repeat(32)}, type: 3}\n`, 'c');
  write('Greeting.prefab', `%YAML 1.1\n%TAG !u! tag:unity3d.com,2011:\n--- !u!1 &1000\nGameObject:\n  m_Name: FixtureCube\n  m_Component:\n  - component: {fileID: 11400}\n--- !u!114 &11400\nMonoBehaviour:\n  m_GameObject: {fileID: 1000}\n  m_Script: {fileID: 11500000, guid: ${'a'.repeat(32)}, type: 3}\n  m_Label: GCW_INSIGHT_YAML\n  m_Material: {fileID: 2100000, guid: ${'c'.repeat(32)}, type: 2}\n`, 'b');
  return { root, code: path.join(root, 'Assets/Player.cs'), method: 'Assets/Player.cs:/FixtureSpace/Player/Add.fn', marker };
}
