import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import test from 'node:test';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const { createCodelyGeneratorApi } = require('../../src/core/binary/out/modules/generation/codely-api.js');

async function project(change = {}) {
  const root = path.join('F:/AI/AgentMake/CyberSoftwares/GameCowork/codelyreversebackup/work/tests', 'task-outcome-' + randomUUID());
  fs.mkdirSync(root, { recursive: true });
  const task = {
    id: 't_owned', providerId: 'owned-provider', kind: 'image', model: 'owned-image-model',
    prompt: 'Owned fixture', parameters: { size: '3840x2160' }, inputs: [], artifacts: [],
    status: 'interrupted', mayContinue: true, submissionUnknown: true,
    createdTime: '2026-10-04T04:15:15.854Z', updatedTime: '2026-10-04T04:16:38.479Z',
    error: 'fetch failed; create outcome is unknown and will not be resubmitted', ...change,
  };
  const before = JSON.stringify(task);
  const api = createCodelyGeneratorApi({
    assetService: { root, assertRuntime() {}, getOwnedSnapshot: () => ({ tasks: [task], inputs: [] }) },
    getOfficial: () => null,
  });
  const result = await api.dispatch({ method: 'GET', path: '/tasks', query: {}, origin: 'http://127.0.0.1:43111' });
  assert.equal(result.status, 200);
  assert.equal(JSON.stringify(task), before, 'Projection must not rewrite the historical task');
  return result.body.tasks[0];
}

test('An old unknown submission stays terminal but is explicitly distinguished from a rejected generation', async () => {
  const task = await project();
  assert.equal(task.status, 'failed', 'Original poll protocol still stops');
  assert.equal(task.errorCode, 'local_submission_unknown');
  assert.equal(task.local.submissionUnknown, true);
  assert.match(task.error, /生成结果未知/);
  assert.equal(task.errorDetails.submissionUnknown, true);
  assert.equal(task.errorDetails.diagnosticRecorded, false);
  for (const key of ['operation', 'stage', 'code', 'httpStatus', 'elapsedMs', 'timeoutMs']) assert.equal(task.errorDetails[key], null, key);
  assert.equal(task.errorDetails.detailUnavailable, 'not-recorded');
  assert.equal(task.errorDetails.taskId, 't_owned');
  assert.equal(task.errorDetails.requestedSize, '3840x2160');
  assert.doesNotMatch(task.error, /超时|83秒|ECONNRESET/, 'Missing past cause must not be invented');
  assert.equal(task.input.data.size, '3840x2160');
});

test('A measured connection reset is presented without echoing private transport exception fields', async () => {
  const task = await project({ transportDiagnostic: { code: 'ECONNRESET', operation: 'create', stage: 'awaiting-response', elapsedMs: 82625, timeoutMs: 180000, message: 'private-transport-value', url: 'https://private.invalid' } });
  assert.match(task.error, /连接被重置.*生成结果未知/);
  assert.equal(task.errorDetails.code, 'ECONNRESET');
  assert.equal(task.errorDetails.elapsedMs, 82625);
  assert.equal(task.errorDetails.timeoutMs, 180000);
  assert.equal(task.errorDetails.diagnosticRecorded, true);
  assert.doesNotMatch(JSON.stringify(task), /private-transport-value|private\.invalid/);
});

test('Explicit HTTP 502 remains a service failure with no unknown-submission marker', async () => {
  const task = await project({ status: 'failed', mayContinue: false, submissionUnknown: false, transportDiagnostic: { code: 'HTTP_ERROR', operation: 'create', stage: 'http-response', httpStatus: 502, elapsedMs: 92532, timeoutMs: 180000 }, error: 'Provider HTTP 502: private upstream body' });
  assert.equal(task.errorCode, 'local_task_failed');
  assert.equal(task.local.submissionUnknown, undefined);
  assert.match(task.error, /HTTP 502/);
  assert.doesNotMatch(task.error, /结果未知|private upstream/);
  assert.equal(task.errorDetails.httpStatus, 502);
  assert.equal(task.errorDetails.detailUnavailable, 'unparseable');
  assert.equal(task.errorDetails.serviceMessage, null);
});

test('An interrupted task with a known remote ID is not reclassified using error text', async () => {
  const task = await project({ submissionUnknown: false, error: 'fetch failed; create outcome is unknown and will not be resubmitted' });
  assert.equal(task.errorCode, 'local_task_interrupted');
  assert.equal(task.local.submissionUnknown, undefined);
});

