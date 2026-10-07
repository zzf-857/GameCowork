'use strict';
// Payloads and quotes mirror the original Quick B1e / $1e descriptors and
// prompt-optimization action. Source evidence lives in the generator contract
// fixture; this module never executes the original application or calls a host.
const COMMON_KEYS = ['studioKind', 'studioModelId'];
const AUDIO_FORMATS = Object.freeze(['wav', 'mp3', 'aac', 'flac']);
const MODELS = Object.freeze(Object.fromEntries([
  ['sonilo-sfx', '生音效 SFX', 'audio', 'audio', 'fal_sonilo_sfx', 1, ['audio']],
  ['sonilo-music', '生BGM 音乐', 'audio', 'audio', 'fal_sonilo_music', 1, ['audio']],
  ['eleven-sfx', '11音效', 'audio', 'audio', 'fal_sound_effect', 0, ['audio']],
  ['eleven-music', '11音乐', 'audio', 'audio', 'fal_11music', 0, ['audio']],
  ['huoshan-music', '火山纯音乐', 'audio', 'audio', 'huoshan_music', 0, ['audio']],
  ['minimax-tts', 'MiniMax TTS', 'audio', 'audio', 'fal_minimax_tts', 0, ['audio']],
  ['minimax-voice', 'MiniMax 声音克隆', 'audio', 'text', 'fal_voice_clone', 1, ['text', 'audio']],
  ['doubao-prompt', '多模态→提示词', 'image', 'text', 'doubao_multimodal', 12, ['text']],
].map(([id, name, mode, kind, taskType, maxInputs, outputKinds]) => [id,
  Object.freeze({id, name, mode, kind, taskType, maxInputs, outputKinds: Object.freeze(outputKinds),
    ...(id==='minimax-voice' ? {primaryKinds:Object.freeze(['audio','text'])} : {}),
    quoteFields: Object.freeze(['sonilo-sfx', 'sonilo-music', 'eleven-sfx', 'eleven-music', 'huoshan-music'].includes(id) ? ['duration'] : []), visible: true})])));

function reject(message) {
  const error = new Error(message);
  error.beforeRequest = true;
  error.code = 'invalid_official_audio_text_request';
  return error;
}
function object(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw reject(`${name} must be an object`);
}
function fields(value, allowed, name) {
  object(value, name);
  if (Object.keys(value).some(key => !allowed.includes(key))) throw reject(`${name} contains an unsupported original parameter`);
}
function text(value, name, max = 32000, required = true) {
  if (typeof value !== 'string' || [...value].length > max || required && !value.trim() || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) throw reject(`${name} is invalid`);
}
function url(value, name) {
  text(value, name, 8192);
  // URL ownership is checked by the adapter before anything is uploaded. This
  // check only validates the original field's syntax, including owned loopback.
  let parsed; try { parsed = new URL(value); } catch { throw reject(`${name} is not a media address`); }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) throw reject(`${name} is not a supported media address`);
}
function duration(value, min, max, step, name) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || Math.abs(value / step - Math.round(value / step)) > 1e-7) throw reject(`${name} is outside the original duration control`);
}
function option(value, options, name) { if (!options.includes(value)) throw reject(`${name} is not an original option`); }
function refs(value, name, max) {
  if (value === undefined) return;
  if (!Array.isArray(value) || value.length > max || Object.keys(value).some((key, i) => key !== String(i))) throw reject(`${name} exceeds the original reference control`);
  for (const item of value) url(item, name);
}
function clone(value) {
  // Reject exotic values rather than letting serialization silently strip them.
  const visit = (row, depth = 0) => {
    if (depth > 8) throw reject('Parameters are too deeply nested');
    if (row === undefined || row === null || ['string', 'boolean'].includes(typeof row)) return;
    if (typeof row === 'number') { if (!Number.isFinite(row)) throw reject('Parameters contain a non-finite number'); return; }
    if (typeof row !== 'object') throw reject('Parameters must be JSON values');
    if (!Array.isArray(row)) object(row, 'Parameters');
    for (const item of Object.values(row)) visit(item, depth + 1);
  };
  visit(value);
  return JSON.parse(JSON.stringify(value));
}

