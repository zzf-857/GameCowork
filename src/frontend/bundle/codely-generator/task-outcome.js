// Presentation of an explicitly uncertain local create result. The original
// terminal/poll statuses stay unchanged; error text never grants a retry.
const unknownCode = 'local_submission_unknown';

export function gamecoworkSubmissionUnknown(value) {
  const task = value?.status !== undefined ? value : value?.data;
  return task?.status === 'failed' && task.errorCode === unknownCode &&
    (task.submissionUnknown === true || task.local?.submissionUnknown === true);
}

export function gamecoworkTaskOutcomeLabel(task, originalLabel, language = 'zh') {
  if (!gamecoworkSubmissionUnknown(task)) return originalLabel;
  return String(language).startsWith('en') ? 'Result unknown' : '结果未知';
}

export function gamecoworkUnknownRetryHint(language = 'zh') {
  return String(language).startsWith('en')
    ? 'Result unknown. Check the provider records first; this action will not submit the task again.'
    : '结果未知，请先核对服务端记录；此处不会重新提交任务。';
}

export function gamecoworkHistoryDefaultStatus(user) {
  // Only the existing owned identity boundary creates these account modes.
  // The original remote client and completed-only asset pickers stay intact.
  return user?.accountMode === 'local' || user?.accountMode === 'codely-official'
    ? undefined : 'completed';
}

