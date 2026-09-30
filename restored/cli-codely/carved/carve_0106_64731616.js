(function (){"use strict";// build/release/tmp_modules/internal/tty.ts
var $, OSRelease;
var TERM_ENVS = {
  eterm: 4,
  cons25: 4,
  console: 4,
  cygwin: 4,
  dtterm: 4,
  gnome: 4,
  hurd: 4,
  jfbterm: 4,
  konsole: 4,
  kterm: 4,
  mlterm: 4,
  mosh: 24,
  putty: 4,
  st: 4,
  "rxvt-unicode-24bit": 24,
  terminator: 24
}, TERM_ENVS_REG_EXP = [/ansi/, /color/, /linux/, /^con[0-9]*x[0-9]/, /^rxvt/, /^screen/, /^xterm/, /^vt100/], warned = !1;
function warnOnDeactivatedColors(env) {
  if (warned)
    return;
  let name = "";
  if (env.NODE_DISABLE_COLORS !== @undefined)
    name = "NODE_DISABLE_COLORS";
  if (env.NO_COLOR !== @undefined) {
    if (name !== "")
      name += "' and '";
    name += "NO_COLOR";
  }
  if (name !== "")
    process.emitWarning(`The '${name}' env is ignored due to the 'FORCE_COLOR' env being set.`, "Warning"), warned = !0;
}
function getColorDepth(env) {
  let FORCE_COLOR = env.FORCE_COLOR;
  if (FORCE_COLOR !== @undefined)
    switch (FORCE_COLOR) {
      case "":
      case "1":
      case "true":
        return warnOnDeactivatedColors(env), 4;
      case "2":
        return warnOnDeactivatedColors(env), 8;
      case "3":
        return warnOnDeactivatedColors(env), 24;
      default:
        return 1;
    }
  if (env.NODE_DISABLE_COLORS !== @undefined || env.NO_COLOR !== @undefined || env.TERM === "dumb")
    return 1;
  if (OSRelease === @undefined) {
    let { release } = @getInternalField(@internalModuleRegistry, 105) || @createInternalModuleById(105);
    OSRelease = release().split(".");
  }
  if (+OSRelease[0] >= 10) {
    let build = +OSRelease[2];
    if (build >= 14931)
      return 24;
    if (build >= 10586)
      return 8;
  }
  return 4;
  switch (env.TERM_PROGRAM) {
    case "iTerm.app":
      if (!env.TERM_PROGRAM_VERSION || /^[0-2]\./.test(env.TERM_PROGRAM_VERSION))
        return 8;
      return 24;
    case "HyperTerm":
    case "ghostty":
    case "WezTerm":
    case "MacTerm":
      return 24;
    case "Apple_Terminal":
      return 8;
  }
}
$ = { getColorDepth };
return $})

