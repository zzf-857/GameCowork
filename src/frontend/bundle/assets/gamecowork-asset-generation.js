// Native asset UI. Runtime dependencies come from the matching maintained
// bundle generation; no original iframe, authentication client or service.
export const assetTerminalStatuses = new Set(['completed', 'failed', 'cancelled', 'canceled', 'interrupted']);
export function assetResponse(reply) {
  if (reply?.status === 'error' || reply?.success === false) throw new Error(reply.error?.message || reply.error || reply.message || '请求失败');
  const value = reply?.status === 'success' ? reply.content : reply?.content ?? reply;
  if (value?.success === false || value?.status === 'error') throw new Error(value.error?.message || value.error || value.message || '请求失败');
  return value;
}
export function assetJsonObject(text, label = 'JSON') {
  let value; try { value = JSON.parse(text || '{}'); } catch { throw new Error(`${label} 不是有效 JSON`); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} 必须是 JSON 对象`);
  return value;
}
export function assetError(error) {
  return String(error?.message || error || '操作失败').replace(/Bearer\s+[^\s"']+/gi, 'Bearer [已隐藏]').slice(0, 300);
}
export function assetReferenceId(task, artifact) { return `${task.id}:${artifact.id}`; }
export const assetInputLimit = 64 * 1024 * 1024;
const assetInputMimes = new Set(['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm', 'model/gltf-binary']);
export function assetInputMetadata(input, workspaceKey) {
  if (!input || !/^[A-Za-z0-9_-]{1,100}$/.test(input.id || '') || typeof input.filename !== 'string' || !input.filename || !assetInputMimes.has(input.mime) || !Number.isSafeInteger(input.byteLength) || input.byteLength < 1 || input.byteLength > assetInputLimit || !/^[a-f0-9]{64}$/i.test(input.sha256 || '')) throw new Error('参考文件回执缺少有效的文件身份或字节信息');
  if (input.workspaceKey && input.workspaceKey !== (workspaceKey || 'default')) throw new Error('参考文件属于其它工作区，请在当前工作区重新选择');
  return { id: input.id, filename: input.filename, mime: input.mime, byteLength: input.byteLength, sha256: input.sha256, ...(input.workspaceKey ? { workspaceKey: input.workspaceKey } : {}) };
}
export function assetFileFields(text) {
  let fields; try { fields = JSON.parse(text); } catch { throw new Error('文件字段配置不是有效 JSON'); }
  if (!Array.isArray(fields) || !fields.length || fields.length > 8 || fields.some(value => !value || typeof value.name !== 'string' || !value.name.trim() || value.name.length > 100 || /[\u0000-\u001f\u007f]/.test(value.name) || !(value.inputIndex === 'all' || Number.isInteger(value.inputIndex) && value.inputIndex >= 0 && value.inputIndex < 8))) throw new Error('文件字段必须是 1–8 项数组，每项填写 name 和 inputIndex（0–7 或 all）');
  return fields.map(value => ({ name: value.name, inputIndex: value.inputIndex }));
}
export function assetValidateInputFiles(files, existing = []) {
  if (!files.length || files.length + existing.length > 8) throw new Error('每个生成任务最多选择 8 个参考文件');
  for (const file of files) if (!Number.isSafeInteger(file.size) || file.size < 1 || file.size > assetInputLimit || !/\.(png|jpe?g|webp|mp4|webm|glb)$/i.test(file.name || '')) throw new Error('请选择 PNG、JPEG、WebP、MP4、WebM 或 GLB 文件，单个文件最大 64 MiB');
  if (files.reduce((sum, file) => sum + file.size, 0) + existing.reduce((sum, file) => sum + file.byteLength, 0) > assetInputLimit) throw new Error('参考文件总大小不能超过 64 MiB');
}
export async function assetUploadInput(file, { workspaceKey = '', signal, fetcher = globalThis.fetch } = {}) {
  assetValidateInputFiles([file]);
  const query = new URLSearchParams({ filename: file.name, ...(workspaceKey ? { workspaceKey } : {}) });
  const response = await fetcher('/api/tauri/generator/inputs?' + query, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: file, signal, credentials: 'same-origin', redirect: 'error' });
  let reply; try { reply = await response.json(); } catch { throw new Error('参考文件缓存服务未返回有效回执'); }
  if (!response.ok) throw new Error(reply?.error?.message || reply?.error || '参考文件保存到本机失败');
  const input = assetInputMetadata(assetResponse(reply)?.input, workspaceKey);
  if (input.byteLength !== file.size) throw new Error('参考文件回执大小与所选文件不一致');
  return input;
}
function initialProvider() {
  return { name: '', baseUrl: '', apiKey: '', apiKeyConfigured: false, authMode: 'none', apiKeyHeader: 'X-API-Key', kinds: ['image', 'video', 'model'], enabled: true, model: '',
    responseMode: 'task', outputSelectors: { url: 'url', base64: 'base64', mime: 'mime', filename: 'filename' },
    create: { method: 'POST', path: '/tasks', bodyType: 'json', bodyTemplate: '{"kind":"{{kind}}","prompt":"{{prompt}}","model":"{{model}}","parameters":"{{parameters}}"}' },
    poll: { method: 'GET', path: '/tasks/{{taskId}}' }, cancel: { method: 'DELETE', path: '/tasks/{{taskId}}' },
    selectors: { taskId: 'id', status: 'status', progress: 'progress', outputs: 'outputs', error: 'error' },
    statusMap: { queued: ['queued', 'pending'], running: ['running', 'processing'], completed: ['completed', 'succeeded', 'success'], failed: ['failed', 'error'], cancelled: ['cancelled', 'canceled'] } };
}
export function assetProviderForm(initial) {
  const defaults = initialProvider(), adapter = initial?.adapter || {};
  return { ...defaults, ...initial, ...adapter, apiKey: '',
    create: { ...defaults.create, ...adapter.create }, poll: { ...defaults.poll, ...adapter.poll },
    cancel: adapter.cancel === null ? { method: 'DELETE', path: '' } : { ...defaults.cancel, ...adapter.cancel } };
}
export function assetTaskQuery({ workspaceKey, view, discarded, page, queryText, historyKind }) {
  return { ...(workspaceKey ? { workspaceKey } : {}), pageSize: 20,
    ...(view === 'history' ? { discarded, page, ...(queryText ? { query: queryText } : {}), ...(historyKind ? { kind: historyKind } : {}) } : { discarded: false, page: 1 }) };
}
function artifactKind(artifact) {
  if (artifact.kind) return artifact.kind;
  if (/^image\//.test(artifact.mime || '')) return 'image';
  if (/^video\//.test(artifact.mime || '')) return 'video';
  if (/\.(glb|fbx)$/i.test(artifact.filename || '')) return 'model';
  return 'other';
}

export function createAssetGenerationComponents(runtime) {
  const R = runtime.React, h = R.createElement;
  const methods = { providers: 'generator/listProviders', saveProvider: 'generator/saveProvider', deleteProvider: 'generator/deleteProvider',
    create: 'generator/createTask', get: 'generator/getTask', cancel: 'generator/cancelTask', tasks: 'generator/listTasks',
    discard: 'generator/updateTasksDiscarded', save: 'generator/saveOutput', resource: 'generator/getResource', getCanvas: 'generator/getCanvas', saveCanvas: 'generator/saveCanvas', ...runtime.methods };
  const colors = { background: 'var(--gamecowork-color-surface-primary)', card: 'var(--gamecowork-color-surface-card)', text: 'var(--gamecowork-color-text-primary)', muted: 'var(--gamecowork-color-text-secondary)', border: 'var(--gamecowork-color-border-subtle)', accent: 'var(--gamecowork-color-accent-default)' };
  const box = { border: `1px solid ${colors.border}`, borderRadius: 10, background: colors.card, padding: 16 };
  const control = { width: '100%', boxSizing: 'border-box', border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.background, color: colors.text, padding: '8px 10px', font: 'inherit' };
  const statusNames = { queued: '排队中', pending: '等待中', running: '生成中', processing: '生成中', completed: '已完成', failed: '失败', cancelled: '已取消', canceled: '已取消', cancel_requested: '正在请求取消', interrupted: '已中断' };
  const kinds = [['image', '图片'], ['video', '视频'], ['model', '3D 模型']];
  const button = (label, onClick, props = {}) => h('button', { type: 'button', onClick, ...props, style: { border: `1px solid ${colors.border}`, borderRadius: 6, background: colors.background, color: colors.text, padding: '7px 12px', cursor: props.disabled ? 'default' : 'pointer', opacity: props.disabled ? .55 : 1, ...props.style } }, label);
  const field = (label, input) => h('label', { style: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 } }, h('span', null, label), input);
  function ProviderForm({ initial, busy, onSave, onCancel }) {
    const [form, setForm] = R.useState(() => assetProviderForm(initial));
    const [advanced, setAdvanced] = R.useState(false), [localError, setLocalError] = R.useState(''), [saving, setSaving] = R.useState(false), submitLock = R.useRef(false);
    const [selectors, setSelectors] = R.useState(() => JSON.stringify(form.selectors || initialProvider().selectors, null, 2));
    const [outputSelectors, setOutputSelectors] = R.useState(() => JSON.stringify(form.outputSelectors || initialProvider().outputSelectors, null, 2));
    const [fileFields, setFileFields] = R.useState(() => JSON.stringify(form.create.fileFields || [{ name: 'image', inputIndex: 'all' }], null, 2));
    const [statusMap, setStatusMap] = R.useState(() => JSON.stringify(form.statusMap || initialProvider().statusMap, null, 2));
    const set = (key, value) => setForm(old => ({ ...old, [key]: value }));
    const endpoint = (key, label) => h('fieldset', { style: { ...box, display: 'grid', gap: 10 } }, h('legend', null, label),
      key === 'create' ? field('请求格式', h('select', { 'aria-label': '创建任务请求格式', value: form.create.bodyType || 'json', onChange: event => set('create', { ...form.create, bodyType: event.target.value }), style: control }, h('option', { value: 'json' }, 'JSON'), h('option', { value: 'multipart' }, 'Multipart 表单与文件'))) : null,
      field('HTTP 方法', h('select', { value: form[key]?.method || 'GET', onChange: e => set(key, { ...form[key], method: e.target.value }), style: control }, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(value => h('option', { value, key: value }, value)))),
      field(key === 'cancel' ? '接口路径（留空表示服务不支持取消）' : '接口路径', h('input', { 'aria-label': `${label}接口路径`, value: form[key]?.path || '', onChange: e => set(key, { ...form[key], path: e.target.value }), style: control })),
      field(key === 'create' ? form.create.bodyType === 'multipart' ? '普通表单字段 JSON 模板' : '请求 JSON 模板' : '请求 JSON 模板（可留空，GET 不发送正文）', h('textarea', { 'aria-label': `${label}请求 JSON 模板`, rows: key === 'create' ? 6 : 3, value: typeof form[key].bodyTemplate === 'string' ? form[key].bodyTemplate : form[key].bodyTemplate ? JSON.stringify(form[key].bodyTemplate, null, 2) : '', onChange: e => set(key, { ...form[key], bodyTemplate: e.target.value }), style: { ...control, fontFamily: 'monospace' } })),
      key === 'create' && form.create.bodyType === 'multipart' ? field('文件字段 JSON', h('textarea', { 'aria-label': '创建任务文件字段 JSON', rows: 5, value: fileFields, onChange: event => setFileFields(event.target.value), style: { ...control, fontFamily: 'monospace' } })) : null,
      key === 'create' && form.create.bodyType === 'multipart' ? h('p', { style: { color: colors.muted, fontSize: 12, margin: 0 } }, 'name 是服务接收文件的字段名；inputIndex 从 0 开始，all 表示将全部参考文件以同名字段发送。普通字段中的对象和数组会转为 JSON 字符串。') : null);
    const submit = async event => {
      event.preventDefault(); if (submitLock.current) return; submitLock.current = true; setSaving(true); setLocalError('');
      try {
        const url = new URL(form.baseUrl); if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('服务地址必须为 HTTP(S)，不能包含用户名或密码');
        if (!form.name.trim() || !form.kinds?.length) throw new Error('请填写名称并选择至少一种资产类型');
        const { create, poll, cancel } = form;
        const route = (spec, required) => { const { bodyTemplate, fileFields: previousFields, ...rest } = spec; return { ...rest, ...(required || bodyTemplate ? { bodyTemplate: assetJsonObject(typeof bodyTemplate === 'string' ? bodyTemplate : JSON.stringify(bodyTemplate || {}), '请求模板') } : {}), ...(required && spec.bodyType === 'multipart' ? { fileFields: assetFileFields(fileFields) } : {}) }; };
        await onSave({ ...(form.id ? { id: form.id } : {}), name: form.name.trim(), baseUrl: form.baseUrl.trim(), kinds: form.kinds, enabled: form.enabled, model: form.model || '', authMode: form.authMode, ...(form.authMode === 'header' ? { apiKeyHeader: form.apiKeyHeader } : {}), ...(form.apiKey.trim() ? { apiKey: form.apiKey.trim() } : {}), ...(form.clearApiKey ? { clearApiKey: true } : {}), adapter: { responseMode: form.responseMode || 'task', outputSelectors: assetJsonObject(outputSelectors, '输出字段选择器'), create: route(create, true), poll: route(poll, false), cancel: cancel?.path?.trim() ? route(cancel, false) : null, selectors: assetJsonObject(selectors, '响应字段选择器'), statusMap: assetJsonObject(statusMap, '状态映射') } });
      } catch (error) { setLocalError(assetError(error)); } finally { submitLock.current = false; setSaving(false); }
    };
    return h('form', { onSubmit: submit, style: { ...box, display: 'grid', gap: 14 }, 'data-testid': 'asset-provider-form' },
      h('h3', { style: { margin: 0 } }, initial?.id ? '编辑生成服务' : '添加生成服务'),
      field('服务名称', h('input', { autoFocus: true, 'aria-label': '服务名称', value: form.name, onChange: e => set('name', e.target.value), maxLength: 100, style: control })),
      field('服务地址', h('input', { 'aria-label': '服务地址', value: form.baseUrl, onChange: e => set('baseUrl', e.target.value), placeholder: 'http://localhost:8000', style: control })),
      field('鉴权方式', h('select', { 'aria-label': '生成服务鉴权方式', value: form.authMode, onChange: e => set('authMode', e.target.value), style: control }, [['none', '无需鉴权'], ['bearer', 'Bearer API Key'], ['header', '自定义请求头 API Key']].map(([value, label]) => h('option', { key: value, value }, label)))),
      form.authMode === 'header' ? field('密钥请求头名称', h('input', { 'aria-label': '密钥请求头名称', value: form.apiKeyHeader || '', onChange: e => set('apiKeyHeader', e.target.value), style: control })) : null,
      field(initial?.apiKeyConfigured ? 'API Key（留空保留已有密钥）' : 'API Key（无鉴权服务可留空）', h('input', { type: 'password', autoComplete: 'new-password', 'aria-label': '生成服务 API Key', value: form.apiKey, onChange: e => setForm(old => ({ ...old, apiKey: e.target.value, authMode: e.target.value && old.authMode === 'none' ? 'bearer' : old.authMode })), style: control })),
      initial?.apiKeyConfigured ? h('label', null, h('input', { type: 'checkbox', checked: !!form.clearApiKey, onChange: e => set('clearApiKey', e.target.checked) }), ' 清除已保存的密钥') : null,
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 16 } }, kinds.map(([kind, label]) => h('label', { key: kind }, h('input', { type: 'checkbox', checked: form.kinds.includes(kind), onChange: e => set('kinds', e.target.checked ? [...form.kinds, kind] : form.kinds.filter(value => value !== kind)) }), ' ', label))),
      h('label', null, h('input', { type: 'checkbox', checked: form.enabled !== false, onChange: event => set('enabled', event.target.checked) }), ' 启用此生成服务'),
      field('默认模型', h('input', { 'aria-label': '默认生成模型', value: form.model || '', onChange: e => set('model', e.target.value), style: control })),
      button(advanced ? '收起自定义接口配置' : '展开自定义接口配置', () => setAdvanced(!advanced), { 'aria-expanded': advanced }),
      advanced ? h('div', { style: { display: 'grid', gap: 12 } }, h('p', { style: { color: colors.muted, fontSize: 12 } }, '模板变量：{{prompt}}、{{model}}、{{kind}}、{{parameters}}。JSON 参考文件可用 {{inputs.0.base64}}、{{inputs.0.dataUrl}}、{{inputs.0.filename}} 或完整 {{inputs}} 数组。轮询与取消路径使用 {{taskId}}。完整变量占位会保留 JSON 数据类型。'),
        field('返回方式', h('select', { 'aria-label': '生成服务返回方式', value: form.responseMode || 'task', onChange: event => set('responseMode', event.target.value), style: control }, h('option', { value: 'task' }, '异步任务（创建后查询状态）'), h('option', { value: 'outputs' }, '同步输出（创建请求直接返回文件）'))),
        form.responseMode === 'outputs' ? h('p', { style: { color: colors.muted, fontSize: 12, margin: 0 } }, '同步输出无需任务 ID 或状态字段，也不发起轮询；只有收到并校验实际文件后才显示完成。请配置响应中的 outputs 数组路径及数组内每个输出的字段。') : null,
        endpoint('create', '创建任务'), form.responseMode !== 'outputs' ? endpoint('poll', '查询任务') : null, form.responseMode !== 'outputs' ? endpoint('cancel', '取消任务') : null,
        field('响应字段选择器 JSON', h('textarea', { 'aria-label': '响应字段选择器 JSON', rows: 6, value: selectors, onChange: e => setSelectors(e.target.value), style: { ...control, fontFamily: 'monospace' } })),
        field('输出字段选择器 JSON', h('textarea', { 'aria-label': '输出字段选择器 JSON', rows: 5, value: outputSelectors, onChange: e => setOutputSelectors(e.target.value), style: { ...control, fontFamily: 'monospace' } })),
        h('p', { style: { color: colors.muted, fontSize: 12, margin: 0 } }, '输出字段支持 url、base64、mime、filename；填写每个输出对象内的字段路径，例如 base64 对应 b64_json。路径支持点号或 JSON Pointer，空字符串表示不读取该字段；url 与 base64 至少保留一项。'),
        field('状态映射 JSON', h('textarea', { 'aria-label': '状态映射 JSON', rows: 6, value: statusMap, onChange: e => setStatusMap(e.target.value), style: { ...control, fontFamily: 'monospace' } }))) : null,
      localError ? h('p', { role: 'alert', style: { color: 'var(--gamecowork-color-status-danger-text)' } }, localError) : null,
      h('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } }, button('取消', onCancel, { disabled: busy || saving }), h('button', { type: 'submit', disabled: busy || saving, style: { ...control, width: 'auto', background: colors.accent } }, busy || saving ? '保存中…' : '保存生成服务')));
  }

  function AssetPanel({ headerExtra, headerLeftExtra, reserveLeftSpace, initialView = 'create' } = {}) {
    const messenger = runtime.useMessenger(), workspace = runtime.useWorkspace?.() || {}, workspaceKey = workspace.workspaceKey || '';
    const [view, setView] = R.useState(initialView), [providers, setProviders] = R.useState([]), [tasks, setTasks] = R.useState([]), [kind, setKind] = R.useState('image');
    const [providerId, setProviderId] = R.useState(''), [providerSelectionRequired, setProviderSelectionRequired] = R.useState(false), [prompt, setPrompt] = R.useState(''), [model, setModel] = R.useState(''), [parameters, setParameters] = R.useState('{}');
    const [referenceInputs, setReferenceInputs] = R.useState([]), inputUploads = R.useRef(new Map()), referenceCurrent = R.useRef(referenceInputs); referenceCurrent.current = referenceInputs;
    const [error, setError] = R.useState(''), [loadError, setLoadError] = R.useState(''), [notice, setNotice] = R.useState(''), [loading, setLoading] = R.useState(true), [busy, setBusy] = R.useState(''), [editor, setEditor] = R.useState(null);
    const [selected, setSelected] = R.useState(null), [discarded, setDiscarded] = R.useState(false), [queryText, setQueryText] = R.useState(''), [preview, setPreview] = R.useState(null), [saveDialog, setSaveDialog] = R.useState(null), [deleteProvider, setDeleteProvider] = R.useState(null);
    const [page, setPage] = R.useState(1), [total, setTotal] = R.useState(0), [historyKind, setHistoryKind] = R.useState('');
    const [canvasNodes, setCanvasNodes] = R.useState([]), [canvasLoaded, setCanvasLoaded] = R.useState(false), [canvasError, setCanvasError] = R.useState(''), [canvasDirty, setCanvasDirty] = R.useState(false), [zoom, setZoom] = R.useState(1), [resourceVersion, setResourceVersion] = R.useState(0);
    const alive = R.useRef(false), scope = R.useRef(workspaceKey), resources = R.useRef(new Map()), resourceRequests = R.useRef(new Map()), requestGeneration = R.useRef(0), canvasGeneration = R.useRef(0), lifetime = R.useRef(null);
    const canvasCurrent = R.useRef(canvasNodes), drag = R.useRef(null), actionLock = R.useRef(false); canvasCurrent.current = canvasNodes;
    scope.current = workspaceKey;
    if (!lifetime.current || lifetime.current.workspaceKey !== workspaceKey || lifetime.current.messenger !== messenger) lifetime.current = { workspaceKey, messenger };
    const ownerLifetime = lifetime.current, isCurrent = () => alive.current && lifetime.current === ownerLifetime;
    const send = async (operation, payload = {}) => assetResponse(await messenger.request(methods[operation], payload));
    const historyMode = view === 'history';
    const load = R.useCallback(async () => {
      if (!isCurrent()) return;
      const epoch = ++requestGeneration.current, owner = workspaceKey;
      try {
        const replies = await Promise.allSettled([send('providers'), send('tasks', assetTaskQuery({ workspaceKey: owner, view: historyMode ? 'history' : 'create', discarded, page, queryText, historyKind }))]);
        if (!isCurrent() || epoch !== requestGeneration.current) return;
        const [providerReply, taskReply] = replies;
        if (providerReply.status === 'fulfilled') setProviders(providerReply.value.providers || []);
        if (taskReply.status === 'fulfilled') {
          const taskResult = taskReply.value, count = taskResult.total ?? taskResult.tasks?.length ?? 0;
          setTasks(taskResult.tasks || []); setTotal(count);
          if (historyMode && page > Math.max(1, Math.ceil(count / 20))) setPage(Math.max(1, Math.ceil(count / 20)));
        }
        setLoadError(replies.filter(reply => reply.status === 'rejected').map(reply => assetError(reply.reason)).join('；')); setLoading(false);
      } catch (reason) { if (isCurrent() && epoch === requestGeneration.current) { setLoadError(assetError(reason)); setLoading(false); } }
    }, [messenger, ownerLifetime, workspaceKey, historyMode, discarded, page, queryText, historyKind]);
    R.useEffect(() => { alive.current = true; return () => { alive.current = false; requestGeneration.current++; canvasGeneration.current++; for (const controller of inputUploads.current.values()) controller.abort(); inputUploads.current.clear(); for (const entry of resources.current.values()) if (entry.url) URL.revokeObjectURL(entry.url); resources.current.clear(); resourceRequests.current.clear(); }; }, []);
    R.useEffect(() => { setLoading(true); void load(); }, [load]);
    R.useEffect(() => { setSelected(null); setPreview(null); setSaveDialog(null); setTasks([]); setTotal(0); setPage(1); setError(''); setLoadError(''); setNotice(''); setBusy(''); actionLock.current = null; resourceRequests.current.clear(); for (const controller of inputUploads.current.values()) controller.abort(); inputUploads.current.clear(); referenceCurrent.current = []; setReferenceInputs([]); }, [ownerLifetime]);
    R.useEffect(() => { setPage(1); }, [discarded, queryText, historyKind]);
    R.useEffect(() => {
      const open = !!(preview || saveDialog || deleteProvider); if (runtime.isNative?.() && window.parent !== window) window.parent.postMessage({ source: 'iframe', messageType: 'shell/modalStateChanged', data: { open } }, '*');
      const escape = event => { if (event.key === 'Escape' && !busy) { if (saveDialog) setSaveDialog(null); else if (deleteProvider) setDeleteProvider(null); else if (preview) { setPreview(null); setSelected(null); } } };
      if (open) window.addEventListener('keydown', escape);
      return () => { window.removeEventListener('keydown', escape); if (open && runtime.isNative?.() && window.parent !== window) window.parent.postMessage({ source: 'iframe', messageType: 'shell/modalStateChanged', data: { open: false } }, '*'); };
    }, [preview, saveDialog, deleteProvider, busy]);
    const loadCanvas = R.useCallback(async () => {
      if (!isCurrent()) return;
      const epoch = ++canvasGeneration.current; setCanvasError('');
      try { const result = await send('getCanvas', workspaceKey ? { workspaceKey } : {}); if (isCurrent() && epoch === canvasGeneration.current) { setCanvasNodes(result.canvas?.nodes || []); setCanvasLoaded(true); } }
      catch (reason) { if (isCurrent() && epoch === canvasGeneration.current) { setCanvasError(assetError(reason)); setCanvasLoaded(false); } }
    }, [messenger, ownerLifetime, workspaceKey]);
    R.useEffect(() => { setCanvasLoaded(false); setCanvasNodes([]); setCanvasDirty(false); void loadCanvas(); return () => { canvasGeneration.current++; }; }, [loadCanvas]);
    const hasActiveTasks = tasks.some(task => !assetTerminalStatuses.has(task.status));
    R.useEffect(() => { if (!hasActiveTasks) return; let stopped = false, timer; const poll = async () => { await load(); if (!stopped) timer = setTimeout(poll, 2500); }; timer = setTimeout(poll, 2500); return () => { stopped = true; clearTimeout(timer); }; }, [hasActiveTasks, load]);
    const availableProviders = providers.filter(value => value.enabled !== false && value.kinds?.includes(kind));
    R.useEffect(() => {
      if (availableProviders.some(value => value.id === providerId)) return;
      if (providerId) { setProviderId(''); setProviderSelectionRequired(true); setNotice('原生成服务已移除或停用，请选择可用服务后生成。'); }
      else if (!providerSelectionRequired) { const first = availableProviders[0]; setProviderId(first?.id || ''); setModel(first?.model || ''); }
    }, [providers, kind, providerId, providerSelectionRequired]);
    async function action(key, callback) { if (actionLock.current || !isCurrent()) return; const token = {}; actionLock.current = token; setBusy(key); setError(''); setNotice(''); try { await callback(); } catch (reason) { if (isCurrent()) setError(assetError(reason)); } finally { if (actionLock.current === token) { actionLock.current = null; if (isCurrent()) setBusy(''); } } }
    function updateReferences(update) { const next = update(referenceCurrent.current); referenceCurrent.current = next; setReferenceInputs(next); }
    function removeReference(key) { inputUploads.current.get(key)?.abort(); inputUploads.current.delete(key); updateReferences(old => old.filter(input => input.key !== key)); }
    async function selectReferences(event) {
      const files = Array.from(event.target.files || []); event.target.value = ''; if (!files.length || !isCurrent() || actionLock.current) return;
      setError('');
      try { assetValidateInputFiles(files, referenceCurrent.current); } catch (reason) { setError(assetError(reason)); return; }
      const pending = files.map(file => ({ key: crypto.randomUUID(), filename: file.name, byteLength: file.size, status: 'uploading' }));
      updateReferences(old => [...old, ...pending]);
      await Promise.all(pending.map(async (entry, index) => {
        const controller = new AbortController(); inputUploads.current.set(entry.key, controller);
        try {
          const input = await assetUploadInput(files[index], { workspaceKey, signal: controller.signal, fetcher: runtime.fetch || globalThis.fetch });
          if (isCurrent() && !controller.signal.aborted) updateReferences(old => old.map(value => value.key === entry.key ? { ...input, key: entry.key, status: 'ready' } : value));
        } catch (reason) {
          if (isCurrent() && !controller.signal.aborted) updateReferences(old => old.map(value => value.key === entry.key ? { ...value, status: 'failed', error: assetError(reason) } : value));
        } finally { if (inputUploads.current.get(entry.key) === controller) inputUploads.current.delete(entry.key); }
      }));
    }
    async function create(event) {
      event.preventDefault(); const owner = workspaceKey;
      await action('create', async () => { if (!availableProviders.some(value => value.id === providerId) || !prompt.trim()) throw new Error('请选择可用的生成服务并填写提示词');
        const inputs = referenceCurrent.current.slice(); if (inputs.some(input => input.status !== 'ready')) throw new Error('请等待参考文件准备完成，或移除失败的文件后重试');
        const result = await send('create', { providerId, kind, prompt: prompt.trim(), model: model.trim(), parameters: assetJsonObject(parameters, '生成参数'), inputIds: inputs.map(input => input.id), ...(owner ? { workspaceKey: owner } : {}), idempotencyKey: crypto.randomUUID() });
        if (isCurrent()) { setNotice('任务已创建，状态和输出将在这里更新。'); if (result.task) setTasks(old => [result.task, ...old.filter(task => task.id !== result.task.id)]); await load(); }
      });
    }
    async function getArtifact(task, artifact) {
      const key = assetReferenceId(task, artifact), cached = resources.current.get(key);
      if (cached) return cached;
      if (resourceRequests.current.has(key)) return resourceRequests.current.get(key);
      const request = (async () => {
        const data = await send('resource', { taskId: task.id, artifactId: artifact.id });
        if (!isCurrent()) return;
        if (typeof data.base64 !== 'string' || !data.mime) throw new Error('服务未返回可预览的实际文件字节');
        const bytes = Uint8Array.from(atob(data.base64), character => character.charCodeAt(0));
        const entry = { url: URL.createObjectURL(new Blob([bytes], { type: data.mime })), mime: data.mime, filename: data.filename || artifact.filename, artifact, task };
        resources.current.set(key, entry); setResourceVersion(old => old + 1); return entry;
      })();
      resourceRequests.current.set(key, request);
      try { return await request; } finally { if (resourceRequests.current.get(key) === request) resourceRequests.current.delete(key); }
    }
    async function openArtifact(task, artifact) {
      const entry = await getArtifact(task, artifact); if (!entry || !isCurrent()) return;
      setSelected(task); setPreview(entry);
    }
    async function saveArtifact(task, artifact) {
      if (!workspaceKey) throw new Error('请先打开要保存资产的工作区');
      const filename = artifact.filename || `${task.id}.${artifactKind(artifact) === 'model' ? 'glb' : artifactKind(artifact) === 'video' ? 'mp4' : 'png'}`;
      setSaveDialog({ task, artifact, workspaceKey, ownerLifetime, relativePath: filename });
    }
    const regenerate = async task => {
      const result = await send('get', { taskId: task.id }); if (!isCurrent()) return;
      const original = result.task; if (!original || !kinds.some(([kind]) => kind === original.kind) || !original.providerId) throw new Error('原生成任务缺少可复用参数，请重新填写');
      const references = (original.inputs || []).map(input => ({ ...assetInputMetadata(input, workspaceKey), key: crypto.randomUUID(), status: 'ready' }));
      if (original.inputIds?.length && references.length !== original.inputIds.length) throw new Error('原生成任务缺少参考文件信息，请重新选择');
      for (const controller of inputUploads.current.values()) controller.abort(); inputUploads.current.clear(); updateReferences(() => references);
      const available = providers.find(value => value.id === original.providerId && value.enabled !== false && value.kinds?.includes(original.kind));
      setKind(original.kind); setProviderId(available?.id || ''); setProviderSelectionRequired(!available); setPrompt(original.prompt || ''); setModel(original.model || ''); setParameters(JSON.stringify(original.parameters || {}, null, 2)); setView('create');
      if (!available) setNotice('原生成服务已移除或停用，已恢复提示词和参数，请选择可用服务后生成。');
    };
    async function addCanvas(task, artifact) {
      if (!canvasLoaded) throw new Error('请先成功读取 Canvas，再添加素材');
      const entry = await getArtifact(task, artifact); if (!entry || !isCurrent()) return;
      setCanvasNodes(old => [...old, { id: crypto.randomUUID(), taskId: task.id, artifactId: artifact.id, filename: artifact.filename, mime: artifact.mime, kind: artifactKind(artifact), title: task.prompt || artifact.filename, x: 24 + old.length % 4 * 240, y: 24 + Math.floor(old.length / 4) * 210, width: 220, height: 180 }]); setCanvasDirty(true); setView('canvas');
    }
    function moveNode(id, values) { setCanvasNodes(old => old.map(node => node.id === id ? { ...node, ...values } : node)); setCanvasDirty(true); }
    R.useEffect(() => { let stopped = false; for (const node of canvasNodes) { const key = `${node.taskId}:${node.artifactId}`; if (!resources.current.has(key)) getArtifact({ id: node.taskId }, { id: node.artifactId, kind: node.kind, mime: node.mime, filename: node.filename }).catch(reason => { if (!stopped && isCurrent()) setError(assetError(reason)); }); } return () => { stopped = true; }; }, [canvasLoaded, ownerLifetime]);
    async function saveBoard() {
      const owner = workspaceKey, snapshot = canvasCurrent.current, signature = JSON.stringify(snapshot);
      await send('saveCanvas', { canvas: { nodes: snapshot, edges: [] }, ...(owner ? { workspaceKey: owner } : {}) });
      if (isCurrent()) { const unchanged = JSON.stringify(canvasCurrent.current) === signature; if (unchanged) setCanvasDirty(false); setNotice(unchanged ? 'Canvas 已保存，重新打开可继续使用。' : '刚才的 Canvas 版本已保存，当前新修改尚未保存。'); }
    }
    const canvas = h('section', { style: { display: 'grid', gap: 12 }, 'data-testid': 'asset-canvas' },
      h('header', { style: { display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' } }, h('h2', { style: { margin: 0, fontSize: 17 } }, '本地资产 Canvas'), h('span', { role: 'status', style: { color: colors.muted } }, canvasDirty ? '尚未保存' : canvasLoaded ? '已读取保存内容' : '正在读取…'),
        field('画布缩放', h('select', { value: zoom, onChange: event => setZoom(Number(event.target.value)), style: control }, [.5, .75, 1, 1.25, 1.5].map(value => h('option', { key: value, value }, `${Math.round(value * 100)}%`)))), button('保存 Canvas', () => void action('canvas-save', saveBoard), { disabled: !!busy || !canvasLoaded })),
      canvasError ? h('p', { role: 'alert', style: { color: 'var(--gamecowork-color-status-danger-text)', margin: 0 } }, 'Canvas 读取失败：', canvasError, ' ', button('重试读取 Canvas', () => void loadCanvas())) : null,
      h('p', { style: { margin: 0, color: colors.muted, fontSize: 12 } }, '从下方任务添加实际输出。拖动卡片标题移动素材，键盘方向键也可移动。布局保存到当前范围，素材引用保留原任务身份。'),
      h('div', { style: { ...box, padding: 0, height: 540, overflow: 'auto' } }, h('div', { role: 'region', 'aria-label': '资产 Canvas 画布', style: { position: 'relative', width: 1400 * zoom, height: 900 * zoom, backgroundImage: `radial-gradient(${colors.border} 1px, transparent 1px)`, backgroundSize: `${20 * zoom}px ${20 * zoom}px` } },
        canvasNodes.map(node => { const entry = resources.current.get(`${node.taskId}:${node.artifactId}`), task = tasks.find(value => value.id === node.taskId) || { id: node.taskId, prompt: node.title }, artifact = { id: node.artifactId, filename: node.filename, mime: node.mime, kind: node.kind };
          return h('article', { key: node.id, tabIndex: 0, 'aria-label': `Canvas 素材 ${node.filename || node.title}`, 'data-testid': `canvas-node-${node.id}`, onKeyDown: event => { const offsets = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }; if (offsets[event.key] && event.target === event.currentTarget) { event.preventDefault(); moveNode(node.id, { x: Math.max(0, node.x + offsets[event.key][0]), y: Math.max(0, node.y + offsets[event.key][1]) }); } }, style: { ...box, padding: 0, position: 'absolute', left: node.x * zoom, top: node.y * zoom, width: node.width * zoom, height: node.height * zoom, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.15)' } },
            h('header', { onPointerDown: event => { if (event.target.tagName === 'BUTTON') return; event.currentTarget.setPointerCapture(event.pointerId); drag.current = { id: node.id, x: node.x, y: node.y, clientX: event.clientX, clientY: event.clientY }; }, onPointerMove: event => { if (drag.current?.id === node.id) moveNode(node.id, { x: Math.max(0, drag.current.x + (event.clientX - drag.current.clientX) / zoom), y: Math.max(0, drag.current.y + (event.clientY - drag.current.clientY) / zoom) }); }, onPointerUp: () => { drag.current = null; }, onPointerCancel: () => { drag.current = null; }, style: { cursor: 'grab', touchAction: 'none', fontSize: 12, padding: 7, display: 'flex', justifyContent: 'space-between', gap: 4, borderBottom: `1px solid ${colors.border}` } }, h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, node.filename || node.title), button('×', () => { setCanvasNodes(old => old.filter(value => value.id !== node.id)); setCanvasDirty(true); }, { 'aria-label': `从 Canvas 移除 ${node.filename || node.title}`, style: { padding: '0 4px', border: 'none' } })),
            h('div', { style: { flex: 1, minHeight: 0, display: 'grid', placeItems: 'center', overflow: 'hidden' } }, entry && node.kind === 'image' ? h('img', { src: entry.url, alt: node.filename, draggable: false, style: { width: '100%', height: '100%', objectFit: 'contain' } }) : entry && node.kind === 'video' ? h('video', { src: entry.url, controls: true, style: { width: '100%', height: '100%' } }) : h('span', { style: { color: colors.muted } }, node.kind === 'model' ? '3D 模型' : entry ? '文件' : '正在读取实际素材…')),
            h('footer', { style: { display: 'flex', gap: 4, padding: 5 } }, button('预览', () => void action('preview', () => openArtifact(task, artifact)), { disabled: !!busy, style: { padding: '3px 5px', fontSize: 11 } }), button('保存文件', () => void action('save', () => saveArtifact(task, artifact)), { disabled: !!busy, style: { padding: '3px 5px', fontSize: 11 } }), button('再生成', () => void action('regenerate', () => regenerate(task)), { disabled: !!busy, style: { padding: '3px 5px', fontSize: 11 } })));
        }), !canvasNodes.length ? h('div', { style: { position: 'absolute', inset: '150px 100px auto', textAlign: 'center', color: colors.muted } }, '画布中还没有素材。从完成的任务添加输出后即可编排。') : null)),
      h('section', { style: { display: 'grid', gap: 8 } }, h('h3', { style: { margin: 0, fontSize: 14 } }, '可添加的生成输出'), tasks.filter(task => task.status === 'completed').map(task => h('div', { key: task.id, style: { ...box, padding: 10, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' } }, h('span', { style: { color: colors.muted } }, task.prompt), (task.artifacts || []).map(artifact => button(`添加 ${artifact.filename || '输出'} 到 Canvas`, () => void action('canvas-add', () => addCanvas(task, artifact)), { key: artifact.id, disabled: !!busy }))))));
    const filtered = tasks;
    const taskCard = task => h('article', { key: task.id, style: { ...box, display: 'grid', gap: 8 }, 'data-testid': `asset-task-${task.id}` },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', gap: 10 } }, h('strong', null, task.prompt || task.name || task.id), h('span', { role: 'status' }, statusNames[task.status] || task.status)),
      h('div', { style: { color: colors.muted, fontSize: 12 } }, `${kinds.find(([value]) => value === task.kind)?.[1] || task.kind} · ${task.model || '默认模型'} · ${task.createdTime || ''}`),
      task.inputs?.length ? h('div', { style: { color: colors.muted, fontSize: 12 } }, '参考文件：', task.inputs.map(input => input.filename).join('、')) : null,
      !assetTerminalStatuses.has(task.status) ? h('progress', { max: 100, value: Number(task.progress) || 0, style: { width: '100%' } }) : null,
      task.error ? h('p', { role: 'alert', style: { color: 'var(--gamecowork-color-status-danger-text)', margin: 0 } }, assetError(task.error)) : null,
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } },
        (task.artifacts || []).map(artifact => h('span', { key: artifact.id, style: { display: 'inline-flex', gap: 4 } }, button(`预览 ${artifact.filename || '输出'}`, () => void action('preview', () => openArtifact(task, artifact)), { disabled: !!busy }), button('保存', () => void action('save', () => saveArtifact(task, artifact)), { disabled: !!busy }))),
        !assetTerminalStatuses.has(task.status) ? button(task.status === 'cancel_requested' ? '已请求取消' : '取消生成', () => void action('cancel', async () => { const result = await send('cancel', { taskId: task.id }); if (!isCurrent()) return; if (result.mayContinue) setNotice('服务尚未确认取消，远端任务可能仍在执行。请继续查看实际状态。'); else if (result.remoteCancellationConfirmed) setNotice('服务已确认取消。'); await load(); }), { disabled: !!busy || task.status === 'cancel_requested' }) : button('使用相同参数再生成', () => void action('regenerate', () => regenerate(task)), { disabled: !!busy }),
        button(task.discarded ? '恢复历史记录' : '丢弃历史记录', () => void action('discard', async () => { await send('discard', { taskIds: [task.id], discarded: !task.discarded }); await load(); }), { disabled: !!busy })));
    const creator = h('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(280px, 380px) minmax(0, 1fr)', gap: 18, alignItems: 'start' } },
      h('form', { onSubmit: create, style: { ...box, display: 'grid', gap: 14 }, 'data-testid': 'asset-create-form' },
        h('div', { role: 'tablist', style: { display: 'flex', gap: 6 } }, kinds.map(([value, label]) => button(label, () => { if (kind !== value) { setKind(value); setProviderId(''); setModel(''); setProviderSelectionRequired(false); } }, { key: value, role: 'tab', 'aria-selected': kind === value, style: { background: kind === value ? colors.accent : colors.background } }))),
        field('生成服务', h('select', { 'aria-label': '生成服务', value: providerId, onChange: e => { const next = providers.find(value => value.id === e.target.value); setProviderId(e.target.value); setProviderSelectionRequired(!e.target.value); setModel(next?.model || ''); }, style: control }, h('option', { value: '' }, '选择已配置服务'), availableProviders.map(value => h('option', { value: value.id, key: value.id }, value.name)))),
        !loading && !availableProviders.length ? h('div', { role: 'status' }, '尚未配置此类型的服务。', button('添加生成服务', () => { setView('settings'); setEditor({}); })) : null,
        field('模型', h('input', { 'aria-label': '生成模型', value: model, onChange: e => setModel(e.target.value), style: control })),
        field('提示词', h('textarea', { 'aria-label': '生成提示词', rows: 6, value: prompt, onChange: e => setPrompt(e.target.value), maxLength: 10000, style: control })),
        h('section', { 'aria-label': '生成参考文件', style: { display: 'grid', gap: 8 } },
          field('参考文件（可选）', h('input', { type: 'file', multiple: true, accept: '.png,.jpg,.jpeg,.webp,.mp4,.webm,.glb', 'aria-label': '选择生成参考文件', onChange: event => void selectReferences(event), disabled: !!busy || referenceInputs.length >= 8, style: { ...control, fontSize: 12 } })),
          h('p', { style: { margin: 0, color: colors.muted, fontSize: 12 } }, '选择后仅保存到本机；点击生成时发送给所选服务。最多 8 个文件，总大小 64 MiB。接口模板必须包含这些参考文件。'),
          referenceInputs.map((input, index) => h('div', { key: input.key, 'data-testid': 'asset-reference-' + (input.id || input.key), style: { ...box, padding: 8, display: 'grid', gap: 5 } },
            h('div', { style: { overflowWrap: 'anywhere', fontSize: 12 } }, `${index + 1}. ${input.filename} · ${(input.byteLength / 1024 / 1024).toFixed(2)} MiB`),
            h('span', { role: input.status === 'failed' ? 'alert' : 'status', style: { color: input.status === 'failed' ? 'var(--gamecowork-color-status-danger-text)' : colors.muted, fontSize: 12 } }, input.status === 'ready' ? '已准备到本机' : input.status === 'failed' ? `准备失败：${input.error}` : '正在保存到本机…'),
            button('移除参考文件', () => removeReference(input.key), { 'aria-label': `移除参考文件 ${input.filename}`, disabled: !!busy, style: { justifySelf: 'start', fontSize: 12, padding: '3px 6px' } })))),
        field('生成参数 JSON', h('textarea', { 'aria-label': '生成参数 JSON', rows: 5, value: parameters, onChange: e => setParameters(e.target.value), style: { ...control, fontFamily: 'monospace' } })),
        h('button', { type: 'submit', disabled: !!busy || !providerId || !prompt.trim() || referenceInputs.some(input => input.status !== 'ready'), style: { ...control, background: colors.accent } }, busy === 'create' ? '正在创建任务…' : `生成${kinds.find(([value]) => value === kind)?.[1] || ''}`)),
      h('section', { style: { display: 'grid', gap: 12 } }, h('h3', { style: { margin: 0 } }, '生成任务'), filtered.length ? filtered.map(taskCard) : h('p', { style: { color: colors.muted } }, loading ? '正在读取任务…' : '创建任务后，实际进度与输出会显示在这里。')));
    const settings = h('section', { style: { display: 'grid', gap: 14, maxWidth: 840 } }, button('添加生成服务', () => setEditor({})),
      editor ? h(ProviderForm, { key: editor.id || 'new', initial: editor, busy: busy === 'provider-save', onCancel: () => setEditor(null), onSave: async value => { await send('saveProvider', { provider: value }); if (!isCurrent()) return; setEditor(null); await load(); if (isCurrent()) setNotice('生成服务已保存。'); } }) : providers.map(value => h('article', { key: value.id, style: box }, h('strong', null, value.name), h('p', { style: { color: colors.muted, margin: '8px 0' } }, `${value.baseUrl} · ${(value.kinds || []).map(kind => kinds.find(([id]) => id === kind)?.[1] || kind).join(' / ')} · ${value.enabled === false ? '已停用' : '已启用'} · ${value.authMode === 'none' ? '无需鉴权' : value.apiKeyConfigured ? '已配置密钥' : '未配置密钥'}`),
        h('div', { style: { display: 'flex', gap: 6 } }, button('编辑', () => setEditor(value)), button('删除生成服务', () => setDeleteProvider(value), { disabled: !!busy })))));
    const history = h('section', { style: { display: 'grid', gap: 12 } }, h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12 } }, h('input', { 'aria-label': '搜索生成历史', placeholder: '搜索提示词或模型', value: queryText, onChange: e => setQueryText(e.target.value), style: { ...control, flex: 1 } }),
      h('select', { 'aria-label': '历史资产类型', value: historyKind, onChange: event => setHistoryKind(event.target.value), style: { ...control, width: 'auto' } }, h('option', { value: '' }, '全部类型'), kinds.map(([value, label]) => h('option', { key: value, value }, label))),
      h('label', null, h('input', { type: 'checkbox', checked: discarded, onChange: e => setDiscarded(e.target.checked) }), ' 已丢弃的历史记录'), button('刷新', () => void load())), filtered.length ? filtered.map(taskCard) : h('p', { style: { color: colors.muted } }, loading ? '正在读取历史…' : '没有匹配的生成记录。'),
      h('footer', { style: { display: 'flex', gap: 10, alignItems: 'center' } }, button('上一页', () => setPage(old => Math.max(1, old - 1)), { disabled: loading || page === 1 }), h('span', null, `第 ${page} 页 · 共 ${total} 条`), button('下一页', () => setPage(old => old + 1), { disabled: loading || page * 20 >= total })));
    const previewBody = preview ? artifactKind(preview.artifact) === 'image' ? h('img', { src: preview.url, alt: preview.filename, style: { maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain' } }) : artifactKind(preview.artifact) === 'video' ? h('video', { controls: true, src: preview.url, style: { maxWidth: '100%', maxHeight: '65vh' }, 'data-testid': 'asset-video-preview' }) : artifactKind(preview.artifact) === 'model' && runtime.ModelViewer ? h(R.Suspense, { fallback: h('p', null, '正在加载模型预览…') }, h(runtime.ModelViewer, { url: preview.url, format: /\.fbx$/i.test(preview.filename) ? 'FBX' : 'GLB' })) : h('p', null, '此文件没有可用预览，可保存实际输出文件。') : null;
    return h('section', { style: { boxSizing: 'border-box', width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 16, padding: 22, paddingTop: runtime.isNative?.() ? 'calc(var(--gamecowork-app-header-height, 36px) + 20px)' : 22, background: colors.background, color: colors.text, overflow: 'hidden' }, 'data-testid': 'gamecowork-assets' },
      h('header', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingLeft: reserveLeftSpace ? 8 : undefined } }, headerLeftExtra, h('h1', { style: { fontSize: 20, margin: 0 } }, 'AI 资产生成'), h('nav', { style: { display: 'flex', gap: 6 }, 'aria-label': 'AI 资产功能' }, [['create', '快速生成'], ['canvas', 'Canvas'], ['history', '生成历史'], ['settings', '生成服务']].map(([value, label]) => button(label, () => setView(value), { key: value, 'aria-current': view === value ? 'page' : undefined }))), headerExtra),
      workspace.workspaceDir ? h('div', { style: { color: colors.muted, fontSize: 12 } }, `当前工作区：${workspace.workspaceDir}`) : null,
      loadError ? h('div', { role: 'alert', style: { ...box, color: 'var(--gamecowork-color-status-danger-text)' } }, loadError, ' ', button('重试读取', () => void load())) : null,
      error ? h('div', { role: 'alert', style: { ...box, color: 'var(--gamecowork-color-status-danger-text)' } }, error, ' ', button('关闭错误提示', () => setError(''))) : null,
      notice ? h('div', { role: 'status', style: { ...box, padding: 10 } }, notice) : null,
      h('main', { style: { minHeight: 0, overflow: 'auto', flex: 1 } }, view === 'settings' ? settings : view === 'history' ? history : view === 'canvas' ? canvas : creator),
      preview && selected ? h('div', { role: 'dialog', 'aria-label': '生成资产预览', 'aria-modal': true, style: { position: 'fixed', inset: 0, zIndex: 1200, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.65)', padding: 24 } }, h('section', { style: { ...box, maxWidth: 1000, width: 'min(90vw,1000px)', minHeight: 200 } }, h('header', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } }, h('strong', null, preview.filename), button('关闭预览', () => { setPreview(null); setSelected(null); })), h('div', { style: { minHeight: artifactKind(preview.artifact) === 'model' ? 420 : undefined, height: artifactKind(preview.artifact) === 'model' ? 420 : undefined, display: 'grid', placeItems: 'center' } }, previewBody), button('保存到当前工作区', () => void action('save', () => saveArtifact(selected, preview.artifact)), { disabled: !!busy }), button('添加到 Canvas', () => void action('canvas-add', async () => { await addCanvas(selected, preview.artifact); setPreview(null); setSelected(null); }), { disabled: !!busy }))) : null,
      saveDialog ? h('div', { role: 'dialog', 'aria-label': '保存生成资产', 'aria-modal': true, style: { position: 'fixed', inset: 0, zIndex: 1310, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.65)', padding: 24 } }, h('form', { onSubmit: event => { event.preventDefault(); void action('save-file', async () => { if (scope.current !== saveDialog.workspaceKey || lifetime.current !== saveDialog.ownerLifetime) throw new Error('工作区已切换，请重新选择保存目标'); const result = await send('save', { taskId: saveDialog.task.id, artifactId: saveDialog.artifact.id, workspaceKey: saveDialog.workspaceKey, relativePath: saveDialog.relativePath.trim(), overwrite: false }); if (!result.path || !result.sha256 || !Number.isFinite(result.byteLength)) throw new Error('保存回执缺少实际文件信息'); if (isCurrent() && lifetime.current === saveDialog.ownerLifetime) { setSaveDialog(null); setNotice(`已保存：${result.path}（${result.byteLength} 字节）`); } }); }, style: { ...box, minWidth: 320, maxWidth: 600, display: 'grid', gap: 12 } }, h('h3', { style: { margin: 0 } }, '保存生成资产'), field('当前工作区相对路径', h('input', { autoFocus: true, 'aria-label': '资产保存相对路径', value: saveDialog.relativePath, onChange: event => setSaveDialog(old => ({ ...old, relativePath: event.target.value })), style: control })), h('p', { style: { color: colors.muted, margin: 0, fontSize: 12 } }, '保存不会覆盖已存在文件，可修改名称后另存。'), h('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: 8 } }, button('取消保存', () => setSaveDialog(null), { disabled: !!busy }), h('button', { type: 'submit', disabled: !!busy || !saveDialog.relativePath.trim(), style: { ...control, width: 'auto', background: colors.accent } }, busy === 'save-file' ? '保存中…' : '确认保存')))) : null,
      deleteProvider ? h('div', { role: 'dialog', 'aria-label': '删除生成服务', 'aria-modal': true, style: { position: 'fixed', inset: 0, zIndex: 1310, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.65)', padding: 24 } }, h('section', { style: { ...box, maxWidth: 480, display: 'grid', gap: 12 } }, h('h3', { style: { margin: 0 } }, `删除生成服务“${deleteProvider.name}”？`), h('p', { style: { color: colors.muted, margin: 0 } }, '服务配置删除后仍保留已有任务和生成历史。'), h('div', { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } }, button('取消删除', () => setDeleteProvider(null), { disabled: !!busy }), button('确认删除服务', () => void action('provider-delete', async () => { await send('deleteProvider', { providerId: deleteProvider.id }); setDeleteProvider(null); await load(); }), { disabled: !!busy })))) : null);
  }
  function CanvasPanel(props) { return h(AssetPanel, { ...props, initialView: 'canvas' }); }
  return { AssetPanel, CanvasPanel };
}
