import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import * as prettier from "prettier";

// Static inventory only. Registration/reference evidence never means runtime
// support. No modules under restored, core, app, or original are executed.
const root = fileURLToPath(new URL("../", import.meta.url));
const frontend = path.join(root, "restored/frontend/dist-beautified");
const coreFile = path.join(root, "restored/core-gamecowork-binary/binary/out/index.beautified.js");
const shellFile = path.join(root, "restored/shell/src/main.rs");
const args = process.argv.slice(2);
const outputArg = args.indexOf("--output");
const output = path.resolve(outputArg < 0 ? path.join(root, "../../temp/GameCowork/host-contracts-2026-10-01.json") : args[outputArg + 1]);
const tempRoot = path.resolve(root, "../../temp/GameCowork");
assert.ok(output.toLowerCase().startsWith(tempRoot.toLowerCase() + path.sep), "Reports must stay below temp/GameCowork");

const evidence = (file, line, extra = {}) => ({ file: path.resolve(file), line, ...extra });
const protocolName = /^(?:acp|agents|agent|chatDescriber|command|config|context|controlPlane|debug|diff|editor|extensions|feedback|generation|history|index|indexing|llm|lsp|marketplace|mcp|metrics|model|models|pet|plan|samplePrompts|settings|skills|stream|subagent|tauri|terminal|tools|tjhub|unity|unityInsight|versionUpdate|workspace)\//;
const identifierName = /^[A-Za-z_$][\w$-]*(?:\/[A-Za-z_$][\w$.-]*)*$/;
const literal = (node) => node?.type === "StringLiteral" || (node?.type === "Literal" && typeof node.value === "string") ? node.value
  : node?.type === "TemplateLiteral" && node.expressions.length === 0 ? node.quasis[0].value.cooked : undefined;
const property = (node) => node?.property?.name ?? literal(node?.property);

function walk(node, visit, parents = []) {
  if (!node || typeof node !== "object") return;
  if (typeof node.type === "string") visit(node, parents);
  for (const [key, child] of Object.entries(node)) {
    if (["loc", "start", "end", "comments", "leadingComments", "trailingComments", "innerComments", "tokens", "extra"].includes(key)) continue;
    if (Array.isArray(child)) {
      for (const item of child) if (item && typeof item.type === "string") walk(item, visit, [...parents, node]);
    } else if (child && typeof child.type === "string") walk(child, visit, [...parents, node]);
  }
}

async function parse(text) {
  return (await prettier.__debug.parse(text, { parser: "babel" })).ast;
}

function rustFunction(source, name) {
  const pattern = new RegExp(`(?:async )?fn ${name}\\(`, "g");
  const match = pattern.exec(source);
  assert.ok(match, `Rust function found: ${name}`);
  const tail = source.slice(match.index);
  const next = /\n(?:async )?fn \w+\(/g.exec(tail.slice(1));
  return { text: tail.slice(0, next ? next.index + 1 : tail.length), start: match.index };
}
function lineAt(source, offset) { return source.slice(0, offset).split("\n").length; }
function matchArms(source, name) {
  const section = rustFunction(source, name);
  const result = [];
  for (const match of section.text.matchAll(/((?:"[^"\n]+"\s*\|\s*)*"[^"\n]+")\s*=>/g)) {
    for (const value of match[1].matchAll(/"([^"\n]+)"/g)) result.push({
      type: value[1], ...evidence(shellFile, lineAt(source, section.start + match.index), { function: name }),
      confidence: "literal-match-arm", runtimeStatus: "unverified",
    });
  }
  return result;
}