test('Configured deadline and an unrecognized exception code have distinct safe presentations', async () => {
  const deadline = await project({ transportDiagnostic: { code: 'PROVIDER_REQUEST_DEADLINE', operation: 'create', stage: 'awaiting-response', elapsedMs: 180002, timeoutMs: 180000 } });
  assert.match(deadline.error, /配置的请求时限/);
  assert.equal(deadline.errorDetails.elapsedMs, 180002);
  assert.equal(deadline.errorDetails.timeoutMs, 180000);
  const unrecognized = await project({ transportDiagnostic: { code: 'private-unknown-code', elapsedMs: -1 } });
  assert.doesNotMatch(unrecognized.error, /private-unknown-code|秒/);
  assert.match(unrecognized.error, /生成结果未知/);
});

test('An older HTTP error still exposes its real status and selected safe service message without a fake transport record', async () => {
  const task = await project({ status: 'failed', submissionUnknown: false, mayContinue: false, error: 'Provider HTTP 502: {"error":{"message":"Upstream service temporarily unavailable","type":"upstream_error"},"request":{"body":"never-include-body"}}' });
  assert.equal(task.errorDetails.httpStatus, 502);
  assert.equal(task.errorDetails.serviceMessage, 'Upstream service temporarily unavailable');
  assert.equal(task.errorDetails.diagnosticRecorded, false);
  assert.equal(task.errorDetails.code, null);
  assert.equal(task.errorDetails.elapsedMs, null);
  assert.doesNotMatch(JSON.stringify(task), /never-include-body|upstream_error/);
});

test('Sensitive or complex service messages never leak through either the short error or the details DTO', async () => {
  const messages = [
    'Bearer unknown-private-token-value', 'Basic dXNlcjpwYXNzd29yZA==',
    'Authorization: something-private', 'api_key=unknown-private-secret',
    'private token=short-secret', 'Cookie: session=private',
    'id_token=private-value', 'sessionToken=private-value', 'api-key: private-value',
    '/private/media.png?sig=private-value', 'media.png?se=private-value',
    'Upstream failed\n    at call (/private/provider.js:12:7)',
    'open https://storage.invalid/image.png?signature=private-secret',
    'open https%3A%2F%2Fstorage.invalid%2Fprivate',
    'request body: private prompt here', 'headers: private value', 'stack: private path',
    'C:\\private\\user-file.txt', 'data:image/png;base64,cHJpdmF0ZQ==',
    'sk-unknown-private-credential', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.signature',
    '<script>private-display-probe</script>', 'opaque abcdefghijklmnopqrstuvwxyz0123456789',
  ];
  for (const message of messages) {
    const task = await project({ status: 'failed', submissionUnknown: false, mayContinue: false, error: 'Provider HTTP 502: ' + JSON.stringify({ error: { message } }) });
    assert.equal(task.errorDetails.serviceMessage, null, message);
    assert.equal(task.errorDetails.detailUnavailable, 'redacted', message);
    assert.doesNotMatch(JSON.stringify(task), /private|storage\.invalid|signature|dXNlcjpwYXNzd29yZA|eyJhbGci/);
  }
});

test('Truncated, HTML, deeply nested or unselected response data stays unavailable instead of falling back to raw text', async () => {
  for (const body of ['<html>private-probe</html>', '{"error":{"message":"private-probe', '{"data":{"message":"private-probe"}}', '[{"message":"private-probe"}]', JSON.stringify({error:{message:JSON.stringify({error:{message:JSON.stringify({error:{message:JSON.stringify({error:{message:'private-probe'}})}})}})}})]) {
    const task = await project({ status: 'failed', submissionUnknown: false, mayContinue: false, error: 'Provider HTTP 503: ' + body });
    assert.equal(task.errorDetails.httpStatus, 503);
    assert.equal(task.errorDetails.serviceMessage, null);
    assert.equal(task.errorDetails.detailUnavailable, 'unparseable');
    assert.doesNotMatch(JSON.stringify(task), /private-probe/);
  }
});

