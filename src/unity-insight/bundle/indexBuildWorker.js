import { createRequire as __unityInsightCreateRequire } from "node:module";
import { insightHome as __gcuInsightHome, indexDirectory as __gcuInsightIndexDirectory } from "./gamecowork-worker-paths.js";
import { fileURLToPath as __unityInsightFileURLToPath } from "node:url";
import { dirname as __unityInsightDirname } from "node:path";
const __filename = __unityInsightFileURLToPath(import.meta.url);
const __dirname = __unityInsightDirname(__filename);
const require = __unityInsightCreateRequire(import.meta.url);
var ah = Object.create;
var Sc = Object.defineProperty;
var lh = Object.getOwnPropertyDescriptor;
var ch = Object.getOwnPropertyNames;
var dh = Object.getPrototypeOf,
  uh = Object.prototype.hasOwnProperty;
var Ki = ((e) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
      ? new Proxy(e, { get: (t, n) => (typeof require < "u" ? require : t)[n] })
      : e)(function (e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
});
var A = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var fh = (e, t, n, i) => {
  if ((t && typeof t == "object") || typeof t == "function")
    for (let r of ch(t))
      !uh.call(e, r) && r !== n && Sc(e, r, { get: () => t[r], enumerable: !(i = lh(t, r)) || i.enumerable });
  return e;
};
var Rc = (e, t, n) => (
  (n = e != null ? ah(dh(e)) : {}),
  fh(t || !e || !e.__esModule ? Sc(n, "default", { value: e, enumerable: !0 }) : n, e)
);
var G = A((ye) => {
  "use strict";
  var go = Symbol.for("yaml.alias"),
    $d = Symbol.for("yaml.document"),
    rr = Symbol.for("yaml.map"),
    Wd = Symbol.for("yaml.pair"),
    ho = Symbol.for("yaml.scalar"),
    sr = Symbol.for("yaml.seq"),
    ot = Symbol.for("yaml.node.type"),
    ab = (e) => !!e && typeof e == "object" && e[ot] === go,
    lb = (e) => !!e && typeof e == "object" && e[ot] === $d,
    cb = (e) => !!e && typeof e == "object" && e[ot] === rr,
    db = (e) => !!e && typeof e == "object" && e[ot] === Wd,
    Vd = (e) => !!e && typeof e == "object" && e[ot] === ho,
    ub = (e) => !!e && typeof e == "object" && e[ot] === sr;
  function qd(e) {
    if (e && typeof e == "object")
      switch (e[ot]) {
        case rr:
        case sr:
          return !0;
      }
    return !1;
  }
  function fb(e) {
    if (e && typeof e == "object")
      switch (e[ot]) {
        case go:
        case rr:
        case ho:
        case sr:
          return !0;
      }
    return !1;
  }
  var mb = (e) => (Vd(e) || qd(e)) && !!e.anchor;
  ye.ALIAS = go;
  ye.DOC = $d;
  ye.MAP = rr;
  ye.NODE_TYPE = ot;
  ye.PAIR = Wd;
  ye.SCALAR = ho;
  ye.SEQ = sr;
  ye.hasAnchor = mb;
  ye.isAlias = ab;
  ye.isCollection = qd;
  ye.isDocument = lb;
  ye.isMap = cb;
  ye.isNode = fb;
  ye.isPair = db;
  ye.isScalar = Vd;
  ye.isSeq = ub;
});
var Yn = A((Io) => {
  "use strict";
  var se = G(),
    ve = Symbol("break visit"),
    zd = Symbol("skip children"),
    He = Symbol("remove node");
  function or(e, t) {
    let n = Hd(t);
    se.isDocument(e)
      ? on(null, e.contents, n, Object.freeze([e])) === He && (e.contents = null)
      : on(null, e, n, Object.freeze([]));
  }
  or.BREAK = ve;
  or.SKIP = zd;
  or.REMOVE = He;
  function on(e, t, n, i) {
    let r = Xd(e, t, n, i);
    if (se.isNode(r) || se.isPair(r)) return (Jd(e, i, r), on(e, r, n, i));
    if (typeof r != "symbol") {
      if (se.isCollection(t)) {
        i = Object.freeze(i.concat(t));
        for (let s = 0; s < t.items.length; ++s) {
          let o = on(s, t.items[s], n, i);
          if (typeof o == "number") s = o - 1;
          else {
            if (o === ve) return ve;
            o === He && (t.items.splice(s, 1), (s -= 1));
          }
        }
      } else if (se.isPair(t)) {
        i = Object.freeze(i.concat(t));
        let s = on("key", t.key, n, i);
        if (s === ve) return ve;
        s === He && (t.key = null);
        let o = on("value", t.value, n, i);
        if (o === ve) return ve;
        o === He && (t.value = null);
      }
    }
    return r;
  }
  async function ar(e, t) {
    let n = Hd(t);
    se.isDocument(e)
      ? (await an(null, e.contents, n, Object.freeze([e]))) === He && (e.contents = null)
      : await an(null, e, n, Object.freeze([]));
  }
  ar.BREAK = ve;
  ar.SKIP = zd;
  ar.REMOVE = He;
  async function an(e, t, n, i) {
    let r = await Xd(e, t, n, i);
    if (se.isNode(r) || se.isPair(r)) return (Jd(e, i, r), an(e, r, n, i));
    if (typeof r != "symbol") {
      if (se.isCollection(t)) {
        i = Object.freeze(i.concat(t));
        for (let s = 0; s < t.items.length; ++s) {
          let o = await an(s, t.items[s], n, i);
          if (typeof o == "number") s = o - 1;
          else {
            if (o === ve) return ve;
            o === He && (t.items.splice(s, 1), (s -= 1));
          }
        }
      } else if (se.isPair(t)) {
        i = Object.freeze(i.concat(t));
        let s = await an("key", t.key, n, i);
        if (s === ve) return ve;
        s === He && (t.key = null);
        let o = await an("value", t.value, n, i);
        if (o === ve) return ve;
        o === He && (t.value = null);
      }
    }
    return r;
  }
  function Hd(e) {
    return typeof e == "object" && (e.Collection || e.Node || e.Value)
      ? Object.assign(
          { Alias: e.Node, Map: e.Node, Scalar: e.Node, Seq: e.Node },
          e.Value && { Map: e.Value, Scalar: e.Value, Seq: e.Value },
          e.Collection && { Map: e.Collection, Seq: e.Collection },
          e,
        )
      : e;
  }
  function Xd(e, t, n, i) {
    if (typeof n == "function") return n(e, t, i);
    if (se.isMap(t)) return n.Map?.(e, t, i);
    if (se.isSeq(t)) return n.Seq?.(e, t, i);
    if (se.isPair(t)) return n.Pair?.(e, t, i);
    if (se.isScalar(t)) return n.Scalar?.(e, t, i);
    if (se.isAlias(t)) return n.Alias?.(e, t, i);
  }
  function Jd(e, t, n) {
    let i = t[t.length - 1];
    if (se.isCollection(i)) i.items[e] = n;
    else if (se.isPair(i)) e === "key" ? (i.key = n) : (i.value = n);
    else if (se.isDocument(i)) i.contents = n;
    else {
      let r = se.isAlias(i) ? "alias" : "scalar";
      throw new Error(`Cannot replace node with ${r} parent`);
    }
  }
  Io.visit = or;
  Io.visitAsync = ar;
});
var bo = A((Zd) => {
  "use strict";
  var Qd = G(),
    yb = Yn(),
    pb = { "!": "%21", ",": "%2C", "[": "%5B", "]": "%5D", "{": "%7B", "}": "%7D" },
    gb = (e) => e.replace(/[!,[\]{}]/g, (t) => pb[t]),
    $n = class e {
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
        for (let [n, i] of Object.entries(this.tags)) if (t.startsWith(i)) return n + gb(t.substring(i.length));
        return t[0] === "!" ? t : `!<${t}>`;
      }
      toString(t) {
        let n = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [],
          i = Object.entries(this.tags),
          r;
        if (t && i.length > 0 && Qd.isNode(t.contents)) {
          let s = {};
          (yb.visit(t.contents, (o, a) => {
            Qd.isNode(a) && a.tag && (s[a.tag] = !0);
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
  $n.defaultYaml = { explicit: !1, version: "1.2" };
  $n.defaultTags = { "!!": "tag:yaml.org,2002:" };
  Zd.Directives = $n;
});
var lr = A((Wn) => {
  "use strict";
  var eu = G(),
    hb = Yn();
  function Ib(e) {
    if (/[\x00-\x19\s,[\]{}]/.test(e)) {
      let n = `Anchor must not contain whitespace or control characters: ${JSON.stringify(e)}`;
      throw new Error(n);
    }
    return !0;
  }
  function tu(e) {
    let t = new Set();
    return (
      hb.visit(e, {
        Value(n, i) {
          i.anchor && t.add(i.anchor);
        },
      }),
      t
    );
  }
  function nu(e, t) {
    for (let n = 1; ; ++n) {
      let i = `${e}${n}`;
      if (!t.has(i)) return i;
    }
  }
  function bb(e, t) {
    let n = [],
      i = new Map(),
      r = null;
    return {
      onAnchor: (s) => {
        (n.push(s), r ?? (r = tu(e)));
        let o = nu(t, r);
        return (r.add(o), o);
      },
      setAnchors: () => {
        for (let s of n) {
          let o = i.get(s);
          if (typeof o == "object" && o.anchor && (eu.isScalar(o.node) || eu.isCollection(o.node)))
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
  Wn.anchorIsValid = Ib;
  Wn.anchorNames = tu;
  Wn.createNodeAnchors = bb;
  Wn.findNewAnchor = nu;
});
var Eo = A((iu) => {
  "use strict";
  function Vn(e, t, n, i) {
    if (i && typeof i == "object")
      if (Array.isArray(i))
        for (let r = 0, s = i.length; r < s; ++r) {
          let o = i[r],
            a = Vn(e, i, String(r), o);
          a === void 0 ? delete i[r] : a !== o && (i[r] = a);
        }
      else if (i instanceof Map)
        for (let r of Array.from(i.keys())) {
          let s = i.get(r),
            o = Vn(e, i, r, s);
          o === void 0 ? i.delete(r) : o !== s && i.set(r, o);
        }
      else if (i instanceof Set)
        for (let r of Array.from(i)) {
          let s = Vn(e, i, r, r);
          s === void 0 ? i.delete(r) : s !== r && (i.delete(r), i.add(s));
        }
      else
        for (let [r, s] of Object.entries(i)) {
          let o = Vn(e, i, r, s);
          o === void 0 ? delete i[r] : o !== s && (i[r] = o);
        }
    return e.call(t, n, i);
  }
  iu.applyReviver = Vn;
});
var St = A((su) => {
  "use strict";
  var Eb = G();
  function ru(e, t, n) {
    if (Array.isArray(e)) return e.map((i, r) => ru(i, String(r), n));
    if (e && typeof e.toJSON == "function") {
      if (!n || !Eb.hasAnchor(e)) return e.toJSON(t, n);
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
  su.toJS = ru;
});
var cr = A((au) => {
  "use strict";
  var _b = Eo(),
    ou = G(),
    Sb = St(),
    _o = class {
      constructor(t) {
        Object.defineProperty(this, ou.NODE_TYPE, { value: t });
      }
      clone() {
        let t = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        return (this.range && (t.range = this.range.slice()), t);
      }
      toJS(t, { mapAsMap: n, maxAliasCount: i, onAnchor: r, reviver: s } = {}) {
        if (!ou.isDocument(t)) throw new TypeError("A document argument is required");
        let o = {
            anchors: new Map(),
            doc: t,
            keep: !0,
            mapAsMap: n === !0,
            mapKeyWarned: !1,
            maxAliasCount: typeof i == "number" ? i : 100,
          },
          a = Sb.toJS(this, "", o);
        if (typeof r == "function") for (let { count: l, res: c } of o.anchors.values()) r(c, l);
        return typeof s == "function" ? _b.applyReviver(s, { "": a }, "", a) : a;
      }
    };
  au.NodeBase = _o;
});
var qn = A((lu) => {
  "use strict";
  var Rb = lr(),
    wb = Yn(),
    ln = G(),
    vb = cr(),
    Pb = St(),
    So = class extends vb.NodeBase {
      constructor(t) {
        (super(ln.ALIAS),
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
            wb.visit(t, {
              Node: (s, o) => {
                (ln.isAlias(o) || ln.hasAnchor(o)) && i.push(o);
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
        if ((a || (Pb.toJS(o, null, n), (a = i.get(o))), a?.res === void 0)) {
          let l = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(l);
        }
        if (
          s >= 0 &&
          ((a.count += 1), a.aliasCount === 0 && (a.aliasCount = dr(r, o, i)), a.count * a.aliasCount > s)
        ) {
          let l = "Excessive alias count indicates a resource exhaustion attack";
          throw new ReferenceError(l);
        }
        return a.res;
      }
      toString(t, n, i) {
        let r = `*${this.source}`;
        if (t) {
          if ((Rb.anchorIsValid(this.source), t.options.verifyAliasOrder && !t.anchors.has(this.source))) {
            let s = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(s);
          }
          if (t.implicitKey) return `${r} `;
        }
        return r;
      }
    };
  function dr(e, t, n) {
    if (ln.isAlias(t)) {
      let i = t.resolve(e),
        r = n && i && n.get(i);
      return r ? r.count * r.aliasCount : 0;
    } else if (ln.isCollection(t)) {
      let i = 0;
      for (let r of t.items) {
        let s = dr(e, r, n);
        s > i && (i = s);
      }
      return i;
    } else if (ln.isPair(t)) {
      let i = dr(e, t.key, n),
        r = dr(e, t.value, n);
      return Math.max(i, r);
    }
    return 1;
  }
  lu.Alias = So;
});
var ee = A((Ro) => {
  "use strict";
  var xb = G(),
    Tb = cr(),
    Nb = St(),
    kb = (e) => !e || (typeof e != "function" && typeof e != "object"),
    Rt = class extends Tb.NodeBase {
      constructor(t) {
        (super(xb.SCALAR), (this.value = t));
      }
      toJSON(t, n) {
        return n?.keep ? this.value : Nb.toJS(this.value, t, n);
      }
      toString() {
        return String(this.value);
      }
    };
  Rt.BLOCK_FOLDED = "BLOCK_FOLDED";
  Rt.BLOCK_LITERAL = "BLOCK_LITERAL";
  Rt.PLAIN = "PLAIN";
  Rt.QUOTE_DOUBLE = "QUOTE_DOUBLE";
  Rt.QUOTE_SINGLE = "QUOTE_SINGLE";
  Ro.Scalar = Rt;
  Ro.isScalarValue = kb;
});
var zn = A((du) => {
  "use strict";
  var Ob = qn(),
    jt = G(),
    cu = ee(),
    Ab = "tag:yaml.org,2002:";
  function Ub(e, t, n) {
    if (t) {
      let i = n.filter((s) => s.tag === t),
        r = i.find((s) => !s.format) ?? i[0];
      if (!r) throw new Error(`Tag ${t} not found`);
      return r;
    }
    return n.find((i) => i.identify?.(e) && !i.format);
  }
  function Lb(e, t, n) {
    if ((jt.isDocument(e) && (e = e.contents), jt.isNode(e))) return e;
    if (jt.isPair(e)) {
      let f = n.schema[jt.MAP].createNode?.(n.schema, null, n);
      return (f.items.push(e), f);
    }
    (e instanceof String ||
      e instanceof Number ||
      e instanceof Boolean ||
      (typeof BigInt < "u" && e instanceof BigInt)) &&
      (e = e.valueOf());
    let { aliasDuplicateObjects: i, onAnchor: r, onTagObj: s, schema: o, sourceObjects: a } = n,
      l;
    if (i && e && typeof e == "object") {
      if (((l = a.get(e)), l)) return (l.anchor ?? (l.anchor = r(e)), new Ob.Alias(l.anchor));
      ((l = { anchor: null, node: null }), a.set(e, l));
    }
    t?.startsWith("!!") && (t = Ab + t.slice(2));
    let c = Ub(e, t, o.tags);
    if (!c) {
      if ((e && typeof e.toJSON == "function" && (e = e.toJSON()), !e || typeof e != "object")) {
        let f = new cu.Scalar(e);
        return (l && (l.node = f), f);
      }
      c = e instanceof Map ? o[jt.MAP] : Symbol.iterator in Object(e) ? o[jt.SEQ] : o[jt.MAP];
    }
    s && (s(c), delete n.onTagObj);
    let d = c?.createNode
      ? c.createNode(n.schema, e, n)
      : typeof c?.nodeClass?.from == "function"
        ? c.nodeClass.from(n.schema, e, n)
        : new cu.Scalar(e);
    return (t ? (d.tag = t) : c.default || (d.tag = c.tag), l && (l.node = d), d);
  }
  du.createNode = Lb;
});
var fr = A((ur) => {
  "use strict";
  var Mb = zn(),
    Xe = G(),
    Fb = cr();
  function wo(e, t, n) {
    let i = n;
    for (let r = t.length - 1; r >= 0; --r) {
      let s = t[r];
      if (typeof s == "number" && Number.isInteger(s) && s >= 0) {
        let o = [];
        ((o[s] = i), (i = o));
      } else i = new Map([[s, i]]);
    }
    return Mb.createNode(i, void 0, {
      aliasDuplicateObjects: !1,
      keepUndefined: !1,
      onAnchor: () => {
        throw new Error("This should not happen, please report a bug.");
      },
      schema: e,
      sourceObjects: new Map(),
    });
  }
  var uu = (e) => e == null || (typeof e == "object" && !!e[Symbol.iterator]().next().done),
    vo = class extends Fb.NodeBase {
      constructor(t, n) {
        (super(t), Object.defineProperty(this, "schema", { value: n, configurable: !0, enumerable: !1, writable: !0 }));
      }
      clone(t) {
        let n = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        return (
          t && (n.schema = t),
          (n.items = n.items.map((i) => (Xe.isNode(i) || Xe.isPair(i) ? i.clone(t) : i))),
          this.range && (n.range = this.range.slice()),
          n
        );
      }
      addIn(t, n) {
        if (uu(t)) this.add(n);
        else {
          let [i, ...r] = t,
            s = this.get(i, !0);
          if (Xe.isCollection(s)) s.addIn(r, n);
          else if (s === void 0 && this.schema) this.set(i, wo(this.schema, r, n));
          else throw new Error(`Expected YAML collection at ${i}. Remaining path: ${r}`);
        }
      }
      deleteIn(t) {
        let [n, ...i] = t;
        if (i.length === 0) return this.delete(n);
        let r = this.get(n, !0);
        if (Xe.isCollection(r)) return r.deleteIn(i);
        throw new Error(`Expected YAML collection at ${n}. Remaining path: ${i}`);
      }
      getIn(t, n) {
        let [i, ...r] = t,
          s = this.get(i, !0);
        return r.length === 0 ? (!n && Xe.isScalar(s) ? s.value : s) : Xe.isCollection(s) ? s.getIn(r, n) : void 0;
      }
      hasAllNullValues(t) {
        return this.items.every((n) => {
          if (!Xe.isPair(n)) return !1;
          let i = n.value;
          return i == null || (t && Xe.isScalar(i) && i.value == null && !i.commentBefore && !i.comment && !i.tag);
        });
      }
      hasIn(t) {
        let [n, ...i] = t;
        if (i.length === 0) return this.has(n);
        let r = this.get(n, !0);
        return Xe.isCollection(r) ? r.hasIn(i) : !1;
      }
      setIn(t, n) {
        let [i, ...r] = t;
        if (r.length === 0) this.set(i, n);
        else {
          let s = this.get(i, !0);
          if (Xe.isCollection(s)) s.setIn(r, n);
          else if (s === void 0 && this.schema) this.set(i, wo(this.schema, r, n));
          else throw new Error(`Expected YAML collection at ${i}. Remaining path: ${r}`);
        }
      }
    };
  ur.Collection = vo;
  ur.collectionFromPath = wo;
  ur.isEmptyPath = uu;
});
var Hn = A((mr) => {
  "use strict";
  var Cb = (e) => e.replace(/^(?!$)(?: $)?/gm, "#");
  function Po(e, t) {
    return /^\n+$/.test(e) ? e.substring(1) : t ? e.replace(/^(?! *$)/gm, t) : e;
  }
  var Db = (e, t, n) =>
    e.endsWith(`
`)
      ? Po(n, t)
      : n.includes(`
`)
        ? `
` + Po(n, t)
        : (e.endsWith(" ") ? "" : " ") + n;
  mr.indentComment = Po;
  mr.lineComment = Db;
  mr.stringifyComment = Cb;
});
var mu = A((Xn) => {
  "use strict";
  var jb = "flow",
    xo = "block",
    yr = "quoted";
  function Bb(
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
      f = r - t.length;
    typeof i == "number" && (i > r - Math.max(2, s) ? c.push(0) : (f = r - i));
    let m,
      y,
      p = !1,
      g = -1,
      I = -1,
      b = -1;
    n === xo && ((g = fu(e, g, t.length)), g !== -1 && (f = g + l));
    for (let w; (w = e[(g += 1)]);) {
      if (n === yr && w === "\\") {
        switch (((I = g), e[g + 1])) {
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
        b = g;
      }
      if (
        w ===
        `
`
      )
        (n === xo && (g = fu(e, g, t.length)), (f = g + t.length + l), (m = void 0));
      else {
        if (
          w === " " &&
          y &&
          y !== " " &&
          y !==
            `
` &&
          y !== "	"
        ) {
          let x = e[g + 1];
          x &&
            x !== " " &&
            x !==
              `
` &&
            x !== "	" &&
            (m = g);
        }
        if (g >= f)
          if (m) (c.push(m), (f = m + l), (m = void 0));
          else if (n === yr) {
            for (; y === " " || y === "	";) ((y = w), (w = e[(g += 1)]), (p = !0));
            let x = g > b + 1 ? g - 2 : I - 1;
            if (d[x]) return e;
            (c.push(x), (d[x] = !0), (f = x + l), (m = void 0));
          } else p = !0;
      }
      y = w;
    }
    if ((p && a && a(), c.length === 0)) return e;
    o && o();
    let E = e.slice(0, c[0]);
    for (let w = 0; w < c.length; ++w) {
      let x = c[w],
        R = c[w + 1] || e.length;
      x === 0
        ? (E = `
${t}${e.slice(0, R)}`)
        : (n === yr && d[x] && (E += `${e[x]}\\`),
          (E += `
${t}${e.slice(x + 1, R)}`));
    }
    return E;
  }
  function fu(e, t, n) {
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
  Xn.FOLD_BLOCK = xo;
  Xn.FOLD_FLOW = jb;
  Xn.FOLD_QUOTED = yr;
  Xn.foldFlowLines = Bb;
});
var Qn = A((yu) => {
  "use strict";
  var Ge = ee(),
    wt = mu(),
    gr = (e, t) => ({
      indentAtStart: t ? e.indent.length : e.indentAtStart,
      lineWidth: e.options.lineWidth,
      minContentWidth: e.options.minContentWidth,
    }),
    hr = (e) => /^(%|---|\.\.\.)/m.test(e);
  function Gb(e, t, n) {
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
  function Jn(e, t) {
    let n = JSON.stringify(e);
    if (t.options.doubleQuotedAsJSON) return n;
    let { implicitKey: i } = t,
      r = t.options.doubleQuotedMinMultiLineLength,
      s = t.indent || (hr(e) ? "  " : ""),
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
    return ((o = a ? o + n.slice(a) : n), i ? o : wt.foldFlowLines(o, s, wt.FOLD_QUOTED, gr(t, !1)));
  }
  function To(e, t) {
    if (
      t.options.singleQuote === !1 ||
      (t.implicitKey &&
        e.includes(`
`)) ||
      /[ \t]\n|\n[ \t]/.test(e)
    )
      return Jn(e, t);
    let n = t.indent || (hr(e) ? "  " : ""),
      i =
        "'" +
        e.replace(/'/g, "''").replace(
          /\n+/g,
          `$&
${n}`,
        ) +
        "'";
    return t.implicitKey ? i : wt.foldFlowLines(i, n, wt.FOLD_FLOW, gr(t, !1));
  }
  function cn(e, t) {
    let { singleQuote: n } = t.options,
      i;
    if (n === !1) i = Jn;
    else {
      let r = e.includes('"'),
        s = e.includes("'");
      r && !s ? (i = To) : s && !r ? (i = Jn) : (i = n ? To : Jn);
    }
    return i(e, t);
  }
  var No;
  try {
    No = new RegExp(
      `(^|(?<!
))
+(?!
|$)`,
      "g",
    );
  } catch {
    No = /\n+(?!\n|$)/g;
  }
  function pr({ comment: e, type: t, value: n }, i, r, s) {
    let { blockQuote: o, commentString: a, lineWidth: l } = i.options;
    if (!o || /\n[\t ]+$/.test(n)) return cn(n, i);
    let c = i.indent || (i.forceBlockIndent || hr(n) ? "  " : ""),
      d =
        o === "literal"
          ? !0
          : o === "folded" || t === Ge.Scalar.BLOCK_FOLDED
            ? !1
            : t === Ge.Scalar.BLOCK_LITERAL
              ? !0
              : !Gb(n, l, c.length);
    if (!n)
      return d
        ? `|
`
        : `>
`;
    let f, m;
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
    (p === -1 ? (f = "-") : n === y || p !== y.length - 1 ? ((f = "+"), s && s()) : (f = ""),
      y &&
        ((n = n.slice(0, -y.length)),
        y[y.length - 1] ===
          `
` && (y = y.slice(0, -1)),
        (y = y.replace(No, `$&${c}`))));
    let g = !1,
      I,
      b = -1;
    for (I = 0; I < n.length; ++I) {
      let R = n[I];
      if (R === " ") g = !0;
      else if (
        R ===
        `
`
      )
        b = I;
      else break;
    }
    let E = n.substring(0, b < I ? b + 1 : I);
    E && ((n = n.substring(E.length)), (E = E.replace(/\n+/g, `$&${c}`)));
    let x = (g ? (c ? "2" : "1") : "") + f;
    if ((e && ((x += " " + a(e.replace(/ ?[\r\n]+/g, " "))), r && r()), !d)) {
      let R = n
          .replace(
            /\n+/g,
            `
$&`,
          )
          .replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2")
          .replace(/\n+/g, `$&${c}`),
        v = !1,
        O = gr(i, !0);
      o !== "folded" &&
        t !== Ge.Scalar.BLOCK_FOLDED &&
        (O.onOverflow = () => {
          v = !0;
        });
      let N = wt.foldFlowLines(`${E}${R}${y}`, c, wt.FOLD_BLOCK, O);
      if (!v)
        return `>${x}
${c}${N}`;
    }
    return (
      (n = n.replace(/\n+/g, `$&${c}`)),
      `|${x}
${c}${E}${n}${y}`
    );
  }
  function Kb(e, t, n, i) {
    let { type: r, value: s } = e,
      { actualString: o, implicitKey: a, indent: l, indentStep: c, inFlow: d } = t;
    if (
      (a &&
        s.includes(`
`)) ||
      (d && /[[\]{},]/.test(s))
    )
      return cn(s, t);
    if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(s))
      return a ||
        d ||
        !s.includes(`
`)
        ? cn(s, t)
        : pr(e, t, n, i);
    if (
      !a &&
      !d &&
      r !== Ge.Scalar.PLAIN &&
      s.includes(`
`)
    )
      return pr(e, t, n, i);
    if (hr(s)) {
      if (l === "") return ((t.forceBlockIndent = !0), pr(e, t, n, i));
      if (a && l === c) return cn(s, t);
    }
    let f = s.replace(
      /\n+/g,
      `$&
${l}`,
    );
    if (o) {
      let m = (g) => g.default && g.tag !== "tag:yaml.org,2002:str" && g.test?.test(f),
        { compat: y, tags: p } = t.doc.schema;
      if (p.some(m) || y?.some(m)) return cn(s, t);
    }
    return a ? f : wt.foldFlowLines(f, l, wt.FOLD_FLOW, gr(t, !1));
  }
  function Yb(e, t, n, i) {
    let { implicitKey: r, inFlow: s } = t,
      o = typeof e.value == "string" ? e : Object.assign({}, e, { value: String(e.value) }),
      { type: a } = e;
    a !== Ge.Scalar.QUOTE_DOUBLE &&
      /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value) &&
      (a = Ge.Scalar.QUOTE_DOUBLE);
    let l = (d) => {
        switch (d) {
          case Ge.Scalar.BLOCK_FOLDED:
          case Ge.Scalar.BLOCK_LITERAL:
            return r || s ? cn(o.value, t) : pr(o, t, n, i);
          case Ge.Scalar.QUOTE_DOUBLE:
            return Jn(o.value, t);
          case Ge.Scalar.QUOTE_SINGLE:
            return To(o.value, t);
          case Ge.Scalar.PLAIN:
            return Kb(o, t, n, i);
          default:
            return null;
        }
      },
      c = l(a);
    if (c === null) {
      let { defaultKeyType: d, defaultStringType: f } = t.options,
        m = (r && d) || f;
      if (((c = l(m)), c === null)) throw new Error(`Unsupported default string type ${m}`);
    }
    return c;
  }
  yu.stringifyString = Yb;
});
var Zn = A((ko) => {
  "use strict";
  var $b = lr(),
    vt = G(),
    Wb = Hn(),
    Vb = Qn();
  function qb(e, t) {
    let n = Object.assign(
        {
          blockQuote: !0,
          commentString: Wb.stringifyComment,
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
  function zb(e, t) {
    if (t.tag) {
      let r = e.filter((s) => s.tag === t.tag);
      if (r.length > 0) return r.find((s) => s.format === t.format) ?? r[0];
    }
    let n, i;
    if (vt.isScalar(t)) {
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
  function Hb(e, t, { anchors: n, doc: i }) {
    if (!i.directives) return "";
    let r = [],
      s = (vt.isScalar(e) || vt.isCollection(e)) && e.anchor;
    s && $b.anchorIsValid(s) && (n.add(s), r.push(`&${s}`));
    let o = e.tag ?? (t.default ? null : t.tag);
    return (o && r.push(i.directives.tagString(o)), r.join(" "));
  }
  function Xb(e, t, n, i) {
    if (vt.isPair(e)) return e.toString(t, n, i);
    if (vt.isAlias(e)) {
      if (t.doc.directives) return e.toString(t);
      if (t.resolvedAliases?.has(e)) throw new TypeError("Cannot stringify circular structure without alias nodes");
      (t.resolvedAliases ? t.resolvedAliases.add(e) : (t.resolvedAliases = new Set([e])), (e = e.resolve(t.doc)));
    }
    let r,
      s = vt.isNode(e) ? e : t.doc.createNode(e, { onTagObj: (l) => (r = l) });
    r ?? (r = zb(t.doc.schema.tags, s));
    let o = Hb(s, r, t);
    o.length > 0 && (t.indentAtStart = (t.indentAtStart ?? 0) + o.length + 1);
    let a =
      typeof r.stringify == "function"
        ? r.stringify(s, t, n, i)
        : vt.isScalar(s)
          ? Vb.stringifyString(s, t, n, i)
          : s.toString(t, n, i);
    return o
      ? vt.isScalar(s) || a[0] === "{" || a[0] === "["
        ? `${o} ${a}`
        : `${o}
${t.indent}${a}`
      : a;
  }
  ko.createStringifyContext = qb;
  ko.stringify = Xb;
});
var Iu = A((hu) => {
  "use strict";
  var at = G(),
    pu = ee(),
    gu = Zn(),
    ei = Hn();
  function Jb({ key: e, value: t }, n, i, r) {
    let {
        allNullValues: s,
        doc: o,
        indent: a,
        indentStep: l,
        options: { commentString: c, indentSeq: d, simpleKeys: f },
      } = n,
      m = (at.isNode(e) && e.comment) || null;
    if (f) {
      if (m) throw new Error("With simple keys, key nodes cannot have comments");
      if (at.isCollection(e) || (!at.isNode(e) && typeof e == "object")) {
        let O = "With simple keys, collection cannot be used as a key value";
        throw new Error(O);
      }
    }
    let y =
      !f &&
      (!e ||
        (m && t == null && !n.inFlow) ||
        at.isCollection(e) ||
        (at.isScalar(e)
          ? e.type === pu.Scalar.BLOCK_FOLDED || e.type === pu.Scalar.BLOCK_LITERAL
          : typeof e == "object"));
    n = Object.assign({}, n, { allNullValues: !1, implicitKey: !y && (f || !s), indent: a + l });
    let p = !1,
      g = !1,
      I = gu.stringify(
        e,
        n,
        () => (p = !0),
        () => (g = !0),
      );
    if (!y && !n.inFlow && I.length > 1024) {
      if (f) throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
      y = !0;
    }
    if (n.inFlow) {
      if (s || t == null) return (p && i && i(), I === "" ? "?" : y ? `? ${I}` : I);
    } else if ((s && !f) || (t == null && y))
      return ((I = `? ${I}`), m && !p ? (I += ei.lineComment(I, n.indent, c(m))) : g && r && r(), I);
    (p && (m = null),
      y
        ? (m && (I += ei.lineComment(I, n.indent, c(m))),
          (I = `? ${I}
${a}:`))
        : ((I = `${I}:`), m && (I += ei.lineComment(I, n.indent, c(m)))));
    let b, E, w;
    (at.isNode(t)
      ? ((b = !!t.spaceBefore), (E = t.commentBefore), (w = t.comment))
      : ((b = !1), (E = null), (w = null), t && typeof t == "object" && (t = o.createNode(t))),
      (n.implicitKey = !1),
      !y && !m && at.isScalar(t) && (n.indentAtStart = I.length + 1),
      (g = !1),
      !d &&
        l.length >= 2 &&
        !n.inFlow &&
        !y &&
        at.isSeq(t) &&
        !t.flow &&
        !t.tag &&
        !t.anchor &&
        (n.indent = n.indent.substring(2)));
    let x = !1,
      R = gu.stringify(
        t,
        n,
        () => (x = !0),
        () => (g = !0),
      ),
      v = " ";
    if (m || b || E) {
      if (
        ((v = b
          ? `
`
          : ""),
        E)
      ) {
        let O = c(E);
        v += `
${ei.indentComment(O, n.indent)}`;
      }
      R === "" && !n.inFlow
        ? v ===
            `
` &&
          w &&
          (v = `

`)
        : (v += `
${n.indent}`);
    } else if (!y && at.isCollection(t)) {
      let O = R[0],
        N = R.indexOf(`
`),
        D = N !== -1,
        te = n.inFlow ?? t.flow ?? t.items.length === 0;
      if (D || !te) {
        let z = !1;
        if (D && (O === "&" || O === "!")) {
          let B = R.indexOf(" ");
          (O === "&" && B !== -1 && B < N && R[B + 1] === "!" && (B = R.indexOf(" ", B + 1)),
            (B === -1 || N < B) && (z = !0));
        }
        z ||
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
      (I += v + R),
      n.inFlow ? x && i && i() : w && !x ? (I += ei.lineComment(I, n.indent, c(w))) : g && r && r(),
      I
    );
  }
  hu.stringifyPair = Jb;
});
var Ao = A((Oo) => {
  "use strict";
  var bu = Ki("process");
  function Qb(e, ...t) {
    e === "debug" && console.log(...t);
  }
  function Zb(e, t) {
    (e === "debug" || e === "warn") && (typeof bu.emitWarning == "function" ? bu.emitWarning(t) : console.warn(t));
  }
  Oo.debug = Qb;
  Oo.warn = Zb;
});
var Sr = A((_r) => {
  "use strict";
  var Er = G(),
    Eu = ee(),
    Ir = "<<",
    br = {
      identify: (e) => e === Ir || (typeof e == "symbol" && e.description === Ir),
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Eu.Scalar(Symbol(Ir)), { addToJSMap: _u }),
      stringify: () => Ir,
    },
    eE = (e, t) =>
      (br.identify(t) || (Er.isScalar(t) && (!t.type || t.type === Eu.Scalar.PLAIN) && br.identify(t.value))) &&
      e?.doc.schema.tags.some((n) => n.tag === br.tag && n.default);
  function _u(e, t, n) {
    let i = Su(e, n);
    if (Er.isSeq(i)) for (let r of i.items) Uo(e, t, r);
    else if (Array.isArray(i)) for (let r of i) Uo(e, t, r);
    else Uo(e, t, i);
  }
  function Uo(e, t, n) {
    let i = Su(e, n);
    if (!Er.isMap(i)) throw new Error("Merge sources must be maps or map aliases");
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
  function Su(e, t) {
    return e && Er.isAlias(t) ? t.resolve(e.doc, e) : t;
  }
  _r.addMergeToJSMap = _u;
  _r.isMergeKey = eE;
  _r.merge = br;
});
var Mo = A((vu) => {
  "use strict";
  var tE = Ao(),
    Ru = Sr(),
    nE = Zn(),
    wu = G(),
    Lo = St();
  function iE(e, t, { key: n, value: i }) {
    if (wu.isNode(n) && n.addToJSMap) n.addToJSMap(e, t, i);
    else if (Ru.isMergeKey(e, n)) Ru.addMergeToJSMap(e, t, i);
    else {
      let r = Lo.toJS(n, "", e);
      if (t instanceof Map) t.set(r, Lo.toJS(i, r, e));
      else if (t instanceof Set) t.add(r);
      else {
        let s = rE(n, r, e),
          o = Lo.toJS(i, s, e);
        s in t ? Object.defineProperty(t, s, { value: o, writable: !0, enumerable: !0, configurable: !0 }) : (t[s] = o);
      }
    }
    return t;
  }
  function rE(e, t, n) {
    if (t === null) return "";
    if (typeof t != "object") return String(t);
    if (wu.isNode(e) && n?.doc) {
      let i = nE.createStringifyContext(n.doc, {});
      i.anchors = new Set();
      for (let s of n.anchors.keys()) i.anchors.add(s.anchor);
      ((i.inFlow = !0), (i.inStringifyKey = !0));
      let r = e.toString(i);
      if (!n.mapKeyWarned) {
        let s = JSON.stringify(r);
        (s.length > 40 && (s = s.substring(0, 36) + '..."'),
          tE.warn(
            n.doc.options.logLevel,
            `Keys with collection values will be stringified due to JS Object restrictions: ${s}. Set mapAsMap: true to use object keys.`,
          ),
          (n.mapKeyWarned = !0));
      }
      return r;
    }
    return JSON.stringify(t);
  }
  vu.addPairToJSMap = iE;
});
var Pt = A((Fo) => {
  "use strict";
  var Pu = zn(),
    sE = Iu(),
    oE = Mo(),
    Rr = G();
  function aE(e, t, n) {
    let i = Pu.createNode(e, void 0, n),
      r = Pu.createNode(t, void 0, n);
    return new wr(i, r);
  }
  var wr = class e {
    constructor(t, n = null) {
      (Object.defineProperty(this, Rr.NODE_TYPE, { value: Rr.PAIR }), (this.key = t), (this.value = n));
    }
    clone(t) {
      let { key: n, value: i } = this;
      return (Rr.isNode(n) && (n = n.clone(t)), Rr.isNode(i) && (i = i.clone(t)), new e(n, i));
    }
    toJSON(t, n) {
      let i = n?.mapAsMap ? new Map() : {};
      return oE.addPairToJSMap(n, i, this);
    }
    toString(t, n, i) {
      return t?.doc ? sE.stringifyPair(this, t, n, i) : JSON.stringify(this);
    }
  };
  Fo.Pair = wr;
  Fo.createPair = aE;
});
var Co = A((Tu) => {
  "use strict";
  var Bt = G(),
    xu = Zn(),
    vr = Hn();
  function lE(e, t, n) {
    return ((t.inFlow ?? e.flow) ? dE : cE)(e, t, n);
  }
  function cE(
    { comment: e, items: t },
    n,
    { blockItemPrefix: i, flowChars: r, itemIndent: s, onChompKeep: o, onComment: a },
  ) {
    let {
        indent: l,
        options: { commentString: c },
      } = n,
      d = Object.assign({}, n, { indent: s, type: null }),
      f = !1,
      m = [];
    for (let p = 0; p < t.length; ++p) {
      let g = t[p],
        I = null;
      if (Bt.isNode(g)) (!f && g.spaceBefore && m.push(""), Pr(n, m, g.commentBefore, f), g.comment && (I = g.comment));
      else if (Bt.isPair(g)) {
        let E = Bt.isNode(g.key) ? g.key : null;
        E && (!f && E.spaceBefore && m.push(""), Pr(n, m, E.commentBefore, f));
      }
      f = !1;
      let b = xu.stringify(
        g,
        d,
        () => (I = null),
        () => (f = !0),
      );
      (I && (b += vr.lineComment(b, s, c(I))), f && I && (f = !1), m.push(i + b));
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
` + vr.indentComment(c(e), l)),
          a && a())
        : f && o && o(),
      y
    );
  }
  function dE({ items: e }, t, { flowChars: n, itemIndent: i }) {
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
      f = [];
    for (let p = 0; p < e.length; ++p) {
      let g = e[p],
        I = null;
      if (Bt.isNode(g)) (g.spaceBefore && f.push(""), Pr(t, f, g.commentBefore, !1), g.comment && (I = g.comment));
      else if (Bt.isPair(g)) {
        let E = Bt.isNode(g.key) ? g.key : null;
        E && (E.spaceBefore && f.push(""), Pr(t, f, E.commentBefore, !1), E.comment && (c = !0));
        let w = Bt.isNode(g.value) ? g.value : null;
        w
          ? (w.comment && (I = w.comment), w.commentBefore && (c = !0))
          : g.value == null && E?.comment && (I = E.comment);
      }
      I && (c = !0);
      let b = xu.stringify(g, l, () => (I = null));
      (c ||
        (c =
          f.length > d ||
          b.includes(`
`)),
        p < e.length - 1
          ? (b += ",")
          : t.options.trailingComma &&
            (t.options.lineWidth > 0 &&
              (c || (c = f.reduce((E, w) => E + w.length + 2, 2) + (b.length + 2) > t.options.lineWidth)),
            c && (b += ",")),
        I && (b += vr.lineComment(b, i, a(I))),
        f.push(b),
        (d = f.length));
    }
    let { start: m, end: y } = n;
    if (f.length === 0) return m + y;
    if (!c) {
      let p = f.reduce((g, I) => g + I.length + 2, 2);
      c = t.options.lineWidth > 0 && p > t.options.lineWidth;
    }
    if (c) {
      let p = m;
      for (let g of f)
        p += g
          ? `
${s}${r}${g}`
          : `
`;
      return `${p}
${r}${y}`;
    } else return `${m}${o}${f.join(" ")}${o}${y}`;
  }
  function Pr({ indent: e, options: { commentString: t } }, n, i, r) {
    if ((i && r && (i = i.replace(/^\n+/, "")), i)) {
      let s = vr.indentComment(t(i), e);
      n.push(s.trimStart());
    }
  }
  Tu.stringifyCollection = lE;
});
var Tt = A((jo) => {
  "use strict";
  var uE = Co(),
    fE = Mo(),
    mE = fr(),
    xt = G(),
    xr = Pt(),
    yE = ee();
  function ti(e, t) {
    let n = xt.isScalar(t) ? t.value : t;
    for (let i of e)
      if (xt.isPair(i) && (i.key === t || i.key === n || (xt.isScalar(i.key) && i.key.value === n))) return i;
  }
  var Do = class extends mE.Collection {
    static get tagName() {
      return "tag:yaml.org,2002:map";
    }
    constructor(t) {
      (super(xt.MAP, t), (this.items = []));
    }
    static from(t, n, i) {
      let { keepUndefined: r, replacer: s } = i,
        o = new this(t),
        a = (l, c) => {
          if (typeof s == "function") c = s.call(n, l, c);
          else if (Array.isArray(s) && !s.includes(l)) return;
          (c !== void 0 || r) && o.items.push(xr.createPair(l, c, i));
        };
      if (n instanceof Map) for (let [l, c] of n) a(l, c);
      else if (n && typeof n == "object") for (let l of Object.keys(n)) a(l, n[l]);
      return (typeof t.sortMapEntries == "function" && o.items.sort(t.sortMapEntries), o);
    }
    add(t, n) {
      let i;
      xt.isPair(t)
        ? (i = t)
        : !t || typeof t != "object" || !("key" in t)
          ? (i = new xr.Pair(t, t?.value))
          : (i = new xr.Pair(t.key, t.value));
      let r = ti(this.items, i.key),
        s = this.schema?.sortMapEntries;
      if (r) {
        if (!n) throw new Error(`Key ${i.key} already set`);
        xt.isScalar(r.value) && yE.isScalarValue(i.value) ? (r.value.value = i.value) : (r.value = i.value);
      } else if (s) {
        let o = this.items.findIndex((a) => s(i, a) < 0);
        o === -1 ? this.items.push(i) : this.items.splice(o, 0, i);
      } else this.items.push(i);
    }
    delete(t) {
      let n = ti(this.items, t);
      return n ? this.items.splice(this.items.indexOf(n), 1).length > 0 : !1;
    }
    get(t, n) {
      let r = ti(this.items, t)?.value;
      return (!n && xt.isScalar(r) ? r.value : r) ?? void 0;
    }
    has(t) {
      return !!ti(this.items, t);
    }
    set(t, n) {
      this.add(new xr.Pair(t, n), !0);
    }
    toJSON(t, n, i) {
      let r = i ? new i() : n?.mapAsMap ? new Map() : {};
      n?.onCreate && n.onCreate(r);
      for (let s of this.items) fE.addPairToJSMap(n, r, s);
      return r;
    }
    toString(t, n, i) {
      if (!t) return JSON.stringify(this);
      for (let r of this.items)
        if (!xt.isPair(r)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(r)} instead`);
      return (
        !t.allNullValues && this.hasAllNullValues(!1) && (t = Object.assign({}, t, { allNullValues: !0 })),
        uE.stringifyCollection(this, t, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: t.indent || "",
          onChompKeep: i,
          onComment: n,
        })
      );
    }
  };
  jo.YAMLMap = Do;
  jo.findPair = ti;
});
var dn = A((ku) => {
  "use strict";
  var pE = G(),
    Nu = Tt(),
    gE = {
      collection: "map",
      default: !0,
      nodeClass: Nu.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(e, t) {
        return (pE.isMap(e) || t("Expected a mapping for this tag"), e);
      },
      createNode: (e, t, n) => Nu.YAMLMap.from(e, t, n),
    };
  ku.map = gE;
});
var Nt = A((Ou) => {
  "use strict";
  var hE = zn(),
    IE = Co(),
    bE = fr(),
    Nr = G(),
    EE = ee(),
    _E = St(),
    Bo = class extends bE.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(t) {
        (super(Nr.SEQ, t), (this.items = []));
      }
      add(t) {
        this.items.push(t);
      }
      delete(t) {
        let n = Tr(t);
        return typeof n != "number" ? !1 : this.items.splice(n, 1).length > 0;
      }
      get(t, n) {
        let i = Tr(t);
        if (typeof i != "number") return;
        let r = this.items[i];
        return !n && Nr.isScalar(r) ? r.value : r;
      }
      has(t) {
        let n = Tr(t);
        return typeof n == "number" && n < this.items.length;
      }
      set(t, n) {
        let i = Tr(t);
        if (typeof i != "number") throw new Error(`Expected a valid index, not ${t}.`);
        let r = this.items[i];
        Nr.isScalar(r) && EE.isScalarValue(n) ? (r.value = n) : (this.items[i] = n);
      }
      toJSON(t, n) {
        let i = [];
        n?.onCreate && n.onCreate(i);
        let r = 0;
        for (let s of this.items) i.push(_E.toJS(s, String(r++), n));
        return i;
      }
      toString(t, n, i) {
        return t
          ? IE.stringifyCollection(this, t, {
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
            s.items.push(hE.createNode(a, void 0, i));
          }
        }
        return s;
      }
    };
  function Tr(e) {
    let t = Nr.isScalar(e) ? e.value : e;
    return (
      t && typeof t == "string" && (t = Number(t)),
      typeof t == "number" && Number.isInteger(t) && t >= 0 ? t : null
    );
  }
  Ou.YAMLSeq = Bo;
});
var un = A((Uu) => {
  "use strict";
  var SE = G(),
    Au = Nt(),
    RE = {
      collection: "seq",
      default: !0,
      nodeClass: Au.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(e, t) {
        return (SE.isSeq(e) || t("Expected a sequence for this tag"), e);
      },
      createNode: (e, t, n) => Au.YAMLSeq.from(e, t, n),
    };
  Uu.seq = RE;
});
var ni = A((Lu) => {
  "use strict";
  var wE = Qn(),
    vE = {
      identify: (e) => typeof e == "string",
      default: !0,
      tag: "tag:yaml.org,2002:str",
      resolve: (e) => e,
      stringify(e, t, n, i) {
        return ((t = Object.assign({ actualString: !0 }, t)), wE.stringifyString(e, t, n, i));
      },
    };
  Lu.string = vE;
});
var kr = A((Cu) => {
  "use strict";
  var Mu = ee(),
    Fu = {
      identify: (e) => e == null,
      createNode: () => new Mu.Scalar(null),
      default: !0,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Mu.Scalar(null),
      stringify: ({ source: e }, t) => (typeof e == "string" && Fu.test.test(e) ? e : t.options.nullStr),
    };
  Cu.nullTag = Fu;
});
var Go = A((ju) => {
  "use strict";
  var PE = ee(),
    Du = {
      identify: (e) => typeof e == "boolean",
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (e) => new PE.Scalar(e[0] === "t" || e[0] === "T"),
      stringify({ source: e, value: t }, n) {
        if (e && Du.test.test(e)) {
          let i = e[0] === "t" || e[0] === "T";
          if (t === i) return e;
        }
        return t ? n.options.trueStr : n.options.falseStr;
      },
    };
  ju.boolTag = Du;
});
var fn = A((Bu) => {
  "use strict";
  function xE({ format: e, minFractionDigits: t, tag: n, value: i }) {
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
  Bu.stringifyNumber = xE;
});
var Yo = A((Or) => {
  "use strict";
  var TE = ee(),
    Ko = fn(),
    NE = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (e) =>
        e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: Ko.stringifyNumber,
    },
    kE = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (e) => parseFloat(e),
      stringify(e) {
        let t = Number(e.value);
        return isFinite(t) ? t.toExponential() : Ko.stringifyNumber(e);
      },
    },
    OE = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(e) {
        let t = new TE.Scalar(parseFloat(e)),
          n = e.indexOf(".");
        return (n !== -1 && e[e.length - 1] === "0" && (t.minFractionDigits = e.length - n - 1), t);
      },
      stringify: Ko.stringifyNumber,
    };
  Or.float = OE;
  Or.floatExp = kE;
  Or.floatNaN = NE;
});
var Wo = A((Ur) => {
  "use strict";
  var Gu = fn(),
    Ar = (e) => typeof e == "bigint" || Number.isInteger(e),
    $o = (e, t, n, { intAsBigInt: i }) => (i ? BigInt(e) : parseInt(e.substring(t), n));
  function Ku(e, t, n) {
    let { value: i } = e;
    return Ar(i) && i >= 0 ? n + i.toString(t) : Gu.stringifyNumber(e);
  }
  var AE = {
      identify: (e) => Ar(e) && e >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (e, t, n) => $o(e, 2, 8, n),
      stringify: (e) => Ku(e, 8, "0o"),
    },
    UE = {
      identify: Ar,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (e, t, n) => $o(e, 0, 10, n),
      stringify: Gu.stringifyNumber,
    },
    LE = {
      identify: (e) => Ar(e) && e >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (e, t, n) => $o(e, 2, 16, n),
      stringify: (e) => Ku(e, 16, "0x"),
    };
  Ur.int = UE;
  Ur.intHex = LE;
  Ur.intOct = AE;
});
var $u = A((Yu) => {
  "use strict";
  var ME = dn(),
    FE = kr(),
    CE = un(),
    DE = ni(),
    jE = Go(),
    Vo = Yo(),
    qo = Wo(),
    BE = [
      ME.map,
      CE.seq,
      DE.string,
      FE.nullTag,
      jE.boolTag,
      qo.intOct,
      qo.int,
      qo.intHex,
      Vo.floatNaN,
      Vo.floatExp,
      Vo.float,
    ];
  Yu.schema = BE;
});
var qu = A((Vu) => {
  "use strict";
  var GE = ee(),
    KE = dn(),
    YE = un();
  function Wu(e) {
    return typeof e == "bigint" || Number.isInteger(e);
  }
  var Lr = ({ value: e }) => JSON.stringify(e),
    $E = [
      {
        identify: (e) => typeof e == "string",
        default: !0,
        tag: "tag:yaml.org,2002:str",
        resolve: (e) => e,
        stringify: Lr,
      },
      {
        identify: (e) => e == null,
        createNode: () => new GE.Scalar(null),
        default: !0,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: Lr,
      },
      {
        identify: (e) => typeof e == "boolean",
        default: !0,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (e) => e === "true",
        stringify: Lr,
      },
      {
        identify: Wu,
        default: !0,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (e, t, { intAsBigInt: n }) => (n ? BigInt(e) : parseInt(e, 10)),
        stringify: ({ value: e }) => (Wu(e) ? e.toString() : JSON.stringify(e)),
      },
      {
        identify: (e) => typeof e == "number",
        default: !0,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (e) => parseFloat(e),
        stringify: Lr,
      },
    ],
    WE = {
      default: !0,
      tag: "",
      test: /^/,
      resolve(e, t) {
        return (t(`Unresolved plain scalar ${JSON.stringify(e)}`), e);
      },
    },
    VE = [KE.map, YE.seq].concat($E, WE);
  Vu.schema = VE;
});
var Ho = A((zu) => {
  "use strict";
  var ii = Ki("buffer"),
    zo = ee(),
    qE = Qn(),
    zE = {
      identify: (e) => e instanceof Uint8Array,
      default: !1,
      tag: "tag:yaml.org,2002:binary",
      resolve(e, t) {
        if (typeof ii.Buffer == "function") return ii.Buffer.from(e, "base64");
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
        if (typeof ii.Buffer == "function")
          a = o instanceof ii.Buffer ? o.toString("base64") : ii.Buffer.from(o.buffer).toString("base64");
        else if (typeof btoa == "function") {
          let l = "";
          for (let c = 0; c < o.length; ++c) l += String.fromCharCode(o[c]);
          a = btoa(l);
        } else
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        if ((t ?? (t = zo.Scalar.BLOCK_LITERAL), t !== zo.Scalar.QUOTE_DOUBLE)) {
          let l = Math.max(i.options.lineWidth - i.indent.length, i.options.minContentWidth),
            c = Math.ceil(a.length / l),
            d = new Array(c);
          for (let f = 0, m = 0; f < c; ++f, m += l) d[f] = a.substr(m, l);
          a = d.join(
            t === zo.Scalar.BLOCK_LITERAL
              ? `
`
              : " ",
          );
        }
        return qE.stringifyString({ comment: e, type: t, value: a }, i, r, s);
      },
    };
  zu.binary = zE;
});
var Cr = A((Fr) => {
  "use strict";
  var Mr = G(),
    Xo = Pt(),
    HE = ee(),
    XE = Nt();
  function Hu(e, t) {
    if (Mr.isSeq(e))
      for (let n = 0; n < e.items.length; ++n) {
        let i = e.items[n];
        if (!Mr.isPair(i)) {
          if (Mr.isMap(i)) {
            i.items.length > 1 && t("Each pair must have its own sequence indicator");
            let r = i.items[0] || new Xo.Pair(new HE.Scalar(null));
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
          e.items[n] = Mr.isPair(i) ? i : new Xo.Pair(i);
        }
      }
    else t("Expected a sequence for this tag");
    return e;
  }
  function Xu(e, t, n) {
    let { replacer: i } = n,
      r = new XE.YAMLSeq(e);
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
        r.items.push(Xo.createPair(a, l, n));
      }
    return r;
  }
  var JE = { collection: "seq", default: !1, tag: "tag:yaml.org,2002:pairs", resolve: Hu, createNode: Xu };
  Fr.createPairs = Xu;
  Fr.pairs = JE;
  Fr.resolvePairs = Hu;
});
var Zo = A((Qo) => {
  "use strict";
  var Ju = G(),
    Jo = St(),
    ri = Tt(),
    QE = Nt(),
    Qu = Cr(),
    Gt = class e extends QE.YAMLSeq {
      constructor() {
        (super(),
          (this.add = ri.YAMLMap.prototype.add.bind(this)),
          (this.delete = ri.YAMLMap.prototype.delete.bind(this)),
          (this.get = ri.YAMLMap.prototype.get.bind(this)),
          (this.has = ri.YAMLMap.prototype.has.bind(this)),
          (this.set = ri.YAMLMap.prototype.set.bind(this)),
          (this.tag = e.tag));
      }
      toJSON(t, n) {
        if (!n) return super.toJSON(t);
        let i = new Map();
        n?.onCreate && n.onCreate(i);
        for (let r of this.items) {
          let s, o;
          if (
            (Ju.isPair(r) ? ((s = Jo.toJS(r.key, "", n)), (o = Jo.toJS(r.value, s, n))) : (s = Jo.toJS(r, "", n)),
            i.has(s))
          )
            throw new Error("Ordered maps must not include duplicate keys");
          i.set(s, o);
        }
        return i;
      }
      static from(t, n, i) {
        let r = Qu.createPairs(t, n, i),
          s = new this();
        return ((s.items = r.items), s);
      }
    };
  Gt.tag = "tag:yaml.org,2002:omap";
  var ZE = {
    collection: "seq",
    identify: (e) => e instanceof Map,
    nodeClass: Gt,
    default: !1,
    tag: "tag:yaml.org,2002:omap",
    resolve(e, t) {
      let n = Qu.resolvePairs(e, t),
        i = [];
      for (let { key: r } of n.items)
        Ju.isScalar(r) &&
          (i.includes(r.value) ? t(`Ordered maps must not include duplicate keys: ${r.value}`) : i.push(r.value));
      return Object.assign(new Gt(), n);
    },
    createNode: (e, t, n) => Gt.from(e, t, n),
  };
  Qo.YAMLOMap = Gt;
  Qo.omap = ZE;
});
var rf = A((ea) => {
  "use strict";
  var Zu = ee();
  function ef({ value: e, source: t }, n) {
    return t && (e ? tf : nf).test.test(t) ? t : e ? n.options.trueStr : n.options.falseStr;
  }
  var tf = {
      identify: (e) => e === !0,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Zu.Scalar(!0),
      stringify: ef,
    },
    nf = {
      identify: (e) => e === !1,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Zu.Scalar(!1),
      stringify: ef,
    };
  ea.falseTag = nf;
  ea.trueTag = tf;
});
var sf = A((Dr) => {
  "use strict";
  var e_ = ee(),
    ta = fn(),
    t_ = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (e) =>
        e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: ta.stringifyNumber,
    },
    n_ = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (e) => parseFloat(e.replace(/_/g, "")),
      stringify(e) {
        let t = Number(e.value);
        return isFinite(t) ? t.toExponential() : ta.stringifyNumber(e);
      },
    },
    i_ = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(e) {
        let t = new e_.Scalar(parseFloat(e.replace(/_/g, ""))),
          n = e.indexOf(".");
        if (n !== -1) {
          let i = e.substring(n + 1).replace(/_/g, "");
          i[i.length - 1] === "0" && (t.minFractionDigits = i.length);
        }
        return t;
      },
      stringify: ta.stringifyNumber,
    };
  Dr.float = i_;
  Dr.floatExp = n_;
  Dr.floatNaN = t_;
});
var af = A((oi) => {
  "use strict";
  var of = fn(),
    si = (e) => typeof e == "bigint" || Number.isInteger(e);
  function jr(e, t, n, { intAsBigInt: i }) {
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
  function na(e, t, n) {
    let { value: i } = e;
    if (si(i)) {
      let r = i.toString(t);
      return i < 0 ? "-" + n + r.substr(1) : n + r;
    }
    return of.stringifyNumber(e);
  }
  var r_ = {
      identify: si,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (e, t, n) => jr(e, 2, 2, n),
      stringify: (e) => na(e, 2, "0b"),
    },
    s_ = {
      identify: si,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (e, t, n) => jr(e, 1, 8, n),
      stringify: (e) => na(e, 8, "0"),
    },
    o_ = {
      identify: si,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (e, t, n) => jr(e, 0, 10, n),
      stringify: of.stringifyNumber,
    },
    a_ = {
      identify: si,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (e, t, n) => jr(e, 2, 16, n),
      stringify: (e) => na(e, 16, "0x"),
    };
  oi.int = o_;
  oi.intBin = r_;
  oi.intHex = a_;
  oi.intOct = s_;
});
var ra = A((ia) => {
  "use strict";
  var Kr = G(),
    Br = Pt(),
    Gr = Tt(),
    Kt = class e extends Gr.YAMLMap {
      constructor(t) {
        (super(t), (this.tag = e.tag));
      }
      add(t) {
        let n;
        (Kr.isPair(t)
          ? (n = t)
          : t && typeof t == "object" && "key" in t && "value" in t && t.value === null
            ? (n = new Br.Pair(t.key, null))
            : (n = new Br.Pair(t, null)),
          Gr.findPair(this.items, n.key) || this.items.push(n));
      }
      get(t, n) {
        let i = Gr.findPair(this.items, t);
        return !n && Kr.isPair(i) ? (Kr.isScalar(i.key) ? i.key.value : i.key) : i;
      }
      set(t, n) {
        if (typeof n != "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof n}`);
        let i = Gr.findPair(this.items, t);
        i && !n ? this.items.splice(this.items.indexOf(i), 1) : !i && n && this.items.push(new Br.Pair(t));
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
          for (let o of n) (typeof r == "function" && (o = r.call(n, o, o)), s.items.push(Br.createPair(o, null, i)));
        return s;
      }
    };
  Kt.tag = "tag:yaml.org,2002:set";
  var l_ = {
    collection: "map",
    identify: (e) => e instanceof Set,
    nodeClass: Kt,
    default: !1,
    tag: "tag:yaml.org,2002:set",
    createNode: (e, t, n) => Kt.from(e, t, n),
    resolve(e, t) {
      if (Kr.isMap(e)) {
        if (e.hasAllNullValues(!0)) return Object.assign(new Kt(), e);
        t("Set items must all have null values");
      } else t("Expected a mapping for this tag");
      return e;
    },
  };
  ia.YAMLSet = Kt;
  ia.set = l_;
});
var oa = A((Yr) => {
  "use strict";
  var c_ = fn();
  function sa(e, t) {
    let n = e[0],
      i = n === "-" || n === "+" ? e.substring(1) : e,
      r = (o) => (t ? BigInt(o) : Number(o)),
      s = i
        .replace(/_/g, "")
        .split(":")
        .reduce((o, a) => o * r(60) + r(a), r(0));
    return n === "-" ? r(-1) * s : s;
  }
  function lf(e) {
    let { value: t } = e,
      n = (o) => o;
    if (typeof t == "bigint") n = (o) => BigInt(o);
    else if (isNaN(t) || !isFinite(t)) return c_.stringifyNumber(e);
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
  var d_ = {
      identify: (e) => typeof e == "bigint" || Number.isInteger(e),
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (e, t, { intAsBigInt: n }) => sa(e, n),
      stringify: lf,
    },
    u_ = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (e) => sa(e, !1),
      stringify: lf,
    },
    cf = {
      identify: (e) => e instanceof Date,
      default: !0,
      tag: "tag:yaml.org,2002:timestamp",
      test: RegExp(
        "^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$",
      ),
      resolve(e) {
        let t = e.match(cf.test);
        if (!t) throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        let [, n, i, r, s, o, a] = t.map(Number),
          l = t[7] ? Number((t[7] + "00").substr(1, 3)) : 0,
          c = Date.UTC(n, i - 1, r, s || 0, o || 0, a || 0, l),
          d = t[8];
        if (d && d !== "Z") {
          let f = sa(d, !1);
          (Math.abs(f) < 30 && (f *= 60), (c -= 6e4 * f));
        }
        return new Date(c);
      },
      stringify: ({ value: e }) => e?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? "",
    };
  Yr.floatTime = u_;
  Yr.intTime = d_;
  Yr.timestamp = cf;
});
var ff = A((uf) => {
  "use strict";
  var f_ = dn(),
    m_ = kr(),
    y_ = un(),
    p_ = ni(),
    g_ = Ho(),
    df = rf(),
    aa = sf(),
    $r = af(),
    h_ = Sr(),
    I_ = Zo(),
    b_ = Cr(),
    E_ = ra(),
    la = oa(),
    __ = [
      f_.map,
      y_.seq,
      p_.string,
      m_.nullTag,
      df.trueTag,
      df.falseTag,
      $r.intBin,
      $r.intOct,
      $r.int,
      $r.intHex,
      aa.floatNaN,
      aa.floatExp,
      aa.float,
      g_.binary,
      h_.merge,
      I_.omap,
      b_.pairs,
      E_.set,
      la.intTime,
      la.floatTime,
      la.timestamp,
    ];
  uf.schema = __;
});
var Sf = A((ua) => {
  "use strict";
  var gf = dn(),
    S_ = kr(),
    hf = un(),
    R_ = ni(),
    w_ = Go(),
    ca = Yo(),
    da = Wo(),
    v_ = $u(),
    P_ = qu(),
    If = Ho(),
    ai = Sr(),
    bf = Zo(),
    Ef = Cr(),
    mf = ff(),
    _f = ra(),
    Wr = oa(),
    yf = new Map([
      ["core", v_.schema],
      ["failsafe", [gf.map, hf.seq, R_.string]],
      ["json", P_.schema],
      ["yaml11", mf.schema],
      ["yaml-1.1", mf.schema],
    ]),
    pf = {
      binary: If.binary,
      bool: w_.boolTag,
      float: ca.float,
      floatExp: ca.floatExp,
      floatNaN: ca.floatNaN,
      floatTime: Wr.floatTime,
      int: da.int,
      intHex: da.intHex,
      intOct: da.intOct,
      intTime: Wr.intTime,
      map: gf.map,
      merge: ai.merge,
      null: S_.nullTag,
      omap: bf.omap,
      pairs: Ef.pairs,
      seq: hf.seq,
      set: _f.set,
      timestamp: Wr.timestamp,
    },
    x_ = {
      "tag:yaml.org,2002:binary": If.binary,
      "tag:yaml.org,2002:merge": ai.merge,
      "tag:yaml.org,2002:omap": bf.omap,
      "tag:yaml.org,2002:pairs": Ef.pairs,
      "tag:yaml.org,2002:set": _f.set,
      "tag:yaml.org,2002:timestamp": Wr.timestamp,
    };
  function T_(e, t, n) {
    let i = yf.get(t);
    if (i && !e) return n && !i.includes(ai.merge) ? i.concat(ai.merge) : i.slice();
    let r = i;
    if (!r)
      if (Array.isArray(e)) r = [];
      else {
        let s = Array.from(yf.keys())
          .filter((o) => o !== "yaml11")
          .map((o) => JSON.stringify(o))
          .join(", ");
        throw new Error(`Unknown schema "${t}"; use one of ${s} or define customTags array`);
      }
    if (Array.isArray(e)) for (let s of e) r = r.concat(s);
    else typeof e == "function" && (r = e(r.slice()));
    return (
      n && (r = r.concat(ai.merge)),
      r.reduce((s, o) => {
        let a = typeof o == "string" ? pf[o] : o;
        if (!a) {
          let l = JSON.stringify(o),
            c = Object.keys(pf)
              .map((d) => JSON.stringify(d))
              .join(", ");
          throw new Error(`Unknown custom tag ${l}; use one of ${c}`);
        }
        return (s.includes(a) || s.push(a), s);
      }, [])
    );
  }
  ua.coreKnownTags = x_;
  ua.getTags = T_;
});
var ya = A((Rf) => {
  "use strict";
  var fa = G(),
    N_ = dn(),
    k_ = un(),
    O_ = ni(),
    Vr = Sf(),
    A_ = (e, t) => (e.key < t.key ? -1 : e.key > t.key ? 1 : 0),
    ma = class e {
      constructor({
        compat: t,
        customTags: n,
        merge: i,
        resolveKnownTags: r,
        schema: s,
        sortMapEntries: o,
        toStringDefaults: a,
      }) {
        ((this.compat = Array.isArray(t) ? Vr.getTags(t, "compat") : t ? Vr.getTags(null, t) : null),
          (this.name = (typeof s == "string" && s) || "core"),
          (this.knownTags = r ? Vr.coreKnownTags : {}),
          (this.tags = Vr.getTags(n, this.name, i)),
          (this.toStringOptions = a ?? null),
          Object.defineProperty(this, fa.MAP, { value: N_.map }),
          Object.defineProperty(this, fa.SCALAR, { value: O_.string }),
          Object.defineProperty(this, fa.SEQ, { value: k_.seq }),
          (this.sortMapEntries = typeof o == "function" ? o : o === !0 ? A_ : null));
      }
      clone() {
        let t = Object.create(e.prototype, Object.getOwnPropertyDescriptors(this));
        return ((t.tags = this.tags.slice()), t);
      }
    };
  Rf.Schema = ma;
});
var vf = A((wf) => {
  "use strict";
  var U_ = G(),
    pa = Zn(),
    li = Hn();
  function L_(e, t) {
    let n = [],
      i = t.directives === !0;
    if (t.directives !== !1 && e.directives) {
      let l = e.directives.toString(e);
      l ? (n.push(l), (i = !0)) : e.directives.docStart && (i = !0);
    }
    i && n.push("---");
    let r = pa.createStringifyContext(e, t),
      { commentString: s } = r.options;
    if (e.commentBefore) {
      n.length !== 1 && n.unshift("");
      let l = s(e.commentBefore);
      n.unshift(li.indentComment(l, ""));
    }
    let o = !1,
      a = null;
    if (e.contents) {
      if (U_.isNode(e.contents)) {
        if ((e.contents.spaceBefore && i && n.push(""), e.contents.commentBefore)) {
          let d = s(e.contents.commentBefore);
          n.push(li.indentComment(d, ""));
        }
        ((r.forceBlockIndent = !!e.comment), (a = e.contents.comment));
      }
      let l = a ? void 0 : () => (o = !0),
        c = pa.stringify(e.contents, r, () => (a = null), l);
      (a && (c += li.lineComment(c, "", s(a))),
        (c[0] === "|" || c[0] === ">") && n[n.length - 1] === "---" ? (n[n.length - 1] = `--- ${c}`) : n.push(c));
    } else n.push(pa.stringify(e.contents, r));
    if (e.directives?.docEnd)
      if (e.comment) {
        let l = s(e.comment);
        l.includes(`
`)
          ? (n.push("..."), n.push(li.indentComment(l, "")))
          : n.push(`... ${l}`);
      } else n.push("...");
    else {
      let l = e.comment;
      (l && o && (l = l.replace(/^\n+/, "")),
        l && ((!o || a) && n[n.length - 1] !== "" && n.push(""), n.push(li.indentComment(s(l), ""))));
    }
    return (
      n.join(`
`) +
      `
`
    );
  }
  wf.stringifyDocument = L_;
});
var ci = A((Pf) => {
  "use strict";
  var M_ = qn(),
    mn = fr(),
    Ue = G(),
    F_ = Pt(),
    C_ = St(),
    D_ = ya(),
    j_ = vf(),
    ga = lr(),
    B_ = Eo(),
    G_ = zn(),
    ha = bo(),
    Ia = class e {
      constructor(t, n, i) {
        ((this.commentBefore = null),
          (this.comment = null),
          (this.errors = []),
          (this.warnings = []),
          Object.defineProperty(this, Ue.NODE_TYPE, { value: Ue.DOC }));
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
          : (this.directives = new ha.Directives({ version: o })),
          this.setSchema(o, i),
          (this.contents = t === void 0 ? null : this.createNode(t, r, i)));
      }
      clone() {
        let t = Object.create(e.prototype, { [Ue.NODE_TYPE]: { value: Ue.DOC } });
        return (
          (t.commentBefore = this.commentBefore),
          (t.comment = this.comment),
          (t.errors = this.errors.slice()),
          (t.warnings = this.warnings.slice()),
          (t.options = Object.assign({}, this.options)),
          this.directives && (t.directives = this.directives.clone()),
          (t.schema = this.schema.clone()),
          (t.contents = Ue.isNode(this.contents) ? this.contents.clone(t.schema) : this.contents),
          this.range && (t.range = this.range.slice()),
          t
        );
      }
      add(t) {
        yn(this.contents) && this.contents.add(t);
      }
      addIn(t, n) {
        yn(this.contents) && this.contents.addIn(t, n);
      }
      createAlias(t, n) {
        if (!t.anchor) {
          let i = ga.anchorNames(this);
          t.anchor = !n || i.has(n) ? ga.findNewAnchor(n || "a", i) : n;
        }
        return new M_.Alias(t.anchor);
      }
      createNode(t, n, i) {
        let r;
        if (typeof n == "function") ((t = n.call({ "": t }, "", t)), (r = n));
        else if (Array.isArray(n)) {
          let I = (E) => typeof E == "number" || E instanceof String || E instanceof Number,
            b = n.filter(I).map(String);
          (b.length > 0 && (n = n.concat(b)), (r = n));
        } else i === void 0 && n && ((i = n), (n = void 0));
        let { aliasDuplicateObjects: s, anchorPrefix: o, flow: a, keepUndefined: l, onTagObj: c, tag: d } = i ?? {},
          { onAnchor: f, setAnchors: m, sourceObjects: y } = ga.createNodeAnchors(this, o || "a"),
          p = {
            aliasDuplicateObjects: s ?? !0,
            keepUndefined: l ?? !1,
            onAnchor: f,
            onTagObj: c,
            replacer: r,
            schema: this.schema,
            sourceObjects: y,
          },
          g = G_.createNode(t, d, p);
        return (a && Ue.isCollection(g) && (g.flow = !0), m(), g);
      }
      createPair(t, n, i = {}) {
        let r = this.createNode(t, null, i),
          s = this.createNode(n, null, i);
        return new F_.Pair(r, s);
      }
      delete(t) {
        return yn(this.contents) ? this.contents.delete(t) : !1;
      }
      deleteIn(t) {
        return mn.isEmptyPath(t)
          ? this.contents == null
            ? !1
            : ((this.contents = null), !0)
          : yn(this.contents)
            ? this.contents.deleteIn(t)
            : !1;
      }
      get(t, n) {
        return Ue.isCollection(this.contents) ? this.contents.get(t, n) : void 0;
      }
      getIn(t, n) {
        return mn.isEmptyPath(t)
          ? !n && Ue.isScalar(this.contents)
            ? this.contents.value
            : this.contents
          : Ue.isCollection(this.contents)
            ? this.contents.getIn(t, n)
            : void 0;
      }
      has(t) {
        return Ue.isCollection(this.contents) ? this.contents.has(t) : !1;
      }
      hasIn(t) {
        return mn.isEmptyPath(t)
          ? this.contents !== void 0
          : Ue.isCollection(this.contents)
            ? this.contents.hasIn(t)
            : !1;
      }
      set(t, n) {
        this.contents == null
          ? (this.contents = mn.collectionFromPath(this.schema, [t], n))
          : yn(this.contents) && this.contents.set(t, n);
      }
      setIn(t, n) {
        mn.isEmptyPath(t)
          ? (this.contents = n)
          : this.contents == null
            ? (this.contents = mn.collectionFromPath(this.schema, Array.from(t), n))
            : yn(this.contents) && this.contents.setIn(t, n);
      }
      setSchema(t, n = {}) {
        typeof t == "number" && (t = String(t));
        let i;
        switch (t) {
          case "1.1":
            (this.directives
              ? (this.directives.yaml.version = "1.1")
              : (this.directives = new ha.Directives({ version: "1.1" })),
              (i = { resolveKnownTags: !1, schema: "yaml-1.1" }));
            break;
          case "1.2":
          case "next":
            (this.directives
              ? (this.directives.yaml.version = t)
              : (this.directives = new ha.Directives({ version: t })),
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
        else if (i) this.schema = new D_.Schema(Object.assign(i, n));
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
          l = C_.toJS(this.contents, n ?? "", a);
        if (typeof s == "function") for (let { count: c, res: d } of a.anchors.values()) s(d, c);
        return typeof o == "function" ? B_.applyReviver(o, { "": l }, "", l) : l;
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
        return j_.stringifyDocument(this, t);
      }
    };
  function yn(e) {
    if (Ue.isCollection(e)) return !0;
    throw new Error("Expected a YAML collection as document contents");
  }
  Pf.Document = Ia;
});
var fi = A((ui) => {
  "use strict";
  var di = class extends Error {
      constructor(t, n, i, r) {
        (super(), (this.name = t), (this.code = i), (this.message = r), (this.pos = n));
      }
    },
    ba = class extends di {
      constructor(t, n, i) {
        super("YAMLParseError", t, n, i);
      }
    },
    Ea = class extends di {
      constructor(t, n, i) {
        super("YAMLWarning", t, n, i);
      }
    },
    K_ = (e, t) => (n) => {
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
  ui.YAMLError = di;
  ui.YAMLParseError = ba;
  ui.YAMLWarning = Ea;
  ui.prettifyError = K_;
});
var mi = A((xf) => {
  "use strict";
  function Y_(e, { flow: t, indicator: n, next: i, offset: r, onError: s, parentIndent: o, startOnNewline: a }) {
    let l = !1,
      c = a,
      d = a,
      f = "",
      m = "",
      y = !1,
      p = !1,
      g = null,
      I = null,
      b = null,
      E = null,
      w = null,
      x = null,
      R = null;
    for (let N of e)
      switch (
        (p &&
          (N.type !== "space" &&
            N.type !== "newline" &&
            N.type !== "comma" &&
            s(N.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"),
          (p = !1)),
        g &&
          (c &&
            N.type !== "comment" &&
            N.type !== "newline" &&
            s(g, "TAB_AS_INDENT", "Tabs are not allowed as indentation"),
          (g = null)),
        N.type)
      ) {
        case "space":
          (!t && (n !== "doc-start" || i?.type !== "flow-collection") && N.source.includes("	") && (g = N), (d = !0));
          break;
        case "comment": {
          d || s(N, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          let D = N.source.substring(1) || " ";
          (f ? (f += m + D) : (f = D), (m = ""), (c = !1));
          break;
        }
        case "newline":
          (c ? (f ? (f += N.source) : (!x || n !== "seq-item-ind") && (l = !0)) : (m += N.source),
            (c = !0),
            (y = !0),
            (I || b) && (E = N),
            (d = !0));
          break;
        case "anchor":
          (I && s(N, "MULTIPLE_ANCHORS", "A node can have at most one anchor"),
            N.source.endsWith(":") &&
              s(N.offset + N.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0),
            (I = N),
            R ?? (R = N.offset),
            (c = !1),
            (d = !1),
            (p = !0));
          break;
        case "tag": {
          (b && s(N, "MULTIPLE_TAGS", "A node can have at most one tag"),
            (b = N),
            R ?? (R = N.offset),
            (c = !1),
            (d = !1),
            (p = !0));
          break;
        }
        case n:
          ((I || b) && s(N, "BAD_PROP_ORDER", `Anchors and tags must be after the ${N.source} indicator`),
            x && s(N, "UNEXPECTED_TOKEN", `Unexpected ${N.source} in ${t ?? "collection"}`),
            (x = N),
            (c = n === "seq-item-ind" || n === "explicit-key-ind"),
            (d = !1));
          break;
        case "comma":
          if (t) {
            (w && s(N, "UNEXPECTED_TOKEN", `Unexpected , in ${t}`), (w = N), (c = !1), (d = !1));
            break;
          }
        default:
          (s(N, "UNEXPECTED_TOKEN", `Unexpected ${N.type} token`), (c = !1), (d = !1));
      }
    let v = e[e.length - 1],
      O = v ? v.offset + v.source.length : r;
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
        comma: w,
        found: x,
        spaceBefore: l,
        comment: f,
        hasNewline: y,
        anchor: I,
        tag: b,
        newlineAfterProp: E,
        end: O,
        start: R ?? O,
      }
    );
  }
  xf.resolveProps = Y_;
});
var qr = A((Tf) => {
  "use strict";
  function _a(e) {
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
          if (_a(t.key) || _a(t.value)) return !0;
        }
        return !1;
      default:
        return !0;
    }
  }
  Tf.containsNewline = _a;
});
var Sa = A((Nf) => {
  "use strict";
  var $_ = qr();
  function W_(e, t, n) {
    if (t?.type === "flow-collection") {
      let i = t.end[0];
      i.indent === e &&
        (i.source === "]" || i.source === "}") &&
        $_.containsNewline(t) &&
        n(i, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
    }
  }
  Nf.flowIndentCheck = W_;
});
var Ra = A((Of) => {
  "use strict";
  var kf = G();
  function V_(e, t, n) {
    let { uniqueKeys: i } = e.options;
    if (i === !1) return !1;
    let r = typeof i == "function" ? i : (s, o) => s === o || (kf.isScalar(s) && kf.isScalar(o) && s.value === o.value);
    return t.some((s) => r(s.key, n));
  }
  Of.mapIncludes = V_;
});
var Cf = A((Ff) => {
  "use strict";
  var Af = Pt(),
    q_ = Tt(),
    Uf = mi(),
    z_ = qr(),
    Lf = Sa(),
    H_ = Ra(),
    Mf = "All mapping items must start at the same column";
  function X_({ composeNode: e, composeEmptyNode: t }, n, i, r, s) {
    let o = s?.nodeClass ?? q_.YAMLMap,
      a = new o(n.schema);
    n.atRoot && (n.atRoot = !1);
    let l = i.offset,
      c = null;
    for (let d of i.items) {
      let { start: f, key: m, sep: y, value: p } = d,
        g = Uf.resolveProps(f, {
          indicator: "explicit-key-ind",
          next: m ?? y?.[0],
          offset: l,
          onError: r,
          parentIndent: i.indent,
          startOnNewline: !0,
        }),
        I = !g.found;
      if (I) {
        if (
          (m &&
            (m.type === "block-seq"
              ? r(l, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key")
              : "indent" in m && m.indent !== i.indent && r(l, "BAD_INDENT", Mf)),
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
        (g.newlineAfterProp || z_.containsNewline(m)) &&
          r(m ?? f[f.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
      } else g.found?.indent !== i.indent && r(l, "BAD_INDENT", Mf);
      n.atKey = !0;
      let b = g.end,
        E = m ? e(n, m, g, r) : t(n, b, f, null, g, r);
      (n.schema.compat && Lf.flowIndentCheck(i.indent, m, r),
        (n.atKey = !1),
        H_.mapIncludes(n, a.items, E) && r(b, "DUPLICATE_KEY", "Map keys must be unique"));
      let w = Uf.resolveProps(y ?? [], {
        indicator: "map-value-ind",
        next: p,
        offset: E.range[2],
        onError: r,
        parentIndent: i.indent,
        startOnNewline: !m || m.type === "block-scalar",
      });
      if (((l = w.end), w.found)) {
        I &&
          (p?.type === "block-map" &&
            !w.hasNewline &&
            r(l, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"),
          n.options.strict &&
            g.start < w.found.offset - 1024 &&
            r(
              E.range,
              "KEY_OVER_1024_CHARS",
              "The : indicator must be at most 1024 chars after the start of an implicit block mapping key",
            ));
        let x = p ? e(n, p, w, r) : t(n, l, y, null, w, r);
        (n.schema.compat && Lf.flowIndentCheck(i.indent, p, r), (l = x.range[2]));
        let R = new Af.Pair(E, x);
        (n.options.keepSourceTokens && (R.srcToken = d), a.items.push(R));
      } else {
        (I && r(E.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"),
          w.comment &&
            (E.comment
              ? (E.comment +=
                  `
` + w.comment)
              : (E.comment = w.comment)));
        let x = new Af.Pair(E);
        (n.options.keepSourceTokens && (x.srcToken = d), a.items.push(x));
      }
    }
    return (
      c && c < l && r(c, "IMPOSSIBLE", "Map comment with trailing content"),
      (a.range = [i.offset, l, c ?? l]),
      a
    );
  }
  Ff.resolveBlockMap = X_;
});
var jf = A((Df) => {
  "use strict";
  var J_ = Nt(),
    Q_ = mi(),
    Z_ = Sa();
  function eS({ composeNode: e, composeEmptyNode: t }, n, i, r, s) {
    let o = s?.nodeClass ?? J_.YAMLSeq,
      a = new o(n.schema);
    (n.atRoot && (n.atRoot = !1), n.atKey && (n.atKey = !1));
    let l = i.offset,
      c = null;
    for (let { start: d, value: f } of i.items) {
      let m = Q_.resolveProps(d, {
        indicator: "seq-item-ind",
        next: f,
        offset: l,
        onError: r,
        parentIndent: i.indent,
        startOnNewline: !0,
      });
      if (!m.found)
        if (m.anchor || m.tag || f)
          f?.type === "block-seq"
            ? r(m.end, "BAD_INDENT", "All sequence items must start at the same column")
            : r(l, "MISSING_CHAR", "Sequence item without - indicator");
        else {
          ((c = m.end), m.comment && (a.comment = m.comment));
          continue;
        }
      let y = f ? e(n, f, m, r) : t(n, m.end, d, null, m, r);
      (n.schema.compat && Z_.flowIndentCheck(i.indent, f, r), (l = y.range[2]), a.items.push(y));
    }
    return ((a.range = [i.offset, l, c ?? l]), a);
  }
  Df.resolveBlockSeq = eS;
});
var pn = A((Bf) => {
  "use strict";
  function tS(e, t, n, i) {
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
  Bf.resolveEnd = tS;
});
var $f = A((Yf) => {
  "use strict";
  var nS = G(),
    iS = Pt(),
    Gf = Tt(),
    rS = Nt(),
    sS = pn(),
    Kf = mi(),
    oS = qr(),
    aS = Ra(),
    wa = "Block collections are not allowed within flow collections",
    va = (e) => e && (e.type === "block-map" || e.type === "block-seq");
  function lS({ composeNode: e, composeEmptyNode: t }, n, i, r, s) {
    let o = i.start.source === "{",
      a = o ? "flow map" : "flow sequence",
      l = s?.nodeClass ?? (o ? Gf.YAMLMap : rS.YAMLSeq),
      c = new l(n.schema);
    c.flow = !0;
    let d = n.atRoot;
    (d && (n.atRoot = !1), n.atKey && (n.atKey = !1));
    let f = i.offset + i.start.source.length;
    for (let I = 0; I < i.items.length; ++I) {
      let b = i.items[I],
        { start: E, key: w, sep: x, value: R } = b,
        v = Kf.resolveProps(E, {
          flow: a,
          indicator: "explicit-key-ind",
          next: w ?? x?.[0],
          offset: f,
          onError: r,
          parentIndent: i.indent,
          startOnNewline: !1,
        });
      if (!v.found) {
        if (!v.anchor && !v.tag && !x && !R) {
          (I === 0 && v.comma
            ? r(v.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`)
            : I < i.items.length - 1 && r(v.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${a}`),
            v.comment &&
              (c.comment
                ? (c.comment +=
                    `
` + v.comment)
                : (c.comment = v.comment)),
            (f = v.end));
          continue;
        }
        !o &&
          n.options.strict &&
          oS.containsNewline(w) &&
          r(w, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
      }
      if (I === 0) v.comma && r(v.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`);
      else if ((v.comma || r(v.start, "MISSING_CHAR", `Missing , between ${a} items`), v.comment)) {
        let O = "";
        e: for (let N of E)
          switch (N.type) {
            case "comma":
            case "space":
              break;
            case "comment":
              O = N.source.substring(1);
              break e;
            default:
              break e;
          }
        if (O) {
          let N = c.items[c.items.length - 1];
          (nS.isPair(N) && (N = N.value ?? N.key),
            N.comment
              ? (N.comment +=
                  `
` + O)
              : (N.comment = O),
            (v.comment = v.comment.substring(O.length + 1)));
        }
      }
      if (!o && !x && !v.found) {
        let O = R ? e(n, R, v, r) : t(n, v.end, x, null, v, r);
        (c.items.push(O), (f = O.range[2]), va(R) && r(O.range, "BLOCK_IN_FLOW", wa));
      } else {
        n.atKey = !0;
        let O = v.end,
          N = w ? e(n, w, v, r) : t(n, O, E, null, v, r);
        (va(w) && r(N.range, "BLOCK_IN_FLOW", wa), (n.atKey = !1));
        let D = Kf.resolveProps(x ?? [], {
          flow: a,
          indicator: "map-value-ind",
          next: R,
          offset: N.range[2],
          onError: r,
          parentIndent: i.indent,
          startOnNewline: !1,
        });
        if (D.found) {
          if (!o && !v.found && n.options.strict) {
            if (x)
              for (let B of x) {
                if (B === D.found) break;
                if (B.type === "newline") {
                  r(B, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                  break;
                }
              }
            v.start < D.found.offset - 1024 &&
              r(
                D.found,
                "KEY_OVER_1024_CHARS",
                "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key",
              );
          }
        } else
          R &&
            ("source" in R && R.source?.[0] === ":"
              ? r(R, "MISSING_CHAR", `Missing space after : in ${a}`)
              : r(D.start, "MISSING_CHAR", `Missing , or : between ${a} items`));
        let te = R ? e(n, R, D, r) : D.found ? t(n, D.end, x, null, D, r) : null;
        te
          ? va(R) && r(te.range, "BLOCK_IN_FLOW", wa)
          : D.comment &&
            (N.comment
              ? (N.comment +=
                  `
` + D.comment)
              : (N.comment = D.comment));
        let z = new iS.Pair(N, te);
        if ((n.options.keepSourceTokens && (z.srcToken = b), o)) {
          let B = c;
          (aS.mapIncludes(n, B.items, N) && r(O, "DUPLICATE_KEY", "Map keys must be unique"), B.items.push(z));
        } else {
          let B = new Gf.YAMLMap(n.schema);
          ((B.flow = !0), B.items.push(z));
          let Y = (te ?? N).range;
          ((B.range = [N.range[0], Y[1], Y[2]]), c.items.push(B));
        }
        f = te ? te.range[2] : D.end;
      }
    }
    let m = o ? "}" : "]",
      [y, ...p] = i.end,
      g = f;
    if (y?.source === m) g = y.offset + y.source.length;
    else {
      let I = a[0].toUpperCase() + a.substring(1),
        b = d
          ? `${I} must end with a ${m}`
          : `${I} in block collection must be sufficiently indented and end with a ${m}`;
      (r(f, d ? "MISSING_CHAR" : "BAD_INDENT", b), y && y.source.length !== 1 && p.unshift(y));
    }
    if (p.length > 0) {
      let I = sS.resolveEnd(p, g, n.options.strict, r);
      (I.comment &&
        (c.comment
          ? (c.comment +=
              `
` + I.comment)
          : (c.comment = I.comment)),
        (c.range = [i.offset, g, I.offset]));
    } else c.range = [i.offset, g, g];
    return c;
  }
  Yf.resolveFlowCollection = lS;
});
var Vf = A((Wf) => {
  "use strict";
  var cS = G(),
    dS = ee(),
    uS = Tt(),
    fS = Nt(),
    mS = Cf(),
    yS = jf(),
    pS = $f();
  function Pa(e, t, n, i, r, s) {
    let o =
        n.type === "block-map"
          ? mS.resolveBlockMap(e, t, n, i, s)
          : n.type === "block-seq"
            ? yS.resolveBlockSeq(e, t, n, i, s)
            : pS.resolveFlowCollection(e, t, n, i, s),
      a = o.constructor;
    return r === "!" || r === a.tagName ? ((o.tag = a.tagName), o) : (r && (o.tag = r), o);
  }
  function gS(e, t, n, i, r) {
    let s = i.tag,
      o = s ? t.directives.tagName(s.source, (m) => r(s, "TAG_RESOLVE_FAILED", m)) : null;
    if (n.type === "block-seq") {
      let { anchor: m, newlineAfterProp: y } = i,
        p = m && s ? (m.offset > s.offset ? m : s) : (m ?? s);
      p && (!y || y.offset < p.offset) && r(p, "MISSING_CHAR", "Missing newline after block sequence props");
    }
    let a = n.type === "block-map" ? "map" : n.type === "block-seq" ? "seq" : n.start.source === "{" ? "map" : "seq";
    if (!s || !o || o === "!" || (o === uS.YAMLMap.tagName && a === "map") || (o === fS.YAMLSeq.tagName && a === "seq"))
      return Pa(e, t, n, r, o);
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
          Pa(e, t, n, r, o)
        );
    }
    let c = Pa(e, t, n, r, o, l),
      d = l.resolve?.(c, (m) => r(s, "TAG_RESOLVE_FAILED", m), t.options) ?? c,
      f = cS.isNode(d) ? d : new dS.Scalar(d);
    return ((f.range = c.range), (f.tag = o), l?.format && (f.format = l.format), f);
  }
  Wf.composeCollection = gS;
});
var Ta = A((qf) => {
  "use strict";
  var xa = ee();
  function hS(e, t, n) {
    let i = t.offset,
      r = IS(t, e.options.strict, n);
    if (!r) return { value: "", type: null, comment: "", range: [i, i, i] };
    let s = r.mode === ">" ? xa.Scalar.BLOCK_FOLDED : xa.Scalar.BLOCK_LITERAL,
      o = t.source ? bS(t.source) : [],
      a = o.length;
    for (let g = o.length - 1; g >= 0; --g) {
      let I = o[g][1];
      if (I === "" || I === "\r") a = g;
      else break;
    }
    if (a === 0) {
      let g =
          r.chomp === "+" && o.length > 0
            ? `
`.repeat(Math.max(1, o.length - 1))
            : "",
        I = i + r.length;
      return (t.source && (I += t.source.length), { value: g, type: s, comment: r.comment, range: [i, I, I] });
    }
    let l = t.indent + r.indent,
      c = t.offset + r.length,
      d = 0;
    for (let g = 0; g < a; ++g) {
      let [I, b] = o[g];
      if (b === "" || b === "\r") r.indent === 0 && I.length > l && (l = I.length);
      else {
        (I.length < l &&
          n(
            c + I.length,
            "MISSING_CHAR",
            "Block scalars with more-indented leading empty lines must use an explicit indentation indicator",
          ),
          r.indent === 0 && (l = I.length),
          (d = g),
          l === 0 && !e.atRoot && n(c, "BAD_INDENT", "Block scalar values in collections must be indented"));
        break;
      }
      c += I.length + b.length + 1;
    }
    for (let g = o.length - 1; g >= a; --g) o[g][0].length > l && (a = g + 1);
    let f = "",
      m = "",
      y = !1;
    for (let g = 0; g < d; ++g)
      f +=
        o[g][0].slice(l) +
        `
`;
    for (let g = d; g < a; ++g) {
      let [I, b] = o[g];
      c += I.length + b.length + 1;
      let E = b[b.length - 1] === "\r";
      if ((E && (b = b.slice(0, -1)), b && I.length < l)) {
        let x = `Block scalar lines must not be less indented than their ${r.indent ? "explicit indentation indicator" : "first line"}`;
        (n(c - b.length - (E ? 2 : 1), "BAD_INDENT", x), (I = ""));
      }
      s === xa.Scalar.BLOCK_LITERAL
        ? ((f += m + I.slice(l) + b),
          (m = `
`))
        : I.length > l || b[0] === "	"
          ? (m === " "
              ? (m = `
`)
              : !y &&
                m ===
                  `
` &&
                (m = `

`),
            (f += m + I.slice(l) + b),
            (m = `
`),
            (y = !0))
          : b === ""
            ? m ===
              `
`
              ? (f += `
`)
              : (m = `
`)
            : ((f += m + b), (m = " "), (y = !1));
    }
    switch (r.chomp) {
      case "-":
        break;
      case "+":
        for (let g = a; g < o.length; ++g)
          f +=
            `
` + o[g][0].slice(l);
        f[f.length - 1] !==
          `
` &&
          (f += `
`);
        break;
      default:
        f += `
`;
    }
    let p = i + r.length + t.source.length;
    return { value: f, type: s, comment: r.comment, range: [i, p, p] };
  }
  function IS({ offset: e, props: t }, n, i) {
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
      f = r.length;
    for (let m = 1; m < t.length; ++m) {
      let y = t[m];
      switch (y.type) {
        case "space":
          c = !0;
        case "newline":
          f += y.source.length;
          break;
        case "comment":
          (n && !c && i(y, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"),
            (f += y.source.length),
            (d = y.source.substring(1)));
          break;
        case "error":
          (i(y, "UNEXPECTED_TOKEN", y.message), (f += y.source.length));
          break;
        default: {
          let p = `Unexpected token in block scalar header: ${y.type}`;
          i(y, "UNEXPECTED_TOKEN", p);
          let g = y.source;
          g && typeof g == "string" && (f += g.length);
        }
      }
    }
    return { mode: s, indent: o, chomp: a, comment: d, length: f };
  }
  function bS(e) {
    let t = e.split(/\n( *)/),
      n = t[0],
      i = n.match(/^( *)/),
      s = [i?.[1] ? [i[1], n.slice(i[1].length)] : ["", n]];
    for (let o = 1; o < t.length; o += 2) s.push([t[o], t[o + 1]]);
    return s;
  }
  qf.resolveBlockScalar = hS;
});
var ka = A((Hf) => {
  "use strict";
  var Na = ee(),
    ES = pn();
  function _S(e, t, n) {
    let { offset: i, type: r, source: s, end: o } = e,
      a,
      l,
      c = (m, y, p) => n(i + m, y, p);
    switch (r) {
      case "scalar":
        ((a = Na.Scalar.PLAIN), (l = SS(s, c)));
        break;
      case "single-quoted-scalar":
        ((a = Na.Scalar.QUOTE_SINGLE), (l = RS(s, c)));
        break;
      case "double-quoted-scalar":
        ((a = Na.Scalar.QUOTE_DOUBLE), (l = wS(s, c)));
        break;
      default:
        return (
          n(e, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${r}`),
          { value: "", type: null, comment: "", range: [i, i + s.length, i + s.length] }
        );
    }
    let d = i + s.length,
      f = ES.resolveEnd(o, d, t, n);
    return { value: l, type: a, comment: f.comment, range: [i, d, f.offset] };
  }
  function SS(e, t) {
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
    return (n && t(0, "BAD_SCALAR_START", `Plain value cannot start with ${n}`), zf(e));
  }
  function RS(e, t) {
    return (
      (e[e.length - 1] !== "'" || e.length === 1) && t(e.length, "MISSING_CHAR", "Missing closing 'quote"),
      zf(e.slice(1, -1)).replace(/''/g, "'")
    );
  }
  function zf(e) {
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
  function wS(e, t) {
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
          let { fold: s, offset: o } = vS(e, i);
          ((n += s), (i = o));
        } else if (r === "\\") {
          let s = e[++i],
            o = PS[s];
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
            ((n += xS(e, i + 1, a, t)), (i += a));
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
  function vS(e, t) {
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
  var PS = {
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
  function xS(e, t, n, i) {
    let r = e.substr(t, n),
      o = r.length === n && /^[0-9a-fA-F]+$/.test(r) ? parseInt(r, 16) : NaN;
    try {
      return String.fromCodePoint(o);
    } catch {
      let a = e.substr(t - 2, n + 2);
      return (i(t - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), a);
    }
  }
  Hf.resolveFlowScalar = _S;
});
var Qf = A((Jf) => {
  "use strict";
  var Yt = G(),
    Xf = ee(),
    TS = Ta(),
    NS = ka();
  function kS(e, t, n, i) {
    let {
        value: r,
        type: s,
        comment: o,
        range: a,
      } = t.type === "block-scalar" ? TS.resolveBlockScalar(e, t, i) : NS.resolveFlowScalar(t, e.options.strict, i),
      l = n ? e.directives.tagName(n.source, (f) => i(n, "TAG_RESOLVE_FAILED", f)) : null,
      c;
    e.options.stringKeys && e.atKey
      ? (c = e.schema[Yt.SCALAR])
      : l
        ? (c = OS(e.schema, r, l, n, i))
        : t.type === "scalar"
          ? (c = AS(e, r, t, i))
          : (c = e.schema[Yt.SCALAR]);
    let d;
    try {
      let f = c.resolve(r, (m) => i(n ?? t, "TAG_RESOLVE_FAILED", m), e.options);
      d = Yt.isScalar(f) ? f : new Xf.Scalar(f);
    } catch (f) {
      let m = f instanceof Error ? f.message : String(f);
      (i(n ?? t, "TAG_RESOLVE_FAILED", m), (d = new Xf.Scalar(r)));
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
  function OS(e, t, n, i, r) {
    if (n === "!") return e[Yt.SCALAR];
    let s = [];
    for (let a of e.tags)
      if (!a.collection && a.tag === n)
        if (a.default && a.test) s.push(a);
        else return a;
    for (let a of s) if (a.test?.test(t)) return a;
    let o = e.knownTags[n];
    return o && !o.collection
      ? (e.tags.push(Object.assign({}, o, { default: !1, test: void 0 })), o)
      : (r(i, "TAG_RESOLVE_FAILED", `Unresolved tag: ${n}`, n !== "tag:yaml.org,2002:str"), e[Yt.SCALAR]);
  }
  function AS({ atKey: e, directives: t, schema: n }, i, r, s) {
    let o = n.tags.find((a) => (a.default === !0 || (e && a.default === "key")) && a.test?.test(i)) || n[Yt.SCALAR];
    if (n.compat) {
      let a = n.compat.find((l) => l.default && l.test?.test(i)) ?? n[Yt.SCALAR];
      if (o.tag !== a.tag) {
        let l = t.tagString(o.tag),
          c = t.tagString(a.tag),
          d = `Value may be parsed as either ${l} or ${c}`;
        s(r, "TAG_RESOLVE_FAILED", d, !0);
      }
    }
    return o;
  }
  Jf.composeScalar = kS;
});
var em = A((Zf) => {
  "use strict";
  function US(e, t, n) {
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
  Zf.emptyScalarPosition = US;
});
var im = A((Aa) => {
  "use strict";
  var LS = qn(),
    MS = G(),
    FS = Vf(),
    tm = Qf(),
    CS = pn(),
    DS = em(),
    jS = { composeNode: nm, composeEmptyNode: Oa };
  function nm(e, t, n, i) {
    let r = e.atKey,
      { spaceBefore: s, comment: o, anchor: a, tag: l } = n,
      c,
      d = !0;
    switch (t.type) {
      case "alias":
        ((c = BS(e, t, i)), (a || l) && i(t, "ALIAS_PROPS", "An alias node must not specify any properties"));
        break;
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "block-scalar":
        ((c = tm.composeScalar(e, t, l, i)), a && (c.anchor = a.source.substring(1)));
        break;
      case "block-map":
      case "block-seq":
      case "flow-collection":
        try {
          ((c = FS.composeCollection(jS, e, t, n, i)), a && (c.anchor = a.source.substring(1)));
        } catch (f) {
          let m = f instanceof Error ? f.message : String(f);
          i(t, "RESOURCE_EXHAUSTION", m);
        }
        break;
      default: {
        let f = t.type === "error" ? t.message : `Unsupported token (type: ${t.type})`;
        (i(t, "UNEXPECTED_TOKEN", f), (d = !1));
      }
    }
    return (
      c ?? (c = Oa(e, t.offset, void 0, null, n, i)),
      a && c.anchor === "" && i(a, "BAD_ALIAS", "Anchor cannot be an empty string"),
      r &&
        e.options.stringKeys &&
        (!MS.isScalar(c) || typeof c.value != "string" || (c.tag && c.tag !== "tag:yaml.org,2002:str")) &&
        i(l ?? t, "NON_STRING_KEY", "With stringKeys, all keys must be strings"),
      s && (c.spaceBefore = !0),
      o && (t.type === "scalar" && t.source === "" ? (c.comment = o) : (c.commentBefore = o)),
      e.options.keepSourceTokens && d && (c.srcToken = t),
      c
    );
  }
  function Oa(e, t, n, i, { spaceBefore: r, comment: s, anchor: o, tag: a, end: l }, c) {
    let d = { type: "scalar", offset: DS.emptyScalarPosition(t, n, i), indent: -1, source: "" },
      f = tm.composeScalar(e, d, a, c);
    return (
      o &&
        ((f.anchor = o.source.substring(1)), f.anchor === "" && c(o, "BAD_ALIAS", "Anchor cannot be an empty string")),
      r && (f.spaceBefore = !0),
      s && ((f.comment = s), (f.range[2] = l)),
      f
    );
  }
  function BS({ options: e }, { offset: t, source: n, end: i }, r) {
    let s = new LS.Alias(n.substring(1));
    (s.source === "" && r(t, "BAD_ALIAS", "Alias cannot be an empty string"),
      s.source.endsWith(":") && r(t + n.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0));
    let o = t + n.length,
      a = CS.resolveEnd(i, o, e.strict, r);
    return ((s.range = [t, o, a.offset]), a.comment && (s.comment = a.comment), s);
  }
  Aa.composeEmptyNode = Oa;
  Aa.composeNode = nm;
});
var om = A((sm) => {
  "use strict";
  var GS = ci(),
    rm = im(),
    KS = pn(),
    YS = mi();
  function $S(e, t, { offset: n, start: i, value: r, end: s }, o) {
    let a = Object.assign({ _directives: t }, e),
      l = new GS.Document(void 0, a),
      c = { atKey: !1, atRoot: !0, directives: l.directives, options: l.options, schema: l.schema },
      d = YS.resolveProps(i, {
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
      (l.contents = r ? rm.composeNode(c, r, d, o) : rm.composeEmptyNode(c, d.end, i, null, d, o)));
    let f = l.contents.range[2],
      m = KS.resolveEnd(s, f, !1, o);
    return (m.comment && (l.comment = m.comment), (l.range = [n, f, m.offset]), l);
  }
  sm.composeDoc = $S;
});
var La = A((cm) => {
  "use strict";
  var WS = Ki("process"),
    VS = bo(),
    qS = ci(),
    yi = fi(),
    am = G(),
    zS = om(),
    HS = pn();
  function pi(e) {
    if (typeof e == "number") return [e, e + 1];
    if (Array.isArray(e)) return e.length === 2 ? e : [e[0], e[1]];
    let { offset: t, source: n } = e;
    return [t, t + (typeof n == "string" ? n.length : 1)];
  }
  function lm(e) {
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
  var Ua = class {
    constructor(t = {}) {
      ((this.doc = null),
        (this.atDirectives = !1),
        (this.prelude = []),
        (this.errors = []),
        (this.warnings = []),
        (this.onError = (n, i, r, s) => {
          let o = pi(n);
          s ? this.warnings.push(new yi.YAMLWarning(o, i, r)) : this.errors.push(new yi.YAMLParseError(o, i, r));
        }),
        (this.directives = new VS.Directives({ version: t.version || "1.2" })),
        (this.options = t));
    }
    decorate(t, n) {
      let { comment: i, afterEmptyLine: r } = lm(this.prelude);
      if (i) {
        let s = t.contents;
        if (n)
          t.comment = t.comment
            ? `${t.comment}
${i}`
            : i;
        else if (r || t.directives.docStart || !s) t.commentBefore = i;
        else if (am.isCollection(s) && !s.flow && s.items.length > 0) {
          let o = s.items[0];
          am.isPair(o) && (o = o.key);
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
        comment: lm(this.prelude).comment,
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
      switch ((WS.env.LOG_STREAM && console.dir(t, { depth: null }), t.type)) {
        case "directive":
          (this.directives.add(t.source, (n, i, r) => {
            let s = pi(t);
            ((s[0] += n), this.onError(s, "BAD_DIRECTIVE", i, r));
          }),
            this.prelude.push(t.source),
            (this.atDirectives = !0));
          break;
        case "document": {
          let n = zS.composeDoc(this.options, this.directives, t, this.onError);
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
            i = new yi.YAMLParseError(pi(t), "UNEXPECTED_TOKEN", n);
          this.atDirectives || !this.doc ? this.errors.push(i) : this.doc.errors.push(i);
          break;
        }
        case "doc-end": {
          if (!this.doc) {
            let i = "Unexpected doc-end without preceding document";
            this.errors.push(new yi.YAMLParseError(pi(t), "UNEXPECTED_TOKEN", i));
            break;
          }
          this.doc.directives.docEnd = !0;
          let n = HS.resolveEnd(t.end, t.offset + t.source.length, this.doc.options.strict, this.onError);
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
          this.errors.push(new yi.YAMLParseError(pi(t), "UNEXPECTED_TOKEN", `Unsupported token ${t.type}`));
      }
    }
    *end(t = !1, n = -1) {
      if (this.doc) (this.decorate(this.doc, !0), yield this.doc, (this.doc = null));
      else if (t) {
        let i = Object.assign({ _directives: this.directives }, this.options),
          r = new qS.Document(void 0, i);
        (this.atDirectives && this.onError(n, "MISSING_CHAR", "Missing directives-end indicator line"),
          (r.range = [0, n, n]),
          this.decorate(r, !1),
          yield r);
      }
    }
  };
  cm.Composer = Ua;
});
var fm = A((zr) => {
  "use strict";
  var XS = Ta(),
    JS = ka(),
    QS = fi(),
    dm = Qn();
  function ZS(e, t = !0, n) {
    if (e) {
      let i = (r, s, o) => {
        let a = typeof r == "number" ? r : Array.isArray(r) ? r[0] : r.offset;
        if (n) n(a, s, o);
        else throw new QS.YAMLParseError([a, a + 1], s, o);
      };
      switch (e.type) {
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return JS.resolveFlowScalar(e, t, i);
        case "block-scalar":
          return XS.resolveBlockScalar({ options: { strict: t } }, e, i);
      }
    }
    return null;
  }
  function eR(e, t) {
    let { implicitKey: n = !1, indent: i, inFlow: r = !1, offset: s = -1, type: o = "PLAIN" } = t,
      a = dm.stringifyString(
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
          f =
            a.substring(c + 1) +
            `
`,
          m = [{ type: "block-scalar-header", offset: s, indent: i, source: d }];
        return (
          um(m, l) ||
            m.push({
              type: "newline",
              offset: -1,
              indent: i,
              source: `
`,
            }),
          { type: "block-scalar", offset: s, indent: i, props: m, source: f }
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
  function tR(e, t, n = {}) {
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
    let l = dm.stringifyString(
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
        nR(e, l);
        break;
      case '"':
        Ma(e, l, "double-quoted-scalar");
        break;
      case "'":
        Ma(e, l, "single-quoted-scalar");
        break;
      default:
        Ma(e, l, "scalar");
    }
  }
  function nR(e, t) {
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
      um(a, "end" in e ? e.end : void 0) ||
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
  function um(e, t) {
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
  function Ma(e, t, n) {
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
  zr.createScalarToken = eR;
  zr.resolveAsScalar = ZS;
  zr.setScalarValue = tR;
});
var ym = A((mm) => {
  "use strict";
  var iR = (e) => ("type" in e ? Xr(e) : Hr(e));
  function Xr(e) {
    switch (e.type) {
      case "block-scalar": {
        let t = "";
        for (let n of e.props) t += Xr(n);
        return t + e.source;
      }
      case "block-map":
      case "block-seq": {
        let t = "";
        for (let n of e.items) t += Hr(n);
        return t;
      }
      case "flow-collection": {
        let t = e.start.source;
        for (let n of e.items) t += Hr(n);
        for (let n of e.end) t += n.source;
        return t;
      }
      case "document": {
        let t = Hr(e);
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
  function Hr({ start: e, key: t, sep: n, value: i }) {
    let r = "";
    for (let s of e) r += s.source;
    if ((t && (r += Xr(t)), n)) for (let s of n) r += s.source;
    return (i && (r += Xr(i)), r);
  }
  mm.stringify = iR;
});
var Im = A((hm) => {
  "use strict";
  var Fa = Symbol("break visit"),
    rR = Symbol("skip children"),
    pm = Symbol("remove item");
  function $t(e, t) {
    ("type" in e && e.type === "document" && (e = { start: e.start, value: e.value }), gm(Object.freeze([]), e, t));
  }
  $t.BREAK = Fa;
  $t.SKIP = rR;
  $t.REMOVE = pm;
  $t.itemAtPath = (e, t) => {
    let n = e;
    for (let [i, r] of t) {
      let s = n?.[i];
      if (s && "items" in s) n = s.items[r];
      else return;
    }
    return n;
  };
  $t.parentCollection = (e, t) => {
    let n = $t.itemAtPath(e, t.slice(0, -1)),
      i = t[t.length - 1][0],
      r = n?.[i];
    if (r && "items" in r) return r;
    throw new Error("Parent collection not found");
  };
  function gm(e, t, n) {
    let i = n(t, e);
    if (typeof i == "symbol") return i;
    for (let r of ["key", "value"]) {
      let s = t[r];
      if (s && "items" in s) {
        for (let o = 0; o < s.items.length; ++o) {
          let a = gm(Object.freeze(e.concat([[r, o]])), s.items[o], n);
          if (typeof a == "number") o = a - 1;
          else {
            if (a === Fa) return Fa;
            a === pm && (s.items.splice(o, 1), (o -= 1));
          }
        }
        typeof i == "function" && r === "key" && (i = i(t, e));
      }
    }
    return typeof i == "function" ? i(t, e) : i;
  }
  hm.visit = $t;
});
var Jr = A((Pe) => {
  "use strict";
  var Ca = fm(),
    sR = ym(),
    oR = Im(),
    Da = "\uFEFF",
    ja = "",
    Ba = "",
    Ga = "",
    aR = (e) => !!e && "items" in e,
    lR = (e) =>
      !!e &&
      (e.type === "scalar" ||
        e.type === "single-quoted-scalar" ||
        e.type === "double-quoted-scalar" ||
        e.type === "block-scalar");
  function cR(e) {
    switch (e) {
      case Da:
        return "<BOM>";
      case ja:
        return "<DOC>";
      case Ba:
        return "<FLOW_END>";
      case Ga:
        return "<SCALAR>";
      default:
        return JSON.stringify(e);
    }
  }
  function dR(e) {
    switch (e) {
      case Da:
        return "byte-order-mark";
      case ja:
        return "doc-mode";
      case Ba:
        return "flow-error-end";
      case Ga:
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
  Pe.createScalarToken = Ca.createScalarToken;
  Pe.resolveAsScalar = Ca.resolveAsScalar;
  Pe.setScalarValue = Ca.setScalarValue;
  Pe.stringify = sR.stringify;
  Pe.visit = oR.visit;
  Pe.BOM = Da;
  Pe.DOCUMENT = ja;
  Pe.FLOW_END = Ba;
  Pe.SCALAR = Ga;
  Pe.isCollection = aR;
  Pe.isScalar = lR;
  Pe.prettyToken = cR;
  Pe.tokenType = dR;
});
var $a = A((Em) => {
  "use strict";
  var gi = Jr();
  function Ke(e) {
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
  var bm = new Set("0123456789ABCDEFabcdef"),
    uR = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"),
    Qr = new Set(",[]{}"),
    fR = new Set(` ,[]{}
\r	`),
    Ka = (e) => !e || fR.has(e),
    Ya = class {
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
          if ((i === "---" || i === "...") && Ke(this.buffer[t + 3])) return -1;
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
        if ((t[0] === gi.BOM && (yield* this.pushCount(1), (t = t.substring(1))), t[0] === "%")) {
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
        return (yield gi.DOCUMENT, yield* this.parseLineStart());
      }
      *parseLineStart() {
        let t = this.charAt(0);
        if (!t && !this.atEnd) return this.setNext("line-start");
        if (t === "-" || t === ".") {
          if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
          let n = this.peek(3);
          if ((n === "---" || n === "...") && Ke(this.charAt(3)))
            return (
              yield* this.pushCount(3),
              (this.indentValue = 0),
              (this.indentNext = 0),
              n === "---" ? "doc" : "stream"
            );
        }
        return (
          (this.indentValue = yield* this.pushSpaces(!1)),
          this.indentNext > this.indentValue && !Ke(this.charAt(1)) && (this.indentNext = this.indentValue),
          yield* this.parseBlockStart()
        );
      }
      *parseBlockStart() {
        let [t, n] = this.peek(2);
        if (!n && !this.atEnd) return this.setNext("block-start");
        if ((t === "-" || t === "?" || t === ":") && Ke(n)) {
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
            return (yield* this.pushUntil(Ka), "doc");
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
            (i === 0 && (r.startsWith("---") || r.startsWith("...")) && Ke(r[3]))) &&
          !(i === this.indentNext - 1 && this.flowLevel === 1 && (r[0] === "]" || r[0] === "}"))
        )
          return ((this.flowLevel = 0), yield gi.FLOW_END, yield* this.parseLineStart());
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
            return (yield* this.pushUntil(Ka), "flow");
          case '"':
          case "'":
            return ((this.flowKey = !0), yield* this.parseQuotedScalar());
          case ":": {
            let o = this.charAt(1);
            if (this.flowKey || Ke(o) || o === ",")
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
        return yield* this.pushUntil((n) => Ke(n) || n === "#");
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
        return (yield gi.SCALAR, yield* this.pushToIndex(t + 1, !0), yield* this.parseLineStart());
      }
      *parsePlainScalar() {
        let t = this.flowLevel > 0,
          n = this.pos - 1,
          i = this.pos - 1,
          r;
        for (; (r = this.buffer[++i]);)
          if (r === ":") {
            let s = this.buffer[i + 1];
            if (Ke(s) || (t && Qr.has(s))) break;
            n = i;
          } else if (Ke(r)) {
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
              s === "#" || (t && Qr.has(s)))
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
            if (t && Qr.has(r)) break;
            n = i;
          }
        return !r && !this.atEnd
          ? this.setNext("plain-scalar")
          : (yield gi.SCALAR, yield* this.pushToIndex(n + 1, !0), t ? "flow" : "doc");
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
              ((t += yield* this.pushUntil(Ka)), (t += yield* this.pushSpaces(!0)));
              continue e;
            case "-":
            case "?":
            case ":": {
              let n = this.flowLevel > 0,
                i = this.charAt(1);
              if (Ke(i) || (n && Qr.has(i))) {
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
          for (; !Ke(n) && n !== ">";) n = this.buffer[++t];
          return yield* this.pushToIndex(n === ">" ? t + 1 : t, !1);
        } else {
          let t = this.pos + 1,
            n = this.buffer[t];
          for (; n;)
            if (uR.has(n)) n = this.buffer[++t];
            else if (n === "%" && bm.has(this.buffer[t + 1]) && bm.has(this.buffer[t + 2])) n = this.buffer[(t += 3)];
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
  Em.Lexer = Ya;
});
var Va = A((_m) => {
  "use strict";
  var Wa = class {
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
  _m.LineCounter = Wa;
});
var za = A((Pm) => {
  "use strict";
  var mR = Ki("process"),
    Sm = Jr(),
    yR = $a();
  function kt(e, t) {
    for (let n = 0; n < e.length; ++n) if (e[n].type === t) return !0;
    return !1;
  }
  function Rm(e) {
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
  function vm(e) {
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
  function Zr(e) {
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
  function gn(e) {
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
  function es(e, t) {
    if (t.length < 1e5) Array.prototype.push.apply(e, t);
    else for (let n = 0; n < t.length; ++n) e.push(t[n]);
  }
  function wm(e) {
    if (e.start.type === "flow-seq-start")
      for (let t of e.items)
        t.sep &&
          !t.value &&
          !kt(t.start, "explicit-key-ind") &&
          !kt(t.sep, "map-value-ind") &&
          (t.key && (t.value = t.key),
          delete t.key,
          vm(t.value) ? (t.value.end ? es(t.value.end, t.sep) : (t.value.end = t.sep)) : es(t.start, t.sep),
          delete t.sep);
  }
  var qa = class {
    constructor(t) {
      ((this.atNewLine = !0),
        (this.atScalar = !1),
        (this.indent = 0),
        (this.offset = 0),
        (this.onKeyLine = !1),
        (this.stack = []),
        (this.source = ""),
        (this.type = ""),
        (this.lexer = new yR.Lexer()),
        (this.onNewLine = t));
    }
    *parse(t, n = !1) {
      this.onNewLine && this.offset === 0 && this.onNewLine(0);
      for (let i of this.lexer.lex(t, n)) yield* this.next(i);
      n || (yield* this.end());
    }
    *next(t) {
      if (((this.source = t), mR.env.LOG_TOKENS && console.log("|", Sm.prettyToken(t)), this.atScalar)) {
        ((this.atScalar = !1), yield* this.step(), (this.offset += t.length));
        return;
      }
      let n = Sm.tokenType(t);
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
          n.type === "flow-collection" && wm(n),
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
            Rm(r.start) === -1 &&
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
          Rm(t.start) !== -1 ? (yield* this.pop(), yield* this.step()) : t.start.push(this.sourceToken);
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
        let n = Zr(this.peek(2)),
          i = gn(n),
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
                (es(r, n.start), r.push(this.sourceToken), t.items.pop());
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
                else if (kt(n.sep, "map-value-ind"))
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: s, key: null, sep: [this.sourceToken] }],
                  });
                else if (vm(n.key) && !kt(n.sep, "newline")) {
                  let o = gn(n.start),
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
              else if (kt(n.start, "newline")) Object.assign(n, { key: null, sep: [this.sourceToken] });
              else {
                let o = gn(n.start);
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
                  : kt(n.sep, "map-value-ind")
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
                if (!n.explicitKey && n.sep && !kt(n.sep, "newline")) {
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
                (es(r, n.start), r.push(this.sourceToken), t.items.pop());
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
          n.value || kt(n.start, "seq-item-ind")
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
          let r = Zr(i),
            s = gn(r);
          wm(t);
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
          let n = Zr(t),
            i = gn(n);
          return (
            i.push(this.sourceToken),
            { type: "block-map", offset: this.offset, indent: this.indent, items: [{ start: i, explicitKey: !0 }] }
          );
        }
        case "map-value-ind": {
          this.onKeyLine = !0;
          let n = Zr(t),
            i = gn(n);
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
  Pm.Parser = qa;
});
var Om = A((Ii) => {
  "use strict";
  var xm = La(),
    pR = ci(),
    hi = fi(),
    gR = Ao(),
    hR = G(),
    IR = Va(),
    Tm = za();
  function Nm(e) {
    let t = e.prettyErrors !== !1;
    return { lineCounter: e.lineCounter || (t && new IR.LineCounter()) || null, prettyErrors: t };
  }
  function bR(e, t = {}) {
    let { lineCounter: n, prettyErrors: i } = Nm(t),
      r = new Tm.Parser(n?.addNewLine),
      s = new xm.Composer(t),
      o = Array.from(s.compose(r.parse(e)));
    if (i && n) for (let a of o) (a.errors.forEach(hi.prettifyError(e, n)), a.warnings.forEach(hi.prettifyError(e, n)));
    return o.length > 0 ? o : Object.assign([], { empty: !0 }, s.streamInfo());
  }
  function km(e, t = {}) {
    let { lineCounter: n, prettyErrors: i } = Nm(t),
      r = new Tm.Parser(n?.addNewLine),
      s = new xm.Composer(t),
      o = null;
    for (let a of s.compose(r.parse(e), !0, e.length))
      if (!o) o = a;
      else if (o.options.logLevel !== "silent") {
        o.errors.push(
          new hi.YAMLParseError(
            a.range.slice(0, 2),
            "MULTIPLE_DOCS",
            "Source contains multiple documents; please use YAML.parseAllDocuments()",
          ),
        );
        break;
      }
    return (i && n && (o.errors.forEach(hi.prettifyError(e, n)), o.warnings.forEach(hi.prettifyError(e, n))), o);
  }
  function ER(e, t, n) {
    let i;
    typeof t == "function" ? (i = t) : n === void 0 && t && typeof t == "object" && (n = t);
    let r = km(e, n);
    if (!r) return null;
    if ((r.warnings.forEach((s) => gR.warn(r.options.logLevel, s)), r.errors.length > 0)) {
      if (r.options.logLevel !== "silent") throw r.errors[0];
      r.errors = [];
    }
    return r.toJS(Object.assign({ reviver: i }, n));
  }
  function _R(e, t, n) {
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
    return hR.isDocument(e) && !i ? e.toString(n) : new pR.Document(e, i, n).toString(n);
  }
  Ii.parse = ER;
  Ii.parseAllDocuments = bR;
  Ii.parseDocument = km;
  Ii.stringify = _R;
});
var Xa = A((W) => {
  "use strict";
  var SR = La(),
    RR = ci(),
    wR = ya(),
    Ha = fi(),
    vR = qn(),
    Ot = G(),
    PR = Pt(),
    xR = ee(),
    TR = Tt(),
    NR = Nt(),
    kR = Jr(),
    OR = $a(),
    AR = Va(),
    UR = za(),
    ts = Om(),
    Am = Yn();
  W.Composer = SR.Composer;
  W.Document = RR.Document;
  W.Schema = wR.Schema;
  W.YAMLError = Ha.YAMLError;
  W.YAMLParseError = Ha.YAMLParseError;
  W.YAMLWarning = Ha.YAMLWarning;
  W.Alias = vR.Alias;
  W.isAlias = Ot.isAlias;
  W.isCollection = Ot.isCollection;
  W.isDocument = Ot.isDocument;
  W.isMap = Ot.isMap;
  W.isNode = Ot.isNode;
  W.isPair = Ot.isPair;
  W.isScalar = Ot.isScalar;
  W.isSeq = Ot.isSeq;
  W.Pair = PR.Pair;
  W.Scalar = xR.Scalar;
  W.YAMLMap = TR.YAMLMap;
  W.YAMLSeq = NR.YAMLSeq;
  W.CST = kR;
  W.Lexer = OR.Lexer;
  W.LineCounter = AR.LineCounter;
  W.Parser = UR.Parser;
  W.parse = ts.parse;
  W.parseAllDocuments = ts.parseAllDocuments;
  W.parseDocument = ts.parseDocument;
  W.stringify = ts.stringify;
  W.visit = Am.visit;
  W.visitAsync = Am.visitAsync;
});
import { parentPort as qg } from "node:worker_threads";
import { randomUUID as Pk } from "node:crypto";
import { readFile as xk } from "node:fs/promises";
import De from "node:path";
import ht from "node:path";
var mh = ht.join(".gamecowork-cli", "UnityInsight"),
  yh = "index.db",
  ph = "index.db.tmp",
  gh = "index.current",
  Bs = ".index.lock",
  Gs = ".index.write.lock.db",
  hh = ".serve.lock";
function Ks(e) {
  let t = __gcuInsightIndexDirectory(e, ht.join(e, mh));
  return {
    projectPath: e,
    indexDirectoryPath: t,
    liveDbPath: ht.join(t, yh),
    tempDbPath: ht.join(t, ph),
    currentPointerPath: ht.join(t, gh),
    indexLockPath: ht.join(t, Bs),
    indexWriteLockDbPath: ht.join(t, Gs),
    serveLockPath: ht.join(t, hh),
  };
}
import { access as Dh, mkdir as jh, rename as Bh, rm as Hs } from "node:fs/promises";
import { constants as Gh } from "node:fs";
import { DatabaseSync as Kh } from "node:sqlite";
import Vc from "node:path";
var wc = `CREATE TABLE projects (
  id INTEGER NOT NULL,
  project_path TEXT NOT NULL,
  unity_version TEXT,
  indexed_at TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  materialization_generation INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT pk_projects PRIMARY KEY (id),
  CONSTRAINT uq_projects_project_path UNIQUE (project_path)
) STRICT;

CREATE TABLE files (
  id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  project_rel_path TEXT NOT NULL,
  abs_path TEXT NOT NULL,
  kind TEXT NOT NULL,
  guid TEXT,
  meta_file_id INTEGER,
  size_bytes INTEGER NOT NULL,
  mtime_ms INTEGER NOT NULL,
  content_hash TEXT NOT NULL,
  importer_type TEXT,
  CONSTRAINT pk_files PRIMARY KEY (id),
  CONSTRAINT uq_files_project_rel_path UNIQUE (project_id, project_rel_path),
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
  FOREIGN KEY (meta_file_id) REFERENCES files (id) ON DELETE SET NULL
) STRICT;

CREATE TABLE assemblies (
  id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  source TEXT NOT NULL,
  root_namespace TEXT,
  is_editor_only INTEGER NOT NULL,
  CONSTRAINT pk_assemblies PRIMARY KEY (id),
  CONSTRAINT uq_assemblies_project_name UNIQUE (project_id, name),
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
) STRICT;

CREATE TABLE assembly_references (
  from_assembly_id INTEGER NOT NULL,
  to_assembly_name TEXT NOT NULL,
  is_external INTEGER NOT NULL,
  FOREIGN KEY (from_assembly_id) REFERENCES assemblies (id) ON DELETE CASCADE
) STRICT;

CREATE TABLE yaml_objects (
  id INTEGER NOT NULL,
  file_id INTEGER NOT NULL,
  doc_index INTEGER NOT NULL,
  unity_class_id INTEGER NOT NULL,
  anchor TEXT,
  object_type TEXT NOT NULL,
  local_identifier TEXT NOT NULL,
  game_object_file_id TEXT,
  component_type_name TEXT,
  script_guid TEXT,
  script_file_id TEXT,
  name TEXT,
  line_start INTEGER NOT NULL,
  line_end INTEGER NOT NULL,
  CONSTRAINT pk_yaml_objects PRIMARY KEY (id),
  FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE
) STRICT;

CREATE TABLE yaml_references (
  id INTEGER NOT NULL,
  file_id INTEGER NOT NULL,
  source_yaml_object_id INTEGER NOT NULL,
  field_path TEXT NOT NULL,
  target_guid TEXT,
  target_file_id TEXT,
  target_local_id TEXT,
  ref_kind TEXT NOT NULL,
  CONSTRAINT pk_yaml_references PRIMARY KEY (id),
  FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE,
  FOREIGN KEY (source_yaml_object_id) REFERENCES yaml_objects (id) ON DELETE CASCADE
) STRICT;

CREATE INDEX idx_yaml_references_source_object
ON yaml_references (source_yaml_object_id);

CREATE TABLE cs_declarations (
  id INTEGER NOT NULL,
  file_id INTEGER NOT NULL,
  decl_kind TEXT NOT NULL,
  simple_name TEXT NOT NULL,
  qualified_name_text TEXT,
  arity INTEGER,
  modifiers_json TEXT,
  signature_text TEXT,
  skeleton_content TEXT,
  line_start INTEGER NOT NULL,
  line_end INTEGER NOT NULL,
  CONSTRAINT pk_cs_declarations PRIMARY KEY (id),
  FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE
) STRICT;

CREATE TABLE cs_mentions (
  id INTEGER NOT NULL,
  file_id INTEGER NOT NULL,
  mention_kind TEXT NOT NULL,
  text TEXT NOT NULL,
  receiver_text TEXT,
  argument_arity INTEGER,
  containing_declaration_id INTEGER NOT NULL,
  line_start INTEGER NOT NULL,
  line_end INTEGER NOT NULL,
  CONSTRAINT pk_cs_mentions PRIMARY KEY (id),
  FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE,
  FOREIGN KEY (containing_declaration_id) REFERENCES cs_declarations (id) ON DELETE CASCADE
) STRICT;

CREATE TABLE symbols (
  id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  assembly_id INTEGER,
  file_id INTEGER,
  declaration_id INTEGER,
  symbol_kind TEXT NOT NULL,
  simple_name TEXT NOT NULL,
  qualified_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  signature TEXT,
  containing_symbol_id INTEGER,
  base_symbol_name TEXT,
  is_external_stub INTEGER NOT NULL,
  visibility TEXT,
  skeleton_content TEXT,
  line_start INTEGER,
  line_end INTEGER,
  CONSTRAINT pk_symbols PRIMARY KEY (id),
  CONSTRAINT uq_symbols_qualified_name UNIQUE (qualified_name, assembly_id),
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
  FOREIGN KEY (assembly_id) REFERENCES assemblies (id) ON DELETE SET NULL,
  FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE SET NULL,
  FOREIGN KEY (declaration_id) REFERENCES cs_declarations (id) ON DELETE SET NULL,
  FOREIGN KEY (containing_symbol_id) REFERENCES symbols (id) ON DELETE SET NULL
) STRICT;

CREATE TABLE symbol_edges (
  id INTEGER NOT NULL,
  from_symbol_id INTEGER NOT NULL,
  to_symbol_id INTEGER NOT NULL,
  edge_kind TEXT NOT NULL,
  source_file_id INTEGER,
  CONSTRAINT pk_symbol_edges PRIMARY KEY (id),
  FOREIGN KEY (from_symbol_id) REFERENCES symbols (id) ON DELETE CASCADE,
  FOREIGN KEY (to_symbol_id) REFERENCES symbols (id) ON DELETE CASCADE,
  FOREIGN KEY (source_file_id) REFERENCES files (id) ON DELETE SET NULL
) STRICT;

CREATE TABLE semantic_bindings (
  id INTEGER NOT NULL,
  mention_id INTEGER NOT NULL,
  source_symbol_id INTEGER NOT NULL,
  target_symbol_id INTEGER,
  binding_kind TEXT NOT NULL,
  resolution_status TEXT NOT NULL,
  confidence REAL,
  CONSTRAINT pk_semantic_bindings PRIMARY KEY (id),
  FOREIGN KEY (mention_id) REFERENCES cs_mentions (id) ON DELETE CASCADE,
  FOREIGN KEY (source_symbol_id) REFERENCES symbols (id) ON DELETE CASCADE,
  FOREIGN KEY (target_symbol_id) REFERENCES symbols (id) ON DELETE SET NULL
) STRICT;

CREATE TABLE assets (
  id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  file_id INTEGER NOT NULL,
  asset_kind TEXT NOT NULL,
  guid TEXT NOT NULL,
  name TEXT NOT NULL,
  vfs_root_path TEXT NOT NULL,
  CONSTRAINT pk_assets PRIMARY KEY (id),
  CONSTRAINT uq_assets_guid UNIQUE (project_id, guid),
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
  FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE
) STRICT;

CREATE TABLE entities (
  id INTEGER NOT NULL,
  asset_id INTEGER NOT NULL,
  yaml_object_id INTEGER,
  entity_kind TEXT NOT NULL,
  local_key TEXT NOT NULL,
  name TEXT,
  hierarchy_name TEXT,
  hierarchy_order INTEGER NOT NULL DEFAULT 0,
  type_name TEXT NOT NULL,
  script_symbol_id INTEGER,
  parent_entity_id INTEGER,
  source_entity_id INTEGER,
  line_start INTEGER NOT NULL,
  line_end INTEGER NOT NULL,
  generated_content TEXT,
  CONSTRAINT pk_entities PRIMARY KEY (id),
  FOREIGN KEY (asset_id) REFERENCES assets (id) ON DELETE CASCADE,
  FOREIGN KEY (yaml_object_id) REFERENCES yaml_objects (id) ON DELETE CASCADE,
  FOREIGN KEY (script_symbol_id) REFERENCES symbols (id) ON DELETE SET NULL,
  FOREIGN KEY (parent_entity_id) REFERENCES entities (id) ON DELETE SET NULL,
  FOREIGN KEY (source_entity_id) REFERENCES entities (id) ON DELETE SET NULL
) STRICT;

CREATE TABLE entity_edges (
  id INTEGER NOT NULL,
  from_entity_id INTEGER NOT NULL,
  to_entity_id INTEGER NOT NULL,
  edge_kind TEXT NOT NULL,
  edge_subkind TEXT,
  CONSTRAINT pk_entity_edges PRIMARY KEY (id),
  FOREIGN KEY (from_entity_id) REFERENCES entities (id) ON DELETE CASCADE,
  FOREIGN KEY (to_entity_id) REFERENCES entities (id) ON DELETE CASCADE
) STRICT;

CREATE TABLE entity_symbol_edges (
  id INTEGER NOT NULL,
  from_entity_id INTEGER NOT NULL,
  to_symbol_id INTEGER NOT NULL,
  edge_kind TEXT NOT NULL,
  edge_subkind TEXT,
  source_field_path TEXT,
  CONSTRAINT pk_entity_symbol_edges PRIMARY KEY (id),
  FOREIGN KEY (from_entity_id) REFERENCES entities (id) ON DELETE CASCADE,
  FOREIGN KEY (to_symbol_id) REFERENCES symbols (id) ON DELETE CASCADE
) STRICT;

CREATE TABLE vfs_entries (
  id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  entry_type TEXT NOT NULL,
  entry_kind TEXT NOT NULL,
  file_family TEXT,
  vfs_path TEXT NOT NULL,
  parent_vfs_path TEXT,
  host_file_id INTEGER,
  source_file_id INTEGER,
  source_symbol_id INTEGER,
  source_entity_id INTEGER,
  display_name TEXT NOT NULL,
  child_order INTEGER NOT NULL DEFAULT 2000000000,
  content TEXT,
  meta_content TEXT,
  line_start INTEGER,
  line_end INTEGER,
  size_bytes INTEGER NOT NULL,
  target_vfs_path TEXT,
  projection_kind TEXT,
  source_vfs_path TEXT,
  source_owner_vfs_path TEXT,
  instance_root_vfs_path TEXT,
  vfs_logical_key TEXT,
  source_logical_key TEXT,
  materialization_generation INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT pk_vfs_entries PRIMARY KEY (id),
  CONSTRAINT uq_vfs_entries_path UNIQUE (project_id, vfs_path),
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
  FOREIGN KEY (host_file_id) REFERENCES files (id) ON DELETE CASCADE,
  FOREIGN KEY (source_file_id) REFERENCES files (id) ON DELETE SET NULL,
  FOREIGN KEY (source_symbol_id) REFERENCES symbols (id) ON DELETE SET NULL,
  FOREIGN KEY (source_entity_id) REFERENCES entities (id) ON DELETE SET NULL
) STRICT;

CREATE TABLE vfs_edges (
  id INTEGER NOT NULL,
  from_entry_id INTEGER NOT NULL,
  to_entry_id INTEGER NOT NULL,
  edge_kind TEXT NOT NULL,
  edge_subkind TEXT,
  CONSTRAINT pk_vfs_edges PRIMARY KEY (id),
  FOREIGN KEY (from_entry_id) REFERENCES vfs_entries (id) ON DELETE CASCADE,
  FOREIGN KEY (to_entry_id) REFERENCES vfs_entries (id) ON DELETE CASCADE
) STRICT;

CREATE INDEX idx_vfs_entries_source_file_id
ON vfs_entries (source_file_id);

CREATE INDEX idx_vfs_entries_host_generation
ON vfs_entries (project_id, host_file_id, materialization_generation);

CREATE INDEX idx_vfs_entries_source_symbol_id
ON vfs_entries (source_symbol_id);

CREATE INDEX idx_vfs_entries_source_entity_id
ON vfs_entries (source_entity_id);

CREATE INDEX idx_vfs_entries_logical_key
ON vfs_entries (project_id, vfs_logical_key);

CREATE INDEX idx_vfs_entries_source_logical_key
ON vfs_entries (project_id, source_logical_key);

CREATE INDEX idx_vfs_entries_file_generation
ON vfs_entries (project_id, source_file_id, materialization_generation);

CREATE INDEX idx_vfs_entries_generation_id
ON vfs_entries (project_id, materialization_generation, id);

CREATE UNIQUE INDEX uq_vfs_edges_semantic
ON vfs_edges (
  from_entry_id,
  to_entry_id,
  edge_kind,
  COALESCE(edge_subkind, '')
);

CREATE TABLE index_diagnostics (
  id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  severity TEXT NOT NULL,
  category TEXT NOT NULL,
  code TEXT,
  stage TEXT,
  file_path TEXT,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL,
  CONSTRAINT pk_index_diagnostics PRIMARY KEY (id),
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
) STRICT;

CREATE TABLE rebuild_summary (
  project_id INTEGER NOT NULL,
  mode TEXT NOT NULL,
  discovered_file_count INTEGER NOT NULL,
  diagnostic_count INTEGER NOT NULL,
  completed_stages_json TEXT NOT NULL,
  published_index_path TEXT NOT NULL,
  created_at TEXT NOT NULL,
  CONSTRAINT pk_rebuild_summary PRIMARY KEY (project_id),
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
) STRICT;
`;
var vc = `CREATE INDEX IF NOT EXISTS idx_yaml_objects_local_identifier
ON yaml_objects (file_id, local_identifier);

CREATE INDEX IF NOT EXISTS idx_yaml_objects_game_object_file_id
ON yaml_objects (file_id, game_object_file_id);
`;
var Pc = `CREATE INDEX idx_files_guid ON files (guid);
CREATE INDEX idx_files_kind_project ON files (kind, project_id);
CREATE INDEX idx_files_meta_file_id ON files (meta_file_id);
CREATE INDEX idx_assembly_references_from_assembly ON assembly_references (from_assembly_id);
CREATE INDEX idx_yaml_objects_file_id ON yaml_objects (file_id);
CREATE INDEX idx_yaml_references_file_id ON yaml_references (file_id);
CREATE INDEX idx_yaml_references_target_guid ON yaml_references (target_guid);
CREATE INDEX idx_cs_declarations_file_id ON cs_declarations (file_id);
CREATE INDEX idx_cs_mentions_file_id ON cs_mentions (file_id);
CREATE INDEX idx_cs_mentions_containing_declaration ON cs_mentions (containing_declaration_id);
CREATE INDEX idx_symbols_file_id ON symbols (file_id);
CREATE INDEX idx_symbols_declaration_id ON symbols (declaration_id);
CREATE INDEX idx_symbols_containing_symbol ON symbols (containing_symbol_id);
CREATE INDEX idx_symbol_edges_from_symbol ON symbol_edges (from_symbol_id);
CREATE INDEX idx_symbol_edges_to_symbol ON symbol_edges (to_symbol_id);
CREATE INDEX idx_semantic_bindings_mention_id ON semantic_bindings (mention_id);
CREATE INDEX idx_semantic_bindings_source_symbol ON semantic_bindings (source_symbol_id);
CREATE INDEX idx_semantic_bindings_target_symbol ON semantic_bindings (target_symbol_id);
CREATE INDEX idx_assets_file_id ON assets (file_id);
CREATE INDEX idx_entities_asset_id ON entities (asset_id);
CREATE INDEX idx_entities_yaml_object_id ON entities (yaml_object_id);
CREATE INDEX idx_entities_parent_entity ON entities (parent_entity_id);
CREATE INDEX idx_entities_script_symbol ON entities (script_symbol_id);
CREATE INDEX idx_entity_edges_from_entity ON entity_edges (from_entity_id);
CREATE INDEX idx_entity_edges_to_entity ON entity_edges (to_entity_id);
CREATE INDEX idx_entity_symbol_edges_from_entity ON entity_symbol_edges (from_entity_id);
CREATE INDEX idx_entity_symbol_edges_to_symbol ON entity_symbol_edges (to_symbol_id);
CREATE INDEX idx_vfs_entries_parent_path ON vfs_entries (project_id, parent_vfs_path);
CREATE INDEX idx_vfs_entries_entry_kind ON vfs_entries (project_id, entry_kind);
CREATE INDEX idx_vfs_edges_to_entry_edge_kind ON vfs_edges (to_entry_id, edge_kind);
CREATE INDEX idx_vfs_edges_from_entry_edge_kind ON vfs_edges (from_entry_id, edge_kind);
`;
var xc = [
    "projects",
    "files",
    "assemblies",
    "assembly_references",
    "yaml_objects",
    "yaml_references",
    "cs_declarations",
    "cs_mentions",
    "symbols",
    "symbol_edges",
    "semantic_bindings",
    "assets",
    "entities",
    "entity_edges",
    "entity_symbol_edges",
    "vfs_entries",
    "vfs_edges",
    "index_diagnostics",
    "rebuild_summary",
  ],
  Tc = [
    "idx_files_guid",
    "idx_files_kind_project",
    "idx_files_meta_file_id",
    "idx_assembly_references_from_assembly",
    "idx_yaml_objects_file_id",
    "idx_yaml_objects_local_identifier",
    "idx_yaml_objects_game_object_file_id",
    "idx_yaml_references_file_id",
    "idx_yaml_references_source_object",
    "idx_yaml_references_target_guid",
    "idx_cs_declarations_file_id",
    "idx_cs_mentions_file_id",
    "idx_cs_mentions_containing_declaration",
    "idx_symbols_file_id",
    "idx_symbols_declaration_id",
    "idx_symbols_containing_symbol",
    "idx_symbol_edges_from_symbol",
    "idx_symbol_edges_to_symbol",
    "idx_semantic_bindings_mention_id",
    "idx_semantic_bindings_source_symbol",
    "idx_semantic_bindings_target_symbol",
    "idx_assets_file_id",
    "idx_entities_asset_id",
    "idx_entities_yaml_object_id",
    "idx_entities_parent_entity",
    "idx_entities_script_symbol",
    "idx_entity_edges_from_entity",
    "idx_entity_edges_to_entity",
    "idx_entity_symbol_edges_from_entity",
    "idx_entity_symbol_edges_to_symbol",
    "idx_vfs_entries_parent_path",
    "idx_vfs_entries_host_generation",
    "idx_vfs_entries_source_file_id",
    "idx_vfs_entries_source_symbol_id",
    "idx_vfs_entries_source_entity_id",
    "idx_vfs_entries_logical_key",
    "idx_vfs_entries_source_logical_key",
    "idx_vfs_entries_file_generation",
    "idx_vfs_entries_generation_id",
    "idx_vfs_entries_entry_kind",
    "idx_vfs_edges_to_entry_edge_kind",
    "idx_vfs_edges_from_entry_edge_kind",
    "uq_vfs_edges_semantic",
  ];
function Nc(e, t) {
  (e.exec("PRAGMA foreign_keys = ON"), e.exec(`PRAGMA user_version = ${t}`), e.exec(wc));
}
function Ys(e) {
  e.exec(vc);
}
function kc(e) {
  (Ys(e), e.exec(Pc));
}
function _h(e) {
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
function Yi(e) {
  return e.length > 0 && /^[\\/]+$/.test(e);
}
function Oc(e) {
  return e.replaceAll("/", "%2F").replaceAll("\\", "%5C");
}
function Sh(e) {
  return Yi(e) ? Oc(e) : e;
}
function $i(e) {
  return e === "gameobject" || e === "prefab_instance";
}
function tn(e, t) {
  return $i(t) ? Oc(e) : Sh(e);
}
function It(e, t) {
  let n = _h(t);
  return !n || e.endsWith(n) ? e : `${e}${n}`;
}
function Rh(e) {
  return e === "directory" || e === "container";
}
function $s(e) {
  return e.replace(/\\/g, "/").trim();
}
function Ac(e) {
  return e.length <= 1 ? e : e.replace(/\/+$/, "");
}
function $(e, t) {
  let n = $s(e);
  if (!n) return n;
  let i = Ac(n);
  return t && Rh(t) ? `${i}/` : i;
}
function _e(e, ...t) {
  let n = $s(e);
  for (let i of t) {
    let r = $s(i).replace(/^\/+/, "");
    if (r) {
      if (!n) {
        n = r;
        continue;
      }
      n = `${Ac(n)}/${r}`;
    }
  }
  return n;
}
function Ws(e) {
  return `file:${e}`;
}
function Vs(e) {
  return `file_content:${e}`;
}
function An(e) {
  return `entity:${e}`;
}
function je(e, t) {
  return `entity_file_local:${e}:${t}`;
}
function Wi(e, t) {
  return `symbol:${e}:${t}`;
}
function Un(e) {
  return `path:${e}`;
}
function qs(e) {
  return `link:entity:${e}:source_prefab`;
}
function Uc(e, t) {
  if (/^symbol:\d+:\d+$/.test(e) || !e.startsWith("symbol:")) return e;
  let n = Number.parseInt(e.slice(7), 10);
  return !Number.isFinite(n) || t === null ? e : Wi(t, n);
}
var Vi = new WeakSet();
function Lc(e) {
  (e.exec("BEGIN IMMEDIATE"), Vi.add(e));
}
function Mc(e) {
  (e.exec("COMMIT"), Vi.delete(e));
}
function wh(e) {
  try {
    e.exec("ROLLBACK");
  } finally {
    Vi.delete(e);
  }
}
function Fc(e) {
  return Vi.has(e);
}
function me(e, t) {
  if (Fc(e)) return t();
  Lc(e);
  try {
    let n = t();
    return (Mc(e), n);
  } catch (n) {
    return Dc(e, n);
  }
}
async function Cc(e, t) {
  if (Fc(e)) return t();
  Lc(e);
  try {
    let n = await t();
    return (Mc(e), n);
  } catch (n) {
    return Dc(e, n);
  }
}
function Dc(e, t) {
  try {
    wh(e);
  } catch (n) {
    throw new AggregateError([t, n], "Transaction failed and could not be rolled back.", { cause: t });
  }
  throw t;
}
import Mh from "node:path";
var qi = new Set([
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
  Bc = new Set([".fbx", ".dae", ".obj", ".blend", ".png", ".jpg", ".jpeg", ".tga", ".psd", ".wav", ".mp3", ".ogg"]),
  Gc = new Set([".bytes", ".dll", ".exe", ".so", ".dylib", ".a", ".bundle", ".zip", ".gz", ".7z", ".rar"]);
import Lh from "node:path";
import Kc from "node:path";
var vh = [
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
  Ph = [
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
  xh = [
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
  Th = new Map([
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
  Nh = new Map([
    [".shader", "shader_lab"],
    [".hlsl", "shader_include"],
    [".cginc", "shader_include"],
    [".shadergraph", "shader_graph"],
    [".shadersubgraph", "shader_graph"],
    [".uxml", "uxml"],
    [".uss", "uss"],
    [".json", "json_file"],
  ]),
  kh = new Map([
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
function zs(e, t, n) {
  return e.map((i) => ({ extension: i, assetKind: n.get(i) ?? "asset", ...t }));
}
var Oh = [
    { extension: ".unity", fileKind: "scene", assetKind: "scene", contentMode: "text", parserKind: "unity-yaml" },
    { extension: ".scene", fileKind: "scene", assetKind: "scene", contentMode: "text", parserKind: "unity-yaml" },
    { extension: ".prefab", fileKind: "prefab", assetKind: "prefab", contentMode: "text", parserKind: "unity-yaml" },
    { extension: ".cs", fileKind: "csharp", assetKind: "script", contentMode: "text", parserKind: "csharp" },
    { extension: ".asmdef", fileKind: "asmdef", assetKind: "asmdef", contentMode: "text", parserKind: "json" },
    { extension: ".meta", fileKind: "meta", assetKind: "meta", contentMode: "text", parserKind: "meta" },
    ...zs(vh, { fileKind: "yaml-asset", contentMode: "text", parserKind: "unity-yaml" }, Th),
    ...zs(Ph, { fileKind: "asset", contentMode: "text", parserKind: "none" }, Nh),
    ...zs(xh, { fileKind: "asset", contentMode: "binary", parserKind: "none" }, kh),
  ],
  Ah = new Map(Oh.map((e) => [e.extension, e]));
function Ft(e) {
  let t = Kc.posix.extname(e).toLowerCase();
  return Ah.get(t) ?? null;
}
function nt(e) {
  return e === "Packages/manifest.json"
    ? "json"
    : e.startsWith("ProjectSettings/")
      ? Uh(e)
        ? "unity-yaml"
        : "none"
      : (Ft(e)?.parserKind ?? "none");
}
function Ln(e) {
  return e === "Packages/manifest.json" || e.startsWith("ProjectSettings/") ? "text" : (Ft(e)?.contentMode ?? "text");
}
function Uh(e) {
  let t = Kc.posix.extname(e).toLowerCase();
  return t === ".asset" || t === ".yaml" || t === ".yml";
}
function Mn(e, t) {
  return Ln(e) !== "binary";
}
function zi(e, t) {
  if (!Mn(e, t)) return !1;
  let n = Lh.posix.extname(e).toLowerCase();
  return n === ".cs" || n === ".meta" || nt(e) === "unity-yaml" ? !0 : qi.has(n);
}
var Fh = new Set([
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
function Hi(e) {
  return `${e.replace(/\/+$/, "")}:/.content`;
}
function Yc(e, t, n) {
  if (!Mn(e, n)) return !1;
  let i = Mh.posix.extname(e).toLowerCase();
  if (Bc.has(i) || Gc.has(i)) return !1;
  if (qi.has(i) || i === ".cs") return !0;
  let r = t.trim().toLowerCase();
  return !!Fh.has(r);
}
function jc(e) {
  return e
    .prepare("PRAGMA table_info(vfs_entries)")
    .all()
    .some((n) => n.name === "vfs_logical_key");
}
function $c(e) {
  if (!jc(e)) return 0;
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
    let s = Uc(r.vfs_logical_key, r.source_file_id);
    s !== r.vfs_logical_key && (n.run(s, r.id), (i += 1));
  }
  return i;
}
function Ch(e) {
  let n = e.prepare("PRAGMA user_version").get()?.user_version ?? 0;
  return n > 0 ? n : (e.prepare("SELECT schema_version FROM projects WHERE id = 1").get()?.schema_version ?? 0);
}
function Wc(e) {
  let t = Ch(e);
  if (t !== 11)
    throw new Error(
      `Unsupported Unity Insight database schema version ${t}. Rebuild the index with 'unity-insight-cli index build'.`,
    );
  return ($c(e), t);
}
var Xs = 1;
async function qc(e) {
  let t = Vc.join(e, "ProjectSettings", "ProjectVersion.txt");
  try {
    await Dh(t, Gh.F_OK);
  } catch (n) {
    throw new Error(`Invalid Unity project root: missing required path ${t}`, { cause: n });
  }
}
async function zc(e) {
  try {
    await jh(e, { recursive: !0 });
  } catch (t) {
    throw new Error(`Failed to create Unity Insight index directory at ${e}`, { cause: t });
  }
}
async function Hc(e, t) {
  let n = Vc.join(e, "ProjectSettings", "ProjectVersion.txt");
  try {
    return (await t(n, "utf8")).match(/m_EditorVersion:\s*(.+)\s*$/m)?.[1]?.trim() ?? null;
  } catch {
    return null;
  }
}
function Xc(e) {
  let t = new Kh(e);
  return (Yh(t), t.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='projects'").get() && Wc(t), t);
}
function Yh(e) {
  (e.exec("PRAGMA foreign_keys = ON"),
    e.exec("PRAGMA journal_mode = WAL"),
    e.exec("PRAGMA synchronous = NORMAL"),
    e.exec("PRAGMA cache_size = -32768"),
    e.exec("PRAGMA temp_store = FILE"));
}
function Jc(e) {
  e.exec("PRAGMA wal_checkpoint(TRUNCATE)");
}
var Cn = class extends Error {
  constructor(t) {
    (super(t), (this.name = "UnityInsightIndexNotFoundError"));
  }
};
function Qc(e, t, n) {
  (Nc(e, t.schemaVersion),
    me(e, () => {
      (e
        .prepare(
          `INSERT INTO projects (
          id,
          project_path,
          unity_version,
          indexed_at,
          schema_version
        ) VALUES (?, ?, ?, ?, ?)`,
        )
        .run(Xs, t.projectPath, t.unityVersion, t.indexedAt, t.schemaVersion),
        e
          .prepare(
            `INSERT INTO rebuild_summary (
          project_id,
          mode,
          discovered_file_count,
          diagnostic_count,
          completed_stages_json,
          published_index_path,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          )
          .run(
            Xs,
            n.mode,
            n.summary.discoveredFileCount,
            n.summary.diagnosticCount,
            JSON.stringify(n.completedStages),
            n.publishedIndexPath,
            n.createdAt,
          ));
    }));
}
function Zc(e, t, n) {
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
  me(e, () => {
    t.forEach((r, s) => {
      i.run(s + 1, Xs, r.severity, r.category, r.code ?? null, r.stage ?? null, r.filePath ?? null, r.message, n);
    });
  });
}
function ed(e) {
  let t = e
      .prepare(
        `SELECT name
       FROM sqlite_schema
       WHERE type = 'table'
         AND name NOT LIKE 'sqlite_%'`,
      )
      .all()
      .map((c) => String(c.name)),
    n = xc.filter((c) => !t.includes(c));
  if (n.length > 0) throw new Error(`Finalize check failed: missing required tables ${n.join(", ")}`);
  let i = e
      .prepare(
        `SELECT name
       FROM sqlite_schema
       WHERE type = 'index'
         AND sql IS NOT NULL`,
      )
      .all()
      .map((c) => String(c.name)),
    r = Tc.filter((c) => !i.includes(c));
  if (r.length > 0) throw new Error(`Finalize check failed: missing required indexes ${r.join(", ")}`);
  let s = e.prepare("SELECT COUNT(*) AS count FROM projects").get(),
    o = e.prepare("SELECT COUNT(*) AS count FROM rebuild_summary").get();
  if (s.count !== 1) throw new Error(`Finalize check failed: expected exactly one project row, found ${s.count}`);
  if (o.count !== 1)
    throw new Error(`Finalize check failed: expected exactly one rebuild summary row, found ${o.count}`);
  let a = e
    .prepare(
      `SELECT COUNT(*) AS count
       FROM vfs_entries child
       LEFT JOIN vfs_entries parent
         ON parent.project_id = child.project_id
        AND parent.vfs_path = child.parent_vfs_path
       WHERE child.parent_vfs_path IS NOT NULL
         AND parent.id IS NULL`,
    )
    .get();
  if (a.count > 0) {
    let d = e
      .prepare(
        `SELECT child.vfs_path, child.parent_vfs_path, child.entry_type, child.entry_kind
         FROM vfs_entries child
         LEFT JOIN vfs_entries parent
           ON parent.project_id = child.project_id
          AND parent.vfs_path = child.parent_vfs_path
         WHERE child.parent_vfs_path IS NOT NULL
           AND parent.id IS NULL
         LIMIT 5`,
      )
      .all()
      .map((f) => `${f.vfs_path} (parent=${f.parent_vfs_path}, type=${f.entry_type}, kind=${f.entry_kind})`)
      .join("; ");
    throw new Error(`Finalize check failed: ${a.count} VFS entries have missing parents` + (d ? `: ${d}` : ""));
  }
  let l = e
    .prepare(
      `SELECT COUNT(*) AS count
       FROM vfs_entries source_entry
       LEFT JOIN vfs_entries target_entry
         ON target_entry.project_id = source_entry.project_id
        AND target_entry.vfs_path = source_entry.target_vfs_path
       WHERE source_entry.target_vfs_path IS NOT NULL
         AND target_entry.id IS NULL`,
    )
    .get();
  if (l.count > 0) throw new Error(`Finalize check failed: ${l.count} VFS entries have broken targets`);
}
async function Dn(e) {
  await Promise.all([Hs(`${e}-wal`, { force: !0 }), Hs(`${e}-shm`, { force: !0 })]);
}
async function td(e, t) {
  await Dn(t);
  try {
    await Bh(e, t);
  } catch (n) {
    throw new Error(`Failed to publish Unity Insight index to ${t}`, { cause: n });
  }
  await Dn(e);
}
async function Js(e) {
  await Promise.all([Hs(e, { force: !0 }), Dn(e)]);
}
import { randomUUID as $h } from "node:crypto";
import { mkdir as Wh, readFile as Vh, rm as jn, writeFile as qh } from "node:fs/promises";
import zh from "node:path";
import { DatabaseSync as Hh } from "node:sqlite";
var Xh = 5,
  Jh = 26,
  nn = class extends Error {
    code;
    constructor(t, n) {
      (super(t, n), (this.name = "UnityInsightIndexWriteLockError"), (this.code = n?.code ?? "failed"));
    }
  };
function eo(e) {
  return e instanceof nn && e.code === "busy";
}
var Qs = new Map();
function nd(e) {
  if (typeof e != "object" || e === null) return;
  let t = e.errcode;
  return typeof t == "number" ? t : void 0;
}
function id(e) {
  if (nd(e) === Xh) return !0;
  if (typeof e != "object" || e === null) return !1;
  let t = e.message;
  return typeof t == "string" && /database is locked/i.test(t);
}
function rd(e) {
  if (nd(e) === Jh) return !0;
  if (typeof e != "object" || e === null) return !1;
  let t = e.message;
  return typeof t == "string" && /not a database/i.test(t);
}
function Qh(e) {
  try {
    let t = JSON.parse(e.trim());
    return typeof t.token == "string" && t.token.length > 0 ? t.token : null;
  } catch {
    return null;
  }
}
async function Zh(e, t) {
  let n = `${JSON.stringify({ pid: t.pid, mode: t.mode, startedAt: t.startedAt, token: t.token })}
`;
  await qh(e, n, "utf8");
}
async function eI(e, t) {
  try {
    let n = await Vh(e, "utf8");
    if (Qh(n) !== t) return;
  } catch {
    return;
  }
  await jn(e, { force: !0 }).catch(() => {});
}
function Ji(e) {
  try {
    e.exec("ROLLBACK");
  } catch {}
  try {
    e.close();
  } catch {}
}
async function tI(e) {
  await Promise.all([
    jn(e, { force: !0 }),
    jn(`${e}-journal`, { force: !0 }),
    jn(`${e}-wal`, { force: !0 }),
    jn(`${e}-shm`, { force: !0 }),
  ]);
}
function Zs(e) {
  let t = new Hh(e);
  try {
    return (t.exec("PRAGMA busy_timeout = 0"), t.exec("BEGIN IMMEDIATE"), t);
  } catch (n) {
    throw (Ji(t), n);
  }
}
function nI(e) {
  for (let t = 0; ; t += 1) {
    let n = t === 0 ? e : `${e}.${t}`;
    try {
      return Zs(n);
    } catch (i) {
      if (!rd(i)) throw i;
    }
  }
}
function Xi(e, t) {
  return id(t)
    ? new nn(`Unity Insight index write is already running (lock: ${e}).`, { cause: t, code: "busy" })
    : new nn(`Failed to acquire Unity Insight index write lock at ${e}.`, { cause: t, code: "failed" });
}
async function Bn(e, t) {
  let n = e.indexLockPath,
    i = e.indexWriteLockDbPath;
  await Wh(zh.dirname(i), { recursive: !0 });
  let r = $h(),
    s = new Date().toISOString(),
    o = { indexLockPath: n, indexWriteLockDbPath: i, token: r, pid: process.pid, mode: t, startedAt: s },
    a = `${i}.acquire`,
    l;
  try {
    l = nI(a);
  } catch (c) {
    throw Xi(a, c);
  }
  try {
    let c;
    try {
      c = Zs(i);
    } catch (d) {
      if (id(d)) throw Xi(i, d);
      if (rd(d)) {
        await tI(i);
        try {
          c = Zs(i);
        } catch (f) {
          throw Xi(i, f);
        }
      } else throw Xi(i, d);
    }
    try {
      await Zh(n, o);
    } catch (d) {
      throw (
        Ji(c),
        new nn(`Failed to write Unity Insight index writer metadata at ${n}.`, { cause: d, code: "failed" })
      );
    }
    return (Qs.set(r, c), o);
  } finally {
    Ji(l);
  }
}
async function Gn(e) {
  let t = Qs.get(e.token);
  return t ? (Qs.delete(e.token), Ji(t), await eI(e.indexLockPath, e.token), !0) : !1;
}
import { randomUUID as iI } from "node:crypto";
import { existsSync as rI, readFileSync as sI, readdirSync as oI, statSync as aI } from "node:fs";
import { open as lI, rename as ld, rm as cd } from "node:fs/promises";
import it from "node:path";
var dd = /^index\.[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.db$/,
  cI = /^(index\.[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.db)(?:-wal|-shm)?$/,
  sd = 3,
  dI = 10,
  uI = 3,
  bt = class extends Error {
    constructor(t, n) {
      (super(t, n), (this.name = "UnityInsightIndexPointerError"));
    }
  },
  no = class extends Error {
    constructor(t, n) {
      (super(t, n), (this.name = "UnityInsightIndexResolutionRaceError"));
    }
  };
function fI(e) {
  return e instanceof bt && e.cause === void 0;
}
function mI(e, t) {
  if (
    !t.endsWith(`
`) ||
    t.slice(0, -1).includes(`
`) ||
    t.slice(0, -1).includes("\r")
  )
    throw new bt(
      `Corrupt Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath}: expected one generated database basename followed by a newline.`,
    );
  let n = t.slice(0, -1);
  if (!dd.test(n) || it.basename(n) !== n)
    throw new bt(
      `Corrupt Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath}: invalid selected database ${JSON.stringify(n)}.`,
    );
  return n;
}
function io(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = e.code;
  return t === "ENOENT" || t === "ENOTDIR";
}
function yI(e, t = aI) {
  try {
    return (t(e), !0);
  } catch (n) {
    if (io(n)) return !1;
    throw n;
  }
}
function to(e, t) {
  let n;
  try {
    n = sI(e.currentPointerPath, "utf8");
  } catch (r) {
    if (!io(r))
      throw new bt(`Failed to read Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath}.`, {
        cause: r,
      });
    return t(e.liveDbPath) ? { kind: "legacy", indexPath: e.liveDbPath } : { kind: "none" };
  }
  let i = mI(e, n);
  return { kind: "generated", pointerText: n, indexPath: it.join(e.indexDirectoryPath, i) };
}
function od(e) {
  return new Cn(
    `Unity Insight index not found for ${e.projectPath}. Checked pointer ${e.currentPointerPath} and legacy database ${e.liveDbPath}.`,
  );
}
function ad(e, t) {
  return e.kind !== t.kind
    ? !1
    : e.kind === "none"
      ? !0
      : e.kind === "legacy"
        ? t.kind === "legacy" && e.indexPath === t.indexPath
        : t.kind === "generated" && e.pointerText === t.pointerText && e.indexPath === t.indexPath;
}
function pI(e, t = {}) {
  let n = (i) => yI(i, t.statFile);
  for (let i = 0; i < uI; i += 1) {
    let r = to(e, n);
    if (r.kind === "none") {
      let o = to(e, n);
      if (!ad(r, o)) continue;
      throw od(e);
    }
    if (n(r.indexPath)) return r.indexPath;
    let s = to(e, n);
    if (ad(r, s))
      throw r.kind === "generated"
        ? new bt(
            `Corrupt Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath}: selected database is missing at ${r.indexPath}.`,
          )
        : od(e);
  }
  throw new no(`Unity Insight index selection kept changing while resolving a database path for ${e.projectPath}.`);
}
function Qi(e, t = {}) {
  try {
    return pI(e, t);
  } catch (n) {
    if (n instanceof Cn) return;
    throw n;
  }
}
function gI(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = e.code;
  return t === "EPERM" || t === "EBUSY" || t === "EACCES";
}
async function hI(e, t, n, i) {
  let r = i.renameFile ?? ld,
    s =
      i.wait ??
      ((o) =>
        new Promise((a) => {
          setTimeout(a, o);
        }));
  for (let o = 1; o <= sd; o += 1)
    try {
      await r(n, e.currentPointerPath);
      return;
    } catch (a) {
      if (o === sd || !gI(a))
        throw new bt(
          `Failed to replace Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath} with selected database ${it.join(e.indexDirectoryPath, t)}.`,
          { cause: a },
        );
      await s(dI * o);
    }
}
async function ud(e, t, n = {}) {
  let i = n.randomUUID ?? iI,
    r = `index.${i()}.db`,
    s = it.join(t.indexDirectoryPath, r);
  if (rI(s)) throw new Error(`Refusing to replace existing Unity Insight index generation at ${s}.`);
  let o = n.renameFile ?? ld;
  try {
    await o(e, s);
  } catch (l) {
    throw new Error(`Failed to publish Unity Insight index generation for ${t.projectPath} from ${e} to ${s}.`, {
      cause: l,
    });
  }
  await Dn(e);
  let a = it.join(t.indexDirectoryPath, `.index.current.${i()}.tmp`);
  try {
    let l = await lI(a, "wx");
    try {
      (await l.writeFile(
        `${r}
`,
        "utf8",
      ),
        await l.sync());
    } finally {
      await l.close();
    }
    await hI(t, r, a, n);
  } finally {
    await cd(a, { force: !0 }).catch(() => {});
  }
  return s;
}
function II(e, t) {
  if (it.dirname(t) !== e.indexDirectoryPath) return !1;
  let n = it.basename(t);
  return t === e.liveDbPath || dd.test(n);
}
async function fd(e) {
  let t = [];
  return (
    await Promise.all(
      [e, `${e}-wal`, `${e}-shm`].map(async (n) => {
        try {
          await cd(n, { force: !0 });
        } catch (i) {
          t.push({ path: n, error: i });
        }
      }),
    ),
    t
  );
}
async function md(e, t) {
  if (!II(e, t)) return [];
  let n;
  try {
    n = Qi(e);
  } catch (i) {
    return [{ path: e.currentPointerPath, error: i }];
  }
  return n === t ? [] : fd(t);
}
async function yd(e, t = {}) {
  let n;
  try {
    n = (t.resolveCurrentIndex ?? ((c) => Qi(c, { statFile: t.statFile })))(e);
  } catch (l) {
    if (!fI(l)) return [{ path: e.currentPointerPath, error: l }];
    n = void 0;
  }
  let i = t.readDirectory ?? oI,
    r;
  try {
    r = i(e.indexDirectoryPath);
  } catch (l) {
    return io(l) ? [] : [{ path: e.indexDirectoryPath, error: l }];
  }
  let s = new Set(),
    o = it.basename(e.liveDbPath);
  for (let l of r) {
    if (l === o || l === `${o}-wal` || l === `${o}-shm`) {
      s.add(e.liveDbPath);
      continue;
    }
    let c = cI.exec(l);
    c?.[1] && s.add(it.join(e.indexDirectoryPath, c[1]));
  }
  let a = [];
  for (let l of s) l !== n && a.push(...(await fd(l)));
  return a;
}
import { createHash as XR } from "node:crypto";
import { createReadStream as JR } from "node:fs";
import { readFile as Wm } from "node:fs/promises";
import { availableParallelism as Zi } from "node:os";
var bI = 8,
  EI = 32,
  _I = 4;
function er(e, t) {
  if (!e) return t;
  let n = Number.parseInt(e, 10);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function ro(e = process.env, t = Zi()) {
  let n = Math.max(1, Math.floor(t)),
    i = n <= 4 ? n - 1 : Math.floor(n * 0.75),
    r = Math.max(1, Math.min(bI, i)),
    s = er(e.UNITY_INSIGHT_INDEX_CPU_BUDGET, r);
  return Math.min(s, n);
}
function pd(e = process.env, t = Zi()) {
  return er(e.UNITY_INSIGHT_YAML_PARSE_CONCURRENCY, ro(e, t));
}
function gd(e = process.env, t = Zi()) {
  return er(e.UNITY_INSIGHT_FILE_PREPARE_CONCURRENCY, ro(e, t));
}
function hd(e = process.env, t = Zi()) {
  let n = Math.min(EI, Math.max(_I, ro(e, t) * 4));
  return er(e.UNITY_INSIGHT_DISCOVERY_FILE_CONCURRENCY, n);
}
function rt(e) {
  if (e <= 0) throw new Error("IN clause requires at least one value.");
  return Array.from({ length: e }, () => "?").join(", ");
}
function Be(e, t) {
  if (e <= 0) throw new Error("VALUES clause requires at least one row.");
  if (t <= 0) throw new Error("VALUES clause requires at least one column.");
  let n = `(${rt(t)})`;
  return Array.from({ length: e }, () => n).join(", ");
}
var so = 8192;
function Ct(e) {
  if (e <= 0) throw new Error("columnCount must be positive.");
  return Math.max(1, Math.floor(so / e));
}
var tr = 4096;
function Id(e) {
  if (!e) return { lowerBound: "", upperBound: "\uFFFF" };
  for (let t = e.length - 1; t >= 0; t -= 1) {
    let n = e.charCodeAt(t);
    if (n < 65535) return { lowerBound: e, upperBound: `${e.slice(0, t)}${String.fromCharCode(n + 1)}` };
  }
  return { lowerBound: e, upperBound: `${e}\uFFFF` };
}
function Se(e, t = tr) {
  if (t <= 0) throw new Error("chunkSize must be positive.");
  let n = [];
  for (let i = 0; i < e.length; i += t) n.push(e.slice(i, i + t));
  return n;
}
function Z(e, t, n, i = "") {
  if (n.length === 0) return [];
  let r = [];
  for (let s of Se(n)) {
    let o = rt(s.length),
      a = e.prepare(`${t}${o}${i}`).all(...s);
    for (let l of a) r.push(l);
  }
  return r;
}
function bd(e, t, n, i) {
  if (n.length === 0 || i <= 0) return [];
  if (i > so) throw new Error("bindRepeats exceeds the SQLite bind-parameter budget.");
  let r = Math.min(tr, Math.max(1, Math.floor(so / i))),
    s = [];
  for (let o of Se(n, r)) {
    let a = rt(o.length),
      l = Array.from({ length: i }, () => o).flat(),
      c = e.prepare(t(a)).all(...l);
    for (let d of c) s.push(d);
  }
  return s;
}
function st(e) {
  return [...new Set(e)].sort((t, n) => t - n);
}
function nr(e) {
  return e === "Packages/manifest.json"
    ? "package-manifest"
    : e === "Packages/packages-lock.json" || SI(e)
      ? (Ft(e)?.fileKind ?? null)
      : e.startsWith("ProjectSettings/")
        ? "project-settings"
        : e.startsWith("Assets/")
          ? (Ft(e)?.fileKind ?? null)
          : null;
}
function SI(e) {
  let t = e.split("/");
  return t.length >= 3 && t[0] === "Packages";
}
function Ed(e) {
  (e.exec("DELETE FROM entity_symbol_edges"),
    e.exec("DELETE FROM semantic_bindings"),
    e.exec("DELETE FROM symbol_edges"),
    e.exec("DELETE FROM symbols"));
}
function _d(e) {
  (Ed(e), e.exec("DELETE FROM entity_edges"), e.exec("DELETE FROM entities"), e.exec("DELETE FROM assets"));
}
function Sd(e, t) {
  let n = [...new Set(t)].sort((i, r) => i - r);
  if (n.length !== 0)
    for (let i of Se(n)) {
      let r = rt(i.length);
      e.prepare(
        `DELETE FROM vfs_edges
         WHERE from_entry_id IN (
           SELECT id FROM vfs_entries WHERE host_file_id IN (${r})
         )`,
      ).run(...i);
    }
}
function Et(e, t) {
  return e.prepare(`SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM ${t}`).get().next_id;
}
import oo from "node:path";
function rn(e) {
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
function Rd(e, t) {
  let n = e.filter((c) => c.kind === "asmdef"),
    i = e.filter((c) => c.kind === "csharp"),
    r = e.find((c) => c.kind === "package-manifest"),
    s = new Map();
  n.forEach((c) => {
    s.set(oo.posix.dirname(c.projectRelPath), c);
  });
  let o = n.flatMap((c) => {
      try {
        let d = rn(c.contentText ?? "{}");
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
            message: `Failed to parse asmdef: ${wd(d)}`,
          }),
          []
        );
      }
    }),
    a = new Set();
  i.forEach((c) => {
    wI(c.projectRelPath, s) || a.add(vI(c.projectRelPath));
  });
  let l = PI(r?.contentText ?? "{}", t, r?.projectRelPath);
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
function wI(e, t) {
  let n = oo.posix.dirname(e);
  for (; n !== "." && n !== "";) {
    let i = t.get(n);
    if (i) return i;
    n = oo.posix.dirname(n);
  }
}
function vI(e) {
  return e.toLowerCase().includes("/editor/") ? "Assembly-CSharp-Editor" : "Assembly-CSharp";
}
function PI(e, t, n) {
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
        message: `Failed to parse package manifest: ${wd(i)}`,
      }),
      []
    );
  }
}
function wd(e) {
  return e instanceof Error ? e.message : String(e);
}
import { createRequire as xI } from "node:module";
import xd from "../resources/web-tree-sitter/tree-sitter.cjs";
var vd = xI(import.meta.url),
  ao = null,
  Pd = xd;
async function Td() {
  return (
    ao ||
      (ao = (async () => {
        await xd.init({
          locateFile(n) {
            return __unityInsightFileURLToPath(new URL(`../resources/web-tree-sitter/${n}`, import.meta.url));
          },
        });
        let e = await Pd.Language.load(__unityInsightFileURLToPath(new URL("../resources/tree-sitter-c_sharp.wasm", import.meta.url))),
          t = new Pd();
        return (t.setLanguage(e), t);
      })()),
    ao
  );
}
var TI = new Set(["class_declaration", "interface_declaration", "struct_declaration"]),
  NI = new Set(["field_declaration", "event_declaration", "event_field_declaration", "indexer_declaration"]);
function Nd(e, t) {
  try {
    if (!TI.has(t.type)) return null;
    let n = kI(t);
    if (!n) return null;
    let i = e.indexOf("{", n.startIndex),
      r = e.lastIndexOf("}", t.endIndex);
    if (i < 0 || r < i || r > t.endIndex) return null;
    let s = e.slice(t.startIndex, i + 1).trimEnd();
    if (!s) return null;
    let o = OI(e, n).map((c) => e.slice(c.startIndex, c.endIndex).trimEnd()),
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
function kI(e) {
  return e.childForFieldName("body") ?? e.namedChildren.find((t) => t.type === "declaration_list") ?? null;
}
function OI(e, t) {
  let n = [],
    i = t.namedChildren;
  return (
    i.forEach((r, s) => {
      NI.has(r.type) && n.push({ startIndex: AI(e, i, s), endIndex: r.endIndex });
    }),
    n
  );
}
function AI(e, t, n) {
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
var UI = new Map([
  ["class_declaration", "class"],
  ["constructor_declaration", "constructor"],
  ["enum_declaration", "enum"],
  ["interface_declaration", "interface"],
  ["method_declaration", "method"],
  ["namespace_declaration", "namespace"],
  ["property_declaration", "property"],
  ["struct_declaration", "struct"],
]);
async function Od(e) {
  let n = (await Td()).parse(e);
  try {
    let i = [],
      r = [];
    return (Ad(n.rootNode, e, [], null, i, r), { declarations: i, mentions: r });
  } finally {
    n.delete();
  }
}
function Ad(e, t, n, i, r, s) {
  let o = UI.get(e.type),
    a = o ? e.childForFieldName("name") : null,
    l = null,
    c = n;
  if (o && a) {
    let f = a.text.split(".").pop() ?? a.text,
      m = [...n, a.text].join(".");
    ((l = {
      declKind: o,
      simpleName: f,
      qualifiedNameText: m,
      signatureText: CI(e.text),
      skeletonText: LI(o) ? Nd(t, e) : null,
      lineStart: e.startPosition.row + 1,
      lineEnd: e.endPosition.row + 1,
    }),
      r.push(l),
      (c = [...n, a.text]));
  }
  FI(e) && s.push(MI(e, i));
  let d = l ?? i;
  e.namedChildren.forEach((f) => {
    Ad(f, t, c, d, r, s);
  });
}
function LI(e) {
  return e === "class" || e === "interface" || e === "struct";
}
function MI(e, t) {
  return {
    mentionKind: e.type === "identifier" ? "identifier" : "qualified-name",
    text: e.text,
    receiverText: e.type === "member_access_expression" ? (e.childForFieldName("expression")?.text ?? null) : null,
    argumentArity: DI(e),
    containingDeclarationSimpleName: t?.simpleName ?? null,
    lineStart: e.startPosition.row + 1,
    lineEnd: e.endPosition.row + 1,
  };
}
function FI(e) {
  if (e.type === "identifier") {
    let t = e.parent;
    if (!t) return !1;
    let n = t.childForFieldName?.("name") ?? null;
    return !((n && jI(n, e)) || kd(e, ["member_access_expression", "qualified_name"]));
  }
  return kd(e, ["member_access_expression", "qualified_name"])
    ? !1
    : e.type === "member_access_expression" || e.type === "qualified_name";
}
function kd(e, t) {
  let n = e.parent;
  for (; n;) {
    if (t.includes(n.type)) return !0;
    n = n.parent;
  }
  return !1;
}
function CI(e) {
  return e.split(/\r?\n/, 1)[0]?.trim() ?? "";
}
function DI(e) {
  let t =
    (e.type === "member_access_expression" && e.parent?.type === "invocation_expression") ||
    e.parent?.type === "invocation_expression"
      ? e.parent
      : null;
  if (!t) return null;
  let n = t.childForFieldName("arguments") ?? t.namedChildren.find((i) => i.type === "argument_list") ?? null;
  return n ? n.namedChildren.filter((i) => i.type !== ",").length : 0;
}
function jI(e, t) {
  return e.type === t.type && e.startIndex === t.startIndex && e.endIndex === t.endIndex;
}
var Ud = 1;
function Ld(e, t) {
  let n = e.prepare(`INSERT INTO files (
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  me(e, () => {
    [...t]
      .sort((i, r) => (i.kind === r.kind ? i.id - r.id : i.kind === "meta" ? -1 : 1))
      .forEach((i) => {
        n.run(
          i.id,
          Ud,
          i.projectRelPath,
          i.absolutePath,
          i.kind,
          i.guid,
          i.metaFileId,
          i.sizeBytes,
          i.mtimeMs,
          i.contentHash,
          i.importerType,
        );
      });
  });
}
function Md(e, t) {
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
  me(e, () => {
    (t.forEach((s, o) => {
      let a = o + 1;
      (n.set(s.name, a), i.run(a, Ud, s.name, s.source, s.rootNamespace, s.isEditorOnly));
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
function Fd(e, t, n) {
  let i = BI(e);
  me(e, () => {
    i.writeRows(t, n);
  });
}
function BI(e) {
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
function Cd(e, t, n) {
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
  me(e, () => {
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
      GI(e, n));
  });
}
function GI(e, t) {
  if (t.length === 0) return;
  let n = 9,
    i = Ct(n),
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
    s = t.length >= i ? e.prepare(`${r}${Be(i, n)}`) : null;
  for (let o of Se(t, i))
    (o.length === i ? s : e.prepare(`${r}${Be(o.length, n)}`)).run(
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
import { readdir as tb, readFile as nb, realpath as ib } from "node:fs/promises";
import _t from "node:path";
import { stat as KI } from "node:fs/promises";
async function ir(e) {
  try {
    return await KI(e);
  } catch {
    return null;
  }
}
async function Dt(e) {
  return (await ir(e))?.isDirectory() ?? !1;
}
function Kn(e) {
  let t = e.match(/^guid:\s*(.+)\s*$/m),
    n = e.match(/^([A-Za-z0-9_]+Importer):\s*$/m),
    i = e.match(/^ {2}mainObjectFileID:\s*(\d+)\s*$/m);
  return {
    guid: t?.[1] ?? null,
    importerType: n?.[1] ?? null,
    mainObjectFileId: i ? Number(i[1]) : null,
    fileIdToName: lo(e),
  };
}
function lo(e) {
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
function Dd(e) {
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
import { fileURLToPath as YI } from "node:url";
import { readdir as Bd, readFile as $I, realpath as WI } from "node:fs/promises";
import Re from "node:path";
var VI = { embedded: 0, "local-file": 1, "package-cache": 2 };
async function Gd(e) {
  let t = Re.resolve(e),
    n = [],
    i = await qI(t, n),
    r = await zI(t, n),
    s = [...(await HI(t, n)), ...(await XI(t, i, n)), ...(await QI(t, i, r, n))];
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
async function qI(e, t) {
  let n = Re.join(e, "Packages", "manifest.json"),
    i = await yo(n, t, { filePath: "Packages/manifest.json", missingIsDiagnostic: !1 }),
    r = new Map(),
    s = i && sn(i) && sn(i.dependencies) ? i.dependencies : {};
  for (let [o, a] of Object.entries(s)) typeof a == "string" && r.set(o, a);
  return r;
}
async function zI(e, t) {
  let n = Re.join(e, "Packages", "packages-lock.json"),
    i = await yo(n, t, { filePath: "Packages/packages-lock.json", missingIsDiagnostic: !1 }),
    r = new Map(),
    s = i && sn(i) && sn(i.dependencies) ? i.dependencies : {};
  for (let [o, a] of Object.entries(s)) {
    if (!sn(a)) continue;
    let l = a.version,
      c = a.source;
    r.set(o, { version: typeof l == "string" ? l : void 0, source: typeof c == "string" ? c : void 0 });
  }
  return r;
}
async function HI(e, t) {
  let n = Re.join(e, "Packages"),
    i = await Bd(n, { withFileTypes: !0 }).catch(() => []);
  return (
    await Promise.all(
      i.map(async (s) => {
        if (s.name === "manifest.json" || s.name === "packages-lock.json") return null;
        let o = Re.join(n, s.name);
        if (!(await Dt(o))) return null;
        let l =
          (await mo(o, t, `Packages/${s.name}/package.json`, { fallbackName: s.name, diagnosticOnFallback: !1 })) ??
          (eb(s.name) ? s.name : null);
        return l
          ? fo({ packageName: l, physicalRoot: o, sourceKind: "embedded", diagnosticPath: `Packages/${l}` })
          : null;
      }),
    )
  ).filter((s) => s !== null);
}
async function XI(e, t, n) {
  let i = [];
  for (let [r, s] of t) {
    if (!uo(s)) continue;
    let o = ZI(e, s);
    if (!(await Dt(o))) {
      n.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: "Packages/manifest.json",
        message: `Skipped local package ${r}; package root does not exist: ${o}.`,
      });
      continue;
    }
    let a = (await mo(o, n, "Packages/manifest.json", { fallbackName: r, diagnosticOnFallback: !0 })) ?? r;
    i.push(
      await fo({ packageName: a, physicalRoot: o, sourceKind: "local-file", diagnosticPath: "Packages/manifest.json" }),
    );
  }
  return i;
}
var JI = new Set(["registry", "builtin"]);
async function QI(e, t, n, i) {
  let r = [],
    s = Re.join(e, "Library", "PackageCache"),
    o = new Set(t.keys()),
    a = new Set(n.keys());
  for (let [l, c] of n) {
    if (!c.version || (c.source !== void 0 && !JI.has(c.source)) || uo(t.get(l) ?? "")) continue;
    let d = Re.join(s, `${l}@${c.version}`);
    if (await Dt(d)) {
      r.push(await co(l, d, i, "Packages/packages-lock.json"));
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
      let f = await jd(s, l, i);
      f && r.push(await co(l, f, i, "Packages/packages-lock.json"));
    }
  }
  for (let l of o) {
    if (n.size > 0 || a.has(l) || uo(t.get(l) ?? "")) continue;
    let c = await jd(s, l, i);
    c && r.push(await co(l, c, i, "Packages/manifest.json"));
  }
  return r;
}
async function co(e, t, n, i) {
  let r = (await mo(t, n, i, { fallbackName: e, diagnosticOnFallback: !1 })) ?? e;
  return fo({ packageName: r, physicalRoot: t, sourceKind: "package-cache", diagnosticPath: i });
}
async function jd(e, t, n) {
  let i = await Bd(e, { withFileTypes: !0 }).catch(() => []),
    r = (
      await Promise.all(
        i.map(async (s) => {
          let o = Re.join(e, s.name);
          return !s.name.startsWith(`${t}@`) || !(await Dt(o)) ? null : o;
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
        message: `Multiple package cache directories match ${t}; using ${Re.basename(r.at(-1) ?? r[0] ?? "")}.`,
      }),
    r.at(-1) ?? null
  );
}
async function fo(e) {
  let t = Re.resolve(e.physicalRoot),
    n = await WI(t);
  return {
    packageName: e.packageName,
    physicalRoot: t,
    realRoot: n,
    virtualRoot: `Packages/${e.packageName}`,
    sourceKind: e.sourceKind,
    priority: VI[e.sourceKind],
    diagnosticPath: e.diagnosticPath,
  };
}
async function mo(e, t, n, i) {
  let r = Re.join(e, "package.json"),
    s = await yo(r, t, { filePath: n, missingIsDiagnostic: i.diagnosticOnFallback }),
    o = s && sn(s) && typeof s.name == "string" ? s.name : null;
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
async function yo(e, t, n) {
  try {
    return JSON.parse(await $I(e, "utf8"));
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
function uo(e) {
  return e.startsWith("file:");
}
function ZI(e, t) {
  if (t.startsWith("file://"))
    try {
      return YI(t);
    } catch {
      return Re.resolve(Re.join(e, "Packages"), t.slice(7));
    }
  return Re.resolve(Re.join(e, "Packages"), t.slice(5));
}
function eb(e) {
  return /^[a-z0-9]+(?:[.-][a-z0-9]+)+$/i.test(e);
}
function sn(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
async function rb(e, t, n) {
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
async function Kd(e, t = {}) {
  let n = _t.resolve(e),
    i = [],
    s = (t.includePackages ?? !0) ? await Gd(n) : { sources: [], diagnostics: [] };
  i.push(...s.diagnostics);
  let o = [
      ...(await po({ physicalRoot: _t.join(n, "Assets"), virtualRoot: "Assets", diagnostics: i })),
      ...(await po({ physicalRoot: _t.join(n, "ProjectSettings"), virtualRoot: "ProjectSettings", diagnostics: i })),
      ...(await sb(n)),
      ...(
        await Promise.all(
          s.sources.map((l) => po({ physicalRoot: l.physicalRoot, virtualRoot: l.virtualRoot, diagnostics: i })),
        )
      ).flat(),
    ],
    a = await rb(o, hd(), async ({ absolutePath: l, projectRelPath: c, sizeBytes: d, mtimeMs: f }) => {
      let m = nr(c);
      if (!m) return null;
      let y = { projectRelPath: c, absolutePath: l, kind: m, sizeBytes: d, mtimeMs: f };
      if (m !== "meta") return y;
      let p = Kn(await nb(l, "utf8"));
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
async function sb(e) {
  let t = [
    { absolutePath: _t.join(e, "Packages", "manifest.json"), projectRelPath: "Packages/manifest.json" },
    { absolutePath: _t.join(e, "Packages", "packages-lock.json"), projectRelPath: "Packages/packages-lock.json" },
  ];
  return (
    await Promise.all(
      t.map(async (i) => {
        let r = await ir(i.absolutePath);
        return r?.isFile() ? { ...i, sizeBytes: r.size, mtimeMs: Math.trunc(r.mtimeMs) } : null;
      }),
    )
  ).filter((i) => i !== null);
}
async function po(e) {
  return (await Dt(e.physicalRoot)) ? Yd(e.physicalRoot, e.physicalRoot, e.virtualRoot, e.diagnostics, new Set()) : [];
}
async function Yd(e, t, n, i, r) {
  let s;
  try {
    s = await ib(t);
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
  let o = await tb(t, { withFileTypes: !0 }).catch(
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
        let c = _t.join(t, l.name),
          d = await ir(c);
        if (!d) return [];
        if (l.name.endsWith("~") && d.isDirectory()) return [];
        if (d.isDirectory()) return Yd(e, c, n, i, r);
        if (!d.isFile()) return [];
        let f = ob(_t.relative(e, c));
        return f.startsWith("../") || f === ".."
          ? (i.push({
              severity: "warning",
              category: "discovery",
              stage: "discovery",
              filePath: n,
              message: `Skipped file outside discovery root: ${c}.`,
            }),
            [])
          : [{ absolutePath: c, projectRelPath: `${n}/${f}`, sizeBytes: d.size, mtimeMs: Math.trunc(d.mtimeMs) }];
      }),
    )
  ).flat();
}
function ob(e) {
  return e.split(_t.sep).join("/");
}
var Le = Rc(Xa(), 1);
function Wt(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  let n = e[t];
  return typeof n == "string" ? n : typeof n == "number" ? String(n) : typeof n == "bigint" ? n.toString() : null;
}
function ns(e, t, n, i) {
  if (Array.isArray(e)) {
    e.forEach((r, s) => {
      ns(r, t, `${n}[${s}]`, i);
    });
    return;
  }
  if (!(!e || typeof e != "object")) {
    if (LR(e)) {
      let r = Wt(e, "guid"),
        s = Wt(e, "fileID"),
        o = Wt(e, "localIdentifierInFile");
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
      ns(s, t, o, i);
    });
  }
}
function LR(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  let t = Object.keys(e);
  return t.includes("fileID") || t.includes("guid") || t.includes("localIdentifierInFile");
}
var Um = {
    gameObjectFileId: 1,
    parentTransformLocalId: 2,
    childTransformLocalIds: 4,
    prefabInstanceLocalId: 8,
    prefabTransformParentLocalId: 16,
    prefabRootName: 32,
  },
  Lm = new WeakMap();
function Mm(e) {
  let t = bi(e, /^[ \t]*m_GameObject\s*:/m, /m_GameObject:\s*\{\s*fileID:\s*([^,}\s]+)/),
    n = bi(e, /^[ \t]*m_Father\s*:/m, /m_Father:\s*\{\s*fileID:\s*([^,}\s]+)/),
    i = FR(e),
    r = bi(e, /^[ \t]*m_PrefabInstance\s*:/m, /m_PrefabInstance:\s*\{\s*fileID:\s*([^,}\s]+)/),
    s = bi(e, /^[ \t]*m_SourcePrefab\s*:/m, /m_SourcePrefab:\s*\{[^}]*guid:\s*([^,}\s]+)/),
    o = bi(e, /^[ \t]*m_TransformParent\s*:/m, /m_TransformParent:\s*\{\s*fileID:\s*([^,}\s]+)/),
    a = CR(e),
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
  for (let [f, m] of d) m.covered && (c |= Um[f]);
  return (Lm.set(l, c), l);
}
function Fm(e, t) {
  return {
    gameObjectFileId: t?.gameObjectFileId ?? Ne(e, ["m_GameObject"]),
    parentTransformLocalId: t?.parentTransformLocalId ?? Ne(e, ["m_Father"]),
    childTransformLocalIds: t?.childTransformLocalIds ?? jm(e, ["m_Children"]),
    prefabInstanceLocalId: t?.prefabInstanceLocalId ?? Ne(e, ["m_PrefabInstance"]),
  };
}
function Ne(e, t) {
  let n = e;
  for (let i of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return null;
    n = n[i];
  }
  return hn(n);
}
function hn(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  let t = e,
    n = Ja(t.fileID);
  if (n) return n;
  let i = Ja(t.m_FileID),
    r = Ja(t.m_PathID);
  return i ? null : r;
}
function MR(e, t) {
  let n = BR();
  if (!t || typeof t != "object" || Array.isArray(t)) return n;
  let i = Ne(t, ["m_PrefabInstance"]);
  if (e === "Transform" || e === "RectTransform")
    return {
      ...n,
      gameObjectFileId: Ne(t, ["m_GameObject"]),
      parentTransformLocalId: Ne(t, ["m_Father"]),
      childTransformLocalIds: jm(t, ["m_Children"]),
      prefabInstanceLocalId: i,
    };
  if (e === "PrefabInstance") {
    let r = t.m_Modification;
    return {
      ...n,
      prefabInstanceLocalId: i,
      prefabTransformParentLocalId: Ne(r, ["m_TransformParent"]),
      prefabRootName: jR(r),
    };
  }
  return { ...n, prefabInstanceLocalId: i };
}
function Cm(e, t, n, i = new Map()) {
  let r = new Map();
  for (let s of e) {
    let o = t.get(s.id),
      a = o ? (Lm.get(o) ?? 0) : 0,
      l,
      c = () => ((l ??= MR(s.objectType, DR(s, i))), l),
      d = (m) => {
        let y = o?.[m];
        return y != null || (a & Um[m]) !== 0 ? y : c()[m];
      },
      f = n.get(s.id);
    r.set(s.id, {
      gameObjectFileId: d("gameObjectFileId"),
      parentTransformLocalId: d("parentTransformLocalId"),
      childTransformLocalIds: d("childTransformLocalIds"),
      prefabInstanceLocalId: d("prefabInstanceLocalId"),
      sourcePrefabGuid: f?.get("m_SourcePrefab") ?? o?.sourcePrefabGuid ?? null,
      prefabTransformParentLocalId: d("prefabTransformParentLocalId"),
      prefabRootName: d("prefabRootName"),
    });
  }
  return r;
}
function Vt(e, t) {
  let n = e;
  for (let i of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return null;
    n = n[i];
  }
  return typeof n == "string" ? (n === "0" ? null : n) : typeof n == "number" ? (n === 0 ? null : String(n)) : null;
}
function Dm(e, t) {
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
function jm(e, t) {
  let n = e;
  for (let i of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return [];
    n = n[i];
  }
  return Array.isArray(n) ? n.map((i) => hn(i)).filter((i) => i !== null) : [];
}
function bi(e, t, n) {
  let i = e.match(n),
    r = i?.[1];
  return { value: r === void 0 ? null : Qa(r), covered: i !== null || !t.test(e) };
}
function FR(e) {
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
          .map(Qa),
        covered: !0,
      };
}
function CR(e) {
  let t = e.match(/propertyPath:\s*m_Name\s*\n\s*value:\s*([^\n\r]+)/m),
    n = t?.[1]?.trim();
  return { value: n ? Qa(n) : null, covered: t !== null || !/^[ \t]*(?:-\s*)?propertyPath:\s*m_Name\s*$/m.test(e) };
}
function Qa(e) {
  return Buffer.from(e, "utf8").toString("utf8");
}
function DR(e, t) {
  if (typeof t == "function") return t(e);
  if (!t.has(e.id)) throw new Error(`YAML payload ${e.id} was not hydrated for metadata enrichment.`);
  return t.get(e.id);
}
function jR(e) {
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
function Ja(e) {
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
function BR() {
  return {
    gameObjectFileId: null,
    parentTransformLocalId: null,
    sourcePrefabGuid: null,
    prefabTransformParentLocalId: null,
    prefabRootName: null,
  };
}
var Bm = { intAsBigInt: !0, uniqueKeys: !1 };
function Km() {
  return { splitBlocksMs: 0, parseDocumentsMs: 0, collectReferencesMs: 0 };
}
function is(e) {
  return e.length >= 5 && e.subarray(0, 5).toString("ascii") === "%YAML";
}
function Ym(e, t) {
  let n = t ? Date.now() : 0,
    i = /^--- !u!(\d+)\s+&([^\s]+)(?:\s+.*)?$/gm,
    r = [...e.matchAll(i)],
    s = 1,
    o = e.indexOf(`
`),
    a = 0,
    l = (f) => {
      if (f < a) throw new Error(`lineNumberAt requires non-decreasing offsets, received ${f} after ${a}`);
      for (a = f; o >= 0 && o < f;)
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
    r.forEach((f, m) => {
      let y = f.index ?? 0,
        p = m + 1 < r.length ? (r[m + 1].index ?? e.length) : e.length,
        g = e.indexOf(
          `
`,
          y,
        );
      if (g < 0 || g >= p) return;
      let I = e
        .slice(g + 1, p)
        .trimEnd()
        .replace(
          /\r\n/g,
          `
`,
        );
      if (I.length === 0) return;
      let b = Number(f[1]),
        E = f[2] ?? null,
        w = I.indexOf(`
`),
        R = (w < 0 ? I : I.slice(0, w)).match(/^([A-Za-z0-9_]+):\s*$/);
      if (!R) return;
      let v = R[1],
        O = t ? Date.now() : 0,
        N = GR(I),
        D = { objectType: v, rootObjectCount: 0, nameCount: 0, name: null },
        z = qR(N.contents, D)?.[v] ?? {},
        B = E.split(/\s+/)[0],
        Y = l(y),
        pe = Y + VR(I) + 1,
        q = D.rootObjectCount === 1 && D.nameCount === 1 ? D.name : null;
      (t && (t.parseDocumentsMs += Date.now() - O),
        c.push({
          docIndex: m,
          unityClassId: b,
          anchor: E,
          objectType: v,
          localIdentifier: B,
          gameObjectFileId: Wt(z.m_GameObject, "fileID"),
          componentTypeName: v === "MonoBehaviour" ? v : null,
          scriptGuid: Wt(z.m_Script, "guid"),
          scriptFileId: Wt(z.m_Script, "fileID"),
          name: q,
          payload: z,
          metadata: Mm(I),
          lineStart: Y,
          lineEnd: pe,
        }));
      let $e = t ? Date.now() : 0;
      (ns(z, B, "", d), t && (t.collectReferencesMs += Date.now() - $e));
    }),
    { objects: c, references: d }
  );
}
function GR(e) {
  let t = Le.default.parseDocument(e, Bm);
  if (t.errors.length === 0) return t;
  let n = KR(e);
  if (n === e) throw new Error(t.errors.map((r) => r.message).join("; "));
  let i = Le.default.parseDocument(n, Bm);
  if (i.errors.length > 0) throw new Error(i.errors.map((r) => r.message).join("; "));
  return i;
}
function KR(e) {
  return WR(YR(e));
}
function YR(e) {
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
      l = Gm(o[2] ?? "");
    if (l.closed) {
      n.push(s);
      continue;
    }
    let c = l.value,
      d = [s],
      f = r + 1,
      m = !1;
    for (; f < t.length; f += 1) {
      let y = t[f] ?? "";
      d.push(y);
      let p = Gm(y.replace(/^\s+/, ""));
      if (
        (p.value.length === 0
          ? p.closed ||
            (c += `
`)
          : (c = $R(c, p.value)),
        p.closed)
      ) {
        m = !0;
        break;
      }
    }
    if (!m) {
      (n.push(...d), (r = f - 1));
      continue;
    }
    ((i = !0), n.push(`${a}${JSON.stringify(c.replace(/\n+$/, ""))}`), (r = f));
  }
  return i
    ? n.join(`
`)
    : e;
}
function Gm(e) {
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
function $R(e, t) {
  return e.length === 0 ||
    e.endsWith(`
`)
    ? `${e}${t}`
    : `${e} ${t}`;
}
function WR(e) {
  let t = e.split(/\r?\n/);
  if (t.length < 2 || !/^[A-Za-z0-9_]+:\s*$/.test(t[0] ?? "")) return e;
  let n = !1,
    i = t.map((r, s) => (s > 0 && r.length > 0 && !/^\s/.test(r) ? ((n = !0), `  ${r}`) : r));
  return n
    ? i.join(`
`)
    : e;
}
function VR(e) {
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
function qR(e, t) {
  if (!(0, Le.isMap)(e)) return lt(e);
  let n = {};
  for (let i of e.items) {
    let r = String(lt(i.key)),
      s = r === t.objectType;
    s && (t.rootObjectCount += 1);
    let o = s ? zR(i.value, t) : lt(i.value);
    Za(n, r, o);
  }
  return n;
}
function zR(e, t) {
  if (!(0, Le.isMap)(e)) return lt(e);
  let n = {};
  for (let i of e.items) {
    let r = String(lt(i.key));
    (r === "m_Name" && ((t.nameCount += 1), (t.name = HR(i.value))), Za(n, r, lt(i.value)));
  }
  return n;
}
function lt(e) {
  if (e == null) return null;
  if ((0, Le.isScalar)(e)) return typeof e.value == "bigint" ? e.value.toString() : e.value;
  if ((0, Le.isSeq)(e)) return e.items.map((t) => lt(t));
  if ((0, Le.isMap)(e)) {
    let t = {};
    for (let n of e.items) {
      let i = String(lt(n.key));
      Za(t, i, lt(n.value));
    }
    return t;
  }
  return e;
}
function HR(e) {
  if (e === null) return "";
  if (!(0, Le.isScalar)(e)) return null;
  let t = e;
  return typeof t.value == "string"
    ? t.value
    : typeof t.source == "string"
      ? t.source
      : t.value === null || t.value === void 0
        ? ""
        : String(t.value);
}
function Za(e, t, n) {
  let i = e[t];
  Object.hasOwn(e, t) ? (Array.isArray(i) ? i.push(n) : (e[t] = [i, n])) : (e[t] = n);
}
function QR(e) {
  let t = e.filter((n) => n.kind === "csharp").length;
  return { totalWorkUnits: e.length + t, csharpFileCount: t };
}
function $m(e, t) {
  let n = e.get(t);
  if (n === void 0) throw new Error(`Missing assigned file ID for '${t}'.`);
  return n;
}
async function Vm(e, t, n, i = {}, r = {}) {
  let { stopwatch: s } = i;
  s?.start("discovery");
  let o = await Kd(t, { includePackages: r.includePackages });
  (i.onDiscoveryComplete?.(o.files.length), s?.stop("discovery"));
  let { totalWorkUnits: a } = QR(o.files),
    l = 0,
    c = (p) => {
      i.onExtractProgress?.(l, a, p);
    };
  s?.start("prepare_files");
  let d = await ZR(o.files, {
    onProgress: () => {
      ((l += 1), c());
    },
    diagnostics: n,
  });
  (s?.stop("prepare_files"),
    s?.start("write_files"),
    Ld(e, d),
    Md(e, Rd(d, n)),
    s?.stop("write_files"),
    s?.start("parse_csharp"));
  let { declarationRows: f, mentionRows: m } = await aw(d, n, {
    onProgress: (p, g) => {
      ((l = o.files.length + p), c(`Parsing C# sources (${p}/${g})`));
    },
  });
  (s?.stop("parse_csharp"),
    s?.start("write_csharp"),
    Cd(e, f, m),
    s?.stop("write_csharp"),
    i.onExtractComplete?.(d.length));
  let y = 0;
  for (let p of d) y += p.sizeBytes;
  return { discoveredFileCount: d.length, discoveredTotalBytes: y };
}
async function ZR(e, t = {}, n = {}) {
  let i = new Map(),
    r = new Map();
  e.forEach((a, l) => {
    (r.set(a.projectRelPath, l + 1), a.kind === "meta" && i.set(a.projectRelPath.slice(0, -5), a));
  });
  let s = n.pathToFileId ?? r,
    o = 0;
  return ew(e, gd(), async (a) => {
    let l = a.kind === "meta" ? void 0 : i.get(a.projectRelPath),
      c = a.kind === "meta" || l ? null : await sw(a.absolutePath),
      d = l ? $m(s, l.projectRelPath) : (n.metaPathToFileId?.get(`${a.projectRelPath}.meta`) ?? null),
      f = $m(s, a.projectRelPath),
      m = await tw(a.absolutePath),
      y = await nw(a, t.diagnostics ?? []),
      p = {
        id: f,
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
async function ew(e, t, n) {
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
async function tw(e) {
  let t = XR("sha256");
  return (
    await new Promise((n, i) => {
      let r = JR(e);
      (r.on("data", (s) => {
        t.update(s);
      }),
        r.once("error", i),
        r.once("end", n));
    }),
    t.digest("hex")
  );
}
async function nw(e, t) {
  if (!iw(e.projectRelPath)) return null;
  let n = await Wm(e.absolutePath);
  return rw(e, n, t);
}
function iw(e) {
  let t = nt(e);
  return t === "unity-yaml" || t === "meta" ? !1 : Ln(e) !== "binary";
}
function rw(e, t, n) {
  return Ln(e.projectRelPath) === "binary"
    ? null
    : nt(e.projectRelPath) === "unity-yaml"
      ? is(t)
        ? t.toString("utf8")
        : null
      : t.toString("utf8");
}
async function sw(e) {
  try {
    return Kn(await Wm(`${e}.meta`, "utf8"));
  } catch {
    return null;
  }
}
function el(e, t, n, i, r, s, o) {
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
      ((i += 1), a.set(l.localIdentifier, c), s.push(ow(e.id, c, l)));
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
function ow(e, t, n) {
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
function qm(e, t) {
  if (!e || t.length === 0) return;
  let n = 0,
    i = 0,
    r = 0;
  for (let s of t) ((n += s.splitBlocksMs), (i += s.parseDocumentsMs), (r += s.collectReferencesMs));
  (e.recordDuration("split_yaml_blocks", n),
    e.recordDuration("parse_yaml_documents", i),
    e.recordDuration("collect_yaml_references", r));
}
async function aw(e, t, n = {}, i = {}) {
  let r = e.filter((d) => d.kind === "csharp"),
    s = [],
    o = [],
    a = i.nextDeclarationId ?? 1,
    l = i.nextMentionId ?? 1,
    c = 0;
  for (let d of r)
    try {
      let f = await Od(d.contentText ?? ""),
        m = f.declarations.map((y) => ({
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
        f.mentions.forEach((y) => {
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
    } catch (f) {
      t.push({
        severity: "error",
        category: "extract",
        stage: "extract",
        filePath: d.projectRelPath,
        message: `Failed to parse C# file: ${lw(f)}`,
      });
    } finally {
      ((c += 1), n.onProgress?.(c, r.length));
    }
  return { declarationRows: s, mentionRows: o };
}
function lw(e) {
  return e instanceof Error ? e.message : String(e);
}
import { readFile as Mx } from "node:fs/promises";
import { readFile as fw } from "node:fs/promises";
import Ei from "node:path";
var cw = /^[0-9a-fA-F]{32}$/;
function zm(e) {
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
function dw(e) {
  if (!Hm(e)) return null;
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
function Hm(e) {
  return cw.test(e);
}
function qt(e) {
  let t = e.trim();
  if (!t) return [];
  let n = new Set([t]);
  if (Hm(t)) {
    let i = t.toLowerCase();
    n.add(i);
    let r = dw(i);
    r && n.add(r);
    let s = zm(Buffer.from(i, "hex"));
    return (s && n.add(s), [...n]);
  }
  for (let i of uw(t)) {
    let r = zm(i);
    r && n.add(r);
  }
  return [...n];
}
function uw(e) {
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
var tl = 1;
async function Jm(e) {
  let t = new Map(e.files.map((g) => [g.id, g])),
    n = new Map(e.assemblies.map((g) => [g.name, g.id])),
    i = await pw(e.files, n),
    r = gw(e.files, i, n),
    s = 0;
  for (let g of e.persistedSymbols ?? []) s = Math.max(s, g.id);
  let o = s + 1,
    a = Iw(e.files, e.declarations, r, o);
  e.persistedSymbols && e.persistedSymbols.length > 0 && yw(a.index, e.persistedSymbols);
  let c = { value: Math.max(a.maxSymbolId, s) + 1 },
    d = new Map(),
    f = Sw(a.index, t, c, d),
    m = e.mentionFileIds === void 0 ? e.mentions : e.mentions.filter((g) => e.mentionFileIds?.has(g.fileId)),
    y = Rw(m, a.index, r, t, c, d),
    p = mw([...a.symbols, ...[...d.values()].sort((g, I) => g.id - I.id)]);
  return { symbols: p, edges: f, bindings: y, fileAssemblyIdByFileId: r, scriptSymbolByFileGuid: ww(t, p) };
}
function mw(e) {
  let t = new Map();
  for (let n of e) t.has(n.id) || t.set(n.id, n);
  return [...t.values()].sort((n, i) => n.id - i.id);
}
function yw(e, t) {
  for (let n of t) {
    if (e.byId.has(n.id)) continue;
    (e.byId.set(n.id, n), n.declarationId !== null && e.byDeclarationId.set(n.declarationId, n));
    let i = In(n.assemblyId, n.qualifiedName);
    (e.byKey.has(i) || e.byKey.set(i, n),
      e.byQualifiedName.has(n.qualifiedName) || e.byQualifiedName.set(n.qualifiedName, n));
    let r = e.bySimpleName.get(n.simpleName) ?? [];
    r.some((s) => s.id === n.id) || (r.push(n), e.bySimpleName.set(n.simpleName, r));
  }
}
function Qm(e, t) {
  let n = new Map();
  for (let i of e)
    if (!(i.kind !== "csharp" || !i.guid))
      for (let r of qt(i.guid)) {
        let s = t.get(r);
        s && nl(s) && n.set(s.id, s);
      }
  return [...n.values()].sort((i, r) => i.id - r.id);
}
async function pw(e, t) {
  let n = new Map(),
    i = e.filter((r) => r.kind === "asmdef");
  for (let r of i)
    try {
      let s = await fw(r.absPath, "utf8"),
        o = rn(s),
        a = t.get(o.name);
      a && n.set(Ei.posix.dirname(r.projectRelPath), a);
    } catch {}
  return n;
}
function gw(e, t, n) {
  let i = new Map();
  for (let r of e) {
    if (r.kind !== "csharp") continue;
    let s = hw(r.projectRelPath, t);
    if (s) {
      i.set(r.id, s);
      continue;
    }
    let o = r.projectRelPath.toLowerCase().includes("/editor/") ? "Assembly-CSharp-Editor" : "Assembly-CSharp";
    i.set(r.id, n.get(o) ?? null);
  }
  return i;
}
function hw(e, t) {
  let n = Ei.posix.dirname(e);
  for (; n !== "." && n !== "";) {
    let i = t.get(n);
    if (i) return i;
    n = Ei.posix.dirname(n);
  }
  return null;
}
function Iw(e, t, n, i = 1) {
  let r = [],
    s = new Map(),
    o = new Map(),
    a = new Map(),
    l = new Map(e.map((p) => [p.id, p])),
    c = new Map(),
    d = [],
    f = i;
  for (let p of t) {
    let g = n.get(p.fileId) ?? null,
      I = xw(p.qualifiedNameText ?? p.simpleName, p.declKind, p.signatureText);
    if (!I) continue;
    Xm(I, g, p.fileId, d);
    let b = In(g, I),
      E = a.get(b),
      w = vw(p.declKind),
      x = Nw(p.signatureText),
      R = kw(p.signatureText);
    if ((bw(c, b, p, l), E)) {
      ((E.lineStart = jw(E.lineStart, p.lineStart)),
        (E.lineEnd = Bw(E.lineEnd, p.lineEnd)),
        (E.baseSymbolName = E.baseSymbolName ?? R),
        (E.visibility = E.visibility ?? x),
        E.fileId || (E.fileId = p.fileId),
        o.set(p.id, E));
      continue;
    }
    let v = rs(I),
      O = {
        id: f++,
        projectId: tl,
        assemblyId: g,
        fileId: p.fileId,
        declarationId: p.id,
        symbolKind: w,
        simpleName: p.simpleName,
        qualifiedName: I,
        displayName: Pw(I, p.simpleName),
        signature: p.signatureText,
        containingSymbolId: null,
        baseSymbolName: R,
        isExternalStub: 0,
        visibility: x,
        skeletonContent: null,
        lineStart: p.lineStart,
        lineEnd: p.lineEnd,
      };
    (r.push(O), s.set(O.id, O), o.set(p.id, O), a.set(b, O), w === "namespace" && Xm(v ?? "", g, p.fileId, d));
  }
  for (let p of d) {
    if (!p.namespaceName) continue;
    let g = In(p.assemblyId, p.namespaceName);
    if (a.has(g)) continue;
    let I = p.namespaceName.split(".").pop() ?? p.namespaceName,
      b = {
        id: f++,
        projectId: tl,
        assemblyId: p.assemblyId,
        fileId: p.fileId,
        declarationId: null,
        symbolKind: "namespace",
        simpleName: I,
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
    (r.push(b), s.set(b.id, b), a.set(g, b));
  }
  for (let p of r) {
    let g = rs(p.qualifiedName);
    if (!g) continue;
    let I = a.get(In(p.assemblyId, g));
    p.containingSymbolId = I?.id ?? null;
  }
  Ew(a, c);
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
    maxSymbolId: f - 1,
  };
}
function bw(e, t, n, i) {
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
function Ew(e, t) {
  for (let [n, i] of t) {
    let r = e.get(n);
    if (!r || i.length === 0) continue;
    let s = [...i].sort(_w),
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
function _w(e, t) {
  return (
    e.projectRelPath.localeCompare(t.projectRelPath) ||
    e.lineStart - t.lineStart ||
    e.lineEnd - t.lineEnd ||
    e.declarationId - t.declarationId
  );
}
function Sw(e, t, n, i) {
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
    let a = Zm(o.signature);
    if (a.length === 0) continue;
    let l = o.assemblyId;
    a.map((d) => {
      let f = e.byKey.get(In(l, d)) ?? Aw(d, o, e.bySimpleName.get(_i(d)) ?? []);
      return f ? f.id : ty(d, "class", n, i, e).id;
    }).forEach((d, f) => {
      r.push({
        id: s++,
        fromSymbolId: o.id,
        toSymbolId: d,
        edgeKind: f === 0 ? "inherits" : "implements",
        sourceFileId: t.get(o.fileId ?? -1)?.id ?? null,
      });
    });
  }
  return r;
}
function Rw(e, t, n, i, r, s) {
  let o = [],
    a = 1;
  for (let l of e) {
    let c = t.byDeclarationId.get(l.containingDeclarationId);
    if (!c) continue;
    let d = Ow(l, c, n.get(l.fileId) ?? null, t),
      f = d[0],
      m = d[1],
      y = Lw(l, f?.symbol ?? null);
    if (f && (!m || f.score > m.score)) {
      o.push({
        id: a++,
        mentionId: l.id,
        sourceSymbolId: c.id,
        targetSymbolId: f.symbol.id,
        bindingKind: y,
        resolutionStatus: "resolved",
        confidence: f.score >= 4 ? 1 : 0.8,
      });
      continue;
    }
    if (f && m && f.score === m.score) {
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
    if (Fw(l.text, l.receiverText)) {
      let p = ty(l.text, Cw(l.text), r, s, t);
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
function ww(e, t) {
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
      l = a ? Ei.posix.basename(a, Ei.posix.extname(a)) : null,
      c =
        o.find((d) => l !== null && d.simpleName === l && nl(d)) ??
        o.find((d) => nl(d)) ??
        o.find((d) => d.symbolKind === "class") ??
        o[0];
    if (c) for (let d of qt(s)) r.set(d, c);
  }
  return r;
}
function Xm(e, t, n, i) {
  if (!e.includes(".")) return;
  let r = e.split(".");
  for (let s = 1; s < r.length; s += 1) i.push({ assemblyId: t, namespaceName: r.slice(0, s).join("."), fileId: n });
}
function vw(e) {
  return e === "constructor" ? "method" : e === "struct" ? "struct" : e;
}
function In(e, t) {
  return `${e ?? "null"}:${t}`;
}
function rs(e) {
  return e.includes(".") ? e.split(".").slice(0, -1).join(".") : null;
}
function Pw(e, t) {
  let n = rs(e);
  return n ? `${n.split(".").pop() ?? n}.${t}` : t;
}
function xw(e, t, n) {
  if (!["method", "constructor"].includes(t) || !n) return e;
  let i = Tw(n);
  return `${e}(${i})`;
}
function Tw(e) {
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
          return s.length <= 1 ? ss(r) : ss(s.slice(0, -1).join(" "));
        })
        .join(",")
    : "";
}
function Nw(e) {
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
function kw(e) {
  return Zm(e)[0] ?? null;
}
function Zm(e) {
  if (!e) return [];
  let t = e.match(/\b(?:class|struct|interface)\s+[A-Za-z_][A-Za-z0-9_<>]*\s*:\s*([^{]+)/);
  return t?.[1]
    ? t[1]
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean)
        .map(ss)
    : [];
}
function ss(e) {
  return e.replace(/<.*>/g, "").trim();
}
function Ow(e, t, n, i) {
  let r = i.byKey.get(In(n, e.text));
  if (r) return [{ symbol: r, score: 5 }];
  let s = _i(e.text);
  return (i.bySimpleName.get(s) ?? [])
    .map((a) => ({ symbol: a, score: ey(a, t, n, e) }))
    .filter((a) => a.score > 0)
    .sort((a, l) => l.score - a.score);
}
function Aw(e, t, n) {
  let i = n.map((r) => ({ candidate: r, score: ey(r, t, t.assemblyId, null) })).sort((r, s) => s.score - r.score)[0];
  return i && i.score > 0 ? i.candidate : null;
}
function ey(e, t, n, i) {
  let r = 0;
  return (
    e.assemblyId === n && (r += 2),
    i && e.fileId === i.fileId && (r += 1),
    e.containingSymbolId === t.containingSymbolId && (r += 2),
    e.containingSymbolId === t.id && (r += 2),
    i && i.text.includes(".") && e.qualifiedName.endsWith(`.${i.text}`) && (r += 3),
    i && i.argumentArity !== null && e.symbolKind === "method" && Mw(e) === i.argumentArity && (r += 3),
    i && Uw(i, e) && (r += 4),
    r
  );
}
function Uw(e, t) {
  if (!e.receiverText || t.symbolKind !== "method") return !1;
  let n = rs(t.qualifiedName);
  if (!n) return !1;
  let i = _i(n);
  return e.receiverText
    .split(/[^A-Za-z0-9_]+/)
    .filter(Boolean)
    .includes(i);
}
function Lw(e, t) {
  return t?.symbolKind === "method"
    ? "invokes"
    : (t && ["class", "interface", "enum", "struct", "namespace"].includes(t.symbolKind)) || il(e.text)
      ? "references_type"
      : (e.receiverText, "references_member");
}
function nl(e) {
  let t = e.baseSymbolName ?? "";
  return /(?:^|\.)(MonoBehaviour|Behaviour|ScriptableObject|Component)$/.test(t);
}
function Mw(e) {
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
function Fw(e, t) {
  return t !== null || il(e) || e.includes(".");
}
function il(e) {
  return /^[A-Z][A-Za-z0-9_.]+$/.test(_i(e));
}
function Cw(e) {
  return il(e) ? "class" : "field";
}
function ty(e, t, n, i, r) {
  let s = ss(e),
    o = i.get(s);
  if (o) return o;
  let a = Dw(r, s);
  if (a) return a;
  let l = _i(s),
    c = {
      id: n.value++,
      projectId: tl,
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
function Dw(e, t) {
  return e.byQualifiedName.get(t);
}
function _i(e) {
  return e.split(".").pop() ?? e;
}
function jw(e, t) {
  return e === null ? t : t === null ? e : Math.min(e, t);
}
function Bw(e, t) {
  return e === null ? t : t === null ? e : Math.max(e, t);
}
function iy(e, t, n, i) {
  let r = [...t].sort((a, l) => {
      let c = ny(a.qualifiedName) - ny(l.qualifiedName);
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
  me(e, () => {
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
    Gw(e, i);
  });
}
function Gw(e, t) {
  if (t.length === 0) return;
  let n = 7,
    i = Ct(n),
    r = `INSERT INTO semantic_bindings (
      id,
      mention_id,
      source_symbol_id,
      target_symbol_id,
      binding_kind,
      resolution_status,
      confidence
    ) VALUES `,
    s = t.length >= i ? e.prepare(`${r}${Be(i, n)}`) : null;
  for (let o of Se(t, i))
    (o.length === i ? s : e.prepare(`${r}${Be(o.length, n)}`)).run(
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
function ry(e, t) {
  let n = e.prepare(`INSERT INTO assets (
      id,
      project_id,
      file_id,
      asset_kind,
      guid,
      name,
      vfs_root_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  me(e, () => {
    for (let i of t) n.run(i.id, i.projectId, i.fileId, i.assetKind, i.guid, i.name, i.vfsRootPath);
  });
}
function rl(e, t) {
  let n = Kw(t),
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
  me(e, () => {
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
function sy(e, t) {
  let n = e.prepare(`INSERT INTO entity_edges (
      id,
      from_entity_id,
      to_entity_id,
      edge_kind,
      edge_subkind
    ) VALUES (?, ?, ?, ?, ?)`);
  me(e, () => {
    for (let i of t) n.run(i.id, i.fromEntityId, i.toEntityId, i.edgeKind, i.edgeSubkind ?? null);
  });
}
function oy(e, t) {
  let n = e.prepare(`INSERT INTO entity_symbol_edges (
      id,
      from_entity_id,
      to_symbol_id,
      edge_kind,
      edge_subkind,
      source_field_path
    ) VALUES (?, ?, ?, ?, ?, ?)`);
  me(e, () => {
    for (let i of t)
      n.run(i.id, i.fromEntityId, i.toSymbolId, i.edgeKind, i.edgeSubkind ?? null, i.sourceFieldPath ?? null);
  });
}
function ay(e, t) {
  if (t.length === 0) return;
  let n = e.prepare(`UPDATE entities
     SET source_entity_id = ?
     WHERE id = ?`);
  me(e, () => {
    for (let i of t) n.run(i.sourceEntityId, i.entityId);
  });
}
function ly(e, t) {
  if (t.length === 0) return;
  let n = e.prepare(`UPDATE entities
     SET hierarchy_name = ?
     WHERE id = ?`);
  me(e, () => {
    for (let i of t) n.run(i.hierarchyName, i.entityId);
  });
}
function ny(e) {
  return e.split(".").length;
}
function Kw(e) {
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
import Ap from "node:path";
import Ut from "node:path";
function oe(e, t) {
  return `${e}:${t}`;
}
function sl(e, t = new Map()) {
  return {
    assetIdByFileId: new Map(e.map((n) => [n.fileId, n.id])),
    fileIdByAssetId: new Map(e.map((n) => [n.id, n.fileId])),
    assetIdByGuid: new Map(e.map((n) => [n.guid, n.id])),
    assetKindByFileId: new Map(e.map((n) => [n.fileId, n.assetKind])),
    fileAbsPathById: t,
  };
}
function ol() {
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
        s.localKey !== null && e.set(oe(s.fileId, s.localKey), s.entityId),
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
function cy() {
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
      return [...e].sort(Yw);
    },
    clear() {
      ((e.length = 0), (t = 0));
    },
  };
}
function Yw(e, t) {
  return (
    e.sourceFileId - t.sourceFileId ||
    e.sourceYamlObjectId - t.sourceYamlObjectId ||
    bn(e.sourceLocalKey, t.sourceLocalKey) ||
    bn(e.fieldPath, t.fieldPath) ||
    bn(e.referenceKind, t.referenceKind) ||
    bn(e.targetGuid ?? "", t.targetGuid ?? "") ||
    bn(e.targetFileId ?? "", t.targetFileId ?? "") ||
    bn(e.targetLocalId ?? "", t.targetLocalId ?? "")
  );
}
function bn(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function dy() {
  return { seenEntityEdges: new Set(), seenEntitySymbolEdges: new Set(), seenDiagnostics: new Set() };
}
function Me(e, t, n, i) {
  return [e, t, n, i ?? ""].join(":");
}
function uy(e, t, n, i, r) {
  return [e, t, n, i ?? "", r ?? ""].join(":");
}
var $w = "s\0\0\0";
function fy(e) {
  let t = e.lastIndexOf("."),
    n = t < 0 ? e : `${e.slice(0, t)}${e.slice(t + 1)}`,
    i = new TextEncoder().encode(`${$w}${n}`),
    r = Math.ceil((i.length + 9) / 64) * 64,
    s = new Uint8Array(r);
  (s.set(i), (s[i.length] = 128));
  let o = BigInt(i.length) * 8n;
  for (let m = 0; m < 8; m += 1) s[r - 8 + m] = Number((o >> BigInt(m * 8)) & 0xffn);
  let a = 1732584193,
    l = 4023233417,
    c = 2562383102,
    d = 271733878,
    f = new Uint32Array(16);
  for (let m = 0; m < s.length; m += 64) {
    for (let b = 0; b < 16; b += 1) {
      let E = m + b * 4;
      f[b] = s[E] | (s[E + 1] << 8) | (s[E + 2] << 16) | (s[E + 3] << 24);
    }
    let y = a,
      p = l,
      g = c,
      I = d;
    (([a, l, c, d] = al(a, l, c, d, f, [...Array(16).keys()], [3, 7, 11, 19], (b, E, w) => (b & E) | (~b & w), 0)),
      ([a, l, c, d] = al(
        a,
        l,
        c,
        d,
        f,
        [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15],
        [3, 5, 9, 13],
        (b, E, w) => (b & E) | (b & w) | (E & w),
        1518500249,
      )),
      ([a, l, c, d] = al(
        a,
        l,
        c,
        d,
        f,
        [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15],
        [3, 9, 11, 15],
        (b, E, w) => b ^ E ^ w,
        1859775393,
      )),
      (a = (a + y) >>> 0),
      (l = (l + p) >>> 0),
      (c = (c + g) >>> 0),
      (d = (d + I) >>> 0));
  }
  return a | 0;
}
function al(e, t, n, i, r, s, o, a, l) {
  let c = e,
    d = t,
    f = n,
    m = i;
  for (let y = 0; y < 16; y += 1) {
    let p = r[s[y]],
      g = o[y % 4];
    switch (y % 4) {
      case 0:
        c = os((c + a(d, f, m) + p + l) >>> 0, g);
        break;
      case 1:
        m = os((m + a(c, d, f) + p + l) >>> 0, g);
        break;
      case 2:
        f = os((f + a(m, c, d) + p + l) >>> 0, g);
        break;
      default:
        d = os((d + a(f, m, c) + p + l) >>> 0, g);
        break;
    }
  }
  return [c, d, f, m];
}
function os(e, t) {
  return ((e << t) | (e >>> (32 - t))) >>> 0;
}
function py(e) {
  return Ww(e, { resolvePrefabLinks: !1 });
}
function gy(e) {
  let t = [],
    n = [],
    i = e.nextEdgeId;
  for (let r of e.intents) {
    let s = e.entityIndexes.entityIdByFileIdAndLocalKey.get(oe(r.sourceFileId, r.sourceLocalKey));
    if (s === void 0) continue;
    let o = e.assetIndexes.assetIdByGuid.get(r.prefabSourceGuid);
    if (o === void 0) continue;
    let a = e.entityIndexes.projectableRootEntityIdByAssetId.get(o);
    if (a === void 0) continue;
    let l = Me(s, a, r.edgeKind, null);
    e.edgeState.seenEntityEdges.has(l) ||
      (e.edgeState.seenEntityEdges.add(l),
      t.push({ id: i++, fromEntityId: s, toEntityId: a, edgeKind: r.edgeKind }),
      n.push({ entityId: s, sourceEntityId: a }));
  }
  return { edges: t, sourceEntityUpdates: n, nextEdgeId: i };
}
function Ww(e, t) {
  let n = [],
    i = [],
    r = [],
    { assets: s, yamlObjects: o, scriptSymbolByFileGuid: a, yamlMetadataById: l } = e,
    c = e.scopedMonoScriptSymbols ?? [],
    d = Vw(e.symbols ?? c),
    f = new Map(s.map((R) => [R.id, R])),
    m = new Map(),
    y = new Map(),
    p = new Map(),
    g = [],
    I = Qw(o, (R) => R.fileId),
    b = new Map(s.map((R) => [R.guid, R])),
    E = [],
    w = e.nextEntityId,
    x = e.nextEdgeId;
  for (let R of s) {
    if (R.assetKind !== "scene" && R.assetKind !== "prefab") continue;
    let v = I.get(R.fileId) ?? [],
      O = new Map(v.map((S) => [S.id, S])),
      N = new Map(),
      D = new Map(),
      te = new Map(),
      z = new Map(),
      B = new Map(),
      Y = new Map(),
      pe = new Map();
    for (let S of v) {
      let C = l.get(S.id);
      if (S.objectType === "Transform" || S.objectType === "RectTransform") {
        let U = e.payloadReader.read(S),
          j = Fm(C?.childTransformLocalIds !== void 0 ? null : U, C);
        (N.set(S.id, j), D.set(S.localIdentifier, j), j.gameObjectFileId && te.set(j.gameObjectFileId, j));
        let ge = j.gameObjectFileId ?? j.prefabInstanceLocalId,
          X = Dm(U, ["m_RootOrder"]);
        ge && X !== null && B.set(ge, X);
      } else if (S.objectType === "PrefabInstance")
        if (C) (Y.set(S.id, C.sourcePrefabGuid), pe.set(S.id, C.prefabTransformParentLocalId));
        else {
          let U = e.payloadReader.read(S);
          (Y.set(S.id, null), pe.set(S.id, Ne(U, ["m_Modification", "m_TransformParent"])));
        }
    }
    for (let S of v) {
      if (S.objectType !== "GameObject") continue;
      let C = te.get(S.localIdentifier);
      if (!C) {
        z.set(S.localIdentifier, null);
        continue;
      }
      let U = C.parentTransformLocalId ? D.get(C.parentTransformLocalId) : void 0,
        j = U?.gameObjectFileId ?? U?.prefabInstanceLocalId ?? null;
      z.set(S.localIdentifier, j);
    }
    let q = [],
      $e = new Set(
        v
          .filter((S) => {
            let C = l.get(S.id);
            return S.objectType === "GameObject" && !!C?.prefabInstanceLocalId && !S.name;
          })
          .map((S) => S.localIdentifier),
      ),
      be = new Map(),
      we = new Map();
    for (let S of v) {
      if (S.objectType === "GameObject") {
        let U = e.payloadReader.read(S),
          j = U && typeof U == "object" && !Array.isArray(U) ? U.m_Component : void 0;
        Array.isArray(j) &&
          j.forEach((ge, X) => {
            let ce = Ne(ge, ["component"]);
            ce && we.set(ce, X);
          });
      }
      if (!S.gameObjectFileId) continue;
      let C = l.get(S.id)?.gameObjectFileId ?? S.gameObjectFileId;
      $e.has(C) || be.set(C, (be.get(C) ?? 0) + 1);
    }
    for (let S of v) {
      let C = null,
        U = S.objectType,
        j = S.name,
        ge = null,
        X = l.get(S.id);
      if (S.objectType === "GameObject" && $e.has(S.localIdentifier)) continue;
      if (S.objectType === "GameObject") ((C = "gameobject"), (U = "GameObject"));
      else if (S.objectType === "PrefabInstance")
        ((C = "prefab_instance"), (j = X?.prefabRootName ?? S.name ?? Ut.posix.basename(R.vfsRootPath)));
      else if (S.gameObjectFileId) {
        let ue = X?.gameObjectFileId ?? S.gameObjectFileId;
        if ($e.has(ue)) continue;
        if (((C = "component"), S.objectType === "MonoBehaviour" && S.scriptGuid)) {
          let J = a.get(S.scriptGuid) ?? (S.scriptFileId ? d.get(S.scriptFileId) : void 0),
            Ve = X?.gameObjectFileId ?? S.gameObjectFileId,
            Zt = Ve ? (be.get(Ve) ?? 0) : 0;
          if (
            (!J && Zt === 2 && (J = Hw(R, e.scopedFiles, a)),
            !J &&
              c.length === 1 &&
              Jw({
                scriptGuid: S.scriptGuid,
                scriptSymbolByFileGuid: a,
                gameObjectFileId: Ve,
                componentCountByGameObjectLocalKey: be,
                scopedCSharpBasename: zw(e.scopedFiles),
                gameObjectName: Xw(S, O, X),
              }) &&
              (J = c[0]),
            J)
          )
            ((ge = J.id), (U = J.qualifiedName), (j = J.simpleName));
          else {
            let qe = qw(e.payloadReader.read(S));
            qe && ((U = qe), (j = qe.split(".").pop() ?? qe));
          }
        } else j = j ?? S.objectType;
      }
      if (!C) continue;
      let ce = {
        id: w++,
        assetId: R.id,
        yamlObjectId: S.id,
        entityKind: C,
        localKey: S.localIdentifier,
        name: j,
        hierarchyName: null,
        hierarchyOrder: C === "component" ? (we.get(S.localIdentifier) ?? 5e5 + S.id) : S.id,
        typeName: U,
        scriptSymbolId: ge,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: S.lineStart,
        lineEnd: S.lineEnd,
      };
      (n.push(ce), q.push(ce), m.set(ce.id, ce), p.set(At(R.fileId, ce.localKey), ce));
    }
    for (let S of q) {
      if (S.entityKind === "component") {
        let X = S.yamlObjectId === null ? void 0 : O.get(S.yamlObjectId),
          ce = X === void 0 ? null : (l.get(X.id)?.gameObjectFileId ?? X.gameObjectFileId);
        S.parentEntityId = ce ? (p.get(At(R.fileId, ce))?.id ?? null) : null;
        continue;
      }
      if (S.entityKind === "gameobject") {
        let X = z.get(S.localKey);
        S.parentEntityId = X ? (p.get(At(R.fileId, X))?.id ?? null) : null;
        continue;
      }
      if (S.entityKind !== "prefab_instance") continue;
      let C = S.yamlObjectId === null ? void 0 : O.get(S.yamlObjectId);
      if (!C) continue;
      let U = pe.get(C.id) ?? null,
        j = U ? D.get(U) : void 0,
        ge = j ? (j.gameObjectFileId ?? j.prefabInstanceLocalId) : null;
      S.parentEntityId = ge ? (p.get(At(R.fileId, ge))?.id ?? null) : null;
    }
    for (let S of q)
      (S.entityKind === "gameobject" || S.entityKind === "prefab_instance") &&
        S.parentEntityId !== null &&
        (S.hierarchyOrder = 15e5 + S.id);
    let le = new Map();
    for (let [S, C] of D) {
      let U = C.gameObjectFileId ?? C.prefabInstanceLocalId;
      U && le.set(S, U);
    }
    let ut = q
      .filter((S) => (S.entityKind === "gameobject" || S.entityKind === "prefab_instance") && !S.parentEntityId)
      .sort((S, C) => (B.get(S.localKey) ?? S.id) - (B.get(C.localKey) ?? C.id))
      .map((S) => S.localKey);
    ut.forEach((S, C) => {
      let U = p.get(At(R.fileId, S));
      U && (U.hierarchyOrder = B.get(S) ?? C);
    });
    let ft = new Map();
    for (let S of D.values()) {
      let C = S.gameObjectFileId ?? S.prefabInstanceLocalId;
      if (!C) continue;
      let U = S.childTransformLocalIds.map((j) => le.get(j)).filter((j) => !!j);
      U.length > 0 &&
        (U.forEach((j, ge) => {
          let X = p.get(At(R.fileId, j));
          X && (X.hierarchyOrder = 1e6 + ge);
        }),
        ft.set(C, U));
    }
    g.push({ fileId: R.fileId, rootLocalKeys: ut, childLocalKeysByParentLocalKey: ft });
    let We =
      q.filter((S) => S.entityKind === "gameobject" && !S.parentEntityId).sort((S, C) => S.id - C.id)[0] ??
      q.filter((S) => S.entityKind === "prefab_instance" && !S.parentEntityId).sort((S, C) => S.id - C.id)[0];
    We && y.set(R.id, We.id);
    for (let S of q)
      S.parentEntityId &&
        i.push({
          id: x++,
          fromEntityId: S.id,
          toEntityId: S.parentEntityId,
          edgeKind: S.entityKind === "component" ? "component_of" : "child_of",
        });
    for (let S of q) {
      if (S.entityKind !== "prefab_instance" || S.yamlObjectId === null) continue;
      let C = Y.get(S.yamlObjectId) ?? null;
      if (!C) continue;
      let U = O.get(S.yamlObjectId);
      U &&
        E.push({
          fromEntityId: S.id,
          sourceYamlObjectId: U.id,
          sourceFileId: R.fileId,
          sourceLocalKey: S.localKey,
          sourceGuid: C,
          targetLocalId: Ne(e.payloadReader.read(U), ["m_SourcePrefab"]),
          edgeKind: R.assetKind === "prefab" && S.id === We?.id ? "variant_of" : "instance_of",
        });
    }
  }
  if (t.resolvePrefabLinks)
    for (let R of E) {
      let v = b.get(R.sourceGuid);
      if (!v) continue;
      let O = y.get(v.id);
      if (!O) continue;
      let N = m.get(R.fromEntityId);
      N && ((N.sourceEntityId = O), i.push({ id: x++, fromEntityId: N.id, toEntityId: O, edgeKind: R.edgeKind }));
    }
  else
    for (let R of E) {
      let v = b.get(R.sourceGuid),
        O = v ? y.get(v.id) : void 0,
        N = m.get(R.fromEntityId);
      (N && O && (N.sourceEntityId = O),
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
    yy(R.fileId, p, m, f, R.rootLocalKeys);
    for (let v of R.childLocalKeysByParentLocalKey.values()) yy(R.fileId, p, m, f, v);
  }
  for (let R of n)
    (R.entityKind !== "gameobject" && R.entityKind !== "prefab_instance") ||
      R.hierarchyName ||
      (R.hierarchyName = hy(R, m, f));
  return { entities: n, edges: i, pendingEdgeIntents: r, nextEntityId: w, nextEdgeId: x };
}
function At(e, t) {
  return `${e}:${t}`;
}
var my = new WeakMap();
function Vw(e) {
  let t = my.get(e);
  if (t) return t;
  let n = new Map(),
    i = new Set();
  for (let r of e) {
    if (r.symbolKind !== "class" || !r.qualifiedName.trim()) continue;
    let s = String(fy(r.qualifiedName.trim())),
      o = n.get(s);
    if (o && o.qualifiedName !== r.qualifiedName) {
      (n.delete(s), i.add(s));
      continue;
    }
    i.has(s) || n.set(s, r);
  }
  return (my.set(e, n), n);
}
function qw(e) {
  let t = Vt(e, ["m_EditorClassIdentifier"]);
  if (!t?.trim()) return null;
  let n = t.trim();
  return (n.includes("::") ? n.slice(n.lastIndexOf("::") + 2) : n).trim() || null;
}
function zw(e) {
  let t = e.filter((n) => n.kind === "csharp");
  return t.length !== 1 ? null : Ut.posix.basename(t[0].projectRelPath, Ut.posix.extname(t[0].projectRelPath));
}
function Hw(e, t, n) {
  let i = Ut.posix.basename(e.vfsRootPath, Ut.posix.extname(e.vfsRootPath)),
    r = t.filter(
      (o) => o.kind === "csharp" && Ut.posix.basename(o.projectRelPath, Ut.posix.extname(o.projectRelPath)) === i,
    );
  if (r.length !== 1) return;
  let s = r[0];
  if (s.guid)
    for (let o of qt(s.guid)) {
      let a = n.get(o);
      if (a) return a;
    }
}
function Xw(e, t, n) {
  let i = n?.gameObjectFileId ?? e.gameObjectFileId;
  return i
    ? ([...t.values()].find((s) => s.objectType === "GameObject" && s.localIdentifier === i)?.name ?? null)
    : null;
}
function Jw(e) {
  return e.scriptSymbolByFileGuid.has(e.scriptGuid) || !e.gameObjectFileId
    ? !1
    : !!(
        (e.componentCountByGameObjectLocalKey.get(e.gameObjectFileId) ?? 0) === 2 ||
        (e.scopedCSharpBasename && e.gameObjectName === e.scopedCSharpBasename)
      );
}
function Qw(e, t) {
  let n = new Map();
  for (let i of e) {
    let r = t(i),
      s = n.get(r) ?? [];
    (s.push(i), n.set(r, s));
  }
  return n;
}
function yy(e, t, n, i, r) {
  let s = new Map(),
    o = new Map();
  for (let a of r) {
    let l = t.get(At(e, a));
    if (!l) continue;
    let c = hy(l, n, i);
    (o.set(a, c), s.set(c, (s.get(c) ?? 0) + 1));
  }
  r.forEach((a, l) => {
    let c = t.get(At(e, a)),
      d = o.get(a);
    !c || !d || (c.hierarchyName = (s.get(d) ?? 0) > 1 ? `${d}#${l}` : d);
  });
}
function hy(e, t, n) {
  if (e.entityKind === "prefab_instance" && e.sourceEntityId) {
    let i = t.get(e.sourceEntityId),
      r = n.get(e.assetId),
      s = r ? Ut.posix.basename(r.vfsRootPath) : null,
      o = (e.name ?? e.typeName).trim() || e.typeName;
    if (i && o === s) return (i.name ?? i.typeName).trim() || i.typeName;
  }
  return (e.name ?? e.typeName).trim() || e.typeName;
}
function Je(e) {
  return Zw(e, (t) => t.fileId);
}
function ke(e, t, n, i, r = {}) {
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
function Qe(e, t) {
  return t.read(e);
}
function Iy(e, t) {
  return Vt(e, t);
}
function Si(e, t) {
  let n = e;
  for (let [i, r] of t.entries()) {
    if (!n || typeof n != "object" || Array.isArray(n)) return [];
    if (((n = n[r]), Array.isArray(n))) {
      let s = t.slice(i + 1);
      return n.map((o) => (s.length > 0 ? (Vt(o, [...s, "fileID"]) ?? hn(o)) : hn(o))).filter((o) => o !== null);
    }
  }
  return Array.isArray(n)
    ? n.map((i) => (!i || typeof i != "object" || Array.isArray(i) ? null : hn(i))).filter((i) => i !== null)
    : [];
}
function dl(e) {
  let t = new Set();
  return (
    cl(e, (n) => {
      if (!n || typeof n != "object" || Array.isArray(n)) return;
      let i = n;
      if (i.guid !== void 0) return;
      let r = i.fileID;
      (typeof r == "string" || typeof r == "number") && String(r) !== "0" && t.add(String(r));
    }),
    [...t]
  );
}
function by(e) {
  let t = new Map(e.entities.map((i) => [ll(i.assetId, i.localKey), i])),
    n = e.nextEdgeId;
  for (let i of e.yamlObjects) {
    let r = t.get(ll(e.assetId, i.localIdentifier));
    if (r)
      for (let s of dl(Qe(i, e.payloadReader))) {
        let o = t.get(ll(r.assetId, s));
        !o || o.id === r.id || e.edges.push({ id: n++, fromEntityId: r.id, toEntityId: o.id, edgeKind: "refs" });
      }
  }
  return n;
}
function ll(e, t) {
  return `${e}:${t}`;
}
function as(e, t) {
  let n = e;
  for (let i of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return { fileID: null, guid: null };
    n = n[i];
  }
  return { fileID: Vt(n, ["fileID"]), guid: Vt(n, ["guid"]) };
}
function cl(e, t) {
  if ((t(e), !(!e || typeof e != "object"))) {
    if (Array.isArray(e)) {
      e.forEach((n) => cl(n, t));
      return;
    }
    Object.values(e).forEach((n) => cl(n, t));
  }
}
function Zw(e, t) {
  let n = new Map();
  for (let i of e) {
    let r = t(i),
      s = n.get(r) ?? [];
    (s.push(i), n.set(r, s));
  }
  return n;
}
function Ey(e) {
  let t = [],
    n = Je(e.yamlObjects),
    i = e.nextEntityId;
  for (let r of e.assets) {
    if (r.assetKind !== "animation_clip") continue;
    let s = n.get(r.fileId) ?? [];
    for (let o of s)
      o.objectType === "AnimationClip" &&
        t.push(ke(i++, r, o, "animation_clip", { name: o.name ?? r.name, typeName: "AnimationClip" }));
  }
  return { entities: t, edges: [], nextEntityId: i, nextEdgeId: e.nextEdgeId };
}
function _y(e) {
  let t = [],
    n = [],
    i = [],
    r = Je(e.yamlObjects),
    s = e.nextEntityId,
    o = e.nextEdgeId;
  for (let a of e.assets) {
    if (a.assetKind !== "animator_controller") continue;
    let l = r.get(a.fileId) ?? [],
      c = new Map(),
      d = new Map(),
      f = new Map(),
      m = (y) => {
        (t.push(y), c.set(y.localKey, y));
      };
    for (let y of l) {
      if (y.objectType !== "AnimatorStateMachine") continue;
      for (let g of Si(Qe(y, e.payloadReader), ["m_ChildStates", "state"])) d.set(g, y.localIdentifier);
      let p = ke(s++, a, y, "animator_state_machine", { typeName: "AnimatorStateMachine" });
      m(p);
    }
    for (let y of l) {
      if (y.objectType !== "AnimatorOverrideController") continue;
      let p = ke(s++, a, y, "animator_controller", { name: y.name ?? a.name, typeName: "AnimatorOverrideController" });
      m(p);
    }
    for (let y of l) {
      if (y.objectType !== "AnimatorState") continue;
      let p = d.get(y.localIdentifier),
        g = p ? c.get(p) : null,
        I = ke(s++, a, y, "animator_state", { parentEntityId: g?.id ?? null, typeName: "AnimatorState" });
      (m(I), g && n.push({ id: o++, fromEntityId: I.id, toEntityId: g.id, edgeKind: "child_of" }));
      for (let b of Si(Qe(y, e.payloadReader), ["m_Transitions"])) f.set(b, y.localIdentifier);
    }
    for (let y of l) {
      if (y.objectType !== "AnimatorStateTransition") continue;
      let p = f.get(y.localIdentifier),
        g = p ? c.get(p) : null,
        I = ke(s++, a, y, "animator_transition", {
          name: y.name || "Transition",
          parentEntityId: g?.id ?? null,
          typeName: "AnimatorStateTransition",
        });
      (m(I), g && n.push({ id: o++, fromEntityId: I.id, toEntityId: g.id, edgeKind: "child_of" }));
    }
    i.push(...ul({ yamlObjects: l.filter((y) => c.has(y.localIdentifier)), payloadReader: e.payloadReader }));
  }
  return { entities: t, edges: n, nextEntityId: s, nextEdgeId: o, pendingEdgeIntents: i };
}
function ul(e) {
  let t = [];
  for (let n of e.yamlObjects) {
    let i = nv(n.objectType, Qe(n, e.payloadReader));
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
function Sy(e) {
  let t = [],
    n = e.nextEdgeId;
  for (let i of e.intents) {
    let r =
      e.entityIndexes.entitySummaryByYamlObjectId.get(i.sourceYamlObjectId)?.entityId ??
      e.entityIndexes.entityIdByFileIdAndLocalKey.get(oe(i.sourceFileId, i.sourceLocalKey));
    if (r === void 0) continue;
    let s = i.targetLocalId ?? i.targetFileId;
    if (!s || s === "0") continue;
    let o = ev(e.assetIndexes, { sourceFileId: i.sourceFileId, targetGuid: i.targetGuid });
    if (o === null) continue;
    let a = e.entityIndexes.entityIdByFileIdAndLocalKey.get(oe(o, s));
    if (a === void 0 || a === r) continue;
    let l = tv(i.edgeSubkind),
      c = Me(r, a, "refs", l);
    e.edgeState.seenEntityEdges.has(c) ||
      (e.edgeState.seenEntityEdges.add(c),
      t.push({ id: n++, fromEntityId: r, toEntityId: a, edgeKind: "refs", edgeSubkind: l }));
  }
  return { edges: t, nextEdgeId: n };
}
function ev(e, t) {
  if (!t.targetGuid) return t.sourceFileId;
  let n = e.assetIdByGuid.get(t.targetGuid);
  return n === void 0 ? null : (e.fileIdByAssetId.get(n) ?? null);
}
function tv(e) {
  return e === "override" ? "animator_override_clip" : null;
}
function nv(e, t) {
  return e === "AnimatorState"
    ? [{ ...as(t, ["m_Motion"]), fieldPath: "m_Motion", edgeSubkind: "motion" }]
    : e === "AnimatorStateTransition"
      ? [{ ...as(t, ["m_DstState"]), fieldPath: "m_DstState", edgeSubkind: "transition" }]
      : e === "AnimatorOverrideController"
        ? iv(t)
        : [];
}
function iv(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return [];
  let t = e.m_Clips;
  return Array.isArray(t)
    ? t.map((n, i) => ({
        ...as(n, ["m_OverrideClip"]),
        fieldPath: `m_Clips[${i}].m_OverrideClip`,
        edgeSubkind: "override",
      }))
    : [];
}
function Ry(e, t) {
  let n = e.name?.trim();
  if (n) return n;
  let i = Qe(e, t);
  return Iy(i, ["m_Name"])?.trim() ?? e.localIdentifier;
}
function wy(e) {
  let t = [],
    n = [],
    i = Je(e.yamlObjects),
    r = e.nextEntityId,
    s = e.nextEdgeId;
  for (let o of e.assets) {
    if (o.assetKind !== "audio_mixer") continue;
    let l = (i.get(o.fileId) ?? []).filter((m) => m.objectType === "AudioMixerGroupController"),
      c = new Map(),
      d = new Map();
    for (let m of l) {
      let y = Si(Qe(m, e.payloadReader), ["m_Children"]);
      (c.set(m.localIdentifier, y), y.forEach((p) => d.set(p, m.localIdentifier)));
    }
    let f = new Map();
    for (let m of l) {
      let y = d.get(m.localIdentifier),
        p = y ? f.get(y) : null,
        g = Ry(m, e.payloadReader),
        I = sv(m.localIdentifier, l, d, (E) => Ry(E, e.payloadReader)),
        b = ke(r++, o, m, "audio_mixer_group", {
          name: g,
          hierarchyName: I,
          parentEntityId: p?.id ?? null,
          typeName: "AudioMixerGroup",
        });
      (t.push(b), f.set(b.localKey, b));
    }
    for (let [m, y] of c.entries()) {
      let p = f.get(m);
      for (let g of y) {
        let I = f.get(g);
        !p ||
          !I ||
          ((I.parentEntityId = p.id), n.push({ id: s++, fromEntityId: I.id, toEntityId: p.id, edgeKind: "child_of" }));
      }
    }
  }
  return { entities: t, edges: n, nextEntityId: r, nextEdgeId: s, pendingEdgeIntents: [] };
}
function vy(e) {
  let t = [],
    n = e.nextEdgeId;
  for (let i of e.intents) {
    let r =
      e.entityIndexes.entitySummaryByYamlObjectId.get(i.sourceYamlObjectId)?.entityId ??
      e.entityIndexes.entityIdByFileIdAndLocalKey.get(oe(i.sourceFileId, i.sourceLocalKey));
    if (r === void 0) continue;
    let s = i.targetLocalId ?? i.targetFileId;
    if (!s || s === "0") continue;
    let o = rv(e.assetIndexes, { sourceFileId: i.sourceFileId, targetGuid: i.targetGuid });
    if (o === null) continue;
    let a = e.entityIndexes.entityIdByFileIdAndLocalKey.get(oe(o, s));
    if (a === void 0 || a === r || e.entityIndexes.entitySummaryById.get(a)?.entityKind !== "audio_mixer_group")
      continue;
    let c = i.edgeSubkind ?? "USES_AUDIO_MIXER_GROUP",
      d = Me(r, a, "refs", c);
    e.edgeState.seenEntityEdges.has(d) ||
      (e.edgeState.seenEntityEdges.add(d),
      t.push({ id: n++, fromEntityId: r, toEntityId: a, edgeKind: "refs", edgeSubkind: c }));
  }
  return { edges: t, nextEdgeId: n };
}
function rv(e, t) {
  if (!t.targetGuid) return e.assetIdByFileId.has(t.sourceFileId) ? t.sourceFileId : null;
  let n = e.assetIdByGuid.get(t.targetGuid);
  return n === void 0 ? null : (e.fileIdByAssetId.get(n) ?? null);
}
function sv(e, t, n, i) {
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
function ls(e) {
  let t = e.trim();
  if (!t) return !1;
  let n = Number(t);
  return Number.isSafeInteger(n) && n > 0 && n % 1e5 === 0;
}
var ov = ["m_Name", "templateName", "description", "badge", "addToDefaults"],
  av = ["templateScene", "templatePipeline"];
function Ty(e) {
  let t = e.split(/\r?\n/),
    n = lv(t);
  if (!n) return [];
  let i = dv(t, n.startLine, n.endLine),
    r = [],
    s = xy(t, i, ov);
  s.length > 0 && r.push(fl(t, "Details", "scene_template_details", "details", s));
  let o = cv(t, n.startLine),
    a = i.get("preview");
  o
    ? r.push(Py("Thumbnail", "scene_template_thumbnail", "thumbnail", t, o.startLine, o.endLine))
    : a !== void 0 && r.push(fl(t, "Thumbnail", "scene_template_thumbnail", "thumbnail", [a]));
  let l = xy(t, i, av);
  l.length > 0 && r.push(fl(t, "SceneTemplatePipeline", "scene_template_pipeline", "scene_template_pipeline", l));
  let c = i.get("dependencies");
  if (c !== void 0) {
    let d = uv(t, c, n.endLine, i);
    r.push(Py("Dependencies", "scene_template_dependencies", "dependencies", t, c, d));
  }
  return r;
}
function fl(e, t, n, i, r) {
  let s = Ny(
    r.map((o) => e[o - 1] ?? "").join(`
`),
  );
  return { name: t, entityKind: n, localKey: i, lineStart: Math.min(...r), lineEnd: Math.max(...r), content: s };
}
function Py(e, t, n, i, r, s) {
  let o = Ny(
    i.slice(r - 1, s).join(`
`),
  );
  return { name: e, entityKind: t, localKey: n, lineStart: r, lineEnd: s, content: o };
}
function lv(e) {
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
function cv(e, t) {
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
function dv(e, t, n) {
  let i = new Map();
  for (let r = t; r <= n; r += 1) {
    let s = e[r - 1] ?? "";
    if (!s.startsWith("  ") || s.startsWith("    ")) continue;
    let o = s.match(/^ {2}([A-Za-z0-9_]+):/);
    o && i.set(o[1], r);
  }
  return i;
}
function xy(e, t, n) {
  return n
    .map((i) => t.get(i))
    .filter((i) => i !== void 0)
    .sort((i, r) => i - r);
}
function uv(e, t, n, i) {
  let r = [...i.entries()]
    .filter(([s, o]) => s !== "dependencies" && o > t)
    .map(([, s]) => s)
    .sort((s, o) => s - o);
  return r.length > 0 ? r[0] - 1 : n;
}
function Ny(e) {
  return e
    .split(
      `
`,
    )
    .map((t) => fv(t)).join(`
`);
}
function fv(e) {
  return e.length <= 240 ? e : `${e.slice(0, 240)} ... <truncated>`;
}
function cs(e, t) {
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
function Ri(e) {
  return e.startsWith("scene_template_");
}
function Oy(e) {
  return "yamlReferences" in e
    ? e.yamlReferences
        .filter((t) => t.sourceYamlObjectId === e.yamlObject.id)
        .flatMap((t) => {
          let n = t.targetLocalId ?? t.targetFileId;
          return !n || n === "0"
            ? []
            : Uy(Sv(t.fieldPath))
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
    : Iv(e.payload).map((t) => ({
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
function Ay(e) {
  let t = [],
    n = Ev(e.entityIndexes),
    i = e.nextEdgeId;
  for (let r of e.intents) {
    let s = mv(e.entityIndexes, n, r);
    if (s.length === 0) continue;
    let o = r.targetLocalId ?? r.targetFileId;
    if (!o || o === "0") continue;
    let a = _v(e.assetIndexes, r);
    if (a === null) continue;
    let l = Ly(e.entityIndexes, a, o);
    if (
      (!l &&
        r.targetGuid &&
        pv({ path: r.fieldPath, fileID: o, guid: r.targetGuid }) &&
        !ls(o) &&
        gv({
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
        let d = bv(c, r.fieldPath, l),
          f = Me(c.entityId, l.entityId, "refs", d);
        e.edgeState.seenEntityEdges.has(f) ||
          (e.edgeState.seenEntityEdges.add(f),
          t.push({ id: i++, fromEntityId: c.entityId, toEntityId: l.entityId, edgeKind: "refs", edgeSubkind: d }));
      }
  }
  return { edges: t, nextEdgeId: i };
}
function mv(e, t, n) {
  let i = t.get(n.sourceYamlObjectId) ?? [];
  if (i.length > 0) return yv(i, n.fieldPath);
  let r = Ly(e, n.sourceFileId, n.sourceLocalKey);
  return r === null ? [] : [r];
}
function yv(e, t) {
  let n = e.filter((i) => Ri(i.entityKind));
  return n.length === 0 ? e : n.filter((i) => cs(i.entityKind, t));
}
function pv(e) {
  let t = e.path.trim().toLowerCase();
  return t.length > 0 && !t.endsWith("m_script");
}
function gv(e) {
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
var hv = [
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
function Uy(e) {
  let t = e.toLowerCase();
  return t.includes("m_modification.m_modifications") && t.endsWith(".target")
    ? !0
    : hv.some((n) => {
        let i = n.toLowerCase();
        return t === i || t.endsWith(`.${i}`);
      });
}
function Iv(e) {
  let t = [];
  return (
    ml(e, [], (n, i) => {
      if (!n || typeof n != "object" || Array.isArray(n)) return;
      let r = n;
      if (r.fileID === void 0) return;
      let s = ky(r.fileID);
      if (!s || s === "0") return;
      let o = My(i).join(".");
      Uy(o) || t.push({ path: i.join("."), fileID: s, guid: ky(r.guid) });
    }),
    t
  );
}
function bv(e, t, n) {
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
function Ly(e, t, n) {
  let i = e.entityIdByFileIdAndLocalKey.get(oe(t, n));
  return i === void 0 ? null : (e.entitySummaryById.get(i) ?? null);
}
function Ev(e) {
  let t = new Map();
  for (let n of e.entitySummaryById.values()) {
    if (n.yamlObjectId === null) continue;
    let i = t.get(n.yamlObjectId) ?? [];
    (i.push(n), t.set(n.yamlObjectId, i));
  }
  return t;
}
function _v(e, t) {
  if (!t.targetGuid) return e.assetIdByFileId.has(t.sourceFileId) ? t.sourceFileId : null;
  let n = e.assetIdByGuid.get(t.targetGuid);
  return n === void 0 ? null : (e.fileIdByAssetId.get(n) ?? null);
}
function ky(e) {
  return typeof e == "string" ? e.trim() || null : typeof e == "number" ? String(e) : null;
}
function My(e) {
  return e.filter((t) => !/^\d+$/.test(t));
}
function Sv(e) {
  return My(e.replace(/\[\d+\]/g, "").split(".")).join(".");
}
function ml(e, t, n) {
  if ((n(e, t), !(!e || typeof e != "object"))) {
    if (Array.isArray(e)) {
      e.forEach((i, r) => ml(i, [...t, String(r)], n));
      return;
    }
    Object.entries(e).forEach(([i, r]) => ml(r, [...t, i], n));
  }
}
function yl(e) {
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
function Fy(e) {
  return { entities: [], edges: [], nextEntityId: e.nextEntityId, nextEdgeId: e.nextEdgeId };
}
import { readFileSync as Rv } from "node:fs";
function Ye(e, t) {
  let n = e.get(t);
  if (!n) return null;
  try {
    return Rv(n, "utf8");
  } catch {
    return null;
  }
}
import pl from "node:path";
import wv from "node:path";
function ds(e, t) {
  if (t === "project-settings") return "project_settings";
  if (t === "scene") return "scene";
  if (t === "prefab") return "prefab";
  let n = Ft(e);
  if (n) return n.assetKind;
  let i = wv.posix.extname(e).toLowerCase();
  return i === ".mat" ? "material" : i === ".mixer" ? "audio_mixer" : "yaml-asset";
}
function Dy(e) {
  let t = 1,
    n = new Set();
  return e
    .filter((i) => Pv(i))
    .filter((i) => {
      let r = Cy(i);
      return n.has(r) ? !1 : (n.add(r), !0);
    })
    .map((i) => ({
      id: t++,
      projectId: 1,
      fileId: i.id,
      assetKind: ds(i.projectRelPath, i.kind),
      guid: Cy(i),
      name: pl.posix.basename(i.projectRelPath, pl.posix.extname(i.projectRelPath)),
      vfsRootPath: i.projectRelPath,
    }));
}
function Pv(e) {
  return ["asset", "asmdef", "csharp", "scene", "prefab", "yaml-asset"].includes(e.kind)
    ? !!e.guid
    : e.kind === "project-settings" && xv(e.projectRelPath);
}
function Cy(e) {
  return e.guid ?? `project-settings:${e.projectRelPath}`;
}
function xv(e) {
  let t = pl.posix.extname(e).toLowerCase();
  return t === ".asset" || t === ".yaml" || t === ".yml";
}
function jy(e) {
  let t = [],
    n = [],
    i = [],
    r = Ov(e.yamlObjects, (o) => o.fileId),
    s = e.nextEntityId;
  for (let o of e.assets) {
    if (o.assetKind !== "project_settings") continue;
    let a = r.get(o.fileId) ?? [];
    for (let l of a) (t.push(ke(s++, o, l, "subasset")), i.push(...Tv(o.fileId, l, e.payloadReader)));
  }
  return { entities: t, edges: n, nextEntityId: s, nextEdgeId: e.nextEdgeId, pendingEdgeIntents: i };
}
function By(e) {
  let t = [],
    n = e.nextEdgeId;
  for (let i of e.intents) {
    if (i.targetLocalId === null) continue;
    let r = Nv(i.targetFileId, i.sourceFileId);
    if (r === null) continue;
    let s = e.entityIndexes.entityIdByFileIdAndLocalKey.get(oe(i.sourceFileId, i.sourceLocalKey)),
      o = e.entityIndexes.entityIdByFileIdAndLocalKey.get(oe(r, i.targetLocalId));
    if (s === void 0 || o === void 0 || s === o) continue;
    let a = Me(s, o, "refs", i.edgeSubkind);
    e.edgeState.seenEntityEdges.has(a) ||
      (e.edgeState.seenEntityEdges.add(a), t.push({ id: n++, fromEntityId: s, toEntityId: o, edgeKind: "refs" }));
  }
  return { edges: t, nextEdgeId: n };
}
function Tv(e, t, n) {
  return dl(Qe(t, n))
    .sort(kv)
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
function Nv(e, t) {
  if (e === null) return t;
  let n = Number(e);
  return Number.isInteger(n) ? n : null;
}
function kv(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function Ov(e, t) {
  let n = new Map();
  for (let i of e) {
    let r = t(i),
      s = n.get(r) ?? [];
    (s.push(i), n.set(r, s));
  }
  return n;
}
function Gy(e) {
  let t = [],
    n = [],
    i = Av(e.yamlObjects, (s) => s.fileId),
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
function Av(e, t) {
  let n = new Map();
  for (let i of e) {
    let r = t(i),
      s = n.get(r) ?? [];
    (s.push(i), n.set(r, s));
  }
  return n;
}
var Uv = new Set(["LightmapSettings", "NavMeshSettings", "OcclusionCullingSettings", "RenderSettings"]);
function Ky(e) {
  let t = [],
    n = [],
    i = new Map(e.assets.filter((o) => o.assetKind === "scene").map((o) => [o.fileId, o])),
    r = new Set(e.existingEntities.map((o) => o.yamlObjectId).filter((o) => o !== null));
  for (let o of e.entityIndexes?.entitySummaryByYamlObjectId.keys() ?? []) r.add(o);
  let s = e.nextEntityId;
  for (let o of e.yamlObjects) {
    if (!Uv.has(o.objectType)) continue;
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
function Yy(e) {
  let t = [],
    n = [],
    i = Je(e.yamlObjects),
    r = e.nextEntityId;
  for (let s of e.assets) {
    if (s.assetKind !== "scene_template") continue;
    let o = Ye(e.fileAbsPathById, s.fileId);
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
    let l = Ty(o);
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
function $y(e) {
  let t = [],
    n = [],
    i = Je(e.yamlObjects),
    r = e.nextEntityId,
    s = e.nextEdgeId;
  for (let o of e.assets) {
    if (o.assetKind !== "scriptable_object") continue;
    let a = [],
      l = i.get(o.fileId) ?? [];
    for (let c of l) {
      let d = c.scriptGuid ? (e.scriptSymbolByFileGuid.get(c.scriptGuid) ?? null) : null,
        f = c.objectType === "MonoBehaviour" || !!d,
        m = ke(r++, o, c, f ? "scriptable_object" : "subasset", {
          name: f && d ? d.simpleName : c.name,
          typeName: f && d ? d.qualifiedName : c.objectType,
          scriptSymbolId: d?.id ?? null,
        });
      (t.push(m), a.push(m));
    }
    s = by({ edges: n, assetId: o.id, entities: a, yamlObjects: l, nextEdgeId: s, payloadReader: e.payloadReader });
  }
  return { entities: t, edges: n, nextEntityId: r, nextEdgeId: s };
}
function Ht(e, t) {
  return e?.trim() || t;
}
function hl(e) {
  let t = Lv(e),
    n = new Map(),
    i = t.find((a) => Mv(a)) ?? t[0] ?? null;
  for (let a of t) {
    let l = Ze(a);
    l && a && typeof a == "object" && n.set(l, a);
  }
  Hv(n, i);
  let r = Fv(t, i, n),
    s = Cv(i, n),
    o = Dv(t, i, n);
  return (
    jv(o, i, n, r),
    { graphName: V(i, ["m_Name", "name", "displayName", "m_Path"]), properties: r, settings: s, nodes: o }
  );
}
function Il(e, t) {
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
function Qy(e, t) {
  return Il(hl(e), t);
}
function bl(e) {
  return e === "shader_graph_properties" || e === "shader_graph_settings" || e === "shader_graph_node";
}
function Lv(e) {
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
function Mv(e) {
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
function Fv(e, t, n) {
  let i = [],
    r = new Set(),
    s = (o) => {
      let a = Ze(o),
        l = V(o, ["m_Name", "m_DisplayName", "displayName", "name"]) ?? (a ? `Property@${wi(a)}` : null);
      if (!l) return;
      let c = a ?? l;
      r.has(c) ||
        (r.add(c),
        i.push({
          name: l,
          refName: V(o, ["m_RefName", "m_DefaultReferenceName", "overrideReferenceName", "referenceName"]),
          propertyType: El(V(o, ["m_Type", "type", "m_SerializedType"]) ?? "ShaderProperty"),
          defaultValue: o.m_Value ?? o.m_Default ?? null,
          objectId: a,
        }));
    };
  for (let o of Fe(t, "m_Properties")) {
    let a = ae(o);
    if (!a) continue;
    let l = Ze(a),
      c = l && n.has(l) ? n.get(l) : a;
    s(c);
  }
  for (let o of Fe(t, "m_SerializedProperties")) {
    let a = En(o);
    a && s(a);
  }
  for (let o of e) {
    if (!o || typeof o != "object" || Array.isArray(o)) continue;
    let a = o,
      l = V(a, ["m_Type", "type", "m_SerializedType"]) ?? "";
    /property/i.test(l) && s(a);
  }
  return i;
}
function Cv(e, t) {
  let n = new Set();
  for (let s of Fe(e, "m_ActiveTargets")) {
    let o = Zy(s, t) ?? ae(s),
      a = V(o, ["m_SerializedDescriptor", "serializedDescriptor", "m_DisplayName", "displayName", "m_Name", "name"]);
    a && n.add(a);
  }
  for (let s of t.values()) {
    let o = V(s, ["m_Type", "type", "m_SerializedType"]) ?? "";
    if (!/target/i.test(o)) continue;
    let a = V(s, ["m_SerializedDescriptor", "serializedDescriptor", "m_DisplayName", "displayName", "m_Name", "name"]);
    a && n.add(a);
  }
  let i = V(e, ["m_OutputNode", "m_ActiveOutputNode", "m_ActiveOutputNodeGuidSerialized"]),
    r = zt(ae(e)?.m_GraphPrecision ?? ae(e)?.graphPrecision ?? ae(e)?.m_ConcretePrecision);
  return {
    targets: [...n],
    activeOutput: i ? tp(i, t) : null,
    keywords: [...Qv(e, "m_Keywords"), ...zv(e)],
    precision: r,
  };
}
function Dv(e, t, n) {
  let i = [],
    r = new Set(),
    s = (o, a) => {
      let l = Ze(o) ?? Xv(o, a);
      if (r.has(l)) return;
      let c = El(V(o, ["m_Type", "type", "m_SerializedType"]) ?? "ShaderGraphNode");
      if (zy(c)) return;
      r.add(l);
      let d = V(o, ["m_Name", "m_Title", "title", "displayName", "m_DisplayName"]),
        f = d ? `${d}@${wi(l)}` : `${c}@${wi(l)}`;
      i.push({
        objectId: l,
        displayName: f,
        typeName: c,
        params: Kv(o),
        inputs: [],
        outputs: Yv(o, n),
        guidReferences: Xt(o),
      });
    };
  return (
    Fe(t, "m_Nodes").forEach((o, a) => {
      let l = Zy(o, n);
      if (l) {
        s(l, `root-node:${a}`);
        return;
      }
      let c = ae(o);
      c && s(c, `root-node:${a}`);
    }),
    Fe(t, "m_SerializableNodes").forEach((o, a) => {
      let l = En(o);
      l && s(l, `legacy-node:${a}`);
    }),
    e.forEach((o, a) => {
      if (!o || typeof o != "object" || Array.isArray(o)) return;
      let l = o,
        c = V(l, ["m_Type", "type", "m_SerializedType"]) ?? "";
      !c || zy(c) || s(l, `document:${a}`);
    }),
    i
  );
}
function jv(e, t, n, i) {
  let r = new Map(e.map((c) => [c.objectId, c])),
    s = Bv(n, i),
    o = Gv(e, n, s),
    a = new WeakSet(),
    l = (c) => {
      let d = ae(c);
      if (!(!d || a.has(d))) {
        a.add(d);
        for (let f of Fe(d, "m_Edges")) Vy(f, r, o, n, s);
        for (let f of Fe(d, "m_SerializableEdges")) {
          let m = En(f);
          m && Vy(m, r, o, n, s);
        }
      }
    };
  l(t);
  for (let c of n.values()) l(c);
}
function Bv(e, t) {
  let n = new Map();
  t.forEach((r) => {
    r.objectId && n.set(r.objectId, r);
  });
  let i = new Map();
  return (
    e.forEach((r, s) => {
      let o = El(V(r, ["m_Type", "type", "m_SerializedType"]) ?? "");
      if (!ep(o)) return;
      let a = Ze(ae(r.m_Property)) ?? V(r, ["m_PropertyGuidSerialized", "propertyGuidSerialized"]),
        l = a ? n.get(a) : void 0,
        c = a ? e.get(a) : void 0,
        d = l?.refName ?? V(c, ["m_DefaultReferenceName", "m_RefName", "overrideReferenceName"]),
        f = l?.name ?? V(c, ["m_Name", "m_DisplayName"]),
        m = d ?? f ?? "Property";
      i.set(s, `${m}@${wi(s)}`);
    }),
    i
  );
}
function Wy(e, t, n, i) {
  Fe(t, "m_Slots").forEach((r) => {
    let s = Ze(ae(r));
    if (!s) return;
    let o = n.get(s);
    if (!o) return;
    let a = zt(o.m_Id);
    if (a === null) return;
    let l = V(o, ["m_DisplayName", "displayName", "m_ShaderOutputName", "shaderOutputName"]) ?? `slot ${a}`;
    i.set(`${e}:${a}`, l);
  });
}
function Gv(e, t, n) {
  let i = new Map();
  return (
    e.forEach((r) => {
      r.outputs.forEach((o) => {
        let a = o.name.match(/^slot (\d+)$/)?.[1];
        a ? i.set(`${r.objectId}:${a}`, o.name) : i.set(`${r.objectId}:${o.name}`, o.name);
      });
      let s = t.get(r.objectId);
      s && Wy(r.objectId, s, t, i);
    }),
    n.forEach((r, s) => {
      let o = t.get(s);
      (o && Wy(s, o, t, i), i.has(`${s}:0`) || i.set(`${s}:0`, "Out"));
    }),
    i
  );
}
function Vy(e, t, n, i, r) {
  let s = ae(e);
  if (!s) return;
  let o = ae(s.m_OutputSlot),
    a = ae(s.m_InputSlot);
  if (!o || !a) return;
  let l = qy(o),
    c = qy(a),
    d = zt(o.m_SlotId),
    f = zt(a.m_SlotId);
  if (!l || !c) return;
  let m = Hy(l, d, t, n, i, r),
    y = Hy(c, f, t, n, i, r),
    p = t.get(c);
  if (p) {
    let I = n.get(`${c}:${f}`) ?? `slot ${f ?? "0"}`,
      b = p.inputs.find((E) => E.name === I);
    b ? (b.from = m) : p.inputs.push({ name: I, from: m });
  }
  let g = t.get(l);
  if (g) {
    let I = n.get(`${l}:${d}`) ?? `slot ${d ?? "0"}`,
      b = g.outputs.find((E) => E.name === I);
    b ? (b.to = [...(b.to ?? []), y]) : g.outputs.push({ name: I, to: [y] });
  }
}
function Kv(e) {
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
          t[Xy(i)] = s;
          continue;
        }
      }
      (typeof r == "string" || typeof r == "number" || typeof r == "boolean" || Array.isArray(r)) && (t[Xy(i)] = r);
    }
  return t;
}
function Yv(e, t) {
  let n = Fe(e, "m_SerializableSlots");
  if (n.length > 0)
    return n
      .map((r, s) => {
        let o = En(r) ?? ae(r);
        if (!o) return { name: `slot ${s}` };
        let a = zt(o.m_Id) ?? String(s);
        return {
          name: V(o, ["m_DisplayName", "displayName", "m_ShaderOutputName", "shaderOutputName"]) ?? `slot ${a}`,
          to: [],
        };
      })
      .filter(Boolean);
  let i = [];
  return (
    Fe(e, "m_Slots").forEach((r) => {
      let s = Ze(ae(r));
      if (!s) return;
      let o = t.get(s);
      if (!o) return;
      let a = o.m_SlotType;
      if (a !== 1 && a !== "1") return;
      let l = zt(o.m_Id),
        c =
          V(o, ["m_DisplayName", "displayName", "m_ShaderOutputName", "shaderOutputName"]) ?? (l ? `slot ${l}` : "Out");
      i.push({ name: c, to: [] });
    }),
    i
  );
}
function Xt(e) {
  let t = [];
  return (
    gl(e, [], (n, i) => {
      if (!n || typeof n != "object" || Array.isArray(n)) return;
      let r = n,
        s = Jy(r.guid);
      s && t.push({ path: i.join("."), fileID: Jy(r.fileID), guid: s });
    }),
    t
  );
}
function Zy(e, t) {
  if (e && typeof e == "object" && !Array.isArray(e)) {
    let n = e,
      i = Ze(n);
    if (i && t.has(i)) return t.get(i);
    if (Wv(n) || $v(n)) return n;
  }
  return null;
}
function $v(e) {
  let t = V(e, ["m_Type", "type", "m_SerializedType"]) ?? "";
  return /target/i.test(t) || typeof e.m_SerializedDescriptor == "string" || typeof e.serializedDescriptor == "string";
}
function Wv(e) {
  return !!(V(e, ["m_Type", "type"]) || Array.isArray(e.m_SerializableSlots) || e.m_FunctionSource || e.m_SubGraph);
}
function Ze(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  let t = e,
    n = V(t, ["m_ObjectId", "m_Id", "m_GuidSerialized", "objectId", "id"]) ?? null;
  if (n) return n;
  let i = ae(t.m_Guid);
  return V(i, ["m_GuidSerialized", "guidSerialized"]) ?? null;
}
function Vv(e) {
  return Ze(e);
}
function qy(e) {
  return Vv(e.m_Node) ?? V(e, ["m_NodeGUIDSerialized", "m_NodeGuidSerialized"]);
}
function En(e) {
  let t = ae(e);
  if (!t) return null;
  let n = t.JSONnodeData;
  if (typeof n != "string" || !n.trim()) return t;
  try {
    let i = JSON.parse(n),
      r = V(t.typeInfo, ["fullName"]);
    return (r && (i.m_Type = r), i);
  } catch {
    return null;
  }
}
function qv(e) {
  return /ShaderProperty$/i.test(e);
}
function ep(e) {
  return /^PropertyNode$/i.test(e);
}
function zy(e) {
  return (
    qv(e) ||
    ep(e) ||
    /MaterialSlot$/i.test(e) ||
    /^CategoryData$/i.test(e) ||
    /^GraphData$/i.test(e) ||
    /target$/i.test(e) ||
    /UniversalTarget|HDTarget/.test(e)
  );
}
function zv(e) {
  let t = [];
  for (let n of Fe(e, "m_SerializedKeywords")) {
    let i = En(n),
      r = V(i, ["m_Name", "m_DisplayName", "name"]);
    r && t.push(r);
  }
  return t;
}
function Hv(e, t) {
  for (let n of ["m_SerializedProperties", "m_SerializableNodes", "m_SerializableEdges"])
    for (let i of Fe(t, n)) {
      let r = En(i),
        s = r ? Ze(r) : null;
      r && s && !e.has(s) && e.set(s, r);
    }
}
function Fe(e, t) {
  let i = ae(e)?.[t];
  return Array.isArray(i) ? i : [];
}
function ae(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? null : e;
}
function wi(e) {
  return e.replace(/-/g, "").slice(0, 8);
}
function Xv(e, t) {
  let n = V(e, ["m_Type", "type", "m_SerializedType"]) ?? "ShaderGraphNode",
    i = V(e, ["m_Name", "m_Title", "title", "displayName", "m_DisplayName"]) ?? "",
    r = `${n}|${i}|${t}`,
    s = 0;
  for (let a = 0; a < r.length; a += 1) s = (s * 31 + r.charCodeAt(a)) | 0;
  let o = (Math.abs(s) >>> 0).toString(16).padStart(8, "0").slice(-8);
  return `${o}-0000-4000-8000-${o}00000000`.slice(0, 36);
}
function tp(e, t) {
  let n = t.get(e);
  return `${(n ? V(n, ["m_Name", "name", "m_DisplayName"]) : null) ?? "Node"}@${wi(e)}`;
}
function Jv(e, t, n, i) {
  let r = t.get(e);
  if (r) return r.displayName;
  let s = i.get(e);
  return s || tp(e, n);
}
function Hy(e, t, n, i, r, s) {
  let o = Jv(e, n, r, s),
    a = (t ? i.get(`${e}:${t}`) : null) ?? (t ? `slot ${t}` : "Out");
  return `${o}.${a}`;
}
function Xy(e) {
  return e.startsWith("m_") ? e.slice(2) : e;
}
function El(e) {
  return (
    e
      .split(/[.$,+]/)
      .map((t) => t.trim())
      .filter(Boolean)
      .at(-1) ?? e
  );
}
function V(e, t) {
  let n = ae(e);
  if (!n) return null;
  for (let i of t) {
    let r = n[i];
    if (typeof r == "string" && r.trim()) return r.trim();
  }
  return null;
}
function Qv(e, t) {
  let i = ae(e)?.[t];
  return Array.isArray(i) ? i.map((r) => (typeof r == "string" ? r.trim() : "")).filter(Boolean) : [];
}
function zt(e) {
  return typeof e == "string" ? e.trim() || null : typeof e == "number" ? String(e) : null;
}
function Jy(e) {
  return zt(e);
}
function gl(e, t, n) {
  if ((n(e, t), Array.isArray(e))) {
    e.forEach((i, r) => gl(i, [...t, String(r)], n));
    return;
  }
  e && typeof e == "object" && Object.entries(e).forEach(([i, r]) => gl(r, [...t, i], n));
}
var Zv = "7d4c867f6b72b714dbb5fd1780afe208",
  eP = "d01270efd3285ea4a9d6c555cb0a8027",
  np = {
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
  sp = {
    "73a13919d81fb7444849bae8b5c812a2": "Spawn system",
    "9dfea48843f53fc438eabc12a3a30abc": "Initialize Particle",
    "2dc095764ededfa4bb32fa602511ea4b": "Particle Update",
    a0b9e6b9139e58d4c957ec54595da7d3: "Output Particle",
    "5e382412bb691334bb79457a6c127924": "Spawn Rate",
    d16c6aeaef944094b9a1633041804207: "Orient Particle",
    a971fa2e110a0ac42ac1d8dae408704b: "Set Size",
  },
  tP = [
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
  nP = new Set([
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
function op(e, t) {
  let n = new Map(),
    i = new Map();
  for (let p of e) {
    let g = t.read(p);
    !g ||
      typeof g != "object" ||
      Array.isArray(g) ||
      (n.set(p.localIdentifier, g), i.set(p.localIdentifier, p.scriptGuid?.trim().toLowerCase() ?? null));
  }
  let r = iP(n, i);
  if (!r) return null;
  let s = n.get(r),
    o = Te(s, ["m_Name", "name"]) ?? null,
    a = yp(s, ["m_GraphVersion"]),
    l = new Set(),
    c = new Set();
  for (let [p, g] of n.entries())
    if (!(p === r || rP(g, i.get(p)))) {
      if (Rl(g)) {
        l.add(p);
        continue;
      }
      sP(g, n, l) && c.add(p);
    }
  let d = new Map();
  for (let p of l) {
    let g = n.get(p),
      I = i.get(p),
      b = Te(g, ["m_Label", "label"]),
      E = Sl(g, I),
      w = fp(b, E, I, g, p),
      x = ip(g, "m_InputFlowSlot", n, d, l, i),
      R = ip(g, "m_OutputFlowSlot", n, d, l, i),
      v = [...c].filter((N) => _n(n.get(N), "m_Parent") === p),
      O = rp(g, n);
    d.set(p, {
      localId: p,
      displayName: w,
      label: b,
      typeName: E,
      flowInputs: x,
      flowOutputs: R,
      blockLocalIds: v,
      params: O,
      guidReferences: Xt(O),
    });
  }
  let f = [];
  for (let p of c) {
    let g = n.get(p),
      I = i.get(p),
      b = Te(g, ["attribute", "m_Attribute"]),
      E = Sl(g, I),
      w =
        _n(g, "m_Parent") ??
        [...l].find((v) => {
          let O = n.get(v);
          return yP(O, "m_Children").includes(p);
        }) ??
        "",
      x = fP(b, g, E, I, p),
      R = rp(g, n);
    f.push({
      localId: p,
      displayName: x,
      attribute: b,
      typeName: E,
      parentContextLocalId: w,
      params: R,
      guidReferences: Xt(R),
    });
  }
  let m = oP(s),
    y = aP(s);
  return {
    graphName: o,
    graphVersion: a,
    properties: m,
    subgraphDependencies: y,
    contexts: [...d.values()],
    blocks: f,
  };
}
function ap(e, t) {
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
function lp(e) {
  return (
    e === "visual_effect_graph_properties" ||
    e === "visual_effect_graph_property" ||
    e === "visual_effect_graph_context" ||
    e === "visual_effect_graph_block"
  );
}
function iP(e, t) {
  for (let [n, i] of e.entries())
    if (
      (i.m_GraphVersion !== void 0 || t.get(n) === Zv) &&
      (Array.isArray(i.m_Children) || i.m_ParameterInfo !== void 0)
    )
      return n;
  for (let [n, i] of e.entries()) if (Array.isArray(i.m_Children) && i.m_UIInfos !== void 0) return n;
  return null;
}
function rP(e, t) {
  return t === eP || Te(e, ["m_Name", "name"]) === "VFXUI"
    ? !0
    : e.m_Owners !== void 0 && e.m_Data !== void 0
      ? !Rl(e) && !cp(e)
      : !!dp(e);
}
function Rl(e) {
  return e.m_InputFlowSlot !== void 0 || e.m_OutputFlowSlot !== void 0 || (e.m_Label !== void 0 && e.m_Data !== void 0);
}
function cp(e) {
  return (
    e.attribute !== void 0 ||
    e.m_Attribute !== void 0 ||
    e.m_ActivationSlot !== void 0 ||
    (Array.isArray(e.m_InputSlots) && e.m_Parent !== void 0)
  );
}
function sP(e, t, n) {
  if (!cp(e) || dp(e)) return !1;
  let i = _n(e, "m_Parent");
  if (i && n.has(i)) return !0;
  if (!i) return !1;
  let r = t.get(i);
  return r ? Rl(r) : !1;
}
function dp(e) {
  return e.m_MasterSlot === void 0 || e.m_Label !== void 0 || e.attribute !== void 0
    ? !1
    : e.m_Property !== void 0 || e.m_InputSlots === void 0;
}
function oP(e) {
  let t = e.m_ParameterInfo;
  return Array.isArray(t)
    ? t
        .map((n) => xe(n))
        .filter((n) => n !== null)
        .map((n) => ({
          name: Te(n, ["name", "m_Name"]) ?? "Property",
          path: Te(n, ["path", "m_Path"]),
          realType: Te(n, ["realType", "m_RealType"]),
          sheetType: Te(n, ["sheetType", "m_SheetType"]),
          defaultValue: dP(n),
        }))
    : [];
}
function aP(e) {
  let t = e.m_SubgraphDependencies;
  return Array.isArray(t)
    ? t
        .map((n) => xe(n))
        .filter((n) => n !== null)
        .map((n) => ({ asset: n, guidReferences: Xt(n) }))
    : [];
}
function ip(e, t, n, i, r, s) {
  let o = e[t];
  if (!Array.isArray(o)) return [];
  let a = [];
  for (let l of o) {
    let c = xe(l);
    if (!c) continue;
    let d = c.link ?? c.m_Link;
    if (Array.isArray(d))
      for (let f of d) {
        let m = xe(f);
        if (!m) continue;
        let y = xe(m.context ?? m.m_Context),
          p = y ? (_n(y, "fileID") ?? _n(y, "m_FileID")) : null;
        if (!p || !r.has(p)) continue;
        let g = yp(m, ["slotIndex", "m_SlotIndex"]) ?? 0;
        a.push(lP(p, g, n, i, s));
      }
  }
  return a;
}
function lP(e, t, n, i, r) {
  let s = i.get(e);
  if (s) return `${s.displayName}.slot${t}`;
  let o = n.get(e),
    a = r.get(e),
    l = o ? Te(o, ["m_Label", "label"]) : null,
    c = o ? Sl(o, a) : "Context";
  return `${o ? fp(l, c, a, o, e) : `Context@${wl(e)}`}.slot${t}`;
}
function rp(e, t) {
  let n = {};
  for (let r of tP) e[r] !== void 0 && (n[r] = e[r]);
  for (let [r, s] of Object.entries(e)) nP.has(r) || r in n || (up(s) && (n[r] = s));
  let i = e.m_InputSlots;
  if (Array.isArray(i))
    for (let r of i) {
      let s = xe(r);
      if (!s) continue;
      let o = _n(s, "m_Link"),
        a = o ? t.get(o) : null,
        l = xe(a ? (a.m_Property ?? a.m_MasterSlot) : s.m_Property),
        c = (l ? Te(l, ["name", "m_Name"]) : null) ?? Te(s, ["m_Name", "name"]) ?? "input",
        d = xe(a?.m_MasterData)?.m_Value ?? xe(s.m_MasterData)?.m_Value ?? s.m_Value;
      d !== void 0 && (n[c] = _l(d));
    }
  return n;
}
function up(e) {
  if (e === null || typeof e == "string" || typeof e == "number" || typeof e == "boolean") return !0;
  if (Array.isArray(e)) return e.every((t) => up(t));
  if (e && typeof e == "object") {
    let t = e;
    return cP(t.guid) !== null || t.fileID !== void 0 || t.m_FileID !== void 0;
  }
  return !1;
}
function cP(e) {
  if (typeof e != "string") return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
function dP(e) {
  let t = e.defaultValue ?? e.m_DefaultValue;
  if (t === void 0) return null;
  let n = xe(t);
  if (!n) return t;
  let i = n.m_SerializableObject;
  if (typeof i == "string") {
    let r = _l(i);
    if (r && typeof r == "object" && !Array.isArray(r)) {
      let s = r;
      if (s.obj !== void 0) return _l(s.obj);
    }
    return r;
  }
  return t;
}
function fp(e, t, n, i, r) {
  return `${e ?? (n ? sp[n] : null) ?? uP(i, t)}@${wl(r)}`;
}
function uP(e, t) {
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
          : mp(t) || "Context";
}
function fP(e, t, n, i, r) {
  let s = Te(t, ["m_Name", "name"]),
    o = i ? sp[i] : null;
  return `${e ?? s ?? o ?? mP(n) ?? "Block"}@${wl(r)}`;
}
function _l(e) {
  if (typeof e != "string") return e;
  let t = e.trim();
  return !t.startsWith("{") && !t.startsWith("[") ? e : (pP(t) ?? e);
}
function Sl(e, t) {
  let n = t?.trim().toLowerCase();
  if (n && np[n]) return np[n];
  let i = Te(e, ["m_EditorClassIdentifier", "editorClassIdentifier"]);
  if (i) {
    let o = (i.split(":").pop()?.split(".") ?? []).at(-1);
    if (o) return o;
  }
  let r = Te(e, ["m_Type", "type"]);
  return r ? (r.split(".").at(-1) ?? r) : "VFXNode";
}
function mp(e) {
  return e
    .replace(/^VFX/i, "")
    .replace(/Context$/i, "")
    .replace(/Initialize$/i, " Initialize")
    .trim();
}
function mP(e) {
  return /SetAttribute/i.test(e) || /Constant/i.test(e) ? null : mp(e) || null;
}
function _n(e, t) {
  if (!e) return null;
  let n = e[t];
  if (typeof n == "string" || typeof n == "number") {
    let s = String(n).trim();
    return s.length > 0 && s !== "0" ? s : null;
  }
  let i = xe(n);
  if (!i) return null;
  let r = i.fileID ?? i.m_FileID;
  if (typeof r == "string" || typeof r == "number") {
    let s = String(r).trim();
    return s.length > 0 && s !== "0" ? s : null;
  }
  return null;
}
function yP(e, t) {
  if (!e) return [];
  let n = e[t];
  return Array.isArray(n)
    ? n
        .map((i) => {
          let r = xe(i);
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
function wl(e) {
  return e.replace(/-/g, "").slice(-8);
}
function Te(e, t) {
  for (let n of t) {
    let i = e[n];
    if (typeof i == "string") {
      let r = i.trim();
      if (r.length > 0) return r;
    }
  }
  return null;
}
function yp(e, t) {
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
function xe(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? null : e;
}
function pP(e) {
  try {
    let t = JSON.parse(e);
    return xe(t);
  } catch {
    return null;
  }
}
function pp(e) {
  let t = [],
    n = [],
    i = [],
    r = e.nextEntityId,
    s = e.nextEdgeId;
  for (let a of e.assets) {
    if (!(a.assetKind === "shader_lab" || a.assetKind === "shader_graph" || a.vfsRootPath.endsWith(".shadersubgraph")))
      continue;
    let c = Ye(e.fileAbsPathById, a.fileId);
    if (
      c &&
      (a.assetKind === "shader_lab" && (r = gP(t, r, a.id, c)),
      a.assetKind === "shader_graph" || a.vfsRootPath.endsWith(".shadersubgraph"))
    ) {
      let d = IP(t, r, s, a.id, a.guid, a.vfsRootPath, c, e, i);
      ((r = d.nextEntityId), (s = d.nextEdgeId));
    }
  }
  let o = bP(t, n, r, s, i, e);
  return ((r = o.nextEntityId), (s = o.nextEdgeId), { entities: t, edges: n, nextEntityId: r, nextEdgeId: s });
}
function gp(e, t) {
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
      d = hP(a, c ? r : 1, e.nextEdgeId, s.id, s.guid, s.vfsRootPath, Ye(e.fileAbsPathById, s.fileId) ?? "", e, l);
    c && (n.push(...a), (r = d.nextEntityId));
    let f = o[0].id;
    for (let m of l)
      i.push(
        ...m.references.map((y) => ({
          referenceKind: "shader_graph_guid_ref",
          sourceYamlObjectId: f,
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
function hp(e) {
  let t = [],
    n = [],
    i = new Map(e.assets.map((a) => [a.id, a])),
    r = new Map(),
    s = e.nextEntityId,
    o = e.nextEdgeId;
  for (let a of e.intents) {
    let l = e.entityIndexes.entityIdByFileIdAndLocalKey.get(oe(a.sourceFileId, a.sourceLocalKey)),
      c = e.assetIndexes.assetIdByGuid.get(a.targetGuid ?? ""),
      d = c === void 0 ? void 0 : i.get(c);
    if (!l || !d || d.fileId === a.sourceFileId) continue;
    let f = a.targetLocalId ?? d.guid,
      m = a.targetLocalId ? e.entityIndexes.entityIdByFileIdAndLocalKey.get(oe(d.fileId, a.targetLocalId)) : void 0;
    if (
      ((m ??= r.get(`${d.id}:${f}`)),
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
        localKey: f,
        name: d.name,
        hierarchyName: null,
        typeName: Ip(d.assetKind),
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: 1,
        lineEnd: 1,
      };
      (t.push(p), r.set(`${d.id}:${f}`, p.id), (m = p.id));
    }
    let y = Me(l, m, "refs", a.edgeSubkind);
    e.edgeState.seenEntityEdges.has(y) ||
      (e.edgeState.seenEntityEdges.add(y),
      n.push({ id: o++, fromEntityId: l, toEntityId: m, edgeKind: "refs", edgeSubkind: a.edgeSubkind }));
  }
  return { entities: t, edges: n, nextEntityId: s, nextEdgeId: o };
}
function gP(e, t, n, i) {
  let r = i.match(/\bProperties\s*\{([\s\S]*?)^\s*\}/m)?.[1] ?? "",
    s = /^\s*([A-Za-z_][\w]*)\s*\([^,]+,\s*([^)]+)\)/gm;
  for (let l of r.matchAll(s)) {
    let c = l[1],
      d = l[2]?.trim() ?? "";
    e.push(vl(t++, n, "shader_property", c, wP(d) ? "TextureProperty" : "ShaderProperty"));
  }
  let o = /\bPass\s*\{[\s\S]*?\bName\s+"([^"]+)"/g;
  for (let l of i.matchAll(o)) e.push(vl(t++, n, "shader_pass", l[1], "ShaderPass"));
  let a = i.match(/\bFallback\s+"([^"]+)"/)?.[1] ?? null;
  return (a && e.push(vl(t++, n, "shader_fallback", a, "ShaderFallback")), t);
}
function hP(e, t, n, i, r, s, o, a, l) {
  if (!RP(o))
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
  let c = a.yamlObjects.filter((E) => E.fileId === a.assets.find((w) => w.id === i)?.fileId),
    d = op(c, a.payloadReader);
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
  let f = Ht(r, s),
    m = ap(d, f),
    y = `vfx_graph_properties:${f}`,
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
  let g = d.subgraphDependencies.flatMap((E) => E.guidReferences),
    I = Xt(d.properties),
    b = [...g, ...I];
  b.length > 0 && l.push({ sourceEntity: p, references: b });
  for (let E of d.contexts) {
    let w = `vfx_graph_context:${E.localId}`,
      x = {
        id: t++,
        assetId: i,
        yamlObjectId: null,
        entityKind: "visual_effect_graph_context",
        localKey: w,
        name: E.displayName,
        hierarchyName: null,
        typeName: E.typeName,
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: 1,
        lineEnd: 1,
        generatedContent: m.get(w) ?? null,
      };
    (e.push(x), E.guidReferences.length > 0 && l.push({ sourceEntity: x, references: E.guidReferences }));
  }
  for (let E of d.blocks) {
    let w = `vfx_graph_block:${E.localId}`,
      x = {
        id: t++,
        assetId: i,
        yamlObjectId: null,
        entityKind: "visual_effect_graph_block",
        localKey: w,
        name: E.displayName,
        hierarchyName: null,
        typeName: E.typeName,
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: 1,
        lineEnd: 1,
        generatedContent: m.get(w) ?? null,
      };
    (e.push(x), E.guidReferences.length > 0 && l.push({ sourceEntity: x, references: E.guidReferences }));
  }
  return { nextEntityId: t, nextEdgeId: n };
}
function IP(e, t, n, i, r, s, o, a, l) {
  let c;
  try {
    c = hl(o);
  } catch (I) {
    return (
      a.diagnostics.push({
        severity: "warning",
        category: "extract",
        stage: "resolve",
        filePath: s,
        message: `Failed to parse ShaderGraph JSON: ${vP(I)}`,
      }),
      { nextEntityId: t, nextEdgeId: n }
    );
  }
  let d = Ht(r, s),
    f = Il(c, d),
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
      generatedContent: f.get(m) ?? null,
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
      generatedContent: f.get(p) ?? null,
    };
  e.push(g);
  for (let I of c.nodes) {
    let b = `shader_graph_node:${I.objectId}`,
      E = {
        id: t++,
        assetId: i,
        yamlObjectId: null,
        entityKind: "shader_graph_node",
        localKey: b,
        name: I.displayName,
        hierarchyName: null,
        typeName: I.typeName,
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: 1,
        lineEnd: 1,
        generatedContent: f.get(b) ?? null,
      };
    (e.push(E), I.guidReferences.length > 0 && l.push({ sourceEntity: E, references: I.guidReferences }));
  }
  return { nextEntityId: t, nextEdgeId: n };
}
function bP(e, t, n, i, r, s) {
  let o = new Map(s.assets.map((c) => [c.guid, c])),
    a = new Map(s.existingEntities.concat(e).map((c) => [`${c.assetId}:${c.localKey}`, c])),
    l = new Set();
  for (let c of r)
    for (let d of c.references) {
      let f = o.get(d.guid);
      if (!f || f.id === c.sourceEntity.assetId) continue;
      let m = EP(e, a, n, f, d);
      n = m.nextEntityId;
      let y = _P(c.sourceEntity.entityKind, d.path),
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
function EP(e, t, n, i, r) {
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
    typeName: Ip(i.assetKind),
    scriptSymbolId: null,
    parentEntityId: null,
    sourceEntityId: null,
    lineStart: 1,
    lineEnd: 1,
  };
  return (e.push(l), t.set(`${i.id}:${l.localKey}`, l), { entity: l, nextEntityId: n });
}
function _P(e, t) {
  return e === "visual_effect_graph_properties" ||
    e === "visual_effect_graph_context" ||
    e === "visual_effect_graph_block"
    ? "vfx_graph_guid_reference"
    : SP(t);
}
function SP(e) {
  let t = e.toLowerCase();
  return t.includes("custom") || t.includes("function") || t.includes("source")
    ? "shader_graph_custom_function"
    : "shader_graph_guid_reference";
}
function Ip(e) {
  return e
    .split(/[_-]+/g)
    .filter(Boolean)
    .map((t) => `${t[0]?.toUpperCase() ?? ""}${t.slice(1)}`)
    .join("");
}
function RP(e) {
  return /^\s*%YAML\b/m.test(e) || /^\s*---\s*!u!/m.test(e);
}
function vl(e, t, n, i, r) {
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
function wP(e) {
  return ["2D", "3D", "Cube", "2DArray", "CubeArray"].includes(e);
}
function vP(e) {
  return e instanceof Error ? e.message : String(e);
}
var bp = Rc(Xa(), 1);
import PP from "node:path";
var xP = { intAsBigInt: !0, uniqueKeys: !1 };
function Ep(e) {
  let t = [],
    n = e.nextEntityId,
    i = new Map(e.scopedFiles.map((r) => [r.projectRelPath, r]));
  for (let r of e.assets) {
    if (r.assetKind !== "texture") continue;
    let s = i.get(`${r.vfsRootPath}.meta`)?.id ?? -1,
      o = Ye(e.fileAbsPathById, s) ?? "",
      a = TP(o);
    for (let l of AP(a, e.metaFileIdToNameByFileId.get(r.fileId)))
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
function TP(e) {
  if (!e.trim()) return [];
  try {
    let t = bp.default.parseDocument(e, xP);
    if (t.errors.length > 0) return [];
    let n = t.toJS(),
      i = vi(n)?.TextureImporter,
      r = vi(i)?.spriteSheet;
    return NP(r);
  } catch {
    return [];
  }
}
function NP(e) {
  let t = vi(e);
  if (!t) return [];
  let n = kP(t.sprites),
    i = new Set(n.map((r) => r.name));
  for (let r of OP(t.nameFileIdTable)) i.has(r.name) || (i.add(r.name), n.push(r));
  return n;
}
function kP(e) {
  return Array.isArray(e)
    ? e.flatMap((t) => {
        let n = vi(t),
          i = _p(n?.name),
          r = Sp(n?.internalID);
        return i && r ? [{ name: i, localKey: r }] : [];
      })
    : [];
}
function OP(e) {
  let t = vi(e);
  return t
    ? Object.entries(t).flatMap(([n, i]) => {
        let r = Sp(i);
        return r ? [{ name: n, localKey: r }] : [];
      })
    : [];
}
function AP(e, t) {
  if (!t) return e;
  let n = new Set(e.map((r) => r.localKey)),
    i = [...e];
  for (let [r, s] of t) n.has(r) || !s.trim() || (n.add(r), i.push({ name: PP.posix.basename(s.trim()), localKey: r }));
  return i;
}
function vi(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : null;
}
function _p(e) {
  return typeof e == "string" && e.trim() ? e.trim() : null;
}
function Sp(e) {
  return typeof e == "bigint" || typeof e == "number" ? String(e) : _p(e);
}
function Rp(e) {
  let t = [],
    n = e.nextEntityId;
  for (let i of e.assets) {
    if (!(i.assetKind === "uxml" || i.assetKind === "uss")) continue;
    let s = Ye(e.fileAbsPathById, i.fileId);
    s && (i.assetKind === "uxml" && (n = UP(t, n, i.id, s)), i.assetKind === "uss" && (n = LP(t, n, i.id, s)));
  }
  return { entities: t, edges: [], nextEntityId: n, nextEdgeId: e.nextEdgeId };
}
function UP(e, t, n, i) {
  let r = /<\s*Template\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  for (let o of i.matchAll(r)) e.push(Pi(t++, n, "uxml_reference", o[1], "UXMLTemplateReference"));
  let s = /<\s*Style\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  for (let o of i.matchAll(s)) e.push(Pi(t++, n, "uxml_reference", o[1], "UXMLStylesheetReference"));
  return t;
}
function LP(e, t, n, i) {
  let r = /@import\s+(?:url\()?["']?([^"');]+)["']?\)?\s*;/gi;
  for (let a of i.matchAll(r)) e.push(Pi(t++, n, "uss_reference", a[1], "USSImportReference"));
  let s = /\burl\(\s*["']?([^"')]+)["']?\s*\)/gi;
  for (let a of i.matchAll(s)) e.push(Pi(t++, n, "uss_reference", a[1], "USSUrlReference"));
  let o = /\bresource\(\s*["']([^"']+)["']\s*\)/gi;
  for (let a of i.matchAll(o)) e.push(Pi(t++, n, "uss_reference", a[1], "USSResourceReference"));
  return t;
}
function Pi(e, t, n, i, r) {
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
function vp(e) {
  return MP(e.payload).flatMap((t) => {
    let n = FP(t.item),
      i = ms(t.item.m_MethodName);
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
            callState: Pl(t.item.m_CallState),
            argumentMode: Pl(t.item.m_Mode),
            objectArgumentTypeName: xp(t.item),
          },
        ]
      : [];
  });
}
function Pp(e) {
  let t = KP(
      e.symbols.filter((r) => r.symbolKind === "method"),
      (r) => r.containingSymbolId,
    ),
    n = [],
    i = e.nextEntitySymbolEdgeId;
  for (let r of e.intents) {
    let s =
      e.entityIndexes.entitySummaryByYamlObjectId.get(r.sourceYamlObjectId) ??
      wp(e.entityIndexes, r.sourceFileId, r.sourceLocalKey);
    if (!s || !r.targetLocalId || r.targetLocalId === "0" || r.targetGuid || r.callState === 0) continue;
    let o = wp(e.entityIndexes, r.sourceFileId, r.targetLocalId);
    if (!o || o.entityKind !== "component" || o.scriptSymbolId === null) continue;
    let a = (t.get(o.scriptSymbolId) ?? []).filter((c) => c.simpleName === r.methodName),
      l = CP(a, {
        m_Mode: r.argumentMode,
        m_Arguments: { m_ObjectArgumentAssemblyTypeName: r.objectArgumentTypeName },
      });
    if (l.status === "resolved") {
      let c = uy(s.entityId, l.symbol.id, "calls", "unity_event", r.fieldPath);
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
    GP({
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
function MP(e) {
  let t = [];
  return (
    xl(e, [], (n, i) => {
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
function FP(e) {
  let t = e.m_Target;
  if (!t || typeof t != "object" || Array.isArray(t)) return { fileID: null, guid: null };
  let n = t;
  return { fileID: ms(n.fileID), guid: ms(n.guid) };
}
function CP(e, t) {
  if (e.length === 0) return { status: "missing" };
  if (e.length === 1) return { status: "resolved", symbol: e[0] };
  let n = Pl(t.m_Mode),
    i = DP(e, n, t);
  return i.length === 1 ? { status: "resolved", symbol: i[0] } : { status: i.length === 0 ? "missing" : "ambiguous" };
}
function DP(e, t, n) {
  switch (t) {
    case 1:
      return e.filter((i) => fs(i).length === 0);
    case 2:
      return jP(e, n);
    case 3:
      return e.filter((i) => us(i, ["int", "int32"]));
    case 4:
      return e.filter((i) => us(i, ["float", "single"]));
    case 5:
      return e.filter((i) => us(i, ["string"]));
    case 6:
      return e.filter((i) => us(i, ["bool", "boolean"]));
    default:
      return e;
  }
}
function jP(e, t) {
  let n = xp(t),
    i = e.filter((r) => fs(r).length === 1);
  return n ? i.filter((r) => fs(r)[0] === n) : i;
}
function xp(e) {
  let t = e.m_Arguments;
  if (!t || typeof t != "object" || Array.isArray(t)) return null;
  let n = ms(t.m_ObjectArgumentAssemblyTypeName);
  return n ? Tp(n.split(",")[0] ?? n) : null;
}
function us(e, t) {
  let n = fs(e);
  return n.length === 1 && t.includes(n[0] ?? "");
}
function fs(e) {
  return BP(e.signature).parameterTypes;
}
function BP(e) {
  if (!e) return { parameterTypes: [] };
  let t = e.match(/\((.*)\)/)?.[1]?.trim() ?? "";
  return t
    ? {
        parameterTypes: t
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean)
          .map((n) => n.split(/\s+/)[0] ?? "")
          .map((n) => Tp(n)),
      }
    : { parameterTypes: [] };
}
function Tp(e) {
  let n = e.replace(/\[\]$/g, "").replace(/<.*>$/g, "");
  return (n.split(".").pop() ?? n).toLowerCase();
}
function GP(e) {
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
function wp(e, t, n) {
  let i = e.entityIdByFileIdAndLocalKey.get(oe(t, n));
  return i === void 0 ? null : (e.entitySummaryById.get(i) ?? null);
}
function ms(e) {
  return typeof e == "string" ? e.trim() || null : typeof e == "number" ? String(e) : null;
}
function Pl(e) {
  if (typeof e == "number") return e;
  if (typeof e == "string" && e.trim()) {
    let t = Number.parseInt(e, 10);
    return Number.isFinite(t) ? t : null;
  }
  return null;
}
function xl(e, t, n) {
  if ((n(e, t), !(!e || typeof e != "object"))) {
    if (Array.isArray(e)) {
      e.forEach((i, r) => xl(i, [...t, String(r)], n));
      return;
    }
    Object.entries(e).forEach(([i, r]) => xl(r, [...t, i], n));
  }
}
function KP(e, t) {
  let n = new Map();
  for (let i of e) {
    let r = t(i),
      s = n.get(r) ?? [];
    (s.push(i), n.set(r, s));
  }
  return n;
}
function xi(e) {
  return {
    *iterateFileBatches(t) {
      YP(t);
      let n = $P(e, t.fileIds),
        i = WP(n),
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
      return VP(e, t.yamlObjectIds);
    },
    loadReferencesForBatch(t) {
      return qP(e, t.yamlObjectIds);
    },
  };
}
function YP(e) {
  if (!Number.isFinite(e.maxFilesPerBatch) || e.maxFilesPerBatch <= 0)
    throw new Error("maxFilesPerBatch must be positive.");
  if (!Number.isFinite(e.maxObjectsPerBatch) || e.maxObjectsPerBatch <= 0)
    throw new Error("maxObjectsPerBatch must be positive.");
}
function $P(e, t) {
  let n = `SELECT id, file_id
       FROM yaml_objects`,
    i = t === void 0 ? void 0 : st(t);
  return (
    i !== void 0
      ? Z(
          e,
          `${n}
           WHERE file_id IN (`,
          i,
          ") ORDER BY file_id, id",
        )
      : e.prepare(`${n} ORDER BY file_id, id`).all()
  ).sort(Np);
}
function WP(e) {
  let t = new Map();
  for (let n of e) {
    let i = t.get(n.file_id) ?? [];
    (i.push(n.id), t.set(n.file_id, i));
  }
  return t;
}
function VP(e, t) {
  return Z(
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
    .sort(Np)
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
function qP(e, t) {
  return Z(
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
function Np(e, t) {
  return e.file_id - t.file_id || e.id - t.id;
}
function Up(e) {
  let t = ux(e.batchOptions),
    n = e.batchSource ?? xi(e.database),
    i = sx(Dy(e.files), e.startAssetId ?? 1);
  ry(e.database, i);
  let r = HP({ input: e, assets: i }),
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
        kp(r, a.rows.length);
        let c = { database: e.database, state: r, input: e, batch: a };
        (l === "rebuild_entities"
          ? XP(c)
          : (Fp(c), Mp(c), r.intentStore.addMany(ul({ yamlObjects: a.rows, payloadReader: a.payloadReader })), ps(r)),
          ZP({ state: r, batch: a }));
      });
    },
    finalize() {
      return (
        o(() => {
          QP({ database: e.database, state: r, input: e });
          for (let a of n.iterateFileBatches({ ...t, fileIds: e.sourceFileIds })) {
            let l = zP(n, a);
            (kp(r, l.rows.length), JP({ database: e.database, state: r, input: e, batch: l }));
          }
        }),
        e.stopwatch?.recordDuration("emit_asset_entities", Math.ceil(s)),
        Tl(e.stopwatch, "collect_pending_edge_intents", () => {}),
        ex({ database: e.database, state: r, input: e }),
        nx(e.database, r),
        e.onBeforeWriteRows?.(r.summary),
        r.summary
      );
    },
  };
}
function zP(e, t) {
  return { rows: e.loadRowsForBatch(t), yamlReferencesByObjectId: new Map(), yamlMetadataById: new Map() };
}
function Lp(e) {
  return {
    rows: e.rows,
    yamlReferencesByObjectId: mx(e.references),
    payloadReader: yl(e.payloadByYamlObjectId),
    yamlMetadataById: Cm(e.rows, e.yamlMetadataById, fx(e.references), e.payloadByYamlObjectId),
  };
}
function HP(e) {
  let n = [...(e.input.preservedAssets ?? []), ...e.assets],
    i = new Map(n.map((s) => [s.id, s])),
    r = ol();
  for (let s of e.input.preservedEntitySummaries ?? []) r.addEntity(s);
  return {
    assets: e.assets,
    indexedAssets: n,
    assetById: i,
    assetIndexes: sl(n, ox(e.input.fileAbsPathById, e.input.preservedFileAbsPathById)),
    entityIndexes: r,
    intentStore: cy(),
    edgeState: dy(),
    scopedMonoScriptSymbols: Qm(e.input.files, e.input.scriptSymbolByFileGuid),
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
function XP(e) {
  let t = new Set(e.batch.rows.map((r) => r.fileId)),
    n = e.state.assets.filter((r) => t.has(r.fileId)),
    i = [py, Gy, Yy, jy, Ey, _y, wy, $y];
  for (let r of i) {
    let s = Cp({ ...e, extractor: r, assets: n });
    ys({ database: e.database, state: e.state, input: e.input, result: s });
  }
  (Fp(e), Mp(e));
}
function Mp(e) {
  (e.state.intentStore.addMany(
    ax({
      assets: e.state.assets,
      preservedAssets: e.input.preservedAssets ?? [],
      yamlObjects: e.batch.rows,
      yamlMetadataById: e.batch.yamlMetadataById,
      preservedEntitySummaries: e.input.preservedEntitySummaries ?? [],
      edgeSourceFileIds: e.input.edgeSourceFileIds,
      payloadReader: e.batch.payloadReader,
    }),
  ),
    ps(e.state));
}
function JP(e) {
  let t = Ky({
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
  ys({ database: e.database, state: e.state, input: e.input, result: t });
}
function QP(e) {
  let t = [
    { extractor: pp, assets: e.state.assets.filter((n) => n.assetKind !== "visual_effect_graph") },
    {
      extractor: Rp,
      assets: e.state.assets.filter(
        (n) => n.assetKind === "uxml" || n.assetKind === "uss" || n.assetKind === "json_file",
      ),
    },
    { extractor: Ep, assets: e.state.assets.filter((n) => n.assetKind === "texture") },
    { extractor: Fy, assets: e.state.assets },
  ];
  for (let { extractor: n, assets: i } of t) {
    if (i.length === 0) continue;
    let r = Cp({
      state: e.state,
      input: e.input,
      batch: {
        rows: [],
        yamlMetadataById: new Map(),
        yamlReferencesByObjectId: new Map(),
        payloadReader: yl(new Map()),
      },
      extractor: n,
      assets: i,
    });
    ys({ database: e.database, state: e.state, input: e.input, result: r });
  }
  for (let n of e.state.assets) {
    if (n.assetKind !== "visual_effect_graph" || e.state.processedVisualEffectGraphFileIds.has(n.fileId)) continue;
    Ye(e.state.assetIndexes.fileAbsPathById, n.fileId) !== null &&
      e.input.diagnostics.push({
        severity: "warning",
        category: "extract",
        stage: "resolve",
        filePath: n.vfsRootPath,
        message: "Visual Effect Graph structured indexing supports YAML .vfx files only; skipping structured entities.",
      });
  }
}
function Fp(e) {
  let t = new Set(e.batch.rows.map((o) => o.fileId)),
    n = new Set(e.state.assets.filter((o) => o.assetKind === "visual_effect_graph").map((o) => o.fileId)),
    i = new Set(e.input.edgeSourceFileIds ?? []),
    r = e.state.indexedAssets.filter(
      (o) => o.assetKind === "visual_effect_graph" && t.has(o.fileId) && (n.has(o.fileId) || i.has(o.fileId)),
    );
  if (r.length === 0) return;
  r.forEach((o) => e.state.processedVisualEffectGraphFileIds.add(o.fileId));
  let s = gp(
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
  ys({ database: e.database, state: e.state, input: e.input, result: s });
}
function Cp(e) {
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
function ys(e) {
  (jp(e.state, { entities: e.result.entities.length, entityEdges: e.result.edges.length }),
    rl(e.database, [...e.result.entities]),
    (e.state.summary.entityCount += e.result.entities.length));
  for (let t of e.result.entities)
    (e.state.entityIndexes.addEntity(Bp(e.state.assetById, t)),
      (t.entityKind === "gameobject" || t.entityKind === "prefab_instance") &&
        e.state.streamedHierarchyEntityById.set(t.id, t));
  (Jt({ database: e.database, state: e.state, input: e.input, edges: e.result.edges }),
    Dp({ database: e.database, state: e.state, input: e.input, edges: e.result.entitySymbolEdges ?? [] }),
    "pendingEdgeIntents" in e.result && (e.state.intentStore.addMany(e.result.pendingEdgeIntents), ps(e.state)),
    (e.state.nextEntityId = e.result.nextEntityId),
    (e.state.nextEdgeId = e.result.nextEdgeId),
    (e.state.nextEntitySymbolEdgeId = e.result.nextEntitySymbolEdgeId ?? e.state.nextEntitySymbolEdgeId));
}
function ZP(e) {
  for (let t of e.batch.rows)
    (e.state.intentStore.addMany(
      Oy({ yamlObject: t, yamlReferences: e.batch.yamlReferencesByObjectId.get(t.id) ?? [] }),
    ),
      e.state.intentStore.addMany(vp({ yamlObject: t, payload: e.batch.payloadReader.read(t) })));
  ps(e.state);
}
function ex(e) {
  let t = Tl(e.input.stopwatch, "sort_pending_edge_intents", () => e.state.intentStore.toSortedArray());
  e.state.summary.pendingEdgeIntentCount = t.length;
  let n = yx(t, e.state.assetIndexes);
  Tl(e.input.stopwatch, "resolve_pending_edge_intents", () => {
    for (let i of gx(t, 2e4)) {
      let r = gy({
        intents: Lt(i, "prefab_link"),
        entityIndexes: e.state.entityIndexes,
        assetIndexes: e.state.assetIndexes,
        edgeState: e.state.edgeState,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = r.nextEdgeId),
        Jt({ database: e.database, state: e.state, input: e.input, edges: r.edges }),
        tx({ database: e.database, state: e.state, input: e.input, updates: r.sourceEntityUpdates }));
      let s = By({
        intents: Lt(i, "yaml_local_ref").filter((f) => !n.has(px(f))),
        entityIndexes: e.state.entityIndexes,
        edgeState: e.state.edgeState,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = s.nextEdgeId),
        Jt({ database: e.database, state: e.state, input: e.input, edges: s.edges }));
      let o = Sy({
        intents: Lt(i, "animator_ref"),
        entityIndexes: e.state.entityIndexes,
        assetIndexes: e.state.assetIndexes,
        edgeState: e.state.edgeState,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = o.nextEdgeId),
        Jt({ database: e.database, state: e.state, input: e.input, edges: o.edges }));
      let a = Ay({
        intents: Lt(i, "asset_ref"),
        entityIndexes: e.state.entityIndexes,
        assetIndexes: e.state.assetIndexes,
        edgeState: e.state.edgeState,
        diagnostics: e.input.diagnostics,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = a.nextEdgeId),
        Jt({ database: e.database, state: e.state, input: e.input, edges: a.edges }));
      let l = vy({
        intents: Lt(i, "audio_mixer_group_ref"),
        entityIndexes: e.state.entityIndexes,
        assetIndexes: e.state.assetIndexes,
        edgeState: e.state.edgeState,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = l.nextEdgeId),
        Jt({ database: e.database, state: e.state, input: e.input, edges: l.edges }));
      let c = hp({
        intents: Lt(i, "shader_graph_guid_ref"),
        assets: e.state.indexedAssets,
        assetIndexes: e.state.assetIndexes,
        entityIndexes: e.state.entityIndexes,
        edgeState: e.state.edgeState,
        nextEntityId: e.state.nextEntityId,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEntityId = c.nextEntityId),
        (e.state.nextEdgeId = c.nextEdgeId),
        rl(e.database, c.entities),
        (e.state.summary.entityCount += c.entities.length));
      for (let f of c.entities) e.state.entityIndexes.addEntity(Bp(e.state.assetById, f));
      Jt({ database: e.database, state: e.state, input: e.input, edges: c.edges });
      let d = Pp({
        intents: Lt(i, "unity_event"),
        entityIndexes: e.state.entityIndexes,
        symbols: e.input.symbols,
        edgeState: e.state.edgeState,
        diagnostics: e.input.diagnostics,
        nextEntitySymbolEdgeId: e.state.nextEntitySymbolEdgeId,
        sourcePathByFileId: new Map(e.state.indexedAssets.map((f) => [f.fileId, f.vfsRootPath])),
      });
      ((e.state.nextEntitySymbolEdgeId = d.nextEntitySymbolEdgeId),
        Dp({ database: e.database, state: e.state, input: e.input, edges: d.entitySymbolEdges }));
    }
  });
}
function Jt(e) {
  jp(e.state, { entities: 0, entityEdges: e.edges.length });
  let t = lx(
    [...e.edges],
    e.state.entityIndexes.entitySummaryById,
    e.input.edgeSourceFileIds,
    e.input.completeEdgeSourceFileIds,
    e.input.edgeTargetFileIds,
  );
  (sy(e.database, t), (e.state.summary.entityEdgeCount += t.length));
}
function Dp(e) {
  let t = cx(
    [...e.edges],
    e.state.entityIndexes.entitySummaryById,
    e.input.symbols,
    e.input.edgeSourceFileIds,
    e.input.completeEdgeSourceFileIds,
    e.input.entitySymbolEdgeTargetFileIds,
  );
  (oy(e.database, t), (e.state.summary.entitySymbolEdgeCount += t.length));
}
function tx(e) {
  let t = dx(
    e.updates,
    e.state.entityIndexes.entitySummaryById,
    e.input.edgeSourceFileIds,
    e.input.completeEdgeSourceFileIds,
    e.input.edgeTargetFileIds,
  );
  ay(e.database, t);
  for (let n of t) {
    let i = e.state.streamedHierarchyEntityById.get(n.entityId);
    i && (i.sourceEntityId = n.sourceEntityId);
  }
}
function nx(e, t) {
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
    if (!r.some((a) => ix(a, t))) continue;
    r.sort((a, l) => (a.hierarchyOrder ?? a.id) - (l.hierarchyOrder ?? l.id) || a.id - l.id);
    let s = r.map((a) => rx(a, t)),
      o = new Map();
    for (let a of s) o.set(a, (o.get(a) ?? 0) + 1);
    r.forEach((a, l) => {
      let c = s[l],
        d = (o.get(c) ?? 0) > 1 ? `${c}#${l}` : c;
      ((a.hierarchyName = d), i.push({ entityId: a.id, hierarchyName: d }));
    });
  }
  ly(e, i);
}
function ix(e, t) {
  if (e.entityKind !== "prefab_instance" || !e.sourceEntityId) return !1;
  let n = t.assetById.get(e.assetId),
    i = (e.name ?? e.typeName).trim() || e.typeName;
  return !!(n && i === Ap.posix.basename(n.vfsRootPath));
}
function rx(e, t) {
  let n = (e.name ?? e.typeName).trim() || e.typeName;
  if (e.entityKind !== "prefab_instance" || !e.sourceEntityId) return n;
  let i = t.assetById.get(e.assetId);
  if (!i || n !== Ap.posix.basename(i.vfsRootPath)) return n;
  let r = t.streamedHierarchyEntityById.get(e.sourceEntityId),
    s = t.entityIndexes.entitySummaryById.get(e.sourceEntityId);
  return r?.name ?? s?.name ?? r?.typeName ?? s?.typeName ?? n;
}
function kp(e, t) {
  e.summary.peakLoadedYamlObjectRowCount = Math.max(e.summary.peakLoadedYamlObjectRowCount, t);
}
function jp(e, t) {
  ((e.summary.peakBufferedEntityRowCount = Math.max(e.summary.peakBufferedEntityRowCount, t.entities)),
    (e.summary.peakBufferedEntityEdgeRowCount = Math.max(e.summary.peakBufferedEntityEdgeRowCount, t.entityEdges)));
}
function ps(e) {
  ((e.summary.peakPendingEdgeIntentCount = Math.max(e.summary.peakPendingEdgeIntentCount, e.intentStore.count())),
    (e.summary.peakPendingEdgeIntentBytes = Math.max(
      e.summary.peakPendingEdgeIntentBytes,
      e.intentStore.approximateSizeBytes(),
    )));
}
function sx(e, t) {
  let n = t;
  return e.map((i) => ({ ...i, id: n++ }));
}
function ox(e, t) {
  return t === void 0 || t.size === 0 ? e : new Map([...t, ...e]);
}
function Tl(e, t, n) {
  if (!e) return n();
  e.start(t);
  try {
    return n();
  } finally {
    e.stop(t);
  }
}
function ax(e) {
  if (e.preservedAssets.length === 0) return [];
  let t = new Set(e.assets.map((o) => o.fileId)),
    n = e.edgeSourceFileIds === void 0 ? void 0 : new Set(e.edgeSourceFileIds),
    i = new Map(e.preservedAssets.map((o) => [o.fileId, o])),
    r = ol();
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
      targetLocalId: Ne(e.payloadReader.read(o), ["m_SourcePrefab"]),
      edgeKind: a.assetKind === "prefab" && o.id === d ? "variant_of" : "instance_of",
      prefabSourceGuid: l,
    });
  }
  return s;
}
function lx(e, t, n, i, r) {
  if (n === void 0) return e;
  let s = new Set(n),
    o = new Set(i ?? []),
    a = r !== void 0,
    l = new Set(r ?? []);
  return e.filter((c) => {
    let d = t.get(c.fromEntityId);
    if (d === void 0 || !s.has(d.fileId)) return !1;
    if (o.has(d.fileId) || !a) return !0;
    let f = t.get(c.toEntityId);
    return f !== void 0 && l.has(f.fileId);
  });
}
function cx(e, t, n, i, r, s) {
  if (i === void 0) return e;
  let o = new Set(i),
    a = new Set(r ?? []),
    l = s !== void 0,
    c = new Set(s ?? []),
    d = new Map(n.map((f) => [f.id, f]));
  return e.filter((f) => {
    let m = t.get(f.fromEntityId);
    if (m === void 0 || !o.has(m.fileId)) return !1;
    if (a.has(m.fileId) || !l) return !0;
    let y = d.get(f.toSymbolId);
    return y !== void 0 && y.fileId !== null && c.has(y.fileId);
  });
}
function dx(e, t, n, i, r) {
  if (n === void 0) return e;
  let s = new Set(n),
    o = new Set(i ?? []),
    a = r !== void 0,
    l = new Set(r ?? []);
  return e.filter((c) => {
    let d = t.get(c.entityId);
    if (d === void 0 || !s.has(d.fileId)) return !1;
    if (o.has(d.fileId) || !a) return !0;
    let f = t.get(c.sourceEntityId ?? -1);
    return f !== void 0 && l.has(f.fileId);
  });
}
function ux(e = {}) {
  return { maxFilesPerBatch: Op(e.maxFilesPerBatch, 750), maxObjectsPerBatch: Op(e.maxObjectsPerBatch, 2e4) };
}
function Op(e, t) {
  return e === void 0 || !Number.isFinite(e) || e <= 0 ? t : Math.floor(e);
}
function fx(e) {
  let t = new Map();
  for (let n of e) {
    if (n.refKind !== "guid-file" || n.targetGuid === null) continue;
    let i = t.get(n.sourceYamlObjectId) ?? new Map();
    (i.has(n.fieldPath) || i.set(n.fieldPath, n.targetGuid), t.set(n.sourceYamlObjectId, i));
  }
  return t;
}
function mx(e) {
  let t = new Map();
  for (let n of e) {
    let i = t.get(n.sourceYamlObjectId);
    i === void 0 ? t.set(n.sourceYamlObjectId, [n]) : i.push(n);
  }
  return t;
}
function Bp(e, t) {
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
function Lt(e, t) {
  return e.filter((n) => n.referenceKind === t);
}
function yx(e, t) {
  return new Set(
    Lt(e, "asset_ref")
      .filter(
        (n) =>
          n.targetGuid === null || t.fileIdByAssetId.get(t.assetIdByGuid.get(n.targetGuid) ?? -1) === n.sourceFileId,
      )
      .map((n) => Gp(n.sourceYamlObjectId, n.sourceFileId, n.sourceLocalKey, n.targetLocalId ?? n.targetFileId)),
  );
}
function px(e) {
  return Gp(e.sourceYamlObjectId, e.sourceFileId, e.sourceLocalKey, e.targetLocalId);
}
function Gp(e, t, n, i) {
  return [e, t, n, i ?? ""].join(":");
}
function gx(e, t) {
  let n = [];
  for (let i = 0; i < e.length; i += t) n.push(e.slice(i, i + t));
  return n;
}
import { existsSync as Ex } from "node:fs";
import { fileURLToPath as Wp } from "node:url";
import { Worker as _x } from "node:worker_threads";
import { createHash as Kp } from "node:crypto";
import { readFile as Ix } from "node:fs/promises";
function Nl(e, t = bx(e)) {
  if (!e?.startsWith("%YAML")) return { kind: "skipped_binary", observedHash: t };
  try {
    let n = Km();
    return { kind: "extracted", extracted: Ym(e, n), phaseDurations: n, observedHash: t };
  } catch (n) {
    return { kind: "error", message: $p(n), observedHash: t };
  }
}
async function Yp(e) {
  try {
    let t = await Ix(e),
      n = Kp("sha256").update(t).digest("hex");
    return is(t) ? Nl(t.toString("utf8"), n) : { kind: "skipped_binary", observedHash: n };
  } catch (t) {
    return { kind: "error", message: $p(t), observedHash: null };
  }
}
function bx(e) {
  return e === null ? null : Kp("sha256").update(e).digest("hex");
}
function $p(e) {
  return e instanceof Error ? e.message : String(e);
}
var Sx = 64 * 1024 * 1024,
  Rx = 16 * 1024 * 1024,
  wx = 2;
function vx(e = process.env) {
  return {
    recycleBytes: kl(e.UNITY_INSIGHT_YAML_WORKER_RECYCLE_BYTES, Sx),
    largeFileBytes: kl(e.UNITY_INSIGHT_YAML_LARGE_FILE_BYTES, Rx),
    maxConcurrentLargeFiles: Nx(e.UNITY_INSIGHT_YAML_MAX_CONCURRENT_LARGE_FILES, wx),
  };
}
function Ol() {
  return pd();
}
function Px(e, t, n = {}) {
  return process.env.UNITY_INSIGHT_YAML_PARSE_WORKERS === "0" || t < 1 || e <= 1 || n.hasOnlyDeferredContent === !1
    ? !1
    : (n.canCreateWorker ?? qp() !== null);
}
async function Vp(e, t = {}) {
  if (e.length === 0) return [];
  let n = t.concurrency ?? Ol(),
    i = qp(),
    r = e.every((o) => o.contentText === null),
    s = t.dependencies?.createWorker !== void 0 || i !== null;
  return Px(e.length, n, { hasOnlyDeferredContent: r, canCreateWorker: s })
    ? xx(e, i ?? "", n, t)
    : Tx(e, n, t.onFileComplete, t.onFileOutcome, t.deliverOutcomesInOrder === !0, t.retainResults !== !1);
}
async function xx(e, t, n, i) {
  let r = i.reusePolicy ?? vx(),
    s = Math.min(n, e.length),
    o = s * 2,
    a = i.retainResults !== !1,
    l = a ? new Array(e.length) : void 0,
    c = new Map(),
    d = new Uint8Array(e.length),
    f = new Set(),
    m = new Map(),
    y = [],
    p = i.dependencies?.createWorker ?? ((T) => new _x(T)),
    g = {
      ...r,
      initialWorkerCount: 0,
      replacementWorkerCount: 0,
      retiredForLargeFileCount: 0,
      retiredForCumulativeBytesCount: 0,
      processedBytes: 0,
      peakConcurrentLargeFiles: 0,
    },
    I = 1,
    b = 0,
    E = 0,
    w = 0,
    x = 0,
    R = 0,
    v = 0,
    O = !1,
    N = !1,
    D = null,
    te = null,
    z = [],
    B = [],
    Y = !1,
    pe = new Promise((T, F) => {
      ((D = T), (te = F));
    }),
    q = (T) => {
      O || ((O = !0), te?.(T instanceof Error ? T : new Error(String(T))));
    },
    $e = (T) => {
      let F = y.indexOf(T);
      F >= 0 && y.splice(F, 1);
    },
    be = (T) => (T.terminationPromise || (T.terminationPromise = T.worker.terminate()), T.terminationPromise),
    we = () => x < e.length,
    le = (T) => r.largeFileBytes > 0 && e[T].sizeBytes >= r.largeFileBytes,
    ut = () => {
      if (i.deliverOutcomesInOrder !== !0) {
        if (v < r.maxConcurrentLargeFiles && w < z.length) {
          let F = z[w];
          return ((w += 1), F);
        }
        for (; E < e.length;) {
          let F = E;
          if (((E += 1), le(F) && v >= r.maxConcurrentLargeFiles)) {
            z.push(F);
            continue;
          }
          return F;
        }
        return null;
      }
      let T = Math.min(e.length, b + o);
      for (let F = b; F < T; F += 1) if (d[F] === 0 && !(le(F) && v >= r.maxConcurrentLargeFiles)) return F;
      return null;
    },
    ft = (T) => {
      if (O || N || T.state !== "idle") return !1;
      let F = ut();
      if (F === null) return !1;
      let ne = le(F);
      ((d[F] = 1),
        (T.state = "busy"),
        (T.activeTaskIndex = F),
        (T.activeTaskIsLarge = ne),
        ne && ((v += 1), (g.peakConcurrentLargeFiles = Math.max(g.peakConcurrentLargeFiles, v))));
      let Ae = e[F];
      try {
        T.worker.postMessage({ type: "extract", taskIndex: F, absolutePath: Ae.absolutePath });
      } catch (de) {
        q(de);
      }
      return !0;
    },
    We = () => {
      for (let T = 0; T < y.length && !O;) {
        let F = y[T];
        if (F.state !== "idle") {
          y.splice(T, 1);
          continue;
        }
        if (ft(F)) {
          y.splice(T, 1);
          continue;
        }
        T += 1;
      }
    },
    S = () => {
      !O && x === e.length && R === e.length && ((O = !0), D?.(l ?? []));
    },
    C = async () => {
      if (!(Y || O)) {
        Y = !0;
        try {
          for (; !O;) {
            let T = i.deliverOutcomesInOrder === !0 ? c.get(b) : B.shift();
            if (!T) break;
            i.deliverOutcomesInOrder === !0 && c.delete(b);
            let F = i.onFileOutcome?.(T);
            for (F && typeof F.then == "function" && (await F), d[T.taskIndex] = 3, R += 1; b < d.length && d[b] === 3;)
              b += 1;
            We();
          }
          S();
        } catch (T) {
          q(T);
        } finally {
          Y = !1;
        }
      }
    },
    U = (T) => {
      (i.deliverOutcomesInOrder === !0 ? c.set(T.taskIndex, T) : B.push(T), C());
    },
    j = async (T, F) => {
      T.state === "retiring" ||
        T.state === "closing" ||
        T.state === "stopped" ||
        ((T.state = F === "pool_close" ? "closing" : "retiring"),
        $e(T),
        F === "large_file"
          ? (g.retiredForLargeFileCount += 1)
          : F === "cumulative_bytes" && (g.retiredForCumulativeBytesCount += 1),
        await be(T),
        (T.state = "stopped"),
        f.delete(T),
        m.delete(T.worker),
        F !== "pool_close" && !O && !N && we() && f.size < s && (X(!0), We()));
    },
    ge = (T, F) => {
      if (O || N || F.type !== "result") return;
      if (T.state !== "busy" || T.activeTaskIndex === null || F.taskIndex !== T.activeTaskIndex) {
        q(new Error(`YAML extract worker ${T.generation} returned unexpected task ${F.taskIndex}`));
        return;
      }
      let ne = T.activeTaskIndex,
        Ae = T.activeTaskIsLarge;
      ((T.activeTaskIndex = null), (T.activeTaskIsLarge = !1), Ae && (v -= 1));
      let de = e[ne];
      ((T.processedBytes += de.sizeBytes), (g.processedBytes += de.sizeBytes), (d[ne] = 2));
      let Li = { taskIndex: ne, file: de, outcome: F.outcome };
      (a && l && (l[ne] = Li), (x += 1));
      try {
        (U(Li), i.onFileComplete?.());
      } catch (mt) {
        q(mt);
        return;
      }
      let Mi = r.largeFileBytes > 0 && de.sizeBytes >= r.largeFileBytes,
        en = r.recycleBytes > 0 && T.processedBytes >= r.recycleBytes,
        ze = Mi ? "large_file" : en ? "cumulative_bytes" : null;
      (ze ? j(T, ze).catch(q) : ((T.state = "idle"), y.push(T)), S(), x !== e.length && We());
    },
    X = (T) => {
      let F = p(t),
        ne = {
          worker: F,
          generation: I,
          state: "starting",
          processedBytes: 0,
          activeTaskIndex: null,
          activeTaskIsLarge: !1,
          terminationPromise: null,
        };
      return (
        (I += 1),
        f.add(ne),
        m.set(F, ne),
        F.on("message", (Ae) => {
          ge(ne, Ae);
        }),
        F.once("error", (Ae) => {
          !O && !N && q(Ae);
        }),
        F.once("exit", (Ae) => {
          let de = m.get(F);
          de &&
            (de.state === "retiring" ||
              de.state === "closing" ||
              de.state === "stopped" ||
              q(new Error(`YAML extract worker ${de.generation} exited unexpectedly with code ${Ae}`)));
        }),
        T ? (g.replacementWorkerCount += 1) : (g.initialWorkerCount += 1),
        (ne.state = "idle"),
        y.push(ne),
        ne
      );
    },
    ce,
    ue,
    J = !1;
  try {
    for (let T = 0; T < s; T += 1)
      try {
        X(!1);
      } catch (F) {
        q(F);
        break;
      }
    (We(), (ce = await pe));
  } catch (T) {
    ((J = !0), (ue = T));
  }
  ((N = !0), (y.length = 0));
  let Ve = [...f];
  for (let T of Ve) T.state !== "retiring" && T.state !== "stopped" && (T.state = "closing");
  let Zt = await Promise.allSettled(Ve.map(async (T) => be(T)));
  (f.clear(), m.clear());
  for (let T of Ve) T.state = "stopped";
  if ((kx(i.onPoolSummary, g), J)) throw ue;
  let qe = Zt.find((T) => T.status === "rejected");
  if (qe) throw qe.reason;
  return ce ?? [];
}
async function Tx(e, t, n, i, r = !1, s = !0) {
  let o = s ? new Array(e.length) : void 0,
    a = new Map(),
    l = new Map(),
    c = 0,
    d = 0,
    f = !1,
    m,
    y = Math.min(t, e.length),
    p = async () => {
      if (!f) {
        f = !0;
        try {
          for (; a.has(d);) {
            let b = a.get(d);
            (a.delete(d), await i?.(b), l.get(d)?.resolve(), l.delete(d), (d += 1));
          }
        } catch (b) {
          m = b;
          for (let E of l.values()) E.reject(b);
          l.clear();
        } finally {
          f = !1;
        }
      }
    },
    g = (b) => {
      if (m !== void 0) return Promise.reject(m);
      if (!r) return Promise.resolve(i?.(b));
      a.set(b.taskIndex, b);
      let E = new Promise((w, x) => {
        l.set(b.taskIndex, { resolve: w, reject: x });
      });
      return (p(), E);
    };
  async function I() {
    for (;;) {
      let b = c;
      if (((c += 1), b >= e.length)) return;
      let E = e[b],
        w = E.contentText === null ? await Yp(E.absolutePath) : Nl(E.contentText),
        x = { taskIndex: b, file: E, outcome: w };
      (s && o && (o[b] = x), n?.(), await g(x));
    }
  }
  return (await Promise.all(Array.from({ length: y }, () => I())), o ?? []);
}
function kl(e, t) {
  if (e === void 0 || !/^\d+$/.test(e)) return t;
  let n = Number(e);
  return Number.isSafeInteger(n) && n >= 0 ? n : t;
}
function Nx(e, t) {
  let n = kl(e, t);
  return n > 0 ? n : t;
}
function kx(e, t) {
  try {
    e?.({ ...t });
  } catch {}
}
function qp() {
  let e = [
    Wp(new URL("./yamlExtractWorker.js", import.meta.url)),
    Wp(new URL("../../../bundle/yamlExtractWorker.js", import.meta.url)),
  ];
  for (let t of e) if (Ex(t)) return t;
  return null;
}
async function Xp(e) {
  let t = Ox(e.workItems),
    n = new Map(t.map((c) => [c.absolutePath, c])),
    i = e.dependencies?.extractYamlFiles ?? Vp,
    r = xi(e.database),
    s = [],
    o = Et(e.database, "yaml_objects"),
    a = Et(e.database, "yaml_references"),
    l = 0;
  e.stopwatch?.start("yaml_parallel_extract");
  try {
    await i(t, {
      concurrency: Ol(),
      deliverOutcomesInOrder: !0,
      retainResults: !1,
      onFileOutcome: ({ file: c, outcome: d }) => {
        let f = n.get(c.absolutePath);
        if (!f) throw new Error(`Unexpected YAML extraction outcome: ${c.absolutePath}`);
        if (d.observedHash !== f.contentHash)
          throw new Error(
            `YAML source changed while indexing: ${f.absolutePath} (expected ${f.contentHash}, observed ${d.observedHash ?? "unavailable"}).`,
          );
        if (d.kind !== "extracted") {
          let b =
            f.rawMode === "reuse_existing_raw" &&
            d.kind === "skipped_binary" &&
            e.database.prepare("SELECT 1 FROM yaml_objects WHERE file_id = ? LIMIT 1").get(f.id) === void 0;
          if (f.rawMode === "reuse_existing_raw" && !b)
            throw new Error(
              `Failed to reuse indexed YAML source ${f.absolutePath}: ${d.kind === "error" ? d.message : "not text YAML"}.`,
            );
          let E = [],
            w = [];
          (el(f, d, e.diagnostics, o, a, E, w), Hp(e, ++l, t.length));
          return;
        }
        s.push(d.phaseDurations);
        let m, y, p, g;
        if (f.rawMode === "refresh_raw") {
          let b = [],
            E = [],
            w = el(f, d, e.diagnostics, o, a, b, E);
          ((o = w.nextObjectId),
            (a = w.nextReferenceId),
            Fd(e.database, b, E),
            (m = b.map(Ax)),
            (y = E),
            ({ payloadByYamlObjectId: p, yamlMetadataById: g } = zp(m, d.extracted.objects, f.absolutePath)));
        } else {
          let b = [
            ...r.iterateFileBatches({
              fileIds: [f.id],
              maxFilesPerBatch: 1,
              maxObjectsPerBatch: Number.MAX_SAFE_INTEGER,
            }),
          ][0] ?? { fileIds: [f.id], yamlObjectIds: [] };
          ((m = r.loadRowsForBatch(b)),
            (y = r.loadReferencesForBatch(b)),
            ({ payloadByYamlObjectId: p, yamlMetadataById: g } = zp(m, d.extracted.objects, f.absolutePath)));
        }
        let I = Lp({ rows: m, references: y, payloadByYamlObjectId: p, yamlMetadataById: g });
        try {
          f.semanticRole !== "none" && e.stream.consumeBatch(I, f.semanticRole);
        } finally {
          I.payloadReader.clear();
        }
        Hp(e, ++l, t.length);
      },
    });
  } finally {
    e.stopwatch?.stop("yaml_parallel_extract");
  }
  return (qm(e.stopwatch, s), e.stream.finalize());
}
function Ox(e) {
  let t = new Map();
  for (let n of e) {
    let i = t.get(n.absolutePath);
    if (!i) {
      t.set(n.absolutePath, { ...n });
      continue;
    }
    ((i.rawMode = Ux(i.rawMode, n.rawMode)), (i.semanticRole = Lx(i.semanticRole, n.semanticRole)));
  }
  return [...t.values()].sort((n, i) => n.id - i.id || n.projectRelPath.localeCompare(i.projectRelPath));
}
function zp(e, t, n) {
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
function Ax(e) {
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
function Ux(e, t) {
  return e === "refresh_raw" || t === "refresh_raw" ? "refresh_raw" : "reuse_existing_raw";
}
function Lx(e, t) {
  let n = { none: 0, intent_only: 1, rebuild_entities: 2 };
  return n[e] >= n[t] ? e : t;
}
function Hp(e, t, n) {
  e.onProgress?.(t, n, `Parsing and resolving Unity assets (${t}/${n})`);
}
async function Fx(e, t) {
  let { stopwatch: n } = t;
  n?.start("load_raw_rows");
  let i = Bx(e),
    r = Kx(e),
    s = Yx(e),
    o = $x(e);
  (n?.stop("load_raw_rows"), n?.start("resolve_symbols"));
  let a = await Jm({ files: i, assemblies: r, declarations: s, mentions: o }),
    l = a.symbols.length,
    c = a.bindings.length;
  (t.onProgress?.(l, l, `Resolved ${l} symbols`), n?.stop("resolve_symbols"));
  let d = Cx(i),
    f = await Dx(i);
  return (
    n?.start("write_resolved_rows"),
    _d(e),
    iy(e, a.symbols, a.edges, a.bindings),
    t.onProgress?.(l, l, `Wrote ${l} symbol rows`),
    n?.stop("write_resolved_rows"),
    {
      files: i,
      fileAbsPathById: d,
      metaFileIdToNameByFileId: f,
      scriptSymbolByFileGuid: a.scriptSymbolByFileGuid,
      symbols: a.symbols,
      symbolCount: l,
      bindingCount: c,
    }
  );
}
async function Jp(e, t = {}) {
  let { stopwatch: n } = t,
    i = await Fx(e, t);
  n?.start("build_asset_graph");
  let r = !1,
    s = Up({
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
    a = await Xp({
      database: e,
      diagnostics: t.diagnostics ?? [],
      stream: s,
      stopwatch: n,
      onProgress: t.onProgress,
      dependencies: t.yamlIndexPassDependencies,
      workItems: i.files.flatMap((c) =>
        nt(c.projectRelPath) === "unity-yaml"
          ? [
              Gx(
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
function Cx(e) {
  let t = new Map();
  for (let n of e) Mn(n.projectRelPath, n.sizeBytes) && t.set(n.id, n.absPath);
  return t;
}
async function Dx(e) {
  let t = new Map();
  return (
    await jx(e, 16, async (n) => {
      let i = `${n.absPath}.meta`,
        r = await Mx(i, "utf8").catch(() => null);
      if (!r) return;
      let s = lo(r);
      s.size > 0 && t.set(n.id, s);
    }),
    t
  );
}
async function jx(e, t, n) {
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
function Bx(e, t) {
  let n = `SELECT id, project_rel_path, abs_path, kind, guid, size_bytes,
                          content_hash
       FROM files`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : Z(
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
function Gx(e, t, n) {
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
function Kx(e) {
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
function Yx(e, t) {
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
        : Z(
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
function $x(e, t) {
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
        : Z(
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
import { readFile as KT } from "node:fs/promises";
import { readFileSync as YT } from "node:fs";
import dt from "node:path";
function Qp(e) {
  return e === "texture" ? "image" : e;
}
var Wx = {
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
  Vx = {
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
  qx = {
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
  zx = {
    "0000000000000000f000000000000000": "extra",
    "0000000000000000e000000000000000": "default",
    "0000000000000000d000000000000000": "editor",
  },
  Hx = { extra: Wx, default: Vx, editor: qx };
function Zp(e, t) {
  let n = zx[e.toLowerCase()];
  if (!n) return;
  let i = Hx[n][t] ?? t;
  return `unity://builtin/${n}/${i}`;
}
var Xx = "[0-9A-Za-z+/_=-]+",
  Ce = "[+-]?0(?:\\.0+)?",
  Jx = new RegExp(`^${Ce}$`),
  Qx = new RegExp(`^\\{\\s*x:\\s*${Ce}\\s*,\\s*y:\\s*${Ce}\\s*,\\s*z:\\s*${Ce}\\s*\\}$`),
  Zx = new RegExp(`^\\{\\s*x:\\s*${Ce}\\s*,\\s*y:\\s*${Ce}\\s*\\}$`),
  eT = new RegExp(`^\\{\\s*r:\\s*${Ce}\\s*,\\s*g:\\s*${Ce}\\s*,\\s*b:\\s*${Ce}(?:\\s*,\\s*a:\\s*[^}]+)?\\s*\\}$`),
  tT = new RegExp(`^\\{\\s*r:\\s*${Ce}\\s*,\\s*g:\\s*${Ce}\\s*\\}$`),
  nT = new RegExp(`^\\{\\s*fileID:\\s*${Ce}\\s*\\}$`),
  iT = /^\{path:\s*""\s*\}$/,
  rT = new Set(["enabled", "m_Enabled", "m_IsActive", "minMaxState"]),
  sT = new RegExp(`\\{\\s*fileID:\\s*(-?\\d+)\\s*,\\s*guid:\\s*(${Xx})\\s*,\\s*type:\\s*\\d+\\s*\\}`, "g"),
  oT =
    /\{\s*guid:\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*fileID:\s*(-?\d+))?(?:\s*,\s*script:\s*"(?:[^"\\]|\\.)*")?(?:\s*,\s*qualifiedScript:\s*"(?:[^"\\]|\\.)*")?\s*\}/g,
  aT = /\{\s*fileID:\s*(-?\d+)\s*\}/g,
  lT = /^--- !u!\d+\s+&[^\s]+(?:\s+.*)?$/,
  cT = /^(\s*m_SceneGUID:\s*)([0-9a-fA-F]{32})\s*$/gm,
  dT = "0".repeat(32),
  uT = /^(\s*(?:-\s*)?[^:\r\n]*guid[^:\r\n]*:\s*)0{32}\s*$/gim,
  fT = /\{[^{}\r\n]*\}/g,
  mT = /(?:^|[,{]\s*)guid:\s*0{32}(?=\s*(?:,|}))/i,
  yT = /(?:^|[,{]\s*)fileID:\s*([+-]?\d+)(?=\s*(?:,|}))/i,
  pT = new Map([
    ["f5f67c52d1564df4a8936ccd202a3bd8", "Packages/com.unity.ugui/UnityEngine.UI.dll"],
    ["f70555f144d8491a825f0804e09c671c", "Packages/com.unity.ugui/Standalone/UnityEngine.UI.dll"],
    ["80a3616ca19596e4da0f10f14d241e9f", "Packages/com.unity.ugui/Editor/UnityEditor.UI.dll"],
  ]);
function eg(e) {
  return e.startsWith("0000000000000000");
}
function gT(e) {
  return pT.get(e.toLowerCase());
}
var hT = /^(\s{2})([A-Za-z0-9_]+Module):\s*$/,
  IT = new Set(["m_IndexBuffer", "m_CompressedMesh", "m_BakedConvexCollisionMesh", "m_BakedTriangleCollisionMesh"]);
function Sn(e) {
  return e ? e.replace(/\\/g, "\\\\").replace(/"/g, '\\"') : "";
}
function Ti(e) {
  return e.trim() === "";
}
function bT(e) {
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
function Rn(e) {
  let t = 0;
  for (; t < e.length && Ti(e[t]);) t += 1;
  let n = t;
  if (e[t] === "-") {
    for (t += 1; t < e.length && Ti(e[t]);) t += 1;
    e[t] === ":" && (t = n);
  }
  let i = t;
  for (; t < e.length && bT(e[t]);) t += 1;
  if (t === i || e[t] !== ":") return null;
  let r = e.slice(i, t);
  for (t += 1; t < e.length && Ti(e[t]);) t += 1;
  let s = t,
    o = e.length;
  for (; o > s && Ti(e[o - 1]);) o -= 1;
  return { key: r, value: e.slice(s, o) };
}
function tg(e, t) {
  for (let n of e.split(/\r\n|\n|\r/)) {
    let i = Rn(n);
    if (i) return i.key === t && i.value === "";
  }
  return !1;
}
function ET(e) {
  if (e === "{}") return !0;
  let t = 1;
  for (; t < e.length && Ti(e[t]);) t += 1;
  return e.startsWith("x:", t)
    ? Zx.test(e) || Qx.test(e)
    : e.startsWith("r:", t)
      ? tT.test(e) || eT.test(e)
      : e.startsWith("fileID:", t)
        ? nT.test(e)
        : e.startsWith("path:", t)
          ? iT.test(e)
          : !1;
}
function _T(e) {
  let t = Rn(e);
  if (!t || rT.has(t.key)) return !1;
  if (t.key === "serializedVersion") return t.value.length > 0;
  switch (t.value[0]) {
    case "[":
      return t.value === "[]";
    case "{":
      return ET(t.value);
    case "+":
    case "-":
    case "0":
      return Jx.test(t.value);
    default:
      return !1;
  }
}
function ST(e) {
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
    let o = wn(s),
      a = /^\s*-\s+/.test(s);
    for (; n.length > 0 && (o < n[n.length - 1].indent || (o === n[n.length - 1].indent && !a));) i();
    let l = Rn(s);
    if (o > 0 && l !== null && l.value === "") {
      n.push({ index: r, indent: o, hasContent: !1 });
      continue;
    }
    for (let d of n) d.hasContent = !0;
  }
  for (; n.length > 0;) i();
  return { lines: e.filter((r, s) => !t.has(s)), removedLineCount: t.size };
}
function RT(e) {
  return lT.test(e);
}
function wT(e) {
  if (!e || !e.trim()) return { text: "", removedLineCount: 0 };
  let t = e.split(/\r\n|\n|\r/),
    n = [],
    i = 0;
  for (let s of t) _T(s) ? (i += 1) : n.push(s);
  let r = ST(n);
  return (
    (i += r.removedLineCount),
    {
      text: r.lines.join(`
`),
      removedLineCount: i,
    }
  );
}
function vT(e) {
  if (!e || !e.trim()) return { text: "", removedLineCount: 0 };
  let t = e.split(/\r\n|\n|\r/),
    n = 0;
  return {
    text: t.filter((r) => {
      let s = RT(r);
      return (s && (n += 1), !s);
    }).join(`
`),
    removedLineCount: n,
  };
}
function wn(e) {
  return e.match(/^\s*/)?.[0].length ?? 0;
}
function PT(e) {
  if (!e.includes("Mesh:") && !e.includes("Texture2D:")) return e;
  let t = e.split(/\r\n|\n|\r/),
    n = t.findIndex((o) => Rn(o)),
    i = n < 0 ? null : Rn(t[n]);
  if (!i || i.value !== "" || (i.key !== "Mesh" && i.key !== "Texture2D")) return e;
  let r = t.slice(0, n + 1),
    s = [{ key: i.key, indent: wn(t[n]) }];
  for (let o = n + 1; o < t.length; o += 1) {
    let a = t[o] ?? "",
      l = Rn(a);
    if (!l) {
      r.push(a);
      continue;
    }
    let c = wn(a);
    for (; s.length > 0 && c <= s[s.length - 1].indent;) s.pop();
    let d = s[s.length - 1];
    if (
      (s.length === 1 &&
        ((i.key === "Mesh" && IT.has(l.key)) || (i.key === "Texture2D" && l.key === "_typelessdata"))) ||
      (i.key === "Mesh" && l.key === "_typelessdata" && d?.key === "m_VertexData" && s[s.length - 2]?.key === "Mesh")
    ) {
      for (; o + 1 < t.length && (!t[o + 1].trim() || wn(t[o + 1]) > c);) o += 1;
      continue;
    }
    (r.push(a), l.value === "" && s.push({ key: l.key, indent: c }));
  }
  return r.join(`
`);
}
function xT(e) {
  if (!tg(e, "ParticleSystem")) return { yaml: e, omittedLineCount: 0 };
  let t = e.split(/\r\n|\n|\r/),
    n = [],
    i = 0;
  for (let r = 0; r < t.length; r += 1) {
    let s = t[r] ?? "",
      o = s.match(hT);
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
      if (p.trim() && wn(p) <= a.length) break;
      c.push(p);
    }
    let f = `${a}  enabled:`,
      m = c.find((p) => p.startsWith(f));
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
function gs(e, t, n) {
  let i = `${t}${n}:`,
    r = e.find((o) => o.startsWith(i));
  if (!r) return null;
  let s = r.slice(i.length).trim();
  return s.length > 0 ? s : null;
}
function TT(e) {
  if (!tg(e, "ParticleSystem")) return { yaml: e, omittedLineCount: 0 };
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
      let b = t[d] ?? "";
      if (b.trim() && wn(b) <= a.length) break;
      c.push(b);
    }
    let f = `${a}  `;
    if (gs(c, f, "minMaxState") !== "0") {
      n.push(s);
      continue;
    }
    let y = gs(c, f, "scalar"),
      p = gs(c, f, "maxColor"),
      g = gs(c, f, "minColor"),
      I = y ?? p ?? g;
    if (I === null) {
      n.push(s);
      continue;
    }
    ((i += c.slice(1).filter((b) => b.trim()).length), n.push(`${a}${l}: ${I}`), (r = d - 1));
  }
  return {
    yaml: n.join(`
`),
    omittedLineCount: i,
  };
}
function ng(e) {
  return ig(e).text;
}
function ig(e) {
  if (!e || !e.trim()) return { text: "", rewrittenCount: 0 };
  if (!e.includes("guid:")) return { text: e, rewrittenCount: 0 };
  let t = 0;
  return {
    text: e.replace(sT, (i, r, s) => {
      t += 1;
      let o = Sn(s);
      return eg(s) ? `{guid: "${o}", fileID: ${r}}` : `{guid: "${o}"}`;
    }),
    rewrittenCount: t,
  };
}
function Al(e, t) {
  return !e || !e.trim()
    ? ""
    : e.includes("{guid:")
      ? e.replace(oT, (n, i, r) => {
          let s = NT(i),
            o = gT(s);
          if (o) return `{path: "${Sn(o)}"}`;
          if (eg(s)) {
            if (r !== void 0) {
              let l = Zp(s, r);
              if (l) return `{path: "${Sn(l)}"}`;
            }
            return '{path: "unity://builtin", status: "builtin"}';
          }
          let a = t.get(s);
          return a === void 0 ? '{path: "", status: "missing"}' : `{path: "${Sn(a)}"}`;
        })
      : e;
}
function NT(e) {
  return e.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}
function kT(e, t) {
  if (!e.includes("fileID:")) return { text: e, rewrittenCount: 0 };
  let n = 0;
  return {
    text: e.replace(aT, (r, s) => {
      let o = Number.parseInt(s, 10);
      if (Number.isNaN(o)) return r;
      if (o === 0) return ((n += 1), '{path: ""}');
      let a = t.get(s);
      return a === void 0 ? r : ((n += 1), `{path: "${Sn(a)}"}`);
    }),
    rewrittenCount: n,
  };
}
function OT(e) {
  return !e.toLowerCase().includes("guid") || !e.includes(dT)
    ? e
    : e
        .replace(uT, (n, i) => `${i}{path: ""}`)
        .replace(fT, (n) => {
          if (!mT.test(n)) return n;
          let i = yT.exec(n)?.[1];
          return i === void 0 || /^[+-]?0+$/.test(i) ? '{path: ""}' : n;
        });
}
function AT(e) {
  return e.includes("m_SceneGUID:") ? e.replace(cT, (t, n, i) => `${n}{guid: "${Sn(i)}"}`) : e;
}
function rg(e, t) {
  if (!e || !e.trim()) return { text: "", stats: UT() };
  let n = PT(e),
    i = xT(n),
    r = TT(i.yaml),
    s = OT(r.yaml),
    o = AT(s),
    a = ig(o),
    l = kT(a.text, t.localFileIdToVfsPath),
    c = vT(l.text),
    d = wT(c.text),
    f = i.omittedLineCount + r.omittedLineCount;
  return {
    text:
      f === 0
        ? d.text
        : `${d.text}
# omitted default ParticleSystem lines: ${f}`,
    stats: {
      defaultLinesRemoved: d.removedLineCount + c.removedLineCount,
      guidRefsTokenized: a.rewrittenCount,
      localFileRefsRewritten: l.rewrittenCount,
      readCompactLinesOmitted: f,
    },
  };
}
function UT() {
  return { defaultLinesRemoved: 0, guidRefsTokenized: 0, localFileRefsRewritten: 0, readCompactLinesOmitted: 0 };
}
function Ul(e) {
  let t = new Map();
  return (
    e.forEach((n) => {
      if (n.kind !== "meta" && n.guid) for (let i of qt(n.guid)) t.set(i, n.projectRelPath);
    }),
    t
  );
}
var LT = 1,
  Ll = 26,
  Ml = 5,
  bs = 256,
  MT = 512,
  hs = class {
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
        this.buffer.length >= (this.options.batchRows ?? bs) && this.flush());
    }
    flush() {
      if (this.buffer.length === 0) return;
      let t = this.buffer.splice(0);
      if (this.options.mode === "full") {
        sg(this.database, t);
        return;
      }
      let n = [],
        i = [],
        r = Z(
          this.database,
          "SELECT id FROM vfs_entries WHERE id IN (",
          t.map((o) => o.id),
          ")",
        ),
        s = new Set(r.map((o) => o.id));
      for (let o of t) (s.has(o.id) ? n : i).push(o);
      (FT(this.database, n), sg(this.database, i));
    }
    get searchCandidateCount() {
      return this.searchCandidates;
    }
    get peakBatchRows() {
      return this.peakBatch;
    }
  },
  Is = class {
    constructor(t, n = MT, i) {
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
      let n = DT(t);
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
      let n = CT(this.database, t);
      ((this.insertedCount += n), (this.duplicateCount += t.length - n));
    }
    get peakBatchRows() {
      return this.peakBatch;
    }
  };
function sg(e, t) {
  if (t.length === 0) return;
  let n = Ct(Ll),
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
    r = t.length >= n ? e.prepare(`${i}${Be(n, Ll)}`) : null;
  for (let s of Se(t, n))
    (s.length === n ? r : e.prepare(`${i}${Be(s.length, Ll)}`)).run(
      ...s.flatMap((a) => {
        let l = Ni(a.content),
          c = Ni(a.metaContent);
        return [
          a.id,
          LT,
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
function FT(e, t) {
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
    let r = Ni(i.content),
      s = Ni(i.metaContent);
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
function og(e, t) {
  if (t.length === 0) return;
  let n = e.prepare(`UPDATE vfs_entries
     SET content = ?,
         size_bytes = ?
     WHERE id = ?`);
  for (let i of t) n.run(Ni(i.content), i.sizeBytes, i.id);
}
function CT(e, t) {
  if (t.length === 0) return 0;
  let n = Ct(Ml),
    i = `INSERT OR IGNORE INTO vfs_edges (
      id,
      from_entry_id,
      to_entry_id,
      edge_kind,
      edge_subkind
    ) VALUES `,
    r = t.length >= n ? e.prepare(`${i}${Be(n, Ml)}`) : null,
    s = 0;
  for (let o of Se(t, n)) {
    let l = (o.length === n ? r : e.prepare(`${i}${Be(o.length, Ml)}`)).run(
      ...o.flatMap((c) => [c.id, c.fromEntryId, c.toEntryId, c.edgeKind, c.edgeSubkind ?? null]),
    );
    s += Number(l.changes);
  }
  return s;
}
function Ni(e) {
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
function DT(e) {
  return `${e.fromEntryId}:${e.toEntryId}:${e.edgeKind}:${e.edgeSubkind ?? ""}`;
}
function jT(e) {
  return e.startsWith("0000000000000000");
}
function ag(e) {
  if (typeof e != "string") return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
function BT(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : ag(e.guid) !== null;
}
function GT(e, t) {
  let n = ag(e.guid);
  if (!n) return { path: "", status: "missing" };
  let i = t.get(n);
  return i !== void 0
    ? { path: i }
    : jT(n)
      ? { path: "unity://builtin", status: "builtin" }
      : { path: "", status: "missing" };
}
function ki(e, t) {
  if (Array.isArray(e)) return e.map((n) => ki(n, t));
  if (BT(e)) return GT(e, t);
  if (e && typeof e == "object") {
    let n = e,
      i = {};
    for (let [r, s] of Object.entries(n)) i[r] = ki(s, t);
    return i;
  }
  return e;
}
function Fl(e) {
  return e === "shader_graph_properties" || e === "shader_graph_settings" || e === "shader_graph_node";
}
function lg(e, t) {
  let n = e.trim();
  if (!n) return e;
  let i;
  try {
    i = JSON.parse(n);
  } catch {
    return e;
  }
  return JSON.stringify(ki(i, t), null, 2);
}
function Cl(e) {
  return (
    e === "visual_effect_graph_properties" ||
    e === "visual_effect_graph_property" ||
    e === "visual_effect_graph_context" ||
    e === "visual_effect_graph_block"
  );
}
function cg(e, t) {
  let n = e.trim();
  if (!n) return e;
  let i;
  try {
    i = JSON.parse(n);
  } catch {
    return e;
  }
  return JSON.stringify(ki(i, t), null, 2);
}
function dg(e) {
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
function ug(e) {
  let t = [0];
  for (let n = 0; n < e.length; n += 1)
    e[n] ===
      `
` && t.push(n + 1);
  return t;
}
function Dl(e, t, n, i) {
  let r = t[n - 1] ?? 0,
    s = i >= t.length ? e.length : t[i] - 1;
  return e.slice(r, s);
}
function fg(e, t, n, i) {
  return e - n || (t.lineStart ?? 0) - (i.lineStart ?? 0) || t.id - i.id;
}
var mg = 4096,
  yg = 2048;
function Qt(e) {
  return e.entityKind === "component" && (e.typeName === "Transform" || e.typeName === "RectTransform");
}
function $T(e) {
  let t = new Map();
  for (let n of e)
    if (Qt(n) && n.parentEntityId !== null) {
      let i = t.get(n.parentEntityId) ?? [];
      (i.push(n), t.set(n.parentEntityId, i));
    }
  for (let n of t.values()) n.sort((i, r) => i.lineStart - r.lineStart);
  return t;
}
function pg(e) {
  return [e.severity, e.category, e.stage ?? "", e.code ?? "", e.filePath ?? "", e.message].join("\0");
}
function gg(e, t) {
  return !e || t === null ? !e : e.has(t);
}
function WT(e, t) {
  if (t.length === 0) return [];
  let n = Math.floor(tr / 3),
    i = new Set();
  for (let r of Se(t, n)) {
    let s = rt(r.length);
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
  return st([...i]);
}
async function Rg(e, t = {}) {
  return Cc(e, () => VT(e, t));
}
async function VT(e, t = {}) {
  let { stopwatch: n, scopeFileIds: i } = t;
  (n?.start("load_rows"), Ys(e));
  let r = i !== void 0 ? WT(e, [...i]) : void 0,
    s = Es(e, r),
    o = HT(e, qT(e, r)),
    a = new Map(o.map((u) => [u.id, u])),
    l = i ? o.filter((u) => gg(i, u.fileId)) : o,
    c = eN(e, r),
    d = hg(e, r),
    f = new Map(d.map((u) => [u.id, u])),
    m = tN(e, r),
    y = new Map(m.map((u) => [u.id, u])),
    p = iN(e, r),
    g = rN(e, r),
    I =
      i !== void 0
        ? m.filter((u) => {
            let h = f.get(u.assetId);
            return h !== void 0 && i.has(h.fileId);
          })
        : m,
    b = lN(e, r),
    E = new Map(s.map((u) => [u.id, u])),
    w = r === void 0 ? s : Es(e),
    x = new Map(
      w
        .filter((u) => u.kind !== "meta")
        .map((u) => {
          let h = Ss(u.kind, u.projectRelPath);
          return [u.id, Qp(h)];
        }),
    ),
    R = new Map(w.map((u) => [u.id, u])),
    v = new Map(
      d.flatMap((u) => {
        let h = R.get(u.fileId);
        return h?.guid ? [[h.guid, h.id]] : [];
      }),
    );
  if (r !== void 0)
    for (let u of hg(e)) {
      let h = R.get(u.fileId);
      h?.guid && v.set(h.guid, h.id);
    }
  let O = new Map();
  for (let u of m) {
    let h = f.get(u.assetId);
    h && O.set(`${h.fileId}\0${u.localKey}`, u.id);
  }
  let N = e.prepare(`SELECT id, object_type, game_object_file_id
     FROM yaml_objects
     WHERE file_id = ? AND local_identifier = ?`),
    D = e.prepare(`SELECT target_guid,
            coalesce(target_local_id, target_file_id) AS target_local_id
     FROM yaml_references
     WHERE source_yaml_object_id = ?
       AND field_path = 'm_CorrespondingSourceObject'
     LIMIT 1`),
    te = e.prepare(`SELECT coalesce(target_local_id, target_file_id) AS target_local_id
     FROM yaml_references
     WHERE source_yaml_object_id = ?
       AND field_path = 'm_PrefabInstance'
     LIMIT 1`),
    z = e.prepare(`SELECT entities.id
     FROM entities
     JOIN assets ON assets.id = entities.asset_id
     WHERE assets.file_id = ? AND entities.local_key = ?
     LIMIT 1`),
    B = e.prepare(`SELECT vfs_path
     FROM vfs_entries
     WHERE project_id = 1
       AND source_vfs_path = ?
       AND vfs_path LIKE ? ESCAPE '\\'
       AND (? IS NULL OR instance_root_vfs_path = ?)
     ORDER BY id
     LIMIT 2`);
  function Y(u) {
    let h = u.sourceGuid,
      _ = u.sourceLocalId,
      P = new Set(),
      L = [],
      k = null;
    for (; h && _;) {
      let fe = `${h}\0${_}`;
      if (P.has(fe)) return null;
      P.add(fe);
      let Q = v.get(h);
      if (Q === void 0) return null;
      let ie = N.get(Q, _);
      if (!ie) return null;
      let re =
        ie.game_object_file_id ?? (ie.object_type === "GameObject" || ie.object_type === "PrefabInstance" ? _ : null);
      if (re) {
        let kn = O.get(`${Q}\0${re}`);
        if (kn !== void 0) {
          k = kn;
          break;
        }
        k = z.get(Q, re)?.id ?? null;
        break;
      }
      let Ie = te.get(ie.id)?.target_local_id ?? null,
        yt = Ie && Ie !== "0" ? (O.get(`${Q}\0${Ie}`) ?? z.get(Q, Ie)?.id ?? null) : null;
      L.push({ fileId: Q, sourceGuid: h, sourceLocalId: _, owningPrefabInstanceEntityId: yt });
      let pt = D.get(ie.id);
      ((h = pt?.target_guid ?? null), (_ = pt?.target_local_id ?? null));
    }
    if (k === null) return null;
    let M = Pn(k),
      he = y.get(k),
      K = he ? f.get(he.assetId)?.fileId : void 0;
    for (let fe = L.length - 1; M && fe >= 0; fe -= 1) {
      let Q = L[fe],
        ie = R.get(Q.fileId);
      if (!ie) return null;
      let re = Q.owningPrefabInstanceEntityId ? Pn(Q.owningPrefabInstanceEntityId) : null;
      if (re === null && Q.owningPrefabInstanceEntityId !== null) {
        let yt = y.get(Q.owningPrefabInstanceEntityId),
          pt = yt ? f.get(yt.assetId) : void 0;
        yt && pt && (re = ct(e, je(pt.fileId, yt.localKey))?.vfsPath ?? null);
      }
      let et = ie.projectRelPath.replace(/[\\%_]/g, "\\$&"),
        Ie = B.all(M, `${et}:/%`, re, re);
      if (Ie.length === 1) {
        M = Ie[0].vfs_path;
        continue;
      }
      if (fe === L.length - 1) {
        if (Q.fileId !== K) return null;
        continue;
      }
      return null;
    }
    return M;
  }
  let pe = new Set((t.diagnostics ?? []).map(pg)),
    q = (u) => {
      let h = pg(u);
      pe.has(h) || (pe.add(h), t.diagnostics?.push(u));
    },
    $e = new Map();
  (await cN(s, 16, async (u) => {
    if (u.kind !== "meta") return;
    let h = await KT(u.absPath, "utf8").catch(() => "");
    if (h.length > 0) {
      let _ = Dd(h);
      _ && $e.set(u.id, _);
    }
  }),
    n?.stop("load_rows"));
  let be = i ? PN(e) : vN(e);
  wN(mg, bs);
  let we = new hs(e, { mode: i ? "scoped" : "full", generation: be, batchRows: bs }),
    le = new Yl(e, mg),
    ut = new Map(),
    ft = (u) => {
      (u.entryKind === "source_prefab_link" || u.entryKind === "prefab_overrides") &&
        ut.set(u.vfsPath, u.sourceEntityId);
    },
    We = e.prepare(`SELECT source_entity_id
     FROM vfs_entries
     WHERE project_id = 1 AND vfs_path = ?`),
    S = new Is(e, void 0, () => {
      we.flush();
    }),
    C = new Map(),
    U = new Map(),
    j = new Map(),
    ge = t.startEntryId ?? 1,
    X = t.startEdgeId ?? 1;
  function ce(u) {
    return zi(u.projectRelPath, u.sizeBytes);
  }
  function ue(u) {
    let h = u.sizeBytes ?? Buffer.byteLength(u.metaContent ?? "", "utf8"),
      _ = u.hostFileId ?? u.sourceFileId,
      P = u.sourceFileId === null ? null : (x.get(u.sourceFileId) ?? null);
    if (i) {
      let M =
        u.vfsLogicalKey ??
        jl({
          id: 0,
          sizeBytes: h,
          fileFamily: P,
          ...u,
          hostFileId: _,
          content: null,
          projectionKind: u.projectionKind ?? null,
          sourceVfsPath: u.sourceVfsPath ?? null,
          sourceOwnerVfsPath: u.sourceOwnerVfsPath ?? null,
          instanceRootVfsPath: u.instanceRootVfsPath ?? null,
          vfsLogicalKey: u.vfsLogicalKey ?? null,
          sourceLogicalKey: u.sourceLogicalKey ?? null,
        });
      if (M?.startsWith("entity_file_local:")) {
        let he = ct(e, M);
        if (he) {
          let K = {
            id: he.id,
            sizeBytes: h,
            fileFamily: P,
            ...u,
            hostFileId: _,
            content: null,
            projectionKind: u.projectionKind ?? null,
            sourceVfsPath: u.sourceVfsPath ?? null,
            sourceOwnerVfsPath: u.sourceOwnerVfsPath ?? null,
            instanceRootVfsPath: u.instanceRootVfsPath ?? null,
            vfsLogicalKey: M,
            sourceLogicalKey: u.sourceLogicalKey ?? null,
          };
          return (
            (K.sourceLogicalKey = K.sourceLogicalKey ?? Bl(K)),
            Gl(K),
            we.add(K),
            le.remember(K.vfsPath, K.id),
            ft(K),
            K
          );
        }
      }
    }
    let L = le.byPath(u.vfsPath);
    if (L !== void 0) {
      if (i) {
        let M = {
          id: L,
          sizeBytes: h,
          fileFamily: P,
          ...u,
          hostFileId: _,
          content: null,
          projectionKind: u.projectionKind ?? null,
          sourceVfsPath: u.sourceVfsPath ?? null,
          sourceOwnerVfsPath: u.sourceOwnerVfsPath ?? null,
          instanceRootVfsPath: u.instanceRootVfsPath ?? null,
          vfsLogicalKey: u.vfsLogicalKey ?? null,
          sourceLogicalKey: u.sourceLogicalKey ?? null,
        };
        return (
          (M.vfsLogicalKey = M.vfsLogicalKey ?? jl(M)),
          (M.sourceLogicalKey = M.sourceLogicalKey ?? Bl(M)),
          Gl(M),
          we.add(M),
          le.remember(M.vfsPath, M.id),
          ft(M),
          M
        );
      }
      return (console.warn(`Duplicate materialized VFS path: ${u.vfsPath} \u2014 skipping duplicate entry`), null);
    }
    let k = {
      id: ge++,
      sizeBytes: h,
      fileFamily: P,
      ...u,
      hostFileId: _,
      content: null,
      projectionKind: u.projectionKind ?? null,
      sourceVfsPath: u.sourceVfsPath ?? null,
      sourceOwnerVfsPath: u.sourceOwnerVfsPath ?? null,
      instanceRootVfsPath: u.instanceRootVfsPath ?? null,
      vfsLogicalKey: u.vfsLogicalKey ?? null,
      sourceLogicalKey: u.sourceLogicalKey ?? null,
    };
    return (
      (k.vfsLogicalKey = k.vfsLogicalKey ?? jl(k)),
      (k.sourceLogicalKey = k.sourceLogicalKey ?? Bl(k)),
      Gl(k),
      we.add(k),
      le.remember(k.vfsPath, k.id),
      ft(k),
      k
    );
  }
  function J(u, h, _, P = null) {
    if (!u || !h) return;
    let L = le.byPath(u),
      k = le.byPath(h);
    if (!L || !k) {
      S.recordMissingEndpoint();
      return;
    }
    S.add({ id: X++, fromEntryId: L, toEntryId: k, edgeKind: _, edgeSubkind: P });
  }
  function Ve(u) {
    if (u != null) return C.get(u);
  }
  i &&
    s.forEach((u) => {
      if (u.kind === "meta") return;
      let h = $(u.projectRelPath, "file");
      le.byPath(h) !== void 0 && j.set(u.id, h);
    });
  let Zt = new Map();
  s.forEach((u) => {
    u.metaFileId !== null && Zt.set(u.metaFileId, u);
  });
  let qe = new Map();
  (s.forEach((u) => {
    if (u.kind !== "meta") return;
    let h = Zt.get(u.id);
    h && qe.set(h.id, u);
  }),
    n?.start("materialize_directories"));
  let T = dN(s.filter((u) => u.kind !== "meta"));
  (T.forEach((u) => {
    let h = $(u, "directory"),
      _ = uN(u);
    ue({
      entryType: "directory",
      entryKind: "directory",
      vfsPath: h,
      parentVfsPath: _ ? $(_, "directory") : null,
      sourceFileId: null,
      sourceSymbolId: null,
      sourceEntityId: null,
      displayName: dt.posix.basename(u),
      content: null,
      metaContent: null,
      lineStart: null,
      lineEnd: null,
      targetVfsPath: null,
      projectionKind: null,
      sizeBytes: 0,
    });
  }),
    t.onProgress?.(T.length, T.length, `Materialized ${T.length} directories`),
    n?.stop("materialize_directories"),
    n?.start("materialize_files"));
  let F = s.filter((u) => u.kind !== "meta");
  (F.forEach((u) => {
    let h = qe.get(u.id);
    (ue({
      entryType: "file",
      entryKind: Ss(u.kind, u.projectRelPath),
      vfsPath: $(u.projectRelPath, "file"),
      parentVfsPath: $(dt.posix.dirname(u.projectRelPath), "directory"),
      sourceFileId: u.id,
      sourceSymbolId: null,
      sourceEntityId: null,
      displayName: dt.posix.basename(u.projectRelPath),
      content: null,
      metaContent: h ? ($e.get(h.id) ?? null) : null,
      lineStart: null,
      lineEnd: null,
      targetVfsPath: null,
      projectionKind: null,
      sizeBytes: u.sizeBytes,
    }),
      j.set(u.id, $(u.projectRelPath, "file")));
  }),
    t.onProgress?.(F.length, F.length, `Materialized ${F.length} files`),
    n?.stop("materialize_files"),
    n?.start("materialize_file_content_nodes"));
  let ne = 0;
  (F.forEach((u) => {
    let h = Ss(u.kind, u.projectRelPath);
    if (!Yc(u.projectRelPath, h, u.sizeBytes) || !ce(u) || u.sizeBytes === 0) return;
    let _ = $(u.projectRelPath, "file");
    (ue({
      entryType: "node",
      entryKind: "file_content",
      vfsPath: $(Hi(_), "leaf"),
      parentVfsPath: _,
      sourceFileId: u.id,
      sourceSymbolId: null,
      sourceEntityId: null,
      displayName: ".content",
      content: null,
      metaContent: null,
      lineStart: null,
      lineEnd: null,
      targetVfsPath: null,
      projectionKind: null,
      sizeBytes: u.sizeBytes,
    }),
      (ne += 1));
  }),
    t.onProgress?.(ne, ne, `Materialized ${ne} file content nodes`),
    n?.stop("materialize_file_content_nodes"),
    n?.start("materialize_symbols"));
  let Ae = new Map(),
    de = new Map();
  function Li(u, h, _, P) {
    let L = It(h, P),
      k = $(_e(u, L), _),
      M = (Ae.get(k) ?? 0) + 1;
    return (Ae.set(k, M), M === 1 ? k : $(_e(u, It(`${h}#${M}`, P)), _));
  }
  function Mi(u) {
    if (de.has(u)) return de.get(u) ?? null;
    let h = a.get(u);
    if (!h || h.isExternalStub !== 0 || !h.fileId) return (de.set(u, null), null);
    let _ = j.get(h.fileId);
    if (!_) return (de.set(u, null), null);
    let P = [],
      L = h;
    for (; L;)
      (P.unshift({ simpleName: L.simpleName, symbolKind: L.symbolKind }),
        (L = L.containingSymbolId ? a.get(L.containingSymbolId) : void 0));
    let k = null;
    for (let M = 0; M < P.length; M += 1) {
      let { simpleName: he, symbolKind: K } = P[M],
        fe = M === P.length - 1,
        Q = fN(K),
        ie = k ?? `${_}:/`;
      if (fe) {
        k = Li(ie, he, Q, K);
        continue;
      }
      let re = It(he, K);
      k = $(_e(ie, re), "container");
    }
    return (de.set(u, k), k);
  }
  let en = l.filter((u) => u.isExternalStub === 0 && u.fileId !== null);
  (en
    .sort((u, h) => fg(u.fileId, u, h.fileId, h))
    .forEach((u) => {
      let h = Mi(u.id);
      if (!h) return;
      let _ = u.containingSymbolId ? Mi(u.containingSymbolId) : j.get(u.fileId);
      (ue({
        entryType: "node",
        entryKind: u.symbolKind,
        vfsPath: h,
        parentVfsPath: _ ?? null,
        sourceFileId: u.fileId,
        sourceSymbolId: u.id,
        sourceEntityId: null,
        displayName: u.displayName,
        content: null,
        metaContent: null,
        lineStart: u.lineStart,
        lineEnd: u.lineEnd,
        targetVfsPath: null,
        projectionKind: null,
      }),
        C.set(u.id, h));
    }),
    t.onProgress?.(en.length, en.length, `Materialized ${en.length} symbols`),
    n?.stop("materialize_symbols"),
    n?.start("materialize_entities"));
  let ze = new Map(),
    mt = new Map(),
    Ns = new Map();
  for (let u of I) {
    if (u.parentEntityId === null) continue;
    let h = mt.get(u.parentEntityId) ?? [];
    (h.push(u), mt.set(u.parentEntityId, h));
  }
  mt.forEach((u) => {
    u.sort((h, _) => h.id - _.id);
  });
  function rc(u, h) {
    let _ = Number.parseInt(u, 10),
      P = Number.parseInt(h, 10);
    return Number.isFinite(_) && Number.isFinite(P) && String(_) === u && String(P) === h ? _ - P : u.localeCompare(h);
  }
  function ks(u, h) {
    return i ? rc(u.localKey, h.localKey) : u.id - h.id;
  }
  let sc = new Map(),
    Os = new Map();
  for (let u of I) {
    let h = `${u.parentEntityId}|${u.assetId}|${_s(u)}`,
      _ = Os.get(h) ?? [];
    (_.push(u), Os.set(h, _));
  }
  for (let u of Os.values())
    (u.sort((h, _) => (i ? rc(h.localKey, _.localKey) : h.id - _.id)),
      u.forEach((h, _) => {
        sc.set(h.id, _);
      }));
  function As(u) {
    return sc.get(u.id) ?? 0;
  }
  function oc(u, h) {
    let _ = _s(u),
      P = mN(u.entityKind),
      L = f.get(u.assetId),
      k = i && L ? ct(e, je(L.fileId, u.localKey))?.vfsPath : void 0;
    return Us(h, _, P, u.entityKind, As(u), k);
  }
  function ac(u) {
    let h = U.get(u.id);
    if (h) return h;
    if (Ms(u)) return null;
    let _ = f.get(u.assetId);
    if (!_) return null;
    let P = ct(e, je(_.fileId, u.localKey));
    return P ? (U.set(u.id, P.vfsPath), P.vfsPath) : null;
  }
  function Pn(u) {
    let h = y.get(u);
    if (h) return ac(h);
    let _ = e
      .prepare(
        `SELECT assets.file_id, entities.local_key
         FROM entities
         JOIN assets ON assets.id = entities.asset_id
         WHERE entities.id = ?`,
      )
      .get(u);
    if (!_) return null;
    let P = ct(e, je(_.file_id, _.local_key));
    return P ? (U.set(u, P.vfsPath), P.vfsPath) : null;
  }
  let Fi = new Map();
  function Hg(u) {
    for (let h of Fi.keys()) u.startsWith(h) && Fi.delete(h);
  }
  function Xg(u) {
    let h = Fi.get(u);
    if (h) return h;
    we.flush();
    let _ = Id(u),
      P = e
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
        .all(_.lowerBound, _.upperBound)
        .map(vg),
      L = P.find((M) => M.vfsPath === u),
      k = i && L?.materializationGeneration === be ? P.filter((M) => M.materializationGeneration === be) : P;
    return (Fi.set(u, k), k);
  }
  function Us(u, h, _, P, L = 0, k) {
    let M = L + 1,
      he = M === 1 ? h : `${h}#${M}`,
      K = It(he, P),
      fe = $(_e(u, K), _);
    if (fe === k || le.byPath(fe) === void 0) return fe;
    let Q = M;
    for (;;) {
      Q += 1;
      let ie = It(`${h}#${Q}`, P),
        re = $(_e(u, ie), _);
      if (re === k || le.byPath(re) === void 0) return re;
    }
  }
  let Jg = e.prepare(`SELECT id
     FROM vfs_entries
     WHERE project_id = 1
       AND vfs_path = ?
       AND projection_kind = 'prefab_inherited'
       AND instance_root_vfs_path = ?`),
    lc = new Set();
  function Qg(u, h, _) {
    let P = bg(h.vfsPath),
      L = It("", h.entryKind),
      k = L && P.endsWith(L) ? P.slice(0, -L.length) : P,
      M = tn(h.displayName, h.entryKind),
      he = k.match(/^(.*)#(\d+)$/),
      K = he?.[1] === M ? he : null,
      fe = K?.[1] ?? k,
      Q = K ? Number.parseInt(K[2], 10) - 1 : 0,
      ie = h.vfsPath.endsWith("/") ? "container" : "leaf",
      re = $(_e(u, P), ie),
      et = Q + 1,
      Ie = re;
    for (; lc.has(Ie) || (le.byPath(Ie) !== void 0 && (!i || Jg.get(Ie, _) === void 0));)
      ((et += 1), (Ie = $(_e(u, It(`${fe}#${et}`, h.entryKind)), ie)));
    return (lc.add(Ie), Ie);
  }
  function Ci(u) {
    if (ze.has(u)) return ze.get(u) ?? null;
    let h = U.get(u);
    if (h) return (ze.set(u, h), h);
    let _ = y.get(u);
    if (!_) return (ze.set(u, null), null);
    if (_.entityKind === "prefab_instance") return null;
    let P = f.get(_.assetId);
    if (!P) return (ze.set(u, null), null);
    let L = _.parentEntityId ? Ci(_.parentEntityId) : `${P.vfsRootPath}:/`;
    if (!L) return null;
    let k = oc(_, L);
    return (ze.set(u, k), k);
  }
  let Ls = I.filter((u) => u.entityKind !== "prefab_instance" && !Qt(u) && !g.has(u.id));
  function Ms(u) {
    let h = f.get(u.assetId);
    return gg(i, h?.fileId ?? null);
  }
  function Di(u, h) {
    if (!Ms(u) || u.entityKind === "material" || Qt(u) || U.has(u.id)) return;
    let _ = h ? oc(u, h) : Ci(u.id);
    if (!_) return;
    let P = f.get(u.assetId),
      L = P ? j.get(P.fileId) : null,
      k = h ?? (u.parentEntityId ? Ci(u.parentEntityId) : L);
    (ue({
      entryType: "node",
      entryKind: Ig(u.entityKind),
      vfsPath: _,
      parentVfsPath: k ?? null,
      sourceFileId: P?.fileId ?? null,
      sourceSymbolId: u.scriptSymbolId,
      sourceEntityId: u.id,
      displayName: Kl(u),
      childOrder: u.hierarchyOrder,
      content: null,
      metaContent: null,
      lineStart: u.lineStart,
      lineEnd: u.lineEnd,
      targetVfsPath: null,
      projectionKind: null,
      vfsLogicalKey: P ? je(P.fileId, u.localKey) : null,
    }),
      U.set(u.id, _));
  }
  function cc(u) {
    let h = y.get(u);
    !h ||
      U.has(u) ||
      !Ms(h) ||
      (h.entityKind !== "prefab_instance" && (Qt(h) || (h.parentEntityId && cc(h.parentEntityId), Di(h))));
  }
  Ls.sort(ks).forEach((u) => {
    Di(u);
  });
  for (let u of I) {
    if (!Qt(u) || u.parentEntityId === null) continue;
    let h = U.get(u.parentEntityId);
    h && U.set(u.id, h);
  }
  function Fs(u) {
    if (u.entityKind !== "prefab_instance" || U.has(u.id)) return U.get(u.id) ?? null;
    let h = f.get(u.assetId);
    if (!h) return null;
    let _ = j.get(h.fileId) ?? null;
    u.parentEntityId && cc(u.parentEntityId);
    let L = Ns.get(u.id) ?? (u.parentEntityId ? Ci(u.parentEntityId) : _),
      k = u.parentEntityId ? L : `${h.vfsRootPath}:/`;
    if (!k) return null;
    let M = Us(
      k,
      _s(u),
      "container",
      u.entityKind,
      As(u),
      i ? (ct(e, je(h.fileId, u.localKey))?.vfsPath ?? mc.get(u.id)) : void 0,
    );
    return (
      ue({
        entryType: "node",
        entryKind: Ig(u.entityKind),
        vfsPath: M,
        parentVfsPath: L,
        sourceFileId: h.fileId,
        sourceSymbolId: u.scriptSymbolId,
        sourceEntityId: u.id,
        displayName: Kl(u),
        childOrder: u.hierarchyOrder,
        content: null,
        metaContent: null,
        lineStart: u.lineStart,
        lineEnd: u.lineEnd,
        targetVfsPath: null,
        projectionKind: null,
        vfsLogicalKey: je(h.fileId, u.localKey),
      }),
      U.set(u.id, M),
      uc(u, M, h),
      fc(u),
      M
    );
  }
  function dc(u) {
    let h = Ns.get(u.id);
    if (h) return h;
    if (u.parentEntityId) {
      let P = y.get(u.parentEntityId);
      return P ? ac(P) : null;
    }
    let _ = f.get(u.assetId);
    return _ ? `${_.vfsRootPath}:/` : null;
  }
  function xn(u, h) {
    let _ = $(`${h.vfsRootPath}:/`, "container");
    return $(u, "container") === _ ? h.vfsRootPath : u;
  }
  function Zg(u, h, _, P) {
    let L = $(_e(h, ".SourcePrefab"), "link"),
      k = $(P.projectRelPath, "file");
    (ue({
      entryType: "link",
      entryKind: "source_prefab_link",
      vfsPath: L,
      parentVfsPath: xn(h, _),
      sourceFileId: _.fileId,
      sourceSymbolId: null,
      sourceEntityId: u.id,
      displayName: ".SourcePrefab",
      content: null,
      metaContent: null,
      lineStart: null,
      lineEnd: null,
      targetVfsPath: k,
      projectionKind: "source_prefab",
      instanceRootVfsPath: h,
      sizeBytes: 0,
    }),
      J(L, k, "source_prefab"),
      J(h, k, "instance_of"));
  }
  function uc(u, h, _) {
    let P = $(_e(h, ".PrefabOverrides"), "leaf");
    ue({
      entryType: "node",
      entryKind: "prefab_overrides",
      vfsPath: P,
      parentVfsPath: xn(h, _),
      sourceFileId: _.fileId,
      sourceSymbolId: null,
      sourceEntityId: u.id,
      displayName: ".PrefabOverrides",
      content: null,
      metaContent: null,
      lineStart: u.lineStart,
      lineEnd: u.lineEnd,
      targetVfsPath: null,
      projectionKind: null,
      sourceVfsPath: null,
      sourceOwnerVfsPath: h,
      instanceRootVfsPath: h,
    });
  }
  function eh(u, h) {
    return [".SourcePrefab", ".PrefabOverrides"].some((_) => {
      let P = $(_e(h, _), _ === ".SourcePrefab" ? "link" : "leaf"),
        L = ut.get(P);
      if (ut.has(P)) return L !== u.id;
      let k = We.get(P);
      return k !== void 0 && k.source_entity_id !== null && k.source_entity_id !== u.id;
    });
  }
  function fc(u, h) {
    let _ = [...(mt.get(u.id) ?? [])];
    for (let P = 0; P < _.length; P += 1) {
      let L = _[P],
        k = h?.get(L.id);
      if (Qt(L)) {
        let M = L.parentEntityId ? U.get(L.parentEntityId) : null;
        M && U.set(L.id, M);
      } else L.entityKind === "prefab_instance" ? k && Ns.set(L.id, k) : Di(L, k);
      _.push(...(mt.get(L.id) ?? []));
    }
  }
  let ji = new Map(),
    Bi = new Map(),
    Cs = I.filter((u) => u.entityKind === "prefab_instance").sort(ks),
    mc = new Map();
  if (i)
    for (let u of Cs) {
      let h = f.get(u.assetId),
        _ = h ? (ct(e, je(h.fileId, u.localKey))?.vfsPath ?? ct(e, qs(u.id))?.instanceRootVfsPath ?? void 0) : void 0;
      _ && mc.set(u.id, _);
    }
  let Tn = new Map(),
    Gi = new Set(),
    yc = new Map(),
    th = new Map(Cs.map((u) => [u.id, u])),
    pc = (u) => {
      if (Gi.has(u.id)) return;
      (Gi.add(u.id), U.delete(u.id));
      let h = f.get(u.assetId),
        _ = h ? E.get(h.fileId) : void 0,
        P = p.get(u.id),
        L = P ? v.get(P) : void 0,
        k = L ? R.get(L) : void 0;
      (k && yc.set(u.id, k),
        q({
          severity: "warning",
          category: "materialize",
          stage: "materialize",
          code: k ? "prefab_projection_source_unprojectable" : "prefab_projection_source_missing",
          filePath: _?.projectRelPath,
          message: k
            ? `Prefab instance source ${k.projectRelPath} exists but has no projectable root entity.`
            : P
              ? `Prefab instance source ${P} could not be found.`
              : `Prefab instance ${u.localKey} has no source.`,
        }));
    },
    gc = [];
  for (let u of Cs) {
    if (Tn.has(u.id)) continue;
    let h = [{ entity: u, expanded: !1 }];
    for (; h.length > 0;) {
      let _ = h.pop();
      if (_.expanded) {
        (Tn.set(_.entity.id, "visited"), gc.push(_.entity));
        continue;
      }
      if (Tn.get(_.entity.id) === "visited") continue;
      (Tn.set(_.entity.id, "visiting"), h.push({ entity: _.entity, expanded: !0 }));
      let P = _.entity.sourceEntityId ? th.get(_.entity.sourceEntityId) : void 0;
      if (!P) {
        _.entity.sourceEntityId === null && pc(_.entity);
        continue;
      }
      let L = Tn.get(P.id);
      if (L === "visiting") {
        Gi.add(_.entity.id);
        let k = f.get(_.entity.assetId),
          M = k ? E.get(k.fileId) : void 0;
        q({
          severity: "warning",
          category: "materialize",
          stage: "materialize",
          code: "prefab_projection_cycle",
          filePath: M?.projectRelPath,
          message: `Prefab projection cycle detected at ${M?.projectRelPath ?? _.entity.localKey}.`,
        });
      } else L !== "visited" && h.push({ entity: P, expanded: !1 });
    }
  }
  let Nn = gc;
  for (; Nn.length > 0;) {
    (ji.clear(),
      Bi.clear(),
      Nn.forEach((h) => {
        let _ = dc(h),
          P = h.sourceEntityId ? Pn(h.sourceEntityId) : null;
        if (!_ || (Bi.set(_, (Bi.get(_) ?? 0) + 1), !P)) return;
        let L = `${_}|${P}`;
        ji.set(L, (ji.get(L) ?? 0) + 1);
      }));
    let u = [];
    for (let h of Nn) {
      if (Gi.has(h.id)) {
        let H = Fs(h);
        if (H) {
          let gt = yc.get(h.id),
            tt = f.get(h.assetId);
          (gt && tt && Zg(h, H, tt, gt), we.flush());
        } else u.push(h);
        continue;
      }
      let _ = dc(h),
        P = h.sourceEntityId ? Pn(h.sourceEntityId) : null;
      if (!_ || !P) {
        u.push(h);
        continue;
      }
      let L = h.sourceEntityId;
      if (!L) continue;
      let k = Pn(L),
        M = f.get(h.assetId);
      if (!k || !M) {
        u.push(h);
        continue;
      }
      let he = Xg(k),
        K = he.find((H) => H.vfsPath === k);
      if (!K) {
        u.push(h);
        continue;
      }
      let fe = `${_}|${P}`,
        Q = bg(P),
        ie = K.displayName,
        re = _s(h),
        et = h.name?.trim() ?? "",
        Ie = dt.posix.basename(M.vfsRootPath),
        yt = (et && et !== Ie ? et : ie) || "PrefabInstance",
        pt = () => {
          let H = Us(_, re, "container", K.entryKind, As(h), i ? ct(e, je(M.fileId, h.localKey))?.vfsPath : void 0);
          return (
            ue({
              entryType: "node",
              entryKind: K.entryKind,
              vfsPath: H,
              parentVfsPath: xn(_, M),
              hostFileId: M.fileId,
              sourceFileId: K.sourceFileId,
              sourceSymbolId: K.sourceSymbolId,
              sourceEntityId: K.sourceEntityId,
              displayName: yt,
              childOrder: h.hierarchyOrder,
              content: null,
              metaContent: null,
              lineStart: K.lineStart,
              lineEnd: K.lineEnd,
              targetVfsPath: null,
              projectionKind: "prefab_inherited",
              sourceVfsPath: k,
              sourceOwnerVfsPath: k,
              sourceLogicalKey: K.vfsLogicalKey,
              instanceRootVfsPath: H,
              vfsLogicalKey: je(M.fileId, h.localKey),
            }),
            H
          );
        },
        kn = h.parentEntityId === null || (ji.get(fe) ?? 0) > 1 || (Bi.get(_) ?? 0) > 1 || re !== Q,
        Ee = _;
      kn && (Ee = pt());
      let Ds = $(_e(Ee, ".SourcePrefab"), "link");
      (!kn && eh(h, Ee) && ((Ee = pt()), (Ds = $(_e(Ee, ".SourcePrefab"), "link"))),
        Hg(Ee),
        U.set(h.id, Ee),
        ue({
          entryType: "link",
          entryKind: "source_prefab_link",
          vfsPath: Ds,
          parentVfsPath: xn(Ee, M),
          sourceFileId: M.fileId,
          sourceSymbolId: null,
          sourceEntityId: h.id,
          displayName: ".SourcePrefab",
          content: null,
          metaContent: null,
          lineStart: null,
          lineEnd: null,
          targetVfsPath: P,
          projectionKind: "source_prefab",
          instanceRootVfsPath: Ee,
          sizeBytes: 0,
        }),
        J(Ds, P, "source_prefab"),
        J(Ee, P, "instance_of"),
        uc(h, Ee, M));
      let js = new Map([[k, Ee]]);
      for (let H of he) {
        if (H.vfsPath === k) continue;
        let gt = H.parentVfsPath,
          tt = gt ? (js.get(gt) ?? null) : null;
        if (!tt) continue;
        let On = Qg(tt, H, Ee);
        (js.set(H.vfsPath, On),
          ue({
            entryType: "node",
            entryKind: H.entryKind,
            vfsPath: On,
            parentVfsPath: xn(tt, M),
            hostFileId: M.fileId,
            sourceFileId: H.sourceFileId,
            sourceSymbolId: H.sourceSymbolId,
            sourceEntityId: H.sourceEntityId,
            displayName: H.displayName,
            childOrder: H.childOrder,
            content: null,
            metaContent: null,
            lineStart: H.lineStart,
            lineEnd: H.lineEnd,
            targetVfsPath: null,
            projectionKind: "prefab_inherited",
            sourceVfsPath: H.vfsPath,
            sourceLogicalKey: H.vfsLogicalKey,
            sourceOwnerVfsPath: k,
            instanceRootVfsPath: Ee,
          }));
      }
      let _c = new Map();
      for (let H of mt.get(h.id) ?? []) {
        let gt = g.get(H.id),
          tt = gt ? Y(gt) : null,
          On = tt ? js.get(tt) : void 0;
        On && _c.set(H.id, On);
      }
      (fc(h, _c), we.flush());
    }
    if (u.length === Nn.length) {
      for (let h of u) (pc(h), Fs(h));
      break;
    }
    Nn = u;
  }
  I.filter((u) => u.entityKind === "prefab_instance")
    .sort((u, h) => u.id - h.id)
    .forEach((u) => {
      Fs(u);
    });
  for (let u of Ls) U.has(u.id) || ze.delete(u.id);
  (Ls.sort(ks).forEach((u) => {
    Di(u);
  }),
    t.onProgress?.(I.length, I.length, `Materialized ${I.length} entities`),
    n?.stop("materialize_entities"));
  for (let u of I) {
    if (u.entityKind !== "material") continue;
    let h = f.get(u.assetId);
    if (!h) continue;
    let _ = j.get(h.fileId);
    _ && U.set(u.id, _);
  }
  (RN({
    insertEntry: ue,
    entities: I,
    assetById: f,
    fileById: E,
    shouldDeferSourceContent: (u) => {
      let h = E.get(u);
      return h ? h.sizeBytes > 0 && ce(h) : !1;
    },
    normalizeCanonical: $,
  }),
    we.flush(),
    TN(e, {
      fileById: E,
      symbolById: a,
      entityById: y,
      transformEntitiesByGameObjectEntityId: $T(m),
      guidToProjectRelPath: Ul(r !== void 0 ? Es(e) : s),
      localFileIdToVfsPathByFileId: _g(m, U, f),
      generation: i !== void 0 ? be : void 0,
    }),
    i !== void 0 && r !== void 0 && xN(e, r, be),
    le.clear(),
    n?.start("build_edges"),
    i !== void 0 && r !== void 0 && Sd(e, r),
    NN(e, J, be, { scoped: i !== void 0 }),
    l.forEach((u) => {
      let h = C.get(u.id),
        _ = u.fileId ? j.get(u.fileId) : null;
      J(h, _, "defined_in", "symbol_file");
    }),
    I.forEach((u) => {
      let h = U.get(u.id);
      h && u.scriptSymbolId && J(h, C.get(u.scriptSymbolId), "binds_to", "component_script");
    }));
  let hc = st(
    [
      ...c
        .filter(
          (u) => u.targetSymbolId !== null && u.resolutionStatus !== "unresolved" && u.resolutionStatus !== "ambiguous",
        )
        .map((u) => u.targetSymbolId),
      ...b.map((u) => u.toSymbolId),
    ].filter((u) => !C.has(u)),
  );
  if (hc.length > 0) {
    let u = ZT(e, hc);
    for (let [h, _] of u) C.set(h, _);
  }
  c.forEach((u) => {
    if (u.resolutionStatus === "unresolved" || u.resolutionStatus === "ambiguous") return;
    let h = u.bindingKind === "invokes" ? "calls" : "refs";
    J(Ve(u.sourceSymbolId), Ve(u.targetSymbolId), h, u.bindingKind);
  });
  let Ic = (u) => {
    if (u.edgeKind === "component_of" || u.edgeKind === "child_of") {
      let h = y.get(u.fromEntityId);
      if (h && Qt(h)) return;
      J(U.get(u.fromEntityId), U.get(u.toEntityId), "child_of", u.edgeSubkind ?? u.edgeKind);
      return;
    }
    J(U.get(u.fromEntityId), oh(u.toEntityId), u.edgeKind, u.edgeSubkind);
  };
  if (r !== void 0) oN(e, r).forEach(Ic);
  else {
    let u = 0;
    for (;;) {
      let h = aN(e, u, 1024);
      if (h.length === 0) break;
      ((u = h[h.length - 1].id), h.forEach(Ic));
    }
  }
  b.forEach((u) => {
    J(U.get(u.fromEntityId), C.get(u.toSymbolId), u.edgeKind, u.edgeSubkind);
  });
  let bc = r !== void 0 ? Es(e) : s,
    nh = Ul(bc),
    ih = new Map(bc.map((u) => [u.projectRelPath, u.id])),
    rh = _g(m, U, f),
    Ec = {
      sourceEntitiesByYamlObjectId: SN(m),
      fileById: E,
      guidToProjectRelPath: nh,
      entityEntryPathById: U,
      projectRelPathToFileId: ih,
      localFileIdToVfsPathByFileId: rh,
      insertEdge: (u, h) => {
        J(u, h, "depends_on");
      },
    };
  if (r !== void 0) Eg({ ...Ec, yamlReferences: nN(e, r) });
  else {
    let u = 0;
    for (;;) {
      let h = sN(e, u, 1024);
      if (h.length === 0) break;
      ((u = h[h.length - 1].id), Eg({ ...Ec, yamlReferences: h }));
    }
  }
  (S.flush(),
    t.onProgress?.(S.emittedCount, S.emittedCount, `Materialized ${S.emittedCount} VFS edges`),
    n?.stop("build_edges"),
    n?.start("format_and_write"));
  let sh = kN(e, i !== void 0 ? be : void 0),
    Mt = { entryCount: we.emittedCount, edgeCount: S.insertedCount, searchIndexedEntryCount: sh };
  return (
    t.onProgress?.(Mt.entryCount, Mt.entryCount, `Wrote ${Mt.entryCount} VFS entries`),
    t.onProgress?.(Mt.edgeCount, Mt.edgeCount, `Wrote ${Mt.edgeCount} VFS edges`),
    n?.stop("format_and_write"),
    Mt
  );
  function oh(u) {
    let h = y.get(u);
    if (!h) return;
    let _ = f.get(h.assetId);
    return _ && wg(h) ? (j.get(_.fileId) ?? U.get(u)) : U.get(u);
  }
}
function Es(e, t) {
  let n = `SELECT id, project_rel_path, abs_path, kind, guid, meta_file_id, size_bytes
       FROM files`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : Z(
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
function qT(e, t) {
  let n = `SELECT id, file_id, symbol_kind, simple_name, display_name, qualified_name,
              signature, containing_symbol_id, line_start, line_end,
              is_external_stub, skeleton_content
       FROM symbols`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : Z(
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
function zT(e, t) {
  return t.length === 0
    ? []
    : Z(
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
function HT(e, t) {
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
    let s = zT(e, [...i]);
    i.clear();
    for (let o of s) n.set(o.id, o);
    for (let o of s) r(o.containingSymbolId);
  }
  return [...n.values()].sort((s, o) => s.id - o.id);
}
function XT(e) {
  return e === "class" || e === "interface" || e === "struct";
}
function JT(e, t) {
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
function QT(e, t) {
  if (t.length === 0) return new Map();
  let n = Z(
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
function ZT(e, t) {
  let n = st(t);
  if (n.length === 0) return new Map();
  let i = QT(e, n),
    r = new Map();
  for (let o of Se(n)) {
    let a = Z(
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
    let l = JT(a, i.get(o) ?? null);
    l && s.set(o, l);
  }
  return s;
}
function eN(e, t) {
  let n = `SELECT sb.source_symbol_id, sb.target_symbol_id, sb.binding_kind, sb.resolution_status
       FROM semantic_bindings sb`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : Z(
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
function hg(e, t) {
  let n = `SELECT id, file_id, asset_kind, name, vfs_root_path
       FROM assets`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : Z(
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
function tN(e, t) {
  let n = `SELECT e.id, e.asset_id, e.yaml_object_id, e.entity_kind, e.local_key, e.name, e.hierarchy_name, e.hierarchy_order, e.type_name,
              e.script_symbol_id, e.parent_entity_id, e.source_entity_id,
              e.line_start, e.line_end, e.generated_content
       FROM entities e`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : Z(
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
function nN(e, t) {
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
        : Z(
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
function iN(e, t) {
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
          : Z(
              e,
              `${n}
               AND a.file_id IN (`,
              t,
              ") ORDER BY e.id",
            )
        : e.prepare(`${n} ORDER BY e.id`).all();
  return new Map(i.map((r) => [r.entity_id, r.target_guid]));
}
function rN(e, t) {
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
        f = `yaml_references source_ref
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
       ${a} ${f}
         ON source_ref.source_yaml_object_id = stripped_transform.id
        AND source_ref.field_path = 'm_CorrespondingSourceObject'
       WHERE child.entity_kind = '${r}'
         AND source_ref.target_guid IS NOT NULL
         AND coalesce(source_ref.target_local_id, source_ref.target_file_id)
           IS NOT NULL`;
      return t !== void 0
        ? t.length === 0
          ? []
          : Z(
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
function sN(e, t, n) {
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
function oN(e, t) {
  let n = `SELECT ee.from_entity_id, ee.to_entity_id, ee.edge_kind, ee.edge_subkind
       FROM entity_edges ee`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : bd(
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
function aN(e, t, n) {
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
function lN(e, t) {
  let n = `SELECT ese.from_entity_id, ese.to_symbol_id, ese.edge_kind, ese.edge_subkind
       FROM entity_symbol_edges ese`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : Z(
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
async function cN(e, t, n) {
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
function dN(e) {
  let t = new Set();
  return (
    e.forEach((n) => {
      let i = dt.posix.dirname(n.projectRelPath);
      for (; i !== "." && i !== "";) (t.add(i), (i = dt.posix.dirname(i)));
    }),
    [...t].sort((n, i) => n.localeCompare(i))
  );
}
function uN(e) {
  let t = dt.posix.dirname(e);
  return t === "." || t === "" ? null : t;
}
function Ss(e, t) {
  switch (e) {
    case "csharp":
    case "asmdef":
    case "asset":
    case "scene":
    case "prefab":
    case "yaml-asset":
      return ds(t, e);
    case "package-manifest":
      return "package_manifest";
    default:
      return e.replace(/-/g, "_");
  }
}
function fN(e) {
  return ["namespace", "class", "interface", "struct", "enum"].includes(e) ? "container" : "leaf";
}
function mN(e) {
  return ["gameobject", "subasset", "texture", "sprite"].includes(e) ? "container" : "leaf";
}
function Ig(e) {
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
function Kl(e) {
  return (e.name ?? e.typeName).trim() || e.typeName;
}
function yN(e) {
  return tn(Kl(e), e.entityKind);
}
function _s(e) {
  let t = e.hierarchyName?.trim();
  if (!t) return yN(e);
  if (!$i(e.entityKind) && e.parentEntityId && t.includes("/") && !Yi(t)) {
    let n = dt.posix.basename(t) || t;
    return tn(n, e.entityKind);
  }
  return tn(t, e.entityKind);
}
function bg(e) {
  let t = e.endsWith("/") ? e.slice(0, -1) : e;
  return dt.posix.basename(t);
}
function jl(e) {
  return e.entryType === "file" && e.sourceFileId !== null
    ? Ws(e.sourceFileId)
    : e.entryKind === "file_content" && e.sourceFileId !== null
      ? Vs(e.sourceFileId)
      : e.entryType === "link" && e.sourceEntityId !== null
        ? qs(e.sourceEntityId)
        : e.sourceEntityId !== null && e.entryType === "node" && e.projectionKind !== "prefab_inherited"
          ? e.vfsLogicalKey?.startsWith("entity_file_local:")
            ? e.vfsLogicalKey
            : An(e.sourceEntityId)
          : e.sourceSymbolId !== null && e.sourceFileId !== null
            ? Wi(e.sourceFileId, e.sourceSymbolId)
            : e.entryType === "directory"
              ? Un(e.vfsPath)
              : Un(e.vfsPath);
}
function Bl(e) {
  return e.sourceVfsPath
    ? e.projectionKind === "prefab_inherited" && e.sourceEntityId !== null
      ? An(e.sourceEntityId)
      : Un(e.sourceVfsPath)
    : null;
}
function pN(e) {
  return e.sourceSymbolId !== null
    ? "symbol_containment"
    : e.sourceEntityId !== null
      ? "entity_hierarchy"
      : e.entryType === "directory" || e.entryType === "file"
        ? "directory_parent"
        : "vfs_parent";
}
function gN(e) {
  return e.kind === "scene" || e.kind === "prefab" || e.kind === "yaml-asset" || nt(e.projectRelPath) === "unity-yaml";
}
var hN = [
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
function IN(e) {
  return hN.some((t) => e === t || e.endsWith(`.${t}`));
}
function bN(e) {
  return e.startsWith("0000000000000000");
}
function EN(e) {
  let t = $(e.targetProjectRelPath, "file"),
    n = e.targetFileId?.trim() || e.targetLocalId?.trim() || null;
  if (!n) return t;
  let i = e.projectRelPathToFileId.get(e.targetProjectRelPath);
  if (!i) return t;
  let r = e.localFileIdToVfsPathByFileId.get(i)?.get(n);
  if (!r) return t;
  let s = r.endsWith("/") ? "container" : "leaf";
  return $(_e(`${e.targetProjectRelPath}:`, r), s);
}
function _N(e, t) {
  if (e.length === 0) return null;
  let n = e.filter((i) => Ri(i.entityKind));
  return n.length > 0 ? (n.find((i) => cs(i.entityKind, t)) ?? null) : (e[0] ?? null);
}
function Eg(e) {
  e.yamlReferences.forEach((t) => {
    if (t.refKind !== "guid-file" || !t.targetGuid || IN(t.fieldPath) || bN(t.targetGuid)) return;
    let n = _N(e.sourceEntitiesByYamlObjectId.get(t.sourceYamlObjectId) ?? [], t.fieldPath);
    if (!n) return;
    let i = e.entityEntryPathById.get(n.id);
    if (!i) return;
    let r = e.guidToProjectRelPath.get(t.targetGuid);
    if (!r) return;
    let s = e.fileById.get(t.fileId);
    if (!s || r === s.projectRelPath || (n.entityKind === "component" && n.scriptSymbolId && r.endsWith(".cs"))) return;
    let o = EN({
      targetProjectRelPath: r,
      targetFileId: t.targetFileId,
      targetLocalId: t.targetLocalId,
      projectRelPathToFileId: e.projectRelPathToFileId,
      localFileIdToVfsPathByFileId: e.localFileIdToVfsPathByFileId,
    });
    i !== o && e.insertEdge(i, o);
  });
}
function SN(e) {
  let t = new Map();
  for (let n of e) {
    if (n.yamlObjectId === null) continue;
    let i = t.get(n.yamlObjectId) ?? [];
    (i.push(n), t.set(n.yamlObjectId, i));
  }
  return t;
}
function _g(e, t, n) {
  let i = new Map();
  return (
    e.forEach((r) => {
      if (r.entityKind === "prefab_instance") return;
      let s = t.get(r.id),
        o = n.get(r.assetId);
      if (!s || !o || wg(r)) return;
      let a = `${o.vfsRootPath}:/`;
      if (!s.startsWith(a)) return;
      let l = s.slice(a.length),
        c = i.get(o.fileId);
      (c || ((c = new Map()), i.set(o.fileId, c)), c.set(r.localKey, l));
    }),
    i
  );
}
function wg(e) {
  return ls(e.localKey) && e.parentEntityId === null;
}
function RN(e) {
  let t = new Map();
  (e.entities.forEach((n) => {
    n.entityKind === "material" && t.set(n.assetId, n);
  }),
    e.assetById.forEach((n) => {
      let i = e.fileById.get(n.fileId);
      if (!i || !Rs(i)) return;
      let r = t.get(n.id);
      if (!r || !e.shouldDeferSourceContent(i.id)) return;
      let s = e.normalizeCanonical(i.projectRelPath, "file");
      e.insertEntry({
        entryType: "node",
        entryKind: "material",
        vfsPath: e.normalizeCanonical(Hi(s), "leaf"),
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
function Rs(e) {
  return Ss(e.kind, e.projectRelPath) === "material";
}
function Gl(e) {
  e.metaContent && (e.metaContent = ng(e.metaContent));
}
function wN(e, t) {
  if (e < t)
    throw new Error(
      `Entry identity cache capacity (${e}) must be at least the entry batch size (${t}) so unflushed paths cannot be evicted`,
    );
}
var Yl = class {
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
function ct(e, t) {
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
function vN(e) {
  return e.prepare("SELECT materialization_generation FROM projects WHERE id = 1").get().materialization_generation;
}
function PN(e) {
  return e
    .prepare(
      `UPDATE projects
       SET materialization_generation = materialization_generation + 1
       WHERE id = 1
       RETURNING materialization_generation`,
    )
    .get().materialization_generation;
}
function xN(e, t, n) {
  for (let i of Se(t)) {
    let r = rt(i.length);
    e.prepare(
      `DELETE FROM vfs_entries
         WHERE project_id = 1
           AND host_file_id IN (${r})
           AND materialization_generation < ?`,
    ).run(...i, n);
  }
}
function TN(e, t) {
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
    let c = i ? [t.generation, s, o, yg] : [s, o, yg],
      d = r.all(...c).map(vg);
    if (d.length === 0) break;
    let f = d[d.length - 1];
    ((s = f.sourceFileId), (o = f.id));
    for (let m = 0; m < d.length;) {
      let y = d[m].sourceFileId,
        p = m + 1;
      for (; p < d.length && d[p].sourceFileId === y;) p += 1;
      a !== y && ((a = y), (l = null));
      let g = t.fileById.get(y);
      if (g) {
        let I = d.slice(m, p),
          b = I.map((x) => ({ entry: x, fileId: y }));
        l === null && b.some((x) => MN(x, g, t)) && (l = LN(g.absPath));
        let E = ON(g, b, t, l),
          w = new Set(E.map((x) => x.id));
        og(e, E);
        for (let x of I) w.has(x.id) || n.run(x.id);
      }
      m = p;
    }
  }
}
function vg(e) {
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
function NN(e, t, n, i) {
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
        pN({ entryType: c.entry_type, sourceSymbolId: c.source_symbol_id, sourceEntityId: c.source_entity_id }),
      );
  }
}
function kN(e, t) {
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
function ON(e, t, n, i) {
  return t.flatMap((r) => {
    let s = FN(r.entry, e, n, i);
    if (s === "") return UN(r.entry) ? [] : [r.entry];
    if (!s) return [r.entry];
    let o = CN(r.entry, s, n.fileById, n.guidToProjectRelPath, n.localFileIdToVfsPathByFileId),
      a = DN(o);
    return [{ ...r.entry, content: a, sizeBytes: AN(r.entry, o) }];
  });
}
function AN(e, t) {
  return e.entryType === "file" || e.entryKind === "file_content" ? e.sizeBytes : Buffer.byteLength(t, "utf8");
}
function UN(e) {
  return (
    e.entryType === "node" &&
    e.displayName === ".content" &&
    (e.entryKind === "file_content" || e.entryKind === "material")
  );
}
function LN(e) {
  try {
    return Sg(YT(e, "utf8"));
  } catch {
    return Sg("");
  }
}
function Sg(e) {
  return { raw: e, normalized: dg(e), lineStarts: ug(e) };
}
function MN(e, t, n) {
  if (Pg(e.entry) || xg(e.entry, t, n, null) !== null || !zi(t.projectRelPath, t.sizeBytes)) return !1;
  let i = e.entry.sourceEntityId !== null ? n.entityById.get(e.entry.sourceEntityId) : void 0;
  return i && bl(i.entityKind)
    ? !0
    : e.entry.entryType === "file" || e.entry.entryKind === "file_content"
      ? !(e.entry.entryType === "file" && Rs(t))
      : e.entry.lineStart !== null && e.entry.lineEnd !== null;
}
function FN(e, t, n, i) {
  if (Pg(e)) return null;
  let r = xg(e, t, n, i?.normalized ?? null);
  if (r !== null) return r;
  if (i === null || !zi(t.projectRelPath, t.sizeBytes)) return null;
  if (e.entryType === "file" || e.entryKind === "file_content") return e.entryType === "file" && Rs(t) ? null : i.raw;
  if (e.lineStart !== null && e.lineEnd !== null) {
    let s = Dl(i.raw, i.lineStarts, e.lineStart, e.lineEnd),
      o = e.sourceEntityId !== null ? n.entityById.get(e.sourceEntityId) : void 0;
    if (o?.entityKind !== "gameobject") return s;
    let a = n.transformEntitiesByGameObjectEntityId.get(o.id);
    return a?.length
      ? a.reduce((l, c) => {
          let d = Dl(i.raw, i.lineStarts, c.lineStart, c.lineEnd),
            f = l.endsWith(`
`)
              ? ""
              : `
`;
          return `${l}${f}${d}`;
        }, s)
      : s;
  }
  return null;
}
function Pg(e) {
  return e.entryType === "file" || e.projectionKind === "prefab_inherited";
}
function xg(e, t, n, i) {
  if (e.sourceEntityId === null && e.sourceSymbolId !== null) {
    let s = n.symbolById.get(e.sourceSymbolId);
    if (s && XT(s.symbolKind) && s.skeletonContent?.trim()) return s.skeletonContent;
  }
  if (e.sourceEntityId === null) return null;
  let r = n.entityById.get(e.sourceEntityId);
  return r
    ? Ri(r.entityKind) || lp(r.entityKind)
      ? r.generatedContent?.trim()
        ? r.generatedContent
        : null
      : bl(r.entityKind)
        ? r.generatedContent?.trim()
          ? r.generatedContent
          : !t || !i
            ? null
            : (Qy(i, Ht(t.guid, t.projectRelPath)).get(r.localKey) ?? null)
        : (Fl(e.entryKind) || Cl(e.entryKind)) && r.generatedContent?.trim()
          ? r.generatedContent
          : null
    : null;
}
function CN(e, t, n, i, r) {
  if (Fl(e.entryKind)) return lg(t, i);
  if (Cl(e.entryKind)) return cg(t, i);
  if (!e.sourceFileId) return t;
  let s = n.get(e.sourceFileId);
  if (!s || !gN(s) || (e.entryType === "file" && e.entryKind === "material")) return t;
  let o = rg(t, { guidToProjectRelPath: i, localFileIdToVfsPath: r.get(e.sourceFileId) ?? new Map() });
  return e.entryKind === "material" && e.entryType === "node" && Rs(s) ? Al(o.text, i) : o.text;
}
function DN(e) {
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
var ws = class {
  entries = [];
  stack = [];
  globalStartMs = Date.now();
  start(t) {
    this.stack.push({ label: t, startMs: Date.now(), children: [] });
  }
  stop(t) {
    let n = Date.now() - this.peekStartMs(t),
      i = this.stack.pop(),
      r = { label: i.label, durationMs: n, children: i.children };
    this.stack.length > 0 ? this.stack[this.stack.length - 1].children.push(r) : this.entries.push(r);
  }
  recordDuration(t, n) {
    if (n <= 0) return;
    let i = this.stack[this.stack.length - 1];
    if (!i) throw new Error(`IndexBuildStopwatch.recordDuration('${t}') called with no active section`);
    let r = i.children.find((s) => s.label === t);
    if (r) {
      r.durationMs += n;
      return;
    }
    i.children.push({ label: t, durationMs: n, children: [] });
  }
  peekStartMs(t) {
    if (this.stack.length === 0) throw new Error(`IndexBuildStopwatch.stop('${t}') called with no active section`);
    let n = this.stack[this.stack.length - 1];
    if (n.label !== t) throw new Error(`IndexBuildStopwatch: expected to stop '${n.label}' but got '${t}'`);
    return n.startMs;
  }
  snapshot() {
    return { totalMs: Date.now() - this.globalStartMs, stages: this.entries };
  }
};
import Hl from "node:crypto";
import * as Ng from "node:https";
import { execFile as jN } from "node:child_process";
import { promises as vs } from "node:fs";
import Oe from "node:os";
import Oi from "node:path";
import { promisify as BN } from "node:util";
function $l() {
  let e = process.env.UNITY_INSIGHT_VERSION?.trim();
  return e || "0.0.1";
}
function Wl() {
  return "6e92ad2ce0a2918d63e1faeb5e76d6660fdf8143";
}
var Vl = new URL("https://api.gamecowork.invalid/api/metrics/events"),
  ql = 5e3,
  PF = ql + 1e3,
  GN = 1e3 * 30,
  Tg = 100,
  KN = "unity-metrics-distinct-id",
  YN = "gamecowork-unity-metrics-v1",
  $N = BN(jN),
  zl = class e {
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
        (this.events.length >= Tg && this.events.shift(),
        this.events.push({
          eventName: t,
          eventTime: new Date(),
          uuid: Hl.randomUUID(),
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
            VN() &&
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
        }, GN)),
        this.flushTimer.unref?.());
    }
    restoreEvents(t) {
      let n = [...t, ...this.events].slice(-Tg);
      ((this.events.length = 0), this.events.push(...n));
    }
    async buildPayloads(t) {
      let n = await this.getBaseFields(),
        i = $l(),
        r = Wl();
      return t.map((s) => {
        let o = {
          type: "track",
          time: qN(s.eventTime),
          distinct_id: n.distinctId,
          event_name: s.eventName,
          uuid: s.uuid,
          source: "unity_insight_cli",
          platform: Oe.platform(),
          architecture: Oe.arch(),
          version: i,
          git_commit: r,
          client_type: "unity_insight",
          status: s.status,
          duration_ms: s.durationMs,
          ip: n.ip,
          ...n.machineInfo,
          ...XN(s.error),
          ...(s.extra ?? {}),
        };
        return (ik(o), JSON.stringify(o));
      });
    }
    getBaseFields() {
      return (this.baseFieldsPromise || (this.baseFieldsPromise = WN()), this.baseFieldsPromise);
    }
    async sendRequest(t) {
      let n = {
        hostname: Vl.hostname,
        path: `${Vl.pathname}${Vl.search}`,
        method: "POST",
        timeout: ql,
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(t) },
      };
      await new Promise((i, r) => {
        let s = Ng.request(n, (o) => {
          (o.resume(),
            o.on("end", () => {
              o.statusCode && o.statusCode >= 200 && o.statusCode < 300
                ? i()
                : r(new Error(`HTTP ${o.statusCode ?? 0} ${o.statusMessage ?? ""}`));
            }));
        });
        (s.on("error", r),
          s.on("timeout", () => {
            (s.destroy(), r(new Error(`Request timeout after ${ql}ms`)));
          }),
          s.write(t),
          s.end());
      });
    }
  };
function kg(e, t = {}) {
  zl.getInstance().enqueue(e, t);
}
async function WN() {
  let e = await JN();
  return { distinctId: e, ip: HN(), machineInfo: zN(e) };
}
function VN() {
  let e = process.env.UNITY_INSIGHT_DEBUG_METRICS;
  return e === "1" || e?.toLowerCase() === "true";
}
function qN(e) {
  let t = (n, i = 2) => String(n).padStart(i, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())} ${t(e.getHours())}:${t(e.getMinutes())}:${t(e.getSeconds())}.${t(e.getMilliseconds(), 3)}`;
}
function zN(e) {
  return {
    machine_id: e,
    hostname: Oe.hostname(),
    os: Oe.platform(),
    os_type: Oe.type(),
    os_release: Oe.release(),
    arch: Oe.arch(),
    cpu_model: Oe.cpus()[0]?.model,
  };
}
function HN() {
  for (let e of Object.values(Oe.networkInterfaces()))
    for (let t of e ?? []) if (!t.internal && t.family === "IPv4" && t.address) return t.address;
}
function XN(e) {
  return e
    ? e instanceof Error
      ? { error_name: e.name, error_message: e.message }
      : { error_message: String(e) }
    : {};
}
async function JN() {
  let e = await ZN();
  if (e) return nk(e);
  let t = QN();
  try {
    let i = (await vs.readFile(t, "utf8")).trim();
    if (i) return i;
  } catch {}
  let n = Hl.randomUUID().replace(/-/g, "");
  return (await vs.mkdir(Oi.dirname(t), { recursive: !0 }), await vs.writeFile(t, n, "utf8"), n);
}
function QN() {
  return Oi.join(Ai(), "metrics", KN);
}
async function ZN() {
  return process.platform === "darwin"
    ? await ek()
    : process.platform === "win32"
      ? process.env.COMPUTERNAME || Oe.hostname()
      : await tk();
}
async function ek() {
  try {
    let { stdout: e } = await $N("ioreg", ["-rd1", "-c", "IOPlatformExpertDevice"], { timeout: 1e3 });
    return e.toString().match(/"IOPlatformUUID"\s=\s"([^"]+)"/)?.[1];
  } catch {
    return;
  }
}
async function tk() {
  for (let e of ["/etc/machine-id", "/var/lib/dbus/machine-id"])
    try {
      let t = (await vs.readFile(e, "utf8")).trim();
      if (t) return t;
    } catch {}
}
function nk(e) {
  return Hl.createHash("sha256").update(e.trim()).update(YN).digest("hex");
}
function ik(e) {
  for (let t of Object.keys(e)) e[t] === void 0 && delete e[t];
}
var rk = "unity_insight_index_build";
function Xl(e) {
  kg(rk, { status: sk(e), durationMs: e.durationMs, error: e.error, extra: ok(e.result) });
}
function sk(e) {
  return e.error ? "error" : "completed";
}
function ok(e) {
  if (e)
    return {
      mode: e.mode,
      schema_version: e.schemaVersion,
      discovered_file_count: e.summary.discoveredFileCount,
      discovered_total_bytes: e.summary.discoveredTotalBytes ?? 0,
      diagnostic_count: e.summary.diagnosticCount,
      completed_stages: e.completedStages.join(","),
    };
}
var Jl = { bootstrap: 2, discovery: 3, extract: 38, resolve: 22, materialize: 28, finalize: 4, publish: 3 },
  Ql = ["bootstrap", "discovery", "extract", "resolve", "materialize", "finalize", "publish"],
  ak = Ql.reduce((e, t) => e + (Jl[t] ?? 0), 0),
  lk = {
    bootstrap: "Bootstrapping",
    discovery: "Discovering files",
    extract: "Extracting facts",
    resolve: "Resolving refs",
    materialize: "Materializing VFS",
    finalize: "Finalizing",
    publish: "Publishing",
  };
function ck(e) {
  return Math.min(1, Math.max(0, e));
}
function dk(e) {
  return e.total > 0 ? ck(e.current / e.total) : e.current > 0 ? 1 : 0;
}
function Og(e) {
  let t = Ql.indexOf(e.phase);
  if (t < 0) return 0;
  let n = 0;
  for (let o = 0; o < t; o += 1) {
    let a = Ql[o];
    n += Jl[a] ?? 0;
  }
  let i = Jl[e.phase] ?? 0,
    s = ((n + i * dk(e)) / ak) * 100;
  return Math.min(100, Math.max(0, Math.round(s)));
}
function Ag(e) {
  let t = lk[e.phase] ?? e.phase;
  return e.status && e.status.trim() !== "" ? e.status.trim() : e.total > 0 ? `${t} (${e.current}/${e.total})` : t;
}
import { execFile as fk } from "node:child_process";
import { realpathSync as mk } from "node:fs";
import {
  chmod as CF,
  link as DF,
  mkdir as jF,
  readFile as yk,
  rename as BF,
  rm as GF,
  stat as KF,
  writeFile as YF,
} from "node:fs/promises";
import pk from "node:os";
import vn from "node:path";
import { DatabaseSync as qF } from "node:sqlite";
import { promisify as gk } from "node:util";
import uk from "node:os";
import Ug from "node:path";
function Ai(e = process.env, t) {
  return __gcuInsightHome(e, () => Ug.join(t || uk.homedir(), ".unity-insight"));
}
var hk = 16,
  JF = Math.floor(hk / 2) + 1;
var QF = gk(fk);
var ZF = [
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
function Ik(e) {
  try {
    return mk.native(e);
  } catch {
    return;
  }
}
function Ui(e) {
  let t = vn.resolve(e),
    n = [],
    i = t;
  for (;;) {
    let r = Ik(i);
    if (r !== void 0) return vn.join(r, ...n);
    let s = vn.dirname(i);
    if (s === i) return t;
    (n.unshift(vn.basename(i)), (i = s));
  }
}
function Lg(e) {
  let t = Ui(e);
  return process.platform === "win32" ? t.toLowerCase() : t;
}
function bk() {
  return Ai();
}
function Ek() {
  return vn.join(bk(), ".serve.lock");
}
async function Dg(e, t) {
  let n = await Cg(Ek());
  if (n && Mg(n.pid)) {
    if (!t || n.servedProjectPaths === void 0) return !0;
    let i = Lg(t);
    if (n.servedProjectPaths.some((r) => Lg(r) === i)) return !0;
  }
  if (e) {
    let i = await Cg(e);
    if (i && Mg(i.pid)) return !0;
  }
  return !1;
}
function Mg(e) {
  if (!Number.isFinite(e) || e <= 0) return !1;
  try {
    return (process.kill(e, 0), !0);
  } catch {
    return !1;
  }
}
function Ps(e) {
  if (typeof e != "string") return;
  let t = e.trim();
  return t === "" ? void 0 : t;
}
function Fg(e, t, n) {
  return typeof e == "number" && Number.isInteger(e) && e >= t && e <= n;
}
function _k(e) {
  let t = JSON.parse(e),
    n = Ps(t.host);
  if (!Fg(t.pid, 1, Number.POSITIVE_INFINITY) || !n || !Fg(t.port, 0, 65535)) return;
  let i = t.scope === "global" ? "global" : void 0,
    r = typeof t.projectPath == "string" && t.projectPath.trim() !== "" ? Ui(t.projectPath) : void 0;
  if (i !== "global" && !r) return;
  let s = Ps(t.instanceId),
    o = Ps(t.capabilityToken);
  if (!!s != !!o) return;
  let a = typeof t.startedAt == "number" && Number.isFinite(t.startedAt) && t.startedAt > 0 ? t.startedAt : void 0,
    l = Ps(t.lifecycleGeneration),
    c = typeof t.watchEnabled == "boolean" ? t.watchEnabled : void 0,
    d = Array.isArray(t.servedProjectPaths)
      ? [...new Set(t.servedProjectPaths.filter((f) => typeof f == "string" && f.trim() !== "").map((f) => Ui(f)))]
      : void 0;
  return {
    pid: t.pid,
    host: n,
    port: t.port,
    ...(i ? { scope: i } : {}),
    ...(r ? { projectPath: r } : {}),
    ...(s ? { instanceId: s } : {}),
    ...(o ? { capabilityToken: o } : {}),
    ...(a !== void 0 ? { startedAt: a } : {}),
    ...(l ? { lifecycleGeneration: l } : {}),
    ...(c !== void 0 ? { watchEnabled: c } : {}),
    ...(d ? { servedProjectPaths: d } : {}),
  };
}
async function Cg(e) {
  try {
    return _k(await yk(e, "utf8"));
  } catch {
    return;
  }
}
var Zl = new Map();
function jg(e) {
  return Ui(e);
}
function Bg(e, t) {
  let n = jg(e),
    i = Og(t),
    r = Zl.get(n),
    s = r !== void 0 ? Math.max(r.percent, i) : i;
  Zl.set(n, {
    percent: s,
    phase: t.phase,
    detail: Ag(t),
    current: t.current,
    total: t.total,
    updatedAt: new Date().toISOString(),
  });
}
function Gg(e) {
  Zl.delete(jg(e));
}
import { mkdir as Sk } from "node:fs/promises";
import ec from "node:path";
import { setTimeout as Rk } from "node:timers/promises";
var wk = 2e3;
function vk() {
  let t = Ai();
  return {
    indexLockPath: ec.join(t, ".global-index-build.lock"),
    indexWriteLockDbPath: ec.join(t, "global-index-build.lock.db"),
  };
}
async function Kg(e = {}, t = {}) {
  let n = t.lockPaths ?? vk(),
    i = t.wait ?? Rk,
    r = !1;
  for (await Sk(ec.dirname(n.indexWriteLockDbPath), { recursive: !0, mode: 448 }); ;)
    try {
      return await Bn(n, "build");
    } catch (s) {
      if (!eo(s)) throw s;
      (r || (e.onWaiting?.(), (r = !0)), await i(wk));
    }
}
async function Yg(e) {
  return Gn(e);
}
var xs = class extends Error {
  constructor() {
    (super("Unity Insight index build is no longer needed"), (this.name = "UnityInsightIndexBuildSkippedError"));
  }
};
async function $g(e, t = {}) {
  let n = Date.now(),
    i = De.resolve(e.projectPath);
  try {
    return await Tk(e, t);
  } catch (r) {
    throw (r instanceof xs || Xl({ durationMs: Date.now() - n, error: r }), r);
  } finally {
    Gg(i);
  }
}
async function Tk(e, t = {}) {
  let n = Date.now(),
    i = t.resolveIndexPaths ?? Ks,
    r = t.readTextFile ?? ((E, w) => xk(E, w)),
    s = t.onProgress ?? e.onProgress,
    o = De.resolve(e.projectPath),
    a = (E) => {
      (Bg(o, E), s?.(E));
    },
    l = e.schemaVersion ?? 11,
    d = e.timing === !0 ? new ws() : void 0;
  if (l !== 11) throw new Error(`Unsupported Unity Insight schema version ${l}. Expected ${11}.`);
  (d?.start("validate"), await qc(o), d?.stop("validate"), d?.start("resolve_paths"));
  let f = i(o),
    m = e.outputPath ? "" : Pk(),
    y = e.outputPath ? De.resolve(e.outputPath) : De.join(f.indexDirectoryPath, `index.${m}.db`),
    p = e.outputPath ? De.join(De.dirname(y), `${De.basename(y)}.tmp`) : f.tempDbPath,
    g = e.outputPath
      ? { indexLockPath: De.join(De.dirname(y), Bs), indexWriteLockDbPath: De.join(De.dirname(y), Gs) }
      : f,
    I = De.dirname(y);
  await zc(I);
  let b = await Bn(g, "build");
  try {
    (d?.stop("resolve_paths"), d?.start("queue_wait"));
    let E = await Kg(
      {
        onWaiting: () => {
          a({ phase: "waiting", current: 0, total: 1, status: "Waiting for another project index build..." });
        },
      },
      t.globalBuildLock,
    );
    try {
      d?.stop("queue_wait");
      let w = e.outputPath ? y : (Qi(f) ?? f.liveDbPath);
      if ((await t.shouldSkipAfterLock?.(w)) === !0) throw new xs();
      await Js(p);
      let x = new Date().toISOString(),
        R = [],
        v = ["bootstrap"],
        O = { discoveredFileCount: 0, diagnosticCount: R.length, discoveredTotalBytes: 0 };
      d?.start("bootstrap");
      let N = await Hc(o, r),
        D;
      try {
        (a({ phase: "bootstrap", current: 1, total: 1 }),
          (D = Xc(p)),
          Qc(
            D,
            { projectPath: o, unityVersion: N, indexedAt: x, schemaVersion: l },
            { publishedIndexPath: y, mode: e.mode ?? "full", summary: O, completedStages: [...v], createdAt: x },
          ),
          d?.stop("bootstrap"),
          d?.start("extract"));
        let B = await Vm(
          D,
          o,
          R,
          {
            stopwatch: d,
            onDiscoveryComplete: (Y) => {
              a({ phase: "discovery", current: Y, total: Y, status: `Discovered ${Y} files` });
            },
            onExtractProgress: (Y, pe, q) => {
              a({ phase: "extract", current: Y, total: pe, status: q });
            },
            onExtractComplete: (Y) => {
              a({ phase: "extract", current: Y, total: Y, status: `Prepared ${Y} files and non-YAML facts` });
            },
          },
          { includePackages: e.includePackages },
        );
        (d?.stop("extract"),
          v.push("discovery", "extract"),
          (O.discoveredFileCount = B.discoveredFileCount),
          (O.discoveredTotalBytes = B.discoveredTotalBytes),
          (O.diagnosticCount = R.length),
          d?.start("resolve"),
          await Jp(D, {
            stopwatch: d,
            diagnostics: R,
            yamlIndexPassDependencies: t.yamlIndexPassDependencies,
            onProgress: (Y, pe, q) => {
              a({ phase: "resolve", current: Y, total: pe, status: q });
            },
          }),
          d?.stop("resolve"),
          v.push("resolve"),
          (O.diagnosticCount = R.length),
          d?.start("materialize"),
          await Rg(D, {
            stopwatch: d,
            diagnostics: R,
            onProgress: (Y, pe, q) => {
              a({ phase: "materialize", current: Y, total: pe, status: q });
            },
          }),
          d?.stop("materialize"),
          v.push("materialize"),
          (O.diagnosticCount = R.length),
          d?.start("finalize"),
          D.prepare(
            `UPDATE rebuild_summary
           SET discovered_file_count = ?,
               diagnostic_count = ?,
               completed_stages_json = ?
           WHERE project_id = ?`,
          ).run(O.discoveredFileCount, O.diagnosticCount, JSON.stringify([...v, "finalize"]), 1),
          Zc(D, R, x),
          kc(D),
          ed(D),
          a({ phase: "finalize", current: 1, total: 1 }),
          d?.stop("finalize"),
          v.push("finalize"),
          d?.start("publish"),
          Jc(D),
          D.close(),
          (D = void 0),
          e.outputPath
            ? await td(p, y)
            : (await ud(p, f, { randomUUID: () => m }), (await Dg(f.serveLockPath, o)) || (await yd(f))),
          a({ phase: "publish", current: 1, total: 1 }),
          d?.stop("publish"));
      } catch (B) {
        throw (D?.close(), await Js(p), e.outputPath || (await md(f, y)), B);
      }
      let te = d?.snapshot(),
        z = {
          projectPath: o,
          publishedIndexPath: y,
          tempIndexPath: p,
          mode: e.mode ?? "full",
          schemaVersion: l,
          completedStages: [...v],
          diagnostics: R,
          summary: O,
          timing: te,
        };
      return (Xl({ durationMs: Date.now() - n, result: z }), z);
    } finally {
      await Yg(E);
    }
  } finally {
    await Gn(b);
  }
}
import { format as nc } from "node:util";
import { BroadcastChannel as Nk, threadId as kk } from "node:worker_threads";
var Ok = { DEBUG: 10, INFO: 20, WARN: 30, ERROR: 40, OFF: 50 },
  AC = 10080 * 60 * 1e3;
var Ak = "unity-insight-process-log",
  tc = { debug: "DEBUG", log: "INFO", info: "INFO", warn: "WARN", error: "ERROR", trace: "ERROR" };
function Uk(e) {
  let t = e?.trim();
  if (!t) return { level: "INFO" };
  let n = t.toUpperCase();
  return n in Ok ? { level: n } : { level: "INFO", invalidValue: t };
}
function Wg() {
  if (Uk(process.env.UNITY_INSIGHT_LOG_LEVEL).level === "OFF") return () => {};
  let e;
  try {
    ((e = new Nk(Ak)), e.unref());
  } catch {
    return () => {};
  }
  let t = console,
    n = new Map(),
    i = !0;
  return (
    Mk(t, n, (r, s) => {
      if (i)
        try {
          e.postMessage({ timestamp: Date.now(), threadId: kk, level: r, message: s });
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
function Lk(e) {
  let t = nc(...e);
  return (new Error(t).stack ?? `Trace: ${t}`).replace(/^Error(?=:)/, "Trace");
}
function Mk(e, t, n) {
  for (let i of Object.keys(tc)) t.set(i, e[i]);
  for (let i of Object.keys(tc)) {
    let r = t.get(i);
    if (i === "trace") {
      let s = t.get("error");
      e.trace = (...o) => {
        let a = e.error,
          l;
        e.error = (...c) => {
          ((l = Fk(nc(...c))), s.apply(console, [l]));
        };
        try {
          r.apply(console, o);
        } finally {
          e.error = a;
        }
        n("ERROR", l ?? Lk(o));
      };
      continue;
    }
    e[i] = (...s) => {
      (r.apply(console, s), n(tc[i], nc(...s)));
    };
  }
}
function Fk(e) {
  let t = e.includes(`\r
`)
      ? `\r
`
      : `
`,
    n = e.split(t);
  return (n.length > 1 && n.splice(1, 1), n.join(t));
}
function Ck(e) {
  return typeof e == "object" && e !== null;
}
function Dk(e) {
  return Ck(e) && typeof e.id == "number" && Number.isSafeInteger(e.id);
}
function Vg(e) {
  return Dk(e) && e.type === "shouldSkipAfterLockResult" && typeof e.skip == "boolean";
}
Wg();
function Ts(e) {
  qg?.postMessage(e);
}
function jk(e) {
  return e instanceof Error ? { name: e.name, message: e.message } : { name: "Error", message: String(e) };
}
var ic = new Map();
function zg(e) {
  let t = ic.get(e);
  return (t && ic.delete(e), t);
}
function Bk(e, t) {
  return new Promise((n, i) => {
    (ic.set(e, { resolve: n, reject: i }), Ts({ type: "shouldSkipAfterLock", id: e, liveDbPath: t }));
  });
}
qg?.on("message", (e) => {
  if (e.type === "build") {
    Gk(e);
    return;
  }
  Vg(e) && zg(e.id)?.resolve(e.skip);
});
async function Gk(e) {
  try {
    let t = await $g(
      {
        projectPath: e.projectPath,
        mode: e.mode,
        outputPath: e.outputPath,
        schemaVersion: e.schemaVersion,
        includePackages: e.includePackages,
        timing: e.timing,
        onProgress: (n) => {
          Ts({ type: "progress", id: e.id, progress: n });
        },
      },
      e.querySkipAfterLock === !0 ? { shouldSkipAfterLock: (n) => Bk(e.id, n) } : {},
    );
    Ts({ type: "result", id: e.id, ok: !0, value: t });
  } catch (t) {
    (zg(e.id)?.reject(t instanceof Error ? t : new Error(String(t))),
      Ts({ type: "result", id: e.id, ok: !1, error: jk(t) }));
  }
}