const shell = fs.readFileSync(shellFile, "utf8");
const shellRoutes = [...shell.matchAll(/\.route\(\s*"([^"\n]+)"/g)].map((match) => ({
  route: match[1], ...evidence(shellFile, lineAt(shell, match.index)), runtimeStatus: "registered-unverified",
}));
const localMessages = matchArms(shell, "local_message");
const hostCallbacks = matchArms(shell, "host_response");
const invokeSection = rustFunction(shell, "invoke");
const directGuiHostMessages = [...invokeSection.text.matchAll(/matches!\(\s*kind,\s*([\s\S]*?)\)\s*\{/g)]
  .flatMap((match) => [...match[1].matchAll(/"([^"\n]+)"/g)].map((type) => ({ type: type[1],
    ...evidence(shellFile, lineAt(shell, invokeSection.start + match.index)), confidence: "invoke-host-response-dispatch", runtimeStatus: "registered-unverified" })));
const core = fs.readFileSync(coreFile, "utf8");
const coreHandlers = [];
const coreOutbound = [];

// The large core contains unrelated SDK/HTTP request APIs. Only scan the actual
// on.bind registration function and the dedicated IDE facade for this inventory.
const registerMatch = /function ([\w$]+)\([^)]*\) \{\s*let ([\w$]+) = [\w$]+\.messenger\.on\.bind\([\w$]+\.messenger\);/.exec(core);
assert.ok(registerMatch, "Core messenger registration binding found");
const coreTail = core.slice(registerMatch.index);
const nextCoreFunction = /\nfunction [\w$]+\(/.exec(coreTail.slice(1));
const registrationText = coreTail.slice(0, nextCoreFunction ? nextCoreFunction.index + 1 : coreTail.length);
const registrationAst = await parse(registrationText);
walk(registrationAst, (node) => {
  if (node.type !== "CallExpression" || node.callee?.type !== "Identifier" || node.callee.name !== registerMatch[2]) return;
  const type = literal(node.arguments[0]);
  if (type) coreHandlers.push({ type, ...evidence(coreFile, lineAt(core, registerMatch.index) + node.loc.start.line - 1),
    confidence: "core-messenger-on-binding", runtimeStatus: "registered-unverified" });
});
const lifecycleStart = core.indexOf("  registerLifecycleHandlers() {");
assert.ok(lifecycleStart >= 0, "Core workspace lifecycle method found");
const lifecycleEnd = core.indexOf("\n};", lifecycleStart);
const lifecycle = core.slice(lifecycleStart, lifecycleEnd);
for (const match of lifecycle.matchAll(/\be\("([^"\n]+)"\s*,/g)) coreHandlers.push({ type: match[1],
  ...evidence(coreFile, lineAt(core, lifecycleStart + match.index)), confidence: "core-lifecycle-on-binding", runtimeStatus: "registered-unverified" });
const facadeStart = core.indexOf("var s8 = class {");
assert.ok(facadeStart >= 0, "Core IDE facade found");
const facadeEnd = core.indexOf("\n};", facadeStart);
for (const match of core.slice(facadeStart, facadeEnd).matchAll(/this\.request\("([^"\n]+)"/g)) coreOutbound.push({
  type: match[1], ...evidence(coreFile, lineAt(core, facadeStart + match.index)), confidence: "core-ide-facade-request", runtimeStatus: "unverified",
});
const knownBareNames = new Set([...coreHandlers, ...coreOutbound, ...localMessages].map((item) => item.type));
for (const name of ["openUrl", "showToast", "showOpenFilePicker", "showTutorial", "get_cowork_access_token", "read_unity_streaming_layout", "save_unity_streaming_layout"]) knownBareNames.add(name);

