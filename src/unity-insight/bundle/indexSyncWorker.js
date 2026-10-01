import { createRequire as __unityInsightCreateRequire } from "node:module";
import { insightHome as __gcuInsightHome, indexDirectory as __gcuInsightIndexDirectory } from "./gamecowork-worker-paths.js";
import { fileURLToPath as __unityInsightFileURLToPath } from "node:url";
import { dirname as __unityInsightDirname } from "node:path";
const __filename = __unityInsightFileURLToPath(import.meta.url);
const __dirname = __unityInsightDirname(__filename);
const require = __unityInsightCreateRequire(import.meta.url);
var SI = Object.create;
var Ad = Object.defineProperty;
var _I = Object.getOwnPropertyDescriptor;
var EI = Object.getOwnPropertyNames;
var RI = Object.getPrototypeOf,
  wI = Object.prototype.hasOwnProperty;
var ur = ((e) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
      ? new Proxy(e, { get: (t, n) => (typeof require < "u" ? require : t)[n] })
      : e)(function (e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
});
var O = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var PI = (e, t, n, i) => {
  if ((t && typeof t == "object") || typeof t == "function")
    for (let r of EI(t))
      !wI.call(e, r) && r !== n && Ad(e, r, { get: () => t[r], enumerable: !(i = _I(t, r)) || i.enumerable });
  return e;
};
var Od = (e, t, n) => (
  (n = e != null ? SI(RI(e)) : {}),
  PI(t || !e || !e.__esModule ? Ad(n, "default", { value: e, enumerable: !0 }) : n, e)
);
var q = O((ke) => {
  "use strict";
  var Ua = Symbol.for("yaml.alias"),
    em = Symbol.for("yaml.document"),
    Wr = Symbol.for("yaml.map"),
    tm = Symbol.for("yaml.pair"),
    Aa = Symbol.for("yaml.scalar"),
    qr = Symbol.for("yaml.seq"),
    It = Symbol.for("yaml.node.type"),
    GR = (e) => !!e && typeof e == "object" && e[It] === Ua,
    KR = (e) => !!e && typeof e == "object" && e[It] === em,
    YR = (e) => !!e && typeof e == "object" && e[It] === Wr,
    VR = (e) => !!e && typeof e == "object" && e[It] === tm,
    nm = (e) => !!e && typeof e == "object" && e[It] === Aa,
    WR = (e) => !!e && typeof e == "object" && e[It] === qr;
  function im(e) {
    if (e && typeof e == "object")
      switch (e[It]) {
        case Wr:
        case qr:
          return !0;
      }
    return !1;
  }
  function qR(e) {
    if (e && typeof e == "object")
      switch (e[It]) {
        case Ua:
        case Wr:
        case Aa:
        case qr:
          return !0;
      }
    return !1;
  }
  var zR = (e) => (nm(e) || im(e)) && !!e.anchor;
  ke.ALIAS = Ua;
  ke.DOC = em;
  ke.MAP = Wr;
  ke.NODE_TYPE = It;
  ke.PAIR = tm;
  ke.SCALAR = Aa;
  ke.SEQ = qr;
  ke.hasAnchor = zR;
  ke.isAlias = GR;
  ke.isCollection = im;
  ke.isDocument = KR;
  ke.isMap = YR;
  ke.isNode = qR;
  ke.isPair = VR;
  ke.isScalar = nm;
  ke.isSeq = WR;
});
var bi = O((Oa) => {
  "use strict";
  var Se = q(),
    je = Symbol("break visit"),
    rm = Symbol("skip children"),
    at = Symbol("remove node");
  function zr(e, t) {
    let n = sm(t);
    Se.isDocument(e)
      ? An(null, e.contents, n, Object.freeze([e])) === at && (e.contents = null)
      : An(null, e, n, Object.freeze([]));
  }
  zr.BREAK = je;
  zr.SKIP = rm;
  zr.REMOVE = at;
  function An(e, t, n, i) {
    let r = om(e, t, n, i);
    if (Se.isNode(r) || Se.isPair(r)) return (am(e, i, r), An(e, r, n, i));
    if (typeof r != "symbol") {
      if (Se.isCollection(t)) {
        i = Object.freeze(i.concat(t));
        for (let s = 0; s < t.items.length; ++s) {
          let o = An(s, t.items[s], n, i);
          if (typeof o == "number") s = o - 1;
          else {
            if (o === je) return je;
            o === at && (t.items.splice(s, 1), (s -= 1));
          }
        }
      } else if (Se.isPair(t)) {
        i = Object.freeze(i.concat(t));
        let s = An("key", t.key, n, i);
        if (s === je) return je;
        s === at && (t.key = null);
        let o = An("value", t.value, n, i);
        if (o === je) return je;
        o === at && (t.value = null);
      }
    }
    return r;
  }
  async function Hr(e, t) {
    let n = sm(t);
    Se.isDocument(e)
      ? (await On(null, e.contents, n, Object.freeze([e]))) === at && (e.contents = null)
      : await On(null, e, n, Object.freeze([]));
  }
  Hr.BREAK = je;
  Hr.SKIP = rm;
  Hr.REMOVE = at;
  async function On(e, t, n, i) {
    let r = await om(e, t, n, i);
    if (Se.isNode(r) || Se.isPair(r)) return (am(e, i, r), On(e, r, n, i));
    if (typeof r != "symbol") {
      if (Se.isCollection(t)) {
        i = Object.freeze(i.concat(t));
        for (let s = 0; s < t.items.length; ++s) {
          let o = await On(s, t.items[s], n, i);
          if (typeof o == "number") s = o - 1;
          else {
            if (o === je) return je;
            o === at && (t.items.splice(s, 1), (s -= 1));
          }
        }
      } else if (Se.isPair(t)) {
        i = Object.freeze(i.concat(t));
        let s = await On("key", t.key, n, i);
        if (s === je) return je;
        s === at && (t.key = null);
        let o = await On("value", t.value, n, i);
        if (o === je) return je;
        o === at && (t.value = null);
      }
    }
    return r;
  }
  function sm(e) {
    return typeof e == "object" && (e.Collection || e.Node || e.Value)
      ? Object.assign(
          { Alias: e.Node, Map: e.Node, Scalar: e.Node, Seq: e.Node },
          e.Value && { Map: e.Value, Scalar: e.Value, Seq: e.Value },
          e.Collection && { Map: e.Collection, Seq: e.Collection },
          e,
        )
      : e;
  }
  function om(e, t, n, i) {
    if (typeof n == "function") return n(e, t, i);
    if (Se.isMap(t)) return n.Map?.(e, t, i);
    if (Se.isSeq(t)) return n.Seq?.(e, t, i);
    if (Se.isPair(t)) return n.Pair?.(e, t, i);
    if (Se.isScalar(t)) return n.Scalar?.(e, t, i);
    if (Se.isAlias(t)) return n.Alias?.(e, t, i);
  }
  function am(e, t, n) {
    let i = t[t.length - 1];
    if (Se.isCollection(i)) i.items[e] = n;
    else if (Se.isPair(i)) e === "key" ? (i.key = n) : (i.value = n);
    else if (Se.isDocument(i)) i.contents = n;
    else {
      let r = Se.isAlias(i) ? "alias" : "scalar";
      throw new Error(`Cannot replace node with ${r} parent`);
    }
  }
  Oa.visit = zr;
  Oa.visitAsync = Hr;
});
var Fa = O((cm) => {
  "use strict";
  var lm = q(),
    HR = bi(),
    JR = { "!": "%21", ",": "%2C", "[": "%5B", "]": "%5D", "{": "%7B", "}": "%7D" },
    XR = (e) => e.replace(/[!,[\]{}]/g, (t) => JR[t]),
    Si = class e {
      constructor(t, n) {
        ((this.docStart = null),
          (this.docEnd = !1),
          (this.yaml = Object.assign({}, e.defaultYaml, t)),
          (this.tags = Object.assign({}, e.defaultTags, n)));
      }
      clone() {
        let t = new e(this.yaml, this.tags);
        return ((t.docStart = this.docStart), t);
      }
      atDocument() {
        let t = new e(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = !0;
            break;
          case "1.2":
            ((this.atNextDocument = !1),
              (this.yaml = { explicit: e.defaultYaml.explicit, version: "1.2" }),
              (this.tags = Object.assign({}, e.defaultTags)));
            break;
        }
        return t;
      }
      add(t, n) {
        this.atNextDocument &&
          ((this.yaml = { explicit: e.defaultYaml.explicit, version: "1.1" }),
          (this.tags = Object.assign({}, e.defaultTags)),
          (this.atNextDocument = !1));
        let i = t.trim().split(/[ \t]+/),
          r = i.shift();
        switch (r) {
          case "%TAG": {
            if (i.length !== 2 && (n(0, "%TAG directive should contain exactly two parts"), i.length < 2)) return !1;
            let [s, o] = i;
            return ((this.tags[s] = o), !0);
          }
          case "%YAML": {
            if (((this.yaml.explicit = !0), i.length !== 1))
              return (n(0, "%YAML directive should contain exactly one part"), !1);
            let [s] = i;
            if (s === "1.1" || s === "1.2") return ((this.yaml.version = s), !0);
            {
              let o = /^\d+\.\d+$/.test(s);
              return (n(6, `Unsupported YAML version ${s}`, o), !1);
            }
          }
          default:
            return (n(0, `Unknown directive ${r}`, !0), !1);
        }
      }
      tagName(t, n) {
        if (t === "!") return "!";
        if (t[0] !== "!") return (n(`Not a valid tag: ${t}`), null);
        if (t[1] === "<") {
          let o = t.slice(2, -1);
          return o === "!" || o === "!!"
            ? (n(`Verbatim tags aren't resolved, so ${t} is invalid.`), null)
            : (t[t.length - 1] !== ">" && n("Verbatim tags must end with a >"), o);
        }
        let [, i, r] = t.match(/^(.*!)([^!]*)$/s);
        r || n(`The ${t} tag has no suffix`);
        let s = this.tags[i];
        if (s)
          try {
            return s + decodeURIComponent(r);
          } catch (o) {
            return (n(String(o)), null);
          }
        return i === "!" ? t : (n(`Could not resolve tag: ${t}`), null);
      }
      tagString(t) {
        for (let [n, i] of Object.entries(this.tags)) if (t.startsWith(i)) return n + XR(t.substring(i.length));
        return t[0] === "!" ? t : `!<${t}>`;
      }
      toString(t) {
        let n = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [],
          i = Object.entries(this.tags),
          r;
        if (t && i.length > 0 && lm.isNode(t.contents)) {
          let s = {};
          (HR.visit(t.contents, (o, a) => {
            lm.isNode(a) && a.tag && (s[a.tag] = !0);
          }),
            (r = Object.keys(s)));
        } else r = [];
        for (let [s, o] of i)
          (s === "!!" && o === "tag:yaml.org,2002:") ||
            ((!t || r.some((a) => a.startsWith(o))) && n.push(`%TAG ${s} ${o}`));
        return n.join(`
`);
      }
    };
  Si.defaultYaml = { explicit: !1, version: "1.2" };
  Si.defaultTags = { "!!": "tag:yaml.org,2002:" };
  cm.Directives = Si;
});
var Jr = O((_i) => {
  "use strict";
  var dm = q(),
    QR = bi();
  function ZR(e) {
    if (/[\x00-\x19\s,[\]{}]/.test(e)) {
      let n = `Anchor must not contain whitespace or control characters: ${JSON.stringify(e)}`;
      throw new Error(n);
    }
    return !0;
  }
  function um(e) {
    let t = new Set();
    return (
      QR.visit(e, {
        Value(n, i) {
          i.anchor && t.add(i.anchor);
        },
      }),
      t
    );
  }
  function fm(e, t) {
    for (let n = 1; ; ++n) {
      let i = `${e}${n}`;
      if (!t.has(i)) return i;
    }
  }
  function ew(e, t) {
    let n = [],
      i = new Map(),
      r = null;
    return {
      onAnchor: (s) => {
        (n.push(s), r ?? (r = um(e)));
        let o = fm(t, r);
        return (r.add(o), o);
      },
      setAnchors: () => {
        for (let s of n) {
          let o = i.get(s);
          if (typeof o == "object" && o.anchor && (dm.isScalar(o.node) || dm.isCollection(o.node)))
            o.node.anchor = o.anchor;
          else {
            let a = new Error("Failed to resolve repeated object (this should not happen)");
            throw ((a.source = s), a);
          }
        }
      },
      sourceObjects: i,
    };
  }
  _i.anchorIsValid = ZR;
  _i.anchorNames = um;
  _i.createNodeAnchors = ew;
  _i.findNewAnchor = fm;
});
var Na = O((mm) => {
  "use strict";
  function Ei(e, t, n, i) {
    if (i && typeof i == "object")
      if (Array.isArray(i))
        for (let r = 0, s = i.length; r < s; ++r) {
          let o = i[r],
            a = Ei(e, i, String(r), o);
          a === void 0 ? delete i[r] : a !== o && (i[r] = a);
        }
      else if (i instanceof Map)
        for (let r of Array.from(i.keys())) {
          let s = i.get(r),
            o = Ei(e, i, r, s);
          o === void 0 ? i.delete(r) : o !== s && i.set(r, o);
        }
      else if (i instanceof Set)
        for (let r of Array.from(i)) {
          let s = Ei(e, i, r, r);
          s === void 0 ? i.delete(r) : s !== r && (i.delete(r), i.add(s));
        }
      else
        for (let [r, s] of Object.entries(i)) {
          let o = Ei(e, i, r, s);
          o === void 0 ? delete i[r] : o !== s && (i[r] = o);
        }
    return e.call(t, n, i);
  }
  mm.applyReviver = Ei;
});
var Tt = O((gm) => {
  "use strict";
  var tw = q();
  function ym(e, t, n) {
    if (Array.isArray(e)) return e.map((i, r) => ym(i, String(r), n));
    if (e && typeof e.toJSON == "function") {
      if (!n || !tw.hasAnchor(e)) return e.toJSON(t, n);
      let i = { aliasCount: 0, count: 1, res: void 0 };
      (n.anchors.set(e, i),
        (n.onCreate = (s) => {
          ((i.res = s), delete n.onCreate);
        }));
      let r = e.toJSON(t, n);
      return (n.onCreate && n.onCreate(r), r);
    }
    return typeof e == "bigint" && !n?.keep ? Number(e) : e;
  }
  gm.toJS = ym;
});
var Xr = O((hm) => {
  "use strict";
  var nw = Na(),
    pm = q(),
    iw = Tt(),
    La = class {
      constructor(t) {
        Object.defineProperty(this, pm.NODE_TYPE, { value: t });
      }
      clone() {
        let t = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        return (this.range && (t.range = this.range.slice()), t);
      }
      toJS(t, { mapAsMap: n, maxAliasCount: i, onAnchor: r, reviver: s } = {}) {
        if (!pm.isDocument(t)) throw new TypeError("A document argument is required");
        let o = {
            anchors: new Map(),
            doc: t,
            keep: !0,
            mapAsMap: n === !0,
            mapKeyWarned: !1,
            maxAliasCount: typeof i == "number" ? i : 100,
          },
          a = iw.toJS(this, "", o);
        if (typeof r == "function") for (let { count: l, res: c } of o.anchors.values()) r(c, l);
        return typeof s == "function" ? nw.applyReviver(s, { "": a }, "", a) : a;
      }
    };
  hm.NodeBase = La;
});
var Ri = O((Im) => {
  "use strict";
  var rw = Jr(),
    sw = bi(),
    Fn = q(),
    ow = Xr(),
    aw = Tt(),
    Da = class extends ow.NodeBase {
      constructor(t) {
        (super(Fn.ALIAS),
          (this.source = t),
          Object.defineProperty(this, "tag", {
            set() {
              throw new Error("Alias nodes cannot have tags");
            },
          }));
      }
      resolve(t, n) {
        if (n?.maxAliasCount === 0) throw new ReferenceError("Alias resolution is disabled");
        let i;
        n?.aliasResolveCache
          ? (i = n.aliasResolveCache)
          : ((i = []),
            sw.visit(t, {
              Node: (s, o) => {
                (Fn.isAlias(o) || Fn.hasAnchor(o)) && i.push(o);
              },
            }),
            n && (n.aliasResolveCache = i));
        let r;
        for (let s of i) {
          if (s === this) break;
          s.anchor === this.source && (r = s);
        }
        return r;
      }
      toJSON(t, n) {
        if (!n) return { source: this.source };
        let { anchors: i, doc: r, maxAliasCount: s } = n,
          o = this.resolve(r, n);
        if (!o) {
          let l = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(l);
        }
        let a = i.get(o);
        if ((a || (aw.toJS(o, null, n), (a = i.get(o))), a?.res === void 0)) {
          let l = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(l);
        }
        if (
          s >= 0 &&
          ((a.count += 1), a.aliasCount === 0 && (a.aliasCount = Qr(r, o, i)), a.count * a.aliasCount > s)
        ) {
          let l = "Excessive alias count indicates a resource exhaustion attack";
          throw new ReferenceError(l);
        }
        return a.res;
      }
      toString(t, n, i) {
        let r = `*${this.source}`;
        if (t) {
          if ((rw.anchorIsValid(this.source), t.options.verifyAliasOrder && !t.anchors.has(this.source))) {
            let s = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(s);
          }
          if (t.implicitKey) return `${r} `;
        }
        return r;
      }
    };
  function Qr(e, t, n) {
    if (Fn.isAlias(t)) {
      let i = t.resolve(e),
        r = n && i && n.get(i);
      return r ? r.count * r.aliasCount : 0;
    } else if (Fn.isCollection(t)) {
      let i = 0;
      for (let r of t.items) {
        let s = Qr(e, r, n);
        s > i && (i = s);
      }
      return i;
    } else if (Fn.isPair(t)) {
      let i = Qr(e, t.key, n),
        r = Qr(e, t.value, n);
      return Math.max(i, r);
    }
    return 1;
  }
  Im.Alias = Da;
});
var ge = O((Ca) => {
  "use strict";
  var lw = q(),
    cw = Xr(),
    dw = Tt(),
    uw = (e) => !e || (typeof e != "function" && typeof e != "object"),
    Ut = class extends cw.NodeBase {
      constructor(t) {
        (super(lw.SCALAR), (this.value = t));
      }
      toJSON(t, n) {
        return n?.keep ? this.value : dw.toJS(this.value, t, n);
      }
      toString() {
        return String(this.value);
      }
    };
  Ut.BLOCK_FOLDED = "BLOCK_FOLDED";
  Ut.BLOCK_LITERAL = "BLOCK_LITERAL";
  Ut.PLAIN = "PLAIN";
  Ut.QUOTE_DOUBLE = "QUOTE_DOUBLE";
  Ut.QUOTE_SINGLE = "QUOTE_SINGLE";
  Ca.Scalar = Ut;
  Ca.isScalarValue = uw;
});
var wi = O((Sm) => {
  "use strict";
  var fw = Ri(),
    on = q(),
    bm = ge(),
    mw = "tag:yaml.org,2002:";
  function yw(e, t, n) {
    if (t) {
      let i = n.filter((s) => s.tag === t),
        r = i.find((s) => !s.format) ?? i[0];
      if (!r) throw new Error(`Tag ${t} not found`);
      return r;
    }
    return n.find((i) => i.identify?.(e) && !i.format);
  }
  function gw(e, t, n) {
    if ((on.isDocument(e) && (e = e.contents), on.isNode(e))) return e;
    if (on.isPair(e)) {
      let u = n.schema[on.MAP].createNode?.(n.schema, null, n);
      return (u.items.push(e), u);
    }
    (e instanceof String ||
      e instanceof Number ||
      e instanceof Boolean ||
      (typeof BigInt < "u" && e instanceof BigInt)) &&
      (e = e.valueOf());
    let { aliasDuplicateObjects: i, onAnchor: r, onTagObj: s, schema: o, sourceObjects: a } = n,
      l;
    if (i && e && typeof e == "object") {
      if (((l = a.get(e)), l)) return (l.anchor ?? (l.anchor = r(e)), new fw.Alias(l.anchor));
      ((l = { anchor: null, node: null }), a.set(e, l));
    }
    t?.startsWith("!!") && (t = mw + t.slice(2));
    let c = yw(e, t, o.tags);
    if (!c) {
      if ((e && typeof e.toJSON == "function" && (e = e.toJSON()), !e || typeof e != "object")) {
        let u = new bm.Scalar(e);
        return (l && (l.node = u), u);
      }
      c = e instanceof Map ? o[on.MAP] : Symbol.iterator in Object(e) ? o[on.SEQ] : o[on.MAP];
    }
    s && (s(c), delete n.onTagObj);
    let d = c?.createNode
      ? c.createNode(n.schema, e, n)
      : typeof c?.nodeClass?.from == "function"
        ? c.nodeClass.from(n.schema, e, n)
        : new bm.Scalar(e);
    return (t ? (d.tag = t) : c.default || (d.tag = c.tag), l && (l.node = d), d);
  }
  Sm.createNode = gw;
});
var es = O((Zr) => {
  "use strict";
  var pw = wi(),
    lt = q(),
    hw = Xr();
  function ja(e, t, n) {
    let i = n;
    for (let r = t.length - 1; r >= 0; --r) {
      let s = t[r];
      if (typeof s == "number" && Number.isInteger(s) && s >= 0) {
        let o = [];
        ((o[s] = i), (i = o));
      } else i = new Map([[s, i]]);
    }
    return pw.createNode(i, void 0, {
      aliasDuplicateObjects: !1,
      keepUndefined: !1,
      onAnchor: () => {
        throw new Error("This should not happen, please report a bug.");
      },
      schema: e,
      sourceObjects: new Map(),
    });
  }
  var _m = (e) => e == null || (typeof e == "object" && !!e[Symbol.iterator]().next().done),
    Ba = class extends hw.NodeBase {
      constructor(t, n) {
        (super(t), Object.defineProperty(this, "schema", { value: n, configurable: !0, enumerable: !1, writable: !0 }));
      }
      clone(t) {
        let n = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        return (
          t && (n.schema = t),
          (n.items = n.items.map((i) => (lt.isNode(i) || lt.isPair(i) ? i.clone(t) : i))),
          this.range && (n.range = this.range.slice()),
          n
        );
      }
      addIn(t, n) {
        if (_m(t)) this.add(n);
        else {
          let [i, ...r] = t,
            s = this.get(i, !0);
          if (lt.isCollection(s)) s.addIn(r, n);
          else if (s === void 0 && this.schema) this.set(i, ja(this.schema, r, n));
          else throw new Error(`Expected YAML collection at ${i}. Remaining path: ${r}`);
        }
      }
      deleteIn(t) {
        let [n, ...i] = t;
        if (i.length === 0) return this.delete(n);
        let r = this.get(n, !0);
        if (lt.isCollection(r)) return r.deleteIn(i);
        throw new Error(`Expected YAML collection at ${n}. Remaining path: ${i}`);
      }
      getIn(t, n) {
        let [i, ...r] = t,
          s = this.get(i, !0);
        return r.length === 0 ? (!n && lt.isScalar(s) ? s.value : s) : lt.isCollection(s) ? s.getIn(r, n) : void 0;
      }
      hasAllNullValues(t) {
        return this.items.every((n) => {
          if (!lt.isPair(n)) return !1;
          let i = n.value;
          return i == null || (t && lt.isScalar(i) && i.value == null && !i.commentBefore && !i.comment && !i.tag);
        });
      }
      hasIn(t) {
        let [n, ...i] = t;
        if (i.length === 0) return this.has(n);
        let r = this.get(n, !0);
        return lt.isCollection(r) ? r.hasIn(i) : !1;
      }
      setIn(t, n) {
        let [i, ...r] = t;
        if (r.length === 0) this.set(i, n);
        else {
          let s = this.get(i, !0);
          if (lt.isCollection(s)) s.setIn(r, n);
          else if (s === void 0 && this.schema) this.set(i, ja(this.schema, r, n));
          else throw new Error(`Expected YAML collection at ${i}. Remaining path: ${r}`);
        }
      }
    };
  Zr.Collection = Ba;
  Zr.collectionFromPath = ja;
  Zr.isEmptyPath = _m;
});
var Pi = O((ts) => {
  "use strict";
  var Iw = (e) => e.replace(/^(?!$)(?: $)?/gm, "#");
  function $a(e, t) {
    return /^\n+$/.test(e) ? e.substring(1) : t ? e.replace(/^(?! *$)/gm, t) : e;
  }
  var bw = (e, t, n) =>
    e.endsWith(`
`)
      ? $a(n, t)
      : n.includes(`
`)
        ? `
` + $a(n, t)
        : (e.endsWith(" ") ? "" : " ") + n;
  ts.indentComment = $a;
  ts.lineComment = bw;
  ts.stringifyComment = Iw;
});
var Rm = O((vi) => {
  "use strict";
  var Sw = "flow",
    Ga = "block",
    ns = "quoted";
  function _w(
    e,
    t,
    n = "flow",
    { indentAtStart: i, lineWidth: r = 80, minContentWidth: s = 20, onFold: o, onOverflow: a } = {},
  ) {
    if (!r || r < 0) return e;
    r < s && (s = 0);
    let l = Math.max(1 + s, 1 + r - t.length);
    if (e.length <= l) return e;
    let c = [],
      d = {},
      u = r - t.length;
    typeof i == "number" && (i > r - Math.max(2, s) ? c.push(0) : (u = r - i));
    let m,
      y,
      p = !1,
      g = -1,
      h = -1,
      S = -1;
    n === Ga && ((g = Em(e, g, t.length)), g !== -1 && (u = g + l));
    for (let E; (E = e[(g += 1)]);) {
      if (n === ns && E === "\\") {
        switch (((h = g), e[g + 1])) {
          case "x":
            g += 3;
            break;
          case "u":
            g += 5;
            break;
          case "U":
            g += 9;
            break;
          default:
            g += 1;
        }
        S = g;
      }
      if (
        E ===
        `
`
      )
        (n === Ga && (g = Em(e, g, t.length)), (u = g + t.length + l), (m = void 0));
      else {
        if (
          E === " " &&
          y &&
          y !== " " &&
          y !==
            `
` &&
          y !== "	"
        ) {
          let b = e[g + 1];
          b &&
            b !== " " &&
            b !==
              `
` &&
            b !== "	" &&
            (m = g);
        }
        if (g >= u)
          if (m) (c.push(m), (u = m + l), (m = void 0));
          else if (n === ns) {
            for (; y === " " || y === "	";) ((y = E), (E = e[(g += 1)]), (p = !0));
            let b = g > S + 1 ? g - 2 : h - 1;
            if (d[b]) return e;
            (c.push(b), (d[b] = !0), (u = b + l), (m = void 0));
          } else p = !0;
      }
      y = E;
    }
    if ((p && a && a(), c.length === 0)) return e;
    o && o();
    let _ = e.slice(0, c[0]);
    for (let E = 0; E < c.length; ++E) {
      let b = c[E],
        R = c[E + 1] || e.length;
      b === 0
        ? (_ = `
${t}${e.slice(0, R)}`)
        : (n === ns && d[b] && (_ += `${e[b]}\\`),
          (_ += `
${t}${e.slice(b + 1, R)}`));
    }
    return _;
  }
  function Em(e, t, n) {
    let i = t,
      r = t + 1,
      s = e[r];
    for (; s === " " || s === "	";)
      if (t < r + n) s = e[++t];
      else {
        do s = e[++t];
        while (
          s &&
          s !==
            `
`
        );
        ((i = t), (r = t + 1), (s = e[r]));
      }
    return i;
  }
  vi.FOLD_BLOCK = Ga;
  vi.FOLD_FLOW = Sw;
  vi.FOLD_QUOTED = ns;
  vi.foldFlowLines = _w;
});
var ki = O((wm) => {
  "use strict";
  var et = ge(),
    At = Rm(),
    rs = (e, t) => ({
      indentAtStart: t ? e.indent.length : e.indentAtStart,
      lineWidth: e.options.lineWidth,
      minContentWidth: e.options.minContentWidth,
    }),
    ss = (e) => /^(%|---|\.\.\.)/m.test(e);
  function Ew(e, t, n) {
    if (!t || t < 0) return !1;
    let i = t - n,
      r = e.length;
    if (r <= i) return !1;
    for (let s = 0, o = 0; s < r; ++s)
      if (
        e[s] ===
        `
`
      ) {
        if (s - o > i) return !0;
        if (((o = s + 1), r - o <= i)) return !1;
      }
    return !0;
  }
  function xi(e, t) {
    let n = JSON.stringify(e);
    if (t.options.doubleQuotedAsJSON) return n;
    let { implicitKey: i } = t,
      r = t.options.doubleQuotedMinMultiLineLength,
      s = t.indent || (ss(e) ? "  " : ""),
      o = "",
      a = 0;
    for (let l = 0, c = n[l]; c; c = n[++l])
      if (
        (c === " " &&
          n[l + 1] === "\\" &&
          n[l + 2] === "n" &&
          ((o += n.slice(a, l) + "\\ "), (l += 1), (a = l), (c = "\\")),
        c === "\\")
      )
        switch (n[l + 1]) {
          case "u":
            {
              o += n.slice(a, l);
              let d = n.substr(l + 2, 4);
              switch (d) {
                case "0000":
                  o += "\\0";
                  break;
                case "0007":
                  o += "\\a";
                  break;
                case "000b":
                  o += "\\v";
                  break;
                case "001b":
                  o += "\\e";
                  break;
                case "0085":
                  o += "\\N";
                  break;
                case "00a0":
                  o += "\\_";
                  break;
                case "2028":
                  o += "\\L";
                  break;
                case "2029":
                  o += "\\P";
                  break;
                default:
                  d.substr(0, 2) === "00" ? (o += "\\x" + d.substr(2)) : (o += n.substr(l, 6));
              }
              ((l += 5), (a = l + 1));
            }
            break;
          case "n":
            if (i || n[l + 2] === '"' || n.length < r) l += 1;
            else {
              for (
                o +=
                  n.slice(a, l) +
                  `

`;
                n[l + 2] === "\\" && n[l + 3] === "n" && n[l + 4] !== '"';
              )
                ((o += `
`),
                  (l += 2));
              ((o += s), n[l + 2] === " " && (o += "\\"), (l += 1), (a = l + 1));
            }
            break;
          default:
            l += 1;
        }
    return ((o = a ? o + n.slice(a) : n), i ? o : At.foldFlowLines(o, s, At.FOLD_QUOTED, rs(t, !1)));
  }
  function Ka(e, t) {
    if (
      t.options.singleQuote === !1 ||
      (t.implicitKey &&
        e.includes(`
`)) ||
      /[ \t]\n|\n[ \t]/.test(e)
    )
      return xi(e, t);
    let n = t.indent || (ss(e) ? "  " : ""),
      i =
        "'" +
        e.replace(/'/g, "''").replace(
          /\n+/g,
          `$&
${n}`,
        ) +
        "'";
    return t.implicitKey ? i : At.foldFlowLines(i, n, At.FOLD_FLOW, rs(t, !1));
  }
  function Nn(e, t) {
    let { singleQuote: n } = t.options,
      i;
    if (n === !1) i = xi;
    else {
      let r = e.includes('"'),
        s = e.includes("'");
      r && !s ? (i = Ka) : s && !r ? (i = xi) : (i = n ? Ka : xi);
    }
    return i(e, t);
  }
  var Ya;
  try {
    Ya = new RegExp(
      `(^|(?<!
))
+(?!
|$)`,
      "g",
    );
  } catch {
    Ya = /\n+(?!\n|$)/g;
  }
  function is({ comment: e, type: t, value: n }, i, r, s) {
    let { blockQuote: o, commentString: a, lineWidth: l } = i.options;
    if (!o || /\n[\t ]+$/.test(n)) return Nn(n, i);
    let c = i.indent || (i.forceBlockIndent || ss(n) ? "  " : ""),
      d =
        o === "literal"
          ? !0
          : o === "folded" || t === et.Scalar.BLOCK_FOLDED
            ? !1
            : t === et.Scalar.BLOCK_LITERAL
              ? !0
              : !Ew(n, l, c.length);
    if (!n)
      return d
        ? `|
`
        : `>
`;
    let u, m;
    for (m = n.length; m > 0; --m) {
      let R = n[m - 1];
      if (
        R !==
          `
` &&
        R !== "	" &&
        R !== " "
      )
        break;
    }
    let y = n.substring(m),
      p = y.indexOf(`
`);
    (p === -1 ? (u = "-") : n === y || p !== y.length - 1 ? ((u = "+"), s && s()) : (u = ""),
      y &&
        ((n = n.slice(0, -y.length)),
        y[y.length - 1] ===
          `
` && (y = y.slice(0, -1)),
        (y = y.replace(Ya, `$&${c}`))));
    let g = !1,
      h,
      S = -1;
    for (h = 0; h < n.length; ++h) {
      let R = n[h];
      if (R === " ") g = !0;
      else if (
        R ===
        `
`
      )
        S = h;
      else break;
    }
    let _ = n.substring(0, S < h ? S + 1 : h);
    _ && ((n = n.substring(_.length)), (_ = _.replace(/\n+/g, `$&${c}`)));
    let b = (g ? (c ? "2" : "1") : "") + u;
    if ((e && ((b += " " + a(e.replace(/ ?[\r\n]+/g, " "))), r && r()), !d)) {
      let R = n
          .replace(
            /\n+/g,
            `
$&`,
          )
          .replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2")
          .replace(/\n+/g, `$&${c}`),
        v = !1,
        T = rs(i, !0);
      o !== "folded" &&
        t !== et.Scalar.BLOCK_FOLDED &&
        (T.onOverflow = () => {
          v = !0;
        });
      let x = At.foldFlowLines(`${_}${R}${y}`, c, At.FOLD_BLOCK, T);
      if (!v)
        return `>${b}
${c}${x}`;
    }
    return (
      (n = n.replace(/\n+/g, `$&${c}`)),
      `|${b}
${c}${_}${n}${y}`
    );
  }
  function Rw(e, t, n, i) {
    let { type: r, value: s } = e,
      { actualString: o, implicitKey: a, indent: l, indentStep: c, inFlow: d } = t;
    if (
      (a &&
        s.includes(`
`)) ||
      (d && /[[\]{},]/.test(s))
    )
      return Nn(s, t);
    if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(s))
      return a ||
        d ||
        !s.includes(`
`)
        ? Nn(s, t)
        : is(e, t, n, i);
    if (
      !a &&
      !d &&
      r !== et.Scalar.PLAIN &&
      s.includes(`
`)
    )
      return is(e, t, n, i);
    if (ss(s)) {
      if (l === "") return ((t.forceBlockIndent = !0), is(e, t, n, i));
      if (a && l === c) return Nn(s, t);
    }
    let u = s.replace(
      /\n+/g,
      `$&
${l}`,
    );
    if (o) {
      let m = (g) => g.default && g.tag !== "tag:yaml.org,2002:str" && g.test?.test(u),
        { compat: y, tags: p } = t.doc.schema;
      if (p.some(m) || y?.some(m)) return Nn(s, t);
    }
    return a ? u : At.foldFlowLines(u, l, At.FOLD_FLOW, rs(t, !1));
  }
  function ww(e, t, n, i) {
    let { implicitKey: r, inFlow: s } = t,
      o = typeof e.value == "string" ? e : Object.assign({}, e, { value: String(e.value) }),
      { type: a } = e;
    a !== et.Scalar.QUOTE_DOUBLE &&
      /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value) &&
      (a = et.Scalar.QUOTE_DOUBLE);
    let l = (d) => {
        switch (d) {
          case et.Scalar.BLOCK_FOLDED:
          case et.Scalar.BLOCK_LITERAL:
            return r || s ? Nn(o.value, t) : is(o, t, n, i);
          case et.Scalar.QUOTE_DOUBLE:
            return xi(o.value, t);
          case et.Scalar.QUOTE_SINGLE:
            return Ka(o.value, t);
          case et.Scalar.PLAIN:
            return Rw(o, t, n, i);
          default:
            return null;
        }
      },
      c = l(a);
    if (c === null) {
      let { defaultKeyType: d, defaultStringType: u } = t.options,
        m = (r && d) || u;
      if (((c = l(m)), c === null)) throw new Error(`Unsupported default string type ${m}`);
    }
    return c;
  }
  wm.stringifyString = ww;
});
var Mi = O((Va) => {
  "use strict";
  var Pw = Jr(),
    Ot = q(),
    vw = Pi(),
    xw = ki();
  function kw(e, t) {
    let n = Object.assign(
        {
          blockQuote: !0,
          commentString: vw.stringifyComment,
          defaultKeyType: null,
          defaultStringType: "PLAIN",
          directives: null,
          doubleQuotedAsJSON: !1,
          doubleQuotedMinMultiLineLength: 40,
          falseStr: "false",
          flowCollectionPadding: !0,
          indentSeq: !0,
          lineWidth: 80,
          minContentWidth: 20,
          nullStr: "null",
          simpleKeys: !1,
          singleQuote: null,
          trailingComma: !1,
          trueStr: "true",
          verifyAliasOrder: !0,
        },
        e.schema.toStringOptions,
        t,
      ),
      i;
    switch (n.collectionStyle) {
      case "block":
        i = !1;
        break;
      case "flow":
        i = !0;
        break;
      default:
        i = null;
    }
    return {
      anchors: new Set(),
      doc: e,
      flowCollectionPadding: n.flowCollectionPadding ? " " : "",
      indent: "",
      indentStep: typeof n.indent == "number" ? " ".repeat(n.indent) : "  ",
      inFlow: i,
      options: n,
    };
  }
  function Mw(e, t) {
    if (t.tag) {
      let r = e.filter((s) => s.tag === t.tag);
      if (r.length > 0) return r.find((s) => s.format === t.format) ?? r[0];
    }
    let n, i;
    if (Ot.isScalar(t)) {
      i = t.value;
      let r = e.filter((s) => s.identify?.(i));
      if (r.length > 1) {
        let s = r.filter((o) => o.test);
        s.length > 0 && (r = s);
      }
      n = r.find((s) => s.format === t.format) ?? r.find((s) => !s.format);
    } else ((i = t), (n = e.find((r) => r.nodeClass && i instanceof r.nodeClass)));
    if (!n) {
      let r = i?.constructor?.name ?? (i === null ? "null" : typeof i);
      throw new Error(`Tag not resolved for ${r} value`);
    }
    return n;
  }
  function Tw(e, t, { anchors: n, doc: i }) {
    if (!i.directives) return "";
    let r = [],
      s = (Ot.isScalar(e) || Ot.isCollection(e)) && e.anchor;
    s && Pw.anchorIsValid(s) && (n.add(s), r.push(`&${s}`));
    let o = e.tag ?? (t.default ? null : t.tag);
    return (o && r.push(i.directives.tagString(o)), r.join(" "));
  }
  function Uw(e, t, n, i) {
    if (Ot.isPair(e)) return e.toString(t, n, i);
    if (Ot.isAlias(e)) {
      if (t.doc.directives) return e.toString(t);
      if (t.resolvedAliases?.has(e)) throw new TypeError("Cannot stringify circular structure without alias nodes");
      (t.resolvedAliases ? t.resolvedAliases.add(e) : (t.resolvedAliases = new Set([e])), (e = e.resolve(t.doc)));
    }
    let r,
      s = Ot.isNode(e) ? e : t.doc.createNode(e, { onTagObj: (l) => (r = l) });
    r ?? (r = Mw(t.doc.schema.tags, s));
    let o = Tw(s, r, t);
    o.length > 0 && (t.indentAtStart = (t.indentAtStart ?? 0) + o.length + 1);
    let a =
      typeof r.stringify == "function"
        ? r.stringify(s, t, n, i)
        : Ot.isScalar(s)
          ? xw.stringifyString(s, t, n, i)
          : s.toString(t, n, i);
    return o
      ? Ot.isScalar(s) || a[0] === "{" || a[0] === "["
        ? `${o} ${a}`
        : `${o}
${t.indent}${a}`
      : a;
  }
  Va.createStringifyContext = kw;
  Va.stringify = Uw;
});
var km = O((xm) => {
  "use strict";
  var bt = q(),
    Pm = ge(),
    vm = Mi(),
    Ti = Pi();
  function Aw({ key: e, value: t }, n, i, r) {
    let {
        allNullValues: s,
        doc: o,
        indent: a,
        indentStep: l,
        options: { commentString: c, indentSeq: d, simpleKeys: u },
      } = n,
      m = (bt.isNode(e) && e.comment) || null;
    if (u) {
      if (m) throw new Error("With simple keys, key nodes cannot have comments");
      if (bt.isCollection(e) || (!bt.isNode(e) && typeof e == "object")) {
        let T = "With simple keys, collection cannot be used as a key value";
        throw new Error(T);
      }
    }
    let y =
      !u &&
      (!e ||
        (m && t == null && !n.inFlow) ||
        bt.isCollection(e) ||
        (bt.isScalar(e)
          ? e.type === Pm.Scalar.BLOCK_FOLDED || e.type === Pm.Scalar.BLOCK_LITERAL
          : typeof e == "object"));
    n = Object.assign({}, n, { allNullValues: !1, implicitKey: !y && (u || !s), indent: a + l });
    let p = !1,
      g = !1,
      h = vm.stringify(
        e,
        n,
        () => (p = !0),
        () => (g = !0),
      );
    if (!y && !n.inFlow && h.length > 1024) {
      if (u) throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
      y = !0;
    }
    if (n.inFlow) {
      if (s || t == null) return (p && i && i(), h === "" ? "?" : y ? `? ${h}` : h);
    } else if ((s && !u) || (t == null && y))
      return ((h = `? ${h}`), m && !p ? (h += Ti.lineComment(h, n.indent, c(m))) : g && r && r(), h);
    (p && (m = null),
      y
        ? (m && (h += Ti.lineComment(h, n.indent, c(m))),
          (h = `? ${h}
${a}:`))
        : ((h = `${h}:`), m && (h += Ti.lineComment(h, n.indent, c(m)))));
    let S, _, E;
    (bt.isNode(t)
      ? ((S = !!t.spaceBefore), (_ = t.commentBefore), (E = t.comment))
      : ((S = !1), (_ = null), (E = null), t && typeof t == "object" && (t = o.createNode(t))),
      (n.implicitKey = !1),
      !y && !m && bt.isScalar(t) && (n.indentAtStart = h.length + 1),
      (g = !1),
      !d &&
        l.length >= 2 &&
        !n.inFlow &&
        !y &&
        bt.isSeq(t) &&
        !t.flow &&
        !t.tag &&
        !t.anchor &&
        (n.indent = n.indent.substring(2)));
    let b = !1,
      R = vm.stringify(
        t,
        n,
        () => (b = !0),
        () => (g = !0),
      ),
      v = " ";
    if (m || S || _) {
      if (
        ((v = S
          ? `
`
          : ""),
        _)
      ) {
        let T = c(_);
        v += `
${Ti.indentComment(T, n.indent)}`;
      }
      R === "" && !n.inFlow
        ? v ===
            `
` &&
          E &&
          (v = `

`)
        : (v += `
${n.indent}`);
    } else if (!y && bt.isCollection(t)) {
      let T = R[0],
        x = R.indexOf(`
`),
        $ = x !== -1,
        z = n.inFlow ?? t.flow ?? t.items.length === 0;
      if ($ || !z) {
        let Y = !1;
        if ($ && (T === "&" || T === "!")) {
          let V = R.indexOf(" ");
          (T === "&" && V !== -1 && V < x && R[V + 1] === "!" && (V = R.indexOf(" ", V + 1)),
            (V === -1 || x < V) && (Y = !0));
        }
        Y ||
          (v = `
${n.indent}`);
      }
    } else
      (R === "" ||
        R[0] ===
          `
`) &&
        (v = "");
    return (
      (h += v + R),
      n.inFlow ? b && i && i() : E && !b ? (h += Ti.lineComment(h, n.indent, c(E))) : g && r && r(),
      h
    );
  }
  xm.stringifyPair = Aw;
});
var qa = O((Wa) => {
  "use strict";
  var Mm = ur("process");
  function Ow(e, ...t) {
    e === "debug" && console.log(...t);
  }
  function Fw(e, t) {
    (e === "debug" || e === "warn") && (typeof Mm.emitWarning == "function" ? Mm.emitWarning(t) : console.warn(t));
  }
  Wa.debug = Ow;
  Wa.warn = Fw;
});
var ds = O((cs) => {
  "use strict";
  var ls = q(),
    Tm = ge(),
    os = "<<",
    as = {
      identify: (e) => e === os || (typeof e == "symbol" && e.description === os),
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Tm.Scalar(Symbol(os)), { addToJSMap: Um }),
      stringify: () => os,
    },
    Nw = (e, t) =>
      (as.identify(t) || (ls.isScalar(t) && (!t.type || t.type === Tm.Scalar.PLAIN) && as.identify(t.value))) &&
      e?.doc.schema.tags.some((n) => n.tag === as.tag && n.default);
  function Um(e, t, n) {
    let i = Am(e, n);
    if (ls.isSeq(i)) for (let r of i.items) za(e, t, r);
    else if (Array.isArray(i)) for (let r of i) za(e, t, r);
    else za(e, t, i);
  }
  function za(e, t, n) {
    let i = Am(e, n);
    if (!ls.isMap(i)) throw new Error("Merge sources must be maps or map aliases");
    let r = i.toJSON(null, e, Map);
    for (let [s, o] of r)
      t instanceof Map
        ? t.has(s) || t.set(s, o)
        : t instanceof Set
          ? t.add(s)
          : Object.prototype.hasOwnProperty.call(t, s) ||
            Object.defineProperty(t, s, { value: o, writable: !0, enumerable: !0, configurable: !0 });
    return t;
  }
  function Am(e, t) {
    return e && ls.isAlias(t) ? t.resolve(e.doc, e) : t;
  }
  cs.addMergeToJSMap = Um;
  cs.isMergeKey = Nw;
  cs.merge = as;
});
var Ja = O((Nm) => {
  "use strict";
  var Lw = qa(),
    Om = ds(),
    Dw = Mi(),
    Fm = q(),
    Ha = Tt();
  function Cw(e, t, { key: n, value: i }) {
    if (Fm.isNode(n) && n.addToJSMap) n.addToJSMap(e, t, i);
    else if (Om.isMergeKey(e, n)) Om.addMergeToJSMap(e, t, i);
    else {
      let r = Ha.toJS(n, "", e);
      if (t instanceof Map) t.set(r, Ha.toJS(i, r, e));
      else if (t instanceof Set) t.add(r);
      else {
        let s = jw(n, r, e),
          o = Ha.toJS(i, s, e);
        s in t ? Object.defineProperty(t, s, { value: o, writable: !0, enumerable: !0, configurable: !0 }) : (t[s] = o);
      }
    }
    return t;
  }
  function jw(e, t, n) {
    if (t === null) return "";
    if (typeof t != "object") return String(t);
    if (Fm.isNode(e) && n?.doc) {
      let i = Dw.createStringifyContext(n.doc, {});
      i.anchors = new Set();
      for (let s of n.anchors.keys()) i.anchors.add(s.anchor);
      ((i.inFlow = !0), (i.inStringifyKey = !0));
      let r = e.toString(i);
      if (!n.mapKeyWarned) {
        let s = JSON.stringify(r);
        (s.length > 40 && (s = s.substring(0, 36) + '..."'),
          Lw.warn(
            n.doc.options.logLevel,
            `Keys with collection values will be stringified due to JS Object restrictions: ${s}. Set mapAsMap: true to use object keys.`,
          ),
          (n.mapKeyWarned = !0));
      }
      return r;
    }
    return JSON.stringify(t);
  }
  Nm.addPairToJSMap = Cw;
});
var Ft = O((Xa) => {
  "use strict";
  var Lm = wi(),
    Bw = km(),
    $w = Ja(),
    us = q();
  function Gw(e, t, n) {
    let i = Lm.createNode(e, void 0, n),
      r = Lm.createNode(t, void 0, n);
    return new fs(i, r);
  }
  var fs = class e {
    constructor(t, n = null) {
      (Object.defineProperty(this, us.NODE_TYPE, { value: us.PAIR }), (this.key = t), (this.value = n));
    }
    clone(t) {
      let { key: n, value: i } = this;
      return (us.isNode(n) && (n = n.clone(t)), us.isNode(i) && (i = i.clone(t)), new e(n, i));
    }
    toJSON(t, n) {
      let i = n?.mapAsMap ? new Map() : {};
      return $w.addPairToJSMap(n, i, this);
    }
    toString(t, n, i) {
      return t?.doc ? Bw.stringifyPair(this, t, n, i) : JSON.stringify(this);
    }
  };
  Xa.Pair = fs;
  Xa.createPair = Gw;
});
var Qa = O((Cm) => {
  "use strict";
  var an = q(),
    Dm = Mi(),
    ms = Pi();
  function Kw(e, t, n) {
    return ((t.inFlow ?? e.flow) ? Vw : Yw)(e, t, n);
  }
  function Yw(
    { comment: e, items: t },
    n,
    { blockItemPrefix: i, flowChars: r, itemIndent: s, onChompKeep: o, onComment: a },
  ) {
    let {
        indent: l,
        options: { commentString: c },
      } = n,
      d = Object.assign({}, n, { indent: s, type: null }),
      u = !1,
      m = [];
    for (let p = 0; p < t.length; ++p) {
      let g = t[p],
        h = null;
      if (an.isNode(g)) (!u && g.spaceBefore && m.push(""), ys(n, m, g.commentBefore, u), g.comment && (h = g.comment));
      else if (an.isPair(g)) {
        let _ = an.isNode(g.key) ? g.key : null;
        _ && (!u && _.spaceBefore && m.push(""), ys(n, m, _.commentBefore, u));
      }
      u = !1;
      let S = Dm.stringify(
        g,
        d,
        () => (h = null),
        () => (u = !0),
      );
      (h && (S += ms.lineComment(S, s, c(h))), u && h && (u = !1), m.push(i + S));
    }
    let y;
    if (m.length === 0) y = r.start + r.end;
    else {
      y = m[0];
      for (let p = 1; p < m.length; ++p) {
        let g = m[p];
        y += g
          ? `
${l}${g}`
          : `
`;
      }
    }
    return (
      e
        ? ((y +=
            `
` + ms.indentComment(c(e), l)),
          a && a())
        : u && o && o(),
      y
    );
  }
  function Vw({ items: e }, t, { flowChars: n, itemIndent: i }) {
    let {
      indent: r,
      indentStep: s,
      flowCollectionPadding: o,
      options: { commentString: a },
    } = t;
    i += s;
    let l = Object.assign({}, t, { indent: i, inFlow: !0, type: null }),
      c = !1,
      d = 0,
      u = [];
    for (let p = 0; p < e.length; ++p) {
      let g = e[p],
        h = null;
      if (an.isNode(g)) (g.spaceBefore && u.push(""), ys(t, u, g.commentBefore, !1), g.comment && (h = g.comment));
      else if (an.isPair(g)) {
        let _ = an.isNode(g.key) ? g.key : null;
        _ && (_.spaceBefore && u.push(""), ys(t, u, _.commentBefore, !1), _.comment && (c = !0));
        let E = an.isNode(g.value) ? g.value : null;
        E
          ? (E.comment && (h = E.comment), E.commentBefore && (c = !0))
          : g.value == null && _?.comment && (h = _.comment);
      }
      h && (c = !0);
      let S = Dm.stringify(g, l, () => (h = null));
      (c ||
        (c =
          u.length > d ||
          S.includes(`
`)),
        p < e.length - 1
          ? (S += ",")
          : t.options.trailingComma &&
            (t.options.lineWidth > 0 &&
              (c || (c = u.reduce((_, E) => _ + E.length + 2, 2) + (S.length + 2) > t.options.lineWidth)),
            c && (S += ",")),
        h && (S += ms.lineComment(S, i, a(h))),
        u.push(S),
        (d = u.length));
    }
    let { start: m, end: y } = n;
    if (u.length === 0) return m + y;
    if (!c) {
      let p = u.reduce((g, h) => g + h.length + 2, 2);
      c = t.options.lineWidth > 0 && p > t.options.lineWidth;
    }
    if (c) {
      let p = m;
      for (let g of u)
        p += g
          ? `
${s}${r}${g}`
          : `
`;
      return `${p}
${r}${y}`;
    } else return `${m}${o}${u.join(" ")}${o}${y}`;
  }
  function ys({ indent: e, options: { commentString: t } }, n, i, r) {
    if ((i && r && (i = i.replace(/^\n+/, "")), i)) {
      let s = ms.indentComment(t(i), e);
      n.push(s.trimStart());
    }
  }
  Cm.stringifyCollection = Kw;
});
var Lt = O((el) => {
  "use strict";
  var Ww = Qa(),
    qw = Ja(),
    zw = es(),
    Nt = q(),
    gs = Ft(),
    Hw = ge();
  function Ui(e, t) {
    let n = Nt.isScalar(t) ? t.value : t;
    for (let i of e)
      if (Nt.isPair(i) && (i.key === t || i.key === n || (Nt.isScalar(i.key) && i.key.value === n))) return i;
  }
  var Za = class extends zw.Collection {
    static get tagName() {
      return "tag:yaml.org,2002:map";
    }
    constructor(t) {
      (super(Nt.MAP, t), (this.items = []));
    }
    static from(t, n, i) {
      let { keepUndefined: r, replacer: s } = i,
        o = new this(t),
        a = (l, c) => {
          if (typeof s == "function") c = s.call(n, l, c);
          else if (Array.isArray(s) && !s.includes(l)) return;
          (c !== void 0 || r) && o.items.push(gs.createPair(l, c, i));
        };
      if (n instanceof Map) for (let [l, c] of n) a(l, c);
      else if (n && typeof n == "object") for (let l of Object.keys(n)) a(l, n[l]);
      return (typeof t.sortMapEntries == "function" && o.items.sort(t.sortMapEntries), o);
    }
    add(t, n) {
      let i;
      Nt.isPair(t)
        ? (i = t)
        : !t || typeof t != "object" || !("key" in t)
          ? (i = new gs.Pair(t, t?.value))
          : (i = new gs.Pair(t.key, t.value));
      let r = Ui(this.items, i.key),
        s = this.schema?.sortMapEntries;
      if (r) {
        if (!n) throw new Error(`Key ${i.key} already set`);
        Nt.isScalar(r.value) && Hw.isScalarValue(i.value) ? (r.value.value = i.value) : (r.value = i.value);
      } else if (s) {
        let o = this.items.findIndex((a) => s(i, a) < 0);
        o === -1 ? this.items.push(i) : this.items.splice(o, 0, i);
      } else this.items.push(i);
    }
    delete(t) {
      let n = Ui(this.items, t);
      return n ? this.items.splice(this.items.indexOf(n), 1).length > 0 : !1;
    }
    get(t, n) {
      let r = Ui(this.items, t)?.value;
      return (!n && Nt.isScalar(r) ? r.value : r) ?? void 0;
    }
    has(t) {
      return !!Ui(this.items, t);
    }
    set(t, n) {
      this.add(new gs.Pair(t, n), !0);
    }
    toJSON(t, n, i) {
      let r = i ? new i() : n?.mapAsMap ? new Map() : {};
      n?.onCreate && n.onCreate(r);
      for (let s of this.items) qw.addPairToJSMap(n, r, s);
      return r;
    }
    toString(t, n, i) {
      if (!t) return JSON.stringify(this);
      for (let r of this.items)
        if (!Nt.isPair(r)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(r)} instead`);
      return (
        !t.allNullValues && this.hasAllNullValues(!1) && (t = Object.assign({}, t, { allNullValues: !0 })),
        Ww.stringifyCollection(this, t, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: t.indent || "",
          onChompKeep: i,
          onComment: n,
        })
      );
    }
  };
  el.YAMLMap = Za;
  el.findPair = Ui;
});
var Ln = O((Bm) => {
  "use strict";
  var Jw = q(),
    jm = Lt(),
    Xw = {
      collection: "map",
      default: !0,
      nodeClass: jm.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(e, t) {
        return (Jw.isMap(e) || t("Expected a mapping for this tag"), e);
      },
      createNode: (e, t, n) => jm.YAMLMap.from(e, t, n),
    };
  Bm.map = Xw;
});
var Dt = O(($m) => {
  "use strict";
  var Qw = wi(),
    Zw = Qa(),
    eP = es(),
    hs = q(),
    tP = ge(),
    nP = Tt(),
    tl = class extends eP.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(t) {
        (super(hs.SEQ, t), (this.items = []));
      }
      add(t) {
        this.items.push(t);
      }
      delete(t) {
        let n = ps(t);
        return typeof n != "number" ? !1 : this.items.splice(n, 1).length > 0;
      }
      get(t, n) {
        let i = ps(t);
        if (typeof i != "number") return;
        let r = this.items[i];
        return !n && hs.isScalar(r) ? r.value : r;
      }
      has(t) {
        let n = ps(t);
        return typeof n == "number" && n < this.items.length;
      }
      set(t, n) {
        let i = ps(t);
        if (typeof i != "number") throw new Error(`Expected a valid index, not ${t}.`);
        let r = this.items[i];
        hs.isScalar(r) && tP.isScalarValue(n) ? (r.value = n) : (this.items[i] = n);
      }
      toJSON(t, n) {
        let i = [];
        n?.onCreate && n.onCreate(i);
        let r = 0;
        for (let s of this.items) i.push(nP.toJS(s, String(r++), n));
        return i;
      }
      toString(t, n, i) {
        return t
          ? Zw.stringifyCollection(this, t, {
              blockItemPrefix: "- ",
              flowChars: { start: "[", end: "]" },
              itemIndent: (t.indent || "") + "  ",
              onChompKeep: i,
              onComment: n,
            })
          : JSON.stringify(this);
      }
      static from(t, n, i) {
        let { replacer: r } = i,
          s = new this(t);
        if (n && Symbol.iterator in Object(n)) {
          let o = 0;
          for (let a of n) {
            if (typeof r == "function") {
              let l = n instanceof Set ? a : String(o++);
              a = r.call(n, l, a);
            }
            s.items.push(Qw.createNode(a, void 0, i));
          }
        }
        return s;
      }
    };
  function ps(e) {
    let t = hs.isScalar(e) ? e.value : e;
    return (
      t && typeof t == "string" && (t = Number(t)),
      typeof t == "number" && Number.isInteger(t) && t >= 0 ? t : null
    );
  }
  $m.YAMLSeq = tl;
});
var Dn = O((Km) => {
  "use strict";
  var iP = q(),
    Gm = Dt(),
    rP = {
      collection: "seq",
      default: !0,
      nodeClass: Gm.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(e, t) {
        return (iP.isSeq(e) || t("Expected a sequence for this tag"), e);
      },
      createNode: (e, t, n) => Gm.YAMLSeq.from(e, t, n),
    };
  Km.seq = rP;
});
var Ai = O((Ym) => {
  "use strict";
  var sP = ki(),
    oP = {
      identify: (e) => typeof e == "string",
      default: !0,
      tag: "tag:yaml.org,2002:str",
      resolve: (e) => e,
      stringify(e, t, n, i) {
        return ((t = Object.assign({ actualString: !0 }, t)), sP.stringifyString(e, t, n, i));
      },
    };
  Ym.string = oP;
});
var Is = O((qm) => {
  "use strict";
  var Vm = ge(),
    Wm = {
      identify: (e) => e == null,
      createNode: () => new Vm.Scalar(null),
      default: !0,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Vm.Scalar(null),
      stringify: ({ source: e }, t) => (typeof e == "string" && Wm.test.test(e) ? e : t.options.nullStr),
    };
  qm.nullTag = Wm;
});
var nl = O((Hm) => {
  "use strict";
  var aP = ge(),
    zm = {
      identify: (e) => typeof e == "boolean",
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (e) => new aP.Scalar(e[0] === "t" || e[0] === "T"),
      stringify({ source: e, value: t }, n) {
        if (e && zm.test.test(e)) {
          let i = e[0] === "t" || e[0] === "T";
          if (t === i) return e;
        }
        return t ? n.options.trueStr : n.options.falseStr;
      },
    };
  Hm.boolTag = zm;
});
var Cn = O((Jm) => {
  "use strict";
  function lP({ format: e, minFractionDigits: t, tag: n, value: i }) {
    if (typeof i == "bigint") return String(i);
    let r = typeof i == "number" ? i : Number(i);
    if (!isFinite(r)) return isNaN(r) ? ".nan" : r < 0 ? "-.inf" : ".inf";
    let s = Object.is(i, -0) ? "-0" : JSON.stringify(i);
    if (!e && t && (!n || n === "tag:yaml.org,2002:float") && /^-?\d/.test(s) && !s.includes("e")) {
      let o = s.indexOf(".");
      o < 0 && ((o = s.length), (s += "."));
      let a = t - (s.length - o - 1);
      for (; a-- > 0;) s += "0";
    }
    return s;
  }
  Jm.stringifyNumber = lP;
});
var rl = O((bs) => {
  "use strict";
  var cP = ge(),
    il = Cn(),
    dP = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (e) =>
        e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: il.stringifyNumber,
    },
    uP = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (e) => parseFloat(e),
      stringify(e) {
        let t = Number(e.value);
        return isFinite(t) ? t.toExponential() : il.stringifyNumber(e);
      },
    },
    fP = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(e) {
        let t = new cP.Scalar(parseFloat(e)),
          n = e.indexOf(".");
        return (n !== -1 && e[e.length - 1] === "0" && (t.minFractionDigits = e.length - n - 1), t);
      },
      stringify: il.stringifyNumber,
    };
  bs.float = fP;
  bs.floatExp = uP;
  bs.floatNaN = dP;
});
var ol = O((_s) => {
  "use strict";
  var Xm = Cn(),
    Ss = (e) => typeof e == "bigint" || Number.isInteger(e),
    sl = (e, t, n, { intAsBigInt: i }) => (i ? BigInt(e) : parseInt(e.substring(t), n));
  function Qm(e, t, n) {
    let { value: i } = e;
    return Ss(i) && i >= 0 ? n + i.toString(t) : Xm.stringifyNumber(e);
  }
  var mP = {
      identify: (e) => Ss(e) && e >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (e, t, n) => sl(e, 2, 8, n),
      stringify: (e) => Qm(e, 8, "0o"),
    },
    yP = {
      identify: Ss,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (e, t, n) => sl(e, 0, 10, n),
      stringify: Xm.stringifyNumber,
    },
    gP = {
      identify: (e) => Ss(e) && e >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (e, t, n) => sl(e, 2, 16, n),
      stringify: (e) => Qm(e, 16, "0x"),
    };
  _s.int = yP;
  _s.intHex = gP;
  _s.intOct = mP;
});
var ey = O((Zm) => {
  "use strict";
  var pP = Ln(),
    hP = Is(),
    IP = Dn(),
    bP = Ai(),
    SP = nl(),
    al = rl(),
    ll = ol(),
    _P = [
      pP.map,
      IP.seq,
      bP.string,
      hP.nullTag,
      SP.boolTag,
      ll.intOct,
      ll.int,
      ll.intHex,
      al.floatNaN,
      al.floatExp,
      al.float,
    ];
  Zm.schema = _P;
});
var iy = O((ny) => {
  "use strict";
  var EP = ge(),
    RP = Ln(),
    wP = Dn();
  function ty(e) {
    return typeof e == "bigint" || Number.isInteger(e);
  }
  var Es = ({ value: e }) => JSON.stringify(e),
    PP = [
      {
        identify: (e) => typeof e == "string",
        default: !0,
        tag: "tag:yaml.org,2002:str",
        resolve: (e) => e,
        stringify: Es,
      },
      {
        identify: (e) => e == null,
        createNode: () => new EP.Scalar(null),
        default: !0,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: Es,
      },
      {
        identify: (e) => typeof e == "boolean",
        default: !0,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (e) => e === "true",
        stringify: Es,
      },
      {
        identify: ty,
        default: !0,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (e, t, { intAsBigInt: n }) => (n ? BigInt(e) : parseInt(e, 10)),
        stringify: ({ value: e }) => (ty(e) ? e.toString() : JSON.stringify(e)),
      },
      {
        identify: (e) => typeof e == "number",
        default: !0,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (e) => parseFloat(e),
        stringify: Es,
      },
    ],
    vP = {
      default: !0,
      tag: "",
      test: /^/,
      resolve(e, t) {
        return (t(`Unresolved plain scalar ${JSON.stringify(e)}`), e);
      },
    },
    xP = [RP.map, wP.seq].concat(PP, vP);
  ny.schema = xP;
});
var dl = O((ry) => {
  "use strict";
  var Oi = ur("buffer"),
    cl = ge(),
    kP = ki(),
    MP = {
      identify: (e) => e instanceof Uint8Array,
      default: !1,
      tag: "tag:yaml.org,2002:binary",
      resolve(e, t) {
        if (typeof Oi.Buffer == "function") return Oi.Buffer.from(e, "base64");
        if (typeof atob == "function") {
          let n = atob(e.replace(/[\n\r]/g, "")),
            i = new Uint8Array(n.length);
          for (let r = 0; r < n.length; ++r) i[r] = n.charCodeAt(r);
          return i;
        } else
          return (t("This environment does not support reading binary tags; either Buffer or atob is required"), e);
      },
      stringify({ comment: e, type: t, value: n }, i, r, s) {
        if (!n) return "";
        let o = n,
          a;
        if (typeof Oi.Buffer == "function")
          a = o instanceof Oi.Buffer ? o.toString("base64") : Oi.Buffer.from(o.buffer).toString("base64");
        else if (typeof btoa == "function") {
          let l = "";
          for (let c = 0; c < o.length; ++c) l += String.fromCharCode(o[c]);
          a = btoa(l);
        } else
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        if ((t ?? (t = cl.Scalar.BLOCK_LITERAL), t !== cl.Scalar.QUOTE_DOUBLE)) {
          let l = Math.max(i.options.lineWidth - i.indent.length, i.options.minContentWidth),
            c = Math.ceil(a.length / l),
            d = new Array(c);
          for (let u = 0, m = 0; u < c; ++u, m += l) d[u] = a.substr(m, l);
          a = d.join(
            t === cl.Scalar.BLOCK_LITERAL
              ? `
`
              : " ",
          );
        }
        return kP.stringifyString({ comment: e, type: t, value: a }, i, r, s);
      },
    };
  ry.binary = MP;
});
var Ps = O((ws) => {
  "use strict";
  var Rs = q(),
    ul = Ft(),
    TP = ge(),
    UP = Dt();
  function sy(e, t) {
    if (Rs.isSeq(e))
      for (let n = 0; n < e.items.length; ++n) {
        let i = e.items[n];
        if (!Rs.isPair(i)) {
          if (Rs.isMap(i)) {
            i.items.length > 1 && t("Each pair must have its own sequence indicator");
            let r = i.items[0] || new ul.Pair(new TP.Scalar(null));
            if (
              (i.commentBefore &&
                (r.key.commentBefore = r.key.commentBefore
                  ? `${i.commentBefore}
${r.key.commentBefore}`
                  : i.commentBefore),
              i.comment)
            ) {
              let s = r.value ?? r.key;
              s.comment = s.comment
                ? `${i.comment}
${s.comment}`
                : i.comment;
            }
            i = r;
          }
          e.items[n] = Rs.isPair(i) ? i : new ul.Pair(i);
        }
      }
    else t("Expected a sequence for this tag");
    return e;
  }
  function oy(e, t, n) {
    let { replacer: i } = n,
      r = new UP.YAMLSeq(e);
    r.tag = "tag:yaml.org,2002:pairs";
    let s = 0;
    if (t && Symbol.iterator in Object(t))
      for (let o of t) {
        typeof i == "function" && (o = i.call(t, String(s++), o));
        let a, l;
        if (Array.isArray(o))
          if (o.length === 2) ((a = o[0]), (l = o[1]));
          else throw new TypeError(`Expected [key, value] tuple: ${o}`);
        else if (o && o instanceof Object) {
          let c = Object.keys(o);
          if (c.length === 1) ((a = c[0]), (l = o[a]));
          else throw new TypeError(`Expected tuple with one key, not ${c.length} keys`);
        } else a = o;
        r.items.push(ul.createPair(a, l, n));
      }
    return r;
  }
  var AP = { collection: "seq", default: !1, tag: "tag:yaml.org,2002:pairs", resolve: sy, createNode: oy };
  ws.createPairs = oy;
  ws.pairs = AP;
  ws.resolvePairs = sy;
});
var yl = O((ml) => {
  "use strict";
  var ay = q(),
    fl = Tt(),
    Fi = Lt(),
    OP = Dt(),
    ly = Ps(),
    ln = class e extends OP.YAMLSeq {
      constructor() {
        (super(),
          (this.add = Fi.YAMLMap.prototype.add.bind(this)),
          (this.delete = Fi.YAMLMap.prototype.delete.bind(this)),
          (this.get = Fi.YAMLMap.prototype.get.bind(this)),
          (this.has = Fi.YAMLMap.prototype.has.bind(this)),
          (this.set = Fi.YAMLMap.prototype.set.bind(this)),
          (this.tag = e.tag));
      }
      toJSON(t, n) {
        if (!n) return super.toJSON(t);
        let i = new Map();
        n?.onCreate && n.onCreate(i);
        for (let r of this.items) {
          let s, o;
          if (
            (ay.isPair(r) ? ((s = fl.toJS(r.key, "", n)), (o = fl.toJS(r.value, s, n))) : (s = fl.toJS(r, "", n)),
            i.has(s))
          )
            throw new Error("Ordered maps must not include duplicate keys");
          i.set(s, o);
        }
        return i;
      }
      static from(t, n, i) {
        let r = ly.createPairs(t, n, i),
          s = new this();
        return ((s.items = r.items), s);
      }
    };
  ln.tag = "tag:yaml.org,2002:omap";
  var FP = {
    collection: "seq",
    identify: (e) => e instanceof Map,
    nodeClass: ln,
    default: !1,
    tag: "tag:yaml.org,2002:omap",
    resolve(e, t) {
      let n = ly.resolvePairs(e, t),
        i = [];
      for (let { key: r } of n.items)
        ay.isScalar(r) &&
          (i.includes(r.value) ? t(`Ordered maps must not include duplicate keys: ${r.value}`) : i.push(r.value));
      return Object.assign(new ln(), n);
    },
    createNode: (e, t, n) => ln.from(e, t, n),
  };
  ml.YAMLOMap = ln;
  ml.omap = FP;
});
var my = O((gl) => {
  "use strict";
  var cy = ge();
  function dy({ value: e, source: t }, n) {
    return t && (e ? uy : fy).test.test(t) ? t : e ? n.options.trueStr : n.options.falseStr;
  }
  var uy = {
      identify: (e) => e === !0,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new cy.Scalar(!0),
      stringify: dy,
    },
    fy = {
      identify: (e) => e === !1,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new cy.Scalar(!1),
      stringify: dy,
    };
  gl.falseTag = fy;
  gl.trueTag = uy;
});
var yy = O((vs) => {
  "use strict";
  var NP = ge(),
    pl = Cn(),
    LP = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (e) =>
        e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: pl.stringifyNumber,
    },
    DP = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (e) => parseFloat(e.replace(/_/g, "")),
      stringify(e) {
        let t = Number(e.value);
        return isFinite(t) ? t.toExponential() : pl.stringifyNumber(e);
      },
    },
    CP = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(e) {
        let t = new NP.Scalar(parseFloat(e.replace(/_/g, ""))),
          n = e.indexOf(".");
        if (n !== -1) {
          let i = e.substring(n + 1).replace(/_/g, "");
          i[i.length - 1] === "0" && (t.minFractionDigits = i.length);
        }
        return t;
      },
      stringify: pl.stringifyNumber,
    };
  vs.float = CP;
  vs.floatExp = DP;
  vs.floatNaN = LP;
});
var py = O((Li) => {
  "use strict";
  var gy = Cn(),
    Ni = (e) => typeof e == "bigint" || Number.isInteger(e);
  function xs(e, t, n, { intAsBigInt: i }) {
    let r = e[0];
    if (((r === "-" || r === "+") && (t += 1), (e = e.substring(t).replace(/_/g, "")), i)) {
      switch (n) {
        case 2:
          e = `0b${e}`;
          break;
        case 8:
          e = `0o${e}`;
          break;
        case 16:
          e = `0x${e}`;
          break;
      }
      let o = BigInt(e);
      return r === "-" ? BigInt(-1) * o : o;
    }
    let s = parseInt(e, n);
    return r === "-" ? -1 * s : s;
  }
  function hl(e, t, n) {
    let { value: i } = e;
    if (Ni(i)) {
      let r = i.toString(t);
      return i < 0 ? "-" + n + r.substr(1) : n + r;
    }
    return gy.stringifyNumber(e);
  }
  var jP = {
      identify: Ni,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (e, t, n) => xs(e, 2, 2, n),
      stringify: (e) => hl(e, 2, "0b"),
    },
    BP = {
      identify: Ni,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (e, t, n) => xs(e, 1, 8, n),
      stringify: (e) => hl(e, 8, "0"),
    },
    $P = {
      identify: Ni,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (e, t, n) => xs(e, 0, 10, n),
      stringify: gy.stringifyNumber,
    },
    GP = {
      identify: Ni,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (e, t, n) => xs(e, 2, 16, n),
      stringify: (e) => hl(e, 16, "0x"),
    };
  Li.int = $P;
  Li.intBin = jP;
  Li.intHex = GP;
  Li.intOct = BP;
});
var bl = O((Il) => {
  "use strict";
  var Ts = q(),
    ks = Ft(),
    Ms = Lt(),
    cn = class e extends Ms.YAMLMap {
      constructor(t) {
        (super(t), (this.tag = e.tag));
      }
      add(t) {
        let n;
        (Ts.isPair(t)
          ? (n = t)
          : t && typeof t == "object" && "key" in t && "value" in t && t.value === null
            ? (n = new ks.Pair(t.key, null))
            : (n = new ks.Pair(t, null)),
          Ms.findPair(this.items, n.key) || this.items.push(n));
      }
      get(t, n) {
        let i = Ms.findPair(this.items, t);
        return !n && Ts.isPair(i) ? (Ts.isScalar(i.key) ? i.key.value : i.key) : i;
      }
      set(t, n) {
        if (typeof n != "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof n}`);
        let i = Ms.findPair(this.items, t);
        i && !n ? this.items.splice(this.items.indexOf(i), 1) : !i && n && this.items.push(new ks.Pair(t));
      }
      toJSON(t, n) {
        return super.toJSON(t, n, Set);
      }
      toString(t, n, i) {
        if (!t) return JSON.stringify(this);
        if (this.hasAllNullValues(!0)) return super.toString(Object.assign({}, t, { allNullValues: !0 }), n, i);
        throw new Error("Set items must all have null values");
      }
      static from(t, n, i) {
        let { replacer: r } = i,
          s = new this(t);
        if (n && Symbol.iterator in Object(n))
          for (let o of n) (typeof r == "function" && (o = r.call(n, o, o)), s.items.push(ks.createPair(o, null, i)));
        return s;
      }
    };
  cn.tag = "tag:yaml.org,2002:set";
  var KP = {
    collection: "map",
    identify: (e) => e instanceof Set,
    nodeClass: cn,
    default: !1,
    tag: "tag:yaml.org,2002:set",
    createNode: (e, t, n) => cn.from(e, t, n),
    resolve(e, t) {
      if (Ts.isMap(e)) {
        if (e.hasAllNullValues(!0)) return Object.assign(new cn(), e);
        t("Set items must all have null values");
      } else t("Expected a mapping for this tag");
      return e;
    },
  };
  Il.YAMLSet = cn;
  Il.set = KP;
});
var _l = O((Us) => {
  "use strict";
  var YP = Cn();
  function Sl(e, t) {
    let n = e[0],
      i = n === "-" || n === "+" ? e.substring(1) : e,
      r = (o) => (t ? BigInt(o) : Number(o)),
      s = i
        .replace(/_/g, "")
        .split(":")
        .reduce((o, a) => o * r(60) + r(a), r(0));
    return n === "-" ? r(-1) * s : s;
  }
  function hy(e) {
    let { value: t } = e,
      n = (o) => o;
    if (typeof t == "bigint") n = (o) => BigInt(o);
    else if (isNaN(t) || !isFinite(t)) return YP.stringifyNumber(e);
    let i = "";
    t < 0 && ((i = "-"), (t *= n(-1)));
    let r = n(60),
      s = [t % r];
    return (
      t < 60 ? s.unshift(0) : ((t = (t - s[0]) / r), s.unshift(t % r), t >= 60 && ((t = (t - s[0]) / r), s.unshift(t))),
      i +
        s
          .map((o) => String(o).padStart(2, "0"))
          .join(":")
          .replace(/000000\d*$/, "")
    );
  }
  var VP = {
      identify: (e) => typeof e == "bigint" || Number.isInteger(e),
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (e, t, { intAsBigInt: n }) => Sl(e, n),
      stringify: hy,
    },
    WP = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (e) => Sl(e, !1),
      stringify: hy,
    },
    Iy = {
      identify: (e) => e instanceof Date,
      default: !0,
      tag: "tag:yaml.org,2002:timestamp",
      test: RegExp(
        "^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$",
      ),
      resolve(e) {
        let t = e.match(Iy.test);
        if (!t) throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        let [, n, i, r, s, o, a] = t.map(Number),
          l = t[7] ? Number((t[7] + "00").substr(1, 3)) : 0,
          c = Date.UTC(n, i - 1, r, s || 0, o || 0, a || 0, l),
          d = t[8];
        if (d && d !== "Z") {
          let u = Sl(d, !1);
          (Math.abs(u) < 30 && (u *= 60), (c -= 6e4 * u));
        }
        return new Date(c);
      },
      stringify: ({ value: e }) => e?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? "",
    };
  Us.floatTime = WP;
  Us.intTime = VP;
  Us.timestamp = Iy;
});
var _y = O((Sy) => {
  "use strict";
  var qP = Ln(),
    zP = Is(),
    HP = Dn(),
    JP = Ai(),
    XP = dl(),
    by = my(),
    El = yy(),
    As = py(),
    QP = ds(),
    ZP = yl(),
    ev = Ps(),
    tv = bl(),
    Rl = _l(),
    nv = [
      qP.map,
      HP.seq,
      JP.string,
      zP.nullTag,
      by.trueTag,
      by.falseTag,
      As.intBin,
      As.intOct,
      As.int,
      As.intHex,
      El.floatNaN,
      El.floatExp,
      El.float,
      XP.binary,
      QP.merge,
      ZP.omap,
      ev.pairs,
      tv.set,
      Rl.intTime,
      Rl.floatTime,
      Rl.timestamp,
    ];
  Sy.schema = nv;
});
var Uy = O((vl) => {
  "use strict";
  var Py = Ln(),
    iv = Is(),
    vy = Dn(),
    rv = Ai(),
    sv = nl(),
    wl = rl(),
    Pl = ol(),
    ov = ey(),
    av = iy(),
    xy = dl(),
    Di = ds(),
    ky = yl(),
    My = Ps(),
    Ey = _y(),
    Ty = bl(),
    Os = _l(),
    Ry = new Map([
      ["core", ov.schema],
      ["failsafe", [Py.map, vy.seq, rv.string]],
      ["json", av.schema],
      ["yaml11", Ey.schema],
      ["yaml-1.1", Ey.schema],
    ]),
    wy = {
      binary: xy.binary,
      bool: sv.boolTag,
      float: wl.float,
      floatExp: wl.floatExp,
      floatNaN: wl.floatNaN,
      floatTime: Os.floatTime,
      int: Pl.int,
      intHex: Pl.intHex,
      intOct: Pl.intOct,
      intTime: Os.intTime,
      map: Py.map,
      merge: Di.merge,
      null: iv.nullTag,
      omap: ky.omap,
      pairs: My.pairs,
      seq: vy.seq,
      set: Ty.set,
      timestamp: Os.timestamp,
    },
    lv = {
      "tag:yaml.org,2002:binary": xy.binary,
      "tag:yaml.org,2002:merge": Di.merge,
      "tag:yaml.org,2002:omap": ky.omap,
      "tag:yaml.org,2002:pairs": My.pairs,
      "tag:yaml.org,2002:set": Ty.set,
      "tag:yaml.org,2002:timestamp": Os.timestamp,
    };
  function cv(e, t, n) {
    let i = Ry.get(t);
    if (i && !e) return n && !i.includes(Di.merge) ? i.concat(Di.merge) : i.slice();
    let r = i;
    if (!r)
      if (Array.isArray(e)) r = [];
      else {
        let s = Array.from(Ry.keys())
          .filter((o) => o !== "yaml11")
          .map((o) => JSON.stringify(o))
          .join(", ");
        throw new Error(`Unknown schema "${t}"; use one of ${s} or define customTags array`);
      }
    if (Array.isArray(e)) for (let s of e) r = r.concat(s);
    else typeof e == "function" && (r = e(r.slice()));
    return (
      n && (r = r.concat(Di.merge)),
      r.reduce((s, o) => {
        let a = typeof o == "string" ? wy[o] : o;
        if (!a) {
          let l = JSON.stringify(o),
            c = Object.keys(wy)
              .map((d) => JSON.stringify(d))
              .join(", ");
          throw new Error(`Unknown custom tag ${l}; use one of ${c}`);
        }
        return (s.includes(a) || s.push(a), s);
      }, [])
    );
  }
  vl.coreKnownTags = lv;
  vl.getTags = cv;
});
var Ml = O((Ay) => {
  "use strict";
  var xl = q(),
    dv = Ln(),
    uv = Dn(),
    fv = Ai(),
    Fs = Uy(),
    mv = (e, t) => (e.key < t.key ? -1 : e.key > t.key ? 1 : 0),
    kl = class e {
      constructor({
        compat: t,
        customTags: n,
        merge: i,
        resolveKnownTags: r,
        schema: s,
        sortMapEntries: o,
        toStringDefaults: a,
      }) {
        ((this.compat = Array.isArray(t) ? Fs.getTags(t, "compat") : t ? Fs.getTags(null, t) : null),
          (this.name = (typeof s == "string" && s) || "core"),
          (this.knownTags = r ? Fs.coreKnownTags : {}),
          (this.tags = Fs.getTags(n, this.name, i)),
          (this.toStringOptions = a ?? null),
          Object.defineProperty(this, xl.MAP, { value: dv.map }),
          Object.defineProperty(this, xl.SCALAR, { value: fv.string }),
          Object.defineProperty(this, xl.SEQ, { value: uv.seq }),
          (this.sortMapEntries = typeof o == "function" ? o : o === !0 ? mv : null));
      }
      clone() {
        let t = Object.create(e.prototype, Object.getOwnPropertyDescriptors(this));
        return ((t.tags = this.tags.slice()), t);
      }
    };
  Ay.Schema = kl;
});
var Fy = O((Oy) => {
  "use strict";
  var yv = q(),
    Tl = Mi(),
    Ci = Pi();
  function gv(e, t) {
    let n = [],
      i = t.directives === !0;
    if (t.directives !== !1 && e.directives) {
      let l = e.directives.toString(e);
      l ? (n.push(l), (i = !0)) : e.directives.docStart && (i = !0);
    }
    i && n.push("---");
    let r = Tl.createStringifyContext(e, t),
      { commentString: s } = r.options;
    if (e.commentBefore) {
      n.length !== 1 && n.unshift("");
      let l = s(e.commentBefore);
      n.unshift(Ci.indentComment(l, ""));
    }
    let o = !1,
      a = null;
    if (e.contents) {
      if (yv.isNode(e.contents)) {
        if ((e.contents.spaceBefore && i && n.push(""), e.contents.commentBefore)) {
          let d = s(e.contents.commentBefore);
          n.push(Ci.indentComment(d, ""));
        }
        ((r.forceBlockIndent = !!e.comment), (a = e.contents.comment));
      }
      let l = a ? void 0 : () => (o = !0),
        c = Tl.stringify(e.contents, r, () => (a = null), l);
      (a && (c += Ci.lineComment(c, "", s(a))),
        (c[0] === "|" || c[0] === ">") && n[n.length - 1] === "---" ? (n[n.length - 1] = `--- ${c}`) : n.push(c));
    } else n.push(Tl.stringify(e.contents, r));
    if (e.directives?.docEnd)
      if (e.comment) {
        let l = s(e.comment);
        l.includes(`
`)
          ? (n.push("..."), n.push(Ci.indentComment(l, "")))
          : n.push(`... ${l}`);
      } else n.push("...");
    else {
      let l = e.comment;
      (l && o && (l = l.replace(/^\n+/, "")),
        l && ((!o || a) && n[n.length - 1] !== "" && n.push(""), n.push(Ci.indentComment(s(l), ""))));
    }
    return (
      n.join(`
`) +
      `
`
    );
  }
  Oy.stringifyDocument = gv;
});
var ji = O((Ny) => {
  "use strict";
  var pv = Ri(),
    jn = es(),
    ze = q(),
    hv = Ft(),
    Iv = Tt(),
    bv = Ml(),
    Sv = Fy(),
    Ul = Jr(),
    _v = Na(),
    Ev = wi(),
    Al = Fa(),
    Ol = class e {
      constructor(t, n, i) {
        ((this.commentBefore = null),
          (this.comment = null),
          (this.errors = []),
          (this.warnings = []),
          Object.defineProperty(this, ze.NODE_TYPE, { value: ze.DOC }));
        let r = null;
        typeof n == "function" || Array.isArray(n) ? (r = n) : i === void 0 && n && ((i = n), (n = void 0));
        let s = Object.assign(
          {
            intAsBigInt: !1,
            keepSourceTokens: !1,
            logLevel: "warn",
            prettyErrors: !0,
            strict: !0,
            stringKeys: !1,
            uniqueKeys: !0,
            version: "1.2",
          },
          i,
        );
        this.options = s;
        let { version: o } = s;
        (i?._directives
          ? ((this.directives = i._directives.atDocument()),
            this.directives.yaml.explicit && (o = this.directives.yaml.version))
          : (this.directives = new Al.Directives({ version: o })),
          this.setSchema(o, i),
          (this.contents = t === void 0 ? null : this.createNode(t, r, i)));
      }
      clone() {
        let t = Object.create(e.prototype, { [ze.NODE_TYPE]: { value: ze.DOC } });
        return (
          (t.commentBefore = this.commentBefore),
          (t.comment = this.comment),
          (t.errors = this.errors.slice()),
          (t.warnings = this.warnings.slice()),
          (t.options = Object.assign({}, this.options)),
          this.directives && (t.directives = this.directives.clone()),
          (t.schema = this.schema.clone()),
          (t.contents = ze.isNode(this.contents) ? this.contents.clone(t.schema) : this.contents),
          this.range && (t.range = this.range.slice()),
          t
        );
      }
      add(t) {
        Bn(this.contents) && this.contents.add(t);
      }
      addIn(t, n) {
        Bn(this.contents) && this.contents.addIn(t, n);
      }
      createAlias(t, n) {
        if (!t.anchor) {
          let i = Ul.anchorNames(this);
          t.anchor = !n || i.has(n) ? Ul.findNewAnchor(n || "a", i) : n;
        }
        return new pv.Alias(t.anchor);
      }
      createNode(t, n, i) {
        let r;
        if (typeof n == "function") ((t = n.call({ "": t }, "", t)), (r = n));
        else if (Array.isArray(n)) {
          let h = (_) => typeof _ == "number" || _ instanceof String || _ instanceof Number,
            S = n.filter(h).map(String);
          (S.length > 0 && (n = n.concat(S)), (r = n));
        } else i === void 0 && n && ((i = n), (n = void 0));
        let { aliasDuplicateObjects: s, anchorPrefix: o, flow: a, keepUndefined: l, onTagObj: c, tag: d } = i ?? {},
          { onAnchor: u, setAnchors: m, sourceObjects: y } = Ul.createNodeAnchors(this, o || "a"),
          p = {
            aliasDuplicateObjects: s ?? !0,
            keepUndefined: l ?? !1,
            onAnchor: u,
            onTagObj: c,
            replacer: r,
            schema: this.schema,
            sourceObjects: y,
          },
          g = Ev.createNode(t, d, p);
        return (a && ze.isCollection(g) && (g.flow = !0), m(), g);
      }
      createPair(t, n, i = {}) {
        let r = this.createNode(t, null, i),
          s = this.createNode(n, null, i);
        return new hv.Pair(r, s);
      }
      delete(t) {
        return Bn(this.contents) ? this.contents.delete(t) : !1;
      }
      deleteIn(t) {
        return jn.isEmptyPath(t)
          ? this.contents == null
            ? !1
            : ((this.contents = null), !0)
          : Bn(this.contents)
            ? this.contents.deleteIn(t)
            : !1;
      }
      get(t, n) {
        return ze.isCollection(this.contents) ? this.contents.get(t, n) : void 0;
      }
      getIn(t, n) {
        return jn.isEmptyPath(t)
          ? !n && ze.isScalar(this.contents)
            ? this.contents.value
            : this.contents
          : ze.isCollection(this.contents)
            ? this.contents.getIn(t, n)
            : void 0;
      }
      has(t) {
        return ze.isCollection(this.contents) ? this.contents.has(t) : !1;
      }
      hasIn(t) {
        return jn.isEmptyPath(t)
          ? this.contents !== void 0
          : ze.isCollection(this.contents)
            ? this.contents.hasIn(t)
            : !1;
      }
      set(t, n) {
        this.contents == null
          ? (this.contents = jn.collectionFromPath(this.schema, [t], n))
          : Bn(this.contents) && this.contents.set(t, n);
      }
      setIn(t, n) {
        jn.isEmptyPath(t)
          ? (this.contents = n)
          : this.contents == null
            ? (this.contents = jn.collectionFromPath(this.schema, Array.from(t), n))
            : Bn(this.contents) && this.contents.setIn(t, n);
      }
      setSchema(t, n = {}) {
        typeof t == "number" && (t = String(t));
        let i;
        switch (t) {
          case "1.1":
            (this.directives
              ? (this.directives.yaml.version = "1.1")
              : (this.directives = new Al.Directives({ version: "1.1" })),
              (i = { resolveKnownTags: !1, schema: "yaml-1.1" }));
            break;
          case "1.2":
          case "next":
            (this.directives
              ? (this.directives.yaml.version = t)
              : (this.directives = new Al.Directives({ version: t })),
              (i = { resolveKnownTags: !0, schema: "core" }));
            break;
          case null:
            (this.directives && delete this.directives, (i = null));
            break;
          default: {
            let r = JSON.stringify(t);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${r}`);
          }
        }
        if (n.schema instanceof Object) this.schema = n.schema;
        else if (i) this.schema = new bv.Schema(Object.assign(i, n));
        else throw new Error("With a null YAML version, the { schema: Schema } option is required");
      }
      toJS({ json: t, jsonArg: n, mapAsMap: i, maxAliasCount: r, onAnchor: s, reviver: o } = {}) {
        let a = {
            anchors: new Map(),
            doc: this,
            keep: !t,
            mapAsMap: i === !0,
            mapKeyWarned: !1,
            maxAliasCount: typeof r == "number" ? r : 100,
          },
          l = Iv.toJS(this.contents, n ?? "", a);
        if (typeof s == "function") for (let { count: c, res: d } of a.anchors.values()) s(d, c);
        return typeof o == "function" ? _v.applyReviver(o, { "": l }, "", l) : l;
      }
      toJSON(t, n) {
        return this.toJS({ json: !0, jsonArg: t, mapAsMap: !1, onAnchor: n });
      }
      toString(t = {}) {
        if (this.errors.length > 0) throw new Error("Document with errors cannot be stringified");
        if ("indent" in t && (!Number.isInteger(t.indent) || Number(t.indent) <= 0)) {
          let n = JSON.stringify(t.indent);
          throw new Error(`"indent" option must be a positive integer, not ${n}`);
        }
        return Sv.stringifyDocument(this, t);
      }
    };
  function Bn(e) {
    if (ze.isCollection(e)) return !0;
    throw new Error("Expected a YAML collection as document contents");
  }
  Ny.Document = Ol;
});
var Gi = O(($i) => {
  "use strict";
  var Bi = class extends Error {
      constructor(t, n, i, r) {
        (super(), (this.name = t), (this.code = i), (this.message = r), (this.pos = n));
      }
    },
    Fl = class extends Bi {
      constructor(t, n, i) {
        super("YAMLParseError", t, n, i);
      }
    },
    Nl = class extends Bi {
      constructor(t, n, i) {
        super("YAMLWarning", t, n, i);
      }
    },
    Rv = (e, t) => (n) => {
      if (n.pos[0] === -1) return;
      n.linePos = n.pos.map((a) => t.linePos(a));
      let { line: i, col: r } = n.linePos[0];
      n.message += ` at line ${i}, column ${r}`;
      let s = r - 1,
        o = e.substring(t.lineStarts[i - 1], t.lineStarts[i]).replace(/[\n\r]+$/, "");
      if (s >= 60 && o.length > 80) {
        let a = Math.min(s - 39, o.length - 79);
        ((o = "\u2026" + o.substring(a)), (s -= a - 1));
      }
      if ((o.length > 80 && (o = o.substring(0, 79) + "\u2026"), i > 1 && /^ *$/.test(o.substring(0, s)))) {
        let a = e.substring(t.lineStarts[i - 2], t.lineStarts[i - 1]);
        (a.length > 80 &&
          (a =
            a.substring(0, 79) +
            `\u2026
`),
          (o = a + o));
      }
      if (/[^ ]/.test(o)) {
        let a = 1,
          l = n.linePos[1];
        l?.line === i && l.col > r && (a = Math.max(1, Math.min(l.col - r, 80 - s)));
        let c = " ".repeat(s) + "^".repeat(a);
        n.message += `:

${o}
${c}
`;
      }
    };
  $i.YAMLError = Bi;
  $i.YAMLParseError = Fl;
  $i.YAMLWarning = Nl;
  $i.prettifyError = Rv;
});
var Ki = O((Ly) => {
  "use strict";
  function wv(e, { flow: t, indicator: n, next: i, offset: r, onError: s, parentIndent: o, startOnNewline: a }) {
    let l = !1,
      c = a,
      d = a,
      u = "",
      m = "",
      y = !1,
      p = !1,
      g = null,
      h = null,
      S = null,
      _ = null,
      E = null,
      b = null,
      R = null;
    for (let x of e)
      switch (
        (p &&
          (x.type !== "space" &&
            x.type !== "newline" &&
            x.type !== "comma" &&
            s(x.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"),
          (p = !1)),
        g &&
          (c &&
            x.type !== "comment" &&
            x.type !== "newline" &&
            s(g, "TAB_AS_INDENT", "Tabs are not allowed as indentation"),
          (g = null)),
        x.type)
      ) {
        case "space":
          (!t && (n !== "doc-start" || i?.type !== "flow-collection") && x.source.includes("	") && (g = x), (d = !0));
          break;
        case "comment": {
          d || s(x, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          let $ = x.source.substring(1) || " ";
          (u ? (u += m + $) : (u = $), (m = ""), (c = !1));
          break;
        }
        case "newline":
          (c ? (u ? (u += x.source) : (!b || n !== "seq-item-ind") && (l = !0)) : (m += x.source),
            (c = !0),
            (y = !0),
            (h || S) && (_ = x),
            (d = !0));
          break;
        case "anchor":
          (h && s(x, "MULTIPLE_ANCHORS", "A node can have at most one anchor"),
            x.source.endsWith(":") &&
              s(x.offset + x.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0),
            (h = x),
            R ?? (R = x.offset),
            (c = !1),
            (d = !1),
            (p = !0));
          break;
        case "tag": {
          (S && s(x, "MULTIPLE_TAGS", "A node can have at most one tag"),
            (S = x),
            R ?? (R = x.offset),
            (c = !1),
            (d = !1),
            (p = !0));
          break;
        }
        case n:
          ((h || S) && s(x, "BAD_PROP_ORDER", `Anchors and tags must be after the ${x.source} indicator`),
            b && s(x, "UNEXPECTED_TOKEN", `Unexpected ${x.source} in ${t ?? "collection"}`),
            (b = x),
            (c = n === "seq-item-ind" || n === "explicit-key-ind"),
            (d = !1));
          break;
        case "comma":
          if (t) {
            (E && s(x, "UNEXPECTED_TOKEN", `Unexpected , in ${t}`), (E = x), (c = !1), (d = !1));
            break;
          }
        default:
          (s(x, "UNEXPECTED_TOKEN", `Unexpected ${x.type} token`), (c = !1), (d = !1));
      }
    let v = e[e.length - 1],
      T = v ? v.offset + v.source.length : r;
    return (
      p &&
        i &&
        i.type !== "space" &&
        i.type !== "newline" &&
        i.type !== "comma" &&
        (i.type !== "scalar" || i.source !== "") &&
        s(i.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"),
      g &&
        ((c && g.indent <= o) || i?.type === "block-map" || i?.type === "block-seq") &&
        s(g, "TAB_AS_INDENT", "Tabs are not allowed as indentation"),
      {
        comma: E,
        found: b,
        spaceBefore: l,
        comment: u,
        hasNewline: y,
        anchor: h,
        tag: S,
        newlineAfterProp: _,
        end: T,
        start: R ?? T,
      }
    );
  }
  Ly.resolveProps = wv;
});
var Ns = O((Dy) => {
  "use strict";
  function Ll(e) {
    if (!e) return null;
    switch (e.type) {
      case "alias":
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        if (
          e.source.includes(`
`)
        )
          return !0;
        if (e.end) {
          for (let t of e.end) if (t.type === "newline") return !0;
        }
        return !1;
      case "flow-collection":
        for (let t of e.items) {
          for (let n of t.start) if (n.type === "newline") return !0;
          if (t.sep) {
            for (let n of t.sep) if (n.type === "newline") return !0;
          }
          if (Ll(t.key) || Ll(t.value)) return !0;
        }
        return !1;
      default:
        return !0;
    }
  }
  Dy.containsNewline = Ll;
});
var Dl = O((Cy) => {
  "use strict";
  var Pv = Ns();
  function vv(e, t, n) {
    if (t?.type === "flow-collection") {
      let i = t.end[0];
      i.indent === e &&
        (i.source === "]" || i.source === "}") &&
        Pv.containsNewline(t) &&
        n(i, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
    }
  }
  Cy.flowIndentCheck = vv;
});
var Cl = O((By) => {
  "use strict";
  var jy = q();
  function xv(e, t, n) {
    let { uniqueKeys: i } = e.options;
    if (i === !1) return !1;
    let r = typeof i == "function" ? i : (s, o) => s === o || (jy.isScalar(s) && jy.isScalar(o) && s.value === o.value);
    return t.some((s) => r(s.key, n));
  }
  By.mapIncludes = xv;
});
var Wy = O((Vy) => {
  "use strict";
  var $y = Ft(),
    kv = Lt(),
    Gy = Ki(),
    Mv = Ns(),
    Ky = Dl(),
    Tv = Cl(),
    Yy = "All mapping items must start at the same column";
  function Uv({ composeNode: e, composeEmptyNode: t }, n, i, r, s) {
    let o = s?.nodeClass ?? kv.YAMLMap,
      a = new o(n.schema);
    n.atRoot && (n.atRoot = !1);
    let l = i.offset,
      c = null;
    for (let d of i.items) {
      let { start: u, key: m, sep: y, value: p } = d,
        g = Gy.resolveProps(u, {
          indicator: "explicit-key-ind",
          next: m ?? y?.[0],
          offset: l,
          onError: r,
          parentIndent: i.indent,
          startOnNewline: !0,
        }),
        h = !g.found;
      if (h) {
        if (
          (m &&
            (m.type === "block-seq"
              ? r(l, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key")
              : "indent" in m && m.indent !== i.indent && r(l, "BAD_INDENT", Yy)),
          !g.anchor && !g.tag && !y)
        ) {
          ((c = g.end),
            g.comment &&
              (a.comment
                ? (a.comment +=
                    `
` + g.comment)
                : (a.comment = g.comment)));
          continue;
        }
        (g.newlineAfterProp || Mv.containsNewline(m)) &&
          r(m ?? u[u.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
      } else g.found?.indent !== i.indent && r(l, "BAD_INDENT", Yy);
      n.atKey = !0;
      let S = g.end,
        _ = m ? e(n, m, g, r) : t(n, S, u, null, g, r);
      (n.schema.compat && Ky.flowIndentCheck(i.indent, m, r),
        (n.atKey = !1),
        Tv.mapIncludes(n, a.items, _) && r(S, "DUPLICATE_KEY", "Map keys must be unique"));
      let E = Gy.resolveProps(y ?? [], {
        indicator: "map-value-ind",
        next: p,
        offset: _.range[2],
        onError: r,
        parentIndent: i.indent,
        startOnNewline: !m || m.type === "block-scalar",
      });
      if (((l = E.end), E.found)) {
        h &&
          (p?.type === "block-map" &&
            !E.hasNewline &&
            r(l, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"),
          n.options.strict &&
            g.start < E.found.offset - 1024 &&
            r(
              _.range,
              "KEY_OVER_1024_CHARS",
              "The : indicator must be at most 1024 chars after the start of an implicit block mapping key",
            ));
        let b = p ? e(n, p, E, r) : t(n, l, y, null, E, r);
        (n.schema.compat && Ky.flowIndentCheck(i.indent, p, r), (l = b.range[2]));
        let R = new $y.Pair(_, b);
        (n.options.keepSourceTokens && (R.srcToken = d), a.items.push(R));
      } else {
        (h && r(_.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"),
          E.comment &&
            (_.comment
              ? (_.comment +=
                  `
` + E.comment)
              : (_.comment = E.comment)));
        let b = new $y.Pair(_);
        (n.options.keepSourceTokens && (b.srcToken = d), a.items.push(b));
      }
    }
    return (
      c && c < l && r(c, "IMPOSSIBLE", "Map comment with trailing content"),
      (a.range = [i.offset, l, c ?? l]),
      a
    );
  }
  Vy.resolveBlockMap = Uv;
});
var zy = O((qy) => {
  "use strict";
  var Av = Dt(),
    Ov = Ki(),
    Fv = Dl();
  function Nv({ composeNode: e, composeEmptyNode: t }, n, i, r, s) {
    let o = s?.nodeClass ?? Av.YAMLSeq,
      a = new o(n.schema);
    (n.atRoot && (n.atRoot = !1), n.atKey && (n.atKey = !1));
    let l = i.offset,
      c = null;
    for (let { start: d, value: u } of i.items) {
      let m = Ov.resolveProps(d, {
        indicator: "seq-item-ind",
        next: u,
        offset: l,
        onError: r,
        parentIndent: i.indent,
        startOnNewline: !0,
      });
      if (!m.found)
        if (m.anchor || m.tag || u)
          u?.type === "block-seq"
            ? r(m.end, "BAD_INDENT", "All sequence items must start at the same column")
            : r(l, "MISSING_CHAR", "Sequence item without - indicator");
        else {
          ((c = m.end), m.comment && (a.comment = m.comment));
          continue;
        }
      let y = u ? e(n, u, m, r) : t(n, m.end, d, null, m, r);
      (n.schema.compat && Fv.flowIndentCheck(i.indent, u, r), (l = y.range[2]), a.items.push(y));
    }
    return ((a.range = [i.offset, l, c ?? l]), a);
  }
  qy.resolveBlockSeq = Nv;
});
var $n = O((Hy) => {
  "use strict";
  function Lv(e, t, n, i) {
    let r = "";
    if (e) {
      let s = !1,
        o = "";
      for (let a of e) {
        let { source: l, type: c } = a;
        switch (c) {
          case "space":
            s = !0;
            break;
          case "comment": {
            n && !s && i(a, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            let d = l.substring(1) || " ";
            (r ? (r += o + d) : (r = d), (o = ""));
            break;
          }
          case "newline":
            (r && (o += l), (s = !0));
            break;
          default:
            i(a, "UNEXPECTED_TOKEN", `Unexpected ${c} at node end`);
        }
        t += l.length;
      }
    }
    return { comment: r, offset: t };
  }
  Hy.resolveEnd = Lv;
});
var Zy = O((Qy) => {
  "use strict";
  var Dv = q(),
    Cv = Ft(),
    Jy = Lt(),
    jv = Dt(),
    Bv = $n(),
    Xy = Ki(),
    $v = Ns(),
    Gv = Cl(),
    jl = "Block collections are not allowed within flow collections",
    Bl = (e) => e && (e.type === "block-map" || e.type === "block-seq");
  function Kv({ composeNode: e, composeEmptyNode: t }, n, i, r, s) {
    let o = i.start.source === "{",
      a = o ? "flow map" : "flow sequence",
      l = s?.nodeClass ?? (o ? Jy.YAMLMap : jv.YAMLSeq),
      c = new l(n.schema);
    c.flow = !0;
    let d = n.atRoot;
    (d && (n.atRoot = !1), n.atKey && (n.atKey = !1));
    let u = i.offset + i.start.source.length;
    for (let h = 0; h < i.items.length; ++h) {
      let S = i.items[h],
        { start: _, key: E, sep: b, value: R } = S,
        v = Xy.resolveProps(_, {
          flow: a,
          indicator: "explicit-key-ind",
          next: E ?? b?.[0],
          offset: u,
          onError: r,
          parentIndent: i.indent,
          startOnNewline: !1,
        });
      if (!v.found) {
        if (!v.anchor && !v.tag && !b && !R) {
          (h === 0 && v.comma
            ? r(v.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`)
            : h < i.items.length - 1 && r(v.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${a}`),
            v.comment &&
              (c.comment
                ? (c.comment +=
                    `
` + v.comment)
                : (c.comment = v.comment)),
            (u = v.end));
          continue;
        }
        !o &&
          n.options.strict &&
          $v.containsNewline(E) &&
          r(E, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
      }
      if (h === 0) v.comma && r(v.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`);
      else if ((v.comma || r(v.start, "MISSING_CHAR", `Missing , between ${a} items`), v.comment)) {
        let T = "";
        e: for (let x of _)
          switch (x.type) {
            case "comma":
            case "space":
              break;
            case "comment":
              T = x.source.substring(1);
              break e;
            default:
              break e;
          }
        if (T) {
          let x = c.items[c.items.length - 1];
          (Dv.isPair(x) && (x = x.value ?? x.key),
            x.comment
              ? (x.comment +=
                  `
` + T)
              : (x.comment = T),
            (v.comment = v.comment.substring(T.length + 1)));
        }
      }
      if (!o && !b && !v.found) {
        let T = R ? e(n, R, v, r) : t(n, v.end, b, null, v, r);
        (c.items.push(T), (u = T.range[2]), Bl(R) && r(T.range, "BLOCK_IN_FLOW", jl));
      } else {
        n.atKey = !0;
        let T = v.end,
          x = E ? e(n, E, v, r) : t(n, T, _, null, v, r);
        (Bl(E) && r(x.range, "BLOCK_IN_FLOW", jl), (n.atKey = !1));
        let $ = Xy.resolveProps(b ?? [], {
          flow: a,
          indicator: "map-value-ind",
          next: R,
          offset: x.range[2],
          onError: r,
          parentIndent: i.indent,
          startOnNewline: !1,
        });
        if ($.found) {
          if (!o && !v.found && n.options.strict) {
            if (b)
              for (let V of b) {
                if (V === $.found) break;
                if (V.type === "newline") {
                  r(V, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                  break;
                }
              }
            v.start < $.found.offset - 1024 &&
              r(
                $.found,
                "KEY_OVER_1024_CHARS",
                "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key",
              );
          }
        } else
          R &&
            ("source" in R && R.source?.[0] === ":"
              ? r(R, "MISSING_CHAR", `Missing space after : in ${a}`)
              : r($.start, "MISSING_CHAR", `Missing , or : between ${a} items`));
        let z = R ? e(n, R, $, r) : $.found ? t(n, $.end, b, null, $, r) : null;
        z
          ? Bl(R) && r(z.range, "BLOCK_IN_FLOW", jl)
          : $.comment &&
            (x.comment
              ? (x.comment +=
                  `
` + $.comment)
              : (x.comment = $.comment));
        let Y = new Cv.Pair(x, z);
        if ((n.options.keepSourceTokens && (Y.srcToken = S), o)) {
          let V = c;
          (Gv.mapIncludes(n, V.items, x) && r(T, "DUPLICATE_KEY", "Map keys must be unique"), V.items.push(Y));
        } else {
          let V = new Jy.YAMLMap(n.schema);
          ((V.flow = !0), V.items.push(Y));
          let G = (z ?? x).range;
          ((V.range = [x.range[0], G[1], G[2]]), c.items.push(V));
        }
        u = z ? z.range[2] : $.end;
      }
    }
    let m = o ? "}" : "]",
      [y, ...p] = i.end,
      g = u;
    if (y?.source === m) g = y.offset + y.source.length;
    else {
      let h = a[0].toUpperCase() + a.substring(1),
        S = d
          ? `${h} must end with a ${m}`
          : `${h} in block collection must be sufficiently indented and end with a ${m}`;
      (r(u, d ? "MISSING_CHAR" : "BAD_INDENT", S), y && y.source.length !== 1 && p.unshift(y));
    }
    if (p.length > 0) {
      let h = Bv.resolveEnd(p, g, n.options.strict, r);
      (h.comment &&
        (c.comment
          ? (c.comment +=
              `
` + h.comment)
          : (c.comment = h.comment)),
        (c.range = [i.offset, g, h.offset]));
    } else c.range = [i.offset, g, g];
    return c;
  }
  Qy.resolveFlowCollection = Kv;
});
var tg = O((eg) => {
  "use strict";
  var Yv = q(),
    Vv = ge(),
    Wv = Lt(),
    qv = Dt(),
    zv = Wy(),
    Hv = zy(),
    Jv = Zy();
  function $l(e, t, n, i, r, s) {
    let o =
        n.type === "block-map"
          ? zv.resolveBlockMap(e, t, n, i, s)
          : n.type === "block-seq"
            ? Hv.resolveBlockSeq(e, t, n, i, s)
            : Jv.resolveFlowCollection(e, t, n, i, s),
      a = o.constructor;
    return r === "!" || r === a.tagName ? ((o.tag = a.tagName), o) : (r && (o.tag = r), o);
  }
  function Xv(e, t, n, i, r) {
    let s = i.tag,
      o = s ? t.directives.tagName(s.source, (m) => r(s, "TAG_RESOLVE_FAILED", m)) : null;
    if (n.type === "block-seq") {
      let { anchor: m, newlineAfterProp: y } = i,
        p = m && s ? (m.offset > s.offset ? m : s) : (m ?? s);
      p && (!y || y.offset < p.offset) && r(p, "MISSING_CHAR", "Missing newline after block sequence props");
    }
    let a = n.type === "block-map" ? "map" : n.type === "block-seq" ? "seq" : n.start.source === "{" ? "map" : "seq";
    if (!s || !o || o === "!" || (o === Wv.YAMLMap.tagName && a === "map") || (o === qv.YAMLSeq.tagName && a === "seq"))
      return $l(e, t, n, r, o);
    let l = t.schema.tags.find((m) => m.tag === o && m.collection === a);
    if (!l) {
      let m = t.schema.knownTags[o];
      if (m?.collection === a) (t.schema.tags.push(Object.assign({}, m, { default: !1 })), (l = m));
      else
        return (
          m
            ? r(
                s,
                "BAD_COLLECTION_TYPE",
                `${m.tag} used for ${a} collection, but expects ${m.collection ?? "scalar"}`,
                !0,
              )
            : r(s, "TAG_RESOLVE_FAILED", `Unresolved tag: ${o}`, !0),
          $l(e, t, n, r, o)
        );
    }
    let c = $l(e, t, n, r, o, l),
      d = l.resolve?.(c, (m) => r(s, "TAG_RESOLVE_FAILED", m), t.options) ?? c,
      u = Yv.isNode(d) ? d : new Vv.Scalar(d);
    return ((u.range = c.range), (u.tag = o), l?.format && (u.format = l.format), u);
  }
  eg.composeCollection = Xv;
});
var Kl = O((ng) => {
  "use strict";
  var Gl = ge();
  function Qv(e, t, n) {
    let i = t.offset,
      r = Zv(t, e.options.strict, n);
    if (!r) return { value: "", type: null, comment: "", range: [i, i, i] };
    let s = r.mode === ">" ? Gl.Scalar.BLOCK_FOLDED : Gl.Scalar.BLOCK_LITERAL,
      o = t.source ? ex(t.source) : [],
      a = o.length;
    for (let g = o.length - 1; g >= 0; --g) {
      let h = o[g][1];
      if (h === "" || h === "\r") a = g;
      else break;
    }
    if (a === 0) {
      let g =
          r.chomp === "+" && o.length > 0
            ? `
`.repeat(Math.max(1, o.length - 1))
            : "",
        h = i + r.length;
      return (t.source && (h += t.source.length), { value: g, type: s, comment: r.comment, range: [i, h, h] });
    }
    let l = t.indent + r.indent,
      c = t.offset + r.length,
      d = 0;
    for (let g = 0; g < a; ++g) {
      let [h, S] = o[g];
      if (S === "" || S === "\r") r.indent === 0 && h.length > l && (l = h.length);
      else {
        (h.length < l &&
          n(
            c + h.length,
            "MISSING_CHAR",
            "Block scalars with more-indented leading empty lines must use an explicit indentation indicator",
          ),
          r.indent === 0 && (l = h.length),
          (d = g),
          l === 0 && !e.atRoot && n(c, "BAD_INDENT", "Block scalar values in collections must be indented"));
        break;
      }
      c += h.length + S.length + 1;
    }
    for (let g = o.length - 1; g >= a; --g) o[g][0].length > l && (a = g + 1);
    let u = "",
      m = "",
      y = !1;
    for (let g = 0; g < d; ++g)
      u +=
        o[g][0].slice(l) +
        `
`;
    for (let g = d; g < a; ++g) {
      let [h, S] = o[g];
      c += h.length + S.length + 1;
      let _ = S[S.length - 1] === "\r";
      if ((_ && (S = S.slice(0, -1)), S && h.length < l)) {
        let b = `Block scalar lines must not be less indented than their ${r.indent ? "explicit indentation indicator" : "first line"}`;
        (n(c - S.length - (_ ? 2 : 1), "BAD_INDENT", b), (h = ""));
      }
      s === Gl.Scalar.BLOCK_LITERAL
        ? ((u += m + h.slice(l) + S),
          (m = `
`))
        : h.length > l || S[0] === "	"
          ? (m === " "
              ? (m = `
`)
              : !y &&
                m ===
                  `
` &&
                (m = `

`),
            (u += m + h.slice(l) + S),
            (m = `
`),
            (y = !0))
          : S === ""
            ? m ===
              `
`
              ? (u += `
`)
              : (m = `
`)
            : ((u += m + S), (m = " "), (y = !1));
    }
    switch (r.chomp) {
      case "-":
        break;
      case "+":
        for (let g = a; g < o.length; ++g)
          u +=
            `
` + o[g][0].slice(l);
        u[u.length - 1] !==
          `
` &&
          (u += `
`);
        break;
      default:
        u += `
`;
    }
    let p = i + r.length + t.source.length;
    return { value: u, type: s, comment: r.comment, range: [i, p, p] };
  }
  function Zv({ offset: e, props: t }, n, i) {
    if (t[0].type !== "block-scalar-header") return (i(t[0], "IMPOSSIBLE", "Block scalar header not found"), null);
    let { source: r } = t[0],
      s = r[0],
      o = 0,
      a = "",
      l = -1;
    for (let m = 1; m < r.length; ++m) {
      let y = r[m];
      if (!a && (y === "-" || y === "+")) a = y;
      else {
        let p = Number(y);
        !o && p ? (o = p) : l === -1 && (l = e + m);
      }
    }
    l !== -1 && i(l, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${r}`);
    let c = !1,
      d = "",
      u = r.length;
    for (let m = 1; m < t.length; ++m) {
      let y = t[m];
      switch (y.type) {
        case "space":
          c = !0;
        case "newline":
          u += y.source.length;
          break;
        case "comment":
          (n && !c && i(y, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"),
            (u += y.source.length),
            (d = y.source.substring(1)));
          break;
        case "error":
          (i(y, "UNEXPECTED_TOKEN", y.message), (u += y.source.length));
          break;
        default: {
          let p = `Unexpected token in block scalar header: ${y.type}`;
          i(y, "UNEXPECTED_TOKEN", p);
          let g = y.source;
          g && typeof g == "string" && (u += g.length);
        }
      }
    }
    return { mode: s, indent: o, chomp: a, comment: d, length: u };
  }
  function ex(e) {
    let t = e.split(/\n( *)/),
      n = t[0],
      i = n.match(/^( *)/),
      s = [i?.[1] ? [i[1], n.slice(i[1].length)] : ["", n]];
    for (let o = 1; o < t.length; o += 2) s.push([t[o], t[o + 1]]);
    return s;
  }
  ng.resolveBlockScalar = Qv;
});
var Vl = O((rg) => {
  "use strict";
  var Yl = ge(),
    tx = $n();
  function nx(e, t, n) {
    let { offset: i, type: r, source: s, end: o } = e,
      a,
      l,
      c = (m, y, p) => n(i + m, y, p);
    switch (r) {
      case "scalar":
        ((a = Yl.Scalar.PLAIN), (l = ix(s, c)));
        break;
      case "single-quoted-scalar":
        ((a = Yl.Scalar.QUOTE_SINGLE), (l = rx(s, c)));
        break;
      case "double-quoted-scalar":
        ((a = Yl.Scalar.QUOTE_DOUBLE), (l = sx(s, c)));
        break;
      default:
        return (
          n(e, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${r}`),
          { value: "", type: null, comment: "", range: [i, i + s.length, i + s.length] }
        );
    }
    let d = i + s.length,
      u = tx.resolveEnd(o, d, t, n);
    return { value: l, type: a, comment: u.comment, range: [i, d, u.offset] };
  }
  function ix(e, t) {
    let n = "";
    switch (e[0]) {
      case "	":
        n = "a tab character";
        break;
      case ",":
        n = "flow indicator character ,";
        break;
      case "%":
        n = "directive indicator character %";
        break;
      case "|":
      case ">": {
        n = `block scalar indicator ${e[0]}`;
        break;
      }
      case "@":
      case "`": {
        n = `reserved character ${e[0]}`;
        break;
      }
    }
    return (n && t(0, "BAD_SCALAR_START", `Plain value cannot start with ${n}`), ig(e));
  }
  function rx(e, t) {
    return (
      (e[e.length - 1] !== "'" || e.length === 1) && t(e.length, "MISSING_CHAR", "Missing closing 'quote"),
      ig(e.slice(1, -1)).replace(/''/g, "'")
    );
  }
  function ig(e) {
    let t, n;
    try {
      ((t = new RegExp(
        `(.*?)(?<![ 	])[ 	]*\r?
`,
        "sy",
      )),
        (n = new RegExp(
          `[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`,
          "sy",
        )));
    } catch {
      ((t = /(.*?)[ \t]*\r?\n/sy), (n = /[ \t]*(.*?)[ \t]*\r?\n/sy));
    }
    let i = t.exec(e);
    if (!i) return e;
    let r = i[1],
      s = " ",
      o = t.lastIndex;
    for (n.lastIndex = o; (i = n.exec(e));)
      (i[1] === ""
        ? s ===
          `
`
          ? (r += s)
          : (s = `
`)
        : ((r += s + i[1]), (s = " ")),
        (o = n.lastIndex));
    let a = /[ \t]*(.*)/sy;
    return ((a.lastIndex = o), (i = a.exec(e)), r + s + (i?.[1] ?? ""));
  }
  function sx(e, t) {
    let n = "";
    for (let i = 1; i < e.length - 1; ++i) {
      let r = e[i];
      if (!(
        r === "\r" &&
        e[i + 1] ===
          `
`
      ))
        if (
          r ===
          `
`
        ) {
          let { fold: s, offset: o } = ox(e, i);
          ((n += s), (i = o));
        } else if (r === "\\") {
          let s = e[++i],
            o = ax[s];
          if (o) n += o;
          else if (
            s ===
            `
`
          )
            for (s = e[i + 1]; s === " " || s === "	";) s = e[++i + 1];
          else if (
            s === "\r" &&
            e[i + 1] ===
              `
`
          )
            for (s = e[++i + 1]; s === " " || s === "	";) s = e[++i + 1];
          else if (s === "x" || s === "u" || s === "U") {
            let a = s === "x" ? 2 : s === "u" ? 4 : 8;
            ((n += lx(e, i + 1, a, t)), (i += a));
          } else {
            let a = e.substr(i - 1, 2);
            (t(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), (n += a));
          }
        } else if (r === " " || r === "	") {
          let s = i,
            o = e[i + 1];
          for (; o === " " || o === "	";) o = e[++i + 1];
          o !==
            `
` &&
            !(
              o === "\r" &&
              e[i + 2] ===
                `
`
            ) &&
            (n += i > s ? e.slice(s, i + 1) : r);
        } else n += r;
    }
    return ((e[e.length - 1] !== '"' || e.length === 1) && t(e.length, "MISSING_CHAR", 'Missing closing "quote'), n);
  }
  function ox(e, t) {
    let n = "",
      i = e[t + 1];
    for (
      ;
      (i === " " ||
        i === "	" ||
        i ===
          `
` ||
        i === "\r") &&
      !(
        i === "\r" &&
        e[t + 2] !==
          `
`
      );
    )
      (i ===
        `
` &&
        (n += `
`),
        (t += 1),
        (i = e[t + 1]));
    return (n || (n = " "), { fold: n, offset: t });
  }
  var ax = {
    0: "\0",
    a: "\x07",
    b: "\b",
    e: "\x1B",
    f: "\f",
    n: `
`,
    r: "\r",
    t: "	",
    v: "\v",
    N: "\x85",
    _: "\xA0",
    L: "\u2028",
    P: "\u2029",
    " ": " ",
    '"': '"',
    "/": "/",
    "\\": "\\",
    "	": "	",
  };
  function lx(e, t, n, i) {
    let r = e.substr(t, n),
      o = r.length === n && /^[0-9a-fA-F]+$/.test(r) ? parseInt(r, 16) : NaN;
    try {
      return String.fromCodePoint(o);
    } catch {
      let a = e.substr(t - 2, n + 2);
      return (i(t - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), a);
    }
  }
  rg.resolveFlowScalar = nx;
});
var ag = O((og) => {
  "use strict";
  var dn = q(),
    sg = ge(),
    cx = Kl(),
    dx = Vl();
  function ux(e, t, n, i) {
    let {
        value: r,
        type: s,
        comment: o,
        range: a,
      } = t.type === "block-scalar" ? cx.resolveBlockScalar(e, t, i) : dx.resolveFlowScalar(t, e.options.strict, i),
      l = n ? e.directives.tagName(n.source, (u) => i(n, "TAG_RESOLVE_FAILED", u)) : null,
      c;
    e.options.stringKeys && e.atKey
      ? (c = e.schema[dn.SCALAR])
      : l
        ? (c = fx(e.schema, r, l, n, i))
        : t.type === "scalar"
          ? (c = mx(e, r, t, i))
          : (c = e.schema[dn.SCALAR]);
    let d;
    try {
      let u = c.resolve(r, (m) => i(n ?? t, "TAG_RESOLVE_FAILED", m), e.options);
      d = dn.isScalar(u) ? u : new sg.Scalar(u);
    } catch (u) {
      let m = u instanceof Error ? u.message : String(u);
      (i(n ?? t, "TAG_RESOLVE_FAILED", m), (d = new sg.Scalar(r)));
    }
    return (
      (d.range = a),
      (d.source = r),
      s && (d.type = s),
      l && (d.tag = l),
      c.format && (d.format = c.format),
      o && (d.comment = o),
      d
    );
  }
  function fx(e, t, n, i, r) {
    if (n === "!") return e[dn.SCALAR];
    let s = [];
    for (let a of e.tags)
      if (!a.collection && a.tag === n)
        if (a.default && a.test) s.push(a);
        else return a;
    for (let a of s) if (a.test?.test(t)) return a;
    let o = e.knownTags[n];
    return o && !o.collection
      ? (e.tags.push(Object.assign({}, o, { default: !1, test: void 0 })), o)
      : (r(i, "TAG_RESOLVE_FAILED", `Unresolved tag: ${n}`, n !== "tag:yaml.org,2002:str"), e[dn.SCALAR]);
  }
  function mx({ atKey: e, directives: t, schema: n }, i, r, s) {
    let o = n.tags.find((a) => (a.default === !0 || (e && a.default === "key")) && a.test?.test(i)) || n[dn.SCALAR];
    if (n.compat) {
      let a = n.compat.find((l) => l.default && l.test?.test(i)) ?? n[dn.SCALAR];
      if (o.tag !== a.tag) {
        let l = t.tagString(o.tag),
          c = t.tagString(a.tag),
          d = `Value may be parsed as either ${l} or ${c}`;
        s(r, "TAG_RESOLVE_FAILED", d, !0);
      }
    }
    return o;
  }
  og.composeScalar = ux;
});
var cg = O((lg) => {
  "use strict";
  function yx(e, t, n) {
    if (t) {
      n ?? (n = t.length);
      for (let i = n - 1; i >= 0; --i) {
        let r = t[i];
        switch (r.type) {
          case "space":
          case "comment":
          case "newline":
            e -= r.source.length;
            continue;
        }
        for (r = t[++i]; r?.type === "space";) ((e += r.source.length), (r = t[++i]));
        break;
      }
    }
    return e;
  }
  lg.emptyScalarPosition = yx;
});
var fg = O((ql) => {
  "use strict";
  var gx = Ri(),
    px = q(),
    hx = tg(),
    dg = ag(),
    Ix = $n(),
    bx = cg(),
    Sx = { composeNode: ug, composeEmptyNode: Wl };
  function ug(e, t, n, i) {
    let r = e.atKey,
      { spaceBefore: s, comment: o, anchor: a, tag: l } = n,
      c,
      d = !0;
    switch (t.type) {
      case "alias":
        ((c = _x(e, t, i)), (a || l) && i(t, "ALIAS_PROPS", "An alias node must not specify any properties"));
        break;
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "block-scalar":
        ((c = dg.composeScalar(e, t, l, i)), a && (c.anchor = a.source.substring(1)));
        break;
      case "block-map":
      case "block-seq":
      case "flow-collection":
        try {
          ((c = hx.composeCollection(Sx, e, t, n, i)), a && (c.anchor = a.source.substring(1)));
        } catch (u) {
          let m = u instanceof Error ? u.message : String(u);
          i(t, "RESOURCE_EXHAUSTION", m);
        }
        break;
      default: {
        let u = t.type === "error" ? t.message : `Unsupported token (type: ${t.type})`;
        (i(t, "UNEXPECTED_TOKEN", u), (d = !1));
      }
    }
    return (
      c ?? (c = Wl(e, t.offset, void 0, null, n, i)),
      a && c.anchor === "" && i(a, "BAD_ALIAS", "Anchor cannot be an empty string"),
      r &&
        e.options.stringKeys &&
        (!px.isScalar(c) || typeof c.value != "string" || (c.tag && c.tag !== "tag:yaml.org,2002:str")) &&
        i(l ?? t, "NON_STRING_KEY", "With stringKeys, all keys must be strings"),
      s && (c.spaceBefore = !0),
      o && (t.type === "scalar" && t.source === "" ? (c.comment = o) : (c.commentBefore = o)),
      e.options.keepSourceTokens && d && (c.srcToken = t),
      c
    );
  }
  function Wl(e, t, n, i, { spaceBefore: r, comment: s, anchor: o, tag: a, end: l }, c) {
    let d = { type: "scalar", offset: bx.emptyScalarPosition(t, n, i), indent: -1, source: "" },
      u = dg.composeScalar(e, d, a, c);
    return (
      o &&
        ((u.anchor = o.source.substring(1)), u.anchor === "" && c(o, "BAD_ALIAS", "Anchor cannot be an empty string")),
      r && (u.spaceBefore = !0),
      s && ((u.comment = s), (u.range[2] = l)),
      u
    );
  }
  function _x({ options: e }, { offset: t, source: n, end: i }, r) {
    let s = new gx.Alias(n.substring(1));
    (s.source === "" && r(t, "BAD_ALIAS", "Alias cannot be an empty string"),
      s.source.endsWith(":") && r(t + n.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0));
    let o = t + n.length,
      a = Ix.resolveEnd(i, o, e.strict, r);
    return ((s.range = [t, o, a.offset]), a.comment && (s.comment = a.comment), s);
  }
  ql.composeEmptyNode = Wl;
  ql.composeNode = ug;
});
var gg = O((yg) => {
  "use strict";
  var Ex = ji(),
    mg = fg(),
    Rx = $n(),
    wx = Ki();
  function Px(e, t, { offset: n, start: i, value: r, end: s }, o) {
    let a = Object.assign({ _directives: t }, e),
      l = new Ex.Document(void 0, a),
      c = { atKey: !1, atRoot: !0, directives: l.directives, options: l.options, schema: l.schema },
      d = wx.resolveProps(i, {
        indicator: "doc-start",
        next: r ?? s?.[0],
        offset: n,
        onError: o,
        parentIndent: 0,
        startOnNewline: !0,
      });
    (d.found &&
      ((l.directives.docStart = !0),
      r &&
        (r.type === "block-map" || r.type === "block-seq") &&
        !d.hasNewline &&
        o(d.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")),
      (l.contents = r ? mg.composeNode(c, r, d, o) : mg.composeEmptyNode(c, d.end, i, null, d, o)));
    let u = l.contents.range[2],
      m = Rx.resolveEnd(s, u, !1, o);
    return (m.comment && (l.comment = m.comment), (l.range = [n, u, m.offset]), l);
  }
  yg.composeDoc = Px;
});
var Hl = O((Ig) => {
  "use strict";
  var vx = ur("process"),
    xx = Fa(),
    kx = ji(),
    Yi = Gi(),
    pg = q(),
    Mx = gg(),
    Tx = $n();
  function Vi(e) {
    if (typeof e == "number") return [e, e + 1];
    if (Array.isArray(e)) return e.length === 2 ? e : [e[0], e[1]];
    let { offset: t, source: n } = e;
    return [t, t + (typeof n == "string" ? n.length : 1)];
  }
  function hg(e) {
    let t = "",
      n = !1,
      i = !1;
    for (let r = 0; r < e.length; ++r) {
      let s = e[r];
      switch (s[0]) {
        case "#":
          ((t +=
            (t === ""
              ? ""
              : i
                ? `

`
                : `
`) + (s.substring(1) || " ")),
            (n = !0),
            (i = !1));
          break;
        case "%":
          (e[r + 1]?.[0] !== "#" && (r += 1), (n = !1));
          break;
        default:
          (n || (i = !0), (n = !1));
      }
    }
    return { comment: t, afterEmptyLine: i };
  }
  var zl = class {
    constructor(t = {}) {
      ((this.doc = null),
        (this.atDirectives = !1),
        (this.prelude = []),
        (this.errors = []),
        (this.warnings = []),
        (this.onError = (n, i, r, s) => {
          let o = Vi(n);
          s ? this.warnings.push(new Yi.YAMLWarning(o, i, r)) : this.errors.push(new Yi.YAMLParseError(o, i, r));
        }),
        (this.directives = new xx.Directives({ version: t.version || "1.2" })),
        (this.options = t));
    }
    decorate(t, n) {
      let { comment: i, afterEmptyLine: r } = hg(this.prelude);
      if (i) {
        let s = t.contents;
        if (n)
          t.comment = t.comment
            ? `${t.comment}
${i}`
            : i;
        else if (r || t.directives.docStart || !s) t.commentBefore = i;
        else if (pg.isCollection(s) && !s.flow && s.items.length > 0) {
          let o = s.items[0];
          pg.isPair(o) && (o = o.key);
          let a = o.commentBefore;
          o.commentBefore = a
            ? `${i}
${a}`
            : i;
        } else {
          let o = s.commentBefore;
          s.commentBefore = o
            ? `${i}
${o}`
            : i;
        }
      }
      if (n) {
        for (let s = 0; s < this.errors.length; ++s) t.errors.push(this.errors[s]);
        for (let s = 0; s < this.warnings.length; ++s) t.warnings.push(this.warnings[s]);
      } else ((t.errors = this.errors), (t.warnings = this.warnings));
      ((this.prelude = []), (this.errors = []), (this.warnings = []));
    }
    streamInfo() {
      return {
        comment: hg(this.prelude).comment,
        directives: this.directives,
        errors: this.errors,
        warnings: this.warnings,
      };
    }
    *compose(t, n = !1, i = -1) {
      for (let r of t) yield* this.next(r);
      yield* this.end(n, i);
    }
    *next(t) {
      switch ((vx.env.LOG_STREAM && console.dir(t, { depth: null }), t.type)) {
        case "directive":
          (this.directives.add(t.source, (n, i, r) => {
            let s = Vi(t);
            ((s[0] += n), this.onError(s, "BAD_DIRECTIVE", i, r));
          }),
            this.prelude.push(t.source),
            (this.atDirectives = !0));
          break;
        case "document": {
          let n = Mx.composeDoc(this.options, this.directives, t, this.onError);
          (this.atDirectives &&
            !n.directives.docStart &&
            this.onError(t, "MISSING_CHAR", "Missing directives-end/doc-start indicator line"),
            this.decorate(n, !1),
            this.doc && (yield this.doc),
            (this.doc = n),
            (this.atDirectives = !1));
          break;
        }
        case "byte-order-mark":
        case "space":
          break;
        case "comment":
        case "newline":
          this.prelude.push(t.source);
          break;
        case "error": {
          let n = t.source ? `${t.message}: ${JSON.stringify(t.source)}` : t.message,
            i = new Yi.YAMLParseError(Vi(t), "UNEXPECTED_TOKEN", n);
          this.atDirectives || !this.doc ? this.errors.push(i) : this.doc.errors.push(i);
          break;
        }
        case "doc-end": {
          if (!this.doc) {
            let i = "Unexpected doc-end without preceding document";
            this.errors.push(new Yi.YAMLParseError(Vi(t), "UNEXPECTED_TOKEN", i));
            break;
          }
          this.doc.directives.docEnd = !0;
          let n = Tx.resolveEnd(t.end, t.offset + t.source.length, this.doc.options.strict, this.onError);
          if ((this.decorate(this.doc, !0), n.comment)) {
            let i = this.doc.comment;
            this.doc.comment = i
              ? `${i}
${n.comment}`
              : n.comment;
          }
          this.doc.range[2] = n.offset;
          break;
        }
        default:
          this.errors.push(new Yi.YAMLParseError(Vi(t), "UNEXPECTED_TOKEN", `Unsupported token ${t.type}`));
      }
    }
    *end(t = !1, n = -1) {
      if (this.doc) (this.decorate(this.doc, !0), yield this.doc, (this.doc = null));
      else if (t) {
        let i = Object.assign({ _directives: this.directives }, this.options),
          r = new kx.Document(void 0, i);
        (this.atDirectives && this.onError(n, "MISSING_CHAR", "Missing directives-end indicator line"),
          (r.range = [0, n, n]),
          this.decorate(r, !1),
          yield r);
      }
    }
  };
  Ig.Composer = zl;
});
var _g = O((Ls) => {
  "use strict";
  var Ux = Kl(),
    Ax = Vl(),
    Ox = Gi(),
    bg = ki();
  function Fx(e, t = !0, n) {
    if (e) {
      let i = (r, s, o) => {
        let a = typeof r == "number" ? r : Array.isArray(r) ? r[0] : r.offset;
        if (n) n(a, s, o);
        else throw new Ox.YAMLParseError([a, a + 1], s, o);
      };
      switch (e.type) {
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return Ax.resolveFlowScalar(e, t, i);
        case "block-scalar":
          return Ux.resolveBlockScalar({ options: { strict: t } }, e, i);
      }
    }
    return null;
  }
  function Nx(e, t) {
    let { implicitKey: n = !1, indent: i, inFlow: r = !1, offset: s = -1, type: o = "PLAIN" } = t,
      a = bg.stringifyString(
        { type: o, value: e },
        { implicitKey: n, indent: i > 0 ? " ".repeat(i) : "", inFlow: r, options: { blockQuote: !0, lineWidth: -1 } },
      ),
      l = t.end ?? [
        {
          type: "newline",
          offset: -1,
          indent: i,
          source: `
`,
        },
      ];
    switch (a[0]) {
      case "|":
      case ">": {
        let c = a.indexOf(`
`),
          d = a.substring(0, c),
          u =
            a.substring(c + 1) +
            `
`,
          m = [{ type: "block-scalar-header", offset: s, indent: i, source: d }];
        return (
          Sg(m, l) ||
            m.push({
              type: "newline",
              offset: -1,
              indent: i,
              source: `
`,
            }),
          { type: "block-scalar", offset: s, indent: i, props: m, source: u }
        );
      }
      case '"':
        return { type: "double-quoted-scalar", offset: s, indent: i, source: a, end: l };
      case "'":
        return { type: "single-quoted-scalar", offset: s, indent: i, source: a, end: l };
      default:
        return { type: "scalar", offset: s, indent: i, source: a, end: l };
    }
  }
  function Lx(e, t, n = {}) {
    let { afterKey: i = !1, implicitKey: r = !1, inFlow: s = !1, type: o } = n,
      a = "indent" in e ? e.indent : null;
    if ((i && typeof a == "number" && (a += 2), !o))
      switch (e.type) {
        case "single-quoted-scalar":
          o = "QUOTE_SINGLE";
          break;
        case "double-quoted-scalar":
          o = "QUOTE_DOUBLE";
          break;
        case "block-scalar": {
          let c = e.props[0];
          if (c.type !== "block-scalar-header") throw new Error("Invalid block scalar header");
          o = c.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
          break;
        }
        default:
          o = "PLAIN";
      }
    let l = bg.stringifyString(
      { type: o, value: t },
      {
        implicitKey: r || a === null,
        indent: a !== null && a > 0 ? " ".repeat(a) : "",
        inFlow: s,
        options: { blockQuote: !0, lineWidth: -1 },
      },
    );
    switch (l[0]) {
      case "|":
      case ">":
        Dx(e, l);
        break;
      case '"':
        Jl(e, l, "double-quoted-scalar");
        break;
      case "'":
        Jl(e, l, "single-quoted-scalar");
        break;
      default:
        Jl(e, l, "scalar");
    }
  }
  function Dx(e, t) {
    let n = t.indexOf(`
`),
      i = t.substring(0, n),
      r =
        t.substring(n + 1) +
        `
`;
    if (e.type === "block-scalar") {
      let s = e.props[0];
      if (s.type !== "block-scalar-header") throw new Error("Invalid block scalar header");
      ((s.source = i), (e.source = r));
    } else {
      let { offset: s } = e,
        o = "indent" in e ? e.indent : -1,
        a = [{ type: "block-scalar-header", offset: s, indent: o, source: i }];
      Sg(a, "end" in e ? e.end : void 0) ||
        a.push({
          type: "newline",
          offset: -1,
          indent: o,
          source: `
`,
        });
      for (let l of Object.keys(e)) l !== "type" && l !== "offset" && delete e[l];
      Object.assign(e, { type: "block-scalar", indent: o, props: a, source: r });
    }
  }
  function Sg(e, t) {
    if (t)
      for (let n of t)
        switch (n.type) {
          case "space":
          case "comment":
            e.push(n);
            break;
          case "newline":
            return (e.push(n), !0);
        }
    return !1;
  }
  function Jl(e, t, n) {
    switch (e.type) {
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        ((e.type = n), (e.source = t));
        break;
      case "block-scalar": {
        let i = e.props.slice(1),
          r = t.length;
        e.props[0].type === "block-scalar-header" && (r -= e.props[0].source.length);
        for (let s of i) s.offset += r;
        (delete e.props, Object.assign(e, { type: n, source: t, end: i }));
        break;
      }
      case "block-map":
      case "block-seq": {
        let r = {
          type: "newline",
          offset: e.offset + t.length,
          indent: e.indent,
          source: `
`,
        };
        (delete e.items, Object.assign(e, { type: n, source: t, end: [r] }));
        break;
      }
      default: {
        let i = "indent" in e ? e.indent : -1,
          r =
            "end" in e && Array.isArray(e.end)
              ? e.end.filter((s) => s.type === "space" || s.type === "comment" || s.type === "newline")
              : [];
        for (let s of Object.keys(e)) s !== "type" && s !== "offset" && delete e[s];
        Object.assign(e, { type: n, indent: i, source: t, end: r });
      }
    }
  }
  Ls.createScalarToken = Nx;
  Ls.resolveAsScalar = Fx;
  Ls.setScalarValue = Lx;
});
var Rg = O((Eg) => {
  "use strict";
  var Cx = (e) => ("type" in e ? Cs(e) : Ds(e));
  function Cs(e) {
    switch (e.type) {
      case "block-scalar": {
        let t = "";
        for (let n of e.props) t += Cs(n);
        return t + e.source;
      }
      case "block-map":
      case "block-seq": {
        let t = "";
        for (let n of e.items) t += Ds(n);
        return t;
      }
      case "flow-collection": {
        let t = e.start.source;
        for (let n of e.items) t += Ds(n);
        for (let n of e.end) t += n.source;
        return t;
      }
      case "document": {
        let t = Ds(e);
        if (e.end) for (let n of e.end) t += n.source;
        return t;
      }
      default: {
        let t = e.source;
        if ("end" in e && e.end) for (let n of e.end) t += n.source;
        return t;
      }
    }
  }
  function Ds({ start: e, key: t, sep: n, value: i }) {
    let r = "";
    for (let s of e) r += s.source;
    if ((t && (r += Cs(t)), n)) for (let s of n) r += s.source;
    return (i && (r += Cs(i)), r);
  }
  Eg.stringify = Cx;
});
var xg = O((vg) => {
  "use strict";
  var Xl = Symbol("break visit"),
    jx = Symbol("skip children"),
    wg = Symbol("remove item");
  function un(e, t) {
    ("type" in e && e.type === "document" && (e = { start: e.start, value: e.value }), Pg(Object.freeze([]), e, t));
  }
  un.BREAK = Xl;
  un.SKIP = jx;
  un.REMOVE = wg;
  un.itemAtPath = (e, t) => {
    let n = e;
    for (let [i, r] of t) {
      let s = n?.[i];
      if (s && "items" in s) n = s.items[r];
      else return;
    }
    return n;
  };
  un.parentCollection = (e, t) => {
    let n = un.itemAtPath(e, t.slice(0, -1)),
      i = t[t.length - 1][0],
      r = n?.[i];
    if (r && "items" in r) return r;
    throw new Error("Parent collection not found");
  };
  function Pg(e, t, n) {
    let i = n(t, e);
    if (typeof i == "symbol") return i;
    for (let r of ["key", "value"]) {
      let s = t[r];
      if (s && "items" in s) {
        for (let o = 0; o < s.items.length; ++o) {
          let a = Pg(Object.freeze(e.concat([[r, o]])), s.items[o], n);
          if (typeof a == "number") o = a - 1;
          else {
            if (a === Xl) return Xl;
            a === wg && (s.items.splice(o, 1), (o -= 1));
          }
        }
        typeof i == "function" && r === "key" && (i = i(t, e));
      }
    }
    return typeof i == "function" ? i(t, e) : i;
  }
  vg.visit = un;
});
var js = O((Be) => {
  "use strict";
  var Ql = _g(),
    Bx = Rg(),
    $x = xg(),
    Zl = "\uFEFF",
    ec = "",
    tc = "",
    nc = "",
    Gx = (e) => !!e && "items" in e,
    Kx = (e) =>
      !!e &&
      (e.type === "scalar" ||
        e.type === "single-quoted-scalar" ||
        e.type === "double-quoted-scalar" ||
        e.type === "block-scalar");
  function Yx(e) {
    switch (e) {
      case Zl:
        return "<BOM>";
      case ec:
        return "<DOC>";
      case tc:
        return "<FLOW_END>";
      case nc:
        return "<SCALAR>";
      default:
        return JSON.stringify(e);
    }
  }
  function Vx(e) {
    switch (e) {
      case Zl:
        return "byte-order-mark";
      case ec:
        return "doc-mode";
      case tc:
        return "flow-error-end";
      case nc:
        return "scalar";
      case "---":
        return "doc-start";
      case "...":
        return "doc-end";
      case "":
      case `
`:
      case `\r
`:
        return "newline";
      case "-":
        return "seq-item-ind";
      case "?":
        return "explicit-key-ind";
      case ":":
        return "map-value-ind";
      case "{":
        return "flow-map-start";
      case "}":
        return "flow-map-end";
      case "[":
        return "flow-seq-start";
      case "]":
        return "flow-seq-end";
      case ",":
        return "comma";
    }
    switch (e[0]) {
      case " ":
      case "	":
        return "space";
      case "#":
        return "comment";
      case "%":
        return "directive-line";
      case "*":
        return "alias";
      case "&":
        return "anchor";
      case "!":
        return "tag";
      case "'":
        return "single-quoted-scalar";
      case '"':
        return "double-quoted-scalar";
      case "|":
      case ">":
        return "block-scalar-header";
    }
    return null;
  }
  Be.createScalarToken = Ql.createScalarToken;
  Be.resolveAsScalar = Ql.resolveAsScalar;
  Be.setScalarValue = Ql.setScalarValue;
  Be.stringify = Bx.stringify;
  Be.visit = $x.visit;
  Be.BOM = Zl;
  Be.DOCUMENT = ec;
  Be.FLOW_END = tc;
  Be.SCALAR = nc;
  Be.isCollection = Gx;
  Be.isScalar = Kx;
  Be.prettyToken = Yx;
  Be.tokenType = Vx;
});
var sc = O((Mg) => {
  "use strict";
  var Wi = js();
  function tt(e) {
    switch (e) {
      case void 0:
      case " ":
      case `
`:
      case "\r":
      case "	":
        return !0;
      default:
        return !1;
    }
  }
  var kg = new Set("0123456789ABCDEFabcdef"),
    Wx = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"),
    Bs = new Set(",[]{}"),
    qx = new Set(` ,[]{}
\r	`),
    ic = (e) => !e || qx.has(e),
    rc = class {
      constructor() {
        ((this.atEnd = !1),
          (this.blockScalarIndent = -1),
          (this.blockScalarKeep = !1),
          (this.buffer = ""),
          (this.flowKey = !1),
          (this.flowLevel = 0),
          (this.indentNext = 0),
          (this.indentValue = 0),
          (this.lineEndPos = null),
          (this.next = null),
          (this.pos = 0));
      }
      *lex(t, n = !1) {
        if (t) {
          if (typeof t != "string") throw TypeError("source is not a string");
          ((this.buffer = this.buffer ? this.buffer + t : t), (this.lineEndPos = null));
        }
        this.atEnd = !n;
        let i = this.next ?? "stream";
        for (; i && (n || this.hasChars(1));) i = yield* this.parseNext(i);
      }
      atLineEnd() {
        let t = this.pos,
          n = this.buffer[t];
        for (; n === " " || n === "	";) n = this.buffer[++t];
        return !n ||
          n === "#" ||
          n ===
            `
`
          ? !0
          : n === "\r"
            ? this.buffer[t + 1] ===
              `
`
            : !1;
      }
      charAt(t) {
        return this.buffer[this.pos + t];
      }
      continueScalar(t) {
        let n = this.buffer[t];
        if (this.indentNext > 0) {
          let i = 0;
          for (; n === " ";) n = this.buffer[++i + t];
          if (n === "\r") {
            let r = this.buffer[i + t + 1];
            if (
              r ===
                `
` ||
              (!r && !this.atEnd)
            )
              return t + i + 1;
          }
          return n ===
            `
` ||
            i >= this.indentNext ||
            (!n && !this.atEnd)
            ? t + i
            : -1;
        }
        if (n === "-" || n === ".") {
          let i = this.buffer.substr(t, 3);
          if ((i === "---" || i === "...") && tt(this.buffer[t + 3])) return -1;
        }
        return t;
      }
      getLine() {
        let t = this.lineEndPos;
        return (
          (typeof t != "number" || (t !== -1 && t < this.pos)) &&
            ((t = this.buffer.indexOf(
              `
`,
              this.pos,
            )),
            (this.lineEndPos = t)),
          t === -1
            ? this.atEnd
              ? this.buffer.substring(this.pos)
              : null
            : (this.buffer[t - 1] === "\r" && (t -= 1), this.buffer.substring(this.pos, t))
        );
      }
      hasChars(t) {
        return this.pos + t <= this.buffer.length;
      }
      setNext(t) {
        return (
          (this.buffer = this.buffer.substring(this.pos)),
          (this.pos = 0),
          (this.lineEndPos = null),
          (this.next = t),
          null
        );
      }
      peek(t) {
        return this.buffer.substr(this.pos, t);
      }
      *parseNext(t) {
        switch (t) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let t = this.getLine();
        if (t === null) return this.setNext("stream");
        if ((t[0] === Wi.BOM && (yield* this.pushCount(1), (t = t.substring(1))), t[0] === "%")) {
          let n = t.length,
            i = t.indexOf("#");
          for (; i !== -1;) {
            let s = t[i - 1];
            if (s === " " || s === "	") {
              n = i - 1;
              break;
            } else i = t.indexOf("#", i + 1);
          }
          for (;;) {
            let s = t[n - 1];
            if (s === " " || s === "	") n -= 1;
            else break;
          }
          let r = (yield* this.pushCount(n)) + (yield* this.pushSpaces(!0));
          return (yield* this.pushCount(t.length - r), this.pushNewline(), "stream");
        }
        if (this.atLineEnd()) {
          let n = yield* this.pushSpaces(!0);
          return (yield* this.pushCount(t.length - n), yield* this.pushNewline(), "stream");
        }
        return (yield Wi.DOCUMENT, yield* this.parseLineStart());
      }
      *parseLineStart() {
        let t = this.charAt(0);
        if (!t && !this.atEnd) return this.setNext("line-start");
        if (t === "-" || t === ".") {
          if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
          let n = this.peek(3);
          if ((n === "---" || n === "...") && tt(this.charAt(3)))
            return (
              yield* this.pushCount(3),
              (this.indentValue = 0),
              (this.indentNext = 0),
              n === "---" ? "doc" : "stream"
            );
        }
        return (
          (this.indentValue = yield* this.pushSpaces(!1)),
          this.indentNext > this.indentValue && !tt(this.charAt(1)) && (this.indentNext = this.indentValue),
          yield* this.parseBlockStart()
        );
      }
      *parseBlockStart() {
        let [t, n] = this.peek(2);
        if (!n && !this.atEnd) return this.setNext("block-start");
        if ((t === "-" || t === "?" || t === ":") && tt(n)) {
          let i = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
          return ((this.indentNext = this.indentValue + 1), (this.indentValue += i), "block-start");
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(!0);
        let t = this.getLine();
        if (t === null) return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (t[n]) {
          case "#":
            yield* this.pushCount(t.length - n);
          case void 0:
            return (yield* this.pushNewline(), yield* this.parseLineStart());
          case "{":
          case "[":
            return (yield* this.pushCount(1), (this.flowKey = !1), (this.flowLevel = 1), "flow");
          case "}":
          case "]":
            return (yield* this.pushCount(1), "doc");
          case "*":
            return (yield* this.pushUntil(ic), "doc");
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            return (
              (n += yield* this.parseBlockScalarHeader()),
              (n += yield* this.pushSpaces(!0)),
              yield* this.pushCount(t.length - n),
              yield* this.pushNewline(),
              yield* this.parseBlockScalar()
            );
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let t,
          n,
          i = -1;
        do
          ((t = yield* this.pushNewline()),
            t > 0 ? ((n = yield* this.pushSpaces(!1)), (this.indentValue = i = n)) : (n = 0),
            (n += yield* this.pushSpaces(!0)));
        while (t + n > 0);
        let r = this.getLine();
        if (r === null) return this.setNext("flow");
        if (
          ((i !== -1 && i < this.indentNext && r[0] !== "#") ||
            (i === 0 && (r.startsWith("---") || r.startsWith("...")) && tt(r[3]))) &&
          !(i === this.indentNext - 1 && this.flowLevel === 1 && (r[0] === "]" || r[0] === "}"))
        )
          return ((this.flowLevel = 0), yield Wi.FLOW_END, yield* this.parseLineStart());
        let s = 0;
        for (; r[s] === ",";) ((s += yield* this.pushCount(1)), (s += yield* this.pushSpaces(!0)), (this.flowKey = !1));
        switch (((s += yield* this.pushIndicators()), r[s])) {
          case void 0:
            return "flow";
          case "#":
            return (yield* this.pushCount(r.length - s), "flow");
          case "{":
          case "[":
            return (yield* this.pushCount(1), (this.flowKey = !1), (this.flowLevel += 1), "flow");
          case "}":
          case "]":
            return (
              yield* this.pushCount(1),
              (this.flowKey = !0),
              (this.flowLevel -= 1),
              this.flowLevel ? "flow" : "doc"
            );
          case "*":
            return (yield* this.pushUntil(ic), "flow");
          case '"':
          case "'":
            return ((this.flowKey = !0), yield* this.parseQuotedScalar());
          case ":": {
            let o = this.charAt(1);
            if (this.flowKey || tt(o) || o === ",")
              return ((this.flowKey = !1), yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow");
          }
          default:
            return ((this.flowKey = !1), yield* this.parsePlainScalar());
        }
      }
      *parseQuotedScalar() {
        let t = this.charAt(0),
          n = this.buffer.indexOf(t, this.pos + 1);
        if (t === "'") for (; n !== -1 && this.buffer[n + 1] === "'";) n = this.buffer.indexOf("'", n + 2);
        else
          for (; n !== -1;) {
            let s = 0;
            for (; this.buffer[n - 1 - s] === "\\";) s += 1;
            if (s % 2 === 0) break;
            n = this.buffer.indexOf('"', n + 1);
          }
        let i = this.buffer.substring(0, n),
          r = i.indexOf(
            `
`,
            this.pos,
          );
        if (r !== -1) {
          for (; r !== -1;) {
            let s = this.continueScalar(r + 1);
            if (s === -1) break;
            r = i.indexOf(
              `
`,
              s,
            );
          }
          r !== -1 && (n = r - (i[r - 1] === "\r" ? 2 : 1));
        }
        if (n === -1) {
          if (!this.atEnd) return this.setNext("quoted-scalar");
          n = this.buffer.length;
        }
        return (yield* this.pushToIndex(n + 1, !1), this.flowLevel ? "flow" : "doc");
      }
      *parseBlockScalarHeader() {
        ((this.blockScalarIndent = -1), (this.blockScalarKeep = !1));
        let t = this.pos;
        for (;;) {
          let n = this.buffer[++t];
          if (n === "+") this.blockScalarKeep = !0;
          else if (n > "0" && n <= "9") this.blockScalarIndent = Number(n) - 1;
          else if (n !== "-") break;
        }
        return yield* this.pushUntil((n) => tt(n) || n === "#");
      }
      *parseBlockScalar() {
        let t = this.pos - 1,
          n = 0,
          i;
        e: for (let s = this.pos; (i = this.buffer[s]); ++s)
          switch (i) {
            case " ":
              n += 1;
              break;
            case `
`:
              ((t = s), (n = 0));
              break;
            case "\r": {
              let o = this.buffer[s + 1];
              if (!o && !this.atEnd) return this.setNext("block-scalar");
              if (
                o ===
                `
`
              )
                break;
            }
            default:
              break e;
          }
        if (!i && !this.atEnd) return this.setNext("block-scalar");
        if (n >= this.indentNext) {
          this.blockScalarIndent === -1
            ? (this.indentNext = n)
            : (this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext));
          do {
            let s = this.continueScalar(t + 1);
            if (s === -1) break;
            t = this.buffer.indexOf(
              `
`,
              s,
            );
          } while (t !== -1);
          if (t === -1) {
            if (!this.atEnd) return this.setNext("block-scalar");
            t = this.buffer.length;
          }
        }
        let r = t + 1;
        for (i = this.buffer[r]; i === " ";) i = this.buffer[++r];
        if (i === "	") {
          for (
            ;
            i === "	" ||
            i === " " ||
            i === "\r" ||
            i ===
              `
`;
          )
            i = this.buffer[++r];
          t = r - 1;
        } else if (!this.blockScalarKeep)
          do {
            let s = t - 1,
              o = this.buffer[s];
            o === "\r" && (o = this.buffer[--s]);
            let a = s;
            for (; o === " ";) o = this.buffer[--s];
            if (
              o ===
                `
` &&
              s >= this.pos &&
              s + 1 + n > a
            )
              t = s;
            else break;
          } while (!0);
        return (yield Wi.SCALAR, yield* this.pushToIndex(t + 1, !0), yield* this.parseLineStart());
      }
      *parsePlainScalar() {
        let t = this.flowLevel > 0,
          n = this.pos - 1,
          i = this.pos - 1,
          r;
        for (; (r = this.buffer[++i]);)
          if (r === ":") {
            let s = this.buffer[i + 1];
            if (tt(s) || (t && Bs.has(s))) break;
            n = i;
          } else if (tt(r)) {
            let s = this.buffer[i + 1];
            if (
              (r === "\r" &&
                (s ===
                `
`
                  ? ((i += 1),
                    (r = `
`),
                    (s = this.buffer[i + 1]))
                  : (n = i)),
              s === "#" || (t && Bs.has(s)))
            )
              break;
            if (
              r ===
              `
`
            ) {
              let o = this.continueScalar(i + 1);
              if (o === -1) break;
              i = Math.max(i, o - 2);
            }
          } else {
            if (t && Bs.has(r)) break;
            n = i;
          }
        return !r && !this.atEnd
          ? this.setNext("plain-scalar")
          : (yield Wi.SCALAR, yield* this.pushToIndex(n + 1, !0), t ? "flow" : "doc");
      }
      *pushCount(t) {
        return t > 0 ? (yield this.buffer.substr(this.pos, t), (this.pos += t), t) : 0;
      }
      *pushToIndex(t, n) {
        let i = this.buffer.slice(this.pos, t);
        return i ? (yield i, (this.pos += i.length), i.length) : (n && (yield ""), 0);
      }
      *pushIndicators() {
        let t = 0;
        e: for (;;) {
          switch (this.charAt(0)) {
            case "!":
              ((t += yield* this.pushTag()), (t += yield* this.pushSpaces(!0)));
              continue e;
            case "&":
              ((t += yield* this.pushUntil(ic)), (t += yield* this.pushSpaces(!0)));
              continue e;
            case "-":
            case "?":
            case ":": {
              let n = this.flowLevel > 0,
                i = this.charAt(1);
              if (tt(i) || (n && Bs.has(i))) {
                (n ? this.flowKey && (this.flowKey = !1) : (this.indentNext = this.indentValue + 1),
                  (t += yield* this.pushCount(1)),
                  (t += yield* this.pushSpaces(!0)));
                continue e;
              }
            }
          }
          break e;
        }
        return t;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let t = this.pos + 2,
            n = this.buffer[t];
          for (; !tt(n) && n !== ">";) n = this.buffer[++t];
          return yield* this.pushToIndex(n === ">" ? t + 1 : t, !1);
        } else {
          let t = this.pos + 1,
            n = this.buffer[t];
          for (; n;)
            if (Wx.has(n)) n = this.buffer[++t];
            else if (n === "%" && kg.has(this.buffer[t + 1]) && kg.has(this.buffer[t + 2])) n = this.buffer[(t += 3)];
            else break;
          return yield* this.pushToIndex(t, !1);
        }
      }
      *pushNewline() {
        let t = this.buffer[this.pos];
        return t ===
          `
`
          ? yield* this.pushCount(1)
          : t === "\r" &&
              this.charAt(1) ===
                `
`
            ? yield* this.pushCount(2)
            : 0;
      }
      *pushSpaces(t) {
        let n = this.pos - 1,
          i;
        do i = this.buffer[++n];
        while (i === " " || (t && i === "	"));
        let r = n - this.pos;
        return (r > 0 && (yield this.buffer.substr(this.pos, r), (this.pos = n)), r);
      }
      *pushUntil(t) {
        let n = this.pos,
          i = this.buffer[n];
        for (; !t(i);) i = this.buffer[++n];
        return yield* this.pushToIndex(n, !1);
      }
    };
  Mg.Lexer = rc;
});
var ac = O((Tg) => {
  "use strict";
  var oc = class {
    constructor() {
      ((this.lineStarts = []),
        (this.addNewLine = (t) => this.lineStarts.push(t)),
        (this.linePos = (t) => {
          let n = 0,
            i = this.lineStarts.length;
          for (; n < i;) {
            let s = (n + i) >> 1;
            this.lineStarts[s] < t ? (n = s + 1) : (i = s);
          }
          if (this.lineStarts[n] === t) return { line: n + 1, col: 1 };
          if (n === 0) return { line: 0, col: t };
          let r = this.lineStarts[n - 1];
          return { line: n, col: t - r + 1 };
        }));
    }
  };
  Tg.LineCounter = oc;
});
var cc = O((Ng) => {
  "use strict";
  var zx = ur("process"),
    Ug = js(),
    Hx = sc();
  function Ct(e, t) {
    for (let n = 0; n < e.length; ++n) if (e[n].type === t) return !0;
    return !1;
  }
  function Ag(e) {
    for (let t = 0; t < e.length; ++t)
      switch (e[t].type) {
        case "space":
        case "comment":
        case "newline":
          break;
        default:
          return t;
      }
    return -1;
  }
  function Fg(e) {
    switch (e?.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "flow-collection":
        return !0;
      default:
        return !1;
    }
  }
  function $s(e) {
    switch (e.type) {
      case "document":
        return e.start;
      case "block-map": {
        let t = e.items[e.items.length - 1];
        return t.sep ?? t.start;
      }
      case "block-seq":
        return e.items[e.items.length - 1].start;
      default:
        return [];
    }
  }
  function Gn(e) {
    if (e.length === 0) return [];
    let t = e.length;
    e: for (; --t >= 0;)
      switch (e[t].type) {
        case "doc-start":
        case "explicit-key-ind":
        case "map-value-ind":
        case "seq-item-ind":
        case "newline":
          break e;
      }
    for (; e[++t]?.type === "space";);
    return e.splice(t, e.length);
  }
  function Gs(e, t) {
    if (t.length < 1e5) Array.prototype.push.apply(e, t);
    else for (let n = 0; n < t.length; ++n) e.push(t[n]);
  }
  function Og(e) {
    if (e.start.type === "flow-seq-start")
      for (let t of e.items)
        t.sep &&
          !t.value &&
          !Ct(t.start, "explicit-key-ind") &&
          !Ct(t.sep, "map-value-ind") &&
          (t.key && (t.value = t.key),
          delete t.key,
          Fg(t.value) ? (t.value.end ? Gs(t.value.end, t.sep) : (t.value.end = t.sep)) : Gs(t.start, t.sep),
          delete t.sep);
  }
  var lc = class {
    constructor(t) {
      ((this.atNewLine = !0),
        (this.atScalar = !1),
        (this.indent = 0),
        (this.offset = 0),
        (this.onKeyLine = !1),
        (this.stack = []),
        (this.source = ""),
        (this.type = ""),
        (this.lexer = new Hx.Lexer()),
        (this.onNewLine = t));
    }
    *parse(t, n = !1) {
      this.onNewLine && this.offset === 0 && this.onNewLine(0);
      for (let i of this.lexer.lex(t, n)) yield* this.next(i);
      n || (yield* this.end());
    }
    *next(t) {
      if (((this.source = t), zx.env.LOG_TOKENS && console.log("|", Ug.prettyToken(t)), this.atScalar)) {
        ((this.atScalar = !1), yield* this.step(), (this.offset += t.length));
        return;
      }
      let n = Ug.tokenType(t);
      if (n)
        if (n === "scalar") ((this.atNewLine = !1), (this.atScalar = !0), (this.type = "scalar"));
        else {
          switch (((this.type = n), yield* this.step(), n)) {
            case "newline":
              ((this.atNewLine = !0), (this.indent = 0), this.onNewLine && this.onNewLine(this.offset + t.length));
              break;
            case "space":
              this.atNewLine && t[0] === " " && (this.indent += t.length);
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              this.atNewLine && (this.indent += t.length);
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = !1;
          }
          this.offset += t.length;
        }
      else {
        let i = `Not a YAML token: ${t}`;
        (yield* this.pop({ type: "error", offset: this.offset, message: i, source: t }), (this.offset += t.length));
      }
    }
    *end() {
      for (; this.stack.length > 0;) yield* this.pop();
    }
    get sourceToken() {
      return { type: this.type, offset: this.offset, indent: this.indent, source: this.source };
    }
    *step() {
      let t = this.peek(1);
      if (this.type === "doc-end" && t?.type !== "doc-end") {
        for (; this.stack.length > 0;) yield* this.pop();
        this.stack.push({ type: "doc-end", offset: this.offset, source: this.source });
        return;
      }
      if (!t) return yield* this.stream();
      switch (t.type) {
        case "document":
          return yield* this.document(t);
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return yield* this.scalar(t);
        case "block-scalar":
          return yield* this.blockScalar(t);
        case "block-map":
          return yield* this.blockMap(t);
        case "block-seq":
          return yield* this.blockSequence(t);
        case "flow-collection":
          return yield* this.flowCollection(t);
        case "doc-end":
          return yield* this.documentEnd(t);
      }
      yield* this.pop();
    }
    peek(t) {
      return this.stack[this.stack.length - t];
    }
    *pop(t) {
      let n = t ?? this.stack.pop();
      if (!n) yield { type: "error", offset: this.offset, source: "", message: "Tried to pop an empty stack" };
      else if (this.stack.length === 0) yield n;
      else {
        let i = this.peek(1);
        switch (
          (n.type === "block-scalar"
            ? (n.indent = "indent" in i ? i.indent : 0)
            : n.type === "flow-collection" && i.type === "document" && (n.indent = 0),
          n.type === "flow-collection" && Og(n),
          i.type)
        ) {
          case "document":
            i.value = n;
            break;
          case "block-scalar":
            i.props.push(n);
            break;
          case "block-map": {
            let r = i.items[i.items.length - 1];
            if (r.value) {
              (i.items.push({ start: [], key: n, sep: [] }), (this.onKeyLine = !0));
              return;
            } else if (r.sep) r.value = n;
            else {
              (Object.assign(r, { key: n, sep: [] }), (this.onKeyLine = !r.explicitKey));
              return;
            }
            break;
          }
          case "block-seq": {
            let r = i.items[i.items.length - 1];
            r.value ? i.items.push({ start: [], value: n }) : (r.value = n);
            break;
          }
          case "flow-collection": {
            let r = i.items[i.items.length - 1];
            !r || r.value
              ? i.items.push({ start: [], key: n, sep: [] })
              : r.sep
                ? (r.value = n)
                : Object.assign(r, { key: n, sep: [] });
            return;
          }
          default:
            (yield* this.pop(), yield* this.pop(n));
        }
        if (
          (i.type === "document" || i.type === "block-map" || i.type === "block-seq") &&
          (n.type === "block-map" || n.type === "block-seq")
        ) {
          let r = n.items[n.items.length - 1];
          r &&
            !r.sep &&
            !r.value &&
            r.start.length > 0 &&
            Ag(r.start) === -1 &&
            (n.indent === 0 || r.start.every((s) => s.type !== "comment" || s.indent < n.indent)) &&
            (i.type === "document" ? (i.end = r.start) : i.items.push({ start: r.start }), n.items.splice(-1, 1));
        }
      }
    }
    *stream() {
      switch (this.type) {
        case "directive-line":
          yield { type: "directive", offset: this.offset, source: this.source };
          return;
        case "byte-order-mark":
        case "space":
        case "comment":
        case "newline":
          yield this.sourceToken;
          return;
        case "doc-mode":
        case "doc-start": {
          let t = { type: "document", offset: this.offset, start: [] };
          (this.type === "doc-start" && t.start.push(this.sourceToken), this.stack.push(t));
          return;
        }
      }
      yield {
        type: "error",
        offset: this.offset,
        message: `Unexpected ${this.type} token in YAML stream`,
        source: this.source,
      };
    }
    *document(t) {
      if (t.value) return yield* this.lineEnd(t);
      switch (this.type) {
        case "doc-start": {
          Ag(t.start) !== -1 ? (yield* this.pop(), yield* this.step()) : t.start.push(this.sourceToken);
          return;
        }
        case "anchor":
        case "tag":
        case "space":
        case "comment":
        case "newline":
          t.start.push(this.sourceToken);
          return;
      }
      let n = this.startBlockValue(t);
      n
        ? this.stack.push(n)
        : yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source,
          };
    }
    *scalar(t) {
      if (this.type === "map-value-ind") {
        let n = $s(this.peek(2)),
          i = Gn(n),
          r;
        t.end ? ((r = t.end), r.push(this.sourceToken), delete t.end) : (r = [this.sourceToken]);
        let s = { type: "block-map", offset: t.offset, indent: t.indent, items: [{ start: i, key: t, sep: r }] };
        ((this.onKeyLine = !0), (this.stack[this.stack.length - 1] = s));
      } else yield* this.lineEnd(t);
    }
    *blockScalar(t) {
      switch (this.type) {
        case "space":
        case "comment":
        case "newline":
          t.props.push(this.sourceToken);
          return;
        case "scalar":
          if (((t.source = this.source), (this.atNewLine = !0), (this.indent = 0), this.onNewLine)) {
            let n =
              this.source.indexOf(`
`) + 1;
            for (; n !== 0;)
              (this.onNewLine(this.offset + n),
                (n =
                  this.source.indexOf(
                    `
`,
                    n,
                  ) + 1));
          }
          yield* this.pop();
          break;
        default:
          (yield* this.pop(), yield* this.step());
      }
    }
    *blockMap(t) {
      let n = t.items[t.items.length - 1];
      switch (this.type) {
        case "newline":
          if (((this.onKeyLine = !1), n.value)) {
            let i = "end" in n.value ? n.value.end : void 0;
            (Array.isArray(i) ? i[i.length - 1] : void 0)?.type === "comment"
              ? i?.push(this.sourceToken)
              : t.items.push({ start: [this.sourceToken] });
          } else n.sep ? n.sep.push(this.sourceToken) : n.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (n.value) t.items.push({ start: [this.sourceToken] });
          else if (n.sep) n.sep.push(this.sourceToken);
          else {
            if (this.atIndentedComment(n.start, t.indent)) {
              let r = t.items[t.items.length - 2]?.value?.end;
              if (Array.isArray(r)) {
                (Gs(r, n.start), r.push(this.sourceToken), t.items.pop());
                return;
              }
            }
            n.start.push(this.sourceToken);
          }
          return;
      }
      if (this.indent >= t.indent) {
        let i = !this.onKeyLine && this.indent === t.indent,
          r = i && (n.sep || n.explicitKey) && this.type !== "seq-item-ind",
          s = [];
        if (r && n.sep && !n.value) {
          let o = [];
          for (let a = 0; a < n.sep.length; ++a) {
            let l = n.sep[a];
            switch (l.type) {
              case "newline":
                o.push(a);
                break;
              case "space":
                break;
              case "comment":
                l.indent > t.indent && (o.length = 0);
                break;
              default:
                o.length = 0;
            }
          }
          o.length >= 2 && (s = n.sep.splice(o[1]));
        }
        switch (this.type) {
          case "anchor":
          case "tag":
            r || n.value
              ? (s.push(this.sourceToken), t.items.push({ start: s }), (this.onKeyLine = !0))
              : n.sep
                ? n.sep.push(this.sourceToken)
                : n.start.push(this.sourceToken);
            return;
          case "explicit-key-ind":
            (!n.sep && !n.explicitKey
              ? (n.start.push(this.sourceToken), (n.explicitKey = !0))
              : r || n.value
                ? (s.push(this.sourceToken), t.items.push({ start: s, explicitKey: !0 }))
                : this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [this.sourceToken], explicitKey: !0 }],
                  }),
              (this.onKeyLine = !0));
            return;
          case "map-value-ind":
            if (n.explicitKey)
              if (n.sep)
                if (n.value) t.items.push({ start: [], key: null, sep: [this.sourceToken] });
                else if (Ct(n.sep, "map-value-ind"))
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: s, key: null, sep: [this.sourceToken] }],
                  });
                else if (Fg(n.key) && !Ct(n.sep, "newline")) {
                  let o = Gn(n.start),
                    a = n.key,
                    l = n.sep;
                  (l.push(this.sourceToken),
                    delete n.key,
                    delete n.sep,
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: o, key: a, sep: l }],
                    }));
                } else s.length > 0 ? (n.sep = n.sep.concat(s, this.sourceToken)) : n.sep.push(this.sourceToken);
              else if (Ct(n.start, "newline")) Object.assign(n, { key: null, sep: [this.sourceToken] });
              else {
                let o = Gn(n.start);
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: o, key: null, sep: [this.sourceToken] }],
                });
              }
            else
              n.sep
                ? n.value || r
                  ? t.items.push({ start: s, key: null, sep: [this.sourceToken] })
                  : Ct(n.sep, "map-value-ind")
                    ? this.stack.push({
                        type: "block-map",
                        offset: this.offset,
                        indent: this.indent,
                        items: [{ start: [], key: null, sep: [this.sourceToken] }],
                      })
                    : n.sep.push(this.sourceToken)
                : Object.assign(n, { key: null, sep: [this.sourceToken] });
            this.onKeyLine = !0;
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            let o = this.flowScalar(this.type);
            r || n.value
              ? (t.items.push({ start: s, key: o, sep: [] }), (this.onKeyLine = !0))
              : n.sep
                ? this.stack.push(o)
                : (Object.assign(n, { key: o, sep: [] }), (this.onKeyLine = !0));
            return;
          }
          default: {
            let o = this.startBlockValue(t);
            if (o) {
              if (o.type === "block-seq") {
                if (!n.explicitKey && n.sep && !Ct(n.sep, "newline")) {
                  yield* this.pop({
                    type: "error",
                    offset: this.offset,
                    message: "Unexpected block-seq-ind on same line with key",
                    source: this.source,
                  });
                  return;
                }
              } else i && t.items.push({ start: s });
              this.stack.push(o);
              return;
            }
          }
        }
      }
      (yield* this.pop(), yield* this.step());
    }
    *blockSequence(t) {
      let n = t.items[t.items.length - 1];
      switch (this.type) {
        case "newline":
          if (n.value) {
            let i = "end" in n.value ? n.value.end : void 0;
            (Array.isArray(i) ? i[i.length - 1] : void 0)?.type === "comment"
              ? i?.push(this.sourceToken)
              : t.items.push({ start: [this.sourceToken] });
          } else n.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (n.value) t.items.push({ start: [this.sourceToken] });
          else {
            if (this.atIndentedComment(n.start, t.indent)) {
              let r = t.items[t.items.length - 2]?.value?.end;
              if (Array.isArray(r)) {
                (Gs(r, n.start), r.push(this.sourceToken), t.items.pop());
                return;
              }
            }
            n.start.push(this.sourceToken);
          }
          return;
        case "anchor":
        case "tag":
          if (n.value || this.indent <= t.indent) break;
          n.start.push(this.sourceToken);
          return;
        case "seq-item-ind":
          if (this.indent !== t.indent) break;
          n.value || Ct(n.start, "seq-item-ind")
            ? t.items.push({ start: [this.sourceToken] })
            : n.start.push(this.sourceToken);
          return;
      }
      if (this.indent > t.indent) {
        let i = this.startBlockValue(t);
        if (i) {
          this.stack.push(i);
          return;
        }
      }
      (yield* this.pop(), yield* this.step());
    }
    *flowCollection(t) {
      let n = t.items[t.items.length - 1];
      if (this.type === "flow-error-end") {
        let i;
        do (yield* this.pop(), (i = this.peek(1)));
        while (i?.type === "flow-collection");
      } else if (t.end.length === 0) {
        switch (this.type) {
          case "comma":
          case "explicit-key-ind":
            !n || n.sep ? t.items.push({ start: [this.sourceToken] }) : n.start.push(this.sourceToken);
            return;
          case "map-value-ind":
            !n || n.value
              ? t.items.push({ start: [], key: null, sep: [this.sourceToken] })
              : n.sep
                ? n.sep.push(this.sourceToken)
                : Object.assign(n, { key: null, sep: [this.sourceToken] });
            return;
          case "space":
          case "comment":
          case "newline":
          case "anchor":
          case "tag":
            !n || n.value
              ? t.items.push({ start: [this.sourceToken] })
              : n.sep
                ? n.sep.push(this.sourceToken)
                : n.start.push(this.sourceToken);
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            let r = this.flowScalar(this.type);
            !n || n.value
              ? t.items.push({ start: [], key: r, sep: [] })
              : n.sep
                ? this.stack.push(r)
                : Object.assign(n, { key: r, sep: [] });
            return;
          }
          case "flow-map-end":
          case "flow-seq-end":
            t.end.push(this.sourceToken);
            return;
        }
        let i = this.startBlockValue(t);
        i ? this.stack.push(i) : (yield* this.pop(), yield* this.step());
      } else {
        let i = this.peek(2);
        if (
          i.type === "block-map" &&
          ((this.type === "map-value-ind" && i.indent === t.indent) ||
            (this.type === "newline" && !i.items[i.items.length - 1].sep))
        )
          (yield* this.pop(), yield* this.step());
        else if (this.type === "map-value-ind" && i.type !== "flow-collection") {
          let r = $s(i),
            s = Gn(r);
          Og(t);
          let o = t.end.splice(1, t.end.length);
          o.push(this.sourceToken);
          let a = { type: "block-map", offset: t.offset, indent: t.indent, items: [{ start: s, key: t, sep: o }] };
          ((this.onKeyLine = !0), (this.stack[this.stack.length - 1] = a));
        } else yield* this.lineEnd(t);
      }
    }
    flowScalar(t) {
      if (this.onNewLine) {
        let n =
          this.source.indexOf(`
`) + 1;
        for (; n !== 0;)
          (this.onNewLine(this.offset + n),
            (n =
              this.source.indexOf(
                `
`,
                n,
              ) + 1));
      }
      return { type: t, offset: this.offset, indent: this.indent, source: this.source };
    }
    startBlockValue(t) {
      switch (this.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return this.flowScalar(this.type);
        case "block-scalar-header":
          return {
            type: "block-scalar",
            offset: this.offset,
            indent: this.indent,
            props: [this.sourceToken],
            source: "",
          };
        case "flow-map-start":
        case "flow-seq-start":
          return {
            type: "flow-collection",
            offset: this.offset,
            indent: this.indent,
            start: this.sourceToken,
            items: [],
            end: [],
          };
        case "seq-item-ind":
          return {
            type: "block-seq",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: [this.sourceToken] }],
          };
        case "explicit-key-ind": {
          this.onKeyLine = !0;
          let n = $s(t),
            i = Gn(n);
          return (
            i.push(this.sourceToken),
            { type: "block-map", offset: this.offset, indent: this.indent, items: [{ start: i, explicitKey: !0 }] }
          );
        }
        case "map-value-ind": {
          this.onKeyLine = !0;
          let n = $s(t),
            i = Gn(n);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: i, key: null, sep: [this.sourceToken] }],
          };
        }
      }
      return null;
    }
    atIndentedComment(t, n) {
      return this.type !== "comment" || this.indent <= n
        ? !1
        : t.every((i) => i.type === "newline" || i.type === "space");
    }
    *documentEnd(t) {
      this.type !== "doc-mode" &&
        (t.end ? t.end.push(this.sourceToken) : (t.end = [this.sourceToken]),
        this.type === "newline" && (yield* this.pop()));
    }
    *lineEnd(t) {
      switch (this.type) {
        case "comma":
        case "doc-start":
        case "doc-end":
        case "flow-seq-end":
        case "flow-map-end":
        case "map-value-ind":
          (yield* this.pop(), yield* this.step());
          break;
        case "newline":
          this.onKeyLine = !1;
        default:
          (t.end ? t.end.push(this.sourceToken) : (t.end = [this.sourceToken]),
            this.type === "newline" && (yield* this.pop()));
      }
    }
  };
  Ng.Parser = lc;
});
var Bg = O((zi) => {
  "use strict";
  var Lg = Hl(),
    Jx = ji(),
    qi = Gi(),
    Xx = qa(),
    Qx = q(),
    Zx = ac(),
    Dg = cc();
  function Cg(e) {
    let t = e.prettyErrors !== !1;
    return { lineCounter: e.lineCounter || (t && new Zx.LineCounter()) || null, prettyErrors: t };
  }
  function e0(e, t = {}) {
    let { lineCounter: n, prettyErrors: i } = Cg(t),
      r = new Dg.Parser(n?.addNewLine),
      s = new Lg.Composer(t),
      o = Array.from(s.compose(r.parse(e)));
    if (i && n) for (let a of o) (a.errors.forEach(qi.prettifyError(e, n)), a.warnings.forEach(qi.prettifyError(e, n)));
    return o.length > 0 ? o : Object.assign([], { empty: !0 }, s.streamInfo());
  }
  function jg(e, t = {}) {
    let { lineCounter: n, prettyErrors: i } = Cg(t),
      r = new Dg.Parser(n?.addNewLine),
      s = new Lg.Composer(t),
      o = null;
    for (let a of s.compose(r.parse(e), !0, e.length))
      if (!o) o = a;
      else if (o.options.logLevel !== "silent") {
        o.errors.push(
          new qi.YAMLParseError(
            a.range.slice(0, 2),
            "MULTIPLE_DOCS",
            "Source contains multiple documents; please use YAML.parseAllDocuments()",
          ),
        );
        break;
      }
    return (i && n && (o.errors.forEach(qi.prettifyError(e, n)), o.warnings.forEach(qi.prettifyError(e, n))), o);
  }
  function t0(e, t, n) {
    let i;
    typeof t == "function" ? (i = t) : n === void 0 && t && typeof t == "object" && (n = t);
    let r = jg(e, n);
    if (!r) return null;
    if ((r.warnings.forEach((s) => Xx.warn(r.options.logLevel, s)), r.errors.length > 0)) {
      if (r.options.logLevel !== "silent") throw r.errors[0];
      r.errors = [];
    }
    return r.toJS(Object.assign({ reviver: i }, n));
  }
  function n0(e, t, n) {
    let i = null;
    if (
      (typeof t == "function" || Array.isArray(t) ? (i = t) : n === void 0 && t && (n = t),
      typeof n == "string" && (n = n.length),
      typeof n == "number")
    ) {
      let r = Math.round(n);
      n = r < 1 ? void 0 : r > 8 ? { indent: 8 } : { indent: r };
    }
    if (e === void 0) {
      let { keepUndefined: r } = n ?? t ?? {};
      if (!r) return;
    }
    return Qx.isDocument(e) && !i ? e.toString(n) : new Jx.Document(e, i, n).toString(n);
  }
  zi.parse = t0;
  zi.parseAllDocuments = e0;
  zi.parseDocument = jg;
  zi.stringify = n0;
});
var uc = O((X) => {
  "use strict";
  var i0 = Hl(),
    r0 = ji(),
    s0 = Ml(),
    dc = Gi(),
    o0 = Ri(),
    jt = q(),
    a0 = Ft(),
    l0 = ge(),
    c0 = Lt(),
    d0 = Dt(),
    u0 = js(),
    f0 = sc(),
    m0 = ac(),
    y0 = cc(),
    Ks = Bg(),
    $g = bi();
  X.Composer = i0.Composer;
  X.Document = r0.Document;
  X.Schema = s0.Schema;
  X.YAMLError = dc.YAMLError;
  X.YAMLParseError = dc.YAMLParseError;
  X.YAMLWarning = dc.YAMLWarning;
  X.Alias = o0.Alias;
  X.isAlias = jt.isAlias;
  X.isCollection = jt.isCollection;
  X.isDocument = jt.isDocument;
  X.isMap = jt.isMap;
  X.isNode = jt.isNode;
  X.isPair = jt.isPair;
  X.isScalar = jt.isScalar;
  X.isSeq = jt.isSeq;
  X.Pair = a0.Pair;
  X.Scalar = l0.Scalar;
  X.YAMLMap = c0.YAMLMap;
  X.YAMLSeq = d0.YAMLSeq;
  X.CST = u0;
  X.Lexer = f0.Lexer;
  X.LineCounter = m0.LineCounter;
  X.Parser = y0.Parser;
  X.parse = Ks.parse;
  X.parseAllDocuments = Ks.parseAllDocuments;
  X.parseDocument = Ks.parseDocument;
  X.stringify = Ks.stringify;
  X.visit = $g.visit;
  X.visitAsync = $g.visitAsync;
});
import { parentPort as aI } from "node:worker_threads";
import { existsSync as zU } from "node:fs";
import rI from "node:path";
import wo from "node:path";
function Wt(e) {
  let t = JSON.parse(e),
    n = Array.isArray(t.includePlatforms)
      ? t.includePlatforms.filter((i) => typeof i == "string").map((i) => i.toLowerCase())
      : [];
  return {
    name: typeof t.name == "string" ? t.name : "",
    references: Array.isArray(t.references) ? t.references.filter((i) => typeof i == "string") : [],
    rootNamespace: typeof t.rootNamespace == "string" && t.rootNamespace.length > 0 ? t.rootNamespace : null,
    isEditorOnly: n.includes("editor"),
  };
}
function Po(e, t) {
  let n = e.filter((c) => c.kind === "asmdef"),
    i = e.filter((c) => c.kind === "csharp"),
    r = e.find((c) => c.kind === "package-manifest"),
    s = new Map();
  n.forEach((c) => {
    s.set(wo.posix.dirname(c.projectRelPath), c);
  });
  let o = n.flatMap((c) => {
      try {
        let d = Wt(c.contentText ?? "{}");
        return [
          {
            name: d.name,
            source: "asmdef",
            rootNamespace: d.rootNamespace,
            isEditorOnly: d.isEditorOnly ? 1 : 0,
            references: d.references,
          },
        ];
      } catch (d) {
        return (
          t.push({
            severity: "error",
            category: "extract",
            stage: "extract",
            filePath: c.projectRelPath,
            message: `Failed to parse asmdef: ${Fd(d)}`,
          }),
          []
        );
      }
    }),
    a = new Set();
  i.forEach((c) => {
    vI(c.projectRelPath, s) || a.add(xI(c.projectRelPath));
  });
  let l = kI(r?.contentText ?? "{}", t, r?.projectRelPath);
  return [
    ...o,
    ...[...a]
      .sort()
      .map((c) => ({
        name: c,
        source: "implicit",
        rootNamespace: null,
        isEditorOnly: c.endsWith("-Editor") ? 1 : 0,
        references: l,
      })),
  ];
}
function vI(e, t) {
  let n = wo.posix.dirname(e);
  for (; n !== "." && n !== "";) {
    let i = t.get(n);
    if (i) return i;
    n = wo.posix.dirname(n);
  }
}
function xI(e) {
  return e.toLowerCase().includes("/editor/") ? "Assembly-CSharp-Editor" : "Assembly-CSharp";
}
function kI(e, t, n) {
  try {
    let i = JSON.parse(e);
    return Object.keys(i.dependencies ?? {}).sort();
  } catch (i) {
    return (
      t.push({
        severity: "error",
        category: "extract",
        stage: "extract",
        filePath: n,
        message: `Failed to parse package manifest: ${Fd(i)}`,
      }),
      []
    );
  }
}
function Fd(e) {
  return e instanceof Error ? e.message : String(e);
}
import wt from "node:path";
var MI = wt.join(".gamecowork-cli", "UnityInsight"),
  TI = "index.db",
  UI = "index.db.tmp",
  AI = "index.current",
  OI = ".index.lock",
  FI = ".index.write.lock.db",
  NI = ".serve.lock";
function fr(e) {
  let t = __gcuInsightIndexDirectory(e, wt.join(e, MI));
  return {
    projectPath: e,
    indexDirectoryPath: t,
    liveDbPath: wt.join(t, TI),
    tempDbPath: wt.join(t, UI),
    currentPointerPath: wt.join(t, AI),
    indexLockPath: wt.join(t, OI),
    indexWriteLockDbPath: wt.join(t, FI),
    serveLockPath: wt.join(t, NI),
  };
}
import { access as Ab, mkdir as r1, rename as s1, rm as o1 } from "node:fs/promises";
import { constants as Ob } from "node:fs";
import { DatabaseSync as eu } from "node:sqlite";
import Fb from "node:path";
var Nd = `CREATE INDEX IF NOT EXISTS idx_yaml_objects_local_identifier
ON yaml_objects (file_id, local_identifier);

CREATE INDEX IF NOT EXISTS idx_yaml_objects_game_object_file_id
ON yaml_objects (file_id, game_object_file_id);
`;
function Ld(e) {
  e.exec(Nd);
}
import Rb from "node:path";
function DI(e) {
  if (!e) return null;
  switch (e.trim().toLowerCase()) {
    case "component":
      return ".comp";
    case "method":
      return ".fn";
    default:
      return null;
  }
}
function Zn(e) {
  return e.length > 0 && /^[\\/]+$/.test(e);
}
function Dd(e) {
  return e.replaceAll("/", "%2F").replaceAll("\\", "%5C");
}
function CI(e) {
  return Zn(e) ? Dd(e) : e;
}
function ei(e) {
  return e === "gameobject" || e === "prefab_instance";
}
function yt(e, t) {
  return ei(t) ? Dd(e) : CI(e);
}
function Pt(e, t) {
  let n = DI(t);
  return !n || e.endsWith(n) ? e : `${e}${n}`;
}
function jI(e) {
  return e === "directory" || e === "container";
}
function vo(e) {
  return e.replace(/\\/g, "/").trim();
}
function Cd(e) {
  return e.length <= 1 ? e : e.replace(/\/+$/, "");
}
function K(e, t) {
  let n = vo(e);
  if (!n) return n;
  let i = Cd(n);
  return t && jI(t) ? `${i}/` : i;
}
function Re(e, ...t) {
  let n = vo(e);
  for (let i of t) {
    let r = vo(i).replace(/^\/+/, "");
    if (r) {
      if (!n) {
        n = r;
        continue;
      }
      n = `${Cd(n)}/${r}`;
    }
  }
  return n;
}
import bn from "node:path";
function mr(e) {
  return `file:${e}`;
}
function yr(e) {
  return `file_content:${e}`;
}
function qt(e) {
  return `entity:${e}`;
}
function Xe(e, t) {
  return `entity_file_local:${e}:${t}`;
}
function ti(e, t) {
  return `symbol:${e}:${t}`;
}
function hn(e) {
  return `path:${e}`;
}
function xo(e) {
  return `link:entity:${e}:source_prefab`;
}
function jd(e, t) {
  if (/^symbol:\d+:\d+$/.test(e) || !e.startsWith("symbol:")) return e;
  let n = Number.parseInt(e.slice(7), 10);
  return !Number.isFinite(n) || t === null ? e : ti(t, n);
}
var gr = new WeakSet(),
  BI = 1;
function pr(e) {
  (e.exec("BEGIN IMMEDIATE"), gr.add(e));
}
function In(e) {
  (e.exec("COMMIT"), gr.delete(e));
}
function ko(e) {
  try {
    e.exec("ROLLBACK");
  } finally {
    gr.delete(e);
  }
}
function ni(e) {
  return gr.has(e);
}
function Ae(e, t) {
  if (ni(e)) return t();
  pr(e);
  try {
    let n = t();
    return (In(e), n);
  } catch (n) {
    return $d(e, n);
  }
}
async function Mo(e, t) {
  if (ni(e)) return t();
  pr(e);
  try {
    let n = await t();
    return (In(e), n);
  } catch (n) {
    return $d(e, n);
  }
}
function Bd(e, t) {
  return ni(e) ? $I(e, t) : Ae(e, t);
}
function $I(e, t) {
  let n = GI(e);
  try {
    let i = t();
    return (e.exec(`RELEASE ${n}`), i);
  } catch (i) {
    return KI(e, n, i);
  }
}
function GI(e) {
  let t = `unity_insight_${BI++}`;
  return (e.exec(`SAVEPOINT ${t}`), t);
}
function $d(e, t) {
  try {
    ko(e);
  } catch (n) {
    throw new AggregateError([t, n], "Transaction failed and could not be rolled back.", { cause: t });
  }
  throw t;
}
function KI(e, t, n) {
  let i = [];
  try {
    e.exec(`ROLLBACK TO ${t}`);
  } catch (r) {
    i.push(r);
  }
  try {
    e.exec(`RELEASE ${t}`);
  } catch (r) {
    i.push(r);
  }
  throw i.length > 0
    ? new AggregateError([n, ...i], "Transaction savepoint failed and could not be rolled back.", { cause: n })
    : n;
}
var Sn = class extends Error {
  constructor(n) {
    super(`VFS path relocation collision: ${n}`);
    this.conflictingPath = n;
    this.name = "VfsPathRelocationCollisionError";
  }
  conflictingPath;
};
function YI(e) {
  if (e.contentChanged) return !1;
  let t = st(e.discovered.projectRelPath);
  return !(
    t.endsWith(".asmdef") ||
    t.endsWith(".asmref") ||
    t === "Packages/manifest.json" ||
    t.startsWith("ProjectSettings/")
  );
}
function Gd(e) {
  return { fileId: e.fileId, oldProjectRelPath: e.oldProjectRelPath, newProjectRelPath: e.discovered.projectRelPath };
}
function Kd(e, t) {
  let n = [],
    i = [];
  for (let r of e) t.allowFastPath && YI(r) ? n.push(r) : i.push(r);
  return { fastPathMoves: n, slowPathMoves: i };
}
function st(e) {
  return e.replace(/\\/g, "/");
}
function me(e, t, n) {
  if (e == null || e === "") return e ?? null;
  let i = st(e),
    r = st(t),
    s = st(n);
  return i === r
    ? s
    : i.startsWith(`${r}:/`)
      ? `${s}${i.slice(r.length)}`
      : i.startsWith(`${r}/`)
        ? `${s}${i.slice(r.length)}`
        : i;
}
function VI(e) {
  let t = [],
    n = bn.posix.dirname(st(e));
  for (; n !== "." && n !== "";) (t.push(n), (n = bn.posix.dirname(n)));
  return t.sort((i, r) => i.localeCompare(r));
}
function WI(e) {
  return K(bn.posix.dirname(st(e)), "directory");
}
function qI(e, t) {
  return e
    .prepare(
      `SELECT id,
                entry_type,
                vfs_path,
                parent_vfs_path,
                source_vfs_path,
                source_owner_vfs_path,
                target_vfs_path,
                instance_root_vfs_path,
                source_file_id
         FROM vfs_entries
         WHERE source_file_id = ?`,
    )
    .all(t)
    .map((n) => ({
      id: n.id,
      entryType: n.entry_type,
      vfsPath: n.vfs_path,
      parentVfsPath: n.parent_vfs_path,
      sourceVfsPath: n.source_vfs_path,
      sourceOwnerVfsPath: n.source_owner_vfs_path,
      targetVfsPath: n.target_vfs_path,
      instanceRootVfsPath: n.instance_root_vfs_path,
      sourceFileId: n.source_file_id,
    }));
}
function zI(e, t, n) {
  let i = st(t),
    r = `${i}:/%`;
  return e
    .prepare(
      `SELECT id,
              entry_type,
              vfs_path,
              parent_vfs_path,
              source_vfs_path,
              source_owner_vfs_path,
              target_vfs_path,
              instance_root_vfs_path,
              source_file_id
       FROM vfs_entries
       WHERE source_vfs_path = ?
          OR source_vfs_path LIKE ? ESCAPE '\\'
          OR source_owner_vfs_path = ?
          OR source_owner_vfs_path LIKE ? ESCAPE '\\'
          OR target_vfs_path = ?
          OR target_vfs_path LIKE ? ESCAPE '\\'`,
    )
    .all(i, r, i, r, i, r)
    .filter((o) => !n.has(o.id))
    .map((o) => ({
      id: o.id,
      entryType: o.entry_type,
      vfsPath: o.vfs_path,
      parentVfsPath: o.parent_vfs_path,
      sourceVfsPath: o.source_vfs_path,
      sourceOwnerVfsPath: o.source_owner_vfs_path,
      targetVfsPath: o.target_vfs_path,
      instanceRootVfsPath: o.instance_root_vfs_path,
      sourceFileId: o.source_file_id,
    }));
}
function HI(e, t, n) {
  let i = me(e.vfsPath, t, n),
    r = e.entryType === "file" ? WI(n) : me(e.parentVfsPath, t, n);
  return {
    id: e.id,
    vfsPath: i,
    parentVfsPath: r,
    sourceVfsPath: me(e.sourceVfsPath, t, n),
    sourceOwnerVfsPath: me(e.sourceOwnerVfsPath, t, n),
    targetVfsPath: me(e.targetVfsPath, t, n),
    instanceRootVfsPath: me(e.instanceRootVfsPath, t, n),
  };
}
function JI(e, t, n) {
  let i = me(e.sourceVfsPath, t, n),
    r = me(e.sourceOwnerVfsPath, t, n),
    s = me(e.targetVfsPath, t, n);
  return i === e.sourceVfsPath && r === e.sourceOwnerVfsPath && s === e.targetVfsPath
    ? null
    : {
        id: e.id,
        vfsPath: e.vfsPath,
        parentVfsPath: e.parentVfsPath,
        sourceVfsPath: i,
        sourceOwnerVfsPath: r,
        targetVfsPath: s,
        instanceRootVfsPath: e.instanceRootVfsPath,
      };
}
function XI(e, t) {
  let n = new Set(t.map((i) => i.id));
  for (let i of t)
    if (
      e
        .prepare(
          `SELECT id
         FROM vfs_entries
         WHERE vfs_path = ?
           AND id NOT IN (${[...n].map(() => "?").join(", ") || "NULL"})`,
        )
        .get(i.vfsPath, ...n)
    )
      throw new Sn(i.vfsPath);
}
function QI(e, t) {
  let n = e.prepare(`UPDATE vfs_entries
     SET vfs_path = ?,
         parent_vfs_path = ?,
         source_vfs_path = ?,
         source_owner_vfs_path = ?,
         target_vfs_path = ?,
         instance_root_vfs_path = ?
     WHERE id = ?`),
    i = [...t].sort((r, s) => s.vfsPath.length - r.vfsPath.length);
  for (let r of i)
    n.run(
      r.vfsPath,
      r.parentVfsPath,
      r.sourceVfsPath,
      r.sourceOwnerVfsPath,
      r.targetVfsPath,
      r.instanceRootVfsPath,
      r.id,
    );
}
function To(e, t, n) {
  let i = new Set(
      e
        .prepare(
          `SELECT vfs_path
           FROM vfs_entries
           WHERE entry_type = 'directory'`,
        )
        .all()
        .map((a) => a.vfs_path),
    ),
    r = 0,
    s = e.prepare("SELECT COALESCE(MAX(id), 0) AS max_id FROM vfs_entries").get().max_id + 1,
    o = e.prepare(
      zt(e)
        ? `INSERT INTO vfs_entries (
           id,
           project_id,
           entry_type,
           entry_kind,
           vfs_path,
           parent_vfs_path,
           display_name,
           size_bytes,
           vfs_logical_key
         ) VALUES (?, ?, 'directory', 'directory', ?, ?, ?, 0, ?)`
        : `INSERT INTO vfs_entries (
           id,
           project_id,
           entry_type,
           entry_kind,
           vfs_path,
           parent_vfs_path,
           display_name,
           size_bytes
         ) VALUES (?, ?, 'directory', 'directory', ?, ?, ?, 0)`,
    );
  for (let a of VI(n)) {
    let l = K(a, "directory");
    if (i.has(l)) continue;
    let c = bn.posix.dirname(a),
      d = c === "." || c === "" ? null : K(c, "directory");
    (zt(e) ? o.run(s, t, l, d, bn.posix.basename(a), hn(l)) : o.run(s, t, l, d, bn.posix.basename(a)),
      i.add(l),
      (s += 1),
      (r += 1));
  }
  return r;
}
function ZI(e, t) {
  let n = K(st(t.newProjectRelPath), "file");
  if (
    e
      .prepare(
        `SELECT source_file_id
       FROM vfs_entries
       WHERE vfs_path = ?
         AND entry_type = 'file'
         AND source_file_id != ?
       LIMIT 1`,
      )
      .get(n, t.fileId)
  )
    throw new Sn(n);
}
function eb(e, t, n) {
  if (zt(e)) return (ZI(e, n), { rewrittenEntryCount: Vd(e, n), createdDirectoryCount: To(e, t, n.newProjectRelPath) });
  let i = st(n.oldProjectRelPath),
    r = st(n.newProjectRelPath),
    s = qI(e, n.fileId),
    o = new Set(s.map((c) => c.id)),
    a = zI(e, i, o),
    l = s.map((c) => HI(c, i, r));
  for (let c of a) {
    let d = JI(c, i, r);
    d && l.push(d);
  }
  return l.length === 0
    ? { rewrittenEntryCount: 0, createdDirectoryCount: To(e, t, r) }
    : (XI(e, l), QI(e, l), { rewrittenEntryCount: l.length, createdDirectoryCount: To(e, t, r) });
}
function Yd(e, t) {
  if (t.length === 0) return { rewrittenEntryCount: 0, createdDirectoryCount: 0 };
  let n = e.prepare("SELECT id FROM projects LIMIT 1").get()?.id;
  if (n === void 0) throw new Error("Cannot relocate VFS paths without a project row.");
  return Bd(e, () => {
    let i = 0,
      r = 0;
    for (let s of t) {
      let o = eb(e, n, s);
      ((i += o.rewrittenEntryCount), (r += o.createdDirectoryCount));
    }
    return { rewrittenEntryCount: i, createdDirectoryCount: r };
  });
}
import Jd from "node:path";
import ub from "node:path";
var hr = new Set([
    ".csv",
    ".tsv",
    ".txt",
    ".md",
    ".xml",
    ".yaml",
    ".yml",
    ".ini",
    ".cfg",
    ".conf",
    ".properties",
    ".toml",
    ".json",
    ".geojson",
    ".asmdef",
    ".vfx",
    ".shadergraph",
    ".shadersubgraph",
    ".html",
    ".htm",
    ".css",
    ".js",
    ".lua",
    ".shader",
    ".hlsl",
    ".cginc",
    ".compute",
    ".glsl",
    ".uxml",
    ".uss",
  ]),
  Wd = new Set([".fbx", ".dae", ".obj", ".blend", ".png", ".jpg", ".jpeg", ".tga", ".psd", ".wav", ".mp3", ".ogg"]),
  qd = new Set([".bytes", ".dll", ".exe", ".so", ".dylib", ".a", ".bundle", ".zip", ".gz", ".7z", ".rar"]);
import db from "node:path";
import zd from "node:path";
var tb = [
    ".asset",
    ".mat",
    ".mixer",
    ".anim",
    ".vfx",
    ".scenetemplate",
    ".spriteatlas",
    ".spriteatlasv2",
    ".controller",
    ".overridecontroller",
    ".physicmaterial",
    ".physicsmaterial2d",
  ],
  nb = [
    ".shader",
    ".hlsl",
    ".cginc",
    ".shadergraph",
    ".shadersubgraph",
    ".uxml",
    ".uss",
    ".json",
    ".csv",
    ".tsv",
    ".txt",
    ".md",
    ".xml",
    ".yaml",
    ".yml",
    ".ini",
    ".cfg",
    ".conf",
    ".properties",
    ".toml",
    ".geojson",
    ".html",
    ".htm",
    ".css",
    ".js",
    ".lua",
  ],
  ib = [
    ".fbx",
    ".dae",
    ".obj",
    ".blend",
    ".png",
    ".jpg",
    ".jpeg",
    ".tga",
    ".psd",
    ".tif",
    ".tiff",
    ".exr",
    ".hdr",
    ".bmp",
    ".wav",
    ".mp3",
    ".ogg",
    ".aiff",
    ".aif",
  ],
  rb = new Map([
    [".mat", "material"],
    [".mixer", "audio_mixer"],
    [".anim", "animation_clip"],
    [".vfx", "visual_effect_graph"],
    [".scenetemplate", "scene_template"],
    [".spriteatlas", "sprite_atlas"],
    [".spriteatlasv2", "sprite_atlas"],
    [".controller", "animator_controller"],
    [".overridecontroller", "animator_controller"],
    [".physicmaterial", "physic_material"],
    [".physicsmaterial2d", "physic_material_2d"],
    [".asset", "scriptable_object"],
  ]),
  sb = new Map([
    [".shader", "shader_lab"],
    [".hlsl", "shader_include"],
    [".cginc", "shader_include"],
    [".shadergraph", "shader_graph"],
    [".shadersubgraph", "shader_graph"],
    [".uxml", "uxml"],
    [".uss", "uss"],
    [".json", "json_file"],
  ]),
  ob = new Map([
    [".fbx", "model"],
    [".dae", "model"],
    [".obj", "model"],
    [".blend", "model"],
    [".png", "texture"],
    [".jpg", "texture"],
    [".jpeg", "texture"],
    [".tga", "texture"],
    [".psd", "texture"],
    [".tif", "texture"],
    [".tiff", "texture"],
    [".exr", "texture"],
    [".hdr", "texture"],
    [".bmp", "texture"],
    [".wav", "audio_clip"],
    [".mp3", "audio_clip"],
    [".ogg", "audio_clip"],
    [".aiff", "audio_clip"],
    [".aif", "audio_clip"],
  ]);
function Uo(e, t, n) {
  return e.map((i) => ({ extension: i, assetKind: n.get(i) ?? "asset", ...t }));
}
var ab = [
    { extension: ".unity", fileKind: "scene", assetKind: "scene", contentMode: "text", parserKind: "unity-yaml" },
    { extension: ".scene", fileKind: "scene", assetKind: "scene", contentMode: "text", parserKind: "unity-yaml" },
    { extension: ".prefab", fileKind: "prefab", assetKind: "prefab", contentMode: "text", parserKind: "unity-yaml" },
    { extension: ".cs", fileKind: "csharp", assetKind: "script", contentMode: "text", parserKind: "csharp" },
    { extension: ".asmdef", fileKind: "asmdef", assetKind: "asmdef", contentMode: "text", parserKind: "json" },
    { extension: ".meta", fileKind: "meta", assetKind: "meta", contentMode: "text", parserKind: "meta" },
    ...Uo(tb, { fileKind: "yaml-asset", contentMode: "text", parserKind: "unity-yaml" }, rb),
    ...Uo(nb, { fileKind: "asset", contentMode: "text", parserKind: "none" }, sb),
    ...Uo(ib, { fileKind: "asset", contentMode: "binary", parserKind: "none" }, ob),
  ],
  lb = new Map(ab.map((e) => [e.extension, e]));
function Ht(e) {
  let t = zd.posix.extname(e).toLowerCase();
  return lb.get(t) ?? null;
}
function Qe(e) {
  return e === "Packages/manifest.json"
    ? "json"
    : e.startsWith("ProjectSettings/")
      ? cb(e)
        ? "unity-yaml"
        : "none"
      : (Ht(e)?.parserKind ?? "none");
}
function ii(e) {
  return e === "Packages/manifest.json" || e.startsWith("ProjectSettings/") ? "text" : (Ht(e)?.contentMode ?? "text");
}
function cb(e) {
  let t = zd.posix.extname(e).toLowerCase();
  return t === ".asset" || t === ".yaml" || t === ".yml";
}
function ri(e, t) {
  return ii(e) !== "binary";
}
function Ir(e, t) {
  if (!ri(e, t)) return !1;
  let n = db.posix.extname(e).toLowerCase();
  return n === ".cs" || n === ".meta" || Qe(e) === "unity-yaml" ? !0 : hr.has(n);
}
var fb = new Set([
  "script",
  "json_file",
  "text_asset",
  "shader_lab",
  "shader_graph",
  "visual_effect_graph",
  "visual_effect_graph_property",
  "visual_effect_graph_context",
  "visual_effect_graph_block",
  "uxml",
  "uss",
]);
function si(e) {
  return `${e.replace(/\/+$/, "")}:/.content`;
}
function Hd(e, t, n) {
  if (!ri(e, n)) return !1;
  let i = ub.posix.extname(e).toLowerCase();
  if (Wd.has(i) || qd.has(i)) return !1;
  if (hr.has(i) || i === ".cs") return !0;
  let r = t.trim().toLowerCase();
  return !!fb.has(r);
}
function mb(e) {
  return ["gameobject", "subasset", "texture", "sprite"].includes(e) ? "container" : "leaf";
}
function yb(e) {
  return ["namespace", "class", "interface", "struct", "enum"].includes(e) ? "container" : "leaf";
}
function gb(e, t) {
  let n = e.trim() || t.trim();
  if (!n) return [t];
  let r = n
    .replace(/\(.*\)$/, "")
    .trim()
    .split(".")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return r.length > 0 ? r : [t];
}
function pb(e) {
  return (e.name ?? e.typeName).trim() || e.typeName;
}
function hb(e) {
  return yt(pb(e), e.entityKind);
}
function Ib(e) {
  let t = e.hierarchyName?.trim();
  if (!t) return hb(e);
  if (!ei(e.entityKind) && e.parentEntityId && t.includes("/") && !Zn(t)) {
    let n = Jd.posix.basename(t) || t;
    return yt(n, e.entityKind);
  }
  return yt(t, e.entityKind);
}
function bb(e) {
  return K(Jd.posix.dirname(e.replace(/\\/g, "/")), "directory");
}
function Xd(e, t, n, i) {
  let r = `${e}|${t}|${n}`,
    s = i.get(r) ?? 0;
  for (;;) {
    s += 1;
    let o = s === 1 ? t : `${t}#${s}`,
      a = K(Re(e, o), n);
    if (s === 1 || !i.has(`${r}|${s}`)) return (i.set(r, s), a);
  }
}
function Sb(e) {
  let t = new Map();
  for (let n of e) {
    let i = n.projectRelPath.replace(/\\/g, "/"),
      r = K(i, "file");
    (t.set(mr(n.id), { vfsPath: r, parentVfsPath: bb(i) }),
      t.set(yr(n.id), { vfsPath: K(si(r), "leaf"), parentVfsPath: r }));
  }
  return t;
}
function _b(e, t) {
  let n = new Map(e.map((a) => [a.id, a])),
    i = new Map(),
    r = new Map(),
    s = new Map();
  function o(a) {
    if (i.has(a)) return i.get(a) ?? null;
    let l = n.get(a);
    if (!l || l.entityKind === "prefab_instance") return (i.set(a, null), null);
    let c = t.get(l.assetId);
    if (!c) return (i.set(a, null), null);
    let d = l.parentEntityId ? o(l.parentEntityId) : `${c.replace(/\\/g, "/")}:/`;
    if (!d) return (i.set(a, null), null);
    let u = Xd(d, Ib(l), mb(l.entityKind), r);
    return (i.set(a, u), u);
  }
  for (let a of e) {
    if (a.entityKind === "prefab_instance") continue;
    let l = o(a.id);
    if (!l) continue;
    let c = a.parentEntityId ? o(a.parentEntityId) : K(t.get(a.assetId)?.replace(/\\/g, "/") ?? "", "file");
    s.set(qt(a.id), { vfsPath: l, parentVfsPath: c });
  }
  return s;
}
function Eb(e, t) {
  let n = new Map(e.map((a) => [a.id, a])),
    i = new Map(),
    r = new Map(),
    s = new Map();
  function o(a) {
    if (i.has(a)) return i.get(a) ?? null;
    let l = n.get(a);
    if (!l) return (i.set(a, null), null);
    let c = t.get(l.fileId);
    if (!c) return (i.set(a, null), null);
    let d = gb(l.qualifiedName, l.simpleName),
      u = null;
    for (let m = 0; m < d.length; m += 1) {
      let y = d[m],
        p = m === d.length - 1,
        g = p ? yb(l.symbolKind) : "container";
      if (p) {
        let S = u === null ? `${c}:/` : u;
        u = Xd(S, y, g, r);
        continue;
      }
      let h = u === null ? Re(`${c}:/`, y) : Re(u, y);
      u = K(h, g);
    }
    return (i.set(a, u), u);
  }
  for (let a of e) {
    let l = o(a.id);
    if (!l) continue;
    let c = a.containingSymbolId ? o(a.containingSymbolId) : (t.get(a.fileId) ?? null);
    s.set(ti(a.fileId, a.id), { vfsPath: l, parentVfsPath: c });
  }
  return s;
}
function Qd(e, t) {
  if (t.length === 0) return new Map();
  let n = t.map(() => "?").join(", "),
    i = e
      .prepare(
        `SELECT id, project_rel_path
         FROM files
         WHERE id IN (${n})`,
      )
      .all(...t)
      .map((d) => ({ id: d.id, projectRelPath: d.project_rel_path })),
    r = e
      .prepare(
        `SELECT id, file_id, vfs_root_path
       FROM assets
       WHERE file_id IN (${n})`,
      )
      .all(...t),
    s = new Map(r.map((d) => [d.id, d.vfs_root_path])),
    o = r.map((d) => d.id),
    a = Sb(i),
    l = new Map(i.map((d) => [d.id, K(d.projectRelPath.replace(/\\/g, "/"), "file")]));
  if (o.length > 0) {
    let d = o.map(() => "?").join(", "),
      u = e
        .prepare(
          `SELECT id, asset_id, entity_kind, name, hierarchy_name, type_name, parent_entity_id
           FROM entities
           WHERE asset_id IN (${d})
           ORDER BY id`,
        )
        .all(...o)
        .map((m) => ({
          id: m.id,
          assetId: m.asset_id,
          entityKind: m.entity_kind,
          name: m.name,
          hierarchyName: m.hierarchy_name,
          typeName: m.type_name,
          parentEntityId: m.parent_entity_id,
        }));
    for (let [m, y] of _b(u, s)) a.set(m, y);
  }
  let c = e
    .prepare(
      `SELECT id, file_id, symbol_kind, simple_name, qualified_name, containing_symbol_id
         FROM symbols
         WHERE file_id IN (${n})
           AND is_external_stub = 0
         ORDER BY id`,
    )
    .all(...t)
    .map((d) => ({
      id: d.id,
      fileId: d.file_id,
      symbolKind: d.symbol_kind,
      simpleName: d.simple_name,
      qualifiedName: d.qualified_name,
      containingSymbolId: d.containing_symbol_id,
    }));
  for (let [d, u] of Eb(c, l)) a.set(d, u);
  return a;
}
function zt(e) {
  return e
    .prepare("PRAGMA table_info(vfs_entries)")
    .all()
    .some((n) => n.name === "vfs_logical_key");
}
function Ao(e) {
  if (!zt(e)) return 0;
  let t = e
      .prepare(
        `SELECT id, vfs_logical_key, source_file_id
       FROM vfs_entries
       WHERE vfs_logical_key LIKE 'symbol:%'
         AND vfs_logical_key NOT LIKE 'symbol:%:%'`,
      )
      .all(),
    n = e.prepare("UPDATE vfs_entries SET vfs_logical_key = ? WHERE id = ?"),
    i = 0;
  for (let r of t) {
    let s = jd(r.vfs_logical_key, r.source_file_id);
    s !== r.vfs_logical_key && (n.run(s, r.id), (i += 1));
  }
  return i;
}
function wb(e, t) {
  if (t.size === 0) return 0;
  let n = e.prepare(`UPDATE vfs_entries
     SET vfs_path = ?,
         parent_vfs_path = ?
     WHERE vfs_logical_key = ?`),
    i = 0;
  for (let [r, s] of t.entries()) {
    let o = n.run(s.vfsPath, s.parentVfsPath, r);
    i += o.changes;
  }
  return i;
}
function Pb(e, t) {
  if (!zt(e) || t.length === 0) return 0;
  Ao(e);
  let n = Qd(e, t);
  return wb(e, n);
}
function vb(e, t) {
  let n = t.oldProjectRelPath.replace(/\\/g, "/"),
    i = t.newProjectRelPath.replace(/\\/g, "/"),
    r = e
      .prepare(
        `SELECT id, vfs_path, parent_vfs_path, source_vfs_path, source_owner_vfs_path, target_vfs_path
       FROM vfs_entries
       WHERE host_file_id = ?
         AND vfs_logical_key LIKE 'path:%'`,
      )
      .all(t.fileId);
  if (r.length === 0) return 0;
  let s = e.prepare(`UPDATE vfs_entries
     SET vfs_path = ?,
         parent_vfs_path = ?,
         source_vfs_path = ?,
         source_owner_vfs_path = ?,
         target_vfs_path = ?,
         vfs_logical_key = ?
     WHERE id = ?`),
    o = 0;
  for (let a of r) {
    let l = me(a.vfs_path, n, i);
    (s.run(
      l,
      me(a.parent_vfs_path, n, i),
      me(a.source_vfs_path, n, i),
      me(a.source_owner_vfs_path, n, i),
      me(a.target_vfs_path, n, i),
      `path:${l}`,
      a.id,
    ),
      (o += 1));
  }
  return o;
}
function xb(e, t) {
  if (!zt(e)) return 0;
  if (t && t.length > 0) {
    let i = t.map(() => "?").join(", ");
    return e
      .prepare(
        `UPDATE vfs_entries AS host
         SET source_vfs_path = (
               SELECT source_entry.vfs_path
               FROM vfs_entries AS source_entry
               WHERE source_entry.vfs_logical_key = host.source_logical_key
               ORDER BY source_entry.id
               LIMIT 1
             ),
             source_owner_vfs_path = (
               SELECT source_entry.vfs_path
               FROM vfs_entries AS source_entry
               WHERE source_entry.vfs_logical_key = host.source_logical_key
               ORDER BY source_entry.id
               LIMIT 1
             )
         WHERE host.source_logical_key IN (${i})
           AND EXISTS (
             SELECT 1
             FROM vfs_entries AS source_entry
             WHERE source_entry.vfs_logical_key = host.source_logical_key
           )`,
      )
      .run(...t).changes;
  }
  return e
    .prepare(
      `UPDATE vfs_entries AS host
       SET source_vfs_path = (
             SELECT source_entry.vfs_path
             FROM vfs_entries AS source_entry
             WHERE source_entry.vfs_logical_key = host.source_logical_key
             ORDER BY source_entry.id
             LIMIT 1
           ),
           source_owner_vfs_path = (
             SELECT source_entry.vfs_path
             FROM vfs_entries AS source_entry
             WHERE source_entry.vfs_logical_key = host.source_logical_key
             ORDER BY source_entry.id
             LIMIT 1
           )
       WHERE host.source_logical_key IS NOT NULL
         AND EXISTS (
           SELECT 1
           FROM vfs_entries AS source_entry
           WHERE source_entry.vfs_logical_key = host.source_logical_key
         )`,
    )
    .run().changes;
}
function kb(e, t) {
  if (t.length === 0) return [];
  let n = t.map(() => "?").join(", ");
  return e
    .prepare(
      `SELECT DISTINCT entities.id AS entity_id
       FROM entities
       JOIN assets ON assets.id = entities.asset_id
       WHERE assets.file_id IN (${n})
         AND entities.entity_kind != 'prefab_instance'`,
    )
    .all(...t)
    .map((r) => qt(r.entity_id));
}
function Vd(e, t) {
  Mb(e, t);
  let n = Pb(e, [t.fileId]);
  return ((n += vb(e, t)), (n += xb(e, kb(e, [t.fileId]))), (n += Tb(e, t)), n);
}
function Mb(e, t) {
  let n = t.newProjectRelPath.replace(/\\/g, "/");
  (e
    .prepare(
      `UPDATE files
       SET project_rel_path = ?
       WHERE id = ?`,
    )
    .run(n, t.fileId),
    e
      .prepare(
        `UPDATE assets
       SET vfs_root_path = ?
       WHERE file_id = ?`,
      )
      .run(n, t.fileId));
}
function Tb(e, t) {
  let n = t.oldProjectRelPath.replace(/\\/g, "/"),
    i = t.newProjectRelPath.replace(/\\/g, "/"),
    r = e
      .prepare(
        `SELECT id,
              entry_type,
              vfs_path,
              parent_vfs_path,
              source_vfs_path,
              source_owner_vfs_path,
              target_vfs_path,
              instance_root_vfs_path
       FROM vfs_entries
       WHERE host_file_id = ?
         AND (
           vfs_logical_key IS NULL
           OR vfs_path = ?
           OR vfs_path LIKE ? ESCAPE '\\'
         )`,
      )
      .all(t.fileId, n, `${n}:/%`);
  if (r.length === 0) return 0;
  let s = e.prepare(`UPDATE vfs_entries
     SET vfs_path = ?,
         parent_vfs_path = ?,
         source_vfs_path = ?,
         source_owner_vfs_path = ?,
         target_vfs_path = ?,
         instance_root_vfs_path = ?
     WHERE id = ?`),
    o = 0;
  for (let a of r) {
    let l = me(a.vfs_path, n, i);
    l !== a.vfs_path &&
      (s.run(
        l,
        a.entry_type === "file" ? Ub(i) : me(a.parent_vfs_path, n, i),
        me(a.source_vfs_path, n, i),
        me(a.source_owner_vfs_path, n, i),
        me(a.target_vfs_path, n, i),
        me(a.instance_root_vfs_path, n, i),
        a.id,
      ),
      (o += 1));
  }
  return o;
}
function Ub(e) {
  return K(Rb.posix.dirname(e.replace(/\\/g, "/")), "directory");
}
function Oo(e) {
  let n = e.prepare("PRAGMA user_version").get()?.user_version ?? 0;
  return n > 0 ? n : (e.prepare("SELECT schema_version FROM projects WHERE id = 1").get()?.schema_version ?? 0);
}
function Zd(e) {
  let t = Oo(e);
  if (t !== 11)
    throw new Error(
      `Unsupported Unity Insight database schema version ${t}. Rebuild the index with 'unity-insight-cli index build'.`,
    );
  return (Ao(e), t);
}
var Fo = 1;
async function tu(e) {
  let t = Fb.join(e, "ProjectSettings", "ProjectVersion.txt");
  try {
    await Ab(t, Ob.F_OK);
  } catch (n) {
    throw new Error(`Invalid Unity project root: missing required path ${t}`, { cause: n });
  }
}
function nu(e) {
  let t = new eu(e);
  return (Nb(t), t.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='projects'").get() && Zd(t), t);
}
function br(e) {
  let t = new eu(e, { readOnly: !0 });
  try {
    Lb(t);
  } catch (n) {
    throw (t.close(), n);
  }
  return t;
}
function Nb(e) {
  (e.exec("PRAGMA foreign_keys = ON"),
    e.exec("PRAGMA journal_mode = WAL"),
    e.exec("PRAGMA synchronous = NORMAL"),
    e.exec("PRAGMA cache_size = -32768"),
    e.exec("PRAGMA temp_store = FILE"));
}
function Lb(e) {
  (e.exec("PRAGMA foreign_keys = ON"),
    e.exec("PRAGMA query_only = ON"),
    e.exec("PRAGMA cache_size = -32768"),
    e.exec("PRAGMA temp_store = FILE"));
}
var oi = class extends Error {
  constructor(t) {
    (super(t), (this.name = "UnityInsightIndexNotFoundError"));
  }
};
function No(e, t) {
  (e.prepare("UPDATE projects SET indexed_at = ? WHERE id = ?").run(t.indexedAt, Fo),
    e
      .prepare(
        `UPDATE rebuild_summary
       SET mode = ?,
           discovered_file_count = ?,
           diagnostic_count = ?,
           completed_stages_json = ?
       WHERE project_id = ?`,
      )
      .run(t.mode, t.discoveredFileCount, t.diagnosticCount, JSON.stringify(t.completedStages), Fo));
}
function Lo(e, t, n) {
  if (t.length === 0) return;
  let i = e.prepare(`INSERT INTO index_diagnostics (
      id,
      project_id,
      severity,
      category,
      code,
      stage,
      file_path,
      message,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  Ae(e, () => {
    t.forEach((r, s) => {
      i.run(s + 1, Fo, r.severity, r.category, r.code ?? null, r.stage ?? null, r.filePath ?? null, r.message, n);
    });
  });
}
import { existsSync as _1, readFileSync as Jb, readdirSync as E1, statSync as Xb } from "node:fs";
import lu from "node:path";
import { randomUUID as Db } from "node:crypto";
import { mkdir as Cb, readFile as jb, rm as ai, writeFile as Bb } from "node:fs/promises";
import $b from "node:path";
import { DatabaseSync as Gb } from "node:sqlite";
var Kb = 5,
  Yb = 26,
  gt = class extends Error {
    code;
    constructor(t, n) {
      (super(t, n), (this.name = "UnityInsightIndexWriteLockError"), (this.code = n?.code ?? "failed"));
    }
  };
function jo(e) {
  return e instanceof gt && e.code === "busy";
}
var Do = new Map();
function iu(e) {
  if (typeof e != "object" || e === null) return;
  let t = e.errcode;
  return typeof t == "number" ? t : void 0;
}
function ru(e) {
  if (iu(e) === Kb) return !0;
  if (typeof e != "object" || e === null) return !1;
  let t = e.message;
  return typeof t == "string" && /database is locked/i.test(t);
}
function su(e) {
  if (iu(e) === Yb) return !0;
  if (typeof e != "object" || e === null) return !1;
  let t = e.message;
  return typeof t == "string" && /not a database/i.test(t);
}
function Vb(e) {
  try {
    let t = JSON.parse(e.trim());
    return typeof t.token == "string" && t.token.length > 0 ? t.token : null;
  } catch {
    return null;
  }
}
async function Wb(e, t) {
  let n = `${JSON.stringify({ pid: t.pid, mode: t.mode, startedAt: t.startedAt, token: t.token })}
`;
  await Bb(e, n, "utf8");
}
async function qb(e, t) {
  try {
    let n = await jb(e, "utf8");
    if (Vb(n) !== t) return;
  } catch {
    return;
  }
  await ai(e, { force: !0 }).catch(() => {});
}
function _r(e) {
  try {
    e.exec("ROLLBACK");
  } catch {}
  try {
    e.close();
  } catch {}
}
async function zb(e) {
  await Promise.all([
    ai(e, { force: !0 }),
    ai(`${e}-journal`, { force: !0 }),
    ai(`${e}-wal`, { force: !0 }),
    ai(`${e}-shm`, { force: !0 }),
  ]);
}
function Co(e) {
  let t = new Gb(e);
  try {
    return (t.exec("PRAGMA busy_timeout = 0"), t.exec("BEGIN IMMEDIATE"), t);
  } catch (n) {
    throw (_r(t), n);
  }
}
function Hb(e) {
  for (let t = 0; ; t += 1) {
    let n = t === 0 ? e : `${e}.${t}`;
    try {
      return Co(n);
    } catch (i) {
      if (!su(i)) throw i;
    }
  }
}
function Sr(e, t) {
  return ru(t)
    ? new gt(`Unity Insight index write is already running (lock: ${e}).`, { cause: t, code: "busy" })
    : new gt(`Failed to acquire Unity Insight index write lock at ${e}.`, { cause: t, code: "failed" });
}
async function Bo(e, t) {
  let n = e.indexLockPath,
    i = e.indexWriteLockDbPath;
  await Cb($b.dirname(i), { recursive: !0 });
  let r = Db(),
    s = new Date().toISOString(),
    o = { indexLockPath: n, indexWriteLockDbPath: i, token: r, pid: process.pid, mode: t, startedAt: s },
    a = `${i}.acquire`,
    l;
  try {
    l = Hb(a);
  } catch (c) {
    throw Sr(a, c);
  }
  try {
    let c;
    try {
      c = Co(i);
    } catch (d) {
      if (ru(d)) throw Sr(i, d);
      if (su(d)) {
        await zb(i);
        try {
          c = Co(i);
        } catch (u) {
          throw Sr(i, u);
        }
      } else throw Sr(i, d);
    }
    try {
      await Wb(n, o);
    } catch (d) {
      throw (
        _r(c),
        new gt(`Failed to write Unity Insight index writer metadata at ${n}.`, { cause: d, code: "failed" })
      );
    }
    return (Do.set(r, c), o);
  } finally {
    _r(l);
  }
}
async function _n(e) {
  let t = Do.get(e.token);
  return t ? (Do.delete(e.token), _r(t), await qb(e.indexLockPath, e.token), !0) : !1;
}
var Qb = /^index\.[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.db$/;
var Zb = 3,
  En = class extends Error {
    constructor(t, n) {
      (super(t, n), (this.name = "UnityInsightIndexPointerError"));
    }
  },
  Go = class extends Error {
    constructor(t, n) {
      (super(t, n), (this.name = "UnityInsightIndexResolutionRaceError"));
    }
  };
function eS(e, t) {
  if (
    !t.endsWith(`
`) ||
    t.slice(0, -1).includes(`
`) ||
    t.slice(0, -1).includes("\r")
  )
    throw new En(
      `Corrupt Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath}: expected one generated database basename followed by a newline.`,
    );
  let n = t.slice(0, -1);
  if (!Qb.test(n) || lu.basename(n) !== n)
    throw new En(
      `Corrupt Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath}: invalid selected database ${JSON.stringify(n)}.`,
    );
  return n;
}
function cu(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = e.code;
  return t === "ENOENT" || t === "ENOTDIR";
}
function tS(e, t = Xb) {
  try {
    return (t(e), !0);
  } catch (n) {
    if (cu(n)) return !1;
    throw n;
  }
}
function $o(e, t) {
  let n;
  try {
    n = Jb(e.currentPointerPath, "utf8");
  } catch (r) {
    if (!cu(r))
      throw new En(`Failed to read Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath}.`, {
        cause: r,
      });
    return t(e.liveDbPath) ? { kind: "legacy", indexPath: e.liveDbPath } : { kind: "none" };
  }
  let i = eS(e, n);
  return { kind: "generated", pointerText: n, indexPath: lu.join(e.indexDirectoryPath, i) };
}
function ou(e) {
  return new oi(
    `Unity Insight index not found for ${e.projectPath}. Checked pointer ${e.currentPointerPath} and legacy database ${e.liveDbPath}.`,
  );
}
function au(e, t) {
  return e.kind !== t.kind
    ? !1
    : e.kind === "none"
      ? !0
      : e.kind === "legacy"
        ? t.kind === "legacy" && e.indexPath === t.indexPath
        : t.kind === "generated" && e.pointerText === t.pointerText && e.indexPath === t.indexPath;
}
function Ko(e, t = {}) {
  let n = (i) => tS(i, t.statFile);
  for (let i = 0; i < Zb; i += 1) {
    let r = $o(e, n);
    if (r.kind === "none") {
      let o = $o(e, n);
      if (!au(r, o)) continue;
      throw ou(e);
    }
    if (n(r.indexPath)) return r.indexPath;
    let s = $o(e, n);
    if (au(r, s))
      throw r.kind === "generated"
        ? new En(
            `Corrupt Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath}: selected database is missing at ${r.indexPath}.`,
          )
        : ou(e);
  }
  throw new Go(`Unity Insight index selection kept changing while resolving a database path for ${e.projectPath}.`);
}
function Yo(e, t = {}) {
  try {
    return Ko(e, t);
  } catch (n) {
    if (n instanceof oi) return;
    throw n;
  }
}
function we(e) {
  if (e <= 0) throw new Error("IN clause requires at least one value.");
  return Array.from({ length: e }, () => "?").join(", ");
}
function Ze(e, t) {
  if (e <= 0) throw new Error("VALUES clause requires at least one row.");
  if (t <= 0) throw new Error("VALUES clause requires at least one column.");
  let n = `(${we(t)})`;
  return Array.from({ length: e }, () => n).join(", ");
}
var Vo = 8192;
function Jt(e) {
  if (e <= 0) throw new Error("columnCount must be positive.");
  return Math.max(1, Math.floor(Vo / e));
}
var Er = 4096;
function du(e) {
  if (!e) return { lowerBound: "", upperBound: "\uFFFF" };
  for (let t = e.length - 1; t >= 0; t -= 1) {
    let n = e.charCodeAt(t);
    if (n < 65535) return { lowerBound: e, upperBound: `${e.slice(0, t)}${String.fromCharCode(n + 1)}` };
  }
  return { lowerBound: e, upperBound: `${e}\uFFFF` };
}
function Pe(e, t = Er) {
  if (t <= 0) throw new Error("chunkSize must be positive.");
  let n = [];
  for (let i = 0; i < e.length; i += t) n.push(e.slice(i, i + t));
  return n;
}
function xt(e, t, n, i) {
  if (i.length !== 0)
    for (let r of Pe(i)) {
      let s = we(r.length);
      e.prepare(`DELETE FROM ${t} WHERE ${n} IN (${s})`).run(...r);
    }
}
function ae(e, t, n, i = "") {
  if (n.length === 0) return [];
  let r = [];
  for (let s of Pe(n)) {
    let o = we(s.length),
      a = e.prepare(`${t}${o}${i}`).all(...s);
    for (let l of a) r.push(l);
  }
  return r;
}
function uu(e, t, n, i) {
  if (n.length === 0 || i <= 0) return [];
  if (i > Vo) throw new Error("bindRepeats exceeds the SQLite bind-parameter budget.");
  let r = Math.min(Er, Math.max(1, Math.floor(Vo / i))),
    s = [];
  for (let o of Pe(n, r)) {
    let a = we(o.length),
      l = Array.from({ length: i }, () => o).flat(),
      c = e.prepare(t(a)).all(...l);
    for (let d of c) s.push(d);
  }
  return s;
}
function ve(e) {
  return [...new Set(e)].sort((t, n) => t - n);
}
function Xt(e, t) {
  if (t.length === 0) return [];
  let n = we(t.length);
  return e
    .prepare(
      `SELECT id
         FROM files
         WHERE kind = 'csharp'
           AND id IN (${n})
         ORDER BY id`,
    )
    .all(...t)
    .map((i) => i.id);
}
function mu(e, t) {
  if (t.length === 0) return [];
  let n = we(t.length),
    i = e.prepare(`SELECT id FROM symbols WHERE file_id IN (${n})`).all(...t);
  if (i.length === 0) return [];
  let r = new Set(t),
    s = i.map((l) => l.id),
    o = we(s.length),
    a = e
      .prepare(
        `SELECT DISTINCT mentions.file_id AS file_id
       FROM semantic_bindings bindings
       JOIN cs_mentions mentions ON mentions.id = bindings.mention_id
       WHERE bindings.target_symbol_id IN (${o})
          OR bindings.source_symbol_id IN (${o})`,
      )
      .all(...s, ...s);
  return ve(a.map((l) => l.file_id).filter((l) => !r.has(l)));
}
function Rr(e, t) {
  if (t.length === 0)
    return e
      .prepare(
        `SELECT id, project_id, assembly_id, file_id, declaration_id, symbol_kind,
                simple_name, qualified_name, display_name, signature,
                containing_symbol_id, base_symbol_name, is_external_stub,
                visibility, skeleton_content, line_start, line_end
         FROM symbols
         ORDER BY id`,
      )
      .all()
      .map(fu);
  let n = we(t.length);
  return e
    .prepare(
      `SELECT id, project_id, assembly_id, file_id, declaration_id, symbol_kind,
              simple_name, qualified_name, display_name, signature,
              containing_symbol_id, base_symbol_name, is_external_stub,
              visibility, skeleton_content, line_start, line_end
       FROM symbols
       WHERE file_id IS NULL OR file_id NOT IN (${n})
       ORDER BY id`,
    )
    .all(...t)
    .map(fu);
}
function fu(e) {
  let t = e;
  return {
    id: t.id,
    projectId: t.project_id,
    assemblyId: t.assembly_id,
    fileId: t.file_id,
    declarationId: t.declaration_id,
    symbolKind: t.symbol_kind,
    simpleName: t.simple_name,
    qualifiedName: t.qualified_name,
    displayName: t.display_name,
    signature: t.signature,
    containingSymbolId: t.containing_symbol_id,
    baseSymbolName: t.base_symbol_name,
    isExternalStub: t.is_external_stub,
    visibility: t.visibility,
    skeletonContent: t.skeleton_content,
    lineStart: t.line_start,
    lineEnd: t.line_end,
  };
}
import Rn from "node:path";
import iS from "node:path";
function kt(e) {
  return e === "Packages/manifest.json"
    ? "package-manifest"
    : e === "Packages/packages-lock.json" || nS(e)
      ? (Ht(e)?.fileKind ?? null)
      : e.startsWith("ProjectSettings/")
        ? "project-settings"
        : e.startsWith("Assets/")
          ? (Ht(e)?.fileKind ?? null)
          : null;
}
function nS(e) {
  let t = e.split("/");
  return t.length >= 3 && t[0] === "Packages";
}
var rS = new Set([".unity", ".scene", ".prefab", ".mixer", ".controller", ".overrideController", ".anim"]);
function sS(e) {
  return e.replace(/\\/g, "/");
}
function oS(e) {
  let t = kt(e);
  if (t === "scene" || t === "prefab") return !0;
  let n = iS.posix.extname(e).toLowerCase();
  return rS.has(n);
}
function aS(e) {
  let t = sS(e);
  if (
    t.endsWith(".cs") ||
    t.endsWith(".cs.meta") ||
    t === "Packages/manifest.json" ||
    t.endsWith(".asmdef") ||
    t.endsWith(".asmref") ||
    oS(t)
  )
    return !1;
  let n = kt(t);
  if (n === "csharp" || n === "asmdef" || n === "scene" || n === "prefab" || n === "package-manifest") return !1;
  if (n === "asset" || n === "yaml-asset" || n === "project-settings" || n === "meta") return !0;
  if (t.endsWith(".meta")) {
    let i = kt(t.slice(0, -5));
    return i === "asset" || i === "yaml-asset" || i === "meta";
  }
  return !1;
}
function yu(e, t) {
  if (e.deleted.length > 0) return !1;
  if (t) {
    for (let i of e.modified) {
      let r = t.get(i.fileId) ?? null,
        s = i.discovered.guid ?? null;
      if (r !== s) return !1;
    }
    for (let i of e.moved ?? []) {
      let r = t.get(i.fileId) ?? null,
        s = i.discovered.guid ?? null;
      if (r !== s) return !1;
    }
  }
  let n = [
    ...e.modified.map((i) => i.discovered.projectRelPath),
    ...e.created.map((i) => i.projectRelPath),
    ...(e.moved?.map((i) => i.discovered.projectRelPath) ?? []),
    ...e.metadataStale.map((i) => i.projectRelPath),
  ];
  return n.length === 0 ? !1 : n.every(aS);
}
function lS(e) {
  return e.replace(/\\/g, "/");
}
function Wo(e) {
  let t = [
    ...e.modified.map((n) => n.discovered.projectRelPath),
    ...e.created.map((n) => n.projectRelPath),
    ...e.deleted.map((n) => n.projectRelPath),
    ...(e.moved?.map((n) => n.discovered.projectRelPath) ?? []),
  ];
  return t.length === 0
    ? !1
    : t.every((n) => {
        let i = lS(n);
        return i.endsWith(".cs") || i.endsWith(".cs.meta");
      });
}
function gu(e, t) {
  if (t.length === 0) return [];
  let n = t.map(() => "?").join(", "),
    i = e
      .prepare(
        `SELECT guid
       FROM files
       WHERE id IN (${n})
         AND guid IS NOT NULL
       ORDER BY id`,
      )
      .all(...t);
  return [...new Set(i.map((r) => r.guid))];
}
function cS(e, t, n) {
  let i = e
    .prepare(
      `SELECT symbols.id, symbols.qualified_name
       FROM symbols
       JOIN files ON files.id = symbols.file_id
       WHERE files.guid = ?
         AND symbols.symbol_kind IN ('class', 'struct')
         AND symbols.is_external_stub = 0
       ORDER BY symbols.line_start, symbols.id`,
    )
    .all(t);
  if (i.length === 0) return null;
  if (i.length === 1) return i[0]?.id ?? null;
  let r = i.find((o) => o.qualified_name === n);
  return r ? r.id : (i.find((o) => o.qualified_name.endsWith(`.${n}`))?.id ?? i[0]?.id ?? null);
}
function pu(e, t) {
  if (t.length === 0) return { entitiesUpdated: 0, vfsEntriesUpdated: 0, vfsEdgesUpdated: 0 };
  let n = 0,
    i = 0,
    r = 0,
    s = e.prepare("UPDATE entities SET script_symbol_id = ? WHERE id = ?"),
    o = e.prepare("UPDATE vfs_entries SET source_symbol_id = ? WHERE id = ?"),
    a = e.prepare(`DELETE FROM vfs_edges
     WHERE from_entry_id = ?
       AND edge_kind = 'binds_to'
       AND edge_subkind = 'component_script'`),
    l = e.prepare(`INSERT INTO vfs_edges (
       id, from_entry_id, to_entry_id, edge_kind, edge_subkind
     ) VALUES (?, ?, ?, 'binds_to', 'component_script')`);
  for (let c of t) {
    let d = e
      .prepare(
        `SELECT entities.id AS entity_id, entities.type_name AS type_name
         FROM entities
         JOIN yaml_objects ON yaml_objects.id = entities.yaml_object_id
         WHERE entities.entity_kind = 'component'
           AND yaml_objects.script_guid = ?
         ORDER BY entities.id`,
      )
      .all(c);
    for (let u of d) {
      let m = cS(e, c, u.type_name);
      if (m === null) continue;
      let y = s.run(m, u.entity_id);
      n += y.changes;
      let p = e
          .prepare(
            `SELECT id
           FROM vfs_entries
           WHERE source_entity_id = ?
           ORDER BY id`,
          )
          .all(u.entity_id),
        g = e
          .prepare(
            `SELECT id
           FROM vfs_entries
           WHERE source_symbol_id = ?
           ORDER BY id
           LIMIT 1`,
          )
          .get(m);
      if (g)
        for (let h of p) {
          let S = o.run(m, h.id);
          ((i += S.changes), a.run(h.id));
          let _ = ye(e, "vfs_edges");
          (l.run(_, h.id, g.id), (r += 1));
        }
    }
  }
  return { entitiesUpdated: n, vfsEntriesUpdated: i, vfsEdgesUpdated: r };
}
var dS = new Set([".unity", ".scene", ".prefab", ".mixer", ".controller", ".overrideController", ".anim"]);
function uS(e) {
  return !e || e.length === 0 ? null : new Set(e.map((t) => t.replace(/\\/g, "/").trim()).filter(Boolean));
}
function li(e, t) {
  if (!t) return !0;
  let n = e.replace(/\\/g, "/");
  for (let i of t) if (n === i || n.startsWith(`${i}/`) || n.startsWith(i)) return !0;
  return !1;
}
function di(e) {
  let t = kt(e);
  if (t === "scene" || t === "prefab") return !0;
  let n = Rn.posix.extname(e).toLowerCase();
  return dS.has(n);
}
function ci(e) {
  return e.endsWith(".asmdef") || e.endsWith(".asmref");
}
function fS(e) {
  return e === "Packages/manifest.json";
}
function mS(e) {
  return e.replace(/\\/g, "/");
}
function hu(e) {
  return mS(e) === "Packages/manifest.json";
}
function Qt(e) {
  return e.endsWith(".meta") ? e.slice(0, -5) : `${e}.meta`;
}
function ui(e) {
  let t = e.replace(/\\/g, "/");
  return di(t) ? [t, `${t}:/`] : t.endsWith(".cs") ? [t, `${t}:/`] : [t];
}
function wr(e, t) {
  let n = Rn.posix.dirname(e);
  return t
    .filter(
      (i) => i.kind === "csharp" && (Rn.posix.dirname(i.projectRelPath) === n || i.projectRelPath.startsWith(`${n}/`)),
    )
    .map((i) => i.projectRelPath);
}
function yS(e) {
  if (fS(e)) return "global";
  if (ci(e)) return "assembly";
  if (di(e)) return "structural";
  let t = Qt(e);
  return e.endsWith(".meta") || (t && t !== e) ? "file_pair" : "file";
}
function Iu(e, t, n, i) {
  let r = n.map((o) => i.get(o)).filter((o) => o !== void 0),
    s = n.flatMap((o) => ui(o));
  return { kind: e, key: t, fileIds: r, projectRelPaths: n, vfsPathPrefixes: s };
}
function gS(e) {
  let t = new Map();
  for (let n of e) {
    let i = t.get(n.key);
    if (!i) {
      t.set(n.key, {
        ...n,
        fileIds: [...n.fileIds],
        projectRelPaths: [...n.projectRelPaths],
        vfsPathPrefixes: [...n.vfsPathPrefixes],
      });
      continue;
    }
    let r = new Set([...i.fileIds, ...n.fileIds]),
      s = new Set([...i.projectRelPaths, ...n.projectRelPaths]),
      o = new Set([...i.vfsPathPrefixes, ...n.vfsPathPrefixes]);
    t.set(n.key, { kind: i.kind, key: i.key, fileIds: [...r], projectRelPaths: [...s], vfsPathPrefixes: [...o] });
  }
  return [...t.values()];
}
function bu(e, t, n) {
  let i = uS(n.pathFilter),
    r = new Set(),
    s = new Set(),
    o = new Set(),
    a = [],
    l = !1,
    c = !1,
    d = !1,
    u = (E) => {
      ((l = !0), m(E), y([E], "global", E));
    },
    m = (E) => {
      if (!li(E, i)) return;
      o.add(E);
      let b = Qt(E);
      b && t.some((R) => R.projectRelPath === b) && o.add(b);
    },
    y = (E, b, R) => {
      let v = E[0];
      if (!v || !li(v, i)) return;
      let T = b ?? yS(v),
        x = R ?? v;
      a.push(Iu(T, x, E, n.indexedPathToId));
    };
  for (let E of e.deleted) {
    if (!li(E.projectRelPath, i)) continue;
    r.add(E.fileId);
    let b = Qt(E.projectRelPath),
      R = b ? n.indexedPathToId.get(b) : void 0;
    R !== void 0 && r.add(R);
  }
  for (let E of e.moved ?? []) {
    let b = E.discovered.projectRelPath;
    if (!li(b, i)) continue;
    (s.add(E.fileId), E.metaFileId !== void 0 && s.add(E.metaFileId), E.contentChanged && m(b));
    let R = Qt(b),
      v = R && t.some((T) => T.projectRelPath === R) ? [b, R] : [b];
    di(b) ? y(v, "structural", b) : ci(b) ? y([b, ...wr(b, t)], "assembly", `assembly:${Rn.posix.dirname(b)}`) : y(v);
  }
  for (let E of e.modified) {
    let b = E.discovered.projectRelPath;
    if (li(b, i)) {
      if (hu(b)) u(b);
      else if (ci(b)) {
        l = !0;
        let R = wr(b, t);
        (R.forEach(m), y([b, ...R], "assembly", `assembly:${Rn.posix.dirname(b)}`));
      } else if (di(b)) {
        let R = Qt(b),
          v = R ? [b, R].filter((T) => t.some((x) => x.projectRelPath === T)) : [b];
        y(v, "structural", b);
      } else {
        let R = Qt(b),
          v = R && t.some((T) => T.projectRelPath === R) ? [b, R] : [b];
        y(v);
      }
      (s.add(E.fileId), m(b));
    }
  }
  for (let E of e.created) {
    (hu(E.projectRelPath)
      ? u(E.projectRelPath)
      : ci(E.projectRelPath) && ((l = !0), wr(E.projectRelPath, t).forEach(m)),
      m(E.projectRelPath));
    let b = Qt(E.projectRelPath),
      R = b && t.some((v) => v.projectRelPath === b) ? [E.projectRelPath, b] : [E.projectRelPath];
    ci(E.projectRelPath)
      ? y([E.projectRelPath, ...wr(E.projectRelPath, t)], "assembly", `assembly:${Rn.posix.dirname(E.projectRelPath)}`)
      : di(E.projectRelPath)
        ? y(R, "structural", E.projectRelPath)
        : y(R);
  }
  let p = t.filter((E) => o.has(E.projectRelPath));
  for (let E of p) {
    let b = n.indexedPathToId.get(E.projectRelPath);
    b !== void 0 && s.add(b);
  }
  let g = gS(a),
    h = new Set(),
    S = new Set();
  for (let E of g)
    E.fileIds.forEach((b) => {
      (h.add(b), S.add(b));
    });
  s.forEach((E) => {
    (h.add(E), S.add(E));
  });
  let _ =
    g.length > 0
      ? g
      : [...h].map((E) => {
          let b = [...n.indexedPathToId.entries()].find(([, R]) => R === E)?.[0];
          return Iu("file", b ?? `file:${E}`, b ? [b] : [], n.indexedPathToId);
        });
  return {
    scopes: g,
    deletedFileIds: [...r],
    refreshFileIds: [...s],
    resolveFileIds: [...h],
    materializeScopes: _,
    extractDiscovered: p,
    rebuildAllAssemblies: l,
    rebuildProjectSymbolGraph: c,
    requiresFullDerivedRebuild: d,
    csharpSymbolOnlyChanges: Wo(e) && !d,
    assetSelfOnlyChanges: !d && !Wo(e) && yu(e, n.indexedGuidByFileId),
  };
}
function qo(e, t) {
  return e.map((n) => ({
    ...n,
    fileIds: [...new Set(n.projectRelPaths.map((i) => t.get(i)).filter((i) => i !== void 0))],
  }));
}
function Su(e, t) {
  let n = new Set();
  for (let i of e.scopes)
    for (let r of i.projectRelPaths) {
      let s = t.get(r);
      s !== void 0 && n.add(s);
    }
  for (let i of e.refreshFileIds) n.add(i);
  return [...n];
}
function Pr(e) {
  let t = new Set();
  return (e.forEach((n) => n.fileIds.forEach((i) => t.add(i))), [...t]);
}
var pS = 1;
function wn(e, t, n, i) {
  xt(e, t, n, i);
}
function vr(e, t) {
  t.length !== 0 &&
    (wn(e, "symbols", "file_id", t),
    wn(e, "yaml_references", "file_id", t),
    wn(e, "yaml_objects", "file_id", t),
    wn(e, "cs_mentions", "file_id", t),
    wn(e, "cs_declarations", "file_id", t));
}
function _u(e, t) {
  t.length !== 0 && (vr(e, t), xt(e, "files", "id", t));
}
function zo(e) {
  (e.exec("DELETE FROM entity_symbol_edges"),
    e.exec("DELETE FROM semantic_bindings"),
    e.exec("DELETE FROM symbol_edges"),
    e.exec("DELETE FROM symbols"));
}
function fi(e, t) {
  let n = Array.isArray(t) ? t : t.symbolFileIds,
    i = Array.isArray(t) ? t : (t.bindingFileIds ?? t.symbolFileIds);
  if (n.length === 0 && i.length === 0) return;
  if (i.length > 0) {
    let o = we(i.length);
    e.prepare(
      `DELETE FROM semantic_bindings
         WHERE mention_id IN (
           SELECT id FROM cs_mentions WHERE file_id IN (${o})
         )`,
    ).run(...i);
  }
  if (n.length === 0) return;
  let r = we(n.length),
    s = e.prepare(`SELECT id FROM symbols WHERE file_id IN (${r})`).all(...n);
  if (s.length > 0) {
    let o = s.map((a) => a.id);
    for (let a of Pe(o)) {
      let l = we(a.length);
      e.prepare(
        `DELETE FROM symbol_edges
           WHERE from_symbol_id IN (${l})
              OR to_symbol_id IN (${l})`,
      ).run(...a, ...a);
    }
    (xt(e, "symbol_edges", "source_file_id", n), xt(e, "symbols", "id", o));
    return;
  }
  e.prepare(`DELETE FROM symbol_edges WHERE source_file_id IN (${r})`).run(...n);
}
function xr(e) {
  (zo(e), e.exec("DELETE FROM entity_edges"), e.exec("DELETE FROM entities"), e.exec("DELETE FROM assets"));
}
function kr(e, t) {
  if (t.length === 0) return;
  let n = t.map(() => "?").join(", "),
    i = e.prepare(`SELECT id FROM assets WHERE file_id IN (${n})`).all(...t);
  if (i.length === 0) return;
  let r = i.map((s) => s.id);
  for (let s of Pe(r)) {
    let o = we(s.length);
    (e
      .prepare(
        `DELETE FROM entity_symbol_edges
         WHERE from_entity_id IN (
           SELECT id FROM entities WHERE asset_id IN (${o})
         )`,
      )
      .run(...s),
      e
        .prepare(
          `DELETE FROM entity_edges
         WHERE from_entity_id IN (
           SELECT id FROM entities WHERE asset_id IN (${o})
         ) OR to_entity_id IN (
           SELECT id FROM entities WHERE asset_id IN (${o})
         )`,
        )
        .run(...s, ...s));
  }
  (xt(e, "entities", "asset_id", r), xt(e, "assets", "file_id", t));
}
function Mr(e, t) {
  if (t.length === 0) return;
  let n = new Set();
  for (let i of t) {
    if (
      (e
        .prepare("SELECT id FROM vfs_entries WHERE vfs_path = ?")
        .all(i)
        .forEach((a) => n.add(a.id)),
      !i.endsWith("/"))
    )
      continue;
    let s = `${i.replace(/[\\%_]/g, "\\$&")}%`;
    e.prepare("SELECT id FROM vfs_entries WHERE vfs_path LIKE ? ESCAPE '\\'")
      .all(s)
      .forEach((a) => n.add(a.id));
  }
  n.size !== 0 && xt(e, "vfs_entries", "id", [...n]);
}
function Ho(e, t) {
  let n = [...new Set(t)].sort((i, r) => i - r);
  if (n.length !== 0)
    for (let i of Pe(n)) {
      let r = we(i.length);
      e.prepare(
        `DELETE FROM vfs_edges
         WHERE from_entry_id IN (
           SELECT id FROM vfs_entries WHERE host_file_id IN (${r})
         )`,
      ).run(...i);
    }
}
function Eu(e, t, n) {
  if (t.length === 0) return;
  let i = t.map((s) => s.fileId),
    r = t.flatMap((s) => ui(s.projectRelPath));
  (Mr(e, r), hS(e, i, n), kr(e, i));
}
function hS(e, t, n) {
  if (t.length === 0) return;
  let i = [];
  for (let [r, s] of n.entries())
    t.includes(s) && (i.push(r.replace(/\\/g, "/")), r.endsWith(".cs") && i.push(`${r.replace(/\\/g, "/")}:/`));
  (Mr(e, i), wn(e, "vfs_entries", "source_file_id", t));
}
function Jo(e, t) {
  let n = Pr(t);
  (kr(e, n), Ho(e, n));
}
function IS(e) {
  (e.exec("DELETE FROM vfs_edges"), e.exec("DELETE FROM vfs_entries"));
}
function Tr(e) {
  (IS(e),
    e.exec("DELETE FROM entity_symbol_edges"),
    e.exec("DELETE FROM entity_edges"),
    e.exec("DELETE FROM entities"),
    e.exec("DELETE FROM assets"),
    e.exec("DELETE FROM semantic_bindings"),
    e.exec("DELETE FROM symbol_edges"),
    e.exec("DELETE FROM symbols"));
}
function Ru(e) {
  (e.exec("DELETE FROM assembly_references"), e.exec("DELETE FROM assemblies"));
}
function Ur(e) {
  e.prepare("DELETE FROM index_diagnostics WHERE project_id = ?").run(pS);
}
function ye(e, t) {
  return e.prepare(`SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM ${t}`).get().next_id;
}
var wu = 1;
function Pu(e, t) {
  if (t.length === 0) return;
  let n = e.prepare("UPDATE files SET abs_path = ?, mtime_ms = ?, size_bytes = ? WHERE id = ?");
  for (let i of t) n.run(i.absolutePath, i.mtimeMs, i.sizeBytes, i.fileId);
}
function Xo(e, t) {
  (e
    .prepare(
      `UPDATE files
       SET project_rel_path = ?,
           abs_path = ?,
           size_bytes = ?,
           mtime_ms = ?,
           content_hash = ?
       WHERE id = ?`,
    )
    .run(t.projectRelPath, t.absolutePath, t.sizeBytes, t.mtimeMs, t.contentHash, t.fileId),
    e
      .prepare(
        `UPDATE assets
       SET vfs_root_path = ?
       WHERE file_id = ?`,
      )
      .run(t.projectRelPath, t.fileId));
}
function vu(e, t) {
  e.prepare(
    `UPDATE files
       SET abs_path = ?,
           kind = ?,
           guid = ?,
           meta_file_id = ?,
           size_bytes = ?,
           mtime_ms = ?,
           content_hash = ?,
           importer_type = ?
       WHERE id = ?`,
  ).run(t.absolutePath, t.kind, t.guid, t.metaFileId, t.sizeBytes, t.mtimeMs, t.contentHash, t.importerType, t.id);
}
function xu(e, t) {
  e.prepare(
    `INSERT INTO files (
        id,
        project_id,
        project_rel_path,
        abs_path,
        kind,
        guid,
        meta_file_id,
        size_bytes,
        mtime_ms,
        content_hash,
        importer_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    t.id,
    wu,
    t.projectRelPath,
    t.absolutePath,
    t.kind,
    t.guid,
    t.metaFileId,
    t.sizeBytes,
    t.mtimeMs,
    t.contentHash,
    t.importerType,
  );
}
function Qo(e, t) {
  let n = new Map(),
    i = e.prepare(`INSERT INTO assemblies (
      id,
      project_id,
      name,
      source,
      root_namespace,
      is_editor_only
    ) VALUES (?, ?, ?, ?, ?, ?)`),
    r = e.prepare(`INSERT INTO assembly_references (
      from_assembly_id,
      to_assembly_name,
      is_external
    ) VALUES (?, ?, ?)`);
  Ae(e, () => {
    (t.forEach((s, o) => {
      let a = o + 1;
      (n.set(s.name, a), i.run(a, wu, s.name, s.source, s.rootNamespace, s.isEditorOnly));
    }),
      t.forEach((s) => {
        let o = n.get(s.name);
        o &&
          s.references.forEach((a) => {
            r.run(o, a, n.has(a) ? 0 : 1);
          });
      }));
  });
}
function ku(e, t, n) {
  let i = bS(e);
  Ae(e, () => {
    i.writeRows(t, n);
  });
}
function bS(e) {
  let t = e.prepare(`INSERT INTO yaml_objects (
      id,
      file_id,
      doc_index,
      unity_class_id,
      anchor,
      object_type,
      local_identifier,
      game_object_file_id,
      component_type_name,
      script_guid,
      script_file_id,
      name,
      line_start,
      line_end
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),
    n = e.prepare(`INSERT INTO yaml_references (
      id,
      file_id,
      source_yaml_object_id,
      field_path,
      target_guid,
      target_file_id,
      target_local_id,
      ref_kind
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  return {
    writeRows: (i, r) => {
      (i.length === 0 && r.length === 0) ||
        (i.forEach((s) => {
          t.run(
            s.id,
            s.fileId,
            s.docIndex,
            s.unityClassId,
            s.anchor,
            s.objectType,
            s.localIdentifier,
            s.gameObjectFileId,
            s.componentTypeName,
            s.scriptGuid,
            s.scriptFileId,
            s.name,
            s.lineStart,
            s.lineEnd,
          );
        }),
        r.forEach((s) => {
          n.run(
            s.id,
            s.fileId,
            s.sourceYamlObjectId,
            s.fieldPath,
            s.targetGuid,
            s.targetFileId,
            s.targetLocalId,
            s.refKind,
          );
        }));
    },
  };
}
function Mu(e, t, n) {
  let i = e.prepare(`INSERT INTO cs_declarations (
      id,
      file_id,
      decl_kind,
      simple_name,
      qualified_name_text,
      arity,
      modifiers_json,
      signature_text,
      skeleton_content,
      line_start,
      line_end
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  Ae(e, () => {
    (t.forEach((r) => {
      i.run(
        r.id,
        r.fileId,
        r.declKind,
        r.simpleName,
        r.qualifiedNameText,
        null,
        "[]",
        r.signatureText,
        r.skeletonText ?? null,
        r.lineStart,
        r.lineEnd,
      );
    }),
      SS(e, n));
  });
}
function SS(e, t) {
  if (t.length === 0) return;
  let n = 9,
    i = Jt(n),
    r = `INSERT INTO cs_mentions (
      id,
      file_id,
      mention_kind,
      text,
      receiver_text,
      argument_arity,
      containing_declaration_id,
      line_start,
      line_end
    ) VALUES `,
    s = t.length >= i ? e.prepare(`${r}${Ze(i, n)}`) : null;
  for (let o of Pe(t, i))
    (o.length === i ? s : e.prepare(`${r}${Ze(o.length, n)}`)).run(
      ...o.flatMap((l) => [
        l.id,
        l.fileId,
        l.mentionKind,
        l.text,
        l.receiverText,
        l.argumentArity,
        l.containingDeclarationId,
        l.lineStart,
        l.lineEnd,
      ]),
    );
}
import { readFile as uE } from "node:fs/promises";
import { readFileSync as fE } from "node:fs";
import ht from "node:path";
function Tu(e) {
  return e === "texture" ? "image" : e;
}
var _S = {
    19: "Internal-StencilWrite.shader",
    65: "Internal-CombineDepthNormals.shader",
    66: "Internal-BlitCopy.shader",
    67: "Internal-BlitCopyDepth.shader",
    107: "Internal-BlitCopyWithDepth.shader",
    68: "Internal-ConvertTexture.shader",
    109: "Internal-BlitToDepth.shader",
    110: "Internal-BlitToDepth_MSAA.shader",
    111: "Internal-BlitCopyHDRTonemap.shader",
    112: "Internal-BlitCopyHDRTonemappedToHDRTonemap.shader",
    114: "Internal-BlitCopyHDRTonemappedToSDR.shader",
    45: "StandardSpecular.shader",
    46: "Standard.shader",
    47: "AutodeskInteractive.shader",
    64: "Internal-ScreenSpaceShadows.shader",
    62: "Internal-DepthNormalsTexture.shader",
    74: "Internal-DeferredReflections.shader",
    69: "Internal-DeferredShading.shader",
    75: "Internal-MotionVectors.shader",
    6: "Normal-VertexLit.shader",
    1: "Normal-DiffuseFast.shader",
    7: "Normal-Diffuse.shader",
    2: "Normal-Bumped.shader",
    3: "Normal-Glossy.shader",
    4: "Normal-BumpSpec.shader",
    5: "Normal-DiffuseDetail.shader",
    14: "Illumin-VertexLit.shader",
    10: "Illumin-Diffuse.shader",
    11: "Illumin-Bumped.shader",
    12: "Illumin-Glossy.shader",
    13: "Illumin-BumpSpec.shader",
    24: "Reflect-VertexLit.shader",
    25: "Reflect-BumpNolight.shader",
    20: "Reflect-Diffuse.shader",
    21: "Reflect-Bumped.shader",
    26: "Reflect-BumpVertexLit.shader",
    22: "Reflect-Glossy.shader",
    23: "Reflect-BumpSpec.shader",
    34: "Alpha-VertexLit.shader",
    30: "Alpha-Diffuse.shader",
    31: "Alpha-Bumped.shader",
    32: "Alpha-Glossy.shader",
    33: "Alpha-BumpSpec.shader",
    50: "AlphaTest-VertexLit.shader",
    51: "AlphaTest-Diffuse.shader",
    52: "AlphaTest-Bumped.shader",
    53: "AlphaTest-Glossy.shader",
    54: "AlphaTest-BumpSpec.shader",
    8: "Normal-Parallax.shader",
    9: "Normal-ParallaxSpec.shader",
    15: "Illumin-Parallax.shader",
    16: "Illumin-ParallaxSpec.shader",
    27: "Reflect-Parallax.shader",
    28: "Reflect-ParallaxSpec.shader",
    35: "Alpha-Parallax.shader",
    36: "Alpha-ParallaxSpec.shader",
    10512: "AlphaTest-SoftEdgeUnlit.shader",
    100: "Decal.shader",
    102: "Internal-Flare.shader",
    101: "Flare.shader",
    103: "Skybox-Cubed.shader",
    104: "Skybox.shader",
    105: "Internal-Halo.shader",
    106: "Skybox-Procedural.shader",
    108: "Skybox-Panoramic.shader",
    113: "Internal-DebugPattern.shader",
    200: "Particle Add.shader",
    201: "Particle AddMultiply.shader",
    202: "Particle AddSmooth.shader",
    203: "Particle Alpha Blend.shader",
    205: "Particle Multiply.shader",
    206: "Particle MultiplyDouble.shader",
    207: "Particle Premultiply Blend.shader",
    208: "Particle VertexLit Blended.shader",
    209: "Particle Anim Alpha Blend.shader",
    210: "Particle Standard Surface.shader",
    211: "Particle Standard Unlit.shader",
    10800: "Sprites-Diffuse.shader",
    10490: "TerrainShaders/Splats/Terrain-Utilities.shader",
    10500: "TerrainShaders/Details/VertexLit.shader",
    10501: "TerrainShaders/Details/WavingGrass.shader",
    10502: "TerrainShaders/Details/WavingGrassBillboard.shader",
    10507: "TerrainShaders/Trees/BillboardTree.shader",
    10513: "TerrainShaders/Trees/CameraFacingBillboardTree.shader",
    10504: "TerrainShaders/Splats/DiffuseBase.shader",
    10506: "TerrainShaders/Splats/DiffuseBaseGen.shader",
    10503: "TerrainShaders/Splats/AddPass.shader",
    10505: "TerrainShaders/Splats/FirstPass.shader",
    40: "Lightmap-VertexLit.shader",
    41: "Lightmap-Diffuse.shader",
    42: "Lightmap-Bumped.shader",
    43: "Lightmap-Glossy.shader",
    44: "Lightmap-BumpSpec.shader",
    9e3: "Internal-GUITextureClip.shader",
    9001: "Internal-GUITextureClipText.shader",
    9002: "Internal-GUITexture.shader",
    9003: "Internal-GUITextureBlit.shader",
    9004: "Internal-GUIRoundedRect.shader",
    9007: "Internal-GUIRoundedRectWithColorPerBorder.shader",
    9100: "Internal/UIElements/Internal-UIRDefault.shader",
    9101: "Internal/UIElements/Internal-UIRAtlasBlitCopy.shader",
    9102: "Internal/UIElements/Internal-UIRDefaultWorld.shader",
    9103: "Internal/UIElements/EditorUIE.shader",
    9104: "Internal/UIElements/GraphViewUIE.shader",
    9105: "Internal/UIElements/Internal-UIE-ColorConversionBlit.shader",
    9106: "Internal/UIElements/GTFUIE.shader",
    10508: "Nature/SoftOcclusion/TreeSoftOcclusionBarkRendertex.shader",
    10509: "Nature/SoftOcclusion/TreeSoftOcclusionBark.shader",
    10510: "Nature/SoftOcclusion/TreeSoftOcclusionLeavesRendertex.shader",
    10511: "Nature/SoftOcclusion/TreeSoftOcclusionLeaves.shader",
    10600: "Nature/TreeCreator/TreeCreatorBark.shader",
    10601: "Nature/TreeCreator/TreeCreatorLeaves.shader",
    10602: "Nature/TreeCreator/TreeCreatorBarkRendertex.shader",
    10603: "Nature/TreeCreator/TreeCreatorLeavesRendertex.shader",
    10604: "Nature/TreeCreator/TreeCreatorBarkOptimized.shader",
    10605: "Nature/TreeCreator/TreeCreatorLeavesOptimized.shader",
    10606: "Nature/TreeCreator/TreeCreatorLeavesFast.shader",
    10607: "Nature/TreeCreator/TreeCreatorLeavesFastOptimized.shader",
    10608: "Nature/TreeCreator/TreeCreatorAlbedoRenderTex.shader",
    10609: "Nature/TreeCreator/TreeCreatorNormalRendertex.shader",
    10621: "TerrainShaders/Splats/Specular-AddPass.shader",
    10622: "TerrainShaders/Splats/Specular-Base.shader",
    10620: "TerrainShaders/Splats/Specular-FirstPass.shader",
    10624: "TerrainShaders/Splats/Standard-AddPass.shader",
    10625: "TerrainShaders/Splats/Standard-Base.shader",
    10626: "TerrainShaders/Splats/Standard-BaseGen.shader",
    10623: "TerrainShaders/Splats/Standard-FirstPass.shader",
    10650: "Default-Terrain-Diffuse.mat",
    10651: "Default-Terrain-Specular.mat",
    10652: "Default-Terrain-Standard.mat",
    10700: "Mobile/Mobile-Skybox.shader",
    10701: "Mobile/Mobile-VertexLit.shader",
    10703: "Mobile/Mobile-Diffuse.shader",
    10704: "Mobile/Mobile-Bumped.shader",
    10705: "Mobile/Mobile-BumpSpec.shader",
    10706: "Mobile/Mobile-BumpSpec-1DirectionalLight.shader",
    10707: "Mobile/Mobile-VertexLit-OnlyDirectionalLights.shader",
    10708: "Mobile/Mobile-Lightmap-Unlit.shader",
    10720: "Mobile/Mobile-Particle-Add.shader",
    10721: "Mobile/Mobile-Particle-Alpha.shader",
    10722: "Mobile/Mobile-Particle-Alpha-VertexLit.shader",
    10723: "Mobile/Mobile-Particle-Multiply.shader",
    10750: "Unlit/Unlit-Alpha.shader",
    10751: "Unlit/Unlit-AlphaTest.shader",
    10752: "Unlit/Unlit-Normal.shader",
    10753: "Sprites-Default.shader",
    10754: "Sprites-Default.mat",
    10755: "Unlit/Unlit-Color.shader",
    10757: "Sprites-Mask.shader",
    10758: "Sprites-Mask.mat",
    10760: "UI/UI-Unlit-Transparent.shader",
    10761: "UI/UI-Unlit-Detail.shader",
    10762: "UI/UI-Unlit-Text.shader",
    10763: "UI/UI-Unlit-TextDetail.shader",
    10764: "UI/UI-Lit-Transparent.shader",
    10765: "UI/UI-Lit-Bumped.shader",
    10766: "UI/UI-Lit-Detail.shader",
    10767: "UI/UI-Lit-Refraction.shader",
    10768: "UI/UI-Lit-RefractionDetail.shader",
    10770: "UI/UI-Default.shader",
    10782: "UI/UI-DefaultFont.shader",
    10783: "UI/UI-DefaultETC1.shader",
    10784: "UI/UI-CompositeOverdraw.shader",
    10785: "UI/UI-Overdraw.shader",
    10300: "Default-Particle.psd",
    10301: "Default-Particle.mat",
    10302: "Default-Diffuse.mat",
    10303: "Default-Material.mat",
    10304: "Default-Skybox.mat",
    10305: "Default-Checker.png",
    10306: "Default-Line.mat",
    10307: "Default-ParticleSystem.psd",
    10308: "Default-ParticleSystem.mat",
    10309: "Default-Checker-Gray.png",
    10900: "UI/Skin/Checkmark.psd",
    10901: "UI/Skin/Checkmark.psd",
    10904: "UI/Skin/UISprite.psd",
    10905: "UI/Skin/UISprite.psd",
    10906: "UI/Skin/Background.psd",
    10907: "UI/Skin/Background.psd",
    10910: "UI/Skin/InputFieldBackground.psd",
    10911: "UI/Skin/InputFieldBackground.psd",
    10912: "UI/Skin/Knob.psd",
    10913: "UI/Skin/Knob.psd",
    10914: "UI/Skin/DropdownArrow.psd",
    10915: "UI/Skin/DropdownArrow.psd",
    10916: "UI/Skin/UIMask.psd",
    10917: "UI/Skin/UIMask.psd",
    14e3: "Nature/SpeedTree.shader",
    14001: "Nature/SpeedTreeBillboard.shader",
    14002: "Nature/SpeedTree8.shader",
    15100: "GIDebug/TextureUV.shader",
    15101: "GIDebug/ShowLightMask.shader",
    15102: "GIDebug/UV1sAsPositions.shader",
    15103: "GIDebug/VertexColors.shader",
    15104: "Cubemaps/CubeBlur.shader",
    15105: "Cubemaps/CubeCopy.shader",
    15106: "Cubemaps/CubeBlend.shader",
    15200: "LightmapParameters/Default-HighResolution.giparams",
    15201: "LightmapParameters/Default-LowResolution.giparams",
    15203: "LightmapParameters/Default-VeryLowResolution.giparams",
    15204: "LightmapParameters/Default-Medium.giparams",
    15300: "VR/Shaders/SpatialMappingOcclusion.shader",
    15301: "VR/Shaders/SpatialMappingWireframe.shader",
    15302: "VR/Materials/SpatialMappingOcclusion.mat",
    15303: "VR/Materials/SpatialMappingWireframe.mat",
    15304: "VR/Shaders/BlitTexArraySlice.shader",
    15305: "VR/Shaders/Internal-VRDistortion.shader",
    15306: "VR/Shaders/BlitTexArraySliceToDepth.shader",
    15307: "VR/Shaders/BlitTexArraySliceToDepth_MSAA.shader",
    15308: "Internal-ODSWorldTexture.shader",
    15309: "Internal-CubemapToEquirect.shader",
    15312: "VR/Shaders/BlitFromTex2DToTexArraySlice.shader",
    15313: "VR/Shaders/BlitCopyHDRTonemapTexArraySlice.shader",
    15314: "VR/Shaders/BlitCopyHDRTonemappedToHDRTonemapTexArraySlice.shader",
    15315: "VR/Shaders/BlitCopyHDRTonemappedToSDRTexArraySlice.shader",
    16e3: "VideoComposite.shader",
    16001: "VideoDecode.shader",
    16002: "VideoDecodeOSX.shader",
    16003: "VideoDecodeAndroid.shader",
    16004: "VideoDecodeOpenHarmony.shader",
    16005: "VideoCompositeMiniGameMetal.shader",
    17e3: "Compositing.shader",
    18e3: "TerrainShaders/Utils/PaintHeight.shader",
    18001: "TerrainShaders/Utils/TerrainHeightBlitCopy.shader",
    18002: "TerrainShaders/Utils/GenNormalmap.shader",
    18003: "TerrainShaders/Utils/TerrainLayerUtils.shader",
    18004: "TerrainShaders/Utils/BrushPreview.shader",
    18005: "TerrainShaders/Utils/CrossBlendNeighbors.shader",
    18006: "TerrainShaders/Utils/TerrainBlitCopyZWrite.shader",
    19010: "TextCore/TextCore-SDF.shader",
    19011: "TextCore/TextCore-SDF-SSD.shader",
    19012: "TextCore/Sprite.shader",
    2e4: "SplashScreen/UnitySplash-Dark.png",
    20001: "SplashScreen/UnitySplash-Dark.png",
    10403: "SplashScreen/UnitySplash-Light.png",
    10404: "SplashScreen/UnitySplash-Light.png",
    20100: "Invalidated.png",
    21e3: "MaskedOcclusionCulling/OccludeeScreenSpaceAABB.shader",
    21001: "MaskedOcclusionCulling/OcclusionDebugComposite.shader",
    21002: "MaskedOcclusionCulling/OcclusionDebugOccluders.shader",
  },
  ES = {
    17: "Internal-ErrorShader.shader",
    68: "Internal-Clear.shader",
    69: "Internal-Colored.shader",
    70: "Internal-Loading.shader",
    300: "Internal-Skinning.compute",
    301: "Internal-BlendShape.compute",
    400: "Internal-VT-TranslationTableReplace.compute",
    401: "Internal-VT-TranslationTableUpsample.compute",
    600: "Internal-CreateFoveatedShadingRateTextureArray.compute",
    601: "Internal-CreateFoveatedShadingRateTextureNoArray.compute",
    10001: "Soft.psd",
    10100: "LegacyRuntime.ttf",
    10101: "Font.shader",
    10102: "LegacyRuntime.ttf",
    10103: "LegacyRuntime.ttf",
    10202: "Cube.fbx",
    10206: "New-Cylinder.fbx",
    10207: "New-Sphere.fbx",
    10208: "New-Capsule.fbx",
    10209: "New-Plane.fbx",
    10210: "Quad.fbx",
    10211: "icosphere.fbx",
    10212: "icosahedron.fbx",
    10213: "pyramid.fbx",
    10200: "Sphere.fbx",
    10203: "Cylinder.fbx",
    10204: "Plane.fbx",
    10205: "Capsule.fbx",
    10400: "UnityWaterMark-small.png",
    10401: "EscToExit_back.png",
    10402: "EscToExit_text.png",
    10406: "UnityWaterMark-trial-big.png",
    10407: "UnityWaterMark-trial.png",
    10408: "UnityWaterMark-beta.png",
    10409: "UnityWaterMark-edu.png",
    10410: "UnityWaterMark-dev.png",
    10411: "WarningSign.psd",
    10413: "UnityWaterMark-proto.png",
    10414: "UnityWaterMarkPlugin-beta.png",
    10415: "test-small.png",
    10416: "test-trial-big.png",
    10417: "test-trial.png",
    10418: "test-beta.png",
    10419: "test-edu.png",
    10420: "test-dev.png",
    10421: "test-proto.png",
    10422: "test-Plugin-beta.png",
    10423: "UnityWatermark-morse-logo.png",
    10755: "PerformanceTools/FrameDebuggerRenderTargetDisplay.shader",
    10756: "PerformanceTools/FrameDebuggerRenderTargetDisplay.mat",
    11e3: "GameSkin/GameSkin.guiskin",
    11001: "GameSkin/box.png",
    11002: "GameSkin/button active.png",
    11003: "GameSkin/button hover.png",
    11004: "GameSkin/button on hover.png",
    11005: "GameSkin/button on.png",
    11006: "GameSkin/button.png",
    11007: "GameSkin/horizontal scrollbar thumb.png",
    11008: "GameSkin/horizontal scrollbar.png",
    11009: "GameSkin/horizontalslider.png",
    11010: "GameSkin/slider thumb active.png",
    11011: "GameSkin/slider thumb.png",
    11012: "GameSkin/slidert humb hover.png",
    11013: "GameSkin/toggle active.png",
    11014: "GameSkin/toggle hover.png",
    11015: "GameSkin/toggle on hover.png",
    11016: "GameSkin/toggle on.png",
    11017: "GameSkin/toggle on active.png",
    11018: "GameSkin/toggle.png",
    11019: "GameSkin/vertical scrollbar thumb.png",
    11020: "GameSkin/vertical scrollbar.png",
    11021: "GameSkin/verticalslider.png",
    11022: "GameSkin/window on.png",
    11023: "GameSkin/window.png",
    11024: "GameSkin/textfield.png",
    11025: "GameSkin/textfield on.png",
    11026: "GameSkin/textfield hover.png",
    11993: "TemplateAsset",
    11995: "VisualTreeAsset",
    11998: "StyleSheet",
    19202: "ThemeStyleSheet",
    12001: "GUISkin",
    13312: "Tile",
    13313: "TileBase",
    19e3: "TextSettings",
    19001: "FontAsset",
    19002: "SpriteAsset",
    19003: "TextColorGradient",
    19004: "TextStyleSheet",
    19100: "VectorImage",
    19101: "PanelSettings",
    19102: "UIDocument",
    19103: "PanelTextSettings",
    19301: "AndroidAppViewSettings",
    20001: "Internal/GDRP/ScatterCopy.compute",
    20002: "Internal/GDRP/GenerateMaterialRange.compute",
    20004: "Internal/GDRP/GPUCulling.compute",
    20005: "Internal/GDRP/GPUCullingInit.compute",
    20006: "Internal/GDRP/Transcode.compute",
    20007: "Internal/GDRP/DownsampleDepth.compute",
    20008: "Internal/GDRP/GPUDrivenFlattenProbeData.compute",
    20009: "Internal/GDRP/GPUVisibleBucket.compute",
    20010: "Internal/GDRP/MeshSelectionOutline.shader",
    20011: "Internal/GDRP/GPUBakedLightmap.shader",
    20012: "Internal/GDRP/VirtualShadowMap/VirtualShadowMapHizBuild.compute",
    20013: "DSLGenerate/initPageRectSize_kernel.compute",
    20014: "DSLGenerate/InitPhysicalPageInfo_kernel.compute",
    20015: "Internal/GDRP/VirtualShadowMap/GeneratePhysicalPageAllocationRequest.compute",
    20016: "DSLGenerate/CollectFreePhysicalPage_kernel.compute",
    20017: "DSLGenerate/AllocatePageAndUpdateMapping_kernel.compute",
    20018: "DSLGenerate/UpdatePageFlagsForHigherMiplevels_kernel.compute",
    20019: "DSLGenerate/RefreshLowerMipsMapping_kernel.compute",
    20020: "DSLGenerate/InitPhysicalPoolTexture_kernel.compute",
    20021: "DSLGenerate/FilterValidVirtualShadowmap_kernel.compute",
    20022: "DSLGenerate/ClearIndirectArgsBuffer_kernel.compute",
    20023: "DSLGenerate/FilterUninitializedPages_kernel.compute",
    20024: "DSLGenerate/InitPhysicalPoolTextureIndirect_kernel.compute",
    20025: "DSLGenerate/ClearNonGDRPArgs_kernel.compute",
    20026: "DSLGenerate/NonGDRPInstanceCulling_kernel.compute",
    20027: "DSLGenerate/BuildInstanceOutputOffset_kernel.compute",
    20028: "DSLGenerate/FillFinalInstanceData_kernel.compute",
    20029: "DSLGenerate/InvalidInstanceKernel_kernel.compute",
    20030: "DSLGenerate/MergeStaticAndDynamicPages_kernel.compute",
    20031: "Internal/GDRP/VirtualShadowMap/GenerateInvalidInstances.compute",
    20032: "Internal/GDRP/VirtualShadowMap/ExtractSurroundingPages.compute",
    20033: "Internal/GDRP/GPUCullingDegenerate.compute",
    20042: "Internal/GRD/GRDTransformUpdateKernels.compute",
    20043: "Internal/GRD/GRDCopyData.compute",
    20044: "Internal/GRD/InstanceOcclusionCullingKernels.compute",
    20045: "Internal/GRD/OccluderDepthPyramidKernels.compute",
    21002: "Internal/RadeonRays/block_reduce_part.compute",
    21003: "Internal/RadeonRays/block_scan.compute",
    21004: "Internal/RadeonRays/build_hlbvh.compute",
    21005: "Internal/RadeonRays/copy_positions.compute",
    21006: "Internal/RadeonRays/restructure_bvh.compute",
    21007: "Internal/RadeonRays/scatter.compute",
    12002: "TerrainInspector",
    12003: "ConsoleWindow",
    12004: "ContainerWindow",
    12005: "GUIView",
    12006: "DockArea",
    12007: "EditorWindow",
    12008: "MainView",
    12009: "PaneDragTab",
    12010: "SplitView",
    12011: "Toolbar",
    12012: "Tools",
    12013: "SceneView",
    12014: "ProjectBrowser",
    12015: "GameView",
    12016: "PopupEditor",
    12017: "ColorPicker",
    12018: "AboutWindow",
    12019: "InspectorWindow",
    12020: "ShaderInspector",
    12024: "AssetImporterEditor",
    12025: "TextureImporterInspector",
    12027: "TransformInspector",
    12028: "ModelImporterEditor",
    12029: "AudioImporterInspector",
    12030: "TrueTypeFontImporterInspector",
    12031: "TextureInspector",
    12032: "GameObjectInspector",
    12033: "MaterialEditor",
    12034: "SaveWindowLayout",
    12035: "DeleteWindowLayout",
    12036: "RenderTextureInspector",
    12038: "CubemapTextureInspector",
    12039: "RagdollBuilder",
    12040: "GenericInspector",
    12041: "ProfilerIPWindow",
    12042: "AppStatusBar",
    12043: "BuildPlayerWindow",
    12044: "PreferencesWindow",
    12045: "Settings",
    12046: "SnapSettings",
    12047: "HostView",
    12048: "TerrainWizard",
    12049: "LightmapWizard",
    12050: "ImportRawHeightmap",
    12051: "ExportRawHeightmap",
    12052: "SetResolutionWizard",
    12053: "TreeWizard",
    12054: "SplatWizard",
    12055: "DetailMeshWizard",
    12056: "DetailTextureWizard",
    12057: "PlaceTreeWizard",
    12058: "FlattenHeightmap",
    12059: "FallbackEditorWindow",
    12060: "MaximizedHostView",
    12061: "SceneHierarchyWindow",
    12062: "PackageExport",
    12063: "PackageImport",
    12064: "EyeDropper",
    12066: "MonoScriptInspector",
    12067: "AudioClipInspector",
    12068: "ModelInspector",
    12069: "TooltipView",
    12070: "ProfilerWindow",
    12071: "AnimationWindow",
    12073: "AnimationEventPopup",
    12074: "EditorSettingsInspector",
    12076: "AnimationCleanupPopup",
    12077: "ScriptReloadProperties",
    12078: "MacroWindow",
    12079: "LightingWindow",
    12080: "AuxWindow",
    12081: "ObjectSelector",
    12082: "LabelCompletion",
    12083: "CurveEditorWindow",
    12084: "MonoScriptImporterInspector",
    12086: "TextAssetInspector",
    12087: "LightEditor",
    12088: "AudioSourceInspector",
    12089: "AudioLowPassFilterInspector",
    12090: "OcclusionCullingWindow",
    12091: "WebCamTextureInspector",
    12092: "ShaderImporterInspector",
    12093: "StandardShaderGUI",
    12094: "LegacyIlluminShaderGUI",
    12095: "GraphicsSettingsWindow",
    12096: "PhysicsDebugWindow",
    12097: "LightingExplorerWindow",
    12098: "LightmapPreviewWindow",
    12099: "AudioReverbZoneEditor",
    12100: "PhysicsManagerInspector",
    12101: "ClothInspector",
    12102: "BumpMapSettingsFixingWindow",
    12103: "PragmaFixingWindow",
    12104: "WindInspector",
    12105: "TreeEditor",
    12106: "TreeData",
    12107: "PlayerSettingsEditor",
    12108: "EditorUpdateWindow",
    12109: "AudioReverbFilterEditor",
    12111: "AssetStoreWindow",
    12112: "AssetStoreContext",
    12113: "AssembleEditorSkin",
    12114: "OcclusionAreaEditor",
    12115: "CameraEditor",
    12116: "WindowFocusState",
    12117: "AndroidKeystoreWindow",
    12118: "AudioDistortionFilterEditor",
    12119: "AudioEchoFilterEditor",
    12120: "AudioHighPassFilterEditor",
    12121: "AudioChorusFilterEditor",
    12122: "BoxColliderEditor",
    12123: "SphereColliderEditor",
    12124: "CapsuleColliderEditor",
    12125: "MeshColliderEditor",
    12126: "WheelColliderEditor",
    12127: "RigidbodyEditor",
    12128: "AssetSaveDialog",
    12129: "AnnotationWindow",
    12130: "IconSelector",
    12131: "ScriptExecutionOrderInspector",
    12132: "AnimationEditor",
    12133: "SkinnedMeshRendererEditor",
    12134: "PreviewWindow",
    12135: "LODGroupEditor",
    12136: "OffMeshLinkInspector",
    12137: "ParticleSystemWindow",
    12138: "ParticleSystemInspector",
    12139: "MeshRendererEditor",
    12140: "GradientPicker",
    12141: "NavMeshEditorWindow",
    12142: "FontInspector",
    12143: "SpriteMaskEditor",
    12146: "Brush",
    12147: "BrushInspector",
    12148: "TerrainLayerInspector",
    12149: "TilemapRendererEditor",
    12150: "SpriteRendererEditor",
    12151: "SpriteInspector",
    12152: "SpriteShapeRendererInspector",
    12153: "TagManagerInspector",
    12154: "RenderSettingsInspector",
    12155: "ShaderVariantCollectionInspector",
    12160: "AssemblyDefinitionImporterInspector",
    12161: "AssemblyDefinitionAsset",
    12162: "IHVImageFormatImporterInspector",
    12163: "VideoClipImporterInspector",
    12164: "SketchUpImporterEditor",
    12165: "VideoClipImporterInspector/TargetSettings",
    12166: "AudioImporterInspector/PlatformSettings",
    12167: "ShaderImporterInspector/ShaderProperties",
    12168: "AssemblyDefinitionReferenceImporterInspector/AssemblyDefinitionReferenceState",
    12169: "AssemblyDefinitionImporterInspector/AssemblyDefinitionState",
    12170: "AssemblyDefinitionReferenceImporterInspector",
    12171: "AssemblyDefinitionReferenceAsset",
    12172: "ComputeShaderImporterInspector",
    12173: "TextScriptImporterEditor",
    12202: "ProceduralMaterialInspector",
    12203: "ProceduralTextureInspector",
    12204: "NavMeshAgentInspector",
    12205: "LightProbeGroupInspector",
    12206: "LightProbeGroupSelection",
    12207: "View",
    12208: "OcclusionPortalInspector",
    12209: "NavMeshObstacleInspector",
    12210: "PopupList",
    12211: "AssetStoreAssetInspector",
    12212: "AssetStoreInstaBuyWindow",
    12213: "AssetStoreLoginWindow",
    12216: "EndNameEditAction",
    12217: "DoCreateNoneAsset",
    12218: "DoCreateNewAsset",
    12219: "DoCreateFolder",
    12220: "DoCreatePrefab",
    12221: "DoCreateScriptAsset",
    12223: "DoCreateAnimatorController",
    12214: "LightProbesInspector",
    12215: "AddComponentWindow",
    12222: "LicenseManagementWindow",
    12226: "LightmapParametersEditor",
    12227: "DynamicCubemapEditor",
    12300: "WindowResolve",
    12301: "WindowChange",
    12303: "WindowPending",
    12304: "WindowRevert",
    12306: "CharacterControllerEditor",
    12307: "QualitySettingsEditor",
    12308: "SavedSearchFilters",
    12309: "TextureManagerSettingInspector",
    12310: "TextMeshInspector",
    12311: "Texture3DInspector",
    12312: "MetroCreateTestCertificateWindow",
    12313: "MetroCertificatePasswordWindow",
    12314: "ModelImporterRigEditor",
    12315: "ModelImporterModelEditor",
    12316: "ModelImporterClipEditor",
    12317: "ModelImporterMaterialEditor",
    12318: "AvatarPreviewSelection",
    12319: "PopupWindow",
    12320: "PresetLibraryManager",
    12321: "GradientPresetLibrary",
    12322: "CurvePresetLibrary",
    12323: "ColorPresetLibrary",
    12324: "DoubleCurvePresetLibrary",
    12325: "AtlasEditorWindow",
    12326: "PackerWindow",
    12327: "PolygonCollider2DEditor",
    12328: "Physics2DPreferenceState",
    12329: "Physics2DSettingsInspector",
    12330: "GameViewSizes",
    12331: "ColorPresetLibraryEditor",
    12332: "GradientPresetLibraryEditor",
    12333: "CurvePresetLibraryEditor",
    12334: "DoubleCurvePresetLibraryEditor",
    12335: "ReflectionProbeEditor",
    12336: "LightProbeProxyVolumeEditor",
    12337: "PrefabImporterEditor",
    12346: "CustomCollider2DEditor",
    12347: "CapsuleCollider2DEditor",
    12348: "TargetJoint2DEditor",
    12349: "RelativeJoint2DEditor",
    12350: "BoxCollider2DEditor",
    12351: "CircleCollider2DEditor",
    12352: "EdgeCollider2DEditor",
    12353: "AnchoredJoint2DEditor",
    12354: "HingeJoint2DEditor",
    12355: "SpringJoint2DEditor",
    12356: "DistanceJoint2DEditor",
    12357: "SliderJoint2DEditor",
    12358: "WheelJoint2DEditor",
    12359: "Effector2DEditor",
    12360: "InterceptedEventsEditor",
    12361: "RectTransformEditor",
    12362: "SpriteEditorWindow",
    12363: "SpriteAtlasInspector",
    12364: "SpriteAtlasImporterInspector",
    12365: "SpeedTreeImporterInspector",
    12366: "SpeedTreeMaterialInspector",
    12367: "BillboardRendererInspector",
    12368: "BillboardAssetInspector",
    12369: "SpeedTree8ShaderGUI",
    12372: "AudioMixerEditor",
    12373: "AudioMixerWindow",
    12374: "AudioMixerGroupEditor",
    12375: "AudioMixerControllerInspector",
    12376: "AudioMixerSnapshotControllerInspector",
    12380: "Rigidbody2DEditor",
    12381: "Joint2DEditor",
    12382: "BuoyancyEffector2DEditor",
    12383: "PlatformEffector2DEditor",
    12384: "ScriptedImporterEditor",
    12385: "StyleSheetImporter",
    12386: "SerializableJsonDictionary",
    12387: "StyleSheetImporterEditor",
    12388: "ThemeStyleSheetImporter",
    12389: "ThemeAssetDefinitionState",
    12390: "ThemeStyleSheetImporterEditor",
    12394: "GridEditor",
    12395: "GridPalette",
    12396: "Preset",
    12397: "PresetEditor",
    12398: "PresetManagerEditor",
    12399: "PresetManager",
    12400: "SceneSetEditor",
    12401: "AssemblyDefinitionAsset",
    12402: "ServicesEditorWindow",
    13138: "Graph",
    13139: "GraphInspector",
    13140: "GraphGUI",
    13141: "Node",
    12901: "AnimatorInspector",
    12902: "AnimatorOverrideControllerInspector",
    12905: "AnimationClipEditor",
    12906: "AvatarEditor",
    12907: "AnimatorTransitionInspector",
    12908: "AnimatorStateTransitionInspector",
    12909: "TRigEditor",
    12910: "TRetargeterEditor",
    12914: "AnimatorControllerTool",
    12915: "AvatarMaskInspector",
    12916: "BlendTreeInspector",
    12917: "AvatarMappingEditor",
    12918: "AvatarMuscleEditor",
    12919: "GraphGUI",
    12920: "Graph",
    12921: "Node",
    12925: "PositionConstraintEditor",
    12926: "RotationConstraintEditor",
    12927: "ScaleConstraintEditor",
    12928: "ParentConstraint",
    12929: "AimConstraintEditor",
    12930: "GraphGUI",
    12931: "Graph",
    12932: "StateNode",
    12933: "AnyStateNode",
    12934: "StateMachineNode",
    12935: "StateEditor",
    12936: "StateMachineInspector",
    12937: "AnyStateNodeInspector",
    12938: "EntryNodeInspector",
    12939: "ExitNodeInspector",
    12940: "StateMachineBehaviourEditor",
    12941: "TimelineWindowViewPrefs",
    13001: "EditorGameObjectCache",
    13202: "FrameDebuggerWindow",
    13203: "PluginImporterInspector",
    13205: "ParameterControllerEditor",
    13401: "TestRunnerWindow",
    13501: "GUIViewDebuggerWindow",
    13510: "VisualEffectInspector",
    13601: "LookDevView",
    13602: "LookDevConfig",
    13603: "LookDevEnvironmentLibrary",
    13604: "VideoPlayerEditor",
    13605: "AndroidAppViewSettingsEditor",
    13700: "HolographicEmulationWindow",
    13800: "WebGLStrippingInfo",
    13802: "StrippingInfo",
    13803: "AndroidBuildProperties",
    13804: "UIElementsViewImporter",
    13805: "DefaultBuildProperties",
    13806: "GraphViewUndoRedoSelection",
    13807: "UIElementsSnippetAsset",
    13852: "StreamingControllerEditor",
    13853: "SettingsWindow",
    13854: "ProjectSettingsWindow",
    13855: "PreferenceSettingsWindow",
    13856: "GraphViewMinimapWindow",
    13857: "GraphViewBlackboardWindow",
    13900: "AnimationWindowKeySelection",
    13901: "AnimationWindowSelectionItem",
    13902: "GameObjectSelectionItem",
    13903: "AnimationClipSelectionItem",
    13904: "CurveEditorSelection",
    13951: "ShortcutManagerWindow",
    13952: "PackageManifestImporterEditor",
    13958: "PackageManifestImporterEditor/PackageManifestState",
    13953: "PackageManagerWindow",
    13954: "EditorSnapSettingsData",
    13955: "ModeDescriptor",
    13956: "UIElementsDebugger",
    13957: "UIElementsEventsDebugger",
    13999: "Builder",
    13959: "SnapSettingsWindow",
    13960: "ProgressWindow",
    13961: "PropertyEditor",
    13962: "EditorToolbar",
    13964: "PackageManagerProjectSettings",
    13965: "EditorToolWindow",
    13966: "SceneTemplateAsset",
    13967: "SceneTemplateAssetInspectorWindow",
    13968: "UIElementsSamples",
    13969: "PanelSettingsInspector",
    13970: "DeviceInfoImporterEditor",
    13971: "DeviceInfoAssetEditor",
    13972: "DeviceInfoAsset",
    13973: "DeviceInfoImporter",
    13974: "SimulatorWindow",
    13975: "UIDocumentInspector",
    13980: "SearchDatabase",
    13981: "SearchDatabaseImporter",
    13982: "SearchQueryAsset",
    13984: "QuickSearch",
    13986: "IndexManager",
    13988: "OverlayPreset",
    13989: "OverlayPresetManager",
    13990: "ManipulationToolCustomEditor",
    13991: "SearchPickerWindow",
    13993: "GameObjectToolContextCustomEditor",
    14e3: "UndoHistoryWindow",
    14001: "ParticleSystemForceFieldInspector",
    14010: "DeviceInfoImporterEditor",
    14011: "DeviceInfoAssetEditor",
    14012: "HMIDeviceInfoAsset",
    14013: "DeviceInfoImporter",
    14014: "SimulatorWindow",
    14996: "MetaApp233BuildProfile",
    14997: "TapTapBuildProfile",
    14998: "KuaiShouBuildProfile",
    14999: "DouYinBuildProfile",
    15001: "WeChatBuildProfile",
    15002: "MiniHostBuildProfile",
    15003: "BuildProfile",
    15004: "BrowserBuildProfile",
    15101: "SingleHTMLSettings",
  },
  RS = {
    "4044085125364520688": "Icons/sv_icon_name0.png",
    "413091808455525890": "Icons/sv_icon_name1.png",
    "7285742739966276716": "Icons/sv_icon_name2.png",
    "-2763745338608398711": "Icons/sv_icon_name3.png",
    "-5739959903446492384": "Icons/sv_icon_name4.png",
    "7176646197226206351": "Icons/sv_icon_name5.png",
    "-1282333051292340922": "Icons/sv_icon_name6.png",
    "6198528111662015703": "Icons/sv_icon_name7.png",
    "6747498294819732817": "Icons/sv_icon_none.png",
    "7250588514170254948": "Icons/sv_label_0.png",
    "-964228994112308473": "Icons/sv_label_1.png",
    "419385456094870383": "Icons/sv_label_2.png",
    "3936346786652291628": "Icons/sv_label_3.png",
    "5721338939258241955": "Icons/sv_label_4.png",
    "2974397684917235467": "Icons/sv_label_5.png",
    "5132851093641282708": "Icons/sv_label_6.png",
    "-1412012063857583412": "Icons/sv_label_7.png",
    "-1852958945275035103": "Icons/sv_icon_dot0_sml.png",
    "-1072665210962886420": "Icons/sv_icon_dot1_sml.png",
    "1777224716415355536": "Icons/sv_icon_dot2_sml.png",
    "4070028476727247493": "Icons/sv_icon_dot3_sml.png",
    "-6861806574729942327": "Icons/sv_icon_dot4_sml.png",
    "2860686844604528909": "Icons/sv_icon_dot5_sml.png",
    "8487625137779298168": "Icons/sv_icon_dot6_sml.png",
    "-3783406597322001887": "Icons/sv_icon_dot7_sml.png",
    "6077879297295136865": "Icons/sv_icon_dot8_sml.png",
    "4067669608263693878": "Icons/sv_icon_dot9_sml.png",
    "-7212902865190176595": "Icons/sv_icon_dot10_sml.png",
    "2222350287466812449": "Icons/sv_icon_dot11_sml.png",
    "7137473090074043530": "Icons/sv_icon_dot12_sml.png",
    "408315542758243262": "Icons/sv_icon_dot13_sml.png",
    "-6468625602989856505": "Icons/sv_icon_dot14_sml.png",
    "-4788206278268923522": "Icons/sv_icon_dot15_sml.png",
  },
  wS = {
    "0000000000000000f000000000000000": "extra",
    "0000000000000000e000000000000000": "default",
    "0000000000000000d000000000000000": "editor",
  },
  PS = { extra: _S, default: ES, editor: RS };
function Uu(e, t) {
  let n = wS[e.toLowerCase()];
  if (!n) return;
  let i = PS[n][t] ?? t;
  return `unity://builtin/${n}/${i}`;
}
var vS = "[0-9A-Za-z+/_=-]+",
  We = "[+-]?0(?:\\.0+)?",
  xS = new RegExp(`^${We}$`),
  kS = new RegExp(`^\\{\\s*x:\\s*${We}\\s*,\\s*y:\\s*${We}\\s*,\\s*z:\\s*${We}\\s*\\}$`),
  MS = new RegExp(`^\\{\\s*x:\\s*${We}\\s*,\\s*y:\\s*${We}\\s*\\}$`),
  TS = new RegExp(`^\\{\\s*r:\\s*${We}\\s*,\\s*g:\\s*${We}\\s*,\\s*b:\\s*${We}(?:\\s*,\\s*a:\\s*[^}]+)?\\s*\\}$`),
  US = new RegExp(`^\\{\\s*r:\\s*${We}\\s*,\\s*g:\\s*${We}\\s*\\}$`),
  AS = new RegExp(`^\\{\\s*fileID:\\s*${We}\\s*\\}$`),
  OS = /^\{path:\s*""\s*\}$/,
  FS = new Set(["enabled", "m_Enabled", "m_IsActive", "minMaxState"]),
  NS = new RegExp(`\\{\\s*fileID:\\s*(-?\\d+)\\s*,\\s*guid:\\s*(${vS})\\s*,\\s*type:\\s*\\d+\\s*\\}`, "g"),
  LS =
    /\{\s*guid:\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*fileID:\s*(-?\d+))?(?:\s*,\s*script:\s*"(?:[^"\\]|\\.)*")?(?:\s*,\s*qualifiedScript:\s*"(?:[^"\\]|\\.)*")?\s*\}/g,
  DS = /\{\s*fileID:\s*(-?\d+)\s*\}/g,
  CS = /^--- !u!\d+\s+&[^\s]+(?:\s+.*)?$/,
  jS = /^(\s*m_SceneGUID:\s*)([0-9a-fA-F]{32})\s*$/gm,
  BS = "0".repeat(32),
  $S = /^(\s*(?:-\s*)?[^:\r\n]*guid[^:\r\n]*:\s*)0{32}\s*$/gim,
  GS = /\{[^{}\r\n]*\}/g,
  KS = /(?:^|[,{]\s*)guid:\s*0{32}(?=\s*(?:,|}))/i,
  YS = /(?:^|[,{]\s*)fileID:\s*([+-]?\d+)(?=\s*(?:,|}))/i,
  VS = new Map([
    ["f5f67c52d1564df4a8936ccd202a3bd8", "Packages/com.unity.ugui/UnityEngine.UI.dll"],
    ["f70555f144d8491a825f0804e09c671c", "Packages/com.unity.ugui/Standalone/UnityEngine.UI.dll"],
    ["80a3616ca19596e4da0f10f14d241e9f", "Packages/com.unity.ugui/Editor/UnityEditor.UI.dll"],
  ]);
function Au(e) {
  return e.startsWith("0000000000000000");
}
function WS(e) {
  return VS.get(e.toLowerCase());
}
var qS = /^(\s{2})([A-Za-z0-9_]+Module):\s*$/,
  zS = new Set(["m_IndexBuffer", "m_CompressedMesh", "m_BakedConvexCollisionMesh", "m_BakedTriangleCollisionMesh"]);
function Pn(e) {
  return e ? e.replace(/\\/g, "\\\\").replace(/"/g, '\\"') : "";
}
function mi(e) {
  return e.trim() === "";
}
function HS(e) {
  let t = e.charCodeAt(0);
  return (
    (t >= 48 && t <= 57) ||
    (t >= 65 && t <= 90) ||
    (t >= 97 && t <= 122) ||
    e === "_" ||
    e === "." ||
    e === "$" ||
    e === "-"
  );
}
function vn(e) {
  let t = 0;
  for (; t < e.length && mi(e[t]);) t += 1;
  let n = t;
  if (e[t] === "-") {
    for (t += 1; t < e.length && mi(e[t]);) t += 1;
    e[t] === ":" && (t = n);
  }
  let i = t;
  for (; t < e.length && HS(e[t]);) t += 1;
  if (t === i || e[t] !== ":") return null;
  let r = e.slice(i, t);
  for (t += 1; t < e.length && mi(e[t]);) t += 1;
  let s = t,
    o = e.length;
  for (; o > s && mi(e[o - 1]);) o -= 1;
  return { key: r, value: e.slice(s, o) };
}
function Ou(e, t) {
  for (let n of e.split(/\r\n|\n|\r/)) {
    let i = vn(n);
    if (i) return i.key === t && i.value === "";
  }
  return !1;
}
function JS(e) {
  if (e === "{}") return !0;
  let t = 1;
  for (; t < e.length && mi(e[t]);) t += 1;
  return e.startsWith("x:", t)
    ? MS.test(e) || kS.test(e)
    : e.startsWith("r:", t)
      ? US.test(e) || TS.test(e)
      : e.startsWith("fileID:", t)
        ? AS.test(e)
        : e.startsWith("path:", t)
          ? OS.test(e)
          : !1;
}
function XS(e) {
  let t = vn(e);
  if (!t || FS.has(t.key)) return !1;
  if (t.key === "serializedVersion") return t.value.length > 0;
  switch (t.value[0]) {
    case "[":
      return t.value === "[]";
    case "{":
      return JS(t.value);
    case "+":
    case "-":
    case "0":
      return xS.test(t.value);
    default:
      return !1;
  }
}
function QS(e) {
  let t = new Set(),
    n = [],
    i = () => {
      let r = n.pop();
      if (!r) return;
      if (!r.hasContent) {
        t.add(r.index);
        return;
      }
      let s = n[n.length - 1];
      s && (s.hasContent = !0);
    };
  for (let r = 0; r < e.length; r += 1) {
    let s = e[r] ?? "";
    if (!s.trim()) continue;
    let o = xn(s),
      a = /^\s*-\s+/.test(s);
    for (; n.length > 0 && (o < n[n.length - 1].indent || (o === n[n.length - 1].indent && !a));) i();
    let l = vn(s);
    if (o > 0 && l !== null && l.value === "") {
      n.push({ index: r, indent: o, hasContent: !1 });
      continue;
    }
    for (let d of n) d.hasContent = !0;
  }
  for (; n.length > 0;) i();
  return { lines: e.filter((r, s) => !t.has(s)), removedLineCount: t.size };
}
function ZS(e) {
  return CS.test(e);
}
function e_(e) {
  if (!e || !e.trim()) return { text: "", removedLineCount: 0 };
  let t = e.split(/\r\n|\n|\r/),
    n = [],
    i = 0;
  for (let s of t) XS(s) ? (i += 1) : n.push(s);
  let r = QS(n);
  return (
    (i += r.removedLineCount),
    {
      text: r.lines.join(`
`),
      removedLineCount: i,
    }
  );
}
function t_(e) {
  if (!e || !e.trim()) return { text: "", removedLineCount: 0 };
  let t = e.split(/\r\n|\n|\r/),
    n = 0;
  return {
    text: t.filter((r) => {
      let s = ZS(r);
      return (s && (n += 1), !s);
    }).join(`
`),
    removedLineCount: n,
  };
}
function xn(e) {
  return e.match(/^\s*/)?.[0].length ?? 0;
}
function n_(e) {
  if (!e.includes("Mesh:") && !e.includes("Texture2D:")) return e;
  let t = e.split(/\r\n|\n|\r/),
    n = t.findIndex((o) => vn(o)),
    i = n < 0 ? null : vn(t[n]);
  if (!i || i.value !== "" || (i.key !== "Mesh" && i.key !== "Texture2D")) return e;
  let r = t.slice(0, n + 1),
    s = [{ key: i.key, indent: xn(t[n]) }];
  for (let o = n + 1; o < t.length; o += 1) {
    let a = t[o] ?? "",
      l = vn(a);
    if (!l) {
      r.push(a);
      continue;
    }
    let c = xn(a);
    for (; s.length > 0 && c <= s[s.length - 1].indent;) s.pop();
    let d = s[s.length - 1];
    if (
      (s.length === 1 &&
        ((i.key === "Mesh" && zS.has(l.key)) || (i.key === "Texture2D" && l.key === "_typelessdata"))) ||
      (i.key === "Mesh" && l.key === "_typelessdata" && d?.key === "m_VertexData" && s[s.length - 2]?.key === "Mesh")
    ) {
      for (; o + 1 < t.length && (!t[o + 1].trim() || xn(t[o + 1]) > c);) o += 1;
      continue;
    }
    (r.push(a), l.value === "" && s.push({ key: l.key, indent: c }));
  }
  return r.join(`
`);
}
function i_(e) {
  if (!Ou(e, "ParticleSystem")) return { yaml: e, omittedLineCount: 0 };
  let t = e.split(/\r\n|\n|\r/),
    n = [],
    i = 0;
  for (let r = 0; r < t.length; r += 1) {
    let s = t[r] ?? "",
      o = s.match(qS);
    if (!o) {
      n.push(s);
      continue;
    }
    let a = o[1] ?? "  ",
      l = o[2] ?? "",
      c = [s],
      d = r + 1;
    for (; d < t.length; d += 1) {
      let p = t[d] ?? "";
      if (p.trim() && xn(p) <= a.length) break;
      c.push(p);
    }
    let u = `${a}  enabled:`,
      m = c.find((p) => p.startsWith(u));
    if (!(m ? /^enabled:\s*0(?:\.0+)?\s*$/.test(m.trim()) : !1)) {
      (n.push(...c), (r = d - 1));
      continue;
    }
    ((i += c.slice(1).filter((p) => p.trim()).length), n.push(`${a}${l}: {enabled: 0} # folded defaults`), (r = d - 1));
  }
  return {
    yaml: n.join(`
`),
    omittedLineCount: i,
  };
}
function Ar(e, t, n) {
  let i = `${t}${n}:`,
    r = e.find((o) => o.startsWith(i));
  if (!r) return null;
  let s = r.slice(i.length).trim();
  return s.length > 0 ? s : null;
}
function r_(e) {
  if (!Ou(e, "ParticleSystem")) return { yaml: e, omittedLineCount: 0 };
  let t = e.split(/\r\n|\n|\r/),
    n = [],
    i = 0;
  for (let r = 0; r < t.length; r += 1) {
    let s = t[r] ?? "",
      o = s.match(/^(\s+)([A-Za-z0-9_]+):\s*$/);
    if (!o) {
      n.push(s);
      continue;
    }
    let a = o[1] ?? "",
      l = o[2] ?? "",
      c = [s],
      d = r + 1;
    for (; d < t.length; d += 1) {
      let S = t[d] ?? "";
      if (S.trim() && xn(S) <= a.length) break;
      c.push(S);
    }
    let u = `${a}  `;
    if (Ar(c, u, "minMaxState") !== "0") {
      n.push(s);
      continue;
    }
    let y = Ar(c, u, "scalar"),
      p = Ar(c, u, "maxColor"),
      g = Ar(c, u, "minColor"),
      h = y ?? p ?? g;
    if (h === null) {
      n.push(s);
      continue;
    }
    ((i += c.slice(1).filter((S) => S.trim()).length), n.push(`${a}${l}: ${h}`), (r = d - 1));
  }
  return {
    yaml: n.join(`
`),
    omittedLineCount: i,
  };
}
function Fu(e) {
  return Nu(e).text;
}
function Nu(e) {
  if (!e || !e.trim()) return { text: "", rewrittenCount: 0 };
  if (!e.includes("guid:")) return { text: e, rewrittenCount: 0 };
  let t = 0;
  return {
    text: e.replace(NS, (i, r, s) => {
      t += 1;
      let o = Pn(s);
      return Au(s) ? `{guid: "${o}", fileID: ${r}}` : `{guid: "${o}"}`;
    }),
    rewrittenCount: t,
  };
}
function Zo(e, t) {
  return !e || !e.trim()
    ? ""
    : e.includes("{guid:")
      ? e.replace(LS, (n, i, r) => {
          let s = s_(i),
            o = WS(s);
          if (o) return `{path: "${Pn(o)}"}`;
          if (Au(s)) {
            if (r !== void 0) {
              let l = Uu(s, r);
              if (l) return `{path: "${Pn(l)}"}`;
            }
            return '{path: "unity://builtin", status: "builtin"}';
          }
          let a = t.get(s);
          return a === void 0 ? '{path: "", status: "missing"}' : `{path: "${Pn(a)}"}`;
        })
      : e;
}
function s_(e) {
  return e.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}
function o_(e, t) {
  if (!e.includes("fileID:")) return { text: e, rewrittenCount: 0 };
  let n = 0;
  return {
    text: e.replace(DS, (r, s) => {
      let o = Number.parseInt(s, 10);
      if (Number.isNaN(o)) return r;
      if (o === 0) return ((n += 1), '{path: ""}');
      let a = t.get(s);
      return a === void 0 ? r : ((n += 1), `{path: "${Pn(a)}"}`);
    }),
    rewrittenCount: n,
  };
}
function a_(e) {
  return !e.toLowerCase().includes("guid") || !e.includes(BS)
    ? e
    : e
        .replace($S, (n, i) => `${i}{path: ""}`)
        .replace(GS, (n) => {
          if (!KS.test(n)) return n;
          let i = YS.exec(n)?.[1];
          return i === void 0 || /^[+-]?0+$/.test(i) ? '{path: ""}' : n;
        });
}
function l_(e) {
  return e.includes("m_SceneGUID:") ? e.replace(jS, (t, n, i) => `${n}{guid: "${Pn(i)}"}`) : e;
}
function Lu(e, t) {
  if (!e || !e.trim()) return { text: "", stats: c_() };
  let n = n_(e),
    i = i_(n),
    r = r_(i.yaml),
    s = a_(r.yaml),
    o = l_(s),
    a = Nu(o),
    l = o_(a.text, t.localFileIdToVfsPath),
    c = t_(l.text),
    d = e_(c.text),
    u = i.omittedLineCount + r.omittedLineCount;
  return {
    text:
      u === 0
        ? d.text
        : `${d.text}
# omitted default ParticleSystem lines: ${u}`,
    stats: {
      defaultLinesRemoved: d.removedLineCount + c.removedLineCount,
      guidRefsTokenized: a.rewrittenCount,
      localFileRefsRewritten: l.rewrittenCount,
      readCompactLinesOmitted: u,
    },
  };
}
function c_() {
  return { defaultLinesRemoved: 0, guidRefsTokenized: 0, localFileRefsRewritten: 0, readCompactLinesOmitted: 0 };
}
var d_ = /^[0-9a-fA-F]{32}$/;
function Du(e) {
  if (e.length < 16) return null;
  let t = (n) => n.toString(16).padStart(2, "0");
  return (
    t(e[3]) +
    t(e[2]) +
    t(e[1]) +
    t(e[0]) +
    t(e[5]) +
    t(e[4]) +
    t(e[7]) +
    t(e[6]) +
    t(e[8]) +
    t(e[9]) +
    t(e[10]) +
    t(e[11]) +
    t(e[13]) +
    t(e[12]) +
    t(e[15]) +
    t(e[14])
  ).toLowerCase();
}
function u_(e) {
  if (!Cu(e)) return null;
  let n = e.toLowerCase().match(/.{2}/g);
  return !n || n.length < 16
    ? null
    : n[3] +
        n[2] +
        n[1] +
        n[0] +
        n[5] +
        n[4] +
        n[7] +
        n[6] +
        n[8] +
        n[9] +
        n[10] +
        n[11] +
        n[13] +
        n[12] +
        n[15] +
        n[14];
}
function Cu(e) {
  return d_.test(e);
}
function Zt(e) {
  let t = e.trim();
  if (!t) return [];
  let n = new Set([t]);
  if (Cu(t)) {
    let i = t.toLowerCase();
    n.add(i);
    let r = u_(i);
    r && n.add(r);
    let s = Du(Buffer.from(i, "hex"));
    return (s && n.add(s), [...n]);
  }
  for (let i of f_(t)) {
    let r = Du(i);
    r && n.add(r);
  }
  return [...n];
}
function f_(e) {
  let t = [],
    n = e.includes("/") ? e.split("/") : [e];
  for (let i of n) {
    let r = i.trim();
    if (r) {
      try {
        t.push(Buffer.from(r, "base64"));
      } catch {}
      try {
        t.push(Buffer.from(r, "base64url"));
      } catch {}
    }
  }
  try {
    t.push(Buffer.from(e.trim(), "base64"));
  } catch {}
  return t;
}
function ea(e) {
  let t = new Map();
  return (
    e.forEach((n) => {
      if (n.kind !== "meta" && n.guid) for (let i of Zt(n.guid)) t.set(i, n.projectRelPath);
    }),
    t
  );
}
var m_ = 1,
  ta = 26,
  na = 5,
  Nr = 256,
  y_ = 512,
  Or = class {
    constructor(t, n) {
      this.database = t;
      this.options = n;
    }
    database;
    options;
    buffer = [];
    searchCandidates = 0;
    peakBatch = 0;
    emittedCount = 0;
    add(t) {
      let n = { ...t, materializationGeneration: this.options.generation };
      (this.buffer.push(n),
        (this.emittedCount += 1),
        (n.content || n.metaContent) && (this.searchCandidates += 1),
        (this.peakBatch = Math.max(this.peakBatch, this.buffer.length)),
        this.buffer.length >= (this.options.batchRows ?? Nr) && this.flush());
    }
    flush() {
      if (this.buffer.length === 0) return;
      let t = this.buffer.splice(0);
      if (this.options.mode === "full") {
        ju(this.database, t);
        return;
      }
      let n = [],
        i = [],
        r = ae(
          this.database,
          "SELECT id FROM vfs_entries WHERE id IN (",
          t.map((o) => o.id),
          ")",
        ),
        s = new Set(r.map((o) => o.id));
      for (let o of t) (s.has(o.id) ? n : i).push(o);
      (g_(this.database, n), ju(this.database, i));
    }
    get searchCandidateCount() {
      return this.searchCandidates;
    }
    get peakBatchRows() {
      return this.peakBatch;
    }
  },
  Fr = class {
    constructor(t, n = y_, i) {
      this.database = t;
      this.batchRows = n;
      this.beforeFlush = i;
    }
    database;
    batchRows;
    beforeFlush;
    buffer = new Map();
    peakBatch = 0;
    emittedCount = 0;
    insertedCount = 0;
    duplicateCount = 0;
    missingEndpointCount = 0;
    add(t) {
      this.emittedCount += 1;
      let n = h_(t);
      if (this.buffer.has(n)) {
        this.duplicateCount += 1;
        return;
      }
      (this.buffer.set(n, t),
        (this.peakBatch = Math.max(this.peakBatch, this.buffer.size)),
        this.buffer.size >= this.batchRows && this.flush());
    }
    recordMissingEndpoint() {
      this.missingEndpointCount += 1;
    }
    flush() {
      if (this.buffer.size === 0) return;
      this.beforeFlush?.();
      let t = [...this.buffer.values()];
      this.buffer.clear();
      let n = p_(this.database, t);
      ((this.insertedCount += n), (this.duplicateCount += t.length - n));
    }
    get peakBatchRows() {
      return this.peakBatch;
    }
  };
function ju(e, t) {
  if (t.length === 0) return;
  let n = Jt(ta),
    i = `INSERT INTO vfs_entries (
      id,
      project_id,
      entry_type,
      entry_kind,
      file_family,
      vfs_path,
      parent_vfs_path,
      host_file_id,
      source_file_id,
      source_symbol_id,
      source_entity_id,
      display_name,
      child_order,
      content,
      meta_content,
      line_start,
      line_end,
      size_bytes,
      target_vfs_path,
      projection_kind,
      source_vfs_path,
      source_owner_vfs_path,
      instance_root_vfs_path,
      vfs_logical_key,
      source_logical_key,
      materialization_generation
    ) VALUES `,
    r = t.length >= n ? e.prepare(`${i}${Ze(n, ta)}`) : null;
  for (let s of Pe(t, n))
    (s.length === n ? r : e.prepare(`${i}${Ze(s.length, ta)}`)).run(
      ...s.flatMap((a) => {
        let l = yi(a.content),
          c = yi(a.metaContent);
        return [
          a.id,
          m_,
          a.entryType,
          a.entryKind,
          a.fileFamily,
          a.vfsPath,
          a.parentVfsPath,
          a.hostFileId,
          a.sourceFileId,
          a.sourceSymbolId,
          a.sourceEntityId,
          a.displayName,
          a.childOrder ?? 2e9,
          l,
          c,
          a.lineStart,
          a.lineEnd,
          a.sizeBytes,
          a.targetVfsPath,
          a.projectionKind,
          a.sourceVfsPath,
          a.sourceOwnerVfsPath,
          a.instanceRootVfsPath,
          a.vfsLogicalKey,
          a.sourceLogicalKey,
          a.materializationGeneration ?? 0,
        ];
      }),
    );
}
function g_(e, t) {
  if (t.length === 0) return;
  let n = e.prepare(`UPDATE vfs_entries
     SET entry_type = ?,
         entry_kind = ?,
         file_family = ?,
         vfs_path = ?,
         parent_vfs_path = ?,
         host_file_id = ?,
         source_file_id = ?,
         source_symbol_id = ?,
         source_entity_id = ?,
         display_name = ?,
         child_order = ?,
         content = ?,
         meta_content = ?,
         line_start = ?,
         line_end = ?,
         size_bytes = ?,
         target_vfs_path = ?,
         projection_kind = ?,
         source_vfs_path = ?,
         source_owner_vfs_path = ?,
         instance_root_vfs_path = ?,
         vfs_logical_key = ?,
         source_logical_key = ?,
         materialization_generation = ?
     WHERE id = ?`);
  for (let i of t) {
    let r = yi(i.content),
      s = yi(i.metaContent);
    n.run(
      i.entryType,
      i.entryKind,
      i.fileFamily,
      i.vfsPath,
      i.parentVfsPath,
      i.hostFileId,
      i.sourceFileId,
      i.sourceSymbolId,
      i.sourceEntityId,
      i.displayName,
      i.childOrder ?? 2e9,
      r,
      s,
      i.lineStart,
      i.lineEnd,
      i.sizeBytes,
      i.targetVfsPath,
      i.projectionKind,
      i.sourceVfsPath,
      i.sourceOwnerVfsPath,
      i.instanceRootVfsPath,
      i.vfsLogicalKey,
      i.sourceLogicalKey,
      i.materializationGeneration ?? 0,
      i.id,
    );
  }
}
function Bu(e, t) {
  if (t.length === 0) return;
  let n = e.prepare(`UPDATE vfs_entries
     SET content = ?,
         size_bytes = ?
     WHERE id = ?`);
  for (let i of t) n.run(yi(i.content), i.sizeBytes, i.id);
}
function p_(e, t) {
  if (t.length === 0) return 0;
  let n = Jt(na),
    i = `INSERT OR IGNORE INTO vfs_edges (
      id,
      from_entry_id,
      to_entry_id,
      edge_kind,
      edge_subkind
    ) VALUES `,
    r = t.length >= n ? e.prepare(`${i}${Ze(n, na)}`) : null,
    s = 0;
  for (let o of Pe(t, n)) {
    let l = (o.length === n ? r : e.prepare(`${i}${Ze(o.length, na)}`)).run(
      ...o.flatMap((c) => [c.id, c.fromEntryId, c.toEntryId, c.edgeKind, c.edgeSubkind ?? null]),
    );
    s += Number(l.changes);
  }
  return s;
}
function yi(e) {
  return e === null
    ? null
    : e.includes("\r")
      ? e
          .replace(
            /\r\n/g,
            `
`,
          )
          .replace(
            /\r/g,
            `
`,
          )
      : e;
}
function h_(e) {
  return `${e.fromEntryId}:${e.toEntryId}:${e.edgeKind}:${e.edgeSubkind ?? ""}`;
}
import I_ from "node:path";
function Lr(e, t) {
  if (t === "project-settings") return "project_settings";
  if (t === "scene") return "scene";
  if (t === "prefab") return "prefab";
  let n = Ht(e);
  if (n) return n.assetKind;
  let i = I_.posix.extname(e).toLowerCase();
  return i === ".mat" ? "material" : i === ".mixer" ? "audio_mixer" : "yaml-asset";
}
var b_ = ["m_Name", "templateName", "description", "badge", "addToDefaults"],
  S_ = ["templateScene", "templatePipeline"];
function Ku(e) {
  let t = e.split(/\r?\n/),
    n = __(t);
  if (!n) return [];
  let i = R_(t, n.startLine, n.endLine),
    r = [],
    s = Gu(t, i, b_);
  s.length > 0 && r.push(ia(t, "Details", "scene_template_details", "details", s));
  let o = E_(t, n.startLine),
    a = i.get("preview");
  o
    ? r.push($u("Thumbnail", "scene_template_thumbnail", "thumbnail", t, o.startLine, o.endLine))
    : a !== void 0 && r.push(ia(t, "Thumbnail", "scene_template_thumbnail", "thumbnail", [a]));
  let l = Gu(t, i, S_);
  l.length > 0 && r.push(ia(t, "SceneTemplatePipeline", "scene_template_pipeline", "scene_template_pipeline", l));
  let c = i.get("dependencies");
  if (c !== void 0) {
    let d = w_(t, c, n.endLine, i);
    r.push($u("Dependencies", "scene_template_dependencies", "dependencies", t, c, d));
  }
  return r;
}
function ia(e, t, n, i, r) {
  let s = Yu(
    r.map((o) => e[o - 1] ?? "").join(`
`),
  );
  return { name: t, entityKind: n, localKey: i, lineStart: Math.min(...r), lineEnd: Math.max(...r), content: s };
}
function $u(e, t, n, i, r, s) {
  let o = Yu(
    i.slice(r - 1, s).join(`
`),
  );
  return { name: e, entityKind: t, localKey: n, lineStart: r, lineEnd: s, content: o };
}
function __(e) {
  let t = -1;
  for (let i = 0; i < e.length; i += 1)
    if (e[i]?.startsWith("--- !u!114")) {
      t = i;
      break;
    }
  if (t < 0) return null;
  let n = e.length;
  for (let i = t + 1; i < e.length; i += 1)
    if (e[i]?.startsWith("--- ")) {
      n = i;
      break;
    }
  return { startLine: t + 1, endLine: n };
}
function E_(e, t) {
  let n = -1;
  for (let r = 0; r < e.length && !(r + 1 >= t); r += 1)
    if (e[r]?.startsWith("--- !u!28")) {
      n = r;
      break;
    }
  if (n < 0) return null;
  let i = t - 1;
  for (let r = n + 1; r < e.length; r += 1)
    if (e[r]?.startsWith("--- ")) {
      i = r;
      break;
    }
  return { startLine: n + 1, endLine: i };
}
function R_(e, t, n) {
  let i = new Map();
  for (let r = t; r <= n; r += 1) {
    let s = e[r - 1] ?? "";
    if (!s.startsWith("  ") || s.startsWith("    ")) continue;
    let o = s.match(/^ {2}([A-Za-z0-9_]+):/);
    o && i.set(o[1], r);
  }
  return i;
}
function Gu(e, t, n) {
  return n
    .map((i) => t.get(i))
    .filter((i) => i !== void 0)
    .sort((i, r) => i - r);
}
function w_(e, t, n, i) {
  let r = [...i.entries()]
    .filter(([s, o]) => s !== "dependencies" && o > t)
    .map(([, s]) => s)
    .sort((s, o) => s - o);
  return r.length > 0 ? r[0] - 1 : n;
}
function Yu(e) {
  return e
    .split(
      `
`,
    )
    .map((t) => P_(t)).join(`
`);
}
function P_(e) {
  return e.length <= 240 ? e : `${e.slice(0, 240)} ... <truncated>`;
}
function Dr(e, t) {
  let n = t.trim().toLowerCase();
  switch (e) {
    case "scene_template_details":
      return (
        n === "m_name" ||
        n === "templatename" ||
        n === "description" ||
        n === "badge" ||
        n.endsWith(".badge") ||
        n === "addtodefaults"
      );
    case "scene_template_thumbnail":
      return n === "preview" || n.endsWith(".preview");
    case "scene_template_pipeline":
      return n.includes("templatescene") || n.includes("templatepipeline");
    case "scene_template_dependencies":
      return n.includes("dependencies");
    default:
      return !1;
  }
}
function gi(e) {
  return e.startsWith("scene_template_");
}
function tn(e, t) {
  return e?.trim() || t;
}
function sa(e) {
  let t = v_(e),
    n = new Map(),
    i = t.find((a) => x_(a)) ?? t[0] ?? null;
  for (let a of t) {
    let l = ot(a);
    l && a && typeof a == "object" && n.set(l, a);
  }
  $_(n, i);
  let r = k_(t, i, n),
    s = M_(i, n),
    o = T_(t, i, n);
  return (
    U_(o, i, n, r),
    { graphName: Z(i, ["m_Name", "name", "displayName", "m_Path"]), properties: r, settings: s, nodes: o }
  );
}
function oa(e, t) {
  let n = new Map();
  (n.set(
    `shader_graph_properties:${t}`,
    JSON.stringify(
      {
        type: "ShaderGraphProperties",
        properties: e.properties.map((i) => ({
          name: i.name,
          refName: i.refName,
          propertyType: i.propertyType,
          defaultValue: i.defaultValue,
          ...(i.objectId ? { objectId: i.objectId } : {}),
        })),
      },
      null,
      2,
    ),
  ),
    n.set(
      `shader_graph_settings:${t}`,
      JSON.stringify(
        {
          type: "ShaderGraphSettings",
          graphName: e.graphName,
          targets: e.settings.targets,
          activeOutput: e.settings.activeOutput,
          keywords: e.settings.keywords,
          precision: e.settings.precision,
        },
        null,
        2,
      ),
    ));
  for (let i of e.nodes)
    n.set(
      `shader_graph_node:${i.objectId}`,
      JSON.stringify(
        { type: i.typeName, name: i.displayName, params: i.params, inputs: i.inputs, outputs: i.outputs },
        null,
        2,
      ),
    );
  return n;
}
function Qu(e, t) {
  return oa(sa(e), t);
}
function aa(e) {
  return e === "shader_graph_properties" || e === "shader_graph_settings" || e === "shader_graph_node";
}
function v_(e) {
  let t = [],
    n = 0;
  for (; n < e.length;) {
    for (; n < e.length && /\s/.test(e[n]);) n += 1;
    if (n >= e.length) break;
    let i = n,
      r = !1,
      s = !1,
      o = 0;
    for (; n < e.length; n += 1) {
      let a = e[n];
      if (r) {
        if (s) {
          s = !1;
          continue;
        }
        if (a === "\\") {
          s = !0;
          continue;
        }
        a === '"' && (r = !1);
        continue;
      }
      if (a === '"') {
        r = !0;
        continue;
      }
      if (a === "{" || a === "[") {
        o += 1;
        continue;
      }
      if ((a === "}" || a === "]") && ((o -= 1), o === 0)) {
        ((n += 1), t.push(JSON.parse(e.slice(i, n))));
        break;
      }
    }
    if (o !== 0 || r) throw new SyntaxError("Unexpected end of JSON input");
  }
  return t;
}
function x_(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  let t = e;
  return (
    Array.isArray(t.m_Properties) ||
    Array.isArray(t.m_Nodes) ||
    Array.isArray(t.m_Edges) ||
    Array.isArray(t.m_ActiveTargets) ||
    Array.isArray(t.m_SerializedProperties) ||
    Array.isArray(t.m_SerializableNodes) ||
    Array.isArray(t.m_SerializableEdges)
  );
}
function k_(e, t, n) {
  let i = [],
    r = new Set(),
    s = (o) => {
      let a = ot(o),
        l = Z(o, ["m_Name", "m_DisplayName", "displayName", "name"]) ?? (a ? `Property@${pi(a)}` : null);
      if (!l) return;
      let c = a ?? l;
      r.has(c) ||
        (r.add(c),
        i.push({
          name: l,
          refName: Z(o, ["m_RefName", "m_DefaultReferenceName", "overrideReferenceName", "referenceName"]),
          propertyType: la(Z(o, ["m_Type", "type", "m_SerializedType"]) ?? "ShaderProperty"),
          defaultValue: o.m_Value ?? o.m_Default ?? null,
          objectId: a,
        }));
    };
  for (let o of qe(t, "m_Properties")) {
    let a = be(o);
    if (!a) continue;
    let l = ot(a),
      c = l && n.has(l) ? n.get(l) : a;
    s(c);
  }
  for (let o of qe(t, "m_SerializedProperties")) {
    let a = kn(o);
    a && s(a);
  }
  for (let o of e) {
    if (!o || typeof o != "object" || Array.isArray(o)) continue;
    let a = o,
      l = Z(a, ["m_Type", "type", "m_SerializedType"]) ?? "";
    /property/i.test(l) && s(a);
  }
  return i;
}
function M_(e, t) {
  let n = new Set();
  for (let s of qe(e, "m_ActiveTargets")) {
    let o = Zu(s, t) ?? be(s),
      a = Z(o, ["m_SerializedDescriptor", "serializedDescriptor", "m_DisplayName", "displayName", "m_Name", "name"]);
    a && n.add(a);
  }
  for (let s of t.values()) {
    let o = Z(s, ["m_Type", "type", "m_SerializedType"]) ?? "";
    if (!/target/i.test(o)) continue;
    let a = Z(s, ["m_SerializedDescriptor", "serializedDescriptor", "m_DisplayName", "displayName", "m_Name", "name"]);
    a && n.add(a);
  }
  let i = Z(e, ["m_OutputNode", "m_ActiveOutputNode", "m_ActiveOutputNodeGuidSerialized"]),
    r = en(be(e)?.m_GraphPrecision ?? be(e)?.graphPrecision ?? be(e)?.m_ConcretePrecision);
  return {
    targets: [...n],
    activeOutput: i ? tf(i, t) : null,
    keywords: [...Y_(e, "m_Keywords"), ...B_(e)],
    precision: r,
  };
}
function T_(e, t, n) {
  let i = [],
    r = new Set(),
    s = (o, a) => {
      let l = ot(o) ?? G_(o, a);
      if (r.has(l)) return;
      let c = la(Z(o, ["m_Type", "type", "m_SerializedType"]) ?? "ShaderGraphNode");
      if (zu(c)) return;
      r.add(l);
      let d = Z(o, ["m_Name", "m_Title", "title", "displayName", "m_DisplayName"]),
        u = d ? `${d}@${pi(l)}` : `${c}@${pi(l)}`;
      i.push({
        objectId: l,
        displayName: u,
        typeName: c,
        params: F_(o),
        inputs: [],
        outputs: N_(o, n),
        guidReferences: nn(o),
      });
    };
  return (
    qe(t, "m_Nodes").forEach((o, a) => {
      let l = Zu(o, n);
      if (l) {
        s(l, `root-node:${a}`);
        return;
      }
      let c = be(o);
      c && s(c, `root-node:${a}`);
    }),
    qe(t, "m_SerializableNodes").forEach((o, a) => {
      let l = kn(o);
      l && s(l, `legacy-node:${a}`);
    }),
    e.forEach((o, a) => {
      if (!o || typeof o != "object" || Array.isArray(o)) return;
      let l = o,
        c = Z(l, ["m_Type", "type", "m_SerializedType"]) ?? "";
      !c || zu(c) || s(l, `document:${a}`);
    }),
    i
  );
}
function U_(e, t, n, i) {
  let r = new Map(e.map((c) => [c.objectId, c])),
    s = A_(n, i),
    o = O_(e, n, s),
    a = new WeakSet(),
    l = (c) => {
      let d = be(c);
      if (!(!d || a.has(d))) {
        a.add(d);
        for (let u of qe(d, "m_Edges")) Wu(u, r, o, n, s);
        for (let u of qe(d, "m_SerializableEdges")) {
          let m = kn(u);
          m && Wu(m, r, o, n, s);
        }
      }
    };
  l(t);
  for (let c of n.values()) l(c);
}
function A_(e, t) {
  let n = new Map();
  t.forEach((r) => {
    r.objectId && n.set(r.objectId, r);
  });
  let i = new Map();
  return (
    e.forEach((r, s) => {
      let o = la(Z(r, ["m_Type", "type", "m_SerializedType"]) ?? "");
      if (!ef(o)) return;
      let a = ot(be(r.m_Property)) ?? Z(r, ["m_PropertyGuidSerialized", "propertyGuidSerialized"]),
        l = a ? n.get(a) : void 0,
        c = a ? e.get(a) : void 0,
        d = l?.refName ?? Z(c, ["m_DefaultReferenceName", "m_RefName", "overrideReferenceName"]),
        u = l?.name ?? Z(c, ["m_Name", "m_DisplayName"]),
        m = d ?? u ?? "Property";
      i.set(s, `${m}@${pi(s)}`);
    }),
    i
  );
}
function Vu(e, t, n, i) {
  qe(t, "m_Slots").forEach((r) => {
    let s = ot(be(r));
    if (!s) return;
    let o = n.get(s);
    if (!o) return;
    let a = en(o.m_Id);
    if (a === null) return;
    let l = Z(o, ["m_DisplayName", "displayName", "m_ShaderOutputName", "shaderOutputName"]) ?? `slot ${a}`;
    i.set(`${e}:${a}`, l);
  });
}
function O_(e, t, n) {
  let i = new Map();
  return (
    e.forEach((r) => {
      r.outputs.forEach((o) => {
        let a = o.name.match(/^slot (\d+)$/)?.[1];
        a ? i.set(`${r.objectId}:${a}`, o.name) : i.set(`${r.objectId}:${o.name}`, o.name);
      });
      let s = t.get(r.objectId);
      s && Vu(r.objectId, s, t, i);
    }),
    n.forEach((r, s) => {
      let o = t.get(s);
      (o && Vu(s, o, t, i), i.has(`${s}:0`) || i.set(`${s}:0`, "Out"));
    }),
    i
  );
}
function Wu(e, t, n, i, r) {
  let s = be(e);
  if (!s) return;
  let o = be(s.m_OutputSlot),
    a = be(s.m_InputSlot);
  if (!o || !a) return;
  let l = qu(o),
    c = qu(a),
    d = en(o.m_SlotId),
    u = en(a.m_SlotId);
  if (!l || !c) return;
  let m = Hu(l, d, t, n, i, r),
    y = Hu(c, u, t, n, i, r),
    p = t.get(c);
  if (p) {
    let h = n.get(`${c}:${u}`) ?? `slot ${u ?? "0"}`,
      S = p.inputs.find((_) => _.name === h);
    S ? (S.from = m) : p.inputs.push({ name: h, from: m });
  }
  let g = t.get(l);
  if (g) {
    let h = n.get(`${l}:${d}`) ?? `slot ${d ?? "0"}`,
      S = g.outputs.find((_) => _.name === h);
    S ? (S.to = [...(S.to ?? []), y]) : g.outputs.push({ name: h, to: [y] });
  }
}
function F_(e) {
  let t = {},
    n = new Set([
      "m_Type",
      "type",
      "m_SerializedType",
      "m_Name",
      "m_Title",
      "title",
      "displayName",
      "m_DisplayName",
      "m_ObjectId",
      "m_Id",
      "m_GuidSerialized",
      "m_SerializableSlots",
      "m_Edges",
      "m_InputSlots",
      "m_OutputSlots",
    ]);
  for (let [i, r] of Object.entries(e))
    if (!n.has(i) && r != null) {
      if (typeof r == "object" && !Array.isArray(r)) {
        let s = r;
        if ("guid" in s || "fileID" in s) {
          t[Ju(i)] = s;
          continue;
        }
      }
      (typeof r == "string" || typeof r == "number" || typeof r == "boolean" || Array.isArray(r)) && (t[Ju(i)] = r);
    }
  return t;
}
function N_(e, t) {
  let n = qe(e, "m_SerializableSlots");
  if (n.length > 0)
    return n
      .map((r, s) => {
        let o = kn(r) ?? be(r);
        if (!o) return { name: `slot ${s}` };
        let a = en(o.m_Id) ?? String(s);
        return {
          name: Z(o, ["m_DisplayName", "displayName", "m_ShaderOutputName", "shaderOutputName"]) ?? `slot ${a}`,
          to: [],
        };
      })
      .filter(Boolean);
  let i = [];
  return (
    qe(e, "m_Slots").forEach((r) => {
      let s = ot(be(r));
      if (!s) return;
      let o = t.get(s);
      if (!o) return;
      let a = o.m_SlotType;
      if (a !== 1 && a !== "1") return;
      let l = en(o.m_Id),
        c =
          Z(o, ["m_DisplayName", "displayName", "m_ShaderOutputName", "shaderOutputName"]) ?? (l ? `slot ${l}` : "Out");
      i.push({ name: c, to: [] });
    }),
    i
  );
}
function nn(e) {
  let t = [];
  return (
    ra(e, [], (n, i) => {
      if (!n || typeof n != "object" || Array.isArray(n)) return;
      let r = n,
        s = Xu(r.guid);
      s && t.push({ path: i.join("."), fileID: Xu(r.fileID), guid: s });
    }),
    t
  );
}
function Zu(e, t) {
  if (e && typeof e == "object" && !Array.isArray(e)) {
    let n = e,
      i = ot(n);
    if (i && t.has(i)) return t.get(i);
    if (D_(n) || L_(n)) return n;
  }
  return null;
}
function L_(e) {
  let t = Z(e, ["m_Type", "type", "m_SerializedType"]) ?? "";
  return /target/i.test(t) || typeof e.m_SerializedDescriptor == "string" || typeof e.serializedDescriptor == "string";
}
function D_(e) {
  return !!(Z(e, ["m_Type", "type"]) || Array.isArray(e.m_SerializableSlots) || e.m_FunctionSource || e.m_SubGraph);
}
function ot(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  let t = e,
    n = Z(t, ["m_ObjectId", "m_Id", "m_GuidSerialized", "objectId", "id"]) ?? null;
  if (n) return n;
  let i = be(t.m_Guid);
  return Z(i, ["m_GuidSerialized", "guidSerialized"]) ?? null;
}
function C_(e) {
  return ot(e);
}
function qu(e) {
  return C_(e.m_Node) ?? Z(e, ["m_NodeGUIDSerialized", "m_NodeGuidSerialized"]);
}
function kn(e) {
  let t = be(e);
  if (!t) return null;
  let n = t.JSONnodeData;
  if (typeof n != "string" || !n.trim()) return t;
  try {
    let i = JSON.parse(n),
      r = Z(t.typeInfo, ["fullName"]);
    return (r && (i.m_Type = r), i);
  } catch {
    return null;
  }
}
function j_(e) {
  return /ShaderProperty$/i.test(e);
}
function ef(e) {
  return /^PropertyNode$/i.test(e);
}
function zu(e) {
  return (
    j_(e) ||
    ef(e) ||
    /MaterialSlot$/i.test(e) ||
    /^CategoryData$/i.test(e) ||
    /^GraphData$/i.test(e) ||
    /target$/i.test(e) ||
    /UniversalTarget|HDTarget/.test(e)
  );
}
function B_(e) {
  let t = [];
  for (let n of qe(e, "m_SerializedKeywords")) {
    let i = kn(n),
      r = Z(i, ["m_Name", "m_DisplayName", "name"]);
    r && t.push(r);
  }
  return t;
}
function $_(e, t) {
  for (let n of ["m_SerializedProperties", "m_SerializableNodes", "m_SerializableEdges"])
    for (let i of qe(t, n)) {
      let r = kn(i),
        s = r ? ot(r) : null;
      r && s && !e.has(s) && e.set(s, r);
    }
}
function qe(e, t) {
  let i = be(e)?.[t];
  return Array.isArray(i) ? i : [];
}
function be(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? null : e;
}
function pi(e) {
  return e.replace(/-/g, "").slice(0, 8);
}
function G_(e, t) {
  let n = Z(e, ["m_Type", "type", "m_SerializedType"]) ?? "ShaderGraphNode",
    i = Z(e, ["m_Name", "m_Title", "title", "displayName", "m_DisplayName"]) ?? "",
    r = `${n}|${i}|${t}`,
    s = 0;
  for (let a = 0; a < r.length; a += 1) s = (s * 31 + r.charCodeAt(a)) | 0;
  let o = (Math.abs(s) >>> 0).toString(16).padStart(8, "0").slice(-8);
  return `${o}-0000-4000-8000-${o}00000000`.slice(0, 36);
}
function tf(e, t) {
  let n = t.get(e);
  return `${(n ? Z(n, ["m_Name", "name", "m_DisplayName"]) : null) ?? "Node"}@${pi(e)}`;
}
function K_(e, t, n, i) {
  let r = t.get(e);
  if (r) return r.displayName;
  let s = i.get(e);
  return s || tf(e, n);
}
function Hu(e, t, n, i, r, s) {
  let o = K_(e, n, r, s),
    a = (t ? i.get(`${e}:${t}`) : null) ?? (t ? `slot ${t}` : "Out");
  return `${o}.${a}`;
}
function Ju(e) {
  return e.startsWith("m_") ? e.slice(2) : e;
}
function la(e) {
  return (
    e
      .split(/[.$,+]/)
      .map((t) => t.trim())
      .filter(Boolean)
      .at(-1) ?? e
  );
}
function Z(e, t) {
  let n = be(e);
  if (!n) return null;
  for (let i of t) {
    let r = n[i];
    if (typeof r == "string" && r.trim()) return r.trim();
  }
  return null;
}
function Y_(e, t) {
  let i = be(e)?.[t];
  return Array.isArray(i) ? i.map((r) => (typeof r == "string" ? r.trim() : "")).filter(Boolean) : [];
}
function en(e) {
  return typeof e == "string" ? e.trim() || null : typeof e == "number" ? String(e) : null;
}
function Xu(e) {
  return en(e);
}
function ra(e, t, n) {
  if ((n(e, t), Array.isArray(e))) {
    e.forEach((i, r) => ra(i, [...t, String(r)], n));
    return;
  }
  e && typeof e == "object" && Object.entries(e).forEach(([i, r]) => ra(r, [...t, i], n));
}
function V_(e) {
  return e.startsWith("0000000000000000");
}
function nf(e) {
  if (typeof e != "string") return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
function W_(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : nf(e.guid) !== null;
}
function q_(e, t) {
  let n = nf(e.guid);
  if (!n) return { path: "", status: "missing" };
  let i = t.get(n);
  return i !== void 0
    ? { path: i }
    : V_(n)
      ? { path: "unity://builtin", status: "builtin" }
      : { path: "", status: "missing" };
}
function hi(e, t) {
  if (Array.isArray(e)) return e.map((n) => hi(n, t));
  if (W_(e)) return q_(e, t);
  if (e && typeof e == "object") {
    let n = e,
      i = {};
    for (let [r, s] of Object.entries(n)) i[r] = hi(s, t);
    return i;
  }
  return e;
}
function ca(e) {
  return e === "shader_graph_properties" || e === "shader_graph_settings" || e === "shader_graph_node";
}
function rf(e, t) {
  let n = e.trim();
  if (!n) return e;
  let i;
  try {
    i = JSON.parse(n);
  } catch {
    return e;
  }
  return JSON.stringify(hi(i, t), null, 2);
}
var z_ = "7d4c867f6b72b714dbb5fd1780afe208",
  H_ = "d01270efd3285ea4a9d6c555cb0a8027",
  sf = {
    "73a13919d81fb7444849bae8b5c812a2": "VFXSpawnerContext",
    "9dfea48843f53fc438eabc12a3a30abc": "VFXInitializeContext",
    "2dc095764ededfa4bb32fa602511ea4b": "VFXUpdateContext",
    a0b9e6b9139e58d4c957ec54595da7d3: "VFXOutputContext",
    "5e382412bb691334bb79457a6c127924": "ConstantSpawnRate",
    d16c6aeaef944094b9a1633041804207: "Orient",
    a971fa2e110a0ac42ac1d8dae408704b: "SetSize",
    "01ec2c1930009b04ea08905b47262415": "SetAttribute",
    "7d4c867f6b72b714dbb5fd1780afe208": "VFXGraph",
  },
  lf = {
    "73a13919d81fb7444849bae8b5c812a2": "Spawn system",
    "9dfea48843f53fc438eabc12a3a30abc": "Initialize Particle",
    "2dc095764ededfa4bb32fa602511ea4b": "Particle Update",
    a0b9e6b9139e58d4c957ec54595da7d3: "Output Particle",
    "5e382412bb691334bb79457a6c127924": "Spawn Rate",
    d16c6aeaef944094b9a1633041804207: "Orient Particle",
    a971fa2e110a0ac42ac1d8dae408704b: "Set Size",
  },
  J_ = [
    "m_Disabled",
    "channels",
    "Composition",
    "AlphaComposition",
    "Source",
    "Random",
    "SampleMode",
    "Mode",
    "ColorMode",
    "repeat",
    "spawnMode",
    "delayMode",
    "blendMode",
    "cullMode",
    "zWriteMode",
    "zTestMode",
    "useAlphaClipping",
    "primitiveType",
    "useSoftParticle",
    "sort",
    "sortMode",
    "axes",
    "mode",
    "loopDuration",
    "loopCount",
    "delayBeforeLoop",
    "delayAfterLoop",
    "integration",
    "angularIntegration",
    "ageParticles",
    "reapParticles",
    "skipZeroDeltaUpdate",
    "colorMapping",
    "uvMode",
    "flipbookLayout",
  ],
  X_ = new Set([
    "m_ObjectHideFlags",
    "m_CorrespondingSourceObject",
    "m_PrefabInstance",
    "m_PrefabAsset",
    "m_GameObject",
    "m_Enabled",
    "m_EditorHideFlags",
    "m_Script",
    "m_Name",
    "m_EditorClassIdentifier",
    "m_UIIgnoredErrors",
    "m_Parent",
    "m_Children",
    "m_UIPosition",
    "m_UICollapsed",
    "m_UISuperCollapsed",
    "m_InputSlots",
    "m_OutputSlots",
    "m_Label",
    "m_Data",
    "m_InputFlowSlot",
    "m_OutputFlowSlot",
    "m_ActivationSlot",
    "m_MasterSlot",
    "m_Property",
    "m_MasterData",
    "m_Owners",
    "attribute",
    "m_Attribute",
    "m_SubOutputs",
    "shaderGraph",
    "materialSettings",
    "m_UIInfos",
    "m_ParameterInfo",
    "m_GraphVersion",
    "m_ResourceVersion",
    "m_SubgraphDependencies",
    "m_ImportDependencies",
    "m_CategoryPath",
    "groupInfos",
    "stickyNoteInfos",
    "categories",
    "uiBounds",
  ]);
function cf(e, t) {
  let n = new Map(),
    i = new Map();
  for (let p of e) {
    let g = t.read(p);
    !g ||
      typeof g != "object" ||
      Array.isArray(g) ||
      (n.set(p.localIdentifier, g), i.set(p.localIdentifier, p.scriptGuid?.trim().toLowerCase() ?? null));
  }
  let r = Q_(n, i);
  if (!r) return null;
  let s = n.get(r),
    o = Ce(s, ["m_Name", "name"]) ?? null,
    a = hf(s, ["m_GraphVersion"]),
    l = new Set(),
    c = new Set();
  for (let [p, g] of n.entries())
    if (!(p === r || Z_(g, i.get(p)))) {
      if (fa(g)) {
        l.add(p);
        continue;
      }
      eE(g, n, l) && c.add(p);
    }
  let d = new Map();
  for (let p of l) {
    let g = n.get(p),
      h = i.get(p),
      S = Ce(g, ["m_Label", "label"]),
      _ = ua(g, h),
      E = gf(S, _, h, g, p),
      b = of(g, "m_InputFlowSlot", n, d, l, i),
      R = of(g, "m_OutputFlowSlot", n, d, l, i),
      v = [...c].filter((x) => Mn(n.get(x), "m_Parent") === p),
      T = af(g, n);
    d.set(p, {
      localId: p,
      displayName: E,
      label: S,
      typeName: _,
      flowInputs: b,
      flowOutputs: R,
      blockLocalIds: v,
      params: T,
      guidReferences: nn(T),
    });
  }
  let u = [];
  for (let p of c) {
    let g = n.get(p),
      h = i.get(p),
      S = Ce(g, ["attribute", "m_Attribute"]),
      _ = ua(g, h),
      E =
        Mn(g, "m_Parent") ??
        [...l].find((v) => {
          let T = n.get(v);
          return cE(T, "m_Children").includes(p);
        }) ??
        "",
      b = aE(S, g, _, h, p),
      R = af(g, n);
    u.push({
      localId: p,
      displayName: b,
      attribute: S,
      typeName: _,
      parentContextLocalId: E,
      params: R,
      guidReferences: nn(R),
    });
  }
  let m = tE(s),
    y = nE(s);
  return {
    graphName: o,
    graphVersion: a,
    properties: m,
    subgraphDependencies: y,
    contexts: [...d.values()],
    blocks: u,
  };
}
function df(e, t) {
  let n = new Map();
  n.set(
    `vfx_graph_properties:${t}`,
    JSON.stringify(
      { type: "Properties", graphName: e.graphName, graphVersion: e.graphVersion, properties: e.properties },
      null,
      2,
    ),
  );
  for (let i of e.contexts)
    n.set(
      `vfx_graph_context:${i.localId}`,
      JSON.stringify(
        {
          type: i.typeName,
          name: i.displayName,
          label: i.label,
          flowInputs: i.flowInputs,
          flowOutputs: i.flowOutputs,
          blocks: i.blockLocalIds.map((r) => e.blocks.find((o) => o.localId === r)?.displayName ?? r),
          params: i.params,
        },
        null,
        2,
      ),
    );
  for (let i of e.blocks)
    n.set(
      `vfx_graph_block:${i.localId}`,
      JSON.stringify(
        {
          type: i.typeName,
          name: i.displayName,
          attribute: i.attribute,
          parentContext: e.contexts.find((r) => r.localId === i.parentContextLocalId)?.displayName,
          params: i.params,
        },
        null,
        2,
      ),
    );
  return n;
}
function uf(e) {
  return (
    e === "visual_effect_graph_properties" ||
    e === "visual_effect_graph_property" ||
    e === "visual_effect_graph_context" ||
    e === "visual_effect_graph_block"
  );
}
function Q_(e, t) {
  for (let [n, i] of e.entries())
    if (
      (i.m_GraphVersion !== void 0 || t.get(n) === z_) &&
      (Array.isArray(i.m_Children) || i.m_ParameterInfo !== void 0)
    )
      return n;
  for (let [n, i] of e.entries()) if (Array.isArray(i.m_Children) && i.m_UIInfos !== void 0) return n;
  return null;
}
function Z_(e, t) {
  return t === H_ || Ce(e, ["m_Name", "name"]) === "VFXUI"
    ? !0
    : e.m_Owners !== void 0 && e.m_Data !== void 0
      ? !fa(e) && !ff(e)
      : !!mf(e);
}
function fa(e) {
  return e.m_InputFlowSlot !== void 0 || e.m_OutputFlowSlot !== void 0 || (e.m_Label !== void 0 && e.m_Data !== void 0);
}
function ff(e) {
  return (
    e.attribute !== void 0 ||
    e.m_Attribute !== void 0 ||
    e.m_ActivationSlot !== void 0 ||
    (Array.isArray(e.m_InputSlots) && e.m_Parent !== void 0)
  );
}
function eE(e, t, n) {
  if (!ff(e) || mf(e)) return !1;
  let i = Mn(e, "m_Parent");
  if (i && n.has(i)) return !0;
  if (!i) return !1;
  let r = t.get(i);
  return r ? fa(r) : !1;
}
function mf(e) {
  return e.m_MasterSlot === void 0 || e.m_Label !== void 0 || e.attribute !== void 0
    ? !1
    : e.m_Property !== void 0 || e.m_InputSlots === void 0;
}
function tE(e) {
  let t = e.m_ParameterInfo;
  return Array.isArray(t)
    ? t
        .map((n) => De(n))
        .filter((n) => n !== null)
        .map((n) => ({
          name: Ce(n, ["name", "m_Name"]) ?? "Property",
          path: Ce(n, ["path", "m_Path"]),
          realType: Ce(n, ["realType", "m_RealType"]),
          sheetType: Ce(n, ["sheetType", "m_SheetType"]),
          defaultValue: sE(n),
        }))
    : [];
}
function nE(e) {
  let t = e.m_SubgraphDependencies;
  return Array.isArray(t)
    ? t
        .map((n) => De(n))
        .filter((n) => n !== null)
        .map((n) => ({ asset: n, guidReferences: nn(n) }))
    : [];
}
function of(e, t, n, i, r, s) {
  let o = e[t];
  if (!Array.isArray(o)) return [];
  let a = [];
  for (let l of o) {
    let c = De(l);
    if (!c) continue;
    let d = c.link ?? c.m_Link;
    if (Array.isArray(d))
      for (let u of d) {
        let m = De(u);
        if (!m) continue;
        let y = De(m.context ?? m.m_Context),
          p = y ? (Mn(y, "fileID") ?? Mn(y, "m_FileID")) : null;
        if (!p || !r.has(p)) continue;
        let g = hf(m, ["slotIndex", "m_SlotIndex"]) ?? 0;
        a.push(iE(p, g, n, i, s));
      }
  }
  return a;
}
function iE(e, t, n, i, r) {
  let s = i.get(e);
  if (s) return `${s.displayName}.slot${t}`;
  let o = n.get(e),
    a = r.get(e),
    l = o ? Ce(o, ["m_Label", "label"]) : null,
    c = o ? ua(o, a) : "Context";
  return `${o ? gf(l, c, a, o, e) : `Context@${ma(e)}`}.slot${t}`;
}
function af(e, t) {
  let n = {};
  for (let r of J_) e[r] !== void 0 && (n[r] = e[r]);
  for (let [r, s] of Object.entries(e)) X_.has(r) || r in n || (yf(s) && (n[r] = s));
  let i = e.m_InputSlots;
  if (Array.isArray(i))
    for (let r of i) {
      let s = De(r);
      if (!s) continue;
      let o = Mn(s, "m_Link"),
        a = o ? t.get(o) : null,
        l = De(a ? (a.m_Property ?? a.m_MasterSlot) : s.m_Property),
        c = (l ? Ce(l, ["name", "m_Name"]) : null) ?? Ce(s, ["m_Name", "name"]) ?? "input",
        d = De(a?.m_MasterData)?.m_Value ?? De(s.m_MasterData)?.m_Value ?? s.m_Value;
      d !== void 0 && (n[c] = da(d));
    }
  return n;
}
function yf(e) {
  if (e === null || typeof e == "string" || typeof e == "number" || typeof e == "boolean") return !0;
  if (Array.isArray(e)) return e.every((t) => yf(t));
  if (e && typeof e == "object") {
    let t = e;
    return rE(t.guid) !== null || t.fileID !== void 0 || t.m_FileID !== void 0;
  }
  return !1;
}
function rE(e) {
  if (typeof e != "string") return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
function sE(e) {
  let t = e.defaultValue ?? e.m_DefaultValue;
  if (t === void 0) return null;
  let n = De(t);
  if (!n) return t;
  let i = n.m_SerializableObject;
  if (typeof i == "string") {
    let r = da(i);
    if (r && typeof r == "object" && !Array.isArray(r)) {
      let s = r;
      if (s.obj !== void 0) return da(s.obj);
    }
    return r;
  }
  return t;
}
function gf(e, t, n, i, r) {
  return `${e ?? (n ? lf[n] : null) ?? oE(i, t)}@${ma(r)}`;
}
function oE(e, t) {
  return e.ageParticles !== void 0 || e.reapParticles !== void 0
    ? "Particle Update"
    : e.blendMode !== void 0 || e.primitiveType !== void 0
      ? "Output Particle"
      : e.loopDuration !== void 0 && e.m_OutputFlowSlot !== void 0 && e.m_InputFlowSlot !== void 0
        ? "Spawn system"
        : e.m_InputFlowSlot !== void 0 &&
            e.m_OutputFlowSlot !== void 0 &&
            Array.isArray(e.m_Children) &&
            e.m_Children.length > 0
          ? "Initialize Particle"
          : pf(t) || "Context";
}
function aE(e, t, n, i, r) {
  let s = Ce(t, ["m_Name", "name"]),
    o = i ? lf[i] : null;
  return `${e ?? s ?? o ?? lE(n) ?? "Block"}@${ma(r)}`;
}
function da(e) {
  if (typeof e != "string") return e;
  let t = e.trim();
  return !t.startsWith("{") && !t.startsWith("[") ? e : (dE(t) ?? e);
}
function ua(e, t) {
  let n = t?.trim().toLowerCase();
  if (n && sf[n]) return sf[n];
  let i = Ce(e, ["m_EditorClassIdentifier", "editorClassIdentifier"]);
  if (i) {
    let o = (i.split(":").pop()?.split(".") ?? []).at(-1);
    if (o) return o;
  }
  let r = Ce(e, ["m_Type", "type"]);
  return r ? (r.split(".").at(-1) ?? r) : "VFXNode";
}
function pf(e) {
  return e
    .replace(/^VFX/i, "")
    .replace(/Context$/i, "")
    .replace(/Initialize$/i, " Initialize")
    .trim();
}
function lE(e) {
  return /SetAttribute/i.test(e) || /Constant/i.test(e) ? null : pf(e) || null;
}
function Mn(e, t) {
  if (!e) return null;
  let n = e[t];
  if (typeof n == "string" || typeof n == "number") {
    let s = String(n).trim();
    return s.length > 0 && s !== "0" ? s : null;
  }
  let i = De(n);
  if (!i) return null;
  let r = i.fileID ?? i.m_FileID;
  if (typeof r == "string" || typeof r == "number") {
    let s = String(r).trim();
    return s.length > 0 && s !== "0" ? s : null;
  }
  return null;
}
function cE(e, t) {
  if (!e) return [];
  let n = e[t];
  return Array.isArray(n)
    ? n
        .map((i) => {
          let r = De(i);
          if (!r) return null;
          let s = r.fileID ?? r.m_FileID;
          if (typeof s == "string" || typeof s == "number") {
            let o = String(s).trim();
            return o.length > 0 && o !== "0" ? o : null;
          }
          return null;
        })
        .filter((i) => i !== null)
    : [];
}
function ma(e) {
  return e.replace(/-/g, "").slice(-8);
}
function Ce(e, t) {
  for (let n of t) {
    let i = e[n];
    if (typeof i == "string") {
      let r = i.trim();
      if (r.length > 0) return r;
    }
  }
  return null;
}
function hf(e, t) {
  for (let n of t) {
    let i = e[n];
    if (typeof i == "number" && Number.isFinite(i)) return i;
    if (typeof i == "string" && i.trim().length > 0) {
      let r = Number(i);
      if (Number.isFinite(r)) return r;
    }
  }
  return null;
}
function De(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? null : e;
}
function dE(e) {
  try {
    let t = JSON.parse(e);
    return De(t);
  } catch {
    return null;
  }
}
function ya(e) {
  return (
    e === "visual_effect_graph_properties" ||
    e === "visual_effect_graph_property" ||
    e === "visual_effect_graph_context" ||
    e === "visual_effect_graph_block"
  );
}
function If(e, t) {
  let n = e.trim();
  if (!n) return e;
  let i;
  try {
    i = JSON.parse(n);
  } catch {
    return e;
  }
  return JSON.stringify(hi(i, t), null, 2);
}
function Cr(e) {
  let t = e.trim();
  if (!t) return !1;
  let n = Number(t);
  return Number.isSafeInteger(n) && n > 0 && n % 1e5 === 0;
}
function Tn(e) {
  let t = e.match(/^guid:\s*(.+)\s*$/m),
    n = e.match(/^([A-Za-z0-9_]+Importer):\s*$/m),
    i = e.match(/^ {2}mainObjectFileID:\s*(\d+)\s*$/m);
  return {
    guid: t?.[1] ?? null,
    importerType: n?.[1] ?? null,
    mainObjectFileId: i ? Number(i[1]) : null,
    fileIdToName: ga(e),
  };
}
function ga(e) {
  let t = new Map(),
    n = e
      .replace(
        /\r\n/g,
        `
`,
      )
      .replace(
        /\r/g,
        `
`,
      ).split(`
`),
    i = null,
    r = !1;
  for (let s of n) {
    if (s === "  fileIDToRecycleName:") {
      ((i = "fileIDToRecycleName"), (r = !1));
      continue;
    }
    if (s === "  internalIDToNameTable:") {
      ((i = "internalIDToNameTable"), (r = !1));
      continue;
    }
    if (i === "fileIDToRecycleName") {
      if (/^ {2}[A-Za-z0-9_]/.test(s) && !s.startsWith("    ")) {
        i = null;
        continue;
      }
      let o = s.match(/^ {4}(-?\d+):\s*(.+)$/);
      o && t.set(o[1], o[2].trim());
      continue;
    }
    if (i === "internalIDToNameTable") {
      if (/^ {2}[A-Za-z0-9_]/.test(s) && !s.startsWith("    ")) {
        ((i = null), (r = !1));
        continue;
      }
      if (s === "  - first:") {
        r = !0;
        continue;
      }
      if (s === "  second:") {
        r = !1;
        continue;
      }
      if (r) {
        let o = s.match(/^ {6}(-?\d+):\s*(.+)$/);
        o && t.set(o[1], o[2].trim());
      }
    }
  }
  return t;
}
function bf(e) {
  return e.trim()
    ? e
        .replace(
          /\r\n/g,
          `
`,
        )
        .replace(
          /\r/g,
          `
`,
        )
        .split(
          `
`,
        )
        .filter((t) => {
          let n = t.trimStart();
          return (
            !n.startsWith("fileFormatVersion: 2") &&
            !n.startsWith("guid:") &&
            !n.startsWith("timeCreated:") &&
            !n.startsWith("licenseType: Pro")
          );
        })
        .join(
          `
`,
        )
        .trim()
    : "";
}
function Sf(e) {
  return e
    .replace(
      /\r\n/g,
      `
`,
    )
    .replace(
      /\r/g,
      `
`,
    );
}
function _f(e) {
  let t = [0];
  for (let n = 0; n < e.length; n += 1)
    e[n] ===
      `
` && t.push(n + 1);
  return t;
}
function pa(e, t, n, i) {
  let r = t[n - 1] ?? 0,
    s = i >= t.length ? e.length : t[i] - 1;
  return e.slice(r, s);
}
function Ef(e, t, n, i) {
  return e - n || (t.lineStart ?? 0) - (i.lineStart ?? 0) || t.id - i.id;
}
var Rf = 4096,
  wf = 2048;
function rn(e) {
  return e.entityKind === "component" && (e.typeName === "Transform" || e.typeName === "RectTransform");
}
function mE(e) {
  let t = new Map();
  for (let n of e)
    if (rn(n) && n.parentEntityId !== null) {
      let i = t.get(n.parentEntityId) ?? [];
      (i.push(n), t.set(n.parentEntityId, i));
    }
  for (let n of t.values()) n.sort((i, r) => i.lineStart - r.lineStart);
  return t;
}
function Pf(e) {
  return [e.severity, e.category, e.stage ?? "", e.code ?? "", e.filePath ?? "", e.message].join("\0");
}
function vf(e, t) {
  return !e || t === null ? !e : e.has(t);
}
function yE(e, t) {
  if (t.length === 0) return [];
  let n = Math.floor(Er / 3),
    i = new Set();
  for (let r of Pe(t, n)) {
    let s = we(r.length);
    e.prepare(
      `SELECT f.id
       FROM files f
       WHERE f.id IN (${s})
          OR f.meta_file_id IN (${s})
          OR (
            f.kind = 'meta'
            AND EXISTS (
              SELECT 1
              FROM files source
              WHERE source.meta_file_id = f.id
                AND source.id IN (${s})
            )
          )`,
    )
      .all(...r, ...r, ...r)
      .forEach((a) => i.add(a.id));
  }
  return ve([...i]);
}
async function Ea(e, t, n = {}) {
  let i = new Set(t);
  return Mo(e, () =>
    Ff(e, { ...n, scopeFileIds: i, startEntryId: ye(e, "vfs_entries"), startEdgeId: ye(e, "vfs_edges") }),
  );
}
async function Of(e, t = {}) {
  return Mo(e, () => Ff(e, t));
}
async function Ff(e, t = {}) {
  let { stopwatch: n, scopeFileIds: i } = t;
  (n?.start("load_rows"), Ld(e));
  let r = i !== void 0 ? yE(e, [...i]) : void 0,
    s = jr(e, r),
    o = hE(e, gE(e, r)),
    a = new Map(o.map((f) => [f.id, f])),
    l = i ? o.filter((f) => vf(i, f.fileId)) : o,
    c = EE(e, r),
    d = xf(e, r),
    u = new Map(d.map((f) => [f.id, f])),
    m = RE(e, r),
    y = new Map(m.map((f) => [f.id, f])),
    p = PE(e, r),
    g = vE(e, r),
    h =
      i !== void 0
        ? m.filter((f) => {
            let I = u.get(f.assetId);
            return I !== void 0 && i.has(I.fileId);
          })
        : m,
    S = TE(e, r),
    _ = new Map(s.map((f) => [f.id, f])),
    E = r === void 0 ? s : jr(e),
    b = new Map(
      E.filter((f) => f.kind !== "meta").map((f) => {
        let I = $r(f.kind, f.projectRelPath);
        return [f.id, Tu(I)];
      }),
    ),
    R = new Map(E.map((f) => [f.id, f])),
    v = new Map(
      d.flatMap((f) => {
        let I = R.get(f.fileId);
        return I?.guid ? [[I.guid, I.id]] : [];
      }),
    );
  if (r !== void 0)
    for (let f of xf(e)) {
      let I = R.get(f.fileId);
      I?.guid && v.set(I.guid, I.id);
    }
  let T = new Map();
  for (let f of m) {
    let I = u.get(f.assetId);
    I && T.set(`${I.fileId}\0${f.localKey}`, f.id);
  }
  let x = e.prepare(`SELECT id, object_type, game_object_file_id
     FROM yaml_objects
     WHERE file_id = ? AND local_identifier = ?`),
    $ = e.prepare(`SELECT target_guid,
            coalesce(target_local_id, target_file_id) AS target_local_id
     FROM yaml_references
     WHERE source_yaml_object_id = ?
       AND field_path = 'm_CorrespondingSourceObject'
     LIMIT 1`),
    z = e.prepare(`SELECT coalesce(target_local_id, target_file_id) AS target_local_id
     FROM yaml_references
     WHERE source_yaml_object_id = ?
       AND field_path = 'm_PrefabInstance'
     LIMIT 1`),
    Y = e.prepare(`SELECT entities.id
     FROM entities
     JOIN assets ON assets.id = entities.asset_id
     WHERE assets.file_id = ? AND entities.local_key = ?
     LIMIT 1`),
    V = e.prepare(`SELECT vfs_path
     FROM vfs_entries
     WHERE project_id = 1
       AND source_vfs_path = ?
       AND vfs_path LIKE ? ESCAPE '\\'
       AND (? IS NULL OR instance_root_vfs_path = ?)
     ORDER BY id
     LIMIT 2`);
  function G(f) {
    let I = f.sourceGuid,
      w = f.sourceLocalId,
      M = new Set(),
      N = [],
      U = null;
    for (; I && w;) {
      let xe = `${I}\0${w}`;
      if (M.has(xe)) return null;
      M.add(xe);
      let oe = v.get(I);
      if (oe === void 0) return null;
      let he = x.get(oe, w);
      if (!he) return null;
      let Ie =
        he.game_object_file_id ?? (he.object_type === "GameObject" || he.object_type === "PrefabInstance" ? w : null);
      if (Ie) {
        let Xn = T.get(`${oe}\0${Ie}`);
        if (Xn !== void 0) {
          U = Xn;
          break;
        }
        U = Y.get(oe, Ie)?.id ?? null;
        break;
      }
      let Ue = z.get(he.id)?.target_local_id ?? null,
        _t = Ue && Ue !== "0" ? (T.get(`${oe}\0${Ue}`) ?? Y.get(oe, Ue)?.id ?? null) : null;
      N.push({ fileId: oe, sourceGuid: I, sourceLocalId: w, owningPrefabInstanceEntityId: _t });
      let Et = $.get(he.id);
      ((I = Et?.target_guid ?? null), (w = Et?.target_local_id ?? null));
    }
    if (U === null) return null;
    let L = qn(U),
      Te = y.get(U),
      H = Te ? u.get(Te.assetId)?.fileId : void 0;
    for (let xe = N.length - 1; L && xe >= 0; xe -= 1) {
      let oe = N[xe],
        he = R.get(oe.fileId);
      if (!he) return null;
      let Ie = oe.owningPrefabInstanceEntityId ? qn(oe.owningPrefabInstanceEntityId) : null;
      if (Ie === null && oe.owningPrefabInstanceEntityId !== null) {
        let _t = y.get(oe.owningPrefabInstanceEntityId),
          Et = _t ? u.get(_t.assetId) : void 0;
        _t && Et && (Ie = pt(e, Xe(Et.fileId, _t.localKey))?.vfsPath ?? null);
      }
      let ft = he.projectRelPath.replace(/[\\%_]/g, "\\$&"),
        Ue = V.all(L, `${ft}:/%`, Ie, Ie);
      if (Ue.length === 1) {
        L = Ue[0].vfs_path;
        continue;
      }
      if (xe === N.length - 1) {
        if (oe.fileId !== H) return null;
        continue;
      }
      return null;
    }
    return L;
  }
  let re = new Set((t.diagnostics ?? []).map(Pf)),
    W = (f) => {
      let I = Pf(f);
      re.has(I) || (re.add(I), t.diagnostics?.push(f));
    },
    ce = new Map();
  (await UE(s, 16, async (f) => {
    if (f.kind !== "meta") return;
    let I = await uE(f.absPath, "utf8").catch(() => "");
    if (I.length > 0) {
      let w = bf(I);
      w && ce.set(f.id, w);
    }
  }),
    n?.stop("load_rows"));
  let Ee = i ? zE(e) : qE(e);
  WE(Rf, Nr);
  let le = new Or(e, { mode: i ? "scoped" : "full", generation: Ee, batchRows: Nr }),
    pe = new _a(e, Rf),
    Oe = new Map(),
    it = (f) => {
      (f.entryKind === "source_prefab_link" || f.entryKind === "prefab_overrides") &&
        Oe.set(f.vfsPath, f.sourceEntityId);
    },
    $e = e.prepare(`SELECT source_entity_id
     FROM vfs_entries
     WHERE project_id = 1 AND vfs_path = ?`),
    P = new Fr(e, void 0, () => {
      le.flush();
    }),
    A = new Map(),
    F = new Map(),
    B = new Map(),
    ne = t.startEntryId ?? 1,
    ee = t.startEdgeId ?? 1;
  function Q(f) {
    return Ir(f.projectRelPath, f.sizeBytes);
  }
  function de(f) {
    let I = f.sizeBytes ?? Buffer.byteLength(f.metaContent ?? "", "utf8"),
      w = f.hostFileId ?? f.sourceFileId,
      M = f.sourceFileId === null ? null : (b.get(f.sourceFileId) ?? null);
    if (i) {
      let L =
        f.vfsLogicalKey ??
        ha({
          id: 0,
          sizeBytes: I,
          fileFamily: M,
          ...f,
          hostFileId: w,
          content: null,
          projectionKind: f.projectionKind ?? null,
          sourceVfsPath: f.sourceVfsPath ?? null,
          sourceOwnerVfsPath: f.sourceOwnerVfsPath ?? null,
          instanceRootVfsPath: f.instanceRootVfsPath ?? null,
          vfsLogicalKey: f.vfsLogicalKey ?? null,
          sourceLogicalKey: f.sourceLogicalKey ?? null,
        });
      if (L?.startsWith("entity_file_local:")) {
        let Te = pt(e, L);
        if (Te) {
          let H = {
            id: Te.id,
            sizeBytes: I,
            fileFamily: M,
            ...f,
            hostFileId: w,
            content: null,
            projectionKind: f.projectionKind ?? null,
            sourceVfsPath: f.sourceVfsPath ?? null,
            sourceOwnerVfsPath: f.sourceOwnerVfsPath ?? null,
            instanceRootVfsPath: f.instanceRootVfsPath ?? null,
            vfsLogicalKey: L,
            sourceLogicalKey: f.sourceLogicalKey ?? null,
          };
          return (
            (H.sourceLogicalKey = H.sourceLogicalKey ?? Ia(H)),
            ba(H),
            le.add(H),
            pe.remember(H.vfsPath, H.id),
            it(H),
            H
          );
        }
      }
    }
    let N = pe.byPath(f.vfsPath);
    if (N !== void 0) {
      if (i) {
        let L = {
          id: N,
          sizeBytes: I,
          fileFamily: M,
          ...f,
          hostFileId: w,
          content: null,
          projectionKind: f.projectionKind ?? null,
          sourceVfsPath: f.sourceVfsPath ?? null,
          sourceOwnerVfsPath: f.sourceOwnerVfsPath ?? null,
          instanceRootVfsPath: f.instanceRootVfsPath ?? null,
          vfsLogicalKey: f.vfsLogicalKey ?? null,
          sourceLogicalKey: f.sourceLogicalKey ?? null,
        };
        return (
          (L.vfsLogicalKey = L.vfsLogicalKey ?? ha(L)),
          (L.sourceLogicalKey = L.sourceLogicalKey ?? Ia(L)),
          ba(L),
          le.add(L),
          pe.remember(L.vfsPath, L.id),
          it(L),
          L
        );
      }
      return (console.warn(`Duplicate materialized VFS path: ${f.vfsPath} \u2014 skipping duplicate entry`), null);
    }
    let U = {
      id: ne++,
      sizeBytes: I,
      fileFamily: M,
      ...f,
      hostFileId: w,
      content: null,
      projectionKind: f.projectionKind ?? null,
      sourceVfsPath: f.sourceVfsPath ?? null,
      sourceOwnerVfsPath: f.sourceOwnerVfsPath ?? null,
      instanceRootVfsPath: f.instanceRootVfsPath ?? null,
      vfsLogicalKey: f.vfsLogicalKey ?? null,
      sourceLogicalKey: f.sourceLogicalKey ?? null,
    };
    return (
      (U.vfsLogicalKey = U.vfsLogicalKey ?? ha(U)),
      (U.sourceLogicalKey = U.sourceLogicalKey ?? Ia(U)),
      ba(U),
      le.add(U),
      pe.remember(U.vfsPath, U.id),
      it(U),
      U
    );
  }
  function te(f, I, w, M = null) {
    if (!f || !I) return;
    let N = pe.byPath(f),
      U = pe.byPath(I);
    if (!N || !U) {
      P.recordMissingEndpoint();
      return;
    }
    P.add({ id: ee++, fromEntryId: N, toEntryId: U, edgeKind: w, edgeSubkind: M });
  }
  function Ge(f) {
    if (f != null) return A.get(f);
  }
  i &&
    s.forEach((f) => {
      if (f.kind === "meta") return;
      let I = K(f.projectRelPath, "file");
      pe.byPath(I) !== void 0 && B.set(f.id, I);
    });
  let rt = new Map();
  s.forEach((f) => {
    f.metaFileId !== null && rt.set(f.metaFileId, f);
  });
  let Me = new Map();
  (s.forEach((f) => {
    if (f.kind !== "meta") return;
    let I = rt.get(f.id);
    I && Me.set(I.id, f);
  }),
    n?.start("materialize_directories"));
  let k = AE(s.filter((f) => f.kind !== "meta"));
  (k.forEach((f) => {
    let I = K(f, "directory"),
      w = OE(f);
    de({
      entryType: "directory",
      entryKind: "directory",
      vfsPath: I,
      parentVfsPath: w ? K(w, "directory") : null,
      sourceFileId: null,
      sourceSymbolId: null,
      sourceEntityId: null,
      displayName: ht.posix.basename(f),
      content: null,
      metaContent: null,
      lineStart: null,
      lineEnd: null,
      targetVfsPath: null,
      projectionKind: null,
      sizeBytes: 0,
    });
  }),
    t.onProgress?.(k.length, k.length, `Materialized ${k.length} directories`),
    n?.stop("materialize_directories"),
    n?.start("materialize_files"));
  let C = s.filter((f) => f.kind !== "meta");
  (C.forEach((f) => {
    let I = Me.get(f.id);
    (de({
      entryType: "file",
      entryKind: $r(f.kind, f.projectRelPath),
      vfsPath: K(f.projectRelPath, "file"),
      parentVfsPath: K(ht.posix.dirname(f.projectRelPath), "directory"),
      sourceFileId: f.id,
      sourceSymbolId: null,
      sourceEntityId: null,
      displayName: ht.posix.basename(f.projectRelPath),
      content: null,
      metaContent: I ? (ce.get(I.id) ?? null) : null,
      lineStart: null,
      lineEnd: null,
      targetVfsPath: null,
      projectionKind: null,
      sizeBytes: f.sizeBytes,
    }),
      B.set(f.id, K(f.projectRelPath, "file")));
  }),
    t.onProgress?.(C.length, C.length, `Materialized ${C.length} files`),
    n?.stop("materialize_files"),
    n?.start("materialize_file_content_nodes"));
  let ue = 0;
  (C.forEach((f) => {
    let I = $r(f.kind, f.projectRelPath);
    if (!Hd(f.projectRelPath, I, f.sizeBytes) || !Q(f) || f.sizeBytes === 0) return;
    let w = K(f.projectRelPath, "file");
    (de({
      entryType: "node",
      entryKind: "file_content",
      vfsPath: K(si(w), "leaf"),
      parentVfsPath: w,
      sourceFileId: f.id,
      sourceSymbolId: null,
      sourceEntityId: null,
      displayName: ".content",
      content: null,
      metaContent: null,
      lineStart: null,
      lineEnd: null,
      targetVfsPath: null,
      projectionKind: null,
      sizeBytes: f.sizeBytes,
    }),
      (ue += 1));
  }),
    t.onProgress?.(ue, ue, `Materialized ${ue} file content nodes`),
    n?.stop("materialize_file_content_nodes"),
    n?.start("materialize_symbols"));
  let Le = new Map(),
    fe = new Map();
  function pn(f, I, w, M) {
    let N = Pt(I, M),
      U = K(Re(f, N), w),
      L = (Le.get(U) ?? 0) + 1;
    return (Le.set(U, L), L === 1 ? U : K(Re(f, Pt(`${I}#${L}`, M)), w));
  }
  function D(f) {
    if (fe.has(f)) return fe.get(f) ?? null;
    let I = a.get(f);
    if (!I || I.isExternalStub !== 0 || !I.fileId) return (fe.set(f, null), null);
    let w = B.get(I.fileId);
    if (!w) return (fe.set(f, null), null);
    let M = [],
      N = I;
    for (; N;)
      (M.unshift({ simpleName: N.simpleName, symbolKind: N.symbolKind }),
        (N = N.containingSymbolId ? a.get(N.containingSymbolId) : void 0));
    let U = null;
    for (let L = 0; L < M.length; L += 1) {
      let { simpleName: Te, symbolKind: H } = M[L],
        xe = L === M.length - 1,
        oe = FE(H),
        he = U ?? `${w}:/`;
      if (xe) {
        U = pn(he, Te, oe, H);
        continue;
      }
      let Ie = Pt(Te, H);
      U = K(Re(he, Ie), "container");
    }
    return (fe.set(f, U), U);
  }
  let j = l.filter((f) => f.isExternalStub === 0 && f.fileId !== null);
  (j
    .sort((f, I) => Ef(f.fileId, f, I.fileId, I))
    .forEach((f) => {
      let I = D(f.id);
      if (!I) return;
      let w = f.containingSymbolId ? D(f.containingSymbolId) : B.get(f.fileId);
      (de({
        entryType: "node",
        entryKind: f.symbolKind,
        vfsPath: I,
        parentVfsPath: w ?? null,
        sourceFileId: f.fileId,
        sourceSymbolId: f.id,
        sourceEntityId: null,
        displayName: f.displayName,
        content: null,
        metaContent: null,
        lineStart: f.lineStart,
        lineEnd: f.lineEnd,
        targetVfsPath: null,
        projectionKind: null,
      }),
        A.set(f.id, I));
    }),
    t.onProgress?.(j.length, j.length, `Materialized ${j.length} symbols`),
    n?.stop("materialize_symbols"),
    n?.start("materialize_entities"));
  let J = new Map(),
    se = new Map(),
    Yt = new Map();
  for (let f of h) {
    if (f.parentEntityId === null) continue;
    let I = se.get(f.parentEntityId) ?? [];
    (I.push(f), se.set(f.parentEntityId, I));
  }
  se.forEach((f) => {
    f.sort((I, w) => I.id - w.id);
  });
  function yd(f, I) {
    let w = Number.parseInt(f, 10),
      M = Number.parseInt(I, 10);
    return Number.isFinite(w) && Number.isFinite(M) && String(w) === f && String(M) === I ? w - M : f.localeCompare(I);
  }
  function yo(f, I) {
    return i ? yd(f.localKey, I.localKey) : f.id - I.id;
  }
  let gd = new Map(),
    go = new Map();
  for (let f of h) {
    let I = `${f.parentEntityId}|${f.assetId}|${Br(f)}`,
      w = go.get(I) ?? [];
    (w.push(f), go.set(I, w));
  }
  for (let f of go.values())
    (f.sort((I, w) => (i ? yd(I.localKey, w.localKey) : I.id - w.id)),
      f.forEach((I, w) => {
        gd.set(I.id, w);
      }));
  function po(f) {
    return gd.get(f.id) ?? 0;
  }
  function pd(f, I) {
    let w = Br(f),
      M = NE(f.entityKind),
      N = u.get(f.assetId),
      U = i && N ? pt(e, Xe(N.fileId, f.localKey))?.vfsPath : void 0;
    return ho(I, w, M, f.entityKind, po(f), U);
  }
  function hd(f) {
    let I = F.get(f.id);
    if (I) return I;
    if (bo(f)) return null;
    let w = u.get(f.assetId);
    if (!w) return null;
    let M = pt(e, Xe(w.fileId, f.localKey));
    return M ? (F.set(f.id, M.vfsPath), M.vfsPath) : null;
  }
  function qn(f) {
    let I = y.get(f);
    if (I) return hd(I);
    let w = e
      .prepare(
        `SELECT assets.file_id, entities.local_key
         FROM entities
         JOIN assets ON assets.id = entities.asset_id
         WHERE entities.id = ?`,
      )
      .get(f);
    if (!w) return null;
    let M = pt(e, Xe(w.file_id, w.local_key));
    return M ? (F.set(f, M.vfsPath), M.vfsPath) : null;
  }
  let sr = new Map();
  function lI(f) {
    for (let I of sr.keys()) f.startsWith(I) && sr.delete(I);
  }
  function cI(f) {
    let I = sr.get(f);
    if (I) return I;
    le.flush();
    let w = du(f),
      M = e
        .prepare(
          `SELECT id, entry_type, entry_kind, vfs_path, parent_vfs_path,
                host_file_id, source_file_id, source_symbol_id, source_entity_id,
                display_name, child_order, content, meta_content, line_start,
                line_end, size_bytes, target_vfs_path, projection_kind,
                source_vfs_path, source_owner_vfs_path,
                instance_root_vfs_path, vfs_logical_key, source_logical_key,
                materialization_generation
         FROM vfs_entries
         WHERE project_id = 1
           AND entry_type = 'node'
           AND entry_kind <> 'prefab_overrides'
           AND vfs_path >= ?
           AND vfs_path < ?
         ORDER BY length(vfs_path), child_order, id`,
        )
        .all(w.lowerBound, w.upperBound)
        .map(Lf),
      N = M.find((L) => L.vfsPath === f),
      U = i && N?.materializationGeneration === Ee ? M.filter((L) => L.materializationGeneration === Ee) : M;
    return (sr.set(f, U), U);
  }
  function ho(f, I, w, M, N = 0, U) {
    let L = N + 1,
      Te = L === 1 ? I : `${I}#${L}`,
      H = Pt(Te, M),
      xe = K(Re(f, H), w);
    if (xe === U || pe.byPath(xe) === void 0) return xe;
    let oe = L;
    for (;;) {
      oe += 1;
      let he = Pt(`${I}#${oe}`, M),
        Ie = K(Re(f, he), w);
      if (Ie === U || pe.byPath(Ie) === void 0) return Ie;
    }
  }
  let dI = e.prepare(`SELECT id
     FROM vfs_entries
     WHERE project_id = 1
       AND vfs_path = ?
       AND projection_kind = 'prefab_inherited'
       AND instance_root_vfs_path = ?`),
    Id = new Set();
  function uI(f, I, w) {
    let M = Mf(I.vfsPath),
      N = Pt("", I.entryKind),
      U = N && M.endsWith(N) ? M.slice(0, -N.length) : M,
      L = yt(I.displayName, I.entryKind),
      Te = U.match(/^(.*)#(\d+)$/),
      H = Te?.[1] === L ? Te : null,
      xe = H?.[1] ?? U,
      oe = H ? Number.parseInt(H[2], 10) - 1 : 0,
      he = I.vfsPath.endsWith("/") ? "container" : "leaf",
      Ie = K(Re(f, M), he),
      ft = oe + 1,
      Ue = Ie;
    for (; Id.has(Ue) || (pe.byPath(Ue) !== void 0 && (!i || dI.get(Ue, w) === void 0));)
      ((ft += 1), (Ue = K(Re(f, Pt(`${xe}#${ft}`, I.entryKind)), he)));
    return (Id.add(Ue), Ue);
  }
  function or(f) {
    if (J.has(f)) return J.get(f) ?? null;
    let I = F.get(f);
    if (I) return (J.set(f, I), I);
    let w = y.get(f);
    if (!w) return (J.set(f, null), null);
    if (w.entityKind === "prefab_instance") return null;
    let M = u.get(w.assetId);
    if (!M) return (J.set(f, null), null);
    let N = w.parentEntityId ? or(w.parentEntityId) : `${M.vfsRootPath}:/`;
    if (!N) return null;
    let U = pd(w, N);
    return (J.set(f, U), U);
  }
  let Io = h.filter((f) => f.entityKind !== "prefab_instance" && !rn(f) && !g.has(f.id));
  function bo(f) {
    let I = u.get(f.assetId);
    return vf(i, I?.fileId ?? null);
  }
  function ar(f, I) {
    if (!bo(f) || f.entityKind === "material" || rn(f) || F.has(f.id)) return;
    let w = I ? pd(f, I) : or(f.id);
    if (!w) return;
    let M = u.get(f.assetId),
      N = M ? B.get(M.fileId) : null,
      U = I ?? (f.parentEntityId ? or(f.parentEntityId) : N);
    (de({
      entryType: "node",
      entryKind: kf(f.entityKind),
      vfsPath: w,
      parentVfsPath: U ?? null,
      sourceFileId: M?.fileId ?? null,
      sourceSymbolId: f.scriptSymbolId,
      sourceEntityId: f.id,
      displayName: Sa(f),
      childOrder: f.hierarchyOrder,
      content: null,
      metaContent: null,
      lineStart: f.lineStart,
      lineEnd: f.lineEnd,
      targetVfsPath: null,
      projectionKind: null,
      vfsLogicalKey: M ? Xe(M.fileId, f.localKey) : null,
    }),
      F.set(f.id, w));
  }
  function bd(f) {
    let I = y.get(f);
    !I ||
      F.has(f) ||
      !bo(I) ||
      (I.entityKind !== "prefab_instance" && (rn(I) || (I.parentEntityId && bd(I.parentEntityId), ar(I))));
  }
  Io.sort(yo).forEach((f) => {
    ar(f);
  });
  for (let f of h) {
    if (!rn(f) || f.parentEntityId === null) continue;
    let I = F.get(f.parentEntityId);
    I && F.set(f.id, I);
  }
  function So(f) {
    if (f.entityKind !== "prefab_instance" || F.has(f.id)) return F.get(f.id) ?? null;
    let I = u.get(f.assetId);
    if (!I) return null;
    let w = B.get(I.fileId) ?? null;
    f.parentEntityId && bd(f.parentEntityId);
    let N = Yt.get(f.id) ?? (f.parentEntityId ? or(f.parentEntityId) : w),
      U = f.parentEntityId ? N : `${I.vfsRootPath}:/`;
    if (!U) return null;
    let L = ho(
      U,
      Br(f),
      "container",
      f.entityKind,
      po(f),
      i ? (pt(e, Xe(I.fileId, f.localKey))?.vfsPath ?? Rd.get(f.id)) : void 0,
    );
    return (
      de({
        entryType: "node",
        entryKind: kf(f.entityKind),
        vfsPath: L,
        parentVfsPath: N,
        sourceFileId: I.fileId,
        sourceSymbolId: f.scriptSymbolId,
        sourceEntityId: f.id,
        displayName: Sa(f),
        childOrder: f.hierarchyOrder,
        content: null,
        metaContent: null,
        lineStart: f.lineStart,
        lineEnd: f.lineEnd,
        targetVfsPath: null,
        projectionKind: null,
        vfsLogicalKey: Xe(I.fileId, f.localKey),
      }),
      F.set(f.id, L),
      _d(f, L, I),
      Ed(f),
      L
    );
  }
  function Sd(f) {
    let I = Yt.get(f.id);
    if (I) return I;
    if (f.parentEntityId) {
      let M = y.get(f.parentEntityId);
      return M ? hd(M) : null;
    }
    let w = u.get(f.assetId);
    return w ? `${w.vfsRootPath}:/` : null;
  }
  function zn(f, I) {
    let w = K(`${I.vfsRootPath}:/`, "container");
    return K(f, "container") === w ? I.vfsRootPath : f;
  }
  function fI(f, I, w, M) {
    let N = K(Re(I, ".SourcePrefab"), "link"),
      U = K(M.projectRelPath, "file");
    (de({
      entryType: "link",
      entryKind: "source_prefab_link",
      vfsPath: N,
      parentVfsPath: zn(I, w),
      sourceFileId: w.fileId,
      sourceSymbolId: null,
      sourceEntityId: f.id,
      displayName: ".SourcePrefab",
      content: null,
      metaContent: null,
      lineStart: null,
      lineEnd: null,
      targetVfsPath: U,
      projectionKind: "source_prefab",
      instanceRootVfsPath: I,
      sizeBytes: 0,
    }),
      te(N, U, "source_prefab"),
      te(I, U, "instance_of"));
  }
  function _d(f, I, w) {
    let M = K(Re(I, ".PrefabOverrides"), "leaf");
    de({
      entryType: "node",
      entryKind: "prefab_overrides",
      vfsPath: M,
      parentVfsPath: zn(I, w),
      sourceFileId: w.fileId,
      sourceSymbolId: null,
      sourceEntityId: f.id,
      displayName: ".PrefabOverrides",
      content: null,
      metaContent: null,
      lineStart: f.lineStart,
      lineEnd: f.lineEnd,
      targetVfsPath: null,
      projectionKind: null,
      sourceVfsPath: null,
      sourceOwnerVfsPath: I,
      instanceRootVfsPath: I,
    });
  }
  function mI(f, I) {
    return [".SourcePrefab", ".PrefabOverrides"].some((w) => {
      let M = K(Re(I, w), w === ".SourcePrefab" ? "link" : "leaf"),
        N = Oe.get(M);
      if (Oe.has(M)) return N !== f.id;
      let U = $e.get(M);
      return U !== void 0 && U.source_entity_id !== null && U.source_entity_id !== f.id;
    });
  }
  function Ed(f, I) {
    let w = [...(se.get(f.id) ?? [])];
    for (let M = 0; M < w.length; M += 1) {
      let N = w[M],
        U = I?.get(N.id);
      if (rn(N)) {
        let L = N.parentEntityId ? F.get(N.parentEntityId) : null;
        L && F.set(N.id, L);
      } else N.entityKind === "prefab_instance" ? U && Yt.set(N.id, U) : ar(N, U);
      w.push(...(se.get(N.id) ?? []));
    }
  }
  let lr = new Map(),
    cr = new Map(),
    _o = h.filter((f) => f.entityKind === "prefab_instance").sort(yo),
    Rd = new Map();
  if (i)
    for (let f of _o) {
      let I = u.get(f.assetId),
        w = I ? (pt(e, Xe(I.fileId, f.localKey))?.vfsPath ?? pt(e, xo(f.id))?.instanceRootVfsPath ?? void 0) : void 0;
      w && Rd.set(f.id, w);
    }
  let Hn = new Map(),
    dr = new Set(),
    wd = new Map(),
    yI = new Map(_o.map((f) => [f.id, f])),
    Pd = (f) => {
      if (dr.has(f.id)) return;
      (dr.add(f.id), F.delete(f.id));
      let I = u.get(f.assetId),
        w = I ? _.get(I.fileId) : void 0,
        M = p.get(f.id),
        N = M ? v.get(M) : void 0,
        U = N ? R.get(N) : void 0;
      (U && wd.set(f.id, U),
        W({
          severity: "warning",
          category: "materialize",
          stage: "materialize",
          code: U ? "prefab_projection_source_unprojectable" : "prefab_projection_source_missing",
          filePath: w?.projectRelPath,
          message: U
            ? `Prefab instance source ${U.projectRelPath} exists but has no projectable root entity.`
            : M
              ? `Prefab instance source ${M} could not be found.`
              : `Prefab instance ${f.localKey} has no source.`,
        }));
    },
    vd = [];
  for (let f of _o) {
    if (Hn.has(f.id)) continue;
    let I = [{ entity: f, expanded: !1 }];
    for (; I.length > 0;) {
      let w = I.pop();
      if (w.expanded) {
        (Hn.set(w.entity.id, "visited"), vd.push(w.entity));
        continue;
      }
      if (Hn.get(w.entity.id) === "visited") continue;
      (Hn.set(w.entity.id, "visiting"), I.push({ entity: w.entity, expanded: !0 }));
      let M = w.entity.sourceEntityId ? yI.get(w.entity.sourceEntityId) : void 0;
      if (!M) {
        w.entity.sourceEntityId === null && Pd(w.entity);
        continue;
      }
      let N = Hn.get(M.id);
      if (N === "visiting") {
        dr.add(w.entity.id);
        let U = u.get(w.entity.assetId),
          L = U ? _.get(U.fileId) : void 0;
        W({
          severity: "warning",
          category: "materialize",
          stage: "materialize",
          code: "prefab_projection_cycle",
          filePath: L?.projectRelPath,
          message: `Prefab projection cycle detected at ${L?.projectRelPath ?? w.entity.localKey}.`,
        });
      } else N !== "visited" && I.push({ entity: M, expanded: !1 });
    }
  }
  let Jn = vd;
  for (; Jn.length > 0;) {
    (lr.clear(),
      cr.clear(),
      Jn.forEach((I) => {
        let w = Sd(I),
          M = I.sourceEntityId ? qn(I.sourceEntityId) : null;
        if (!w || (cr.set(w, (cr.get(w) ?? 0) + 1), !M)) return;
        let N = `${w}|${M}`;
        lr.set(N, (lr.get(N) ?? 0) + 1);
      }));
    let f = [];
    for (let I of Jn) {
      if (dr.has(I.id)) {
        let ie = So(I);
        if (ie) {
          let Rt = wd.get(I.id),
            mt = u.get(I.assetId);
          (Rt && mt && fI(I, ie, mt, Rt), le.flush());
        } else f.push(I);
        continue;
      }
      let w = Sd(I),
        M = I.sourceEntityId ? qn(I.sourceEntityId) : null;
      if (!w || !M) {
        f.push(I);
        continue;
      }
      let N = I.sourceEntityId;
      if (!N) continue;
      let U = qn(N),
        L = u.get(I.assetId);
      if (!U || !L) {
        f.push(I);
        continue;
      }
      let Te = cI(U),
        H = Te.find((ie) => ie.vfsPath === U);
      if (!H) {
        f.push(I);
        continue;
      }
      let xe = `${w}|${M}`,
        oe = Mf(M),
        he = H.displayName,
        Ie = Br(I),
        ft = I.name?.trim() ?? "",
        Ue = ht.posix.basename(L.vfsRootPath),
        _t = (ft && ft !== Ue ? ft : he) || "PrefabInstance",
        Et = () => {
          let ie = ho(w, Ie, "container", H.entryKind, po(I), i ? pt(e, Xe(L.fileId, I.localKey))?.vfsPath : void 0);
          return (
            de({
              entryType: "node",
              entryKind: H.entryKind,
              vfsPath: ie,
              parentVfsPath: zn(w, L),
              hostFileId: L.fileId,
              sourceFileId: H.sourceFileId,
              sourceSymbolId: H.sourceSymbolId,
              sourceEntityId: H.sourceEntityId,
              displayName: _t,
              childOrder: I.hierarchyOrder,
              content: null,
              metaContent: null,
              lineStart: H.lineStart,
              lineEnd: H.lineEnd,
              targetVfsPath: null,
              projectionKind: "prefab_inherited",
              sourceVfsPath: U,
              sourceOwnerVfsPath: U,
              sourceLogicalKey: H.vfsLogicalKey,
              instanceRootVfsPath: ie,
              vfsLogicalKey: Xe(L.fileId, I.localKey),
            }),
            ie
          );
        },
        Xn = I.parentEntityId === null || (lr.get(xe) ?? 0) > 1 || (cr.get(w) ?? 0) > 1 || Ie !== oe,
        Fe = w;
      Xn && (Fe = Et());
      let Eo = K(Re(Fe, ".SourcePrefab"), "link");
      (!Xn && mI(I, Fe) && ((Fe = Et()), (Eo = K(Re(Fe, ".SourcePrefab"), "link"))),
        lI(Fe),
        F.set(I.id, Fe),
        de({
          entryType: "link",
          entryKind: "source_prefab_link",
          vfsPath: Eo,
          parentVfsPath: zn(Fe, L),
          sourceFileId: L.fileId,
          sourceSymbolId: null,
          sourceEntityId: I.id,
          displayName: ".SourcePrefab",
          content: null,
          metaContent: null,
          lineStart: null,
          lineEnd: null,
          targetVfsPath: M,
          projectionKind: "source_prefab",
          instanceRootVfsPath: Fe,
          sizeBytes: 0,
        }),
        te(Eo, M, "source_prefab"),
        te(Fe, M, "instance_of"),
        _d(I, Fe, L));
      let Ro = new Map([[U, Fe]]);
      for (let ie of Te) {
        if (ie.vfsPath === U) continue;
        let Rt = ie.parentVfsPath,
          mt = Rt ? (Ro.get(Rt) ?? null) : null;
        if (!mt) continue;
        let Qn = uI(mt, ie, Fe);
        (Ro.set(ie.vfsPath, Qn),
          de({
            entryType: "node",
            entryKind: ie.entryKind,
            vfsPath: Qn,
            parentVfsPath: zn(mt, L),
            hostFileId: L.fileId,
            sourceFileId: ie.sourceFileId,
            sourceSymbolId: ie.sourceSymbolId,
            sourceEntityId: ie.sourceEntityId,
            displayName: ie.displayName,
            childOrder: ie.childOrder,
            content: null,
            metaContent: null,
            lineStart: ie.lineStart,
            lineEnd: ie.lineEnd,
            targetVfsPath: null,
            projectionKind: "prefab_inherited",
            sourceVfsPath: ie.vfsPath,
            sourceLogicalKey: ie.vfsLogicalKey,
            sourceOwnerVfsPath: U,
            instanceRootVfsPath: Fe,
          }));
      }
      let Ud = new Map();
      for (let ie of se.get(I.id) ?? []) {
        let Rt = g.get(ie.id),
          mt = Rt ? G(Rt) : null,
          Qn = mt ? Ro.get(mt) : void 0;
        Qn && Ud.set(ie.id, Qn);
      }
      (Ed(I, Ud), le.flush());
    }
    if (f.length === Jn.length) {
      for (let I of f) (Pd(I), So(I));
      break;
    }
    Jn = f;
  }
  h.filter((f) => f.entityKind === "prefab_instance")
    .sort((f, I) => f.id - I.id)
    .forEach((f) => {
      So(f);
    });
  for (let f of Io) F.has(f.id) || J.delete(f.id);
  (Io.sort(yo).forEach((f) => {
    ar(f);
  }),
    t.onProgress?.(h.length, h.length, `Materialized ${h.length} entities`),
    n?.stop("materialize_entities"));
  for (let f of h) {
    if (f.entityKind !== "material") continue;
    let I = u.get(f.assetId);
    if (!I) continue;
    let w = B.get(I.fileId);
    w && F.set(f.id, w);
  }
  (VE({
    insertEntry: de,
    entities: h,
    assetById: u,
    fileById: _,
    shouldDeferSourceContent: (f) => {
      let I = _.get(f);
      return I ? I.sizeBytes > 0 && Q(I) : !1;
    },
    normalizeCanonical: K,
  }),
    le.flush(),
    JE(e, {
      fileById: _,
      symbolById: a,
      entityById: y,
      transformEntitiesByGameObjectEntityId: mE(m),
      guidToProjectRelPath: ea(r !== void 0 ? jr(e) : s),
      localFileIdToVfsPathByFileId: Uf(m, F, u),
      generation: i !== void 0 ? Ee : void 0,
    }),
    i !== void 0 && r !== void 0 && HE(e, r, Ee),
    pe.clear(),
    n?.start("build_edges"),
    i !== void 0 && r !== void 0 && Ho(e, r),
    XE(e, te, Ee, { scoped: i !== void 0 }),
    l.forEach((f) => {
      let I = A.get(f.id),
        w = f.fileId ? B.get(f.fileId) : null;
      te(I, w, "defined_in", "symbol_file");
    }),
    h.forEach((f) => {
      let I = F.get(f.id);
      I && f.scriptSymbolId && te(I, A.get(f.scriptSymbolId), "binds_to", "component_script");
    }));
  let xd = ve(
    [
      ...c
        .filter(
          (f) => f.targetSymbolId !== null && f.resolutionStatus !== "unresolved" && f.resolutionStatus !== "ambiguous",
        )
        .map((f) => f.targetSymbolId),
      ...S.map((f) => f.toSymbolId),
    ].filter((f) => !A.has(f)),
  );
  if (xd.length > 0) {
    let f = _E(e, xd);
    for (let [I, w] of f) A.set(I, w);
  }
  c.forEach((f) => {
    if (f.resolutionStatus === "unresolved" || f.resolutionStatus === "ambiguous") return;
    let I = f.bindingKind === "invokes" ? "calls" : "refs";
    te(Ge(f.sourceSymbolId), Ge(f.targetSymbolId), I, f.bindingKind);
  });
  let kd = (f) => {
    if (f.edgeKind === "component_of" || f.edgeKind === "child_of") {
      let I = y.get(f.fromEntityId);
      if (I && rn(I)) return;
      te(F.get(f.fromEntityId), F.get(f.toEntityId), "child_of", f.edgeSubkind ?? f.edgeKind);
      return;
    }
    te(F.get(f.fromEntityId), bI(f.toEntityId), f.edgeKind, f.edgeSubkind);
  };
  if (r !== void 0) kE(e, r).forEach(kd);
  else {
    let f = 0;
    for (;;) {
      let I = ME(e, f, 1024);
      if (I.length === 0) break;
      ((f = I[I.length - 1].id), I.forEach(kd));
    }
  }
  S.forEach((f) => {
    te(F.get(f.fromEntityId), A.get(f.toSymbolId), f.edgeKind, f.edgeSubkind);
  });
  let Md = r !== void 0 ? jr(e) : s,
    gI = ea(Md),
    pI = new Map(Md.map((f) => [f.projectRelPath, f.id])),
    hI = Uf(m, F, u),
    Td = {
      sourceEntitiesByYamlObjectId: YE(m),
      fileById: _,
      guidToProjectRelPath: gI,
      entityEntryPathById: F,
      projectRelPathToFileId: pI,
      localFileIdToVfsPathByFileId: hI,
      insertEdge: (f, I) => {
        te(f, I, "depends_on");
      },
    };
  if (r !== void 0) Tf({ ...Td, yamlReferences: wE(e, r) });
  else {
    let f = 0;
    for (;;) {
      let I = xE(e, f, 1024);
      if (I.length === 0) break;
      ((f = I[I.length - 1].id), Tf({ ...Td, yamlReferences: I }));
    }
  }
  (P.flush(),
    t.onProgress?.(P.emittedCount, P.emittedCount, `Materialized ${P.emittedCount} VFS edges`),
    n?.stop("build_edges"),
    n?.start("format_and_write"));
  let II = QE(e, i !== void 0 ? Ee : void 0),
    Vt = { entryCount: le.emittedCount, edgeCount: P.insertedCount, searchIndexedEntryCount: II };
  return (
    t.onProgress?.(Vt.entryCount, Vt.entryCount, `Wrote ${Vt.entryCount} VFS entries`),
    t.onProgress?.(Vt.edgeCount, Vt.edgeCount, `Wrote ${Vt.edgeCount} VFS edges`),
    n?.stop("format_and_write"),
    Vt
  );
  function bI(f) {
    let I = y.get(f);
    if (!I) return;
    let w = u.get(I.assetId);
    return w && Nf(I) ? (B.get(w.fileId) ?? F.get(f)) : F.get(f);
  }
}
function jr(e, t) {
  let n = `SELECT id, project_rel_path, abs_path, kind, guid, meta_file_id, size_bytes
       FROM files`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ae(
            e,
            `${n}
             WHERE id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((r) => {
    let s = r;
    return {
      id: s.id,
      projectRelPath: s.project_rel_path,
      absPath: s.abs_path,
      kind: s.kind,
      guid: s.guid,
      metaFileId: s.meta_file_id,
      sizeBytes: s.size_bytes,
    };
  });
}
function gE(e, t) {
  let n = `SELECT id, file_id, symbol_kind, simple_name, display_name, qualified_name,
              signature, containing_symbol_id, line_start, line_end,
              is_external_stub, skeleton_content
       FROM symbols`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ae(
            e,
            `${n}
             WHERE file_id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((r) => {
    let s = r;
    return {
      id: s.id,
      fileId: s.file_id,
      symbolKind: s.symbol_kind,
      simpleName: s.simple_name,
      displayName: s.display_name,
      qualifiedName: s.qualified_name,
      signature: s.signature,
      containingSymbolId: s.containing_symbol_id,
      lineStart: s.line_start,
      lineEnd: s.line_end,
      isExternalStub: s.is_external_stub,
      skeletonContent: s.skeleton_content,
    };
  });
}
function pE(e, t) {
  return t.length === 0
    ? []
    : ae(
        e,
        `SELECT id, file_id, symbol_kind, simple_name, display_name, qualified_name,
              signature, containing_symbol_id, line_start, line_end,
              is_external_stub, skeleton_content
       FROM symbols
     WHERE id IN (`,
        t,
        ") ORDER BY id",
      ).map((r) => {
        let s = r;
        return {
          id: s.id,
          fileId: s.file_id,
          symbolKind: s.symbol_kind,
          simpleName: s.simple_name,
          displayName: s.display_name,
          qualifiedName: s.qualified_name,
          signature: s.signature,
          containingSymbolId: s.containing_symbol_id,
          lineStart: s.line_start,
          lineEnd: s.line_end,
          isExternalStub: s.is_external_stub,
          skeletonContent: s.skeleton_content,
        };
      });
}
function hE(e, t) {
  let n = new Map(t.map((s) => [s.id, s])),
    i = new Set(),
    r = (s) => {
      let o = s;
      for (; o !== null;) {
        let a = n.get(o);
        if (a) {
          o = a.containingSymbolId;
          continue;
        }
        i.add(o);
        break;
      }
    };
  for (let s of t) r(s.containingSymbolId);
  for (; i.size > 0;) {
    let s = pE(e, [...i]);
    i.clear();
    for (let o of s) n.set(o.id, o);
    for (let o of s) r(o.containingSymbolId);
  }
  return [...n.values()].sort((s, o) => s.id - o.id);
}
function IE(e) {
  return e === "class" || e === "interface" || e === "struct";
}
function bE(e, t) {
  if (e.length === 0) return null;
  let n = e.map((i) => {
    let r = 0;
    return (
      i.projectionKind === null && (r += 100),
      t && i.vfsPath.startsWith(t) && (r += 50),
      i.vfsPath.includes(".cs:") && (r += 10),
      { candidate: i, score: r }
    );
  });
  return (
    n.sort((i, r) => r.score - i.score || i.candidate.vfsPath.localeCompare(r.candidate.vfsPath)),
    n[0]?.candidate.vfsPath ?? null
  );
}
function SE(e, t) {
  if (t.length === 0) return new Map();
  let n = ae(
    e,
    `SELECT symbols.id AS symbol_id, files.project_rel_path AS project_rel_path
     FROM symbols
     JOIN files ON files.id = symbols.file_id
     WHERE symbols.id IN (`,
    t,
    ")",
  );
  return new Map(n.map((i) => [i.symbol_id, i.project_rel_path.replace(/\\/g, "/")]));
}
function _E(e, t) {
  let n = ve(t);
  if (n.length === 0) return new Map();
  let i = SE(e, n),
    r = new Map();
  for (let o of Pe(n)) {
    let a = ae(
      e,
      `SELECT source_symbol_id, vfs_path, projection_kind
       FROM vfs_entries
       WHERE source_symbol_id IN (`,
      o,
      ") ORDER BY source_symbol_id, id",
    );
    for (let l of a) {
      let c = r.get(l.source_symbol_id) ?? [];
      (c.push({ vfsPath: l.vfs_path, projectionKind: l.projection_kind }), r.set(l.source_symbol_id, c));
    }
  }
  let s = new Map();
  for (let o of n) {
    let a = r.get(o);
    if (!a) continue;
    let l = bE(a, i.get(o) ?? null);
    l && s.set(o, l);
  }
  return s;
}
function EE(e, t) {
  let n = `SELECT sb.source_symbol_id, sb.target_symbol_id, sb.binding_kind, sb.resolution_status
       FROM semantic_bindings sb`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ae(
            e,
            `${n}
               JOIN symbols s ON s.id = sb.source_symbol_id
               WHERE s.file_id IN (`,
            t,
            ") ORDER BY sb.id",
          )
      : e
          .prepare(
            `${n}
             ORDER BY sb.id`,
          )
          .all()
  ).map((r) => {
    let s = r;
    return {
      sourceSymbolId: s.source_symbol_id,
      targetSymbolId: s.target_symbol_id,
      bindingKind: s.binding_kind,
      resolutionStatus: s.resolution_status,
    };
  });
}
function xf(e, t) {
  let n = `SELECT id, file_id, asset_kind, name, vfs_root_path
       FROM assets`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ae(
            e,
            `${n}
             WHERE file_id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((r) => {
    let s = r;
    return { id: s.id, fileId: s.file_id, assetKind: s.asset_kind, name: s.name, vfsRootPath: s.vfs_root_path };
  });
}
function RE(e, t) {
  let n = `SELECT e.id, e.asset_id, e.yaml_object_id, e.entity_kind, e.local_key, e.name, e.hierarchy_name, e.hierarchy_order, e.type_name,
              e.script_symbol_id, e.parent_entity_id, e.source_entity_id,
              e.line_start, e.line_end, e.generated_content
       FROM entities e`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ae(
            e,
            `${n}
               JOIN assets a ON a.id = e.asset_id
               WHERE a.file_id IN (`,
            t,
            ") ORDER BY e.id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((r) => {
    let s = r;
    return {
      id: s.id,
      assetId: s.asset_id,
      yamlObjectId: s.yaml_object_id,
      entityKind: s.entity_kind,
      localKey: s.local_key,
      name: s.name,
      hierarchyName: s.hierarchy_name,
      hierarchyOrder: s.hierarchy_order,
      typeName: s.type_name,
      scriptSymbolId: s.script_symbol_id,
      parentEntityId: s.parent_entity_id,
      sourceEntityId: s.source_entity_id,
      lineStart: s.line_start,
      lineEnd: s.line_end,
      generatedContent: s.generated_content,
    };
  });
}
function wE(e, t) {
  let n = `SELECT id,
              file_id,
              source_yaml_object_id,
              field_path,
              target_guid,
              target_file_id,
              target_local_id,
              ref_kind
       FROM yaml_references`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ae(
            e,
            `${n}
             WHERE file_id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((r) => {
    let s = r;
    return {
      id: s.id,
      fileId: s.file_id,
      sourceYamlObjectId: s.source_yaml_object_id,
      fieldPath: s.field_path,
      targetGuid: s.target_guid,
      targetFileId: s.target_file_id,
      targetLocalId: s.target_local_id,
      refKind: s.ref_kind,
    };
  });
}
function PE(e, t) {
  let n = `SELECT e.id AS entity_id, r.target_guid
       FROM entities e
       JOIN assets a ON a.id = e.asset_id
       JOIN yaml_references r
         ON r.file_id = a.file_id
        AND r.source_yaml_object_id = e.yaml_object_id
       WHERE e.entity_kind = 'prefab_instance'
         AND r.field_path = 'm_SourcePrefab'
         AND r.target_guid IS NOT NULL`,
    i =
      t !== void 0
        ? t.length === 0
          ? []
          : ae(
              e,
              `${n}
               AND a.file_id IN (`,
              t,
              ") ORDER BY e.id",
            )
        : e.prepare(`${n} ORDER BY e.id`).all();
  return new Map(i.map((r) => [r.entity_id, r.target_guid]));
}
function vE(e, t) {
  let n = (r) => {
      let s =
          r === "gameobject"
            ? `hierarchy_object.file_id = child_asset.file_id
           AND hierarchy_object.game_object_file_id = child.local_key`
            : "hierarchy_object.id = child.yaml_object_id",
        o = r === "gameobject" ? "m_Father" : "m_Modification.m_TransformParent",
        a = "CROSS JOIN",
        l =
          r === "gameobject"
            ? `yaml_objects hierarchy_object
           INDEXED BY idx_yaml_objects_game_object_file_id`
            : "yaml_objects hierarchy_object",
        c = `yaml_references parent_ref
           INDEXED BY idx_yaml_references_source_object`,
        d = `yaml_objects stripped_transform
           INDEXED BY idx_yaml_objects_local_identifier`,
        u = `yaml_references source_ref
           INDEXED BY idx_yaml_references_source_object`,
        m =
          r === "gameobject"
            ? `${a} yaml_references prefab_instance_ref
             INDEXED BY idx_yaml_references_source_object
           ON prefab_instance_ref.source_yaml_object_id = stripped_transform.id
          AND prefab_instance_ref.field_path = 'm_PrefabInstance'
          AND coalesce(
                prefab_instance_ref.target_local_id,
                prefab_instance_ref.target_file_id
              ) <> '0'`
            : "",
        y = `SELECT child.id AS entity_id,
              source_ref.target_guid AS source_guid,
              coalesce(source_ref.target_local_id, source_ref.target_file_id)
                AS source_local_id
       FROM entities child
       JOIN assets child_asset ON child_asset.id = child.asset_id
       ${a} ${l}
         ON ${s}
       ${a} ${c}
         ON parent_ref.source_yaml_object_id = hierarchy_object.id
        AND parent_ref.field_path = '${o}'
       ${a} ${d}
         ON stripped_transform.file_id = child_asset.file_id
        AND stripped_transform.local_identifier = coalesce(
          parent_ref.target_local_id,
          parent_ref.target_file_id
        )
       ${m}
       ${a} ${u}
         ON source_ref.source_yaml_object_id = stripped_transform.id
        AND source_ref.field_path = 'm_CorrespondingSourceObject'
       WHERE child.entity_kind = '${r}'
         AND source_ref.target_guid IS NOT NULL
         AND coalesce(source_ref.target_local_id, source_ref.target_file_id)
           IS NOT NULL`;
      return t !== void 0
        ? t.length === 0
          ? []
          : ae(
              e,
              `${y}
               AND child_asset.file_id IN (`,
              t,
              ")",
            )
        : e.prepare(y).all();
    },
    i = [...n("gameobject"), ...n("prefab_instance")].sort((r, s) => r.entity_id - s.entity_id);
  return new Map(i.map((r) => [r.entity_id, { sourceGuid: r.source_guid, sourceLocalId: r.source_local_id }]));
}
function xE(e, t, n) {
  return e
    .prepare(
      `SELECT id, file_id, source_yaml_object_id, field_path, target_guid,
              target_file_id, target_local_id, ref_kind
       FROM yaml_references
       WHERE id > ?
       ORDER BY id
       LIMIT ?`,
    )
    .all(t, n)
    .map((r) => ({
      id: r.id,
      fileId: r.file_id,
      sourceYamlObjectId: r.source_yaml_object_id,
      fieldPath: r.field_path,
      targetGuid: r.target_guid,
      targetFileId: r.target_file_id,
      targetLocalId: r.target_local_id,
      refKind: r.ref_kind,
    }));
}
function kE(e, t) {
  let n = `SELECT ee.from_entity_id, ee.to_entity_id, ee.edge_kind, ee.edge_subkind
       FROM entity_edges ee`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : uu(
            e,
            (r) => `${n}
               JOIN entities e_from ON e_from.id = ee.from_entity_id
               JOIN entities e_to ON e_to.id = ee.to_entity_id
               JOIN assets a_from ON a_from.id = e_from.asset_id
               JOIN assets a_to ON a_to.id = e_to.asset_id
               WHERE a_from.file_id IN (${r})
                 AND a_to.file_id IN (${r})
               ORDER BY ee.id`,
            t,
            2,
          )
      : e
          .prepare(
            `${n}
             ORDER BY ee.id`,
          )
          .all()
  ).map((r) => {
    let s = r;
    return {
      fromEntityId: s.from_entity_id,
      toEntityId: s.to_entity_id,
      edgeKind: s.edge_kind,
      edgeSubkind: s.edge_subkind,
    };
  });
}
function ME(e, t, n) {
  return e
    .prepare(
      `SELECT id, from_entity_id, to_entity_id, edge_kind, edge_subkind
       FROM entity_edges
       WHERE id > ?
       ORDER BY id
       LIMIT ?`,
    )
    .all(t, n)
    .map((r) => ({
      id: r.id,
      fromEntityId: r.from_entity_id,
      toEntityId: r.to_entity_id,
      edgeKind: r.edge_kind,
      edgeSubkind: r.edge_subkind,
    }));
}
function TE(e, t) {
  let n = `SELECT ese.from_entity_id, ese.to_symbol_id, ese.edge_kind, ese.edge_subkind
       FROM entity_symbol_edges ese`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ae(
            e,
            `${n}
             JOIN entities entity ON entity.id = ese.from_entity_id
             JOIN assets asset ON asset.id = entity.asset_id
             WHERE asset.file_id IN (`,
            t,
            ") ORDER BY ese.id",
          )
      : e.prepare(`${n} ORDER BY ese.id`).all()
  ).map((r) => {
    let s = r;
    return {
      fromEntityId: s.from_entity_id,
      toSymbolId: s.to_symbol_id,
      edgeKind: s.edge_kind,
      edgeSubkind: s.edge_subkind,
    };
  });
}
async function UE(e, t, n) {
  let i = 0,
    r = Math.min(t, e.length);
  async function s() {
    for (;;) {
      let o = i;
      if (((i += 1), o >= e.length)) return;
      await n(e[o]);
    }
  }
  await Promise.all(Array.from({ length: r }, () => s()));
}
function AE(e) {
  let t = new Set();
  return (
    e.forEach((n) => {
      let i = ht.posix.dirname(n.projectRelPath);
      for (; i !== "." && i !== "";) (t.add(i), (i = ht.posix.dirname(i)));
    }),
    [...t].sort((n, i) => n.localeCompare(i))
  );
}
function OE(e) {
  let t = ht.posix.dirname(e);
  return t === "." || t === "" ? null : t;
}
function $r(e, t) {
  switch (e) {
    case "csharp":
    case "asmdef":
    case "asset":
    case "scene":
    case "prefab":
    case "yaml-asset":
      return Lr(t, e);
    case "package-manifest":
      return "package_manifest";
    default:
      return e.replace(/-/g, "_");
  }
}
function FE(e) {
  return ["namespace", "class", "interface", "struct", "enum"].includes(e) ? "container" : "leaf";
}
function NE(e) {
  return ["gameobject", "subasset", "texture", "sprite"].includes(e) ? "container" : "leaf";
}
function kf(e) {
  switch (e) {
    case "gameobject":
      return "gameobject";
    case "component":
      return "component";
    case "subasset":
      return "subasset";
    default:
      return e;
  }
}
function Sa(e) {
  return (e.name ?? e.typeName).trim() || e.typeName;
}
function LE(e) {
  return yt(Sa(e), e.entityKind);
}
function Br(e) {
  let t = e.hierarchyName?.trim();
  if (!t) return LE(e);
  if (!ei(e.entityKind) && e.parentEntityId && t.includes("/") && !Zn(t)) {
    let n = ht.posix.basename(t) || t;
    return yt(n, e.entityKind);
  }
  return yt(t, e.entityKind);
}
function Mf(e) {
  let t = e.endsWith("/") ? e.slice(0, -1) : e;
  return ht.posix.basename(t);
}
function ha(e) {
  return e.entryType === "file" && e.sourceFileId !== null
    ? mr(e.sourceFileId)
    : e.entryKind === "file_content" && e.sourceFileId !== null
      ? yr(e.sourceFileId)
      : e.entryType === "link" && e.sourceEntityId !== null
        ? xo(e.sourceEntityId)
        : e.sourceEntityId !== null && e.entryType === "node" && e.projectionKind !== "prefab_inherited"
          ? e.vfsLogicalKey?.startsWith("entity_file_local:")
            ? e.vfsLogicalKey
            : qt(e.sourceEntityId)
          : e.sourceSymbolId !== null && e.sourceFileId !== null
            ? ti(e.sourceFileId, e.sourceSymbolId)
            : e.entryType === "directory"
              ? hn(e.vfsPath)
              : hn(e.vfsPath);
}
function Ia(e) {
  return e.sourceVfsPath
    ? e.projectionKind === "prefab_inherited" && e.sourceEntityId !== null
      ? qt(e.sourceEntityId)
      : hn(e.sourceVfsPath)
    : null;
}
function DE(e) {
  return e.sourceSymbolId !== null
    ? "symbol_containment"
    : e.sourceEntityId !== null
      ? "entity_hierarchy"
      : e.entryType === "directory" || e.entryType === "file"
        ? "directory_parent"
        : "vfs_parent";
}
function CE(e) {
  return e.kind === "scene" || e.kind === "prefab" || e.kind === "yaml-asset" || Qe(e.projectRelPath) === "unity-yaml";
}
var jE = [
  "m_Script",
  "m_Father",
  "m_GameObject",
  "m_TransformParent",
  "m_CorrespondingSourceObject",
  "m_PrefabInstance",
  "m_PrefabAsset",
  "m_SourcePrefab",
  "m_ProbeAnchor",
  "m_LightmapParameters",
  "m_StaticBatchRoot",
];
function BE(e) {
  return jE.some((t) => e === t || e.endsWith(`.${t}`));
}
function $E(e) {
  return e.startsWith("0000000000000000");
}
function GE(e) {
  let t = K(e.targetProjectRelPath, "file"),
    n = e.targetFileId?.trim() || e.targetLocalId?.trim() || null;
  if (!n) return t;
  let i = e.projectRelPathToFileId.get(e.targetProjectRelPath);
  if (!i) return t;
  let r = e.localFileIdToVfsPathByFileId.get(i)?.get(n);
  if (!r) return t;
  let s = r.endsWith("/") ? "container" : "leaf";
  return K(Re(`${e.targetProjectRelPath}:`, r), s);
}
function KE(e, t) {
  if (e.length === 0) return null;
  let n = e.filter((i) => gi(i.entityKind));
  return n.length > 0 ? (n.find((i) => Dr(i.entityKind, t)) ?? null) : (e[0] ?? null);
}
function Tf(e) {
  e.yamlReferences.forEach((t) => {
    if (t.refKind !== "guid-file" || !t.targetGuid || BE(t.fieldPath) || $E(t.targetGuid)) return;
    let n = KE(e.sourceEntitiesByYamlObjectId.get(t.sourceYamlObjectId) ?? [], t.fieldPath);
    if (!n) return;
    let i = e.entityEntryPathById.get(n.id);
    if (!i) return;
    let r = e.guidToProjectRelPath.get(t.targetGuid);
    if (!r) return;
    let s = e.fileById.get(t.fileId);
    if (!s || r === s.projectRelPath || (n.entityKind === "component" && n.scriptSymbolId && r.endsWith(".cs"))) return;
    let o = GE({
      targetProjectRelPath: r,
      targetFileId: t.targetFileId,
      targetLocalId: t.targetLocalId,
      projectRelPathToFileId: e.projectRelPathToFileId,
      localFileIdToVfsPathByFileId: e.localFileIdToVfsPathByFileId,
    });
    i !== o && e.insertEdge(i, o);
  });
}
function YE(e) {
  let t = new Map();
  for (let n of e) {
    if (n.yamlObjectId === null) continue;
    let i = t.get(n.yamlObjectId) ?? [];
    (i.push(n), t.set(n.yamlObjectId, i));
  }
  return t;
}
function Uf(e, t, n) {
  let i = new Map();
  return (
    e.forEach((r) => {
      if (r.entityKind === "prefab_instance") return;
      let s = t.get(r.id),
        o = n.get(r.assetId);
      if (!s || !o || Nf(r)) return;
      let a = `${o.vfsRootPath}:/`;
      if (!s.startsWith(a)) return;
      let l = s.slice(a.length),
        c = i.get(o.fileId);
      (c || ((c = new Map()), i.set(o.fileId, c)), c.set(r.localKey, l));
    }),
    i
  );
}
function Nf(e) {
  return Cr(e.localKey) && e.parentEntityId === null;
}
function VE(e) {
  let t = new Map();
  (e.entities.forEach((n) => {
    n.entityKind === "material" && t.set(n.assetId, n);
  }),
    e.assetById.forEach((n) => {
      let i = e.fileById.get(n.fileId);
      if (!i || !Gr(i)) return;
      let r = t.get(n.id);
      if (!r || !e.shouldDeferSourceContent(i.id)) return;
      let s = e.normalizeCanonical(i.projectRelPath, "file");
      e.insertEntry({
        entryType: "node",
        entryKind: "material",
        vfsPath: e.normalizeCanonical(si(s), "leaf"),
        parentVfsPath: s,
        sourceFileId: i.id,
        sourceSymbolId: null,
        sourceEntityId: r.id,
        displayName: ".content",
        content: null,
        metaContent: null,
        lineStart: r.lineStart,
        lineEnd: r.lineEnd,
        targetVfsPath: null,
        projectionKind: null,
        sizeBytes: 0,
      });
    }));
}
function Gr(e) {
  return $r(e.kind, e.projectRelPath) === "material";
}
function ba(e) {
  e.metaContent && (e.metaContent = Fu(e.metaContent));
}
function WE(e, t) {
  if (e < t)
    throw new Error(
      `Entry identity cache capacity (${e}) must be at least the entry batch size (${t}) so unflushed paths cannot be evicted`,
    );
}
var _a = class {
  constructor(t, n) {
    this.capacity = n;
    this.statement = t.prepare("SELECT id FROM vfs_entries WHERE project_id = 1 AND vfs_path = ?");
  }
  capacity;
  cache = new Map();
  statement;
  byPath(t) {
    let n = this.cache.get(t);
    if (n !== void 0) return (this.cache.delete(t), this.cache.set(t, n), n);
    let i = this.statement.get(t);
    return (i && this.remember(t, i.id), i?.id);
  }
  remember(t, n) {
    for (this.cache.delete(t), this.cache.set(t, n); this.cache.size > this.capacity;) {
      let i = this.cache.keys().next().value;
      if (i === void 0) break;
      this.cache.delete(i);
    }
  }
  clear() {
    this.cache.clear();
  }
};
function pt(e, t) {
  let n = e
    .prepare(
      `SELECT id, vfs_path, instance_root_vfs_path
       FROM vfs_entries
       WHERE project_id = 1 AND vfs_logical_key = ?
       ORDER BY id
       LIMIT 1`,
    )
    .get(t);
  return n ? { id: n.id, vfsPath: n.vfs_path, instanceRootVfsPath: n.instance_root_vfs_path } : void 0;
}
function qE(e) {
  return e.prepare("SELECT materialization_generation FROM projects WHERE id = 1").get().materialization_generation;
}
function zE(e) {
  return e
    .prepare(
      `UPDATE projects
       SET materialization_generation = materialization_generation + 1
       WHERE id = 1
       RETURNING materialization_generation`,
    )
    .get().materialization_generation;
}
function HE(e, t, n) {
  for (let i of Pe(t)) {
    let r = we(i.length);
    e.prepare(
      `DELETE FROM vfs_entries
         WHERE project_id = 1
           AND host_file_id IN (${r})
           AND materialization_generation < ?`,
    ).run(...i, n);
  }
}
function JE(e, t) {
  let n = e.prepare("DELETE FROM vfs_entries WHERE id = ?"),
    i = t.generation !== void 0,
    r = e.prepare(`SELECT id, entry_type, entry_kind, file_family, vfs_path, parent_vfs_path,
            host_file_id, source_file_id, source_symbol_id, source_entity_id,
            display_name,
            content, meta_content, line_start, line_end, size_bytes,
            target_vfs_path, projection_kind, source_vfs_path,
            source_owner_vfs_path, instance_root_vfs_path, vfs_logical_key,
            source_logical_key, materialization_generation
     FROM vfs_entries INDEXED BY ${i ? "idx_vfs_entries_file_generation" : "idx_vfs_entries_source_file_id"}
     WHERE project_id = 1
       AND source_file_id IS NOT NULL
       ${i ? "AND materialization_generation = ?" : ""}
       AND (source_file_id, id) > (?, ?)
     ORDER BY source_file_id, id
     LIMIT ?`),
    s = 0,
    o = 0,
    a = null,
    l = null;
  for (;;) {
    let c = i ? [t.generation, s, o, wf] : [s, o, wf],
      d = r.all(...c).map(Lf);
    if (d.length === 0) break;
    let u = d[d.length - 1];
    ((s = u.sourceFileId), (o = u.id));
    for (let m = 0; m < d.length;) {
      let y = d[m].sourceFileId,
        p = m + 1;
      for (; p < d.length && d[p].sourceFileId === y;) p += 1;
      a !== y && ((a = y), (l = null));
      let g = t.fileById.get(y);
      if (g) {
        let h = d.slice(m, p),
          S = h.map((b) => ({ entry: b, fileId: y }));
        l === null && S.some((b) => iR(b, g, t)) && (l = nR(g.absPath));
        let _ = ZE(g, S, t, l),
          E = new Set(_.map((b) => b.id));
        Bu(e, _);
        for (let b of h) E.has(b.id) || n.run(b.id);
      }
      m = p;
    }
  }
}
function Lf(e) {
  let t = e;
  return {
    id: Number(t.id),
    entryType: t.entry_type,
    entryKind: String(t.entry_kind),
    fileFamily: t.file_family ?? null,
    vfsPath: String(t.vfs_path),
    parentVfsPath: t.parent_vfs_path ?? null,
    hostFileId: t.host_file_id ?? null,
    sourceFileId: t.source_file_id ?? null,
    sourceSymbolId: t.source_symbol_id ?? null,
    sourceEntityId: t.source_entity_id ?? null,
    displayName: String(t.display_name),
    childOrder: t.child_order === void 0 ? void 0 : Number(t.child_order),
    content: t.content ?? null,
    metaContent: t.meta_content ?? null,
    lineStart: t.line_start ?? null,
    lineEnd: t.line_end ?? null,
    sizeBytes: Number(t.size_bytes),
    targetVfsPath: t.target_vfs_path ?? null,
    projectionKind: t.projection_kind ?? null,
    sourceVfsPath: t.source_vfs_path ?? null,
    sourceOwnerVfsPath: t.source_owner_vfs_path ?? null,
    instanceRootVfsPath: t.instance_root_vfs_path ?? null,
    vfsLogicalKey: t.vfs_logical_key ?? null,
    sourceLogicalKey: t.source_logical_key ?? null,
    materializationGeneration: Number(t.materialization_generation),
  };
}
function XE(e, t, n, i) {
  let r = 0;
  for (;;) {
    let s = i.scoped ? [n, r, 512] : [r, 512],
      o = i.scoped ? "vfs_entries INDEXED BY idx_vfs_entries_generation_id" : "vfs_entries NOT INDEXED",
      a = i.scoped ? "AND materialization_generation = ?" : "",
      l = e
        .prepare(
          `SELECT id, entry_type, vfs_path, parent_vfs_path,
                source_symbol_id, source_entity_id
         FROM ${o}
         WHERE project_id = 1
           AND parent_vfs_path IS NOT NULL
           ${a}
           AND id > ?
         ORDER BY id
         LIMIT ?`,
        )
        .all(...s);
    if (l.length === 0) break;
    r = l[l.length - 1].id;
    for (let c of l)
      t(
        c.vfs_path,
        c.parent_vfs_path,
        "child_of",
        DE({ entryType: c.entry_type, sourceSymbolId: c.source_symbol_id, sourceEntityId: c.source_entity_id }),
      );
  }
}
function QE(e, t) {
  let n = t === void 0 ? "" : "AND materialization_generation = ?";
  return e
    .prepare(
      `SELECT COUNT(*) AS count
       FROM vfs_entries
       WHERE project_id = 1
         ${n}
         AND (COALESCE(content, '') <> '' OR COALESCE(meta_content, '') <> '')`,
    )
    .get(...(t === void 0 ? [] : [t])).count;
}
function ZE(e, t, n, i) {
  return t.flatMap((r) => {
    let s = rR(r.entry, e, n, i);
    if (s === "") return tR(r.entry) ? [] : [r.entry];
    if (!s) return [r.entry];
    let o = sR(r.entry, s, n.fileById, n.guidToProjectRelPath, n.localFileIdToVfsPathByFileId),
      a = oR(o);
    return [{ ...r.entry, content: a, sizeBytes: eR(r.entry, o) }];
  });
}
function eR(e, t) {
  return e.entryType === "file" || e.entryKind === "file_content" ? e.sizeBytes : Buffer.byteLength(t, "utf8");
}
function tR(e) {
  return (
    e.entryType === "node" &&
    e.displayName === ".content" &&
    (e.entryKind === "file_content" || e.entryKind === "material")
  );
}
function nR(e) {
  try {
    return Af(fE(e, "utf8"));
  } catch {
    return Af("");
  }
}
function Af(e) {
  return { raw: e, normalized: Sf(e), lineStarts: _f(e) };
}
function iR(e, t, n) {
  if (Df(e.entry) || Cf(e.entry, t, n, null) !== null || !Ir(t.projectRelPath, t.sizeBytes)) return !1;
  let i = e.entry.sourceEntityId !== null ? n.entityById.get(e.entry.sourceEntityId) : void 0;
  return i && aa(i.entityKind)
    ? !0
    : e.entry.entryType === "file" || e.entry.entryKind === "file_content"
      ? !(e.entry.entryType === "file" && Gr(t))
      : e.entry.lineStart !== null && e.entry.lineEnd !== null;
}
function rR(e, t, n, i) {
  if (Df(e)) return null;
  let r = Cf(e, t, n, i?.normalized ?? null);
  if (r !== null) return r;
  if (i === null || !Ir(t.projectRelPath, t.sizeBytes)) return null;
  if (e.entryType === "file" || e.entryKind === "file_content") return e.entryType === "file" && Gr(t) ? null : i.raw;
  if (e.lineStart !== null && e.lineEnd !== null) {
    let s = pa(i.raw, i.lineStarts, e.lineStart, e.lineEnd),
      o = e.sourceEntityId !== null ? n.entityById.get(e.sourceEntityId) : void 0;
    if (o?.entityKind !== "gameobject") return s;
    let a = n.transformEntitiesByGameObjectEntityId.get(o.id);
    return a?.length
      ? a.reduce((l, c) => {
          let d = pa(i.raw, i.lineStarts, c.lineStart, c.lineEnd),
            u = l.endsWith(`
`)
              ? ""
              : `
`;
          return `${l}${u}${d}`;
        }, s)
      : s;
  }
  return null;
}
function Df(e) {
  return e.entryType === "file" || e.projectionKind === "prefab_inherited";
}
function Cf(e, t, n, i) {
  if (e.sourceEntityId === null && e.sourceSymbolId !== null) {
    let s = n.symbolById.get(e.sourceSymbolId);
    if (s && IE(s.symbolKind) && s.skeletonContent?.trim()) return s.skeletonContent;
  }
  if (e.sourceEntityId === null) return null;
  let r = n.entityById.get(e.sourceEntityId);
  return r
    ? gi(r.entityKind) || uf(r.entityKind)
      ? r.generatedContent?.trim()
        ? r.generatedContent
        : null
      : aa(r.entityKind)
        ? r.generatedContent?.trim()
          ? r.generatedContent
          : !t || !i
            ? null
            : (Qu(i, tn(t.guid, t.projectRelPath)).get(r.localKey) ?? null)
        : (ca(e.entryKind) || ya(e.entryKind)) && r.generatedContent?.trim()
          ? r.generatedContent
          : null
    : null;
}
function sR(e, t, n, i, r) {
  if (ca(e.entryKind)) return rf(t, i);
  if (ya(e.entryKind)) return If(t, i);
  if (!e.sourceFileId) return t;
  let s = n.get(e.sourceFileId);
  if (!s || !CE(s) || (e.entryType === "file" && e.entryKind === "material")) return t;
  let o = Lu(t, { guidToProjectRelPath: i, localFileIdToVfsPath: r.get(e.sourceFileId) ?? new Map() });
  return e.entryKind === "material" && e.entryType === "node" && Gr(s) ? Zo(o.text, i) : o.text;
}
function oR(e) {
  return e.includes("\r")
    ? e
        .replace(
          /\r\n/g,
          `
`,
        )
        .replace(
          /\r/g,
          `
`,
        )
    : e;
}
import { readdir as RR, readFile as wR, realpath as PR } from "node:fs/promises";
import Mt from "node:path";
import { availableParallelism as Kr } from "node:os";
var aR = 8,
  lR = 32,
  cR = 4;
function Yr(e, t) {
  if (!e) return t;
  let n = Number.parseInt(e, 10);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function Ra(e = process.env, t = Kr()) {
  let n = Math.max(1, Math.floor(t)),
    i = n <= 4 ? n - 1 : Math.floor(n * 0.75),
    r = Math.max(1, Math.min(aR, i)),
    s = Yr(e.UNITY_INSIGHT_INDEX_CPU_BUDGET, r);
  return Math.min(s, n);
}
function jf(e = process.env, t = Kr()) {
  return Yr(e.UNITY_INSIGHT_YAML_PARSE_CONCURRENCY, Ra(e, t));
}
function Bf(e = process.env, t = Kr()) {
  return Yr(e.UNITY_INSIGHT_FILE_PREPARE_CONCURRENCY, Ra(e, t));
}
function $f(e = process.env, t = Kr()) {
  let n = Math.min(lR, Math.max(cR, Ra(e, t) * 4));
  return Yr(e.UNITY_INSIGHT_DISCOVERY_FILE_CONCURRENCY, n);
}
import { stat as dR } from "node:fs/promises";
async function Vr(e) {
  try {
    return await dR(e);
  } catch {
    return null;
  }
}
async function sn(e) {
  return (await Vr(e))?.isDirectory() ?? !1;
}
import { fileURLToPath as uR } from "node:url";
import { readdir as Kf, readFile as fR, realpath as mR } from "node:fs/promises";
import Ne from "node:path";
var yR = { embedded: 0, "local-file": 1, "package-cache": 2 };
async function Yf(e) {
  let t = Ne.resolve(e),
    n = [],
    i = await gR(t, n),
    r = await pR(t, n),
    s = [...(await hR(t, n)), ...(await IR(t, i, n)), ...(await SR(t, i, r, n))];
  s.sort((l, c) => (l.priority !== c.priority ? l.priority - c.priority : l.packageName.localeCompare(c.packageName)));
  let o = new Map(),
    a = new Map();
  for (let l of s) {
    let c = o.get(l.packageName);
    if (c) {
      n.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: l.virtualRoot,
        message: `Skipped duplicate package source for ${l.packageName}; using ${c.sourceKind} source at ${c.physicalRoot}.`,
      });
      continue;
    }
    let d = a.get(l.realRoot);
    if (d) {
      n.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: l.diagnosticPath,
        message: `Skipped package source ${l.packageName}; ${d.packageName} already uses the same real directory.`,
      });
      continue;
    }
    (o.set(l.packageName, l), a.set(l.realRoot, l));
  }
  return {
    sources: [...o.values()]
      .sort((l, c) => l.virtualRoot.localeCompare(c.virtualRoot))
      .map(({ priority: l, diagnosticPath: c, ...d }) => d),
    diagnostics: n,
  };
}
async function gR(e, t) {
  let n = Ne.join(e, "Packages", "manifest.json"),
    i = await ka(n, t, { filePath: "Packages/manifest.json", missingIsDiagnostic: !1 }),
    r = new Map(),
    s = i && Un(i) && Un(i.dependencies) ? i.dependencies : {};
  for (let [o, a] of Object.entries(s)) typeof a == "string" && r.set(o, a);
  return r;
}
async function pR(e, t) {
  let n = Ne.join(e, "Packages", "packages-lock.json"),
    i = await ka(n, t, { filePath: "Packages/packages-lock.json", missingIsDiagnostic: !1 }),
    r = new Map(),
    s = i && Un(i) && Un(i.dependencies) ? i.dependencies : {};
  for (let [o, a] of Object.entries(s)) {
    if (!Un(a)) continue;
    let l = a.version,
      c = a.source;
    r.set(o, { version: typeof l == "string" ? l : void 0, source: typeof c == "string" ? c : void 0 });
  }
  return r;
}
async function hR(e, t) {
  let n = Ne.join(e, "Packages"),
    i = await Kf(n, { withFileTypes: !0 }).catch(() => []);
  return (
    await Promise.all(
      i.map(async (s) => {
        if (s.name === "manifest.json" || s.name === "packages-lock.json") return null;
        let o = Ne.join(n, s.name);
        if (!(await sn(o))) return null;
        let l =
          (await xa(o, t, `Packages/${s.name}/package.json`, { fallbackName: s.name, diagnosticOnFallback: !1 })) ??
          (ER(s.name) ? s.name : null);
        return l
          ? va({ packageName: l, physicalRoot: o, sourceKind: "embedded", diagnosticPath: `Packages/${l}` })
          : null;
      }),
    )
  ).filter((s) => s !== null);
}
async function IR(e, t, n) {
  let i = [];
  for (let [r, s] of t) {
    if (!Pa(s)) continue;
    let o = _R(e, s);
    if (!(await sn(o))) {
      n.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: "Packages/manifest.json",
        message: `Skipped local package ${r}; package root does not exist: ${o}.`,
      });
      continue;
    }
    let a = (await xa(o, n, "Packages/manifest.json", { fallbackName: r, diagnosticOnFallback: !0 })) ?? r;
    i.push(
      await va({ packageName: a, physicalRoot: o, sourceKind: "local-file", diagnosticPath: "Packages/manifest.json" }),
    );
  }
  return i;
}
var bR = new Set(["registry", "builtin"]);
async function SR(e, t, n, i) {
  let r = [],
    s = Ne.join(e, "Library", "PackageCache"),
    o = new Set(t.keys()),
    a = new Set(n.keys());
  for (let [l, c] of n) {
    if (!c.version || (c.source !== void 0 && !bR.has(c.source)) || Pa(t.get(l) ?? "")) continue;
    let d = Ne.join(s, `${l}@${c.version}`);
    if (await sn(d)) {
      r.push(await wa(l, d, i, "Packages/packages-lock.json"));
      continue;
    }
    if (
      (i.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: "Packages/packages-lock.json",
        message: `Package cache directory is missing for ${l}@${c.version}.`,
      }),
      o.has(l))
    ) {
      let u = await Gf(s, l, i);
      u && r.push(await wa(l, u, i, "Packages/packages-lock.json"));
    }
  }
  for (let l of o) {
    if (n.size > 0 || a.has(l) || Pa(t.get(l) ?? "")) continue;
    let c = await Gf(s, l, i);
    c && r.push(await wa(l, c, i, "Packages/manifest.json"));
  }
  return r;
}
async function wa(e, t, n, i) {
  let r = (await xa(t, n, i, { fallbackName: e, diagnosticOnFallback: !1 })) ?? e;
  return va({ packageName: r, physicalRoot: t, sourceKind: "package-cache", diagnosticPath: i });
}
async function Gf(e, t, n) {
  let i = await Kf(e, { withFileTypes: !0 }).catch(() => []),
    r = (
      await Promise.all(
        i.map(async (s) => {
          let o = Ne.join(e, s.name);
          return !s.name.startsWith(`${t}@`) || !(await sn(o)) ? null : o;
        }),
      )
    )
      .filter((s) => s !== null)
      .sort();
  return (
    r.length > 1 &&
      n.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: "Packages/manifest.json",
        message: `Multiple package cache directories match ${t}; using ${Ne.basename(r.at(-1) ?? r[0] ?? "")}.`,
      }),
    r.at(-1) ?? null
  );
}
async function va(e) {
  let t = Ne.resolve(e.physicalRoot),
    n = await mR(t);
  return {
    packageName: e.packageName,
    physicalRoot: t,
    realRoot: n,
    virtualRoot: `Packages/${e.packageName}`,
    sourceKind: e.sourceKind,
    priority: yR[e.sourceKind],
    diagnosticPath: e.diagnosticPath,
  };
}
async function xa(e, t, n, i) {
  let r = Ne.join(e, "package.json"),
    s = await ka(r, t, { filePath: n, missingIsDiagnostic: i.diagnosticOnFallback }),
    o = s && Un(s) && typeof s.name == "string" ? s.name : null;
  return (
    !o &&
      i.diagnosticOnFallback &&
      t.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: n,
        message: `Package ${i.fallbackName} has no readable package.json name; using the manifest dependency name.`,
      }),
    o
  );
}
async function ka(e, t, n) {
  try {
    return JSON.parse(await fR(e, "utf8"));
  } catch (i) {
    return i instanceof Error && "code" in i && i.code === "ENOENT"
      ? (n.missingIsDiagnostic &&
          t.push({
            severity: "warning",
            category: "discovery",
            stage: "discovery",
            filePath: n.filePath,
            message: `Missing package metadata file: ${e}.`,
          }),
        null)
      : (t.push({
          severity: "warning",
          category: "discovery",
          stage: "discovery",
          filePath: n.filePath,
          message: `Could not parse JSON file ${e}: ${String(i)}.`,
        }),
        null);
  }
}
function Pa(e) {
  return e.startsWith("file:");
}
function _R(e, t) {
  if (t.startsWith("file://"))
    try {
      return uR(t);
    } catch {
      return Ne.resolve(Ne.join(e, "Packages"), t.slice(7));
    }
  return Ne.resolve(Ne.join(e, "Packages"), t.slice(5));
}
function ER(e) {
  return /^[a-z0-9]+(?:[.-][a-z0-9]+)+$/i.test(e);
}
function Un(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
async function vR(e, t, n) {
  let i = new Array(e.length),
    r = 0,
    s = Math.min(t, e.length);
  async function o() {
    for (;;) {
      let a = r;
      if (((r += 1), a >= e.length)) return;
      i[a] = await n(e[a], a);
    }
  }
  return (await Promise.all(Array.from({ length: s }, () => o())), i);
}
async function Ii(e, t = {}) {
  let n = Mt.resolve(e),
    i = [],
    s = (t.includePackages ?? !0) ? await Yf(n) : { sources: [], diagnostics: [] };
  i.push(...s.diagnostics);
  let o = [
      ...(await Ma({ physicalRoot: Mt.join(n, "Assets"), virtualRoot: "Assets", diagnostics: i })),
      ...(await Ma({ physicalRoot: Mt.join(n, "ProjectSettings"), virtualRoot: "ProjectSettings", diagnostics: i })),
      ...(await xR(n)),
      ...(
        await Promise.all(
          s.sources.map((l) => Ma({ physicalRoot: l.physicalRoot, virtualRoot: l.virtualRoot, diagnostics: i })),
        )
      ).flat(),
    ],
    a = await vR(o, $f(), async ({ absolutePath: l, projectRelPath: c, sizeBytes: d, mtimeMs: u }) => {
      let m = kt(c);
      if (!m) return null;
      let y = { projectRelPath: c, absolutePath: l, kind: m, sizeBytes: d, mtimeMs: u };
      if (m !== "meta") return y;
      let p = Tn(await wR(l, "utf8"));
      return {
        ...y,
        guid: p.guid ?? void 0,
        importerType: p.importerType ?? void 0,
        metaMainObjectFileId: p.mainObjectFileId ?? void 0,
      };
    });
  return {
    projectPath: n,
    diagnostics: i,
    files: a.filter((l) => l !== null).sort((l, c) => l.projectRelPath.localeCompare(c.projectRelPath)),
  };
}
async function xR(e) {
  let t = [
    { absolutePath: Mt.join(e, "Packages", "manifest.json"), projectRelPath: "Packages/manifest.json" },
    { absolutePath: Mt.join(e, "Packages", "packages-lock.json"), projectRelPath: "Packages/packages-lock.json" },
  ];
  return (
    await Promise.all(
      t.map(async (i) => {
        let r = await Vr(i.absolutePath);
        return r?.isFile() ? { ...i, sizeBytes: r.size, mtimeMs: Math.trunc(r.mtimeMs) } : null;
      }),
    )
  ).filter((i) => i !== null);
}
async function Ma(e) {
  return (await sn(e.physicalRoot)) ? Vf(e.physicalRoot, e.physicalRoot, e.virtualRoot, e.diagnostics, new Set()) : [];
}
async function Vf(e, t, n, i, r) {
  let s;
  try {
    s = await PR(t);
  } catch (l) {
    return (
      i.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: n,
        message: `Skipped unreadable directory ${t}: ${String(l)}.`,
      }),
      []
    );
  }
  if (r.has(s))
    return (
      i.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: n,
        message: `Skipped package symlink loop at ${t}.`,
      }),
      []
    );
  r.add(s);
  let o = await RR(t, { withFileTypes: !0 }).catch(
    (l) => (
      i.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: n,
        message: `Skipped unreadable directory ${t}: ${String(l)}.`,
      }),
      []
    ),
  );
  return (
    await Promise.all(
      o.map(async (l) => {
        let c = Mt.join(t, l.name),
          d = await Vr(c);
        if (!d) return [];
        if (l.name.endsWith("~") && d.isDirectory()) return [];
        if (d.isDirectory()) return Vf(e, c, n, i, r);
        if (!d.isFile()) return [];
        let u = kR(Mt.relative(e, c));
        return u.startsWith("../") || u === ".."
          ? (i.push({
              severity: "warning",
              category: "discovery",
              stage: "discovery",
              filePath: n,
              message: `Skipped file outside discovery root: ${c}.`,
            }),
            [])
          : [{ absolutePath: c, projectRelPath: `${n}/${u}`, sizeBytes: d.size, mtimeMs: Math.trunc(d.mtimeMs) }];
      }),
    )
  ).flat();
}
function kR(e) {
  return e.split(Mt.sep).join("/");
}
import { createHash as U0 } from "node:crypto";
import { createReadStream as A0 } from "node:fs";
import { readFile as gc } from "node:fs/promises";
import { createRequire as MR } from "node:module";
import zf from "../resources/web-tree-sitter/tree-sitter.cjs";
var Wf = MR(import.meta.url),
  Ta = null,
  qf = zf;
async function Hf() {
  return (
    Ta ||
      (Ta = (async () => {
        await zf.init({
          locateFile(n) {
            return __unityInsightFileURLToPath(new URL(`../resources/web-tree-sitter/${n}`, import.meta.url));
          },
        });
        let e = await qf.Language.load(__unityInsightFileURLToPath(new URL("../resources/tree-sitter-c_sharp.wasm", import.meta.url))),
          t = new qf();
        return (t.setLanguage(e), t);
      })()),
    Ta
  );
}
var TR = new Set(["class_declaration", "interface_declaration", "struct_declaration"]),
  UR = new Set(["field_declaration", "event_declaration", "event_field_declaration", "indexer_declaration"]);
function Jf(e, t) {
  try {
    if (!TR.has(t.type)) return null;
    let n = AR(t);
    if (!n) return null;
    let i = e.indexOf("{", n.startIndex),
      r = e.lastIndexOf("}", t.endIndex);
    if (i < 0 || r < i || r > t.endIndex) return null;
    let s = e.slice(t.startIndex, i + 1).trimEnd();
    if (!s) return null;
    let o = OR(e, n).map((c) => e.slice(c.startIndex, c.endIndex).trimEnd()),
      a =
        o.length > 0
          ? `
${o.join(`

`)}
`
          : `
`,
      l = `${s}${a}}`;
    return l.trim().length > 0 ? l : null;
  } catch {
    return null;
  }
}
function AR(e) {
  return e.childForFieldName("body") ?? e.namedChildren.find((t) => t.type === "declaration_list") ?? null;
}
function OR(e, t) {
  let n = [],
    i = t.namedChildren;
  return (
    i.forEach((r, s) => {
      UR.has(r.type) && n.push({ startIndex: FR(e, i, s), endIndex: r.endIndex });
    }),
    n
  );
}
function FR(e, t, n) {
  let i = t[n]?.startIndex ?? 0;
  for (let r = n - 1; r >= 0; r -= 1) {
    let s = t[r];
    if (s.type !== "attribute_list") break;
    if (!e.slice(s.endIndex, i).trim()) {
      i = s.startIndex;
      continue;
    }
    break;
  }
  return i;
}
var NR = new Map([
  ["class_declaration", "class"],
  ["constructor_declaration", "constructor"],
  ["enum_declaration", "enum"],
  ["interface_declaration", "interface"],
  ["method_declaration", "method"],
  ["namespace_declaration", "namespace"],
  ["property_declaration", "property"],
  ["struct_declaration", "struct"],
]);
async function Qf(e) {
  let n = (await Hf()).parse(e);
  try {
    let i = [],
      r = [];
    return (Zf(n.rootNode, e, [], null, i, r), { declarations: i, mentions: r });
  } finally {
    n.delete();
  }
}
function Zf(e, t, n, i, r, s) {
  let o = NR.get(e.type),
    a = o ? e.childForFieldName("name") : null,
    l = null,
    c = n;
  if (o && a) {
    let u = a.text.split(".").pop() ?? a.text,
      m = [...n, a.text].join(".");
    ((l = {
      declKind: o,
      simpleName: u,
      qualifiedNameText: m,
      signatureText: jR(e.text),
      skeletonText: LR(o) ? Jf(t, e) : null,
      lineStart: e.startPosition.row + 1,
      lineEnd: e.endPosition.row + 1,
    }),
      r.push(l),
      (c = [...n, a.text]));
  }
  CR(e) && s.push(DR(e, i));
  let d = l ?? i;
  e.namedChildren.forEach((u) => {
    Zf(u, t, c, d, r, s);
  });
}
function LR(e) {
  return e === "class" || e === "interface" || e === "struct";
}
function DR(e, t) {
  return {
    mentionKind: e.type === "identifier" ? "identifier" : "qualified-name",
    text: e.text,
    receiverText: e.type === "member_access_expression" ? (e.childForFieldName("expression")?.text ?? null) : null,
    argumentArity: BR(e),
    containingDeclarationSimpleName: t?.simpleName ?? null,
    lineStart: e.startPosition.row + 1,
    lineEnd: e.endPosition.row + 1,
  };
}
function CR(e) {
  if (e.type === "identifier") {
    let t = e.parent;
    if (!t) return !1;
    let n = t.childForFieldName?.("name") ?? null;
    return !((n && $R(n, e)) || Xf(e, ["member_access_expression", "qualified_name"]));
  }
  return Xf(e, ["member_access_expression", "qualified_name"])
    ? !1
    : e.type === "member_access_expression" || e.type === "qualified_name";
}
function Xf(e, t) {
  let n = e.parent;
  for (; n;) {
    if (t.includes(n.type)) return !0;
    n = n.parent;
  }
  return !1;
}
function jR(e) {
  return e.split(/\r?\n/, 1)[0]?.trim() ?? "";
}
function BR(e) {
  let t =
    (e.type === "member_access_expression" && e.parent?.type === "invocation_expression") ||
    e.parent?.type === "invocation_expression"
      ? e.parent
      : null;
  if (!t) return null;
  let n = t.childForFieldName("arguments") ?? t.namedChildren.find((i) => i.type === "argument_list") ?? null;
  return n ? n.namedChildren.filter((i) => i.type !== ",").length : 0;
}
function $R(e, t) {
  return e.type === t.type && e.startIndex === t.startIndex && e.endIndex === t.endIndex;
}
var He = Od(uc(), 1);
function fn(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  let n = e[t];
  return typeof n == "string" ? n : typeof n == "number" ? String(n) : typeof n == "bigint" ? n.toString() : null;
}
function Ys(e, t, n, i) {
  if (Array.isArray(e)) {
    e.forEach((r, s) => {
      Ys(r, t, `${n}[${s}]`, i);
    });
    return;
  }
  if (!(!e || typeof e != "object")) {
    if (g0(e)) {
      let r = fn(e, "guid"),
        s = fn(e, "fileID"),
        o = fn(e, "localIdentifierInFile");
      (r || (s && s !== "0")) &&
        i.push({
          sourceLocalIdentifier: t,
          fieldPath: n,
          targetGuid: r,
          targetFileId: s,
          targetLocalId: o,
          refKind: r ? "guid-file" : "local-file",
        });
      return;
    }
    Object.entries(e).forEach(([r, s]) => {
      let o = n ? `${n}.${r}` : r;
      Ys(s, t, o, i);
    });
  }
}
function g0(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  let t = Object.keys(e);
  return t.includes("fileID") || t.includes("guid") || t.includes("localIdentifierInFile");
}
var Gg = {
    gameObjectFileId: 1,
    parentTransformLocalId: 2,
    childTransformLocalIds: 4,
    prefabInstanceLocalId: 8,
    prefabTransformParentLocalId: 16,
    prefabRootName: 32,
  },
  Kg = new WeakMap();
function Yg(e) {
  let t = Hi(e, /^[ \t]*m_GameObject\s*:/m, /m_GameObject:\s*\{\s*fileID:\s*([^,}\s]+)/),
    n = Hi(e, /^[ \t]*m_Father\s*:/m, /m_Father:\s*\{\s*fileID:\s*([^,}\s]+)/),
    i = h0(e),
    r = Hi(e, /^[ \t]*m_PrefabInstance\s*:/m, /m_PrefabInstance:\s*\{\s*fileID:\s*([^,}\s]+)/),
    s = Hi(e, /^[ \t]*m_SourcePrefab\s*:/m, /m_SourcePrefab:\s*\{[^}]*guid:\s*([^,}\s]+)/),
    o = Hi(e, /^[ \t]*m_TransformParent\s*:/m, /m_TransformParent:\s*\{\s*fileID:\s*([^,}\s]+)/),
    a = I0(e),
    l = {
      gameObjectFileId: t.value,
      parentTransformLocalId: n.value,
      childTransformLocalIds: i.value,
      prefabInstanceLocalId: r.value,
      sourcePrefabGuid: s.value,
      prefabTransformParentLocalId: o.value,
      prefabRootName: a.value,
    },
    c = 0,
    d = [
      ["gameObjectFileId", t],
      ["parentTransformLocalId", n],
      ["childTransformLocalIds", i],
      ["prefabInstanceLocalId", r],
      ["prefabTransformParentLocalId", o],
      ["prefabRootName", a],
    ];
  for (let [u, m] of d) m.covered && (c |= Gg[u]);
  return (Kg.set(l, c), l);
}
function Vg(e, t) {
  return {
    gameObjectFileId: t?.gameObjectFileId ?? Ke(e, ["m_GameObject"]),
    parentTransformLocalId: t?.parentTransformLocalId ?? Ke(e, ["m_Father"]),
    childTransformLocalIds: t?.childTransformLocalIds ?? zg(e, ["m_Children"]),
    prefabInstanceLocalId: t?.prefabInstanceLocalId ?? Ke(e, ["m_PrefabInstance"]),
  };
}
function Ke(e, t) {
  let n = e;
  for (let i of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return null;
    n = n[i];
  }
  return Kn(n);
}
function Kn(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  let t = e,
    n = fc(t.fileID);
  if (n) return n;
  let i = fc(t.m_FileID),
    r = fc(t.m_PathID);
  return i ? null : r;
}
function p0(e, t) {
  let n = _0();
  if (!t || typeof t != "object" || Array.isArray(t)) return n;
  let i = Ke(t, ["m_PrefabInstance"]);
  if (e === "Transform" || e === "RectTransform")
    return {
      ...n,
      gameObjectFileId: Ke(t, ["m_GameObject"]),
      parentTransformLocalId: Ke(t, ["m_Father"]),
      childTransformLocalIds: zg(t, ["m_Children"]),
      prefabInstanceLocalId: i,
    };
  if (e === "PrefabInstance") {
    let r = t.m_Modification;
    return {
      ...n,
      prefabInstanceLocalId: i,
      prefabTransformParentLocalId: Ke(r, ["m_TransformParent"]),
      prefabRootName: S0(r),
    };
  }
  return { ...n, prefabInstanceLocalId: i };
}
function Wg(e, t, n, i = new Map()) {
  let r = new Map();
  for (let s of e) {
    let o = t.get(s.id),
      a = o ? (Kg.get(o) ?? 0) : 0,
      l,
      c = () => ((l ??= p0(s.objectType, b0(s, i))), l),
      d = (m) => {
        let y = o?.[m];
        return y != null || (a & Gg[m]) !== 0 ? y : c()[m];
      },
      u = n.get(s.id);
    r.set(s.id, {
      gameObjectFileId: d("gameObjectFileId"),
      parentTransformLocalId: d("parentTransformLocalId"),
      childTransformLocalIds: d("childTransformLocalIds"),
      prefabInstanceLocalId: d("prefabInstanceLocalId"),
      sourcePrefabGuid: u?.get("m_SourcePrefab") ?? o?.sourcePrefabGuid ?? null,
      prefabTransformParentLocalId: d("prefabTransformParentLocalId"),
      prefabRootName: d("prefabRootName"),
    });
  }
  return r;
}
function mn(e, t) {
  let n = e;
  for (let i of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return null;
    n = n[i];
  }
  return typeof n == "string" ? (n === "0" ? null : n) : typeof n == "number" ? (n === 0 ? null : String(n)) : null;
}
function qg(e, t) {
  let n = e;
  for (let i of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return null;
    n = n[i];
  }
  if (typeof n == "number") return Number.isSafeInteger(n) ? n : null;
  if (typeof n == "string") {
    let i = n.trim();
    if (!/^-?\d+$/.test(i)) return null;
    let r = Number(i);
    return Number.isSafeInteger(r) ? r : null;
  }
  return null;
}
function zg(e, t) {
  let n = e;
  for (let i of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return [];
    n = n[i];
  }
  return Array.isArray(n) ? n.map((i) => Kn(i)).filter((i) => i !== null) : [];
}
function Hi(e, t, n) {
  let i = e.match(n),
    r = i?.[1];
  return { value: r === void 0 ? null : mc(r), covered: i !== null || !t.test(e) };
}
function h0(e) {
  let t = e.match(/^[ \t]*m_Children:\s*([^\r\n]*)/m);
  if (!t) return { value: void 0, covered: !0 };
  if (t[1]?.trim() === "[]") return { value: [], covered: !0 };
  let n = e.match(/^[ \t]*m_Children:\s*\r?\n((?:[ \t]*-[^\r\n]*(?:\r?\n|$))*)/m)?.[1];
  return n === void 0
    ? { value: void 0, covered: !1 }
    : {
        value: [...n.matchAll(/\{\s*fileID:\s*([^,}\s]+)/g)]
          .map((i) => i[1])
          .filter((i) => i !== void 0 && i !== "0")
          .map(mc),
        covered: !0,
      };
}
function I0(e) {
  let t = e.match(/propertyPath:\s*m_Name\s*\n\s*value:\s*([^\n\r]+)/m),
    n = t?.[1]?.trim();
  return { value: n ? mc(n) : null, covered: t !== null || !/^[ \t]*(?:-\s*)?propertyPath:\s*m_Name\s*$/m.test(e) };
}
function mc(e) {
  return Buffer.from(e, "utf8").toString("utf8");
}
function b0(e, t) {
  if (typeof t == "function") return t(e);
  if (!t.has(e.id)) throw new Error(`YAML payload ${e.id} was not hydrated for metadata enrichment.`);
  return t.get(e.id);
}
function S0(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  let t = e.m_Modifications;
  if (!Array.isArray(t)) return null;
  for (let n of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) continue;
    let i = n;
    if (i.propertyPath === "m_Name" && typeof i.value == "string") return i.value.trim() || null;
  }
  return null;
}
function fc(e) {
  return typeof e == "string"
    ? e === "0"
      ? null
      : e
    : typeof e == "number"
      ? e === 0
        ? null
        : String(e)
      : typeof e == "bigint"
        ? e === 0n
          ? null
          : e.toString()
        : null;
}
function _0() {
  return {
    gameObjectFileId: null,
    parentTransformLocalId: null,
    sourcePrefabGuid: null,
    prefabTransformParentLocalId: null,
    prefabRootName: null,
  };
}
var Hg = { intAsBigInt: !0, uniqueKeys: !1 };
function Xg() {
  return { splitBlocksMs: 0, parseDocumentsMs: 0, collectReferencesMs: 0 };
}
function Vs(e) {
  return e.length >= 5 && e.subarray(0, 5).toString("ascii") === "%YAML";
}
function Qg(e, t) {
  let n = t ? Date.now() : 0,
    i = /^--- !u!(\d+)\s+&([^\s]+)(?:\s+.*)?$/gm,
    r = [...e.matchAll(i)],
    s = 1,
    o = e.indexOf(`
`),
    a = 0,
    l = (u) => {
      if (u < a) throw new Error(`lineNumberAt requires non-decreasing offsets, received ${u} after ${a}`);
      for (a = u; o >= 0 && o < u;)
        ((s += 1),
          (o = e.indexOf(
            `
`,
            o + 1,
          )));
      return s;
    };
  t && (t.splitBlocksMs += Date.now() - n);
  let c = [],
    d = [];
  return (
    r.forEach((u, m) => {
      let y = u.index ?? 0,
        p = m + 1 < r.length ? (r[m + 1].index ?? e.length) : e.length,
        g = e.indexOf(
          `
`,
          y,
        );
      if (g < 0 || g >= p) return;
      let h = e
        .slice(g + 1, p)
        .trimEnd()
        .replace(
          /\r\n/g,
          `
`,
        );
      if (h.length === 0) return;
      let S = Number(u[1]),
        _ = u[2] ?? null,
        E = h.indexOf(`
`),
        R = (E < 0 ? h : h.slice(0, E)).match(/^([A-Za-z0-9_]+):\s*$/);
      if (!R) return;
      let v = R[1],
        T = t ? Date.now() : 0,
        x = E0(h),
        $ = { objectType: v, rootObjectCount: 0, nameCount: 0, name: null },
        Y = k0(x.contents, $)?.[v] ?? {},
        V = _.split(/\s+/)[0],
        G = l(y),
        re = G + x0(h) + 1,
        W = $.rootObjectCount === 1 && $.nameCount === 1 ? $.name : null;
      (t && (t.parseDocumentsMs += Date.now() - T),
        c.push({
          docIndex: m,
          unityClassId: S,
          anchor: _,
          objectType: v,
          localIdentifier: V,
          gameObjectFileId: fn(Y.m_GameObject, "fileID"),
          componentTypeName: v === "MonoBehaviour" ? v : null,
          scriptGuid: fn(Y.m_Script, "guid"),
          scriptFileId: fn(Y.m_Script, "fileID"),
          name: W,
          payload: Y,
          metadata: Yg(h),
          lineStart: G,
          lineEnd: re,
        }));
      let ce = t ? Date.now() : 0;
      (Ys(Y, V, "", d), t && (t.collectReferencesMs += Date.now() - ce));
    }),
    { objects: c, references: d }
  );
}
function E0(e) {
  let t = He.default.parseDocument(e, Hg);
  if (t.errors.length === 0) return t;
  let n = R0(e);
  if (n === e) throw new Error(t.errors.map((r) => r.message).join("; "));
  let i = He.default.parseDocument(n, Hg);
  if (i.errors.length > 0) throw new Error(i.errors.map((r) => r.message).join("; "));
  return i;
}
function R0(e) {
  return v0(w0(e));
}
function w0(e) {
  let t = e.split(/\r?\n/),
    n = [],
    i = !1;
  for (let r = 0; r < t.length; r += 1) {
    let s = t[r] ?? "",
      o = s.match(/^(\s*[^:\n]+:\s*)'(.*)$/);
    if (!o) {
      n.push(s);
      continue;
    }
    let a = o[1] ?? "",
      l = Jg(o[2] ?? "");
    if (l.closed) {
      n.push(s);
      continue;
    }
    let c = l.value,
      d = [s],
      u = r + 1,
      m = !1;
    for (; u < t.length; u += 1) {
      let y = t[u] ?? "";
      d.push(y);
      let p = Jg(y.replace(/^\s+/, ""));
      if (
        (p.value.length === 0
          ? p.closed ||
            (c += `
`)
          : (c = P0(c, p.value)),
        p.closed)
      ) {
        m = !0;
        break;
      }
    }
    if (!m) {
      (n.push(...d), (r = u - 1));
      continue;
    }
    ((i = !0), n.push(`${a}${JSON.stringify(c.replace(/\n+$/, ""))}`), (r = u));
  }
  return i
    ? n.join(`
`)
    : e;
}
function Jg(e) {
  let t = "";
  for (let n = 0; n < e.length; n += 1) {
    let i = e[n];
    if (i === "'") {
      if (e[n + 1] === "'") {
        ((t += "'"), (n += 1));
        continue;
      }
      return { value: t, closed: !0 };
    }
    t += i;
  }
  return { value: t, closed: !1 };
}
function P0(e, t) {
  return e.length === 0 ||
    e.endsWith(`
`)
    ? `${e}${t}`
    : `${e} ${t}`;
}
function v0(e) {
  let t = e.split(/\r?\n/);
  if (t.length < 2 || !/^[A-Za-z0-9_]+:\s*$/.test(t[0] ?? "")) return e;
  let n = !1,
    i = t.map((r, s) => (s > 0 && r.length > 0 && !/^\s/.test(r) ? ((n = !0), `  ${r}`) : r));
  return n
    ? i.join(`
`)
    : e;
}
function x0(e) {
  let t = 0;
  for (
    let n = e.indexOf(`
`);
    n >= 0;
    n = e.indexOf(
      `
`,
      n + 1,
    )
  )
    t += 1;
  return t;
}
function k0(e, t) {
  if (!(0, He.isMap)(e)) return St(e);
  let n = {};
  for (let i of e.items) {
    let r = String(St(i.key)),
      s = r === t.objectType;
    s && (t.rootObjectCount += 1);
    let o = s ? M0(i.value, t) : St(i.value);
    yc(n, r, o);
  }
  return n;
}
function M0(e, t) {
  if (!(0, He.isMap)(e)) return St(e);
  let n = {};
  for (let i of e.items) {
    let r = String(St(i.key));
    (r === "m_Name" && ((t.nameCount += 1), (t.name = T0(i.value))), yc(n, r, St(i.value)));
  }
  return n;
}
function St(e) {
  if (e == null) return null;
  if ((0, He.isScalar)(e)) return typeof e.value == "bigint" ? e.value.toString() : e.value;
  if ((0, He.isSeq)(e)) return e.items.map((t) => St(t));
  if ((0, He.isMap)(e)) {
    let t = {};
    for (let n of e.items) {
      let i = String(St(n.key));
      yc(t, i, St(n.value));
    }
    return t;
  }
  return e;
}
function T0(e) {
  if (e === null) return "";
  if (!(0, He.isScalar)(e)) return null;
  let t = e;
  return typeof t.value == "string"
    ? t.value
    : typeof t.source == "string"
      ? t.source
      : t.value === null || t.value === void 0
        ? ""
        : String(t.value);
}
function yc(e, t, n) {
  let i = e[t];
  Object.hasOwn(e, t) ? (Array.isArray(i) ? i.push(n) : (e[t] = [i, n])) : (e[t] = n);
}
function O0(e) {
  let t = e.filter((n) => n.kind === "csharp").length;
  return { totalWorkUnits: e.length + t, csharpFileCount: t };
}
function Zg(e, t) {
  let n = e.get(t);
  if (n === void 0) throw new Error(`Missing assigned file ID for '${t}'.`);
  return n;
}
async function F0(e, t = {}, n = {}) {
  let i = new Map(),
    r = new Map();
  e.forEach((a, l) => {
    (r.set(a.projectRelPath, l + 1), a.kind === "meta" && i.set(a.projectRelPath.slice(0, -5), a));
  });
  let s = n.pathToFileId ?? r,
    o = 0;
  return N0(e, Bf(), async (a) => {
    let l = a.kind === "meta" ? void 0 : i.get(a.projectRelPath),
      c = a.kind === "meta" || l ? null : await B0(a.absolutePath),
      d = l ? Zg(s, l.projectRelPath) : (n.metaPathToFileId?.get(`${a.projectRelPath}.meta`) ?? null),
      u = Zg(s, a.projectRelPath),
      m = await L0(a.absolutePath),
      y = await D0(a, t.diagnostics ?? []),
      p = {
        id: u,
        projectRelPath: a.projectRelPath,
        absolutePath: a.absolutePath,
        kind: a.kind,
        guid: a.guid ?? l?.guid ?? c?.guid ?? null,
        metaFileId: d,
        sizeBytes: a.sizeBytes,
        mtimeMs: a.mtimeMs,
        contentHash: m,
        importerType: a.importerType ?? l?.importerType ?? c?.importerType ?? null,
        contentText: y,
      };
    return ((o += 1), t.onProgress?.(o, e.length), p);
  });
}
async function N0(e, t, n) {
  let i = new Array(e.length),
    r = 0,
    s = Math.min(t, e.length);
  async function o() {
    for (;;) {
      let a = r;
      if (((r += 1), a >= e.length)) return;
      i[a] = await n(e[a], a);
    }
  }
  return (await Promise.all(Array.from({ length: s }, () => o())), i);
}
async function L0(e) {
  let t = U0("sha256");
  return (
    await new Promise((n, i) => {
      let r = A0(e);
      (r.on("data", (s) => {
        t.update(s);
      }),
        r.once("error", i),
        r.once("end", n));
    }),
    t.digest("hex")
  );
}
async function D0(e, t) {
  if (!C0(e.projectRelPath)) return null;
  let n = await gc(e.absolutePath);
  return j0(e, n, t);
}
function C0(e) {
  let t = Qe(e);
  return t === "unity-yaml" || t === "meta" ? !1 : ii(e) !== "binary";
}
function j0(e, t, n) {
  return ii(e.projectRelPath) === "binary"
    ? null
    : Qe(e.projectRelPath) === "unity-yaml"
      ? Vs(t)
        ? t.toString("utf8")
        : null
      : t.toString("utf8");
}
async function B0(e) {
  try {
    return Tn(await gc(`${e}.meta`, "utf8"));
  } catch {
    return null;
  }
}
var $0 = new Set(["asmdef", "asmref", "package-manifest"]);
async function ep(e) {
  return Promise.all(
    e.map(async (t) => {
      let n = null;
      return (
        $0.has(t.kind) && (n = await gc(t.absolutePath, "utf8").catch(() => null)),
        { projectRelPath: t.projectRelPath, kind: t.kind, contentText: n }
      );
    }),
  );
}
function pc(e, t, n, i, r, s, o) {
  if (t.kind === "skipped_binary")
    return (
      e.projectRelPath.startsWith("ProjectSettings/") ||
        n.push({
          severity: "warning",
          category: "extract",
          stage: "extract",
          filePath: e.projectRelPath,
          message: "Skipped binary Unity asset; only text YAML serialization is indexed.",
        }),
      { nextObjectId: i, nextReferenceId: r }
    );
  if (t.kind === "error")
    return (
      n.push({
        severity: "warning",
        category: "extract",
        stage: "extract",
        filePath: e.projectRelPath,
        message: `Failed to parse YAML file: ${t.message}`,
      }),
      { nextObjectId: i, nextReferenceId: r }
    );
  let a = new Map();
  return (
    t.extracted.objects.forEach((l) => {
      let c = i;
      ((i += 1), a.set(l.localIdentifier, c), s.push(G0(e.id, c, l)));
    }),
    t.extracted.references.forEach((l) => {
      let c = a.get(l.sourceLocalIdentifier);
      c &&
        (o.push({
          id: r,
          fileId: e.id,
          sourceYamlObjectId: c,
          fieldPath: l.fieldPath,
          targetGuid: l.targetGuid,
          targetFileId: l.targetFileId,
          targetLocalId: l.targetLocalId,
          refKind: l.refKind,
        }),
        (r += 1));
    }),
    { nextObjectId: i, nextReferenceId: r }
  );
}
function G0(e, t, n) {
  return {
    id: t,
    fileId: e,
    docIndex: n.docIndex,
    unityClassId: n.unityClassId,
    anchor: n.anchor,
    objectType: n.objectType,
    localIdentifier: n.localIdentifier,
    gameObjectFileId: n.gameObjectFileId,
    componentTypeName: n.componentTypeName,
    scriptGuid: n.scriptGuid,
    scriptFileId: n.scriptFileId,
    name: n.name,
    lineStart: n.lineStart,
    lineEnd: n.lineEnd,
  };
}
function tp(e, t) {
  if (!e || t.length === 0) return;
  let n = 0,
    i = 0,
    r = 0;
  for (let s of t) ((n += s.splitBlocksMs), (i += s.parseDocumentsMs), (r += s.collectReferencesMs));
  (e.recordDuration("split_yaml_blocks", n),
    e.recordDuration("parse_yaml_documents", i),
    e.recordDuration("collect_yaml_references", r));
}
async function np(e, t, n, i, r = {}) {
  if (n.length === 0) return { extractedFileCount: 0, refreshedYamlFileIds: [] };
  let s = e.prepare("SELECT id, project_rel_path FROM files").all(),
    o = new Map(s.map((h) => [h.project_rel_path, h.id])),
    a = new Map(s.filter((h) => h.project_rel_path.endsWith(".meta")).map((h) => [h.project_rel_path, h.id])),
    l = ye(e, "files"),
    c = new Map();
  for (let h of n) {
    let S = o.get(h.projectRelPath);
    S !== void 0 ? c.set(h.projectRelPath, S) : c.set(h.projectRelPath, l++);
  }
  let d = await F0(n, { diagnostics: i, onProgress: () => {} }, { pathToFileId: c, metaPathToFileId: a });
  for (let h of [...d].sort((S, _) => (S.kind === _.kind ? S.id - _.id : S.kind === "meta" ? -1 : 1)))
    o.has(h.projectRelPath) ? vu(e, h) : (xu(e, h), o.set(h.projectRelPath, h.id));
  let { totalWorkUnits: u } = O0(n),
    m = 0,
    y = (h) => {
      r.onProgress?.(m, u, h);
    },
    { declarationRows: p, mentionRows: g } = await K0(
      d,
      i,
      {
        onProgress: (h, S) => {
          ((m = n.length + h), y(`Parsing C# sources (${h}/${S})`));
        },
      },
      { nextDeclarationId: ye(e, "cs_declarations"), nextMentionId: ye(e, "cs_mentions") },
    );
  return (
    Mu(e, p, g),
    {
      extractedFileCount: d.length,
      refreshedYamlFileIds: d.filter((h) => Qe(h.projectRelPath) === "unity-yaml").map((h) => h.id),
    }
  );
}
async function K0(e, t, n = {}, i = {}) {
  let r = e.filter((d) => d.kind === "csharp"),
    s = [],
    o = [],
    a = i.nextDeclarationId ?? 1,
    l = i.nextMentionId ?? 1,
    c = 0;
  for (let d of r)
    try {
      let u = await Qf(d.contentText ?? ""),
        m = u.declarations.map((y) => ({
          id: a++,
          fileId: d.id,
          declKind: y.declKind,
          simpleName: y.simpleName,
          qualifiedNameText: y.qualifiedNameText,
          signatureText: y.signatureText,
          skeletonText: y.skeletonText ?? null,
          lineStart: y.lineStart,
          lineEnd: y.lineEnd,
        }));
      (s.push(...m),
        u.mentions.forEach((y) => {
          if (!y.containingDeclarationSimpleName) return;
          let p = m.find(
            (g) =>
              g.simpleName === y.containingDeclarationSimpleName &&
              g.lineStart <= y.lineStart &&
              g.lineEnd >= y.lineEnd,
          );
          p &&
            o.push({
              id: l++,
              fileId: d.id,
              mentionKind: y.mentionKind,
              text: y.text,
              receiverText: y.receiverText,
              argumentArity: y.argumentArity,
              containingDeclarationId: p.id,
              lineStart: y.lineStart,
              lineEnd: y.lineEnd,
            });
        }));
    } catch (u) {
      t.push({
        severity: "error",
        category: "extract",
        stage: "extract",
        filePath: d.projectRelPath,
        message: `Failed to parse C# file: ${Y0(u)}`,
      });
    } finally {
      ((c += 1), n.onProgress?.(c, r.length));
    }
  return { declarationRows: s, mentionRows: o };
}
function Y0(e) {
  return e instanceof Error ? e.message : String(e);
}
import { createHash as W0 } from "node:crypto";
import { readFile as q0 } from "node:fs/promises";
function V0(e) {
  return e.replace(/\\/g, "/");
}
function ip(e, t) {
  let n = V0(e);
  return !n.startsWith("Assets/") || n.endsWith(".meta") ? !0 : t.has(`${n}.meta`);
}
function rp(e) {
  return e.deleted.length > 0 && e.created.length === 0 && e.modified.length === 0;
}
function z0(e, t) {
  return e.absolutePath === t.absolutePath && e.mtimeMs === t.mtimeMs && e.sizeBytes === t.sizeBytes;
}
async function yn(e) {
  let t = await q0(e);
  return W0("sha256").update(t).digest("hex");
}
function Ws(e) {
  return e
    .prepare(
      `SELECT id, project_rel_path, abs_path, content_hash, mtime_ms, size_bytes
       FROM files
       ORDER BY id`,
    )
    .all()
    .map((t) => {
      let n = t;
      return {
        id: n.id,
        projectRelPath: n.project_rel_path,
        absolutePath: n.abs_path,
        contentHash: n.content_hash,
        mtimeMs: n.mtime_ms,
        sizeBytes: n.size_bytes,
      };
    });
}
async function sp(e, t, n = {}) {
  let i = await Ii(e, { includePackages: n.includePackages }),
    r = Ws(t),
    s = new Map(r.map((y) => [y.projectRelPath, y])),
    o = new Map(i.files.map((y) => [y.projectRelPath, y])),
    a = new Set(i.files.map((y) => y.projectRelPath)),
    l = [],
    c = [],
    d = [],
    u = [];
  for (let y of i.files) {
    let p = s.get(y.projectRelPath);
    if (!p && !ip(y.projectRelPath, a)) continue;
    if (!p) {
      l.push(y);
      continue;
    }
    if (z0(y, p)) {
      d.push(y.projectRelPath);
      continue;
    }
    if ((await yn(y.absolutePath)) !== p.contentHash) {
      c.push({ discovered: y, fileId: p.id });
      continue;
    }
    (d.push(y.projectRelPath),
      u.push({
        fileId: p.id,
        projectRelPath: y.projectRelPath,
        absolutePath: y.absolutePath,
        mtimeMs: y.mtimeMs,
        sizeBytes: y.sizeBytes,
      }));
  }
  let m = r.filter((y) => !o.has(y.projectRelPath)).map((y) => ({ projectRelPath: y.projectRelPath, fileId: y.id }));
  return { created: l, modified: c, deleted: m, unchanged: d, metadataStale: u };
}
function op(e, t = 50) {
  return {
    createdCount: e.created.length,
    modifiedCount: e.modified.length,
    deletedCount: e.deleted.length,
    movedCount: e.moved?.length ?? 0,
    unchangedCount: e.unchanged.length,
    createdPaths: e.created.map((n) => n.projectRelPath).slice(0, t),
    modifiedPaths: e.modified.map((n) => n.discovered.projectRelPath).slice(0, t),
    deletedPaths: e.deleted.map((n) => n.projectRelPath).slice(0, t),
    movedPaths: (e.moved ?? []).map((n) => `${n.oldProjectRelPath} -> ${n.discovered.projectRelPath}`).slice(0, t),
  };
}
function hc(e) {
  return e.endsWith(".meta");
}
function H0(e) {
  return hc(e) ? e.slice(0, -5) : `${e}.meta`;
}
function ap(e, t) {
  if (t.length === 0) return new Map();
  let n = t.map(() => "?").join(", "),
    i = e
      .prepare(
        `SELECT id, project_rel_path, guid, kind, meta_file_id, content_hash
       FROM files
       WHERE id IN (${n})`,
      )
      .all(...t);
  return new Map(
    i.map((r) => [
      r.id,
      {
        id: r.id,
        projectRelPath: r.project_rel_path,
        guid: r.guid,
        kind: r.kind,
        metaFileId: r.meta_file_id,
        contentHash: r.content_hash,
      },
    ]),
  );
}
function J0(e) {
  let t = new Map();
  e.forEach((i) => {
    i.kind === "meta" && i.guid && t.set(i.projectRelPath.slice(0, -5), i);
  });
  let n = new Map();
  return (
    e.forEach((i) => {
      if (hc(i.projectRelPath)) return;
      let s = t.get(i.projectRelPath)?.guid;
      s && n.set(s, i);
    }),
    n
  );
}
async function X0(e, t) {
  let n = t.deleted.filter((l) => !hc(l.projectRelPath));
  if (n.length === 0 || t.created.length === 0) return [];
  let i = ap(
      e,
      n.map((l) => l.fileId),
    ),
    r = J0(t.created),
    s = new Map(t.created.map((l) => [l.projectRelPath, l])),
    o = [],
    a = new Set();
  for (let l of n) {
    let c = i.get(l.fileId);
    if (!c?.guid || c.kind === "meta") continue;
    let d = r.get(c.guid);
    if (!d || d.projectRelPath === c.projectRelPath) continue;
    let u = H0(d.projectRelPath),
      m = u ? s.get(u) : void 0,
      y = c.metaFileId !== null ? ap(e, [c.metaFileId]).get(c.metaFileId) : void 0,
      p = await yn(d.absolutePath),
      g = !!m != !!y;
    (m && y && (g = (await yn(m.absolutePath)) !== y.contentHash),
      o.push({
        guid: c.guid,
        fileId: l.fileId,
        oldProjectRelPath: c.projectRelPath,
        discovered: d,
        metaFileId: c.metaFileId ?? void 0,
        oldMetaProjectRelPath: y?.projectRelPath,
        metaDiscovered: m,
        contentChanged: p !== c.contentHash || g,
      }),
      a.add(d.projectRelPath),
      m && a.add(m.projectRelPath));
  }
  return o;
}
function Q0(e, t) {
  if (t.length === 0) return { ...e, moved: [] };
  let n = new Set(),
    i = new Set();
  for (let r of t)
    (n.add(r.fileId),
      i.add(r.oldProjectRelPath),
      i.add(r.discovered.projectRelPath),
      r.metaFileId !== void 0 && n.add(r.metaFileId),
      r.oldMetaProjectRelPath && i.add(r.oldMetaProjectRelPath),
      r.metaDiscovered && i.add(r.metaDiscovered.projectRelPath));
  return {
    ...e,
    moved: t,
    created: e.created.filter((r) => !i.has(r.projectRelPath)),
    deleted: e.deleted.filter((r) => !n.has(r.fileId)),
  };
}
async function lp(e, t) {
  let n = await X0(e, t);
  return Q0(t, n);
}
function cp(e) {
  let t = new Set();
  for (let n of e)
    (t.add(n.oldProjectRelPath),
      (n.oldProjectRelPath.endsWith(".cs") ||
        n.oldProjectRelPath.endsWith(".prefab") ||
        n.oldProjectRelPath.endsWith(".unity")) &&
        t.add(`${n.oldProjectRelPath}:/`));
  return [...t];
}
import { readFileSync as CT } from "node:fs";
import { readFile as jT } from "node:fs/promises";
import { readFile as Z0 } from "node:fs/promises";
import Ji from "node:path";
var Ic = 1;
async function Xi(e) {
  let t = new Map(e.files.map((g) => [g.id, g])),
    n = new Map(e.assemblies.map((g) => [g.name, g.id])),
    i = await nk(e.files, n),
    r = ik(e.files, i, n),
    s = 0;
  for (let g of e.persistedSymbols ?? []) s = Math.max(s, g.id);
  let o = s + 1,
    a = sk(e.files, e.declarations, r, o);
  e.persistedSymbols && e.persistedSymbols.length > 0 && tk(a.index, e.persistedSymbols);
  let c = { value: Math.max(a.maxSymbolId, s) + 1 },
    d = new Map(),
    u = ck(a.index, t, c, d),
    m = e.mentionFileIds === void 0 ? e.mentions : e.mentions.filter((g) => e.mentionFileIds?.has(g.fileId)),
    y = dk(m, a.index, r, t, c, d),
    p = ek([...a.symbols, ...[...d.values()].sort((g, h) => g.id - h.id)]);
  return { symbols: p, edges: u, bindings: y, fileAssemblyIdByFileId: r, scriptSymbolByFileGuid: mp(t, p) };
}
function ek(e) {
  let t = new Map();
  for (let n of e) t.has(n.id) || t.set(n.id, n);
  return [...t.values()].sort((n, i) => n.id - i.id);
}
function tk(e, t) {
  for (let n of t) {
    if (e.byId.has(n.id)) continue;
    (e.byId.set(n.id, n), n.declarationId !== null && e.byDeclarationId.set(n.declarationId, n));
    let i = Yn(n.assemblyId, n.qualifiedName);
    (e.byKey.has(i) || e.byKey.set(i, n),
      e.byQualifiedName.has(n.qualifiedName) || e.byQualifiedName.set(n.qualifiedName, n));
    let r = e.bySimpleName.get(n.simpleName) ?? [];
    r.some((s) => s.id === n.id) || (r.push(n), e.bySimpleName.set(n.simpleName, r));
  }
}
function up(e, t) {
  let n = new Map(e.map((i) => [i.id, i]));
  return mp(n, t);
}
function fp(e, t) {
  let n = new Map();
  for (let i of e)
    if (!(i.kind !== "csharp" || !i.guid))
      for (let r of Zt(i.guid)) {
        let s = t.get(r);
        s && bc(s) && n.set(s.id, s);
      }
  return [...n.values()].sort((i, r) => i.id - r.id);
}
async function nk(e, t) {
  let n = new Map(),
    i = e.filter((r) => r.kind === "asmdef");
  for (let r of i)
    try {
      let s = await Z0(r.absPath, "utf8"),
        o = Wt(s),
        a = t.get(o.name);
      a && n.set(Ji.posix.dirname(r.projectRelPath), a);
    } catch {}
  return n;
}
function ik(e, t, n) {
  let i = new Map();
  for (let r of e) {
    if (r.kind !== "csharp") continue;
    let s = rk(r.projectRelPath, t);
    if (s) {
      i.set(r.id, s);
      continue;
    }
    let o = r.projectRelPath.toLowerCase().includes("/editor/") ? "Assembly-CSharp-Editor" : "Assembly-CSharp";
    i.set(r.id, n.get(o) ?? null);
  }
  return i;
}
function rk(e, t) {
  let n = Ji.posix.dirname(e);
  for (; n !== "." && n !== "";) {
    let i = t.get(n);
    if (i) return i;
    n = Ji.posix.dirname(n);
  }
  return null;
}
function sk(e, t, n, i = 1) {
  let r = [],
    s = new Map(),
    o = new Map(),
    a = new Map(),
    l = new Map(e.map((p) => [p.id, p])),
    c = new Map(),
    d = [],
    u = i;
  for (let p of t) {
    let g = n.get(p.fileId) ?? null,
      h = mk(p.qualifiedNameText ?? p.simpleName, p.declKind, p.signatureText);
    if (!h) continue;
    dp(h, g, p.fileId, d);
    let S = Yn(g, h),
      _ = a.get(S),
      E = uk(p.declKind),
      b = gk(p.signatureText),
      R = pk(p.signatureText);
    if ((ok(c, S, p, l), _)) {
      ((_.lineStart = Pk(_.lineStart, p.lineStart)),
        (_.lineEnd = vk(_.lineEnd, p.lineEnd)),
        (_.baseSymbolName = _.baseSymbolName ?? R),
        (_.visibility = _.visibility ?? b),
        _.fileId || (_.fileId = p.fileId),
        o.set(p.id, _));
      continue;
    }
    let v = qs(h),
      T = {
        id: u++,
        projectId: Ic,
        assemblyId: g,
        fileId: p.fileId,
        declarationId: p.id,
        symbolKind: E,
        simpleName: p.simpleName,
        qualifiedName: h,
        displayName: fk(h, p.simpleName),
        signature: p.signatureText,
        containingSymbolId: null,
        baseSymbolName: R,
        isExternalStub: 0,
        visibility: b,
        skeletonContent: null,
        lineStart: p.lineStart,
        lineEnd: p.lineEnd,
      };
    (r.push(T), s.set(T.id, T), o.set(p.id, T), a.set(S, T), E === "namespace" && dp(v ?? "", g, p.fileId, d));
  }
  for (let p of d) {
    if (!p.namespaceName) continue;
    let g = Yn(p.assemblyId, p.namespaceName);
    if (a.has(g)) continue;
    let h = p.namespaceName.split(".").pop() ?? p.namespaceName,
      S = {
        id: u++,
        projectId: Ic,
        assemblyId: p.assemblyId,
        fileId: p.fileId,
        declarationId: null,
        symbolKind: "namespace",
        simpleName: h,
        qualifiedName: p.namespaceName,
        displayName: p.namespaceName,
        signature: null,
        containingSymbolId: null,
        baseSymbolName: null,
        isExternalStub: 0,
        visibility: null,
        skeletonContent: null,
        lineStart: null,
        lineEnd: null,
      };
    (r.push(S), s.set(S.id, S), a.set(g, S));
  }
  for (let p of r) {
    let g = qs(p.qualifiedName);
    if (!g) continue;
    let h = a.get(Yn(p.assemblyId, g));
    p.containingSymbolId = h?.id ?? null;
  }
  ak(a, c);
  let m = new Map(),
    y = new Map();
  for (let p of r) {
    m.has(p.qualifiedName) || m.set(p.qualifiedName, p);
    let g = y.get(p.simpleName) ?? [];
    (g.push(p), y.set(p.simpleName, g));
  }
  return {
    symbols: r,
    index: { byId: s, byDeclarationId: o, byKey: a, byQualifiedName: m, bySimpleName: y },
    maxSymbolId: u - 1,
  };
}
function ok(e, t, n, i) {
  let r = i.get(n.fileId),
    s = e.get(t) ?? [];
  (s.push({
    fileId: n.fileId,
    declarationId: n.id,
    projectRelPath: r?.projectRelPath ?? "",
    lineStart: n.lineStart,
    lineEnd: n.lineEnd,
    skeletonContent: n.skeletonContent?.trim() ? n.skeletonContent : null,
  }),
    e.set(t, s));
}
function ak(e, t) {
  for (let [n, i] of t) {
    let r = e.get(n);
    if (!r || i.length === 0) continue;
    let s = [...i].sort(lk),
      o = s[0];
    ((r.fileId = o.fileId), (r.declarationId = o.declarationId));
    let a = s.map((l) => l.skeletonContent).filter((l) => !!l);
    r.skeletonContent =
      a.length > 0
        ? a.join(`

`)
        : null;
  }
}
function lk(e, t) {
  return (
    e.projectRelPath.localeCompare(t.projectRelPath) ||
    e.lineStart - t.lineStart ||
    e.lineEnd - t.lineEnd ||
    e.declarationId - t.declarationId
  );
}
function ck(e, t, n, i) {
  let r = [],
    s = 1;
  for (let o of e.byId.values()) {
    o.containingSymbolId &&
      r.push({
        id: s++,
        fromSymbolId: o.id,
        toSymbolId: o.containingSymbolId,
        edgeKind: "contains",
        sourceFileId: o.fileId,
      });
    let a = yp(o.signature);
    if (a.length === 0) continue;
    let l = o.assemblyId;
    a.map((d) => {
      let u = e.byKey.get(Yn(l, d)) ?? Ik(d, o, e.bySimpleName.get(Qi(d)) ?? []);
      return u ? u.id : pp(d, "class", n, i, e).id;
    }).forEach((d, u) => {
      r.push({
        id: s++,
        fromSymbolId: o.id,
        toSymbolId: d,
        edgeKind: u === 0 ? "inherits" : "implements",
        sourceFileId: t.get(o.fileId ?? -1)?.id ?? null,
      });
    });
  }
  return r;
}
function dk(e, t, n, i, r, s) {
  let o = [],
    a = 1;
  for (let l of e) {
    let c = t.byDeclarationId.get(l.containingDeclarationId);
    if (!c) continue;
    let d = hk(l, c, n.get(l.fileId) ?? null, t),
      u = d[0],
      m = d[1],
      y = Sk(l, u?.symbol ?? null);
    if (u && (!m || u.score > m.score)) {
      o.push({
        id: a++,
        mentionId: l.id,
        sourceSymbolId: c.id,
        targetSymbolId: u.symbol.id,
        bindingKind: y,
        resolutionStatus: "resolved",
        confidence: u.score >= 4 ? 1 : 0.8,
      });
      continue;
    }
    if (u && m && u.score === m.score) {
      o.push({
        id: a++,
        mentionId: l.id,
        sourceSymbolId: c.id,
        targetSymbolId: null,
        bindingKind: y,
        resolutionStatus: "ambiguous",
        confidence: 0.25,
      });
      continue;
    }
    if (Ek(l.text, l.receiverText)) {
      let p = pp(l.text, Rk(l.text), r, s, t);
      o.push({
        id: a++,
        mentionId: l.id,
        sourceSymbolId: c.id,
        targetSymbolId: p.id,
        bindingKind: y,
        resolutionStatus: "external_stub",
        confidence: 0.5,
      });
      continue;
    }
    o.push({
      id: a++,
      mentionId: l.id,
      sourceSymbolId: c.id,
      targetSymbolId: null,
      bindingKind: y,
      resolutionStatus: "unresolved",
      confidence: 0,
    });
  }
  return o;
}
function mp(e, t) {
  let n = new Map(),
    i = t
      .filter((s) => s.isExternalStub === 0 && ["class", "struct", "enum"].includes(s.symbolKind))
      .sort((s, o) => s.id - o.id);
  for (let s of i) {
    if (!s.fileId) continue;
    let o = e.get(s.fileId);
    if (!o?.guid) continue;
    let a = n.get(o.guid) ?? [];
    (a.push(s), n.set(o.guid, a));
  }
  let r = new Map();
  for (let [s, o] of n.entries()) {
    let a = [...e.values()].find((d) => d.guid === s)?.projectRelPath,
      l = a ? Ji.posix.basename(a, Ji.posix.extname(a)) : null,
      c =
        o.find((d) => l !== null && d.simpleName === l && bc(d)) ??
        o.find((d) => bc(d)) ??
        o.find((d) => d.symbolKind === "class") ??
        o[0];
    if (c) for (let d of Zt(s)) r.set(d, c);
  }
  return r;
}
function dp(e, t, n, i) {
  if (!e.includes(".")) return;
  let r = e.split(".");
  for (let s = 1; s < r.length; s += 1) i.push({ assemblyId: t, namespaceName: r.slice(0, s).join("."), fileId: n });
}
function uk(e) {
  return e === "constructor" ? "method" : e === "struct" ? "struct" : e;
}
function Yn(e, t) {
  return `${e ?? "null"}:${t}`;
}
function qs(e) {
  return e.includes(".") ? e.split(".").slice(0, -1).join(".") : null;
}
function fk(e, t) {
  let n = qs(e);
  return n ? `${n.split(".").pop() ?? n}.${t}` : t;
}
function mk(e, t, n) {
  if (!["method", "constructor"].includes(t) || !n) return e;
  let i = yk(n);
  return `${e}(${i})`;
}
function yk(e) {
  let t = e.match(/\((.*)\)/);
  if (!t) return "";
  let n = t[1]?.trim() ?? "";
  return n
    ? n
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean)
        .map((i) => {
          let r = i
              .replace(/\b(params|ref|out|in|this)\b/g, "")
              .replace(/\s+/g, " ")
              .trim(),
            s = r.split(" ");
          return s.length <= 1 ? zs(r) : zs(s.slice(0, -1).join(" "));
        })
        .join(",")
    : "";
}
function gk(e) {
  return e
    ? /\bpublic\b/.test(e)
      ? "public"
      : /\bprivate\b/.test(e)
        ? "private"
        : /\binternal\b/.test(e)
          ? "internal"
          : /\bprotected\b/.test(e)
            ? "protected"
            : null
    : null;
}
function pk(e) {
  return yp(e)[0] ?? null;
}
function yp(e) {
  if (!e) return [];
  let t = e.match(/\b(?:class|struct|interface)\s+[A-Za-z_][A-Za-z0-9_<>]*\s*:\s*([^{]+)/);
  return t?.[1]
    ? t[1]
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean)
        .map(zs)
    : [];
}
function zs(e) {
  return e.replace(/<.*>/g, "").trim();
}
function hk(e, t, n, i) {
  let r = i.byKey.get(Yn(n, e.text));
  if (r) return [{ symbol: r, score: 5 }];
  let s = Qi(e.text);
  return (i.bySimpleName.get(s) ?? [])
    .map((a) => ({ symbol: a, score: gp(a, t, n, e) }))
    .filter((a) => a.score > 0)
    .sort((a, l) => l.score - a.score);
}
function Ik(e, t, n) {
  let i = n.map((r) => ({ candidate: r, score: gp(r, t, t.assemblyId, null) })).sort((r, s) => s.score - r.score)[0];
  return i && i.score > 0 ? i.candidate : null;
}
function gp(e, t, n, i) {
  let r = 0;
  return (
    e.assemblyId === n && (r += 2),
    i && e.fileId === i.fileId && (r += 1),
    e.containingSymbolId === t.containingSymbolId && (r += 2),
    e.containingSymbolId === t.id && (r += 2),
    i && i.text.includes(".") && e.qualifiedName.endsWith(`.${i.text}`) && (r += 3),
    i && i.argumentArity !== null && e.symbolKind === "method" && _k(e) === i.argumentArity && (r += 3),
    i && bk(i, e) && (r += 4),
    r
  );
}
function bk(e, t) {
  if (!e.receiverText || t.symbolKind !== "method") return !1;
  let n = qs(t.qualifiedName);
  if (!n) return !1;
  let i = Qi(n);
  return e.receiverText
    .split(/[^A-Za-z0-9_]+/)
    .filter(Boolean)
    .includes(i);
}
function Sk(e, t) {
  return t?.symbolKind === "method"
    ? "invokes"
    : (t && ["class", "interface", "enum", "struct", "namespace"].includes(t.symbolKind)) || Sc(e.text)
      ? "references_type"
      : (e.receiverText, "references_member");
}
function bc(e) {
  let t = e.baseSymbolName ?? "";
  return /(?:^|\.)(MonoBehaviour|Behaviour|ScriptableObject|Component)$/.test(t);
}
function _k(e) {
  if (e.symbolKind !== "method") return null;
  let t = e.qualifiedName.match(/\((.*)\)$/);
  if (!t) return null;
  let n = t[1]?.trim() ?? "";
  return n
    ? n
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean).length
    : 0;
}
function Ek(e, t) {
  return t !== null || Sc(e) || e.includes(".");
}
function Sc(e) {
  return /^[A-Z][A-Za-z0-9_.]+$/.test(Qi(e));
}
function Rk(e) {
  return Sc(e) ? "class" : "field";
}
function pp(e, t, n, i, r) {
  let s = zs(e),
    o = i.get(s);
  if (o) return o;
  let a = wk(r, s);
  if (a) return a;
  let l = Qi(s),
    c = {
      id: n.value++,
      projectId: Ic,
      assemblyId: null,
      fileId: null,
      declarationId: null,
      symbolKind: t,
      simpleName: l,
      qualifiedName: s,
      displayName: l,
      signature: null,
      containingSymbolId: null,
      baseSymbolName: null,
      isExternalStub: 1,
      visibility: null,
      skeletonContent: null,
      lineStart: null,
      lineEnd: null,
    };
  return (i.set(s, c), c);
}
function wk(e, t) {
  return e.byQualifiedName.get(t);
}
function Qi(e) {
  return e.split(".").pop() ?? e;
}
function Pk(e, t) {
  return e === null ? t : t === null ? e : Math.min(e, t);
}
function vk(e, t) {
  return e === null ? t : t === null ? e : Math.max(e, t);
}
function Zi(e, t, n, i) {
  let r = [...t].sort((a, l) => {
      let c = hp(a.qualifiedName) - hp(l.qualifiedName);
      return c !== 0 ? c : a.id - l.id;
    }),
    s = e.prepare(`INSERT INTO symbols (
      id,
      project_id,
      assembly_id,
      file_id,
      declaration_id,
      symbol_kind,
      simple_name,
      qualified_name,
      display_name,
      signature,
      containing_symbol_id,
      base_symbol_name,
      is_external_stub,
      visibility,
      skeleton_content,
      line_start,
      line_end
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),
    o = e.prepare(`INSERT INTO symbol_edges (
      id,
      from_symbol_id,
      to_symbol_id,
      edge_kind,
      source_file_id
    ) VALUES (?, ?, ?, ?, ?)`);
  Ae(e, () => {
    for (let a of r)
      s.run(
        a.id,
        a.projectId,
        a.assemblyId,
        a.fileId,
        a.declarationId,
        a.symbolKind,
        a.simpleName,
        a.qualifiedName,
        a.displayName,
        a.signature,
        a.containingSymbolId,
        a.baseSymbolName,
        a.isExternalStub,
        a.visibility,
        a.skeletonContent ?? null,
        a.lineStart,
        a.lineEnd,
      );
    for (let a of n) o.run(a.id, a.fromSymbolId, a.toSymbolId, a.edgeKind, a.sourceFileId);
    xk(e, i);
  });
}
function xk(e, t) {
  if (t.length === 0) return;
  let n = 7,
    i = Jt(n),
    r = `INSERT INTO semantic_bindings (
      id,
      mention_id,
      source_symbol_id,
      target_symbol_id,
      binding_kind,
      resolution_status,
      confidence
    ) VALUES `,
    s = t.length >= i ? e.prepare(`${r}${Ze(i, n)}`) : null;
  for (let o of Pe(t, i))
    (o.length === i ? s : e.prepare(`${r}${Ze(o.length, n)}`)).run(
      ...o.flatMap((l) => [
        l.id,
        l.mentionId,
        l.sourceSymbolId,
        l.targetSymbolId,
        l.bindingKind,
        l.resolutionStatus,
        l.confidence,
      ]),
    );
}
function Ip(e, t) {
  let n = e.prepare(`INSERT INTO assets (
      id,
      project_id,
      file_id,
      asset_kind,
      guid,
      name,
      vfs_root_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  Ae(e, () => {
    for (let i of t) n.run(i.id, i.projectId, i.fileId, i.assetKind, i.guid, i.name, i.vfsRootPath);
  });
}
function _c(e, t) {
  let n = kk(t),
    i = e.prepare(`INSERT INTO entities (
      id,
      asset_id,
      yaml_object_id,
      entity_kind,
      local_key,
      name,
      hierarchy_name,
      hierarchy_order,
      type_name,
      script_symbol_id,
      parent_entity_id,
      source_entity_id,
      line_start,
      line_end,
      generated_content
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  Ae(e, () => {
    for (let r of n)
      i.run(
        r.id,
        r.assetId,
        r.yamlObjectId,
        r.entityKind,
        r.localKey,
        r.name,
        r.hierarchyName ?? null,
        r.hierarchyOrder ?? r.id,
        r.typeName,
        r.scriptSymbolId,
        r.parentEntityId,
        r.sourceEntityId,
        r.lineStart,
        r.lineEnd,
        r.generatedContent ?? null,
      );
  });
}
function bp(e, t) {
  let n = e.prepare(`INSERT INTO entity_edges (
      id,
      from_entity_id,
      to_entity_id,
      edge_kind,
      edge_subkind
    ) VALUES (?, ?, ?, ?, ?)`);
  Ae(e, () => {
    for (let i of t) n.run(i.id, i.fromEntityId, i.toEntityId, i.edgeKind, i.edgeSubkind ?? null);
  });
}
function Sp(e, t) {
  let n = e.prepare(`INSERT INTO entity_symbol_edges (
      id,
      from_entity_id,
      to_symbol_id,
      edge_kind,
      edge_subkind,
      source_field_path
    ) VALUES (?, ?, ?, ?, ?, ?)`);
  Ae(e, () => {
    for (let i of t)
      n.run(i.id, i.fromEntityId, i.toSymbolId, i.edgeKind, i.edgeSubkind ?? null, i.sourceFieldPath ?? null);
  });
}
function _p(e, t) {
  if (t.length === 0) return;
  let n = e.prepare(`UPDATE entities
     SET source_entity_id = ?
     WHERE id = ?`);
  Ae(e, () => {
    for (let i of t) n.run(i.sourceEntityId, i.entityId);
  });
}
function Ep(e, t) {
  if (t.length === 0) return;
  let n = e.prepare(`UPDATE entities
     SET hierarchy_name = ?
     WHERE id = ?`);
  Ae(e, () => {
    for (let i of t) n.run(i.hierarchyName, i.entityId);
  });
}
function hp(e) {
  return e.split(".").length;
}
function kk(e) {
  let t = new Map(e.map((s) => [s.id, s])),
    n = new Set(),
    i = new Set(e.map((s) => s.id)),
    r = [];
  for (; i.size > 0;) {
    let s = [...i]
      .map((o) => t.get(o))
      .filter((o) => !!o)
      .filter((o) => [o.parentEntityId, o.sourceEntityId].filter((a) => a !== null).every((a) => n.has(a) || !t.has(a)))
      .sort((o, a) => o.id - a.id);
    if (s.length === 0) return [...r, ...e.filter((o) => i.has(o.id))];
    for (let o of s) (r.push(o), n.add(o.id), i.delete(o.id));
  }
  return r;
}
import Ih from "node:path";
import $t from "node:path";
function _e(e, t) {
  return `${e}:${t}`;
}
function Ec(e, t = new Map()) {
  return {
    assetIdByFileId: new Map(e.map((n) => [n.fileId, n.id])),
    fileIdByAssetId: new Map(e.map((n) => [n.id, n.fileId])),
    assetIdByGuid: new Map(e.map((n) => [n.guid, n.id])),
    assetKindByFileId: new Map(e.map((n) => [n.fileId, n.assetKind])),
    fileAbsPathById: t,
  };
}
function Rc() {
  let e = new Map(),
    t = new Map(),
    n = new Map(),
    i = new Map(),
    r = new Map();
  return {
    entityIdByFileIdAndLocalKey: e,
    entitySummaryByYamlObjectId: t,
    entitySummaryById: n,
    componentScriptSymbolIdByEntityId: i,
    projectableRootEntityIdByAssetId: r,
    addEntity(s) {
      if (
        (n.set(s.entityId, s),
        s.localKey !== null && e.set(_e(s.fileId, s.localKey), s.entityId),
        s.yamlObjectId !== null && t.set(s.yamlObjectId, s),
        s.scriptSymbolId !== null && i.set(s.entityId, s.scriptSymbolId),
        (s.entityKind === "gameobject" || s.entityKind === "prefab_instance") && s.parentEntityId === null)
      ) {
        let o = r.get(s.assetId),
          a = o === void 0 ? void 0 : n.get(o)?.entityKind;
        (o === void 0 ||
          (s.entityKind === "gameobject" && a !== "gameobject") ||
          (s.entityKind === a && s.entityId < o)) &&
          r.set(s.assetId, s.entityId);
      }
    },
  };
}
function Rp() {
  let e = [],
    t = 0,
    n = (i) => {
      (e.push(i), (t += JSON.stringify(i).length * 2));
    };
  return {
    add(i) {
      n(i);
    },
    addMany(i) {
      for (let r of i) n(r);
    },
    count() {
      return e.length;
    },
    approximateSizeBytes() {
      return t;
    },
    toSortedArray() {
      return [...e].sort(Mk);
    },
    clear() {
      ((e.length = 0), (t = 0));
    },
  };
}
function Mk(e, t) {
  return (
    e.sourceFileId - t.sourceFileId ||
    e.sourceYamlObjectId - t.sourceYamlObjectId ||
    Vn(e.sourceLocalKey, t.sourceLocalKey) ||
    Vn(e.fieldPath, t.fieldPath) ||
    Vn(e.referenceKind, t.referenceKind) ||
    Vn(e.targetGuid ?? "", t.targetGuid ?? "") ||
    Vn(e.targetFileId ?? "", t.targetFileId ?? "") ||
    Vn(e.targetLocalId ?? "", t.targetLocalId ?? "")
  );
}
function Vn(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function wp() {
  return { seenEntityEdges: new Set(), seenEntitySymbolEdges: new Set(), seenDiagnostics: new Set() };
}
function Je(e, t, n, i) {
  return [e, t, n, i ?? ""].join(":");
}
function Pp(e, t, n, i, r) {
  return [e, t, n, i ?? "", r ?? ""].join(":");
}
var Tk = "s\0\0\0";
function vp(e) {
  let t = e.lastIndexOf("."),
    n = t < 0 ? e : `${e.slice(0, t)}${e.slice(t + 1)}`,
    i = new TextEncoder().encode(`${Tk}${n}`),
    r = Math.ceil((i.length + 9) / 64) * 64,
    s = new Uint8Array(r);
  (s.set(i), (s[i.length] = 128));
  let o = BigInt(i.length) * 8n;
  for (let m = 0; m < 8; m += 1) s[r - 8 + m] = Number((o >> BigInt(m * 8)) & 0xffn);
  let a = 1732584193,
    l = 4023233417,
    c = 2562383102,
    d = 271733878,
    u = new Uint32Array(16);
  for (let m = 0; m < s.length; m += 64) {
    for (let S = 0; S < 16; S += 1) {
      let _ = m + S * 4;
      u[S] = s[_] | (s[_ + 1] << 8) | (s[_ + 2] << 16) | (s[_ + 3] << 24);
    }
    let y = a,
      p = l,
      g = c,
      h = d;
    (([a, l, c, d] = wc(a, l, c, d, u, [...Array(16).keys()], [3, 7, 11, 19], (S, _, E) => (S & _) | (~S & E), 0)),
      ([a, l, c, d] = wc(
        a,
        l,
        c,
        d,
        u,
        [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15],
        [3, 5, 9, 13],
        (S, _, E) => (S & _) | (S & E) | (_ & E),
        1518500249,
      )),
      ([a, l, c, d] = wc(
        a,
        l,
        c,
        d,
        u,
        [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15],
        [3, 9, 11, 15],
        (S, _, E) => S ^ _ ^ E,
        1859775393,
      )),
      (a = (a + y) >>> 0),
      (l = (l + p) >>> 0),
      (c = (c + g) >>> 0),
      (d = (d + h) >>> 0));
  }
  return a | 0;
}
function wc(e, t, n, i, r, s, o, a, l) {
  let c = e,
    d = t,
    u = n,
    m = i;
  for (let y = 0; y < 16; y += 1) {
    let p = r[s[y]],
      g = o[y % 4];
    switch (y % 4) {
      case 0:
        c = Hs((c + a(d, u, m) + p + l) >>> 0, g);
        break;
      case 1:
        m = Hs((m + a(c, d, u) + p + l) >>> 0, g);
        break;
      case 2:
        u = Hs((u + a(m, c, d) + p + l) >>> 0, g);
        break;
      default:
        d = Hs((d + a(u, m, c) + p + l) >>> 0, g);
        break;
    }
  }
  return [c, d, u, m];
}
function Hs(e, t) {
  return ((e << t) | (e >>> (32 - t))) >>> 0;
}
function Mp(e) {
  return Uk(e, { resolvePrefabLinks: !1 });
}
function Tp(e) {
  let t = [],
    n = [],
    i = e.nextEdgeId;
  for (let r of e.intents) {
    let s = e.entityIndexes.entityIdByFileIdAndLocalKey.get(_e(r.sourceFileId, r.sourceLocalKey));
    if (s === void 0) continue;
    let o = e.assetIndexes.assetIdByGuid.get(r.prefabSourceGuid);
    if (o === void 0) continue;
    let a = e.entityIndexes.projectableRootEntityIdByAssetId.get(o);
    if (a === void 0) continue;
    let l = Je(s, a, r.edgeKind, null);
    e.edgeState.seenEntityEdges.has(l) ||
      (e.edgeState.seenEntityEdges.add(l),
      t.push({ id: i++, fromEntityId: s, toEntityId: a, edgeKind: r.edgeKind }),
      n.push({ entityId: s, sourceEntityId: a }));
  }
  return { edges: t, sourceEntityUpdates: n, nextEdgeId: i };
}
function Uk(e, t) {
  let n = [],
    i = [],
    r = [],
    { assets: s, yamlObjects: o, scriptSymbolByFileGuid: a, yamlMetadataById: l } = e,
    c = e.scopedMonoScriptSymbols ?? [],
    d = Ak(e.symbols ?? c),
    u = new Map(s.map((R) => [R.id, R])),
    m = new Map(),
    y = new Map(),
    p = new Map(),
    g = [],
    h = Ck(o, (R) => R.fileId),
    S = new Map(s.map((R) => [R.guid, R])),
    _ = [],
    E = e.nextEntityId,
    b = e.nextEdgeId;
  for (let R of s) {
    if (R.assetKind !== "scene" && R.assetKind !== "prefab") continue;
    let v = h.get(R.fileId) ?? [],
      T = new Map(v.map((P) => [P.id, P])),
      x = new Map(),
      $ = new Map(),
      z = new Map(),
      Y = new Map(),
      V = new Map(),
      G = new Map(),
      re = new Map();
    for (let P of v) {
      let A = l.get(P.id);
      if (P.objectType === "Transform" || P.objectType === "RectTransform") {
        let F = e.payloadReader.read(P),
          B = Vg(A?.childTransformLocalIds !== void 0 ? null : F, A);
        (x.set(P.id, B), $.set(P.localIdentifier, B), B.gameObjectFileId && z.set(B.gameObjectFileId, B));
        let ne = B.gameObjectFileId ?? B.prefabInstanceLocalId,
          ee = qg(F, ["m_RootOrder"]);
        ne && ee !== null && V.set(ne, ee);
      } else if (P.objectType === "PrefabInstance")
        if (A) (G.set(P.id, A.sourcePrefabGuid), re.set(P.id, A.prefabTransformParentLocalId));
        else {
          let F = e.payloadReader.read(P);
          (G.set(P.id, null), re.set(P.id, Ke(F, ["m_Modification", "m_TransformParent"])));
        }
    }
    for (let P of v) {
      if (P.objectType !== "GameObject") continue;
      let A = z.get(P.localIdentifier);
      if (!A) {
        Y.set(P.localIdentifier, null);
        continue;
      }
      let F = A.parentTransformLocalId ? $.get(A.parentTransformLocalId) : void 0,
        B = F?.gameObjectFileId ?? F?.prefabInstanceLocalId ?? null;
      Y.set(P.localIdentifier, B);
    }
    let W = [],
      ce = new Set(
        v
          .filter((P) => {
            let A = l.get(P.id);
            return P.objectType === "GameObject" && !!A?.prefabInstanceLocalId && !P.name;
          })
          .map((P) => P.localIdentifier),
      ),
      Ee = new Map(),
      le = new Map();
    for (let P of v) {
      if (P.objectType === "GameObject") {
        let F = e.payloadReader.read(P),
          B = F && typeof F == "object" && !Array.isArray(F) ? F.m_Component : void 0;
        Array.isArray(B) &&
          B.forEach((ne, ee) => {
            let Q = Ke(ne, ["component"]);
            Q && le.set(Q, ee);
          });
      }
      if (!P.gameObjectFileId) continue;
      let A = l.get(P.id)?.gameObjectFileId ?? P.gameObjectFileId;
      ce.has(A) || Ee.set(A, (Ee.get(A) ?? 0) + 1);
    }
    for (let P of v) {
      let A = null,
        F = P.objectType,
        B = P.name,
        ne = null,
        ee = l.get(P.id);
      if (P.objectType === "GameObject" && ce.has(P.localIdentifier)) continue;
      if (P.objectType === "GameObject") ((A = "gameobject"), (F = "GameObject"));
      else if (P.objectType === "PrefabInstance")
        ((A = "prefab_instance"), (B = ee?.prefabRootName ?? P.name ?? $t.posix.basename(R.vfsRootPath)));
      else if (P.gameObjectFileId) {
        let de = ee?.gameObjectFileId ?? P.gameObjectFileId;
        if (ce.has(de)) continue;
        if (((A = "component"), P.objectType === "MonoBehaviour" && P.scriptGuid)) {
          let te = a.get(P.scriptGuid) ?? (P.scriptFileId ? d.get(P.scriptFileId) : void 0),
            Ge = ee?.gameObjectFileId ?? P.gameObjectFileId,
            rt = Ge ? (Ee.get(Ge) ?? 0) : 0;
          if (
            (!te && rt === 2 && (te = Nk(R, e.scopedFiles, a)),
            !te &&
              c.length === 1 &&
              Dk({
                scriptGuid: P.scriptGuid,
                scriptSymbolByFileGuid: a,
                gameObjectFileId: Ge,
                componentCountByGameObjectLocalKey: Ee,
                scopedCSharpBasename: Fk(e.scopedFiles),
                gameObjectName: Lk(P, T, ee),
              }) &&
              (te = c[0]),
            te)
          )
            ((ne = te.id), (F = te.qualifiedName), (B = te.simpleName));
          else {
            let Me = Ok(e.payloadReader.read(P));
            Me && ((F = Me), (B = Me.split(".").pop() ?? Me));
          }
        } else B = B ?? P.objectType;
      }
      if (!A) continue;
      let Q = {
        id: E++,
        assetId: R.id,
        yamlObjectId: P.id,
        entityKind: A,
        localKey: P.localIdentifier,
        name: B,
        hierarchyName: null,
        hierarchyOrder: A === "component" ? (le.get(P.localIdentifier) ?? 5e5 + P.id) : P.id,
        typeName: F,
        scriptSymbolId: ne,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: P.lineStart,
        lineEnd: P.lineEnd,
      };
      (n.push(Q), W.push(Q), m.set(Q.id, Q), p.set(Bt(R.fileId, Q.localKey), Q));
    }
    for (let P of W) {
      if (P.entityKind === "component") {
        let ee = P.yamlObjectId === null ? void 0 : T.get(P.yamlObjectId),
          Q = ee === void 0 ? null : (l.get(ee.id)?.gameObjectFileId ?? ee.gameObjectFileId);
        P.parentEntityId = Q ? (p.get(Bt(R.fileId, Q))?.id ?? null) : null;
        continue;
      }
      if (P.entityKind === "gameobject") {
        let ee = Y.get(P.localKey);
        P.parentEntityId = ee ? (p.get(Bt(R.fileId, ee))?.id ?? null) : null;
        continue;
      }
      if (P.entityKind !== "prefab_instance") continue;
      let A = P.yamlObjectId === null ? void 0 : T.get(P.yamlObjectId);
      if (!A) continue;
      let F = re.get(A.id) ?? null,
        B = F ? $.get(F) : void 0,
        ne = B ? (B.gameObjectFileId ?? B.prefabInstanceLocalId) : null;
      P.parentEntityId = ne ? (p.get(Bt(R.fileId, ne))?.id ?? null) : null;
    }
    for (let P of W)
      (P.entityKind === "gameobject" || P.entityKind === "prefab_instance") &&
        P.parentEntityId !== null &&
        (P.hierarchyOrder = 15e5 + P.id);
    let pe = new Map();
    for (let [P, A] of $) {
      let F = A.gameObjectFileId ?? A.prefabInstanceLocalId;
      F && pe.set(P, F);
    }
    let Oe = W.filter((P) => (P.entityKind === "gameobject" || P.entityKind === "prefab_instance") && !P.parentEntityId)
      .sort((P, A) => (V.get(P.localKey) ?? P.id) - (V.get(A.localKey) ?? A.id))
      .map((P) => P.localKey);
    Oe.forEach((P, A) => {
      let F = p.get(Bt(R.fileId, P));
      F && (F.hierarchyOrder = V.get(P) ?? A);
    });
    let it = new Map();
    for (let P of $.values()) {
      let A = P.gameObjectFileId ?? P.prefabInstanceLocalId;
      if (!A) continue;
      let F = P.childTransformLocalIds.map((B) => pe.get(B)).filter((B) => !!B);
      F.length > 0 &&
        (F.forEach((B, ne) => {
          let ee = p.get(Bt(R.fileId, B));
          ee && (ee.hierarchyOrder = 1e6 + ne);
        }),
        it.set(A, F));
    }
    g.push({ fileId: R.fileId, rootLocalKeys: Oe, childLocalKeysByParentLocalKey: it });
    let $e =
      W.filter((P) => P.entityKind === "gameobject" && !P.parentEntityId).sort((P, A) => P.id - A.id)[0] ??
      W.filter((P) => P.entityKind === "prefab_instance" && !P.parentEntityId).sort((P, A) => P.id - A.id)[0];
    $e && y.set(R.id, $e.id);
    for (let P of W)
      P.parentEntityId &&
        i.push({
          id: b++,
          fromEntityId: P.id,
          toEntityId: P.parentEntityId,
          edgeKind: P.entityKind === "component" ? "component_of" : "child_of",
        });
    for (let P of W) {
      if (P.entityKind !== "prefab_instance" || P.yamlObjectId === null) continue;
      let A = G.get(P.yamlObjectId) ?? null;
      if (!A) continue;
      let F = T.get(P.yamlObjectId);
      F &&
        _.push({
          fromEntityId: P.id,
          sourceYamlObjectId: F.id,
          sourceFileId: R.fileId,
          sourceLocalKey: P.localKey,
          sourceGuid: A,
          targetLocalId: Ke(e.payloadReader.read(F), ["m_SourcePrefab"]),
          edgeKind: R.assetKind === "prefab" && P.id === $e?.id ? "variant_of" : "instance_of",
        });
    }
  }
  if (t.resolvePrefabLinks)
    for (let R of _) {
      let v = S.get(R.sourceGuid);
      if (!v) continue;
      let T = y.get(v.id);
      if (!T) continue;
      let x = m.get(R.fromEntityId);
      x && ((x.sourceEntityId = T), i.push({ id: b++, fromEntityId: x.id, toEntityId: T, edgeKind: R.edgeKind }));
    }
  else
    for (let R of _) {
      let v = S.get(R.sourceGuid),
        T = v ? y.get(v.id) : void 0,
        x = m.get(R.fromEntityId);
      (x && T && (x.sourceEntityId = T),
        r.push({
          referenceKind: "prefab_link",
          sourceYamlObjectId: R.sourceYamlObjectId,
          sourceFileId: R.sourceFileId,
          sourceLocalKey: R.sourceLocalKey,
          fieldPath: "PrefabInstance.m_SourcePrefab",
          targetGuid: R.sourceGuid,
          targetFileId: null,
          targetLocalId: R.targetLocalId,
          edgeKind: R.edgeKind,
          prefabSourceGuid: R.sourceGuid,
        }));
    }
  for (let R of g) {
    kp(R.fileId, p, m, u, R.rootLocalKeys);
    for (let v of R.childLocalKeysByParentLocalKey.values()) kp(R.fileId, p, m, u, v);
  }
  for (let R of n)
    (R.entityKind !== "gameobject" && R.entityKind !== "prefab_instance") ||
      R.hierarchyName ||
      (R.hierarchyName = Up(R, m, u));
  return { entities: n, edges: i, pendingEdgeIntents: r, nextEntityId: E, nextEdgeId: b };
}
function Bt(e, t) {
  return `${e}:${t}`;
}
var xp = new WeakMap();
function Ak(e) {
  let t = xp.get(e);
  if (t) return t;
  let n = new Map(),
    i = new Set();
  for (let r of e) {
    if (r.symbolKind !== "class" || !r.qualifiedName.trim()) continue;
    let s = String(vp(r.qualifiedName.trim())),
      o = n.get(s);
    if (o && o.qualifiedName !== r.qualifiedName) {
      (n.delete(s), i.add(s));
      continue;
    }
    i.has(s) || n.set(s, r);
  }
  return (xp.set(e, n), n);
}
function Ok(e) {
  let t = mn(e, ["m_EditorClassIdentifier"]);
  if (!t?.trim()) return null;
  let n = t.trim();
  return (n.includes("::") ? n.slice(n.lastIndexOf("::") + 2) : n).trim() || null;
}
function Fk(e) {
  let t = e.filter((n) => n.kind === "csharp");
  return t.length !== 1 ? null : $t.posix.basename(t[0].projectRelPath, $t.posix.extname(t[0].projectRelPath));
}
function Nk(e, t, n) {
  let i = $t.posix.basename(e.vfsRootPath, $t.posix.extname(e.vfsRootPath)),
    r = t.filter(
      (o) => o.kind === "csharp" && $t.posix.basename(o.projectRelPath, $t.posix.extname(o.projectRelPath)) === i,
    );
  if (r.length !== 1) return;
  let s = r[0];
  if (s.guid)
    for (let o of Zt(s.guid)) {
      let a = n.get(o);
      if (a) return a;
    }
}
function Lk(e, t, n) {
  let i = n?.gameObjectFileId ?? e.gameObjectFileId;
  return i
    ? ([...t.values()].find((s) => s.objectType === "GameObject" && s.localIdentifier === i)?.name ?? null)
    : null;
}
function Dk(e) {
  return e.scriptSymbolByFileGuid.has(e.scriptGuid) || !e.gameObjectFileId
    ? !1
    : !!(
        (e.componentCountByGameObjectLocalKey.get(e.gameObjectFileId) ?? 0) === 2 ||
        (e.scopedCSharpBasename && e.gameObjectName === e.scopedCSharpBasename)
      );
}
function Ck(e, t) {
  let n = new Map();
  for (let i of e) {
    let r = t(i),
      s = n.get(r) ?? [];
    (s.push(i), n.set(r, s));
  }
  return n;
}
function kp(e, t, n, i, r) {
  let s = new Map(),
    o = new Map();
  for (let a of r) {
    let l = t.get(Bt(e, a));
    if (!l) continue;
    let c = Up(l, n, i);
    (o.set(a, c), s.set(c, (s.get(c) ?? 0) + 1));
  }
  r.forEach((a, l) => {
    let c = t.get(Bt(e, a)),
      d = o.get(a);
    !c || !d || (c.hierarchyName = (s.get(d) ?? 0) > 1 ? `${d}#${l}` : d);
  });
}
function Up(e, t, n) {
  if (e.entityKind === "prefab_instance" && e.sourceEntityId) {
    let i = t.get(e.sourceEntityId),
      r = n.get(e.assetId),
      s = r ? $t.posix.basename(r.vfsRootPath) : null,
      o = (e.name ?? e.typeName).trim() || e.typeName;
    if (i && o === s) return (i.name ?? i.typeName).trim() || i.typeName;
  }
  return (e.name ?? e.typeName).trim() || e.typeName;
}
function ct(e) {
  return jk(e, (t) => t.fileId);
}
function Ye(e, t, n, i, r = {}) {
  return {
    id: e,
    assetId: t.id,
    yamlObjectId: n.id,
    entityKind: i,
    localKey: n.localIdentifier,
    name: r.name ?? (n.name || null) ?? t.name,
    hierarchyName: r.hierarchyName ?? null,
    typeName: r.typeName ?? n.objectType,
    scriptSymbolId: r.scriptSymbolId ?? null,
    parentEntityId: r.parentEntityId ?? null,
    sourceEntityId: null,
    lineStart: n.lineStart,
    lineEnd: n.lineEnd,
  };
}
function dt(e, t) {
  return t.read(e);
}
function Ap(e, t) {
  return mn(e, t);
}
function er(e, t) {
  let n = e;
  for (let [i, r] of t.entries()) {
    if (!n || typeof n != "object" || Array.isArray(n)) return [];
    if (((n = n[r]), Array.isArray(n))) {
      let s = t.slice(i + 1);
      return n.map((o) => (s.length > 0 ? (mn(o, [...s, "fileID"]) ?? Kn(o)) : Kn(o))).filter((o) => o !== null);
    }
  }
  return Array.isArray(n)
    ? n.map((i) => (!i || typeof i != "object" || Array.isArray(i) ? null : Kn(i))).filter((i) => i !== null)
    : [];
}
function xc(e) {
  let t = new Set();
  return (
    vc(e, (n) => {
      if (!n || typeof n != "object" || Array.isArray(n)) return;
      let i = n;
      if (i.guid !== void 0) return;
      let r = i.fileID;
      (typeof r == "string" || typeof r == "number") && String(r) !== "0" && t.add(String(r));
    }),
    [...t]
  );
}
function Op(e) {
  let t = new Map(e.entities.map((i) => [Pc(i.assetId, i.localKey), i])),
    n = e.nextEdgeId;
  for (let i of e.yamlObjects) {
    let r = t.get(Pc(e.assetId, i.localIdentifier));
    if (r)
      for (let s of xc(dt(i, e.payloadReader))) {
        let o = t.get(Pc(r.assetId, s));
        !o || o.id === r.id || e.edges.push({ id: n++, fromEntityId: r.id, toEntityId: o.id, edgeKind: "refs" });
      }
  }
  return n;
}
function Pc(e, t) {
  return `${e}:${t}`;
}
function Js(e, t) {
  let n = e;
  for (let i of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return { fileID: null, guid: null };
    n = n[i];
  }
  return { fileID: mn(n, ["fileID"]), guid: mn(n, ["guid"]) };
}
function vc(e, t) {
  if ((t(e), !(!e || typeof e != "object"))) {
    if (Array.isArray(e)) {
      e.forEach((n) => vc(n, t));
      return;
    }
    Object.values(e).forEach((n) => vc(n, t));
  }
}
function jk(e, t) {
  let n = new Map();
  for (let i of e) {
    let r = t(i),
      s = n.get(r) ?? [];
    (s.push(i), n.set(r, s));
  }
  return n;
}
function Fp(e) {
  let t = [],
    n = ct(e.yamlObjects),
    i = e.nextEntityId;
  for (let r of e.assets) {
    if (r.assetKind !== "animation_clip") continue;
    let s = n.get(r.fileId) ?? [];
    for (let o of s)
      o.objectType === "AnimationClip" &&
        t.push(Ye(i++, r, o, "animation_clip", { name: o.name ?? r.name, typeName: "AnimationClip" }));
  }
  return { entities: t, edges: [], nextEntityId: i, nextEdgeId: e.nextEdgeId };
}
function Np(e) {
  let t = [],
    n = [],
    i = [],
    r = ct(e.yamlObjects),
    s = e.nextEntityId,
    o = e.nextEdgeId;
  for (let a of e.assets) {
    if (a.assetKind !== "animator_controller") continue;
    let l = r.get(a.fileId) ?? [],
      c = new Map(),
      d = new Map(),
      u = new Map(),
      m = (y) => {
        (t.push(y), c.set(y.localKey, y));
      };
    for (let y of l) {
      if (y.objectType !== "AnimatorStateMachine") continue;
      for (let g of er(dt(y, e.payloadReader), ["m_ChildStates", "state"])) d.set(g, y.localIdentifier);
      let p = Ye(s++, a, y, "animator_state_machine", { typeName: "AnimatorStateMachine" });
      m(p);
    }
    for (let y of l) {
      if (y.objectType !== "AnimatorOverrideController") continue;
      let p = Ye(s++, a, y, "animator_controller", { name: y.name ?? a.name, typeName: "AnimatorOverrideController" });
      m(p);
    }
    for (let y of l) {
      if (y.objectType !== "AnimatorState") continue;
      let p = d.get(y.localIdentifier),
        g = p ? c.get(p) : null,
        h = Ye(s++, a, y, "animator_state", { parentEntityId: g?.id ?? null, typeName: "AnimatorState" });
      (m(h), g && n.push({ id: o++, fromEntityId: h.id, toEntityId: g.id, edgeKind: "child_of" }));
      for (let S of er(dt(y, e.payloadReader), ["m_Transitions"])) u.set(S, y.localIdentifier);
    }
    for (let y of l) {
      if (y.objectType !== "AnimatorStateTransition") continue;
      let p = u.get(y.localIdentifier),
        g = p ? c.get(p) : null,
        h = Ye(s++, a, y, "animator_transition", {
          name: y.name || "Transition",
          parentEntityId: g?.id ?? null,
          typeName: "AnimatorStateTransition",
        });
      (m(h), g && n.push({ id: o++, fromEntityId: h.id, toEntityId: g.id, edgeKind: "child_of" }));
    }
    i.push(...kc({ yamlObjects: l.filter((y) => c.has(y.localIdentifier)), payloadReader: e.payloadReader }));
  }
  return { entities: t, edges: n, nextEntityId: s, nextEdgeId: o, pendingEdgeIntents: i };
}
function kc(e) {
  let t = [];
  for (let n of e.yamlObjects) {
    let i = Gk(n.objectType, dt(n, e.payloadReader));
    for (let r of i)
      r.fileID &&
        t.push({
          referenceKind: "animator_ref",
          sourceYamlObjectId: n.id,
          sourceFileId: n.fileId,
          sourceLocalKey: n.localIdentifier,
          fieldPath: r.fieldPath,
          targetGuid: r.guid,
          targetFileId: null,
          targetLocalId: r.fileID,
          edgeSubkind: r.edgeSubkind,
        });
  }
  return t;
}
function Lp(e) {
  let t = [],
    n = e.nextEdgeId;
  for (let i of e.intents) {
    let r =
      e.entityIndexes.entitySummaryByYamlObjectId.get(i.sourceYamlObjectId)?.entityId ??
      e.entityIndexes.entityIdByFileIdAndLocalKey.get(_e(i.sourceFileId, i.sourceLocalKey));
    if (r === void 0) continue;
    let s = i.targetLocalId ?? i.targetFileId;
    if (!s || s === "0") continue;
    let o = Bk(e.assetIndexes, { sourceFileId: i.sourceFileId, targetGuid: i.targetGuid });
    if (o === null) continue;
    let a = e.entityIndexes.entityIdByFileIdAndLocalKey.get(_e(o, s));
    if (a === void 0 || a === r) continue;
    let l = $k(i.edgeSubkind),
      c = Je(r, a, "refs", l);
    e.edgeState.seenEntityEdges.has(c) ||
      (e.edgeState.seenEntityEdges.add(c),
      t.push({ id: n++, fromEntityId: r, toEntityId: a, edgeKind: "refs", edgeSubkind: l }));
  }
  return { edges: t, nextEdgeId: n };
}
function Bk(e, t) {
  if (!t.targetGuid) return t.sourceFileId;
  let n = e.assetIdByGuid.get(t.targetGuid);
  return n === void 0 ? null : (e.fileIdByAssetId.get(n) ?? null);
}
function $k(e) {
  return e === "override" ? "animator_override_clip" : null;
}
function Gk(e, t) {
  return e === "AnimatorState"
    ? [{ ...Js(t, ["m_Motion"]), fieldPath: "m_Motion", edgeSubkind: "motion" }]
    : e === "AnimatorStateTransition"
      ? [{ ...Js(t, ["m_DstState"]), fieldPath: "m_DstState", edgeSubkind: "transition" }]
      : e === "AnimatorOverrideController"
        ? Kk(t)
        : [];
}
function Kk(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return [];
  let t = e.m_Clips;
  return Array.isArray(t)
    ? t.map((n, i) => ({
        ...Js(n, ["m_OverrideClip"]),
        fieldPath: `m_Clips[${i}].m_OverrideClip`,
        edgeSubkind: "override",
      }))
    : [];
}
function Dp(e, t) {
  let n = e.name?.trim();
  if (n) return n;
  let i = dt(e, t);
  return Ap(i, ["m_Name"])?.trim() ?? e.localIdentifier;
}
function Cp(e) {
  let t = [],
    n = [],
    i = ct(e.yamlObjects),
    r = e.nextEntityId,
    s = e.nextEdgeId;
  for (let o of e.assets) {
    if (o.assetKind !== "audio_mixer") continue;
    let l = (i.get(o.fileId) ?? []).filter((m) => m.objectType === "AudioMixerGroupController"),
      c = new Map(),
      d = new Map();
    for (let m of l) {
      let y = er(dt(m, e.payloadReader), ["m_Children"]);
      (c.set(m.localIdentifier, y), y.forEach((p) => d.set(p, m.localIdentifier)));
    }
    let u = new Map();
    for (let m of l) {
      let y = d.get(m.localIdentifier),
        p = y ? u.get(y) : null,
        g = Dp(m, e.payloadReader),
        h = Vk(m.localIdentifier, l, d, (_) => Dp(_, e.payloadReader)),
        S = Ye(r++, o, m, "audio_mixer_group", {
          name: g,
          hierarchyName: h,
          parentEntityId: p?.id ?? null,
          typeName: "AudioMixerGroup",
        });
      (t.push(S), u.set(S.localKey, S));
    }
    for (let [m, y] of c.entries()) {
      let p = u.get(m);
      for (let g of y) {
        let h = u.get(g);
        !p ||
          !h ||
          ((h.parentEntityId = p.id), n.push({ id: s++, fromEntityId: h.id, toEntityId: p.id, edgeKind: "child_of" }));
      }
    }
  }
  return { entities: t, edges: n, nextEntityId: r, nextEdgeId: s, pendingEdgeIntents: [] };
}
function jp(e) {
  let t = [],
    n = e.nextEdgeId;
  for (let i of e.intents) {
    let r =
      e.entityIndexes.entitySummaryByYamlObjectId.get(i.sourceYamlObjectId)?.entityId ??
      e.entityIndexes.entityIdByFileIdAndLocalKey.get(_e(i.sourceFileId, i.sourceLocalKey));
    if (r === void 0) continue;
    let s = i.targetLocalId ?? i.targetFileId;
    if (!s || s === "0") continue;
    let o = Yk(e.assetIndexes, { sourceFileId: i.sourceFileId, targetGuid: i.targetGuid });
    if (o === null) continue;
    let a = e.entityIndexes.entityIdByFileIdAndLocalKey.get(_e(o, s));
    if (a === void 0 || a === r || e.entityIndexes.entitySummaryById.get(a)?.entityKind !== "audio_mixer_group")
      continue;
    let c = i.edgeSubkind ?? "USES_AUDIO_MIXER_GROUP",
      d = Je(r, a, "refs", c);
    e.edgeState.seenEntityEdges.has(d) ||
      (e.edgeState.seenEntityEdges.add(d),
      t.push({ id: n++, fromEntityId: r, toEntityId: a, edgeKind: "refs", edgeSubkind: c }));
  }
  return { edges: t, nextEdgeId: n };
}
function Yk(e, t) {
  if (!t.targetGuid) return e.assetIdByFileId.has(t.sourceFileId) ? t.sourceFileId : null;
  let n = e.assetIdByGuid.get(t.targetGuid);
  return n === void 0 ? null : (e.fileIdByAssetId.get(n) ?? null);
}
function Vk(e, t, n, i) {
  let r = new Map(t.map((a) => [a.localIdentifier, a])),
    s = [],
    o = e;
  for (; o;) {
    let a = r.get(o);
    if (!a) break;
    (s.unshift(i(a)), (o = n.get(o)));
  }
  return s.join("/");
}
function $p(e) {
  return "yamlReferences" in e
    ? e.yamlReferences
        .filter((t) => t.sourceYamlObjectId === e.yamlObject.id)
        .flatMap((t) => {
          let n = t.targetLocalId ?? t.targetFileId;
          return !n || n === "0"
            ? []
            : Kp(tM(t.fieldPath))
              ? []
              : [
                  {
                    referenceKind: "asset_ref",
                    sourceYamlObjectId: t.sourceYamlObjectId,
                    sourceFileId: t.fileId,
                    sourceLocalKey: e.yamlObject.localIdentifier,
                    fieldPath: t.fieldPath,
                    targetGuid: t.targetGuid,
                    targetFileId: t.targetFileId,
                    targetLocalId: n,
                  },
                ];
        })
    : Xk(e.payload).map((t) => ({
        referenceKind: "asset_ref",
        sourceYamlObjectId: e.yamlObject.id,
        sourceFileId: e.yamlObject.fileId,
        sourceLocalKey: e.yamlObject.localIdentifier,
        fieldPath: t.path,
        targetGuid: t.guid,
        targetFileId: null,
        targetLocalId: t.fileID,
      }));
}
function Gp(e) {
  let t = [],
    n = Zk(e.entityIndexes),
    i = e.nextEdgeId;
  for (let r of e.intents) {
    let s = Wk(e.entityIndexes, n, r);
    if (s.length === 0) continue;
    let o = r.targetLocalId ?? r.targetFileId;
    if (!o || o === "0") continue;
    let a = eM(e.assetIndexes, r);
    if (a === null) continue;
    let l = Yp(e.entityIndexes, a, o);
    if (
      (!l &&
        r.targetGuid &&
        zk({ path: r.fieldPath, fileID: o, guid: r.targetGuid }) &&
        !Cr(o) &&
        Hk({
          diagnostics: e.diagnostics,
          seenDiagnostics: e.edgeState.seenDiagnostics,
          sourceFileId: r.sourceFileId,
          sourceYamlObjectId: r.sourceYamlObjectId,
          targetFileId: a,
          targetGuid: r.targetGuid,
          targetLocalId: o,
          fieldPath: r.fieldPath,
          assetIndexes: e.assetIndexes,
        }),
      !!l)
    )
      for (let c of s) {
        if (l.entityId === c.entityId) continue;
        let d = Qk(c, r.fieldPath, l),
          u = Je(c.entityId, l.entityId, "refs", d);
        e.edgeState.seenEntityEdges.has(u) ||
          (e.edgeState.seenEntityEdges.add(u),
          t.push({ id: i++, fromEntityId: c.entityId, toEntityId: l.entityId, edgeKind: "refs", edgeSubkind: d }));
      }
  }
  return { edges: t, nextEdgeId: i };
}
function Wk(e, t, n) {
  let i = t.get(n.sourceYamlObjectId) ?? [];
  if (i.length > 0) return qk(i, n.fieldPath);
  let r = Yp(e, n.sourceFileId, n.sourceLocalKey);
  return r === null ? [] : [r];
}
function qk(e, t) {
  let n = e.filter((i) => gi(i.entityKind));
  return n.length === 0 ? e : n.filter((i) => Dr(i.entityKind, t));
}
function zk(e) {
  let t = e.path.trim().toLowerCase();
  return t.length > 0 && !t.endsWith("m_script");
}
function Hk(e) {
  let t = [e.sourceYamlObjectId, e.targetFileId, e.targetLocalId, e.fieldPath].join(":");
  if (e.seenDiagnostics.has(t)) return;
  e.seenDiagnostics.add(t);
  let n = e.assetIndexes.fileAbsPathById.get(e.sourceFileId) ?? `file:${e.sourceFileId}`,
    i = e.assetIndexes.fileAbsPathById.get(e.targetFileId) ?? `file:${e.targetFileId}`;
  e.diagnostics.push({
    severity: "warning",
    category: "resolve",
    stage: "resolve",
    code: "asset_reference_missing_entity",
    filePath: n,
    message: `Asset reference from ${n} object ${e.sourceYamlObjectId} field ${e.fieldPath} targets ${i} guid ${e.targetGuid} fileID ${e.targetLocalId}, but no indexed asset entity exists.`,
  });
}
var Jk = [
  "m_Component",
  "m_Component.component",
  "m_GameObject",
  "m_Father",
  "m_Children",
  "m_TransformParent",
  "m_CorrespondingSourceObject",
  "m_PrefabInstance",
  "m_PrefabAsset",
];
function Kp(e) {
  let t = e.toLowerCase();
  return t.includes("m_modification.m_modifications") && t.endsWith(".target")
    ? !0
    : Jk.some((n) => {
        let i = n.toLowerCase();
        return t === i || t.endsWith(`.${i}`);
      });
}
function Xk(e) {
  let t = [];
  return (
    Mc(e, [], (n, i) => {
      if (!n || typeof n != "object" || Array.isArray(n)) return;
      let r = n;
      if (r.fileID === void 0) return;
      let s = Bp(r.fileID);
      if (!s || s === "0") return;
      let o = Vp(i).join(".");
      Kp(o) || t.push({ path: i.join("."), fileID: s, guid: Bp(r.guid) });
    }),
    t
  );
}
function Qk(e, t, n) {
  let i = t.toLowerCase();
  return e.entityKind === "prefab_instance" &&
    i.includes("m_modification.m_modifications") &&
    i.endsWith("objectreference")
    ? "prefab_property_object_reference"
    : i.includes("dependencies")
      ? "asset_dependency"
      : i.includes("m_materials")
        ? "uses_material"
        : i.includes("m_outputaudiomixergroup")
          ? "USES_AUDIO_MIXER_GROUP"
          : i.endsWith("m_mesh") || i.includes(".m_mesh")
            ? "RENDERS_MESH"
            : i.includes("m_sourceprefab")
              ? "PREFAB_INSTANCE_GUID"
              : n.entityKind === "audio_mixer_group"
                ? "USES_AUDIO_MIXER_GROUP"
                : n.typeName === "Material"
                  ? "uses_material"
                  : e.entityKind === "component"
                    ? "component_reference"
                    : "asset_reference";
}
function Yp(e, t, n) {
  let i = e.entityIdByFileIdAndLocalKey.get(_e(t, n));
  return i === void 0 ? null : (e.entitySummaryById.get(i) ?? null);
}
function Zk(e) {
  let t = new Map();
  for (let n of e.entitySummaryById.values()) {
    if (n.yamlObjectId === null) continue;
    let i = t.get(n.yamlObjectId) ?? [];
    (i.push(n), t.set(n.yamlObjectId, i));
  }
  return t;
}
function eM(e, t) {
  if (!t.targetGuid) return e.assetIdByFileId.has(t.sourceFileId) ? t.sourceFileId : null;
  let n = e.assetIdByGuid.get(t.targetGuid);
  return n === void 0 ? null : (e.fileIdByAssetId.get(n) ?? null);
}
function Bp(e) {
  return typeof e == "string" ? e.trim() || null : typeof e == "number" ? String(e) : null;
}
function Vp(e) {
  return e.filter((t) => !/^\d+$/.test(t));
}
function tM(e) {
  return Vp(e.replace(/\[\d+\]/g, "").split(".")).join(".");
}
function Mc(e, t, n) {
  if ((n(e, t), !(!e || typeof e != "object"))) {
    if (Array.isArray(e)) {
      e.forEach((i, r) => Mc(i, [...t, String(r)], n));
      return;
    }
    Object.entries(e).forEach(([i, r]) => Mc(r, [...t, i], n));
  }
}
function Tc(e) {
  return {
    read(t) {
      if (!e.has(t.id)) throw new Error(`YAML payload ${t.id} was not hydrated for the active batch.`);
      return e.get(t.id);
    },
    clear() {
      e.clear();
    },
  };
}
function Wp(e) {
  return { entities: [], edges: [], nextEntityId: e.nextEntityId, nextEdgeId: e.nextEdgeId };
}
import { readFileSync as nM } from "node:fs";
function nt(e, t) {
  let n = e.get(t);
  if (!n) return null;
  try {
    return nM(n, "utf8");
  } catch {
    return null;
  }
}
import Uc from "node:path";
function zp(e) {
  let t = 1,
    n = new Set();
  return e
    .filter((i) => rM(i))
    .filter((i) => {
      let r = qp(i);
      return n.has(r) ? !1 : (n.add(r), !0);
    })
    .map((i) => ({
      id: t++,
      projectId: 1,
      fileId: i.id,
      assetKind: Lr(i.projectRelPath, i.kind),
      guid: qp(i),
      name: Uc.posix.basename(i.projectRelPath, Uc.posix.extname(i.projectRelPath)),
      vfsRootPath: i.projectRelPath,
    }));
}
function rM(e) {
  return ["asset", "asmdef", "csharp", "scene", "prefab", "yaml-asset"].includes(e.kind)
    ? !!e.guid
    : e.kind === "project-settings" && sM(e.projectRelPath);
}
function qp(e) {
  return e.guid ?? `project-settings:${e.projectRelPath}`;
}
function sM(e) {
  let t = Uc.posix.extname(e).toLowerCase();
  return t === ".asset" || t === ".yaml" || t === ".yml";
}
function Hp(e) {
  let t = [],
    n = [],
    i = [],
    r = cM(e.yamlObjects, (o) => o.fileId),
    s = e.nextEntityId;
  for (let o of e.assets) {
    if (o.assetKind !== "project_settings") continue;
    let a = r.get(o.fileId) ?? [];
    for (let l of a) (t.push(Ye(s++, o, l, "subasset")), i.push(...oM(o.fileId, l, e.payloadReader)));
  }
  return { entities: t, edges: n, nextEntityId: s, nextEdgeId: e.nextEdgeId, pendingEdgeIntents: i };
}
function Jp(e) {
  let t = [],
    n = e.nextEdgeId;
  for (let i of e.intents) {
    if (i.targetLocalId === null) continue;
    let r = aM(i.targetFileId, i.sourceFileId);
    if (r === null) continue;
    let s = e.entityIndexes.entityIdByFileIdAndLocalKey.get(_e(i.sourceFileId, i.sourceLocalKey)),
      o = e.entityIndexes.entityIdByFileIdAndLocalKey.get(_e(r, i.targetLocalId));
    if (s === void 0 || o === void 0 || s === o) continue;
    let a = Je(s, o, "refs", i.edgeSubkind);
    e.edgeState.seenEntityEdges.has(a) ||
      (e.edgeState.seenEntityEdges.add(a), t.push({ id: n++, fromEntityId: s, toEntityId: o, edgeKind: "refs" }));
  }
  return { edges: t, nextEdgeId: n };
}
function oM(e, t, n) {
  return xc(dt(t, n))
    .sort(lM)
    .map((i) => ({
      referenceKind: "yaml_local_ref",
      sourceYamlObjectId: t.id,
      sourceFileId: t.fileId,
      sourceLocalKey: t.localIdentifier,
      fieldPath: `local_file_id:${i}`,
      targetGuid: null,
      targetFileId: String(e),
      targetLocalId: i,
      edgeSubkind: null,
    }));
}
function aM(e, t) {
  if (e === null) return t;
  let n = Number(e);
  return Number.isInteger(n) ? n : null;
}
function lM(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function cM(e, t) {
  let n = new Map();
  for (let i of e) {
    let r = t(i),
      s = n.get(r) ?? [];
    (s.push(i), n.set(r, s));
  }
  return n;
}
function Xp(e) {
  let t = [],
    n = [],
    i = dM(e.yamlObjects, (s) => s.fileId),
    r = e.nextEntityId;
  for (let s of e.assets) {
    if (s.assetKind !== "material") continue;
    let o = i.get(s.fileId);
    if (o === void 0 || o.length === 0) continue;
    let a = o.find((l) => l.objectType === "Material");
    if (!a) {
      e.diagnostics.push({
        severity: "warning",
        category: "extract",
        stage: "resolve",
        filePath: s.vfsRootPath,
        message: "Material asset has no Material YAML document block.",
      });
      continue;
    }
    t.push({
      id: r++,
      assetId: s.id,
      yamlObjectId: a.id,
      entityKind: "material",
      localKey: a.localIdentifier,
      name: a.name ?? s.name,
      hierarchyName: null,
      typeName: "Material",
      scriptSymbolId: null,
      parentEntityId: null,
      sourceEntityId: null,
      lineStart: a.lineStart,
      lineEnd: a.lineEnd,
      generatedContent: null,
    });
  }
  return { entities: t, edges: n, nextEntityId: r, nextEdgeId: e.nextEdgeId };
}
function dM(e, t) {
  let n = new Map();
  for (let i of e) {
    let r = t(i),
      s = n.get(r) ?? [];
    (s.push(i), n.set(r, s));
  }
  return n;
}
var uM = new Set(["LightmapSettings", "NavMeshSettings", "OcclusionCullingSettings", "RenderSettings"]);
function Qp(e) {
  let t = [],
    n = [],
    i = new Map(e.assets.filter((o) => o.assetKind === "scene").map((o) => [o.fileId, o])),
    r = new Set(e.existingEntities.map((o) => o.yamlObjectId).filter((o) => o !== null));
  for (let o of e.entityIndexes?.entitySummaryByYamlObjectId.keys() ?? []) r.add(o);
  let s = e.nextEntityId;
  for (let o of e.yamlObjects) {
    if (!uM.has(o.objectType)) continue;
    let a = i.get(o.fileId);
    a &&
      (r.has(o.id) ||
        t.push({
          id: s++,
          assetId: a.id,
          yamlObjectId: o.id,
          entityKind: "scene_settings",
          localKey: o.localIdentifier,
          name: o.name ?? o.objectType,
          hierarchyName: null,
          typeName: o.objectType,
          scriptSymbolId: null,
          parentEntityId: null,
          sourceEntityId: null,
          lineStart: o.lineStart,
          lineEnd: o.lineEnd,
        }));
  }
  return { entities: t, edges: n, nextEntityId: s, nextEdgeId: e.nextEdgeId };
}
function Zp(e) {
  let t = [],
    n = [],
    i = ct(e.yamlObjects),
    r = e.nextEntityId;
  for (let s of e.assets) {
    if (s.assetKind !== "scene_template") continue;
    let o = nt(e.fileAbsPathById, s.fileId);
    if (!o) {
      e.diagnostics.push({
        severity: "warning",
        category: "extract",
        stage: "resolve",
        filePath: s.vfsRootPath,
        message: "Scene template asset has no readable source text.",
      });
      continue;
    }
    let a = (i.get(s.fileId) ?? []).find((c) => c.objectType === "MonoBehaviour");
    if (!a) {
      e.diagnostics.push({
        severity: "warning",
        category: "extract",
        stage: "resolve",
        filePath: s.vfsRootPath,
        message: "Scene template asset has no MonoBehaviour YAML document block.",
      });
      continue;
    }
    let l = Ku(o);
    if (l.length === 0) {
      e.diagnostics.push({
        severity: "warning",
        category: "extract",
        stage: "resolve",
        filePath: s.vfsRootPath,
        message: "Scene template asset has no recognizable section blocks.",
      });
      continue;
    }
    for (let c of l)
      t.push({
        id: r++,
        assetId: s.id,
        yamlObjectId: a.id,
        entityKind: c.entityKind,
        localKey: c.localKey,
        name: c.name,
        hierarchyName: null,
        typeName: c.name,
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: c.lineStart,
        lineEnd: c.lineEnd,
        generatedContent: c.content,
      });
  }
  return { entities: t, edges: n, nextEntityId: r, nextEdgeId: e.nextEdgeId };
}
function eh(e) {
  let t = [],
    n = [],
    i = ct(e.yamlObjects),
    r = e.nextEntityId,
    s = e.nextEdgeId;
  for (let o of e.assets) {
    if (o.assetKind !== "scriptable_object") continue;
    let a = [],
      l = i.get(o.fileId) ?? [];
    for (let c of l) {
      let d = c.scriptGuid ? (e.scriptSymbolByFileGuid.get(c.scriptGuid) ?? null) : null,
        u = c.objectType === "MonoBehaviour" || !!d,
        m = Ye(r++, o, c, u ? "scriptable_object" : "subasset", {
          name: u && d ? d.simpleName : c.name,
          typeName: u && d ? d.qualifiedName : c.objectType,
          scriptSymbolId: d?.id ?? null,
        });
      (t.push(m), a.push(m));
    }
    s = Op({ edges: n, assetId: o.id, entities: a, yamlObjects: l, nextEdgeId: s, payloadReader: e.payloadReader });
  }
  return { entities: t, edges: n, nextEntityId: r, nextEdgeId: s };
}
function th(e) {
  let t = [],
    n = [],
    i = [],
    r = e.nextEntityId,
    s = e.nextEdgeId;
  for (let a of e.assets) {
    if (!(a.assetKind === "shader_lab" || a.assetKind === "shader_graph" || a.vfsRootPath.endsWith(".shadersubgraph")))
      continue;
    let c = nt(e.fileAbsPathById, a.fileId);
    if (
      c &&
      (a.assetKind === "shader_lab" && (r = fM(t, r, a.id, c)),
      a.assetKind === "shader_graph" || a.vfsRootPath.endsWith(".shadersubgraph"))
    ) {
      let d = yM(t, r, s, a.id, a.guid, a.vfsRootPath, c, e, i);
      ((r = d.nextEntityId), (s = d.nextEdgeId));
    }
  }
  let o = gM(t, n, r, s, i, e);
  return ((r = o.nextEntityId), (s = o.nextEdgeId), { entities: t, edges: n, nextEntityId: r, nextEdgeId: s });
}
function nh(e, t) {
  let n = [],
    i = [],
    r = e.nextEntityId;
  for (let s of e.assets) {
    if (s.assetKind !== "visual_effect_graph") continue;
    let o = e.yamlObjects.filter((m) => m.fileId === s.fileId);
    if (o.length === 0) continue;
    let a = [],
      l = [],
      c = t.has(s.fileId),
      d = mM(a, c ? r : 1, e.nextEdgeId, s.id, s.guid, s.vfsRootPath, nt(e.fileAbsPathById, s.fileId) ?? "", e, l);
    c && (n.push(...a), (r = d.nextEntityId));
    let u = o[0].id;
    for (let m of l)
      i.push(
        ...m.references.map((y) => ({
          referenceKind: "shader_graph_guid_ref",
          sourceYamlObjectId: u,
          sourceFileId: s.fileId,
          sourceLocalKey: m.sourceEntity.localKey,
          fieldPath: y.path,
          targetGuid: y.guid,
          targetFileId: null,
          targetLocalId: y.fileID,
          edgeSubkind: "vfx_graph_guid_reference",
        })),
      );
  }
  return { entities: n, edges: [], pendingEdgeIntents: i, nextEntityId: r, nextEdgeId: e.nextEdgeId };
}
function ih(e) {
  let t = [],
    n = [],
    i = new Map(e.assets.map((a) => [a.id, a])),
    r = new Map(),
    s = e.nextEntityId,
    o = e.nextEdgeId;
  for (let a of e.intents) {
    let l = e.entityIndexes.entityIdByFileIdAndLocalKey.get(_e(a.sourceFileId, a.sourceLocalKey)),
      c = e.assetIndexes.assetIdByGuid.get(a.targetGuid ?? ""),
      d = c === void 0 ? void 0 : i.get(c);
    if (!l || !d || d.fileId === a.sourceFileId) continue;
    let u = a.targetLocalId ?? d.guid,
      m = a.targetLocalId ? e.entityIndexes.entityIdByFileIdAndLocalKey.get(_e(d.fileId, a.targetLocalId)) : void 0;
    if (
      ((m ??= r.get(`${d.id}:${u}`)),
      m === void 0 &&
        (m = [...e.entityIndexes.entitySummaryById.values()]
          .filter((p) => p.assetId === d.id)
          .find(
            (p) => p.entityKind === "shader_graph_properties" || p.entityKind === "visual_effect_graph_properties",
          )?.entityId),
      m === void 0)
    ) {
      let p = {
        id: s++,
        assetId: d.id,
        yamlObjectId: null,
        entityKind: "subasset",
        localKey: u,
        name: d.name,
        hierarchyName: null,
        typeName: rh(d.assetKind),
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: 1,
        lineEnd: 1,
      };
      (t.push(p), r.set(`${d.id}:${u}`, p.id), (m = p.id));
    }
    let y = Je(l, m, "refs", a.edgeSubkind);
    e.edgeState.seenEntityEdges.has(y) ||
      (e.edgeState.seenEntityEdges.add(y),
      n.push({ id: o++, fromEntityId: l, toEntityId: m, edgeKind: "refs", edgeSubkind: a.edgeSubkind }));
  }
  return { entities: t, edges: n, nextEntityId: s, nextEdgeId: o };
}
function fM(e, t, n, i) {
  let r = i.match(/\bProperties\s*\{([\s\S]*?)^\s*\}/m)?.[1] ?? "",
    s = /^\s*([A-Za-z_][\w]*)\s*\([^,]+,\s*([^)]+)\)/gm;
  for (let l of r.matchAll(s)) {
    let c = l[1],
      d = l[2]?.trim() ?? "";
    e.push(Ac(t++, n, "shader_property", c, SM(d) ? "TextureProperty" : "ShaderProperty"));
  }
  let o = /\bPass\s*\{[\s\S]*?\bName\s+"([^"]+)"/g;
  for (let l of i.matchAll(o)) e.push(Ac(t++, n, "shader_pass", l[1], "ShaderPass"));
  let a = i.match(/\bFallback\s+"([^"]+)"/)?.[1] ?? null;
  return (a && e.push(Ac(t++, n, "shader_fallback", a, "ShaderFallback")), t);
}
function mM(e, t, n, i, r, s, o, a, l) {
  if (!bM(o))
    return (
      a.diagnostics.push({
        severity: "warning",
        category: "extract",
        stage: "resolve",
        filePath: s,
        message: "Visual Effect Graph structured indexing supports YAML .vfx files only; skipping structured entities.",
      }),
      { nextEntityId: t, nextEdgeId: n }
    );
  let c = a.yamlObjects.filter((_) => _.fileId === a.assets.find((E) => E.id === i)?.fileId),
    d = cf(c, a.payloadReader);
  if (!d)
    return (
      a.diagnostics.push({
        severity: "warning",
        category: "extract",
        stage: "resolve",
        filePath: s,
        message: "Failed to parse Visual Effect Graph YAML objects.",
      }),
      { nextEntityId: t, nextEdgeId: n }
    );
  let u = tn(r, s),
    m = df(d, u),
    y = `vfx_graph_properties:${u}`,
    p = {
      id: t++,
      assetId: i,
      yamlObjectId: null,
      entityKind: "visual_effect_graph_properties",
      localKey: y,
      name: "Properties",
      hierarchyName: null,
      typeName: "Properties",
      scriptSymbolId: null,
      parentEntityId: null,
      sourceEntityId: null,
      lineStart: 1,
      lineEnd: 1,
      generatedContent: m.get(y) ?? null,
    };
  e.push(p);
  let g = d.subgraphDependencies.flatMap((_) => _.guidReferences),
    h = nn(d.properties),
    S = [...g, ...h];
  S.length > 0 && l.push({ sourceEntity: p, references: S });
  for (let _ of d.contexts) {
    let E = `vfx_graph_context:${_.localId}`,
      b = {
        id: t++,
        assetId: i,
        yamlObjectId: null,
        entityKind: "visual_effect_graph_context",
        localKey: E,
        name: _.displayName,
        hierarchyName: null,
        typeName: _.typeName,
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: 1,
        lineEnd: 1,
        generatedContent: m.get(E) ?? null,
      };
    (e.push(b), _.guidReferences.length > 0 && l.push({ sourceEntity: b, references: _.guidReferences }));
  }
  for (let _ of d.blocks) {
    let E = `vfx_graph_block:${_.localId}`,
      b = {
        id: t++,
        assetId: i,
        yamlObjectId: null,
        entityKind: "visual_effect_graph_block",
        localKey: E,
        name: _.displayName,
        hierarchyName: null,
        typeName: _.typeName,
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: 1,
        lineEnd: 1,
        generatedContent: m.get(E) ?? null,
      };
    (e.push(b), _.guidReferences.length > 0 && l.push({ sourceEntity: b, references: _.guidReferences }));
  }
  return { nextEntityId: t, nextEdgeId: n };
}
function yM(e, t, n, i, r, s, o, a, l) {
  let c;
  try {
    c = sa(o);
  } catch (h) {
    return (
      a.diagnostics.push({
        severity: "warning",
        category: "extract",
        stage: "resolve",
        filePath: s,
        message: `Failed to parse ShaderGraph JSON: ${_M(h)}`,
      }),
      { nextEntityId: t, nextEdgeId: n }
    );
  }
  let d = tn(r, s),
    u = oa(c, d),
    m = `shader_graph_properties:${d}`,
    y = {
      id: t++,
      assetId: i,
      yamlObjectId: null,
      entityKind: "shader_graph_properties",
      localKey: m,
      name: "ShaderGraphProperties",
      hierarchyName: null,
      typeName: "ShaderGraphProperties",
      scriptSymbolId: null,
      parentEntityId: null,
      sourceEntityId: null,
      lineStart: 1,
      lineEnd: 1,
      generatedContent: u.get(m) ?? null,
    };
  e.push(y);
  let p = `shader_graph_settings:${d}`,
    g = {
      id: t++,
      assetId: i,
      yamlObjectId: null,
      entityKind: "shader_graph_settings",
      localKey: p,
      name: "ShaderGraphSettings",
      hierarchyName: null,
      typeName: "ShaderGraphSettings",
      scriptSymbolId: null,
      parentEntityId: null,
      sourceEntityId: null,
      lineStart: 1,
      lineEnd: 1,
      generatedContent: u.get(p) ?? null,
    };
  e.push(g);
  for (let h of c.nodes) {
    let S = `shader_graph_node:${h.objectId}`,
      _ = {
        id: t++,
        assetId: i,
        yamlObjectId: null,
        entityKind: "shader_graph_node",
        localKey: S,
        name: h.displayName,
        hierarchyName: null,
        typeName: h.typeName,
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: 1,
        lineEnd: 1,
        generatedContent: u.get(S) ?? null,
      };
    (e.push(_), h.guidReferences.length > 0 && l.push({ sourceEntity: _, references: h.guidReferences }));
  }
  return { nextEntityId: t, nextEdgeId: n };
}
function gM(e, t, n, i, r, s) {
  let o = new Map(s.assets.map((c) => [c.guid, c])),
    a = new Map(s.existingEntities.concat(e).map((c) => [`${c.assetId}:${c.localKey}`, c])),
    l = new Set();
  for (let c of r)
    for (let d of c.references) {
      let u = o.get(d.guid);
      if (!u || u.id === c.sourceEntity.assetId) continue;
      let m = pM(e, a, n, u, d);
      n = m.nextEntityId;
      let y = hM(c.sourceEntity.entityKind, d.path),
        p = `${c.sourceEntity.id}:${m.entity.id}:${y}`;
      l.has(p) ||
        (l.add(p),
        t.push({
          id: i++,
          fromEntityId: c.sourceEntity.id,
          toEntityId: m.entity.id,
          edgeKind: "refs",
          edgeSubkind: y,
        }));
    }
  return { nextEntityId: n, nextEdgeId: i };
}
function pM(e, t, n, i, r) {
  let s = r.fileID ?? i.guid,
    o = t.get(`${i.id}:${s}`);
  if (o) return { entity: o, nextEntityId: n };
  let a = e.find(
    (c) =>
      c.assetId === i.id &&
      (c.entityKind === "shader_graph_properties" || c.entityKind === "visual_effect_graph_properties"),
  );
  if (a) return { entity: a, nextEntityId: n };
  let l = {
    id: n++,
    assetId: i.id,
    yamlObjectId: null,
    entityKind: "subasset",
    localKey: s,
    name: i.name,
    hierarchyName: null,
    typeName: rh(i.assetKind),
    scriptSymbolId: null,
    parentEntityId: null,
    sourceEntityId: null,
    lineStart: 1,
    lineEnd: 1,
  };
  return (e.push(l), t.set(`${i.id}:${l.localKey}`, l), { entity: l, nextEntityId: n });
}
function hM(e, t) {
  return e === "visual_effect_graph_properties" ||
    e === "visual_effect_graph_context" ||
    e === "visual_effect_graph_block"
    ? "vfx_graph_guid_reference"
    : IM(t);
}
function IM(e) {
  let t = e.toLowerCase();
  return t.includes("custom") || t.includes("function") || t.includes("source")
    ? "shader_graph_custom_function"
    : "shader_graph_guid_reference";
}
function rh(e) {
  return e
    .split(/[_-]+/g)
    .filter(Boolean)
    .map((t) => `${t[0]?.toUpperCase() ?? ""}${t.slice(1)}`)
    .join("");
}
function bM(e) {
  return /^\s*%YAML\b/m.test(e) || /^\s*---\s*!u!/m.test(e);
}
function Ac(e, t, n, i, r) {
  return {
    id: e,
    assetId: t,
    yamlObjectId: null,
    entityKind: n,
    localKey: `${n}:${e}`,
    name: i,
    hierarchyName: null,
    typeName: r,
    scriptSymbolId: null,
    parentEntityId: null,
    sourceEntityId: null,
    lineStart: 1,
    lineEnd: 1,
  };
}
function SM(e) {
  return ["2D", "3D", "Cube", "2DArray", "CubeArray"].includes(e);
}
function _M(e) {
  return e instanceof Error ? e.message : String(e);
}
var sh = Od(uc(), 1);
import EM from "node:path";
var RM = { intAsBigInt: !0, uniqueKeys: !1 };
function oh(e) {
  let t = [],
    n = e.nextEntityId,
    i = new Map(e.scopedFiles.map((r) => [r.projectRelPath, r]));
  for (let r of e.assets) {
    if (r.assetKind !== "texture") continue;
    let s = i.get(`${r.vfsRootPath}.meta`)?.id ?? -1,
      o = nt(e.fileAbsPathById, s) ?? "",
      a = wM(o);
    for (let l of kM(a, e.metaFileIdToNameByFileId.get(r.fileId)))
      t.push({
        id: n++,
        assetId: r.id,
        yamlObjectId: null,
        entityKind: "sprite",
        localKey: l.localKey,
        name: l.name,
        hierarchyName: null,
        typeName: "Sprite",
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: 1,
        lineEnd: 1,
      });
  }
  return { entities: t, edges: [], nextEntityId: n, nextEdgeId: e.nextEdgeId };
}
function wM(e) {
  if (!e.trim()) return [];
  try {
    let t = sh.default.parseDocument(e, RM);
    if (t.errors.length > 0) return [];
    let n = t.toJS(),
      i = tr(n)?.TextureImporter,
      r = tr(i)?.spriteSheet;
    return PM(r);
  } catch {
    return [];
  }
}
function PM(e) {
  let t = tr(e);
  if (!t) return [];
  let n = vM(t.sprites),
    i = new Set(n.map((r) => r.name));
  for (let r of xM(t.nameFileIdTable)) i.has(r.name) || (i.add(r.name), n.push(r));
  return n;
}
function vM(e) {
  return Array.isArray(e)
    ? e.flatMap((t) => {
        let n = tr(t),
          i = ah(n?.name),
          r = lh(n?.internalID);
        return i && r ? [{ name: i, localKey: r }] : [];
      })
    : [];
}
function xM(e) {
  let t = tr(e);
  return t
    ? Object.entries(t).flatMap(([n, i]) => {
        let r = lh(i);
        return r ? [{ name: n, localKey: r }] : [];
      })
    : [];
}
function kM(e, t) {
  if (!t) return e;
  let n = new Set(e.map((r) => r.localKey)),
    i = [...e];
  for (let [r, s] of t) n.has(r) || !s.trim() || (n.add(r), i.push({ name: EM.posix.basename(s.trim()), localKey: r }));
  return i;
}
function tr(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : null;
}
function ah(e) {
  return typeof e == "string" && e.trim() ? e.trim() : null;
}
function lh(e) {
  return typeof e == "bigint" || typeof e == "number" ? String(e) : ah(e);
}
function ch(e) {
  let t = [],
    n = e.nextEntityId;
  for (let i of e.assets) {
    if (!(i.assetKind === "uxml" || i.assetKind === "uss")) continue;
    let s = nt(e.fileAbsPathById, i.fileId);
    s && (i.assetKind === "uxml" && (n = MM(t, n, i.id, s)), i.assetKind === "uss" && (n = TM(t, n, i.id, s)));
  }
  return { entities: t, edges: [], nextEntityId: n, nextEdgeId: e.nextEdgeId };
}
function MM(e, t, n, i) {
  let r = /<\s*Template\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  for (let o of i.matchAll(r)) e.push(nr(t++, n, "uxml_reference", o[1], "UXMLTemplateReference"));
  let s = /<\s*Style\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  for (let o of i.matchAll(s)) e.push(nr(t++, n, "uxml_reference", o[1], "UXMLStylesheetReference"));
  return t;
}
function TM(e, t, n, i) {
  let r = /@import\s+(?:url\()?["']?([^"');]+)["']?\)?\s*;/gi;
  for (let a of i.matchAll(r)) e.push(nr(t++, n, "uss_reference", a[1], "USSImportReference"));
  let s = /\burl\(\s*["']?([^"')]+)["']?\s*\)/gi;
  for (let a of i.matchAll(s)) e.push(nr(t++, n, "uss_reference", a[1], "USSUrlReference"));
  let o = /\bresource\(\s*["']([^"']+)["']\s*\)/gi;
  for (let a of i.matchAll(o)) e.push(nr(t++, n, "uss_reference", a[1], "USSResourceReference"));
  return t;
}
function nr(e, t, n, i, r) {
  return {
    id: e,
    assetId: t,
    yamlObjectId: null,
    entityKind: n,
    localKey: `${n}:${e}`,
    name: i,
    hierarchyName: null,
    typeName: r,
    scriptSymbolId: null,
    parentEntityId: null,
    sourceEntityId: null,
    lineStart: 1,
    lineEnd: 1,
  };
}
function uh(e) {
  return UM(e.payload).flatMap((t) => {
    let n = AM(t.item),
      i = Zs(t.item.m_MethodName);
    return i
      ? [
          {
            referenceKind: "unity_event",
            sourceYamlObjectId: e.yamlObject.id,
            sourceFileId: e.yamlObject.fileId,
            sourceLocalKey: e.yamlObject.localIdentifier,
            fieldPath: t.fieldPath,
            targetGuid: n.guid,
            targetFileId: null,
            targetLocalId: n.fileID,
            methodName: i,
            callState: Oc(t.item.m_CallState),
            argumentMode: Oc(t.item.m_Mode),
            objectArgumentTypeName: mh(t.item),
          },
        ]
      : [];
  });
}
function fh(e) {
  let t = CM(
      e.symbols.filter((r) => r.symbolKind === "method"),
      (r) => r.containingSymbolId,
    ),
    n = [],
    i = e.nextEntitySymbolEdgeId;
  for (let r of e.intents) {
    let s =
      e.entityIndexes.entitySummaryByYamlObjectId.get(r.sourceYamlObjectId) ??
      dh(e.entityIndexes, r.sourceFileId, r.sourceLocalKey);
    if (!s || !r.targetLocalId || r.targetLocalId === "0" || r.targetGuid || r.callState === 0) continue;
    let o = dh(e.entityIndexes, r.sourceFileId, r.targetLocalId);
    if (!o || o.entityKind !== "component" || o.scriptSymbolId === null) continue;
    let a = (t.get(o.scriptSymbolId) ?? []).filter((c) => c.simpleName === r.methodName),
      l = OM(a, {
        m_Mode: r.argumentMode,
        m_Arguments: { m_ObjectArgumentAssemblyTypeName: r.objectArgumentTypeName },
      });
    if (l.status === "resolved") {
      let c = Pp(s.entityId, l.symbol.id, "calls", "unity_event", r.fieldPath);
      if (e.edgeState.seenEntitySymbolEdges.has(c)) continue;
      (e.edgeState.seenEntitySymbolEdges.add(c),
        n.push({
          id: i++,
          fromEntityId: s.entityId,
          toSymbolId: l.symbol.id,
          edgeKind: "calls",
          edgeSubkind: "unity_event",
          sourceFieldPath: r.fieldPath,
        }));
      continue;
    }
    DM({
      diagnostics: e.diagnostics,
      seenDiagnostics: e.edgeState.seenDiagnostics,
      sourcePath: e.sourcePathByFileId?.get(r.sourceFileId) ?? `file:${r.sourceFileId}`,
      sourceLocalKey: r.sourceLocalKey,
      methodName: r.methodName,
      fieldPath: r.fieldPath,
      targetScriptSymbolId: o.scriptSymbolId,
      candidates: a,
      code: l.status === "ambiguous" ? "unity_event_ambiguous_method" : "unity_event_unresolved_method",
    });
  }
  return { entitySymbolEdges: n, nextEntitySymbolEdgeId: i };
}
function UM(e) {
  let t = [];
  return (
    Fc(e, [], (n, i) => {
      if (!n || typeof n != "object" || Array.isArray(n)) return;
      let s = n.m_PersistentCalls;
      if (!s || typeof s != "object" || Array.isArray(s)) return;
      let o = s.m_Calls;
      Array.isArray(o) &&
        o.forEach((a, l) => {
          !a ||
            typeof a != "object" ||
            Array.isArray(a) ||
            t.push({ item: a, fieldPath: [...i, "m_PersistentCalls", "m_Calls", String(l)].join(".") });
        });
    }),
    t
  );
}
function AM(e) {
  let t = e.m_Target;
  if (!t || typeof t != "object" || Array.isArray(t)) return { fileID: null, guid: null };
  let n = t;
  return { fileID: Zs(n.fileID), guid: Zs(n.guid) };
}
function OM(e, t) {
  if (e.length === 0) return { status: "missing" };
  if (e.length === 1) return { status: "resolved", symbol: e[0] };
  let n = Oc(t.m_Mode),
    i = FM(e, n, t);
  return i.length === 1 ? { status: "resolved", symbol: i[0] } : { status: i.length === 0 ? "missing" : "ambiguous" };
}
function FM(e, t, n) {
  switch (t) {
    case 1:
      return e.filter((i) => Qs(i).length === 0);
    case 2:
      return NM(e, n);
    case 3:
      return e.filter((i) => Xs(i, ["int", "int32"]));
    case 4:
      return e.filter((i) => Xs(i, ["float", "single"]));
    case 5:
      return e.filter((i) => Xs(i, ["string"]));
    case 6:
      return e.filter((i) => Xs(i, ["bool", "boolean"]));
    default:
      return e;
  }
}
function NM(e, t) {
  let n = mh(t),
    i = e.filter((r) => Qs(r).length === 1);
  return n ? i.filter((r) => Qs(r)[0] === n) : i;
}
function mh(e) {
  let t = e.m_Arguments;
  if (!t || typeof t != "object" || Array.isArray(t)) return null;
  let n = Zs(t.m_ObjectArgumentAssemblyTypeName);
  return n ? yh(n.split(",")[0] ?? n) : null;
}
function Xs(e, t) {
  let n = Qs(e);
  return n.length === 1 && t.includes(n[0] ?? "");
}
function Qs(e) {
  return LM(e.signature).parameterTypes;
}
function LM(e) {
  if (!e) return { parameterTypes: [] };
  let t = e.match(/\((.*)\)/)?.[1]?.trim() ?? "";
  return t
    ? {
        parameterTypes: t
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean)
          .map((n) => n.split(/\s+/)[0] ?? "")
          .map((n) => yh(n)),
      }
    : { parameterTypes: [] };
}
function yh(e) {
  let n = e.replace(/\[\]$/g, "").replace(/<.*>$/g, "");
  return (n.split(".").pop() ?? n).toLowerCase();
}
function DM(e) {
  let t = [e.code, e.sourcePath, e.sourceLocalKey, e.fieldPath, e.methodName, e.targetScriptSymbolId].join(":");
  if (e.seenDiagnostics.has(t)) return;
  e.seenDiagnostics.add(t);
  let n = e.candidates.map((i) => i.signature ?? i.displayName).join("; ");
  e.diagnostics.push({
    severity: "warning",
    category: "resolve",
    stage: "resolve",
    code: e.code,
    filePath: e.sourcePath,
    message: [
      `Could not uniquely resolve UnityEvent listener ${e.methodName}`,
      `at ${e.fieldPath}`,
      `in ${e.sourcePath}`,
      `source local id ${e.sourceLocalKey}`,
      `target script symbol ${e.targetScriptSymbolId}`,
      `candidate count ${e.candidates.length}`,
      n ? `candidates: ${n}` : "",
    ]
      .filter(Boolean)
      .join("; "),
  });
}
function dh(e, t, n) {
  let i = e.entityIdByFileIdAndLocalKey.get(_e(t, n));
  return i === void 0 ? null : (e.entitySummaryById.get(i) ?? null);
}
function Zs(e) {
  return typeof e == "string" ? e.trim() || null : typeof e == "number" ? String(e) : null;
}
function Oc(e) {
  if (typeof e == "number") return e;
  if (typeof e == "string" && e.trim()) {
    let t = Number.parseInt(e, 10);
    return Number.isFinite(t) ? t : null;
  }
  return null;
}
function Fc(e, t, n) {
  if ((n(e, t), !(!e || typeof e != "object"))) {
    if (Array.isArray(e)) {
      e.forEach((i, r) => Fc(i, [...t, String(r)], n));
      return;
    }
    Object.entries(e).forEach(([i, r]) => Fc(r, [...t, i], n));
  }
}
function CM(e, t) {
  let n = new Map();
  for (let i of e) {
    let r = t(i),
      s = n.get(r) ?? [];
    (s.push(i), n.set(r, s));
  }
  return n;
}
function ir(e) {
  return {
    *iterateFileBatches(t) {
      jM(t);
      let n = BM(e, t.fileIds),
        i = $M(n),
        r = { fileIds: [], yamlObjectIds: [] };
      for (let [s, o] of i) {
        let a = r.fileIds.length > 0 && r.fileIds.length + 1 > t.maxFilesPerBatch,
          l = r.yamlObjectIds.length > 0 && r.yamlObjectIds.length + o.length > t.maxObjectsPerBatch;
        ((a || l) && (yield r, (r = { fileIds: [], yamlObjectIds: [] })),
          r.fileIds.push(s),
          r.yamlObjectIds.push(...o));
      }
      r.fileIds.length > 0 && (yield r);
    },
    loadRowsForBatch(t) {
      return GM(e, t.yamlObjectIds);
    },
    loadReferencesForBatch(t) {
      return KM(e, t.yamlObjectIds);
    },
  };
}
function jM(e) {
  if (!Number.isFinite(e.maxFilesPerBatch) || e.maxFilesPerBatch <= 0)
    throw new Error("maxFilesPerBatch must be positive.");
  if (!Number.isFinite(e.maxObjectsPerBatch) || e.maxObjectsPerBatch <= 0)
    throw new Error("maxObjectsPerBatch must be positive.");
}
function BM(e, t) {
  let n = `SELECT id, file_id
       FROM yaml_objects`,
    i = t === void 0 ? void 0 : ve(t);
  return (
    i !== void 0
      ? ae(
          e,
          `${n}
           WHERE file_id IN (`,
          i,
          ") ORDER BY file_id, id",
        )
      : e.prepare(`${n} ORDER BY file_id, id`).all()
  ).sort(gh);
}
function $M(e) {
  let t = new Map();
  for (let n of e) {
    let i = t.get(n.file_id) ?? [];
    (i.push(n.id), t.set(n.file_id, i));
  }
  return t;
}
function GM(e, t) {
  return ae(
    e,
    `SELECT id,
            file_id,
            object_type,
            local_identifier,
            game_object_file_id,
            script_guid,
            script_file_id,
            name,
            line_start,
            line_end
     FROM yaml_objects
     WHERE id IN (`,
    t,
    ")",
  )
    .sort(gh)
    .map((i) => ({
      id: i.id,
      fileId: i.file_id,
      objectType: i.object_type,
      localIdentifier: i.local_identifier,
      gameObjectFileId: i.game_object_file_id,
      scriptGuid: i.script_guid,
      scriptFileId: i.script_file_id,
      name: i.name,
      lineStart: i.line_start,
      lineEnd: i.line_end,
    }));
}
function KM(e, t) {
  return ae(
    e,
    `SELECT id,
            file_id,
            source_yaml_object_id,
            field_path,
            target_guid,
            target_file_id,
            target_local_id,
            ref_kind
     FROM yaml_references
     WHERE source_yaml_object_id IN (`,
    t,
    ")",
  )
    .sort((i, r) => i.id - r.id)
    .map((i) => ({
      id: i.id,
      fileId: i.file_id,
      sourceYamlObjectId: i.source_yaml_object_id,
      fieldPath: i.field_path,
      targetGuid: i.target_guid,
      targetFileId: i.target_file_id,
      targetLocalId: i.target_local_id,
      refKind: i.ref_kind,
    }));
}
function gh(e, t) {
  return e.file_id - t.file_id || e.id - t.id;
}
function Lc(e) {
  let t = aT(e.batchOptions),
    n = e.batchSource ?? ir(e.database),
    i = tT(zp(e.files), e.startAssetId ?? 1);
  Ip(e.database, i);
  let r = VM({ input: e, assets: i }),
    s = 0,
    o = (a) => {
      if (!e.stopwatch) {
        a();
        return;
      }
      let l = performance.now();
      try {
        a();
      } finally {
        s += performance.now() - l;
      }
    };
  return {
    consumeBatch(a, l) {
      o(() => {
        ph(r, a.rows.length);
        let c = { database: e.database, state: r, input: e, batch: a };
        (l === "rebuild_entities"
          ? WM(c)
          : (_h(c), Sh(c), r.intentStore.addMany(kc({ yamlObjects: a.rows, payloadReader: a.payloadReader })), to(r)),
          HM({ state: r, batch: a }));
      });
    },
    finalize() {
      return (
        o(() => {
          zM({ database: e.database, state: r, input: e });
          for (let a of n.iterateFileBatches({ ...t, fileIds: e.sourceFileIds })) {
            let l = YM(n, a);
            (ph(r, l.rows.length), qM({ database: e.database, state: r, input: e, batch: l }));
          }
        }),
        e.stopwatch?.recordDuration("emit_asset_entities", Math.ceil(s)),
        Nc(e.stopwatch, "collect_pending_edge_intents", () => {}),
        JM({ database: e.database, state: r, input: e }),
        QM(e.database, r),
        e.onBeforeWriteRows?.(r.summary),
        r.summary
      );
    },
  };
}
function YM(e, t) {
  return { rows: e.loadRowsForBatch(t), yamlReferencesByObjectId: new Map(), yamlMetadataById: new Map() };
}
function bh(e) {
  return {
    rows: e.rows,
    yamlReferencesByObjectId: cT(e.references),
    payloadReader: Tc(e.payloadByYamlObjectId),
    yamlMetadataById: Wg(e.rows, e.yamlMetadataById, lT(e.references), e.payloadByYamlObjectId),
  };
}
function VM(e) {
  let n = [...(e.input.preservedAssets ?? []), ...e.assets],
    i = new Map(n.map((s) => [s.id, s])),
    r = Rc();
  for (let s of e.input.preservedEntitySummaries ?? []) r.addEntity(s);
  return {
    assets: e.assets,
    indexedAssets: n,
    assetById: i,
    assetIndexes: Ec(n, nT(e.input.fileAbsPathById, e.input.preservedFileAbsPathById)),
    entityIndexes: r,
    intentStore: Rp(),
    edgeState: wp(),
    scopedMonoScriptSymbols: fp(e.input.files, e.input.scriptSymbolByFileGuid),
    processedVisualEffectGraphFileIds: new Set(),
    streamedHierarchyEntityById: new Map(),
    nextEntityId: e.input.startEntityId ?? 1,
    nextEdgeId: e.input.startEdgeId ?? 1,
    nextEntitySymbolEdgeId: e.input.startEntitySymbolEdgeId ?? 1,
    summary: {
      assetCount: e.assets.length,
      entityCount: 0,
      entityEdgeCount: 0,
      entitySymbolEdgeCount: 0,
      pendingEdgeIntentCount: 0,
      peakPendingEdgeIntentCount: 0,
      peakPendingEdgeIntentBytes: 0,
      peakLoadedYamlObjectRowCount: 0,
      peakBufferedEntityRowCount: 0,
      peakBufferedEntityEdgeRowCount: 0,
    },
  };
}
function WM(e) {
  let t = new Set(e.batch.rows.map((r) => r.fileId)),
    n = e.state.assets.filter((r) => t.has(r.fileId)),
    i = [Mp, Xp, Zp, Hp, Fp, Np, Cp, eh];
  for (let r of i) {
    let s = Eh({ ...e, extractor: r, assets: n });
    eo({ database: e.database, state: e.state, input: e.input, result: s });
  }
  (_h(e), Sh(e));
}
function Sh(e) {
  (e.state.intentStore.addMany(
    iT({
      assets: e.state.assets,
      preservedAssets: e.input.preservedAssets ?? [],
      yamlObjects: e.batch.rows,
      yamlMetadataById: e.batch.yamlMetadataById,
      preservedEntitySummaries: e.input.preservedEntitySummaries ?? [],
      edgeSourceFileIds: e.input.edgeSourceFileIds,
      payloadReader: e.batch.payloadReader,
    }),
  ),
    to(e.state));
}
function qM(e) {
  let t = Qp({
    assets: e.state.assets,
    existingEntities: [],
    entityIndexes: e.state.entityIndexes,
    fileAbsPathById: e.state.assetIndexes.fileAbsPathById,
    metaFileIdToNameByFileId: e.input.metaFileIdToNameByFileId,
    scopedFiles: e.input.files,
    yamlObjects: e.batch.rows,
    yamlMetadataById: e.batch.yamlMetadataById,
    scriptSymbolByFileGuid: e.input.scriptSymbolByFileGuid,
    scopedMonoScriptSymbols: e.state.scopedMonoScriptSymbols,
    symbols: e.input.symbols,
    diagnostics: e.input.diagnostics,
    nextEntityId: e.state.nextEntityId,
    nextEdgeId: e.state.nextEdgeId,
    nextEntitySymbolEdgeId: e.state.nextEntitySymbolEdgeId,
  });
  eo({ database: e.database, state: e.state, input: e.input, result: t });
}
function zM(e) {
  let t = [
    { extractor: th, assets: e.state.assets.filter((n) => n.assetKind !== "visual_effect_graph") },
    {
      extractor: ch,
      assets: e.state.assets.filter(
        (n) => n.assetKind === "uxml" || n.assetKind === "uss" || n.assetKind === "json_file",
      ),
    },
    { extractor: oh, assets: e.state.assets.filter((n) => n.assetKind === "texture") },
    { extractor: Wp, assets: e.state.assets },
  ];
  for (let { extractor: n, assets: i } of t) {
    if (i.length === 0) continue;
    let r = Eh({
      state: e.state,
      input: e.input,
      batch: {
        rows: [],
        yamlMetadataById: new Map(),
        yamlReferencesByObjectId: new Map(),
        payloadReader: Tc(new Map()),
      },
      extractor: n,
      assets: i,
    });
    eo({ database: e.database, state: e.state, input: e.input, result: r });
  }
  for (let n of e.state.assets) {
    if (n.assetKind !== "visual_effect_graph" || e.state.processedVisualEffectGraphFileIds.has(n.fileId)) continue;
    nt(e.state.assetIndexes.fileAbsPathById, n.fileId) !== null &&
      e.input.diagnostics.push({
        severity: "warning",
        category: "extract",
        stage: "resolve",
        filePath: n.vfsRootPath,
        message: "Visual Effect Graph structured indexing supports YAML .vfx files only; skipping structured entities.",
      });
  }
}
function _h(e) {
  let t = new Set(e.batch.rows.map((o) => o.fileId)),
    n = new Set(e.state.assets.filter((o) => o.assetKind === "visual_effect_graph").map((o) => o.fileId)),
    i = new Set(e.input.edgeSourceFileIds ?? []),
    r = e.state.indexedAssets.filter(
      (o) => o.assetKind === "visual_effect_graph" && t.has(o.fileId) && (n.has(o.fileId) || i.has(o.fileId)),
    );
  if (r.length === 0) return;
  r.forEach((o) => e.state.processedVisualEffectGraphFileIds.add(o.fileId));
  let s = nh(
    {
      assets: r,
      existingEntities: [],
      entityIndexes: e.state.entityIndexes,
      fileAbsPathById: e.state.assetIndexes.fileAbsPathById,
      metaFileIdToNameByFileId: e.input.metaFileIdToNameByFileId,
      scopedFiles: e.input.files,
      yamlObjects: e.batch.rows,
      yamlMetadataById: e.batch.yamlMetadataById,
      payloadReader: e.batch.payloadReader,
      scriptSymbolByFileGuid: e.input.scriptSymbolByFileGuid,
      scopedMonoScriptSymbols: e.state.scopedMonoScriptSymbols,
      symbols: e.input.symbols,
      diagnostics: e.input.diagnostics,
      nextEntityId: e.state.nextEntityId,
      nextEdgeId: e.state.nextEdgeId,
      nextEntitySymbolEdgeId: e.state.nextEntitySymbolEdgeId,
    },
    n,
  );
  eo({ database: e.database, state: e.state, input: e.input, result: s });
}
function Eh(e) {
  return e.extractor({
    assets: e.assets ?? e.state.assets,
    existingEntities: [],
    entityIndexes: e.state.entityIndexes,
    fileAbsPathById: e.state.assetIndexes.fileAbsPathById,
    metaFileIdToNameByFileId: e.input.metaFileIdToNameByFileId,
    scopedFiles: e.input.files,
    yamlObjects: e.batch.rows,
    yamlMetadataById: e.batch.yamlMetadataById,
    payloadReader: e.batch.payloadReader,
    scriptSymbolByFileGuid: e.input.scriptSymbolByFileGuid,
    scopedMonoScriptSymbols: e.state.scopedMonoScriptSymbols,
    symbols: e.input.symbols,
    diagnostics: e.input.diagnostics,
    nextEntityId: e.state.nextEntityId,
    nextEdgeId: e.state.nextEdgeId,
    nextEntitySymbolEdgeId: e.state.nextEntitySymbolEdgeId,
  });
}
function eo(e) {
  (wh(e.state, { entities: e.result.entities.length, entityEdges: e.result.edges.length }),
    _c(e.database, [...e.result.entities]),
    (e.state.summary.entityCount += e.result.entities.length));
  for (let t of e.result.entities)
    (e.state.entityIndexes.addEntity(Ph(e.state.assetById, t)),
      (t.entityKind === "gameobject" || t.entityKind === "prefab_instance") &&
        e.state.streamedHierarchyEntityById.set(t.id, t));
  (gn({ database: e.database, state: e.state, input: e.input, edges: e.result.edges }),
    Rh({ database: e.database, state: e.state, input: e.input, edges: e.result.entitySymbolEdges ?? [] }),
    "pendingEdgeIntents" in e.result && (e.state.intentStore.addMany(e.result.pendingEdgeIntents), to(e.state)),
    (e.state.nextEntityId = e.result.nextEntityId),
    (e.state.nextEdgeId = e.result.nextEdgeId),
    (e.state.nextEntitySymbolEdgeId = e.result.nextEntitySymbolEdgeId ?? e.state.nextEntitySymbolEdgeId));
}
function HM(e) {
  for (let t of e.batch.rows)
    (e.state.intentStore.addMany(
      $p({ yamlObject: t, yamlReferences: e.batch.yamlReferencesByObjectId.get(t.id) ?? [] }),
    ),
      e.state.intentStore.addMany(uh({ yamlObject: t, payload: e.batch.payloadReader.read(t) })));
  to(e.state);
}
function JM(e) {
  let t = Nc(e.input.stopwatch, "sort_pending_edge_intents", () => e.state.intentStore.toSortedArray());
  e.state.summary.pendingEdgeIntentCount = t.length;
  let n = dT(t, e.state.assetIndexes);
  Nc(e.input.stopwatch, "resolve_pending_edge_intents", () => {
    for (let i of fT(t, 2e4)) {
      let r = Tp({
        intents: Gt(i, "prefab_link"),
        entityIndexes: e.state.entityIndexes,
        assetIndexes: e.state.assetIndexes,
        edgeState: e.state.edgeState,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = r.nextEdgeId),
        gn({ database: e.database, state: e.state, input: e.input, edges: r.edges }),
        XM({ database: e.database, state: e.state, input: e.input, updates: r.sourceEntityUpdates }));
      let s = Jp({
        intents: Gt(i, "yaml_local_ref").filter((u) => !n.has(uT(u))),
        entityIndexes: e.state.entityIndexes,
        edgeState: e.state.edgeState,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = s.nextEdgeId),
        gn({ database: e.database, state: e.state, input: e.input, edges: s.edges }));
      let o = Lp({
        intents: Gt(i, "animator_ref"),
        entityIndexes: e.state.entityIndexes,
        assetIndexes: e.state.assetIndexes,
        edgeState: e.state.edgeState,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = o.nextEdgeId),
        gn({ database: e.database, state: e.state, input: e.input, edges: o.edges }));
      let a = Gp({
        intents: Gt(i, "asset_ref"),
        entityIndexes: e.state.entityIndexes,
        assetIndexes: e.state.assetIndexes,
        edgeState: e.state.edgeState,
        diagnostics: e.input.diagnostics,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = a.nextEdgeId),
        gn({ database: e.database, state: e.state, input: e.input, edges: a.edges }));
      let l = jp({
        intents: Gt(i, "audio_mixer_group_ref"),
        entityIndexes: e.state.entityIndexes,
        assetIndexes: e.state.assetIndexes,
        edgeState: e.state.edgeState,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = l.nextEdgeId),
        gn({ database: e.database, state: e.state, input: e.input, edges: l.edges }));
      let c = ih({
        intents: Gt(i, "shader_graph_guid_ref"),
        assets: e.state.indexedAssets,
        assetIndexes: e.state.assetIndexes,
        entityIndexes: e.state.entityIndexes,
        edgeState: e.state.edgeState,
        nextEntityId: e.state.nextEntityId,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEntityId = c.nextEntityId),
        (e.state.nextEdgeId = c.nextEdgeId),
        _c(e.database, c.entities),
        (e.state.summary.entityCount += c.entities.length));
      for (let u of c.entities) e.state.entityIndexes.addEntity(Ph(e.state.assetById, u));
      gn({ database: e.database, state: e.state, input: e.input, edges: c.edges });
      let d = fh({
        intents: Gt(i, "unity_event"),
        entityIndexes: e.state.entityIndexes,
        symbols: e.input.symbols,
        edgeState: e.state.edgeState,
        diagnostics: e.input.diagnostics,
        nextEntitySymbolEdgeId: e.state.nextEntitySymbolEdgeId,
        sourcePathByFileId: new Map(e.state.indexedAssets.map((u) => [u.fileId, u.vfsRootPath])),
      });
      ((e.state.nextEntitySymbolEdgeId = d.nextEntitySymbolEdgeId),
        Rh({ database: e.database, state: e.state, input: e.input, edges: d.entitySymbolEdges }));
    }
  });
}
function gn(e) {
  wh(e.state, { entities: 0, entityEdges: e.edges.length });
  let t = rT(
    [...e.edges],
    e.state.entityIndexes.entitySummaryById,
    e.input.edgeSourceFileIds,
    e.input.completeEdgeSourceFileIds,
    e.input.edgeTargetFileIds,
  );
  (bp(e.database, t), (e.state.summary.entityEdgeCount += t.length));
}
function Rh(e) {
  let t = sT(
    [...e.edges],
    e.state.entityIndexes.entitySummaryById,
    e.input.symbols,
    e.input.edgeSourceFileIds,
    e.input.completeEdgeSourceFileIds,
    e.input.entitySymbolEdgeTargetFileIds,
  );
  (Sp(e.database, t), (e.state.summary.entitySymbolEdgeCount += t.length));
}
function XM(e) {
  let t = oT(
    e.updates,
    e.state.entityIndexes.entitySummaryById,
    e.input.edgeSourceFileIds,
    e.input.completeEdgeSourceFileIds,
    e.input.edgeTargetFileIds,
  );
  _p(e.database, t);
  for (let n of t) {
    let i = e.state.streamedHierarchyEntityById.get(n.entityId);
    i && (i.sourceEntityId = n.sourceEntityId);
  }
}
function QM(e, t) {
  let n = new Map();
  for (let r of t.streamedHierarchyEntityById.values()) {
    let s = t.assetIndexes.fileIdByAssetId.get(r.assetId);
    if (s === void 0) continue;
    let o = `${s}:${r.parentEntityId ?? "root"}`,
      a = n.get(o) ?? [];
    (a.push(r), n.set(o, a));
  }
  let i = [];
  for (let r of n.values()) {
    if (!r.some((a) => ZM(a, t))) continue;
    r.sort((a, l) => (a.hierarchyOrder ?? a.id) - (l.hierarchyOrder ?? l.id) || a.id - l.id);
    let s = r.map((a) => eT(a, t)),
      o = new Map();
    for (let a of s) o.set(a, (o.get(a) ?? 0) + 1);
    r.forEach((a, l) => {
      let c = s[l],
        d = (o.get(c) ?? 0) > 1 ? `${c}#${l}` : c;
      ((a.hierarchyName = d), i.push({ entityId: a.id, hierarchyName: d }));
    });
  }
  Ep(e, i);
}
function ZM(e, t) {
  if (e.entityKind !== "prefab_instance" || !e.sourceEntityId) return !1;
  let n = t.assetById.get(e.assetId),
    i = (e.name ?? e.typeName).trim() || e.typeName;
  return !!(n && i === Ih.posix.basename(n.vfsRootPath));
}
function eT(e, t) {
  let n = (e.name ?? e.typeName).trim() || e.typeName;
  if (e.entityKind !== "prefab_instance" || !e.sourceEntityId) return n;
  let i = t.assetById.get(e.assetId);
  if (!i || n !== Ih.posix.basename(i.vfsRootPath)) return n;
  let r = t.streamedHierarchyEntityById.get(e.sourceEntityId),
    s = t.entityIndexes.entitySummaryById.get(e.sourceEntityId);
  return r?.name ?? s?.name ?? r?.typeName ?? s?.typeName ?? n;
}
function ph(e, t) {
  e.summary.peakLoadedYamlObjectRowCount = Math.max(e.summary.peakLoadedYamlObjectRowCount, t);
}
function wh(e, t) {
  ((e.summary.peakBufferedEntityRowCount = Math.max(e.summary.peakBufferedEntityRowCount, t.entities)),
    (e.summary.peakBufferedEntityEdgeRowCount = Math.max(e.summary.peakBufferedEntityEdgeRowCount, t.entityEdges)));
}
function to(e) {
  ((e.summary.peakPendingEdgeIntentCount = Math.max(e.summary.peakPendingEdgeIntentCount, e.intentStore.count())),
    (e.summary.peakPendingEdgeIntentBytes = Math.max(
      e.summary.peakPendingEdgeIntentBytes,
      e.intentStore.approximateSizeBytes(),
    )));
}
function tT(e, t) {
  let n = t;
  return e.map((i) => ({ ...i, id: n++ }));
}
function nT(e, t) {
  return t === void 0 || t.size === 0 ? e : new Map([...t, ...e]);
}
function Nc(e, t, n) {
  if (!e) return n();
  e.start(t);
  try {
    return n();
  } finally {
    e.stop(t);
  }
}
function iT(e) {
  if (e.preservedAssets.length === 0) return [];
  let t = new Set(e.assets.map((o) => o.fileId)),
    n = e.edgeSourceFileIds === void 0 ? void 0 : new Set(e.edgeSourceFileIds),
    i = new Map(e.preservedAssets.map((o) => [o.fileId, o])),
    r = Rc();
  for (let o of e.preservedEntitySummaries) r.addEntity(o);
  let s = [];
  for (let o of e.yamlObjects) {
    if (o.objectType !== "PrefabInstance" || t.has(o.fileId) || (n !== void 0 && !n.has(o.fileId))) continue;
    let a = i.get(o.fileId),
      l = e.yamlMetadataById.get(o.id)?.sourcePrefabGuid;
    if (!a || !l) continue;
    let c = r.projectableRootEntityIdByAssetId.get(a.id),
      d = c ? r.entitySummaryById.get(c)?.yamlObjectId : null;
    s.push({
      referenceKind: "prefab_link",
      sourceYamlObjectId: o.id,
      sourceFileId: o.fileId,
      sourceLocalKey: o.localIdentifier,
      fieldPath: "PrefabInstance.m_SourcePrefab",
      targetGuid: l,
      targetFileId: null,
      targetLocalId: Ke(e.payloadReader.read(o), ["m_SourcePrefab"]),
      edgeKind: a.assetKind === "prefab" && o.id === d ? "variant_of" : "instance_of",
      prefabSourceGuid: l,
    });
  }
  return s;
}
function rT(e, t, n, i, r) {
  if (n === void 0) return e;
  let s = new Set(n),
    o = new Set(i ?? []),
    a = r !== void 0,
    l = new Set(r ?? []);
  return e.filter((c) => {
    let d = t.get(c.fromEntityId);
    if (d === void 0 || !s.has(d.fileId)) return !1;
    if (o.has(d.fileId) || !a) return !0;
    let u = t.get(c.toEntityId);
    return u !== void 0 && l.has(u.fileId);
  });
}
function sT(e, t, n, i, r, s) {
  if (i === void 0) return e;
  let o = new Set(i),
    a = new Set(r ?? []),
    l = s !== void 0,
    c = new Set(s ?? []),
    d = new Map(n.map((u) => [u.id, u]));
  return e.filter((u) => {
    let m = t.get(u.fromEntityId);
    if (m === void 0 || !o.has(m.fileId)) return !1;
    if (a.has(m.fileId) || !l) return !0;
    let y = d.get(u.toSymbolId);
    return y !== void 0 && y.fileId !== null && c.has(y.fileId);
  });
}
function oT(e, t, n, i, r) {
  if (n === void 0) return e;
  let s = new Set(n),
    o = new Set(i ?? []),
    a = r !== void 0,
    l = new Set(r ?? []);
  return e.filter((c) => {
    let d = t.get(c.entityId);
    if (d === void 0 || !s.has(d.fileId)) return !1;
    if (o.has(d.fileId) || !a) return !0;
    let u = t.get(c.sourceEntityId ?? -1);
    return u !== void 0 && l.has(u.fileId);
  });
}
function aT(e = {}) {
  return { maxFilesPerBatch: hh(e.maxFilesPerBatch, 750), maxObjectsPerBatch: hh(e.maxObjectsPerBatch, 2e4) };
}
function hh(e, t) {
  return e === void 0 || !Number.isFinite(e) || e <= 0 ? t : Math.floor(e);
}
function lT(e) {
  let t = new Map();
  for (let n of e) {
    if (n.refKind !== "guid-file" || n.targetGuid === null) continue;
    let i = t.get(n.sourceYamlObjectId) ?? new Map();
    (i.has(n.fieldPath) || i.set(n.fieldPath, n.targetGuid), t.set(n.sourceYamlObjectId, i));
  }
  return t;
}
function cT(e) {
  let t = new Map();
  for (let n of e) {
    let i = t.get(n.sourceYamlObjectId);
    i === void 0 ? t.set(n.sourceYamlObjectId, [n]) : i.push(n);
  }
  return t;
}
function Ph(e, t) {
  let n = e.get(t.assetId);
  if (!n) throw new Error(`Entity ${t.id} references unknown asset.`);
  return {
    entityId: t.id,
    assetId: t.assetId,
    fileId: n.fileId,
    yamlObjectId: t.yamlObjectId,
    localKey: t.localKey,
    entityKind: t.entityKind,
    name: t.name,
    typeName: t.typeName,
    scriptSymbolId: t.scriptSymbolId,
    parentEntityId: t.parentEntityId,
  };
}
function Gt(e, t) {
  return e.filter((n) => n.referenceKind === t);
}
function dT(e, t) {
  return new Set(
    Gt(e, "asset_ref")
      .filter(
        (n) =>
          n.targetGuid === null || t.fileIdByAssetId.get(t.assetIdByGuid.get(n.targetGuid) ?? -1) === n.sourceFileId,
      )
      .map((n) => vh(n.sourceYamlObjectId, n.sourceFileId, n.sourceLocalKey, n.targetLocalId ?? n.targetFileId)),
  );
}
function uT(e) {
  return vh(e.sourceYamlObjectId, e.sourceFileId, e.sourceLocalKey, e.targetLocalId);
}
function vh(e, t, n, i) {
  return [e, t, n, i ?? ""].join(":");
}
function fT(e, t) {
  let n = [];
  for (let i = 0; i < e.length; i += t) n.push(e.slice(i, i + t));
  return n;
}
import { readFileSync as mT } from "node:fs";
function yT() {
  let e = process.env.UNITY_INSIGHT_MAX_FANOUT_SCOPES;
  if (!e?.trim()) return 64;
  let t = Number.parseInt(e, 10);
  return Number.isFinite(t) && t > 0 ? t : 64;
}
function ut(e, t) {
  for (let n of e) {
    let i = t.get(n.key);
    if (!i) {
      t.set(n.key, {
        ...n,
        fileIds: [...n.fileIds],
        projectRelPaths: [...n.projectRelPaths],
        vfsPathPrefixes: [...n.vfsPathPrefixes],
      });
      continue;
    }
    let r = new Set([...i.fileIds, ...n.fileIds]),
      s = new Set([...i.projectRelPaths, ...n.projectRelPaths]),
      o = new Set([...i.vfsPathPrefixes, ...n.vfsPathPrefixes]);
    t.set(n.key, { kind: i.kind, key: i.key, fileIds: [...r], projectRelPaths: [...s], vfsPathPrefixes: [...o] });
  }
}
function Dc(e, t, n = "file", i = "fanout") {
  let r = e.prepare("SELECT project_rel_path FROM files WHERE id = ?").get(t);
  if (!r) return null;
  let s = r.project_rel_path.replace(/\\/g, "/");
  return { kind: n, key: `${i}:${s}`, fileIds: [t], projectRelPaths: [s], vfsPathPrefixes: ui(s) };
}
function gT(e, t) {
  let n = new Set();
  for (let i of t)
    e.prepare(
      `SELECT DISTINCT file_id
         FROM yaml_references
         WHERE target_guid = ?`,
    )
      .all(i)
      .forEach((s) => n.add(s.file_id));
  return [...n];
}
function pT(e, t, n, i) {
  let r = new Set(),
    s = new Set(),
    o = 0,
    a = e.prepare(`SELECT guid
     FROM files
     WHERE kind IN ('prefab', 'scene')
       AND (id = ? OR meta_file_id = ?)`),
    l = e.prepare(`SELECT DISTINCT files.id, files.guid
     FROM yaml_references
     JOIN files ON files.id = yaml_references.file_id
     WHERE yaml_references.field_path = 'm_SourcePrefab'
       AND yaml_references.target_guid = ?
       AND files.kind IN ('prefab', 'scene')`),
    c = t.flatMap((d) => {
      let u = a.get(d, d);
      return u?.guid ? [u.guid] : [];
    });
  for (let d of c) {
    if (r.has(d)) continue;
    r.add(d);
    let u = l.all(d);
    for (let m of u) {
      if (!n.has(m.id) && !s.has(m.id)) {
        if (o >= i) return { fileIds: ve([...s]), overflow: !0 };
        o += 1;
      }
      (s.add(m.id), m.guid && !r.has(m.guid) && c.push(m.guid));
    }
  }
  return { fileIds: ve([...s]), overflow: !1 };
}
function Cc(e) {
  return {
    scopes: e.scopes,
    materializeScopes: e.materializeScopes,
    purgeScopes: e.materializeScopes,
    resolveFileIds: e.resolveFileIds,
    fanoutTruncated: !0,
    csharpSymbolOnly: !1,
    assetSelfOnly: !1,
    scriptPatchGuids: [],
  };
}
function hT(e, t) {
  let n = new Set();
  for (let i of t) {
    let r = i.replace(/\\/g, "/"),
      s = `${r}:/`,
      o = e
        .prepare(
          `SELECT DISTINCT source_file_id, vfs_path
         FROM vfs_entries
         WHERE projection_kind IN ('prefab_inherited', 'source_prefab')
           AND source_file_id IS NOT NULL
           AND (
             source_vfs_path LIKE ? OR
             source_vfs_path = ? OR
             source_owner_vfs_path LIKE ? OR
             target_vfs_path LIKE ? OR
             vfs_path LIKE ?
           )`,
        )
        .all(`${s}%`, r, `${s}%`, `${s}%`, `${s}%`);
    for (let a of o) {
      n.add(a.source_file_id);
      let l = a.vfs_path.split(":")[0];
      if (l) {
        let c = e.prepare("SELECT id FROM files WHERE project_rel_path = ?").get(l);
        c && n.add(c.id);
      }
    }
  }
  return [...n];
}
function no(e, t) {
  let n = new Set(),
    i = IT(e);
  for (let r of t) {
    let s = i.get(r) ?? null,
      o = e
        .prepare(
          `SELECT decl_kind, qualified_name_text
         FROM cs_declarations
         WHERE file_id = ?
           AND decl_kind IN ('class', 'interface', 'struct')
           AND qualified_name_text IS NOT NULL
         ORDER BY decl_kind, qualified_name_text`,
        )
        .all(r);
    for (let a of o) {
      let c = e
        .prepare(
          `SELECT declarations.file_id
           FROM cs_declarations declarations
           JOIN files ON files.id = declarations.file_id
           WHERE declarations.decl_kind = ?
             AND declarations.qualified_name_text = ?
           ORDER BY files.project_rel_path,
                    declarations.line_start,
                    declarations.line_end,
                    declarations.id`,
        )
        .all(a.decl_kind, a.qualified_name_text)
        .filter((d) => (i.get(d.file_id) ?? null) === s);
      c.length <= 1 || c.forEach((d) => n.add(d.file_id));
    }
  }
  return [...n].sort((r, s) => r - s);
}
function IT(e) {
  let t = new Map(
      e
        .prepare("SELECT id, name FROM assemblies")
        .all()
        .map((s) => [s.name, s.id]),
    ),
    n = bT(e, t),
    i = e
      .prepare(
        `SELECT id, project_rel_path
       FROM files
       WHERE kind = 'csharp'`,
      )
      .all(),
    r = new Map();
  for (let s of i) {
    let o = s.project_rel_path.replace(/\\/g, "/"),
      a = ST(o, n);
    if (a) {
      r.set(s.id, a);
      continue;
    }
    let l = o.toLowerCase().includes("/editor/") ? "Assembly-CSharp-Editor" : "Assembly-CSharp";
    r.set(s.id, t.get(l) ?? null);
  }
  return r;
}
function bT(e, t) {
  let n = new Map(),
    i = e
      .prepare(
        `SELECT project_rel_path, abs_path
       FROM files
       WHERE kind = 'asmdef'`,
      )
      .all();
  for (let r of i)
    try {
      let s = mT(r.abs_path, "utf8"),
        o = Wt(s),
        a = t.get(o.name);
      a && n.set(jc(r.project_rel_path.replace(/\\/g, "/")), a);
    } catch {}
  return n;
}
function ST(e, t) {
  let n = jc(e);
  for (; n !== "." && n !== "";) {
    let i = t.get(n);
    if (i) return i;
    n = jc(n);
  }
  return null;
}
function jc(e) {
  let t = e.replace(/\\/g, "/"),
    n = t.lastIndexOf("/");
  return n < 0 ? "." : t.slice(0, n);
}
function Bc(e, t, n, i = {}) {
  let r = i.maxFanoutScopes ?? yT(),
    s = i.csharpSymbolOnly ?? t.csharpSymbolOnlyChanges,
    o = i.assetSelfOnly ?? t.assetSelfOnlyChanges,
    a = i.referenceFanout ?? !1,
    l = a && !s && !o,
    c = new Map();
  if ((ut(t.scopes, c), c.size > r || t.requiresFullDerivedRebuild)) return Cc(t);
  let d = [];
  if (l)
    for (let G of t.resolveFileIds) {
      let re = e.prepare("SELECT guid FROM files WHERE id = ?").get(G);
      re?.guid && d.push(re.guid);
    }
  let u = l ? gT(e, d) : [],
    m = t.scopes
      .filter((G) => G.kind === "structural")
      .flatMap((G) => G.projectRelPaths)
      .filter((G) => !G.endsWith(".meta")),
    y = a ? hT(e, m) : [],
    p = pT(
      e,
      ve([...t.scopes.flatMap((G) => G.fileIds), ...t.deletedFileIds]),
      new Set([...t.resolveFileIds, ...t.scopes.flatMap((G) => G.fileIds)]),
      r - c.size,
    );
  if (p.overflow) return Cc(t);
  let g = p.fileIds;
  g.length > 0 && (o = !1);
  let h = no(e, t.resolveFileIds),
    S = [],
    _ = [...u, ...y, ...g, ...h];
  for (let G of _) {
    if (t.resolveFileIds.includes(G)) continue;
    let re = Dc(e, G, "file", g.includes(G) ? "prefab-consumer" : "fanout");
    re && S.push(re);
  }
  ut(S, c);
  let E = [...c.values()];
  if (E.length > r) return Cc(t);
  let b = ve([...t.resolveFileIds, ...E.flatMap((G) => G.fileIds)]),
    R = Xt(e, b),
    v = no(e, R),
    T = a && s ? mu(e, R) : [],
    x = s ? ve([...R, ...v, ...T]) : o ? ve(t.resolveFileIds) : b,
    $ = new Map(),
    z = new Map();
  if (s) {
    (ut(t.scopes, $), ut(t.scopes, z));
    for (let G of v) {
      let re = Dc(e, G, "file", "fanout");
      re && ut([re], z);
    }
    for (let G of x) {
      if (t.resolveFileIds.includes(G)) continue;
      let re = Dc(e, G, "file", "fanout");
      re && ut([re], $);
    }
  } else o ? (ut(t.scopes, $), ut(t.scopes, z)) : (ut(E, $), ut(E, z));
  let Y = new Set(x),
    V = s ? gu(e, Xt(e, t.resolveFileIds)) : [];
  return {
    scopes: E,
    materializeScopes: [...$.values()],
    purgeScopes: [...z.values()],
    resolveFileIds: [...Y],
    fanoutTruncated: !1,
    csharpSymbolOnly: s,
    assetSelfOnly: o,
    scriptPatchGuids: V,
  };
}
function $c(e, t, n, i) {
  let r = new Map(),
    s = ye(e, "symbols");
  for (let d of [...t].sort((u, m) => u.id - m.id)) {
    let u = s++;
    (r.set(d.id, u), (d.id = u));
  }
  for (let d of t)
    d.containingSymbolId !== null &&
      r.has(d.containingSymbolId) &&
      (d.containingSymbolId = r.get(d.containingSymbolId) ?? d.containingSymbolId);
  let o = ye(e, "symbol_edges"),
    a = n.map((d) => ({
      ...d,
      id: o++,
      fromSymbolId: r.get(d.fromSymbolId) ?? d.fromSymbolId,
      toSymbolId: r.get(d.toSymbolId) ?? d.toSymbolId,
    })),
    l = ye(e, "semantic_bindings"),
    c = i.map((d) => ({
      ...d,
      id: l++,
      sourceSymbolId: r.get(d.sourceSymbolId) ?? d.sourceSymbolId,
      targetSymbolId: d.targetSymbolId === null ? null : (r.get(d.targetSymbolId) ?? d.targetSymbolId),
    }));
  return { symbols: t, edges: a, bindings: c };
}
import { existsSync as RT } from "node:fs";
import { fileURLToPath as Th } from "node:url";
import { Worker as wT } from "node:worker_threads";
import { createHash as xh } from "node:crypto";
import { readFile as _T } from "node:fs/promises";
function Gc(e, t = ET(e)) {
  if (!e?.startsWith("%YAML")) return { kind: "skipped_binary", observedHash: t };
  try {
    let n = Xg();
    return { kind: "extracted", extracted: Qg(e, n), phaseDurations: n, observedHash: t };
  } catch (n) {
    return { kind: "error", message: Mh(n), observedHash: t };
  }
}
async function kh(e) {
  try {
    let t = await _T(e),
      n = xh("sha256").update(t).digest("hex");
    return Vs(t) ? Gc(t.toString("utf8"), n) : { kind: "skipped_binary", observedHash: n };
  } catch (t) {
    return { kind: "error", message: Mh(t), observedHash: null };
  }
}
function ET(e) {
  return e === null ? null : xh("sha256").update(e).digest("hex");
}
function Mh(e) {
  return e instanceof Error ? e.message : String(e);
}
var PT = 64 * 1024 * 1024,
  vT = 16 * 1024 * 1024,
  xT = 2;
function kT(e = process.env) {
  return {
    recycleBytes: Kc(e.UNITY_INSIGHT_YAML_WORKER_RECYCLE_BYTES, PT),
    largeFileBytes: Kc(e.UNITY_INSIGHT_YAML_LARGE_FILE_BYTES, vT),
    maxConcurrentLargeFiles: AT(e.UNITY_INSIGHT_YAML_MAX_CONCURRENT_LARGE_FILES, xT),
  };
}
function Yc() {
  return jf();
}
function MT(e, t, n = {}) {
  return process.env.UNITY_INSIGHT_YAML_PARSE_WORKERS === "0" || t < 1 || e <= 1 || n.hasOnlyDeferredContent === !1
    ? !1
    : (n.canCreateWorker ?? Ah() !== null);
}
async function Uh(e, t = {}) {
  if (e.length === 0) return [];
  let n = t.concurrency ?? Yc(),
    i = Ah(),
    r = e.every((o) => o.contentText === null),
    s = t.dependencies?.createWorker !== void 0 || i !== null;
  return MT(e.length, n, { hasOnlyDeferredContent: r, canCreateWorker: s })
    ? TT(e, i ?? "", n, t)
    : UT(e, n, t.onFileComplete, t.onFileOutcome, t.deliverOutcomesInOrder === !0, t.retainResults !== !1);
}
async function TT(e, t, n, i) {
  let r = i.reusePolicy ?? kT(),
    s = Math.min(n, e.length),
    o = s * 2,
    a = i.retainResults !== !1,
    l = a ? new Array(e.length) : void 0,
    c = new Map(),
    d = new Uint8Array(e.length),
    u = new Set(),
    m = new Map(),
    y = [],
    p = i.dependencies?.createWorker ?? ((k) => new wT(k)),
    g = {
      ...r,
      initialWorkerCount: 0,
      replacementWorkerCount: 0,
      retiredForLargeFileCount: 0,
      retiredForCumulativeBytesCount: 0,
      processedBytes: 0,
      peakConcurrentLargeFiles: 0,
    },
    h = 1,
    S = 0,
    _ = 0,
    E = 0,
    b = 0,
    R = 0,
    v = 0,
    T = !1,
    x = !1,
    $ = null,
    z = null,
    Y = [],
    V = [],
    G = !1,
    re = new Promise((k, C) => {
      (($ = k), (z = C));
    }),
    W = (k) => {
      T || ((T = !0), z?.(k instanceof Error ? k : new Error(String(k))));
    },
    ce = (k) => {
      let C = y.indexOf(k);
      C >= 0 && y.splice(C, 1);
    },
    Ee = (k) => (k.terminationPromise || (k.terminationPromise = k.worker.terminate()), k.terminationPromise),
    le = () => b < e.length,
    pe = (k) => r.largeFileBytes > 0 && e[k].sizeBytes >= r.largeFileBytes,
    Oe = () => {
      if (i.deliverOutcomesInOrder !== !0) {
        if (v < r.maxConcurrentLargeFiles && E < Y.length) {
          let C = Y[E];
          return ((E += 1), C);
        }
        for (; _ < e.length;) {
          let C = _;
          if (((_ += 1), pe(C) && v >= r.maxConcurrentLargeFiles)) {
            Y.push(C);
            continue;
          }
          return C;
        }
        return null;
      }
      let k = Math.min(e.length, S + o);
      for (let C = S; C < k; C += 1) if (d[C] === 0 && !(pe(C) && v >= r.maxConcurrentLargeFiles)) return C;
      return null;
    },
    it = (k) => {
      if (T || x || k.state !== "idle") return !1;
      let C = Oe();
      if (C === null) return !1;
      let ue = pe(C);
      ((d[C] = 1),
        (k.state = "busy"),
        (k.activeTaskIndex = C),
        (k.activeTaskIsLarge = ue),
        ue && ((v += 1), (g.peakConcurrentLargeFiles = Math.max(g.peakConcurrentLargeFiles, v))));
      let Le = e[C];
      try {
        k.worker.postMessage({ type: "extract", taskIndex: C, absolutePath: Le.absolutePath });
      } catch (fe) {
        W(fe);
      }
      return !0;
    },
    $e = () => {
      for (let k = 0; k < y.length && !T;) {
        let C = y[k];
        if (C.state !== "idle") {
          y.splice(k, 1);
          continue;
        }
        if (it(C)) {
          y.splice(k, 1);
          continue;
        }
        k += 1;
      }
    },
    P = () => {
      !T && b === e.length && R === e.length && ((T = !0), $?.(l ?? []));
    },
    A = async () => {
      if (!(G || T)) {
        G = !0;
        try {
          for (; !T;) {
            let k = i.deliverOutcomesInOrder === !0 ? c.get(S) : V.shift();
            if (!k) break;
            i.deliverOutcomesInOrder === !0 && c.delete(S);
            let C = i.onFileOutcome?.(k);
            for (C && typeof C.then == "function" && (await C), d[k.taskIndex] = 3, R += 1; S < d.length && d[S] === 3;)
              S += 1;
            $e();
          }
          P();
        } catch (k) {
          W(k);
        } finally {
          G = !1;
        }
      }
    },
    F = (k) => {
      (i.deliverOutcomesInOrder === !0 ? c.set(k.taskIndex, k) : V.push(k), A());
    },
    B = async (k, C) => {
      k.state === "retiring" ||
        k.state === "closing" ||
        k.state === "stopped" ||
        ((k.state = C === "pool_close" ? "closing" : "retiring"),
        ce(k),
        C === "large_file"
          ? (g.retiredForLargeFileCount += 1)
          : C === "cumulative_bytes" && (g.retiredForCumulativeBytesCount += 1),
        await Ee(k),
        (k.state = "stopped"),
        u.delete(k),
        m.delete(k.worker),
        C !== "pool_close" && !T && !x && le() && u.size < s && (ee(!0), $e()));
    },
    ne = (k, C) => {
      if (T || x || C.type !== "result") return;
      if (k.state !== "busy" || k.activeTaskIndex === null || C.taskIndex !== k.activeTaskIndex) {
        W(new Error(`YAML extract worker ${k.generation} returned unexpected task ${C.taskIndex}`));
        return;
      }
      let ue = k.activeTaskIndex,
        Le = k.activeTaskIsLarge;
      ((k.activeTaskIndex = null), (k.activeTaskIsLarge = !1), Le && (v -= 1));
      let fe = e[ue];
      ((k.processedBytes += fe.sizeBytes), (g.processedBytes += fe.sizeBytes), (d[ue] = 2));
      let pn = { taskIndex: ue, file: fe, outcome: C.outcome };
      (a && l && (l[ue] = pn), (b += 1));
      try {
        (F(pn), i.onFileComplete?.());
      } catch (se) {
        W(se);
        return;
      }
      let D = r.largeFileBytes > 0 && fe.sizeBytes >= r.largeFileBytes,
        j = r.recycleBytes > 0 && k.processedBytes >= r.recycleBytes,
        J = D ? "large_file" : j ? "cumulative_bytes" : null;
      (J ? B(k, J).catch(W) : ((k.state = "idle"), y.push(k)), P(), b !== e.length && $e());
    },
    ee = (k) => {
      let C = p(t),
        ue = {
          worker: C,
          generation: h,
          state: "starting",
          processedBytes: 0,
          activeTaskIndex: null,
          activeTaskIsLarge: !1,
          terminationPromise: null,
        };
      return (
        (h += 1),
        u.add(ue),
        m.set(C, ue),
        C.on("message", (Le) => {
          ne(ue, Le);
        }),
        C.once("error", (Le) => {
          !T && !x && W(Le);
        }),
        C.once("exit", (Le) => {
          let fe = m.get(C);
          fe &&
            (fe.state === "retiring" ||
              fe.state === "closing" ||
              fe.state === "stopped" ||
              W(new Error(`YAML extract worker ${fe.generation} exited unexpectedly with code ${Le}`)));
        }),
        k ? (g.replacementWorkerCount += 1) : (g.initialWorkerCount += 1),
        (ue.state = "idle"),
        y.push(ue),
        ue
      );
    },
    Q,
    de,
    te = !1;
  try {
    for (let k = 0; k < s; k += 1)
      try {
        ee(!1);
      } catch (C) {
        W(C);
        break;
      }
    ($e(), (Q = await re));
  } catch (k) {
    ((te = !0), (de = k));
  }
  ((x = !0), (y.length = 0));
  let Ge = [...u];
  for (let k of Ge) k.state !== "retiring" && k.state !== "stopped" && (k.state = "closing");
  let rt = await Promise.allSettled(Ge.map(async (k) => Ee(k)));
  (u.clear(), m.clear());
  for (let k of Ge) k.state = "stopped";
  if ((OT(i.onPoolSummary, g), te)) throw de;
  let Me = rt.find((k) => k.status === "rejected");
  if (Me) throw Me.reason;
  return Q ?? [];
}
async function UT(e, t, n, i, r = !1, s = !0) {
  let o = s ? new Array(e.length) : void 0,
    a = new Map(),
    l = new Map(),
    c = 0,
    d = 0,
    u = !1,
    m,
    y = Math.min(t, e.length),
    p = async () => {
      if (!u) {
        u = !0;
        try {
          for (; a.has(d);) {
            let S = a.get(d);
            (a.delete(d), await i?.(S), l.get(d)?.resolve(), l.delete(d), (d += 1));
          }
        } catch (S) {
          m = S;
          for (let _ of l.values()) _.reject(S);
          l.clear();
        } finally {
          u = !1;
        }
      }
    },
    g = (S) => {
      if (m !== void 0) return Promise.reject(m);
      if (!r) return Promise.resolve(i?.(S));
      a.set(S.taskIndex, S);
      let _ = new Promise((E, b) => {
        l.set(S.taskIndex, { resolve: E, reject: b });
      });
      return (p(), _);
    };
  async function h() {
    for (;;) {
      let S = c;
      if (((c += 1), S >= e.length)) return;
      let _ = e[S],
        E = _.contentText === null ? await kh(_.absolutePath) : Gc(_.contentText),
        b = { taskIndex: S, file: _, outcome: E };
      (s && o && (o[S] = b), n?.(), await g(b));
    }
  }
  return (await Promise.all(Array.from({ length: y }, () => h())), o ?? []);
}
function Kc(e, t) {
  if (e === void 0 || !/^\d+$/.test(e)) return t;
  let n = Number(e);
  return Number.isSafeInteger(n) && n >= 0 ? n : t;
}
function AT(e, t) {
  let n = Kc(e, t);
  return n > 0 ? n : t;
}
function OT(e, t) {
  try {
    e?.({ ...t });
  } catch {}
}
function Ah() {
  let e = [
    Th(new URL("./yamlExtractWorker.js", import.meta.url)),
    Th(new URL("../../../bundle/yamlExtractWorker.js", import.meta.url)),
  ];
  for (let t of e) if (RT(t)) return t;
  return null;
}
async function Vc(e) {
  let t = FT(e.workItems),
    n = new Map(t.map((c) => [c.absolutePath, c])),
    i = e.dependencies?.extractYamlFiles ?? Uh,
    r = ir(e.database),
    s = [],
    o = ye(e.database, "yaml_objects"),
    a = ye(e.database, "yaml_references"),
    l = 0;
  e.stopwatch?.start("yaml_parallel_extract");
  try {
    await i(t, {
      concurrency: Yc(),
      deliverOutcomesInOrder: !0,
      retainResults: !1,
      onFileOutcome: ({ file: c, outcome: d }) => {
        let u = n.get(c.absolutePath);
        if (!u) throw new Error(`Unexpected YAML extraction outcome: ${c.absolutePath}`);
        if (d.observedHash !== u.contentHash)
          throw new Error(
            `YAML source changed while indexing: ${u.absolutePath} (expected ${u.contentHash}, observed ${d.observedHash ?? "unavailable"}).`,
          );
        if (d.kind !== "extracted") {
          let S =
            u.rawMode === "reuse_existing_raw" &&
            d.kind === "skipped_binary" &&
            e.database.prepare("SELECT 1 FROM yaml_objects WHERE file_id = ? LIMIT 1").get(u.id) === void 0;
          if (u.rawMode === "reuse_existing_raw" && !S)
            throw new Error(
              `Failed to reuse indexed YAML source ${u.absolutePath}: ${d.kind === "error" ? d.message : "not text YAML"}.`,
            );
          let _ = [],
            E = [];
          (pc(u, d, e.diagnostics, o, a, _, E), Fh(e, ++l, t.length));
          return;
        }
        s.push(d.phaseDurations);
        let m, y, p, g;
        if (u.rawMode === "refresh_raw") {
          let S = [],
            _ = [],
            E = pc(u, d, e.diagnostics, o, a, S, _);
          ((o = E.nextObjectId),
            (a = E.nextReferenceId),
            ku(e.database, S, _),
            (m = S.map(NT)),
            (y = _),
            ({ payloadByYamlObjectId: p, yamlMetadataById: g } = Oh(m, d.extracted.objects, u.absolutePath)));
        } else {
          let S = [
            ...r.iterateFileBatches({
              fileIds: [u.id],
              maxFilesPerBatch: 1,
              maxObjectsPerBatch: Number.MAX_SAFE_INTEGER,
            }),
          ][0] ?? { fileIds: [u.id], yamlObjectIds: [] };
          ((m = r.loadRowsForBatch(S)),
            (y = r.loadReferencesForBatch(S)),
            ({ payloadByYamlObjectId: p, yamlMetadataById: g } = Oh(m, d.extracted.objects, u.absolutePath)));
        }
        let h = bh({ rows: m, references: y, payloadByYamlObjectId: p, yamlMetadataById: g });
        try {
          u.semanticRole !== "none" && e.stream.consumeBatch(h, u.semanticRole);
        } finally {
          h.payloadReader.clear();
        }
        Fh(e, ++l, t.length);
      },
    });
  } finally {
    e.stopwatch?.stop("yaml_parallel_extract");
  }
  return (tp(e.stopwatch, s), e.stream.finalize());
}
function FT(e) {
  let t = new Map();
  for (let n of e) {
    let i = t.get(n.absolutePath);
    if (!i) {
      t.set(n.absolutePath, { ...n });
      continue;
    }
    ((i.rawMode = LT(i.rawMode, n.rawMode)), (i.semanticRole = DT(i.semanticRole, n.semanticRole)));
  }
  return [...t.values()].sort((n, i) => n.id - i.id || n.projectRelPath.localeCompare(i.projectRelPath));
}
function Oh(e, t, n) {
  let i = new Map();
  for (let l of e) {
    if (i.has(l.localIdentifier)) throw new Error(`Duplicate indexed YAML identifier ${l.localIdentifier} in ${n}.`);
    i.set(l.localIdentifier, l);
  }
  let r = new Set(),
    s = new Set(),
    o = new Map(),
    a = new Map();
  for (let l of t) {
    if (s.has(l.localIdentifier)) throw new Error(`Duplicate parsed YAML identifier ${l.localIdentifier} in ${n}.`);
    s.add(l.localIdentifier);
    let c = i.get(l.localIdentifier);
    if (!c) throw new Error(`Parsed YAML object ${l.localIdentifier} has no indexed row in ${n}.`);
    if (c.objectType !== l.objectType) throw new Error(`Parsed YAML object ${l.localIdentifier} changed type in ${n}.`);
    (r.add(c.id), o.set(c.id, l.payload), a.set(c.id, l.metadata));
  }
  for (let l of e)
    if (!r.has(l.id)) throw new Error(`Indexed YAML object ${l.localIdentifier} was not parsed from ${n}.`);
  return { payloadByYamlObjectId: o, yamlMetadataById: a };
}
function NT(e) {
  return {
    id: e.id,
    fileId: e.fileId,
    objectType: e.objectType,
    localIdentifier: e.localIdentifier,
    gameObjectFileId: e.gameObjectFileId,
    scriptGuid: e.scriptGuid,
    scriptFileId: e.scriptFileId,
    name: e.name,
    lineStart: e.lineStart,
    lineEnd: e.lineEnd,
  };
}
function LT(e, t) {
  return e === "refresh_raw" || t === "refresh_raw" ? "refresh_raw" : "reuse_existing_raw";
}
function DT(e, t) {
  let n = { none: 0, intent_only: 1, rebuild_entities: 2 };
  return n[e] >= n[t] ? e : t;
}
function Fh(e, t, n) {
  e.onProgress?.(t, n, `Parsing and resolving Unity assets (${t}/${n})`);
}
async function BT(e, t) {
  let { stopwatch: n } = t;
  n?.start("load_raw_rows");
  let i = Kt(e),
    r = oo(e),
    s = ao(e),
    o = lo(e);
  (n?.stop("load_raw_rows"), n?.start("resolve_symbols"));
  let a = await Xi({ files: i, assemblies: r, declarations: s, mentions: o }),
    l = a.symbols.length,
    c = a.bindings.length;
  (t.onProgress?.(l, l, `Resolved ${l} symbols`), n?.stop("resolve_symbols"));
  let d = Wc(i),
    u = await Ch(i);
  return (
    n?.start("write_resolved_rows"),
    xr(e),
    Zi(e, a.symbols, a.edges, a.bindings),
    t.onProgress?.(l, l, `Wrote ${l} symbol rows`),
    n?.stop("write_resolved_rows"),
    {
      files: i,
      fileAbsPathById: d,
      metaFileIdToNameByFileId: u,
      scriptSymbolByFileGuid: a.scriptSymbolByFileGuid,
      symbols: a.symbols,
      symbolCount: l,
      bindingCount: c,
    }
  );
}
async function io(e, t = {}) {
  let { stopwatch: n } = t,
    i = await BT(e, t);
  n?.start("build_asset_graph");
  let r = !1,
    s = Lc({
      database: e,
      files: i.files,
      fileAbsPathById: i.fileAbsPathById,
      metaFileIdToNameByFileId: i.metaFileIdToNameByFileId,
      scriptSymbolByFileGuid: i.scriptSymbolByFileGuid,
      symbols: i.symbols,
      diagnostics: t.diagnostics ?? [],
      batchOptions: t.yamlBatchOptions,
      stopwatch: n,
      onBeforeWriteRows: (c) => {
        (t.onProgress?.(c.assetCount, c.assetCount, `Resolved ${c.assetCount} assets`),
          t.onProgress?.(c.entityCount, c.entityCount, `Resolved ${c.entityCount} entities`),
          n?.stop("build_asset_graph"),
          n?.start("write_resolved_rows"),
          (r = !0));
      },
    }),
    o = new Set(t.refreshedYamlFileIds ?? []),
    a = await Vc({
      database: e,
      diagnostics: t.diagnostics ?? [],
      stream: s,
      stopwatch: n,
      onProgress: t.onProgress,
      dependencies: t.yamlIndexPassDependencies,
      workItems: i.files.flatMap((c) =>
        Qe(c.projectRelPath) === "unity-yaml"
          ? [
              jh(
                c,
                t.reuseExistingYamlRaw === !0 && !o.has(c.id) ? "reuse_existing_raw" : "refresh_raw",
                "rebuild_entities",
              ),
            ]
          : [],
      ),
    });
  return (
    r || (n?.stop("build_asset_graph"), n?.start("write_resolved_rows")),
    t.onProgress?.(a.entityCount, a.entityCount, `Wrote ${a.entityCount} entity rows`),
    n?.stop("write_resolved_rows"),
    {
      symbols: { symbolCount: i.symbolCount, bindingCount: i.bindingCount },
      assetCount: a.assetCount,
      entityCount: a.entityCount,
      entityEdgeCount: a.entityEdgeCount,
      pendingEdgeIntentCount: a.pendingEdgeIntentCount,
      peakPendingEdgeIntentCount: a.peakPendingEdgeIntentCount,
      peakPendingEdgeIntentBytes: a.peakPendingEdgeIntentBytes,
      peakLoadedYamlObjectRowCount: a.peakLoadedYamlObjectRowCount,
      peakBufferedEntityRowCount: a.peakBufferedEntityRowCount,
      peakBufferedEntityEdgeRowCount: a.peakBufferedEntityEdgeRowCount,
    }
  );
}
async function Nh(e, t, n = {}) {
  return { symbols: await $T(e, t, n), assetCount: Hc(e), entityCount: Jc(e), entityEdgeCount: Xc(e) };
}
async function qc(e, t = {}) {
  let n = Kt(e),
    i = oo(e),
    r = ao(e),
    s = lo(e),
    o = await Xi({ files: n, assemblies: i, declarations: r, mentions: s });
  return (
    t.onProgress?.(o.symbols.length, o.symbols.length, `Resolved ${o.symbols.length} symbols`),
    zo(e),
    Zi(e, o.symbols, o.edges, o.bindings),
    t.onProgress?.(o.symbols.length, o.symbols.length, `Wrote ${o.symbols.length} symbol rows`),
    {
      symbols: { symbolCount: o.symbols.length, bindingCount: o.bindings.length },
      assetCount: Hc(e),
      entityCount: Jc(e),
      entityEdgeCount: Xc(e),
    }
  );
}
async function Lh(e, t) {
  if (t.symbolsOnly) return qc(e, t);
  if (t.fullDerived) return (xr(e), io(e, { ...t, reuseExistingYamlRaw: !0 }));
  if (t.resolveFileIds.length === 0) return (xr(e), io(e, t));
  let n = Wn([...Xt(e, t.resolveFileIds), ...no(e, t.resolveFileIds)]),
    i = Wn([...n]),
    r = await GT(e, n, i, t),
    s = Rr(e, []).map(zc),
    o = Kt(e, t.resolveFileIds),
    a = Wc(o),
    l = await Ch(o);
  if (!iU(o))
    return { symbols: r, assetCount: Hc(e), entityCount: Jc(e), entityEdgeCount: Xc(e), materializeFileIds: ve(n) };
  let c = XT(e, t.resolveFileIds),
    d = qT(e),
    u = eU(e, t.resolveFileIds, d),
    m = Wc(
      Kt(
        e,
        c.map((v) => v.fileId),
      ),
    ),
    y = Wn([...t.resolveFileIds, ...QT(e, t.resolveFileIds)]);
  kr(e, t.resolveFileIds);
  let { stopwatch: p } = t;
  p?.start("build_asset_graph");
  let g = {
      database: e,
      files: o,
      fileAbsPathById: a,
      metaFileIdToNameByFileId: l,
      scriptSymbolByFileGuid: d,
      symbols: s,
      diagnostics: t.diagnostics ?? [],
      batchOptions: t.yamlBatchOptions,
      sourceFileIds: y,
      preservedAssets: c,
      preservedEntitySummaries: u,
      preservedFileAbsPathById: m,
      edgeSourceFileIds: y,
      completeEdgeSourceFileIds: t.resolveFileIds,
      edgeTargetFileIds: t.resolveFileIds,
      entitySymbolEdgeTargetFileIds: n,
      startAssetId: ye(e, "assets"),
      startEntityId: ye(e, "entities"),
      startEdgeId: ye(e, "entity_edges"),
      startEntitySymbolEdgeId: ye(e, "entity_symbol_edges"),
      stopwatch: p,
    },
    h = Lc(g),
    S = new Set(t.resolveFileIds),
    _ = new Set(t.refreshedYamlFileIds ?? []),
    E = Kt(e, Wn([...y, ...t.resolveFileIds, ..._])),
    b = await Vc({
      database: e,
      diagnostics: t.diagnostics ?? [],
      stream: h,
      stopwatch: p,
      onProgress: t.onProgress,
      dependencies: t.yamlIndexPassDependencies,
      workItems: E.flatMap((v) =>
        Qe(v.projectRelPath) !== "unity-yaml"
          ? []
          : [
              jh(
                v,
                _.has(v.id) ? "refresh_raw" : "reuse_existing_raw",
                S.has(v.id) ? "rebuild_entities" : y.includes(v.id) ? "intent_only" : "none",
              ),
            ],
      ),
    });
  p?.stop("build_asset_graph");
  let R = ve([...t.resolveFileIds]);
  return (
    t.onProgress?.(b.entityCount, b.entityCount, `Wrote scoped entity rows for ${o.length} files`),
    {
      symbols: r,
      assetCount: b.assetCount,
      entityCount: b.entityCount,
      entityEdgeCount: b.entityEdgeCount,
      pendingEdgeIntentCount: b.pendingEdgeIntentCount,
      peakPendingEdgeIntentCount: b.peakPendingEdgeIntentCount,
      peakPendingEdgeIntentBytes: b.peakPendingEdgeIntentBytes,
      peakLoadedYamlObjectRowCount: b.peakLoadedYamlObjectRowCount,
      peakBufferedEntityRowCount: b.peakBufferedEntityRowCount,
      peakBufferedEntityEdgeRowCount: b.peakBufferedEntityEdgeRowCount,
      materializeFileIds: R,
    }
  );
}
async function $T(e, t, n) {
  if (t.length === 0) return { symbolCount: ro(e), bindingCount: so(e) };
  let i = new Set(t),
    r = Dh(e),
    s = Wn([...t, ...r]),
    o = Kt(e, s),
    a = Rr(e, []).map(zc),
    l = await Xi({
      files: o,
      assemblies: oo(e),
      declarations: ao(e, t),
      mentions: lo(e, t),
      persistedSymbols: a,
      mentionFileIds: i,
    }),
    c = new Set(a.map((m) => m.id)),
    d = KT(l.bindings, c);
  (n.onProgress?.(d.length, d.length, `Resolved ${d.length} bindings`),
    fi(e, { symbolFileIds: [], bindingFileIds: t }));
  let u = $c(e, [], [], d);
  return (
    Zi(e, [], [], u.bindings),
    n.onProgress?.(u.bindings.length, u.bindings.length, `Wrote ${u.bindings.length} binding rows`),
    { symbolCount: ro(e), bindingCount: so(e) }
  );
}
async function GT(e, t, n, i) {
  if (t.length === 0) return { symbolCount: ro(e), bindingCount: so(e) };
  let r = new Set(t),
    s = new Set(n),
    o = Dh(e),
    a = Wn([...n, ...o]),
    l = Kt(e, a),
    c = Rr(e, t).map(zc),
    d = new Set(c.map((h) => h.id)),
    u = await Xi({
      files: l,
      assemblies: oo(e),
      declarations: ao(e, t),
      mentions: lo(e, n),
      persistedSymbols: c,
      mentionFileIds: s,
    }),
    m = u.edges.filter((h) => h.sourceFileId !== null && r.has(h.sourceFileId)),
    y = YT(u.symbols, m, u.bindings, r, d);
  (i.onProgress?.(y.length, y.length, `Resolved ${y.length} symbols`), fi(e, { symbolFileIds: t, bindingFileIds: n }));
  let p = WT(e, VT(y), m, u.bindings),
    g = $c(e, p.symbols, p.edges, p.bindings);
  return (
    Zi(e, g.symbols, g.edges, g.bindings),
    i.onProgress?.(g.symbols.length, g.symbols.length, `Wrote ${g.symbols.length} symbol rows`),
    i.onProgress?.(g.bindings.length, g.bindings.length, `Wrote ${g.bindings.length} binding rows`),
    { symbolCount: ro(e), bindingCount: so(e) }
  );
}
function KT(e, t) {
  return e
    .filter((n) => t.has(n.sourceSymbolId))
    .map((n) =>
      n.targetSymbolId !== null && !t.has(n.targetSymbolId)
        ? { ...n, targetSymbolId: null, resolutionStatus: "unresolved", confidence: 0 }
        : n,
    );
}
function YT(e, t, n, i, r) {
  let s = new Map(e.map((l) => [l.id, l])),
    o = new Set();
  for (let l of e) l.fileId !== null && i.has(l.fileId) && o.add(l.id);
  let a = (l) => {
    if (l === null || r.has(l)) return;
    s.get(l) && o.add(l);
  };
  for (let l of t) (a(l.fromSymbolId), a(l.toSymbolId));
  for (let l of n) (a(l.sourceSymbolId), a(l.targetSymbolId));
  return e.filter((l) => o.has(l.id)).sort((l, c) => l.id - c.id);
}
function VT(e) {
  let t = new Map();
  for (let n of e) {
    let i = `${n.assemblyId ?? "null"}\0${n.qualifiedName}`;
    t.has(i) || t.set(i, n);
  }
  return [...t.values()];
}
function WT(e, t, n, i) {
  let r = new Map(),
    s = [];
  for (let a of t) {
    let l =
      a.assemblyId === null
        ? e
            .prepare(
              `SELECT id
               FROM symbols
               WHERE qualified_name = ?
                 AND assembly_id IS NULL`,
            )
            .get(a.qualifiedName)
        : e
            .prepare(
              `SELECT id
               FROM symbols
               WHERE qualified_name = ?
                 AND assembly_id IS ?`,
            )
            .get(a.qualifiedName, a.assemblyId);
    if (l) {
      r.set(a.id, l.id);
      continue;
    }
    s.push(a);
  }
  let o = (a) => (a === null ? null : (r.get(a) ?? a));
  for (let a of s) a.containingSymbolId !== null && (a.containingSymbolId = o(a.containingSymbolId));
  return {
    symbols: s,
    edges: n.map((a) => ({
      ...a,
      fromSymbolId: o(a.fromSymbolId) ?? a.fromSymbolId,
      toSymbolId: o(a.toSymbolId) ?? a.toSymbolId,
    })),
    bindings: i.map((a) => ({
      ...a,
      sourceSymbolId: o(a.sourceSymbolId) ?? a.sourceSymbolId,
      targetSymbolId: o(a.targetSymbolId),
    })),
  };
}
function Wn(e) {
  return [...new Set(e)].sort((t, n) => t - n);
}
function Dh(e) {
  return e
    .prepare("SELECT id FROM files WHERE kind IN ('asmdef', 'asmref')")
    .all()
    .map((t) => t.id);
}
function zc(e) {
  return {
    id: e.id,
    projectId: e.projectId,
    assemblyId: e.assemblyId,
    fileId: e.fileId,
    declarationId: e.declarationId,
    symbolKind: e.symbolKind,
    simpleName: e.simpleName,
    qualifiedName: e.qualifiedName,
    displayName: e.displayName,
    signature: e.signature,
    containingSymbolId: e.containingSymbolId,
    baseSymbolName: e.baseSymbolName,
    isExternalStub: e.isExternalStub,
    visibility: e.visibility,
    skeletonContent: e.skeletonContent,
    lineStart: e.lineStart,
    lineEnd: e.lineEnd,
  };
}
function qT(e) {
  let t = zT(Kt(e).filter((i) => i.kind === "csharp" && i.guid)),
    n = HT(e);
  return up(t, n);
}
function zT(e) {
  return e.map((t) => {
    try {
      let n = Tn(CT(`${t.absPath}.meta`, "utf8"));
      if (n.guid) return { ...t, guid: n.guid };
    } catch {}
    return t;
  });
}
function HT(e) {
  return e
    .prepare(
      `SELECT id, project_id, assembly_id, file_id, declaration_id, symbol_kind,
              simple_name, qualified_name, display_name, signature,
              containing_symbol_id, base_symbol_name, is_external_stub,
              visibility, skeleton_content, line_start, line_end
       FROM symbols
       ORDER BY id`,
    )
    .all()
    .map((t) => {
      let n = t;
      return {
        id: n.id,
        projectId: n.project_id,
        assemblyId: n.assembly_id,
        fileId: n.file_id,
        declarationId: n.declaration_id,
        symbolKind: n.symbol_kind,
        simpleName: n.simple_name,
        qualifiedName: n.qualified_name,
        displayName: n.display_name,
        signature: n.signature,
        containingSymbolId: n.containing_symbol_id,
        baseSymbolName: n.base_symbol_name,
        isExternalStub: n.is_external_stub,
        visibility: n.visibility,
        skeletonContent: n.skeleton_content,
        lineStart: n.line_start,
        lineEnd: n.line_end,
      };
    });
}
function ro(e) {
  return e.prepare("SELECT COUNT(*) AS count FROM symbols").get().count;
}
function so(e) {
  return e.prepare("SELECT COUNT(*) AS count FROM semantic_bindings").get().count;
}
function Wc(e) {
  let t = new Map();
  for (let n of e) ri(n.projectRelPath, n.sizeBytes) && t.set(n.id, n.absPath);
  return t;
}
async function Ch(e) {
  let t = new Map();
  return (
    await JT(e, 16, async (n) => {
      let i = `${n.absPath}.meta`,
        r = await jT(i, "utf8").catch(() => null);
      if (!r) return;
      let s = ga(r);
      s.size > 0 && t.set(n.id, s);
    }),
    t
  );
}
async function JT(e, t, n) {
  let i = 0,
    r = Math.min(t, e.length);
  async function s() {
    for (;;) {
      let o = i;
      if (((i += 1), o >= e.length)) return;
      await n(e[o]);
    }
  }
  await Promise.all(Array.from({ length: r }, () => s()));
}
function Kt(e, t) {
  let n = `SELECT id, project_rel_path, abs_path, kind, guid, size_bytes,
                          content_hash
       FROM files`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ae(
            e,
            `${n}
             WHERE id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((r) => {
    let s = r;
    return {
      id: s.id,
      projectRelPath: s.project_rel_path,
      absPath: s.abs_path,
      kind: s.kind,
      guid: s.guid,
      sizeBytes: s.size_bytes,
      contentHash: s.content_hash,
    };
  });
}
function jh(e, t, n) {
  return {
    id: e.id,
    projectRelPath: e.projectRelPath,
    absolutePath: e.absPath,
    sizeBytes: e.sizeBytes,
    contentText: null,
    contentHash: e.contentHash,
    rawMode: t,
    semanticRole: n,
  };
}
function Bh(e) {
  return e
    .prepare(
      `SELECT id, project_id, file_id, asset_kind, guid, name, vfs_root_path
       FROM assets
       ORDER BY id`,
    )
    .all()
    .map((t) => {
      let n = t;
      return {
        id: n.id,
        projectId: n.project_id,
        fileId: n.file_id,
        assetKind: n.asset_kind,
        guid: n.guid,
        name: n.name,
        vfsRootPath: n.vfs_root_path,
      };
    });
}
function XT(e, t) {
  let n = new Set(t);
  return Bh(e).filter((i) => !n.has(i.fileId));
}
function QT(e, t) {
  if (t.length === 0) return [];
  let n = t.map(() => "?").join(", ");
  return e
    .prepare(
      `SELECT DISTINCT source_asset.file_id AS file_id
       FROM entity_edges edge
       JOIN entities source_entity ON source_entity.id = edge.from_entity_id
       JOIN assets source_asset ON source_asset.id = source_entity.asset_id
       JOIN entities target_entity ON target_entity.id = edge.to_entity_id
       JOIN assets target_asset ON target_asset.id = target_entity.asset_id
       WHERE target_asset.file_id IN (${n})
       ORDER BY source_asset.file_id`,
    )
    .all(...t)
    .map((r) => r.file_id);
}
function ZT(e) {
  return e
    .prepare(
      `SELECT id,
              asset_id,
              yaml_object_id,
              entity_kind,
              local_key,
              name,
              hierarchy_name,
              type_name,
              script_symbol_id,
              parent_entity_id,
              source_entity_id,
              line_start,
              line_end,
              generated_content
       FROM entities
       ORDER BY id`,
    )
    .all()
    .map((t) => {
      let n = t;
      return {
        id: n.id,
        assetId: n.asset_id,
        yamlObjectId: n.yaml_object_id,
        entityKind: n.entity_kind,
        localKey: n.local_key,
        name: n.name,
        hierarchyName: n.hierarchy_name,
        typeName: n.type_name,
        scriptSymbolId: n.script_symbol_id,
        parentEntityId: n.parent_entity_id,
        sourceEntityId: n.source_entity_id,
        lineStart: n.line_start,
        lineEnd: n.line_end,
        generatedContent: n.generated_content,
      };
    });
}
function eU(e, t, n) {
  let i = new Set(t),
    r = new Map(Bh(e).map((o) => [o.id, o.fileId])),
    s = tU(e, n);
  return ZT(e).flatMap((o) => {
    let a = r.get(o.assetId);
    return a === void 0 || i.has(a)
      ? []
      : [
          {
            entityId: o.id,
            assetId: o.assetId,
            fileId: a,
            yamlObjectId: o.yamlObjectId,
            localKey: o.localKey,
            entityKind: o.entityKind,
            name: o.name,
            typeName: o.typeName,
            scriptSymbolId: (o.yamlObjectId === null ? void 0 : s.get(o.yamlObjectId)) ?? o.scriptSymbolId,
            parentEntityId: o.parentEntityId,
          },
        ];
  });
}
function tU(e, t) {
  if (t.size === 0) return new Map();
  let n = e
      .prepare(
        `SELECT id, script_guid
       FROM yaml_objects
       WHERE script_guid IS NOT NULL
       ORDER BY id`,
      )
      .all(),
    i = new Map();
  for (let r of n) {
    let s = t.get(r.script_guid);
    s && i.set(r.id, s.id);
  }
  return i;
}
function oo(e) {
  return e
    .prepare(
      `SELECT id, name
       FROM assemblies
       ORDER BY id`,
    )
    .all()
    .map((t) => {
      let n = t;
      return { id: n.id, name: n.name };
    });
}
function ao(e, t) {
  let n = `SELECT id,
              file_id,
              decl_kind,
              simple_name,
              qualified_name_text,
              signature_text,
              skeleton_content,
              line_start,
              line_end
       FROM cs_declarations`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ae(
            e,
            `${n}
             WHERE file_id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((r) => {
    let s = r;
    return {
      id: s.id,
      fileId: s.file_id,
      declKind: s.decl_kind,
      simpleName: s.simple_name,
      qualifiedNameText: s.qualified_name_text,
      signatureText: s.signature_text,
      skeletonContent: s.skeleton_content,
      lineStart: s.line_start,
      lineEnd: s.line_end,
    };
  });
}
function lo(e, t) {
  let n = `SELECT id,
              file_id,
              mention_kind,
              text,
              receiver_text,
              argument_arity,
              containing_declaration_id
       FROM cs_mentions`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ae(
            e,
            `${n}
             WHERE file_id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((r) => {
    let s = r;
    return {
      id: s.id,
      fileId: s.file_id,
      mentionKind: s.mention_kind,
      text: s.text,
      receiverText: s.receiver_text,
      argumentArity: s.argument_arity,
      containingDeclarationId: s.containing_declaration_id,
    };
  });
}
var nU = new Set([
  "scene",
  "prefab",
  "yaml-asset",
  "asset",
  "shader",
  "anim",
  "controller",
  "overrideController",
  "mixer",
  "uxml",
  "uss",
  "sprite",
  "font",
  "audio",
  "video",
  "physics-material",
  "terrain",
  "navmesh",
  "lighting-settings",
  "render-texture",
  "material",
  "mesh",
  "texture",
  "project-settings",
]);
function iU(e) {
  return e.some((t) => nU.has(t.kind));
}
function Hc(e) {
  return e.prepare("SELECT COUNT(*) AS count FROM assets").get().count;
}
function Jc(e) {
  return e.prepare("SELECT COUNT(*) AS count FROM entities").get().count;
}
function Xc(e) {
  return e.prepare("SELECT COUNT(*) AS count FROM entity_edges").get().count;
}
import { mkdir as rU, writeFile as sU } from "node:fs/promises";
import Zc from "node:path";
function Gh(e) {
  return e?.syncLog === !0;
}
function oU() {
  return { write() {} };
}
function aU(e) {
  let t = new Map();
  for (let n of e) {
    let i = [n.phase, n.operation, n.table ?? "", n.sql].join("\0"),
      r = t.get(i);
    if (r) {
      ((r.statementCount += 1), (r.totalRows += n.rows));
      continue;
    }
    t.set(i, {
      phase: n.phase,
      operation: n.operation,
      table: n.table,
      sql: n.sql,
      statementCount: 1,
      totalRows: n.rows,
    });
  }
  return [...t.values()].sort(gU);
}
function lU(e) {
  let t = new Map();
  for (let n of e) {
    let i = [n.phase, n.operation, n.table ?? ""].join("\0"),
      r = t.get(i);
    if (r) {
      ((r.statementCount += 1), (r.totalRows += n.rows));
      continue;
    }
    t.set(i, { phase: n.phase, operation: n.operation, table: n.table, statementCount: 1, totalRows: n.rows });
  }
  return [...t.values()].sort(pU);
}
function cU(e = process.cwd()) {
  let t = new Date().toISOString().replace(/[:.]/g, "-");
  return Zc.join(e, "log", `sync-db-${t}.md`);
}
function dU(e, t) {
  let n = t.generatedAt ?? new Date().toISOString(),
    i = aU(e),
    r = lU(e),
    s = i.filter((c) => c.operation === "SELECT" && c.totalRows >= 100),
    o = i.filter((c) => c.operation !== "SELECT" && c.statementCount >= 2),
    a = i.filter(
      (c) => !(c.operation === "SELECT" && c.totalRows >= 100) && !(c.operation !== "SELECT" && c.statementCount >= 2),
    ),
    l = [
      "# Unity Insight Sync DB Log",
      "",
      `- Generated: ${n}`,
      `- Project: \`${t.projectPath}\``,
      `- Index: \`${t.publishedIndexPath}\``,
      `- Synced: ${t.synced ? "yes" : "no"}`,
    ];
  (t.reconcileSummary && l.push(`- Reconcile: ${t.reconcileSummary}`),
    t.resolveMode && l.push(`- Resolve mode: \`${t.resolveMode}\``),
    t.fanoutTruncated !== void 0 && l.push(`- Fanout truncated: ${t.fanoutTruncated ? "yes" : "no"}`),
    t.completedStages && t.completedStages.length > 0 && l.push(`- Completed stages: ${t.completedStages.join(", ")}`),
    l.push(
      "",
      "## Totals",
      "",
      `- SQL statements logged: ${e.length}`,
      `- Distinct SQL shapes: ${i.length}`,
      "",
      "## Summary by phase / operation / table",
      "",
      "| Phase | Operation | Table | Statements | Rows |",
      "| --- | --- | --- | ---: | ---: |",
    ));
  for (let c of r)
    l.push(`| ${$h(c.phase)} | ${c.operation} | ${$h(c.table ?? "")} | ${c.statementCount} | ${c.totalRows} |`);
  if (s.length > 0) {
    l.push("", "## Large reads (SELECT \u2265 100 rows)", "");
    for (let c of s)
      l.push(
        `### ${c.phase} \xB7 ${c.table ?? "unknown"}`,
        "",
        `- Rows returned: ${c.totalRows}`,
        `- Statements: ${c.statementCount}`,
        "",
        "```sql",
        Qc(c.sql),
        "```",
        "",
      );
  }
  if (o.length > 0) {
    l.push("", "## Repeated mutations", "");
    for (let c of o)
      l.push(
        `### ${c.phase} \xB7 ${c.operation} \xB7 ${c.table ?? "unknown"}`,
        "",
        `- Statements: ${c.statementCount}`,
        `- Rows affected: ${c.totalRows}`,
        "",
        "```sql",
        Qc(c.sql),
        "```",
        "",
      );
  }
  if (a.length > 0) {
    l.push("", "## Other statements", "");
    for (let c of a)
      l.push(
        `- **${c.phase}** \xB7 ${c.operation}${c.table ? ` \xB7 ${c.table}` : ""} \xB7 ${c.totalRows} row${c.totalRows === 1 ? "" : "s"}`,
        "",
        "```sql",
        Qc(c.sql),
        "```",
        "",
      );
  }
  return `${l
    .join(
      `
`,
    )
    .trimEnd()}
`;
}
async function uU(e, t, n) {
  let i = Zc.resolve(e);
  return (await rU(Zc.dirname(i), { recursive: !0 }), await sU(i, dU(t, n), "utf8"), i);
}
async function Kh(e) {
  if (!e.enabled || e.entries.length === 0) return;
  let t = e.outputPath?.trim() || cU();
  return uU(t, e.entries, e.metadata);
}
function Yh(e, t) {
  if (!t.enabled) return { database: e, setPhase: () => {}, getEntries: () => [] };
  let n = t.sink ?? oU(),
    i = [],
    r = t.initialPhase ?? "sync",
    s = (a) => {
      let l = { phase: r, ...a };
      (i.push(l), n.write(l));
    };
  return {
    database: new Proxy(e, {
      get(a, l, c) {
        if (l === "prepare") return (u) => fU(a.prepare(u), u, s);
        if (l === "exec") return (u) => mU(a, u, s);
        let d = Reflect.get(a, l, c);
        return typeof d == "function" ? d.bind(a) : d;
      },
    }),
    setPhase(a) {
      r = a;
    },
    getEntries: () => i,
  };
}
function fU(e, t, n) {
  let i = Vh(t);
  return Wh(i)
    ? e
    : new Proxy(e, {
        get(r, s, o) {
          if (s === "run")
            return (...l) => {
              let c = r.run(...l);
              return (
                (i.op === "insert" || i.op === "update" || i.op === "delete") &&
                  n({ operation: i.op.toUpperCase(), table: i.table, rows: c.changes, sql: t }),
                c
              );
            };
          if (s === "get")
            return (...l) => {
              let c = r.get(...l);
              return (
                i.op === "select" && n({ operation: "SELECT", table: i.table, rows: c === void 0 ? 0 : 1, sql: t }),
                c
              );
            };
          if (s === "all")
            return (...l) => {
              let c = r.all(...l);
              return (i.op === "select" && n({ operation: "SELECT", table: i.table, rows: c.length, sql: t }), c);
            };
          let a = Reflect.get(r, s, o);
          return typeof a == "function" ? a.bind(r) : a;
        },
      });
}
function mU(e, t, n) {
  let i = yU(t);
  for (let r of i) {
    let s = Vh(r);
    if (Wh(s)) {
      e.exec(r);
      continue;
    }
    if (s.op === "insert" || s.op === "update" || s.op === "delete") {
      let o = e.prepare(r).run();
      n({ operation: s.op.toUpperCase(), table: s.table, rows: o.changes, sql: r });
      continue;
    }
    (e.exec(r), s.op !== "other" && n({ operation: "EXEC", table: s.table, rows: 0, sql: r }));
  }
}
function Vh(e) {
  let t = e.trim().replace(/\s+/g, " "),
    n = t.toUpperCase();
  if (n.startsWith("PRAGMA ")) return { op: "other" };
  if (n === "BEGIN" || n === "COMMIT" || n === "ROLLBACK" || n.startsWith("SAVEPOINT ") || n.startsWith("RELEASE "))
    return { op: "other" };
  let i = /^INSERT\s+(?:OR\s+\w+\s+)?INTO\s+[`"[]?(\w+)/i.exec(t);
  if (i) return { op: "insert", table: i[1] };
  let r = /^UPDATE\s+[`"[]?(\w+)/i.exec(t);
  if (r) return { op: "update", table: r[1] };
  let s = /^DELETE\s+FROM\s+[`"[]?(\w+)/i.exec(t);
  return s
    ? { op: "delete", table: s[1] }
    : n.startsWith("SELECT")
      ? { op: "select", table: /\bFROM\s+[`"[]?(\w+)/i.exec(t)?.[1] }
      : { op: "other" };
}
function Wh(e) {
  return e.op === "other";
}
function yU(e) {
  return e
    .split(";")
    .map((t) => t.trim())
    .filter(Boolean);
}
function Qc(e) {
  return e.trim().replace(/\s+/g, " ");
}
function $h(e) {
  return e.replace(/\|/g, "\\|");
}
function gU(e, t) {
  return (
    e.phase.localeCompare(t.phase) ||
    e.operation.localeCompare(t.operation) ||
    (e.table ?? "").localeCompare(t.table ?? "") ||
    t.statementCount - e.statementCount
  );
}
function pU(e, t) {
  return (
    e.phase.localeCompare(t.phase) ||
    e.operation.localeCompare(t.operation) ||
    (e.table ?? "").localeCompare(t.table ?? "")
  );
}
var ed = { bootstrap: 2, discovery: 3, extract: 38, resolve: 22, materialize: 28, finalize: 4, publish: 3 },
  td = ["bootstrap", "discovery", "extract", "resolve", "materialize", "finalize", "publish"],
  hU = td.reduce((e, t) => e + (ed[t] ?? 0), 0),
  IU = {
    bootstrap: "Bootstrapping",
    discovery: "Discovering files",
    extract: "Extracting facts",
    resolve: "Resolving refs",
    materialize: "Materializing VFS",
    finalize: "Finalizing",
    publish: "Publishing",
  };
function bU(e) {
  return Math.min(1, Math.max(0, e));
}
function SU(e) {
  return e.total > 0 ? bU(e.current / e.total) : e.current > 0 ? 1 : 0;
}
function qh(e) {
  let t = td.indexOf(e.phase);
  if (t < 0) return 0;
  let n = 0;
  for (let o = 0; o < t; o += 1) {
    let a = td[o];
    n += ed[a] ?? 0;
  }
  let i = ed[e.phase] ?? 0,
    s = ((n + i * SU(e)) / hU) * 100;
  return Math.min(100, Math.max(0, Math.round(s)));
}
function zh(e) {
  let t = IU[e.phase] ?? e.phase;
  return e.status && e.status.trim() !== "" ? e.status.trim() : e.total > 0 ? `${t} (${e.current}/${e.total})` : t;
}
import { execFile as _U } from "node:child_process";
import { realpathSync as EU } from "node:fs";
import co from "node:path";
import { DatabaseSync as WC } from "node:sqlite";
import { promisify as RU } from "node:util";
var wU = 16,
  JC = Math.floor(wU / 2) + 1;
var XC = RU(_U);
var QC = [
  "& { param([string]$Target,[string]$ExpectedSid,[string]$TargetKind)",
  '$ErrorActionPreference = "Stop"',
  "function Test-OwnerOnlyAcl { param($Acl,[string]$Sid,$Inheritance)",
  "$ownerSid = $Acl.GetOwner([System.Security.Principal.SecurityIdentifier]).Value",
  "$rules = @($Acl.GetAccessRules($true, $true, [System.Security.Principal.SecurityIdentifier]))",
  "$valid = $Acl.AreAccessRulesProtected -and $ownerSid -eq $Sid -and $rules.Count -eq 1",
  "$valid = $valid -and $rules[0].IdentityReference.Value -eq $Sid",
  "$valid = $valid -and -not $rules[0].IsInherited",
  "$valid = $valid -and $rules[0].AccessControlType -eq [System.Security.AccessControl.AccessControlType]::Allow",
  "$valid = $valid -and $rules[0].FileSystemRights -eq [System.Security.AccessControl.FileSystemRights]::FullControl",
  "$valid = $valid -and $rules[0].InheritanceFlags -eq $Inheritance",
  "$valid = $valid -and $rules[0].PropagationFlags -eq [System.Security.AccessControl.PropagationFlags]::None",
  "return $valid",
  "}",
  "$sid = [System.Security.Principal.SecurityIdentifier]::new($ExpectedSid)",
  '$inheritance = if ($TargetKind -eq "directory") { [System.Security.AccessControl.InheritanceFlags]::ContainerInherit -bor [System.Security.AccessControl.InheritanceFlags]::ObjectInherit } else { [System.Security.AccessControl.InheritanceFlags]::None }',
  "$currentAcl = Get-Acl -LiteralPath $Target",
  "if (Test-OwnerOnlyAcl $currentAcl $ExpectedSid $inheritance) { return }",
  "$currentOwnerSid = $currentAcl.GetOwner([System.Security.Principal.SecurityIdentifier]).Value",
  '$acl = if ($TargetKind -eq "directory") { [System.Security.AccessControl.DirectorySecurity]::new() } else { [System.Security.AccessControl.FileSecurity]::new() }',
  "$acl.SetAccessRuleProtection($true, $false)",
  "if ($currentOwnerSid -ne $ExpectedSid) { $acl.SetOwner($sid) }",
  "$rule = [System.Security.AccessControl.FileSystemAccessRule]::new($sid, [System.Security.AccessControl.FileSystemRights]::FullControl, $inheritance, [System.Security.AccessControl.PropagationFlags]::None, [System.Security.AccessControl.AccessControlType]::Allow)",
  "$acl.AddAccessRule($rule)",
  "try { Set-Acl -LiteralPath $Target -AclObject $acl } catch { $racedAcl = Get-Acl -LiteralPath $Target; if (Test-OwnerOnlyAcl $racedAcl $ExpectedSid $inheritance) { return }; throw }",
  "$verifiedAcl = Get-Acl -LiteralPath $Target",
  'if (-not (Test-OwnerOnlyAcl $verifiedAcl $ExpectedSid $inheritance)) { throw "Owner-only ACL verification failed" }',
  "}",
].join("; ");
function PU(e) {
  try {
    return EU.native(e);
  } catch {
    return;
  }
}
function Jh(e) {
  let t = co.resolve(e),
    n = [],
    i = t;
  for (;;) {
    let r = PU(i);
    if (r !== void 0) return co.join(r, ...n);
    let s = co.dirname(i);
    if (s === i) return t;
    (n.unshift(co.basename(i)), (i = s));
  }
}
var nd = new Map();
function Xh(e) {
  return Jh(e);
}
function Qh(e, t) {
  let n = Xh(e),
    i = qh(t),
    r = nd.get(n),
    s = r !== void 0 ? Math.max(r.percent, i) : i;
  nd.set(n, {
    percent: s,
    phase: t.phase,
    detail: zh(t),
    current: t.current,
    total: t.total,
    updatedAt: new Date().toISOString(),
  });
}
function Zh(e) {
  nd.delete(Xh(e));
}
var uo = [];
var eI = {
  createdCount: 0,
  modifiedCount: 0,
  deletedCount: 0,
  movedCount: 0,
  unchangedCount: 0,
  createdPaths: uo,
  modifiedPaths: uo,
  deletedPaths: uo,
  movedPaths: uo,
};
function id(e) {
  let t = [{ severity: "info", category: "environment", message: e.message, code: e.reason }];
  return {
    projectPath: e.projectPath,
    publishedIndexPath: e.publishedIndexPath,
    mode: "incremental",
    schemaVersion: e.schemaVersion ?? 11,
    completedStages: [],
    diagnostics: t,
    summary: { discoveredFileCount: 0, diagnosticCount: t.length },
    reconcile: { ...eI },
    synced: !1,
    skipReason: e.reason,
  };
}
import cd from "node:crypto";
import * as nI from "node:https";
import { execFile as vU } from "node:child_process";
import { promises as fo } from "node:fs";
import Ve from "node:os";
import rr from "node:path";
import { promisify as xU } from "node:util";
function rd() {
  let e = process.env.UNITY_INSIGHT_VERSION?.trim();
  return e || "0.0.1";
}
function sd() {
  return "6e92ad2ce0a2918d63e1faeb5e76d6660fdf8143";
}
var od = new URL("https://api.gamecowork.invalid/api/metrics/events"),
  ad = 5e3,
  Rj = ad + 1e3,
  kU = 1e3 * 30,
  tI = 100,
  MU = "unity-metrics-distinct-id",
  TU = "gamecowork-unity-metrics-v1",
  UU = xU(vU),
  ld = class e {
    static instance = null;
    isShutdown = !1;
    events = [];
    flushTimer = null;
    flushPromise = null;
    baseFieldsPromise;
    static getInstance() {
      return ((!e.instance || e.instance.isShutdown) && (e.instance = new e()), e.instance);
    }
    static resetInstance() {
      (e.instance && e.instance.shutdown(), (e.instance = null));
    }
    enqueue(t, n = {}) {
      this.shouldSkipEmission() ||
        (this.events.length >= tI && this.events.shift(),
        this.events.push({
          eventName: t,
          eventTime: new Date(),
          uuid: cd.randomUUID(),
          status: n.status,
          durationMs: n.durationMs,
          error: n.error,
          extra: n.extra,
        }),
        this.scheduleFlush());
    }
    async flush() {
      if (this.shouldSkipEmission()) return;
      if (this.flushPromise) {
        (await this.flushPromise, this.events.length > 0 && (await this.flush()));
        return;
      }
      if (this.events.length === 0) return;
      this.flushPromise = this.runFlushLoop();
      let t = !1;
      try {
        t = await this.flushPromise;
      } finally {
        this.flushPromise = null;
      }
      !t && this.events.length > 0 && (await this.flush());
    }
    async runFlushLoop() {
      for (; this.events.length > 0 && !this.shouldSkipEmission();) {
        let t = this.events.splice(0, this.events.length),
          n = 0;
        try {
          let i = await this.buildPayloads(t);
          for (let r = 0; r < i.length; r++) (await this.sendRequest(i[r]), (n = r + 1));
        } catch (i) {
          return (
            this.restoreEvents(t.slice(n)),
            OU() &&
              console.debug(
                "[UnityInsightMetrics] Failed to flush events:",
                i instanceof Error ? i.message : String(i),
              ),
            this.events.length > 0 && this.scheduleFlush(),
            !0
          );
        }
      }
      return !1;
    }
    shutdown() {
      ((this.isShutdown = !0),
        this.flushTimer && (clearTimeout(this.flushTimer), (this.flushTimer = null)),
        (this.events.length = 0));
    }
    shouldSkipEmission() {
      let t = process.env.GAMECOWORK_UNITY_METRICS_NO_EMIT ?? process.env.GAMECOWORK_UNITY_METRICS_DISABLED;
      return t === "1" || t?.toLowerCase() === "true";
    }
    scheduleFlush() {
      this.flushTimer ||
        this.flushPromise ||
        ((this.flushTimer = setTimeout(() => {
          ((this.flushTimer = null), this.flush());
        }, kU)),
        this.flushTimer.unref?.());
    }
    restoreEvents(t) {
      let n = [...t, ...this.events].slice(-tI);
      ((this.events.length = 0), this.events.push(...n));
    }
    async buildPayloads(t) {
      let n = await this.getBaseFields(),
        i = rd(),
        r = sd();
      return t.map((s) => {
        let o = {
          type: "track",
          time: FU(s.eventTime),
          distinct_id: n.distinctId,
          event_name: s.eventName,
          uuid: s.uuid,
          source: "unity_insight_cli",
          platform: Ve.platform(),
          architecture: Ve.arch(),
          version: i,
          git_commit: r,
          client_type: "unity_insight",
          status: s.status,
          duration_ms: s.durationMs,
          ip: n.ip,
          ...n.machineInfo,
          ...DU(s.error),
          ...(s.extra ?? {}),
        };
        return (YU(o), JSON.stringify(o));
      });
    }
    getBaseFields() {
      return (this.baseFieldsPromise || (this.baseFieldsPromise = AU()), this.baseFieldsPromise);
    }
    async sendRequest(t) {
      let n = {
        hostname: od.hostname,
        path: `${od.pathname}${od.search}`,
        method: "POST",
        timeout: ad,
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(t) },
      };
      await new Promise((i, r) => {
        let s = nI.request(n, (o) => {
          (o.resume(),
            o.on("end", () => {
              o.statusCode && o.statusCode >= 200 && o.statusCode < 300
                ? i()
                : r(new Error(`HTTP ${o.statusCode ?? 0} ${o.statusMessage ?? ""}`));
            }));
        });
        (s.on("error", r),
          s.on("timeout", () => {
            (s.destroy(), r(new Error(`Request timeout after ${ad}ms`)));
          }),
          s.write(t),
          s.end());
      });
    }
  };
function iI(e, t = {}) {
  ld.getInstance().enqueue(e, t);
}
async function AU() {
  let e = await CU();
  return { distinctId: e, ip: LU(), machineInfo: NU(e) };
}
function OU() {
  let e = process.env.UNITY_INSIGHT_DEBUG_METRICS;
  return e === "1" || e?.toLowerCase() === "true";
}
function FU(e) {
  let t = (n, i = 2) => String(n).padStart(i, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())} ${t(e.getHours())}:${t(e.getMinutes())}:${t(e.getSeconds())}.${t(e.getMilliseconds(), 3)}`;
}
function NU(e) {
  return {
    machine_id: e,
    hostname: Ve.hostname(),
    os: Ve.platform(),
    os_type: Ve.type(),
    os_release: Ve.release(),
    arch: Ve.arch(),
    cpu_model: Ve.cpus()[0]?.model,
  };
}
function LU() {
  for (let e of Object.values(Ve.networkInterfaces()))
    for (let t of e ?? []) if (!t.internal && t.family === "IPv4" && t.address) return t.address;
}
function DU(e) {
  return e
    ? e instanceof Error
      ? { error_name: e.name, error_message: e.message }
      : { error_message: String(e) }
    : {};
}
async function CU() {
  let e = await BU();
  if (e) return KU(e);
  let t = jU();
  try {
    let i = (await fo.readFile(t, "utf8")).trim();
    if (i) return i;
  } catch {}
  let n = cd.randomUUID().replace(/-/g, "");
  return (await fo.mkdir(rr.dirname(t), { recursive: !0 }), await fo.writeFile(t, n, "utf8"), n);
}
function jU() {
  return rr.join(__gcuInsightHome(), "metrics", MU);
}
async function BU() {
  return process.platform === "darwin"
    ? await $U()
    : process.platform === "win32"
      ? process.env.COMPUTERNAME || Ve.hostname()
      : await GU();
}
async function $U() {
  try {
    let { stdout: e } = await UU("ioreg", ["-rd1", "-c", "IOPlatformExpertDevice"], { timeout: 1e3 });
    return e.toString().match(/"IOPlatformUUID"\s=\s"([^"]+)"/)?.[1];
  } catch {
    return;
  }
}
async function GU() {
  for (let e of ["/etc/machine-id", "/var/lib/dbus/machine-id"])
    try {
      let t = (await fo.readFile(e, "utf8")).trim();
      if (t) return t;
    } catch {}
}
function KU(e) {
  return cd.createHash("sha256").update(e.trim()).update(TU).digest("hex");
}
function YU(e) {
  for (let t of Object.keys(e)) e[t] === void 0 && delete e[t];
}
var VU = "unity_insight_index_sync";
function dd(e) {
  iI(VU, { status: WU(e), durationMs: e.durationMs, error: e.error, extra: qU(e.result) });
}
function WU(e) {
  return e.error ? "error" : e.result?.skipReason ? "skipped" : "completed";
}
function qU(e) {
  if (e)
    return {
      mode: e.mode,
      schema_version: e.schemaVersion,
      synced: e.synced,
      skip_reason: e.skipReason,
      resolve_mode: e.resolveMode,
      fanout_truncated: e.fanoutTruncated,
      discovered_file_count: e.summary.discoveredFileCount,
      diagnostic_count: e.summary.diagnosticCount,
      sync_file_count: e.reconcile.createdCount + e.reconcile.modifiedCount + e.reconcile.movedCount,
      reconcile_created: e.reconcile.createdCount,
      reconcile_modified: e.reconcile.modifiedCount,
      reconcile_deleted: e.reconcile.deletedCount,
      reconcile_moved: e.reconcile.movedCount,
      completed_stages: e.completedStages.join(","),
    };
}
function HU(e) {
  return e
    .prepare(
      `SELECT severity, category, code, stage, file_path, message
         FROM index_diagnostics
         WHERE project_id = 1
         ORDER BY id`,
    )
    .all()
    .map((t) => ({
      severity: t.severity,
      category: t.category,
      message: t.message,
      ...(t.code ? { code: t.code } : {}),
      ...(t.stage ? { stage: t.stage } : {}),
      ...(t.file_path ? { filePath: t.file_path } : {}),
    }));
}
function mo(e, t, n, i) {
  let r = new Set([
      ...n.flatMap((a) => a.projectRelPaths.flatMap((l) => (l.endsWith(".meta") ? [l, l.slice(0, -5)] : [l]))),
      ...i,
    ]),
    s = (a) => [a.severity, a.category, a.stage ?? "", a.code ?? "", a.filePath ?? "", a.message].join("\0"),
    o = new Set(e.map(s));
  for (let a of t) {
    if (a.filePath && r.has(a.filePath)) continue;
    let l = s(a);
    o.has(l) || (o.add(l), e.push(a));
  }
}
function JU(e, t) {
  let n = new Map();
  for (let i of t)
    (n.set(i.oldProjectRelPath, i.discovered.projectRelPath),
      i.oldMetaProjectRelPath && i.metaDiscovered && n.set(i.oldMetaProjectRelPath, i.metaDiscovered.projectRelPath));
  return e.map((i) => {
    let r = i.filePath ? n.get(i.filePath) : void 0;
    return r ? { ...i, filePath: r } : i;
  });
}
async function sI(e, t = {}) {
  let n = Date.now(),
    i = rI.resolve(e.projectPath),
    r = !1;
  try {
    return await XU(e, t, () => {
      r = !0;
    });
  } catch (s) {
    throw (dd({ durationMs: Date.now() - n, error: s }), s);
  } finally {
    r && Zh(i);
  }
}
async function XU(e, t = {}, n) {
  let i = Date.now(),
    r = (v) => (dd({ durationMs: Date.now() - i, result: v }), v),
    s = t.resolveIndexPaths ?? fr,
    o = t.onProgress ?? e.onProgress,
    a,
    l = rI.resolve(e.projectPath),
    c = (v) => {
      (a?.setPhase(v.phase), Qh(l, v), n?.(), o?.(v));
    },
    d = e.syncMode ?? "partial",
    u = e.schemaVersion ?? 11;
  if (u !== 11) throw new Error(`Unsupported Unity Insight schema version ${u}. Expected ${11}.`);
  await tu(l);
  let m = s(l),
    y = Yo(m) ?? m.liveDbPath;
  if (zU(m.tempDbPath))
    return r(
      id({
        projectPath: l,
        publishedIndexPath: y,
        schemaVersion: u,
        reason: "build_in_progress",
        message: `Unity Insight index build is in progress for ${l}.`,
      }),
    );
  let p;
  try {
    p = await Bo(m, "sync");
  } catch (v) {
    if (jo(v))
      return r(
        id({ projectPath: l, publishedIndexPath: y, schemaVersion: u, reason: "lock_unavailable", message: v.message }),
      );
    throw v instanceof gt
      ? v
      : new gt(`Failed to acquire Unity Insight index write lock at ${m.indexWriteLockDbPath}.`, {
          cause: v,
          code: "failed",
        });
  }
  let g = [],
    h = [],
    S = { discoveredFileCount: 0, diagnosticCount: 0 },
    _ = d,
    E = !1,
    b,
    R = Gh(e);
  try {
    y = Ko(m);
    let v = br(y),
      T;
    try {
      T = Oo(v);
    } finally {
      v.close();
    }
    if (T !== u)
      throw new Error(
        `Cannot sync Unity Insight schema version ${T}. Rebuild the index with 'unity-insight-cli index build'.`,
      );
    ((b = nu(y)),
      R && ((a = Yh(b, { enabled: !0, sink: t.syncLogSink, initialPhase: "reconcile" })), (b = a.database)),
      pr(b));
    let x = HU(b);
    c({ phase: "reconcile", current: 0, total: 1 });
    let $ = await sp(l, b, { includePackages: e.includePackages }),
      z = await lp(b, $),
      Y = op(z);
    if (
      (c({
        phase: "reconcile",
        current: 1,
        total: 1,
        status: `Reconcile: +${Y.createdCount} ~${Y.modifiedCount} -${Y.deletedCount} \u21C4${Y.movedCount}`,
      }),
      z.metadataStale.length > 0 &&
        Pu(
          b,
          z.metadataStale.map((D) => ({
            fileId: D.fileId,
            absolutePath: D.absolutePath,
            mtimeMs: D.mtimeMs,
            sizeBytes: D.sizeBytes,
          })),
        ),
      !(z.created.length > 0 || z.modified.length > 0 || z.deleted.length > 0 || (z.moved?.length ?? 0) > 0))
    ) {
      let D = b.prepare("SELECT COUNT(*) AS count FROM files").get();
      return (
        (S.discoveredFileCount = D.count),
        mo(g, x, [], []),
        (S.diagnosticCount = g.length),
        In(b),
        b.close(),
        (b = void 0),
        await _n(p),
        r({
          projectPath: l,
          publishedIndexPath: y,
          mode: "incremental",
          schemaVersion: u,
          completedStages: h,
          diagnostics: g,
          summary: S,
          reconcile: Y,
          synced: !1,
          resolveMode: _,
          fanoutTruncated: E,
        })
      );
    }
    c({ phase: "sync", current: 0, total: 1, status: "Planning scopes" });
    let G = z.moved ?? [],
      re = G.filter((D) => !D.contentChanged),
      W = [],
      ce = [],
      Ee = !1;
    if (G.length > 0) {
      ({ fastPathMoves: W, slowPathMoves: ce } = Kd(G, { allowFastPath: d !== "full_derived" }));
      let D = W.filter((j) => j.discovered.kind === "prefab");
      ((W = W.filter((j) => j.discovered.kind !== "prefab")),
        (ce = [...ce, ...D.map((j) => ({ ...j, contentChanged: !0 }))]));
      for (let j of G) {
        let J = await yn(j.discovered.absolutePath);
        if (
          (Xo(b, {
            fileId: j.fileId,
            projectRelPath: j.discovered.projectRelPath,
            absolutePath: j.discovered.absolutePath,
            sizeBytes: j.discovered.sizeBytes,
            mtimeMs: j.discovered.mtimeMs,
            contentHash: J,
          }),
          j.metaFileId !== void 0 && j.metaDiscovered)
        ) {
          let se = await yn(j.metaDiscovered.absolutePath);
          Xo(b, {
            fileId: j.metaFileId,
            projectRelPath: j.metaDiscovered.projectRelPath,
            absolutePath: j.metaDiscovered.absolutePath,
            sizeBytes: j.metaDiscovered.sizeBytes,
            mtimeMs: j.metaDiscovered.mtimeMs,
            contentHash: se,
          });
        }
        j.contentChanged && vr(b, [j.fileId]);
      }
      if (W.length > 0) {
        c({ phase: "vfs_rewrite", current: 0, total: W.length, status: "Rewriting moved VFS paths" });
        try {
          (Yd(b, W.map(Gd)), (Ee = !0), c({ phase: "vfs_rewrite", current: W.length, total: W.length }));
        } catch (j) {
          if (j instanceof Sn) ((ce = [...ce, ...W]), (W = []));
          else throw j;
        }
      }
      (ce.length > 0 && Mr(b, cp(ce)), (x = JU(x, re)));
    }
    let le = { ...z, moved: ce };
    if (!(le.created.length > 0 || le.modified.length > 0 || le.deleted.length > 0 || ce.length > 0) && Ee) {
      let D = b.prepare("SELECT COUNT(*) AS count FROM files").get();
      ((S.discoveredFileCount = D.count),
        mo(g, x, [], []),
        (S.diagnosticCount = g.length),
        (_ = "move_rewrite"),
        (E = !1));
      let j = new Date().toISOString();
      return (
        Ur(b),
        Lo(b, g, j),
        No(b, {
          indexedAt: j,
          mode: "incremental",
          discoveredFileCount: S.discoveredFileCount,
          diagnosticCount: S.diagnosticCount,
          completedStages: ["vfs_rewrite", "finalize"],
        }),
        h.push("vfs_rewrite", "finalize"),
        c({ phase: "finalize", current: 1, total: 1 }),
        In(b),
        b.close(),
        (b = void 0),
        await _n(p),
        r({
          projectPath: l,
          publishedIndexPath: y,
          mode: "incremental",
          schemaVersion: u,
          completedStages: [...h],
          diagnostics: g,
          summary: S,
          reconcile: Y,
          synced: !0,
          resolveMode: _,
          fanoutTruncated: E,
        })
      );
    }
    let Oe = await Ii(l, { includePackages: e.includePackages });
    c({ phase: "sync", current: 1, total: 2, status: `Discovered ${Oe.files.length} project files` });
    let it = Ws(b),
      $e = new Map(it.map((D) => [D.projectRelPath, D.id])),
      P = new Map(
        b
          .prepare("SELECT id, guid FROM files")
          .all()
          .map((D) => {
            let j = D;
            return [j.id, j.guid];
          }),
      ),
      A = bu(le, Oe.files, { pathFilter: e.paths, indexedPathToId: $e, indexedGuidByFileId: P }),
      F = A.csharpSymbolOnlyChanges && d !== "full_derived",
      B = A.assetSelfOnlyChanges && d !== "full_derived",
      ne = Bc(b, A, Oe.files, { csharpSymbolOnly: F, assetSelfOnly: B });
    E = ne.fanoutTruncated;
    let ee = ne.scriptPatchGuids;
    c({
      phase: "sync",
      current: 2,
      total: 2,
      status: `Planned ${ne.resolveFileIds.length} resolve files (${ne.scopes.length} scopes)`,
    });
    let Q = d === "full_derived" || E || A.requiresFullDerivedRebuild;
    Q && (_ = "full_derived");
    let de = rp(le),
      te = A.deletedFileIds.length > 0 ? Xt(b, A.deletedFileIds) : [];
    (A.deletedFileIds.length > 0 &&
      Eu(
        b,
        le.deleted.filter((D) => A.deletedFileIds.includes(D.fileId)),
        $e,
      ),
      te.length > 0 && fi(b, { symbolFileIds: te, bindingFileIds: te }),
      _u(b, A.deletedFileIds),
      vr(b, A.refreshFileIds),
      A.rebuildAllAssemblies && Ru(b),
      Q ? (Ur(b), Tr(b)) : Jo(b, ne.purgeScopes),
      c({
        phase: "extract",
        current: 0,
        total: A.extractDiscovered.length,
        status: "Preparing changed files and non-YAML facts",
      }));
    let Ge = await np(b, l, A.extractDiscovered, g, {
      onProgress: (D, j, J) => {
        c({ phase: "extract", current: D, total: j, status: J });
      },
    });
    if ((h.push("discovery", "extract"), A.rebuildAllAssemblies)) {
      let D = await ep(Oe.files);
      Qo(b, Po(D, g));
    }
    ((S.discoveredFileCount = Oe.files.length), (S.diagnosticCount = g.length));
    let rt = new Map(Ws(b).map((D) => [D.projectRelPath, D.id])),
      Me = ne.resolveFileIds,
      k = ne.purgeScopes;
    if (!Q) {
      let D = qo(ne.scopes, rt),
        j = Su(A, rt),
        J = { ...A, scopes: D, resolveFileIds: j, materializeScopes: qo(A.materializeScopes, rt) },
        se = Bc(b, J, Oe.files, { csharpSymbolOnly: F, assetSelfOnly: B });
      se.fanoutTruncated
        ? ((E = !0), (Q = !0), (_ = "full_derived"), Tr(b))
        : (Jo(b, se.purgeScopes), (k = se.purgeScopes), (Me = se.resolveFileIds), (ee = se.scriptPatchGuids));
    }
    let C = !Q && de && Me.length === 0,
      ue = !Q && A.rebuildProjectSymbolGraph && !de;
    !Q && Me.length === 0 && !de && ((Q = !0), (_ = "full_derived"), Tr(b));
    let Le = new Set(
      re.flatMap((D) => [D.discovered.projectRelPath, ...(D.metaDiscovered ? [D.metaDiscovered.projectRelPath] : [])]),
    );
    if (
      (mo(
        g,
        x.filter((D) => D.filePath !== void 0 && Le.has(D.filePath)),
        [],
        [],
      ),
      Q ||
        mo(g, x, k, [
          ...le.deleted.map((D) => D.projectRelPath),
          ...ce.flatMap((D) => [D.oldProjectRelPath, ...(D.oldMetaProjectRelPath ? [D.oldMetaProjectRelPath] : [])]),
        ]),
      Q)
    )
      (await io(b, {
        diagnostics: g,
        refreshedYamlFileIds: Ge.refreshedYamlFileIds,
        reuseExistingYamlRaw: !0,
        yamlIndexPassDependencies: t.yamlIndexPassDependencies,
        onProgress: (D, j, J) => {
          c({ phase: "resolve", current: D, total: j, status: J });
        },
      }),
        await Of(b, {
          diagnostics: g,
          onProgress: (D, j, J) => {
            c({ phase: "materialize", current: D, total: j, status: J });
          },
        }),
        h.push("resolve", "materialize"));
    else if (ue) {
      (a?.setPhase("resolve"),
        await qc(b, {
          diagnostics: g,
          onProgress: (j, J, se) => {
            c({ phase: "resolve", current: j, total: J, status: se });
          },
        }),
        h.push("resolve"));
      let D = Pr(ne.materializeScopes);
      D.length > 0 &&
        (await Ea(b, D, {
          diagnostics: g,
          onProgress: (j, J, se) => {
            c({ phase: "materialize", current: j, total: J, status: se });
          },
        }),
        h.push("materialize"));
    } else if (C)
      (a?.setPhase("resolve"),
        await Nh(b, [], {
          diagnostics: g,
          onProgress: (D, j, J) => {
            c({ phase: "resolve", current: D, total: j, status: J });
          },
        }),
        h.push("resolve"));
    else {
      a?.setPhase("resolve");
      let D = await Lh(b, {
          resolveFileIds: Me,
          diagnostics: g,
          refreshedYamlFileIds: Ge.refreshedYamlFileIds,
          yamlIndexPassDependencies: t.yamlIndexPassDependencies,
          onProgress: (J, se, Yt) => {
            c({ phase: "resolve", current: J, total: se, status: Yt });
          },
        }),
        j = [...new Set([...Me, ...(D.materializeFileIds ?? [])])];
      (await Ea(b, j, {
        diagnostics: g,
        onProgress: (J, se, Yt) => {
          c({ phase: "materialize", current: J, total: se, status: Yt });
        },
      }),
        ee.length > 0 && pu(b, ee),
        h.push("resolve", "materialize"));
    }
    S.diagnosticCount = g.length;
    let fe = new Date().toISOString();
    (a?.setPhase("finalize"),
      Ur(b),
      Lo(b, g, fe),
      No(b, {
        indexedAt: fe,
        mode: "incremental",
        discoveredFileCount: S.discoveredFileCount,
        diagnosticCount: S.diagnosticCount,
        completedStages: [...h, "finalize"],
      }),
      h.push("finalize"),
      c({ phase: "finalize", current: 1, total: 1 }));
    let pn = await Kh({
      enabled: R,
      entries: a?.getEntries() ?? [],
      outputPath: e.syncLogPath,
      metadata: {
        projectPath: l,
        publishedIndexPath: y,
        synced: !0,
        resolveMode: _,
        fanoutTruncated: E,
        reconcileSummary: `+${Y.createdCount} ~${Y.modifiedCount} -${Y.deletedCount}`,
        completedStages: [...h],
      },
    });
    return (
      In(b),
      b.close(),
      (b = void 0),
      await _n(p),
      r({
        projectPath: l,
        publishedIndexPath: y,
        mode: "incremental",
        schemaVersion: u,
        completedStages: [...h],
        diagnostics: g,
        summary: S,
        reconcile: Y,
        synced: !0,
        resolveMode: _,
        fanoutTruncated: E,
        syncLogPath: pn,
      })
    );
  } catch (v) {
    let T = [];
    if (b && ni(b))
      try {
        ko(b);
      } catch (x) {
        T.push(x);
      }
    try {
      b?.close();
    } catch (x) {
      T.push(x);
    }
    try {
      await _n(p);
    } catch (x) {
      T.push(x);
    }
    throw T.length > 0
      ? new AggregateError([v, ...T], "Unity Insight sync failed and cleanup was incomplete.", { cause: v })
      : v;
  }
}
import { format as fd } from "node:util";
import { BroadcastChannel as QU, threadId as ZU } from "node:worker_threads";
var eA = { DEBUG: 10, INFO: 20, WARN: 30, ERROR: 40, OFF: 50 },
  sB = 10080 * 60 * 1e3;
var tA = "unity-insight-process-log",
  ud = { debug: "DEBUG", log: "INFO", info: "INFO", warn: "WARN", error: "ERROR", trace: "ERROR" };
function nA(e) {
  let t = e?.trim();
  if (!t) return { level: "INFO" };
  let n = t.toUpperCase();
  return n in eA ? { level: n } : { level: "INFO", invalidValue: t };
}
function oI() {
  if (nA(process.env.UNITY_INSIGHT_LOG_LEVEL).level === "OFF") return () => {};
  let e;
  try {
    ((e = new QU(tA)), e.unref());
  } catch {
    return () => {};
  }
  let t = console,
    n = new Map(),
    i = !0;
  return (
    rA(t, n, (r, s) => {
      if (i)
        try {
          e.postMessage({ timestamp: Date.now(), threadId: ZU, level: r, message: s });
        } catch {
          ((i = !1), e.close());
        }
    }),
    () => {
      for (let [r, s] of n) t[r] = s;
      i && e.close();
    }
  );
}
function iA(e) {
  let t = fd(...e);
  return (new Error(t).stack ?? `Trace: ${t}`).replace(/^Error(?=:)/, "Trace");
}
function rA(e, t, n) {
  for (let i of Object.keys(ud)) t.set(i, e[i]);
  for (let i of Object.keys(ud)) {
    let r = t.get(i);
    if (i === "trace") {
      let s = t.get("error");
      e.trace = (...o) => {
        let a = e.error,
          l;
        e.error = (...c) => {
          ((l = sA(fd(...c))), s.apply(console, [l]));
        };
        try {
          r.apply(console, o);
        } finally {
          e.error = a;
        }
        n("ERROR", l ?? iA(o));
      };
      continue;
    }
    e[i] = (...s) => {
      (r.apply(console, s), n(ud[i], fd(...s)));
    };
  }
}
function sA(e) {
  let t = e.includes(`\r
`)
      ? `\r
`
      : `
`,
    n = e.split(t);
  return (n.length > 1 && n.splice(1, 1), n.join(t));
}
oI();
function md(e) {
  aI?.postMessage(e);
}
function oA(e) {
  return e instanceof Error ? { name: e.name, message: e.message } : { name: "Error", message: String(e) };
}
aI?.on("message", (e) => {
  e.type === "sync" && aA(e);
});
async function aA(e) {
  try {
    let t = await sI({
      projectPath: e.projectPath,
      paths: e.paths,
      schemaVersion: e.schemaVersion,
      includePackages: e.includePackages,
      syncMode: e.syncMode,
      syncLog: e.syncLog,
      syncLogPath: e.syncLogPath,
      onProgress: (n) => {
        md({ type: "progress", id: e.id, progress: n });
      },
    });
    md({ type: "result", id: e.id, ok: !0, value: t });
  } catch (t) {
    md({ type: "result", id: e.id, ok: !1, error: oA(t) });
  }
}
