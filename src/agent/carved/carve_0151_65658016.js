(function (){"use strict";// build/release/tmp_modules/internal-for-testing.ts
var $, fmtBinding = @lazy(99), highlightJavaScript = (code) => fmtBinding(code, "highlight-javascript"), escapePowershell = (code) => fmtBinding(code, "escape-powershell"), canonicalizeIP = @lazy(78), SQL = @lazy(1), patchInternals = {
  parse: @lazy(100),
  apply: @lazy(101),
  makeDiff: @lazy(102)
}, internalSourceMap = {
  fromVLQ: @lazy(103),
  toVLQ: @lazy(104),
  find: @lazy(105)
}, shellLex = @lazy(106), shellParse = @lazy(107), sslCtxLiveCount = @lazy(108), escapeRegExp = @lazy(109), escapeRegExpForPackageNameMatching = @lazy(110), shellInternals = {
  lex: (a, ...b) => shellLex(a.raw, b),
  parse: (a, ...b) => shellParse(a.raw, b),
  builtinDisabled: @lazy(111)
}, subprocessInternals = {
  injectStdioReadError: @lazy(112)
}, iniInternals = {
  parse: @lazy(113),
  loadNpmrc: @lazy(114)
}, cssInternals = {
  minifyTestWithOptions: @lazy(115),
  minifyErrorTestWithOptions: @lazy(116),
  testWithOptions: @lazy(117),
  prefixTestWithOptions: @lazy(118),
  minifyTest: @lazy(119),
  prefixTest: @lazy(120),
  _test: @lazy(121),
  attrTest: @lazy(122)
}, crash_handler = @lazy(123), upgrade_test_helpers = @lazy(124), install_test_helpers = @lazy(125), jscInternals = @lazy(126), nativeFrameForTesting = @lazy(127), memfd_create = @lazy(128), createStatsForIno = @lazy(129), setSyntheticAllocationLimitForTesting = @lazy(130), npm_manifest_test_helpers = @lazy(131), npa = @lazy(132), npmTag = @lazy(133), readTarball = @lazy(134), isArchitectureMatch = @lazy(135), isOperatingSystemMatch = @lazy(136), createSocketPair = @lazy(137), isModuleResolveFilenameSlowPathEnabled = @lazy(138), frameworkRouterInternals = @lazy(139), bindgen = @lazy(140), noOpForTesting = @lazy(141), Dequeue = @getInternalField(@internalModuleRegistry, 17) || @createInternalModuleById(17), fs = (@getInternalField(@internalModuleRegistry, 97) || @createInternalModuleById(97)).@data, fsStreamInternals = {
  writeStreamFastPath(str) {
    return str[(@getInternalField(@internalModuleRegistry, 23) || @createInternalModuleById(23)).kWriteStreamFastPath];
  }
}, arrayBufferViewHasBuffer = @lazy(142), timerInternals = {
  timerClockMs: @lazy(143)
}, decodeURIComponentSIMD = @lazy(144), getDevServerDeinitCount = @lazy(145), getCounters = @lazy(146), hasNonReifiedStatic = @lazy(147), setSocketOptions = @lazy(148), structuredCloneAdvanced = @lazy(149), lsanDoLeakCheck = @lazy(150), BunString_toThreadSafeRefCountDelta = @lazy(151), getEventLoopStats = @lazy(152), hostedGitInfo = {
  parseUrl: @lazy(153),
  fromUrl: @lazy(154)
}, translateUVErrorToE = @lazy(155), sysErrorNameFromLibuv = @lazy(156), sigactionLayout = @lazy(157), stringsInternals = {
  toUTF16AllocSentinel: @lazy(158)
}, fetchH2Internals = {
  liveCounts: @lazy(159)
}, fetchH3Internals = {
  liveCounts: @lazy(160)
}, fileSinkInternals = {
  liveCount: @lazy(161)
};
return{
  upgrade_test_helpers,
  translateUVErrorToE,
  timerInternals,
  sysErrorNameFromLibuv,
  subprocessInternals,
  structuredCloneAdvanced,
  stringsInternals,
  sslCtxLiveCount,
  sigactionLayout,
  shellInternals,
  setSyntheticAllocationLimitForTesting,
  setSocketOptions,
  readTarball,
  patchInternals,
  npm_manifest_test_helpers,
  npmTag,
  npa,
  noOpForTesting,
  nativeFrameForTesting,
  memfd_create,
  lsanDoLeakCheck,
  jscInternals,
  isOperatingSystemMatch,
  isModuleResolveFilenameSlowPathEnabled,
  isArchitectureMatch,
  internalSourceMap,
  install_test_helpers,
  iniInternals,
  hostedGitInfo,
  highlightJavaScript,
  hasNonReifiedStatic,
  getEventLoopStats,
  getDevServerDeinitCount,
  getCounters,
  fsStreamInternals,
  fs,
  frameworkRouterInternals,
  fileSinkInternals,
  fetchH3Internals,
  fetchH2Internals,
  escapeRegExpForPackageNameMatching,
  escapeRegExp,
  escapePowershell,
  decodeURIComponentSIMD,
  cssInternals,
  createStatsForIno,
  createSocketPair,
  crash_handler,
  canonicalizeIP,
  bindgen,
  arrayBufferViewHasBuffer,
  SQL,
  Dequeue,
  BunString_toThreadSafeRefCountDelta
};})