const modules = new Map();
const edges = [];
const missingReferences = [];
const queue = [path.join(frontend, "index.html"), path.join(frontend, "gui.html")];
function resolveDependency(from, value, kind, line) {
  if (!value || /^(?:https?:|data:|blob:|node:)/.test(value)) return;
  const clean = value.split(/[?#]/)[0];
  const resolved = path.resolve(clean.startsWith("/") ? path.join(frontend, clean.slice(1)) : path.join(path.dirname(from), clean));
  if (!resolved.toLowerCase().startsWith(frontend.toLowerCase() + path.sep)) return;
  if (!/\.(?:js|mjs|html)$/.test(resolved)) return;
  edges.push({ from, to: resolved, kind, line });
  if (fs.existsSync(resolved)) queue.push(resolved);
  else missingReferences.push({ from, value, kind, line, resolved });
}

function astInventory(ast, file, lineOffset = 0) {
  const imports = [];
  const exports = [];
  const calls = [];
  const endpoints = [];
  const dynamicCalls = [];
  const contextDeclarations = [];
  const contextUses = [];
  const nativeInvokeSymbols = [];
  const bareCallCandidates = [];
  const ideMessengerClasses = [];
  walk(ast, (node, parents) => {
    const line = node.loc?.start.line + lineOffset;
    if (["ImportDeclaration", "ExportNamedDeclaration", "ExportAllDeclaration"].includes(node.type) && node.source) {
      const value = literal(node.source);
      imports.push({ value, line, specifiers: (node.specifiers || []).map((item) => ({ local: item.local?.name, imported: item.imported?.name ?? literal(item.imported) })) });
      resolveDependency(file, value, "module-import", line);
    }
    if (node.type === "ExportNamedDeclaration" && !node.source) for (const item of node.specifiers || []) exports.push({ local: item.local?.name, exported: item.exported?.name ?? literal(item.exported) });
    if (node.type === "CallExpression" && node.callee?.type === "Import") resolveDependency(file, literal(node.arguments[0]), "literal-dynamic-import", line);
    if (node.type === "ImportExpression") resolveDependency(file, literal(node.source), "literal-dynamic-import", line);
    if (node.type === "VariableDeclarator" && node.id.type === "Identifier" && node.init?.type === "CallExpression") {
      if (property(node.init.callee) === "createContext" && node.init.arguments[0]?.type === "NewExpression") contextDeclarations.push({ name: node.id.name, constructor: node.init.arguments[0].callee?.name });
      if (property(node.init.callee) === "useContext" && node.init.arguments[0]?.type === "Identifier") {
        const owner = [...parents].reverse().find((item) => /Function|Method/.test(item.type));
        contextUses.push({ name: node.id.name, context: node.init.arguments[0].name, start: owner?.start ?? 0, end: owner?.end ?? Infinity });
      }
    }
    if (node.type === "CallExpression") {
      if (property(node.callee) === "invoke" && property(node.callee.object) === "__TAURI_INTERNALS__") {
        const owner = [...parents].reverse().find((item) => item.type === "FunctionDeclaration");
        if (owner?.id?.name) nativeInvokeSymbols.push(owner.id.name);
      }
      if (node.callee?.type === "Identifier") {
        const type = literal(node.arguments[0]);
        if (type && identifierName.test(type)) bareCallCandidates.push({ type, callee: node.callee.name, ...evidence(file, line) });
      }
      const method = property(node.callee);
      if (["request", "post", "requestWithMessageId", "requestWithMessageIdImmediate", "streamRequest", "invoke"].includes(method)) {
        const type = literal(node.arguments[0]);
        const receiver = node.callee.object;
        const receiverText = receiver?.type === "Identifier" ? receiver.name : receiver?.type === "MemberExpression" ? property(receiver) : receiver?.type;
        if (type && identifierName.test(type) && (protocolName.test(type) || knownBareNames.has(type))) calls.push({
          type, method, receiver: receiverText, receiverIdentifier: receiver?.type === "Identifier" ? receiver.name : null,
          position: node.start, ...evidence(file, line), confidence: receiverText === "ideMessenger" ? "explicit-ide-messenger" : "protocol-literal-alias-unknown",
          runtimeStatus: "unverified",
        });
        else dynamicCalls.push({ method, ...evidence(file, line), reason: type ? "generic-or-vendor-request-not-protocol-evidence" : "dynamic-type-unknown" });
      }
      // Literal messages sent as envelopes bypass the IdeMessenger convenience API.
      if (node.callee?.type === "Identifier" && ["mn", "Vm"].includes(node.callee.name)) {
        const type = literal(node.arguments[1]);
        if (type && protocolName.test(type)) calls.push({ type, method: "helper", receiver: node.callee.name,
          ...evidence(file, line), confidence: "helper-literal-routing-unknown", runtimeStatus: "unverified" });
      }
    }
    if (node.type === "ObjectProperty" && (node.key.name ?? literal(node.key)) === "messageType") {
      const type = literal(node.value);
      if (type && (protocolName.test(type) || knownBareNames.has(type))) calls.push({ type, method: "message-envelope", ...evidence(file, line),
        confidence: "envelope-direction-unknown", runtimeStatus: "unverified" });
    }
    if (node.type === "StringLiteral" || node.type === "TemplateLiteral") {
      const value = literal(node) ?? (node.type === "TemplateLiteral" ? node.quasis.map((part, index) => part.value.cooked + (index < node.expressions.length ? "${dynamic}" : "")).join("") : "");
      if (value === "IdeMessengerContext was used before IdeMessengerProvider initialized") {
        const owner = [...parents].reverse().find((item) => item.type === "ClassDeclaration");
        if (owner?.id?.name) ideMessengerClasses.push(owner.id.name);
      }
      const match = value?.match(/\/api\/tauri\/[A-Za-z0-9_./:-]*(?:\$\{dynamic\}[A-Za-z0-9_./:-]*)*/);
      if (match) endpoints.push({ route: match[0], ...evidence(file, line), confidence: "literal-path-reference", runtimeStatus: "unverified" });
      if (value && /^[\w./-]+\.html$/.test(value)) resolveDependency(file, value.startsWith(".") || value.startsWith("/") ? value : "/" + value, "literal-html-view-reference", line);
    }
  });
  return { imports, exports, calls, endpoints, dynamicCalls, contextDeclarations, contextUses, nativeInvokeSymbols, bareCallCandidates, ideMessengerClasses };
}

const staticFixture = astInventory(await parse(`client.ideMessenger.request("history/list"); generic.request("GET"); generic.request(dynamicType);`), path.join(frontend, "scanner-fixture.js"));
assert.equal(staticFixture.calls.length, 1, "Generic SDK request names are not protocol support evidence");
assert.equal(staticFixture.calls[0].confidence, "explicit-ide-messenger");
assert.equal(staticFixture.dynamicCalls.length, 2, "Dynamic/generic calls remain unknown");

while (queue.length) {
  const file = queue.shift();
  if (modules.has(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  const metadata = { file, sha256: createHash("sha256").update(text).digest("hex"), ...astInventory(await parse(file.endsWith(".html") ? "" : text), file),
    ideContextModule: text.includes("IdeMessengerContext was used before IdeMessengerProvider initialized") };
  modules.set(file, metadata);
  if (file.endsWith(".html")) {
    for (const match of text.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']([^"']+)["'][^>]*>/g)) resolveDependency(file, match[1], "html-entry-or-modulepreload", lineAt(text, match.index));
    for (const match of text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
      if (!match[1].trim()) continue;
      try {
        const inventory = astInventory(await parse(match[1]), file, lineAt(text, match.index) - 1);
        for (const key of ["calls", "endpoints", "dynamicCalls"]) metadata[key].push(...inventory[key]);
      } catch (error) { metadata.inlineScriptUnknown = String(error.message).slice(0, 200); }
    }
  }
}

// Resolve only provable imported IdeMessenger contexts. Other receiver aliases
// remain unknown; SDK .request("GET") and dynamic fields are never counted.
for (const module of modules.values()) {
  const ideContexts = new Set();
  const nativeAliases = new Set();
  for (const item of module.imports) {
    const dependency = path.resolve(path.dirname(module.file), item.value || "");
    const target = modules.get(dependency);
    if (!target) continue;
    for (const binding of item.specifiers) if (target.exports.some((value) => value.exported === binding.imported && target.nativeInvokeSymbols.includes(value.local))) nativeAliases.add(binding.local);
    if (!target.ideContextModule) continue;
    const contextSymbols = new Set(target.contextDeclarations.filter((value) => target.ideMessengerClasses.includes(value.constructor)).map((value) => value.name));
    for (const binding of item.specifiers) if (target.exports.some((value) => value.exported === binding.imported && contextSymbols.has(value.local))) ideContexts.add(binding.local);
  }
  for (const call of module.calls) if (module.contextUses.some((binding) => ideContexts.has(binding.context) && binding.name === call.receiverIdentifier && call.position >= binding.start && call.position <= binding.end)) call.confidence = "imported-ide-messenger-context";
  for (const call of module.bareCallCandidates) if (nativeAliases.has(call.callee)) module.calls.push({ ...call,
    method: "native-invoke", confidence: "imported-native-tauri-invoke", runtimeStatus: "host-specific-unverified" });
}

const routes = new Set(shellRoutes.map((item) => item.route));
const localTypes = new Set(localMessages.map((item) => item.type));
const directHostTypes = new Set(directGuiHostMessages.map((item) => item.type));
const coreTypes = new Set(coreHandlers.map((item) => item.type));
const hostTypes = new Set(hostCallbacks.map((item) => item.type));
const frontendCalls = [...modules.values()].flatMap((item) => item.calls).map((call) => ({ ...call,
  backendEvidence: call.method === "native-invoke" ? "native-host-contract-not-core-rpc"
    : localTypes.has(call.type) ? "shell-local-match" : directHostTypes.has(call.type) ? "shell-direct-host-response-dispatch"
    : coreTypes.has(call.type) ? "core-messenger-registration" : "no-static-handler-evidence",
}));
const frontendRoutes = [...modules.values()].flatMap((item) => item.endpoints).map((item) => ({ ...item,
  hostEvidence: routes.has(item.route) ? "literal-route-registered" : item.route.includes("${dynamic}") ? "dynamic-route-unknown"
    : item.route.endsWith("/") ? "path-prefix-or-validation-unknown" : "no-literal-route-registered",
}));
const outbound = coreOutbound.map((item) => ({ ...item, hostEvidence: hostTypes.has(item.type) ? "literal-host-response-match" : "no-literal-host-response-match" }));
const workflowSpecs = [
  { id: "projects-workspaces", menu: "项目、打开工作区、侧栏工作区", priority: "P0", protocol: /^(?:tjhub\/(?:getRecentProjects|getEditors|addProject|addFromDisk|removeProject|toggleFavorite|openProject)|initWorkspace|shutdownWorkspace)$/, routes: /\/hub\/|\/recent-projects|\/workspace-dir/,
    gates: ["真实列表替换骨架；添加/切换/关闭/重启恢复", "选择编辑器、取消/版本不符/启动失败不得假成功", "切换保持原会话与隔离工作区路由"] },
  { id: "chat-agent-history", menu: "新建会话、历史、流式聊天、权限批准", priority: "P0", protocol: /^(?:acp|history|llm|chatDescriber|stream)\//, routes: /^\/api\/tauri\/(?:invoke|events)$/,
    gates: ["真实自有 CLI 的 session/new→prompt→stream→cancel→reload", "工具文件修改和命令执行必须实际完成且权限批准正确", "拒绝/异常/超时结束 pending，不串工作区"] },
  { id: "models-provider-settings", menu: "设置、模型选择、模型配置、Provider", priority: "P0", protocol: /^(?:config|settings|models|model)\/|^acp\/modelProfiles$/, routes: /\/save-file-modal/,
    gates: ["本地配置 CRUD/启用/切换/重启读取及错误可见", "loopback mock provider 的实际请求参数与返回契约", "第三方 Provider 另行接入，不能用本地身份替代真实授权"] },
  { id: "files-diffs-terminal", menu: "文件浏览、搜索、差异、文件预览、底部终端", priority: "P0", protocol: /^(?:lsp|diff|terminal)\//, routes: /\/(?:file-explorer|file-preview-media|local-file-content|terminal|save-file-modal|drop-files)/,
    callbacks: ["readFile", "writeFile", "deleteFile", "openFile", "openContentDiff", "runCommand", "subprocess", "saveFile", "mkdir", "getSearchResults", "getFilesByName"],
    gates: ["文件树、文本/媒体、搜索与 watcher 实际显示并更新", "差异接受/拒绝与磁盘内容一致", "终端输入、输出、resize、cwd、取消和进程清理"] },
  { id: "custom-skills-extensions-mcp", menu: "自定义、Skills、Extensions、MCP、Marketplace", priority: "P1", protocol: /^(?:skills|extensions|mcp|marketplace|agents|agent)\//, routes: /\/download-url|\/local-file-content/,
    gates: ["本地只读枚举必须正确空态/错误态", "配置与启用/停用/移除/重启复用实际生效", "隔离 fixture 执行工具一次，失败不得伪装安装成功"] },
  { id: "assets-media-generation", menu: "AI资产生成、图片/音频/视频/3D、资源预览", priority: "P2", protocol: /^(?:generation|samplePrompts)\//, routes: /\/file-preview-media|\/download-url|\/local-file-content|\/save-file-modal/,
    gates: ["自有页面/Provider 配置边界明确，未配置时有准确状态", "本地资源加载/预览/保存/定位可验证", "第三方生成最后接入；任务取消、失败与实际产物一致"] },
  { id: "unity-insight", menu: "Unity Insight、代码/资产索引", priority: "P1", protocol: /^unityInsight\//, routes: /\/unity-insight\//,
    gates: ["隔离真实项目的索引状态/进度与完成一致", "VFS 查询、引用、路径搜索与修改后更新", "停用/重启/错误恢复不泄漏 worker 或缓存"] },
  { id: "editor-streaming", menu: "编辑器连接、Streaming、布局、GameView/SceneView", priority: "P1", protocol: /^unity\/|^read_unity_streaming_layout$|^save_unity_streaming_layout$/, routes: /\/window-bridge\//,
    gates: ["自有桥单工程握手、断桥、程序集重载和恢复", "窗口视频、输入、resize、stop 与布局保存", "多工程连接和每槽位工程身份独立，不能共用单例 root 冒充多连接"] },
  { id: "remote-workspaces", menu: "远程访问、远程设备、远程文件夹", priority: "P1", protocol: /^tauri\/(?:listRemoteWorkspaces|setTunnelEnabled|getTunnelEnabled)$|^tjhub\/openRemoteProject$/, routes: /\/remote\/|\/window-bridge\/remote\//,
    gates: ["双隔离设备配对/授权、状态与目录浏览", "远端 Agent/编辑器转发、断线重连及取消", "无设备/离线/未配对明确错误，不能以开端口或 HTTP 200 验收"] },
  { id: "editor-templates-hub-licenses", menu: "新项目、模板、编辑器版本、安装、许可、云项目", priority: "P1", protocol: /^tjhub\//, routes: /^\/api\/tauri\/(?:pick-(?:folder|file)-modal|hub\/open-workspace)$/,
    gates: ["模板创建目录、ProjectVersion 与所选引擎一致", "真实编辑器安装/版本/模块/路径检测；fixture 不能冒充安装", "编辑器本身许可独立；官方 Hub/云流程需要自有等价服务或准确未接入状态"] },
  { id: "desktop-native-options", menu: "窗口最小化/最大化/关闭、设置、更新、保活、桌宠", priority: "P1", protocol: /^tauri\/(?:newWindow|bringToFront|getUpdateChannel|setUpdateChannel|getKeepAwake|setKeepAwake)$|^pet\//, routes: /\/(?:minimize-window|toggle-maximize-window|focus-window|close-window|pending-update|apply-update|check-update|update-traffic-lights|set-embed-mode)/,
    gates: ["真实隔离 wry 窗口可拖动/resize/最小化/还原/关闭", "只清理自有进程，崩溃后 core/孙进程无残留", "更新/保活/桌宠等已有选项逐项行为验收，不以存储 getter 返回值代替"] },
];
const workflows = workflowSpecs.map((item) => {
  const protocolEvidence = frontendCalls.filter((call) => item.protocol.test(call.type));
  const routeEvidence = frontendRoutes.filter((route) => item.routes.test(route.route));
  return { id: item.id, menu: item.menu, priority: item.priority, runtimeStatus: "requires-separate-user-flow-acceptance",
    protocolTypes: [...new Set(protocolEvidence.map((call) => call.type))].sort(), protocolEvidence, routeEvidence,
    routesWithoutLiteralHostRegistration: [...new Set(routeEvidence.filter((route) => route.hostEvidence === "no-literal-route-registered").map((route) => route.route))].sort(),
    missingHostCallbackArms: outbound.filter((call) => (item.callbacks || []).includes(call.type) && call.hostEvidence === "no-literal-host-response-match"),
    requiredAcceptance: item.gates };
});
const report = {
  schemaVersion: 1, generatedAt: new Date().toISOString(), selfTest: "passed: generic and dynamic requests remain unknown",
  scope: { root, entryHtml: [path.join(frontend, "index.html"), path.join(frontend, "gui.html")],
    execution: "static source parsing only; no frontend/core/CLI/provider/user-state execution" },
  limitations: [
    "A registered route/handler is source evidence only; no operation is classified usable by this scanner.",
    "Dynamic request types, generic/vendor request methods, unresolved aliases and host-specific native invoke remain unknown.",
    "Literal HTML view references and dynamic imports show possible reachability, not proof a menu is visible or a branch executes.",
    "Absence of static evidence requires runtime/contract review; it is not proof that an unscanned dynamic registration cannot exist.",
    "Core handler inventory is scoped to its messenger on.bind registration function and workspace lifecycle, excluding generic SDK on/request calls.",
  ],
  summary: { reachableModules: modules.size, importEdges: edges.length, frontendProtocolLiterals: frontendCalls.length,
    distinctProtocolTypes: new Set(frontendCalls.map((item) => item.type)).size, frontendRouteReferences: frontendRoutes.length,
    distinctHostRouteReferences: new Set(frontendRoutes.map((item) => item.route)).size,
    routeReferencesWithoutLiteralHostRegistration: new Set(frontendRoutes.filter((item) => item.hostEvidence === "no-literal-route-registered").map((item) => item.route)).size,
    shellRoutes: shellRoutes.length, shellLocalMessageArms: localMessages.length, coreRegisteredTypes: coreHandlers.length,
    directGuiHostMessages: directGuiHostMessages.length, coreHostCallbackTypes: outbound.length,
    nativeHostCommands: frontendCalls.filter((call) => call.method === "native-invoke").length,
    unresolvedOrVendorRequests: [...modules.values()].reduce((count, item) => count + item.dynamicCalls.length, 0) },
  modules: [...modules.values()].map(({ calls, endpoints, dynamicCalls, contextDeclarations, contextUses, bareCallCandidates, ...item }) => ({ ...item,
    protocolLiteralCount: calls.length, routeReferenceCount: endpoints.length, unresolvedOrVendorRequestCount: dynamicCalls.length })),
  importEdges: edges, missingReferences, shell: { routes: shellRoutes, localMessages, directGuiHostMessages, hostCallbacks },
  workflows, core: { handlers: coreHandlers, outboundHostCallbacks: outbound }, frontend: { calls: frontendCalls, routes: frontendRoutes,
    unknownRequests: [...modules.values()].flatMap((item) => item.dynamicCalls) },
};
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ output, ...report.summary }, null, 2));
