// 把 dist 里所有 .js/.css/.html 美化后镜像到 dst；其余文件原样拷贝；失败保底拷原件。
// 用法: node beautify-dist.mjs <srcDist> <dstDir>
import { readdirSync, statSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, renameSync } from "node:fs";
import { join, extname, relative, dirname } from "node:path";
import { execFileSync } from "node:child_process";

const [src, dst] = process.argv.slice(2);
if (!src || !dst) { console.error("usage: node beautify-dist.mjs <srcDist> <dst>"); process.exit(1); }

const PRETTIER = process.execPath; // 直接用 node 跑 prettier.cjs,避免 .cmd spawn 的 EINVAL
const PRETTIER_CJS = join(import.meta.dirname, "node_modules", "prettier", "bin", "prettier.cjs");

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(src);
let beautified = 0, copied = 0; const failed = [];
for (const f of files) {
  const rel = relative(src, f);
  const outPath = join(dst, rel);
  mkdirSync(dirname(outPath), { recursive: true });
  const ext = extname(f).toLowerCase();
  try {
    if (ext === ".js" || ext === ".mjs" || ext === ".html" || ext === ".css") {
      const size = statSync(f).size;
      if (size > 30 * 1024 * 1024) { copyFileSync(f, outPath); copied++; continue; }
      const parser = ext === ".html" ? "html" : ext === ".css" ? "css" : "babel";
      const out = execFileSync(PRETTIER, [PRETTIER_CJS, "--parser", parser, "--print-width", "120", f],
        { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 30, timeout: 300000 });
      writeFileSync(outPath, out);
      beautified++;
    } else {
      copyFileSync(f, outPath);
      copied++;
    }
  } catch (err) {
    copyFileSync(f, outPath);
    failed.push(rel + " :: " + String(err.message).split("\n")[0]);
  }
}
console.log(`beautified=${beautified} copied=${copied} failed→copied=${failed.length}`);
if (failed.length) console.log(failed.slice(0, 30).join("\n"));
