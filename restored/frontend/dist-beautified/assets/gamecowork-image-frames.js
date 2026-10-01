(function (global) {
  "use strict";
  // DOM sizes stay in CSS pixels. Our JPEG bridge has a separate, bounded
  // backing canvas; fit both axes together and never pre-multiply browser DPR.
  function GameCoworkCaptureSize(size) {
    const width = Number(size?.width), height = Number(size?.height);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0)
      throw new Error("编辑器预览区域尚未显示，请打开串流面板后重试");
    const scale = Math.min(1, 1920 / width, 1080 / height);
    const dpr = Number(size.dpr);
    return {
      width: Math.max(16, Math.min(1920, Math.floor(width * scale))),
      height: Math.max(16, Math.min(1080, Math.floor(height * scale))),
      dpr: Number.isFinite(dpr) && dpr > 0 ? Math.min(4, Math.max(.5, dpr)) : 1,
    };
  }
  // This transport consumes only actual bounded JPEG frames from the local
  // editor bridge. HTTP health or a socket open is never a rendered-frame proof.
  class GameCoworkImageFrames {
    constructor({ canvas, request, status, error, refresh }) {
      this.canvas = canvas;
      this.request = request;
      this.onStatus = status;
      this.onError = error;
      this.refresh = refresh;
      this.generation = 0;
      this.active = false;
      this.timer = null;
      this.frameController = null;
      this.inputController = null;
      this.inputs = [];
      this.inputBusy = false;
    }
    state(value, reason) {
      this.canvas.dataset.frameState = value;
      this.onStatus(value, reason);
    }
    start(streamId = "default") {
      this.stop();
      this.active = true;
      this.streamId = streamId;
      this.lastId = 0;
      this.captureEpoch = null; this.geometryRevision = null; this.instanceId = null;
      this.lastFrameAt = Date.now();
      this.failures = 0;
      this.canvas.dataset.frameId = "0";
      this.state("connecting");
      this.poll(this.generation);
    }
    stop() {
      this.active = false;
      this.generation++;
      clearTimeout(this.timer);
      this.timer = null;
      this.frameController?.abort();
      this.inputController?.abort();
      this.frameController = null;
      this.inputController = null;
      this.inputs = [];
      this.inputBusy = false;
      this.canvas.style.display = "none";
      this.canvas.dataset.frameState = "idle";
    }
    async boundedBlob(response) {
      const declared = Number(response.headers.get("content-length"));
      if (declared > 2 * 1024 * 1024) throw new Error("Editor frame exceeds 2 MiB");
      const reader = response.body.getReader();
      const chunks = [];
      let length = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          length += value.byteLength;
          if (length > 2 * 1024 * 1024) throw new Error("Editor frame exceeds 2 MiB");
          chunks.push(value);
        }
      } finally {
        await reader.cancel().catch(() => {});
        reader.releaseLock();
      }
      return new Blob(chunks, { type: "image/jpeg" });
    }
    async poll(generation) {
      if (!this.active || generation !== this.generation) return;
      const controller = new AbortController();
      this.frameController = controller;
      const timeout = setTimeout(() => controller.abort(), 3000);
      let wait = 100;
      try {
        const response = await this.request("/frame?streamId=" + encodeURIComponent(this.streamId), { signal: controller.signal, cache: "no-store" });
        if (!this.active || generation !== this.generation) return;
        if (response.status === 409) {
          const body = await response.json().catch(() => ({}));
          this.state(this.lastId ? "stalled" : "connecting", body.error || "Waiting for a real editor frame");
          wait = 250;
          return;
        }
        if (!response.ok) throw new Error("Editor frame request failed (HTTP " + response.status + ")");
        if (!(response.headers.get("content-type") || "").startsWith("image/jpeg")) throw new Error("Editor returned a non-JPEG frame");
        const streamId = response.headers.get("X-GameCowork-Stream-Id");
        if ((streamId && streamId !== this.streamId) || (this.streamId !== "default" && !streamId)) throw new Error("Editor frame belongs to a different preview stream");
        const id = Number(response.headers.get("X-GameCowork-Frame-Id"));
        if (!Number.isSafeInteger(id) || id < 1) throw new Error("Editor frame has no valid sequence");
        const captureEpoch = response.headers.get("X-GameCowork-Capture-Epoch");
        const geometryRevision = Number(response.headers.get("X-GameCowork-Geometry-Revision"));
        const instanceId = Number(response.headers.get("X-GameCowork-Instance-Id"));
        if (!/^[a-f0-9]{32}$/i.test(captureEpoch || "") || !Number.isSafeInteger(geometryRevision) || geometryRevision < 1 || !response.headers.has("X-GameCowork-Instance-Id") || !Number.isInteger(instanceId) || instanceId === 0 || instanceId < -2147483648 || instanceId > 2147483647) throw new Error("Editor frame has no valid capture identity");
        if (captureEpoch === this.captureEpoch && id <= this.lastId) {
          await response.body.cancel();
          if (Date.now() - this.lastFrameAt > 3000) this.state("stalled", "Unity has not rendered a new frame");
          return;
        }
        const image = await createImageBitmap(await this.boundedBlob(response));
        try {
          if (!this.active || generation !== this.generation) return;
          if (image.width < 16 || image.height < 16 || image.width > 1920 || image.height > 1080) throw new Error("Decoded editor frame dimensions are out of bounds");
          const expectedWidth = Number(response.headers.get("X-GameCowork-Frame-Width"));
          const expectedHeight = Number(response.headers.get("X-GameCowork-Frame-Height"));
          if (expectedWidth !== image.width || expectedHeight !== image.height) throw new Error("Decoded editor frame dimensions do not match its metadata");
          const sourceWidth = Number(response.headers.get("X-GameCowork-Source-Width")), sourceHeight = Number(response.headers.get("X-GameCowork-Source-Height"));
          let contentRect = {x:0,y:0,w:image.width,h:image.height};
          const contentHeader = response.headers.get("X-GameCowork-Content-Rect");
          if (contentHeader) {
            const values = JSON.parse(contentHeader);
            if (!Array.isArray(values) || values.length !== 4 || !values.every(Number.isFinite) || !Number.isSafeInteger(sourceWidth) || !Number.isSafeInteger(sourceHeight) || sourceWidth <= 0 || sourceHeight <= 0 || sourceWidth > 32768 || sourceHeight > 32768) throw new Error("Editor content geometry is invalid");
            contentRect = {x:values[0],y:values[1],w:values[2],h:values[3]};
            if (contentRect.x < 0 || contentRect.y < 0 || contentRect.w <= 0 || contentRect.h <= 0 || contentRect.x + contentRect.w > image.width + .01 || contentRect.y + contentRect.h > image.height + .01 || Math.abs(contentRect.w/contentRect.h-sourceWidth/sourceHeight) > .01) throw new Error("Editor content aspect does not match the real source");
          }
          const captureMode = response.headers.get("X-GameCowork-Capture-Mode");
          if (captureMode && !["render-content", "editor-window"].includes(captureMode)) throw new Error("Editor frame capture mode is invalid");
          const pixelsPerPoint = Number(response.headers.get("X-GameCowork-Pixels-Per-Point") || 1);
          if (!Number.isFinite(pixelsPerPoint) || pixelsPerPoint < .5 || pixelsPerPoint > 4) throw new Error("Editor frame DPI is invalid");
          let windowContentRect = null;
          const windowContentHeader = response.headers.get("X-GameCowork-Window-Content-Rect");
          if (windowContentHeader) {
            const rect = JSON.parse(windowContentHeader);
            if (!Array.isArray(rect) || rect.length !== 4 || !rect.every(Number.isFinite) || rect[0] < 0 || rect[1] < 0 || rect[2] <= 0 || rect[3] <= 0) throw new Error("Editor window content geometry is invalid");
            windowContentRect = rect;
          }
          const captureBackend = response.headers.get("X-GameCowork-Capture-Backend") || "legacy-render-texture";
          const toolbar = response.headers.get("X-GameCowork-Includes-Toolbar") === "true";
          if (captureMode === "editor-window" && (!windowContentRect || !toolbar || captureBackend !== "unity-guiview")) throw new Error("Full EditorWindow frame is missing its actual GUI metadata");
          this.canvas.width = image.width;
          this.canvas.height = image.height;
          this.canvas.getContext("2d").drawImage(image, 0, 0);
          this.canvas.style.display = "block";
          this.canvas.dataset.frameId = String(id);
          this.canvas.dataset.frameWidth = String(image.width);
          this.canvas.dataset.frameHeight = String(image.height);
          this.contentRect = contentRect; this.sourceWidth = sourceWidth; this.sourceHeight = sourceHeight;
          if (this.captureEpoch !== captureEpoch || this.geometryRevision !== geometryRevision) this.inputs = [];
          this.captureEpoch = captureEpoch; this.geometryRevision = geometryRevision; this.instanceId = instanceId;
          this.canvas.dataset.captureEpoch = captureEpoch; this.canvas.dataset.geometryRevision = String(geometryRevision); this.canvas.dataset.instanceId = String(instanceId);
          this.captureMode = captureMode || "render-content"; this.captureBackend = captureBackend;
          this.pixelsPerPoint = pixelsPerPoint; this.windowContentRect = windowContentRect; this.includesToolbar = toolbar;
          this.canvas.dataset.captureMode = this.captureMode; this.canvas.dataset.captureBackend = captureBackend;
          this.canvas.dataset.includesToolbar = String(toolbar); this.canvas.dataset.pixelsPerPoint = String(pixelsPerPoint);
          this.canvas.dataset.windowContentRect = JSON.stringify(windowContentRect);
          this.canvas.dataset.contentRect = JSON.stringify(contentRect);
          this.lastId = id;
          this.lastFrameAt = Date.now();
          this.failures = 0;
          this.state("streaming");
        } finally { image.close(); }
      } catch (error) {
        if (!this.active || generation !== this.generation) return;
        this.failures++;
        this.state("disconnected", error.message || "Editor frame connection failed");
        this.onError(error.message || "Editor frame connection failed");
        if (this.failures >= 2) this.refresh();
        wait = 1000;
      } finally {
        clearTimeout(timeout);
        if (this.frameController === controller) this.frameController = null;
        if (this.active && generation === this.generation) this.timer = setTimeout(() => this.poll(generation), wait);
      }
    }
    sendInput(data) {
      if (!this.active || !this.lastId) return;
      const rect = this.contentRect;
      if (rect && !["keydown","keyup","mouseup","mousedrag"].includes(data.type) &&
          (data.x < rect.x || data.y < rect.y || data.x >= rect.x+rect.w || data.y >= rect.y+rect.h)) {
        if (data.type !== "mousemove") this.onError("黑边不属于编辑器内容");
        return;
      }
      // High frequency pointer movement is coalesced. Clicks and keys retain order.
      const last = this.inputs[this.inputs.length - 1];
      const input = { ...data, streamId: this.streamId, captureEpoch: this.captureEpoch, geometryRevision: this.geometryRevision, instanceId: this.instanceId };
      if ((data.type === "mousemove" || data.type === "mousedrag") && last?.type === data.type) this.inputs[this.inputs.length - 1] = input;
      else if (this.inputs.length < 32) this.inputs.push(input);
      else { this.onError("Editor input queue is full"); return; }
      this.drainInputs(this.generation);
    }
    async drainInputs(generation) {
      if (this.inputBusy || !this.active || generation !== this.generation) return;
      this.inputBusy = true;
      try {
        while (this.active && generation === this.generation && this.inputs.length) {
          const data = this.inputs.shift();
          const controller = new AbortController();
          this.inputController = controller;
          const timeout = setTimeout(() => controller.abort(), 3000);
          try {
            const response = await this.request("/input", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: controller.signal });
            const body = await response.json();
            if (!response.ok || body.success !== true) throw new Error(body.error || "Editor rejected input");
          } catch (error) {
            if (this.active && generation === this.generation) this.onError(error.message || "Editor input failed");
          } finally { clearTimeout(timeout); if (this.inputController === controller) this.inputController = null; }
        }
      } finally { if (generation === this.generation) this.inputBusy = false; }
    }
  }
  class GameCoworkCompositeFrames {
    constructor(options) {
      this.options = options;
      this.canvas = options.canvas;
      this.runners = [];
      this.model = null;
      this.drawSequence = 0;
    }
    start(model) {
      this.stop();
      this.drawSequence = 0; this.frameFingerprint = "";
      this.reconcile(model);
    }
    reconcile(model) {
      const previous = this.runners;
      const identity = slot => [slot.workspaceKey || "", slot.streamId, slot.serverUrl || ""].join("|");
      this.runners = [];
      this.model = model;
      this.canvas.width = model.width;
      this.canvas.height = model.height;
      this.canvas.dataset.frameId = "0";
      this.canvas.dataset.frameState = "connecting";
      for (const slot of model.slots.filter(slot => slot.supported)) {
        const retained = previous.find(entry => identity(entry.slot) === identity(slot));
        if (retained) { retained.slot = slot; this.runners.push(retained); continue; }
        const surface = document.createElement("canvas");
        const entry = { slot, surface, state: "connecting", reason: null };
        const runner = new GameCoworkImageFrames({ ...this.options, canvas: surface, request: (route, options) => entry.slot.serverUrl ? fetch(entry.slot.serverUrl + route, options) : this.options.request(route, options), refresh: () => this.options.refresh?.(entry.slot), status: (state, reason) => {
          entry.state = state; entry.reason = reason;
          this.paint();
        }});
        entry.runner = runner;
        this.runners.push(entry);
      }
      for (const entry of previous) if (!this.runners.includes(entry)) entry.runner.stop();
      this.paint();
      for (const entry of this.runners) if (!previous.includes(entry)) entry.runner.start(entry.slot.streamId);
    }
    stop() {
      for (const entry of this.runners) entry.runner.stop();
      this.runners = [];
      this.model = null;
      this.canvas.style.display = "none";
      this.canvas.dataset.frameState = "idle";
    }
    visibleSlots() {
      if (!this.model) return [];
      const groups = new Map();
      for (const slot of this.model.slots) {
        const key = [slot.rect.x, slot.rect.y, slot.rect.w, slot.rect.h].map(value => value.toFixed(4)).join(":");
        const previous = groups.get(key);
        if (!previous || slot.slotId === this.model.focusedSlotId) groups.set(key, slot);
      }
      return [...groups.values()];
    }
    paint() {
      if (!this.model) return;
      const ctx = this.canvas.getContext("2d"), width = this.canvas.width, height = this.canvas.height;
      ctx.fillStyle = "#151515"; ctx.fillRect(0, 0, width, height);
      for (const slot of this.visibleSlots()) {
        const rect = slot.rect, x = Math.round(rect.x * width), y = Math.round(rect.y * height);
        const w = Math.round(rect.w * width), h = Math.round(rect.h * height);
        const entry = this.runners.find(entry => entry.slot.slotId === slot.slotId);
        if (entry?.runner.lastId) ctx.drawImage(entry.surface, x, y, w, h);
        else { ctx.fillStyle = "#232323"; ctx.fillRect(x, y, w, h); }
        ctx.strokeStyle = "#515151"; ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);
        ctx.fillStyle = "#151515cc"; ctx.fillRect(x, y, w, 27);
        ctx.fillStyle = "#eeeeee"; ctx.font = "12px sans-serif"; ctx.fillText(slot.title || slot.windowType, x + 8, y + 18, Math.max(1, w - 16));
        if (!slot.supported) {
          ctx.fillStyle = "#bbbbbb";
          ctx.fillText(slot.reason || "此窗口画面尚未接入", x + 8, y + 46, Math.max(1, w - 16));
        } else if (entry?.state !== "streaming") {
          ctx.fillStyle = "#ffcc77";
          ctx.fillText(entry?.reason || "正在等待真实画面…", x + 8, y + 46, Math.max(1, w - 16));
        }
      }
      this.canvas.style.display = "block";
      const ready = this.runners.filter(entry => entry.runner.lastId > 0).length;
      const allLive = this.runners.length > 0 && this.runners.every(entry => entry.state === "streaming");
      const allDisconnected = this.runners.length > 0 && this.runners.every(entry => entry.state === "disconnected");
      const focused = this.model.slots.find(slot => slot.slotId === this.model.focusedSlotId);
      this.canvas.dataset.windowType = focused?.windowType || "__composite__";
      this.canvas.dataset.supportedStreams = String(this.runners.length);
      this.canvas.dataset.slotCount = String(this.model.slots.length);
      this.canvas.dataset.decodedStreams = String(ready);
      this.canvas.dataset.streamFrames = JSON.stringify(this.runners.map(entry => ({ streamId: entry.slot.streamId, windowType: entry.slot.windowType, workspaceKey: entry.slot.workspaceKey, workspaceRoot: entry.slot.workspaceRoot, frameId: entry.runner.lastId || 0, frameWidth:entry.surface.width,frameHeight:entry.surface.height,contentRect:entry.runner.contentRect,sourceWidth:entry.runner.sourceWidth,sourceHeight:entry.runner.sourceHeight,captureMode:entry.runner.captureMode,captureBackend:entry.runner.captureBackend,includesToolbar:entry.runner.includesToolbar,pixelsPerPoint:entry.runner.pixelsPerPoint,windowContentRect:entry.runner.windowContentRect,captureEpoch:entry.runner.captureEpoch,geometryRevision:entry.runner.geometryRevision,instanceId:entry.runner.instanceId })));
      const fingerprint = this.runners.map(entry => entry.runner.lastId || 0).join(",");
      if (ready && fingerprint !== this.frameFingerprint) { this.drawSequence++; this.frameFingerprint = fingerprint; }
      this.canvas.dataset.frameId = String(this.drawSequence);
      this.canvas.dataset.frameState = !this.runners.length || allDisconnected ? "disconnected" : allLive ? "streaming" : ready ? "stalled" : "connecting";
      const unsupported = this.model.slots.filter(slot => !slot.supported).length;
      this.options.status(this.canvas.dataset.frameState, !this.runners.length ? "当前布局没有已支持的真实编辑器画面" : allDisconnected ? "所有视口连接已断开" : allLive ? unsupported ? `${unsupported}个窗口画面尚未接入` : undefined : "部分视口正在等待实际编辑器画面");
    }
    sendInput(data) {
      if (!this.model) return;
      let slot;
      if (data.type === "keydown" || data.type === "keyup") slot = this.model.slots.find(slot => slot.slotId === this.model.focusedSlotId);
      else slot = this.visibleSlots().find(slot => data.x >= slot.rect.x * this.canvas.width && data.y >= slot.rect.y * this.canvas.height && data.x < (slot.rect.x + slot.rect.w) * this.canvas.width && data.y < (slot.rect.y + slot.rect.h) * this.canvas.height);
      if (!slot?.supported) { this.options.error("此窗口输入尚未接入"); return; }
      if (data.type === "mousedown") this.model.focusedSlotId = slot.slotId;
      const entry = this.runners.find(entry => entry.slot.slotId === slot.slotId);
      const mapped = { ...data, x: (data.x - slot.rect.x * this.canvas.width) / slot.rect.w / this.canvas.width * entry.surface.width,
        y: (data.y - slot.rect.y * this.canvas.height) / slot.rect.h / this.canvas.height * entry.surface.height };
      entry.runner.sendInput(mapped);
    }
    snapshot() {
      return this.model ? this.model.slots.map(slot => ({ slotId: slot.slotId, windowType: slot.windowType, captureMode: slot.captureMode, title: slot.title, workspaceKey: slot.workspaceKey, workspaceRoot: slot.workspaceRoot, rect: slot.rect, active: slot.slotId === this.model.focusedSlotId, supported: slot.supported })) : [];
    }
  }
  class GameCoworkMultiProjectFrames {
    constructor(options) {
      this.options = options;
      this.composite = new GameCoworkCompositeFrames({...options, refresh: slot => this.refresh(slot)});
      this.groups = new Map(); this.generation = 0; this.queue = Promise.resolve(); this.layout = null;
      this.retryTimers = new Map();
    }
    async endpoint(scope) {
      const normalize = value => String(value).replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
      if (!scope.workspaceKey || !scope.workspaceRoot) throw new Error("预览槽位缺少固定工程身份");
      const response = await fetch(location.origin + "/api/tauri/hub/workspaces", {signal: AbortSignal.timeout(5000)});
      if (!response.ok) throw new Error("无法读取已打开工程");
      const registry = await response.json(), project = registry.workspaces?.find(project => project.workspaceKey === scope.workspaceKey);
      if (!project) throw new Error("该工程未打开，请先打开原工程");
      if (project.isRemote || normalize(project.workspaceDir) !== normalize(scope.workspaceRoot)) throw new Error("槽位工程身份不匹配");
      const reply = await fetch(location.origin + "/api/tauri/invoke", {method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({messageType:"unity/windowBridge/startStreamServer",messageId:crypto.randomUUID(),workspaceKey:scope.workspaceKey,data:{}}), signal:AbortSignal.timeout(10000)}).then(response => response.json());
      const result = reply.data?.content?.content;
      if (reply.data?.status !== "success" || result?.status !== "success") throw new Error(reply.data?.error || result?.error || "原工程编辑器桥未连接");
      if (normalize(result.projectRoot) !== normalize(scope.workspaceRoot) || !Number.isSafeInteger(result.pid) || result.pid <= 0 || result.transport !== "image-frames") throw new Error("编辑器返回的工程身份或传输不匹配");
      const url = new URL(result.signalingUrl);
      if (url.protocol !== "http:" || url.hostname !== "127.0.0.1" || !/^\/api\/tauri\/window-bridge\/local\/[0-9a-f]{48}$/.test(url.pathname) || url.username || url.password || url.search || url.hash) throw new Error("预览地址不是受限本机桥");
      return url.href.replace(/\/$/, "");
    }
    start(layout, size) {
      if (!Array.isArray(layout?.slots) || layout.slots.length > 16) return Promise.reject(new Error("复合布局最多支持16个槽位"));
      let captureSize;
      try { captureSize = GameCoworkCaptureSize(size); } catch (error) { return Promise.reject(error); }
      const signature = JSON.stringify({ layout, size: captureSize });
      // Parent layout delivery and ResizeObserver can describe the same view.
      // A duplicate start would replace every native capture epoch under the
      // already displayed JPEG, so retain the current readers and input lease.
      if (this.layout && this.startSignature === signature) return this.queue;
      this.startSignature = signature;
      this.layout = layout; this.size = captureSize;
      const generation = ++this.generation;
      this.queue = this.queue.catch(() => {}).then(() => this.apply(generation));
      return this.queue;
    }
    async apply(generation, onlyKey) {
      if (generation !== this.generation || !this.layout) return;
      const desired = new Map(), layout = this.layout, size = this.size;
      for (const slot of layout.slots) {
        if (!desired.has(slot.workspaceKey)) desired.set(slot.workspaceKey, []);
        desired.get(slot.workspaceKey).push(slot);
      }
      for (const [key, group] of this.groups) if (!desired.has(key)) { await this.stopGroup(group); this.groups.delete(key); clearTimeout(this.retryTimers.get(key)); this.retryTimers.delete(key); }
      for (const [key, slots] of desired) {
        if (onlyKey && key !== onlyKey) continue;
        if (generation !== this.generation) return;
        let api;
        try {
          api = await this.endpoint(slots[0]);
          if (generation !== this.generation) return;
          const response = await fetch(api + "/stream/start-composite", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...size,fps:15,compositeId:this.options.compositeId,focusedSlotId:layout.focusedSlotId,slots:slots.map(slot=>({slotId:slot.slotId,windowType:slot.windowType,captureMode:slot.captureMode,instanceId:slot.instanceId,title:slot.title,rect:slot.rect}))}),signal:AbortSignal.timeout(10000)});
          const model = await response.json();
          if (generation !== this.generation) { await this.stopGroup({api}); return; }
          if (!response.ok || model.error || !Array.isArray(model.slots)) throw new Error(model.error || "原工程预览启动失败");
          this.groups.set(key,{api,slots:model.slots.map(slot=>({...slot,serverUrl:api,workspaceKey:key,workspaceRoot:slots[0].workspaceRoot}))});
          clearTimeout(this.retryTimers.get(key)); this.retryTimers.delete(key);
        } catch (error) {
          if (generation !== this.generation) return;
          this.groups.set(key,{api,slots:slots.map(slot=>({...slot,supported:false,reason:error.message}))});
          if (!this.retryTimers.has(key)) this.retryTimers.set(key,setTimeout(()=>{
            this.retryTimers.delete(key);
            if (this.layout?.slots.some(slot=>slot.workspaceKey===key)) this.refresh({workspaceKey:key});
          },3000));
        }
      }
      if (generation !== this.generation) return;
      const slots = layout.slots.map(slot => this.groups.get(slot.workspaceKey)?.slots.find(actual=>actual.slotId===slot.slotId) || {...slot,supported:false,reason:"正在解析原工程"});
      this.composite.reconcile({...size,focusedSlotId:layout.focusedSlotId,slots});
    }
    refresh(slot) {
      if (!this.layout || !slot?.workspaceKey || this.refreshing?.has(slot.workspaceKey)) return;
      this.refreshing ||= new Set(); this.refreshing.add(slot.workspaceKey);
      const generation = this.generation;
      this.queue = this.queue.catch(() => {}).then(() => this.apply(generation,slot.workspaceKey)).finally(()=>this.refreshing.delete(slot.workspaceKey));
    }
    async stopGroup(group) {
      if (!group?.api) return;
      try { await fetch(group.api+"/stream/stop",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({compositeId:this.options.compositeId}),signal:AbortSignal.timeout(3000)}); } catch (_) {}
    }
    async stop() {
      this.generation++; this.layout = null; this.startSignature = null; this.composite.stop();
      for (const timer of this.retryTimers.values()) clearTimeout(timer); this.retryTimers.clear();
      const groups = [...this.groups.values()]; this.groups.clear();
      this.queue = this.queue.catch(()=>{}).then(()=>Promise.all(groups.map(group=>this.stopGroup(group))));
      await this.queue;
    }
    sendInput(data) { this.composite.sendInput(data); }
    snapshot() { return this.composite.snapshot(); }
  }
  global.GameCoworkImageFrames = GameCoworkImageFrames;
  global.GameCoworkCaptureSize = GameCoworkCaptureSize;
  global.GameCoworkCompositeFrames = GameCoworkCompositeFrames;
  global.GameCoworkMultiProjectFrames = GameCoworkMultiProjectFrames;
})(window);
