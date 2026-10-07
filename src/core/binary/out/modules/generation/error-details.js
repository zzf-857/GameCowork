'use strict';
// Bounded presentation of persisted task facts, never a dump of exceptions or
// service responses. This also handles older records without transport facts.
const CODES = new Set(['UND_ERR_HEADERS_TIMEOUT', 'UND_ERR_BODY_TIMEOUT', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_SOCKET', 'ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN', 'ENETUNREACH', 'EHOSTUNREACH', 'CERT_HAS_EXPIRED', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'ERR_TLS_CERT_ALTNAME_INVALID', 'PROVIDER_REQUEST_DEADLINE', 'TRANSPORT_ERROR', 'REQUEST_ABORTED', 'PROVIDER_RESPONSE_LIMIT', 'HTTP_ERROR', 'INVALID_JSON']);
const OPERATIONS = new Set(['create', 'poll', 'download', 'cancel']);
const STAGES = new Set(['awaiting-response', 'reading-response', 'http-response', 'decoding-response']);
const SAFE_AUTH_MESSAGES = new Set(['invalid api key', 'api key is invalid', 'missing api key', 'api key is required', 'incorrect api key provided', 'invalid access token', 'access token expired', 'authentication required']);
const LABELS = {
  UND_ERR_CONNECT_TIMEOUT: '连接服务超时', UND_ERR_HEADERS_TIMEOUT: '等待服务响应超时',
  UND_ERR_BODY_TIMEOUT: '读取服务响应超时', UND_ERR_SOCKET: '服务连接中断',
  ECONNRESET: '服务连接被重置', ECONNREFUSED: '无法建立服务连接', ETIMEDOUT: '服务连接超时',
  ENOTFOUND: '无法解析服务地址', EAI_AGAIN: '服务地址解析暂时失败',
  ENETUNREACH: '网络不可达', EHOSTUNREACH: '服务地址不可达',
  CERT_HAS_EXPIRED: '服务证书已过期', DEPTH_ZERO_SELF_SIGNED_CERT: '服务证书无法验证',
  UNABLE_TO_VERIFY_LEAF_SIGNATURE: '服务证书无法验证', ERR_TLS_CERT_ALTNAME_INVALID: '服务证书与地址不匹配',
  PROVIDER_REQUEST_DEADLINE: '已达到配置的请求时限', TRANSPORT_ERROR: '服务连接异常',
  REQUEST_ABORTED: '请求已中断', PROVIDER_RESPONSE_LIMIT: '服务响应超过大小限制', INVALID_JSON: '服务响应无法解析',
};
const integer = (value, min, max) => Number.isSafeInteger(value) && value >= min && value <= max ? value : null;
const text = (value, max) => typeof value === 'string' && value.length > 0 && value.length <= max && !/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/.test(value) ? value : null;
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(value) && value.length < 40 && Number.isFinite(Date.parse(value)) ? value : null;

function selectedMessage(value, depth = 0) {
  if (depth > 3) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^[{[\"]/.test(trimmed)) {
      try { return selectedMessage(JSON.parse(trimmed), depth + 1); } catch { return null; }
    }
    return trimmed;
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  // Only these deliberate leaves; never traverse arbitrary objects or arrays.
  for (const candidate of [value.error?.message, typeof value.error === 'string' ? value.error : undefined, value.message, typeof value.detail === 'string' ? value.detail : value.detail?.message]) {
    if (typeof candidate === 'string') return selectedMessage(candidate, depth + 1);
  }
  return null;
}

function safeMessage(value) {
  if (typeof value !== 'string' || value.length > 4096) return { message: null, unavailable: 'unparseable' };
  const message = value.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '').replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, ' ').replace(/\s+/g, ' ').trim();
  // These complete fixed diagnostics name a credential type but contain no
  // credential value. Do not hide the useful reason for an actual HTTP 401.
  if (SAFE_AUTH_MESSAGES.has(message.toLowerCase().replace(/[.!]$/, ''))) return { message, unavailable: null };
  // Reject complex/sensitive text as a whole rather than promising that every
  // unknown credential can be located and redacted inside an arbitrary dump.
  const unsafe = /(?:[a-z][a-z0-9+.-]{1,20}:\/\/|(?:data|blob|file):|[A-Za-z]:[\\/]|\\\\|[{}<>]|%[0-9a-f]{2}|\\[ux][0-9a-f]{2,4})/i.test(message)
    || /\b(?:authorization|bearer|basic|cookie|password|secret|credential|signature|stack|headers?|api[ _-]?key|access[ _-]?token|refresh[ _-]?token|client[ _-]?secret)\b/i.test(message)
    || /\b[a-z0-9_-]*(?:token|secret|credential|password|signature|sig|key)[a-z0-9_-]*\s*[:=]|\S+\?[^\s]*=/i.test(message)
    || /(?:^|\s)at\s+(?:[^\s()]+\s+)?\(?[^\s()]+:\d+(?::\d+)?\)?(?:\s|$)/i.test(message)
    || /\b(?:request|response)[ _-]?(?:body|headers?)\b|\btoken\s*[:=]|\bsk[-_][a-z0-9_-]{6,}|\beyJ[a-z0-9_-]+\.[a-z0-9_-]+|[a-z0-9_+/=-]{32,}/i.test(message);
  if (unsafe) return { message: null, unavailable: 'redacted' };
  if (!message) return { message: null, unavailable: 'not-recorded' };
  return { message: message.length > 512 ? message.slice(0, 511) + '…' : message, unavailable: null };
}

function serviceReason(error) {
  if (typeof error !== 'string' || !error) return { message: null, unavailable: 'not-recorded', httpStatus: null };
  const plain = error.replace(/; create outcome is unknown and will not be resubmitted$/, '');
  const official = /^Official generator request failed \(([1-5]\d{2})\)(?:: ([\s\S]*))?$/.exec(plain);
  if (official) return { ...(official[2] ? safeMessage(official[2]) : { message: null, unavailable: 'not-recorded' }), httpStatus: Number(official[1]) };
  const download = /^Output download HTTP ([1-5]\d{2})$/.exec(plain);
  if (download) return { message: '输出文件下载时收到此 HTTP 状态。', unavailable: 'not-recorded', httpStatus: Number(download[1]) };
  const http = /^Provider HTTP ([1-5]\d{2}): ([\s\S]*)$/.exec(error);
  if (http) {
    const httpStatus = Number(http[1]);
    if (http[2].length > 4096) return { message: null, unavailable: 'unparseable', httpStatus };
    let object; try { object = JSON.parse(http[2]); } catch { return { message: null, unavailable: 'unparseable', httpStatus }; }
    const selected = selectedMessage(object);
    return { ...(selected === null ? { message: null, unavailable: 'unparseable' } : safeMessage(selected)), httpStatus };
  }
  if (/^fetch failed(?:; create outcome is unknown and will not be resubmitted)?$/.test(error))
    return { message: 'fetch failed（旧记录未保留底层原因）', unavailable: 'not-recorded', httpStatus: null };
  if (/^Provider (?:transport failed|request deadline exceeded)(?:; create outcome is unknown and will not be resubmitted)?$/.test(error))
    return { message: null, unavailable: null, httpStatus: null };
  return { ...safeMessage(error.replace(/; create outcome is unknown and will not be resubmitted$/, '')), httpStatus: null };
}

function createTaskErrorDetails(task) {
  if (!task?.error) return null;
  const raw = task.transportDiagnostic;
  const valid = !!raw && CODES.has(raw.code) && OPERATIONS.has(raw.operation) && STAGES.has(raw.stage)
    && integer(raw.elapsedMs, 0, 2147483647) !== null && integer(raw.timeoutMs, 1, 600000) !== null;
  const code = valid ? raw.code : null, reason = serviceReason(task.error);
  const httpStatus = valid ? integer(raw.httpStatus, 100, 599) : reason.httpStatus;
  const submissionUnknown = task.submissionUnknown === true;
  let summary;
  if (submissionUnknown) summary = (LABELS[code] || '未取得完整生成结果') + (httpStatus === null ? '' : `（HTTP ${httpStatus}）`) + '，生成结果未知';
  else if (httpStatus >= 500) summary = `上游服务暂不可用（HTTP ${httpStatus}）`;
  else if (httpStatus === 401 || httpStatus === 403) summary = `服务认证或权限检查失败（HTTP ${httpStatus}）`;
  else if (httpStatus === 429) summary = '服务请求受限（HTTP 429）';
  else if (httpStatus >= 400) summary = `服务拒绝请求（HTTP ${httpStatus}）`;
  else if (httpStatus !== null && code === 'HTTP_ERROR') summary = `服务返回 HTTP ${httpStatus}，请求未完成`;
  else summary = LABELS[code] || '生成请求未完成';
  const taskId = typeof task.id === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(task.id) ? task.id : null;
  const size = task.parameters?.size;
  return {
    version: 1, summary, taskId, model: text(task.model, 256),
    requestedSize: typeof size === 'string' && /^(?:auto|[1-9]\d{0,4}x[1-9]\d{0,4})$/.test(size) ? size : null,
    submissionUnknown, diagnosticRecorded: valid,
    operation: valid ? raw.operation : null, stage: valid ? raw.stage : null, code,
    httpStatus, elapsedMs: valid ? raw.elapsedMs : null, timeoutMs: valid ? raw.timeoutMs : null,
    createdTime: date(task.createdTime), updatedTime: date(task.updatedTime),
    serviceMessage: reason.message, detailUnavailable: reason.unavailable || (!valid ? 'not-recorded' : null),
  };
}

module.exports = { createTaskErrorDetails };
