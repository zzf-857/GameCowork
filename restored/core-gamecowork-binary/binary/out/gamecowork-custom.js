// Local custom capability storage. The Agent remains the authority for discovery
// and enable/disable; these helpers validate the files handed to its installer.
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const crypto = require("node:crypto");
const MAX_UPLOAD = 8 * 1024 * 1024;
function capabilityName(value) {
  if (typeof value !== "string" || value.length > 100 || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(value)
      || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(value)) throw new Error("Name must contain only letters, numbers, - or _ and cannot be a reserved filename");
  return value;
}
function scope(value) {
  if (value !== "workspace" && value !== "user") throw new Error("Invalid capability scope");
  return value;
}
function runtimeTemp(env = process.env) {
  const root = env.GAMECOWORK_USER_DATA_DIR;
  if (!root || !path.isAbsolute(root)) throw new Error("GameCowork runtime data directory is not configured");
  const directory = path.join(root, "tmp", "custom");
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}
async function createCapability({ kind, name, contents, scope: level, workspace, home }) {
  capabilityName(name); scope(level);
  if (!['skills', 'extensions', 'commands', 'agents'].includes(kind)) throw new Error("Invalid capability type");
  if (typeof contents !== "string" || Buffer.byteLength(contents) > 1024 * 1024) throw new Error("Invalid capability contents");
  const base = await capabilityBase({ scope: level, workspace, home, create: true });
  if (kind === "commands" || kind === "agents") {
    await checkedDirectory(path.join(base, kind), true);
    const target = path.join(base, kind, name + ".toml");
    await fs.promises.writeFile(target, contents, { flag: "wx" });
    return { status: "success", path: target };
  }
  const directory = path.join(base, kind, name);
  // mkdir without recursive is deliberate: creation cannot overwrite an existing
  // capability or follow a pre-existing capability-directory symlink.
  await checkedDirectory(path.dirname(directory), true);
  await fs.promises.mkdir(directory);
  const target = path.join(directory, kind === "skills" ? "SKILL.md" : "gemini-extension.json");
  try { await fs.promises.writeFile(target, contents, { flag: "wx" }); }
  catch (error) { await fs.promises.rmdir(directory).catch(() => {}); throw error; }
  return { status: "success", path: target };
}
async function checkedDirectory(directory, create) {
  let stat;
  try { stat = await fs.promises.lstat(directory); }
  catch (error) {
    if (error.code !== "ENOENT" || !create) throw error;
    await fs.promises.mkdir(directory); stat = await fs.promises.lstat(directory);
  }
  if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error("Capability storage cannot use a link or non-directory");
  return directory;
}
async function capabilityBase({ scope: level, workspace, home, create = false }) {
  scope(level);
  if (level === "workspace") {
    if (!workspace || !path.isAbsolute(workspace)) throw new Error("Workspace is not configured");
    await checkedDirectory(workspace, false);
    return checkedDirectory(path.join(workspace, ".gamecowork-cli"), create);
  }
  if (!home || !path.isAbsolute(home)) throw new Error("Global capability storage is not configured");
  return checkedDirectory(home, false);
}
async function capabilityTarget(options) {
  capabilityName(options.name);
  if (!['skills', 'extensions', 'commands', 'agents'].includes(options.kind)) throw new Error("Invalid capability type");
  const base = await capabilityBase({ scope: options.scope, workspace: options.workspace, home: options.home, create: false });
  await checkedDirectory(path.join(base, options.kind), false);
  const flat = options.kind === "commands" || options.kind === "agents";
  if (!flat) await checkedDirectory(path.join(base, options.kind, options.name), false);
  const target = flat ? path.join(base, options.kind, options.name + ".toml") : path.join(base, options.kind, options.name, options.kind === "skills" ? "SKILL.md" : "gemini-extension.json");
  if (options.path && path.resolve(options.path).toLowerCase() !== target.toLowerCase()) throw new Error("Capability path is outside its scoped storage");
  const stat = await fs.promises.lstat(target);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 1024 * 1024) throw new Error("Capability file is invalid or too large");
  return target;
}
async function readCapability(options) {
  const target = await capabilityTarget(options), bytes = await fs.promises.readFile(target);
  return { status: "success", path: target, content: bytes.toString("utf8"), sha256: crypto.createHash("sha256").update(bytes).digest("hex") };
}
const mutationQueues = new Map();
async function withDefinitionMutation(options, action) {
  const key = `${options.scope === "user" ? options.home : options.workspace}/${options.kind}/${options.name}`.toLowerCase();
  const previous = mutationQueues.get(key) || Promise.resolve();
  const pending = previous.catch(() => {}).then(action);
  mutationQueues.set(key, pending);
  try { return await pending; }
  finally { if (mutationQueues.get(key) === pending) mutationQueues.delete(key); }
}
function updateCapability(options) { return withDefinitionMutation(options, () => updateCapabilityUnlocked(options)); }
async function updateCapabilityUnlocked(options) {
  const current = await readCapability(options);
  if (typeof options.content !== "string" || Buffer.byteLength(options.content) > 1024 * 1024) throw new Error("Invalid capability contents");
  if (!/^[0-9a-f]{64}$/.test(options.expectedSha256 || "") || current.sha256 !== options.expectedSha256) throw new Error("Capability changed on disk; reload before saving your draft");
  const temporary = current.path + "." + crypto.randomUUID() + ".tmp";
  try { await fs.promises.writeFile(temporary, options.content, { flag: "wx" }); await assertCapabilityVersion(options); await fs.promises.rename(temporary, current.path); }
  finally { await fs.promises.unlink(temporary).catch(() => {}); }
  return readCapability(options);
}
async function assertCapabilityVersion(options) {
  const current = await readCapability(options);
  if (!/^[0-9a-f]{64}$/.test(options.expectedSha256 || "") || current.sha256 !== options.expectedSha256) throw new Error("Capability changed on disk; reload before saving your draft");
  return current;
}
// Parse with the same bundled TOML parser as discovery, before writing. An
// invalid definition must never look successfully installed in the manager.
function validateDefinition({ kind, name, content, parseToml }) {
  if (kind !== "commands" && kind !== "agents") return;
  if (typeof content !== "string" || Buffer.byteLength(content) > 1024 * 1024 || typeof parseToml !== "function") throw new Error("Invalid capability contents");
  const parsed = parseToml(content);
  if (kind === "commands") {
    if (typeof parsed.prompt !== "string" || !parsed.prompt.trim() || (parsed.description !== undefined && typeof parsed.description !== "string")) throw new Error("Command requires a non-empty prompt and a string description");
  } else {
    const agentName = parsed.name ?? parsed.agent?.name;
    if (agentName !== name || typeof parsed.description !== "string" || !parsed.description.trim()) throw new Error("Subagent name must match its filename and requires a description");
    const prompt = parsed.prompts?.system_prompt ?? parsed.agent?.system_prompt;
    if (typeof prompt !== "string" || !prompt.trim()) throw new Error("Subagent requires a non-empty system prompt");
  }
}
function renameDefinition(options) { return withDefinitionMutation(options, () => renameDefinitionUnlocked(options)); }
async function renameDefinitionUnlocked(options) {
  if (!['commands', 'agents'].includes(options.kind)) throw new Error("Only command and subagent files can be renamed here");
  capabilityName(options.newName);
  const current = await assertCapabilityVersion(options);
  if (options.newName === options.name) return updateCapabilityUnlocked(options);
  validateDefinition({ ...options, name: options.newName });
  const destination = path.join(path.dirname(current.path), options.newName + ".toml");
  // Reserve without overwriting even on Windows, where rename would replace an
  // existing destination. Rollback leaves the original bytes intact on failure.
  await fs.promises.writeFile(destination, options.content, { flag: "wx" });
  let rollbackSettings;
  try {
    await assertCapabilityVersion(options);
    rollbackSettings = await rewriteDisabledName(options, options.newName);
    await assertCapabilityVersion(options);
    await fs.promises.unlink(current.path);
  } catch (error) { await rollbackSettings?.(); await fs.promises.unlink(destination).catch(() => {}); throw error; }
  return readCapability({ ...options, name: options.newName, path: undefined });
}
function deleteDefinition(options) { return withDefinitionMutation(options, () => deleteDefinitionUnlocked(options)); }
async function deleteDefinitionUnlocked(options) {
  if (!['commands', 'agents'].includes(options.kind)) throw new Error("Only command and subagent files can be removed here");
  const current = await assertCapabilityVersion(options);
  const rollbackSettings = await rewriteDisabledName(options, null);
  try { await assertCapabilityVersion(options); await fs.promises.unlink(current.path); }
  catch (error) { await rollbackSettings?.(); throw error; }
  return { status: "success", path: current.path };
}
async function rewriteDisabledName(options, newName) {
  const base = await capabilityBase(options), settings = path.join(base, "settings.json");
  let bytes;
  try {
    const stat = await fs.promises.lstat(settings);
    if (stat.isSymbolicLink() || !stat.isFile() || stat.size > 1024 * 1024) throw new Error("Capability settings cannot use a link or non-file");
    bytes = await fs.promises.readFile(settings);
  } catch (error) { if (error.code === "ENOENT") return; throw error; }
  const config = JSON.parse(bytes.toString("utf8")), disabled = config[options.kind]?.disabled;
  if (!Array.isArray(disabled) || !disabled.includes(options.name)) return;
  config[options.kind].disabled = [...new Set(disabled.flatMap(name => name === options.name ? (newName ? [newName] : []) : [name]))];
  const updated = Buffer.from(JSON.stringify(config, null, 2) + "\n");
  const temporary = settings + "." + crypto.randomUUID() + ".tmp";
  try {
    await fs.promises.writeFile(temporary, updated, { flag: "wx" });
    const stat = await fs.promises.lstat(settings);
    if (stat.isSymbolicLink() || !stat.isFile() || !(await fs.promises.readFile(settings)).equals(bytes)) throw new Error("Capability settings changed on disk; reload before saving");
    await fs.promises.rename(temporary, settings);
  } finally { await fs.promises.unlink(temporary).catch(() => {}); }
  return async () => {
    const stat = await fs.promises.lstat(settings);
    if (stat.isSymbolicLink() || !stat.isFile() || !(await fs.promises.readFile(settings)).equals(updated)) throw new Error("Capability settings changed during rollback; original file was preserved");
    const backup = settings + "." + crypto.randomUUID() + ".tmp";
    try { await fs.promises.writeFile(backup, bytes, { flag: "wx" }); await fs.promises.rename(backup, settings); }
    finally { await fs.promises.unlink(backup).catch(() => {}); }
  };
}
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) { crc ^= byte; for (let n = 0; n < 8; n++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  return (crc ^ 0xffffffff) >>> 0;
}
function validateSkillUpload(content, fileName) {
  if (typeof fileName !== "string" || !/\.(zip|skill)$/i.test(fileName) || /[<>:"/\\|?*\x00-\x1f]/.test(fileName)
      || /^[. ]/.test(fileName) || /[. ]$/.test(fileName) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(fileName)
      || fileName.length > 160 || fileName.includes("..")) throw new Error("Invalid skill archive filename");
  if (typeof content !== "string" || content.length > Math.ceil(MAX_UPLOAD * 4 / 3) + 4 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(content)) throw new Error("Invalid skill archive data");
  const bytes = Buffer.from(content, "base64");
  if (!bytes.length || bytes.length > MAX_UPLOAD) throw new Error("Skill archive exceeds the 8 MiB limit");
  let end = -1;
  for (let n = bytes.length - 22; n >= Math.max(0, bytes.length - 65557); n--) if (bytes.readUInt32LE(n) === 0x06054b50 && n + 22 + bytes.readUInt16LE(n + 20) === bytes.length) { end = n; break; }
  if (end < 0 || bytes.readUInt16LE(end + 4) || bytes.readUInt16LE(end + 6)) throw new Error("Unsupported skill archive");
  const count = bytes.readUInt16LE(end + 10), size = bytes.readUInt32LE(end + 12), offset = bytes.readUInt32LE(end + 16);
  if (!count || count > 512 || count !== bytes.readUInt16LE(end + 8) || offset + size !== end) throw new Error("Invalid skill archive directory");
  let cursor = offset, total = 0; const names = new Set();
  for (let i = 0; i < count; i++) {
    if (cursor + 46 > end || bytes.readUInt32LE(cursor) !== 0x02014b50) throw new Error("Invalid archive entry");
    const flags = bytes.readUInt16LE(cursor + 8), method = bytes.readUInt16LE(cursor + 10), compressed = bytes.readUInt32LE(cursor + 20), length = bytes.readUInt32LE(cursor + 24),
      nameLength = bytes.readUInt16LE(cursor + 28), extra = bytes.readUInt16LE(cursor + 30), comment = bytes.readUInt16LE(cursor + 32), local = bytes.readUInt32LE(cursor + 42);
    if (cursor + 46 + nameLength + extra + comment > end || flags & 1 || ![0, 8].includes(method) || (bytes.readUInt32LE(cursor + 38) >>> 16 & 0xf000) === 0xa000) throw new Error("Unsupported archive entry");
    const nameBytes = bytes.subarray(cursor + 46, cursor + 46 + nameLength), name = nameBytes.toString("utf8");
    const segments = name.replace(/\/$/, "").split("/");
    if (!name || name.includes("\\") || name.includes("\0") || name.includes(":") || segments.some(part => !part || part === "." || part === ".." || /[. ]$/.test(part) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part)) || names.has(name.toLowerCase())) throw new Error("Unsafe archive path");
    names.add(name.toLowerCase()); total += length;
    if (length > MAX_UPLOAD || total > MAX_UPLOAD || local + 30 > offset || bytes.readUInt32LE(local) !== 0x04034b50) throw new Error("Skill archive exceeds extraction limits");
    const localNameLength = bytes.readUInt16LE(local + 26), dataStart = local + 30 + localNameLength + bytes.readUInt16LE(local + 28);
    if (!bytes.subarray(local + 30, local + 30 + localNameLength).equals(nameBytes) || dataStart + compressed > offset) throw new Error("Invalid archive local entry");
    const data = bytes.subarray(dataStart, dataStart + compressed);
    const expanded = method === 8 ? zlib.inflateRawSync(data, { maxOutputLength: MAX_UPLOAD }) : data;
    if (expanded.length !== length || crc32(expanded) !== bytes.readUInt32LE(cursor + 16)) throw new Error("Corrupt archive entry");
    cursor += 46 + nameLength + extra + comment;
  }
  if (cursor !== end || ![...names].some(name => /(?:^|\/)skill\.md$/i.test(name))) throw new Error("Archive must contain SKILL.md");
  return bytes;
}
module.exports = { capabilityName, scope, runtimeTemp, createCapability, readCapability, updateCapability, assertCapabilityVersion, validateDefinition, renameDefinition, deleteDefinition, validateSkillUpload };