function validatePayload(id, payload) {
  if (!Object.hasOwn(MODELS, id)) throw reject('Unsupported official audio/text model');
  object(payload, 'Original payload');
  if (payload.studioModelId !== undefined && payload.studioModelId !== id || payload.studioKind !== undefined && payload.studioKind !== id) throw reject('Conflicting original model identity');
  switch (id) {
    case 'sonilo-sfx': case 'sonilo-music':
      fields(payload, [...COMMON_KEYS, 'prompt', 'videoUrl', 'durationSeconds', 'outputFormat'], id);
      if (payload.videoUrl !== undefined) url(payload.videoUrl, 'videoUrl');
      if (payload.prompt !== undefined) text(payload.prompt, 'prompt', 32000, !payload.videoUrl);
      else if (!payload.videoUrl) throw reject('An original audio prompt or video reference is required');
      // Original builders retain durationSeconds when a video is present. The
      // service derives the reference duration; do not fabricate a new duration.
      if (payload.durationSeconds !== undefined || !payload.videoUrl) duration(payload.durationSeconds, 1, 180, 1, 'durationSeconds');
      option(payload.outputFormat, AUDIO_FORMATS, 'outputFormat');
      break;
    case 'eleven-sfx':
      fields(payload, [...COMMON_KEYS, 'text', 'durationSeconds', 'outputFormat'], id);
      text(payload.text, 'text', 450);
      duration(payload.durationSeconds, 0.5, 5, 0.5, 'durationSeconds');
      option(payload.outputFormat, ['pcm_44100', 'mp3_44100_128'], 'outputFormat');
      break;
    case 'eleven-music':
      fields(payload, [...COMMON_KEYS, 'prompt', 'musicLengthMs', 'outputFormat'], id);
      text(payload.prompt, 'prompt', 2000);
      duration(payload.musicLengthMs, 3000, 600000, 1000, 'musicLengthMs');
      option(payload.outputFormat, ['mp3_44100_128', 'mp3_44100_192', 'pcm_44100', 'opus_48000_128'], 'outputFormat');
      break;
    case 'huoshan-music':
      fields(payload, [...COMMON_KEYS, 'text', 'duration', 'version', 'format'], id);
      text(payload.text, 'text');
      duration(payload.duration, 30, 300, 1, 'duration');
      option(payload.version, ['v5.0'], 'version');
      option(payload.format, AUDIO_FORMATS, 'format');
      break;
    case 'minimax-tts':
      fields(payload, [...COMMON_KEYS, 'prompt', 'voiceSetting', 'outputFormat'], id);
      text(payload.prompt, 'prompt', 5000);
      fields(payload.voiceSetting, ['voiceId', 'speed', 'vol'], 'voiceSetting');
      if (typeof payload.voiceSetting.voiceId !== 'string' || payload.voiceSetting.voiceId.length > 128 || !/^[A-Za-z0-9 _().-]*$/.test(payload.voiceSetting.voiceId)) throw reject('voiceId must be an original default or a real voice identity');
      duration(payload.voiceSetting.speed, 0.5, 2, 0.1, 'voiceSetting.speed');
      duration(payload.voiceSetting.vol, 0, 10, 1, 'voiceSetting.vol');
      option(payload.outputFormat, ['url'], 'outputFormat');
      break;
    case 'minimax-voice':
      fields(payload, [...COMMON_KEYS, 'audioUrl'], id);
      url(payload.audioUrl, 'audioUrl');
      break;
    case 'doubao-prompt':
      if (payload.mode === 'optimize') {
        // This is the exact separate wand action wne; it does not require media.
        fields(payload, [...COMMON_KEYS, 'mode', 'prompt', 'target', 'duration', 'refMode', 'audioKind', 'imageBased', 'lang'], id);
        text(payload.prompt, 'prompt');
        option(payload.target, ['image', 'video', '3d', 'audio'], 'target');
        if (payload.duration !== undefined) { if (payload.target !== 'video') throw reject('duration belongs to video optimization'); duration(payload.duration, 1, 600, 0.5, 'duration'); }
        if (payload.refMode !== undefined) { if (payload.target !== 'video') throw reject('refMode belongs to video optimization'); option(payload.refMode, ['text_to_video', 'first_frame', 'first_last_frame', 'reference', 'multimodal'], 'refMode'); }
        if (payload.audioKind !== undefined) { if (payload.target !== 'audio') throw reject('audioKind belongs to audio optimization'); option(payload.audioKind, ['sfx', 'music'], 'audioKind'); }
        if (payload.imageBased !== undefined && (payload.target !== '3d' || typeof payload.imageBased !== 'boolean')) throw reject('imageBased belongs to 3D optimization');
        if (payload.lang !== undefined) option(payload.lang, ['', 'en'], 'lang');
      } else {
        fields(payload, [...COMMON_KEYS, 'styleHint', 'images', 'videos', 'audios'], id);
        if (payload.styleHint !== undefined) text(payload.styleHint, 'styleHint', 32000, false);
        refs(payload.images, 'images', 10); refs(payload.videos, 'videos', 1); refs(payload.audios, 'audios', 1);
        if (!(payload.images?.length || payload.videos?.length || payload.audios?.length)) throw reject('At least one original multimodal reference is required');
      }
      break;
  }
  return clone(payload);
}

