'use strict';
// Read-only comparison of original task-history rows with an already submitted
// local task. No result authorizes another POST. The caller separately owns the
// account binding, historyScope:self query and pagination/completeness audit.
// Shape evidence: generator contract taskRow; original si/tIe/jwe, lines
// 41082, 78267-78278 and 41622-41645. Original task aliases are Z1e/hu.
const catalog = require('./models/official-catalog.js');
const MATCH_WINDOW_MS = 120000, CLOCK_SKEW_MS = 5000;
const METADATA = new Set(['studioKind', 'studioModelId']);
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const MEDIA_EXTENSIONS = new Map([
  ...['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif', 'bmp'].map(extension => [extension, 'image']),
  ...['mp4', 'webm', 'mov', 'm4v'].map(extension => [extension, 'video']),
  ...['wav', 'mp3', 'aac', 'flac', 'ogg', 'opus', 'm4a'].map(extension => [extension, 'audio']),
  ...['glb', 'gltf', 'fbx', 'obj', 'zip', 'stl', 'usdz'].map(extension => [extension, 'model']),
]);
function originalAlias(type) {
  if (type === 'fal_nano_banana') return 'image_design';
  if (type === 'fal_sonilo_sfx') return 'sound_sfx';
  if (type === 'fal_sonilo_music') return 'sound_music';
  return type.startsWith('fal_') ? type.slice(4) : type;
}
function declaredTaskTypes(model) {
  return ['tripo-p1', 'tripo-p2', 'tripo-31'].includes(model.id)
    ? ['tripo_text_to_model', 'tripo_image_to_model'] : typeof model.taskType === 'string' ? [model.taskType] : [];
}
function familyFor(type) {
  if (typeof type !== 'string' || !type || type.length > 200) return null;
  if (Object.hasOwn(catalog.MODELS, type)) return [type];
  const family = Object.values(catalog.MODELS).filter(model => declaredTaskTypes(model).some(task => task === type || originalAlias(task) === type)).map(model => model.id);
  return family.length ? family : null;
}
function plain(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
}
function jsonValue(value, depth = 0) {
  if (depth > 16) throw Error('bounded_json');
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') { if (!Number.isFinite(value)) throw Error('finite_json'); return; }
  if (Array.isArray(value)) {
    if (value.length > 128 || Object.keys(value).some((key, index) => key !== String(index))) throw Error('array_json');
  } else if (!plain(value)) throw Error('object_json');
  for (const [key, item] of Object.entries(value)) { if (UNSAFE_KEYS.has(key)) throw Error('unsafe_json'); jsonValue(item, depth + 1); }
}
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (plain(value)) return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}
function equal(left, right) { return JSON.stringify(canonical(left)) === JSON.stringify(canonical(right)); }
function clone(value) { jsonValue(value); return JSON.parse(JSON.stringify(value)); }
function stamp(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return null;
  const [year, month, day, hour, minute, second] = value.slice(0, 19).split(/[-T:]/).map(Number);
  if (month < 1 || month > 12 || day < 1 || day > new Date(Date.UTC(year, month, 0)).getUTCDate() || hour > 23 || minute > 59 || second > 59) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && parsed >= Date.UTC(2000, 0, 1) && parsed < Date.UTC(2100, 0, 1) ? parsed : null;
}
function rowTime(row) {
  const values = [];
  if (Object.hasOwn(row, 'createdTime')) { const value = stamp(row.createdTime); if (value === null) return null; values.push(value); }
  if (Object.hasOwn(row, 'createTime')) {
    if (typeof row.createTime !== 'number' || !Number.isFinite(row.createTime) || row.createTime < Date.UTC(2000, 0, 1) / 1000 || row.createTime >= Date.UTC(2100, 0, 1) / 1000) return null;
    values.push(row.createTime * 1000);
  }
  if (!values.length || values.some(value => Math.abs(value - values[0]) >= 1000)) return null;
  return values[0];
}
function rowId(row) {
  const ids = ['id', 'taskId', 'task_id'].filter(key => Object.hasOwn(row, key)).map(key => row[key]);
  if (!ids.length || ids.some(value => typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,200}$/.test(value) || value !== ids[0])) return null;
  return ids[0];
}
function identity(row, parameters) {
  const families = ['type', 'taskType'].filter(key => Object.hasOwn(row, key)).map(key => familyFor(row[key]));
  if (!families.length || families.some(family => !family)) return null;
  let possible = families.reduce((left, right) => left.filter(id => right.includes(id)));
  if (Object.hasOwn(row, 'category')) {
    if (!['image', '3d', 'video', 'audio', 'other'].includes(row.category)) return null;
    // Original history permits generic "other" for auxiliary task kinds.
    if (row.category !== 'other') possible = possible.filter(id => catalog.MODELS[id].mode === row.category);
  }
  if (parameters) {
    const metadata = [...METADATA].filter(key => Object.hasOwn(parameters, key)).map(key => parameters[key]);
    if (metadata.some(value => typeof value !== 'string' || !Object.hasOwn(catalog.MODELS, value)) || metadata.some(value => value !== metadata[0])) return null;
    if (metadata.length) possible = possible.filter(id => id === metadata[0]);
  }
  return possible;
}
function mergeInput(row) {
  if (!plain(row.input) || !plain(row.input.data) && !plain(row.input.param)) throw Error('missing_input');
  const param = row.input.param === undefined ? {} : clone(row.input.param), data = row.input.data === undefined ? {} : clone(row.input.data);
  if (!plain(param) || !plain(data)) throw Error('invalid_input');
  // jwe merges param then data. For an identity proof, conflicting retained
  // values must remain inconclusive instead of quietly choosing a winner.
  for (const key of Object.keys(param)) if (Object.hasOwn(data, key) && !equal(param[key], data[key])) throw Error('conflicting_input');
  return { ...param, ...data };
}
function normalizedParameters(id, value) {
  const parameters = clone(value);
  for (const key of METADATA) {
    if (parameters[key] !== undefined && parameters[key] !== id) throw Error('model_identity');
    delete parameters[key];
  }
  catalog.validatePayload(id, parameters);
  const slots = catalog.referenceSlots(id, parameters), pointers = new Set();
  for (const slot of slots) {
    if (pointers.has(slot.pointer) || !slot.mediaKinds.length) throw Error('reference_identity');
    pointers.add(slot.pointer);
    const address = new URL(slot.value);
    if (!['https:', 'http:'].includes(address.protocol) || address.username || address.password) throw Error('reference_address');
    const extension = address.pathname.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase(), kind = MEDIA_EXTENSIONS.get(extension);
    if (kind && !slot.mediaKinds.includes(kind)) throw Error('reference_kind');
  }
  const visit = (row, pointer = '') => {
    if (pointers.has(pointer)) {
      const slot = slots.find(value => value.pointer === pointer);
      return { referenceSlot: pointer, mediaKinds: [...slot.mediaKinds].sort() };
    }
    if (typeof row === 'string' && /^(?:https?:\/\/|file:|data:|blob:|ftp:)/i.test(row)) throw Error('unrecognized_reference');
    if (Array.isArray(row)) return row.map((child, index) => visit(child, pointer + '/' + index));
    if (plain(row)) return Object.fromEntries(Object.keys(row).sort().map(key => [key, visit(row[key], pointer + '/' + key.replace(/~/g, '~0').replace(/\//g, '~1'))]));
    return row;
  };
  return visit(parameters);
}
function outcome(status, matchCount, detail = {}) {
  return { status, matchCount, replayAllowed: false, historyCompletenessAssessed: false,
    ...(status === 'no_match' ? { absenceProven: false } : {}), ...detail };
}
function reconcile(localTask, remoteRows) {
  if (!plain(localTask) || typeof localTask.model !== 'string' || !Object.hasOwn(catalog.MODELS, localTask.model)) return outcome('inconclusive', 0, { reason: 'unknown_local_model' });
  if (localTask._remoteId || localTask.officialTaskId) return outcome('inconclusive', 0, { reason: 'local_task_already_has_remote_identity' });
  if (localTask.serviceSource !== undefined && localTask.serviceSource !== 'codely-official') return outcome('inconclusive', 0, { reason: 'not_an_official_local_task' });
  const start = stamp(localTask.createdTime);
  if (start === null) return outcome('inconclusive', 0, { reason: 'unknown_local_creation_time' });
  let parameters, expected;
  try { parameters = clone(localTask.parameters); if (!plain(parameters)) throw Error('missing_parameters'); expected = normalizedParameters(localTask.model, parameters); }
  catch { return outcome('inconclusive', 0, { reason: 'incomplete_local_parameters' }); }
  if (!Array.isArray(remoteRows) || remoteRows.length > 10000) return outcome('inconclusive', 0, { reason: 'invalid_history_rows' });
  const matches = new Map(), uncertainties = new Set(), seenIds = new Map(), identityRows = new Map();
  for (const row of remoteRows) {
    if (!plain(row)) { uncertainties.add('invalid_history_row'); continue; }
    const rowIdentity = rowId(row);
    if (rowIdentity) {
      let projection;
      try {projection=JSON.stringify(canonical(clone(Object.fromEntries(['type','taskType','category','createdTime','createTime','input'].filter(key=>Object.hasOwn(row,key)).map(key=>[key,row[key]])))));}
      catch {uncertainties.add('invalid_history_row');continue;}
      if(identityRows.has(rowIdentity)&&identityRows.get(rowIdentity)!==projection){uncertainties.add('conflicting_duplicate_remote_identity');continue;}
      identityRows.set(rowIdentity,projection);
    }
    const initial = identity(row);
    if (!initial) { uncertainties.add('unknown_remote_model'); continue; }
    if (!initial.includes(localTask.model)) continue;
    const time = rowTime(row);
    if (time === null) { uncertainties.add('unknown_remote_creation_time'); continue; }
    if (time < start - CLOCK_SKEW_MS || time > start + MATCH_WINDOW_MS) continue;
    const id = rowId(row);
    if (!id) { uncertainties.add('invalid_remote_task_identity'); continue; }
    let input;
    try { input = mergeInput(row); } catch { uncertainties.add('incomplete_remote_parameters'); continue; }
    const precise = identity(row, input);
    if (!precise) { uncertainties.add('conflicting_remote_model_identity'); continue; }
    if (!precise.includes(localTask.model)) continue;
    let received;
    try { received = normalizedParameters(localTask.model, input); }
    catch { uncertainties.add('incomplete_remote_parameters'); continue; }
    const fingerprint = JSON.stringify({ time, parameters: received });
    if (seenIds.has(id) && seenIds.get(id) !== fingerprint) { uncertainties.add('conflicting_duplicate_remote_identity'); continue; }
    seenIds.set(id, fingerprint);
    if (!equal(received, expected)) continue;
    // Shared upstream task types (notably Flare/sprite) cannot be promoted to
    // an exact model merely because there is only one nearby prompt match.
    const compatible = precise.filter(modelId => {
      try { normalizedParameters(modelId, input); return true; } catch { return false; }
    });
    if (compatible.length !== 1 || compatible[0] !== localTask.model) { uncertainties.add('ambiguous_remote_model'); continue; }
    matches.set(id, { remoteId: id, createdTimeMs: time });
  }
  if (matches.size > 1) return outcome('inconclusive', matches.size, { reason: 'ambiguous_matches' });
  if (uncertainties.size) return outcome('inconclusive', matches.size, { reason: [...uncertainties].sort()[0] });
  if (matches.size === 1) return outcome('matched', 1, matches.values().next().value);
  return outcome('no_match', 0);
}
module.exports = { reconcile, MATCH_WINDOW_MS, CLOCK_SKEW_MS };
