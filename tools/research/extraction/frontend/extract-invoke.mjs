// 扫描 dist JS: 找到从 core-*.js 导入 invoke(i) 的本地别名,再抓 别名("cmdName") 调用
// 输出: 命令名 -> [文件: 次数]
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const dist = process.argv[2];
const files = readdirSync(dist, { withFileTypes: true })
  .flatMap(e => {
    const p = join(dist, e.name);
    if (e.isDirectory()) return readdirSync(p).map(n => join(p, n));
    return e.name.endsWith(".js") ? [p] : [];
  })
  .filter(p => p.endsWith(".js"));

const cmds = new Map();
for (const f of files) {
  let s; try { s = readFileSync(f, "utf8"); } catch { continue; }
  // 可能多段 import,逐个抓
  const imports = [...s.matchAll(/import\{([^}]*)\}from"\.\/(core-[^"]+\.js)"/g)];
  for (const im of imports) {
    for (const binding of im[1].split(",")) {
      const m = binding.trim().match(/^i as (\w+)$/);
      if (!m) continue;
      const alias = m[1];
      const calls = [...s.matchAll(new RegExp(`\\b${alias}\\("([^"\\\\]{1,80})"`, "g"))];
      for (const c of calls) {
        const name = c[1];
        if (!cmds.has(name)) cmds.set(name, new Map());
        const per = cmds.get(name);
        const key = f.split(/[\\\/]/).pop();
        per.set(key, (per.get(key) || 0) + 1);
      }
    }
  }
}
const rows = [...cmds.entries()].sort((a, b) => a[0].localeCompare(b[0]));
console.log(`共 ${rows.length} 个唯一 invoke 目标\n`);
for (const [name, files2] of rows) {
  const loc = [...files2.entries()].map(([f, n]) => `${f}x${n}`).join(" ");
  console.log(`${name}  ←  ${loc}`);
}
