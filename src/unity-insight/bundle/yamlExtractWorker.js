import { createRequire as __unityInsightCreateRequire } from "node:module";
import { fileURLToPath as __unityInsightFileURLToPath } from "node:url";
import { dirname as __unityInsightDirname } from "node:path";
const __filename = __unityInsightFileURLToPath(import.meta.url);
const __dirname = __unityInsightDirname(__filename);
const require = __unityInsightCreateRequire(import.meta.url);
var Fa = Object.create;
var Ds = Object.defineProperty;
var Ba = Object.getOwnPropertyDescriptor;
var Ka = Object.getOwnPropertyNames;
var xa = Object.getPrototypeOf,
  Va = Object.prototype.hasOwnProperty;
var Xe = ((n) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
      ? new Proxy(n, { get: (e, t) => (typeof require < "u" ? require : e)[t] })
      : n)(function (n) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + n + '" is not supported');
});
var y = (n, e) => () => (e || n((e = { exports: {} }).exports, e), e.exports);
var Ga = (n, e, t, s) => {
  if ((e && typeof e == "object") || typeof e == "function")
    for (let i of Ka(e))
      !Va.call(n, i) && i !== t && Ds(n, i, { get: () => e[i], enumerable: !(s = Ba(e, i)) || s.enumerable });
  return n;
};
var Ja = (n, e, t) => (
  (t = n != null ? Fa(xa(n)) : {}),
  Ga(e || !n || !n.__esModule ? Ds(t, "default", { value: n, enumerable: !0 }) : t, n)
);
var L = y((C) => {
  "use strict";
  var Xt = Symbol.for("yaml.alias"),
    Us = Symbol.for("yaml.document"),
    Ze = Symbol.for("yaml.map"),
    Rs = Symbol.for("yaml.pair"),
    Zt = Symbol.for("yaml.scalar"),
    et = Symbol.for("yaml.seq"),
    K = Symbol.for("yaml.node.type"),
    Wa = (n) => !!n && typeof n == "object" && n[K] === Xt,
    Ha = (n) => !!n && typeof n == "object" && n[K] === Us,
    Qa = (n) => !!n && typeof n == "object" && n[K] === Ze,
    za = (n) => !!n && typeof n == "object" && n[K] === Rs,
    Ys = (n) => !!n && typeof n == "object" && n[K] === Zt,
    Xa = (n) => !!n && typeof n == "object" && n[K] === et;
  function Fs(n) {
    if (n && typeof n == "object")
      switch (n[K]) {
        case Ze:
        case et:
          return !0;
      }
    return !1;
  }
  function Za(n) {
    if (n && typeof n == "object")
      switch (n[K]) {
        case Xt:
        case Ze:
        case Zt:
        case et:
          return !0;
      }
    return !1;
  }
  var eo = (n) => (Ys(n) || Fs(n)) && !!n.anchor;
  C.ALIAS = Xt;
  C.DOC = Us;
  C.MAP = Ze;
  C.NODE_TYPE = K;
  C.PAIR = Rs;
  C.SCALAR = Zt;
  C.SEQ = et;
  C.hasAnchor = eo;
  C.isAlias = Wa;
  C.isCollection = Fs;
  C.isDocument = Ha;
  C.isMap = Qa;
  C.isNode = Za;
  C.isPair = za;
  C.isScalar = Ys;
  C.isSeq = Xa;
});
var ve = y((en) => {
  "use strict";
  var M = L(),
    P = Symbol("break visit"),
    Bs = Symbol("skip children"),
    Y = Symbol("remove node");
  function tt(n, e) {
    let t = Ks(e);
    M.isDocument(n)
      ? ce(null, n.contents, t, Object.freeze([n])) === Y && (n.contents = null)
      : ce(null, n, t, Object.freeze([]));
  }
  tt.BREAK = P;
  tt.SKIP = Bs;
  tt.REMOVE = Y;
  function ce(n, e, t, s) {
    let i = xs(n, e, t, s);
    if (M.isNode(i) || M.isPair(i)) return (Vs(n, s, i), ce(n, i, t, s));
    if (typeof i != "symbol") {
      if (M.isCollection(e)) {
        s = Object.freeze(s.concat(e));
        for (let r = 0; r < e.items.length; ++r) {
          let a = ce(r, e.items[r], t, s);
          if (typeof a == "number") r = a - 1;
          else {
            if (a === P) return P;
            a === Y && (e.items.splice(r, 1), (r -= 1));
          }
        }
      } else if (M.isPair(e)) {
        s = Object.freeze(s.concat(e));
        let r = ce("key", e.key, t, s);
        if (r === P) return P;
        r === Y && (e.key = null);
        let a = ce("value", e.value, t, s);
        if (a === P) return P;
        a === Y && (e.value = null);
      }
    }
    return i;
  }
  async function nt(n, e) {
    let t = Ks(e);
    M.isDocument(n)
      ? (await ue(null, n.contents, t, Object.freeze([n]))) === Y && (n.contents = null)
      : await ue(null, n, t, Object.freeze([]));
  }
  nt.BREAK = P;
  nt.SKIP = Bs;
  nt.REMOVE = Y;
  async function ue(n, e, t, s) {
    let i = await xs(n, e, t, s);
    if (M.isNode(i) || M.isPair(i)) return (Vs(n, s, i), ue(n, i, t, s));
    if (typeof i != "symbol") {
      if (M.isCollection(e)) {
        s = Object.freeze(s.concat(e));
        for (let r = 0; r < e.items.length; ++r) {
          let a = await ue(r, e.items[r], t, s);
          if (typeof a == "number") r = a - 1;
          else {
            if (a === P) return P;
            a === Y && (e.items.splice(r, 1), (r -= 1));
          }
        }
      } else if (M.isPair(e)) {
        s = Object.freeze(s.concat(e));
        let r = await ue("key", e.key, t, s);
        if (r === P) return P;
        r === Y && (e.key = null);
        let a = await ue("value", e.value, t, s);
        if (a === P) return P;
        a === Y && (e.value = null);
      }
    }
    return i;
  }
  function Ks(n) {
    return typeof n == "object" && (n.Collection || n.Node || n.Value)
      ? Object.assign(
          { Alias: n.Node, Map: n.Node, Scalar: n.Node, Seq: n.Node },
          n.Value && { Map: n.Value, Scalar: n.Value, Seq: n.Value },
          n.Collection && { Map: n.Collection, Seq: n.Collection },
          n,
        )
      : n;
  }
  function xs(n, e, t, s) {
    if (typeof t == "function") return t(n, e, s);
    if (M.isMap(e)) return t.Map?.(n, e, s);
    if (M.isSeq(e)) return t.Seq?.(n, e, s);
    if (M.isPair(e)) return t.Pair?.(n, e, s);
    if (M.isScalar(e)) return t.Scalar?.(n, e, s);
    if (M.isAlias(e)) return t.Alias?.(n, e, s);
  }
  function Vs(n, e, t) {
    let s = e[e.length - 1];
    if (M.isCollection(s)) s.items[n] = t;
    else if (M.isPair(s)) n === "key" ? (s.key = t) : (s.value = t);
    else if (M.isDocument(s)) s.contents = t;
    else {
      let i = M.isAlias(s) ? "alias" : "scalar";
      throw new Error(`Cannot replace node with ${i} parent`);
    }
  }
  en.visit = tt;
  en.visitAsync = nt;
});
var tn = y((Js) => {
  "use strict";
  var Gs = L(),
    to = ve(),
    no = { "!": "%21", ",": "%2C", "[": "%5B", "]": "%5D", "{": "%7B", "}": "%7D" },
    so = (n) => n.replace(/[!,[\]{}]/g, (e) => no[e]),
    Ie = class n {
      constructor(e, t) {
        ((this.docStart = null),
          (this.docEnd = !1),
          (this.yaml = Object.assign({}, n.defaultYaml, e)),
          (this.tags = Object.assign({}, n.defaultTags, t)));
      }
      clone() {
        let e = new n(this.yaml, this.tags);
        return ((e.docStart = this.docStart), e);
      }
      atDocument() {
        let e = new n(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = !0;
            break;
          case "1.2":
            ((this.atNextDocument = !1),
              (this.yaml = { explicit: n.defaultYaml.explicit, version: "1.2" }),
              (this.tags = Object.assign({}, n.defaultTags)));
            break;
        }
        return e;
      }
      add(e, t) {
        this.atNextDocument &&
          ((this.yaml = { explicit: n.defaultYaml.explicit, version: "1.1" }),
          (this.tags = Object.assign({}, n.defaultTags)),
          (this.atNextDocument = !1));
        let s = e.trim().split(/[ \t]+/),
          i = s.shift();
        switch (i) {
          case "%TAG": {
            if (s.length !== 2 && (t(0, "%TAG directive should contain exactly two parts"), s.length < 2)) return !1;
            let [r, a] = s;
            return ((this.tags[r] = a), !0);
          }
          case "%YAML": {
            if (((this.yaml.explicit = !0), s.length !== 1))
              return (t(0, "%YAML directive should contain exactly one part"), !1);
            let [r] = s;
            if (r === "1.1" || r === "1.2") return ((this.yaml.version = r), !0);
            {
              let a = /^\d+\.\d+$/.test(r);
              return (t(6, `Unsupported YAML version ${r}`, a), !1);
            }
          }
          default:
            return (t(0, `Unknown directive ${i}`, !0), !1);
        }
      }
      tagName(e, t) {
        if (e === "!") return "!";
        if (e[0] !== "!") return (t(`Not a valid tag: ${e}`), null);
        if (e[1] === "<") {
          let a = e.slice(2, -1);
          return a === "!" || a === "!!"
            ? (t(`Verbatim tags aren't resolved, so ${e} is invalid.`), null)
            : (e[e.length - 1] !== ">" && t("Verbatim tags must end with a >"), a);
        }
        let [, s, i] = e.match(/^(.*!)([^!]*)$/s);
        i || t(`The ${e} tag has no suffix`);
        let r = this.tags[s];
        if (r)
          try {
            return r + decodeURIComponent(i);
          } catch (a) {
            return (t(String(a)), null);
          }
        return s === "!" ? e : (t(`Could not resolve tag: ${e}`), null);
      }
      tagString(e) {
        for (let [t, s] of Object.entries(this.tags)) if (e.startsWith(s)) return t + so(e.substring(s.length));
        return e[0] === "!" ? e : `!<${e}>`;
      }
      toString(e) {
        let t = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [],
          s = Object.entries(this.tags),
          i;
        if (e && s.length > 0 && Gs.isNode(e.contents)) {
          let r = {};
          (to.visit(e.contents, (a, o) => {
            Gs.isNode(o) && o.tag && (r[o.tag] = !0);
          }),
            (i = Object.keys(r)));
        } else i = [];
        for (let [r, a] of s)
          (r === "!!" && a === "tag:yaml.org,2002:") ||
            ((!e || i.some((o) => o.startsWith(a))) && t.push(`%TAG ${r} ${a}`));
        return t.join(`
`);
      }
    };
  Ie.defaultYaml = { explicit: !1, version: "1.2" };
  Ie.defaultTags = { "!!": "tag:yaml.org,2002:" };
  Js.Directives = Ie;
});
var st = y((ke) => {
  "use strict";
  var Ws = L(),
    io = ve();
  function ro(n) {
    if (/[\x00-\x19\s,[\]{}]/.test(n)) {
      let t = `Anchor must not contain whitespace or control characters: ${JSON.stringify(n)}`;
      throw new Error(t);
    }
    return !0;
  }
  function Hs(n) {
    let e = new Set();
    return (
      io.visit(n, {
        Value(t, s) {
          s.anchor && e.add(s.anchor);
        },
      }),
      e
    );
  }
  function Qs(n, e) {
    for (let t = 1; ; ++t) {
      let s = `${n}${t}`;
      if (!e.has(s)) return s;
    }
  }
  function ao(n, e) {
    let t = [],
      s = new Map(),
      i = null;
    return {
      onAnchor: (r) => {
        (t.push(r), i ?? (i = Hs(n)));
        let a = Qs(e, i);
        return (i.add(a), a);
      },
      setAnchors: () => {
        for (let r of t) {
          let a = s.get(r);
          if (typeof a == "object" && a.anchor && (Ws.isScalar(a.node) || Ws.isCollection(a.node)))
            a.node.anchor = a.anchor;
          else {
            let o = new Error("Failed to resolve repeated object (this should not happen)");
            throw ((o.source = r), o);
          }
        }
      },
      sourceObjects: s,
    };
  }
  ke.anchorIsValid = ro;
  ke.anchorNames = Hs;
  ke.createNodeAnchors = ao;
  ke.findNewAnchor = Qs;
});
var nn = y((zs) => {
  "use strict";
  function Ne(n, e, t, s) {
    if (s && typeof s == "object")
      if (Array.isArray(s))
        for (let i = 0, r = s.length; i < r; ++i) {
          let a = s[i],
            o = Ne(n, s, String(i), a);
          o === void 0 ? delete s[i] : o !== a && (s[i] = o);
        }
      else if (s instanceof Map)
        for (let i of Array.from(s.keys())) {
          let r = s.get(i),
            a = Ne(n, s, i, r);
          a === void 0 ? s.delete(i) : a !== r && s.set(i, a);
        }
      else if (s instanceof Set)
        for (let i of Array.from(s)) {
          let r = Ne(n, s, i, i);
          r === void 0 ? s.delete(i) : r !== i && (s.delete(i), s.add(r));
        }
      else
        for (let [i, r] of Object.entries(s)) {
          let a = Ne(n, s, i, r);
          a === void 0 ? delete s[i] : a !== r && (s[i] = a);
        }
    return n.call(e, t, s);
  }
  zs.applyReviver = Ne;
});
var G = y((Zs) => {
  "use strict";
  var oo = L();
  function Xs(n, e, t) {
    if (Array.isArray(n)) return n.map((s, i) => Xs(s, String(i), t));
    if (n && typeof n.toJSON == "function") {
      if (!t || !oo.hasAnchor(n)) return n.toJSON(e, t);
      let s = { aliasCount: 0, count: 1, res: void 0 };
      (t.anchors.set(n, s),
        (t.onCreate = (r) => {
          ((s.res = r), delete t.onCreate);
        }));
      let i = n.toJSON(e, t);
      return (t.onCreate && t.onCreate(i), i);
    }
    return typeof n == "bigint" && !t?.keep ? Number(n) : n;
  }
  Zs.toJS = Xs;
});
var it = y((ti) => {
  "use strict";
  var lo = nn(),
    ei = L(),
    co = G(),
    sn = class {
      constructor(e) {
        Object.defineProperty(this, ei.NODE_TYPE, { value: e });
      }
      clone() {
        let e = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        return (this.range && (e.range = this.range.slice()), e);
      }
      toJS(e, { mapAsMap: t, maxAliasCount: s, onAnchor: i, reviver: r } = {}) {
        if (!ei.isDocument(e)) throw new TypeError("A document argument is required");
        let a = {
            anchors: new Map(),
            doc: e,
            keep: !0,
            mapAsMap: t === !0,
            mapKeyWarned: !1,
            maxAliasCount: typeof s == "number" ? s : 100,
          },
          o = co.toJS(this, "", a);
        if (typeof i == "function") for (let { count: l, res: c } of a.anchors.values()) i(c, l);
        return typeof r == "function" ? lo.applyReviver(r, { "": o }, "", o) : o;
      }
    };
  ti.NodeBase = sn;
});
var Le = y((ni) => {
  "use strict";
  var uo = st(),
    fo = ve(),
    fe = L(),
    ho = it(),
    mo = G(),
    rn = class extends ho.NodeBase {
      constructor(e) {
        (super(fe.ALIAS),
          (this.source = e),
          Object.defineProperty(this, "tag", {
            set() {
              throw new Error("Alias nodes cannot have tags");
            },
          }));
      }
      resolve(e, t) {
        if (t?.maxAliasCount === 0) throw new ReferenceError("Alias resolution is disabled");
        let s;
        t?.aliasResolveCache
          ? (s = t.aliasResolveCache)
          : ((s = []),
            fo.visit(e, {
              Node: (r, a) => {
                (fe.isAlias(a) || fe.hasAnchor(a)) && s.push(a);
              },
            }),
            t && (t.aliasResolveCache = s));
        let i;
        for (let r of s) {
          if (r === this) break;
          r.anchor === this.source && (i = r);
        }
        return i;
      }
      toJSON(e, t) {
        if (!t) return { source: this.source };
        let { anchors: s, doc: i, maxAliasCount: r } = t,
          a = this.resolve(i, t);
        if (!a) {
          let l = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(l);
        }
        let o = s.get(a);
        if ((o || (mo.toJS(a, null, t), (o = s.get(a))), o?.res === void 0)) {
          let l = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(l);
        }
        if (
          r >= 0 &&
          ((o.count += 1), o.aliasCount === 0 && (o.aliasCount = rt(i, a, s)), o.count * o.aliasCount > r)
        ) {
          let l = "Excessive alias count indicates a resource exhaustion attack";
          throw new ReferenceError(l);
        }
        return o.res;
      }
      toString(e, t, s) {
        let i = `*${this.source}`;
        if (e) {
          if ((uo.anchorIsValid(this.source), e.options.verifyAliasOrder && !e.anchors.has(this.source))) {
            let r = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(r);
          }
          if (e.implicitKey) return `${i} `;
        }
        return i;
      }
    };
  function rt(n, e, t) {
    if (fe.isAlias(e)) {
      let s = e.resolve(n),
        i = t && s && t.get(s);
      return i ? i.count * i.aliasCount : 0;
    } else if (fe.isCollection(e)) {
      let s = 0;
      for (let i of e.items) {
        let r = rt(n, i, t);
        r > s && (s = r);
      }
      return s;
    } else if (fe.isPair(e)) {
      let s = rt(n, e.key, t),
        i = rt(n, e.value, t);
      return Math.max(s, i);
    }
    return 1;
  }
  ni.Alias = rn;
});
var q = y((an) => {
  "use strict";
  var po = L(),
    go = it(),
    yo = G(),
    bo = (n) => !n || (typeof n != "function" && typeof n != "object"),
    J = class extends go.NodeBase {
      constructor(e) {
        (super(po.SCALAR), (this.value = e));
      }
      toJSON(e, t) {
        return t?.keep ? this.value : yo.toJS(this.value, e, t);
      }
      toString() {
        return String(this.value);
      }
    };
  J.BLOCK_FOLDED = "BLOCK_FOLDED";
  J.BLOCK_LITERAL = "BLOCK_LITERAL";
  J.PLAIN = "PLAIN";
  J.QUOTE_DOUBLE = "QUOTE_DOUBLE";
  J.QUOTE_SINGLE = "QUOTE_SINGLE";
  an.Scalar = J;
  an.isScalarValue = bo;
});
var Oe = y((ii) => {
  "use strict";
  var wo = Le(),
    ne = L(),
    si = q(),
    So = "tag:yaml.org,2002:";
  function vo(n, e, t) {
    if (e) {
      let s = t.filter((r) => r.tag === e),
        i = s.find((r) => !r.format) ?? s[0];
      if (!i) throw new Error(`Tag ${e} not found`);
      return i;
    }
    return t.find((s) => s.identify?.(n) && !s.format);
  }
  function Io(n, e, t) {
    if ((ne.isDocument(n) && (n = n.contents), ne.isNode(n))) return n;
    if (ne.isPair(n)) {
      let u = t.schema[ne.MAP].createNode?.(t.schema, null, t);
      return (u.items.push(n), u);
    }
    (n instanceof String ||
      n instanceof Number ||
      n instanceof Boolean ||
      (typeof BigInt < "u" && n instanceof BigInt)) &&
      (n = n.valueOf());
    let { aliasDuplicateObjects: s, onAnchor: i, onTagObj: r, schema: a, sourceObjects: o } = t,
      l;
    if (s && n && typeof n == "object") {
      if (((l = o.get(n)), l)) return (l.anchor ?? (l.anchor = i(n)), new wo.Alias(l.anchor));
      ((l = { anchor: null, node: null }), o.set(n, l));
    }
    e?.startsWith("!!") && (e = So + e.slice(2));
    let c = vo(n, e, a.tags);
    if (!c) {
      if ((n && typeof n.toJSON == "function" && (n = n.toJSON()), !n || typeof n != "object")) {
        let u = new si.Scalar(n);
        return (l && (l.node = u), u);
      }
      c = n instanceof Map ? a[ne.MAP] : Symbol.iterator in Object(n) ? a[ne.SEQ] : a[ne.MAP];
    }
    r && (r(c), delete t.onTagObj);
    let h = c?.createNode
      ? c.createNode(t.schema, n, t)
      : typeof c?.nodeClass?.from == "function"
        ? c.nodeClass.from(t.schema, n, t)
        : new si.Scalar(n);
    return (e ? (h.tag = e) : c.default || (h.tag = c.tag), l && (l.node = h), h);
  }
  ii.createNode = Io;
});
var ot = y((at) => {
  "use strict";
  var ko = Oe(),
    F = L(),
    No = it();
  function on(n, e, t) {
    let s = t;
    for (let i = e.length - 1; i >= 0; --i) {
      let r = e[i];
      if (typeof r == "number" && Number.isInteger(r) && r >= 0) {
        let a = [];
        ((a[r] = s), (s = a));
      } else s = new Map([[r, s]]);
    }
    return ko.createNode(s, void 0, {
      aliasDuplicateObjects: !1,
      keepUndefined: !1,
      onAnchor: () => {
        throw new Error("This should not happen, please report a bug.");
      },
      schema: n,
      sourceObjects: new Map(),
    });
  }
  var ri = (n) => n == null || (typeof n == "object" && !!n[Symbol.iterator]().next().done),
    ln = class extends No.NodeBase {
      constructor(e, t) {
        (super(e), Object.defineProperty(this, "schema", { value: t, configurable: !0, enumerable: !1, writable: !0 }));
      }
      clone(e) {
        let t = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        return (
          e && (t.schema = e),
          (t.items = t.items.map((s) => (F.isNode(s) || F.isPair(s) ? s.clone(e) : s))),
          this.range && (t.range = this.range.slice()),
          t
        );
      }
      addIn(e, t) {
        if (ri(e)) this.add(t);
        else {
          let [s, ...i] = e,
            r = this.get(s, !0);
          if (F.isCollection(r)) r.addIn(i, t);
          else if (r === void 0 && this.schema) this.set(s, on(this.schema, i, t));
          else throw new Error(`Expected YAML collection at ${s}. Remaining path: ${i}`);
        }
      }
      deleteIn(e) {
        let [t, ...s] = e;
        if (s.length === 0) return this.delete(t);
        let i = this.get(t, !0);
        if (F.isCollection(i)) return i.deleteIn(s);
        throw new Error(`Expected YAML collection at ${t}. Remaining path: ${s}`);
      }
      getIn(e, t) {
        let [s, ...i] = e,
          r = this.get(s, !0);
        return i.length === 0 ? (!t && F.isScalar(r) ? r.value : r) : F.isCollection(r) ? r.getIn(i, t) : void 0;
      }
      hasAllNullValues(e) {
        return this.items.every((t) => {
          if (!F.isPair(t)) return !1;
          let s = t.value;
          return s == null || (e && F.isScalar(s) && s.value == null && !s.commentBefore && !s.comment && !s.tag);
        });
      }
      hasIn(e) {
        let [t, ...s] = e;
        if (s.length === 0) return this.has(t);
        let i = this.get(t, !0);
        return F.isCollection(i) ? i.hasIn(s) : !1;
      }
      setIn(e, t) {
        let [s, ...i] = e;
        if (i.length === 0) this.set(s, t);
        else {
          let r = this.get(s, !0);
          if (F.isCollection(r)) r.setIn(i, t);
          else if (r === void 0 && this.schema) this.set(s, on(this.schema, i, t));
          else throw new Error(`Expected YAML collection at ${s}. Remaining path: ${i}`);
        }
      }
    };
  at.Collection = ln;
  at.collectionFromPath = on;
  at.isEmptyPath = ri;
});
var Ae = y((lt) => {
  "use strict";
  var Lo = (n) => n.replace(/^(?!$)(?: $)?/gm, "#");
  function cn(n, e) {
    return /^\n+$/.test(n) ? n.substring(1) : e ? n.replace(/^(?! *$)/gm, e) : n;
  }
  var Oo = (n, e, t) =>
    n.endsWith(`
`)
      ? cn(t, e)
      : t.includes(`
`)
        ? `
` + cn(t, e)
        : (n.endsWith(" ") ? "" : " ") + t;
  lt.indentComment = cn;
  lt.lineComment = Oo;
  lt.stringifyComment = Lo;
});
var oi = y((Te) => {
  "use strict";
  var Ao = "flow",
    un = "block",
    ct = "quoted";
  function To(
    n,
    e,
    t = "flow",
    { indentAtStart: s, lineWidth: i = 80, minContentWidth: r = 20, onFold: a, onOverflow: o } = {},
  ) {
    if (!i || i < 0) return n;
    i < r && (r = 0);
    let l = Math.max(1 + r, 1 + i - e.length);
    if (n.length <= l) return n;
    let c = [],
      h = {},
      u = i - e.length;
    typeof s == "number" && (s > i - Math.max(2, r) ? c.push(0) : (u = i - s));
    let f,
      p,
      g = !1,
      d = -1,
      m = -1,
      w = -1;
    t === un && ((d = ai(n, d, e.length)), d !== -1 && (u = d + l));
    for (let v; (v = n[(d += 1)]);) {
      if (t === ct && v === "\\") {
        switch (((m = d), n[d + 1])) {
          case "x":
            d += 3;
            break;
          case "u":
            d += 5;
            break;
          case "U":
            d += 9;
            break;
          default:
            d += 1;
        }
        w = d;
      }
      if (
        v ===
        `
`
      )
        (t === un && (d = ai(n, d, e.length)), (u = d + e.length + l), (f = void 0));
      else {
        if (
          v === " " &&
          p &&
          p !== " " &&
          p !==
            `
` &&
          p !== "	"
        ) {
          let N = n[d + 1];
          N &&
            N !== " " &&
            N !==
              `
` &&
            N !== "	" &&
            (f = d);
        }
        if (d >= u)
          if (f) (c.push(f), (u = f + l), (f = void 0));
          else if (t === ct) {
            for (; p === " " || p === "	";) ((p = v), (v = n[(d += 1)]), (g = !0));
            let N = d > w + 1 ? d - 2 : m - 1;
            if (h[N]) return n;
            (c.push(N), (h[N] = !0), (u = N + l), (f = void 0));
          } else g = !0;
      }
      p = v;
    }
    if ((g && o && o(), c.length === 0)) return n;
    a && a();
    let S = n.slice(0, c[0]);
    for (let v = 0; v < c.length; ++v) {
      let N = c[v],
        k = c[v + 1] || n.length;
      N === 0
        ? (S = `
${e}${n.slice(0, k)}`)
        : (t === ct && h[N] && (S += `${n[N]}\\`),
          (S += `
${e}${n.slice(N + 1, k)}`));
    }
    return S;
  }
  function ai(n, e, t) {
    let s = e,
      i = e + 1,
      r = n[i];
    for (; r === " " || r === "	";)
      if (e < i + t) r = n[++e];
      else {
        do r = n[++e];
        while (
          r &&
          r !==
            `
`
        );
        ((s = e), (i = e + 1), (r = n[i]));
      }
    return s;
  }
  Te.FOLD_BLOCK = un;
  Te.FOLD_FLOW = Ao;
  Te.FOLD_QUOTED = ct;
  Te.foldFlowLines = To;
});
var qe = y((li) => {
  "use strict";
  var U = q(),
    W = oi(),
    ft = (n, e) => ({
      indentAtStart: e ? n.indent.length : n.indentAtStart,
      lineWidth: n.options.lineWidth,
      minContentWidth: n.options.minContentWidth,
    }),
    dt = (n) => /^(%|---|\.\.\.)/m.test(n);
  function Eo(n, e, t) {
    if (!e || e < 0) return !1;
    let s = e - t,
      i = n.length;
    if (i <= s) return !1;
    for (let r = 0, a = 0; r < i; ++r)
      if (
        n[r] ===
        `
`
      ) {
        if (r - a > s) return !0;
        if (((a = r + 1), i - a <= s)) return !1;
      }
    return !0;
  }
  function Ee(n, e) {
    let t = JSON.stringify(n);
    if (e.options.doubleQuotedAsJSON) return t;
    let { implicitKey: s } = e,
      i = e.options.doubleQuotedMinMultiLineLength,
      r = e.indent || (dt(n) ? "  " : ""),
      a = "",
      o = 0;
    for (let l = 0, c = t[l]; c; c = t[++l])
      if (
        (c === " " &&
          t[l + 1] === "\\" &&
          t[l + 2] === "n" &&
          ((a += t.slice(o, l) + "\\ "), (l += 1), (o = l), (c = "\\")),
        c === "\\")
      )
        switch (t[l + 1]) {
          case "u":
            {
              a += t.slice(o, l);
              let h = t.substr(l + 2, 4);
              switch (h) {
                case "0000":
                  a += "\\0";
                  break;
                case "0007":
                  a += "\\a";
                  break;
                case "000b":
                  a += "\\v";
                  break;
                case "001b":
                  a += "\\e";
                  break;
                case "0085":
                  a += "\\N";
                  break;
                case "00a0":
                  a += "\\_";
                  break;
                case "2028":
                  a += "\\L";
                  break;
                case "2029":
                  a += "\\P";
                  break;
                default:
                  h.substr(0, 2) === "00" ? (a += "\\x" + h.substr(2)) : (a += t.substr(l, 6));
              }
              ((l += 5), (o = l + 1));
            }
            break;
          case "n":
            if (s || t[l + 2] === '"' || t.length < i) l += 1;
            else {
              for (
                a +=
                  t.slice(o, l) +
                  `

`;
                t[l + 2] === "\\" && t[l + 3] === "n" && t[l + 4] !== '"';
              )
                ((a += `
`),
                  (l += 2));
              ((a += r), t[l + 2] === " " && (a += "\\"), (l += 1), (o = l + 1));
            }
            break;
          default:
            l += 1;
        }
    return ((a = o ? a + t.slice(o) : t), s ? a : W.foldFlowLines(a, r, W.FOLD_QUOTED, ft(e, !1)));
  }
  function fn(n, e) {
    if (
      e.options.singleQuote === !1 ||
      (e.implicitKey &&
        n.includes(`
`)) ||
      /[ \t]\n|\n[ \t]/.test(n)
    )
      return Ee(n, e);
    let t = e.indent || (dt(n) ? "  " : ""),
      s =
        "'" +
        n.replace(/'/g, "''").replace(
          /\n+/g,
          `$&
${t}`,
        ) +
        "'";
    return e.implicitKey ? s : W.foldFlowLines(s, t, W.FOLD_FLOW, ft(e, !1));
  }
  function de(n, e) {
    let { singleQuote: t } = e.options,
      s;
    if (t === !1) s = Ee;
    else {
      let i = n.includes('"'),
        r = n.includes("'");
      i && !r ? (s = fn) : r && !i ? (s = Ee) : (s = t ? fn : Ee);
    }
    return s(n, e);
  }
  var dn;
  try {
    dn = new RegExp(
      `(^|(?<!
))
+(?!
|$)`,
      "g",
    );
  } catch {
    dn = /\n+(?!\n|$)/g;
  }
  function ut({ comment: n, type: e, value: t }, s, i, r) {
    let { blockQuote: a, commentString: o, lineWidth: l } = s.options;
    if (!a || /\n[\t ]+$/.test(t)) return de(t, s);
    let c = s.indent || (s.forceBlockIndent || dt(t) ? "  " : ""),
      h =
        a === "literal"
          ? !0
          : a === "folded" || e === U.Scalar.BLOCK_FOLDED
            ? !1
            : e === U.Scalar.BLOCK_LITERAL
              ? !0
              : !Eo(t, l, c.length);
    if (!t)
      return h
        ? `|
`
        : `>
`;
    let u, f;
    for (f = t.length; f > 0; --f) {
      let k = t[f - 1];
      if (
        k !==
          `
` &&
        k !== "	" &&
        k !== " "
      )
        break;
    }
    let p = t.substring(f),
      g = p.indexOf(`
`);
    (g === -1 ? (u = "-") : t === p || g !== p.length - 1 ? ((u = "+"), r && r()) : (u = ""),
      p &&
        ((t = t.slice(0, -p.length)),
        p[p.length - 1] ===
          `
` && (p = p.slice(0, -1)),
        (p = p.replace(dn, `$&${c}`))));
    let d = !1,
      m,
      w = -1;
    for (m = 0; m < t.length; ++m) {
      let k = t[m];
      if (k === " ") d = !0;
      else if (
        k ===
        `
`
      )
        w = m;
      else break;
    }
    let S = t.substring(0, w < m ? w + 1 : m);
    S && ((t = t.substring(S.length)), (S = S.replace(/\n+/g, `$&${c}`)));
    let N = (d ? (c ? "2" : "1") : "") + u;
    if ((n && ((N += " " + o(n.replace(/ ?[\r\n]+/g, " "))), i && i()), !h)) {
      let k = t
          .replace(
            /\n+/g,
            `
$&`,
          )
          .replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2")
          .replace(/\n+/g, `$&${c}`),
        I = !1,
        A = ft(s, !0);
      a !== "folded" &&
        e !== U.Scalar.BLOCK_FOLDED &&
        (A.onOverflow = () => {
          I = !0;
        });
      let b = W.foldFlowLines(`${S}${k}${p}`, c, W.FOLD_BLOCK, A);
      if (!I)
        return `>${N}
${c}${b}`;
    }
    return (
      (t = t.replace(/\n+/g, `$&${c}`)),
      `|${N}
${c}${S}${t}${p}`
    );
  }
  function qo(n, e, t, s) {
    let { type: i, value: r } = n,
      { actualString: a, implicitKey: o, indent: l, indentStep: c, inFlow: h } = e;
    if (
      (o &&
        r.includes(`
`)) ||
      (h && /[[\]{},]/.test(r))
    )
      return de(r, e);
    if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(r))
      return o ||
        h ||
        !r.includes(`
`)
        ? de(r, e)
        : ut(n, e, t, s);
    if (
      !o &&
      !h &&
      i !== U.Scalar.PLAIN &&
      r.includes(`
`)
    )
      return ut(n, e, t, s);
    if (dt(r)) {
      if (l === "") return ((e.forceBlockIndent = !0), ut(n, e, t, s));
      if (o && l === c) return de(r, e);
    }
    let u = r.replace(
      /\n+/g,
      `$&
${l}`,
    );
    if (a) {
      let f = (d) => d.default && d.tag !== "tag:yaml.org,2002:str" && d.test?.test(u),
        { compat: p, tags: g } = e.doc.schema;
      if (g.some(f) || p?.some(f)) return de(r, e);
    }
    return o ? u : W.foldFlowLines(u, l, W.FOLD_FLOW, ft(e, !1));
  }
  function Mo(n, e, t, s) {
    let { implicitKey: i, inFlow: r } = e,
      a = typeof n.value == "string" ? n : Object.assign({}, n, { value: String(n.value) }),
      { type: o } = n;
    o !== U.Scalar.QUOTE_DOUBLE &&
      /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(a.value) &&
      (o = U.Scalar.QUOTE_DOUBLE);
    let l = (h) => {
        switch (h) {
          case U.Scalar.BLOCK_FOLDED:
          case U.Scalar.BLOCK_LITERAL:
            return i || r ? de(a.value, e) : ut(a, e, t, s);
          case U.Scalar.QUOTE_DOUBLE:
            return Ee(a.value, e);
          case U.Scalar.QUOTE_SINGLE:
            return fn(a.value, e);
          case U.Scalar.PLAIN:
            return qo(a, e, t, s);
          default:
            return null;
        }
      },
      c = l(o);
    if (c === null) {
      let { defaultKeyType: h, defaultStringType: u } = e.options,
        f = (i && h) || u;
      if (((c = l(f)), c === null)) throw new Error(`Unsupported default string type ${f}`);
    }
    return c;
  }
  li.stringifyString = Mo;
});
var Me = y((hn) => {
  "use strict";
  var Co = st(),
    H = L(),
    Po = Ae(),
    _o = qe();
  function $o(n, e) {
    let t = Object.assign(
        {
          blockQuote: !0,
          commentString: Po.stringifyComment,
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
        n.schema.toStringOptions,
        e,
      ),
      s;
    switch (t.collectionStyle) {
      case "block":
        s = !1;
        break;
      case "flow":
        s = !0;
        break;
      default:
        s = null;
    }
    return {
      anchors: new Set(),
      doc: n,
      flowCollectionPadding: t.flowCollectionPadding ? " " : "",
      indent: "",
      indentStep: typeof t.indent == "number" ? " ".repeat(t.indent) : "  ",
      inFlow: s,
      options: t,
    };
  }
  function jo(n, e) {
    if (e.tag) {
      let i = n.filter((r) => r.tag === e.tag);
      if (i.length > 0) return i.find((r) => r.format === e.format) ?? i[0];
    }
    let t, s;
    if (H.isScalar(e)) {
      s = e.value;
      let i = n.filter((r) => r.identify?.(s));
      if (i.length > 1) {
        let r = i.filter((a) => a.test);
        r.length > 0 && (i = r);
      }
      t = i.find((r) => r.format === e.format) ?? i.find((r) => !r.format);
    } else ((s = e), (t = n.find((i) => i.nodeClass && s instanceof i.nodeClass)));
    if (!t) {
      let i = s?.constructor?.name ?? (s === null ? "null" : typeof s);
      throw new Error(`Tag not resolved for ${i} value`);
    }
    return t;
  }
  function Do(n, e, { anchors: t, doc: s }) {
    if (!s.directives) return "";
    let i = [],
      r = (H.isScalar(n) || H.isCollection(n)) && n.anchor;
    r && Co.anchorIsValid(r) && (t.add(r), i.push(`&${r}`));
    let a = n.tag ?? (e.default ? null : e.tag);
    return (a && i.push(s.directives.tagString(a)), i.join(" "));
  }
  function Uo(n, e, t, s) {
    if (H.isPair(n)) return n.toString(e, t, s);
    if (H.isAlias(n)) {
      if (e.doc.directives) return n.toString(e);
      if (e.resolvedAliases?.has(n)) throw new TypeError("Cannot stringify circular structure without alias nodes");
      (e.resolvedAliases ? e.resolvedAliases.add(n) : (e.resolvedAliases = new Set([n])), (n = n.resolve(e.doc)));
    }
    let i,
      r = H.isNode(n) ? n : e.doc.createNode(n, { onTagObj: (l) => (i = l) });
    i ?? (i = jo(e.doc.schema.tags, r));
    let a = Do(r, i, e);
    a.length > 0 && (e.indentAtStart = (e.indentAtStart ?? 0) + a.length + 1);
    let o =
      typeof i.stringify == "function"
        ? i.stringify(r, e, t, s)
        : H.isScalar(r)
          ? _o.stringifyString(r, e, t, s)
          : r.toString(e, t, s);
    return a
      ? H.isScalar(r) || o[0] === "{" || o[0] === "["
        ? `${a} ${o}`
        : `${a}
${e.indent}${o}`
      : o;
  }
  hn.createStringifyContext = $o;
  hn.stringify = Uo;
});
var di = y((fi) => {
  "use strict";
  var x = L(),
    ci = q(),
    ui = Me(),
    Ce = Ae();
  function Ro({ key: n, value: e }, t, s, i) {
    let {
        allNullValues: r,
        doc: a,
        indent: o,
        indentStep: l,
        options: { commentString: c, indentSeq: h, simpleKeys: u },
      } = t,
      f = (x.isNode(n) && n.comment) || null;
    if (u) {
      if (f) throw new Error("With simple keys, key nodes cannot have comments");
      if (x.isCollection(n) || (!x.isNode(n) && typeof n == "object")) {
        let A = "With simple keys, collection cannot be used as a key value";
        throw new Error(A);
      }
    }
    let p =
      !u &&
      (!n ||
        (f && e == null && !t.inFlow) ||
        x.isCollection(n) ||
        (x.isScalar(n)
          ? n.type === ci.Scalar.BLOCK_FOLDED || n.type === ci.Scalar.BLOCK_LITERAL
          : typeof n == "object"));
    t = Object.assign({}, t, { allNullValues: !1, implicitKey: !p && (u || !r), indent: o + l });
    let g = !1,
      d = !1,
      m = ui.stringify(
        n,
        t,
        () => (g = !0),
        () => (d = !0),
      );
    if (!p && !t.inFlow && m.length > 1024) {
      if (u) throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
      p = !0;
    }
    if (t.inFlow) {
      if (r || e == null) return (g && s && s(), m === "" ? "?" : p ? `? ${m}` : m);
    } else if ((r && !u) || (e == null && p))
      return ((m = `? ${m}`), f && !g ? (m += Ce.lineComment(m, t.indent, c(f))) : d && i && i(), m);
    (g && (f = null),
      p
        ? (f && (m += Ce.lineComment(m, t.indent, c(f))),
          (m = `? ${m}
${o}:`))
        : ((m = `${m}:`), f && (m += Ce.lineComment(m, t.indent, c(f)))));
    let w, S, v;
    (x.isNode(e)
      ? ((w = !!e.spaceBefore), (S = e.commentBefore), (v = e.comment))
      : ((w = !1), (S = null), (v = null), e && typeof e == "object" && (e = a.createNode(e))),
      (t.implicitKey = !1),
      !p && !f && x.isScalar(e) && (t.indentAtStart = m.length + 1),
      (d = !1),
      !h &&
        l.length >= 2 &&
        !t.inFlow &&
        !p &&
        x.isSeq(e) &&
        !e.flow &&
        !e.tag &&
        !e.anchor &&
        (t.indent = t.indent.substring(2)));
    let N = !1,
      k = ui.stringify(
        e,
        t,
        () => (N = !0),
        () => (d = !0),
      ),
      I = " ";
    if (f || w || S) {
      if (
        ((I = w
          ? `
`
          : ""),
        S)
      ) {
        let A = c(S);
        I += `
${Ce.indentComment(A, t.indent)}`;
      }
      k === "" && !t.inFlow
        ? I ===
            `
` &&
          v &&
          (I = `

`)
        : (I += `
${t.indent}`);
    } else if (!p && x.isCollection(e)) {
      let A = k[0],
        b = k.indexOf(`
`),
        T = b !== -1,
        B = t.inFlow ?? e.flow ?? e.items.length === 0;
      if (T || !B) {
        let $ = !1;
        if (T && (A === "&" || A === "!")) {
          let E = k.indexOf(" ");
          (A === "&" && E !== -1 && E < b && k[E + 1] === "!" && (E = k.indexOf(" ", E + 1)),
            (E === -1 || b < E) && ($ = !0));
        }
        $ ||
          (I = `
${t.indent}`);
      }
    } else
      (k === "" ||
        k[0] ===
          `
`) &&
        (I = "");
    return (
      (m += I + k),
      t.inFlow ? N && s && s() : v && !N ? (m += Ce.lineComment(m, t.indent, c(v))) : d && i && i(),
      m
    );
  }
  fi.stringifyPair = Ro;
});
var pn = y((mn) => {
  "use strict";
  var hi = Xe("process");
  function Yo(n, ...e) {
    n === "debug" && console.log(...e);
  }
  function Fo(n, e) {
    (n === "debug" || n === "warn") && (typeof hi.emitWarning == "function" ? hi.emitWarning(e) : console.warn(e));
  }
  mn.debug = Yo;
  mn.warn = Fo;
});
var yt = y((gt) => {
  "use strict";
  var pt = L(),
    mi = q(),
    ht = "<<",
    mt = {
      identify: (n) => n === ht || (typeof n == "symbol" && n.description === ht),
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new mi.Scalar(Symbol(ht)), { addToJSMap: pi }),
      stringify: () => ht,
    },
    Bo = (n, e) =>
      (mt.identify(e) || (pt.isScalar(e) && (!e.type || e.type === mi.Scalar.PLAIN) && mt.identify(e.value))) &&
      n?.doc.schema.tags.some((t) => t.tag === mt.tag && t.default);
  function pi(n, e, t) {
    let s = gi(n, t);
    if (pt.isSeq(s)) for (let i of s.items) gn(n, e, i);
    else if (Array.isArray(s)) for (let i of s) gn(n, e, i);
    else gn(n, e, s);
  }
  function gn(n, e, t) {
    let s = gi(n, t);
    if (!pt.isMap(s)) throw new Error("Merge sources must be maps or map aliases");
    let i = s.toJSON(null, n, Map);
    for (let [r, a] of i)
      e instanceof Map
        ? e.has(r) || e.set(r, a)
        : e instanceof Set
          ? e.add(r)
          : Object.prototype.hasOwnProperty.call(e, r) ||
            Object.defineProperty(e, r, { value: a, writable: !0, enumerable: !0, configurable: !0 });
    return e;
  }
  function gi(n, e) {
    return n && pt.isAlias(e) ? e.resolve(n.doc, n) : e;
  }
  gt.addMergeToJSMap = pi;
  gt.isMergeKey = Bo;
  gt.merge = mt;
});
var bn = y((wi) => {
  "use strict";
  var Ko = pn(),
    yi = yt(),
    xo = Me(),
    bi = L(),
    yn = G();
  function Vo(n, e, { key: t, value: s }) {
    if (bi.isNode(t) && t.addToJSMap) t.addToJSMap(n, e, s);
    else if (yi.isMergeKey(n, t)) yi.addMergeToJSMap(n, e, s);
    else {
      let i = yn.toJS(t, "", n);
      if (e instanceof Map) e.set(i, yn.toJS(s, i, n));
      else if (e instanceof Set) e.add(i);
      else {
        let r = Go(t, i, n),
          a = yn.toJS(s, r, n);
        r in e ? Object.defineProperty(e, r, { value: a, writable: !0, enumerable: !0, configurable: !0 }) : (e[r] = a);
      }
    }
    return e;
  }
  function Go(n, e, t) {
    if (e === null) return "";
    if (typeof e != "object") return String(e);
    if (bi.isNode(n) && t?.doc) {
      let s = xo.createStringifyContext(t.doc, {});
      s.anchors = new Set();
      for (let r of t.anchors.keys()) s.anchors.add(r.anchor);
      ((s.inFlow = !0), (s.inStringifyKey = !0));
      let i = n.toString(s);
      if (!t.mapKeyWarned) {
        let r = JSON.stringify(i);
        (r.length > 40 && (r = r.substring(0, 36) + '..."'),
          Ko.warn(
            t.doc.options.logLevel,
            `Keys with collection values will be stringified due to JS Object restrictions: ${r}. Set mapAsMap: true to use object keys.`,
          ),
          (t.mapKeyWarned = !0));
      }
      return i;
    }
    return JSON.stringify(e);
  }
  wi.addPairToJSMap = Vo;
});
var Q = y((wn) => {
  "use strict";
  var Si = Oe(),
    Jo = di(),
    Wo = bn(),
    bt = L();
  function Ho(n, e, t) {
    let s = Si.createNode(n, void 0, t),
      i = Si.createNode(e, void 0, t);
    return new wt(s, i);
  }
  var wt = class n {
    constructor(e, t = null) {
      (Object.defineProperty(this, bt.NODE_TYPE, { value: bt.PAIR }), (this.key = e), (this.value = t));
    }
    clone(e) {
      let { key: t, value: s } = this;
      return (bt.isNode(t) && (t = t.clone(e)), bt.isNode(s) && (s = s.clone(e)), new n(t, s));
    }
    toJSON(e, t) {
      let s = t?.mapAsMap ? new Map() : {};
      return Wo.addPairToJSMap(t, s, this);
    }
    toString(e, t, s) {
      return e?.doc ? Jo.stringifyPair(this, e, t, s) : JSON.stringify(this);
    }
  };
  wn.Pair = wt;
  wn.createPair = Ho;
});
var Sn = y((Ii) => {
  "use strict";
  var se = L(),
    vi = Me(),
    St = Ae();
  function Qo(n, e, t) {
    return ((e.inFlow ?? n.flow) ? Xo : zo)(n, e, t);
  }
  function zo(
    { comment: n, items: e },
    t,
    { blockItemPrefix: s, flowChars: i, itemIndent: r, onChompKeep: a, onComment: o },
  ) {
    let {
        indent: l,
        options: { commentString: c },
      } = t,
      h = Object.assign({}, t, { indent: r, type: null }),
      u = !1,
      f = [];
    for (let g = 0; g < e.length; ++g) {
      let d = e[g],
        m = null;
      if (se.isNode(d)) (!u && d.spaceBefore && f.push(""), vt(t, f, d.commentBefore, u), d.comment && (m = d.comment));
      else if (se.isPair(d)) {
        let S = se.isNode(d.key) ? d.key : null;
        S && (!u && S.spaceBefore && f.push(""), vt(t, f, S.commentBefore, u));
      }
      u = !1;
      let w = vi.stringify(
        d,
        h,
        () => (m = null),
        () => (u = !0),
      );
      (m && (w += St.lineComment(w, r, c(m))), u && m && (u = !1), f.push(s + w));
    }
    let p;
    if (f.length === 0) p = i.start + i.end;
    else {
      p = f[0];
      for (let g = 1; g < f.length; ++g) {
        let d = f[g];
        p += d
          ? `
${l}${d}`
          : `
`;
      }
    }
    return (
      n
        ? ((p +=
            `
` + St.indentComment(c(n), l)),
          o && o())
        : u && a && a(),
      p
    );
  }
  function Xo({ items: n }, e, { flowChars: t, itemIndent: s }) {
    let {
      indent: i,
      indentStep: r,
      flowCollectionPadding: a,
      options: { commentString: o },
    } = e;
    s += r;
    let l = Object.assign({}, e, { indent: s, inFlow: !0, type: null }),
      c = !1,
      h = 0,
      u = [];
    for (let g = 0; g < n.length; ++g) {
      let d = n[g],
        m = null;
      if (se.isNode(d)) (d.spaceBefore && u.push(""), vt(e, u, d.commentBefore, !1), d.comment && (m = d.comment));
      else if (se.isPair(d)) {
        let S = se.isNode(d.key) ? d.key : null;
        S && (S.spaceBefore && u.push(""), vt(e, u, S.commentBefore, !1), S.comment && (c = !0));
        let v = se.isNode(d.value) ? d.value : null;
        v
          ? (v.comment && (m = v.comment), v.commentBefore && (c = !0))
          : d.value == null && S?.comment && (m = S.comment);
      }
      m && (c = !0);
      let w = vi.stringify(d, l, () => (m = null));
      (c ||
        (c =
          u.length > h ||
          w.includes(`
`)),
        g < n.length - 1
          ? (w += ",")
          : e.options.trailingComma &&
            (e.options.lineWidth > 0 &&
              (c || (c = u.reduce((S, v) => S + v.length + 2, 2) + (w.length + 2) > e.options.lineWidth)),
            c && (w += ",")),
        m && (w += St.lineComment(w, s, o(m))),
        u.push(w),
        (h = u.length));
    }
    let { start: f, end: p } = t;
    if (u.length === 0) return f + p;
    if (!c) {
      let g = u.reduce((d, m) => d + m.length + 2, 2);
      c = e.options.lineWidth > 0 && g > e.options.lineWidth;
    }
    if (c) {
      let g = f;
      for (let d of u)
        g += d
          ? `
${r}${i}${d}`
          : `
`;
      return `${g}
${i}${p}`;
    } else return `${f}${a}${u.join(" ")}${a}${p}`;
  }
  function vt({ indent: n, options: { commentString: e } }, t, s, i) {
    if ((s && i && (s = s.replace(/^\n+/, "")), s)) {
      let r = St.indentComment(e(s), n);
      t.push(r.trimStart());
    }
  }
  Ii.stringifyCollection = Qo;
});
var X = y((In) => {
  "use strict";
  var Zo = Sn(),
    el = bn(),
    tl = ot(),
    z = L(),
    It = Q(),
    nl = q();
  function Pe(n, e) {
    let t = z.isScalar(e) ? e.value : e;
    for (let s of n)
      if (z.isPair(s) && (s.key === e || s.key === t || (z.isScalar(s.key) && s.key.value === t))) return s;
  }
  var vn = class extends tl.Collection {
    static get tagName() {
      return "tag:yaml.org,2002:map";
    }
    constructor(e) {
      (super(z.MAP, e), (this.items = []));
    }
    static from(e, t, s) {
      let { keepUndefined: i, replacer: r } = s,
        a = new this(e),
        o = (l, c) => {
          if (typeof r == "function") c = r.call(t, l, c);
          else if (Array.isArray(r) && !r.includes(l)) return;
          (c !== void 0 || i) && a.items.push(It.createPair(l, c, s));
        };
      if (t instanceof Map) for (let [l, c] of t) o(l, c);
      else if (t && typeof t == "object") for (let l of Object.keys(t)) o(l, t[l]);
      return (typeof e.sortMapEntries == "function" && a.items.sort(e.sortMapEntries), a);
    }
    add(e, t) {
      let s;
      z.isPair(e)
        ? (s = e)
        : !e || typeof e != "object" || !("key" in e)
          ? (s = new It.Pair(e, e?.value))
          : (s = new It.Pair(e.key, e.value));
      let i = Pe(this.items, s.key),
        r = this.schema?.sortMapEntries;
      if (i) {
        if (!t) throw new Error(`Key ${s.key} already set`);
        z.isScalar(i.value) && nl.isScalarValue(s.value) ? (i.value.value = s.value) : (i.value = s.value);
      } else if (r) {
        let a = this.items.findIndex((o) => r(s, o) < 0);
        a === -1 ? this.items.push(s) : this.items.splice(a, 0, s);
      } else this.items.push(s);
    }
    delete(e) {
      let t = Pe(this.items, e);
      return t ? this.items.splice(this.items.indexOf(t), 1).length > 0 : !1;
    }
    get(e, t) {
      let i = Pe(this.items, e)?.value;
      return (!t && z.isScalar(i) ? i.value : i) ?? void 0;
    }
    has(e) {
      return !!Pe(this.items, e);
    }
    set(e, t) {
      this.add(new It.Pair(e, t), !0);
    }
    toJSON(e, t, s) {
      let i = s ? new s() : t?.mapAsMap ? new Map() : {};
      t?.onCreate && t.onCreate(i);
      for (let r of this.items) el.addPairToJSMap(t, i, r);
      return i;
    }
    toString(e, t, s) {
      if (!e) return JSON.stringify(this);
      for (let i of this.items)
        if (!z.isPair(i)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(i)} instead`);
      return (
        !e.allNullValues && this.hasAllNullValues(!1) && (e = Object.assign({}, e, { allNullValues: !0 })),
        Zo.stringifyCollection(this, e, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: e.indent || "",
          onChompKeep: s,
          onComment: t,
        })
      );
    }
  };
  In.YAMLMap = vn;
  In.findPair = Pe;
});
var he = y((Ni) => {
  "use strict";
  var sl = L(),
    ki = X(),
    il = {
      collection: "map",
      default: !0,
      nodeClass: ki.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(n, e) {
        return (sl.isMap(n) || e("Expected a mapping for this tag"), n);
      },
      createNode: (n, e, t) => ki.YAMLMap.from(n, e, t),
    };
  Ni.map = il;
});
var Z = y((Li) => {
  "use strict";
  var rl = Oe(),
    al = Sn(),
    ol = ot(),
    Nt = L(),
    ll = q(),
    cl = G(),
    kn = class extends ol.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(e) {
        (super(Nt.SEQ, e), (this.items = []));
      }
      add(e) {
        this.items.push(e);
      }
      delete(e) {
        let t = kt(e);
        return typeof t != "number" ? !1 : this.items.splice(t, 1).length > 0;
      }
      get(e, t) {
        let s = kt(e);
        if (typeof s != "number") return;
        let i = this.items[s];
        return !t && Nt.isScalar(i) ? i.value : i;
      }
      has(e) {
        let t = kt(e);
        return typeof t == "number" && t < this.items.length;
      }
      set(e, t) {
        let s = kt(e);
        if (typeof s != "number") throw new Error(`Expected a valid index, not ${e}.`);
        let i = this.items[s];
        Nt.isScalar(i) && ll.isScalarValue(t) ? (i.value = t) : (this.items[s] = t);
      }
      toJSON(e, t) {
        let s = [];
        t?.onCreate && t.onCreate(s);
        let i = 0;
        for (let r of this.items) s.push(cl.toJS(r, String(i++), t));
        return s;
      }
      toString(e, t, s) {
        return e
          ? al.stringifyCollection(this, e, {
              blockItemPrefix: "- ",
              flowChars: { start: "[", end: "]" },
              itemIndent: (e.indent || "") + "  ",
              onChompKeep: s,
              onComment: t,
            })
          : JSON.stringify(this);
      }
      static from(e, t, s) {
        let { replacer: i } = s,
          r = new this(e);
        if (t && Symbol.iterator in Object(t)) {
          let a = 0;
          for (let o of t) {
            if (typeof i == "function") {
              let l = t instanceof Set ? o : String(a++);
              o = i.call(t, l, o);
            }
            r.items.push(rl.createNode(o, void 0, s));
          }
        }
        return r;
      }
    };
  function kt(n) {
    let e = Nt.isScalar(n) ? n.value : n;
    return (
      e && typeof e == "string" && (e = Number(e)),
      typeof e == "number" && Number.isInteger(e) && e >= 0 ? e : null
    );
  }
  Li.YAMLSeq = kn;
});
var me = y((Ai) => {
  "use strict";
  var ul = L(),
    Oi = Z(),
    fl = {
      collection: "seq",
      default: !0,
      nodeClass: Oi.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(n, e) {
        return (ul.isSeq(n) || e("Expected a sequence for this tag"), n);
      },
      createNode: (n, e, t) => Oi.YAMLSeq.from(n, e, t),
    };
  Ai.seq = fl;
});
var _e = y((Ti) => {
  "use strict";
  var dl = qe(),
    hl = {
      identify: (n) => typeof n == "string",
      default: !0,
      tag: "tag:yaml.org,2002:str",
      resolve: (n) => n,
      stringify(n, e, t, s) {
        return ((e = Object.assign({ actualString: !0 }, e)), dl.stringifyString(n, e, t, s));
      },
    };
  Ti.string = hl;
});
var Lt = y((Mi) => {
  "use strict";
  var Ei = q(),
    qi = {
      identify: (n) => n == null,
      createNode: () => new Ei.Scalar(null),
      default: !0,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Ei.Scalar(null),
      stringify: ({ source: n }, e) => (typeof n == "string" && qi.test.test(n) ? n : e.options.nullStr),
    };
  Mi.nullTag = qi;
});
var Nn = y((Pi) => {
  "use strict";
  var ml = q(),
    Ci = {
      identify: (n) => typeof n == "boolean",
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (n) => new ml.Scalar(n[0] === "t" || n[0] === "T"),
      stringify({ source: n, value: e }, t) {
        if (n && Ci.test.test(n)) {
          let s = n[0] === "t" || n[0] === "T";
          if (e === s) return n;
        }
        return e ? t.options.trueStr : t.options.falseStr;
      },
    };
  Pi.boolTag = Ci;
});
var pe = y((_i) => {
  "use strict";
  function pl({ format: n, minFractionDigits: e, tag: t, value: s }) {
    if (typeof s == "bigint") return String(s);
    let i = typeof s == "number" ? s : Number(s);
    if (!isFinite(i)) return isNaN(i) ? ".nan" : i < 0 ? "-.inf" : ".inf";
    let r = Object.is(s, -0) ? "-0" : JSON.stringify(s);
    if (!n && e && (!t || t === "tag:yaml.org,2002:float") && /^-?\d/.test(r) && !r.includes("e")) {
      let a = r.indexOf(".");
      a < 0 && ((a = r.length), (r += "."));
      let o = e - (r.length - a - 1);
      for (; o-- > 0;) r += "0";
    }
    return r;
  }
  _i.stringifyNumber = pl;
});
var On = y((Ot) => {
  "use strict";
  var gl = q(),
    Ln = pe(),
    yl = {
      identify: (n) => typeof n == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (n) =>
        n.slice(-3).toLowerCase() === "nan" ? NaN : n[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: Ln.stringifyNumber,
    },
    bl = {
      identify: (n) => typeof n == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (n) => parseFloat(n),
      stringify(n) {
        let e = Number(n.value);
        return isFinite(e) ? e.toExponential() : Ln.stringifyNumber(n);
      },
    },
    wl = {
      identify: (n) => typeof n == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(n) {
        let e = new gl.Scalar(parseFloat(n)),
          t = n.indexOf(".");
        return (t !== -1 && n[n.length - 1] === "0" && (e.minFractionDigits = n.length - t - 1), e);
      },
      stringify: Ln.stringifyNumber,
    };
  Ot.float = wl;
  Ot.floatExp = bl;
  Ot.floatNaN = yl;
});
var Tn = y((Tt) => {
  "use strict";
  var $i = pe(),
    At = (n) => typeof n == "bigint" || Number.isInteger(n),
    An = (n, e, t, { intAsBigInt: s }) => (s ? BigInt(n) : parseInt(n.substring(e), t));
  function ji(n, e, t) {
    let { value: s } = n;
    return At(s) && s >= 0 ? t + s.toString(e) : $i.stringifyNumber(n);
  }
  var Sl = {
      identify: (n) => At(n) && n >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (n, e, t) => An(n, 2, 8, t),
      stringify: (n) => ji(n, 8, "0o"),
    },
    vl = {
      identify: At,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (n, e, t) => An(n, 0, 10, t),
      stringify: $i.stringifyNumber,
    },
    Il = {
      identify: (n) => At(n) && n >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (n, e, t) => An(n, 2, 16, t),
      stringify: (n) => ji(n, 16, "0x"),
    };
  Tt.int = vl;
  Tt.intHex = Il;
  Tt.intOct = Sl;
});
var Ui = y((Di) => {
  "use strict";
  var kl = he(),
    Nl = Lt(),
    Ll = me(),
    Ol = _e(),
    Al = Nn(),
    En = On(),
    qn = Tn(),
    Tl = [
      kl.map,
      Ll.seq,
      Ol.string,
      Nl.nullTag,
      Al.boolTag,
      qn.intOct,
      qn.int,
      qn.intHex,
      En.floatNaN,
      En.floatExp,
      En.float,
    ];
  Di.schema = Tl;
});
var Fi = y((Yi) => {
  "use strict";
  var El = q(),
    ql = he(),
    Ml = me();
  function Ri(n) {
    return typeof n == "bigint" || Number.isInteger(n);
  }
  var Et = ({ value: n }) => JSON.stringify(n),
    Cl = [
      {
        identify: (n) => typeof n == "string",
        default: !0,
        tag: "tag:yaml.org,2002:str",
        resolve: (n) => n,
        stringify: Et,
      },
      {
        identify: (n) => n == null,
        createNode: () => new El.Scalar(null),
        default: !0,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: Et,
      },
      {
        identify: (n) => typeof n == "boolean",
        default: !0,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (n) => n === "true",
        stringify: Et,
      },
      {
        identify: Ri,
        default: !0,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (n, e, { intAsBigInt: t }) => (t ? BigInt(n) : parseInt(n, 10)),
        stringify: ({ value: n }) => (Ri(n) ? n.toString() : JSON.stringify(n)),
      },
      {
        identify: (n) => typeof n == "number",
        default: !0,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (n) => parseFloat(n),
        stringify: Et,
      },
    ],
    Pl = {
      default: !0,
      tag: "",
      test: /^/,
      resolve(n, e) {
        return (e(`Unresolved plain scalar ${JSON.stringify(n)}`), n);
      },
    },
    _l = [ql.map, Ml.seq].concat(Cl, Pl);
  Yi.schema = _l;
});
var Cn = y((Bi) => {
  "use strict";
  var $e = Xe("buffer"),
    Mn = q(),
    $l = qe(),
    jl = {
      identify: (n) => n instanceof Uint8Array,
      default: !1,
      tag: "tag:yaml.org,2002:binary",
      resolve(n, e) {
        if (typeof $e.Buffer == "function") return $e.Buffer.from(n, "base64");
        if (typeof atob == "function") {
          let t = atob(n.replace(/[\n\r]/g, "")),
            s = new Uint8Array(t.length);
          for (let i = 0; i < t.length; ++i) s[i] = t.charCodeAt(i);
          return s;
        } else
          return (e("This environment does not support reading binary tags; either Buffer or atob is required"), n);
      },
      stringify({ comment: n, type: e, value: t }, s, i, r) {
        if (!t) return "";
        let a = t,
          o;
        if (typeof $e.Buffer == "function")
          o = a instanceof $e.Buffer ? a.toString("base64") : $e.Buffer.from(a.buffer).toString("base64");
        else if (typeof btoa == "function") {
          let l = "";
          for (let c = 0; c < a.length; ++c) l += String.fromCharCode(a[c]);
          o = btoa(l);
        } else
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        if ((e ?? (e = Mn.Scalar.BLOCK_LITERAL), e !== Mn.Scalar.QUOTE_DOUBLE)) {
          let l = Math.max(s.options.lineWidth - s.indent.length, s.options.minContentWidth),
            c = Math.ceil(o.length / l),
            h = new Array(c);
          for (let u = 0, f = 0; u < c; ++u, f += l) h[u] = o.substr(f, l);
          o = h.join(
            e === Mn.Scalar.BLOCK_LITERAL
              ? `
`
              : " ",
          );
        }
        return $l.stringifyString({ comment: n, type: e, value: o }, s, i, r);
      },
    };
  Bi.binary = jl;
});
var Ct = y((Mt) => {
  "use strict";
  var qt = L(),
    Pn = Q(),
    Dl = q(),
    Ul = Z();
  function Ki(n, e) {
    if (qt.isSeq(n))
      for (let t = 0; t < n.items.length; ++t) {
        let s = n.items[t];
        if (!qt.isPair(s)) {
          if (qt.isMap(s)) {
            s.items.length > 1 && e("Each pair must have its own sequence indicator");
            let i = s.items[0] || new Pn.Pair(new Dl.Scalar(null));
            if (
              (s.commentBefore &&
                (i.key.commentBefore = i.key.commentBefore
                  ? `${s.commentBefore}
${i.key.commentBefore}`
                  : s.commentBefore),
              s.comment)
            ) {
              let r = i.value ?? i.key;
              r.comment = r.comment
                ? `${s.comment}
${r.comment}`
                : s.comment;
            }
            s = i;
          }
          n.items[t] = qt.isPair(s) ? s : new Pn.Pair(s);
        }
      }
    else e("Expected a sequence for this tag");
    return n;
  }
  function xi(n, e, t) {
    let { replacer: s } = t,
      i = new Ul.YAMLSeq(n);
    i.tag = "tag:yaml.org,2002:pairs";
    let r = 0;
    if (e && Symbol.iterator in Object(e))
      for (let a of e) {
        typeof s == "function" && (a = s.call(e, String(r++), a));
        let o, l;
        if (Array.isArray(a))
          if (a.length === 2) ((o = a[0]), (l = a[1]));
          else throw new TypeError(`Expected [key, value] tuple: ${a}`);
        else if (a && a instanceof Object) {
          let c = Object.keys(a);
          if (c.length === 1) ((o = c[0]), (l = a[o]));
          else throw new TypeError(`Expected tuple with one key, not ${c.length} keys`);
        } else o = a;
        i.items.push(Pn.createPair(o, l, t));
      }
    return i;
  }
  var Rl = { collection: "seq", default: !1, tag: "tag:yaml.org,2002:pairs", resolve: Ki, createNode: xi };
  Mt.createPairs = xi;
  Mt.pairs = Rl;
  Mt.resolvePairs = Ki;
});
var jn = y(($n) => {
  "use strict";
  var Vi = L(),
    _n = G(),
    je = X(),
    Yl = Z(),
    Gi = Ct(),
    ie = class n extends Yl.YAMLSeq {
      constructor() {
        (super(),
          (this.add = je.YAMLMap.prototype.add.bind(this)),
          (this.delete = je.YAMLMap.prototype.delete.bind(this)),
          (this.get = je.YAMLMap.prototype.get.bind(this)),
          (this.has = je.YAMLMap.prototype.has.bind(this)),
          (this.set = je.YAMLMap.prototype.set.bind(this)),
          (this.tag = n.tag));
      }
      toJSON(e, t) {
        if (!t) return super.toJSON(e);
        let s = new Map();
        t?.onCreate && t.onCreate(s);
        for (let i of this.items) {
          let r, a;
          if (
            (Vi.isPair(i) ? ((r = _n.toJS(i.key, "", t)), (a = _n.toJS(i.value, r, t))) : (r = _n.toJS(i, "", t)),
            s.has(r))
          )
            throw new Error("Ordered maps must not include duplicate keys");
          s.set(r, a);
        }
        return s;
      }
      static from(e, t, s) {
        let i = Gi.createPairs(e, t, s),
          r = new this();
        return ((r.items = i.items), r);
      }
    };
  ie.tag = "tag:yaml.org,2002:omap";
  var Fl = {
    collection: "seq",
    identify: (n) => n instanceof Map,
    nodeClass: ie,
    default: !1,
    tag: "tag:yaml.org,2002:omap",
    resolve(n, e) {
      let t = Gi.resolvePairs(n, e),
        s = [];
      for (let { key: i } of t.items)
        Vi.isScalar(i) &&
          (s.includes(i.value) ? e(`Ordered maps must not include duplicate keys: ${i.value}`) : s.push(i.value));
      return Object.assign(new ie(), t);
    },
    createNode: (n, e, t) => ie.from(n, e, t),
  };
  $n.YAMLOMap = ie;
  $n.omap = Fl;
});
var zi = y((Dn) => {
  "use strict";
  var Ji = q();
  function Wi({ value: n, source: e }, t) {
    return e && (n ? Hi : Qi).test.test(e) ? e : n ? t.options.trueStr : t.options.falseStr;
  }
  var Hi = {
      identify: (n) => n === !0,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Ji.Scalar(!0),
      stringify: Wi,
    },
    Qi = {
      identify: (n) => n === !1,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Ji.Scalar(!1),
      stringify: Wi,
    };
  Dn.falseTag = Qi;
  Dn.trueTag = Hi;
});
var Xi = y((Pt) => {
  "use strict";
  var Bl = q(),
    Un = pe(),
    Kl = {
      identify: (n) => typeof n == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (n) =>
        n.slice(-3).toLowerCase() === "nan" ? NaN : n[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: Un.stringifyNumber,
    },
    xl = {
      identify: (n) => typeof n == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (n) => parseFloat(n.replace(/_/g, "")),
      stringify(n) {
        let e = Number(n.value);
        return isFinite(e) ? e.toExponential() : Un.stringifyNumber(n);
      },
    },
    Vl = {
      identify: (n) => typeof n == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(n) {
        let e = new Bl.Scalar(parseFloat(n.replace(/_/g, ""))),
          t = n.indexOf(".");
        if (t !== -1) {
          let s = n.substring(t + 1).replace(/_/g, "");
          s[s.length - 1] === "0" && (e.minFractionDigits = s.length);
        }
        return e;
      },
      stringify: Un.stringifyNumber,
    };
  Pt.float = Vl;
  Pt.floatExp = xl;
  Pt.floatNaN = Kl;
});
var er = y((Ue) => {
  "use strict";
  var Zi = pe(),
    De = (n) => typeof n == "bigint" || Number.isInteger(n);
  function _t(n, e, t, { intAsBigInt: s }) {
    let i = n[0];
    if (((i === "-" || i === "+") && (e += 1), (n = n.substring(e).replace(/_/g, "")), s)) {
      switch (t) {
        case 2:
          n = `0b${n}`;
          break;
        case 8:
          n = `0o${n}`;
          break;
        case 16:
          n = `0x${n}`;
          break;
      }
      let a = BigInt(n);
      return i === "-" ? BigInt(-1) * a : a;
    }
    let r = parseInt(n, t);
    return i === "-" ? -1 * r : r;
  }
  function Rn(n, e, t) {
    let { value: s } = n;
    if (De(s)) {
      let i = s.toString(e);
      return s < 0 ? "-" + t + i.substr(1) : t + i;
    }
    return Zi.stringifyNumber(n);
  }
  var Gl = {
      identify: De,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (n, e, t) => _t(n, 2, 2, t),
      stringify: (n) => Rn(n, 2, "0b"),
    },
    Jl = {
      identify: De,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (n, e, t) => _t(n, 1, 8, t),
      stringify: (n) => Rn(n, 8, "0"),
    },
    Wl = {
      identify: De,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (n, e, t) => _t(n, 0, 10, t),
      stringify: Zi.stringifyNumber,
    },
    Hl = {
      identify: De,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (n, e, t) => _t(n, 2, 16, t),
      stringify: (n) => Rn(n, 16, "0x"),
    };
  Ue.int = Wl;
  Ue.intBin = Gl;
  Ue.intHex = Hl;
  Ue.intOct = Jl;
});
var Fn = y((Yn) => {
  "use strict";
  var Dt = L(),
    $t = Q(),
    jt = X(),
    re = class n extends jt.YAMLMap {
      constructor(e) {
        (super(e), (this.tag = n.tag));
      }
      add(e) {
        let t;
        (Dt.isPair(e)
          ? (t = e)
          : e && typeof e == "object" && "key" in e && "value" in e && e.value === null
            ? (t = new $t.Pair(e.key, null))
            : (t = new $t.Pair(e, null)),
          jt.findPair(this.items, t.key) || this.items.push(t));
      }
      get(e, t) {
        let s = jt.findPair(this.items, e);
        return !t && Dt.isPair(s) ? (Dt.isScalar(s.key) ? s.key.value : s.key) : s;
      }
      set(e, t) {
        if (typeof t != "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`);
        let s = jt.findPair(this.items, e);
        s && !t ? this.items.splice(this.items.indexOf(s), 1) : !s && t && this.items.push(new $t.Pair(e));
      }
      toJSON(e, t) {
        return super.toJSON(e, t, Set);
      }
      toString(e, t, s) {
        if (!e) return JSON.stringify(this);
        if (this.hasAllNullValues(!0)) return super.toString(Object.assign({}, e, { allNullValues: !0 }), t, s);
        throw new Error("Set items must all have null values");
      }
      static from(e, t, s) {
        let { replacer: i } = s,
          r = new this(e);
        if (t && Symbol.iterator in Object(t))
          for (let a of t) (typeof i == "function" && (a = i.call(t, a, a)), r.items.push($t.createPair(a, null, s)));
        return r;
      }
    };
  re.tag = "tag:yaml.org,2002:set";
  var Ql = {
    collection: "map",
    identify: (n) => n instanceof Set,
    nodeClass: re,
    default: !1,
    tag: "tag:yaml.org,2002:set",
    createNode: (n, e, t) => re.from(n, e, t),
    resolve(n, e) {
      if (Dt.isMap(n)) {
        if (n.hasAllNullValues(!0)) return Object.assign(new re(), n);
        e("Set items must all have null values");
      } else e("Expected a mapping for this tag");
      return n;
    },
  };
  Yn.YAMLSet = re;
  Yn.set = Ql;
});
var Kn = y((Ut) => {
  "use strict";
  var zl = pe();
  function Bn(n, e) {
    let t = n[0],
      s = t === "-" || t === "+" ? n.substring(1) : n,
      i = (a) => (e ? BigInt(a) : Number(a)),
      r = s
        .replace(/_/g, "")
        .split(":")
        .reduce((a, o) => a * i(60) + i(o), i(0));
    return t === "-" ? i(-1) * r : r;
  }
  function tr(n) {
    let { value: e } = n,
      t = (a) => a;
    if (typeof e == "bigint") t = (a) => BigInt(a);
    else if (isNaN(e) || !isFinite(e)) return zl.stringifyNumber(n);
    let s = "";
    e < 0 && ((s = "-"), (e *= t(-1)));
    let i = t(60),
      r = [e % i];
    return (
      e < 60 ? r.unshift(0) : ((e = (e - r[0]) / i), r.unshift(e % i), e >= 60 && ((e = (e - r[0]) / i), r.unshift(e))),
      s +
        r
          .map((a) => String(a).padStart(2, "0"))
          .join(":")
          .replace(/000000\d*$/, "")
    );
  }
  var Xl = {
      identify: (n) => typeof n == "bigint" || Number.isInteger(n),
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (n, e, { intAsBigInt: t }) => Bn(n, t),
      stringify: tr,
    },
    Zl = {
      identify: (n) => typeof n == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (n) => Bn(n, !1),
      stringify: tr,
    },
    nr = {
      identify: (n) => n instanceof Date,
      default: !0,
      tag: "tag:yaml.org,2002:timestamp",
      test: RegExp(
        "^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$",
      ),
      resolve(n) {
        let e = n.match(nr.test);
        if (!e) throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        let [, t, s, i, r, a, o] = e.map(Number),
          l = e[7] ? Number((e[7] + "00").substr(1, 3)) : 0,
          c = Date.UTC(t, s - 1, i, r || 0, a || 0, o || 0, l),
          h = e[8];
        if (h && h !== "Z") {
          let u = Bn(h, !1);
          (Math.abs(u) < 30 && (u *= 60), (c -= 6e4 * u));
        }
        return new Date(c);
      },
      stringify: ({ value: n }) => n?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? "",
    };
  Ut.floatTime = Zl;
  Ut.intTime = Xl;
  Ut.timestamp = nr;
});
var rr = y((ir) => {
  "use strict";
  var ec = he(),
    tc = Lt(),
    nc = me(),
    sc = _e(),
    ic = Cn(),
    sr = zi(),
    xn = Xi(),
    Rt = er(),
    rc = yt(),
    ac = jn(),
    oc = Ct(),
    lc = Fn(),
    Vn = Kn(),
    cc = [
      ec.map,
      nc.seq,
      sc.string,
      tc.nullTag,
      sr.trueTag,
      sr.falseTag,
      Rt.intBin,
      Rt.intOct,
      Rt.int,
      Rt.intHex,
      xn.floatNaN,
      xn.floatExp,
      xn.float,
      ic.binary,
      rc.merge,
      ac.omap,
      oc.pairs,
      lc.set,
      Vn.intTime,
      Vn.floatTime,
      Vn.timestamp,
    ];
  ir.schema = cc;
});
var pr = y((Wn) => {
  "use strict";
  var cr = he(),
    uc = Lt(),
    ur = me(),
    fc = _e(),
    dc = Nn(),
    Gn = On(),
    Jn = Tn(),
    hc = Ui(),
    mc = Fi(),
    fr = Cn(),
    Re = yt(),
    dr = jn(),
    hr = Ct(),
    ar = rr(),
    mr = Fn(),
    Yt = Kn(),
    or = new Map([
      ["core", hc.schema],
      ["failsafe", [cr.map, ur.seq, fc.string]],
      ["json", mc.schema],
      ["yaml11", ar.schema],
      ["yaml-1.1", ar.schema],
    ]),
    lr = {
      binary: fr.binary,
      bool: dc.boolTag,
      float: Gn.float,
      floatExp: Gn.floatExp,
      floatNaN: Gn.floatNaN,
      floatTime: Yt.floatTime,
      int: Jn.int,
      intHex: Jn.intHex,
      intOct: Jn.intOct,
      intTime: Yt.intTime,
      map: cr.map,
      merge: Re.merge,
      null: uc.nullTag,
      omap: dr.omap,
      pairs: hr.pairs,
      seq: ur.seq,
      set: mr.set,
      timestamp: Yt.timestamp,
    },
    pc = {
      "tag:yaml.org,2002:binary": fr.binary,
      "tag:yaml.org,2002:merge": Re.merge,
      "tag:yaml.org,2002:omap": dr.omap,
      "tag:yaml.org,2002:pairs": hr.pairs,
      "tag:yaml.org,2002:set": mr.set,
      "tag:yaml.org,2002:timestamp": Yt.timestamp,
    };
  function gc(n, e, t) {
    let s = or.get(e);
    if (s && !n) return t && !s.includes(Re.merge) ? s.concat(Re.merge) : s.slice();
    let i = s;
    if (!i)
      if (Array.isArray(n)) i = [];
      else {
        let r = Array.from(or.keys())
          .filter((a) => a !== "yaml11")
          .map((a) => JSON.stringify(a))
          .join(", ");
        throw new Error(`Unknown schema "${e}"; use one of ${r} or define customTags array`);
      }
    if (Array.isArray(n)) for (let r of n) i = i.concat(r);
    else typeof n == "function" && (i = n(i.slice()));
    return (
      t && (i = i.concat(Re.merge)),
      i.reduce((r, a) => {
        let o = typeof a == "string" ? lr[a] : a;
        if (!o) {
          let l = JSON.stringify(a),
            c = Object.keys(lr)
              .map((h) => JSON.stringify(h))
              .join(", ");
          throw new Error(`Unknown custom tag ${l}; use one of ${c}`);
        }
        return (r.includes(o) || r.push(o), r);
      }, [])
    );
  }
  Wn.coreKnownTags = pc;
  Wn.getTags = gc;
});
var zn = y((gr) => {
  "use strict";
  var Hn = L(),
    yc = he(),
    bc = me(),
    wc = _e(),
    Ft = pr(),
    Sc = (n, e) => (n.key < e.key ? -1 : n.key > e.key ? 1 : 0),
    Qn = class n {
      constructor({
        compat: e,
        customTags: t,
        merge: s,
        resolveKnownTags: i,
        schema: r,
        sortMapEntries: a,
        toStringDefaults: o,
      }) {
        ((this.compat = Array.isArray(e) ? Ft.getTags(e, "compat") : e ? Ft.getTags(null, e) : null),
          (this.name = (typeof r == "string" && r) || "core"),
          (this.knownTags = i ? Ft.coreKnownTags : {}),
          (this.tags = Ft.getTags(t, this.name, s)),
          (this.toStringOptions = o ?? null),
          Object.defineProperty(this, Hn.MAP, { value: yc.map }),
          Object.defineProperty(this, Hn.SCALAR, { value: wc.string }),
          Object.defineProperty(this, Hn.SEQ, { value: bc.seq }),
          (this.sortMapEntries = typeof a == "function" ? a : a === !0 ? Sc : null));
      }
      clone() {
        let e = Object.create(n.prototype, Object.getOwnPropertyDescriptors(this));
        return ((e.tags = this.tags.slice()), e);
      }
    };
  gr.Schema = Qn;
});
var br = y((yr) => {
  "use strict";
  var vc = L(),
    Xn = Me(),
    Ye = Ae();
  function Ic(n, e) {
    let t = [],
      s = e.directives === !0;
    if (e.directives !== !1 && n.directives) {
      let l = n.directives.toString(n);
      l ? (t.push(l), (s = !0)) : n.directives.docStart && (s = !0);
    }
    s && t.push("---");
    let i = Xn.createStringifyContext(n, e),
      { commentString: r } = i.options;
    if (n.commentBefore) {
      t.length !== 1 && t.unshift("");
      let l = r(n.commentBefore);
      t.unshift(Ye.indentComment(l, ""));
    }
    let a = !1,
      o = null;
    if (n.contents) {
      if (vc.isNode(n.contents)) {
        if ((n.contents.spaceBefore && s && t.push(""), n.contents.commentBefore)) {
          let h = r(n.contents.commentBefore);
          t.push(Ye.indentComment(h, ""));
        }
        ((i.forceBlockIndent = !!n.comment), (o = n.contents.comment));
      }
      let l = o ? void 0 : () => (a = !0),
        c = Xn.stringify(n.contents, i, () => (o = null), l);
      (o && (c += Ye.lineComment(c, "", r(o))),
        (c[0] === "|" || c[0] === ">") && t[t.length - 1] === "---" ? (t[t.length - 1] = `--- ${c}`) : t.push(c));
    } else t.push(Xn.stringify(n.contents, i));
    if (n.directives?.docEnd)
      if (n.comment) {
        let l = r(n.comment);
        l.includes(`
`)
          ? (t.push("..."), t.push(Ye.indentComment(l, "")))
          : t.push(`... ${l}`);
      } else t.push("...");
    else {
      let l = n.comment;
      (l && a && (l = l.replace(/^\n+/, "")),
        l && ((!a || o) && t[t.length - 1] !== "" && t.push(""), t.push(Ye.indentComment(r(l), ""))));
    }
    return (
      t.join(`
`) +
      `
`
    );
  }
  yr.stringifyDocument = Ic;
});
var Fe = y((wr) => {
  "use strict";
  var kc = Le(),
    ge = ot(),
    j = L(),
    Nc = Q(),
    Lc = G(),
    Oc = zn(),
    Ac = br(),
    Zn = st(),
    Tc = nn(),
    Ec = Oe(),
    es = tn(),
    ts = class n {
      constructor(e, t, s) {
        ((this.commentBefore = null),
          (this.comment = null),
          (this.errors = []),
          (this.warnings = []),
          Object.defineProperty(this, j.NODE_TYPE, { value: j.DOC }));
        let i = null;
        typeof t == "function" || Array.isArray(t) ? (i = t) : s === void 0 && t && ((s = t), (t = void 0));
        let r = Object.assign(
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
          s,
        );
        this.options = r;
        let { version: a } = r;
        (s?._directives
          ? ((this.directives = s._directives.atDocument()),
            this.directives.yaml.explicit && (a = this.directives.yaml.version))
          : (this.directives = new es.Directives({ version: a })),
          this.setSchema(a, s),
          (this.contents = e === void 0 ? null : this.createNode(e, i, s)));
      }
      clone() {
        let e = Object.create(n.prototype, { [j.NODE_TYPE]: { value: j.DOC } });
        return (
          (e.commentBefore = this.commentBefore),
          (e.comment = this.comment),
          (e.errors = this.errors.slice()),
          (e.warnings = this.warnings.slice()),
          (e.options = Object.assign({}, this.options)),
          this.directives && (e.directives = this.directives.clone()),
          (e.schema = this.schema.clone()),
          (e.contents = j.isNode(this.contents) ? this.contents.clone(e.schema) : this.contents),
          this.range && (e.range = this.range.slice()),
          e
        );
      }
      add(e) {
        ye(this.contents) && this.contents.add(e);
      }
      addIn(e, t) {
        ye(this.contents) && this.contents.addIn(e, t);
      }
      createAlias(e, t) {
        if (!e.anchor) {
          let s = Zn.anchorNames(this);
          e.anchor = !t || s.has(t) ? Zn.findNewAnchor(t || "a", s) : t;
        }
        return new kc.Alias(e.anchor);
      }
      createNode(e, t, s) {
        let i;
        if (typeof t == "function") ((e = t.call({ "": e }, "", e)), (i = t));
        else if (Array.isArray(t)) {
          let m = (S) => typeof S == "number" || S instanceof String || S instanceof Number,
            w = t.filter(m).map(String);
          (w.length > 0 && (t = t.concat(w)), (i = t));
        } else s === void 0 && t && ((s = t), (t = void 0));
        let { aliasDuplicateObjects: r, anchorPrefix: a, flow: o, keepUndefined: l, onTagObj: c, tag: h } = s ?? {},
          { onAnchor: u, setAnchors: f, sourceObjects: p } = Zn.createNodeAnchors(this, a || "a"),
          g = {
            aliasDuplicateObjects: r ?? !0,
            keepUndefined: l ?? !1,
            onAnchor: u,
            onTagObj: c,
            replacer: i,
            schema: this.schema,
            sourceObjects: p,
          },
          d = Ec.createNode(e, h, g);
        return (o && j.isCollection(d) && (d.flow = !0), f(), d);
      }
      createPair(e, t, s = {}) {
        let i = this.createNode(e, null, s),
          r = this.createNode(t, null, s);
        return new Nc.Pair(i, r);
      }
      delete(e) {
        return ye(this.contents) ? this.contents.delete(e) : !1;
      }
      deleteIn(e) {
        return ge.isEmptyPath(e)
          ? this.contents == null
            ? !1
            : ((this.contents = null), !0)
          : ye(this.contents)
            ? this.contents.deleteIn(e)
            : !1;
      }
      get(e, t) {
        return j.isCollection(this.contents) ? this.contents.get(e, t) : void 0;
      }
      getIn(e, t) {
        return ge.isEmptyPath(e)
          ? !t && j.isScalar(this.contents)
            ? this.contents.value
            : this.contents
          : j.isCollection(this.contents)
            ? this.contents.getIn(e, t)
            : void 0;
      }
      has(e) {
        return j.isCollection(this.contents) ? this.contents.has(e) : !1;
      }
      hasIn(e) {
        return ge.isEmptyPath(e)
          ? this.contents !== void 0
          : j.isCollection(this.contents)
            ? this.contents.hasIn(e)
            : !1;
      }
      set(e, t) {
        this.contents == null
          ? (this.contents = ge.collectionFromPath(this.schema, [e], t))
          : ye(this.contents) && this.contents.set(e, t);
      }
      setIn(e, t) {
        ge.isEmptyPath(e)
          ? (this.contents = t)
          : this.contents == null
            ? (this.contents = ge.collectionFromPath(this.schema, Array.from(e), t))
            : ye(this.contents) && this.contents.setIn(e, t);
      }
      setSchema(e, t = {}) {
        typeof e == "number" && (e = String(e));
        let s;
        switch (e) {
          case "1.1":
            (this.directives
              ? (this.directives.yaml.version = "1.1")
              : (this.directives = new es.Directives({ version: "1.1" })),
              (s = { resolveKnownTags: !1, schema: "yaml-1.1" }));
            break;
          case "1.2":
          case "next":
            (this.directives
              ? (this.directives.yaml.version = e)
              : (this.directives = new es.Directives({ version: e })),
              (s = { resolveKnownTags: !0, schema: "core" }));
            break;
          case null:
            (this.directives && delete this.directives, (s = null));
            break;
          default: {
            let i = JSON.stringify(e);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${i}`);
          }
        }
        if (t.schema instanceof Object) this.schema = t.schema;
        else if (s) this.schema = new Oc.Schema(Object.assign(s, t));
        else throw new Error("With a null YAML version, the { schema: Schema } option is required");
      }
      toJS({ json: e, jsonArg: t, mapAsMap: s, maxAliasCount: i, onAnchor: r, reviver: a } = {}) {
        let o = {
            anchors: new Map(),
            doc: this,
            keep: !e,
            mapAsMap: s === !0,
            mapKeyWarned: !1,
            maxAliasCount: typeof i == "number" ? i : 100,
          },
          l = Lc.toJS(this.contents, t ?? "", o);
        if (typeof r == "function") for (let { count: c, res: h } of o.anchors.values()) r(h, c);
        return typeof a == "function" ? Tc.applyReviver(a, { "": l }, "", l) : l;
      }
      toJSON(e, t) {
        return this.toJS({ json: !0, jsonArg: e, mapAsMap: !1, onAnchor: t });
      }
      toString(e = {}) {
        if (this.errors.length > 0) throw new Error("Document with errors cannot be stringified");
        if ("indent" in e && (!Number.isInteger(e.indent) || Number(e.indent) <= 0)) {
          let t = JSON.stringify(e.indent);
          throw new Error(`"indent" option must be a positive integer, not ${t}`);
        }
        return Ac.stringifyDocument(this, e);
      }
    };
  function ye(n) {
    if (j.isCollection(n)) return !0;
    throw new Error("Expected a YAML collection as document contents");
  }
  wr.Document = ts;
});
var xe = y((Ke) => {
  "use strict";
  var Be = class extends Error {
      constructor(e, t, s, i) {
        (super(), (this.name = e), (this.code = s), (this.message = i), (this.pos = t));
      }
    },
    ns = class extends Be {
      constructor(e, t, s) {
        super("YAMLParseError", e, t, s);
      }
    },
    ss = class extends Be {
      constructor(e, t, s) {
        super("YAMLWarning", e, t, s);
      }
    },
    qc = (n, e) => (t) => {
      if (t.pos[0] === -1) return;
      t.linePos = t.pos.map((o) => e.linePos(o));
      let { line: s, col: i } = t.linePos[0];
      t.message += ` at line ${s}, column ${i}`;
      let r = i - 1,
        a = n.substring(e.lineStarts[s - 1], e.lineStarts[s]).replace(/[\n\r]+$/, "");
      if (r >= 60 && a.length > 80) {
        let o = Math.min(r - 39, a.length - 79);
        ((a = "\u2026" + a.substring(o)), (r -= o - 1));
      }
      if ((a.length > 80 && (a = a.substring(0, 79) + "\u2026"), s > 1 && /^ *$/.test(a.substring(0, r)))) {
        let o = n.substring(e.lineStarts[s - 2], e.lineStarts[s - 1]);
        (o.length > 80 &&
          (o =
            o.substring(0, 79) +
            `\u2026
`),
          (a = o + a));
      }
      if (/[^ ]/.test(a)) {
        let o = 1,
          l = t.linePos[1];
        l?.line === s && l.col > i && (o = Math.max(1, Math.min(l.col - i, 80 - r)));
        let c = " ".repeat(r) + "^".repeat(o);
        t.message += `:

${a}
${c}
`;
      }
    };
  Ke.YAMLError = Be;
  Ke.YAMLParseError = ns;
  Ke.YAMLWarning = ss;
  Ke.prettifyError = qc;
});
var Ve = y((Sr) => {
  "use strict";
  function Mc(n, { flow: e, indicator: t, next: s, offset: i, onError: r, parentIndent: a, startOnNewline: o }) {
    let l = !1,
      c = o,
      h = o,
      u = "",
      f = "",
      p = !1,
      g = !1,
      d = null,
      m = null,
      w = null,
      S = null,
      v = null,
      N = null,
      k = null;
    for (let b of n)
      switch (
        (g &&
          (b.type !== "space" &&
            b.type !== "newline" &&
            b.type !== "comma" &&
            r(b.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"),
          (g = !1)),
        d &&
          (c &&
            b.type !== "comment" &&
            b.type !== "newline" &&
            r(d, "TAB_AS_INDENT", "Tabs are not allowed as indentation"),
          (d = null)),
        b.type)
      ) {
        case "space":
          (!e && (t !== "doc-start" || s?.type !== "flow-collection") && b.source.includes("	") && (d = b), (h = !0));
          break;
        case "comment": {
          h || r(b, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          let T = b.source.substring(1) || " ";
          (u ? (u += f + T) : (u = T), (f = ""), (c = !1));
          break;
        }
        case "newline":
          (c ? (u ? (u += b.source) : (!N || t !== "seq-item-ind") && (l = !0)) : (f += b.source),
            (c = !0),
            (p = !0),
            (m || w) && (S = b),
            (h = !0));
          break;
        case "anchor":
          (m && r(b, "MULTIPLE_ANCHORS", "A node can have at most one anchor"),
            b.source.endsWith(":") &&
              r(b.offset + b.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0),
            (m = b),
            k ?? (k = b.offset),
            (c = !1),
            (h = !1),
            (g = !0));
          break;
        case "tag": {
          (w && r(b, "MULTIPLE_TAGS", "A node can have at most one tag"),
            (w = b),
            k ?? (k = b.offset),
            (c = !1),
            (h = !1),
            (g = !0));
          break;
        }
        case t:
          ((m || w) && r(b, "BAD_PROP_ORDER", `Anchors and tags must be after the ${b.source} indicator`),
            N && r(b, "UNEXPECTED_TOKEN", `Unexpected ${b.source} in ${e ?? "collection"}`),
            (N = b),
            (c = t === "seq-item-ind" || t === "explicit-key-ind"),
            (h = !1));
          break;
        case "comma":
          if (e) {
            (v && r(b, "UNEXPECTED_TOKEN", `Unexpected , in ${e}`), (v = b), (c = !1), (h = !1));
            break;
          }
        default:
          (r(b, "UNEXPECTED_TOKEN", `Unexpected ${b.type} token`), (c = !1), (h = !1));
      }
    let I = n[n.length - 1],
      A = I ? I.offset + I.source.length : i;
    return (
      g &&
        s &&
        s.type !== "space" &&
        s.type !== "newline" &&
        s.type !== "comma" &&
        (s.type !== "scalar" || s.source !== "") &&
        r(s.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"),
      d &&
        ((c && d.indent <= a) || s?.type === "block-map" || s?.type === "block-seq") &&
        r(d, "TAB_AS_INDENT", "Tabs are not allowed as indentation"),
      {
        comma: v,
        found: N,
        spaceBefore: l,
        comment: u,
        hasNewline: p,
        anchor: m,
        tag: w,
        newlineAfterProp: S,
        end: A,
        start: k ?? A,
      }
    );
  }
  Sr.resolveProps = Mc;
});
var Bt = y((vr) => {
  "use strict";
  function is(n) {
    if (!n) return null;
    switch (n.type) {
      case "alias":
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        if (
          n.source.includes(`
`)
        )
          return !0;
        if (n.end) {
          for (let e of n.end) if (e.type === "newline") return !0;
        }
        return !1;
      case "flow-collection":
        for (let e of n.items) {
          for (let t of e.start) if (t.type === "newline") return !0;
          if (e.sep) {
            for (let t of e.sep) if (t.type === "newline") return !0;
          }
          if (is(e.key) || is(e.value)) return !0;
        }
        return !1;
      default:
        return !0;
    }
  }
  vr.containsNewline = is;
});
var rs = y((Ir) => {
  "use strict";
  var Cc = Bt();
  function Pc(n, e, t) {
    if (e?.type === "flow-collection") {
      let s = e.end[0];
      s.indent === n &&
        (s.source === "]" || s.source === "}") &&
        Cc.containsNewline(e) &&
        t(s, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
    }
  }
  Ir.flowIndentCheck = Pc;
});
var as = y((Nr) => {
  "use strict";
  var kr = L();
  function _c(n, e, t) {
    let { uniqueKeys: s } = n.options;
    if (s === !1) return !1;
    let i = typeof s == "function" ? s : (r, a) => r === a || (kr.isScalar(r) && kr.isScalar(a) && r.value === a.value);
    return e.some((r) => i(r.key, t));
  }
  Nr.mapIncludes = _c;
});
var qr = y((Er) => {
  "use strict";
  var Lr = Q(),
    $c = X(),
    Or = Ve(),
    jc = Bt(),
    Ar = rs(),
    Dc = as(),
    Tr = "All mapping items must start at the same column";
  function Uc({ composeNode: n, composeEmptyNode: e }, t, s, i, r) {
    let a = r?.nodeClass ?? $c.YAMLMap,
      o = new a(t.schema);
    t.atRoot && (t.atRoot = !1);
    let l = s.offset,
      c = null;
    for (let h of s.items) {
      let { start: u, key: f, sep: p, value: g } = h,
        d = Or.resolveProps(u, {
          indicator: "explicit-key-ind",
          next: f ?? p?.[0],
          offset: l,
          onError: i,
          parentIndent: s.indent,
          startOnNewline: !0,
        }),
        m = !d.found;
      if (m) {
        if (
          (f &&
            (f.type === "block-seq"
              ? i(l, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key")
              : "indent" in f && f.indent !== s.indent && i(l, "BAD_INDENT", Tr)),
          !d.anchor && !d.tag && !p)
        ) {
          ((c = d.end),
            d.comment &&
              (o.comment
                ? (o.comment +=
                    `
` + d.comment)
                : (o.comment = d.comment)));
          continue;
        }
        (d.newlineAfterProp || jc.containsNewline(f)) &&
          i(f ?? u[u.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
      } else d.found?.indent !== s.indent && i(l, "BAD_INDENT", Tr);
      t.atKey = !0;
      let w = d.end,
        S = f ? n(t, f, d, i) : e(t, w, u, null, d, i);
      (t.schema.compat && Ar.flowIndentCheck(s.indent, f, i),
        (t.atKey = !1),
        Dc.mapIncludes(t, o.items, S) && i(w, "DUPLICATE_KEY", "Map keys must be unique"));
      let v = Or.resolveProps(p ?? [], {
        indicator: "map-value-ind",
        next: g,
        offset: S.range[2],
        onError: i,
        parentIndent: s.indent,
        startOnNewline: !f || f.type === "block-scalar",
      });
      if (((l = v.end), v.found)) {
        m &&
          (g?.type === "block-map" &&
            !v.hasNewline &&
            i(l, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"),
          t.options.strict &&
            d.start < v.found.offset - 1024 &&
            i(
              S.range,
              "KEY_OVER_1024_CHARS",
              "The : indicator must be at most 1024 chars after the start of an implicit block mapping key",
            ));
        let N = g ? n(t, g, v, i) : e(t, l, p, null, v, i);
        (t.schema.compat && Ar.flowIndentCheck(s.indent, g, i), (l = N.range[2]));
        let k = new Lr.Pair(S, N);
        (t.options.keepSourceTokens && (k.srcToken = h), o.items.push(k));
      } else {
        (m && i(S.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"),
          v.comment &&
            (S.comment
              ? (S.comment +=
                  `
` + v.comment)
              : (S.comment = v.comment)));
        let N = new Lr.Pair(S);
        (t.options.keepSourceTokens && (N.srcToken = h), o.items.push(N));
      }
    }
    return (
      c && c < l && i(c, "IMPOSSIBLE", "Map comment with trailing content"),
      (o.range = [s.offset, l, c ?? l]),
      o
    );
  }
  Er.resolveBlockMap = Uc;
});
var Cr = y((Mr) => {
  "use strict";
  var Rc = Z(),
    Yc = Ve(),
    Fc = rs();
  function Bc({ composeNode: n, composeEmptyNode: e }, t, s, i, r) {
    let a = r?.nodeClass ?? Rc.YAMLSeq,
      o = new a(t.schema);
    (t.atRoot && (t.atRoot = !1), t.atKey && (t.atKey = !1));
    let l = s.offset,
      c = null;
    for (let { start: h, value: u } of s.items) {
      let f = Yc.resolveProps(h, {
        indicator: "seq-item-ind",
        next: u,
        offset: l,
        onError: i,
        parentIndent: s.indent,
        startOnNewline: !0,
      });
      if (!f.found)
        if (f.anchor || f.tag || u)
          u?.type === "block-seq"
            ? i(f.end, "BAD_INDENT", "All sequence items must start at the same column")
            : i(l, "MISSING_CHAR", "Sequence item without - indicator");
        else {
          ((c = f.end), f.comment && (o.comment = f.comment));
          continue;
        }
      let p = u ? n(t, u, f, i) : e(t, f.end, h, null, f, i);
      (t.schema.compat && Fc.flowIndentCheck(s.indent, u, i), (l = p.range[2]), o.items.push(p));
    }
    return ((o.range = [s.offset, l, c ?? l]), o);
  }
  Mr.resolveBlockSeq = Bc;
});
var be = y((Pr) => {
  "use strict";
  function Kc(n, e, t, s) {
    let i = "";
    if (n) {
      let r = !1,
        a = "";
      for (let o of n) {
        let { source: l, type: c } = o;
        switch (c) {
          case "space":
            r = !0;
            break;
          case "comment": {
            t && !r && s(o, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            let h = l.substring(1) || " ";
            (i ? (i += a + h) : (i = h), (a = ""));
            break;
          }
          case "newline":
            (i && (a += l), (r = !0));
            break;
          default:
            s(o, "UNEXPECTED_TOKEN", `Unexpected ${c} at node end`);
        }
        e += l.length;
      }
    }
    return { comment: i, offset: e };
  }
  Pr.resolveEnd = Kc;
});
var Dr = y((jr) => {
  "use strict";
  var xc = L(),
    Vc = Q(),
    _r = X(),
    Gc = Z(),
    Jc = be(),
    $r = Ve(),
    Wc = Bt(),
    Hc = as(),
    os = "Block collections are not allowed within flow collections",
    ls = (n) => n && (n.type === "block-map" || n.type === "block-seq");
  function Qc({ composeNode: n, composeEmptyNode: e }, t, s, i, r) {
    let a = s.start.source === "{",
      o = a ? "flow map" : "flow sequence",
      l = r?.nodeClass ?? (a ? _r.YAMLMap : Gc.YAMLSeq),
      c = new l(t.schema);
    c.flow = !0;
    let h = t.atRoot;
    (h && (t.atRoot = !1), t.atKey && (t.atKey = !1));
    let u = s.offset + s.start.source.length;
    for (let m = 0; m < s.items.length; ++m) {
      let w = s.items[m],
        { start: S, key: v, sep: N, value: k } = w,
        I = $r.resolveProps(S, {
          flow: o,
          indicator: "explicit-key-ind",
          next: v ?? N?.[0],
          offset: u,
          onError: i,
          parentIndent: s.indent,
          startOnNewline: !1,
        });
      if (!I.found) {
        if (!I.anchor && !I.tag && !N && !k) {
          (m === 0 && I.comma
            ? i(I.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${o}`)
            : m < s.items.length - 1 && i(I.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${o}`),
            I.comment &&
              (c.comment
                ? (c.comment +=
                    `
` + I.comment)
                : (c.comment = I.comment)),
            (u = I.end));
          continue;
        }
        !a &&
          t.options.strict &&
          Wc.containsNewline(v) &&
          i(v, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
      }
      if (m === 0) I.comma && i(I.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${o}`);
      else if ((I.comma || i(I.start, "MISSING_CHAR", `Missing , between ${o} items`), I.comment)) {
        let A = "";
        e: for (let b of S)
          switch (b.type) {
            case "comma":
            case "space":
              break;
            case "comment":
              A = b.source.substring(1);
              break e;
            default:
              break e;
          }
        if (A) {
          let b = c.items[c.items.length - 1];
          (xc.isPair(b) && (b = b.value ?? b.key),
            b.comment
              ? (b.comment +=
                  `
` + A)
              : (b.comment = A),
            (I.comment = I.comment.substring(A.length + 1)));
        }
      }
      if (!a && !N && !I.found) {
        let A = k ? n(t, k, I, i) : e(t, I.end, N, null, I, i);
        (c.items.push(A), (u = A.range[2]), ls(k) && i(A.range, "BLOCK_IN_FLOW", os));
      } else {
        t.atKey = !0;
        let A = I.end,
          b = v ? n(t, v, I, i) : e(t, A, S, null, I, i);
        (ls(v) && i(b.range, "BLOCK_IN_FLOW", os), (t.atKey = !1));
        let T = $r.resolveProps(N ?? [], {
          flow: o,
          indicator: "map-value-ind",
          next: k,
          offset: b.range[2],
          onError: i,
          parentIndent: s.indent,
          startOnNewline: !1,
        });
        if (T.found) {
          if (!a && !I.found && t.options.strict) {
            if (N)
              for (let E of N) {
                if (E === T.found) break;
                if (E.type === "newline") {
                  i(E, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                  break;
                }
              }
            I.start < T.found.offset - 1024 &&
              i(
                T.found,
                "KEY_OVER_1024_CHARS",
                "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key",
              );
          }
        } else
          k &&
            ("source" in k && k.source?.[0] === ":"
              ? i(k, "MISSING_CHAR", `Missing space after : in ${o}`)
              : i(T.start, "MISSING_CHAR", `Missing , or : between ${o} items`));
        let B = k ? n(t, k, T, i) : T.found ? e(t, T.end, N, null, T, i) : null;
        B
          ? ls(k) && i(B.range, "BLOCK_IN_FLOW", os)
          : T.comment &&
            (b.comment
              ? (b.comment +=
                  `
` + T.comment)
              : (b.comment = T.comment));
        let $ = new Vc.Pair(b, B);
        if ((t.options.keepSourceTokens && ($.srcToken = w), a)) {
          let E = c;
          (Hc.mapIncludes(t, E.items, b) && i(A, "DUPLICATE_KEY", "Map keys must be unique"), E.items.push($));
        } else {
          let E = new _r.YAMLMap(t.schema);
          ((E.flow = !0), E.items.push($));
          let Se = (B ?? b).range;
          ((E.range = [b.range[0], Se[1], Se[2]]), c.items.push(E));
        }
        u = B ? B.range[2] : T.end;
      }
    }
    let f = a ? "}" : "]",
      [p, ...g] = s.end,
      d = u;
    if (p?.source === f) d = p.offset + p.source.length;
    else {
      let m = o[0].toUpperCase() + o.substring(1),
        w = h
          ? `${m} must end with a ${f}`
          : `${m} in block collection must be sufficiently indented and end with a ${f}`;
      (i(u, h ? "MISSING_CHAR" : "BAD_INDENT", w), p && p.source.length !== 1 && g.unshift(p));
    }
    if (g.length > 0) {
      let m = Jc.resolveEnd(g, d, t.options.strict, i);
      (m.comment &&
        (c.comment
          ? (c.comment +=
              `
` + m.comment)
          : (c.comment = m.comment)),
        (c.range = [s.offset, d, m.offset]));
    } else c.range = [s.offset, d, d];
    return c;
  }
  jr.resolveFlowCollection = Qc;
});
var Rr = y((Ur) => {
  "use strict";
  var zc = L(),
    Xc = q(),
    Zc = X(),
    eu = Z(),
    tu = qr(),
    nu = Cr(),
    su = Dr();
  function cs(n, e, t, s, i, r) {
    let a =
        t.type === "block-map"
          ? tu.resolveBlockMap(n, e, t, s, r)
          : t.type === "block-seq"
            ? nu.resolveBlockSeq(n, e, t, s, r)
            : su.resolveFlowCollection(n, e, t, s, r),
      o = a.constructor;
    return i === "!" || i === o.tagName ? ((a.tag = o.tagName), a) : (i && (a.tag = i), a);
  }
  function iu(n, e, t, s, i) {
    let r = s.tag,
      a = r ? e.directives.tagName(r.source, (f) => i(r, "TAG_RESOLVE_FAILED", f)) : null;
    if (t.type === "block-seq") {
      let { anchor: f, newlineAfterProp: p } = s,
        g = f && r ? (f.offset > r.offset ? f : r) : (f ?? r);
      g && (!p || p.offset < g.offset) && i(g, "MISSING_CHAR", "Missing newline after block sequence props");
    }
    let o = t.type === "block-map" ? "map" : t.type === "block-seq" ? "seq" : t.start.source === "{" ? "map" : "seq";
    if (!r || !a || a === "!" || (a === Zc.YAMLMap.tagName && o === "map") || (a === eu.YAMLSeq.tagName && o === "seq"))
      return cs(n, e, t, i, a);
    let l = e.schema.tags.find((f) => f.tag === a && f.collection === o);
    if (!l) {
      let f = e.schema.knownTags[a];
      if (f?.collection === o) (e.schema.tags.push(Object.assign({}, f, { default: !1 })), (l = f));
      else
        return (
          f
            ? i(
                r,
                "BAD_COLLECTION_TYPE",
                `${f.tag} used for ${o} collection, but expects ${f.collection ?? "scalar"}`,
                !0,
              )
            : i(r, "TAG_RESOLVE_FAILED", `Unresolved tag: ${a}`, !0),
          cs(n, e, t, i, a)
        );
    }
    let c = cs(n, e, t, i, a, l),
      h = l.resolve?.(c, (f) => i(r, "TAG_RESOLVE_FAILED", f), e.options) ?? c,
      u = zc.isNode(h) ? h : new Xc.Scalar(h);
    return ((u.range = c.range), (u.tag = a), l?.format && (u.format = l.format), u);
  }
  Ur.composeCollection = iu;
});
var fs = y((Yr) => {
  "use strict";
  var us = q();
  function ru(n, e, t) {
    let s = e.offset,
      i = au(e, n.options.strict, t);
    if (!i) return { value: "", type: null, comment: "", range: [s, s, s] };
    let r = i.mode === ">" ? us.Scalar.BLOCK_FOLDED : us.Scalar.BLOCK_LITERAL,
      a = e.source ? ou(e.source) : [],
      o = a.length;
    for (let d = a.length - 1; d >= 0; --d) {
      let m = a[d][1];
      if (m === "" || m === "\r") o = d;
      else break;
    }
    if (o === 0) {
      let d =
          i.chomp === "+" && a.length > 0
            ? `
`.repeat(Math.max(1, a.length - 1))
            : "",
        m = s + i.length;
      return (e.source && (m += e.source.length), { value: d, type: r, comment: i.comment, range: [s, m, m] });
    }
    let l = e.indent + i.indent,
      c = e.offset + i.length,
      h = 0;
    for (let d = 0; d < o; ++d) {
      let [m, w] = a[d];
      if (w === "" || w === "\r") i.indent === 0 && m.length > l && (l = m.length);
      else {
        (m.length < l &&
          t(
            c + m.length,
            "MISSING_CHAR",
            "Block scalars with more-indented leading empty lines must use an explicit indentation indicator",
          ),
          i.indent === 0 && (l = m.length),
          (h = d),
          l === 0 && !n.atRoot && t(c, "BAD_INDENT", "Block scalar values in collections must be indented"));
        break;
      }
      c += m.length + w.length + 1;
    }
    for (let d = a.length - 1; d >= o; --d) a[d][0].length > l && (o = d + 1);
    let u = "",
      f = "",
      p = !1;
    for (let d = 0; d < h; ++d)
      u +=
        a[d][0].slice(l) +
        `
`;
    for (let d = h; d < o; ++d) {
      let [m, w] = a[d];
      c += m.length + w.length + 1;
      let S = w[w.length - 1] === "\r";
      if ((S && (w = w.slice(0, -1)), w && m.length < l)) {
        let N = `Block scalar lines must not be less indented than their ${i.indent ? "explicit indentation indicator" : "first line"}`;
        (t(c - w.length - (S ? 2 : 1), "BAD_INDENT", N), (m = ""));
      }
      r === us.Scalar.BLOCK_LITERAL
        ? ((u += f + m.slice(l) + w),
          (f = `
`))
        : m.length > l || w[0] === "	"
          ? (f === " "
              ? (f = `
`)
              : !p &&
                f ===
                  `
` &&
                (f = `

`),
            (u += f + m.slice(l) + w),
            (f = `
`),
            (p = !0))
          : w === ""
            ? f ===
              `
`
              ? (u += `
`)
              : (f = `
`)
            : ((u += f + w), (f = " "), (p = !1));
    }
    switch (i.chomp) {
      case "-":
        break;
      case "+":
        for (let d = o; d < a.length; ++d)
          u +=
            `
` + a[d][0].slice(l);
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
    let g = s + i.length + e.source.length;
    return { value: u, type: r, comment: i.comment, range: [s, g, g] };
  }
  function au({ offset: n, props: e }, t, s) {
    if (e[0].type !== "block-scalar-header") return (s(e[0], "IMPOSSIBLE", "Block scalar header not found"), null);
    let { source: i } = e[0],
      r = i[0],
      a = 0,
      o = "",
      l = -1;
    for (let f = 1; f < i.length; ++f) {
      let p = i[f];
      if (!o && (p === "-" || p === "+")) o = p;
      else {
        let g = Number(p);
        !a && g ? (a = g) : l === -1 && (l = n + f);
      }
    }
    l !== -1 && s(l, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${i}`);
    let c = !1,
      h = "",
      u = i.length;
    for (let f = 1; f < e.length; ++f) {
      let p = e[f];
      switch (p.type) {
        case "space":
          c = !0;
        case "newline":
          u += p.source.length;
          break;
        case "comment":
          (t && !c && s(p, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"),
            (u += p.source.length),
            (h = p.source.substring(1)));
          break;
        case "error":
          (s(p, "UNEXPECTED_TOKEN", p.message), (u += p.source.length));
          break;
        default: {
          let g = `Unexpected token in block scalar header: ${p.type}`;
          s(p, "UNEXPECTED_TOKEN", g);
          let d = p.source;
          d && typeof d == "string" && (u += d.length);
        }
      }
    }
    return { mode: r, indent: a, chomp: o, comment: h, length: u };
  }
  function ou(n) {
    let e = n.split(/\n( *)/),
      t = e[0],
      s = t.match(/^( *)/),
      r = [s?.[1] ? [s[1], t.slice(s[1].length)] : ["", t]];
    for (let a = 1; a < e.length; a += 2) r.push([e[a], e[a + 1]]);
    return r;
  }
  Yr.resolveBlockScalar = ru;
});
var hs = y((Br) => {
  "use strict";
  var ds = q(),
    lu = be();
  function cu(n, e, t) {
    let { offset: s, type: i, source: r, end: a } = n,
      o,
      l,
      c = (f, p, g) => t(s + f, p, g);
    switch (i) {
      case "scalar":
        ((o = ds.Scalar.PLAIN), (l = uu(r, c)));
        break;
      case "single-quoted-scalar":
        ((o = ds.Scalar.QUOTE_SINGLE), (l = fu(r, c)));
        break;
      case "double-quoted-scalar":
        ((o = ds.Scalar.QUOTE_DOUBLE), (l = du(r, c)));
        break;
      default:
        return (
          t(n, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${i}`),
          { value: "", type: null, comment: "", range: [s, s + r.length, s + r.length] }
        );
    }
    let h = s + r.length,
      u = lu.resolveEnd(a, h, e, t);
    return { value: l, type: o, comment: u.comment, range: [s, h, u.offset] };
  }
  function uu(n, e) {
    let t = "";
    switch (n[0]) {
      case "	":
        t = "a tab character";
        break;
      case ",":
        t = "flow indicator character ,";
        break;
      case "%":
        t = "directive indicator character %";
        break;
      case "|":
      case ">": {
        t = `block scalar indicator ${n[0]}`;
        break;
      }
      case "@":
      case "`": {
        t = `reserved character ${n[0]}`;
        break;
      }
    }
    return (t && e(0, "BAD_SCALAR_START", `Plain value cannot start with ${t}`), Fr(n));
  }
  function fu(n, e) {
    return (
      (n[n.length - 1] !== "'" || n.length === 1) && e(n.length, "MISSING_CHAR", "Missing closing 'quote"),
      Fr(n.slice(1, -1)).replace(/''/g, "'")
    );
  }
  function Fr(n) {
    let e, t;
    try {
      ((e = new RegExp(
        `(.*?)(?<![ 	])[ 	]*\r?
`,
        "sy",
      )),
        (t = new RegExp(
          `[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`,
          "sy",
        )));
    } catch {
      ((e = /(.*?)[ \t]*\r?\n/sy), (t = /[ \t]*(.*?)[ \t]*\r?\n/sy));
    }
    let s = e.exec(n);
    if (!s) return n;
    let i = s[1],
      r = " ",
      a = e.lastIndex;
    for (t.lastIndex = a; (s = t.exec(n));)
      (s[1] === ""
        ? r ===
          `
`
          ? (i += r)
          : (r = `
`)
        : ((i += r + s[1]), (r = " ")),
        (a = t.lastIndex));
    let o = /[ \t]*(.*)/sy;
    return ((o.lastIndex = a), (s = o.exec(n)), i + r + (s?.[1] ?? ""));
  }
  function du(n, e) {
    let t = "";
    for (let s = 1; s < n.length - 1; ++s) {
      let i = n[s];
      if (!(
        i === "\r" &&
        n[s + 1] ===
          `
`
      ))
        if (
          i ===
          `
`
        ) {
          let { fold: r, offset: a } = hu(n, s);
          ((t += r), (s = a));
        } else if (i === "\\") {
          let r = n[++s],
            a = mu[r];
          if (a) t += a;
          else if (
            r ===
            `
`
          )
            for (r = n[s + 1]; r === " " || r === "	";) r = n[++s + 1];
          else if (
            r === "\r" &&
            n[s + 1] ===
              `
`
          )
            for (r = n[++s + 1]; r === " " || r === "	";) r = n[++s + 1];
          else if (r === "x" || r === "u" || r === "U") {
            let o = r === "x" ? 2 : r === "u" ? 4 : 8;
            ((t += pu(n, s + 1, o, e)), (s += o));
          } else {
            let o = n.substr(s - 1, 2);
            (e(s - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${o}`), (t += o));
          }
        } else if (i === " " || i === "	") {
          let r = s,
            a = n[s + 1];
          for (; a === " " || a === "	";) a = n[++s + 1];
          a !==
            `
` &&
            !(
              a === "\r" &&
              n[s + 2] ===
                `
`
            ) &&
            (t += s > r ? n.slice(r, s + 1) : i);
        } else t += i;
    }
    return ((n[n.length - 1] !== '"' || n.length === 1) && e(n.length, "MISSING_CHAR", 'Missing closing "quote'), t);
  }
  function hu(n, e) {
    let t = "",
      s = n[e + 1];
    for (
      ;
      (s === " " ||
        s === "	" ||
        s ===
          `
` ||
        s === "\r") &&
      !(
        s === "\r" &&
        n[e + 2] !==
          `
`
      );
    )
      (s ===
        `
` &&
        (t += `
`),
        (e += 1),
        (s = n[e + 1]));
    return (t || (t = " "), { fold: t, offset: e });
  }
  var mu = {
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
  function pu(n, e, t, s) {
    let i = n.substr(e, t),
      a = i.length === t && /^[0-9a-fA-F]+$/.test(i) ? parseInt(i, 16) : NaN;
    try {
      return String.fromCodePoint(a);
    } catch {
      let o = n.substr(e - 2, t + 2);
      return (s(e - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${o}`), o);
    }
  }
  Br.resolveFlowScalar = cu;
});
var Vr = y((xr) => {
  "use strict";
  var ae = L(),
    Kr = q(),
    gu = fs(),
    yu = hs();
  function bu(n, e, t, s) {
    let {
        value: i,
        type: r,
        comment: a,
        range: o,
      } = e.type === "block-scalar" ? gu.resolveBlockScalar(n, e, s) : yu.resolveFlowScalar(e, n.options.strict, s),
      l = t ? n.directives.tagName(t.source, (u) => s(t, "TAG_RESOLVE_FAILED", u)) : null,
      c;
    n.options.stringKeys && n.atKey
      ? (c = n.schema[ae.SCALAR])
      : l
        ? (c = wu(n.schema, i, l, t, s))
        : e.type === "scalar"
          ? (c = Su(n, i, e, s))
          : (c = n.schema[ae.SCALAR]);
    let h;
    try {
      let u = c.resolve(i, (f) => s(t ?? e, "TAG_RESOLVE_FAILED", f), n.options);
      h = ae.isScalar(u) ? u : new Kr.Scalar(u);
    } catch (u) {
      let f = u instanceof Error ? u.message : String(u);
      (s(t ?? e, "TAG_RESOLVE_FAILED", f), (h = new Kr.Scalar(i)));
    }
    return (
      (h.range = o),
      (h.source = i),
      r && (h.type = r),
      l && (h.tag = l),
      c.format && (h.format = c.format),
      a && (h.comment = a),
      h
    );
  }
  function wu(n, e, t, s, i) {
    if (t === "!") return n[ae.SCALAR];
    let r = [];
    for (let o of n.tags)
      if (!o.collection && o.tag === t)
        if (o.default && o.test) r.push(o);
        else return o;
    for (let o of r) if (o.test?.test(e)) return o;
    let a = n.knownTags[t];
    return a && !a.collection
      ? (n.tags.push(Object.assign({}, a, { default: !1, test: void 0 })), a)
      : (i(s, "TAG_RESOLVE_FAILED", `Unresolved tag: ${t}`, t !== "tag:yaml.org,2002:str"), n[ae.SCALAR]);
  }
  function Su({ atKey: n, directives: e, schema: t }, s, i, r) {
    let a = t.tags.find((o) => (o.default === !0 || (n && o.default === "key")) && o.test?.test(s)) || t[ae.SCALAR];
    if (t.compat) {
      let o = t.compat.find((l) => l.default && l.test?.test(s)) ?? t[ae.SCALAR];
      if (a.tag !== o.tag) {
        let l = e.tagString(a.tag),
          c = e.tagString(o.tag),
          h = `Value may be parsed as either ${l} or ${c}`;
        r(i, "TAG_RESOLVE_FAILED", h, !0);
      }
    }
    return a;
  }
  xr.composeScalar = bu;
});
var Jr = y((Gr) => {
  "use strict";
  function vu(n, e, t) {
    if (e) {
      t ?? (t = e.length);
      for (let s = t - 1; s >= 0; --s) {
        let i = e[s];
        switch (i.type) {
          case "space":
          case "comment":
          case "newline":
            n -= i.source.length;
            continue;
        }
        for (i = e[++s]; i?.type === "space";) ((n += i.source.length), (i = e[++s]));
        break;
      }
    }
    return n;
  }
  Gr.emptyScalarPosition = vu;
});
var Qr = y((ps) => {
  "use strict";
  var Iu = Le(),
    ku = L(),
    Nu = Rr(),
    Wr = Vr(),
    Lu = be(),
    Ou = Jr(),
    Au = { composeNode: Hr, composeEmptyNode: ms };
  function Hr(n, e, t, s) {
    let i = n.atKey,
      { spaceBefore: r, comment: a, anchor: o, tag: l } = t,
      c,
      h = !0;
    switch (e.type) {
      case "alias":
        ((c = Tu(n, e, s)), (o || l) && s(e, "ALIAS_PROPS", "An alias node must not specify any properties"));
        break;
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "block-scalar":
        ((c = Wr.composeScalar(n, e, l, s)), o && (c.anchor = o.source.substring(1)));
        break;
      case "block-map":
      case "block-seq":
      case "flow-collection":
        try {
          ((c = Nu.composeCollection(Au, n, e, t, s)), o && (c.anchor = o.source.substring(1)));
        } catch (u) {
          let f = u instanceof Error ? u.message : String(u);
          s(e, "RESOURCE_EXHAUSTION", f);
        }
        break;
      default: {
        let u = e.type === "error" ? e.message : `Unsupported token (type: ${e.type})`;
        (s(e, "UNEXPECTED_TOKEN", u), (h = !1));
      }
    }
    return (
      c ?? (c = ms(n, e.offset, void 0, null, t, s)),
      o && c.anchor === "" && s(o, "BAD_ALIAS", "Anchor cannot be an empty string"),
      i &&
        n.options.stringKeys &&
        (!ku.isScalar(c) || typeof c.value != "string" || (c.tag && c.tag !== "tag:yaml.org,2002:str")) &&
        s(l ?? e, "NON_STRING_KEY", "With stringKeys, all keys must be strings"),
      r && (c.spaceBefore = !0),
      a && (e.type === "scalar" && e.source === "" ? (c.comment = a) : (c.commentBefore = a)),
      n.options.keepSourceTokens && h && (c.srcToken = e),
      c
    );
  }
  function ms(n, e, t, s, { spaceBefore: i, comment: r, anchor: a, tag: o, end: l }, c) {
    let h = { type: "scalar", offset: Ou.emptyScalarPosition(e, t, s), indent: -1, source: "" },
      u = Wr.composeScalar(n, h, o, c);
    return (
      a &&
        ((u.anchor = a.source.substring(1)), u.anchor === "" && c(a, "BAD_ALIAS", "Anchor cannot be an empty string")),
      i && (u.spaceBefore = !0),
      r && ((u.comment = r), (u.range[2] = l)),
      u
    );
  }
  function Tu({ options: n }, { offset: e, source: t, end: s }, i) {
    let r = new Iu.Alias(t.substring(1));
    (r.source === "" && i(e, "BAD_ALIAS", "Alias cannot be an empty string"),
      r.source.endsWith(":") && i(e + t.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0));
    let a = e + t.length,
      o = Lu.resolveEnd(s, a, n.strict, i);
    return ((r.range = [e, a, o.offset]), o.comment && (r.comment = o.comment), r);
  }
  ps.composeEmptyNode = ms;
  ps.composeNode = Hr;
});
var Zr = y((Xr) => {
  "use strict";
  var Eu = Fe(),
    zr = Qr(),
    qu = be(),
    Mu = Ve();
  function Cu(n, e, { offset: t, start: s, value: i, end: r }, a) {
    let o = Object.assign({ _directives: e }, n),
      l = new Eu.Document(void 0, o),
      c = { atKey: !1, atRoot: !0, directives: l.directives, options: l.options, schema: l.schema },
      h = Mu.resolveProps(s, {
        indicator: "doc-start",
        next: i ?? r?.[0],
        offset: t,
        onError: a,
        parentIndent: 0,
        startOnNewline: !0,
      });
    (h.found &&
      ((l.directives.docStart = !0),
      i &&
        (i.type === "block-map" || i.type === "block-seq") &&
        !h.hasNewline &&
        a(h.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")),
      (l.contents = i ? zr.composeNode(c, i, h, a) : zr.composeEmptyNode(c, h.end, s, null, h, a)));
    let u = l.contents.range[2],
      f = qu.resolveEnd(r, u, !1, a);
    return (f.comment && (l.comment = f.comment), (l.range = [t, u, f.offset]), l);
  }
  Xr.composeDoc = Cu;
});
var ys = y((na) => {
  "use strict";
  var Pu = Xe("process"),
    _u = tn(),
    $u = Fe(),
    Ge = xe(),
    ea = L(),
    ju = Zr(),
    Du = be();
  function Je(n) {
    if (typeof n == "number") return [n, n + 1];
    if (Array.isArray(n)) return n.length === 2 ? n : [n[0], n[1]];
    let { offset: e, source: t } = n;
    return [e, e + (typeof t == "string" ? t.length : 1)];
  }
  function ta(n) {
    let e = "",
      t = !1,
      s = !1;
    for (let i = 0; i < n.length; ++i) {
      let r = n[i];
      switch (r[0]) {
        case "#":
          ((e +=
            (e === ""
              ? ""
              : s
                ? `

`
                : `
`) + (r.substring(1) || " ")),
            (t = !0),
            (s = !1));
          break;
        case "%":
          (n[i + 1]?.[0] !== "#" && (i += 1), (t = !1));
          break;
        default:
          (t || (s = !0), (t = !1));
      }
    }
    return { comment: e, afterEmptyLine: s };
  }
  var gs = class {
    constructor(e = {}) {
      ((this.doc = null),
        (this.atDirectives = !1),
        (this.prelude = []),
        (this.errors = []),
        (this.warnings = []),
        (this.onError = (t, s, i, r) => {
          let a = Je(t);
          r ? this.warnings.push(new Ge.YAMLWarning(a, s, i)) : this.errors.push(new Ge.YAMLParseError(a, s, i));
        }),
        (this.directives = new _u.Directives({ version: e.version || "1.2" })),
        (this.options = e));
    }
    decorate(e, t) {
      let { comment: s, afterEmptyLine: i } = ta(this.prelude);
      if (s) {
        let r = e.contents;
        if (t)
          e.comment = e.comment
            ? `${e.comment}
${s}`
            : s;
        else if (i || e.directives.docStart || !r) e.commentBefore = s;
        else if (ea.isCollection(r) && !r.flow && r.items.length > 0) {
          let a = r.items[0];
          ea.isPair(a) && (a = a.key);
          let o = a.commentBefore;
          a.commentBefore = o
            ? `${s}
${o}`
            : s;
        } else {
          let a = r.commentBefore;
          r.commentBefore = a
            ? `${s}
${a}`
            : s;
        }
      }
      if (t) {
        for (let r = 0; r < this.errors.length; ++r) e.errors.push(this.errors[r]);
        for (let r = 0; r < this.warnings.length; ++r) e.warnings.push(this.warnings[r]);
      } else ((e.errors = this.errors), (e.warnings = this.warnings));
      ((this.prelude = []), (this.errors = []), (this.warnings = []));
    }
    streamInfo() {
      return {
        comment: ta(this.prelude).comment,
        directives: this.directives,
        errors: this.errors,
        warnings: this.warnings,
      };
    }
    *compose(e, t = !1, s = -1) {
      for (let i of e) yield* this.next(i);
      yield* this.end(t, s);
    }
    *next(e) {
      switch ((Pu.env.LOG_STREAM && console.dir(e, { depth: null }), e.type)) {
        case "directive":
          (this.directives.add(e.source, (t, s, i) => {
            let r = Je(e);
            ((r[0] += t), this.onError(r, "BAD_DIRECTIVE", s, i));
          }),
            this.prelude.push(e.source),
            (this.atDirectives = !0));
          break;
        case "document": {
          let t = ju.composeDoc(this.options, this.directives, e, this.onError);
          (this.atDirectives &&
            !t.directives.docStart &&
            this.onError(e, "MISSING_CHAR", "Missing directives-end/doc-start indicator line"),
            this.decorate(t, !1),
            this.doc && (yield this.doc),
            (this.doc = t),
            (this.atDirectives = !1));
          break;
        }
        case "byte-order-mark":
        case "space":
          break;
        case "comment":
        case "newline":
          this.prelude.push(e.source);
          break;
        case "error": {
          let t = e.source ? `${e.message}: ${JSON.stringify(e.source)}` : e.message,
            s = new Ge.YAMLParseError(Je(e), "UNEXPECTED_TOKEN", t);
          this.atDirectives || !this.doc ? this.errors.push(s) : this.doc.errors.push(s);
          break;
        }
        case "doc-end": {
          if (!this.doc) {
            let s = "Unexpected doc-end without preceding document";
            this.errors.push(new Ge.YAMLParseError(Je(e), "UNEXPECTED_TOKEN", s));
            break;
          }
          this.doc.directives.docEnd = !0;
          let t = Du.resolveEnd(e.end, e.offset + e.source.length, this.doc.options.strict, this.onError);
          if ((this.decorate(this.doc, !0), t.comment)) {
            let s = this.doc.comment;
            this.doc.comment = s
              ? `${s}
${t.comment}`
              : t.comment;
          }
          this.doc.range[2] = t.offset;
          break;
        }
        default:
          this.errors.push(new Ge.YAMLParseError(Je(e), "UNEXPECTED_TOKEN", `Unsupported token ${e.type}`));
      }
    }
    *end(e = !1, t = -1) {
      if (this.doc) (this.decorate(this.doc, !0), yield this.doc, (this.doc = null));
      else if (e) {
        let s = Object.assign({ _directives: this.directives }, this.options),
          i = new $u.Document(void 0, s);
        (this.atDirectives && this.onError(t, "MISSING_CHAR", "Missing directives-end indicator line"),
          (i.range = [0, t, t]),
          this.decorate(i, !1),
          yield i);
      }
    }
  };
  na.Composer = gs;
});
var ra = y((Kt) => {
  "use strict";
  var Uu = fs(),
    Ru = hs(),
    Yu = xe(),
    sa = qe();
  function Fu(n, e = !0, t) {
    if (n) {
      let s = (i, r, a) => {
        let o = typeof i == "number" ? i : Array.isArray(i) ? i[0] : i.offset;
        if (t) t(o, r, a);
        else throw new Yu.YAMLParseError([o, o + 1], r, a);
      };
      switch (n.type) {
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return Ru.resolveFlowScalar(n, e, s);
        case "block-scalar":
          return Uu.resolveBlockScalar({ options: { strict: e } }, n, s);
      }
    }
    return null;
  }
  function Bu(n, e) {
    let { implicitKey: t = !1, indent: s, inFlow: i = !1, offset: r = -1, type: a = "PLAIN" } = e,
      o = sa.stringifyString(
        { type: a, value: n },
        { implicitKey: t, indent: s > 0 ? " ".repeat(s) : "", inFlow: i, options: { blockQuote: !0, lineWidth: -1 } },
      ),
      l = e.end ?? [
        {
          type: "newline",
          offset: -1,
          indent: s,
          source: `
`,
        },
      ];
    switch (o[0]) {
      case "|":
      case ">": {
        let c = o.indexOf(`
`),
          h = o.substring(0, c),
          u =
            o.substring(c + 1) +
            `
`,
          f = [{ type: "block-scalar-header", offset: r, indent: s, source: h }];
        return (
          ia(f, l) ||
            f.push({
              type: "newline",
              offset: -1,
              indent: s,
              source: `
`,
            }),
          { type: "block-scalar", offset: r, indent: s, props: f, source: u }
        );
      }
      case '"':
        return { type: "double-quoted-scalar", offset: r, indent: s, source: o, end: l };
      case "'":
        return { type: "single-quoted-scalar", offset: r, indent: s, source: o, end: l };
      default:
        return { type: "scalar", offset: r, indent: s, source: o, end: l };
    }
  }
  function Ku(n, e, t = {}) {
    let { afterKey: s = !1, implicitKey: i = !1, inFlow: r = !1, type: a } = t,
      o = "indent" in n ? n.indent : null;
    if ((s && typeof o == "number" && (o += 2), !a))
      switch (n.type) {
        case "single-quoted-scalar":
          a = "QUOTE_SINGLE";
          break;
        case "double-quoted-scalar":
          a = "QUOTE_DOUBLE";
          break;
        case "block-scalar": {
          let c = n.props[0];
          if (c.type !== "block-scalar-header") throw new Error("Invalid block scalar header");
          a = c.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
          break;
        }
        default:
          a = "PLAIN";
      }
    let l = sa.stringifyString(
      { type: a, value: e },
      {
        implicitKey: i || o === null,
        indent: o !== null && o > 0 ? " ".repeat(o) : "",
        inFlow: r,
        options: { blockQuote: !0, lineWidth: -1 },
      },
    );
    switch (l[0]) {
      case "|":
      case ">":
        xu(n, l);
        break;
      case '"':
        bs(n, l, "double-quoted-scalar");
        break;
      case "'":
        bs(n, l, "single-quoted-scalar");
        break;
      default:
        bs(n, l, "scalar");
    }
  }
  function xu(n, e) {
    let t = e.indexOf(`
`),
      s = e.substring(0, t),
      i =
        e.substring(t + 1) +
        `
`;
    if (n.type === "block-scalar") {
      let r = n.props[0];
      if (r.type !== "block-scalar-header") throw new Error("Invalid block scalar header");
      ((r.source = s), (n.source = i));
    } else {
      let { offset: r } = n,
        a = "indent" in n ? n.indent : -1,
        o = [{ type: "block-scalar-header", offset: r, indent: a, source: s }];
      ia(o, "end" in n ? n.end : void 0) ||
        o.push({
          type: "newline",
          offset: -1,
          indent: a,
          source: `
`,
        });
      for (let l of Object.keys(n)) l !== "type" && l !== "offset" && delete n[l];
      Object.assign(n, { type: "block-scalar", indent: a, props: o, source: i });
    }
  }
  function ia(n, e) {
    if (e)
      for (let t of e)
        switch (t.type) {
          case "space":
          case "comment":
            n.push(t);
            break;
          case "newline":
            return (n.push(t), !0);
        }
    return !1;
  }
  function bs(n, e, t) {
    switch (n.type) {
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        ((n.type = t), (n.source = e));
        break;
      case "block-scalar": {
        let s = n.props.slice(1),
          i = e.length;
        n.props[0].type === "block-scalar-header" && (i -= n.props[0].source.length);
        for (let r of s) r.offset += i;
        (delete n.props, Object.assign(n, { type: t, source: e, end: s }));
        break;
      }
      case "block-map":
      case "block-seq": {
        let i = {
          type: "newline",
          offset: n.offset + e.length,
          indent: n.indent,
          source: `
`,
        };
        (delete n.items, Object.assign(n, { type: t, source: e, end: [i] }));
        break;
      }
      default: {
        let s = "indent" in n ? n.indent : -1,
          i =
            "end" in n && Array.isArray(n.end)
              ? n.end.filter((r) => r.type === "space" || r.type === "comment" || r.type === "newline")
              : [];
        for (let r of Object.keys(n)) r !== "type" && r !== "offset" && delete n[r];
        Object.assign(n, { type: t, indent: s, source: e, end: i });
      }
    }
  }
  Kt.createScalarToken = Bu;
  Kt.resolveAsScalar = Fu;
  Kt.setScalarValue = Ku;
});
var oa = y((aa) => {
  "use strict";
  var Vu = (n) => ("type" in n ? Vt(n) : xt(n));
  function Vt(n) {
    switch (n.type) {
      case "block-scalar": {
        let e = "";
        for (let t of n.props) e += Vt(t);
        return e + n.source;
      }
      case "block-map":
      case "block-seq": {
        let e = "";
        for (let t of n.items) e += xt(t);
        return e;
      }
      case "flow-collection": {
        let e = n.start.source;
        for (let t of n.items) e += xt(t);
        for (let t of n.end) e += t.source;
        return e;
      }
      case "document": {
        let e = xt(n);
        if (n.end) for (let t of n.end) e += t.source;
        return e;
      }
      default: {
        let e = n.source;
        if ("end" in n && n.end) for (let t of n.end) e += t.source;
        return e;
      }
    }
  }
  function xt({ start: n, key: e, sep: t, value: s }) {
    let i = "";
    for (let r of n) i += r.source;
    if ((e && (i += Vt(e)), t)) for (let r of t) i += r.source;
    return (s && (i += Vt(s)), i);
  }
  aa.stringify = Vu;
});
var fa = y((ua) => {
  "use strict";
  var ws = Symbol("break visit"),
    Gu = Symbol("skip children"),
    la = Symbol("remove item");
  function oe(n, e) {
    ("type" in n && n.type === "document" && (n = { start: n.start, value: n.value }), ca(Object.freeze([]), n, e));
  }
  oe.BREAK = ws;
  oe.SKIP = Gu;
  oe.REMOVE = la;
  oe.itemAtPath = (n, e) => {
    let t = n;
    for (let [s, i] of e) {
      let r = t?.[s];
      if (r && "items" in r) t = r.items[i];
      else return;
    }
    return t;
  };
  oe.parentCollection = (n, e) => {
    let t = oe.itemAtPath(n, e.slice(0, -1)),
      s = e[e.length - 1][0],
      i = t?.[s];
    if (i && "items" in i) return i;
    throw new Error("Parent collection not found");
  };
  function ca(n, e, t) {
    let s = t(e, n);
    if (typeof s == "symbol") return s;
    for (let i of ["key", "value"]) {
      let r = e[i];
      if (r && "items" in r) {
        for (let a = 0; a < r.items.length; ++a) {
          let o = ca(Object.freeze(n.concat([[i, a]])), r.items[a], t);
          if (typeof o == "number") a = o - 1;
          else {
            if (o === ws) return ws;
            o === la && (r.items.splice(a, 1), (a -= 1));
          }
        }
        typeof s == "function" && i === "key" && (s = s(e, n));
      }
    }
    return typeof s == "function" ? s(e, n) : s;
  }
  ua.visit = oe;
});
var Gt = y((_) => {
  "use strict";
  var Ss = ra(),
    Ju = oa(),
    Wu = fa(),
    vs = "\uFEFF",
    Is = "",
    ks = "",
    Ns = "",
    Hu = (n) => !!n && "items" in n,
    Qu = (n) =>
      !!n &&
      (n.type === "scalar" ||
        n.type === "single-quoted-scalar" ||
        n.type === "double-quoted-scalar" ||
        n.type === "block-scalar");
  function zu(n) {
    switch (n) {
      case vs:
        return "<BOM>";
      case Is:
        return "<DOC>";
      case ks:
        return "<FLOW_END>";
      case Ns:
        return "<SCALAR>";
      default:
        return JSON.stringify(n);
    }
  }
  function Xu(n) {
    switch (n) {
      case vs:
        return "byte-order-mark";
      case Is:
        return "doc-mode";
      case ks:
        return "flow-error-end";
      case Ns:
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
    switch (n[0]) {
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
  _.createScalarToken = Ss.createScalarToken;
  _.resolveAsScalar = Ss.resolveAsScalar;
  _.setScalarValue = Ss.setScalarValue;
  _.stringify = Ju.stringify;
  _.visit = Wu.visit;
  _.BOM = vs;
  _.DOCUMENT = Is;
  _.FLOW_END = ks;
  _.SCALAR = Ns;
  _.isCollection = Hu;
  _.isScalar = Qu;
  _.prettyToken = zu;
  _.tokenType = Xu;
});
var As = y((ha) => {
  "use strict";
  var We = Gt();
  function R(n) {
    switch (n) {
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
  var da = new Set("0123456789ABCDEFabcdef"),
    Zu = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"),
    Jt = new Set(",[]{}"),
    ef = new Set(` ,[]{}
\r	`),
    Ls = (n) => !n || ef.has(n),
    Os = class {
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
      *lex(e, t = !1) {
        if (e) {
          if (typeof e != "string") throw TypeError("source is not a string");
          ((this.buffer = this.buffer ? this.buffer + e : e), (this.lineEndPos = null));
        }
        this.atEnd = !t;
        let s = this.next ?? "stream";
        for (; s && (t || this.hasChars(1));) s = yield* this.parseNext(s);
      }
      atLineEnd() {
        let e = this.pos,
          t = this.buffer[e];
        for (; t === " " || t === "	";) t = this.buffer[++e];
        return !t ||
          t === "#" ||
          t ===
            `
`
          ? !0
          : t === "\r"
            ? this.buffer[e + 1] ===
              `
`
            : !1;
      }
      charAt(e) {
        return this.buffer[this.pos + e];
      }
      continueScalar(e) {
        let t = this.buffer[e];
        if (this.indentNext > 0) {
          let s = 0;
          for (; t === " ";) t = this.buffer[++s + e];
          if (t === "\r") {
            let i = this.buffer[s + e + 1];
            if (
              i ===
                `
` ||
              (!i && !this.atEnd)
            )
              return e + s + 1;
          }
          return t ===
            `
` ||
            s >= this.indentNext ||
            (!t && !this.atEnd)
            ? e + s
            : -1;
        }
        if (t === "-" || t === ".") {
          let s = this.buffer.substr(e, 3);
          if ((s === "---" || s === "...") && R(this.buffer[e + 3])) return -1;
        }
        return e;
      }
      getLine() {
        let e = this.lineEndPos;
        return (
          (typeof e != "number" || (e !== -1 && e < this.pos)) &&
            ((e = this.buffer.indexOf(
              `
`,
              this.pos,
            )),
            (this.lineEndPos = e)),
          e === -1
            ? this.atEnd
              ? this.buffer.substring(this.pos)
              : null
            : (this.buffer[e - 1] === "\r" && (e -= 1), this.buffer.substring(this.pos, e))
        );
      }
      hasChars(e) {
        return this.pos + e <= this.buffer.length;
      }
      setNext(e) {
        return (
          (this.buffer = this.buffer.substring(this.pos)),
          (this.pos = 0),
          (this.lineEndPos = null),
          (this.next = e),
          null
        );
      }
      peek(e) {
        return this.buffer.substr(this.pos, e);
      }
      *parseNext(e) {
        switch (e) {
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
        let e = this.getLine();
        if (e === null) return this.setNext("stream");
        if ((e[0] === We.BOM && (yield* this.pushCount(1), (e = e.substring(1))), e[0] === "%")) {
          let t = e.length,
            s = e.indexOf("#");
          for (; s !== -1;) {
            let r = e[s - 1];
            if (r === " " || r === "	") {
              t = s - 1;
              break;
            } else s = e.indexOf("#", s + 1);
          }
          for (;;) {
            let r = e[t - 1];
            if (r === " " || r === "	") t -= 1;
            else break;
          }
          let i = (yield* this.pushCount(t)) + (yield* this.pushSpaces(!0));
          return (yield* this.pushCount(e.length - i), this.pushNewline(), "stream");
        }
        if (this.atLineEnd()) {
          let t = yield* this.pushSpaces(!0);
          return (yield* this.pushCount(e.length - t), yield* this.pushNewline(), "stream");
        }
        return (yield We.DOCUMENT, yield* this.parseLineStart());
      }
      *parseLineStart() {
        let e = this.charAt(0);
        if (!e && !this.atEnd) return this.setNext("line-start");
        if (e === "-" || e === ".") {
          if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
          let t = this.peek(3);
          if ((t === "---" || t === "...") && R(this.charAt(3)))
            return (
              yield* this.pushCount(3),
              (this.indentValue = 0),
              (this.indentNext = 0),
              t === "---" ? "doc" : "stream"
            );
        }
        return (
          (this.indentValue = yield* this.pushSpaces(!1)),
          this.indentNext > this.indentValue && !R(this.charAt(1)) && (this.indentNext = this.indentValue),
          yield* this.parseBlockStart()
        );
      }
      *parseBlockStart() {
        let [e, t] = this.peek(2);
        if (!t && !this.atEnd) return this.setNext("block-start");
        if ((e === "-" || e === "?" || e === ":") && R(t)) {
          let s = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
          return ((this.indentNext = this.indentValue + 1), (this.indentValue += s), "block-start");
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(!0);
        let e = this.getLine();
        if (e === null) return this.setNext("doc");
        let t = yield* this.pushIndicators();
        switch (e[t]) {
          case "#":
            yield* this.pushCount(e.length - t);
          case void 0:
            return (yield* this.pushNewline(), yield* this.parseLineStart());
          case "{":
          case "[":
            return (yield* this.pushCount(1), (this.flowKey = !1), (this.flowLevel = 1), "flow");
          case "}":
          case "]":
            return (yield* this.pushCount(1), "doc");
          case "*":
            return (yield* this.pushUntil(Ls), "doc");
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            return (
              (t += yield* this.parseBlockScalarHeader()),
              (t += yield* this.pushSpaces(!0)),
              yield* this.pushCount(e.length - t),
              yield* this.pushNewline(),
              yield* this.parseBlockScalar()
            );
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let e,
          t,
          s = -1;
        do
          ((e = yield* this.pushNewline()),
            e > 0 ? ((t = yield* this.pushSpaces(!1)), (this.indentValue = s = t)) : (t = 0),
            (t += yield* this.pushSpaces(!0)));
        while (e + t > 0);
        let i = this.getLine();
        if (i === null) return this.setNext("flow");
        if (
          ((s !== -1 && s < this.indentNext && i[0] !== "#") ||
            (s === 0 && (i.startsWith("---") || i.startsWith("...")) && R(i[3]))) &&
          !(s === this.indentNext - 1 && this.flowLevel === 1 && (i[0] === "]" || i[0] === "}"))
        )
          return ((this.flowLevel = 0), yield We.FLOW_END, yield* this.parseLineStart());
        let r = 0;
        for (; i[r] === ",";) ((r += yield* this.pushCount(1)), (r += yield* this.pushSpaces(!0)), (this.flowKey = !1));
        switch (((r += yield* this.pushIndicators()), i[r])) {
          case void 0:
            return "flow";
          case "#":
            return (yield* this.pushCount(i.length - r), "flow");
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
            return (yield* this.pushUntil(Ls), "flow");
          case '"':
          case "'":
            return ((this.flowKey = !0), yield* this.parseQuotedScalar());
          case ":": {
            let a = this.charAt(1);
            if (this.flowKey || R(a) || a === ",")
              return ((this.flowKey = !1), yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow");
          }
          default:
            return ((this.flowKey = !1), yield* this.parsePlainScalar());
        }
      }
      *parseQuotedScalar() {
        let e = this.charAt(0),
          t = this.buffer.indexOf(e, this.pos + 1);
        if (e === "'") for (; t !== -1 && this.buffer[t + 1] === "'";) t = this.buffer.indexOf("'", t + 2);
        else
          for (; t !== -1;) {
            let r = 0;
            for (; this.buffer[t - 1 - r] === "\\";) r += 1;
            if (r % 2 === 0) break;
            t = this.buffer.indexOf('"', t + 1);
          }
        let s = this.buffer.substring(0, t),
          i = s.indexOf(
            `
`,
            this.pos,
          );
        if (i !== -1) {
          for (; i !== -1;) {
            let r = this.continueScalar(i + 1);
            if (r === -1) break;
            i = s.indexOf(
              `
`,
              r,
            );
          }
          i !== -1 && (t = i - (s[i - 1] === "\r" ? 2 : 1));
        }
        if (t === -1) {
          if (!this.atEnd) return this.setNext("quoted-scalar");
          t = this.buffer.length;
        }
        return (yield* this.pushToIndex(t + 1, !1), this.flowLevel ? "flow" : "doc");
      }
      *parseBlockScalarHeader() {
        ((this.blockScalarIndent = -1), (this.blockScalarKeep = !1));
        let e = this.pos;
        for (;;) {
          let t = this.buffer[++e];
          if (t === "+") this.blockScalarKeep = !0;
          else if (t > "0" && t <= "9") this.blockScalarIndent = Number(t) - 1;
          else if (t !== "-") break;
        }
        return yield* this.pushUntil((t) => R(t) || t === "#");
      }
      *parseBlockScalar() {
        let e = this.pos - 1,
          t = 0,
          s;
        e: for (let r = this.pos; (s = this.buffer[r]); ++r)
          switch (s) {
            case " ":
              t += 1;
              break;
            case `
`:
              ((e = r), (t = 0));
              break;
            case "\r": {
              let a = this.buffer[r + 1];
              if (!a && !this.atEnd) return this.setNext("block-scalar");
              if (
                a ===
                `
`
              )
                break;
            }
            default:
              break e;
          }
        if (!s && !this.atEnd) return this.setNext("block-scalar");
        if (t >= this.indentNext) {
          this.blockScalarIndent === -1
            ? (this.indentNext = t)
            : (this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext));
          do {
            let r = this.continueScalar(e + 1);
            if (r === -1) break;
            e = this.buffer.indexOf(
              `
`,
              r,
            );
          } while (e !== -1);
          if (e === -1) {
            if (!this.atEnd) return this.setNext("block-scalar");
            e = this.buffer.length;
          }
        }
        let i = e + 1;
        for (s = this.buffer[i]; s === " ";) s = this.buffer[++i];
        if (s === "	") {
          for (
            ;
            s === "	" ||
            s === " " ||
            s === "\r" ||
            s ===
              `
`;
          )
            s = this.buffer[++i];
          e = i - 1;
        } else if (!this.blockScalarKeep)
          do {
            let r = e - 1,
              a = this.buffer[r];
            a === "\r" && (a = this.buffer[--r]);
            let o = r;
            for (; a === " ";) a = this.buffer[--r];
            if (
              a ===
                `
` &&
              r >= this.pos &&
              r + 1 + t > o
            )
              e = r;
            else break;
          } while (!0);
        return (yield We.SCALAR, yield* this.pushToIndex(e + 1, !0), yield* this.parseLineStart());
      }
      *parsePlainScalar() {
        let e = this.flowLevel > 0,
          t = this.pos - 1,
          s = this.pos - 1,
          i;
        for (; (i = this.buffer[++s]);)
          if (i === ":") {
            let r = this.buffer[s + 1];
            if (R(r) || (e && Jt.has(r))) break;
            t = s;
          } else if (R(i)) {
            let r = this.buffer[s + 1];
            if (
              (i === "\r" &&
                (r ===
                `
`
                  ? ((s += 1),
                    (i = `
`),
                    (r = this.buffer[s + 1]))
                  : (t = s)),
              r === "#" || (e && Jt.has(r)))
            )
              break;
            if (
              i ===
              `
`
            ) {
              let a = this.continueScalar(s + 1);
              if (a === -1) break;
              s = Math.max(s, a - 2);
            }
          } else {
            if (e && Jt.has(i)) break;
            t = s;
          }
        return !i && !this.atEnd
          ? this.setNext("plain-scalar")
          : (yield We.SCALAR, yield* this.pushToIndex(t + 1, !0), e ? "flow" : "doc");
      }
      *pushCount(e) {
        return e > 0 ? (yield this.buffer.substr(this.pos, e), (this.pos += e), e) : 0;
      }
      *pushToIndex(e, t) {
        let s = this.buffer.slice(this.pos, e);
        return s ? (yield s, (this.pos += s.length), s.length) : (t && (yield ""), 0);
      }
      *pushIndicators() {
        let e = 0;
        e: for (;;) {
          switch (this.charAt(0)) {
            case "!":
              ((e += yield* this.pushTag()), (e += yield* this.pushSpaces(!0)));
              continue e;
            case "&":
              ((e += yield* this.pushUntil(Ls)), (e += yield* this.pushSpaces(!0)));
              continue e;
            case "-":
            case "?":
            case ":": {
              let t = this.flowLevel > 0,
                s = this.charAt(1);
              if (R(s) || (t && Jt.has(s))) {
                (t ? this.flowKey && (this.flowKey = !1) : (this.indentNext = this.indentValue + 1),
                  (e += yield* this.pushCount(1)),
                  (e += yield* this.pushSpaces(!0)));
                continue e;
              }
            }
          }
          break e;
        }
        return e;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let e = this.pos + 2,
            t = this.buffer[e];
          for (; !R(t) && t !== ">";) t = this.buffer[++e];
          return yield* this.pushToIndex(t === ">" ? e + 1 : e, !1);
        } else {
          let e = this.pos + 1,
            t = this.buffer[e];
          for (; t;)
            if (Zu.has(t)) t = this.buffer[++e];
            else if (t === "%" && da.has(this.buffer[e + 1]) && da.has(this.buffer[e + 2])) t = this.buffer[(e += 3)];
            else break;
          return yield* this.pushToIndex(e, !1);
        }
      }
      *pushNewline() {
        let e = this.buffer[this.pos];
        return e ===
          `
`
          ? yield* this.pushCount(1)
          : e === "\r" &&
              this.charAt(1) ===
                `
`
            ? yield* this.pushCount(2)
            : 0;
      }
      *pushSpaces(e) {
        let t = this.pos - 1,
          s;
        do s = this.buffer[++t];
        while (s === " " || (e && s === "	"));
        let i = t - this.pos;
        return (i > 0 && (yield this.buffer.substr(this.pos, i), (this.pos = t)), i);
      }
      *pushUntil(e) {
        let t = this.pos,
          s = this.buffer[t];
        for (; !e(s);) s = this.buffer[++t];
        return yield* this.pushToIndex(t, !1);
      }
    };
  ha.Lexer = Os;
});
var Es = y((ma) => {
  "use strict";
  var Ts = class {
    constructor() {
      ((this.lineStarts = []),
        (this.addNewLine = (e) => this.lineStarts.push(e)),
        (this.linePos = (e) => {
          let t = 0,
            s = this.lineStarts.length;
          for (; t < s;) {
            let r = (t + s) >> 1;
            this.lineStarts[r] < e ? (t = r + 1) : (s = r);
          }
          if (this.lineStarts[t] === e) return { line: t + 1, col: 1 };
          if (t === 0) return { line: 0, col: e };
          let i = this.lineStarts[t - 1];
          return { line: t, col: e - i + 1 };
        }));
    }
  };
  ma.LineCounter = Ts;
});
var Ms = y((wa) => {
  "use strict";
  var tf = Xe("process"),
    pa = Gt(),
    nf = As();
  function ee(n, e) {
    for (let t = 0; t < n.length; ++t) if (n[t].type === e) return !0;
    return !1;
  }
  function ga(n) {
    for (let e = 0; e < n.length; ++e)
      switch (n[e].type) {
        case "space":
        case "comment":
        case "newline":
          break;
        default:
          return e;
      }
    return -1;
  }
  function ba(n) {
    switch (n?.type) {
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
  function Wt(n) {
    switch (n.type) {
      case "document":
        return n.start;
      case "block-map": {
        let e = n.items[n.items.length - 1];
        return e.sep ?? e.start;
      }
      case "block-seq":
        return n.items[n.items.length - 1].start;
      default:
        return [];
    }
  }
  function we(n) {
    if (n.length === 0) return [];
    let e = n.length;
    e: for (; --e >= 0;)
      switch (n[e].type) {
        case "doc-start":
        case "explicit-key-ind":
        case "map-value-ind":
        case "seq-item-ind":
        case "newline":
          break e;
      }
    for (; n[++e]?.type === "space";);
    return n.splice(e, n.length);
  }
  function Ht(n, e) {
    if (e.length < 1e5) Array.prototype.push.apply(n, e);
    else for (let t = 0; t < e.length; ++t) n.push(e[t]);
  }
  function ya(n) {
    if (n.start.type === "flow-seq-start")
      for (let e of n.items)
        e.sep &&
          !e.value &&
          !ee(e.start, "explicit-key-ind") &&
          !ee(e.sep, "map-value-ind") &&
          (e.key && (e.value = e.key),
          delete e.key,
          ba(e.value) ? (e.value.end ? Ht(e.value.end, e.sep) : (e.value.end = e.sep)) : Ht(e.start, e.sep),
          delete e.sep);
  }
  var qs = class {
    constructor(e) {
      ((this.atNewLine = !0),
        (this.atScalar = !1),
        (this.indent = 0),
        (this.offset = 0),
        (this.onKeyLine = !1),
        (this.stack = []),
        (this.source = ""),
        (this.type = ""),
        (this.lexer = new nf.Lexer()),
        (this.onNewLine = e));
    }
    *parse(e, t = !1) {
      this.onNewLine && this.offset === 0 && this.onNewLine(0);
      for (let s of this.lexer.lex(e, t)) yield* this.next(s);
      t || (yield* this.end());
    }
    *next(e) {
      if (((this.source = e), tf.env.LOG_TOKENS && console.log("|", pa.prettyToken(e)), this.atScalar)) {
        ((this.atScalar = !1), yield* this.step(), (this.offset += e.length));
        return;
      }
      let t = pa.tokenType(e);
      if (t)
        if (t === "scalar") ((this.atNewLine = !1), (this.atScalar = !0), (this.type = "scalar"));
        else {
          switch (((this.type = t), yield* this.step(), t)) {
            case "newline":
              ((this.atNewLine = !0), (this.indent = 0), this.onNewLine && this.onNewLine(this.offset + e.length));
              break;
            case "space":
              this.atNewLine && e[0] === " " && (this.indent += e.length);
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              this.atNewLine && (this.indent += e.length);
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = !1;
          }
          this.offset += e.length;
        }
      else {
        let s = `Not a YAML token: ${e}`;
        (yield* this.pop({ type: "error", offset: this.offset, message: s, source: e }), (this.offset += e.length));
      }
    }
    *end() {
      for (; this.stack.length > 0;) yield* this.pop();
    }
    get sourceToken() {
      return { type: this.type, offset: this.offset, indent: this.indent, source: this.source };
    }
    *step() {
      let e = this.peek(1);
      if (this.type === "doc-end" && e?.type !== "doc-end") {
        for (; this.stack.length > 0;) yield* this.pop();
        this.stack.push({ type: "doc-end", offset: this.offset, source: this.source });
        return;
      }
      if (!e) return yield* this.stream();
      switch (e.type) {
        case "document":
          return yield* this.document(e);
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return yield* this.scalar(e);
        case "block-scalar":
          return yield* this.blockScalar(e);
        case "block-map":
          return yield* this.blockMap(e);
        case "block-seq":
          return yield* this.blockSequence(e);
        case "flow-collection":
          return yield* this.flowCollection(e);
        case "doc-end":
          return yield* this.documentEnd(e);
      }
      yield* this.pop();
    }
    peek(e) {
      return this.stack[this.stack.length - e];
    }
    *pop(e) {
      let t = e ?? this.stack.pop();
      if (!t) yield { type: "error", offset: this.offset, source: "", message: "Tried to pop an empty stack" };
      else if (this.stack.length === 0) yield t;
      else {
        let s = this.peek(1);
        switch (
          (t.type === "block-scalar"
            ? (t.indent = "indent" in s ? s.indent : 0)
            : t.type === "flow-collection" && s.type === "document" && (t.indent = 0),
          t.type === "flow-collection" && ya(t),
          s.type)
        ) {
          case "document":
            s.value = t;
            break;
          case "block-scalar":
            s.props.push(t);
            break;
          case "block-map": {
            let i = s.items[s.items.length - 1];
            if (i.value) {
              (s.items.push({ start: [], key: t, sep: [] }), (this.onKeyLine = !0));
              return;
            } else if (i.sep) i.value = t;
            else {
              (Object.assign(i, { key: t, sep: [] }), (this.onKeyLine = !i.explicitKey));
              return;
            }
            break;
          }
          case "block-seq": {
            let i = s.items[s.items.length - 1];
            i.value ? s.items.push({ start: [], value: t }) : (i.value = t);
            break;
          }
          case "flow-collection": {
            let i = s.items[s.items.length - 1];
            !i || i.value
              ? s.items.push({ start: [], key: t, sep: [] })
              : i.sep
                ? (i.value = t)
                : Object.assign(i, { key: t, sep: [] });
            return;
          }
          default:
            (yield* this.pop(), yield* this.pop(t));
        }
        if (
          (s.type === "document" || s.type === "block-map" || s.type === "block-seq") &&
          (t.type === "block-map" || t.type === "block-seq")
        ) {
          let i = t.items[t.items.length - 1];
          i &&
            !i.sep &&
            !i.value &&
            i.start.length > 0 &&
            ga(i.start) === -1 &&
            (t.indent === 0 || i.start.every((r) => r.type !== "comment" || r.indent < t.indent)) &&
            (s.type === "document" ? (s.end = i.start) : s.items.push({ start: i.start }), t.items.splice(-1, 1));
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
          let e = { type: "document", offset: this.offset, start: [] };
          (this.type === "doc-start" && e.start.push(this.sourceToken), this.stack.push(e));
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
    *document(e) {
      if (e.value) return yield* this.lineEnd(e);
      switch (this.type) {
        case "doc-start": {
          ga(e.start) !== -1 ? (yield* this.pop(), yield* this.step()) : e.start.push(this.sourceToken);
          return;
        }
        case "anchor":
        case "tag":
        case "space":
        case "comment":
        case "newline":
          e.start.push(this.sourceToken);
          return;
      }
      let t = this.startBlockValue(e);
      t
        ? this.stack.push(t)
        : yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source,
          };
    }
    *scalar(e) {
      if (this.type === "map-value-ind") {
        let t = Wt(this.peek(2)),
          s = we(t),
          i;
        e.end ? ((i = e.end), i.push(this.sourceToken), delete e.end) : (i = [this.sourceToken]);
        let r = { type: "block-map", offset: e.offset, indent: e.indent, items: [{ start: s, key: e, sep: i }] };
        ((this.onKeyLine = !0), (this.stack[this.stack.length - 1] = r));
      } else yield* this.lineEnd(e);
    }
    *blockScalar(e) {
      switch (this.type) {
        case "space":
        case "comment":
        case "newline":
          e.props.push(this.sourceToken);
          return;
        case "scalar":
          if (((e.source = this.source), (this.atNewLine = !0), (this.indent = 0), this.onNewLine)) {
            let t =
              this.source.indexOf(`
`) + 1;
            for (; t !== 0;)
              (this.onNewLine(this.offset + t),
                (t =
                  this.source.indexOf(
                    `
`,
                    t,
                  ) + 1));
          }
          yield* this.pop();
          break;
        default:
          (yield* this.pop(), yield* this.step());
      }
    }
    *blockMap(e) {
      let t = e.items[e.items.length - 1];
      switch (this.type) {
        case "newline":
          if (((this.onKeyLine = !1), t.value)) {
            let s = "end" in t.value ? t.value.end : void 0;
            (Array.isArray(s) ? s[s.length - 1] : void 0)?.type === "comment"
              ? s?.push(this.sourceToken)
              : e.items.push({ start: [this.sourceToken] });
          } else t.sep ? t.sep.push(this.sourceToken) : t.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (t.value) e.items.push({ start: [this.sourceToken] });
          else if (t.sep) t.sep.push(this.sourceToken);
          else {
            if (this.atIndentedComment(t.start, e.indent)) {
              let i = e.items[e.items.length - 2]?.value?.end;
              if (Array.isArray(i)) {
                (Ht(i, t.start), i.push(this.sourceToken), e.items.pop());
                return;
              }
            }
            t.start.push(this.sourceToken);
          }
          return;
      }
      if (this.indent >= e.indent) {
        let s = !this.onKeyLine && this.indent === e.indent,
          i = s && (t.sep || t.explicitKey) && this.type !== "seq-item-ind",
          r = [];
        if (i && t.sep && !t.value) {
          let a = [];
          for (let o = 0; o < t.sep.length; ++o) {
            let l = t.sep[o];
            switch (l.type) {
              case "newline":
                a.push(o);
                break;
              case "space":
                break;
              case "comment":
                l.indent > e.indent && (a.length = 0);
                break;
              default:
                a.length = 0;
            }
          }
          a.length >= 2 && (r = t.sep.splice(a[1]));
        }
        switch (this.type) {
          case "anchor":
          case "tag":
            i || t.value
              ? (r.push(this.sourceToken), e.items.push({ start: r }), (this.onKeyLine = !0))
              : t.sep
                ? t.sep.push(this.sourceToken)
                : t.start.push(this.sourceToken);
            return;
          case "explicit-key-ind":
            (!t.sep && !t.explicitKey
              ? (t.start.push(this.sourceToken), (t.explicitKey = !0))
              : i || t.value
                ? (r.push(this.sourceToken), e.items.push({ start: r, explicitKey: !0 }))
                : this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [this.sourceToken], explicitKey: !0 }],
                  }),
              (this.onKeyLine = !0));
            return;
          case "map-value-ind":
            if (t.explicitKey)
              if (t.sep)
                if (t.value) e.items.push({ start: [], key: null, sep: [this.sourceToken] });
                else if (ee(t.sep, "map-value-ind"))
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: r, key: null, sep: [this.sourceToken] }],
                  });
                else if (ba(t.key) && !ee(t.sep, "newline")) {
                  let a = we(t.start),
                    o = t.key,
                    l = t.sep;
                  (l.push(this.sourceToken),
                    delete t.key,
                    delete t.sep,
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: a, key: o, sep: l }],
                    }));
                } else r.length > 0 ? (t.sep = t.sep.concat(r, this.sourceToken)) : t.sep.push(this.sourceToken);
              else if (ee(t.start, "newline")) Object.assign(t, { key: null, sep: [this.sourceToken] });
              else {
                let a = we(t.start);
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: a, key: null, sep: [this.sourceToken] }],
                });
              }
            else
              t.sep
                ? t.value || i
                  ? e.items.push({ start: r, key: null, sep: [this.sourceToken] })
                  : ee(t.sep, "map-value-ind")
                    ? this.stack.push({
                        type: "block-map",
                        offset: this.offset,
                        indent: this.indent,
                        items: [{ start: [], key: null, sep: [this.sourceToken] }],
                      })
                    : t.sep.push(this.sourceToken)
                : Object.assign(t, { key: null, sep: [this.sourceToken] });
            this.onKeyLine = !0;
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            let a = this.flowScalar(this.type);
            i || t.value
              ? (e.items.push({ start: r, key: a, sep: [] }), (this.onKeyLine = !0))
              : t.sep
                ? this.stack.push(a)
                : (Object.assign(t, { key: a, sep: [] }), (this.onKeyLine = !0));
            return;
          }
          default: {
            let a = this.startBlockValue(e);
            if (a) {
              if (a.type === "block-seq") {
                if (!t.explicitKey && t.sep && !ee(t.sep, "newline")) {
                  yield* this.pop({
                    type: "error",
                    offset: this.offset,
                    message: "Unexpected block-seq-ind on same line with key",
                    source: this.source,
                  });
                  return;
                }
              } else s && e.items.push({ start: r });
              this.stack.push(a);
              return;
            }
          }
        }
      }
      (yield* this.pop(), yield* this.step());
    }
    *blockSequence(e) {
      let t = e.items[e.items.length - 1];
      switch (this.type) {
        case "newline":
          if (t.value) {
            let s = "end" in t.value ? t.value.end : void 0;
            (Array.isArray(s) ? s[s.length - 1] : void 0)?.type === "comment"
              ? s?.push(this.sourceToken)
              : e.items.push({ start: [this.sourceToken] });
          } else t.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (t.value) e.items.push({ start: [this.sourceToken] });
          else {
            if (this.atIndentedComment(t.start, e.indent)) {
              let i = e.items[e.items.length - 2]?.value?.end;
              if (Array.isArray(i)) {
                (Ht(i, t.start), i.push(this.sourceToken), e.items.pop());
                return;
              }
            }
            t.start.push(this.sourceToken);
          }
          return;
        case "anchor":
        case "tag":
          if (t.value || this.indent <= e.indent) break;
          t.start.push(this.sourceToken);
          return;
        case "seq-item-ind":
          if (this.indent !== e.indent) break;
          t.value || ee(t.start, "seq-item-ind")
            ? e.items.push({ start: [this.sourceToken] })
            : t.start.push(this.sourceToken);
          return;
      }
      if (this.indent > e.indent) {
        let s = this.startBlockValue(e);
        if (s) {
          this.stack.push(s);
          return;
        }
      }
      (yield* this.pop(), yield* this.step());
    }
    *flowCollection(e) {
      let t = e.items[e.items.length - 1];
      if (this.type === "flow-error-end") {
        let s;
        do (yield* this.pop(), (s = this.peek(1)));
        while (s?.type === "flow-collection");
      } else if (e.end.length === 0) {
        switch (this.type) {
          case "comma":
          case "explicit-key-ind":
            !t || t.sep ? e.items.push({ start: [this.sourceToken] }) : t.start.push(this.sourceToken);
            return;
          case "map-value-ind":
            !t || t.value
              ? e.items.push({ start: [], key: null, sep: [this.sourceToken] })
              : t.sep
                ? t.sep.push(this.sourceToken)
                : Object.assign(t, { key: null, sep: [this.sourceToken] });
            return;
          case "space":
          case "comment":
          case "newline":
          case "anchor":
          case "tag":
            !t || t.value
              ? e.items.push({ start: [this.sourceToken] })
              : t.sep
                ? t.sep.push(this.sourceToken)
                : t.start.push(this.sourceToken);
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            let i = this.flowScalar(this.type);
            !t || t.value
              ? e.items.push({ start: [], key: i, sep: [] })
              : t.sep
                ? this.stack.push(i)
                : Object.assign(t, { key: i, sep: [] });
            return;
          }
          case "flow-map-end":
          case "flow-seq-end":
            e.end.push(this.sourceToken);
            return;
        }
        let s = this.startBlockValue(e);
        s ? this.stack.push(s) : (yield* this.pop(), yield* this.step());
      } else {
        let s = this.peek(2);
        if (
          s.type === "block-map" &&
          ((this.type === "map-value-ind" && s.indent === e.indent) ||
            (this.type === "newline" && !s.items[s.items.length - 1].sep))
        )
          (yield* this.pop(), yield* this.step());
        else if (this.type === "map-value-ind" && s.type !== "flow-collection") {
          let i = Wt(s),
            r = we(i);
          ya(e);
          let a = e.end.splice(1, e.end.length);
          a.push(this.sourceToken);
          let o = { type: "block-map", offset: e.offset, indent: e.indent, items: [{ start: r, key: e, sep: a }] };
          ((this.onKeyLine = !0), (this.stack[this.stack.length - 1] = o));
        } else yield* this.lineEnd(e);
      }
    }
    flowScalar(e) {
      if (this.onNewLine) {
        let t =
          this.source.indexOf(`
`) + 1;
        for (; t !== 0;)
          (this.onNewLine(this.offset + t),
            (t =
              this.source.indexOf(
                `
`,
                t,
              ) + 1));
      }
      return { type: e, offset: this.offset, indent: this.indent, source: this.source };
    }
    startBlockValue(e) {
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
          let t = Wt(e),
            s = we(t);
          return (
            s.push(this.sourceToken),
            { type: "block-map", offset: this.offset, indent: this.indent, items: [{ start: s, explicitKey: !0 }] }
          );
        }
        case "map-value-ind": {
          this.onKeyLine = !0;
          let t = Wt(e),
            s = we(t);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: s, key: null, sep: [this.sourceToken] }],
          };
        }
      }
      return null;
    }
    atIndentedComment(e, t) {
      return this.type !== "comment" || this.indent <= t
        ? !1
        : e.every((s) => s.type === "newline" || s.type === "space");
    }
    *documentEnd(e) {
      this.type !== "doc-mode" &&
        (e.end ? e.end.push(this.sourceToken) : (e.end = [this.sourceToken]),
        this.type === "newline" && (yield* this.pop()));
    }
    *lineEnd(e) {
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
          (e.end ? e.end.push(this.sourceToken) : (e.end = [this.sourceToken]),
            this.type === "newline" && (yield* this.pop()));
      }
    }
  };
  wa.Parser = qs;
});
var Na = y((Qe) => {
  "use strict";
  var Sa = ys(),
    sf = Fe(),
    He = xe(),
    rf = pn(),
    af = L(),
    of = Es(),
    va = Ms();
  function Ia(n) {
    let e = n.prettyErrors !== !1;
    return { lineCounter: n.lineCounter || (e && new of.LineCounter()) || null, prettyErrors: e };
  }
  function lf(n, e = {}) {
    let { lineCounter: t, prettyErrors: s } = Ia(e),
      i = new va.Parser(t?.addNewLine),
      r = new Sa.Composer(e),
      a = Array.from(r.compose(i.parse(n)));
    if (s && t) for (let o of a) (o.errors.forEach(He.prettifyError(n, t)), o.warnings.forEach(He.prettifyError(n, t)));
    return a.length > 0 ? a : Object.assign([], { empty: !0 }, r.streamInfo());
  }
  function ka(n, e = {}) {
    let { lineCounter: t, prettyErrors: s } = Ia(e),
      i = new va.Parser(t?.addNewLine),
      r = new Sa.Composer(e),
      a = null;
    for (let o of r.compose(i.parse(n), !0, n.length))
      if (!a) a = o;
      else if (a.options.logLevel !== "silent") {
        a.errors.push(
          new He.YAMLParseError(
            o.range.slice(0, 2),
            "MULTIPLE_DOCS",
            "Source contains multiple documents; please use YAML.parseAllDocuments()",
          ),
        );
        break;
      }
    return (s && t && (a.errors.forEach(He.prettifyError(n, t)), a.warnings.forEach(He.prettifyError(n, t))), a);
  }
  function cf(n, e, t) {
    let s;
    typeof e == "function" ? (s = e) : t === void 0 && e && typeof e == "object" && (t = e);
    let i = ka(n, t);
    if (!i) return null;
    if ((i.warnings.forEach((r) => rf.warn(i.options.logLevel, r)), i.errors.length > 0)) {
      if (i.options.logLevel !== "silent") throw i.errors[0];
      i.errors = [];
    }
    return i.toJS(Object.assign({ reviver: s }, t));
  }
  function uf(n, e, t) {
    let s = null;
    if (
      (typeof e == "function" || Array.isArray(e) ? (s = e) : t === void 0 && e && (t = e),
      typeof t == "string" && (t = t.length),
      typeof t == "number")
    ) {
      let i = Math.round(t);
      t = i < 1 ? void 0 : i > 8 ? { indent: 8 } : { indent: i };
    }
    if (n === void 0) {
      let { keepUndefined: i } = t ?? e ?? {};
      if (!i) return;
    }
    return af.isDocument(n) && !s ? n.toString(t) : new sf.Document(n, s, t).toString(t);
  }
  Qe.parse = cf;
  Qe.parseAllDocuments = lf;
  Qe.parseDocument = ka;
  Qe.stringify = uf;
});
var Oa = y((O) => {
  "use strict";
  var ff = ys(),
    df = Fe(),
    hf = zn(),
    Cs = xe(),
    mf = Le(),
    te = L(),
    pf = Q(),
    gf = q(),
    yf = X(),
    bf = Z(),
    wf = Gt(),
    Sf = As(),
    vf = Es(),
    If = Ms(),
    Qt = Na(),
    La = ve();
  O.Composer = ff.Composer;
  O.Document = df.Document;
  O.Schema = hf.Schema;
  O.YAMLError = Cs.YAMLError;
  O.YAMLParseError = Cs.YAMLParseError;
  O.YAMLWarning = Cs.YAMLWarning;
  O.Alias = mf.Alias;
  O.isAlias = te.isAlias;
  O.isCollection = te.isCollection;
  O.isDocument = te.isDocument;
  O.isMap = te.isMap;
  O.isNode = te.isNode;
  O.isPair = te.isPair;
  O.isScalar = te.isScalar;
  O.isSeq = te.isSeq;
  O.Pair = pf.Pair;
  O.Scalar = gf.Scalar;
  O.YAMLMap = yf.YAMLMap;
  O.YAMLSeq = bf.YAMLSeq;
  O.CST = wf;
  O.Lexer = Sf.Lexer;
  O.LineCounter = vf.LineCounter;
  O.Parser = If.Parser;
  O.parse = Qt.parse;
  O.parseAllDocuments = Qt.parseAllDocuments;
  O.parseDocument = Qt.parseDocument;
  O.stringify = Qt.stringify;
  O.visit = La.visit;
  O.visitAsync = La.visitAsync;
});
import { parentPort as Da } from "node:worker_threads";
import { createHash as Pa } from "node:crypto";
import { readFile as Df } from "node:fs/promises";
var D = Ja(Oa(), 1);
function le(n, e) {
  if (!n || typeof n != "object" || Array.isArray(n)) return null;
  let t = n[e];
  return typeof t == "string" ? t : typeof t == "number" ? String(t) : typeof t == "bigint" ? t.toString() : null;
}
function zt(n, e, t, s) {
  if (Array.isArray(n)) {
    n.forEach((i, r) => {
      zt(i, e, `${t}[${r}]`, s);
    });
    return;
  }
  if (!(!n || typeof n != "object")) {
    if (kf(n)) {
      let i = le(n, "guid"),
        r = le(n, "fileID"),
        a = le(n, "localIdentifierInFile");
      (i || (r && r !== "0")) &&
        s.push({
          sourceLocalIdentifier: e,
          fieldPath: t,
          targetGuid: i,
          targetFileId: r,
          targetLocalId: a,
          refKind: i ? "guid-file" : "local-file",
        });
      return;
    }
    Object.entries(n).forEach(([i, r]) => {
      let a = t ? `${t}.${i}` : i;
      zt(r, e, a, s);
    });
  }
}
function kf(n) {
  if (!n || typeof n != "object" || Array.isArray(n)) return !1;
  let e = Object.keys(n);
  return e.includes("fileID") || e.includes("guid") || e.includes("localIdentifierInFile");
}
var Nf = {
    gameObjectFileId: 1,
    parentTransformLocalId: 2,
    childTransformLocalIds: 4,
    prefabInstanceLocalId: 8,
    prefabTransformParentLocalId: 16,
    prefabRootName: 32,
  },
  Lf = new WeakMap();
