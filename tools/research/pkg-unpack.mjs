// 解包 vercel/pkg 单文件可执行 (pkg 5.x 路径字典+VFS+DOCOMPRESS)
// 用法: node pkg-unpack.mjs <exe> <outdir>
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import zlib from "node:zlib";

const [exe, outdir] = process.argv.slice(2);
const data = readFileSync(exe);

const num = (label) => {
  const m = data.toString("latin1").match(new RegExp(`var ${label} = '(\\d+)\\s*'`));
  return m ? parseInt(m[1]) : null;
};
const PP = num("PAYLOAD_POSITION"), PS = num("PAYLOAD_SIZE");
const PRP = num("PRELUDE_POSITION"), PRS = num("PRELUDE_SIZE");
console.log(`payload@${PP}+${PS} prelude@${PRP}+${PRS}`);
const prelude = data.toString("latin1", PRP, PRP + PRS);
const payload = data.subarray(PP, PP + PS);

// 找 VFS: 第一个 {"0/1/... 形式的 JSON
const vfsStart = prelude.indexOf('{"0/');
if (vfsStart === -1) { console.error("VFS not found"); process.exit(1); }
// 平衡提取 JSON
function extractJSON(s, start) {
  let depth = 0, instr = false, esc = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (instr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') instr = false;
    } else {
      if (c === '"') instr = true;
      else if (c === "{") depth++;
      else if (c === "}") { depth--; if (depth === 0) return s.slice(start, i + 1); }
    }
  }
  throw new Error("unbalanced");
}
const vfs = JSON.parse(extractJSON(prelude, vfsStart));
console.log(`VFS entries=${Object.keys(vfs).length}`);

// VFS 之后的实参: ENTRY, SYMLINKS, DICT, DOCOMPRESS — 从 VFS 结束后顺序解析
let pos = vfsStart + extractJSON(prelude, vfsStart).length;
const rest = prelude.slice(pos);
// 依次: \n,\n"..."\n,\n{symlinks}\n,\n{dict}\n,\n1\n);
const mRest = rest.match(/,\s*"((?:[^"\\]|\\.)*)"\s*,\s*(\{[^]*?\})\s*,\s*(\{[^]*?\})\s*,\s*(\d+)\s*\)\s*;\s*\}\s*\)\s*$/);
if (!mRest) { console.error("tail args not parsed; rest head:", rest.slice(0, 200)); process.exit(1); }
const [, ENTRY, SYMLINKS_RAW, DICT_RAW, DOCOMPRESS] = mRest;
const DICT = JSON.parse(DICT_RAW);
console.log(`ENTRY=${ENTRY} DOCOMPRESS=${DOCOMPRESS} DICT=${Object.keys(DICT).length}`);

const id2name = {};
for (const [name, id] of Object.entries(DICT)) id2name[id] = name;

function resolvePath(key) {
  return key.split("/").map((id) => id2name[id] ?? id).join("/");
}

// 类型: 0=BLOB(JS编译物) 1=CONTENT 2=LINKS 3=STAT
let written = 0, failed = 0;
const manifest = [];
for (const [key, entry] of Object.entries(vfs)) {
  const path = resolvePath(key);
  const rec = { path };
  for (const [type, [off, size]] of Object.entries(entry)) {
    const raw = payload.subarray(off, off + size);
    let out;
    try { out = zlib.gunzipSync(raw); }          // pkg 该版本 DOCOMPRESS=gzip(1f 8b)
    catch { try { out = zlib.brotliDecompressSync(raw); } catch { out = raw; } } // 保底: 未压缩/其他
    rec[type] = { off, size, decompressed: out.length, compressed: raw.length };
    if (type === "1" || type === "0") {
      // 剥掉 C:/snapshot/<pkgname>/ 虚拟前缀,落到 outdir 相对路径
      const rel = path.replace(/^[A-Za-z]:\/snapshot\/[^/]+\//, "").replace(/^\//, "");
      const p = join(outdir, rel);
      mkdirSync(dirname(p), { recursive: true });
      writeFileSync(p, out);
      written++;
    }
  }
  manifest.push(rec);
}
writeFileSync(join(outdir, "_unpack-manifest.json"), JSON.stringify(manifest, null, 1));
console.log(`written=${written} failed=${failed}`);
