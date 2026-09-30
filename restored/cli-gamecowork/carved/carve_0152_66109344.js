(async function (outBase, allServerFiles, renderStatic, getParams, clientEntryUrl, patterns, files, typeAndFlags, sourceRouteFiles, paramInformation, styles) {"use strict";
  let { join: pathJoin } = @getInternalField(@internalModuleRegistry, 107) || @createInternalModuleById(107), loadedModules = new @Array(allServerFiles.length);
  async function doGenerateRoute(type, noClient, i, layouts, pageModule, params) {
    let callback = renderStatic[type], client = clientEntryUrl[type], results = await callback({
      modules: client && !noClient ? [client] : [],
      modulepreload: [],
      styles: styles[i],
      layouts,
      pageModule,
      params
    });
    if (results == null)
      throw Error(`Route ${JSON.stringify(sourceRouteFiles[i])} cannot be pre-rendered to a static page.`);
    if (typeof results !== "object")
      throw Error(`Rendering route ${JSON.stringify(sourceRouteFiles[i])} did not return an object, got ${Bun.inspect(results)}. This is a bug in the framework.`);
    let { files: files2 } = results;
    if (files2 == null)
      throw Error(`Route ${JSON.stringify(sourceRouteFiles[i])} cannot be pre-rendered to a static page.`);
    await @Promise.all(Object.entries(files2).map(([key, value]) => {
      if (params != null) {
        let newKey = patterns[i].replace(/:(\w+)/g, (_, p1) => typeof params[p1] === "string" ? params[p1] : params[p1].join("/"));
        return Bun.write(pathJoin(outBase, newKey + key), value);
      }
      return Bun.write(pathJoin(outBase, patterns[i] + key), value);
    }));
  }
  function callRouteGenerator(type, noClient, i, layouts, pageModule, params) {
    for (let param of paramInformation[i])
      if (params[param] === @undefined)
        throw Error(`Missing param ${param} for route ${JSON.stringify(sourceRouteFiles[i])}`);
    return doGenerateRoute(type, noClient, i, layouts, pageModule, params);
  }
  let modulesForFiles = [];
  for (let fileList of files)
    if (fileList.length > 1) {
      let anyPromise = !1, loaded = fileList.map((x) => loadedModules[x] ?? (anyPromise = !0, import(allServerFiles[x]).then((x2) => loadedModules[x2] = x2)));
      modulesForFiles.push(anyPromise ? await @Promise.all(loaded) : loaded);
    } else {
      let id = fileList[0];
      modulesForFiles.push([loadedModules[id] ?? (loadedModules[id] = await import(allServerFiles[id]))]);
    }
  return @Promise.all(modulesForFiles.map(async (modules, i) => {
    let typeAndFlag = typeAndFlags[i], type = typeAndFlag & 255, noClient = (typeAndFlag & 256) !== 0, [pageModule, ...layouts] = modules;
    if (paramInformation[i] != null) {
      let getParam = getParams[type], paramGetter = await getParam({
        pageModule,
        layouts
      }), result;
      if (paramGetter[Symbol.asyncIterator] != @undefined) {
        for await (let params of paramGetter)
          if (result = callRouteGenerator(type, noClient, i, layouts, pageModule, params), @isPromise(result) && (@getPromiseInternalField(result, @promiseFieldFlags) & @promiseStateMask) === @promiseStatePending)
            await result;
      } else if (paramGetter[Symbol.iterator] != @undefined) {
        for (let params of paramGetter)
          if (result = callRouteGenerator(type, noClient, i, layouts, pageModule, params), @isPromise(result) && (@getPromiseInternalField(result, @promiseFieldFlags) & @promiseStateMask) === @promiseStatePending)
            await result;
      } else
        await @Promise.all(paramGetter.pages.map((params) => {
          callRouteGenerator(type, noClient, i, layouts, pageModule, params);
        }));
    } else
      await doGenerateRoute(type, noClient, i, layouts, pageModule, null);
  }));
})
(function (component, responseObject, responseOptions, kind) {"use strict";
  let bakeGetAsyncLocalStorage = @lazy(162);
  return function() {
    if (kind === 1)
      throw responseObject;
    if (kind === 2)
      throw responseObject;
    let async_local_storage = bakeGetAsyncLocalStorage();
    if (async_local_storage) {
      let store = async_local_storage.getStore();
      if (store)
        store.responseOptions = responseOptions;
    }
    return component;
  };
})
(function (plugins, bunfig_folder, runSetupFn) {"use strict";
  let config = {
    experimentalCss: !0,
    experimentalHtml: !0,
    target: "browser",
    root: bunfig_folder
  };

  class InvalidBundlerPluginError extends TypeError {
    pluginName;
    constructor(pluginName, reason) {
      super(`"${pluginName}" is not a valid bundler plugin: ${reason}`);
      this.pluginName = pluginName;
    }
  }
  return (async (plugins2, bunfig_folder2, runSetupFn2, bundlerPlugin2) => {
    let onstart_promises_array = @undefined;
    for (let i = 0;i < plugins2.length; i++) {
      let pluginModuleRaw = await import(await Bun.resolve(plugins2[i], bunfig_folder2));
      if (!pluginModuleRaw || !pluginModuleRaw.default)
        @throwTypeError(`Expected "${plugins2[i]}" to be a module which default exports a bundler plugin.`);
      let pluginModule = pluginModuleRaw.default;
      if (!pluginModule)
        throw new InvalidBundlerPluginError(plugins2[i], "default export is missing");
      if (pluginModule.name === @undefined)
        throw new InvalidBundlerPluginError(plugins2[i], "name is missing");
      if (pluginModule.setup === @undefined)
        throw new InvalidBundlerPluginError(plugins2[i], "setup() is missing");
      onstart_promises_array = await runSetupFn2.@apply(bundlerPlugin2, [
        pluginModule.setup,
        config,
        onstart_promises_array,
        i === plugins2.length - 1,
        !1
      ]);
    }
    if (onstart_promises_array !== @undefined)
      await @Promise.all(onstart_promises_array);
  })(plugins, bunfig_folder, runSetupFn, this);
})
(function (promise, buildResult, buildRejection) {"use strict";
  let callbacks = this.onEndCallbacks;
  if (!callbacks)
    return;
  let promises = [];
  for (let callback of callbacks)
    try {
      let result = callback(buildResult);
      if (result && @isPromise(result))
        @arrayPush(promises, result);
    } catch (e) {
      @arrayPush(promises, @Promise.@reject(e));
    }
  if (promises.length > 0)
    return @Promise.all(promises).then(() => {
      if (buildRejection !== @undefined)
        @rejectPromise(promise, buildRejection);
      else
        @resolvePromise(promise, buildResult);
    }, (e) => {
      @rejectPromise(promise, e);
    });
})
(function (internalID, path, namespace, defaultLoaderId, isServerSide) {"use strict";
  let LOADERS_MAP = { jsx: 1, js: 2, ts: 3, tsx: 4, css: 5, file: 6, json: 7, jsonc: 8, toml: 9, wasm: 10, napi: 11, base64: 12, dataurl: 13, text: 14, bunsh: 15, sqlite: 16, sqlite_embedded: 17, html: 18, yaml: 19 }, loaderName = ["jsx", "js", "ts", "tsx", "css", "file", "json", "jsonc", "toml", "wasm", "napi", "base64", "dataurl", "text", "bunsh", "sqlite", "sqlite_embedded", "html", "yaml"][defaultLoaderId];
  var promiseResult = (async (internalID2, path2, namespace2, isServerSide2, defaultLoader, generateDefer2) => {
    var results = this.onLoad.@get(namespace2);
    if (!results)
      return this.onLoadAsync(internalID2, null, null), null;
    for (let [filter, callback] of results)
      if (filter.test(path2)) {
        var result = callback({
          path: path2,
          namespace: namespace2,
          loader: defaultLoader,
          defer: generateDefer2,
          side: isServerSide2 ? "server" : "client"
        });
        while (result && @isPromise(result) && (@getPromiseInternalField(result, @promiseFieldFlags) & @promiseStateMask) === @promiseStateFulfilled)
          result = @getPromiseInternalField(result, @promiseFieldReactionsOrResult);
        if (result && @isPromise(result))
          result = await result;
        if (!result || !@isObject(result))
          continue;
        var { contents, loader = defaultLoader } = result;
        if (loader === "object") {
          if (!("exports" in result))
            @throwTypeError('onLoad plugin returning loader: "object" must have "exports" property');
          try {
            contents = JSON.stringify(result.exports), loader = "json";
          } catch (e) {
            @throwTypeError("When using Bun.build, onLoad plugin must return a JSON-serializable object: " + e);
          }
        }
        if (typeof contents !== "string" && !@isTypedArrayView(contents))
          @throwTypeError('onLoad plugins must return an object with "contents" as a string or Uint8Array');
        if (typeof loader !== "string")
          @throwTypeError('onLoad plugins must return an object with "loader" as a string');
        let chosenLoader = LOADERS_MAP[loader];
        if (chosenLoader === @undefined)
          @throwTypeError(`Loader ${loader} is not supported.`);
        return this.onLoadAsync(internalID2, contents, chosenLoader), null;
      }
    return this.onLoadAsync(internalID2, null, null), null;
  })(internalID, path, namespace, isServerSide, loaderName, () => this.generateDeferPromise(internalID));
  while (promiseResult && @isPromise(promiseResult) && (@getPromiseInternalField(promiseResult, @promiseFieldFlags) & @promiseStateMask) === @promiseStateFulfilled)
    promiseResult = @getPromiseInternalField(promiseResult, @promiseFieldReactionsOrResult);
  if (promiseResult && @isPromise(promiseResult))
    promiseResult.then(() => {}, (e) => {
      this.addError(internalID, e, 1);
    });
})
(function (specifier, inputNamespace, importer, internalID, kindId) {"use strict";
  let kind = ["entry-point-run", "entry-point-build", "import-statement", "require-call", "dynamic-import", "require-resolve", "import-rule", "url-token", "internal"][kindId];
  var promiseResult = (async (inputPath, inputNamespace2, importer2, kind2) => {
    var { onResolve, onLoad } = this, results = onResolve.@get(inputNamespace2);
    if (!results)
      return this.onResolveAsync(internalID, null, null, null), null;
    for (let [filter, callback] of results)
      if (filter.test(inputPath)) {
        var result = callback({
          path: inputPath,
          importer: importer2,
          namespace: inputNamespace2,
          resolveDir: inputNamespace2 === "file" ? (@getInternalField(@internalModuleRegistry, 107) || @createInternalModuleById(107)).dirname(importer2) : @undefined,
          kind: kind2
        });
        while (result && @isPromise(result) && (@getPromiseInternalField(result, @promiseFieldFlags) & @promiseStateMask) === @promiseStateFulfilled)
          result = @getPromiseInternalField(result, @promiseFieldReactionsOrResult);
        if (result && @isPromise(result))
          result = await result;
        if (!result || !@isObject(result))
          continue;
        var { path, namespace: userNamespace = inputNamespace2, external } = result;
        if (path !== @undefined && typeof path !== "string")
          @throwTypeError("onResolve plugins 'path' field must be a string if provided");
        if (result.namespace !== @undefined && typeof result.namespace !== "string")
          @throwTypeError("onResolve plugins 'namespace' field must be a string if provided");
        if (!path)
          continue;
        if (!userNamespace)
          userNamespace = inputNamespace2;
        if (typeof external !== "boolean" && !@isUndefinedOrNull(external))
          @throwTypeError('onResolve plugins "external" field must be boolean or unspecified');
        if (!external) {
          if (userNamespace === "file") {
            if ((@getInternalField(@internalModuleRegistry, 107) || @createInternalModuleById(107)).isAbsolute(path) === !1 || path.includes(".."))
              @throwTypeError('onResolve plugin "path" must be absolute when the namespace is "file"');
          }
          if (userNamespace === "dataurl") {
            if (!path.startsWith("data:"))
              @throwTypeError('onResolve plugin "path" must start with "data:" when the namespace is "dataurl"');
          }
          if (userNamespace && userNamespace !== "file" && (!onLoad || !onLoad.@has(userNamespace)))
            @throwTypeError(`Expected onLoad plugin for namespace ${userNamespace} to exist`);
        }
        return this.onResolveAsync(internalID, path, userNamespace, external), null;
      }
    return this.onResolveAsync(internalID, null, null, null), null;
  })(specifier, inputNamespace, importer, kind);
  while (promiseResult && @isPromise(promiseResult) && (@getPromiseInternalField(promiseResult, @promiseFieldFlags) & @promiseStateMask) === @promiseStateFulfilled)
    promiseResult = @getPromiseInternalField(promiseResult, @promiseFieldReactionsOrResult);
  if (promiseResult && @isPromise(promiseResult))
    promiseResult.then(() => {}, (e) => {
      this.addError(internalID, e, 0);
    });
})
(function (setup, config, promises, is_last, isBake) {"use strict";
  this.promises = promises;
  var onLoadPlugins = /* @__PURE__ */ new Map, onResolvePlugins = /* @__PURE__ */ new Map, onBeforeParsePlugins = /* @__PURE__ */ new Map;
  function validate(filterObject, callback, map, symbol, external) {
    if (!filterObject || !@isObject(filterObject))
      @throwTypeError('Expected an object with "filter" RegExp');
    let isOnBeforeParse = !1;
    if (map === onBeforeParsePlugins) {
      if (isOnBeforeParse = !0, !callback || !@isObject(callback) || !callback.@napiDlopenHandle)
        @throwTypeError("onBeforeParse `napiModule` must be a Napi module which exports the `BUN_PLUGIN_NAME` symbol.");
      if (typeof symbol !== "string")
        @throwTypeError("onBeforeParse `symbol` must be a string");
    } else if (!callback || !@isCallable(callback))
      @throwTypeError("lmao callback must be a function");
    var { filter, namespace = "file" } = filterObject;
    if (!filter)
      @throwTypeError('Expected an object with "filter" RegExp');
    if (!@isRegExpObject(filter))
      @throwTypeError("filter must be a RegExp");
    if (namespace && typeof namespace !== "string")
      @throwTypeError("namespace must be a string");
    if ((namespace?.length ?? 0) === 0)
      namespace = "file";
    if (!/^([/@a-zA-Z0-9_\\-]+)$/.test(namespace))
      @throwTypeError("namespace can only contain $a-zA-Z0-9_\\-");
    var callbacks = map.@get(namespace);
    if (!callbacks)
      map.@set(namespace, [isOnBeforeParse ? [filter, callback, symbol, external] : [filter, callback]]);
    else
      @arrayPush(callbacks, isOnBeforeParse ? [filter, callback, symbol, external] : [filter, callback]);
  }
  function onLoad(filterObject, callback) {
    return validate(filterObject, callback, onLoadPlugins, @undefined, @undefined), this;
  }
  function onResolve(filterObject, callback) {
    return validate(filterObject, callback, onResolvePlugins, @undefined, @undefined), this;
  }
  function onBeforeParse(filterObject, { napiModule, external, symbol }) {
    return validate(filterObject, napiModule, onBeforeParsePlugins, symbol, external), this;
  }
  let self = this;
  function onStart(callback) {
    if (isBake)
      @throwTypeError("onStart() is not supported in Bake yet");
    if (!@isCallable(callback))
      @throwTypeError("callback must be a function");
    let ret = callback();
    if (@isPromise(ret)) {
      if ((@getPromiseInternalField(ret, @promiseFieldFlags) & @promiseStateMask) != @promiseStateFulfilled)
        self.promises ??= [], self.promises.push(ret);
    }
    return this;
  }
  function onEnd(callback) {
    if (!@isCallable(callback))
      throw @makeErrorWithCode(119, "callback", "function", callback);
    if (!self.onEndCallbacks)
      self.onEndCallbacks = [];
    return @arrayPush(self.onEndCallbacks, callback), this;
  }
  let processSetupResult = () => {
    var anyOnLoad = !1, anyOnResolve = !1;
    for (let [namespace, callbacks] of onLoadPlugins.entries())
      for (var [filter] of callbacks)
        this.addFilter(filter, namespace, 1), anyOnLoad = !0;
    for (let [namespace, callbacks] of onResolvePlugins.entries())
      for (var [filter] of callbacks)
        this.addFilter(filter, namespace, 0), anyOnResolve = !0;
    for (let [namespace, callbacks] of onBeforeParsePlugins.entries())
      for (let [filter2, addon, symbol, external] of callbacks)
        this.onBeforeParse(filter2, namespace, addon, symbol, external);
    if (anyOnResolve) {
      var onResolveObject = this.onResolve;
      if (!onResolveObject)
        this.onResolve = onResolvePlugins;
      else
        for (let [namespace, callbacks] of onResolvePlugins.entries()) {
          var existing = onResolveObject.@get(namespace);
          if (!existing)
            onResolveObject.@set(namespace, callbacks);
          else
            onResolveObject.@set(namespace, existing.concat(callbacks));
        }
    }
    if (anyOnLoad) {
      var onLoadObject = this.onLoad;
      if (!onLoadObject)
        this.onLoad = onLoadPlugins;
      else
        for (let [namespace, callbacks] of onLoadPlugins.entries()) {
          var existing = onLoadObject.@get(namespace);
          if (!existing)
            onLoadObject.@set(namespace, callbacks);
          else
            onLoadObject.@set(namespace, existing.concat(callbacks));
        }
    }
    if (is_last)
      this.promises = @undefined;
    return this.promises;
  };
  var setupResult = setup({
    config,
    onDispose: () => void @throwTypeError("On-dispose callbacks is not implemented yet. See https://github.com/oven-sh/bun/issues/2771"),
    onEnd,
    onLoad,
    onResolve,
    onBeforeParse,
    onStart,
    resolve: () => void @throwTypeError("build.resolve() is not implemented yet. See https://github.com/oven-sh/bun/issues/2771"),
    module: () => {
      @throwTypeError("module() is not supported in Bun.build() yet. Only via Bun.plugin() at runtime");
    },
    addPreload: () => {
      @throwTypeError("addPreload() is not supported in Bun.build() yet.");
    },
    initialOptions: {
      ...config,
      bundle: !0,
      entryPoints: config.entrypoints ?? config.entryPoints ?? [],
      minify: typeof config.minify === "boolean" ? config.minify : !1,
      minifyIdentifiers: config.minify === !0 || config.minify?.identifiers,
      minifyWhitespace: config.minify === !0 || config.minify?.whitespace,
      minifySyntax: config.minify === !0 || config.minify?.syntax,
      outbase: config.root,
      platform: config.target === "bun" ? "node" : config.target
    },
    esbuild: {}
  });
  if (setupResult && @isPromise(setupResult))
    if (@getPromiseInternalField(setupResult, @promiseFieldFlags) & @promiseStateFulfilled)
      setupResult = @getPromiseInternalField(setupResult, @promiseFieldReactionsOrResult);
    else
      return setupResult.@then(() => {
        if (is_last && self.promises !== @undefined && self.promises.length > 0)
          return @Promise.all(self.promises).@then(processSetupResult);
        return processSetupResult();
      });
  if (is_last && this.promises !== @undefined && this.promises.length > 0)
    return @Promise.all(this.promises).@then(processSetupResult);
  return processSetupResult();
})
(function () {"use strict";
  let highWaterMark = @getByIdDirectPrivate(this, "highWaterMark");
  if (highWaterMark === @undefined)
    @throwTypeError("ByteLengthQueuingStrategy.highWaterMark getter called on incompatible |this| value.");
  return highWaterMark;
})
(function (parameters) {"use strict";
  @putByIdDirectPrivate(this, "highWaterMark", @extractHighWaterMarkFromQueuingStrategyInit(parameters));
})
(function (chunk) {"use strict";
  return chunk.byteLength;
})
(function () {"use strict";
  var moduleMap = /* @__PURE__ */ new Map, inner = {
    [Symbol.for("nodejs.util.inspect.custom")]() {
      return { ...proxy };
    }
  }, proxy = new Proxy(inner, {
    get(_target, key) {
      let entry = @requireMap.@get(key);
      if (entry)
        return entry;
      let namespace = @esmNamespaceForCjs(key);
      if (namespace !== @undefined) {
        let mod = @createCommonJSModule(key, namespace, !0, @undefined);
        return @requireMap.@set(key, mod), mod;
      }
      return inner[key];
    },
    set(_target, key, value) {
      return @requireMap.@set(key, value), !0;
    },
    has(_target, key) {
      return @requireMap.@has(key) || @esmNamespaceForCjs(key) !== @undefined;
    },
    deleteProperty(_target, key) {
      return moduleMap.@delete(key), @requireMap.@delete(key), @esmRegistryDelete(key), @evictIsolationSourceProviderCache(key), !0;
    },
    ownKeys(_target) {
      var array = [...@requireMap.@keys()];
      for (let key of @esmRegistryEvaluatedKeys())
        if (!array.includes(key))
          @arrayPush(array, key);
      return array;
    },
    getPrototypeOf(_target) {
      return null;
    },
    getOwnPropertyDescriptor(_target, key) {
      if (@requireMap.@has(key) || @esmNamespaceForCjs(key) !== @undefined)
        return {
          configurable: !0,
          enumerable: !0
        };
    }
  });
  return proxy;
})
(function (onMutate) {"use strict";
  let wrapper = ["(function(exports,require,module,__filename,__dirname){", "})"];
  return new Proxy(wrapper, {
    set(_target, prop, value, receiver) {
      return Reflect.set(wrapper, prop, value, receiver), onMutate(wrapper[0], wrapper[1]), !0;
    },
    defineProperty(_target, prop, descriptor) {
      return Reflect.defineProperty(wrapper, prop, descriptor), onMutate(wrapper[0], wrapper[1]), !0;
    },
    deleteProperty(_target, prop) {
      return Reflect.deleteProperty(wrapper, prop), onMutate(wrapper[0], wrapper[1]), !0;
    }
  });
})
(function (id, parent) {"use strict";
  let module = @createCommonJSModule(id, {}, !0, parent);
  return process.dlopen(module, id), @requireMap.@set(id, module), module.exports;
})
(function (resolvedSpecifier) {"use strict";
  return @esmLoadSync(resolvedSpecifier);
})
(function () {"use strict";
  return @requireMap.@get(Bun.main);
})
(function (originalId, options) {"use strict";
  let id = @resolveSync(originalId, this.filename, !1, !1, options ? options.paths : @undefined);
  if (id.startsWith("node:")) {
    if (id !== originalId) {
      let existing = @requireMap.@get(originalId);
      if (existing) {
        let c2 = @evaluateCommonJSModule(existing, this);
        if (c2 && c2.indexOf(existing) === -1)
          c2.push(existing);
        return existing.exports;
      }
    }
    return this.@requireNativeModule(id);
  } else {
    let existing = @requireMap.@get(id);
    if (existing) {
      let c2 = @evaluateCommonJSModule(existing, this);
      if (c2 && c2.indexOf(existing) === -1)
        c2.push(existing);
      return existing.exports;
    }
  }
  if (id.endsWith(".node"))
    return @internalRequire(id, this);
  if (id === "bun:test")
    return Bun.jest(this.filename);
  let mod = @createCommonJSModule(id, {}, !1, this);
  @requireMap.@set(id, mod);
  var out = this.@require(id, mod, @argumentCount(), @argument(1));
  if (out === -1) {
    try {
      out = @requireESM(id);
    } catch (exception) {
      throw @requireMap.@delete(id), exception;
    }
    let namespace = @esmNamespaceForCjs(id);
    if (namespace !== @undefined) {
      if (namespace.__esModule === @undefined)
        try {
          namespace.__esModule = !0;
        } catch {}
      return mod.exports = namespace["module.exports"] ?? namespace;
    }
  }
  let c = @evaluateCommonJSModule(mod, this);
  if (c && c.indexOf(mod) === -1)
    c.push(mod);
  return mod.exports;
})
(function (_) {"use strict";
  return @overridableRequire.@apply(this, arguments);
})
(function (resolved) {"use strict";
  var exports = @esmNamespaceForCjs(resolved);
  if (exports === @undefined)
    exports = @loadEsmIntoCjs(resolved);
  if (exports === @undefined)
    @throwTypeError(`require() failed to evaluate module "${resolved}". This is an internal consistentency error.`);
  return exports;
})
(function (id) {"use strict";
  try {
    @requireESM(id);
  } catch (exception) {
    throw @requireMap.@delete(id), exception;
  }
  let namespace = @esmNamespaceForCjs(id);
  if (namespace !== @undefined) {
    if (namespace.__esModule === @undefined)
      try {
        namespace.__esModule = !0;
      } catch {}
    this.exports = namespace["module.exports"] ?? namespace;
    return;
  }
})
(function (id, options) {"use strict";
  return @resolveSync(id, typeof this === "string" ? this : this?.filename ?? this?.id ?? "", !1, !0, options ? options.paths : @undefined);
})
(function (format) {"use strict";
  let zlib = @getInternalField(@internalModuleRegistry, 131) || @createInternalModuleById(131), stream = @getInternalField(@internalModuleRegistry, 117) || @createInternalModuleById(117), builders = {
    deflate: zlib.createDeflate,
    "deflate-raw": zlib.createDeflateRaw,
    gzip: zlib.createGzip,
    brotli: zlib.createBrotliCompress,
    zstd: zlib.createZstdCompress
  };
  if (!(format in builders))
    throw @makeErrorWithCode(120, "format", format, "must be one of: " + Object.keys(builders).join(", "));
  let handle = builders[format]();
  return @putByIdDirectPrivate(this, "readable", stream.Readable.toWeb(handle)), @putByIdDirectPrivate(this, "writable", stream.Writable.toWeb(handle)), this;
})
(function () {"use strict";
  if (!@inherits(5, this))
    throw @makeGetterTypeError("CompressionStream", "readable");
  return @getByIdDirectPrivate(this, "readable");
})
(function () {"use strict";
  if (!@inherits(5, this))
    throw @makeGetterTypeError("CompressionStream", "writable");
  return @getByIdDirectPrivate(this, "writable");
})
(function () {"use strict";
  var stream = Bun.stdin.stream(), decoder = new TextDecoder("utf-8", { fatal: !1 }), indexOf = Bun.indexOfLine, actualChunk, i = -1, idx, last, done, value, value_len, pendingChunk;
  async function* ConsoleAsyncIterator() {
    var reader = stream.getReader(), deferredError;
    try {
      if (i !== -1) {
        last = i + 1, i = indexOf(actualChunk, last);
        while (i !== -1)
          yield decoder.decode(actualChunk.subarray(last, i)), last = i + 1, i = indexOf(actualChunk, last);
        for (idx++;idx < value_len; idx++) {
          if (actualChunk = value[idx], pendingChunk)
            actualChunk = @Buffer.concat([pendingChunk, actualChunk]), pendingChunk = @undefined;
          last = 0, i = indexOf(actualChunk, last);
          while (i !== -1)
            yield decoder.decode(actualChunk.subarray(last, actualChunk[i - 1] === 13 ? i - 1 : i)), last = i + 1, i = indexOf(actualChunk, last);
          i = -1, pendingChunk = actualChunk.subarray(last);
        }
        actualChunk = @undefined;
      }
      while (!0) {
        let firstResult = reader.readMany();
        if (@isPromise(firstResult))
          ({ done, value } = await firstResult);
        else
          ({ done, value } = firstResult);
        if (done) {
          if (pendingChunk)
            yield decoder.decode(pendingChunk);
          return;
        }
        for (idx = 0, value_len = value.length;idx < value_len; idx++) {
          if (actualChunk = value[idx], pendingChunk)
            actualChunk = @Buffer.concat([pendingChunk, actualChunk]), pendingChunk = @undefined;
          last = 0, i = indexOf(actualChunk, last);
          while (i !== -1)
            yield decoder.decode(actualChunk.subarray(last, actualChunk[i - 1] === 13 ? i - 1 : i)), last = i + 1, i = indexOf(actualChunk, last);
          i = -1, pendingChunk = actualChunk.subarray(last);
        }
        actualChunk = @undefined;
      }
    } catch (e) {
      deferredError = e;
    } finally {
      reader.releaseLock();
    }
    if (deferredError)
      throw deferredError;
  }
  let symbol = globalThis.Symbol.asyncIterator;
  return this[symbol] = ConsoleAsyncIterator, ConsoleAsyncIterator();
})
(function (console) {"use strict";
  let { inspect, formatWithOptions } = @getInternalField(@internalModuleRegistry, 126) || @createInternalModuleById(126), { isBuffer } = @getInternalField(@internalModuleRegistry, 141) || @createInternalModuleById(141), { validateObject, validateInteger, validateArray, validateOneOf } = @getInternalField(@internalModuleRegistry, 68) || @createInternalModuleById(68), kMaxGroupIndentation = 1000, StringPrototypeIncludes = @String.prototype.includes, RegExpPrototypeSymbolReplace = @RegExp.prototype[Symbol.replace], ArrayPrototypeUnshift = @Array.prototype.unshift, StringPrototypeRepeat = @String.prototype.repeat, StringPrototypeSlice = @String.prototype.slice, ObjectPrototypeHasOwnProperty = Object.prototype.hasOwnProperty, StringPrototypePadStart = @String.prototype.padStart, StringPrototypeSplit = @String.prototype.split, NumberPrototypeToFixed = Number.prototype.toFixed, ArrayPrototypeMap = @Array.prototype.map, ArrayPrototypeJoin = @Array.prototype.join, ArrayPrototypePush = @Array.prototype.push, kCounts = Symbol("counts"), kSecond = 1000, kMinute = 60000, kHour = 3600000, internalGetStringWidth = @lazy(20);
  var getStringWidth = function getStringWidth2(str, removeControlChars = !0) {
    return internalGetStringWidth(str, removeControlChars);
  };
  let tableChars = {
    middleMiddle: "\u2500",
    rowMiddle: "\u253C",
    topRight: "\u2510",
    topLeft: "\u250C",
    leftMiddle: "\u251C",
    topMiddle: "\u252C",
    bottomRight: "\u2518",
    bottomLeft: "\u2514",
    bottomMiddle: "\u2534",
    rightMiddle: "\u2524",
    left: "\u2502 ",
    right: " \u2502",
    middle: " \u2502 "
  }, renderRow = (row, columnWidths) => {
    let out = tableChars.left;
    for (let i = 0;i < row.length; i++) {
      let cell = row[i], len = getStringWidth(cell), needed = (columnWidths[i] - len) / 2;
      if (out += StringPrototypeRepeat.@call(" ", needed) + cell + StringPrototypeRepeat.@call(" ", Math.ceil(needed)), i !== row.length - 1)
        out += tableChars.middle;
    }
    return out += tableChars.right, out;
  }, table = (head, columns) => {
    let columnWidths = ArrayPrototypeMap.@call(head, (h) => getStringWidth(h)), longestColumn = Math.max(...ArrayPrototypeMap.@call(columns, (a) => a.length)), rows = @newArrayWithSize(longestColumn);
    for (let i = 0;i < head.length; i++) {
      let column = columns[i];
      for (let j = 0;j < longestColumn; j++) {
        if (rows[j] === @undefined)
          rows[j] = [];
        let value = rows[j][i] = ObjectPrototypeHasOwnProperty.@call(column, j) ? column[j] : "", width = columnWidths[i] || 0, counted = getStringWidth(value);
        columnWidths[i] = Math.max(width, counted);
      }
    }
    let divider = ArrayPrototypeMap.@call(columnWidths, (i) => StringPrototypeRepeat.@call(tableChars.middleMiddle, i + 2)), result = tableChars.topLeft + ArrayPrototypeJoin.@call(divider, tableChars.topMiddle) + tableChars.topRight + `
` + renderRow(head, columnWidths) + `
` + tableChars.leftMiddle + ArrayPrototypeJoin.@call(divider, tableChars.rowMiddle) + tableChars.rightMiddle + `
`;
    for (let row of rows)
      result += `${renderRow(row, columnWidths)}
`;
    return result += tableChars.bottomLeft + ArrayPrototypeJoin.@call(divider, tableChars.bottomMiddle) + tableChars.bottomRight, result;
  }, kGroupIndent = Symbol("kGroupIndent"), kGroupIndentationWidth = Symbol("kGroupIndentWidth"), kFormatForStderr = Symbol("kFormatForStderr"), kFormatForStdout = Symbol("kFormatForStdout"), kGetInspectOptions = Symbol("kGetInspectOptions"), kColorMode = Symbol("kColorMode"), kIsConsole = Symbol("kIsConsole"), kWriteToConsole = Symbol("kWriteToConsole"), kBindProperties = Symbol("kBindProperties"), kBindStreamsEager = Symbol("kBindStreamsEager"), kBindStreamsLazy = Symbol("kBindStreamsLazy"), kUseStdout = Symbol("kUseStdout"), kUseStderr = Symbol("kUseStderr"), optionsMap = /* @__PURE__ */ new WeakMap;
  function Console(options) {
    if (new.target === @undefined)
      return new Console(...arguments);
    if (!options || typeof options.write === "function")
      options = {
        stdout: options,
        stderr: arguments[1],
        ignoreErrors: arguments[2]
      };
    let {
      stdout,
      stderr = stdout,
      ignoreErrors = !0,
      colorMode = "auto",
      inspectOptions,
      groupIndentation
    } = options;
    if (!stdout || typeof stdout.write !== "function")
      throw @makeErrorWithCode(17, "stdout is not a writable stream");
    if (!stderr || typeof stderr.write !== "function")
      throw @makeErrorWithCode(17, "stderr is not a writable stream");
    if (validateOneOf(colorMode, "colorMode", ["auto", !0, !1]), groupIndentation !== @undefined)
      validateInteger(groupIndentation, "groupIndentation", 0, 1000);
    if (inspectOptions !== @undefined) {
      if (validateObject(inspectOptions, "options.inspectOptions"), inspectOptions.colors !== @undefined && options.colorMode !== @undefined)
        throw @makeErrorWithCode(116, 'Option "options.inspectOptions.color" cannot be used in combination with option "colorMode"');
      optionsMap.set(this, inspectOptions);
    }
    Object.keys(Console.prototype).forEach((key) => {
      this[key] = this[key].bind(this), Object.defineProperty(this[key], "name", {
        value: key
      });
    }), this[kBindStreamsEager](stdout, stderr), this[kBindProperties](ignoreErrors, colorMode, groupIndentation);
  }
  let consolePropAttributes = {
    writable: !0,
    enumerable: !1,
    configurable: !0
  };
  Object.defineProperty(Console, Symbol.hasInstance, {
    value(instance) {
      return instance[kIsConsole] || instance === console;
    }
  });
  let kColorInspectOptions = { colors: !0 }, kNoColorInspectOptions = {};
  Object.defineProperties(Console.prototype = {}, {
    [kBindStreamsEager]: {
      ...consolePropAttributes,
      value: function(stdout, stderr) {
        Object.defineProperties(this, {
          _stdout: { ...consolePropAttributes, value: stdout },
          _stderr: { ...consolePropAttributes, value: stderr }
        });
      }
    },
    [kBindStreamsLazy]: {
      ...consolePropAttributes,
      value: function(object) {
        let stdout, stderr;
        Object.defineProperties(this, {
          _stdout: {
            enumerable: !1,
            configurable: !0,
            get() {
              if (!stdout)
                stdout = object.stdout;
              return stdout;
            },
            set(value) {
              stdout = value;
            }
          },
          _stderr: {
            enumerable: !1,
            configurable: !0,
            get() {
              if (!stderr)
                stderr = object.stderr;
              return stderr;
            },
            set(value) {
              stderr = value;
            }
          }
        });
      }
    },
    [kBindProperties]: {
      ...consolePropAttributes,
      value: function(ignoreErrors, colorMode, groupIndentation = 2) {
        Object.defineProperties(this, {
          _stdoutErrorHandler: {
            ...consolePropAttributes,
            value: createWriteErrorHandler(this, kUseStdout)
          },
          _stderrErrorHandler: {
            ...consolePropAttributes,
            value: createWriteErrorHandler(this, kUseStderr)
          },
          _ignoreErrors: {
            ...consolePropAttributes,
            value: Boolean(ignoreErrors)
          },
          _times: { ...consolePropAttributes, value: /* @__PURE__ */ new Map },
          [kCounts]: { ...consolePropAttributes, value: /* @__PURE__ */ new Map },
          [kColorMode]: { ...consolePropAttributes, value: colorMode },
          [kIsConsole]: { ...consolePropAttributes, value: !0 },
          [kGroupIndent]: { ...consolePropAttributes, value: "" },
          [kGroupIndentationWidth]: {
            ...consolePropAttributes,
            value: groupIndentation
          },
          [Symbol.toStringTag]: {
            writable: !1,
            enumerable: !1,
            configurable: !0,
            value: "console"
          }
        });
      }
    },
    [kWriteToConsole]: {
      ...consolePropAttributes,
      value: function(streamSymbol, string) {
        let ignoreErrors = this._ignoreErrors, groupIndent = this[kGroupIndent], useStdout = streamSymbol === kUseStdout, stream = useStdout ? this._stdout : this._stderr, errorHandler = useStdout ? this._stdoutErrorHandler : this._stderrErrorHandler;
        if (groupIndent.length !== 0) {
          if (StringPrototypeIncludes.@call(string, `
`))
            string = RegExpPrototypeSymbolReplace.@call(/\n/g, string, `
${groupIndent}`);
          string = groupIndent + string;
        }
        if (string += `
`, ignoreErrors === !1)
          return stream.write(string);
        try {
          if (stream.listenerCount("error") === 0)
            stream.once("error", noop);
          stream.write(string, errorHandler);
        } catch (e) {
          if (e != null && typeof e === "object" && e.name === "RangeError" && e.message === "Maximum call stack size exceeded.")
            throw e;
        } finally {
          stream.removeListener("error", noop);
        }
      }
    },
    [kGetInspectOptions]: {
      ...consolePropAttributes,
      value: function(stream) {
        let color = this[kColorMode];
        if (color === "auto")
          if (Bun.env.FORCE_COLOR !== @undefined)
            color = Bun.enableANSIColors;
          else
            color = stream.isTTY && (typeof stream.getColorDepth === "function" ? stream.getColorDepth() > 2 : !0);
        let options = optionsMap.get(this);
        if (options) {
          if (options.colors === @undefined)
            options.colors = color;
          return options;
        }
        return color ? kColorInspectOptions : kNoColorInspectOptions;
      }
    },
    [kFormatForStdout]: {
      ...consolePropAttributes,
      value: function(args) {
        let opts = this[kGetInspectOptions](this._stdout);
        return formatWithOptions(opts, ...args);
      }
    },
    [kFormatForStderr]: {
      ...consolePropAttributes,
      value: function(args) {
        let opts = this[kGetInspectOptions](this._stderr);
        return formatWithOptions(opts, ...args);
      }
    }
  });
  function createWriteErrorHandler(instance, streamSymbol) {
    return (err) => {
      let stream = streamSymbol === kUseStdout ? instance._stdout : instance._stderr;
      if (err !== null && !stream._writableState.errorEmitted) {
        if (stream.listenerCount("error") === 0)
          stream.once("error", noop);
      }
    };
  }
  let consoleMethods = {
    log(...args) {
      this[kWriteToConsole](kUseStdout, this[kFormatForStdout](args));
    },
    warn(...args) {
      this[kWriteToConsole](kUseStderr, this[kFormatForStderr](args));
    },
    dir(object, options) {
      this[kWriteToConsole](kUseStdout, inspect(object, {
        customInspect: !1,
        ...this[kGetInspectOptions](this._stdout),
        ...options
      }));
    },
    time(label = "default") {
      if (label = `${label}`, this._times.has(label)) {
        process.emitWarning(`Label '${label}' already exists for console.time()`);
        return;
      }
      this._times.set(label, process.hrtime());
    },
    timeEnd(label = "default") {
      if (label = `${label}`, timeLogImpl(this, "timeEnd", label))
        this._times.delete(label);
    },
    timeLog(label = "default", ...data) {
      label = `${label}`, timeLogImpl(this, "timeLog", label, data);
    },
    trace: function trace(...args) {
      let err = {
        name: "Trace",
        message: this[kFormatForStderr](args)
      };
      Error.captureStackTrace(err, trace), this.error(err.stack);
    },
    assert(expression, ...args) {
      if (!expression)
        args[0] = `Assertion failed${args.length === 0 ? "" : `: ${args[0]}`}`, this.warn.@apply(this, args);
    },
    clear() {
      if (this._stdout.isTTY && Bun.env.TERM !== "dumb")
        this._stdout.write("\x1B[2J\x1B[3J\x1B[H");
    },
    count(label = "default") {
      label = `${label}`;
      let counts = this[kCounts], count = counts.get(label);
      if (count === @undefined)
        count = 1;
      else
        count++;
      counts.set(label, count), this.log(`${label}: ${count}`);
    },
    countReset(label = "default") {
      let counts = this[kCounts];
      if (!counts.has(label)) {
        process.emitWarning(`Count for '${label}' does not exist`);
        return;
      }
      counts.delete(`${label}`);
    },
    group(...data) {
      if (data.length > 0)
        this.log.@apply(this, data);
      this[kGroupIndent] += StringPrototypeRepeat.@call(" ", this[kGroupIndentationWidth]);
    },
    groupEnd() {
      this[kGroupIndent] = StringPrototypeSlice.@call(this[kGroupIndent], 0, this[kGroupIndent].length - this[kGroupIndentationWidth]);
    },
    table(tabularData, properties) {
      if (properties !== @undefined)
        validateArray(properties, "properties");
      if (tabularData === null || typeof tabularData !== "object")
        return this.log(tabularData);
      let final = (k, v) => this.log(table(k, v)), _inspect = (v) => {
        let opt = {
          depth: v !== null && typeof v === "object" && !isArray(v) && Object.keys(v).length > 2 ? -1 : 0,
          maxArrayLength: 3,
          breakLength: @Infinity,
          ...this[kGetInspectOptions](this._stdout)
        };
        return inspect(v, opt);
      }, getIndexArray = (length) => @Array.from({ length }, (_, i2) => _inspect(i2)), mapIter = @isMapIterator(tabularData), isKeyValue = !1, i = 0;
      if (isKeyValue || @isMap(tabularData)) {
        let keys2 = [], values2 = [], length = 0;
        if (mapIter)
          for (;i < tabularData.length / 2; ++i)
            ArrayPrototypePush.@call(keys2, _inspect(tabularData[i * 2])), ArrayPrototypePush.@call(values2, _inspect(tabularData[i * 2 + 1])), length++;
        else
          for (let { 0: k, 1: v } of tabularData)
            ArrayPrototypePush.@call(keys2, _inspect(k)), ArrayPrototypePush.@call(values2, _inspect(v)), length++;
        return final([iterKey, keyKey, valuesKey], [getIndexArray(length), keys2, values2]);
      }
      if (@isSetIterator(tabularData) || mapIter || @isSet(tabularData)) {
        let values2 = [], length = 0;
        for (let v of tabularData)
          ArrayPrototypePush.@call(values2, _inspect(v)), length++;
        return final([iterKey, valuesKey], [getIndexArray(length), values2]);
      }
      let map = Object.create(null), hasPrimitives = !1, valuesKeyArray = [], indexKeyArray = Object.keys(tabularData);
      for (;i < indexKeyArray.length; i++) {
        let item = tabularData[indexKeyArray[i]], primitive = item === null || typeof item !== "function" && typeof item !== "object";
        if (properties === @undefined && primitive)
          hasPrimitives = !0, valuesKeyArray[i] = _inspect(item);
        else {
          let keys2 = properties || Object.keys(item);
          for (let key of keys2)
            if (map[key] ??= [], primitive && properties || !ObjectPrototypeHasOwnProperty.@call(item, key))
              map[key][i] = "";
            else
              map[key][i] = _inspect(item[key]);
        }
      }
      let keys = Object.keys(map), values = Object.values(map);
      if (hasPrimitives)
        ArrayPrototypePush.@call(keys, valuesKey), ArrayPrototypePush.@call(values, valuesKeyArray);
      return ArrayPrototypeUnshift.@call(keys, indexKey), ArrayPrototypeUnshift.@call(values, indexKeyArray), final(keys, values);
    }
  };
  function timeLogImpl(self, name, label, data) {
    let time = self._times.get(label);
    if (time === @undefined)
      return process.emitWarning(`No such label '${label}' for console.${name}()`), !1;
    let duration = process.hrtime(time), ms = duration[0] * 1000 + duration[1] / 1e6, formatted = formatTime(ms);
    if (data === @undefined)
      self.log("%s: %s", label, formatted);
    else
      self.log("%s: %s", label, formatted, ...data);
    return !0;
  }
  function pad(value) {
    return StringPrototypePadStart.@call(`${value}`, 2, "0");
  }
  function formatTime(ms) {
    let hours = 0, minutes = 0, seconds = 0;
    if (ms >= 1000) {
      if (ms >= 60000) {
        if (ms >= 3600000)
          hours = Math.floor(ms / 3600000), ms = ms % 3600000;
        minutes = Math.floor(ms / 60000), ms = ms % 60000;
      }
      seconds = ms / 1000;
    }
    if (hours !== 0 || minutes !== 0)
      return { 0: seconds, 1: ms } = StringPrototypeSplit.@call(NumberPrototypeToFixed.@call(seconds, 3), "."), `${hours !== 0 ? `${hours}:${pad(minutes)}` : minutes}:${pad(seconds)}.${ms} (${hours !== 0 ? "h:m" : ""}m:ss.mmm)`;
    if (seconds !== 0)
      return `${NumberPrototypeToFixed.@call(seconds, 3)}s`;
    return `${Number(NumberPrototypeToFixed.@call(ms, 3))}ms`;
  }
  let keyKey = "Key", valuesKey = "Values", indexKey = "(index)", iterKey = "(iteration index)", isArray = (v) => @isJSArray(v) || @isTypedArrayView(v) || isBuffer(v);
  function noop() {}
  for (let method of Reflect.ownKeys(consoleMethods))
    Console.prototype[method] = consoleMethods[method];
  return Console.prototype.debug = Console.prototype.log, Console.prototype.info = Console.prototype.log, Console.prototype.dirxml = Console.prototype.log, Console.prototype.error = Console.prototype.warn, Console.prototype.groupCollapsed = Console.prototype.group, Console;
})
(function (input) {"use strict";
  var writer = @getByIdDirectPrivate(this, "writer");
  if (!writer) {
    var length = @toLength(input?.length ?? 0);
    writer = Bun.stdout.writer({ highWaterMark: length > 65536 ? length : 65536 }), @putByIdDirectPrivate(this, "writer", writer);
  }
  var wrote = writer.write(input);
  let count = @argumentCount();
  for (var i = 1;i < count; i++)
    wrote += writer.write(arguments[i]);
  return writer.flush(!0), wrote;
})
(function () {"use strict";
  let highWaterMark = @getByIdDirectPrivate(this, "highWaterMark");
  if (highWaterMark === @undefined)
    @throwTypeError("CountQueuingStrategy.highWaterMark getter called on incompatible |this| value.");
  return highWaterMark;
})
(function (parameters) {"use strict";
  @putByIdDirectPrivate(this, "highWaterMark", @extractHighWaterMarkFromQueuingStrategyInit(parameters));
})
(function () {"use strict";
  return 1;
})
(function (format) {"use strict";
  let zlib = @getInternalField(@internalModuleRegistry, 131) || @createInternalModuleById(131), stream = @getInternalField(@internalModuleRegistry, 117) || @createInternalModuleById(117), builders = {
    deflate: zlib.createInflate,
    "deflate-raw": zlib.createInflateRaw,
    gzip: zlib.createGunzip,
    brotli: zlib.createBrotliDecompress,
    zstd: zlib.createZstdDecompress
  };
  if (!(format in builders))
    throw @makeErrorWithCode(120, "format", format, "must be one of: " + Object.keys(builders).join(", "));
  let handle = builders[format]();
  return @putByIdDirectPrivate(this, "readable", stream.Readable.toWeb(handle)), @putByIdDirectPrivate(this, "writable", stream.Writable.toWeb(handle)), this;
})
(function () {"use strict";
  if (!@inherits(6, this))
    throw @makeGetterTypeError("DecompressionStream", "readable");
  return @getByIdDirectPrivate(this, "readable");
})
(function () {"use strict";
  if (!@inherits(6, this))
    throw @makeGetterTypeError("DecompressionStream", "writable");
  return @getByIdDirectPrivate(this, "writable");
})
(function (opts) {"use strict";
  let valuesPromise = this.@pull(opts);
  async function* iter() {
    yield* await valuesPromise || [];
  }
  return iter();
})
(function (opts) {"use strict";
  let arr = this.@resolveSync(opts) || [];
  function* iter() {
    yield* arr;
  }
  return iter();
})
(function () {"use strict";
  return this.path === Bun.main && Bun.isMainThread;
})
(function (target, serialized, fd) {"use strict";
  let emit = @lazy(163), net = @getInternalField(@internalModuleRegistry, 104) || @createInternalModuleById(104);
  switch (serialized.type) {
    case "net.Server": {
      let server = new net.Server;
      server.listen({ fd }, () => {
        emit(target, serialized.message, server);
      });
      return;
    }
    case "net.Socket":
      throw Error("TODO case net.Socket");
    case "dgram.Socket":
      throw Error("TODO case dgram.Socket");
    default:
      throw Error("failed to parse handle");
  }
})
(function (_message, _handle, _options) {"use strict";
  return null;
})
(function (value, encodingOrOffset, length) {"use strict";
  if (typeof value === "string")
    return new @Buffer(value, encodingOrOffset);
  if (typeof value === "object" && value !== null) {
    if (@inherits(4, value))
      return new @Buffer(value, encodingOrOffset, length);
    if (@isTypedArrayView(value))
      return new @Buffer(value, encodingOrOffset, length);
    let valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value && (typeof valueOf === "string" || typeof valueOf === "object"))
      return @Buffer.from(valueOf, encodingOrOffset, length);
    if (value.length !== @undefined || @inherits(4, value.buffer)) {
      if (typeof value.length !== "number")
        return new @Buffer(0);
      if (value.length <= 0)
        return new @Buffer(0);
      return new @Buffer(value);
    }
    let { type, data } = value;
    if (type === "Buffer" && @isArray(data)) {
      if (data.length <= 0)
        return new @Buffer(0);
      return new @Buffer(data);
    }
    let toPrimitive = @tryGetByIdWithWellKnownSymbol(value, "toPrimitive");
    if (typeof toPrimitive === "function") {
      let primitive = toPrimitive.@call(value, "string");
      if (typeof primitive === "string")
        return new @Buffer(primitive, encodingOrOffset);
    }
  }
  throw @makeErrorWithCode(119, "first argument", ["string", "Buffer", "ArrayBuffer", "Array", "Array-like Object"], value);
})
(function (bufferlike) {"use strict";
  return bufferlike instanceof @Buffer;
})
(function () {"use strict";
  return @isObject(this) && this instanceof @Buffer ? this.byteOffset : @undefined;
})
(function () {"use strict";
  return @isObject(this) && this instanceof @Buffer ? this.buffer : @undefined;
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 7] === @undefined)
    @checkBufferRead(this, offset, 8);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getBigInt64(offset, !1);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 7] === @undefined)
    @checkBufferRead(this, offset, 8);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getBigInt64(offset, !0);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 7] === @undefined)
    @checkBufferRead(this, offset, 8);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getBigUint64(offset, !1);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 7] === @undefined)
    @checkBufferRead(this, offset, 8);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getBigUint64(offset, !0);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 7] === @undefined)
    @checkBufferRead(this, offset, 8);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getFloat64(offset, !1);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 7] === @undefined)
    @checkBufferRead(this, offset, 8);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getFloat64(offset, !0);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 3] === @undefined)
    @checkBufferRead(this, offset, 4);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getFloat32(offset, !1);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 3] === @undefined)
    @checkBufferRead(this, offset, 4);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getFloat32(offset, !0);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 1] === @undefined)
    @checkBufferRead(this, offset, 2);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getInt16(offset, !1);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 1] === @undefined)
    @checkBufferRead(this, offset, 2);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getInt16(offset, !0);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 3] === @undefined)
    @checkBufferRead(this, offset, 4);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getInt32(offset, !1);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 3] === @undefined)
    @checkBufferRead(this, offset, 4);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getInt32(offset, !0);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined)
    @checkBufferRead(this, offset, 1);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getInt8(offset);
})
(function (offset, byteLength) {"use strict";
  if (offset === @undefined)
    throw @makeErrorWithCode(119, "offset", "number", offset);
  if (typeof byteLength !== "number")
    throw @makeErrorWithCode(119, "byteLength", "number", byteLength);
  let view = this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength);
  switch (byteLength) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6: {
      if (typeof offset !== "number" || (offset | 0) !== offset)
        (@getInternalField(@internalModuleRegistry, 68) || @createInternalModuleById(68)).validateInteger(offset, "offset");
      if (!(offset >= 0 && offset <= this.length - byteLength))
        (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).boundsError(offset, this.length - byteLength);
    }
  }
  switch (byteLength) {
    case 1:
      return view.getInt8(offset);
    case 2:
      return view.getInt16(offset, !1);
    case 3: {
      let val = view.getUint16(offset + 1, !1) + view.getUint8(offset) * 65536;
      return val | (val & 8388608) * 510;
    }
    case 4:
      return view.getInt32(offset, !1);
    case 5: {
      let last = view.getUint8(offset);
      return (last | (last & 128) * 33554430) * 4294967296 + view.getUint32(offset + 1, !1);
    }
    case 6: {
      let last = view.getUint16(offset, !1);
      return (last | (last & 32768) * 131070) * 4294967296 + view.getUint32(offset + 2, !1);
    }
  }
  (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).boundsError(byteLength, 6, "byteLength");
})
(function (offset, byteLength) {"use strict";
  if (offset === @undefined)
    throw @makeErrorWithCode(119, "offset", "number", offset);
  if (typeof byteLength !== "number")
    throw @makeErrorWithCode(119, "byteLength", "number", byteLength);
  let view = this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength);
  switch (byteLength) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6: {
      if (typeof offset !== "number" || (offset | 0) !== offset)
        (@getInternalField(@internalModuleRegistry, 68) || @createInternalModuleById(68)).validateInteger(offset, "offset");
      if (!(offset >= 0 && offset <= this.length - byteLength))
        (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).boundsError(offset, this.length - byteLength);
    }
  }
  switch (byteLength) {
    case 1:
      return view.getInt8(offset);
    case 2:
      return view.getInt16(offset, !0);
    case 3: {
      let val = view.getUint16(offset, !0) + view.getUint8(offset + 2) * 65536;
      return val | (val & 8388608) * 510;
    }
    case 4:
      return view.getInt32(offset, !0);
    case 5: {
      let last = view.getUint8(offset + 4);
      return (last | (last & 128) * 33554430) * 4294967296 + view.getUint32(offset, !0);
    }
    case 6: {
      let last = view.getUint16(offset + 4, !0);
      return (last | (last & 32768) * 131070) * 4294967296 + view.getUint32(offset, !0);
    }
  }
  (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).boundsError(byteLength, 6, "byteLength");
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 1] === @undefined)
    @checkBufferRead(this, offset, 2);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getUint16(offset, !1);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 1] === @undefined)
    @checkBufferRead(this, offset, 2);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getUint16(offset, !0);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 3] === @undefined)
    @checkBufferRead(this, offset, 4);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getUint32(offset, !1);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined || this[offset + 3] === @undefined)
    @checkBufferRead(this, offset, 4);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getUint32(offset, !0);
})
(function (offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (typeof offset !== "number" || this[offset] === @undefined)
    @checkBufferRead(this, offset, 1);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).getUint8(offset);
})
(function (offset, byteLength) {"use strict";
  if (offset === @undefined)
    throw @makeErrorWithCode(119, "offset", "number", offset);
  if (typeof byteLength !== "number")
    throw @makeErrorWithCode(119, "byteLength", "number", byteLength);
  let view = this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength);
  switch (byteLength) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6: {
      if (typeof offset !== "number" || (offset | 0) !== offset)
        (@getInternalField(@internalModuleRegistry, 68) || @createInternalModuleById(68)).validateInteger(offset, "offset");
      if (!(offset >= 0 && offset <= this.length - byteLength))
        (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).boundsError(offset, this.length - byteLength);
    }
  }
  switch (byteLength) {
    case 1:
      return view.getUint8(offset);
    case 2:
      return view.getUint16(offset, !1);
    case 3:
      return view.getUint16(offset + 1, !1) + view.getUint8(offset) * 65536;
    case 4:
      return view.getUint32(offset, !1);
    case 5:
      return view.getUint8(offset) * 4294967296 + view.getUint32(offset + 1, !1);
    case 6:
      return view.getUint16(offset, !1) * 4294967296 + view.getUint32(offset + 2, !1);
  }
  (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).boundsError(byteLength, 6, "byteLength");
})
(function (offset, byteLength) {"use strict";
  if (offset === @undefined)
    throw @makeErrorWithCode(119, "offset", "number", offset);
  if (typeof byteLength !== "number")
    throw @makeErrorWithCode(119, "byteLength", "number", byteLength);
  let view = this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength);
  switch (byteLength) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6: {
      if (typeof offset !== "number" || (offset | 0) !== offset)
        (@getInternalField(@internalModuleRegistry, 68) || @createInternalModuleById(68)).validateInteger(offset, "offset");
      if (!(offset >= 0 && offset <= this.length - byteLength))
        (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).boundsError(offset, this.length - byteLength);
    }
  }
  switch (byteLength) {
    case 1:
      return view.getUint8(offset);
    case 2:
      return view.getUint16(offset, !0);
    case 3:
      return view.getUint16(offset, !0) + view.getUint8(offset + 2) * 65536;
    case 4:
      return view.getUint32(offset, !0);
    case 5:
      return view.getUint8(offset + 4) * 4294967296 + view.getUint32(offset, !0);
    case 6:
      return view.getUint16(offset + 4, !0) * 4294967296 + view.getUint32(offset, !0);
  }
  (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).boundsError(byteLength, 6, "byteLength");
})
(function (offset, value, le) {"use strict";
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setBigUint64(offset, value, le);
})
(function () {"use strict";
  return { type: "Buffer", data: @Array.from(this) };
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (value = +value, typeof offset !== "number" || this[offset] === @undefined || this[offset + 7] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkBounds(this, offset, 8);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setFloat64(offset, value, !1), offset + 8;
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (value = +value, typeof offset !== "number" || this[offset] === @undefined || this[offset + 7] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkBounds(this, offset, 8);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setFloat64(offset, value, !0), offset + 8;
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (value = +value, typeof offset !== "number" || this[offset] === @undefined || this[offset + 3] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkBounds(this, offset, 4);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setFloat32(offset, value, !1), offset + 4;
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  if (value = +value, typeof offset !== "number" || this[offset] === @undefined || this[offset + 3] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkBounds(this, offset, 4);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setFloat32(offset, value, !0), offset + 4;
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  value = +value;
  let min = -32768, max = 32767;
  if (typeof offset !== "number" || value < min || value > max || this[offset] === @undefined || this[offset + 1] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkInt(this, value, offset, min, max, 2);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setInt16(offset, value, !1), offset + 2;
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  value = +value;
  let min = -32768, max = 32767;
  if (typeof offset !== "number" || value < min || value > max || this[offset] === @undefined || this[offset + 1] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkInt(this, value, offset, min, max, 2);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setInt16(offset, value, !0), offset + 2;
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  value = +value;
  let min = -2147483648, max = 2147483647;
  if (typeof offset !== "number" || value < min || value > max || this[offset] === @undefined || this[offset + 3] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkInt(this, value, offset, min, max, 4);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setInt32(offset, value, !1), offset + 4;
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  value = +value;
  let min = -2147483648, max = 2147483647;
  if (typeof offset !== "number" || value < min || value > max || this[offset] === @undefined || this[offset + 3] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkInt(this, value, offset, min, max, 4);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setInt32(offset, value, !0), offset + 4;
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  value = +value;
  let min = -128, max = 127;
  if (typeof offset !== "number" || value < min || value > max || this[offset] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).writeU_Int8(this, value, offset, min, max);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setInt8(offset, value), offset + 1;
})
(function (value, offset, byteLength) {"use strict";
  let view = this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength);
  switch (value = +value, byteLength) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6: {
      let max = 2 ** (8 * byteLength - 1) - 1;
      (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkInt(this, value, offset, -max - 1, max, byteLength);
      break;
    }
    default: {
      (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).boundsError(byteLength, 6, "byteLength");
      break;
    }
  }
  switch (byteLength) {
    case 1: {
      view.setInt8(offset, value);
      break;
    }
    case 2: {
      view.setInt16(offset, value, !1);
      break;
    }
    case 3: {
      view.setUint16(offset + 1, value & 65535, !1), view.setInt8(offset, Math.floor(value * 0.0000152587890625));
      break;
    }
    case 4: {
      view.setInt32(offset, value, !1);
      break;
    }
    case 5: {
      view.setUint32(offset + 1, value | 0, !1), view.setInt8(offset, Math.floor(value * 0.00000000023283064365386963));
      break;
    }
    case 6: {
      view.setUint32(offset + 2, value | 0, !1), view.setInt16(offset, Math.floor(value * 0.00000000023283064365386963), !1);
      break;
    }
  }
  return offset + byteLength;
})
(function (value, offset, byteLength) {"use strict";
  let view = this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength);
  switch (value = +value, byteLength) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6: {
      let max = 2 ** (8 * byteLength - 1) - 1;
      (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkInt(this, value, offset, -max - 1, max, byteLength);
      break;
    }
    default: {
      (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).boundsError(byteLength, 6, "byteLength");
      break;
    }
  }
  switch (byteLength) {
    case 1: {
      view.setInt8(offset, value);
      break;
    }
    case 2: {
      view.setInt16(offset, value, !0);
      break;
    }
    case 3: {
      view.setUint16(offset, value & 65535, !0), view.setInt8(offset + 2, Math.floor(value * 0.0000152587890625));
      break;
    }
    case 4: {
      view.setInt32(offset, value, !0);
      break;
    }
    case 5: {
      view.setUint32(offset, value | 0, !0), view.setInt8(offset + 4, Math.floor(value * 0.00000000023283064365386963));
      break;
    }
    case 6: {
      view.setUint32(offset, value | 0, !0), view.setInt16(offset + 4, Math.floor(value * 0.00000000023283064365386963), !0);
      break;
    }
  }
  return offset + byteLength;
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  value = +value;
  let min = 0, max = 65535;
  if (typeof offset !== "number" || value < min || value > max || this[offset] === @undefined || this[offset + 1] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkInt(this, value, offset, min, max, 2);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setUint16(offset, value, !1), offset + 2;
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  value = +value;
  let min = 0, max = 65535;
  if (typeof offset !== "number" || value < min || value > max || this[offset] === @undefined || this[offset + 1] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkInt(this, value, offset, min, max, 2);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setUint16(offset, value, !0), offset + 2;
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  value = +value;
  let min = 0, max = 4294967295;
  if (typeof offset !== "number" || value < min || value > max || this[offset] === @undefined || this[offset + 3] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkInt(this, value, offset, min, max, 4);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setUint32(offset, value, !1), offset + 4;
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  value = +value;
  let min = 0, max = 4294967295;
  if (typeof offset !== "number" || value < min || value > max || this[offset] === @undefined || this[offset + 3] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkInt(this, value, offset, min, max, 4);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setUint32(offset, value, !0), offset + 4;
})
(function (value, offset) {"use strict";
  if (offset === @undefined)
    offset = 0;
  value = +value;
  let min = 0, max = 255;
  if (typeof offset !== "number" || value < min || value > max || this[offset] === @undefined)
    (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).writeU_Int8(this, value, offset, min, max);
  return (this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength)).setUint8(offset, value), offset + 1;
})
(function (value, offset, byteLength) {"use strict";
  let view = this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength);
  switch (value = +value, byteLength) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6: {
      (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkInt(this, value, offset, 0, 2 ** (8 * byteLength) - 1, byteLength);
      break;
    }
    default: {
      (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).boundsError(byteLength, 6, "byteLength");
      break;
    }
  }
  switch (byteLength) {
    case 1: {
      view.setUint8(offset, value);
      break;
    }
    case 2: {
      view.setUint16(offset, value, !1);
      break;
    }
    case 3: {
      view.setUint16(offset + 1, value & 65535, !1), view.setUint8(offset, Math.floor(value * 0.0000152587890625));
      break;
    }
    case 4: {
      view.setUint32(offset, value, !1);
      break;
    }
    case 5: {
      view.setUint32(offset + 1, value | 0, !1), view.setUint8(offset, Math.floor(value * 0.00000000023283064365386963));
      break;
    }
    case 6: {
      view.setUint32(offset + 2, value | 0, !1), view.setUint16(offset, Math.floor(value * 0.00000000023283064365386963), !1);
      break;
    }
  }
  return offset + byteLength;
})
(function (value, offset, byteLength) {"use strict";
  let view = this.@dataView ||= new DataView(this.buffer, this.byteOffset, this.byteLength);
  switch (value = +value, byteLength) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6: {
      (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).checkInt(this, value, offset, 0, 2 ** (8 * byteLength) - 1, byteLength);
      break;
    }
    default: {
      (@getInternalField(@internalModuleRegistry, 8) || @createInternalModuleById(8)).boundsError(byteLength, 6, "byteLength");
      break;
    }
  }
  switch (byteLength) {
    case 1: {
      view.setUint8(offset, value);
      break;
    }
    case 2: {
      view.setUint16(offset, value, !0);
      break;
    }
    case 3: {
      view.setUint16(offset, value & 65535, !0), view.setUint8(offset + 2, Math.floor(value * 0.0000152587890625));
      break;
    }
    case 4: {
      view.setUint32(offset, value, !0);
      break;
    }
    case 5: {
      view.setUint32(offset, value | 0, !0), view.setUint8(offset + 4, Math.floor(value * 0.00000000023283064365386963));
      break;
    }
    case 6: {
      view.setUint32(offset, value | 0, !0), view.setUint16(offset + 4, Math.floor(value * 0.00000000023283064365386963), !0);
      break;
    }
  }
  return offset + byteLength;
})
(function () {"use strict";
  let homeDir = process.env.USERPROFILE, nodePath = process.env.NODE_PATH, path = @getInternalField(@internalModuleRegistry, 107) || @createInternalModuleById(107), prefixDir = path.resolve(process.execPath, ".."), paths = [path.resolve(prefixDir, "lib", "node")];
  if (homeDir)
    paths.unshift(path.resolve(homeDir, ".node_libraries")), paths.unshift(path.resolve(homeDir, ".node_modules"));
  if (nodePath)
    paths.unshift(...nodePath.split(path.delimiter).filter(Boolean));
  let M = @getInternalField(@internalModuleRegistry, 147) || @createInternalModuleById(147);
  M.globalPaths = paths;
})
(function (promise) {"use strict";
  return @isPromise(promise) && @getPromiseInternalField(promise, @promiseFieldFlags) & @promiseStateMask ? @getPromiseInternalField(promise, @promiseFieldReactionsOrResult) : promise;
})
(function (promise) {"use strict";
  return ["pending", "fulfilled", "rejected"][@isPromise(promise) ? @getPromiseInternalField(promise, @promiseFieldFlags) & @promiseStateMask : 1];
})
(function () {"use strict";
  let EventEmitter = @getInternalField(@internalModuleRegistry, 96) || @createInternalModuleById(96), setRef = @lazy(164);
  return new class Control extends EventEmitter {
    constructor() {
      super();
    }
    ref() {
      setRef(!0);
    }
    unref() {
      setRef(!1);
    }
  };
})
(function (process, fd, isTTY, fdType) {"use strict";
  let native = Bun.stdin.stream(), source = native.@bunNativePtr;
  var reader, shouldDisown = !1;
  let needsInternalReadRefresh = !1, forceUnref = !1;
  function own() {
    if (reader ??= native.getReader(), source.updateRef(forceUnref ? !1 : !0), source?.setFlowing?.(!0), shouldDisown = !1, needsInternalReadRefresh)
      needsInternalReadRefresh = !1, internalRead(stream);
  }
  function disown() {
    if (source?.setFlowing?.(!1), reader)
      try {
        reader.releaseLock(), reader = @undefined;
      } catch (e) {
        shouldDisown = !0, source?.updateRef?.(!1);
      }
    else if (source)
      source.updateRef(!1);
  }
  let stream = new (isTTY ? (@getInternalField(@internalModuleRegistry, 124) || @createInternalModuleById(124)).ReadStream : (@getInternalField(@internalModuleRegistry, 98) || @createInternalModuleById(98)).ReadStream)(null, { fd, autoClose: !1 }), originalOn = stream.on, stream_destroyed = !1, stream_endEmitted = !1;
  if (stream.addListener = stream.on = function(event, listener) {
    if (event === "readable")
      own();
    return originalOn.@call(this, event, listener);
  }, stream.fd = fd, isTTY || fdType !== 0 /* file */)
    stream.ref = function() {
      return forceUnref = !1, own(), this;
    }, stream.unref = function() {
      return forceUnref = !0, source?.updateRef?.(!1), this;
    };
  let originalPause = stream.pause;
  stream.pause = function() {
    return originalPause.@call(this);
  };
  let originalResume = stream.resume;
  stream.resume = function() {
    return own(), originalResume.@call(this);
  };
  async function internalRead(stream2) {
    try {
      let { value } = await reader.read();
      if (value) {
        if (stream2.push(value), shouldDisown)
          disown();
      } else {
        if (!stream_endEmitted)
          stream_endEmitted = !0, stream2.emit("end");
        if (!stream_destroyed)
          stream_destroyed = !0, stream2.destroy(), disown();
      }
    } catch (err) {
      if (err?.code === "ERR_STREAM_RELEASE_LOCK") {
        triggerRead.@call(stream2, @undefined);
        return;
      }
      stream2.destroy(err);
    }
  }
  function triggerRead(_size) {
    if (reader && !shouldDisown)
      internalRead(this);
    else
      needsInternalReadRefresh = !0;
  }
  return stream._read = triggerRead, stream.on("resume", () => {
    if (stream.isPaused())
      return;
    own(), stream._undestroy(), stream_destroyed = !1;
  }), stream._readableState.reading = !1, stream.on("pause", () => {
    process.nextTick(() => {
      if (!stream.readableFlowing)
        stream._readableState.reading = !1, disown();
    });
  }), stream.on("close", () => {
    if (!stream_destroyed)
      stream_destroyed = !0, process.nextTick(() => {
        stream.destroy(), disown();
      });
  }), stream;
})
(function (process, fd, isTTY, fdType) {"use strict";
  let stream;
  if (isTTY)
    stream = new (@getInternalField(@internalModuleRegistry, 124) || @createInternalModuleById(124)).WriteStream(fd), stream.readable = !0, process.on("SIGWINCH", () => {
      stream._refreshSize();
    }), stream._type = "tty";
  else if (stream = new (@getInternalField(@internalModuleRegistry, 98) || @createInternalModuleById(98)).WriteStream(null, { autoClose: !1, fd, @fastPath: !0 }), stream.readable = !1, stream._type = "fs", fdType === 1 /* pipe */ || fdType === 2 /* socket */)
    stream[Symbol.asyncIterator] = function() {
      return async function* () {}();
    };
  if (fd === 1 || fd === 2) {
    stream.destroySoon = stream.destroy, stream._destroy = function(err, cb) {
      if (cb(err), this._undestroy(), !this._writableState.emitClose)
        process.nextTick(() => {
          this.emit("close");
        });
    };
    let kFastPath = (@getInternalField(@internalModuleRegistry, 23) || @createInternalModuleById(23)).kWriteStreamFastPath;
    stream._final = function(cb) {
      try {
        let sink = this[kFastPath];
        if (sink && sink !== !0) {
          let result = sink.flush();
          if (@isPromise(result)) {
            result.then(() => cb(null), (err) => cb(err));
            return;
          }
        }
        cb(null);
      } catch (err) {
        cb(err);
      }
    };
  }
  stream._isStdio = !0, stream.fd = fd;
  let underlyingSink = stream[(@getInternalField(@internalModuleRegistry, 23) || @createInternalModuleById(23)).kWriteStreamFastPath];
  return [stream, underlyingSink];
})
(function (process, nextTickQueue, drainMicrotasksFn, reportUncaughtExceptionFn) {"use strict";
  var queue, process, nextTickQueue = nextTickQueue, drainMicrotasks = drainMicrotasksFn, reportUncaughtException = reportUncaughtExceptionFn;
  let { validateFunction } = @getInternalField(@internalModuleRegistry, 68) || @createInternalModuleById(68);
  var setup = () => {
    let { FixedQueue } = @getInternalField(@internalModuleRegistry, 18) || @createInternalModuleById(18);
    queue = new FixedQueue;
    function processTicksAndRejections() {
      var tock;
      do {
        while ((tock = queue.shift()) !== null) {
          var { callback, args, frame } = tock, restore = @getInternalField(@asyncContext, 0);
          @putInternalField(@asyncContext, 0, frame);
          try {
            if (args === @undefined)
              callback();
            else
              switch (args.length) {
                case 1:
                  callback(args[0]);
                  break;
                case 2:
                  callback(args[0], args[1]);
                  break;
                case 3:
                  callback(args[0], args[1], args[2]);
                  break;
                case 4:
                  callback(args[0], args[1], args[2], args[3]);
                  break;
                default:
                  callback(...args);
                  break;
              }
          } catch (e) {
            reportUncaughtException(e);
          } finally {
            @putInternalField(@asyncContext, 0, restore);
          }
        }
        drainMicrotasks();
      } while (!queue.isEmpty());
    }
    @putInternalField(nextTickQueue, 0, 0), @putInternalField(nextTickQueue, 1, queue), @putInternalField(nextTickQueue, 2, processTicksAndRejections), setup = @undefined;
  };
  function nextTick(cb, ...args) {
    if (validateFunction(cb, "callback"), setup)
      setup(), process = globalThis.process;
    if (process._exiting)
      return;
    queue.push({
      callback: cb,
      args: @argumentCount() > 1 ? args : @undefined,
      frame: @getInternalField(@asyncContext, 0)
    }), @putInternalField(nextTickQueue, 0, 1);
  }
  return nextTick;
})
(function (internalEnv, envMapList, editWindowsEnvVar) {"use strict";
  return internalEnv[Bun.inspect.custom] = () => {
    let o = {};
    for (let k of envMapList)
      o[k] = internalEnv[k.toUpperCase()];
    return o;
  }, internalEnv.toJSON = () => {
    return { ...internalEnv };
  }, new Proxy(internalEnv, {
    get(_, p) {
      return typeof p === "string" ? internalEnv[p.toUpperCase()] : @undefined;
    },
    set(_, p, value) {
      let k = @String(p).toUpperCase();
      if (value = @String(value), !(k in internalEnv) && !envMapList.includes(p))
        envMapList.push(p);
      if (internalEnv[k] !== value)
        editWindowsEnvVar(k, value), internalEnv[k] = value;
      return !0;
    },
    has(_, p) {
      return typeof p !== "symbol" ? @String(p).toUpperCase() in internalEnv : !1;
    },
    deleteProperty(_, p) {
      let k = @String(p).toUpperCase(), i = envMapList.findIndex((x) => x.toUpperCase() === k);
      if (i !== -1)
        envMapList.splice(i, 1);
      return editWindowsEnvVar(k, null), typeof p !== "symbol" ? delete internalEnv[k] : !1;
    },
    defineProperty(_, p, attributes) {
      let k = @String(p).toUpperCase();
      if (!(k in internalEnv) && !envMapList.includes(p))
        envMapList.push(p);
      return editWindowsEnvVar(k, internalEnv[k]), @Object.@defineProperty(internalEnv, k, attributes);
    },
    getOwnPropertyDescriptor(target, p) {
      return typeof p === "string" ? Reflect.getOwnPropertyDescriptor(target, p.toUpperCase()) : @undefined;
    },
    ownKeys() {
      return envMapList.slice();
    }
  });
})
(function () {"use strict";
  if (!@isReadableByteStreamController(this))
    throw @makeGetterTypeError("ReadableByteStreamController", "byobRequest");
  var request = @getByIdDirectPrivate(this, "byobRequest");
  if (request === @undefined) {
    var pending = @getByIdDirectPrivate(this, "pendingPullIntos");
    let firstDescriptor = pending.peek();
    if (firstDescriptor) {
      let view = new @Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
      @putByIdDirectPrivate(this, "byobRequest", new @ReadableStreamBYOBRequest(this, view, @isReadableStream));
    }
  }
  return @getByIdDirectPrivate(this, "byobRequest");
})
(function () {"use strict";
  if (!@isReadableByteStreamController(this))
    throw @makeErrorWithCode(139, "ReadableByteStreamController");
  if (@getByIdDirectPrivate(this, "closeRequested"))
    @throwTypeError("Close has already been requested");
  if (@getByIdDirectPrivate(@getByIdDirectPrivate(this, "controlledReadableStream"), "state") !== 4)
    throw @makeErrorWithCode(137, "Controller is already closed");
  @readableByteStreamControllerClose(this);
})
(function () {"use strict";
  if (!@isReadableByteStreamController(this))
    throw @makeGetterTypeError("ReadableByteStreamController", "desiredSize");
  return @readableByteStreamControllerGetDesiredSize(this);
})
(function (chunk) {"use strict";
  if (!@isReadableByteStreamController(this))
    throw @makeErrorWithCode(139, "ReadableByteStreamController");
  if (@getByIdDirectPrivate(this, "closeRequested"))
    throw @makeErrorWithCode(137, "Controller is already closed");
  if (@getByIdDirectPrivate(@getByIdDirectPrivate(this, "controlledReadableStream"), "state") !== 4)
    throw @makeErrorWithCode(137, "Controller is already closed");
  if (!@isObject(chunk) || !@ArrayBuffer.@isView(chunk))
    throw @makeErrorWithCode(119, "buffer", "Buffer, TypedArray, or DataView", chunk);
  return @readableByteStreamControllerEnqueue(this, chunk);
})
(function (error) {"use strict";
  if (!@isReadableByteStreamController(this))
    throw @makeErrorWithCode(139, "ReadableByteStreamController");
  if (@getByIdDirectPrivate(@getByIdDirectPrivate(this, "controlledReadableStream"), "state") !== 4)
    throw @makeErrorWithCode(137, "Controller is already closed");
  @readableByteStreamControllerError(this, error);
})
(function (stream, underlyingByteSource, highWaterMark) {"use strict";
  if (arguments.length !== 4 && arguments[3] !== @isReadableStream)
    @throwTypeError("ReadableByteStreamController constructor should not be called directly");
  return @privateInitializeReadableByteStreamController.@call(this, stream, underlyingByteSource, highWaterMark);
})
(function (controller) {"use strict";
  return @isObject(controller) && !!@getByIdDirectPrivate(controller, "underlyingByteSource");
})
(function (reader) {"use strict";
  return @isObject(reader) && !!@getByIdDirectPrivate(reader, "readIntoRequests");
})
(function (byobRequest) {"use strict";
  return @isObject(byobRequest) && @getByIdDirectPrivate(byobRequest, "associatedReadableByteStreamController") !== @undefined;
})
(function (stream, underlyingByteSource, highWaterMark) {"use strict";
  if (!@isReadableStream(stream))
    @throwTypeError("ReadableByteStreamController needs a ReadableStream");
  if (@getByIdDirectPrivate(stream, "readableStreamController") !== null)
    @throwTypeError("ReadableStream already has a controller");
  @putByIdDirectPrivate(this, "controlledReadableStream", stream), @putByIdDirectPrivate(this, "underlyingByteSource", underlyingByteSource), @putByIdDirectPrivate(this, "pullAgain", !1), @putByIdDirectPrivate(this, "pulling", !1), @readableByteStreamControllerClearPendingPullIntos(this), @putByIdDirectPrivate(this, "queue", @newQueue()), @putByIdDirectPrivate(this, "started", 0), @putByIdDirectPrivate(this, "closeRequested", !1);
  let hwm = @toNumber(highWaterMark);
  if (hwm !== hwm || hwm < 0)
    @throwRangeError("highWaterMark value is negative or not a number");
  @putByIdDirectPrivate(this, "strategyHWM", hwm);
  let autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
  if (autoAllocateChunkSize !== @undefined) {
    if (autoAllocateChunkSize = @toNumber(autoAllocateChunkSize), autoAllocateChunkSize <= 0 || autoAllocateChunkSize === @Infinity || autoAllocateChunkSize === -@Infinity)
      @throwRangeError("autoAllocateChunkSize value is negative or equal to positive or negative infinity");
  }
  @putByIdDirectPrivate(this, "autoAllocateChunkSize", autoAllocateChunkSize), @putByIdDirectPrivate(this, "pendingPullIntos", @createFIFO());
  let controller = this;
  return @promiseInvokeOrNoopNoCatch(@getByIdDirectPrivate(controller, "underlyingByteSource"), "start", [controller]).@then(() => {
    @putByIdDirectPrivate(controller, "started", 1), @readableByteStreamControllerCallPullIfNeeded(controller);
  }, (error) => {
    if (@getByIdDirectPrivate(stream, "state") === 4)
      @readableByteStreamControllerError(controller, error);
  }), @putByIdDirectPrivate(this, "cancel", @readableByteStreamControllerCancel), @putByIdDirectPrivate(this, "pull", @readableByteStreamControllerPull), this;
})
(function (controller, view) {"use strict";
  @putByIdDirectPrivate(this, "associatedReadableByteStreamController", controller), @putByIdDirectPrivate(this, "view", view);
})
(function (controller) {"use strict";
  if (!@readableByteStreamControllerShouldCallPull(controller))
    return;
  if (@getByIdDirectPrivate(controller, "pulling")) {
    @putByIdDirectPrivate(controller, "pullAgain", !0);
    return;
  }
  @putByIdDirectPrivate(controller, "pulling", !0), @promiseInvokeOrNoop(@getByIdDirectPrivate(controller, "underlyingByteSource"), "pull", [controller]).@then(() => {
    if (@putByIdDirectPrivate(controller, "pulling", !1), @getByIdDirectPrivate(controller, "pullAgain"))
      @putByIdDirectPrivate(controller, "pullAgain", !1), @readableByteStreamControllerCallPullIfNeeded(controller);
  }, (error) => {
    if (@getByIdDirectPrivate(@getByIdDirectPrivate(controller, "controlledReadableStream"), "state") === 4)
      @readableByteStreamControllerError(controller, error);
  });
})
(function (controller, reason) {"use strict";
  var pendingPullIntos = @getByIdDirectPrivate(controller, "pendingPullIntos"), first = pendingPullIntos.peek();
  if (first)
    first.bytesFilled = 0;
  return @putByIdDirectPrivate(controller, "queue", @newQueue()), @promiseInvokeOrNoop(@getByIdDirectPrivate(controller, "underlyingByteSource"), "cancel", [reason]);
})
(function (controller) {"use strict";
  @readableByteStreamControllerInvalidateBYOBRequest(controller);
  var existing = @getByIdDirectPrivate(controller, "pendingPullIntos");
  if (existing !== @undefined)
    existing.clear();
  else
    @putByIdDirectPrivate(controller, "pendingPullIntos", @createFIFO());
})
(function (controller) {"use strict";
  if (@getByIdDirectPrivate(controller, "queue").size > 0) {
    @putByIdDirectPrivate(controller, "closeRequested", !0);
    return;
  }
  var first = @getByIdDirectPrivate(controller, "pendingPullIntos")?.peek();
  if (first) {
    if (first.bytesFilled > 0) {
      let e = @makeTypeError("Close requested while there remain pending bytes");
      throw @readableByteStreamControllerError(controller, e), e;
    }
  }
  @readableStreamCloseIfPossible(@getByIdDirectPrivate(controller, "controlledReadableStream"));
})
(function (stream, pullIntoDescriptor) {"use strict";
  let done = !1;
  if (@getByIdDirectPrivate(stream, "state") === 1)
    done = !0;
  let filledView = @readableByteStreamControllerConvertDescriptor(pullIntoDescriptor);
  if (pullIntoDescriptor.readerType === "default")
    @readableStreamFulfillReadRequest(stream, filledView, done);
  else
    @readableStreamFulfillReadIntoRequest(stream, filledView, done);
})
(function (pullIntoDescriptor) {"use strict";
  return new pullIntoDescriptor.ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, pullIntoDescriptor.bytesFilled / pullIntoDescriptor.elementSize);
})
(function (controller, chunk) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "controlledReadableStream");
  switch (@getByIdDirectPrivate(stream, "reader") ? @readableStreamReaderKind(@getByIdDirectPrivate(stream, "reader")) : 0) {
    case 1: {
      if (!@getByIdDirectPrivate(@getByIdDirectPrivate(stream, "reader"), "readRequests")?.isNotEmpty())
        @readableByteStreamControllerEnqueueChunk(controller, @transferBufferToCurrentRealm(chunk.buffer), chunk.byteOffset, chunk.byteLength);
      else {
        let transferredView = chunk.constructor === @Uint8Array ? chunk : new @Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
        @readableStreamFulfillReadRequest(stream, transferredView, !1);
      }
      break;
    }
    case 2: {
      @readableByteStreamControllerEnqueueChunk(controller, @transferBufferToCurrentRealm(chunk.buffer), chunk.byteOffset, chunk.byteLength), @readableByteStreamControllerProcessPullDescriptors(controller);
      break;
    }
    case 3:
      break;
    default: {
      @readableByteStreamControllerEnqueueChunk(controller, @transferBufferToCurrentRealm(chunk.buffer), chunk.byteOffset, chunk.byteLength);
      break;
    }
  }
})
(function (controller, buffer, byteOffset, byteLength) {"use strict";
  @getByIdDirectPrivate(controller, "queue").content.push({
    buffer,
    byteOffset,
    byteLength
  }), @getByIdDirectPrivate(controller, "queue").size += byteLength;
})
(function (controller, e) {"use strict";
  @readableByteStreamControllerClearPendingPullIntos(controller), @putByIdDirectPrivate(controller, "queue", @newQueue()), @readableStreamError(@getByIdDirectPrivate(controller, "controlledReadableStream"), e);
})
(function (controller, pullIntoDescriptor) {"use strict";
  let currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize, maxBytesToCopy = @getByIdDirectPrivate(controller, "queue").size < pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled ? @getByIdDirectPrivate(controller, "queue").size : pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled, maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy, maxAlignedBytes = maxBytesFilled - maxBytesFilled % pullIntoDescriptor.elementSize, totalBytesToCopyRemaining = maxBytesToCopy, ready = !1;
  if (maxAlignedBytes > currentAlignedBytes)
    totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled, ready = !0;
  while (totalBytesToCopyRemaining > 0) {
    let headOfQueue = @getByIdDirectPrivate(controller, "queue").content.peek(), bytesToCopy = totalBytesToCopyRemaining < headOfQueue.byteLength ? totalBytesToCopyRemaining : headOfQueue.byteLength, destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
    if (new @Uint8Array(pullIntoDescriptor.buffer).set(new @Uint8Array(headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy), destStart), headOfQueue.byteLength === bytesToCopy)
      @getByIdDirectPrivate(controller, "queue").content.shift();
    else
      headOfQueue.byteOffset += bytesToCopy, headOfQueue.byteLength -= bytesToCopy;
    @getByIdDirectPrivate(controller, "queue").size -= bytesToCopy, @readableByteStreamControllerInvalidateBYOBRequest(controller), pullIntoDescriptor.bytesFilled += bytesToCopy, totalBytesToCopyRemaining -= bytesToCopy;
  }
  return ready;
})
(function (controller) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "controlledReadableStream"), state = @getByIdDirectPrivate(stream, "state");
  if (state === 3)
    return null;
  if (state === 1)
    return 0;
  return @getByIdDirectPrivate(controller, "strategyHWM") - @getByIdDirectPrivate(controller, "queue").size;
})
(function (controller) {"use strict";
  if (!@getByIdDirectPrivate(controller, "queue").size && @getByIdDirectPrivate(controller, "closeRequested"))
    @readableStreamCloseIfPossible(@getByIdDirectPrivate(controller, "controlledReadableStream"));
  else
    @readableByteStreamControllerCallPullIfNeeded(controller);
})
(function (controller) {"use strict";
  if (@getByIdDirectPrivate(controller, "byobRequest") === @undefined)
    return;
  let byobRequest = @getByIdDirectPrivate(controller, "byobRequest");
  @putByIdDirectPrivate(byobRequest, "associatedReadableByteStreamController", null), @putByIdDirectPrivate(byobRequest, "view", @undefined), @putByIdDirectPrivate(controller, "byobRequest", @undefined);
})
(function (controller) {"use strict";
  while (@getByIdDirectPrivate(controller, "pendingPullIntos").isNotEmpty()) {
    if (@getByIdDirectPrivate(controller, "queue").size === 0)
      return;
    let pullIntoDescriptor = @getByIdDirectPrivate(controller, "pendingPullIntos").peek();
    if (@readableByteStreamControllerFillDescriptorFromQueue(controller, pullIntoDescriptor))
      @readableByteStreamControllerShiftPendingDescriptor(controller), @readableByteStreamControllerCommitDescriptor(@getByIdDirectPrivate(controller, "controlledReadableStream"), pullIntoDescriptor);
  }
})
(function (controller) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "controlledReadableStream");
  if (@getByIdDirectPrivate(controller, "queue").content?.isNotEmpty()) {
    let entry = @getByIdDirectPrivate(controller, "queue").content.shift();
    @getByIdDirectPrivate(controller, "queue").size -= entry.byteLength, @readableByteStreamControllerHandleQueueDrain(controller);
    let view;
    try {
      view = new @Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
    } catch (error) {
      return @Promise.@reject(error);
    }
    return @createFulfilledPromise({ value: view, done: !1 });
  }
  if (@getByIdDirectPrivate(controller, "autoAllocateChunkSize") !== @undefined) {
    let buffer;
    try {
      buffer = @createUninitializedArrayBuffer(@getByIdDirectPrivate(controller, "autoAllocateChunkSize"));
    } catch (error) {
      return @Promise.@reject(error);
    }
    let pullIntoDescriptor = {
      buffer,
      byteOffset: 0,
      byteLength: @getByIdDirectPrivate(controller, "autoAllocateChunkSize"),
      bytesFilled: 0,
      elementSize: 1,
      ctor: @Uint8Array,
      readerType: "default"
    };
    @getByIdDirectPrivate(controller, "pendingPullIntos").push(pullIntoDescriptor);
  }
  let promise = @readableStreamAddReadRequest(stream);
  return @readableByteStreamControllerCallPullIfNeeded(controller), promise;
})
(function (controller, view) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "controlledReadableStream"), elementSize = 1;
  if (view.BYTES_PER_ELEMENT !== @undefined)
    elementSize = view.BYTES_PER_ELEMENT;
  let ctor = view.constructor, pullIntoDescriptor = {
    buffer: view.buffer,
    byteOffset: view.byteOffset,
    byteLength: view.byteLength,
    bytesFilled: 0,
    elementSize,
    ctor,
    readerType: "byob"
  };
  var pending = @getByIdDirectPrivate(controller, "pendingPullIntos");
  if (pending?.isNotEmpty())
    return pullIntoDescriptor.buffer = @transferBufferToCurrentRealm(pullIntoDescriptor.buffer), pending.push(pullIntoDescriptor), @readableStreamAddReadIntoRequest(stream);
  if (@getByIdDirectPrivate(stream, "state") === 1) {
    let emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
    return @createFulfilledPromise({ value: emptyView, done: !0 });
  }
  if (@getByIdDirectPrivate(controller, "queue").size > 0) {
    if (@readableByteStreamControllerFillDescriptorFromQueue(controller, pullIntoDescriptor)) {
      let filledView = @readableByteStreamControllerConvertDescriptor(pullIntoDescriptor);
      return @readableByteStreamControllerHandleQueueDrain(controller), @createFulfilledPromise({ value: filledView, done: !1 });
    }
    if (@getByIdDirectPrivate(controller, "closeRequested")) {
      let e = @makeTypeError("Closing stream has been requested");
      return @readableByteStreamControllerError(controller, e), @Promise.@reject(e);
    }
  }
  pullIntoDescriptor.buffer = @transferBufferToCurrentRealm(pullIntoDescriptor.buffer), @getByIdDirectPrivate(controller, "pendingPullIntos").push(pullIntoDescriptor);
  let promise = @readableStreamAddReadIntoRequest(stream);
  return @readableByteStreamControllerCallPullIfNeeded(controller), promise;
})
(function (controller, bytesWritten) {"use strict";
  if (bytesWritten = @toNumber(bytesWritten), bytesWritten !== bytesWritten || bytesWritten === @Infinity || bytesWritten < 0)
    @throwRangeError("bytesWritten has an incorrect value");
  @readableByteStreamControllerRespondInternal(controller, bytesWritten);
})
(function (controller, firstDescriptor) {"use strict";
  if (firstDescriptor.buffer = @transferBufferToCurrentRealm(firstDescriptor.buffer), @readableStreamHasBYOBReader(@getByIdDirectPrivate(controller, "controlledReadableStream")))
    while (@getByIdDirectPrivate(@getByIdDirectPrivate(@getByIdDirectPrivate(controller, "controlledReadableStream"), "reader"), "readIntoRequests")?.isNotEmpty()) {
      let pullIntoDescriptor = @readableByteStreamControllerShiftPendingDescriptor(controller);
      @readableByteStreamControllerCommitDescriptor(@getByIdDirectPrivate(controller, "controlledReadableStream"), pullIntoDescriptor);
    }
})
(function (controller, bytesWritten, pullIntoDescriptor) {"use strict";
  if (pullIntoDescriptor.bytesFilled + bytesWritten > pullIntoDescriptor.byteLength)
    @throwRangeError("bytesWritten value is too great");
  if (@readableByteStreamControllerInvalidateBYOBRequest(controller), pullIntoDescriptor.bytesFilled += bytesWritten, pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize)
    return;
  @readableByteStreamControllerShiftPendingDescriptor(controller);
  let remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
  if (remainderSize > 0) {
    let end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled, remainder = @cloneArrayBuffer(pullIntoDescriptor.buffer, end - remainderSize, remainderSize);
    @readableByteStreamControllerEnqueueChunk(controller, remainder, 0, remainder.byteLength);
  }
  pullIntoDescriptor.buffer = @transferBufferToCurrentRealm(pullIntoDescriptor.buffer), pullIntoDescriptor.bytesFilled -= remainderSize, @readableByteStreamControllerCommitDescriptor(@getByIdDirectPrivate(controller, "controlledReadableStream"), pullIntoDescriptor), @readableByteStreamControllerProcessPullDescriptors(controller);
})
(function (controller, bytesWritten) {"use strict";
  let firstDescriptor = @getByIdDirectPrivate(controller, "pendingPullIntos").peek(), stream = @getByIdDirectPrivate(controller, "controlledReadableStream");
  if (@getByIdDirectPrivate(stream, "state") === 1)
    @readableByteStreamControllerRespondInClosedState(controller, firstDescriptor);
  else
    @readableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
})
(function (controller, view) {"use strict";
  let firstDescriptor = @getByIdDirectPrivate(controller, "pendingPullIntos").peek();
  if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset)
    @throwRangeError("Invalid value for view.byteOffset");
  if (firstDescriptor.byteLength < view.byteLength)
    throw @makeErrorWithCode(120, "view", view);
  firstDescriptor.buffer = view.buffer, @readableByteStreamControllerRespondInternal(controller, view.byteLength);
})
(function (controller) {"use strict";
  let descriptor = @getByIdDirectPrivate(controller, "pendingPullIntos").shift();
  return @readableByteStreamControllerInvalidateBYOBRequest(controller), descriptor;
})
(function (controller) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "controlledReadableStream");
  if (!stream)
    return !1;
  if (@getByIdDirectPrivate(stream, "state") !== 4)
    return !1;
  if (@getByIdDirectPrivate(controller, "closeRequested"))
    return !1;
  if (!(@getByIdDirectPrivate(controller, "started") > 0))
    return !1;
  let reader = @getByIdDirectPrivate(stream, "reader");
  if (reader && (@getByIdDirectPrivate(reader, "readRequests")?.isNotEmpty() || !!reader.@bunNativePtr))
    return !0;
  if (@readableStreamHasBYOBReader(stream) && @getByIdDirectPrivate(@getByIdDirectPrivate(stream, "reader"), "readIntoRequests")?.isNotEmpty())
    return !0;
  if (@readableByteStreamControllerGetDesiredSize(controller) > 0)
    return !0;
  return !1;
})
(function (stream) {"use strict";
  let readRequest = @newPromise();
  return @getByIdDirectPrivate(@getByIdDirectPrivate(stream, "reader"), "readIntoRequests").push(readRequest), readRequest;
})
(function (reader, view) {"use strict";
  let stream = @getByIdDirectPrivate(reader, "ownerReadableStream");
  if (@putByIdDirectPrivate(stream, "disturbed", !0), @getByIdDirectPrivate(stream, "state") === 3)
    return @Promise.@reject(@getByIdDirectPrivate(stream, "storedError"));
  return @readableByteStreamControllerPullInto(@getByIdDirectPrivate(stream, "readableStreamController"), view);
})
(function (controller) {"use strict";
  @putByIdDirectPrivate(controller, "start", @undefined);
})
(function (stream, chunk, done) {"use strict";
  let readIntoRequest = @getByIdDirectPrivate(@getByIdDirectPrivate(stream, "reader"), "readIntoRequests").shift();
  @fulfillPromise(readIntoRequest, { value: chunk, done });
})
(function (stream) {"use strict";
  let reader = @getByIdDirectPrivate(stream, "reader");
  return reader !== @undefined && @isReadableStreamBYOBReader(reader);
})
(function (stream) {"use strict";
  let reader = @getByIdDirectPrivate(stream, "reader");
  return reader !== @undefined && @isReadableStreamDefaultReader(reader);
})
(function (reader) {"use strict";
  if (@getByIdDirectPrivate(reader, "readRequests"))
    return reader.@bunNativePtr ? 3 : 1;
  if (@getByIdDirectPrivate(reader, "readIntoRequests"))
    return 2;
  return 0;
})
(function (buffer) {"use strict";
  return buffer;
})
(function (reason) {"use strict";
  if (!@isReadableStream(this))
    return @Promise.@reject(@makeErrorWithCode(139, "ReadableStream"));
  if (@isReadableStreamLocked(this))
    return @Promise.@reject(@makeErrorWithCode(137, "ReadableStream is locked"));
  return @readableStreamCancel(this, reason);
})
(function () {"use strict";
  var stream = new @ReadableStream({
    pull() {}
  });
  return @readableStreamClose(stream), stream;
})
(function (nativePtr, autoAllocateChunkSize) {"use strict";
  return new @ReadableStream({
    @lazy: !0,
    @bunNativePtr: nativePtr,
    autoAllocateChunkSize
  });
})
(function () {"use strict";
  var stream = new @ReadableStream({
    pull() {}
  });
  return stream.getReader(), stream;
})
(function (options) {"use strict";
  if (!@isReadableStream(this))
    throw @makeErrorWithCode(139, "ReadableStream");
  let mode = @toDictionary(options, {}, "ReadableStream.getReader takes an object as first argument").mode;
  if (mode === @undefined) {
    var start_ = @getByIdDirectPrivate(this, "start");
    if (start_)
      @putByIdDirectPrivate(this, "start", @undefined), start_();
    return new @ReadableStreamDefaultReader(this);
  }
  if (mode == "byob")
    return new @ReadableStreamBYOBReader(this);
  throw @makeErrorWithCode(120, "mode", mode, "byob");
})
(function (underlyingSource, strategy) {"use strict";
  if (underlyingSource === @undefined)
    underlyingSource = { @bunNativePtr: @undefined, @lazy: !1 };
  if (strategy === @undefined)
    strategy = {};
  if (!@isObject(underlyingSource))
    @throwTypeError("ReadableStream constructor takes an object as first argument");
  if (strategy !== @undefined && !@isObject(strategy))
    @throwTypeError("ReadableStream constructor takes an object as second argument, if any");
  @putByIdDirectPrivate(this, "state", 4), @putByIdDirectPrivate(this, "reader", @undefined), @putByIdDirectPrivate(this, "storedError", @undefined), this.@disturbed = !1, @putByIdDirectPrivate(this, "readableStreamController", null), this.@bunNativePtr = @getByIdDirectPrivate(underlyingSource, "bunNativePtr") ?? @undefined, @putByIdDirectPrivate(this, "asyncContext", @getInternalField(@asyncContext, 0));
  let isDirect = underlyingSource.type === "direct", isUnderlyingSourceLazy = !!underlyingSource.@lazy, isLazy = isDirect || isUnderlyingSourceLazy, pullFn;
  if (!isLazy && (pullFn = @getByIdDirectPrivate(underlyingSource, "pull")) !== @undefined) {
    let size = @getByIdDirectPrivate(strategy, "size"), highWaterMark = @getByIdDirectPrivate(strategy, "highWaterMark");
    return @putByIdDirectPrivate(this, "highWaterMark", highWaterMark), @putByIdDirectPrivate(this, "underlyingSource", @undefined), @setupReadableStreamDefaultController(this, underlyingSource, size, highWaterMark !== @undefined ? highWaterMark : 1, @getByIdDirectPrivate(underlyingSource, "start"), pullFn, @getByIdDirectPrivate(underlyingSource, "cancel")), this;
  }
  if (isDirect)
    @putByIdDirectPrivate(this, "underlyingSource", underlyingSource), @putByIdDirectPrivate(this, "highWaterMark", @getByIdDirectPrivate(strategy, "highWaterMark")), @putByIdDirectPrivate(this, "start", () => @createReadableStreamController(this, underlyingSource, strategy));
  else if (isLazy) {
    let autoAllocateChunkSize = underlyingSource.autoAllocateChunkSize;
    @putByIdDirectPrivate(this, "highWaterMark", @undefined), @putByIdDirectPrivate(this, "underlyingSource", @undefined), @putByIdDirectPrivate(this, "highWaterMark", autoAllocateChunkSize || @getByIdDirectPrivate(strategy, "highWaterMark")), @putByIdDirectPrivate(this, "start", () => {
      let instance = @lazyLoadStream(this, autoAllocateChunkSize);
      if (instance)
        @createReadableStreamController(this, instance, strategy);
    });
  } else
    @putByIdDirectPrivate(this, "underlyingSource", @undefined), @putByIdDirectPrivate(this, "highWaterMark", @getByIdDirectPrivate(strategy, "highWaterMark")), @putByIdDirectPrivate(this, "start", @undefined), @createReadableStreamController(this, underlyingSource, strategy);
  return this;
})
(function () {"use strict";
  var prototype = @ReadableStream.prototype;
  return @readableStreamDefineLazyIterators(prototype), prototype[globalThis.Symbol.asyncIterator].@call(this);
})
(function () {"use strict";
  if (!@isReadableStream(this))
    throw @makeGetterTypeError("ReadableStream", "locked");
  return @isReadableStreamLocked(this);
})
(function (streams, options) {"use strict";
  let transforms = streams, readable = transforms.readable;
  if (!@isReadableStream(readable))
    throw @makeTypeError("readable should be ReadableStream");
  let writable = transforms.writable, internalWritable = @getInternalWritableStream(writable);
  if (!@isWritableStream(internalWritable))
    throw @makeTypeError("writable should be WritableStream");
  let preventClose = !1, preventAbort = !1, preventCancel = !1, signal;
  if (!@isUndefinedOrNull(options)) {
    if (!@isObject(options))
      throw @makeTypeError("options must be an object");
    if (preventAbort = !!options.preventAbort, preventCancel = !!options.preventCancel, preventClose = !!options.preventClose, signal = options.signal, signal !== @undefined && !@isAbortSignal(signal))
      throw @makeTypeError("options.signal must be AbortSignal");
  }
  if (!@isReadableStream(this))
    throw @makeErrorWithCode(139, "ReadableStream");
  if (@isReadableStreamLocked(this))
    throw @makeErrorWithCode(137, "ReadableStream is locked");
  if (@isWritableStreamLocked(internalWritable))
    throw @makeTypeError("WritableStream is locked");
  let promise = @readableStreamPipeToWritableStream(this, internalWritable, preventClose, preventAbort, preventCancel, signal);
  return @markPromiseAsHandled(promise), readable;
})
(function (destination) {"use strict";
  if (!@isReadableStream(this))
    return @Promise.@reject(@makeErrorWithCode(139, "ReadableStream"));
  if (@isReadableStreamLocked(this))
    return @Promise.@reject(@makeErrorWithCode(137, "ReadableStream is locked"));
  let options = @argument(1), preventClose = !1, preventAbort = !1, preventCancel = !1, signal;
  if (!@isUndefinedOrNull(options)) {
    if (!@isObject(options))
      return @Promise.@reject(@makeTypeError("options must be an object"));
    try {
      preventAbort = !!options.preventAbort, preventCancel = !!options.preventCancel, preventClose = !!options.preventClose, signal = options.signal;
    } catch (e) {
      return @Promise.@reject(e);
    }
    if (signal !== @undefined && !@isAbortSignal(signal))
      return @Promise.@reject(@makeTypeError("options.signal must be AbortSignal"));
  }
  let internalDestination = @getInternalWritableStream(destination);
  if (!@isWritableStream(internalDestination))
    return @Promise.@reject(@makeTypeError("ReadableStream pipeTo requires a WritableStream"));
  if (@isWritableStreamLocked(internalDestination))
    return @Promise.@reject(@makeTypeError("WritableStream is locked"));
  return @readableStreamPipeToWritableStream(this, internalDestination, preventClose, preventAbort, preventCancel, signal);
})
(function (stream) {"use strict";
  if (!@isReadableStream(stream))
    throw @makeErrorWithCode(119, "stream", "ReadableStream", typeof stream);
  var underlyingSource = @getByIdDirectPrivate(stream, "underlyingSource");
  if (underlyingSource != null)
    return @readableStreamToArrayDirect(stream, underlyingSource);
  if (@isReadableStreamLocked(stream))
    return @Promise.@reject(@makeErrorWithCode(137, "ReadableStream is locked"));
  return @readableStreamIntoArray(stream);
})
(function (stream) {"use strict";
  if (!@isReadableStream(stream))
    throw @makeErrorWithCode(119, "stream", "ReadableStream", typeof stream);
  var underlyingSource = @getByIdDirectPrivate(stream, "underlyingSource");
  if (underlyingSource != null)
    return @readableStreamToArrayBufferDirect(stream, underlyingSource, !1);
  if (@isReadableStreamLocked(stream))
    return @Promise.@reject(@makeErrorWithCode(137, "ReadableStream is locked"));
  let result = @tryUseReadableStreamBufferedFastPath(stream, "arrayBuffer");
  if (result)
    return result;
  result = Bun.readableStreamToArray(stream);
  function toArrayBuffer(result2) {
    switch (result2.length) {
      case 0:
        return new @ArrayBuffer(0);
      case 1: {
        let view = result2[0];
        if (view instanceof @ArrayBuffer || view instanceof SharedArrayBuffer)
          return view;
        if (@ArrayBuffer.isView(view)) {
          let { buffer, byteOffset, byteLength } = view;
          if (byteOffset === 0 && byteLength === buffer.byteLength)
            return buffer;
          return buffer.slice(byteOffset, byteOffset + byteLength);
        }
        if (typeof view === "string")
          return (/* @__PURE__ */ new TextEncoder()).encode(view);
      }
      default: {
        let anyStrings = !1;
        for (let chunk of result2)
          if (typeof chunk === "string") {
            anyStrings = !0;
            break;
          }
        if (!anyStrings)
          return Bun.concatArrayBuffers(result2, !1);
        let sink = new Bun.ArrayBufferSink;
        sink.start();
        for (let chunk of result2)
          sink.write(chunk);
        return sink.end();
      }
    }
  }
  if (@isPromise(result)) {
    let completedResult = Bun.peek(result);
    if (completedResult !== result)
      result = completedResult;
    else
      return result.then(toArrayBuffer);
  }
  return @createFulfilledPromise(toArrayBuffer(result));
})
(function (stream) {"use strict";
  if (!@isReadableStream(stream))
    throw @makeErrorWithCode(119, "stream", "ReadableStream", typeof stream);
  if (@isReadableStreamLocked(stream))
    return @Promise.@reject(@makeErrorWithCode(137, "ReadableStream is locked"));
  return @tryUseReadableStreamBufferedFastPath(stream, "blob") || @Promise.@resolve(Bun.readableStreamToArray(stream)).then((array) => new Blob(array));
})
(function (stream) {"use strict";
  if (!@isReadableStream(stream))
    throw @makeErrorWithCode(119, "stream", "ReadableStream", typeof stream);
  var underlyingSource = @getByIdDirectPrivate(stream, "underlyingSource");
  if (underlyingSource != null)
    return @readableStreamToArrayBufferDirect(stream, underlyingSource, !0);
  if (@isReadableStreamLocked(stream))
    return @Promise.@reject(@makeErrorWithCode(137, "ReadableStream is locked"));
  let result = @tryUseReadableStreamBufferedFastPath(stream, "bytes");
  if (result)
    return result;
  result = Bun.readableStreamToArray(stream);
  function toBytes(result2) {
    switch (result2.length) {
      case 0:
        return new @Uint8Array(0);
      case 1: {
        let view = result2[0];
        if (view instanceof @Uint8Array)
          return view;
        if (@ArrayBuffer.isView(view))
          return new @Uint8Array(view.buffer, view.byteOffset, view.byteLength);
        if (view instanceof @ArrayBuffer || view instanceof SharedArrayBuffer)
          return new @Uint8Array(view);
        if (typeof view === "string")
          return (/* @__PURE__ */ new TextEncoder()).encode(view);
      }
      default: {
        let anyStrings = !1;
        for (let chunk of result2)
          if (typeof chunk === "string") {
            anyStrings = !0;
            break;
          }
        if (!anyStrings)
          return Bun.concatArrayBuffers(result2, !0);
        let sink = new Bun.ArrayBufferSink;
        sink.start({ asUint8Array: !0 });
        for (let chunk of result2)
          sink.write(chunk);
        return sink.end();
      }
    }
  }
  if (@isPromise(result)) {
    let completedResult = Bun.peek(result);
    if (completedResult !== result)
      result = completedResult;
    else
      return result.then(toBytes);
  }
  return @createFulfilledPromise(toBytes(result));
})
(function (stream, contentType) {"use strict";
  if (!@isReadableStream(stream))
    throw @makeErrorWithCode(119, "stream", "ReadableStream", typeof stream);
  if (@isReadableStreamLocked(stream))
    return @Promise.@reject(@makeErrorWithCode(137, "ReadableStream is locked"));
  return Bun.readableStreamToBlob(stream).then((blob) => {
    return FormData.from(blob, contentType);
  });
})
(function (stream) {"use strict";
  if (!@isReadableStream(stream))
    throw @makeErrorWithCode(119, "stream", "ReadableStream", typeof stream);
  if (@isReadableStreamLocked(stream))
    return @Promise.@reject(@makeErrorWithCode(137, "ReadableStream is locked"));
  let result = @tryUseReadableStreamBufferedFastPath(stream, "json");
  if (result)
    return result;
  let text = Bun.readableStreamToText(stream), peeked = Bun.peek(text);
  if (peeked !== text)
    try {
      return @createFulfilledPromise(globalThis.JSON.parse(peeked));
    } catch (e) {
      return @Promise.@reject(e);
    }
  return text.then(globalThis.JSON.parse);
})
(function (stream) {"use strict";
  if (!@isReadableStream(stream))
    throw @makeErrorWithCode(119, "stream", "ReadableStream", typeof stream);
  var underlyingSource = @getByIdDirectPrivate(stream, "underlyingSource");
  if (underlyingSource != null)
    return @readableStreamToTextDirect(stream, underlyingSource);
  if (@isReadableStreamLocked(stream))
    return @Promise.@reject(@makeErrorWithCode(137, "ReadableStream is locked"));
  let result = @tryUseReadableStreamBufferedFastPath(stream, "text");
  if (result)
    return result;
  return @readableStreamIntoText(stream);
})
(function () {"use strict";
  if (!@isReadableStream(this))
    throw @makeErrorWithCode(139, "ReadableStream");
  return @readableStreamTee(this, !1);
})
(function (options) {"use strict";
  var prototype = @ReadableStream.prototype;
  return @readableStreamDefineLazyIterators(prototype), prototype.values.@call(this, options);
})
(function (reason) {"use strict";
  if (!@isReadableStreamBYOBReader(this))
    return @Promise.@reject(@makeErrorWithCode(139, "ReadableStreamBYOBReader"));
  if (!@getByIdDirectPrivate(this, "ownerReadableStream"))
    return @Promise.@reject(@makeErrorWithCode(137, "The reader is not attached to a stream"));
  return @readableStreamReaderGenericCancel(this, reason);
})
(function () {"use strict";
  if (!@isReadableStreamBYOBReader(this))
    return @Promise.@reject(@makeGetterTypeError("ReadableStreamBYOBReader", "closed"));
  return @getByIdDirectPrivate(this, "closedPromiseCapability").promise;
})
(function (stream) {"use strict";
  if (!@isReadableStream(stream))
    @throwTypeError("ReadableStreamBYOBReader needs a ReadableStream");
  if (!@isReadableByteStreamController(@getByIdDirectPrivate(stream, "readableStreamController")))
    @throwTypeError("ReadableStreamBYOBReader needs a ReadableByteStreamController");
  if (@isReadableStreamLocked(stream))
    @throwTypeError("ReadableStream is locked");
  return @readableStreamReaderGenericInitialize(this, stream), @putByIdDirectPrivate(this, "readIntoRequests", @createFIFO()), this;
})
(function (view) {"use strict";
  if (!@isReadableStreamBYOBReader(this))
    return @Promise.@reject(@makeErrorWithCode(139, "ReadableStreamBYOBReader"));
  if (!@getByIdDirectPrivate(this, "ownerReadableStream"))
    return @Promise.@reject(@makeErrorWithCode(137, "The reader is not attached to a stream"));
  if (!@isObject(view))
    return @Promise.@reject(@makeErrorWithCode(119, "view", "Buffer, TypedArray, or DataView", view));
  if (!@ArrayBuffer.@isView(view))
    return @Promise.@reject(@makeErrorWithCode(119, "view", "Buffer, TypedArray, or DataView", view));
  if (view.byteLength === 0)
    return @Promise.@reject(@makeTypeError("Provided view cannot have a 0 byteLength"));
  return @readableStreamBYOBReaderRead(this, view);
})
(function () {"use strict";
  if (!@isReadableStreamBYOBReader(this))
    throw @makeErrorWithCode(139, "ReadableStreamBYOBReader");
  if (!@getByIdDirectPrivate(this, "ownerReadableStream"))
    return;
  if (@getByIdDirectPrivate(this, "readIntoRequests")?.isNotEmpty())
    @throwTypeError("There are still pending read requests, cannot release the lock");
  @readableStreamReaderGenericRelease(this);
})
(function (controller, view) {"use strict";
  if (arguments.length !== 3 && arguments[2] !== @isReadableStream)
    @throwTypeError("ReadableStreamBYOBRequest constructor should not be called directly");
  return @privateInitializeReadableStreamBYOBRequest.@call(this, controller, view);
})
(function (bytesWritten) {"use strict";
  if (!@isReadableStreamBYOBRequest(this))
    throw @makeErrorWithCode(139, "ReadableStreamBYOBRequest");
  if (@getByIdDirectPrivate(this, "associatedReadableByteStreamController") == null)
    throw @makeErrorWithCode(137, "This BYOB request has been invalidated");
  return @readableByteStreamControllerRespond(@getByIdDirectPrivate(this, "associatedReadableByteStreamController"), bytesWritten);
})
(function (view) {"use strict";
  if (!@isReadableStreamBYOBRequest(this))
    throw @makeErrorWithCode(139, "ReadableStreamBYOBRequest");
  if (@getByIdDirectPrivate(this, "associatedReadableByteStreamController") == null)
    throw @makeErrorWithCode(137, "This BYOB request has been invalidated");
  if (!@isObject(view))
    throw @makeErrorWithCode(119, "view", "Buffer, TypedArray, or DataView", view);
  if (!@ArrayBuffer.@isView(view))
    throw @makeErrorWithCode(119, "view", "Buffer, TypedArray, or DataView", view);
  return @readableByteStreamControllerRespondWithNewView(@getByIdDirectPrivate(this, "associatedReadableByteStreamController"), view);
})
(function () {"use strict";
  if (!@isReadableStreamBYOBRequest(this))
    throw @makeErrorWithCode(139, "ReadableStreamBYOBRequest");
  return @getByIdDirectPrivate(this, "view");
})
(function () {"use strict";
  if (!@isReadableStreamDefaultController(this))
    throw @makeErrorWithCode(139, "ReadableStreamDefaultController");
  if (!@readableStreamDefaultControllerCanCloseOrEnqueue(this))
    throw @makeErrorWithCode(137, "Controller is already closed");
  @readableStreamDefaultControllerClose(this);
})
(function () {"use strict";
  if (!@isReadableStreamDefaultController(this))
    throw @makeGetterTypeError("ReadableStreamDefaultController", "desiredSize");
  return @readableStreamDefaultControllerGetDesiredSize(this);
})
(function (chunk) {"use strict";
  if (!@isReadableStreamDefaultController(this))
    throw @makeErrorWithCode(139, "ReadableStreamDefaultController");
  if (!@readableStreamDefaultControllerCanCloseOrEnqueue(this))
    throw @makeErrorWithCode(137, "Controller is already closed");
  return @readableStreamDefaultControllerEnqueue(this, chunk);
})
(function (err) {"use strict";
  if (!@isReadableStreamDefaultController(this))
    throw @makeErrorWithCode(139, "ReadableStreamDefaultController");
  @readableStreamDefaultControllerError(this, err);
})
(function (stream, underlyingSource, size, highWaterMark) {"use strict";
  if (arguments.length !== 5 && arguments[4] !== @isReadableStream)
    @throwTypeError("ReadableStreamDefaultController constructor should not be called directly");
  return @privateInitializeReadableStreamDefaultController.@call(this, stream, underlyingSource, size, highWaterMark);
})
(function (reason) {"use strict";
  if (!@isReadableStreamDefaultReader(this))
    return @Promise.@reject(@makeErrorWithCode(139, "ReadableStreamDefaultReader"));
  if (!@getByIdDirectPrivate(this, "ownerReadableStream"))
    return @Promise.@reject(@makeErrorWithCode(137, "The reader is not attached to a stream"));
  return @readableStreamReaderGenericCancel(this, reason);
})
(function () {"use strict";
  if (!@isReadableStreamDefaultReader(this))
    return @Promise.@reject(@makeGetterTypeError("ReadableStreamDefaultReader", "closed"));
  return @getByIdDirectPrivate(this, "closedPromiseCapability").promise;
})
(function (stream) {"use strict";
  if (!@isReadableStream(stream))
    @throwTypeError("ReadableStreamDefaultReader needs a ReadableStream");
  if (@isReadableStreamLocked(stream))
    @throwTypeError("ReadableStream is locked");
  return @readableStreamReaderGenericInitialize(this, stream), @putByIdDirectPrivate(this, "readRequests", @createFIFO()), this;
})
(function () {"use strict";
  if (!@isReadableStreamDefaultReader(this))
    return @Promise.@reject(@makeErrorWithCode(139, "ReadableStreamDefaultReader"));
  if (!@getByIdDirectPrivate(this, "ownerReadableStream"))
    return @Promise.@reject(@makeErrorWithCode(137, "The reader is not attached to a stream"));
  return @readableStreamDefaultReaderRead(this);
})
(function () {"use strict";
  if (!@isReadableStreamDefaultReader(this))
    @throwTypeError("ReadableStreamDefaultReader.readMany() should not be called directly");
  let stream = @getByIdDirectPrivate(this, "ownerReadableStream");
  if (!stream)
    throw @makeErrorWithCode(137, "The reader is not attached to a stream");
  let state = @getByIdDirectPrivate(stream, "state");
  if (stream.@disturbed = !0, state === 3)
    throw @getByIdDirectPrivate(stream, "storedError");
  var controller = @getByIdDirectPrivate(stream, "readableStreamController");
  if (controller)
    var queue = @getByIdDirectPrivate(controller, "queue");
  if (!queue && state !== 1)
    return controller.@pull(controller).@then(function({ done, value }) {
      return done ? { done: !0, value: value ? [value] : [], size: 0 } : { value: [value], size: 1, done: !1 };
    });
  else if (!queue)
    return { done: !0, value: [], size: 0 };
  let content = queue.content;
  var size = queue.size, values = content.toArray(!1), length = values.length;
  if (length > 0) {
    var outValues = @newArrayWithSize(length);
    if (@isReadableByteStreamController(controller)) {
      {
        let buf = values[0];
        if (!(@ArrayBuffer.@isView(buf) || buf instanceof @ArrayBuffer))
          @putByValDirect(outValues, 0, new @Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength));
        else
          @putByValDirect(outValues, 0, buf);
      }
      for (var i = 1;i < length; i++) {
        let buf = values[i];
        if (!(@ArrayBuffer.@isView(buf) || buf instanceof @ArrayBuffer))
          @putByValDirect(outValues, i, new @Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength));
        else
          @putByValDirect(outValues, i, buf);
      }
    } else {
      @putByValDirect(outValues, 0, values[0].value);
      for (var i = 1;i < length; i++)
        @putByValDirect(outValues, i, values[i].value);
    }
    if (state !== 1) {
      if (@getByIdDirectPrivate(controller, "closeRequested"))
        @readableStreamCloseIfPossible(@getByIdDirectPrivate(controller, "controlledReadableStream"));
      else if (@isReadableStreamDefaultController(controller))
        @readableStreamDefaultControllerCallPullIfNeeded(controller);
      else if (@isReadableByteStreamController(controller))
        @readableByteStreamControllerCallPullIfNeeded(controller);
    }
    return @resetQueue(@getByIdDirectPrivate(controller, "queue")), { value: outValues, size, done: !1 };
  }
  var onPullMany = (result) => {
    let resultValue = result.value;
    if (result.done)
      return { value: resultValue ? [resultValue] : [], size: 0, done: !0 };
    var controller2 = @getByIdDirectPrivate(stream, "readableStreamController"), queue2 = @getByIdDirectPrivate(controller2, "queue"), value = [resultValue].concat(queue2.content.toArray(!1)), length2 = value.length;
    if (@isReadableByteStreamController(controller2))
      for (var i2 = 0;i2 < length2; i2++) {
        let buf = value[i2];
        if (!(@ArrayBuffer.@isView(buf) || buf instanceof @ArrayBuffer)) {
          let { buffer, byteOffset, byteLength } = buf;
          @putByValDirect(value, i2, new @Uint8Array(buffer, byteOffset, byteLength));
        }
      }
    else
      for (var i2 = 1;i2 < length2; i2++)
        @putByValDirect(value, i2, value[i2].value);
    var size2 = queue2.size;
    if (@getByIdDirectPrivate(controller2, "closeRequested"))
      @readableStreamCloseIfPossible(@getByIdDirectPrivate(controller2, "controlledReadableStream"));
    else if (@isReadableStreamDefaultController(controller2))
      @readableStreamDefaultControllerCallPullIfNeeded(controller2);
    else if (@isReadableByteStreamController(controller2))
      @readableByteStreamControllerCallPullIfNeeded(controller2);
    return @resetQueue(@getByIdDirectPrivate(controller2, "queue")), { value, size: size2, done: !1 };
  };
  if (state === 1)
    return { value: [], size: 0, done: !0 };
  var pullResult = controller.@pull(controller);
  if (pullResult && @isPromise(pullResult))
    return pullResult.then(onPullMany);
  return onPullMany(pullResult);
})
(function () {"use strict";
  if (!@isReadableStreamDefaultReader(this))
    throw @makeErrorWithCode(139, "ReadableStreamDefaultReader");
  if (!@getByIdDirectPrivate(this, "ownerReadableStream"))
    return;
  @readableStreamDefaultReaderRelease(this);
})
(function (stream) {"use strict";
  var start = @getByIdDirectPrivate(stream, "start");
  if (start)
    start.@call(stream);
  return new @ReadableStreamDefaultReader(stream);
})
(function (stream, sink) {"use strict";
  let highWaterMark = @getByIdDirectPrivate(stream, "highWaterMark") || 0, error = null, reading = !1, closed = !1, reader;
  function releaseReader() {
    if (reader) {
      try {
        reader.releaseLock();
      } catch {}
      reader = @undefined;
    }
    if (sink = @undefined, stream) {
      var streamState = @getByIdDirectPrivate(stream, "state"), readableStreamController = @getByIdDirectPrivate(stream, "readableStreamController");
      if (readableStreamController) {
        if (@getByIdDirectPrivate(readableStreamController, "underlyingSource"))
          @putByIdDirectPrivate(readableStreamController, "underlyingSource", null);
        if (@getByIdDirectPrivate(readableStreamController, "controlledReadableStream"))
          @putByIdDirectPrivate(readableStreamController, "controlledReadableStream", null);
        if (@putByIdDirectPrivate(stream, "readableStreamController", null), @getByIdDirectPrivate(stream, "underlyingSource"))
          @putByIdDirectPrivate(stream, "underlyingSource", null);
        readableStreamController = @undefined;
      }
      if (stream && !error && streamState !== 1 && streamState !== 3)
        @readableStreamCloseIfPossible(stream);
      stream = @undefined;
    }
  }
  function endSink(...args) {
    try {
      sink?.end(...args);
    } catch {}
    releaseReader();
  }
  try {
    let cancelStream2 = function(_, reason) {
      if (closed)
        return;
      let wasClosed = closed;
      if (closed = !0, stream && !error && !wasClosed && stream.@state !== 1)
        @readableStreamCancel(stream, reason);
      releaseReader();
    };
    var cancelStream = cancelStream2;
    sink.start({ highWaterMark }), reader = stream.getReader();
    async function drainReaderIntoSink() {
      if (error || closed || reading)
        return;
      reading = !0;
      try {
        while (!0) {
          var { value, done } = await reader.read();
          if (closed)
            break;
          if (done) {
            if (closed = !0, value)
              sink.write(value);
            return endSink();
          }
          if (value) {
            if (!sink.write(value))
              break;
          }
        }
      } catch (e) {
        error = e, closed = !0;
        try {
          let prom = stream?.cancel(e);
          if (@isPromise(prom))
            @markPromiseAsHandled(prom);
        } catch {}
        queueMicrotask(endSink.bind(null, e));
      } finally {
        reading = !1;
      }
    }
    sink.setHandlers(drainReaderIntoSink, cancelStream2), drainReaderIntoSink();
  } catch (e) {
    error = e, closed = !0, queueMicrotask(endSink.bind(null, e));
  }
})
(function (stream, sink) {"use strict";
  var underlyingSource = @getByIdDirectPrivate(stream, "underlyingSource");
  if (underlyingSource)
    try {
      return @readDirectStream(stream, sink, underlyingSource);
    } finally {
      underlyingSource = @undefined, stream = @undefined, sink = @undefined;
    }
  return @readStreamIntoSink(stream, sink, !0);
})
(function () {"use strict";
  function callClose(controller) {
    try {
      var source = controller.@underlyingSource;
      if (!@readableStreamDefaultControllerCanCloseOrEnqueue(controller))
        return;
      controller.close();
    } catch (e) {
      globalThis.reportError(e);
    } finally {
      if (source?.@stream)
        source.@stream = @undefined;
      if (source)
        source.@data = @undefined;
    }
  }

  class NativeReadableStreamSource {
    constructor(handle, autoAllocateChunkSize, drainValue) {
      if (@putByIdDirectPrivate(this, "stream", handle), this.pull = this.#pull.bind(this), this.cancel = this.#cancel.bind(this), this.autoAllocateChunkSize = autoAllocateChunkSize, drainValue !== @undefined)
        this.start = (controller) => {
          this.start = @undefined, this.#controller = new WeakRef(controller), controller.enqueue(drainValue);
        };
      handle.onClose = this.#onClose.bind(this), handle.onDrain = this.#onDrain.bind(this);
    }
    #onDrain(chunk) {
      var controller = this.#controller?.deref?.();
      if (controller)
        controller.enqueue(chunk);
    }
    #hasResized = !1;
    #adjustHighWaterMark(result) {
      let autoAllocateChunkSize = this.autoAllocateChunkSize;
      if (result >= autoAllocateChunkSize && !this.#hasResized)
        this.#hasResized = !0, this.autoAllocateChunkSize = Math.min(autoAllocateChunkSize * 2, 2097152);
    }
    #controller;
    pull;
    cancel;
    start;
    autoAllocateChunkSize = 0;
    #closed = !1;
    #closer = [!1];
    @data;
    @stream;
    #onClose() {
      this.#closed = !0;
      var controller = this.#controller?.deref?.();
      if (this.#controller = @undefined, this.@data = @undefined, @putByIdDirectPrivate(this, "stream", @undefined), controller)
        @enqueueJob(callClose, controller);
    }
    #getInternalBuffer(chunkSize) {
      var chunk = this.@data;
      if (!chunk || chunk.length < chunkSize)
        this.@data = chunk = new @Uint8Array(chunkSize);
      return chunk;
    }
    #handleArrayBufferViewResult(result, view, isClosed, controller) {
      if (result.byteLength > 0)
        controller.enqueue(result);
      if (isClosed)
        return @enqueueJob(callClose, controller), @undefined;
      return view;
    }
    #handleNumberResult(result, view, isClosed, controller) {
      if (result > 0) {
        let remaining = view.length - result, toEnqueue = view;
        if (remaining > 0)
          toEnqueue = view.subarray(0, result), view = view.subarray(result);
        else
          view = @undefined;
        controller.enqueue(toEnqueue);
      }
      if (isClosed)
        return @enqueueJob(callClose, controller), @undefined;
      return view;
    }
    #onNativeReadableStreamResult(result, view, isClosed, controller) {
      if (typeof result === "number") {
        if (!isClosed)
          this.#adjustHighWaterMark(result);
        return this.#handleNumberResult(result, view, isClosed, controller);
      } else if (typeof result === "boolean")
        return @enqueueJob(callClose, controller), @undefined;
      else if (@isTypedArrayView(result)) {
        if (!isClosed)
          this.#adjustHighWaterMark(result.byteLength);
        return this.#handleArrayBufferViewResult(result, view, isClosed, controller);
      }
      throw @makeErrorWithCode(136, "Internal error: invalid result from pull. This is a bug in Bun. Please report it.");
    }
    #pull(controller) {
      var handle = @getByIdDirectPrivate(this, "stream");
      if (!handle || this.#closed) {
        this.#controller = @undefined, this.#closed = !0, @putByIdDirectPrivate(this, "stream", @undefined), @enqueueJob(callClose, controller), this.@data = @undefined;
        return;
      }
      if (!this.#controller)
        this.#controller = new WeakRef(controller);
      let closer = this.#closer;
      if (closer[0] = !1, this.@data) {
        let drainResult = handle.drain();
        if (drainResult) {
          this.@data = this.#onNativeReadableStreamResult(drainResult, this.@data, closer[0], controller);
          return;
        }
      }
      let view = this.#getInternalBuffer(this.autoAllocateChunkSize), result = handle.pull(view, closer);
      if (@isPromise(result))
        return result.@then((result2) => {
          if (this.@data = this.#onNativeReadableStreamResult(result2, view, closer[0], controller), this.#closed)
            this.@data = @undefined;
        }, (err) => {
          this.@data = @undefined, this.#closed = !0, this.#controller = @undefined, controller.error(err), this.#onClose();
        });
      if (this.@data = this.#onNativeReadableStreamResult(result, view, closer[0], controller), this.#closed)
        this.@data = @undefined;
    }
    #cancel(reason) {
      var handle = @getByIdDirectPrivate(this, "stream");
      if (this.@data = @undefined, handle)
        handle.updateRef(!1), handle.cancel(reason), @putByIdDirectPrivate(this, "stream", @undefined);
    }
  }
  return NativeReadableStreamSource.prototype.@resume = function(has_ref) {
    var handle = @getByIdDirectPrivate(this, "stream");
    if (handle)
      handle.updateRef(has_ref);
  }, NativeReadableStreamSource;
})
(function (stream, underlyingSource, strategy) {"use strict";
  let type = underlyingSource.type, typeString = @toString(type);
  if (typeString === "bytes") {
    if (strategy.highWaterMark === @undefined)
      strategy.highWaterMark = 0;
    if (strategy.size !== @undefined)
      @throwRangeError("Strategy for a ReadableByteStreamController cannot have a size");
    @putByIdDirectPrivate(stream, "readableStreamController", new @ReadableByteStreamController(stream, underlyingSource, strategy.highWaterMark, @isReadableStream));
  } else if (typeString === "direct") {
    var highWaterMark = strategy?.highWaterMark;
    @initializeArrayBufferStream.@call(stream, underlyingSource, highWaterMark);
  } else if (type === @undefined) {
    if (strategy.highWaterMark === @undefined)
      strategy.highWaterMark = 1;
    @setupReadableStreamDefaultController(stream, underlyingSource, strategy.size, strategy.highWaterMark, underlyingSource.start, underlyingSource.pull, underlyingSource.cancel);
  } else
    @throwRangeError("Invalid type for underlying source");
})
(function (_highWaterMark) {"use strict";
  var sink, array = [], hasString = !1, hasBuffer = !1, rope = "", estimatedLength = @toLength(0), capability = @newPromiseCapability(@Promise), calledDone = !1;
  return sink = {
    start() {},
    write(chunk) {
      if (typeof chunk === "string") {
        var chunkLength = @toLength(chunk.length);
        if (chunkLength > 0)
          rope += chunk, hasString = !0, estimatedLength += chunkLength;
        return chunkLength;
      }
      if (!chunk || !(@ArrayBuffer.@isView(chunk) || chunk instanceof @ArrayBuffer))
        @throwTypeError("Expected text, ArrayBuffer or ArrayBufferView");
      let byteLength = @toLength(chunk.byteLength);
      if (byteLength > 0)
        if (hasBuffer = !0, rope.length > 0)
          @arrayPush(array, rope), @arrayPush(array, chunk), rope = "";
        else
          @arrayPush(array, chunk);
      return estimatedLength += byteLength, byteLength;
    },
    flush() {
      return 0;
    },
    end() {
      if (calledDone)
        return "";
      return sink.fulfill();
    },
    fulfill() {
      calledDone = !0;
      let result = sink.finishInternal();
      return @fulfillPromise(capability.promise, result), result;
    },
    finishInternal() {
      if (!hasString && !hasBuffer)
        return "";
      if (hasString && !hasBuffer) {
        if (rope.charCodeAt(0) === 65279)
          rope = rope.slice(1);
        return rope;
      }
      if (hasBuffer && !hasString)
        return new globalThis.TextDecoder("utf-8", { ignoreBOM: !0 }).decode(Bun.concatArrayBuffers(array));
      var arrayBufferSink = new Bun.ArrayBufferSink;
      arrayBufferSink.start({
        highWaterMark: estimatedLength,
        asUint8Array: !0
      });
      for (let item of array)
        arrayBufferSink.write(item);
      if (array.length = 0, rope.length > 0) {
        if (rope.charCodeAt(0) === 65279)
          rope = rope.slice(1);
        arrayBufferSink.write(rope), rope = "";
      }
      return new globalThis.TextDecoder("utf-8", { ignoreBOM: !0 }).decode(arrayBufferSink.end());
    },
    close() {
      try {
        if (!calledDone)
          calledDone = !0, sink.fulfill();
      } catch {}
    }
  }, [sink, capability];
})
(function (e) {"use strict";
  var controller = this, sink = controller.@sink;
  if (sink) {
    @putByIdDirectPrivate(controller, "sink", @undefined);
    try {
      sink.close(e);
    } catch {}
  }
  if (this.error = this.flush = this.write = this.close = this.end = @onReadableStreamDirectControllerClosed, typeof this.@underlyingSource.close === "function")
    try {
      this.@underlyingSource.close.@call(this.@underlyingSource, e);
    } catch {}
  try {
    var pend = controller._pendingRead;
    if (pend)
      controller._pendingRead = @undefined, @rejectPromise(pend, e);
  } catch {}
  var stream = controller.@controlledReadableStream;
  if (stream)
    @readableStreamError(stream, e);
})
(function (e) {"use strict";
  return @handleDirectStreamError.@call(this, e), @Promise.@reject(e);
})
(function (underlyingSource, highWaterMark) {"use strict";
  var opts = highWaterMark && typeof highWaterMark === "number" ? { highWaterMark, stream: !0, asUint8Array: !0 } : { stream: !0, asUint8Array: !0 }, sink = new Bun.ArrayBufferSink;
  sink.start(opts);
  var controller = {
    @underlyingSource: underlyingSource,
    @pull: @onPullDirectStream,
    @controlledReadableStream: this,
    @sink: sink,
    close: @onCloseDirectStream,
    write: sink.write.bind(sink),
    error: @handleDirectStreamError,
    end: @onCloseDirectStream,
    @close: @onCloseDirectStream,
    flush: @onFlushDirectStream,
    _pendingRead: @undefined,
    _deferClose: 0,
    _deferFlush: 0,
    _deferCloseReason: @undefined,
    _handleError: @undefined
  };
  @putByIdDirectPrivate(this, "readableStreamController", controller), @putByIdDirectPrivate(this, "underlyingSource", null), @putByIdDirectPrivate(this, "start", @undefined);
})
(function (underlyingSource, _highWaterMark) {"use strict";
  var array = [], closingPromise = @newPromiseCapability(@Promise), calledDone = !1;
  function fulfill() {
    return calledDone = !0, closingPromise.resolve.@call(@undefined, array), array;
  }
  var sink = {
    start() {},
    write(chunk) {
      return @arrayPush(array, chunk), chunk.byteLength || chunk.length;
    },
    flush() {
      return 0;
    },
    end() {
      if (calledDone)
        return [];
      return fulfill();
    },
    close() {
      if (!calledDone)
        fulfill();
    }
  }, controller = {
    @underlyingSource: underlyingSource,
    @pull: @onPullDirectStream,
    @controlledReadableStream: this,
    @sink: sink,
    close: @onCloseDirectStream,
    write: sink.write,
    error: @handleDirectStreamError,
    end: @onCloseDirectStream,
    @close: @onCloseDirectStream,
    flush: @onFlushDirectStream,
    _pendingRead: @undefined,
    _deferClose: 0,
    _deferFlush: 0,
    _deferCloseReason: @undefined,
    _handleError: @undefined
  };
  return @putByIdDirectPrivate(this, "readableStreamController", controller), @putByIdDirectPrivate(this, "underlyingSource", null), @putByIdDirectPrivate(this, "start", @undefined), closingPromise;
})
(function (underlyingSource, highWaterMark) {"use strict";
  var [sink, closingPromise] = @createTextStream(highWaterMark), controller = {
    @underlyingSource: underlyingSource,
    @pull: @onPullDirectStream,
    @controlledReadableStream: this,
    @sink: sink,
    close: @onCloseDirectStream,
    write: sink.write,
    error: @handleDirectStreamError,
    end: @onCloseDirectStream,
    @close: @onCloseDirectStream,
    flush: @onFlushDirectStream,
    _pendingRead: @undefined,
    _deferClose: 0,
    _deferFlush: 0,
    _deferCloseReason: @undefined,
    _handleError: @undefined
  };
  return @putByIdDirectPrivate(this, "readableStreamController", controller), @putByIdDirectPrivate(this, "underlyingSource", null), @putByIdDirectPrivate(this, "start", @undefined), closingPromise;
})
(function (stream) {"use strict";
  return @isObject(stream) && @getByIdDirectPrivate(stream, "readableStreamController") !== @undefined;
})
(function (controller) {"use strict";
  return @isObject(controller) && @getByIdDirectPrivate(controller, "underlyingSource") !== @undefined;
})
(function (reader) {"use strict";
  return @isObject(reader) && !!@getByIdDirectPrivate(reader, "readRequests");
})
(function (stream) {"use strict";
  return stream.@disturbed;
})
(function (stream) {"use strict";
  return !!@getByIdDirectPrivate(stream, "reader") || stream.@bunNativePtr === -1;
})
(function (stream, autoAllocateChunkSize) {"use strict";
  var handle = stream.@bunNativePtr;
  if (handle === -1)
    return;
  var Prototype = @lazyStreamPrototypeMap.@get(@getPrototypeOf(handle));
  if (Prototype === @undefined)
    @lazyStreamPrototypeMap.@set(@getPrototypeOf(handle), Prototype = @createLazyLoadedStreamPrototype());
  if (stream.@disturbed = !0, autoAllocateChunkSize === @undefined)
    autoAllocateChunkSize = 262144;
  let chunkSizeOrCompleteBuffer = handle.start(autoAllocateChunkSize), chunkSize, drainValue;
  if (@isTypedArrayView(chunkSizeOrCompleteBuffer))
    chunkSize = 0, drainValue = chunkSizeOrCompleteBuffer;
  else
    chunkSize = chunkSizeOrCompleteBuffer, drainValue = handle.drain();
  if (chunkSize === 0) {
    if ((drainValue?.byteLength ?? 0) > 0)
      return {
        start(controller) {
          controller.enqueue(drainValue), controller.close();
        },
        pull(controller) {
          controller.close();
        }
      };
    return {
      start(controller) {
        controller.close();
      },
      pull(controller) {
        controller.close();
      }
    };
  }
  return new Prototype(handle, Math.max(chunkSize, autoAllocateChunkSize), drainValue);
})
(function () {"use strict";
  return @Promise.@resolve({ value: @undefined, done: !0 });
})
(function (reason) {"use strict";
  var stream = this.@controlledReadableStream;
  if (!stream || @getByIdDirectPrivate(stream, "state") !== 4)
    return;
  if (this._deferClose !== 0) {
    this._deferClose = 1, this._deferCloseReason = reason;
    return;
  }
  var sink = this.@sink;
  if (!sink)
    return;
  if (@putByIdDirectPrivate(stream, "state", 2), typeof this.@underlyingSource.close === "function")
    try {
      this.@underlyingSource.close.@call(this.@underlyingSource, reason);
    } catch {}
  var flushed;
  try {
    flushed = sink.end(), @putByIdDirectPrivate(this, "sink", @undefined);
  } catch (e) {
    if (this._pendingRead) {
      var read = this._pendingRead;
      this._pendingRead = @undefined, @rejectPromise(read, e);
    } else
      throw e;
    return;
  }
  this.error = this.flush = this.write = this.close = this.end = @onReadableStreamDirectControllerClosed;
  var reader = @getByIdDirectPrivate(stream, "reader");
  if (reader && @isReadableStreamDefaultReader(reader)) {
    var _pendingRead = this._pendingRead;
    if (_pendingRead && @isPromise(_pendingRead) && flushed?.byteLength) {
      this._pendingRead = @undefined, @fulfillPromise(_pendingRead, { value: flushed, done: !1 }), @readableStreamCloseIfPossible(stream);
      return;
    }
  }
  if (flushed?.byteLength) {
    var requests = @getByIdDirectPrivate(reader, "readRequests");
    if (requests?.isNotEmpty()) {
      @readableStreamFulfillReadRequest(stream, flushed, !1), @readableStreamCloseIfPossible(stream);
      return;
    }
    @putByIdDirectPrivate(stream, "state", 4), this.@pull = () => {
      var thisResult = @createFulfilledPromise({
        value: flushed,
        done: !1
      });
      return flushed = @undefined, @readableStreamCloseIfPossible(stream), stream = @undefined, thisResult;
    };
    return;
  }
  if (this._pendingRead) {
    var read = this._pendingRead;
    this._pendingRead = @undefined, @putByIdDirectPrivate(this, "pull", @noopDoneFunction), @fulfillPromise(read, { value: @undefined, done: !0 });
  }
  @readableStreamCloseIfPossible(stream);
})
(function () {"use strict";
  var stream = this.@controlledReadableStream;
  if (!stream)
    return;
  var sink = this.@sink;
  if (!sink)
    return;
  var reader = @getByIdDirectPrivate(stream, "reader");
  if (!reader || !@isReadableStreamDefaultReader(reader))
    return;
  var _pendingRead = this._pendingRead;
  if (this._pendingRead = @undefined, _pendingRead && @isPromise(_pendingRead)) {
    var flushed = sink.flush();
    if (flushed?.byteLength)
      this._pendingRead = @getByIdDirectPrivate(stream, "readRequests")?.shift(), @fulfillPromise(_pendingRead, { value: flushed, done: !1 });
    else
      this._pendingRead = _pendingRead;
  } else if (@getByIdDirectPrivate(stream, "readRequests")?.isNotEmpty()) {
    var flushed = sink.flush();
    if (flushed?.byteLength)
      @readableStreamFulfillReadRequest(stream, flushed, !1);
  } else if (this._deferFlush === -1)
    this._deferFlush = 1;
})
(function (controller) {"use strict";
  var stream = controller.@controlledReadableStream;
  if (!stream || @getByIdDirectPrivate(stream, "state") !== 4)
    return;
  if (controller._deferClose === -1)
    return;
  controller._deferClose = -1, controller._deferFlush = -1;
  var deferClose, deferFlush, asyncContext = stream.@asyncContext;
  if (asyncContext) {
    var prev = @getInternalField(@asyncContext, 0);
    @putInternalField(@asyncContext, 0, asyncContext);
  }
  try {
    var result = controller.@underlyingSource.pull(controller);
    if (result && @isPromise(result)) {
      if (controller._handleError === @undefined)
        controller._handleError = @handleDirectStreamErrorReject.bind(controller);
      result.catch(controller._handleError);
    }
  } catch (e) {
    return @handleDirectStreamErrorReject.@call(controller, e);
  } finally {
    if (deferClose = controller._deferClose, deferFlush = controller._deferFlush, controller._deferFlush = controller._deferClose = 0, asyncContext)
      @putInternalField(@asyncContext, 0, prev);
  }
  var promiseToReturn;
  if (controller._pendingRead === @undefined)
    controller._pendingRead = promiseToReturn = @newPromise();
  else
    promiseToReturn = @readableStreamAddReadRequest(stream);
  if (deferClose === 1) {
    var reason = controller._deferCloseReason;
    return controller._deferCloseReason = @undefined, @onCloseDirectStream.@call(controller, reason), promiseToReturn;
  }
  if (deferFlush === 1)
    @onFlushDirectStream.@call(controller);
  return promiseToReturn;
})
(function (_reason) {"use strict";
  @throwTypeError("ReadableStreamDirectController is now closed");
})
(function (pipeState) {"use strict";
  if (!@writableStreamCloseQueuedOrInFlight(pipeState.destination) && @getByIdDirectPrivate(pipeState.destination, "state") !== "closed")
    return;
  let error = @makeTypeError("closing is propagated backward");
  if (!pipeState.preventCancel) {
    @pipeToShutdownWithAction(pipeState, () => @readableStreamCancel(pipeState.source, error), error);
    return;
  }
  @pipeToShutdown(pipeState, error);
})
(function (pipeState) {"use strict";
  let action = () => {
    if (pipeState.pendingReadPromiseCapability.resolve.@call(@undefined, !1), !pipeState.preventClose) {
      @pipeToShutdownWithAction(pipeState, () => @writableStreamDefaultWriterCloseWithErrorPropagation(pipeState.writer));
      return;
    }
    @pipeToShutdown(pipeState);
  };
  if (@getByIdDirectPrivate(pipeState.source, "state") === 1) {
    action();
    return;
  }
  @getByIdDirectPrivate(pipeState.reader, "closedPromiseCapability").promise.@then(action, () => {});
})
(function (pipeState) {"use strict";
  return pipeState.pendingReadPromiseCapability = @newPromiseCapability(@Promise), @getByIdDirectPrivate(pipeState.writer, "readyPromise").promise.@then(() => {
    if (pipeState.shuttingDown) {
      pipeState.pendingReadPromiseCapability.resolve.@call(@undefined, !1);
      return;
    }
    @readableStreamDefaultReaderRead(pipeState.reader).@then((result) => {
      let canWrite = !result.done && @getByIdDirectPrivate(pipeState.writer, "stream") !== @undefined;
      if (pipeState.pendingReadPromiseCapability.resolve.@call(@undefined, canWrite), !canWrite)
        return;
      pipeState.pendingWritePromise = @writableStreamDefaultWriterWrite(pipeState.writer, result.value).@then(@undefined, () => {});
    }, (_e) => {
      pipeState.pendingReadPromiseCapability.resolve.@call(@undefined, !1);
    });
  }, (_e) => {
    pipeState.pendingReadPromiseCapability.resolve.@call(@undefined, !1);
  }), pipeState.pendingReadPromiseCapability.promise;
})
(function (pipeState) {"use strict";
  let action = () => {
    let error = @getByIdDirectPrivate(pipeState.destination, "storedError");
    if (!pipeState.preventCancel) {
      @pipeToShutdownWithAction(pipeState, () => @readableStreamCancel(pipeState.source, error), error);
      return;
    }
    @pipeToShutdown(pipeState, error);
  };
  if (@getByIdDirectPrivate(pipeState.destination, "state") === "errored") {
    action();
    return;
  }
  @getByIdDirectPrivate(pipeState.writer, "closedPromise").promise.@then(@undefined, action);
})
(function (pipeState) {"use strict";
  let action = () => {
    pipeState.pendingReadPromiseCapability.resolve.@call(@undefined, !1);
    let error = @getByIdDirectPrivate(pipeState.source, "storedError");
    if (!pipeState.preventAbort) {
      @pipeToShutdownWithAction(pipeState, () => @writableStreamAbort(pipeState.destination, error), error);
      return;
    }
    @pipeToShutdown(pipeState, error);
  };
  if (@getByIdDirectPrivate(pipeState.source, "state") === 3) {
    action();
    return;
  }
  @getByIdDirectPrivate(pipeState.reader, "closedPromiseCapability").promise.@then(@undefined, action);
})
(function (pipeState) {"use strict";
  @writableStreamDefaultWriterRelease(pipeState.writer), @readableStreamReaderGenericRelease(pipeState.reader);
  let signal = pipeState.signal;
  if (signal)
    @removeAbortAlgorithmFromSignal(signal, pipeState.abortAlgorithmIdentifier);
  if (arguments.length > 1)
    pipeState.promiseCapability.reject.@call(@undefined, arguments[1]);
  else
    pipeState.promiseCapability.resolve.@call();
})
(function (pipeState) {"use strict";
  if (pipeState.shuttingDown)
    return;
  @pipeToDoReadWrite(pipeState).@then((result) => {
    if (result)
      @pipeToLoop(pipeState);
  });
})
(function (pipeState) {"use strict";
  if (pipeState.shuttingDown)
    return;
  pipeState.shuttingDown = !0;
  let hasError = arguments.length > 1, error = arguments[1], finalize = () => {
    if (hasError)
      @pipeToFinalize(pipeState, error);
    else
      @pipeToFinalize(pipeState);
  };
  if (@getByIdDirectPrivate(pipeState.destination, "state") === "writable" && !@writableStreamCloseQueuedOrInFlight(pipeState.destination)) {
    pipeState.pendingReadPromiseCapability.promise.@then(() => {
      pipeState.pendingWritePromise.@then(finalize, finalize);
    }, (e) => @pipeToFinalize(pipeState, e));
    return;
  }
  finalize();
})
(function (pipeState, action) {"use strict";
  if (pipeState.shuttingDown)
    return;
  pipeState.shuttingDown = !0;
  let hasError = arguments.length > 2, error = arguments[2], finalize = () => {
    action().@then(() => {
      if (hasError)
        @pipeToFinalize(pipeState, error);
      else
        @pipeToFinalize(pipeState);
    }, (e) => {
      @pipeToFinalize(pipeState, e);
    });
  };
  if (@getByIdDirectPrivate(pipeState.destination, "state") === "writable" && !@writableStreamCloseQueuedOrInFlight(pipeState.destination)) {
    pipeState.pendingReadPromiseCapability.promise.@then(() => {
      pipeState.pendingWritePromise.@then(finalize, finalize);
    }, (e) => @pipeToFinalize(pipeState, e));
    return;
  }
  finalize();
})
(function (stream, underlyingSource, size, highWaterMark) {"use strict";
  if (!@isReadableStream(stream))
    @throwTypeError("ReadableStreamDefaultController needs a ReadableStream");
  if (@getByIdDirectPrivate(stream, "readableStreamController") !== null)
    @throwTypeError("ReadableStream already has a controller");
  return @putByIdDirectPrivate(this, "controlledReadableStream", stream), @putByIdDirectPrivate(this, "underlyingSource", underlyingSource), @putByIdDirectPrivate(this, "queue", @newQueue()), @putByIdDirectPrivate(this, "started", -1), @putByIdDirectPrivate(this, "closeRequested", !1), @putByIdDirectPrivate(this, "pullAgain", !1), @putByIdDirectPrivate(this, "pulling", !1), @putByIdDirectPrivate(this, "strategy", @validateAndNormalizeQueuingStrategy(size, highWaterMark)), this;
})
(function (stream) {"use strict";
  let readRequest = @newPromise();
  return @getByIdDirectPrivate(@getByIdDirectPrivate(stream, "reader"), "readRequests").push(readRequest), readRequest;
})
(function (stream, reason) {"use strict";
  stream.@disturbed = !0;
  let state = @getByIdDirectPrivate(stream, "state");
  if (state === 1)
    return @Promise.@resolve();
  if (state === 3)
    return @Promise.@reject(@getByIdDirectPrivate(stream, "storedError"));
  @readableStreamClose(stream);
  let controller = @getByIdDirectPrivate(stream, "readableStreamController");
  if (controller === null)
    return @Promise.@resolve();
  let cancel = controller.@cancel;
  if (cancel)
    return cancel(controller, reason).@then(function() {});
  if (controller.close)
    return @Promise.@resolve(controller.close(reason));
  @throwTypeError("ReadableStreamController has no cancel or close method");
})
(function (stream) {"use strict";
  @putByIdDirectPrivate(stream, "state", 1);
  let reader = @getByIdDirectPrivate(stream, "reader");
  if (!reader)
    return;
  if (@isReadableStreamDefaultReader(reader)) {
    let requests = @getByIdDirectPrivate(reader, "readRequests");
    if (requests.isNotEmpty()) {
      @putByIdDirectPrivate(reader, "readRequests", @createFIFO());
      for (var request = requests.shift();request; request = requests.shift())
        @fulfillPromise(request, { value: @undefined, done: !0 });
    }
  }
  @getByIdDirectPrivate(@getByIdDirectPrivate(stream, "reader"), "closedPromiseCapability").resolve.@call();
})
(function (stream) {"use strict";
  switch (@getByIdDirectPrivate(stream, "state")) {
    case 4:
    case 2: {
      @readableStreamClose(stream);
      break;
    }
  }
})
(function (controller) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "controlledReadableStream");
  if (!@readableStreamDefaultControllerCanCloseOrEnqueue(controller))
    return;
  if (@getByIdDirectPrivate(controller, "started") !== 1)
    return;
  if ((!@isReadableStreamLocked(stream) || !@getByIdDirectPrivate(@getByIdDirectPrivate(stream, "reader"), "readRequests")?.isNotEmpty()) && @readableStreamDefaultControllerGetDesiredSize(controller) <= 0)
    return;
  if (@getByIdDirectPrivate(controller, "pulling")) {
    @putByIdDirectPrivate(controller, "pullAgain", !0);
    return;
  }
  @putByIdDirectPrivate(controller, "pulling", !0), @getByIdDirectPrivate(controller, "pullAlgorithm").@call(@undefined).@then(function() {
    if (@putByIdDirectPrivate(controller, "pulling", !1), @getByIdDirectPrivate(controller, "pullAgain"))
      @putByIdDirectPrivate(controller, "pullAgain", !1), @readableStreamDefaultControllerCallPullIfNeeded(controller);
  }, function(error) {
    @readableStreamDefaultControllerError(controller, error);
  });
})
(function (controller, reason) {"use strict";
  return @putByIdDirectPrivate(controller, "queue", @newQueue()), @getByIdDirectPrivate(controller, "cancelAlgorithm").@call(@undefined, reason);
})
(function (controller) {"use strict";
  if (@getByIdDirectPrivate(controller, "closeRequested"))
    return !1;
  let controlledReadableStream = @getByIdDirectPrivate(controller, "controlledReadableStream");
  if (!@isObject(controlledReadableStream))
    return !1;
  return @getByIdDirectPrivate(controlledReadableStream, "state") === 4;
})
(function (controller) {"use strict";
  if (@putByIdDirectPrivate(controller, "closeRequested", !0), @getByIdDirectPrivate(controller, "queue")?.content?.isEmpty())
    @readableStreamCloseIfPossible(@getByIdDirectPrivate(controller, "controlledReadableStream"));
})
(function (controller, chunk) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "controlledReadableStream");
  if (@isReadableStreamLocked(stream) && @getByIdDirectPrivate(@getByIdDirectPrivate(stream, "reader"), "readRequests")?.isNotEmpty()) {
    @readableStreamFulfillReadRequest(stream, chunk, !1), @readableStreamDefaultControllerCallPullIfNeeded(controller);
    return;
  }
  try {
    let chunkSize = 1;
    if (@getByIdDirectPrivate(controller, "strategy").size !== @undefined)
      chunkSize = @getByIdDirectPrivate(controller, "strategy").size(chunk);
    @enqueueValueWithSize(@getByIdDirectPrivate(controller, "queue"), chunk, chunkSize);
  } catch (error) {
    throw @readableStreamDefaultControllerError(controller, error), error;
  }
  @readableStreamDefaultControllerCallPullIfNeeded(controller);
})
(function (controller, error) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "controlledReadableStream");
  if (!@isObject(stream) || @getByIdDirectPrivate(stream, "state") !== 4)
    return;
  @putByIdDirectPrivate(controller, "queue", @newQueue()), @readableStreamError(stream, error);
})
(function (controller) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "controlledReadableStream");
  if (!stream)
    return null;
  let state = @getByIdDirectPrivate(stream, "state");
  if (state === 3)
    return null;
  if (state === 1)
    return 0;
  return @getByIdDirectPrivate(controller, "strategy").highWaterMark - @getByIdDirectPrivate(controller, "queue").size;
})
(function (controller) {"use strict";
  var queue = @getByIdDirectPrivate(controller, "queue");
  if (queue.content.isNotEmpty()) {
    let chunk = @dequeueValue(queue);
    if (@getByIdDirectPrivate(controller, "closeRequested") && queue.content.isEmpty())
      @readableStreamCloseIfPossible(@getByIdDirectPrivate(controller, "controlledReadableStream"));
    else
      @readableStreamDefaultControllerCallPullIfNeeded(controller);
    return @createFulfilledPromise({ value: chunk, done: !1 });
  }
  let pendingPromise = @readableStreamAddReadRequest(@getByIdDirectPrivate(controller, "controlledReadableStream"));
  return @readableStreamDefaultControllerCallPullIfNeeded(controller), pendingPromise;
})
(function (controller) {"use strict";
  if (!@readableStreamDefaultControllerCanCloseOrEnqueue(controller))
    return !1;
  if (@getByIdDirectPrivate(controller, "started") !== 1)
    return !1;
  let stream = @getByIdDirectPrivate(controller, "controlledReadableStream");
  if ((!@isReadableStreamLocked(stream) || !@getByIdDirectPrivate(@getByIdDirectPrivate(stream, "reader"), "readRequests")?.isNotEmpty()) && @readableStreamDefaultControllerGetDesiredSize(controller) <= 0)
    return !1;
  return @readableStreamDefaultControllerGetDesiredSize(controller) > 0;
})
(function (controller) {"use strict";
  if (@getByIdDirectPrivate(controller, "started") !== -1)
    return;
  let underlyingSource = @getByIdDirectPrivate(controller, "underlyingSource"), startMethod = underlyingSource.start;
  @putByIdDirectPrivate(controller, "started", 0), @promiseInvokeOrNoopMethodNoCatch(underlyingSource, startMethod, [controller]).@then(() => {
    @putByIdDirectPrivate(controller, "started", 1), @readableStreamDefaultControllerCallPullIfNeeded(controller);
  }, (error) => {
    @readableStreamDefaultControllerError(controller, error);
  });
})
(function (reader, error) {"use strict";
  let requests = @getByIdDirectPrivate(reader, "readRequests");
  @putByIdDirectPrivate(reader, "readRequests", @createFIFO());
  for (var request = requests.shift();request; request = requests.shift())
    @rejectPromise(request, error);
})
(function (reader) {"use strict";
  let stream = @getByIdDirectPrivate(reader, "ownerReadableStream"), state = @getByIdDirectPrivate(stream, "state");
  if (stream.@disturbed = !0, state === 1)
    return @createFulfilledPromise({ value: @undefined, done: !0 });
  if (state === 3)
    return @Promise.@reject(@getByIdDirectPrivate(stream, "storedError"));
  return @getByIdDirectPrivate(stream, "readableStreamController").@pull(@getByIdDirectPrivate(stream, "readableStreamController"));
})
(function (reader) {"use strict";
  @readableStreamReaderGenericRelease(reader), @readableStreamDefaultReaderErrorReadRequests(reader, @makeErrorWithCode(233, "Stream reader cancelled via releaseLock()"));
})
(function (prototype) {"use strict";
  var asyncIterator = globalThis.Symbol.asyncIterator, ReadableStreamAsyncIterator = async function* ReadableStreamAsyncIterator2(stream, preventCancel) {
    var reader = stream.getReader(), deferredError;
    try {
      while (!0) {
        var done, value;
        let firstResult = reader.readMany();
        if (@isPromise(firstResult))
          ({ done, value } = await firstResult);
        else
          ({ done, value } = firstResult);
        if (done)
          return;
        yield* value;
      }
    } catch (e) {
      throw deferredError = e, e;
    } finally {
      if (reader.releaseLock(), !preventCancel && !@isReadableStreamLocked(stream)) {
        let promise = stream.cancel(deferredError);
        if (Bun.peek.status(promise) === "rejected")
          @markPromiseAsHandled(promise);
      }
    }
  }, createAsyncIterator = function asyncIterator2() {
    return ReadableStreamAsyncIterator(this, !1);
  }, createValues = function values({ preventCancel = !1 } = { preventCancel: !1 }) {
    return ReadableStreamAsyncIterator(this, preventCancel);
  };
  return @Object.@defineProperty(prototype, asyncIterator, { value: createAsyncIterator }), @Object.@defineProperty(prototype, "values", { value: createValues }), prototype;
})
(function (stream, error) {"use strict";
  @putByIdDirectPrivate(stream, "state", 3), @putByIdDirectPrivate(stream, "storedError", error);
  let reader = @getByIdDirectPrivate(stream, "reader");
  if (!reader)
    return;
  @getByIdDirectPrivate(reader, "closedPromiseCapability").reject.@call(@undefined, error);
  let promise = @getByIdDirectPrivate(reader, "closedPromiseCapability").promise;
  if (@markPromiseAsHandled(promise), @isReadableStreamDefaultReader(reader))
    @readableStreamDefaultReaderErrorReadRequests(reader, error);
  else {
    let requests = @getByIdDirectPrivate(reader, "readIntoRequests");
    @putByIdDirectPrivate(reader, "readIntoRequests", @createFIFO());
    for (var request = requests.shift();request; request = requests.shift())
      @rejectPromise(request, error);
  }
})
(function (target, fn) {"use strict";
  var cancelled = !1, iter;
  if (iter = fn.@call(target), fn = target = @undefined, !@isAsyncGenerator(iter) && typeof iter.next !== "function")
    @throwTypeError("Expected an async generator");
  var runningAsyncIteratorPromise;
  async function runAsyncIterator(controller) {
    var closingError, value, done, immediateTask;
    try {
      while (!cancelled && !done) {
        let promise = iter.next(controller);
        if (cancelled)
          return;
        if (@isPromise(promise) && (@getPromiseInternalField(promise, @promiseFieldFlags) & @promiseStateMask) === @promiseStateFulfilled)
          clearImmediate(immediateTask), { value, done } = @getPromiseInternalField(promise, @promiseFieldReactionsOrResult);
        else if (immediateTask = setImmediate(() => immediateTask && controller?.flush?.(!0)), { value, done } = await promise, cancelled)
          return;
        if (!@isUndefinedOrNull(value))
          controller.write(value);
      }
    } catch (e) {
      closingError = e;
    } finally {
      if (clearImmediate(immediateTask), immediateTask = @undefined, closingError?.code === "ERR_INVALID_THIS") {
        await iter?.return?.();
        return;
      }
      if (closingError)
        try {
          await iter.throw?.(closingError);
        } finally {
          throw iter = @undefined, closingError;
        }
      else if (await controller.end(), iter)
        await iter.return?.();
      iter = @undefined;
    }
  }
  return new @ReadableStream({
    type: "direct",
    cancel(reason) {
      if (cancelled = !0, iter) {
        let thisIter = iter;
        if (iter = @undefined, reason)
          return thisIter.throw?.(reason);
        else
          return thisIter?.return?.();
      }
    },
    close() {
      cancelled = !0;
    },
    async pull(controller) {
      if (!runningAsyncIteratorPromise) {
        let asyncIteratorPromise = runAsyncIterator(controller);
        runningAsyncIteratorPromise = asyncIteratorPromise;
        try {
          return await asyncIteratorPromise;
        } catch (e) {
          if (controller.write === @onReadableStreamDirectControllerClosed)
            return;
          throw e;
        } finally {
          if (runningAsyncIteratorPromise === asyncIteratorPromise)
            runningAsyncIteratorPromise = @undefined;
        }
      }
      return runningAsyncIteratorPromise;
    }
  });
})
(function (stream, chunk, done) {"use strict";
  let readRequest = @getByIdDirectPrivate(@getByIdDirectPrivate(stream, "reader"), "readRequests").shift();
  @fulfillPromise(readRequest, { value: chunk, done });
})
(function (stream) {"use strict";
  var reader = stream.getReader(), manyResult = reader.readMany();
  async function processManyResult(result) {
    let { done, value } = result;
    var chunks = value || [];
    while (!done) {
      var thisResult = reader.readMany();
      if (@isPromise(thisResult))
        thisResult = await thisResult;
      ({ done, value = [] } = thisResult);
      let length = value.length || 0;
      if (length > 1)
        chunks = chunks.concat(value);
      else if (length === 1)
        chunks.push(value[0]);
    }
    return chunks;
  }
  if (manyResult && @isPromise(manyResult))
    return manyResult.@then(processManyResult);
  return processManyResult(manyResult);
})
(function (stream) {"use strict";
  let highWaterMark = @getByIdDirectPrivate(stream, "highWaterMark"), [textStream, closer] = @createTextStream(highWaterMark), prom = @readStreamIntoSink(stream, textStream, !1);
  if (prom && @isPromise(prom))
    return @Promise.@resolve(prom).@then(closer.promise).@then(@withoutUTF8BOM);
  return closer.promise.@then(@withoutUTF8BOM);
})
(function (stream, sink) {"use strict";
  let reader = new @ReadableStreamDefaultReader(stream);
  @getByIdDirectPrivate(reader, "closedPromiseCapability").promise.@then(() => {}, (e) => {
    sink.error(e);
  });
  function doPipe() {
    @readableStreamDefaultReaderRead(reader).@then(function(result) {
      if (result.done) {
        sink.close();
        return;
      }
      try {
        sink.enqueue(result.value);
      } catch {
        sink.error("ReadableStream chunk enqueueing in the sink failed");
        return;
      }
      doPipe();
    }, function(e) {
      sink.error(e);
    });
  }
  doPipe();
})
(function (source, destination, preventClose, preventAbort, preventCancel, signal) {"use strict";
  if (@getByIdDirectPrivate(source, "underlyingByteSource") !== @undefined)
    return @Promise.@reject("Piping to a readable bytestream is not supported");
  let pipeState = {
    source,
    destination,
    preventAbort,
    preventCancel,
    preventClose,
    signal
  };
  if (pipeState.reader = @acquireReadableStreamDefaultReader(source), pipeState.writer = @acquireWritableStreamDefaultWriter(destination), source.@disturbed = !0, pipeState.shuttingDown = !1, pipeState.promiseCapability = @newPromiseCapability(@Promise), pipeState.pendingReadPromiseCapability = @newPromiseCapability(@Promise), pipeState.pendingReadPromiseCapability.resolve.@call(), pipeState.pendingWritePromise = @Promise.@resolve(), signal !== @undefined) {
    let algorithm = (reason) => {
      @pipeToShutdownWithAction(pipeState, () => {
        let promiseDestination = !pipeState.preventAbort && @getByIdDirectPrivate(pipeState.destination, "state") === "writable" ? @writableStreamAbort(pipeState.destination, reason) : @Promise.@resolve(), promiseSource = !pipeState.preventCancel && @getByIdDirectPrivate(pipeState.source, "state") === 4 ? @readableStreamCancel(pipeState.source, reason) : @Promise.@resolve(), promiseCapability = @newPromiseCapability(@Promise), shouldWait = !0, handleResolvedPromise = () => {
          if (shouldWait) {
            shouldWait = !1;
            return;
          }
          promiseCapability.resolve.@call();
        }, handleRejectedPromise = (e) => {
          promiseCapability.reject.@call(@undefined, e);
        };
        return promiseDestination.@then(handleResolvedPromise, handleRejectedPromise), promiseSource.@then(handleResolvedPromise, handleRejectedPromise), promiseCapability.promise;
      }, reason);
    };
    if (!(pipeState.abortAlgorithmIdentifier = @addAbortAlgorithmToSignal(signal, algorithm)))
      return pipeState.promiseCapability.promise;
    pipeState.signal = signal;
  }
  return @pipeToErrorsMustBePropagatedForward(pipeState), @pipeToErrorsMustBePropagatedBackward(pipeState), @pipeToClosingMustBePropagatedForward(pipeState), @pipeToClosingMustBePropagatedBackward(pipeState), @pipeToLoop(pipeState), pipeState.promiseCapability.promise;
})
(function (reader, reason) {"use strict";
  let stream = @getByIdDirectPrivate(reader, "ownerReadableStream");
  return @readableStreamCancel(stream, reason);
})
(function (reader, stream) {"use strict";
  if (@putByIdDirectPrivate(reader, "ownerReadableStream", stream), @putByIdDirectPrivate(stream, "reader", reader), @getByIdDirectPrivate(stream, "state") === 4)
    @putByIdDirectPrivate(reader, "closedPromiseCapability", @newPromiseCapability(@Promise));
  else if (@getByIdDirectPrivate(stream, "state") === 1)
    @putByIdDirectPrivate(reader, "closedPromiseCapability", {
      promise: @Promise.@resolve()
    });
  else
    @putByIdDirectPrivate(reader, "closedPromiseCapability", {
      promise: @newHandledRejectedPromise(@getByIdDirectPrivate(stream, "storedError"))
    });
})
(function (reader) {"use strict";
  if (@getByIdDirectPrivate(@getByIdDirectPrivate(reader, "ownerReadableStream"), "state") === 4)
    @getByIdDirectPrivate(reader, "closedPromiseCapability").reject.@call(@undefined, @makeErrorWithCode(233, "Stream reader cancelled via releaseLock()"));
  else
    @putByIdDirectPrivate(reader, "closedPromiseCapability", {
      promise: @newHandledRejectedPromise(@makeErrorWithCode(233, "Stream reader cancelled via releaseLock()"))
    });
  let promise = @getByIdDirectPrivate(reader, "closedPromiseCapability").promise;
  @markPromiseAsHandled(promise);
  var stream = @getByIdDirectPrivate(reader, "ownerReadableStream");
  if (stream.@bunNativePtr)
    @getByIdDirectPrivate(@getByIdDirectPrivate(stream, "readableStreamController"), "underlyingSource").@resume(!1);
  @putByIdDirectPrivate(stream, "reader", @undefined), @putByIdDirectPrivate(reader, "ownerReadableStream", @undefined);
})
(function (stream, shouldClone) {"use strict";
  var start_ = @getByIdDirectPrivate(stream, "start");
  if (start_)
    @putByIdDirectPrivate(stream, "start", @undefined), start_();
  let reader = new @ReadableStreamDefaultReader(stream), teeState = {
    stream,
    flags: 0,
    reason1: @undefined,
    reason2: @undefined,
    branch1Source: @undefined,
    branch2Source: @undefined,
    branch1: @undefined,
    branch2: @undefined,
    cancelPromiseCapability: @newPromiseCapability(@Promise)
  }, pullFunction = @readableStreamTeePullFunction(teeState, reader, shouldClone), branch1Source = {
    @pull: pullFunction,
    @cancel: @readableStreamTeeBranch1CancelFunction(teeState, stream)
  }, branch2Source = {
    @pull: pullFunction,
    @cancel: @readableStreamTeeBranch2CancelFunction(teeState, stream)
  }, branch1 = new @ReadableStream(branch1Source), branch2 = new @ReadableStream(branch2Source);
  return @getByIdDirectPrivate(reader, "closedPromiseCapability").promise.@then(@undefined, function(e) {
    if (teeState.flags & 8 /* closedOrErrored */)
      return;
    if (@readableStreamDefaultControllerError(branch1.@readableStreamController, e), @readableStreamDefaultControllerError(branch2.@readableStreamController, e), teeState.flags |= 8 /* closedOrErrored */, teeState.flags & 3)
      teeState.cancelPromiseCapability.resolve.@call();
  }), teeState.branch1 = branch1, teeState.branch2 = branch2, [branch1, branch2];
})
(function (teeState, stream) {"use strict";
  return function(r) {
    if (teeState.flags |= 1 /* canceled1 */, teeState.reason1 = r, teeState.flags & 2 /* canceled2 */)
      @readableStreamCancel(stream, [teeState.reason1, teeState.reason2]).@then(teeState.cancelPromiseCapability.resolve, teeState.cancelPromiseCapability.reject);
    return teeState.cancelPromiseCapability.promise;
  };
})
(function (teeState, stream) {"use strict";
  return function(r) {
    if (teeState.flags |= 2 /* canceled2 */, teeState.reason2 = r, teeState.flags & 1 /* canceled1 */)
      @readableStreamCancel(stream, [teeState.reason1, teeState.reason2]).@then(teeState.cancelPromiseCapability.resolve, teeState.cancelPromiseCapability.reject);
    return teeState.cancelPromiseCapability.promise;
  };
})
(function (teeState, reader, shouldClone) {"use strict";
  let pullAlgorithm = function() {
    if (teeState.flags & 4 /* reading */)
      return teeState.flags |= 16 /* readAgain */, @Promise.@resolve();
    return teeState.flags |= 4 /* reading */, @Promise.prototype.@then.@call(@readableStreamDefaultReaderRead(reader), function(result) {
      let { done, value } = result;
      if (done) {
        if (teeState.flags &= -5, !(teeState.flags & 1 /* canceled1 */))
          @readableStreamDefaultControllerClose(teeState.branch1.@readableStreamController);
        if (!(teeState.flags & 2 /* canceled2 */))
          @readableStreamDefaultControllerClose(teeState.branch2.@readableStreamController);
        if (!(teeState.flags & 1 /* canceled1 */) || !(teeState.flags & 2 /* canceled2 */))
          teeState.cancelPromiseCapability.resolve.@call();
        return;
      }
      teeState.flags &= -17;
      let chunk1 = value, chunk2 = value;
      if (!(teeState.flags & 2 /* canceled2 */) && shouldClone)
        try {
          chunk2 = @structuredCloneForStream(value);
        } catch (e) {
          @readableStreamDefaultControllerError(teeState.branch1.@readableStreamController, e), @readableStreamDefaultControllerError(teeState.branch2.@readableStreamController, e), @readableStreamCancel(teeState.stream, e).@then(teeState.cancelPromiseCapability.resolve, teeState.cancelPromiseCapability.reject);
          return;
        }
      if (!(teeState.flags & 1 /* canceled1 */))
        @readableStreamDefaultControllerEnqueue(teeState.branch1.@readableStreamController, chunk1);
      if (!(teeState.flags & 2 /* canceled2 */))
        @readableStreamDefaultControllerEnqueue(teeState.branch2.@readableStreamController, chunk2);
      teeState.flags &= -5, @Promise.@resolve().@then(() => {
        if (teeState.flags & 16 /* readAgain */)
          pullAlgorithm();
      });
    }, () => {
      teeState.flags &= -5;
    }), @Promise.@resolve();
  };
  return pullAlgorithm;
})
(function (stream, underlyingSource, asUint8Array) {"use strict";
  var sink = new Bun.ArrayBufferSink;
  @putByIdDirectPrivate(stream, "underlyingSource", null), @putByIdDirectPrivate(stream, "start", @undefined), @putByIdDirectPrivate(stream, "reader", {}), stream.@disturbed = !0;
  var highWaterMark = @getByIdDirectPrivate(stream, "highWaterMark");
  sink.start({ highWaterMark, asUint8Array });
  var capability = @newPromiseCapability(@Promise), ended = !1, pull = underlyingSource.pull, close = underlyingSource.close, controller = {
    start() {},
    close(_reason) {
      if (!ended) {
        if (ended = !0, close)
          close();
        @fulfillPromise(capability.promise, sink.end());
      }
    },
    end() {
      if (!ended) {
        if (ended = !0, close)
          close();
        @fulfillPromise(capability.promise, sink.end());
      }
    },
    flush() {
      return 0;
    },
    write: sink.write.bind(sink)
  }, didError = !1;
  try {
    var firstPull = pull(controller);
  } catch (e) {
    return didError = !0, @putByIdDirectPrivate(stream, "reader", @undefined), @readableStreamError(stream, e), @Promise.@reject(e);
  } finally {
    if (!@isPromise(firstPull) && !didError) {
      if (stream)
        @putByIdDirectPrivate(stream, "reader", @undefined), @readableStreamCloseIfPossible(stream);
      return controller = close = sink = pull = stream = @undefined, capability.promise;
    }
  }
  return firstPull.then(() => {
    if (!didError && stream)
      @putByIdDirectPrivate(stream, "reader", @undefined), @readableStreamCloseIfPossible(stream);
    return controller = close = sink = pull = stream = @undefined, capability.promise;
  }, (e) => {
    if (didError = !0, @putByIdDirectPrivate(stream, "reader", @undefined), @getByIdDirectPrivate(stream, "state") === 4)
      @readableStreamError(stream, e);
    return @Promise.@reject(e);
  });
})
(async function (stream, underlyingSource) {"use strict";
  let capability = @initializeArrayStream.@call(stream, underlyingSource, @undefined);
  underlyingSource = @undefined;
  var reader = stream.getReader();
  try {
    while (@getByIdDirectPrivate(stream, "state") === 4) {
      var thisResult = await reader.read();
      if (thisResult.done)
        break;
    }
    try {
      reader.releaseLock();
    } catch {}
    return reader = @undefined, @Promise.@resolve(capability.promise);
  } finally {
    stream = @undefined, reader = @undefined;
  }
})
(async function (stream, underlyingSource) {"use strict";
  let capability = @initializeTextStream.@call(stream, underlyingSource, @undefined);
  var reader = stream.getReader();
  while (@getByIdDirectPrivate(stream, "state") === 4) {
    var thisResult = await reader.read();
    if (thisResult.done)
      break;
  }
  try {
    reader.releaseLock();
  } catch {}
  return reader = @undefined, stream = @undefined, capability.promise;
})
(function (stream, sink, underlyingSource) {"use strict";
  @putByIdDirectPrivate(stream, "underlyingSource", null), @putByIdDirectPrivate(stream, "start", @undefined);
  function close(stream2, reason) {
    let cancelFn = underlyingSource?.cancel;
    if (cancelFn) {
      try {
        var prom = cancelFn.@call(underlyingSource, reason);
        if (@isPromise(prom))
          @markPromiseAsHandled(prom);
      } catch {}
      underlyingSource = @undefined;
    }
    if (stream2) {
      if (@putByIdDirectPrivate(stream2, "readableStreamController", @undefined), @putByIdDirectPrivate(stream2, "reader", @undefined), reason)
        @putByIdDirectPrivate(stream2, "state", 3), @putByIdDirectPrivate(stream2, "storedError", reason);
      else
        @putByIdDirectPrivate(stream2, "state", 1);
      stream2 = @undefined;
    }
  }
  if (!underlyingSource.pull) {
    close();
    return;
  }
  if (!@isCallable(underlyingSource.pull)) {
    close(), @throwTypeError("pull is not a function");
    return;
  }
  @putByIdDirectPrivate(stream, "readableStreamController", sink);
  let highWaterMark = @getByIdDirectPrivate(stream, "highWaterMark");
  sink.start({
    highWaterMark: !highWaterMark || highWaterMark < 64 ? 64 : highWaterMark
  }), @startDirectStream.@call(sink, stream, underlyingSource.pull, close, stream.@asyncContext), @putByIdDirectPrivate(stream, "reader", {});
  var maybePromise = underlyingSource.pull(sink);
  if (sink = @undefined, maybePromise && @isPromise(maybePromise)) {
    if (maybePromise.@then)
      return maybePromise.@then(() => {});
    return maybePromise.then(() => {});
  }
})
(async function (stream, sink, isNative) {"use strict";
  var didClose = !1, didThrow = !1, started = !1;
  let highWaterMark = @getByIdDirectPrivate(stream, "highWaterMark") || 0;
  try {
    let onSinkClose2 = function(stream2, reason) {
      if (!didThrow && !didClose && stream2 && stream2.@state !== 1)
        @readableStreamCancel(stream2, reason);
    };
    var onSinkClose = onSinkClose2, reader = stream.getReader(), many = reader.readMany();
    if (many && @isPromise(many)) {
      if (isNative)
        @startDirectStream.@call(sink, stream, @undefined, onSinkClose2, stream.@asyncContext);
      sink.start({ highWaterMark }), started = !0, many = await many;
    }
    if (many.done)
      return didClose = !0, sink.end();
    if (!started) {
      if (isNative)
        @startDirectStream.@call(sink, stream, @undefined, onSinkClose2, stream.@asyncContext);
      sink.start({ highWaterMark });
    }
    for (var i = 0, values = many.value, length = many.value.length;i < length; i++)
      sink.write(values[i]);
    var streamState = @getByIdDirectPrivate(stream, "state");
    if (streamState === 1)
      return didClose = !0, sink.end();
    while (!0) {
      var { value, done } = await reader.read();
      if (done)
        return didClose = !0, sink.end();
      sink.write(value);
    }
  } catch (e) {
    didThrow = !0;
    try {
      reader = @undefined;
      let prom = stream.cancel(e);
      if (@isPromise(prom))
        @markPromiseAsHandled(prom);
    } catch {}
    if (sink && !didClose) {
      didClose = !0;
      try {
        sink.close(e);
      } catch (j) {
        throw new globalThis.AggregateError([e, j]);
      }
    }
    throw e;
  } finally {
    if (reader) {
      try {
        reader.releaseLock();
      } catch {}
      reader = @undefined;
    }
    if (sink = @undefined, stream) {
      var streamState = @getByIdDirectPrivate(stream, "state"), readableStreamController = @getByIdDirectPrivate(stream, "readableStreamController");
      if (readableStreamController) {
        if (@getByIdDirectPrivate(readableStreamController, "underlyingSource"))
          @putByIdDirectPrivate(readableStreamController, "underlyingSource", null);
        if (@getByIdDirectPrivate(readableStreamController, "controlledReadableStream"))
          @putByIdDirectPrivate(readableStreamController, "controlledReadableStream", null);
        if (@putByIdDirectPrivate(stream, "readableStreamController", null), @getByIdDirectPrivate(stream, "underlyingSource"))
          @putByIdDirectPrivate(stream, "underlyingSource", null);
        readableStreamController = @undefined;
      }
      if (stream && !didThrow && streamState !== 1 && streamState !== 3)
        @readableStreamCloseIfPossible(stream);
      stream = @undefined;
    }
  }
})
(function (stream, underlyingSource, size, highWaterMark, startMethod, pullMethod, cancelMethod) {"use strict";
  let controller = new @ReadableStreamDefaultController(stream, underlyingSource, size, highWaterMark, @isReadableStream);
  var asyncContext = stream.@asyncContext;
  let pullAlgorithm = () => @promiseInvokeOrNoopMethod(underlyingSource, pullMethod, [controller]), cancelAlgorithm = asyncContext ? (reason) => {
    var prev = @getInternalField(@asyncContext, 0);
    @putInternalField(@asyncContext, 0, asyncContext);
    var result = @promiseInvokeOrNoopMethod(underlyingSource, cancelMethod, [reason]);
    return @putInternalField(@asyncContext, 0, prev), result;
  } : (reason) => @promiseInvokeOrNoopMethod(underlyingSource, cancelMethod, [reason]);
  @putByIdDirectPrivate(controller, "pullAlgorithm", pullAlgorithm), @putByIdDirectPrivate(controller, "cancelAlgorithm", cancelAlgorithm), @putByIdDirectPrivate(controller, "pull", @readableStreamDefaultControllerPull), @putByIdDirectPrivate(controller, "cancel", @readableStreamDefaultControllerCancel), @putByIdDirectPrivate(stream, "readableStreamController", controller), @readableStreamDefaultControllerStart(controller);
})
(function (stream, method) {"use strict";
  let ptr = stream.@bunNativePtr;
  if (ptr && !@isReadableStreamDisturbed(stream) && @isCallable(ptr[method])) {
    let promise = ptr[method]();
    if (stream.@disturbed = !0, @putByIdDirectPrivate(stream, "start", @undefined), @putByIdDirectPrivate(stream, "reader", {}), Bun.peek.status(promise) === "fulfilled")
      return stream.@reader = @undefined, @readableStreamCloseIfPossible(stream), promise;
    return promise.catch((e) => {
      return stream.@reader = @undefined, @readableStreamCancel(stream, e), @Promise.@reject(e);
    }).finally(() => {
      stream.@reader = @undefined, @readableStreamCloseIfPossible(stream);
    });
  }
})
(function (result) {"use strict";
  if (result.charCodeAt(0) === 65279)
    return result.slice(1);
  return result;
})
(function () {"use strict";
  return new (@getInternalField(@internalModuleRegistry, 17) || @createInternalModuleById(17));
})
(function (value) {"use strict";
  let promise = @newPromise();
  return @fulfillPromise(promise, value), promise;
})
(function (queue) {"use strict";
  let record = queue.content.shift();
  if (queue.size -= record.size, queue.size < 0)
    queue.size = 0;
  return record.value;
})
(function (queue, value, size) {"use strict";
  if (size = @toNumber(size), !@isFinite(size) || size < 0)
    @throwRangeError("size has an incorrect value");
  queue.content.push({ value, size }), queue.size += size;
})
(function (strategy, defaultHWM) {"use strict";
  let highWaterMark = strategy.highWaterMark;
  if (highWaterMark === @undefined)
    return defaultHWM;
  if (highWaterMark !== highWaterMark || highWaterMark < 0)
    @throwRangeError("highWaterMark value is negative or not a number");
  return @toNumber(highWaterMark);
})
(function (init) {"use strict";
  if (!@isObject(init))
    @throwTypeError("QueuingStrategyInit argument must be an object.");
  let { highWaterMark } = init;
  if (highWaterMark === @undefined)
    @throwTypeError("QueuingStrategyInit.highWaterMark member is required.");
  return @toNumber(highWaterMark);
})
(function (strategy) {"use strict";
  let sizeAlgorithm = strategy.size;
  if (sizeAlgorithm === @undefined)
    return () => 1;
  if (typeof sizeAlgorithm !== "function")
    @throwTypeError("strategy.size must be a function");
  return (chunk) => {
    return sizeAlgorithm(chunk);
  };
})
(function (promise) {"use strict";
  @putPromiseInternalField(promise, @promiseFieldFlags, @getPromiseInternalField(promise, @promiseFieldFlags) | @promiseFlagsIsHandled);
})
(function () {"use strict";
  return { content: @createFIFO(), size: 0 };
})
(function (queue) {"use strict";
  return queue.content.peek()?.value;
})
(function (object, key1, args1, key2, args2) {"use strict";
  try {
    let method = object[key1];
    if (method === @undefined)
      return @promiseInvokeOrNoopNoCatch(object, key2, args2);
    return @shieldingPromiseResolve(method.@apply(object, args1));
  } catch (error) {
    return @Promise.@reject(error);
  }
})
(function (object, key, args) {"use strict";
  try {
    return @promiseInvokeOrNoopNoCatch(object, key, args);
  } catch (error) {
    return @Promise.@reject(error);
  }
})
(function (object, method, args) {"use strict";
  try {
    return @promiseInvokeOrNoopMethodNoCatch(object, method, args);
  } catch (error) {
    return @Promise.@reject(error);
  }
})
(function (object, method, args) {"use strict";
  if (method === @undefined)
    return @Promise.@resolve();
  return @shieldingPromiseResolve(method.@apply(object, args));
})
(function (object, key, args) {"use strict";
  return @promiseInvokeOrNoopMethodNoCatch(object, object[key], args);
})
(function (queue) {"use strict";
  queue.content.clear(), queue.size = 0;
})
(function (result) {"use strict";
  let promise = @Promise.@resolve(result);
  if (promise.@then === @undefined)
    promise.@then = @Promise.prototype.@then;
  return promise;
})
(function (value, defaultValue, errorMessage) {"use strict";
  if (@isUndefinedOrNull(value))
    return defaultValue;
  if (!@isObject(value))
    throw @makeErrorWithCode(119, errorMessage);
  return value;
})
(function (size, highWaterMark) {"use strict";
  if (size !== @undefined && typeof size !== "function")
    @throwTypeError("size parameter must be a function");
  let newHighWaterMark = @toNumber(highWaterMark);
  if (newHighWaterMark !== newHighWaterMark || newHighWaterMark < 0)
    @throwRangeError("highWaterMark value is negative or not a number");
  return { size, highWaterMark: newHighWaterMark };
})
(function () {"use strict";
  if (!@getByIdDirectPrivate(this, "textDecoderStreamTransform"))
    throw @makeErrorWithCode(139, "TextDecoderStream");
  return @getByIdDirectPrivate(this, "encoding");
})
(function () {"use strict";
  if (!@getByIdDirectPrivate(this, "textDecoderStreamTransform"))
    throw @makeErrorWithCode(139, "TextDecoderStream");
  return @getByIdDirectPrivate(this, "fatal");
})
(function () {"use strict";
  if (!@getByIdDirectPrivate(this, "textDecoderStreamTransform"))
    throw @makeErrorWithCode(139, "TextDecoderStream");
  return @getByIdDirectPrivate(this, "ignoreBOM");
})
(function () {"use strict";
  let label = arguments.length >= 1 ? arguments[0] : "utf-8", options = arguments.length >= 2 ? arguments[1] : {}, startAlgorithm = () => {
    return @Promise.@resolve();
  }, transformAlgorithm = (chunk) => {
    let decoder2 = @getByIdDirectPrivate(this, "textDecoder"), buffer;
    try {
      buffer = decoder2.decode(chunk, { stream: !0 });
    } catch (e) {
      return @Promise.@reject(e);
    }
    if (buffer) {
      let transformStream = @getByIdDirectPrivate(this, "textDecoderStreamTransform"), controller = @getByIdDirectPrivate(transformStream, "controller");
      @transformStreamDefaultControllerEnqueue(controller, buffer);
    }
    return @Promise.@resolve();
  }, flushAlgorithm = () => {
    let decoder2 = @getByIdDirectPrivate(this, "textDecoder"), buffer;
    try {
      buffer = decoder2.decode(@undefined, { stream: !1 });
    } catch (e) {
      return @Promise.@reject(e);
    }
    if (buffer) {
      let transformStream = @getByIdDirectPrivate(this, "textDecoderStreamTransform"), controller = @getByIdDirectPrivate(transformStream, "controller");
      @transformStreamDefaultControllerEnqueue(controller, buffer);
    }
    return @Promise.@resolve();
  }, transform = @createTransformStream(startAlgorithm, transformAlgorithm, flushAlgorithm);
  @putByIdDirectPrivate(this, "textDecoderStreamTransform", transform);
  let fatal = !!options.fatal, ignoreBOM = !!options.ignoreBOM, decoder = new TextDecoder(label, { fatal, ignoreBOM });
  return @putByIdDirectPrivate(this, "fatal", fatal), @putByIdDirectPrivate(this, "ignoreBOM", ignoreBOM), @putByIdDirectPrivate(this, "encoding", decoder.encoding), @putByIdDirectPrivate(this, "textDecoder", decoder), this;
})
(function () {"use strict";
  let transform = @getByIdDirectPrivate(this, "textDecoderStreamTransform");
  if (!transform)
    throw @makeErrorWithCode(139, "TextDecoderStream");
  return @getByIdDirectPrivate(transform, "readable");
})
(function () {"use strict";
  let transform = @getByIdDirectPrivate(this, "textDecoderStreamTransform");
  if (!transform)
    throw @makeErrorWithCode(139, "TextDecoderStream");
  return @getByIdDirectPrivate(transform, "writable");
})
(function () {"use strict";
  if (!@getByIdDirectPrivate(this, "textEncoderStreamTransform"))
    throw @makeErrorWithCode(139, "TextEncoderStream");
  return "utf-8";
})
(function () {"use strict";
  let startAlgorithm = () => {
    return @Promise.@resolve();
  }, transformAlgorithm = (chunk) => {
    let encoder = @getByIdDirectPrivate(this, "textEncoderStreamEncoder");
    try {
      var buffer = encoder.encode(chunk);
    } catch (e) {
      return @Promise.@reject(e);
    }
    if (buffer.length) {
      let transformStream = @getByIdDirectPrivate(this, "textEncoderStreamTransform"), controller = @getByIdDirectPrivate(transformStream, "controller");
      @transformStreamDefaultControllerEnqueue(controller, buffer);
    }
    return @Promise.@resolve();
  }, flushAlgorithm = () => {
    let buffer = @getByIdDirectPrivate(this, "textEncoderStreamEncoder").flush();
    if (buffer.length) {
      let transformStream = @getByIdDirectPrivate(this, "textEncoderStreamTransform"), controller = @getByIdDirectPrivate(transformStream, "controller");
      @transformStreamDefaultControllerEnqueue(controller, buffer);
    }
    return @Promise.@resolve();
  }, transform = @createTransformStream(startAlgorithm, transformAlgorithm, flushAlgorithm);
  return @putByIdDirectPrivate(this, "textEncoderStreamTransform", transform), @putByIdDirectPrivate(this, "textEncoderStreamEncoder", new @TextEncoderStreamEncoder), this;
})
(function () {"use strict";
  let transform = @getByIdDirectPrivate(this, "textEncoderStreamTransform");
  if (!transform)
    throw @makeErrorWithCode(139, "TextEncoderStream");
  return @getByIdDirectPrivate(transform, "readable");
})
(function () {"use strict";
  let transform = @getByIdDirectPrivate(this, "textEncoderStreamTransform");
  if (!transform)
    throw @makeErrorWithCode(139, "TextEncoderStream");
  return @getByIdDirectPrivate(transform, "writable");
})
(function () {"use strict";
  let transformer = arguments[0];
  if (@isObject(transformer) && @getByIdDirectPrivate(transformer, "TransformStream"))
    return this;
  let writableStrategy = arguments[1], readableStrategy = arguments[2];
  if (transformer === @undefined)
    transformer = null;
  if (readableStrategy === @undefined)
    readableStrategy = {};
  if (writableStrategy === @undefined)
    writableStrategy = {};
  let transformerDict = {};
  if (transformer !== null) {
    if ("start" in transformer) {
      if (transformerDict.start = transformer.start, typeof transformerDict.start !== "function")
        @throwTypeError("transformer.start should be a function");
    }
    if ("transform" in transformer) {
      if (transformerDict.transform = transformer.transform, typeof transformerDict.transform !== "function")
        @throwTypeError("transformer.transform should be a function");
    }
    if ("flush" in transformer) {
      if (transformerDict.flush = transformer.flush, typeof transformerDict.flush !== "function")
        @throwTypeError("transformer.flush should be a function");
    }
    if ("readableType" in transformer)
      @throwRangeError("TransformStream transformer has a readableType");
    if ("writableType" in transformer)
      @throwRangeError("TransformStream transformer has a writableType");
  }
  let readableHighWaterMark = @extractHighWaterMark(readableStrategy, 0), readableSizeAlgorithm = @extractSizeAlgorithm(readableStrategy), writableHighWaterMark = @extractHighWaterMark(writableStrategy, 1), writableSizeAlgorithm = @extractSizeAlgorithm(writableStrategy), startPromiseCapability = @newPromiseCapability(@Promise);
  if (@initializeTransformStream(this, startPromiseCapability.promise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm), @setUpTransformStreamDefaultControllerFromTransformer(this, transformer, transformerDict), "start" in transformerDict) {
    let controller = @getByIdDirectPrivate(this, "controller");
    (() => @promiseInvokeOrNoopMethodNoCatch(transformer, transformerDict.start, [controller]))().@then(() => {
      startPromiseCapability.resolve.@call();
    }, (error) => {
      startPromiseCapability.reject.@call(@undefined, error);
    });
  } else
    startPromiseCapability.resolve.@call();
  return this;
})
(function () {"use strict";
  if (!@isTransformStream(this))
    throw @makeErrorWithCode(139, "TransformStream");
  return @getByIdDirectPrivate(this, "readable");
})
(function () {"use strict";
  if (!@isTransformStream(this))
    throw @makeErrorWithCode(139, "TransformStream");
  return @getByIdDirectPrivate(this, "writable");
})
(function () {"use strict";
  if (!@isTransformStreamDefaultController(this))
    throw @makeErrorWithCode(139, "TransformStreamDefaultController");
  let stream = @getByIdDirectPrivate(this, "stream"), readable = @getByIdDirectPrivate(stream, "readable"), readableController = @getByIdDirectPrivate(readable, "readableStreamController");
  return @readableStreamDefaultControllerGetDesiredSize(readableController);
})
(function (chunk) {"use strict";
  if (!@isTransformStreamDefaultController(this))
    throw @makeErrorWithCode(139, "TransformStreamDefaultController");
  @transformStreamDefaultControllerEnqueue(this, chunk);
})
(function (e) {"use strict";
  if (!@isTransformStreamDefaultController(this))
    throw @makeErrorWithCode(139, "TransformStreamDefaultController");
  @transformStreamDefaultControllerError(this, e);
})
(function () {"use strict";
  return this;
})
(function () {"use strict";
  if (!@isTransformStreamDefaultController(this))
    throw @makeErrorWithCode(139, "TransformStreamDefaultController");
  @transformStreamDefaultControllerTerminate(this);
})
(function (startAlgorithm, transformAlgorithm, flushAlgorithm, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {"use strict";
  if (writableHighWaterMark === @undefined)
    writableHighWaterMark = 1;
  if (writableSizeAlgorithm === @undefined)
    writableSizeAlgorithm = () => 1;
  if (readableHighWaterMark === @undefined)
    readableHighWaterMark = 0;
  if (readableSizeAlgorithm === @undefined)
    readableSizeAlgorithm = () => 1;
  let transform = {};
  @putByIdDirectPrivate(transform, "TransformStream", !0);
  let stream = new @TransformStream(transform), startPromiseCapability = @newPromiseCapability(@Promise);
  @initializeTransformStream(stream, startPromiseCapability.promise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
  let controller = new @TransformStreamDefaultController;
  return @setUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm), startAlgorithm().@then(() => {
    startPromiseCapability.resolve.@call();
  }, (error) => {
    startPromiseCapability.reject.@call(@undefined, error);
  }), stream;
})
(function (stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {"use strict";
  let startAlgorithm = () => {
    return startPromise;
  }, writeAlgorithm = (chunk) => {
    return @transformStreamDefaultSinkWriteAlgorithm(stream, chunk);
  }, abortAlgorithm = (reason) => {
    return @transformStreamDefaultSinkAbortAlgorithm(stream, reason);
  }, closeAlgorithm = () => {
    return @transformStreamDefaultSinkCloseAlgorithm(stream);
  }, writable = @createWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm), pullAlgorithm = () => {
    return @transformStreamDefaultSourcePullAlgorithm(stream);
  }, cancelAlgorithm = (reason) => {
    return @transformStreamErrorWritableAndUnblockWrite(stream, reason), @Promise.@resolve();
  }, underlyingSource = {};
  @putByIdDirectPrivate(underlyingSource, "start", startAlgorithm), @putByIdDirectPrivate(underlyingSource, "pull", pullAlgorithm), @putByIdDirectPrivate(underlyingSource, "cancel", cancelAlgorithm);
  let options = {};
  @putByIdDirectPrivate(options, "size", readableSizeAlgorithm), @putByIdDirectPrivate(options, "highWaterMark", readableHighWaterMark);
  let readable = new @ReadableStream(underlyingSource, options);
  @putByIdDirectPrivate(stream, "writable", writable), @putByIdDirectPrivate(stream, "internalWritable", @getInternalWritableStream(writable)), @putByIdDirectPrivate(stream, "readable", readable), @putByIdDirectPrivate(stream, "backpressure", @undefined), @putByIdDirectPrivate(stream, "backpressureChangePromise", @undefined), @transformStreamSetBackpressure(stream, !0), @putByIdDirectPrivate(stream, "controller", @undefined);
})
(function (stream) {"use strict";
  return @isObject(stream) && !!@getByIdDirectPrivate(stream, "readable");
})
(function (controller) {"use strict";
  return @isObject(controller) && !!@getByIdDirectPrivate(controller, "transformAlgorithm");
})
(function (stream, controller, transformAlgorithm, flushAlgorithm) {"use strict";
  @putByIdDirectPrivate(controller, "stream", stream), @putByIdDirectPrivate(stream, "controller", controller), @putByIdDirectPrivate(controller, "transformAlgorithm", transformAlgorithm), @putByIdDirectPrivate(controller, "flushAlgorithm", flushAlgorithm);
})
(function (stream, transformer, transformerDict) {"use strict";
  let controller = new @TransformStreamDefaultController, transformAlgorithm = (chunk) => {
    try {
      @transformStreamDefaultControllerEnqueue(controller, chunk);
    } catch (e) {
      return @Promise.@reject(e);
    }
    return @Promise.@resolve();
  }, flushAlgorithm = () => {
    return @Promise.@resolve();
  };
  if ("transform" in transformerDict)
    transformAlgorithm = (chunk) => {
      return @promiseInvokeOrNoopMethod(transformer, transformerDict.transform, [chunk, controller]);
    };
  if ("flush" in transformerDict)
    flushAlgorithm = () => {
      return @promiseInvokeOrNoopMethod(transformer, transformerDict.flush, [controller]);
    };
  @setUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
})
(function (controller) {"use strict";
  @putByIdDirectPrivate(controller, "transformAlgorithm", !0), @putByIdDirectPrivate(controller, "flushAlgorithm", @undefined);
})
(function (controller, chunk) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "stream"), readable = @getByIdDirectPrivate(stream, "readable"), readableController = @getByIdDirectPrivate(readable, "readableStreamController");
  if (!@readableStreamDefaultControllerCanCloseOrEnqueue(readableController))
    @throwTypeError("TransformStream.readable cannot close or enqueue");
  try {
    @readableStreamDefaultControllerEnqueue(readableController, chunk);
  } catch (e) {
    throw @transformStreamErrorWritableAndUnblockWrite(stream, e), @getByIdDirectPrivate(readable, "storedError");
  }
  if (!@readableStreamDefaultControllerShouldCallPull(readableController) !== @getByIdDirectPrivate(stream, "backpressure"))
    @transformStreamSetBackpressure(stream, !0);
})
(function (controller, e) {"use strict";
  @transformStreamError(@getByIdDirectPrivate(controller, "stream"), e);
})
(function (controller, chunk) {"use strict";
  let promiseCapability = @newPromiseCapability(@Promise);
  return @getByIdDirectPrivate(controller, "transformAlgorithm").@call(@undefined, chunk).@then(() => {
    promiseCapability.resolve();
  }, (r) => {
    @transformStreamError(@getByIdDirectPrivate(controller, "stream"), r), promiseCapability.reject.@call(@undefined, r);
  }), promiseCapability.promise;
})
(function (controller) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "stream"), readable = @getByIdDirectPrivate(stream, "readable"), readableController = @getByIdDirectPrivate(readable, "readableStreamController");
  if (@readableStreamDefaultControllerCanCloseOrEnqueue(readableController))
    @readableStreamDefaultControllerClose(readableController);
  let error = @makeTypeError("the stream has been terminated");
  @transformStreamErrorWritableAndUnblockWrite(stream, error);
})
(function (stream, reason) {"use strict";
  return @transformStreamError(stream, reason), @Promise.@resolve();
})
(function (stream) {"use strict";
  let readable = @getByIdDirectPrivate(stream, "readable"), controller = @getByIdDirectPrivate(stream, "controller"), readableController = @getByIdDirectPrivate(readable, "readableStreamController"), flushAlgorithm = @getByIdDirectPrivate(controller, "flushAlgorithm"), flushPromise = @getByIdDirectPrivate(controller, "flushAlgorithm").@call();
  @transformStreamDefaultControllerClearAlgorithms(controller);
  let promiseCapability = @newPromiseCapability(@Promise);
  return flushPromise.@then(() => {
    if (@getByIdDirectPrivate(readable, "state") === 3) {
      promiseCapability.reject.@call(@undefined, @getByIdDirectPrivate(readable, "storedError"));
      return;
    }
    if (@readableStreamDefaultControllerCanCloseOrEnqueue(readableController))
      @readableStreamDefaultControllerClose(readableController);
    promiseCapability.resolve();
  }, (r) => {
    @transformStreamError(@getByIdDirectPrivate(controller, "stream"), r), promiseCapability.reject.@call(@undefined, @getByIdDirectPrivate(readable, "storedError"));
  }), promiseCapability.promise;
})
(function (stream, chunk) {"use strict";
  let writable = @getByIdDirectPrivate(stream, "internalWritable"), controller = @getByIdDirectPrivate(stream, "controller");
  if (@getByIdDirectPrivate(stream, "backpressure")) {
    let promiseCapability = @newPromiseCapability(@Promise);
    return @getByIdDirectPrivate(stream, "backpressureChangePromise").promise.@then(() => {
      if (@getByIdDirectPrivate(writable, "state") === "erroring") {
        promiseCapability.reject.@call(@undefined, @getByIdDirectPrivate(writable, "storedError"));
        return;
      }
      @transformStreamDefaultControllerPerformTransform(controller, chunk).@then(() => {
        promiseCapability.resolve();
      }, (e) => {
        promiseCapability.reject.@call(@undefined, e);
      });
    }, (e) => {
      promiseCapability.reject.@call(@undefined, e);
    }), promiseCapability.promise;
  }
  return @transformStreamDefaultControllerPerformTransform(controller, chunk);
})
(function (stream) {"use strict";
  return @transformStreamSetBackpressure(stream, !1), @getByIdDirectPrivate(stream, "backpressureChangePromise").promise;
})
(function (stream, e) {"use strict";
  let readable = @getByIdDirectPrivate(stream, "readable"), readableController = @getByIdDirectPrivate(readable, "readableStreamController");
  @readableStreamDefaultControllerError(readableController, e), @transformStreamErrorWritableAndUnblockWrite(stream, e);
})
(function (stream, e) {"use strict";
  @transformStreamDefaultControllerClearAlgorithms(@getByIdDirectPrivate(stream, "controller"));
  let writable = @getByIdDirectPrivate(stream, "internalWritable");
  if (@writableStreamDefaultControllerErrorIfNeeded(@getByIdDirectPrivate(writable, "controller"), e), @getByIdDirectPrivate(stream, "backpressure"))
    @transformStreamSetBackpressure(stream, !1);
})
(function (stream, backpressure) {"use strict";
  let backpressureChangePromise = @getByIdDirectPrivate(stream, "backpressureChangePromise");
  if (backpressureChangePromise !== @undefined)
    backpressureChangePromise.resolve.@call();
  @putByIdDirectPrivate(stream, "backpressureChangePromise", @newPromiseCapability(@Promise)), @putByIdDirectPrivate(stream, "backpressure", backpressure);
})
(function (inspect) {"use strict";
  return function stylizeWithColor(str, styleType) {
    let style = inspect.styles[styleType];
    if (style !== @undefined) {
      let color = inspect.colors[style];
      if (color !== @undefined)
        return `\x1B[${color[0]}m${str}\x1B[${color[1]}m`;
    }
    return str;
  };
})
(function (str) {"use strict";
  return str;
})
(async function (stream) {"use strict";
  try {
    for await (let chunk of stream)
      this.addBytes(chunk);
  } catch (error) {
    this.fail(error);
    return;
  }
  this.finalize();
})
(function (e) {"use strict";
  if (@getByIdDirectPrivate(this, "abortSteps") === @undefined)
    throw @makeErrorWithCode(139, "WritableStreamDefaultController");
  let stream = @getByIdDirectPrivate(this, "stream");
  if (@getByIdDirectPrivate(stream, "state") !== "writable")
    return;
  @writableStreamDefaultControllerError(this, e);
})
(function () {"use strict";
  return @putByIdDirectPrivate(this, "queue", @newQueue()), @putByIdDirectPrivate(this, "abortSteps", (reason) => {
    let result = @getByIdDirectPrivate(this, "abortAlgorithm").@call(@undefined, reason);
    return @writableStreamDefaultControllerClearAlgorithms(this), result;
  }), @putByIdDirectPrivate(this, "errorSteps", () => {
    @resetQueue(@getByIdDirectPrivate(this, "queue"));
  }), this;
})
(function (reason) {"use strict";
  if (!@isWritableStreamDefaultWriter(this))
    return @Promise.@reject(@makeErrorWithCode(139, "WritableStreamDefaultWriter"));
  if (@getByIdDirectPrivate(this, "stream") === @undefined)
    return @Promise.@reject(@makeTypeError("WritableStreamDefaultWriter has no stream"));
  return @writableStreamDefaultWriterAbort(this, reason);
})
(function () {"use strict";
  if (!@isWritableStreamDefaultWriter(this))
    return @Promise.@reject(@makeErrorWithCode(139, "WritableStreamDefaultWriter"));
  let stream = @getByIdDirectPrivate(this, "stream");
  if (stream === @undefined)
    return @Promise.@reject(@makeTypeError("WritableStreamDefaultWriter has no stream"));
  if (@writableStreamCloseQueuedOrInFlight(stream))
    return @Promise.@reject(@makeTypeError("WritableStreamDefaultWriter is being closed"));
  return @writableStreamDefaultWriterClose(this);
})
(function () {"use strict";
  if (!@isWritableStreamDefaultWriter(this))
    return @Promise.@reject(@makeGetterTypeError("WritableStreamDefaultWriter", "closed"));
  return @getByIdDirectPrivate(this, "closedPromise").promise;
})
(function () {"use strict";
  if (!@isWritableStreamDefaultWriter(this))
    throw @makeErrorWithCode(139, "WritableStreamDefaultWriter");
  if (@getByIdDirectPrivate(this, "stream") === @undefined)
    @throwTypeError("WritableStreamDefaultWriter has no stream");
  return @writableStreamDefaultWriterGetDesiredSize(this);
})
(function (stream) {"use strict";
  let internalStream = @getInternalWritableStream(stream);
  if (internalStream)
    stream = internalStream;
  if (!@isWritableStream(stream))
    @throwTypeError("WritableStreamDefaultWriter constructor takes a WritableStream");
  return @setUpWritableStreamDefaultWriter(this, stream), this;
})
(function () {"use strict";
  if (!@isWritableStreamDefaultWriter(this))
    return @Promise.@reject(@makeErrorWithCode(139, "WritableStreamDefaultWriter"));
  return @getByIdDirectPrivate(this, "readyPromise").promise;
})
(function () {"use strict";
  if (!@isWritableStreamDefaultWriter(this))
    throw @makeErrorWithCode(139, "WritableStreamDefaultWriter");
  if (@getByIdDirectPrivate(this, "stream") === @undefined)
    return;
  @writableStreamDefaultWriterRelease(this);
})
(function (chunk) {"use strict";
  if (!@isWritableStreamDefaultWriter(this))
    return @Promise.@reject(@makeErrorWithCode(139, "WritableStreamDefaultWriter"));
  if (@getByIdDirectPrivate(this, "stream") === @undefined)
    return @Promise.@reject(@makeTypeError("WritableStreamDefaultWriter has no stream"));
  return @writableStreamDefaultWriterWrite(this, chunk);
})
(function (stream) {"use strict";
  return new @WritableStreamDefaultWriter(stream);
})
(function (underlyingSink, strategy) {"use strict";
  let stream = {};
  if (underlyingSink === @undefined)
    underlyingSink = {};
  if (strategy === @undefined)
    strategy = {};
  if (!@isObject(underlyingSink))
    @throwTypeError("WritableStream constructor takes an object as first argument");
  if ("type" in underlyingSink)
    @throwRangeError("Invalid type is specified");
  let sizeAlgorithm = @extractSizeAlgorithm(strategy), highWaterMark = @extractHighWaterMark(strategy, 1), underlyingSinkDict = {};
  if ("start" in underlyingSink) {
    if (underlyingSinkDict.start = underlyingSink.start, typeof underlyingSinkDict.start !== "function")
      @throwTypeError("underlyingSink.start should be a function");
  }
  if ("write" in underlyingSink) {
    if (underlyingSinkDict.write = underlyingSink.write, typeof underlyingSinkDict.write !== "function")
      @throwTypeError("underlyingSink.write should be a function");
  }
  if ("close" in underlyingSink) {
    if (underlyingSinkDict.close = underlyingSink.close, typeof underlyingSinkDict.close !== "function")
      @throwTypeError("underlyingSink.close should be a function");
  }
  if ("abort" in underlyingSink) {
    if (underlyingSinkDict.abort = underlyingSink.abort, typeof underlyingSinkDict.abort !== "function")
      @throwTypeError("underlyingSink.abort should be a function");
  }
  return @initializeWritableStreamSlots(stream, underlyingSink), @setUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, underlyingSinkDict, highWaterMark, sizeAlgorithm), stream;
})
(function (startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {"use strict";
  let internalStream = {};
  @initializeWritableStreamSlots(internalStream, {});
  let controller = new @WritableStreamDefaultController;
  return @setUpWritableStreamDefaultController(internalStream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm), @createWritableStreamFromInternal(internalStream);
})
(function (stream, underlyingSink) {"use strict";
  @putByIdDirectPrivate(stream, "state", "writable"), @putByIdDirectPrivate(stream, "storedError", @undefined), @putByIdDirectPrivate(stream, "writer", @undefined), @putByIdDirectPrivate(stream, "controller", @undefined), @putByIdDirectPrivate(stream, "inFlightWriteRequest", @undefined), @putByIdDirectPrivate(stream, "closeRequest", @undefined), @putByIdDirectPrivate(stream, "inFlightCloseRequest", @undefined), @putByIdDirectPrivate(stream, "pendingAbortRequest", @undefined), @putByIdDirectPrivate(stream, "writeRequests", @createFIFO()), @putByIdDirectPrivate(stream, "backpressure", !1), @putByIdDirectPrivate(stream, "underlyingSink", underlyingSink);
})
(function () {"use strict";})
(function (stream) {"use strict";
  return @isObject(stream) && !!@getByIdDirectPrivate(stream, "underlyingSink");
})
(function (writer) {"use strict";
  return @isObject(writer) && !!@getByIdDirectPrivate(writer, "closedPromise");
})
(function (stream) {"use strict";
  return @getByIdDirectPrivate(stream, "writer") !== @undefined;
})
(function (stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {"use strict";
  @putByIdDirectPrivate(controller, "stream", stream), @putByIdDirectPrivate(stream, "controller", controller), @resetQueue(@getByIdDirectPrivate(controller, "queue")), @putByIdDirectPrivate(controller, "started", -1), @putByIdDirectPrivate(controller, "startAlgorithm", startAlgorithm), @putByIdDirectPrivate(controller, "strategySizeAlgorithm", sizeAlgorithm), @putByIdDirectPrivate(controller, "strategyHWM", highWaterMark), @putByIdDirectPrivate(controller, "writeAlgorithm", writeAlgorithm), @putByIdDirectPrivate(controller, "closeAlgorithm", closeAlgorithm), @putByIdDirectPrivate(controller, "abortAlgorithm", abortAlgorithm);
  let backpressure = @writableStreamDefaultControllerGetBackpressure(controller);
  @writableStreamUpdateBackpressure(stream, backpressure), @writableStreamDefaultControllerStart(controller);
})
(function (stream, underlyingSink, underlyingSinkDict, highWaterMark, sizeAlgorithm) {"use strict";
  let controller = new @WritableStreamDefaultController, startAlgorithm = () => {}, writeAlgorithm = () => {
    return @Promise.@resolve();
  }, closeAlgorithm = () => {
    return @Promise.@resolve();
  }, abortAlgorithm = () => {
    return @Promise.@resolve();
  };
  if ("start" in underlyingSinkDict) {
    let startMethod = underlyingSinkDict.start;
    startAlgorithm = () => @promiseInvokeOrNoopMethodNoCatch(underlyingSink, startMethod, [controller]);
  }
  if ("write" in underlyingSinkDict) {
    let writeMethod = underlyingSinkDict.write;
    writeAlgorithm = (chunk) => @promiseInvokeOrNoopMethod(underlyingSink, writeMethod, [chunk, controller]);
  }
  if ("close" in underlyingSinkDict) {
    let closeMethod = underlyingSinkDict.close;
    closeAlgorithm = () => @promiseInvokeOrNoopMethod(underlyingSink, closeMethod, []);
  }
  if ("abort" in underlyingSinkDict) {
    let abortMethod = underlyingSinkDict.abort;
    abortAlgorithm = (reason) => @promiseInvokeOrNoopMethod(underlyingSink, abortMethod, [reason]);
  }
  @setUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
})
(function (writer, stream) {"use strict";
  if (@isWritableStreamLocked(stream))
    @throwTypeError("WritableStream is locked");
  @putByIdDirectPrivate(writer, "stream", stream), @putByIdDirectPrivate(stream, "writer", writer);
  let readyPromiseCapability = @newPromiseCapability(@Promise), closedPromiseCapability = @newPromiseCapability(@Promise);
  @putByIdDirectPrivate(writer, "readyPromise", readyPromiseCapability), @putByIdDirectPrivate(writer, "closedPromise", closedPromiseCapability);
  let state = @getByIdDirectPrivate(stream, "state");
  if (state === "writable") {
    if (@writableStreamCloseQueuedOrInFlight(stream) || !@getByIdDirectPrivate(stream, "backpressure"))
      readyPromiseCapability.resolve.@call();
  } else if (state === "erroring")
    readyPromiseCapability.reject.@call(@undefined, @getByIdDirectPrivate(stream, "storedError")), @markPromiseAsHandled(readyPromiseCapability.promise);
  else if (state === "closed")
    readyPromiseCapability.resolve.@call(), closedPromiseCapability.resolve.@call();
  else {
    let storedError = @getByIdDirectPrivate(stream, "storedError");
    readyPromiseCapability.reject.@call(@undefined, storedError), @markPromiseAsHandled(readyPromiseCapability.promise), closedPromiseCapability.reject.@call(@undefined, storedError), @markPromiseAsHandled(closedPromiseCapability.promise);
  }
})
(function (stream, reason) {"use strict";
  let state = @getByIdDirectPrivate(stream, "state");
  if (state === "closed" || state === "errored")
    return @Promise.@resolve();
  let pendingAbortRequest = @getByIdDirectPrivate(stream, "pendingAbortRequest");
  if (pendingAbortRequest !== @undefined)
    return pendingAbortRequest.promise.promise;
  let wasAlreadyErroring = !1;
  if (state === "erroring")
    wasAlreadyErroring = !0, reason = @undefined;
  let abortPromiseCapability = @newPromiseCapability(@Promise);
  if (@putByIdDirectPrivate(stream, "pendingAbortRequest", {
    promise: abortPromiseCapability,
    reason,
    wasAlreadyErroring
  }), !wasAlreadyErroring)
    @writableStreamStartErroring(stream, reason);
  return abortPromiseCapability.promise;
})
(function (stream, reason) {"use strict";
  if (@isWritableStreamLocked(stream))
    return @Promise.@reject(@makeTypeError("WritableStream.abort method can only be used on non locked WritableStream"));
  return @writableStreamAbort(stream, reason);
})
(function (stream) {"use strict";
  let writePromiseCapability = @newPromiseCapability(@Promise);
  return @getByIdDirectPrivate(stream, "writeRequests").push(writePromiseCapability), writePromiseCapability.promise;
})
(function (stream) {"use strict";
  let state = @getByIdDirectPrivate(stream, "state");
  if (state === "closed" || state === "errored")
    return @Promise.@reject(@makeTypeError("Cannot close a writable stream that is closed or errored"));
  let closePromiseCapability = @newPromiseCapability(@Promise);
  @putByIdDirectPrivate(stream, "closeRequest", closePromiseCapability);
  let writer = @getByIdDirectPrivate(stream, "writer");
  if (writer !== @undefined && @getByIdDirectPrivate(stream, "backpressure") && state === "writable")
    @getByIdDirectPrivate(writer, "readyPromise").resolve.@call();
  return @writableStreamDefaultControllerClose(@getByIdDirectPrivate(stream, "controller")), closePromiseCapability.promise;
})
(function (stream) {"use strict";
  if (@isWritableStreamLocked(stream))
    return @Promise.@reject(@makeTypeError("WritableStream.close method can only be used on non locked WritableStream"));
  if (@writableStreamCloseQueuedOrInFlight(stream))
    return @Promise.@reject(@makeTypeError("WritableStream.close method can only be used on a being close WritableStream"));
  return @writableStreamClose(stream);
})
(function (stream) {"use strict";
  return @getByIdDirectPrivate(stream, "closeRequest") !== @undefined || @getByIdDirectPrivate(stream, "inFlightCloseRequest") !== @undefined;
})
(function (stream, error) {"use strict";
  if (@getByIdDirectPrivate(stream, "state") === "writable") {
    @writableStreamStartErroring(stream, error);
    return;
  }
  @writableStreamFinishErroring(stream);
})
(function (controller) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "stream");
  if (@getByIdDirectPrivate(controller, "started") !== 1)
    return;
  if (@getByIdDirectPrivate(stream, "inFlightWriteRequest") !== @undefined)
    return;
  if (@getByIdDirectPrivate(stream, "state") === "erroring") {
    @writableStreamFinishErroring(stream);
    return;
  }
  let queue = @getByIdDirectPrivate(controller, "queue");
  if (queue.content?.isEmpty() ?? !1)
    return;
  let value = @peekQueueValue(queue);
  if (value === @isCloseSentinel)
    @writableStreamDefaultControllerProcessClose(controller);
  else
    @writableStreamDefaultControllerProcessWrite(controller, value);
})
(function (controller) {"use strict";
  @putByIdDirectPrivate(controller, "writeAlgorithm", @undefined), @putByIdDirectPrivate(controller, "closeAlgorithm", @undefined), @putByIdDirectPrivate(controller, "abortAlgorithm", @undefined), @putByIdDirectPrivate(controller, "strategySizeAlgorithm", @undefined);
})
(function (controller) {"use strict";
  @enqueueValueWithSize(@getByIdDirectPrivate(controller, "queue"), @isCloseSentinel, 0), @writableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
})
(function (controller, error) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "stream");
  @writableStreamDefaultControllerClearAlgorithms(controller), @writableStreamStartErroring(stream, error);
})
(function (controller, error) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "stream");
  if (@getByIdDirectPrivate(stream, "state") === "writable")
    @writableStreamDefaultControllerError(controller, error);
})
(function (controller) {"use strict";
  return @writableStreamDefaultControllerGetDesiredSize(controller) <= 0;
})
(function (controller, chunk) {"use strict";
  try {
    return @getByIdDirectPrivate(controller, "strategySizeAlgorithm").@call(@undefined, chunk);
  } catch (e) {
    return @writableStreamDefaultControllerErrorIfNeeded(controller, e), 1;
  }
})
(function (controller) {"use strict";
  return @getByIdDirectPrivate(controller, "strategyHWM") - @getByIdDirectPrivate(controller, "queue").size;
})
(function (controller) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "stream");
  @writableStreamMarkCloseRequestInFlight(stream), @dequeueValue(@getByIdDirectPrivate(controller, "queue"));
  let sinkClosePromise = @getByIdDirectPrivate(controller, "closeAlgorithm").@call();
  @writableStreamDefaultControllerClearAlgorithms(controller), sinkClosePromise.@then(() => {
    @writableStreamFinishInFlightClose(stream);
  }, (reason) => {
    @writableStreamFinishInFlightCloseWithError(stream, reason);
  });
})
(function (controller, chunk) {"use strict";
  let stream = @getByIdDirectPrivate(controller, "stream");
  @writableStreamMarkFirstWriteRequestInFlight(stream), @getByIdDirectPrivate(controller, "writeAlgorithm").@call(@undefined, chunk).@then(() => {
    @writableStreamFinishInFlightWrite(stream);
    let state = @getByIdDirectPrivate(stream, "state");
    if (@dequeueValue(@getByIdDirectPrivate(controller, "queue")), !@writableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
      let backpressure = @writableStreamDefaultControllerGetBackpressure(controller);
      @writableStreamUpdateBackpressure(stream, backpressure);
    }
    @writableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
  }, (reason) => {
    if (@getByIdDirectPrivate(stream, "state") === "writable")
      @writableStreamDefaultControllerClearAlgorithms(controller);
    @writableStreamFinishInFlightWriteWithError(stream, reason);
  });
})
(function (controller) {"use strict";
  if (@getByIdDirectPrivate(controller, "started") !== -1)
    return;
  @putByIdDirectPrivate(controller, "started", 0);
  let startAlgorithm = @getByIdDirectPrivate(controller, "startAlgorithm");
  @putByIdDirectPrivate(controller, "startAlgorithm", @undefined);
  let stream = @getByIdDirectPrivate(controller, "stream");
  return @Promise.@resolve(startAlgorithm.@call()).@then(() => {
    let state = @getByIdDirectPrivate(stream, "state");
    @putByIdDirectPrivate(controller, "started", 1), @writableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
  }, (error) => {
    let state = @getByIdDirectPrivate(stream, "state");
    @putByIdDirectPrivate(controller, "started", 1), @writableStreamDealWithRejection(stream, error);
  });
})
(function (controller, chunk, chunkSize) {"use strict";
  try {
    @enqueueValueWithSize(@getByIdDirectPrivate(controller, "queue"), chunk, chunkSize);
    let stream = @getByIdDirectPrivate(controller, "stream"), state = @getByIdDirectPrivate(stream, "state");
    if (!@writableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
      let backpressure = @writableStreamDefaultControllerGetBackpressure(controller);
      @writableStreamUpdateBackpressure(stream, backpressure);
    }
    @writableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
  } catch (e) {
    @writableStreamDefaultControllerErrorIfNeeded(controller, e);
  }
})
(function (writer, reason) {"use strict";
  let stream = @getByIdDirectPrivate(writer, "stream");
  return @writableStreamAbort(stream, reason);
})
(function (writer) {"use strict";
  let stream = @getByIdDirectPrivate(writer, "stream");
  return @writableStreamClose(stream);
})
(function (writer) {"use strict";
  let stream = @getByIdDirectPrivate(writer, "stream"), state = @getByIdDirectPrivate(stream, "state");
  if (@writableStreamCloseQueuedOrInFlight(stream) || state === "closed")
    return @Promise.@resolve();
  if (state === "errored")
    return @Promise.@reject(@getByIdDirectPrivate(stream, "storedError"));
  return @writableStreamDefaultWriterClose(writer);
})
(function (writer, error) {"use strict";
  let closedPromiseCapability = @getByIdDirectPrivate(writer, "closedPromise"), closedPromise = closedPromiseCapability.promise;
  if ((@getPromiseInternalField(closedPromise, @promiseFieldFlags) & @promiseStateMask) !== @promiseStatePending)
    closedPromiseCapability = @newPromiseCapability(@Promise), closedPromise = closedPromiseCapability.promise, @putByIdDirectPrivate(writer, "closedPromise", closedPromiseCapability);
  closedPromiseCapability.reject.@call(@undefined, error), @markPromiseAsHandled(closedPromise);
})
(function (writer, error) {"use strict";
  let readyPromiseCapability = @getByIdDirectPrivate(writer, "readyPromise"), readyPromise = readyPromiseCapability.promise;
  if ((@getPromiseInternalField(readyPromise, @promiseFieldFlags) & @promiseStateMask) !== @promiseStatePending)
    readyPromiseCapability = @newPromiseCapability(@Promise), readyPromise = readyPromiseCapability.promise, @putByIdDirectPrivate(writer, "readyPromise", readyPromiseCapability);
  readyPromiseCapability.reject.@call(@undefined, error), @markPromiseAsHandled(readyPromise);
})
(function (writer) {"use strict";
  let stream = @getByIdDirectPrivate(writer, "stream"), state = @getByIdDirectPrivate(stream, "state");
  if (state === "errored" || state === "erroring")
    return null;
  if (state === "closed")
    return 0;
  return @writableStreamDefaultControllerGetDesiredSize(@getByIdDirectPrivate(stream, "controller"));
})
(function (writer) {"use strict";
  let stream = @getByIdDirectPrivate(writer, "stream"), releasedError = @makeTypeError("writableStreamDefaultWriterRelease");
  @writableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError), @writableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError), @putByIdDirectPrivate(stream, "writer", @undefined), @putByIdDirectPrivate(writer, "stream", @undefined);
})
(function (writer, chunk) {"use strict";
  let stream = @getByIdDirectPrivate(writer, "stream"), controller = @getByIdDirectPrivate(stream, "controller"), chunkSize = @writableStreamDefaultControllerGetChunkSize(controller, chunk);
  if (stream !== @getByIdDirectPrivate(writer, "stream"))
    return @Promise.@reject(@makeTypeError("writer is not stream's writer"));
  let state = @getByIdDirectPrivate(stream, "state");
  if (state === "errored")
    return @Promise.@reject(@getByIdDirectPrivate(stream, "storedError"));
  if (@writableStreamCloseQueuedOrInFlight(stream) || state === "closed")
    return @Promise.@reject(@makeTypeError("stream is closing or closed"));
  if (@writableStreamCloseQueuedOrInFlight(stream) || state === "closed")
    return @Promise.@reject(@makeTypeError("stream is closing or closed"));
  if (state === "erroring")
    return @Promise.@reject(@getByIdDirectPrivate(stream, "storedError"));
  let promise = @writableStreamAddWriteRequest(stream);
  return @writableStreamDefaultControllerWrite(controller, chunk, chunkSize), promise;
})
(function (stream) {"use strict";
  @putByIdDirectPrivate(stream, "state", "errored");
  let controller = @getByIdDirectPrivate(stream, "controller");
  @getByIdDirectPrivate(controller, "errorSteps").@call();
  let storedError = @getByIdDirectPrivate(stream, "storedError"), requests = @getByIdDirectPrivate(stream, "writeRequests");
  for (var request = requests.shift();request; request = requests.shift())
    request.reject.@call(@undefined, storedError);
  @putByIdDirectPrivate(stream, "writeRequests", @createFIFO());
  let abortRequest = @getByIdDirectPrivate(stream, "pendingAbortRequest");
  if (abortRequest === @undefined) {
    @writableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    return;
  }
  if (@putByIdDirectPrivate(stream, "pendingAbortRequest", @undefined), abortRequest.wasAlreadyErroring) {
    abortRequest.promise.reject.@call(@undefined, storedError), @writableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
    return;
  }
  @getByIdDirectPrivate(controller, "abortSteps").@call(@undefined, abortRequest.reason).@then(() => {
    abortRequest.promise.resolve.@call(), @writableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
  }, (reason) => {
    abortRequest.promise.reject.@call(@undefined, reason), @writableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
  });
})
(function (stream) {"use strict";
  if (@getByIdDirectPrivate(stream, "inFlightCloseRequest").resolve.@call(), @putByIdDirectPrivate(stream, "inFlightCloseRequest", @undefined), @getByIdDirectPrivate(stream, "state") === "erroring") {
    @putByIdDirectPrivate(stream, "storedError", @undefined);
    let abortRequest = @getByIdDirectPrivate(stream, "pendingAbortRequest");
    if (abortRequest !== @undefined)
      abortRequest.promise.resolve.@call(), @putByIdDirectPrivate(stream, "pendingAbortRequest", @undefined);
  }
  @putByIdDirectPrivate(stream, "state", "closed");
  let writer = @getByIdDirectPrivate(stream, "writer");
  if (writer !== @undefined)
    @getByIdDirectPrivate(writer, "closedPromise").resolve.@call();
})
(function (stream, error) {"use strict";
  @getByIdDirectPrivate(stream, "inFlightCloseRequest").reject.@call(@undefined, error), @putByIdDirectPrivate(stream, "inFlightCloseRequest", @undefined);
  let state = @getByIdDirectPrivate(stream, "state"), abortRequest = @getByIdDirectPrivate(stream, "pendingAbortRequest");
  if (abortRequest !== @undefined)
    abortRequest.promise.reject.@call(@undefined, error), @putByIdDirectPrivate(stream, "pendingAbortRequest", @undefined);
  @writableStreamDealWithRejection(stream, error);
})
(function (stream) {"use strict";
  @getByIdDirectPrivate(stream, "inFlightWriteRequest").resolve.@call(), @putByIdDirectPrivate(stream, "inFlightWriteRequest", @undefined);
})
(function (stream, error) {"use strict";
  @getByIdDirectPrivate(stream, "inFlightWriteRequest").reject.@call(@undefined, error), @putByIdDirectPrivate(stream, "inFlightWriteRequest", @undefined);
  let state = @getByIdDirectPrivate(stream, "state");
  @writableStreamDealWithRejection(stream, error);
})
(function (stream) {"use strict";
  return @getByIdDirectPrivate(stream, "inFlightWriteRequest") !== @undefined || @getByIdDirectPrivate(stream, "inFlightCloseRequest") !== @undefined;
})
(function (stream) {"use strict";
  let closeRequest = @getByIdDirectPrivate(stream, "closeRequest");
  @putByIdDirectPrivate(stream, "inFlightCloseRequest", closeRequest), @putByIdDirectPrivate(stream, "closeRequest", @undefined);
})
(function (stream) {"use strict";
  let writeRequest = @getByIdDirectPrivate(stream, "writeRequests").shift();
  @putByIdDirectPrivate(stream, "inFlightWriteRequest", writeRequest);
})
(function (stream) {"use strict";
  let storedError = @getByIdDirectPrivate(stream, "storedError"), closeRequest = @getByIdDirectPrivate(stream, "closeRequest");
  if (closeRequest !== @undefined)
    closeRequest.reject.@call(@undefined, storedError), @putByIdDirectPrivate(stream, "closeRequest", @undefined);
  let writer = @getByIdDirectPrivate(stream, "writer");
  if (writer !== @undefined) {
    let closedPromise = @getByIdDirectPrivate(writer, "closedPromise");
    closedPromise.reject.@call(@undefined, storedError), @markPromiseAsHandled(closedPromise.promise);
  }
})
(function (stream, reason) {"use strict";
  let controller = @getByIdDirectPrivate(stream, "controller");
  @putByIdDirectPrivate(stream, "state", "erroring"), @putByIdDirectPrivate(stream, "storedError", reason);
  let writer = @getByIdDirectPrivate(stream, "writer");
  if (writer !== @undefined)
    @writableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
  if (!@writableStreamHasOperationMarkedInFlight(stream) && @getByIdDirectPrivate(controller, "started") === 1)
    @writableStreamFinishErroring(stream);
})
(function (stream, backpressure) {"use strict";
  let writer = @getByIdDirectPrivate(stream, "writer");
  if (writer !== @undefined && backpressure !== @getByIdDirectPrivate(stream, "backpressure"))
    if (backpressure)
      @putByIdDirectPrivate(writer, "readyPromise", @newPromiseCapability(@Promise));
    else
      @getByIdDirectPrivate(writer, "readyPromise").resolve.@call();
  @putByIdDirectPrivate(stream, "backpressure", backpressure);
})
(function (createShellInterpreter_, createParsedShellScript_) {"use strict";
  let createShellInterpreter = createShellInterpreter_, createParsedShellScript = createParsedShellScript_;
  function lazyBufferToHumanReadableString() {
    return this.toString();
  }

  class ShellError extends Error {
    #output = @undefined;
    info;
    exitCode;
    stdout;
    stderr;
    constructor() {
      super("");
    }
    initialize(output, code) {
      this.message = `Failed with exit code ${code}`, this.#output = output, this.name = "ShellError", Object.defineProperty(this, "info", {
        value: {
          exitCode: code,
          stderr: output.stderr,
          stdout: output.stdout
        },
        writable: !0,
        enumerable: !1,
        configurable: !0
      }), this.info.stdout.toJSON = lazyBufferToHumanReadableString, this.info.stderr.toJSON = lazyBufferToHumanReadableString, this.stdout = output.stdout, this.stderr = output.stderr, this.exitCode = code;
    }
    text(encoding) {
      return this.#output.text(encoding);
    }
    json() {
      return this.#output.json();
    }
    arrayBuffer() {
      return this.#output.arrayBuffer();
    }
    bytes() {
      return this.#output.bytes();
    }
    blob() {
      return this.#output.blob();
    }
  }

  class ShellOutput {
    stdout;
    stderr;
    exitCode;
    constructor(stdout, stderr, exitCode) {
      this.stdout = stdout, this.stderr = stderr, this.exitCode = exitCode;
    }
    text(encoding) {
      return this.stdout.toString(encoding);
    }
    json() {
      return JSON.parse(this.stdout.toString());
    }
    arrayBuffer() {
      return this.stdout.buffer;
    }
    bytes() {
      return new @Uint8Array(this.arrayBuffer());
    }
    blob() {
      return new Blob([this.stdout]);
    }
  }

  class ShellPromise extends Promise {
    #args = @undefined;
    #hasRun = !1;
    #throws = !0;
    #resolve;
    #reject;
    constructor(args, throws) {
      let potentialError = new ShellError, resolve, reject;
      super((res, rej) => {
        resolve = (code, stdout, stderr) => {
          let out = new ShellOutput(stdout, stderr, code);
          if (this.#throws && code !== 0)
            potentialError.initialize(out, code), rej(potentialError);
          else
            potentialError = @undefined, res(out);
        }, reject = (code, stdout, stderr) => {
          potentialError.initialize(new ShellOutput(stdout, stderr, code), code), rej(potentialError);
        };
      });
      this.#throws = throws, this.#args = args, this.#hasRun = !1, this.#resolve = resolve, this.#reject = reject;
    }
    cwd(newCwd) {
      if (this.#throwIfRunning(), typeof newCwd > "u" || newCwd === "." || newCwd === "" || newCwd === "./")
        newCwd = defaultCwd ?? process.cwd();
      return this.#args.setCwd(newCwd), this;
    }
    env(newEnv) {
      if (this.#throwIfRunning(), typeof newEnv > "u")
        newEnv = defaultEnv;
      return this.#args.setEnv(newEnv), this;
    }
    #run() {
      if (!this.#hasRun) {
        this.#hasRun = !0;
        let interp = createShellInterpreter(this.#resolve, this.#reject, this.#args);
        this.#args = @undefined, interp.run();
      }
    }
    #quiet(isQuiet = !0) {
      return this.#throwIfRunning(), this.#args.setQuiet(isQuiet), this;
    }
    quiet(isQuiet) {
      return this.#quiet(isQuiet ?? !0);
    }
    nothrow() {
      return this.#throws = !1, this;
    }
    throws(doThrow) {
      return this.#throws = !!doThrow, this;
    }
    async text(encoding) {
      let { stdout } = await this.#quiet(!0);
      return stdout.toString(encoding);
    }
    async json() {
      let { stdout } = await this.#quiet(!0);
      return JSON.parse(stdout.toString());
    }
    async* lines() {
      let { stdout } = await this.#quiet(!0);
      yield* stdout.toString().split(/\r?\n/);
    }
    async arrayBuffer() {
      let { stdout } = await this.#quiet(!0);
      return stdout.buffer;
    }
    async bytes() {
      return this.arrayBuffer().then((x) => new @Uint8Array(x));
    }
    async blob() {
      let { stdout } = await this.#quiet(!0);
      return new Blob([stdout]);
    }
    #throwIfRunning() {
      if (this.#hasRun)
        throw Error("Shell is already running");
    }
    run() {
      return this.#run(), this;
    }
    then(onfulfilled, onrejected) {
      return this.#run(), super.then(onfulfilled, onrejected);
    }
    static get [Symbol.species]() {
      return @Promise;
    }
  }
  var defaultEnv = process.env || {};
  let originalDefaultEnv = defaultEnv;
  var defaultCwd = @undefined;
  let cwdSymbol = Symbol("cwd"), envSymbol = Symbol("env"), throwsSymbol = Symbol("throws");

  class ShellPrototype {
    [cwdSymbol];
    [envSymbol];
    [throwsSymbol] = !0;
    env(newEnv) {
      if (typeof newEnv > "u" || newEnv === originalDefaultEnv)
        this[envSymbol] = originalDefaultEnv;
      else if (newEnv)
        this[envSymbol] = Object.assign({}, newEnv);
      else
        @throwTypeError("env must be an object or undefined");
      return this;
    }
    cwd(newCwd) {
      if (typeof newCwd > "u" || typeof newCwd === "string") {
        if (newCwd === "." || newCwd === "" || newCwd === "./")
          newCwd = defaultCwd ?? process.cwd();
        this[cwdSymbol] = newCwd;
      } else
        @throwTypeError("cwd must be a string or undefined");
      return this;
    }
    nothrow() {
      return this[throwsSymbol] = !1, this;
    }
    throws(doThrow) {
      return this[throwsSymbol] = !!doThrow, this;
    }
  }
  var BunShell = function BunShell2(first, ...rest) {
    if (first?.raw === @undefined)
      throw Error("Please use '$' as a tagged template function: $`cmd arg1 arg2`");
    let parsed_shell_script = createParsedShellScript(first.raw, rest), cwd = BunShell2[cwdSymbol], env = BunShell2[envSymbol], throws = BunShell2[throwsSymbol];
    if (cwd)
      parsed_shell_script.setCwd(cwd);
    if (env)
      parsed_shell_script.setEnv(env);
    return new ShellPromise(parsed_shell_script, throws);
  };
  function Shell() {
    if (!new.target)
      @throwTypeError("Class constructor Shell cannot be invoked without 'new'");
    var Shell2 = function Shell3(first, ...rest) {
      if (first?.raw === @undefined)
        throw Error("Please use '$' as a tagged template function: $`cmd arg1 arg2`");
      let parsed_shell_script = createParsedShellScript(first.raw, rest), cwd = Shell3[cwdSymbol], env = Shell3[envSymbol], throws = Shell3[throwsSymbol];
      if (cwd)
        parsed_shell_script.setCwd(cwd);
      if (env)
        parsed_shell_script.setEnv(env);
      return new ShellPromise(parsed_shell_script, throws);
    };
    return Object.setPrototypeOf(Shell2, ShellPrototype.prototype), Object.defineProperty(Shell2, "name", { value: "Shell", configurable: !0, enumerable: !0 }), Shell2;
  }
  return Shell.prototype = ShellPrototype.prototype, Object.setPrototypeOf(Shell, ShellPrototype), Object.setPrototypeOf(BunShell, ShellPrototype.prototype), BunShell[cwdSymbol] = defaultCwd, BunShell[envSymbol] = defaultEnv, BunShell[throwsSymbol] = !0, Object.defineProperties(BunShell, {
    Shell: {
      value: Shell,
      enumerable: !0
    },
    ShellPromise: {
      value: ShellPromise,
      enumerable: !0
    },
    ShellError: {
      value: ShellError,
      enumerable: !0
    }
  }), BunShell;
})
