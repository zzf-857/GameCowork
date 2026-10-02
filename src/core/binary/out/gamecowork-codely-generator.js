'use strict';
// HTTP-shape compatibility for the actual Codely Quick/History components.
// Source contracts: tests/fixtures/codely-generator-api-contract.json.
// This module never contacts Codely or invents generation, account, or quota data.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const STATE_LIMIT = 16 * 1024 * 1024;
const INPUT_LIMIT = 64 * 1024 * 1024, MULTIPART_LIMIT = INPUT_LIMIT + 256 * 1024;
const ID = /^[A-Za-z0-9_-]{1,100}$/;
const CATEGORIES = new Set(['image', '3d', 'video', 'audio', 'other']);
const LOCAL_USER = Object.freeze({ id: 'gamecowork-local', name: 'GameCowork 本地用户', accountMode: 'local' });
const CPA_MODEL_ID = 'cpa-gpt-image-2';
class ApiError extends Error {
  constructor(status, code, message = code) { super(message); this.status = status; this.code = code; }
}
const fail = (status, code, message) => { throw new ApiError(status, code, message); };
const clone = value => JSON.parse(JSON.stringify(value));
function boundedText(value, label, max, required = false, multiline = false) {
  if (typeof value !== 'string' || value.length > max || (multiline ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/).test(value) || required && !value.trim()) fail(400, 'invalid_' + label);
  return value;
}
function identifier(value, label) { if (typeof value !== 'string' || !ID.test(value) || ['constructor','prototype','__proto__'].includes(value)) fail(400, 'invalid_' + label); return value; }
function object(value, label) { if (!value || typeof value !== 'object' || Array.isArray(value)) fail(400, 'invalid_' + label); return value; }
function integer(value, fallback, maximum) { if (value === undefined || value === '') return fallback; const result = Number(value); if (!Number.isInteger(result) || result < 1 || result > maximum) fail(400, 'invalid_pagination'); return result; }
function boolean(value, label) { if (value === undefined || value === '') return undefined; if (value === true || value === 'true') return true; if (value === false || value === 'false') return false; fail(400, 'invalid_' + label); }
function date(value, label) { if (value === undefined || value === '') return undefined; const parsed = Date.parse(boundedText(value, label, 80, true)); if (!Number.isFinite(parsed)) fail(400, 'invalid_' + label); return parsed; }
function ids(value, label, maximum) { if (!Array.isArray(value) || value.length > maximum) fail(400, 'invalid_' + label); return [...new Set(value.map(item => identifier(item, label)))]; }
function loopbackOrigin(value) {
  let url; try { url = new URL(value); } catch { fail(400, 'invalid_local_origin'); }
  if (url.protocol !== 'http:' || !['127.0.0.1','localhost','[::1]'].includes(url.hostname) || url.username || url.password || url.search || url.hash || url.pathname !== '/' || url.origin !== value) fail(400, 'invalid_local_origin');
  return url.origin;
}
function createCodelyGeneratorApi({ assetService }) {
  if (!assetService || !path.isAbsolute(assetService.root || '') || typeof assetService.getOwnedSnapshot !== 'function') throw Error('A trusted owned asset service is required');
  const root = assetService.root, stateFile = path.join(root, 'codely-generator-state.json');
  function checked(file) {
    const absolute = path.resolve(file); if (!absolute.startsWith(root + path.sep)) throw Error('Compatibility state escaped its owned root');
    for (let current = absolute; ; current = path.dirname(current)) {
      if (fs.existsSync(current)) { const info = fs.lstatSync(current); if (info.isSymbolicLink() || info.isFile() && info.nlink !== 1) throw Error('Linked compatibility storage is unsupported'); }
      if (path.dirname(current) === current) break;
    }
    return absolute;
  }
  assetService.assertRuntime(); checked(stateFile);
  let state = { version: 1, prefs: {}, tags: {}, taskTags: {}, modelBindings: {} };
  if (fs.existsSync(stateFile)) {
    const info = fs.statSync(stateFile); if (!info.isFile() || info.size > STATE_LIMIT) throw Error('Invalid local compatibility state');
    state = JSON.parse(fs.readFileSync(stateFile));
    if (state.version !== 1 || !state.prefs || !state.tags || !state.taskTags || [state.prefs,state.tags,state.taskTags].some(value => typeof value !== 'object' || Array.isArray(value))) throw Error('Invalid local compatibility state');
  }
  if (state.modelBindings === undefined) state.modelBindings = {};
  object(state.modelBindings, 'model_bindings');
  function commit(next) {
    assetService.assertRuntime(); const bytes = Buffer.from(JSON.stringify(next)); if (bytes.length > STATE_LIMIT) fail(413, 'local_state_too_large');
    checked(stateFile); const temporary = checked(stateFile + '.tmp-' + crypto.randomUUID()); let descriptor;
    try { descriptor = fs.openSync(temporary, 'wx', 0o600); fs.writeFileSync(descriptor, bytes); fs.fsyncSync(descriptor); fs.closeSync(descriptor); descriptor = undefined; checked(stateFile); assetService.assertRuntime(); fs.renameSync(temporary, stateFile); state = next; }
    finally { if (descriptor !== undefined) fs.closeSync(descriptor); if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
  }
  function tag(tagId, counts) { const record = state.tags[tagId]; return record ? { ...record, count: counts?.get(tagId) || 0 } : null; }
  function taskTags(taskId) { return (state.taskTags[taskId] || []).map(tagId => tag(tagId)).filter(Boolean).map(record => ({ ...record, source: 'manual' })); }
  const visible = (record, scope) => scope === undefined || (record.workspaceKey || '') === scope;
  function scopeOf(data) { return data.workspaceKey === undefined ? undefined : boundedText(data.workspaceKey, 'workspaceKey', 2048); }
  function workspaceName(record, names) { const key = record.workspaceKey || ''; return key && typeof names?.[key] === 'string' ? names[key] : key; }
  function inputUrl(input, origin) { return origin + '/api/codely-generator/local-inputs/' + encodeURIComponent(input.id) + '/' + encodeURIComponent(input.filename) + '?workspaceKey=' + encodeURIComponent(input.workspaceKey || ''); }
  function artifactUrl(task, artifact, origin) { return origin + '/api/codely-generator/local-artifacts/' + encodeURIComponent(task.id) + '/' + encodeURIComponent(artifact.id) + '/' + encodeURIComponent(artifact.filename); }
  function isCpaTask(task) { return task.parameters?.studioModelId === CPA_MODEL_ID && task.model === 'gpt-image-2' && task.kind === 'image'; }
  function studioType(task) { return isCpaTask(task) ? CPA_MODEL_ID : task.model || task.kind; }
  function row(task, origin, names) {
    const category = task.kind === 'model' ? '3d' : CATEGORIES.has(task.kind) ? task.kind : 'other';
    const output = { artifacts: [] };
    for (const artifact of task.artifacts || []) {
      const url = artifactUrl(task, artifact, origin), key = artifact.kind === 'model' ? 'modelUrl' : artifact.kind === 'image' ? 'imageUrl' : artifact.kind === 'video' ? 'videoUrl' : artifact.kind === 'audio' ? 'audioUrl' : 'downloadUrl';
      if (!output[key]) output[key] = url;
      output.artifacts.push({ url, mime: artifact.mime, filename: artifact.filename, byteLength: artifact.byteLength, sha256: artifact.sha256, ...(artifact.width ? { width: artifact.width, height: artifact.height } : {}) });
    }
    const input = { ...clone(task.parameters || {}), prompt: task.prompt };
    for (const [kind, field] of [['image','imageUrls'],['video','videos'],['audio','audios'],['model','modelUrls']]) {
      const urls = (task.inputs || []).filter(reference => reference.kind === kind || kind === 'image' && reference.mime?.startsWith('image/')).map(reference => inputUrl(reference, origin));
      if (urls.length) input[field] = urls;
    }
    if (input.modelUrls?.length) input.modelUrl = input.modelUrls[0];
    return { id: task.id, taskId: task.id, type: studioType(task), name: isCpaTask(task) ? 'GPT Image 2 · CPA' : task.model || task.providerId, category,
      status: task.status === 'interrupted' ? 'failed' : task.status === 'cancel_requested' ? 'running' : task.status,
      createdTime: task.createdTime, updatedTime: task.updatedTime, discarded: task.discarded === true,
      workspaceName: workspaceName(task, names), ...(task.workspaceKey ? { workspaceKey: task.workspaceKey } : {}),
      input: { data: input }, output: { data: output }, tags: taskTags(task.id),
      ...(task.error ? { error: task.error, errorCode: task.status === 'interrupted' ? 'local_task_interrupted' : 'local_task_failed' } : {}),
      local: { accountMode: 'local', source: 'gamecowork-owned-assets', providerId: task.providerId, originalStudioModelKnown: false, ...(isCpaTask(task) ? { descriptorSource: 'gamecowork-cpa-extension' } : {}) } };
  }
  function authorizeHistory(query) {
    if (query.historyScope !== undefined && query.historyScope !== 'self' || query.historyEmail) fail(403, 'global_history_view_required', 'Only actual GameCowork local history is available');
  }
  function filterTasks(tasks, query, names, ignoreTags = false) {
    authorizeHistory(query); const discarded = boolean(query.discarded, 'discarded'), start = date(query.startTime, 'startTime'), end = date(query.endTime, 'endTime');
    const search = query.query === undefined ? '' : boundedText(query.query, 'query', 1000).toLocaleLowerCase();
    const category = query.category; if (category !== undefined && category !== '' && category !== 'all' && !CATEGORIES.has(category)) fail(400, 'invalid_category');
    const missing = boolean(query.workspaceMissing, 'workspaceMissing'); if (query.workspaceName !== undefined) boundedText(query.workspaceName, 'workspaceName', 2048);
    const selected = ignoreTags || query.tagIds === undefined || query.tagIds === '' ? [] : ids(Array.isArray(query.tagIds) ? query.tagIds : String(query.tagIds).split(','), 'tagIds', 100);
    return tasks.filter(task => {
      const timestamp = Date.parse(task.createdTime), name = workspaceName(task, names), actualCategory = task.kind === 'model' ? '3d' : CATEGORIES.has(task.kind) ? task.kind : 'other';
      const status = task.status === 'interrupted' ? 'failed' : task.status === 'cancel_requested' ? 'running' : task.status;
      return (discarded === undefined || !!task.discarded === discarded) && (!query.status || status === query.status) && (!category || category === 'all' || actualCategory === category) &&
        (!query.type || studioType(task) === query.type) && (!search || (task.prompt + ' ' + (task.model || '') + ' ' + task.providerId).toLocaleLowerCase().includes(search)) &&
        (start === undefined || timestamp >= start) && (end === undefined || timestamp < end) && (!query.workspaceName || name === query.workspaceName) && (missing !== true || !name) &&
        selected.every(tagId => (state.taskTags[task.id] || []).includes(tagId));
    }).sort((a,b) => b.createdTime.localeCompare(a.createdTime) || b.id.localeCompare(a.id));
  }
  function tagCounts(tasks) { const counts = new Map(); for (const task of tasks) for (const tagId of new Set(state.taskTags[task.id] || [])) counts.set(tagId, (counts.get(tagId) || 0) + 1); return counts; }
  async function configuredCpa(providerId = state.modelBindings[CPA_MODEL_ID]?.providerId) {
    if (!providerId) return null;
    const { providers } = await assetService.dispatch('generator/listProviders', {});
    const provider = providers.find(item => item.id === providerId);
    return provider?.enabled && provider.model === 'gpt-image-2' && provider.kinds.includes('image') &&
      provider.authMode !== 'none' && provider.apiKeyConfigured && provider.adapter.responseMode === 'outputs' &&
      provider.adapter.create.method === 'POST' && provider.adapter.create.path === '/images/generations' ? provider : null;
  }
  async function handle(data) {
    assetService.assertRuntime(); const origin = loopbackOrigin(data.origin), scope = scopeOf(data), method = boundedText(data.method, 'method', 10, true).toUpperCase();
    let route = boundedText(data.path, 'path', 2048, true); if (!route.startsWith('/') || route.includes('\\') || route.includes('?') || route.includes('#') || route.split('/').some(part => ['.','..'].includes(part))) fail(400, 'invalid_path');
    route = route.replace(/^\/api\/codely-generator(?=\/|$)/, '') || '/';
    if (route.startsWith('/editor/')) route = route.slice('/editor'.length);
    const query = data.query === undefined ? {} : object(data.query, 'query'), body = data.body === undefined || data.body === null ? {} : object(data.body, 'body');
    const names = data.workspaceNames && typeof data.workspaceNames === 'object' && !Array.isArray(data.workspaceNames) ? data.workspaceNames : {};
    const snapshot = assetService.getOwnedSnapshot(), tasks = snapshot.tasks.filter(task => visible(task, scope)), inputs = snapshot.inputs.filter(input => visible(input, scope));
    const taskById = taskId => { identifier(taskId, 'taskId'); const task = tasks.find(item => item.id === taskId); if (!task) fail(404, 'task_not_found'); return task; };
    const ok = body => ({ status: 200, body });
    if (method === 'GET' && (route === '/local-session' || route === '/local/model-bindings')) {
      const provider = await configuredCpa(), models = provider ? { [CPA_MODEL_ID]: { available: true, providerId: provider.id, model: 'gpt-image-2' } } : {};
      if (route === '/local/model-bindings') return ok({ models });
      return ok({ mode: 'gamecowork-local', user: LOCAL_USER, capabilities: { localHistory: true, localAssets: true, localTags: true, localGeneration: !!provider, models } });
    }
    if (method === 'PUT' && route === '/local/model-bindings/' + CPA_MODEL_ID) {
      if (Object.keys(body).some(key => key !== 'providerId')) fail(400, 'invalid_model_binding');
      const modelBindings = { ...state.modelBindings };
      if (body.providerId === null) delete modelBindings[CPA_MODEL_ID];
      else {
        const providerId = identifier(body.providerId, 'providerId');
        if (!await configuredCpa(providerId)) fail(400, 'cpa_provider_unavailable', '请先配置已启用的 GPT Image 2 图片接口');
        modelBindings[CPA_MODEL_ID] = { providerId, model: 'gpt-image-2' };
      }
      commit({ ...state, modelBindings });
      return ok({ modelId: CPA_MODEL_ID, configured: !!modelBindings[CPA_MODEL_ID] });
    }
    if (method === 'GET' && route === '/user/me') return ok(LOCAL_USER);
    if (route === '/sso/bootstrap' || route.startsWith('/cp/user/')) fail(401, 'official_authentication_unavailable', 'GameCowork local identity is not an official Codely login');
    if (route.startsWith('/credit/')) return { status: 503, body: { error: 'official_quota_unavailable', message: '官方积分、订阅与报价在 GameCowork 本地模式中不可用', currentCredits: null, credits: null, paidType: null, productCode: '', fingerprint: null, supported: false, accountMode: 'local' } };
    if (method === 'GET' && route === '/generation-history/access') return ok({ globalHistoryView: false, accountMode: 'local' });
    if (method === 'GET' && route === '/tasks') { const selected = filterTasks(tasks, query, names), page = integer(query.page, 1, 100000), size = integer(query.pageSize, 40, 100); const items = selected.slice((page-1)*size,page*size).map(task => row(task, origin, names)); return ok({ tasks: items, total: selected.length, page, size: items.length }); }
    const detail = /^\/(?:task\/([^/]+)\/(?:status|id-status)|generation-history\/task\/([^/]+))$/.exec(route);
    if (method === 'GET' && detail) { authorizeHistory(query); return ok(row(taskById(decodeURIComponent(detail[1] || detail[2])), origin, names)); }
    if (method === 'GET' && route === '/upload/records') {
      authorizeHistory(query); const start = date(query.startTime, 'startTime'), end = date(query.endTime, 'endTime'), page = integer(query.page, 1, 100000), size = integer(query.pageSize, 500, 500);
      const selected = inputs.filter(input => (start === undefined || Date.parse(input.createdTime) >= start) && (end === undefined || Date.parse(input.createdTime) < end)).sort((a,b) => b.createdTime.localeCompare(a.createdTime));
      return ok({ records: selected.slice((page-1)*size,page*size).map(input => ({ id: input.id, url: inputUrl(input, origin), kind: input.kind, createdTime: input.createdTime, filename: input.filename, mime: input.mime, byteLength: input.byteLength, sha256: input.sha256 })), total: selected.length, page });
    }
    if (method === 'GET' && route === '/generation-history/workspaces') {
      authorizeHistory(query); const page = integer(query.page, 1, 100000), needle = query.query === undefined ? '' : boundedText(query.query, 'query', 1000).toLocaleLowerCase(), discarded = boolean(query.discarded, 'discarded');
      const values = [...new Set(tasks.filter(task => discarded === undefined || !!task.discarded === discarded).map(task => workspaceName(task,names)).filter(name => name && name.toLocaleLowerCase().includes(needle)))].sort();
      return ok({ workspaces: values.slice((page-1)*40,page*40), page, hasMore: page*40 < values.length });
    }
    if (route === '/tags' && method === 'GET') { const counts = tagCounts(filterTasks(tasks, query, names, true)); return ok({ tags: Object.keys(state.tags).map(tagId => tag(tagId,counts)) }); }
    const tagRoute = /^\/tags\/([^/]+)$/.exec(route);
    if (route === '/tags' && method === 'POST' || tagRoute && method === 'PATCH') {
      const tagId = tagRoute ? identifier(decodeURIComponent(tagRoute[1]), 'tagId') : 'tag_' + crypto.randomUUID();
      if (tagRoute && !Object.prototype.hasOwnProperty.call(state.tags,tagId)) fail(404, 'tag_not_found');
      if (!tagRoute && Object.keys(state.tags).length >= 1000) fail(409, 'tag_limit_reached');
      const name = boundedText(body.name, 'tag_name', 32, true).normalize('NFKC').trim().replace(/\s+/g,' '), description = boundedText(body.description ?? '', 'tag_description', 500, false, true).trim();
      if (Object.values(state.tags).some(record => record.id !== tagId && record.name.normalize('NFKC').toLocaleLowerCase() === name.toLocaleLowerCase())) fail(409, 'tag_name_exists');
      const record = { id: tagId, name, description, scope: 'user', aliases: [], createdTime: state.tags[tagId]?.createdTime || new Date().toISOString() };
      commit({ ...state, tags: { ...state.tags, [tagId]: record } }); return ok(tag(tagId,tagCounts(tasks)));
    }
    if (tagRoute && method === 'DELETE') {
      const tagId = identifier(decodeURIComponent(tagRoute[1]), 'tagId'); if (!Object.prototype.hasOwnProperty.call(state.tags,tagId)) fail(404,'tag_not_found');
      const tags = { ...state.tags }; delete tags[tagId]; const taskTags = Object.fromEntries(Object.entries(state.taskTags).map(([taskId, assigned]) => [taskId, assigned.filter(value => value !== tagId)]));
      commit({ ...state, tags, taskTags }); return ok({ deleted: true });
    }
    if (route === '/tasks/tags' && method === 'PATCH') {
      const taskIds = ids(body.taskIds, 'taskIds', 100), add = ids(body.addTagIds || [], 'addTagIds', 100), remove = ids(body.removeTagIds || [], 'removeTagIds', 100); if (!taskIds.length) fail(400,'invalid_taskIds');
      const known = new Set(tasks.map(task => task.id)), unknownTag = add.some(tagId => !Object.prototype.hasOwnProperty.call(state.tags,tagId)), taskTags = { ...state.taskTags }, results = [];
      for (const taskId of taskIds) { if (!known.has(taskId) || unknownTag) { results.push({ taskId, updated: false, error: unknownTag ? 'tag_not_found' : 'task_not_found' }); continue; }
        const assigned = [...new Set([...(taskTags[taskId] || []).filter(tagId => !remove.includes(tagId)), ...add])]; if (assigned.length > 100) { results.push({ taskId, updated: false, error: 'task_tag_limit_reached' }); continue; } taskTags[taskId] = assigned; results.push({ taskId, updated: true }); }
      if (results.some(result => result.updated)) commit({ ...state, taskTags }); return ok({ results });
    }
    if (route === '/tasks/discarded' && method === 'PUT') {
      const taskIds = ids(body.taskIds, 'taskIds', 200); if (!taskIds.length || typeof body.discarded !== 'boolean') fail(400,'invalid_discard_request'); taskIds.forEach(taskById);
      return ok(await assetService.dispatch('generator/updateTasksDiscarded', { taskIds, discarded: body.discarded }));
    }
    if (route === '/user/ui-prefs' && method === 'GET') return ok(clone(state.prefs));
    if (route === '/user/ui-prefs' && method === 'PUT') {
      const prefs = object(body.prefs,'prefs'); if (Object.keys(prefs).some(key => key !== 'generationViewMode') || prefs.generationViewMode !== undefined && !['grid','list'].includes(prefs.generationViewMode)) fail(400,'invalid_preferences');
      commit({ ...state, prefs: { ...state.prefs, ...prefs } }); return ok(clone(state.prefs));
    }
    const upload = /^\/sso\/upload\/(image|video|audio|model|model-conversion|splat)$/.exec(route);
    if (upload && method === 'POST') {
      const input = inputs.find(input => input.id === body.inputId); if (!input) fail(404,'input_not_found'); if (input.kind !== (upload[1] === 'model-conversion' || upload[1] === 'splat' ? 'model' : upload[1])) fail(400,'input_kind_mismatch');
      assetService.getInputPath(input.id,input.workspaceKey); return ok({ url: inputUrl(input,origin) });
    }
    if (method === 'GET' && route === '/sso/attachment/download-url') {
      let url; try { url = new URL(query.url); } catch { fail(400,'invalid_owned_url'); } if (url.origin !== origin || url.username || url.password || url.hash) fail(400,'invalid_owned_url');
      const artifact = /^\/api\/codely-generator\/local-artifacts\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(url.pathname), reference = /^\/api\/codely-generator\/local-inputs\/([^/]+)\/([^/]+)$/.exec(url.pathname);
      if (artifact) { const task = taskById(decodeURIComponent(artifact[1])), asset = task.artifacts.find(item => item.id === decodeURIComponent(artifact[2])); if (!asset || decodeURIComponent(artifact[3]) !== asset.filename) fail(404,'artifact_not_found'); assetService.getArtifactPath(task.id,asset.id); return ok({ url: artifactUrl(task,asset,origin) }); }
      if (reference) { const input = inputs.find(item => item.id === decodeURIComponent(reference[1])); if (!input || decodeURIComponent(reference[2]) !== input.filename || (url.searchParams.get('workspaceKey') || '') !== (input.workspaceKey || '')) fail(404,'input_not_found'); assetService.getInputPath(input.id,input.workspaceKey); return ok({ url: inputUrl(input,origin) }); }
      fail(400,'invalid_owned_url');
    }
    if (method === 'POST' && route === '/sso/generate') {
      const modelId = boundedText(body.kind, 'model_id', 128, true), payload = object(body.data,'model_payload');
      const provider = modelId === CPA_MODEL_ID ? await configuredCpa() : null;
      if (!provider) return { status: 503, body: { error: 'generation_provider_not_configured', message: '该模型尚未绑定 GameCowork 本地生成服务', modelId, supported: false, accountMode: 'local' } };
      if (scope === undefined) fail(400, 'generation_workspace_scope_required');
      if (Object.keys(payload).some(key => !['prompt','model','size','quality','outputFormat','studioModelId'].includes(key)) ||
          payload.model !== 'gpt-image-2' || payload.studioModelId !== CPA_MODEL_ID || payload.size !== '1024x1024' ||
          payload.quality !== 'low' || payload.outputFormat !== 'png') fail(400, 'unsupported_cpa_image_parameters');
      const prompt = boundedText(payload.prompt, 'prompt', 32000, true, true);
      const created = await assetService.dispatch('generator/createTask', { providerId: provider.id, kind: 'image', model: 'gpt-image-2', prompt,
        workspaceKey: scope, parameters: clone(payload), inputIds: [] });
      return ok({ taskId: created.task.id });
    }
    if (/^\/sso\/(assets|effects)\/(search|download)$/.test(route)) fail(503,'asset_catalogue_unavailable','尚未配置原素材库的可用数据来源');
    fail(404, 'local_api_not_supported');
  }
  async function upload(data) {
    assetService.assertRuntime(); object(data,'request'); const origin = loopbackOrigin(data.origin);
    const scope = scopeOf(data); if (scope === undefined) fail(400,'upload_workspace_scope_required');
    if (data.path !== undefined || data.filePath !== undefined || data.root !== undefined) fail(400,'untrusted_upload_path');
    const stagingId = boundedText(data.stagingId,'stagingId',100,true);
    if (!/^i_[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(stagingId)) fail(400,'invalid_staging_identity');
    if (!Number.isInteger(data.byteLength) || data.byteLength < 1) fail(400,'invalid_upload_length');
    if (data.byteLength > MULTIPART_LIMIT) fail(413,'multipart_too_large');
    if (typeof data.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(data.sha256)) fail(400,'invalid_upload_checksum');
    const contentType = boundedText(data.contentType,'content_type',1024,true);
    if (!/^multipart\/form-data\s*;/i.test(contentType)) fail(400,'multipart_content_type_required');
    const kind = boundedText(data.kind,'upload_kind',32,true);
    if (!['image','video','audio','model','model-conversion'].includes(kind)) fail(415,'upload_kind_not_supported');
    const expectedKind = kind === 'model-conversion' ? 'model' : kind;
    const rawPath = checked(path.join(root,'incoming',stagingId+'.bin')), info = fs.statSync(rawPath);
    if (!info.isFile() || info.size !== data.byteLength || info.size > MULTIPART_LIMIT) fail(400,'upload_length_changed');
    const raw = fs.readFileSync(rawPath); if (raw.length !== data.byteLength || crypto.createHash('sha256').update(raw).digest('hex') !== data.sha256) fail(400,'upload_checksum_changed');
    let form;
    try { form = await new Request(origin+'/api/codely-generator/local-multipart-parser',{method:'POST',headers:{'Content-Type':contentType},body:raw}).formData(); }
    catch { fail(400,'invalid_multipart_body'); }
    assetService.assertRuntime();
    const entries = [...form.entries()];
    if (entries.length !== 1 || entries[0][0] !== expectedKind || typeof entries[0][1] === 'string') fail(400,'single_matching_file_required');
    const file = entries[0][1], filename = boundedText(file.name,'filename',255,true);
    if (/[\\/]/.test(filename) || ['.','..'].includes(filename)) fail(400,'invalid_filename');
    if (!Number.isSafeInteger(file.size) || file.size < 1 || file.size > INPUT_LIMIT) fail(413,'reference_file_too_large');
    const bytes = Buffer.from(await file.arrayBuffer()); if (bytes.length !== file.size) fail(400,'reference_file_length_changed');
    let actual;
    try { actual = assetService.inspectInputBytes(bytes); } catch { fail(415,'reference_media_unsupported','参考文件不是当前本地服务可验证的完整媒体格式'); }
    if (actual.kind !== expectedKind) fail(415,'reference_media_kind_mismatch');
    const inputId = 'i_'+crypto.randomUUID(), decodedPath = checked(path.join(root,'incoming',inputId+'.bin'));
    let descriptor, identity;
    try {
      assetService.assertRuntime(); descriptor = fs.openSync(decodedPath,'wx',0o600); identity = fs.fstatSync(descriptor,{bigint:true}); fs.writeFileSync(descriptor,bytes); fs.fsyncSync(descriptor); fs.closeSync(descriptor); descriptor = undefined;
      const registered = assetService.registerInput({inputId,filename,byteLength:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),workspaceKey:scope});
      return handle({method:'POST',path:'/sso/upload/'+kind,body:{inputId:registered.input.id},origin,workspaceKey:scope});
    } finally {
      if (descriptor !== undefined) fs.closeSync(descriptor);
      if (identity && fs.existsSync(decodedPath)) { const actual = fs.lstatSync(checked(decodedPath),{bigint:true}); if (actual.dev === identity.dev && actual.ino === identity.ino && actual.nlink === 1n) fs.unlinkSync(decodedPath); }
    }
  }
  async function rebaseMedia(data) {
    assetService.assertRuntime(); object(data,'request'); const origin = loopbackOrigin(data.origin);
    if (data.root !== undefined || data.path !== undefined || data.filePath !== undefined) fail(400,'untrusted_media_root');
    if (!Array.isArray(data.urls) || data.urls.length > 512 || data.urls.some(url => typeof url !== 'string')) fail(400,'invalid_media_urls');
    if (Buffer.byteLength(JSON.stringify(data.urls)) > 2*1024*1024) fail(413,'media_urls_too_large');
    const snapshot = assetService.getOwnedSnapshot(), tasks = new Map(snapshot.tasks.map(task => [task.id,task])), inputs = new Map(snapshot.inputs.map(input => [input.id,input]));
    const verified = new Map(), replacements = {};
    for (const old of new Set(data.urls)) {
      try {
        const url = new URL(old); loopbackOrigin(url.origin);
        if (url.username || url.password || url.hash || /[\u0000-\u0020\u007f]/.test(old)) continue;
        // URL parsing normalizes dot segments. A caller cannot turn a different
        // raw route into an owned media route by asking this helper to normalize it.
        const rawPath = /^http:\/\/[^/?#]+([^?#]*)/i.exec(old)?.[1]; if (rawPath !== url.pathname) continue;
        const artifact = /^\/api\/codely-generator\/local-artifacts\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(url.pathname);
        const reference = /^\/api\/codely-generator\/local-inputs\/([^/]+)\/([^/]+)$/.exec(url.pathname);
        if (artifact && !url.search) {
          const taskId = decodeURIComponent(artifact[1]), artifactId = decodeURIComponent(artifact[2]), filename = decodeURIComponent(artifact[3]), task = tasks.get(taskId), asset = task?.artifacts?.find(item => item.id === artifactId);
          if (!asset || asset.filename !== filename) continue;
          const identity = 'artifact:' + taskId + ':' + artifactId;
          if (!verified.has(identity)) { try { assetService.getArtifactPath(taskId,artifactId); verified.set(identity,true); } catch { verified.set(identity,false); } }
          if (verified.get(identity)) replacements[old] = artifactUrl(task,asset,origin);
        } else if (reference && [...url.searchParams.keys()].length === 1 && url.searchParams.has('workspaceKey')) {
          const inputId = decodeURIComponent(reference[1]), filename = decodeURIComponent(reference[2]), input = inputs.get(inputId);
          if (!input || input.filename !== filename || url.searchParams.get('workspaceKey') !== (input.workspaceKey || '')) continue;
          const identity = 'input:' + inputId;
          if (!verified.has(identity)) { try { assetService.getInputPath(inputId,input.workspaceKey); verified.set(identity,true); } catch { verified.set(identity,false); } }
          if (verified.get(identity)) replacements[old] = inputUrl(input,origin);
        }
      } catch { /* Unrelated, missing or tampered media is deliberately unchanged. */ }
    }
    assetService.assertRuntime(); return { replacements };
  }
  let queue = Promise.resolve();
  function enqueue(operation, data) {
      const run = async () => {
        try { const response = await operation(object(data,'request')); if (Buffer.byteLength(JSON.stringify(response)) > 8*1024*1024) fail(413,'response_too_large'); return response; }
        catch (error) { return { status: error instanceof ApiError ? error.status : 500, body: { error: error instanceof ApiError ? error.code : 'local_storage_unavailable', message: error instanceof ApiError ? error.message : 'GameCowork 本地生成数据暂不可用', accountMode: 'local' } }; }
      };
      const result = queue.then(run,run); queue = result.then(() => undefined, () => undefined); return result;
  }
  return { dispatch: data => enqueue(handle,data), upload: data => enqueue(upload,data), rebaseMedia };
}
module.exports = { createCodelyGeneratorApi };
