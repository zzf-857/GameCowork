// WebView2 runs this on document creation, including child frames. Only the
// application's desktop and GUI documents may initiate native caption actions.
(() => {
  window.vscMediaUrl = "";
  window.workspacePaths = [];
  window.GAMECOWORK_SHELL = true;
  if (!window.GAMECOWORK_FRAMELESS_WINDOW) return;
  if (location.protocol !== "http:" || location.hostname !== "127.0.0.1" ||
      !["/", "/index.html", "/gui.html"].includes(location.pathname)) return;
  try { if(window.top !== window && window.top.location.origin !== location.origin) return; } catch { return; }
  const interactive = "button,a,input,textarea,select,label,summary,[role=button],[role=tab],[role=menu],[role=menuitem],[role=dialog],[role=tooltip],[role=checkbox],[role=radio],[role=combobox],[role=slider],[role=spinbutton],[role=listbox],[data-focusable],[tabindex]:not([tabindex='-1']),[contenteditable],canvas";
  const isCaption = (event) => {
    if (event.button !== 0 || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return false;
    const style = getComputedStyle(document.documentElement);
    const height = style.getPropertyValue("--gamecowork-app-header-height").trim();
    const pixels = height.endsWith("rem") ? parseFloat(height) * parseFloat(style.fontSize) : parseFloat(height);
    return event.clientY >= 0 && event.clientY < (Number.isFinite(pixels) && pixels > 0 ? pixels : 36) &&
      typeof event.target?.closest === "function" && !event.target.closest(interactive);
  };
  const send = (route) => {
    // Caption dragging must enter the native UI thread while the mouse is down;
    // a queued HTTP round trip may arrive after a short drag already released.
    if (route === "start-dragging") {
      try {
        const ipc = window.top?.ipc || window.ipc;
        if (typeof ipc?.postMessage === "function") { ipc.postMessage("gamecowork.window.start-dragging"); return; }
      } catch {}
    }
    fetch(location.origin + "/api/tauri/" + route, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
      .catch(error => console.error("Native caption transport failed:", error.message));
  };
  window.addEventListener("mousedown", event => {
    if (isCaption(event)) { event.stopImmediatePropagation(); event.preventDefault(); if(event.detail < 2) send("start-dragging"); }
  }, true);
  window.addEventListener("dblclick", event => {
    if (isCaption(event)) { event.stopImmediatePropagation(); event.preventDefault(); send("toggle-maximize-window"); }
  }, true);
})();
