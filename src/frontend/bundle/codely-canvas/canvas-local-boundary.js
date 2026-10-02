// Local namespace adapter only. Original Canvas routing still sees /home and /canvas.
export const canvasPrefix = '/codely-canvas';
export function canvasPathname() {
  const actual = window.location.pathname;
  return actual === canvasPrefix ? '/' : actual.startsWith(canvasPrefix + '/') ? actual.slice(canvasPrefix.length) : actual;
}
export function canvasHistoryUrl(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value === canvasPrefix || value.startsWith(canvasPrefix + '/')) return value;
  return canvasPrefix + value;
}
export function canvasReplaceState(...args) { if (args.length > 2) args[2] = canvasHistoryUrl(args[2]); return window.history.replaceState(...args); }
export function canvasPushState(...args) { if (args.length > 2) args[2] = canvasHistoryUrl(args[2]); return window.history.pushState(...args); }
