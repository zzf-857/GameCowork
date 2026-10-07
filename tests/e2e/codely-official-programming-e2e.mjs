// Actual maintained GUI -> Rust -> Core -> guarded compiled Agent -> private
// official proxy -> loopback fixture. No real account, key or quota is used.
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import { randomUUID, createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { startMockProvider } from "../fixtures/mock-provider.mjs";
import { startProgrammingWireFixture } from "../support/codely-programming-wire-fixture.mjs";
import {closeChatModelMenu,openChatModelOptions,chatModelRow,chooseChatModel,chooseChatReasoning,assertCanonicalChatMenu} from "../support/chat-model-menu-browser.mjs";
const project = fileURLToPath(new URL("../../", import.meta.url)), args = process.argv.slice(2);
const option = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const temp = path.resolve(project, "codelyreversebackup/work"), run = path.resolve(option("--output", path.join(temp, "official-programming-" + randomUUID())));
assert.ok(run.toLowerCase().startsWith(temp.toLowerCase() + path.sep)); fs.mkdirSync(run, { recursive: true });
const previous = args.includes("--previous"), packaged = args.includes("--packaged"), app = path.resolve(option("--app-root", path.join(project, "app")));
const binary = path.resolve(option("--binary", packaged ? path.join(app, "GameCowork.exe") : path.join(project, "src/shell/target/debug/GameCowork.exe")));
const coreDir = packaged ? path.join(app, "core") : path.join(project, "src/core/binary/out");
const frontend = packaged ? path.join(app, "frontend") : path.join(project, "src/frontend/bundle");
const agent = path.resolve(option("--agent", path.join(temp, "2026-10-07-ai-assets/guarded-agent/gamecowork.exe"))), agentSource = path.dirname(agent);
const manifest = JSON.parse(fs.readFileSync(path.join(agentSource, "cli-package-manifest.json"), "utf8"));
assert.equal(manifest.testGuardIncluded, true, "Only a guarded test Agent is allowed");
assert.equal(manifest.sourceSha256?.toLowerCase(), createHash("sha256").update(fs.readFileSync(path.join(project, "src/agent/cli-main.beautified.js"))).digest("hex"));
const workspace = path.join(run, "Owned Workspace"), fixtureFile = path.join(workspace, "fixture-note.txt");
fs.mkdirSync(path.join(workspace, ".gamecowork-cli"), { recursive: true });
fs.writeFileSync(path.join(workspace, ".gamecowork-cli/settings.json"), JSON.stringify({ disableNextSpeakerCheck: true }));
fs.writeFileSync(fixtureFile, "GCW_FIXTURE_FILE_CONTENT\nOfficial programming owned fixture\n");
const local = await startMockProvider({ model: "fixture-cpa", apiKey: "fixture-cpa-key", fixtureFile });
// These are explicit synthetic canonical aliases, not assertions about live
// service model IDs or prices. The native name/model distinction is exercised.
const nativeModels=[
  {name:'Core (GLM-5.3)',model:'fixture-core',rate:.25,extras:{model:'claude-extras-must-not-choose-wire',thinkingEfforts:{default:'max',options:['high','max']},maxContextLengths:{default:128000,options:[64000,128000]}}},
  {name:'Basic',model:'fixture-basic',rate:.1},
  {name:'GLM-5.3-FLASH',model:'fixture-flash',rate:.1,logoUrl:'https://official-menu-fixture.invalid/flash.svg'},
  {name:'DeepSeek Fixture',model:'fixture-deepseek',rate:.5},
  {name:'KIMI-K3',model:'fixture-kimi',rate:1},
].map(model=>({...model,provider:'openai',roles:['chat','edit','apply','summarize'],capabilities:['tool_use']}));
const personas={
  alpha:{id:90001,label:'Fixture Pro Account',plan:'pro',models:nativeModels},
  basic:{id:90002,label:'Fixture Basic Account',plan:'basic',models:[nativeModels[1]]},
  denied:{id:90003,label:'Fixture Restricted Account',plan:'premium',models:nativeModels.map(model=>({...model,disabled:true}))},
  beta:{id:90004,label:'Fixture Second Account',plan:'pro',models:nativeModels.map(model=>({...model,model:model.model+'-beta'}))},
};
const official = await startProgrammingWireFixture({models:Object.values(personas).flatMap(persona=>persona.models.filter(model=>!model.disabled).map(model=>model.model)),apiKey:'fixture-official-cli-key',fixtureFile});
let persona='alpha',keyCalls=0,accountCalls=[],accountOrigin,shell,browser,page,gui,origin,shellLog='',holdNextMenu=false,heldMenu;
const tokenFor=name=>'fixture-main-access-'+name,teamFor=name=>'fixture-team-'+name;
const accountServer = http.createServer(async (req, res) => {
  let text = ""; for await (const bytes of req) text += bytes;
  const parsed = new URL(req.url, accountOrigin), send = payload => { res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify(payload)); };
  accountCalls.push({ path: parsed.pathname, method: req.method });
  const actor=personas[persona];
  switch (parsed.pathname) {
    case "/auth/device/initiate": return send({ auth_request_token: "fixture-request", user_code: "TEST-CODE", verification_uri: accountOrigin + "/auth/device/verify", verification_uri_complete: accountOrigin + "/auth/device/verify?user_code=TEST-CODE", expires_in: 600, interval: 1 });
    case "/auth/device/poll": return send({ status: "authorized", authorization_code: "fixture-code" });
    case "/auth/device/exchange": return send({ access_token:tokenFor(persona),refresh_token:'fixture-main-refresh-'+persona,token_type:"Bearer",expires_in:3600 });
    case "/auth/external/me": return send({ id:actor.id,username:actor.label });
    case "/auth/refresh": return send({ access_token:tokenFor(persona),refresh_token:'fixture-main-refresh-'+persona,expires_in:3600 });
    case "/api/teams": return send({ teams:[{team_id:teamFor(persona),team_name:actor.label,is_current:true,has_key:true}],current_team_id:teamFor(persona),multi_team_enabled:false });
    case '/api/config/v3': {
      assert.equal(req.headers.authorization,'Bearer '+tokenFor(persona));
      assert.equal(parsed.searchParams.get('teamId'),teamFor(persona));assert.ok(parsed.searchParams.get('version'),'Original metadata request includes the actual client version');
      const payload={content:{name:'Owned canonical chat fixture',version:'1.0.0',schema:'v1',models:actor.models}};
      if(holdNextMenu){holdNextMenu=false;heldMenu={persona,release:()=>{if(!res.destroyed)send(payload);}};return;}
      return send(payload);
    }
    case "/api/api-token/cli-api-key":
      assert.equal(req.headers.authorization,'Bearer '+tokenFor(persona));assert.equal(parsed.searchParams.get('teamId'),teamFor(persona));
      keyCalls++;return send({cli_api_key:official.apiKey,user_id:'fixture-cli-user-'+persona,rpm:20,tpm:100000});
    case "/api/user/plan": return send({ plan_type:actor.plan,is_active:true,has_seat:true });
    case "/api/user/usage/summary": return send({ remaining_points: "1000", is_exhausted: false, details: [] });
    case "/api/user/usage/exhaustion": return send({ is_exhausted: false });
    default: res.writeHead(404, { "Content-Type": "application/json" }); res.end(JSON.stringify({ error: "Owned fixture unsupported route" }));
  }
});
await new Promise(resolve => accountServer.listen(0, "127.0.0.1", resolve)); accountOrigin = `http://127.0.0.1:${accountServer.address().port}`;
const checks = [], errors = [], blocked = [],menuReplies=[];
async function poll(predicate, label, timeout = 30000) { const deadline = Date.now() + timeout; while (!await predicate()) { assert.ok(Date.now() < deadline, "Timed out: " + label); await new Promise(resolve => setTimeout(resolve, 100)); } }
function cleanEnvironment() { const env = { ...process.env }; for (const name of Object.keys(env)) if (/^(OPENAI|ANTHROPIC|GEMINI|GOOGLE|AZURE|AWS|VERTEX|GITHUB|CODELY_|GAMECOWORK_)/.test(name) || /^(HTTP|HTTPS|ALL|NO)_PROXY$/.test(name) || name === "NODE_OPTIONS") delete env[name]; return env; }
async function rpc(kind, data = {}, workspaceKey) {
  if (kind.startsWith("codelyAccount/")) workspaceKey = "default";
  const response = await fetch(origin + "api/tauri/invoke", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messageType: kind, messageId: randomUUID(), ...(workspaceKey ? { workspaceKey } : {}), data }) });
  assert.equal(response.status, 200); const frame = await response.json();
  assert.equal(frame.data?.status, "success", `${kind}: ${JSON.stringify(frame.data)}`); return frame.data.content;
}
async function state() { return gui.evaluate(async previous => {
  const { s } = await import(previous ? "/assets/store-0rGrUshb.js" : "/assets/store-c6kNGz30.js");
  const value = s.getState(), session = value.session.sessions[value.session.activeSessionId];
  const models=value.config.config.modelsByRole?.chat||[],sessionSettings=value.session.sessionSettingsById?.[value.session.activeSessionId]||{},effectiveTitle=sessionSettings.selectedChatModelTitle??value.config.globalChatModelTitle;
  const selected=models.find(model=>model.title===effectiveTitle)||value.config.config.selectedModelByRole?.chat,extras=selected?.extras||{},key=selected?JSON.stringify([selected.provider||'',selected.model||selected.title,selected.apiBase||'',extras.customModelId||'',extras.providerId||'',extras.wireApi||'']):null;
  return { workspaceKey: value.hub.activeWorkspaceKey, workspaces: value.hub.workspaces, streaming: session?.isStreaming,
    sessionId:value.session.activeSessionId,selected:selected?.title,
    selectedReasoning:previous?(sessionSettings.selectedReasoningEffort??extras.thinkingEfforts?.default):key?(value.config.sharedConfig?.modelReasoningEfforts?.[key]??extras.thinkingEfforts?.default):undefined,
    models:models.map(model=>({title:model.title,model:model.model,customedModel:!!model.customedModel,disabled:!!model.disabled,rate:model.rate,logoUrl:model.logoUrl,extras:{officialModelId:model.extras?.officialModelId,providerName:model.extras?.providerName,thinkingEfforts:model.extras?.thinkingEfforts}})) };
}, previous); }
function playwrightPath() { try { return createRequire(import.meta.url).resolve("playwright"); } catch {} const base = path.join(process.env.LOCALAPPDATA, "npm-cache/_npx"); return fs.readdirSync(base).map(name => path.join(base, name, "node_modules/playwright/index.mjs")).filter(fs.existsSync).sort((a,b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0]; }
function chromiumPath() { const base = path.join(process.env.LOCALAPPDATA, "ms-playwright"); for (const folder of fs.readdirSync(base).filter(name => /^chromium-\d+$/.test(name)).sort((a,b) => Number(b.split("-")[1]) - Number(a.split("-")[1]))) for (const file of ["chrome-win64/chrome.exe", "chrome-win/chrome.exe"]) if (fs.existsSync(path.join(base, folder, file))) return path.join(base, folder, file); }
async function choose(title) { await chooseChatModel(gui,title,poll,state); }
function expectedRows(name) {return [...personas[name].models.map(model=>({title:model.name,disabled:!!model.disabled,
  ...(model.disabled?{}:{rateText:model.rate===1?'1.0x':`${model.rate}x`}),
  logoTestId:model.logoUrl?'model-logo-remote':model.name.startsWith('Core')?'model-logo-core':model.name.includes('DeepSeek')?'model-logo-deepseek':model.name.includes('KIMI')?'model-logo-kimi':'model-logo-basic'})),{title:'Frontier',disabled:true,logoTestId:'model-logo-frontier'}];}
async function menuMatches(name) {
  const current=(await state()).models.filter(model=>!model.customedModel),expected=[...personas[name].models.map(model=>({title:model.name,model:model.model,disabled:!!model.disabled})),{title:'Frontier',model:'Frontier',disabled:true}];
  return JSON.stringify(current.map(({title,model,disabled})=>({title,model,disabled})))===JSON.stringify(expected);
}
async function login(name) {await closeChatModelMenu(gui);persona=name;await rpc('getControlPlaneSessionInfo',{silent:false,useOnboarding:false});await poll(async()=>(await rpc('codelyAccount/status')).phase==='authenticated','loopback login '+name);await openChatModelOptions(gui);await poll(()=>menuMatches(name),'canonical menu '+name);}
async function logout() {await closeChatModelMenu(gui);await rpc('logoutOfControlPlane');await poll(async()=>(await state()).models.every(model=>model.customedModel),'official native rows revoked on logout');}
function assertSettingsPreserved(settingsFile,original) {assert.deepEqual(JSON.parse(fs.readFileSync(settingsFile,'utf8')),JSON.parse(original.toString('utf8')),'Official choices and account transitions preserve local Provider project settings');}
async function verifyMenu(name) {return assertCanonicalChatMenu({gui,models:expectedRows(name),customTitle:'Fixture CPA Model',checks,wireRequestCount:()=>official.wireRequests.length,keyRequestCount:()=>keyCalls,readSelected:async()=>(await state()).selected});}
function blockedProviderAttempts() {
  const attempts=[];
  for(const [owner,file]of [['core','core-guard-events.jsonl'],['agent','guard-events.jsonl']]) {
    const target=path.join(run,file);if(!fs.existsSync(target))continue;
    for(const line of fs.readFileSync(target,'utf8').split(/\r?\n/).filter(Boolean)) {
      const event=JSON.parse(line);if(/^(external-|fetch$|node:http\.|node:https\.|net\.)/.test(event.operation||''))attempts.push({owner,operation:event.operation,host:event.host||event.targetHint});
    }
  }
  return attempts;
}
async function prompt(text, expected, provider) {
  const count = provider.requests.length;
  await gui.locator('[contenteditable="true"]').first().fill(text); await gui.locator('[data-telemetry-id="send_message"]').first().click();
  await poll(() => provider.requests.length > count, "Agent reaches selected provider");
  if (expected) { await gui.getByText(expected, { exact: false }).last().waitFor({ state: "visible", timeout: 30000 }); await poll(async () => !(await state()).streaming, "complete actual GUI stream"); }
}
try {
  shell = spawn(binary, [], { cwd: run, windowsHide: true, stdio: ["ignore", "pipe", "pipe"], env: {
    ...cleanEnvironment(), GAMECOWORK_APP_ROOT: run, GAMECOWORK_CORE_DIR: coreDir, GAMECOWORK_CORE_ENTRY: path.join(coreDir, "index.js"), GAMECOWORK_FRONTEND_DIR: frontend,
    GAMECOWORK_DATA_DIR: path.join(run, "data"), GAMECOWORK_AGENT_PATH: agent, GAMECOWORK_AGENT_RESOURCE_DIR: path.join(agentSource, "resources"),
    GAMECOWORK_HEADLESS: "1", GAMECOWORK_TEST_MODE: "1", GAMECOWORK_DISABLE_AUTO_UPDATE: "1", GAMECOWORK_PICK_FOLDER: workspace,
    GAMECOWORK_CODELY_ACCOUNT_BASE_URL: accountOrigin, GAMECOWORK_CODELY_INFERENCE_BASE_URL: official.baseUrl,
    GAMECOWORK_CHAT_ROOT: run, GAMECOWORK_CHAT_CORE: packaged ? coreDir : path.join(project, "src/core"), GAMECOWORK_CHAT_AGENT: agent,
    GAMECOWORK_CLI_PROBE_ROOT: run, GAMECOWORK_CLI_PROBE_SOURCE: agentSource, CUSTOM_AUTH: "1",
    BUN_RUNTIME_TRANSPILER_CACHE_PATH: path.join(run, "bun-cache"), NODE_OPTIONS: "--require " + JSON.stringify(path.join(project, "tests/fixtures/chat-core-guard.cjs")),
  } });
  const consume = bytes => { shellLog += bytes.toString(); const match = shellLog.match(/HTTP: (http:\/\/127\.0\.0\.1:\d+\/)/); if (match) origin = match[1]; };
  shell.stdout.on("data", consume); shell.stderr.on("data", consume);
  await poll(() => origin, "actual shell startup", 60000);
  const { chromium } = await import(pathToFileURL(playwrightPath()).href);
  browser = await chromium.launchPersistentContext(path.join(run, "chromium"), { headless: true, executablePath: chromiumPath(), locale: "zh-CN", viewport: { width: 1500, height: 1000 }, serviceWorkers: "block" });
  await browser.route("**/*", route => { const url = new URL(route.request().url()); if(url.origin==='https://official-menu-fixture.invalid')return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#5aa"/></svg>'}); if (url.hostname === "127.0.0.1" || ["data:", "blob:"].includes(url.protocol)) return route.continue(); blocked.push(url.origin); return route.abort("blockedbyclient"); });
  if (previous) await browser.route("**/gui.html*", route => route.fulfill({ contentType: "text/html", body: fs.readFileSync(path.join(frontend, "gui.html"), "utf8").replaceAll("index-BRxZ4eG7.js", "index-DvRYaIVa.js").replaceAll("VscTheme-BExNMG_K.js", "VscTheme-B-CSeuv5.js").replaceAll("store-c6kNGz30.js", "store-0rGrUshb.js") }));
  await browser.addInitScript(() => { window.GAMECOWORK_SHELL = true; window.workspacePaths = []; window.vscMediaUrl = ""; });
  page = browser.pages()[0]; page.on("pageerror", error => errors.push(String(error)));
  page.on('response',async response=>{try{const request=response.request();if(!new URL(response.url()).pathname.endsWith('/api/tauri/invoke'))return;const input=request.postDataJSON();if(input?.messageType!=='codelyOfficial/refreshMenu')return;const frame=await response.json(),reply=frame.data?.content;menuReplies.push({status:frame.data?.status,error:frame.data?.error,ready:reply?.ready,source:reply?.source,modelCount:reply?.modelCount,unavailableReason:reply?.unavailableReason});}catch{}});
  await page.goto(origin, { waitUntil: "domcontentloaded" }); await poll(() => page.frames().some(frame => frame.url().includes("/gui.html")), "actual GUI"); gui = page.frames().find(frame => frame.url().includes("/gui.html"));
  const next = gui.getByRole("button", { name: /^(下一步|Next|知道了|Got it)$/ });
  await next.first().waitFor({ state: "visible", timeout: 3500 }).catch(() => {}); for (let n=0;n<4&&await next.count()&&await next.first().isVisible();n++) await next.first().click();
  await gui.getByRole("button", { name: /^(打开工作区|Open Workspace)$/ }).last().click(); await gui.getByText(/^(打开文件夹|Open Folder)$/).first().click();
  await poll(async () => (await state()).workspaces.some(entry => path.resolve(entry.workspaceDir).toLowerCase() === workspace.toLowerCase()), "own workspace registered");
  await gui.locator('[data-telemetry-id="open_settings"]').first().click(); await gui.locator('[data-telemetry-id="settings_nav_models"]').click();
  await gui.locator('[data-telemetry-id="add_model_provider"]').click(); await gui.getByLabel(/^(服务提供方名称|Provider Name)$/).fill("Fixture CPA"); await gui.getByLabel(/^(基础 URL|Base URL)$/).fill(local.baseUrl); await gui.getByLabel(/^(API 密钥|API Key)$/).fill(local.apiKey); await gui.locator('[data-telemetry-id="submit_provider_form"]').click();
  await gui.getByText("Fixture CPA", { exact: true }).first().waitFor({ state: "visible" });
  await gui.locator('[data-telemetry-id="add_model_profile"]').click(); await gui.getByLabel(/^(模型名称|Model Name)$/).fill(local.model); await gui.getByLabel(/^(显示名称|Display Name)$/).fill("Fixture CPA Model"); await gui.locator('[data-telemetry-id="submit_model_form"]').click();
  await gui.getByText("Fixture CPA Model", { exact: true }).first().waitFor({ state: "visible" });
  for (let n=0;n<2;n++) { await gui.locator('[data-telemetry-id="settings_select"]').nth(n).click(); await gui.locator('[data-telemetry-id="settings_select_option"]').filter({ hasText: "Fixture CPA Model" }).click(); }
  await gui.locator('[data-telemetry-id="settings_back"]').click(); await choose("Fixture CPA Model");
  await prompt("GCW_E2E_A fixture CPA baseline. Reply directly.", "GCW_REPLY_A_COMPLETE", local); checks.push("CPA fixture replies through original model selection before official enable");
  const workspaceSettings = path.join(workspace, ".gamecowork-cli/settings.json"), settingsBefore = fs.readFileSync(workspaceSettings);
  const anonymous=await openChatModelOptions(gui);assert.equal(await anonymous.getByText(/^(内置模型|Built-in Models)$/,{exact:true}).count(),0);assert.equal(await anonymous.getByText(/^(添加自定义模型|Add Custom Model)$/,{exact:true}).count(),1);assert.equal(keyCalls,0);
  await closeChatModelMenu(gui);checks.push('Unauthenticated native menu keeps CPA and the original add-custom footer without fetching an official key');
  await login('alpha');assert.equal(keyCalls,0);checks.push('Login loads canonical config-v3 metadata without obtaining a CLI inference key');
  await verifyMenu('alpha');await page.screenshot({path:path.join(run,'01-canonical-native-menu.png'),fullPage:true});
  assert.equal(keyCalls,0);assert.ok((await state()).models.some(model=>model.title==='Fixture CPA Model'));
  assert.equal((await state()).models.some(model=>model.title.includes('Codely 官方')||model.title==='fixture-raw-must-stay-hidden'),false);
  const title=nativeModels[0].name;
  await choose(title);await chooseChatReasoning(gui,'high',poll,async()=>(await state()).selectedReasoning);
  const toolWireStart=official.wireRequests.length;
  await prompt(`GCW_E2E_READ_FILE use read_file to read ${fixtureFile}, then confirm the real result.`, "GCW_TOOL_READ_CONFIRMED", official);
  const toolWire=official.wireRequests.slice(toolWireStart).filter(entry=>entry.path==='/v1/chat/completions'&&entry.stream);assert.ok(toolWire.length>=2);assert.ok(toolWire.every(entry=>entry.model==='fixture-core'&&entry.reasoningEffort==='high'));
  assert.ok(official.requests.some(entry => entry.requestedReadTool)); assert.ok(official.requests.some(entry => entry.readToolResultContainsFixture && entry.completed));
  assertSettingsPreserved(workspaceSettings,settingsBefore);checks.push('Native Core alias and High reasoning reach actual guarded-Agent tool calls and final output without changing CPA settings');
  await chooseChatReasoning(gui,'max',poll,async()=>(await state()).selectedReasoning);const maxStart=official.wireRequests.length;
  await prompt('GCW_E2E_A native Core Max mapping fixture. Reply directly.','GCW_REPLY_A_COMPLETE',official);
  assert.ok(official.wireRequests.slice(maxStart).some(entry=>entry.stream&&entry.model==='fixture-core'&&entry.reasoningEffort==='max'));checks.push('Native Max reasoning changes the actual outgoing parameter, not only its menu label');
  for(const model of nativeModels.slice(1)) {
    await choose(model.name);const before=official.wireRequests.length;
    await prompt('GCW_E2E_A native alias '+model.name+'. Reply directly.','GCW_REPLY_A_COMPLETE',official);
    assert.ok(official.wireRequests.slice(before).some(entry=>entry.stream&&entry.model===model.model));
  }
  checks.push('Every enabled canonical fixture alias reaches its exact underlying model through the official proxy');
  await choose('Basic');await gui.locator('[data-telemetry-id="model_select"]').first().click();assert.equal(await gui.locator('[data-telemetry-id="model_cascade_menu"]').getByText(/^(推理|Reasoning)$/,{exact:true}).count(),0);await closeChatModelMenu(gui);
  checks.push('A canonical model without reasoning metadata retains the native single-level menu');
  await choose(title);await chooseChatReasoning(gui,'high',poll,async()=>(await state()).selectedReasoning);
  await choose("Fixture CPA Model"); await prompt("GCW_E2E_B return to CPA fixture.", "GCW_REPLY_B_COMPLETE", local); checks.push("Switching back to CPA restores the original Provider and real output");
  // A delayed old-account metadata reply cannot repopulate the next account.
  holdNextMenu=true;const oldRefresh=rpc('codelyOfficial/refreshMenu',{},(await state()).workspaceKey).catch(error=>({error:String(error)}));await poll(()=>heldMenu,'old-account metadata request held');
  await logout();await login('basic');heldMenu.release();const staleReply=await oldRefresh;assert.notEqual(staleReply?.ready,true,'A request bound to the prior account cannot return a ready menu');await poll(()=>menuMatches('basic'),'late old metadata cannot replace Basic account catalog');
  const basicMenu=await openChatModelOptions(gui);assert.equal(await chatModelRow(basicMenu,title).count(),0);await choose('Basic');const basicStart=official.wireRequests.length;
  await prompt('GCW_E2E_A Basic-only account canonical permission fixture. Reply directly.','GCW_REPLY_A_COMPLETE',official);assert.ok(official.wireRequests.slice(basicStart).some(entry=>entry.stream&&entry.model==='fixture-basic'));
  assertSettingsPreserved(workspaceSettings,settingsBefore);checks.push('Account switch honors a Basic-only canonical directory; late previous metadata is rejected and Basic inference remains usable');
  await logout();await login('denied');const deniedKeys=keyCalls,deniedWire=official.wireRequests.length;
  await verifyMenu('denied');await page.screenshot({path:path.join(run,'02-server-disabled-menu.png'),fullPage:true});
  const deniedMenu=await openChatModelOptions(gui),deniedSelected=(await state()).selected;
  for(const model of personas.denied.models){await chatModelRow(deniedMenu,model.name).click({force:true});assert.equal((await state()).selected,deniedSelected,'Disabled server model cannot alter selection');}
  assert.equal(keyCalls,deniedKeys);assert.equal(official.wireRequests.length,deniedWire);assertSettingsPreserved(workspaceSettings,settingsBefore);
  checks.push('A non-Pro active subscription and seat cannot override server-disabled native models or obtain an inference key');
  await logout();await login('beta');await verifyMenu('beta');
  await choose(title);assert.equal((await state()).selectedReasoning,'max','Same display alias with a different underlying model cannot inherit the prior model reasoning key');
  const betaStart=official.wireRequests.length;await prompt('GCW_E2E_A second-account model binding fixture. Reply directly.','GCW_REPLY_A_COMPLETE',official);
  assert.ok(official.wireRequests.slice(betaStart).some(entry=>entry.stream&&entry.model==='fixture-core-beta'&&entry.reasoningEffort==='max'));assertSettingsPreserved(workspaceSettings,settingsBefore);
  checks.push('A later account resolves the same native label to its own underlying model and reasoning binding');
  await prompt("GCW_E2E_SLOW slow official cancellation fixture.", null, official); await gui.getByText("GCW_SLOW_STARTED", { exact: false }).last().waitFor({ state: "visible" });
  const streamingSelected=(await state()).selected,streamingReasoning=(await state()).selectedReasoning,streamingKeys=keyCalls;
  const streamingMenu=await openChatModelOptions(gui);await chatModelRow(streamingMenu,'Basic').click();
  await gui.getByText(/^(对话进行中，请稍候再切换模型|Cannot switch models while the chat is in progress)$/,{exact:true}).last().waitFor({state:'visible'});
  assert.equal((await state()).selected,streamingSelected);assert.equal(keyCalls,streamingKeys);
  const closeToast=gui.getByRole('button',{name:'Close toast',exact:true});if(await closeToast.count())await closeToast.last().click();
  if(!await gui.locator('[data-telemetry-id="model_cascade_menu"]').isVisible())await gui.locator('[data-telemetry-id="model_select"]').first().click();
  const reasoningDuringStream=gui.locator('[data-telemetry-id="model_cascade_menu"]').getByText(/^(推理|Reasoning)$/,{exact:true}).locator('xpath=ancestor::button[1]');
  assert.equal(await reasoningDuringStream.isDisabled(),true);assert.equal((await state()).selectedReasoning,streamingReasoning);await closeChatModelMenu(gui);
  checks.push('The original model callback rejects switching during a live stream and native reasoning controls remain disabled');
  await logout();await poll(() => official.requests.some(entry => entry.scenario === "slow" && entry.aborted), "logout cancels active upstream request"); await poll(async () => !(await state()).streaming, "GUI clears interrupted official stream");
  assert.equal((await rpc("codelyOfficial/status", {}, (await state()).workspaceKey)).enabled, false); checks.push("Logout immediately aborts the actual official upstream and revokes programming capability");
  assert.ok(!JSON.stringify(await state()).includes(official.apiKey)); assert.ok(!shellLog.includes(official.apiKey));
  assert.equal(official.wireRequests.some(entry=>entry.path==='/v1/models'),false,'Raw inference IDs are never substituted for canonical UI metadata');
  assert.deepEqual(blockedProviderAttempts(),[],'Neither the real Core nor guarded Agent attempts a real service');
  assert.equal(blocked.length, 0); assert.equal(errors.length, 0, errors.join("\n"));
  await page.screenshot({ path: path.join(run, "official-programming-complete.png"), fullPage: true });
  fs.writeFileSync(path.join(run, "result.json"), JSON.stringify({ passed:true,previous,packaged,checks,keyCalls,officialRequests:official.requests,officialWire:official.wireRequests,localRequests:local.requests,accountCalls,
    provenance:{binary,coreDir,frontend,agent,frontendMainSha256:createHash('sha256').update(fs.readFileSync(path.join(frontend,'assets',previous?'index-DvRYaIVa.js':'index-BRxZ4eG7.js'))).digest('hex'),coreSha256:createHash('sha256').update(fs.readFileSync(path.join(coreDir,'index.js'))).digest('hex'),guardedAgentSourceSha256:manifest.sourceSha256,workspaceSettingsUnchanged:true}},null,2));
  console.log(JSON.stringify({ passed: true, previous, output: run, checks }, null, 2));
} catch (error) {
  fs.writeFileSync(path.join(run, "failure.txt"), String(error.stack || error) + "\n" + shellLog);
  const current=await state().catch(()=>null),officialStatus=await rpc('codelyOfficial/status',{},current?.workspaceKey).catch(error=>({error:String(error)}));
  const profileInfo=await rpc('config/getSerializedProfileInfo',{},current?.workspaceKey).catch(error=>({error:String(error)}));
  const configErrors=profileInfo?.result?.errors||profileInfo?.errors||profileInfo?.error;
  fs.writeFileSync(path.join(run,'failure-evidence.json'),JSON.stringify({previous,persona,keyCalls,checks,officialWire:official.wireRequests,officialRequests:official.requests,accountCalls,menuReplies,officialStatus,configErrors,guardAttempts:blockedProviderAttempts(),state:current},null,2));
  if(gui)await gui.locator('body').ariaSnapshot().then(snapshot=>fs.writeFileSync(path.join(run,'failure.aria.txt'),snapshot)).catch(()=>{});
  if (page) await page.screenshot({ path: path.join(run, "failure.png"), fullPage: true }).catch(() => {});
  throw error;
} finally {
  await browser?.close(); if (shell && shell.exitCode === null) { const exit = new Promise(resolve => shell.once("exit", resolve)); shell.kill(); await exit; }
  await official.close(); await local.close(); accountServer.closeAllConnections(); await new Promise(resolve => accountServer.close(resolve));
}