function quoteFor(id, payload) {
  const value = validatePayload(id, payload);
  const result = {taskType: MODELS[id].taskType};
  if (['sonilo-sfx', 'sonilo-music', 'eleven-sfx'].includes(id)) {
    // A video reference without a duration cannot be priced using an invented
    // value. The adapter must obtain its real cached duration first.
    if (value.durationSeconds === undefined) throw reject('Audio quote requires the actual reference duration');
    result.duration = String(Math.round(value.durationSeconds));
  } else if (id === 'eleven-music') result.duration = String(Math.round(value.musicLengthMs / 1000));
  else if (id === 'huoshan-music') result.duration = String(Math.round(value.duration));
  return result;
}

function referenceSlots(id, payload) {
  const value = validatePayload(id, payload);
  if (['sonilo-sfx', 'sonilo-music'].includes(id)) return value.videoUrl ? [{pointer: '/videoUrl', value: value.videoUrl, mediaKinds: ['video']}] : [];
  if (id === 'minimax-voice') return [{pointer: '/audioUrl', value: value.audioUrl, mediaKinds: ['audio']}];
  if (id !== 'doubao-prompt' || value.mode === 'optimize') return [];
  return ['images', 'videos', 'audios'].flatMap(field => (value[field] || []).map((address, index) => ({pointer: `/${field}/${index}`, value: address, mediaKinds: [field.slice(0, -1)]})));
}

function minimalPayload(id, {images = [], videos = [], audios = []} = {}) {
  let payload;
  switch (id) {
    case 'sonilo-sfx': payload = {prompt: 'One soft click.', durationSeconds: 1, outputFormat: 'wav'}; break;
    case 'sonilo-music': payload = {prompt: 'A calm instrumental bgm tone.', durationSeconds: 1, outputFormat: 'wav'}; break;
    case 'eleven-sfx': payload = {text: 'One soft click.', durationSeconds: 0.5, outputFormat: 'mp3_44100_128'}; break;
    case 'eleven-music': payload = {prompt: 'A calm instrumental tone.', musicLengthMs: 3000, outputFormat: 'mp3_44100_128'}; break;
    case 'huoshan-music': payload = {text: '舒缓的钢琴背景音乐，无人声。', duration: 30, version: 'v5.0', format: 'mp3'}; break;
    case 'minimax-tts': payload = {prompt: '你好。', voiceSetting: {voiceId: '', speed: 1, vol: 1}, outputFormat: 'url'}; break;
    case 'minimax-voice': payload = {audioUrl: audios[0]}; break;
    case 'doubao-prompt': payload = {styleHint: '简短描述。', images: images.slice(0, 1), videos: images.length ? [] : videos.slice(0, 1), audios: images.length || videos.length ? [] : audios.slice(0, 1)}; break;
    default: throw reject('Unsupported official audio/text model');
  }
  return validatePayload(id, payload);
}

function structuredOutput(id, reply) {
  if (!Object.hasOwn(MODELS, id)) throw reject('Unsupported official audio/text output');
  const row = reply?.data && typeof reply.data === 'object' ? reply.data : reply;
  object(row, 'Official task reply');
  if (!['completed', 'succeeded', 'success'].includes(String(row.status || '').toLowerCase())) return null;
  const output = row.output?.data && typeof row.output.data === 'object' ? row.output.data : row.output && typeof row.output === 'object' ? row.output : row;
  if (id === 'doubao-prompt') {
    const value = output.text ?? row.text;
    if (typeof value !== 'string' || !value.trim() || /^(https?:\/\/|\/api\/|\/attachment\/)/i.test(value.trim())) return null;
    text(value, 'Actual generated text', 128000);
    return {text: value.trim()};
  }
  if (id === 'minimax-voice') {
    // The original Quick client has no established voice-result view. Preserve
    // only a real returned identity; never manufacture an audio URL or voice.
    const voiceId = output.voiceId ?? output.voice_id ?? row.voiceId ?? row.voice_id;
    if (typeof voiceId !== 'string' || !/^[A-Za-z0-9 _().-]{1,128}$/.test(voiceId) || !voiceId.trim()) return null;
    return {voiceId, text: `音色 ID：${voiceId}`};
  }
  return null;
}

module.exports = {MODELS, validatePayload, quoteFor, referenceSlots, minimalPayload, structuredOutput};
