import { createRequire as __unityInsightCreateRequire } from "node:module";
import { fileURLToPath as __unityInsightFileURLToPath } from "node:url";
import { dirname as __unityInsightDirname } from "node:path";
const __filename = __unityInsightFileURLToPath(import.meta.url);
const __dirname = __unityInsightDirname(__filename);
const require = __unityInsightCreateRequire(import.meta.url);
var ll = Object.create;
var rs = Object.defineProperty;
var ul = Object.getOwnPropertyDescriptor;
var fl = Object.getOwnPropertyNames;
var dl = Object.getPrototypeOf,
  pl = Object.prototype.hasOwnProperty;
var Mt = ((t) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
      ? new Proxy(t, { get: (e, n) => (typeof require < "u" ? require : e)[n] })
      : t)(function (t) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + t + '" is not supported');
});
var I = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports);
var hl = (t, e, n, r) => {
  if ((e && typeof e == "object") || typeof e == "function")
    for (let i of fl(e))
      !pl.call(t, i) && i !== n && rs(t, i, { get: () => e[i], enumerable: !(r = ul(e, i)) || r.enumerable });
  return t;
};
var is = (t, e, n) => (
  (n = t != null ? ll(dl(t)) : {}),
  hl(e || !t || !t.__esModule ? rs(n, "default", { value: t, enumerable: !0 }) : n, t)
);
var C = I((K) => {
  "use strict";
  var ar = Symbol.for("yaml.alias"),
    ws = Symbol.for("yaml.document"),
    Wt = Symbol.for("yaml.map"),
    vs = Symbol.for("yaml.pair"),
    cr = Symbol.for("yaml.scalar"),
    Qt = Symbol.for("yaml.seq"),
    le = Symbol.for("yaml.node.type"),
    lu = (t) => !!t && typeof t == "object" && t[le] === ar,
    uu = (t) => !!t && typeof t == "object" && t[le] === ws,
    fu = (t) => !!t && typeof t == "object" && t[le] === Wt,
    du = (t) => !!t && typeof t == "object" && t[le] === vs,
    Ts = (t) => !!t && typeof t == "object" && t[le] === cr,
    pu = (t) => !!t && typeof t == "object" && t[le] === Qt;
  function ks(t) {
    if (t && typeof t == "object")
      switch (t[le]) {
        case Wt:
        case Qt:
          return !0;
      }
    return !1;
  }
  function hu(t) {
    if (t && typeof t == "object")
      switch (t[le]) {
        case ar:
        case Wt:
        case cr:
        case Qt:
          return !0;
      }
    return !1;
  }
  var yu = (t) => (Ts(t) || ks(t)) && !!t.anchor;
  K.ALIAS = ar;
  K.DOC = ws;
  K.MAP = Wt;
  K.NODE_TYPE = le;
  K.PAIR = vs;
  K.SCALAR = cr;
  K.SEQ = Qt;
  K.hasAnchor = yu;
  K.isAlias = lu;
  K.isCollection = ks;
  K.isDocument = uu;
  K.isMap = fu;
  K.isNode = hu;
  K.isPair = du;
  K.isScalar = Ts;
  K.isSeq = pu;
});
var it = I((lr) => {
  "use strict";
  var G = C(),
    Q = Symbol("break visit"),
    Rs = Symbol("skip children"),
    ie = Symbol("remove node");
  function Ht(t, e) {
    let n = xs(e);
    G.isDocument(t)
      ? Ge(null, t.contents, n, Object.freeze([t])) === ie && (t.contents = null)
      : Ge(null, t, n, Object.freeze([]));
  }
  Ht.BREAK = Q;
  Ht.SKIP = Rs;
  Ht.REMOVE = ie;
  function Ge(t, e, n, r) {
    let i = Cs(t, e, n, r);
    if (G.isNode(i) || G.isPair(i)) return (As(t, r, i), Ge(t, i, n, r));
    if (typeof i != "symbol") {
      if (G.isCollection(e)) {
        r = Object.freeze(r.concat(e));
        for (let s = 0; s < e.items.length; ++s) {
          let o = Ge(s, e.items[s], n, r);
          if (typeof o == "number") s = o - 1;
          else {
            if (o === Q) return Q;
            o === ie && (e.items.splice(s, 1), (s -= 1));
          }
        }
      } else if (G.isPair(e)) {
        r = Object.freeze(r.concat(e));
        let s = Ge("key", e.key, n, r);
        if (s === Q) return Q;
        s === ie && (e.key = null);
        let o = Ge("value", e.value, n, r);
        if (o === Q) return Q;
        o === ie && (e.value = null);
      }
    }
    return i;
  }
  async function Yt(t, e) {
    let n = xs(e);
    G.isDocument(t)
      ? (await Ke(null, t.contents, n, Object.freeze([t]))) === ie && (t.contents = null)
      : await Ke(null, t, n, Object.freeze([]));
  }
  Yt.BREAK = Q;
  Yt.SKIP = Rs;
  Yt.REMOVE = ie;
  async function Ke(t, e, n, r) {
    let i = await Cs(t, e, n, r);
    if (G.isNode(i) || G.isPair(i)) return (As(t, r, i), Ke(t, i, n, r));
    if (typeof i != "symbol") {
      if (G.isCollection(e)) {
        r = Object.freeze(r.concat(e));
        for (let s = 0; s < e.items.length; ++s) {
          let o = await Ke(s, e.items[s], n, r);
          if (typeof o == "number") s = o - 1;
          else {
            if (o === Q) return Q;
            o === ie && (e.items.splice(s, 1), (s -= 1));
          }
        }
      } else if (G.isPair(e)) {
        r = Object.freeze(r.concat(e));
        let s = await Ke("key", e.key, n, r);
        if (s === Q) return Q;
        s === ie && (e.key = null);
        let o = await Ke("value", e.value, n, r);
        if (o === Q) return Q;
        o === ie && (e.value = null);
      }
    }
    return i;
  }
  function xs(t) {
    return typeof t == "object" && (t.Collection || t.Node || t.Value)
      ? Object.assign(
          { Alias: t.Node, Map: t.Node, Scalar: t.Node, Seq: t.Node },
          t.Value && { Map: t.Value, Scalar: t.Value, Seq: t.Value },
          t.Collection && { Map: t.Collection, Seq: t.Collection },
          t,
        )
      : t;
  }
  function Cs(t, e, n, r) {
    if (typeof n == "function") return n(t, e, r);
    if (G.isMap(e)) return n.Map?.(t, e, r);
    if (G.isSeq(e)) return n.Seq?.(t, e, r);
    if (G.isPair(e)) return n.Pair?.(t, e, r);
    if (G.isScalar(e)) return n.Scalar?.(t, e, r);
    if (G.isAlias(e)) return n.Alias?.(t, e, r);
  }
  function As(t, e, n) {
    let r = e[e.length - 1];
    if (G.isCollection(r)) r.items[t] = n;
    else if (G.isPair(r)) t === "key" ? (r.key = n) : (r.value = n);
    else if (G.isDocument(r)) r.contents = n;
    else {
      let i = G.isAlias(r) ? "alias" : "scalar";
      throw new Error(`Cannot replace node with ${i} parent`);
    }
  }
  lr.visit = Ht;
  lr.visitAsync = Yt;
});
var ur = I((Us) => {
  "use strict";
  var Ns = C(),
    gu = it(),
    mu = { "!": "%21", ",": "%2C", "[": "%5B", "]": "%5D", "{": "%7B", "}": "%7D" },
    Su = (t) => t.replace(/[!,[\]{}]/g, (e) => mu[e]),
    st = class t {
      constructor(e, n) {
        ((this.docStart = null),
          (this.docEnd = !1),
          (this.yaml = Object.assign({}, t.defaultYaml, e)),
          (this.tags = Object.assign({}, t.defaultTags, n)));
      }
      clone() {
        let e = new t(this.yaml, this.tags);
        return ((e.docStart = this.docStart), e);
      }
      atDocument() {
        let e = new t(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = !0;
            break;
          case "1.2":
            ((this.atNextDocument = !1),
              (this.yaml = { explicit: t.defaultYaml.explicit, version: "1.2" }),
              (this.tags = Object.assign({}, t.defaultTags)));
            break;
        }
        return e;
      }
      add(e, n) {
        this.atNextDocument &&
          ((this.yaml = { explicit: t.defaultYaml.explicit, version: "1.1" }),
          (this.tags = Object.assign({}, t.defaultTags)),
          (this.atNextDocument = !1));
        let r = e.trim().split(/[ \t]+/),
          i = r.shift();
        switch (i) {
          case "%TAG": {
            if (r.length !== 2 && (n(0, "%TAG directive should contain exactly two parts"), r.length < 2)) return !1;
            let [s, o] = r;
            return ((this.tags[s] = o), !0);
          }
          case "%YAML": {
            if (((this.yaml.explicit = !0), r.length !== 1))
              return (n(0, "%YAML directive should contain exactly one part"), !1);
            let [s] = r;
            if (s === "1.1" || s === "1.2") return ((this.yaml.version = s), !0);
            {
              let o = /^\d+\.\d+$/.test(s);
              return (n(6, `Unsupported YAML version ${s}`, o), !1);
            }
          }
          default:
            return (n(0, `Unknown directive ${i}`, !0), !1);
        }
      }
      tagName(e, n) {
        if (e === "!") return "!";
        if (e[0] !== "!") return (n(`Not a valid tag: ${e}`), null);
        if (e[1] === "<") {
          let o = e.slice(2, -1);
          return o === "!" || o === "!!"
            ? (n(`Verbatim tags aren't resolved, so ${e} is invalid.`), null)
            : (e[e.length - 1] !== ">" && n("Verbatim tags must end with a >"), o);
        }
        let [, r, i] = e.match(/^(.*!)([^!]*)$/s);
        i || n(`The ${e} tag has no suffix`);
        let s = this.tags[r];
        if (s)
          try {
            return s + decodeURIComponent(i);
          } catch (o) {
            return (n(String(o)), null);
          }
        return r === "!" ? e : (n(`Could not resolve tag: ${e}`), null);
      }
      tagString(e) {
        for (let [n, r] of Object.entries(this.tags)) if (e.startsWith(r)) return n + Su(e.substring(r.length));
        return e[0] === "!" ? e : `!<${e}>`;
      }
      toString(e) {
        let n = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [],
          r = Object.entries(this.tags),
          i;
        if (e && r.length > 0 && Ns.isNode(e.contents)) {
          let s = {};
          (gu.visit(e.contents, (o, a) => {
            Ns.isNode(a) && a.tag && (s[a.tag] = !0);
          }),
            (i = Object.keys(s)));
        } else i = [];
        for (let [s, o] of r)
          (s === "!!" && o === "tag:yaml.org,2002:") ||
            ((!e || i.some((a) => a.startsWith(o))) && n.push(`%TAG ${s} ${o}`));
        return n.join(`
`);
      }
    };
  st.defaultYaml = { explicit: !1, version: "1.2" };
  st.defaultTags = { "!!": "tag:yaml.org,2002:" };
  Us.Directives = st;
});
var zt = I((ot) => {
  "use strict";
  var Ls = C(),
    _u = it();
  function Iu(t) {
    if (/[\x00-\x19\s,[\]{}]/.test(t)) {
      let n = `Anchor must not contain whitespace or control characters: ${JSON.stringify(t)}`;
      throw new Error(n);
    }
    return !0;
  }
  function Ds(t) {
    let e = new Set();
    return (
      _u.visit(t, {
        Value(n, r) {
          r.anchor && e.add(r.anchor);
        },
      }),
      e
    );
  }
  function Ms(t, e) {
    for (let n = 1; ; ++n) {
      let r = `${t}${n}`;
      if (!e.has(r)) return r;
    }
  }
  function bu(t, e) {
    let n = [],
      r = new Map(),
      i = null;
    return {
      onAnchor: (s) => {
        (n.push(s), i ?? (i = Ds(t)));
        let o = Ms(e, i);
        return (i.add(o), o);
      },
      setAnchors: () => {
        for (let s of n) {
          let o = r.get(s);
          if (typeof o == "object" && o.anchor && (Ls.isScalar(o.node) || Ls.isCollection(o.node)))
            o.node.anchor = o.anchor;
          else {
            let a = new Error("Failed to resolve repeated object (this should not happen)");
            throw ((a.source = s), a);
          }
        }
      },
      sourceObjects: r,
    };
  }
  ot.anchorIsValid = Iu;
  ot.anchorNames = Ds;
  ot.createNodeAnchors = bu;
  ot.findNewAnchor = Ms;
});
var fr = I((Os) => {
  "use strict";
  function at(t, e, n, r) {
    if (r && typeof r == "object")
      if (Array.isArray(r))
        for (let i = 0, s = r.length; i < s; ++i) {
          let o = r[i],
            a = at(t, r, String(i), o);
          a === void 0 ? delete r[i] : a !== o && (r[i] = a);
        }
      else if (r instanceof Map)
        for (let i of Array.from(r.keys())) {
          let s = r.get(i),
            o = at(t, r, i, s);
          o === void 0 ? r.delete(i) : o !== s && r.set(i, o);
        }
      else if (r instanceof Set)
        for (let i of Array.from(r)) {
          let s = at(t, r, i, i);
          s === void 0 ? r.delete(i) : s !== i && (r.delete(i), r.add(s));
        }
      else
        for (let [i, s] of Object.entries(r)) {
          let o = at(t, r, i, s);
          o === void 0 ? delete r[i] : o !== s && (r[i] = o);
        }
    return t.call(e, n, r);
  }
  Os.applyReviver = at;
});
var ye = I(($s) => {
  "use strict";
  var Eu = C();
  function Vs(t, e, n) {
    if (Array.isArray(t)) return t.map((r, i) => Vs(r, String(i), n));
    if (t && typeof t.toJSON == "function") {
      if (!n || !Eu.hasAnchor(t)) return t.toJSON(e, n);
      let r = { aliasCount: 0, count: 1, res: void 0 };
      (n.anchors.set(t, r),
        (n.onCreate = (s) => {
          ((r.res = s), delete n.onCreate);
        }));
      let i = t.toJSON(e, n);
      return (n.onCreate && n.onCreate(i), i);
    }
    return typeof t == "bigint" && !n?.keep ? Number(t) : t;
  }
  $s.toJS = Vs;
});
var Jt = I((Fs) => {
  "use strict";
  var Pu = fr(),
    js = C(),
    wu = ye(),
    dr = class {
      constructor(e) {
        Object.defineProperty(this, js.NODE_TYPE, { value: e });
      }
      clone() {
        let e = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        return (this.range && (e.range = this.range.slice()), e);
      }
      toJS(e, { mapAsMap: n, maxAliasCount: r, onAnchor: i, reviver: s } = {}) {
        if (!js.isDocument(e)) throw new TypeError("A document argument is required");
        let o = {
            anchors: new Map(),
            doc: e,
            keep: !0,
            mapAsMap: n === !0,
            mapKeyWarned: !1,
            maxAliasCount: typeof r == "number" ? r : 100,
          },
          a = wu.toJS(this, "", o);
        if (typeof i == "function") for (let { count: c, res: l } of o.anchors.values()) i(l, c);
        return typeof s == "function" ? Pu.applyReviver(s, { "": a }, "", a) : a;
      }
    };
  Fs.NodeBase = dr;
});
var ct = I((qs) => {
  "use strict";
  var vu = zt(),
    Tu = it(),
    We = C(),
    ku = Jt(),
    Ru = ye(),
    pr = class extends ku.NodeBase {
      constructor(e) {
        (super(We.ALIAS),
          (this.source = e),
          Object.defineProperty(this, "tag", {
            set() {
              throw new Error("Alias nodes cannot have tags");
            },
          }));
      }
      resolve(e, n) {
        if (n?.maxAliasCount === 0) throw new ReferenceError("Alias resolution is disabled");
        let r;
        n?.aliasResolveCache
          ? (r = n.aliasResolveCache)
          : ((r = []),
            Tu.visit(e, {
              Node: (s, o) => {
                (We.isAlias(o) || We.hasAnchor(o)) && r.push(o);
              },
            }),
            n && (n.aliasResolveCache = r));
        let i;
        for (let s of r) {
          if (s === this) break;
          s.anchor === this.source && (i = s);
        }
        return i;
      }
      toJSON(e, n) {
        if (!n) return { source: this.source };
        let { anchors: r, doc: i, maxAliasCount: s } = n,
          o = this.resolve(i, n);
        if (!o) {
          let c = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(c);
        }
        let a = r.get(o);
        if ((a || (Ru.toJS(o, null, n), (a = r.get(o))), a?.res === void 0)) {
          let c = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(c);
        }
        if (
          s >= 0 &&
          ((a.count += 1), a.aliasCount === 0 && (a.aliasCount = Xt(i, o, r)), a.count * a.aliasCount > s)
        ) {
          let c = "Excessive alias count indicates a resource exhaustion attack";
          throw new ReferenceError(c);
        }
        return a.res;
      }
      toString(e, n, r) {
        let i = `*${this.source}`;
        if (e) {
          if ((vu.anchorIsValid(this.source), e.options.verifyAliasOrder && !e.anchors.has(this.source))) {
            let s = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(s);
          }
          if (e.implicitKey) return `${i} `;
        }
        return i;
      }
    };
  function Xt(t, e, n) {
    if (We.isAlias(e)) {
      let r = e.resolve(t),
        i = n && r && n.get(r);
      return i ? i.count * i.aliasCount : 0;
    } else if (We.isCollection(e)) {
      let r = 0;
      for (let i of e.items) {
        let s = Xt(t, i, n);
        s > r && (r = s);
      }
      return r;
    } else if (We.isPair(e)) {
      let r = Xt(t, e.key, n),
        i = Xt(t, e.value, n);
      return Math.max(r, i);
    }
    return 1;
  }
  qs.Alias = pr;
});
var F = I((hr) => {
  "use strict";
  var xu = C(),
    Cu = Jt(),
    Au = ye(),
    Nu = (t) => !t || (typeof t != "function" && typeof t != "object"),
    ge = class extends Cu.NodeBase {
      constructor(e) {
        (super(xu.SCALAR), (this.value = e));
      }
      toJSON(e, n) {
        return n?.keep ? this.value : Au.toJS(this.value, e, n);
      }
      toString() {
        return String(this.value);
      }
    };
  ge.BLOCK_FOLDED = "BLOCK_FOLDED";
  ge.BLOCK_LITERAL = "BLOCK_LITERAL";
  ge.PLAIN = "PLAIN";
  ge.QUOTE_DOUBLE = "QUOTE_DOUBLE";
  ge.QUOTE_SINGLE = "QUOTE_SINGLE";
  hr.Scalar = ge;
  hr.isScalarValue = Nu;
});
var lt = I((Gs) => {
  "use strict";
  var Uu = ct(),
    Ce = C(),
    Bs = F(),
    Lu = "tag:yaml.org,2002:";
  function Du(t, e, n) {
    if (e) {
      let r = n.filter((s) => s.tag === e),
        i = r.find((s) => !s.format) ?? r[0];
      if (!i) throw new Error(`Tag ${e} not found`);
      return i;
    }
    return n.find((r) => r.identify?.(t) && !r.format);
  }
  function Mu(t, e, n) {
    if ((Ce.isDocument(t) && (t = t.contents), Ce.isNode(t))) return t;
    if (Ce.isPair(t)) {
      let u = n.schema[Ce.MAP].createNode?.(n.schema, null, n);
      return (u.items.push(t), u);
    }
    (t instanceof String ||
      t instanceof Number ||
      t instanceof Boolean ||
      (typeof BigInt < "u" && t instanceof BigInt)) &&
      (t = t.valueOf());
    let { aliasDuplicateObjects: r, onAnchor: i, onTagObj: s, schema: o, sourceObjects: a } = n,
      c;
    if (r && t && typeof t == "object") {
      if (((c = a.get(t)), c)) return (c.anchor ?? (c.anchor = i(t)), new Uu.Alias(c.anchor));
      ((c = { anchor: null, node: null }), a.set(t, c));
    }
    e?.startsWith("!!") && (e = Lu + e.slice(2));
    let l = Du(t, e, o.tags);
    if (!l) {
      if ((t && typeof t.toJSON == "function" && (t = t.toJSON()), !t || typeof t != "object")) {
        let u = new Bs.Scalar(t);
        return (c && (c.node = u), u);
      }
      l = t instanceof Map ? o[Ce.MAP] : Symbol.iterator in Object(t) ? o[Ce.SEQ] : o[Ce.MAP];
    }
    s && (s(l), delete n.onTagObj);
    let p = l?.createNode
      ? l.createNode(n.schema, t, n)
      : typeof l?.nodeClass?.from == "function"
        ? l.nodeClass.from(n.schema, t, n)
        : new Bs.Scalar(t);
    return (e ? (p.tag = e) : l.default || (p.tag = l.tag), c && (c.node = p), p);
  }
  Gs.createNode = Mu;
});
var en = I((Zt) => {
  "use strict";
  var Ou = lt(),
    se = C(),
    Vu = Jt();
  function yr(t, e, n) {
    let r = n;
    for (let i = e.length - 1; i >= 0; --i) {
      let s = e[i];
      if (typeof s == "number" && Number.isInteger(s) && s >= 0) {
        let o = [];
        ((o[s] = r), (r = o));
      } else r = new Map([[s, r]]);
    }
    return Ou.createNode(r, void 0, {
      aliasDuplicateObjects: !1,
      keepUndefined: !1,
      onAnchor: () => {
        throw new Error("This should not happen, please report a bug.");
      },
      schema: t,
      sourceObjects: new Map(),
    });
  }
  var Ks = (t) => t == null || (typeof t == "object" && !!t[Symbol.iterator]().next().done),
    gr = class extends Vu.NodeBase {
      constructor(e, n) {
        (super(e), Object.defineProperty(this, "schema", { value: n, configurable: !0, enumerable: !1, writable: !0 }));
      }
      clone(e) {
        let n = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        return (
          e && (n.schema = e),
          (n.items = n.items.map((r) => (se.isNode(r) || se.isPair(r) ? r.clone(e) : r))),
          this.range && (n.range = this.range.slice()),
          n
        );
      }
      addIn(e, n) {
        if (Ks(e)) this.add(n);
        else {
          let [r, ...i] = e,
            s = this.get(r, !0);
          if (se.isCollection(s)) s.addIn(i, n);
          else if (s === void 0 && this.schema) this.set(r, yr(this.schema, i, n));
          else throw new Error(`Expected YAML collection at ${r}. Remaining path: ${i}`);
        }
      }
      deleteIn(e) {
        let [n, ...r] = e;
        if (r.length === 0) return this.delete(n);
        let i = this.get(n, !0);
        if (se.isCollection(i)) return i.deleteIn(r);
        throw new Error(`Expected YAML collection at ${n}. Remaining path: ${r}`);
      }
      getIn(e, n) {
        let [r, ...i] = e,
          s = this.get(r, !0);
        return i.length === 0 ? (!n && se.isScalar(s) ? s.value : s) : se.isCollection(s) ? s.getIn(i, n) : void 0;
      }
      hasAllNullValues(e) {
        return this.items.every((n) => {
          if (!se.isPair(n)) return !1;
          let r = n.value;
          return r == null || (e && se.isScalar(r) && r.value == null && !r.commentBefore && !r.comment && !r.tag);
        });
      }
      hasIn(e) {
        let [n, ...r] = e;
        if (r.length === 0) return this.has(n);
        let i = this.get(n, !0);
        return se.isCollection(i) ? i.hasIn(r) : !1;
      }
      setIn(e, n) {
        let [r, ...i] = e;
        if (i.length === 0) this.set(r, n);
        else {
          let s = this.get(r, !0);
          if (se.isCollection(s)) s.setIn(i, n);
          else if (s === void 0 && this.schema) this.set(r, yr(this.schema, i, n));
          else throw new Error(`Expected YAML collection at ${r}. Remaining path: ${i}`);
        }
      }
    };
  Zt.Collection = gr;
  Zt.collectionFromPath = yr;
  Zt.isEmptyPath = Ks;
});
var ut = I((tn) => {
  "use strict";
  var $u = (t) => t.replace(/^(?!$)(?: $)?/gm, "#");
  function mr(t, e) {
    return /^\n+$/.test(t) ? t.substring(1) : e ? t.replace(/^(?! *$)/gm, e) : t;
  }
  var ju = (t, e, n) =>
    t.endsWith(`
`)
      ? mr(n, e)
      : n.includes(`
`)
        ? `
` + mr(n, e)
        : (t.endsWith(" ") ? "" : " ") + n;
  tn.indentComment = mr;
  tn.lineComment = ju;
  tn.stringifyComment = $u;
});
var Qs = I((ft) => {
  "use strict";
  var Fu = "flow",
    Sr = "block",
    nn = "quoted";
  function qu(
    t,
    e,
    n = "flow",
    { indentAtStart: r, lineWidth: i = 80, minContentWidth: s = 20, onFold: o, onOverflow: a } = {},
  ) {
    if (!i || i < 0) return t;
    i < s && (s = 0);
    let c = Math.max(1 + s, 1 + i - e.length);
    if (t.length <= c) return t;
    let l = [],
      p = {},
      u = i - e.length;
    typeof r == "number" && (r > i - Math.max(2, s) ? l.push(0) : (u = i - r));
    let d,
      y,
      m = !1,
      h = -1,
      g = -1,
      E = -1;
    n === Sr && ((h = Ws(t, h, e.length)), h !== -1 && (u = h + c));
    for (let T; (T = t[(h += 1)]);) {
      if (n === nn && T === "\\") {
        switch (((g = h), t[h + 1])) {
          case "x":
            h += 3;
            break;
          case "u":
            h += 5;
            break;
          case "U":
            h += 9;
            break;
          default:
            h += 1;
        }
        E = h;
      }
      if (
        T ===
        `
`
      )
        (n === Sr && (h = Ws(t, h, e.length)), (u = h + e.length + c), (d = void 0));
      else {
        if (
          T === " " &&
          y &&
          y !== " " &&
          y !==
            `
` &&
          y !== "	"
        ) {
          let R = t[h + 1];
          R &&
            R !== " " &&
            R !==
              `
` &&
            R !== "	" &&
            (d = h);
        }
        if (h >= u)
          if (d) (l.push(d), (u = d + c), (d = void 0));
          else if (n === nn) {
            for (; y === " " || y === "	";) ((y = T), (T = t[(h += 1)]), (m = !0));
            let R = h > E + 1 ? h - 2 : g - 1;
            if (p[R]) return t;
            (l.push(R), (p[R] = !0), (u = R + c), (d = void 0));
          } else m = !0;
      }
      y = T;
    }
    if ((m && a && a(), l.length === 0)) return t;
    o && o();
    let w = t.slice(0, l[0]);
    for (let T = 0; T < l.length; ++T) {
      let R = l[T],
        v = l[T + 1] || t.length;
      R === 0
        ? (w = `
${e}${t.slice(0, v)}`)
        : (n === nn && p[R] && (w += `${t[R]}\\`),
          (w += `
${e}${t.slice(R + 1, v)}`));
    }
    return w;
  }
  function Ws(t, e, n) {
    let r = e,
      i = e + 1,
      s = t[i];
    for (; s === " " || s === "	";)
      if (e < i + n) s = t[++e];
      else {
        do s = t[++e];
        while (
          s &&
          s !==
            `
`
        );
        ((r = e), (i = e + 1), (s = t[i]));
      }
    return r;
  }
  ft.FOLD_BLOCK = Sr;
  ft.FOLD_FLOW = Fu;
  ft.FOLD_QUOTED = nn;
  ft.foldFlowLines = qu;
});
var pt = I((Hs) => {
  "use strict";
  var ee = F(),
    me = Qs(),
    sn = (t, e) => ({
      indentAtStart: e ? t.indent.length : t.indentAtStart,
      lineWidth: t.options.lineWidth,
      minContentWidth: t.options.minContentWidth,
    }),
    on = (t) => /^(%|---|\.\.\.)/m.test(t);
  function Bu(t, e, n) {
    if (!e || e < 0) return !1;
    let r = e - n,
      i = t.length;
    if (i <= r) return !1;
    for (let s = 0, o = 0; s < i; ++s)
      if (
        t[s] ===
        `
`
      ) {
        if (s - o > r) return !0;
        if (((o = s + 1), i - o <= r)) return !1;
      }
    return !0;
  }
  function dt(t, e) {
    let n = JSON.stringify(t);
    if (e.options.doubleQuotedAsJSON) return n;
    let { implicitKey: r } = e,
      i = e.options.doubleQuotedMinMultiLineLength,
      s = e.indent || (on(t) ? "  " : ""),
      o = "",
      a = 0;
    for (let c = 0, l = n[c]; l; l = n[++c])
      if (
        (l === " " &&
          n[c + 1] === "\\" &&
          n[c + 2] === "n" &&
          ((o += n.slice(a, c) + "\\ "), (c += 1), (a = c), (l = "\\")),
        l === "\\")
      )
        switch (n[c + 1]) {
          case "u":
            {
              o += n.slice(a, c);
              let p = n.substr(c + 2, 4);
              switch (p) {
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
                  p.substr(0, 2) === "00" ? (o += "\\x" + p.substr(2)) : (o += n.substr(c, 6));
              }
              ((c += 5), (a = c + 1));
            }
            break;
          case "n":
            if (r || n[c + 2] === '"' || n.length < i) c += 1;
            else {
              for (
                o +=
                  n.slice(a, c) +
                  `

`;
                n[c + 2] === "\\" && n[c + 3] === "n" && n[c + 4] !== '"';
              )
                ((o += `
`),
                  (c += 2));
              ((o += s), n[c + 2] === " " && (o += "\\"), (c += 1), (a = c + 1));
            }
            break;
          default:
            c += 1;
        }
    return ((o = a ? o + n.slice(a) : n), r ? o : me.foldFlowLines(o, s, me.FOLD_QUOTED, sn(e, !1)));
  }
  function _r(t, e) {
    if (
      e.options.singleQuote === !1 ||
      (e.implicitKey &&
        t.includes(`
`)) ||
      /[ \t]\n|\n[ \t]/.test(t)
    )
      return dt(t, e);
    let n = e.indent || (on(t) ? "  " : ""),
      r =
        "'" +
        t.replace(/'/g, "''").replace(
          /\n+/g,
          `$&
${n}`,
        ) +
        "'";
    return e.implicitKey ? r : me.foldFlowLines(r, n, me.FOLD_FLOW, sn(e, !1));
  }
  function Qe(t, e) {
    let { singleQuote: n } = e.options,
      r;
    if (n === !1) r = dt;
    else {
      let i = t.includes('"'),
        s = t.includes("'");
      i && !s ? (r = _r) : s && !i ? (r = dt) : (r = n ? _r : dt);
    }
    return r(t, e);
  }
  var Ir;
  try {
    Ir = new RegExp(
      `(^|(?<!
))
+(?!
|$)`,
      "g",
    );
  } catch {
    Ir = /\n+(?!\n|$)/g;
  }
  function rn({ comment: t, type: e, value: n }, r, i, s) {
    let { blockQuote: o, commentString: a, lineWidth: c } = r.options;
    if (!o || /\n[\t ]+$/.test(n)) return Qe(n, r);
    let l = r.indent || (r.forceBlockIndent || on(n) ? "  " : ""),
      p =
        o === "literal"
          ? !0
          : o === "folded" || e === ee.Scalar.BLOCK_FOLDED
            ? !1
            : e === ee.Scalar.BLOCK_LITERAL
              ? !0
              : !Bu(n, c, l.length);
    if (!n)
      return p
        ? `|
`
        : `>
`;
    let u, d;
    for (d = n.length; d > 0; --d) {
      let v = n[d - 1];
      if (
        v !==
          `
` &&
        v !== "	" &&
        v !== " "
      )
        break;
    }
    let y = n.substring(d),
      m = y.indexOf(`
`);
    (m === -1 ? (u = "-") : n === y || m !== y.length - 1 ? ((u = "+"), s && s()) : (u = ""),
      y &&
        ((n = n.slice(0, -y.length)),
        y[y.length - 1] ===
          `
` && (y = y.slice(0, -1)),
        (y = y.replace(Ir, `$&${l}`))));
    let h = !1,
      g,
      E = -1;
    for (g = 0; g < n.length; ++g) {
      let v = n[g];
      if (v === " ") h = !0;
      else if (
        v ===
        `
`
      )
        E = g;
      else break;
    }
    let w = n.substring(0, E < g ? E + 1 : g);
    w && ((n = n.substring(w.length)), (w = w.replace(/\n+/g, `$&${l}`)));
    let R = (h ? (l ? "2" : "1") : "") + u;
    if ((t && ((R += " " + a(t.replace(/ ?[\r\n]+/g, " "))), i && i()), !p)) {
      let v = n
          .replace(
            /\n+/g,
            `
$&`,
          )
          .replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2")
          .replace(/\n+/g, `$&${l}`),
        k = !1,
        U = sn(r, !0);
      o !== "folded" &&
        e !== ee.Scalar.BLOCK_FOLDED &&
        (U.onOverflow = () => {
          k = !0;
        });
      let P = me.foldFlowLines(`${w}${v}${y}`, l, me.FOLD_BLOCK, U);
      if (!k)
        return `>${R}
${l}${P}`;
    }
    return (
      (n = n.replace(/\n+/g, `$&${l}`)),
      `|${R}
${l}${w}${n}${y}`
    );
  }
  function Gu(t, e, n, r) {
    let { type: i, value: s } = t,
      { actualString: o, implicitKey: a, indent: c, indentStep: l, inFlow: p } = e;
    if (
      (a &&
        s.includes(`
`)) ||
      (p && /[[\]{},]/.test(s))
    )
      return Qe(s, e);
    if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(s))
      return a ||
        p ||
        !s.includes(`
`)
        ? Qe(s, e)
        : rn(t, e, n, r);
    if (
      !a &&
      !p &&
      i !== ee.Scalar.PLAIN &&
      s.includes(`
`)
    )
      return rn(t, e, n, r);
    if (on(s)) {
      if (c === "") return ((e.forceBlockIndent = !0), rn(t, e, n, r));
      if (a && c === l) return Qe(s, e);
    }
    let u = s.replace(
      /\n+/g,
      `$&
${c}`,
    );
    if (o) {
      let d = (h) => h.default && h.tag !== "tag:yaml.org,2002:str" && h.test?.test(u),
        { compat: y, tags: m } = e.doc.schema;
      if (m.some(d) || y?.some(d)) return Qe(s, e);
    }
    return a ? u : me.foldFlowLines(u, c, me.FOLD_FLOW, sn(e, !1));
  }
  function Ku(t, e, n, r) {
    let { implicitKey: i, inFlow: s } = e,
      o = typeof t.value == "string" ? t : Object.assign({}, t, { value: String(t.value) }),
      { type: a } = t;
    a !== ee.Scalar.QUOTE_DOUBLE &&
      /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value) &&
      (a = ee.Scalar.QUOTE_DOUBLE);
    let c = (p) => {
        switch (p) {
          case ee.Scalar.BLOCK_FOLDED:
          case ee.Scalar.BLOCK_LITERAL:
            return i || s ? Qe(o.value, e) : rn(o, e, n, r);
          case ee.Scalar.QUOTE_DOUBLE:
            return dt(o.value, e);
          case ee.Scalar.QUOTE_SINGLE:
            return _r(o.value, e);
          case ee.Scalar.PLAIN:
            return Gu(o, e, n, r);
          default:
            return null;
        }
      },
      l = c(a);
    if (l === null) {
      let { defaultKeyType: p, defaultStringType: u } = e.options,
        d = (i && p) || u;
      if (((l = c(d)), l === null)) throw new Error(`Unsupported default string type ${d}`);
    }
    return l;
  }
  Hs.stringifyString = Ku;
});
var ht = I((br) => {
  "use strict";
  var Wu = zt(),
    Se = C(),
    Qu = ut(),
    Hu = pt();
  function Yu(t, e) {
    let n = Object.assign(
        {
          blockQuote: !0,
          commentString: Qu.stringifyComment,
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
        t.schema.toStringOptions,
        e,
      ),
      r;
    switch (n.collectionStyle) {
      case "block":
        r = !1;
        break;
      case "flow":
        r = !0;
        break;
      default:
        r = null;
    }
    return {
      anchors: new Set(),
      doc: t,
      flowCollectionPadding: n.flowCollectionPadding ? " " : "",
      indent: "",
      indentStep: typeof n.indent == "number" ? " ".repeat(n.indent) : "  ",
      inFlow: r,
      options: n,
    };
  }
  function zu(t, e) {
    if (e.tag) {
      let i = t.filter((s) => s.tag === e.tag);
      if (i.length > 0) return i.find((s) => s.format === e.format) ?? i[0];
    }
    let n, r;
    if (Se.isScalar(e)) {
      r = e.value;
      let i = t.filter((s) => s.identify?.(r));
      if (i.length > 1) {
        let s = i.filter((o) => o.test);
        s.length > 0 && (i = s);
      }
      n = i.find((s) => s.format === e.format) ?? i.find((s) => !s.format);
    } else ((r = e), (n = t.find((i) => i.nodeClass && r instanceof i.nodeClass)));
    if (!n) {
      let i = r?.constructor?.name ?? (r === null ? "null" : typeof r);
      throw new Error(`Tag not resolved for ${i} value`);
    }
    return n;
  }
  function Ju(t, e, { anchors: n, doc: r }) {
    if (!r.directives) return "";
    let i = [],
      s = (Se.isScalar(t) || Se.isCollection(t)) && t.anchor;
    s && Wu.anchorIsValid(s) && (n.add(s), i.push(`&${s}`));
    let o = t.tag ?? (e.default ? null : e.tag);
    return (o && i.push(r.directives.tagString(o)), i.join(" "));
  }
  function Xu(t, e, n, r) {
    if (Se.isPair(t)) return t.toString(e, n, r);
    if (Se.isAlias(t)) {
      if (e.doc.directives) return t.toString(e);
      if (e.resolvedAliases?.has(t)) throw new TypeError("Cannot stringify circular structure without alias nodes");
      (e.resolvedAliases ? e.resolvedAliases.add(t) : (e.resolvedAliases = new Set([t])), (t = t.resolve(e.doc)));
    }
    let i,
      s = Se.isNode(t) ? t : e.doc.createNode(t, { onTagObj: (c) => (i = c) });
    i ?? (i = zu(e.doc.schema.tags, s));
    let o = Ju(s, i, e);
    o.length > 0 && (e.indentAtStart = (e.indentAtStart ?? 0) + o.length + 1);
    let a =
      typeof i.stringify == "function"
        ? i.stringify(s, e, n, r)
        : Se.isScalar(s)
          ? Hu.stringifyString(s, e, n, r)
          : s.toString(e, n, r);
    return o
      ? Se.isScalar(s) || a[0] === "{" || a[0] === "["
        ? `${o} ${a}`
        : `${o}
${e.indent}${a}`
      : a;
  }
  br.createStringifyContext = Yu;
  br.stringify = Xu;
});
var Xs = I((Js) => {
  "use strict";
  var ue = C(),
    Ys = F(),
    zs = ht(),
    yt = ut();
  function Zu({ key: t, value: e }, n, r, i) {
    let {
        allNullValues: s,
        doc: o,
        indent: a,
        indentStep: c,
        options: { commentString: l, indentSeq: p, simpleKeys: u },
      } = n,
      d = (ue.isNode(t) && t.comment) || null;
    if (u) {
      if (d) throw new Error("With simple keys, key nodes cannot have comments");
      if (ue.isCollection(t) || (!ue.isNode(t) && typeof t == "object")) {
        let U = "With simple keys, collection cannot be used as a key value";
        throw new Error(U);
      }
    }
    let y =
      !u &&
      (!t ||
        (d && e == null && !n.inFlow) ||
        ue.isCollection(t) ||
        (ue.isScalar(t)
          ? t.type === Ys.Scalar.BLOCK_FOLDED || t.type === Ys.Scalar.BLOCK_LITERAL
          : typeof t == "object"));
    n = Object.assign({}, n, { allNullValues: !1, implicitKey: !y && (u || !s), indent: a + c });
    let m = !1,
      h = !1,
      g = zs.stringify(
        t,
        n,
        () => (m = !0),
        () => (h = !0),
      );
    if (!y && !n.inFlow && g.length > 1024) {
      if (u) throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
      y = !0;
    }
    if (n.inFlow) {
      if (s || e == null) return (m && r && r(), g === "" ? "?" : y ? `? ${g}` : g);
    } else if ((s && !u) || (e == null && y))
      return ((g = `? ${g}`), d && !m ? (g += yt.lineComment(g, n.indent, l(d))) : h && i && i(), g);
    (m && (d = null),
      y
        ? (d && (g += yt.lineComment(g, n.indent, l(d))),
          (g = `? ${g}
${a}:`))
        : ((g = `${g}:`), d && (g += yt.lineComment(g, n.indent, l(d)))));
    let E, w, T;
    (ue.isNode(e)
      ? ((E = !!e.spaceBefore), (w = e.commentBefore), (T = e.comment))
      : ((E = !1), (w = null), (T = null), e && typeof e == "object" && (e = o.createNode(e))),
      (n.implicitKey = !1),
      !y && !d && ue.isScalar(e) && (n.indentAtStart = g.length + 1),
      (h = !1),
      !p &&
        c.length >= 2 &&
        !n.inFlow &&
        !y &&
        ue.isSeq(e) &&
        !e.flow &&
        !e.tag &&
        !e.anchor &&
        (n.indent = n.indent.substring(2)));
    let R = !1,
      v = zs.stringify(
        e,
        n,
        () => (R = !0),
        () => (h = !0),
      ),
      k = " ";
    if (d || E || w) {
      if (
        ((k = E
          ? `
`
          : ""),
        w)
      ) {
        let U = l(w);
        k += `
${yt.indentComment(U, n.indent)}`;
      }
      v === "" && !n.inFlow
        ? k ===
            `
` &&
          T &&
          (k = `

`)
        : (k += `
${n.indent}`);
    } else if (!y && ue.isCollection(e)) {
      let U = v[0],
        P = v.indexOf(`
`),
        j = P !== -1,
        re = n.inFlow ?? e.flow ?? e.items.length === 0;
      if (j || !re) {
        let fe = !1;
        if (j && (U === "&" || U === "!")) {
          let V = v.indexOf(" ");
          (U === "&" && V !== -1 && V < P && v[V + 1] === "!" && (V = v.indexOf(" ", V + 1)),
            (V === -1 || P < V) && (fe = !0));
        }
        fe ||
          (k = `
${n.indent}`);
      }
    } else
      (v === "" ||
        v[0] ===
          `
`) &&
        (k = "");
    return (
      (g += k + v),
      n.inFlow ? R && r && r() : T && !R ? (g += yt.lineComment(g, n.indent, l(T))) : h && i && i(),
      g
    );
  }
  Js.stringifyPair = Zu;
});
var Pr = I((Er) => {
  "use strict";
  var Zs = Mt("process");
  function ef(t, ...e) {
    t === "debug" && console.log(...e);
  }
  function tf(t, e) {
    (t === "debug" || t === "warn") && (typeof Zs.emitWarning == "function" ? Zs.emitWarning(e) : console.warn(e));
  }
  Er.debug = ef;
  Er.warn = tf;
});
var fn = I((un) => {
  "use strict";
  var ln = C(),
    eo = F(),
    an = "<<",
    cn = {
      identify: (t) => t === an || (typeof t == "symbol" && t.description === an),
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new eo.Scalar(Symbol(an)), { addToJSMap: to }),
      stringify: () => an,
    },
    nf = (t, e) =>
      (cn.identify(e) || (ln.isScalar(e) && (!e.type || e.type === eo.Scalar.PLAIN) && cn.identify(e.value))) &&
      t?.doc.schema.tags.some((n) => n.tag === cn.tag && n.default);
  function to(t, e, n) {
    let r = no(t, n);
    if (ln.isSeq(r)) for (let i of r.items) wr(t, e, i);
    else if (Array.isArray(r)) for (let i of r) wr(t, e, i);
    else wr(t, e, r);
  }
  function wr(t, e, n) {
    let r = no(t, n);
    if (!ln.isMap(r)) throw new Error("Merge sources must be maps or map aliases");
    let i = r.toJSON(null, t, Map);
    for (let [s, o] of i)
      e instanceof Map
        ? e.has(s) || e.set(s, o)
        : e instanceof Set
          ? e.add(s)
          : Object.prototype.hasOwnProperty.call(e, s) ||
            Object.defineProperty(e, s, { value: o, writable: !0, enumerable: !0, configurable: !0 });
    return e;
  }
  function no(t, e) {
    return t && ln.isAlias(e) ? e.resolve(t.doc, t) : e;
  }
  un.addMergeToJSMap = to;
  un.isMergeKey = nf;
  un.merge = cn;
});
var Tr = I((so) => {
  "use strict";
  var rf = Pr(),
    ro = fn(),
    sf = ht(),
    io = C(),
    vr = ye();
  function of(t, e, { key: n, value: r }) {
    if (io.isNode(n) && n.addToJSMap) n.addToJSMap(t, e, r);
    else if (ro.isMergeKey(t, n)) ro.addMergeToJSMap(t, e, r);
    else {
      let i = vr.toJS(n, "", t);
      if (e instanceof Map) e.set(i, vr.toJS(r, i, t));
      else if (e instanceof Set) e.add(i);
      else {
        let s = af(n, i, t),
          o = vr.toJS(r, s, t);
        s in e ? Object.defineProperty(e, s, { value: o, writable: !0, enumerable: !0, configurable: !0 }) : (e[s] = o);
      }
    }
    return e;
  }
  function af(t, e, n) {
    if (e === null) return "";
    if (typeof e != "object") return String(e);
    if (io.isNode(t) && n?.doc) {
      let r = sf.createStringifyContext(n.doc, {});
      r.anchors = new Set();
      for (let s of n.anchors.keys()) r.anchors.add(s.anchor);
      ((r.inFlow = !0), (r.inStringifyKey = !0));
      let i = t.toString(r);
      if (!n.mapKeyWarned) {
        let s = JSON.stringify(i);
        (s.length > 40 && (s = s.substring(0, 36) + '..."'),
          rf.warn(
            n.doc.options.logLevel,
            `Keys with collection values will be stringified due to JS Object restrictions: ${s}. Set mapAsMap: true to use object keys.`,
          ),
          (n.mapKeyWarned = !0));
      }
      return i;
    }
    return JSON.stringify(e);
  }
  so.addPairToJSMap = of;
});
var _e = I((kr) => {
  "use strict";
  var oo = lt(),
    cf = Xs(),
    lf = Tr(),
    dn = C();
  function uf(t, e, n) {
    let r = oo.createNode(t, void 0, n),
      i = oo.createNode(e, void 0, n);
    return new pn(r, i);
  }
  var pn = class t {
    constructor(e, n = null) {
      (Object.defineProperty(this, dn.NODE_TYPE, { value: dn.PAIR }), (this.key = e), (this.value = n));
    }
    clone(e) {
      let { key: n, value: r } = this;
      return (dn.isNode(n) && (n = n.clone(e)), dn.isNode(r) && (r = r.clone(e)), new t(n, r));
    }
    toJSON(e, n) {
      let r = n?.mapAsMap ? new Map() : {};
      return lf.addPairToJSMap(n, r, this);
    }
    toString(e, n, r) {
      return e?.doc ? cf.stringifyPair(this, e, n, r) : JSON.stringify(this);
    }
  };
  kr.Pair = pn;
  kr.createPair = uf;
});
var Rr = I((co) => {
  "use strict";
  var Ae = C(),
    ao = ht(),
    hn = ut();
  function ff(t, e, n) {
    return ((e.inFlow ?? t.flow) ? pf : df)(t, e, n);
  }
  function df(
    { comment: t, items: e },
    n,
    { blockItemPrefix: r, flowChars: i, itemIndent: s, onChompKeep: o, onComment: a },
  ) {
    let {
        indent: c,
        options: { commentString: l },
      } = n,
      p = Object.assign({}, n, { indent: s, type: null }),
      u = !1,
      d = [];
    for (let m = 0; m < e.length; ++m) {
      let h = e[m],
        g = null;
      if (Ae.isNode(h)) (!u && h.spaceBefore && d.push(""), yn(n, d, h.commentBefore, u), h.comment && (g = h.comment));
      else if (Ae.isPair(h)) {
        let w = Ae.isNode(h.key) ? h.key : null;
        w && (!u && w.spaceBefore && d.push(""), yn(n, d, w.commentBefore, u));
      }
      u = !1;
      let E = ao.stringify(
        h,
        p,
        () => (g = null),
        () => (u = !0),
      );
      (g && (E += hn.lineComment(E, s, l(g))), u && g && (u = !1), d.push(r + E));
    }
    let y;
    if (d.length === 0) y = i.start + i.end;
    else {
      y = d[0];
      for (let m = 1; m < d.length; ++m) {
        let h = d[m];
        y += h
          ? `
${c}${h}`
          : `
`;
      }
    }
    return (
      t
        ? ((y +=
            `
` + hn.indentComment(l(t), c)),
          a && a())
        : u && o && o(),
      y
    );
  }
  function pf({ items: t }, e, { flowChars: n, itemIndent: r }) {
    let {
      indent: i,
      indentStep: s,
      flowCollectionPadding: o,
      options: { commentString: a },
    } = e;
    r += s;
    let c = Object.assign({}, e, { indent: r, inFlow: !0, type: null }),
      l = !1,
      p = 0,
      u = [];
    for (let m = 0; m < t.length; ++m) {
      let h = t[m],
        g = null;
      if (Ae.isNode(h)) (h.spaceBefore && u.push(""), yn(e, u, h.commentBefore, !1), h.comment && (g = h.comment));
      else if (Ae.isPair(h)) {
        let w = Ae.isNode(h.key) ? h.key : null;
        w && (w.spaceBefore && u.push(""), yn(e, u, w.commentBefore, !1), w.comment && (l = !0));
        let T = Ae.isNode(h.value) ? h.value : null;
        T
          ? (T.comment && (g = T.comment), T.commentBefore && (l = !0))
          : h.value == null && w?.comment && (g = w.comment);
      }
      g && (l = !0);
      let E = ao.stringify(h, c, () => (g = null));
      (l ||
        (l =
          u.length > p ||
          E.includes(`
`)),
        m < t.length - 1
          ? (E += ",")
          : e.options.trailingComma &&
            (e.options.lineWidth > 0 &&
              (l || (l = u.reduce((w, T) => w + T.length + 2, 2) + (E.length + 2) > e.options.lineWidth)),
            l && (E += ",")),
        g && (E += hn.lineComment(E, r, a(g))),
        u.push(E),
        (p = u.length));
    }
    let { start: d, end: y } = n;
    if (u.length === 0) return d + y;
    if (!l) {
      let m = u.reduce((h, g) => h + g.length + 2, 2);
      l = e.options.lineWidth > 0 && m > e.options.lineWidth;
    }
    if (l) {
      let m = d;
      for (let h of u)
        m += h
          ? `
${s}${i}${h}`
          : `
`;
      return `${m}
${i}${y}`;
    } else return `${d}${o}${u.join(" ")}${o}${y}`;
  }
  function yn({ indent: t, options: { commentString: e } }, n, r, i) {
    if ((r && i && (r = r.replace(/^\n+/, "")), r)) {
      let s = hn.indentComment(e(r), t);
      n.push(s.trimStart());
    }
  }
  co.stringifyCollection = ff;
});
var be = I((Cr) => {
  "use strict";
  var hf = Rr(),
    yf = Tr(),
    gf = en(),
    Ie = C(),
    gn = _e(),
    mf = F();
  function gt(t, e) {
    let n = Ie.isScalar(e) ? e.value : e;
    for (let r of t)
      if (Ie.isPair(r) && (r.key === e || r.key === n || (Ie.isScalar(r.key) && r.key.value === n))) return r;
  }
  var xr = class extends gf.Collection {
    static get tagName() {
      return "tag:yaml.org,2002:map";
    }
    constructor(e) {
      (super(Ie.MAP, e), (this.items = []));
    }
    static from(e, n, r) {
      let { keepUndefined: i, replacer: s } = r,
        o = new this(e),
        a = (c, l) => {
          if (typeof s == "function") l = s.call(n, c, l);
          else if (Array.isArray(s) && !s.includes(c)) return;
          (l !== void 0 || i) && o.items.push(gn.createPair(c, l, r));
        };
      if (n instanceof Map) for (let [c, l] of n) a(c, l);
      else if (n && typeof n == "object") for (let c of Object.keys(n)) a(c, n[c]);
      return (typeof e.sortMapEntries == "function" && o.items.sort(e.sortMapEntries), o);
    }
    add(e, n) {
      let r;
      Ie.isPair(e)
        ? (r = e)
        : !e || typeof e != "object" || !("key" in e)
          ? (r = new gn.Pair(e, e?.value))
          : (r = new gn.Pair(e.key, e.value));
      let i = gt(this.items, r.key),
        s = this.schema?.sortMapEntries;
      if (i) {
        if (!n) throw new Error(`Key ${r.key} already set`);
        Ie.isScalar(i.value) && mf.isScalarValue(r.value) ? (i.value.value = r.value) : (i.value = r.value);
      } else if (s) {
        let o = this.items.findIndex((a) => s(r, a) < 0);
        o === -1 ? this.items.push(r) : this.items.splice(o, 0, r);
      } else this.items.push(r);
    }
    delete(e) {
      let n = gt(this.items, e);
      return n ? this.items.splice(this.items.indexOf(n), 1).length > 0 : !1;
    }
    get(e, n) {
      let i = gt(this.items, e)?.value;
      return (!n && Ie.isScalar(i) ? i.value : i) ?? void 0;
    }
    has(e) {
      return !!gt(this.items, e);
    }
    set(e, n) {
      this.add(new gn.Pair(e, n), !0);
    }
    toJSON(e, n, r) {
      let i = r ? new r() : n?.mapAsMap ? new Map() : {};
      n?.onCreate && n.onCreate(i);
      for (let s of this.items) yf.addPairToJSMap(n, i, s);
      return i;
    }
    toString(e, n, r) {
      if (!e) return JSON.stringify(this);
      for (let i of this.items)
        if (!Ie.isPair(i)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(i)} instead`);
      return (
        !e.allNullValues && this.hasAllNullValues(!1) && (e = Object.assign({}, e, { allNullValues: !0 })),
        hf.stringifyCollection(this, e, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: e.indent || "",
          onChompKeep: r,
          onComment: n,
        })
      );
    }
  };
  Cr.YAMLMap = xr;
  Cr.findPair = gt;
});
var He = I((uo) => {
  "use strict";
  var Sf = C(),
    lo = be(),
    _f = {
      collection: "map",
      default: !0,
      nodeClass: lo.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(t, e) {
        return (Sf.isMap(t) || e("Expected a mapping for this tag"), t);
      },
      createNode: (t, e, n) => lo.YAMLMap.from(t, e, n),
    };
  uo.map = _f;
});
var Ee = I((fo) => {
  "use strict";
  var If = lt(),
    bf = Rr(),
    Ef = en(),
    Sn = C(),
    Pf = F(),
    wf = ye(),
    Ar = class extends Ef.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(e) {
        (super(Sn.SEQ, e), (this.items = []));
      }
      add(e) {
        this.items.push(e);
      }
      delete(e) {
        let n = mn(e);
        return typeof n != "number" ? !1 : this.items.splice(n, 1).length > 0;
      }
      get(e, n) {
        let r = mn(e);
        if (typeof r != "number") return;
        let i = this.items[r];
        return !n && Sn.isScalar(i) ? i.value : i;
      }
      has(e) {
        let n = mn(e);
        return typeof n == "number" && n < this.items.length;
      }
      set(e, n) {
        let r = mn(e);
        if (typeof r != "number") throw new Error(`Expected a valid index, not ${e}.`);
        let i = this.items[r];
        Sn.isScalar(i) && Pf.isScalarValue(n) ? (i.value = n) : (this.items[r] = n);
      }
      toJSON(e, n) {
        let r = [];
        n?.onCreate && n.onCreate(r);
        let i = 0;
        for (let s of this.items) r.push(wf.toJS(s, String(i++), n));
        return r;
      }
      toString(e, n, r) {
        return e
          ? bf.stringifyCollection(this, e, {
              blockItemPrefix: "- ",
              flowChars: { start: "[", end: "]" },
              itemIndent: (e.indent || "") + "  ",
              onChompKeep: r,
              onComment: n,
            })
          : JSON.stringify(this);
      }
      static from(e, n, r) {
        let { replacer: i } = r,
          s = new this(e);
        if (n && Symbol.iterator in Object(n)) {
          let o = 0;
          for (let a of n) {
            if (typeof i == "function") {
              let c = n instanceof Set ? a : String(o++);
              a = i.call(n, c, a);
            }
            s.items.push(If.createNode(a, void 0, r));
          }
        }
        return s;
      }
    };
  function mn(t) {
    let e = Sn.isScalar(t) ? t.value : t;
    return (
      e && typeof e == "string" && (e = Number(e)),
      typeof e == "number" && Number.isInteger(e) && e >= 0 ? e : null
    );
  }
  fo.YAMLSeq = Ar;
});
var Ye = I((ho) => {
  "use strict";
  var vf = C(),
    po = Ee(),
    Tf = {
      collection: "seq",
      default: !0,
      nodeClass: po.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(t, e) {
        return (vf.isSeq(t) || e("Expected a sequence for this tag"), t);
      },
      createNode: (t, e, n) => po.YAMLSeq.from(t, e, n),
    };
  ho.seq = Tf;
});
var mt = I((yo) => {
  "use strict";
  var kf = pt(),
    Rf = {
      identify: (t) => typeof t == "string",
      default: !0,
      tag: "tag:yaml.org,2002:str",
      resolve: (t) => t,
      stringify(t, e, n, r) {
        return ((e = Object.assign({ actualString: !0 }, e)), kf.stringifyString(t, e, n, r));
      },
    };
  yo.string = Rf;
});
var _n = I((So) => {
  "use strict";
  var go = F(),
    mo = {
      identify: (t) => t == null,
      createNode: () => new go.Scalar(null),
      default: !0,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new go.Scalar(null),
      stringify: ({ source: t }, e) => (typeof t == "string" && mo.test.test(t) ? t : e.options.nullStr),
    };
  So.nullTag = mo;
});
var Nr = I((Io) => {
  "use strict";
  var xf = F(),
    _o = {
      identify: (t) => typeof t == "boolean",
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (t) => new xf.Scalar(t[0] === "t" || t[0] === "T"),
      stringify({ source: t, value: e }, n) {
        if (t && _o.test.test(t)) {
          let r = t[0] === "t" || t[0] === "T";
          if (e === r) return t;
        }
        return e ? n.options.trueStr : n.options.falseStr;
      },
    };
  Io.boolTag = _o;
});
var ze = I((bo) => {
  "use strict";
  function Cf({ format: t, minFractionDigits: e, tag: n, value: r }) {
    if (typeof r == "bigint") return String(r);
    let i = typeof r == "number" ? r : Number(r);
    if (!isFinite(i)) return isNaN(i) ? ".nan" : i < 0 ? "-.inf" : ".inf";
    let s = Object.is(r, -0) ? "-0" : JSON.stringify(r);
    if (!t && e && (!n || n === "tag:yaml.org,2002:float") && /^-?\d/.test(s) && !s.includes("e")) {
      let o = s.indexOf(".");
      o < 0 && ((o = s.length), (s += "."));
      let a = e - (s.length - o - 1);
      for (; a-- > 0;) s += "0";
    }
    return s;
  }
  bo.stringifyNumber = Cf;
});
var Lr = I((In) => {
  "use strict";
  var Af = F(),
    Ur = ze(),
    Nf = {
      identify: (t) => typeof t == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (t) =>
        t.slice(-3).toLowerCase() === "nan" ? NaN : t[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: Ur.stringifyNumber,
    },
    Uf = {
      identify: (t) => typeof t == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (t) => parseFloat(t),
      stringify(t) {
        let e = Number(t.value);
        return isFinite(e) ? e.toExponential() : Ur.stringifyNumber(t);
      },
    },
    Lf = {
      identify: (t) => typeof t == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(t) {
        let e = new Af.Scalar(parseFloat(t)),
          n = t.indexOf(".");
        return (n !== -1 && t[t.length - 1] === "0" && (e.minFractionDigits = t.length - n - 1), e);
      },
      stringify: Ur.stringifyNumber,
    };
  In.float = Lf;
  In.floatExp = Uf;
  In.floatNaN = Nf;
});
var Mr = I((En) => {
  "use strict";
  var Eo = ze(),
    bn = (t) => typeof t == "bigint" || Number.isInteger(t),
    Dr = (t, e, n, { intAsBigInt: r }) => (r ? BigInt(t) : parseInt(t.substring(e), n));
  function Po(t, e, n) {
    let { value: r } = t;
    return bn(r) && r >= 0 ? n + r.toString(e) : Eo.stringifyNumber(t);
  }
  var Df = {
      identify: (t) => bn(t) && t >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (t, e, n) => Dr(t, 2, 8, n),
      stringify: (t) => Po(t, 8, "0o"),
    },
    Mf = {
      identify: bn,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (t, e, n) => Dr(t, 0, 10, n),
      stringify: Eo.stringifyNumber,
    },
    Of = {
      identify: (t) => bn(t) && t >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (t, e, n) => Dr(t, 2, 16, n),
      stringify: (t) => Po(t, 16, "0x"),
    };
  En.int = Mf;
  En.intHex = Of;
  En.intOct = Df;
});
var vo = I((wo) => {
  "use strict";
  var Vf = He(),
    $f = _n(),
    jf = Ye(),
    Ff = mt(),
    qf = Nr(),
    Or = Lr(),
    Vr = Mr(),
    Bf = [
      Vf.map,
      jf.seq,
      Ff.string,
      $f.nullTag,
      qf.boolTag,
      Vr.intOct,
      Vr.int,
      Vr.intHex,
      Or.floatNaN,
      Or.floatExp,
      Or.float,
    ];
  wo.schema = Bf;
});
var Ro = I((ko) => {
  "use strict";
  var Gf = F(),
    Kf = He(),
    Wf = Ye();
  function To(t) {
    return typeof t == "bigint" || Number.isInteger(t);
  }
  var Pn = ({ value: t }) => JSON.stringify(t),
    Qf = [
      {
        identify: (t) => typeof t == "string",
        default: !0,
        tag: "tag:yaml.org,2002:str",
        resolve: (t) => t,
        stringify: Pn,
      },
      {
        identify: (t) => t == null,
        createNode: () => new Gf.Scalar(null),
        default: !0,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: Pn,
      },
      {
        identify: (t) => typeof t == "boolean",
        default: !0,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (t) => t === "true",
        stringify: Pn,
      },
      {
        identify: To,
        default: !0,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (t, e, { intAsBigInt: n }) => (n ? BigInt(t) : parseInt(t, 10)),
        stringify: ({ value: t }) => (To(t) ? t.toString() : JSON.stringify(t)),
      },
      {
        identify: (t) => typeof t == "number",
        default: !0,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (t) => parseFloat(t),
        stringify: Pn,
      },
    ],
    Hf = {
      default: !0,
      tag: "",
      test: /^/,
      resolve(t, e) {
        return (e(`Unresolved plain scalar ${JSON.stringify(t)}`), t);
      },
    },
    Yf = [Kf.map, Wf.seq].concat(Qf, Hf);
  ko.schema = Yf;
});
var jr = I((xo) => {
  "use strict";
  var St = Mt("buffer"),
    $r = F(),
    zf = pt(),
    Jf = {
      identify: (t) => t instanceof Uint8Array,
      default: !1,
      tag: "tag:yaml.org,2002:binary",
      resolve(t, e) {
        if (typeof St.Buffer == "function") return St.Buffer.from(t, "base64");
        if (typeof atob == "function") {
          let n = atob(t.replace(/[\n\r]/g, "")),
            r = new Uint8Array(n.length);
          for (let i = 0; i < n.length; ++i) r[i] = n.charCodeAt(i);
          return r;
        } else
          return (e("This environment does not support reading binary tags; either Buffer or atob is required"), t);
      },
      stringify({ comment: t, type: e, value: n }, r, i, s) {
        if (!n) return "";
        let o = n,
          a;
        if (typeof St.Buffer == "function")
          a = o instanceof St.Buffer ? o.toString("base64") : St.Buffer.from(o.buffer).toString("base64");
        else if (typeof btoa == "function") {
          let c = "";
          for (let l = 0; l < o.length; ++l) c += String.fromCharCode(o[l]);
          a = btoa(c);
        } else
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        if ((e ?? (e = $r.Scalar.BLOCK_LITERAL), e !== $r.Scalar.QUOTE_DOUBLE)) {
          let c = Math.max(r.options.lineWidth - r.indent.length, r.options.minContentWidth),
            l = Math.ceil(a.length / c),
            p = new Array(l);
          for (let u = 0, d = 0; u < l; ++u, d += c) p[u] = a.substr(d, c);
          a = p.join(
            e === $r.Scalar.BLOCK_LITERAL
              ? `
`
              : " ",
          );
        }
        return zf.stringifyString({ comment: t, type: e, value: a }, r, i, s);
      },
    };
  xo.binary = Jf;
});
var Tn = I((vn) => {
  "use strict";
  var wn = C(),
    Fr = _e(),
    Xf = F(),
    Zf = Ee();
  function Co(t, e) {
    if (wn.isSeq(t))
      for (let n = 0; n < t.items.length; ++n) {
        let r = t.items[n];
        if (!wn.isPair(r)) {
          if (wn.isMap(r)) {
            r.items.length > 1 && e("Each pair must have its own sequence indicator");
            let i = r.items[0] || new Fr.Pair(new Xf.Scalar(null));
            if (
              (r.commentBefore &&
                (i.key.commentBefore = i.key.commentBefore
                  ? `${r.commentBefore}
${i.key.commentBefore}`
                  : r.commentBefore),
              r.comment)
            ) {
              let s = i.value ?? i.key;
              s.comment = s.comment
                ? `${r.comment}
${s.comment}`
                : r.comment;
            }
            r = i;
          }
          t.items[n] = wn.isPair(r) ? r : new Fr.Pair(r);
        }
      }
    else e("Expected a sequence for this tag");
    return t;
  }
  function Ao(t, e, n) {
    let { replacer: r } = n,
      i = new Zf.YAMLSeq(t);
    i.tag = "tag:yaml.org,2002:pairs";
    let s = 0;
    if (e && Symbol.iterator in Object(e))
      for (let o of e) {
        typeof r == "function" && (o = r.call(e, String(s++), o));
        let a, c;
        if (Array.isArray(o))
          if (o.length === 2) ((a = o[0]), (c = o[1]));
          else throw new TypeError(`Expected [key, value] tuple: ${o}`);
        else if (o && o instanceof Object) {
          let l = Object.keys(o);
          if (l.length === 1) ((a = l[0]), (c = o[a]));
          else throw new TypeError(`Expected tuple with one key, not ${l.length} keys`);
        } else a = o;
        i.items.push(Fr.createPair(a, c, n));
      }
    return i;
  }
  var ed = { collection: "seq", default: !1, tag: "tag:yaml.org,2002:pairs", resolve: Co, createNode: Ao };
  vn.createPairs = Ao;
  vn.pairs = ed;
  vn.resolvePairs = Co;
});
var Gr = I((Br) => {
  "use strict";
  var No = C(),
    qr = ye(),
    _t = be(),
    td = Ee(),
    Uo = Tn(),
    Ne = class t extends td.YAMLSeq {
      constructor() {
        (super(),
          (this.add = _t.YAMLMap.prototype.add.bind(this)),
          (this.delete = _t.YAMLMap.prototype.delete.bind(this)),
          (this.get = _t.YAMLMap.prototype.get.bind(this)),
          (this.has = _t.YAMLMap.prototype.has.bind(this)),
          (this.set = _t.YAMLMap.prototype.set.bind(this)),
          (this.tag = t.tag));
      }
      toJSON(e, n) {
        if (!n) return super.toJSON(e);
        let r = new Map();
        n?.onCreate && n.onCreate(r);
        for (let i of this.items) {
          let s, o;
          if (
            (No.isPair(i) ? ((s = qr.toJS(i.key, "", n)), (o = qr.toJS(i.value, s, n))) : (s = qr.toJS(i, "", n)),
            r.has(s))
          )
            throw new Error("Ordered maps must not include duplicate keys");
          r.set(s, o);
        }
        return r;
      }
      static from(e, n, r) {
        let i = Uo.createPairs(e, n, r),
          s = new this();
        return ((s.items = i.items), s);
      }
    };
  Ne.tag = "tag:yaml.org,2002:omap";
  var nd = {
    collection: "seq",
    identify: (t) => t instanceof Map,
    nodeClass: Ne,
    default: !1,
    tag: "tag:yaml.org,2002:omap",
    resolve(t, e) {
      let n = Uo.resolvePairs(t, e),
        r = [];
      for (let { key: i } of n.items)
        No.isScalar(i) &&
          (r.includes(i.value) ? e(`Ordered maps must not include duplicate keys: ${i.value}`) : r.push(i.value));
      return Object.assign(new Ne(), n);
    },
    createNode: (t, e, n) => Ne.from(t, e, n),
  };
  Br.YAMLOMap = Ne;
  Br.omap = nd;
});
var Vo = I((Kr) => {
  "use strict";
  var Lo = F();
  function Do({ value: t, source: e }, n) {
    return e && (t ? Mo : Oo).test.test(e) ? e : t ? n.options.trueStr : n.options.falseStr;
  }
  var Mo = {
      identify: (t) => t === !0,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Lo.Scalar(!0),
      stringify: Do,
    },
    Oo = {
      identify: (t) => t === !1,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Lo.Scalar(!1),
      stringify: Do,
    };
  Kr.falseTag = Oo;
  Kr.trueTag = Mo;
});
var $o = I((kn) => {
  "use strict";
  var rd = F(),
    Wr = ze(),
    id = {
      identify: (t) => typeof t == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (t) =>
        t.slice(-3).toLowerCase() === "nan" ? NaN : t[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: Wr.stringifyNumber,
    },
    sd = {
      identify: (t) => typeof t == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (t) => parseFloat(t.replace(/_/g, "")),
      stringify(t) {
        let e = Number(t.value);
        return isFinite(e) ? e.toExponential() : Wr.stringifyNumber(t);
      },
    },
    od = {
      identify: (t) => typeof t == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(t) {
        let e = new rd.Scalar(parseFloat(t.replace(/_/g, ""))),
          n = t.indexOf(".");
        if (n !== -1) {
          let r = t.substring(n + 1).replace(/_/g, "");
          r[r.length - 1] === "0" && (e.minFractionDigits = r.length);
        }
        return e;
      },
      stringify: Wr.stringifyNumber,
    };
  kn.float = od;
  kn.floatExp = sd;
  kn.floatNaN = id;
});
var Fo = I((bt) => {
  "use strict";
  var jo = ze(),
    It = (t) => typeof t == "bigint" || Number.isInteger(t);
  function Rn(t, e, n, { intAsBigInt: r }) {
    let i = t[0];
    if (((i === "-" || i === "+") && (e += 1), (t = t.substring(e).replace(/_/g, "")), r)) {
      switch (n) {
        case 2:
          t = `0b${t}`;
          break;
        case 8:
          t = `0o${t}`;
          break;
        case 16:
          t = `0x${t}`;
          break;
      }
      let o = BigInt(t);
      return i === "-" ? BigInt(-1) * o : o;
    }
    let s = parseInt(t, n);
    return i === "-" ? -1 * s : s;
  }
  function Qr(t, e, n) {
    let { value: r } = t;
    if (It(r)) {
      let i = r.toString(e);
      return r < 0 ? "-" + n + i.substr(1) : n + i;
    }
    return jo.stringifyNumber(t);
  }
  var ad = {
      identify: It,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (t, e, n) => Rn(t, 2, 2, n),
      stringify: (t) => Qr(t, 2, "0b"),
    },
    cd = {
      identify: It,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (t, e, n) => Rn(t, 1, 8, n),
      stringify: (t) => Qr(t, 8, "0"),
    },
    ld = {
      identify: It,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (t, e, n) => Rn(t, 0, 10, n),
      stringify: jo.stringifyNumber,
    },
    ud = {
      identify: It,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (t, e, n) => Rn(t, 2, 16, n),
      stringify: (t) => Qr(t, 16, "0x"),
    };
  bt.int = ld;
  bt.intBin = ad;
  bt.intHex = ud;
  bt.intOct = cd;
});
var Yr = I((Hr) => {
  "use strict";
  var An = C(),
    xn = _e(),
    Cn = be(),
    Ue = class t extends Cn.YAMLMap {
      constructor(e) {
        (super(e), (this.tag = t.tag));
      }
      add(e) {
        let n;
        (An.isPair(e)
          ? (n = e)
          : e && typeof e == "object" && "key" in e && "value" in e && e.value === null
            ? (n = new xn.Pair(e.key, null))
            : (n = new xn.Pair(e, null)),
          Cn.findPair(this.items, n.key) || this.items.push(n));
      }
      get(e, n) {
        let r = Cn.findPair(this.items, e);
        return !n && An.isPair(r) ? (An.isScalar(r.key) ? r.key.value : r.key) : r;
      }
      set(e, n) {
        if (typeof n != "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof n}`);
        let r = Cn.findPair(this.items, e);
        r && !n ? this.items.splice(this.items.indexOf(r), 1) : !r && n && this.items.push(new xn.Pair(e));
      }
      toJSON(e, n) {
        return super.toJSON(e, n, Set);
      }
      toString(e, n, r) {
        if (!e) return JSON.stringify(this);
        if (this.hasAllNullValues(!0)) return super.toString(Object.assign({}, e, { allNullValues: !0 }), n, r);
        throw new Error("Set items must all have null values");
      }
      static from(e, n, r) {
        let { replacer: i } = r,
          s = new this(e);
        if (n && Symbol.iterator in Object(n))
          for (let o of n) (typeof i == "function" && (o = i.call(n, o, o)), s.items.push(xn.createPair(o, null, r)));
        return s;
      }
    };
  Ue.tag = "tag:yaml.org,2002:set";
  var fd = {
    collection: "map",
    identify: (t) => t instanceof Set,
    nodeClass: Ue,
    default: !1,
    tag: "tag:yaml.org,2002:set",
    createNode: (t, e, n) => Ue.from(t, e, n),
    resolve(t, e) {
      if (An.isMap(t)) {
        if (t.hasAllNullValues(!0)) return Object.assign(new Ue(), t);
        e("Set items must all have null values");
      } else e("Expected a mapping for this tag");
      return t;
    },
  };
  Hr.YAMLSet = Ue;
  Hr.set = fd;
});
var Jr = I((Nn) => {
  "use strict";
  var dd = ze();
  function zr(t, e) {
    let n = t[0],
      r = n === "-" || n === "+" ? t.substring(1) : t,
      i = (o) => (e ? BigInt(o) : Number(o)),
      s = r
        .replace(/_/g, "")
        .split(":")
        .reduce((o, a) => o * i(60) + i(a), i(0));
    return n === "-" ? i(-1) * s : s;
  }
  function qo(t) {
    let { value: e } = t,
      n = (o) => o;
    if (typeof e == "bigint") n = (o) => BigInt(o);
    else if (isNaN(e) || !isFinite(e)) return dd.stringifyNumber(t);
    let r = "";
    e < 0 && ((r = "-"), (e *= n(-1)));
    let i = n(60),
      s = [e % i];
    return (
      e < 60 ? s.unshift(0) : ((e = (e - s[0]) / i), s.unshift(e % i), e >= 60 && ((e = (e - s[0]) / i), s.unshift(e))),
      r +
        s
          .map((o) => String(o).padStart(2, "0"))
          .join(":")
          .replace(/000000\d*$/, "")
    );
  }
  var pd = {
      identify: (t) => typeof t == "bigint" || Number.isInteger(t),
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (t, e, { intAsBigInt: n }) => zr(t, n),
      stringify: qo,
    },
    hd = {
      identify: (t) => typeof t == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (t) => zr(t, !1),
      stringify: qo,
    },
    Bo = {
      identify: (t) => t instanceof Date,
      default: !0,
      tag: "tag:yaml.org,2002:timestamp",
      test: RegExp(
        "^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$",
      ),
      resolve(t) {
        let e = t.match(Bo.test);
        if (!e) throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        let [, n, r, i, s, o, a] = e.map(Number),
          c = e[7] ? Number((e[7] + "00").substr(1, 3)) : 0,
          l = Date.UTC(n, r - 1, i, s || 0, o || 0, a || 0, c),
          p = e[8];
        if (p && p !== "Z") {
          let u = zr(p, !1);
          (Math.abs(u) < 30 && (u *= 60), (l -= 6e4 * u));
        }
        return new Date(l);
      },
      stringify: ({ value: t }) => t?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? "",
    };
  Nn.floatTime = hd;
  Nn.intTime = pd;
  Nn.timestamp = Bo;
});
var Wo = I((Ko) => {
  "use strict";
  var yd = He(),
    gd = _n(),
    md = Ye(),
    Sd = mt(),
    _d = jr(),
    Go = Vo(),
    Xr = $o(),
    Un = Fo(),
    Id = fn(),
    bd = Gr(),
    Ed = Tn(),
    Pd = Yr(),
    Zr = Jr(),
    wd = [
      yd.map,
      md.seq,
      Sd.string,
      gd.nullTag,
      Go.trueTag,
      Go.falseTag,
      Un.intBin,
      Un.intOct,
      Un.int,
      Un.intHex,
      Xr.floatNaN,
      Xr.floatExp,
      Xr.float,
      _d.binary,
      Id.merge,
      bd.omap,
      Ed.pairs,
      Pd.set,
      Zr.intTime,
      Zr.floatTime,
      Zr.timestamp,
    ];
  Ko.schema = wd;
});
var na = I((ni) => {
  "use strict";
  var zo = He(),
    vd = _n(),
    Jo = Ye(),
    Td = mt(),
    kd = Nr(),
    ei = Lr(),
    ti = Mr(),
    Rd = vo(),
    xd = Ro(),
    Xo = jr(),
    Et = fn(),
    Zo = Gr(),
    ea = Tn(),
    Qo = Wo(),
    ta = Yr(),
    Ln = Jr(),
    Ho = new Map([
      ["core", Rd.schema],
      ["failsafe", [zo.map, Jo.seq, Td.string]],
      ["json", xd.schema],
      ["yaml11", Qo.schema],
      ["yaml-1.1", Qo.schema],
    ]),
    Yo = {
      binary: Xo.binary,
      bool: kd.boolTag,
      float: ei.float,
      floatExp: ei.floatExp,
      floatNaN: ei.floatNaN,
      floatTime: Ln.floatTime,
      int: ti.int,
      intHex: ti.intHex,
      intOct: ti.intOct,
      intTime: Ln.intTime,
      map: zo.map,
      merge: Et.merge,
      null: vd.nullTag,
      omap: Zo.omap,
      pairs: ea.pairs,
      seq: Jo.seq,
      set: ta.set,
      timestamp: Ln.timestamp,
    },
    Cd = {
      "tag:yaml.org,2002:binary": Xo.binary,
      "tag:yaml.org,2002:merge": Et.merge,
      "tag:yaml.org,2002:omap": Zo.omap,
      "tag:yaml.org,2002:pairs": ea.pairs,
      "tag:yaml.org,2002:set": ta.set,
      "tag:yaml.org,2002:timestamp": Ln.timestamp,
    };
  function Ad(t, e, n) {
    let r = Ho.get(e);
    if (r && !t) return n && !r.includes(Et.merge) ? r.concat(Et.merge) : r.slice();
    let i = r;
    if (!i)
      if (Array.isArray(t)) i = [];
      else {
        let s = Array.from(Ho.keys())
          .filter((o) => o !== "yaml11")
          .map((o) => JSON.stringify(o))
          .join(", ");
        throw new Error(`Unknown schema "${e}"; use one of ${s} or define customTags array`);
      }
    if (Array.isArray(t)) for (let s of t) i = i.concat(s);
    else typeof t == "function" && (i = t(i.slice()));
    return (
      n && (i = i.concat(Et.merge)),
      i.reduce((s, o) => {
        let a = typeof o == "string" ? Yo[o] : o;
        if (!a) {
          let c = JSON.stringify(o),
            l = Object.keys(Yo)
              .map((p) => JSON.stringify(p))
              .join(", ");
          throw new Error(`Unknown custom tag ${c}; use one of ${l}`);
        }
        return (s.includes(a) || s.push(a), s);
      }, [])
    );
  }
  ni.coreKnownTags = Cd;
  ni.getTags = Ad;
});
var si = I((ra) => {
  "use strict";
  var ri = C(),
    Nd = He(),
    Ud = Ye(),
    Ld = mt(),
    Dn = na(),
    Dd = (t, e) => (t.key < e.key ? -1 : t.key > e.key ? 1 : 0),
    ii = class t {
      constructor({
        compat: e,
        customTags: n,
        merge: r,
        resolveKnownTags: i,
        schema: s,
        sortMapEntries: o,
        toStringDefaults: a,
      }) {
        ((this.compat = Array.isArray(e) ? Dn.getTags(e, "compat") : e ? Dn.getTags(null, e) : null),
          (this.name = (typeof s == "string" && s) || "core"),
          (this.knownTags = i ? Dn.coreKnownTags : {}),
          (this.tags = Dn.getTags(n, this.name, r)),
          (this.toStringOptions = a ?? null),
          Object.defineProperty(this, ri.MAP, { value: Nd.map }),
          Object.defineProperty(this, ri.SCALAR, { value: Ld.string }),
          Object.defineProperty(this, ri.SEQ, { value: Ud.seq }),
          (this.sortMapEntries = typeof o == "function" ? o : o === !0 ? Dd : null));
      }
      clone() {
        let e = Object.create(t.prototype, Object.getOwnPropertyDescriptors(this));
        return ((e.tags = this.tags.slice()), e);
      }
    };
  ra.Schema = ii;
});
var sa = I((ia) => {
  "use strict";
  var Md = C(),
    oi = ht(),
    Pt = ut();
  function Od(t, e) {
    let n = [],
      r = e.directives === !0;
    if (e.directives !== !1 && t.directives) {
      let c = t.directives.toString(t);
      c ? (n.push(c), (r = !0)) : t.directives.docStart && (r = !0);
    }
    r && n.push("---");
    let i = oi.createStringifyContext(t, e),
      { commentString: s } = i.options;
    if (t.commentBefore) {
      n.length !== 1 && n.unshift("");
      let c = s(t.commentBefore);
      n.unshift(Pt.indentComment(c, ""));
    }
    let o = !1,
      a = null;
    if (t.contents) {
      if (Md.isNode(t.contents)) {
        if ((t.contents.spaceBefore && r && n.push(""), t.contents.commentBefore)) {
          let p = s(t.contents.commentBefore);
          n.push(Pt.indentComment(p, ""));
        }
        ((i.forceBlockIndent = !!t.comment), (a = t.contents.comment));
      }
      let c = a ? void 0 : () => (o = !0),
        l = oi.stringify(t.contents, i, () => (a = null), c);
      (a && (l += Pt.lineComment(l, "", s(a))),
        (l[0] === "|" || l[0] === ">") && n[n.length - 1] === "---" ? (n[n.length - 1] = `--- ${l}`) : n.push(l));
    } else n.push(oi.stringify(t.contents, i));
    if (t.directives?.docEnd)
      if (t.comment) {
        let c = s(t.comment);
        c.includes(`
`)
          ? (n.push("..."), n.push(Pt.indentComment(c, "")))
          : n.push(`... ${c}`);
      } else n.push("...");
    else {
      let c = t.comment;
      (c && o && (c = c.replace(/^\n+/, "")),
        c && ((!o || a) && n[n.length - 1] !== "" && n.push(""), n.push(Pt.indentComment(s(c), ""))));
    }
    return (
      n.join(`
`) +
      `
`
    );
  }
  ia.stringifyDocument = Od;
});
var wt = I((oa) => {
  "use strict";
  var Vd = ct(),
    Je = en(),
    J = C(),
    $d = _e(),
    jd = ye(),
    Fd = si(),
    qd = sa(),
    ai = zt(),
    Bd = fr(),
    Gd = lt(),
    ci = ur(),
    li = class t {
      constructor(e, n, r) {
        ((this.commentBefore = null),
          (this.comment = null),
          (this.errors = []),
          (this.warnings = []),
          Object.defineProperty(this, J.NODE_TYPE, { value: J.DOC }));
        let i = null;
        typeof n == "function" || Array.isArray(n) ? (i = n) : r === void 0 && n && ((r = n), (n = void 0));
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
          r,
        );
        this.options = s;
        let { version: o } = s;
        (r?._directives
          ? ((this.directives = r._directives.atDocument()),
            this.directives.yaml.explicit && (o = this.directives.yaml.version))
          : (this.directives = new ci.Directives({ version: o })),
          this.setSchema(o, r),
          (this.contents = e === void 0 ? null : this.createNode(e, i, r)));
      }
      clone() {
        let e = Object.create(t.prototype, { [J.NODE_TYPE]: { value: J.DOC } });
        return (
          (e.commentBefore = this.commentBefore),
          (e.comment = this.comment),
          (e.errors = this.errors.slice()),
          (e.warnings = this.warnings.slice()),
          (e.options = Object.assign({}, this.options)),
          this.directives && (e.directives = this.directives.clone()),
          (e.schema = this.schema.clone()),
          (e.contents = J.isNode(this.contents) ? this.contents.clone(e.schema) : this.contents),
          this.range && (e.range = this.range.slice()),
          e
        );
      }
      add(e) {
        Xe(this.contents) && this.contents.add(e);
      }
      addIn(e, n) {
        Xe(this.contents) && this.contents.addIn(e, n);
      }
      createAlias(e, n) {
        if (!e.anchor) {
          let r = ai.anchorNames(this);
          e.anchor = !n || r.has(n) ? ai.findNewAnchor(n || "a", r) : n;
        }
        return new Vd.Alias(e.anchor);
      }
      createNode(e, n, r) {
        let i;
        if (typeof n == "function") ((e = n.call({ "": e }, "", e)), (i = n));
        else if (Array.isArray(n)) {
          let g = (w) => typeof w == "number" || w instanceof String || w instanceof Number,
            E = n.filter(g).map(String);
          (E.length > 0 && (n = n.concat(E)), (i = n));
        } else r === void 0 && n && ((r = n), (n = void 0));
        let { aliasDuplicateObjects: s, anchorPrefix: o, flow: a, keepUndefined: c, onTagObj: l, tag: p } = r ?? {},
          { onAnchor: u, setAnchors: d, sourceObjects: y } = ai.createNodeAnchors(this, o || "a"),
          m = {
            aliasDuplicateObjects: s ?? !0,
            keepUndefined: c ?? !1,
            onAnchor: u,
            onTagObj: l,
            replacer: i,
            schema: this.schema,
            sourceObjects: y,
          },
          h = Gd.createNode(e, p, m);
        return (a && J.isCollection(h) && (h.flow = !0), d(), h);
      }
      createPair(e, n, r = {}) {
        let i = this.createNode(e, null, r),
          s = this.createNode(n, null, r);
        return new $d.Pair(i, s);
      }
      delete(e) {
        return Xe(this.contents) ? this.contents.delete(e) : !1;
      }
      deleteIn(e) {
        return Je.isEmptyPath(e)
          ? this.contents == null
            ? !1
            : ((this.contents = null), !0)
          : Xe(this.contents)
            ? this.contents.deleteIn(e)
            : !1;
      }
      get(e, n) {
        return J.isCollection(this.contents) ? this.contents.get(e, n) : void 0;
      }
      getIn(e, n) {
        return Je.isEmptyPath(e)
          ? !n && J.isScalar(this.contents)
            ? this.contents.value
            : this.contents
          : J.isCollection(this.contents)
            ? this.contents.getIn(e, n)
            : void 0;
      }
      has(e) {
        return J.isCollection(this.contents) ? this.contents.has(e) : !1;
      }
      hasIn(e) {
        return Je.isEmptyPath(e)
          ? this.contents !== void 0
          : J.isCollection(this.contents)
            ? this.contents.hasIn(e)
            : !1;
      }
      set(e, n) {
        this.contents == null
          ? (this.contents = Je.collectionFromPath(this.schema, [e], n))
          : Xe(this.contents) && this.contents.set(e, n);
      }
      setIn(e, n) {
        Je.isEmptyPath(e)
          ? (this.contents = n)
          : this.contents == null
            ? (this.contents = Je.collectionFromPath(this.schema, Array.from(e), n))
            : Xe(this.contents) && this.contents.setIn(e, n);
      }
      setSchema(e, n = {}) {
        typeof e == "number" && (e = String(e));
        let r;
        switch (e) {
          case "1.1":
            (this.directives
              ? (this.directives.yaml.version = "1.1")
              : (this.directives = new ci.Directives({ version: "1.1" })),
              (r = { resolveKnownTags: !1, schema: "yaml-1.1" }));
            break;
          case "1.2":
          case "next":
            (this.directives
              ? (this.directives.yaml.version = e)
              : (this.directives = new ci.Directives({ version: e })),
              (r = { resolveKnownTags: !0, schema: "core" }));
            break;
          case null:
            (this.directives && delete this.directives, (r = null));
            break;
          default: {
            let i = JSON.stringify(e);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${i}`);
          }
        }
        if (n.schema instanceof Object) this.schema = n.schema;
        else if (r) this.schema = new Fd.Schema(Object.assign(r, n));
        else throw new Error("With a null YAML version, the { schema: Schema } option is required");
      }
      toJS({ json: e, jsonArg: n, mapAsMap: r, maxAliasCount: i, onAnchor: s, reviver: o } = {}) {
        let a = {
            anchors: new Map(),
            doc: this,
            keep: !e,
            mapAsMap: r === !0,
            mapKeyWarned: !1,
            maxAliasCount: typeof i == "number" ? i : 100,
          },
          c = jd.toJS(this.contents, n ?? "", a);
        if (typeof s == "function") for (let { count: l, res: p } of a.anchors.values()) s(p, l);
        return typeof o == "function" ? Bd.applyReviver(o, { "": c }, "", c) : c;
      }
      toJSON(e, n) {
        return this.toJS({ json: !0, jsonArg: e, mapAsMap: !1, onAnchor: n });
      }
      toString(e = {}) {
        if (this.errors.length > 0) throw new Error("Document with errors cannot be stringified");
        if ("indent" in e && (!Number.isInteger(e.indent) || Number(e.indent) <= 0)) {
          let n = JSON.stringify(e.indent);
          throw new Error(`"indent" option must be a positive integer, not ${n}`);
        }
        return qd.stringifyDocument(this, e);
      }
    };
  function Xe(t) {
    if (J.isCollection(t)) return !0;
    throw new Error("Expected a YAML collection as document contents");
  }
  oa.Document = li;
});
var kt = I((Tt) => {
  "use strict";
  var vt = class extends Error {
      constructor(e, n, r, i) {
        (super(), (this.name = e), (this.code = r), (this.message = i), (this.pos = n));
      }
    },
    ui = class extends vt {
      constructor(e, n, r) {
        super("YAMLParseError", e, n, r);
      }
    },
    fi = class extends vt {
      constructor(e, n, r) {
        super("YAMLWarning", e, n, r);
      }
    },
    Kd = (t, e) => (n) => {
      if (n.pos[0] === -1) return;
      n.linePos = n.pos.map((a) => e.linePos(a));
      let { line: r, col: i } = n.linePos[0];
      n.message += ` at line ${r}, column ${i}`;
      let s = i - 1,
        o = t.substring(e.lineStarts[r - 1], e.lineStarts[r]).replace(/[\n\r]+$/, "");
      if (s >= 60 && o.length > 80) {
        let a = Math.min(s - 39, o.length - 79);
        ((o = "\u2026" + o.substring(a)), (s -= a - 1));
      }
      if ((o.length > 80 && (o = o.substring(0, 79) + "\u2026"), r > 1 && /^ *$/.test(o.substring(0, s)))) {
        let a = t.substring(e.lineStarts[r - 2], e.lineStarts[r - 1]);
        (a.length > 80 &&
          (a =
            a.substring(0, 79) +
            `\u2026
`),
          (o = a + o));
      }
      if (/[^ ]/.test(o)) {
        let a = 1,
          c = n.linePos[1];
        c?.line === r && c.col > i && (a = Math.max(1, Math.min(c.col - i, 80 - s)));
        let l = " ".repeat(s) + "^".repeat(a);
        n.message += `:

${o}
${l}
`;
      }
    };
  Tt.YAMLError = vt;
  Tt.YAMLParseError = ui;
  Tt.YAMLWarning = fi;
  Tt.prettifyError = Kd;
});
var Rt = I((aa) => {
  "use strict";
  function Wd(t, { flow: e, indicator: n, next: r, offset: i, onError: s, parentIndent: o, startOnNewline: a }) {
    let c = !1,
      l = a,
      p = a,
      u = "",
      d = "",
      y = !1,
      m = !1,
      h = null,
      g = null,
      E = null,
      w = null,
      T = null,
      R = null,
      v = null;
    for (let P of t)
      switch (
        (m &&
          (P.type !== "space" &&
            P.type !== "newline" &&
            P.type !== "comma" &&
            s(P.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"),
          (m = !1)),
        h &&
          (l &&
            P.type !== "comment" &&
            P.type !== "newline" &&
            s(h, "TAB_AS_INDENT", "Tabs are not allowed as indentation"),
          (h = null)),
        P.type)
      ) {
        case "space":
          (!e && (n !== "doc-start" || r?.type !== "flow-collection") && P.source.includes("	") && (h = P), (p = !0));
          break;
        case "comment": {
          p || s(P, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          let j = P.source.substring(1) || " ";
          (u ? (u += d + j) : (u = j), (d = ""), (l = !1));
          break;
        }
        case "newline":
          (l ? (u ? (u += P.source) : (!R || n !== "seq-item-ind") && (c = !0)) : (d += P.source),
            (l = !0),
            (y = !0),
            (g || E) && (w = P),
            (p = !0));
          break;
        case "anchor":
          (g && s(P, "MULTIPLE_ANCHORS", "A node can have at most one anchor"),
            P.source.endsWith(":") &&
              s(P.offset + P.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0),
            (g = P),
            v ?? (v = P.offset),
            (l = !1),
            (p = !1),
            (m = !0));
          break;
        case "tag": {
          (E && s(P, "MULTIPLE_TAGS", "A node can have at most one tag"),
            (E = P),
            v ?? (v = P.offset),
            (l = !1),
            (p = !1),
            (m = !0));
          break;
        }
        case n:
          ((g || E) && s(P, "BAD_PROP_ORDER", `Anchors and tags must be after the ${P.source} indicator`),
            R && s(P, "UNEXPECTED_TOKEN", `Unexpected ${P.source} in ${e ?? "collection"}`),
            (R = P),
            (l = n === "seq-item-ind" || n === "explicit-key-ind"),
            (p = !1));
          break;
        case "comma":
          if (e) {
            (T && s(P, "UNEXPECTED_TOKEN", `Unexpected , in ${e}`), (T = P), (l = !1), (p = !1));
            break;
          }
        default:
          (s(P, "UNEXPECTED_TOKEN", `Unexpected ${P.type} token`), (l = !1), (p = !1));
      }
    let k = t[t.length - 1],
      U = k ? k.offset + k.source.length : i;
    return (
      m &&
        r &&
        r.type !== "space" &&
        r.type !== "newline" &&
        r.type !== "comma" &&
        (r.type !== "scalar" || r.source !== "") &&
        s(r.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"),
      h &&
        ((l && h.indent <= o) || r?.type === "block-map" || r?.type === "block-seq") &&
        s(h, "TAB_AS_INDENT", "Tabs are not allowed as indentation"),
      {
        comma: T,
        found: R,
        spaceBefore: c,
        comment: u,
        hasNewline: y,
        anchor: g,
        tag: E,
        newlineAfterProp: w,
        end: U,
        start: v ?? U,
      }
    );
  }
  aa.resolveProps = Wd;
});
var Mn = I((ca) => {
  "use strict";
  function di(t) {
    if (!t) return null;
    switch (t.type) {
      case "alias":
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        if (
          t.source.includes(`
`)
        )
          return !0;
        if (t.end) {
          for (let e of t.end) if (e.type === "newline") return !0;
        }
        return !1;
      case "flow-collection":
        for (let e of t.items) {
          for (let n of e.start) if (n.type === "newline") return !0;
          if (e.sep) {
            for (let n of e.sep) if (n.type === "newline") return !0;
          }
          if (di(e.key) || di(e.value)) return !0;
        }
        return !1;
      default:
        return !0;
    }
  }
  ca.containsNewline = di;
});
var pi = I((la) => {
  "use strict";
  var Qd = Mn();
  function Hd(t, e, n) {
    if (e?.type === "flow-collection") {
      let r = e.end[0];
      r.indent === t &&
        (r.source === "]" || r.source === "}") &&
        Qd.containsNewline(e) &&
        n(r, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
    }
  }
  la.flowIndentCheck = Hd;
});
var hi = I((fa) => {
  "use strict";
  var ua = C();
  function Yd(t, e, n) {
    let { uniqueKeys: r } = t.options;
    if (r === !1) return !1;
    let i = typeof r == "function" ? r : (s, o) => s === o || (ua.isScalar(s) && ua.isScalar(o) && s.value === o.value);
    return e.some((s) => i(s.key, n));
  }
  fa.mapIncludes = Yd;
});
var ma = I((ga) => {
  "use strict";
  var da = _e(),
    zd = be(),
    pa = Rt(),
    Jd = Mn(),
    ha = pi(),
    Xd = hi(),
    ya = "All mapping items must start at the same column";
  function Zd({ composeNode: t, composeEmptyNode: e }, n, r, i, s) {
    let o = s?.nodeClass ?? zd.YAMLMap,
      a = new o(n.schema);
    n.atRoot && (n.atRoot = !1);
    let c = r.offset,
      l = null;
    for (let p of r.items) {
      let { start: u, key: d, sep: y, value: m } = p,
        h = pa.resolveProps(u, {
          indicator: "explicit-key-ind",
          next: d ?? y?.[0],
          offset: c,
          onError: i,
          parentIndent: r.indent,
          startOnNewline: !0,
        }),
        g = !h.found;
      if (g) {
        if (
          (d &&
            (d.type === "block-seq"
              ? i(c, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key")
              : "indent" in d && d.indent !== r.indent && i(c, "BAD_INDENT", ya)),
          !h.anchor && !h.tag && !y)
        ) {
          ((l = h.end),
            h.comment &&
              (a.comment
                ? (a.comment +=
                    `
` + h.comment)
                : (a.comment = h.comment)));
          continue;
        }
        (h.newlineAfterProp || Jd.containsNewline(d)) &&
          i(d ?? u[u.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
      } else h.found?.indent !== r.indent && i(c, "BAD_INDENT", ya);
      n.atKey = !0;
      let E = h.end,
        w = d ? t(n, d, h, i) : e(n, E, u, null, h, i);
      (n.schema.compat && ha.flowIndentCheck(r.indent, d, i),
        (n.atKey = !1),
        Xd.mapIncludes(n, a.items, w) && i(E, "DUPLICATE_KEY", "Map keys must be unique"));
      let T = pa.resolveProps(y ?? [], {
        indicator: "map-value-ind",
        next: m,
        offset: w.range[2],
        onError: i,
        parentIndent: r.indent,
        startOnNewline: !d || d.type === "block-scalar",
      });
      if (((c = T.end), T.found)) {
        g &&
          (m?.type === "block-map" &&
            !T.hasNewline &&
            i(c, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"),
          n.options.strict &&
            h.start < T.found.offset - 1024 &&
            i(
              w.range,
              "KEY_OVER_1024_CHARS",
              "The : indicator must be at most 1024 chars after the start of an implicit block mapping key",
            ));
        let R = m ? t(n, m, T, i) : e(n, c, y, null, T, i);
        (n.schema.compat && ha.flowIndentCheck(r.indent, m, i), (c = R.range[2]));
        let v = new da.Pair(w, R);
        (n.options.keepSourceTokens && (v.srcToken = p), a.items.push(v));
      } else {
        (g && i(w.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"),
          T.comment &&
            (w.comment
              ? (w.comment +=
                  `
` + T.comment)
              : (w.comment = T.comment)));
        let R = new da.Pair(w);
        (n.options.keepSourceTokens && (R.srcToken = p), a.items.push(R));
      }
    }
    return (
      l && l < c && i(l, "IMPOSSIBLE", "Map comment with trailing content"),
      (a.range = [r.offset, c, l ?? c]),
      a
    );
  }
  ga.resolveBlockMap = Zd;
});
var _a = I((Sa) => {
  "use strict";
  var ep = Ee(),
    tp = Rt(),
    np = pi();
  function rp({ composeNode: t, composeEmptyNode: e }, n, r, i, s) {
    let o = s?.nodeClass ?? ep.YAMLSeq,
      a = new o(n.schema);
    (n.atRoot && (n.atRoot = !1), n.atKey && (n.atKey = !1));
    let c = r.offset,
      l = null;
    for (let { start: p, value: u } of r.items) {
      let d = tp.resolveProps(p, {
        indicator: "seq-item-ind",
        next: u,
        offset: c,
        onError: i,
        parentIndent: r.indent,
        startOnNewline: !0,
      });
      if (!d.found)
        if (d.anchor || d.tag || u)
          u?.type === "block-seq"
            ? i(d.end, "BAD_INDENT", "All sequence items must start at the same column")
            : i(c, "MISSING_CHAR", "Sequence item without - indicator");
        else {
          ((l = d.end), d.comment && (a.comment = d.comment));
          continue;
        }
      let y = u ? t(n, u, d, i) : e(n, d.end, p, null, d, i);
      (n.schema.compat && np.flowIndentCheck(r.indent, u, i), (c = y.range[2]), a.items.push(y));
    }
    return ((a.range = [r.offset, c, l ?? c]), a);
  }
  Sa.resolveBlockSeq = rp;
});
var Ze = I((Ia) => {
  "use strict";
  function ip(t, e, n, r) {
    let i = "";
    if (t) {
      let s = !1,
        o = "";
      for (let a of t) {
        let { source: c, type: l } = a;
        switch (l) {
          case "space":
            s = !0;
            break;
          case "comment": {
            n && !s && r(a, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            let p = c.substring(1) || " ";
            (i ? (i += o + p) : (i = p), (o = ""));
            break;
          }
          case "newline":
            (i && (o += c), (s = !0));
            break;
          default:
            r(a, "UNEXPECTED_TOKEN", `Unexpected ${l} at node end`);
        }
        e += c.length;
      }
    }
    return { comment: i, offset: e };
  }
  Ia.resolveEnd = ip;
});
var wa = I((Pa) => {
  "use strict";
  var sp = C(),
    op = _e(),
    ba = be(),
    ap = Ee(),
    cp = Ze(),
    Ea = Rt(),
    lp = Mn(),
    up = hi(),
    yi = "Block collections are not allowed within flow collections",
    gi = (t) => t && (t.type === "block-map" || t.type === "block-seq");
  function fp({ composeNode: t, composeEmptyNode: e }, n, r, i, s) {
    let o = r.start.source === "{",
      a = o ? "flow map" : "flow sequence",
      c = s?.nodeClass ?? (o ? ba.YAMLMap : ap.YAMLSeq),
      l = new c(n.schema);
    l.flow = !0;
    let p = n.atRoot;
    (p && (n.atRoot = !1), n.atKey && (n.atKey = !1));
    let u = r.offset + r.start.source.length;
    for (let g = 0; g < r.items.length; ++g) {
      let E = r.items[g],
        { start: w, key: T, sep: R, value: v } = E,
        k = Ea.resolveProps(w, {
          flow: a,
          indicator: "explicit-key-ind",
          next: T ?? R?.[0],
          offset: u,
          onError: i,
          parentIndent: r.indent,
          startOnNewline: !1,
        });
      if (!k.found) {
        if (!k.anchor && !k.tag && !R && !v) {
          (g === 0 && k.comma
            ? i(k.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`)
            : g < r.items.length - 1 && i(k.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${a}`),
            k.comment &&
              (l.comment
                ? (l.comment +=
                    `
` + k.comment)
                : (l.comment = k.comment)),
            (u = k.end));
          continue;
        }
        !o &&
          n.options.strict &&
          lp.containsNewline(T) &&
          i(T, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
      }
      if (g === 0) k.comma && i(k.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`);
      else if ((k.comma || i(k.start, "MISSING_CHAR", `Missing , between ${a} items`), k.comment)) {
        let U = "";
        e: for (let P of w)
          switch (P.type) {
            case "comma":
            case "space":
              break;
            case "comment":
              U = P.source.substring(1);
              break e;
            default:
              break e;
          }
        if (U) {
          let P = l.items[l.items.length - 1];
          (sp.isPair(P) && (P = P.value ?? P.key),
            P.comment
              ? (P.comment +=
                  `
` + U)
              : (P.comment = U),
            (k.comment = k.comment.substring(U.length + 1)));
        }
      }
      if (!o && !R && !k.found) {
        let U = v ? t(n, v, k, i) : e(n, k.end, R, null, k, i);
        (l.items.push(U), (u = U.range[2]), gi(v) && i(U.range, "BLOCK_IN_FLOW", yi));
      } else {
        n.atKey = !0;
        let U = k.end,
          P = T ? t(n, T, k, i) : e(n, U, w, null, k, i);
        (gi(T) && i(P.range, "BLOCK_IN_FLOW", yi), (n.atKey = !1));
        let j = Ea.resolveProps(R ?? [], {
          flow: a,
          indicator: "map-value-ind",
          next: v,
          offset: P.range[2],
          onError: i,
          parentIndent: r.indent,
          startOnNewline: !1,
        });
        if (j.found) {
          if (!o && !k.found && n.options.strict) {
            if (R)
              for (let V of R) {
                if (V === j.found) break;
                if (V.type === "newline") {
                  i(V, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                  break;
                }
              }
            k.start < j.found.offset - 1024 &&
              i(
                j.found,
                "KEY_OVER_1024_CHARS",
                "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key",
              );
          }
        } else
          v &&
            ("source" in v && v.source?.[0] === ":"
              ? i(v, "MISSING_CHAR", `Missing space after : in ${a}`)
              : i(j.start, "MISSING_CHAR", `Missing , or : between ${a} items`));
        let re = v ? t(n, v, j, i) : j.found ? e(n, j.end, R, null, j, i) : null;
        re
          ? gi(v) && i(re.range, "BLOCK_IN_FLOW", yi)
          : j.comment &&
            (P.comment
              ? (P.comment +=
                  `
` + j.comment)
              : (P.comment = j.comment));
        let fe = new op.Pair(P, re);
        if ((n.options.keepSourceTokens && (fe.srcToken = E), o)) {
          let V = l;
          (up.mapIncludes(n, V.items, P) && i(U, "DUPLICATE_KEY", "Map keys must be unique"), V.items.push(fe));
        } else {
          let V = new ba.YAMLMap(n.schema);
          ((V.flow = !0), V.items.push(fe));
          let f = (re ?? P).range;
          ((V.range = [P.range[0], f[1], f[2]]), l.items.push(V));
        }
        u = re ? re.range[2] : j.end;
      }
    }
    let d = o ? "}" : "]",
      [y, ...m] = r.end,
      h = u;
    if (y?.source === d) h = y.offset + y.source.length;
    else {
      let g = a[0].toUpperCase() + a.substring(1),
        E = p
          ? `${g} must end with a ${d}`
          : `${g} in block collection must be sufficiently indented and end with a ${d}`;
      (i(u, p ? "MISSING_CHAR" : "BAD_INDENT", E), y && y.source.length !== 1 && m.unshift(y));
    }
    if (m.length > 0) {
      let g = cp.resolveEnd(m, h, n.options.strict, i);
      (g.comment &&
        (l.comment
          ? (l.comment +=
              `
` + g.comment)
          : (l.comment = g.comment)),
        (l.range = [r.offset, h, g.offset]));
    } else l.range = [r.offset, h, h];
    return l;
  }
  Pa.resolveFlowCollection = fp;
});
var Ta = I((va) => {
  "use strict";
  var dp = C(),
    pp = F(),
    hp = be(),
    yp = Ee(),
    gp = ma(),
    mp = _a(),
    Sp = wa();
  function mi(t, e, n, r, i, s) {
    let o =
        n.type === "block-map"
          ? gp.resolveBlockMap(t, e, n, r, s)
          : n.type === "block-seq"
            ? mp.resolveBlockSeq(t, e, n, r, s)
            : Sp.resolveFlowCollection(t, e, n, r, s),
      a = o.constructor;
    return i === "!" || i === a.tagName ? ((o.tag = a.tagName), o) : (i && (o.tag = i), o);
  }
  function _p(t, e, n, r, i) {
    let s = r.tag,
      o = s ? e.directives.tagName(s.source, (d) => i(s, "TAG_RESOLVE_FAILED", d)) : null;
    if (n.type === "block-seq") {
      let { anchor: d, newlineAfterProp: y } = r,
        m = d && s ? (d.offset > s.offset ? d : s) : (d ?? s);
      m && (!y || y.offset < m.offset) && i(m, "MISSING_CHAR", "Missing newline after block sequence props");
    }
    let a = n.type === "block-map" ? "map" : n.type === "block-seq" ? "seq" : n.start.source === "{" ? "map" : "seq";
    if (!s || !o || o === "!" || (o === hp.YAMLMap.tagName && a === "map") || (o === yp.YAMLSeq.tagName && a === "seq"))
      return mi(t, e, n, i, o);
    let c = e.schema.tags.find((d) => d.tag === o && d.collection === a);
    if (!c) {
      let d = e.schema.knownTags[o];
      if (d?.collection === a) (e.schema.tags.push(Object.assign({}, d, { default: !1 })), (c = d));
      else
        return (
          d
            ? i(
                s,
                "BAD_COLLECTION_TYPE",
                `${d.tag} used for ${a} collection, but expects ${d.collection ?? "scalar"}`,
                !0,
              )
            : i(s, "TAG_RESOLVE_FAILED", `Unresolved tag: ${o}`, !0),
          mi(t, e, n, i, o)
        );
    }
    let l = mi(t, e, n, i, o, c),
      p = c.resolve?.(l, (d) => i(s, "TAG_RESOLVE_FAILED", d), e.options) ?? l,
      u = dp.isNode(p) ? p : new pp.Scalar(p);
    return ((u.range = l.range), (u.tag = o), c?.format && (u.format = c.format), u);
  }
  va.composeCollection = _p;
});
var _i = I((ka) => {
  "use strict";
  var Si = F();
  function Ip(t, e, n) {
    let r = e.offset,
      i = bp(e, t.options.strict, n);
    if (!i) return { value: "", type: null, comment: "", range: [r, r, r] };
    let s = i.mode === ">" ? Si.Scalar.BLOCK_FOLDED : Si.Scalar.BLOCK_LITERAL,
      o = e.source ? Ep(e.source) : [],
      a = o.length;
    for (let h = o.length - 1; h >= 0; --h) {
      let g = o[h][1];
      if (g === "" || g === "\r") a = h;
      else break;
    }
    if (a === 0) {
      let h =
          i.chomp === "+" && o.length > 0
            ? `
`.repeat(Math.max(1, o.length - 1))
            : "",
        g = r + i.length;
      return (e.source && (g += e.source.length), { value: h, type: s, comment: i.comment, range: [r, g, g] });
    }
    let c = e.indent + i.indent,
      l = e.offset + i.length,
      p = 0;
    for (let h = 0; h < a; ++h) {
      let [g, E] = o[h];
      if (E === "" || E === "\r") i.indent === 0 && g.length > c && (c = g.length);
      else {
        (g.length < c &&
          n(
            l + g.length,
            "MISSING_CHAR",
            "Block scalars with more-indented leading empty lines must use an explicit indentation indicator",
          ),
          i.indent === 0 && (c = g.length),
          (p = h),
          c === 0 && !t.atRoot && n(l, "BAD_INDENT", "Block scalar values in collections must be indented"));
        break;
      }
      l += g.length + E.length + 1;
    }
    for (let h = o.length - 1; h >= a; --h) o[h][0].length > c && (a = h + 1);
    let u = "",
      d = "",
      y = !1;
    for (let h = 0; h < p; ++h)
      u +=
        o[h][0].slice(c) +
        `
`;
    for (let h = p; h < a; ++h) {
      let [g, E] = o[h];
      l += g.length + E.length + 1;
      let w = E[E.length - 1] === "\r";
      if ((w && (E = E.slice(0, -1)), E && g.length < c)) {
        let R = `Block scalar lines must not be less indented than their ${i.indent ? "explicit indentation indicator" : "first line"}`;
        (n(l - E.length - (w ? 2 : 1), "BAD_INDENT", R), (g = ""));
      }
      s === Si.Scalar.BLOCK_LITERAL
        ? ((u += d + g.slice(c) + E),
          (d = `
`))
        : g.length > c || E[0] === "	"
          ? (d === " "
              ? (d = `
`)
              : !y &&
                d ===
                  `
` &&
                (d = `

`),
            (u += d + g.slice(c) + E),
            (d = `
`),
            (y = !0))
          : E === ""
            ? d ===
              `
`
              ? (u += `
`)
              : (d = `
`)
            : ((u += d + E), (d = " "), (y = !1));
    }
    switch (i.chomp) {
      case "-":
        break;
      case "+":
        for (let h = a; h < o.length; ++h)
          u +=
            `
` + o[h][0].slice(c);
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
    let m = r + i.length + e.source.length;
    return { value: u, type: s, comment: i.comment, range: [r, m, m] };
  }
  function bp({ offset: t, props: e }, n, r) {
    if (e[0].type !== "block-scalar-header") return (r(e[0], "IMPOSSIBLE", "Block scalar header not found"), null);
    let { source: i } = e[0],
      s = i[0],
      o = 0,
      a = "",
      c = -1;
    for (let d = 1; d < i.length; ++d) {
      let y = i[d];
      if (!a && (y === "-" || y === "+")) a = y;
      else {
        let m = Number(y);
        !o && m ? (o = m) : c === -1 && (c = t + d);
      }
    }
    c !== -1 && r(c, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${i}`);
    let l = !1,
      p = "",
      u = i.length;
    for (let d = 1; d < e.length; ++d) {
      let y = e[d];
      switch (y.type) {
        case "space":
          l = !0;
        case "newline":
          u += y.source.length;
          break;
        case "comment":
          (n && !l && r(y, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"),
            (u += y.source.length),
            (p = y.source.substring(1)));
          break;
        case "error":
          (r(y, "UNEXPECTED_TOKEN", y.message), (u += y.source.length));
          break;
        default: {
          let m = `Unexpected token in block scalar header: ${y.type}`;
          r(y, "UNEXPECTED_TOKEN", m);
          let h = y.source;
          h && typeof h == "string" && (u += h.length);
        }
      }
    }
    return { mode: s, indent: o, chomp: a, comment: p, length: u };
  }
  function Ep(t) {
    let e = t.split(/\n( *)/),
      n = e[0],
      r = n.match(/^( *)/),
      s = [r?.[1] ? [r[1], n.slice(r[1].length)] : ["", n]];
    for (let o = 1; o < e.length; o += 2) s.push([e[o], e[o + 1]]);
    return s;
  }
  ka.resolveBlockScalar = Ip;
});
var bi = I((xa) => {
  "use strict";
  var Ii = F(),
    Pp = Ze();
  function wp(t, e, n) {
    let { offset: r, type: i, source: s, end: o } = t,
      a,
      c,
      l = (d, y, m) => n(r + d, y, m);
    switch (i) {
      case "scalar":
        ((a = Ii.Scalar.PLAIN), (c = vp(s, l)));
        break;
      case "single-quoted-scalar":
        ((a = Ii.Scalar.QUOTE_SINGLE), (c = Tp(s, l)));
        break;
      case "double-quoted-scalar":
        ((a = Ii.Scalar.QUOTE_DOUBLE), (c = kp(s, l)));
        break;
      default:
        return (
          n(t, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${i}`),
          { value: "", type: null, comment: "", range: [r, r + s.length, r + s.length] }
        );
    }
    let p = r + s.length,
      u = Pp.resolveEnd(o, p, e, n);
    return { value: c, type: a, comment: u.comment, range: [r, p, u.offset] };
  }
  function vp(t, e) {
    let n = "";
    switch (t[0]) {
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
        n = `block scalar indicator ${t[0]}`;
        break;
      }
      case "@":
      case "`": {
        n = `reserved character ${t[0]}`;
        break;
      }
    }
    return (n && e(0, "BAD_SCALAR_START", `Plain value cannot start with ${n}`), Ra(t));
  }
  function Tp(t, e) {
    return (
      (t[t.length - 1] !== "'" || t.length === 1) && e(t.length, "MISSING_CHAR", "Missing closing 'quote"),
      Ra(t.slice(1, -1)).replace(/''/g, "'")
    );
  }
  function Ra(t) {
    let e, n;
    try {
      ((e = new RegExp(
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
      ((e = /(.*?)[ \t]*\r?\n/sy), (n = /[ \t]*(.*?)[ \t]*\r?\n/sy));
    }
    let r = e.exec(t);
    if (!r) return t;
    let i = r[1],
      s = " ",
      o = e.lastIndex;
    for (n.lastIndex = o; (r = n.exec(t));)
      (r[1] === ""
        ? s ===
          `
`
          ? (i += s)
          : (s = `
`)
        : ((i += s + r[1]), (s = " ")),
        (o = n.lastIndex));
    let a = /[ \t]*(.*)/sy;
    return ((a.lastIndex = o), (r = a.exec(t)), i + s + (r?.[1] ?? ""));
  }
  function kp(t, e) {
    let n = "";
    for (let r = 1; r < t.length - 1; ++r) {
      let i = t[r];
      if (!(
        i === "\r" &&
        t[r + 1] ===
          `
`
      ))
        if (
          i ===
          `
`
        ) {
          let { fold: s, offset: o } = Rp(t, r);
          ((n += s), (r = o));
        } else if (i === "\\") {
          let s = t[++r],
            o = xp[s];
          if (o) n += o;
          else if (
            s ===
            `
`
          )
            for (s = t[r + 1]; s === " " || s === "	";) s = t[++r + 1];
          else if (
            s === "\r" &&
            t[r + 1] ===
              `
`
          )
            for (s = t[++r + 1]; s === " " || s === "	";) s = t[++r + 1];
          else if (s === "x" || s === "u" || s === "U") {
            let a = s === "x" ? 2 : s === "u" ? 4 : 8;
            ((n += Cp(t, r + 1, a, e)), (r += a));
          } else {
            let a = t.substr(r - 1, 2);
            (e(r - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), (n += a));
          }
        } else if (i === " " || i === "	") {
          let s = r,
            o = t[r + 1];
          for (; o === " " || o === "	";) o = t[++r + 1];
          o !==
            `
` &&
            !(
              o === "\r" &&
              t[r + 2] ===
                `
`
            ) &&
            (n += r > s ? t.slice(s, r + 1) : i);
        } else n += i;
    }
    return ((t[t.length - 1] !== '"' || t.length === 1) && e(t.length, "MISSING_CHAR", 'Missing closing "quote'), n);
  }
  function Rp(t, e) {
    let n = "",
      r = t[e + 1];
    for (
      ;
      (r === " " ||
        r === "	" ||
        r ===
          `
` ||
        r === "\r") &&
      !(
        r === "\r" &&
        t[e + 2] !==
          `
`
      );
    )
      (r ===
        `
` &&
        (n += `
`),
        (e += 1),
        (r = t[e + 1]));
    return (n || (n = " "), { fold: n, offset: e });
  }
  var xp = {
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
  function Cp(t, e, n, r) {
    let i = t.substr(e, n),
      o = i.length === n && /^[0-9a-fA-F]+$/.test(i) ? parseInt(i, 16) : NaN;
    try {
      return String.fromCodePoint(o);
    } catch {
      let a = t.substr(e - 2, n + 2);
      return (r(e - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), a);
    }
  }
  xa.resolveFlowScalar = wp;
});
var Na = I((Aa) => {
  "use strict";
  var Le = C(),
    Ca = F(),
    Ap = _i(),
    Np = bi();
  function Up(t, e, n, r) {
    let {
        value: i,
        type: s,
        comment: o,
        range: a,
      } = e.type === "block-scalar" ? Ap.resolveBlockScalar(t, e, r) : Np.resolveFlowScalar(e, t.options.strict, r),
      c = n ? t.directives.tagName(n.source, (u) => r(n, "TAG_RESOLVE_FAILED", u)) : null,
      l;
    t.options.stringKeys && t.atKey
      ? (l = t.schema[Le.SCALAR])
      : c
        ? (l = Lp(t.schema, i, c, n, r))
        : e.type === "scalar"
          ? (l = Dp(t, i, e, r))
          : (l = t.schema[Le.SCALAR]);
    let p;
    try {
      let u = l.resolve(i, (d) => r(n ?? e, "TAG_RESOLVE_FAILED", d), t.options);
      p = Le.isScalar(u) ? u : new Ca.Scalar(u);
    } catch (u) {
      let d = u instanceof Error ? u.message : String(u);
      (r(n ?? e, "TAG_RESOLVE_FAILED", d), (p = new Ca.Scalar(i)));
    }
    return (
      (p.range = a),
      (p.source = i),
      s && (p.type = s),
      c && (p.tag = c),
      l.format && (p.format = l.format),
      o && (p.comment = o),
      p
    );
  }
  function Lp(t, e, n, r, i) {
    if (n === "!") return t[Le.SCALAR];
    let s = [];
    for (let a of t.tags)
      if (!a.collection && a.tag === n)
        if (a.default && a.test) s.push(a);
        else return a;
    for (let a of s) if (a.test?.test(e)) return a;
    let o = t.knownTags[n];
    return o && !o.collection
      ? (t.tags.push(Object.assign({}, o, { default: !1, test: void 0 })), o)
      : (i(r, "TAG_RESOLVE_FAILED", `Unresolved tag: ${n}`, n !== "tag:yaml.org,2002:str"), t[Le.SCALAR]);
  }
  function Dp({ atKey: t, directives: e, schema: n }, r, i, s) {
    let o = n.tags.find((a) => (a.default === !0 || (t && a.default === "key")) && a.test?.test(r)) || n[Le.SCALAR];
    if (n.compat) {
      let a = n.compat.find((c) => c.default && c.test?.test(r)) ?? n[Le.SCALAR];
      if (o.tag !== a.tag) {
        let c = e.tagString(o.tag),
          l = e.tagString(a.tag),
          p = `Value may be parsed as either ${c} or ${l}`;
        s(i, "TAG_RESOLVE_FAILED", p, !0);
      }
    }
    return o;
  }
  Aa.composeScalar = Up;
});
var La = I((Ua) => {
  "use strict";
  function Mp(t, e, n) {
    if (e) {
      n ?? (n = e.length);
      for (let r = n - 1; r >= 0; --r) {
        let i = e[r];
        switch (i.type) {
          case "space":
          case "comment":
          case "newline":
            t -= i.source.length;
            continue;
        }
        for (i = e[++r]; i?.type === "space";) ((t += i.source.length), (i = e[++r]));
        break;
      }
    }
    return t;
  }
  Ua.emptyScalarPosition = Mp;
});
var Oa = I((Pi) => {
  "use strict";
  var Op = ct(),
    Vp = C(),
    $p = Ta(),
    Da = Na(),
    jp = Ze(),
    Fp = La(),
    qp = { composeNode: Ma, composeEmptyNode: Ei };
  function Ma(t, e, n, r) {
    let i = t.atKey,
      { spaceBefore: s, comment: o, anchor: a, tag: c } = n,
      l,
      p = !0;
    switch (e.type) {
      case "alias":
        ((l = Bp(t, e, r)), (a || c) && r(e, "ALIAS_PROPS", "An alias node must not specify any properties"));
        break;
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "block-scalar":
        ((l = Da.composeScalar(t, e, c, r)), a && (l.anchor = a.source.substring(1)));
        break;
      case "block-map":
      case "block-seq":
      case "flow-collection":
        try {
          ((l = $p.composeCollection(qp, t, e, n, r)), a && (l.anchor = a.source.substring(1)));
        } catch (u) {
          let d = u instanceof Error ? u.message : String(u);
          r(e, "RESOURCE_EXHAUSTION", d);
        }
        break;
      default: {
        let u = e.type === "error" ? e.message : `Unsupported token (type: ${e.type})`;
        (r(e, "UNEXPECTED_TOKEN", u), (p = !1));
      }
    }
    return (
      l ?? (l = Ei(t, e.offset, void 0, null, n, r)),
      a && l.anchor === "" && r(a, "BAD_ALIAS", "Anchor cannot be an empty string"),
      i &&
        t.options.stringKeys &&
        (!Vp.isScalar(l) || typeof l.value != "string" || (l.tag && l.tag !== "tag:yaml.org,2002:str")) &&
        r(c ?? e, "NON_STRING_KEY", "With stringKeys, all keys must be strings"),
      s && (l.spaceBefore = !0),
      o && (e.type === "scalar" && e.source === "" ? (l.comment = o) : (l.commentBefore = o)),
      t.options.keepSourceTokens && p && (l.srcToken = e),
      l
    );
  }
  function Ei(t, e, n, r, { spaceBefore: i, comment: s, anchor: o, tag: a, end: c }, l) {
    let p = { type: "scalar", offset: Fp.emptyScalarPosition(e, n, r), indent: -1, source: "" },
      u = Da.composeScalar(t, p, a, l);
    return (
      o &&
        ((u.anchor = o.source.substring(1)), u.anchor === "" && l(o, "BAD_ALIAS", "Anchor cannot be an empty string")),
      i && (u.spaceBefore = !0),
      s && ((u.comment = s), (u.range[2] = c)),
      u
    );
  }
  function Bp({ options: t }, { offset: e, source: n, end: r }, i) {
    let s = new Op.Alias(n.substring(1));
    (s.source === "" && i(e, "BAD_ALIAS", "Alias cannot be an empty string"),
      s.source.endsWith(":") && i(e + n.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0));
    let o = e + n.length,
      a = jp.resolveEnd(r, o, t.strict, i);
    return ((s.range = [e, o, a.offset]), a.comment && (s.comment = a.comment), s);
  }
  Pi.composeEmptyNode = Ei;
  Pi.composeNode = Ma;
});
var ja = I(($a) => {
  "use strict";
  var Gp = wt(),
    Va = Oa(),
    Kp = Ze(),
    Wp = Rt();
  function Qp(t, e, { offset: n, start: r, value: i, end: s }, o) {
    let a = Object.assign({ _directives: e }, t),
      c = new Gp.Document(void 0, a),
      l = { atKey: !1, atRoot: !0, directives: c.directives, options: c.options, schema: c.schema },
      p = Wp.resolveProps(r, {
        indicator: "doc-start",
        next: i ?? s?.[0],
        offset: n,
        onError: o,
        parentIndent: 0,
        startOnNewline: !0,
      });
    (p.found &&
      ((c.directives.docStart = !0),
      i &&
        (i.type === "block-map" || i.type === "block-seq") &&
        !p.hasNewline &&
        o(p.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")),
      (c.contents = i ? Va.composeNode(l, i, p, o) : Va.composeEmptyNode(l, p.end, r, null, p, o)));
    let u = c.contents.range[2],
      d = Kp.resolveEnd(s, u, !1, o);
    return (d.comment && (c.comment = d.comment), (c.range = [n, u, d.offset]), c);
  }
  $a.composeDoc = Qp;
});
var vi = I((Ba) => {
  "use strict";
  var Hp = Mt("process"),
    Yp = ur(),
    zp = wt(),
    xt = kt(),
    Fa = C(),
    Jp = ja(),
    Xp = Ze();
  function Ct(t) {
    if (typeof t == "number") return [t, t + 1];
    if (Array.isArray(t)) return t.length === 2 ? t : [t[0], t[1]];
    let { offset: e, source: n } = t;
    return [e, e + (typeof n == "string" ? n.length : 1)];
  }
  function qa(t) {
    let e = "",
      n = !1,
      r = !1;
    for (let i = 0; i < t.length; ++i) {
      let s = t[i];
      switch (s[0]) {
        case "#":
          ((e +=
            (e === ""
              ? ""
              : r
                ? `

`
                : `
`) + (s.substring(1) || " ")),
            (n = !0),
            (r = !1));
          break;
        case "%":
          (t[i + 1]?.[0] !== "#" && (i += 1), (n = !1));
          break;
        default:
          (n || (r = !0), (n = !1));
      }
    }
    return { comment: e, afterEmptyLine: r };
  }
  var wi = class {
    constructor(e = {}) {
      ((this.doc = null),
        (this.atDirectives = !1),
        (this.prelude = []),
        (this.errors = []),
        (this.warnings = []),
        (this.onError = (n, r, i, s) => {
          let o = Ct(n);
          s ? this.warnings.push(new xt.YAMLWarning(o, r, i)) : this.errors.push(new xt.YAMLParseError(o, r, i));
        }),
        (this.directives = new Yp.Directives({ version: e.version || "1.2" })),
        (this.options = e));
    }
    decorate(e, n) {
      let { comment: r, afterEmptyLine: i } = qa(this.prelude);
      if (r) {
        let s = e.contents;
        if (n)
          e.comment = e.comment
            ? `${e.comment}
${r}`
            : r;
        else if (i || e.directives.docStart || !s) e.commentBefore = r;
        else if (Fa.isCollection(s) && !s.flow && s.items.length > 0) {
          let o = s.items[0];
          Fa.isPair(o) && (o = o.key);
          let a = o.commentBefore;
          o.commentBefore = a
            ? `${r}
${a}`
            : r;
        } else {
          let o = s.commentBefore;
          s.commentBefore = o
            ? `${r}
${o}`
            : r;
        }
      }
      if (n) {
        for (let s = 0; s < this.errors.length; ++s) e.errors.push(this.errors[s]);
        for (let s = 0; s < this.warnings.length; ++s) e.warnings.push(this.warnings[s]);
      } else ((e.errors = this.errors), (e.warnings = this.warnings));
      ((this.prelude = []), (this.errors = []), (this.warnings = []));
    }
    streamInfo() {
      return {
        comment: qa(this.prelude).comment,
        directives: this.directives,
        errors: this.errors,
        warnings: this.warnings,
      };
    }
    *compose(e, n = !1, r = -1) {
      for (let i of e) yield* this.next(i);
      yield* this.end(n, r);
    }
    *next(e) {
      switch ((Hp.env.LOG_STREAM && console.dir(e, { depth: null }), e.type)) {
        case "directive":
          (this.directives.add(e.source, (n, r, i) => {
            let s = Ct(e);
            ((s[0] += n), this.onError(s, "BAD_DIRECTIVE", r, i));
          }),
            this.prelude.push(e.source),
            (this.atDirectives = !0));
          break;
        case "document": {
          let n = Jp.composeDoc(this.options, this.directives, e, this.onError);
          (this.atDirectives &&
            !n.directives.docStart &&
            this.onError(e, "MISSING_CHAR", "Missing directives-end/doc-start indicator line"),
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
          this.prelude.push(e.source);
          break;
        case "error": {
          let n = e.source ? `${e.message}: ${JSON.stringify(e.source)}` : e.message,
            r = new xt.YAMLParseError(Ct(e), "UNEXPECTED_TOKEN", n);
          this.atDirectives || !this.doc ? this.errors.push(r) : this.doc.errors.push(r);
          break;
        }
        case "doc-end": {
          if (!this.doc) {
            let r = "Unexpected doc-end without preceding document";
            this.errors.push(new xt.YAMLParseError(Ct(e), "UNEXPECTED_TOKEN", r));
            break;
          }
          this.doc.directives.docEnd = !0;
          let n = Xp.resolveEnd(e.end, e.offset + e.source.length, this.doc.options.strict, this.onError);
          if ((this.decorate(this.doc, !0), n.comment)) {
            let r = this.doc.comment;
            this.doc.comment = r
              ? `${r}
${n.comment}`
              : n.comment;
          }
          this.doc.range[2] = n.offset;
          break;
        }
        default:
          this.errors.push(new xt.YAMLParseError(Ct(e), "UNEXPECTED_TOKEN", `Unsupported token ${e.type}`));
      }
    }
    *end(e = !1, n = -1) {
      if (this.doc) (this.decorate(this.doc, !0), yield this.doc, (this.doc = null));
      else if (e) {
        let r = Object.assign({ _directives: this.directives }, this.options),
          i = new zp.Document(void 0, r);
        (this.atDirectives && this.onError(n, "MISSING_CHAR", "Missing directives-end indicator line"),
          (i.range = [0, n, n]),
          this.decorate(i, !1),
          yield i);
      }
    }
  };
  Ba.Composer = wi;
});
var Wa = I((On) => {
  "use strict";
  var Zp = _i(),
    eh = bi(),
    th = kt(),
    Ga = pt();
  function nh(t, e = !0, n) {
    if (t) {
      let r = (i, s, o) => {
        let a = typeof i == "number" ? i : Array.isArray(i) ? i[0] : i.offset;
        if (n) n(a, s, o);
        else throw new th.YAMLParseError([a, a + 1], s, o);
      };
      switch (t.type) {
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return eh.resolveFlowScalar(t, e, r);
        case "block-scalar":
          return Zp.resolveBlockScalar({ options: { strict: e } }, t, r);
      }
    }
    return null;
  }
  function rh(t, e) {
    let { implicitKey: n = !1, indent: r, inFlow: i = !1, offset: s = -1, type: o = "PLAIN" } = e,
      a = Ga.stringifyString(
        { type: o, value: t },
        { implicitKey: n, indent: r > 0 ? " ".repeat(r) : "", inFlow: i, options: { blockQuote: !0, lineWidth: -1 } },
      ),
      c = e.end ?? [
        {
          type: "newline",
          offset: -1,
          indent: r,
          source: `
`,
        },
      ];
    switch (a[0]) {
      case "|":
      case ">": {
        let l = a.indexOf(`
`),
          p = a.substring(0, l),
          u =
            a.substring(l + 1) +
            `
`,
          d = [{ type: "block-scalar-header", offset: s, indent: r, source: p }];
        return (
          Ka(d, c) ||
            d.push({
              type: "newline",
              offset: -1,
              indent: r,
              source: `
`,
            }),
          { type: "block-scalar", offset: s, indent: r, props: d, source: u }
        );
      }
      case '"':
        return { type: "double-quoted-scalar", offset: s, indent: r, source: a, end: c };
      case "'":
        return { type: "single-quoted-scalar", offset: s, indent: r, source: a, end: c };
      default:
        return { type: "scalar", offset: s, indent: r, source: a, end: c };
    }
  }
  function ih(t, e, n = {}) {
    let { afterKey: r = !1, implicitKey: i = !1, inFlow: s = !1, type: o } = n,
      a = "indent" in t ? t.indent : null;
    if ((r && typeof a == "number" && (a += 2), !o))
      switch (t.type) {
        case "single-quoted-scalar":
          o = "QUOTE_SINGLE";
          break;
        case "double-quoted-scalar":
          o = "QUOTE_DOUBLE";
          break;
        case "block-scalar": {
          let l = t.props[0];
          if (l.type !== "block-scalar-header") throw new Error("Invalid block scalar header");
          o = l.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
          break;
        }
        default:
          o = "PLAIN";
      }
    let c = Ga.stringifyString(
      { type: o, value: e },
      {
        implicitKey: i || a === null,
        indent: a !== null && a > 0 ? " ".repeat(a) : "",
        inFlow: s,
        options: { blockQuote: !0, lineWidth: -1 },
      },
    );
    switch (c[0]) {
      case "|":
      case ">":
        sh(t, c);
        break;
      case '"':
        Ti(t, c, "double-quoted-scalar");
        break;
      case "'":
        Ti(t, c, "single-quoted-scalar");
        break;
      default:
        Ti(t, c, "scalar");
    }
  }
  function sh(t, e) {
    let n = e.indexOf(`
`),
      r = e.substring(0, n),
      i =
        e.substring(n + 1) +
        `
`;
    if (t.type === "block-scalar") {
      let s = t.props[0];
      if (s.type !== "block-scalar-header") throw new Error("Invalid block scalar header");
      ((s.source = r), (t.source = i));
    } else {
      let { offset: s } = t,
        o = "indent" in t ? t.indent : -1,
        a = [{ type: "block-scalar-header", offset: s, indent: o, source: r }];
      Ka(a, "end" in t ? t.end : void 0) ||
        a.push({
          type: "newline",
          offset: -1,
          indent: o,
          source: `
`,
        });
      for (let c of Object.keys(t)) c !== "type" && c !== "offset" && delete t[c];
      Object.assign(t, { type: "block-scalar", indent: o, props: a, source: i });
    }
  }
  function Ka(t, e) {
    if (e)
      for (let n of e)
        switch (n.type) {
          case "space":
          case "comment":
            t.push(n);
            break;
          case "newline":
            return (t.push(n), !0);
        }
    return !1;
  }
  function Ti(t, e, n) {
    switch (t.type) {
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        ((t.type = n), (t.source = e));
        break;
      case "block-scalar": {
        let r = t.props.slice(1),
          i = e.length;
        t.props[0].type === "block-scalar-header" && (i -= t.props[0].source.length);
        for (let s of r) s.offset += i;
        (delete t.props, Object.assign(t, { type: n, source: e, end: r }));
        break;
      }
      case "block-map":
      case "block-seq": {
        let i = {
          type: "newline",
          offset: t.offset + e.length,
          indent: t.indent,
          source: `
`,
        };
        (delete t.items, Object.assign(t, { type: n, source: e, end: [i] }));
        break;
      }
      default: {
        let r = "indent" in t ? t.indent : -1,
          i =
            "end" in t && Array.isArray(t.end)
              ? t.end.filter((s) => s.type === "space" || s.type === "comment" || s.type === "newline")
              : [];
        for (let s of Object.keys(t)) s !== "type" && s !== "offset" && delete t[s];
        Object.assign(t, { type: n, indent: r, source: e, end: i });
      }
    }
  }
  On.createScalarToken = rh;
  On.resolveAsScalar = nh;
  On.setScalarValue = ih;
});
var Ha = I((Qa) => {
  "use strict";
  var oh = (t) => ("type" in t ? $n(t) : Vn(t));
  function $n(t) {
    switch (t.type) {
      case "block-scalar": {
        let e = "";
        for (let n of t.props) e += $n(n);
        return e + t.source;
      }
      case "block-map":
      case "block-seq": {
        let e = "";
        for (let n of t.items) e += Vn(n);
        return e;
      }
      case "flow-collection": {
        let e = t.start.source;
        for (let n of t.items) e += Vn(n);
        for (let n of t.end) e += n.source;
        return e;
      }
      case "document": {
        let e = Vn(t);
        if (t.end) for (let n of t.end) e += n.source;
        return e;
      }
      default: {
        let e = t.source;
        if ("end" in t && t.end) for (let n of t.end) e += n.source;
        return e;
      }
    }
  }
  function Vn({ start: t, key: e, sep: n, value: r }) {
    let i = "";
    for (let s of t) i += s.source;
    if ((e && (i += $n(e)), n)) for (let s of n) i += s.source;
    return (r && (i += $n(r)), i);
  }
  Qa.stringify = oh;
});
var Xa = I((Ja) => {
  "use strict";
  var ki = Symbol("break visit"),
    ah = Symbol("skip children"),
    Ya = Symbol("remove item");
  function De(t, e) {
    ("type" in t && t.type === "document" && (t = { start: t.start, value: t.value }), za(Object.freeze([]), t, e));
  }
  De.BREAK = ki;
  De.SKIP = ah;
  De.REMOVE = Ya;
  De.itemAtPath = (t, e) => {
    let n = t;
    for (let [r, i] of e) {
      let s = n?.[r];
      if (s && "items" in s) n = s.items[i];
      else return;
    }
    return n;
  };
  De.parentCollection = (t, e) => {
    let n = De.itemAtPath(t, e.slice(0, -1)),
      r = e[e.length - 1][0],
      i = n?.[r];
    if (i && "items" in i) return i;
    throw new Error("Parent collection not found");
  };
  function za(t, e, n) {
    let r = n(e, t);
    if (typeof r == "symbol") return r;
    for (let i of ["key", "value"]) {
      let s = e[i];
      if (s && "items" in s) {
        for (let o = 0; o < s.items.length; ++o) {
          let a = za(Object.freeze(t.concat([[i, o]])), s.items[o], n);
          if (typeof a == "number") o = a - 1;
          else {
            if (a === ki) return ki;
            a === Ya && (s.items.splice(o, 1), (o -= 1));
          }
        }
        typeof r == "function" && i === "key" && (r = r(e, t));
      }
    }
    return typeof r == "function" ? r(e, t) : r;
  }
  Ja.visit = De;
});
var jn = I((H) => {
  "use strict";
  var Ri = Wa(),
    ch = Ha(),
    lh = Xa(),
    xi = "\uFEFF",
    Ci = "",
    Ai = "",
    Ni = "",
    uh = (t) => !!t && "items" in t,
    fh = (t) =>
      !!t &&
      (t.type === "scalar" ||
        t.type === "single-quoted-scalar" ||
        t.type === "double-quoted-scalar" ||
        t.type === "block-scalar");
  function dh(t) {
    switch (t) {
      case xi:
        return "<BOM>";
      case Ci:
        return "<DOC>";
      case Ai:
        return "<FLOW_END>";
      case Ni:
        return "<SCALAR>";
      default:
        return JSON.stringify(t);
    }
  }
  function ph(t) {
    switch (t) {
      case xi:
        return "byte-order-mark";
      case Ci:
        return "doc-mode";
      case Ai:
        return "flow-error-end";
      case Ni:
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
    switch (t[0]) {
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
  H.createScalarToken = Ri.createScalarToken;
  H.resolveAsScalar = Ri.resolveAsScalar;
  H.setScalarValue = Ri.setScalarValue;
  H.stringify = ch.stringify;
  H.visit = lh.visit;
  H.BOM = xi;
  H.DOCUMENT = Ci;
  H.FLOW_END = Ai;
  H.SCALAR = Ni;
  H.isCollection = uh;
  H.isScalar = fh;
  H.prettyToken = dh;
  H.tokenType = ph;
});
var Di = I((ec) => {
  "use strict";
  var At = jn();
  function te(t) {
    switch (t) {
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
  var Za = new Set("0123456789ABCDEFabcdef"),
    hh = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"),
    Fn = new Set(",[]{}"),
    yh = new Set(` ,[]{}
\r	`),
    Ui = (t) => !t || yh.has(t),
    Li = class {
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
      *lex(e, n = !1) {
        if (e) {
          if (typeof e != "string") throw TypeError("source is not a string");
          ((this.buffer = this.buffer ? this.buffer + e : e), (this.lineEndPos = null));
        }
        this.atEnd = !n;
        let r = this.next ?? "stream";
        for (; r && (n || this.hasChars(1));) r = yield* this.parseNext(r);
      }
      atLineEnd() {
        let e = this.pos,
          n = this.buffer[e];
        for (; n === " " || n === "	";) n = this.buffer[++e];
        return !n ||
          n === "#" ||
          n ===
            `
`
          ? !0
          : n === "\r"
            ? this.buffer[e + 1] ===
              `
`
            : !1;
      }
      charAt(e) {
        return this.buffer[this.pos + e];
      }
      continueScalar(e) {
        let n = this.buffer[e];
        if (this.indentNext > 0) {
          let r = 0;
          for (; n === " ";) n = this.buffer[++r + e];
          if (n === "\r") {
            let i = this.buffer[r + e + 1];
            if (
              i ===
                `
` ||
              (!i && !this.atEnd)
            )
              return e + r + 1;
          }
          return n ===
            `
` ||
            r >= this.indentNext ||
            (!n && !this.atEnd)
            ? e + r
            : -1;
        }
        if (n === "-" || n === ".") {
          let r = this.buffer.substr(e, 3);
          if ((r === "---" || r === "...") && te(this.buffer[e + 3])) return -1;
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
        if ((e[0] === At.BOM && (yield* this.pushCount(1), (e = e.substring(1))), e[0] === "%")) {
          let n = e.length,
            r = e.indexOf("#");
          for (; r !== -1;) {
            let s = e[r - 1];
            if (s === " " || s === "	") {
              n = r - 1;
              break;
            } else r = e.indexOf("#", r + 1);
          }
          for (;;) {
            let s = e[n - 1];
            if (s === " " || s === "	") n -= 1;
            else break;
          }
          let i = (yield* this.pushCount(n)) + (yield* this.pushSpaces(!0));
          return (yield* this.pushCount(e.length - i), this.pushNewline(), "stream");
        }
        if (this.atLineEnd()) {
          let n = yield* this.pushSpaces(!0);
          return (yield* this.pushCount(e.length - n), yield* this.pushNewline(), "stream");
        }
        return (yield At.DOCUMENT, yield* this.parseLineStart());
      }
      *parseLineStart() {
        let e = this.charAt(0);
        if (!e && !this.atEnd) return this.setNext("line-start");
        if (e === "-" || e === ".") {
          if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
          let n = this.peek(3);
          if ((n === "---" || n === "...") && te(this.charAt(3)))
            return (
              yield* this.pushCount(3),
              (this.indentValue = 0),
              (this.indentNext = 0),
              n === "---" ? "doc" : "stream"
            );
        }
        return (
          (this.indentValue = yield* this.pushSpaces(!1)),
          this.indentNext > this.indentValue && !te(this.charAt(1)) && (this.indentNext = this.indentValue),
          yield* this.parseBlockStart()
        );
      }
      *parseBlockStart() {
        let [e, n] = this.peek(2);
        if (!n && !this.atEnd) return this.setNext("block-start");
        if ((e === "-" || e === "?" || e === ":") && te(n)) {
          let r = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
          return ((this.indentNext = this.indentValue + 1), (this.indentValue += r), "block-start");
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(!0);
        let e = this.getLine();
        if (e === null) return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (e[n]) {
          case "#":
            yield* this.pushCount(e.length - n);
          case void 0:
            return (yield* this.pushNewline(), yield* this.parseLineStart());
          case "{":
          case "[":
            return (yield* this.pushCount(1), (this.flowKey = !1), (this.flowLevel = 1), "flow");
          case "}":
          case "]":
            return (yield* this.pushCount(1), "doc");
          case "*":
            return (yield* this.pushUntil(Ui), "doc");
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            return (
              (n += yield* this.parseBlockScalarHeader()),
              (n += yield* this.pushSpaces(!0)),
              yield* this.pushCount(e.length - n),
              yield* this.pushNewline(),
              yield* this.parseBlockScalar()
            );
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let e,
          n,
          r = -1;
        do
          ((e = yield* this.pushNewline()),
            e > 0 ? ((n = yield* this.pushSpaces(!1)), (this.indentValue = r = n)) : (n = 0),
            (n += yield* this.pushSpaces(!0)));
        while (e + n > 0);
        let i = this.getLine();
        if (i === null) return this.setNext("flow");
        if (
          ((r !== -1 && r < this.indentNext && i[0] !== "#") ||
            (r === 0 && (i.startsWith("---") || i.startsWith("...")) && te(i[3]))) &&
          !(r === this.indentNext - 1 && this.flowLevel === 1 && (i[0] === "]" || i[0] === "}"))
        )
          return ((this.flowLevel = 0), yield At.FLOW_END, yield* this.parseLineStart());
        let s = 0;
        for (; i[s] === ",";) ((s += yield* this.pushCount(1)), (s += yield* this.pushSpaces(!0)), (this.flowKey = !1));
        switch (((s += yield* this.pushIndicators()), i[s])) {
          case void 0:
            return "flow";
          case "#":
            return (yield* this.pushCount(i.length - s), "flow");
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
            return (yield* this.pushUntil(Ui), "flow");
          case '"':
          case "'":
            return ((this.flowKey = !0), yield* this.parseQuotedScalar());
          case ":": {
            let o = this.charAt(1);
            if (this.flowKey || te(o) || o === ",")
              return ((this.flowKey = !1), yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow");
          }
          default:
            return ((this.flowKey = !1), yield* this.parsePlainScalar());
        }
      }
      *parseQuotedScalar() {
        let e = this.charAt(0),
          n = this.buffer.indexOf(e, this.pos + 1);
        if (e === "'") for (; n !== -1 && this.buffer[n + 1] === "'";) n = this.buffer.indexOf("'", n + 2);
        else
          for (; n !== -1;) {
            let s = 0;
            for (; this.buffer[n - 1 - s] === "\\";) s += 1;
            if (s % 2 === 0) break;
            n = this.buffer.indexOf('"', n + 1);
          }
        let r = this.buffer.substring(0, n),
          i = r.indexOf(
            `
`,
            this.pos,
          );
        if (i !== -1) {
          for (; i !== -1;) {
            let s = this.continueScalar(i + 1);
            if (s === -1) break;
            i = r.indexOf(
              `
`,
              s,
            );
          }
          i !== -1 && (n = i - (r[i - 1] === "\r" ? 2 : 1));
        }
        if (n === -1) {
          if (!this.atEnd) return this.setNext("quoted-scalar");
          n = this.buffer.length;
        }
        return (yield* this.pushToIndex(n + 1, !1), this.flowLevel ? "flow" : "doc");
      }
      *parseBlockScalarHeader() {
        ((this.blockScalarIndent = -1), (this.blockScalarKeep = !1));
        let e = this.pos;
        for (;;) {
          let n = this.buffer[++e];
          if (n === "+") this.blockScalarKeep = !0;
          else if (n > "0" && n <= "9") this.blockScalarIndent = Number(n) - 1;
          else if (n !== "-") break;
        }
        return yield* this.pushUntil((n) => te(n) || n === "#");
      }
      *parseBlockScalar() {
        let e = this.pos - 1,
          n = 0,
          r;
        e: for (let s = this.pos; (r = this.buffer[s]); ++s)
          switch (r) {
            case " ":
              n += 1;
              break;
            case `
`:
              ((e = s), (n = 0));
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
        if (!r && !this.atEnd) return this.setNext("block-scalar");
        if (n >= this.indentNext) {
          this.blockScalarIndent === -1
            ? (this.indentNext = n)
            : (this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext));
          do {
            let s = this.continueScalar(e + 1);
            if (s === -1) break;
            e = this.buffer.indexOf(
              `
`,
              s,
            );
          } while (e !== -1);
          if (e === -1) {
            if (!this.atEnd) return this.setNext("block-scalar");
            e = this.buffer.length;
          }
        }
        let i = e + 1;
        for (r = this.buffer[i]; r === " ";) r = this.buffer[++i];
        if (r === "	") {
          for (
            ;
            r === "	" ||
            r === " " ||
            r === "\r" ||
            r ===
              `
`;
          )
            r = this.buffer[++i];
          e = i - 1;
        } else if (!this.blockScalarKeep)
          do {
            let s = e - 1,
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
              e = s;
            else break;
          } while (!0);
        return (yield At.SCALAR, yield* this.pushToIndex(e + 1, !0), yield* this.parseLineStart());
      }
      *parsePlainScalar() {
        let e = this.flowLevel > 0,
          n = this.pos - 1,
          r = this.pos - 1,
          i;
        for (; (i = this.buffer[++r]);)
          if (i === ":") {
            let s = this.buffer[r + 1];
            if (te(s) || (e && Fn.has(s))) break;
            n = r;
          } else if (te(i)) {
            let s = this.buffer[r + 1];
            if (
              (i === "\r" &&
                (s ===
                `
`
                  ? ((r += 1),
                    (i = `
`),
                    (s = this.buffer[r + 1]))
                  : (n = r)),
              s === "#" || (e && Fn.has(s)))
            )
              break;
            if (
              i ===
              `
`
            ) {
              let o = this.continueScalar(r + 1);
              if (o === -1) break;
              r = Math.max(r, o - 2);
            }
          } else {
            if (e && Fn.has(i)) break;
            n = r;
          }
        return !i && !this.atEnd
          ? this.setNext("plain-scalar")
          : (yield At.SCALAR, yield* this.pushToIndex(n + 1, !0), e ? "flow" : "doc");
      }
      *pushCount(e) {
        return e > 0 ? (yield this.buffer.substr(this.pos, e), (this.pos += e), e) : 0;
      }
      *pushToIndex(e, n) {
        let r = this.buffer.slice(this.pos, e);
        return r ? (yield r, (this.pos += r.length), r.length) : (n && (yield ""), 0);
      }
      *pushIndicators() {
        let e = 0;
        e: for (;;) {
          switch (this.charAt(0)) {
            case "!":
              ((e += yield* this.pushTag()), (e += yield* this.pushSpaces(!0)));
              continue e;
            case "&":
              ((e += yield* this.pushUntil(Ui)), (e += yield* this.pushSpaces(!0)));
              continue e;
            case "-":
            case "?":
            case ":": {
              let n = this.flowLevel > 0,
                r = this.charAt(1);
              if (te(r) || (n && Fn.has(r))) {
                (n ? this.flowKey && (this.flowKey = !1) : (this.indentNext = this.indentValue + 1),
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
            n = this.buffer[e];
          for (; !te(n) && n !== ">";) n = this.buffer[++e];
          return yield* this.pushToIndex(n === ">" ? e + 1 : e, !1);
        } else {
          let e = this.pos + 1,
            n = this.buffer[e];
          for (; n;)
            if (hh.has(n)) n = this.buffer[++e];
            else if (n === "%" && Za.has(this.buffer[e + 1]) && Za.has(this.buffer[e + 2])) n = this.buffer[(e += 3)];
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
        let n = this.pos - 1,
          r;
        do r = this.buffer[++n];
        while (r === " " || (e && r === "	"));
        let i = n - this.pos;
        return (i > 0 && (yield this.buffer.substr(this.pos, i), (this.pos = n)), i);
      }
      *pushUntil(e) {
        let n = this.pos,
          r = this.buffer[n];
        for (; !e(r);) r = this.buffer[++n];
        return yield* this.pushToIndex(n, !1);
      }
    };
  ec.Lexer = Li;
});
var Oi = I((tc) => {
  "use strict";
  var Mi = class {
    constructor() {
      ((this.lineStarts = []),
        (this.addNewLine = (e) => this.lineStarts.push(e)),
        (this.linePos = (e) => {
          let n = 0,
            r = this.lineStarts.length;
          for (; n < r;) {
            let s = (n + r) >> 1;
            this.lineStarts[s] < e ? (n = s + 1) : (r = s);
          }
          if (this.lineStarts[n] === e) return { line: n + 1, col: 1 };
          if (n === 0) return { line: 0, col: e };
          let i = this.lineStarts[n - 1];
          return { line: n, col: e - i + 1 };
        }));
    }
  };
  tc.LineCounter = Mi;
});
var $i = I((oc) => {
  "use strict";
  var gh = Mt("process"),
    nc = jn(),
    mh = Di();
  function Pe(t, e) {
    for (let n = 0; n < t.length; ++n) if (t[n].type === e) return !0;
    return !1;
  }
  function rc(t) {
    for (let e = 0; e < t.length; ++e)
      switch (t[e].type) {
        case "space":
        case "comment":
        case "newline":
          break;
        default:
          return e;
      }
    return -1;
  }
  function sc(t) {
    switch (t?.type) {
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
  function qn(t) {
    switch (t.type) {
      case "document":
        return t.start;
      case "block-map": {
        let e = t.items[t.items.length - 1];
        return e.sep ?? e.start;
      }
      case "block-seq":
        return t.items[t.items.length - 1].start;
      default:
        return [];
    }
  }
  function et(t) {
    if (t.length === 0) return [];
    let e = t.length;
    e: for (; --e >= 0;)
      switch (t[e].type) {
        case "doc-start":
        case "explicit-key-ind":
        case "map-value-ind":
        case "seq-item-ind":
        case "newline":
          break e;
      }
    for (; t[++e]?.type === "space";);
    return t.splice(e, t.length);
  }
  function Bn(t, e) {
    if (e.length < 1e5) Array.prototype.push.apply(t, e);
    else for (let n = 0; n < e.length; ++n) t.push(e[n]);
  }
  function ic(t) {
    if (t.start.type === "flow-seq-start")
      for (let e of t.items)
        e.sep &&
          !e.value &&
          !Pe(e.start, "explicit-key-ind") &&
          !Pe(e.sep, "map-value-ind") &&
          (e.key && (e.value = e.key),
          delete e.key,
          sc(e.value) ? (e.value.end ? Bn(e.value.end, e.sep) : (e.value.end = e.sep)) : Bn(e.start, e.sep),
          delete e.sep);
  }
  var Vi = class {
    constructor(e) {
      ((this.atNewLine = !0),
        (this.atScalar = !1),
        (this.indent = 0),
        (this.offset = 0),
        (this.onKeyLine = !1),
        (this.stack = []),
        (this.source = ""),
        (this.type = ""),
        (this.lexer = new mh.Lexer()),
        (this.onNewLine = e));
    }
    *parse(e, n = !1) {
      this.onNewLine && this.offset === 0 && this.onNewLine(0);
      for (let r of this.lexer.lex(e, n)) yield* this.next(r);
      n || (yield* this.end());
    }
    *next(e) {
      if (((this.source = e), gh.env.LOG_TOKENS && console.log("|", nc.prettyToken(e)), this.atScalar)) {
        ((this.atScalar = !1), yield* this.step(), (this.offset += e.length));
        return;
      }
      let n = nc.tokenType(e);
      if (n)
        if (n === "scalar") ((this.atNewLine = !1), (this.atScalar = !0), (this.type = "scalar"));
        else {
          switch (((this.type = n), yield* this.step(), n)) {
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
        let r = `Not a YAML token: ${e}`;
        (yield* this.pop({ type: "error", offset: this.offset, message: r, source: e }), (this.offset += e.length));
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
      let n = e ?? this.stack.pop();
      if (!n) yield { type: "error", offset: this.offset, source: "", message: "Tried to pop an empty stack" };
      else if (this.stack.length === 0) yield n;
      else {
        let r = this.peek(1);
        switch (
          (n.type === "block-scalar"
            ? (n.indent = "indent" in r ? r.indent : 0)
            : n.type === "flow-collection" && r.type === "document" && (n.indent = 0),
          n.type === "flow-collection" && ic(n),
          r.type)
        ) {
          case "document":
            r.value = n;
            break;
          case "block-scalar":
            r.props.push(n);
            break;
          case "block-map": {
            let i = r.items[r.items.length - 1];
            if (i.value) {
              (r.items.push({ start: [], key: n, sep: [] }), (this.onKeyLine = !0));
              return;
            } else if (i.sep) i.value = n;
            else {
              (Object.assign(i, { key: n, sep: [] }), (this.onKeyLine = !i.explicitKey));
              return;
            }
            break;
          }
          case "block-seq": {
            let i = r.items[r.items.length - 1];
            i.value ? r.items.push({ start: [], value: n }) : (i.value = n);
            break;
          }
          case "flow-collection": {
            let i = r.items[r.items.length - 1];
            !i || i.value
              ? r.items.push({ start: [], key: n, sep: [] })
              : i.sep
                ? (i.value = n)
                : Object.assign(i, { key: n, sep: [] });
            return;
          }
          default:
            (yield* this.pop(), yield* this.pop(n));
        }
        if (
          (r.type === "document" || r.type === "block-map" || r.type === "block-seq") &&
          (n.type === "block-map" || n.type === "block-seq")
        ) {
          let i = n.items[n.items.length - 1];
          i &&
            !i.sep &&
            !i.value &&
            i.start.length > 0 &&
            rc(i.start) === -1 &&
            (n.indent === 0 || i.start.every((s) => s.type !== "comment" || s.indent < n.indent)) &&
            (r.type === "document" ? (r.end = i.start) : r.items.push({ start: i.start }), n.items.splice(-1, 1));
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
          rc(e.start) !== -1 ? (yield* this.pop(), yield* this.step()) : e.start.push(this.sourceToken);
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
      let n = this.startBlockValue(e);
      n
        ? this.stack.push(n)
        : yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source,
          };
    }
    *scalar(e) {
      if (this.type === "map-value-ind") {
        let n = qn(this.peek(2)),
          r = et(n),
          i;
        e.end ? ((i = e.end), i.push(this.sourceToken), delete e.end) : (i = [this.sourceToken]);
        let s = { type: "block-map", offset: e.offset, indent: e.indent, items: [{ start: r, key: e, sep: i }] };
        ((this.onKeyLine = !0), (this.stack[this.stack.length - 1] = s));
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
    *blockMap(e) {
      let n = e.items[e.items.length - 1];
      switch (this.type) {
        case "newline":
          if (((this.onKeyLine = !1), n.value)) {
            let r = "end" in n.value ? n.value.end : void 0;
            (Array.isArray(r) ? r[r.length - 1] : void 0)?.type === "comment"
              ? r?.push(this.sourceToken)
              : e.items.push({ start: [this.sourceToken] });
          } else n.sep ? n.sep.push(this.sourceToken) : n.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (n.value) e.items.push({ start: [this.sourceToken] });
          else if (n.sep) n.sep.push(this.sourceToken);
          else {
            if (this.atIndentedComment(n.start, e.indent)) {
              let i = e.items[e.items.length - 2]?.value?.end;
              if (Array.isArray(i)) {
                (Bn(i, n.start), i.push(this.sourceToken), e.items.pop());
                return;
              }
            }
            n.start.push(this.sourceToken);
          }
          return;
      }
      if (this.indent >= e.indent) {
        let r = !this.onKeyLine && this.indent === e.indent,
          i = r && (n.sep || n.explicitKey) && this.type !== "seq-item-ind",
          s = [];
        if (i && n.sep && !n.value) {
          let o = [];
          for (let a = 0; a < n.sep.length; ++a) {
            let c = n.sep[a];
            switch (c.type) {
              case "newline":
                o.push(a);
                break;
              case "space":
                break;
              case "comment":
                c.indent > e.indent && (o.length = 0);
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
            i || n.value
              ? (s.push(this.sourceToken), e.items.push({ start: s }), (this.onKeyLine = !0))
              : n.sep
                ? n.sep.push(this.sourceToken)
                : n.start.push(this.sourceToken);
            return;
          case "explicit-key-ind":
            (!n.sep && !n.explicitKey
              ? (n.start.push(this.sourceToken), (n.explicitKey = !0))
              : i || n.value
                ? (s.push(this.sourceToken), e.items.push({ start: s, explicitKey: !0 }))
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
                if (n.value) e.items.push({ start: [], key: null, sep: [this.sourceToken] });
                else if (Pe(n.sep, "map-value-ind"))
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: s, key: null, sep: [this.sourceToken] }],
                  });
                else if (sc(n.key) && !Pe(n.sep, "newline")) {
                  let o = et(n.start),
                    a = n.key,
                    c = n.sep;
                  (c.push(this.sourceToken),
                    delete n.key,
                    delete n.sep,
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: o, key: a, sep: c }],
                    }));
                } else s.length > 0 ? (n.sep = n.sep.concat(s, this.sourceToken)) : n.sep.push(this.sourceToken);
              else if (Pe(n.start, "newline")) Object.assign(n, { key: null, sep: [this.sourceToken] });
              else {
                let o = et(n.start);
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: o, key: null, sep: [this.sourceToken] }],
                });
              }
            else
              n.sep
                ? n.value || i
                  ? e.items.push({ start: s, key: null, sep: [this.sourceToken] })
                  : Pe(n.sep, "map-value-ind")
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
            i || n.value
              ? (e.items.push({ start: s, key: o, sep: [] }), (this.onKeyLine = !0))
              : n.sep
                ? this.stack.push(o)
                : (Object.assign(n, { key: o, sep: [] }), (this.onKeyLine = !0));
            return;
          }
          default: {
            let o = this.startBlockValue(e);
            if (o) {
              if (o.type === "block-seq") {
                if (!n.explicitKey && n.sep && !Pe(n.sep, "newline")) {
                  yield* this.pop({
                    type: "error",
                    offset: this.offset,
                    message: "Unexpected block-seq-ind on same line with key",
                    source: this.source,
                  });
                  return;
                }
              } else r && e.items.push({ start: s });
              this.stack.push(o);
              return;
            }
          }
        }
      }
      (yield* this.pop(), yield* this.step());
    }
    *blockSequence(e) {
      let n = e.items[e.items.length - 1];
      switch (this.type) {
        case "newline":
          if (n.value) {
            let r = "end" in n.value ? n.value.end : void 0;
            (Array.isArray(r) ? r[r.length - 1] : void 0)?.type === "comment"
              ? r?.push(this.sourceToken)
              : e.items.push({ start: [this.sourceToken] });
          } else n.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (n.value) e.items.push({ start: [this.sourceToken] });
          else {
            if (this.atIndentedComment(n.start, e.indent)) {
              let i = e.items[e.items.length - 2]?.value?.end;
              if (Array.isArray(i)) {
                (Bn(i, n.start), i.push(this.sourceToken), e.items.pop());
                return;
              }
            }
            n.start.push(this.sourceToken);
          }
          return;
        case "anchor":
        case "tag":
          if (n.value || this.indent <= e.indent) break;
          n.start.push(this.sourceToken);
          return;
        case "seq-item-ind":
          if (this.indent !== e.indent) break;
          n.value || Pe(n.start, "seq-item-ind")
            ? e.items.push({ start: [this.sourceToken] })
            : n.start.push(this.sourceToken);
          return;
      }
      if (this.indent > e.indent) {
        let r = this.startBlockValue(e);
        if (r) {
          this.stack.push(r);
          return;
        }
      }
      (yield* this.pop(), yield* this.step());
    }
    *flowCollection(e) {
      let n = e.items[e.items.length - 1];
      if (this.type === "flow-error-end") {
        let r;
        do (yield* this.pop(), (r = this.peek(1)));
        while (r?.type === "flow-collection");
      } else if (e.end.length === 0) {
        switch (this.type) {
          case "comma":
          case "explicit-key-ind":
            !n || n.sep ? e.items.push({ start: [this.sourceToken] }) : n.start.push(this.sourceToken);
            return;
          case "map-value-ind":
            !n || n.value
              ? e.items.push({ start: [], key: null, sep: [this.sourceToken] })
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
              ? e.items.push({ start: [this.sourceToken] })
              : n.sep
                ? n.sep.push(this.sourceToken)
                : n.start.push(this.sourceToken);
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            let i = this.flowScalar(this.type);
            !n || n.value
              ? e.items.push({ start: [], key: i, sep: [] })
              : n.sep
                ? this.stack.push(i)
                : Object.assign(n, { key: i, sep: [] });
            return;
          }
          case "flow-map-end":
          case "flow-seq-end":
            e.end.push(this.sourceToken);
            return;
        }
        let r = this.startBlockValue(e);
        r ? this.stack.push(r) : (yield* this.pop(), yield* this.step());
      } else {
        let r = this.peek(2);
        if (
          r.type === "block-map" &&
          ((this.type === "map-value-ind" && r.indent === e.indent) ||
            (this.type === "newline" && !r.items[r.items.length - 1].sep))
        )
          (yield* this.pop(), yield* this.step());
        else if (this.type === "map-value-ind" && r.type !== "flow-collection") {
          let i = qn(r),
            s = et(i);
          ic(e);
          let o = e.end.splice(1, e.end.length);
          o.push(this.sourceToken);
          let a = { type: "block-map", offset: e.offset, indent: e.indent, items: [{ start: s, key: e, sep: o }] };
          ((this.onKeyLine = !0), (this.stack[this.stack.length - 1] = a));
        } else yield* this.lineEnd(e);
      }
    }
    flowScalar(e) {
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
          let n = qn(e),
            r = et(n);
          return (
            r.push(this.sourceToken),
            { type: "block-map", offset: this.offset, indent: this.indent, items: [{ start: r, explicitKey: !0 }] }
          );
        }
        case "map-value-ind": {
          this.onKeyLine = !0;
          let n = qn(e),
            r = et(n);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: r, key: null, sep: [this.sourceToken] }],
          };
        }
      }
      return null;
    }
    atIndentedComment(e, n) {
      return this.type !== "comment" || this.indent <= n
        ? !1
        : e.every((r) => r.type === "newline" || r.type === "space");
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
  oc.Parser = Vi;
});
var fc = I((Ut) => {
  "use strict";
  var ac = vi(),
    Sh = wt(),
    Nt = kt(),
    _h = Pr(),
    Ih = C(),
    bh = Oi(),
    cc = $i();
  function lc(t) {
    let e = t.prettyErrors !== !1;
    return { lineCounter: t.lineCounter || (e && new bh.LineCounter()) || null, prettyErrors: e };
  }
  function Eh(t, e = {}) {
    let { lineCounter: n, prettyErrors: r } = lc(e),
      i = new cc.Parser(n?.addNewLine),
      s = new ac.Composer(e),
      o = Array.from(s.compose(i.parse(t)));
    if (r && n) for (let a of o) (a.errors.forEach(Nt.prettifyError(t, n)), a.warnings.forEach(Nt.prettifyError(t, n)));
    return o.length > 0 ? o : Object.assign([], { empty: !0 }, s.streamInfo());
  }
  function uc(t, e = {}) {
    let { lineCounter: n, prettyErrors: r } = lc(e),
      i = new cc.Parser(n?.addNewLine),
      s = new ac.Composer(e),
      o = null;
    for (let a of s.compose(i.parse(t), !0, t.length))
      if (!o) o = a;
      else if (o.options.logLevel !== "silent") {
        o.errors.push(
          new Nt.YAMLParseError(
            a.range.slice(0, 2),
            "MULTIPLE_DOCS",
            "Source contains multiple documents; please use YAML.parseAllDocuments()",
          ),
        );
        break;
      }
    return (r && n && (o.errors.forEach(Nt.prettifyError(t, n)), o.warnings.forEach(Nt.prettifyError(t, n))), o);
  }
  function Ph(t, e, n) {
    let r;
    typeof e == "function" ? (r = e) : n === void 0 && e && typeof e == "object" && (n = e);
    let i = uc(t, n);
    if (!i) return null;
    if ((i.warnings.forEach((s) => _h.warn(i.options.logLevel, s)), i.errors.length > 0)) {
      if (i.options.logLevel !== "silent") throw i.errors[0];
      i.errors = [];
    }
    return i.toJS(Object.assign({ reviver: r }, n));
  }
  function wh(t, e, n) {
    let r = null;
    if (
      (typeof e == "function" || Array.isArray(e) ? (r = e) : n === void 0 && e && (n = e),
      typeof n == "string" && (n = n.length),
      typeof n == "number")
    ) {
      let i = Math.round(n);
      n = i < 1 ? void 0 : i > 8 ? { indent: 8 } : { indent: i };
    }
    if (t === void 0) {
      let { keepUndefined: i } = n ?? e ?? {};
      if (!i) return;
    }
    return Ih.isDocument(t) && !r ? t.toString(n) : new Sh.Document(t, r, n).toString(n);
  }
  Ut.parse = Ph;
  Ut.parseAllDocuments = Eh;
  Ut.parseDocument = uc;
  Ut.stringify = wh;
});
var Fi = I((N) => {
  "use strict";
  var vh = vi(),
    Th = wt(),
    kh = si(),
    ji = kt(),
    Rh = ct(),
    we = C(),
    xh = _e(),
    Ch = F(),
    Ah = be(),
    Nh = Ee(),
    Uh = jn(),
    Lh = Di(),
    Dh = Oi(),
    Mh = $i(),
    Gn = fc(),
    dc = it();
  N.Composer = vh.Composer;
  N.Document = Th.Document;
  N.Schema = kh.Schema;
  N.YAMLError = ji.YAMLError;
  N.YAMLParseError = ji.YAMLParseError;
  N.YAMLWarning = ji.YAMLWarning;
  N.Alias = Rh.Alias;
  N.isAlias = we.isAlias;
  N.isCollection = we.isCollection;
  N.isDocument = we.isDocument;
  N.isMap = we.isMap;
  N.isNode = we.isNode;
  N.isPair = we.isPair;
  N.isScalar = we.isScalar;
  N.isSeq = we.isSeq;
  N.Pair = xh.Pair;
  N.Scalar = Ch.Scalar;
  N.YAMLMap = Ah.YAMLMap;
  N.YAMLSeq = Nh.YAMLSeq;
  N.CST = Uh;
  N.Lexer = Lh.Lexer;
  N.LineCounter = Dh.LineCounter;
  N.Parser = Mh.Parser;
  N.parse = Gn.parse;
  N.parseAllDocuments = Gn.parseAllDocuments;
  N.parseDocument = Gn.parseDocument;
  N.stringify = Gn.stringify;
  N.visit = dc.visit;
  N.visitAsync = dc.visitAsync;
});
import { parentPort as rl, workerData as fg } from "node:worker_threads";
var Jn = "sqlite",
  ss = [
    "warmupProjectIndex",
    "refreshProjectIndexGeneration",
    "queryProjectIndex",
    "queryVfsEntry",
    "queryVfsChildren",
    "queryVfsEntrySummaries",
    "queryVfsGlob",
    "queryVfsEntryContent",
    "queryVfsEntryContentBatch",
    "queryVfsEntryMetaContent",
    "queryVfsContent",
    "queryVfsSearch",
    "querySemanticVfsRefs",
    "queryOwningGameObject",
    "queryGuidToProjectRelPath",
    "queryIndexStatus",
    "formatVfsReadContent",
    "formatVfsReadMetaContent",
  ];
function yl(t = process.platform) {
  let e = process.env.UNITY_INSIGHT_SERVE_PERSISTENT_CONNECTIONS?.trim().toLowerCase();
  return e === "0" || e === "false" ? !1 : e === "1" || e === "true" ? !0 : t !== "win32";
}
function os(t, e = process.platform) {
  return t && typeof t == "object" && typeof t.persistentConnections == "boolean" ? t.persistentConnections : yl(e);
}
import { AsyncLocalStorage as eg } from "node:async_hooks";
import { statSync as tg } from "node:fs";
import { existsSync as Gm, readFileSync as jl, readdirSync as Km, statSync as Fl } from "node:fs";
import { open as Qm, rename as Hm, rm as ql } from "node:fs/promises";
import $t from "node:path";
import { access as Nl, mkdir as vm, rename as Tm, rm as km } from "node:fs/promises";
import { constants as Ul } from "node:fs";
import { DatabaseSync as Ll } from "node:sqlite";
import Dl from "node:path";
var gl = new Set(["Class", "GameObject"]),
  ml = new Set(["Method", "Property", "Component", "PrefabOverrides"]);
function Sl(t) {
  return t === "directory" || t === "container";
}
function Xn(t) {
  return t.replace(/\\/g, "/").trim();
}
function as(t) {
  return t.length <= 1 ? t : t.replace(/\/+$/, "");
}
function cs(t) {
  let e = (t ?? "").trim().toLowerCase();
  switch (e) {
    case "directory":
    case "file":
    case "container":
    case "leaf":
    case "link":
      return e;
    default:
      return;
  }
}
function Ot(t) {
  let e = cs(t.entryRole);
  if (e) return e;
  let n = (t.entryType ?? "").trim().toLowerCase();
  if (n === "link") return "link";
  if (n === "directory") return "directory";
  if (n === "file") return "file";
  let r = t.labels ?? [];
  if (r.includes("VfsLink")) return "link";
  for (let i of r) if (ml.has(i)) return "leaf";
  for (let i of r) if (gl.has(i)) return "container";
  return n === "node" ? "leaf" : "file";
}
function _l(t) {
  let e = Xn(t);
  return ((e.includes(":/") ? e.slice(e.indexOf(":/") + 2) : e).split("/").filter(Boolean).pop() ?? "").startsWith(".");
}
function je(t, e) {
  let n = Xn(t);
  if (!n) return n;
  let r = as(n);
  return e && Sl(e) ? `${r}/` : r;
}
function Zn(t, e) {
  return je(t, e);
}
function Vt(t) {
  let e = Xn(t);
  if (!e) return [];
  let n = as(e),
    r = [n];
  return (
    n.endsWith(":") && !n.includes(":/") && r.unshift(n.slice(0, -1)),
    !_l(n) && !e.endsWith("/") && r.push(`${n}/`),
    e.endsWith("/") && n !== e && !n.endsWith(":") && r.unshift(`${n}/`),
    [...new Set(r.filter(Boolean))]
  );
}
function er(t) {
  return `file:${t}`;
}
function ls(t) {
  return t.trim().startsWith("@");
}
function us(t) {
  let e = t.trim();
  return e.startsWith("@") ? e.slice(1) : e;
}
import Il from "node:path";
var bl = [
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
  El = [
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
  Pl = [
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
  wl = new Map([
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
  vl = new Map([
    [".shader", "shader_lab"],
    [".hlsl", "shader_include"],
    [".cginc", "shader_include"],
    [".shadergraph", "shader_graph"],
    [".shadersubgraph", "shader_graph"],
    [".uxml", "uxml"],
    [".uss", "uss"],
    [".json", "json_file"],
  ]),
  Tl = new Map([
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
function tr(t, e, n) {
  return t.map((r) => ({ extension: r, assetKind: n.get(r) ?? "asset", ...e }));
}
var kl = [
    { extension: ".unity", fileKind: "scene", assetKind: "scene", contentMode: "text", parserKind: "unity-yaml" },
    { extension: ".scene", fileKind: "scene", assetKind: "scene", contentMode: "text", parserKind: "unity-yaml" },
    { extension: ".prefab", fileKind: "prefab", assetKind: "prefab", contentMode: "text", parserKind: "unity-yaml" },
    { extension: ".cs", fileKind: "csharp", assetKind: "script", contentMode: "text", parserKind: "csharp" },
    { extension: ".asmdef", fileKind: "asmdef", assetKind: "asmdef", contentMode: "text", parserKind: "json" },
    { extension: ".meta", fileKind: "meta", assetKind: "meta", contentMode: "text", parserKind: "meta" },
    ...tr(bl, { fileKind: "yaml-asset", contentMode: "text", parserKind: "unity-yaml" }, wl),
    ...tr(El, { fileKind: "asset", contentMode: "text", parserKind: "none" }, vl),
    ...tr(Pl, { fileKind: "asset", contentMode: "binary", parserKind: "none" }, Tl),
  ],
  Rl = new Map(kl.map((t) => [t.extension, t]));
function nr(t) {
  let e = Il.posix.extname(t).toLowerCase();
  return Rl.get(e) ?? null;
}
async function ds(t) {
  let e = Dl.join(t, "ProjectSettings", "ProjectVersion.txt");
  try {
    await Nl(e, Ul.F_OK);
  } catch (n) {
    throw new Error(`Invalid Unity project root: missing required path ${e}`, { cause: n });
  }
}
function Fe(t) {
  let e = new Ll(t, { readOnly: !0 });
  try {
    rr(e);
  } catch (n) {
    throw (e.close(), n);
  }
  return e;
}
function rr(t) {
  (t.exec("PRAGMA foreign_keys = ON"),
    t.exec("PRAGMA query_only = ON"),
    t.exec("PRAGMA cache_size = -32768"),
    t.exec("PRAGMA temp_store = FILE"));
}
var ce = class extends Error {
  constructor(e) {
    (super(e), (this.name = "UnityInsightIndexNotFoundError"));
  }
};
import { existsSync as Ml, readFileSync as Ol } from "node:fs";
import { DatabaseSync as Om } from "node:sqlite";
function Vl(t) {
  if (!Number.isFinite(t) || t <= 0) return !1;
  try {
    return (process.kill(t, 0), !0);
  } catch {
    return !1;
  }
}
function $l(t) {
  let e = t.trim();
  if (!e) return null;
  try {
    let n = JSON.parse(e),
      r = Number(n.pid),
      i = n.mode === "build" || n.mode === "sync" ? n.mode : null;
    return !Vl(r) || i === null
      ? null
      : { pid: r, mode: i, startedAt: typeof n.startedAt == "string" ? n.startedAt : "" };
  } catch {
    return null;
  }
}
function ps(t) {
  try {
    return Ml(t.indexLockPath) ? $l(Ol(t.indexLockPath, "utf8")) : null;
  } catch {
    return null;
  }
}
var hs = /^index\.[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.db$/;
var ys = 3,
  xe = class extends Error {
    constructor(e, n) {
      (super(e, n), (this.name = "UnityInsightIndexPointerError"));
    }
  },
  jt = class extends Error {
    constructor(e, n) {
      (super(e, n), (this.name = "UnityInsightIndexResolutionRaceError"));
    }
  };
function Bl(t, e) {
  if (
    !e.endsWith(`
`) ||
    e.slice(0, -1).includes(`
`) ||
    e.slice(0, -1).includes("\r")
  )
    throw new xe(
      `Corrupt Unity Insight index pointer for ${t.projectPath} at ${t.currentPointerPath}: expected one generated database basename followed by a newline.`,
    );
  let n = e.slice(0, -1);
  if (!hs.test(n) || $t.basename(n) !== n)
    throw new xe(
      `Corrupt Unity Insight index pointer for ${t.projectPath} at ${t.currentPointerPath}: invalid selected database ${JSON.stringify(n)}.`,
    );
  return n;
}
function gs(t) {
  if (typeof t != "object" || t === null) return !1;
  let e = t.code;
  return e === "ENOENT" || e === "ENOTDIR";
}
function ms(t, e = Fl) {
  try {
    return (e(t), !0);
  } catch (n) {
    if (gs(n)) return !1;
    throw n;
  }
}
function qe(t, e) {
  let n;
  try {
    n = jl(t.currentPointerPath, "utf8");
  } catch (i) {
    if (!gs(i))
      throw new xe(`Failed to read Unity Insight index pointer for ${t.projectPath} at ${t.currentPointerPath}.`, {
        cause: i,
      });
    return e(t.liveDbPath) ? { kind: "legacy", indexPath: t.liveDbPath } : { kind: "none" };
  }
  let r = Bl(t, n);
  return { kind: "generated", pointerText: n, indexPath: $t.join(t.indexDirectoryPath, r) };
}
function ir(t) {
  return new ce(
    `Unity Insight index not found for ${t.projectPath}. Checked pointer ${t.currentPointerPath} and legacy database ${t.liveDbPath}.`,
  );
}
function Ft(t, e) {
  return t.kind !== e.kind
    ? !1
    : t.kind === "none"
      ? !0
      : t.kind === "legacy"
        ? e.kind === "legacy" && t.indexPath === e.indexPath
        : e.kind === "generated" && t.pointerText === e.pointerText && t.indexPath === e.indexPath;
}
function qt(t, e = {}) {
  let n = e.openDatabase ?? Fe,
    r = (s) => ms(s, e.statFile),
    i;
  for (let s = 0; s < ys; s += 1) {
    let o = qe(t, r);
    if (o.kind === "none") {
      let a = qe(t, r);
      if (!Ft(o, a)) continue;
      throw ir(t);
    }
    try {
      return { indexPath: o.indexPath, database: n(o.indexPath) };
    } catch (a) {
      i = a;
      let c = qe(t, r);
      if (!Ft(o, c)) continue;
      throw o.kind === "generated" && !r(o.indexPath)
        ? new xe(
            `Corrupt Unity Insight index pointer for ${t.projectPath} at ${t.currentPointerPath}: selected database is missing at ${o.indexPath}.`,
            { cause: a },
          )
        : a;
    }
  }
  throw new jt(`Unity Insight index selection kept changing while opening a read-only database for ${t.projectPath}.`, {
    cause: i,
  });
}
function Gl(t, e = {}) {
  let n = (r) => ms(r, e.statFile);
  for (let r = 0; r < ys; r += 1) {
    let i = qe(t, n);
    if (i.kind === "none") {
      let o = qe(t, n);
      if (!Ft(i, o)) continue;
      throw ir(t);
    }
    if (n(i.indexPath)) return i.indexPath;
    let s = qe(t, n);
    if (Ft(i, s))
      throw i.kind === "generated"
        ? new xe(
            `Corrupt Unity Insight index pointer for ${t.projectPath} at ${t.currentPointerPath}: selected database is missing at ${i.indexPath}.`,
          )
        : ir(t);
  }
  throw new jt(`Unity Insight index selection kept changing while resolving a database path for ${t.projectPath}.`);
}
function sr(t, e = {}) {
  try {
    return Gl(t, e);
  } catch (n) {
    if (n instanceof ce) return;
    throw n;
  }
}
function Kl(t, e) {
  if ($t.dirname(e) !== t.indexDirectoryPath) return !1;
  let n = $t.basename(e);
  return e === t.liveDbPath || hs.test(n);
}
async function Wl(t) {
  let e = [];
  return (
    await Promise.all(
      [t, `${t}-wal`, `${t}-shm`].map(async (n) => {
        try {
          await ql(n, { force: !0 });
        } catch (r) {
          e.push({ path: n, error: r });
        }
      }),
    ),
    e
  );
}
async function Ss(t, e) {
  if (!Kl(t, e)) return [];
  let n;
  try {
    n = sr(t);
  } catch (r) {
    return [{ path: t.currentPointerPath, error: r }];
  }
  return n === e ? [] : Wl(e);
}
function Bt(t) {
  if (!t) return { lowerBound: "", upperBound: "\uFFFF" };
  for (let e = t.length - 1; e >= 0; e -= 1) {
    let n = t.charCodeAt(e);
    if (n < 65535) return { lowerBound: t, upperBound: `${t.slice(0, e)}${String.fromCharCode(n + 1)}` };
  }
  return { lowerBound: t, upperBound: `${t}\uFFFF` };
}
import pe from "node:path";
var Ql = pe.join(".codely-cli", "UnityInsight"),
  Hl = "index.db",
  Yl = "index.db.tmp",
  zl = "index.current",
  Jl = ".index.lock",
  Xl = ".index.write.lock.db",
  Zl = ".serve.lock";
function rt(t) {
  let e = pe.join(t, Ql);
  return {
    projectPath: t,
    indexDirectoryPath: e,
    liveDbPath: pe.join(e, Hl),
    tempDbPath: pe.join(e, Yl),
    currentPointerPath: pe.join(e, zl),
    indexLockPath: pe.join(e, Jl),
    indexWriteLockDbPath: pe.join(e, Xl),
    serveLockPath: pe.join(e, Zl),
  };
}
function _s(t) {
  return t === "texture" ? "image" : t;
}
var Gt = [
  "Class",
  "Method",
  "Property",
  "GameObject",
  "Component",
  "Script",
  "Scene",
  "SceneSettings",
  "Prefab",
  "PrefabVariant",
  "PrefabOverrides",
  "ScriptableObject",
  "ScriptableObjectSubAsset",
  "Texture",
  "Sprite",
  "Image",
  "Mesh",
  "Model",
  "AudioClip",
  "Material",
  "ShaderGraph",
  "ShaderGraphProperties",
  "ShaderGraphSettings",
  "ShaderGraphNode",
  "VisualEffectGraph",
  "AnimationClip",
  "ShaderLab",
  "AnimatorController",
  "AudioMixerGroup",
  "AudioMixer",
  "PhysicMaterial",
  "PhysicMaterial2D",
  "UXML",
  "USS",
  "JSONFile",
  "Directory",
  "ALL",
];
function Is(t) {
  return { sql: "entry.entry_kind = ?", params: [t] };
}
function eu(t) {
  return t.length === 0
    ? { sql: "1 = 0", params: [] }
    : { sql: `entry.entry_kind IN (${t.map(() => "?").join(", ")})`, params: [...t] };
}
function tu(t, e) {
  let n = t.length === 1 ? Is(t[0]) : eu(t);
  return e.length === 0
    ? n
    : e.length === 1
      ? {
          sql: `(${n.sql} OR (entry.entry_type = 'file' AND lower(entry.vfs_path) LIKE ?))`,
          params: [...n.params, `%${e[0]}`],
        }
      : {
          sql: `(${n.sql} OR (entry.entry_type = 'file' AND (${e.map(() => "lower(entry.vfs_path) LIKE ?").join(" OR ")})))`,
          params: [...n.params, ...e.map((r) => `%${r}`)],
        };
}
function nu(t) {
  return { sql: "entry.entry_type = ?", params: [t] };
}
var ru = [
  { filters: ["Class"], additionalEntryKinds: ["class", "struct", "interface", "enum"] },
  { filters: ["Method"], additionalEntryKinds: ["method"] },
  { filters: ["Property"], additionalEntryKinds: ["property"] },
  { filters: ["GameObject"], additionalEntryKinds: ["gameobject"] },
  { filters: ["Component"], additionalEntryKinds: ["component"] },
  { filters: ["Script"], fileKinds: ["script"], fileExtensions: [".cs"] },
  { filters: ["Scene"], fileKinds: ["scene"], fileExtensions: [".unity"] },
  { filters: ["SceneSettings"], additionalEntryKinds: ["scene_settings"] },
  { filters: ["Prefab"], fileKinds: ["prefab"], fileExtensions: [".prefab"] },
  { filters: ["PrefabVariant"], additionalEntryKinds: ["prefab_variant"] },
  { filters: ["PrefabOverrides"], additionalEntryKinds: ["prefab_overrides"] },
  { filters: ["ScriptableObject"], fileKinds: ["scriptable_object"] },
  { filters: ["ScriptableObjectSubAsset"], additionalEntryKinds: ["subasset"] },
  { filters: ["Texture", "Sprite", "Image"], fileKinds: ["texture"], additionalEntryKinds: ["sprite"] },
  { filters: ["Mesh"], additionalEntryKinds: ["mesh"] },
  { filters: ["Model"], fileKinds: ["model"] },
  { filters: ["AudioClip"], fileKinds: ["audio_clip"] },
  { filters: ["Material"], fileKinds: ["material"] },
  { filters: ["ShaderGraph"], fileKinds: ["shader_graph"] },
  { filters: ["ShaderGraphProperties"], additionalEntryKinds: ["shader_graph_properties"] },
  { filters: ["ShaderGraphSettings"], additionalEntryKinds: ["shader_graph_settings"] },
  { filters: ["ShaderGraphNode"], additionalEntryKinds: ["shader_graph_node"] },
  {
    filters: ["VisualEffectGraph"],
    fileKinds: ["visual_effect_graph"],
    additionalEntryKinds: [
      "visual_effect_graph_properties",
      "visual_effect_graph_property",
      "visual_effect_graph_context",
      "visual_effect_graph_block",
    ],
  },
  { filters: ["AnimationClip"], fileKinds: ["animation_clip"] },
  { filters: ["ShaderLab"], fileKinds: ["shader_lab"] },
  { filters: ["AnimatorController"], fileKinds: ["animator_controller"] },
  { filters: ["AudioMixerGroup"], additionalEntryKinds: ["audio_mixer_group"] },
  { filters: ["AudioMixer"], fileKinds: ["audio_mixer"], additionalEntryKinds: ["audio_mix"] },
  { filters: ["PhysicMaterial"], fileKinds: ["physic_material"] },
  { filters: ["PhysicMaterial2D"], fileKinds: ["physic_material_2d"] },
  { filters: ["UXML"], fileKinds: ["uxml"] },
  { filters: ["USS"], fileKinds: ["uss"] },
  { filters: ["JSONFile"], fileKinds: ["json_file"], additionalEntryKinds: ["text_asset"] },
  { filters: ["Directory"], entryType: "directory" },
];
function iu(t) {
  return [...(t.fileKinds ?? []), ...(t.additionalEntryKinds ?? [])];
}
function su(t) {
  return t.entryType ? nu(t.entryType) : tu(iu(t), t.fileExtensions ?? []);
}
function ou(t) {
  return [...new Set((t.fileKinds ?? []).map(_s))];
}
function bs(t) {
  return (t ?? "").trim().toLowerCase();
}
function Es(t) {
  let e = bs(t);
  return ru.find((n) => n.filters.some((r) => r.toLowerCase() === e));
}
function or(t) {
  let e = bs(t);
  if (!e || e === "all") return null;
  let n = Es(e);
  return n ? su(n) : e === "asset" ? null : Is(e);
}
function Ps(t) {
  let e = or(t);
  if (!e) return null;
  let n = Es(t),
    r = n ? ou(n) : [];
  return r.length === 0
    ? e
    : { sql: `(${e.sql} OR entry.file_family IN (${r.map(() => "?").join(", ")}))`, params: [...e.params, ...r] };
}
var Be = Gt.map((t) => `\`${t}\``).join(", ");
function Kt() {
  return [...Gt];
}
var au = [
    {
      name: "vfs_ls",
      displayName: "VFS LS",
      description: `List child VFS entry paths under a virtual path with **size in KB** for every row. \`path\` is a Unity project-relative VFS path, not an absolute filesystem path: use \`Assets/\` for the project asset root, never \`/Users/.../Assets\` or the Unity project directory. **Files** and **virtual nodes** show their own indexed or on-disk size; **directories** show the **recursive sum of all disk files** in that subtree. Canonical paths follow **entry_role**: directories and container nodes (Class, GameObject) end with **\`/\`**; files, leaves, and links do not. Prefab-boundary **\`.SourcePrefab\`** link rows include **\`target_vfs_path\`** (container targets also end with **\`/\`**), and **\`.PrefabOverrides\`** remains visible in listings. Optional \`show_type\` filters returned children using the same enum values as \`vfs_refs.target_type\`: ${Be}. Text files such as \`.csv\`, \`.cs\`, \`.shader\`, and \`.hlsl\` expose a synthetic **\`/.content\`** child that can be read with **\`vfs_read(file:/.content)\`**. Use **\`depth\`** (1\u20135) to widen the listing. Pair with **\`vfs_read\`** on specific paths or with **\`depth\`** on node paths for subtree content.`,
      parameterSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description:
              "Unity project-relative VFS path to list (for example `Assets/`, `Assets/Enemy.prefab`, or `Assets/Scripts/Foo.cs:/Foo/`). Do not pass absolute filesystem paths such as `/Users/name/Project/Assets` or the Unity project root; use `Assets/` instead. Returned entries are relative to this path. To call vfs_read on a file-internal child, rebuild as `assetPath:/relativeSuffix` (not `assetPath/relativeSuffix`).",
          },
          depth: {
            type: "integer",
            description:
              "Listing depth (1\u20135). Defaults to 1. Counts relative segments from the listed path; when depth > 1, pierces Unity asset files (`.cs`, `.prefab`, `.unity`) to include virtual internal nodes (classes, GameObjects, methods, etc.).",
            minimum: 1,
            maximum: 5,
          },
          output_format: {
            type: "string",
            enum: ["flat", "grouped_list"],
            description:
              "Optional plain-text rendering style. `flat` keeps the current line-by-line list. `grouped_list` prints stable group headers plus relative suffix lines; grouped entries also expose `entryType` values (`directory`, `file`, `node`, `link`). When file-internal nodes are present, grouped_list preserves the overall sorted entry order while locally folding each file\u2019s file-internal items into sections with headers such as `File: Assets/.../Foo.cs`; node rows render as slash-prefixed suffixes such as `- /Foo/` or `- /Foo/Bar.fn`; link rows render inline targets such as `- /.SourcePrefab -> Assets/.../Enemy.prefab:/EnemyRoot`; and non-grouped directory/plain-file entries still appear as normal flat `- ...` lines in sorted order. If the result contains only directories and plain files, `grouped_list` falls back to an ungrouped flat list. Default: `grouped_list`. Each line is prefixed with **SIZE_KB**.",
          },
          show_type: {
            type: "string",
            enum: Kt(),
            description: `Optional returned child type filter. \`ALL\` or omission disables filtering. Allowed values match \`vfs_refs.target_type\`: ${Be}.`,
          },
        },
        required: ["path"],
        additionalProperties: !1,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
      defaultEnabled: !0,
    },
    {
      name: "vfs_glob",
      displayName: "VFS Glob",
      description:
        "Find VFS entries whose virtual paths match a glob pattern. Optional `ignore_case` controls path matching case behavior (default false: case-sensitive). When `ignore_case` is true, do not run duplicate patterns that differ only by letter case (for example `**/*explosion*` already covers `**/*Explosion*`); when false, matching is case-sensitive. Returns matched nodes (including line-range metadata when available) with canonical full `vfs_path` values. Each matched entry includes **SIZE_KB** using the same rules as **`vfs_ls`** (directories: recursive disk-file sum; files/nodes: own size). Required `type` is pushed into the graph query; prefer a precise type such as `Scene`, `SceneSettings`, `Prefab`, `Script`, `GameObject`, or `Component`. Do not use `ALL` unless necessary: it disables type filtering and can be much slower. **For GameObject hierarchy**, use this tool: virtual paths encode structure\u2014nested segments reflect scene, prefab, and object layout in the index. Same-name sibling GameObject/Component segments include a `#siblingIndex` suffix; unique sibling names do not. Matched prefab-boundary `.SourcePrefab` link rows include `target_vfs_path` so you can jump directly to the source prefab.",
      parameterSchema: {
        type: "object",
        properties: {
          pattern: {
            type: "string",
            description:
              "Glob pattern applied to virtual paths. Case-sensitive unless `ignore_case` is true; when true, matching is case-insensitive and one pattern such as `**/*explosion*` covers `**/*Explosion*`. If the pattern crosses a Unity asset boundary, prefer canonical `:/` forms such as `**/*.unity:/**/Leg`; `vfs_glob` also accepts slash-form compatibility patterns such as `**/*.unity/**/Leg`. For GameObject/Component segments, include a `#siblingIndex` suffix only when targeting same-name siblings.",
          },
          path: {
            type: "string",
            description:
              "Base VFS path for the search. If omitted or empty, searches globally. Returned `vfs_path` values remain canonical full paths even when `path` is provided. If you already know the target `.unity`, `.prefab`, `.cs`, or other Unity asset file, pass that asset file via `path` and keep `pattern` focused on the internal suffix.",
          },
          ignore_case: {
            type: "boolean",
            enum: [!0, !1],
            default: !1,
            description:
              "Optional path matching case flag. Default: false (case-sensitive). When true, glob matching is case-insensitive, so one pattern such as `**/*explosion*` already covers `**/*Explosion*`; do not run duplicate case variants.",
          },
          type: {
            type: "string",
            enum: Kt(),
            description: `Required Unity VFS node type filter. Prefer the most precise concrete type because it is pushed into the graph query and is much faster. Do not use \`ALL\` unless necessary; it searches all supported entries without a type filter and can be slow. Use \`ALL\` only when no concrete type fits. Allowed values: ${Be}.`,
          },
          limit: {
            type: "integer",
            description:
              "Maximum number of matched VFS entries to return. Use `1` for existence checks; increase when you need more or all matches. Default: 100.",
            minimum: 1,
            maximum: 1e4,
          },
          output_format: {
            type: "string",
            enum: ["flat", "grouped_list"],
            description:
              "Optional plain-text rendering style. `flat` keeps the current line-by-line list. `grouped_list` prints stable group headers plus slash-prefixed file-internal suffix lines; grouped entries also expose `entryType` values (`directory`, `file`, `node`, `link`). When file-internal nodes are present, grouped_list preserves the overall sorted entry order while locally folding each file\u2019s file-internal items into sections with headers such as `File: Assets/.../Foo.cs`; node rows render as slash-prefixed suffixes such as `- /Foo/` or `- /Foo/Bar.fn`; link rows render inline targets such as `- /.SourcePrefab -> Assets/.../Enemy.prefab:/EnemyRoot`; and non-grouped directory/plain-file entries still appear as normal flat canonical `- ...` lines in sorted order. The grouped section header identifies the backing file, so the grouped file row itself is omitted. If the result contains only directories and plain files, `grouped_list` falls back to an ungrouped flat list. Default: `grouped_list`. Each line is prefixed with **SIZE_KB**.",
          },
        },
        required: ["pattern", "type"],
        additionalProperties: !1,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
      defaultEnabled: !0,
    },
    {
      name: "vfs_read",
      displayName: "VFS Read",
      description:
        "Read a VFS entry. **File or folder paths** return the on-disk Unity **`.meta` YAML** (GUID, importer, etc.). **File-internal node paths** (`file:/node/...`) return indexed **`content`** from the graph\u2014for scripts, class nodes are mostly **fields**, while method and property nodes hold member declarations. Text reads return the full indexed content without a byte cap or pagination parameter. Supported text file bodies are indexed as **`file:/.content`** nodes, for example `Assets/Data/table.csv:/.content`; unsupported files do not expose this node. **Link nodes** such as `.SourcePrefab` return link metadata with **`target_vfs_path`**; reading `.PrefabOverrides` returns indexed override content for that node (local-layer delta only). Prefer **`vfs_ls`** (check **SIZE_KB**) then **`vfs_read`** on specific nodes for large files; use **`vfs_read(file:/.content)`** for full script/text bodies (prefer over many per-method reads) and optional **`depth`** on node paths for subtree reads. For line-level evidence, use **`vfs_glob`** or **`vfs_grep`**.",
      parameterSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description:
              "Virtual path to read. Asset roots (for example `Assets/.../Foo.cs`, `Assets/.../Enemy.prefab`, `Assets/Scripts/`) return `.meta`. Internal nodes use `file:/node/path` (for example `Assets/.../Enemy.prefab:/Root/Body/MeshRenderer.comp` or `Assets/Scripts/Foo.cs:/Foo/Bar.fn`). Text file bodies use the indexed `file:/.content` node, for example `Assets/Scripts/Foo.cs:/.content`.",
          },
          depth: {
            type: "integer",
            description:
              "Optional recursion depth (0\u20135) when reading a file-internal node path. Omitted or 0 returns only the requested node. Values 1\u20135 include descendant node contents within the depth budget, formatted with path section headers. Invalid on file, folder, or link paths.",
            minimum: 0,
            maximum: 5,
          },
        },
        required: ["path"],
        additionalProperties: !1,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
      defaultEnabled: !0,
    },
    {
      name: "vfs_grep",
      displayName: "VFS Grep",
      description:
        "Search indexed lines within a VFS scope. Physical file entries search their paired `.meta` content. A file-family type such as `Script` searches that file metadata plus actual searchable descendants such as `:/.content`, Class, and Method entries; every result keeps the path and type of the actual matching entry. Exact node types such as `Class` and `Method` keep their own content boundaries. `Texture`, `Sprite`, and `Image` intentionally select the same Texture family. Accepts regex **`pattern`** (or deprecated **`query`**), optional **`path`** scope prefix, optional case-insensitive **`include`** path glob, required **`type`** filter, and optional **`ignore_case`** (default false). Prefer a precise `type` because it is pushed into the graph query; `ALL` disables type filtering and can be much slower, so use it only as a fallback when no concrete type fits. **`pattern` matches indexed lines, not `vfs_path`**\u2014use **`vfs_glob`** for path-based discovery. Returns matches with canonical `vfs_path`, node `type`, `line`, and `text`.",
      parameterSchema: {
        type: "object",
        properties: {
          pattern: {
            type: "string",
            description:
              "Regex matched against each candidate entry\u2019s indexed lines, including physical-file `.meta` content and supported `.content` and semantic-child content (not `vfs_path`). Case-sensitive unless `ignore_case` is true; set `ignore_case` true for case-insensitive matching.",
          },
          query: {
            type: "string",
            description:
              "Deprecated. Plain-text or simple glob-style (`*?[]`) substring search; prefer regex `pattern`.",
          },
          path: {
            type: "string",
            description:
              "VFS path prefix that limits the search scope (for example `Assets/`). If omitted or empty, searches globally.",
          },
          include: {
            type: "string",
            description:
              "Optional case-insensitive glob on `vfs_path` or source path (for example `*.unity`). Only matching candidate entries are searched; does not apply `pattern` to paths. Do not run duplicate include globs that differ only by letter case.",
          },
          type: {
            type: "string",
            enum: Kt(),
            description: `Required Unity VFS type filter applied before content matching. A type that matches a physical file selects that file family; exact node types select only their existing node rule. Prefer the most precise concrete type because it is pushed into the graph query and is much faster. Do not use \`ALL\` unless necessary; it searches all supported entries without a type filter and can be slow. Allowed values: ${Be}. Enum declarations are indexed as Class-kind nodes.`,
          },
          limit: {
            type: "integer",
            description:
              "Maximum number of content matches to return. Use `1` for existence checks; increase when you need more or all matches. Default: 100.",
            minimum: 1,
            maximum: 1e4,
          },
          ignore_case: {
            type: "boolean",
            enum: [!0, !1],
            default: !1,
            description:
              "Optional content matching case flag. Default: false (case-sensitive). When true, regex and deprecated query matching is case-insensitive.",
          },
        },
        required: ["type"],
        additionalProperties: !1,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
      defaultEnabled: !0,
    },
    {
      name: "vfs_refs",
      displayName: "VFS Refs",
      description: `Query related VFS entries for a target path. **No \`mode\` argument**\u2014behavior is inferred from **\`path\`**: paths ending in **\`.cs\`** return Unity Component -> ScriptClass bindings (always **incoming**; \`direction\` is ignored); script class paths such as **\`Foo.cs:/Foo/\`** and method paths such as **\`Foo.cs:/Foo/Bar.fn\`** return call relationships (\`direction\` **\`in\`** or **\`out\`**, default **\`out\`**); all other paths return general reference relationships (\`direction\` default **\`out\`**). For ordinary file/assets with \`direction: in\`, results union Component \`DEPENDS_ON\` chains, direct incoming \`DEPENDS_ON\` (e.g. Scene\u2192Model), and for **Model** files also \`INSTANCE_OF\`, \`RENDERS_MESH\`, and \`PREFAB_INSTANCE_GUID\` edges. Optional \`target_type\` narrows the returned side only: \`direction: in\` filters referencing sources, \`direction: out\` filters referenced targets. Allowed \`target_type\` values: ${Be}. Omit \`target_type\` or use \`ALL\` for unfiltered results. For Scene, Prefab, and GameObject paths, reference queries inspect Component leaves under that scope. Text output groups file-internal results only by Unity file (\`.unity\`, \`.prefab\`, \`.cs\`, \`.asset\`); each \`- /...\` row below the file header is a complete concrete returned path, not an additional shared-prefix tree.`,
      parameterSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description:
              "Target VFS path. Suffix selects query behavior: `.cs` file \u2192 Unity Component -> ScriptClass bindings; ",
          },
          direction: {
            type: "string",
            enum: ["in", "out"],
            description:
              "Direction for reference/call queries (`in` or `out`; default `out`). Ignored for `.cs` script paths, which always return incoming bindings.",
          },
          target_type: {
            type: "string",
            enum: Kt(),
            description: `Optional returned-side type filter. \`ALL\` or omission disables type filtering. Allowed values: ${Be}.`,
          },
        },
        required: ["path"],
        additionalProperties: !1,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
      defaultEnabled: !0,
    },
  ],
  oS = au.map((t) => t.name);
var he = class extends Error {
  constructor(n, r, i = "Unity Insight local execution failed.") {
    super(r);
    this.code = n;
    this.summary = i;
    this.name = "LocalUnityInsightToolError";
  }
  code;
  summary;
};
var Oh = is(Fi(), 1);
function qi(t) {
  let e = t.replace(/\\/g, "/").trim();
  return e.length > 1 && e.endsWith("/") ? e.replace(/\/+$/, "") : e;
}
function Bi(t) {
  return t.length > 0 ? t.split(/\r?\n/) : [];
}
function Gi(t) {
  let e = Ot({ entryRole: t.entryRole, entryType: t.entryType, labels: t.labels });
  return Zn(t.path, e);
}
function Vh(t) {
  return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function $h(t, e) {
  if (t[e] !== "[") return null;
  let n = t.indexOf("]", e + 1);
  if (n <= e + 1) return null;
  let i = t.slice(e + 1, n);
  return (i[0] === "!" && (i = `^${i.slice(1)}`), (i = i.replace(/\\/g, "\\\\")), { regex: `[${i}]`, nextIndex: n });
}
function Ki(t, e = !0) {
  let n = t.trim(),
    r = "";
  for (let i = 0; i < n.length; i += 1) {
    let s = n[i];
    if (s === "*") {
      n[i + 1] === "*"
        ? n[i + 2] === "/"
          ? ((r += "(?:[^/]+/)*"), (i += 2))
          : ((r += ".*"), (i += 1))
        : (r += "[^/]*");
      continue;
    }
    if (s === "?") {
      r += ".";
      continue;
    }
    if (s === "[") {
      let o = $h(n, i);
      if (o) {
        ((r += o.regex), (i = o.nextIndex));
        continue;
      }
    }
    r += Vh(s);
  }
  return new RegExp(`^${r}$`, e ? "i" : "");
}
function Wi(t, e = !0) {
  let n = t.trim().replace(/:\*\*\//g, ":/**/");
  return e ? n.toLowerCase() : n;
}
function jh(t) {
  return t.includes(":/") ? t.replace(":/", "/") : t;
}
function pc(t) {
  let e = new Set();
  for (let n of t) n && (e.add(n), e.add(jh(n)));
  return [...e];
}
import { existsSync as ky } from "node:fs";
import Ry from "node:path";
import { createHash as py } from "node:crypto";
import { readFile as hy } from "node:fs/promises";
import { readdir as oy, readFile as ay, realpath as cy } from "node:fs/promises";
import ve from "node:path";
import { availableParallelism as yc } from "node:os";
var Fh = 8,
  qh = 32,
  Bh = 4;
function gc(t, e) {
  if (!t) return e;
  let n = Number.parseInt(t, 10);
  return Number.isFinite(n) && n > 0 ? n : e;
}
function Gh(t = process.env, e = yc()) {
  let n = Math.max(1, Math.floor(e)),
    r = n <= 4 ? n - 1 : Math.floor(n * 0.75),
    i = Math.max(1, Math.min(Fh, r)),
    s = gc(t.UNITY_INSIGHT_INDEX_CPU_BUDGET, i);
  return Math.min(s, n);
}
function mc(t = process.env, e = yc()) {
  let n = Math.min(qh, Math.max(Bh, Gh(t, e) * 4));
  return gc(t.UNITY_INSIGHT_DISCOVERY_FILE_CONCURRENCY, n);
}
function Sc(t) {
  return t === "Packages/manifest.json"
    ? "package-manifest"
    : t === "Packages/packages-lock.json" || Kh(t)
      ? (nr(t)?.fileKind ?? null)
      : t.startsWith("ProjectSettings/")
        ? "project-settings"
        : t.startsWith("Assets/")
          ? (nr(t)?.fileKind ?? null)
          : null;
}
function Kh(t) {
  let e = t.split("/");
  return e.length >= 3 && e[0] === "Packages";
}
import { stat as Wh } from "node:fs/promises";
async function Kn(t) {
  try {
    return await Wh(t);
  } catch {
    return null;
  }
}
async function Me(t) {
  return (await Kn(t))?.isDirectory() ?? !1;
}
function _c(t) {
  let e = t.match(/^guid:\s*(.+)\s*$/m),
    n = t.match(/^([A-Za-z0-9_]+Importer):\s*$/m),
    r = t.match(/^ {2}mainObjectFileID:\s*(\d+)\s*$/m);
  return {
    guid: e?.[1] ?? null,
    importerType: n?.[1] ?? null,
    mainObjectFileId: r ? Number(r[1]) : null,
    fileIdToName: Qh(t),
  };
}
function Qh(t) {
  let e = new Map(),
    n = t
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
    r = null,
    i = !1;
  for (let s of n) {
    if (s === "  fileIDToRecycleName:") {
      ((r = "fileIDToRecycleName"), (i = !1));
      continue;
    }
    if (s === "  internalIDToNameTable:") {
      ((r = "internalIDToNameTable"), (i = !1));
      continue;
    }
    if (r === "fileIDToRecycleName") {
      if (/^ {2}[A-Za-z0-9_]/.test(s) && !s.startsWith("    ")) {
        r = null;
        continue;
      }
      let o = s.match(/^ {4}(-?\d+):\s*(.+)$/);
      o && e.set(o[1], o[2].trim());
      continue;
    }
    if (r === "internalIDToNameTable") {
      if (/^ {2}[A-Za-z0-9_]/.test(s) && !s.startsWith("    ")) {
        ((r = null), (i = !1));
        continue;
      }
      if (s === "  - first:") {
        i = !0;
        continue;
      }
      if (s === "  second:") {
        i = !1;
        continue;
      }
      if (i) {
        let o = s.match(/^ {6}(-?\d+):\s*(.+)$/);
        o && e.set(o[1], o[2].trim());
      }
    }
  }
  return e;
}
import { fileURLToPath as Hh } from "node:url";
import { readdir as bc, readFile as Yh, realpath as zh } from "node:fs/promises";
import W from "node:path";
var Jh = { embedded: 0, "local-file": 1, "package-cache": 2 };
async function Ec(t) {
  let e = W.resolve(t),
    n = [],
    r = await Xh(e, n),
    i = await Zh(e, n),
    s = [...(await ey(e, n)), ...(await ty(e, r, n)), ...(await ry(e, r, i, n))];
  s.sort((c, l) => (c.priority !== l.priority ? c.priority - l.priority : c.packageName.localeCompare(l.packageName)));
  let o = new Map(),
    a = new Map();
  for (let c of s) {
    let l = o.get(c.packageName);
    if (l) {
      n.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: c.virtualRoot,
        message: `Skipped duplicate package source for ${c.packageName}; using ${l.sourceKind} source at ${l.physicalRoot}.`,
      });
      continue;
    }
    let p = a.get(c.realRoot);
    if (p) {
      n.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: c.diagnosticPath,
        message: `Skipped package source ${c.packageName}; ${p.packageName} already uses the same real directory.`,
      });
      continue;
    }
    (o.set(c.packageName, c), a.set(c.realRoot, c));
  }
  return {
    sources: [...o.values()]
      .sort((c, l) => c.virtualRoot.localeCompare(l.virtualRoot))
      .map(({ priority: c, diagnosticPath: l, ...p }) => p),
    diagnostics: n,
  };
}
async function Xh(t, e) {
  let n = W.join(t, "Packages", "manifest.json"),
    r = await Ji(n, e, { filePath: "Packages/manifest.json", missingIsDiagnostic: !1 }),
    i = new Map(),
    s = r && tt(r) && tt(r.dependencies) ? r.dependencies : {};
  for (let [o, a] of Object.entries(s)) typeof a == "string" && i.set(o, a);
  return i;
}
async function Zh(t, e) {
  let n = W.join(t, "Packages", "packages-lock.json"),
    r = await Ji(n, e, { filePath: "Packages/packages-lock.json", missingIsDiagnostic: !1 }),
    i = new Map(),
    s = r && tt(r) && tt(r.dependencies) ? r.dependencies : {};
  for (let [o, a] of Object.entries(s)) {
    if (!tt(a)) continue;
    let c = a.version,
      l = a.source;
    i.set(o, { version: typeof c == "string" ? c : void 0, source: typeof l == "string" ? l : void 0 });
  }
  return i;
}
async function ey(t, e) {
  let n = W.join(t, "Packages"),
    r = await bc(n, { withFileTypes: !0 }).catch(() => []);
  return (
    await Promise.all(
      r.map(async (s) => {
        if (s.name === "manifest.json" || s.name === "packages-lock.json") return null;
        let o = W.join(n, s.name);
        if (!(await Me(o))) return null;
        let c =
          (await zi(o, e, `Packages/${s.name}/package.json`, { fallbackName: s.name, diagnosticOnFallback: !1 })) ??
          (sy(s.name) ? s.name : null);
        return c
          ? Yi({ packageName: c, physicalRoot: o, sourceKind: "embedded", diagnosticPath: `Packages/${c}` })
          : null;
      }),
    )
  ).filter((s) => s !== null);
}
async function ty(t, e, n) {
  let r = [];
  for (let [i, s] of e) {
    if (!Hi(s)) continue;
    let o = iy(t, s);
    if (!(await Me(o))) {
      n.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: "Packages/manifest.json",
        message: `Skipped local package ${i}; package root does not exist: ${o}.`,
      });
      continue;
    }
    let a = (await zi(o, n, "Packages/manifest.json", { fallbackName: i, diagnosticOnFallback: !0 })) ?? i;
    r.push(
      await Yi({ packageName: a, physicalRoot: o, sourceKind: "local-file", diagnosticPath: "Packages/manifest.json" }),
    );
  }
  return r;
}
var ny = new Set(["registry", "builtin"]);
async function ry(t, e, n, r) {
  let i = [],
    s = W.join(t, "Library", "PackageCache"),
    o = new Set(e.keys()),
    a = new Set(n.keys());
  for (let [c, l] of n) {
    if (!l.version || (l.source !== void 0 && !ny.has(l.source)) || Hi(e.get(c) ?? "")) continue;
    let p = W.join(s, `${c}@${l.version}`);
    if (await Me(p)) {
      i.push(await Qi(c, p, r, "Packages/packages-lock.json"));
      continue;
    }
    if (
      (r.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: "Packages/packages-lock.json",
        message: `Package cache directory is missing for ${c}@${l.version}.`,
      }),
      o.has(c))
    ) {
      let u = await Ic(s, c, r);
      u && i.push(await Qi(c, u, r, "Packages/packages-lock.json"));
    }
  }
  for (let c of o) {
    if (n.size > 0 || a.has(c) || Hi(e.get(c) ?? "")) continue;
    let l = await Ic(s, c, r);
    l && i.push(await Qi(c, l, r, "Packages/manifest.json"));
  }
  return i;
}
async function Qi(t, e, n, r) {
  let i = (await zi(e, n, r, { fallbackName: t, diagnosticOnFallback: !1 })) ?? t;
  return Yi({ packageName: i, physicalRoot: e, sourceKind: "package-cache", diagnosticPath: r });
}
async function Ic(t, e, n) {
  let r = await bc(t, { withFileTypes: !0 }).catch(() => []),
    i = (
      await Promise.all(
        r.map(async (s) => {
          let o = W.join(t, s.name);
          return !s.name.startsWith(`${e}@`) || !(await Me(o)) ? null : o;
        }),
      )
    )
      .filter((s) => s !== null)
      .sort();
  return (
    i.length > 1 &&
      n.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: "Packages/manifest.json",
        message: `Multiple package cache directories match ${e}; using ${W.basename(i.at(-1) ?? i[0] ?? "")}.`,
      }),
    i.at(-1) ?? null
  );
}
async function Yi(t) {
  let e = W.resolve(t.physicalRoot),
    n = await zh(e);
  return {
    packageName: t.packageName,
    physicalRoot: e,
    realRoot: n,
    virtualRoot: `Packages/${t.packageName}`,
    sourceKind: t.sourceKind,
    priority: Jh[t.sourceKind],
    diagnosticPath: t.diagnosticPath,
  };
}
async function zi(t, e, n, r) {
  let i = W.join(t, "package.json"),
    s = await Ji(i, e, { filePath: n, missingIsDiagnostic: r.diagnosticOnFallback }),
    o = s && tt(s) && typeof s.name == "string" ? s.name : null;
  return (
    !o &&
      r.diagnosticOnFallback &&
      e.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: n,
        message: `Package ${r.fallbackName} has no readable package.json name; using the manifest dependency name.`,
      }),
    o
  );
}
async function Ji(t, e, n) {
  try {
    return JSON.parse(await Yh(t, "utf8"));
  } catch (r) {
    return r instanceof Error && "code" in r && r.code === "ENOENT"
      ? (n.missingIsDiagnostic &&
          e.push({
            severity: "warning",
            category: "discovery",
            stage: "discovery",
            filePath: n.filePath,
            message: `Missing package metadata file: ${t}.`,
          }),
        null)
      : (e.push({
          severity: "warning",
          category: "discovery",
          stage: "discovery",
          filePath: n.filePath,
          message: `Could not parse JSON file ${t}: ${String(r)}.`,
        }),
        null);
  }
}
function Hi(t) {
  return t.startsWith("file:");
}
function iy(t, e) {
  if (e.startsWith("file://"))
    try {
      return Hh(e);
    } catch {
      return W.resolve(W.join(t, "Packages"), e.slice(7));
    }
  return W.resolve(W.join(t, "Packages"), e.slice(5));
}
function sy(t) {
  return /^[a-z0-9]+(?:[.-][a-z0-9]+)+$/i.test(t);
}
function tt(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
async function ly(t, e, n) {
  let r = new Array(t.length),
    i = 0,
    s = Math.min(e, t.length);
  async function o() {
    for (;;) {
      let a = i;
      if (((i += 1), a >= t.length)) return;
      r[a] = await n(t[a], a);
    }
  }
  return (await Promise.all(Array.from({ length: s }, () => o())), r);
}
async function Pc(t, e = {}) {
  let n = ve.resolve(t),
    r = [],
    s = (e.includePackages ?? !0) ? await Ec(n) : { sources: [], diagnostics: [] };
  r.push(...s.diagnostics);
  let o = [
      ...(await Xi({ physicalRoot: ve.join(n, "Assets"), virtualRoot: "Assets", diagnostics: r })),
      ...(await Xi({ physicalRoot: ve.join(n, "ProjectSettings"), virtualRoot: "ProjectSettings", diagnostics: r })),
      ...(await uy(n)),
      ...(
        await Promise.all(
          s.sources.map((c) => Xi({ physicalRoot: c.physicalRoot, virtualRoot: c.virtualRoot, diagnostics: r })),
        )
      ).flat(),
    ],
    a = await ly(o, mc(), async ({ absolutePath: c, projectRelPath: l, sizeBytes: p, mtimeMs: u }) => {
      let d = Sc(l);
      if (!d) return null;
      let y = { projectRelPath: l, absolutePath: c, kind: d, sizeBytes: p, mtimeMs: u };
      if (d !== "meta") return y;
      let m = _c(await ay(c, "utf8"));
      return {
        ...y,
        guid: m.guid ?? void 0,
        importerType: m.importerType ?? void 0,
        metaMainObjectFileId: m.mainObjectFileId ?? void 0,
      };
    });
  return {
    projectPath: n,
    diagnostics: r,
    files: a.filter((c) => c !== null).sort((c, l) => c.projectRelPath.localeCompare(l.projectRelPath)),
  };
}
async function uy(t) {
  let e = [
    { absolutePath: ve.join(t, "Packages", "manifest.json"), projectRelPath: "Packages/manifest.json" },
    { absolutePath: ve.join(t, "Packages", "packages-lock.json"), projectRelPath: "Packages/packages-lock.json" },
  ];
  return (
    await Promise.all(
      e.map(async (r) => {
        let i = await Kn(r.absolutePath);
        return i?.isFile() ? { ...r, sizeBytes: i.size, mtimeMs: Math.trunc(i.mtimeMs) } : null;
      }),
    )
  ).filter((r) => r !== null);
}
async function Xi(t) {
  return (await Me(t.physicalRoot)) ? wc(t.physicalRoot, t.physicalRoot, t.virtualRoot, t.diagnostics, new Set()) : [];
}
async function wc(t, e, n, r, i) {
  let s;
  try {
    s = await cy(e);
  } catch (c) {
    return (
      r.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: n,
        message: `Skipped unreadable directory ${e}: ${String(c)}.`,
      }),
      []
    );
  }
  if (i.has(s))
    return (
      r.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: n,
        message: `Skipped package symlink loop at ${e}.`,
      }),
      []
    );
  i.add(s);
  let o = await oy(e, { withFileTypes: !0 }).catch(
    (c) => (
      r.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: n,
        message: `Skipped unreadable directory ${e}: ${String(c)}.`,
      }),
      []
    ),
  );
  return (
    await Promise.all(
      o.map(async (c) => {
        let l = ve.join(e, c.name),
          p = await Kn(l);
        if (!p) return [];
        if (c.name.endsWith("~") && p.isDirectory()) return [];
        if (p.isDirectory()) return wc(t, l, n, r, i);
        if (!p.isFile()) return [];
        let u = fy(ve.relative(t, l));
        return u.startsWith("../") || u === ".."
          ? (r.push({
              severity: "warning",
              category: "discovery",
              stage: "discovery",
              filePath: n,
              message: `Skipped file outside discovery root: ${l}.`,
            }),
            [])
          : [{ absolutePath: l, projectRelPath: `${n}/${u}`, sizeBytes: p.size, mtimeMs: Math.trunc(p.mtimeMs) }];
      }),
    )
  ).flat();
}
function fy(t) {
  return t.split(ve.sep).join("/");
}
function dy(t) {
  return t.replace(/\\/g, "/");
}
function vc(t, e) {
  let n = dy(t);
  return !n.startsWith("Assets/") || n.endsWith(".meta") ? !0 : e.has(`${n}.meta`);
}
function yy(t, e) {
  return t.absolutePath === e.absolutePath && t.mtimeMs === e.mtimeMs && t.sizeBytes === e.sizeBytes;
}
async function gy(t) {
  let e = await hy(t);
  return py("sha256").update(e).digest("hex");
}
function my(t) {
  return t
    .prepare(
      `SELECT id, project_rel_path, abs_path, content_hash, mtime_ms, size_bytes
       FROM files
       ORDER BY id`,
    )
    .all()
    .map((e) => {
      let n = e;
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
async function Tc(t, e, n = {}) {
  let r = await Pc(t, { includePackages: n.includePackages }),
    i = my(e),
    s = new Map(i.map((y) => [y.projectRelPath, y])),
    o = new Map(r.files.map((y) => [y.projectRelPath, y])),
    a = new Set(r.files.map((y) => y.projectRelPath)),
    c = [],
    l = [],
    p = [],
    u = [];
  for (let y of r.files) {
    let m = s.get(y.projectRelPath);
    if (!m && !vc(y.projectRelPath, a)) continue;
    if (!m) {
      c.push(y);
      continue;
    }
    if (yy(y, m)) {
      p.push(y.projectRelPath);
      continue;
    }
    if ((await gy(y.absolutePath)) !== m.contentHash) {
      l.push({ discovered: y, fileId: m.id });
      continue;
    }
    (p.push(y.projectRelPath),
      u.push({
        fileId: m.id,
        projectRelPath: y.projectRelPath,
        absolutePath: y.absolutePath,
        mtimeMs: y.mtimeMs,
        sizeBytes: y.sizeBytes,
      }));
  }
  let d = i.filter((y) => !o.has(y.projectRelPath)).map((y) => ({ projectRelPath: y.projectRelPath, fileId: y.id }));
  return { created: c, modified: l, deleted: d, unchanged: p, metadataStale: u };
}
function kc(t, e = 50) {
  return {
    createdCount: t.created.length,
    modifiedCount: t.modified.length,
    deletedCount: t.deleted.length,
    movedCount: t.moved?.length ?? 0,
    unchangedCount: t.unchanged.length,
    createdPaths: t.created.map((n) => n.projectRelPath).slice(0, e),
    modifiedPaths: t.modified.map((n) => n.discovered.projectRelPath).slice(0, e),
    deletedPaths: t.deleted.map((n) => n.projectRelPath).slice(0, e),
    movedPaths: (t.moved ?? []).map((n) => `${n.oldProjectRelPath} -> ${n.discovered.projectRelPath}`).slice(0, e),
  };
}
var Sy = { bootstrap: 2, discovery: 3, extract: 38, resolve: 22, materialize: 28, finalize: 4, publish: 3 },
  _y = ["bootstrap", "discovery", "extract", "resolve", "materialize", "finalize", "publish"],
  RI = _y.reduce((t, e) => t + (Sy[e] ?? 0), 0);
import { execFile as Iy } from "node:child_process";
import { realpathSync as by } from "node:fs";
import Wn from "node:path";
import { DatabaseSync as MI } from "node:sqlite";
import { promisify as Ey } from "node:util";
var Py = 16,
  jI = Math.floor(Py / 2) + 1;
var FI = Ey(Iy);
var qI = [
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
function wy(t) {
  try {
    return by.native(t);
  } catch {
    return;
  }
}
function Rc(t) {
  let e = Wn.resolve(t),
    n = [],
    r = e;
  for (;;) {
    let i = wy(r);
    if (i !== void 0) return Wn.join(i, ...n);
    let s = Wn.dirname(r);
    if (s === r) return e;
    (n.unshift(Wn.basename(r)), (r = s));
  }
}
var vy = new Map();
function Ty(t) {
  return Rc(t);
}
function Zi(t) {
  return vy.get(Ty(t)) ?? null;
}
function xc(t) {
  let e = Zi(t.projectPath);
  return {
    ...t,
    progressPercent: e?.percent ?? null,
    progressPhase: e?.phase ?? null,
    progressDetail: e?.detail ?? null,
  };
}
async function Cc(t, e = {}) {
  let n = e.resolveIndexPaths ?? rt,
    r = e.openDatabase ?? Fe,
    i = Ry.resolve(t.projectPath),
    s = t.pendingPathLimit ?? 50;
  await ds(i);
  let o = n(i),
    a = Zi(i),
    c = ky(o.tempDbPath) || a != null,
    l = ps(o),
    p;
  try {
    p = qt(o, { openDatabase: r });
  } catch (y) {
    if (!(y instanceof ce)) throw y;
    return xc({
      projectPath: i,
      indexReady: !1,
      indexBuilding: c,
      writer: l,
      publishedIndexPath: o.liveDbPath,
      schemaVersion: null,
      indexedAt: null,
      lastMode: null,
      discoveredFileCount: null,
      diagnosticCount: null,
      reconcile: null,
      pendingSyncPaths: [],
      watcherPendingPaths: [],
      watcherIndexing: !1,
      pendingEntries: [],
    });
  }
  let { indexPath: u, database: d } = p;
  try {
    let y = d.prepare("SELECT schema_version, indexed_at FROM projects WHERE id = 1").get(),
      m = d
        .prepare(
          `SELECT mode, discovered_file_count, diagnostic_count
               FROM rebuild_summary
               WHERE project_id = 1`,
        )
        .get(),
      h = await Tc(i, d),
      g = kc(h, s),
      E = [...g.createdPaths, ...g.modifiedPaths].slice(0, s);
    return xc({
      projectPath: i,
      indexReady: !0,
      indexBuilding: c,
      writer: l,
      publishedIndexPath: u,
      schemaVersion: y?.schema_version ?? null,
      indexedAt: y?.indexed_at ?? null,
      lastMode: m?.mode ?? null,
      discoveredFileCount: m?.discovered_file_count ?? null,
      diagnosticCount: m?.diagnostic_count ?? null,
      reconcile: g,
      pendingSyncPaths: E,
      watcherPendingPaths: [],
      watcherIndexing: !1,
      pendingEntries: [],
    });
  } finally {
    d.close();
  }
}
var xy = {
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
  Cy = {
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
  Ay = {
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
  Ny = {
    "0000000000000000f000000000000000": "extra",
    "0000000000000000e000000000000000": "default",
    "0000000000000000d000000000000000": "editor",
  },
  Uy = { extra: xy, default: Cy, editor: Ay };
function Ac(t, e) {
  let n = Ny[t.toLowerCase()];
  if (!n) return;
  let r = Uy[n][e] ?? e;
  return `unity://builtin/${n}/${r}`;
}
var Ly = "[0-9A-Za-z+/_=-]+",
  X = "[+-]?0(?:\\.0+)?",
  ob = new RegExp(`^${X}$`),
  ab = new RegExp(`^\\{\\s*x:\\s*${X}\\s*,\\s*y:\\s*${X}\\s*,\\s*z:\\s*${X}\\s*\\}$`),
  cb = new RegExp(`^\\{\\s*x:\\s*${X}\\s*,\\s*y:\\s*${X}\\s*\\}$`),
  lb = new RegExp(`^\\{\\s*r:\\s*${X}\\s*,\\s*g:\\s*${X}\\s*,\\s*b:\\s*${X}(?:\\s*,\\s*a:\\s*[^}]+)?\\s*\\}$`),
  ub = new RegExp(`^\\{\\s*r:\\s*${X}\\s*,\\s*g:\\s*${X}\\s*\\}$`),
  fb = new RegExp(`^\\{\\s*fileID:\\s*${X}\\s*\\}$`);
var Dy = new RegExp(`\\{\\s*fileID:\\s*(-?\\d+)\\s*,\\s*guid:\\s*(${Ly})\\s*,\\s*type:\\s*\\d+\\s*\\}`, "g"),
  My =
    /\{\s*guid:\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*fileID:\s*(-?\d+))?(?:\s*,\s*script:\s*"(?:[^"\\]|\\.)*")?(?:\s*,\s*qualifiedScript:\s*"(?:[^"\\]|\\.)*")?\s*\}/g;
var db = "0".repeat(32);
var Oy = new Map([
  ["f5f67c52d1564df4a8936ccd202a3bd8", "Packages/com.unity.ugui/UnityEngine.UI.dll"],
  ["f70555f144d8491a825f0804e09c671c", "Packages/com.unity.ugui/Standalone/UnityEngine.UI.dll"],
  ["80a3616ca19596e4da0f10f14d241e9f", "Packages/com.unity.ugui/Editor/UnityEditor.UI.dll"],
]);
function Nc(t) {
  return t.startsWith("0000000000000000");
}
function Vy(t) {
  return Oy.get(t.toLowerCase());
}
function Qn(t) {
  return t ? t.replace(/\\/g, "\\\\").replace(/"/g, '\\"') : "";
}
function Uc(t) {
  return $y(t).text;
}
function $y(t) {
  if (!t || !t.trim()) return { text: "", rewrittenCount: 0 };
  if (!t.includes("guid:")) return { text: t, rewrittenCount: 0 };
  let e = 0;
  return {
    text: t.replace(Dy, (r, i, s) => {
      e += 1;
      let o = Qn(s);
      return Nc(s) ? `{guid: "${o}", fileID: ${i}}` : `{guid: "${o}"}`;
    }),
    rewrittenCount: e,
  };
}
function Lc(t, e) {
  return !t || !t.trim()
    ? ""
    : t.includes("{guid:")
      ? t.replace(My, (n, r, i) => {
          let s = jy(r),
            o = Vy(s);
          if (o) return `{path: "${Qn(o)}"}`;
          if (Nc(s)) {
            if (i !== void 0) {
              let c = Ac(s, i);
              if (c) return `{path: "${Qn(c)}"}`;
            }
            return '{path: "unity://builtin", status: "builtin"}';
          }
          let a = e.get(s);
          return a === void 0 ? '{path: "", status: "missing"}' : `{path: "${Qn(a)}"}`;
        })
      : t;
}
function jy(t) {
  return t.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}
var Fy = /^[0-9a-fA-F]{32}$/;
function Dc(t) {
  if (t.length < 16) return null;
  let e = (n) => n.toString(16).padStart(2, "0");
  return (
    e(t[3]) +
    e(t[2]) +
    e(t[1]) +
    e(t[0]) +
    e(t[5]) +
    e(t[4]) +
    e(t[7]) +
    e(t[6]) +
    e(t[8]) +
    e(t[9]) +
    e(t[10]) +
    e(t[11]) +
    e(t[13]) +
    e(t[12]) +
    e(t[15]) +
    e(t[14])
  ).toLowerCase();
}
function qy(t) {
  if (!Mc(t)) return null;
  let n = t.toLowerCase().match(/.{2}/g);
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
function Mc(t) {
  return Fy.test(t);
}
function Oc(t) {
  let e = t.trim();
  if (!e) return [];
  let n = new Set([e]);
  if (Mc(e)) {
    let r = e.toLowerCase();
    n.add(r);
    let i = qy(r);
    i && n.add(i);
    let s = Dc(Buffer.from(r, "hex"));
    return (s && n.add(s), [...n]);
  }
  for (let r of By(e)) {
    let i = Dc(r);
    i && n.add(i);
  }
  return [...n];
}
function By(t) {
  let e = [],
    n = t.includes("/") ? t.split("/") : [t];
  for (let r of n) {
    let i = r.trim();
    if (i) {
      try {
        e.push(Buffer.from(i, "base64"));
      } catch {}
      try {
        e.push(Buffer.from(i, "base64url"));
      } catch {}
    }
  }
  try {
    e.push(Buffer.from(t.trim(), "base64"));
  } catch {}
  return e;
}
function Vc(t, e) {
  return !t || !t.includes("{guid:") ? t : Lc(t, e);
}
function $c(t) {
  let e = new Map();
  return (
    t.forEach((n) => {
      if (n.kind !== "meta" && n.guid) for (let r of Oc(n.guid)) e.set(r, n.projectRelPath);
    }),
    e
  );
}
import Gy from "node:path";
function es(t) {
  return (t ?? "").trim().toLowerCase();
}
function Ky(t) {
  if (t.entryType === "directory") return "directory";
  if (t.entryType === "link") return "leaf";
  switch (es(t.entryKind)) {
    case "class":
    case "enum":
    case "interface":
    case "struct":
    case "namespace":
    case "gameobject":
    case "texture":
    case "sprite":
      return t.entryType === "node" ? "container" : void 0;
    default:
      return t.entryType === "node" ? "leaf" : void 0;
  }
}
function jc(t, e) {
  switch (es(t)) {
    case "directory":
      return ["Directory"];
    case "script":
      return ["Script"];
    case "scene":
      return ["Scene", "Asset"];
    case "prefab":
      return ["Prefab", "Asset"];
    case "prefab_variant":
      return ["PrefabVariant", "Prefab", "Asset"];
    case "prefab_overrides":
      return ["PrefabOverrides"];
    case "class":
    case "struct":
    case "interface":
    case "enum":
      return ["Class"];
    case "method":
      return ["Method"];
    case "property":
      return ["Property"];
    case "gameobject":
      return ["GameObject"];
    case "component":
      return ["Component"];
    case "scene_settings":
      return ["SceneSettings"];
    case "scriptable_object":
      return ["ScriptableObject", "Asset"];
    case "scene_template":
    case "scene_template_details":
    case "scene_template_thumbnail":
    case "scene_template_pipeline":
    case "scene_template_dependencies":
      return ["SceneTemplate", "Asset"];
    case "subasset":
      return ["ScriptableObjectSubAsset"];
    case "texture":
      return ["Texture", "Asset"];
    case "sprite":
      return ["Sprite"];
    case "mesh":
      return ["Mesh"];
    case "model":
      return ["Model", "Asset"];
    case "material":
      return ["Material", "Asset"];
    case "animation_clip":
      return ["AnimationClip", "Asset"];
    case "animator_controller":
      return ["AnimatorController", "Asset"];
    case "audio_clip":
      return ["AudioClip", "Asset"];
    case "audio_mix":
    case "audio_mixer":
      return ["AudioMixer", "Asset"];
    case "audio_mixer_group":
      return ["AudioMixerGroup"];
    case "physic_material":
      return ["PhysicMaterial", "Asset"];
    case "physic_material_2d":
      return ["PhysicMaterial2D", "Asset"];
    case "shader_graph":
      return ["ShaderGraph", "Asset"];
    case "shader_graph_properties":
      return ["ShaderGraphProperties"];
    case "shader_graph_settings":
      return ["ShaderGraphSettings"];
    case "shader_graph_node":
      return ["ShaderGraphNode"];
    case "visual_effect_graph":
      return ["VisualEffectGraph", "Asset"];
    case "visual_effect_graph_properties":
    case "visual_effect_graph_property":
      return ["Properties"];
    case "visual_effect_graph_context":
      return ["VFXContext"];
    case "visual_effect_graph_block":
      return ["VFXBlock"];
    case "shader_lab":
      return ["ShaderLab", "Asset"];
    case "uxml":
      return ["UXML", "Asset"];
    case "uss":
      return ["USS", "Asset"];
    case "file_content":
      return ["FileContent"];
    case "json_file":
    case "text_asset":
      return ["JSONFile", "Asset"];
    case "font":
      return ["Font", "Asset"];
    case "video_clip":
      return ["VideoClip", "Asset"];
    case "physics_material":
      return ["PhysicsMaterial", "Asset"];
    case "source_prefab_link":
      return ["VfsLink"];
    default:
      return e === "directory" ? ["Directory"] : e === "link" ? ["VfsLink"] : e === "file" ? ["Asset"] : [];
  }
}
function Wy(t) {
  if (t.sourceFilePath?.trim()) return t.sourceFilePath;
  let [e] = t.vfsPath.split(":/", 1);
  return e ?? t.vfsPath;
}
function nt(t, e) {
  let n = es(t.entryKind),
    r = jc(t.entryKind, t.entryType);
  return (
    t.projectionKind === "prefab_inherited" && r.push("VfsProjection"),
    {
      path: t.vfsPath,
      entryType: t.entryType,
      entryRole: Ky(t),
      sourcePath: Wy(t),
      content: e?.content ?? "",
      metaContent: e?.metaContent ?? "",
      linkKind: t.entryType === "link" ? n : "",
      targetVfsPath: t.targetVfsPath ?? "",
      name: t.displayName,
      lineStart: t.lineStart ?? 0,
      lineEnd: t.lineEnd ?? 0,
      labels: r,
      typeKind: n === "enum" ? "enum" : "",
      guid: "",
      importer: "",
      metaPath: "",
      revision: 1,
      size: t.sizeBytes ?? 0,
      signature: "",
      projectionKind: t.projectionKind,
      sourceVfsPath: t.sourceVfsPath,
      sourceOwnerVfsPath: t.sourceOwnerVfsPath,
      instanceRootVfsPath: t.instanceRootVfsPath,
    }
  );
}
function ts(t, e, n) {
  let r = jc(t, e);
  if (r.length > 0) return r[0] ?? "Entry";
  if (e === "directory") return "Directory";
  if (e === "link") return "VfsLink";
  if (e === "file") {
    let i = Gy.posix.extname(n).toLowerCase();
    return i === ".cs" ? "Script" : i === ".unity" ? "Scene" : i === ".prefab" ? "Prefab" : "Asset";
  }
  return "Entry";
}
async function Fc(t, e, n) {
  let r = n.includes("guid:") ? Uc(n) : n;
  if (!r.includes("{guid:")) return r;
  let i = await t.queryGuidToProjectRelPath({ projectPath: e });
  return Vc(r, i);
}
function Hy(t) {
  return t.projectionKind === "prefab_inherited" && (t.sourceVfsPath ?? "").trim().length > 0;
}
async function Yy(t, e, n) {
  let r = n,
    i = new Set();
  for (; Hy(r);) {
    let s = qi(r.sourceVfsPath ?? "");
    if (!s) break;
    if (i.has(s))
      throw new he(
        "INVALID_GRAPH_STATE",
        `Projection source resolution cycle detected for '${n.path}'.`,
        "Projection source resolution failed.",
      );
    i.add(s);
    let o = await t.queryVfsEntryContent({ projectPath: e, path: s });
    if (!o) throw new he("ENTRY_NOT_FOUND", `No VFS entry found for projection source '${s}'.`, "VFS entry not found.");
    r = nt(o.entry, { content: o.content });
  }
  return { requestedEntry: n, semanticEntry: r };
}
async function qc(t, e, n, r) {
  let i = n;
  try {
    i = (await Yy(t, e, n)).semanticEntry;
  } catch (s) {
    if (!(r?.softProjectionFallback ?? !0)) throw s;
  }
  return Fc(t, e, i.content);
}
async function Bc(t, e, n) {
  return Fc(t, e, n);
}
var Gc = ["calls", "binds_to", "depends_on", "instance_of", "refs"];
function Kc(t, e) {
  return zy(t, e);
}
function zy(t, e) {
  let n = Jy(e.edgeKinds),
    r = n.map(() => "?").join(", "),
    i =
      e.direction === "in"
        ? `SELECT edge.from_entry_id,
                requested_target.entry_id AS to_entry_id,
                edge.edge_kind,
                edge.edge_subkind
         FROM vfs_edges edge
         JOIN scope requested_target
           ON requested_target.depth = 0
         WHERE edge.edge_kind IN (${r})
           AND edge.to_entry_id IN (SELECT entry_id FROM deduped_scope)`
        : `SELECT edge.from_entry_id,
                edge.to_entry_id,
                edge.edge_kind,
                edge.edge_subkind
         FROM vfs_edges edge
         WHERE edge.edge_kind IN (${r})
           AND edge.from_entry_id IN (SELECT entry_id FROM deduped_scope)`,
    s = t
      .prepare(
        `WITH RECURSIVE scope(entry_id, depth) AS (
         SELECT root.id, 0
         FROM vfs_entries root
         WHERE root.project_id = ?
           AND lower(root.vfs_path) = lower(?)
         UNION
         SELECT scoped_child.id, scope.depth + 1
         FROM scope
         CROSS JOIN vfs_edges scope_edge
           ON scope_edge.to_entry_id = scope.entry_id
          AND scope_edge.edge_kind IN ('child_of', 'defined_in')
         JOIN vfs_entries scoped_child
           ON scoped_child.id = scope_edge.from_entry_id
         WHERE scope.depth < 12
       ),
       deduped_scope AS (
         SELECT DISTINCT entry_id
         FROM scope
       ),
       requested_target(entry_id) AS (
         SELECT entry_id
         FROM scope
         WHERE depth = 0
       ),
       scoped_edges AS (
         ${i}
       )
       SELECT source_entry.vfs_path AS from_path,
              target_entry.vfs_path AS to_path,
              source_entry.entry_kind AS from_entry_kind,
              source_entry.entry_type AS from_entry_type,
              target_entry.entry_kind AS to_entry_kind,
              target_entry.entry_type AS to_entry_type,
              scoped_edges.edge_kind,
              scoped_edges.edge_subkind,
              file.project_rel_path AS source_file_path,
              source_entry.line_start,
              source_entry.line_end
       FROM scoped_edges
       JOIN vfs_entries source_entry
         ON source_entry.id = scoped_edges.from_entry_id
       JOIN vfs_entries target_entry
         ON target_entry.id = scoped_edges.to_entry_id
       LEFT JOIN files file
         ON file.id = source_entry.source_file_id
       WHERE source_entry.project_id = ?
       ORDER BY source_entry.vfs_path ASC,
                target_entry.vfs_path ASC,
                scoped_edges.edge_kind ASC,
                coalesce(scoped_edges.edge_subkind, '') ASC`,
      )
      .all(1, e.semanticPath, ...n, 1);
  return Zy(Xy(s));
}
function Jy(t) {
  if (!t || t.length === 0) return [...Gc];
  let e = t.map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? [...Gc] : [...new Set(e)];
}
function Xy(t) {
  return t.map((e) => ({
    fromPath: e.from_path,
    toPath: e.to_path,
    fromEntryKind: e.from_entry_kind,
    fromEntryType: e.from_entry_type,
    toEntryKind: e.to_entry_kind,
    toEntryType: e.to_entry_type,
    edgeKind: e.edge_kind,
    edgeSubkind: e.edge_subkind ?? void 0,
    sourceFilePath: e.source_file_path ?? void 0,
    lineStart: e.line_start ?? void 0,
    lineEnd: e.line_end ?? void 0,
  }));
}
function Zy(t) {
  let e = new Set();
  return t.filter((n) => {
    let r = [
      n.fromPath,
      n.toPath,
      n.edgeKind,
      n.edgeSubkind ?? "",
      n.sourceFilePath ?? "",
      n.lineStart ?? "",
      n.lineEnd ?? "",
    ].join("\0");
    return e.has(r) ? !1 : (e.add(r), !0);
  });
}
var Oe = is(Fi(), 1),
  Lt = "[path masked]";
function Hn(t) {
  return t
    .replace(/(\b[\w.-]*path\b\s*[:=]\s*)(["'])(.*?)\2/gi, (e, n, r) => `${n}${r}${Lt}${r}`)
    .replace(/(\b[\w.-]*path\b\s*[:=]\s*)(?!["'])(?!\s*\[path masked\])([^,\]}]+)/gi, (e, n) => `${n}${Lt}`);
}
function Yn(t) {
  return t.length > 0 ? t.split(/\r?\n/) : [];
}
function Wc(t) {
  let e = [];
  try {
    let r = (0, Oe.parseAllDocuments)(t, { merge: !0, prettyErrors: !1 });
    for (let i of r)
      (0, Oe.visit)(i, {
        Pair(s, o) {
          let a = o.key,
            c = o.value;
          if (
            !(0, Oe.isScalar)(a) ||
            !(0, Oe.isScalar)(c) ||
            !String(a.value ?? "")
              .toLowerCase()
              .includes("path")
          )
            return;
          let l = c.range;
          l && e.push({ start: l[0], end: l[1] });
        },
      });
  } catch {
    return Yn(t).map((r) => Hn(r)).join(`
`);
  }
  let n =
    e.length === 0
      ? t
      : e.sort((r, i) => i.start - r.start).reduce((r, i) => `${r.slice(0, i.start)}${Lt}${r.slice(i.end)}`, t);
  return Yn(n).map((r) => Hn(r)).join(`
`);
}
var Qc = `EXISTS (
                SELECT 1
                FROM vfs_entries child
                WHERE child.project_id = entry.project_id
                  AND child.parent_vfs_path = entry.vfs_path
              ) AS has_children`;
function Te(t) {
  let e = [
    "entry.vfs_path",
    "entry.entry_type",
    "entry.entry_kind",
    "entry.display_name",
    "entry.child_order",
    "entry.parent_vfs_path",
    "entry.target_vfs_path",
    "file.project_rel_path AS source_file_path",
    "entry.projection_kind",
    "entry.source_vfs_path",
    "entry.source_owner_vfs_path",
    "entry.instance_root_vfs_path",
    "entry.line_start",
    "entry.line_end",
    "entry.size_bytes",
  ];
  return (
    (t === "content" || t === "both") && e.push("entry.content"),
    (t === "meta" || t === "both") && e.push("entry.meta_content"),
    e.join(`,
              `)
  );
}
function Zc(t = {}) {
  let e = t.resolveIndexPaths ?? rt,
    n = t.openDatabase ?? Fe,
    r = t.persistentConnections === !0,
    i = new eg(),
    s = new Map(),
    o = new Map(),
    a = new Map(),
    c = new Map(),
    l = new Set(),
    p = new Map();
  function u(f) {
    let _ = n(f);
    return (rr(_), _);
  }
  function d(f) {
    if (f) {
      let _ = s.get(f);
      if (!_) return;
      try {
        _.database.close();
      } catch {}
      s.delete(f);
      return;
    }
    for (let _ of s.values())
      try {
        _.database.close();
      } catch {}
    s.clear();
  }
  function y(f) {
    let _ = tg(f).mtimeMs,
      S = s.get(f);
    if (S && S.mtimeMs === _) return S.database;
    if (S) {
      try {
        S.database.close();
      } catch {}
      s.delete(f);
    }
    let b = u(f);
    return (s.set(f, { database: b, mtimeMs: _ }), b);
  }
  function m(f, _) {
    let S = f.databasesByIndexPath.get(_);
    if (S) return S;
    let b = u(_);
    return (f.databasesByIndexPath.set(_, b), b);
  }
  function h(f) {
    for (let _ of f.databasesByIndexPath.values()) _.close();
    f.databasesByIndexPath.clear();
  }
  async function g(f) {
    if (!l.has(f) || (c.get(f) ?? 0) > 0) return;
    let _ = p.get(f);
    if (_) return _;
    let S = (async () => {
      d(f);
      let b = a.get(f);
      if (!b) {
        l.delete(f);
        return;
      }
      (await Ss(b, f)).length === 0 && (l.delete(f), a.delete(f));
    })().finally(() => {
      p.delete(f);
    });
    return (p.set(f, S), S);
  }
  function E(f) {
    c.set(f, (c.get(f) ?? 0) + 1);
  }
  async function w(f) {
    let _ = Math.max(0, (c.get(f) ?? 0) - 1);
    (_ === 0 ? c.delete(f) : c.set(f, _), await g(f));
  }
  function T(f, _, S) {
    a.set(S, _);
    let b = o.get(f);
    (o.set(f, S), b && b !== S && (l.add(b), g(b)));
  }
  function R(f, _) {
    return f
      ? { database: m(f, _), closeAfterCallback: !1 }
      : r
        ? { database: y(_), closeAfterCallback: !1 }
        : { database: u(_), closeAfterCallback: !0 };
  }
  async function v(f, _) {
    let S = e(f),
      b = i.getStore(),
      x = b?.indexPathsByProjectPath.get(f),
      D,
      q;
    if (x) ((D = x), (q = R(b, D)));
    else {
      let O = !1;
      try {
        let A = qt(S, {
          openDatabase($) {
            let L = R(b, $);
            return ((O = L.closeAfterCallback), L.database);
          },
        });
        ((D = A.indexPath), (q = { database: A.database, closeAfterCallback: O }));
      } catch (A) {
        if (A instanceof ce) return null;
        throw A;
      }
      (T(f, S, D), E(D), b?.indexPathsByProjectPath.set(f, D));
    }
    try {
      return await _(q.database, D);
    } finally {
      (q.closeAfterCallback && q.database.close(), b || (await w(D)));
    }
  }
  async function k(f, _, S = "none") {
    let b = await U(f, _.path, S);
    if (b) return b;
    let x = Vt(_.path);
    if (x.length === 0) return null;
    let D = f.prepare(`SELECT ${Te(S)}
       FROM vfs_entries entry
       LEFT JOIN files file
         ON file.id = entry.source_file_id
       WHERE entry.project_id = ?
         AND entry.vfs_path = ?
       LIMIT 1`);
    for (let O of x) {
      let A = D.get(1, O);
      if (A) return ne(A);
    }
    let q = f.prepare(`SELECT ${Te(S)}
       FROM vfs_entries entry
       LEFT JOIN files file
         ON file.id = entry.source_file_id
       WHERE entry.project_id = ?
         AND lower(entry.vfs_path) = lower(?)
       LIMIT 1`);
    for (let O of x) {
      let A = q.get(1, O);
      if (A) return ne(A);
    }
    return P(f, _.path, S);
  }
  async function U(f, _, S) {
    if (!ls(_)) return null;
    let b = us(_);
    if (!b) return null;
    let x = f
      .prepare(
        `SELECT ${Te(S)}
         FROM vfs_entries entry
         LEFT JOIN files file
           ON file.id = entry.source_file_id
         WHERE entry.project_id = ?
           AND entry.vfs_logical_key = ?
         ORDER BY entry.id
         LIMIT 1`,
      )
      .get(1, b);
    return x ? ne(x) : null;
  }
  function P(f, _, S) {
    let b = _.replace(/\\/g, "/").trim();
    if (b.indexOf(":/") >= 0) return null;
    let D = b,
      O =
        f
          .prepare(
            `SELECT id
         FROM files
         WHERE project_id = ?
           AND project_rel_path = ?
         LIMIT 1`,
          )
          .get(1, D) ??
        f
          .prepare(
            `SELECT id
         FROM files
         WHERE project_id = ?
           AND lower(project_rel_path) = lower(?)
         LIMIT 1`,
          )
          .get(1, D);
    if (!O) return null;
    let A = f
      .prepare(
        `SELECT ${Te(S)}
         FROM vfs_entries entry
         LEFT JOIN files file
           ON file.id = entry.source_file_id
         WHERE entry.project_id = ?
           AND entry.vfs_logical_key = ?
         ORDER BY entry.id
         LIMIT 1`,
      )
      .get(1, er(O.id));
    return A ? ne(A) : null;
  }
  async function j(f, _) {
    let S = await k(f, _);
    if (!S) return null;
    if (S.entryKind.toLowerCase() === "gameobject") return oe(S);
    let b = f
      .prepare(
        `WITH RECURSIVE ownership(entry_id, parent_id, depth) AS (
           SELECT child.id,
                  parent.id,
                  1
           FROM vfs_entries child
           JOIN vfs_edges edge
             ON edge.from_entry_id = child.id
            AND edge.edge_kind = 'child_of'
           JOIN vfs_entries parent
             ON parent.id = edge.to_entry_id
           WHERE child.project_id = ?
             AND child.vfs_path = ?

           UNION ALL

           SELECT ownership.parent_id,
                  parent.id,
                  ownership.depth + 1
           FROM ownership
           JOIN vfs_edges edge
             ON edge.from_entry_id = ownership.parent_id
            AND edge.edge_kind = 'child_of'
           JOIN vfs_entries parent
             ON parent.id = edge.to_entry_id
           WHERE ownership.parent_id IS NOT NULL
             AND ownership.depth < 64
         )
         SELECT ancestor.vfs_path,
                ancestor.entry_type,
                ancestor.entry_kind,
                ancestor.display_name,
                ancestor.parent_vfs_path,
                ancestor.target_vfs_path,
                file.project_rel_path AS source_file_path,
                ancestor.projection_kind,
                ancestor.source_vfs_path,
                ancestor.source_owner_vfs_path,
                ancestor.instance_root_vfs_path,
                ancestor.line_start,
                ancestor.line_end,
                ancestor.size_bytes,
                ownership.depth
         FROM ownership
         JOIN vfs_entries ancestor
           ON ancestor.id = ownership.parent_id
         LEFT JOIN files file
           ON file.id = ancestor.source_file_id
         WHERE ancestor.project_id = ?
           AND lower(ancestor.entry_kind) = 'gameobject'
         ORDER BY ownership.depth ASC
         LIMIT 1`,
      )
      .get(1, S.vfsPath, 1);
    return b ? oe(ne(b)) : null;
  }
  function re(f, _) {
    let S = [...new Set(_.paths.map((B) => B.trim()).filter(Boolean))];
    if (S.length === 0) return new Map();
    let b = new Map(),
      x = new Set();
    for (let B of S) {
      let Z = Vt(B);
      b.set(B, Z);
      for (let $e of Z) x.add($e);
    }
    if (x.size === 0) return new Map();
    let D = [...x],
      q = D.map(() => "?").join(", "),
      O = f
        .prepare(
          `SELECT ${Te("none")}
         FROM vfs_entries entry
         LEFT JOIN files file
           ON file.id = entry.source_file_id
         WHERE entry.project_id = ?
           AND entry.vfs_path IN (${q})
         ORDER BY entry.id`,
        )
        .all(1, ...D)
        .map(ne),
      A = new Map(O.map((B) => [B.vfsPath, B])),
      $ = new Map(),
      L = new Map();
    for (let B of S) {
      let Z = b.get(B) ?? [];
      for (let $e of Z) {
        let ae = A.get($e);
        if (ae) {
          (L.set(ae.vfsPath, ae), $.set(B, { entry: oe(ae), directChildCount: 0 }));
          break;
        }
      }
    }
    if (L.size === 0) return $;
    let M = [...L.keys()],
      z = M.map(() => "?").join(", "),
      Y = f
        .prepare(
          `SELECT parent_vfs_path AS parentVfsPath,
                COUNT(*) AS directChildCount
         FROM vfs_entries
         WHERE project_id = ?
           AND parent_vfs_path IN (${z})
         GROUP BY parent_vfs_path`,
        )
        .all(1, ...M),
      Re = new Map(Y.map((B) => [B.parentVfsPath, B.directChildCount]));
    for (let [B, Z] of $) $.set(B, { ...Z, directChildCount: Re.get(Z.entry.vfsPath) ?? 0 });
    return $;
  }
  function fe(f, _) {
    let S = [...new Set(_.paths.map((L) => L.trim()).filter(Boolean))];
    if (S.length === 0) return new Map();
    let b = new Map(),
      x = new Set();
    for (let L of S) {
      let M = Vt(L);
      b.set(L, M);
      for (let z of M) x.add(z);
    }
    if (x.size === 0) return new Map();
    let D = [...x],
      q = D.map(() => "?").join(", "),
      O = f
        .prepare(
          `SELECT ${Te("content")}
         FROM vfs_entries entry
         LEFT JOIN files file
           ON file.id = entry.source_file_id
         WHERE entry.project_id = ?
           AND entry.vfs_path IN (${q})
         ORDER BY entry.id`,
        )
        .all(1, ...D)
        .map(ne),
      A = new Map(O.map((L) => [L.vfsPath, L])),
      $ = new Map();
    for (let L of S) {
      let M = b.get(L) ?? [];
      for (let z of M) {
        let Y = A.get(z);
        if (Y) {
          $.set(L, { entry: oe(Y), content: Y.content ?? null });
          break;
        }
      }
    }
    return $;
  }
  let V = {
    backend: Jn,
    dispose() {
      d();
    },
    async withQuerySession(f) {
      if (i.getStore()) return f();
      let S = { databasesByIndexPath: new Map(), indexPathsByProjectPath: new Map() };
      return i.run(S, async () => {
        try {
          return await f();
        } finally {
          (h(S), await Promise.all([...S.indexPathsByProjectPath.values()].map((b) => w(b))));
        }
      });
    },
    async warmupProjectIndex(f) {
      return (await v(f, () => !0)) === !0;
    },
    async refreshProjectIndexGeneration(f) {
      let _ = e(f),
        S = sr(_);
      return S ? (T(f, _, S), await Promise.all([...l].map(g)), !0) : !1;
    },
    async queryProjectIndex(f) {
      return v(f.projectPath, (_, S) => {
        let b = _.prepare(
          `SELECT project_path, schema_version
             FROM projects
             WHERE project_path = ?
             LIMIT 1`,
        ).get(f.projectPath);
        if (!b) return null;
        let x = b;
        return { projectPath: x.project_path, indexPath: S, schemaVersion: x.schema_version, backend: Jn };
      });
    },
    async queryVfsEntry(f) {
      let _ = await v(f.projectPath, (S) => k(S, f));
      return _ ? oe(_) : null;
    },
    async queryVfsChildren(f) {
      return (
        (
          await await v(f.projectPath, async (S) => {
            let b = await k(S, f);
            if (!b) return [];
            let x = Math.max(f.depth ?? 1, 1);
            if (x === 1) {
              let A = S.prepare(
                `SELECT ${Te("none")},
                      ${Qc}
               FROM vfs_entries entry
               LEFT JOIN files file
                 ON file.id = entry.source_file_id
               WHERE entry.project_id = ?
                 AND entry.parent_vfs_path = ?`,
              )
                .all(1, b.vfsPath)
                .map(ne);
              return Hc(b.vfsPath, A);
            }
            let D = Bt(b.vfsPath),
              O = S.prepare(
                `SELECT ${Te("none")}
             FROM vfs_entries entry
             LEFT JOIN files file
               ON file.id = entry.source_file_id
             WHERE entry.project_id = ?
               AND entry.vfs_path != ?
               AND entry.vfs_path >= ?
               AND entry.vfs_path < ?
             ORDER BY entry.vfs_path ASC`,
              )
                .all(1, b.vfsPath, D.lowerBound, D.upperBound)
                .map(ne)
                .filter((A) => zn(b.vfsPath, A.vfsPath) && sg(b.vfsPath, A.vfsPath) <= x);
            return Hc(b.vfsPath, O);
          })
        )?.map(oe) ?? []
      );
    },
    async queryVfsEntrySummaries(f) {
      return (await v(f.projectPath, (S) => re(S, f))) ?? new Map();
    },
    async queryVfsGlob(f) {
      return (
        (
          await await v(f.projectPath, async (S) => {
            let b = f.path ? ((await k(S, { projectPath: f.projectPath, path: f.path }))?.vfsPath ?? Xc(f.path)) : "",
              x = Wi(f.pattern, f.ignoreCase ?? !0),
              D = Ki(x, f.ignoreCase ?? !0),
              q = x === "**/*",
              O = !b && x === "*",
              A = ag(f.pattern),
              $ = A !== null,
              L = ["entry.project_id = ?"],
              M = [1];
            (b && el(L, M, b), O && L.push("entry.parent_vfs_path IS NULL"));
            let z = or(f.type);
            if ((z && (L.push(z.sql), M.push(...z.params)), q && L.push("entry.vfs_path LIKE '%/%'"), $)) {
              let de = f.ignoreCase ?? !0;
              A.includes("/")
                ? (L.push(
                    de
                      ? `(instr(lower(entry.vfs_path), lower(?)) > 0
               OR instr(lower(replace(entry.vfs_path, ':/', '/')), lower(?)) > 0)`
                      : `(instr(entry.vfs_path, ?) > 0
               OR instr(replace(entry.vfs_path, ':/', '/'), ?) > 0)`,
                  ),
                  M.push(A, A))
                : (L.push(de ? "instr(lower(entry.vfs_path), lower(?)) > 0" : "instr(entry.vfs_path, ?) > 0"),
                  M.push(A));
            }
            let Y = !b && (q || $),
              Re = Y && f.limit !== void 0 ? "LIMIT ? OFFSET ?" : Y && f.offset !== void 0 ? "LIMIT -1 OFFSET ?" : "";
            Y && f.limit !== void 0 ? M.push(f.limit, f.offset ?? 0) : Y && f.offset !== void 0 && M.push(f.offset);
            let B = O ? "" : "ORDER BY entry.vfs_path ASC",
              Z = S.prepare(
                `SELECT entry.vfs_path,
                    entry.entry_type,
                    entry.entry_kind,
                    entry.display_name,
                    entry.parent_vfs_path,
                    entry.target_vfs_path,
                    file.project_rel_path AS source_file_path,
                    entry.projection_kind,
                    entry.source_vfs_path,
                    entry.source_owner_vfs_path,
                    entry.instance_root_vfs_path,
                    entry.line_start,
                    entry.line_end,
                    entry.size_bytes${
                      O
                        ? `,
                    ${Qc}`
                        : ""
                    }
             FROM vfs_entries entry
             LEFT JOIN files file
               ON file.id = entry.source_file_id
             WHERE ${L.join(`
               AND `)}
             ${B}
             ${Re}`,
              )
                .all(...M)
                .map(ne),
              $e = O ? Z.sort((de, cl) => de.vfsPath.localeCompare(cl.vfsPath)) : Z,
              ae = b ? $e.filter((de) => zn(b, de.vfsPath)) : $e;
            return q || $
              ? b
                ? ae.slice(f.offset ?? 0, (f.offset ?? 0) + (f.limit ?? ae.length))
                : ae
              : ae.filter((de) => cg(D, de.vfsPath)).slice(f.offset ?? 0, (f.offset ?? 0) + (f.limit ?? Z.length));
          })
        )?.map(oe) ?? []
      );
    },
    async queryVfsEntryContent(f) {
      let _ = await v(f.projectPath, (S) => k(S, f, "content"));
      return _ ? { entry: oe(_), content: _.content ?? null } : null;
    },
    async queryVfsEntryContentBatch(f) {
      return (await v(f.projectPath, (S) => fe(S, f))) ?? new Map();
    },
    async queryVfsEntryMetaContent(f) {
      let _ = await v(f.projectPath, (S) => k(S, f, "meta"));
      return _ ? { entry: oe(_), metaContent: _.metaContent ?? null } : null;
    },
    async queryVfsContent(f) {
      return (await v(f.projectPath, async (S) => (await k(S, f, "content"))?.content ?? null)) ?? null;
    },
    async queryVfsSearch(f) {
      return (
        (await await v(f.projectPath, async (S) => {
          let b = f.path ? ((await k(S, { projectPath: f.projectPath, path: f.path }))?.vfsPath ?? Xc(f.path)) : "",
            x = f.include ? Ki(Wi(f.include)) : null,
            D = ug(f),
            q = ng(S, { scopePath: b, type: f.type, contentLiteral: D?.literal, contentIgnoreCase: D?.ignoreCase }),
            O = lg(f),
            A = tl(f),
            $ = [],
            L = new Set();
          for (let M of q) {
            if (!zn(b, M.vfsPath)) continue;
            let z = ts(M.entryKind, M.entryType, M.vfsPath),
              Y = nt(oe(M)),
              Re = Gi(Y);
            if (x && !ig(Y, Re, x)) continue;
            if (
              (Yc(
                $,
                L,
                Re,
                M.entryKind,
                z,
                "content",
                zc({
                  rawContent: M.content ?? "",
                  matcher: O,
                  limit: f.limit ?? Number.MAX_SAFE_INTEGER,
                  allowMaskedOnlyMatch: A,
                }),
                0,
                f.limit ?? Number.MAX_SAFE_INTEGER,
              ),
              $.length >= (f.limit ?? Number.MAX_SAFE_INTEGER))
            )
              return $;
            let B = Bi(M.content ?? "").length;
            if (
              (Yc(
                $,
                L,
                Re,
                M.entryKind,
                z,
                "meta_content",
                zc({
                  rawContent: M.metaContent ?? "",
                  matcher: O,
                  limit: f.limit ?? Number.MAX_SAFE_INTEGER,
                  allowMaskedOnlyMatch: A,
                }),
                B,
                f.limit ?? Number.MAX_SAFE_INTEGER,
              ),
              $.length >= (f.limit ?? Number.MAX_SAFE_INTEGER))
            )
              return $;
          }
          return $;
        })) ?? []
      );
    },
    async querySemanticVfsRefs(f) {
      return (await v(f.projectPath, (S) => Kc(S, f))) ?? [];
    },
    async queryOwningGameObject(f) {
      return (await v(f.projectPath, (S) => j(S, f))) ?? null;
    },
    async queryGuidToProjectRelPath(f) {
      return (
        (await v(f.projectPath, (S) => {
          let b = S.prepare(
            `SELECT guid, project_rel_path, kind
             FROM files
             WHERE project_id = ? AND guid IS NOT NULL`,
          ).all(1);
          return $c(b.map((x) => ({ guid: x.guid, projectRelPath: x.project_rel_path, kind: x.kind })));
        })) ?? new Map()
      );
    },
    async queryIndexStatus(f) {
      return Cc(f);
    },
    async formatVfsReadContent(f) {
      return qc(V, f.projectPath, nt(f.entry, { content: f.content }), {
        softProjectionFallback: f.softProjectionFallback,
      });
    },
    async formatVfsReadMetaContent(f) {
      return Bc(V, f.projectPath, f.metaContent);
    },
  };
  return V;
}
function ne(t) {
  let e = t;
  return {
    vfsPath: e.vfs_path,
    entryType: e.entry_type,
    entryKind: e.entry_kind,
    displayName: e.display_name,
    childOrder: e.child_order,
    parentVfsPath: e.parent_vfs_path,
    targetVfsPath: e.target_vfs_path,
    sourceFilePath: e.source_file_path,
    projectionKind: e.projection_kind,
    sourceVfsPath: e.source_vfs_path,
    sourceOwnerVfsPath: e.source_owner_vfs_path,
    instanceRootVfsPath: e.instance_root_vfs_path,
    lineStart: e.line_start,
    lineEnd: e.line_end,
    sizeBytes: e.size_bytes,
    content: e.content,
    metaContent: e.meta_content,
    hasChildren: e.has_children === void 0 || e.has_children === null ? void 0 : !!e.has_children,
  };
}
function Hc(t, e) {
  let n = new Map();
  for (let s of e) {
    if (!s.parentVfsPath) continue;
    let o = n.get(s.parentVfsPath) ?? [];
    (o.push(s), n.set(s.parentVfsPath, o));
  }
  for (let s of n.values()) s.sort((o, a) => o.childOrder - a.childOrder || o.vfsPath.localeCompare(a.vfsPath));
  let r = [],
    i = (s) => {
      for (let o of n.get(s) ?? []) (r.push(o), i(o.vfsPath));
    };
  return (i(t), r);
}
function* ng(t, e) {
  let n = rg(e),
    r = t.prepare(n.sql);
  for (let i of r.iterate(...n.params)) yield ne(i);
}
function rg(t) {
  let e = [1],
    n = [
      "entry.project_id = ?",
      `(entry.meta_content IS NOT NULL
      OR (entry.entry_type <> 'file' AND entry.content IS NOT NULL))`,
    ];
  t.scopePath && el(n, e, t.scopePath);
  let r = Ps(t.type);
  return (
    r && (n.push(r.sql), e.push(...r.params)),
    t.contentLiteral !== void 0 &&
      (t.contentIgnoreCase
        ? (n.push(`(
             instr(lower(COALESCE(entry.meta_content, '')), ?) > 0
             OR (
               entry.entry_type <> 'file'
               AND instr(lower(COALESCE(entry.content, '')), ?) > 0
             )
           )`),
          e.push(t.contentLiteral.toLowerCase(), t.contentLiteral.toLowerCase()))
        : (n.push(`(
             instr(COALESCE(entry.meta_content, ''), ?) > 0
             OR (
               entry.entry_type <> 'file'
               AND instr(COALESCE(entry.content, ''), ?) > 0
             )
           )`),
          e.push(t.contentLiteral, t.contentLiteral))),
    {
      sql: `${`SELECT entry.vfs_path,
                entry.entry_type,
                entry.entry_kind,
                entry.display_name,
                entry.child_order,
                entry.parent_vfs_path,
                entry.target_vfs_path,
                file.project_rel_path AS source_file_path,
                entry.projection_kind,
                entry.source_vfs_path,
                entry.source_owner_vfs_path,
                entry.instance_root_vfs_path,
                entry.line_start,
                entry.line_end,
                entry.size_bytes,
                CASE
                  WHEN entry.entry_type = 'file' THEN NULL
                  ELSE entry.content
                END AS content,
                entry.meta_content
         FROM vfs_entries entry
         LEFT JOIN files file
           ON file.id = entry.source_file_id
         WHERE ${n.join(`
           AND `)}`}
         ORDER BY entry.vfs_path ASC`,
      params: e,
    }
  );
}
function Yc(t, e, n, r, i, s, o, a, c) {
  for (let l of o) {
    let p = a + l.line,
      u = l.text,
      d = `${n}|${s}|${p}|${u}`;
    if (
      !e.has(d) &&
      (e.add(d),
      t.push({ vfsPath: n, entryKind: r, displayType: i, line: p, text: u, contentSource: s }),
      t.length >= c)
    )
      return;
  }
}
function zc(t) {
  let e = Bi(t.rawContent);
  if (e.length === 0) return [];
  let n = t.allowMaskedOnlyMatch ? e.map((s, o) => o) : e.map((s, o) => (t.matcher(s) ? o : -1)).filter((s) => s >= 0);
  if (n.length === 0) return [];
  let r = t.allowMaskedOnlyMatch ? Yn((t.maskContent ?? Wc)(t.rawContent)) : e.map((s) => Hn(s)),
    i = [];
  for (let s of n)
    if (t.matcher(r[s] ?? "") && (i.push({ line: s + 1, text: e[s] ?? "" }), i.length >= t.limit)) return i;
  return i;
}
function Jc(t) {
  return t.replace(/\\/g, "/");
}
function ig(t, e, n) {
  let r = Jc(t.path),
    i = Jc(e),
    s = t.sourcePath.replace(/\\/g, "/"),
    o = s ? `${s}.meta` : "",
    a = e ? `${e}.meta` : "";
  return [
    t.path,
    r,
    e,
    i,
    s,
    s ? (s.split("/").pop() ?? "") : "",
    o,
    o ? (o.split("/").pop() ?? "") : "",
    a,
    a ? (a.split("/").pop() ?? "") : "",
  ].some((l) => l && n.test(l));
}
function oe(t) {
  return {
    vfsPath: t.vfsPath,
    entryType: t.entryType,
    entryKind: t.entryKind,
    displayName: t.displayName,
    parentVfsPath: t.parentVfsPath ?? void 0,
    targetVfsPath: t.targetVfsPath ?? void 0,
    sourceFilePath: t.sourceFilePath ?? void 0,
    projectionKind: t.projectionKind ?? void 0,
    sourceVfsPath: t.sourceVfsPath ?? void 0,
    sourceOwnerVfsPath: t.sourceOwnerVfsPath ?? void 0,
    instanceRootVfsPath: t.instanceRootVfsPath ?? void 0,
    lineStart: t.lineStart ?? void 0,
    lineEnd: t.lineEnd ?? void 0,
    sizeBytes: t.sizeBytes,
    ...(t.hasChildren === void 0 ? {} : { hasChildren: t.hasChildren }),
  };
}
function zn(t, e) {
  return t
    ? e === t || e.startsWith(`${t}/`) || e.startsWith(`${t}:`) || e.startsWith(t.endsWith("/") ? t : `${t}/`)
    : !0;
}
function sg(t, e) {
  if (!zn(t, e) || e === t) return 0;
  let n = t.endsWith("/") ? t : og(t) === "container" ? `${t}/` : t;
  return e.replace(n, "").replace(/^:/, "").replace(/^\/+/, "").split("/").filter(Boolean).length;
}
function og(t) {
  return Ot({
    entryType: t.endsWith("/") || t.includes(":/") ? "node" : "file",
    entryRole: t.endsWith("/") ? "container" : void 0,
    labels: [],
  });
}
function Xc(t) {
  let e = t.trim();
  return e ? (e.endsWith("/") ? je(e, "directory") : e) : "";
}
function el(t, e, n) {
  let r = n.endsWith("/") ? n : `${n}/`,
    i = Bt(r),
    s = Bt(`${n}:`);
  (t.push(`(
    entry.vfs_path = ?
    OR (
      entry.vfs_path >= ?
      AND entry.vfs_path < ?
    )
    OR (
      entry.vfs_path >= ?
      AND entry.vfs_path < ?
    )
  )`),
    e.push(n, i.lowerBound, i.upperBound, s.lowerBound, s.upperBound));
}
function ag(t) {
  let e = t.trim();
  if (!e.startsWith("**") || !e.endsWith("**") || e.length < 4) return null;
  let n = e.slice(2, -2);
  if (!n || n.startsWith("/") || n.includes("**")) return null;
  let r = "";
  for (let i = 0; i < n.length; i += 1) {
    let s = n[i];
    if (s === "\\") {
      let o = n[i + 1];
      if (o === void 0) return null;
      if (o === "*" || o === "?" || o === "[" || o === "]" || o === "\\") {
        ((r += o), (i += 1));
        continue;
      }
      r += "/";
      continue;
    }
    if (s === "*" || s === "?" || s === "[") return null;
    r += s;
  }
  return r || null;
}
function cg(t, e) {
  for (let n of pc([e])) if (t.test(n) || (n.length > 1 && n.endsWith("/") && t.test(n.replace(/\/+$/, "")))) return !0;
  return !1;
}
function lg(t) {
  let e = t.ignoreCase ?? !0;
  if (t.pattern) {
    let r = e ? "i" : "",
      i = new RegExp(t.pattern, r);
    return (s) => i.test(s);
  }
  let n = t.query ?? "";
  return n ? (e ? (r) => r.toLowerCase().includes(n.toLowerCase()) : (r) => r.includes(n)) : () => !1;
}
function ug(t) {
  let e = t.ignoreCase ?? !0,
    n = t.pattern
      ? /[.*+?^${}()|[\]\\]/.test(t.pattern)
        ? null
        : t.pattern
      : t.query && !t.query.includes("*") && !t.query.includes("?") && !t.query.includes("[")
        ? t.query
        : null;
  return !n || tl(t) || (e && Buffer.byteLength(n, "utf8") !== n.length) ? null : { literal: n, ignoreCase: e };
}
function tl(t) {
  return (t.pattern ?? t.query ?? "").replace(/\\/g, "").toLowerCase().includes(Lt.toLowerCase());
}
var dg = new Set(ss);
function il(t) {
  return typeof t == "object" && t !== null;
}
function ns(t) {
  return il(t) && typeof t.id == "number" && Number.isSafeInteger(t.id);
}
function pg(t) {
  return !ns(t) || typeof t.type != "string"
    ? !1
    : t.type === "session-start" || t.type === "session-end" || t.type === "dispose"
      ? !0
      : (t.type === "call" || t.type === "session-call") &&
        typeof t.method == "string" &&
        dg.has(t.method) &&
        Array.isArray(t.args);
}
function fE(t) {
  return !ns(t) || t.type !== "result" || typeof t.ok != "boolean"
    ? !1
    : t.ok
      ? !0
      : il(t.error) && typeof t.error.name == "string" && typeof t.error.message == "string";
}
var Dt = Zc({ persistentConnections: os(fg) });
function hg(t) {
  return t instanceof Map ? { __type: "Map", entries: [...t.entries()] } : t;
}
function sl(t) {
  return t instanceof Error ? { name: t.name, message: t.message } : { name: "Error", message: String(t) };
}
function Ve(t) {
  rl?.postMessage(t);
}
var ke = null;
async function ol(t) {
  try {
    let e = Dt[t.method];
    if (typeof e != "function") throw new Error(`Unknown query method: ${String(t.method)}`);
    let n = await e.apply(Dt, t.args);
    Ve({ type: "result", id: t.id, ok: !0, value: hg(n) });
  } catch (e) {
    Ve({ type: "result", id: t.id, ok: !1, error: sl(e) });
  }
}
async function yg(t) {
  t.calls.length > 0 ||
    t.ending ||
    (await new Promise((e) => {
      t.wake = e;
    }),
    (t.wake = null));
}
async function gg(t) {
  if (ke) throw new Error("A query worker session is already active.");
  let e,
    n = new Promise((i) => {
      e = i;
    }),
    r = { calls: [], wake: null, ending: !1, lifecycle: Promise.resolve() };
  ((r.lifecycle = Dt.withQuerySession(async () => {
    for (ke = r, Ve({ type: "result", id: t.id, ok: !0, value: !0 }), e(); !r.ending || r.calls.length > 0;) {
      await yg(r);
      let i = r.calls.shift();
      i && (await ol(i.request), i.complete());
    }
  })),
    await n);
}
async function mg(t) {
  let e = ke;
  if (!e || e.ending) throw new Error("No query worker session is active.");
  await new Promise((n) => {
    (e.calls.push({ request: t, complete: n }), e.wake?.());
  });
}
async function al(t) {
  ((t.ending = !0), t.wake?.());
  try {
    await t.lifecycle;
  } finally {
    ke === t && (ke = null);
  }
}
async function Sg(t) {
  let e = ke;
  if (!e) throw new Error("No query worker session is active.");
  (await al(e), Ve({ type: "result", id: t.id, ok: !0, value: !0 }));
}
async function _g(t) {
  if (!pg(t)) {
    ns(t) &&
      Ve({
        type: "result",
        id: t.id,
        ok: !1,
        error: { name: "TypeError", message: "Malformed query worker request." },
      });
    return;
  }
  try {
    if (t.type === "session-start") {
      await gg(t);
      return;
    }
    if (t.type === "session-call") {
      await mg(t);
      return;
    }
    if (t.type === "session-end") {
      await Sg(t);
      return;
    }
    if (t.type === "dispose") {
      let e = ke;
      try {
        e && (await al(e));
      } finally {
        Dt.dispose();
      }
      Ve({ type: "result", id: t.id, ok: !0, value: !0 });
      return;
    }
    if (ke) throw new Error("Cannot make an unscoped call during a query session.");
    await Dt.withQuerySession(() => ol(t));
  } catch (e) {
    Ve({ type: "result", id: t.id, ok: !1, error: sl(e) });
  }
}
var nl = Promise.resolve();
rl?.on("message", (t) => {
  nl = nl.then(() => _g(t)).catch(() => {});
});
export { pg as isSqliteQueryWorkerRequest, fE as isSqliteQueryWorkerResultResponse };
