var d = Object.defineProperty;
var o = (t, e, i) => (e in t ? d(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : (t[e] = i));
var s = (t, e, i) => o(t, typeof e != "symbol" ? e + "" : e, i);
import { r as u } from "./registry-BL-NPVNy.js";
(function () {
  var t =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  t.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
})();
try {
  (function () {
    var t =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      e = new t.Error().stack;
    e &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[e] = "85d85aa6-5604-4263-ab80-0dfea33cd383"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-85d85aa6-5604-4263-ab80-0dfea33cd383"));
  })();
} catch {}
const l = { currentKey: null, playing: !1, currentTime: 0, duration: 0 };
function p(t) {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const e = Math.floor(t / 60),
    i = Math.floor(t % 60);
  return `${e}:${i.toString().padStart(2, "0")}`;
}
class c {
  constructor() {
    s(this, "audio", null);
    s(this, "snapshot", l);
    s(this, "listeners", new Set());
    s(this, "getSnapshot", () => this.snapshot);
    s(
      this,
      "subscribe",
      (e) => (
        this.listeners.add(e),
        () => {
          this.listeners.delete(e);
        }
      ),
    );
  }
  emit(e) {
    this.snapshot = { ...this.snapshot, ...e };
    for (const i of this.listeners) i();
  }
  ensureAudio() {
    if (this.audio) return this.audio;
    const e = new Audio();
    return (
      (e.preload = "metadata"),
      e.addEventListener("play", () => this.emit({ playing: !0 })),
      e.addEventListener("pause", () => this.emit({ playing: !1 })),
      e.addEventListener("loadedmetadata", () =>
        this.emit({ currentTime: e.currentTime, duration: Number.isFinite(e.duration) ? e.duration : 0 }),
      ),
      e.addEventListener("timeupdate", () => this.emit({ currentTime: e.currentTime })),
      e.addEventListener("ended", () => {
        (this.emit({ currentKey: null, playing: !1, currentTime: 0 }), (e.currentTime = 0));
      }),
      e.addEventListener("error", () => {
        this.emit({ currentKey: null, playing: !1 });
      }),
      (this.audio = e),
      e
    );
  }
  toggle(e, i) {
    const n = this.ensureAudio();
    if (this.snapshot.currentKey === e) {
      n.paused ? n.play().catch(() => this.emit({ playing: !1 })) : n.pause();
      return;
    }
    (n.pause(),
      (n.src = i),
      this.emit({ currentKey: e, playing: !1, currentTime: 0, duration: 0 }),
      n.play().catch(() => this.emit({ playing: !1 })));
  }
  seek(e) {
    if (!this.audio || !this.snapshot.currentKey) return;
    const i = this.snapshot.duration;
    if (!Number.isFinite(i) || i <= 0) return;
    const r = Math.min(Math.max(e, 0), 1) * i;
    ((this.audio.currentTime = r), this.emit({ currentTime: r }));
  }
  resetForTest() {
    if (this.audio)
      try {
        (this.audio.pause(), this.audio.removeAttribute("src"));
      } catch {}
    ((this.audio = null), this.emit({ currentKey: null, playing: !1, currentTime: 0, duration: 0 }));
  }
}
const a = new c();
function m(t) {
  const e = u.useSyncExternalStore(a.subscribe, a.getSnapshot);
  return {
    isActive: t !== void 0 && e.currentKey === t,
    playing: e.playing,
    currentTime: e.currentTime,
    duration: e.duration,
  };
}
export { a as c, p as f, m as u };