const operations = new Set(['create', 'poll', 'download', 'cancel']);
const stages = new Set(['awaiting-response', 'reading-response', 'http-response', 'decoding-response']);
const codes = new Set(['UND_ERR_HEADERS_TIMEOUT', 'UND_ERR_BODY_TIMEOUT', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_SOCKET', 'ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN', 'ENETUNREACH', 'EHOSTUNREACH', 'CERT_HAS_EXPIRED', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'ERR_TLS_CERT_ALTNAME_INVALID', 'PROVIDER_REQUEST_DEADLINE', 'REQUEST_ABORTED', 'PROVIDER_RESPONSE_LIMIT', 'TRANSPORT_ERROR', 'HTTP_ERROR', 'INVALID_JSON']);
const safeText = (value, maximum) => typeof value === 'string' && value.length <= maximum &&
  !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]|(?:https?|file|data):|Bearer\s|(?:authorization|api[_-]?key|access[_-]?token|refresh[_-]?token|cookie)\s*[:=]/i.test(value) ? value : null;
const identifier = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(value) ? value : null;
const integer = (value, maximum) => Number.isSafeInteger(value) && value >= 0 && value <= maximum ? value : null;
const timestamp = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T[0-9:.]+(?:Z|[+-]\d{2}:\d{2})$/.test(value) && value.length <= 40 && Number.isFinite(Date.parse(value)) ? value : null;

export function gamecoworkTaskErrorDetails(value) {
  const task = value?.errorDetails !== undefined ? value : value?.data;
  const raw = task?.errorDetails;
  if (!raw || raw.version !== 1 || typeof raw.diagnosticRecorded !== 'boolean' || typeof raw.submissionUnknown !== 'boolean') return null;
  const recorded = raw.diagnosticRecorded;
  const model = safeText(raw.model, 256), size = safeText(raw.requestedSize, 40);
  return {
    version: 1,
    summary: safeText(raw.summary, 500) || '请求未完成，请查看错误详情。',
    taskId: identifier(raw.taskId) || identifier(task.serverTaskId),
    model: model && !/[\r\n?=&@\\]/.test(model) ? model : null,
    requestedSize: size && /^(?:auto|[1-9]\d{0,4}x[1-9]\d{0,4})$/.test(size) ? size : null,
    submissionUnknown: raw.submissionUnknown,
    diagnosticRecorded: recorded,
    operation: recorded && operations.has(raw.operation) ? raw.operation : null,
    stage: recorded && stages.has(raw.stage) ? raw.stage : null,
    code: recorded && codes.has(raw.code) ? raw.code : null,
    // Core can safely recover a status from an old stored HTTP error prefix,
    // even when that record has no structured transport timing/cause metadata.
    httpStatus: Number.isInteger(raw.httpStatus) && raw.httpStatus >= 100 && raw.httpStatus <= 599 ? raw.httpStatus : null,
    elapsedMs: recorded ? integer(raw.elapsedMs, 2147483647) : null,
    timeoutMs: recorded ? integer(raw.timeoutMs, 600000) : null,
    createdTime: timestamp(raw.createdTime),
    updatedTime: timestamp(raw.updatedTime),
    serviceMessage: safeText(raw.serviceMessage, 2000),
    detailUnavailable: ['not-recorded', 'redacted', 'unparseable'].includes(raw.detailUnavailable) ? raw.detailUnavailable : null,
  };
}

const errorFields = [
  ['summary', '原因摘要'], ['taskId', '本地任务 ID'], ['model', '请求模型'], ['requestedSize', '任务尺寸参数'],
  ['submissionUnknown', '生成结果未知'], ['diagnosticRecorded', '传输诊断已记录'],
  ['operation', '请求操作'], ['stage', '发生阶段'], ['code', '错误代码'], ['httpStatus', 'HTTP 状态'],
  ['elapsedMs', '实际请求耗时'], ['timeoutMs', '配置请求时限'],
  ['createdTime', '任务创建时间'], ['updatedTime', '任务更新时间'], ['serviceMessage', '服务 / 本机错误说明'],
  ['detailUnavailable', '记录说明'],
];
const operationLabels = {create:'提交生成', poll:'查询任务状态', download:'下载生成文件', cancel:'提交取消请求'};
const stageLabels = {'awaiting-response':'等待服务响应', 'reading-response':'读取响应体', 'http-response':'收到 HTTP 响应', 'decoding-response':'解析服务响应'};
const recordNotes = {
  'not-recorded':'未保存详细说明（not-recorded）',
  redacted:'详细说明含敏感内容，已隐藏（redacted）',
  unparseable:'服务返回内容无法安全解析为错误说明（unparseable）',
};
function errorValue(key, value, details) {
  if (key === 'detailUnavailable') return Object.hasOwn(recordNotes, value) ? recordNotes[value] : '无额外说明';
  if (key === 'httpStatus' && value === null && details?.diagnosticRecorded === true && details.stage === 'awaiting-response') return '未收到 HTTP 状态码';
  if (value === null || value === undefined) return '未记录';
  if (key === 'operation' && Object.hasOwn(operationLabels, value)) return `${operationLabels[value]}（${value}）`;
  if (key === 'stage' && Object.hasOwn(stageLabels, value)) return `${stageLabels[value]}（${value}）`;
  return typeof value === 'boolean' ? value ? '是' : '否' : ['elapsedMs', 'timeoutMs'].includes(key) ? `${value} ms` : String(value);
}
const errorNotes = details => [
  ...(details.submissionUnknown ? ['服务端可能已经接单。请先核对服务记录；此任务不会自动重发。'] : []),
  ...(!details.diagnosticRecorded ? ['该历史记录未保存传输诊断，无法补造错误代码、请求耗时或超时时限。任务时间不等同于请求耗时。'] : []),
  ...(details.detailUnavailable === 'redacted' ? ['详细说明可能含敏感内容，已隐藏。'] : details.detailUnavailable === 'unparseable' ? ['未取得可安全展示的服务错误说明。'] : []),
];

export function gamecoworkTaskErrorDetailsText(details) {
  if (!details) return '';
  return ['错误详情', ...errorFields.map(([key, label]) => `${label}：${errorValue(key, details[key], details)}`), ...errorNotes(details)].join('\n');
}

export function GameCoworkTaskErrorDetails({React, Dialog, task, copyText}) {
  const h = React.createElement, [open, setOpen] = React.useState(false), [copyState, setCopyState] = React.useState('idle'), run = React.useRef(0);
  const details = gamecoworkTaskErrorDetails(task), text = gamecoworkTaskErrorDetailsText(details);
  React.useEffect(() => () => { run.current++; }, [text]);
  if (!details) return null;
  const close = () => { run.current++; setOpen(false); setCopyState('idle'); };
  const copy = async () => {
    const current = ++run.current; setCopyState('copying');
    try { await copyText(text); if (current === run.current) setCopyState('success'); }
    catch { if (current === run.current) setCopyState('failed'); }
  };
  return h(React.Fragment, null,
    h('style', null, '.gamecowork-task-error-details{max-height:65vh;overflow:auto;color:var(--studio-text);user-select:text}.gamecowork-task-error-fields{display:grid;grid-template-columns:minmax(110px,auto) minmax(0,1fr);gap:8px 16px;font-size:12px;margin:12px 0}.gamecowork-task-error-fields dt{color:var(--studio-text-secondary)}.gamecowork-task-error-fields dd{margin:0;white-space:pre-wrap;word-break:break-word}.gamecowork-task-error-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}.gamecowork-task-error-summary{font-size:12px;white-space:normal;word-break:break-word;margin:0 0 8px}.gamecowork-task-error-preview{max-width:100%;padding:8px}.studio-task-failed:has(>.gamecowork-task-error-preview){gap:3px;padding:6px;min-height:0}.studio-task-failed>.gamecowork-task-error-preview{width:100%;padding:0;min-height:0}.studio-task-failed>.gamecowork-task-error-preview>.gamecowork-task-error-summary{font-size:11px;line-height:1.25;margin:0 0 4px;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.studio-task-failed>.gamecowork-task-error-preview>.studio-error-expand{height:20px;min-height:20px;line-height:18px;padding:0 6px;margin:0;font-size:10px;white-space:nowrap}.studio-task-failed:has(>.gamecowork-task-error-preview)>.studio-task-failed-actions{flex:none}'),
    h('div', {className: 'gamecowork-task-error-preview'},
      h('p', {className: 'gamecowork-task-error-summary'}, details.summary),
      h('button', {type: 'button', className: 'generation-tag-button studio-error-expand', onClick: () => { setCopyState('idle'); setOpen(true); }}, '查看错误详情')),
    open && h(Dialog, {title: '错误详情', description: '只显示本次记录中可安全展示的诊断信息；未保存的字段明确标为未记录。', wide: true, busy: copyState === 'copying', onClose: close},
      h('div', {className: 'gamecowork-task-error-details', 'data-testid': 'gamecowork-task-error-details'},
        h('dl', {className: 'gamecowork-task-error-fields'}, ...errorFields.flatMap(([key, label]) => [h('dt', {key: key + '-label'}, label), h('dd', {key, 'data-error-field': key}, errorValue(key, details[key], details))])),
        ...errorNotes(details).map((note, index) => h('p', {key: index, role: 'note'}, note)),
        copyState === 'success' && h('p', {role: 'status'}, '错误详情已复制。'),
        copyState === 'failed' && h('p', {role: 'alert'}, '复制失败，请手动选择并复制详情内容。'),
        h('footer', {className: 'gamecowork-task-error-actions'},
          h('button', {type: 'button', className: 'generation-tag-button', disabled: copyState === 'copying', onClick: copy}, copyState === 'copying' ? '正在复制…' : '复制错误详情'),
          h('button', {type: 'button', className: 'generation-tag-button', onClick: close}, '关闭')))));
}