function Aa(n) {
  let e = ze(n, /^[ \t]*m_GameObject\s*:/m, /m_GameObject:\s*\{\s*fileID:\s*([^,}\s]+)/),
    t = ze(n, /^[ \t]*m_Father\s*:/m, /m_Father:\s*\{\s*fileID:\s*([^,}\s]+)/),
    s = Of(n),
    i = ze(n, /^[ \t]*m_PrefabInstance\s*:/m, /m_PrefabInstance:\s*\{\s*fileID:\s*([^,}\s]+)/),
    r = ze(n, /^[ \t]*m_SourcePrefab\s*:/m, /m_SourcePrefab:\s*\{[^}]*guid:\s*([^,}\s]+)/),
    a = ze(n, /^[ \t]*m_TransformParent\s*:/m, /m_TransformParent:\s*\{\s*fileID:\s*([^,}\s]+)/),
    o = Af(n),
    l = {
      gameObjectFileId: e.value,
      parentTransformLocalId: t.value,
      childTransformLocalIds: s.value,
      prefabInstanceLocalId: i.value,
      sourcePrefabGuid: r.value,
      prefabTransformParentLocalId: a.value,
      prefabRootName: o.value,
    },
    c = 0,
    h = [
      ["gameObjectFileId", e],
      ["parentTransformLocalId", t],
      ["childTransformLocalIds", s],
      ["prefabInstanceLocalId", i],
      ["prefabTransformParentLocalId", a],
      ["prefabRootName", o],
    ];
  for (let [u, f] of h) f.covered && (c |= Nf[u]);
  return (Lf.set(l, c), l);
}
function ze(n, e, t) {
  let s = n.match(t),
    i = s?.[1];
  return { value: i === void 0 ? null : Ps(i), covered: s !== null || !e.test(n) };
}
function Of(n) {
  let e = n.match(/^[ \t]*m_Children:\s*([^\r\n]*)/m);
  if (!e) return { value: void 0, covered: !0 };
  if (e[1]?.trim() === "[]") return { value: [], covered: !0 };
  let t = n.match(/^[ \t]*m_Children:\s*\r?\n((?:[ \t]*-[^\r\n]*(?:\r?\n|$))*)/m)?.[1];
  return t === void 0
    ? { value: void 0, covered: !1 }
    : {
        value: [...t.matchAll(/\{\s*fileID:\s*([^,}\s]+)/g)]
          .map((s) => s[1])
          .filter((s) => s !== void 0 && s !== "0")
          .map(Ps),
        covered: !0,
      };
}
function Af(n) {
  let e = n.match(/propertyPath:\s*m_Name\s*\n\s*value:\s*([^\n\r]+)/m),
    t = e?.[1]?.trim();
  return { value: t ? Ps(t) : null, covered: e !== null || !/^[ \t]*(?:-\s*)?propertyPath:\s*m_Name\s*$/m.test(n) };
}
function Ps(n) {
  return Buffer.from(n, "utf8").toString("utf8");
}
var Ta = { intAsBigInt: !0, uniqueKeys: !1 };
function qa() {
  return { splitBlocksMs: 0, parseDocumentsMs: 0, collectReferencesMs: 0 };
}
function Ma(n) {
  return n.length >= 5 && n.subarray(0, 5).toString("ascii") === "%YAML";
}
function Ca(n, e) {
  let t = e ? Date.now() : 0,
    s = /^--- !u!(\d+)\s+&([^\s]+)(?:\s+.*)?$/gm,
    i = [...n.matchAll(s)],
    r = 1,
    a = n.indexOf(`
`),
    o = 0,
    l = (u) => {
      if (u < o) throw new Error(`lineNumberAt requires non-decreasing offsets, received ${u} after ${o}`);
      for (o = u; a >= 0 && a < u;)
        ((r += 1),
          (a = n.indexOf(
            `
`,
            a + 1,
          )));
      return r;
    };
  e && (e.splitBlocksMs += Date.now() - t);
  let c = [],
    h = [];
  return (
    i.forEach((u, f) => {
      let p = u.index ?? 0,
        g = f + 1 < i.length ? (i[f + 1].index ?? n.length) : n.length,
        d = n.indexOf(
          `
`,
          p,
        );
      if (d < 0 || d >= g) return;
      let m = n
        .slice(d + 1, g)
        .trimEnd()
        .replace(
          /\r\n/g,
          `
`,
        );
      if (m.length === 0) return;
      let w = Number(u[1]),
        S = u[2] ?? null,
        v = m.indexOf(`
`),
        k = (v < 0 ? m : m.slice(0, v)).match(/^([A-Za-z0-9_]+):\s*$/);
      if (!k) return;
      let I = k[1],
        A = e ? Date.now() : 0,
        b = Tf(m),
        T = { objectType: I, rootObjectCount: 0, nameCount: 0, name: null },
        $ = _f(b.contents, T)?.[I] ?? {},
        E = S.split(/\s+/)[0],
        Se = l(p),
        Ua = Se + Pf(m) + 1,
        Ra = T.rootObjectCount === 1 && T.nameCount === 1 ? T.name : null;
      (e && (e.parseDocumentsMs += Date.now() - A),
        c.push({
          docIndex: f,
          unityClassId: w,
          anchor: S,
          objectType: I,
          localIdentifier: E,
          gameObjectFileId: le($.m_GameObject, "fileID"),
          componentTypeName: I === "MonoBehaviour" ? I : null,
          scriptGuid: le($.m_Script, "guid"),
          scriptFileId: le($.m_Script, "fileID"),
          name: Ra,
          payload: $,
          metadata: Aa(m),
          lineStart: Se,
          lineEnd: Ua,
        }));
      let Ya = e ? Date.now() : 0;
      (zt($, E, "", h), e && (e.collectReferencesMs += Date.now() - Ya));
    }),
    { objects: c, references: h }
  );
}
function Tf(n) {
  let e = D.default.parseDocument(n, Ta);
  if (e.errors.length === 0) return e;
  let t = Ef(n);
  if (t === n) throw new Error(e.errors.map((i) => i.message).join("; "));
  let s = D.default.parseDocument(t, Ta);
  if (s.errors.length > 0) throw new Error(s.errors.map((i) => i.message).join("; "));
  return s;
}
function Ef(n) {
  return Cf(qf(n));
}
function qf(n) {
  let e = n.split(/\r?\n/),
    t = [],
    s = !1;
  for (let i = 0; i < e.length; i += 1) {
    let r = e[i] ?? "",
      a = r.match(/^(\s*[^:\n]+:\s*)'(.*)$/);
    if (!a) {
      t.push(r);
      continue;
    }
    let o = a[1] ?? "",
      l = Ea(a[2] ?? "");
    if (l.closed) {
      t.push(r);
      continue;
    }
    let c = l.value,
      h = [r],
      u = i + 1,
      f = !1;
    for (; u < e.length; u += 1) {
      let p = e[u] ?? "";
      h.push(p);
      let g = Ea(p.replace(/^\s+/, ""));
      if (
        (g.value.length === 0
          ? g.closed ||
            (c += `
`)
          : (c = Mf(c, g.value)),
        g.closed)
      ) {
        f = !0;
        break;
      }
    }
    if (!f) {
      (t.push(...h), (i = u - 1));
      continue;
    }
    ((s = !0), t.push(`${o}${JSON.stringify(c.replace(/\n+$/, ""))}`), (i = u));
  }
  return s
    ? t.join(`
`)
    : n;
}
function Ea(n) {
  let e = "";
  for (let t = 0; t < n.length; t += 1) {
    let s = n[t];
    if (s === "'") {
      if (n[t + 1] === "'") {
        ((e += "'"), (t += 1));
        continue;
      }
      return { value: e, closed: !0 };
    }
    e += s;
  }
  return { value: e, closed: !1 };
}
function Mf(n, e) {
  return n.length === 0 ||
    n.endsWith(`
`)
    ? `${n}${e}`
    : `${n} ${e}`;
}
function Cf(n) {
  let e = n.split(/\r?\n/);
  if (e.length < 2 || !/^[A-Za-z0-9_]+:\s*$/.test(e[0] ?? "")) return n;
  let t = !1,
    s = e.map((i, r) => (r > 0 && i.length > 0 && !/^\s/.test(i) ? ((t = !0), `  ${i}`) : i));
  return t
    ? s.join(`
`)
    : n;
}
function Pf(n) {
  let e = 0;
  for (
    let t = n.indexOf(`
`);
    t >= 0;
    t = n.indexOf(
      `
`,
      t + 1,
    )
  )
    e += 1;
  return e;
}
function _f(n, e) {
  if (!(0, D.isMap)(n)) return V(n);
  let t = {};
  for (let s of n.items) {
    let i = String(V(s.key)),
      r = i === e.objectType;
    r && (e.rootObjectCount += 1);
    let a = r ? $f(s.value, e) : V(s.value);
    _s(t, i, a);
  }
  return t;
}
function $f(n, e) {
  if (!(0, D.isMap)(n)) return V(n);
  let t = {};
  for (let s of n.items) {
    let i = String(V(s.key));
    (i === "m_Name" && ((e.nameCount += 1), (e.name = jf(s.value))), _s(t, i, V(s.value)));
  }
  return t;
}
function V(n) {
  if (n == null) return null;
  if ((0, D.isScalar)(n)) return typeof n.value == "bigint" ? n.value.toString() : n.value;
  if ((0, D.isSeq)(n)) return n.items.map((e) => V(e));
  if ((0, D.isMap)(n)) {
    let e = {};
    for (let t of n.items) {
      let s = String(V(t.key));
      _s(e, s, V(t.value));
    }
    return e;
  }
  return n;
}
function jf(n) {
  if (n === null) return "";
  if (!(0, D.isScalar)(n)) return null;
  let e = n;
  return typeof e.value == "string"
    ? e.value
    : typeof e.source == "string"
      ? e.source
      : e.value === null || e.value === void 0
        ? ""
        : String(e.value);
}
function _s(n, e, t) {
  let s = n[e];
  Object.hasOwn(n, e) ? (Array.isArray(s) ? s.push(t) : (n[e] = [s, t])) : (n[e] = t);
}
function Uf(n, e = Rf(n)) {
  if (!n?.startsWith("%YAML")) return { kind: "skipped_binary", observedHash: e };
  try {
    let t = qa();
    return { kind: "extracted", extracted: Ca(n, t), phaseDurations: t, observedHash: e };
  } catch (t) {
    return { kind: "error", message: $a(t), observedHash: e };
  }
}
async function _a(n) {
  try {
    let e = await Df(n),
      t = Pa("sha256").update(e).digest("hex");
    return Ma(e) ? Uf(e.toString("utf8"), t) : { kind: "skipped_binary", observedHash: t };
  } catch (e) {
    return { kind: "error", message: $a(e), observedHash: null };
  }
}
function Rf(n) {
  return n === null ? null : Pa("sha256").update(n).digest("hex");
}
function $a(n) {
  return n instanceof Error ? n.message : String(n);
}
import { format as js } from "node:util";
import { BroadcastChannel as Ff, threadId as Bf } from "node:worker_threads";
var Kf = { DEBUG: 10, INFO: 20, WARN: 30, ERROR: 40, OFF: 50 },
  Ch = 10080 * 60 * 1e3;
var xf = "unity-insight-process-log",
  $s = { debug: "DEBUG", log: "INFO", info: "INFO", warn: "WARN", error: "ERROR", trace: "ERROR" };
function Vf(n) {
  let e = n?.trim();
  if (!e) return { level: "INFO" };
  let t = e.toUpperCase();
  return t in Kf ? { level: t } : { level: "INFO", invalidValue: e };
}
function ja() {
  if (Vf(process.env.UNITY_INSIGHT_LOG_LEVEL).level === "OFF") return () => {};
  let n;
  try {
    ((n = new Ff(xf)), n.unref());
  } catch {
    return () => {};
  }
  let e = console,
    t = new Map(),
    s = !0;
  return (
    Jf(e, t, (i, r) => {
      if (s)
        try {
          n.postMessage({ timestamp: Date.now(), threadId: Bf, level: i, message: r });
        } catch {
          ((s = !1), n.close());
        }
    }),
    () => {
      for (let [i, r] of t) e[i] = r;
      s && n.close();
    }
  );
}
function Gf(n) {
  let e = js(...n);
  return (new Error(e).stack ?? `Trace: ${e}`).replace(/^Error(?=:)/, "Trace");
}
function Jf(n, e, t) {
  for (let s of Object.keys($s)) e.set(s, n[s]);
  for (let s of Object.keys($s)) {
    let i = e.get(s);
    if (s === "trace") {
      let r = e.get("error");
      n.trace = (...a) => {
        let o = n.error,
          l;
        n.error = (...c) => {
          ((l = Wf(js(...c))), r.apply(console, [l]));
        };
        try {
          i.apply(console, a);
        } finally {
          n.error = o;
        }
        t("ERROR", l ?? Gf(a));
      };
      continue;
    }
    n[s] = (...r) => {
      (i.apply(console, r), t($s[s], js(...r)));
    };
  }
}
function Wf(n) {
  let e = n.includes(`\r
`)
      ? `\r
`
      : `
`,
    t = n.split(e);
  return (t.length > 1 && t.splice(1, 1), t.join(e));
}
ja();
Da?.on("message", (n) => {
  n.type === "extract" && Hf(n);
});
async function Hf(n) {
  let e = await _a(n.absolutePath),
    t = { type: "result", taskIndex: n.taskIndex, outcome: e };
  Da?.postMessage(t);
}