test('Diagnostic values are finite bounded facts, and only an actual size parameter is shown', async () => {
  const task = await project({ parameters: { resolutionHint: '3840x2160' }, transportDiagnostic: { code: 'arbitrary-private-code', operation: 'create', stage: 'awaiting-response', elapsedMs: -1, timeoutMs: Infinity, httpStatus: 502, url: 'https://private.invalid', body: 'private body' } });
  assert.equal(task.errorDetails.diagnosticRecorded, false);
  assert.equal(task.errorDetails.requestedSize, null);
  for (const key of ['code', 'stage', 'operation', 'elapsedMs', 'timeoutMs', 'httpStatus']) assert.equal(task.errorDetails[key], null);
  assert.deepEqual(Object.keys(task.errorDetails).sort(), ['version','summary','taskId','model','requestedSize','submissionUnknown','diagnosticRecorded','operation','stage','code','httpStatus','elapsedMs','timeoutMs','createdTime','updatedTime','serviceMessage','detailUnavailable'].sort());
  assert.doesNotMatch(JSON.stringify(task), /private/);
});

test('HTTP 200 with an undecodable response retains the observed status and an unknown generation outcome', async () => {
  const task = await project({ error: 'Provider response is not JSON; create outcome is unknown and will not be resubmitted', transportDiagnostic: { code: 'INVALID_JSON', operation: 'create', stage: 'decoding-response', elapsedMs: 82625, timeoutMs: 180000, httpStatus: 200 } });
  assert.equal(task.errorDetails.httpStatus, 200);
  assert.equal(task.errorDetails.code, 'INVALID_JSON');
  assert.equal(task.errorDetails.stage, 'decoding-response');
  assert.equal(task.errorDetails.submissionUnknown, true);
  assert.match(task.errorDetails.summary, /响应无法解析.*HTTP 200.*结果未知/);
  assert.doesNotMatch(task.errorDetails.summary, /未收到响应|502/);
});

for (const [status, message] of [[401, 'Invalid API key'], [402, 'Insufficient balance'], [404, 'Endpoint not found'], [502, 'Upstream service temporarily unavailable'], [503, 'No available compatible accounts']]) {
  test(`HTTP ${status} is visible in the card summary and exact safe service reason, including older records`, async () => {
    for (const recorded of [false, true]) {
      const task = await project({ status: 'failed', mayContinue: false, submissionUnknown: false, error: `Provider HTTP ${status}: ` + JSON.stringify({ error: { message } }),
        ...(recorded ? { transportDiagnostic: { code: 'HTTP_ERROR', operation: 'create', stage: 'http-response', elapsedMs: 82625, timeoutMs: 180000, httpStatus: status } } : {}),
      });
      assert.ok(task.error.includes(`HTTP ${status}`));
      assert.equal(task.errorDetails.httpStatus, status);
      assert.equal(task.errorDetails.serviceMessage, message);
      assert.equal(task.errorDetails.diagnosticRecorded, recorded);
      assert.equal(task.errorDetails.code, recorded ? 'HTTP_ERROR' : null);
    }
  });
}

test('An incomplete response with received HTTP error headers still displays that observed code', async () => {
  const task = await project({ error: 'Provider transport failed; create outcome is unknown and will not be resubmitted', transportDiagnostic: { code: 'UND_ERR_SOCKET', operation: 'create', stage: 'reading-response', elapsedMs: 82625, timeoutMs: 180000, httpStatus: 503 } });
  assert.match(task.error, /HTTP 503.*结果未知/);
  assert.equal(task.errorDetails.httpStatus, 503);
  assert.equal(task.errorDetails.submissionUnknown, true);
});

test('Existing official and output-download HTTP error wrappers retain their exact status without inventing timing', async () => {
  for (const [error, code] of [['Official generator request failed (402); create outcome is unknown and will not be resubmitted', 402], ['Official generator request failed (400): unsupported duration', 400], ['Output download HTTP 404', 404]]) {
    const task = await project({ error });
    assert.ok(task.error.includes(`HTTP ${code}`));
    assert.equal(task.errorDetails.httpStatus, code);
    assert.equal(task.errorDetails.diagnosticRecorded, false);
    assert.equal(task.errorDetails.elapsedMs, null);
    assert.equal(task.errorDetails.code, null);
  }
});

test('A continuing poll exposes its actual failure stage without changing the original running state', async () => {
  const task = await project({ status: 'running', submissionUnknown: false, transportDiagnostic: { operation: 'poll', stage: 'awaiting-response', code: 'UND_ERR_SOCKET', elapsedMs: 2000, timeoutMs: 180000 }, error: 'Provider transport failed' });
  assert.equal(task.status, 'running');
  assert.equal(task.errorDetails.operation, 'poll');
  assert.equal(task.errorDetails.code, 'UND_ERR_SOCKET');
  assert.equal(task.local.submissionUnknown, undefined);
});
