/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */ (function () {
  var i =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  i.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
})();
try {
  (function () {
    var i =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      e = new i.Error().stack;
    e &&
      ((i._sentryDebugIds = i._sentryDebugIds || {}),
      (i._sentryDebugIds[e] = "186c195d-aa1f-4311-8a23-f784d6f96ead"),
      (i._sentryDebugIdIdentifier = "sentry-dbid-186c195d-aa1f-4311-8a23-f784d6f96ead"));
  })();
} catch {}
const Xa = "184",
  M_ = { ROTATE: 0, DOLLY: 1, PAN: 2 },
  S_ = { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 },
  Xc = 0,
  Eo = 1,
  qc = 2,
  zs = 1,
  Yc = 2,
  Hi = 3,
  kn = 0,
  It = 1,
  Mn = 2,
  yn = 0,
  Si = 1,
  To = 2,
  Ao = 3,
  wo = 4,
  Zc = 5,
  Kn = 100,
  Kc = 101,
  jc = 102,
  $c = 103,
  Jc = 104,
  Qc = 200,
  eh = 201,
  th = 202,
  nh = 203,
  jr = 204,
  $r = 205,
  ih = 206,
  sh = 207,
  rh = 208,
  ah = 209,
  oh = 210,
  lh = 211,
  ch = 212,
  hh = 213,
  uh = 214,
  Jr = 0,
  Qr = 1,
  ea = 2,
  bi = 3,
  ta = 4,
  na = 5,
  ia = 6,
  sa = 7,
  ir = 0,
  dh = 1,
  fh = 2,
  on = 0,
  Wl = 1,
  Xl = 2,
  ql = 3,
  Yl = 4,
  Zl = 5,
  Kl = 6,
  jl = 7,
  Ro = "attached",
  ph = "detached",
  $l = 300,
  Jn = 301,
  Ei = 302,
  fr = 303,
  pr = 304,
  sr = 306,
  ra = 1e3,
  $t = 1001,
  aa = 1002,
  Et = 1003,
  mh = 1004,
  os = 1005,
  vt = 1006,
  mr = 1007,
  zn = 1008,
  Bt = 1009,
  Jl = 1010,
  Ql = 1011,
  Zi = 1012,
  qa = 1013,
  hn = 1014,
  Gt = 1015,
  En = 1016,
  Ya = 1017,
  Za = 1018,
  Ki = 1020,
  ec = 35902,
  tc = 35899,
  nc = 1021,
  ic = 1022,
  Ht = 1023,
  Tn = 1026,
  $n = 1027,
  Ka = 1028,
  ja = 1029,
  Qn = 1030,
  $a = 1031,
  Ja = 1033,
  Vs = 33776,
  ks = 33777,
  Gs = 33778,
  Hs = 33779,
  oa = 35840,
  la = 35841,
  ca = 35842,
  ha = 35843,
  ua = 36196,
  da = 37492,
  fa = 37496,
  pa = 37488,
  ma = 37489,
  Xs = 37490,
  ga = 37491,
  _a = 37808,
  xa = 37809,
  va = 37810,
  Ma = 37811,
  Sa = 37812,
  ya = 37813,
  ba = 37814,
  Ea = 37815,
  Ta = 37816,
  Aa = 37817,
  wa = 37818,
  Ra = 37819,
  Ca = 37820,
  Pa = 37821,
  Ia = 36492,
  La = 36494,
  Da = 36495,
  Ua = 36283,
  Na = 36284,
  qs = 36285,
  Fa = 36286,
  gh = 2200,
  _h = 2201,
  xh = 2202,
  Ys = 2300,
  Oa = 2301,
  gr = 2302,
  Co = 2303,
  vi = 2400,
  Mi = 2401,
  Zs = 2402,
  Qa = 2500,
  vh = 2501,
  y_ = 0,
  b_ = 1,
  E_ = 2,
  Mh = 3200,
  ji = 0,
  Sh = 1,
  Bn = "",
  kt = "srgb",
  Ks = "srgb-linear",
  js = "linear",
  Ze = "srgb",
  ii = 7680,
  Po = 519,
  yh = 512,
  bh = 513,
  Eh = 514,
  eo = 515,
  Th = 516,
  Ah = 517,
  to = 518,
  wh = 519,
  Ba = 35044,
  Io = "300 es",
  an = 2e3,
  $i = 2001;
function Rh(i) {
  for (let e = i.length - 1; e >= 0; --e) if (i[e] >= 65535) return !0;
  return !1;
}
function Ch(i) {
  return ArrayBuffer.isView(i) && !(i instanceof DataView);
}
function Ji(i) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", i);
}
function Ph() {
  const i = Ji("canvas");
  return ((i.style.display = "block"), i);
}
const Lo = {};
function $s(...i) {
  const e = "THREE." + i.shift();
  console.log(e, ...i);
}
function sc(i) {
  const e = i[0];
  if (typeof e == "string" && e.startsWith("TSL:")) {
    const t = i[1];
    t && t.isStackTrace
      ? (i[0] += " " + t.getLocation())
      : (i[1] = 'Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.');
  }
  return i;
}
function xe(...i) {
  i = sc(i);
  const e = "THREE." + i.shift();
  {
    const t = i[0];
    t && t.isStackTrace ? console.warn(t.getError(e)) : console.warn(e, ...i);
  }
}
function Te(...i) {
  i = sc(i);
  const e = "THREE." + i.shift();
  {
    const t = i[0];
    t && t.isStackTrace ? console.error(t.getError(e)) : console.error(e, ...i);
  }
}
function za(...i) {
  const e = i.join(" ");
  e in Lo || ((Lo[e] = !0), xe(...i));
}
function Ih(i, e, t) {
  return new Promise(function (n, s) {
    function r() {
      switch (i.clientWaitSync(e, i.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case i.WAIT_FAILED:
          s();
          break;
        case i.TIMEOUT_EXPIRED:
          setTimeout(r, t);
          break;
        default:
          n();
      }
    }
    setTimeout(r, t);
  });
}
const Lh = { [Jr]: Qr, [ea]: ia, [ta]: sa, [bi]: na, [Qr]: Jr, [ia]: ea, [sa]: ta, [na]: bi };
class An {
  addEventListener(e, t) {
    this._listeners === void 0 && (this._listeners = {});
    const n = this._listeners;
    (n[e] === void 0 && (n[e] = []), n[e].indexOf(t) === -1 && n[e].push(t));
  }
  hasEventListener(e, t) {
    const n = this._listeners;
    return n === void 0 ? !1 : n[e] !== void 0 && n[e].indexOf(t) !== -1;
  }
  removeEventListener(e, t) {
    const n = this._listeners;
    if (n === void 0) return;
    const s = n[e];
    if (s !== void 0) {
      const r = s.indexOf(t);
      r !== -1 && s.splice(r, 1);
    }
  }
  dispatchEvent(e) {
    const t = this._listeners;
    if (t === void 0) return;
    const n = t[e.type];
    if (n !== void 0) {
      e.target = this;
      const s = n.slice(0);
      for (let r = 0, a = s.length; r < a; r++) s[r].call(this, e);
      e.target = null;
    }
  }
}
const At = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "0a",
  "0b",
  "0c",
  "0d",
  "0e",
  "0f",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "1a",
  "1b",
  "1c",
  "1d",
  "1e",
  "1f",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "2a",
  "2b",
  "2c",
  "2d",
  "2e",
  "2f",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "3a",
  "3b",
  "3c",
  "3d",
  "3e",
  "3f",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "4a",
  "4b",
  "4c",
  "4d",
  "4e",
  "4f",
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
  "5a",
  "5b",
  "5c",
  "5d",
  "5e",
  "5f",
  "60",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "67",
  "68",
  "69",
  "6a",
  "6b",
  "6c",
  "6d",
  "6e",
  "6f",
  "70",
  "71",
  "72",
  "73",
  "74",
  "75",
  "76",
  "77",
  "78",
  "79",
  "7a",
  "7b",
  "7c",
  "7d",
  "7e",
  "7f",
  "80",
  "81",
  "82",
  "83",
  "84",
  "85",
  "86",
  "87",
  "88",
  "89",
  "8a",
  "8b",
  "8c",
  "8d",
  "8e",
  "8f",
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
  "9a",
  "9b",
  "9c",
  "9d",
  "9e",
  "9f",
  "a0",
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
  "a8",
  "a9",
  "aa",
  "ab",
  "ac",
  "ad",
  "ae",
  "af",
  "b0",
  "b1",
  "b2",
  "b3",
  "b4",
  "b5",
  "b6",
  "b7",
  "b8",
  "b9",
  "ba",
  "bb",
  "bc",
  "bd",
  "be",
  "bf",
  "c0",
  "c1",
  "c2",
  "c3",
  "c4",
  "c5",
  "c6",
  "c7",
  "c8",
  "c9",
  "ca",
  "cb",
  "cc",
  "cd",
  "ce",
  "cf",
  "d0",
  "d1",
  "d2",
  "d3",
  "d4",
  "d5",
  "d6",
  "d7",
  "d8",
  "d9",
  "da",
  "db",
  "dc",
  "dd",
  "de",
  "df",
  "e0",
  "e1",
  "e2",
  "e3",
  "e4",
  "e5",
  "e6",
  "e7",
  "e8",
  "e9",
  "ea",
  "eb",
  "ec",
  "ed",
  "ee",
  "ef",
  "f0",
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "f7",
  "f8",
  "f9",
  "fa",
  "fb",
  "fc",
  "fd",
  "fe",
  "ff",
];
let Do = 1234567;
const qi = Math.PI / 180,
  Ti = 180 / Math.PI;
function Jt() {
  const i = (Math.random() * 4294967295) | 0,
    e = (Math.random() * 4294967295) | 0,
    t = (Math.random() * 4294967295) | 0,
    n = (Math.random() * 4294967295) | 0;
  return (
    At[i & 255] +
    At[(i >> 8) & 255] +
    At[(i >> 16) & 255] +
    At[(i >> 24) & 255] +
    "-" +
    At[e & 255] +
    At[(e >> 8) & 255] +
    "-" +
    At[((e >> 16) & 15) | 64] +
    At[(e >> 24) & 255] +
    "-" +
    At[(t & 63) | 128] +
    At[(t >> 8) & 255] +
    "-" +
    At[(t >> 16) & 255] +
    At[(t >> 24) & 255] +
    At[n & 255] +
    At[(n >> 8) & 255] +
    At[(n >> 16) & 255] +
    At[(n >> 24) & 255]
  ).toLowerCase();
}
function Fe(i, e, t) {
  return Math.max(e, Math.min(t, i));
}
function no(i, e) {
  return ((i % e) + e) % e;
}
function Dh(i, e, t, n, s) {
  return n + ((i - e) * (s - n)) / (t - e);
}
function Uh(i, e, t) {
  return i !== e ? (t - i) / (e - i) : 0;
}
function Yi(i, e, t) {
  return (1 - t) * i + t * e;
}
function Nh(i, e, t, n) {
  return Yi(i, e, 1 - Math.exp(-t * n));
}
function Fh(i, e = 1) {
  return e - Math.abs(no(i, e * 2) - e);
}
function Oh(i, e, t) {
  return i <= e ? 0 : i >= t ? 1 : ((i = (i - e) / (t - e)), i * i * (3 - 2 * i));
}
function Bh(i, e, t) {
  return i <= e ? 0 : i >= t ? 1 : ((i = (i - e) / (t - e)), i * i * i * (i * (i * 6 - 15) + 10));
}
function zh(i, e) {
  return i + Math.floor(Math.random() * (e - i + 1));
}
function Vh(i, e) {
  return i + Math.random() * (e - i);
}
function kh(i) {
  return i * (0.5 - Math.random());
}
function Gh(i) {
  i !== void 0 && (Do = i);
  let e = (Do += 1831565813);
  return (
    (e = Math.imul(e ^ (e >>> 15), e | 1)),
    (e ^= e + Math.imul(e ^ (e >>> 7), e | 61)),
    ((e ^ (e >>> 14)) >>> 0) / 4294967296
  );
}
function Hh(i) {
  return i * qi;
}
function Wh(i) {
  return i * Ti;
}
function Xh(i) {
  return (i & (i - 1)) === 0 && i !== 0;
}
function qh(i) {
  return Math.pow(2, Math.ceil(Math.log(i) / Math.LN2));
}
function Yh(i) {
  return Math.pow(2, Math.floor(Math.log(i) / Math.LN2));
}
function Zh(i, e, t, n, s) {
  const r = Math.cos,
    a = Math.sin,
    o = r(t / 2),
    c = a(t / 2),
    l = r((e + n) / 2),
    u = a((e + n) / 2),
    d = r((e - n) / 2),
    h = a((e - n) / 2),
    f = r((n - e) / 2),
    g = a((n - e) / 2);
  switch (s) {
    case "XYX":
      i.set(o * u, c * d, c * h, o * l);
      break;
    case "YZY":
      i.set(c * h, o * u, c * d, o * l);
      break;
    case "ZXZ":
      i.set(c * d, c * h, o * u, o * l);
      break;
    case "XZX":
      i.set(o * u, c * g, c * f, o * l);
      break;
    case "YXY":
      i.set(c * f, o * u, c * g, o * l);
      break;
    case "ZYZ":
      i.set(c * g, c * f, o * u, o * l);
      break;
    default:
      xe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + s);
  }
}
function Kt(i, e) {
  switch (e.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return i / 4294967295;
    case Uint16Array:
      return i / 65535;
    case Uint8Array:
      return i / 255;
    case Int32Array:
      return Math.max(i / 2147483647, -1);
    case Int16Array:
      return Math.max(i / 32767, -1);
    case Int8Array:
      return Math.max(i / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function Ke(i, e) {
  switch (e.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return Math.round(i * 4294967295);
    case Uint16Array:
      return Math.round(i * 65535);
    case Uint8Array:
      return Math.round(i * 255);
    case Int32Array:
      return Math.round(i * 2147483647);
    case Int16Array:
      return Math.round(i * 32767);
    case Int8Array:
      return Math.round(i * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
const T_ = {
    DEG2RAD: qi,
    RAD2DEG: Ti,
    generateUUID: Jt,
    clamp: Fe,
    euclideanModulo: no,
    mapLinear: Dh,
    inverseLerp: Uh,
    lerp: Yi,
    damp: Nh,
    pingpong: Fh,
    smoothstep: Oh,
    smootherstep: Bh,
    randInt: zh,
    randFloat: Vh,
    randFloatSpread: kh,
    seededRandom: Gh,
    degToRad: Hh,
    radToDeg: Wh,
    isPowerOfTwo: Xh,
    ceilPowerOfTwo: qh,
    floorPowerOfTwo: Yh,
    setQuaternionFromProperEuler: Zh,
    normalize: Ke,
    denormalize: Kt,
  },
  ho = class ho {
    constructor(e = 0, t = 0) {
      ((this.x = e), (this.y = t));
    }
    get width() {
      return this.x;
    }
    set width(e) {
      this.x = e;
    }
    get height() {
      return this.y;
    }
    set height(e) {
      this.y = e;
    }
    set(e, t) {
      return ((this.x = e), (this.y = t), this);
    }
    setScalar(e) {
      return ((this.x = e), (this.y = e), this);
    }
    setX(e) {
      return ((this.x = e), this);
    }
    setY(e) {
      return ((this.y = e), this);
    }
    setComponent(e, t) {
      switch (e) {
        case 0:
          this.x = t;
          break;
        case 1:
          this.y = t;
          break;
        default:
          throw new Error("index is out of range: " + e);
      }
      return this;
    }
    getComponent(e) {
      switch (e) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        default:
          throw new Error("index is out of range: " + e);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y);
    }
    copy(e) {
      return ((this.x = e.x), (this.y = e.y), this);
    }
    add(e) {
      return ((this.x += e.x), (this.y += e.y), this);
    }
    addScalar(e) {
      return ((this.x += e), (this.y += e), this);
    }
    addVectors(e, t) {
      return ((this.x = e.x + t.x), (this.y = e.y + t.y), this);
    }
    addScaledVector(e, t) {
      return ((this.x += e.x * t), (this.y += e.y * t), this);
    }
    sub(e) {
      return ((this.x -= e.x), (this.y -= e.y), this);
    }
    subScalar(e) {
      return ((this.x -= e), (this.y -= e), this);
    }
    subVectors(e, t) {
      return ((this.x = e.x - t.x), (this.y = e.y - t.y), this);
    }
    multiply(e) {
      return ((this.x *= e.x), (this.y *= e.y), this);
    }
    multiplyScalar(e) {
      return ((this.x *= e), (this.y *= e), this);
    }
    divide(e) {
      return ((this.x /= e.x), (this.y /= e.y), this);
    }
    divideScalar(e) {
      return this.multiplyScalar(1 / e);
    }
    applyMatrix3(e) {
      const t = this.x,
        n = this.y,
        s = e.elements;
      return ((this.x = s[0] * t + s[3] * n + s[6]), (this.y = s[1] * t + s[4] * n + s[7]), this);
    }
    min(e) {
      return ((this.x = Math.min(this.x, e.x)), (this.y = Math.min(this.y, e.y)), this);
    }
    max(e) {
      return ((this.x = Math.max(this.x, e.x)), (this.y = Math.max(this.y, e.y)), this);
    }
    clamp(e, t) {
      return ((this.x = Fe(this.x, e.x, t.x)), (this.y = Fe(this.y, e.y, t.y)), this);
    }
    clampScalar(e, t) {
      return ((this.x = Fe(this.x, e, t)), (this.y = Fe(this.y, e, t)), this);
    }
    clampLength(e, t) {
      const n = this.length();
      return this.divideScalar(n || 1).multiplyScalar(Fe(n, e, t));
    }
    floor() {
      return ((this.x = Math.floor(this.x)), (this.y = Math.floor(this.y)), this);
    }
    ceil() {
      return ((this.x = Math.ceil(this.x)), (this.y = Math.ceil(this.y)), this);
    }
    round() {
      return ((this.x = Math.round(this.x)), (this.y = Math.round(this.y)), this);
    }
    roundToZero() {
      return ((this.x = Math.trunc(this.x)), (this.y = Math.trunc(this.y)), this);
    }
    negate() {
      return ((this.x = -this.x), (this.y = -this.y), this);
    }
    dot(e) {
      return this.x * e.x + this.y * e.y;
    }
    cross(e) {
      return this.x * e.y - this.y * e.x;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    angle() {
      return Math.atan2(-this.y, -this.x) + Math.PI;
    }
    angleTo(e) {
      const t = Math.sqrt(this.lengthSq() * e.lengthSq());
      if (t === 0) return Math.PI / 2;
      const n = this.dot(e) / t;
      return Math.acos(Fe(n, -1, 1));
    }
    distanceTo(e) {
      return Math.sqrt(this.distanceToSquared(e));
    }
    distanceToSquared(e) {
      const t = this.x - e.x,
        n = this.y - e.y;
      return t * t + n * n;
    }
    manhattanDistanceTo(e) {
      return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
    }
    setLength(e) {
      return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
      return ((this.x += (e.x - this.x) * t), (this.y += (e.y - this.y) * t), this);
    }
    lerpVectors(e, t, n) {
      return ((this.x = e.x + (t.x - e.x) * n), (this.y = e.y + (t.y - e.y) * n), this);
    }
    equals(e) {
      return e.x === this.x && e.y === this.y;
    }
    fromArray(e, t = 0) {
      return ((this.x = e[t]), (this.y = e[t + 1]), this);
    }
    toArray(e = [], t = 0) {
      return ((e[t] = this.x), (e[t + 1] = this.y), e);
    }
    fromBufferAttribute(e, t) {
      return ((this.x = e.getX(t)), (this.y = e.getY(t)), this);
    }
    rotateAround(e, t) {
      const n = Math.cos(t),
        s = Math.sin(t),
        r = this.x - e.x,
        a = this.y - e.y;
      return ((this.x = r * n - a * s + e.x), (this.y = r * s + a * n + e.y), this);
    }
    random() {
      return ((this.x = Math.random()), (this.y = Math.random()), this);
    }
    *[Symbol.iterator]() {
      (yield this.x, yield this.y);
    }
  };
ho.prototype.isVector2 = !0;
let Ge = ho;
class ln {
  constructor(e = 0, t = 0, n = 0, s = 1) {
    ((this.isQuaternion = !0), (this._x = e), (this._y = t), (this._z = n), (this._w = s));
  }
  static slerpFlat(e, t, n, s, r, a, o) {
    let c = n[s + 0],
      l = n[s + 1],
      u = n[s + 2],
      d = n[s + 3],
      h = r[a + 0],
      f = r[a + 1],
      g = r[a + 2],
      M = r[a + 3];
    if (d !== M || c !== h || l !== f || u !== g) {
      let m = c * h + l * f + u * g + d * M;
      m < 0 && ((h = -h), (f = -f), (g = -g), (M = -M), (m = -m));
      let p = 1 - o;
      if (m < 0.9995) {
        const S = Math.acos(m),
          E = Math.sin(S);
        ((p = Math.sin(p * S) / E),
          (o = Math.sin(o * S) / E),
          (c = c * p + h * o),
          (l = l * p + f * o),
          (u = u * p + g * o),
          (d = d * p + M * o));
      } else {
        ((c = c * p + h * o), (l = l * p + f * o), (u = u * p + g * o), (d = d * p + M * o));
        const S = 1 / Math.sqrt(c * c + l * l + u * u + d * d);
        ((c *= S), (l *= S), (u *= S), (d *= S));
      }
    }
    ((e[t] = c), (e[t + 1] = l), (e[t + 2] = u), (e[t + 3] = d));
  }
  static multiplyQuaternionsFlat(e, t, n, s, r, a) {
    const o = n[s],
      c = n[s + 1],
      l = n[s + 2],
      u = n[s + 3],
      d = r[a],
      h = r[a + 1],
      f = r[a + 2],
      g = r[a + 3];
    return (
      (e[t] = o * g + u * d + c * f - l * h),
      (e[t + 1] = c * g + u * h + l * d - o * f),
      (e[t + 2] = l * g + u * f + o * h - c * d),
      (e[t + 3] = u * g - o * d - c * h - l * f),
      e
    );
  }
  get x() {
    return this._x;
  }
  set x(e) {
    ((this._x = e), this._onChangeCallback());
  }
  get y() {
    return this._y;
  }
  set y(e) {
    ((this._y = e), this._onChangeCallback());
  }
  get z() {
    return this._z;
  }
  set z(e) {
    ((this._z = e), this._onChangeCallback());
  }
  get w() {
    return this._w;
  }
  set w(e) {
    ((this._w = e), this._onChangeCallback());
  }
  set(e, t, n, s) {
    return ((this._x = e), (this._y = t), (this._z = n), (this._w = s), this._onChangeCallback(), this);
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(e) {
    return ((this._x = e.x), (this._y = e.y), (this._z = e.z), (this._w = e.w), this._onChangeCallback(), this);
  }
  setFromEuler(e, t = !0) {
    const n = e._x,
      s = e._y,
      r = e._z,
      a = e._order,
      o = Math.cos,
      c = Math.sin,
      l = o(n / 2),
      u = o(s / 2),
      d = o(r / 2),
      h = c(n / 2),
      f = c(s / 2),
      g = c(r / 2);
    switch (a) {
      case "XYZ":
        ((this._x = h * u * d + l * f * g),
          (this._y = l * f * d - h * u * g),
          (this._z = l * u * g + h * f * d),
          (this._w = l * u * d - h * f * g));
        break;
      case "YXZ":
        ((this._x = h * u * d + l * f * g),
          (this._y = l * f * d - h * u * g),
          (this._z = l * u * g - h * f * d),
          (this._w = l * u * d + h * f * g));
        break;
      case "ZXY":
        ((this._x = h * u * d - l * f * g),
          (this._y = l * f * d + h * u * g),
          (this._z = l * u * g + h * f * d),
          (this._w = l * u * d - h * f * g));
        break;
      case "ZYX":
        ((this._x = h * u * d - l * f * g),
          (this._y = l * f * d + h * u * g),
          (this._z = l * u * g - h * f * d),
          (this._w = l * u * d + h * f * g));
        break;
      case "YZX":
        ((this._x = h * u * d + l * f * g),
          (this._y = l * f * d + h * u * g),
          (this._z = l * u * g - h * f * d),
          (this._w = l * u * d - h * f * g));
        break;
      case "XZY":
        ((this._x = h * u * d - l * f * g),
          (this._y = l * f * d - h * u * g),
          (this._z = l * u * g + h * f * d),
          (this._w = l * u * d + h * f * g));
        break;
      default:
        xe("Quaternion: .setFromEuler() encountered an unknown order: " + a);
    }
    return (t === !0 && this._onChangeCallback(), this);
  }
  setFromAxisAngle(e, t) {
    const n = t / 2,
      s = Math.sin(n);
    return (
      (this._x = e.x * s),
      (this._y = e.y * s),
      (this._z = e.z * s),
      (this._w = Math.cos(n)),
      this._onChangeCallback(),
      this
    );
  }
  setFromRotationMatrix(e) {
    const t = e.elements,
      n = t[0],
      s = t[4],
      r = t[8],
      a = t[1],
      o = t[5],
      c = t[9],
      l = t[2],
      u = t[6],
      d = t[10],
      h = n + o + d;
    if (h > 0) {
      const f = 0.5 / Math.sqrt(h + 1);
      ((this._w = 0.25 / f), (this._x = (u - c) * f), (this._y = (r - l) * f), (this._z = (a - s) * f));
    } else if (n > o && n > d) {
      const f = 2 * Math.sqrt(1 + n - o - d);
      ((this._w = (u - c) / f), (this._x = 0.25 * f), (this._y = (s + a) / f), (this._z = (r + l) / f));
    } else if (o > d) {
      const f = 2 * Math.sqrt(1 + o - n - d);
      ((this._w = (r - l) / f), (this._x = (s + a) / f), (this._y = 0.25 * f), (this._z = (c + u) / f));
    } else {
      const f = 2 * Math.sqrt(1 + d - n - o);
      ((this._w = (a - s) / f), (this._x = (r + l) / f), (this._y = (c + u) / f), (this._z = 0.25 * f));
    }
    return (this._onChangeCallback(), this);
  }
  setFromUnitVectors(e, t) {
    let n = e.dot(t) + 1;
    return (
      n < 1e-8
        ? ((n = 0),
          Math.abs(e.x) > Math.abs(e.z)
            ? ((this._x = -e.y), (this._y = e.x), (this._z = 0), (this._w = n))
            : ((this._x = 0), (this._y = -e.z), (this._z = e.y), (this._w = n)))
        : ((this._x = e.y * t.z - e.z * t.y),
          (this._y = e.z * t.x - e.x * t.z),
          (this._z = e.x * t.y - e.y * t.x),
          (this._w = n)),
      this.normalize()
    );
  }
  angleTo(e) {
    return 2 * Math.acos(Math.abs(Fe(this.dot(e), -1, 1)));
  }
  rotateTowards(e, t) {
    const n = this.angleTo(e);
    if (n === 0) return this;
    const s = Math.min(1, t / n);
    return (this.slerp(e, s), this);
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    return ((this._x *= -1), (this._y *= -1), (this._z *= -1), this._onChangeCallback(), this);
  }
  dot(e) {
    return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
  }
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  normalize() {
    let e = this.length();
    return (
      e === 0
        ? ((this._x = 0), (this._y = 0), (this._z = 0), (this._w = 1))
        : ((e = 1 / e),
          (this._x = this._x * e),
          (this._y = this._y * e),
          (this._z = this._z * e),
          (this._w = this._w * e)),
      this._onChangeCallback(),
      this
    );
  }
  multiply(e) {
    return this.multiplyQuaternions(this, e);
  }
  premultiply(e) {
    return this.multiplyQuaternions(e, this);
  }
  multiplyQuaternions(e, t) {
    const n = e._x,
      s = e._y,
      r = e._z,
      a = e._w,
      o = t._x,
      c = t._y,
      l = t._z,
      u = t._w;
    return (
      (this._x = n * u + a * o + s * l - r * c),
      (this._y = s * u + a * c + r * o - n * l),
      (this._z = r * u + a * l + n * c - s * o),
      (this._w = a * u - n * o - s * c - r * l),
      this._onChangeCallback(),
      this
    );
  }
  slerp(e, t) {
    let n = e._x,
      s = e._y,
      r = e._z,
      a = e._w,
      o = this.dot(e);
    o < 0 && ((n = -n), (s = -s), (r = -r), (a = -a), (o = -o));
    let c = 1 - t;
    if (o < 0.9995) {
      const l = Math.acos(o),
        u = Math.sin(l);
      ((c = Math.sin(c * l) / u),
        (t = Math.sin(t * l) / u),
        (this._x = this._x * c + n * t),
        (this._y = this._y * c + s * t),
        (this._z = this._z * c + r * t),
        (this._w = this._w * c + a * t),
        this._onChangeCallback());
    } else
      ((this._x = this._x * c + n * t),
        (this._y = this._y * c + s * t),
        (this._z = this._z * c + r * t),
        (this._w = this._w * c + a * t),
        this.normalize());
    return this;
  }
  slerpQuaternions(e, t, n) {
    return this.copy(e).slerp(t, n);
  }
  random() {
    const e = 2 * Math.PI * Math.random(),
      t = 2 * Math.PI * Math.random(),
      n = Math.random(),
      s = Math.sqrt(1 - n),
      r = Math.sqrt(n);
    return this.set(s * Math.sin(e), s * Math.cos(e), r * Math.sin(t), r * Math.cos(t));
  }
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
  }
  fromArray(e, t = 0) {
    return (
      (this._x = e[t]),
      (this._y = e[t + 1]),
      (this._z = e[t + 2]),
      (this._w = e[t + 3]),
      this._onChangeCallback(),
      this
    );
  }
  toArray(e = [], t = 0) {
    return ((e[t] = this._x), (e[t + 1] = this._y), (e[t + 2] = this._z), (e[t + 3] = this._w), e);
  }
  fromBufferAttribute(e, t) {
    return (
      (this._x = e.getX(t)),
      (this._y = e.getY(t)),
      (this._z = e.getZ(t)),
      (this._w = e.getW(t)),
      this._onChangeCallback(),
      this
    );
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(e) {
    return ((this._onChangeCallback = e), this);
  }
  _onChangeCallback() {}
  *[Symbol.iterator]() {
    (yield this._x, yield this._y, yield this._z, yield this._w);
  }
}
const uo = class uo {
  constructor(e = 0, t = 0, n = 0) {
    ((this.x = e), (this.y = t), (this.z = n));
  }
  set(e, t, n) {
    return (n === void 0 && (n = this.z), (this.x = e), (this.y = t), (this.z = n), this);
  }
  setScalar(e) {
    return ((this.x = e), (this.y = e), (this.z = e), this);
  }
  setX(e) {
    return ((this.x = e), this);
  }
  setY(e) {
    return ((this.y = e), this);
  }
  setZ(e) {
    return ((this.z = e), this);
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(e) {
    return ((this.x = e.x), (this.y = e.y), (this.z = e.z), this);
  }
  add(e) {
    return ((this.x += e.x), (this.y += e.y), (this.z += e.z), this);
  }
  addScalar(e) {
    return ((this.x += e), (this.y += e), (this.z += e), this);
  }
  addVectors(e, t) {
    return ((this.x = e.x + t.x), (this.y = e.y + t.y), (this.z = e.z + t.z), this);
  }
  addScaledVector(e, t) {
    return ((this.x += e.x * t), (this.y += e.y * t), (this.z += e.z * t), this);
  }
  sub(e) {
    return ((this.x -= e.x), (this.y -= e.y), (this.z -= e.z), this);
  }
  subScalar(e) {
    return ((this.x -= e), (this.y -= e), (this.z -= e), this);
  }
  subVectors(e, t) {
    return ((this.x = e.x - t.x), (this.y = e.y - t.y), (this.z = e.z - t.z), this);
  }
  multiply(e) {
    return ((this.x *= e.x), (this.y *= e.y), (this.z *= e.z), this);
  }
  multiplyScalar(e) {
    return ((this.x *= e), (this.y *= e), (this.z *= e), this);
  }
  multiplyVectors(e, t) {
    return ((this.x = e.x * t.x), (this.y = e.y * t.y), (this.z = e.z * t.z), this);
  }
  applyEuler(e) {
    return this.applyQuaternion(Uo.setFromEuler(e));
  }
  applyAxisAngle(e, t) {
    return this.applyQuaternion(Uo.setFromAxisAngle(e, t));
  }
  applyMatrix3(e) {
    const t = this.x,
      n = this.y,
      s = this.z,
      r = e.elements;
    return (
      (this.x = r[0] * t + r[3] * n + r[6] * s),
      (this.y = r[1] * t + r[4] * n + r[7] * s),
      (this.z = r[2] * t + r[5] * n + r[8] * s),
      this
    );
  }
  applyNormalMatrix(e) {
    return this.applyMatrix3(e).normalize();
  }
  applyMatrix4(e) {
    const t = this.x,
      n = this.y,
      s = this.z,
      r = e.elements,
      a = 1 / (r[3] * t + r[7] * n + r[11] * s + r[15]);
    return (
      (this.x = (r[0] * t + r[4] * n + r[8] * s + r[12]) * a),
      (this.y = (r[1] * t + r[5] * n + r[9] * s + r[13]) * a),
      (this.z = (r[2] * t + r[6] * n + r[10] * s + r[14]) * a),
      this
    );
  }
  applyQuaternion(e) {
    const t = this.x,
      n = this.y,
      s = this.z,
      r = e.x,
      a = e.y,
      o = e.z,
      c = e.w,
      l = 2 * (a * s - o * n),
      u = 2 * (o * t - r * s),
      d = 2 * (r * n - a * t);
    return (
      (this.x = t + c * l + a * d - o * u),
      (this.y = n + c * u + o * l - r * d),
      (this.z = s + c * d + r * u - a * l),
      this
    );
  }
  project(e) {
    return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
  }
  unproject(e) {
    return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
  }
  transformDirection(e) {
    const t = this.x,
      n = this.y,
      s = this.z,
      r = e.elements;
    return (
      (this.x = r[0] * t + r[4] * n + r[8] * s),
      (this.y = r[1] * t + r[5] * n + r[9] * s),
      (this.z = r[2] * t + r[6] * n + r[10] * s),
      this.normalize()
    );
  }
  divide(e) {
    return ((this.x /= e.x), (this.y /= e.y), (this.z /= e.z), this);
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  min(e) {
    return ((this.x = Math.min(this.x, e.x)), (this.y = Math.min(this.y, e.y)), (this.z = Math.min(this.z, e.z)), this);
  }
  max(e) {
    return ((this.x = Math.max(this.x, e.x)), (this.y = Math.max(this.y, e.y)), (this.z = Math.max(this.z, e.z)), this);
  }
  clamp(e, t) {
    return ((this.x = Fe(this.x, e.x, t.x)), (this.y = Fe(this.y, e.y, t.y)), (this.z = Fe(this.z, e.z, t.z)), this);
  }
  clampScalar(e, t) {
    return ((this.x = Fe(this.x, e, t)), (this.y = Fe(this.y, e, t)), (this.z = Fe(this.z, e, t)), this);
  }
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Fe(n, e, t));
  }
  floor() {
    return ((this.x = Math.floor(this.x)), (this.y = Math.floor(this.y)), (this.z = Math.floor(this.z)), this);
  }
  ceil() {
    return ((this.x = Math.ceil(this.x)), (this.y = Math.ceil(this.y)), (this.z = Math.ceil(this.z)), this);
  }
  round() {
    return ((this.x = Math.round(this.x)), (this.y = Math.round(this.y)), (this.z = Math.round(this.z)), this);
  }
  roundToZero() {
    return ((this.x = Math.trunc(this.x)), (this.y = Math.trunc(this.y)), (this.z = Math.trunc(this.z)), this);
  }
  negate() {
    return ((this.x = -this.x), (this.y = -this.y), (this.z = -this.z), this);
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return ((this.x += (e.x - this.x) * t), (this.y += (e.y - this.y) * t), (this.z += (e.z - this.z) * t), this);
  }
  lerpVectors(e, t, n) {
    return ((this.x = e.x + (t.x - e.x) * n), (this.y = e.y + (t.y - e.y) * n), (this.z = e.z + (t.z - e.z) * n), this);
  }
  cross(e) {
    return this.crossVectors(this, e);
  }
  crossVectors(e, t) {
    const n = e.x,
      s = e.y,
      r = e.z,
      a = t.x,
      o = t.y,
      c = t.z;
    return ((this.x = s * c - r * o), (this.y = r * a - n * c), (this.z = n * o - s * a), this);
  }
  projectOnVector(e) {
    const t = e.lengthSq();
    if (t === 0) return this.set(0, 0, 0);
    const n = e.dot(this) / t;
    return this.copy(e).multiplyScalar(n);
  }
  projectOnPlane(e) {
    return (_r.copy(this).projectOnVector(e), this.sub(_r));
  }
  reflect(e) {
    return this.sub(_r.copy(e).multiplyScalar(2 * this.dot(e)));
  }
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0) return Math.PI / 2;
    const n = this.dot(e) / t;
    return Math.acos(Fe(n, -1, 1));
  }
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  distanceToSquared(e) {
    const t = this.x - e.x,
      n = this.y - e.y,
      s = this.z - e.z;
    return t * t + n * n + s * s;
  }
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
  }
  setFromSpherical(e) {
    return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
  }
  setFromSphericalCoords(e, t, n) {
    const s = Math.sin(t) * e;
    return ((this.x = s * Math.sin(n)), (this.y = Math.cos(t) * e), (this.z = s * Math.cos(n)), this);
  }
  setFromCylindrical(e) {
    return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
  }
  setFromCylindricalCoords(e, t, n) {
    return ((this.x = e * Math.sin(t)), (this.y = n), (this.z = e * Math.cos(t)), this);
  }
  setFromMatrixPosition(e) {
    const t = e.elements;
    return ((this.x = t[12]), (this.y = t[13]), (this.z = t[14]), this);
  }
  setFromMatrixScale(e) {
    const t = this.setFromMatrixColumn(e, 0).length(),
      n = this.setFromMatrixColumn(e, 1).length(),
      s = this.setFromMatrixColumn(e, 2).length();
    return ((this.x = t), (this.y = n), (this.z = s), this);
  }
  setFromMatrixColumn(e, t) {
    return this.fromArray(e.elements, t * 4);
  }
  setFromMatrix3Column(e, t) {
    return this.fromArray(e.elements, t * 3);
  }
  setFromEuler(e) {
    return ((this.x = e._x), (this.y = e._y), (this.z = e._z), this);
  }
  setFromColor(e) {
    return ((this.x = e.r), (this.y = e.g), (this.z = e.b), this);
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z;
  }
  fromArray(e, t = 0) {
    return ((this.x = e[t]), (this.y = e[t + 1]), (this.z = e[t + 2]), this);
  }
  toArray(e = [], t = 0) {
    return ((e[t] = this.x), (e[t + 1] = this.y), (e[t + 2] = this.z), e);
  }
  fromBufferAttribute(e, t) {
    return ((this.x = e.getX(t)), (this.y = e.getY(t)), (this.z = e.getZ(t)), this);
  }
  random() {
    return ((this.x = Math.random()), (this.y = Math.random()), (this.z = Math.random()), this);
  }
  randomDirection() {
    const e = Math.random() * Math.PI * 2,
      t = Math.random() * 2 - 1,
      n = Math.sqrt(1 - t * t);
    return ((this.x = n * Math.cos(e)), (this.y = t), (this.z = n * Math.sin(e)), this);
  }
  *[Symbol.iterator]() {
    (yield this.x, yield this.y, yield this.z);
  }
};
uo.prototype.isVector3 = !0;
let F = uo;
const _r = new F(),
  Uo = new ln(),
  fo = class fo {
    constructor(e, t, n, s, r, a, o, c, l) {
      ((this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1]), e !== void 0 && this.set(e, t, n, s, r, a, o, c, l));
    }
    set(e, t, n, s, r, a, o, c, l) {
      const u = this.elements;
      return (
        (u[0] = e),
        (u[1] = s),
        (u[2] = o),
        (u[3] = t),
        (u[4] = r),
        (u[5] = c),
        (u[6] = n),
        (u[7] = a),
        (u[8] = l),
        this
      );
    }
    identity() {
      return (this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this);
    }
    copy(e) {
      const t = this.elements,
        n = e.elements;
      return (
        (t[0] = n[0]),
        (t[1] = n[1]),
        (t[2] = n[2]),
        (t[3] = n[3]),
        (t[4] = n[4]),
        (t[5] = n[5]),
        (t[6] = n[6]),
        (t[7] = n[7]),
        (t[8] = n[8]),
        this
      );
    }
    extractBasis(e, t, n) {
      return (e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this);
    }
    setFromMatrix4(e) {
      const t = e.elements;
      return (this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]), this);
    }
    multiply(e) {
      return this.multiplyMatrices(this, e);
    }
    premultiply(e) {
      return this.multiplyMatrices(e, this);
    }
    multiplyMatrices(e, t) {
      const n = e.elements,
        s = t.elements,
        r = this.elements,
        a = n[0],
        o = n[3],
        c = n[6],
        l = n[1],
        u = n[4],
        d = n[7],
        h = n[2],
        f = n[5],
        g = n[8],
        M = s[0],
        m = s[3],
        p = s[6],
        S = s[1],
        E = s[4],
        b = s[7],
        R = s[2],
        T = s[5],
        P = s[8];
      return (
        (r[0] = a * M + o * S + c * R),
        (r[3] = a * m + o * E + c * T),
        (r[6] = a * p + o * b + c * P),
        (r[1] = l * M + u * S + d * R),
        (r[4] = l * m + u * E + d * T),
        (r[7] = l * p + u * b + d * P),
        (r[2] = h * M + f * S + g * R),
        (r[5] = h * m + f * E + g * T),
        (r[8] = h * p + f * b + g * P),
        this
      );
    }
    multiplyScalar(e) {
      const t = this.elements;
      return (
        (t[0] *= e),
        (t[3] *= e),
        (t[6] *= e),
        (t[1] *= e),
        (t[4] *= e),
        (t[7] *= e),
        (t[2] *= e),
        (t[5] *= e),
        (t[8] *= e),
        this
      );
    }
    determinant() {
      const e = this.elements,
        t = e[0],
        n = e[1],
        s = e[2],
        r = e[3],
        a = e[4],
        o = e[5],
        c = e[6],
        l = e[7],
        u = e[8];
      return t * a * u - t * o * l - n * r * u + n * o * c + s * r * l - s * a * c;
    }
    invert() {
      const e = this.elements,
        t = e[0],
        n = e[1],
        s = e[2],
        r = e[3],
        a = e[4],
        o = e[5],
        c = e[6],
        l = e[7],
        u = e[8],
        d = u * a - o * l,
        h = o * c - u * r,
        f = l * r - a * c,
        g = t * d + n * h + s * f;
      if (g === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
      const M = 1 / g;
      return (
        (e[0] = d * M),
        (e[1] = (s * l - u * n) * M),
        (e[2] = (o * n - s * a) * M),
        (e[3] = h * M),
        (e[4] = (u * t - s * c) * M),
        (e[5] = (s * r - o * t) * M),
        (e[6] = f * M),
        (e[7] = (n * c - l * t) * M),
        (e[8] = (a * t - n * r) * M),
        this
      );
    }
    transpose() {
      let e;
      const t = this.elements;
      return (
        (e = t[1]),
        (t[1] = t[3]),
        (t[3] = e),
        (e = t[2]),
        (t[2] = t[6]),
        (t[6] = e),
        (e = t[5]),
        (t[5] = t[7]),
        (t[7] = e),
        this
      );
    }
    getNormalMatrix(e) {
      return this.setFromMatrix4(e).invert().transpose();
    }
    transposeIntoArray(e) {
      const t = this.elements;
      return (
        (e[0] = t[0]),
        (e[1] = t[3]),
        (e[2] = t[6]),
        (e[3] = t[1]),
        (e[4] = t[4]),
        (e[5] = t[7]),
        (e[6] = t[2]),
        (e[7] = t[5]),
        (e[8] = t[8]),
        this
      );
    }
    setUvTransform(e, t, n, s, r, a, o) {
      const c = Math.cos(r),
        l = Math.sin(r);
      return (
        this.set(n * c, n * l, -n * (c * a + l * o) + a + e, -s * l, s * c, -s * (-l * a + c * o) + o + t, 0, 0, 1),
        this
      );
    }
    scale(e, t) {
      return (this.premultiply(xr.makeScale(e, t)), this);
    }
    rotate(e) {
      return (this.premultiply(xr.makeRotation(-e)), this);
    }
    translate(e, t) {
      return (this.premultiply(xr.makeTranslation(e, t)), this);
    }
    makeTranslation(e, t) {
      return (e.isVector2 ? this.set(1, 0, e.x, 0, 1, e.y, 0, 0, 1) : this.set(1, 0, e, 0, 1, t, 0, 0, 1), this);
    }
    makeRotation(e) {
      const t = Math.cos(e),
        n = Math.sin(e);
      return (this.set(t, -n, 0, n, t, 0, 0, 0, 1), this);
    }
    makeScale(e, t) {
      return (this.set(e, 0, 0, 0, t, 0, 0, 0, 1), this);
    }
    equals(e) {
      const t = this.elements,
        n = e.elements;
      for (let s = 0; s < 9; s++) if (t[s] !== n[s]) return !1;
      return !0;
    }
    fromArray(e, t = 0) {
      for (let n = 0; n < 9; n++) this.elements[n] = e[n + t];
      return this;
    }
    toArray(e = [], t = 0) {
      const n = this.elements;
      return (
        (e[t] = n[0]),
        (e[t + 1] = n[1]),
        (e[t + 2] = n[2]),
        (e[t + 3] = n[3]),
        (e[t + 4] = n[4]),
        (e[t + 5] = n[5]),
        (e[t + 6] = n[6]),
        (e[t + 7] = n[7]),
        (e[t + 8] = n[8]),
        e
      );
    }
    clone() {
      return new this.constructor().fromArray(this.elements);
    }
  };
fo.prototype.isMatrix3 = !0;
let Ie = fo;
const xr = new Ie(),
  No = new Ie().set(0.4123908, 0.3575843, 0.1804808, 0.212639, 0.7151687, 0.0721923, 0.0193308, 0.1191948, 0.9505322),
  Fo = new Ie().set(
    3.2409699,
    -1.5373832,
    -0.4986108,
    -0.9692436,
    1.8759675,
    0.0415551,
    0.0556301,
    -0.203977,
    1.0569715,
  );
function Kh() {
  const i = {
      enabled: !0,
      workingColorSpace: Ks,
      spaces: {},
      convert: function (s, r, a) {
        return (
          this.enabled === !1 ||
            r === a ||
            !r ||
            !a ||
            (this.spaces[r].transfer === Ze && ((s.r = bn(s.r)), (s.g = bn(s.g)), (s.b = bn(s.b))),
            this.spaces[r].primaries !== this.spaces[a].primaries &&
              (s.applyMatrix3(this.spaces[r].toXYZ), s.applyMatrix3(this.spaces[a].fromXYZ)),
            this.spaces[a].transfer === Ze && ((s.r = yi(s.r)), (s.g = yi(s.g)), (s.b = yi(s.b)))),
          s
        );
      },
      workingToColorSpace: function (s, r) {
        return this.convert(s, this.workingColorSpace, r);
      },
      colorSpaceToWorking: function (s, r) {
        return this.convert(s, r, this.workingColorSpace);
      },
      getPrimaries: function (s) {
        return this.spaces[s].primaries;
      },
      getTransfer: function (s) {
        return s === Bn ? js : this.spaces[s].transfer;
      },
      getToneMappingMode: function (s) {
        return this.spaces[s].outputColorSpaceConfig.toneMappingMode || "standard";
      },
      getLuminanceCoefficients: function (s, r = this.workingColorSpace) {
        return s.fromArray(this.spaces[r].luminanceCoefficients);
      },
      define: function (s) {
        Object.assign(this.spaces, s);
      },
      _getMatrix: function (s, r, a) {
        return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ);
      },
      _getDrawingBufferColorSpace: function (s) {
        return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace;
      },
      _getUnpackColorSpace: function (s = this.workingColorSpace) {
        return this.spaces[s].workingColorSpaceConfig.unpackColorSpace;
      },
      fromWorkingColorSpace: function (s, r) {
        return (
          za("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),
          i.workingToColorSpace(s, r)
        );
      },
      toWorkingColorSpace: function (s, r) {
        return (
          za("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),
          i.colorSpaceToWorking(s, r)
        );
      },
    },
    e = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06],
    t = [0.2126, 0.7152, 0.0722],
    n = [0.3127, 0.329];
  return (
    i.define({
      [Ks]: {
        primaries: e,
        whitePoint: n,
        transfer: js,
        toXYZ: No,
        fromXYZ: Fo,
        luminanceCoefficients: t,
        workingColorSpaceConfig: { unpackColorSpace: kt },
        outputColorSpaceConfig: { drawingBufferColorSpace: kt },
      },
      [kt]: {
        primaries: e,
        whitePoint: n,
        transfer: Ze,
        toXYZ: No,
        fromXYZ: Fo,
        luminanceCoefficients: t,
        outputColorSpaceConfig: { drawingBufferColorSpace: kt },
      },
    }),
    i
  );
}
const We = Kh();
function bn(i) {
  return i < 0.04045 ? i * 0.0773993808 : Math.pow(i * 0.9478672986 + 0.0521327014, 2.4);
}
function yi(i) {
  return i < 0.0031308 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055;
}
let si;
class jh {
  static getDataURL(e, t = "image/png") {
    if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u") return e.src;
    let n;
    if (e instanceof HTMLCanvasElement) n = e;
    else {
      (si === void 0 && (si = Ji("canvas")), (si.width = e.width), (si.height = e.height));
      const s = si.getContext("2d");
      (e instanceof ImageData ? s.putImageData(e, 0, 0) : s.drawImage(e, 0, 0, e.width, e.height), (n = si));
    }
    return n.toDataURL(t);
  }
  static sRGBToLinear(e) {
    if (
      (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement) ||
      (typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement) ||
      (typeof ImageBitmap < "u" && e instanceof ImageBitmap)
    ) {
      const t = Ji("canvas");
      ((t.width = e.width), (t.height = e.height));
      const n = t.getContext("2d");
      n.drawImage(e, 0, 0, e.width, e.height);
      const s = n.getImageData(0, 0, e.width, e.height),
        r = s.data;
      for (let a = 0; a < r.length; a++) r[a] = bn(r[a] / 255) * 255;
      return (n.putImageData(s, 0, 0), t);
    } else if (e.data) {
      const t = e.data.slice(0);
      for (let n = 0; n < t.length; n++)
        t instanceof Uint8Array || t instanceof Uint8ClampedArray
          ? (t[n] = Math.floor(bn(t[n] / 255) * 255))
          : (t[n] = bn(t[n]));
      return { data: t, width: e.width, height: e.height };
    } else return (xe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e);
  }
}
let $h = 0;
class io {
  constructor(e = null) {
    ((this.isSource = !0),
      Object.defineProperty(this, "id", { value: $h++ }),
      (this.uuid = Jt()),
      (this.data = e),
      (this.dataReady = !0),
      (this.version = 0));
  }
  getSize(e) {
    const t = this.data;
    return (
      typeof HTMLVideoElement < "u" && t instanceof HTMLVideoElement
        ? e.set(t.videoWidth, t.videoHeight, 0)
        : typeof VideoFrame < "u" && t instanceof VideoFrame
          ? e.set(t.displayWidth, t.displayHeight, 0)
          : t !== null
            ? e.set(t.width, t.height, t.depth || 0)
            : e.set(0, 0, 0),
      e
    );
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.images[this.uuid] !== void 0) return e.images[this.uuid];
    const n = { uuid: this.uuid, url: "" },
      s = this.data;
    if (s !== null) {
      let r;
      if (Array.isArray(s)) {
        r = [];
        for (let a = 0, o = s.length; a < o; a++) s[a].isDataTexture ? r.push(vr(s[a].image)) : r.push(vr(s[a]));
      } else r = vr(s);
      n.url = r;
    }
    return (t || (e.images[this.uuid] = n), n);
  }
}
function vr(i) {
  return (typeof HTMLImageElement < "u" && i instanceof HTMLImageElement) ||
    (typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement) ||
    (typeof ImageBitmap < "u" && i instanceof ImageBitmap)
    ? jh.getDataURL(i)
    : i.data
      ? { data: Array.from(i.data), width: i.width, height: i.height, type: i.data.constructor.name }
      : (xe("Texture: Unable to serialize Texture."), {});
}
let Jh = 0;
const Mr = new F();
class Rt extends An {
  constructor(
    e = Rt.DEFAULT_IMAGE,
    t = Rt.DEFAULT_MAPPING,
    n = $t,
    s = $t,
    r = vt,
    a = zn,
    o = Ht,
    c = Bt,
    l = Rt.DEFAULT_ANISOTROPY,
    u = Bn,
  ) {
    (super(),
      (this.isTexture = !0),
      Object.defineProperty(this, "id", { value: Jh++ }),
      (this.uuid = Jt()),
      (this.name = ""),
      (this.source = new io(e)),
      (this.mipmaps = []),
      (this.mapping = t),
      (this.channel = 0),
      (this.wrapS = n),
      (this.wrapT = s),
      (this.magFilter = r),
      (this.minFilter = a),
      (this.anisotropy = l),
      (this.format = o),
      (this.internalFormat = null),
      (this.type = c),
      (this.offset = new Ge(0, 0)),
      (this.repeat = new Ge(1, 1)),
      (this.center = new Ge(0, 0)),
      (this.rotation = 0),
      (this.matrixAutoUpdate = !0),
      (this.matrix = new Ie()),
      (this.generateMipmaps = !0),
      (this.premultiplyAlpha = !1),
      (this.flipY = !0),
      (this.unpackAlignment = 4),
      (this.colorSpace = u),
      (this.userData = {}),
      (this.updateRanges = []),
      (this.version = 0),
      (this.onUpdate = null),
      (this.renderTarget = null),
      (this.isRenderTargetTexture = !1),
      (this.isArrayTexture = !!(e && e.depth && e.depth > 1)),
      (this.pmremVersion = 0),
      (this.normalized = !1));
  }
  get width() {
    return this.source.getSize(Mr).x;
  }
  get height() {
    return this.source.getSize(Mr).y;
  }
  get depth() {
    return this.source.getSize(Mr).z;
  }
  get image() {
    return this.source.data;
  }
  set image(e) {
    this.source.data = e;
  }
  updateMatrix() {
    this.matrix.setUvTransform(
      this.offset.x,
      this.offset.y,
      this.repeat.x,
      this.repeat.y,
      this.rotation,
      this.center.x,
      this.center.y,
    );
  }
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return (
      (this.name = e.name),
      (this.source = e.source),
      (this.mipmaps = e.mipmaps.slice(0)),
      (this.mapping = e.mapping),
      (this.channel = e.channel),
      (this.wrapS = e.wrapS),
      (this.wrapT = e.wrapT),
      (this.magFilter = e.magFilter),
      (this.minFilter = e.minFilter),
      (this.anisotropy = e.anisotropy),
      (this.format = e.format),
      (this.internalFormat = e.internalFormat),
      (this.type = e.type),
      (this.normalized = e.normalized),
      this.offset.copy(e.offset),
      this.repeat.copy(e.repeat),
      this.center.copy(e.center),
      (this.rotation = e.rotation),
      (this.matrixAutoUpdate = e.matrixAutoUpdate),
      this.matrix.copy(e.matrix),
      (this.generateMipmaps = e.generateMipmaps),
      (this.premultiplyAlpha = e.premultiplyAlpha),
      (this.flipY = e.flipY),
      (this.unpackAlignment = e.unpackAlignment),
      (this.colorSpace = e.colorSpace),
      (this.renderTarget = e.renderTarget),
      (this.isRenderTargetTexture = e.isRenderTargetTexture),
      (this.isArrayTexture = e.isArrayTexture),
      (this.userData = JSON.parse(JSON.stringify(e.userData))),
      (this.needsUpdate = !0),
      this
    );
  }
  setValues(e) {
    for (const t in e) {
      const n = e[t];
      if (n === void 0) {
        xe(`Texture.setValues(): parameter '${t}' has value of undefined.`);
        continue;
      }
      const s = this[t];
      if (s === void 0) {
        xe(`Texture.setValues(): property '${t}' does not exist.`);
        continue;
      }
      (s && n && s.isVector2 && n.isVector2) ||
      (s && n && s.isVector3 && n.isVector3) ||
      (s && n && s.isMatrix3 && n.isMatrix3)
        ? s.copy(n)
        : (this[t] = n);
    }
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.textures[this.uuid] !== void 0) return e.textures[this.uuid];
    const n = {
      metadata: { version: 4.7, type: "Texture", generator: "Texture.toJSON" },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(e).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      normalized: this.normalized,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment,
    };
    return (Object.keys(this.userData).length > 0 && (n.userData = this.userData), t || (e.textures[this.uuid] = n), n);
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  transformUv(e) {
    if (this.mapping !== $l) return e;
    if ((e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1))
      switch (this.wrapS) {
        case ra:
          e.x = e.x - Math.floor(e.x);
          break;
        case $t:
          e.x = e.x < 0 ? 0 : 1;
          break;
        case aa:
          Math.abs(Math.floor(e.x) % 2) === 1 ? (e.x = Math.ceil(e.x) - e.x) : (e.x = e.x - Math.floor(e.x));
          break;
      }
    if (e.y < 0 || e.y > 1)
      switch (this.wrapT) {
        case ra:
          e.y = e.y - Math.floor(e.y);
          break;
        case $t:
          e.y = e.y < 0 ? 0 : 1;
          break;
        case aa:
          Math.abs(Math.floor(e.y) % 2) === 1 ? (e.y = Math.ceil(e.y) - e.y) : (e.y = e.y - Math.floor(e.y));
          break;
      }
    return (this.flipY && (e.y = 1 - e.y), e);
  }
  set needsUpdate(e) {
    e === !0 && (this.version++, (this.source.needsUpdate = !0));
  }
  set needsPMREMUpdate(e) {
    e === !0 && this.pmremVersion++;
  }
}
Rt.DEFAULT_IMAGE = null;
Rt.DEFAULT_MAPPING = $l;
Rt.DEFAULT_ANISOTROPY = 1;
const po = class po {
  constructor(e = 0, t = 0, n = 0, s = 1) {
    ((this.x = e), (this.y = t), (this.z = n), (this.w = s));
  }
  get width() {
    return this.z;
  }
  set width(e) {
    this.z = e;
  }
  get height() {
    return this.w;
  }
  set height(e) {
    this.w = e;
  }
  set(e, t, n, s) {
    return ((this.x = e), (this.y = t), (this.z = n), (this.w = s), this);
  }
  setScalar(e) {
    return ((this.x = e), (this.y = e), (this.z = e), (this.w = e), this);
  }
  setX(e) {
    return ((this.x = e), this);
  }
  setY(e) {
    return ((this.y = e), this);
  }
  setZ(e) {
    return ((this.z = e), this);
  }
  setW(e) {
    return ((this.w = e), this);
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      case 3:
        this.w = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(e) {
    return ((this.x = e.x), (this.y = e.y), (this.z = e.z), (this.w = e.w !== void 0 ? e.w : 1), this);
  }
  add(e) {
    return ((this.x += e.x), (this.y += e.y), (this.z += e.z), (this.w += e.w), this);
  }
  addScalar(e) {
    return ((this.x += e), (this.y += e), (this.z += e), (this.w += e), this);
  }
  addVectors(e, t) {
    return ((this.x = e.x + t.x), (this.y = e.y + t.y), (this.z = e.z + t.z), (this.w = e.w + t.w), this);
  }
  addScaledVector(e, t) {
    return ((this.x += e.x * t), (this.y += e.y * t), (this.z += e.z * t), (this.w += e.w * t), this);
  }
  sub(e) {
    return ((this.x -= e.x), (this.y -= e.y), (this.z -= e.z), (this.w -= e.w), this);
  }
  subScalar(e) {
    return ((this.x -= e), (this.y -= e), (this.z -= e), (this.w -= e), this);
  }
  subVectors(e, t) {
    return ((this.x = e.x - t.x), (this.y = e.y - t.y), (this.z = e.z - t.z), (this.w = e.w - t.w), this);
  }
  multiply(e) {
    return ((this.x *= e.x), (this.y *= e.y), (this.z *= e.z), (this.w *= e.w), this);
  }
  multiplyScalar(e) {
    return ((this.x *= e), (this.y *= e), (this.z *= e), (this.w *= e), this);
  }
  applyMatrix4(e) {
    const t = this.x,
      n = this.y,
      s = this.z,
      r = this.w,
      a = e.elements;
    return (
      (this.x = a[0] * t + a[4] * n + a[8] * s + a[12] * r),
      (this.y = a[1] * t + a[5] * n + a[9] * s + a[13] * r),
      (this.z = a[2] * t + a[6] * n + a[10] * s + a[14] * r),
      (this.w = a[3] * t + a[7] * n + a[11] * s + a[15] * r),
      this
    );
  }
  divide(e) {
    return ((this.x /= e.x), (this.y /= e.y), (this.z /= e.z), (this.w /= e.w), this);
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  setAxisAngleFromQuaternion(e) {
    this.w = 2 * Math.acos(e.w);
    const t = Math.sqrt(1 - e.w * e.w);
    return (
      t < 1e-4
        ? ((this.x = 1), (this.y = 0), (this.z = 0))
        : ((this.x = e.x / t), (this.y = e.y / t), (this.z = e.z / t)),
      this
    );
  }
  setAxisAngleFromRotationMatrix(e) {
    let t, n, s, r;
    const c = e.elements,
      l = c[0],
      u = c[4],
      d = c[8],
      h = c[1],
      f = c[5],
      g = c[9],
      M = c[2],
      m = c[6],
      p = c[10];
    if (Math.abs(u - h) < 0.01 && Math.abs(d - M) < 0.01 && Math.abs(g - m) < 0.01) {
      if (Math.abs(u + h) < 0.1 && Math.abs(d + M) < 0.1 && Math.abs(g + m) < 0.1 && Math.abs(l + f + p - 3) < 0.1)
        return (this.set(1, 0, 0, 0), this);
      t = Math.PI;
      const E = (l + 1) / 2,
        b = (f + 1) / 2,
        R = (p + 1) / 2,
        T = (u + h) / 4,
        P = (d + M) / 4,
        x = (g + m) / 4;
      return (
        E > b && E > R
          ? E < 0.01
            ? ((n = 0), (s = 0.707106781), (r = 0.707106781))
            : ((n = Math.sqrt(E)), (s = T / n), (r = P / n))
          : b > R
            ? b < 0.01
              ? ((n = 0.707106781), (s = 0), (r = 0.707106781))
              : ((s = Math.sqrt(b)), (n = T / s), (r = x / s))
            : R < 0.01
              ? ((n = 0.707106781), (s = 0.707106781), (r = 0))
              : ((r = Math.sqrt(R)), (n = P / r), (s = x / r)),
        this.set(n, s, r, t),
        this
      );
    }
    let S = Math.sqrt((m - g) * (m - g) + (d - M) * (d - M) + (h - u) * (h - u));
    return (
      Math.abs(S) < 0.001 && (S = 1),
      (this.x = (m - g) / S),
      (this.y = (d - M) / S),
      (this.z = (h - u) / S),
      (this.w = Math.acos((l + f + p - 1) / 2)),
      this
    );
  }
  setFromMatrixPosition(e) {
    const t = e.elements;
    return ((this.x = t[12]), (this.y = t[13]), (this.z = t[14]), (this.w = t[15]), this);
  }
  min(e) {
    return (
      (this.x = Math.min(this.x, e.x)),
      (this.y = Math.min(this.y, e.y)),
      (this.z = Math.min(this.z, e.z)),
      (this.w = Math.min(this.w, e.w)),
      this
    );
  }
  max(e) {
    return (
      (this.x = Math.max(this.x, e.x)),
      (this.y = Math.max(this.y, e.y)),
      (this.z = Math.max(this.z, e.z)),
      (this.w = Math.max(this.w, e.w)),
      this
    );
  }
  clamp(e, t) {
    return (
      (this.x = Fe(this.x, e.x, t.x)),
      (this.y = Fe(this.y, e.y, t.y)),
      (this.z = Fe(this.z, e.z, t.z)),
      (this.w = Fe(this.w, e.w, t.w)),
      this
    );
  }
  clampScalar(e, t) {
    return (
      (this.x = Fe(this.x, e, t)),
      (this.y = Fe(this.y, e, t)),
      (this.z = Fe(this.z, e, t)),
      (this.w = Fe(this.w, e, t)),
      this
    );
  }
  clampLength(e, t) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Fe(n, e, t));
  }
  floor() {
    return (
      (this.x = Math.floor(this.x)),
      (this.y = Math.floor(this.y)),
      (this.z = Math.floor(this.z)),
      (this.w = Math.floor(this.w)),
      this
    );
  }
  ceil() {
    return (
      (this.x = Math.ceil(this.x)),
      (this.y = Math.ceil(this.y)),
      (this.z = Math.ceil(this.z)),
      (this.w = Math.ceil(this.w)),
      this
    );
  }
  round() {
    return (
      (this.x = Math.round(this.x)),
      (this.y = Math.round(this.y)),
      (this.z = Math.round(this.z)),
      (this.w = Math.round(this.w)),
      this
    );
  }
  roundToZero() {
    return (
      (this.x = Math.trunc(this.x)),
      (this.y = Math.trunc(this.y)),
      (this.z = Math.trunc(this.z)),
      (this.w = Math.trunc(this.w)),
      this
    );
  }
  negate() {
    return ((this.x = -this.x), (this.y = -this.y), (this.z = -this.z), (this.w = -this.w), this);
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return (
      (this.x += (e.x - this.x) * t),
      (this.y += (e.y - this.y) * t),
      (this.z += (e.z - this.z) * t),
      (this.w += (e.w - this.w) * t),
      this
    );
  }
  lerpVectors(e, t, n) {
    return (
      (this.x = e.x + (t.x - e.x) * n),
      (this.y = e.y + (t.y - e.y) * n),
      (this.z = e.z + (t.z - e.z) * n),
      (this.w = e.w + (t.w - e.w) * n),
      this
    );
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
  }
  fromArray(e, t = 0) {
    return ((this.x = e[t]), (this.y = e[t + 1]), (this.z = e[t + 2]), (this.w = e[t + 3]), this);
  }
  toArray(e = [], t = 0) {
    return ((e[t] = this.x), (e[t + 1] = this.y), (e[t + 2] = this.z), (e[t + 3] = this.w), e);
  }
  fromBufferAttribute(e, t) {
    return ((this.x = e.getX(t)), (this.y = e.getY(t)), (this.z = e.getZ(t)), (this.w = e.getW(t)), this);
  }
  random() {
    return (
      (this.x = Math.random()),
      (this.y = Math.random()),
      (this.z = Math.random()),
      (this.w = Math.random()),
      this
    );
  }
  *[Symbol.iterator]() {
    (yield this.x, yield this.y, yield this.z, yield this.w);
  }
};
po.prototype.isVector4 = !0;
let it = po;
class Qh extends An {
  constructor(e = 1, t = 1, n = {}) {
    (super(),
      (n = Object.assign(
        {
          generateMipmaps: !1,
          internalFormat: null,
          minFilter: vt,
          depthBuffer: !0,
          stencilBuffer: !1,
          resolveDepthBuffer: !0,
          resolveStencilBuffer: !0,
          depthTexture: null,
          samples: 0,
          count: 1,
          depth: 1,
          multiview: !1,
        },
        n,
      )),
      (this.isRenderTarget = !0),
      (this.width = e),
      (this.height = t),
      (this.depth = n.depth),
      (this.scissor = new it(0, 0, e, t)),
      (this.scissorTest = !1),
      (this.viewport = new it(0, 0, e, t)),
      (this.textures = []));
    const s = { width: e, height: t, depth: n.depth },
      r = new Rt(s),
      a = n.count;
    for (let o = 0; o < a; o++)
      ((this.textures[o] = r.clone()),
        (this.textures[o].isRenderTargetTexture = !0),
        (this.textures[o].renderTarget = this));
    (this._setTextureOptions(n),
      (this.depthBuffer = n.depthBuffer),
      (this.stencilBuffer = n.stencilBuffer),
      (this.resolveDepthBuffer = n.resolveDepthBuffer),
      (this.resolveStencilBuffer = n.resolveStencilBuffer),
      (this._depthTexture = null),
      (this.depthTexture = n.depthTexture),
      (this.samples = n.samples),
      (this.multiview = n.multiview));
  }
  _setTextureOptions(e = {}) {
    const t = { minFilter: vt, generateMipmaps: !1, flipY: !1, internalFormat: null };
    (e.mapping !== void 0 && (t.mapping = e.mapping),
      e.wrapS !== void 0 && (t.wrapS = e.wrapS),
      e.wrapT !== void 0 && (t.wrapT = e.wrapT),
      e.wrapR !== void 0 && (t.wrapR = e.wrapR),
      e.magFilter !== void 0 && (t.magFilter = e.magFilter),
      e.minFilter !== void 0 && (t.minFilter = e.minFilter),
      e.format !== void 0 && (t.format = e.format),
      e.type !== void 0 && (t.type = e.type),
      e.anisotropy !== void 0 && (t.anisotropy = e.anisotropy),
      e.colorSpace !== void 0 && (t.colorSpace = e.colorSpace),
      e.flipY !== void 0 && (t.flipY = e.flipY),
      e.generateMipmaps !== void 0 && (t.generateMipmaps = e.generateMipmaps),
      e.internalFormat !== void 0 && (t.internalFormat = e.internalFormat));
    for (let n = 0; n < this.textures.length; n++) this.textures[n].setValues(t);
  }
  get texture() {
    return this.textures[0];
  }
  set texture(e) {
    this.textures[0] = e;
  }
  set depthTexture(e) {
    (this._depthTexture !== null && (this._depthTexture.renderTarget = null),
      e !== null && (e.renderTarget = this),
      (this._depthTexture = e));
  }
  get depthTexture() {
    return this._depthTexture;
  }
  setSize(e, t, n = 1) {
    if (this.width !== e || this.height !== t || this.depth !== n) {
      ((this.width = e), (this.height = t), (this.depth = n));
      for (let s = 0, r = this.textures.length; s < r; s++)
        ((this.textures[s].image.width = e),
          (this.textures[s].image.height = t),
          (this.textures[s].image.depth = n),
          this.textures[s].isData3DTexture !== !0 &&
            (this.textures[s].isArrayTexture = this.textures[s].image.depth > 1));
      this.dispose();
    }
    (this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t));
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    ((this.width = e.width),
      (this.height = e.height),
      (this.depth = e.depth),
      this.scissor.copy(e.scissor),
      (this.scissorTest = e.scissorTest),
      this.viewport.copy(e.viewport),
      (this.textures.length = 0));
    for (let t = 0, n = e.textures.length; t < n; t++) {
      ((this.textures[t] = e.textures[t].clone()),
        (this.textures[t].isRenderTargetTexture = !0),
        (this.textures[t].renderTarget = this));
      const s = Object.assign({}, e.textures[t].image);
      this.textures[t].source = new io(s);
    }
    return (
      (this.depthBuffer = e.depthBuffer),
      (this.stencilBuffer = e.stencilBuffer),
      (this.resolveDepthBuffer = e.resolveDepthBuffer),
      (this.resolveStencilBuffer = e.resolveStencilBuffer),
      e.depthTexture !== null && (this.depthTexture = e.depthTexture.clone()),
      (this.samples = e.samples),
      (this.multiview = e.multiview),
      this
    );
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class cn extends Qh {
  constructor(e = 1, t = 1, n = {}) {
    (super(e, t, n), (this.isWebGLRenderTarget = !0));
  }
}
class rc extends Rt {
  constructor(e = null, t = 1, n = 1, s = 1) {
    (super(null),
      (this.isDataArrayTexture = !0),
      (this.image = { data: e, width: t, height: n, depth: s }),
      (this.magFilter = Et),
      (this.minFilter = Et),
      (this.wrapR = $t),
      (this.generateMipmaps = !1),
      (this.flipY = !1),
      (this.unpackAlignment = 1),
      (this.layerUpdates = new Set()));
  }
  addLayerUpdate(e) {
    this.layerUpdates.add(e);
  }
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class eu extends Rt {
  constructor(e = null, t = 1, n = 1, s = 1) {
    (super(null),
      (this.isData3DTexture = !0),
      (this.image = { data: e, width: t, height: n, depth: s }),
      (this.magFilter = Et),
      (this.minFilter = Et),
      (this.wrapR = $t),
      (this.generateMipmaps = !1),
      (this.flipY = !1),
      (this.unpackAlignment = 1));
  }
}
const nr = class nr {
  constructor(e, t, n, s, r, a, o, c, l, u, d, h, f, g, M, m) {
    ((this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
      e !== void 0 && this.set(e, t, n, s, r, a, o, c, l, u, d, h, f, g, M, m));
  }
  set(e, t, n, s, r, a, o, c, l, u, d, h, f, g, M, m) {
    const p = this.elements;
    return (
      (p[0] = e),
      (p[4] = t),
      (p[8] = n),
      (p[12] = s),
      (p[1] = r),
      (p[5] = a),
      (p[9] = o),
      (p[13] = c),
      (p[2] = l),
      (p[6] = u),
      (p[10] = d),
      (p[14] = h),
      (p[3] = f),
      (p[7] = g),
      (p[11] = M),
      (p[15] = m),
      this
    );
  }
  identity() {
    return (this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this);
  }
  clone() {
    return new nr().fromArray(this.elements);
  }
  copy(e) {
    const t = this.elements,
      n = e.elements;
    return (
      (t[0] = n[0]),
      (t[1] = n[1]),
      (t[2] = n[2]),
      (t[3] = n[3]),
      (t[4] = n[4]),
      (t[5] = n[5]),
      (t[6] = n[6]),
      (t[7] = n[7]),
      (t[8] = n[8]),
      (t[9] = n[9]),
      (t[10] = n[10]),
      (t[11] = n[11]),
      (t[12] = n[12]),
      (t[13] = n[13]),
      (t[14] = n[14]),
      (t[15] = n[15]),
      this
    );
  }
  copyPosition(e) {
    const t = this.elements,
      n = e.elements;
    return ((t[12] = n[12]), (t[13] = n[13]), (t[14] = n[14]), this);
  }
  setFromMatrix3(e) {
    const t = e.elements;
    return (this.set(t[0], t[3], t[6], 0, t[1], t[4], t[7], 0, t[2], t[5], t[8], 0, 0, 0, 0, 1), this);
  }
  extractBasis(e, t, n) {
    return this.determinant() === 0
      ? (e.set(1, 0, 0), t.set(0, 1, 0), n.set(0, 0, 1), this)
      : (e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this);
  }
  makeBasis(e, t, n) {
    return (this.set(e.x, t.x, n.x, 0, e.y, t.y, n.y, 0, e.z, t.z, n.z, 0, 0, 0, 0, 1), this);
  }
  extractRotation(e) {
    if (e.determinant() === 0) return this.identity();
    const t = this.elements,
      n = e.elements,
      s = 1 / ri.setFromMatrixColumn(e, 0).length(),
      r = 1 / ri.setFromMatrixColumn(e, 1).length(),
      a = 1 / ri.setFromMatrixColumn(e, 2).length();
    return (
      (t[0] = n[0] * s),
      (t[1] = n[1] * s),
      (t[2] = n[2] * s),
      (t[3] = 0),
      (t[4] = n[4] * r),
      (t[5] = n[5] * r),
      (t[6] = n[6] * r),
      (t[7] = 0),
      (t[8] = n[8] * a),
      (t[9] = n[9] * a),
      (t[10] = n[10] * a),
      (t[11] = 0),
      (t[12] = 0),
      (t[13] = 0),
      (t[14] = 0),
      (t[15] = 1),
      this
    );
  }
  makeRotationFromEuler(e) {
    const t = this.elements,
      n = e.x,
      s = e.y,
      r = e.z,
      a = Math.cos(n),
      o = Math.sin(n),
      c = Math.cos(s),
      l = Math.sin(s),
      u = Math.cos(r),
      d = Math.sin(r);
    if (e.order === "XYZ") {
      const h = a * u,
        f = a * d,
        g = o * u,
        M = o * d;
      ((t[0] = c * u),
        (t[4] = -c * d),
        (t[8] = l),
        (t[1] = f + g * l),
        (t[5] = h - M * l),
        (t[9] = -o * c),
        (t[2] = M - h * l),
        (t[6] = g + f * l),
        (t[10] = a * c));
    } else if (e.order === "YXZ") {
      const h = c * u,
        f = c * d,
        g = l * u,
        M = l * d;
      ((t[0] = h + M * o),
        (t[4] = g * o - f),
        (t[8] = a * l),
        (t[1] = a * d),
        (t[5] = a * u),
        (t[9] = -o),
        (t[2] = f * o - g),
        (t[6] = M + h * o),
        (t[10] = a * c));
    } else if (e.order === "ZXY") {
      const h = c * u,
        f = c * d,
        g = l * u,
        M = l * d;
      ((t[0] = h - M * o),
        (t[4] = -a * d),
        (t[8] = g + f * o),
        (t[1] = f + g * o),
        (t[5] = a * u),
        (t[9] = M - h * o),
        (t[2] = -a * l),
        (t[6] = o),
        (t[10] = a * c));
    } else if (e.order === "ZYX") {
      const h = a * u,
        f = a * d,
        g = o * u,
        M = o * d;
      ((t[0] = c * u),
        (t[4] = g * l - f),
        (t[8] = h * l + M),
        (t[1] = c * d),
        (t[5] = M * l + h),
        (t[9] = f * l - g),
        (t[2] = -l),
        (t[6] = o * c),
        (t[10] = a * c));
    } else if (e.order === "YZX") {
      const h = a * c,
        f = a * l,
        g = o * c,
        M = o * l;
      ((t[0] = c * u),
        (t[4] = M - h * d),
        (t[8] = g * d + f),
        (t[1] = d),
        (t[5] = a * u),
        (t[9] = -o * u),
        (t[2] = -l * u),
        (t[6] = f * d + g),
        (t[10] = h - M * d));
    } else if (e.order === "XZY") {
      const h = a * c,
        f = a * l,
        g = o * c,
        M = o * l;
      ((t[0] = c * u),
        (t[4] = -d),
        (t[8] = l * u),
        (t[1] = h * d + M),
        (t[5] = a * u),
        (t[9] = f * d - g),
        (t[2] = g * d - f),
        (t[6] = o * u),
        (t[10] = M * d + h));
    }
    return ((t[3] = 0), (t[7] = 0), (t[11] = 0), (t[12] = 0), (t[13] = 0), (t[14] = 0), (t[15] = 1), this);
  }
  makeRotationFromQuaternion(e) {
    return this.compose(tu, e, nu);
  }
  lookAt(e, t, n) {
    const s = this.elements;
    return (
      Nt.subVectors(e, t),
      Nt.lengthSq() === 0 && (Nt.z = 1),
      Nt.normalize(),
      Ln.crossVectors(n, Nt),
      Ln.lengthSq() === 0 &&
        (Math.abs(n.z) === 1 ? (Nt.x += 1e-4) : (Nt.z += 1e-4), Nt.normalize(), Ln.crossVectors(n, Nt)),
      Ln.normalize(),
      ls.crossVectors(Nt, Ln),
      (s[0] = Ln.x),
      (s[4] = ls.x),
      (s[8] = Nt.x),
      (s[1] = Ln.y),
      (s[5] = ls.y),
      (s[9] = Nt.y),
      (s[2] = Ln.z),
      (s[6] = ls.z),
      (s[10] = Nt.z),
      this
    );
  }
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  multiplyMatrices(e, t) {
    const n = e.elements,
      s = t.elements,
      r = this.elements,
      a = n[0],
      o = n[4],
      c = n[8],
      l = n[12],
      u = n[1],
      d = n[5],
      h = n[9],
      f = n[13],
      g = n[2],
      M = n[6],
      m = n[10],
      p = n[14],
      S = n[3],
      E = n[7],
      b = n[11],
      R = n[15],
      T = s[0],
      P = s[4],
      x = s[8],
      A = s[12],
      L = s[1],
      w = s[5],
      N = s[9],
      H = s[13],
      W = s[2],
      U = s[6],
      V = s[10],
      G = s[14],
      J = s[3],
      Q = s[7],
      ce = s[11],
      ve = s[15];
    return (
      (r[0] = a * T + o * L + c * W + l * J),
      (r[4] = a * P + o * w + c * U + l * Q),
      (r[8] = a * x + o * N + c * V + l * ce),
      (r[12] = a * A + o * H + c * G + l * ve),
      (r[1] = u * T + d * L + h * W + f * J),
      (r[5] = u * P + d * w + h * U + f * Q),
      (r[9] = u * x + d * N + h * V + f * ce),
      (r[13] = u * A + d * H + h * G + f * ve),
      (r[2] = g * T + M * L + m * W + p * J),
      (r[6] = g * P + M * w + m * U + p * Q),
      (r[10] = g * x + M * N + m * V + p * ce),
      (r[14] = g * A + M * H + m * G + p * ve),
      (r[3] = S * T + E * L + b * W + R * J),
      (r[7] = S * P + E * w + b * U + R * Q),
      (r[11] = S * x + E * N + b * V + R * ce),
      (r[15] = S * A + E * H + b * G + R * ve),
      this
    );
  }
  multiplyScalar(e) {
    const t = this.elements;
    return (
      (t[0] *= e),
      (t[4] *= e),
      (t[8] *= e),
      (t[12] *= e),
      (t[1] *= e),
      (t[5] *= e),
      (t[9] *= e),
      (t[13] *= e),
      (t[2] *= e),
      (t[6] *= e),
      (t[10] *= e),
      (t[14] *= e),
      (t[3] *= e),
      (t[7] *= e),
      (t[11] *= e),
      (t[15] *= e),
      this
    );
  }
  determinant() {
    const e = this.elements,
      t = e[0],
      n = e[4],
      s = e[8],
      r = e[12],
      a = e[1],
      o = e[5],
      c = e[9],
      l = e[13],
      u = e[2],
      d = e[6],
      h = e[10],
      f = e[14],
      g = e[3],
      M = e[7],
      m = e[11],
      p = e[15],
      S = c * f - l * h,
      E = o * f - l * d,
      b = o * h - c * d,
      R = a * f - l * u,
      T = a * h - c * u,
      P = a * d - o * u;
    return (
      t * (M * S - m * E + p * b) -
      n * (g * S - m * R + p * T) +
      s * (g * E - M * R + p * P) -
      r * (g * b - M * T + m * P)
    );
  }
  transpose() {
    const e = this.elements;
    let t;
    return (
      (t = e[1]),
      (e[1] = e[4]),
      (e[4] = t),
      (t = e[2]),
      (e[2] = e[8]),
      (e[8] = t),
      (t = e[6]),
      (e[6] = e[9]),
      (e[9] = t),
      (t = e[3]),
      (e[3] = e[12]),
      (e[12] = t),
      (t = e[7]),
      (e[7] = e[13]),
      (e[13] = t),
      (t = e[11]),
      (e[11] = e[14]),
      (e[14] = t),
      this
    );
  }
  setPosition(e, t, n) {
    const s = this.elements;
    return (
      e.isVector3 ? ((s[12] = e.x), (s[13] = e.y), (s[14] = e.z)) : ((s[12] = e), (s[13] = t), (s[14] = n)),
      this
    );
  }
  invert() {
    const e = this.elements,
      t = e[0],
      n = e[1],
      s = e[2],
      r = e[3],
      a = e[4],
      o = e[5],
      c = e[6],
      l = e[7],
      u = e[8],
      d = e[9],
      h = e[10],
      f = e[11],
      g = e[12],
      M = e[13],
      m = e[14],
      p = e[15],
      S = t * o - n * a,
      E = t * c - s * a,
      b = t * l - r * a,
      R = n * c - s * o,
      T = n * l - r * o,
      P = s * l - r * c,
      x = u * M - d * g,
      A = u * m - h * g,
      L = u * p - f * g,
      w = d * m - h * M,
      N = d * p - f * M,
      H = h * p - f * m,
      W = S * H - E * N + b * w + R * L - T * A + P * x;
    if (W === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const U = 1 / W;
    return (
      (e[0] = (o * H - c * N + l * w) * U),
      (e[1] = (s * N - n * H - r * w) * U),
      (e[2] = (M * P - m * T + p * R) * U),
      (e[3] = (h * T - d * P - f * R) * U),
      (e[4] = (c * L - a * H - l * A) * U),
      (e[5] = (t * H - s * L + r * A) * U),
      (e[6] = (m * b - g * P - p * E) * U),
      (e[7] = (u * P - h * b + f * E) * U),
      (e[8] = (a * N - o * L + l * x) * U),
      (e[9] = (n * L - t * N - r * x) * U),
      (e[10] = (g * T - M * b + p * S) * U),
      (e[11] = (d * b - u * T - f * S) * U),
      (e[12] = (o * A - a * w - c * x) * U),
      (e[13] = (t * w - n * A + s * x) * U),
      (e[14] = (M * E - g * R - m * S) * U),
      (e[15] = (u * R - d * E + h * S) * U),
      this
    );
  }
  scale(e) {
    const t = this.elements,
      n = e.x,
      s = e.y,
      r = e.z;
    return (
      (t[0] *= n),
      (t[4] *= s),
      (t[8] *= r),
      (t[1] *= n),
      (t[5] *= s),
      (t[9] *= r),
      (t[2] *= n),
      (t[6] *= s),
      (t[10] *= r),
      (t[3] *= n),
      (t[7] *= s),
      (t[11] *= r),
      this
    );
  }
  getMaxScaleOnAxis() {
    const e = this.elements,
      t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2],
      n = e[4] * e[4] + e[5] * e[5] + e[6] * e[6],
      s = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
    return Math.sqrt(Math.max(t, n, s));
  }
  makeTranslation(e, t, n) {
    return (
      e.isVector3
        ? this.set(1, 0, 0, e.x, 0, 1, 0, e.y, 0, 0, 1, e.z, 0, 0, 0, 1)
        : this.set(1, 0, 0, e, 0, 1, 0, t, 0, 0, 1, n, 0, 0, 0, 1),
      this
    );
  }
  makeRotationX(e) {
    const t = Math.cos(e),
      n = Math.sin(e);
    return (this.set(1, 0, 0, 0, 0, t, -n, 0, 0, n, t, 0, 0, 0, 0, 1), this);
  }
  makeRotationY(e) {
    const t = Math.cos(e),
      n = Math.sin(e);
    return (this.set(t, 0, n, 0, 0, 1, 0, 0, -n, 0, t, 0, 0, 0, 0, 1), this);
  }
  makeRotationZ(e) {
    const t = Math.cos(e),
      n = Math.sin(e);
    return (this.set(t, -n, 0, 0, n, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this);
  }
  makeRotationAxis(e, t) {
    const n = Math.cos(t),
      s = Math.sin(t),
      r = 1 - n,
      a = e.x,
      o = e.y,
      c = e.z,
      l = r * a,
      u = r * o;
    return (
      this.set(
        l * a + n,
        l * o - s * c,
        l * c + s * o,
        0,
        l * o + s * c,
        u * o + n,
        u * c - s * a,
        0,
        l * c - s * o,
        u * c + s * a,
        r * c * c + n,
        0,
        0,
        0,
        0,
        1,
      ),
      this
    );
  }
  makeScale(e, t, n) {
    return (this.set(e, 0, 0, 0, 0, t, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this);
  }
  makeShear(e, t, n, s, r, a) {
    return (this.set(1, n, r, 0, e, 1, a, 0, t, s, 1, 0, 0, 0, 0, 1), this);
  }
  compose(e, t, n) {
    const s = this.elements,
      r = t._x,
      a = t._y,
      o = t._z,
      c = t._w,
      l = r + r,
      u = a + a,
      d = o + o,
      h = r * l,
      f = r * u,
      g = r * d,
      M = a * u,
      m = a * d,
      p = o * d,
      S = c * l,
      E = c * u,
      b = c * d,
      R = n.x,
      T = n.y,
      P = n.z;
    return (
      (s[0] = (1 - (M + p)) * R),
      (s[1] = (f + b) * R),
      (s[2] = (g - E) * R),
      (s[3] = 0),
      (s[4] = (f - b) * T),
      (s[5] = (1 - (h + p)) * T),
      (s[6] = (m + S) * T),
      (s[7] = 0),
      (s[8] = (g + E) * P),
      (s[9] = (m - S) * P),
      (s[10] = (1 - (h + M)) * P),
      (s[11] = 0),
      (s[12] = e.x),
      (s[13] = e.y),
      (s[14] = e.z),
      (s[15] = 1),
      this
    );
  }
  decompose(e, t, n) {
    const s = this.elements;
    ((e.x = s[12]), (e.y = s[13]), (e.z = s[14]));
    const r = this.determinant();
    if (r === 0) return (n.set(1, 1, 1), t.identity(), this);
    let a = ri.set(s[0], s[1], s[2]).length();
    const o = ri.set(s[4], s[5], s[6]).length(),
      c = ri.set(s[8], s[9], s[10]).length();
    (r < 0 && (a = -a), qt.copy(this));
    const l = 1 / a,
      u = 1 / o,
      d = 1 / c;
    return (
      (qt.elements[0] *= l),
      (qt.elements[1] *= l),
      (qt.elements[2] *= l),
      (qt.elements[4] *= u),
      (qt.elements[5] *= u),
      (qt.elements[6] *= u),
      (qt.elements[8] *= d),
      (qt.elements[9] *= d),
      (qt.elements[10] *= d),
      t.setFromRotationMatrix(qt),
      (n.x = a),
      (n.y = o),
      (n.z = c),
      this
    );
  }
  makePerspective(e, t, n, s, r, a, o = an, c = !1) {
    const l = this.elements,
      u = (2 * r) / (t - e),
      d = (2 * r) / (n - s),
      h = (t + e) / (t - e),
      f = (n + s) / (n - s);
    let g, M;
    if (c) ((g = r / (a - r)), (M = (a * r) / (a - r)));
    else if (o === an) ((g = -(a + r) / (a - r)), (M = (-2 * a * r) / (a - r)));
    else if (o === $i) ((g = -a / (a - r)), (M = (-a * r) / (a - r)));
    else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
    return (
      (l[0] = u),
      (l[4] = 0),
      (l[8] = h),
      (l[12] = 0),
      (l[1] = 0),
      (l[5] = d),
      (l[9] = f),
      (l[13] = 0),
      (l[2] = 0),
      (l[6] = 0),
      (l[10] = g),
      (l[14] = M),
      (l[3] = 0),
      (l[7] = 0),
      (l[11] = -1),
      (l[15] = 0),
      this
    );
  }
  makeOrthographic(e, t, n, s, r, a, o = an, c = !1) {
    const l = this.elements,
      u = 2 / (t - e),
      d = 2 / (n - s),
      h = -(t + e) / (t - e),
      f = -(n + s) / (n - s);
    let g, M;
    if (c) ((g = 1 / (a - r)), (M = a / (a - r)));
    else if (o === an) ((g = -2 / (a - r)), (M = -(a + r) / (a - r)));
    else if (o === $i) ((g = -1 / (a - r)), (M = -r / (a - r)));
    else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
    return (
      (l[0] = u),
      (l[4] = 0),
      (l[8] = 0),
      (l[12] = h),
      (l[1] = 0),
      (l[5] = d),
      (l[9] = 0),
      (l[13] = f),
      (l[2] = 0),
      (l[6] = 0),
      (l[10] = g),
      (l[14] = M),
      (l[3] = 0),
      (l[7] = 0),
      (l[11] = 0),
      (l[15] = 1),
      this
    );
  }
  equals(e) {
    const t = this.elements,
      n = e.elements;
    for (let s = 0; s < 16; s++) if (t[s] !== n[s]) return !1;
    return !0;
  }
  fromArray(e, t = 0) {
    for (let n = 0; n < 16; n++) this.elements[n] = e[n + t];
    return this;
  }
  toArray(e = [], t = 0) {
    const n = this.elements;
    return (
      (e[t] = n[0]),
      (e[t + 1] = n[1]),
      (e[t + 2] = n[2]),
      (e[t + 3] = n[3]),
      (e[t + 4] = n[4]),
      (e[t + 5] = n[5]),
      (e[t + 6] = n[6]),
      (e[t + 7] = n[7]),
      (e[t + 8] = n[8]),
      (e[t + 9] = n[9]),
      (e[t + 10] = n[10]),
      (e[t + 11] = n[11]),
      (e[t + 12] = n[12]),
      (e[t + 13] = n[13]),
      (e[t + 14] = n[14]),
      (e[t + 15] = n[15]),
      e
    );
  }
};
nr.prototype.isMatrix4 = !0;
let He = nr;
const ri = new F(),
  qt = new He(),
  tu = new F(0, 0, 0),
  nu = new F(1, 1, 1),
  Ln = new F(),
  ls = new F(),
  Nt = new F(),
  Oo = new He(),
  Bo = new ln();
class un {
  constructor(e = 0, t = 0, n = 0, s = un.DEFAULT_ORDER) {
    ((this.isEuler = !0), (this._x = e), (this._y = t), (this._z = n), (this._order = s));
  }
  get x() {
    return this._x;
  }
  set x(e) {
    ((this._x = e), this._onChangeCallback());
  }
  get y() {
    return this._y;
  }
  set y(e) {
    ((this._y = e), this._onChangeCallback());
  }
  get z() {
    return this._z;
  }
  set z(e) {
    ((this._z = e), this._onChangeCallback());
  }
  get order() {
    return this._order;
  }
  set order(e) {
    ((this._order = e), this._onChangeCallback());
  }
  set(e, t, n, s = this._order) {
    return ((this._x = e), (this._y = t), (this._z = n), (this._order = s), this._onChangeCallback(), this);
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(e) {
    return (
      (this._x = e._x),
      (this._y = e._y),
      (this._z = e._z),
      (this._order = e._order),
      this._onChangeCallback(),
      this
    );
  }
  setFromRotationMatrix(e, t = this._order, n = !0) {
    const s = e.elements,
      r = s[0],
      a = s[4],
      o = s[8],
      c = s[1],
      l = s[5],
      u = s[9],
      d = s[2],
      h = s[6],
      f = s[10];
    switch (t) {
      case "XYZ":
        ((this._y = Math.asin(Fe(o, -1, 1))),
          Math.abs(o) < 0.9999999
            ? ((this._x = Math.atan2(-u, f)), (this._z = Math.atan2(-a, r)))
            : ((this._x = Math.atan2(h, l)), (this._z = 0)));
        break;
      case "YXZ":
        ((this._x = Math.asin(-Fe(u, -1, 1))),
          Math.abs(u) < 0.9999999
            ? ((this._y = Math.atan2(o, f)), (this._z = Math.atan2(c, l)))
            : ((this._y = Math.atan2(-d, r)), (this._z = 0)));
        break;
      case "ZXY":
        ((this._x = Math.asin(Fe(h, -1, 1))),
          Math.abs(h) < 0.9999999
            ? ((this._y = Math.atan2(-d, f)), (this._z = Math.atan2(-a, l)))
            : ((this._y = 0), (this._z = Math.atan2(c, r))));
        break;
      case "ZYX":
        ((this._y = Math.asin(-Fe(d, -1, 1))),
          Math.abs(d) < 0.9999999
            ? ((this._x = Math.atan2(h, f)), (this._z = Math.atan2(c, r)))
            : ((this._x = 0), (this._z = Math.atan2(-a, l))));
        break;
      case "YZX":
        ((this._z = Math.asin(Fe(c, -1, 1))),
          Math.abs(c) < 0.9999999
            ? ((this._x = Math.atan2(-u, l)), (this._y = Math.atan2(-d, r)))
            : ((this._x = 0), (this._y = Math.atan2(o, f))));
        break;
      case "XZY":
        ((this._z = Math.asin(-Fe(a, -1, 1))),
          Math.abs(a) < 0.9999999
            ? ((this._x = Math.atan2(h, l)), (this._y = Math.atan2(o, r)))
            : ((this._x = Math.atan2(-u, f)), (this._y = 0)));
        break;
      default:
        xe("Euler: .setFromRotationMatrix() encountered an unknown order: " + t);
    }
    return ((this._order = t), n === !0 && this._onChangeCallback(), this);
  }
  setFromQuaternion(e, t, n) {
    return (Oo.makeRotationFromQuaternion(e), this.setFromRotationMatrix(Oo, t, n));
  }
  setFromVector3(e, t = this._order) {
    return this.set(e.x, e.y, e.z, t);
  }
  reorder(e) {
    return (Bo.setFromEuler(this), this.setFromQuaternion(Bo, e));
  }
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
  }
  fromArray(e) {
    return (
      (this._x = e[0]),
      (this._y = e[1]),
      (this._z = e[2]),
      e[3] !== void 0 && (this._order = e[3]),
      this._onChangeCallback(),
      this
    );
  }
  toArray(e = [], t = 0) {
    return ((e[t] = this._x), (e[t + 1] = this._y), (e[t + 2] = this._z), (e[t + 3] = this._order), e);
  }
  _onChange(e) {
    return ((this._onChangeCallback = e), this);
  }
  _onChangeCallback() {}
  *[Symbol.iterator]() {
    (yield this._x, yield this._y, yield this._z, yield this._order);
  }
}
un.DEFAULT_ORDER = "XYZ";
class ac {
  constructor() {
    this.mask = 1;
  }
  set(e) {
    this.mask = ((1 << e) | 0) >>> 0;
  }
  enable(e) {
    this.mask |= (1 << e) | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(e) {
    this.mask ^= (1 << e) | 0;
  }
  disable(e) {
    this.mask &= ~((1 << e) | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(e) {
    return (this.mask & e.mask) !== 0;
  }
  isEnabled(e) {
    return (this.mask & ((1 << e) | 0)) !== 0;
  }
}
let iu = 0;
const zo = new F(),
  ai = new ln(),
  pn = new He(),
  cs = new F(),
  Di = new F(),
  su = new F(),
  ru = new ln(),
  Vo = new F(1, 0, 0),
  ko = new F(0, 1, 0),
  Go = new F(0, 0, 1),
  Ho = { type: "added" },
  au = { type: "removed" },
  oi = { type: "childadded", child: null },
  Sr = { type: "childremoved", child: null };
class dt extends An {
  constructor() {
    (super(),
      (this.isObject3D = !0),
      Object.defineProperty(this, "id", { value: iu++ }),
      (this.uuid = Jt()),
      (this.name = ""),
      (this.type = "Object3D"),
      (this.parent = null),
      (this.children = []),
      (this.up = dt.DEFAULT_UP.clone()));
    const e = new F(),
      t = new un(),
      n = new ln(),
      s = new F(1, 1, 1);
    function r() {
      n.setFromEuler(t, !1);
    }
    function a() {
      t.setFromQuaternion(n, void 0, !1);
    }
    (t._onChange(r),
      n._onChange(a),
      Object.defineProperties(this, {
        position: { configurable: !0, enumerable: !0, value: e },
        rotation: { configurable: !0, enumerable: !0, value: t },
        quaternion: { configurable: !0, enumerable: !0, value: n },
        scale: { configurable: !0, enumerable: !0, value: s },
        modelViewMatrix: { value: new He() },
        normalMatrix: { value: new Ie() },
      }),
      (this.matrix = new He()),
      (this.matrixWorld = new He()),
      (this.matrixAutoUpdate = dt.DEFAULT_MATRIX_AUTO_UPDATE),
      (this.matrixWorldAutoUpdate = dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE),
      (this.matrixWorldNeedsUpdate = !1),
      (this.layers = new ac()),
      (this.visible = !0),
      (this.castShadow = !1),
      (this.receiveShadow = !1),
      (this.frustumCulled = !0),
      (this.renderOrder = 0),
      (this.animations = []),
      (this.customDepthMaterial = void 0),
      (this.customDistanceMaterial = void 0),
      (this.static = !1),
      (this.userData = {}),
      (this.pivot = null));
  }
  onBeforeShadow() {}
  onAfterShadow() {}
  onBeforeRender() {}
  onAfterRender() {}
  applyMatrix4(e) {
    (this.matrixAutoUpdate && this.updateMatrix(),
      this.matrix.premultiply(e),
      this.matrix.decompose(this.position, this.quaternion, this.scale));
  }
  applyQuaternion(e) {
    return (this.quaternion.premultiply(e), this);
  }
  setRotationFromAxisAngle(e, t) {
    this.quaternion.setFromAxisAngle(e, t);
  }
  setRotationFromEuler(e) {
    this.quaternion.setFromEuler(e, !0);
  }
  setRotationFromMatrix(e) {
    this.quaternion.setFromRotationMatrix(e);
  }
  setRotationFromQuaternion(e) {
    this.quaternion.copy(e);
  }
  rotateOnAxis(e, t) {
    return (ai.setFromAxisAngle(e, t), this.quaternion.multiply(ai), this);
  }
  rotateOnWorldAxis(e, t) {
    return (ai.setFromAxisAngle(e, t), this.quaternion.premultiply(ai), this);
  }
  rotateX(e) {
    return this.rotateOnAxis(Vo, e);
  }
  rotateY(e) {
    return this.rotateOnAxis(ko, e);
  }
  rotateZ(e) {
    return this.rotateOnAxis(Go, e);
  }
  translateOnAxis(e, t) {
    return (zo.copy(e).applyQuaternion(this.quaternion), this.position.add(zo.multiplyScalar(t)), this);
  }
  translateX(e) {
    return this.translateOnAxis(Vo, e);
  }
  translateY(e) {
    return this.translateOnAxis(ko, e);
  }
  translateZ(e) {
    return this.translateOnAxis(Go, e);
  }
  localToWorld(e) {
    return (this.updateWorldMatrix(!0, !1), e.applyMatrix4(this.matrixWorld));
  }
  worldToLocal(e) {
    return (this.updateWorldMatrix(!0, !1), e.applyMatrix4(pn.copy(this.matrixWorld).invert()));
  }
  lookAt(e, t, n) {
    e.isVector3 ? cs.copy(e) : cs.set(e, t, n);
    const s = this.parent;
    (this.updateWorldMatrix(!0, !1),
      Di.setFromMatrixPosition(this.matrixWorld),
      this.isCamera || this.isLight ? pn.lookAt(Di, cs, this.up) : pn.lookAt(cs, Di, this.up),
      this.quaternion.setFromRotationMatrix(pn),
      s && (pn.extractRotation(s.matrixWorld), ai.setFromRotationMatrix(pn), this.quaternion.premultiply(ai.invert())));
  }
  add(e) {
    if (arguments.length > 1) {
      for (let t = 0; t < arguments.length; t++) this.add(arguments[t]);
      return this;
    }
    return e === this
      ? (Te("Object3D.add: object can't be added as a child of itself.", e), this)
      : (e && e.isObject3D
          ? (e.removeFromParent(),
            (e.parent = this),
            this.children.push(e),
            e.dispatchEvent(Ho),
            (oi.child = e),
            this.dispatchEvent(oi),
            (oi.child = null))
          : Te("Object3D.add: object not an instance of THREE.Object3D.", e),
        this);
  }
  remove(e) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++) this.remove(arguments[n]);
      return this;
    }
    const t = this.children.indexOf(e);
    return (
      t !== -1 &&
        ((e.parent = null),
        this.children.splice(t, 1),
        e.dispatchEvent(au),
        (Sr.child = e),
        this.dispatchEvent(Sr),
        (Sr.child = null)),
      this
    );
  }
  removeFromParent() {
    const e = this.parent;
    return (e !== null && e.remove(this), this);
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(e) {
    return (
      this.updateWorldMatrix(!0, !1),
      pn.copy(this.matrixWorld).invert(),
      e.parent !== null && (e.parent.updateWorldMatrix(!0, !1), pn.multiply(e.parent.matrixWorld)),
      e.applyMatrix4(pn),
      e.removeFromParent(),
      (e.parent = this),
      this.children.push(e),
      e.updateWorldMatrix(!1, !0),
      e.dispatchEvent(Ho),
      (oi.child = e),
      this.dispatchEvent(oi),
      (oi.child = null),
      this
    );
  }
  getObjectById(e) {
    return this.getObjectByProperty("id", e);
  }
  getObjectByName(e) {
    return this.getObjectByProperty("name", e);
  }
  getObjectByProperty(e, t) {
    if (this[e] === t) return this;
    for (let n = 0, s = this.children.length; n < s; n++) {
      const a = this.children[n].getObjectByProperty(e, t);
      if (a !== void 0) return a;
    }
  }
  getObjectsByProperty(e, t, n = []) {
    this[e] === t && n.push(this);
    const s = this.children;
    for (let r = 0, a = s.length; r < a; r++) s[r].getObjectsByProperty(e, t, n);
    return n;
  }
  getWorldPosition(e) {
    return (this.updateWorldMatrix(!0, !1), e.setFromMatrixPosition(this.matrixWorld));
  }
  getWorldQuaternion(e) {
    return (this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Di, e, su), e);
  }
  getWorldScale(e) {
    return (this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Di, ru, e), e);
  }
  getWorldDirection(e) {
    this.updateWorldMatrix(!0, !1);
    const t = this.matrixWorld.elements;
    return e.set(t[8], t[9], t[10]).normalize();
  }
  raycast() {}
  traverse(e) {
    e(this);
    const t = this.children;
    for (let n = 0, s = t.length; n < s; n++) t[n].traverse(e);
  }
  traverseVisible(e) {
    if (this.visible === !1) return;
    e(this);
    const t = this.children;
    for (let n = 0, s = t.length; n < s; n++) t[n].traverseVisible(e);
  }
  traverseAncestors(e) {
    const t = this.parent;
    t !== null && (e(t), t.traverseAncestors(e));
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale);
    const e = this.pivot;
    if (e !== null) {
      const t = e.x,
        n = e.y,
        s = e.z,
        r = this.matrix.elements;
      ((r[12] += t - r[0] * t - r[4] * n - r[8] * s),
        (r[13] += n - r[1] * t - r[5] * n - r[9] * s),
        (r[14] += s - r[2] * t - r[6] * n - r[10] * s));
    }
    this.matrixWorldNeedsUpdate = !0;
  }
  updateMatrixWorld(e) {
    (this.matrixAutoUpdate && this.updateMatrix(),
      (this.matrixWorldNeedsUpdate || e) &&
        (this.matrixWorldAutoUpdate === !0 &&
          (this.parent === null
            ? this.matrixWorld.copy(this.matrix)
            : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)),
        (this.matrixWorldNeedsUpdate = !1),
        (e = !0)));
    const t = this.children;
    for (let n = 0, s = t.length; n < s; n++) t[n].updateMatrixWorld(e);
  }
  updateWorldMatrix(e, t) {
    const n = this.parent;
    if (
      (e === !0 && n !== null && n.updateWorldMatrix(!0, !1),
      this.matrixAutoUpdate && this.updateMatrix(),
      this.matrixWorldAutoUpdate === !0 &&
        (this.parent === null
          ? this.matrixWorld.copy(this.matrix)
          : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)),
      t === !0)
    ) {
      const s = this.children;
      for (let r = 0, a = s.length; r < a; r++) s[r].updateWorldMatrix(!1, !0);
    }
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string",
      n = {};
    t &&
      ((e = {
        geometries: {},
        materials: {},
        textures: {},
        images: {},
        shapes: {},
        skeletons: {},
        animations: {},
        nodes: {},
      }),
      (n.metadata = { version: 4.7, type: "Object", generator: "Object3D.toJSON" }));
    const s = {};
    ((s.uuid = this.uuid),
      (s.type = this.type),
      this.name !== "" && (s.name = this.name),
      this.castShadow === !0 && (s.castShadow = !0),
      this.receiveShadow === !0 && (s.receiveShadow = !0),
      this.visible === !1 && (s.visible = !1),
      this.frustumCulled === !1 && (s.frustumCulled = !1),
      this.renderOrder !== 0 && (s.renderOrder = this.renderOrder),
      this.static !== !1 && (s.static = this.static),
      Object.keys(this.userData).length > 0 && (s.userData = this.userData),
      (s.layers = this.layers.mask),
      (s.matrix = this.matrix.toArray()),
      (s.up = this.up.toArray()),
      this.pivot !== null && (s.pivot = this.pivot.toArray()),
      this.matrixAutoUpdate === !1 && (s.matrixAutoUpdate = !1),
      this.morphTargetDictionary !== void 0 &&
        (s.morphTargetDictionary = Object.assign({}, this.morphTargetDictionary)),
      this.morphTargetInfluences !== void 0 && (s.morphTargetInfluences = this.morphTargetInfluences.slice()),
      this.isInstancedMesh &&
        ((s.type = "InstancedMesh"),
        (s.count = this.count),
        (s.instanceMatrix = this.instanceMatrix.toJSON()),
        this.instanceColor !== null && (s.instanceColor = this.instanceColor.toJSON())),
      this.isBatchedMesh &&
        ((s.type = "BatchedMesh"),
        (s.perObjectFrustumCulled = this.perObjectFrustumCulled),
        (s.sortObjects = this.sortObjects),
        (s.drawRanges = this._drawRanges),
        (s.reservedRanges = this._reservedRanges),
        (s.geometryInfo = this._geometryInfo.map((o) => ({
          ...o,
          boundingBox: o.boundingBox ? o.boundingBox.toJSON() : void 0,
          boundingSphere: o.boundingSphere ? o.boundingSphere.toJSON() : void 0,
        }))),
        (s.instanceInfo = this._instanceInfo.map((o) => ({ ...o }))),
        (s.availableInstanceIds = this._availableInstanceIds.slice()),
        (s.availableGeometryIds = this._availableGeometryIds.slice()),
        (s.nextIndexStart = this._nextIndexStart),
        (s.nextVertexStart = this._nextVertexStart),
        (s.geometryCount = this._geometryCount),
        (s.maxInstanceCount = this._maxInstanceCount),
        (s.maxVertexCount = this._maxVertexCount),
        (s.maxIndexCount = this._maxIndexCount),
        (s.geometryInitialized = this._geometryInitialized),
        (s.matricesTexture = this._matricesTexture.toJSON(e)),
        (s.indirectTexture = this._indirectTexture.toJSON(e)),
        this._colorsTexture !== null && (s.colorsTexture = this._colorsTexture.toJSON(e)),
        this.boundingSphere !== null && (s.boundingSphere = this.boundingSphere.toJSON()),
        this.boundingBox !== null && (s.boundingBox = this.boundingBox.toJSON())));
    function r(o, c) {
      return (o[c.uuid] === void 0 && (o[c.uuid] = c.toJSON(e)), c.uuid);
    }
    if (this.isScene)
      (this.background &&
        (this.background.isColor
          ? (s.background = this.background.toJSON())
          : this.background.isTexture && (s.background = this.background.toJSON(e).uuid)),
        this.environment &&
          this.environment.isTexture &&
          this.environment.isRenderTargetTexture !== !0 &&
          (s.environment = this.environment.toJSON(e).uuid));
    else if (this.isMesh || this.isLine || this.isPoints) {
      s.geometry = r(e.geometries, this.geometry);
      const o = this.geometry.parameters;
      if (o !== void 0 && o.shapes !== void 0) {
        const c = o.shapes;
        if (Array.isArray(c))
          for (let l = 0, u = c.length; l < u; l++) {
            const d = c[l];
            r(e.shapes, d);
          }
        else r(e.shapes, c);
      }
    }
    if (
      (this.isSkinnedMesh &&
        ((s.bindMode = this.bindMode),
        (s.bindMatrix = this.bindMatrix.toArray()),
        this.skeleton !== void 0 && (r(e.skeletons, this.skeleton), (s.skeleton = this.skeleton.uuid))),
      this.material !== void 0)
    )
      if (Array.isArray(this.material)) {
        const o = [];
        for (let c = 0, l = this.material.length; c < l; c++) o.push(r(e.materials, this.material[c]));
        s.material = o;
      } else s.material = r(e.materials, this.material);
    if (this.children.length > 0) {
      s.children = [];
      for (let o = 0; o < this.children.length; o++) s.children.push(this.children[o].toJSON(e).object);
    }
    if (this.animations.length > 0) {
      s.animations = [];
      for (let o = 0; o < this.animations.length; o++) {
        const c = this.animations[o];
        s.animations.push(r(e.animations, c));
      }
    }
    if (t) {
      const o = a(e.geometries),
        c = a(e.materials),
        l = a(e.textures),
        u = a(e.images),
        d = a(e.shapes),
        h = a(e.skeletons),
        f = a(e.animations),
        g = a(e.nodes);
      (o.length > 0 && (n.geometries = o),
        c.length > 0 && (n.materials = c),
        l.length > 0 && (n.textures = l),
        u.length > 0 && (n.images = u),
        d.length > 0 && (n.shapes = d),
        h.length > 0 && (n.skeletons = h),
        f.length > 0 && (n.animations = f),
        g.length > 0 && (n.nodes = g));
    }
    return ((n.object = s), n);
    function a(o) {
      const c = [];
      for (const l in o) {
        const u = o[l];
        (delete u.metadata, c.push(u));
      }
      return c;
    }
  }
  clone(e) {
    return new this.constructor().copy(this, e);
  }
  copy(e, t = !0) {
    if (
      ((this.name = e.name),
      this.up.copy(e.up),
      this.position.copy(e.position),
      (this.rotation.order = e.rotation.order),
      this.quaternion.copy(e.quaternion),
      this.scale.copy(e.scale),
      (this.pivot = e.pivot !== null ? e.pivot.clone() : null),
      this.matrix.copy(e.matrix),
      this.matrixWorld.copy(e.matrixWorld),
      (this.matrixAutoUpdate = e.matrixAutoUpdate),
      (this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate),
      (this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate),
      (this.layers.mask = e.layers.mask),
      (this.visible = e.visible),
      (this.castShadow = e.castShadow),
      (this.receiveShadow = e.receiveShadow),
      (this.frustumCulled = e.frustumCulled),
      (this.renderOrder = e.renderOrder),
      (this.static = e.static),
      (this.animations = e.animations.slice()),
      (this.userData = JSON.parse(JSON.stringify(e.userData))),
      t === !0)
    )
      for (let n = 0; n < e.children.length; n++) {
        const s = e.children[n];
        this.add(s.clone());
      }
    return this;
  }
}
dt.DEFAULT_UP = new F(0, 1, 0);
dt.DEFAULT_MATRIX_AUTO_UPDATE = !0;
dt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
class hs extends dt {
  constructor() {
    (super(), (this.isGroup = !0), (this.type = "Group"));
  }
}
const ou = { type: "move" };
class yr {
  constructor() {
    ((this._targetRay = null), (this._grip = null), (this._hand = null));
  }
  getHandSpace() {
    return (
      this._hand === null &&
        ((this._hand = new hs()),
        (this._hand.matrixAutoUpdate = !1),
        (this._hand.visible = !1),
        (this._hand.joints = {}),
        (this._hand.inputState = { pinching: !1 })),
      this._hand
    );
  }
  getTargetRaySpace() {
    return (
      this._targetRay === null &&
        ((this._targetRay = new hs()),
        (this._targetRay.matrixAutoUpdate = !1),
        (this._targetRay.visible = !1),
        (this._targetRay.hasLinearVelocity = !1),
        (this._targetRay.linearVelocity = new F()),
        (this._targetRay.hasAngularVelocity = !1),
        (this._targetRay.angularVelocity = new F())),
      this._targetRay
    );
  }
  getGripSpace() {
    return (
      this._grip === null &&
        ((this._grip = new hs()),
        (this._grip.matrixAutoUpdate = !1),
        (this._grip.visible = !1),
        (this._grip.hasLinearVelocity = !1),
        (this._grip.linearVelocity = new F()),
        (this._grip.hasAngularVelocity = !1),
        (this._grip.angularVelocity = new F()),
        (this._grip.eventsEnabled = !1)),
      this._grip
    );
  }
  dispatchEvent(e) {
    return (
      this._targetRay !== null && this._targetRay.dispatchEvent(e),
      this._grip !== null && this._grip.dispatchEvent(e),
      this._hand !== null && this._hand.dispatchEvent(e),
      this
    );
  }
  connect(e) {
    if (e && e.hand) {
      const t = this._hand;
      if (t) for (const n of e.hand.values()) this._getHandJoint(t, n);
    }
    return (this.dispatchEvent({ type: "connected", data: e }), this);
  }
  disconnect(e) {
    return (
      this.dispatchEvent({ type: "disconnected", data: e }),
      this._targetRay !== null && (this._targetRay.visible = !1),
      this._grip !== null && (this._grip.visible = !1),
      this._hand !== null && (this._hand.visible = !1),
      this
    );
  }
  update(e, t, n) {
    let s = null,
      r = null,
      a = null;
    const o = this._targetRay,
      c = this._grip,
      l = this._hand;
    if (e && t.session.visibilityState !== "visible-blurred") {
      if (l && e.hand) {
        a = !0;
        for (const M of e.hand.values()) {
          const m = t.getJointPose(M, n),
            p = this._getHandJoint(l, M);
          (m !== null &&
            (p.matrix.fromArray(m.transform.matrix),
            p.matrix.decompose(p.position, p.rotation, p.scale),
            (p.matrixWorldNeedsUpdate = !0),
            (p.jointRadius = m.radius)),
            (p.visible = m !== null));
        }
        const u = l.joints["index-finger-tip"],
          d = l.joints["thumb-tip"],
          h = u.position.distanceTo(d.position),
          f = 0.02,
          g = 0.005;
        l.inputState.pinching && h > f + g
          ? ((l.inputState.pinching = !1),
            this.dispatchEvent({ type: "pinchend", handedness: e.handedness, target: this }))
          : !l.inputState.pinching &&
            h <= f - g &&
            ((l.inputState.pinching = !0),
            this.dispatchEvent({ type: "pinchstart", handedness: e.handedness, target: this }));
      } else
        c !== null &&
          e.gripSpace &&
          ((r = t.getPose(e.gripSpace, n)),
          r !== null &&
            (c.matrix.fromArray(r.transform.matrix),
            c.matrix.decompose(c.position, c.rotation, c.scale),
            (c.matrixWorldNeedsUpdate = !0),
            r.linearVelocity
              ? ((c.hasLinearVelocity = !0), c.linearVelocity.copy(r.linearVelocity))
              : (c.hasLinearVelocity = !1),
            r.angularVelocity
              ? ((c.hasAngularVelocity = !0), c.angularVelocity.copy(r.angularVelocity))
              : (c.hasAngularVelocity = !1),
            c.eventsEnabled && c.dispatchEvent({ type: "gripUpdated", data: e, target: this })));
      o !== null &&
        ((s = t.getPose(e.targetRaySpace, n)),
        s === null && r !== null && (s = r),
        s !== null &&
          (o.matrix.fromArray(s.transform.matrix),
          o.matrix.decompose(o.position, o.rotation, o.scale),
          (o.matrixWorldNeedsUpdate = !0),
          s.linearVelocity
            ? ((o.hasLinearVelocity = !0), o.linearVelocity.copy(s.linearVelocity))
            : (o.hasLinearVelocity = !1),
          s.angularVelocity
            ? ((o.hasAngularVelocity = !0), o.angularVelocity.copy(s.angularVelocity))
            : (o.hasAngularVelocity = !1),
          this.dispatchEvent(ou)));
    }
    return (
      o !== null && (o.visible = s !== null),
      c !== null && (c.visible = r !== null),
      l !== null && (l.visible = a !== null),
      this
    );
  }
  _getHandJoint(e, t) {
    if (e.joints[t.jointName] === void 0) {
      const n = new hs();
      ((n.matrixAutoUpdate = !1), (n.visible = !1), (e.joints[t.jointName] = n), e.add(n));
    }
    return e.joints[t.jointName];
  }
}
const oc = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
  },
  Dn = { h: 0, s: 0, l: 0 },
  us = { h: 0, s: 0, l: 0 };
function br(i, e, t) {
  return (
    t < 0 && (t += 1),
    t > 1 && (t -= 1),
    t < 1 / 6 ? i + (e - i) * 6 * t : t < 1 / 2 ? e : t < 2 / 3 ? i + (e - i) * 6 * (2 / 3 - t) : i
  );
}
class Ce {
  constructor(e, t, n) {
    return ((this.isColor = !0), (this.r = 1), (this.g = 1), (this.b = 1), this.set(e, t, n));
  }
  set(e, t, n) {
    if (t === void 0 && n === void 0) {
      const s = e;
      s && s.isColor ? this.copy(s) : typeof s == "number" ? this.setHex(s) : typeof s == "string" && this.setStyle(s);
    } else this.setRGB(e, t, n);
    return this;
  }
  setScalar(e) {
    return ((this.r = e), (this.g = e), (this.b = e), this);
  }
  setHex(e, t = kt) {
    return (
      (e = Math.floor(e)),
      (this.r = ((e >> 16) & 255) / 255),
      (this.g = ((e >> 8) & 255) / 255),
      (this.b = (e & 255) / 255),
      We.colorSpaceToWorking(this, t),
      this
    );
  }
  setRGB(e, t, n, s = We.workingColorSpace) {
    return ((this.r = e), (this.g = t), (this.b = n), We.colorSpaceToWorking(this, s), this);
  }
  setHSL(e, t, n, s = We.workingColorSpace) {
    if (((e = no(e, 1)), (t = Fe(t, 0, 1)), (n = Fe(n, 0, 1)), t === 0)) this.r = this.g = this.b = n;
    else {
      const r = n <= 0.5 ? n * (1 + t) : n + t - n * t,
        a = 2 * n - r;
      ((this.r = br(a, r, e + 1 / 3)), (this.g = br(a, r, e)), (this.b = br(a, r, e - 1 / 3)));
    }
    return (We.colorSpaceToWorking(this, s), this);
  }
  setStyle(e, t = kt) {
    function n(r) {
      r !== void 0 && parseFloat(r) < 1 && xe("Color: Alpha component of " + e + " will be ignored.");
    }
    let s;
    if ((s = /^(\w+)\(([^\)]*)\)/.exec(e))) {
      let r;
      const a = s[1],
        o = s[2];
      switch (a) {
        case "rgb":
        case "rgba":
          if ((r = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)))
            return (
              n(r[4]),
              this.setRGB(
                Math.min(255, parseInt(r[1], 10)) / 255,
                Math.min(255, parseInt(r[2], 10)) / 255,
                Math.min(255, parseInt(r[3], 10)) / 255,
                t,
              )
            );
          if ((r = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)))
            return (
              n(r[4]),
              this.setRGB(
                Math.min(100, parseInt(r[1], 10)) / 100,
                Math.min(100, parseInt(r[2], 10)) / 100,
                Math.min(100, parseInt(r[3], 10)) / 100,
                t,
              )
            );
          break;
        case "hsl":
        case "hsla":
          if ((r = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)))
            return (n(r[4]), this.setHSL(parseFloat(r[1]) / 360, parseFloat(r[2]) / 100, parseFloat(r[3]) / 100, t));
          break;
        default:
          xe("Color: Unknown color model " + e);
      }
    } else if ((s = /^\#([A-Fa-f\d]+)$/.exec(e))) {
      const r = s[1],
        a = r.length;
      if (a === 3)
        return this.setRGB(
          parseInt(r.charAt(0), 16) / 15,
          parseInt(r.charAt(1), 16) / 15,
          parseInt(r.charAt(2), 16) / 15,
          t,
        );
      if (a === 6) return this.setHex(parseInt(r, 16), t);
      xe("Color: Invalid hex color " + e);
    } else if (e && e.length > 0) return this.setColorName(e, t);
    return this;
  }
  setColorName(e, t = kt) {
    const n = oc[e.toLowerCase()];
    return (n !== void 0 ? this.setHex(n, t) : xe("Color: Unknown color " + e), this);
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(e) {
    return ((this.r = e.r), (this.g = e.g), (this.b = e.b), this);
  }
  copySRGBToLinear(e) {
    return ((this.r = bn(e.r)), (this.g = bn(e.g)), (this.b = bn(e.b)), this);
  }
  copyLinearToSRGB(e) {
    return ((this.r = yi(e.r)), (this.g = yi(e.g)), (this.b = yi(e.b)), this);
  }
  convertSRGBToLinear() {
    return (this.copySRGBToLinear(this), this);
  }
  convertLinearToSRGB() {
    return (this.copyLinearToSRGB(this), this);
  }
  getHex(e = kt) {
    return (
      We.workingToColorSpace(wt.copy(this), e),
      Math.round(Fe(wt.r * 255, 0, 255)) * 65536 +
        Math.round(Fe(wt.g * 255, 0, 255)) * 256 +
        Math.round(Fe(wt.b * 255, 0, 255))
    );
  }
  getHexString(e = kt) {
    return ("000000" + this.getHex(e).toString(16)).slice(-6);
  }
  getHSL(e, t = We.workingColorSpace) {
    We.workingToColorSpace(wt.copy(this), t);
    const n = wt.r,
      s = wt.g,
      r = wt.b,
      a = Math.max(n, s, r),
      o = Math.min(n, s, r);
    let c, l;
    const u = (o + a) / 2;
    if (o === a) ((c = 0), (l = 0));
    else {
      const d = a - o;
      switch (((l = u <= 0.5 ? d / (a + o) : d / (2 - a - o)), a)) {
        case n:
          c = (s - r) / d + (s < r ? 6 : 0);
          break;
        case s:
          c = (r - n) / d + 2;
          break;
        case r:
          c = (n - s) / d + 4;
          break;
      }
      c /= 6;
    }
    return ((e.h = c), (e.s = l), (e.l = u), e);
  }
  getRGB(e, t = We.workingColorSpace) {
    return (We.workingToColorSpace(wt.copy(this), t), (e.r = wt.r), (e.g = wt.g), (e.b = wt.b), e);
  }
  getStyle(e = kt) {
    We.workingToColorSpace(wt.copy(this), e);
    const t = wt.r,
      n = wt.g,
      s = wt.b;
    return e !== kt
      ? `color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`
      : `rgb(${Math.round(t * 255)},${Math.round(n * 255)},${Math.round(s * 255)})`;
  }
  offsetHSL(e, t, n) {
    return (this.getHSL(Dn), this.setHSL(Dn.h + e, Dn.s + t, Dn.l + n));
  }
  add(e) {
    return ((this.r += e.r), (this.g += e.g), (this.b += e.b), this);
  }
  addColors(e, t) {
    return ((this.r = e.r + t.r), (this.g = e.g + t.g), (this.b = e.b + t.b), this);
  }
  addScalar(e) {
    return ((this.r += e), (this.g += e), (this.b += e), this);
  }
  sub(e) {
    return (
      (this.r = Math.max(0, this.r - e.r)),
      (this.g = Math.max(0, this.g - e.g)),
      (this.b = Math.max(0, this.b - e.b)),
      this
    );
  }
  multiply(e) {
    return ((this.r *= e.r), (this.g *= e.g), (this.b *= e.b), this);
  }
  multiplyScalar(e) {
    return ((this.r *= e), (this.g *= e), (this.b *= e), this);
  }
  lerp(e, t) {
    return ((this.r += (e.r - this.r) * t), (this.g += (e.g - this.g) * t), (this.b += (e.b - this.b) * t), this);
  }
  lerpColors(e, t, n) {
    return ((this.r = e.r + (t.r - e.r) * n), (this.g = e.g + (t.g - e.g) * n), (this.b = e.b + (t.b - e.b) * n), this);
  }
  lerpHSL(e, t) {
    (this.getHSL(Dn), e.getHSL(us));
    const n = Yi(Dn.h, us.h, t),
      s = Yi(Dn.s, us.s, t),
      r = Yi(Dn.l, us.l, t);
    return (this.setHSL(n, s, r), this);
  }
  setFromVector3(e) {
    return ((this.r = e.x), (this.g = e.y), (this.b = e.z), this);
  }
  applyMatrix3(e) {
    const t = this.r,
      n = this.g,
      s = this.b,
      r = e.elements;
    return (
      (this.r = r[0] * t + r[3] * n + r[6] * s),
      (this.g = r[1] * t + r[4] * n + r[7] * s),
      (this.b = r[2] * t + r[5] * n + r[8] * s),
      this
    );
  }
  equals(e) {
    return e.r === this.r && e.g === this.g && e.b === this.b;
  }
  fromArray(e, t = 0) {
    return ((this.r = e[t]), (this.g = e[t + 1]), (this.b = e[t + 2]), this);
  }
  toArray(e = [], t = 0) {
    return ((e[t] = this.r), (e[t + 1] = this.g), (e[t + 2] = this.b), e);
  }
  fromBufferAttribute(e, t) {
    return ((this.r = e.getX(t)), (this.g = e.getY(t)), (this.b = e.getZ(t)), this);
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    (yield this.r, yield this.g, yield this.b);
  }
}
const wt = new Ce();
Ce.NAMES = oc;
class A_ extends dt {
  constructor() {
    (super(),
      (this.isScene = !0),
      (this.type = "Scene"),
      (this.background = null),
      (this.environment = null),
      (this.fog = null),
      (this.backgroundBlurriness = 0),
      (this.backgroundIntensity = 1),
      (this.backgroundRotation = new un()),
      (this.environmentIntensity = 1),
      (this.environmentRotation = new un()),
      (this.overrideMaterial = null),
      typeof __THREE_DEVTOOLS__ < "u" &&
        __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this })));
  }
  copy(e, t) {
    return (
      super.copy(e, t),
      e.background !== null && (this.background = e.background.clone()),
      e.environment !== null && (this.environment = e.environment.clone()),
      e.fog !== null && (this.fog = e.fog.clone()),
      (this.backgroundBlurriness = e.backgroundBlurriness),
      (this.backgroundIntensity = e.backgroundIntensity),
      this.backgroundRotation.copy(e.backgroundRotation),
      (this.environmentIntensity = e.environmentIntensity),
      this.environmentRotation.copy(e.environmentRotation),
      e.overrideMaterial !== null && (this.overrideMaterial = e.overrideMaterial.clone()),
      (this.matrixAutoUpdate = e.matrixAutoUpdate),
      this
    );
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return (
      this.fog !== null && (t.object.fog = this.fog.toJSON()),
      this.backgroundBlurriness > 0 && (t.object.backgroundBlurriness = this.backgroundBlurriness),
      this.backgroundIntensity !== 1 && (t.object.backgroundIntensity = this.backgroundIntensity),
      (t.object.backgroundRotation = this.backgroundRotation.toArray()),
      this.environmentIntensity !== 1 && (t.object.environmentIntensity = this.environmentIntensity),
      (t.object.environmentRotation = this.environmentRotation.toArray()),
      t
    );
  }
}
const Yt = new F(),
  mn = new F(),
  Er = new F(),
  gn = new F(),
  li = new F(),
  ci = new F(),
  Wo = new F(),
  Tr = new F(),
  Ar = new F(),
  wr = new F(),
  Rr = new it(),
  Cr = new it(),
  Pr = new it();
class jt {
  constructor(e = new F(), t = new F(), n = new F()) {
    ((this.a = e), (this.b = t), (this.c = n));
  }
  static getNormal(e, t, n, s) {
    (s.subVectors(n, t), Yt.subVectors(e, t), s.cross(Yt));
    const r = s.lengthSq();
    return r > 0 ? s.multiplyScalar(1 / Math.sqrt(r)) : s.set(0, 0, 0);
  }
  static getBarycoord(e, t, n, s, r) {
    (Yt.subVectors(s, t), mn.subVectors(n, t), Er.subVectors(e, t));
    const a = Yt.dot(Yt),
      o = Yt.dot(mn),
      c = Yt.dot(Er),
      l = mn.dot(mn),
      u = mn.dot(Er),
      d = a * l - o * o;
    if (d === 0) return (r.set(0, 0, 0), null);
    const h = 1 / d,
      f = (l * c - o * u) * h,
      g = (a * u - o * c) * h;
    return r.set(1 - f - g, g, f);
  }
  static containsPoint(e, t, n, s) {
    return this.getBarycoord(e, t, n, s, gn) === null ? !1 : gn.x >= 0 && gn.y >= 0 && gn.x + gn.y <= 1;
  }
  static getInterpolation(e, t, n, s, r, a, o, c) {
    return this.getBarycoord(e, t, n, s, gn) === null
      ? ((c.x = 0), (c.y = 0), "z" in c && (c.z = 0), "w" in c && (c.w = 0), null)
      : (c.setScalar(0), c.addScaledVector(r, gn.x), c.addScaledVector(a, gn.y), c.addScaledVector(o, gn.z), c);
  }
  static getInterpolatedAttribute(e, t, n, s, r, a) {
    return (
      Rr.setScalar(0),
      Cr.setScalar(0),
      Pr.setScalar(0),
      Rr.fromBufferAttribute(e, t),
      Cr.fromBufferAttribute(e, n),
      Pr.fromBufferAttribute(e, s),
      a.setScalar(0),
      a.addScaledVector(Rr, r.x),
      a.addScaledVector(Cr, r.y),
      a.addScaledVector(Pr, r.z),
      a
    );
  }
  static isFrontFacing(e, t, n, s) {
    return (Yt.subVectors(n, t), mn.subVectors(e, t), Yt.cross(mn).dot(s) < 0);
  }
  set(e, t, n) {
    return (this.a.copy(e), this.b.copy(t), this.c.copy(n), this);
  }
  setFromPointsAndIndices(e, t, n, s) {
    return (this.a.copy(e[t]), this.b.copy(e[n]), this.c.copy(e[s]), this);
  }
  setFromAttributeAndIndices(e, t, n, s) {
    return (this.a.fromBufferAttribute(e, t), this.b.fromBufferAttribute(e, n), this.c.fromBufferAttribute(e, s), this);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return (this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this);
  }
  getArea() {
    return (Yt.subVectors(this.c, this.b), mn.subVectors(this.a, this.b), Yt.cross(mn).length() * 0.5);
  }
  getMidpoint(e) {
    return e
      .addVectors(this.a, this.b)
      .add(this.c)
      .multiplyScalar(1 / 3);
  }
  getNormal(e) {
    return jt.getNormal(this.a, this.b, this.c, e);
  }
  getPlane(e) {
    return e.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(e, t) {
    return jt.getBarycoord(e, this.a, this.b, this.c, t);
  }
  getInterpolation(e, t, n, s, r) {
    return jt.getInterpolation(e, this.a, this.b, this.c, t, n, s, r);
  }
  containsPoint(e) {
    return jt.containsPoint(e, this.a, this.b, this.c);
  }
  isFrontFacing(e) {
    return jt.isFrontFacing(this.a, this.b, this.c, e);
  }
  intersectsBox(e) {
    return e.intersectsTriangle(this);
  }
  closestPointToPoint(e, t) {
    const n = this.a,
      s = this.b,
      r = this.c;
    let a, o;
    (li.subVectors(s, n), ci.subVectors(r, n), Tr.subVectors(e, n));
    const c = li.dot(Tr),
      l = ci.dot(Tr);
    if (c <= 0 && l <= 0) return t.copy(n);
    Ar.subVectors(e, s);
    const u = li.dot(Ar),
      d = ci.dot(Ar);
    if (u >= 0 && d <= u) return t.copy(s);
    const h = c * d - u * l;
    if (h <= 0 && c >= 0 && u <= 0) return ((a = c / (c - u)), t.copy(n).addScaledVector(li, a));
    wr.subVectors(e, r);
    const f = li.dot(wr),
      g = ci.dot(wr);
    if (g >= 0 && f <= g) return t.copy(r);
    const M = f * l - c * g;
    if (M <= 0 && l >= 0 && g <= 0) return ((o = l / (l - g)), t.copy(n).addScaledVector(ci, o));
    const m = u * g - f * d;
    if (m <= 0 && d - u >= 0 && f - g >= 0)
      return (Wo.subVectors(r, s), (o = (d - u) / (d - u + (f - g))), t.copy(s).addScaledVector(Wo, o));
    const p = 1 / (m + M + h);
    return ((a = M * p), (o = h * p), t.copy(n).addScaledVector(li, a).addScaledVector(ci, o));
  }
  equals(e) {
    return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
  }
}
class Gn {
  constructor(e = new F(1 / 0, 1 / 0, 1 / 0), t = new F(-1 / 0, -1 / 0, -1 / 0)) {
    ((this.isBox3 = !0), (this.min = e), (this.max = t));
  }
  set(e, t) {
    return (this.min.copy(e), this.max.copy(t), this);
  }
  setFromArray(e) {
    this.makeEmpty();
    for (let t = 0, n = e.length; t < n; t += 3) this.expandByPoint(Zt.fromArray(e, t));
    return this;
  }
  setFromBufferAttribute(e) {
    this.makeEmpty();
    for (let t = 0, n = e.count; t < n; t++) this.expandByPoint(Zt.fromBufferAttribute(e, t));
    return this;
  }
  setFromPoints(e) {
    this.makeEmpty();
    for (let t = 0, n = e.length; t < n; t++) this.expandByPoint(e[t]);
    return this;
  }
  setFromCenterAndSize(e, t) {
    const n = Zt.copy(t).multiplyScalar(0.5);
    return (this.min.copy(e).sub(n), this.max.copy(e).add(n), this);
  }
  setFromObject(e, t = !1) {
    return (this.makeEmpty(), this.expandByObject(e, t));
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return (this.min.copy(e.min), this.max.copy(e.max), this);
  }
  makeEmpty() {
    return ((this.min.x = this.min.y = this.min.z = 1 / 0), (this.max.x = this.max.y = this.max.z = -1 / 0), this);
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  getCenter(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
  }
  expandByPoint(e) {
    return (this.min.min(e), this.max.max(e), this);
  }
  expandByVector(e) {
    return (this.min.sub(e), this.max.add(e), this);
  }
  expandByScalar(e) {
    return (this.min.addScalar(-e), this.max.addScalar(e), this);
  }
  expandByObject(e, t = !1) {
    e.updateWorldMatrix(!1, !1);
    const n = e.geometry;
    if (n !== void 0) {
      const r = n.getAttribute("position");
      if (t === !0 && r !== void 0 && e.isInstancedMesh !== !0)
        for (let a = 0, o = r.count; a < o; a++)
          (e.isMesh === !0 ? e.getVertexPosition(a, Zt) : Zt.fromBufferAttribute(r, a),
            Zt.applyMatrix4(e.matrixWorld),
            this.expandByPoint(Zt));
      else
        (e.boundingBox !== void 0
          ? (e.boundingBox === null && e.computeBoundingBox(), ds.copy(e.boundingBox))
          : (n.boundingBox === null && n.computeBoundingBox(), ds.copy(n.boundingBox)),
          ds.applyMatrix4(e.matrixWorld),
          this.union(ds));
    }
    const s = e.children;
    for (let r = 0, a = s.length; r < a; r++) this.expandByObject(s[r], t);
    return this;
  }
  containsPoint(e) {
    return (
      e.x >= this.min.x &&
      e.x <= this.max.x &&
      e.y >= this.min.y &&
      e.y <= this.max.y &&
      e.z >= this.min.z &&
      e.z <= this.max.z
    );
  }
  containsBox(e) {
    return (
      this.min.x <= e.min.x &&
      e.max.x <= this.max.x &&
      this.min.y <= e.min.y &&
      e.max.y <= this.max.y &&
      this.min.z <= e.min.z &&
      e.max.z <= this.max.z
    );
  }
  getParameter(e, t) {
    return t.set(
      (e.x - this.min.x) / (this.max.x - this.min.x),
      (e.y - this.min.y) / (this.max.y - this.min.y),
      (e.z - this.min.z) / (this.max.z - this.min.z),
    );
  }
  intersectsBox(e) {
    return (
      e.max.x >= this.min.x &&
      e.min.x <= this.max.x &&
      e.max.y >= this.min.y &&
      e.min.y <= this.max.y &&
      e.max.z >= this.min.z &&
      e.min.z <= this.max.z
    );
  }
  intersectsSphere(e) {
    return (this.clampPoint(e.center, Zt), Zt.distanceToSquared(e.center) <= e.radius * e.radius);
  }
  intersectsPlane(e) {
    let t, n;
    return (
      e.normal.x > 0
        ? ((t = e.normal.x * this.min.x), (n = e.normal.x * this.max.x))
        : ((t = e.normal.x * this.max.x), (n = e.normal.x * this.min.x)),
      e.normal.y > 0
        ? ((t += e.normal.y * this.min.y), (n += e.normal.y * this.max.y))
        : ((t += e.normal.y * this.max.y), (n += e.normal.y * this.min.y)),
      e.normal.z > 0
        ? ((t += e.normal.z * this.min.z), (n += e.normal.z * this.max.z))
        : ((t += e.normal.z * this.max.z), (n += e.normal.z * this.min.z)),
      t <= -e.constant && n >= -e.constant
    );
  }
  intersectsTriangle(e) {
    if (this.isEmpty()) return !1;
    (this.getCenter(Ui),
      fs.subVectors(this.max, Ui),
      hi.subVectors(e.a, Ui),
      ui.subVectors(e.b, Ui),
      di.subVectors(e.c, Ui),
      Un.subVectors(ui, hi),
      Nn.subVectors(di, ui),
      Wn.subVectors(hi, di));
    let t = [
      0,
      -Un.z,
      Un.y,
      0,
      -Nn.z,
      Nn.y,
      0,
      -Wn.z,
      Wn.y,
      Un.z,
      0,
      -Un.x,
      Nn.z,
      0,
      -Nn.x,
      Wn.z,
      0,
      -Wn.x,
      -Un.y,
      Un.x,
      0,
      -Nn.y,
      Nn.x,
      0,
      -Wn.y,
      Wn.x,
      0,
    ];
    return !Ir(t, hi, ui, di, fs) || ((t = [1, 0, 0, 0, 1, 0, 0, 0, 1]), !Ir(t, hi, ui, di, fs))
      ? !1
      : (ps.crossVectors(Un, Nn), (t = [ps.x, ps.y, ps.z]), Ir(t, hi, ui, di, fs));
  }
  clampPoint(e, t) {
    return t.copy(e).clamp(this.min, this.max);
  }
  distanceToPoint(e) {
    return this.clampPoint(e, Zt).distanceTo(e);
  }
  getBoundingSphere(e) {
    return (
      this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), (e.radius = this.getSize(Zt).length() * 0.5)),
      e
    );
  }
  intersect(e) {
    return (this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this);
  }
  union(e) {
    return (this.min.min(e.min), this.max.max(e.max), this);
  }
  applyMatrix4(e) {
    return this.isEmpty()
      ? this
      : (_n[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e),
        _n[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e),
        _n[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e),
        _n[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e),
        _n[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e),
        _n[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e),
        _n[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e),
        _n[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e),
        this.setFromPoints(_n),
        this);
  }
  translate(e) {
    return (this.min.add(e), this.max.add(e), this);
  }
  equals(e) {
    return e.min.equals(this.min) && e.max.equals(this.max);
  }
  toJSON() {
    return { min: this.min.toArray(), max: this.max.toArray() };
  }
  fromJSON(e) {
    return (this.min.fromArray(e.min), this.max.fromArray(e.max), this);
  }
}
const _n = [new F(), new F(), new F(), new F(), new F(), new F(), new F(), new F()],
  Zt = new F(),
  ds = new Gn(),
  hi = new F(),
  ui = new F(),
  di = new F(),
  Un = new F(),
  Nn = new F(),
  Wn = new F(),
  Ui = new F(),
  fs = new F(),
  ps = new F(),
  Xn = new F();
function Ir(i, e, t, n, s) {
  for (let r = 0, a = i.length - 3; r <= a; r += 3) {
    Xn.fromArray(i, r);
    const o = s.x * Math.abs(Xn.x) + s.y * Math.abs(Xn.y) + s.z * Math.abs(Xn.z),
      c = e.dot(Xn),
      l = t.dot(Xn),
      u = n.dot(Xn);
    if (Math.max(-Math.max(c, l, u), Math.min(c, l, u)) > o) return !1;
  }
  return !0;
}
const gt = new F(),
  ms = new Ge();
let lu = 0;
class Wt extends An {
  constructor(e, t, n = !1) {
    if ((super(), Array.isArray(e))) throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    ((this.isBufferAttribute = !0),
      Object.defineProperty(this, "id", { value: lu++ }),
      (this.name = ""),
      (this.array = e),
      (this.itemSize = t),
      (this.count = e !== void 0 ? e.length / t : 0),
      (this.normalized = n),
      (this.usage = Ba),
      (this.updateRanges = []),
      (this.gpuType = Gt),
      (this.version = 0));
  }
  onUploadCallback() {}
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  setUsage(e) {
    return ((this.usage = e), this);
  }
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(e) {
    return (
      (this.name = e.name),
      (this.array = new e.array.constructor(e.array)),
      (this.itemSize = e.itemSize),
      (this.count = e.count),
      (this.normalized = e.normalized),
      (this.usage = e.usage),
      (this.gpuType = e.gpuType),
      this
    );
  }
  copyAt(e, t, n) {
    ((e *= this.itemSize), (n *= t.itemSize));
    for (let s = 0, r = this.itemSize; s < r; s++) this.array[e + s] = t.array[n + s];
    return this;
  }
  copyArray(e) {
    return (this.array.set(e), this);
  }
  applyMatrix3(e) {
    if (this.itemSize === 2)
      for (let t = 0, n = this.count; t < n; t++)
        (ms.fromBufferAttribute(this, t), ms.applyMatrix3(e), this.setXY(t, ms.x, ms.y));
    else if (this.itemSize === 3)
      for (let t = 0, n = this.count; t < n; t++)
        (gt.fromBufferAttribute(this, t), gt.applyMatrix3(e), this.setXYZ(t, gt.x, gt.y, gt.z));
    return this;
  }
  applyMatrix4(e) {
    for (let t = 0, n = this.count; t < n; t++)
      (gt.fromBufferAttribute(this, t), gt.applyMatrix4(e), this.setXYZ(t, gt.x, gt.y, gt.z));
    return this;
  }
  applyNormalMatrix(e) {
    for (let t = 0, n = this.count; t < n; t++)
      (gt.fromBufferAttribute(this, t), gt.applyNormalMatrix(e), this.setXYZ(t, gt.x, gt.y, gt.z));
    return this;
  }
  transformDirection(e) {
    for (let t = 0, n = this.count; t < n; t++)
      (gt.fromBufferAttribute(this, t), gt.transformDirection(e), this.setXYZ(t, gt.x, gt.y, gt.z));
    return this;
  }
  set(e, t = 0) {
    return (this.array.set(e, t), this);
  }
  getComponent(e, t) {
    let n = this.array[e * this.itemSize + t];
    return (this.normalized && (n = Kt(n, this.array)), n);
  }
  setComponent(e, t, n) {
    return (this.normalized && (n = Ke(n, this.array)), (this.array[e * this.itemSize + t] = n), this);
  }
  getX(e) {
    let t = this.array[e * this.itemSize];
    return (this.normalized && (t = Kt(t, this.array)), t);
  }
  setX(e, t) {
    return (this.normalized && (t = Ke(t, this.array)), (this.array[e * this.itemSize] = t), this);
  }
  getY(e) {
    let t = this.array[e * this.itemSize + 1];
    return (this.normalized && (t = Kt(t, this.array)), t);
  }
  setY(e, t) {
    return (this.normalized && (t = Ke(t, this.array)), (this.array[e * this.itemSize + 1] = t), this);
  }
  getZ(e) {
    let t = this.array[e * this.itemSize + 2];
    return (this.normalized && (t = Kt(t, this.array)), t);
  }
  setZ(e, t) {
    return (this.normalized && (t = Ke(t, this.array)), (this.array[e * this.itemSize + 2] = t), this);
  }
  getW(e) {
    let t = this.array[e * this.itemSize + 3];
    return (this.normalized && (t = Kt(t, this.array)), t);
  }
  setW(e, t) {
    return (this.normalized && (t = Ke(t, this.array)), (this.array[e * this.itemSize + 3] = t), this);
  }
  setXY(e, t, n) {
    return (
      (e *= this.itemSize),
      this.normalized && ((t = Ke(t, this.array)), (n = Ke(n, this.array))),
      (this.array[e + 0] = t),
      (this.array[e + 1] = n),
      this
    );
  }
  setXYZ(e, t, n, s) {
    return (
      (e *= this.itemSize),
      this.normalized && ((t = Ke(t, this.array)), (n = Ke(n, this.array)), (s = Ke(s, this.array))),
      (this.array[e + 0] = t),
      (this.array[e + 1] = n),
      (this.array[e + 2] = s),
      this
    );
  }
  setXYZW(e, t, n, s, r) {
    return (
      (e *= this.itemSize),
      this.normalized &&
        ((t = Ke(t, this.array)), (n = Ke(n, this.array)), (s = Ke(s, this.array)), (r = Ke(r, this.array))),
      (this.array[e + 0] = t),
      (this.array[e + 1] = n),
      (this.array[e + 2] = s),
      (this.array[e + 3] = r),
      this
    );
  }
  onUpload(e) {
    return ((this.onUploadCallback = e), this);
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const e = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized,
    };
    return (this.name !== "" && (e.name = this.name), this.usage !== Ba && (e.usage = this.usage), e);
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class lc extends Wt {
  constructor(e, t, n) {
    super(new Uint16Array(e), t, n);
  }
}
class cc extends Wt {
  constructor(e, t, n) {
    super(new Uint32Array(e), t, n);
  }
}
class Mt extends Wt {
  constructor(e, t, n) {
    super(new Float32Array(e), t, n);
  }
}
const cu = new Gn(),
  Ni = new F(),
  Lr = new F();
class wn {
  constructor(e = new F(), t = -1) {
    ((this.isSphere = !0), (this.center = e), (this.radius = t));
  }
  set(e, t) {
    return (this.center.copy(e), (this.radius = t), this);
  }
  setFromPoints(e, t) {
    const n = this.center;
    t !== void 0 ? n.copy(t) : cu.setFromPoints(e).getCenter(n);
    let s = 0;
    for (let r = 0, a = e.length; r < a; r++) s = Math.max(s, n.distanceToSquared(e[r]));
    return ((this.radius = Math.sqrt(s)), this);
  }
  copy(e) {
    return (this.center.copy(e.center), (this.radius = e.radius), this);
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return (this.center.set(0, 0, 0), (this.radius = -1), this);
  }
  containsPoint(e) {
    return e.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(e) {
    return e.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(e) {
    const t = this.radius + e.radius;
    return e.center.distanceToSquared(this.center) <= t * t;
  }
  intersectsBox(e) {
    return e.intersectsSphere(this);
  }
  intersectsPlane(e) {
    return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(e, t) {
    const n = this.center.distanceToSquared(e);
    return (
      t.copy(e),
      n > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)),
      t
    );
  }
  getBoundingBox(e) {
    return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
  }
  applyMatrix4(e) {
    return (this.center.applyMatrix4(e), (this.radius = this.radius * e.getMaxScaleOnAxis()), this);
  }
  translate(e) {
    return (this.center.add(e), this);
  }
  expandByPoint(e) {
    if (this.isEmpty()) return (this.center.copy(e), (this.radius = 0), this);
    Ni.subVectors(e, this.center);
    const t = Ni.lengthSq();
    if (t > this.radius * this.radius) {
      const n = Math.sqrt(t),
        s = (n - this.radius) * 0.5;
      (this.center.addScaledVector(Ni, s / n), (this.radius += s));
    }
    return this;
  }
  union(e) {
    return e.isEmpty()
      ? this
      : this.isEmpty()
        ? (this.copy(e), this)
        : (this.center.equals(e.center) === !0
            ? (this.radius = Math.max(this.radius, e.radius))
            : (Lr.subVectors(e.center, this.center).setLength(e.radius),
              this.expandByPoint(Ni.copy(e.center).add(Lr)),
              this.expandByPoint(Ni.copy(e.center).sub(Lr))),
          this);
  }
  equals(e) {
    return e.center.equals(this.center) && e.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    return { radius: this.radius, center: this.center.toArray() };
  }
  fromJSON(e) {
    return ((this.radius = e.radius), this.center.fromArray(e.center), this);
  }
}
let hu = 0;
const Vt = new He(),
  Dr = new dt(),
  fi = new F(),
  Ft = new Gn(),
  Fi = new Gn(),
  bt = new F();
class Lt extends An {
  constructor() {
    (super(),
      (this.isBufferGeometry = !0),
      Object.defineProperty(this, "id", { value: hu++ }),
      (this.uuid = Jt()),
      (this.name = ""),
      (this.type = "BufferGeometry"),
      (this.index = null),
      (this.indirect = null),
      (this.indirectOffset = 0),
      (this.attributes = {}),
      (this.morphAttributes = {}),
      (this.morphTargetsRelative = !1),
      (this.groups = []),
      (this.boundingBox = null),
      (this.boundingSphere = null),
      (this.drawRange = { start: 0, count: 1 / 0 }),
      (this.userData = {}));
  }
  getIndex() {
    return this.index;
  }
  setIndex(e) {
    return (Array.isArray(e) ? (this.index = new (Rh(e) ? cc : lc)(e, 1)) : (this.index = e), this);
  }
  setIndirect(e, t = 0) {
    return ((this.indirect = e), (this.indirectOffset = t), this);
  }
  getIndirect() {
    return this.indirect;
  }
  getAttribute(e) {
    return this.attributes[e];
  }
  setAttribute(e, t) {
    return ((this.attributes[e] = t), this);
  }
  deleteAttribute(e) {
    return (delete this.attributes[e], this);
  }
  hasAttribute(e) {
    return this.attributes[e] !== void 0;
  }
  addGroup(e, t, n = 0) {
    this.groups.push({ start: e, count: t, materialIndex: n });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(e, t) {
    ((this.drawRange.start = e), (this.drawRange.count = t));
  }
  applyMatrix4(e) {
    const t = this.attributes.position;
    t !== void 0 && (t.applyMatrix4(e), (t.needsUpdate = !0));
    const n = this.attributes.normal;
    if (n !== void 0) {
      const r = new Ie().getNormalMatrix(e);
      (n.applyNormalMatrix(r), (n.needsUpdate = !0));
    }
    const s = this.attributes.tangent;
    return (
      s !== void 0 && (s.transformDirection(e), (s.needsUpdate = !0)),
      this.boundingBox !== null && this.computeBoundingBox(),
      this.boundingSphere !== null && this.computeBoundingSphere(),
      this
    );
  }
  applyQuaternion(e) {
    return (Vt.makeRotationFromQuaternion(e), this.applyMatrix4(Vt), this);
  }
  rotateX(e) {
    return (Vt.makeRotationX(e), this.applyMatrix4(Vt), this);
  }
  rotateY(e) {
    return (Vt.makeRotationY(e), this.applyMatrix4(Vt), this);
  }
  rotateZ(e) {
    return (Vt.makeRotationZ(e), this.applyMatrix4(Vt), this);
  }
  translate(e, t, n) {
    return (Vt.makeTranslation(e, t, n), this.applyMatrix4(Vt), this);
  }
  scale(e, t, n) {
    return (Vt.makeScale(e, t, n), this.applyMatrix4(Vt), this);
  }
  lookAt(e) {
    return (Dr.lookAt(e), Dr.updateMatrix(), this.applyMatrix4(Dr.matrix), this);
  }
  center() {
    return (this.computeBoundingBox(), this.boundingBox.getCenter(fi).negate(), this.translate(fi.x, fi.y, fi.z), this);
  }
  setFromPoints(e) {
    const t = this.getAttribute("position");
    if (t === void 0) {
      const n = [];
      for (let s = 0, r = e.length; s < r; s++) {
        const a = e[s];
        n.push(a.x, a.y, a.z || 0);
      }
      this.setAttribute("position", new Mt(n, 3));
    } else {
      const n = Math.min(e.length, t.count);
      for (let s = 0; s < n; s++) {
        const r = e[s];
        t.setXYZ(s, r.x, r.y, r.z || 0);
      }
      (e.length > t.count &&
        xe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),
        (t.needsUpdate = !0));
    }
    return this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new Gn());
    const e = this.attributes.position,
      t = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      (Te("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this),
        this.boundingBox.set(new F(-1 / 0, -1 / 0, -1 / 0), new F(1 / 0, 1 / 0, 1 / 0)));
      return;
    }
    if (e !== void 0) {
      if ((this.boundingBox.setFromBufferAttribute(e), t))
        for (let n = 0, s = t.length; n < s; n++) {
          const r = t[n];
          (Ft.setFromBufferAttribute(r),
            this.morphTargetsRelative
              ? (bt.addVectors(this.boundingBox.min, Ft.min),
                this.boundingBox.expandByPoint(bt),
                bt.addVectors(this.boundingBox.max, Ft.max),
                this.boundingBox.expandByPoint(bt))
              : (this.boundingBox.expandByPoint(Ft.min), this.boundingBox.expandByPoint(Ft.max)));
        }
    } else this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) &&
      Te(
        'BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',
        this,
      );
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new wn());
    const e = this.attributes.position,
      t = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      (Te("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this),
        this.boundingSphere.set(new F(), 1 / 0));
      return;
    }
    if (e) {
      const n = this.boundingSphere.center;
      if ((Ft.setFromBufferAttribute(e), t))
        for (let r = 0, a = t.length; r < a; r++) {
          const o = t[r];
          (Fi.setFromBufferAttribute(o),
            this.morphTargetsRelative
              ? (bt.addVectors(Ft.min, Fi.min),
                Ft.expandByPoint(bt),
                bt.addVectors(Ft.max, Fi.max),
                Ft.expandByPoint(bt))
              : (Ft.expandByPoint(Fi.min), Ft.expandByPoint(Fi.max)));
        }
      Ft.getCenter(n);
      let s = 0;
      for (let r = 0, a = e.count; r < a; r++)
        (bt.fromBufferAttribute(e, r), (s = Math.max(s, n.distanceToSquared(bt))));
      if (t)
        for (let r = 0, a = t.length; r < a; r++) {
          const o = t[r],
            c = this.morphTargetsRelative;
          for (let l = 0, u = o.count; l < u; l++)
            (bt.fromBufferAttribute(o, l),
              c && (fi.fromBufferAttribute(e, l), bt.add(fi)),
              (s = Math.max(s, n.distanceToSquared(bt))));
        }
      ((this.boundingSphere.radius = Math.sqrt(s)),
        isNaN(this.boundingSphere.radius) &&
          Te(
            'BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',
            this,
          ));
    }
  }
  computeTangents() {
    const e = this.index,
      t = this.attributes;
    if (e === null || t.position === void 0 || t.normal === void 0 || t.uv === void 0) {
      Te("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const n = t.position,
      s = t.normal,
      r = t.uv;
    this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new Wt(new Float32Array(4 * n.count), 4));
    const a = this.getAttribute("tangent"),
      o = [],
      c = [];
    for (let x = 0; x < n.count; x++) ((o[x] = new F()), (c[x] = new F()));
    const l = new F(),
      u = new F(),
      d = new F(),
      h = new Ge(),
      f = new Ge(),
      g = new Ge(),
      M = new F(),
      m = new F();
    function p(x, A, L) {
      (l.fromBufferAttribute(n, x),
        u.fromBufferAttribute(n, A),
        d.fromBufferAttribute(n, L),
        h.fromBufferAttribute(r, x),
        f.fromBufferAttribute(r, A),
        g.fromBufferAttribute(r, L),
        u.sub(l),
        d.sub(l),
        f.sub(h),
        g.sub(h));
      const w = 1 / (f.x * g.y - g.x * f.y);
      isFinite(w) &&
        (M.copy(u).multiplyScalar(g.y).addScaledVector(d, -f.y).multiplyScalar(w),
        m.copy(d).multiplyScalar(f.x).addScaledVector(u, -g.x).multiplyScalar(w),
        o[x].add(M),
        o[A].add(M),
        o[L].add(M),
        c[x].add(m),
        c[A].add(m),
        c[L].add(m));
    }
    let S = this.groups;
    S.length === 0 && (S = [{ start: 0, count: e.count }]);
    for (let x = 0, A = S.length; x < A; ++x) {
      const L = S[x],
        w = L.start,
        N = L.count;
      for (let H = w, W = w + N; H < W; H += 3) p(e.getX(H + 0), e.getX(H + 1), e.getX(H + 2));
    }
    const E = new F(),
      b = new F(),
      R = new F(),
      T = new F();
    function P(x) {
      (R.fromBufferAttribute(s, x), T.copy(R));
      const A = o[x];
      (E.copy(A), E.sub(R.multiplyScalar(R.dot(A))).normalize(), b.crossVectors(T, A));
      const w = b.dot(c[x]) < 0 ? -1 : 1;
      a.setXYZW(x, E.x, E.y, E.z, w);
    }
    for (let x = 0, A = S.length; x < A; ++x) {
      const L = S[x],
        w = L.start,
        N = L.count;
      for (let H = w, W = w + N; H < W; H += 3) (P(e.getX(H + 0)), P(e.getX(H + 1)), P(e.getX(H + 2)));
    }
  }
  computeVertexNormals() {
    const e = this.index,
      t = this.getAttribute("position");
    if (t !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0) ((n = new Wt(new Float32Array(t.count * 3), 3)), this.setAttribute("normal", n));
      else for (let h = 0, f = n.count; h < f; h++) n.setXYZ(h, 0, 0, 0);
      const s = new F(),
        r = new F(),
        a = new F(),
        o = new F(),
        c = new F(),
        l = new F(),
        u = new F(),
        d = new F();
      if (e)
        for (let h = 0, f = e.count; h < f; h += 3) {
          const g = e.getX(h + 0),
            M = e.getX(h + 1),
            m = e.getX(h + 2);
          (s.fromBufferAttribute(t, g),
            r.fromBufferAttribute(t, M),
            a.fromBufferAttribute(t, m),
            u.subVectors(a, r),
            d.subVectors(s, r),
            u.cross(d),
            o.fromBufferAttribute(n, g),
            c.fromBufferAttribute(n, M),
            l.fromBufferAttribute(n, m),
            o.add(u),
            c.add(u),
            l.add(u),
            n.setXYZ(g, o.x, o.y, o.z),
            n.setXYZ(M, c.x, c.y, c.z),
            n.setXYZ(m, l.x, l.y, l.z));
        }
      else
        for (let h = 0, f = t.count; h < f; h += 3)
          (s.fromBufferAttribute(t, h + 0),
            r.fromBufferAttribute(t, h + 1),
            a.fromBufferAttribute(t, h + 2),
            u.subVectors(a, r),
            d.subVectors(s, r),
            u.cross(d),
            n.setXYZ(h + 0, u.x, u.y, u.z),
            n.setXYZ(h + 1, u.x, u.y, u.z),
            n.setXYZ(h + 2, u.x, u.y, u.z));
      (this.normalizeNormals(), (n.needsUpdate = !0));
    }
  }
  normalizeNormals() {
    const e = this.attributes.normal;
    for (let t = 0, n = e.count; t < n; t++)
      (bt.fromBufferAttribute(e, t), bt.normalize(), e.setXYZ(t, bt.x, bt.y, bt.z));
  }
  toNonIndexed() {
    function e(o, c) {
      const l = o.array,
        u = o.itemSize,
        d = o.normalized,
        h = new l.constructor(c.length * u);
      let f = 0,
        g = 0;
      for (let M = 0, m = c.length; M < m; M++) {
        o.isInterleavedBufferAttribute ? (f = c[M] * o.data.stride + o.offset) : (f = c[M] * u);
        for (let p = 0; p < u; p++) h[g++] = l[f++];
      }
      return new Wt(h, u, d);
    }
    if (this.index === null) return (xe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this);
    const t = new Lt(),
      n = this.index.array,
      s = this.attributes;
    for (const o in s) {
      const c = s[o],
        l = e(c, n);
      t.setAttribute(o, l);
    }
    const r = this.morphAttributes;
    for (const o in r) {
      const c = [],
        l = r[o];
      for (let u = 0, d = l.length; u < d; u++) {
        const h = l[u],
          f = e(h, n);
        c.push(f);
      }
      t.morphAttributes[o] = c;
    }
    t.morphTargetsRelative = this.morphTargetsRelative;
    const a = this.groups;
    for (let o = 0, c = a.length; o < c; o++) {
      const l = a[o];
      t.addGroup(l.start, l.count, l.materialIndex);
    }
    return t;
  }
  toJSON() {
    const e = { metadata: { version: 4.7, type: "BufferGeometry", generator: "BufferGeometry.toJSON" } };
    if (
      ((e.uuid = this.uuid),
      (e.type = this.type),
      this.name !== "" && (e.name = this.name),
      Object.keys(this.userData).length > 0 && (e.userData = this.userData),
      this.parameters !== void 0)
    ) {
      const c = this.parameters;
      for (const l in c) c[l] !== void 0 && (e[l] = c[l]);
      return e;
    }
    e.data = { attributes: {} };
    const t = this.index;
    t !== null && (e.data.index = { type: t.array.constructor.name, array: Array.prototype.slice.call(t.array) });
    const n = this.attributes;
    for (const c in n) {
      const l = n[c];
      e.data.attributes[c] = l.toJSON(e.data);
    }
    const s = {};
    let r = !1;
    for (const c in this.morphAttributes) {
      const l = this.morphAttributes[c],
        u = [];
      for (let d = 0, h = l.length; d < h; d++) {
        const f = l[d];
        u.push(f.toJSON(e.data));
      }
      u.length > 0 && ((s[c] = u), (r = !0));
    }
    r && ((e.data.morphAttributes = s), (e.data.morphTargetsRelative = this.morphTargetsRelative));
    const a = this.groups;
    a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
    const o = this.boundingSphere;
    return (o !== null && (e.data.boundingSphere = o.toJSON()), e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    ((this.index = null),
      (this.attributes = {}),
      (this.morphAttributes = {}),
      (this.groups = []),
      (this.boundingBox = null),
      (this.boundingSphere = null));
    const t = {};
    this.name = e.name;
    const n = e.index;
    n !== null && this.setIndex(n.clone());
    const s = e.attributes;
    for (const l in s) {
      const u = s[l];
      this.setAttribute(l, u.clone(t));
    }
    const r = e.morphAttributes;
    for (const l in r) {
      const u = [],
        d = r[l];
      for (let h = 0, f = d.length; h < f; h++) u.push(d[h].clone(t));
      this.morphAttributes[l] = u;
    }
    this.morphTargetsRelative = e.morphTargetsRelative;
    const a = e.groups;
    for (let l = 0, u = a.length; l < u; l++) {
      const d = a[l];
      this.addGroup(d.start, d.count, d.materialIndex);
    }
    const o = e.boundingBox;
    o !== null && (this.boundingBox = o.clone());
    const c = e.boundingSphere;
    return (
      c !== null && (this.boundingSphere = c.clone()),
      (this.drawRange.start = e.drawRange.start),
      (this.drawRange.count = e.drawRange.count),
      (this.userData = e.userData),
      this
    );
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class w_ {
  constructor(e, t) {
    ((this.isInterleavedBuffer = !0),
      (this.array = e),
      (this.stride = t),
      (this.count = e !== void 0 ? e.length / t : 0),
      (this.usage = Ba),
      (this.updateRanges = []),
      (this.version = 0),
      (this.uuid = Jt()));
  }
  onUploadCallback() {}
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  setUsage(e) {
    return ((this.usage = e), this);
  }
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(e) {
    return (
      (this.array = new e.array.constructor(e.array)),
      (this.count = e.count),
      (this.stride = e.stride),
      (this.usage = e.usage),
      this
    );
  }
  copyAt(e, t, n) {
    ((e *= this.stride), (n *= t.stride));
    for (let s = 0, r = this.stride; s < r; s++) this.array[e + s] = t.array[n + s];
    return this;
  }
  set(e, t = 0) {
    return (this.array.set(e, t), this);
  }
  clone(e) {
    (e.arrayBuffers === void 0 && (e.arrayBuffers = {}),
      this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = Jt()),
      e.arrayBuffers[this.array.buffer._uuid] === void 0 &&
        (e.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer));
    const t = new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),
      n = new this.constructor(t, this.stride);
    return (n.setUsage(this.usage), n);
  }
  onUpload(e) {
    return ((this.onUploadCallback = e), this);
  }
  toJSON(e) {
    return (
      e.arrayBuffers === void 0 && (e.arrayBuffers = {}),
      this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = Jt()),
      e.arrayBuffers[this.array.buffer._uuid] === void 0 &&
        (e.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))),
      { uuid: this.uuid, buffer: this.array.buffer._uuid, type: this.array.constructor.name, stride: this.stride }
    );
  }
}
const Ct = new F();
class hc {
  constructor(e, t, n, s = !1) {
    ((this.isInterleavedBufferAttribute = !0),
      (this.name = ""),
      (this.data = e),
      (this.itemSize = t),
      (this.offset = n),
      (this.normalized = s));
  }
  get count() {
    return this.data.count;
  }
  get array() {
    return this.data.array;
  }
  set needsUpdate(e) {
    this.data.needsUpdate = e;
  }
  applyMatrix4(e) {
    for (let t = 0, n = this.data.count; t < n; t++)
      (Ct.fromBufferAttribute(this, t), Ct.applyMatrix4(e), this.setXYZ(t, Ct.x, Ct.y, Ct.z));
    return this;
  }
  applyNormalMatrix(e) {
    for (let t = 0, n = this.count; t < n; t++)
      (Ct.fromBufferAttribute(this, t), Ct.applyNormalMatrix(e), this.setXYZ(t, Ct.x, Ct.y, Ct.z));
    return this;
  }
  transformDirection(e) {
    for (let t = 0, n = this.count; t < n; t++)
      (Ct.fromBufferAttribute(this, t), Ct.transformDirection(e), this.setXYZ(t, Ct.x, Ct.y, Ct.z));
    return this;
  }
  getComponent(e, t) {
    let n = this.array[e * this.data.stride + this.offset + t];
    return (this.normalized && (n = Kt(n, this.array)), n);
  }
  setComponent(e, t, n) {
    return (
      this.normalized && (n = Ke(n, this.array)),
      (this.data.array[e * this.data.stride + this.offset + t] = n),
      this
    );
  }
  setX(e, t) {
    return (
      this.normalized && (t = Ke(t, this.array)),
      (this.data.array[e * this.data.stride + this.offset] = t),
      this
    );
  }
  setY(e, t) {
    return (
      this.normalized && (t = Ke(t, this.array)),
      (this.data.array[e * this.data.stride + this.offset + 1] = t),
      this
    );
  }
  setZ(e, t) {
    return (
      this.normalized && (t = Ke(t, this.array)),
      (this.data.array[e * this.data.stride + this.offset + 2] = t),
      this
    );
  }
  setW(e, t) {
    return (
      this.normalized && (t = Ke(t, this.array)),
      (this.data.array[e * this.data.stride + this.offset + 3] = t),
      this
    );
  }
  getX(e) {
    let t = this.data.array[e * this.data.stride + this.offset];
    return (this.normalized && (t = Kt(t, this.array)), t);
  }
  getY(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 1];
    return (this.normalized && (t = Kt(t, this.array)), t);
  }
  getZ(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 2];
    return (this.normalized && (t = Kt(t, this.array)), t);
  }
  getW(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 3];
    return (this.normalized && (t = Kt(t, this.array)), t);
  }
  setXY(e, t, n) {
    return (
      (e = e * this.data.stride + this.offset),
      this.normalized && ((t = Ke(t, this.array)), (n = Ke(n, this.array))),
      (this.data.array[e + 0] = t),
      (this.data.array[e + 1] = n),
      this
    );
  }
  setXYZ(e, t, n, s) {
    return (
      (e = e * this.data.stride + this.offset),
      this.normalized && ((t = Ke(t, this.array)), (n = Ke(n, this.array)), (s = Ke(s, this.array))),
      (this.data.array[e + 0] = t),
      (this.data.array[e + 1] = n),
      (this.data.array[e + 2] = s),
      this
    );
  }
  setXYZW(e, t, n, s, r) {
    return (
      (e = e * this.data.stride + this.offset),
      this.normalized &&
        ((t = Ke(t, this.array)), (n = Ke(n, this.array)), (s = Ke(s, this.array)), (r = Ke(r, this.array))),
      (this.data.array[e + 0] = t),
      (this.data.array[e + 1] = n),
      (this.data.array[e + 2] = s),
      (this.data.array[e + 3] = r),
      this
    );
  }
  clone(e) {
    if (e === void 0) {
      $s("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
      const t = [];
      for (let n = 0; n < this.count; n++) {
        const s = n * this.data.stride + this.offset;
        for (let r = 0; r < this.itemSize; r++) t.push(this.data.array[s + r]);
      }
      return new Wt(new this.array.constructor(t), this.itemSize, this.normalized);
    } else
      return (
        e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}),
        e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.clone(e)),
        new hc(e.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized)
      );
  }
  toJSON(e) {
    if (e === void 0) {
      $s(
        "InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.",
      );
      const t = [];
      for (let n = 0; n < this.count; n++) {
        const s = n * this.data.stride + this.offset;
        for (let r = 0; r < this.itemSize; r++) t.push(this.data.array[s + r]);
      }
      return { itemSize: this.itemSize, type: this.array.constructor.name, array: t, normalized: this.normalized };
    } else
      return (
        e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}),
        e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.toJSON(e)),
        {
          isInterleavedBufferAttribute: !0,
          itemSize: this.itemSize,
          data: this.data.uuid,
          offset: this.offset,
          normalized: this.normalized,
        }
      );
  }
}
let uu = 0;
class Rn extends An {
  constructor() {
    (super(),
      (this.isMaterial = !0),
      Object.defineProperty(this, "id", { value: uu++ }),
      (this.uuid = Jt()),
      (this.name = ""),
      (this.type = "Material"),
      (this.blending = Si),
      (this.side = kn),
      (this.vertexColors = !1),
      (this.opacity = 1),
      (this.transparent = !1),
      (this.alphaHash = !1),
      (this.blendSrc = jr),
      (this.blendDst = $r),
      (this.blendEquation = Kn),
      (this.blendSrcAlpha = null),
      (this.blendDstAlpha = null),
      (this.blendEquationAlpha = null),
      (this.blendColor = new Ce(0, 0, 0)),
      (this.blendAlpha = 0),
      (this.depthFunc = bi),
      (this.depthTest = !0),
      (this.depthWrite = !0),
      (this.stencilWriteMask = 255),
      (this.stencilFunc = Po),
      (this.stencilRef = 0),
      (this.stencilFuncMask = 255),
      (this.stencilFail = ii),
      (this.stencilZFail = ii),
      (this.stencilZPass = ii),
      (this.stencilWrite = !1),
      (this.clippingPlanes = null),
      (this.clipIntersection = !1),
      (this.clipShadows = !1),
      (this.shadowSide = null),
      (this.colorWrite = !0),
      (this.precision = null),
      (this.polygonOffset = !1),
      (this.polygonOffsetFactor = 0),
      (this.polygonOffsetUnits = 0),
      (this.dithering = !1),
      (this.alphaToCoverage = !1),
      (this.premultipliedAlpha = !1),
      (this.forceSinglePass = !1),
      (this.allowOverride = !0),
      (this.visible = !0),
      (this.toneMapped = !0),
      (this.userData = {}),
      (this.version = 0),
      (this._alphaTest = 0));
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(e) {
    (this._alphaTest > 0 != e > 0 && this.version++, (this._alphaTest = e));
  }
  onBeforeRender() {}
  onBeforeCompile() {}
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(e) {
    if (e !== void 0)
      for (const t in e) {
        const n = e[t];
        if (n === void 0) {
          xe(`Material: parameter '${t}' has value of undefined.`);
          continue;
        }
        const s = this[t];
        if (s === void 0) {
          xe(`Material: '${t}' is not a property of THREE.${this.type}.`);
          continue;
        }
        s && s.isColor ? s.set(n) : s && s.isVector3 && n && n.isVector3 ? s.copy(n) : (this[t] = n);
      }
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    t && (e = { textures: {}, images: {} });
    const n = { metadata: { version: 4.7, type: "Material", generator: "Material.toJSON" } };
    ((n.uuid = this.uuid),
      (n.type = this.type),
      this.name !== "" && (n.name = this.name),
      this.color && this.color.isColor && (n.color = this.color.getHex()),
      this.roughness !== void 0 && (n.roughness = this.roughness),
      this.metalness !== void 0 && (n.metalness = this.metalness),
      this.sheen !== void 0 && (n.sheen = this.sheen),
      this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()),
      this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness),
      this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()),
      this.emissiveIntensity !== void 0 &&
        this.emissiveIntensity !== 1 &&
        (n.emissiveIntensity = this.emissiveIntensity),
      this.specular && this.specular.isColor && (n.specular = this.specular.getHex()),
      this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity),
      this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()),
      this.shininess !== void 0 && (n.shininess = this.shininess),
      this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat),
      this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness),
      this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(e).uuid),
      this.clearcoatRoughnessMap &&
        this.clearcoatRoughnessMap.isTexture &&
        (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid),
      this.clearcoatNormalMap &&
        this.clearcoatNormalMap.isTexture &&
        ((n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid),
        (n.clearcoatNormalScale = this.clearcoatNormalScale.toArray())),
      this.sheenColorMap && this.sheenColorMap.isTexture && (n.sheenColorMap = this.sheenColorMap.toJSON(e).uuid),
      this.sheenRoughnessMap &&
        this.sheenRoughnessMap.isTexture &&
        (n.sheenRoughnessMap = this.sheenRoughnessMap.toJSON(e).uuid),
      this.dispersion !== void 0 && (n.dispersion = this.dispersion),
      this.iridescence !== void 0 && (n.iridescence = this.iridescence),
      this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR),
      this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange),
      this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(e).uuid),
      this.iridescenceThicknessMap &&
        this.iridescenceThicknessMap.isTexture &&
        (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid),
      this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy),
      this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation),
      this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(e).uuid),
      this.map && this.map.isTexture && (n.map = this.map.toJSON(e).uuid),
      this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(e).uuid),
      this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(e).uuid),
      this.lightMap &&
        this.lightMap.isTexture &&
        ((n.lightMap = this.lightMap.toJSON(e).uuid), (n.lightMapIntensity = this.lightMapIntensity)),
      this.aoMap &&
        this.aoMap.isTexture &&
        ((n.aoMap = this.aoMap.toJSON(e).uuid), (n.aoMapIntensity = this.aoMapIntensity)),
      this.bumpMap &&
        this.bumpMap.isTexture &&
        ((n.bumpMap = this.bumpMap.toJSON(e).uuid), (n.bumpScale = this.bumpScale)),
      this.normalMap &&
        this.normalMap.isTexture &&
        ((n.normalMap = this.normalMap.toJSON(e).uuid),
        (n.normalMapType = this.normalMapType),
        (n.normalScale = this.normalScale.toArray())),
      this.displacementMap &&
        this.displacementMap.isTexture &&
        ((n.displacementMap = this.displacementMap.toJSON(e).uuid),
        (n.displacementScale = this.displacementScale),
        (n.displacementBias = this.displacementBias)),
      this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(e).uuid),
      this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(e).uuid),
      this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(e).uuid),
      this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(e).uuid),
      this.specularIntensityMap &&
        this.specularIntensityMap.isTexture &&
        (n.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid),
      this.specularColorMap &&
        this.specularColorMap.isTexture &&
        (n.specularColorMap = this.specularColorMap.toJSON(e).uuid),
      this.envMap &&
        this.envMap.isTexture &&
        ((n.envMap = this.envMap.toJSON(e).uuid), this.combine !== void 0 && (n.combine = this.combine)),
      this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()),
      this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity),
      this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity),
      this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio),
      this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(e).uuid),
      this.transmission !== void 0 && (n.transmission = this.transmission),
      this.transmissionMap &&
        this.transmissionMap.isTexture &&
        (n.transmissionMap = this.transmissionMap.toJSON(e).uuid),
      this.thickness !== void 0 && (n.thickness = this.thickness),
      this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(e).uuid),
      this.attenuationDistance !== void 0 &&
        this.attenuationDistance !== 1 / 0 &&
        (n.attenuationDistance = this.attenuationDistance),
      this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()),
      this.size !== void 0 && (n.size = this.size),
      this.shadowSide !== null && (n.shadowSide = this.shadowSide),
      this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation),
      this.blending !== Si && (n.blending = this.blending),
      this.side !== kn && (n.side = this.side),
      this.vertexColors === !0 && (n.vertexColors = !0),
      this.opacity < 1 && (n.opacity = this.opacity),
      this.transparent === !0 && (n.transparent = !0),
      this.blendSrc !== jr && (n.blendSrc = this.blendSrc),
      this.blendDst !== $r && (n.blendDst = this.blendDst),
      this.blendEquation !== Kn && (n.blendEquation = this.blendEquation),
      this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha),
      this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha),
      this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha),
      this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()),
      this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha),
      this.depthFunc !== bi && (n.depthFunc = this.depthFunc),
      this.depthTest === !1 && (n.depthTest = this.depthTest),
      this.depthWrite === !1 && (n.depthWrite = this.depthWrite),
      this.colorWrite === !1 && (n.colorWrite = this.colorWrite),
      this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask),
      this.stencilFunc !== Po && (n.stencilFunc = this.stencilFunc),
      this.stencilRef !== 0 && (n.stencilRef = this.stencilRef),
      this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask),
      this.stencilFail !== ii && (n.stencilFail = this.stencilFail),
      this.stencilZFail !== ii && (n.stencilZFail = this.stencilZFail),
      this.stencilZPass !== ii && (n.stencilZPass = this.stencilZPass),
      this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite),
      this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation),
      this.polygonOffset === !0 && (n.polygonOffset = !0),
      this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor),
      this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits),
      this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth),
      this.dashSize !== void 0 && (n.dashSize = this.dashSize),
      this.gapSize !== void 0 && (n.gapSize = this.gapSize),
      this.scale !== void 0 && (n.scale = this.scale),
      this.dithering === !0 && (n.dithering = !0),
      this.alphaTest > 0 && (n.alphaTest = this.alphaTest),
      this.alphaHash === !0 && (n.alphaHash = !0),
      this.alphaToCoverage === !0 && (n.alphaToCoverage = !0),
      this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0),
      this.forceSinglePass === !0 && (n.forceSinglePass = !0),
      this.allowOverride === !1 && (n.allowOverride = !1),
      this.wireframe === !0 && (n.wireframe = !0),
      this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth),
      this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap),
      this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin),
      this.flatShading === !0 && (n.flatShading = !0),
      this.visible === !1 && (n.visible = !1),
      this.toneMapped === !1 && (n.toneMapped = !1),
      this.fog === !1 && (n.fog = !1),
      Object.keys(this.userData).length > 0 && (n.userData = this.userData));
    function s(r) {
      const a = [];
      for (const o in r) {
        const c = r[o];
        (delete c.metadata, a.push(c));
      }
      return a;
    }
    if (t) {
      const r = s(e.textures),
        a = s(e.images);
      (r.length > 0 && (n.textures = r), a.length > 0 && (n.images = a));
    }
    return n;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    ((this.name = e.name),
      (this.blending = e.blending),
      (this.side = e.side),
      (this.vertexColors = e.vertexColors),
      (this.opacity = e.opacity),
      (this.transparent = e.transparent),
      (this.blendSrc = e.blendSrc),
      (this.blendDst = e.blendDst),
      (this.blendEquation = e.blendEquation),
      (this.blendSrcAlpha = e.blendSrcAlpha),
      (this.blendDstAlpha = e.blendDstAlpha),
      (this.blendEquationAlpha = e.blendEquationAlpha),
      this.blendColor.copy(e.blendColor),
      (this.blendAlpha = e.blendAlpha),
      (this.depthFunc = e.depthFunc),
      (this.depthTest = e.depthTest),
      (this.depthWrite = e.depthWrite),
      (this.stencilWriteMask = e.stencilWriteMask),
      (this.stencilFunc = e.stencilFunc),
      (this.stencilRef = e.stencilRef),
      (this.stencilFuncMask = e.stencilFuncMask),
      (this.stencilFail = e.stencilFail),
      (this.stencilZFail = e.stencilZFail),
      (this.stencilZPass = e.stencilZPass),
      (this.stencilWrite = e.stencilWrite));
    const t = e.clippingPlanes;
    let n = null;
    if (t !== null) {
      const s = t.length;
      n = new Array(s);
      for (let r = 0; r !== s; ++r) n[r] = t[r].clone();
    }
    return (
      (this.clippingPlanes = n),
      (this.clipIntersection = e.clipIntersection),
      (this.clipShadows = e.clipShadows),
      (this.shadowSide = e.shadowSide),
      (this.colorWrite = e.colorWrite),
      (this.precision = e.precision),
      (this.polygonOffset = e.polygonOffset),
      (this.polygonOffsetFactor = e.polygonOffsetFactor),
      (this.polygonOffsetUnits = e.polygonOffsetUnits),
      (this.dithering = e.dithering),
      (this.alphaTest = e.alphaTest),
      (this.alphaHash = e.alphaHash),
      (this.alphaToCoverage = e.alphaToCoverage),
      (this.premultipliedAlpha = e.premultipliedAlpha),
      (this.forceSinglePass = e.forceSinglePass),
      (this.allowOverride = e.allowOverride),
      (this.visible = e.visible),
      (this.toneMapped = e.toneMapped),
      (this.userData = JSON.parse(JSON.stringify(e.userData))),
      this
    );
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
}
const xn = new F(),
  Ur = new F(),
  gs = new F(),
  Fn = new F(),
  Nr = new F(),
  _s = new F(),
  Fr = new F();
class rr {
  constructor(e = new F(), t = new F(0, 0, -1)) {
    ((this.origin = e), (this.direction = t));
  }
  set(e, t) {
    return (this.origin.copy(e), this.direction.copy(t), this);
  }
  copy(e) {
    return (this.origin.copy(e.origin), this.direction.copy(e.direction), this);
  }
  at(e, t) {
    return t.copy(this.origin).addScaledVector(this.direction, e);
  }
  lookAt(e) {
    return (this.direction.copy(e).sub(this.origin).normalize(), this);
  }
  recast(e) {
    return (this.origin.copy(this.at(e, xn)), this);
  }
  closestPointToPoint(e, t) {
    t.subVectors(e, this.origin);
    const n = t.dot(this.direction);
    return n < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, n);
  }
  distanceToPoint(e) {
    return Math.sqrt(this.distanceSqToPoint(e));
  }
  distanceSqToPoint(e) {
    const t = xn.subVectors(e, this.origin).dot(this.direction);
    return t < 0
      ? this.origin.distanceToSquared(e)
      : (xn.copy(this.origin).addScaledVector(this.direction, t), xn.distanceToSquared(e));
  }
  distanceSqToSegment(e, t, n, s) {
    (Ur.copy(e).add(t).multiplyScalar(0.5), gs.copy(t).sub(e).normalize(), Fn.copy(this.origin).sub(Ur));
    const r = e.distanceTo(t) * 0.5,
      a = -this.direction.dot(gs),
      o = Fn.dot(this.direction),
      c = -Fn.dot(gs),
      l = Fn.lengthSq(),
      u = Math.abs(1 - a * a);
    let d, h, f, g;
    if (u > 0)
      if (((d = a * c - o), (h = a * o - c), (g = r * u), d >= 0))
        if (h >= -g)
          if (h <= g) {
            const M = 1 / u;
            ((d *= M), (h *= M), (f = d * (d + a * h + 2 * o) + h * (a * d + h + 2 * c) + l));
          } else ((h = r), (d = Math.max(0, -(a * h + o))), (f = -d * d + h * (h + 2 * c) + l));
        else ((h = -r), (d = Math.max(0, -(a * h + o))), (f = -d * d + h * (h + 2 * c) + l));
      else
        h <= -g
          ? ((d = Math.max(0, -(-a * r + o))),
            (h = d > 0 ? -r : Math.min(Math.max(-r, -c), r)),
            (f = -d * d + h * (h + 2 * c) + l))
          : h <= g
            ? ((d = 0), (h = Math.min(Math.max(-r, -c), r)), (f = h * (h + 2 * c) + l))
            : ((d = Math.max(0, -(a * r + o))),
              (h = d > 0 ? r : Math.min(Math.max(-r, -c), r)),
              (f = -d * d + h * (h + 2 * c) + l));
    else ((h = a > 0 ? -r : r), (d = Math.max(0, -(a * h + o))), (f = -d * d + h * (h + 2 * c) + l));
    return (n && n.copy(this.origin).addScaledVector(this.direction, d), s && s.copy(Ur).addScaledVector(gs, h), f);
  }
  intersectSphere(e, t) {
    xn.subVectors(e.center, this.origin);
    const n = xn.dot(this.direction),
      s = xn.dot(xn) - n * n,
      r = e.radius * e.radius;
    if (s > r) return null;
    const a = Math.sqrt(r - s),
      o = n - a,
      c = n + a;
    return c < 0 ? null : o < 0 ? this.at(c, t) : this.at(o, t);
  }
  intersectsSphere(e) {
    return e.radius < 0 ? !1 : this.distanceSqToPoint(e.center) <= e.radius * e.radius;
  }
  distanceToPlane(e) {
    const t = e.normal.dot(this.direction);
    if (t === 0) return e.distanceToPoint(this.origin) === 0 ? 0 : null;
    const n = -(this.origin.dot(e.normal) + e.constant) / t;
    return n >= 0 ? n : null;
  }
  intersectPlane(e, t) {
    const n = this.distanceToPlane(e);
    return n === null ? null : this.at(n, t);
  }
  intersectsPlane(e) {
    const t = e.distanceToPoint(this.origin);
    return t === 0 || e.normal.dot(this.direction) * t < 0;
  }
  intersectBox(e, t) {
    let n, s, r, a, o, c;
    const l = 1 / this.direction.x,
      u = 1 / this.direction.y,
      d = 1 / this.direction.z,
      h = this.origin;
    return (
      l >= 0
        ? ((n = (e.min.x - h.x) * l), (s = (e.max.x - h.x) * l))
        : ((n = (e.max.x - h.x) * l), (s = (e.min.x - h.x) * l)),
      u >= 0
        ? ((r = (e.min.y - h.y) * u), (a = (e.max.y - h.y) * u))
        : ((r = (e.max.y - h.y) * u), (a = (e.min.y - h.y) * u)),
      n > a ||
      r > s ||
      ((r > n || isNaN(n)) && (n = r),
      (a < s || isNaN(s)) && (s = a),
      d >= 0
        ? ((o = (e.min.z - h.z) * d), (c = (e.max.z - h.z) * d))
        : ((o = (e.max.z - h.z) * d), (c = (e.min.z - h.z) * d)),
      n > c || o > s) ||
      ((o > n || n !== n) && (n = o), (c < s || s !== s) && (s = c), s < 0)
        ? null
        : this.at(n >= 0 ? n : s, t)
    );
  }
  intersectsBox(e) {
    return this.intersectBox(e, xn) !== null;
  }
  intersectTriangle(e, t, n, s, r) {
    (Nr.subVectors(t, e), _s.subVectors(n, e), Fr.crossVectors(Nr, _s));
    let a = this.direction.dot(Fr),
      o;
    if (a > 0) {
      if (s) return null;
      o = 1;
    } else if (a < 0) ((o = -1), (a = -a));
    else return null;
    Fn.subVectors(this.origin, e);
    const c = o * this.direction.dot(_s.crossVectors(Fn, _s));
    if (c < 0) return null;
    const l = o * this.direction.dot(Nr.cross(Fn));
    if (l < 0 || c + l > a) return null;
    const u = -o * Fn.dot(Fr);
    return u < 0 ? null : this.at(u / a, r);
  }
  applyMatrix4(e) {
    return (this.origin.applyMatrix4(e), this.direction.transformDirection(e), this);
  }
  equals(e) {
    return e.origin.equals(this.origin) && e.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class uc extends Rn {
  constructor(e) {
    (super(),
      (this.isMeshBasicMaterial = !0),
      (this.type = "MeshBasicMaterial"),
      (this.color = new Ce(16777215)),
      (this.map = null),
      (this.lightMap = null),
      (this.lightMapIntensity = 1),
      (this.aoMap = null),
      (this.aoMapIntensity = 1),
      (this.specularMap = null),
      (this.alphaMap = null),
      (this.envMap = null),
      (this.envMapRotation = new un()),
      (this.combine = ir),
      (this.reflectivity = 1),
      (this.refractionRatio = 0.98),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      (this.wireframeLinecap = "round"),
      (this.wireframeLinejoin = "round"),
      (this.fog = !0),
      this.setValues(e));
  }
  copy(e) {
    return (
      super.copy(e),
      this.color.copy(e.color),
      (this.map = e.map),
      (this.lightMap = e.lightMap),
      (this.lightMapIntensity = e.lightMapIntensity),
      (this.aoMap = e.aoMap),
      (this.aoMapIntensity = e.aoMapIntensity),
      (this.specularMap = e.specularMap),
      (this.alphaMap = e.alphaMap),
      (this.envMap = e.envMap),
      this.envMapRotation.copy(e.envMapRotation),
      (this.combine = e.combine),
      (this.reflectivity = e.reflectivity),
      (this.refractionRatio = e.refractionRatio),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      (this.wireframeLinecap = e.wireframeLinecap),
      (this.wireframeLinejoin = e.wireframeLinejoin),
      (this.fog = e.fog),
      this
    );
  }
}
const Xo = new He(),
  qn = new rr(),
  xs = new wn(),
  qo = new F(),
  vs = new F(),
  Ms = new F(),
  Ss = new F(),
  Or = new F(),
  ys = new F(),
  Yo = new F(),
  bs = new F();
class Xt extends dt {
  constructor(e = new Lt(), t = new uc()) {
    (super(),
      (this.isMesh = !0),
      (this.type = "Mesh"),
      (this.geometry = e),
      (this.material = t),
      (this.morphTargetDictionary = void 0),
      (this.morphTargetInfluences = void 0),
      (this.count = 1),
      this.updateMorphTargets());
  }
  copy(e, t) {
    return (
      super.copy(e, t),
      e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()),
      e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)),
      (this.material = Array.isArray(e.material) ? e.material.slice() : e.material),
      (this.geometry = e.geometry),
      this
    );
  }
  updateMorphTargets() {
    const t = this.geometry.morphAttributes,
      n = Object.keys(t);
    if (n.length > 0) {
      const s = t[n[0]];
      if (s !== void 0) {
        ((this.morphTargetInfluences = []), (this.morphTargetDictionary = {}));
        for (let r = 0, a = s.length; r < a; r++) {
          const o = s[r].name || String(r);
          (this.morphTargetInfluences.push(0), (this.morphTargetDictionary[o] = r));
        }
      }
    }
  }
  getVertexPosition(e, t) {
    const n = this.geometry,
      s = n.attributes.position,
      r = n.morphAttributes.position,
      a = n.morphTargetsRelative;
    t.fromBufferAttribute(s, e);
    const o = this.morphTargetInfluences;
    if (r && o) {
      ys.set(0, 0, 0);
      for (let c = 0, l = r.length; c < l; c++) {
        const u = o[c],
          d = r[c];
        u !== 0 && (Or.fromBufferAttribute(d, e), a ? ys.addScaledVector(Or, u) : ys.addScaledVector(Or.sub(t), u));
      }
      t.add(ys);
    }
    return t;
  }
  raycast(e, t) {
    const n = this.geometry,
      s = this.material,
      r = this.matrixWorld;
    s !== void 0 &&
      (n.boundingSphere === null && n.computeBoundingSphere(),
      xs.copy(n.boundingSphere),
      xs.applyMatrix4(r),
      qn.copy(e.ray).recast(e.near),
      !(
        xs.containsPoint(qn.origin) === !1 &&
        (qn.intersectSphere(xs, qo) === null || qn.origin.distanceToSquared(qo) > (e.far - e.near) ** 2)
      ) &&
        (Xo.copy(r).invert(),
        qn.copy(e.ray).applyMatrix4(Xo),
        !(n.boundingBox !== null && qn.intersectsBox(n.boundingBox) === !1) && this._computeIntersections(e, t, qn)));
  }
  _computeIntersections(e, t, n) {
    let s;
    const r = this.geometry,
      a = this.material,
      o = r.index,
      c = r.attributes.position,
      l = r.attributes.uv,
      u = r.attributes.uv1,
      d = r.attributes.normal,
      h = r.groups,
      f = r.drawRange;
    if (o !== null)
      if (Array.isArray(a))
        for (let g = 0, M = h.length; g < M; g++) {
          const m = h[g],
            p = a[m.materialIndex],
            S = Math.max(m.start, f.start),
            E = Math.min(o.count, Math.min(m.start + m.count, f.start + f.count));
          for (let b = S, R = E; b < R; b += 3) {
            const T = o.getX(b),
              P = o.getX(b + 1),
              x = o.getX(b + 2);
            ((s = Es(this, p, e, n, l, u, d, T, P, x)),
              s && ((s.faceIndex = Math.floor(b / 3)), (s.face.materialIndex = m.materialIndex), t.push(s)));
          }
        }
      else {
        const g = Math.max(0, f.start),
          M = Math.min(o.count, f.start + f.count);
        for (let m = g, p = M; m < p; m += 3) {
          const S = o.getX(m),
            E = o.getX(m + 1),
            b = o.getX(m + 2);
          ((s = Es(this, a, e, n, l, u, d, S, E, b)), s && ((s.faceIndex = Math.floor(m / 3)), t.push(s)));
        }
      }
    else if (c !== void 0)
      if (Array.isArray(a))
        for (let g = 0, M = h.length; g < M; g++) {
          const m = h[g],
            p = a[m.materialIndex],
            S = Math.max(m.start, f.start),
            E = Math.min(c.count, Math.min(m.start + m.count, f.start + f.count));
          for (let b = S, R = E; b < R; b += 3) {
            const T = b,
              P = b + 1,
              x = b + 2;
            ((s = Es(this, p, e, n, l, u, d, T, P, x)),
              s && ((s.faceIndex = Math.floor(b / 3)), (s.face.materialIndex = m.materialIndex), t.push(s)));
          }
        }
      else {
        const g = Math.max(0, f.start),
          M = Math.min(c.count, f.start + f.count);
        for (let m = g, p = M; m < p; m += 3) {
          const S = m,
            E = m + 1,
            b = m + 2;
          ((s = Es(this, a, e, n, l, u, d, S, E, b)), s && ((s.faceIndex = Math.floor(m / 3)), t.push(s)));
        }
      }
  }
}
function du(i, e, t, n, s, r, a, o) {
  let c;
  if (
    (e.side === It ? (c = n.intersectTriangle(a, r, s, !0, o)) : (c = n.intersectTriangle(s, r, a, e.side === kn, o)),
    c === null)
  )
    return null;
  (bs.copy(o), bs.applyMatrix4(i.matrixWorld));
  const l = t.ray.origin.distanceTo(bs);
  return l < t.near || l > t.far ? null : { distance: l, point: bs.clone(), object: i };
}
function Es(i, e, t, n, s, r, a, o, c, l) {
  (i.getVertexPosition(o, vs), i.getVertexPosition(c, Ms), i.getVertexPosition(l, Ss));
  const u = du(i, e, t, n, vs, Ms, Ss, Yo);
  if (u) {
    const d = new F();
    (jt.getBarycoord(Yo, vs, Ms, Ss, d),
      s && (u.uv = jt.getInterpolatedAttribute(s, o, c, l, d, new Ge())),
      r && (u.uv1 = jt.getInterpolatedAttribute(r, o, c, l, d, new Ge())),
      a &&
        ((u.normal = jt.getInterpolatedAttribute(a, o, c, l, d, new F())),
        u.normal.dot(n.direction) > 0 && u.normal.multiplyScalar(-1)));
    const h = { a: o, b: c, c: l, normal: new F(), materialIndex: 0 };
    (jt.getNormal(vs, Ms, Ss, h.normal), (u.face = h), (u.barycoord = d));
  }
  return u;
}
const Oi = new it(),
  Zo = new it(),
  Ko = new it(),
  fu = new it(),
  jo = new He(),
  Ts = new F(),
  Br = new wn(),
  $o = new He(),
  zr = new rr();
class R_ extends Xt {
  constructor(e, t) {
    (super(e, t),
      (this.isSkinnedMesh = !0),
      (this.type = "SkinnedMesh"),
      (this.bindMode = Ro),
      (this.bindMatrix = new He()),
      (this.bindMatrixInverse = new He()),
      (this.boundingBox = null),
      (this.boundingSphere = null));
  }
  computeBoundingBox() {
    const e = this.geometry;
    (this.boundingBox === null && (this.boundingBox = new Gn()), this.boundingBox.makeEmpty());
    const t = e.getAttribute("position");
    for (let n = 0; n < t.count; n++) (this.getVertexPosition(n, Ts), this.boundingBox.expandByPoint(Ts));
  }
  computeBoundingSphere() {
    const e = this.geometry;
    (this.boundingSphere === null && (this.boundingSphere = new wn()), this.boundingSphere.makeEmpty());
    const t = e.getAttribute("position");
    for (let n = 0; n < t.count; n++) (this.getVertexPosition(n, Ts), this.boundingSphere.expandByPoint(Ts));
  }
  copy(e, t) {
    return (
      super.copy(e, t),
      (this.bindMode = e.bindMode),
      this.bindMatrix.copy(e.bindMatrix),
      this.bindMatrixInverse.copy(e.bindMatrixInverse),
      (this.skeleton = e.skeleton),
      e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()),
      e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()),
      this
    );
  }
  raycast(e, t) {
    const n = this.material,
      s = this.matrixWorld;
    n !== void 0 &&
      (this.boundingSphere === null && this.computeBoundingSphere(),
      Br.copy(this.boundingSphere),
      Br.applyMatrix4(s),
      e.ray.intersectsSphere(Br) !== !1 &&
        ($o.copy(s).invert(),
        zr.copy(e.ray).applyMatrix4($o),
        !(this.boundingBox !== null && zr.intersectsBox(this.boundingBox) === !1) &&
          this._computeIntersections(e, t, zr)));
  }
  getVertexPosition(e, t) {
    return (super.getVertexPosition(e, t), this.applyBoneTransform(e, t), t);
  }
  bind(e, t) {
    ((this.skeleton = e),
      t === void 0 && (this.updateMatrixWorld(!0), this.skeleton.calculateInverses(), (t = this.matrixWorld)),
      this.bindMatrix.copy(t),
      this.bindMatrixInverse.copy(t).invert());
  }
  pose() {
    this.skeleton.pose();
  }
  normalizeSkinWeights() {
    const e = new it(),
      t = this.geometry.attributes.skinWeight;
    for (let n = 0, s = t.count; n < s; n++) {
      e.fromBufferAttribute(t, n);
      const r = 1 / e.manhattanLength();
      (r !== 1 / 0 ? e.multiplyScalar(r) : e.set(1, 0, 0, 0), t.setXYZW(n, e.x, e.y, e.z, e.w));
    }
  }
  updateMatrixWorld(e) {
    (super.updateMatrixWorld(e),
      this.bindMode === Ro
        ? this.bindMatrixInverse.copy(this.matrixWorld).invert()
        : this.bindMode === ph
          ? this.bindMatrixInverse.copy(this.bindMatrix).invert()
          : xe("SkinnedMesh: Unrecognized bindMode: " + this.bindMode));
  }
  applyBoneTransform(e, t) {
    const n = this.skeleton,
      s = this.geometry;
    (Zo.fromBufferAttribute(s.attributes.skinIndex, e),
      Ko.fromBufferAttribute(s.attributes.skinWeight, e),
      t.isVector4 ? (Oi.copy(t), t.set(0, 0, 0, 0)) : (Oi.set(...t, 1), t.set(0, 0, 0)),
      Oi.applyMatrix4(this.bindMatrix));
    for (let r = 0; r < 4; r++) {
      const a = Ko.getComponent(r);
      if (a !== 0) {
        const o = Zo.getComponent(r);
        (jo.multiplyMatrices(n.bones[o].matrixWorld, n.boneInverses[o]),
          t.addScaledVector(fu.copy(Oi).applyMatrix4(jo), a));
      }
    }
    return (t.isVector4 && (t.w = Oi.w), t.applyMatrix4(this.bindMatrixInverse));
  }
}
class pu extends dt {
  constructor() {
    (super(), (this.isBone = !0), (this.type = "Bone"));
  }
}
class ar extends Rt {
  constructor(e = null, t = 1, n = 1, s, r, a, o, c, l = Et, u = Et, d, h) {
    (super(null, a, o, c, l, u, s, r, d, h),
      (this.isDataTexture = !0),
      (this.image = { data: e, width: t, height: n }),
      (this.generateMipmaps = !1),
      (this.flipY = !1),
      (this.unpackAlignment = 1));
  }
}
const Jo = new He(),
  mu = new He();
class dc {
  constructor(e = [], t = []) {
    ((this.uuid = Jt()),
      (this.bones = e.slice(0)),
      (this.boneInverses = t),
      (this.boneMatrices = null),
      (this.previousBoneMatrices = null),
      (this.boneTexture = null),
      this.init());
  }
  init() {
    const e = this.bones,
      t = this.boneInverses;
    if (((this.boneMatrices = new Float32Array(e.length * 16)), t.length === 0)) this.calculateInverses();
    else if (e.length !== t.length) {
      (xe("Skeleton: Number of inverse bone matrices does not match amount of bones."), (this.boneInverses = []));
      for (let n = 0, s = this.bones.length; n < s; n++) this.boneInverses.push(new He());
    }
  }
  calculateInverses() {
    this.boneInverses.length = 0;
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const n = new He();
      (this.bones[e] && n.copy(this.bones[e].matrixWorld).invert(), this.boneInverses.push(n));
    }
  }
  pose() {
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const n = this.bones[e];
      n && n.matrixWorld.copy(this.boneInverses[e]).invert();
    }
    for (let e = 0, t = this.bones.length; e < t; e++) {
      const n = this.bones[e];
      n &&
        (n.parent && n.parent.isBone
          ? (n.matrix.copy(n.parent.matrixWorld).invert(), n.matrix.multiply(n.matrixWorld))
          : n.matrix.copy(n.matrixWorld),
        n.matrix.decompose(n.position, n.quaternion, n.scale));
    }
  }
  update() {
    const e = this.bones,
      t = this.boneInverses,
      n = this.boneMatrices,
      s = this.boneTexture;
    for (let r = 0, a = e.length; r < a; r++) {
      const o = e[r] ? e[r].matrixWorld : mu;
      (Jo.multiplyMatrices(o, t[r]), Jo.toArray(n, r * 16));
    }
    s !== null && (s.needsUpdate = !0);
  }
  clone() {
    return new dc(this.bones, this.boneInverses);
  }
  computeBoneTexture() {
    let e = Math.sqrt(this.bones.length * 4);
    ((e = Math.ceil(e / 4) * 4), (e = Math.max(e, 4)));
    const t = new Float32Array(e * e * 4);
    t.set(this.boneMatrices);
    const n = new ar(t, e, e, Ht, Gt);
    return ((n.needsUpdate = !0), (this.boneMatrices = t), (this.boneTexture = n), this);
  }
  getBoneByName(e) {
    for (let t = 0, n = this.bones.length; t < n; t++) {
      const s = this.bones[t];
      if (s.name === e) return s;
    }
  }
  dispose() {
    this.boneTexture !== null && (this.boneTexture.dispose(), (this.boneTexture = null));
  }
  fromJSON(e, t) {
    this.uuid = e.uuid;
    for (let n = 0, s = e.bones.length; n < s; n++) {
      const r = e.bones[n];
      let a = t[r];
      (a === void 0 && (xe("Skeleton: No bone found with UUID:", r), (a = new pu())),
        this.bones.push(a),
        this.boneInverses.push(new He().fromArray(e.boneInverses[n])));
    }
    return (this.init(), this);
  }
  toJSON() {
    const e = {
      metadata: { version: 4.7, type: "Skeleton", generator: "Skeleton.toJSON" },
      bones: [],
      boneInverses: [],
    };
    e.uuid = this.uuid;
    const t = this.bones,
      n = this.boneInverses;
    for (let s = 0, r = t.length; s < r; s++) {
      const a = t[s];
      e.bones.push(a.uuid);
      const o = n[s];
      e.boneInverses.push(o.toArray());
    }
    return e;
  }
}
class Qo extends Wt {
  constructor(e, t, n, s = 1) {
    (super(e, t, n), (this.isInstancedBufferAttribute = !0), (this.meshPerAttribute = s));
  }
  copy(e) {
    return (super.copy(e), (this.meshPerAttribute = e.meshPerAttribute), this);
  }
  toJSON() {
    const e = super.toJSON();
    return ((e.meshPerAttribute = this.meshPerAttribute), (e.isInstancedBufferAttribute = !0), e);
  }
}
const pi = new He(),
  el = new He(),
  As = [],
  tl = new Gn(),
  gu = new He(),
  Bi = new Xt(),
  zi = new wn();
class C_ extends Xt {
  constructor(e, t, n) {
    (super(e, t),
      (this.isInstancedMesh = !0),
      (this.instanceMatrix = new Qo(new Float32Array(n * 16), 16)),
      (this.previousInstanceMatrix = null),
      (this.instanceColor = null),
      (this.morphTexture = null),
      (this.count = n),
      (this.boundingBox = null),
      (this.boundingSphere = null));
    for (let s = 0; s < n; s++) this.setMatrixAt(s, gu);
  }
  computeBoundingBox() {
    const e = this.geometry,
      t = this.count;
    (this.boundingBox === null && (this.boundingBox = new Gn()),
      e.boundingBox === null && e.computeBoundingBox(),
      this.boundingBox.makeEmpty());
    for (let n = 0; n < t; n++)
      (this.getMatrixAt(n, pi), tl.copy(e.boundingBox).applyMatrix4(pi), this.boundingBox.union(tl));
  }
  computeBoundingSphere() {
    const e = this.geometry,
      t = this.count;
    (this.boundingSphere === null && (this.boundingSphere = new wn()),
      e.boundingSphere === null && e.computeBoundingSphere(),
      this.boundingSphere.makeEmpty());
    for (let n = 0; n < t; n++)
      (this.getMatrixAt(n, pi), zi.copy(e.boundingSphere).applyMatrix4(pi), this.boundingSphere.union(zi));
  }
  copy(e, t) {
    return (
      super.copy(e, t),
      this.instanceMatrix.copy(e.instanceMatrix),
      e.previousInstanceMatrix !== null && (this.previousInstanceMatrix = e.previousInstanceMatrix.clone()),
      e.morphTexture !== null && (this.morphTexture = e.morphTexture.clone()),
      e.instanceColor !== null && (this.instanceColor = e.instanceColor.clone()),
      (this.count = e.count),
      e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()),
      e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()),
      this
    );
  }
  getColorAt(e, t) {
    return this.instanceColor === null ? t.setRGB(1, 1, 1) : t.fromArray(this.instanceColor.array, e * 3);
  }
  getMatrixAt(e, t) {
    return t.fromArray(this.instanceMatrix.array, e * 16);
  }
  getMorphAt(e, t) {
    const n = t.morphTargetInfluences,
      s = this.morphTexture.source.data.data,
      r = n.length + 1,
      a = e * r + 1;
    for (let o = 0; o < n.length; o++) n[o] = s[a + o];
  }
  raycast(e, t) {
    const n = this.matrixWorld,
      s = this.count;
    if (
      ((Bi.geometry = this.geometry),
      (Bi.material = this.material),
      Bi.material !== void 0 &&
        (this.boundingSphere === null && this.computeBoundingSphere(),
        zi.copy(this.boundingSphere),
        zi.applyMatrix4(n),
        e.ray.intersectsSphere(zi) !== !1))
    )
      for (let r = 0; r < s; r++) {
        (this.getMatrixAt(r, pi), el.multiplyMatrices(n, pi), (Bi.matrixWorld = el), Bi.raycast(e, As));
        for (let a = 0, o = As.length; a < o; a++) {
          const c = As[a];
          ((c.instanceId = r), (c.object = this), t.push(c));
        }
        As.length = 0;
      }
  }
  setColorAt(e, t) {
    return (
      this.instanceColor === null &&
        (this.instanceColor = new Qo(new Float32Array(this.instanceMatrix.count * 3).fill(1), 3)),
      t.toArray(this.instanceColor.array, e * 3),
      this
    );
  }
  setMatrixAt(e, t) {
    return (t.toArray(this.instanceMatrix.array, e * 16), this);
  }
  setMorphAt(e, t) {
    const n = t.morphTargetInfluences,
      s = n.length + 1;
    this.morphTexture === null && (this.morphTexture = new ar(new Float32Array(s * this.count), s, this.count, Ka, Gt));
    const r = this.morphTexture.source.data.data;
    let a = 0;
    for (let l = 0; l < n.length; l++) a += n[l];
    const o = this.geometry.morphTargetsRelative ? 1 : 1 - a,
      c = s * e;
    return ((r[c] = o), r.set(n, c + 1), this);
  }
  updateMorphTargets() {}
  dispose() {
    (this.dispatchEvent({ type: "dispose" }),
      this.morphTexture !== null && (this.morphTexture.dispose(), (this.morphTexture = null)));
  }
}
const Vr = new F(),
  _u = new F(),
  xu = new Ie();
class Zn {
  constructor(e = new F(1, 0, 0), t = 0) {
    ((this.isPlane = !0), (this.normal = e), (this.constant = t));
  }
  set(e, t) {
    return (this.normal.copy(e), (this.constant = t), this);
  }
  setComponents(e, t, n, s) {
    return (this.normal.set(e, t, n), (this.constant = s), this);
  }
  setFromNormalAndCoplanarPoint(e, t) {
    return (this.normal.copy(e), (this.constant = -t.dot(this.normal)), this);
  }
  setFromCoplanarPoints(e, t, n) {
    const s = Vr.subVectors(n, t).cross(_u.subVectors(e, t)).normalize();
    return (this.setFromNormalAndCoplanarPoint(s, e), this);
  }
  copy(e) {
    return (this.normal.copy(e.normal), (this.constant = e.constant), this);
  }
  normalize() {
    const e = 1 / this.normal.length();
    return (this.normal.multiplyScalar(e), (this.constant *= e), this);
  }
  negate() {
    return ((this.constant *= -1), this.normal.negate(), this);
  }
  distanceToPoint(e) {
    return this.normal.dot(e) + this.constant;
  }
  distanceToSphere(e) {
    return this.distanceToPoint(e.center) - e.radius;
  }
  projectPoint(e, t) {
    return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
  }
  intersectLine(e, t, n = !0) {
    const s = e.delta(Vr),
      r = this.normal.dot(s);
    if (r === 0) return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
    const a = -(e.start.dot(this.normal) + this.constant) / r;
    return n === !0 && (a < 0 || a > 1) ? null : t.copy(e.start).addScaledVector(s, a);
  }
  intersectsLine(e) {
    const t = this.distanceToPoint(e.start),
      n = this.distanceToPoint(e.end);
    return (t < 0 && n > 0) || (n < 0 && t > 0);
  }
  intersectsBox(e) {
    return e.intersectsPlane(this);
  }
  intersectsSphere(e) {
    return e.intersectsPlane(this);
  }
  coplanarPoint(e) {
    return e.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(e, t) {
    const n = t || xu.getNormalMatrix(e),
      s = this.coplanarPoint(Vr).applyMatrix4(e),
      r = this.normal.applyMatrix3(n).normalize();
    return ((this.constant = -s.dot(r)), this);
  }
  translate(e) {
    return ((this.constant -= e.dot(this.normal)), this);
  }
  equals(e) {
    return e.normal.equals(this.normal) && e.constant === this.constant;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Yn = new wn(),
  vu = new Ge(0.5, 0.5),
  ws = new F();
class so {
  constructor(e = new Zn(), t = new Zn(), n = new Zn(), s = new Zn(), r = new Zn(), a = new Zn()) {
    this.planes = [e, t, n, s, r, a];
  }
  set(e, t, n, s, r, a) {
    const o = this.planes;
    return (o[0].copy(e), o[1].copy(t), o[2].copy(n), o[3].copy(s), o[4].copy(r), o[5].copy(a), this);
  }
  copy(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++) t[n].copy(e.planes[n]);
    return this;
  }
  setFromProjectionMatrix(e, t = an, n = !1) {
    const s = this.planes,
      r = e.elements,
      a = r[0],
      o = r[1],
      c = r[2],
      l = r[3],
      u = r[4],
      d = r[5],
      h = r[6],
      f = r[7],
      g = r[8],
      M = r[9],
      m = r[10],
      p = r[11],
      S = r[12],
      E = r[13],
      b = r[14],
      R = r[15];
    if (
      (s[0].setComponents(l - a, f - u, p - g, R - S).normalize(),
      s[1].setComponents(l + a, f + u, p + g, R + S).normalize(),
      s[2].setComponents(l + o, f + d, p + M, R + E).normalize(),
      s[3].setComponents(l - o, f - d, p - M, R - E).normalize(),
      n)
    )
      (s[4].setComponents(c, h, m, b).normalize(), s[5].setComponents(l - c, f - h, p - m, R - b).normalize());
    else if ((s[4].setComponents(l - c, f - h, p - m, R - b).normalize(), t === an))
      s[5].setComponents(l + c, f + h, p + m, R + b).normalize();
    else if (t === $i) s[5].setComponents(c, h, m, b).normalize();
    else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + t);
    return this;
  }
  intersectsObject(e) {
    if (e.boundingSphere !== void 0)
      (e.boundingSphere === null && e.computeBoundingSphere(), Yn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld));
    else {
      const t = e.geometry;
      (t.boundingSphere === null && t.computeBoundingSphere(), Yn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld));
    }
    return this.intersectsSphere(Yn);
  }
  intersectsSprite(e) {
    Yn.center.set(0, 0, 0);
    const t = vu.distanceTo(e.center);
    return ((Yn.radius = 0.7071067811865476 + t), Yn.applyMatrix4(e.matrixWorld), this.intersectsSphere(Yn));
  }
  intersectsSphere(e) {
    const t = this.planes,
      n = e.center,
      s = -e.radius;
    for (let r = 0; r < 6; r++) if (t[r].distanceToPoint(n) < s) return !1;
    return !0;
  }
  intersectsBox(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++) {
      const s = t[n];
      if (
        ((ws.x = s.normal.x > 0 ? e.max.x : e.min.x),
        (ws.y = s.normal.y > 0 ? e.max.y : e.min.y),
        (ws.z = s.normal.z > 0 ? e.max.z : e.min.z),
        s.distanceToPoint(ws) < 0)
      )
        return !1;
    }
    return !0;
  }
  containsPoint(e) {
    const t = this.planes;
    for (let n = 0; n < 6; n++) if (t[n].distanceToPoint(e) < 0) return !1;
    return !0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class fc extends Rn {
  constructor(e) {
    (super(),
      (this.isLineBasicMaterial = !0),
      (this.type = "LineBasicMaterial"),
      (this.color = new Ce(16777215)),
      (this.map = null),
      (this.linewidth = 1),
      (this.linecap = "round"),
      (this.linejoin = "round"),
      (this.fog = !0),
      this.setValues(e));
  }
  copy(e) {
    return (
      super.copy(e),
      this.color.copy(e.color),
      (this.map = e.map),
      (this.linewidth = e.linewidth),
      (this.linecap = e.linecap),
      (this.linejoin = e.linejoin),
      (this.fog = e.fog),
      this
    );
  }
}
const Js = new F(),
  Qs = new F(),
  nl = new He(),
  Vi = new rr(),
  Rs = new wn(),
  kr = new F(),
  il = new F();
class pc extends dt {
  constructor(e = new Lt(), t = new fc()) {
    (super(),
      (this.isLine = !0),
      (this.type = "Line"),
      (this.geometry = e),
      (this.material = t),
      (this.morphTargetDictionary = void 0),
      (this.morphTargetInfluences = void 0),
      this.updateMorphTargets());
  }
  copy(e, t) {
    return (
      super.copy(e, t),
      (this.material = Array.isArray(e.material) ? e.material.slice() : e.material),
      (this.geometry = e.geometry),
      this
    );
  }
  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const t = e.attributes.position,
        n = [0];
      for (let s = 1, r = t.count; s < r; s++)
        (Js.fromBufferAttribute(t, s - 1),
          Qs.fromBufferAttribute(t, s),
          (n[s] = n[s - 1]),
          (n[s] += Js.distanceTo(Qs)));
      e.setAttribute("lineDistance", new Mt(n, 1));
    } else xe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
  raycast(e, t) {
    const n = this.geometry,
      s = this.matrixWorld,
      r = e.params.Line.threshold,
      a = n.drawRange;
    if (
      (n.boundingSphere === null && n.computeBoundingSphere(),
      Rs.copy(n.boundingSphere),
      Rs.applyMatrix4(s),
      (Rs.radius += r),
      e.ray.intersectsSphere(Rs) === !1)
    )
      return;
    (nl.copy(s).invert(), Vi.copy(e.ray).applyMatrix4(nl));
    const o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3),
      c = o * o,
      l = this.isLineSegments ? 2 : 1,
      u = n.index,
      h = n.attributes.position;
    if (u !== null) {
      const f = Math.max(0, a.start),
        g = Math.min(u.count, a.start + a.count);
      for (let M = f, m = g - 1; M < m; M += l) {
        const p = u.getX(M),
          S = u.getX(M + 1),
          E = Cs(this, e, Vi, c, p, S, M);
        E && t.push(E);
      }
      if (this.isLineLoop) {
        const M = u.getX(g - 1),
          m = u.getX(f),
          p = Cs(this, e, Vi, c, M, m, g - 1);
        p && t.push(p);
      }
    } else {
      const f = Math.max(0, a.start),
        g = Math.min(h.count, a.start + a.count);
      for (let M = f, m = g - 1; M < m; M += l) {
        const p = Cs(this, e, Vi, c, M, M + 1, M);
        p && t.push(p);
      }
      if (this.isLineLoop) {
        const M = Cs(this, e, Vi, c, g - 1, f, g - 1);
        M && t.push(M);
      }
    }
  }
  updateMorphTargets() {
    const t = this.geometry.morphAttributes,
      n = Object.keys(t);
    if (n.length > 0) {
      const s = t[n[0]];
      if (s !== void 0) {
        ((this.morphTargetInfluences = []), (this.morphTargetDictionary = {}));
        for (let r = 0, a = s.length; r < a; r++) {
          const o = s[r].name || String(r);
          (this.morphTargetInfluences.push(0), (this.morphTargetDictionary[o] = r));
        }
      }
    }
  }
}
function Cs(i, e, t, n, s, r, a) {
  const o = i.geometry.attributes.position;
  if ((Js.fromBufferAttribute(o, s), Qs.fromBufferAttribute(o, r), t.distanceSqToSegment(Js, Qs, kr, il) > n)) return;
  kr.applyMatrix4(i.matrixWorld);
  const l = e.ray.origin.distanceTo(kr);
  if (!(l < e.near || l > e.far))
    return {
      distance: l,
      point: il.clone().applyMatrix4(i.matrixWorld),
      index: a,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: i,
    };
}
const sl = new F(),
  rl = new F();
class Mu extends pc {
  constructor(e, t) {
    (super(e, t), (this.isLineSegments = !0), (this.type = "LineSegments"));
  }
  computeLineDistances() {
    const e = this.geometry;
    if (e.index === null) {
      const t = e.attributes.position,
        n = [];
      for (let s = 0, r = t.count; s < r; s += 2)
        (sl.fromBufferAttribute(t, s),
          rl.fromBufferAttribute(t, s + 1),
          (n[s] = s === 0 ? 0 : n[s - 1]),
          (n[s + 1] = n[s] + sl.distanceTo(rl)));
      e.setAttribute("lineDistance", new Mt(n, 1));
    } else xe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
    return this;
  }
}
class P_ extends pc {
  constructor(e, t) {
    (super(e, t), (this.isLineLoop = !0), (this.type = "LineLoop"));
  }
}
class Su extends Rn {
  constructor(e) {
    (super(),
      (this.isPointsMaterial = !0),
      (this.type = "PointsMaterial"),
      (this.color = new Ce(16777215)),
      (this.map = null),
      (this.alphaMap = null),
      (this.size = 1),
      (this.sizeAttenuation = !0),
      (this.fog = !0),
      this.setValues(e));
  }
  copy(e) {
    return (
      super.copy(e),
      this.color.copy(e.color),
      (this.map = e.map),
      (this.alphaMap = e.alphaMap),
      (this.size = e.size),
      (this.sizeAttenuation = e.sizeAttenuation),
      (this.fog = e.fog),
      this
    );
  }
}
const al = new He(),
  Va = new rr(),
  Ps = new wn(),
  Is = new F();
class I_ extends dt {
  constructor(e = new Lt(), t = new Su()) {
    (super(),
      (this.isPoints = !0),
      (this.type = "Points"),
      (this.geometry = e),
      (this.material = t),
      (this.morphTargetDictionary = void 0),
      (this.morphTargetInfluences = void 0),
      this.updateMorphTargets());
  }
  copy(e, t) {
    return (
      super.copy(e, t),
      (this.material = Array.isArray(e.material) ? e.material.slice() : e.material),
      (this.geometry = e.geometry),
      this
    );
  }
  raycast(e, t) {
    const n = this.geometry,
      s = this.matrixWorld,
      r = e.params.Points.threshold,
      a = n.drawRange;
    if (
      (n.boundingSphere === null && n.computeBoundingSphere(),
      Ps.copy(n.boundingSphere),
      Ps.applyMatrix4(s),
      (Ps.radius += r),
      e.ray.intersectsSphere(Ps) === !1)
    )
      return;
    (al.copy(s).invert(), Va.copy(e.ray).applyMatrix4(al));
    const o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3),
      c = o * o,
      l = n.index,
      d = n.attributes.position;
    if (l !== null) {
      const h = Math.max(0, a.start),
        f = Math.min(l.count, a.start + a.count);
      for (let g = h, M = f; g < M; g++) {
        const m = l.getX(g);
        (Is.fromBufferAttribute(d, m), ol(Is, m, c, s, e, t, this));
      }
    } else {
      const h = Math.max(0, a.start),
        f = Math.min(d.count, a.start + a.count);
      for (let g = h, M = f; g < M; g++) (Is.fromBufferAttribute(d, g), ol(Is, g, c, s, e, t, this));
    }
  }
  updateMorphTargets() {
    const t = this.geometry.morphAttributes,
      n = Object.keys(t);
    if (n.length > 0) {
      const s = t[n[0]];
      if (s !== void 0) {
        ((this.morphTargetInfluences = []), (this.morphTargetDictionary = {}));
        for (let r = 0, a = s.length; r < a; r++) {
          const o = s[r].name || String(r);
          (this.morphTargetInfluences.push(0), (this.morphTargetDictionary[o] = r));
        }
      }
    }
  }
}
function ol(i, e, t, n, s, r, a) {
  const o = Va.distanceSqToPoint(i);
  if (o < t) {
    const c = new F();
    (Va.closestPointToPoint(i, c), c.applyMatrix4(n));
    const l = s.ray.origin.distanceTo(c);
    if (l < s.near || l > s.far) return;
    r.push({
      distance: l,
      distanceToRay: Math.sqrt(o),
      point: c,
      index: e,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: a,
    });
  }
}
class mc extends Rt {
  constructor(e = [], t = Jn, n, s, r, a, o, c, l, u) {
    (super(e, t, n, s, r, a, o, c, l, u), (this.isCubeTexture = !0), (this.flipY = !1));
  }
  get images() {
    return this.image;
  }
  set images(e) {
    this.image = e;
  }
}
class Ai extends Rt {
  constructor(e, t, n = hn, s, r, a, o = Et, c = Et, l, u = Tn, d = 1) {
    if (u !== Tn && u !== $n)
      throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    const h = { width: e, height: t, depth: d };
    (super(h, s, r, a, o, c, u, n, l),
      (this.isDepthTexture = !0),
      (this.flipY = !1),
      (this.generateMipmaps = !1),
      (this.compareFunction = null));
  }
  copy(e) {
    return (
      super.copy(e),
      (this.source = new io(Object.assign({}, e.image))),
      (this.compareFunction = e.compareFunction),
      this
    );
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return (this.compareFunction !== null && (t.compareFunction = this.compareFunction), t);
  }
}
class yu extends Ai {
  constructor(e, t = hn, n = Jn, s, r, a = Et, o = Et, c, l = Tn) {
    const u = { width: e, height: e, depth: 1 },
      d = [u, u, u, u, u, u];
    (super(e, e, t, n, s, r, a, o, c, l), (this.image = d), (this.isCubeDepthTexture = !0), (this.isCubeTexture = !0));
  }
  get images() {
    return this.image;
  }
  set images(e) {
    this.image = e;
  }
}
class gc extends Rt {
  constructor(e = null) {
    (super(), (this.sourceTexture = e), (this.isExternalTexture = !0));
  }
  copy(e) {
    return (super.copy(e), (this.sourceTexture = e.sourceTexture), this);
  }
}
class ns extends Lt {
  constructor(e = 1, t = 1, n = 1, s = 1, r = 1, a = 1) {
    (super(),
      (this.type = "BoxGeometry"),
      (this.parameters = { width: e, height: t, depth: n, widthSegments: s, heightSegments: r, depthSegments: a }));
    const o = this;
    ((s = Math.floor(s)), (r = Math.floor(r)), (a = Math.floor(a)));
    const c = [],
      l = [],
      u = [],
      d = [];
    let h = 0,
      f = 0;
    (g("z", "y", "x", -1, -1, n, t, e, a, r, 0),
      g("z", "y", "x", 1, -1, n, t, -e, a, r, 1),
      g("x", "z", "y", 1, 1, e, n, t, s, a, 2),
      g("x", "z", "y", 1, -1, e, n, -t, s, a, 3),
      g("x", "y", "z", 1, -1, e, t, n, s, r, 4),
      g("x", "y", "z", -1, -1, e, t, -n, s, r, 5),
      this.setIndex(c),
      this.setAttribute("position", new Mt(l, 3)),
      this.setAttribute("normal", new Mt(u, 3)),
      this.setAttribute("uv", new Mt(d, 2)));
    function g(M, m, p, S, E, b, R, T, P, x, A) {
      const L = b / P,
        w = R / x,
        N = b / 2,
        H = R / 2,
        W = T / 2,
        U = P + 1,
        V = x + 1;
      let G = 0,
        J = 0;
      const Q = new F();
      for (let ce = 0; ce < V; ce++) {
        const ve = ce * w - H;
        for (let be = 0; be < U; be++) {
          const Xe = be * L - N;
          ((Q[M] = Xe * S),
            (Q[m] = ve * E),
            (Q[p] = W),
            l.push(Q.x, Q.y, Q.z),
            (Q[M] = 0),
            (Q[m] = 0),
            (Q[p] = T > 0 ? 1 : -1),
            u.push(Q.x, Q.y, Q.z),
            d.push(be / P),
            d.push(1 - ce / x),
            (G += 1));
        }
      }
      for (let ce = 0; ce < x; ce++)
        for (let ve = 0; ve < P; ve++) {
          const be = h + ve + U * ce,
            Xe = h + ve + U * (ce + 1),
            $e = h + (ve + 1) + U * (ce + 1),
            Ue = h + (ve + 1) + U * ce;
          (c.push(be, Xe, Ue), c.push(Xe, $e, Ue), (J += 6));
        }
      (o.addGroup(f, J, A), (f += J), (h += G));
    }
  }
  copy(e) {
    return (super.copy(e), (this.parameters = Object.assign({}, e.parameters)), this);
  }
  static fromJSON(e) {
    return new ns(e.width, e.height, e.depth, e.widthSegments, e.heightSegments, e.depthSegments);
  }
}
class ro extends Lt {
  constructor(e = 1, t = 1, n = 1, s = 32, r = 1, a = !1, o = 0, c = Math.PI * 2) {
    (super(),
      (this.type = "CylinderGeometry"),
      (this.parameters = {
        radiusTop: e,
        radiusBottom: t,
        height: n,
        radialSegments: s,
        heightSegments: r,
        openEnded: a,
        thetaStart: o,
        thetaLength: c,
      }));
    const l = this;
    ((s = Math.floor(s)), (r = Math.floor(r)));
    const u = [],
      d = [],
      h = [],
      f = [];
    let g = 0;
    const M = [],
      m = n / 2;
    let p = 0;
    (S(),
      a === !1 && (e > 0 && E(!0), t > 0 && E(!1)),
      this.setIndex(u),
      this.setAttribute("position", new Mt(d, 3)),
      this.setAttribute("normal", new Mt(h, 3)),
      this.setAttribute("uv", new Mt(f, 2)));
    function S() {
      const b = new F(),
        R = new F();
      let T = 0;
      const P = (t - e) / n;
      for (let x = 0; x <= r; x++) {
        const A = [],
          L = x / r,
          w = L * (t - e) + e;
        for (let N = 0; N <= s; N++) {
          const H = N / s,
            W = H * c + o,
            U = Math.sin(W),
            V = Math.cos(W);
          ((R.x = w * U),
            (R.y = -L * n + m),
            (R.z = w * V),
            d.push(R.x, R.y, R.z),
            b.set(U, P, V).normalize(),
            h.push(b.x, b.y, b.z),
            f.push(H, 1 - L),
            A.push(g++));
        }
        M.push(A);
      }
      for (let x = 0; x < s; x++)
        for (let A = 0; A < r; A++) {
          const L = M[A][x],
            w = M[A + 1][x],
            N = M[A + 1][x + 1],
            H = M[A][x + 1];
          ((e > 0 || A !== 0) && (u.push(L, w, H), (T += 3)), (t > 0 || A !== r - 1) && (u.push(w, N, H), (T += 3)));
        }
      (l.addGroup(p, T, 0), (p += T));
    }
    function E(b) {
      const R = g,
        T = new Ge(),
        P = new F();
      let x = 0;
      const A = b === !0 ? e : t,
        L = b === !0 ? 1 : -1;
      for (let N = 1; N <= s; N++) (d.push(0, m * L, 0), h.push(0, L, 0), f.push(0.5, 0.5), g++);
      const w = g;
      for (let N = 0; N <= s; N++) {
        const W = (N / s) * c + o,
          U = Math.cos(W),
          V = Math.sin(W);
        ((P.x = A * V),
          (P.y = m * L),
          (P.z = A * U),
          d.push(P.x, P.y, P.z),
          h.push(0, L, 0),
          (T.x = U * 0.5 + 0.5),
          (T.y = V * 0.5 * L + 0.5),
          f.push(T.x, T.y),
          g++);
      }
      for (let N = 0; N < s; N++) {
        const H = R + N,
          W = w + N;
        (b === !0 ? u.push(W, W + 1, H) : u.push(W + 1, W, H), (x += 3));
      }
      (l.addGroup(p, x, b === !0 ? 1 : 2), (p += x));
    }
  }
  copy(e) {
    return (super.copy(e), (this.parameters = Object.assign({}, e.parameters)), this);
  }
  static fromJSON(e) {
    return new ro(
      e.radiusTop,
      e.radiusBottom,
      e.height,
      e.radialSegments,
      e.heightSegments,
      e.openEnded,
      e.thetaStart,
      e.thetaLength,
    );
  }
}
class _c extends ro {
  constructor(e = 1, t = 1, n = 32, s = 1, r = !1, a = 0, o = Math.PI * 2) {
    (super(0, e, t, n, s, r, a, o),
      (this.type = "ConeGeometry"),
      (this.parameters = {
        radius: e,
        height: t,
        radialSegments: n,
        heightSegments: s,
        openEnded: r,
        thetaStart: a,
        thetaLength: o,
      }));
  }
  static fromJSON(e) {
    return new _c(e.radius, e.height, e.radialSegments, e.heightSegments, e.openEnded, e.thetaStart, e.thetaLength);
  }
}
class L_ {
  constructor() {
    ((this.type = "Curve"), (this.arcLengthDivisions = 200), (this.needsUpdate = !1), (this.cacheArcLengths = null));
  }
  getPoint() {
    xe("Curve: .getPoint() not implemented.");
  }
  getPointAt(e, t) {
    const n = this.getUtoTmapping(e);
    return this.getPoint(n, t);
  }
  getPoints(e = 5) {
    const t = [];
    for (let n = 0; n <= e; n++) t.push(this.getPoint(n / e));
    return t;
  }
  getSpacedPoints(e = 5) {
    const t = [];
    for (let n = 0; n <= e; n++) t.push(this.getPointAt(n / e));
    return t;
  }
  getLength() {
    const e = this.getLengths();
    return e[e.length - 1];
  }
  getLengths(e = this.arcLengthDivisions) {
    if (this.cacheArcLengths && this.cacheArcLengths.length === e + 1 && !this.needsUpdate) return this.cacheArcLengths;
    this.needsUpdate = !1;
    const t = [];
    let n,
      s = this.getPoint(0),
      r = 0;
    t.push(0);
    for (let a = 1; a <= e; a++) ((n = this.getPoint(a / e)), (r += n.distanceTo(s)), t.push(r), (s = n));
    return ((this.cacheArcLengths = t), t);
  }
  updateArcLengths() {
    ((this.needsUpdate = !0), this.getLengths());
  }
  getUtoTmapping(e, t = null) {
    const n = this.getLengths();
    let s = 0;
    const r = n.length;
    let a;
    t ? (a = t) : (a = e * n[r - 1]);
    let o = 0,
      c = r - 1,
      l;
    for (; o <= c;)
      if (((s = Math.floor(o + (c - o) / 2)), (l = n[s] - a), l < 0)) o = s + 1;
      else if (l > 0) c = s - 1;
      else {
        c = s;
        break;
      }
    if (((s = c), n[s] === a)) return s / (r - 1);
    const u = n[s],
      h = n[s + 1] - u,
      f = (a - u) / h;
    return (s + f) / (r - 1);
  }
  getTangent(e, t) {
    let s = e - 1e-4,
      r = e + 1e-4;
    (s < 0 && (s = 0), r > 1 && (r = 1));
    const a = this.getPoint(s),
      o = this.getPoint(r),
      c = t || (a.isVector2 ? new Ge() : new F());
    return (c.copy(o).sub(a).normalize(), c);
  }
  getTangentAt(e, t) {
    const n = this.getUtoTmapping(e);
    return this.getTangent(n, t);
  }
  computeFrenetFrames(e, t = !1) {
    const n = new F(),
      s = [],
      r = [],
      a = [],
      o = new F(),
      c = new He();
    for (let f = 0; f <= e; f++) {
      const g = f / e;
      s[f] = this.getTangentAt(g, new F());
    }
    ((r[0] = new F()), (a[0] = new F()));
    let l = Number.MAX_VALUE;
    const u = Math.abs(s[0].x),
      d = Math.abs(s[0].y),
      h = Math.abs(s[0].z);
    (u <= l && ((l = u), n.set(1, 0, 0)),
      d <= l && ((l = d), n.set(0, 1, 0)),
      h <= l && n.set(0, 0, 1),
      o.crossVectors(s[0], n).normalize(),
      r[0].crossVectors(s[0], o),
      a[0].crossVectors(s[0], r[0]));
    for (let f = 1; f <= e; f++) {
      if (
        ((r[f] = r[f - 1].clone()),
        (a[f] = a[f - 1].clone()),
        o.crossVectors(s[f - 1], s[f]),
        o.length() > Number.EPSILON)
      ) {
        o.normalize();
        const g = Math.acos(Fe(s[f - 1].dot(s[f]), -1, 1));
        r[f].applyMatrix4(c.makeRotationAxis(o, g));
      }
      a[f].crossVectors(s[f], r[f]);
    }
    if (t === !0) {
      let f = Math.acos(Fe(r[0].dot(r[e]), -1, 1));
      ((f /= e), s[0].dot(o.crossVectors(r[0], r[e])) > 0 && (f = -f));
      for (let g = 1; g <= e; g++) (r[g].applyMatrix4(c.makeRotationAxis(s[g], f * g)), a[g].crossVectors(s[g], r[g]));
    }
    return { tangents: s, normals: r, binormals: a };
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return ((this.arcLengthDivisions = e.arcLengthDivisions), this);
  }
  toJSON() {
    const e = { metadata: { version: 4.7, type: "Curve", generator: "Curve.toJSON" } };
    return ((e.arcLengthDivisions = this.arcLengthDivisions), (e.type = this.type), e);
  }
  fromJSON(e) {
    return ((this.arcLengthDivisions = e.arcLengthDivisions), this);
  }
}
function bu(i, e, t = 2) {
  const n = e && e.length,
    s = n ? e[0] * t : i.length;
  let r = xc(i, 0, s, t, !0);
  const a = [];
  if (!r || r.next === r.prev) return a;
  let o, c, l;
  if ((n && (r = Ru(i, e, r, t)), i.length > 80 * t)) {
    ((o = i[0]), (c = i[1]));
    let u = o,
      d = c;
    for (let h = t; h < s; h += t) {
      const f = i[h],
        g = i[h + 1];
      (f < o && (o = f), g < c && (c = g), f > u && (u = f), g > d && (d = g));
    }
    ((l = Math.max(u - o, d - c)), (l = l !== 0 ? 32767 / l : 0));
  }
  return (Qi(r, a, t, o, c, l, 0), a);
}
function xc(i, e, t, n, s) {
  let r;
  if (s === zu(i, e, t, n) > 0) for (let a = e; a < t; a += n) r = ll((a / n) | 0, i[a], i[a + 1], r);
  else for (let a = t - n; a >= e; a -= n) r = ll((a / n) | 0, i[a], i[a + 1], r);
  return (r && wi(r, r.next) && (ts(r), (r = r.next)), r);
}
function ei(i, e) {
  if (!i) return i;
  e || (e = i);
  let t = i,
    n;
  do
    if (((n = !1), !t.steiner && (wi(t, t.next) || ct(t.prev, t, t.next) === 0))) {
      if ((ts(t), (t = e = t.prev), t === t.next)) break;
      n = !0;
    } else t = t.next;
  while (n || t !== e);
  return e;
}
function Qi(i, e, t, n, s, r, a) {
  if (!i) return;
  !a && r && Du(i, n, s, r);
  let o = i;
  for (; i.prev !== i.next;) {
    const c = i.prev,
      l = i.next;
    if (r ? Tu(i, n, s, r) : Eu(i)) {
      (e.push(c.i, i.i, l.i), ts(i), (i = l.next), (o = l.next));
      continue;
    }
    if (((i = l), i === o)) {
      a
        ? a === 1
          ? ((i = Au(ei(i), e)), Qi(i, e, t, n, s, r, 2))
          : a === 2 && wu(i, e, t, n, s, r)
        : Qi(ei(i), e, t, n, s, r, 1);
      break;
    }
  }
}
function Eu(i) {
  const e = i.prev,
    t = i,
    n = i.next;
  if (ct(e, t, n) >= 0) return !1;
  const s = e.x,
    r = t.x,
    a = n.x,
    o = e.y,
    c = t.y,
    l = n.y,
    u = Math.min(s, r, a),
    d = Math.min(o, c, l),
    h = Math.max(s, r, a),
    f = Math.max(o, c, l);
  let g = n.next;
  for (; g !== e;) {
    if (g.x >= u && g.x <= h && g.y >= d && g.y <= f && Wi(s, o, r, c, a, l, g.x, g.y) && ct(g.prev, g, g.next) >= 0)
      return !1;
    g = g.next;
  }
  return !0;
}
function Tu(i, e, t, n) {
  const s = i.prev,
    r = i,
    a = i.next;
  if (ct(s, r, a) >= 0) return !1;
  const o = s.x,
    c = r.x,
    l = a.x,
    u = s.y,
    d = r.y,
    h = a.y,
    f = Math.min(o, c, l),
    g = Math.min(u, d, h),
    M = Math.max(o, c, l),
    m = Math.max(u, d, h),
    p = ka(f, g, e, t, n),
    S = ka(M, m, e, t, n);
  let E = i.prevZ,
    b = i.nextZ;
  for (; E && E.z >= p && b && b.z <= S;) {
    if (
      (E.x >= f &&
        E.x <= M &&
        E.y >= g &&
        E.y <= m &&
        E !== s &&
        E !== a &&
        Wi(o, u, c, d, l, h, E.x, E.y) &&
        ct(E.prev, E, E.next) >= 0) ||
      ((E = E.prevZ),
      b.x >= f &&
        b.x <= M &&
        b.y >= g &&
        b.y <= m &&
        b !== s &&
        b !== a &&
        Wi(o, u, c, d, l, h, b.x, b.y) &&
        ct(b.prev, b, b.next) >= 0)
    )
      return !1;
    b = b.nextZ;
  }
  for (; E && E.z >= p;) {
    if (
      E.x >= f &&
      E.x <= M &&
      E.y >= g &&
      E.y <= m &&
      E !== s &&
      E !== a &&
      Wi(o, u, c, d, l, h, E.x, E.y) &&
      ct(E.prev, E, E.next) >= 0
    )
      return !1;
    E = E.prevZ;
  }
  for (; b && b.z <= S;) {
    if (
      b.x >= f &&
      b.x <= M &&
      b.y >= g &&
      b.y <= m &&
      b !== s &&
      b !== a &&
      Wi(o, u, c, d, l, h, b.x, b.y) &&
      ct(b.prev, b, b.next) >= 0
    )
      return !1;
    b = b.nextZ;
  }
  return !0;
}
function Au(i, e) {
  let t = i;
  do {
    const n = t.prev,
      s = t.next.next;
    (!wi(n, s) &&
      Mc(n, t, t.next, s) &&
      es(n, s) &&
      es(s, n) &&
      (e.push(n.i, t.i, s.i), ts(t), ts(t.next), (t = i = s)),
      (t = t.next));
  } while (t !== i);
  return ei(t);
}
function wu(i, e, t, n, s, r) {
  let a = i;
  do {
    let o = a.next.next;
    for (; o !== a.prev;) {
      if (a.i !== o.i && Fu(a, o)) {
        let c = Sc(a, o);
        ((a = ei(a, a.next)), (c = ei(c, c.next)), Qi(a, e, t, n, s, r, 0), Qi(c, e, t, n, s, r, 0));
        return;
      }
      o = o.next;
    }
    a = a.next;
  } while (a !== i);
}
function Ru(i, e, t, n) {
  const s = [];
  for (let r = 0, a = e.length; r < a; r++) {
    const o = e[r] * n,
      c = r < a - 1 ? e[r + 1] * n : i.length,
      l = xc(i, o, c, n, !1);
    (l === l.next && (l.steiner = !0), s.push(Nu(l)));
  }
  s.sort(Cu);
  for (let r = 0; r < s.length; r++) t = Pu(s[r], t);
  return t;
}
function Cu(i, e) {
  let t = i.x - e.x;
  if (t === 0 && ((t = i.y - e.y), t === 0)) {
    const n = (i.next.y - i.y) / (i.next.x - i.x),
      s = (e.next.y - e.y) / (e.next.x - e.x);
    t = n - s;
  }
  return t;
}
function Pu(i, e) {
  const t = Iu(i, e);
  if (!t) return e;
  const n = Sc(t, i);
  return (ei(n, n.next), ei(t, t.next));
}
function Iu(i, e) {
  let t = e;
  const n = i.x,
    s = i.y;
  let r = -1 / 0,
    a;
  if (wi(i, t)) return t;
  do {
    if (wi(i, t.next)) return t.next;
    if (s <= t.y && s >= t.next.y && t.next.y !== t.y) {
      const d = t.x + ((s - t.y) * (t.next.x - t.x)) / (t.next.y - t.y);
      if (d <= n && d > r && ((r = d), (a = t.x < t.next.x ? t : t.next), d === n)) return a;
    }
    t = t.next;
  } while (t !== e);
  if (!a) return null;
  const o = a,
    c = a.x,
    l = a.y;
  let u = 1 / 0;
  t = a;
  do {
    if (n >= t.x && t.x >= c && n !== t.x && vc(s < l ? n : r, s, c, l, s < l ? r : n, s, t.x, t.y)) {
      const d = Math.abs(s - t.y) / (n - t.x);
      es(t, i) && (d < u || (d === u && (t.x > a.x || (t.x === a.x && Lu(a, t))))) && ((a = t), (u = d));
    }
    t = t.next;
  } while (t !== o);
  return a;
}
function Lu(i, e) {
  return ct(i.prev, i, e.prev) < 0 && ct(e.next, i, i.next) < 0;
}
function Du(i, e, t, n) {
  let s = i;
  do (s.z === 0 && (s.z = ka(s.x, s.y, e, t, n)), (s.prevZ = s.prev), (s.nextZ = s.next), (s = s.next));
  while (s !== i);
  ((s.prevZ.nextZ = null), (s.prevZ = null), Uu(s));
}
function Uu(i) {
  let e,
    t = 1;
  do {
    let n = i,
      s;
    i = null;
    let r = null;
    for (e = 0; n;) {
      e++;
      let a = n,
        o = 0;
      for (let l = 0; l < t && (o++, (a = a.nextZ), !!a); l++);
      let c = t;
      for (; o > 0 || (c > 0 && a);)
        (o !== 0 && (c === 0 || !a || n.z <= a.z) ? ((s = n), (n = n.nextZ), o--) : ((s = a), (a = a.nextZ), c--),
          r ? (r.nextZ = s) : (i = s),
          (s.prevZ = r),
          (r = s));
      n = a;
    }
    ((r.nextZ = null), (t *= 2));
  } while (e > 1);
  return i;
}
function ka(i, e, t, n, s) {
  return (
    (i = ((i - t) * s) | 0),
    (e = ((e - n) * s) | 0),
    (i = (i | (i << 8)) & 16711935),
    (i = (i | (i << 4)) & 252645135),
    (i = (i | (i << 2)) & 858993459),
    (i = (i | (i << 1)) & 1431655765),
    (e = (e | (e << 8)) & 16711935),
    (e = (e | (e << 4)) & 252645135),
    (e = (e | (e << 2)) & 858993459),
    (e = (e | (e << 1)) & 1431655765),
    i | (e << 1)
  );
}
function Nu(i) {
  let e = i,
    t = i;
  do ((e.x < t.x || (e.x === t.x && e.y < t.y)) && (t = e), (e = e.next));
  while (e !== i);
  return t;
}
function vc(i, e, t, n, s, r, a, o) {
  return (
    (s - a) * (e - o) >= (i - a) * (r - o) &&
    (i - a) * (n - o) >= (t - a) * (e - o) &&
    (t - a) * (r - o) >= (s - a) * (n - o)
  );
}
function Wi(i, e, t, n, s, r, a, o) {
  return !(i === a && e === o) && vc(i, e, t, n, s, r, a, o);
}
function Fu(i, e) {
  return (
    i.next.i !== e.i &&
    i.prev.i !== e.i &&
    !Ou(i, e) &&
    ((es(i, e) && es(e, i) && Bu(i, e) && (ct(i.prev, i, e.prev) || ct(i, e.prev, e))) ||
      (wi(i, e) && ct(i.prev, i, i.next) > 0 && ct(e.prev, e, e.next) > 0))
  );
}
function ct(i, e, t) {
  return (e.y - i.y) * (t.x - e.x) - (e.x - i.x) * (t.y - e.y);
}
function wi(i, e) {
  return i.x === e.x && i.y === e.y;
}
function Mc(i, e, t, n) {
  const s = Ds(ct(i, e, t)),
    r = Ds(ct(i, e, n)),
    a = Ds(ct(t, n, i)),
    o = Ds(ct(t, n, e));
  return !!(
    (s !== r && a !== o) ||
    (s === 0 && Ls(i, t, e)) ||
    (r === 0 && Ls(i, n, e)) ||
    (a === 0 && Ls(t, i, n)) ||
    (o === 0 && Ls(t, e, n))
  );
}
function Ls(i, e, t) {
  return (
    e.x <= Math.max(i.x, t.x) && e.x >= Math.min(i.x, t.x) && e.y <= Math.max(i.y, t.y) && e.y >= Math.min(i.y, t.y)
  );
}
function Ds(i) {
  return i > 0 ? 1 : i < 0 ? -1 : 0;
}
function Ou(i, e) {
  let t = i;
  do {
    if (t.i !== i.i && t.next.i !== i.i && t.i !== e.i && t.next.i !== e.i && Mc(t, t.next, i, e)) return !0;
    t = t.next;
  } while (t !== i);
  return !1;
}
function es(i, e) {
  return ct(i.prev, i, i.next) < 0
    ? ct(i, e, i.next) >= 0 && ct(i, i.prev, e) >= 0
    : ct(i, e, i.prev) < 0 || ct(i, i.next, e) < 0;
}
function Bu(i, e) {
  let t = i,
    n = !1;
  const s = (i.x + e.x) / 2,
    r = (i.y + e.y) / 2;
  do
    (t.y > r != t.next.y > r &&
      t.next.y !== t.y &&
      s < ((t.next.x - t.x) * (r - t.y)) / (t.next.y - t.y) + t.x &&
      (n = !n),
      (t = t.next));
  while (t !== i);
  return n;
}
function Sc(i, e) {
  const t = Ga(i.i, i.x, i.y),
    n = Ga(e.i, e.x, e.y),
    s = i.next,
    r = e.prev;
  return (
    (i.next = e),
    (e.prev = i),
    (t.next = s),
    (s.prev = t),
    (n.next = t),
    (t.prev = n),
    (r.next = n),
    (n.prev = r),
    n
  );
}
function ll(i, e, t, n) {
  const s = Ga(i, e, t);
  return (n ? ((s.next = n.next), (s.prev = n), (n.next.prev = s), (n.next = s)) : ((s.prev = s), (s.next = s)), s);
}
function ts(i) {
  ((i.next.prev = i.prev),
    (i.prev.next = i.next),
    i.prevZ && (i.prevZ.nextZ = i.nextZ),
    i.nextZ && (i.nextZ.prevZ = i.prevZ));
}
function Ga(i, e, t) {
  return { i, x: e, y: t, prev: null, next: null, z: 0, prevZ: null, nextZ: null, steiner: !1 };
}
function zu(i, e, t, n) {
  let s = 0;
  for (let r = e, a = t - n; r < t; r += n) ((s += (i[a] - i[r]) * (i[r + 1] + i[a + 1])), (a = r));
  return s;
}
class Vu {
  static triangulate(e, t, n = 2) {
    return bu(e, t, n);
  }
}
class yc {
  static area(e) {
    const t = e.length;
    let n = 0;
    for (let s = t - 1, r = 0; r < t; s = r++) n += e[s].x * e[r].y - e[r].x * e[s].y;
    return n * 0.5;
  }
  static isClockWise(e) {
    return yc.area(e) < 0;
  }
  static triangulateShape(e, t) {
    const n = [],
      s = [],
      r = [];
    (cl(e), hl(n, e));
    let a = e.length;
    t.forEach(cl);
    for (let c = 0; c < t.length; c++) (s.push(a), (a += t[c].length), hl(n, t[c]));
    const o = Vu.triangulate(n, s);
    for (let c = 0; c < o.length; c += 3) r.push(o.slice(c, c + 3));
    return r;
  }
}
function cl(i) {
  const e = i.length;
  e > 2 && i[e - 1].equals(i[0]) && i.pop();
}
function hl(i, e) {
  for (let t = 0; t < e.length; t++) (i.push(e[t].x), i.push(e[t].y));
}
class or extends Lt {
  constructor(e = 1, t = 1, n = 1, s = 1) {
    (super(),
      (this.type = "PlaneGeometry"),
      (this.parameters = { width: e, height: t, widthSegments: n, heightSegments: s }));
    const r = e / 2,
      a = t / 2,
      o = Math.floor(n),
      c = Math.floor(s),
      l = o + 1,
      u = c + 1,
      d = e / o,
      h = t / c,
      f = [],
      g = [],
      M = [],
      m = [];
    for (let p = 0; p < u; p++) {
      const S = p * h - a;
      for (let E = 0; E < l; E++) {
        const b = E * d - r;
        (g.push(b, -S, 0), M.push(0, 0, 1), m.push(E / o), m.push(1 - p / c));
      }
    }
    for (let p = 0; p < c; p++)
      for (let S = 0; S < o; S++) {
        const E = S + l * p,
          b = S + l * (p + 1),
          R = S + 1 + l * (p + 1),
          T = S + 1 + l * p;
        (f.push(E, b, T), f.push(b, R, T));
      }
    (this.setIndex(f),
      this.setAttribute("position", new Mt(g, 3)),
      this.setAttribute("normal", new Mt(M, 3)),
      this.setAttribute("uv", new Mt(m, 2)));
  }
  copy(e) {
    return (super.copy(e), (this.parameters = Object.assign({}, e.parameters)), this);
  }
  static fromJSON(e) {
    return new or(e.width, e.height, e.widthSegments, e.heightSegments);
  }
}
class bc extends Lt {
  constructor(e = 1, t = 32, n = 16, s = 0, r = Math.PI * 2, a = 0, o = Math.PI) {
    (super(),
      (this.type = "SphereGeometry"),
      (this.parameters = {
        radius: e,
        widthSegments: t,
        heightSegments: n,
        phiStart: s,
        phiLength: r,
        thetaStart: a,
        thetaLength: o,
      }),
      (t = Math.max(3, Math.floor(t))),
      (n = Math.max(2, Math.floor(n))));
    const c = Math.min(a + o, Math.PI);
    let l = 0;
    const u = [],
      d = new F(),
      h = new F(),
      f = [],
      g = [],
      M = [],
      m = [];
    for (let p = 0; p <= n; p++) {
      const S = [],
        E = p / n;
      let b = 0;
      p === 0 && a === 0 ? (b = 0.5 / t) : p === n && c === Math.PI && (b = -0.5 / t);
      for (let R = 0; R <= t; R++) {
        const T = R / t;
        ((d.x = -e * Math.cos(s + T * r) * Math.sin(a + E * o)),
          (d.y = e * Math.cos(a + E * o)),
          (d.z = e * Math.sin(s + T * r) * Math.sin(a + E * o)),
          g.push(d.x, d.y, d.z),
          h.copy(d).normalize(),
          M.push(h.x, h.y, h.z),
          m.push(T + b, 1 - E),
          S.push(l++));
      }
      u.push(S);
    }
    for (let p = 0; p < n; p++)
      for (let S = 0; S < t; S++) {
        const E = u[p][S + 1],
          b = u[p][S],
          R = u[p + 1][S],
          T = u[p + 1][S + 1];
        ((p !== 0 || a > 0) && f.push(E, b, T), (p !== n - 1 || c < Math.PI) && f.push(b, R, T));
      }
    (this.setIndex(f),
      this.setAttribute("position", new Mt(g, 3)),
      this.setAttribute("normal", new Mt(M, 3)),
      this.setAttribute("uv", new Mt(m, 2)));
  }
  copy(e) {
    return (super.copy(e), (this.parameters = Object.assign({}, e.parameters)), this);
  }
  static fromJSON(e) {
    return new bc(e.radius, e.widthSegments, e.heightSegments, e.phiStart, e.phiLength, e.thetaStart, e.thetaLength);
  }
}
function Ri(i) {
  const e = {};
  for (const t in i) {
    e[t] = {};
    for (const n in i[t]) {
      const s = i[t][n];
      if (ul(s))
        s.isRenderTargetTexture
          ? (xe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),
            (e[t][n] = null))
          : (e[t][n] = s.clone());
      else if (Array.isArray(s))
        if (ul(s[0])) {
          const r = [];
          for (let a = 0, o = s.length; a < o; a++) r[a] = s[a].clone();
          e[t][n] = r;
        } else e[t][n] = s.slice();
      else e[t][n] = s;
    }
  }
  return e;
}
function Pt(i) {
  const e = {};
  for (let t = 0; t < i.length; t++) {
    const n = Ri(i[t]);
    for (const s in n) e[s] = n[s];
  }
  return e;
}
function ul(i) {
  return (
    i &&
    (i.isColor ||
      i.isMatrix3 ||
      i.isMatrix4 ||
      i.isVector2 ||
      i.isVector3 ||
      i.isVector4 ||
      i.isTexture ||
      i.isQuaternion)
  );
}
function ku(i) {
  const e = [];
  for (let t = 0; t < i.length; t++) e.push(i[t].clone());
  return e;
}
function Ec(i) {
  const e = i.getRenderTarget();
  return e === null ? i.outputColorSpace : e.isXRRenderTarget === !0 ? e.texture.colorSpace : We.workingColorSpace;
}
const Gu = { clone: Ri, merge: Pt };
var Hu = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,
  Wu = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class dn extends Rn {
  constructor(e) {
    (super(),
      (this.isShaderMaterial = !0),
      (this.type = "ShaderMaterial"),
      (this.defines = {}),
      (this.uniforms = {}),
      (this.uniformsGroups = []),
      (this.vertexShader = Hu),
      (this.fragmentShader = Wu),
      (this.linewidth = 1),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      (this.fog = !1),
      (this.lights = !1),
      (this.clipping = !1),
      (this.forceSinglePass = !0),
      (this.extensions = { clipCullDistance: !1, multiDraw: !1 }),
      (this.defaultAttributeValues = { color: [1, 1, 1], uv: [0, 0], uv1: [0, 0] }),
      (this.index0AttributeName = void 0),
      (this.uniformsNeedUpdate = !1),
      (this.glslVersion = null),
      e !== void 0 && this.setValues(e));
  }
  copy(e) {
    return (
      super.copy(e),
      (this.fragmentShader = e.fragmentShader),
      (this.vertexShader = e.vertexShader),
      (this.uniforms = Ri(e.uniforms)),
      (this.uniformsGroups = ku(e.uniformsGroups)),
      (this.defines = Object.assign({}, e.defines)),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      (this.fog = e.fog),
      (this.lights = e.lights),
      (this.clipping = e.clipping),
      (this.extensions = Object.assign({}, e.extensions)),
      (this.glslVersion = e.glslVersion),
      (this.defaultAttributeValues = Object.assign({}, e.defaultAttributeValues)),
      (this.index0AttributeName = e.index0AttributeName),
      (this.uniformsNeedUpdate = e.uniformsNeedUpdate),
      this
    );
  }
  toJSON(e) {
    const t = super.toJSON(e);
    ((t.glslVersion = this.glslVersion), (t.uniforms = {}));
    for (const s in this.uniforms) {
      const a = this.uniforms[s].value;
      a && a.isTexture
        ? (t.uniforms[s] = { type: "t", value: a.toJSON(e).uuid })
        : a && a.isColor
          ? (t.uniforms[s] = { type: "c", value: a.getHex() })
          : a && a.isVector2
            ? (t.uniforms[s] = { type: "v2", value: a.toArray() })
            : a && a.isVector3
              ? (t.uniforms[s] = { type: "v3", value: a.toArray() })
              : a && a.isVector4
                ? (t.uniforms[s] = { type: "v4", value: a.toArray() })
                : a && a.isMatrix3
                  ? (t.uniforms[s] = { type: "m3", value: a.toArray() })
                  : a && a.isMatrix4
                    ? (t.uniforms[s] = { type: "m4", value: a.toArray() })
                    : (t.uniforms[s] = { value: a });
    }
    (Object.keys(this.defines).length > 0 && (t.defines = this.defines),
      (t.vertexShader = this.vertexShader),
      (t.fragmentShader = this.fragmentShader),
      (t.lights = this.lights),
      (t.clipping = this.clipping));
    const n = {};
    for (const s in this.extensions) this.extensions[s] === !0 && (n[s] = !0);
    return (Object.keys(n).length > 0 && (t.extensions = n), t);
  }
}
class Xu extends dn {
  constructor(e) {
    (super(e), (this.isRawShaderMaterial = !0), (this.type = "RawShaderMaterial"));
  }
}
class qu extends Rn {
  constructor(e) {
    (super(),
      (this.isMeshStandardMaterial = !0),
      (this.type = "MeshStandardMaterial"),
      (this.defines = { STANDARD: "" }),
      (this.color = new Ce(16777215)),
      (this.roughness = 1),
      (this.metalness = 0),
      (this.map = null),
      (this.lightMap = null),
      (this.lightMapIntensity = 1),
      (this.aoMap = null),
      (this.aoMapIntensity = 1),
      (this.emissive = new Ce(0)),
      (this.emissiveIntensity = 1),
      (this.emissiveMap = null),
      (this.bumpMap = null),
      (this.bumpScale = 1),
      (this.normalMap = null),
      (this.normalMapType = ji),
      (this.normalScale = new Ge(1, 1)),
      (this.displacementMap = null),
      (this.displacementScale = 1),
      (this.displacementBias = 0),
      (this.roughnessMap = null),
      (this.metalnessMap = null),
      (this.alphaMap = null),
      (this.envMap = null),
      (this.envMapRotation = new un()),
      (this.envMapIntensity = 1),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      (this.wireframeLinecap = "round"),
      (this.wireframeLinejoin = "round"),
      (this.flatShading = !1),
      (this.fog = !0),
      this.setValues(e));
  }
  copy(e) {
    return (
      super.copy(e),
      (this.defines = { STANDARD: "" }),
      this.color.copy(e.color),
      (this.roughness = e.roughness),
      (this.metalness = e.metalness),
      (this.map = e.map),
      (this.lightMap = e.lightMap),
      (this.lightMapIntensity = e.lightMapIntensity),
      (this.aoMap = e.aoMap),
      (this.aoMapIntensity = e.aoMapIntensity),
      this.emissive.copy(e.emissive),
      (this.emissiveMap = e.emissiveMap),
      (this.emissiveIntensity = e.emissiveIntensity),
      (this.bumpMap = e.bumpMap),
      (this.bumpScale = e.bumpScale),
      (this.normalMap = e.normalMap),
      (this.normalMapType = e.normalMapType),
      this.normalScale.copy(e.normalScale),
      (this.displacementMap = e.displacementMap),
      (this.displacementScale = e.displacementScale),
      (this.displacementBias = e.displacementBias),
      (this.roughnessMap = e.roughnessMap),
      (this.metalnessMap = e.metalnessMap),
      (this.alphaMap = e.alphaMap),
      (this.envMap = e.envMap),
      this.envMapRotation.copy(e.envMapRotation),
      (this.envMapIntensity = e.envMapIntensity),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      (this.wireframeLinecap = e.wireframeLinecap),
      (this.wireframeLinejoin = e.wireframeLinejoin),
      (this.flatShading = e.flatShading),
      (this.fog = e.fog),
      this
    );
  }
}
class D_ extends qu {
  constructor(e) {
    (super(),
      (this.isMeshPhysicalMaterial = !0),
      (this.defines = { STANDARD: "", PHYSICAL: "" }),
      (this.type = "MeshPhysicalMaterial"),
      (this.anisotropyRotation = 0),
      (this.anisotropyMap = null),
      (this.clearcoatMap = null),
      (this.clearcoatRoughness = 0),
      (this.clearcoatRoughnessMap = null),
      (this.clearcoatNormalScale = new Ge(1, 1)),
      (this.clearcoatNormalMap = null),
      (this.ior = 1.5),
      Object.defineProperty(this, "reflectivity", {
        get: function () {
          return Fe((2.5 * (this.ior - 1)) / (this.ior + 1), 0, 1);
        },
        set: function (t) {
          this.ior = (1 + 0.4 * t) / (1 - 0.4 * t);
        },
      }),
      (this.iridescenceMap = null),
      (this.iridescenceIOR = 1.3),
      (this.iridescenceThicknessRange = [100, 400]),
      (this.iridescenceThicknessMap = null),
      (this.sheenColor = new Ce(0)),
      (this.sheenColorMap = null),
      (this.sheenRoughness = 1),
      (this.sheenRoughnessMap = null),
      (this.transmissionMap = null),
      (this.thickness = 0),
      (this.thicknessMap = null),
      (this.attenuationDistance = 1 / 0),
      (this.attenuationColor = new Ce(1, 1, 1)),
      (this.specularIntensity = 1),
      (this.specularIntensityMap = null),
      (this.specularColor = new Ce(1, 1, 1)),
      (this.specularColorMap = null),
      (this._anisotropy = 0),
      (this._clearcoat = 0),
      (this._dispersion = 0),
      (this._iridescence = 0),
      (this._sheen = 0),
      (this._transmission = 0),
      this.setValues(e));
  }
  get anisotropy() {
    return this._anisotropy;
  }
  set anisotropy(e) {
    (this._anisotropy > 0 != e > 0 && this.version++, (this._anisotropy = e));
  }
  get clearcoat() {
    return this._clearcoat;
  }
  set clearcoat(e) {
    (this._clearcoat > 0 != e > 0 && this.version++, (this._clearcoat = e));
  }
  get iridescence() {
    return this._iridescence;
  }
  set iridescence(e) {
    (this._iridescence > 0 != e > 0 && this.version++, (this._iridescence = e));
  }
  get dispersion() {
    return this._dispersion;
  }
  set dispersion(e) {
    (this._dispersion > 0 != e > 0 && this.version++, (this._dispersion = e));
  }
  get sheen() {
    return this._sheen;
  }
  set sheen(e) {
    (this._sheen > 0 != e > 0 && this.version++, (this._sheen = e));
  }
  get transmission() {
    return this._transmission;
  }
  set transmission(e) {
    (this._transmission > 0 != e > 0 && this.version++, (this._transmission = e));
  }
  copy(e) {
    return (
      super.copy(e),
      (this.defines = { STANDARD: "", PHYSICAL: "" }),
      (this.anisotropy = e.anisotropy),
      (this.anisotropyRotation = e.anisotropyRotation),
      (this.anisotropyMap = e.anisotropyMap),
      (this.clearcoat = e.clearcoat),
      (this.clearcoatMap = e.clearcoatMap),
      (this.clearcoatRoughness = e.clearcoatRoughness),
      (this.clearcoatRoughnessMap = e.clearcoatRoughnessMap),
      (this.clearcoatNormalMap = e.clearcoatNormalMap),
      this.clearcoatNormalScale.copy(e.clearcoatNormalScale),
      (this.dispersion = e.dispersion),
      (this.ior = e.ior),
      (this.iridescence = e.iridescence),
      (this.iridescenceMap = e.iridescenceMap),
      (this.iridescenceIOR = e.iridescenceIOR),
      (this.iridescenceThicknessRange = [...e.iridescenceThicknessRange]),
      (this.iridescenceThicknessMap = e.iridescenceThicknessMap),
      (this.sheen = e.sheen),
      this.sheenColor.copy(e.sheenColor),
      (this.sheenColorMap = e.sheenColorMap),
      (this.sheenRoughness = e.sheenRoughness),
      (this.sheenRoughnessMap = e.sheenRoughnessMap),
      (this.transmission = e.transmission),
      (this.transmissionMap = e.transmissionMap),
      (this.thickness = e.thickness),
      (this.thicknessMap = e.thicknessMap),
      (this.attenuationDistance = e.attenuationDistance),
      this.attenuationColor.copy(e.attenuationColor),
      (this.specularIntensity = e.specularIntensity),
      (this.specularIntensityMap = e.specularIntensityMap),
      this.specularColor.copy(e.specularColor),
      (this.specularColorMap = e.specularColorMap),
      this
    );
  }
}
class U_ extends Rn {
  constructor(e) {
    (super(),
      (this.isMeshPhongMaterial = !0),
      (this.type = "MeshPhongMaterial"),
      (this.color = new Ce(16777215)),
      (this.specular = new Ce(1118481)),
      (this.shininess = 30),
      (this.map = null),
      (this.lightMap = null),
      (this.lightMapIntensity = 1),
      (this.aoMap = null),
      (this.aoMapIntensity = 1),
      (this.emissive = new Ce(0)),
      (this.emissiveIntensity = 1),
      (this.emissiveMap = null),
      (this.bumpMap = null),
      (this.bumpScale = 1),
      (this.normalMap = null),
      (this.normalMapType = ji),
      (this.normalScale = new Ge(1, 1)),
      (this.displacementMap = null),
      (this.displacementScale = 1),
      (this.displacementBias = 0),
      (this.specularMap = null),
      (this.alphaMap = null),
      (this.envMap = null),
      (this.envMapRotation = new un()),
      (this.combine = ir),
      (this.reflectivity = 1),
      (this.envMapIntensity = 1),
      (this.refractionRatio = 0.98),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      (this.wireframeLinecap = "round"),
      (this.wireframeLinejoin = "round"),
      (this.flatShading = !1),
      (this.fog = !0),
      this.setValues(e));
  }
  copy(e) {
    return (
      super.copy(e),
      this.color.copy(e.color),
      this.specular.copy(e.specular),
      (this.shininess = e.shininess),
      (this.map = e.map),
      (this.lightMap = e.lightMap),
      (this.lightMapIntensity = e.lightMapIntensity),
      (this.aoMap = e.aoMap),
      (this.aoMapIntensity = e.aoMapIntensity),
      this.emissive.copy(e.emissive),
      (this.emissiveMap = e.emissiveMap),
      (this.emissiveIntensity = e.emissiveIntensity),
      (this.bumpMap = e.bumpMap),
      (this.bumpScale = e.bumpScale),
      (this.normalMap = e.normalMap),
      (this.normalMapType = e.normalMapType),
      this.normalScale.copy(e.normalScale),
      (this.displacementMap = e.displacementMap),
      (this.displacementScale = e.displacementScale),
      (this.displacementBias = e.displacementBias),
      (this.specularMap = e.specularMap),
      (this.alphaMap = e.alphaMap),
      (this.envMap = e.envMap),
      this.envMapRotation.copy(e.envMapRotation),
      (this.combine = e.combine),
      (this.reflectivity = e.reflectivity),
      (this.envMapIntensity = e.envMapIntensity),
      (this.refractionRatio = e.refractionRatio),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      (this.wireframeLinecap = e.wireframeLinecap),
      (this.wireframeLinejoin = e.wireframeLinejoin),
      (this.flatShading = e.flatShading),
      (this.fog = e.fog),
      this
    );
  }
}
class N_ extends Rn {
  constructor(e) {
    (super(),
      (this.isMeshLambertMaterial = !0),
      (this.type = "MeshLambertMaterial"),
      (this.color = new Ce(16777215)),
      (this.map = null),
      (this.lightMap = null),
      (this.lightMapIntensity = 1),
      (this.aoMap = null),
      (this.aoMapIntensity = 1),
      (this.emissive = new Ce(0)),
      (this.emissiveIntensity = 1),
      (this.emissiveMap = null),
      (this.bumpMap = null),
      (this.bumpScale = 1),
      (this.normalMap = null),
      (this.normalMapType = ji),
      (this.normalScale = new Ge(1, 1)),
      (this.displacementMap = null),
      (this.displacementScale = 1),
      (this.displacementBias = 0),
      (this.specularMap = null),
      (this.alphaMap = null),
      (this.envMap = null),
      (this.envMapRotation = new un()),
      (this.combine = ir),
      (this.reflectivity = 1),
      (this.envMapIntensity = 1),
      (this.refractionRatio = 0.98),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      (this.wireframeLinecap = "round"),
      (this.wireframeLinejoin = "round"),
      (this.flatShading = !1),
      (this.fog = !0),
      this.setValues(e));
  }
  copy(e) {
    return (
      super.copy(e),
      this.color.copy(e.color),
      (this.map = e.map),
      (this.lightMap = e.lightMap),
      (this.lightMapIntensity = e.lightMapIntensity),
      (this.aoMap = e.aoMap),
      (this.aoMapIntensity = e.aoMapIntensity),
      this.emissive.copy(e.emissive),
      (this.emissiveMap = e.emissiveMap),
      (this.emissiveIntensity = e.emissiveIntensity),
      (this.bumpMap = e.bumpMap),
      (this.bumpScale = e.bumpScale),
      (this.normalMap = e.normalMap),
      (this.normalMapType = e.normalMapType),
      this.normalScale.copy(e.normalScale),
      (this.displacementMap = e.displacementMap),
      (this.displacementScale = e.displacementScale),
      (this.displacementBias = e.displacementBias),
      (this.specularMap = e.specularMap),
      (this.alphaMap = e.alphaMap),
      (this.envMap = e.envMap),
      this.envMapRotation.copy(e.envMapRotation),
      (this.combine = e.combine),
      (this.reflectivity = e.reflectivity),
      (this.envMapIntensity = e.envMapIntensity),
      (this.refractionRatio = e.refractionRatio),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      (this.wireframeLinecap = e.wireframeLinecap),
      (this.wireframeLinejoin = e.wireframeLinejoin),
      (this.flatShading = e.flatShading),
      (this.fog = e.fog),
      this
    );
  }
}
class Yu extends Rn {
  constructor(e) {
    (super(),
      (this.isMeshDepthMaterial = !0),
      (this.type = "MeshDepthMaterial"),
      (this.depthPacking = Mh),
      (this.map = null),
      (this.alphaMap = null),
      (this.displacementMap = null),
      (this.displacementScale = 1),
      (this.displacementBias = 0),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      this.setValues(e));
  }
  copy(e) {
    return (
      super.copy(e),
      (this.depthPacking = e.depthPacking),
      (this.map = e.map),
      (this.alphaMap = e.alphaMap),
      (this.displacementMap = e.displacementMap),
      (this.displacementScale = e.displacementScale),
      (this.displacementBias = e.displacementBias),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      this
    );
  }
}
class Zu extends Rn {
  constructor(e) {
    (super(),
      (this.isMeshDistanceMaterial = !0),
      (this.type = "MeshDistanceMaterial"),
      (this.map = null),
      (this.alphaMap = null),
      (this.displacementMap = null),
      (this.displacementScale = 1),
      (this.displacementBias = 0),
      this.setValues(e));
  }
  copy(e) {
    return (
      super.copy(e),
      (this.map = e.map),
      (this.alphaMap = e.alphaMap),
      (this.displacementMap = e.displacementMap),
      (this.displacementScale = e.displacementScale),
      (this.displacementBias = e.displacementBias),
      this
    );
  }
}
function Us(i, e) {
  return !i || i.constructor === e
    ? i
    : typeof e.BYTES_PER_ELEMENT == "number"
      ? new e(i)
      : Array.prototype.slice.call(i);
}
function Ku(i) {
  function e(s, r) {
    return i[s] - i[r];
  }
  const t = i.length,
    n = new Array(t);
  for (let s = 0; s !== t; ++s) n[s] = s;
  return (n.sort(e), n);
}
function dl(i, e, t) {
  const n = i.length,
    s = new i.constructor(n);
  for (let r = 0, a = 0; a !== n; ++r) {
    const o = t[r] * e;
    for (let c = 0; c !== e; ++c) s[a++] = i[o + c];
  }
  return s;
}
function Tc(i, e, t, n) {
  let s = 1,
    r = i[0];
  for (; r !== void 0 && r[n] === void 0;) r = i[s++];
  if (r === void 0) return;
  let a = r[n];
  if (a !== void 0)
    if (Array.isArray(a))
      do ((a = r[n]), a !== void 0 && (e.push(r.time), t.push(...a)), (r = i[s++]));
      while (r !== void 0);
    else if (a.toArray !== void 0)
      do ((a = r[n]), a !== void 0 && (e.push(r.time), a.toArray(t, t.length)), (r = i[s++]));
      while (r !== void 0);
    else
      do ((a = r[n]), a !== void 0 && (e.push(r.time), t.push(a)), (r = i[s++]));
      while (r !== void 0);
}
class is {
  constructor(e, t, n, s) {
    ((this.parameterPositions = e),
      (this._cachedIndex = 0),
      (this.resultBuffer = s !== void 0 ? s : new t.constructor(n)),
      (this.sampleValues = t),
      (this.valueSize = n),
      (this.settings = null),
      (this.DefaultSettings_ = {}));
  }
  evaluate(e) {
    const t = this.parameterPositions;
    let n = this._cachedIndex,
      s = t[n],
      r = t[n - 1];
    e: {
      t: {
        let a;
        n: {
          i: if (!(e < s)) {
            for (let o = n + 2; ;) {
              if (s === void 0) {
                if (e < r) break i;
                return ((n = t.length), (this._cachedIndex = n), this.copySampleValue_(n - 1));
              }
              if (n === o) break;
              if (((r = s), (s = t[++n]), e < s)) break t;
            }
            a = t.length;
            break n;
          }
          if (!(e >= r)) {
            const o = t[1];
            e < o && ((n = 2), (r = o));
            for (let c = n - 2; ;) {
              if (r === void 0) return ((this._cachedIndex = 0), this.copySampleValue_(0));
              if (n === c) break;
              if (((s = r), (r = t[--n - 1]), e >= r)) break t;
            }
            ((a = n), (n = 0));
            break n;
          }
          break e;
        }
        for (; n < a;) {
          const o = (n + a) >>> 1;
          e < t[o] ? (a = o) : (n = o + 1);
        }
        if (((s = t[n]), (r = t[n - 1]), r === void 0)) return ((this._cachedIndex = 0), this.copySampleValue_(0));
        if (s === void 0) return ((n = t.length), (this._cachedIndex = n), this.copySampleValue_(n - 1));
      }
      ((this._cachedIndex = n), this.intervalChanged_(n, r, s));
    }
    return this.interpolate_(n, r, e, s);
  }
  getSettings_() {
    return this.settings || this.DefaultSettings_;
  }
  copySampleValue_(e) {
    const t = this.resultBuffer,
      n = this.sampleValues,
      s = this.valueSize,
      r = e * s;
    for (let a = 0; a !== s; ++a) t[a] = n[r + a];
    return t;
  }
  interpolate_() {
    throw new Error("call to abstract method");
  }
  intervalChanged_() {}
}
class ju extends is {
  constructor(e, t, n, s) {
    (super(e, t, n, s),
      (this._weightPrev = -0),
      (this._offsetPrev = -0),
      (this._weightNext = -0),
      (this._offsetNext = -0),
      (this.DefaultSettings_ = { endingStart: vi, endingEnd: vi }));
  }
  intervalChanged_(e, t, n) {
    const s = this.parameterPositions;
    let r = e - 2,
      a = e + 1,
      o = s[r],
      c = s[a];
    if (o === void 0)
      switch (this.getSettings_().endingStart) {
        case Mi:
          ((r = e), (o = 2 * t - n));
          break;
        case Zs:
          ((r = s.length - 2), (o = t + s[r] - s[r + 1]));
          break;
        default:
          ((r = e), (o = n));
      }
    if (c === void 0)
      switch (this.getSettings_().endingEnd) {
        case Mi:
          ((a = e), (c = 2 * n - t));
          break;
        case Zs:
          ((a = 1), (c = n + s[1] - s[0]));
          break;
        default:
          ((a = e - 1), (c = t));
      }
    const l = (n - t) * 0.5,
      u = this.valueSize;
    ((this._weightPrev = l / (t - o)),
      (this._weightNext = l / (c - n)),
      (this._offsetPrev = r * u),
      (this._offsetNext = a * u));
  }
  interpolate_(e, t, n, s) {
    const r = this.resultBuffer,
      a = this.sampleValues,
      o = this.valueSize,
      c = e * o,
      l = c - o,
      u = this._offsetPrev,
      d = this._offsetNext,
      h = this._weightPrev,
      f = this._weightNext,
      g = (n - t) / (s - t),
      M = g * g,
      m = M * g,
      p = -h * m + 2 * h * M - h * g,
      S = (1 + h) * m + (-1.5 - 2 * h) * M + (-0.5 + h) * g + 1,
      E = (-1 - f) * m + (1.5 + f) * M + 0.5 * g,
      b = f * m - f * M;
    for (let R = 0; R !== o; ++R) r[R] = p * a[u + R] + S * a[l + R] + E * a[c + R] + b * a[d + R];
    return r;
  }
}
class Ac extends is {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  interpolate_(e, t, n, s) {
    const r = this.resultBuffer,
      a = this.sampleValues,
      o = this.valueSize,
      c = e * o,
      l = c - o,
      u = (n - t) / (s - t),
      d = 1 - u;
    for (let h = 0; h !== o; ++h) r[h] = a[l + h] * d + a[c + h] * u;
    return r;
  }
}
class $u extends is {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  interpolate_(e) {
    return this.copySampleValue_(e - 1);
  }
}
class Ju extends is {
  interpolate_(e, t, n, s) {
    const r = this.resultBuffer,
      a = this.sampleValues,
      o = this.valueSize,
      c = e * o,
      l = c - o,
      u = this.settings || this.DefaultSettings_,
      d = u.inTangents,
      h = u.outTangents;
    if (!d || !h) {
      const M = (n - t) / (s - t),
        m = 1 - M;
      for (let p = 0; p !== o; ++p) r[p] = a[l + p] * m + a[c + p] * M;
      return r;
    }
    const f = o * 2,
      g = e - 1;
    for (let M = 0; M !== o; ++M) {
      const m = a[l + M],
        p = a[c + M],
        S = g * f + M * 2,
        E = h[S],
        b = h[S + 1],
        R = e * f + M * 2,
        T = d[R],
        P = d[R + 1];
      let x = (n - t) / (s - t),
        A,
        L,
        w,
        N,
        H;
      for (let W = 0; W < 8; W++) {
        ((A = x * x), (L = A * x), (w = 1 - x), (N = w * w), (H = N * w));
        const V = H * t + 3 * N * x * E + 3 * w * A * T + L * s - n;
        if (Math.abs(V) < 1e-10) break;
        const G = 3 * N * (E - t) + 6 * w * x * (T - E) + 3 * A * (s - T);
        if (Math.abs(G) < 1e-10) break;
        ((x = x - V / G), (x = Math.max(0, Math.min(1, x))));
      }
      r[M] = H * m + 3 * N * x * b + 3 * w * A * P + L * p;
    }
    return r;
  }
}
class Qt {
  constructor(e, t, n, s) {
    if (e === void 0) throw new Error("THREE.KeyframeTrack: track name is undefined");
    if (t === void 0 || t.length === 0) throw new Error("THREE.KeyframeTrack: no keyframes in track named " + e);
    ((this.name = e),
      (this.times = Us(t, this.TimeBufferType)),
      (this.values = Us(n, this.ValueBufferType)),
      this.setInterpolation(s || this.DefaultInterpolation));
  }
  static toJSON(e) {
    const t = e.constructor;
    let n;
    if (t.toJSON !== this.toJSON) n = t.toJSON(e);
    else {
      n = { name: e.name, times: Us(e.times, Array), values: Us(e.values, Array) };
      const s = e.getInterpolation();
      s !== e.DefaultInterpolation && (n.interpolation = s);
    }
    return ((n.type = e.ValueTypeName), n);
  }
  InterpolantFactoryMethodDiscrete(e) {
    return new $u(this.times, this.values, this.getValueSize(), e);
  }
  InterpolantFactoryMethodLinear(e) {
    return new Ac(this.times, this.values, this.getValueSize(), e);
  }
  InterpolantFactoryMethodSmooth(e) {
    return new ju(this.times, this.values, this.getValueSize(), e);
  }
  InterpolantFactoryMethodBezier(e) {
    const t = new Ju(this.times, this.values, this.getValueSize(), e);
    return (this.settings && (t.settings = this.settings), t);
  }
  setInterpolation(e) {
    let t;
    switch (e) {
      case Ys:
        t = this.InterpolantFactoryMethodDiscrete;
        break;
      case Oa:
        t = this.InterpolantFactoryMethodLinear;
        break;
      case gr:
        t = this.InterpolantFactoryMethodSmooth;
        break;
      case Co:
        t = this.InterpolantFactoryMethodBezier;
        break;
    }
    if (t === void 0) {
      const n = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
      if (this.createInterpolant === void 0)
        if (e !== this.DefaultInterpolation) this.setInterpolation(this.DefaultInterpolation);
        else throw new Error(n);
      return (xe("KeyframeTrack:", n), this);
    }
    return ((this.createInterpolant = t), this);
  }
  getInterpolation() {
    switch (this.createInterpolant) {
      case this.InterpolantFactoryMethodDiscrete:
        return Ys;
      case this.InterpolantFactoryMethodLinear:
        return Oa;
      case this.InterpolantFactoryMethodSmooth:
        return gr;
      case this.InterpolantFactoryMethodBezier:
        return Co;
    }
  }
  getValueSize() {
    return this.values.length / this.times.length;
  }
  shift(e) {
    if (e !== 0) {
      const t = this.times;
      for (let n = 0, s = t.length; n !== s; ++n) t[n] += e;
    }
    return this;
  }
  scale(e) {
    if (e !== 1) {
      const t = this.times;
      for (let n = 0, s = t.length; n !== s; ++n) t[n] *= e;
    }
    return this;
  }
  trim(e, t) {
    const n = this.times,
      s = n.length;
    let r = 0,
      a = s - 1;
    for (; r !== s && n[r] < e;) ++r;
    for (; a !== -1 && n[a] > t;) --a;
    if ((++a, r !== 0 || a !== s)) {
      r >= a && ((a = Math.max(a, 1)), (r = a - 1));
      const o = this.getValueSize();
      ((this.times = n.slice(r, a)), (this.values = this.values.slice(r * o, a * o)));
    }
    return this;
  }
  validate() {
    let e = !0;
    const t = this.getValueSize();
    t - Math.floor(t) !== 0 && (Te("KeyframeTrack: Invalid value size in track.", this), (e = !1));
    const n = this.times,
      s = this.values,
      r = n.length;
    r === 0 && (Te("KeyframeTrack: Track is empty.", this), (e = !1));
    let a = null;
    for (let o = 0; o !== r; o++) {
      const c = n[o];
      if (typeof c == "number" && isNaN(c)) {
        (Te("KeyframeTrack: Time is not a valid number.", this, o, c), (e = !1));
        break;
      }
      if (a !== null && a > c) {
        (Te("KeyframeTrack: Out of order keys.", this, o, c, a), (e = !1));
        break;
      }
      a = c;
    }
    if (s !== void 0 && Ch(s))
      for (let o = 0, c = s.length; o !== c; ++o) {
        const l = s[o];
        if (isNaN(l)) {
          (Te("KeyframeTrack: Value is not a valid number.", this, o, l), (e = !1));
          break;
        }
      }
    return e;
  }
  optimize() {
    const e = this.times.slice(),
      t = this.values.slice(),
      n = this.getValueSize(),
      s = this.getInterpolation() === gr,
      r = e.length - 1;
    let a = 1;
    for (let o = 1; o < r; ++o) {
      let c = !1;
      const l = e[o],
        u = e[o + 1];
      if (l !== u && (o !== 1 || l !== e[0]))
        if (s) c = !0;
        else {
          const d = o * n,
            h = d - n,
            f = d + n;
          for (let g = 0; g !== n; ++g) {
            const M = t[d + g];
            if (M !== t[h + g] || M !== t[f + g]) {
              c = !0;
              break;
            }
          }
        }
      if (c) {
        if (o !== a) {
          e[a] = e[o];
          const d = o * n,
            h = a * n;
          for (let f = 0; f !== n; ++f) t[h + f] = t[d + f];
        }
        ++a;
      }
    }
    if (r > 0) {
      e[a] = e[r];
      for (let o = r * n, c = a * n, l = 0; l !== n; ++l) t[c + l] = t[o + l];
      ++a;
    }
    return (
      a !== e.length
        ? ((this.times = e.slice(0, a)), (this.values = t.slice(0, a * n)))
        : ((this.times = e), (this.values = t)),
      this
    );
  }
  clone() {
    const e = this.times.slice(),
      t = this.values.slice(),
      n = this.constructor,
      s = new n(this.name, e, t);
    return ((s.createInterpolant = this.createInterpolant), s);
  }
}
Qt.prototype.ValueTypeName = "";
Qt.prototype.TimeBufferType = Float32Array;
Qt.prototype.ValueBufferType = Float32Array;
Qt.prototype.DefaultInterpolation = Oa;
class Ci extends Qt {
  constructor(e, t, n) {
    super(e, t, n);
  }
}
Ci.prototype.ValueTypeName = "bool";
Ci.prototype.ValueBufferType = Array;
Ci.prototype.DefaultInterpolation = Ys;
Ci.prototype.InterpolantFactoryMethodLinear = void 0;
Ci.prototype.InterpolantFactoryMethodSmooth = void 0;
class wc extends Qt {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
}
wc.prototype.ValueTypeName = "color";
class er extends Qt {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
}
er.prototype.ValueTypeName = "number";
class Qu extends is {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  interpolate_(e, t, n, s) {
    const r = this.resultBuffer,
      a = this.sampleValues,
      o = this.valueSize,
      c = (n - t) / (s - t);
    let l = e * o;
    for (let u = l + o; l !== u; l += 4) ln.slerpFlat(r, 0, a, l - o, a, l, c);
    return r;
  }
}
class lr extends Qt {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  InterpolantFactoryMethodLinear(e) {
    return new Qu(this.times, this.values, this.getValueSize(), e);
  }
}
lr.prototype.ValueTypeName = "quaternion";
lr.prototype.InterpolantFactoryMethodSmooth = void 0;
class Pi extends Qt {
  constructor(e, t, n) {
    super(e, t, n);
  }
}
Pi.prototype.ValueTypeName = "string";
Pi.prototype.ValueBufferType = Array;
Pi.prototype.DefaultInterpolation = Ys;
Pi.prototype.InterpolantFactoryMethodLinear = void 0;
Pi.prototype.InterpolantFactoryMethodSmooth = void 0;
class tr extends Qt {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
}
tr.prototype.ValueTypeName = "vector";
class fl {
  constructor(e = "", t = -1, n = [], s = Qa) {
    ((this.name = e),
      (this.tracks = n),
      (this.duration = t),
      (this.blendMode = s),
      (this.uuid = Jt()),
      (this.userData = {}),
      this.duration < 0 && this.resetDuration());
  }
  static parse(e) {
    const t = [],
      n = e.tracks,
      s = 1 / (e.fps || 1);
    for (let a = 0, o = n.length; a !== o; ++a) t.push(td(n[a]).scale(s));
    const r = new this(e.name, e.duration, t, e.blendMode);
    return ((r.uuid = e.uuid), (r.userData = JSON.parse(e.userData || "{}")), r);
  }
  static toJSON(e) {
    const t = [],
      n = e.tracks,
      s = {
        name: e.name,
        duration: e.duration,
        tracks: t,
        uuid: e.uuid,
        blendMode: e.blendMode,
        userData: JSON.stringify(e.userData),
      };
    for (let r = 0, a = n.length; r !== a; ++r) t.push(Qt.toJSON(n[r]));
    return s;
  }
  static CreateFromMorphTargetSequence(e, t, n, s) {
    const r = t.length,
      a = [];
    for (let o = 0; o < r; o++) {
      let c = [],
        l = [];
      (c.push((o + r - 1) % r, o, (o + 1) % r), l.push(0, 1, 0));
      const u = Ku(c);
      ((c = dl(c, 1, u)),
        (l = dl(l, 1, u)),
        !s && c[0] === 0 && (c.push(r), l.push(l[0])),
        a.push(new er(".morphTargetInfluences[" + t[o].name + "]", c, l).scale(1 / n)));
    }
    return new this(e, -1, a);
  }
  static findByName(e, t) {
    let n = e;
    if (!Array.isArray(e)) {
      const s = e;
      n = (s.geometry && s.geometry.animations) || s.animations;
    }
    for (let s = 0; s < n.length; s++) if (n[s].name === t) return n[s];
    return null;
  }
  static CreateClipsFromMorphTargetSequences(e, t, n) {
    const s = {},
      r = /^([\w-]*?)([\d]+)$/;
    for (let o = 0, c = e.length; o < c; o++) {
      const l = e[o],
        u = l.name.match(r);
      if (u && u.length > 1) {
        const d = u[1];
        let h = s[d];
        (h || (s[d] = h = []), h.push(l));
      }
    }
    const a = [];
    for (const o in s) a.push(this.CreateFromMorphTargetSequence(o, s[o], t, n));
    return a;
  }
  static parseAnimation(e, t) {
    if ((xe("AnimationClip: parseAnimation() is deprecated and will be removed with r185"), !e))
      return (Te("AnimationClip: No animation in JSONLoader data."), null);
    const n = function (d, h, f, g, M) {
        if (f.length !== 0) {
          const m = [],
            p = [];
          (Tc(f, m, p, g), m.length !== 0 && M.push(new d(h, m, p)));
        }
      },
      s = [],
      r = e.name || "default",
      a = e.fps || 30,
      o = e.blendMode;
    let c = e.length || -1;
    const l = e.hierarchy || [];
    for (let d = 0; d < l.length; d++) {
      const h = l[d].keys;
      if (!(!h || h.length === 0))
        if (h[0].morphTargets) {
          const f = {};
          let g;
          for (g = 0; g < h.length; g++)
            if (h[g].morphTargets) for (let M = 0; M < h[g].morphTargets.length; M++) f[h[g].morphTargets[M]] = -1;
          for (const M in f) {
            const m = [],
              p = [];
            for (let S = 0; S !== h[g].morphTargets.length; ++S) {
              const E = h[g];
              (m.push(E.time), p.push(E.morphTarget === M ? 1 : 0));
            }
            s.push(new er(".morphTargetInfluence[" + M + "]", m, p));
          }
          c = f.length * a;
        } else {
          const f = ".bones[" + t[d].name + "]";
          (n(tr, f + ".position", h, "pos", s),
            n(lr, f + ".quaternion", h, "rot", s),
            n(tr, f + ".scale", h, "scl", s));
        }
    }
    return s.length === 0 ? null : new this(r, c, s, o);
  }
  resetDuration() {
    const e = this.tracks;
    let t = 0;
    for (let n = 0, s = e.length; n !== s; ++n) {
      const r = this.tracks[n];
      t = Math.max(t, r.times[r.times.length - 1]);
    }
    return ((this.duration = t), this);
  }
  trim() {
    for (let e = 0; e < this.tracks.length; e++) this.tracks[e].trim(0, this.duration);
    return this;
  }
  validate() {
    let e = !0;
    for (let t = 0; t < this.tracks.length; t++) e = e && this.tracks[t].validate();
    return e;
  }
  optimize() {
    for (let e = 0; e < this.tracks.length; e++) this.tracks[e].optimize();
    return this;
  }
  clone() {
    const e = [];
    for (let n = 0; n < this.tracks.length; n++) e.push(this.tracks[n].clone());
    const t = new this.constructor(this.name, this.duration, e, this.blendMode);
    return ((t.userData = JSON.parse(JSON.stringify(this.userData))), t);
  }
  toJSON() {
    return this.constructor.toJSON(this);
  }
}
function ed(i) {
  switch (i.toLowerCase()) {
    case "scalar":
    case "double":
    case "float":
    case "number":
    case "integer":
      return er;
    case "vector":
    case "vector2":
    case "vector3":
    case "vector4":
      return tr;
    case "color":
      return wc;
    case "quaternion":
      return lr;
    case "bool":
    case "boolean":
      return Ci;
    case "string":
      return Pi;
  }
  throw new Error("THREE.KeyframeTrack: Unsupported typeName: " + i);
}
function td(i) {
  if (i.type === void 0) throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");
  const e = ed(i.type);
  if (i.times === void 0) {
    const t = [],
      n = [];
    (Tc(i.keys, t, n, "value"), (i.times = t), (i.values = n));
  }
  return e.parse !== void 0 ? e.parse(i) : new e(i.name, i.times, i.values, i.interpolation);
}
const Sn = {
  enabled: !1,
  files: {},
  add: function (i, e) {
    this.enabled !== !1 && (pl(i) || (this.files[i] = e));
  },
  get: function (i) {
    if (this.enabled !== !1 && !pl(i)) return this.files[i];
  },
  remove: function (i) {
    delete this.files[i];
  },
  clear: function () {
    this.files = {};
  },
};
function pl(i) {
  try {
    const e = i.slice(i.indexOf(":") + 1);
    return new URL(e).protocol === "blob:";
  } catch {
    return !1;
  }
}
class nd {
  constructor(e, t, n) {
    const s = this;
    let r = !1,
      a = 0,
      o = 0,
      c;
    const l = [];
    ((this.onStart = void 0),
      (this.onLoad = e),
      (this.onProgress = t),
      (this.onError = n),
      (this._abortController = null),
      (this.itemStart = function (u) {
        (o++, r === !1 && s.onStart !== void 0 && s.onStart(u, a, o), (r = !0));
      }),
      (this.itemEnd = function (u) {
        (a++,
          s.onProgress !== void 0 && s.onProgress(u, a, o),
          a === o && ((r = !1), s.onLoad !== void 0 && s.onLoad()));
      }),
      (this.itemError = function (u) {
        s.onError !== void 0 && s.onError(u);
      }),
      (this.resolveURL = function (u) {
        return c ? c(u) : u;
      }),
      (this.setURLModifier = function (u) {
        return ((c = u), this);
      }),
      (this.addHandler = function (u, d) {
        return (l.push(u, d), this);
      }),
      (this.removeHandler = function (u) {
        const d = l.indexOf(u);
        return (d !== -1 && l.splice(d, 2), this);
      }),
      (this.getHandler = function (u) {
        for (let d = 0, h = l.length; d < h; d += 2) {
          const f = l[d],
            g = l[d + 1];
          if ((f.global && (f.lastIndex = 0), f.test(u))) return g;
        }
        return null;
      }),
      (this.abort = function () {
        return (this.abortController.abort(), (this._abortController = null), this);
      }));
  }
  get abortController() {
    return (this._abortController || (this._abortController = new AbortController()), this._abortController);
  }
}
const id = new nd();
class Ii {
  constructor(e) {
    ((this.manager = e !== void 0 ? e : id),
      (this.crossOrigin = "anonymous"),
      (this.withCredentials = !1),
      (this.path = ""),
      (this.resourcePath = ""),
      (this.requestHeader = {}),
      typeof __THREE_DEVTOOLS__ < "u" &&
        __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this })));
  }
  load() {}
  loadAsync(e, t) {
    const n = this;
    return new Promise(function (s, r) {
      n.load(e, s, t, r);
    });
  }
  parse() {}
  setCrossOrigin(e) {
    return ((this.crossOrigin = e), this);
  }
  setWithCredentials(e) {
    return ((this.withCredentials = e), this);
  }
  setPath(e) {
    return ((this.path = e), this);
  }
  setResourcePath(e) {
    return ((this.resourcePath = e), this);
  }
  setRequestHeader(e) {
    return ((this.requestHeader = e), this);
  }
  abort() {
    return this;
  }
}
Ii.DEFAULT_MATERIAL_NAME = "__DEFAULT";
const vn = {};
class sd extends Error {
  constructor(e, t) {
    (super(e), (this.response = t));
  }
}
class rd extends Ii {
  constructor(e) {
    (super(e), (this.mimeType = ""), (this.responseType = ""), (this._abortController = new AbortController()));
  }
  load(e, t, n, s) {
    (e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), (e = this.manager.resolveURL(e)));
    const r = Sn.get(`file:${e}`);
    if (r !== void 0) {
      (this.manager.itemStart(e),
        setTimeout(() => {
          (t && t(r), this.manager.itemEnd(e));
        }, 0));
      return;
    }
    if (vn[e] !== void 0) {
      vn[e].push({ onLoad: t, onProgress: n, onError: s });
      return;
    }
    ((vn[e] = []), vn[e].push({ onLoad: t, onProgress: n, onError: s }));
    const a = new Request(e, {
        headers: new Headers(this.requestHeader),
        credentials: this.withCredentials ? "include" : "same-origin",
        signal:
          typeof AbortSignal.any == "function"
            ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal])
            : this._abortController.signal,
      }),
      o = this.mimeType,
      c = this.responseType;
    (fetch(a)
      .then((l) => {
        if (l.status === 200 || l.status === 0) {
          if (
            (l.status === 0 && xe("FileLoader: HTTP Status 0 received."),
            typeof ReadableStream > "u" || l.body === void 0 || l.body.getReader === void 0)
          )
            return l;
          const u = vn[e],
            d = l.body.getReader(),
            h = l.headers.get("X-File-Size") || l.headers.get("Content-Length"),
            f = h ? parseInt(h) : 0,
            g = f !== 0;
          let M = 0;
          const m = new ReadableStream({
            start(p) {
              S();
              function S() {
                d.read().then(
                  ({ done: E, value: b }) => {
                    if (E) p.close();
                    else {
                      M += b.byteLength;
                      const R = new ProgressEvent("progress", { lengthComputable: g, loaded: M, total: f });
                      for (let T = 0, P = u.length; T < P; T++) {
                        const x = u[T];
                        x.onProgress && x.onProgress(R);
                      }
                      (p.enqueue(b), S());
                    }
                  },
                  (E) => {
                    p.error(E);
                  },
                );
              }
            },
          });
          return new Response(m);
        } else throw new sd(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`, l);
      })
      .then((l) => {
        switch (c) {
          case "arraybuffer":
            return l.arrayBuffer();
          case "blob":
            return l.blob();
          case "document":
            return l.text().then((u) => new DOMParser().parseFromString(u, o));
          case "json":
            return l.json();
          default:
            if (o === "") return l.text();
            {
              const d = /charset="?([^;"\s]*)"?/i.exec(o),
                h = d && d[1] ? d[1].toLowerCase() : void 0,
                f = new TextDecoder(h);
              return l.arrayBuffer().then((g) => f.decode(g));
            }
        }
      })
      .then((l) => {
        Sn.add(`file:${e}`, l);
        const u = vn[e];
        delete vn[e];
        for (let d = 0, h = u.length; d < h; d++) {
          const f = u[d];
          f.onLoad && f.onLoad(l);
        }
      })
      .catch((l) => {
        const u = vn[e];
        if (u === void 0) throw (this.manager.itemError(e), l);
        delete vn[e];
        for (let d = 0, h = u.length; d < h; d++) {
          const f = u[d];
          f.onError && f.onError(l);
        }
        this.manager.itemError(e);
      })
      .finally(() => {
        this.manager.itemEnd(e);
      }),
      this.manager.itemStart(e));
  }
  setResponseType(e) {
    return ((this.responseType = e), this);
  }
  setMimeType(e) {
    return ((this.mimeType = e), this);
  }
  abort() {
    return (this._abortController.abort(), (this._abortController = new AbortController()), this);
  }
}
const mi = new WeakMap();
class ad extends Ii {
  constructor(e) {
    super(e);
  }
  load(e, t, n, s) {
    (this.path !== void 0 && (e = this.path + e), (e = this.manager.resolveURL(e)));
    const r = this,
      a = Sn.get(`image:${e}`);
    if (a !== void 0) {
      if (a.complete === !0)
        (r.manager.itemStart(e),
          setTimeout(function () {
            (t && t(a), r.manager.itemEnd(e));
          }, 0));
      else {
        let d = mi.get(a);
        (d === void 0 && ((d = []), mi.set(a, d)), d.push({ onLoad: t, onError: s }));
      }
      return a;
    }
    const o = Ji("img");
    function c() {
      (u(), t && t(this));
      const d = mi.get(this) || [];
      for (let h = 0; h < d.length; h++) {
        const f = d[h];
        f.onLoad && f.onLoad(this);
      }
      (mi.delete(this), r.manager.itemEnd(e));
    }
    function l(d) {
      (u(), s && s(d), Sn.remove(`image:${e}`));
      const h = mi.get(this) || [];
      for (let f = 0; f < h.length; f++) {
        const g = h[f];
        g.onError && g.onError(d);
      }
      (mi.delete(this), r.manager.itemError(e), r.manager.itemEnd(e));
    }
    function u() {
      (o.removeEventListener("load", c, !1), o.removeEventListener("error", l, !1));
    }
    return (
      o.addEventListener("load", c, !1),
      o.addEventListener("error", l, !1),
      e.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (o.crossOrigin = this.crossOrigin),
      Sn.add(`image:${e}`, o),
      r.manager.itemStart(e),
      (o.src = e),
      o
    );
  }
}
class F_ extends Ii {
  constructor(e) {
    super(e);
  }
  load(e, t, n, s) {
    const r = this,
      a = new ar(),
      o = new rd(this.manager);
    return (
      o.setResponseType("arraybuffer"),
      o.setRequestHeader(this.requestHeader),
      o.setPath(this.path),
      o.setWithCredentials(r.withCredentials),
      o.load(
        e,
        function (c) {
          let l;
          try {
            l = r.parse(c);
          } catch (u) {
            s !== void 0 ? s(u) : Te(u);
            return;
          }
          (l.image !== void 0
            ? (a.image = l.image)
            : l.data !== void 0 && ((a.image.width = l.width), (a.image.height = l.height), (a.image.data = l.data)),
            (a.wrapS = l.wrapS !== void 0 ? l.wrapS : $t),
            (a.wrapT = l.wrapT !== void 0 ? l.wrapT : $t),
            (a.magFilter = l.magFilter !== void 0 ? l.magFilter : vt),
            (a.minFilter = l.minFilter !== void 0 ? l.minFilter : vt),
            (a.anisotropy = l.anisotropy !== void 0 ? l.anisotropy : 1),
            l.colorSpace !== void 0 && (a.colorSpace = l.colorSpace),
            l.flipY !== void 0 && (a.flipY = l.flipY),
            l.format !== void 0 && (a.format = l.format),
            l.type !== void 0 && (a.type = l.type),
            l.mipmaps !== void 0 && ((a.mipmaps = l.mipmaps), (a.minFilter = zn)),
            l.mipmapCount === 1 && (a.minFilter = vt),
            l.generateMipmaps !== void 0 && (a.generateMipmaps = l.generateMipmaps),
            (a.needsUpdate = !0),
            t && t(a, l));
        },
        n,
        s,
      ),
      a
    );
  }
}
class O_ extends Ii {
  constructor(e) {
    super(e);
  }
  load(e, t, n, s) {
    const r = new Rt(),
      a = new ad(this.manager);
    return (
      a.setCrossOrigin(this.crossOrigin),
      a.setPath(this.path),
      a.load(
        e,
        function (o) {
          ((r.image = o), (r.needsUpdate = !0), t !== void 0 && t(r));
        },
        n,
        s,
      ),
      r
    );
  }
}
class ss extends dt {
  constructor(e, t = 1) {
    (super(), (this.isLight = !0), (this.type = "Light"), (this.color = new Ce(e)), (this.intensity = t));
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  copy(e, t) {
    return (super.copy(e, t), this.color.copy(e.color), (this.intensity = e.intensity), this);
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return ((t.object.color = this.color.getHex()), (t.object.intensity = this.intensity), t);
  }
}
class B_ extends ss {
  constructor(e, t, n) {
    (super(e, n),
      (this.isHemisphereLight = !0),
      (this.type = "HemisphereLight"),
      this.position.copy(dt.DEFAULT_UP),
      this.updateMatrix(),
      (this.groundColor = new Ce(t)));
  }
  copy(e, t) {
    return (super.copy(e, t), this.groundColor.copy(e.groundColor), this);
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return ((t.object.groundColor = this.groundColor.getHex()), t);
  }
}
const Gr = new He(),
  ml = new F(),
  gl = new F();
class ao {
  constructor(e) {
    ((this.camera = e),
      (this.intensity = 1),
      (this.bias = 0),
      (this.biasNode = null),
      (this.normalBias = 0),
      (this.radius = 1),
      (this.blurSamples = 8),
      (this.mapSize = new Ge(512, 512)),
      (this.mapType = Bt),
      (this.map = null),
      (this.mapPass = null),
      (this.matrix = new He()),
      (this.autoUpdate = !0),
      (this.needsUpdate = !1),
      (this._frustum = new so()),
      (this._frameExtents = new Ge(1, 1)),
      (this._viewportCount = 1),
      (this._viewports = [new it(0, 0, 1, 1)]));
  }
  getViewportCount() {
    return this._viewportCount;
  }
  getFrustum() {
    return this._frustum;
  }
  updateMatrices(e) {
    const t = this.camera,
      n = this.matrix;
    (ml.setFromMatrixPosition(e.matrixWorld),
      t.position.copy(ml),
      gl.setFromMatrixPosition(e.target.matrixWorld),
      t.lookAt(gl),
      t.updateMatrixWorld(),
      Gr.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse),
      this._frustum.setFromProjectionMatrix(Gr, t.coordinateSystem, t.reversedDepth),
      t.coordinateSystem === $i || t.reversedDepth
        ? n.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 1, 0, 0, 0, 0, 1)
        : n.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1),
      n.multiply(Gr));
  }
  getViewport(e) {
    return this._viewports[e];
  }
  getFrameExtents() {
    return this._frameExtents;
  }
  dispose() {
    (this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose());
  }
  copy(e) {
    return (
      (this.camera = e.camera.clone()),
      (this.intensity = e.intensity),
      (this.bias = e.bias),
      (this.radius = e.radius),
      (this.autoUpdate = e.autoUpdate),
      (this.needsUpdate = e.needsUpdate),
      (this.normalBias = e.normalBias),
      (this.blurSamples = e.blurSamples),
      this.mapSize.copy(e.mapSize),
      (this.biasNode = e.biasNode),
      this
    );
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    const e = {};
    return (
      this.intensity !== 1 && (e.intensity = this.intensity),
      this.bias !== 0 && (e.bias = this.bias),
      this.normalBias !== 0 && (e.normalBias = this.normalBias),
      this.radius !== 1 && (e.radius = this.radius),
      (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (e.mapSize = this.mapSize.toArray()),
      (e.camera = this.camera.toJSON(!1).object),
      delete e.camera.matrix,
      e
    );
  }
}
const Ns = new F(),
  Fs = new ln(),
  nn = new F();
class Rc extends dt {
  constructor() {
    (super(),
      (this.isCamera = !0),
      (this.type = "Camera"),
      (this.matrixWorldInverse = new He()),
      (this.projectionMatrix = new He()),
      (this.projectionMatrixInverse = new He()),
      (this.coordinateSystem = an),
      (this._reversedDepth = !1));
  }
  get reversedDepth() {
    return this._reversedDepth;
  }
  copy(e, t) {
    return (
      super.copy(e, t),
      this.matrixWorldInverse.copy(e.matrixWorldInverse),
      this.projectionMatrix.copy(e.projectionMatrix),
      this.projectionMatrixInverse.copy(e.projectionMatrixInverse),
      (this.coordinateSystem = e.coordinateSystem),
      this
    );
  }
  getWorldDirection(e) {
    return super.getWorldDirection(e).negate();
  }
  updateMatrixWorld(e) {
    (super.updateMatrixWorld(e),
      this.matrixWorld.decompose(Ns, Fs, nn),
      nn.x === 1 && nn.y === 1 && nn.z === 1
        ? this.matrixWorldInverse.copy(this.matrixWorld).invert()
        : this.matrixWorldInverse.compose(Ns, Fs, nn.set(1, 1, 1)).invert());
  }
  updateWorldMatrix(e, t) {
    (super.updateWorldMatrix(e, t),
      this.matrixWorld.decompose(Ns, Fs, nn),
      nn.x === 1 && nn.y === 1 && nn.z === 1
        ? this.matrixWorldInverse.copy(this.matrixWorld).invert()
        : this.matrixWorldInverse.compose(Ns, Fs, nn.set(1, 1, 1)).invert());
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const On = new F(),
  _l = new Ge(),
  xl = new Ge();
class Ot extends Rc {
  constructor(e = 50, t = 1, n = 0.1, s = 2e3) {
    (super(),
      (this.isPerspectiveCamera = !0),
      (this.type = "PerspectiveCamera"),
      (this.fov = e),
      (this.zoom = 1),
      (this.near = n),
      (this.far = s),
      (this.focus = 10),
      (this.aspect = t),
      (this.view = null),
      (this.filmGauge = 35),
      (this.filmOffset = 0),
      this.updateProjectionMatrix());
  }
  copy(e, t) {
    return (
      super.copy(e, t),
      (this.fov = e.fov),
      (this.zoom = e.zoom),
      (this.near = e.near),
      (this.far = e.far),
      (this.focus = e.focus),
      (this.aspect = e.aspect),
      (this.view = e.view === null ? null : Object.assign({}, e.view)),
      (this.filmGauge = e.filmGauge),
      (this.filmOffset = e.filmOffset),
      this
    );
  }
  setFocalLength(e) {
    const t = (0.5 * this.getFilmHeight()) / e;
    ((this.fov = Ti * 2 * Math.atan(t)), this.updateProjectionMatrix());
  }
  getFocalLength() {
    const e = Math.tan(qi * 0.5 * this.fov);
    return (0.5 * this.getFilmHeight()) / e;
  }
  getEffectiveFOV() {
    return Ti * 2 * Math.atan(Math.tan(qi * 0.5 * this.fov) / this.zoom);
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  getViewBounds(e, t, n) {
    (On.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse),
      t.set(On.x, On.y).multiplyScalar(-e / On.z),
      On.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse),
      n.set(On.x, On.y).multiplyScalar(-e / On.z));
  }
  getViewSize(e, t) {
    return (this.getViewBounds(e, _l, xl), t.subVectors(xl, _l));
  }
  setViewOffset(e, t, n, s, r, a) {
    ((this.aspect = e / t),
      this.view === null &&
        (this.view = { enabled: !0, fullWidth: 1, fullHeight: 1, offsetX: 0, offsetY: 0, width: 1, height: 1 }),
      (this.view.enabled = !0),
      (this.view.fullWidth = e),
      (this.view.fullHeight = t),
      (this.view.offsetX = n),
      (this.view.offsetY = s),
      (this.view.width = r),
      (this.view.height = a),
      this.updateProjectionMatrix());
  }
  clearViewOffset() {
    (this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix());
  }
  updateProjectionMatrix() {
    const e = this.near;
    let t = (e * Math.tan(qi * 0.5 * this.fov)) / this.zoom,
      n = 2 * t,
      s = this.aspect * n,
      r = -0.5 * s;
    const a = this.view;
    if (this.view !== null && this.view.enabled) {
      const c = a.fullWidth,
        l = a.fullHeight;
      ((r += (a.offsetX * s) / c), (t -= (a.offsetY * n) / l), (s *= a.width / c), (n *= a.height / l));
    }
    const o = this.filmOffset;
    (o !== 0 && (r += (e * o) / this.getFilmWidth()),
      this.projectionMatrix.makePerspective(r, r + s, t, t - n, e, this.far, this.coordinateSystem, this.reversedDepth),
      this.projectionMatrixInverse.copy(this.projectionMatrix).invert());
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return (
      (t.object.fov = this.fov),
      (t.object.zoom = this.zoom),
      (t.object.near = this.near),
      (t.object.far = this.far),
      (t.object.focus = this.focus),
      (t.object.aspect = this.aspect),
      this.view !== null && (t.object.view = Object.assign({}, this.view)),
      (t.object.filmGauge = this.filmGauge),
      (t.object.filmOffset = this.filmOffset),
      t
    );
  }
}
class od extends ao {
  constructor() {
    (super(new Ot(50, 1, 0.5, 500)), (this.isSpotLightShadow = !0), (this.focus = 1), (this.aspect = 1));
  }
  updateMatrices(e) {
    const t = this.camera,
      n = Ti * 2 * e.angle * this.focus,
      s = (this.mapSize.width / this.mapSize.height) * this.aspect,
      r = e.distance || t.far;
    ((n !== t.fov || s !== t.aspect || r !== t.far) &&
      ((t.fov = n), (t.aspect = s), (t.far = r), t.updateProjectionMatrix()),
      super.updateMatrices(e));
  }
  copy(e) {
    return (super.copy(e), (this.focus = e.focus), this);
  }
}
class z_ extends ss {
  constructor(e, t, n = 0, s = Math.PI / 3, r = 0, a = 2) {
    (super(e, t),
      (this.isSpotLight = !0),
      (this.type = "SpotLight"),
      this.position.copy(dt.DEFAULT_UP),
      this.updateMatrix(),
      (this.target = new dt()),
      (this.distance = n),
      (this.angle = s),
      (this.penumbra = r),
      (this.decay = a),
      (this.map = null),
      (this.shadow = new od()));
  }
  get power() {
    return this.intensity * Math.PI;
  }
  set power(e) {
    this.intensity = e / Math.PI;
  }
  dispose() {
    (super.dispose(), this.shadow.dispose());
  }
  copy(e, t) {
    return (
      super.copy(e, t),
      (this.distance = e.distance),
      (this.angle = e.angle),
      (this.penumbra = e.penumbra),
      (this.decay = e.decay),
      (this.target = e.target.clone()),
      (this.map = e.map),
      (this.shadow = e.shadow.clone()),
      this
    );
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return (
      (t.object.distance = this.distance),
      (t.object.angle = this.angle),
      (t.object.decay = this.decay),
      (t.object.penumbra = this.penumbra),
      (t.object.target = this.target.uuid),
      this.map && this.map.isTexture && (t.object.map = this.map.toJSON(e).uuid),
      (t.object.shadow = this.shadow.toJSON()),
      t
    );
  }
}
class ld extends ao {
  constructor() {
    (super(new Ot(90, 1, 0.5, 500)), (this.isPointLightShadow = !0));
  }
}
class V_ extends ss {
  constructor(e, t, n = 0, s = 2) {
    (super(e, t),
      (this.isPointLight = !0),
      (this.type = "PointLight"),
      (this.distance = n),
      (this.decay = s),
      (this.shadow = new ld()));
  }
  get power() {
    return this.intensity * 4 * Math.PI;
  }
  set power(e) {
    this.intensity = e / (4 * Math.PI);
  }
  dispose() {
    (super.dispose(), this.shadow.dispose());
  }
  copy(e, t) {
    return (
      super.copy(e, t),
      (this.distance = e.distance),
      (this.decay = e.decay),
      (this.shadow = e.shadow.clone()),
      this
    );
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return (
      (t.object.distance = this.distance),
      (t.object.decay = this.decay),
      (t.object.shadow = this.shadow.toJSON()),
      t
    );
  }
}
class oo extends Rc {
  constructor(e = -1, t = 1, n = 1, s = -1, r = 0.1, a = 2e3) {
    (super(),
      (this.isOrthographicCamera = !0),
      (this.type = "OrthographicCamera"),
      (this.zoom = 1),
      (this.view = null),
      (this.left = e),
      (this.right = t),
      (this.top = n),
      (this.bottom = s),
      (this.near = r),
      (this.far = a),
      this.updateProjectionMatrix());
  }
  copy(e, t) {
    return (
      super.copy(e, t),
      (this.left = e.left),
      (this.right = e.right),
      (this.top = e.top),
      (this.bottom = e.bottom),
      (this.near = e.near),
      (this.far = e.far),
      (this.zoom = e.zoom),
      (this.view = e.view === null ? null : Object.assign({}, e.view)),
      this
    );
  }
  setViewOffset(e, t, n, s, r, a) {
    (this.view === null &&
      (this.view = { enabled: !0, fullWidth: 1, fullHeight: 1, offsetX: 0, offsetY: 0, width: 1, height: 1 }),
      (this.view.enabled = !0),
      (this.view.fullWidth = e),
      (this.view.fullHeight = t),
      (this.view.offsetX = n),
      (this.view.offsetY = s),
      (this.view.width = r),
      (this.view.height = a),
      this.updateProjectionMatrix());
  }
  clearViewOffset() {
    (this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix());
  }
  updateProjectionMatrix() {
    const e = (this.right - this.left) / (2 * this.zoom),
      t = (this.top - this.bottom) / (2 * this.zoom),
      n = (this.right + this.left) / 2,
      s = (this.top + this.bottom) / 2;
    let r = n - e,
      a = n + e,
      o = s + t,
      c = s - t;
    if (this.view !== null && this.view.enabled) {
      const l = (this.right - this.left) / this.view.fullWidth / this.zoom,
        u = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      ((r += l * this.view.offsetX),
        (a = r + l * this.view.width),
        (o -= u * this.view.offsetY),
        (c = o - u * this.view.height));
    }
    (this.projectionMatrix.makeOrthographic(r, a, o, c, this.near, this.far, this.coordinateSystem, this.reversedDepth),
      this.projectionMatrixInverse.copy(this.projectionMatrix).invert());
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return (
      (t.object.zoom = this.zoom),
      (t.object.left = this.left),
      (t.object.right = this.right),
      (t.object.top = this.top),
      (t.object.bottom = this.bottom),
      (t.object.near = this.near),
      (t.object.far = this.far),
      this.view !== null && (t.object.view = Object.assign({}, this.view)),
      t
    );
  }
}
class cd extends ao {
  constructor() {
    (super(new oo(-5, 5, 5, -5, 0.5, 500)), (this.isDirectionalLightShadow = !0));
  }
}
class k_ extends ss {
  constructor(e, t) {
    (super(e, t),
      (this.isDirectionalLight = !0),
      (this.type = "DirectionalLight"),
      this.position.copy(dt.DEFAULT_UP),
      this.updateMatrix(),
      (this.target = new dt()),
      (this.shadow = new cd()));
  }
  dispose() {
    (super.dispose(), this.shadow.dispose());
  }
  copy(e) {
    return (super.copy(e), (this.target = e.target.clone()), (this.shadow = e.shadow.clone()), this);
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return ((t.object.shadow = this.shadow.toJSON()), (t.object.target = this.target.uuid), t);
  }
}
class G_ extends ss {
  constructor(e, t) {
    (super(e, t), (this.isAmbientLight = !0), (this.type = "AmbientLight"));
  }
}
class H_ {
  static extractUrlBase(e) {
    const t = e.lastIndexOf("/");
    return t === -1 ? "./" : e.slice(0, t + 1);
  }
  static resolveURL(e, t) {
    return typeof e != "string" || e === ""
      ? ""
      : (/^https?:\/\//i.test(t) && /^\//.test(e) && (t = t.replace(/(^https?:\/\/[^\/]+).*/i, "$1")),
        /^(https?:)?\/\//i.test(e) || /^data:.*,.*$/i.test(e) || /^blob:.*$/i.test(e) ? e : t + e);
  }
}
const Hr = new WeakMap();
class W_ extends Ii {
  constructor(e) {
    (super(e),
      (this.isImageBitmapLoader = !0),
      typeof createImageBitmap > "u" && xe("ImageBitmapLoader: createImageBitmap() not supported."),
      typeof fetch > "u" && xe("ImageBitmapLoader: fetch() not supported."),
      (this.options = { premultiplyAlpha: "none" }),
      (this._abortController = new AbortController()));
  }
  setOptions(e) {
    return ((this.options = e), this);
  }
  load(e, t, n, s) {
    (e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), (e = this.manager.resolveURL(e)));
    const r = this,
      a = Sn.get(`image-bitmap:${e}`);
    if (a !== void 0) {
      if ((r.manager.itemStart(e), a.then)) {
        a.then((l) => {
          Hr.has(a) === !0
            ? (s && s(Hr.get(a)), r.manager.itemError(e), r.manager.itemEnd(e))
            : (t && t(l), r.manager.itemEnd(e));
        });
        return;
      }
      setTimeout(function () {
        (t && t(a), r.manager.itemEnd(e));
      }, 0);
      return;
    }
    const o = {};
    ((o.credentials = this.crossOrigin === "anonymous" ? "same-origin" : "include"),
      (o.headers = this.requestHeader),
      (o.signal =
        typeof AbortSignal.any == "function"
          ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal])
          : this._abortController.signal));
    const c = fetch(e, o)
      .then(function (l) {
        return l.blob();
      })
      .then(function (l) {
        return createImageBitmap(l, Object.assign(r.options, { colorSpaceConversion: "none" }));
      })
      .then(function (l) {
        (Sn.add(`image-bitmap:${e}`, l), t && t(l), r.manager.itemEnd(e));
      })
      .catch(function (l) {
        (s && s(l), Hr.set(c, l), Sn.remove(`image-bitmap:${e}`), r.manager.itemError(e), r.manager.itemEnd(e));
      });
    (Sn.add(`image-bitmap:${e}`, c), r.manager.itemStart(e));
  }
  abort() {
    return (this._abortController.abort(), (this._abortController = new AbortController()), this);
  }
}
const gi = -90,
  _i = 1;
class hd extends dt {
  constructor(e, t, n) {
    (super(),
      (this.type = "CubeCamera"),
      (this.renderTarget = n),
      (this.coordinateSystem = null),
      (this.activeMipmapLevel = 0));
    const s = new Ot(gi, _i, e, t);
    ((s.layers = this.layers), this.add(s));
    const r = new Ot(gi, _i, e, t);
    ((r.layers = this.layers), this.add(r));
    const a = new Ot(gi, _i, e, t);
    ((a.layers = this.layers), this.add(a));
    const o = new Ot(gi, _i, e, t);
    ((o.layers = this.layers), this.add(o));
    const c = new Ot(gi, _i, e, t);
    ((c.layers = this.layers), this.add(c));
    const l = new Ot(gi, _i, e, t);
    ((l.layers = this.layers), this.add(l));
  }
  updateCoordinateSystem() {
    const e = this.coordinateSystem,
      t = this.children.concat(),
      [n, s, r, a, o, c] = t;
    for (const l of t) this.remove(l);
    if (e === an)
      (n.up.set(0, 1, 0),
        n.lookAt(1, 0, 0),
        s.up.set(0, 1, 0),
        s.lookAt(-1, 0, 0),
        r.up.set(0, 0, -1),
        r.lookAt(0, 1, 0),
        a.up.set(0, 0, 1),
        a.lookAt(0, -1, 0),
        o.up.set(0, 1, 0),
        o.lookAt(0, 0, 1),
        c.up.set(0, 1, 0),
        c.lookAt(0, 0, -1));
    else if (e === $i)
      (n.up.set(0, -1, 0),
        n.lookAt(-1, 0, 0),
        s.up.set(0, -1, 0),
        s.lookAt(1, 0, 0),
        r.up.set(0, 0, 1),
        r.lookAt(0, 1, 0),
        a.up.set(0, 0, -1),
        a.lookAt(0, -1, 0),
        o.up.set(0, -1, 0),
        o.lookAt(0, 0, 1),
        c.up.set(0, -1, 0),
        c.lookAt(0, 0, -1));
    else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
    for (const l of t) (this.add(l), l.updateMatrixWorld());
  }
  update(e, t) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: n, activeMipmapLevel: s } = this;
    this.coordinateSystem !== e.coordinateSystem &&
      ((this.coordinateSystem = e.coordinateSystem), this.updateCoordinateSystem());
    const [r, a, o, c, l, u] = this.children,
      d = e.getRenderTarget(),
      h = e.getActiveCubeFace(),
      f = e.getActiveMipmapLevel(),
      g = e.xr.enabled;
    e.xr.enabled = !1;
    const M = n.texture.generateMipmaps;
    n.texture.generateMipmaps = !1;
    let m = !1;
    (e.isWebGLRenderer === !0 ? (m = e.state.buffers.depth.getReversed()) : (m = e.reversedDepthBuffer),
      e.setRenderTarget(n, 0, s),
      m && e.autoClear === !1 && e.clearDepth(),
      e.render(t, r),
      e.setRenderTarget(n, 1, s),
      m && e.autoClear === !1 && e.clearDepth(),
      e.render(t, a),
      e.setRenderTarget(n, 2, s),
      m && e.autoClear === !1 && e.clearDepth(),
      e.render(t, o),
      e.setRenderTarget(n, 3, s),
      m && e.autoClear === !1 && e.clearDepth(),
      e.render(t, c),
      e.setRenderTarget(n, 4, s),
      m && e.autoClear === !1 && e.clearDepth(),
      e.render(t, l),
      (n.texture.generateMipmaps = M),
      e.setRenderTarget(n, 5, s),
      m && e.autoClear === !1 && e.clearDepth(),
      e.render(t, u),
      e.setRenderTarget(d, h, f),
      (e.xr.enabled = g),
      (n.texture.needsPMREMUpdate = !0));
  }
}
class ud extends Ot {
  constructor(e = []) {
    (super(), (this.isArrayCamera = !0), (this.isMultiViewCamera = !1), (this.cameras = e));
  }
}
class dd {
  constructor(e, t, n) {
    ((this.binding = e), (this.valueSize = n));
    let s, r, a;
    switch (t) {
      case "quaternion":
        ((s = this._slerp),
          (r = this._slerpAdditive),
          (a = this._setAdditiveIdentityQuaternion),
          (this.buffer = new Float64Array(n * 6)),
          (this._workIndex = 5));
        break;
      case "string":
      case "bool":
        ((s = this._select),
          (r = this._select),
          (a = this._setAdditiveIdentityOther),
          (this.buffer = new Array(n * 5)));
        break;
      default:
        ((s = this._lerp),
          (r = this._lerpAdditive),
          (a = this._setAdditiveIdentityNumeric),
          (this.buffer = new Float64Array(n * 5)));
    }
    ((this._mixBufferRegion = s),
      (this._mixBufferRegionAdditive = r),
      (this._setIdentity = a),
      (this._origIndex = 3),
      (this._addIndex = 4),
      (this.cumulativeWeight = 0),
      (this.cumulativeWeightAdditive = 0),
      (this.useCount = 0),
      (this.referenceCount = 0));
  }
  accumulate(e, t) {
    const n = this.buffer,
      s = this.valueSize,
      r = e * s + s;
    let a = this.cumulativeWeight;
    if (a === 0) {
      for (let o = 0; o !== s; ++o) n[r + o] = n[o];
      a = t;
    } else {
      a += t;
      const o = t / a;
      this._mixBufferRegion(n, r, 0, o, s);
    }
    this.cumulativeWeight = a;
  }
  accumulateAdditive(e) {
    const t = this.buffer,
      n = this.valueSize,
      s = n * this._addIndex;
    (this.cumulativeWeightAdditive === 0 && this._setIdentity(),
      this._mixBufferRegionAdditive(t, s, 0, e, n),
      (this.cumulativeWeightAdditive += e));
  }
  apply(e) {
    const t = this.valueSize,
      n = this.buffer,
      s = e * t + t,
      r = this.cumulativeWeight,
      a = this.cumulativeWeightAdditive,
      o = this.binding;
    if (((this.cumulativeWeight = 0), (this.cumulativeWeightAdditive = 0), r < 1)) {
      const c = t * this._origIndex;
      this._mixBufferRegion(n, s, c, 1 - r, t);
    }
    a > 0 && this._mixBufferRegionAdditive(n, s, this._addIndex * t, 1, t);
    for (let c = t, l = t + t; c !== l; ++c)
      if (n[c] !== n[c + t]) {
        o.setValue(n, s);
        break;
      }
  }
  saveOriginalState() {
    const e = this.binding,
      t = this.buffer,
      n = this.valueSize,
      s = n * this._origIndex;
    e.getValue(t, s);
    for (let r = n, a = s; r !== a; ++r) t[r] = t[s + (r % n)];
    (this._setIdentity(), (this.cumulativeWeight = 0), (this.cumulativeWeightAdditive = 0));
  }
  restoreOriginalState() {
    const e = this.valueSize * 3;
    this.binding.setValue(this.buffer, e);
  }
  _setAdditiveIdentityNumeric() {
    const e = this._addIndex * this.valueSize,
      t = e + this.valueSize;
    for (let n = e; n < t; n++) this.buffer[n] = 0;
  }
  _setAdditiveIdentityQuaternion() {
    (this._setAdditiveIdentityNumeric(), (this.buffer[this._addIndex * this.valueSize + 3] = 1));
  }
  _setAdditiveIdentityOther() {
    const e = this._origIndex * this.valueSize,
      t = this._addIndex * this.valueSize;
    for (let n = 0; n < this.valueSize; n++) this.buffer[t + n] = this.buffer[e + n];
  }
  _select(e, t, n, s, r) {
    if (s >= 0.5) for (let a = 0; a !== r; ++a) e[t + a] = e[n + a];
  }
  _slerp(e, t, n, s) {
    ln.slerpFlat(e, t, e, t, e, n, s);
  }
  _slerpAdditive(e, t, n, s, r) {
    const a = this._workIndex * r;
    (ln.multiplyQuaternionsFlat(e, a, e, t, e, n), ln.slerpFlat(e, t, e, t, e, a, s));
  }
  _lerp(e, t, n, s, r) {
    const a = 1 - s;
    for (let o = 0; o !== r; ++o) {
      const c = t + o;
      e[c] = e[c] * a + e[n + o] * s;
    }
  }
  _lerpAdditive(e, t, n, s, r) {
    for (let a = 0; a !== r; ++a) {
      const o = t + a;
      e[o] = e[o] + e[n + a] * s;
    }
  }
}
const lo = "\\[\\]\\.:\\/",
  fd = new RegExp("[" + lo + "]", "g"),
  co = "[^" + lo + "]",
  pd = "[^" + lo.replace("\\.", "") + "]",
  md = /((?:WC+[\/:])*)/.source.replace("WC", co),
  gd = /(WCOD+)?/.source.replace("WCOD", pd),
  _d = /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", co),
  xd = /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", co),
  vd = new RegExp("^" + md + gd + _d + xd + "$"),
  Md = ["material", "materials", "bones", "map"];
class Sd {
  constructor(e, t, n) {
    const s = n || je.parseTrackName(t);
    ((this._targetGroup = e), (this._bindings = e.subscribe_(t, s)));
  }
  getValue(e, t) {
    this.bind();
    const n = this._targetGroup.nCachedObjects_,
      s = this._bindings[n];
    s !== void 0 && s.getValue(e, t);
  }
  setValue(e, t) {
    const n = this._bindings;
    for (let s = this._targetGroup.nCachedObjects_, r = n.length; s !== r; ++s) n[s].setValue(e, t);
  }
  bind() {
    const e = this._bindings;
    for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].bind();
  }
  unbind() {
    const e = this._bindings;
    for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].unbind();
  }
}
class je {
  constructor(e, t, n) {
    ((this.path = t),
      (this.parsedPath = n || je.parseTrackName(t)),
      (this.node = je.findNode(e, this.parsedPath.nodeName)),
      (this.rootNode = e),
      (this.getValue = this._getValue_unbound),
      (this.setValue = this._setValue_unbound));
  }
  static create(e, t, n) {
    return e && e.isAnimationObjectGroup ? new je.Composite(e, t, n) : new je(e, t, n);
  }
  static sanitizeNodeName(e) {
    return e.replace(/\s/g, "_").replace(fd, "");
  }
  static parseTrackName(e) {
    const t = vd.exec(e);
    if (t === null) throw new Error("PropertyBinding: Cannot parse trackName: " + e);
    const n = { nodeName: t[2], objectName: t[3], objectIndex: t[4], propertyName: t[5], propertyIndex: t[6] },
      s = n.nodeName && n.nodeName.lastIndexOf(".");
    if (s !== void 0 && s !== -1) {
      const r = n.nodeName.substring(s + 1);
      Md.indexOf(r) !== -1 && ((n.nodeName = n.nodeName.substring(0, s)), (n.objectName = r));
    }
    if (n.propertyName === null || n.propertyName.length === 0)
      throw new Error("PropertyBinding: can not parse propertyName from trackName: " + e);
    return n;
  }
  static findNode(e, t) {
    if (t === void 0 || t === "" || t === "." || t === -1 || t === e.name || t === e.uuid) return e;
    if (e.skeleton) {
      const n = e.skeleton.getBoneByName(t);
      if (n !== void 0) return n;
    }
    if (e.children) {
      const n = function (r) {
          for (let a = 0; a < r.length; a++) {
            const o = r[a];
            if (o.name === t || o.uuid === t) return o;
            const c = n(o.children);
            if (c) return c;
          }
          return null;
        },
        s = n(e.children);
      if (s) return s;
    }
    return null;
  }
  _getValue_unavailable() {}
  _setValue_unavailable() {}
  _getValue_direct(e, t) {
    e[t] = this.targetObject[this.propertyName];
  }
  _getValue_array(e, t) {
    const n = this.resolvedProperty;
    for (let s = 0, r = n.length; s !== r; ++s) e[t++] = n[s];
  }
  _getValue_arrayElement(e, t) {
    e[t] = this.resolvedProperty[this.propertyIndex];
  }
  _getValue_toArray(e, t) {
    this.resolvedProperty.toArray(e, t);
  }
  _setValue_direct(e, t) {
    this.targetObject[this.propertyName] = e[t];
  }
  _setValue_direct_setNeedsUpdate(e, t) {
    ((this.targetObject[this.propertyName] = e[t]), (this.targetObject.needsUpdate = !0));
  }
  _setValue_direct_setMatrixWorldNeedsUpdate(e, t) {
    ((this.targetObject[this.propertyName] = e[t]), (this.targetObject.matrixWorldNeedsUpdate = !0));
  }
  _setValue_array(e, t) {
    const n = this.resolvedProperty;
    for (let s = 0, r = n.length; s !== r; ++s) n[s] = e[t++];
  }
  _setValue_array_setNeedsUpdate(e, t) {
    const n = this.resolvedProperty;
    for (let s = 0, r = n.length; s !== r; ++s) n[s] = e[t++];
    this.targetObject.needsUpdate = !0;
  }
  _setValue_array_setMatrixWorldNeedsUpdate(e, t) {
    const n = this.resolvedProperty;
    for (let s = 0, r = n.length; s !== r; ++s) n[s] = e[t++];
    this.targetObject.matrixWorldNeedsUpdate = !0;
  }
  _setValue_arrayElement(e, t) {
    this.resolvedProperty[this.propertyIndex] = e[t];
  }
  _setValue_arrayElement_setNeedsUpdate(e, t) {
    ((this.resolvedProperty[this.propertyIndex] = e[t]), (this.targetObject.needsUpdate = !0));
  }
  _setValue_arrayElement_setMatrixWorldNeedsUpdate(e, t) {
    ((this.resolvedProperty[this.propertyIndex] = e[t]), (this.targetObject.matrixWorldNeedsUpdate = !0));
  }
  _setValue_fromArray(e, t) {
    this.resolvedProperty.fromArray(e, t);
  }
  _setValue_fromArray_setNeedsUpdate(e, t) {
    (this.resolvedProperty.fromArray(e, t), (this.targetObject.needsUpdate = !0));
  }
  _setValue_fromArray_setMatrixWorldNeedsUpdate(e, t) {
    (this.resolvedProperty.fromArray(e, t), (this.targetObject.matrixWorldNeedsUpdate = !0));
  }
  _getValue_unbound(e, t) {
    (this.bind(), this.getValue(e, t));
  }
  _setValue_unbound(e, t) {
    (this.bind(), this.setValue(e, t));
  }
  bind() {
    let e = this.node;
    const t = this.parsedPath,
      n = t.objectName,
      s = t.propertyName;
    let r = t.propertyIndex;
    if (
      (e || ((e = je.findNode(this.rootNode, t.nodeName)), (this.node = e)),
      (this.getValue = this._getValue_unavailable),
      (this.setValue = this._setValue_unavailable),
      !e)
    ) {
      xe("PropertyBinding: No target node found for track: " + this.path + ".");
      return;
    }
    if (n) {
      let l = t.objectIndex;
      switch (n) {
        case "materials":
          if (!e.material) {
            Te("PropertyBinding: Can not bind to material as node does not have a material.", this);
            return;
          }
          if (!e.material.materials) {
            Te(
              "PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",
              this,
            );
            return;
          }
          e = e.material.materials;
          break;
        case "bones":
          if (!e.skeleton) {
            Te("PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
            return;
          }
          e = e.skeleton.bones;
          for (let u = 0; u < e.length; u++)
            if (e[u].name === l) {
              l = u;
              break;
            }
          break;
        case "map":
          if ("map" in e) {
            e = e.map;
            break;
          }
          if (!e.material) {
            Te("PropertyBinding: Can not bind to material as node does not have a material.", this);
            return;
          }
          if (!e.material.map) {
            Te("PropertyBinding: Can not bind to material.map as node.material does not have a map.", this);
            return;
          }
          e = e.material.map;
          break;
        default:
          if (e[n] === void 0) {
            Te("PropertyBinding: Can not bind to objectName of node undefined.", this);
            return;
          }
          e = e[n];
      }
      if (l !== void 0) {
        if (e[l] === void 0) {
          Te("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, e);
          return;
        }
        e = e[l];
      }
    }
    const a = e[s];
    if (a === void 0) {
      const l = t.nodeName;
      Te("PropertyBinding: Trying to update property for track: " + l + "." + s + " but it wasn't found.", e);
      return;
    }
    let o = this.Versioning.None;
    ((this.targetObject = e),
      e.isMaterial === !0
        ? (o = this.Versioning.NeedsUpdate)
        : e.isObject3D === !0 && (o = this.Versioning.MatrixWorldNeedsUpdate));
    let c = this.BindingType.Direct;
    if (r !== void 0) {
      if (s === "morphTargetInfluences") {
        if (!e.geometry) {
          Te("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
          return;
        }
        if (!e.geometry.morphAttributes) {
          Te(
            "PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",
            this,
          );
          return;
        }
        e.morphTargetDictionary[r] !== void 0 && (r = e.morphTargetDictionary[r]);
      }
      ((c = this.BindingType.ArrayElement), (this.resolvedProperty = a), (this.propertyIndex = r));
    } else
      a.fromArray !== void 0 && a.toArray !== void 0
        ? ((c = this.BindingType.HasFromToArray), (this.resolvedProperty = a))
        : Array.isArray(a)
          ? ((c = this.BindingType.EntireArray), (this.resolvedProperty = a))
          : (this.propertyName = s);
    ((this.getValue = this.GetterByBindingType[c]), (this.setValue = this.SetterByBindingTypeAndVersioning[c][o]));
  }
  unbind() {
    ((this.node = null), (this.getValue = this._getValue_unbound), (this.setValue = this._setValue_unbound));
  }
}
je.Composite = Sd;
je.prototype.BindingType = { Direct: 0, EntireArray: 1, ArrayElement: 2, HasFromToArray: 3 };
je.prototype.Versioning = { None: 0, NeedsUpdate: 1, MatrixWorldNeedsUpdate: 2 };
je.prototype.GetterByBindingType = [
  je.prototype._getValue_direct,
  je.prototype._getValue_array,
  je.prototype._getValue_arrayElement,
  je.prototype._getValue_toArray,
];
je.prototype.SetterByBindingTypeAndVersioning = [
  [
    je.prototype._setValue_direct,
    je.prototype._setValue_direct_setNeedsUpdate,
    je.prototype._setValue_direct_setMatrixWorldNeedsUpdate,
  ],
  [
    je.prototype._setValue_array,
    je.prototype._setValue_array_setNeedsUpdate,
    je.prototype._setValue_array_setMatrixWorldNeedsUpdate,
  ],
  [
    je.prototype._setValue_arrayElement,
    je.prototype._setValue_arrayElement_setNeedsUpdate,
    je.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate,
  ],
  [
    je.prototype._setValue_fromArray,
    je.prototype._setValue_fromArray_setNeedsUpdate,
    je.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate,
  ],
];
class yd {
  constructor(e, t, n = null, s = t.blendMode) {
    ((this._mixer = e), (this._clip = t), (this._localRoot = n), (this.blendMode = s));
    const r = t.tracks,
      a = r.length,
      o = new Array(a),
      c = { endingStart: vi, endingEnd: vi };
    for (let l = 0; l !== a; ++l) {
      const u = r[l].createInterpolant(null);
      ((o[l] = u), u.settings && Object.assign(c, u.settings), (u.settings = c));
    }
    ((this._interpolantSettings = c),
      (this._interpolants = o),
      (this._propertyBindings = new Array(a)),
      (this._cacheIndex = null),
      (this._byClipCacheIndex = null),
      (this._timeScaleInterpolant = null),
      (this._weightInterpolant = null),
      (this.loop = _h),
      (this._loopCount = -1),
      (this._startTime = null),
      (this.time = 0),
      (this.timeScale = 1),
      (this._effectiveTimeScale = 1),
      (this.weight = 1),
      (this._effectiveWeight = 1),
      (this.repetitions = 1 / 0),
      (this.paused = !1),
      (this.enabled = !0),
      (this.clampWhenFinished = !1),
      (this.zeroSlopeAtStart = !0),
      (this.zeroSlopeAtEnd = !0));
  }
  play() {
    return (this._mixer._activateAction(this), this);
  }
  stop() {
    return (this._mixer._deactivateAction(this), this.reset());
  }
  reset() {
    return (
      (this.paused = !1),
      (this.enabled = !0),
      (this.time = 0),
      (this._loopCount = -1),
      (this._startTime = null),
      this.stopFading().stopWarping()
    );
  }
  isRunning() {
    return (
      this.enabled &&
      !this.paused &&
      this.timeScale !== 0 &&
      this._startTime === null &&
      this._mixer._isActiveAction(this)
    );
  }
  isScheduled() {
    return this._mixer._isActiveAction(this);
  }
  startAt(e) {
    return ((this._startTime = e), this);
  }
  setLoop(e, t) {
    return ((this.loop = e), (this.repetitions = t), this);
  }
  setEffectiveWeight(e) {
    return ((this.weight = e), (this._effectiveWeight = this.enabled ? e : 0), this.stopFading());
  }
  getEffectiveWeight() {
    return this._effectiveWeight;
  }
  fadeIn(e) {
    return this._scheduleFading(e, 0, 1);
  }
  fadeOut(e) {
    return this._scheduleFading(e, 1, 0);
  }
  crossFadeFrom(e, t, n = !1) {
    if ((e.fadeOut(t), this.fadeIn(t), n === !0)) {
      const s = this._clip.duration,
        r = e._clip.duration,
        a = r / s,
        o = s / r;
      (e.warp(1, a, t), this.warp(o, 1, t));
    }
    return this;
  }
  crossFadeTo(e, t, n = !1) {
    return e.crossFadeFrom(this, t, n);
  }
  stopFading() {
    const e = this._weightInterpolant;
    return (e !== null && ((this._weightInterpolant = null), this._mixer._takeBackControlInterpolant(e)), this);
  }
  setEffectiveTimeScale(e) {
    return ((this.timeScale = e), (this._effectiveTimeScale = this.paused ? 0 : e), this.stopWarping());
  }
  getEffectiveTimeScale() {
    return this._effectiveTimeScale;
  }
  setDuration(e) {
    return ((this.timeScale = this._clip.duration / e), this.stopWarping());
  }
  syncWith(e) {
    return ((this.time = e.time), (this.timeScale = e.timeScale), this.stopWarping());
  }
  halt(e) {
    return this.warp(this._effectiveTimeScale, 0, e);
  }
  warp(e, t, n) {
    const s = this._mixer,
      r = s.time,
      a = this.timeScale;
    let o = this._timeScaleInterpolant;
    o === null && ((o = s._lendControlInterpolant()), (this._timeScaleInterpolant = o));
    const c = o.parameterPositions,
      l = o.sampleValues;
    return ((c[0] = r), (c[1] = r + n), (l[0] = e / a), (l[1] = t / a), this);
  }
  stopWarping() {
    const e = this._timeScaleInterpolant;
    return (e !== null && ((this._timeScaleInterpolant = null), this._mixer._takeBackControlInterpolant(e)), this);
  }
  getMixer() {
    return this._mixer;
  }
  getClip() {
    return this._clip;
  }
  getRoot() {
    return this._localRoot || this._mixer._root;
  }
  _update(e, t, n, s) {
    if (!this.enabled) {
      this._updateWeight(e);
      return;
    }
    const r = this._startTime;
    if (r !== null) {
      const c = (e - r) * n;
      c < 0 || n === 0 ? (t = 0) : ((this._startTime = null), (t = n * c));
    }
    t *= this._updateTimeScale(e);
    const a = this._updateTime(t),
      o = this._updateWeight(e);
    if (o > 0) {
      const c = this._interpolants,
        l = this._propertyBindings;
      switch (this.blendMode) {
        case vh:
          for (let u = 0, d = c.length; u !== d; ++u) (c[u].evaluate(a), l[u].accumulateAdditive(o));
          break;
        case Qa:
        default:
          for (let u = 0, d = c.length; u !== d; ++u) (c[u].evaluate(a), l[u].accumulate(s, o));
      }
    }
  }
  _updateWeight(e) {
    let t = 0;
    if (this.enabled) {
      t = this.weight;
      const n = this._weightInterpolant;
      if (n !== null) {
        const s = n.evaluate(e)[0];
        ((t *= s), e > n.parameterPositions[1] && (this.stopFading(), s === 0 && (this.enabled = !1)));
      }
    }
    return ((this._effectiveWeight = t), t);
  }
  _updateTimeScale(e) {
    let t = 0;
    if (!this.paused) {
      t = this.timeScale;
      const n = this._timeScaleInterpolant;
      if (n !== null) {
        const s = n.evaluate(e)[0];
        ((t *= s),
          e > n.parameterPositions[1] && (this.stopWarping(), t === 0 ? (this.paused = !0) : (this.timeScale = t)));
      }
    }
    return ((this._effectiveTimeScale = t), t);
  }
  _updateTime(e) {
    const t = this._clip.duration,
      n = this.loop;
    let s = this.time + e,
      r = this._loopCount;
    const a = n === xh;
    if (e === 0) return r === -1 ? s : a && (r & 1) === 1 ? t - s : s;
    if (n === gh) {
      r === -1 && ((this._loopCount = 0), this._setEndings(!0, !0, !1));
      e: {
        if (s >= t) s = t;
        else if (s < 0) s = 0;
        else {
          this.time = s;
          break e;
        }
        (this.clampWhenFinished ? (this.paused = !0) : (this.enabled = !1),
          (this.time = s),
          this._mixer.dispatchEvent({ type: "finished", action: this, direction: e < 0 ? -1 : 1 }));
      }
    } else {
      if (
        (r === -1 &&
          (e >= 0
            ? ((r = 0), this._setEndings(!0, this.repetitions === 0, a))
            : this._setEndings(this.repetitions === 0, !0, a)),
        s >= t || s < 0)
      ) {
        const o = Math.floor(s / t);
        ((s -= t * o), (r += Math.abs(o)));
        const c = this.repetitions - r;
        if (c <= 0)
          (this.clampWhenFinished ? (this.paused = !0) : (this.enabled = !1),
            (s = e > 0 ? t : 0),
            (this.time = s),
            this._mixer.dispatchEvent({ type: "finished", action: this, direction: e > 0 ? 1 : -1 }));
        else {
          if (c === 1) {
            const l = e < 0;
            this._setEndings(l, !l, a);
          } else this._setEndings(!1, !1, a);
          ((this._loopCount = r),
            (this.time = s),
            this._mixer.dispatchEvent({ type: "loop", action: this, loopDelta: o }));
        }
      } else ((this._loopCount = r), (this.time = s));
      if (a && (r & 1) === 1) return t - s;
    }
    return s;
  }
  _setEndings(e, t, n) {
    const s = this._interpolantSettings;
    n
      ? ((s.endingStart = Mi), (s.endingEnd = Mi))
      : (e ? (s.endingStart = this.zeroSlopeAtStart ? Mi : vi) : (s.endingStart = Zs),
        t ? (s.endingEnd = this.zeroSlopeAtEnd ? Mi : vi) : (s.endingEnd = Zs));
  }
  _scheduleFading(e, t, n) {
    const s = this._mixer,
      r = s.time;
    let a = this._weightInterpolant;
    a === null && ((a = s._lendControlInterpolant()), (this._weightInterpolant = a));
    const o = a.parameterPositions,
      c = a.sampleValues;
    return ((o[0] = r), (c[0] = t), (o[1] = r + e), (c[1] = n), this);
  }
}
const bd = new Float32Array(1);
class X_ extends An {
  constructor(e) {
    (super(),
      (this._root = e),
      this._initMemoryManager(),
      (this._accuIndex = 0),
      (this.time = 0),
      (this.timeScale = 1),
      typeof __THREE_DEVTOOLS__ < "u" &&
        __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this })));
  }
  _bindAction(e, t) {
    const n = e._localRoot || this._root,
      s = e._clip.tracks,
      r = s.length,
      a = e._propertyBindings,
      o = e._interpolants,
      c = n.uuid,
      l = this._bindingsByRootAndName;
    let u = l[c];
    u === void 0 && ((u = {}), (l[c] = u));
    for (let d = 0; d !== r; ++d) {
      const h = s[d],
        f = h.name;
      let g = u[f];
      if (g !== void 0) (++g.referenceCount, (a[d] = g));
      else {
        if (((g = a[d]), g !== void 0)) {
          g._cacheIndex === null && (++g.referenceCount, this._addInactiveBinding(g, c, f));
          continue;
        }
        const M = t && t._propertyBindings[d].binding.parsedPath;
        ((g = new dd(je.create(n, f, M), h.ValueTypeName, h.getValueSize())),
          ++g.referenceCount,
          this._addInactiveBinding(g, c, f),
          (a[d] = g));
      }
      o[d].resultBuffer = g.buffer;
    }
  }
  _activateAction(e) {
    if (!this._isActiveAction(e)) {
      if (e._cacheIndex === null) {
        const n = (e._localRoot || this._root).uuid,
          s = e._clip.uuid,
          r = this._actionsByClip[s];
        (this._bindAction(e, r && r.knownActions[0]), this._addInactiveAction(e, s, n));
      }
      const t = e._propertyBindings;
      for (let n = 0, s = t.length; n !== s; ++n) {
        const r = t[n];
        r.useCount++ === 0 && (this._lendBinding(r), r.saveOriginalState());
      }
      this._lendAction(e);
    }
  }
  _deactivateAction(e) {
    if (this._isActiveAction(e)) {
      const t = e._propertyBindings;
      for (let n = 0, s = t.length; n !== s; ++n) {
        const r = t[n];
        --r.useCount === 0 && (r.restoreOriginalState(), this._takeBackBinding(r));
      }
      this._takeBackAction(e);
    }
  }
  _initMemoryManager() {
    ((this._actions = []),
      (this._nActiveActions = 0),
      (this._actionsByClip = {}),
      (this._bindings = []),
      (this._nActiveBindings = 0),
      (this._bindingsByRootAndName = {}),
      (this._controlInterpolants = []),
      (this._nActiveControlInterpolants = 0));
    const e = this;
    this.stats = {
      actions: {
        get total() {
          return e._actions.length;
        },
        get inUse() {
          return e._nActiveActions;
        },
      },
      bindings: {
        get total() {
          return e._bindings.length;
        },
        get inUse() {
          return e._nActiveBindings;
        },
      },
      controlInterpolants: {
        get total() {
          return e._controlInterpolants.length;
        },
        get inUse() {
          return e._nActiveControlInterpolants;
        },
      },
    };
  }
  _isActiveAction(e) {
    const t = e._cacheIndex;
    return t !== null && t < this._nActiveActions;
  }
  _addInactiveAction(e, t, n) {
    const s = this._actions,
      r = this._actionsByClip;
    let a = r[t];
    if (a === void 0) ((a = { knownActions: [e], actionByRoot: {} }), (e._byClipCacheIndex = 0), (r[t] = a));
    else {
      const o = a.knownActions;
      ((e._byClipCacheIndex = o.length), o.push(e));
    }
    ((e._cacheIndex = s.length), s.push(e), (a.actionByRoot[n] = e));
  }
  _removeInactiveAction(e) {
    const t = this._actions,
      n = t[t.length - 1],
      s = e._cacheIndex;
    ((n._cacheIndex = s), (t[s] = n), t.pop(), (e._cacheIndex = null));
    const r = e._clip.uuid,
      a = this._actionsByClip,
      o = a[r],
      c = o.knownActions,
      l = c[c.length - 1],
      u = e._byClipCacheIndex;
    ((l._byClipCacheIndex = u), (c[u] = l), c.pop(), (e._byClipCacheIndex = null));
    const d = o.actionByRoot,
      h = (e._localRoot || this._root).uuid;
    (delete d[h], c.length === 0 && delete a[r], this._removeInactiveBindingsForAction(e));
  }
  _removeInactiveBindingsForAction(e) {
    const t = e._propertyBindings;
    for (let n = 0, s = t.length; n !== s; ++n) {
      const r = t[n];
      --r.referenceCount === 0 && this._removeInactiveBinding(r);
    }
  }
  _lendAction(e) {
    const t = this._actions,
      n = e._cacheIndex,
      s = this._nActiveActions++,
      r = t[s];
    ((e._cacheIndex = s), (t[s] = e), (r._cacheIndex = n), (t[n] = r));
  }
  _takeBackAction(e) {
    const t = this._actions,
      n = e._cacheIndex,
      s = --this._nActiveActions,
      r = t[s];
    ((e._cacheIndex = s), (t[s] = e), (r._cacheIndex = n), (t[n] = r));
  }
  _addInactiveBinding(e, t, n) {
    const s = this._bindingsByRootAndName,
      r = this._bindings;
    let a = s[t];
    (a === void 0 && ((a = {}), (s[t] = a)), (a[n] = e), (e._cacheIndex = r.length), r.push(e));
  }
  _removeInactiveBinding(e) {
    const t = this._bindings,
      n = e.binding,
      s = n.rootNode.uuid,
      r = n.path,
      a = this._bindingsByRootAndName,
      o = a[s],
      c = t[t.length - 1],
      l = e._cacheIndex;
    ((c._cacheIndex = l), (t[l] = c), t.pop(), delete o[r], Object.keys(o).length === 0 && delete a[s]);
  }
  _lendBinding(e) {
    const t = this._bindings,
      n = e._cacheIndex,
      s = this._nActiveBindings++,
      r = t[s];
    ((e._cacheIndex = s), (t[s] = e), (r._cacheIndex = n), (t[n] = r));
  }
  _takeBackBinding(e) {
    const t = this._bindings,
      n = e._cacheIndex,
      s = --this._nActiveBindings,
      r = t[s];
    ((e._cacheIndex = s), (t[s] = e), (r._cacheIndex = n), (t[n] = r));
  }
  _lendControlInterpolant() {
    const e = this._controlInterpolants,
      t = this._nActiveControlInterpolants++;
    let n = e[t];
    return (
      n === void 0 && ((n = new Ac(new Float32Array(2), new Float32Array(2), 1, bd)), (n.__cacheIndex = t), (e[t] = n)),
      n
    );
  }
  _takeBackControlInterpolant(e) {
    const t = this._controlInterpolants,
      n = e.__cacheIndex,
      s = --this._nActiveControlInterpolants,
      r = t[s];
    ((e.__cacheIndex = s), (t[s] = e), (r.__cacheIndex = n), (t[n] = r));
  }
  clipAction(e, t, n) {
    const s = t || this._root,
      r = s.uuid;
    let a = typeof e == "string" ? fl.findByName(s, e) : e;
    const o = a !== null ? a.uuid : e,
      c = this._actionsByClip[o];
    let l = null;
    if ((n === void 0 && (a !== null ? (n = a.blendMode) : (n = Qa)), c !== void 0)) {
      const d = c.actionByRoot[r];
      if (d !== void 0 && d.blendMode === n) return d;
      ((l = c.knownActions[0]), a === null && (a = l._clip));
    }
    if (a === null) return null;
    const u = new yd(this, a, t, n);
    return (this._bindAction(u, l), this._addInactiveAction(u, o, r), u);
  }
  existingAction(e, t) {
    const n = t || this._root,
      s = n.uuid,
      r = typeof e == "string" ? fl.findByName(n, e) : e,
      a = r ? r.uuid : e,
      o = this._actionsByClip[a];
    return (o !== void 0 && o.actionByRoot[s]) || null;
  }
  stopAllAction() {
    const e = this._actions,
      t = this._nActiveActions;
    for (let n = t - 1; n >= 0; --n) e[n].stop();
    return this;
  }
  update(e) {
    e *= this.timeScale;
    const t = this._actions,
      n = this._nActiveActions,
      s = (this.time += e),
      r = Math.sign(e),
      a = (this._accuIndex ^= 1);
    for (let l = 0; l !== n; ++l) t[l]._update(s, e, r, a);
    const o = this._bindings,
      c = this._nActiveBindings;
    for (let l = 0; l !== c; ++l) o[l].apply(a);
    return this;
  }
  setTime(e) {
    this.time = 0;
    for (let t = 0; t < this._actions.length; t++) this._actions[t].time = 0;
    return this.update(e);
  }
  getRoot() {
    return this._root;
  }
  uncacheClip(e) {
    const t = this._actions,
      n = e.uuid,
      s = this._actionsByClip,
      r = s[n];
    if (r !== void 0) {
      const a = r.knownActions;
      for (let o = 0, c = a.length; o !== c; ++o) {
        const l = a[o];
        this._deactivateAction(l);
        const u = l._cacheIndex,
          d = t[t.length - 1];
        ((l._cacheIndex = null),
          (l._byClipCacheIndex = null),
          (d._cacheIndex = u),
          (t[u] = d),
          t.pop(),
          this._removeInactiveBindingsForAction(l));
      }
      delete s[n];
    }
  }
  uncacheRoot(e) {
    const t = e.uuid,
      n = this._actionsByClip;
    for (const a in n) {
      const o = n[a].actionByRoot,
        c = o[t];
      c !== void 0 && (this._deactivateAction(c), this._removeInactiveAction(c));
    }
    const s = this._bindingsByRootAndName,
      r = s[t];
    if (r !== void 0)
      for (const a in r) {
        const o = r[a];
        (o.restoreOriginalState(), this._removeInactiveBinding(o));
      }
  }
  uncacheAction(e, t) {
    const n = this.existingAction(e, t);
    n !== null && (this._deactivateAction(n), this._removeInactiveAction(n));
  }
}
class q_ {
  constructor(e = !0) {
    ((this.autoStart = e),
      (this.startTime = 0),
      (this.oldTime = 0),
      (this.elapsedTime = 0),
      (this.running = !1),
      xe("Clock: This module has been deprecated. Please use THREE.Timer instead."));
  }
  start() {
    ((this.startTime = performance.now()),
      (this.oldTime = this.startTime),
      (this.elapsedTime = 0),
      (this.running = !0));
  }
  stop() {
    (this.getElapsedTime(), (this.running = !1), (this.autoStart = !1));
  }
  getElapsedTime() {
    return (this.getDelta(), this.elapsedTime);
  }
  getDelta() {
    let e = 0;
    if (this.autoStart && !this.running) return (this.start(), 0);
    if (this.running) {
      const t = performance.now();
      ((e = (t - this.oldTime) / 1e3), (this.oldTime = t), (this.elapsedTime += e));
    }
    return e;
  }
}
class Y_ {
  constructor(e = 1, t = 0, n = 0) {
    ((this.radius = e), (this.phi = t), (this.theta = n));
  }
  set(e, t, n) {
    return ((this.radius = e), (this.phi = t), (this.theta = n), this);
  }
  copy(e) {
    return ((this.radius = e.radius), (this.phi = e.phi), (this.theta = e.theta), this);
  }
  makeSafe() {
    return ((this.phi = Fe(this.phi, 1e-6, Math.PI - 1e-6)), this);
  }
  setFromVector3(e) {
    return this.setFromCartesianCoords(e.x, e.y, e.z);
  }
  setFromCartesianCoords(e, t, n) {
    return (
      (this.radius = Math.sqrt(e * e + t * t + n * n)),
      this.radius === 0
        ? ((this.theta = 0), (this.phi = 0))
        : ((this.theta = Math.atan2(e, n)), (this.phi = Math.acos(Fe(t / this.radius, -1, 1)))),
      this
    );
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const mo = class mo {
  constructor(e, t, n, s) {
    ((this.elements = [1, 0, 0, 1]), e !== void 0 && this.set(e, t, n, s));
  }
  identity() {
    return (this.set(1, 0, 0, 1), this);
  }
  fromArray(e, t = 0) {
    for (let n = 0; n < 4; n++) this.elements[n] = e[n + t];
    return this;
  }
  set(e, t, n, s) {
    const r = this.elements;
    return ((r[0] = e), (r[2] = t), (r[1] = n), (r[3] = s), this);
  }
};
mo.prototype.isMatrix2 = !0;
let vl = mo;
class Z_ extends Mu {
  constructor(e = 10, t = 10, n = 4473924, s = 8947848) {
    ((n = new Ce(n)), (s = new Ce(s)));
    const r = t / 2,
      a = e / t,
      o = e / 2,
      c = [],
      l = [];
    for (let h = 0, f = 0, g = -o; h <= t; h++, g += a) {
      (c.push(-o, 0, g, o, 0, g), c.push(g, 0, -o, g, 0, o));
      const M = h === r ? n : s;
      (M.toArray(l, f), (f += 3), M.toArray(l, f), (f += 3), M.toArray(l, f), (f += 3), M.toArray(l, f), (f += 3));
    }
    const u = new Lt();
    (u.setAttribute("position", new Mt(c, 3)), u.setAttribute("color", new Mt(l, 3)));
    const d = new fc({ vertexColors: !0, toneMapped: !1 });
    (super(u, d), (this.type = "GridHelper"));
  }
  dispose() {
    (this.geometry.dispose(), this.material.dispose());
  }
}
class K_ extends An {
  constructor(e, t = null) {
    (super(),
      (this.object = e),
      (this.domElement = t),
      (this.enabled = !0),
      (this.state = -1),
      (this.keys = {}),
      (this.mouseButtons = { LEFT: null, MIDDLE: null, RIGHT: null }),
      (this.touches = { ONE: null, TWO: null }));
  }
  connect(e) {
    if (e === void 0) {
      xe("Controls: connect() now requires an element.");
      return;
    }
    (this.domElement !== null && this.disconnect(), (this.domElement = e));
  }
  disconnect() {}
  dispose() {}
  update() {}
}
function Ml(i, e, t, n) {
  const s = Ed(n);
  switch (t) {
    case nc:
      return i * e;
    case Ka:
      return ((i * e) / s.components) * s.byteLength;
    case ja:
      return ((i * e) / s.components) * s.byteLength;
    case Qn:
      return ((i * e * 2) / s.components) * s.byteLength;
    case $a:
      return ((i * e * 2) / s.components) * s.byteLength;
    case ic:
      return ((i * e * 3) / s.components) * s.byteLength;
    case Ht:
      return ((i * e * 4) / s.components) * s.byteLength;
    case Ja:
      return ((i * e * 4) / s.components) * s.byteLength;
    case Vs:
    case ks:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case Gs:
    case Hs:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case la:
    case ha:
      return (Math.max(i, 16) * Math.max(e, 8)) / 4;
    case oa:
    case ca:
      return (Math.max(i, 8) * Math.max(e, 8)) / 2;
    case ua:
    case da:
    case pa:
    case ma:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case fa:
    case Xs:
    case ga:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case _a:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case xa:
      return Math.floor((i + 4) / 5) * Math.floor((e + 3) / 4) * 16;
    case va:
      return Math.floor((i + 4) / 5) * Math.floor((e + 4) / 5) * 16;
    case Ma:
      return Math.floor((i + 5) / 6) * Math.floor((e + 4) / 5) * 16;
    case Sa:
      return Math.floor((i + 5) / 6) * Math.floor((e + 5) / 6) * 16;
    case ya:
      return Math.floor((i + 7) / 8) * Math.floor((e + 4) / 5) * 16;
    case ba:
      return Math.floor((i + 7) / 8) * Math.floor((e + 5) / 6) * 16;
    case Ea:
      return Math.floor((i + 7) / 8) * Math.floor((e + 7) / 8) * 16;
    case Ta:
      return Math.floor((i + 9) / 10) * Math.floor((e + 4) / 5) * 16;
    case Aa:
      return Math.floor((i + 9) / 10) * Math.floor((e + 5) / 6) * 16;
    case wa:
      return Math.floor((i + 9) / 10) * Math.floor((e + 7) / 8) * 16;
    case Ra:
      return Math.floor((i + 9) / 10) * Math.floor((e + 9) / 10) * 16;
    case Ca:
      return Math.floor((i + 11) / 12) * Math.floor((e + 9) / 10) * 16;
    case Pa:
      return Math.floor((i + 11) / 12) * Math.floor((e + 11) / 12) * 16;
    case Ia:
    case La:
    case Da:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 16;
    case Ua:
    case Na:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 8;
    case qs:
    case Fa:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 16;
  }
  throw new Error(`Unable to determine texture byte length for ${t} format.`);
}
function Ed(i) {
  switch (i) {
    case Bt:
    case Jl:
      return { byteLength: 1, components: 1 };
    case Zi:
    case Ql:
    case En:
      return { byteLength: 2, components: 1 };
    case Ya:
    case Za:
      return { byteLength: 2, components: 4 };
    case hn:
    case qa:
    case Gt:
      return { byteLength: 4, components: 1 };
    case ec:
    case tc:
      return { byteLength: 4, components: 3 };
  }
  throw new Error(`Unknown texture type ${i}.`);
}
typeof __THREE_DEVTOOLS__ < "u" &&
  __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: { revision: Xa } }));
typeof window < "u" &&
  (window.__THREE__ ? xe("WARNING: Multiple instances of Three.js being imported.") : (window.__THREE__ = Xa));
/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */ function Cc() {
  let i = null,
    e = !1,
    t = null,
    n = null;
  function s(r, a) {
    (t(r, a), (n = i.requestAnimationFrame(s)));
  }
  return {
    start: function () {
      e !== !0 && t !== null && i !== null && ((n = i.requestAnimationFrame(s)), (e = !0));
    },
    stop: function () {
      (i !== null && i.cancelAnimationFrame(n), (e = !1));
    },
    setAnimationLoop: function (r) {
      t = r;
    },
    setContext: function (r) {
      i = r;
    },
  };
}
function Td(i) {
  const e = new WeakMap();
  function t(o, c) {
    const l = o.array,
      u = o.usage,
      d = l.byteLength,
      h = i.createBuffer();
    (i.bindBuffer(c, h), i.bufferData(c, l, u), o.onUploadCallback());
    let f;
    if (l instanceof Float32Array) f = i.FLOAT;
    else if (typeof Float16Array < "u" && l instanceof Float16Array) f = i.HALF_FLOAT;
    else if (l instanceof Uint16Array) o.isFloat16BufferAttribute ? (f = i.HALF_FLOAT) : (f = i.UNSIGNED_SHORT);
    else if (l instanceof Int16Array) f = i.SHORT;
    else if (l instanceof Uint32Array) f = i.UNSIGNED_INT;
    else if (l instanceof Int32Array) f = i.INT;
    else if (l instanceof Int8Array) f = i.BYTE;
    else if (l instanceof Uint8Array) f = i.UNSIGNED_BYTE;
    else if (l instanceof Uint8ClampedArray) f = i.UNSIGNED_BYTE;
    else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + l);
    return { buffer: h, type: f, bytesPerElement: l.BYTES_PER_ELEMENT, version: o.version, size: d };
  }
  function n(o, c, l) {
    const u = c.array,
      d = c.updateRanges;
    if ((i.bindBuffer(l, o), d.length === 0)) i.bufferSubData(l, 0, u);
    else {
      d.sort((f, g) => f.start - g.start);
      let h = 0;
      for (let f = 1; f < d.length; f++) {
        const g = d[h],
          M = d[f];
        M.start <= g.start + g.count + 1
          ? (g.count = Math.max(g.count, M.start + M.count - g.start))
          : (++h, (d[h] = M));
      }
      d.length = h + 1;
      for (let f = 0, g = d.length; f < g; f++) {
        const M = d[f];
        i.bufferSubData(l, M.start * u.BYTES_PER_ELEMENT, u, M.start, M.count);
      }
      c.clearUpdateRanges();
    }
    c.onUploadCallback();
  }
  function s(o) {
    return (o.isInterleavedBufferAttribute && (o = o.data), e.get(o));
  }
  function r(o) {
    o.isInterleavedBufferAttribute && (o = o.data);
    const c = e.get(o);
    c && (i.deleteBuffer(c.buffer), e.delete(o));
  }
  function a(o, c) {
    if ((o.isInterleavedBufferAttribute && (o = o.data), o.isGLBufferAttribute)) {
      const u = e.get(o);
      (!u || u.version < o.version) &&
        e.set(o, { buffer: o.buffer, type: o.type, bytesPerElement: o.elementSize, version: o.version });
      return;
    }
    const l = e.get(o);
    if (l === void 0) e.set(o, t(o, c));
    else if (l.version < o.version) {
      if (l.size !== o.array.byteLength)
        throw new Error(
          "THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.",
        );
      (n(l.buffer, o, c), (l.version = o.version));
    }
  }
  return { get: s, remove: r, update: a };
}
var Ad = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,
  wd = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,
  Rd = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,
  Cd = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
  Pd = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,
  Id = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,
  Ld = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,
  Dd = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,
  Ud = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,
  Nd = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,
  Fd = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,
  Od = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,
  Bd = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,
  zd = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,
  Vd = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,
  kd = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,
  Gd = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,
  Hd = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,
  Wd = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,
  Xd = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,
  qd = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,
  Yd = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,
  Zd = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,
  Kd = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,
  jd = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,
  $d = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,
  Jd = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,
  Qd = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,
  ef = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,
  tf = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,
  nf = "gl_FragColor = linearToOutputTexel( gl_FragColor );",
  sf = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,
  rf = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,
  af = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,
  of = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,
  lf = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,
  cf = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,
  hf = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,
  uf = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`,
  df = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,
  ff = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,
  pf = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,
  mf = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,
  gf = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,
  _f = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,
  xf = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,
  vf = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,
  Mf = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,
  Sf = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,
  yf = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,
  bf = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,
  Ef = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,
  Tf = `uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,
  Af = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,
  wf = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,
  Rf = `#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,
  Cf = `#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,
  Pf = `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,
  If = `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
  Lf = `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
  Df = `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,
  Uf = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,
  Nf = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`,
  Ff = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,
  Of = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
  Bf = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,
  zf = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,
  Vf = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,
  kf = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,
  Gf = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
  Hf = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,
  Wf = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
  Xf = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,
  qf = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,
  Yf = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
  Zf = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
  Kf = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,
  jf = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,
  $f = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,
  Jf = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,
  Qf = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,
  ep = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,
  tp = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
  np = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,
  ip = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,
  sp = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,
  rp = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,
  ap = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,
  op = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,
  lp = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,
  cp = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,
  hp = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,
  up = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,
  dp = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,
  fp = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,
  pp = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,
  mp = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,
  gp = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,
  _p = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,
  xp = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,
  vp = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,
  Mp = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,
  Sp = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,
  yp = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,
  bp = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
  Ep = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
  Tp = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,
  Ap = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const wp = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,
  Rp = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  Cp = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
  Pp = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  Ip = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
  Lp = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  Dp = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,
  Up = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,
  Np = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,
  Fp = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,
  Op = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,
  Bp = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  zp = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
  Vp = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
  kp = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,
  Gp = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  Hp = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  Wp = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  Xp = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,
  qp = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  Yp = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,
  Zp = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,
  Kp = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  jp = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  $p = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,
  Jp = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  Qp = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  em = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  tm = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,
  nm = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
  im = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  sm = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
  rm = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
  am = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,
  Oe = {
    alphahash_fragment: Ad,
    alphahash_pars_fragment: wd,
    alphamap_fragment: Rd,
    alphamap_pars_fragment: Cd,
    alphatest_fragment: Pd,
    alphatest_pars_fragment: Id,
    aomap_fragment: Ld,
    aomap_pars_fragment: Dd,
    batching_pars_vertex: Ud,
    batching_vertex: Nd,
    begin_vertex: Fd,
    beginnormal_vertex: Od,
    bsdfs: Bd,
    iridescence_fragment: zd,
    bumpmap_pars_fragment: Vd,
    clipping_planes_fragment: kd,
    clipping_planes_pars_fragment: Gd,
    clipping_planes_pars_vertex: Hd,
    clipping_planes_vertex: Wd,
    color_fragment: Xd,
    color_pars_fragment: qd,
    color_pars_vertex: Yd,
    color_vertex: Zd,
    common: Kd,
    cube_uv_reflection_fragment: jd,
    defaultnormal_vertex: $d,
    displacementmap_pars_vertex: Jd,
    displacementmap_vertex: Qd,
    emissivemap_fragment: ef,
    emissivemap_pars_fragment: tf,
    colorspace_fragment: nf,
    colorspace_pars_fragment: sf,
    envmap_fragment: rf,
    envmap_common_pars_fragment: af,
    envmap_pars_fragment: of,
    envmap_pars_vertex: lf,
    envmap_physical_pars_fragment: vf,
    envmap_vertex: cf,
    fog_vertex: hf,
    fog_pars_vertex: uf,
    fog_fragment: df,
    fog_pars_fragment: ff,
    gradientmap_pars_fragment: pf,
    lightmap_pars_fragment: mf,
    lights_lambert_fragment: gf,
    lights_lambert_pars_fragment: _f,
    lights_pars_begin: xf,
    lights_toon_fragment: Mf,
    lights_toon_pars_fragment: Sf,
    lights_phong_fragment: yf,
    lights_phong_pars_fragment: bf,
    lights_physical_fragment: Ef,
    lights_physical_pars_fragment: Tf,
    lights_fragment_begin: Af,
    lights_fragment_maps: wf,
    lights_fragment_end: Rf,
    lightprobes_pars_fragment: Cf,
    logdepthbuf_fragment: Pf,
    logdepthbuf_pars_fragment: If,
    logdepthbuf_pars_vertex: Lf,
    logdepthbuf_vertex: Df,
    map_fragment: Uf,
    map_pars_fragment: Nf,
    map_particle_fragment: Ff,
    map_particle_pars_fragment: Of,
    metalnessmap_fragment: Bf,
    metalnessmap_pars_fragment: zf,
    morphinstance_vertex: Vf,
    morphcolor_vertex: kf,
    morphnormal_vertex: Gf,
    morphtarget_pars_vertex: Hf,
    morphtarget_vertex: Wf,
    normal_fragment_begin: Xf,
    normal_fragment_maps: qf,
    normal_pars_fragment: Yf,
    normal_pars_vertex: Zf,
    normal_vertex: Kf,
    normalmap_pars_fragment: jf,
    clearcoat_normal_fragment_begin: $f,
    clearcoat_normal_fragment_maps: Jf,
    clearcoat_pars_fragment: Qf,
    iridescence_pars_fragment: ep,
    opaque_fragment: tp,
    packing: np,
    premultiplied_alpha_fragment: ip,
    project_vertex: sp,
    dithering_fragment: rp,
    dithering_pars_fragment: ap,
    roughnessmap_fragment: op,
    roughnessmap_pars_fragment: lp,
    shadowmap_pars_fragment: cp,
    shadowmap_pars_vertex: hp,
    shadowmap_vertex: up,
    shadowmask_pars_fragment: dp,
    skinbase_vertex: fp,
    skinning_pars_vertex: pp,
    skinning_vertex: mp,
    skinnormal_vertex: gp,
    specularmap_fragment: _p,
    specularmap_pars_fragment: xp,
    tonemapping_fragment: vp,
    tonemapping_pars_fragment: Mp,
    transmission_fragment: Sp,
    transmission_pars_fragment: yp,
    uv_pars_fragment: bp,
    uv_pars_vertex: Ep,
    uv_vertex: Tp,
    worldpos_vertex: Ap,
    background_vert: wp,
    background_frag: Rp,
    backgroundCube_vert: Cp,
    backgroundCube_frag: Pp,
    cube_vert: Ip,
    cube_frag: Lp,
    depth_vert: Dp,
    depth_frag: Up,
    distance_vert: Np,
    distance_frag: Fp,
    equirect_vert: Op,
    equirect_frag: Bp,
    linedashed_vert: zp,
    linedashed_frag: Vp,
    meshbasic_vert: kp,
    meshbasic_frag: Gp,
    meshlambert_vert: Hp,
    meshlambert_frag: Wp,
    meshmatcap_vert: Xp,
    meshmatcap_frag: qp,
    meshnormal_vert: Yp,
    meshnormal_frag: Zp,
    meshphong_vert: Kp,
    meshphong_frag: jp,
    meshphysical_vert: $p,
    meshphysical_frag: Jp,
    meshtoon_vert: Qp,
    meshtoon_frag: em,
    points_vert: tm,
    points_frag: nm,
    shadow_vert: im,
    shadow_frag: sm,
    sprite_vert: rm,
    sprite_frag: am,
  },
  le = {
    common: {
      diffuse: { value: new Ce(16777215) },
      opacity: { value: 1 },
      map: { value: null },
      mapTransform: { value: new Ie() },
      alphaMap: { value: null },
      alphaMapTransform: { value: new Ie() },
      alphaTest: { value: 0 },
    },
    specularmap: { specularMap: { value: null }, specularMapTransform: { value: new Ie() } },
    envmap: {
      envMap: { value: null },
      envMapRotation: { value: new Ie() },
      reflectivity: { value: 1 },
      ior: { value: 1.5 },
      refractionRatio: { value: 0.98 },
      dfgLUT: { value: null },
    },
    aomap: { aoMap: { value: null }, aoMapIntensity: { value: 1 }, aoMapTransform: { value: new Ie() } },
    lightmap: { lightMap: { value: null }, lightMapIntensity: { value: 1 }, lightMapTransform: { value: new Ie() } },
    bumpmap: { bumpMap: { value: null }, bumpMapTransform: { value: new Ie() }, bumpScale: { value: 1 } },
    normalmap: {
      normalMap: { value: null },
      normalMapTransform: { value: new Ie() },
      normalScale: { value: new Ge(1, 1) },
    },
    displacementmap: {
      displacementMap: { value: null },
      displacementMapTransform: { value: new Ie() },
      displacementScale: { value: 1 },
      displacementBias: { value: 0 },
    },
    emissivemap: { emissiveMap: { value: null }, emissiveMapTransform: { value: new Ie() } },
    metalnessmap: { metalnessMap: { value: null }, metalnessMapTransform: { value: new Ie() } },
    roughnessmap: { roughnessMap: { value: null }, roughnessMapTransform: { value: new Ie() } },
    gradientmap: { gradientMap: { value: null } },
    fog: {
      fogDensity: { value: 25e-5 },
      fogNear: { value: 1 },
      fogFar: { value: 2e3 },
      fogColor: { value: new Ce(16777215) },
    },
    lights: {
      ambientLightColor: { value: [] },
      lightProbe: { value: [] },
      directionalLights: { value: [], properties: { direction: {}, color: {} } },
      directionalLightShadows: {
        value: [],
        properties: { shadowIntensity: 1, shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {} },
      },
      directionalShadowMatrix: { value: [] },
      spotLights: {
        value: [],
        properties: { color: {}, position: {}, direction: {}, distance: {}, coneCos: {}, penumbraCos: {}, decay: {} },
      },
      spotLightShadows: {
        value: [],
        properties: { shadowIntensity: 1, shadowBias: {}, shadowNormalBias: {}, shadowRadius: {}, shadowMapSize: {} },
      },
      spotLightMap: { value: [] },
      spotLightMatrix: { value: [] },
      pointLights: { value: [], properties: { color: {}, position: {}, decay: {}, distance: {} } },
      pointLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
          shadowCameraNear: {},
          shadowCameraFar: {},
        },
      },
      pointShadowMatrix: { value: [] },
      hemisphereLights: { value: [], properties: { direction: {}, skyColor: {}, groundColor: {} } },
      rectAreaLights: { value: [], properties: { color: {}, position: {}, width: {}, height: {} } },
      ltc_1: { value: null },
      ltc_2: { value: null },
      probesSH: { value: null },
      probesMin: { value: new F() },
      probesMax: { value: new F() },
      probesResolution: { value: new F() },
    },
    points: {
      diffuse: { value: new Ce(16777215) },
      opacity: { value: 1 },
      size: { value: 1 },
      scale: { value: 1 },
      map: { value: null },
      alphaMap: { value: null },
      alphaMapTransform: { value: new Ie() },
      alphaTest: { value: 0 },
      uvTransform: { value: new Ie() },
    },
    sprite: {
      diffuse: { value: new Ce(16777215) },
      opacity: { value: 1 },
      center: { value: new Ge(0.5, 0.5) },
      rotation: { value: 0 },
      map: { value: null },
      mapTransform: { value: new Ie() },
      alphaMap: { value: null },
      alphaMapTransform: { value: new Ie() },
      alphaTest: { value: 0 },
    },
  },
  rn = {
    basic: {
      uniforms: Pt([le.common, le.specularmap, le.envmap, le.aomap, le.lightmap, le.fog]),
      vertexShader: Oe.meshbasic_vert,
      fragmentShader: Oe.meshbasic_frag,
    },
    lambert: {
      uniforms: Pt([
        le.common,
        le.specularmap,
        le.envmap,
        le.aomap,
        le.lightmap,
        le.emissivemap,
        le.bumpmap,
        le.normalmap,
        le.displacementmap,
        le.fog,
        le.lights,
        { emissive: { value: new Ce(0) }, envMapIntensity: { value: 1 } },
      ]),
      vertexShader: Oe.meshlambert_vert,
      fragmentShader: Oe.meshlambert_frag,
    },
    phong: {
      uniforms: Pt([
        le.common,
        le.specularmap,
        le.envmap,
        le.aomap,
        le.lightmap,
        le.emissivemap,
        le.bumpmap,
        le.normalmap,
        le.displacementmap,
        le.fog,
        le.lights,
        {
          emissive: { value: new Ce(0) },
          specular: { value: new Ce(1118481) },
          shininess: { value: 30 },
          envMapIntensity: { value: 1 },
        },
      ]),
      vertexShader: Oe.meshphong_vert,
      fragmentShader: Oe.meshphong_frag,
    },
    standard: {
      uniforms: Pt([
        le.common,
        le.envmap,
        le.aomap,
        le.lightmap,
        le.emissivemap,
        le.bumpmap,
        le.normalmap,
        le.displacementmap,
        le.roughnessmap,
        le.metalnessmap,
        le.fog,
        le.lights,
        {
          emissive: { value: new Ce(0) },
          roughness: { value: 1 },
          metalness: { value: 0 },
          envMapIntensity: { value: 1 },
        },
      ]),
      vertexShader: Oe.meshphysical_vert,
      fragmentShader: Oe.meshphysical_frag,
    },
    toon: {
      uniforms: Pt([
        le.common,
        le.aomap,
        le.lightmap,
        le.emissivemap,
        le.bumpmap,
        le.normalmap,
        le.displacementmap,
        le.gradientmap,
        le.fog,
        le.lights,
        { emissive: { value: new Ce(0) } },
      ]),
      vertexShader: Oe.meshtoon_vert,
      fragmentShader: Oe.meshtoon_frag,
    },
    matcap: {
      uniforms: Pt([le.common, le.bumpmap, le.normalmap, le.displacementmap, le.fog, { matcap: { value: null } }]),
      vertexShader: Oe.meshmatcap_vert,
      fragmentShader: Oe.meshmatcap_frag,
    },
    points: { uniforms: Pt([le.points, le.fog]), vertexShader: Oe.points_vert, fragmentShader: Oe.points_frag },
    dashed: {
      uniforms: Pt([le.common, le.fog, { scale: { value: 1 }, dashSize: { value: 1 }, totalSize: { value: 2 } }]),
      vertexShader: Oe.linedashed_vert,
      fragmentShader: Oe.linedashed_frag,
    },
    depth: {
      uniforms: Pt([le.common, le.displacementmap]),
      vertexShader: Oe.depth_vert,
      fragmentShader: Oe.depth_frag,
    },
    normal: {
      uniforms: Pt([le.common, le.bumpmap, le.normalmap, le.displacementmap, { opacity: { value: 1 } }]),
      vertexShader: Oe.meshnormal_vert,
      fragmentShader: Oe.meshnormal_frag,
    },
    sprite: { uniforms: Pt([le.sprite, le.fog]), vertexShader: Oe.sprite_vert, fragmentShader: Oe.sprite_frag },
    background: {
      uniforms: { uvTransform: { value: new Ie() }, t2D: { value: null }, backgroundIntensity: { value: 1 } },
      vertexShader: Oe.background_vert,
      fragmentShader: Oe.background_frag,
    },
    backgroundCube: {
      uniforms: {
        envMap: { value: null },
        backgroundBlurriness: { value: 0 },
        backgroundIntensity: { value: 1 },
        backgroundRotation: { value: new Ie() },
      },
      vertexShader: Oe.backgroundCube_vert,
      fragmentShader: Oe.backgroundCube_frag,
    },
    cube: {
      uniforms: { tCube: { value: null }, tFlip: { value: -1 }, opacity: { value: 1 } },
      vertexShader: Oe.cube_vert,
      fragmentShader: Oe.cube_frag,
    },
    equirect: {
      uniforms: { tEquirect: { value: null } },
      vertexShader: Oe.equirect_vert,
      fragmentShader: Oe.equirect_frag,
    },
    distance: {
      uniforms: Pt([
        le.common,
        le.displacementmap,
        { referencePosition: { value: new F() }, nearDistance: { value: 1 }, farDistance: { value: 1e3 } },
      ]),
      vertexShader: Oe.distance_vert,
      fragmentShader: Oe.distance_frag,
    },
    shadow: {
      uniforms: Pt([le.lights, le.fog, { color: { value: new Ce(0) }, opacity: { value: 1 } }]),
      vertexShader: Oe.shadow_vert,
      fragmentShader: Oe.shadow_frag,
    },
  };
rn.physical = {
  uniforms: Pt([
    rn.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: new Ie() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: new Ie() },
      clearcoatNormalScale: { value: new Ge(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: new Ie() },
      dispersion: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: new Ie() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: new Ie() },
      sheen: { value: 0 },
      sheenColor: { value: new Ce(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: new Ie() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: new Ie() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: new Ie() },
      transmissionSamplerSize: { value: new Ge() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: new Ie() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: new Ce(0) },
      specularColor: { value: new Ce(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: new Ie() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: new Ie() },
      anisotropyVector: { value: new Ge() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: new Ie() },
    },
  ]),
  vertexShader: Oe.meshphysical_vert,
  fragmentShader: Oe.meshphysical_frag,
};
const Os = { r: 0, b: 0, g: 0 },
  om = new He(),
  Pc = new Ie();
Pc.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function lm(i, e, t, n, s, r) {
  const a = new Ce(0);
  let o = s === !0 ? 0 : 1,
    c,
    l,
    u = null,
    d = 0,
    h = null;
  function f(S) {
    let E = S.isScene === !0 ? S.background : null;
    if (E && E.isTexture) {
      const b = S.backgroundBlurriness > 0;
      E = e.get(E, b);
    }
    return E;
  }
  function g(S) {
    let E = !1;
    const b = f(S);
    b === null ? m(a, o) : b && b.isColor && (m(b, 1), (E = !0));
    const R = i.xr.getEnvironmentBlendMode();
    (R === "additive"
      ? t.buffers.color.setClear(0, 0, 0, 1, r)
      : R === "alpha-blend" && t.buffers.color.setClear(0, 0, 0, 0, r),
      (i.autoClear || E) &&
        (t.buffers.depth.setTest(!0),
        t.buffers.depth.setMask(!0),
        t.buffers.color.setMask(!0),
        i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil)));
  }
  function M(S, E) {
    const b = f(E);
    b && (b.isCubeTexture || b.mapping === sr)
      ? (l === void 0 &&
          ((l = new Xt(
            new ns(1, 1, 1),
            new dn({
              name: "BackgroundCubeMaterial",
              uniforms: Ri(rn.backgroundCube.uniforms),
              vertexShader: rn.backgroundCube.vertexShader,
              fragmentShader: rn.backgroundCube.fragmentShader,
              side: It,
              depthTest: !1,
              depthWrite: !1,
              fog: !1,
              allowOverride: !1,
            }),
          )),
          l.geometry.deleteAttribute("normal"),
          l.geometry.deleteAttribute("uv"),
          (l.onBeforeRender = function (R, T, P) {
            this.matrixWorld.copyPosition(P.matrixWorld);
          }),
          Object.defineProperty(l.material, "envMap", {
            get: function () {
              return this.uniforms.envMap.value;
            },
          }),
          n.update(l)),
        (l.material.uniforms.envMap.value = b),
        (l.material.uniforms.backgroundBlurriness.value = E.backgroundBlurriness),
        (l.material.uniforms.backgroundIntensity.value = E.backgroundIntensity),
        l.material.uniforms.backgroundRotation.value
          .setFromMatrix4(om.makeRotationFromEuler(E.backgroundRotation))
          .transpose(),
        b.isCubeTexture &&
          b.isRenderTargetTexture === !1 &&
          l.material.uniforms.backgroundRotation.value.premultiply(Pc),
        (l.material.toneMapped = We.getTransfer(b.colorSpace) !== Ze),
        (u !== b || d !== b.version || h !== i.toneMapping) &&
          ((l.material.needsUpdate = !0), (u = b), (d = b.version), (h = i.toneMapping)),
        l.layers.enableAll(),
        S.unshift(l, l.geometry, l.material, 0, 0, null))
      : b &&
        b.isTexture &&
        (c === void 0 &&
          ((c = new Xt(
            new or(2, 2),
            new dn({
              name: "BackgroundMaterial",
              uniforms: Ri(rn.background.uniforms),
              vertexShader: rn.background.vertexShader,
              fragmentShader: rn.background.fragmentShader,
              side: kn,
              depthTest: !1,
              depthWrite: !1,
              fog: !1,
              allowOverride: !1,
            }),
          )),
          c.geometry.deleteAttribute("normal"),
          Object.defineProperty(c.material, "map", {
            get: function () {
              return this.uniforms.t2D.value;
            },
          }),
          n.update(c)),
        (c.material.uniforms.t2D.value = b),
        (c.material.uniforms.backgroundIntensity.value = E.backgroundIntensity),
        (c.material.toneMapped = We.getTransfer(b.colorSpace) !== Ze),
        b.matrixAutoUpdate === !0 && b.updateMatrix(),
        c.material.uniforms.uvTransform.value.copy(b.matrix),
        (u !== b || d !== b.version || h !== i.toneMapping) &&
          ((c.material.needsUpdate = !0), (u = b), (d = b.version), (h = i.toneMapping)),
        c.layers.enableAll(),
        S.unshift(c, c.geometry, c.material, 0, 0, null));
  }
  function m(S, E) {
    (S.getRGB(Os, Ec(i)), t.buffers.color.setClear(Os.r, Os.g, Os.b, E, r));
  }
  function p() {
    (l !== void 0 && (l.geometry.dispose(), l.material.dispose(), (l = void 0)),
      c !== void 0 && (c.geometry.dispose(), c.material.dispose(), (c = void 0)));
  }
  return {
    getClearColor: function () {
      return a;
    },
    setClearColor: function (S, E = 1) {
      (a.set(S), (o = E), m(a, o));
    },
    getClearAlpha: function () {
      return o;
    },
    setClearAlpha: function (S) {
      ((o = S), m(a, o));
    },
    render: g,
    addToRenderList: M,
    dispose: p,
  };
}
function cm(i, e) {
  const t = i.getParameter(i.MAX_VERTEX_ATTRIBS),
    n = {},
    s = h(null);
  let r = s,
    a = !1;
  function o(w, N, H, W, U) {
    let V = !1;
    const G = d(w, W, H, N);
    (r !== G && ((r = G), l(r.object)),
      (V = f(w, W, H, U)),
      V && g(w, W, H, U),
      U !== null && e.update(U, i.ELEMENT_ARRAY_BUFFER),
      (V || a) && ((a = !1), b(w, N, H, W), U !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, e.get(U).buffer)));
  }
  function c() {
    return i.createVertexArray();
  }
  function l(w) {
    return i.bindVertexArray(w);
  }
  function u(w) {
    return i.deleteVertexArray(w);
  }
  function d(w, N, H, W) {
    const U = W.wireframe === !0;
    let V = n[N.id];
    V === void 0 && ((V = {}), (n[N.id] = V));
    const G = w.isInstancedMesh === !0 ? w.id : 0;
    let J = V[G];
    J === void 0 && ((J = {}), (V[G] = J));
    let Q = J[H.id];
    Q === void 0 && ((Q = {}), (J[H.id] = Q));
    let ce = Q[U];
    return (ce === void 0 && ((ce = h(c())), (Q[U] = ce)), ce);
  }
  function h(w) {
    const N = [],
      H = [],
      W = [];
    for (let U = 0; U < t; U++) ((N[U] = 0), (H[U] = 0), (W[U] = 0));
    return {
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: N,
      enabledAttributes: H,
      attributeDivisors: W,
      object: w,
      attributes: {},
      index: null,
    };
  }
  function f(w, N, H, W) {
    const U = r.attributes,
      V = N.attributes;
    let G = 0;
    const J = H.getAttributes();
    for (const Q in J)
      if (J[Q].location >= 0) {
        const ve = U[Q];
        let be = V[Q];
        if (
          (be === void 0 &&
            (Q === "instanceMatrix" && w.instanceMatrix && (be = w.instanceMatrix),
            Q === "instanceColor" && w.instanceColor && (be = w.instanceColor)),
          ve === void 0 || ve.attribute !== be || (be && ve.data !== be.data))
        )
          return !0;
        G++;
      }
    return r.attributesNum !== G || r.index !== W;
  }
  function g(w, N, H, W) {
    const U = {},
      V = N.attributes;
    let G = 0;
    const J = H.getAttributes();
    for (const Q in J)
      if (J[Q].location >= 0) {
        let ve = V[Q];
        ve === void 0 &&
          (Q === "instanceMatrix" && w.instanceMatrix && (ve = w.instanceMatrix),
          Q === "instanceColor" && w.instanceColor && (ve = w.instanceColor));
        const be = {};
        ((be.attribute = ve), ve && ve.data && (be.data = ve.data), (U[Q] = be), G++);
      }
    ((r.attributes = U), (r.attributesNum = G), (r.index = W));
  }
  function M() {
    const w = r.newAttributes;
    for (let N = 0, H = w.length; N < H; N++) w[N] = 0;
  }
  function m(w) {
    p(w, 0);
  }
  function p(w, N) {
    const H = r.newAttributes,
      W = r.enabledAttributes,
      U = r.attributeDivisors;
    ((H[w] = 1),
      W[w] === 0 && (i.enableVertexAttribArray(w), (W[w] = 1)),
      U[w] !== N && (i.vertexAttribDivisor(w, N), (U[w] = N)));
  }
  function S() {
    const w = r.newAttributes,
      N = r.enabledAttributes;
    for (let H = 0, W = N.length; H < W; H++) N[H] !== w[H] && (i.disableVertexAttribArray(H), (N[H] = 0));
  }
  function E(w, N, H, W, U, V, G) {
    G === !0 ? i.vertexAttribIPointer(w, N, H, U, V) : i.vertexAttribPointer(w, N, H, W, U, V);
  }
  function b(w, N, H, W) {
    M();
    const U = W.attributes,
      V = H.getAttributes(),
      G = N.defaultAttributeValues;
    for (const J in V) {
      const Q = V[J];
      if (Q.location >= 0) {
        let ce = U[J];
        if (
          (ce === void 0 &&
            (J === "instanceMatrix" && w.instanceMatrix && (ce = w.instanceMatrix),
            J === "instanceColor" && w.instanceColor && (ce = w.instanceColor)),
          ce !== void 0)
        ) {
          const ve = ce.normalized,
            be = ce.itemSize,
            Xe = e.get(ce);
          if (Xe === void 0) continue;
          const $e = Xe.buffer,
            Ue = Xe.type,
            K = Xe.bytesPerElement,
            de = Ue === i.INT || Ue === i.UNSIGNED_INT || ce.gpuType === qa;
          if (ce.isInterleavedBufferAttribute) {
            const ie = ce.data,
              Ae = ie.stride,
              Pe = ce.offset;
            if (ie.isInstancedInterleavedBuffer) {
              for (let we = 0; we < Q.locationSize; we++) p(Q.location + we, ie.meshPerAttribute);
              w.isInstancedMesh !== !0 &&
                W._maxInstanceCount === void 0 &&
                (W._maxInstanceCount = ie.meshPerAttribute * ie.count);
            } else for (let we = 0; we < Q.locationSize; we++) m(Q.location + we);
            i.bindBuffer(i.ARRAY_BUFFER, $e);
            for (let we = 0; we < Q.locationSize; we++)
              E(Q.location + we, be / Q.locationSize, Ue, ve, Ae * K, (Pe + (be / Q.locationSize) * we) * K, de);
          } else {
            if (ce.isInstancedBufferAttribute) {
              for (let ie = 0; ie < Q.locationSize; ie++) p(Q.location + ie, ce.meshPerAttribute);
              w.isInstancedMesh !== !0 &&
                W._maxInstanceCount === void 0 &&
                (W._maxInstanceCount = ce.meshPerAttribute * ce.count);
            } else for (let ie = 0; ie < Q.locationSize; ie++) m(Q.location + ie);
            i.bindBuffer(i.ARRAY_BUFFER, $e);
            for (let ie = 0; ie < Q.locationSize; ie++)
              E(Q.location + ie, be / Q.locationSize, Ue, ve, be * K, (be / Q.locationSize) * ie * K, de);
          }
        } else if (G !== void 0) {
          const ve = G[J];
          if (ve !== void 0)
            switch (ve.length) {
              case 2:
                i.vertexAttrib2fv(Q.location, ve);
                break;
              case 3:
                i.vertexAttrib3fv(Q.location, ve);
                break;
              case 4:
                i.vertexAttrib4fv(Q.location, ve);
                break;
              default:
                i.vertexAttrib1fv(Q.location, ve);
            }
        }
      }
    }
    S();
  }
  function R() {
    A();
    for (const w in n) {
      const N = n[w];
      for (const H in N) {
        const W = N[H];
        for (const U in W) {
          const V = W[U];
          for (const G in V) (u(V[G].object), delete V[G]);
          delete W[U];
        }
      }
      delete n[w];
    }
  }
  function T(w) {
    if (n[w.id] === void 0) return;
    const N = n[w.id];
    for (const H in N) {
      const W = N[H];
      for (const U in W) {
        const V = W[U];
        for (const G in V) (u(V[G].object), delete V[G]);
        delete W[U];
      }
    }
    delete n[w.id];
  }
  function P(w) {
    for (const N in n) {
      const H = n[N];
      for (const W in H) {
        const U = H[W];
        if (U[w.id] === void 0) continue;
        const V = U[w.id];
        for (const G in V) (u(V[G].object), delete V[G]);
        delete U[w.id];
      }
    }
  }
  function x(w) {
    for (const N in n) {
      const H = n[N],
        W = w.isInstancedMesh === !0 ? w.id : 0,
        U = H[W];
      if (U !== void 0) {
        for (const V in U) {
          const G = U[V];
          for (const J in G) (u(G[J].object), delete G[J]);
          delete U[V];
        }
        (delete H[W], Object.keys(H).length === 0 && delete n[N]);
      }
    }
  }
  function A() {
    (L(), (a = !0), r !== s && ((r = s), l(r.object)));
  }
  function L() {
    ((s.geometry = null), (s.program = null), (s.wireframe = !1));
  }
  return {
    setup: o,
    reset: A,
    resetDefaultState: L,
    dispose: R,
    releaseStatesOfGeometry: T,
    releaseStatesOfObject: x,
    releaseStatesOfProgram: P,
    initAttributes: M,
    enableAttribute: m,
    disableUnusedAttributes: S,
  };
}
function hm(i, e, t) {
  let n;
  function s(c) {
    n = c;
  }
  function r(c, l) {
    (i.drawArrays(n, c, l), t.update(l, n, 1));
  }
  function a(c, l, u) {
    u !== 0 && (i.drawArraysInstanced(n, c, l, u), t.update(l, n, u));
  }
  function o(c, l, u) {
    if (u === 0) return;
    e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, c, 0, l, 0, u);
    let h = 0;
    for (let f = 0; f < u; f++) h += l[f];
    t.update(h, n, 1);
  }
  ((this.setMode = s), (this.render = r), (this.renderInstances = a), (this.renderMultiDraw = o));
}
function um(i, e, t, n) {
  let s;
  function r() {
    if (s !== void 0) return s;
    if (e.has("EXT_texture_filter_anisotropic") === !0) {
      const P = e.get("EXT_texture_filter_anisotropic");
      s = i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else s = 0;
    return s;
  }
  function a(P) {
    return !(P !== Ht && n.convert(P) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT));
  }
  function o(P) {
    const x = P === En && (e.has("EXT_color_buffer_half_float") || e.has("EXT_color_buffer_float"));
    return !(P !== Bt && n.convert(P) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE) && P !== Gt && !x);
  }
  function c(P) {
    if (P === "highp") {
      if (
        i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision > 0 &&
        i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision > 0
      )
        return "highp";
      P = "mediump";
    }
    return P === "mediump" &&
      i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision > 0 &&
      i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).precision > 0
      ? "mediump"
      : "lowp";
  }
  let l = t.precision !== void 0 ? t.precision : "highp";
  const u = c(l);
  u !== l && (xe("WebGLRenderer:", l, "not supported, using", u, "instead."), (l = u));
  const d = t.logarithmicDepthBuffer === !0,
    h = t.reversedDepthBuffer === !0 && e.has("EXT_clip_control");
  t.reversedDepthBuffer === !0 &&
    h === !1 &&
    xe(
      "WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.",
    );
  const f = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),
    g = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
    M = i.getParameter(i.MAX_TEXTURE_SIZE),
    m = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),
    p = i.getParameter(i.MAX_VERTEX_ATTRIBS),
    S = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),
    E = i.getParameter(i.MAX_VARYING_VECTORS),
    b = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),
    R = i.getParameter(i.MAX_SAMPLES),
    T = i.getParameter(i.SAMPLES);
  return {
    isWebGL2: !0,
    getMaxAnisotropy: r,
    getMaxPrecision: c,
    textureFormatReadable: a,
    textureTypeReadable: o,
    precision: l,
    logarithmicDepthBuffer: d,
    reversedDepthBuffer: h,
    maxTextures: f,
    maxVertexTextures: g,
    maxTextureSize: M,
    maxCubemapSize: m,
    maxAttributes: p,
    maxVertexUniforms: S,
    maxVaryings: E,
    maxFragmentUniforms: b,
    maxSamples: R,
    samples: T,
  };
}
function dm(i) {
  const e = this;
  let t = null,
    n = 0,
    s = !1,
    r = !1;
  const a = new Zn(),
    o = new Ie(),
    c = { value: null, needsUpdate: !1 };
  ((this.uniform = c),
    (this.numPlanes = 0),
    (this.numIntersection = 0),
    (this.init = function (d, h) {
      const f = d.length !== 0 || h || n !== 0 || s;
      return ((s = h), (n = d.length), f);
    }),
    (this.beginShadows = function () {
      ((r = !0), u(null));
    }),
    (this.endShadows = function () {
      r = !1;
    }),
    (this.setGlobalState = function (d, h) {
      t = u(d, h, 0);
    }),
    (this.setState = function (d, h, f) {
      const g = d.clippingPlanes,
        M = d.clipIntersection,
        m = d.clipShadows,
        p = i.get(d);
      if (!s || g === null || g.length === 0 || (r && !m)) r ? u(null) : l();
      else {
        const S = r ? 0 : n,
          E = S * 4;
        let b = p.clippingState || null;
        ((c.value = b), (b = u(g, h, E, f)));
        for (let R = 0; R !== E; ++R) b[R] = t[R];
        ((p.clippingState = b), (this.numIntersection = M ? this.numPlanes : 0), (this.numPlanes += S));
      }
    }));
  function l() {
    (c.value !== t && ((c.value = t), (c.needsUpdate = n > 0)), (e.numPlanes = n), (e.numIntersection = 0));
  }
  function u(d, h, f, g) {
    const M = d !== null ? d.length : 0;
    let m = null;
    if (M !== 0) {
      if (((m = c.value), g !== !0 || m === null)) {
        const p = f + M * 4,
          S = h.matrixWorldInverse;
        (o.getNormalMatrix(S), (m === null || m.length < p) && (m = new Float32Array(p)));
        for (let E = 0, b = f; E !== M; ++E, b += 4)
          (a.copy(d[E]).applyMatrix4(S, o), a.normal.toArray(m, b), (m[b + 3] = a.constant));
      }
      ((c.value = m), (c.needsUpdate = !0));
    }
    return ((e.numPlanes = M), (e.numIntersection = 0), m);
  }
}
const Vn = 4,
  Sl = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582],
  jn = 20,
  fm = 256,
  ki = new oo(),
  yl = new Ce();
let Wr = null,
  Xr = 0,
  qr = 0,
  Yr = !1;
const pm = new F();
class bl {
  constructor(e) {
    ((this._renderer = e),
      (this._pingPongRenderTarget = null),
      (this._lodMax = 0),
      (this._cubeSize = 0),
      (this._sizeLods = []),
      (this._sigmas = []),
      (this._lodMeshes = []),
      (this._backgroundBox = null),
      (this._cubemapMaterial = null),
      (this._equirectMaterial = null),
      (this._blurMaterial = null),
      (this._ggxMaterial = null));
  }
  fromScene(e, t = 0, n = 0.1, s = 100, r = {}) {
    const { size: a = 256, position: o = pm } = r;
    ((Wr = this._renderer.getRenderTarget()),
      (Xr = this._renderer.getActiveCubeFace()),
      (qr = this._renderer.getActiveMipmapLevel()),
      (Yr = this._renderer.xr.enabled),
      (this._renderer.xr.enabled = !1),
      this._setSize(a));
    const c = this._allocateTargets();
    return (
      (c.depthBuffer = !0),
      this._sceneToCubeUV(e, n, s, c, o),
      t > 0 && this._blur(c, 0, 0, t),
      this._applyPMREM(c),
      this._cleanup(c),
      c
    );
  }
  fromEquirectangular(e, t = null) {
    return this._fromTexture(e, t);
  }
  fromCubemap(e, t = null) {
    return this._fromTexture(e, t);
  }
  compileCubemapShader() {
    this._cubemapMaterial === null && ((this._cubemapMaterial = Al()), this._compileMaterial(this._cubemapMaterial));
  }
  compileEquirectangularShader() {
    this._equirectMaterial === null && ((this._equirectMaterial = Tl()), this._compileMaterial(this._equirectMaterial));
  }
  dispose() {
    (this._dispose(),
      this._cubemapMaterial !== null && this._cubemapMaterial.dispose(),
      this._equirectMaterial !== null && this._equirectMaterial.dispose(),
      this._backgroundBox !== null && (this._backgroundBox.geometry.dispose(), this._backgroundBox.material.dispose()));
  }
  _setSize(e) {
    ((this._lodMax = Math.floor(Math.log2(e))), (this._cubeSize = Math.pow(2, this._lodMax)));
  }
  _dispose() {
    (this._blurMaterial !== null && this._blurMaterial.dispose(),
      this._ggxMaterial !== null && this._ggxMaterial.dispose(),
      this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose());
    for (let e = 0; e < this._lodMeshes.length; e++) this._lodMeshes[e].geometry.dispose();
  }
  _cleanup(e) {
    (this._renderer.setRenderTarget(Wr, Xr, qr),
      (this._renderer.xr.enabled = Yr),
      (e.scissorTest = !1),
      xi(e, 0, 0, e.width, e.height));
  }
  _fromTexture(e, t) {
    (e.mapping === Jn || e.mapping === Ei
      ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width)
      : this._setSize(e.image.width / 4),
      (Wr = this._renderer.getRenderTarget()),
      (Xr = this._renderer.getActiveCubeFace()),
      (qr = this._renderer.getActiveMipmapLevel()),
      (Yr = this._renderer.xr.enabled),
      (this._renderer.xr.enabled = !1));
    const n = t || this._allocateTargets();
    return (this._textureToCubeUV(e, n), this._applyPMREM(n), this._cleanup(n), n);
  }
  _allocateTargets() {
    const e = 3 * Math.max(this._cubeSize, 112),
      t = 4 * this._cubeSize,
      n = { magFilter: vt, minFilter: vt, generateMipmaps: !1, type: En, format: Ht, colorSpace: Ks, depthBuffer: !1 },
      s = El(e, t, n);
    if (
      this._pingPongRenderTarget === null ||
      this._pingPongRenderTarget.width !== e ||
      this._pingPongRenderTarget.height !== t
    ) {
      (this._pingPongRenderTarget !== null && this._dispose(), (this._pingPongRenderTarget = El(e, t, n)));
      const { _lodMax: r } = this;
      (({ lodMeshes: this._lodMeshes, sizeLods: this._sizeLods, sigmas: this._sigmas } = mm(r)),
        (this._blurMaterial = _m(r, e, t)),
        (this._ggxMaterial = gm(r, e, t)));
    }
    return s;
  }
  _compileMaterial(e) {
    const t = new Xt(new Lt(), e);
    this._renderer.compile(t, ki);
  }
  _sceneToCubeUV(e, t, n, s, r) {
    const c = new Ot(90, 1, t, n),
      l = [1, -1, 1, 1, 1, 1],
      u = [1, 1, 1, -1, -1, -1],
      d = this._renderer,
      h = d.autoClear,
      f = d.toneMapping;
    (d.getClearColor(yl),
      (d.toneMapping = on),
      (d.autoClear = !1),
      d.state.buffers.depth.getReversed() && (d.setRenderTarget(s), d.clearDepth(), d.setRenderTarget(null)),
      this._backgroundBox === null &&
        (this._backgroundBox = new Xt(
          new ns(),
          new uc({ name: "PMREM.Background", side: It, depthWrite: !1, depthTest: !1 }),
        )));
    const M = this._backgroundBox,
      m = M.material;
    let p = !1;
    const S = e.background;
    S ? S.isColor && (m.color.copy(S), (e.background = null), (p = !0)) : (m.color.copy(yl), (p = !0));
    for (let E = 0; E < 6; E++) {
      const b = E % 3;
      b === 0
        ? (c.up.set(0, l[E], 0), c.position.set(r.x, r.y, r.z), c.lookAt(r.x + u[E], r.y, r.z))
        : b === 1
          ? (c.up.set(0, 0, l[E]), c.position.set(r.x, r.y, r.z), c.lookAt(r.x, r.y + u[E], r.z))
          : (c.up.set(0, l[E], 0), c.position.set(r.x, r.y, r.z), c.lookAt(r.x, r.y, r.z + u[E]));
      const R = this._cubeSize;
      (xi(s, b * R, E > 2 ? R : 0, R, R), d.setRenderTarget(s), p && d.render(M, c), d.render(e, c));
    }
    ((d.toneMapping = f), (d.autoClear = h), (e.background = S));
  }
  _textureToCubeUV(e, t) {
    const n = this._renderer,
      s = e.mapping === Jn || e.mapping === Ei;
    s
      ? (this._cubemapMaterial === null && (this._cubemapMaterial = Al()),
        (this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === !1 ? -1 : 1))
      : this._equirectMaterial === null && (this._equirectMaterial = Tl());
    const r = s ? this._cubemapMaterial : this._equirectMaterial,
      a = this._lodMeshes[0];
    a.material = r;
    const o = r.uniforms;
    o.envMap.value = e;
    const c = this._cubeSize;
    (xi(t, 0, 0, 3 * c, 2 * c), n.setRenderTarget(t), n.render(a, ki));
  }
  _applyPMREM(e) {
    const t = this._renderer,
      n = t.autoClear;
    t.autoClear = !1;
    const s = this._lodMeshes.length;
    for (let r = 1; r < s; r++) this._applyGGXFilter(e, r - 1, r);
    t.autoClear = n;
  }
  _applyGGXFilter(e, t, n) {
    const s = this._renderer,
      r = this._pingPongRenderTarget,
      a = this._ggxMaterial,
      o = this._lodMeshes[n];
    o.material = a;
    const c = a.uniforms,
      l = n / (this._lodMeshes.length - 1),
      u = t / (this._lodMeshes.length - 1),
      d = Math.sqrt(l * l - u * u),
      h = 0 + l * 1.25,
      f = d * h,
      { _lodMax: g } = this,
      M = this._sizeLods[n],
      m = 3 * M * (n > g - Vn ? n - g + Vn : 0),
      p = 4 * (this._cubeSize - M);
    ((c.envMap.value = e.texture),
      (c.roughness.value = f),
      (c.mipInt.value = g - t),
      xi(r, m, p, 3 * M, 2 * M),
      s.setRenderTarget(r),
      s.render(o, ki),
      (c.envMap.value = r.texture),
      (c.roughness.value = 0),
      (c.mipInt.value = g - n),
      xi(e, m, p, 3 * M, 2 * M),
      s.setRenderTarget(e),
      s.render(o, ki));
  }
  _blur(e, t, n, s, r) {
    const a = this._pingPongRenderTarget;
    (this._halfBlur(e, a, t, n, s, "latitudinal", r), this._halfBlur(a, e, n, n, s, "longitudinal", r));
  }
  _halfBlur(e, t, n, s, r, a, o) {
    const c = this._renderer,
      l = this._blurMaterial;
    a !== "latitudinal" && a !== "longitudinal" && Te("blur direction must be either latitudinal or longitudinal!");
    const u = 3,
      d = this._lodMeshes[s];
    d.material = l;
    const h = l.uniforms,
      f = this._sizeLods[n] - 1,
      g = isFinite(r) ? Math.PI / (2 * f) : (2 * Math.PI) / (2 * jn - 1),
      M = r / g,
      m = isFinite(r) ? 1 + Math.floor(u * M) : jn;
    m > jn &&
      xe(
        `sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${jn}`,
      );
    const p = [];
    let S = 0;
    for (let P = 0; P < jn; ++P) {
      const x = P / M,
        A = Math.exp((-x * x) / 2);
      (p.push(A), P === 0 ? (S += A) : P < m && (S += 2 * A));
    }
    for (let P = 0; P < p.length; P++) p[P] = p[P] / S;
    ((h.envMap.value = e.texture),
      (h.samples.value = m),
      (h.weights.value = p),
      (h.latitudinal.value = a === "latitudinal"),
      o && (h.poleAxis.value = o));
    const { _lodMax: E } = this;
    ((h.dTheta.value = g), (h.mipInt.value = E - n));
    const b = this._sizeLods[s],
      R = 3 * b * (s > E - Vn ? s - E + Vn : 0),
      T = 4 * (this._cubeSize - b);
    (xi(t, R, T, 3 * b, 2 * b), c.setRenderTarget(t), c.render(d, ki));
  }
}
function mm(i) {
  const e = [],
    t = [],
    n = [];
  let s = i;
  const r = i - Vn + 1 + Sl.length;
  for (let a = 0; a < r; a++) {
    const o = Math.pow(2, s);
    e.push(o);
    let c = 1 / o;
    (a > i - Vn ? (c = Sl[a - i + Vn - 1]) : a === 0 && (c = 0), t.push(c));
    const l = 1 / (o - 2),
      u = -l,
      d = 1 + l,
      h = [u, u, d, u, d, d, u, u, d, d, u, d],
      f = 6,
      g = 6,
      M = 3,
      m = 2,
      p = 1,
      S = new Float32Array(M * g * f),
      E = new Float32Array(m * g * f),
      b = new Float32Array(p * g * f);
    for (let T = 0; T < f; T++) {
      const P = ((T % 3) * 2) / 3 - 1,
        x = T > 2 ? 0 : -1,
        A = [P, x, 0, P + 2 / 3, x, 0, P + 2 / 3, x + 1, 0, P, x, 0, P + 2 / 3, x + 1, 0, P, x + 1, 0];
      (S.set(A, M * g * T), E.set(h, m * g * T));
      const L = [T, T, T, T, T, T];
      b.set(L, p * g * T);
    }
    const R = new Lt();
    (R.setAttribute("position", new Wt(S, M)),
      R.setAttribute("uv", new Wt(E, m)),
      R.setAttribute("faceIndex", new Wt(b, p)),
      n.push(new Xt(R, null)),
      s > Vn && s--);
  }
  return { lodMeshes: n, sizeLods: e, sigmas: t };
}
function El(i, e, t) {
  const n = new cn(i, e, t);
  return ((n.texture.mapping = sr), (n.texture.name = "PMREM.cubeUv"), (n.scissorTest = !0), n);
}
function xi(i, e, t, n, s) {
  (i.viewport.set(e, t, n, s), i.scissor.set(e, t, n, s));
}
function gm(i, e, t) {
  return new dn({
    name: "PMREMGGXConvolution",
    defines: { GGX_SAMPLES: fm, CUBEUV_TEXEL_WIDTH: 1 / e, CUBEUV_TEXEL_HEIGHT: 1 / t, CUBEUV_MAX_MIP: `${i}.0` },
    uniforms: { envMap: { value: null }, roughness: { value: 0 }, mipInt: { value: 0 } },
    vertexShader: cr(),
    fragmentShader: `

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,
    blending: yn,
    depthTest: !1,
    depthWrite: !1,
  });
}
function _m(i, e, t) {
  const n = new Float32Array(jn),
    s = new F(0, 1, 0);
  return new dn({
    name: "SphericalGaussianBlur",
    defines: { n: jn, CUBEUV_TEXEL_WIDTH: 1 / e, CUBEUV_TEXEL_HEIGHT: 1 / t, CUBEUV_MAX_MIP: `${i}.0` },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: n },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: s },
    },
    vertexShader: cr(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,
    blending: yn,
    depthTest: !1,
    depthWrite: !1,
  });
}
function Tl() {
  return new dn({
    name: "EquirectangularToCubeUV",
    uniforms: { envMap: { value: null } },
    vertexShader: cr(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,
    blending: yn,
    depthTest: !1,
    depthWrite: !1,
  });
}
function Al() {
  return new dn({
    name: "CubemapToCubeUV",
    uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 } },
    vertexShader: cr(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,
    blending: yn,
    depthTest: !1,
    depthWrite: !1,
  });
}
function cr() {
  return `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`;
}
class Ic extends cn {
  constructor(e = 1, t = {}) {
    (super(e, e, t), (this.isWebGLCubeRenderTarget = !0));
    const n = { width: e, height: e, depth: 1 },
      s = [n, n, n, n, n, n];
    ((this.texture = new mc(s)), this._setTextureOptions(t), (this.texture.isRenderTargetTexture = !0));
  }
  fromEquirectangularTexture(e, t) {
    ((this.texture.type = t.type),
      (this.texture.colorSpace = t.colorSpace),
      (this.texture.generateMipmaps = t.generateMipmaps),
      (this.texture.minFilter = t.minFilter),
      (this.texture.magFilter = t.magFilter));
    const n = {
        uniforms: { tEquirect: { value: null } },
        vertexShader: `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,
        fragmentShader: `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`,
      },
      s = new ns(5, 5, 5),
      r = new dn({
        name: "CubemapFromEquirect",
        uniforms: Ri(n.uniforms),
        vertexShader: n.vertexShader,
        fragmentShader: n.fragmentShader,
        side: It,
        blending: yn,
      });
    r.uniforms.tEquirect.value = t;
    const a = new Xt(s, r),
      o = t.minFilter;
    return (
      t.minFilter === zn && (t.minFilter = vt),
      new hd(1, 10, this).update(e, a),
      (t.minFilter = o),
      a.geometry.dispose(),
      a.material.dispose(),
      this
    );
  }
  clear(e, t = !0, n = !0, s = !0) {
    const r = e.getRenderTarget();
    for (let a = 0; a < 6; a++) (e.setRenderTarget(this, a), e.clear(t, n, s));
    e.setRenderTarget(r);
  }
}
function xm(i) {
  let e = new WeakMap(),
    t = new WeakMap(),
    n = null;
  function s(h, f = !1) {
    return h == null ? null : f ? a(h) : r(h);
  }
  function r(h) {
    if (h && h.isTexture) {
      const f = h.mapping;
      if (f === fr || f === pr)
        if (e.has(h)) {
          const g = e.get(h).texture;
          return o(g, h.mapping);
        } else {
          const g = h.image;
          if (g && g.height > 0) {
            const M = new Ic(g.height);
            return (
              M.fromEquirectangularTexture(i, h),
              e.set(h, M),
              h.addEventListener("dispose", l),
              o(M.texture, h.mapping)
            );
          } else return null;
        }
    }
    return h;
  }
  function a(h) {
    if (h && h.isTexture) {
      const f = h.mapping,
        g = f === fr || f === pr,
        M = f === Jn || f === Ei;
      if (g || M) {
        let m = t.get(h);
        const p = m !== void 0 ? m.texture.pmremVersion : 0;
        if (h.isRenderTargetTexture && h.pmremVersion !== p)
          return (
            n === null && (n = new bl(i)),
            (m = g ? n.fromEquirectangular(h, m) : n.fromCubemap(h, m)),
            (m.texture.pmremVersion = h.pmremVersion),
            t.set(h, m),
            m.texture
          );
        if (m !== void 0) return m.texture;
        {
          const S = h.image;
          return (g && S && S.height > 0) || (M && S && c(S))
            ? (n === null && (n = new bl(i)),
              (m = g ? n.fromEquirectangular(h) : n.fromCubemap(h)),
              (m.texture.pmremVersion = h.pmremVersion),
              t.set(h, m),
              h.addEventListener("dispose", u),
              m.texture)
            : null;
        }
      }
    }
    return h;
  }
  function o(h, f) {
    return (f === fr ? (h.mapping = Jn) : f === pr && (h.mapping = Ei), h);
  }
  function c(h) {
    let f = 0;
    const g = 6;
    for (let M = 0; M < g; M++) h[M] !== void 0 && f++;
    return f === g;
  }
  function l(h) {
    const f = h.target;
    f.removeEventListener("dispose", l);
    const g = e.get(f);
    g !== void 0 && (e.delete(f), g.dispose());
  }
  function u(h) {
    const f = h.target;
    f.removeEventListener("dispose", u);
    const g = t.get(f);
    g !== void 0 && (t.delete(f), g.dispose());
  }
  function d() {
    ((e = new WeakMap()), (t = new WeakMap()), n !== null && (n.dispose(), (n = null)));
  }
  return { get: s, dispose: d };
}
function vm(i) {
  const e = {};
  function t(n) {
    if (e[n] !== void 0) return e[n];
    const s = i.getExtension(n);
    return ((e[n] = s), s);
  }
  return {
    has: function (n) {
      return t(n) !== null;
    },
    init: function () {
      (t("EXT_color_buffer_float"),
        t("WEBGL_clip_cull_distance"),
        t("OES_texture_float_linear"),
        t("EXT_color_buffer_half_float"),
        t("WEBGL_multisampled_render_to_texture"),
        t("WEBGL_render_shared_exponent"));
    },
    get: function (n) {
      const s = t(n);
      return (s === null && za("WebGLRenderer: " + n + " extension not supported."), s);
    },
  };
}
function Mm(i, e, t, n) {
  const s = {},
    r = new WeakMap();
  function a(d) {
    const h = d.target;
    h.index !== null && e.remove(h.index);
    for (const g in h.attributes) e.remove(h.attributes[g]);
    (h.removeEventListener("dispose", a), delete s[h.id]);
    const f = r.get(h);
    (f && (e.remove(f), r.delete(h)),
      n.releaseStatesOfGeometry(h),
      h.isInstancedBufferGeometry === !0 && delete h._maxInstanceCount,
      t.memory.geometries--);
  }
  function o(d, h) {
    return (s[h.id] === !0 || (h.addEventListener("dispose", a), (s[h.id] = !0), t.memory.geometries++), h);
  }
  function c(d) {
    const h = d.attributes;
    for (const f in h) e.update(h[f], i.ARRAY_BUFFER);
  }
  function l(d) {
    const h = [],
      f = d.index,
      g = d.attributes.position;
    let M = 0;
    if (g === void 0) return;
    if (f !== null) {
      const S = f.array;
      M = f.version;
      for (let E = 0, b = S.length; E < b; E += 3) {
        const R = S[E + 0],
          T = S[E + 1],
          P = S[E + 2];
        h.push(R, T, T, P, P, R);
      }
    } else {
      const S = g.array;
      M = g.version;
      for (let E = 0, b = S.length / 3 - 1; E < b; E += 3) {
        const R = E + 0,
          T = E + 1,
          P = E + 2;
        h.push(R, T, T, P, P, R);
      }
    }
    const m = new (g.count >= 65535 ? cc : lc)(h, 1);
    m.version = M;
    const p = r.get(d);
    (p && e.remove(p), r.set(d, m));
  }
  function u(d) {
    const h = r.get(d);
    if (h) {
      const f = d.index;
      f !== null && h.version < f.version && l(d);
    } else l(d);
    return r.get(d);
  }
  return { get: o, update: c, getWireframeAttribute: u };
}
function Sm(i, e, t) {
  let n;
  function s(d) {
    n = d;
  }
  let r, a;
  function o(d) {
    ((r = d.type), (a = d.bytesPerElement));
  }
  function c(d, h) {
    (i.drawElements(n, h, r, d * a), t.update(h, n, 1));
  }
  function l(d, h, f) {
    f !== 0 && (i.drawElementsInstanced(n, h, r, d * a, f), t.update(h, n, f));
  }
  function u(d, h, f) {
    if (f === 0) return;
    e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, h, 0, r, d, 0, f);
    let M = 0;
    for (let m = 0; m < f; m++) M += h[m];
    t.update(M, n, 1);
  }
  ((this.setMode = s), (this.setIndex = o), (this.render = c), (this.renderInstances = l), (this.renderMultiDraw = u));
}
function ym(i) {
  const e = { geometries: 0, textures: 0 },
    t = { frame: 0, calls: 0, triangles: 0, points: 0, lines: 0 };
  function n(r, a, o) {
    switch ((t.calls++, a)) {
      case i.TRIANGLES:
        t.triangles += o * (r / 3);
        break;
      case i.LINES:
        t.lines += o * (r / 2);
        break;
      case i.LINE_STRIP:
        t.lines += o * (r - 1);
        break;
      case i.LINE_LOOP:
        t.lines += o * r;
        break;
      case i.POINTS:
        t.points += o * r;
        break;
      default:
        Te("WebGLInfo: Unknown draw mode:", a);
        break;
    }
  }
  function s() {
    ((t.calls = 0), (t.triangles = 0), (t.points = 0), (t.lines = 0));
  }
  return { memory: e, render: t, programs: null, autoReset: !0, reset: s, update: n };
}
function bm(i, e, t) {
  const n = new WeakMap(),
    s = new it();
  function r(a, o, c) {
    const l = a.morphTargetInfluences,
      u = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color,
      d = u !== void 0 ? u.length : 0;
    let h = n.get(o);
    if (h === void 0 || h.count !== d) {
      let A = function () {
        (P.dispose(), n.delete(o), o.removeEventListener("dispose", A));
      };
      h !== void 0 && h.texture.dispose();
      const f = o.morphAttributes.position !== void 0,
        g = o.morphAttributes.normal !== void 0,
        M = o.morphAttributes.color !== void 0,
        m = o.morphAttributes.position || [],
        p = o.morphAttributes.normal || [],
        S = o.morphAttributes.color || [];
      let E = 0;
      (f === !0 && (E = 1), g === !0 && (E = 2), M === !0 && (E = 3));
      let b = o.attributes.position.count * E,
        R = 1;
      b > e.maxTextureSize && ((R = Math.ceil(b / e.maxTextureSize)), (b = e.maxTextureSize));
      const T = new Float32Array(b * R * 4 * d),
        P = new rc(T, b, R, d);
      ((P.type = Gt), (P.needsUpdate = !0));
      const x = E * 4;
      for (let L = 0; L < d; L++) {
        const w = m[L],
          N = p[L],
          H = S[L],
          W = b * R * 4 * L;
        for (let U = 0; U < w.count; U++) {
          const V = U * x;
          (f === !0 &&
            (s.fromBufferAttribute(w, U),
            (T[W + V + 0] = s.x),
            (T[W + V + 1] = s.y),
            (T[W + V + 2] = s.z),
            (T[W + V + 3] = 0)),
            g === !0 &&
              (s.fromBufferAttribute(N, U),
              (T[W + V + 4] = s.x),
              (T[W + V + 5] = s.y),
              (T[W + V + 6] = s.z),
              (T[W + V + 7] = 0)),
            M === !0 &&
              (s.fromBufferAttribute(H, U),
              (T[W + V + 8] = s.x),
              (T[W + V + 9] = s.y),
              (T[W + V + 10] = s.z),
              (T[W + V + 11] = H.itemSize === 4 ? s.w : 1)));
        }
      }
      ((h = { count: d, texture: P, size: new Ge(b, R) }), n.set(o, h), o.addEventListener("dispose", A));
    }
    if (a.isInstancedMesh === !0 && a.morphTexture !== null)
      c.getUniforms().setValue(i, "morphTexture", a.morphTexture, t);
    else {
      let f = 0;
      for (let M = 0; M < l.length; M++) f += l[M];
      const g = o.morphTargetsRelative ? 1 : 1 - f;
      (c.getUniforms().setValue(i, "morphTargetBaseInfluence", g),
        c.getUniforms().setValue(i, "morphTargetInfluences", l));
    }
    (c.getUniforms().setValue(i, "morphTargetsTexture", h.texture, t),
      c.getUniforms().setValue(i, "morphTargetsTextureSize", h.size));
  }
  return { update: r };
}
function Em(i, e, t, n, s) {
  let r = new WeakMap();
  function a(l) {
    const u = s.render.frame,
      d = l.geometry,
      h = e.get(l, d);
    if (
      (r.get(h) !== u && (e.update(h), r.set(h, u)),
      l.isInstancedMesh &&
        (l.hasEventListener("dispose", c) === !1 && l.addEventListener("dispose", c),
        r.get(l) !== u &&
          (t.update(l.instanceMatrix, i.ARRAY_BUFFER),
          l.instanceColor !== null && t.update(l.instanceColor, i.ARRAY_BUFFER),
          r.set(l, u))),
      l.isSkinnedMesh)
    ) {
      const f = l.skeleton;
      r.get(f) !== u && (f.update(), r.set(f, u));
    }
    return h;
  }
  function o() {
    r = new WeakMap();
  }
  function c(l) {
    const u = l.target;
    (u.removeEventListener("dispose", c),
      n.releaseStatesOfObject(u),
      t.remove(u.instanceMatrix),
      u.instanceColor !== null && t.remove(u.instanceColor));
  }
  return { update: a, dispose: o };
}
const Tm = {
  [Wl]: "LINEAR_TONE_MAPPING",
  [Xl]: "REINHARD_TONE_MAPPING",
  [ql]: "CINEON_TONE_MAPPING",
  [Yl]: "ACES_FILMIC_TONE_MAPPING",
  [Kl]: "AGX_TONE_MAPPING",
  [jl]: "NEUTRAL_TONE_MAPPING",
  [Zl]: "CUSTOM_TONE_MAPPING",
};
function Am(i, e, t, n, s) {
  const r = new cn(e, t, { type: i, depthBuffer: n, stencilBuffer: s, depthTexture: n ? new Ai(e, t) : void 0 }),
    a = new cn(e, t, { type: En, depthBuffer: !1, stencilBuffer: !1 }),
    o = new Lt();
  (o.setAttribute("position", new Mt([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)),
    o.setAttribute("uv", new Mt([0, 2, 0, 0, 2, 0], 2)));
  const c = new Xu({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: `
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,
      fragmentShader: `
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,
      depthTest: !1,
      depthWrite: !1,
    }),
    l = new Xt(o, c),
    u = new oo(-1, 1, 1, -1, 0, 1);
  let d = null,
    h = null,
    f = !1,
    g,
    M = null,
    m = [],
    p = !1;
  ((this.setSize = function (S, E) {
    (r.setSize(S, E), a.setSize(S, E));
    for (let b = 0; b < m.length; b++) {
      const R = m[b];
      R.setSize && R.setSize(S, E);
    }
  }),
    (this.setEffects = function (S) {
      ((m = S), (p = m.length > 0 && m[0].isRenderPass === !0));
      const E = r.width,
        b = r.height;
      for (let R = 0; R < m.length; R++) {
        const T = m[R];
        T.setSize && T.setSize(E, b);
      }
    }),
    (this.begin = function (S, E) {
      if (f || (S.toneMapping === on && m.length === 0)) return !1;
      if (((M = E), E !== null)) {
        const b = E.width,
          R = E.height;
        (r.width !== b || r.height !== R) && this.setSize(b, R);
      }
      return (p === !1 && S.setRenderTarget(r), (g = S.toneMapping), (S.toneMapping = on), !0);
    }),
    (this.hasRenderPass = function () {
      return p;
    }),
    (this.end = function (S, E) {
      ((S.toneMapping = g), (f = !0));
      let b = r,
        R = a;
      for (let T = 0; T < m.length; T++) {
        const P = m[T];
        if (P.enabled !== !1 && (P.render(S, R, b, E), P.needsSwap !== !1)) {
          const x = b;
          ((b = R), (R = x));
        }
      }
      if (d !== S.outputColorSpace || h !== S.toneMapping) {
        ((d = S.outputColorSpace),
          (h = S.toneMapping),
          (c.defines = {}),
          We.getTransfer(d) === Ze && (c.defines.SRGB_TRANSFER = ""));
        const T = Tm[h];
        (T && (c.defines[T] = ""), (c.needsUpdate = !0));
      }
      ((c.uniforms.tDiffuse.value = b.texture), S.setRenderTarget(M), S.render(l, u), (M = null), (f = !1));
    }),
    (this.isCompositing = function () {
      return f;
    }),
    (this.dispose = function () {
      (r.depthTexture && r.depthTexture.dispose(), r.dispose(), a.dispose(), o.dispose(), c.dispose());
    }));
}
const Lc = new Rt(),
  Ha = new Ai(1, 1),
  Dc = new rc(),
  Uc = new eu(),
  Nc = new mc(),
  wl = [],
  Rl = [],
  Cl = new Float32Array(16),
  Pl = new Float32Array(9),
  Il = new Float32Array(4);
function Li(i, e, t) {
  const n = i[0];
  if (n <= 0 || n > 0) return i;
  const s = e * t;
  let r = wl[s];
  if ((r === void 0 && ((r = new Float32Array(s)), (wl[s] = r)), e !== 0)) {
    n.toArray(r, 0);
    for (let a = 1, o = 0; a !== e; ++a) ((o += t), i[a].toArray(r, o));
  }
  return r;
}
function St(i, e) {
  if (i.length !== e.length) return !1;
  for (let t = 0, n = i.length; t < n; t++) if (i[t] !== e[t]) return !1;
  return !0;
}
function yt(i, e) {
  for (let t = 0, n = e.length; t < n; t++) i[t] = e[t];
}
function hr(i, e) {
  let t = Rl[e];
  t === void 0 && ((t = new Int32Array(e)), (Rl[e] = t));
  for (let n = 0; n !== e; ++n) t[n] = i.allocateTextureUnit();
  return t;
}
function wm(i, e) {
  const t = this.cache;
  t[0] !== e && (i.uniform1f(this.addr, e), (t[0] = e));
}
function Rm(i, e) {
  const t = this.cache;
  if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y) && (i.uniform2f(this.addr, e.x, e.y), (t[0] = e.x), (t[1] = e.y));
  else {
    if (St(t, e)) return;
    (i.uniform2fv(this.addr, e), yt(t, e));
  }
}
function Cm(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) &&
      (i.uniform3f(this.addr, e.x, e.y, e.z), (t[0] = e.x), (t[1] = e.y), (t[2] = e.z));
  else if (e.r !== void 0)
    (t[0] !== e.r || t[1] !== e.g || t[2] !== e.b) &&
      (i.uniform3f(this.addr, e.r, e.g, e.b), (t[0] = e.r), (t[1] = e.g), (t[2] = e.b));
  else {
    if (St(t, e)) return;
    (i.uniform3fv(this.addr, e), yt(t, e));
  }
}
function Pm(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) &&
      (i.uniform4f(this.addr, e.x, e.y, e.z, e.w), (t[0] = e.x), (t[1] = e.y), (t[2] = e.z), (t[3] = e.w));
  else {
    if (St(t, e)) return;
    (i.uniform4fv(this.addr, e), yt(t, e));
  }
}
function Im(i, e) {
  const t = this.cache,
    n = e.elements;
  if (n === void 0) {
    if (St(t, e)) return;
    (i.uniformMatrix2fv(this.addr, !1, e), yt(t, e));
  } else {
    if (St(t, n)) return;
    (Il.set(n), i.uniformMatrix2fv(this.addr, !1, Il), yt(t, n));
  }
}
function Lm(i, e) {
  const t = this.cache,
    n = e.elements;
  if (n === void 0) {
    if (St(t, e)) return;
    (i.uniformMatrix3fv(this.addr, !1, e), yt(t, e));
  } else {
    if (St(t, n)) return;
    (Pl.set(n), i.uniformMatrix3fv(this.addr, !1, Pl), yt(t, n));
  }
}
function Dm(i, e) {
  const t = this.cache,
    n = e.elements;
  if (n === void 0) {
    if (St(t, e)) return;
    (i.uniformMatrix4fv(this.addr, !1, e), yt(t, e));
  } else {
    if (St(t, n)) return;
    (Cl.set(n), i.uniformMatrix4fv(this.addr, !1, Cl), yt(t, n));
  }
}
function Um(i, e) {
  const t = this.cache;
  t[0] !== e && (i.uniform1i(this.addr, e), (t[0] = e));
}
function Nm(i, e) {
  const t = this.cache;
  if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y) && (i.uniform2i(this.addr, e.x, e.y), (t[0] = e.x), (t[1] = e.y));
  else {
    if (St(t, e)) return;
    (i.uniform2iv(this.addr, e), yt(t, e));
  }
}
function Fm(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) &&
      (i.uniform3i(this.addr, e.x, e.y, e.z), (t[0] = e.x), (t[1] = e.y), (t[2] = e.z));
  else {
    if (St(t, e)) return;
    (i.uniform3iv(this.addr, e), yt(t, e));
  }
}
function Om(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) &&
      (i.uniform4i(this.addr, e.x, e.y, e.z, e.w), (t[0] = e.x), (t[1] = e.y), (t[2] = e.z), (t[3] = e.w));
  else {
    if (St(t, e)) return;
    (i.uniform4iv(this.addr, e), yt(t, e));
  }
}
function Bm(i, e) {
  const t = this.cache;
  t[0] !== e && (i.uniform1ui(this.addr, e), (t[0] = e));
}
function zm(i, e) {
  const t = this.cache;
  if (e.x !== void 0) (t[0] !== e.x || t[1] !== e.y) && (i.uniform2ui(this.addr, e.x, e.y), (t[0] = e.x), (t[1] = e.y));
  else {
    if (St(t, e)) return;
    (i.uniform2uiv(this.addr, e), yt(t, e));
  }
}
function Vm(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) &&
      (i.uniform3ui(this.addr, e.x, e.y, e.z), (t[0] = e.x), (t[1] = e.y), (t[2] = e.z));
  else {
    if (St(t, e)) return;
    (i.uniform3uiv(this.addr, e), yt(t, e));
  }
}
function km(i, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) &&
      (i.uniform4ui(this.addr, e.x, e.y, e.z, e.w), (t[0] = e.x), (t[1] = e.y), (t[2] = e.z), (t[3] = e.w));
  else {
    if (St(t, e)) return;
    (i.uniform4uiv(this.addr, e), yt(t, e));
  }
}
function Gm(i, e, t) {
  const n = this.cache,
    s = t.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s));
  let r;
  (this.type === i.SAMPLER_2D_SHADOW
    ? ((Ha.compareFunction = t.isReversedDepthBuffer() ? to : eo), (r = Ha))
    : (r = Lc),
    t.setTexture2D(e || r, s));
}
function Hm(i, e, t) {
  const n = this.cache,
    s = t.allocateTextureUnit();
  (n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s)), t.setTexture3D(e || Uc, s));
}
function Wm(i, e, t) {
  const n = this.cache,
    s = t.allocateTextureUnit();
  (n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s)), t.setTextureCube(e || Nc, s));
}
function Xm(i, e, t) {
  const n = this.cache,
    s = t.allocateTextureUnit();
  (n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s)), t.setTexture2DArray(e || Dc, s));
}
function qm(i) {
  switch (i) {
    case 5126:
      return wm;
    case 35664:
      return Rm;
    case 35665:
      return Cm;
    case 35666:
      return Pm;
    case 35674:
      return Im;
    case 35675:
      return Lm;
    case 35676:
      return Dm;
    case 5124:
    case 35670:
      return Um;
    case 35667:
    case 35671:
      return Nm;
    case 35668:
    case 35672:
      return Fm;
    case 35669:
    case 35673:
      return Om;
    case 5125:
      return Bm;
    case 36294:
      return zm;
    case 36295:
      return Vm;
    case 36296:
      return km;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return Gm;
    case 35679:
    case 36299:
    case 36307:
      return Hm;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return Wm;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return Xm;
  }
}
function Ym(i, e) {
  i.uniform1fv(this.addr, e);
}
function Zm(i, e) {
  const t = Li(e, this.size, 2);
  i.uniform2fv(this.addr, t);
}
function Km(i, e) {
  const t = Li(e, this.size, 3);
  i.uniform3fv(this.addr, t);
}
function jm(i, e) {
  const t = Li(e, this.size, 4);
  i.uniform4fv(this.addr, t);
}
function $m(i, e) {
  const t = Li(e, this.size, 4);
  i.uniformMatrix2fv(this.addr, !1, t);
}
function Jm(i, e) {
  const t = Li(e, this.size, 9);
  i.uniformMatrix3fv(this.addr, !1, t);
}
function Qm(i, e) {
  const t = Li(e, this.size, 16);
  i.uniformMatrix4fv(this.addr, !1, t);
}
function eg(i, e) {
  i.uniform1iv(this.addr, e);
}
function tg(i, e) {
  i.uniform2iv(this.addr, e);
}
function ng(i, e) {
  i.uniform3iv(this.addr, e);
}
function ig(i, e) {
  i.uniform4iv(this.addr, e);
}
function sg(i, e) {
  i.uniform1uiv(this.addr, e);
}
function rg(i, e) {
  i.uniform2uiv(this.addr, e);
}
function ag(i, e) {
  i.uniform3uiv(this.addr, e);
}
function og(i, e) {
  i.uniform4uiv(this.addr, e);
}
function lg(i, e, t) {
  const n = this.cache,
    s = e.length,
    r = hr(t, s);
  St(n, r) || (i.uniform1iv(this.addr, r), yt(n, r));
  let a;
  this.type === i.SAMPLER_2D_SHADOW ? (a = Ha) : (a = Lc);
  for (let o = 0; o !== s; ++o) t.setTexture2D(e[o] || a, r[o]);
}
function cg(i, e, t) {
  const n = this.cache,
    s = e.length,
    r = hr(t, s);
  St(n, r) || (i.uniform1iv(this.addr, r), yt(n, r));
  for (let a = 0; a !== s; ++a) t.setTexture3D(e[a] || Uc, r[a]);
}
function hg(i, e, t) {
  const n = this.cache,
    s = e.length,
    r = hr(t, s);
  St(n, r) || (i.uniform1iv(this.addr, r), yt(n, r));
  for (let a = 0; a !== s; ++a) t.setTextureCube(e[a] || Nc, r[a]);
}
function ug(i, e, t) {
  const n = this.cache,
    s = e.length,
    r = hr(t, s);
  St(n, r) || (i.uniform1iv(this.addr, r), yt(n, r));
  for (let a = 0; a !== s; ++a) t.setTexture2DArray(e[a] || Dc, r[a]);
}
function dg(i) {
  switch (i) {
    case 5126:
      return Ym;
    case 35664:
      return Zm;
    case 35665:
      return Km;
    case 35666:
      return jm;
    case 35674:
      return $m;
    case 35675:
      return Jm;
    case 35676:
      return Qm;
    case 5124:
    case 35670:
      return eg;
    case 35667:
    case 35671:
      return tg;
    case 35668:
    case 35672:
      return ng;
    case 35669:
    case 35673:
      return ig;
    case 5125:
      return sg;
    case 36294:
      return rg;
    case 36295:
      return ag;
    case 36296:
      return og;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return lg;
    case 35679:
    case 36299:
    case 36307:
      return cg;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return hg;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return ug;
  }
}
class fg {
  constructor(e, t, n) {
    ((this.id = e), (this.addr = n), (this.cache = []), (this.type = t.type), (this.setValue = qm(t.type)));
  }
}
class pg {
  constructor(e, t, n) {
    ((this.id = e),
      (this.addr = n),
      (this.cache = []),
      (this.type = t.type),
      (this.size = t.size),
      (this.setValue = dg(t.type)));
  }
}
class mg {
  constructor(e) {
    ((this.id = e), (this.seq = []), (this.map = {}));
  }
  setValue(e, t, n) {
    const s = this.seq;
    for (let r = 0, a = s.length; r !== a; ++r) {
      const o = s[r];
      o.setValue(e, t[o.id], n);
    }
  }
}
const Zr = /(\w+)(\])?(\[|\.)?/g;
function Ll(i, e) {
  (i.seq.push(e), (i.map[e.id] = e));
}
function gg(i, e, t) {
  const n = i.name,
    s = n.length;
  for (Zr.lastIndex = 0; ;) {
    const r = Zr.exec(n),
      a = Zr.lastIndex;
    let o = r[1];
    const c = r[2] === "]",
      l = r[3];
    if ((c && (o = o | 0), l === void 0 || (l === "[" && a + 2 === s))) {
      Ll(t, l === void 0 ? new fg(o, i, e) : new pg(o, i, e));
      break;
    } else {
      let d = t.map[o];
      (d === void 0 && ((d = new mg(o)), Ll(t, d)), (t = d));
    }
  }
}
class Ws {
  constructor(e, t) {
    ((this.seq = []), (this.map = {}));
    const n = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
    for (let a = 0; a < n; ++a) {
      const o = e.getActiveUniform(t, a),
        c = e.getUniformLocation(t, o.name);
      gg(o, c, this);
    }
    const s = [],
      r = [];
    for (const a of this.seq)
      a.type === e.SAMPLER_2D_SHADOW || a.type === e.SAMPLER_CUBE_SHADOW || a.type === e.SAMPLER_2D_ARRAY_SHADOW
        ? s.push(a)
        : r.push(a);
    s.length > 0 && (this.seq = s.concat(r));
  }
  setValue(e, t, n, s) {
    const r = this.map[t];
    r !== void 0 && r.setValue(e, n, s);
  }
  setOptional(e, t, n) {
    const s = t[n];
    s !== void 0 && this.setValue(e, n, s);
  }
  static upload(e, t, n, s) {
    for (let r = 0, a = t.length; r !== a; ++r) {
      const o = t[r],
        c = n[o.id];
      c.needsUpdate !== !1 && o.setValue(e, c.value, s);
    }
  }
  static seqWithValue(e, t) {
    const n = [];
    for (let s = 0, r = e.length; s !== r; ++s) {
      const a = e[s];
      a.id in t && n.push(a);
    }
    return n;
  }
}
function Dl(i, e, t) {
  const n = i.createShader(e);
  return (i.shaderSource(n, t), i.compileShader(n), n);
}
const _g = 37297;
let xg = 0;
function vg(i, e) {
  const t = i.split(`
`),
    n = [],
    s = Math.max(e - 6, 0),
    r = Math.min(e + 6, t.length);
  for (let a = s; a < r; a++) {
    const o = a + 1;
    n.push(`${o === e ? ">" : " "} ${o}: ${t[a]}`);
  }
  return n.join(`
`);
}
const Ul = new Ie();
function Mg(i) {
  We._getMatrix(Ul, We.workingColorSpace, i);
  const e = `mat3( ${Ul.elements.map((t) => t.toFixed(4))} )`;
  switch (We.getTransfer(i)) {
    case js:
      return [e, "LinearTransferOETF"];
    case Ze:
      return [e, "sRGBTransferOETF"];
    default:
      return (xe("WebGLProgram: Unsupported color space: ", i), [e, "LinearTransferOETF"]);
  }
}
function Nl(i, e, t) {
  const n = i.getShaderParameter(e, i.COMPILE_STATUS),
    r = (i.getShaderInfoLog(e) || "").trim();
  if (n && r === "") return "";
  const a = /ERROR: 0:(\d+)/.exec(r);
  if (a) {
    const o = parseInt(a[1]);
    return (
      t.toUpperCase() +
      `

` +
      r +
      `

` +
      vg(i.getShaderSource(e), o)
    );
  } else return r;
}
function Sg(i, e) {
  const t = Mg(e);
  return [`vec4 ${i}( vec4 value ) {`, `	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`, "}"].join(`
`);
}
const yg = {
  [Wl]: "Linear",
  [Xl]: "Reinhard",
  [ql]: "Cineon",
  [Yl]: "ACESFilmic",
  [Kl]: "AgX",
  [jl]: "Neutral",
  [Zl]: "Custom",
};
function bg(i, e) {
  const t = yg[e];
  return t === void 0
    ? (xe("WebGLProgram: Unsupported toneMapping:", e),
      "vec3 " + i + "( vec3 color ) { return LinearToneMapping( color ); }")
    : "vec3 " + i + "( vec3 color ) { return " + t + "ToneMapping( color ); }";
}
const Bs = new F();
function Eg() {
  We.getLuminanceCoefficients(Bs);
  const i = Bs.x.toFixed(4),
    e = Bs.y.toFixed(4),
    t = Bs.z.toFixed(4);
  return [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,
    "	return dot( weights, rgb );",
    "}",
  ].join(`
`);
}
function Tg(i) {
  return [
    i.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "",
    i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : "",
  ].filter(Xi).join(`
`);
}
function Ag(i) {
  const e = [];
  for (const t in i) {
    const n = i[t];
    n !== !1 && e.push("#define " + t + " " + n);
  }
  return e.join(`
`);
}
function wg(i, e) {
  const t = {},
    n = i.getProgramParameter(e, i.ACTIVE_ATTRIBUTES);
  for (let s = 0; s < n; s++) {
    const r = i.getActiveAttrib(e, s),
      a = r.name;
    let o = 1;
    (r.type === i.FLOAT_MAT2 && (o = 2),
      r.type === i.FLOAT_MAT3 && (o = 3),
      r.type === i.FLOAT_MAT4 && (o = 4),
      (t[a] = { type: r.type, location: i.getAttribLocation(e, a), locationSize: o }));
  }
  return t;
}
function Xi(i) {
  return i !== "";
}
function Fl(i, e) {
  const t = e.numSpotLightShadows + e.numSpotLightMaps - e.numSpotLightShadowsWithMaps;
  return i
    .replace(/NUM_DIR_LIGHTS/g, e.numDirLights)
    .replace(/NUM_SPOT_LIGHTS/g, e.numSpotLights)
    .replace(/NUM_SPOT_LIGHT_MAPS/g, e.numSpotLightMaps)
    .replace(/NUM_SPOT_LIGHT_COORDS/g, t)
    .replace(/NUM_RECT_AREA_LIGHTS/g, e.numRectAreaLights)
    .replace(/NUM_POINT_LIGHTS/g, e.numPointLights)
    .replace(/NUM_HEMI_LIGHTS/g, e.numHemiLights)
    .replace(/NUM_DIR_LIGHT_SHADOWS/g, e.numDirLightShadows)
    .replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, e.numSpotLightShadowsWithMaps)
    .replace(/NUM_SPOT_LIGHT_SHADOWS/g, e.numSpotLightShadows)
    .replace(/NUM_POINT_LIGHT_SHADOWS/g, e.numPointLightShadows);
}
function Ol(i, e) {
  return i
    .replace(/NUM_CLIPPING_PLANES/g, e.numClippingPlanes)
    .replace(/UNION_CLIPPING_PLANES/g, e.numClippingPlanes - e.numClipIntersection);
}
const Rg = /^[ \t]*#include +<([\w\d./]+)>/gm;
function Wa(i) {
  return i.replace(Rg, Pg);
}
const Cg = new Map();
function Pg(i, e) {
  let t = Oe[e];
  if (t === void 0) {
    const n = Cg.get(e);
    if (n !== void 0)
      ((t = Oe[n]), xe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', e, n));
    else throw new Error("Can not resolve #include <" + e + ">");
  }
  return Wa(t);
}
const Ig =
  /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function Bl(i) {
  return i.replace(Ig, Lg);
}
function Lg(i, e, t, n) {
  let s = "";
  for (let r = parseInt(e); r < parseInt(t); r++)
    s += n.replace(/\[\s*i\s*\]/g, "[ " + r + " ]").replace(/UNROLLED_LOOP_INDEX/g, r);
  return s;
}
function zl(i) {
  let e = `precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;
  return (
    i.precision === "highp"
      ? (e += `
#define HIGH_PRECISION`)
      : i.precision === "mediump"
        ? (e += `
#define MEDIUM_PRECISION`)
        : i.precision === "lowp" &&
          (e += `
#define LOW_PRECISION`),
    e
  );
}
const Dg = { [zs]: "SHADOWMAP_TYPE_PCF", [Hi]: "SHADOWMAP_TYPE_VSM" };
function Ug(i) {
  return Dg[i.shadowMapType] || "SHADOWMAP_TYPE_BASIC";
}
const Ng = { [Jn]: "ENVMAP_TYPE_CUBE", [Ei]: "ENVMAP_TYPE_CUBE", [sr]: "ENVMAP_TYPE_CUBE_UV" };
function Fg(i) {
  return i.envMap === !1 ? "ENVMAP_TYPE_CUBE" : Ng[i.envMapMode] || "ENVMAP_TYPE_CUBE";
}
const Og = { [Ei]: "ENVMAP_MODE_REFRACTION" };
function Bg(i) {
  return i.envMap === !1 ? "ENVMAP_MODE_REFLECTION" : Og[i.envMapMode] || "ENVMAP_MODE_REFLECTION";
}
const zg = { [ir]: "ENVMAP_BLENDING_MULTIPLY", [dh]: "ENVMAP_BLENDING_MIX", [fh]: "ENVMAP_BLENDING_ADD" };
function Vg(i) {
  return i.envMap === !1 ? "ENVMAP_BLENDING_NONE" : zg[i.combine] || "ENVMAP_BLENDING_NONE";
}
function kg(i) {
  const e = i.envMapCubeUVHeight;
  if (e === null) return null;
  const t = Math.log2(e) - 2,
    n = 1 / e;
  return { texelWidth: 1 / (3 * Math.max(Math.pow(2, t), 7 * 16)), texelHeight: n, maxMip: t };
}
function Gg(i, e, t, n) {
  const s = i.getContext(),
    r = t.defines;
  let a = t.vertexShader,
    o = t.fragmentShader;
  const c = Ug(t),
    l = Fg(t),
    u = Bg(t),
    d = Vg(t),
    h = kg(t),
    f = Tg(t),
    g = Ag(r),
    M = s.createProgram();
  let m,
    p,
    S = t.glslVersion
      ? "#version " +
        t.glslVersion +
        `
`
      : "";
  (t.isRawShaderMaterial
    ? ((m = ["#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, g].filter(Xi).join(`
`)),
      m.length > 0 &&
        (m += `
`),
      (p = ["#define SHADER_TYPE " + t.shaderType, "#define SHADER_NAME " + t.shaderName, g].filter(Xi).join(`
`)),
      p.length > 0 &&
        (p += `
`))
    : ((m = [
        zl(t),
        "#define SHADER_TYPE " + t.shaderType,
        "#define SHADER_NAME " + t.shaderName,
        g,
        t.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
        t.batching ? "#define USE_BATCHING" : "",
        t.batchingColor ? "#define USE_BATCHING_COLOR" : "",
        t.instancing ? "#define USE_INSTANCING" : "",
        t.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
        t.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
        t.useFog && t.fog ? "#define USE_FOG" : "",
        t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
        t.map ? "#define USE_MAP" : "",
        t.envMap ? "#define USE_ENVMAP" : "",
        t.envMap ? "#define " + u : "",
        t.lightMap ? "#define USE_LIGHTMAP" : "",
        t.aoMap ? "#define USE_AOMAP" : "",
        t.bumpMap ? "#define USE_BUMPMAP" : "",
        t.normalMap ? "#define USE_NORMALMAP" : "",
        t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
        t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
        t.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
        t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
        t.anisotropy ? "#define USE_ANISOTROPY" : "",
        t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
        t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
        t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
        t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
        t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
        t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
        t.specularMap ? "#define USE_SPECULARMAP" : "",
        t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
        t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
        t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
        t.metalnessMap ? "#define USE_METALNESSMAP" : "",
        t.alphaMap ? "#define USE_ALPHAMAP" : "",
        t.alphaHash ? "#define USE_ALPHAHASH" : "",
        t.transmission ? "#define USE_TRANSMISSION" : "",
        t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
        t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
        t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
        t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
        t.mapUv ? "#define MAP_UV " + t.mapUv : "",
        t.alphaMapUv ? "#define ALPHAMAP_UV " + t.alphaMapUv : "",
        t.lightMapUv ? "#define LIGHTMAP_UV " + t.lightMapUv : "",
        t.aoMapUv ? "#define AOMAP_UV " + t.aoMapUv : "",
        t.emissiveMapUv ? "#define EMISSIVEMAP_UV " + t.emissiveMapUv : "",
        t.bumpMapUv ? "#define BUMPMAP_UV " + t.bumpMapUv : "",
        t.normalMapUv ? "#define NORMALMAP_UV " + t.normalMapUv : "",
        t.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + t.displacementMapUv : "",
        t.metalnessMapUv ? "#define METALNESSMAP_UV " + t.metalnessMapUv : "",
        t.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + t.roughnessMapUv : "",
        t.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + t.anisotropyMapUv : "",
        t.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + t.clearcoatMapUv : "",
        t.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + t.clearcoatNormalMapUv : "",
        t.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + t.clearcoatRoughnessMapUv : "",
        t.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + t.iridescenceMapUv : "",
        t.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + t.iridescenceThicknessMapUv : "",
        t.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + t.sheenColorMapUv : "",
        t.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + t.sheenRoughnessMapUv : "",
        t.specularMapUv ? "#define SPECULARMAP_UV " + t.specularMapUv : "",
        t.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + t.specularColorMapUv : "",
        t.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + t.specularIntensityMapUv : "",
        t.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + t.transmissionMapUv : "",
        t.thicknessMapUv ? "#define THICKNESSMAP_UV " + t.thicknessMapUv : "",
        t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "",
        t.vertexNormals ? "#define HAS_NORMAL" : "",
        t.vertexColors ? "#define USE_COLOR" : "",
        t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
        t.vertexUv1s ? "#define USE_UV1" : "",
        t.vertexUv2s ? "#define USE_UV2" : "",
        t.vertexUv3s ? "#define USE_UV3" : "",
        t.pointsUvs ? "#define USE_POINTS_UV" : "",
        t.flatShading ? "#define FLAT_SHADED" : "",
        t.skinning ? "#define USE_SKINNING" : "",
        t.morphTargets ? "#define USE_MORPHTARGETS" : "",
        t.morphNormals && t.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
        t.morphColors ? "#define USE_MORPHCOLORS" : "",
        t.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + t.morphTextureStride : "",
        t.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + t.morphTargetsCount : "",
        t.doubleSided ? "#define DOUBLE_SIDED" : "",
        t.flipSided ? "#define FLIP_SIDED" : "",
        t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
        t.shadowMapEnabled ? "#define " + c : "",
        t.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
        t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
        t.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
        t.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
        "uniform mat4 modelMatrix;",
        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",
        "uniform mat4 viewMatrix;",
        "uniform mat3 normalMatrix;",
        "uniform vec3 cameraPosition;",
        "uniform bool isOrthographic;",
        "#ifdef USE_INSTANCING",
        "	attribute mat4 instanceMatrix;",
        "#endif",
        "#ifdef USE_INSTANCING_COLOR",
        "	attribute vec3 instanceColor;",
        "#endif",
        "#ifdef USE_INSTANCING_MORPH",
        "	uniform sampler2D morphTexture;",
        "#endif",
        "attribute vec3 position;",
        "attribute vec3 normal;",
        "attribute vec2 uv;",
        "#ifdef USE_UV1",
        "	attribute vec2 uv1;",
        "#endif",
        "#ifdef USE_UV2",
        "	attribute vec2 uv2;",
        "#endif",
        "#ifdef USE_UV3",
        "	attribute vec2 uv3;",
        "#endif",
        "#ifdef USE_TANGENT",
        "	attribute vec4 tangent;",
        "#endif",
        "#if defined( USE_COLOR_ALPHA )",
        "	attribute vec4 color;",
        "#elif defined( USE_COLOR )",
        "	attribute vec3 color;",
        "#endif",
        "#ifdef USE_SKINNING",
        "	attribute vec4 skinIndex;",
        "	attribute vec4 skinWeight;",
        "#endif",
        `
`,
      ].filter(Xi).join(`
`)),
      (p = [
        zl(t),
        "#define SHADER_TYPE " + t.shaderType,
        "#define SHADER_NAME " + t.shaderName,
        g,
        t.useFog && t.fog ? "#define USE_FOG" : "",
        t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
        t.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
        t.map ? "#define USE_MAP" : "",
        t.matcap ? "#define USE_MATCAP" : "",
        t.envMap ? "#define USE_ENVMAP" : "",
        t.envMap ? "#define " + l : "",
        t.envMap ? "#define " + u : "",
        t.envMap ? "#define " + d : "",
        h ? "#define CUBEUV_TEXEL_WIDTH " + h.texelWidth : "",
        h ? "#define CUBEUV_TEXEL_HEIGHT " + h.texelHeight : "",
        h ? "#define CUBEUV_MAX_MIP " + h.maxMip + ".0" : "",
        t.lightMap ? "#define USE_LIGHTMAP" : "",
        t.aoMap ? "#define USE_AOMAP" : "",
        t.bumpMap ? "#define USE_BUMPMAP" : "",
        t.normalMap ? "#define USE_NORMALMAP" : "",
        t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
        t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
        t.packedNormalMap ? "#define USE_PACKED_NORMALMAP" : "",
        t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
        t.anisotropy ? "#define USE_ANISOTROPY" : "",
        t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
        t.clearcoat ? "#define USE_CLEARCOAT" : "",
        t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
        t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
        t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
        t.dispersion ? "#define USE_DISPERSION" : "",
        t.iridescence ? "#define USE_IRIDESCENCE" : "",
        t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
        t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
        t.specularMap ? "#define USE_SPECULARMAP" : "",
        t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
        t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
        t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
        t.metalnessMap ? "#define USE_METALNESSMAP" : "",
        t.alphaMap ? "#define USE_ALPHAMAP" : "",
        t.alphaTest ? "#define USE_ALPHATEST" : "",
        t.alphaHash ? "#define USE_ALPHAHASH" : "",
        t.sheen ? "#define USE_SHEEN" : "",
        t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
        t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
        t.transmission ? "#define USE_TRANSMISSION" : "",
        t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
        t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
        t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "",
        t.vertexColors || t.instancingColor ? "#define USE_COLOR" : "",
        t.vertexAlphas || t.batchingColor ? "#define USE_COLOR_ALPHA" : "",
        t.vertexUv1s ? "#define USE_UV1" : "",
        t.vertexUv2s ? "#define USE_UV2" : "",
        t.vertexUv3s ? "#define USE_UV3" : "",
        t.pointsUvs ? "#define USE_POINTS_UV" : "",
        t.gradientMap ? "#define USE_GRADIENTMAP" : "",
        t.flatShading ? "#define FLAT_SHADED" : "",
        t.doubleSided ? "#define DOUBLE_SIDED" : "",
        t.flipSided ? "#define FLIP_SIDED" : "",
        t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
        t.shadowMapEnabled ? "#define " + c : "",
        t.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
        t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
        t.numLightProbeGrids > 0 ? "#define USE_LIGHT_PROBES_GRID" : "",
        t.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
        t.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "",
        t.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
        t.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
        "uniform mat4 viewMatrix;",
        "uniform vec3 cameraPosition;",
        "uniform bool isOrthographic;",
        t.toneMapping !== on ? "#define TONE_MAPPING" : "",
        t.toneMapping !== on ? Oe.tonemapping_pars_fragment : "",
        t.toneMapping !== on ? bg("toneMapping", t.toneMapping) : "",
        t.dithering ? "#define DITHERING" : "",
        t.opaque ? "#define OPAQUE" : "",
        Oe.colorspace_pars_fragment,
        Sg("linearToOutputTexel", t.outputColorSpace),
        Eg(),
        t.useDepthPacking ? "#define DEPTH_PACKING " + t.depthPacking : "",
        `
`,
      ].filter(Xi).join(`
`))),
    (a = Wa(a)),
    (a = Fl(a, t)),
    (a = Ol(a, t)),
    (o = Wa(o)),
    (o = Fl(o, t)),
    (o = Ol(o, t)),
    (a = Bl(a)),
    (o = Bl(o)),
    t.isRawShaderMaterial !== !0 &&
      ((S = `#version 300 es
`),
      (m =
        [f, "#define attribute in", "#define varying out", "#define texture2D texture"].join(`
`) +
        `
` +
        m),
      (p =
        [
          "#define varying in",
          t.glslVersion === Io ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
          t.glslVersion === Io ? "" : "#define gl_FragColor pc_fragColor",
          "#define gl_FragDepthEXT gl_FragDepth",
          "#define texture2D texture",
          "#define textureCube texture",
          "#define texture2DProj textureProj",
          "#define texture2DLodEXT textureLod",
          "#define texture2DProjLodEXT textureProjLod",
          "#define textureCubeLodEXT textureLod",
          "#define texture2DGradEXT textureGrad",
          "#define texture2DProjGradEXT textureProjGrad",
          "#define textureCubeGradEXT textureGrad",
        ].join(`
`) +
        `
` +
        p)));
  const E = S + m + a,
    b = S + p + o,
    R = Dl(s, s.VERTEX_SHADER, E),
    T = Dl(s, s.FRAGMENT_SHADER, b);
  (s.attachShader(M, R),
    s.attachShader(M, T),
    t.index0AttributeName !== void 0
      ? s.bindAttribLocation(M, 0, t.index0AttributeName)
      : t.morphTargets === !0 && s.bindAttribLocation(M, 0, "position"),
    s.linkProgram(M));
  function P(w) {
    if (i.debug.checkShaderErrors) {
      const N = s.getProgramInfoLog(M) || "",
        H = s.getShaderInfoLog(R) || "",
        W = s.getShaderInfoLog(T) || "",
        U = N.trim(),
        V = H.trim(),
        G = W.trim();
      let J = !0,
        Q = !0;
      if (s.getProgramParameter(M, s.LINK_STATUS) === !1)
        if (((J = !1), typeof i.debug.onShaderError == "function")) i.debug.onShaderError(s, M, R, T);
        else {
          const ce = Nl(s, R, "vertex"),
            ve = Nl(s, T, "fragment");
          Te(
            "THREE.WebGLProgram: Shader Error " +
              s.getError() +
              " - VALIDATE_STATUS " +
              s.getProgramParameter(M, s.VALIDATE_STATUS) +
              `

Material Name: ` +
              w.name +
              `
Material Type: ` +
              w.type +
              `

Program Info Log: ` +
              U +
              `
` +
              ce +
              `
` +
              ve,
          );
        }
      else U !== "" ? xe("WebGLProgram: Program Info Log:", U) : (V === "" || G === "") && (Q = !1);
      Q &&
        (w.diagnostics = {
          runnable: J,
          programLog: U,
          vertexShader: { log: V, prefix: m },
          fragmentShader: { log: G, prefix: p },
        });
    }
    (s.deleteShader(R), s.deleteShader(T), (x = new Ws(s, M)), (A = wg(s, M)));
  }
  let x;
  this.getUniforms = function () {
    return (x === void 0 && P(this), x);
  };
  let A;
  this.getAttributes = function () {
    return (A === void 0 && P(this), A);
  };
  let L = t.rendererExtensionParallelShaderCompile === !1;
  return (
    (this.isReady = function () {
      return (L === !1 && (L = s.getProgramParameter(M, _g)), L);
    }),
    (this.destroy = function () {
      (n.releaseStatesOfProgram(this), s.deleteProgram(M), (this.program = void 0));
    }),
    (this.type = t.shaderType),
    (this.name = t.shaderName),
    (this.id = xg++),
    (this.cacheKey = e),
    (this.usedTimes = 1),
    (this.program = M),
    (this.vertexShader = R),
    (this.fragmentShader = T),
    this
  );
}
let Hg = 0;
class Wg {
  constructor() {
    ((this.shaderCache = new Map()), (this.materialCache = new Map()));
  }
  update(e) {
    const t = e.vertexShader,
      n = e.fragmentShader,
      s = this._getShaderStage(t),
      r = this._getShaderStage(n),
      a = this._getShaderCacheForMaterial(e);
    return (a.has(s) === !1 && (a.add(s), s.usedTimes++), a.has(r) === !1 && (a.add(r), r.usedTimes++), this);
  }
  remove(e) {
    const t = this.materialCache.get(e);
    for (const n of t) (n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code));
    return (this.materialCache.delete(e), this);
  }
  getVertexShaderID(e) {
    return this._getShaderStage(e.vertexShader).id;
  }
  getFragmentShaderID(e) {
    return this._getShaderStage(e.fragmentShader).id;
  }
  dispose() {
    (this.shaderCache.clear(), this.materialCache.clear());
  }
  _getShaderCacheForMaterial(e) {
    const t = this.materialCache;
    let n = t.get(e);
    return (n === void 0 && ((n = new Set()), t.set(e, n)), n);
  }
  _getShaderStage(e) {
    const t = this.shaderCache;
    let n = t.get(e);
    return (n === void 0 && ((n = new Xg(e)), t.set(e, n)), n);
  }
}
class Xg {
  constructor(e) {
    ((this.id = Hg++), (this.code = e), (this.usedTimes = 0));
  }
}
function qg(i) {
  return i === Qn || i === Xs || i === qs;
}
function Yg(i, e, t, n, s, r) {
  const a = new ac(),
    o = new Wg(),
    c = new Set(),
    l = [],
    u = new Map(),
    d = n.logarithmicDepthBuffer;
  let h = n.precision;
  const f = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distance",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite",
  };
  function g(x) {
    return (c.add(x), x === 0 ? "uv" : `uv${x}`);
  }
  function M(x, A, L, w, N, H) {
    const W = w.fog,
      U = N.geometry,
      V = x.isMeshStandardMaterial || x.isMeshLambertMaterial || x.isMeshPhongMaterial ? w.environment : null,
      G = x.isMeshStandardMaterial || (x.isMeshLambertMaterial && !x.envMap) || (x.isMeshPhongMaterial && !x.envMap),
      J = e.get(x.envMap || V, G),
      Q = J && J.mapping === sr ? J.image.height : null,
      ce = f[x.type];
    x.precision !== null &&
      ((h = n.getMaxPrecision(x.precision)),
      h !== x.precision && xe("WebGLProgram.getParameters:", x.precision, "not supported, using", h, "instead."));
    const ve = U.morphAttributes.position || U.morphAttributes.normal || U.morphAttributes.color,
      be = ve !== void 0 ? ve.length : 0;
    let Xe = 0;
    (U.morphAttributes.position !== void 0 && (Xe = 1),
      U.morphAttributes.normal !== void 0 && (Xe = 2),
      U.morphAttributes.color !== void 0 && (Xe = 3));
    let $e, Ue, K, de;
    if (ce) {
      const Le = rn[ce];
      (($e = Le.vertexShader), (Ue = Le.fragmentShader));
    } else
      (($e = x.vertexShader),
        (Ue = x.fragmentShader),
        o.update(x),
        (K = o.getVertexShaderID(x)),
        (de = o.getFragmentShaderID(x)));
    const ie = i.getRenderTarget(),
      Ae = i.state.buffers.depth.getReversed(),
      Pe = N.isInstancedMesh === !0,
      we = N.isBatchedMesh === !0,
      ot = !!x.map,
      Ve = !!x.matcap,
      Je = !!J,
      at = !!x.aoMap,
      ze = !!x.lightMap,
      _t = !!x.bumpMap,
      lt = !!x.normalMap,
      Dt = !!x.displacementMap,
      I = !!x.emissiveMap,
      xt = !!x.metalnessMap,
      ke = !!x.roughnessMap,
      st = x.anisotropy > 0,
      oe = x.clearcoat > 0,
      ht = x.dispersion > 0,
      y = x.iridescence > 0,
      _ = x.sheen > 0,
      O = x.transmission > 0,
      Y = st && !!x.anisotropyMap,
      $ = oe && !!x.clearcoatMap,
      ee = oe && !!x.clearcoatNormalMap,
      ae = oe && !!x.clearcoatRoughnessMap,
      X = y && !!x.iridescenceMap,
      Z = y && !!x.iridescenceThicknessMap,
      fe = _ && !!x.sheenColorMap,
      ge = _ && !!x.sheenRoughnessMap,
      se = !!x.specularMap,
      te = !!x.specularColorMap,
      Re = !!x.specularIntensityMap,
      Ne = O && !!x.transmissionMap,
      Ye = O && !!x.thicknessMap,
      C = !!x.gradientMap,
      ne = !!x.alphaMap,
      q = x.alphaTest > 0,
      pe = !!x.alphaHash,
      re = !!x.extensions;
    let j = on;
    x.toneMapped && (ie === null || ie.isXRRenderTarget === !0) && (j = i.toneMapping);
    const Se = {
      shaderID: ce,
      shaderType: x.type,
      shaderName: x.name,
      vertexShader: $e,
      fragmentShader: Ue,
      defines: x.defines,
      customVertexShaderID: K,
      customFragmentShaderID: de,
      isRawShaderMaterial: x.isRawShaderMaterial === !0,
      glslVersion: x.glslVersion,
      precision: h,
      batching: we,
      batchingColor: we && N._colorsTexture !== null,
      instancing: Pe,
      instancingColor: Pe && N.instanceColor !== null,
      instancingMorph: Pe && N.morphTexture !== null,
      outputColorSpace:
        ie === null ? i.outputColorSpace : ie.isXRRenderTarget === !0 ? ie.texture.colorSpace : We.workingColorSpace,
      alphaToCoverage: !!x.alphaToCoverage,
      map: ot,
      matcap: Ve,
      envMap: Je,
      envMapMode: Je && J.mapping,
      envMapCubeUVHeight: Q,
      aoMap: at,
      lightMap: ze,
      bumpMap: _t,
      normalMap: lt,
      displacementMap: Dt,
      emissiveMap: I,
      normalMapObjectSpace: lt && x.normalMapType === Sh,
      normalMapTangentSpace: lt && x.normalMapType === ji,
      packedNormalMap: lt && x.normalMapType === ji && qg(x.normalMap.format),
      metalnessMap: xt,
      roughnessMap: ke,
      anisotropy: st,
      anisotropyMap: Y,
      clearcoat: oe,
      clearcoatMap: $,
      clearcoatNormalMap: ee,
      clearcoatRoughnessMap: ae,
      dispersion: ht,
      iridescence: y,
      iridescenceMap: X,
      iridescenceThicknessMap: Z,
      sheen: _,
      sheenColorMap: fe,
      sheenRoughnessMap: ge,
      specularMap: se,
      specularColorMap: te,
      specularIntensityMap: Re,
      transmission: O,
      transmissionMap: Ne,
      thicknessMap: Ye,
      gradientMap: C,
      opaque: x.transparent === !1 && x.blending === Si && x.alphaToCoverage === !1,
      alphaMap: ne,
      alphaTest: q,
      alphaHash: pe,
      combine: x.combine,
      mapUv: ot && g(x.map.channel),
      aoMapUv: at && g(x.aoMap.channel),
      lightMapUv: ze && g(x.lightMap.channel),
      bumpMapUv: _t && g(x.bumpMap.channel),
      normalMapUv: lt && g(x.normalMap.channel),
      displacementMapUv: Dt && g(x.displacementMap.channel),
      emissiveMapUv: I && g(x.emissiveMap.channel),
      metalnessMapUv: xt && g(x.metalnessMap.channel),
      roughnessMapUv: ke && g(x.roughnessMap.channel),
      anisotropyMapUv: Y && g(x.anisotropyMap.channel),
      clearcoatMapUv: $ && g(x.clearcoatMap.channel),
      clearcoatNormalMapUv: ee && g(x.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: ae && g(x.clearcoatRoughnessMap.channel),
      iridescenceMapUv: X && g(x.iridescenceMap.channel),
      iridescenceThicknessMapUv: Z && g(x.iridescenceThicknessMap.channel),
      sheenColorMapUv: fe && g(x.sheenColorMap.channel),
      sheenRoughnessMapUv: ge && g(x.sheenRoughnessMap.channel),
      specularMapUv: se && g(x.specularMap.channel),
      specularColorMapUv: te && g(x.specularColorMap.channel),
      specularIntensityMapUv: Re && g(x.specularIntensityMap.channel),
      transmissionMapUv: Ne && g(x.transmissionMap.channel),
      thicknessMapUv: Ye && g(x.thicknessMap.channel),
      alphaMapUv: ne && g(x.alphaMap.channel),
      vertexTangents: !!U.attributes.tangent && (lt || st),
      vertexNormals: !!U.attributes.normal,
      vertexColors: x.vertexColors,
      vertexAlphas: x.vertexColors === !0 && !!U.attributes.color && U.attributes.color.itemSize === 4,
      pointsUvs: N.isPoints === !0 && !!U.attributes.uv && (ot || ne),
      fog: !!W,
      useFog: x.fog === !0,
      fogExp2: !!W && W.isFogExp2,
      flatShading:
        x.wireframe === !1 &&
        (x.flatShading === !0 ||
          (U.attributes.normal === void 0 &&
            lt === !1 &&
            (x.isMeshLambertMaterial ||
              x.isMeshPhongMaterial ||
              x.isMeshStandardMaterial ||
              x.isMeshPhysicalMaterial))),
      sizeAttenuation: x.sizeAttenuation === !0,
      logarithmicDepthBuffer: d,
      reversedDepthBuffer: Ae,
      skinning: N.isSkinnedMesh === !0,
      morphTargets: U.morphAttributes.position !== void 0,
      morphNormals: U.morphAttributes.normal !== void 0,
      morphColors: U.morphAttributes.color !== void 0,
      morphTargetsCount: be,
      morphTextureStride: Xe,
      numDirLights: A.directional.length,
      numPointLights: A.point.length,
      numSpotLights: A.spot.length,
      numSpotLightMaps: A.spotLightMap.length,
      numRectAreaLights: A.rectArea.length,
      numHemiLights: A.hemi.length,
      numDirLightShadows: A.directionalShadowMap.length,
      numPointLightShadows: A.pointShadowMap.length,
      numSpotLightShadows: A.spotShadowMap.length,
      numSpotLightShadowsWithMaps: A.numSpotLightShadowsWithMaps,
      numLightProbes: A.numLightProbes,
      numLightProbeGrids: H.length,
      numClippingPlanes: r.numPlanes,
      numClipIntersection: r.numIntersection,
      dithering: x.dithering,
      shadowMapEnabled: i.shadowMap.enabled && L.length > 0,
      shadowMapType: i.shadowMap.type,
      toneMapping: j,
      decodeVideoTexture: ot && x.map.isVideoTexture === !0 && We.getTransfer(x.map.colorSpace) === Ze,
      decodeVideoTextureEmissive:
        I && x.emissiveMap.isVideoTexture === !0 && We.getTransfer(x.emissiveMap.colorSpace) === Ze,
      premultipliedAlpha: x.premultipliedAlpha,
      doubleSided: x.side === Mn,
      flipSided: x.side === It,
      useDepthPacking: x.depthPacking >= 0,
      depthPacking: x.depthPacking || 0,
      index0AttributeName: x.index0AttributeName,
      extensionClipCullDistance: re && x.extensions.clipCullDistance === !0 && t.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw: ((re && x.extensions.multiDraw === !0) || we) && t.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: t.has("KHR_parallel_shader_compile"),
      customProgramCacheKey: x.customProgramCacheKey(),
    };
    return ((Se.vertexUv1s = c.has(1)), (Se.vertexUv2s = c.has(2)), (Se.vertexUv3s = c.has(3)), c.clear(), Se);
  }
  function m(x) {
    const A = [];
    if (
      (x.shaderID ? A.push(x.shaderID) : (A.push(x.customVertexShaderID), A.push(x.customFragmentShaderID)),
      x.defines !== void 0)
    )
      for (const L in x.defines) (A.push(L), A.push(x.defines[L]));
    return (
      x.isRawShaderMaterial === !1 && (p(A, x), S(A, x), A.push(i.outputColorSpace)),
      A.push(x.customProgramCacheKey),
      A.join()
    );
  }
  function p(x, A) {
    (x.push(A.precision),
      x.push(A.outputColorSpace),
      x.push(A.envMapMode),
      x.push(A.envMapCubeUVHeight),
      x.push(A.mapUv),
      x.push(A.alphaMapUv),
      x.push(A.lightMapUv),
      x.push(A.aoMapUv),
      x.push(A.bumpMapUv),
      x.push(A.normalMapUv),
      x.push(A.displacementMapUv),
      x.push(A.emissiveMapUv),
      x.push(A.metalnessMapUv),
      x.push(A.roughnessMapUv),
      x.push(A.anisotropyMapUv),
      x.push(A.clearcoatMapUv),
      x.push(A.clearcoatNormalMapUv),
      x.push(A.clearcoatRoughnessMapUv),
      x.push(A.iridescenceMapUv),
      x.push(A.iridescenceThicknessMapUv),
      x.push(A.sheenColorMapUv),
      x.push(A.sheenRoughnessMapUv),
      x.push(A.specularMapUv),
      x.push(A.specularColorMapUv),
      x.push(A.specularIntensityMapUv),
      x.push(A.transmissionMapUv),
      x.push(A.thicknessMapUv),
      x.push(A.combine),
      x.push(A.fogExp2),
      x.push(A.sizeAttenuation),
      x.push(A.morphTargetsCount),
      x.push(A.morphAttributeCount),
      x.push(A.numDirLights),
      x.push(A.numPointLights),
      x.push(A.numSpotLights),
      x.push(A.numSpotLightMaps),
      x.push(A.numHemiLights),
      x.push(A.numRectAreaLights),
      x.push(A.numDirLightShadows),
      x.push(A.numPointLightShadows),
      x.push(A.numSpotLightShadows),
      x.push(A.numSpotLightShadowsWithMaps),
      x.push(A.numLightProbes),
      x.push(A.shadowMapType),
      x.push(A.toneMapping),
      x.push(A.numClippingPlanes),
      x.push(A.numClipIntersection),
      x.push(A.depthPacking));
  }
  function S(x, A) {
    (a.disableAll(),
      A.instancing && a.enable(0),
      A.instancingColor && a.enable(1),
      A.instancingMorph && a.enable(2),
      A.matcap && a.enable(3),
      A.envMap && a.enable(4),
      A.normalMapObjectSpace && a.enable(5),
      A.normalMapTangentSpace && a.enable(6),
      A.clearcoat && a.enable(7),
      A.iridescence && a.enable(8),
      A.alphaTest && a.enable(9),
      A.vertexColors && a.enable(10),
      A.vertexAlphas && a.enable(11),
      A.vertexUv1s && a.enable(12),
      A.vertexUv2s && a.enable(13),
      A.vertexUv3s && a.enable(14),
      A.vertexTangents && a.enable(15),
      A.anisotropy && a.enable(16),
      A.alphaHash && a.enable(17),
      A.batching && a.enable(18),
      A.dispersion && a.enable(19),
      A.batchingColor && a.enable(20),
      A.gradientMap && a.enable(21),
      A.packedNormalMap && a.enable(22),
      A.vertexNormals && a.enable(23),
      x.push(a.mask),
      a.disableAll(),
      A.fog && a.enable(0),
      A.useFog && a.enable(1),
      A.flatShading && a.enable(2),
      A.logarithmicDepthBuffer && a.enable(3),
      A.reversedDepthBuffer && a.enable(4),
      A.skinning && a.enable(5),
      A.morphTargets && a.enable(6),
      A.morphNormals && a.enable(7),
      A.morphColors && a.enable(8),
      A.premultipliedAlpha && a.enable(9),
      A.shadowMapEnabled && a.enable(10),
      A.doubleSided && a.enable(11),
      A.flipSided && a.enable(12),
      A.useDepthPacking && a.enable(13),
      A.dithering && a.enable(14),
      A.transmission && a.enable(15),
      A.sheen && a.enable(16),
      A.opaque && a.enable(17),
      A.pointsUvs && a.enable(18),
      A.decodeVideoTexture && a.enable(19),
      A.decodeVideoTextureEmissive && a.enable(20),
      A.alphaToCoverage && a.enable(21),
      A.numLightProbeGrids > 0 && a.enable(22),
      x.push(a.mask));
  }
  function E(x) {
    const A = f[x.type];
    let L;
    if (A) {
      const w = rn[A];
      L = Gu.clone(w.uniforms);
    } else L = x.uniforms;
    return L;
  }
  function b(x, A) {
    let L = u.get(A);
    return (L !== void 0 ? ++L.usedTimes : ((L = new Gg(i, A, x, s)), l.push(L), u.set(A, L)), L);
  }
  function R(x) {
    if (--x.usedTimes === 0) {
      const A = l.indexOf(x);
      ((l[A] = l[l.length - 1]), l.pop(), u.delete(x.cacheKey), x.destroy());
    }
  }
  function T(x) {
    o.remove(x);
  }
  function P() {
    o.dispose();
  }
  return {
    getParameters: M,
    getProgramCacheKey: m,
    getUniforms: E,
    acquireProgram: b,
    releaseProgram: R,
    releaseShaderCache: T,
    programs: l,
    dispose: P,
  };
}
function Zg() {
  let i = new WeakMap();
  function e(a) {
    return i.has(a);
  }
  function t(a) {
    let o = i.get(a);
    return (o === void 0 && ((o = {}), i.set(a, o)), o);
  }
  function n(a) {
    i.delete(a);
  }
  function s(a, o, c) {
    i.get(a)[o] = c;
  }
  function r() {
    i = new WeakMap();
  }
  return { has: e, get: t, remove: n, update: s, dispose: r };
}
function Kg(i, e) {
  return i.groupOrder !== e.groupOrder
    ? i.groupOrder - e.groupOrder
    : i.renderOrder !== e.renderOrder
      ? i.renderOrder - e.renderOrder
      : i.material.id !== e.material.id
        ? i.material.id - e.material.id
        : i.materialVariant !== e.materialVariant
          ? i.materialVariant - e.materialVariant
          : i.z !== e.z
            ? i.z - e.z
            : i.id - e.id;
}
function Vl(i, e) {
  return i.groupOrder !== e.groupOrder
    ? i.groupOrder - e.groupOrder
    : i.renderOrder !== e.renderOrder
      ? i.renderOrder - e.renderOrder
      : i.z !== e.z
        ? e.z - i.z
        : i.id - e.id;
}
function kl() {
  const i = [];
  let e = 0;
  const t = [],
    n = [],
    s = [];
  function r() {
    ((e = 0), (t.length = 0), (n.length = 0), (s.length = 0));
  }
  function a(h) {
    let f = 0;
    return (h.isInstancedMesh && (f += 2), h.isSkinnedMesh && (f += 1), f);
  }
  function o(h, f, g, M, m, p) {
    let S = i[e];
    return (
      S === void 0
        ? ((S = {
            id: h.id,
            object: h,
            geometry: f,
            material: g,
            materialVariant: a(h),
            groupOrder: M,
            renderOrder: h.renderOrder,
            z: m,
            group: p,
          }),
          (i[e] = S))
        : ((S.id = h.id),
          (S.object = h),
          (S.geometry = f),
          (S.material = g),
          (S.materialVariant = a(h)),
          (S.groupOrder = M),
          (S.renderOrder = h.renderOrder),
          (S.z = m),
          (S.group = p)),
      e++,
      S
    );
  }
  function c(h, f, g, M, m, p) {
    const S = o(h, f, g, M, m, p);
    g.transmission > 0 ? n.push(S) : g.transparent === !0 ? s.push(S) : t.push(S);
  }
  function l(h, f, g, M, m, p) {
    const S = o(h, f, g, M, m, p);
    g.transmission > 0 ? n.unshift(S) : g.transparent === !0 ? s.unshift(S) : t.unshift(S);
  }
  function u(h, f) {
    (t.length > 1 && t.sort(h || Kg), n.length > 1 && n.sort(f || Vl), s.length > 1 && s.sort(f || Vl));
  }
  function d() {
    for (let h = e, f = i.length; h < f; h++) {
      const g = i[h];
      if (g.id === null) break;
      ((g.id = null), (g.object = null), (g.geometry = null), (g.material = null), (g.group = null));
    }
  }
  return { opaque: t, transmissive: n, transparent: s, init: r, push: c, unshift: l, finish: d, sort: u };
}
function jg() {
  let i = new WeakMap();
  function e(n, s) {
    const r = i.get(n);
    let a;
    return (
      r === void 0 ? ((a = new kl()), i.set(n, [a])) : s >= r.length ? ((a = new kl()), r.push(a)) : (a = r[s]),
      a
    );
  }
  function t() {
    i = new WeakMap();
  }
  return { get: e, dispose: t };
}
function $g() {
  const i = {};
  return {
    get: function (e) {
      if (i[e.id] !== void 0) return i[e.id];
      let t;
      switch (e.type) {
        case "DirectionalLight":
          t = { direction: new F(), color: new Ce() };
          break;
        case "SpotLight":
          t = {
            position: new F(),
            direction: new F(),
            color: new Ce(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0,
          };
          break;
        case "PointLight":
          t = { position: new F(), color: new Ce(), distance: 0, decay: 0 };
          break;
        case "HemisphereLight":
          t = { direction: new F(), skyColor: new Ce(), groundColor: new Ce() };
          break;
        case "RectAreaLight":
          t = { color: new Ce(), position: new F(), halfWidth: new F(), halfHeight: new F() };
          break;
      }
      return ((i[e.id] = t), t);
    },
  };
}
function Jg() {
  const i = {};
  return {
    get: function (e) {
      if (i[e.id] !== void 0) return i[e.id];
      let t;
      switch (e.type) {
        case "DirectionalLight":
          t = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new Ge() };
          break;
        case "SpotLight":
          t = { shadowIntensity: 1, shadowBias: 0, shadowNormalBias: 0, shadowRadius: 1, shadowMapSize: new Ge() };
          break;
        case "PointLight":
          t = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Ge(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3,
          };
          break;
      }
      return ((i[e.id] = t), t);
    },
  };
}
let Qg = 0;
function e_(i, e) {
  return (e.castShadow ? 2 : 0) - (i.castShadow ? 2 : 0) + (e.map ? 1 : 0) - (i.map ? 1 : 0);
}
function t_(i) {
  const e = new $g(),
    t = Jg(),
    n = {
      version: 0,
      hash: {
        directionalLength: -1,
        pointLength: -1,
        spotLength: -1,
        rectAreaLength: -1,
        hemiLength: -1,
        numDirectionalShadows: -1,
        numPointShadows: -1,
        numSpotShadows: -1,
        numSpotMaps: -1,
        numLightProbes: -1,
      },
      ambient: [0, 0, 0],
      probe: [],
      directional: [],
      directionalShadow: [],
      directionalShadowMap: [],
      directionalShadowMatrix: [],
      spot: [],
      spotLightMap: [],
      spotShadow: [],
      spotShadowMap: [],
      spotLightMatrix: [],
      rectArea: [],
      rectAreaLTC1: null,
      rectAreaLTC2: null,
      point: [],
      pointShadow: [],
      pointShadowMap: [],
      pointShadowMatrix: [],
      hemi: [],
      numSpotLightShadowsWithMaps: 0,
      numLightProbes: 0,
    };
  for (let l = 0; l < 9; l++) n.probe.push(new F());
  const s = new F(),
    r = new He(),
    a = new He();
  function o(l) {
    let u = 0,
      d = 0,
      h = 0;
    for (let A = 0; A < 9; A++) n.probe[A].set(0, 0, 0);
    let f = 0,
      g = 0,
      M = 0,
      m = 0,
      p = 0,
      S = 0,
      E = 0,
      b = 0,
      R = 0,
      T = 0,
      P = 0;
    l.sort(e_);
    for (let A = 0, L = l.length; A < L; A++) {
      const w = l[A],
        N = w.color,
        H = w.intensity,
        W = w.distance;
      let U = null;
      if (
        (w.shadow &&
          w.shadow.map &&
          (w.shadow.map.texture.format === Qn
            ? (U = w.shadow.map.texture)
            : (U = w.shadow.map.depthTexture || w.shadow.map.texture)),
        w.isAmbientLight)
      )
        ((u += N.r * H), (d += N.g * H), (h += N.b * H));
      else if (w.isLightProbe) {
        for (let V = 0; V < 9; V++) n.probe[V].addScaledVector(w.sh.coefficients[V], H);
        P++;
      } else if (w.isDirectionalLight) {
        const V = e.get(w);
        if ((V.color.copy(w.color).multiplyScalar(w.intensity), w.castShadow)) {
          const G = w.shadow,
            J = t.get(w);
          ((J.shadowIntensity = G.intensity),
            (J.shadowBias = G.bias),
            (J.shadowNormalBias = G.normalBias),
            (J.shadowRadius = G.radius),
            (J.shadowMapSize = G.mapSize),
            (n.directionalShadow[f] = J),
            (n.directionalShadowMap[f] = U),
            (n.directionalShadowMatrix[f] = w.shadow.matrix),
            S++);
        }
        ((n.directional[f] = V), f++);
      } else if (w.isSpotLight) {
        const V = e.get(w);
        (V.position.setFromMatrixPosition(w.matrixWorld),
          V.color.copy(N).multiplyScalar(H),
          (V.distance = W),
          (V.coneCos = Math.cos(w.angle)),
          (V.penumbraCos = Math.cos(w.angle * (1 - w.penumbra))),
          (V.decay = w.decay),
          (n.spot[M] = V));
        const G = w.shadow;
        if (
          (w.map && ((n.spotLightMap[R] = w.map), R++, G.updateMatrices(w), w.castShadow && T++),
          (n.spotLightMatrix[M] = G.matrix),
          w.castShadow)
        ) {
          const J = t.get(w);
          ((J.shadowIntensity = G.intensity),
            (J.shadowBias = G.bias),
            (J.shadowNormalBias = G.normalBias),
            (J.shadowRadius = G.radius),
            (J.shadowMapSize = G.mapSize),
            (n.spotShadow[M] = J),
            (n.spotShadowMap[M] = U),
            b++);
        }
        M++;
      } else if (w.isRectAreaLight) {
        const V = e.get(w);
        (V.color.copy(N).multiplyScalar(H),
          V.halfWidth.set(w.width * 0.5, 0, 0),
          V.halfHeight.set(0, w.height * 0.5, 0),
          (n.rectArea[m] = V),
          m++);
      } else if (w.isPointLight) {
        const V = e.get(w);
        if (
          (V.color.copy(w.color).multiplyScalar(w.intensity),
          (V.distance = w.distance),
          (V.decay = w.decay),
          w.castShadow)
        ) {
          const G = w.shadow,
            J = t.get(w);
          ((J.shadowIntensity = G.intensity),
            (J.shadowBias = G.bias),
            (J.shadowNormalBias = G.normalBias),
            (J.shadowRadius = G.radius),
            (J.shadowMapSize = G.mapSize),
            (J.shadowCameraNear = G.camera.near),
            (J.shadowCameraFar = G.camera.far),
            (n.pointShadow[g] = J),
            (n.pointShadowMap[g] = U),
            (n.pointShadowMatrix[g] = w.shadow.matrix),
            E++);
        }
        ((n.point[g] = V), g++);
      } else if (w.isHemisphereLight) {
        const V = e.get(w);
        (V.skyColor.copy(w.color).multiplyScalar(H),
          V.groundColor.copy(w.groundColor).multiplyScalar(H),
          (n.hemi[p] = V),
          p++);
      }
    }
    (m > 0 &&
      (i.has("OES_texture_float_linear") === !0
        ? ((n.rectAreaLTC1 = le.LTC_FLOAT_1), (n.rectAreaLTC2 = le.LTC_FLOAT_2))
        : ((n.rectAreaLTC1 = le.LTC_HALF_1), (n.rectAreaLTC2 = le.LTC_HALF_2))),
      (n.ambient[0] = u),
      (n.ambient[1] = d),
      (n.ambient[2] = h));
    const x = n.hash;
    (x.directionalLength !== f ||
      x.pointLength !== g ||
      x.spotLength !== M ||
      x.rectAreaLength !== m ||
      x.hemiLength !== p ||
      x.numDirectionalShadows !== S ||
      x.numPointShadows !== E ||
      x.numSpotShadows !== b ||
      x.numSpotMaps !== R ||
      x.numLightProbes !== P) &&
      ((n.directional.length = f),
      (n.spot.length = M),
      (n.rectArea.length = m),
      (n.point.length = g),
      (n.hemi.length = p),
      (n.directionalShadow.length = S),
      (n.directionalShadowMap.length = S),
      (n.pointShadow.length = E),
      (n.pointShadowMap.length = E),
      (n.spotShadow.length = b),
      (n.spotShadowMap.length = b),
      (n.directionalShadowMatrix.length = S),
      (n.pointShadowMatrix.length = E),
      (n.spotLightMatrix.length = b + R - T),
      (n.spotLightMap.length = R),
      (n.numSpotLightShadowsWithMaps = T),
      (n.numLightProbes = P),
      (x.directionalLength = f),
      (x.pointLength = g),
      (x.spotLength = M),
      (x.rectAreaLength = m),
      (x.hemiLength = p),
      (x.numDirectionalShadows = S),
      (x.numPointShadows = E),
      (x.numSpotShadows = b),
      (x.numSpotMaps = R),
      (x.numLightProbes = P),
      (n.version = Qg++));
  }
  function c(l, u) {
    let d = 0,
      h = 0,
      f = 0,
      g = 0,
      M = 0;
    const m = u.matrixWorldInverse;
    for (let p = 0, S = l.length; p < S; p++) {
      const E = l[p];
      if (E.isDirectionalLight) {
        const b = n.directional[d];
        (b.direction.setFromMatrixPosition(E.matrixWorld),
          s.setFromMatrixPosition(E.target.matrixWorld),
          b.direction.sub(s),
          b.direction.transformDirection(m),
          d++);
      } else if (E.isSpotLight) {
        const b = n.spot[f];
        (b.position.setFromMatrixPosition(E.matrixWorld),
          b.position.applyMatrix4(m),
          b.direction.setFromMatrixPosition(E.matrixWorld),
          s.setFromMatrixPosition(E.target.matrixWorld),
          b.direction.sub(s),
          b.direction.transformDirection(m),
          f++);
      } else if (E.isRectAreaLight) {
        const b = n.rectArea[g];
        (b.position.setFromMatrixPosition(E.matrixWorld),
          b.position.applyMatrix4(m),
          a.identity(),
          r.copy(E.matrixWorld),
          r.premultiply(m),
          a.extractRotation(r),
          b.halfWidth.set(E.width * 0.5, 0, 0),
          b.halfHeight.set(0, E.height * 0.5, 0),
          b.halfWidth.applyMatrix4(a),
          b.halfHeight.applyMatrix4(a),
          g++);
      } else if (E.isPointLight) {
        const b = n.point[h];
        (b.position.setFromMatrixPosition(E.matrixWorld), b.position.applyMatrix4(m), h++);
      } else if (E.isHemisphereLight) {
        const b = n.hemi[M];
        (b.direction.setFromMatrixPosition(E.matrixWorld), b.direction.transformDirection(m), M++);
      }
    }
  }
  return { setup: o, setupView: c, state: n };
}
function Gl(i) {
  const e = new t_(i),
    t = [],
    n = [],
    s = [];
  function r(h) {
    ((d.camera = h), (t.length = 0), (n.length = 0), (s.length = 0));
  }
  function a(h) {
    t.push(h);
  }
  function o(h) {
    n.push(h);
  }
  function c(h) {
    s.push(h);
  }
  function l() {
    e.setup(t);
  }
  function u(h) {
    e.setupView(t, h);
  }
  const d = {
    lightsArray: t,
    shadowsArray: n,
    lightProbeGridArray: s,
    camera: null,
    lights: e,
    transmissionRenderTarget: {},
    textureUnits: 0,
  };
  return { init: r, state: d, setupLights: l, setupLightsView: u, pushLight: a, pushShadow: o, pushLightProbeGrid: c };
}
function n_(i) {
  let e = new WeakMap();
  function t(s, r = 0) {
    const a = e.get(s);
    let o;
    return (
      a === void 0 ? ((o = new Gl(i)), e.set(s, [o])) : r >= a.length ? ((o = new Gl(i)), a.push(o)) : (o = a[r]),
      o
    );
  }
  function n() {
    e = new WeakMap();
  }
  return { get: t, dispose: n };
}
const i_ = `void main() {
	gl_Position = vec4( position, 1.0 );
}`,
  s_ = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,
  r_ = [new F(1, 0, 0), new F(-1, 0, 0), new F(0, 1, 0), new F(0, -1, 0), new F(0, 0, 1), new F(0, 0, -1)],
  a_ = [new F(0, -1, 0), new F(0, -1, 0), new F(0, 0, 1), new F(0, 0, -1), new F(0, -1, 0), new F(0, -1, 0)],
  Hl = new He(),
  Gi = new F(),
  Kr = new F();
function o_(i, e, t) {
  let n = new so();
  const s = new Ge(),
    r = new Ge(),
    a = new it(),
    o = new Yu(),
    c = new Zu(),
    l = {},
    u = t.maxTextureSize,
    d = { [kn]: It, [It]: kn, [Mn]: Mn },
    h = new dn({
      defines: { VSM_SAMPLES: 8 },
      uniforms: { shadow_pass: { value: null }, resolution: { value: new Ge() }, radius: { value: 4 } },
      vertexShader: i_,
      fragmentShader: s_,
    }),
    f = h.clone();
  f.defines.HORIZONTAL_PASS = 1;
  const g = new Lt();
  g.setAttribute("position", new Wt(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3));
  const M = new Xt(g, h),
    m = this;
  ((this.enabled = !1), (this.autoUpdate = !0), (this.needsUpdate = !1), (this.type = zs));
  let p = this.type;
  this.render = function (T, P, x) {
    if (m.enabled === !1 || (m.autoUpdate === !1 && m.needsUpdate === !1) || T.length === 0) return;
    this.type === Yc &&
      (xe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."), (this.type = zs));
    const A = i.getRenderTarget(),
      L = i.getActiveCubeFace(),
      w = i.getActiveMipmapLevel(),
      N = i.state;
    (N.setBlending(yn),
      N.buffers.depth.getReversed() === !0
        ? N.buffers.color.setClear(0, 0, 0, 0)
        : N.buffers.color.setClear(1, 1, 1, 1),
      N.buffers.depth.setTest(!0),
      N.setScissorTest(!1));
    const H = p !== this.type;
    H &&
      P.traverse(function (W) {
        W.material &&
          (Array.isArray(W.material) ? W.material.forEach((U) => (U.needsUpdate = !0)) : (W.material.needsUpdate = !0));
      });
    for (let W = 0, U = T.length; W < U; W++) {
      const V = T[W],
        G = V.shadow;
      if (G === void 0) {
        xe("WebGLShadowMap:", V, "has no shadow.");
        continue;
      }
      if (G.autoUpdate === !1 && G.needsUpdate === !1) continue;
      s.copy(G.mapSize);
      const J = G.getFrameExtents();
      (s.multiply(J),
        r.copy(G.mapSize),
        (s.x > u || s.y > u) &&
          (s.x > u && ((r.x = Math.floor(u / J.x)), (s.x = r.x * J.x), (G.mapSize.x = r.x)),
          s.y > u && ((r.y = Math.floor(u / J.y)), (s.y = r.y * J.y), (G.mapSize.y = r.y))));
      const Q = i.state.buffers.depth.getReversed();
      if (((G.camera._reversedDepth = Q), G.map === null || H === !0)) {
        if (
          (G.map !== null &&
            (G.map.depthTexture !== null && (G.map.depthTexture.dispose(), (G.map.depthTexture = null)),
            G.map.dispose()),
          this.type === Hi)
        ) {
          if (V.isPointLight) {
            xe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");
            continue;
          }
          ((G.map = new cn(s.x, s.y, { format: Qn, type: En, minFilter: vt, magFilter: vt, generateMipmaps: !1 })),
            (G.map.texture.name = V.name + ".shadowMap"),
            (G.map.depthTexture = new Ai(s.x, s.y, Gt)),
            (G.map.depthTexture.name = V.name + ".shadowMapDepth"),
            (G.map.depthTexture.format = Tn),
            (G.map.depthTexture.compareFunction = null),
            (G.map.depthTexture.minFilter = Et),
            (G.map.depthTexture.magFilter = Et));
        } else
          (V.isPointLight
            ? ((G.map = new Ic(s.x)), (G.map.depthTexture = new yu(s.x, hn)))
            : ((G.map = new cn(s.x, s.y)), (G.map.depthTexture = new Ai(s.x, s.y, hn))),
            (G.map.depthTexture.name = V.name + ".shadowMap"),
            (G.map.depthTexture.format = Tn),
            this.type === zs
              ? ((G.map.depthTexture.compareFunction = Q ? to : eo),
                (G.map.depthTexture.minFilter = vt),
                (G.map.depthTexture.magFilter = vt))
              : ((G.map.depthTexture.compareFunction = null),
                (G.map.depthTexture.minFilter = Et),
                (G.map.depthTexture.magFilter = Et)));
        G.camera.updateProjectionMatrix();
      }
      const ce = G.map.isWebGLCubeRenderTarget ? 6 : 1;
      for (let ve = 0; ve < ce; ve++) {
        if (G.map.isWebGLCubeRenderTarget) (i.setRenderTarget(G.map, ve), i.clear());
        else {
          ve === 0 && (i.setRenderTarget(G.map), i.clear());
          const be = G.getViewport(ve);
          (a.set(r.x * be.x, r.y * be.y, r.x * be.z, r.y * be.w), N.viewport(a));
        }
        if (V.isPointLight) {
          const be = G.camera,
            Xe = G.matrix,
            $e = V.distance || be.far;
          ($e !== be.far && ((be.far = $e), be.updateProjectionMatrix()),
            Gi.setFromMatrixPosition(V.matrixWorld),
            be.position.copy(Gi),
            Kr.copy(be.position),
            Kr.add(r_[ve]),
            be.up.copy(a_[ve]),
            be.lookAt(Kr),
            be.updateMatrixWorld(),
            Xe.makeTranslation(-Gi.x, -Gi.y, -Gi.z),
            Hl.multiplyMatrices(be.projectionMatrix, be.matrixWorldInverse),
            G._frustum.setFromProjectionMatrix(Hl, be.coordinateSystem, be.reversedDepth));
        } else G.updateMatrices(V);
        ((n = G.getFrustum()), b(P, x, G.camera, V, this.type));
      }
      (G.isPointLightShadow !== !0 && this.type === Hi && S(G, x), (G.needsUpdate = !1));
    }
    ((p = this.type), (m.needsUpdate = !1), i.setRenderTarget(A, L, w));
  };
  function S(T, P) {
    const x = e.update(M);
    (h.defines.VSM_SAMPLES !== T.blurSamples &&
      ((h.defines.VSM_SAMPLES = T.blurSamples),
      (f.defines.VSM_SAMPLES = T.blurSamples),
      (h.needsUpdate = !0),
      (f.needsUpdate = !0)),
      T.mapPass === null && (T.mapPass = new cn(s.x, s.y, { format: Qn, type: En })),
      (h.uniforms.shadow_pass.value = T.map.depthTexture),
      (h.uniforms.resolution.value = T.mapSize),
      (h.uniforms.radius.value = T.radius),
      i.setRenderTarget(T.mapPass),
      i.clear(),
      i.renderBufferDirect(P, null, x, h, M, null),
      (f.uniforms.shadow_pass.value = T.mapPass.texture),
      (f.uniforms.resolution.value = T.mapSize),
      (f.uniforms.radius.value = T.radius),
      i.setRenderTarget(T.map),
      i.clear(),
      i.renderBufferDirect(P, null, x, f, M, null));
  }
  function E(T, P, x, A) {
    let L = null;
    const w = x.isPointLight === !0 ? T.customDistanceMaterial : T.customDepthMaterial;
    if (w !== void 0) L = w;
    else if (
      ((L = x.isPointLight === !0 ? c : o),
      (i.localClippingEnabled &&
        P.clipShadows === !0 &&
        Array.isArray(P.clippingPlanes) &&
        P.clippingPlanes.length !== 0) ||
        (P.displacementMap && P.displacementScale !== 0) ||
        (P.alphaMap && P.alphaTest > 0) ||
        (P.map && P.alphaTest > 0) ||
        P.alphaToCoverage === !0)
    ) {
      const N = L.uuid,
        H = P.uuid;
      let W = l[N];
      W === void 0 && ((W = {}), (l[N] = W));
      let U = W[H];
      (U === void 0 && ((U = L.clone()), (W[H] = U), P.addEventListener("dispose", R)), (L = U));
    }
    if (
      ((L.visible = P.visible),
      (L.wireframe = P.wireframe),
      A === Hi
        ? (L.side = P.shadowSide !== null ? P.shadowSide : P.side)
        : (L.side = P.shadowSide !== null ? P.shadowSide : d[P.side]),
      (L.alphaMap = P.alphaMap),
      (L.alphaTest = P.alphaToCoverage === !0 ? 0.5 : P.alphaTest),
      (L.map = P.map),
      (L.clipShadows = P.clipShadows),
      (L.clippingPlanes = P.clippingPlanes),
      (L.clipIntersection = P.clipIntersection),
      (L.displacementMap = P.displacementMap),
      (L.displacementScale = P.displacementScale),
      (L.displacementBias = P.displacementBias),
      (L.wireframeLinewidth = P.wireframeLinewidth),
      (L.linewidth = P.linewidth),
      x.isPointLight === !0 && L.isMeshDistanceMaterial === !0)
    ) {
      const N = i.properties.get(L);
      N.light = x;
    }
    return L;
  }
  function b(T, P, x, A, L) {
    if (T.visible === !1) return;
    if (
      T.layers.test(P.layers) &&
      (T.isMesh || T.isLine || T.isPoints) &&
      (T.castShadow || (T.receiveShadow && L === Hi)) &&
      (!T.frustumCulled || n.intersectsObject(T))
    ) {
      T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse, T.matrixWorld);
      const H = e.update(T),
        W = T.material;
      if (Array.isArray(W)) {
        const U = H.groups;
        for (let V = 0, G = U.length; V < G; V++) {
          const J = U[V],
            Q = W[J.materialIndex];
          if (Q && Q.visible) {
            const ce = E(T, Q, A, L);
            (T.onBeforeShadow(i, T, P, x, H, ce, J),
              i.renderBufferDirect(x, null, H, ce, T, J),
              T.onAfterShadow(i, T, P, x, H, ce, J));
          }
        }
      } else if (W.visible) {
        const U = E(T, W, A, L);
        (T.onBeforeShadow(i, T, P, x, H, U, null),
          i.renderBufferDirect(x, null, H, U, T, null),
          T.onAfterShadow(i, T, P, x, H, U, null));
      }
    }
    const N = T.children;
    for (let H = 0, W = N.length; H < W; H++) b(N[H], P, x, A, L);
  }
  function R(T) {
    T.target.removeEventListener("dispose", R);
    for (const x in l) {
      const A = l[x],
        L = T.target.uuid;
      L in A && (A[L].dispose(), delete A[L]);
    }
  }
}
function l_(i, e) {
  function t() {
    let C = !1;
    const ne = new it();
    let q = null;
    const pe = new it(0, 0, 0, 0);
    return {
      setMask: function (re) {
        q !== re && !C && (i.colorMask(re, re, re, re), (q = re));
      },
      setLocked: function (re) {
        C = re;
      },
      setClear: function (re, j, Se, Le, ft) {
        (ft === !0 && ((re *= Le), (j *= Le), (Se *= Le)),
          ne.set(re, j, Se, Le),
          pe.equals(ne) === !1 && (i.clearColor(re, j, Se, Le), pe.copy(ne)));
      },
      reset: function () {
        ((C = !1), (q = null), pe.set(-1, 0, 0, 0));
      },
    };
  }
  function n() {
    let C = !1,
      ne = !1,
      q = null,
      pe = null,
      re = null;
    return {
      setReversed: function (j) {
        if (ne !== j) {
          const Se = e.get("EXT_clip_control");
          (j
            ? Se.clipControlEXT(Se.LOWER_LEFT_EXT, Se.ZERO_TO_ONE_EXT)
            : Se.clipControlEXT(Se.LOWER_LEFT_EXT, Se.NEGATIVE_ONE_TO_ONE_EXT),
            (ne = j));
          const Le = re;
          ((re = null), this.setClear(Le));
        }
      },
      getReversed: function () {
        return ne;
      },
      setTest: function (j) {
        j ? ie(i.DEPTH_TEST) : Ae(i.DEPTH_TEST);
      },
      setMask: function (j) {
        q !== j && !C && (i.depthMask(j), (q = j));
      },
      setFunc: function (j) {
        if ((ne && (j = Lh[j]), pe !== j)) {
          switch (j) {
            case Jr:
              i.depthFunc(i.NEVER);
              break;
            case Qr:
              i.depthFunc(i.ALWAYS);
              break;
            case ea:
              i.depthFunc(i.LESS);
              break;
            case bi:
              i.depthFunc(i.LEQUAL);
              break;
            case ta:
              i.depthFunc(i.EQUAL);
              break;
            case na:
              i.depthFunc(i.GEQUAL);
              break;
            case ia:
              i.depthFunc(i.GREATER);
              break;
            case sa:
              i.depthFunc(i.NOTEQUAL);
              break;
            default:
              i.depthFunc(i.LEQUAL);
          }
          pe = j;
        }
      },
      setLocked: function (j) {
        C = j;
      },
      setClear: function (j) {
        re !== j && ((re = j), ne && (j = 1 - j), i.clearDepth(j));
      },
      reset: function () {
        ((C = !1), (q = null), (pe = null), (re = null), (ne = !1));
      },
    };
  }
  function s() {
    let C = !1,
      ne = null,
      q = null,
      pe = null,
      re = null,
      j = null,
      Se = null,
      Le = null,
      ft = null;
    return {
      setTest: function (Qe) {
        C || (Qe ? ie(i.STENCIL_TEST) : Ae(i.STENCIL_TEST));
      },
      setMask: function (Qe) {
        ne !== Qe && !C && (i.stencilMask(Qe), (ne = Qe));
      },
      setFunc: function (Qe, fn, en) {
        (q !== Qe || pe !== fn || re !== en) && (i.stencilFunc(Qe, fn, en), (q = Qe), (pe = fn), (re = en));
      },
      setOp: function (Qe, fn, en) {
        (j !== Qe || Se !== fn || Le !== en) && (i.stencilOp(Qe, fn, en), (j = Qe), (Se = fn), (Le = en));
      },
      setLocked: function (Qe) {
        C = Qe;
      },
      setClear: function (Qe) {
        ft !== Qe && (i.clearStencil(Qe), (ft = Qe));
      },
      reset: function () {
        ((C = !1),
          (ne = null),
          (q = null),
          (pe = null),
          (re = null),
          (j = null),
          (Se = null),
          (Le = null),
          (ft = null));
      },
    };
  }
  const r = new t(),
    a = new n(),
    o = new s(),
    c = new WeakMap(),
    l = new WeakMap();
  let u = {},
    d = {},
    h = {},
    f = new WeakMap(),
    g = [],
    M = null,
    m = !1,
    p = null,
    S = null,
    E = null,
    b = null,
    R = null,
    T = null,
    P = null,
    x = new Ce(0, 0, 0),
    A = 0,
    L = !1,
    w = null,
    N = null,
    H = null,
    W = null,
    U = null;
  const V = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let G = !1,
    J = 0;
  const Q = i.getParameter(i.VERSION);
  Q.indexOf("WebGL") !== -1
    ? ((J = parseFloat(/^WebGL (\d)/.exec(Q)[1])), (G = J >= 1))
    : Q.indexOf("OpenGL ES") !== -1 && ((J = parseFloat(/^OpenGL ES (\d)/.exec(Q)[1])), (G = J >= 2));
  let ce = null,
    ve = {};
  const be = i.getParameter(i.SCISSOR_BOX),
    Xe = i.getParameter(i.VIEWPORT),
    $e = new it().fromArray(be),
    Ue = new it().fromArray(Xe);
  function K(C, ne, q, pe) {
    const re = new Uint8Array(4),
      j = i.createTexture();
    (i.bindTexture(C, j),
      i.texParameteri(C, i.TEXTURE_MIN_FILTER, i.NEAREST),
      i.texParameteri(C, i.TEXTURE_MAG_FILTER, i.NEAREST));
    for (let Se = 0; Se < q; Se++)
      C === i.TEXTURE_3D || C === i.TEXTURE_2D_ARRAY
        ? i.texImage3D(ne, 0, i.RGBA, 1, 1, pe, 0, i.RGBA, i.UNSIGNED_BYTE, re)
        : i.texImage2D(ne + Se, 0, i.RGBA, 1, 1, 0, i.RGBA, i.UNSIGNED_BYTE, re);
    return j;
  }
  const de = {};
  ((de[i.TEXTURE_2D] = K(i.TEXTURE_2D, i.TEXTURE_2D, 1)),
    (de[i.TEXTURE_CUBE_MAP] = K(i.TEXTURE_CUBE_MAP, i.TEXTURE_CUBE_MAP_POSITIVE_X, 6)),
    (de[i.TEXTURE_2D_ARRAY] = K(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1)),
    (de[i.TEXTURE_3D] = K(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1)),
    r.setClear(0, 0, 0, 1),
    a.setClear(1),
    o.setClear(0),
    ie(i.DEPTH_TEST),
    a.setFunc(bi),
    _t(!1),
    lt(Eo),
    ie(i.CULL_FACE),
    at(yn));
  function ie(C) {
    u[C] !== !0 && (i.enable(C), (u[C] = !0));
  }
  function Ae(C) {
    u[C] !== !1 && (i.disable(C), (u[C] = !1));
  }
  function Pe(C, ne) {
    return h[C] !== ne
      ? (i.bindFramebuffer(C, ne),
        (h[C] = ne),
        C === i.DRAW_FRAMEBUFFER && (h[i.FRAMEBUFFER] = ne),
        C === i.FRAMEBUFFER && (h[i.DRAW_FRAMEBUFFER] = ne),
        !0)
      : !1;
  }
  function we(C, ne) {
    let q = g,
      pe = !1;
    if (C) {
      ((q = f.get(ne)), q === void 0 && ((q = []), f.set(ne, q)));
      const re = C.textures;
      if (q.length !== re.length || q[0] !== i.COLOR_ATTACHMENT0) {
        for (let j = 0, Se = re.length; j < Se; j++) q[j] = i.COLOR_ATTACHMENT0 + j;
        ((q.length = re.length), (pe = !0));
      }
    } else q[0] !== i.BACK && ((q[0] = i.BACK), (pe = !0));
    pe && i.drawBuffers(q);
  }
  function ot(C) {
    return M !== C ? (i.useProgram(C), (M = C), !0) : !1;
  }
  const Ve = { [Kn]: i.FUNC_ADD, [Kc]: i.FUNC_SUBTRACT, [jc]: i.FUNC_REVERSE_SUBTRACT };
  ((Ve[$c] = i.MIN), (Ve[Jc] = i.MAX));
  const Je = {
    [Qc]: i.ZERO,
    [eh]: i.ONE,
    [th]: i.SRC_COLOR,
    [jr]: i.SRC_ALPHA,
    [oh]: i.SRC_ALPHA_SATURATE,
    [rh]: i.DST_COLOR,
    [ih]: i.DST_ALPHA,
    [nh]: i.ONE_MINUS_SRC_COLOR,
    [$r]: i.ONE_MINUS_SRC_ALPHA,
    [ah]: i.ONE_MINUS_DST_COLOR,
    [sh]: i.ONE_MINUS_DST_ALPHA,
    [lh]: i.CONSTANT_COLOR,
    [ch]: i.ONE_MINUS_CONSTANT_COLOR,
    [hh]: i.CONSTANT_ALPHA,
    [uh]: i.ONE_MINUS_CONSTANT_ALPHA,
  };
  function at(C, ne, q, pe, re, j, Se, Le, ft, Qe) {
    if (C === yn) {
      m === !0 && (Ae(i.BLEND), (m = !1));
      return;
    }
    if ((m === !1 && (ie(i.BLEND), (m = !0)), C !== Zc)) {
      if (C !== p || Qe !== L) {
        if (((S !== Kn || R !== Kn) && (i.blendEquation(i.FUNC_ADD), (S = Kn), (R = Kn)), Qe))
          switch (C) {
            case Si:
              i.blendFuncSeparate(i.ONE, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case To:
              i.blendFunc(i.ONE, i.ONE);
              break;
            case Ao:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case wo:
              i.blendFuncSeparate(i.DST_COLOR, i.ONE_MINUS_SRC_ALPHA, i.ZERO, i.ONE);
              break;
            default:
              Te("WebGLState: Invalid blending: ", C);
              break;
          }
        else
          switch (C) {
            case Si:
              i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case To:
              i.blendFuncSeparate(i.SRC_ALPHA, i.ONE, i.ONE, i.ONE);
              break;
            case Ao:
              Te("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");
              break;
            case wo:
              Te("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");
              break;
            default:
              Te("WebGLState: Invalid blending: ", C);
              break;
          }
        ((E = null), (b = null), (T = null), (P = null), x.set(0, 0, 0), (A = 0), (p = C), (L = Qe));
      }
      return;
    }
    ((re = re || ne),
      (j = j || q),
      (Se = Se || pe),
      (ne !== S || re !== R) && (i.blendEquationSeparate(Ve[ne], Ve[re]), (S = ne), (R = re)),
      (q !== E || pe !== b || j !== T || Se !== P) &&
        (i.blendFuncSeparate(Je[q], Je[pe], Je[j], Je[Se]), (E = q), (b = pe), (T = j), (P = Se)),
      (Le.equals(x) === !1 || ft !== A) && (i.blendColor(Le.r, Le.g, Le.b, ft), x.copy(Le), (A = ft)),
      (p = C),
      (L = !1));
  }
  function ze(C, ne) {
    C.side === Mn ? Ae(i.CULL_FACE) : ie(i.CULL_FACE);
    let q = C.side === It;
    (ne && (q = !q),
      _t(q),
      C.blending === Si && C.transparent === !1
        ? at(yn)
        : at(
            C.blending,
            C.blendEquation,
            C.blendSrc,
            C.blendDst,
            C.blendEquationAlpha,
            C.blendSrcAlpha,
            C.blendDstAlpha,
            C.blendColor,
            C.blendAlpha,
            C.premultipliedAlpha,
          ),
      a.setFunc(C.depthFunc),
      a.setTest(C.depthTest),
      a.setMask(C.depthWrite),
      r.setMask(C.colorWrite));
    const pe = C.stencilWrite;
    (o.setTest(pe),
      pe &&
        (o.setMask(C.stencilWriteMask),
        o.setFunc(C.stencilFunc, C.stencilRef, C.stencilFuncMask),
        o.setOp(C.stencilFail, C.stencilZFail, C.stencilZPass)),
      I(C.polygonOffset, C.polygonOffsetFactor, C.polygonOffsetUnits),
      C.alphaToCoverage === !0 ? ie(i.SAMPLE_ALPHA_TO_COVERAGE) : Ae(i.SAMPLE_ALPHA_TO_COVERAGE));
  }
  function _t(C) {
    w !== C && (C ? i.frontFace(i.CW) : i.frontFace(i.CCW), (w = C));
  }
  function lt(C) {
    (C !== Xc
      ? (ie(i.CULL_FACE),
        C !== N && (C === Eo ? i.cullFace(i.BACK) : C === qc ? i.cullFace(i.FRONT) : i.cullFace(i.FRONT_AND_BACK)))
      : Ae(i.CULL_FACE),
      (N = C));
  }
  function Dt(C) {
    C !== H && (G && i.lineWidth(C), (H = C));
  }
  function I(C, ne, q) {
    C
      ? (ie(i.POLYGON_OFFSET_FILL),
        (W !== ne || U !== q) && ((W = ne), (U = q), a.getReversed() && (ne = -ne), i.polygonOffset(ne, q)))
      : Ae(i.POLYGON_OFFSET_FILL);
  }
  function xt(C) {
    C ? ie(i.SCISSOR_TEST) : Ae(i.SCISSOR_TEST);
  }
  function ke(C) {
    (C === void 0 && (C = i.TEXTURE0 + V - 1), ce !== C && (i.activeTexture(C), (ce = C)));
  }
  function st(C, ne, q) {
    q === void 0 && (ce === null ? (q = i.TEXTURE0 + V - 1) : (q = ce));
    let pe = ve[q];
    (pe === void 0 && ((pe = { type: void 0, texture: void 0 }), (ve[q] = pe)),
      (pe.type !== C || pe.texture !== ne) &&
        (ce !== q && (i.activeTexture(q), (ce = q)), i.bindTexture(C, ne || de[C]), (pe.type = C), (pe.texture = ne)));
  }
  function oe() {
    const C = ve[ce];
    C !== void 0 && C.type !== void 0 && (i.bindTexture(C.type, null), (C.type = void 0), (C.texture = void 0));
  }
  function ht() {
    try {
      i.compressedTexImage2D(...arguments);
    } catch (C) {
      Te("WebGLState:", C);
    }
  }
  function y() {
    try {
      i.compressedTexImage3D(...arguments);
    } catch (C) {
      Te("WebGLState:", C);
    }
  }
  function _() {
    try {
      i.texSubImage2D(...arguments);
    } catch (C) {
      Te("WebGLState:", C);
    }
  }
  function O() {
    try {
      i.texSubImage3D(...arguments);
    } catch (C) {
      Te("WebGLState:", C);
    }
  }
  function Y() {
    try {
      i.compressedTexSubImage2D(...arguments);
    } catch (C) {
      Te("WebGLState:", C);
    }
  }
  function $() {
    try {
      i.compressedTexSubImage3D(...arguments);
    } catch (C) {
      Te("WebGLState:", C);
    }
  }
  function ee() {
    try {
      i.texStorage2D(...arguments);
    } catch (C) {
      Te("WebGLState:", C);
    }
  }
  function ae() {
    try {
      i.texStorage3D(...arguments);
    } catch (C) {
      Te("WebGLState:", C);
    }
  }
  function X() {
    try {
      i.texImage2D(...arguments);
    } catch (C) {
      Te("WebGLState:", C);
    }
  }
  function Z() {
    try {
      i.texImage3D(...arguments);
    } catch (C) {
      Te("WebGLState:", C);
    }
  }
  function fe(C) {
    return d[C] !== void 0 ? d[C] : i.getParameter(C);
  }
  function ge(C, ne) {
    d[C] !== ne && (i.pixelStorei(C, ne), (d[C] = ne));
  }
  function se(C) {
    $e.equals(C) === !1 && (i.scissor(C.x, C.y, C.z, C.w), $e.copy(C));
  }
  function te(C) {
    Ue.equals(C) === !1 && (i.viewport(C.x, C.y, C.z, C.w), Ue.copy(C));
  }
  function Re(C, ne) {
    let q = l.get(ne);
    q === void 0 && ((q = new WeakMap()), l.set(ne, q));
    let pe = q.get(C);
    pe === void 0 && ((pe = i.getUniformBlockIndex(ne, C.name)), q.set(C, pe));
  }
  function Ne(C, ne) {
    const pe = l.get(ne).get(C);
    c.get(ne) !== pe && (i.uniformBlockBinding(ne, pe, C.__bindingPointIndex), c.set(ne, pe));
  }
  function Ye() {
    (i.disable(i.BLEND),
      i.disable(i.CULL_FACE),
      i.disable(i.DEPTH_TEST),
      i.disable(i.POLYGON_OFFSET_FILL),
      i.disable(i.SCISSOR_TEST),
      i.disable(i.STENCIL_TEST),
      i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),
      i.blendEquation(i.FUNC_ADD),
      i.blendFunc(i.ONE, i.ZERO),
      i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO),
      i.blendColor(0, 0, 0, 0),
      i.colorMask(!0, !0, !0, !0),
      i.clearColor(0, 0, 0, 0),
      i.depthMask(!0),
      i.depthFunc(i.LESS),
      a.setReversed(!1),
      i.clearDepth(1),
      i.stencilMask(4294967295),
      i.stencilFunc(i.ALWAYS, 0, 4294967295),
      i.stencilOp(i.KEEP, i.KEEP, i.KEEP),
      i.clearStencil(0),
      i.cullFace(i.BACK),
      i.frontFace(i.CCW),
      i.polygonOffset(0, 0),
      i.activeTexture(i.TEXTURE0),
      i.bindFramebuffer(i.FRAMEBUFFER, null),
      i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null),
      i.bindFramebuffer(i.READ_FRAMEBUFFER, null),
      i.useProgram(null),
      i.lineWidth(1),
      i.scissor(0, 0, i.canvas.width, i.canvas.height),
      i.viewport(0, 0, i.canvas.width, i.canvas.height),
      i.pixelStorei(i.PACK_ALIGNMENT, 4),
      i.pixelStorei(i.UNPACK_ALIGNMENT, 4),
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1),
      i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
      i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, i.BROWSER_DEFAULT_WEBGL),
      i.pixelStorei(i.PACK_ROW_LENGTH, 0),
      i.pixelStorei(i.PACK_SKIP_PIXELS, 0),
      i.pixelStorei(i.PACK_SKIP_ROWS, 0),
      i.pixelStorei(i.UNPACK_ROW_LENGTH, 0),
      i.pixelStorei(i.UNPACK_IMAGE_HEIGHT, 0),
      i.pixelStorei(i.UNPACK_SKIP_PIXELS, 0),
      i.pixelStorei(i.UNPACK_SKIP_ROWS, 0),
      i.pixelStorei(i.UNPACK_SKIP_IMAGES, 0),
      (u = {}),
      (d = {}),
      (ce = null),
      (ve = {}),
      (h = {}),
      (f = new WeakMap()),
      (g = []),
      (M = null),
      (m = !1),
      (p = null),
      (S = null),
      (E = null),
      (b = null),
      (R = null),
      (T = null),
      (P = null),
      (x = new Ce(0, 0, 0)),
      (A = 0),
      (L = !1),
      (w = null),
      (N = null),
      (H = null),
      (W = null),
      (U = null),
      $e.set(0, 0, i.canvas.width, i.canvas.height),
      Ue.set(0, 0, i.canvas.width, i.canvas.height),
      r.reset(),
      a.reset(),
      o.reset());
  }
  return {
    buffers: { color: r, depth: a, stencil: o },
    enable: ie,
    disable: Ae,
    bindFramebuffer: Pe,
    drawBuffers: we,
    useProgram: ot,
    setBlending: at,
    setMaterial: ze,
    setFlipSided: _t,
    setCullFace: lt,
    setLineWidth: Dt,
    setPolygonOffset: I,
    setScissorTest: xt,
    activeTexture: ke,
    bindTexture: st,
    unbindTexture: oe,
    compressedTexImage2D: ht,
    compressedTexImage3D: y,
    texImage2D: X,
    texImage3D: Z,
    pixelStorei: ge,
    getParameter: fe,
    updateUBOMapping: Re,
    uniformBlockBinding: Ne,
    texStorage2D: ee,
    texStorage3D: ae,
    texSubImage2D: _,
    texSubImage3D: O,
    compressedTexSubImage2D: Y,
    compressedTexSubImage3D: $,
    scissor: se,
    viewport: te,
    reset: Ye,
  };
}
function c_(i, e, t, n, s, r, a) {
  const o = e.has("WEBGL_multisampled_render_to_texture") ? e.get("WEBGL_multisampled_render_to_texture") : null,
    c = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent),
    l = new Ge(),
    u = new WeakMap(),
    d = new Set();
  let h;
  const f = new WeakMap();
  let g = !1;
  try {
    g = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {}
  function M(y, _) {
    return g ? new OffscreenCanvas(y, _) : Ji("canvas");
  }
  function m(y, _, O) {
    let Y = 1;
    const $ = ht(y);
    if ((($.width > O || $.height > O) && (Y = O / Math.max($.width, $.height)), Y < 1))
      if (
        (typeof HTMLImageElement < "u" && y instanceof HTMLImageElement) ||
        (typeof HTMLCanvasElement < "u" && y instanceof HTMLCanvasElement) ||
        (typeof ImageBitmap < "u" && y instanceof ImageBitmap) ||
        (typeof VideoFrame < "u" && y instanceof VideoFrame)
      ) {
        const ee = Math.floor(Y * $.width),
          ae = Math.floor(Y * $.height);
        h === void 0 && (h = M(ee, ae));
        const X = _ ? M(ee, ae) : h;
        return (
          (X.width = ee),
          (X.height = ae),
          X.getContext("2d").drawImage(y, 0, 0, ee, ae),
          xe(
            "WebGLRenderer: Texture has been resized from (" +
              $.width +
              "x" +
              $.height +
              ") to (" +
              ee +
              "x" +
              ae +
              ").",
          ),
          X
        );
      } else
        return (
          "data" in y && xe("WebGLRenderer: Image in DataTexture is too big (" + $.width + "x" + $.height + ")."),
          y
        );
    return y;
  }
  function p(y) {
    return y.generateMipmaps;
  }
  function S(y) {
    i.generateMipmap(y);
  }
  function E(y) {
    return y.isWebGLCubeRenderTarget
      ? i.TEXTURE_CUBE_MAP
      : y.isWebGL3DRenderTarget
        ? i.TEXTURE_3D
        : y.isWebGLArrayRenderTarget || y.isCompressedArrayTexture
          ? i.TEXTURE_2D_ARRAY
          : i.TEXTURE_2D;
  }
  function b(y, _, O, Y, $, ee = !1) {
    if (y !== null) {
      if (i[y] !== void 0) return i[y];
      xe("WebGLRenderer: Attempt to use non-existing WebGL internal format '" + y + "'");
    }
    let ae;
    Y &&
      ((ae = e.get("EXT_texture_norm16")),
      ae || xe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));
    let X = _;
    if (
      (_ === i.RED &&
        (O === i.FLOAT && (X = i.R32F),
        O === i.HALF_FLOAT && (X = i.R16F),
        O === i.UNSIGNED_BYTE && (X = i.R8),
        O === i.UNSIGNED_SHORT && ae && (X = ae.R16_EXT),
        O === i.SHORT && ae && (X = ae.R16_SNORM_EXT)),
      _ === i.RED_INTEGER &&
        (O === i.UNSIGNED_BYTE && (X = i.R8UI),
        O === i.UNSIGNED_SHORT && (X = i.R16UI),
        O === i.UNSIGNED_INT && (X = i.R32UI),
        O === i.BYTE && (X = i.R8I),
        O === i.SHORT && (X = i.R16I),
        O === i.INT && (X = i.R32I)),
      _ === i.RG &&
        (O === i.FLOAT && (X = i.RG32F),
        O === i.HALF_FLOAT && (X = i.RG16F),
        O === i.UNSIGNED_BYTE && (X = i.RG8),
        O === i.UNSIGNED_SHORT && ae && (X = ae.RG16_EXT),
        O === i.SHORT && ae && (X = ae.RG16_SNORM_EXT)),
      _ === i.RG_INTEGER &&
        (O === i.UNSIGNED_BYTE && (X = i.RG8UI),
        O === i.UNSIGNED_SHORT && (X = i.RG16UI),
        O === i.UNSIGNED_INT && (X = i.RG32UI),
        O === i.BYTE && (X = i.RG8I),
        O === i.SHORT && (X = i.RG16I),
        O === i.INT && (X = i.RG32I)),
      _ === i.RGB_INTEGER &&
        (O === i.UNSIGNED_BYTE && (X = i.RGB8UI),
        O === i.UNSIGNED_SHORT && (X = i.RGB16UI),
        O === i.UNSIGNED_INT && (X = i.RGB32UI),
        O === i.BYTE && (X = i.RGB8I),
        O === i.SHORT && (X = i.RGB16I),
        O === i.INT && (X = i.RGB32I)),
      _ === i.RGBA_INTEGER &&
        (O === i.UNSIGNED_BYTE && (X = i.RGBA8UI),
        O === i.UNSIGNED_SHORT && (X = i.RGBA16UI),
        O === i.UNSIGNED_INT && (X = i.RGBA32UI),
        O === i.BYTE && (X = i.RGBA8I),
        O === i.SHORT && (X = i.RGBA16I),
        O === i.INT && (X = i.RGBA32I)),
      _ === i.RGB &&
        (O === i.UNSIGNED_SHORT && ae && (X = ae.RGB16_EXT),
        O === i.SHORT && ae && (X = ae.RGB16_SNORM_EXT),
        O === i.UNSIGNED_INT_5_9_9_9_REV && (X = i.RGB9_E5),
        O === i.UNSIGNED_INT_10F_11F_11F_REV && (X = i.R11F_G11F_B10F)),
      _ === i.RGBA)
    ) {
      const Z = ee ? js : We.getTransfer($);
      (O === i.FLOAT && (X = i.RGBA32F),
        O === i.HALF_FLOAT && (X = i.RGBA16F),
        O === i.UNSIGNED_BYTE && (X = Z === Ze ? i.SRGB8_ALPHA8 : i.RGBA8),
        O === i.UNSIGNED_SHORT && ae && (X = ae.RGBA16_EXT),
        O === i.SHORT && ae && (X = ae.RGBA16_SNORM_EXT),
        O === i.UNSIGNED_SHORT_4_4_4_4 && (X = i.RGBA4),
        O === i.UNSIGNED_SHORT_5_5_5_1 && (X = i.RGB5_A1));
    }
    return (
      (X === i.R16F || X === i.R32F || X === i.RG16F || X === i.RG32F || X === i.RGBA16F || X === i.RGBA32F) &&
        e.get("EXT_color_buffer_float"),
      X
    );
  }
  function R(y, _) {
    let O;
    return (
      y
        ? _ === null || _ === hn || _ === Ki
          ? (O = i.DEPTH24_STENCIL8)
          : _ === Gt
            ? (O = i.DEPTH32F_STENCIL8)
            : _ === Zi &&
              ((O = i.DEPTH24_STENCIL8),
              xe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment."))
        : _ === null || _ === hn || _ === Ki
          ? (O = i.DEPTH_COMPONENT24)
          : _ === Gt
            ? (O = i.DEPTH_COMPONENT32F)
            : _ === Zi && (O = i.DEPTH_COMPONENT16),
      O
    );
  }
  function T(y, _) {
    return p(y) === !0 || (y.isFramebufferTexture && y.minFilter !== Et && y.minFilter !== vt)
      ? Math.log2(Math.max(_.width, _.height)) + 1
      : y.mipmaps !== void 0 && y.mipmaps.length > 0
        ? y.mipmaps.length
        : y.isCompressedTexture && Array.isArray(y.image)
          ? _.mipmaps.length
          : 1;
  }
  function P(y) {
    const _ = y.target;
    (_.removeEventListener("dispose", P), A(_), _.isVideoTexture && u.delete(_), _.isHTMLTexture && d.delete(_));
  }
  function x(y) {
    const _ = y.target;
    (_.removeEventListener("dispose", x), w(_));
  }
  function A(y) {
    const _ = n.get(y);
    if (_.__webglInit === void 0) return;
    const O = y.source,
      Y = f.get(O);
    if (Y) {
      const $ = Y[_.__cacheKey];
      ($.usedTimes--, $.usedTimes === 0 && L(y), Object.keys(Y).length === 0 && f.delete(O));
    }
    n.remove(y);
  }
  function L(y) {
    const _ = n.get(y);
    i.deleteTexture(_.__webglTexture);
    const O = y.source,
      Y = f.get(O);
    (delete Y[_.__cacheKey], a.memory.textures--);
  }
  function w(y) {
    const _ = n.get(y);
    if ((y.depthTexture && (y.depthTexture.dispose(), n.remove(y.depthTexture)), y.isWebGLCubeRenderTarget))
      for (let Y = 0; Y < 6; Y++) {
        if (Array.isArray(_.__webglFramebuffer[Y]))
          for (let $ = 0; $ < _.__webglFramebuffer[Y].length; $++) i.deleteFramebuffer(_.__webglFramebuffer[Y][$]);
        else i.deleteFramebuffer(_.__webglFramebuffer[Y]);
        _.__webglDepthbuffer && i.deleteRenderbuffer(_.__webglDepthbuffer[Y]);
      }
    else {
      if (Array.isArray(_.__webglFramebuffer))
        for (let Y = 0; Y < _.__webglFramebuffer.length; Y++) i.deleteFramebuffer(_.__webglFramebuffer[Y]);
      else i.deleteFramebuffer(_.__webglFramebuffer);
      if (
        (_.__webglDepthbuffer && i.deleteRenderbuffer(_.__webglDepthbuffer),
        _.__webglMultisampledFramebuffer && i.deleteFramebuffer(_.__webglMultisampledFramebuffer),
        _.__webglColorRenderbuffer)
      )
        for (let Y = 0; Y < _.__webglColorRenderbuffer.length; Y++)
          _.__webglColorRenderbuffer[Y] && i.deleteRenderbuffer(_.__webglColorRenderbuffer[Y]);
      _.__webglDepthRenderbuffer && i.deleteRenderbuffer(_.__webglDepthRenderbuffer);
    }
    const O = y.textures;
    for (let Y = 0, $ = O.length; Y < $; Y++) {
      const ee = n.get(O[Y]);
      (ee.__webglTexture && (i.deleteTexture(ee.__webglTexture), a.memory.textures--), n.remove(O[Y]));
    }
    n.remove(y);
  }
  let N = 0;
  function H() {
    N = 0;
  }
  function W() {
    return N;
  }
  function U(y) {
    N = y;
  }
  function V() {
    const y = N;
    return (
      y >= s.maxTextures &&
        xe("WebGLTextures: Trying to use " + y + " texture units while this GPU supports only " + s.maxTextures),
      (N += 1),
      y
    );
  }
  function G(y) {
    const _ = [];
    return (
      _.push(y.wrapS),
      _.push(y.wrapT),
      _.push(y.wrapR || 0),
      _.push(y.magFilter),
      _.push(y.minFilter),
      _.push(y.anisotropy),
      _.push(y.internalFormat),
      _.push(y.format),
      _.push(y.type),
      _.push(y.generateMipmaps),
      _.push(y.premultiplyAlpha),
      _.push(y.flipY),
      _.push(y.unpackAlignment),
      _.push(y.colorSpace),
      _.join()
    );
  }
  function J(y, _) {
    const O = n.get(y);
    if (
      (y.isVideoTexture && st(y),
      y.isRenderTargetTexture === !1 && y.isExternalTexture !== !0 && y.version > 0 && O.__version !== y.version)
    ) {
      const Y = y.image;
      if (Y === null) xe("WebGLRenderer: Texture marked for update but no image data found.");
      else if (Y.complete === !1) xe("WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        Ae(O, y, _);
        return;
      }
    } else y.isExternalTexture && (O.__webglTexture = y.sourceTexture ? y.sourceTexture : null);
    t.bindTexture(i.TEXTURE_2D, O.__webglTexture, i.TEXTURE0 + _);
  }
  function Q(y, _) {
    const O = n.get(y);
    if (y.isRenderTargetTexture === !1 && y.version > 0 && O.__version !== y.version) {
      Ae(O, y, _);
      return;
    } else y.isExternalTexture && (O.__webglTexture = y.sourceTexture ? y.sourceTexture : null);
    t.bindTexture(i.TEXTURE_2D_ARRAY, O.__webglTexture, i.TEXTURE0 + _);
  }
  function ce(y, _) {
    const O = n.get(y);
    if (y.isRenderTargetTexture === !1 && y.version > 0 && O.__version !== y.version) {
      Ae(O, y, _);
      return;
    }
    t.bindTexture(i.TEXTURE_3D, O.__webglTexture, i.TEXTURE0 + _);
  }
  function ve(y, _) {
    const O = n.get(y);
    if (y.isCubeDepthTexture !== !0 && y.version > 0 && O.__version !== y.version) {
      Pe(O, y, _);
      return;
    }
    t.bindTexture(i.TEXTURE_CUBE_MAP, O.__webglTexture, i.TEXTURE0 + _);
  }
  const be = { [ra]: i.REPEAT, [$t]: i.CLAMP_TO_EDGE, [aa]: i.MIRRORED_REPEAT },
    Xe = {
      [Et]: i.NEAREST,
      [mh]: i.NEAREST_MIPMAP_NEAREST,
      [os]: i.NEAREST_MIPMAP_LINEAR,
      [vt]: i.LINEAR,
      [mr]: i.LINEAR_MIPMAP_NEAREST,
      [zn]: i.LINEAR_MIPMAP_LINEAR,
    },
    $e = {
      [yh]: i.NEVER,
      [wh]: i.ALWAYS,
      [bh]: i.LESS,
      [eo]: i.LEQUAL,
      [Eh]: i.EQUAL,
      [to]: i.GEQUAL,
      [Th]: i.GREATER,
      [Ah]: i.NOTEQUAL,
    };
  function Ue(y, _) {
    if (
      (_.type === Gt &&
        e.has("OES_texture_float_linear") === !1 &&
        (_.magFilter === vt ||
          _.magFilter === mr ||
          _.magFilter === os ||
          _.magFilter === zn ||
          _.minFilter === vt ||
          _.minFilter === mr ||
          _.minFilter === os ||
          _.minFilter === zn) &&
        xe(
          "WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.",
        ),
      i.texParameteri(y, i.TEXTURE_WRAP_S, be[_.wrapS]),
      i.texParameteri(y, i.TEXTURE_WRAP_T, be[_.wrapT]),
      (y === i.TEXTURE_3D || y === i.TEXTURE_2D_ARRAY) && i.texParameteri(y, i.TEXTURE_WRAP_R, be[_.wrapR]),
      i.texParameteri(y, i.TEXTURE_MAG_FILTER, Xe[_.magFilter]),
      i.texParameteri(y, i.TEXTURE_MIN_FILTER, Xe[_.minFilter]),
      _.compareFunction &&
        (i.texParameteri(y, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE),
        i.texParameteri(y, i.TEXTURE_COMPARE_FUNC, $e[_.compareFunction])),
      e.has("EXT_texture_filter_anisotropic") === !0)
    ) {
      if (
        _.magFilter === Et ||
        (_.minFilter !== os && _.minFilter !== zn) ||
        (_.type === Gt && e.has("OES_texture_float_linear") === !1)
      )
        return;
      if (_.anisotropy > 1 || n.get(_).__currentAnisotropy) {
        const O = e.get("EXT_texture_filter_anisotropic");
        (i.texParameterf(y, O.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(_.anisotropy, s.getMaxAnisotropy())),
          (n.get(_).__currentAnisotropy = _.anisotropy));
      }
    }
  }
  function K(y, _) {
    let O = !1;
    y.__webglInit === void 0 && ((y.__webglInit = !0), _.addEventListener("dispose", P));
    const Y = _.source;
    let $ = f.get(Y);
    $ === void 0 && (($ = {}), f.set(Y, $));
    const ee = G(_);
    if (ee !== y.__cacheKey) {
      ($[ee] === void 0 && (($[ee] = { texture: i.createTexture(), usedTimes: 0 }), a.memory.textures++, (O = !0)),
        $[ee].usedTimes++);
      const ae = $[y.__cacheKey];
      (ae !== void 0 && ($[y.__cacheKey].usedTimes--, ae.usedTimes === 0 && L(_)),
        (y.__cacheKey = ee),
        (y.__webglTexture = $[ee].texture));
    }
    return O;
  }
  function de(y, _, O) {
    return Math.floor(Math.floor(y / O) / _);
  }
  function ie(y, _, O, Y) {
    const ee = y.updateRanges;
    if (ee.length === 0) t.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, _.width, _.height, O, Y, _.data);
    else {
      ee.sort((ge, se) => ge.start - se.start);
      let ae = 0;
      for (let ge = 1; ge < ee.length; ge++) {
        const se = ee[ae],
          te = ee[ge],
          Re = se.start + se.count,
          Ne = de(te.start, _.width, 4),
          Ye = de(se.start, _.width, 4);
        te.start <= Re + 1 && Ne === Ye && de(te.start + te.count - 1, _.width, 4) === Ne
          ? (se.count = Math.max(se.count, te.start + te.count - se.start))
          : (++ae, (ee[ae] = te));
      }
      ee.length = ae + 1;
      const X = t.getParameter(i.UNPACK_ROW_LENGTH),
        Z = t.getParameter(i.UNPACK_SKIP_PIXELS),
        fe = t.getParameter(i.UNPACK_SKIP_ROWS);
      t.pixelStorei(i.UNPACK_ROW_LENGTH, _.width);
      for (let ge = 0, se = ee.length; ge < se; ge++) {
        const te = ee[ge],
          Re = Math.floor(te.start / 4),
          Ne = Math.ceil(te.count / 4),
          Ye = Re % _.width,
          C = Math.floor(Re / _.width),
          ne = Ne,
          q = 1;
        (t.pixelStorei(i.UNPACK_SKIP_PIXELS, Ye),
          t.pixelStorei(i.UNPACK_SKIP_ROWS, C),
          t.texSubImage2D(i.TEXTURE_2D, 0, Ye, C, ne, q, O, Y, _.data));
      }
      (y.clearUpdateRanges(),
        t.pixelStorei(i.UNPACK_ROW_LENGTH, X),
        t.pixelStorei(i.UNPACK_SKIP_PIXELS, Z),
        t.pixelStorei(i.UNPACK_SKIP_ROWS, fe));
    }
  }
  function Ae(y, _, O) {
    let Y = i.TEXTURE_2D;
    ((_.isDataArrayTexture || _.isCompressedArrayTexture) && (Y = i.TEXTURE_2D_ARRAY),
      _.isData3DTexture && (Y = i.TEXTURE_3D));
    const $ = K(y, _),
      ee = _.source;
    t.bindTexture(Y, y.__webglTexture, i.TEXTURE0 + O);
    const ae = n.get(ee);
    if (ee.version !== ae.__version || $ === !0) {
      if ((t.activeTexture(i.TEXTURE0 + O), (typeof ImageBitmap < "u" && _.image instanceof ImageBitmap) === !1)) {
        const q = We.getPrimaries(We.workingColorSpace),
          pe = _.colorSpace === Bn ? null : We.getPrimaries(_.colorSpace),
          re = _.colorSpace === Bn || q === pe ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
        (t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, _.flipY),
          t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, _.premultiplyAlpha),
          t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, re));
      }
      t.pixelStorei(i.UNPACK_ALIGNMENT, _.unpackAlignment);
      let Z = m(_.image, !1, s.maxTextureSize);
      Z = oe(_, Z);
      const fe = r.convert(_.format, _.colorSpace),
        ge = r.convert(_.type);
      let se = b(_.internalFormat, fe, ge, _.normalized, _.colorSpace, _.isVideoTexture);
      Ue(Y, _);
      let te;
      const Re = _.mipmaps,
        Ne = _.isVideoTexture !== !0,
        Ye = ae.__version === void 0 || $ === !0,
        C = ee.dataReady,
        ne = T(_, Z);
      if (_.isDepthTexture)
        ((se = R(_.format === $n, _.type)),
          Ye &&
            (Ne
              ? t.texStorage2D(i.TEXTURE_2D, 1, se, Z.width, Z.height)
              : t.texImage2D(i.TEXTURE_2D, 0, se, Z.width, Z.height, 0, fe, ge, null)));
      else if (_.isDataTexture)
        if (Re.length > 0) {
          Ne && Ye && t.texStorage2D(i.TEXTURE_2D, ne, se, Re[0].width, Re[0].height);
          for (let q = 0, pe = Re.length; q < pe; q++)
            ((te = Re[q]),
              Ne
                ? C && t.texSubImage2D(i.TEXTURE_2D, q, 0, 0, te.width, te.height, fe, ge, te.data)
                : t.texImage2D(i.TEXTURE_2D, q, se, te.width, te.height, 0, fe, ge, te.data));
          _.generateMipmaps = !1;
        } else
          Ne
            ? (Ye && t.texStorage2D(i.TEXTURE_2D, ne, se, Z.width, Z.height), C && ie(_, Z, fe, ge))
            : t.texImage2D(i.TEXTURE_2D, 0, se, Z.width, Z.height, 0, fe, ge, Z.data);
      else if (_.isCompressedTexture)
        if (_.isCompressedArrayTexture) {
          Ne && Ye && t.texStorage3D(i.TEXTURE_2D_ARRAY, ne, se, Re[0].width, Re[0].height, Z.depth);
          for (let q = 0, pe = Re.length; q < pe; q++)
            if (((te = Re[q]), _.format !== Ht))
              if (fe !== null)
                if (Ne) {
                  if (C)
                    if (_.layerUpdates.size > 0) {
                      const re = Ml(te.width, te.height, _.format, _.type);
                      for (const j of _.layerUpdates) {
                        const Se = te.data.subarray(
                          (j * re) / te.data.BYTES_PER_ELEMENT,
                          ((j + 1) * re) / te.data.BYTES_PER_ELEMENT,
                        );
                        t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, q, 0, 0, j, te.width, te.height, 1, fe, Se);
                      }
                      _.clearLayerUpdates();
                    } else
                      t.compressedTexSubImage3D(
                        i.TEXTURE_2D_ARRAY,
                        q,
                        0,
                        0,
                        0,
                        te.width,
                        te.height,
                        Z.depth,
                        fe,
                        te.data,
                      );
                } else
                  t.compressedTexImage3D(i.TEXTURE_2D_ARRAY, q, se, te.width, te.height, Z.depth, 0, te.data, 0, 0);
              else xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
            else
              Ne
                ? C && t.texSubImage3D(i.TEXTURE_2D_ARRAY, q, 0, 0, 0, te.width, te.height, Z.depth, fe, ge, te.data)
                : t.texImage3D(i.TEXTURE_2D_ARRAY, q, se, te.width, te.height, Z.depth, 0, fe, ge, te.data);
        } else {
          Ne && Ye && t.texStorage2D(i.TEXTURE_2D, ne, se, Re[0].width, Re[0].height);
          for (let q = 0, pe = Re.length; q < pe; q++)
            ((te = Re[q]),
              _.format !== Ht
                ? fe !== null
                  ? Ne
                    ? C && t.compressedTexSubImage2D(i.TEXTURE_2D, q, 0, 0, te.width, te.height, fe, te.data)
                    : t.compressedTexImage2D(i.TEXTURE_2D, q, se, te.width, te.height, 0, te.data)
                  : xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()")
                : Ne
                  ? C && t.texSubImage2D(i.TEXTURE_2D, q, 0, 0, te.width, te.height, fe, ge, te.data)
                  : t.texImage2D(i.TEXTURE_2D, q, se, te.width, te.height, 0, fe, ge, te.data));
        }
      else if (_.isDataArrayTexture)
        if (Ne) {
          if ((Ye && t.texStorage3D(i.TEXTURE_2D_ARRAY, ne, se, Z.width, Z.height, Z.depth), C))
            if (_.layerUpdates.size > 0) {
              const q = Ml(Z.width, Z.height, _.format, _.type);
              for (const pe of _.layerUpdates) {
                const re = Z.data.subarray(
                  (pe * q) / Z.data.BYTES_PER_ELEMENT,
                  ((pe + 1) * q) / Z.data.BYTES_PER_ELEMENT,
                );
                t.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, pe, Z.width, Z.height, 1, fe, ge, re);
              }
              _.clearLayerUpdates();
            } else t.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, 0, Z.width, Z.height, Z.depth, fe, ge, Z.data);
        } else t.texImage3D(i.TEXTURE_2D_ARRAY, 0, se, Z.width, Z.height, Z.depth, 0, fe, ge, Z.data);
      else if (_.isData3DTexture)
        Ne
          ? (Ye && t.texStorage3D(i.TEXTURE_3D, ne, se, Z.width, Z.height, Z.depth),
            C && t.texSubImage3D(i.TEXTURE_3D, 0, 0, 0, 0, Z.width, Z.height, Z.depth, fe, ge, Z.data))
          : t.texImage3D(i.TEXTURE_3D, 0, se, Z.width, Z.height, Z.depth, 0, fe, ge, Z.data);
      else if (_.isFramebufferTexture) {
        if (Ye)
          if (Ne) t.texStorage2D(i.TEXTURE_2D, ne, se, Z.width, Z.height);
          else {
            let q = Z.width,
              pe = Z.height;
            for (let re = 0; re < ne; re++)
              (t.texImage2D(i.TEXTURE_2D, re, se, q, pe, 0, fe, ge, null), (q >>= 1), (pe >>= 1));
          }
      } else if (_.isHTMLTexture) {
        if ("texElementImage2D" in i) {
          const q = i.canvas;
          if ((q.hasAttribute("layoutsubtree") || q.setAttribute("layoutsubtree", "true"), Z.parentNode !== q)) {
            (q.appendChild(Z),
              d.add(_),
              (q.onpaint = (Le) => {
                const ft = Le.changedElements;
                for (const Qe of d) ft.includes(Qe.image) && (Qe.needsUpdate = !0);
              }),
              q.requestPaint());
            return;
          }
          const pe = 0,
            re = i.RGBA,
            j = i.RGBA,
            Se = i.UNSIGNED_BYTE;
          (i.texElementImage2D(i.TEXTURE_2D, pe, re, j, Se, Z),
            i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, i.LINEAR),
            i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE),
            i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE));
        }
      } else if (Re.length > 0) {
        if (Ne && Ye) {
          const q = ht(Re[0]);
          t.texStorage2D(i.TEXTURE_2D, ne, se, q.width, q.height);
        }
        for (let q = 0, pe = Re.length; q < pe; q++)
          ((te = Re[q]),
            Ne
              ? C && t.texSubImage2D(i.TEXTURE_2D, q, 0, 0, fe, ge, te)
              : t.texImage2D(i.TEXTURE_2D, q, se, fe, ge, te));
        _.generateMipmaps = !1;
      } else if (Ne) {
        if (Ye) {
          const q = ht(Z);
          t.texStorage2D(i.TEXTURE_2D, ne, se, q.width, q.height);
        }
        C && t.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, fe, ge, Z);
      } else t.texImage2D(i.TEXTURE_2D, 0, se, fe, ge, Z);
      (p(_) && S(Y), (ae.__version = ee.version), _.onUpdate && _.onUpdate(_));
    }
    y.__version = _.version;
  }
  function Pe(y, _, O) {
    if (_.image.length !== 6) return;
    const Y = K(y, _),
      $ = _.source;
    t.bindTexture(i.TEXTURE_CUBE_MAP, y.__webglTexture, i.TEXTURE0 + O);
    const ee = n.get($);
    if ($.version !== ee.__version || Y === !0) {
      t.activeTexture(i.TEXTURE0 + O);
      const ae = We.getPrimaries(We.workingColorSpace),
        X = _.colorSpace === Bn ? null : We.getPrimaries(_.colorSpace),
        Z = _.colorSpace === Bn || ae === X ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      (t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, _.flipY),
        t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, _.premultiplyAlpha),
        t.pixelStorei(i.UNPACK_ALIGNMENT, _.unpackAlignment),
        t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, Z));
      const fe = _.isCompressedTexture || _.image[0].isCompressedTexture,
        ge = _.image[0] && _.image[0].isDataTexture,
        se = [];
      for (let j = 0; j < 6; j++)
        (!fe && !ge ? (se[j] = m(_.image[j], !0, s.maxCubemapSize)) : (se[j] = ge ? _.image[j].image : _.image[j]),
          (se[j] = oe(_, se[j])));
      const te = se[0],
        Re = r.convert(_.format, _.colorSpace),
        Ne = r.convert(_.type),
        Ye = b(_.internalFormat, Re, Ne, _.normalized, _.colorSpace),
        C = _.isVideoTexture !== !0,
        ne = ee.__version === void 0 || Y === !0,
        q = $.dataReady;
      let pe = T(_, te);
      Ue(i.TEXTURE_CUBE_MAP, _);
      let re;
      if (fe) {
        C && ne && t.texStorage2D(i.TEXTURE_CUBE_MAP, pe, Ye, te.width, te.height);
        for (let j = 0; j < 6; j++) {
          re = se[j].mipmaps;
          for (let Se = 0; Se < re.length; Se++) {
            const Le = re[Se];
            _.format !== Ht
              ? Re !== null
                ? C
                  ? q &&
                    t.compressedTexSubImage2D(
                      i.TEXTURE_CUBE_MAP_POSITIVE_X + j,
                      Se,
                      0,
                      0,
                      Le.width,
                      Le.height,
                      Re,
                      Le.data,
                    )
                  : t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, Se, Ye, Le.width, Le.height, 0, Le.data)
                : xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()")
              : C
                ? q &&
                  t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, Se, 0, 0, Le.width, Le.height, Re, Ne, Le.data)
                : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, Se, Ye, Le.width, Le.height, 0, Re, Ne, Le.data);
          }
        }
      } else {
        if (((re = _.mipmaps), C && ne)) {
          re.length > 0 && pe++;
          const j = ht(se[0]);
          t.texStorage2D(i.TEXTURE_CUBE_MAP, pe, Ye, j.width, j.height);
        }
        for (let j = 0; j < 6; j++)
          if (ge) {
            C
              ? q &&
                t.texSubImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + j,
                  0,
                  0,
                  0,
                  se[j].width,
                  se[j].height,
                  Re,
                  Ne,
                  se[j].data,
                )
              : t.texImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + j,
                  0,
                  Ye,
                  se[j].width,
                  se[j].height,
                  0,
                  Re,
                  Ne,
                  se[j].data,
                );
            for (let Se = 0; Se < re.length; Se++) {
              const ft = re[Se].image[j].image;
              C
                ? q &&
                  t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, Se + 1, 0, 0, ft.width, ft.height, Re, Ne, ft.data)
                : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, Se + 1, Ye, ft.width, ft.height, 0, Re, Ne, ft.data);
            }
          } else {
            C
              ? q && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, 0, 0, Re, Ne, se[j])
              : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, 0, Ye, Re, Ne, se[j]);
            for (let Se = 0; Se < re.length; Se++) {
              const Le = re[Se];
              C
                ? q && t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, Se + 1, 0, 0, Re, Ne, Le.image[j])
                : t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + j, Se + 1, Ye, Re, Ne, Le.image[j]);
            }
          }
      }
      (p(_) && S(i.TEXTURE_CUBE_MAP), (ee.__version = $.version), _.onUpdate && _.onUpdate(_));
    }
    y.__version = _.version;
  }
  function we(y, _, O, Y, $, ee) {
    const ae = r.convert(O.format, O.colorSpace),
      X = r.convert(O.type),
      Z = b(O.internalFormat, ae, X, O.normalized, O.colorSpace),
      fe = n.get(_),
      ge = n.get(O);
    if (((ge.__renderTarget = _), !fe.__hasExternalTextures)) {
      const se = Math.max(1, _.width >> ee),
        te = Math.max(1, _.height >> ee);
      $ === i.TEXTURE_3D || $ === i.TEXTURE_2D_ARRAY
        ? t.texImage3D($, ee, Z, se, te, _.depth, 0, ae, X, null)
        : t.texImage2D($, ee, Z, se, te, 0, ae, X, null);
    }
    (t.bindFramebuffer(i.FRAMEBUFFER, y),
      ke(_)
        ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, Y, $, ge.__webglTexture, 0, xt(_))
        : ($ === i.TEXTURE_2D || ($ >= i.TEXTURE_CUBE_MAP_POSITIVE_X && $ <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z)) &&
          i.framebufferTexture2D(i.FRAMEBUFFER, Y, $, ge.__webglTexture, ee),
      t.bindFramebuffer(i.FRAMEBUFFER, null));
  }
  function ot(y, _, O) {
    if ((i.bindRenderbuffer(i.RENDERBUFFER, y), _.depthBuffer)) {
      const Y = _.depthTexture,
        $ = Y && Y.isDepthTexture ? Y.type : null,
        ee = R(_.stencilBuffer, $),
        ae = _.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
      (ke(_)
        ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, xt(_), ee, _.width, _.height)
        : O
          ? i.renderbufferStorageMultisample(i.RENDERBUFFER, xt(_), ee, _.width, _.height)
          : i.renderbufferStorage(i.RENDERBUFFER, ee, _.width, _.height),
        i.framebufferRenderbuffer(i.FRAMEBUFFER, ae, i.RENDERBUFFER, y));
    } else {
      const Y = _.textures;
      for (let $ = 0; $ < Y.length; $++) {
        const ee = Y[$],
          ae = r.convert(ee.format, ee.colorSpace),
          X = r.convert(ee.type),
          Z = b(ee.internalFormat, ae, X, ee.normalized, ee.colorSpace);
        ke(_)
          ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, xt(_), Z, _.width, _.height)
          : O
            ? i.renderbufferStorageMultisample(i.RENDERBUFFER, xt(_), Z, _.width, _.height)
            : i.renderbufferStorage(i.RENDERBUFFER, Z, _.width, _.height);
      }
    }
    i.bindRenderbuffer(i.RENDERBUFFER, null);
  }
  function Ve(y, _, O) {
    const Y = _.isWebGLCubeRenderTarget === !0;
    if ((t.bindFramebuffer(i.FRAMEBUFFER, y), !(_.depthTexture && _.depthTexture.isDepthTexture)))
      throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
    const $ = n.get(_.depthTexture);
    if (
      (($.__renderTarget = _),
      (!$.__webglTexture || _.depthTexture.image.width !== _.width || _.depthTexture.image.height !== _.height) &&
        ((_.depthTexture.image.width = _.width),
        (_.depthTexture.image.height = _.height),
        (_.depthTexture.needsUpdate = !0)),
      Y)
    ) {
      if (
        ($.__webglInit === void 0 && (($.__webglInit = !0), _.depthTexture.addEventListener("dispose", P)),
        $.__webglTexture === void 0)
      ) {
        (($.__webglTexture = i.createTexture()),
          t.bindTexture(i.TEXTURE_CUBE_MAP, $.__webglTexture),
          Ue(i.TEXTURE_CUBE_MAP, _.depthTexture));
        const fe = r.convert(_.depthTexture.format),
          ge = r.convert(_.depthTexture.type);
        let se;
        _.depthTexture.format === Tn
          ? (se = i.DEPTH_COMPONENT24)
          : _.depthTexture.format === $n && (se = i.DEPTH24_STENCIL8);
        for (let te = 0; te < 6; te++)
          i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + te, 0, se, _.width, _.height, 0, fe, ge, null);
      }
    } else J(_.depthTexture, 0);
    const ee = $.__webglTexture,
      ae = xt(_),
      X = Y ? i.TEXTURE_CUBE_MAP_POSITIVE_X + O : i.TEXTURE_2D,
      Z = _.depthTexture.format === $n ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
    if (_.depthTexture.format === Tn)
      ke(_)
        ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, Z, X, ee, 0, ae)
        : i.framebufferTexture2D(i.FRAMEBUFFER, Z, X, ee, 0);
    else if (_.depthTexture.format === $n)
      ke(_)
        ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, Z, X, ee, 0, ae)
        : i.framebufferTexture2D(i.FRAMEBUFFER, Z, X, ee, 0);
    else throw new Error("Unknown depthTexture format");
  }
  function Je(y) {
    const _ = n.get(y),
      O = y.isWebGLCubeRenderTarget === !0;
    if (_.__boundDepthTexture !== y.depthTexture) {
      const Y = y.depthTexture;
      if ((_.__depthDisposeCallback && _.__depthDisposeCallback(), Y)) {
        const $ = () => {
          (delete _.__boundDepthTexture, delete _.__depthDisposeCallback, Y.removeEventListener("dispose", $));
        };
        (Y.addEventListener("dispose", $), (_.__depthDisposeCallback = $));
      }
      _.__boundDepthTexture = Y;
    }
    if (y.depthTexture && !_.__autoAllocateDepthBuffer)
      if (O) for (let Y = 0; Y < 6; Y++) Ve(_.__webglFramebuffer[Y], y, Y);
      else {
        const Y = y.texture.mipmaps;
        Y && Y.length > 0 ? Ve(_.__webglFramebuffer[0], y, 0) : Ve(_.__webglFramebuffer, y, 0);
      }
    else if (O) {
      _.__webglDepthbuffer = [];
      for (let Y = 0; Y < 6; Y++)
        if ((t.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer[Y]), _.__webglDepthbuffer[Y] === void 0))
          ((_.__webglDepthbuffer[Y] = i.createRenderbuffer()), ot(_.__webglDepthbuffer[Y], y, !1));
        else {
          const $ = y.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT,
            ee = _.__webglDepthbuffer[Y];
          (i.bindRenderbuffer(i.RENDERBUFFER, ee), i.framebufferRenderbuffer(i.FRAMEBUFFER, $, i.RENDERBUFFER, ee));
        }
    } else {
      const Y = y.texture.mipmaps;
      if (
        (Y && Y.length > 0
          ? t.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer[0])
          : t.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer),
        _.__webglDepthbuffer === void 0)
      )
        ((_.__webglDepthbuffer = i.createRenderbuffer()), ot(_.__webglDepthbuffer, y, !1));
      else {
        const $ = y.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT,
          ee = _.__webglDepthbuffer;
        (i.bindRenderbuffer(i.RENDERBUFFER, ee), i.framebufferRenderbuffer(i.FRAMEBUFFER, $, i.RENDERBUFFER, ee));
      }
    }
    t.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function at(y, _, O) {
    const Y = n.get(y);
    (_ !== void 0 && we(Y.__webglFramebuffer, y, y.texture, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, 0),
      O !== void 0 && Je(y));
  }
  function ze(y) {
    const _ = y.texture,
      O = n.get(y),
      Y = n.get(_);
    y.addEventListener("dispose", x);
    const $ = y.textures,
      ee = y.isWebGLCubeRenderTarget === !0,
      ae = $.length > 1;
    if (
      (ae ||
        (Y.__webglTexture === void 0 && (Y.__webglTexture = i.createTexture()),
        (Y.__version = _.version),
        a.memory.textures++),
      ee)
    ) {
      O.__webglFramebuffer = [];
      for (let X = 0; X < 6; X++)
        if (_.mipmaps && _.mipmaps.length > 0) {
          O.__webglFramebuffer[X] = [];
          for (let Z = 0; Z < _.mipmaps.length; Z++) O.__webglFramebuffer[X][Z] = i.createFramebuffer();
        } else O.__webglFramebuffer[X] = i.createFramebuffer();
    } else {
      if (_.mipmaps && _.mipmaps.length > 0) {
        O.__webglFramebuffer = [];
        for (let X = 0; X < _.mipmaps.length; X++) O.__webglFramebuffer[X] = i.createFramebuffer();
      } else O.__webglFramebuffer = i.createFramebuffer();
      if (ae)
        for (let X = 0, Z = $.length; X < Z; X++) {
          const fe = n.get($[X]);
          fe.__webglTexture === void 0 && ((fe.__webglTexture = i.createTexture()), a.memory.textures++);
        }
      if (y.samples > 0 && ke(y) === !1) {
        ((O.__webglMultisampledFramebuffer = i.createFramebuffer()),
          (O.__webglColorRenderbuffer = []),
          t.bindFramebuffer(i.FRAMEBUFFER, O.__webglMultisampledFramebuffer));
        for (let X = 0; X < $.length; X++) {
          const Z = $[X];
          ((O.__webglColorRenderbuffer[X] = i.createRenderbuffer()),
            i.bindRenderbuffer(i.RENDERBUFFER, O.__webglColorRenderbuffer[X]));
          const fe = r.convert(Z.format, Z.colorSpace),
            ge = r.convert(Z.type),
            se = b(Z.internalFormat, fe, ge, Z.normalized, Z.colorSpace, y.isXRRenderTarget === !0),
            te = xt(y);
          (i.renderbufferStorageMultisample(i.RENDERBUFFER, te, se, y.width, y.height),
            i.framebufferRenderbuffer(
              i.FRAMEBUFFER,
              i.COLOR_ATTACHMENT0 + X,
              i.RENDERBUFFER,
              O.__webglColorRenderbuffer[X],
            ));
        }
        (i.bindRenderbuffer(i.RENDERBUFFER, null),
          y.depthBuffer &&
            ((O.__webglDepthRenderbuffer = i.createRenderbuffer()), ot(O.__webglDepthRenderbuffer, y, !0)),
          t.bindFramebuffer(i.FRAMEBUFFER, null));
      }
    }
    if (ee) {
      (t.bindTexture(i.TEXTURE_CUBE_MAP, Y.__webglTexture), Ue(i.TEXTURE_CUBE_MAP, _));
      for (let X = 0; X < 6; X++)
        if (_.mipmaps && _.mipmaps.length > 0)
          for (let Z = 0; Z < _.mipmaps.length; Z++)
            we(O.__webglFramebuffer[X][Z], y, _, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + X, Z);
        else we(O.__webglFramebuffer[X], y, _, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + X, 0);
      (p(_) && S(i.TEXTURE_CUBE_MAP), t.unbindTexture());
    } else if (ae) {
      for (let X = 0, Z = $.length; X < Z; X++) {
        const fe = $[X],
          ge = n.get(fe);
        let se = i.TEXTURE_2D;
        ((y.isWebGL3DRenderTarget || y.isWebGLArrayRenderTarget) &&
          (se = y.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY),
          t.bindTexture(se, ge.__webglTexture),
          Ue(se, fe),
          we(O.__webglFramebuffer, y, fe, i.COLOR_ATTACHMENT0 + X, se, 0),
          p(fe) && S(se));
      }
      t.unbindTexture();
    } else {
      let X = i.TEXTURE_2D;
      if (
        ((y.isWebGL3DRenderTarget || y.isWebGLArrayRenderTarget) &&
          (X = y.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY),
        t.bindTexture(X, Y.__webglTexture),
        Ue(X, _),
        _.mipmaps && _.mipmaps.length > 0)
      )
        for (let Z = 0; Z < _.mipmaps.length; Z++) we(O.__webglFramebuffer[Z], y, _, i.COLOR_ATTACHMENT0, X, Z);
      else we(O.__webglFramebuffer, y, _, i.COLOR_ATTACHMENT0, X, 0);
      (p(_) && S(X), t.unbindTexture());
    }
    y.depthBuffer && Je(y);
  }
  function _t(y) {
    const _ = y.textures;
    for (let O = 0, Y = _.length; O < Y; O++) {
      const $ = _[O];
      if (p($)) {
        const ee = E(y),
          ae = n.get($).__webglTexture;
        (t.bindTexture(ee, ae), S(ee), t.unbindTexture());
      }
    }
  }
  const lt = [],
    Dt = [];
  function I(y) {
    if (y.samples > 0) {
      if (ke(y) === !1) {
        const _ = y.textures,
          O = y.width,
          Y = y.height;
        let $ = i.COLOR_BUFFER_BIT;
        const ee = y.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT,
          ae = n.get(y),
          X = _.length > 1;
        if (X)
          for (let fe = 0; fe < _.length; fe++)
            (t.bindFramebuffer(i.FRAMEBUFFER, ae.__webglMultisampledFramebuffer),
              i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + fe, i.RENDERBUFFER, null),
              t.bindFramebuffer(i.FRAMEBUFFER, ae.__webglFramebuffer),
              i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + fe, i.TEXTURE_2D, null, 0));
        t.bindFramebuffer(i.READ_FRAMEBUFFER, ae.__webglMultisampledFramebuffer);
        const Z = y.texture.mipmaps;
        Z && Z.length > 0
          ? t.bindFramebuffer(i.DRAW_FRAMEBUFFER, ae.__webglFramebuffer[0])
          : t.bindFramebuffer(i.DRAW_FRAMEBUFFER, ae.__webglFramebuffer);
        for (let fe = 0; fe < _.length; fe++) {
          if (
            (y.resolveDepthBuffer &&
              (y.depthBuffer && ($ |= i.DEPTH_BUFFER_BIT),
              y.stencilBuffer && y.resolveStencilBuffer && ($ |= i.STENCIL_BUFFER_BIT)),
            X)
          ) {
            i.framebufferRenderbuffer(
              i.READ_FRAMEBUFFER,
              i.COLOR_ATTACHMENT0,
              i.RENDERBUFFER,
              ae.__webglColorRenderbuffer[fe],
            );
            const ge = n.get(_[fe]).__webglTexture;
            i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, ge, 0);
          }
          (i.blitFramebuffer(0, 0, O, Y, 0, 0, O, Y, $, i.NEAREST),
            c === !0 &&
              ((lt.length = 0),
              (Dt.length = 0),
              lt.push(i.COLOR_ATTACHMENT0 + fe),
              y.depthBuffer &&
                y.resolveDepthBuffer === !1 &&
                (lt.push(ee), Dt.push(ee), i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, Dt)),
              i.invalidateFramebuffer(i.READ_FRAMEBUFFER, lt)));
        }
        if ((t.bindFramebuffer(i.READ_FRAMEBUFFER, null), t.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), X))
          for (let fe = 0; fe < _.length; fe++) {
            (t.bindFramebuffer(i.FRAMEBUFFER, ae.__webglMultisampledFramebuffer),
              i.framebufferRenderbuffer(
                i.FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + fe,
                i.RENDERBUFFER,
                ae.__webglColorRenderbuffer[fe],
              ));
            const ge = n.get(_[fe]).__webglTexture;
            (t.bindFramebuffer(i.FRAMEBUFFER, ae.__webglFramebuffer),
              i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + fe, i.TEXTURE_2D, ge, 0));
          }
        t.bindFramebuffer(i.DRAW_FRAMEBUFFER, ae.__webglMultisampledFramebuffer);
      } else if (y.depthBuffer && y.resolveDepthBuffer === !1 && c) {
        const _ = y.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
        i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [_]);
      }
    }
  }
  function xt(y) {
    return Math.min(s.maxSamples, y.samples);
  }
  function ke(y) {
    const _ = n.get(y);
    return y.samples > 0 && e.has("WEBGL_multisampled_render_to_texture") === !0 && _.__useRenderToTexture !== !1;
  }
  function st(y) {
    const _ = a.render.frame;
    u.get(y) !== _ && (u.set(y, _), y.update());
  }
  function oe(y, _) {
    const O = y.colorSpace,
      Y = y.format,
      $ = y.type;
    return (
      y.isCompressedTexture === !0 ||
        y.isVideoTexture === !0 ||
        (O !== Ks &&
          O !== Bn &&
          (We.getTransfer(O) === Ze
            ? (Y !== Ht || $ !== Bt) &&
              xe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.")
            : Te("WebGLTextures: Unsupported texture color space:", O))),
      _
    );
  }
  function ht(y) {
    return (
      typeof HTMLImageElement < "u" && y instanceof HTMLImageElement
        ? ((l.width = y.naturalWidth || y.width), (l.height = y.naturalHeight || y.height))
        : typeof VideoFrame < "u" && y instanceof VideoFrame
          ? ((l.width = y.displayWidth), (l.height = y.displayHeight))
          : ((l.width = y.width), (l.height = y.height)),
      l
    );
  }
  ((this.allocateTextureUnit = V),
    (this.resetTextureUnits = H),
    (this.getTextureUnits = W),
    (this.setTextureUnits = U),
    (this.setTexture2D = J),
    (this.setTexture2DArray = Q),
    (this.setTexture3D = ce),
    (this.setTextureCube = ve),
    (this.rebindTextures = at),
    (this.setupRenderTarget = ze),
    (this.updateRenderTargetMipmap = _t),
    (this.updateMultisampleRenderTarget = I),
    (this.setupDepthRenderbuffer = Je),
    (this.setupFrameBufferTexture = we),
    (this.useMultisampledRTT = ke),
    (this.isReversedDepthBuffer = function () {
      return t.buffers.depth.getReversed();
    }));
}
function h_(i, e) {
  function t(n, s = Bn) {
    let r;
    const a = We.getTransfer(s);
    if (n === Bt) return i.UNSIGNED_BYTE;
    if (n === Ya) return i.UNSIGNED_SHORT_4_4_4_4;
    if (n === Za) return i.UNSIGNED_SHORT_5_5_5_1;
    if (n === ec) return i.UNSIGNED_INT_5_9_9_9_REV;
    if (n === tc) return i.UNSIGNED_INT_10F_11F_11F_REV;
    if (n === Jl) return i.BYTE;
    if (n === Ql) return i.SHORT;
    if (n === Zi) return i.UNSIGNED_SHORT;
    if (n === qa) return i.INT;
    if (n === hn) return i.UNSIGNED_INT;
    if (n === Gt) return i.FLOAT;
    if (n === En) return i.HALF_FLOAT;
    if (n === nc) return i.ALPHA;
    if (n === ic) return i.RGB;
    if (n === Ht) return i.RGBA;
    if (n === Tn) return i.DEPTH_COMPONENT;
    if (n === $n) return i.DEPTH_STENCIL;
    if (n === Ka) return i.RED;
    if (n === ja) return i.RED_INTEGER;
    if (n === Qn) return i.RG;
    if (n === $a) return i.RG_INTEGER;
    if (n === Ja) return i.RGBA_INTEGER;
    if (n === Vs || n === ks || n === Gs || n === Hs)
      if (a === Ze)
        if (((r = e.get("WEBGL_compressed_texture_s3tc_srgb")), r !== null)) {
          if (n === Vs) return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === ks) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === Gs) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === Hs) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else return null;
      else if (((r = e.get("WEBGL_compressed_texture_s3tc")), r !== null)) {
        if (n === Vs) return r.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === ks) return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === Gs) return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === Hs) return r.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else return null;
    if (n === oa || n === la || n === ca || n === ha)
      if (((r = e.get("WEBGL_compressed_texture_pvrtc")), r !== null)) {
        if (n === oa) return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === la) return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === ca) return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === ha) return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else return null;
    if (n === ua || n === da || n === fa || n === pa || n === ma || n === Xs || n === ga)
      if (((r = e.get("WEBGL_compressed_texture_etc")), r !== null)) {
        if (n === ua || n === da) return a === Ze ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2;
        if (n === fa) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : r.COMPRESSED_RGBA8_ETC2_EAC;
        if (n === pa) return r.COMPRESSED_R11_EAC;
        if (n === ma) return r.COMPRESSED_SIGNED_R11_EAC;
        if (n === Xs) return r.COMPRESSED_RG11_EAC;
        if (n === ga) return r.COMPRESSED_SIGNED_RG11_EAC;
      } else return null;
    if (
      n === _a ||
      n === xa ||
      n === va ||
      n === Ma ||
      n === Sa ||
      n === ya ||
      n === ba ||
      n === Ea ||
      n === Ta ||
      n === Aa ||
      n === wa ||
      n === Ra ||
      n === Ca ||
      n === Pa
    )
      if (((r = e.get("WEBGL_compressed_texture_astc")), r !== null)) {
        if (n === _a) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : r.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === xa) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : r.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === va) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : r.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === Ma) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : r.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === Sa) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : r.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === ya) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : r.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === ba) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : r.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === Ea) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : r.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === Ta) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : r.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === Aa) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : r.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === wa) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : r.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === Ra) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : r.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === Ca) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : r.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === Pa) return a === Ze ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : r.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else return null;
    if (n === Ia || n === La || n === Da)
      if (((r = e.get("EXT_texture_compression_bptc")), r !== null)) {
        if (n === Ia) return a === Ze ? r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : r.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === La) return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === Da) return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else return null;
    if (n === Ua || n === Na || n === qs || n === Fa)
      if (((r = e.get("EXT_texture_compression_rgtc")), r !== null)) {
        if (n === Ua) return r.COMPRESSED_RED_RGTC1_EXT;
        if (n === Na) return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === qs) return r.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === Fa) return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else return null;
    return n === Ki ? i.UNSIGNED_INT_24_8 : i[n] !== void 0 ? i[n] : null;
  }
  return { convert: t };
}
const u_ = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`,
  d_ = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
class f_ {
  constructor() {
    ((this.texture = null), (this.mesh = null), (this.depthNear = 0), (this.depthFar = 0));
  }
  init(e, t) {
    if (this.texture === null) {
      const n = new gc(e.texture);
      ((e.depthNear !== t.depthNear || e.depthFar !== t.depthFar) &&
        ((this.depthNear = e.depthNear), (this.depthFar = e.depthFar)),
        (this.texture = n));
    }
  }
  getMesh(e) {
    if (this.texture !== null && this.mesh === null) {
      const t = e.cameras[0].viewport,
        n = new dn({
          vertexShader: u_,
          fragmentShader: d_,
          uniforms: { depthColor: { value: this.texture }, depthWidth: { value: t.z }, depthHeight: { value: t.w } },
        });
      this.mesh = new Xt(new or(20, 20), n);
    }
    return this.mesh;
  }
  reset() {
    ((this.texture = null), (this.mesh = null));
  }
  getDepthTexture() {
    return this.texture;
  }
}
class p_ extends An {
  constructor(e, t) {
    super();
    const n = this;
    let s = null,
      r = 1,
      a = null,
      o = "local-floor",
      c = 1,
      l = null,
      u = null,
      d = null,
      h = null,
      f = null,
      g = null;
    const M = typeof XRWebGLBinding < "u",
      m = new f_(),
      p = {},
      S = t.getContextAttributes();
    let E = null,
      b = null;
    const R = [],
      T = [],
      P = new Ge();
    let x = null;
    const A = new Ot();
    A.viewport = new it();
    const L = new Ot();
    L.viewport = new it();
    const w = [A, L],
      N = new ud();
    let H = null,
      W = null;
    ((this.cameraAutoUpdate = !0),
      (this.enabled = !1),
      (this.isPresenting = !1),
      (this.getController = function (K) {
        let de = R[K];
        return (de === void 0 && ((de = new yr()), (R[K] = de)), de.getTargetRaySpace());
      }),
      (this.getControllerGrip = function (K) {
        let de = R[K];
        return (de === void 0 && ((de = new yr()), (R[K] = de)), de.getGripSpace());
      }),
      (this.getHand = function (K) {
        let de = R[K];
        return (de === void 0 && ((de = new yr()), (R[K] = de)), de.getHandSpace());
      }));
    function U(K) {
      const de = T.indexOf(K.inputSource);
      if (de === -1) return;
      const ie = R[de];
      ie !== void 0 &&
        (ie.update(K.inputSource, K.frame, l || a), ie.dispatchEvent({ type: K.type, data: K.inputSource }));
    }
    function V() {
      (s.removeEventListener("select", U),
        s.removeEventListener("selectstart", U),
        s.removeEventListener("selectend", U),
        s.removeEventListener("squeeze", U),
        s.removeEventListener("squeezestart", U),
        s.removeEventListener("squeezeend", U),
        s.removeEventListener("end", V),
        s.removeEventListener("inputsourceschange", G));
      for (let K = 0; K < R.length; K++) {
        const de = T[K];
        de !== null && ((T[K] = null), R[K].disconnect(de));
      }
      ((H = null), (W = null), m.reset());
      for (const K in p) delete p[K];
      (e.setRenderTarget(E),
        (f = null),
        (h = null),
        (d = null),
        (s = null),
        (b = null),
        Ue.stop(),
        (n.isPresenting = !1),
        e.setPixelRatio(x),
        e.setSize(P.width, P.height, !1),
        n.dispatchEvent({ type: "sessionend" }));
    }
    ((this.setFramebufferScaleFactor = function (K) {
      ((r = K), n.isPresenting === !0 && xe("WebXRManager: Cannot change framebuffer scale while presenting."));
    }),
      (this.setReferenceSpaceType = function (K) {
        ((o = K), n.isPresenting === !0 && xe("WebXRManager: Cannot change reference space type while presenting."));
      }),
      (this.getReferenceSpace = function () {
        return l || a;
      }),
      (this.setReferenceSpace = function (K) {
        l = K;
      }),
      (this.getBaseLayer = function () {
        return h !== null ? h : f;
      }),
      (this.getBinding = function () {
        return (d === null && M && (d = new XRWebGLBinding(s, t)), d);
      }),
      (this.getFrame = function () {
        return g;
      }),
      (this.getSession = function () {
        return s;
      }),
      (this.setSession = async function (K) {
        if (((s = K), s !== null)) {
          if (
            ((E = e.getRenderTarget()),
            s.addEventListener("select", U),
            s.addEventListener("selectstart", U),
            s.addEventListener("selectend", U),
            s.addEventListener("squeeze", U),
            s.addEventListener("squeezestart", U),
            s.addEventListener("squeezeend", U),
            s.addEventListener("end", V),
            s.addEventListener("inputsourceschange", G),
            S.xrCompatible !== !0 && (await t.makeXRCompatible()),
            (x = e.getPixelRatio()),
            e.getSize(P),
            M && "createProjectionLayer" in XRWebGLBinding.prototype)
          ) {
            let ie = null,
              Ae = null,
              Pe = null;
            S.depth &&
              ((Pe = S.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24),
              (ie = S.stencil ? $n : Tn),
              (Ae = S.stencil ? Ki : hn));
            const we = { colorFormat: t.RGBA8, depthFormat: Pe, scaleFactor: r };
            ((d = this.getBinding()),
              (h = d.createProjectionLayer(we)),
              s.updateRenderState({ layers: [h] }),
              e.setPixelRatio(1),
              e.setSize(h.textureWidth, h.textureHeight, !1),
              (b = new cn(h.textureWidth, h.textureHeight, {
                format: Ht,
                type: Bt,
                depthTexture: new Ai(
                  h.textureWidth,
                  h.textureHeight,
                  Ae,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  ie,
                ),
                stencilBuffer: S.stencil,
                colorSpace: e.outputColorSpace,
                samples: S.antialias ? 4 : 0,
                resolveDepthBuffer: h.ignoreDepthValues === !1,
                resolveStencilBuffer: h.ignoreDepthValues === !1,
              })));
          } else {
            const ie = {
              antialias: S.antialias,
              alpha: !0,
              depth: S.depth,
              stencil: S.stencil,
              framebufferScaleFactor: r,
            };
            ((f = new XRWebGLLayer(s, t, ie)),
              s.updateRenderState({ baseLayer: f }),
              e.setPixelRatio(1),
              e.setSize(f.framebufferWidth, f.framebufferHeight, !1),
              (b = new cn(f.framebufferWidth, f.framebufferHeight, {
                format: Ht,
                type: Bt,
                colorSpace: e.outputColorSpace,
                stencilBuffer: S.stencil,
                resolveDepthBuffer: f.ignoreDepthValues === !1,
                resolveStencilBuffer: f.ignoreDepthValues === !1,
              })));
          }
          ((b.isXRRenderTarget = !0),
            this.setFoveation(c),
            (l = null),
            (a = await s.requestReferenceSpace(o)),
            Ue.setContext(s),
            Ue.start(),
            (n.isPresenting = !0),
            n.dispatchEvent({ type: "sessionstart" }));
        }
      }),
      (this.getEnvironmentBlendMode = function () {
        if (s !== null) return s.environmentBlendMode;
      }),
      (this.getDepthTexture = function () {
        return m.getDepthTexture();
      }));
    function G(K) {
      for (let de = 0; de < K.removed.length; de++) {
        const ie = K.removed[de],
          Ae = T.indexOf(ie);
        Ae >= 0 && ((T[Ae] = null), R[Ae].disconnect(ie));
      }
      for (let de = 0; de < K.added.length; de++) {
        const ie = K.added[de];
        let Ae = T.indexOf(ie);
        if (Ae === -1) {
          for (let we = 0; we < R.length; we++)
            if (we >= T.length) {
              (T.push(ie), (Ae = we));
              break;
            } else if (T[we] === null) {
              ((T[we] = ie), (Ae = we));
              break;
            }
          if (Ae === -1) break;
        }
        const Pe = R[Ae];
        Pe && Pe.connect(ie);
      }
    }
    const J = new F(),
      Q = new F();
    function ce(K, de, ie) {
      (J.setFromMatrixPosition(de.matrixWorld), Q.setFromMatrixPosition(ie.matrixWorld));
      const Ae = J.distanceTo(Q),
        Pe = de.projectionMatrix.elements,
        we = ie.projectionMatrix.elements,
        ot = Pe[14] / (Pe[10] - 1),
        Ve = Pe[14] / (Pe[10] + 1),
        Je = (Pe[9] + 1) / Pe[5],
        at = (Pe[9] - 1) / Pe[5],
        ze = (Pe[8] - 1) / Pe[0],
        _t = (we[8] + 1) / we[0],
        lt = ot * ze,
        Dt = ot * _t,
        I = Ae / (-ze + _t),
        xt = I * -ze;
      if (
        (de.matrixWorld.decompose(K.position, K.quaternion, K.scale),
        K.translateX(xt),
        K.translateZ(I),
        K.matrixWorld.compose(K.position, K.quaternion, K.scale),
        K.matrixWorldInverse.copy(K.matrixWorld).invert(),
        Pe[10] === -1)
      )
        (K.projectionMatrix.copy(de.projectionMatrix), K.projectionMatrixInverse.copy(de.projectionMatrixInverse));
      else {
        const ke = ot + I,
          st = Ve + I,
          oe = lt - xt,
          ht = Dt + (Ae - xt),
          y = ((Je * Ve) / st) * ke,
          _ = ((at * Ve) / st) * ke;
        (K.projectionMatrix.makePerspective(oe, ht, y, _, ke, st),
          K.projectionMatrixInverse.copy(K.projectionMatrix).invert());
      }
    }
    function ve(K, de) {
      (de === null ? K.matrixWorld.copy(K.matrix) : K.matrixWorld.multiplyMatrices(de.matrixWorld, K.matrix),
        K.matrixWorldInverse.copy(K.matrixWorld).invert());
    }
    this.updateCamera = function (K) {
      if (s === null) return;
      let de = K.near,
        ie = K.far;
      (m.texture !== null && (m.depthNear > 0 && (de = m.depthNear), m.depthFar > 0 && (ie = m.depthFar)),
        (N.near = L.near = A.near = de),
        (N.far = L.far = A.far = ie),
        (H !== N.near || W !== N.far) &&
          (s.updateRenderState({ depthNear: N.near, depthFar: N.far }), (H = N.near), (W = N.far)),
        (N.layers.mask = K.layers.mask | 6),
        (A.layers.mask = N.layers.mask & -5),
        (L.layers.mask = N.layers.mask & -3));
      const Ae = K.parent,
        Pe = N.cameras;
      ve(N, Ae);
      for (let we = 0; we < Pe.length; we++) ve(Pe[we], Ae);
      (Pe.length === 2 ? ce(N, A, L) : N.projectionMatrix.copy(A.projectionMatrix), be(K, N, Ae));
    };
    function be(K, de, ie) {
      (ie === null
        ? K.matrix.copy(de.matrixWorld)
        : (K.matrix.copy(ie.matrixWorld), K.matrix.invert(), K.matrix.multiply(de.matrixWorld)),
        K.matrix.decompose(K.position, K.quaternion, K.scale),
        K.updateMatrixWorld(!0),
        K.projectionMatrix.copy(de.projectionMatrix),
        K.projectionMatrixInverse.copy(de.projectionMatrixInverse),
        K.isPerspectiveCamera && ((K.fov = Ti * 2 * Math.atan(1 / K.projectionMatrix.elements[5])), (K.zoom = 1)));
    }
    ((this.getCamera = function () {
      return N;
    }),
      (this.getFoveation = function () {
        if (!(h === null && f === null)) return c;
      }),
      (this.setFoveation = function (K) {
        ((c = K),
          h !== null && (h.fixedFoveation = K),
          f !== null && f.fixedFoveation !== void 0 && (f.fixedFoveation = K));
      }),
      (this.hasDepthSensing = function () {
        return m.texture !== null;
      }),
      (this.getDepthSensingMesh = function () {
        return m.getMesh(N);
      }),
      (this.getCameraTexture = function (K) {
        return p[K];
      }));
    let Xe = null;
    function $e(K, de) {
      if (((u = de.getViewerPose(l || a)), (g = de), u !== null)) {
        const ie = u.views;
        f !== null && (e.setRenderTargetFramebuffer(b, f.framebuffer), e.setRenderTarget(b));
        let Ae = !1;
        ie.length !== N.cameras.length && ((N.cameras.length = 0), (Ae = !0));
        for (let Ve = 0; Ve < ie.length; Ve++) {
          const Je = ie[Ve];
          let at = null;
          if (f !== null) at = f.getViewport(Je);
          else {
            const _t = d.getViewSubImage(h, Je);
            ((at = _t.viewport),
              Ve === 0 &&
                (e.setRenderTargetTextures(b, _t.colorTexture, _t.depthStencilTexture), e.setRenderTarget(b)));
          }
          let ze = w[Ve];
          (ze === void 0 && ((ze = new Ot()), ze.layers.enable(Ve), (ze.viewport = new it()), (w[Ve] = ze)),
            ze.matrix.fromArray(Je.transform.matrix),
            ze.matrix.decompose(ze.position, ze.quaternion, ze.scale),
            ze.projectionMatrix.fromArray(Je.projectionMatrix),
            ze.projectionMatrixInverse.copy(ze.projectionMatrix).invert(),
            ze.viewport.set(at.x, at.y, at.width, at.height),
            Ve === 0 && (N.matrix.copy(ze.matrix), N.matrix.decompose(N.position, N.quaternion, N.scale)),
            Ae === !0 && N.cameras.push(ze));
        }
        const Pe = s.enabledFeatures;
        if (Pe && Pe.includes("depth-sensing") && s.depthUsage == "gpu-optimized" && M) {
          d = n.getBinding();
          const Ve = d.getDepthInformation(ie[0]);
          Ve && Ve.isValid && Ve.texture && m.init(Ve, s.renderState);
        }
        if (Pe && Pe.includes("camera-access") && M) {
          (e.state.unbindTexture(), (d = n.getBinding()));
          for (let Ve = 0; Ve < ie.length; Ve++) {
            const Je = ie[Ve].camera;
            if (Je) {
              let at = p[Je];
              at || ((at = new gc()), (p[Je] = at));
              const ze = d.getCameraImage(Je);
              at.sourceTexture = ze;
            }
          }
        }
      }
      for (let ie = 0; ie < R.length; ie++) {
        const Ae = T[ie],
          Pe = R[ie];
        Ae !== null && Pe !== void 0 && Pe.update(Ae, de, l || a);
      }
      (Xe && Xe(K, de), de.detectedPlanes && n.dispatchEvent({ type: "planesdetected", data: de }), (g = null));
    }
    const Ue = new Cc();
    (Ue.setAnimationLoop($e),
      (this.setAnimationLoop = function (K) {
        Xe = K;
      }),
      (this.dispose = function () {}));
  }
}
const m_ = new He(),
  Fc = new Ie();
Fc.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function g_(i, e) {
  function t(m, p) {
    (m.matrixAutoUpdate === !0 && m.updateMatrix(), p.value.copy(m.matrix));
  }
  function n(m, p) {
    (p.color.getRGB(m.fogColor.value, Ec(i)),
      p.isFog
        ? ((m.fogNear.value = p.near), (m.fogFar.value = p.far))
        : p.isFogExp2 && (m.fogDensity.value = p.density));
  }
  function s(m, p, S, E, b) {
    p.isNodeMaterial
      ? (p.uniformsNeedUpdate = !1)
      : p.isMeshBasicMaterial
        ? r(m, p)
        : p.isMeshLambertMaterial
          ? (r(m, p), p.envMap && (m.envMapIntensity.value = p.envMapIntensity))
          : p.isMeshToonMaterial
            ? (r(m, p), d(m, p))
            : p.isMeshPhongMaterial
              ? (r(m, p), u(m, p), p.envMap && (m.envMapIntensity.value = p.envMapIntensity))
              : p.isMeshStandardMaterial
                ? (r(m, p), h(m, p), p.isMeshPhysicalMaterial && f(m, p, b))
                : p.isMeshMatcapMaterial
                  ? (r(m, p), g(m, p))
                  : p.isMeshDepthMaterial
                    ? r(m, p)
                    : p.isMeshDistanceMaterial
                      ? (r(m, p), M(m, p))
                      : p.isMeshNormalMaterial
                        ? r(m, p)
                        : p.isLineBasicMaterial
                          ? (a(m, p), p.isLineDashedMaterial && o(m, p))
                          : p.isPointsMaterial
                            ? c(m, p, S, E)
                            : p.isSpriteMaterial
                              ? l(m, p)
                              : p.isShadowMaterial
                                ? (m.color.value.copy(p.color), (m.opacity.value = p.opacity))
                                : p.isShaderMaterial && (p.uniformsNeedUpdate = !1);
  }
  function r(m, p) {
    ((m.opacity.value = p.opacity),
      p.color && m.diffuse.value.copy(p.color),
      p.emissive && m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),
      p.map && ((m.map.value = p.map), t(p.map, m.mapTransform)),
      p.alphaMap && ((m.alphaMap.value = p.alphaMap), t(p.alphaMap, m.alphaMapTransform)),
      p.bumpMap &&
        ((m.bumpMap.value = p.bumpMap),
        t(p.bumpMap, m.bumpMapTransform),
        (m.bumpScale.value = p.bumpScale),
        p.side === It && (m.bumpScale.value *= -1)),
      p.normalMap &&
        ((m.normalMap.value = p.normalMap),
        t(p.normalMap, m.normalMapTransform),
        m.normalScale.value.copy(p.normalScale),
        p.side === It && m.normalScale.value.negate()),
      p.displacementMap &&
        ((m.displacementMap.value = p.displacementMap),
        t(p.displacementMap, m.displacementMapTransform),
        (m.displacementScale.value = p.displacementScale),
        (m.displacementBias.value = p.displacementBias)),
      p.emissiveMap && ((m.emissiveMap.value = p.emissiveMap), t(p.emissiveMap, m.emissiveMapTransform)),
      p.specularMap && ((m.specularMap.value = p.specularMap), t(p.specularMap, m.specularMapTransform)),
      p.alphaTest > 0 && (m.alphaTest.value = p.alphaTest));
    const S = e.get(p),
      E = S.envMap,
      b = S.envMapRotation;
    (E &&
      ((m.envMap.value = E),
      m.envMapRotation.value.setFromMatrix4(m_.makeRotationFromEuler(b)).transpose(),
      E.isCubeTexture && E.isRenderTargetTexture === !1 && m.envMapRotation.value.premultiply(Fc),
      (m.reflectivity.value = p.reflectivity),
      (m.ior.value = p.ior),
      (m.refractionRatio.value = p.refractionRatio)),
      p.lightMap &&
        ((m.lightMap.value = p.lightMap),
        (m.lightMapIntensity.value = p.lightMapIntensity),
        t(p.lightMap, m.lightMapTransform)),
      p.aoMap &&
        ((m.aoMap.value = p.aoMap), (m.aoMapIntensity.value = p.aoMapIntensity), t(p.aoMap, m.aoMapTransform)));
  }
  function a(m, p) {
    (m.diffuse.value.copy(p.color),
      (m.opacity.value = p.opacity),
      p.map && ((m.map.value = p.map), t(p.map, m.mapTransform)));
  }
  function o(m, p) {
    ((m.dashSize.value = p.dashSize), (m.totalSize.value = p.dashSize + p.gapSize), (m.scale.value = p.scale));
  }
  function c(m, p, S, E) {
    (m.diffuse.value.copy(p.color),
      (m.opacity.value = p.opacity),
      (m.size.value = p.size * S),
      (m.scale.value = E * 0.5),
      p.map && ((m.map.value = p.map), t(p.map, m.uvTransform)),
      p.alphaMap && ((m.alphaMap.value = p.alphaMap), t(p.alphaMap, m.alphaMapTransform)),
      p.alphaTest > 0 && (m.alphaTest.value = p.alphaTest));
  }
  function l(m, p) {
    (m.diffuse.value.copy(p.color),
      (m.opacity.value = p.opacity),
      (m.rotation.value = p.rotation),
      p.map && ((m.map.value = p.map), t(p.map, m.mapTransform)),
      p.alphaMap && ((m.alphaMap.value = p.alphaMap), t(p.alphaMap, m.alphaMapTransform)),
      p.alphaTest > 0 && (m.alphaTest.value = p.alphaTest));
  }
  function u(m, p) {
    (m.specular.value.copy(p.specular), (m.shininess.value = Math.max(p.shininess, 1e-4)));
  }
  function d(m, p) {
    p.gradientMap && (m.gradientMap.value = p.gradientMap);
  }
  function h(m, p) {
    ((m.metalness.value = p.metalness),
      p.metalnessMap && ((m.metalnessMap.value = p.metalnessMap), t(p.metalnessMap, m.metalnessMapTransform)),
      (m.roughness.value = p.roughness),
      p.roughnessMap && ((m.roughnessMap.value = p.roughnessMap), t(p.roughnessMap, m.roughnessMapTransform)),
      p.envMap && (m.envMapIntensity.value = p.envMapIntensity));
  }
  function f(m, p, S) {
    ((m.ior.value = p.ior),
      p.sheen > 0 &&
        (m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),
        (m.sheenRoughness.value = p.sheenRoughness),
        p.sheenColorMap && ((m.sheenColorMap.value = p.sheenColorMap), t(p.sheenColorMap, m.sheenColorMapTransform)),
        p.sheenRoughnessMap &&
          ((m.sheenRoughnessMap.value = p.sheenRoughnessMap), t(p.sheenRoughnessMap, m.sheenRoughnessMapTransform))),
      p.clearcoat > 0 &&
        ((m.clearcoat.value = p.clearcoat),
        (m.clearcoatRoughness.value = p.clearcoatRoughness),
        p.clearcoatMap && ((m.clearcoatMap.value = p.clearcoatMap), t(p.clearcoatMap, m.clearcoatMapTransform)),
        p.clearcoatRoughnessMap &&
          ((m.clearcoatRoughnessMap.value = p.clearcoatRoughnessMap),
          t(p.clearcoatRoughnessMap, m.clearcoatRoughnessMapTransform)),
        p.clearcoatNormalMap &&
          ((m.clearcoatNormalMap.value = p.clearcoatNormalMap),
          t(p.clearcoatNormalMap, m.clearcoatNormalMapTransform),
          m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),
          p.side === It && m.clearcoatNormalScale.value.negate())),
      p.dispersion > 0 && (m.dispersion.value = p.dispersion),
      p.iridescence > 0 &&
        ((m.iridescence.value = p.iridescence),
        (m.iridescenceIOR.value = p.iridescenceIOR),
        (m.iridescenceThicknessMinimum.value = p.iridescenceThicknessRange[0]),
        (m.iridescenceThicknessMaximum.value = p.iridescenceThicknessRange[1]),
        p.iridescenceMap &&
          ((m.iridescenceMap.value = p.iridescenceMap), t(p.iridescenceMap, m.iridescenceMapTransform)),
        p.iridescenceThicknessMap &&
          ((m.iridescenceThicknessMap.value = p.iridescenceThicknessMap),
          t(p.iridescenceThicknessMap, m.iridescenceThicknessMapTransform))),
      p.transmission > 0 &&
        ((m.transmission.value = p.transmission),
        (m.transmissionSamplerMap.value = S.texture),
        m.transmissionSamplerSize.value.set(S.width, S.height),
        p.transmissionMap &&
          ((m.transmissionMap.value = p.transmissionMap), t(p.transmissionMap, m.transmissionMapTransform)),
        (m.thickness.value = p.thickness),
        p.thicknessMap && ((m.thicknessMap.value = p.thicknessMap), t(p.thicknessMap, m.thicknessMapTransform)),
        (m.attenuationDistance.value = p.attenuationDistance),
        m.attenuationColor.value.copy(p.attenuationColor)),
      p.anisotropy > 0 &&
        (m.anisotropyVector.value.set(
          p.anisotropy * Math.cos(p.anisotropyRotation),
          p.anisotropy * Math.sin(p.anisotropyRotation),
        ),
        p.anisotropyMap && ((m.anisotropyMap.value = p.anisotropyMap), t(p.anisotropyMap, m.anisotropyMapTransform))),
      (m.specularIntensity.value = p.specularIntensity),
      m.specularColor.value.copy(p.specularColor),
      p.specularColorMap &&
        ((m.specularColorMap.value = p.specularColorMap), t(p.specularColorMap, m.specularColorMapTransform)),
      p.specularIntensityMap &&
        ((m.specularIntensityMap.value = p.specularIntensityMap),
        t(p.specularIntensityMap, m.specularIntensityMapTransform)));
  }
  function g(m, p) {
    p.matcap && (m.matcap.value = p.matcap);
  }
  function M(m, p) {
    const S = e.get(p).light;
    (m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),
      (m.nearDistance.value = S.shadow.camera.near),
      (m.farDistance.value = S.shadow.camera.far));
  }
  return { refreshFogUniforms: n, refreshMaterialUniforms: s };
}
function __(i, e, t, n) {
  let s = {},
    r = {},
    a = [];
  const o = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);
  function c(S, E) {
    const b = E.program;
    n.uniformBlockBinding(S, b);
  }
  function l(S, E) {
    let b = s[S.id];
    b === void 0 && (g(S), (b = u(S)), (s[S.id] = b), S.addEventListener("dispose", m));
    const R = E.program;
    n.updateUBOMapping(S, R);
    const T = e.render.frame;
    r[S.id] !== T && (h(S), (r[S.id] = T));
  }
  function u(S) {
    const E = d();
    S.__bindingPointIndex = E;
    const b = i.createBuffer(),
      R = S.__size,
      T = S.usage;
    return (
      i.bindBuffer(i.UNIFORM_BUFFER, b),
      i.bufferData(i.UNIFORM_BUFFER, R, T),
      i.bindBuffer(i.UNIFORM_BUFFER, null),
      i.bindBufferBase(i.UNIFORM_BUFFER, E, b),
      b
    );
  }
  function d() {
    for (let S = 0; S < o; S++) if (a.indexOf(S) === -1) return (a.push(S), S);
    return (Te("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0);
  }
  function h(S) {
    const E = s[S.id],
      b = S.uniforms,
      R = S.__cache;
    i.bindBuffer(i.UNIFORM_BUFFER, E);
    for (let T = 0, P = b.length; T < P; T++) {
      const x = Array.isArray(b[T]) ? b[T] : [b[T]];
      for (let A = 0, L = x.length; A < L; A++) {
        const w = x[A];
        if (f(w, T, A, R) === !0) {
          const N = w.__offset,
            H = Array.isArray(w.value) ? w.value : [w.value];
          let W = 0;
          for (let U = 0; U < H.length; U++) {
            const V = H[U],
              G = M(V);
            typeof V == "number" || typeof V == "boolean"
              ? ((w.__data[0] = V), i.bufferSubData(i.UNIFORM_BUFFER, N + W, w.__data))
              : V.isMatrix3
                ? ((w.__data[0] = V.elements[0]),
                  (w.__data[1] = V.elements[1]),
                  (w.__data[2] = V.elements[2]),
                  (w.__data[3] = 0),
                  (w.__data[4] = V.elements[3]),
                  (w.__data[5] = V.elements[4]),
                  (w.__data[6] = V.elements[5]),
                  (w.__data[7] = 0),
                  (w.__data[8] = V.elements[6]),
                  (w.__data[9] = V.elements[7]),
                  (w.__data[10] = V.elements[8]),
                  (w.__data[11] = 0))
                : ArrayBuffer.isView(V)
                  ? w.__data.set(new V.constructor(V.buffer, V.byteOffset, w.__data.length))
                  : (V.toArray(w.__data, W), (W += G.storage / Float32Array.BYTES_PER_ELEMENT));
          }
          i.bufferSubData(i.UNIFORM_BUFFER, N, w.__data);
        }
      }
    }
    i.bindBuffer(i.UNIFORM_BUFFER, null);
  }
  function f(S, E, b, R) {
    const T = S.value,
      P = E + "_" + b;
    if (R[P] === void 0)
      return (
        typeof T == "number" || typeof T == "boolean"
          ? (R[P] = T)
          : ArrayBuffer.isView(T)
            ? (R[P] = T.slice())
            : (R[P] = T.clone()),
        !0
      );
    {
      const x = R[P];
      if (typeof T == "number" || typeof T == "boolean") {
        if (x !== T) return ((R[P] = T), !0);
      } else {
        if (ArrayBuffer.isView(T)) return !0;
        if (x.equals(T) === !1) return (x.copy(T), !0);
      }
    }
    return !1;
  }
  function g(S) {
    const E = S.uniforms;
    let b = 0;
    const R = 16;
    for (let P = 0, x = E.length; P < x; P++) {
      const A = Array.isArray(E[P]) ? E[P] : [E[P]];
      for (let L = 0, w = A.length; L < w; L++) {
        const N = A[L],
          H = Array.isArray(N.value) ? N.value : [N.value];
        for (let W = 0, U = H.length; W < U; W++) {
          const V = H[W],
            G = M(V),
            J = b % R,
            Q = J % G.boundary,
            ce = J + Q;
          ((b += Q),
            ce !== 0 && R - ce < G.storage && (b += R - ce),
            (N.__data = new Float32Array(G.storage / Float32Array.BYTES_PER_ELEMENT)),
            (N.__offset = b),
            (b += G.storage));
        }
      }
    }
    const T = b % R;
    return (T > 0 && (b += R - T), (S.__size = b), (S.__cache = {}), this);
  }
  function M(S) {
    const E = { boundary: 0, storage: 0 };
    return (
      typeof S == "number" || typeof S == "boolean"
        ? ((E.boundary = 4), (E.storage = 4))
        : S.isVector2
          ? ((E.boundary = 8), (E.storage = 8))
          : S.isVector3 || S.isColor
            ? ((E.boundary = 16), (E.storage = 12))
            : S.isVector4
              ? ((E.boundary = 16), (E.storage = 16))
              : S.isMatrix3
                ? ((E.boundary = 48), (E.storage = 48))
                : S.isMatrix4
                  ? ((E.boundary = 64), (E.storage = 64))
                  : S.isTexture
                    ? xe("WebGLRenderer: Texture samplers can not be part of an uniforms group.")
                    : ArrayBuffer.isView(S)
                      ? ((E.boundary = 16), (E.storage = S.byteLength))
                      : xe("WebGLRenderer: Unsupported uniform value type.", S),
      E
    );
  }
  function m(S) {
    const E = S.target;
    E.removeEventListener("dispose", m);
    const b = a.indexOf(E.__bindingPointIndex);
    (a.splice(b, 1), i.deleteBuffer(s[E.id]), delete s[E.id], delete r[E.id]);
  }
  function p() {
    for (const S in s) i.deleteBuffer(s[S]);
    ((a = []), (s = {}), (r = {}));
  }
  return { bind: c, update: l, dispose: p };
}
const x_ = new Uint16Array([
  12469, 15057, 12620, 14925, 13266, 14620, 13807, 14376, 14323, 13990, 14545, 13625, 14713, 13328, 14840, 12882, 14931,
  12528, 14996, 12233, 15039, 11829, 15066, 11525, 15080, 11295, 15085, 10976, 15082, 10705, 15073, 10495, 13880, 14564,
  13898, 14542, 13977, 14430, 14158, 14124, 14393, 13732, 14556, 13410, 14702, 12996, 14814, 12596, 14891, 12291, 14937,
  11834, 14957, 11489, 14958, 11194, 14943, 10803, 14921, 10506, 14893, 10278, 14858, 9960, 14484, 14039, 14487, 14025,
  14499, 13941, 14524, 13740, 14574, 13468, 14654, 13106, 14743, 12678, 14818, 12344, 14867, 11893, 14889, 11509, 14893,
  11180, 14881, 10751, 14852, 10428, 14812, 10128, 14765, 9754, 14712, 9466, 14764, 13480, 14764, 13475, 14766, 13440,
  14766, 13347, 14769, 13070, 14786, 12713, 14816, 12387, 14844, 11957, 14860, 11549, 14868, 11215, 14855, 10751, 14825,
  10403, 14782, 10044, 14729, 9651, 14666, 9352, 14599, 9029, 14967, 12835, 14966, 12831, 14963, 12804, 14954, 12723,
  14936, 12564, 14917, 12347, 14900, 11958, 14886, 11569, 14878, 11247, 14859, 10765, 14828, 10401, 14784, 10011, 14727,
  9600, 14660, 9289, 14586, 8893, 14508, 8533, 15111, 12234, 15110, 12234, 15104, 12216, 15092, 12156, 15067, 12010,
  15028, 11776, 14981, 11500, 14942, 11205, 14902, 10752, 14861, 10393, 14812, 9991, 14752, 9570, 14682, 9252, 14603,
  8808, 14519, 8445, 14431, 8145, 15209, 11449, 15208, 11451, 15202, 11451, 15190, 11438, 15163, 11384, 15117, 11274,
  15055, 10979, 14994, 10648, 14932, 10343, 14871, 9936, 14803, 9532, 14729, 9218, 14645, 8742, 14556, 8381, 14461,
  8020, 14365, 7603, 15273, 10603, 15272, 10607, 15267, 10619, 15256, 10631, 15231, 10614, 15182, 10535, 15118, 10389,
  15042, 10167, 14963, 9787, 14883, 9447, 14800, 9115, 14710, 8665, 14615, 8318, 14514, 7911, 14411, 7507, 14279, 7198,
  15314, 9675, 15313, 9683, 15309, 9712, 15298, 9759, 15277, 9797, 15229, 9773, 15166, 9668, 15084, 9487, 14995, 9274,
  14898, 8910, 14800, 8539, 14697, 8234, 14590, 7790, 14479, 7409, 14367, 7067, 14178, 6621, 15337, 8619, 15337, 8631,
  15333, 8677, 15325, 8769, 15305, 8871, 15264, 8940, 15202, 8909, 15119, 8775, 15022, 8565, 14916, 8328, 14804, 8009,
  14688, 7614, 14569, 7287, 14448, 6888, 14321, 6483, 14088, 6171, 15350, 7402, 15350, 7419, 15347, 7480, 15340, 7613,
  15322, 7804, 15287, 7973, 15229, 8057, 15148, 8012, 15046, 7846, 14933, 7611, 14810, 7357, 14682, 7069, 14552, 6656,
  14421, 6316, 14251, 5948, 14007, 5528, 15356, 5942, 15356, 5977, 15353, 6119, 15348, 6294, 15332, 6551, 15302, 6824,
  15249, 7044, 15171, 7122, 15070, 7050, 14949, 6861, 14818, 6611, 14679, 6349, 14538, 6067, 14398, 5651, 14189, 5311,
  13935, 4958, 15359, 4123, 15359, 4153, 15356, 4296, 15353, 4646, 15338, 5160, 15311, 5508, 15263, 5829, 15188, 6042,
  15088, 6094, 14966, 6001, 14826, 5796, 14678, 5543, 14527, 5287, 14377, 4985, 14133, 4586, 13869, 4257, 15360, 1563,
  15360, 1642, 15358, 2076, 15354, 2636, 15341, 3350, 15317, 4019, 15273, 4429, 15203, 4732, 15105, 4911, 14981, 4932,
  14836, 4818, 14679, 4621, 14517, 4386, 14359, 4156, 14083, 3795, 13808, 3437, 15360, 122, 15360, 137, 15358, 285,
  15355, 636, 15344, 1274, 15322, 2177, 15281, 2765, 15215, 3223, 15120, 3451, 14995, 3569, 14846, 3567, 14681, 3466,
  14511, 3305, 14344, 3121, 14037, 2800, 13753, 2467, 15360, 0, 15360, 1, 15359, 21, 15355, 89, 15346, 253, 15325, 479,
  15287, 796, 15225, 1148, 15133, 1492, 15008, 1749, 14856, 1882, 14685, 1886, 14506, 1783, 14324, 1608, 13996, 1398,
  13702, 1183,
]);
let sn = null;
function v_() {
  return (
    sn === null &&
      ((sn = new ar(x_, 16, 16, Qn, En)),
      (sn.name = "DFG_LUT"),
      (sn.minFilter = vt),
      (sn.magFilter = vt),
      (sn.wrapS = $t),
      (sn.wrapT = $t),
      (sn.generateMipmaps = !1),
      (sn.needsUpdate = !0)),
    sn
  );
}
class j_ {
  constructor(e = {}) {
    const {
      canvas: t = Ph(),
      context: n = null,
      depth: s = !0,
      stencil: r = !1,
      alpha: a = !1,
      antialias: o = !1,
      premultipliedAlpha: c = !0,
      preserveDrawingBuffer: l = !1,
      powerPreference: u = "default",
      failIfMajorPerformanceCaveat: d = !1,
      reversedDepthBuffer: h = !1,
      outputBufferType: f = Bt,
    } = e;
    this.isWebGLRenderer = !0;
    let g;
    if (n !== null) {
      if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext)
        throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
      g = n.getContextAttributes().alpha;
    } else g = a;
    const M = f,
      m = new Set([Ja, $a, ja]),
      p = new Set([Bt, hn, Zi, Ki, Ya, Za]),
      S = new Uint32Array(4),
      E = new Int32Array(4),
      b = new F();
    let R = null,
      T = null;
    const P = [],
      x = [];
    let A = null;
    ((this.domElement = t),
      (this.debug = { checkShaderErrors: !0, onShaderError: null }),
      (this.autoClear = !0),
      (this.autoClearColor = !0),
      (this.autoClearDepth = !0),
      (this.autoClearStencil = !0),
      (this.sortObjects = !0),
      (this.clippingPlanes = []),
      (this.localClippingEnabled = !1),
      (this.toneMapping = on),
      (this.toneMappingExposure = 1),
      (this.transmissionResolutionScale = 1));
    const L = this;
    let w = !1,
      N = null;
    this._outputColorSpace = kt;
    let H = 0,
      W = 0,
      U = null,
      V = -1,
      G = null;
    const J = new it(),
      Q = new it();
    let ce = null;
    const ve = new Ce(0);
    let be = 0,
      Xe = t.width,
      $e = t.height,
      Ue = 1,
      K = null,
      de = null;
    const ie = new it(0, 0, Xe, $e),
      Ae = new it(0, 0, Xe, $e);
    let Pe = !1;
    const we = new so();
    let ot = !1,
      Ve = !1;
    const Je = new He(),
      at = new F(),
      ze = new it(),
      _t = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: !0 };
    let lt = !1;
    function Dt() {
      return U === null ? Ue : 1;
    }
    let I = n;
    function xt(v, D) {
      return t.getContext(v, D);
    }
    try {
      const v = {
        alpha: !0,
        depth: s,
        stencil: r,
        antialias: o,
        premultipliedAlpha: c,
        preserveDrawingBuffer: l,
        powerPreference: u,
        failIfMajorPerformanceCaveat: d,
      };
      if (
        ("setAttribute" in t && t.setAttribute("data-engine", `three.js r${Xa}`),
        t.addEventListener("webglcontextlost", j, !1),
        t.addEventListener("webglcontextrestored", Se, !1),
        t.addEventListener("webglcontextcreationerror", Le, !1),
        I === null)
      ) {
        const D = "webgl2";
        if (((I = xt(D, v)), I === null))
          throw xt(D)
            ? new Error("Error creating WebGL context with your selected attributes.")
            : new Error("Error creating WebGL context.");
      }
    } catch (v) {
      throw (Te("WebGLRenderer: " + v.message), v);
    }
    let ke, st, oe, ht, y, _, O, Y, $, ee, ae, X, Z, fe, ge, se, te, Re, Ne, Ye, C, ne, q;
    function pe() {
      ((ke = new vm(I)),
        ke.init(),
        (C = new h_(I, ke)),
        (st = new um(I, ke, e, C)),
        (oe = new l_(I, ke)),
        st.reversedDepthBuffer && h && oe.buffers.depth.setReversed(!0),
        (ht = new ym(I)),
        (y = new Zg()),
        (_ = new c_(I, ke, oe, y, st, C, ht)),
        (O = new xm(L)),
        (Y = new Td(I)),
        (ne = new cm(I, Y)),
        ($ = new Mm(I, Y, ht, ne)),
        (ee = new Em(I, $, Y, ne, ht)),
        (Re = new bm(I, st, _)),
        (ge = new dm(y)),
        (ae = new Yg(L, O, ke, st, ne, ge)),
        (X = new g_(L, y)),
        (Z = new jg()),
        (fe = new n_(ke)),
        (te = new lm(L, O, oe, ee, g, c)),
        (se = new o_(L, ee, st)),
        (q = new __(I, ht, st, oe)),
        (Ne = new hm(I, ke, ht)),
        (Ye = new Sm(I, ke, ht)),
        (ht.programs = ae.programs),
        (L.capabilities = st),
        (L.extensions = ke),
        (L.properties = y),
        (L.renderLists = Z),
        (L.shadowMap = se),
        (L.state = oe),
        (L.info = ht));
    }
    (pe(), M !== Bt && (A = new Am(M, t.width, t.height, s, r)));
    const re = new p_(L, I);
    ((this.xr = re),
      (this.getContext = function () {
        return I;
      }),
      (this.getContextAttributes = function () {
        return I.getContextAttributes();
      }),
      (this.forceContextLoss = function () {
        const v = ke.get("WEBGL_lose_context");
        v && v.loseContext();
      }),
      (this.forceContextRestore = function () {
        const v = ke.get("WEBGL_lose_context");
        v && v.restoreContext();
      }),
      (this.getPixelRatio = function () {
        return Ue;
      }),
      (this.setPixelRatio = function (v) {
        v !== void 0 && ((Ue = v), this.setSize(Xe, $e, !1));
      }),
      (this.getSize = function (v) {
        return v.set(Xe, $e);
      }),
      (this.setSize = function (v, D, k = !0) {
        if (re.isPresenting) {
          xe("WebGLRenderer: Can't change size while VR device is presenting.");
          return;
        }
        ((Xe = v),
          ($e = D),
          (t.width = Math.floor(v * Ue)),
          (t.height = Math.floor(D * Ue)),
          k === !0 && ((t.style.width = v + "px"), (t.style.height = D + "px")),
          A !== null && A.setSize(t.width, t.height),
          this.setViewport(0, 0, v, D));
      }),
      (this.getDrawingBufferSize = function (v) {
        return v.set(Xe * Ue, $e * Ue).floor();
      }),
      (this.setDrawingBufferSize = function (v, D, k) {
        ((Xe = v),
          ($e = D),
          (Ue = k),
          (t.width = Math.floor(v * k)),
          (t.height = Math.floor(D * k)),
          this.setViewport(0, 0, v, D));
      }),
      (this.setEffects = function (v) {
        if (M === Bt) {
          Te("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");
          return;
        }
        if (v) {
          for (let D = 0; D < v.length; D++)
            if (v[D].isOutputPass === !0) {
              xe(
                "THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.",
              );
              break;
            }
        }
        A.setEffects(v || []);
      }),
      (this.getCurrentViewport = function (v) {
        return v.copy(J);
      }),
      (this.getViewport = function (v) {
        return v.copy(ie);
      }),
      (this.setViewport = function (v, D, k, B) {
        (v.isVector4 ? ie.set(v.x, v.y, v.z, v.w) : ie.set(v, D, k, B),
          oe.viewport(J.copy(ie).multiplyScalar(Ue).round()));
      }),
      (this.getScissor = function (v) {
        return v.copy(Ae);
      }),
      (this.setScissor = function (v, D, k, B) {
        (v.isVector4 ? Ae.set(v.x, v.y, v.z, v.w) : Ae.set(v, D, k, B),
          oe.scissor(Q.copy(Ae).multiplyScalar(Ue).round()));
      }),
      (this.getScissorTest = function () {
        return Pe;
      }),
      (this.setScissorTest = function (v) {
        oe.setScissorTest((Pe = v));
      }),
      (this.setOpaqueSort = function (v) {
        K = v;
      }),
      (this.setTransparentSort = function (v) {
        de = v;
      }),
      (this.getClearColor = function (v) {
        return v.copy(te.getClearColor());
      }),
      (this.setClearColor = function () {
        te.setClearColor(...arguments);
      }),
      (this.getClearAlpha = function () {
        return te.getClearAlpha();
      }),
      (this.setClearAlpha = function () {
        te.setClearAlpha(...arguments);
      }),
      (this.clear = function (v = !0, D = !0, k = !0) {
        let B = 0;
        if (v) {
          let z = !1;
          if (U !== null) {
            const ue = U.texture.format;
            z = m.has(ue);
          }
          if (z) {
            const ue = U.texture.type,
              _e = p.has(ue),
              he = te.getClearColor(),
              Me = te.getClearAlpha(),
              ye = he.r,
              De = he.g,
              Be = he.b;
            _e
              ? ((S[0] = ye), (S[1] = De), (S[2] = Be), (S[3] = Me), I.clearBufferuiv(I.COLOR, 0, S))
              : ((E[0] = ye), (E[1] = De), (E[2] = Be), (E[3] = Me), I.clearBufferiv(I.COLOR, 0, E));
          } else B |= I.COLOR_BUFFER_BIT;
        }
        (D && ((B |= I.DEPTH_BUFFER_BIT), this.state.buffers.depth.setMask(!0)),
          k && ((B |= I.STENCIL_BUFFER_BIT), this.state.buffers.stencil.setMask(4294967295)),
          B !== 0 && I.clear(B));
      }),
      (this.clearColor = function () {
        this.clear(!0, !1, !1);
      }),
      (this.clearDepth = function () {
        this.clear(!1, !0, !1);
      }),
      (this.clearStencil = function () {
        this.clear(!1, !1, !0);
      }),
      (this.setNodesHandler = function (v) {
        (v.setRenderer(this), (N = v));
      }),
      (this.dispose = function () {
        (t.removeEventListener("webglcontextlost", j, !1),
          t.removeEventListener("webglcontextrestored", Se, !1),
          t.removeEventListener("webglcontextcreationerror", Le, !1),
          te.dispose(),
          Z.dispose(),
          fe.dispose(),
          y.dispose(),
          O.dispose(),
          ee.dispose(),
          ne.dispose(),
          q.dispose(),
          ae.dispose(),
          re.dispose(),
          re.removeEventListener("sessionstart", go),
          re.removeEventListener("sessionend", _o),
          Hn.stop());
      }));
    function j(v) {
      (v.preventDefault(), $s("WebGLRenderer: Context Lost."), (w = !0));
    }
    function Se() {
      ($s("WebGLRenderer: Context Restored."), (w = !1));
      const v = ht.autoReset,
        D = se.enabled,
        k = se.autoUpdate,
        B = se.needsUpdate,
        z = se.type;
      (pe(), (ht.autoReset = v), (se.enabled = D), (se.autoUpdate = k), (se.needsUpdate = B), (se.type = z));
    }
    function Le(v) {
      Te("WebGLRenderer: A WebGL context could not be created. Reason: ", v.statusMessage);
    }
    function ft(v) {
      const D = v.target;
      (D.removeEventListener("dispose", ft), Qe(D));
    }
    function Qe(v) {
      (fn(v), y.remove(v));
    }
    function fn(v) {
      const D = y.get(v).programs;
      D !== void 0 &&
        (D.forEach(function (k) {
          ae.releaseProgram(k);
        }),
        v.isShaderMaterial && ae.releaseShaderCache(v));
    }
    this.renderBufferDirect = function (v, D, k, B, z, ue) {
      D === null && (D = _t);
      const _e = z.isMesh && z.matrixWorld.determinant() < 0,
        he = zc(v, D, k, B, z);
      oe.setMaterial(B, _e);
      let Me = k.index,
        ye = 1;
      if (B.wireframe === !0) {
        if (((Me = $.getWireframeAttribute(k)), Me === void 0)) return;
        ye = 2;
      }
      const De = k.drawRange,
        Be = k.attributes.position;
      let Ee = De.start * ye,
        et = (De.start + De.count) * ye;
      (ue !== null && ((Ee = Math.max(Ee, ue.start * ye)), (et = Math.min(et, (ue.start + ue.count) * ye))),
        Me !== null
          ? ((Ee = Math.max(Ee, 0)), (et = Math.min(et, Me.count)))
          : Be != null && ((Ee = Math.max(Ee, 0)), (et = Math.min(et, Be.count))));
      const pt = et - Ee;
      if (pt < 0 || pt === 1 / 0) return;
      ne.setup(z, B, he, k, Me);
      let ut,
        tt = Ne;
      if ((Me !== null && ((ut = Y.get(Me)), (tt = Ye), tt.setIndex(ut)), z.isMesh))
        B.wireframe === !0
          ? (oe.setLineWidth(B.wireframeLinewidth * Dt()), tt.setMode(I.LINES))
          : tt.setMode(I.TRIANGLES);
      else if (z.isLine) {
        let Tt = B.linewidth;
        (Tt === void 0 && (Tt = 1),
          oe.setLineWidth(Tt * Dt()),
          z.isLineSegments ? tt.setMode(I.LINES) : z.isLineLoop ? tt.setMode(I.LINE_LOOP) : tt.setMode(I.LINE_STRIP));
      } else z.isPoints ? tt.setMode(I.POINTS) : z.isSprite && tt.setMode(I.TRIANGLES);
      if (z.isBatchedMesh)
        if (ke.get("WEBGL_multi_draw")) tt.renderMultiDraw(z._multiDrawStarts, z._multiDrawCounts, z._multiDrawCount);
        else {
          const Tt = z._multiDrawStarts,
            me = z._multiDrawCounts,
            Ut = z._multiDrawCount,
            qe = Me ? Y.get(Me).bytesPerElement : 1,
            zt = y.get(B).currentProgram.getUniforms();
          for (let tn = 0; tn < Ut; tn++) (zt.setValue(I, "_gl_DrawID", tn), tt.render(Tt[tn] / qe, me[tn]));
        }
      else if (z.isInstancedMesh) tt.renderInstances(Ee, pt, z.count);
      else if (k.isInstancedBufferGeometry) {
        const Tt = k._maxInstanceCount !== void 0 ? k._maxInstanceCount : 1 / 0,
          me = Math.min(k.instanceCount, Tt);
        tt.renderInstances(Ee, pt, me);
      } else tt.render(Ee, pt);
    };
    function en(v, D, k) {
      v.transparent === !0 && v.side === Mn && v.forceSinglePass === !1
        ? ((v.side = It),
          (v.needsUpdate = !0),
          as(v, D, k),
          (v.side = kn),
          (v.needsUpdate = !0),
          as(v, D, k),
          (v.side = Mn))
        : as(v, D, k);
    }
    ((this.compile = function (v, D, k = null) {
      (k === null && (k = v),
        (T = fe.get(k)),
        T.init(D),
        x.push(T),
        k.traverseVisible(function (z) {
          z.isLight && z.layers.test(D.layers) && (T.pushLight(z), z.castShadow && T.pushShadow(z));
        }),
        v !== k &&
          v.traverseVisible(function (z) {
            z.isLight && z.layers.test(D.layers) && (T.pushLight(z), z.castShadow && T.pushShadow(z));
          }),
        T.setupLights());
      const B = new Set();
      return (
        v.traverse(function (z) {
          if (!(z.isMesh || z.isPoints || z.isLine || z.isSprite)) return;
          const ue = z.material;
          if (ue)
            if (Array.isArray(ue))
              for (let _e = 0; _e < ue.length; _e++) {
                const he = ue[_e];
                (en(he, k, z), B.add(he));
              }
            else (en(ue, k, z), B.add(ue));
        }),
        (T = x.pop()),
        B
      );
    }),
      (this.compileAsync = function (v, D, k = null) {
        const B = this.compile(v, D, k);
        return new Promise((z) => {
          function ue() {
            if (
              (B.forEach(function (_e) {
                y.get(_e).currentProgram.isReady() && B.delete(_e);
              }),
              B.size === 0)
            ) {
              z(v);
              return;
            }
            setTimeout(ue, 10);
          }
          ke.get("KHR_parallel_shader_compile") !== null ? ue() : setTimeout(ue, 10);
        });
      }));
    let ur = null;
    function Oc(v) {
      ur && ur(v);
    }
    function go() {
      Hn.stop();
    }
    function _o() {
      Hn.start();
    }
    const Hn = new Cc();
    (Hn.setAnimationLoop(Oc),
      typeof self < "u" && Hn.setContext(self),
      (this.setAnimationLoop = function (v) {
        ((ur = v), re.setAnimationLoop(v), v === null ? Hn.stop() : Hn.start());
      }),
      re.addEventListener("sessionstart", go),
      re.addEventListener("sessionend", _o),
      (this.render = function (v, D) {
        if (D !== void 0 && D.isCamera !== !0) {
          Te("WebGLRenderer.render: camera is not an instance of THREE.Camera.");
          return;
        }
        if (w === !0) return;
        N !== null && N.renderStart(v, D);
        const k = re.enabled === !0 && re.isPresenting === !0,
          B = A !== null && (U === null || k) && A.begin(L, U);
        if (
          (v.matrixWorldAutoUpdate === !0 && v.updateMatrixWorld(),
          D.parent === null && D.matrixWorldAutoUpdate === !0 && D.updateMatrixWorld(),
          re.enabled === !0 &&
            re.isPresenting === !0 &&
            (A === null || A.isCompositing() === !1) &&
            (re.cameraAutoUpdate === !0 && re.updateCamera(D), (D = re.getCamera())),
          v.isScene === !0 && v.onBeforeRender(L, v, D, U),
          (T = fe.get(v, x.length)),
          T.init(D),
          (T.state.textureUnits = _.getTextureUnits()),
          x.push(T),
          Je.multiplyMatrices(D.projectionMatrix, D.matrixWorldInverse),
          we.setFromProjectionMatrix(Je, an, D.reversedDepth),
          (Ve = this.localClippingEnabled),
          (ot = ge.init(this.clippingPlanes, Ve)),
          (R = Z.get(v, P.length)),
          R.init(),
          P.push(R),
          re.enabled === !0 && re.isPresenting === !0)
        ) {
          const _e = L.xr.getDepthSensingMesh();
          _e !== null && dr(_e, D, -1 / 0, L.sortObjects);
        }
        (dr(v, D, 0, L.sortObjects),
          R.finish(),
          L.sortObjects === !0 && R.sort(K, de),
          (lt = re.enabled === !1 || re.isPresenting === !1 || re.hasDepthSensing() === !1),
          lt && te.addToRenderList(R, v),
          this.info.render.frame++,
          ot === !0 && ge.beginShadows());
        const z = T.state.shadowsArray;
        if (
          (se.render(z, v, D),
          ot === !0 && ge.endShadows(),
          this.info.autoReset === !0 && this.info.reset(),
          (B && A.hasRenderPass()) === !1)
        ) {
          const _e = R.opaque,
            he = R.transmissive;
          if ((T.setupLights(), D.isArrayCamera)) {
            const Me = D.cameras;
            if (he.length > 0)
              for (let ye = 0, De = Me.length; ye < De; ye++) {
                const Be = Me[ye];
                vo(_e, he, v, Be);
              }
            lt && te.render(v);
            for (let ye = 0, De = Me.length; ye < De; ye++) {
              const Be = Me[ye];
              xo(R, v, Be, Be.viewport);
            }
          } else (he.length > 0 && vo(_e, he, v, D), lt && te.render(v), xo(R, v, D));
        }
        (U !== null && W === 0 && (_.updateMultisampleRenderTarget(U), _.updateRenderTargetMipmap(U)),
          B && A.end(L),
          v.isScene === !0 && v.onAfterRender(L, v, D),
          ne.resetDefaultState(),
          (V = -1),
          (G = null),
          x.pop(),
          x.length > 0
            ? ((T = x[x.length - 1]),
              _.setTextureUnits(T.state.textureUnits),
              ot === !0 && ge.setGlobalState(L.clippingPlanes, T.state.camera))
            : (T = null),
          P.pop(),
          P.length > 0 ? (R = P[P.length - 1]) : (R = null),
          N !== null && N.renderEnd());
      }));
    function dr(v, D, k, B) {
      if (v.visible === !1) return;
      if (v.layers.test(D.layers)) {
        if (v.isGroup) k = v.renderOrder;
        else if (v.isLOD) v.autoUpdate === !0 && v.update(D);
        else if (v.isLightProbeGrid) T.pushLightProbeGrid(v);
        else if (v.isLight) (T.pushLight(v), v.castShadow && T.pushShadow(v));
        else if (v.isSprite) {
          if (!v.frustumCulled || we.intersectsSprite(v)) {
            B && ze.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Je);
            const _e = ee.update(v),
              he = v.material;
            he.visible && R.push(v, _e, he, k, ze.z, null);
          }
        } else if ((v.isMesh || v.isLine || v.isPoints) && (!v.frustumCulled || we.intersectsObject(v))) {
          const _e = ee.update(v),
            he = v.material;
          if (
            (B &&
              (v.boundingSphere !== void 0
                ? (v.boundingSphere === null && v.computeBoundingSphere(), ze.copy(v.boundingSphere.center))
                : (_e.boundingSphere === null && _e.computeBoundingSphere(), ze.copy(_e.boundingSphere.center)),
              ze.applyMatrix4(v.matrixWorld).applyMatrix4(Je)),
            Array.isArray(he))
          ) {
            const Me = _e.groups;
            for (let ye = 0, De = Me.length; ye < De; ye++) {
              const Be = Me[ye],
                Ee = he[Be.materialIndex];
              Ee && Ee.visible && R.push(v, _e, Ee, k, ze.z, Be);
            }
          } else he.visible && R.push(v, _e, he, k, ze.z, null);
        }
      }
      const ue = v.children;
      for (let _e = 0, he = ue.length; _e < he; _e++) dr(ue[_e], D, k, B);
    }
    function xo(v, D, k, B) {
      const { opaque: z, transmissive: ue, transparent: _e } = v;
      (T.setupLightsView(k),
        ot === !0 && ge.setGlobalState(L.clippingPlanes, k),
        B && oe.viewport(J.copy(B)),
        z.length > 0 && rs(z, D, k),
        ue.length > 0 && rs(ue, D, k),
        _e.length > 0 && rs(_e, D, k),
        oe.buffers.depth.setTest(!0),
        oe.buffers.depth.setMask(!0),
        oe.buffers.color.setMask(!0),
        oe.setPolygonOffset(!1));
    }
    function vo(v, D, k, B) {
      if ((k.isScene === !0 ? k.overrideMaterial : null) !== null) return;
      if (T.state.transmissionRenderTarget[B.id] === void 0) {
        const Ee = ke.has("EXT_color_buffer_half_float") || ke.has("EXT_color_buffer_float");
        T.state.transmissionRenderTarget[B.id] = new cn(1, 1, {
          generateMipmaps: !0,
          type: Ee ? En : Bt,
          minFilter: zn,
          samples: Math.max(4, st.samples),
          stencilBuffer: r,
          resolveDepthBuffer: !1,
          resolveStencilBuffer: !1,
          colorSpace: We.workingColorSpace,
        });
      }
      const ue = T.state.transmissionRenderTarget[B.id],
        _e = B.viewport || J;
      ue.setSize(_e.z * L.transmissionResolutionScale, _e.w * L.transmissionResolutionScale);
      const he = L.getRenderTarget(),
        Me = L.getActiveCubeFace(),
        ye = L.getActiveMipmapLevel();
      (L.setRenderTarget(ue),
        L.getClearColor(ve),
        (be = L.getClearAlpha()),
        be < 1 && L.setClearColor(16777215, 0.5),
        L.clear(),
        lt && te.render(k));
      const De = L.toneMapping;
      L.toneMapping = on;
      const Be = B.viewport;
      if (
        (B.viewport !== void 0 && (B.viewport = void 0),
        T.setupLightsView(B),
        ot === !0 && ge.setGlobalState(L.clippingPlanes, B),
        rs(v, k, B),
        _.updateMultisampleRenderTarget(ue),
        _.updateRenderTargetMipmap(ue),
        ke.has("WEBGL_multisampled_render_to_texture") === !1)
      ) {
        let Ee = !1;
        for (let et = 0, pt = D.length; et < pt; et++) {
          const ut = D[et],
            { object: tt, geometry: Tt, material: me, group: Ut } = ut;
          if (me.side === Mn && tt.layers.test(B.layers)) {
            const qe = me.side;
            ((me.side = It),
              (me.needsUpdate = !0),
              Mo(tt, k, B, Tt, me, Ut),
              (me.side = qe),
              (me.needsUpdate = !0),
              (Ee = !0));
          }
        }
        Ee === !0 && (_.updateMultisampleRenderTarget(ue), _.updateRenderTargetMipmap(ue));
      }
      (L.setRenderTarget(he, Me, ye),
        L.setClearColor(ve, be),
        Be !== void 0 && (B.viewport = Be),
        (L.toneMapping = De));
    }
    function rs(v, D, k) {
      const B = D.isScene === !0 ? D.overrideMaterial : null;
      for (let z = 0, ue = v.length; z < ue; z++) {
        const _e = v[z],
          { object: he, geometry: Me, group: ye } = _e;
        let De = _e.material;
        (De.allowOverride === !0 && B !== null && (De = B), he.layers.test(k.layers) && Mo(he, D, k, Me, De, ye));
      }
    }
    function Mo(v, D, k, B, z, ue) {
      (v.onBeforeRender(L, D, k, B, z, ue),
        v.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse, v.matrixWorld),
        v.normalMatrix.getNormalMatrix(v.modelViewMatrix),
        z.onBeforeRender(L, D, k, B, v, ue),
        z.transparent === !0 && z.side === Mn && z.forceSinglePass === !1
          ? ((z.side = It),
            (z.needsUpdate = !0),
            L.renderBufferDirect(k, D, B, z, v, ue),
            (z.side = kn),
            (z.needsUpdate = !0),
            L.renderBufferDirect(k, D, B, z, v, ue),
            (z.side = Mn))
          : L.renderBufferDirect(k, D, B, z, v, ue),
        v.onAfterRender(L, D, k, B, z, ue));
    }
    function as(v, D, k) {
      D.isScene !== !0 && (D = _t);
      const B = y.get(v),
        z = T.state.lights,
        ue = T.state.shadowsArray,
        _e = z.state.version,
        he = ae.getParameters(v, z.state, ue, D, k, T.state.lightProbeGridArray),
        Me = ae.getProgramCacheKey(he);
      let ye = B.programs;
      ((B.environment =
        v.isMeshStandardMaterial || v.isMeshLambertMaterial || v.isMeshPhongMaterial ? D.environment : null),
        (B.fog = D.fog));
      const De =
        v.isMeshStandardMaterial || (v.isMeshLambertMaterial && !v.envMap) || (v.isMeshPhongMaterial && !v.envMap);
      ((B.envMap = O.get(v.envMap || B.environment, De)),
        (B.envMapRotation = B.environment !== null && v.envMap === null ? D.environmentRotation : v.envMapRotation),
        ye === void 0 && (v.addEventListener("dispose", ft), (ye = new Map()), (B.programs = ye)));
      let Be = ye.get(Me);
      if (Be !== void 0) {
        if (B.currentProgram === Be && B.lightsStateVersion === _e) return (yo(v, he), Be);
      } else
        ((he.uniforms = ae.getUniforms(v)),
          N !== null && v.isNodeMaterial && N.build(v, k, he),
          v.onBeforeCompile(he, L),
          (Be = ae.acquireProgram(he, Me)),
          ye.set(Me, Be),
          (B.uniforms = he.uniforms));
      const Ee = B.uniforms;
      return (
        ((!v.isShaderMaterial && !v.isRawShaderMaterial) || v.clipping === !0) && (Ee.clippingPlanes = ge.uniform),
        yo(v, he),
        (B.needsLights = kc(v)),
        (B.lightsStateVersion = _e),
        B.needsLights &&
          ((Ee.ambientLightColor.value = z.state.ambient),
          (Ee.lightProbe.value = z.state.probe),
          (Ee.directionalLights.value = z.state.directional),
          (Ee.directionalLightShadows.value = z.state.directionalShadow),
          (Ee.spotLights.value = z.state.spot),
          (Ee.spotLightShadows.value = z.state.spotShadow),
          (Ee.rectAreaLights.value = z.state.rectArea),
          (Ee.ltc_1.value = z.state.rectAreaLTC1),
          (Ee.ltc_2.value = z.state.rectAreaLTC2),
          (Ee.pointLights.value = z.state.point),
          (Ee.pointLightShadows.value = z.state.pointShadow),
          (Ee.hemisphereLights.value = z.state.hemi),
          (Ee.directionalShadowMatrix.value = z.state.directionalShadowMatrix),
          (Ee.spotLightMatrix.value = z.state.spotLightMatrix),
          (Ee.spotLightMap.value = z.state.spotLightMap),
          (Ee.pointShadowMatrix.value = z.state.pointShadowMatrix)),
        (B.lightProbeGrid = T.state.lightProbeGridArray.length > 0),
        (B.currentProgram = Be),
        (B.uniformsList = null),
        Be
      );
    }
    function So(v) {
      if (v.uniformsList === null) {
        const D = v.currentProgram.getUniforms();
        v.uniformsList = Ws.seqWithValue(D.seq, v.uniforms);
      }
      return v.uniformsList;
    }
    function yo(v, D) {
      const k = y.get(v);
      ((k.outputColorSpace = D.outputColorSpace),
        (k.batching = D.batching),
        (k.batchingColor = D.batchingColor),
        (k.instancing = D.instancing),
        (k.instancingColor = D.instancingColor),
        (k.instancingMorph = D.instancingMorph),
        (k.skinning = D.skinning),
        (k.morphTargets = D.morphTargets),
        (k.morphNormals = D.morphNormals),
        (k.morphColors = D.morphColors),
        (k.morphTargetsCount = D.morphTargetsCount),
        (k.numClippingPlanes = D.numClippingPlanes),
        (k.numIntersection = D.numClipIntersection),
        (k.vertexAlphas = D.vertexAlphas),
        (k.vertexTangents = D.vertexTangents),
        (k.toneMapping = D.toneMapping));
    }
    function Bc(v, D) {
      if (v.length === 0) return null;
      if (v.length === 1) return v[0].texture !== null ? v[0] : null;
      b.setFromMatrixPosition(D.matrixWorld);
      for (let k = 0, B = v.length; k < B; k++) {
        const z = v[k];
        if (z.texture !== null && z.boundingBox.containsPoint(b)) return z;
      }
      return null;
    }
    function zc(v, D, k, B, z) {
      (D.isScene !== !0 && (D = _t), _.resetTextureUnits());
      const ue = D.fog,
        _e = B.isMeshStandardMaterial || B.isMeshLambertMaterial || B.isMeshPhongMaterial ? D.environment : null,
        he = U === null ? L.outputColorSpace : U.isXRRenderTarget === !0 ? U.texture.colorSpace : We.workingColorSpace,
        Me = B.isMeshStandardMaterial || (B.isMeshLambertMaterial && !B.envMap) || (B.isMeshPhongMaterial && !B.envMap),
        ye = O.get(B.envMap || _e, Me),
        De = B.vertexColors === !0 && !!k.attributes.color && k.attributes.color.itemSize === 4,
        Be = !!k.attributes.tangent && (!!B.normalMap || B.anisotropy > 0),
        Ee = !!k.morphAttributes.position,
        et = !!k.morphAttributes.normal,
        pt = !!k.morphAttributes.color;
      let ut = on;
      B.toneMapped && (U === null || U.isXRRenderTarget === !0) && (ut = L.toneMapping);
      const tt = k.morphAttributes.position || k.morphAttributes.normal || k.morphAttributes.color,
        Tt = tt !== void 0 ? tt.length : 0,
        me = y.get(B),
        Ut = T.state.lights;
      if (ot === !0 && (Ve === !0 || v !== G)) {
        const rt = v === G && B.id === V;
        ge.setState(B, v, rt);
      }
      let qe = !1;
      B.version === me.__version
        ? ((me.needsLights && me.lightsStateVersion !== Ut.state.version) ||
            me.outputColorSpace !== he ||
            (z.isBatchedMesh && me.batching === !1) ||
            (!z.isBatchedMesh && me.batching === !0) ||
            (z.isBatchedMesh && me.batchingColor === !0 && z.colorTexture === null) ||
            (z.isBatchedMesh && me.batchingColor === !1 && z.colorTexture !== null) ||
            (z.isInstancedMesh && me.instancing === !1) ||
            (!z.isInstancedMesh && me.instancing === !0) ||
            (z.isSkinnedMesh && me.skinning === !1) ||
            (!z.isSkinnedMesh && me.skinning === !0) ||
            (z.isInstancedMesh && me.instancingColor === !0 && z.instanceColor === null) ||
            (z.isInstancedMesh && me.instancingColor === !1 && z.instanceColor !== null) ||
            (z.isInstancedMesh && me.instancingMorph === !0 && z.morphTexture === null) ||
            (z.isInstancedMesh && me.instancingMorph === !1 && z.morphTexture !== null) ||
            me.envMap !== ye ||
            (B.fog === !0 && me.fog !== ue) ||
            (me.numClippingPlanes !== void 0 &&
              (me.numClippingPlanes !== ge.numPlanes || me.numIntersection !== ge.numIntersection)) ||
            me.vertexAlphas !== De ||
            me.vertexTangents !== Be ||
            me.morphTargets !== Ee ||
            me.morphNormals !== et ||
            me.morphColors !== pt ||
            me.toneMapping !== ut ||
            me.morphTargetsCount !== Tt ||
            !!me.lightProbeGrid != T.state.lightProbeGridArray.length > 0) &&
          (qe = !0)
        : ((qe = !0), (me.__version = B.version));
      let zt = me.currentProgram;
      qe === !0 && ((zt = as(B, D, z)), N && B.isNodeMaterial && N.onUpdateProgram(B, zt, me));
      let tn = !1,
        Cn = !1,
        ti = !1;
      const nt = zt.getUniforms(),
        mt = me.uniforms;
      if (
        (oe.useProgram(zt.program) && ((tn = !0), (Cn = !0), (ti = !0)),
        B.id !== V && ((V = B.id), (Cn = !0)),
        me.needsLights)
      ) {
        const rt = Bc(T.state.lightProbeGridArray, z);
        me.lightProbeGrid !== rt && ((me.lightProbeGrid = rt), (Cn = !0));
      }
      if (tn || G !== v) {
        (oe.buffers.depth.getReversed() &&
          v.reversedDepth !== !0 &&
          ((v._reversedDepth = !0), v.updateProjectionMatrix()),
          nt.setValue(I, "projectionMatrix", v.projectionMatrix),
          nt.setValue(I, "viewMatrix", v.matrixWorldInverse));
        const In = nt.map.cameraPosition;
        (In !== void 0 && In.setValue(I, at.setFromMatrixPosition(v.matrixWorld)),
          st.logarithmicDepthBuffer && nt.setValue(I, "logDepthBufFC", 2 / (Math.log(v.far + 1) / Math.LN2)),
          (B.isMeshPhongMaterial ||
            B.isMeshToonMaterial ||
            B.isMeshLambertMaterial ||
            B.isMeshBasicMaterial ||
            B.isMeshStandardMaterial ||
            B.isShaderMaterial) &&
            nt.setValue(I, "isOrthographic", v.isOrthographicCamera === !0),
          G !== v && ((G = v), (Cn = !0), (ti = !0)));
      }
      if (
        (me.needsLights &&
          (Ut.state.directionalShadowMap.length > 0 &&
            nt.setValue(I, "directionalShadowMap", Ut.state.directionalShadowMap, _),
          Ut.state.spotShadowMap.length > 0 && nt.setValue(I, "spotShadowMap", Ut.state.spotShadowMap, _),
          Ut.state.pointShadowMap.length > 0 && nt.setValue(I, "pointShadowMap", Ut.state.pointShadowMap, _)),
        z.isSkinnedMesh)
      ) {
        (nt.setOptional(I, z, "bindMatrix"), nt.setOptional(I, z, "bindMatrixInverse"));
        const rt = z.skeleton;
        rt && (rt.boneTexture === null && rt.computeBoneTexture(), nt.setValue(I, "boneTexture", rt.boneTexture, _));
      }
      z.isBatchedMesh &&
        (nt.setOptional(I, z, "batchingTexture"),
        nt.setValue(I, "batchingTexture", z._matricesTexture, _),
        nt.setOptional(I, z, "batchingIdTexture"),
        nt.setValue(I, "batchingIdTexture", z._indirectTexture, _),
        nt.setOptional(I, z, "batchingColorTexture"),
        z._colorsTexture !== null && nt.setValue(I, "batchingColorTexture", z._colorsTexture, _));
      const Pn = k.morphAttributes;
      if (
        ((Pn.position !== void 0 || Pn.normal !== void 0 || Pn.color !== void 0) && Re.update(z, k, zt),
        (Cn || me.receiveShadow !== z.receiveShadow) &&
          ((me.receiveShadow = z.receiveShadow), nt.setValue(I, "receiveShadow", z.receiveShadow)),
        (B.isMeshStandardMaterial || B.isMeshLambertMaterial || B.isMeshPhongMaterial) &&
          B.envMap === null &&
          D.environment !== null &&
          (mt.envMapIntensity.value = D.environmentIntensity),
        mt.dfgLUT !== void 0 && (mt.dfgLUT.value = v_()),
        Cn)
      ) {
        if (
          (nt.setValue(I, "toneMappingExposure", L.toneMappingExposure),
          me.needsLights && Vc(mt, ti),
          ue && B.fog === !0 && X.refreshFogUniforms(mt, ue),
          X.refreshMaterialUniforms(mt, B, Ue, $e, T.state.transmissionRenderTarget[v.id]),
          me.needsLights && me.lightProbeGrid)
        ) {
          const rt = me.lightProbeGrid;
          ((mt.probesSH.value = rt.texture),
            mt.probesMin.value.copy(rt.boundingBox.min),
            mt.probesMax.value.copy(rt.boundingBox.max),
            mt.probesResolution.value.copy(rt.resolution));
        }
        Ws.upload(I, So(me), mt, _);
      }
      if (
        (B.isShaderMaterial &&
          B.uniformsNeedUpdate === !0 &&
          (Ws.upload(I, So(me), mt, _), (B.uniformsNeedUpdate = !1)),
        B.isSpriteMaterial && nt.setValue(I, "center", z.center),
        nt.setValue(I, "modelViewMatrix", z.modelViewMatrix),
        nt.setValue(I, "normalMatrix", z.normalMatrix),
        nt.setValue(I, "modelMatrix", z.matrixWorld),
        B.uniformsGroups !== void 0)
      ) {
        const rt = B.uniformsGroups;
        for (let In = 0, ni = rt.length; In < ni; In++) {
          const bo = rt[In];
          (q.update(bo, zt), q.bind(bo, zt));
        }
      }
      return zt;
    }
    function Vc(v, D) {
      ((v.ambientLightColor.needsUpdate = D),
        (v.lightProbe.needsUpdate = D),
        (v.directionalLights.needsUpdate = D),
        (v.directionalLightShadows.needsUpdate = D),
        (v.pointLights.needsUpdate = D),
        (v.pointLightShadows.needsUpdate = D),
        (v.spotLights.needsUpdate = D),
        (v.spotLightShadows.needsUpdate = D),
        (v.rectAreaLights.needsUpdate = D),
        (v.hemisphereLights.needsUpdate = D));
    }
    function kc(v) {
      return (
        v.isMeshLambertMaterial ||
        v.isMeshToonMaterial ||
        v.isMeshPhongMaterial ||
        v.isMeshStandardMaterial ||
        v.isShadowMaterial ||
        (v.isShaderMaterial && v.lights === !0)
      );
    }
    ((this.getActiveCubeFace = function () {
      return H;
    }),
      (this.getActiveMipmapLevel = function () {
        return W;
      }),
      (this.getRenderTarget = function () {
        return U;
      }),
      (this.setRenderTargetTextures = function (v, D, k) {
        const B = y.get(v);
        ((B.__autoAllocateDepthBuffer = v.resolveDepthBuffer === !1),
          B.__autoAllocateDepthBuffer === !1 && (B.__useRenderToTexture = !1),
          (y.get(v.texture).__webglTexture = D),
          (y.get(v.depthTexture).__webglTexture = B.__autoAllocateDepthBuffer ? void 0 : k),
          (B.__hasExternalTextures = !0));
      }),
      (this.setRenderTargetFramebuffer = function (v, D) {
        const k = y.get(v);
        ((k.__webglFramebuffer = D), (k.__useDefaultFramebuffer = D === void 0));
      }));
    const Gc = I.createFramebuffer();
    ((this.setRenderTarget = function (v, D = 0, k = 0) {
      ((U = v), (H = D), (W = k));
      let B = null,
        z = !1,
        ue = !1;
      if (v) {
        const he = y.get(v);
        if (he.__useDefaultFramebuffer !== void 0) {
          (oe.bindFramebuffer(I.FRAMEBUFFER, he.__webglFramebuffer),
            J.copy(v.viewport),
            Q.copy(v.scissor),
            (ce = v.scissorTest),
            oe.viewport(J),
            oe.scissor(Q),
            oe.setScissorTest(ce),
            (V = -1));
          return;
        } else if (he.__webglFramebuffer === void 0) _.setupRenderTarget(v);
        else if (he.__hasExternalTextures)
          _.rebindTextures(v, y.get(v.texture).__webglTexture, y.get(v.depthTexture).__webglTexture);
        else if (v.depthBuffer) {
          const De = v.depthTexture;
          if (he.__boundDepthTexture !== De) {
            if (De !== null && y.has(De) && (v.width !== De.image.width || v.height !== De.image.height))
              throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");
            _.setupDepthRenderbuffer(v);
          }
        }
        const Me = v.texture;
        (Me.isData3DTexture || Me.isDataArrayTexture || Me.isCompressedArrayTexture) && (ue = !0);
        const ye = y.get(v).__webglFramebuffer;
        (v.isWebGLCubeRenderTarget
          ? (Array.isArray(ye[D]) ? (B = ye[D][k]) : (B = ye[D]), (z = !0))
          : v.samples > 0 && _.useMultisampledRTT(v) === !1
            ? (B = y.get(v).__webglMultisampledFramebuffer)
            : Array.isArray(ye)
              ? (B = ye[k])
              : (B = ye),
          J.copy(v.viewport),
          Q.copy(v.scissor),
          (ce = v.scissorTest));
      } else (J.copy(ie).multiplyScalar(Ue).floor(), Q.copy(Ae).multiplyScalar(Ue).floor(), (ce = Pe));
      if (
        (k !== 0 && (B = Gc),
        oe.bindFramebuffer(I.FRAMEBUFFER, B) && oe.drawBuffers(v, B),
        oe.viewport(J),
        oe.scissor(Q),
        oe.setScissorTest(ce),
        z)
      ) {
        const he = y.get(v.texture);
        I.framebufferTexture2D(
          I.FRAMEBUFFER,
          I.COLOR_ATTACHMENT0,
          I.TEXTURE_CUBE_MAP_POSITIVE_X + D,
          he.__webglTexture,
          k,
        );
      } else if (ue) {
        const he = D;
        for (let Me = 0; Me < v.textures.length; Me++) {
          const ye = y.get(v.textures[Me]);
          I.framebufferTextureLayer(I.FRAMEBUFFER, I.COLOR_ATTACHMENT0 + Me, ye.__webglTexture, k, he);
        }
      } else if (v !== null && k !== 0) {
        const he = y.get(v.texture);
        I.framebufferTexture2D(I.FRAMEBUFFER, I.COLOR_ATTACHMENT0, I.TEXTURE_2D, he.__webglTexture, k);
      }
      V = -1;
    }),
      (this.readRenderTargetPixels = function (v, D, k, B, z, ue, _e, he = 0) {
        if (!(v && v.isWebGLRenderTarget)) {
          Te("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
          return;
        }
        let Me = y.get(v).__webglFramebuffer;
        if ((v.isWebGLCubeRenderTarget && _e !== void 0 && (Me = Me[_e]), Me)) {
          oe.bindFramebuffer(I.FRAMEBUFFER, Me);
          try {
            const ye = v.textures[he],
              De = ye.format,
              Be = ye.type;
            if ((v.textures.length > 1 && I.readBuffer(I.COLOR_ATTACHMENT0 + he), !st.textureFormatReadable(De))) {
              Te("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
              return;
            }
            if (!st.textureTypeReadable(Be)) {
              Te(
                "WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.",
              );
              return;
            }
            D >= 0 &&
              D <= v.width - B &&
              k >= 0 &&
              k <= v.height - z &&
              I.readPixels(D, k, B, z, C.convert(De), C.convert(Be), ue);
          } finally {
            const ye = U !== null ? y.get(U).__webglFramebuffer : null;
            oe.bindFramebuffer(I.FRAMEBUFFER, ye);
          }
        }
      }),
      (this.readRenderTargetPixelsAsync = async function (v, D, k, B, z, ue, _e, he = 0) {
        if (!(v && v.isWebGLRenderTarget))
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        let Me = y.get(v).__webglFramebuffer;
        if ((v.isWebGLCubeRenderTarget && _e !== void 0 && (Me = Me[_e]), Me))
          if (D >= 0 && D <= v.width - B && k >= 0 && k <= v.height - z) {
            oe.bindFramebuffer(I.FRAMEBUFFER, Me);
            const ye = v.textures[he],
              De = ye.format,
              Be = ye.type;
            if ((v.textures.length > 1 && I.readBuffer(I.COLOR_ATTACHMENT0 + he), !st.textureFormatReadable(De)))
              throw new Error(
                "THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.",
              );
            if (!st.textureTypeReadable(Be))
              throw new Error(
                "THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.",
              );
            const Ee = I.createBuffer();
            (I.bindBuffer(I.PIXEL_PACK_BUFFER, Ee),
              I.bufferData(I.PIXEL_PACK_BUFFER, ue.byteLength, I.STREAM_READ),
              I.readPixels(D, k, B, z, C.convert(De), C.convert(Be), 0));
            const et = U !== null ? y.get(U).__webglFramebuffer : null;
            oe.bindFramebuffer(I.FRAMEBUFFER, et);
            const pt = I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE, 0);
            return (
              I.flush(),
              await Ih(I, pt, 4),
              I.bindBuffer(I.PIXEL_PACK_BUFFER, Ee),
              I.getBufferSubData(I.PIXEL_PACK_BUFFER, 0, ue),
              I.deleteBuffer(Ee),
              I.deleteSync(pt),
              ue
            );
          } else
            throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
      }),
      (this.copyFramebufferToTexture = function (v, D = null, k = 0) {
        const B = Math.pow(2, -k),
          z = Math.floor(v.image.width * B),
          ue = Math.floor(v.image.height * B),
          _e = D !== null ? D.x : 0,
          he = D !== null ? D.y : 0;
        (_.setTexture2D(v, 0), I.copyTexSubImage2D(I.TEXTURE_2D, k, 0, 0, _e, he, z, ue), oe.unbindTexture());
      }));
    const Hc = I.createFramebuffer(),
      Wc = I.createFramebuffer();
    ((this.copyTextureToTexture = function (v, D, k = null, B = null, z = 0, ue = 0) {
      let _e, he, Me, ye, De, Be, Ee, et, pt;
      const ut = v.isCompressedTexture ? v.mipmaps[ue] : v.image;
      if (k !== null)
        ((_e = k.max.x - k.min.x),
          (he = k.max.y - k.min.y),
          (Me = k.isBox3 ? k.max.z - k.min.z : 1),
          (ye = k.min.x),
          (De = k.min.y),
          (Be = k.isBox3 ? k.min.z : 0));
      else {
        const mt = Math.pow(2, -z);
        ((_e = Math.floor(ut.width * mt)),
          (he = Math.floor(ut.height * mt)),
          v.isDataArrayTexture ? (Me = ut.depth) : v.isData3DTexture ? (Me = Math.floor(ut.depth * mt)) : (Me = 1),
          (ye = 0),
          (De = 0),
          (Be = 0));
      }
      B !== null ? ((Ee = B.x), (et = B.y), (pt = B.z)) : ((Ee = 0), (et = 0), (pt = 0));
      const tt = C.convert(D.format),
        Tt = C.convert(D.type);
      let me;
      (D.isData3DTexture
        ? (_.setTexture3D(D, 0), (me = I.TEXTURE_3D))
        : D.isDataArrayTexture || D.isCompressedArrayTexture
          ? (_.setTexture2DArray(D, 0), (me = I.TEXTURE_2D_ARRAY))
          : (_.setTexture2D(D, 0), (me = I.TEXTURE_2D)),
        oe.activeTexture(I.TEXTURE0),
        oe.pixelStorei(I.UNPACK_FLIP_Y_WEBGL, D.flipY),
        oe.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL, D.premultiplyAlpha),
        oe.pixelStorei(I.UNPACK_ALIGNMENT, D.unpackAlignment));
      const Ut = oe.getParameter(I.UNPACK_ROW_LENGTH),
        qe = oe.getParameter(I.UNPACK_IMAGE_HEIGHT),
        zt = oe.getParameter(I.UNPACK_SKIP_PIXELS),
        tn = oe.getParameter(I.UNPACK_SKIP_ROWS),
        Cn = oe.getParameter(I.UNPACK_SKIP_IMAGES);
      (oe.pixelStorei(I.UNPACK_ROW_LENGTH, ut.width),
        oe.pixelStorei(I.UNPACK_IMAGE_HEIGHT, ut.height),
        oe.pixelStorei(I.UNPACK_SKIP_PIXELS, ye),
        oe.pixelStorei(I.UNPACK_SKIP_ROWS, De),
        oe.pixelStorei(I.UNPACK_SKIP_IMAGES, Be));
      const ti = v.isDataArrayTexture || v.isData3DTexture,
        nt = D.isDataArrayTexture || D.isData3DTexture;
      if (v.isDepthTexture) {
        const mt = y.get(v),
          Pn = y.get(D),
          rt = y.get(mt.__renderTarget),
          In = y.get(Pn.__renderTarget);
        (oe.bindFramebuffer(I.READ_FRAMEBUFFER, rt.__webglFramebuffer),
          oe.bindFramebuffer(I.DRAW_FRAMEBUFFER, In.__webglFramebuffer));
        for (let ni = 0; ni < Me; ni++)
          (ti &&
            (I.framebufferTextureLayer(I.READ_FRAMEBUFFER, I.COLOR_ATTACHMENT0, y.get(v).__webglTexture, z, Be + ni),
            I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER, I.COLOR_ATTACHMENT0, y.get(D).__webglTexture, ue, pt + ni)),
            I.blitFramebuffer(ye, De, _e, he, Ee, et, _e, he, I.DEPTH_BUFFER_BIT, I.NEAREST));
        (oe.bindFramebuffer(I.READ_FRAMEBUFFER, null), oe.bindFramebuffer(I.DRAW_FRAMEBUFFER, null));
      } else if (z !== 0 || v.isRenderTargetTexture || y.has(v)) {
        const mt = y.get(v),
          Pn = y.get(D);
        (oe.bindFramebuffer(I.READ_FRAMEBUFFER, Hc), oe.bindFramebuffer(I.DRAW_FRAMEBUFFER, Wc));
        for (let rt = 0; rt < Me; rt++)
          (ti
            ? I.framebufferTextureLayer(I.READ_FRAMEBUFFER, I.COLOR_ATTACHMENT0, mt.__webglTexture, z, Be + rt)
            : I.framebufferTexture2D(I.READ_FRAMEBUFFER, I.COLOR_ATTACHMENT0, I.TEXTURE_2D, mt.__webglTexture, z),
            nt
              ? I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER, I.COLOR_ATTACHMENT0, Pn.__webglTexture, ue, pt + rt)
              : I.framebufferTexture2D(I.DRAW_FRAMEBUFFER, I.COLOR_ATTACHMENT0, I.TEXTURE_2D, Pn.__webglTexture, ue),
            z !== 0
              ? I.blitFramebuffer(ye, De, _e, he, Ee, et, _e, he, I.COLOR_BUFFER_BIT, I.NEAREST)
              : nt
                ? I.copyTexSubImage3D(me, ue, Ee, et, pt + rt, ye, De, _e, he)
                : I.copyTexSubImage2D(me, ue, Ee, et, ye, De, _e, he));
        (oe.bindFramebuffer(I.READ_FRAMEBUFFER, null), oe.bindFramebuffer(I.DRAW_FRAMEBUFFER, null));
      } else
        nt
          ? v.isDataTexture || v.isData3DTexture
            ? I.texSubImage3D(me, ue, Ee, et, pt, _e, he, Me, tt, Tt, ut.data)
            : D.isCompressedArrayTexture
              ? I.compressedTexSubImage3D(me, ue, Ee, et, pt, _e, he, Me, tt, ut.data)
              : I.texSubImage3D(me, ue, Ee, et, pt, _e, he, Me, tt, Tt, ut)
          : v.isDataTexture
            ? I.texSubImage2D(I.TEXTURE_2D, ue, Ee, et, _e, he, tt, Tt, ut.data)
            : v.isCompressedTexture
              ? I.compressedTexSubImage2D(I.TEXTURE_2D, ue, Ee, et, ut.width, ut.height, tt, ut.data)
              : I.texSubImage2D(I.TEXTURE_2D, ue, Ee, et, _e, he, tt, Tt, ut);
      (oe.pixelStorei(I.UNPACK_ROW_LENGTH, Ut),
        oe.pixelStorei(I.UNPACK_IMAGE_HEIGHT, qe),
        oe.pixelStorei(I.UNPACK_SKIP_PIXELS, zt),
        oe.pixelStorei(I.UNPACK_SKIP_ROWS, tn),
        oe.pixelStorei(I.UNPACK_SKIP_IMAGES, Cn),
        ue === 0 && D.generateMipmaps && I.generateMipmap(me),
        oe.unbindTexture());
    }),
      (this.initRenderTarget = function (v) {
        y.get(v).__webglFramebuffer === void 0 && _.setupRenderTarget(v);
      }),
      (this.initTexture = function (v) {
        (v.isCubeTexture
          ? _.setTextureCube(v, 0)
          : v.isData3DTexture
            ? _.setTexture3D(v, 0)
            : v.isDataArrayTexture || v.isCompressedArrayTexture
              ? _.setTexture2DArray(v, 0)
              : _.setTexture2D(v, 0),
          oe.unbindTexture());
      }),
      (this.resetState = function () {
        ((H = 0), (W = 0), (U = null), oe.reset(), ne.reset());
      }),
      typeof __THREE_DEVTOOLS__ < "u" &&
        __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this })));
  }
  get coordinateSystem() {
    return an;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(e) {
    this._outputColorSpace = e;
    const t = this.getContext();
    ((t.drawingBufferColorSpace = We._getDrawingBufferColorSpace(e)), (t.unpackColorSpace = We._getUnpackColorSpace()));
  }
}
export {
  Mt as $,
  Yl as A,
  Gn as B,
  q_ as C,
  k_ as D,
  fr as E,
  rd as F,
  Z_ as G,
  B_ as H,
  je as I,
  V_ as J,
  z_ as K,
  vt as L,
  uc as M,
  R_ as N,
  dt as O,
  Ot as P,
  ln as Q,
  rr as R,
  A_ as S,
  O_ as T,
  fc as U,
  F as V,
  j_ as W,
  pc as X,
  dc as Y,
  G_ as Z,
  Lt as _,
  bc as a,
  lc as a0,
  Ie as a1,
  yc as a2,
  un as a3,
  fl as a4,
  tr as a5,
  lr as a6,
  er as a7,
  y_ as a8,
  E_ as a9,
  is as aA,
  wn as aB,
  F_ as aC,
  Co as aD,
  jt as aE,
  id as aF,
  To as aG,
  It as aH,
  ar as aI,
  ns as aJ,
  _c as aK,
  ro as aL,
  nd as aM,
  b_ as aa,
  D_ as ab,
  Ks as ac,
  C_ as ad,
  Qo as ae,
  W_ as af,
  Wt as ag,
  w_ as ah,
  zn as ai,
  os as aj,
  mr as ak,
  mh as al,
  Et as am,
  aa as an,
  Su as ao,
  Rn as ap,
  qu as aq,
  Mn as ar,
  Mu as as,
  P_ as at,
  I_ as au,
  oo as av,
  Ys as aw,
  Oa as ax,
  hc as ay,
  kn as az,
  Xt as b,
  kt as c,
  T_ as d,
  Rt as e,
  dn as f,
  X_ as g,
  K_ as h,
  M_ as i,
  S_ as j,
  Y_ as k,
  Ge as l,
  Zn as m,
  it as n,
  L_ as o,
  Ii as p,
  H_ as q,
  ra as r,
  $t as s,
  U_ as t,
  N_ as u,
  We as v,
  Ce as w,
  He as x,
  hs as y,
  pu as z,
};
