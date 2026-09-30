#!/usr/bin/env node
import { createRequire as __unityInsightCreateRequire } from "node:module";
import { fileURLToPath as __unityInsightFileURLToPath } from "node:url";
import { dirname as __unityInsightDirname } from "node:path";
const __filename = __unityInsightFileURLToPath(import.meta.url);
const __dirname = __unityInsightDirname(__filename);
const require = __unityInsightCreateRequire(import.meta.url);
var sv = Object.create;
var cp = Object.defineProperty;
var ov = Object.getOwnPropertyDescriptor;
var av = Object.getOwnPropertyNames;
var lv = Object.getPrototypeOf,
  cv = Object.prototype.hasOwnProperty;
var Lo = ((e) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
      ? new Proxy(e, { get: (t, n) => (typeof require < "u" ? require : t)[n] })
      : e)(function (e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
});
var q = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var dv = (e, t, n, r) => {
  if ((t && typeof t == "object") || typeof t == "function")
    for (let i of av(t))
      !cv.call(e, i) && i !== n && cp(e, i, { get: () => t[i], enumerable: !(r = ov(t, i)) || r.enumerable });
  return e;
};
var Oo = (e, t, n) => (
  (n = e != null ? sv(lv(e)) : {}),
  dv(t || !e || !e.__esModule ? cp(n, "default", { value: e, enumerable: !0 }) : n, e)
);
var he = q((Je) => {
  "use strict";
  var jd = Symbol.for("yaml.alias"),
    Og = Symbol.for("yaml.document"),
    la = Symbol.for("yaml.map"),
    Cg = Symbol.for("yaml.pair"),
    Bd = Symbol.for("yaml.scalar"),
    ca = Symbol.for("yaml.seq"),
    Sn = Symbol.for("yaml.node.type"),
    nk = (e) => !!e && typeof e == "object" && e[Sn] === jd,
    rk = (e) => !!e && typeof e == "object" && e[Sn] === Og,
    ik = (e) => !!e && typeof e == "object" && e[Sn] === la,
    sk = (e) => !!e && typeof e == "object" && e[Sn] === Cg,
    Mg = (e) => !!e && typeof e == "object" && e[Sn] === Bd,
    ok = (e) => !!e && typeof e == "object" && e[Sn] === ca;
  function Fg(e) {
    if (e && typeof e == "object")
      switch (e[Sn]) {
        case la:
        case ca:
          return !0;
      }
    return !1;
  }
  function ak(e) {
    if (e && typeof e == "object")
      switch (e[Sn]) {
        case jd:
        case la:
        case Bd:
        case ca:
          return !0;
      }
    return !1;
  }
  var lk = (e) => (Mg(e) || Fg(e)) && !!e.anchor;
  Je.ALIAS = jd;
  Je.DOC = Og;
  Je.MAP = la;
  Je.NODE_TYPE = Sn;
  Je.PAIR = Cg;
  Je.SCALAR = Bd;
  Je.SEQ = ca;
  Je.hasAnchor = lk;
  Je.isAlias = nk;
  Je.isCollection = Fg;
  Je.isDocument = rk;
  Je.isMap = ik;
  Je.isNode = ak;
  Je.isPair = sk;
  Je.isScalar = Mg;
  Je.isSeq = ok;
});
var gs = q((Vd) => {
  "use strict";
  var Ve = he(),
    ot = Symbol("break visit"),
    Dg = Symbol("skip children"),
    qt = Symbol("remove node");
  function da(e, t) {
    let n = jg(t);
    Ve.isDocument(e)
      ? fi(null, e.contents, n, Object.freeze([e])) === qt && (e.contents = null)
      : fi(null, e, n, Object.freeze([]));
  }
  da.BREAK = ot;
  da.SKIP = Dg;
  da.REMOVE = qt;
  function fi(e, t, n, r) {
    let i = Bg(e, t, n, r);
    if (Ve.isNode(i) || Ve.isPair(i)) return (Vg(e, r, i), fi(e, i, n, r));
    if (typeof i != "symbol") {
      if (Ve.isCollection(t)) {
        r = Object.freeze(r.concat(t));
        for (let s = 0; s < t.items.length; ++s) {
          let o = fi(s, t.items[s], n, r);
          if (typeof o == "number") s = o - 1;
          else {
            if (o === ot) return ot;
            o === qt && (t.items.splice(s, 1), (s -= 1));
          }
        }
      } else if (Ve.isPair(t)) {
        r = Object.freeze(r.concat(t));
        let s = fi("key", t.key, n, r);
        if (s === ot) return ot;
        s === qt && (t.key = null);
        let o = fi("value", t.value, n, r);
        if (o === ot) return ot;
        o === qt && (t.value = null);
      }
    }
    return i;
  }
  async function ua(e, t) {
    let n = jg(t);
    Ve.isDocument(e)
      ? (await mi(null, e.contents, n, Object.freeze([e]))) === qt && (e.contents = null)
      : await mi(null, e, n, Object.freeze([]));
  }
  ua.BREAK = ot;
  ua.SKIP = Dg;
  ua.REMOVE = qt;
  async function mi(e, t, n, r) {
    let i = await Bg(e, t, n, r);
    if (Ve.isNode(i) || Ve.isPair(i)) return (Vg(e, r, i), mi(e, i, n, r));
    if (typeof i != "symbol") {
      if (Ve.isCollection(t)) {
        r = Object.freeze(r.concat(t));
        for (let s = 0; s < t.items.length; ++s) {
          let o = await mi(s, t.items[s], n, r);
          if (typeof o == "number") s = o - 1;
          else {
            if (o === ot) return ot;
            o === qt && (t.items.splice(s, 1), (s -= 1));
          }
        }
      } else if (Ve.isPair(t)) {
        r = Object.freeze(r.concat(t));
        let s = await mi("key", t.key, n, r);
        if (s === ot) return ot;
        s === qt && (t.key = null);
        let o = await mi("value", t.value, n, r);
        if (o === ot) return ot;
        o === qt && (t.value = null);
      }
    }
    return i;
  }
  function jg(e) {
    return typeof e == "object" && (e.Collection || e.Node || e.Value)
      ? Object.assign(
          { Alias: e.Node, Map: e.Node, Scalar: e.Node, Seq: e.Node },
          e.Value && { Map: e.Value, Scalar: e.Value, Seq: e.Value },
          e.Collection && { Map: e.Collection, Seq: e.Collection },
          e,
        )
      : e;
  }
  function Bg(e, t, n, r) {
    if (typeof n == "function") return n(e, t, r);
    if (Ve.isMap(t)) return n.Map?.(e, t, r);
    if (Ve.isSeq(t)) return n.Seq?.(e, t, r);
    if (Ve.isPair(t)) return n.Pair?.(e, t, r);
    if (Ve.isScalar(t)) return n.Scalar?.(e, t, r);
    if (Ve.isAlias(t)) return n.Alias?.(e, t, r);
  }
  function Vg(e, t, n) {
    let r = t[t.length - 1];
    if (Ve.isCollection(r)) r.items[e] = n;
    else if (Ve.isPair(r)) e === "key" ? (r.key = n) : (r.value = n);
    else if (Ve.isDocument(r)) r.contents = n;
    else {
      let i = Ve.isAlias(r) ? "alias" : "scalar";
      throw new Error(`Cannot replace node with ${i} parent`);
    }
  }
  Vd.visit = da;
  Vd.visitAsync = ua;
});
var $d = q((Gg) => {
  "use strict";
  var $g = he(),
    ck = gs(),
    dk = { "!": "%21", ",": "%2C", "[": "%5B", "]": "%5D", "{": "%7B", "}": "%7D" },
    uk = (e) => e.replace(/[!,[\]{}]/g, (t) => dk[t]),
    hs = class e {
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
        let r = t.trim().split(/[ \t]+/),
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
      tagName(t, n) {
        if (t === "!") return "!";
        if (t[0] !== "!") return (n(`Not a valid tag: ${t}`), null);
        if (t[1] === "<") {
          let o = t.slice(2, -1);
          return o === "!" || o === "!!"
            ? (n(`Verbatim tags aren't resolved, so ${t} is invalid.`), null)
            : (t[t.length - 1] !== ">" && n("Verbatim tags must end with a >"), o);
        }
        let [, r, i] = t.match(/^(.*!)([^!]*)$/s);
        i || n(`The ${t} tag has no suffix`);
        let s = this.tags[r];
        if (s)
          try {
            return s + decodeURIComponent(i);
          } catch (o) {
            return (n(String(o)), null);
          }
        return r === "!" ? t : (n(`Could not resolve tag: ${t}`), null);
      }
      tagString(t) {
        for (let [n, r] of Object.entries(this.tags)) if (t.startsWith(r)) return n + uk(t.substring(r.length));
        return t[0] === "!" ? t : `!<${t}>`;
      }
      toString(t) {
        let n = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [],
          r = Object.entries(this.tags),
          i;
        if (t && r.length > 0 && $g.isNode(t.contents)) {
          let s = {};
          (ck.visit(t.contents, (o, a) => {
            $g.isNode(a) && a.tag && (s[a.tag] = !0);
          }),
            (i = Object.keys(s)));
        } else i = [];
        for (let [s, o] of r)
          (s === "!!" && o === "tag:yaml.org,2002:") ||
            ((!t || i.some((a) => a.startsWith(o))) && n.push(`%TAG ${s} ${o}`));
        return n.join(`
`);
      }
    };
  hs.defaultYaml = { explicit: !1, version: "1.2" };
  hs.defaultTags = { "!!": "tag:yaml.org,2002:" };
  Gg.Directives = hs;
});
var fa = q((Is) => {
  "use strict";
  var Kg = he(),
    fk = gs();
  function mk(e) {
    if (/[\x00-\x19\s,[\]{}]/.test(e)) {
      let n = `Anchor must not contain whitespace or control characters: ${JSON.stringify(e)}`;
      throw new Error(n);
    }
    return !0;
  }
  function Wg(e) {
    let t = new Set();
    return (
      fk.visit(e, {
        Value(n, r) {
          r.anchor && t.add(r.anchor);
        },
      }),
      t
    );
  }
  function Yg(e, t) {
    for (let n = 1; ; ++n) {
      let r = `${e}${n}`;
      if (!t.has(r)) return r;
    }
  }
  function yk(e, t) {
    let n = [],
      r = new Map(),
      i = null;
    return {
      onAnchor: (s) => {
        (n.push(s), i ?? (i = Wg(e)));
        let o = Yg(t, i);
        return (i.add(o), o);
      },
      setAnchors: () => {
        for (let s of n) {
          let o = r.get(s);
          if (typeof o == "object" && o.anchor && (Kg.isScalar(o.node) || Kg.isCollection(o.node)))
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
  Is.anchorIsValid = mk;
  Is.anchorNames = Wg;
  Is.createNodeAnchors = yk;
  Is.findNewAnchor = Yg;
});
var Gd = q((qg) => {
  "use strict";
  function bs(e, t, n, r) {
    if (r && typeof r == "object")
      if (Array.isArray(r))
        for (let i = 0, s = r.length; i < s; ++i) {
          let o = r[i],
            a = bs(e, r, String(i), o);
          a === void 0 ? delete r[i] : a !== o && (r[i] = a);
        }
      else if (r instanceof Map)
        for (let i of Array.from(r.keys())) {
          let s = r.get(i),
            o = bs(e, r, i, s);
          o === void 0 ? r.delete(i) : o !== s && r.set(i, o);
        }
      else if (r instanceof Set)
        for (let i of Array.from(r)) {
          let s = bs(e, r, i, i);
          s === void 0 ? r.delete(i) : s !== i && (r.delete(i), r.add(s));
        }
      else
        for (let [i, s] of Object.entries(r)) {
          let o = bs(e, r, i, s);
          o === void 0 ? delete r[i] : o !== s && (r[i] = o);
        }
    return e.call(t, n, r);
  }
  qg.applyReviver = bs;
});
var Vn = q((Hg) => {
  "use strict";
  var pk = he();
  function zg(e, t, n) {
    if (Array.isArray(e)) return e.map((r, i) => zg(r, String(i), n));
    if (e && typeof e.toJSON == "function") {
      if (!n || !pk.hasAnchor(e)) return e.toJSON(t, n);
      let r = { aliasCount: 0, count: 1, res: void 0 };
      (n.anchors.set(e, r),
        (n.onCreate = (s) => {
          ((r.res = s), delete n.onCreate);
        }));
      let i = e.toJSON(t, n);
      return (n.onCreate && n.onCreate(i), i);
    }
    return typeof e == "bigint" && !n?.keep ? Number(e) : e;
  }
  Hg.toJS = zg;
});
var ma = q((Xg) => {
  "use strict";
  var gk = Gd(),
    Qg = he(),
    hk = Vn(),
    Kd = class {
      constructor(t) {
        Object.defineProperty(this, Qg.NODE_TYPE, { value: t });
      }
      clone() {
        let t = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        return (this.range && (t.range = this.range.slice()), t);
      }
      toJS(t, { mapAsMap: n, maxAliasCount: r, onAnchor: i, reviver: s } = {}) {
        if (!Qg.isDocument(t)) throw new TypeError("A document argument is required");
        let o = {
            anchors: new Map(),
            doc: t,
            keep: !0,
            mapAsMap: n === !0,
            mapKeyWarned: !1,
            maxAliasCount: typeof r == "number" ? r : 100,
          },
          a = hk.toJS(this, "", o);
        if (typeof i == "function") for (let { count: l, res: c } of o.anchors.values()) i(c, l);
        return typeof s == "function" ? gk.applyReviver(s, { "": a }, "", a) : a;
      }
    };
  Xg.NodeBase = Kd;
});
var Ss = q((Jg) => {
  "use strict";
  var Ik = fa(),
    bk = gs(),
    yi = he(),
    Sk = ma(),
    _k = Vn(),
    Wd = class extends Sk.NodeBase {
      constructor(t) {
        (super(yi.ALIAS),
          (this.source = t),
          Object.defineProperty(this, "tag", {
            set() {
              throw new Error("Alias nodes cannot have tags");
            },
          }));
      }
      resolve(t, n) {
        if (n?.maxAliasCount === 0) throw new ReferenceError("Alias resolution is disabled");
        let r;
        n?.aliasResolveCache
          ? (r = n.aliasResolveCache)
          : ((r = []),
            bk.visit(t, {
              Node: (s, o) => {
                (yi.isAlias(o) || yi.hasAnchor(o)) && r.push(o);
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
      toJSON(t, n) {
        if (!n) return { source: this.source };
        let { anchors: r, doc: i, maxAliasCount: s } = n,
          o = this.resolve(i, n);
        if (!o) {
          let l = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(l);
        }
        let a = r.get(o);
        if ((a || (_k.toJS(o, null, n), (a = r.get(o))), a?.res === void 0)) {
          let l = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(l);
        }
        if (
          s >= 0 &&
          ((a.count += 1), a.aliasCount === 0 && (a.aliasCount = ya(i, o, r)), a.count * a.aliasCount > s)
        ) {
          let l = "Excessive alias count indicates a resource exhaustion attack";
          throw new ReferenceError(l);
        }
        return a.res;
      }
      toString(t, n, r) {
        let i = `*${this.source}`;
        if (t) {
          if ((Ik.anchorIsValid(this.source), t.options.verifyAliasOrder && !t.anchors.has(this.source))) {
            let s = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(s);
          }
          if (t.implicitKey) return `${i} `;
        }
        return i;
      }
    };
  function ya(e, t, n) {
    if (yi.isAlias(t)) {
      let r = t.resolve(e),
        i = n && r && n.get(r);
      return i ? i.count * i.aliasCount : 0;
    } else if (yi.isCollection(t)) {
      let r = 0;
      for (let i of t.items) {
        let s = ya(e, i, n);
        s > r && (r = s);
      }
      return r;
    } else if (yi.isPair(t)) {
      let r = ya(e, t.key, n),
        i = ya(e, t.value, n);
      return Math.max(r, i);
    }
    return 1;
  }
  Jg.Alias = Wd;
});
var Fe = q((Yd) => {
  "use strict";
  var Ek = he(),
    Rk = ma(),
    wk = Vn(),
    Pk = (e) => !e || (typeof e != "function" && typeof e != "object"),
    $n = class extends Rk.NodeBase {
      constructor(t) {
        (super(Ek.SCALAR), (this.value = t));
      }
      toJSON(t, n) {
        return n?.keep ? this.value : wk.toJS(this.value, t, n);
      }
      toString() {
        return String(this.value);
      }
    };
  $n.BLOCK_FOLDED = "BLOCK_FOLDED";
  $n.BLOCK_LITERAL = "BLOCK_LITERAL";
  $n.PLAIN = "PLAIN";
  $n.QUOTE_DOUBLE = "QUOTE_DOUBLE";
  $n.QUOTE_SINGLE = "QUOTE_SINGLE";
  Yd.Scalar = $n;
  Yd.isScalarValue = Pk;
});
var _s = q((eh) => {
  "use strict";
  var vk = Ss(),
    pr = he(),
    Zg = Fe(),
    xk = "tag:yaml.org,2002:";
  function Tk(e, t, n) {
    if (t) {
      let r = n.filter((s) => s.tag === t),
        i = r.find((s) => !s.format) ?? r[0];
      if (!i) throw new Error(`Tag ${t} not found`);
      return i;
    }
    return n.find((r) => r.identify?.(e) && !r.format);
  }
  function kk(e, t, n) {
    if ((pr.isDocument(e) && (e = e.contents), pr.isNode(e))) return e;
    if (pr.isPair(e)) {
      let u = n.schema[pr.MAP].createNode?.(n.schema, null, n);
      return (u.items.push(e), u);
    }
    (e instanceof String ||
      e instanceof Number ||
      e instanceof Boolean ||
      (typeof BigInt < "u" && e instanceof BigInt)) &&
      (e = e.valueOf());
    let { aliasDuplicateObjects: r, onAnchor: i, onTagObj: s, schema: o, sourceObjects: a } = n,
      l;
    if (r && e && typeof e == "object") {
      if (((l = a.get(e)), l)) return (l.anchor ?? (l.anchor = i(e)), new vk.Alias(l.anchor));
      ((l = { anchor: null, node: null }), a.set(e, l));
    }
    t?.startsWith("!!") && (t = xk + t.slice(2));
    let c = Tk(e, t, o.tags);
    if (!c) {
      if ((e && typeof e.toJSON == "function" && (e = e.toJSON()), !e || typeof e != "object")) {
        let u = new Zg.Scalar(e);
        return (l && (l.node = u), u);
      }
      c = e instanceof Map ? o[pr.MAP] : Symbol.iterator in Object(e) ? o[pr.SEQ] : o[pr.MAP];
    }
    s && (s(c), delete n.onTagObj);
    let d = c?.createNode
      ? c.createNode(n.schema, e, n)
      : typeof c?.nodeClass?.from == "function"
        ? c.nodeClass.from(n.schema, e, n)
        : new Zg.Scalar(e);
    return (t ? (d.tag = t) : c.default || (d.tag = c.tag), l && (l.node = d), d);
  }
  eh.createNode = kk;
});
var ga = q((pa) => {
  "use strict";
  var Nk = _s(),
    zt = he(),
    Uk = ma();
  function qd(e, t, n) {
    let r = n;
    for (let i = t.length - 1; i >= 0; --i) {
      let s = t[i];
      if (typeof s == "number" && Number.isInteger(s) && s >= 0) {
        let o = [];
        ((o[s] = r), (r = o));
      } else r = new Map([[s, r]]);
    }
    return Nk.createNode(r, void 0, {
      aliasDuplicateObjects: !1,
      keepUndefined: !1,
      onAnchor: () => {
        throw new Error("This should not happen, please report a bug.");
      },
      schema: e,
      sourceObjects: new Map(),
    });
  }
  var th = (e) => e == null || (typeof e == "object" && !!e[Symbol.iterator]().next().done),
    zd = class extends Uk.NodeBase {
      constructor(t, n) {
        (super(t), Object.defineProperty(this, "schema", { value: n, configurable: !0, enumerable: !1, writable: !0 }));
      }
      clone(t) {
        let n = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        return (
          t && (n.schema = t),
          (n.items = n.items.map((r) => (zt.isNode(r) || zt.isPair(r) ? r.clone(t) : r))),
          this.range && (n.range = this.range.slice()),
          n
        );
      }
      addIn(t, n) {
        if (th(t)) this.add(n);
        else {
          let [r, ...i] = t,
            s = this.get(r, !0);
          if (zt.isCollection(s)) s.addIn(i, n);
          else if (s === void 0 && this.schema) this.set(r, qd(this.schema, i, n));
          else throw new Error(`Expected YAML collection at ${r}. Remaining path: ${i}`);
        }
      }
      deleteIn(t) {
        let [n, ...r] = t;
        if (r.length === 0) return this.delete(n);
        let i = this.get(n, !0);
        if (zt.isCollection(i)) return i.deleteIn(r);
        throw new Error(`Expected YAML collection at ${n}. Remaining path: ${r}`);
      }
      getIn(t, n) {
        let [r, ...i] = t,
          s = this.get(r, !0);
        return i.length === 0 ? (!n && zt.isScalar(s) ? s.value : s) : zt.isCollection(s) ? s.getIn(i, n) : void 0;
      }
      hasAllNullValues(t) {
        return this.items.every((n) => {
          if (!zt.isPair(n)) return !1;
          let r = n.value;
          return r == null || (t && zt.isScalar(r) && r.value == null && !r.commentBefore && !r.comment && !r.tag);
        });
      }
      hasIn(t) {
        let [n, ...r] = t;
        if (r.length === 0) return this.has(n);
        let i = this.get(n, !0);
        return zt.isCollection(i) ? i.hasIn(r) : !1;
      }
      setIn(t, n) {
        let [r, ...i] = t;
        if (i.length === 0) this.set(r, n);
        else {
          let s = this.get(r, !0);
          if (zt.isCollection(s)) s.setIn(i, n);
          else if (s === void 0 && this.schema) this.set(r, qd(this.schema, i, n));
          else throw new Error(`Expected YAML collection at ${r}. Remaining path: ${i}`);
        }
      }
    };
  pa.Collection = zd;
  pa.collectionFromPath = qd;
  pa.isEmptyPath = th;
});
var Es = q((ha) => {
  "use strict";
  var Ak = (e) => e.replace(/^(?!$)(?: $)?/gm, "#");
  function Hd(e, t) {
    return /^\n+$/.test(e) ? e.substring(1) : t ? e.replace(/^(?! *$)/gm, t) : e;
  }
  var Lk = (e, t, n) =>
    e.endsWith(`
`)
      ? Hd(n, t)
      : n.includes(`
`)
        ? `
` + Hd(n, t)
        : (e.endsWith(" ") ? "" : " ") + n;
  ha.indentComment = Hd;
  ha.lineComment = Lk;
  ha.stringifyComment = Ak;
});
var rh = q((Rs) => {
  "use strict";
  var Ok = "flow",
    Qd = "block",
    Ia = "quoted";
  function Ck(
    e,
    t,
    n = "flow",
    { indentAtStart: r, lineWidth: i = 80, minContentWidth: s = 20, onFold: o, onOverflow: a } = {},
  ) {
    if (!i || i < 0) return e;
    i < s && (s = 0);
    let l = Math.max(1 + s, 1 + i - t.length);
    if (e.length <= l) return e;
    let c = [],
      d = {},
      u = i - t.length;
    typeof r == "number" && (r > i - Math.max(2, s) ? c.push(0) : (u = i - r));
    let f,
      m,
      y = !1,
      g = -1,
      h = -1,
      b = -1;
    n === Qd && ((g = nh(e, g, t.length)), g !== -1 && (u = g + l));
    for (let P; (P = e[(g += 1)]);) {
      if (n === Ia && P === "\\") {
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
        b = g;
      }
      if (
        P ===
        `
`
      )
        (n === Qd && (g = nh(e, g, t.length)), (u = g + t.length + l), (f = void 0));
      else {
        if (
          P === " " &&
          m &&
          m !== " " &&
          m !==
            `
` &&
          m !== "	"
        ) {
          let I = e[g + 1];
          I &&
            I !== " " &&
            I !==
              `
` &&
            I !== "	" &&
            (f = g);
        }
        if (g >= u)
          if (f) (c.push(f), (u = f + l), (f = void 0));
          else if (n === Ia) {
            for (; m === " " || m === "	";) ((m = P), (P = e[(g += 1)]), (y = !0));
            let I = g > b + 1 ? g - 2 : h - 1;
            if (d[I]) return e;
            (c.push(I), (d[I] = !0), (u = I + l), (f = void 0));
          } else y = !0;
      }
      m = P;
    }
    if ((y && a && a(), c.length === 0)) return e;
    o && o();
    let S = e.slice(0, c[0]);
    for (let P = 0; P < c.length; ++P) {
      let I = c[P],
        E = c[P + 1] || e.length;
      I === 0
        ? (S = `
${t}${e.slice(0, E)}`)
        : (n === Ia && d[I] && (S += `${e[I]}\\`),
          (S += `
${t}${e.slice(I + 1, E)}`));
    }
    return S;
  }
  function nh(e, t, n) {
    let r = t,
      i = t + 1,
      s = e[i];
    for (; s === " " || s === "	";)
      if (t < i + n) s = e[++t];
      else {
        do s = e[++t];
        while (
          s &&
          s !==
            `
`
        );
        ((r = t), (i = t + 1), (s = e[i]));
      }
    return r;
  }
  Rs.FOLD_BLOCK = Qd;
  Rs.FOLD_FLOW = Ok;
  Rs.FOLD_QUOTED = Ia;
  Rs.foldFlowLines = Ck;
});
var Ps = q((ih) => {
  "use strict";
  var Ft = Fe(),
    Gn = rh(),
    Sa = (e, t) => ({
      indentAtStart: t ? e.indent.length : e.indentAtStart,
      lineWidth: e.options.lineWidth,
      minContentWidth: e.options.minContentWidth,
    }),
    _a = (e) => /^(%|---|\.\.\.)/m.test(e);
  function Mk(e, t, n) {
    if (!t || t < 0) return !1;
    let r = t - n,
      i = e.length;
    if (i <= r) return !1;
    for (let s = 0, o = 0; s < i; ++s)
      if (
        e[s] ===
        `
`
      ) {
        if (s - o > r) return !0;
        if (((o = s + 1), i - o <= r)) return !1;
      }
    return !0;
  }
  function ws(e, t) {
    let n = JSON.stringify(e);
    if (t.options.doubleQuotedAsJSON) return n;
    let { implicitKey: r } = t,
      i = t.options.doubleQuotedMinMultiLineLength,
      s = t.indent || (_a(e) ? "  " : ""),
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
            if (r || n[l + 2] === '"' || n.length < i) l += 1;
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
    return ((o = a ? o + n.slice(a) : n), r ? o : Gn.foldFlowLines(o, s, Gn.FOLD_QUOTED, Sa(t, !1)));
  }
  function Xd(e, t) {
    if (
      t.options.singleQuote === !1 ||
      (t.implicitKey &&
        e.includes(`
`)) ||
      /[ \t]\n|\n[ \t]/.test(e)
    )
      return ws(e, t);
    let n = t.indent || (_a(e) ? "  " : ""),
      r =
        "'" +
        e.replace(/'/g, "''").replace(
          /\n+/g,
          `$&
${n}`,
        ) +
        "'";
    return t.implicitKey ? r : Gn.foldFlowLines(r, n, Gn.FOLD_FLOW, Sa(t, !1));
  }
  function pi(e, t) {
    let { singleQuote: n } = t.options,
      r;
    if (n === !1) r = ws;
    else {
      let i = e.includes('"'),
        s = e.includes("'");
      i && !s ? (r = Xd) : s && !i ? (r = ws) : (r = n ? Xd : ws);
    }
    return r(e, t);
  }
  var Jd;
  try {
    Jd = new RegExp(
      `(^|(?<!
))
+(?!
|$)`,
      "g",
    );
  } catch {
    Jd = /\n+(?!\n|$)/g;
  }
  function ba({ comment: e, type: t, value: n }, r, i, s) {
    let { blockQuote: o, commentString: a, lineWidth: l } = r.options;
    if (!o || /\n[\t ]+$/.test(n)) return pi(n, r);
    let c = r.indent || (r.forceBlockIndent || _a(n) ? "  " : ""),
      d =
        o === "literal"
          ? !0
          : o === "folded" || t === Ft.Scalar.BLOCK_FOLDED
            ? !1
            : t === Ft.Scalar.BLOCK_LITERAL
              ? !0
              : !Mk(n, l, c.length);
    if (!n)
      return d
        ? `|
`
        : `>
`;
    let u, f;
    for (f = n.length; f > 0; --f) {
      let E = n[f - 1];
      if (
        E !==
          `
` &&
        E !== "	" &&
        E !== " "
      )
        break;
    }
    let m = n.substring(f),
      y = m.indexOf(`
`);
    (y === -1 ? (u = "-") : n === m || y !== m.length - 1 ? ((u = "+"), s && s()) : (u = ""),
      m &&
        ((n = n.slice(0, -m.length)),
        m[m.length - 1] ===
          `
` && (m = m.slice(0, -1)),
        (m = m.replace(Jd, `$&${c}`))));
    let g = !1,
      h,
      b = -1;
    for (h = 0; h < n.length; ++h) {
      let E = n[h];
      if (E === " ") g = !0;
      else if (
        E ===
        `
`
      )
        b = h;
      else break;
    }
    let S = n.substring(0, b < h ? b + 1 : h);
    S && ((n = n.substring(S.length)), (S = S.replace(/\n+/g, `$&${c}`)));
    let I = (g ? (c ? "2" : "1") : "") + u;
    if ((e && ((I += " " + a(e.replace(/ ?[\r\n]+/g, " "))), i && i()), !d)) {
      let E = n
          .replace(
            /\n+/g,
            `
$&`,
          )
          .replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2")
          .replace(/\n+/g, `$&${c}`),
        w = !1,
        T = Sa(r, !0);
      o !== "folded" &&
        t !== Ft.Scalar.BLOCK_FOLDED &&
        (T.onOverflow = () => {
          w = !0;
        });
      let x = Gn.foldFlowLines(`${S}${E}${m}`, c, Gn.FOLD_BLOCK, T);
      if (!w)
        return `>${I}
${c}${x}`;
    }
    return (
      (n = n.replace(/\n+/g, `$&${c}`)),
      `|${I}
${c}${S}${n}${m}`
    );
  }
  function Fk(e, t, n, r) {
    let { type: i, value: s } = e,
      { actualString: o, implicitKey: a, indent: l, indentStep: c, inFlow: d } = t;
    if (
      (a &&
        s.includes(`
`)) ||
      (d && /[[\]{},]/.test(s))
    )
      return pi(s, t);
    if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(s))
      return a ||
        d ||
        !s.includes(`
`)
        ? pi(s, t)
        : ba(e, t, n, r);
    if (
      !a &&
      !d &&
      i !== Ft.Scalar.PLAIN &&
      s.includes(`
`)
    )
      return ba(e, t, n, r);
    if (_a(s)) {
      if (l === "") return ((t.forceBlockIndent = !0), ba(e, t, n, r));
      if (a && l === c) return pi(s, t);
    }
    let u = s.replace(
      /\n+/g,
      `$&
${l}`,
    );
    if (o) {
      let f = (g) => g.default && g.tag !== "tag:yaml.org,2002:str" && g.test?.test(u),
        { compat: m, tags: y } = t.doc.schema;
      if (y.some(f) || m?.some(f)) return pi(s, t);
    }
    return a ? u : Gn.foldFlowLines(u, l, Gn.FOLD_FLOW, Sa(t, !1));
  }
  function Dk(e, t, n, r) {
    let { implicitKey: i, inFlow: s } = t,
      o = typeof e.value == "string" ? e : Object.assign({}, e, { value: String(e.value) }),
      { type: a } = e;
    a !== Ft.Scalar.QUOTE_DOUBLE &&
      /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value) &&
      (a = Ft.Scalar.QUOTE_DOUBLE);
    let l = (d) => {
        switch (d) {
          case Ft.Scalar.BLOCK_FOLDED:
          case Ft.Scalar.BLOCK_LITERAL:
            return i || s ? pi(o.value, t) : ba(o, t, n, r);
          case Ft.Scalar.QUOTE_DOUBLE:
            return ws(o.value, t);
          case Ft.Scalar.QUOTE_SINGLE:
            return Xd(o.value, t);
          case Ft.Scalar.PLAIN:
            return Fk(o, t, n, r);
          default:
            return null;
        }
      },
      c = l(a);
    if (c === null) {
      let { defaultKeyType: d, defaultStringType: u } = t.options,
        f = (i && d) || u;
      if (((c = l(f)), c === null)) throw new Error(`Unsupported default string type ${f}`);
    }
    return c;
  }
  ih.stringifyString = Dk;
});
var vs = q((Zd) => {
  "use strict";
  var jk = fa(),
    Kn = he(),
    Bk = Es(),
    Vk = Ps();
  function $k(e, t) {
    let n = Object.assign(
        {
          blockQuote: !0,
          commentString: Bk.stringifyComment,
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
      doc: e,
      flowCollectionPadding: n.flowCollectionPadding ? " " : "",
      indent: "",
      indentStep: typeof n.indent == "number" ? " ".repeat(n.indent) : "  ",
      inFlow: r,
      options: n,
    };
  }
  function Gk(e, t) {
    if (t.tag) {
      let i = e.filter((s) => s.tag === t.tag);
      if (i.length > 0) return i.find((s) => s.format === t.format) ?? i[0];
    }
    let n, r;
    if (Kn.isScalar(t)) {
      r = t.value;
      let i = e.filter((s) => s.identify?.(r));
      if (i.length > 1) {
        let s = i.filter((o) => o.test);
        s.length > 0 && (i = s);
      }
      n = i.find((s) => s.format === t.format) ?? i.find((s) => !s.format);
    } else ((r = t), (n = e.find((i) => i.nodeClass && r instanceof i.nodeClass)));
    if (!n) {
      let i = r?.constructor?.name ?? (r === null ? "null" : typeof r);
      throw new Error(`Tag not resolved for ${i} value`);
    }
    return n;
  }
  function Kk(e, t, { anchors: n, doc: r }) {
    if (!r.directives) return "";
    let i = [],
      s = (Kn.isScalar(e) || Kn.isCollection(e)) && e.anchor;
    s && jk.anchorIsValid(s) && (n.add(s), i.push(`&${s}`));
    let o = e.tag ?? (t.default ? null : t.tag);
    return (o && i.push(r.directives.tagString(o)), i.join(" "));
  }
  function Wk(e, t, n, r) {
    if (Kn.isPair(e)) return e.toString(t, n, r);
    if (Kn.isAlias(e)) {
      if (t.doc.directives) return e.toString(t);
      if (t.resolvedAliases?.has(e)) throw new TypeError("Cannot stringify circular structure without alias nodes");
      (t.resolvedAliases ? t.resolvedAliases.add(e) : (t.resolvedAliases = new Set([e])), (e = e.resolve(t.doc)));
    }
    let i,
      s = Kn.isNode(e) ? e : t.doc.createNode(e, { onTagObj: (l) => (i = l) });
    i ?? (i = Gk(t.doc.schema.tags, s));
    let o = Kk(s, i, t);
    o.length > 0 && (t.indentAtStart = (t.indentAtStart ?? 0) + o.length + 1);
    let a =
      typeof i.stringify == "function"
        ? i.stringify(s, t, n, r)
        : Kn.isScalar(s)
          ? Vk.stringifyString(s, t, n, r)
          : s.toString(t, n, r);
    return o
      ? Kn.isScalar(s) || a[0] === "{" || a[0] === "["
        ? `${o} ${a}`
        : `${o}
${t.indent}${a}`
      : a;
  }
  Zd.createStringifyContext = $k;
  Zd.stringify = Wk;
});
var lh = q((ah) => {
  "use strict";
  var _n = he(),
    sh = Fe(),
    oh = vs(),
    xs = Es();
  function Yk({ key: e, value: t }, n, r, i) {
    let {
        allNullValues: s,
        doc: o,
        indent: a,
        indentStep: l,
        options: { commentString: c, indentSeq: d, simpleKeys: u },
      } = n,
      f = (_n.isNode(e) && e.comment) || null;
    if (u) {
      if (f) throw new Error("With simple keys, key nodes cannot have comments");
      if (_n.isCollection(e) || (!_n.isNode(e) && typeof e == "object")) {
        let T = "With simple keys, collection cannot be used as a key value";
        throw new Error(T);
      }
    }
    let m =
      !u &&
      (!e ||
        (f && t == null && !n.inFlow) ||
        _n.isCollection(e) ||
        (_n.isScalar(e)
          ? e.type === sh.Scalar.BLOCK_FOLDED || e.type === sh.Scalar.BLOCK_LITERAL
          : typeof e == "object"));
    n = Object.assign({}, n, { allNullValues: !1, implicitKey: !m && (u || !s), indent: a + l });
    let y = !1,
      g = !1,
      h = oh.stringify(
        e,
        n,
        () => (y = !0),
        () => (g = !0),
      );
    if (!m && !n.inFlow && h.length > 1024) {
      if (u) throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
      m = !0;
    }
    if (n.inFlow) {
      if (s || t == null) return (y && r && r(), h === "" ? "?" : m ? `? ${h}` : h);
    } else if ((s && !u) || (t == null && m))
      return ((h = `? ${h}`), f && !y ? (h += xs.lineComment(h, n.indent, c(f))) : g && i && i(), h);
    (y && (f = null),
      m
        ? (f && (h += xs.lineComment(h, n.indent, c(f))),
          (h = `? ${h}
${a}:`))
        : ((h = `${h}:`), f && (h += xs.lineComment(h, n.indent, c(f)))));
    let b, S, P;
    (_n.isNode(t)
      ? ((b = !!t.spaceBefore), (S = t.commentBefore), (P = t.comment))
      : ((b = !1), (S = null), (P = null), t && typeof t == "object" && (t = o.createNode(t))),
      (n.implicitKey = !1),
      !m && !f && _n.isScalar(t) && (n.indentAtStart = h.length + 1),
      (g = !1),
      !d &&
        l.length >= 2 &&
        !n.inFlow &&
        !m &&
        _n.isSeq(t) &&
        !t.flow &&
        !t.tag &&
        !t.anchor &&
        (n.indent = n.indent.substring(2)));
    let I = !1,
      E = oh.stringify(
        t,
        n,
        () => (I = !0),
        () => (g = !0),
      ),
      w = " ";
    if (f || b || S) {
      if (
        ((w = b
          ? `
`
          : ""),
        S)
      ) {
        let T = c(S);
        w += `
${xs.indentComment(T, n.indent)}`;
      }
      E === "" && !n.inFlow
        ? w ===
            `
` &&
          P &&
          (w = `

`)
        : (w += `
${n.indent}`);
    } else if (!m && _n.isCollection(t)) {
      let T = E[0],
        x = E.indexOf(`
`),
        O = x !== -1,
        F = n.inFlow ?? t.flow ?? t.items.length === 0;
      if (O || !F) {
        let Y = !1;
        if (O && (T === "&" || T === "!")) {
          let K = E.indexOf(" ");
          (T === "&" && K !== -1 && K < x && E[K + 1] === "!" && (K = E.indexOf(" ", K + 1)),
            (K === -1 || x < K) && (Y = !0));
        }
        Y ||
          (w = `
${n.indent}`);
      }
    } else
      (E === "" ||
        E[0] ===
          `
`) &&
        (w = "");
    return (
      (h += w + E),
      n.inFlow ? I && r && r() : P && !I ? (h += xs.lineComment(h, n.indent, c(P))) : g && i && i(),
      h
    );
  }
  ah.stringifyPair = Yk;
});
var tu = q((eu) => {
  "use strict";
  var ch = Lo("process");
  function qk(e, ...t) {
    e === "debug" && console.log(...t);
  }
  function zk(e, t) {
    (e === "debug" || e === "warn") && (typeof ch.emitWarning == "function" ? ch.emitWarning(t) : console.warn(t));
  }
  eu.debug = qk;
  eu.warn = zk;
});
var va = q((Pa) => {
  "use strict";
  var wa = he(),
    dh = Fe(),
    Ea = "<<",
    Ra = {
      identify: (e) => e === Ea || (typeof e == "symbol" && e.description === Ea),
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new dh.Scalar(Symbol(Ea)), { addToJSMap: uh }),
      stringify: () => Ea,
    },
    Hk = (e, t) =>
      (Ra.identify(t) || (wa.isScalar(t) && (!t.type || t.type === dh.Scalar.PLAIN) && Ra.identify(t.value))) &&
      e?.doc.schema.tags.some((n) => n.tag === Ra.tag && n.default);
  function uh(e, t, n) {
    let r = fh(e, n);
    if (wa.isSeq(r)) for (let i of r.items) nu(e, t, i);
    else if (Array.isArray(r)) for (let i of r) nu(e, t, i);
    else nu(e, t, r);
  }
  function nu(e, t, n) {
    let r = fh(e, n);
    if (!wa.isMap(r)) throw new Error("Merge sources must be maps or map aliases");
    let i = r.toJSON(null, e, Map);
    for (let [s, o] of i)
      t instanceof Map
        ? t.has(s) || t.set(s, o)
        : t instanceof Set
          ? t.add(s)
          : Object.prototype.hasOwnProperty.call(t, s) ||
            Object.defineProperty(t, s, { value: o, writable: !0, enumerable: !0, configurable: !0 });
    return t;
  }
  function fh(e, t) {
    return e && wa.isAlias(t) ? t.resolve(e.doc, e) : t;
  }
  Pa.addMergeToJSMap = uh;
  Pa.isMergeKey = Hk;
  Pa.merge = Ra;
});
var iu = q((ph) => {
  "use strict";
  var Qk = tu(),
    mh = va(),
    Xk = vs(),
    yh = he(),
    ru = Vn();
  function Jk(e, t, { key: n, value: r }) {
    if (yh.isNode(n) && n.addToJSMap) n.addToJSMap(e, t, r);
    else if (mh.isMergeKey(e, n)) mh.addMergeToJSMap(e, t, r);
    else {
      let i = ru.toJS(n, "", e);
      if (t instanceof Map) t.set(i, ru.toJS(r, i, e));
      else if (t instanceof Set) t.add(i);
      else {
        let s = Zk(n, i, e),
          o = ru.toJS(r, s, e);
        s in t ? Object.defineProperty(t, s, { value: o, writable: !0, enumerable: !0, configurable: !0 }) : (t[s] = o);
      }
    }
    return t;
  }
  function Zk(e, t, n) {
    if (t === null) return "";
    if (typeof t != "object") return String(t);
    if (yh.isNode(e) && n?.doc) {
      let r = Xk.createStringifyContext(n.doc, {});
      r.anchors = new Set();
      for (let s of n.anchors.keys()) r.anchors.add(s.anchor);
      ((r.inFlow = !0), (r.inStringifyKey = !0));
      let i = e.toString(r);
      if (!n.mapKeyWarned) {
        let s = JSON.stringify(i);
        (s.length > 40 && (s = s.substring(0, 36) + '..."'),
          Qk.warn(
            n.doc.options.logLevel,
            `Keys with collection values will be stringified due to JS Object restrictions: ${s}. Set mapAsMap: true to use object keys.`,
          ),
          (n.mapKeyWarned = !0));
      }
      return i;
    }
    return JSON.stringify(t);
  }
  ph.addPairToJSMap = Jk;
});
var Wn = q((su) => {
  "use strict";
  var gh = _s(),
    eN = lh(),
    tN = iu(),
    xa = he();
  function nN(e, t, n) {
    let r = gh.createNode(e, void 0, n),
      i = gh.createNode(t, void 0, n);
    return new Ta(r, i);
  }
  var Ta = class e {
    constructor(t, n = null) {
      (Object.defineProperty(this, xa.NODE_TYPE, { value: xa.PAIR }), (this.key = t), (this.value = n));
    }
    clone(t) {
      let { key: n, value: r } = this;
      return (xa.isNode(n) && (n = n.clone(t)), xa.isNode(r) && (r = r.clone(t)), new e(n, r));
    }
    toJSON(t, n) {
      let r = n?.mapAsMap ? new Map() : {};
      return tN.addPairToJSMap(n, r, this);
    }
    toString(t, n, r) {
      return t?.doc ? eN.stringifyPair(this, t, n, r) : JSON.stringify(this);
    }
  };
  su.Pair = Ta;
  su.createPair = nN;
});
var ou = q((Ih) => {
  "use strict";
  var gr = he(),
    hh = vs(),
    ka = Es();
  function rN(e, t, n) {
    return ((t.inFlow ?? e.flow) ? sN : iN)(e, t, n);
  }
  function iN(
    { comment: e, items: t },
    n,
    { blockItemPrefix: r, flowChars: i, itemIndent: s, onChompKeep: o, onComment: a },
  ) {
    let {
        indent: l,
        options: { commentString: c },
      } = n,
      d = Object.assign({}, n, { indent: s, type: null }),
      u = !1,
      f = [];
    for (let y = 0; y < t.length; ++y) {
      let g = t[y],
        h = null;
      if (gr.isNode(g)) (!u && g.spaceBefore && f.push(""), Na(n, f, g.commentBefore, u), g.comment && (h = g.comment));
      else if (gr.isPair(g)) {
        let S = gr.isNode(g.key) ? g.key : null;
        S && (!u && S.spaceBefore && f.push(""), Na(n, f, S.commentBefore, u));
      }
      u = !1;
      let b = hh.stringify(
        g,
        d,
        () => (h = null),
        () => (u = !0),
      );
      (h && (b += ka.lineComment(b, s, c(h))), u && h && (u = !1), f.push(r + b));
    }
    let m;
    if (f.length === 0) m = i.start + i.end;
    else {
      m = f[0];
      for (let y = 1; y < f.length; ++y) {
        let g = f[y];
        m += g
          ? `
${l}${g}`
          : `
`;
      }
    }
    return (
      e
        ? ((m +=
            `
` + ka.indentComment(c(e), l)),
          a && a())
        : u && o && o(),
      m
    );
  }
  function sN({ items: e }, t, { flowChars: n, itemIndent: r }) {
    let {
      indent: i,
      indentStep: s,
      flowCollectionPadding: o,
      options: { commentString: a },
    } = t;
    r += s;
    let l = Object.assign({}, t, { indent: r, inFlow: !0, type: null }),
      c = !1,
      d = 0,
      u = [];
    for (let y = 0; y < e.length; ++y) {
      let g = e[y],
        h = null;
      if (gr.isNode(g)) (g.spaceBefore && u.push(""), Na(t, u, g.commentBefore, !1), g.comment && (h = g.comment));
      else if (gr.isPair(g)) {
        let S = gr.isNode(g.key) ? g.key : null;
        S && (S.spaceBefore && u.push(""), Na(t, u, S.commentBefore, !1), S.comment && (c = !0));
        let P = gr.isNode(g.value) ? g.value : null;
        P
          ? (P.comment && (h = P.comment), P.commentBefore && (c = !0))
          : g.value == null && S?.comment && (h = S.comment);
      }
      h && (c = !0);
      let b = hh.stringify(g, l, () => (h = null));
      (c ||
        (c =
          u.length > d ||
          b.includes(`
`)),
        y < e.length - 1
          ? (b += ",")
          : t.options.trailingComma &&
            (t.options.lineWidth > 0 &&
              (c || (c = u.reduce((S, P) => S + P.length + 2, 2) + (b.length + 2) > t.options.lineWidth)),
            c && (b += ",")),
        h && (b += ka.lineComment(b, r, a(h))),
        u.push(b),
        (d = u.length));
    }
    let { start: f, end: m } = n;
    if (u.length === 0) return f + m;
    if (!c) {
      let y = u.reduce((g, h) => g + h.length + 2, 2);
      c = t.options.lineWidth > 0 && y > t.options.lineWidth;
    }
    if (c) {
      let y = f;
      for (let g of u)
        y += g
          ? `
${s}${i}${g}`
          : `
`;
      return `${y}
${i}${m}`;
    } else return `${f}${o}${u.join(" ")}${o}${m}`;
  }
  function Na({ indent: e, options: { commentString: t } }, n, r, i) {
    if ((r && i && (r = r.replace(/^\n+/, "")), r)) {
      let s = ka.indentComment(t(r), e);
      n.push(s.trimStart());
    }
  }
  Ih.stringifyCollection = rN;
});
var qn = q((lu) => {
  "use strict";
  var oN = ou(),
    aN = iu(),
    lN = ga(),
    Yn = he(),
    Ua = Wn(),
    cN = Fe();
  function Ts(e, t) {
    let n = Yn.isScalar(t) ? t.value : t;
    for (let r of e)
      if (Yn.isPair(r) && (r.key === t || r.key === n || (Yn.isScalar(r.key) && r.key.value === n))) return r;
  }
  var au = class extends lN.Collection {
    static get tagName() {
      return "tag:yaml.org,2002:map";
    }
    constructor(t) {
      (super(Yn.MAP, t), (this.items = []));
    }
    static from(t, n, r) {
      let { keepUndefined: i, replacer: s } = r,
        o = new this(t),
        a = (l, c) => {
          if (typeof s == "function") c = s.call(n, l, c);
          else if (Array.isArray(s) && !s.includes(l)) return;
          (c !== void 0 || i) && o.items.push(Ua.createPair(l, c, r));
        };
      if (n instanceof Map) for (let [l, c] of n) a(l, c);
      else if (n && typeof n == "object") for (let l of Object.keys(n)) a(l, n[l]);
      return (typeof t.sortMapEntries == "function" && o.items.sort(t.sortMapEntries), o);
    }
    add(t, n) {
      let r;
      Yn.isPair(t)
        ? (r = t)
        : !t || typeof t != "object" || !("key" in t)
          ? (r = new Ua.Pair(t, t?.value))
          : (r = new Ua.Pair(t.key, t.value));
      let i = Ts(this.items, r.key),
        s = this.schema?.sortMapEntries;
      if (i) {
        if (!n) throw new Error(`Key ${r.key} already set`);
        Yn.isScalar(i.value) && cN.isScalarValue(r.value) ? (i.value.value = r.value) : (i.value = r.value);
      } else if (s) {
        let o = this.items.findIndex((a) => s(r, a) < 0);
        o === -1 ? this.items.push(r) : this.items.splice(o, 0, r);
      } else this.items.push(r);
    }
    delete(t) {
      let n = Ts(this.items, t);
      return n ? this.items.splice(this.items.indexOf(n), 1).length > 0 : !1;
    }
    get(t, n) {
      let i = Ts(this.items, t)?.value;
      return (!n && Yn.isScalar(i) ? i.value : i) ?? void 0;
    }
    has(t) {
      return !!Ts(this.items, t);
    }
    set(t, n) {
      this.add(new Ua.Pair(t, n), !0);
    }
    toJSON(t, n, r) {
      let i = r ? new r() : n?.mapAsMap ? new Map() : {};
      n?.onCreate && n.onCreate(i);
      for (let s of this.items) aN.addPairToJSMap(n, i, s);
      return i;
    }
    toString(t, n, r) {
      if (!t) return JSON.stringify(this);
      for (let i of this.items)
        if (!Yn.isPair(i)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(i)} instead`);
      return (
        !t.allNullValues && this.hasAllNullValues(!1) && (t = Object.assign({}, t, { allNullValues: !0 })),
        oN.stringifyCollection(this, t, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: t.indent || "",
          onChompKeep: r,
          onComment: n,
        })
      );
    }
  };
  lu.YAMLMap = au;
  lu.findPair = Ts;
});
var gi = q((Sh) => {
  "use strict";
  var dN = he(),
    bh = qn(),
    uN = {
      collection: "map",
      default: !0,
      nodeClass: bh.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(e, t) {
        return (dN.isMap(e) || t("Expected a mapping for this tag"), e);
      },
      createNode: (e, t, n) => bh.YAMLMap.from(e, t, n),
    };
  Sh.map = uN;
});
var zn = q((_h) => {
  "use strict";
  var fN = _s(),
    mN = ou(),
    yN = ga(),
    La = he(),
    pN = Fe(),
    gN = Vn(),
    cu = class extends yN.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(t) {
        (super(La.SEQ, t), (this.items = []));
      }
      add(t) {
        this.items.push(t);
      }
      delete(t) {
        let n = Aa(t);
        return typeof n != "number" ? !1 : this.items.splice(n, 1).length > 0;
      }
      get(t, n) {
        let r = Aa(t);
        if (typeof r != "number") return;
        let i = this.items[r];
        return !n && La.isScalar(i) ? i.value : i;
      }
      has(t) {
        let n = Aa(t);
        return typeof n == "number" && n < this.items.length;
      }
      set(t, n) {
        let r = Aa(t);
        if (typeof r != "number") throw new Error(`Expected a valid index, not ${t}.`);
        let i = this.items[r];
        La.isScalar(i) && pN.isScalarValue(n) ? (i.value = n) : (this.items[r] = n);
      }
      toJSON(t, n) {
        let r = [];
        n?.onCreate && n.onCreate(r);
        let i = 0;
        for (let s of this.items) r.push(gN.toJS(s, String(i++), n));
        return r;
      }
      toString(t, n, r) {
        return t
          ? mN.stringifyCollection(this, t, {
              blockItemPrefix: "- ",
              flowChars: { start: "[", end: "]" },
              itemIndent: (t.indent || "") + "  ",
              onChompKeep: r,
              onComment: n,
            })
          : JSON.stringify(this);
      }
      static from(t, n, r) {
        let { replacer: i } = r,
          s = new this(t);
        if (n && Symbol.iterator in Object(n)) {
          let o = 0;
          for (let a of n) {
            if (typeof i == "function") {
              let l = n instanceof Set ? a : String(o++);
              a = i.call(n, l, a);
            }
            s.items.push(fN.createNode(a, void 0, r));
          }
        }
        return s;
      }
    };
  function Aa(e) {
    let t = La.isScalar(e) ? e.value : e;
    return (
      t && typeof t == "string" && (t = Number(t)),
      typeof t == "number" && Number.isInteger(t) && t >= 0 ? t : null
    );
  }
  _h.YAMLSeq = cu;
});
var hi = q((Rh) => {
  "use strict";
  var hN = he(),
    Eh = zn(),
    IN = {
      collection: "seq",
      default: !0,
      nodeClass: Eh.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(e, t) {
        return (hN.isSeq(e) || t("Expected a sequence for this tag"), e);
      },
      createNode: (e, t, n) => Eh.YAMLSeq.from(e, t, n),
    };
  Rh.seq = IN;
});
var ks = q((wh) => {
  "use strict";
  var bN = Ps(),
    SN = {
      identify: (e) => typeof e == "string",
      default: !0,
      tag: "tag:yaml.org,2002:str",
      resolve: (e) => e,
      stringify(e, t, n, r) {
        return ((t = Object.assign({ actualString: !0 }, t)), bN.stringifyString(e, t, n, r));
      },
    };
  wh.string = SN;
});
var Oa = q((xh) => {
  "use strict";
  var Ph = Fe(),
    vh = {
      identify: (e) => e == null,
      createNode: () => new Ph.Scalar(null),
      default: !0,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Ph.Scalar(null),
      stringify: ({ source: e }, t) => (typeof e == "string" && vh.test.test(e) ? e : t.options.nullStr),
    };
  xh.nullTag = vh;
});
var du = q((kh) => {
  "use strict";
  var _N = Fe(),
    Th = {
      identify: (e) => typeof e == "boolean",
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (e) => new _N.Scalar(e[0] === "t" || e[0] === "T"),
      stringify({ source: e, value: t }, n) {
        if (e && Th.test.test(e)) {
          let r = e[0] === "t" || e[0] === "T";
          if (t === r) return e;
        }
        return t ? n.options.trueStr : n.options.falseStr;
      },
    };
  kh.boolTag = Th;
});
var Ii = q((Nh) => {
  "use strict";
  function EN({ format: e, minFractionDigits: t, tag: n, value: r }) {
    if (typeof r == "bigint") return String(r);
    let i = typeof r == "number" ? r : Number(r);
    if (!isFinite(i)) return isNaN(i) ? ".nan" : i < 0 ? "-.inf" : ".inf";
    let s = Object.is(r, -0) ? "-0" : JSON.stringify(r);
    if (!e && t && (!n || n === "tag:yaml.org,2002:float") && /^-?\d/.test(s) && !s.includes("e")) {
      let o = s.indexOf(".");
      o < 0 && ((o = s.length), (s += "."));
      let a = t - (s.length - o - 1);
      for (; a-- > 0;) s += "0";
    }
    return s;
  }
  Nh.stringifyNumber = EN;
});
var fu = q((Ca) => {
  "use strict";
  var RN = Fe(),
    uu = Ii(),
    wN = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (e) =>
        e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: uu.stringifyNumber,
    },
    PN = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (e) => parseFloat(e),
      stringify(e) {
        let t = Number(e.value);
        return isFinite(t) ? t.toExponential() : uu.stringifyNumber(e);
      },
    },
    vN = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(e) {
        let t = new RN.Scalar(parseFloat(e)),
          n = e.indexOf(".");
        return (n !== -1 && e[e.length - 1] === "0" && (t.minFractionDigits = e.length - n - 1), t);
      },
      stringify: uu.stringifyNumber,
    };
  Ca.float = vN;
  Ca.floatExp = PN;
  Ca.floatNaN = wN;
});
var yu = q((Fa) => {
  "use strict";
  var Uh = Ii(),
    Ma = (e) => typeof e == "bigint" || Number.isInteger(e),
    mu = (e, t, n, { intAsBigInt: r }) => (r ? BigInt(e) : parseInt(e.substring(t), n));
  function Ah(e, t, n) {
    let { value: r } = e;
    return Ma(r) && r >= 0 ? n + r.toString(t) : Uh.stringifyNumber(e);
  }
  var xN = {
      identify: (e) => Ma(e) && e >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (e, t, n) => mu(e, 2, 8, n),
      stringify: (e) => Ah(e, 8, "0o"),
    },
    TN = {
      identify: Ma,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (e, t, n) => mu(e, 0, 10, n),
      stringify: Uh.stringifyNumber,
    },
    kN = {
      identify: (e) => Ma(e) && e >= 0,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (e, t, n) => mu(e, 2, 16, n),
      stringify: (e) => Ah(e, 16, "0x"),
    };
  Fa.int = TN;
  Fa.intHex = kN;
  Fa.intOct = xN;
});
var Oh = q((Lh) => {
  "use strict";
  var NN = gi(),
    UN = Oa(),
    AN = hi(),
    LN = ks(),
    ON = du(),
    pu = fu(),
    gu = yu(),
    CN = [
      NN.map,
      AN.seq,
      LN.string,
      UN.nullTag,
      ON.boolTag,
      gu.intOct,
      gu.int,
      gu.intHex,
      pu.floatNaN,
      pu.floatExp,
      pu.float,
    ];
  Lh.schema = CN;
});
var Fh = q((Mh) => {
  "use strict";
  var MN = Fe(),
    FN = gi(),
    DN = hi();
  function Ch(e) {
    return typeof e == "bigint" || Number.isInteger(e);
  }
  var Da = ({ value: e }) => JSON.stringify(e),
    jN = [
      {
        identify: (e) => typeof e == "string",
        default: !0,
        tag: "tag:yaml.org,2002:str",
        resolve: (e) => e,
        stringify: Da,
      },
      {
        identify: (e) => e == null,
        createNode: () => new MN.Scalar(null),
        default: !0,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: Da,
      },
      {
        identify: (e) => typeof e == "boolean",
        default: !0,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (e) => e === "true",
        stringify: Da,
      },
      {
        identify: Ch,
        default: !0,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (e, t, { intAsBigInt: n }) => (n ? BigInt(e) : parseInt(e, 10)),
        stringify: ({ value: e }) => (Ch(e) ? e.toString() : JSON.stringify(e)),
      },
      {
        identify: (e) => typeof e == "number",
        default: !0,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (e) => parseFloat(e),
        stringify: Da,
      },
    ],
    BN = {
      default: !0,
      tag: "",
      test: /^/,
      resolve(e, t) {
        return (t(`Unresolved plain scalar ${JSON.stringify(e)}`), e);
      },
    },
    VN = [FN.map, DN.seq].concat(jN, BN);
  Mh.schema = VN;
});
var Iu = q((Dh) => {
  "use strict";
  var Ns = Lo("buffer"),
    hu = Fe(),
    $N = Ps(),
    GN = {
      identify: (e) => e instanceof Uint8Array,
      default: !1,
      tag: "tag:yaml.org,2002:binary",
      resolve(e, t) {
        if (typeof Ns.Buffer == "function") return Ns.Buffer.from(e, "base64");
        if (typeof atob == "function") {
          let n = atob(e.replace(/[\n\r]/g, "")),
            r = new Uint8Array(n.length);
          for (let i = 0; i < n.length; ++i) r[i] = n.charCodeAt(i);
          return r;
        } else
          return (t("This environment does not support reading binary tags; either Buffer or atob is required"), e);
      },
      stringify({ comment: e, type: t, value: n }, r, i, s) {
        if (!n) return "";
        let o = n,
          a;
        if (typeof Ns.Buffer == "function")
          a = o instanceof Ns.Buffer ? o.toString("base64") : Ns.Buffer.from(o.buffer).toString("base64");
        else if (typeof btoa == "function") {
          let l = "";
          for (let c = 0; c < o.length; ++c) l += String.fromCharCode(o[c]);
          a = btoa(l);
        } else
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        if ((t ?? (t = hu.Scalar.BLOCK_LITERAL), t !== hu.Scalar.QUOTE_DOUBLE)) {
          let l = Math.max(r.options.lineWidth - r.indent.length, r.options.minContentWidth),
            c = Math.ceil(a.length / l),
            d = new Array(c);
          for (let u = 0, f = 0; u < c; ++u, f += l) d[u] = a.substr(f, l);
          a = d.join(
            t === hu.Scalar.BLOCK_LITERAL
              ? `
`
              : " ",
          );
        }
        return $N.stringifyString({ comment: e, type: t, value: a }, r, i, s);
      },
    };
  Dh.binary = GN;
});
var Va = q((Ba) => {
  "use strict";
  var ja = he(),
    bu = Wn(),
    KN = Fe(),
    WN = zn();
  function jh(e, t) {
    if (ja.isSeq(e))
      for (let n = 0; n < e.items.length; ++n) {
        let r = e.items[n];
        if (!ja.isPair(r)) {
          if (ja.isMap(r)) {
            r.items.length > 1 && t("Each pair must have its own sequence indicator");
            let i = r.items[0] || new bu.Pair(new KN.Scalar(null));
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
          e.items[n] = ja.isPair(r) ? r : new bu.Pair(r);
        }
      }
    else t("Expected a sequence for this tag");
    return e;
  }
  function Bh(e, t, n) {
    let { replacer: r } = n,
      i = new WN.YAMLSeq(e);
    i.tag = "tag:yaml.org,2002:pairs";
    let s = 0;
    if (t && Symbol.iterator in Object(t))
      for (let o of t) {
        typeof r == "function" && (o = r.call(t, String(s++), o));
        let a, l;
        if (Array.isArray(o))
          if (o.length === 2) ((a = o[0]), (l = o[1]));
          else throw new TypeError(`Expected [key, value] tuple: ${o}`);
        else if (o && o instanceof Object) {
          let c = Object.keys(o);
          if (c.length === 1) ((a = c[0]), (l = o[a]));
          else throw new TypeError(`Expected tuple with one key, not ${c.length} keys`);
        } else a = o;
        i.items.push(bu.createPair(a, l, n));
      }
    return i;
  }
  var YN = { collection: "seq", default: !1, tag: "tag:yaml.org,2002:pairs", resolve: jh, createNode: Bh };
  Ba.createPairs = Bh;
  Ba.pairs = YN;
  Ba.resolvePairs = jh;
});
var Eu = q((_u) => {
  "use strict";
  var Vh = he(),
    Su = Vn(),
    Us = qn(),
    qN = zn(),
    $h = Va(),
    hr = class e extends qN.YAMLSeq {
      constructor() {
        (super(),
          (this.add = Us.YAMLMap.prototype.add.bind(this)),
          (this.delete = Us.YAMLMap.prototype.delete.bind(this)),
          (this.get = Us.YAMLMap.prototype.get.bind(this)),
          (this.has = Us.YAMLMap.prototype.has.bind(this)),
          (this.set = Us.YAMLMap.prototype.set.bind(this)),
          (this.tag = e.tag));
      }
      toJSON(t, n) {
        if (!n) return super.toJSON(t);
        let r = new Map();
        n?.onCreate && n.onCreate(r);
        for (let i of this.items) {
          let s, o;
          if (
            (Vh.isPair(i) ? ((s = Su.toJS(i.key, "", n)), (o = Su.toJS(i.value, s, n))) : (s = Su.toJS(i, "", n)),
            r.has(s))
          )
            throw new Error("Ordered maps must not include duplicate keys");
          r.set(s, o);
        }
        return r;
      }
      static from(t, n, r) {
        let i = $h.createPairs(t, n, r),
          s = new this();
        return ((s.items = i.items), s);
      }
    };
  hr.tag = "tag:yaml.org,2002:omap";
  var zN = {
    collection: "seq",
    identify: (e) => e instanceof Map,
    nodeClass: hr,
    default: !1,
    tag: "tag:yaml.org,2002:omap",
    resolve(e, t) {
      let n = $h.resolvePairs(e, t),
        r = [];
      for (let { key: i } of n.items)
        Vh.isScalar(i) &&
          (r.includes(i.value) ? t(`Ordered maps must not include duplicate keys: ${i.value}`) : r.push(i.value));
      return Object.assign(new hr(), n);
    },
    createNode: (e, t, n) => hr.from(e, t, n),
  };
  _u.YAMLOMap = hr;
  _u.omap = zN;
});
var qh = q((Ru) => {
  "use strict";
  var Gh = Fe();
  function Kh({ value: e, source: t }, n) {
    return t && (e ? Wh : Yh).test.test(t) ? t : e ? n.options.trueStr : n.options.falseStr;
  }
  var Wh = {
      identify: (e) => e === !0,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Gh.Scalar(!0),
      stringify: Kh,
    },
    Yh = {
      identify: (e) => e === !1,
      default: !0,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Gh.Scalar(!1),
      stringify: Kh,
    };
  Ru.falseTag = Yh;
  Ru.trueTag = Wh;
});
var zh = q(($a) => {
  "use strict";
  var HN = Fe(),
    wu = Ii(),
    QN = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (e) =>
        e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: wu.stringifyNumber,
    },
    XN = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (e) => parseFloat(e.replace(/_/g, "")),
      stringify(e) {
        let t = Number(e.value);
        return isFinite(t) ? t.toExponential() : wu.stringifyNumber(e);
      },
    },
    JN = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(e) {
        let t = new HN.Scalar(parseFloat(e.replace(/_/g, ""))),
          n = e.indexOf(".");
        if (n !== -1) {
          let r = e.substring(n + 1).replace(/_/g, "");
          r[r.length - 1] === "0" && (t.minFractionDigits = r.length);
        }
        return t;
      },
      stringify: wu.stringifyNumber,
    };
  $a.float = JN;
  $a.floatExp = XN;
  $a.floatNaN = QN;
});
var Qh = q((Ls) => {
  "use strict";
  var Hh = Ii(),
    As = (e) => typeof e == "bigint" || Number.isInteger(e);
  function Ga(e, t, n, { intAsBigInt: r }) {
    let i = e[0];
    if (((i === "-" || i === "+") && (t += 1), (e = e.substring(t).replace(/_/g, "")), r)) {
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
      return i === "-" ? BigInt(-1) * o : o;
    }
    let s = parseInt(e, n);
    return i === "-" ? -1 * s : s;
  }
  function Pu(e, t, n) {
    let { value: r } = e;
    if (As(r)) {
      let i = r.toString(t);
      return r < 0 ? "-" + n + i.substr(1) : n + i;
    }
    return Hh.stringifyNumber(e);
  }
  var ZN = {
      identify: As,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (e, t, n) => Ga(e, 2, 2, n),
      stringify: (e) => Pu(e, 2, "0b"),
    },
    eU = {
      identify: As,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (e, t, n) => Ga(e, 1, 8, n),
      stringify: (e) => Pu(e, 8, "0"),
    },
    tU = {
      identify: As,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (e, t, n) => Ga(e, 0, 10, n),
      stringify: Hh.stringifyNumber,
    },
    nU = {
      identify: As,
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (e, t, n) => Ga(e, 2, 16, n),
      stringify: (e) => Pu(e, 16, "0x"),
    };
  Ls.int = tU;
  Ls.intBin = ZN;
  Ls.intHex = nU;
  Ls.intOct = eU;
});
var xu = q((vu) => {
  "use strict";
  var Ya = he(),
    Ka = Wn(),
    Wa = qn(),
    Ir = class e extends Wa.YAMLMap {
      constructor(t) {
        (super(t), (this.tag = e.tag));
      }
      add(t) {
        let n;
        (Ya.isPair(t)
          ? (n = t)
          : t && typeof t == "object" && "key" in t && "value" in t && t.value === null
            ? (n = new Ka.Pair(t.key, null))
            : (n = new Ka.Pair(t, null)),
          Wa.findPair(this.items, n.key) || this.items.push(n));
      }
      get(t, n) {
        let r = Wa.findPair(this.items, t);
        return !n && Ya.isPair(r) ? (Ya.isScalar(r.key) ? r.key.value : r.key) : r;
      }
      set(t, n) {
        if (typeof n != "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof n}`);
        let r = Wa.findPair(this.items, t);
        r && !n ? this.items.splice(this.items.indexOf(r), 1) : !r && n && this.items.push(new Ka.Pair(t));
      }
      toJSON(t, n) {
        return super.toJSON(t, n, Set);
      }
      toString(t, n, r) {
        if (!t) return JSON.stringify(this);
        if (this.hasAllNullValues(!0)) return super.toString(Object.assign({}, t, { allNullValues: !0 }), n, r);
        throw new Error("Set items must all have null values");
      }
      static from(t, n, r) {
        let { replacer: i } = r,
          s = new this(t);
        if (n && Symbol.iterator in Object(n))
          for (let o of n) (typeof i == "function" && (o = i.call(n, o, o)), s.items.push(Ka.createPair(o, null, r)));
        return s;
      }
    };
  Ir.tag = "tag:yaml.org,2002:set";
  var rU = {
    collection: "map",
    identify: (e) => e instanceof Set,
    nodeClass: Ir,
    default: !1,
    tag: "tag:yaml.org,2002:set",
    createNode: (e, t, n) => Ir.from(e, t, n),
    resolve(e, t) {
      if (Ya.isMap(e)) {
        if (e.hasAllNullValues(!0)) return Object.assign(new Ir(), e);
        t("Set items must all have null values");
      } else t("Expected a mapping for this tag");
      return e;
    },
  };
  vu.YAMLSet = Ir;
  vu.set = rU;
});
var ku = q((qa) => {
  "use strict";
  var iU = Ii();
  function Tu(e, t) {
    let n = e[0],
      r = n === "-" || n === "+" ? e.substring(1) : e,
      i = (o) => (t ? BigInt(o) : Number(o)),
      s = r
        .replace(/_/g, "")
        .split(":")
        .reduce((o, a) => o * i(60) + i(a), i(0));
    return n === "-" ? i(-1) * s : s;
  }
  function Xh(e) {
    let { value: t } = e,
      n = (o) => o;
    if (typeof t == "bigint") n = (o) => BigInt(o);
    else if (isNaN(t) || !isFinite(t)) return iU.stringifyNumber(e);
    let r = "";
    t < 0 && ((r = "-"), (t *= n(-1)));
    let i = n(60),
      s = [t % i];
    return (
      t < 60 ? s.unshift(0) : ((t = (t - s[0]) / i), s.unshift(t % i), t >= 60 && ((t = (t - s[0]) / i), s.unshift(t))),
      r +
        s
          .map((o) => String(o).padStart(2, "0"))
          .join(":")
          .replace(/000000\d*$/, "")
    );
  }
  var sU = {
      identify: (e) => typeof e == "bigint" || Number.isInteger(e),
      default: !0,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (e, t, { intAsBigInt: n }) => Tu(e, n),
      stringify: Xh,
    },
    oU = {
      identify: (e) => typeof e == "number",
      default: !0,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (e) => Tu(e, !1),
      stringify: Xh,
    },
    Jh = {
      identify: (e) => e instanceof Date,
      default: !0,
      tag: "tag:yaml.org,2002:timestamp",
      test: RegExp(
        "^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$",
      ),
      resolve(e) {
        let t = e.match(Jh.test);
        if (!t) throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        let [, n, r, i, s, o, a] = t.map(Number),
          l = t[7] ? Number((t[7] + "00").substr(1, 3)) : 0,
          c = Date.UTC(n, r - 1, i, s || 0, o || 0, a || 0, l),
          d = t[8];
        if (d && d !== "Z") {
          let u = Tu(d, !1);
          (Math.abs(u) < 30 && (u *= 60), (c -= 6e4 * u));
        }
        return new Date(c);
      },
      stringify: ({ value: e }) => e?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? "",
    };
  qa.floatTime = oU;
  qa.intTime = sU;
  qa.timestamp = Jh;
});
var tI = q((eI) => {
  "use strict";
  var aU = gi(),
    lU = Oa(),
    cU = hi(),
    dU = ks(),
    uU = Iu(),
    Zh = qh(),
    Nu = zh(),
    za = Qh(),
    fU = va(),
    mU = Eu(),
    yU = Va(),
    pU = xu(),
    Uu = ku(),
    gU = [
      aU.map,
      cU.seq,
      dU.string,
      lU.nullTag,
      Zh.trueTag,
      Zh.falseTag,
      za.intBin,
      za.intOct,
      za.int,
      za.intHex,
      Nu.floatNaN,
      Nu.floatExp,
      Nu.float,
      uU.binary,
      fU.merge,
      mU.omap,
      yU.pairs,
      pU.set,
      Uu.intTime,
      Uu.floatTime,
      Uu.timestamp,
    ];
  eI.schema = gU;
});
var uI = q((Ou) => {
  "use strict";
  var sI = gi(),
    hU = Oa(),
    oI = hi(),
    IU = ks(),
    bU = du(),
    Au = fu(),
    Lu = yu(),
    SU = Oh(),
    _U = Fh(),
    aI = Iu(),
    Os = va(),
    lI = Eu(),
    cI = Va(),
    nI = tI(),
    dI = xu(),
    Ha = ku(),
    rI = new Map([
      ["core", SU.schema],
      ["failsafe", [sI.map, oI.seq, IU.string]],
      ["json", _U.schema],
      ["yaml11", nI.schema],
      ["yaml-1.1", nI.schema],
    ]),
    iI = {
      binary: aI.binary,
      bool: bU.boolTag,
      float: Au.float,
      floatExp: Au.floatExp,
      floatNaN: Au.floatNaN,
      floatTime: Ha.floatTime,
      int: Lu.int,
      intHex: Lu.intHex,
      intOct: Lu.intOct,
      intTime: Ha.intTime,
      map: sI.map,
      merge: Os.merge,
      null: hU.nullTag,
      omap: lI.omap,
      pairs: cI.pairs,
      seq: oI.seq,
      set: dI.set,
      timestamp: Ha.timestamp,
    },
    EU = {
      "tag:yaml.org,2002:binary": aI.binary,
      "tag:yaml.org,2002:merge": Os.merge,
      "tag:yaml.org,2002:omap": lI.omap,
      "tag:yaml.org,2002:pairs": cI.pairs,
      "tag:yaml.org,2002:set": dI.set,
      "tag:yaml.org,2002:timestamp": Ha.timestamp,
    };
  function RU(e, t, n) {
    let r = rI.get(t);
    if (r && !e) return n && !r.includes(Os.merge) ? r.concat(Os.merge) : r.slice();
    let i = r;
    if (!i)
      if (Array.isArray(e)) i = [];
      else {
        let s = Array.from(rI.keys())
          .filter((o) => o !== "yaml11")
          .map((o) => JSON.stringify(o))
          .join(", ");
        throw new Error(`Unknown schema "${t}"; use one of ${s} or define customTags array`);
      }
    if (Array.isArray(e)) for (let s of e) i = i.concat(s);
    else typeof e == "function" && (i = e(i.slice()));
    return (
      n && (i = i.concat(Os.merge)),
      i.reduce((s, o) => {
        let a = typeof o == "string" ? iI[o] : o;
        if (!a) {
          let l = JSON.stringify(o),
            c = Object.keys(iI)
              .map((d) => JSON.stringify(d))
              .join(", ");
          throw new Error(`Unknown custom tag ${l}; use one of ${c}`);
        }
        return (s.includes(a) || s.push(a), s);
      }, [])
    );
  }
  Ou.coreKnownTags = EU;
  Ou.getTags = RU;
});
var Fu = q((fI) => {
  "use strict";
  var Cu = he(),
    wU = gi(),
    PU = hi(),
    vU = ks(),
    Qa = uI(),
    xU = (e, t) => (e.key < t.key ? -1 : e.key > t.key ? 1 : 0),
    Mu = class e {
      constructor({
        compat: t,
        customTags: n,
        merge: r,
        resolveKnownTags: i,
        schema: s,
        sortMapEntries: o,
        toStringDefaults: a,
      }) {
        ((this.compat = Array.isArray(t) ? Qa.getTags(t, "compat") : t ? Qa.getTags(null, t) : null),
          (this.name = (typeof s == "string" && s) || "core"),
          (this.knownTags = i ? Qa.coreKnownTags : {}),
          (this.tags = Qa.getTags(n, this.name, r)),
          (this.toStringOptions = a ?? null),
          Object.defineProperty(this, Cu.MAP, { value: wU.map }),
          Object.defineProperty(this, Cu.SCALAR, { value: vU.string }),
          Object.defineProperty(this, Cu.SEQ, { value: PU.seq }),
          (this.sortMapEntries = typeof o == "function" ? o : o === !0 ? xU : null));
      }
      clone() {
        let t = Object.create(e.prototype, Object.getOwnPropertyDescriptors(this));
        return ((t.tags = this.tags.slice()), t);
      }
    };
  fI.Schema = Mu;
});
var yI = q((mI) => {
  "use strict";
  var TU = he(),
    Du = vs(),
    Cs = Es();
  function kU(e, t) {
    let n = [],
      r = t.directives === !0;
    if (t.directives !== !1 && e.directives) {
      let l = e.directives.toString(e);
      l ? (n.push(l), (r = !0)) : e.directives.docStart && (r = !0);
    }
    r && n.push("---");
    let i = Du.createStringifyContext(e, t),
      { commentString: s } = i.options;
    if (e.commentBefore) {
      n.length !== 1 && n.unshift("");
      let l = s(e.commentBefore);
      n.unshift(Cs.indentComment(l, ""));
    }
    let o = !1,
      a = null;
    if (e.contents) {
      if (TU.isNode(e.contents)) {
        if ((e.contents.spaceBefore && r && n.push(""), e.contents.commentBefore)) {
          let d = s(e.contents.commentBefore);
          n.push(Cs.indentComment(d, ""));
        }
        ((i.forceBlockIndent = !!e.comment), (a = e.contents.comment));
      }
      let l = a ? void 0 : () => (o = !0),
        c = Du.stringify(e.contents, i, () => (a = null), l);
      (a && (c += Cs.lineComment(c, "", s(a))),
        (c[0] === "|" || c[0] === ">") && n[n.length - 1] === "---" ? (n[n.length - 1] = `--- ${c}`) : n.push(c));
    } else n.push(Du.stringify(e.contents, i));
    if (e.directives?.docEnd)
      if (e.comment) {
        let l = s(e.comment);
        l.includes(`
`)
          ? (n.push("..."), n.push(Cs.indentComment(l, "")))
          : n.push(`... ${l}`);
      } else n.push("...");
    else {
      let l = e.comment;
      (l && o && (l = l.replace(/^\n+/, "")),
        l && ((!o || a) && n[n.length - 1] !== "" && n.push(""), n.push(Cs.indentComment(s(l), ""))));
    }
    return (
      n.join(`
`) +
      `
`
    );
  }
  mI.stringifyDocument = kU;
});
var Ms = q((pI) => {
  "use strict";
  var NU = Ss(),
    bi = ga(),
    bt = he(),
    UU = Wn(),
    AU = Vn(),
    LU = Fu(),
    OU = yI(),
    ju = fa(),
    CU = Gd(),
    MU = _s(),
    Bu = $d(),
    Vu = class e {
      constructor(t, n, r) {
        ((this.commentBefore = null),
          (this.comment = null),
          (this.errors = []),
          (this.warnings = []),
          Object.defineProperty(this, bt.NODE_TYPE, { value: bt.DOC }));
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
          : (this.directives = new Bu.Directives({ version: o })),
          this.setSchema(o, r),
          (this.contents = t === void 0 ? null : this.createNode(t, i, r)));
      }
      clone() {
        let t = Object.create(e.prototype, { [bt.NODE_TYPE]: { value: bt.DOC } });
        return (
          (t.commentBefore = this.commentBefore),
          (t.comment = this.comment),
          (t.errors = this.errors.slice()),
          (t.warnings = this.warnings.slice()),
          (t.options = Object.assign({}, this.options)),
          this.directives && (t.directives = this.directives.clone()),
          (t.schema = this.schema.clone()),
          (t.contents = bt.isNode(this.contents) ? this.contents.clone(t.schema) : this.contents),
          this.range && (t.range = this.range.slice()),
          t
        );
      }
      add(t) {
        Si(this.contents) && this.contents.add(t);
      }
      addIn(t, n) {
        Si(this.contents) && this.contents.addIn(t, n);
      }
      createAlias(t, n) {
        if (!t.anchor) {
          let r = ju.anchorNames(this);
          t.anchor = !n || r.has(n) ? ju.findNewAnchor(n || "a", r) : n;
        }
        return new NU.Alias(t.anchor);
      }
      createNode(t, n, r) {
        let i;
        if (typeof n == "function") ((t = n.call({ "": t }, "", t)), (i = n));
        else if (Array.isArray(n)) {
          let h = (S) => typeof S == "number" || S instanceof String || S instanceof Number,
            b = n.filter(h).map(String);
          (b.length > 0 && (n = n.concat(b)), (i = n));
        } else r === void 0 && n && ((r = n), (n = void 0));
        let { aliasDuplicateObjects: s, anchorPrefix: o, flow: a, keepUndefined: l, onTagObj: c, tag: d } = r ?? {},
          { onAnchor: u, setAnchors: f, sourceObjects: m } = ju.createNodeAnchors(this, o || "a"),
          y = {
            aliasDuplicateObjects: s ?? !0,
            keepUndefined: l ?? !1,
            onAnchor: u,
            onTagObj: c,
            replacer: i,
            schema: this.schema,
            sourceObjects: m,
          },
          g = MU.createNode(t, d, y);
        return (a && bt.isCollection(g) && (g.flow = !0), f(), g);
      }
      createPair(t, n, r = {}) {
        let i = this.createNode(t, null, r),
          s = this.createNode(n, null, r);
        return new UU.Pair(i, s);
      }
      delete(t) {
        return Si(this.contents) ? this.contents.delete(t) : !1;
      }
      deleteIn(t) {
        return bi.isEmptyPath(t)
          ? this.contents == null
            ? !1
            : ((this.contents = null), !0)
          : Si(this.contents)
            ? this.contents.deleteIn(t)
            : !1;
      }
      get(t, n) {
        return bt.isCollection(this.contents) ? this.contents.get(t, n) : void 0;
      }
      getIn(t, n) {
        return bi.isEmptyPath(t)
          ? !n && bt.isScalar(this.contents)
            ? this.contents.value
            : this.contents
          : bt.isCollection(this.contents)
            ? this.contents.getIn(t, n)
            : void 0;
      }
      has(t) {
        return bt.isCollection(this.contents) ? this.contents.has(t) : !1;
      }
      hasIn(t) {
        return bi.isEmptyPath(t)
          ? this.contents !== void 0
          : bt.isCollection(this.contents)
            ? this.contents.hasIn(t)
            : !1;
      }
      set(t, n) {
        this.contents == null
          ? (this.contents = bi.collectionFromPath(this.schema, [t], n))
          : Si(this.contents) && this.contents.set(t, n);
      }
      setIn(t, n) {
        bi.isEmptyPath(t)
          ? (this.contents = n)
          : this.contents == null
            ? (this.contents = bi.collectionFromPath(this.schema, Array.from(t), n))
            : Si(this.contents) && this.contents.setIn(t, n);
      }
      setSchema(t, n = {}) {
        typeof t == "number" && (t = String(t));
        let r;
        switch (t) {
          case "1.1":
            (this.directives
              ? (this.directives.yaml.version = "1.1")
              : (this.directives = new Bu.Directives({ version: "1.1" })),
              (r = { resolveKnownTags: !1, schema: "yaml-1.1" }));
            break;
          case "1.2":
          case "next":
            (this.directives
              ? (this.directives.yaml.version = t)
              : (this.directives = new Bu.Directives({ version: t })),
              (r = { resolveKnownTags: !0, schema: "core" }));
            break;
          case null:
            (this.directives && delete this.directives, (r = null));
            break;
          default: {
            let i = JSON.stringify(t);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${i}`);
          }
        }
        if (n.schema instanceof Object) this.schema = n.schema;
        else if (r) this.schema = new LU.Schema(Object.assign(r, n));
        else throw new Error("With a null YAML version, the { schema: Schema } option is required");
      }
      toJS({ json: t, jsonArg: n, mapAsMap: r, maxAliasCount: i, onAnchor: s, reviver: o } = {}) {
        let a = {
            anchors: new Map(),
            doc: this,
            keep: !t,
            mapAsMap: r === !0,
            mapKeyWarned: !1,
            maxAliasCount: typeof i == "number" ? i : 100,
          },
          l = AU.toJS(this.contents, n ?? "", a);
        if (typeof s == "function") for (let { count: c, res: d } of a.anchors.values()) s(d, c);
        return typeof o == "function" ? CU.applyReviver(o, { "": l }, "", l) : l;
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
        return OU.stringifyDocument(this, t);
      }
    };
  function Si(e) {
    if (bt.isCollection(e)) return !0;
    throw new Error("Expected a YAML collection as document contents");
  }
  pI.Document = Vu;
});
var js = q((Ds) => {
  "use strict";
  var Fs = class extends Error {
      constructor(t, n, r, i) {
        (super(), (this.name = t), (this.code = r), (this.message = i), (this.pos = n));
      }
    },
    $u = class extends Fs {
      constructor(t, n, r) {
        super("YAMLParseError", t, n, r);
      }
    },
    Gu = class extends Fs {
      constructor(t, n, r) {
        super("YAMLWarning", t, n, r);
      }
    },
    FU = (e, t) => (n) => {
      if (n.pos[0] === -1) return;
      n.linePos = n.pos.map((a) => t.linePos(a));
      let { line: r, col: i } = n.linePos[0];
      n.message += ` at line ${r}, column ${i}`;
      let s = i - 1,
        o = e.substring(t.lineStarts[r - 1], t.lineStarts[r]).replace(/[\n\r]+$/, "");
      if (s >= 60 && o.length > 80) {
        let a = Math.min(s - 39, o.length - 79);
        ((o = "\u2026" + o.substring(a)), (s -= a - 1));
      }
      if ((o.length > 80 && (o = o.substring(0, 79) + "\u2026"), r > 1 && /^ *$/.test(o.substring(0, s)))) {
        let a = e.substring(t.lineStarts[r - 2], t.lineStarts[r - 1]);
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
        l?.line === r && l.col > i && (a = Math.max(1, Math.min(l.col - i, 80 - s)));
        let c = " ".repeat(s) + "^".repeat(a);
        n.message += `:

${o}
${c}
`;
      }
    };
  Ds.YAMLError = Fs;
  Ds.YAMLParseError = $u;
  Ds.YAMLWarning = Gu;
  Ds.prettifyError = FU;
});
var Bs = q((gI) => {
  "use strict";
  function DU(e, { flow: t, indicator: n, next: r, offset: i, onError: s, parentIndent: o, startOnNewline: a }) {
    let l = !1,
      c = a,
      d = a,
      u = "",
      f = "",
      m = !1,
      y = !1,
      g = null,
      h = null,
      b = null,
      S = null,
      P = null,
      I = null,
      E = null;
    for (let x of e)
      switch (
        (y &&
          (x.type !== "space" &&
            x.type !== "newline" &&
            x.type !== "comma" &&
            s(x.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"),
          (y = !1)),
        g &&
          (c &&
            x.type !== "comment" &&
            x.type !== "newline" &&
            s(g, "TAB_AS_INDENT", "Tabs are not allowed as indentation"),
          (g = null)),
        x.type)
      ) {
        case "space":
          (!t && (n !== "doc-start" || r?.type !== "flow-collection") && x.source.includes("	") && (g = x), (d = !0));
          break;
        case "comment": {
          d || s(x, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          let O = x.source.substring(1) || " ";
          (u ? (u += f + O) : (u = O), (f = ""), (c = !1));
          break;
        }
        case "newline":
          (c ? (u ? (u += x.source) : (!I || n !== "seq-item-ind") && (l = !0)) : (f += x.source),
            (c = !0),
            (m = !0),
            (h || b) && (S = x),
            (d = !0));
          break;
        case "anchor":
          (h && s(x, "MULTIPLE_ANCHORS", "A node can have at most one anchor"),
            x.source.endsWith(":") &&
              s(x.offset + x.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0),
            (h = x),
            E ?? (E = x.offset),
            (c = !1),
            (d = !1),
            (y = !0));
          break;
        case "tag": {
          (b && s(x, "MULTIPLE_TAGS", "A node can have at most one tag"),
            (b = x),
            E ?? (E = x.offset),
            (c = !1),
            (d = !1),
            (y = !0));
          break;
        }
        case n:
          ((h || b) && s(x, "BAD_PROP_ORDER", `Anchors and tags must be after the ${x.source} indicator`),
            I && s(x, "UNEXPECTED_TOKEN", `Unexpected ${x.source} in ${t ?? "collection"}`),
            (I = x),
            (c = n === "seq-item-ind" || n === "explicit-key-ind"),
            (d = !1));
          break;
        case "comma":
          if (t) {
            (P && s(x, "UNEXPECTED_TOKEN", `Unexpected , in ${t}`), (P = x), (c = !1), (d = !1));
            break;
          }
        default:
          (s(x, "UNEXPECTED_TOKEN", `Unexpected ${x.type} token`), (c = !1), (d = !1));
      }
    let w = e[e.length - 1],
      T = w ? w.offset + w.source.length : i;
    return (
      y &&
        r &&
        r.type !== "space" &&
        r.type !== "newline" &&
        r.type !== "comma" &&
        (r.type !== "scalar" || r.source !== "") &&
        s(r.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"),
      g &&
        ((c && g.indent <= o) || r?.type === "block-map" || r?.type === "block-seq") &&
        s(g, "TAB_AS_INDENT", "Tabs are not allowed as indentation"),
      {
        comma: P,
        found: I,
        spaceBefore: l,
        comment: u,
        hasNewline: m,
        anchor: h,
        tag: b,
        newlineAfterProp: S,
        end: T,
        start: E ?? T,
      }
    );
  }
  gI.resolveProps = DU;
});
var Xa = q((hI) => {
  "use strict";
  function Ku(e) {
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
          if (Ku(t.key) || Ku(t.value)) return !0;
        }
        return !1;
      default:
        return !0;
    }
  }
  hI.containsNewline = Ku;
});
var Wu = q((II) => {
  "use strict";
  var jU = Xa();
  function BU(e, t, n) {
    if (t?.type === "flow-collection") {
      let r = t.end[0];
      r.indent === e &&
        (r.source === "]" || r.source === "}") &&
        jU.containsNewline(t) &&
        n(r, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
    }
  }
  II.flowIndentCheck = BU;
});
var Yu = q((SI) => {
  "use strict";
  var bI = he();
  function VU(e, t, n) {
    let { uniqueKeys: r } = e.options;
    if (r === !1) return !1;
    let i = typeof r == "function" ? r : (s, o) => s === o || (bI.isScalar(s) && bI.isScalar(o) && s.value === o.value);
    return t.some((s) => i(s.key, n));
  }
  SI.mapIncludes = VU;
});
var vI = q((PI) => {
  "use strict";
  var _I = Wn(),
    $U = qn(),
    EI = Bs(),
    GU = Xa(),
    RI = Wu(),
    KU = Yu(),
    wI = "All mapping items must start at the same column";
  function WU({ composeNode: e, composeEmptyNode: t }, n, r, i, s) {
    let o = s?.nodeClass ?? $U.YAMLMap,
      a = new o(n.schema);
    n.atRoot && (n.atRoot = !1);
    let l = r.offset,
      c = null;
    for (let d of r.items) {
      let { start: u, key: f, sep: m, value: y } = d,
        g = EI.resolveProps(u, {
          indicator: "explicit-key-ind",
          next: f ?? m?.[0],
          offset: l,
          onError: i,
          parentIndent: r.indent,
          startOnNewline: !0,
        }),
        h = !g.found;
      if (h) {
        if (
          (f &&
            (f.type === "block-seq"
              ? i(l, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key")
              : "indent" in f && f.indent !== r.indent && i(l, "BAD_INDENT", wI)),
          !g.anchor && !g.tag && !m)
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
        (g.newlineAfterProp || GU.containsNewline(f)) &&
          i(f ?? u[u.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
      } else g.found?.indent !== r.indent && i(l, "BAD_INDENT", wI);
      n.atKey = !0;
      let b = g.end,
        S = f ? e(n, f, g, i) : t(n, b, u, null, g, i);
      (n.schema.compat && RI.flowIndentCheck(r.indent, f, i),
        (n.atKey = !1),
        KU.mapIncludes(n, a.items, S) && i(b, "DUPLICATE_KEY", "Map keys must be unique"));
      let P = EI.resolveProps(m ?? [], {
        indicator: "map-value-ind",
        next: y,
        offset: S.range[2],
        onError: i,
        parentIndent: r.indent,
        startOnNewline: !f || f.type === "block-scalar",
      });
      if (((l = P.end), P.found)) {
        h &&
          (y?.type === "block-map" &&
            !P.hasNewline &&
            i(l, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"),
          n.options.strict &&
            g.start < P.found.offset - 1024 &&
            i(
              S.range,
              "KEY_OVER_1024_CHARS",
              "The : indicator must be at most 1024 chars after the start of an implicit block mapping key",
            ));
        let I = y ? e(n, y, P, i) : t(n, l, m, null, P, i);
        (n.schema.compat && RI.flowIndentCheck(r.indent, y, i), (l = I.range[2]));
        let E = new _I.Pair(S, I);
        (n.options.keepSourceTokens && (E.srcToken = d), a.items.push(E));
      } else {
        (h && i(S.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"),
          P.comment &&
            (S.comment
              ? (S.comment +=
                  `
` + P.comment)
              : (S.comment = P.comment)));
        let I = new _I.Pair(S);
        (n.options.keepSourceTokens && (I.srcToken = d), a.items.push(I));
      }
    }
    return (
      c && c < l && i(c, "IMPOSSIBLE", "Map comment with trailing content"),
      (a.range = [r.offset, l, c ?? l]),
      a
    );
  }
  PI.resolveBlockMap = WU;
});
var TI = q((xI) => {
  "use strict";
  var YU = zn(),
    qU = Bs(),
    zU = Wu();
  function HU({ composeNode: e, composeEmptyNode: t }, n, r, i, s) {
    let o = s?.nodeClass ?? YU.YAMLSeq,
      a = new o(n.schema);
    (n.atRoot && (n.atRoot = !1), n.atKey && (n.atKey = !1));
    let l = r.offset,
      c = null;
    for (let { start: d, value: u } of r.items) {
      let f = qU.resolveProps(d, {
        indicator: "seq-item-ind",
        next: u,
        offset: l,
        onError: i,
        parentIndent: r.indent,
        startOnNewline: !0,
      });
      if (!f.found)
        if (f.anchor || f.tag || u)
          u?.type === "block-seq"
            ? i(f.end, "BAD_INDENT", "All sequence items must start at the same column")
            : i(l, "MISSING_CHAR", "Sequence item without - indicator");
        else {
          ((c = f.end), f.comment && (a.comment = f.comment));
          continue;
        }
      let m = u ? e(n, u, f, i) : t(n, f.end, d, null, f, i);
      (n.schema.compat && zU.flowIndentCheck(r.indent, u, i), (l = m.range[2]), a.items.push(m));
    }
    return ((a.range = [r.offset, l, c ?? l]), a);
  }
  xI.resolveBlockSeq = HU;
});
var _i = q((kI) => {
  "use strict";
  function QU(e, t, n, r) {
    let i = "";
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
            n && !s && r(a, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            let d = l.substring(1) || " ";
            (i ? (i += o + d) : (i = d), (o = ""));
            break;
          }
          case "newline":
            (i && (o += l), (s = !0));
            break;
          default:
            r(a, "UNEXPECTED_TOKEN", `Unexpected ${c} at node end`);
        }
        t += l.length;
      }
    }
    return { comment: i, offset: t };
  }
  kI.resolveEnd = QU;
});
var LI = q((AI) => {
  "use strict";
  var XU = he(),
    JU = Wn(),
    NI = qn(),
    ZU = zn(),
    eA = _i(),
    UI = Bs(),
    tA = Xa(),
    nA = Yu(),
    qu = "Block collections are not allowed within flow collections",
    zu = (e) => e && (e.type === "block-map" || e.type === "block-seq");
  function rA({ composeNode: e, composeEmptyNode: t }, n, r, i, s) {
    let o = r.start.source === "{",
      a = o ? "flow map" : "flow sequence",
      l = s?.nodeClass ?? (o ? NI.YAMLMap : ZU.YAMLSeq),
      c = new l(n.schema);
    c.flow = !0;
    let d = n.atRoot;
    (d && (n.atRoot = !1), n.atKey && (n.atKey = !1));
    let u = r.offset + r.start.source.length;
    for (let h = 0; h < r.items.length; ++h) {
      let b = r.items[h],
        { start: S, key: P, sep: I, value: E } = b,
        w = UI.resolveProps(S, {
          flow: a,
          indicator: "explicit-key-ind",
          next: P ?? I?.[0],
          offset: u,
          onError: i,
          parentIndent: r.indent,
          startOnNewline: !1,
        });
      if (!w.found) {
        if (!w.anchor && !w.tag && !I && !E) {
          (h === 0 && w.comma
            ? i(w.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`)
            : h < r.items.length - 1 && i(w.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${a}`),
            w.comment &&
              (c.comment
                ? (c.comment +=
                    `
` + w.comment)
                : (c.comment = w.comment)),
            (u = w.end));
          continue;
        }
        !o &&
          n.options.strict &&
          tA.containsNewline(P) &&
          i(P, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
      }
      if (h === 0) w.comma && i(w.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${a}`);
      else if ((w.comma || i(w.start, "MISSING_CHAR", `Missing , between ${a} items`), w.comment)) {
        let T = "";
        e: for (let x of S)
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
          (XU.isPair(x) && (x = x.value ?? x.key),
            x.comment
              ? (x.comment +=
                  `
` + T)
              : (x.comment = T),
            (w.comment = w.comment.substring(T.length + 1)));
        }
      }
      if (!o && !I && !w.found) {
        let T = E ? e(n, E, w, i) : t(n, w.end, I, null, w, i);
        (c.items.push(T), (u = T.range[2]), zu(E) && i(T.range, "BLOCK_IN_FLOW", qu));
      } else {
        n.atKey = !0;
        let T = w.end,
          x = P ? e(n, P, w, i) : t(n, T, S, null, w, i);
        (zu(P) && i(x.range, "BLOCK_IN_FLOW", qu), (n.atKey = !1));
        let O = UI.resolveProps(I ?? [], {
          flow: a,
          indicator: "map-value-ind",
          next: E,
          offset: x.range[2],
          onError: i,
          parentIndent: r.indent,
          startOnNewline: !1,
        });
        if (O.found) {
          if (!o && !w.found && n.options.strict) {
            if (I)
              for (let K of I) {
                if (K === O.found) break;
                if (K.type === "newline") {
                  i(K, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                  break;
                }
              }
            w.start < O.found.offset - 1024 &&
              i(
                O.found,
                "KEY_OVER_1024_CHARS",
                "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key",
              );
          }
        } else
          E &&
            ("source" in E && E.source?.[0] === ":"
              ? i(E, "MISSING_CHAR", `Missing space after : in ${a}`)
              : i(O.start, "MISSING_CHAR", `Missing , or : between ${a} items`));
        let F = E ? e(n, E, O, i) : O.found ? t(n, O.end, I, null, O, i) : null;
        F
          ? zu(E) && i(F.range, "BLOCK_IN_FLOW", qu)
          : O.comment &&
            (x.comment
              ? (x.comment +=
                  `
` + O.comment)
              : (x.comment = O.comment));
        let Y = new JU.Pair(x, F);
        if ((n.options.keepSourceTokens && (Y.srcToken = b), o)) {
          let K = c;
          (nA.mapIncludes(n, K.items, x) && i(T, "DUPLICATE_KEY", "Map keys must be unique"), K.items.push(Y));
        } else {
          let K = new NI.YAMLMap(n.schema);
          ((K.flow = !0), K.items.push(Y));
          let _ = (F ?? x).range;
          ((K.range = [x.range[0], _[1], _[2]]), c.items.push(K));
        }
        u = F ? F.range[2] : O.end;
      }
    }
    let f = o ? "}" : "]",
      [m, ...y] = r.end,
      g = u;
    if (m?.source === f) g = m.offset + m.source.length;
    else {
      let h = a[0].toUpperCase() + a.substring(1),
        b = d
          ? `${h} must end with a ${f}`
          : `${h} in block collection must be sufficiently indented and end with a ${f}`;
      (i(u, d ? "MISSING_CHAR" : "BAD_INDENT", b), m && m.source.length !== 1 && y.unshift(m));
    }
    if (y.length > 0) {
      let h = eA.resolveEnd(y, g, n.options.strict, i);
      (h.comment &&
        (c.comment
          ? (c.comment +=
              `
` + h.comment)
          : (c.comment = h.comment)),
        (c.range = [r.offset, g, h.offset]));
    } else c.range = [r.offset, g, g];
    return c;
  }
  AI.resolveFlowCollection = rA;
});
var CI = q((OI) => {
  "use strict";
  var iA = he(),
    sA = Fe(),
    oA = qn(),
    aA = zn(),
    lA = vI(),
    cA = TI(),
    dA = LI();
  function Hu(e, t, n, r, i, s) {
    let o =
        n.type === "block-map"
          ? lA.resolveBlockMap(e, t, n, r, s)
          : n.type === "block-seq"
            ? cA.resolveBlockSeq(e, t, n, r, s)
            : dA.resolveFlowCollection(e, t, n, r, s),
      a = o.constructor;
    return i === "!" || i === a.tagName ? ((o.tag = a.tagName), o) : (i && (o.tag = i), o);
  }
  function uA(e, t, n, r, i) {
    let s = r.tag,
      o = s ? t.directives.tagName(s.source, (f) => i(s, "TAG_RESOLVE_FAILED", f)) : null;
    if (n.type === "block-seq") {
      let { anchor: f, newlineAfterProp: m } = r,
        y = f && s ? (f.offset > s.offset ? f : s) : (f ?? s);
      y && (!m || m.offset < y.offset) && i(y, "MISSING_CHAR", "Missing newline after block sequence props");
    }
    let a = n.type === "block-map" ? "map" : n.type === "block-seq" ? "seq" : n.start.source === "{" ? "map" : "seq";
    if (!s || !o || o === "!" || (o === oA.YAMLMap.tagName && a === "map") || (o === aA.YAMLSeq.tagName && a === "seq"))
      return Hu(e, t, n, i, o);
    let l = t.schema.tags.find((f) => f.tag === o && f.collection === a);
    if (!l) {
      let f = t.schema.knownTags[o];
      if (f?.collection === a) (t.schema.tags.push(Object.assign({}, f, { default: !1 })), (l = f));
      else
        return (
          f
            ? i(
                s,
                "BAD_COLLECTION_TYPE",
                `${f.tag} used for ${a} collection, but expects ${f.collection ?? "scalar"}`,
                !0,
              )
            : i(s, "TAG_RESOLVE_FAILED", `Unresolved tag: ${o}`, !0),
          Hu(e, t, n, i, o)
        );
    }
    let c = Hu(e, t, n, i, o, l),
      d = l.resolve?.(c, (f) => i(s, "TAG_RESOLVE_FAILED", f), t.options) ?? c,
      u = iA.isNode(d) ? d : new sA.Scalar(d);
    return ((u.range = c.range), (u.tag = o), l?.format && (u.format = l.format), u);
  }
  OI.composeCollection = uA;
});
var Xu = q((MI) => {
  "use strict";
  var Qu = Fe();
  function fA(e, t, n) {
    let r = t.offset,
      i = mA(t, e.options.strict, n);
    if (!i) return { value: "", type: null, comment: "", range: [r, r, r] };
    let s = i.mode === ">" ? Qu.Scalar.BLOCK_FOLDED : Qu.Scalar.BLOCK_LITERAL,
      o = t.source ? yA(t.source) : [],
      a = o.length;
    for (let g = o.length - 1; g >= 0; --g) {
      let h = o[g][1];
      if (h === "" || h === "\r") a = g;
      else break;
    }
    if (a === 0) {
      let g =
          i.chomp === "+" && o.length > 0
            ? `
`.repeat(Math.max(1, o.length - 1))
            : "",
        h = r + i.length;
      return (t.source && (h += t.source.length), { value: g, type: s, comment: i.comment, range: [r, h, h] });
    }
    let l = t.indent + i.indent,
      c = t.offset + i.length,
      d = 0;
    for (let g = 0; g < a; ++g) {
      let [h, b] = o[g];
      if (b === "" || b === "\r") i.indent === 0 && h.length > l && (l = h.length);
      else {
        (h.length < l &&
          n(
            c + h.length,
            "MISSING_CHAR",
            "Block scalars with more-indented leading empty lines must use an explicit indentation indicator",
          ),
          i.indent === 0 && (l = h.length),
          (d = g),
          l === 0 && !e.atRoot && n(c, "BAD_INDENT", "Block scalar values in collections must be indented"));
        break;
      }
      c += h.length + b.length + 1;
    }
    for (let g = o.length - 1; g >= a; --g) o[g][0].length > l && (a = g + 1);
    let u = "",
      f = "",
      m = !1;
    for (let g = 0; g < d; ++g)
      u +=
        o[g][0].slice(l) +
        `
`;
    for (let g = d; g < a; ++g) {
      let [h, b] = o[g];
      c += h.length + b.length + 1;
      let S = b[b.length - 1] === "\r";
      if ((S && (b = b.slice(0, -1)), b && h.length < l)) {
        let I = `Block scalar lines must not be less indented than their ${i.indent ? "explicit indentation indicator" : "first line"}`;
        (n(c - b.length - (S ? 2 : 1), "BAD_INDENT", I), (h = ""));
      }
      s === Qu.Scalar.BLOCK_LITERAL
        ? ((u += f + h.slice(l) + b),
          (f = `
`))
        : h.length > l || b[0] === "	"
          ? (f === " "
              ? (f = `
`)
              : !m &&
                f ===
                  `
` &&
                (f = `

`),
            (u += f + h.slice(l) + b),
            (f = `
`),
            (m = !0))
          : b === ""
            ? f ===
              `
`
              ? (u += `
`)
              : (f = `
`)
            : ((u += f + b), (f = " "), (m = !1));
    }
    switch (i.chomp) {
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
    let y = r + i.length + t.source.length;
    return { value: u, type: s, comment: i.comment, range: [r, y, y] };
  }
  function mA({ offset: e, props: t }, n, r) {
    if (t[0].type !== "block-scalar-header") return (r(t[0], "IMPOSSIBLE", "Block scalar header not found"), null);
    let { source: i } = t[0],
      s = i[0],
      o = 0,
      a = "",
      l = -1;
    for (let f = 1; f < i.length; ++f) {
      let m = i[f];
      if (!a && (m === "-" || m === "+")) a = m;
      else {
        let y = Number(m);
        !o && y ? (o = y) : l === -1 && (l = e + f);
      }
    }
    l !== -1 && r(l, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${i}`);
    let c = !1,
      d = "",
      u = i.length;
    for (let f = 1; f < t.length; ++f) {
      let m = t[f];
      switch (m.type) {
        case "space":
          c = !0;
        case "newline":
          u += m.source.length;
          break;
        case "comment":
          (n && !c && r(m, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"),
            (u += m.source.length),
            (d = m.source.substring(1)));
          break;
        case "error":
          (r(m, "UNEXPECTED_TOKEN", m.message), (u += m.source.length));
          break;
        default: {
          let y = `Unexpected token in block scalar header: ${m.type}`;
          r(m, "UNEXPECTED_TOKEN", y);
          let g = m.source;
          g && typeof g == "string" && (u += g.length);
        }
      }
    }
    return { mode: s, indent: o, chomp: a, comment: d, length: u };
  }
  function yA(e) {
    let t = e.split(/\n( *)/),
      n = t[0],
      r = n.match(/^( *)/),
      s = [r?.[1] ? [r[1], n.slice(r[1].length)] : ["", n]];
    for (let o = 1; o < t.length; o += 2) s.push([t[o], t[o + 1]]);
    return s;
  }
  MI.resolveBlockScalar = fA;
});
var Zu = q((DI) => {
  "use strict";
  var Ju = Fe(),
    pA = _i();
  function gA(e, t, n) {
    let { offset: r, type: i, source: s, end: o } = e,
      a,
      l,
      c = (f, m, y) => n(r + f, m, y);
    switch (i) {
      case "scalar":
        ((a = Ju.Scalar.PLAIN), (l = hA(s, c)));
        break;
      case "single-quoted-scalar":
        ((a = Ju.Scalar.QUOTE_SINGLE), (l = IA(s, c)));
        break;
      case "double-quoted-scalar":
        ((a = Ju.Scalar.QUOTE_DOUBLE), (l = bA(s, c)));
        break;
      default:
        return (
          n(e, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${i}`),
          { value: "", type: null, comment: "", range: [r, r + s.length, r + s.length] }
        );
    }
    let d = r + s.length,
      u = pA.resolveEnd(o, d, t, n);
    return { value: l, type: a, comment: u.comment, range: [r, d, u.offset] };
  }
  function hA(e, t) {
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
    return (n && t(0, "BAD_SCALAR_START", `Plain value cannot start with ${n}`), FI(e));
  }
  function IA(e, t) {
    return (
      (e[e.length - 1] !== "'" || e.length === 1) && t(e.length, "MISSING_CHAR", "Missing closing 'quote"),
      FI(e.slice(1, -1)).replace(/''/g, "'")
    );
  }
  function FI(e) {
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
    let r = t.exec(e);
    if (!r) return e;
    let i = r[1],
      s = " ",
      o = t.lastIndex;
    for (n.lastIndex = o; (r = n.exec(e));)
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
    return ((a.lastIndex = o), (r = a.exec(e)), i + s + (r?.[1] ?? ""));
  }
  function bA(e, t) {
    let n = "";
    for (let r = 1; r < e.length - 1; ++r) {
      let i = e[r];
      if (!(
        i === "\r" &&
        e[r + 1] ===
          `
`
      ))
        if (
          i ===
          `
`
        ) {
          let { fold: s, offset: o } = SA(e, r);
          ((n += s), (r = o));
        } else if (i === "\\") {
          let s = e[++r],
            o = _A[s];
          if (o) n += o;
          else if (
            s ===
            `
`
          )
            for (s = e[r + 1]; s === " " || s === "	";) s = e[++r + 1];
          else if (
            s === "\r" &&
            e[r + 1] ===
              `
`
          )
            for (s = e[++r + 1]; s === " " || s === "	";) s = e[++r + 1];
          else if (s === "x" || s === "u" || s === "U") {
            let a = s === "x" ? 2 : s === "u" ? 4 : 8;
            ((n += EA(e, r + 1, a, t)), (r += a));
          } else {
            let a = e.substr(r - 1, 2);
            (t(r - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), (n += a));
          }
        } else if (i === " " || i === "	") {
          let s = r,
            o = e[r + 1];
          for (; o === " " || o === "	";) o = e[++r + 1];
          o !==
            `
` &&
            !(
              o === "\r" &&
              e[r + 2] ===
                `
`
            ) &&
            (n += r > s ? e.slice(s, r + 1) : i);
        } else n += i;
    }
    return ((e[e.length - 1] !== '"' || e.length === 1) && t(e.length, "MISSING_CHAR", 'Missing closing "quote'), n);
  }
  function SA(e, t) {
    let n = "",
      r = e[t + 1];
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
        e[t + 2] !==
          `
`
      );
    )
      (r ===
        `
` &&
        (n += `
`),
        (t += 1),
        (r = e[t + 1]));
    return (n || (n = " "), { fold: n, offset: t });
  }
  var _A = {
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
  function EA(e, t, n, r) {
    let i = e.substr(t, n),
      o = i.length === n && /^[0-9a-fA-F]+$/.test(i) ? parseInt(i, 16) : NaN;
    try {
      return String.fromCodePoint(o);
    } catch {
      let a = e.substr(t - 2, n + 2);
      return (r(t - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${a}`), a);
    }
  }
  DI.resolveFlowScalar = gA;
});
var VI = q((BI) => {
  "use strict";
  var br = he(),
    jI = Fe(),
    RA = Xu(),
    wA = Zu();
  function PA(e, t, n, r) {
    let {
        value: i,
        type: s,
        comment: o,
        range: a,
      } = t.type === "block-scalar" ? RA.resolveBlockScalar(e, t, r) : wA.resolveFlowScalar(t, e.options.strict, r),
      l = n ? e.directives.tagName(n.source, (u) => r(n, "TAG_RESOLVE_FAILED", u)) : null,
      c;
    e.options.stringKeys && e.atKey
      ? (c = e.schema[br.SCALAR])
      : l
        ? (c = vA(e.schema, i, l, n, r))
        : t.type === "scalar"
          ? (c = xA(e, i, t, r))
          : (c = e.schema[br.SCALAR]);
    let d;
    try {
      let u = c.resolve(i, (f) => r(n ?? t, "TAG_RESOLVE_FAILED", f), e.options);
      d = br.isScalar(u) ? u : new jI.Scalar(u);
    } catch (u) {
      let f = u instanceof Error ? u.message : String(u);
      (r(n ?? t, "TAG_RESOLVE_FAILED", f), (d = new jI.Scalar(i)));
    }
    return (
      (d.range = a),
      (d.source = i),
      s && (d.type = s),
      l && (d.tag = l),
      c.format && (d.format = c.format),
      o && (d.comment = o),
      d
    );
  }
  function vA(e, t, n, r, i) {
    if (n === "!") return e[br.SCALAR];
    let s = [];
    for (let a of e.tags)
      if (!a.collection && a.tag === n)
        if (a.default && a.test) s.push(a);
        else return a;
    for (let a of s) if (a.test?.test(t)) return a;
    let o = e.knownTags[n];
    return o && !o.collection
      ? (e.tags.push(Object.assign({}, o, { default: !1, test: void 0 })), o)
      : (i(r, "TAG_RESOLVE_FAILED", `Unresolved tag: ${n}`, n !== "tag:yaml.org,2002:str"), e[br.SCALAR]);
  }
  function xA({ atKey: e, directives: t, schema: n }, r, i, s) {
    let o = n.tags.find((a) => (a.default === !0 || (e && a.default === "key")) && a.test?.test(r)) || n[br.SCALAR];
    if (n.compat) {
      let a = n.compat.find((l) => l.default && l.test?.test(r)) ?? n[br.SCALAR];
      if (o.tag !== a.tag) {
        let l = t.tagString(o.tag),
          c = t.tagString(a.tag),
          d = `Value may be parsed as either ${l} or ${c}`;
        s(i, "TAG_RESOLVE_FAILED", d, !0);
      }
    }
    return o;
  }
  BI.composeScalar = PA;
});
var GI = q(($I) => {
  "use strict";
  function TA(e, t, n) {
    if (t) {
      n ?? (n = t.length);
      for (let r = n - 1; r >= 0; --r) {
        let i = t[r];
        switch (i.type) {
          case "space":
          case "comment":
          case "newline":
            e -= i.source.length;
            continue;
        }
        for (i = t[++r]; i?.type === "space";) ((e += i.source.length), (i = t[++r]));
        break;
      }
    }
    return e;
  }
  $I.emptyScalarPosition = TA;
});
var YI = q((tf) => {
  "use strict";
  var kA = Ss(),
    NA = he(),
    UA = CI(),
    KI = VI(),
    AA = _i(),
    LA = GI(),
    OA = { composeNode: WI, composeEmptyNode: ef };
  function WI(e, t, n, r) {
    let i = e.atKey,
      { spaceBefore: s, comment: o, anchor: a, tag: l } = n,
      c,
      d = !0;
    switch (t.type) {
      case "alias":
        ((c = CA(e, t, r)), (a || l) && r(t, "ALIAS_PROPS", "An alias node must not specify any properties"));
        break;
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "block-scalar":
        ((c = KI.composeScalar(e, t, l, r)), a && (c.anchor = a.source.substring(1)));
        break;
      case "block-map":
      case "block-seq":
      case "flow-collection":
        try {
          ((c = UA.composeCollection(OA, e, t, n, r)), a && (c.anchor = a.source.substring(1)));
        } catch (u) {
          let f = u instanceof Error ? u.message : String(u);
          r(t, "RESOURCE_EXHAUSTION", f);
        }
        break;
      default: {
        let u = t.type === "error" ? t.message : `Unsupported token (type: ${t.type})`;
        (r(t, "UNEXPECTED_TOKEN", u), (d = !1));
      }
    }
    return (
      c ?? (c = ef(e, t.offset, void 0, null, n, r)),
      a && c.anchor === "" && r(a, "BAD_ALIAS", "Anchor cannot be an empty string"),
      i &&
        e.options.stringKeys &&
        (!NA.isScalar(c) || typeof c.value != "string" || (c.tag && c.tag !== "tag:yaml.org,2002:str")) &&
        r(l ?? t, "NON_STRING_KEY", "With stringKeys, all keys must be strings"),
      s && (c.spaceBefore = !0),
      o && (t.type === "scalar" && t.source === "" ? (c.comment = o) : (c.commentBefore = o)),
      e.options.keepSourceTokens && d && (c.srcToken = t),
      c
    );
  }
  function ef(e, t, n, r, { spaceBefore: i, comment: s, anchor: o, tag: a, end: l }, c) {
    let d = { type: "scalar", offset: LA.emptyScalarPosition(t, n, r), indent: -1, source: "" },
      u = KI.composeScalar(e, d, a, c);
    return (
      o &&
        ((u.anchor = o.source.substring(1)), u.anchor === "" && c(o, "BAD_ALIAS", "Anchor cannot be an empty string")),
      i && (u.spaceBefore = !0),
      s && ((u.comment = s), (u.range[2] = l)),
      u
    );
  }
  function CA({ options: e }, { offset: t, source: n, end: r }, i) {
    let s = new kA.Alias(n.substring(1));
    (s.source === "" && i(t, "BAD_ALIAS", "Alias cannot be an empty string"),
      s.source.endsWith(":") && i(t + n.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0));
    let o = t + n.length,
      a = AA.resolveEnd(r, o, e.strict, i);
    return ((s.range = [t, o, a.offset]), a.comment && (s.comment = a.comment), s);
  }
  tf.composeEmptyNode = ef;
  tf.composeNode = WI;
});
var HI = q((zI) => {
  "use strict";
  var MA = Ms(),
    qI = YI(),
    FA = _i(),
    DA = Bs();
  function jA(e, t, { offset: n, start: r, value: i, end: s }, o) {
    let a = Object.assign({ _directives: t }, e),
      l = new MA.Document(void 0, a),
      c = { atKey: !1, atRoot: !0, directives: l.directives, options: l.options, schema: l.schema },
      d = DA.resolveProps(r, {
        indicator: "doc-start",
        next: i ?? s?.[0],
        offset: n,
        onError: o,
        parentIndent: 0,
        startOnNewline: !0,
      });
    (d.found &&
      ((l.directives.docStart = !0),
      i &&
        (i.type === "block-map" || i.type === "block-seq") &&
        !d.hasNewline &&
        o(d.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")),
      (l.contents = i ? qI.composeNode(c, i, d, o) : qI.composeEmptyNode(c, d.end, r, null, d, o)));
    let u = l.contents.range[2],
      f = FA.resolveEnd(s, u, !1, o);
    return (f.comment && (l.comment = f.comment), (l.range = [n, u, f.offset]), l);
  }
  zI.composeDoc = jA;
});
var rf = q((JI) => {
  "use strict";
  var BA = Lo("process"),
    VA = $d(),
    $A = Ms(),
    Vs = js(),
    QI = he(),
    GA = HI(),
    KA = _i();
  function $s(e) {
    if (typeof e == "number") return [e, e + 1];
    if (Array.isArray(e)) return e.length === 2 ? e : [e[0], e[1]];
    let { offset: t, source: n } = e;
    return [t, t + (typeof n == "string" ? n.length : 1)];
  }
  function XI(e) {
    let t = "",
      n = !1,
      r = !1;
    for (let i = 0; i < e.length; ++i) {
      let s = e[i];
      switch (s[0]) {
        case "#":
          ((t +=
            (t === ""
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
          (e[i + 1]?.[0] !== "#" && (i += 1), (n = !1));
          break;
        default:
          (n || (r = !0), (n = !1));
      }
    }
    return { comment: t, afterEmptyLine: r };
  }
  var nf = class {
    constructor(t = {}) {
      ((this.doc = null),
        (this.atDirectives = !1),
        (this.prelude = []),
        (this.errors = []),
        (this.warnings = []),
        (this.onError = (n, r, i, s) => {
          let o = $s(n);
          s ? this.warnings.push(new Vs.YAMLWarning(o, r, i)) : this.errors.push(new Vs.YAMLParseError(o, r, i));
        }),
        (this.directives = new VA.Directives({ version: t.version || "1.2" })),
        (this.options = t));
    }
    decorate(t, n) {
      let { comment: r, afterEmptyLine: i } = XI(this.prelude);
      if (r) {
        let s = t.contents;
        if (n)
          t.comment = t.comment
            ? `${t.comment}
${r}`
            : r;
        else if (i || t.directives.docStart || !s) t.commentBefore = r;
        else if (QI.isCollection(s) && !s.flow && s.items.length > 0) {
          let o = s.items[0];
          QI.isPair(o) && (o = o.key);
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
        for (let s = 0; s < this.errors.length; ++s) t.errors.push(this.errors[s]);
        for (let s = 0; s < this.warnings.length; ++s) t.warnings.push(this.warnings[s]);
      } else ((t.errors = this.errors), (t.warnings = this.warnings));
      ((this.prelude = []), (this.errors = []), (this.warnings = []));
    }
    streamInfo() {
      return {
        comment: XI(this.prelude).comment,
        directives: this.directives,
        errors: this.errors,
        warnings: this.warnings,
      };
    }
    *compose(t, n = !1, r = -1) {
      for (let i of t) yield* this.next(i);
      yield* this.end(n, r);
    }
    *next(t) {
      switch ((BA.env.LOG_STREAM && console.dir(t, { depth: null }), t.type)) {
        case "directive":
          (this.directives.add(t.source, (n, r, i) => {
            let s = $s(t);
            ((s[0] += n), this.onError(s, "BAD_DIRECTIVE", r, i));
          }),
            this.prelude.push(t.source),
            (this.atDirectives = !0));
          break;
        case "document": {
          let n = GA.composeDoc(this.options, this.directives, t, this.onError);
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
            r = new Vs.YAMLParseError($s(t), "UNEXPECTED_TOKEN", n);
          this.atDirectives || !this.doc ? this.errors.push(r) : this.doc.errors.push(r);
          break;
        }
        case "doc-end": {
          if (!this.doc) {
            let r = "Unexpected doc-end without preceding document";
            this.errors.push(new Vs.YAMLParseError($s(t), "UNEXPECTED_TOKEN", r));
            break;
          }
          this.doc.directives.docEnd = !0;
          let n = KA.resolveEnd(t.end, t.offset + t.source.length, this.doc.options.strict, this.onError);
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
          this.errors.push(new Vs.YAMLParseError($s(t), "UNEXPECTED_TOKEN", `Unsupported token ${t.type}`));
      }
    }
    *end(t = !1, n = -1) {
      if (this.doc) (this.decorate(this.doc, !0), yield this.doc, (this.doc = null));
      else if (t) {
        let r = Object.assign({ _directives: this.directives }, this.options),
          i = new $A.Document(void 0, r);
        (this.atDirectives && this.onError(n, "MISSING_CHAR", "Missing directives-end indicator line"),
          (i.range = [0, n, n]),
          this.decorate(i, !1),
          yield i);
      }
    }
  };
  JI.Composer = nf;
});
var tb = q((Ja) => {
  "use strict";
  var WA = Xu(),
    YA = Zu(),
    qA = js(),
    ZI = Ps();
  function zA(e, t = !0, n) {
    if (e) {
      let r = (i, s, o) => {
        let a = typeof i == "number" ? i : Array.isArray(i) ? i[0] : i.offset;
        if (n) n(a, s, o);
        else throw new qA.YAMLParseError([a, a + 1], s, o);
      };
      switch (e.type) {
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return YA.resolveFlowScalar(e, t, r);
        case "block-scalar":
          return WA.resolveBlockScalar({ options: { strict: t } }, e, r);
      }
    }
    return null;
  }
  function HA(e, t) {
    let { implicitKey: n = !1, indent: r, inFlow: i = !1, offset: s = -1, type: o = "PLAIN" } = t,
      a = ZI.stringifyString(
        { type: o, value: e },
        { implicitKey: n, indent: r > 0 ? " ".repeat(r) : "", inFlow: i, options: { blockQuote: !0, lineWidth: -1 } },
      ),
      l = t.end ?? [
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
        let c = a.indexOf(`
`),
          d = a.substring(0, c),
          u =
            a.substring(c + 1) +
            `
`,
          f = [{ type: "block-scalar-header", offset: s, indent: r, source: d }];
        return (
          eb(f, l) ||
            f.push({
              type: "newline",
              offset: -1,
              indent: r,
              source: `
`,
            }),
          { type: "block-scalar", offset: s, indent: r, props: f, source: u }
        );
      }
      case '"':
        return { type: "double-quoted-scalar", offset: s, indent: r, source: a, end: l };
      case "'":
        return { type: "single-quoted-scalar", offset: s, indent: r, source: a, end: l };
      default:
        return { type: "scalar", offset: s, indent: r, source: a, end: l };
    }
  }
  function QA(e, t, n = {}) {
    let { afterKey: r = !1, implicitKey: i = !1, inFlow: s = !1, type: o } = n,
      a = "indent" in e ? e.indent : null;
    if ((r && typeof a == "number" && (a += 2), !o))
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
    let l = ZI.stringifyString(
      { type: o, value: t },
      {
        implicitKey: i || a === null,
        indent: a !== null && a > 0 ? " ".repeat(a) : "",
        inFlow: s,
        options: { blockQuote: !0, lineWidth: -1 },
      },
    );
    switch (l[0]) {
      case "|":
      case ">":
        XA(e, l);
        break;
      case '"':
        sf(e, l, "double-quoted-scalar");
        break;
      case "'":
        sf(e, l, "single-quoted-scalar");
        break;
      default:
        sf(e, l, "scalar");
    }
  }
  function XA(e, t) {
    let n = t.indexOf(`
`),
      r = t.substring(0, n),
      i =
        t.substring(n + 1) +
        `
`;
    if (e.type === "block-scalar") {
      let s = e.props[0];
      if (s.type !== "block-scalar-header") throw new Error("Invalid block scalar header");
      ((s.source = r), (e.source = i));
    } else {
      let { offset: s } = e,
        o = "indent" in e ? e.indent : -1,
        a = [{ type: "block-scalar-header", offset: s, indent: o, source: r }];
      eb(a, "end" in e ? e.end : void 0) ||
        a.push({
          type: "newline",
          offset: -1,
          indent: o,
          source: `
`,
        });
      for (let l of Object.keys(e)) l !== "type" && l !== "offset" && delete e[l];
      Object.assign(e, { type: "block-scalar", indent: o, props: a, source: i });
    }
  }
  function eb(e, t) {
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
  function sf(e, t, n) {
    switch (e.type) {
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        ((e.type = n), (e.source = t));
        break;
      case "block-scalar": {
        let r = e.props.slice(1),
          i = t.length;
        e.props[0].type === "block-scalar-header" && (i -= e.props[0].source.length);
        for (let s of r) s.offset += i;
        (delete e.props, Object.assign(e, { type: n, source: t, end: r }));
        break;
      }
      case "block-map":
      case "block-seq": {
        let i = {
          type: "newline",
          offset: e.offset + t.length,
          indent: e.indent,
          source: `
`,
        };
        (delete e.items, Object.assign(e, { type: n, source: t, end: [i] }));
        break;
      }
      default: {
        let r = "indent" in e ? e.indent : -1,
          i =
            "end" in e && Array.isArray(e.end)
              ? e.end.filter((s) => s.type === "space" || s.type === "comment" || s.type === "newline")
              : [];
        for (let s of Object.keys(e)) s !== "type" && s !== "offset" && delete e[s];
        Object.assign(e, { type: n, indent: r, source: t, end: i });
      }
    }
  }
  Ja.createScalarToken = HA;
  Ja.resolveAsScalar = zA;
  Ja.setScalarValue = QA;
});
var rb = q((nb) => {
  "use strict";
  var JA = (e) => ("type" in e ? el(e) : Za(e));
  function el(e) {
    switch (e.type) {
      case "block-scalar": {
        let t = "";
        for (let n of e.props) t += el(n);
        return t + e.source;
      }
      case "block-map":
      case "block-seq": {
        let t = "";
        for (let n of e.items) t += Za(n);
        return t;
      }
      case "flow-collection": {
        let t = e.start.source;
        for (let n of e.items) t += Za(n);
        for (let n of e.end) t += n.source;
        return t;
      }
      case "document": {
        let t = Za(e);
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
  function Za({ start: e, key: t, sep: n, value: r }) {
    let i = "";
    for (let s of e) i += s.source;
    if ((t && (i += el(t)), n)) for (let s of n) i += s.source;
    return (r && (i += el(r)), i);
  }
  nb.stringify = JA;
});
var ab = q((ob) => {
  "use strict";
  var of = Symbol("break visit"),
    ZA = Symbol("skip children"),
    ib = Symbol("remove item");
  function Sr(e, t) {
    ("type" in e && e.type === "document" && (e = { start: e.start, value: e.value }), sb(Object.freeze([]), e, t));
  }
  Sr.BREAK = of;
  Sr.SKIP = ZA;
  Sr.REMOVE = ib;
  Sr.itemAtPath = (e, t) => {
    let n = e;
    for (let [r, i] of t) {
      let s = n?.[r];
      if (s && "items" in s) n = s.items[i];
      else return;
    }
    return n;
  };
  Sr.parentCollection = (e, t) => {
    let n = Sr.itemAtPath(e, t.slice(0, -1)),
      r = t[t.length - 1][0],
      i = n?.[r];
    if (i && "items" in i) return i;
    throw new Error("Parent collection not found");
  };
  function sb(e, t, n) {
    let r = n(t, e);
    if (typeof r == "symbol") return r;
    for (let i of ["key", "value"]) {
      let s = t[i];
      if (s && "items" in s) {
        for (let o = 0; o < s.items.length; ++o) {
          let a = sb(Object.freeze(e.concat([[i, o]])), s.items[o], n);
          if (typeof a == "number") o = a - 1;
          else {
            if (a === of) return of;
            a === ib && (s.items.splice(o, 1), (o -= 1));
          }
        }
        typeof r == "function" && i === "key" && (r = r(t, e));
      }
    }
    return typeof r == "function" ? r(t, e) : r;
  }
  ob.visit = Sr;
});
var tl = q((at) => {
  "use strict";
  var af = tb(),
    eL = rb(),
    tL = ab(),
    lf = "\uFEFF",
    cf = "",
    df = "",
    uf = "",
    nL = (e) => !!e && "items" in e,
    rL = (e) =>
      !!e &&
      (e.type === "scalar" ||
        e.type === "single-quoted-scalar" ||
        e.type === "double-quoted-scalar" ||
        e.type === "block-scalar");
  function iL(e) {
    switch (e) {
      case lf:
        return "<BOM>";
      case cf:
        return "<DOC>";
      case df:
        return "<FLOW_END>";
      case uf:
        return "<SCALAR>";
      default:
        return JSON.stringify(e);
    }
  }
  function sL(e) {
    switch (e) {
      case lf:
        return "byte-order-mark";
      case cf:
        return "doc-mode";
      case df:
        return "flow-error-end";
      case uf:
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
  at.createScalarToken = af.createScalarToken;
  at.resolveAsScalar = af.resolveAsScalar;
  at.setScalarValue = af.setScalarValue;
  at.stringify = eL.stringify;
  at.visit = tL.visit;
  at.BOM = lf;
  at.DOCUMENT = cf;
  at.FLOW_END = df;
  at.SCALAR = uf;
  at.isCollection = nL;
  at.isScalar = rL;
  at.prettyToken = iL;
  at.tokenType = sL;
});
var yf = q((cb) => {
  "use strict";
  var Gs = tl();
  function Dt(e) {
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
  var lb = new Set("0123456789ABCDEFabcdef"),
    oL = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"),
    nl = new Set(",[]{}"),
    aL = new Set(` ,[]{}
\r	`),
    ff = (e) => !e || aL.has(e),
    mf = class {
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
        let r = this.next ?? "stream";
        for (; r && (n || this.hasChars(1));) r = yield* this.parseNext(r);
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
          let r = 0;
          for (; n === " ";) n = this.buffer[++r + t];
          if (n === "\r") {
            let i = this.buffer[r + t + 1];
            if (
              i ===
                `
` ||
              (!i && !this.atEnd)
            )
              return t + r + 1;
          }
          return n ===
            `
` ||
            r >= this.indentNext ||
            (!n && !this.atEnd)
            ? t + r
            : -1;
        }
        if (n === "-" || n === ".") {
          let r = this.buffer.substr(t, 3);
          if ((r === "---" || r === "...") && Dt(this.buffer[t + 3])) return -1;
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
        if ((t[0] === Gs.BOM && (yield* this.pushCount(1), (t = t.substring(1))), t[0] === "%")) {
          let n = t.length,
            r = t.indexOf("#");
          for (; r !== -1;) {
            let s = t[r - 1];
            if (s === " " || s === "	") {
              n = r - 1;
              break;
            } else r = t.indexOf("#", r + 1);
          }
          for (;;) {
            let s = t[n - 1];
            if (s === " " || s === "	") n -= 1;
            else break;
          }
          let i = (yield* this.pushCount(n)) + (yield* this.pushSpaces(!0));
          return (yield* this.pushCount(t.length - i), this.pushNewline(), "stream");
        }
        if (this.atLineEnd()) {
          let n = yield* this.pushSpaces(!0);
          return (yield* this.pushCount(t.length - n), yield* this.pushNewline(), "stream");
        }
        return (yield Gs.DOCUMENT, yield* this.parseLineStart());
      }
      *parseLineStart() {
        let t = this.charAt(0);
        if (!t && !this.atEnd) return this.setNext("line-start");
        if (t === "-" || t === ".") {
          if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
          let n = this.peek(3);
          if ((n === "---" || n === "...") && Dt(this.charAt(3)))
            return (
              yield* this.pushCount(3),
              (this.indentValue = 0),
              (this.indentNext = 0),
              n === "---" ? "doc" : "stream"
            );
        }
        return (
          (this.indentValue = yield* this.pushSpaces(!1)),
          this.indentNext > this.indentValue && !Dt(this.charAt(1)) && (this.indentNext = this.indentValue),
          yield* this.parseBlockStart()
        );
      }
      *parseBlockStart() {
        let [t, n] = this.peek(2);
        if (!n && !this.atEnd) return this.setNext("block-start");
        if ((t === "-" || t === "?" || t === ":") && Dt(n)) {
          let r = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
          return ((this.indentNext = this.indentValue + 1), (this.indentValue += r), "block-start");
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
            return (yield* this.pushUntil(ff), "doc");
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
          r = -1;
        do
          ((t = yield* this.pushNewline()),
            t > 0 ? ((n = yield* this.pushSpaces(!1)), (this.indentValue = r = n)) : (n = 0),
            (n += yield* this.pushSpaces(!0)));
        while (t + n > 0);
        let i = this.getLine();
        if (i === null) return this.setNext("flow");
        if (
          ((r !== -1 && r < this.indentNext && i[0] !== "#") ||
            (r === 0 && (i.startsWith("---") || i.startsWith("...")) && Dt(i[3]))) &&
          !(r === this.indentNext - 1 && this.flowLevel === 1 && (i[0] === "]" || i[0] === "}"))
        )
          return ((this.flowLevel = 0), yield Gs.FLOW_END, yield* this.parseLineStart());
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
            return (yield* this.pushUntil(ff), "flow");
          case '"':
          case "'":
            return ((this.flowKey = !0), yield* this.parseQuotedScalar());
          case ":": {
            let o = this.charAt(1);
            if (this.flowKey || Dt(o) || o === ",")
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
        let t = this.pos;
        for (;;) {
          let n = this.buffer[++t];
          if (n === "+") this.blockScalarKeep = !0;
          else if (n > "0" && n <= "9") this.blockScalarIndent = Number(n) - 1;
          else if (n !== "-") break;
        }
        return yield* this.pushUntil((n) => Dt(n) || n === "#");
      }
      *parseBlockScalar() {
        let t = this.pos - 1,
          n = 0,
          r;
        e: for (let s = this.pos; (r = this.buffer[s]); ++s)
          switch (r) {
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
        if (!r && !this.atEnd) return this.setNext("block-scalar");
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
        let i = t + 1;
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
          t = i - 1;
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
        return (yield Gs.SCALAR, yield* this.pushToIndex(t + 1, !0), yield* this.parseLineStart());
      }
      *parsePlainScalar() {
        let t = this.flowLevel > 0,
          n = this.pos - 1,
          r = this.pos - 1,
          i;
        for (; (i = this.buffer[++r]);)
          if (i === ":") {
            let s = this.buffer[r + 1];
            if (Dt(s) || (t && nl.has(s))) break;
            n = r;
          } else if (Dt(i)) {
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
              s === "#" || (t && nl.has(s)))
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
            if (t && nl.has(i)) break;
            n = r;
          }
        return !i && !this.atEnd
          ? this.setNext("plain-scalar")
          : (yield Gs.SCALAR, yield* this.pushToIndex(n + 1, !0), t ? "flow" : "doc");
      }
      *pushCount(t) {
        return t > 0 ? (yield this.buffer.substr(this.pos, t), (this.pos += t), t) : 0;
      }
      *pushToIndex(t, n) {
        let r = this.buffer.slice(this.pos, t);
        return r ? (yield r, (this.pos += r.length), r.length) : (n && (yield ""), 0);
      }
      *pushIndicators() {
        let t = 0;
        e: for (;;) {
          switch (this.charAt(0)) {
            case "!":
              ((t += yield* this.pushTag()), (t += yield* this.pushSpaces(!0)));
              continue e;
            case "&":
              ((t += yield* this.pushUntil(ff)), (t += yield* this.pushSpaces(!0)));
              continue e;
            case "-":
            case "?":
            case ":": {
              let n = this.flowLevel > 0,
                r = this.charAt(1);
              if (Dt(r) || (n && nl.has(r))) {
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
          for (; !Dt(n) && n !== ">";) n = this.buffer[++t];
          return yield* this.pushToIndex(n === ">" ? t + 1 : t, !1);
        } else {
          let t = this.pos + 1,
            n = this.buffer[t];
          for (; n;)
            if (oL.has(n)) n = this.buffer[++t];
            else if (n === "%" && lb.has(this.buffer[t + 1]) && lb.has(this.buffer[t + 2])) n = this.buffer[(t += 3)];
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
          r;
        do r = this.buffer[++n];
        while (r === " " || (t && r === "	"));
        let i = n - this.pos;
        return (i > 0 && (yield this.buffer.substr(this.pos, i), (this.pos = n)), i);
      }
      *pushUntil(t) {
        let n = this.pos,
          r = this.buffer[n];
        for (; !t(r);) r = this.buffer[++n];
        return yield* this.pushToIndex(n, !1);
      }
    };
  cb.Lexer = mf;
});
var gf = q((db) => {
  "use strict";
  var pf = class {
    constructor() {
      ((this.lineStarts = []),
        (this.addNewLine = (t) => this.lineStarts.push(t)),
        (this.linePos = (t) => {
          let n = 0,
            r = this.lineStarts.length;
          for (; n < r;) {
            let s = (n + r) >> 1;
            this.lineStarts[s] < t ? (n = s + 1) : (r = s);
          }
          if (this.lineStarts[n] === t) return { line: n + 1, col: 1 };
          if (n === 0) return { line: 0, col: t };
          let i = this.lineStarts[n - 1];
          return { line: n, col: t - i + 1 };
        }));
    }
  };
  db.LineCounter = pf;
});
var If = q((pb) => {
  "use strict";
  var lL = Lo("process"),
    ub = tl(),
    cL = yf();
  function Hn(e, t) {
    for (let n = 0; n < e.length; ++n) if (e[n].type === t) return !0;
    return !1;
  }
  function fb(e) {
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
  function yb(e) {
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
  function rl(e) {
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
  function Ei(e) {
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
  function il(e, t) {
    if (t.length < 1e5) Array.prototype.push.apply(e, t);
    else for (let n = 0; n < t.length; ++n) e.push(t[n]);
  }
  function mb(e) {
    if (e.start.type === "flow-seq-start")
      for (let t of e.items)
        t.sep &&
          !t.value &&
          !Hn(t.start, "explicit-key-ind") &&
          !Hn(t.sep, "map-value-ind") &&
          (t.key && (t.value = t.key),
          delete t.key,
          yb(t.value) ? (t.value.end ? il(t.value.end, t.sep) : (t.value.end = t.sep)) : il(t.start, t.sep),
          delete t.sep);
  }
  var hf = class {
    constructor(t) {
      ((this.atNewLine = !0),
        (this.atScalar = !1),
        (this.indent = 0),
        (this.offset = 0),
        (this.onKeyLine = !1),
        (this.stack = []),
        (this.source = ""),
        (this.type = ""),
        (this.lexer = new cL.Lexer()),
        (this.onNewLine = t));
    }
    *parse(t, n = !1) {
      this.onNewLine && this.offset === 0 && this.onNewLine(0);
      for (let r of this.lexer.lex(t, n)) yield* this.next(r);
      n || (yield* this.end());
    }
    *next(t) {
      if (((this.source = t), lL.env.LOG_TOKENS && console.log("|", ub.prettyToken(t)), this.atScalar)) {
        ((this.atScalar = !1), yield* this.step(), (this.offset += t.length));
        return;
      }
      let n = ub.tokenType(t);
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
        let r = `Not a YAML token: ${t}`;
        (yield* this.pop({ type: "error", offset: this.offset, message: r, source: t }), (this.offset += t.length));
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
        let r = this.peek(1);
        switch (
          (n.type === "block-scalar"
            ? (n.indent = "indent" in r ? r.indent : 0)
            : n.type === "flow-collection" && r.type === "document" && (n.indent = 0),
          n.type === "flow-collection" && mb(n),
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
            fb(i.start) === -1 &&
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
          fb(t.start) !== -1 ? (yield* this.pop(), yield* this.step()) : t.start.push(this.sourceToken);
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
        let n = rl(this.peek(2)),
          r = Ei(n),
          i;
        t.end ? ((i = t.end), i.push(this.sourceToken), delete t.end) : (i = [this.sourceToken]);
        let s = { type: "block-map", offset: t.offset, indent: t.indent, items: [{ start: r, key: t, sep: i }] };
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
            let r = "end" in n.value ? n.value.end : void 0;
            (Array.isArray(r) ? r[r.length - 1] : void 0)?.type === "comment"
              ? r?.push(this.sourceToken)
              : t.items.push({ start: [this.sourceToken] });
          } else n.sep ? n.sep.push(this.sourceToken) : n.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (n.value) t.items.push({ start: [this.sourceToken] });
          else if (n.sep) n.sep.push(this.sourceToken);
          else {
            if (this.atIndentedComment(n.start, t.indent)) {
              let i = t.items[t.items.length - 2]?.value?.end;
              if (Array.isArray(i)) {
                (il(i, n.start), i.push(this.sourceToken), t.items.pop());
                return;
              }
            }
            n.start.push(this.sourceToken);
          }
          return;
      }
      if (this.indent >= t.indent) {
        let r = !this.onKeyLine && this.indent === t.indent,
          i = r && (n.sep || n.explicitKey) && this.type !== "seq-item-ind",
          s = [];
        if (i && n.sep && !n.value) {
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
            i || n.value
              ? (s.push(this.sourceToken), t.items.push({ start: s }), (this.onKeyLine = !0))
              : n.sep
                ? n.sep.push(this.sourceToken)
                : n.start.push(this.sourceToken);
            return;
          case "explicit-key-ind":
            (!n.sep && !n.explicitKey
              ? (n.start.push(this.sourceToken), (n.explicitKey = !0))
              : i || n.value
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
                else if (Hn(n.sep, "map-value-ind"))
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: s, key: null, sep: [this.sourceToken] }],
                  });
                else if (yb(n.key) && !Hn(n.sep, "newline")) {
                  let o = Ei(n.start),
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
              else if (Hn(n.start, "newline")) Object.assign(n, { key: null, sep: [this.sourceToken] });
              else {
                let o = Ei(n.start);
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
                  ? t.items.push({ start: s, key: null, sep: [this.sourceToken] })
                  : Hn(n.sep, "map-value-ind")
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
                if (!n.explicitKey && n.sep && !Hn(n.sep, "newline")) {
                  yield* this.pop({
                    type: "error",
                    offset: this.offset,
                    message: "Unexpected block-seq-ind on same line with key",
                    source: this.source,
                  });
                  return;
                }
              } else r && t.items.push({ start: s });
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
            let r = "end" in n.value ? n.value.end : void 0;
            (Array.isArray(r) ? r[r.length - 1] : void 0)?.type === "comment"
              ? r?.push(this.sourceToken)
              : t.items.push({ start: [this.sourceToken] });
          } else n.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (n.value) t.items.push({ start: [this.sourceToken] });
          else {
            if (this.atIndentedComment(n.start, t.indent)) {
              let i = t.items[t.items.length - 2]?.value?.end;
              if (Array.isArray(i)) {
                (il(i, n.start), i.push(this.sourceToken), t.items.pop());
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
          n.value || Hn(n.start, "seq-item-ind")
            ? t.items.push({ start: [this.sourceToken] })
            : n.start.push(this.sourceToken);
          return;
      }
      if (this.indent > t.indent) {
        let r = this.startBlockValue(t);
        if (r) {
          this.stack.push(r);
          return;
        }
      }
      (yield* this.pop(), yield* this.step());
    }
    *flowCollection(t) {
      let n = t.items[t.items.length - 1];
      if (this.type === "flow-error-end") {
        let r;
        do (yield* this.pop(), (r = this.peek(1)));
        while (r?.type === "flow-collection");
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
            let i = this.flowScalar(this.type);
            !n || n.value
              ? t.items.push({ start: [], key: i, sep: [] })
              : n.sep
                ? this.stack.push(i)
                : Object.assign(n, { key: i, sep: [] });
            return;
          }
          case "flow-map-end":
          case "flow-seq-end":
            t.end.push(this.sourceToken);
            return;
        }
        let r = this.startBlockValue(t);
        r ? this.stack.push(r) : (yield* this.pop(), yield* this.step());
      } else {
        let r = this.peek(2);
        if (
          r.type === "block-map" &&
          ((this.type === "map-value-ind" && r.indent === t.indent) ||
            (this.type === "newline" && !r.items[r.items.length - 1].sep))
        )
          (yield* this.pop(), yield* this.step());
        else if (this.type === "map-value-ind" && r.type !== "flow-collection") {
          let i = rl(r),
            s = Ei(i);
          mb(t);
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
          let n = rl(t),
            r = Ei(n);
          return (
            r.push(this.sourceToken),
            { type: "block-map", offset: this.offset, indent: this.indent, items: [{ start: r, explicitKey: !0 }] }
          );
        }
        case "map-value-ind": {
          this.onKeyLine = !0;
          let n = rl(t),
            r = Ei(n);
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
    atIndentedComment(t, n) {
      return this.type !== "comment" || this.indent <= n
        ? !1
        : t.every((r) => r.type === "newline" || r.type === "space");
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
  pb.Parser = hf;
});
var Sb = q((Ws) => {
  "use strict";
  var gb = rf(),
    dL = Ms(),
    Ks = js(),
    uL = tu(),
    fL = he(),
    mL = gf(),
    hb = If();
  function Ib(e) {
    let t = e.prettyErrors !== !1;
    return { lineCounter: e.lineCounter || (t && new mL.LineCounter()) || null, prettyErrors: t };
  }
  function yL(e, t = {}) {
    let { lineCounter: n, prettyErrors: r } = Ib(t),
      i = new hb.Parser(n?.addNewLine),
      s = new gb.Composer(t),
      o = Array.from(s.compose(i.parse(e)));
    if (r && n) for (let a of o) (a.errors.forEach(Ks.prettifyError(e, n)), a.warnings.forEach(Ks.prettifyError(e, n)));
    return o.length > 0 ? o : Object.assign([], { empty: !0 }, s.streamInfo());
  }
  function bb(e, t = {}) {
    let { lineCounter: n, prettyErrors: r } = Ib(t),
      i = new hb.Parser(n?.addNewLine),
      s = new gb.Composer(t),
      o = null;
    for (let a of s.compose(i.parse(e), !0, e.length))
      if (!o) o = a;
      else if (o.options.logLevel !== "silent") {
        o.errors.push(
          new Ks.YAMLParseError(
            a.range.slice(0, 2),
            "MULTIPLE_DOCS",
            "Source contains multiple documents; please use YAML.parseAllDocuments()",
          ),
        );
        break;
      }
    return (r && n && (o.errors.forEach(Ks.prettifyError(e, n)), o.warnings.forEach(Ks.prettifyError(e, n))), o);
  }
  function pL(e, t, n) {
    let r;
    typeof t == "function" ? (r = t) : n === void 0 && t && typeof t == "object" && (n = t);
    let i = bb(e, n);
    if (!i) return null;
    if ((i.warnings.forEach((s) => uL.warn(i.options.logLevel, s)), i.errors.length > 0)) {
      if (i.options.logLevel !== "silent") throw i.errors[0];
      i.errors = [];
    }
    return i.toJS(Object.assign({ reviver: r }, n));
  }
  function gL(e, t, n) {
    let r = null;
    if (
      (typeof t == "function" || Array.isArray(t) ? (r = t) : n === void 0 && t && (n = t),
      typeof n == "string" && (n = n.length),
      typeof n == "number")
    ) {
      let i = Math.round(n);
      n = i < 1 ? void 0 : i > 8 ? { indent: 8 } : { indent: i };
    }
    if (e === void 0) {
      let { keepUndefined: i } = n ?? t ?? {};
      if (!i) return;
    }
    return fL.isDocument(e) && !r ? e.toString(n) : new dL.Document(e, r, n).toString(n);
  }
  Ws.parse = pL;
  Ws.parseAllDocuments = yL;
  Ws.parseDocument = bb;
  Ws.stringify = gL;
});
var Ys = q((_e) => {
  "use strict";
  var hL = rf(),
    IL = Ms(),
    bL = Fu(),
    bf = js(),
    SL = Ss(),
    Qn = he(),
    _L = Wn(),
    EL = Fe(),
    RL = qn(),
    wL = zn(),
    PL = tl(),
    vL = yf(),
    xL = gf(),
    TL = If(),
    sl = Sb(),
    _b = gs();
  _e.Composer = hL.Composer;
  _e.Document = IL.Document;
  _e.Schema = bL.Schema;
  _e.YAMLError = bf.YAMLError;
  _e.YAMLParseError = bf.YAMLParseError;
  _e.YAMLWarning = bf.YAMLWarning;
  _e.Alias = SL.Alias;
  _e.isAlias = Qn.isAlias;
  _e.isCollection = Qn.isCollection;
  _e.isDocument = Qn.isDocument;
  _e.isMap = Qn.isMap;
  _e.isNode = Qn.isNode;
  _e.isPair = Qn.isPair;
  _e.isScalar = Qn.isScalar;
  _e.isSeq = Qn.isSeq;
  _e.Pair = _L.Pair;
  _e.Scalar = EL.Scalar;
  _e.YAMLMap = RL.YAMLMap;
  _e.YAMLSeq = wL.YAMLSeq;
  _e.CST = PL;
  _e.Lexer = vL.Lexer;
  _e.LineCounter = xL.LineCounter;
  _e.Parser = TL.Parser;
  _e.parse = sl.parse;
  _e.parseAllDocuments = sl.parseAllDocuments;
  _e.parseDocument = sl.parseDocument;
  _e.stringify = sl.stringify;
  _e.visit = _b.visit;
  _e.visitAsync = _b.visitAsync;
});
import { realpathSync as qP } from "node:fs";
import { fileURLToPath as tK } from "node:url";
import { randomUUID as u1 } from "node:crypto";
import { readFile as f1 } from "node:fs/promises";
import vt from "node:path";
import Mn from "node:path";
var uv = Mn.join(".gamecowork-cli", "UnityInsight"),
  fv = "index.db",
  mv = "index.db.tmp",
  yv = "index.current",
  Jc = ".index.lock",
  Zc = ".index.write.lock.db",
  pv = ".serve.lock";
function Be(e) {
  let t = Mn.join(e, uv);
  return {
    projectPath: e,
    indexDirectoryPath: t,
    liveDbPath: Mn.join(t, fv),
    tempDbPath: Mn.join(t, mv),
    currentPointerPath: Mn.join(t, yv),
    indexLockPath: Mn.join(t, Jc),
    indexWriteLockDbPath: Mn.join(t, Zc),
    serveLockPath: Mn.join(t, pv),
  };
}
import { access as Ix, mkdir as bx, rename as Sx, rm as dd } from "node:fs/promises";
import { constants as _x } from "node:fs";
import { DatabaseSync as Cp } from "node:sqlite";
import Mp from "node:path";
var dp = `CREATE TABLE projects (
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
var up = `CREATE INDEX IF NOT EXISTS idx_yaml_objects_local_identifier
ON yaml_objects (file_id, local_identifier);

CREATE INDEX IF NOT EXISTS idx_yaml_objects_game_object_file_id
ON yaml_objects (file_id, game_object_file_id);
`;
var fp = `CREATE INDEX idx_files_guid ON files (guid);
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
var mp = [
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
  yp = [
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
function pp(e, t) {
  (e.exec("PRAGMA foreign_keys = ON"), e.exec(`PRAGMA user_version = ${t}`), e.exec(dp));
}
function ed(e) {
  e.exec(up);
}
function gp(e) {
  (ed(e), e.exec(fp));
}
import cx from "node:path";
var bv = new Set(["Class", "GameObject"]),
  Sv = new Set(["Method", "Property", "Component", "PrefabOverrides"]);
function _v(e) {
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
function Zi(e) {
  return e.length > 0 && /^[\\/]+$/.test(e);
}
function hp(e) {
  return e.replaceAll("/", "%2F").replaceAll("\\", "%5C");
}
function Ev(e) {
  return Zi(e) ? hp(e) : e;
}
function es(e) {
  return e === "gameobject" || e === "prefab_instance";
}
function gn(e, t) {
  return es(t) ? hp(e) : Ev(e);
}
function Fn(e, t) {
  let n = _v(t);
  return !n || e.endsWith(n) ? e : `${e}${n}`;
}
function Rv(e) {
  return e === "directory" || e === "container";
}
function Qr(e) {
  return e.replace(/\\/g, "/").trim();
}
function Co(e) {
  return e.length <= 1 ? e : e.replace(/\/+$/, "");
}
function Ip(e) {
  let t = (e ?? "").trim().toLowerCase();
  switch (t) {
    case "directory":
    case "file":
    case "container":
    case "leaf":
    case "link":
      return t;
    default:
      return;
  }
}
function Xr(e) {
  let t = Ip(e.entryRole);
  if (t) return t;
  let n = (e.entryType ?? "").trim().toLowerCase();
  if (n === "link") return "link";
  if (n === "directory") return "directory";
  if (n === "file") return "file";
  let r = e.labels ?? [];
  if (r.includes("VfsLink")) return "link";
  for (let i of r) if (Sv.has(i)) return "leaf";
  for (let i of r) if (bv.has(i)) return "container";
  return n === "node" ? "leaf" : "file";
}
function wv(e) {
  let t = Qr(e);
  return ((t.includes(":/") ? t.slice(t.indexOf(":/") + 2) : t).split("/").filter(Boolean).pop() ?? "").startsWith(".");
}
function de(e, t) {
  let n = Qr(e);
  if (!n) return n;
  let r = Co(n);
  return t && Rv(t) ? `${r}/` : r;
}
function Pv(e, t) {
  return de(e, t);
}
function ar(e, t = {}) {
  let n = Xr({
    entryRole: t.entryRole,
    entryType: t.entryType,
    labels: t.labels ?? (t.nodeType ? [t.nodeType] : void 0),
  });
  return Pv(e, n);
}
function ve(e, t) {
  return de(e, t);
}
function bp(e) {
  let t = e.trim().length > 1 && /\/+$/.test(e),
    n = Co(Qr(e));
  return t && n ? `${n}/` : n;
}
function Ye(e, ...t) {
  let n = Qr(e);
  for (let r of t) {
    let i = Qr(r).replace(/^\/+/, "");
    if (i) {
      if (!n) {
        n = i;
        continue;
      }
      n = `${Co(n)}/${i}`;
    }
  }
  return n;
}
function Mo(e) {
  let t = Qr(e);
  if (!t) return [];
  let n = Co(t),
    r = [n];
  return (
    n.endsWith(":") && !n.includes(":/") && r.unshift(n.slice(0, -1)),
    !wv(n) && !t.endsWith("/") && r.push(`${n}/`),
    t.endsWith("/") && n !== t && !n.endsWith(":") && r.unshift(`${n}/`),
    [...new Set(r.filter(Boolean))]
  );
}
import ti from "node:path";
function Jr(e) {
  return `file:${e}`;
}
function Fo(e) {
  return `file_content:${e}`;
}
function lr(e) {
  return `entity:${e}`;
}
function At(e, t) {
  return `entity_file_local:${e}:${t}`;
}
function ts(e, t) {
  return `symbol:${e}:${t}`;
}
function Zr(e) {
  return `path:${e}`;
}
function td(e) {
  return `link:entity:${e}:source_prefab`;
}
function Sp(e) {
  return e.trim().startsWith("@");
}
function _p(e) {
  let t = e.trim();
  return t.startsWith("@") ? t.slice(1) : t;
}
function Ep(e, t) {
  if (/^symbol:\d+:\d+$/.test(e) || !e.startsWith("symbol:")) return e;
  let n = Number.parseInt(e.slice(7), 10);
  return !Number.isFinite(n) || t === null ? e : ts(t, n);
}
var Do = new WeakSet(),
  vv = 1;
function jo(e) {
  (e.exec("BEGIN IMMEDIATE"), Do.add(e));
}
function ei(e) {
  (e.exec("COMMIT"), Do.delete(e));
}
function nd(e) {
  try {
    e.exec("ROLLBACK");
  } finally {
    Do.delete(e);
  }
}
function ns(e) {
  return Do.has(e);
}
function qe(e, t) {
  if (ns(e)) return t();
  jo(e);
  try {
    let n = t();
    return (ei(e), n);
  } catch (n) {
    return wp(e, n);
  }
}
async function rd(e, t) {
  if (ns(e)) return t();
  jo(e);
  try {
    let n = await t();
    return (ei(e), n);
  } catch (n) {
    return wp(e, n);
  }
}
function Rp(e, t) {
  return ns(e) ? xv(e, t) : qe(e, t);
}
function xv(e, t) {
  let n = Tv(e);
  try {
    let r = t();
    return (e.exec(`RELEASE ${n}`), r);
  } catch (r) {
    return kv(e, n, r);
  }
}
function Tv(e) {
  let t = `unity_insight_${vv++}`;
  return (e.exec(`SAVEPOINT ${t}`), t);
}
function wp(e, t) {
  try {
    nd(e);
  } catch (n) {
    throw new AggregateError([t, n], "Transaction failed and could not be rolled back.", { cause: t });
  }
  throw t;
}
function kv(e, t, n) {
  let r = [];
  try {
    e.exec(`ROLLBACK TO ${t}`);
  } catch (i) {
    r.push(i);
  }
  try {
    e.exec(`RELEASE ${t}`);
  } catch (i) {
    r.push(i);
  }
  throw r.length > 0
    ? new AggregateError([n, ...r], "Transaction savepoint failed and could not be rolled back.", { cause: n })
    : n;
}
var ni = class extends Error {
  constructor(n) {
    super(`VFS path relocation collision: ${n}`);
    this.conflictingPath = n;
    this.name = "VfsPathRelocationCollisionError";
  }
  conflictingPath;
};
function Nv(e) {
  if (e.contentChanged) return !1;
  let t = Gt(e.discovered.projectRelPath);
  return !(
    t.endsWith(".asmdef") ||
    t.endsWith(".asmref") ||
    t === "Packages/manifest.json" ||
    t.startsWith("ProjectSettings/")
  );
}
function Pp(e) {
  return { fileId: e.fileId, oldProjectRelPath: e.oldProjectRelPath, newProjectRelPath: e.discovered.projectRelPath };
}
function vp(e, t) {
  let n = [],
    r = [];
  for (let i of e) t.allowFastPath && Nv(i) ? n.push(i) : r.push(i);
  return { fastPathMoves: n, slowPathMoves: r };
}
function Gt(e) {
  return e.replace(/\\/g, "/");
}
function Le(e, t, n) {
  if (e == null || e === "") return e ?? null;
  let r = Gt(e),
    i = Gt(t),
    s = Gt(n);
  return r === i
    ? s
    : r.startsWith(`${i}:/`)
      ? `${s}${r.slice(i.length)}`
      : r.startsWith(`${i}/`)
        ? `${s}${r.slice(i.length)}`
        : r;
}
function Uv(e) {
  let t = [],
    n = ti.posix.dirname(Gt(e));
  for (; n !== "." && n !== "";) (t.push(n), (n = ti.posix.dirname(n)));
  return t.sort((r, i) => r.localeCompare(i));
}
function Av(e) {
  return de(ti.posix.dirname(Gt(e)), "directory");
}
function Lv(e, t) {
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
function Ov(e, t, n) {
  let r = Gt(t),
    i = `${r}:/%`;
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
    .all(r, i, r, i, r, i)
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
function Cv(e, t, n) {
  let r = Le(e.vfsPath, t, n),
    i = e.entryType === "file" ? Av(n) : Le(e.parentVfsPath, t, n);
  return {
    id: e.id,
    vfsPath: r,
    parentVfsPath: i,
    sourceVfsPath: Le(e.sourceVfsPath, t, n),
    sourceOwnerVfsPath: Le(e.sourceOwnerVfsPath, t, n),
    targetVfsPath: Le(e.targetVfsPath, t, n),
    instanceRootVfsPath: Le(e.instanceRootVfsPath, t, n),
  };
}
function Mv(e, t, n) {
  let r = Le(e.sourceVfsPath, t, n),
    i = Le(e.sourceOwnerVfsPath, t, n),
    s = Le(e.targetVfsPath, t, n);
  return r === e.sourceVfsPath && i === e.sourceOwnerVfsPath && s === e.targetVfsPath
    ? null
    : {
        id: e.id,
        vfsPath: e.vfsPath,
        parentVfsPath: e.parentVfsPath,
        sourceVfsPath: r,
        sourceOwnerVfsPath: i,
        targetVfsPath: s,
        instanceRootVfsPath: e.instanceRootVfsPath,
      };
}
function Fv(e, t) {
  let n = new Set(t.map((r) => r.id));
  for (let r of t)
    if (
      e
        .prepare(
          `SELECT id
         FROM vfs_entries
         WHERE vfs_path = ?
           AND id NOT IN (${[...n].map(() => "?").join(", ") || "NULL"})`,
        )
        .get(r.vfsPath, ...n)
    )
      throw new ni(r.vfsPath);
}
function Dv(e, t) {
  let n = e.prepare(`UPDATE vfs_entries
     SET vfs_path = ?,
         parent_vfs_path = ?,
         source_vfs_path = ?,
         source_owner_vfs_path = ?,
         target_vfs_path = ?,
         instance_root_vfs_path = ?
     WHERE id = ?`),
    r = [...t].sort((i, s) => s.vfsPath.length - i.vfsPath.length);
  for (let i of r)
    n.run(
      i.vfsPath,
      i.parentVfsPath,
      i.sourceVfsPath,
      i.sourceOwnerVfsPath,
      i.targetVfsPath,
      i.instanceRootVfsPath,
      i.id,
    );
}
function id(e, t, n) {
  let r = new Set(
      e
        .prepare(
          `SELECT vfs_path
           FROM vfs_entries
           WHERE entry_type = 'directory'`,
        )
        .all()
        .map((a) => a.vfs_path),
    ),
    i = 0,
    s = e.prepare("SELECT COALESCE(MAX(id), 0) AS max_id FROM vfs_entries").get().max_id + 1,
    o = e.prepare(
      cr(e)
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
  for (let a of Uv(n)) {
    let l = de(a, "directory");
    if (r.has(l)) continue;
    let c = ti.posix.dirname(a),
      d = c === "." || c === "" ? null : de(c, "directory");
    (cr(e) ? o.run(s, t, l, d, ti.posix.basename(a), Zr(l)) : o.run(s, t, l, d, ti.posix.basename(a)),
      r.add(l),
      (s += 1),
      (i += 1));
  }
  return i;
}
function jv(e, t) {
  let n = de(Gt(t.newProjectRelPath), "file");
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
    throw new ni(n);
}
function Bv(e, t, n) {
  if (cr(e)) return (jv(e, n), { rewrittenEntryCount: Tp(e, n), createdDirectoryCount: id(e, t, n.newProjectRelPath) });
  let r = Gt(n.oldProjectRelPath),
    i = Gt(n.newProjectRelPath),
    s = Lv(e, n.fileId),
    o = new Set(s.map((c) => c.id)),
    a = Ov(e, r, o),
    l = s.map((c) => Cv(c, r, i));
  for (let c of a) {
    let d = Mv(c, r, i);
    d && l.push(d);
  }
  return l.length === 0
    ? { rewrittenEntryCount: 0, createdDirectoryCount: id(e, t, i) }
    : (Fv(e, l), Dv(e, l), { rewrittenEntryCount: l.length, createdDirectoryCount: id(e, t, i) });
}
function xp(e, t) {
  if (t.length === 0) return { rewrittenEntryCount: 0, createdDirectoryCount: 0 };
  let n = e.prepare("SELECT id FROM projects LIMIT 1").get()?.id;
  if (n === void 0) throw new Error("Cannot relocate VFS paths without a project row.");
  return Rp(e, () => {
    let r = 0,
      i = 0;
    for (let s of t) {
      let o = Bv(e, n, s);
      ((r += o.rewrittenEntryCount), (i += o.createdDirectoryCount));
    }
    return { rewrittenEntryCount: r, createdDirectoryCount: i };
  });
}
import Up from "node:path";
import Xv from "node:path";
var rs = new Set([
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
  sd = new Set([".fbx", ".dae", ".obj", ".blend", ".png", ".jpg", ".jpeg", ".tga", ".psd", ".wav", ".mp3", ".ogg"]),
  od = new Set([".bytes", ".dll", ".exe", ".so", ".dylib", ".a", ".bundle", ".zip", ".gz", ".7z", ".rar"]);
import Qv from "node:path";
import kp from "node:path";
var Vv = [
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
  $v = [
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
  Gv = [
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
  Kv = new Map([
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
  Wv = new Map([
    [".shader", "shader_lab"],
    [".hlsl", "shader_include"],
    [".cginc", "shader_include"],
    [".shadergraph", "shader_graph"],
    [".shadersubgraph", "shader_graph"],
    [".uxml", "uxml"],
    [".uss", "uss"],
    [".json", "json_file"],
  ]),
  Yv = new Map([
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
function ad(e, t, n) {
  return e.map((r) => ({ extension: r, assetKind: n.get(r) ?? "asset", ...t }));
}
var qv = [
    { extension: ".unity", fileKind: "scene", assetKind: "scene", contentMode: "text", parserKind: "unity-yaml" },
    { extension: ".scene", fileKind: "scene", assetKind: "scene", contentMode: "text", parserKind: "unity-yaml" },
    { extension: ".prefab", fileKind: "prefab", assetKind: "prefab", contentMode: "text", parserKind: "unity-yaml" },
    { extension: ".cs", fileKind: "csharp", assetKind: "script", contentMode: "text", parserKind: "csharp" },
    { extension: ".asmdef", fileKind: "asmdef", assetKind: "asmdef", contentMode: "text", parserKind: "json" },
    { extension: ".meta", fileKind: "meta", assetKind: "meta", contentMode: "text", parserKind: "meta" },
    ...ad(Vv, { fileKind: "yaml-asset", contentMode: "text", parserKind: "unity-yaml" }, Kv),
    ...ad($v, { fileKind: "asset", contentMode: "text", parserKind: "none" }, Wv),
    ...ad(Gv, { fileKind: "asset", contentMode: "binary", parserKind: "none" }, Yv),
  ],
  zv = new Map(qv.map((e) => [e.extension, e]));
function dr(e) {
  let t = kp.posix.extname(e).toLowerCase();
  return zv.get(t) ?? null;
}
function Lt(e) {
  return e === "Packages/manifest.json"
    ? "json"
    : e.startsWith("ProjectSettings/")
      ? Hv(e)
        ? "unity-yaml"
        : "none"
      : (dr(e)?.parserKind ?? "none");
}
function is(e) {
  return e === "Packages/manifest.json" || e.startsWith("ProjectSettings/") ? "text" : (dr(e)?.contentMode ?? "text");
}
function Hv(e) {
  let t = kp.posix.extname(e).toLowerCase();
  return t === ".asset" || t === ".yaml" || t === ".yml";
}
function ss(e, t) {
  return is(e) !== "binary";
}
function Bo(e, t) {
  if (!ss(e, t)) return !1;
  let n = Qv.posix.extname(e).toLowerCase();
  return n === ".cs" || n === ".meta" || Lt(e) === "unity-yaml" ? !0 : rs.has(n);
}
var Jv = new Set([
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
function os(e) {
  return `${e.replace(/\/+$/, "")}:/.content`;
}
function Np(e, t, n) {
  if (!ss(e, n)) return !1;
  let r = Xv.posix.extname(e).toLowerCase();
  if (sd.has(r) || od.has(r)) return !1;
  if (rs.has(r) || r === ".cs") return !0;
  let i = t.trim().toLowerCase();
  return !!Jv.has(i);
}
function Zv(e) {
  return ["gameobject", "subasset", "texture", "sprite"].includes(e) ? "container" : "leaf";
}
function ex(e) {
  return ["namespace", "class", "interface", "struct", "enum"].includes(e) ? "container" : "leaf";
}
function tx(e, t) {
  let n = e.trim() || t.trim();
  if (!n) return [t];
  let i = n
    .replace(/\(.*\)$/, "")
    .trim()
    .split(".")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return i.length > 0 ? i : [t];
}
function nx(e) {
  return (e.name ?? e.typeName).trim() || e.typeName;
}
function rx(e) {
  return gn(nx(e), e.entityKind);
}
function ix(e) {
  let t = e.hierarchyName?.trim();
  if (!t) return rx(e);
  if (!es(e.entityKind) && e.parentEntityId && t.includes("/") && !Zi(t)) {
    let n = Up.posix.basename(t) || t;
    return gn(n, e.entityKind);
  }
  return gn(t, e.entityKind);
}
function sx(e) {
  return de(Up.posix.dirname(e.replace(/\\/g, "/")), "directory");
}
function Ap(e, t, n, r) {
  let i = `${e}|${t}|${n}`,
    s = r.get(i) ?? 0;
  for (;;) {
    s += 1;
    let o = s === 1 ? t : `${t}#${s}`,
      a = de(Ye(e, o), n);
    if (s === 1 || !r.has(`${i}|${s}`)) return (r.set(i, s), a);
  }
}
function ox(e) {
  let t = new Map();
  for (let n of e) {
    let r = n.projectRelPath.replace(/\\/g, "/"),
      i = de(r, "file");
    (t.set(Jr(n.id), { vfsPath: i, parentVfsPath: sx(r) }),
      t.set(Fo(n.id), { vfsPath: de(os(i), "leaf"), parentVfsPath: i }));
  }
  return t;
}
function ax(e, t) {
  let n = new Map(e.map((a) => [a.id, a])),
    r = new Map(),
    i = new Map(),
    s = new Map();
  function o(a) {
    if (r.has(a)) return r.get(a) ?? null;
    let l = n.get(a);
    if (!l || l.entityKind === "prefab_instance") return (r.set(a, null), null);
    let c = t.get(l.assetId);
    if (!c) return (r.set(a, null), null);
    let d = l.parentEntityId ? o(l.parentEntityId) : `${c.replace(/\\/g, "/")}:/`;
    if (!d) return (r.set(a, null), null);
    let u = Ap(d, ix(l), Zv(l.entityKind), i);
    return (r.set(a, u), u);
  }
  for (let a of e) {
    if (a.entityKind === "prefab_instance") continue;
    let l = o(a.id);
    if (!l) continue;
    let c = a.parentEntityId ? o(a.parentEntityId) : de(t.get(a.assetId)?.replace(/\\/g, "/") ?? "", "file");
    s.set(lr(a.id), { vfsPath: l, parentVfsPath: c });
  }
  return s;
}
function lx(e, t) {
  let n = new Map(e.map((a) => [a.id, a])),
    r = new Map(),
    i = new Map(),
    s = new Map();
  function o(a) {
    if (r.has(a)) return r.get(a) ?? null;
    let l = n.get(a);
    if (!l) return (r.set(a, null), null);
    let c = t.get(l.fileId);
    if (!c) return (r.set(a, null), null);
    let d = tx(l.qualifiedName, l.simpleName),
      u = null;
    for (let f = 0; f < d.length; f += 1) {
      let m = d[f],
        y = f === d.length - 1,
        g = y ? ex(l.symbolKind) : "container";
      if (y) {
        let b = u === null ? `${c}:/` : u;
        u = Ap(b, m, g, i);
        continue;
      }
      let h = u === null ? Ye(`${c}:/`, m) : Ye(u, m);
      u = de(h, g);
    }
    return (r.set(a, u), u);
  }
  for (let a of e) {
    let l = o(a.id);
    if (!l) continue;
    let c = a.containingSymbolId ? o(a.containingSymbolId) : (t.get(a.fileId) ?? null);
    s.set(ts(a.fileId, a.id), { vfsPath: l, parentVfsPath: c });
  }
  return s;
}
function Lp(e, t) {
  if (t.length === 0) return new Map();
  let n = t.map(() => "?").join(", "),
    r = e
      .prepare(
        `SELECT id, project_rel_path
         FROM files
         WHERE id IN (${n})`,
      )
      .all(...t)
      .map((d) => ({ id: d.id, projectRelPath: d.project_rel_path })),
    i = e
      .prepare(
        `SELECT id, file_id, vfs_root_path
       FROM assets
       WHERE file_id IN (${n})`,
      )
      .all(...t),
    s = new Map(i.map((d) => [d.id, d.vfs_root_path])),
    o = i.map((d) => d.id),
    a = ox(r),
    l = new Map(r.map((d) => [d.id, de(d.projectRelPath.replace(/\\/g, "/"), "file")]));
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
        .map((f) => ({
          id: f.id,
          assetId: f.asset_id,
          entityKind: f.entity_kind,
          name: f.name,
          hierarchyName: f.hierarchy_name,
          typeName: f.type_name,
          parentEntityId: f.parent_entity_id,
        }));
    for (let [f, m] of ax(u, s)) a.set(f, m);
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
  for (let [d, u] of lx(c, l)) a.set(d, u);
  return a;
}
function cr(e) {
  return e
    .prepare("PRAGMA table_info(vfs_entries)")
    .all()
    .some((n) => n.name === "vfs_logical_key");
}
function ld(e) {
  if (!cr(e)) return 0;
  let t = e
      .prepare(
        `SELECT id, vfs_logical_key, source_file_id
       FROM vfs_entries
       WHERE vfs_logical_key LIKE 'symbol:%'
         AND vfs_logical_key NOT LIKE 'symbol:%:%'`,
      )
      .all(),
    n = e.prepare("UPDATE vfs_entries SET vfs_logical_key = ? WHERE id = ?"),
    r = 0;
  for (let i of t) {
    let s = Ep(i.vfs_logical_key, i.source_file_id);
    s !== i.vfs_logical_key && (n.run(s, i.id), (r += 1));
  }
  return r;
}
function dx(e, t) {
  if (t.size === 0) return 0;
  let n = e.prepare(`UPDATE vfs_entries
     SET vfs_path = ?,
         parent_vfs_path = ?
     WHERE vfs_logical_key = ?`),
    r = 0;
  for (let [i, s] of t.entries()) {
    let o = n.run(s.vfsPath, s.parentVfsPath, i);
    r += o.changes;
  }
  return r;
}
function ux(e, t) {
  if (!cr(e) || t.length === 0) return 0;
  ld(e);
  let n = Lp(e, t);
  return dx(e, n);
}
function fx(e, t) {
  let n = t.oldProjectRelPath.replace(/\\/g, "/"),
    r = t.newProjectRelPath.replace(/\\/g, "/"),
    i = e
      .prepare(
        `SELECT id, vfs_path, parent_vfs_path, source_vfs_path, source_owner_vfs_path, target_vfs_path
       FROM vfs_entries
       WHERE host_file_id = ?
         AND vfs_logical_key LIKE 'path:%'`,
      )
      .all(t.fileId);
  if (i.length === 0) return 0;
  let s = e.prepare(`UPDATE vfs_entries
     SET vfs_path = ?,
         parent_vfs_path = ?,
         source_vfs_path = ?,
         source_owner_vfs_path = ?,
         target_vfs_path = ?,
         vfs_logical_key = ?
     WHERE id = ?`),
    o = 0;
  for (let a of i) {
    let l = Le(a.vfs_path, n, r);
    (s.run(
      l,
      Le(a.parent_vfs_path, n, r),
      Le(a.source_vfs_path, n, r),
      Le(a.source_owner_vfs_path, n, r),
      Le(a.target_vfs_path, n, r),
      `path:${l}`,
      a.id,
    ),
      (o += 1));
  }
  return o;
}
function mx(e, t) {
  if (!cr(e)) return 0;
  if (t && t.length > 0) {
    let r = t.map(() => "?").join(", ");
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
         WHERE host.source_logical_key IN (${r})
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
function yx(e, t) {
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
    .map((i) => lr(i.entity_id));
}
function Tp(e, t) {
  px(e, t);
  let n = ux(e, [t.fileId]);
  return ((n += fx(e, t)), (n += mx(e, yx(e, [t.fileId]))), (n += gx(e, t)), n);
}
function px(e, t) {
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
function gx(e, t) {
  let n = t.oldProjectRelPath.replace(/\\/g, "/"),
    r = t.newProjectRelPath.replace(/\\/g, "/"),
    i = e
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
  if (i.length === 0) return 0;
  let s = e.prepare(`UPDATE vfs_entries
     SET vfs_path = ?,
         parent_vfs_path = ?,
         source_vfs_path = ?,
         source_owner_vfs_path = ?,
         target_vfs_path = ?,
         instance_root_vfs_path = ?
     WHERE id = ?`),
    o = 0;
  for (let a of i) {
    let l = Le(a.vfs_path, n, r);
    l !== a.vfs_path &&
      (s.run(
        l,
        a.entry_type === "file" ? hx(r) : Le(a.parent_vfs_path, n, r),
        Le(a.source_vfs_path, n, r),
        Le(a.source_owner_vfs_path, n, r),
        Le(a.target_vfs_path, n, r),
        Le(a.instance_root_vfs_path, n, r),
        a.id,
      ),
      (o += 1));
  }
  return o;
}
function hx(e) {
  return de(cx.posix.dirname(e.replace(/\\/g, "/")), "directory");
}
function cd(e) {
  let n = e.prepare("PRAGMA user_version").get()?.user_version ?? 0;
  return n > 0 ? n : (e.prepare("SELECT schema_version FROM projects WHERE id = 1").get()?.schema_version ?? 0);
}
function Op(e) {
  let t = cd(e);
  if (t !== 11)
    throw new Error(
      `Unsupported Unity Insight database schema version ${t}. Rebuild the index with 'unity-insight-cli index build'.`,
    );
  return (ld(e), t);
}
var as = 1;
async function ri(e) {
  let t = Mp.join(e, "ProjectSettings", "ProjectVersion.txt");
  try {
    await Ix(t, _x.F_OK);
  } catch (n) {
    throw new Error(`Invalid Unity project root: missing required path ${t}`, { cause: n });
  }
}
async function Fp(e) {
  try {
    await bx(e, { recursive: !0 });
  } catch (t) {
    throw new Error(`Failed to create Unity Insight index directory at ${e}`, { cause: t });
  }
}
async function Dp(e, t) {
  let n = Mp.join(e, "ProjectSettings", "ProjectVersion.txt");
  try {
    return (await t(n, "utf8")).match(/m_EditorVersion:\s*(.+)\s*$/m)?.[1]?.trim() ?? null;
  } catch {
    return null;
  }
}
function Vo(e) {
  let t = new Cp(e);
  return (Ex(t), t.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='projects'").get() && Op(t), t);
}
function Kt(e) {
  let t = new Cp(e, { readOnly: !0 });
  try {
    ud(t);
  } catch (n) {
    throw (t.close(), n);
  }
  return t;
}
function Ex(e) {
  (e.exec("PRAGMA foreign_keys = ON"),
    e.exec("PRAGMA journal_mode = WAL"),
    e.exec("PRAGMA synchronous = NORMAL"),
    e.exec("PRAGMA cache_size = -32768"),
    e.exec("PRAGMA temp_store = FILE"));
}
function ud(e) {
  (e.exec("PRAGMA foreign_keys = ON"),
    e.exec("PRAGMA query_only = ON"),
    e.exec("PRAGMA cache_size = -32768"),
    e.exec("PRAGMA temp_store = FILE"));
}
function jp(e) {
  e.exec("PRAGMA wal_checkpoint(TRUNCATE)");
}
var Ot = class extends Error {
  constructor(t) {
    (super(t), (this.name = "UnityInsightIndexNotFoundError"));
  }
};
function fd(e, t) {
  (e.prepare("UPDATE projects SET indexed_at = ? WHERE id = ?").run(t.indexedAt, as),
    e
      .prepare(
        `UPDATE rebuild_summary
       SET mode = ?,
           discovered_file_count = ?,
           diagnostic_count = ?,
           completed_stages_json = ?
       WHERE project_id = ?`,
      )
      .run(t.mode, t.discoveredFileCount, t.diagnosticCount, JSON.stringify(t.completedStages), as));
}
function Bp(e, t, n) {
  (pp(e, t.schemaVersion),
    qe(e, () => {
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
        .run(as, t.projectPath, t.unityVersion, t.indexedAt, t.schemaVersion),
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
            as,
            n.mode,
            n.summary.discoveredFileCount,
            n.summary.diagnosticCount,
            JSON.stringify(n.completedStages),
            n.publishedIndexPath,
            n.createdAt,
          ));
    }));
}
function cs(e, t, n) {
  if (t.length === 0) return;
  let r = e.prepare(`INSERT INTO index_diagnostics (
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
  qe(e, () => {
    t.forEach((i, s) => {
      r.run(s + 1, as, i.severity, i.category, i.code ?? null, i.stage ?? null, i.filePath ?? null, i.message, n);
    });
  });
}
function Vp(e) {
  let t = e
      .prepare(
        `SELECT name
       FROM sqlite_schema
       WHERE type = 'table'
         AND name NOT LIKE 'sqlite_%'`,
      )
      .all()
      .map((c) => String(c.name)),
    n = mp.filter((c) => !t.includes(c));
  if (n.length > 0) throw new Error(`Finalize check failed: missing required tables ${n.join(", ")}`);
  let r = e
      .prepare(
        `SELECT name
       FROM sqlite_schema
       WHERE type = 'index'
         AND sql IS NOT NULL`,
      )
      .all()
      .map((c) => String(c.name)),
    i = yp.filter((c) => !r.includes(c));
  if (i.length > 0) throw new Error(`Finalize check failed: missing required indexes ${i.join(", ")}`);
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
      .map((u) => `${u.vfs_path} (parent=${u.parent_vfs_path}, type=${u.entry_type}, kind=${u.entry_kind})`)
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
async function ls(e) {
  await Promise.all([dd(`${e}-wal`, { force: !0 }), dd(`${e}-shm`, { force: !0 })]);
}
async function $p(e, t) {
  await ls(t);
  try {
    await Sx(e, t);
  } catch (n) {
    throw new Error(`Failed to publish Unity Insight index to ${t}`, { cause: n });
  }
  await ls(e);
}
async function md(e) {
  await Promise.all([dd(e, { force: !0 }), ls(e)]);
}
import { randomUUID as Rx } from "node:crypto";
import { existsSync as wx, readFileSync as Px } from "node:fs";
import { mkdir as vx, readFile as xx, rm as ds, writeFile as Tx } from "node:fs/promises";
import kx from "node:path";
import { DatabaseSync as Nx } from "node:sqlite";
var Ux = 5,
  Ax = 26,
  hn = class extends Error {
    code;
    constructor(t, n) {
      (super(t, n), (this.name = "UnityInsightIndexWriteLockError"), (this.code = n?.code ?? "failed"));
    }
  };
function Wt(e) {
  return e instanceof hn && e.code === "busy";
}
var yd = new Map();
function Lx(e) {
  if (!Number.isFinite(e) || e <= 0) return !1;
  try {
    return (process.kill(e, 0), !0);
  } catch {
    return !1;
  }
}
function Gp(e) {
  if (typeof e != "object" || e === null) return;
  let t = e.errcode;
  return typeof t == "number" ? t : void 0;
}
function Kp(e) {
  if (Gp(e) === Ux) return !0;
  if (typeof e != "object" || e === null) return !1;
  let t = e.message;
  return typeof t == "string" && /database is locked/i.test(t);
}
function Wp(e) {
  if (Gp(e) === Ax) return !0;
  if (typeof e != "object" || e === null) return !1;
  let t = e.message;
  return typeof t == "string" && /not a database/i.test(t);
}
function Ox(e) {
  let t = e.trim();
  if (!t) return null;
  try {
    let n = JSON.parse(t),
      r = Number(n.pid),
      i = n.mode === "build" || n.mode === "sync" ? n.mode : null;
    return !Lx(r) || i === null
      ? null
      : { pid: r, mode: i, startedAt: typeof n.startedAt == "string" ? n.startedAt : "" };
  } catch {
    return null;
  }
}
function Cx(e) {
  try {
    let t = JSON.parse(e.trim());
    return typeof t.token == "string" && t.token.length > 0 ? t.token : null;
  } catch {
    return null;
  }
}
function ii(e) {
  try {
    return wx(e.indexLockPath) ? Ox(Px(e.indexLockPath, "utf8")) : null;
  } catch {
    return null;
  }
}
async function Mx(e, t) {
  let n = `${JSON.stringify({ pid: t.pid, mode: t.mode, startedAt: t.startedAt, token: t.token })}
`;
  await Tx(e, n, "utf8");
}
async function Fx(e, t) {
  try {
    let n = await xx(e, "utf8");
    if (Cx(n) !== t) return;
  } catch {
    return;
  }
  await ds(e, { force: !0 }).catch(() => {});
}
function Go(e) {
  try {
    e.exec("ROLLBACK");
  } catch {}
  try {
    e.close();
  } catch {}
}
async function Dx(e) {
  await Promise.all([
    ds(e, { force: !0 }),
    ds(`${e}-journal`, { force: !0 }),
    ds(`${e}-wal`, { force: !0 }),
    ds(`${e}-shm`, { force: !0 }),
  ]);
}
function pd(e) {
  let t = new Nx(e);
  try {
    return (t.exec("PRAGMA busy_timeout = 0"), t.exec("BEGIN IMMEDIATE"), t);
  } catch (n) {
    throw (Go(t), n);
  }
}
function jx(e) {
  for (let t = 0; ; t += 1) {
    let n = t === 0 ? e : `${e}.${t}`;
    try {
      return pd(n);
    } catch (r) {
      if (!Wp(r)) throw r;
    }
  }
}
function $o(e, t) {
  return Kp(t)
    ? new hn(`Unity Insight index write is already running (lock: ${e}).`, { cause: t, code: "busy" })
    : new hn(`Failed to acquire Unity Insight index write lock at ${e}.`, { cause: t, code: "failed" });
}
async function Dn(e, t) {
  let n = e.indexLockPath,
    r = e.indexWriteLockDbPath;
  await vx(kx.dirname(r), { recursive: !0 });
  let i = Rx(),
    s = new Date().toISOString(),
    o = { indexLockPath: n, indexWriteLockDbPath: r, token: i, pid: process.pid, mode: t, startedAt: s },
    a = `${r}.acquire`,
    l;
  try {
    l = jx(a);
  } catch (c) {
    throw $o(a, c);
  }
  try {
    let c;
    try {
      c = pd(r);
    } catch (d) {
      if (Kp(d)) throw $o(r, d);
      if (Wp(d)) {
        await Dx(r);
        try {
          c = pd(r);
        } catch (u) {
          throw $o(r, u);
        }
      } else throw $o(r, d);
    }
    try {
      await Mx(n, o);
    } catch (d) {
      throw (
        Go(c),
        new hn(`Failed to write Unity Insight index writer metadata at ${n}.`, { cause: d, code: "failed" })
      );
    }
    return (yd.set(i, c), o);
  } finally {
    Go(l);
  }
}
async function Ct(e) {
  let t = yd.get(e.token);
  return t ? (yd.delete(e.token), Go(t), await Fx(e.indexLockPath, e.token), !0) : !1;
}
import { randomUUID as Bx } from "node:crypto";
import { existsSync as Vx, readFileSync as $x, readdirSync as Gx, statSync as Kx } from "node:fs";
import { open as Wx, rename as qp, rm as zp } from "node:fs/promises";
import In from "node:path";
var Hp = /^index\.[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.db$/,
  Yx = /^(index\.[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.db)(?:-wal|-shm)?$/,
  Yp = 3,
  qx = 10,
  Qp = 3,
  bn = class extends Error {
    constructor(t, n) {
      (super(t, n), (this.name = "UnityInsightIndexPointerError"));
    }
  },
  Ko = class extends Error {
    constructor(t, n) {
      (super(t, n), (this.name = "UnityInsightIndexResolutionRaceError"));
    }
  };
function zx(e) {
  return e instanceof bn && e.cause === void 0;
}
function Hx(e, t) {
  if (
    !t.endsWith(`
`) ||
    t.slice(0, -1).includes(`
`) ||
    t.slice(0, -1).includes("\r")
  )
    throw new bn(
      `Corrupt Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath}: expected one generated database basename followed by a newline.`,
    );
  let n = t.slice(0, -1);
  if (!Hp.test(n) || In.basename(n) !== n)
    throw new bn(
      `Corrupt Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath}: invalid selected database ${JSON.stringify(n)}.`,
    );
  return n;
}
function hd(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = e.code;
  return t === "ENOENT" || t === "ENOTDIR";
}
function Xp(e, t = Kx) {
  try {
    return (t(e), !0);
  } catch (n) {
    if (hd(n)) return !1;
    throw n;
  }
}
function si(e, t) {
  let n;
  try {
    n = $x(e.currentPointerPath, "utf8");
  } catch (i) {
    if (!hd(i))
      throw new bn(`Failed to read Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath}.`, {
        cause: i,
      });
    return t(e.liveDbPath) ? { kind: "legacy", indexPath: e.liveDbPath } : { kind: "none" };
  }
  let r = Hx(e, n);
  return { kind: "generated", pointerText: n, indexPath: In.join(e.indexDirectoryPath, r) };
}
function gd(e) {
  return new Ot(
    `Unity Insight index not found for ${e.projectPath}. Checked pointer ${e.currentPointerPath} and legacy database ${e.liveDbPath}.`,
  );
}
function Wo(e, t) {
  return e.kind !== t.kind
    ? !1
    : e.kind === "none"
      ? !0
      : e.kind === "legacy"
        ? t.kind === "legacy" && e.indexPath === t.indexPath
        : t.kind === "generated" && e.pointerText === t.pointerText && e.indexPath === t.indexPath;
}
function Yo(e, t = {}) {
  let n = t.openDatabase ?? Kt,
    r = (s) => Xp(s, t.statFile),
    i;
  for (let s = 0; s < Qp; s += 1) {
    let o = si(e, r);
    if (o.kind === "none") {
      let a = si(e, r);
      if (!Wo(o, a)) continue;
      throw gd(e);
    }
    try {
      return { indexPath: o.indexPath, database: n(o.indexPath) };
    } catch (a) {
      i = a;
      let l = si(e, r);
      if (!Wo(o, l)) continue;
      throw o.kind === "generated" && !r(o.indexPath)
        ? new bn(
            `Corrupt Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath}: selected database is missing at ${o.indexPath}.`,
            { cause: a },
          )
        : a;
    }
  }
  throw new Ko(`Unity Insight index selection kept changing while opening a read-only database for ${e.projectPath}.`, {
    cause: i,
  });
}
function Id(e, t = {}) {
  let n = (r) => Xp(r, t.statFile);
  for (let r = 0; r < Qp; r += 1) {
    let i = si(e, n);
    if (i.kind === "none") {
      let o = si(e, n);
      if (!Wo(i, o)) continue;
      throw gd(e);
    }
    if (n(i.indexPath)) return i.indexPath;
    let s = si(e, n);
    if (Wo(i, s))
      throw i.kind === "generated"
        ? new bn(
            `Corrupt Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath}: selected database is missing at ${i.indexPath}.`,
          )
        : gd(e);
  }
  throw new Ko(`Unity Insight index selection kept changing while resolving a database path for ${e.projectPath}.`);
}
function it(e, t = {}) {
  try {
    return Id(e, t);
  } catch (n) {
    if (n instanceof Ot) return;
    throw n;
  }
}
function Qx(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = e.code;
  return t === "EPERM" || t === "EBUSY" || t === "EACCES";
}
async function Xx(e, t, n, r) {
  let i = r.renameFile ?? qp,
    s =
      r.wait ??
      ((o) =>
        new Promise((a) => {
          setTimeout(a, o);
        }));
  for (let o = 1; o <= Yp; o += 1)
    try {
      await i(n, e.currentPointerPath);
      return;
    } catch (a) {
      if (o === Yp || !Qx(a))
        throw new bn(
          `Failed to replace Unity Insight index pointer for ${e.projectPath} at ${e.currentPointerPath} with selected database ${In.join(e.indexDirectoryPath, t)}.`,
          { cause: a },
        );
      await s(qx * o);
    }
}
async function Jp(e, t, n = {}) {
  let r = n.randomUUID ?? Bx,
    i = `index.${r()}.db`,
    s = In.join(t.indexDirectoryPath, i);
  if (Vx(s)) throw new Error(`Refusing to replace existing Unity Insight index generation at ${s}.`);
  let o = n.renameFile ?? qp;
  try {
    await o(e, s);
  } catch (l) {
    throw new Error(`Failed to publish Unity Insight index generation for ${t.projectPath} from ${e} to ${s}.`, {
      cause: l,
    });
  }
  await ls(e);
  let a = In.join(t.indexDirectoryPath, `.index.current.${r()}.tmp`);
  try {
    let l = await Wx(a, "wx");
    try {
      (await l.writeFile(
        `${i}
`,
        "utf8",
      ),
        await l.sync());
    } finally {
      await l.close();
    }
    await Xx(t, i, a, n);
  } finally {
    await zp(a, { force: !0 }).catch(() => {});
  }
  return s;
}
function Jx(e, t) {
  if (In.dirname(t) !== e.indexDirectoryPath) return !1;
  let n = In.basename(t);
  return t === e.liveDbPath || Hp.test(n);
}
async function Zp(e) {
  let t = [];
  return (
    await Promise.all(
      [e, `${e}-wal`, `${e}-shm`].map(async (n) => {
        try {
          await zp(n, { force: !0 });
        } catch (r) {
          t.push({ path: n, error: r });
        }
      }),
    ),
    t
  );
}
async function qo(e, t) {
  if (!Jx(e, t)) return [];
  let n;
  try {
    n = it(e);
  } catch (r) {
    return [{ path: e.currentPointerPath, error: r }];
  }
  return n === t ? [] : Zp(t);
}
async function bd(e, t = {}) {
  let n;
  try {
    n = (t.resolveCurrentIndex ?? ((c) => it(c, { statFile: t.statFile })))(e);
  } catch (l) {
    if (!zx(l)) return [{ path: e.currentPointerPath, error: l }];
    n = void 0;
  }
  let r = t.readDirectory ?? Gx,
    i;
  try {
    i = r(e.indexDirectoryPath);
  } catch (l) {
    return hd(l) ? [] : [{ path: e.indexDirectoryPath, error: l }];
  }
  let s = new Set(),
    o = In.basename(e.liveDbPath);
  for (let l of i) {
    if (l === o || l === `${o}-wal` || l === `${o}-shm`) {
      s.add(e.liveDbPath);
      continue;
    }
    let c = Yx.exec(l);
    c?.[1] && s.add(In.join(e.indexDirectoryPath, c[1]));
  }
  let a = [];
  for (let l of s) l !== n && a.push(...(await Zp(l)));
  return a;
}
async function eg(e) {
  let t;
  try {
    t = await Dn(e, "sync");
  } catch (n) {
    if (Wt(n)) return;
    throw n;
  }
  try {
    return await bd(e);
  } finally {
    await Ct(t);
  }
}
import { createHash as WL } from "node:crypto";
import { createReadStream as YL } from "node:fs";
import { readFile as Rf } from "node:fs/promises";
import { availableParallelism as zo } from "node:os";
var Zx = 8,
  eT = 32,
  tT = 4;
function Ho(e, t) {
  if (!e) return t;
  let n = Number.parseInt(e, 10);
  return Number.isFinite(n) && n > 0 ? n : t;
}
function Sd(e = process.env, t = zo()) {
  let n = Math.max(1, Math.floor(t)),
    r = n <= 4 ? n - 1 : Math.floor(n * 0.75),
    i = Math.max(1, Math.min(Zx, r)),
    s = Ho(e.UNITY_INSIGHT_INDEX_CPU_BUDGET, i);
  return Math.min(s, n);
}
function tg(e = process.env, t = zo()) {
  return Ho(e.UNITY_INSIGHT_YAML_PARSE_CONCURRENCY, Sd(e, t));
}
function ng(e = process.env, t = zo()) {
  return Ho(e.UNITY_INSIGHT_FILE_PREPARE_CONCURRENCY, Sd(e, t));
}
function rg(e = process.env, t = zo()) {
  let n = Math.min(eT, Math.max(tT, Sd(e, t) * 4));
  return Ho(e.UNITY_INSIGHT_DISCOVERY_FILE_CONCURRENCY, n);
}
function ze(e) {
  if (e <= 0) throw new Error("IN clause requires at least one value.");
  return Array.from({ length: e }, () => "?").join(", ");
}
function Mt(e, t) {
  if (e <= 0) throw new Error("VALUES clause requires at least one row.");
  if (t <= 0) throw new Error("VALUES clause requires at least one column.");
  let n = `(${ze(t)})`;
  return Array.from({ length: e }, () => n).join(", ");
}
var _d = 8192;
function ur(e) {
  if (e <= 0) throw new Error("columnCount must be positive.");
  return Math.max(1, Math.floor(_d / e));
}
var Qo = 4096;
function oi(e) {
  if (!e) return { lowerBound: "", upperBound: "\uFFFF" };
  for (let t = e.length - 1; t >= 0; t -= 1) {
    let n = e.charCodeAt(t);
    if (n < 65535) return { lowerBound: e, upperBound: `${e.slice(0, t)}${String.fromCharCode(n + 1)}` };
  }
  return { lowerBound: e, upperBound: `${e}\uFFFF` };
}
function He(e, t = Qo) {
  if (t <= 0) throw new Error("chunkSize must be positive.");
  let n = [];
  for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
  return n;
}
function jn(e, t, n, r) {
  if (r.length !== 0)
    for (let i of He(r)) {
      let s = ze(i.length);
      e.prepare(`DELETE FROM ${t} WHERE ${n} IN (${s})`).run(...i);
    }
}
function ke(e, t, n, r = "") {
  if (n.length === 0) return [];
  let i = [];
  for (let s of He(n)) {
    let o = ze(s.length),
      a = e.prepare(`${t}${o}${r}`).all(...s);
    for (let l of a) i.push(l);
  }
  return i;
}
function ig(e, t, n, r) {
  if (n.length === 0 || r <= 0) return [];
  if (r > _d) throw new Error("bindRepeats exceeds the SQLite bind-parameter budget.");
  let i = Math.min(Qo, Math.max(1, Math.floor(_d / r))),
    s = [];
  for (let o of He(n, i)) {
    let a = ze(o.length),
      l = Array.from({ length: r }, () => o).flat(),
      c = e.prepare(t(a)).all(...l);
    for (let d of c) s.push(d);
  }
  return s;
}
function Qe(e) {
  return [...new Set(e)].sort((t, n) => t - n);
}
import ai from "node:path";
import rT from "node:path";
function Yt(e) {
  return e === "Packages/manifest.json"
    ? "package-manifest"
    : e === "Packages/packages-lock.json" || nT(e)
      ? (dr(e)?.fileKind ?? null)
      : e.startsWith("ProjectSettings/")
        ? "project-settings"
        : e.startsWith("Assets/")
          ? (dr(e)?.fileKind ?? null)
          : null;
}
function nT(e) {
  let t = e.split("/");
  return t.length >= 3 && t[0] === "Packages";
}
var iT = new Set([".unity", ".scene", ".prefab", ".mixer", ".controller", ".overrideController", ".anim"]);
function sT(e) {
  return e.replace(/\\/g, "/");
}
function oT(e) {
  let t = Yt(e);
  if (t === "scene" || t === "prefab") return !0;
  let n = rT.posix.extname(e).toLowerCase();
  return iT.has(n);
}
function aT(e) {
  let t = sT(e);
  if (
    t.endsWith(".cs") ||
    t.endsWith(".cs.meta") ||
    t === "Packages/manifest.json" ||
    t.endsWith(".asmdef") ||
    t.endsWith(".asmref") ||
    oT(t)
  )
    return !1;
  let n = Yt(t);
  if (n === "csharp" || n === "asmdef" || n === "scene" || n === "prefab" || n === "package-manifest") return !1;
  if (n === "asset" || n === "yaml-asset" || n === "project-settings" || n === "meta") return !0;
  if (t.endsWith(".meta")) {
    let r = Yt(t.slice(0, -5));
    return r === "asset" || r === "yaml-asset" || r === "meta";
  }
  return !1;
}
function sg(e, t) {
  if (e.deleted.length > 0) return !1;
  if (t) {
    for (let r of e.modified) {
      let i = t.get(r.fileId) ?? null,
        s = r.discovered.guid ?? null;
      if (i !== s) return !1;
    }
    for (let r of e.moved ?? []) {
      let i = t.get(r.fileId) ?? null,
        s = r.discovered.guid ?? null;
      if (i !== s) return !1;
    }
  }
  let n = [
    ...e.modified.map((r) => r.discovered.projectRelPath),
    ...e.created.map((r) => r.projectRelPath),
    ...(e.moved?.map((r) => r.discovered.projectRelPath) ?? []),
    ...e.metadataStale.map((r) => r.projectRelPath),
  ];
  return n.length === 0 ? !1 : n.every(aT);
}
function lT(e) {
  return e.replace(/\\/g, "/");
}
function Ed(e) {
  let t = [
    ...e.modified.map((n) => n.discovered.projectRelPath),
    ...e.created.map((n) => n.projectRelPath),
    ...e.deleted.map((n) => n.projectRelPath),
    ...(e.moved?.map((n) => n.discovered.projectRelPath) ?? []),
  ];
  return t.length === 0
    ? !1
    : t.every((n) => {
        let r = lT(n);
        return r.endsWith(".cs") || r.endsWith(".cs.meta");
      });
}
function og(e, t) {
  if (t.length === 0) return [];
  let n = t.map(() => "?").join(", "),
    r = e
      .prepare(
        `SELECT guid
       FROM files
       WHERE id IN (${n})
         AND guid IS NOT NULL
       ORDER BY id`,
      )
      .all(...t);
  return [...new Set(r.map((i) => i.guid))];
}
function cT(e, t, n) {
  let r = e
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
  if (r.length === 0) return null;
  if (r.length === 1) return r[0]?.id ?? null;
  let i = r.find((o) => o.qualified_name === n);
  return i ? i.id : (r.find((o) => o.qualified_name.endsWith(`.${n}`))?.id ?? r[0]?.id ?? null);
}
function ag(e, t) {
  if (t.length === 0) return { entitiesUpdated: 0, vfsEntriesUpdated: 0, vfsEdgesUpdated: 0 };
  let n = 0,
    r = 0,
    i = 0,
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
      let f = cT(e, c, u.type_name);
      if (f === null) continue;
      let m = s.run(f, u.entity_id);
      n += m.changes;
      let y = e
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
          .get(f);
      if (g)
        for (let h of y) {
          let b = o.run(f, h.id);
          ((r += b.changes), a.run(h.id));
          let S = Oe(e, "vfs_edges");
          (l.run(S, h.id, g.id), (i += 1));
        }
    }
  }
  return { entitiesUpdated: n, vfsEntriesUpdated: r, vfsEdgesUpdated: i };
}
var dT = new Set([".unity", ".scene", ".prefab", ".mixer", ".controller", ".overrideController", ".anim"]);
function uT(e) {
  return !e || e.length === 0 ? null : new Set(e.map((t) => t.replace(/\\/g, "/").trim()).filter(Boolean));
}
function us(e, t) {
  if (!t) return !0;
  let n = e.replace(/\\/g, "/");
  for (let r of t) if (n === r || n.startsWith(`${r}/`) || n.startsWith(r)) return !0;
  return !1;
}
function ms(e) {
  let t = Yt(e);
  if (t === "scene" || t === "prefab") return !0;
  let n = ai.posix.extname(e).toLowerCase();
  return dT.has(n);
}
function fs(e) {
  return e.endsWith(".asmdef") || e.endsWith(".asmref");
}
function fT(e) {
  return e === "Packages/manifest.json";
}
function mT(e) {
  return e.replace(/\\/g, "/");
}
function lg(e) {
  return mT(e) === "Packages/manifest.json";
}
function fr(e) {
  return e.endsWith(".meta") ? e.slice(0, -5) : `${e}.meta`;
}
function ys(e) {
  let t = e.replace(/\\/g, "/");
  return ms(t) ? [t, `${t}:/`] : t.endsWith(".cs") ? [t, `${t}:/`] : [t];
}
function Xo(e, t) {
  let n = ai.posix.dirname(e);
  return t
    .filter(
      (r) => r.kind === "csharp" && (ai.posix.dirname(r.projectRelPath) === n || r.projectRelPath.startsWith(`${n}/`)),
    )
    .map((r) => r.projectRelPath);
}
function yT(e) {
  if (fT(e)) return "global";
  if (fs(e)) return "assembly";
  if (ms(e)) return "structural";
  let t = fr(e);
  return e.endsWith(".meta") || (t && t !== e) ? "file_pair" : "file";
}
function cg(e, t, n, r) {
  let i = n.map((o) => r.get(o)).filter((o) => o !== void 0),
    s = n.flatMap((o) => ys(o));
  return { kind: e, key: t, fileIds: i, projectRelPaths: n, vfsPathPrefixes: s };
}
function pT(e) {
  let t = new Map();
  for (let n of e) {
    let r = t.get(n.key);
    if (!r) {
      t.set(n.key, {
        ...n,
        fileIds: [...n.fileIds],
        projectRelPaths: [...n.projectRelPaths],
        vfsPathPrefixes: [...n.vfsPathPrefixes],
      });
      continue;
    }
    let i = new Set([...r.fileIds, ...n.fileIds]),
      s = new Set([...r.projectRelPaths, ...n.projectRelPaths]),
      o = new Set([...r.vfsPathPrefixes, ...n.vfsPathPrefixes]);
    t.set(n.key, { kind: r.kind, key: r.key, fileIds: [...i], projectRelPaths: [...s], vfsPathPrefixes: [...o] });
  }
  return [...t.values()];
}
function dg(e, t, n) {
  let r = uT(n.pathFilter),
    i = new Set(),
    s = new Set(),
    o = new Set(),
    a = [],
    l = !1,
    c = !1,
    d = !1,
    u = (P) => {
      ((l = !0), f(P), m([P], "global", P));
    },
    f = (P) => {
      if (!us(P, r)) return;
      o.add(P);
      let I = fr(P);
      I && t.some((E) => E.projectRelPath === I) && o.add(I);
    },
    m = (P, I, E) => {
      let w = P[0];
      if (!w || !us(w, r)) return;
      let T = I ?? yT(w),
        x = E ?? w;
      a.push(cg(T, x, P, n.indexedPathToId));
    };
  for (let P of e.deleted) {
    if (!us(P.projectRelPath, r)) continue;
    i.add(P.fileId);
    let I = fr(P.projectRelPath),
      E = I ? n.indexedPathToId.get(I) : void 0;
    E !== void 0 && i.add(E);
  }
  for (let P of e.moved ?? []) {
    let I = P.discovered.projectRelPath;
    if (!us(I, r)) continue;
    (s.add(P.fileId), P.metaFileId !== void 0 && s.add(P.metaFileId), P.contentChanged && f(I));
    let E = fr(I),
      w = E && t.some((T) => T.projectRelPath === E) ? [I, E] : [I];
    ms(I) ? m(w, "structural", I) : fs(I) ? m([I, ...Xo(I, t)], "assembly", `assembly:${ai.posix.dirname(I)}`) : m(w);
  }
  for (let P of e.modified) {
    let I = P.discovered.projectRelPath;
    if (us(I, r)) {
      if (lg(I)) u(I);
      else if (fs(I)) {
        l = !0;
        let E = Xo(I, t);
        (E.forEach(f), m([I, ...E], "assembly", `assembly:${ai.posix.dirname(I)}`));
      } else if (ms(I)) {
        let E = fr(I),
          w = E ? [I, E].filter((T) => t.some((x) => x.projectRelPath === T)) : [I];
        m(w, "structural", I);
      } else {
        let E = fr(I),
          w = E && t.some((T) => T.projectRelPath === E) ? [I, E] : [I];
        m(w);
      }
      (s.add(P.fileId), f(I));
    }
  }
  for (let P of e.created) {
    (lg(P.projectRelPath)
      ? u(P.projectRelPath)
      : fs(P.projectRelPath) && ((l = !0), Xo(P.projectRelPath, t).forEach(f)),
      f(P.projectRelPath));
    let I = fr(P.projectRelPath),
      E = I && t.some((w) => w.projectRelPath === I) ? [P.projectRelPath, I] : [P.projectRelPath];
    fs(P.projectRelPath)
      ? m([P.projectRelPath, ...Xo(P.projectRelPath, t)], "assembly", `assembly:${ai.posix.dirname(P.projectRelPath)}`)
      : ms(P.projectRelPath)
        ? m(E, "structural", P.projectRelPath)
        : m(E);
  }
  let y = t.filter((P) => o.has(P.projectRelPath));
  for (let P of y) {
    let I = n.indexedPathToId.get(P.projectRelPath);
    I !== void 0 && s.add(I);
  }
  let g = pT(a),
    h = new Set(),
    b = new Set();
  for (let P of g)
    P.fileIds.forEach((I) => {
      (h.add(I), b.add(I));
    });
  s.forEach((P) => {
    (h.add(P), b.add(P));
  });
  let S =
    g.length > 0
      ? g
      : [...h].map((P) => {
          let I = [...n.indexedPathToId.entries()].find(([, E]) => E === P)?.[0];
          return cg("file", I ?? `file:${P}`, I ? [I] : [], n.indexedPathToId);
        });
  return {
    scopes: g,
    deletedFileIds: [...i],
    refreshFileIds: [...s],
    resolveFileIds: [...h],
    materializeScopes: S,
    extractDiscovered: y,
    rebuildAllAssemblies: l,
    rebuildProjectSymbolGraph: c,
    requiresFullDerivedRebuild: d,
    csharpSymbolOnlyChanges: Ed(e) && !d,
    assetSelfOnlyChanges: !d && !Ed(e) && sg(e, n.indexedGuidByFileId),
  };
}
function Rd(e, t) {
  return e.map((n) => ({
    ...n,
    fileIds: [...new Set(n.projectRelPaths.map((r) => t.get(r)).filter((r) => r !== void 0))],
  }));
}
function ug(e, t) {
  let n = new Set();
  for (let r of e.scopes)
    for (let i of r.projectRelPaths) {
      let s = t.get(i);
      s !== void 0 && n.add(s);
    }
  for (let r of e.refreshFileIds) n.add(r);
  return [...n];
}
function Jo(e) {
  let t = new Set();
  return (e.forEach((n) => n.fileIds.forEach((r) => t.add(r))), [...t]);
}
var gT = 1;
function li(e, t, n, r) {
  jn(e, t, n, r);
}
function Zo(e, t) {
  t.length !== 0 &&
    (li(e, "symbols", "file_id", t),
    li(e, "yaml_references", "file_id", t),
    li(e, "yaml_objects", "file_id", t),
    li(e, "cs_mentions", "file_id", t),
    li(e, "cs_declarations", "file_id", t));
}
function fg(e, t) {
  t.length !== 0 && (Zo(e, t), jn(e, "files", "id", t));
}
function wd(e) {
  (e.exec("DELETE FROM entity_symbol_edges"),
    e.exec("DELETE FROM semantic_bindings"),
    e.exec("DELETE FROM symbol_edges"),
    e.exec("DELETE FROM symbols"));
}
function ps(e, t) {
  let n = Array.isArray(t) ? t : t.symbolFileIds,
    r = Array.isArray(t) ? t : (t.bindingFileIds ?? t.symbolFileIds);
  if (n.length === 0 && r.length === 0) return;
  if (r.length > 0) {
    let o = ze(r.length);
    e.prepare(
      `DELETE FROM semantic_bindings
         WHERE mention_id IN (
           SELECT id FROM cs_mentions WHERE file_id IN (${o})
         )`,
    ).run(...r);
  }
  if (n.length === 0) return;
  let i = ze(n.length),
    s = e.prepare(`SELECT id FROM symbols WHERE file_id IN (${i})`).all(...n);
  if (s.length > 0) {
    let o = s.map((a) => a.id);
    for (let a of He(o)) {
      let l = ze(a.length);
      e.prepare(
        `DELETE FROM symbol_edges
           WHERE from_symbol_id IN (${l})
              OR to_symbol_id IN (${l})`,
      ).run(...a, ...a);
    }
    (jn(e, "symbol_edges", "source_file_id", n), jn(e, "symbols", "id", o));
    return;
  }
  e.prepare(`DELETE FROM symbol_edges WHERE source_file_id IN (${i})`).run(...n);
}
function ea(e) {
  (wd(e), e.exec("DELETE FROM entity_edges"), e.exec("DELETE FROM entities"), e.exec("DELETE FROM assets"));
}
function ta(e, t) {
  if (t.length === 0) return;
  let n = t.map(() => "?").join(", "),
    r = e.prepare(`SELECT id FROM assets WHERE file_id IN (${n})`).all(...t);
  if (r.length === 0) return;
  let i = r.map((s) => s.id);
  for (let s of He(i)) {
    let o = ze(s.length);
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
  (jn(e, "entities", "asset_id", i), jn(e, "assets", "file_id", t));
}
function na(e, t) {
  if (t.length === 0) return;
  let n = new Set();
  for (let r of t) {
    if (
      (e
        .prepare("SELECT id FROM vfs_entries WHERE vfs_path = ?")
        .all(r)
        .forEach((a) => n.add(a.id)),
      !r.endsWith("/"))
    )
      continue;
    let s = `${r.replace(/[\\%_]/g, "\\$&")}%`;
    e.prepare("SELECT id FROM vfs_entries WHERE vfs_path LIKE ? ESCAPE '\\'")
      .all(s)
      .forEach((a) => n.add(a.id));
  }
  n.size !== 0 && jn(e, "vfs_entries", "id", [...n]);
}
function Pd(e, t) {
  let n = [...new Set(t)].sort((r, i) => r - i);
  if (n.length !== 0)
    for (let r of He(n)) {
      let i = ze(r.length);
      e.prepare(
        `DELETE FROM vfs_edges
         WHERE from_entry_id IN (
           SELECT id FROM vfs_entries WHERE host_file_id IN (${i})
         )`,
      ).run(...r);
    }
}
function mg(e, t, n) {
  if (t.length === 0) return;
  let r = t.map((s) => s.fileId),
    i = t.flatMap((s) => ys(s.projectRelPath));
  (na(e, i), hT(e, r, n), ta(e, r));
}
function hT(e, t, n) {
  if (t.length === 0) return;
  let r = [];
  for (let [i, s] of n.entries())
    t.includes(s) && (r.push(i.replace(/\\/g, "/")), i.endsWith(".cs") && r.push(`${i.replace(/\\/g, "/")}:/`));
  (na(e, r), li(e, "vfs_entries", "source_file_id", t));
}
function vd(e, t) {
  let n = Jo(t);
  (ta(e, n), Pd(e, n));
}
function IT(e) {
  (e.exec("DELETE FROM vfs_edges"), e.exec("DELETE FROM vfs_entries"));
}
function ra(e) {
  (IT(e),
    e.exec("DELETE FROM entity_symbol_edges"),
    e.exec("DELETE FROM entity_edges"),
    e.exec("DELETE FROM entities"),
    e.exec("DELETE FROM assets"),
    e.exec("DELETE FROM semantic_bindings"),
    e.exec("DELETE FROM symbol_edges"),
    e.exec("DELETE FROM symbols"));
}
function yg(e) {
  (e.exec("DELETE FROM assembly_references"), e.exec("DELETE FROM assemblies"));
}
function ia(e) {
  e.prepare("DELETE FROM index_diagnostics WHERE project_id = ?").run(gT);
}
function Oe(e, t) {
  return e.prepare(`SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM ${t}`).get().next_id;
}
import xd from "node:path";
function mr(e) {
  let t = JSON.parse(e),
    n = Array.isArray(t.includePlatforms)
      ? t.includePlatforms.filter((r) => typeof r == "string").map((r) => r.toLowerCase())
      : [];
  return {
    name: typeof t.name == "string" ? t.name : "",
    references: Array.isArray(t.references) ? t.references.filter((r) => typeof r == "string") : [],
    rootNamespace: typeof t.rootNamespace == "string" && t.rootNamespace.length > 0 ? t.rootNamespace : null,
    isEditorOnly: n.includes("editor"),
  };
}
function sa(e, t) {
  let n = e.filter((c) => c.kind === "asmdef"),
    r = e.filter((c) => c.kind === "csharp"),
    i = e.find((c) => c.kind === "package-manifest"),
    s = new Map();
  n.forEach((c) => {
    s.set(xd.posix.dirname(c.projectRelPath), c);
  });
  let o = n.flatMap((c) => {
      try {
        let d = mr(c.contentText ?? "{}");
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
            message: `Failed to parse asmdef: ${pg(d)}`,
          }),
          []
        );
      }
    }),
    a = new Set();
  r.forEach((c) => {
    bT(c.projectRelPath, s) || a.add(ST(c.projectRelPath));
  });
  let l = _T(i?.contentText ?? "{}", t, i?.projectRelPath);
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
function bT(e, t) {
  let n = xd.posix.dirname(e);
  for (; n !== "." && n !== "";) {
    let r = t.get(n);
    if (r) return r;
    n = xd.posix.dirname(n);
  }
}
function ST(e) {
  return e.toLowerCase().includes("/editor/") ? "Assembly-CSharp-Editor" : "Assembly-CSharp";
}
function _T(e, t, n) {
  try {
    let r = JSON.parse(e);
    return Object.keys(r.dependencies ?? {}).sort();
  } catch (r) {
    return (
      t.push({
        severity: "error",
        category: "extract",
        stage: "extract",
        filePath: n,
        message: `Failed to parse package manifest: ${pg(r)}`,
      }),
      []
    );
  }
}
function pg(e) {
  return e instanceof Error ? e.message : String(e);
}
import { createRequire as ET } from "node:module";
import Ig from "web-tree-sitter";
var gg = ET(import.meta.url),
  Td = null,
  hg = Ig;
async function bg() {
  return (
    Td ||
      (Td = (async () => {
        await Ig.init({
          locateFile(n) {
            return gg.resolve(`web-tree-sitter/${n}`);
          },
        });
        let e = await hg.Language.load(gg.resolve("tree-sitter-wasms/out/tree-sitter-c_sharp.wasm")),
          t = new hg();
        return (t.setLanguage(e), t);
      })()),
    Td
  );
}
var RT = new Set(["class_declaration", "interface_declaration", "struct_declaration"]),
  wT = new Set(["field_declaration", "event_declaration", "event_field_declaration", "indexer_declaration"]);
function Sg(e, t) {
  try {
    if (!RT.has(t.type)) return null;
    let n = PT(t);
    if (!n) return null;
    let r = e.indexOf("{", n.startIndex),
      i = e.lastIndexOf("}", t.endIndex);
    if (r < 0 || i < r || i > t.endIndex) return null;
    let s = e.slice(t.startIndex, r + 1).trimEnd();
    if (!s) return null;
    let o = vT(e, n).map((c) => e.slice(c.startIndex, c.endIndex).trimEnd()),
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
function PT(e) {
  return e.childForFieldName("body") ?? e.namedChildren.find((t) => t.type === "declaration_list") ?? null;
}
function vT(e, t) {
  let n = [],
    r = t.namedChildren;
  return (
    r.forEach((i, s) => {
      wT.has(i.type) && n.push({ startIndex: xT(e, r, s), endIndex: i.endIndex });
    }),
    n
  );
}
function xT(e, t, n) {
  let r = t[n]?.startIndex ?? 0;
  for (let i = n - 1; i >= 0; i -= 1) {
    let s = t[i];
    if (s.type !== "attribute_list") break;
    if (!e.slice(s.endIndex, r).trim()) {
      r = s.startIndex;
      continue;
    }
    break;
  }
  return r;
}
var TT = new Map([
  ["class_declaration", "class"],
  ["constructor_declaration", "constructor"],
  ["enum_declaration", "enum"],
  ["interface_declaration", "interface"],
  ["method_declaration", "method"],
  ["namespace_declaration", "namespace"],
  ["property_declaration", "property"],
  ["struct_declaration", "struct"],
]);
async function Eg(e) {
  let n = (await bg()).parse(e);
  try {
    let r = [],
      i = [];
    return (Rg(n.rootNode, e, [], null, r, i), { declarations: r, mentions: i });
  } finally {
    n.delete();
  }
}
function Rg(e, t, n, r, i, s) {
  let o = TT.get(e.type),
    a = o ? e.childForFieldName("name") : null,
    l = null,
    c = n;
  if (o && a) {
    let u = a.text.split(".").pop() ?? a.text,
      f = [...n, a.text].join(".");
    ((l = {
      declKind: o,
      simpleName: u,
      qualifiedNameText: f,
      signatureText: AT(e.text),
      skeletonText: kT(o) ? Sg(t, e) : null,
      lineStart: e.startPosition.row + 1,
      lineEnd: e.endPosition.row + 1,
    }),
      i.push(l),
      (c = [...n, a.text]));
  }
  UT(e) && s.push(NT(e, r));
  let d = l ?? r;
  e.namedChildren.forEach((u) => {
    Rg(u, t, c, d, i, s);
  });
}
function kT(e) {
  return e === "class" || e === "interface" || e === "struct";
}
function NT(e, t) {
  return {
    mentionKind: e.type === "identifier" ? "identifier" : "qualified-name",
    text: e.text,
    receiverText: e.type === "member_access_expression" ? (e.childForFieldName("expression")?.text ?? null) : null,
    argumentArity: LT(e),
    containingDeclarationSimpleName: t?.simpleName ?? null,
    lineStart: e.startPosition.row + 1,
    lineEnd: e.endPosition.row + 1,
  };
}
function UT(e) {
  if (e.type === "identifier") {
    let t = e.parent;
    if (!t) return !1;
    let n = t.childForFieldName?.("name") ?? null;
    return !((n && OT(n, e)) || _g(e, ["member_access_expression", "qualified_name"]));
  }
  return _g(e, ["member_access_expression", "qualified_name"])
    ? !1
    : e.type === "member_access_expression" || e.type === "qualified_name";
}
function _g(e, t) {
  let n = e.parent;
  for (; n;) {
    if (t.includes(n.type)) return !0;
    n = n.parent;
  }
  return !1;
}
function AT(e) {
  return e.split(/\r?\n/, 1)[0]?.trim() ?? "";
}
function LT(e) {
  let t =
    (e.type === "member_access_expression" && e.parent?.type === "invocation_expression") ||
    e.parent?.type === "invocation_expression"
      ? e.parent
      : null;
  if (!t) return null;
  let n = t.childForFieldName("arguments") ?? t.namedChildren.find((r) => r.type === "argument_list") ?? null;
  return n ? n.namedChildren.filter((r) => r.type !== ",").length : 0;
}
function OT(e, t) {
  return e.type === t.type && e.startIndex === t.startIndex && e.endIndex === t.endIndex;
}
var kd = 1;
function wg(e, t) {
  if (t.length === 0) return;
  let n = e.prepare("UPDATE files SET abs_path = ?, mtime_ms = ?, size_bytes = ? WHERE id = ?");
  for (let r of t) n.run(r.absolutePath, r.mtimeMs, r.sizeBytes, r.fileId);
}
function Nd(e, t) {
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
function Pg(e, t) {
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
function vg(e, t) {
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
    kd,
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
function xg(e, t) {
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
  qe(e, () => {
    [...t]
      .sort((r, i) => (r.kind === i.kind ? r.id - i.id : r.kind === "meta" ? -1 : 1))
      .forEach((r) => {
        n.run(
          r.id,
          kd,
          r.projectRelPath,
          r.absolutePath,
          r.kind,
          r.guid,
          r.metaFileId,
          r.sizeBytes,
          r.mtimeMs,
          r.contentHash,
          r.importerType,
        );
      });
  });
}
function oa(e, t) {
  let n = new Map(),
    r = e.prepare(`INSERT INTO assemblies (
      id,
      project_id,
      name,
      source,
      root_namespace,
      is_editor_only
    ) VALUES (?, ?, ?, ?, ?, ?)`),
    i = e.prepare(`INSERT INTO assembly_references (
      from_assembly_id,
      to_assembly_name,
      is_external
    ) VALUES (?, ?, ?)`);
  qe(e, () => {
    (t.forEach((s, o) => {
      let a = o + 1;
      (n.set(s.name, a), r.run(a, kd, s.name, s.source, s.rootNamespace, s.isEditorOnly));
    }),
      t.forEach((s) => {
        let o = n.get(s.name);
        o &&
          s.references.forEach((a) => {
            i.run(o, a, n.has(a) ? 0 : 1);
          });
      }));
  });
}
function Tg(e, t, n) {
  let r = CT(e);
  qe(e, () => {
    r.writeRows(t, n);
  });
}
function CT(e) {
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
    writeRows: (r, i) => {
      (r.length === 0 && i.length === 0) ||
        (r.forEach((s) => {
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
        i.forEach((s) => {
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
function Ud(e, t, n) {
  let r = e.prepare(`INSERT INTO cs_declarations (
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
  qe(e, () => {
    (t.forEach((i) => {
      r.run(
        i.id,
        i.fileId,
        i.declKind,
        i.simpleName,
        i.qualifiedNameText,
        null,
        "[]",
        i.signatureText,
        i.skeletonText ?? null,
        i.lineStart,
        i.lineEnd,
      );
    }),
      MT(e, n));
  });
}
function MT(e, t) {
  if (t.length === 0) return;
  let n = 9,
    r = ur(n),
    i = `INSERT INTO cs_mentions (
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
    s = t.length >= r ? e.prepare(`${i}${Mt(r, n)}`) : null;
  for (let o of He(t, r))
    (o.length === r ? s : e.prepare(`${i}${Mt(o.length, n)}`)).run(
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
import { readdir as QT, readFile as XT, realpath as JT } from "node:fs/promises";
import Bn from "node:path";
import { stat as FT } from "node:fs/promises";
async function aa(e) {
  try {
    return await FT(e);
  } catch {
    return null;
  }
}
async function yr(e) {
  return (await aa(e))?.isDirectory() ?? !1;
}
function ci(e) {
  let t = e.match(/^guid:\s*(.+)\s*$/m),
    n = e.match(/^([A-Za-z0-9_]+Importer):\s*$/m),
    r = e.match(/^ {2}mainObjectFileID:\s*(\d+)\s*$/m);
  return {
    guid: t?.[1] ?? null,
    importerType: n?.[1] ?? null,
    mainObjectFileId: r ? Number(r[1]) : null,
    fileIdToName: Ad(e),
  };
}
function Ad(e) {
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
      o && t.set(o[1], o[2].trim());
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
        o && t.set(o[1], o[2].trim());
      }
    }
  }
  return t;
}
function kg(e) {
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
import { fileURLToPath as DT } from "node:url";
import { readdir as Ug, readFile as jT, realpath as BT } from "node:fs/promises";
import st from "node:path";
var VT = { embedded: 0, "local-file": 1, "package-cache": 2 };
async function Ag(e) {
  let t = st.resolve(e),
    n = [],
    r = await $T(t, n),
    i = await GT(t, n),
    s = [...(await KT(t, n)), ...(await WT(t, r, n)), ...(await qT(t, r, i, n))];
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
async function $T(e, t) {
  let n = st.join(e, "Packages", "manifest.json"),
    r = await Fd(n, t, { filePath: "Packages/manifest.json", missingIsDiagnostic: !1 }),
    i = new Map(),
    s = r && di(r) && di(r.dependencies) ? r.dependencies : {};
  for (let [o, a] of Object.entries(s)) typeof a == "string" && i.set(o, a);
  return i;
}
async function GT(e, t) {
  let n = st.join(e, "Packages", "packages-lock.json"),
    r = await Fd(n, t, { filePath: "Packages/packages-lock.json", missingIsDiagnostic: !1 }),
    i = new Map(),
    s = r && di(r) && di(r.dependencies) ? r.dependencies : {};
  for (let [o, a] of Object.entries(s)) {
    if (!di(a)) continue;
    let l = a.version,
      c = a.source;
    i.set(o, { version: typeof l == "string" ? l : void 0, source: typeof c == "string" ? c : void 0 });
  }
  return i;
}
async function KT(e, t) {
  let n = st.join(e, "Packages"),
    r = await Ug(n, { withFileTypes: !0 }).catch(() => []);
  return (
    await Promise.all(
      r.map(async (s) => {
        if (s.name === "manifest.json" || s.name === "packages-lock.json") return null;
        let o = st.join(n, s.name);
        if (!(await yr(o))) return null;
        let l =
          (await Md(o, t, `Packages/${s.name}/package.json`, { fallbackName: s.name, diagnosticOnFallback: !1 })) ??
          (HT(s.name) ? s.name : null);
        return l
          ? Cd({ packageName: l, physicalRoot: o, sourceKind: "embedded", diagnosticPath: `Packages/${l}` })
          : null;
      }),
    )
  ).filter((s) => s !== null);
}
async function WT(e, t, n) {
  let r = [];
  for (let [i, s] of t) {
    if (!Od(s)) continue;
    let o = zT(e, s);
    if (!(await yr(o))) {
      n.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: "Packages/manifest.json",
        message: `Skipped local package ${i}; package root does not exist: ${o}.`,
      });
      continue;
    }
    let a = (await Md(o, n, "Packages/manifest.json", { fallbackName: i, diagnosticOnFallback: !0 })) ?? i;
    r.push(
      await Cd({ packageName: a, physicalRoot: o, sourceKind: "local-file", diagnosticPath: "Packages/manifest.json" }),
    );
  }
  return r;
}
var YT = new Set(["registry", "builtin"]);
async function qT(e, t, n, r) {
  let i = [],
    s = st.join(e, "Library", "PackageCache"),
    o = new Set(t.keys()),
    a = new Set(n.keys());
  for (let [l, c] of n) {
    if (!c.version || (c.source !== void 0 && !YT.has(c.source)) || Od(t.get(l) ?? "")) continue;
    let d = st.join(s, `${l}@${c.version}`);
    if (await yr(d)) {
      i.push(await Ld(l, d, r, "Packages/packages-lock.json"));
      continue;
    }
    if (
      (r.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: "Packages/packages-lock.json",
        message: `Package cache directory is missing for ${l}@${c.version}.`,
      }),
      o.has(l))
    ) {
      let u = await Ng(s, l, r);
      u && i.push(await Ld(l, u, r, "Packages/packages-lock.json"));
    }
  }
  for (let l of o) {
    if (n.size > 0 || a.has(l) || Od(t.get(l) ?? "")) continue;
    let c = await Ng(s, l, r);
    c && i.push(await Ld(l, c, r, "Packages/manifest.json"));
  }
  return i;
}
async function Ld(e, t, n, r) {
  let i = (await Md(t, n, r, { fallbackName: e, diagnosticOnFallback: !1 })) ?? e;
  return Cd({ packageName: i, physicalRoot: t, sourceKind: "package-cache", diagnosticPath: r });
}
async function Ng(e, t, n) {
  let r = await Ug(e, { withFileTypes: !0 }).catch(() => []),
    i = (
      await Promise.all(
        r.map(async (s) => {
          let o = st.join(e, s.name);
          return !s.name.startsWith(`${t}@`) || !(await yr(o)) ? null : o;
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
        message: `Multiple package cache directories match ${t}; using ${st.basename(i.at(-1) ?? i[0] ?? "")}.`,
      }),
    i.at(-1) ?? null
  );
}
async function Cd(e) {
  let t = st.resolve(e.physicalRoot),
    n = await BT(t);
  return {
    packageName: e.packageName,
    physicalRoot: t,
    realRoot: n,
    virtualRoot: `Packages/${e.packageName}`,
    sourceKind: e.sourceKind,
    priority: VT[e.sourceKind],
    diagnosticPath: e.diagnosticPath,
  };
}
async function Md(e, t, n, r) {
  let i = st.join(e, "package.json"),
    s = await Fd(i, t, { filePath: n, missingIsDiagnostic: r.diagnosticOnFallback }),
    o = s && di(s) && typeof s.name == "string" ? s.name : null;
  return (
    !o &&
      r.diagnosticOnFallback &&
      t.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: n,
        message: `Package ${r.fallbackName} has no readable package.json name; using the manifest dependency name.`,
      }),
    o
  );
}
async function Fd(e, t, n) {
  try {
    return JSON.parse(await jT(e, "utf8"));
  } catch (r) {
    return r instanceof Error && "code" in r && r.code === "ENOENT"
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
          message: `Could not parse JSON file ${e}: ${String(r)}.`,
        }),
        null);
  }
}
function Od(e) {
  return e.startsWith("file:");
}
function zT(e, t) {
  if (t.startsWith("file://"))
    try {
      return DT(t);
    } catch {
      return st.resolve(st.join(e, "Packages"), t.slice(7));
    }
  return st.resolve(st.join(e, "Packages"), t.slice(5));
}
function HT(e) {
  return /^[a-z0-9]+(?:[.-][a-z0-9]+)+$/i.test(e);
}
function di(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
async function ZT(e, t, n) {
  let r = new Array(e.length),
    i = 0,
    s = Math.min(t, e.length);
  async function o() {
    for (;;) {
      let a = i;
      if (((i += 1), a >= e.length)) return;
      r[a] = await n(e[a], a);
    }
  }
  return (await Promise.all(Array.from({ length: s }, () => o())), r);
}
async function ui(e, t = {}) {
  let n = Bn.resolve(e),
    r = [],
    s = (t.includePackages ?? !0) ? await Ag(n) : { sources: [], diagnostics: [] };
  r.push(...s.diagnostics);
  let o = [
      ...(await Dd({ physicalRoot: Bn.join(n, "Assets"), virtualRoot: "Assets", diagnostics: r })),
      ...(await Dd({ physicalRoot: Bn.join(n, "ProjectSettings"), virtualRoot: "ProjectSettings", diagnostics: r })),
      ...(await ek(n)),
      ...(
        await Promise.all(
          s.sources.map((l) => Dd({ physicalRoot: l.physicalRoot, virtualRoot: l.virtualRoot, diagnostics: r })),
        )
      ).flat(),
    ],
    a = await ZT(o, rg(), async ({ absolutePath: l, projectRelPath: c, sizeBytes: d, mtimeMs: u }) => {
      let f = Yt(c);
      if (!f) return null;
      let m = { projectRelPath: c, absolutePath: l, kind: f, sizeBytes: d, mtimeMs: u };
      if (f !== "meta") return m;
      let y = ci(await XT(l, "utf8"));
      return {
        ...m,
        guid: y.guid ?? void 0,
        importerType: y.importerType ?? void 0,
        metaMainObjectFileId: y.mainObjectFileId ?? void 0,
      };
    });
  return {
    projectPath: n,
    diagnostics: r,
    files: a.filter((l) => l !== null).sort((l, c) => l.projectRelPath.localeCompare(c.projectRelPath)),
  };
}
async function ek(e) {
  let t = [
    { absolutePath: Bn.join(e, "Packages", "manifest.json"), projectRelPath: "Packages/manifest.json" },
    { absolutePath: Bn.join(e, "Packages", "packages-lock.json"), projectRelPath: "Packages/packages-lock.json" },
  ];
  return (
    await Promise.all(
      t.map(async (r) => {
        let i = await aa(r.absolutePath);
        return i?.isFile() ? { ...r, sizeBytes: i.size, mtimeMs: Math.trunc(i.mtimeMs) } : null;
      }),
    )
  ).filter((r) => r !== null);
}
async function Dd(e) {
  return (await yr(e.physicalRoot)) ? Lg(e.physicalRoot, e.physicalRoot, e.virtualRoot, e.diagnostics, new Set()) : [];
}
async function Lg(e, t, n, r, i) {
  let s;
  try {
    s = await JT(t);
  } catch (l) {
    return (
      r.push({
        severity: "warning",
        category: "discovery",
        stage: "discovery",
        filePath: n,
        message: `Skipped unreadable directory ${t}: ${String(l)}.`,
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
        message: `Skipped package symlink loop at ${t}.`,
      }),
      []
    );
  i.add(s);
  let o = await QT(t, { withFileTypes: !0 }).catch(
    (l) => (
      r.push({
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
        let c = Bn.join(t, l.name),
          d = await aa(c);
        if (!d) return [];
        if (l.name.endsWith("~") && d.isDirectory()) return [];
        if (d.isDirectory()) return Lg(e, c, n, r, i);
        if (!d.isFile()) return [];
        let u = tk(Bn.relative(e, c));
        return u.startsWith("../") || u === ".."
          ? (r.push({
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
function tk(e) {
  return e.split(Bn.sep).join("/");
}
var St = Oo(Ys(), 1);
function _r(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  let n = e[t];
  return typeof n == "string" ? n : typeof n == "number" ? String(n) : typeof n == "bigint" ? n.toString() : null;
}
function ol(e, t, n, r) {
  if (Array.isArray(e)) {
    e.forEach((i, s) => {
      ol(i, t, `${n}[${s}]`, r);
    });
    return;
  }
  if (!(!e || typeof e != "object")) {
    if (kL(e)) {
      let i = _r(e, "guid"),
        s = _r(e, "fileID"),
        o = _r(e, "localIdentifierInFile");
      (i || (s && s !== "0")) &&
        r.push({
          sourceLocalIdentifier: t,
          fieldPath: n,
          targetGuid: i,
          targetFileId: s,
          targetLocalId: o,
          refKind: i ? "guid-file" : "local-file",
        });
      return;
    }
    Object.entries(e).forEach(([i, s]) => {
      let o = n ? `${n}.${i}` : i;
      ol(s, t, o, r);
    });
  }
}
function kL(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  let t = Object.keys(e);
  return t.includes("fileID") || t.includes("guid") || t.includes("localIdentifierInFile");
}
var Eb = {
    gameObjectFileId: 1,
    parentTransformLocalId: 2,
    childTransformLocalIds: 4,
    prefabInstanceLocalId: 8,
    prefabTransformParentLocalId: 16,
    prefabRootName: 32,
  },
  Rb = new WeakMap();
function wb(e) {
  let t = qs(e, /^[ \t]*m_GameObject\s*:/m, /m_GameObject:\s*\{\s*fileID:\s*([^,}\s]+)/),
    n = qs(e, /^[ \t]*m_Father\s*:/m, /m_Father:\s*\{\s*fileID:\s*([^,}\s]+)/),
    r = UL(e),
    i = qs(e, /^[ \t]*m_PrefabInstance\s*:/m, /m_PrefabInstance:\s*\{\s*fileID:\s*([^,}\s]+)/),
    s = qs(e, /^[ \t]*m_SourcePrefab\s*:/m, /m_SourcePrefab:\s*\{[^}]*guid:\s*([^,}\s]+)/),
    o = qs(e, /^[ \t]*m_TransformParent\s*:/m, /m_TransformParent:\s*\{\s*fileID:\s*([^,}\s]+)/),
    a = AL(e),
    l = {
      gameObjectFileId: t.value,
      parentTransformLocalId: n.value,
      childTransformLocalIds: r.value,
      prefabInstanceLocalId: i.value,
      sourcePrefabGuid: s.value,
      prefabTransformParentLocalId: o.value,
      prefabRootName: a.value,
    },
    c = 0,
    d = [
      ["gameObjectFileId", t],
      ["parentTransformLocalId", n],
      ["childTransformLocalIds", r],
      ["prefabInstanceLocalId", i],
      ["prefabTransformParentLocalId", o],
      ["prefabRootName", a],
    ];
  for (let [u, f] of d) f.covered && (c |= Eb[u]);
  return (Rb.set(l, c), l);
}
function Pb(e, t) {
  return {
    gameObjectFileId: t?.gameObjectFileId ?? pt(e, ["m_GameObject"]),
    parentTransformLocalId: t?.parentTransformLocalId ?? pt(e, ["m_Father"]),
    childTransformLocalIds: t?.childTransformLocalIds ?? Tb(e, ["m_Children"]),
    prefabInstanceLocalId: t?.prefabInstanceLocalId ?? pt(e, ["m_PrefabInstance"]),
  };
}
function pt(e, t) {
  let n = e;
  for (let r of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return null;
    n = n[r];
  }
  return Ri(n);
}
function Ri(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  let t = e,
    n = Sf(t.fileID);
  if (n) return n;
  let r = Sf(t.m_FileID),
    i = Sf(t.m_PathID);
  return r ? null : i;
}
function NL(e, t) {
  let n = CL();
  if (!t || typeof t != "object" || Array.isArray(t)) return n;
  let r = pt(t, ["m_PrefabInstance"]);
  if (e === "Transform" || e === "RectTransform")
    return {
      ...n,
      gameObjectFileId: pt(t, ["m_GameObject"]),
      parentTransformLocalId: pt(t, ["m_Father"]),
      childTransformLocalIds: Tb(t, ["m_Children"]),
      prefabInstanceLocalId: r,
    };
  if (e === "PrefabInstance") {
    let i = t.m_Modification;
    return {
      ...n,
      prefabInstanceLocalId: r,
      prefabTransformParentLocalId: pt(i, ["m_TransformParent"]),
      prefabRootName: OL(i),
    };
  }
  return { ...n, prefabInstanceLocalId: r };
}
function vb(e, t, n, r = new Map()) {
  let i = new Map();
  for (let s of e) {
    let o = t.get(s.id),
      a = o ? (Rb.get(o) ?? 0) : 0,
      l,
      c = () => ((l ??= NL(s.objectType, LL(s, r))), l),
      d = (f) => {
        let m = o?.[f];
        return m != null || (a & Eb[f]) !== 0 ? m : c()[f];
      },
      u = n.get(s.id);
    i.set(s.id, {
      gameObjectFileId: d("gameObjectFileId"),
      parentTransformLocalId: d("parentTransformLocalId"),
      childTransformLocalIds: d("childTransformLocalIds"),
      prefabInstanceLocalId: d("prefabInstanceLocalId"),
      sourcePrefabGuid: u?.get("m_SourcePrefab") ?? o?.sourcePrefabGuid ?? null,
      prefabTransformParentLocalId: d("prefabTransformParentLocalId"),
      prefabRootName: d("prefabRootName"),
    });
  }
  return i;
}
function Er(e, t) {
  let n = e;
  for (let r of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return null;
    n = n[r];
  }
  return typeof n == "string" ? (n === "0" ? null : n) : typeof n == "number" ? (n === 0 ? null : String(n)) : null;
}
function xb(e, t) {
  let n = e;
  for (let r of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return null;
    n = n[r];
  }
  if (typeof n == "number") return Number.isSafeInteger(n) ? n : null;
  if (typeof n == "string") {
    let r = n.trim();
    if (!/^-?\d+$/.test(r)) return null;
    let i = Number(r);
    return Number.isSafeInteger(i) ? i : null;
  }
  return null;
}
function Tb(e, t) {
  let n = e;
  for (let r of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return [];
    n = n[r];
  }
  return Array.isArray(n) ? n.map((r) => Ri(r)).filter((r) => r !== null) : [];
}
function qs(e, t, n) {
  let r = e.match(n),
    i = r?.[1];
  return { value: i === void 0 ? null : _f(i), covered: r !== null || !t.test(e) };
}
function UL(e) {
  let t = e.match(/^[ \t]*m_Children:\s*([^\r\n]*)/m);
  if (!t) return { value: void 0, covered: !0 };
  if (t[1]?.trim() === "[]") return { value: [], covered: !0 };
  let n = e.match(/^[ \t]*m_Children:\s*\r?\n((?:[ \t]*-[^\r\n]*(?:\r?\n|$))*)/m)?.[1];
  return n === void 0
    ? { value: void 0, covered: !1 }
    : {
        value: [...n.matchAll(/\{\s*fileID:\s*([^,}\s]+)/g)]
          .map((r) => r[1])
          .filter((r) => r !== void 0 && r !== "0")
          .map(_f),
        covered: !0,
      };
}
function AL(e) {
  let t = e.match(/propertyPath:\s*m_Name\s*\n\s*value:\s*([^\n\r]+)/m),
    n = t?.[1]?.trim();
  return { value: n ? _f(n) : null, covered: t !== null || !/^[ \t]*(?:-\s*)?propertyPath:\s*m_Name\s*$/m.test(e) };
}
function _f(e) {
  return Buffer.from(e, "utf8").toString("utf8");
}
function LL(e, t) {
  if (typeof t == "function") return t(e);
  if (!t.has(e.id)) throw new Error(`YAML payload ${e.id} was not hydrated for metadata enrichment.`);
  return t.get(e.id);
}
function OL(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  let t = e.m_Modifications;
  if (!Array.isArray(t)) return null;
  for (let n of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) continue;
    let r = n;
    if (r.propertyPath === "m_Name" && typeof r.value == "string") return r.value.trim() || null;
  }
  return null;
}
function Sf(e) {
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
function CL() {
  return {
    gameObjectFileId: null,
    parentTransformLocalId: null,
    sourcePrefabGuid: null,
    prefabTransformParentLocalId: null,
    prefabRootName: null,
  };
}
var kb = { intAsBigInt: !0, uniqueKeys: !1 };
function Ub() {
  return { splitBlocksMs: 0, parseDocumentsMs: 0, collectReferencesMs: 0 };
}
function al(e) {
  return e.length >= 5 && e.subarray(0, 5).toString("ascii") === "%YAML";
}
function Ab(e, t) {
  let n = t ? Date.now() : 0,
    r = /^--- !u!(\d+)\s+&([^\s]+)(?:\s+.*)?$/gm,
    i = [...e.matchAll(r)],
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
    i.forEach((u, f) => {
      let m = u.index ?? 0,
        y = f + 1 < i.length ? (i[f + 1].index ?? e.length) : e.length,
        g = e.indexOf(
          `
`,
          m,
        );
      if (g < 0 || g >= y) return;
      let h = e
        .slice(g + 1, y)
        .trimEnd()
        .replace(
          /\r\n/g,
          `
`,
        );
      if (h.length === 0) return;
      let b = Number(u[1]),
        S = u[2] ?? null,
        P = h.indexOf(`
`),
        E = (P < 0 ? h : h.slice(0, P)).match(/^([A-Za-z0-9_]+):\s*$/);
      if (!E) return;
      let w = E[1],
        T = t ? Date.now() : 0,
        x = ML(h),
        O = { objectType: w, rootObjectCount: 0, nameCount: 0, name: null },
        Y = $L(x.contents, O)?.[w] ?? {},
        K = S.split(/\s+/)[0],
        _ = l(m),
        L = _ + VL(h) + 1,
        N = O.rootObjectCount === 1 && O.nameCount === 1 ? O.name : null;
      (t && (t.parseDocumentsMs += Date.now() - T),
        c.push({
          docIndex: f,
          unityClassId: b,
          anchor: S,
          objectType: w,
          localIdentifier: K,
          gameObjectFileId: _r(Y.m_GameObject, "fileID"),
          componentTypeName: w === "MonoBehaviour" ? w : null,
          scriptGuid: _r(Y.m_Script, "guid"),
          scriptFileId: _r(Y.m_Script, "fileID"),
          name: N,
          payload: Y,
          metadata: wb(h),
          lineStart: _,
          lineEnd: L,
        }));
      let j = t ? Date.now() : 0;
      (ol(Y, K, "", d), t && (t.collectReferencesMs += Date.now() - j));
    }),
    { objects: c, references: d }
  );
}
function ML(e) {
  let t = St.default.parseDocument(e, kb);
  if (t.errors.length === 0) return t;
  let n = FL(e);
  if (n === e) throw new Error(t.errors.map((i) => i.message).join("; "));
  let r = St.default.parseDocument(n, kb);
  if (r.errors.length > 0) throw new Error(r.errors.map((i) => i.message).join("; "));
  return r;
}
function FL(e) {
  return BL(DL(e));
}
function DL(e) {
  let t = e.split(/\r?\n/),
    n = [],
    r = !1;
  for (let i = 0; i < t.length; i += 1) {
    let s = t[i] ?? "",
      o = s.match(/^(\s*[^:\n]+:\s*)'(.*)$/);
    if (!o) {
      n.push(s);
      continue;
    }
    let a = o[1] ?? "",
      l = Nb(o[2] ?? "");
    if (l.closed) {
      n.push(s);
      continue;
    }
    let c = l.value,
      d = [s],
      u = i + 1,
      f = !1;
    for (; u < t.length; u += 1) {
      let m = t[u] ?? "";
      d.push(m);
      let y = Nb(m.replace(/^\s+/, ""));
      if (
        (y.value.length === 0
          ? y.closed ||
            (c += `
`)
          : (c = jL(c, y.value)),
        y.closed)
      ) {
        f = !0;
        break;
      }
    }
    if (!f) {
      (n.push(...d), (i = u - 1));
      continue;
    }
    ((r = !0), n.push(`${a}${JSON.stringify(c.replace(/\n+$/, ""))}`), (i = u));
  }
  return r
    ? n.join(`
`)
    : e;
}
function Nb(e) {
  let t = "";
  for (let n = 0; n < e.length; n += 1) {
    let r = e[n];
    if (r === "'") {
      if (e[n + 1] === "'") {
        ((t += "'"), (n += 1));
        continue;
      }
      return { value: t, closed: !0 };
    }
    t += r;
  }
  return { value: t, closed: !1 };
}
function jL(e, t) {
  return e.length === 0 ||
    e.endsWith(`
`)
    ? `${e}${t}`
    : `${e} ${t}`;
}
function BL(e) {
  let t = e.split(/\r?\n/);
  if (t.length < 2 || !/^[A-Za-z0-9_]+:\s*$/.test(t[0] ?? "")) return e;
  let n = !1,
    r = t.map((i, s) => (s > 0 && i.length > 0 && !/^\s/.test(i) ? ((n = !0), `  ${i}`) : i));
  return n
    ? r.join(`
`)
    : e;
}
function VL(e) {
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
function $L(e, t) {
  if (!(0, St.isMap)(e)) return En(e);
  let n = {};
  for (let r of e.items) {
    let i = String(En(r.key)),
      s = i === t.objectType;
    s && (t.rootObjectCount += 1);
    let o = s ? GL(r.value, t) : En(r.value);
    Ef(n, i, o);
  }
  return n;
}
function GL(e, t) {
  if (!(0, St.isMap)(e)) return En(e);
  let n = {};
  for (let r of e.items) {
    let i = String(En(r.key));
    (i === "m_Name" && ((t.nameCount += 1), (t.name = KL(r.value))), Ef(n, i, En(r.value)));
  }
  return n;
}
function En(e) {
  if (e == null) return null;
  if ((0, St.isScalar)(e)) return typeof e.value == "bigint" ? e.value.toString() : e.value;
  if ((0, St.isSeq)(e)) return e.items.map((t) => En(t));
  if ((0, St.isMap)(e)) {
    let t = {};
    for (let n of e.items) {
      let r = String(En(n.key));
      Ef(t, r, En(n.value));
    }
    return t;
  }
  return e;
}
function KL(e) {
  if (e === null) return "";
  if (!(0, St.isScalar)(e)) return null;
  let t = e;
  return typeof t.value == "string"
    ? t.value
    : typeof t.source == "string"
      ? t.source
      : t.value === null || t.value === void 0
        ? ""
        : String(t.value);
}
function Ef(e, t, n) {
  let r = e[t];
  Object.hasOwn(e, t) ? (Array.isArray(r) ? r.push(n) : (e[t] = [r, n])) : (e[t] = n);
}
function Ob(e) {
  let t = e.filter((n) => n.kind === "csharp").length;
  return { totalWorkUnits: e.length + t, csharpFileCount: t };
}
function Lb(e, t) {
  let n = e.get(t);
  if (n === void 0) throw new Error(`Missing assigned file ID for '${t}'.`);
  return n;
}
async function Cb(e, t, n, r = {}, i = {}) {
  let { stopwatch: s } = r;
  s?.start("discovery");
  let o = await ui(t, { includePackages: i.includePackages });
  (r.onDiscoveryComplete?.(o.files.length), s?.stop("discovery"));
  let { totalWorkUnits: a } = Ob(o.files),
    l = 0,
    c = (y) => {
      r.onExtractProgress?.(l, a, y);
    };
  s?.start("prepare_files");
  let d = await Mb(o.files, {
    onProgress: () => {
      ((l += 1), c());
    },
    diagnostics: n,
  });
  (s?.stop("prepare_files"),
    s?.start("write_files"),
    xg(e, d),
    oa(e, sa(d, n)),
    s?.stop("write_files"),
    s?.start("parse_csharp"));
  let { declarationRows: u, mentionRows: f } = await Bb(d, n, {
    onProgress: (y, g) => {
      ((l = o.files.length + y), c(`Parsing C# sources (${y}/${g})`));
    },
  });
  (s?.stop("parse_csharp"),
    s?.start("write_csharp"),
    Ud(e, u, f),
    s?.stop("write_csharp"),
    r.onExtractComplete?.(d.length));
  let m = 0;
  for (let y of d) m += y.sizeBytes;
  return { discoveredFileCount: d.length, discoveredTotalBytes: m };
}
async function Mb(e, t = {}, n = {}) {
  let r = new Map(),
    i = new Map();
  e.forEach((a, l) => {
    (i.set(a.projectRelPath, l + 1), a.kind === "meta" && r.set(a.projectRelPath.slice(0, -5), a));
  });
  let s = n.pathToFileId ?? i,
    o = 0;
  return qL(e, ng(), async (a) => {
    let l = a.kind === "meta" ? void 0 : r.get(a.projectRelPath),
      c = a.kind === "meta" || l ? null : await JL(a.absolutePath),
      d = l ? Lb(s, l.projectRelPath) : (n.metaPathToFileId?.get(`${a.projectRelPath}.meta`) ?? null),
      u = Lb(s, a.projectRelPath),
      f = await zL(a.absolutePath),
      m = await HL(a, t.diagnostics ?? []),
      y = {
        id: u,
        projectRelPath: a.projectRelPath,
        absolutePath: a.absolutePath,
        kind: a.kind,
        guid: a.guid ?? l?.guid ?? c?.guid ?? null,
        metaFileId: d,
        sizeBytes: a.sizeBytes,
        mtimeMs: a.mtimeMs,
        contentHash: f,
        importerType: a.importerType ?? l?.importerType ?? c?.importerType ?? null,
        contentText: m,
      };
    return ((o += 1), t.onProgress?.(o, e.length), y);
  });
}
async function qL(e, t, n) {
  let r = new Array(e.length),
    i = 0,
    s = Math.min(t, e.length);
  async function o() {
    for (;;) {
      let a = i;
      if (((i += 1), a >= e.length)) return;
      r[a] = await n(e[a], a);
    }
  }
  return (await Promise.all(Array.from({ length: s }, () => o())), r);
}
async function zL(e) {
  let t = WL("sha256");
  return (
    await new Promise((n, r) => {
      let i = YL(e);
      (i.on("data", (s) => {
        t.update(s);
      }),
        i.once("error", r),
        i.once("end", n));
    }),
    t.digest("hex")
  );
}
async function HL(e, t) {
  if (!QL(e.projectRelPath)) return null;
  let n = await Rf(e.absolutePath);
  return XL(e, n, t);
}
function QL(e) {
  let t = Lt(e);
  return t === "unity-yaml" || t === "meta" ? !1 : is(e) !== "binary";
}
function XL(e, t, n) {
  return is(e.projectRelPath) === "binary"
    ? null
    : Lt(e.projectRelPath) === "unity-yaml"
      ? al(t)
        ? t.toString("utf8")
        : null
      : t.toString("utf8");
}
async function JL(e) {
  try {
    return ci(await Rf(`${e}.meta`, "utf8"));
  } catch {
    return null;
  }
}
var ZL = new Set(["asmdef", "asmref", "package-manifest"]);
async function Fb(e) {
  return Promise.all(
    e.map(async (t) => {
      let n = null;
      return (
        ZL.has(t.kind) && (n = await Rf(t.absolutePath, "utf8").catch(() => null)),
        { projectRelPath: t.projectRelPath, kind: t.kind, contentText: n }
      );
    }),
  );
}
function wf(e, t, n, r, i, s, o) {
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
      { nextObjectId: r, nextReferenceId: i }
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
      { nextObjectId: r, nextReferenceId: i }
    );
  let a = new Map();
  return (
    t.extracted.objects.forEach((l) => {
      let c = r;
      ((r += 1), a.set(l.localIdentifier, c), s.push(eO(e.id, c, l)));
    }),
    t.extracted.references.forEach((l) => {
      let c = a.get(l.sourceLocalIdentifier);
      c &&
        (o.push({
          id: i,
          fileId: e.id,
          sourceYamlObjectId: c,
          fieldPath: l.fieldPath,
          targetGuid: l.targetGuid,
          targetFileId: l.targetFileId,
          targetLocalId: l.targetLocalId,
          refKind: l.refKind,
        }),
        (i += 1));
    }),
    { nextObjectId: r, nextReferenceId: i }
  );
}
function eO(e, t, n) {
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
function Db(e, t) {
  if (!e || t.length === 0) return;
  let n = 0,
    r = 0,
    i = 0;
  for (let s of t) ((n += s.splitBlocksMs), (r += s.parseDocumentsMs), (i += s.collectReferencesMs));
  (e.recordDuration("split_yaml_blocks", n),
    e.recordDuration("parse_yaml_documents", r),
    e.recordDuration("collect_yaml_references", i));
}
async function jb(e, t, n, r, i = {}) {
  if (n.length === 0) return { extractedFileCount: 0, refreshedYamlFileIds: [] };
  let s = e.prepare("SELECT id, project_rel_path FROM files").all(),
    o = new Map(s.map((h) => [h.project_rel_path, h.id])),
    a = new Map(s.filter((h) => h.project_rel_path.endsWith(".meta")).map((h) => [h.project_rel_path, h.id])),
    l = Oe(e, "files"),
    c = new Map();
  for (let h of n) {
    let b = o.get(h.projectRelPath);
    b !== void 0 ? c.set(h.projectRelPath, b) : c.set(h.projectRelPath, l++);
  }
  let d = await Mb(n, { diagnostics: r, onProgress: () => {} }, { pathToFileId: c, metaPathToFileId: a });
  for (let h of [...d].sort((b, S) => (b.kind === S.kind ? b.id - S.id : b.kind === "meta" ? -1 : 1)))
    o.has(h.projectRelPath) ? Pg(e, h) : (vg(e, h), o.set(h.projectRelPath, h.id));
  let { totalWorkUnits: u } = Ob(n),
    f = 0,
    m = (h) => {
      i.onProgress?.(f, u, h);
    },
    { declarationRows: y, mentionRows: g } = await Bb(
      d,
      r,
      {
        onProgress: (h, b) => {
          ((f = n.length + h), m(`Parsing C# sources (${h}/${b})`));
        },
      },
      { nextDeclarationId: Oe(e, "cs_declarations"), nextMentionId: Oe(e, "cs_mentions") },
    );
  return (
    Ud(e, y, g),
    {
      extractedFileCount: d.length,
      refreshedYamlFileIds: d.filter((h) => Lt(h.projectRelPath) === "unity-yaml").map((h) => h.id),
    }
  );
}
async function Bb(e, t, n = {}, r = {}) {
  let i = e.filter((d) => d.kind === "csharp"),
    s = [],
    o = [],
    a = r.nextDeclarationId ?? 1,
    l = r.nextMentionId ?? 1,
    c = 0;
  for (let d of i)
    try {
      let u = await Eg(d.contentText ?? ""),
        f = u.declarations.map((m) => ({
          id: a++,
          fileId: d.id,
          declKind: m.declKind,
          simpleName: m.simpleName,
          qualifiedNameText: m.qualifiedNameText,
          signatureText: m.signatureText,
          skeletonText: m.skeletonText ?? null,
          lineStart: m.lineStart,
          lineEnd: m.lineEnd,
        }));
      (s.push(...f),
        u.mentions.forEach((m) => {
          if (!m.containingDeclarationSimpleName) return;
          let y = f.find(
            (g) =>
              g.simpleName === m.containingDeclarationSimpleName &&
              g.lineStart <= m.lineStart &&
              g.lineEnd >= m.lineEnd,
          );
          y &&
            o.push({
              id: l++,
              fileId: d.id,
              mentionKind: m.mentionKind,
              text: m.text,
              receiverText: m.receiverText,
              argumentArity: m.argumentArity,
              containingDeclarationId: y.id,
              lineStart: m.lineStart,
              lineEnd: m.lineEnd,
            });
        }));
    } catch (u) {
      t.push({
        severity: "error",
        category: "extract",
        stage: "extract",
        filePath: d.projectRelPath,
        message: `Failed to parse C# file: ${tO(u)}`,
      });
    } finally {
      ((c += 1), n.onProgress?.(c, i.length));
    }
  return { declarationRows: s, mentionRows: o };
}
function tO(e) {
  return e instanceof Error ? e.message : String(e);
}
import { readFileSync as OM } from "node:fs";
import { readFile as CM } from "node:fs/promises";
import { readFile as sO } from "node:fs/promises";
import zs from "node:path";
var nO = /^[0-9a-fA-F]{32}$/;
function Vb(e) {
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
function rO(e) {
  if (!$b(e)) return null;
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
function $b(e) {
  return nO.test(e);
}
function Rr(e) {
  let t = e.trim();
  if (!t) return [];
  let n = new Set([t]);
  if ($b(t)) {
    let r = t.toLowerCase();
    n.add(r);
    let i = rO(r);
    i && n.add(i);
    let s = Vb(Buffer.from(r, "hex"));
    return (s && n.add(s), [...n]);
  }
  for (let r of iO(t)) {
    let i = Vb(r);
    i && n.add(i);
  }
  return [...n];
}
function iO(e) {
  let t = [],
    n = e.includes("/") ? e.split("/") : [e];
  for (let r of n) {
    let i = r.trim();
    if (i) {
      try {
        t.push(Buffer.from(i, "base64"));
      } catch {}
      try {
        t.push(Buffer.from(i, "base64url"));
      } catch {}
    }
  }
  try {
    t.push(Buffer.from(e.trim(), "base64"));
  } catch {}
  return t;
}
var Pf = 1;
async function Hs(e) {
  let t = new Map(e.files.map((g) => [g.id, g])),
    n = new Map(e.assemblies.map((g) => [g.name, g.id])),
    r = await lO(e.files, n),
    i = cO(e.files, r, n),
    s = 0;
  for (let g of e.persistedSymbols ?? []) s = Math.max(s, g.id);
  let o = s + 1,
    a = uO(e.files, e.declarations, i, o);
  e.persistedSymbols && e.persistedSymbols.length > 0 && aO(a.index, e.persistedSymbols);
  let c = { value: Math.max(a.maxSymbolId, s) + 1 },
    d = new Map(),
    u = pO(a.index, t, c, d),
    f = e.mentionFileIds === void 0 ? e.mentions : e.mentions.filter((g) => e.mentionFileIds?.has(g.fileId)),
    m = gO(f, a.index, i, t, c, d),
    y = oO([...a.symbols, ...[...d.values()].sort((g, h) => g.id - h.id)]);
  return { symbols: y, edges: u, bindings: m, fileAssemblyIdByFileId: i, scriptSymbolByFileGuid: Yb(t, y) };
}
function oO(e) {
  let t = new Map();
  for (let n of e) t.has(n.id) || t.set(n.id, n);
  return [...t.values()].sort((n, r) => n.id - r.id);
}
function aO(e, t) {
  for (let n of t) {
    if (e.byId.has(n.id)) continue;
    (e.byId.set(n.id, n), n.declarationId !== null && e.byDeclarationId.set(n.declarationId, n));
    let r = wi(n.assemblyId, n.qualifiedName);
    (e.byKey.has(r) || e.byKey.set(r, n),
      e.byQualifiedName.has(n.qualifiedName) || e.byQualifiedName.set(n.qualifiedName, n));
    let i = e.bySimpleName.get(n.simpleName) ?? [];
    i.some((s) => s.id === n.id) || (i.push(n), e.bySimpleName.set(n.simpleName, i));
  }
}
function Kb(e, t) {
  let n = new Map(e.map((r) => [r.id, r]));
  return Yb(n, t);
}
function Wb(e, t) {
  let n = new Map();
  for (let r of e)
    if (!(r.kind !== "csharp" || !r.guid))
      for (let i of Rr(r.guid)) {
        let s = t.get(i);
        s && vf(s) && n.set(s.id, s);
      }
  return [...n.values()].sort((r, i) => r.id - i.id);
}
async function lO(e, t) {
  let n = new Map(),
    r = e.filter((i) => i.kind === "asmdef");
  for (let i of r)
    try {
      let s = await sO(i.absPath, "utf8"),
        o = mr(s),
        a = t.get(o.name);
      a && n.set(zs.posix.dirname(i.projectRelPath), a);
    } catch {}
  return n;
}
function cO(e, t, n) {
  let r = new Map();
  for (let i of e) {
    if (i.kind !== "csharp") continue;
    let s = dO(i.projectRelPath, t);
    if (s) {
      r.set(i.id, s);
      continue;
    }
    let o = i.projectRelPath.toLowerCase().includes("/editor/") ? "Assembly-CSharp-Editor" : "Assembly-CSharp";
    r.set(i.id, n.get(o) ?? null);
  }
  return r;
}
function dO(e, t) {
  let n = zs.posix.dirname(e);
  for (; n !== "." && n !== "";) {
    let r = t.get(n);
    if (r) return r;
    n = zs.posix.dirname(n);
  }
  return null;
}
function uO(e, t, n, r = 1) {
  let i = [],
    s = new Map(),
    o = new Map(),
    a = new Map(),
    l = new Map(e.map((y) => [y.id, y])),
    c = new Map(),
    d = [],
    u = r;
  for (let y of t) {
    let g = n.get(y.fileId) ?? null,
      h = bO(y.qualifiedNameText ?? y.simpleName, y.declKind, y.signatureText);
    if (!h) continue;
    Gb(h, g, y.fileId, d);
    let b = wi(g, h),
      S = a.get(b),
      P = hO(y.declKind),
      I = _O(y.signatureText),
      E = EO(y.signatureText);
    if ((fO(c, b, y, l), S)) {
      ((S.lineStart = UO(S.lineStart, y.lineStart)),
        (S.lineEnd = AO(S.lineEnd, y.lineEnd)),
        (S.baseSymbolName = S.baseSymbolName ?? E),
        (S.visibility = S.visibility ?? I),
        S.fileId || (S.fileId = y.fileId),
        o.set(y.id, S));
      continue;
    }
    let w = ll(h),
      T = {
        id: u++,
        projectId: Pf,
        assemblyId: g,
        fileId: y.fileId,
        declarationId: y.id,
        symbolKind: P,
        simpleName: y.simpleName,
        qualifiedName: h,
        displayName: IO(h, y.simpleName),
        signature: y.signatureText,
        containingSymbolId: null,
        baseSymbolName: E,
        isExternalStub: 0,
        visibility: I,
        skeletonContent: null,
        lineStart: y.lineStart,
        lineEnd: y.lineEnd,
      };
    (i.push(T), s.set(T.id, T), o.set(y.id, T), a.set(b, T), P === "namespace" && Gb(w ?? "", g, y.fileId, d));
  }
  for (let y of d) {
    if (!y.namespaceName) continue;
    let g = wi(y.assemblyId, y.namespaceName);
    if (a.has(g)) continue;
    let h = y.namespaceName.split(".").pop() ?? y.namespaceName,
      b = {
        id: u++,
        projectId: Pf,
        assemblyId: y.assemblyId,
        fileId: y.fileId,
        declarationId: null,
        symbolKind: "namespace",
        simpleName: h,
        qualifiedName: y.namespaceName,
        displayName: y.namespaceName,
        signature: null,
        containingSymbolId: null,
        baseSymbolName: null,
        isExternalStub: 0,
        visibility: null,
        skeletonContent: null,
        lineStart: null,
        lineEnd: null,
      };
    (i.push(b), s.set(b.id, b), a.set(g, b));
  }
  for (let y of i) {
    let g = ll(y.qualifiedName);
    if (!g) continue;
    let h = a.get(wi(y.assemblyId, g));
    y.containingSymbolId = h?.id ?? null;
  }
  mO(a, c);
  let f = new Map(),
    m = new Map();
  for (let y of i) {
    f.has(y.qualifiedName) || f.set(y.qualifiedName, y);
    let g = m.get(y.simpleName) ?? [];
    (g.push(y), m.set(y.simpleName, g));
  }
  return {
    symbols: i,
    index: { byId: s, byDeclarationId: o, byKey: a, byQualifiedName: f, bySimpleName: m },
    maxSymbolId: u - 1,
  };
}
function fO(e, t, n, r) {
  let i = r.get(n.fileId),
    s = e.get(t) ?? [];
  (s.push({
    fileId: n.fileId,
    declarationId: n.id,
    projectRelPath: i?.projectRelPath ?? "",
    lineStart: n.lineStart,
    lineEnd: n.lineEnd,
    skeletonContent: n.skeletonContent?.trim() ? n.skeletonContent : null,
  }),
    e.set(t, s));
}
function mO(e, t) {
  for (let [n, r] of t) {
    let i = e.get(n);
    if (!i || r.length === 0) continue;
    let s = [...r].sort(yO),
      o = s[0];
    ((i.fileId = o.fileId), (i.declarationId = o.declarationId));
    let a = s.map((l) => l.skeletonContent).filter((l) => !!l);
    i.skeletonContent =
      a.length > 0
        ? a.join(`

`)
        : null;
  }
}
function yO(e, t) {
  return (
    e.projectRelPath.localeCompare(t.projectRelPath) ||
    e.lineStart - t.lineStart ||
    e.lineEnd - t.lineEnd ||
    e.declarationId - t.declarationId
  );
}
function pO(e, t, n, r) {
  let i = [],
    s = 1;
  for (let o of e.byId.values()) {
    o.containingSymbolId &&
      i.push({
        id: s++,
        fromSymbolId: o.id,
        toSymbolId: o.containingSymbolId,
        edgeKind: "contains",
        sourceFileId: o.fileId,
      });
    let a = qb(o.signature);
    if (a.length === 0) continue;
    let l = o.assemblyId;
    a.map((d) => {
      let u = e.byKey.get(wi(l, d)) ?? wO(d, o, e.bySimpleName.get(Qs(d)) ?? []);
      return u ? u.id : Hb(d, "class", n, r, e).id;
    }).forEach((d, u) => {
      i.push({
        id: s++,
        fromSymbolId: o.id,
        toSymbolId: d,
        edgeKind: u === 0 ? "inherits" : "implements",
        sourceFileId: t.get(o.fileId ?? -1)?.id ?? null,
      });
    });
  }
  return i;
}
function gO(e, t, n, r, i, s) {
  let o = [],
    a = 1;
  for (let l of e) {
    let c = t.byDeclarationId.get(l.containingDeclarationId);
    if (!c) continue;
    let d = RO(l, c, n.get(l.fileId) ?? null, t),
      u = d[0],
      f = d[1],
      m = vO(l, u?.symbol ?? null);
    if (u && (!f || u.score > f.score)) {
      o.push({
        id: a++,
        mentionId: l.id,
        sourceSymbolId: c.id,
        targetSymbolId: u.symbol.id,
        bindingKind: m,
        resolutionStatus: "resolved",
        confidence: u.score >= 4 ? 1 : 0.8,
      });
      continue;
    }
    if (u && f && u.score === f.score) {
      o.push({
        id: a++,
        mentionId: l.id,
        sourceSymbolId: c.id,
        targetSymbolId: null,
        bindingKind: m,
        resolutionStatus: "ambiguous",
        confidence: 0.25,
      });
      continue;
    }
    if (TO(l.text, l.receiverText)) {
      let y = Hb(l.text, kO(l.text), i, s, t);
      o.push({
        id: a++,
        mentionId: l.id,
        sourceSymbolId: c.id,
        targetSymbolId: y.id,
        bindingKind: m,
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
      bindingKind: m,
      resolutionStatus: "unresolved",
      confidence: 0,
    });
  }
  return o;
}
function Yb(e, t) {
  let n = new Map(),
    r = t
      .filter((s) => s.isExternalStub === 0 && ["class", "struct", "enum"].includes(s.symbolKind))
      .sort((s, o) => s.id - o.id);
  for (let s of r) {
    if (!s.fileId) continue;
    let o = e.get(s.fileId);
    if (!o?.guid) continue;
    let a = n.get(o.guid) ?? [];
    (a.push(s), n.set(o.guid, a));
  }
  let i = new Map();
  for (let [s, o] of n.entries()) {
    let a = [...e.values()].find((d) => d.guid === s)?.projectRelPath,
      l = a ? zs.posix.basename(a, zs.posix.extname(a)) : null,
      c =
        o.find((d) => l !== null && d.simpleName === l && vf(d)) ??
        o.find((d) => vf(d)) ??
        o.find((d) => d.symbolKind === "class") ??
        o[0];
    if (c) for (let d of Rr(s)) i.set(d, c);
  }
  return i;
}
function Gb(e, t, n, r) {
  if (!e.includes(".")) return;
  let i = e.split(".");
  for (let s = 1; s < i.length; s += 1) r.push({ assemblyId: t, namespaceName: i.slice(0, s).join("."), fileId: n });
}
function hO(e) {
  return e === "constructor" ? "method" : e === "struct" ? "struct" : e;
}
function wi(e, t) {
  return `${e ?? "null"}:${t}`;
}
function ll(e) {
  return e.includes(".") ? e.split(".").slice(0, -1).join(".") : null;
}
function IO(e, t) {
  let n = ll(e);
  return n ? `${n.split(".").pop() ?? n}.${t}` : t;
}
function bO(e, t, n) {
  if (!["method", "constructor"].includes(t) || !n) return e;
  let r = SO(n);
  return `${e}(${r})`;
}
function SO(e) {
  let t = e.match(/\((.*)\)/);
  if (!t) return "";
  let n = t[1]?.trim() ?? "";
  return n
    ? n
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
        .map((r) => {
          let i = r
              .replace(/\b(params|ref|out|in|this)\b/g, "")
              .replace(/\s+/g, " ")
              .trim(),
            s = i.split(" ");
          return s.length <= 1 ? cl(i) : cl(s.slice(0, -1).join(" "));
        })
        .join(",")
    : "";
}
function _O(e) {
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
function EO(e) {
  return qb(e)[0] ?? null;
}
function qb(e) {
  if (!e) return [];
  let t = e.match(/\b(?:class|struct|interface)\s+[A-Za-z_][A-Za-z0-9_<>]*\s*:\s*([^{]+)/);
  return t?.[1]
    ? t[1]
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean)
        .map(cl)
    : [];
}
function cl(e) {
  return e.replace(/<.*>/g, "").trim();
}
function RO(e, t, n, r) {
  let i = r.byKey.get(wi(n, e.text));
  if (i) return [{ symbol: i, score: 5 }];
  let s = Qs(e.text);
  return (r.bySimpleName.get(s) ?? [])
    .map((a) => ({ symbol: a, score: zb(a, t, n, e) }))
    .filter((a) => a.score > 0)
    .sort((a, l) => l.score - a.score);
}
function wO(e, t, n) {
  let r = n.map((i) => ({ candidate: i, score: zb(i, t, t.assemblyId, null) })).sort((i, s) => s.score - i.score)[0];
  return r && r.score > 0 ? r.candidate : null;
}
function zb(e, t, n, r) {
  let i = 0;
  return (
    e.assemblyId === n && (i += 2),
    r && e.fileId === r.fileId && (i += 1),
    e.containingSymbolId === t.containingSymbolId && (i += 2),
    e.containingSymbolId === t.id && (i += 2),
    r && r.text.includes(".") && e.qualifiedName.endsWith(`.${r.text}`) && (i += 3),
    r && r.argumentArity !== null && e.symbolKind === "method" && xO(e) === r.argumentArity && (i += 3),
    r && PO(r, e) && (i += 4),
    i
  );
}
function PO(e, t) {
  if (!e.receiverText || t.symbolKind !== "method") return !1;
  let n = ll(t.qualifiedName);
  if (!n) return !1;
  let r = Qs(n);
  return e.receiverText
    .split(/[^A-Za-z0-9_]+/)
    .filter(Boolean)
    .includes(r);
}
function vO(e, t) {
  return t?.symbolKind === "method"
    ? "invokes"
    : (t && ["class", "interface", "enum", "struct", "namespace"].includes(t.symbolKind)) || xf(e.text)
      ? "references_type"
      : (e.receiverText, "references_member");
}
function vf(e) {
  let t = e.baseSymbolName ?? "";
  return /(?:^|\.)(MonoBehaviour|Behaviour|ScriptableObject|Component)$/.test(t);
}
function xO(e) {
  if (e.symbolKind !== "method") return null;
  let t = e.qualifiedName.match(/\((.*)\)$/);
  if (!t) return null;
  let n = t[1]?.trim() ?? "";
  return n
    ? n
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean).length
    : 0;
}
function TO(e, t) {
  return t !== null || xf(e) || e.includes(".");
}
function xf(e) {
  return /^[A-Z][A-Za-z0-9_.]+$/.test(Qs(e));
}
function kO(e) {
  return xf(e) ? "class" : "field";
}
function Hb(e, t, n, r, i) {
  let s = cl(e),
    o = r.get(s);
  if (o) return o;
  let a = NO(i, s);
  if (a) return a;
  let l = Qs(s),
    c = {
      id: n.value++,
      projectId: Pf,
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
  return (r.set(s, c), c);
}
function NO(e, t) {
  return e.byQualifiedName.get(t);
}
function Qs(e) {
  return e.split(".").pop() ?? e;
}
function UO(e, t) {
  return e === null ? t : t === null ? e : Math.min(e, t);
}
function AO(e, t) {
  return e === null ? t : t === null ? e : Math.max(e, t);
}
function wr(e, t) {
  if (t.length === 0) return [];
  let n = ze(t.length);
  return e
    .prepare(
      `SELECT id
         FROM files
         WHERE kind = 'csharp'
           AND id IN (${n})
         ORDER BY id`,
    )
    .all(...t)
    .map((r) => r.id);
}
function Xb(e, t) {
  if (t.length === 0) return [];
  let n = ze(t.length),
    r = e.prepare(`SELECT id FROM symbols WHERE file_id IN (${n})`).all(...t);
  if (r.length === 0) return [];
  let i = new Set(t),
    s = r.map((l) => l.id),
    o = ze(s.length),
    a = e
      .prepare(
        `SELECT DISTINCT mentions.file_id AS file_id
       FROM semantic_bindings bindings
       JOIN cs_mentions mentions ON mentions.id = bindings.mention_id
       WHERE bindings.target_symbol_id IN (${o})
          OR bindings.source_symbol_id IN (${o})`,
      )
      .all(...s, ...s);
  return Qe(a.map((l) => l.file_id).filter((l) => !i.has(l)));
}
function dl(e, t) {
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
      .map(Qb);
  let n = ze(t.length);
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
    .map(Qb);
}
function Qb(e) {
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
function Xs(e, t, n, r) {
  let i = [...t].sort((a, l) => {
      let c = Jb(a.qualifiedName) - Jb(l.qualifiedName);
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
  qe(e, () => {
    for (let a of i)
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
    LO(e, r);
  });
}
function LO(e, t) {
  if (t.length === 0) return;
  let n = 7,
    r = ur(n),
    i = `INSERT INTO semantic_bindings (
      id,
      mention_id,
      source_symbol_id,
      target_symbol_id,
      binding_kind,
      resolution_status,
      confidence
    ) VALUES `,
    s = t.length >= r ? e.prepare(`${i}${Mt(r, n)}`) : null;
  for (let o of He(t, r))
    (o.length === r ? s : e.prepare(`${i}${Mt(o.length, n)}`)).run(
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
function Zb(e, t) {
  let n = e.prepare(`INSERT INTO assets (
      id,
      project_id,
      file_id,
      asset_kind,
      guid,
      name,
      vfs_root_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  qe(e, () => {
    for (let r of t) n.run(r.id, r.projectId, r.fileId, r.assetKind, r.guid, r.name, r.vfsRootPath);
  });
}
function Tf(e, t) {
  let n = OO(t),
    r = e.prepare(`INSERT INTO entities (
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
  qe(e, () => {
    for (let i of n)
      r.run(
        i.id,
        i.assetId,
        i.yamlObjectId,
        i.entityKind,
        i.localKey,
        i.name,
        i.hierarchyName ?? null,
        i.hierarchyOrder ?? i.id,
        i.typeName,
        i.scriptSymbolId,
        i.parentEntityId,
        i.sourceEntityId,
        i.lineStart,
        i.lineEnd,
        i.generatedContent ?? null,
      );
  });
}
function eS(e, t) {
  let n = e.prepare(`INSERT INTO entity_edges (
      id,
      from_entity_id,
      to_entity_id,
      edge_kind,
      edge_subkind
    ) VALUES (?, ?, ?, ?, ?)`);
  qe(e, () => {
    for (let r of t) n.run(r.id, r.fromEntityId, r.toEntityId, r.edgeKind, r.edgeSubkind ?? null);
  });
}
function tS(e, t) {
  let n = e.prepare(`INSERT INTO entity_symbol_edges (
      id,
      from_entity_id,
      to_symbol_id,
      edge_kind,
      edge_subkind,
      source_field_path
    ) VALUES (?, ?, ?, ?, ?, ?)`);
  qe(e, () => {
    for (let r of t)
      n.run(r.id, r.fromEntityId, r.toSymbolId, r.edgeKind, r.edgeSubkind ?? null, r.sourceFieldPath ?? null);
  });
}
function nS(e, t) {
  if (t.length === 0) return;
  let n = e.prepare(`UPDATE entities
     SET source_entity_id = ?
     WHERE id = ?`);
  qe(e, () => {
    for (let r of t) n.run(r.sourceEntityId, r.entityId);
  });
}
function rS(e, t) {
  if (t.length === 0) return;
  let n = e.prepare(`UPDATE entities
     SET hierarchy_name = ?
     WHERE id = ?`);
  qe(e, () => {
    for (let r of t) n.run(r.hierarchyName, r.entityId);
  });
}
function Jb(e) {
  return e.split(".").length;
}
function OO(e) {
  let t = new Map(e.map((s) => [s.id, s])),
    n = new Set(),
    r = new Set(e.map((s) => s.id)),
    i = [];
  for (; r.size > 0;) {
    let s = [...r]
      .map((o) => t.get(o))
      .filter((o) => !!o)
      .filter((o) => [o.parentEntityId, o.sourceEntityId].filter((a) => a !== null).every((a) => n.has(a) || !t.has(a)))
      .sort((o, a) => o.id - a.id);
    if (s.length === 0) return [...i, ...e.filter((o) => r.has(o.id))];
    for (let o of s) (i.push(o), n.add(o.id), r.delete(o.id));
  }
  return i;
}
import x_ from "node:path";
import Jn from "node:path";
function $e(e, t) {
  return `${e}:${t}`;
}
function kf(e, t = new Map()) {
  return {
    assetIdByFileId: new Map(e.map((n) => [n.fileId, n.id])),
    fileIdByAssetId: new Map(e.map((n) => [n.id, n.fileId])),
    assetIdByGuid: new Map(e.map((n) => [n.guid, n.id])),
    assetKindByFileId: new Map(e.map((n) => [n.fileId, n.assetKind])),
    fileAbsPathById: t,
  };
}
function Nf() {
  let e = new Map(),
    t = new Map(),
    n = new Map(),
    r = new Map(),
    i = new Map();
  return {
    entityIdByFileIdAndLocalKey: e,
    entitySummaryByYamlObjectId: t,
    entitySummaryById: n,
    componentScriptSymbolIdByEntityId: r,
    projectableRootEntityIdByAssetId: i,
    addEntity(s) {
      if (
        (n.set(s.entityId, s),
        s.localKey !== null && e.set($e(s.fileId, s.localKey), s.entityId),
        s.yamlObjectId !== null && t.set(s.yamlObjectId, s),
        s.scriptSymbolId !== null && r.set(s.entityId, s.scriptSymbolId),
        (s.entityKind === "gameobject" || s.entityKind === "prefab_instance") && s.parentEntityId === null)
      ) {
        let o = i.get(s.assetId),
          a = o === void 0 ? void 0 : n.get(o)?.entityKind;
        (o === void 0 ||
          (s.entityKind === "gameobject" && a !== "gameobject") ||
          (s.entityKind === a && s.entityId < o)) &&
          i.set(s.assetId, s.entityId);
      }
    },
  };
}
function iS() {
  let e = [],
    t = 0,
    n = (r) => {
      (e.push(r), (t += JSON.stringify(r).length * 2));
    };
  return {
    add(r) {
      n(r);
    },
    addMany(r) {
      for (let i of r) n(i);
    },
    count() {
      return e.length;
    },
    approximateSizeBytes() {
      return t;
    },
    toSortedArray() {
      return [...e].sort(CO);
    },
    clear() {
      ((e.length = 0), (t = 0));
    },
  };
}
function CO(e, t) {
  return (
    e.sourceFileId - t.sourceFileId ||
    e.sourceYamlObjectId - t.sourceYamlObjectId ||
    Pi(e.sourceLocalKey, t.sourceLocalKey) ||
    Pi(e.fieldPath, t.fieldPath) ||
    Pi(e.referenceKind, t.referenceKind) ||
    Pi(e.targetGuid ?? "", t.targetGuid ?? "") ||
    Pi(e.targetFileId ?? "", t.targetFileId ?? "") ||
    Pi(e.targetLocalId ?? "", t.targetLocalId ?? "")
  );
}
function Pi(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function sS() {
  return { seenEntityEdges: new Set(), seenEntitySymbolEdges: new Set(), seenDiagnostics: new Set() };
}
function _t(e, t, n, r) {
  return [e, t, n, r ?? ""].join(":");
}
function oS(e, t, n, r, i) {
  return [e, t, n, r ?? "", i ?? ""].join(":");
}
var MO = "s\0\0\0";
function aS(e) {
  let t = e.lastIndexOf("."),
    n = t < 0 ? e : `${e.slice(0, t)}${e.slice(t + 1)}`,
    r = new TextEncoder().encode(`${MO}${n}`),
    i = Math.ceil((r.length + 9) / 64) * 64,
    s = new Uint8Array(i);
  (s.set(r), (s[r.length] = 128));
  let o = BigInt(r.length) * 8n;
  for (let f = 0; f < 8; f += 1) s[i - 8 + f] = Number((o >> BigInt(f * 8)) & 0xffn);
  let a = 1732584193,
    l = 4023233417,
    c = 2562383102,
    d = 271733878,
    u = new Uint32Array(16);
  for (let f = 0; f < s.length; f += 64) {
    for (let b = 0; b < 16; b += 1) {
      let S = f + b * 4;
      u[b] = s[S] | (s[S + 1] << 8) | (s[S + 2] << 16) | (s[S + 3] << 24);
    }
    let m = a,
      y = l,
      g = c,
      h = d;
    (([a, l, c, d] = Uf(a, l, c, d, u, [...Array(16).keys()], [3, 7, 11, 19], (b, S, P) => (b & S) | (~b & P), 0)),
      ([a, l, c, d] = Uf(
        a,
        l,
        c,
        d,
        u,
        [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15],
        [3, 5, 9, 13],
        (b, S, P) => (b & S) | (b & P) | (S & P),
        1518500249,
      )),
      ([a, l, c, d] = Uf(
        a,
        l,
        c,
        d,
        u,
        [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15],
        [3, 9, 11, 15],
        (b, S, P) => b ^ S ^ P,
        1859775393,
      )),
      (a = (a + m) >>> 0),
      (l = (l + y) >>> 0),
      (c = (c + g) >>> 0),
      (d = (d + h) >>> 0));
  }
  return a | 0;
}
function Uf(e, t, n, r, i, s, o, a, l) {
  let c = e,
    d = t,
    u = n,
    f = r;
  for (let m = 0; m < 16; m += 1) {
    let y = i[s[m]],
      g = o[m % 4];
    switch (m % 4) {
      case 0:
        c = ul((c + a(d, u, f) + y + l) >>> 0, g);
        break;
      case 1:
        f = ul((f + a(c, d, u) + y + l) >>> 0, g);
        break;
      case 2:
        u = ul((u + a(f, c, d) + y + l) >>> 0, g);
        break;
      default:
        d = ul((d + a(u, f, c) + y + l) >>> 0, g);
        break;
    }
  }
  return [c, d, u, f];
}
function ul(e, t) {
  return ((e << t) | (e >>> (32 - t))) >>> 0;
}
function dS(e) {
  return FO(e, { resolvePrefabLinks: !1 });
}
function uS(e) {
  let t = [],
    n = [],
    r = e.nextEdgeId;
  for (let i of e.intents) {
    let s = e.entityIndexes.entityIdByFileIdAndLocalKey.get($e(i.sourceFileId, i.sourceLocalKey));
    if (s === void 0) continue;
    let o = e.assetIndexes.assetIdByGuid.get(i.prefabSourceGuid);
    if (o === void 0) continue;
    let a = e.entityIndexes.projectableRootEntityIdByAssetId.get(o);
    if (a === void 0) continue;
    let l = _t(s, a, i.edgeKind, null);
    e.edgeState.seenEntityEdges.has(l) ||
      (e.edgeState.seenEntityEdges.add(l),
      t.push({ id: r++, fromEntityId: s, toEntityId: a, edgeKind: i.edgeKind }),
      n.push({ entityId: s, sourceEntityId: a }));
  }
  return { edges: t, sourceEntityUpdates: n, nextEdgeId: r };
}
function FO(e, t) {
  let n = [],
    r = [],
    i = [],
    { assets: s, yamlObjects: o, scriptSymbolByFileGuid: a, yamlMetadataById: l } = e,
    c = e.scopedMonoScriptSymbols ?? [],
    d = DO(e.symbols ?? c),
    u = new Map(s.map((E) => [E.id, E])),
    f = new Map(),
    m = new Map(),
    y = new Map(),
    g = [],
    h = KO(o, (E) => E.fileId),
    b = new Map(s.map((E) => [E.guid, E])),
    S = [],
    P = e.nextEntityId,
    I = e.nextEdgeId;
  for (let E of s) {
    if (E.assetKind !== "scene" && E.assetKind !== "prefab") continue;
    let w = h.get(E.fileId) ?? [],
      T = new Map(w.map((k) => [k.id, k])),
      x = new Map(),
      O = new Map(),
      F = new Map(),
      Y = new Map(),
      K = new Map(),
      _ = new Map(),
      L = new Map();
    for (let k of w) {
      let C = l.get(k.id);
      if (k.objectType === "Transform" || k.objectType === "RectTransform") {
        let v = e.payloadReader.read(k),
          A = Pb(C?.childTransformLocalIds !== void 0 ? null : v, C);
        (x.set(k.id, A), O.set(k.localIdentifier, A), A.gameObjectFileId && F.set(A.gameObjectFileId, A));
        let M = A.gameObjectFileId ?? A.prefabInstanceLocalId,
          D = xb(v, ["m_RootOrder"]);
        M && D !== null && K.set(M, D);
      } else if (k.objectType === "PrefabInstance")
        if (C) (_.set(k.id, C.sourcePrefabGuid), L.set(k.id, C.prefabTransformParentLocalId));
        else {
          let v = e.payloadReader.read(k);
          (_.set(k.id, null), L.set(k.id, pt(v, ["m_Modification", "m_TransformParent"])));
        }
    }
    for (let k of w) {
      if (k.objectType !== "GameObject") continue;
      let C = F.get(k.localIdentifier);
      if (!C) {
        Y.set(k.localIdentifier, null);
        continue;
      }
      let v = C.parentTransformLocalId ? O.get(C.parentTransformLocalId) : void 0,
        A = v?.gameObjectFileId ?? v?.prefabInstanceLocalId ?? null;
      Y.set(k.localIdentifier, A);
    }
    let N = [],
      j = new Set(
        w
          .filter((k) => {
            let C = l.get(k.id);
            return k.objectType === "GameObject" && !!C?.prefabInstanceLocalId && !k.name;
          })
          .map((k) => k.localIdentifier),
      ),
      z = new Map(),
      te = new Map();
    for (let k of w) {
      if (k.objectType === "GameObject") {
        let v = e.payloadReader.read(k),
          A = v && typeof v == "object" && !Array.isArray(v) ? v.m_Component : void 0;
        Array.isArray(A) &&
          A.forEach((M, D) => {
            let H = pt(M, ["component"]);
            H && te.set(H, D);
          });
      }
      if (!k.gameObjectFileId) continue;
      let C = l.get(k.id)?.gameObjectFileId ?? k.gameObjectFileId;
      j.has(C) || z.set(C, (z.get(C) ?? 0) + 1);
    }
    for (let k of w) {
      let C = null,
        v = k.objectType,
        A = k.name,
        M = null,
        D = l.get(k.id);
      if (k.objectType === "GameObject" && j.has(k.localIdentifier)) continue;
      if (k.objectType === "GameObject") ((C = "gameobject"), (v = "GameObject"));
      else if (k.objectType === "PrefabInstance")
        ((C = "prefab_instance"), (A = D?.prefabRootName ?? k.name ?? Jn.posix.basename(E.vfsRootPath)));
      else if (k.gameObjectFileId) {
        let ae = D?.gameObjectFileId ?? k.gameObjectFileId;
        if (j.has(ae)) continue;
        if (((C = "component"), k.objectType === "MonoBehaviour" && k.scriptGuid)) {
          let Q = a.get(k.scriptGuid) ?? (k.scriptFileId ? d.get(k.scriptFileId) : void 0),
            fe = D?.gameObjectFileId ?? k.gameObjectFileId,
            Re = fe ? (z.get(fe) ?? 0) : 0;
          if (
            (!Q && Re === 2 && (Q = VO(E, e.scopedFiles, a)),
            !Q &&
              c.length === 1 &&
              GO({
                scriptGuid: k.scriptGuid,
                scriptSymbolByFileGuid: a,
                gameObjectFileId: fe,
                componentCountByGameObjectLocalKey: z,
                scopedCSharpBasename: BO(e.scopedFiles),
                gameObjectName: $O(k, T, D),
              }) &&
              (Q = c[0]),
            Q)
          )
            ((M = Q.id), (v = Q.qualifiedName), (A = Q.simpleName));
          else {
            let Pe = jO(e.payloadReader.read(k));
            Pe && ((v = Pe), (A = Pe.split(".").pop() ?? Pe));
          }
        } else A = A ?? k.objectType;
      }
      if (!C) continue;
      let H = {
        id: P++,
        assetId: E.id,
        yamlObjectId: k.id,
        entityKind: C,
        localKey: k.localIdentifier,
        name: A,
        hierarchyName: null,
        hierarchyOrder: C === "component" ? (te.get(k.localIdentifier) ?? 5e5 + k.id) : k.id,
        typeName: v,
        scriptSymbolId: M,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: k.lineStart,
        lineEnd: k.lineEnd,
      };
      (n.push(H), N.push(H), f.set(H.id, H), y.set(Xn(E.fileId, H.localKey), H));
    }
    for (let k of N) {
      if (k.entityKind === "component") {
        let D = k.yamlObjectId === null ? void 0 : T.get(k.yamlObjectId),
          H = D === void 0 ? null : (l.get(D.id)?.gameObjectFileId ?? D.gameObjectFileId);
        k.parentEntityId = H ? (y.get(Xn(E.fileId, H))?.id ?? null) : null;
        continue;
      }
      if (k.entityKind === "gameobject") {
        let D = Y.get(k.localKey);
        k.parentEntityId = D ? (y.get(Xn(E.fileId, D))?.id ?? null) : null;
        continue;
      }
      if (k.entityKind !== "prefab_instance") continue;
      let C = k.yamlObjectId === null ? void 0 : T.get(k.yamlObjectId);
      if (!C) continue;
      let v = L.get(C.id) ?? null,
        A = v ? O.get(v) : void 0,
        M = A ? (A.gameObjectFileId ?? A.prefabInstanceLocalId) : null;
      k.parentEntityId = M ? (y.get(Xn(E.fileId, M))?.id ?? null) : null;
    }
    for (let k of N)
      (k.entityKind === "gameobject" || k.entityKind === "prefab_instance") &&
        k.parentEntityId !== null &&
        (k.hierarchyOrder = 15e5 + k.id);
    let se = new Map();
    for (let [k, C] of O) {
      let v = C.gameObjectFileId ?? C.prefabInstanceLocalId;
      v && se.set(k, v);
    }
    let ce = N.filter((k) => (k.entityKind === "gameobject" || k.entityKind === "prefab_instance") && !k.parentEntityId)
      .sort((k, C) => (K.get(k.localKey) ?? k.id) - (K.get(C.localKey) ?? C.id))
      .map((k) => k.localKey);
    ce.forEach((k, C) => {
      let v = y.get(Xn(E.fileId, k));
      v && (v.hierarchyOrder = K.get(k) ?? C);
    });
    let ie = new Map();
    for (let k of O.values()) {
      let C = k.gameObjectFileId ?? k.prefabInstanceLocalId;
      if (!C) continue;
      let v = k.childTransformLocalIds.map((A) => se.get(A)).filter((A) => !!A);
      v.length > 0 &&
        (v.forEach((A, M) => {
          let D = y.get(Xn(E.fileId, A));
          D && (D.hierarchyOrder = 1e6 + M);
        }),
        ie.set(C, v));
    }
    g.push({ fileId: E.fileId, rootLocalKeys: ce, childLocalKeysByParentLocalKey: ie });
    let re =
      N.filter((k) => k.entityKind === "gameobject" && !k.parentEntityId).sort((k, C) => k.id - C.id)[0] ??
      N.filter((k) => k.entityKind === "prefab_instance" && !k.parentEntityId).sort((k, C) => k.id - C.id)[0];
    re && m.set(E.id, re.id);
    for (let k of N)
      k.parentEntityId &&
        r.push({
          id: I++,
          fromEntityId: k.id,
          toEntityId: k.parentEntityId,
          edgeKind: k.entityKind === "component" ? "component_of" : "child_of",
        });
    for (let k of N) {
      if (k.entityKind !== "prefab_instance" || k.yamlObjectId === null) continue;
      let C = _.get(k.yamlObjectId) ?? null;
      if (!C) continue;
      let v = T.get(k.yamlObjectId);
      v &&
        S.push({
          fromEntityId: k.id,
          sourceYamlObjectId: v.id,
          sourceFileId: E.fileId,
          sourceLocalKey: k.localKey,
          sourceGuid: C,
          targetLocalId: pt(e.payloadReader.read(v), ["m_SourcePrefab"]),
          edgeKind: E.assetKind === "prefab" && k.id === re?.id ? "variant_of" : "instance_of",
        });
    }
  }
  if (t.resolvePrefabLinks)
    for (let E of S) {
      let w = b.get(E.sourceGuid);
      if (!w) continue;
      let T = m.get(w.id);
      if (!T) continue;
      let x = f.get(E.fromEntityId);
      x && ((x.sourceEntityId = T), r.push({ id: I++, fromEntityId: x.id, toEntityId: T, edgeKind: E.edgeKind }));
    }
  else
    for (let E of S) {
      let w = b.get(E.sourceGuid),
        T = w ? m.get(w.id) : void 0,
        x = f.get(E.fromEntityId);
      (x && T && (x.sourceEntityId = T),
        i.push({
          referenceKind: "prefab_link",
          sourceYamlObjectId: E.sourceYamlObjectId,
          sourceFileId: E.sourceFileId,
          sourceLocalKey: E.sourceLocalKey,
          fieldPath: "PrefabInstance.m_SourcePrefab",
          targetGuid: E.sourceGuid,
          targetFileId: null,
          targetLocalId: E.targetLocalId,
          edgeKind: E.edgeKind,
          prefabSourceGuid: E.sourceGuid,
        }));
    }
  for (let E of g) {
    cS(E.fileId, y, f, u, E.rootLocalKeys);
    for (let w of E.childLocalKeysByParentLocalKey.values()) cS(E.fileId, y, f, u, w);
  }
  for (let E of n)
    (E.entityKind !== "gameobject" && E.entityKind !== "prefab_instance") ||
      E.hierarchyName ||
      (E.hierarchyName = fS(E, f, u));
  return { entities: n, edges: r, pendingEdgeIntents: i, nextEntityId: P, nextEdgeId: I };
}
function Xn(e, t) {
  return `${e}:${t}`;
}
var lS = new WeakMap();
function DO(e) {
  let t = lS.get(e);
  if (t) return t;
  let n = new Map(),
    r = new Set();
  for (let i of e) {
    if (i.symbolKind !== "class" || !i.qualifiedName.trim()) continue;
    let s = String(aS(i.qualifiedName.trim())),
      o = n.get(s);
    if (o && o.qualifiedName !== i.qualifiedName) {
      (n.delete(s), r.add(s));
      continue;
    }
    r.has(s) || n.set(s, i);
  }
  return (lS.set(e, n), n);
}
function jO(e) {
  let t = Er(e, ["m_EditorClassIdentifier"]);
  if (!t?.trim()) return null;
  let n = t.trim();
  return (n.includes("::") ? n.slice(n.lastIndexOf("::") + 2) : n).trim() || null;
}
function BO(e) {
  let t = e.filter((n) => n.kind === "csharp");
  return t.length !== 1 ? null : Jn.posix.basename(t[0].projectRelPath, Jn.posix.extname(t[0].projectRelPath));
}
function VO(e, t, n) {
  let r = Jn.posix.basename(e.vfsRootPath, Jn.posix.extname(e.vfsRootPath)),
    i = t.filter(
      (o) => o.kind === "csharp" && Jn.posix.basename(o.projectRelPath, Jn.posix.extname(o.projectRelPath)) === r,
    );
  if (i.length !== 1) return;
  let s = i[0];
  if (s.guid)
    for (let o of Rr(s.guid)) {
      let a = n.get(o);
      if (a) return a;
    }
}
function $O(e, t, n) {
  let r = n?.gameObjectFileId ?? e.gameObjectFileId;
  return r
    ? ([...t.values()].find((s) => s.objectType === "GameObject" && s.localIdentifier === r)?.name ?? null)
    : null;
}
function GO(e) {
  return e.scriptSymbolByFileGuid.has(e.scriptGuid) || !e.gameObjectFileId
    ? !1
    : !!(
        (e.componentCountByGameObjectLocalKey.get(e.gameObjectFileId) ?? 0) === 2 ||
        (e.scopedCSharpBasename && e.gameObjectName === e.scopedCSharpBasename)
      );
}
function KO(e, t) {
  let n = new Map();
  for (let r of e) {
    let i = t(r),
      s = n.get(i) ?? [];
    (s.push(r), n.set(i, s));
  }
  return n;
}
function cS(e, t, n, r, i) {
  let s = new Map(),
    o = new Map();
  for (let a of i) {
    let l = t.get(Xn(e, a));
    if (!l) continue;
    let c = fS(l, n, r);
    (o.set(a, c), s.set(c, (s.get(c) ?? 0) + 1));
  }
  i.forEach((a, l) => {
    let c = t.get(Xn(e, a)),
      d = o.get(a);
    !c || !d || (c.hierarchyName = (s.get(d) ?? 0) > 1 ? `${d}#${l}` : d);
  });
}
function fS(e, t, n) {
  if (e.entityKind === "prefab_instance" && e.sourceEntityId) {
    let r = t.get(e.sourceEntityId),
      i = n.get(e.assetId),
      s = i ? Jn.posix.basename(i.vfsRootPath) : null,
      o = (e.name ?? e.typeName).trim() || e.typeName;
    if (r && o === s) return (r.name ?? r.typeName).trim() || r.typeName;
  }
  return (e.name ?? e.typeName).trim() || e.typeName;
}
function Ht(e) {
  return WO(e, (t) => t.fileId);
}
function gt(e, t, n, r, i = {}) {
  return {
    id: e,
    assetId: t.id,
    yamlObjectId: n.id,
    entityKind: r,
    localKey: n.localIdentifier,
    name: i.name ?? (n.name || null) ?? t.name,
    hierarchyName: i.hierarchyName ?? null,
    typeName: i.typeName ?? n.objectType,
    scriptSymbolId: i.scriptSymbolId ?? null,
    parentEntityId: i.parentEntityId ?? null,
    sourceEntityId: null,
    lineStart: n.lineStart,
    lineEnd: n.lineEnd,
  };
}
function Qt(e, t) {
  return t.read(e);
}
function mS(e, t) {
  return Er(e, t);
}
function Js(e, t) {
  let n = e;
  for (let [r, i] of t.entries()) {
    if (!n || typeof n != "object" || Array.isArray(n)) return [];
    if (((n = n[i]), Array.isArray(n))) {
      let s = t.slice(r + 1);
      return n.map((o) => (s.length > 0 ? (Er(o, [...s, "fileID"]) ?? Ri(o)) : Ri(o))).filter((o) => o !== null);
    }
  }
  return Array.isArray(n)
    ? n.map((r) => (!r || typeof r != "object" || Array.isArray(r) ? null : Ri(r))).filter((r) => r !== null)
    : [];
}
function Of(e) {
  let t = new Set();
  return (
    Lf(e, (n) => {
      if (!n || typeof n != "object" || Array.isArray(n)) return;
      let r = n;
      if (r.guid !== void 0) return;
      let i = r.fileID;
      (typeof i == "string" || typeof i == "number") && String(i) !== "0" && t.add(String(i));
    }),
    [...t]
  );
}
function yS(e) {
  let t = new Map(e.entities.map((r) => [Af(r.assetId, r.localKey), r])),
    n = e.nextEdgeId;
  for (let r of e.yamlObjects) {
    let i = t.get(Af(e.assetId, r.localIdentifier));
    if (i)
      for (let s of Of(Qt(r, e.payloadReader))) {
        let o = t.get(Af(i.assetId, s));
        !o || o.id === i.id || e.edges.push({ id: n++, fromEntityId: i.id, toEntityId: o.id, edgeKind: "refs" });
      }
  }
  return n;
}
function Af(e, t) {
  return `${e}:${t}`;
}
function fl(e, t) {
  let n = e;
  for (let r of t) {
    if (!n || typeof n != "object" || Array.isArray(n)) return { fileID: null, guid: null };
    n = n[r];
  }
  return { fileID: Er(n, ["fileID"]), guid: Er(n, ["guid"]) };
}
function Lf(e, t) {
  if ((t(e), !(!e || typeof e != "object"))) {
    if (Array.isArray(e)) {
      e.forEach((n) => Lf(n, t));
      return;
    }
    Object.values(e).forEach((n) => Lf(n, t));
  }
}
function WO(e, t) {
  let n = new Map();
  for (let r of e) {
    let i = t(r),
      s = n.get(i) ?? [];
    (s.push(r), n.set(i, s));
  }
  return n;
}
function pS(e) {
  let t = [],
    n = Ht(e.yamlObjects),
    r = e.nextEntityId;
  for (let i of e.assets) {
    if (i.assetKind !== "animation_clip") continue;
    let s = n.get(i.fileId) ?? [];
    for (let o of s)
      o.objectType === "AnimationClip" &&
        t.push(gt(r++, i, o, "animation_clip", { name: o.name ?? i.name, typeName: "AnimationClip" }));
  }
  return { entities: t, edges: [], nextEntityId: r, nextEdgeId: e.nextEdgeId };
}
function gS(e) {
  let t = [],
    n = [],
    r = [],
    i = Ht(e.yamlObjects),
    s = e.nextEntityId,
    o = e.nextEdgeId;
  for (let a of e.assets) {
    if (a.assetKind !== "animator_controller") continue;
    let l = i.get(a.fileId) ?? [],
      c = new Map(),
      d = new Map(),
      u = new Map(),
      f = (m) => {
        (t.push(m), c.set(m.localKey, m));
      };
    for (let m of l) {
      if (m.objectType !== "AnimatorStateMachine") continue;
      for (let g of Js(Qt(m, e.payloadReader), ["m_ChildStates", "state"])) d.set(g, m.localIdentifier);
      let y = gt(s++, a, m, "animator_state_machine", { typeName: "AnimatorStateMachine" });
      f(y);
    }
    for (let m of l) {
      if (m.objectType !== "AnimatorOverrideController") continue;
      let y = gt(s++, a, m, "animator_controller", { name: m.name ?? a.name, typeName: "AnimatorOverrideController" });
      f(y);
    }
    for (let m of l) {
      if (m.objectType !== "AnimatorState") continue;
      let y = d.get(m.localIdentifier),
        g = y ? c.get(y) : null,
        h = gt(s++, a, m, "animator_state", { parentEntityId: g?.id ?? null, typeName: "AnimatorState" });
      (f(h), g && n.push({ id: o++, fromEntityId: h.id, toEntityId: g.id, edgeKind: "child_of" }));
      for (let b of Js(Qt(m, e.payloadReader), ["m_Transitions"])) u.set(b, m.localIdentifier);
    }
    for (let m of l) {
      if (m.objectType !== "AnimatorStateTransition") continue;
      let y = u.get(m.localIdentifier),
        g = y ? c.get(y) : null,
        h = gt(s++, a, m, "animator_transition", {
          name: m.name || "Transition",
          parentEntityId: g?.id ?? null,
          typeName: "AnimatorStateTransition",
        });
      (f(h), g && n.push({ id: o++, fromEntityId: h.id, toEntityId: g.id, edgeKind: "child_of" }));
    }
    r.push(...Cf({ yamlObjects: l.filter((m) => c.has(m.localIdentifier)), payloadReader: e.payloadReader }));
  }
  return { entities: t, edges: n, nextEntityId: s, nextEdgeId: o, pendingEdgeIntents: r };
}
function Cf(e) {
  let t = [];
  for (let n of e.yamlObjects) {
    let r = zO(n.objectType, Qt(n, e.payloadReader));
    for (let i of r)
      i.fileID &&
        t.push({
          referenceKind: "animator_ref",
          sourceYamlObjectId: n.id,
          sourceFileId: n.fileId,
          sourceLocalKey: n.localIdentifier,
          fieldPath: i.fieldPath,
          targetGuid: i.guid,
          targetFileId: null,
          targetLocalId: i.fileID,
          edgeSubkind: i.edgeSubkind,
        });
  }
  return t;
}
function hS(e) {
  let t = [],
    n = e.nextEdgeId;
  for (let r of e.intents) {
    let i =
      e.entityIndexes.entitySummaryByYamlObjectId.get(r.sourceYamlObjectId)?.entityId ??
      e.entityIndexes.entityIdByFileIdAndLocalKey.get($e(r.sourceFileId, r.sourceLocalKey));
    if (i === void 0) continue;
    let s = r.targetLocalId ?? r.targetFileId;
    if (!s || s === "0") continue;
    let o = YO(e.assetIndexes, { sourceFileId: r.sourceFileId, targetGuid: r.targetGuid });
    if (o === null) continue;
    let a = e.entityIndexes.entityIdByFileIdAndLocalKey.get($e(o, s));
    if (a === void 0 || a === i) continue;
    let l = qO(r.edgeSubkind),
      c = _t(i, a, "refs", l);
    e.edgeState.seenEntityEdges.has(c) ||
      (e.edgeState.seenEntityEdges.add(c),
      t.push({ id: n++, fromEntityId: i, toEntityId: a, edgeKind: "refs", edgeSubkind: l }));
  }
  return { edges: t, nextEdgeId: n };
}
function YO(e, t) {
  if (!t.targetGuid) return t.sourceFileId;
  let n = e.assetIdByGuid.get(t.targetGuid);
  return n === void 0 ? null : (e.fileIdByAssetId.get(n) ?? null);
}
function qO(e) {
  return e === "override" ? "animator_override_clip" : null;
}
function zO(e, t) {
  return e === "AnimatorState"
    ? [{ ...fl(t, ["m_Motion"]), fieldPath: "m_Motion", edgeSubkind: "motion" }]
    : e === "AnimatorStateTransition"
      ? [{ ...fl(t, ["m_DstState"]), fieldPath: "m_DstState", edgeSubkind: "transition" }]
      : e === "AnimatorOverrideController"
        ? HO(t)
        : [];
}
function HO(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return [];
  let t = e.m_Clips;
  return Array.isArray(t)
    ? t.map((n, r) => ({
        ...fl(n, ["m_OverrideClip"]),
        fieldPath: `m_Clips[${r}].m_OverrideClip`,
        edgeSubkind: "override",
      }))
    : [];
}
function IS(e, t) {
  let n = e.name?.trim();
  if (n) return n;
  let r = Qt(e, t);
  return mS(r, ["m_Name"])?.trim() ?? e.localIdentifier;
}
function bS(e) {
  let t = [],
    n = [],
    r = Ht(e.yamlObjects),
    i = e.nextEntityId,
    s = e.nextEdgeId;
  for (let o of e.assets) {
    if (o.assetKind !== "audio_mixer") continue;
    let l = (r.get(o.fileId) ?? []).filter((f) => f.objectType === "AudioMixerGroupController"),
      c = new Map(),
      d = new Map();
    for (let f of l) {
      let m = Js(Qt(f, e.payloadReader), ["m_Children"]);
      (c.set(f.localIdentifier, m), m.forEach((y) => d.set(y, f.localIdentifier)));
    }
    let u = new Map();
    for (let f of l) {
      let m = d.get(f.localIdentifier),
        y = m ? u.get(m) : null,
        g = IS(f, e.payloadReader),
        h = XO(f.localIdentifier, l, d, (S) => IS(S, e.payloadReader)),
        b = gt(i++, o, f, "audio_mixer_group", {
          name: g,
          hierarchyName: h,
          parentEntityId: y?.id ?? null,
          typeName: "AudioMixerGroup",
        });
      (t.push(b), u.set(b.localKey, b));
    }
    for (let [f, m] of c.entries()) {
      let y = u.get(f);
      for (let g of m) {
        let h = u.get(g);
        !y ||
          !h ||
          ((h.parentEntityId = y.id), n.push({ id: s++, fromEntityId: h.id, toEntityId: y.id, edgeKind: "child_of" }));
      }
    }
  }
  return { entities: t, edges: n, nextEntityId: i, nextEdgeId: s, pendingEdgeIntents: [] };
}
function SS(e) {
  let t = [],
    n = e.nextEdgeId;
  for (let r of e.intents) {
    let i =
      e.entityIndexes.entitySummaryByYamlObjectId.get(r.sourceYamlObjectId)?.entityId ??
      e.entityIndexes.entityIdByFileIdAndLocalKey.get($e(r.sourceFileId, r.sourceLocalKey));
    if (i === void 0) continue;
    let s = r.targetLocalId ?? r.targetFileId;
    if (!s || s === "0") continue;
    let o = QO(e.assetIndexes, { sourceFileId: r.sourceFileId, targetGuid: r.targetGuid });
    if (o === null) continue;
    let a = e.entityIndexes.entityIdByFileIdAndLocalKey.get($e(o, s));
    if (a === void 0 || a === i || e.entityIndexes.entitySummaryById.get(a)?.entityKind !== "audio_mixer_group")
      continue;
    let c = r.edgeSubkind ?? "USES_AUDIO_MIXER_GROUP",
      d = _t(i, a, "refs", c);
    e.edgeState.seenEntityEdges.has(d) ||
      (e.edgeState.seenEntityEdges.add(d),
      t.push({ id: n++, fromEntityId: i, toEntityId: a, edgeKind: "refs", edgeSubkind: c }));
  }
  return { edges: t, nextEdgeId: n };
}
function QO(e, t) {
  if (!t.targetGuid) return e.assetIdByFileId.has(t.sourceFileId) ? t.sourceFileId : null;
  let n = e.assetIdByGuid.get(t.targetGuid);
  return n === void 0 ? null : (e.fileIdByAssetId.get(n) ?? null);
}
function XO(e, t, n, r) {
  let i = new Map(t.map((a) => [a.localIdentifier, a])),
    s = [],
    o = e;
  for (; o;) {
    let a = i.get(o);
    if (!a) break;
    (s.unshift(r(a)), (o = n.get(o)));
  }
  return s.join("/");
}
function ml(e) {
  let t = e.trim();
  if (!t) return !1;
  let n = Number(t);
  return Number.isSafeInteger(n) && n > 0 && n % 1e5 === 0;
}
var JO = ["m_Name", "templateName", "description", "badge", "addToDefaults"],
  ZO = ["templateScene", "templatePipeline"];
function RS(e) {
  let t = e.split(/\r?\n/),
    n = eC(t);
  if (!n) return [];
  let r = nC(t, n.startLine, n.endLine),
    i = [],
    s = ES(t, r, JO);
  s.length > 0 && i.push(Mf(t, "Details", "scene_template_details", "details", s));
  let o = tC(t, n.startLine),
    a = r.get("preview");
  o
    ? i.push(_S("Thumbnail", "scene_template_thumbnail", "thumbnail", t, o.startLine, o.endLine))
    : a !== void 0 && i.push(Mf(t, "Thumbnail", "scene_template_thumbnail", "thumbnail", [a]));
  let l = ES(t, r, ZO);
  l.length > 0 && i.push(Mf(t, "SceneTemplatePipeline", "scene_template_pipeline", "scene_template_pipeline", l));
  let c = r.get("dependencies");
  if (c !== void 0) {
    let d = rC(t, c, n.endLine, r);
    i.push(_S("Dependencies", "scene_template_dependencies", "dependencies", t, c, d));
  }
  return i;
}
function Mf(e, t, n, r, i) {
  let s = wS(
    i.map((o) => e[o - 1] ?? "").join(`
`),
  );
  return { name: t, entityKind: n, localKey: r, lineStart: Math.min(...i), lineEnd: Math.max(...i), content: s };
}
function _S(e, t, n, r, i, s) {
  let o = wS(
    r.slice(i - 1, s).join(`
`),
  );
  return { name: e, entityKind: t, localKey: n, lineStart: i, lineEnd: s, content: o };
}
function eC(e) {
  let t = -1;
  for (let r = 0; r < e.length; r += 1)
    if (e[r]?.startsWith("--- !u!114")) {
      t = r;
      break;
    }
  if (t < 0) return null;
  let n = e.length;
  for (let r = t + 1; r < e.length; r += 1)
    if (e[r]?.startsWith("--- ")) {
      n = r;
      break;
    }
  return { startLine: t + 1, endLine: n };
}
function tC(e, t) {
  let n = -1;
  for (let i = 0; i < e.length && !(i + 1 >= t); i += 1)
    if (e[i]?.startsWith("--- !u!28")) {
      n = i;
      break;
    }
  if (n < 0) return null;
  let r = t - 1;
  for (let i = n + 1; i < e.length; i += 1)
    if (e[i]?.startsWith("--- ")) {
      r = i;
      break;
    }
  return { startLine: n + 1, endLine: r };
}
function nC(e, t, n) {
  let r = new Map();
  for (let i = t; i <= n; i += 1) {
    let s = e[i - 1] ?? "";
    if (!s.startsWith("  ") || s.startsWith("    ")) continue;
    let o = s.match(/^ {2}([A-Za-z0-9_]+):/);
    o && r.set(o[1], i);
  }
  return r;
}
function ES(e, t, n) {
  return n
    .map((r) => t.get(r))
    .filter((r) => r !== void 0)
    .sort((r, i) => r - i);
}
function rC(e, t, n, r) {
  let i = [...r.entries()]
    .filter(([s, o]) => s !== "dependencies" && o > t)
    .map(([, s]) => s)
    .sort((s, o) => s - o);
  return i.length > 0 ? i[0] - 1 : n;
}
function wS(e) {
  return e
    .split(
      `
`,
    )
    .map((t) => iC(t)).join(`
`);
}
function iC(e) {
  return e.length <= 240 ? e : `${e.slice(0, 240)} ... <truncated>`;
}
function yl(e, t) {
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
function Zs(e) {
  return e.startsWith("scene_template_");
}
function vS(e) {
  return "yamlReferences" in e
    ? e.yamlReferences
        .filter((t) => t.sourceYamlObjectId === e.yamlObject.id)
        .flatMap((t) => {
          let n = t.targetLocalId ?? t.targetFileId;
          return !n || n === "0"
            ? []
            : TS(yC(t.fieldPath))
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
    : dC(e.payload).map((t) => ({
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
function xS(e) {
  let t = [],
    n = fC(e.entityIndexes),
    r = e.nextEdgeId;
  for (let i of e.intents) {
    let s = sC(e.entityIndexes, n, i);
    if (s.length === 0) continue;
    let o = i.targetLocalId ?? i.targetFileId;
    if (!o || o === "0") continue;
    let a = mC(e.assetIndexes, i);
    if (a === null) continue;
    let l = kS(e.entityIndexes, a, o);
    if (
      (!l &&
        i.targetGuid &&
        aC({ path: i.fieldPath, fileID: o, guid: i.targetGuid }) &&
        !ml(o) &&
        lC({
          diagnostics: e.diagnostics,
          seenDiagnostics: e.edgeState.seenDiagnostics,
          sourceFileId: i.sourceFileId,
          sourceYamlObjectId: i.sourceYamlObjectId,
          targetFileId: a,
          targetGuid: i.targetGuid,
          targetLocalId: o,
          fieldPath: i.fieldPath,
          assetIndexes: e.assetIndexes,
        }),
      !!l)
    )
      for (let c of s) {
        if (l.entityId === c.entityId) continue;
        let d = uC(c, i.fieldPath, l),
          u = _t(c.entityId, l.entityId, "refs", d);
        e.edgeState.seenEntityEdges.has(u) ||
          (e.edgeState.seenEntityEdges.add(u),
          t.push({ id: r++, fromEntityId: c.entityId, toEntityId: l.entityId, edgeKind: "refs", edgeSubkind: d }));
      }
  }
  return { edges: t, nextEdgeId: r };
}
function sC(e, t, n) {
  let r = t.get(n.sourceYamlObjectId) ?? [];
  if (r.length > 0) return oC(r, n.fieldPath);
  let i = kS(e, n.sourceFileId, n.sourceLocalKey);
  return i === null ? [] : [i];
}
function oC(e, t) {
  let n = e.filter((r) => Zs(r.entityKind));
  return n.length === 0 ? e : n.filter((r) => yl(r.entityKind, t));
}
function aC(e) {
  let t = e.path.trim().toLowerCase();
  return t.length > 0 && !t.endsWith("m_script");
}
function lC(e) {
  let t = [e.sourceYamlObjectId, e.targetFileId, e.targetLocalId, e.fieldPath].join(":");
  if (e.seenDiagnostics.has(t)) return;
  e.seenDiagnostics.add(t);
  let n = e.assetIndexes.fileAbsPathById.get(e.sourceFileId) ?? `file:${e.sourceFileId}`,
    r = e.assetIndexes.fileAbsPathById.get(e.targetFileId) ?? `file:${e.targetFileId}`;
  e.diagnostics.push({
    severity: "warning",
    category: "resolve",
    stage: "resolve",
    code: "asset_reference_missing_entity",
    filePath: n,
    message: `Asset reference from ${n} object ${e.sourceYamlObjectId} field ${e.fieldPath} targets ${r} guid ${e.targetGuid} fileID ${e.targetLocalId}, but no indexed asset entity exists.`,
  });
}
var cC = [
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
function TS(e) {
  let t = e.toLowerCase();
  return t.includes("m_modification.m_modifications") && t.endsWith(".target")
    ? !0
    : cC.some((n) => {
        let r = n.toLowerCase();
        return t === r || t.endsWith(`.${r}`);
      });
}
function dC(e) {
  let t = [];
  return (
    Ff(e, [], (n, r) => {
      if (!n || typeof n != "object" || Array.isArray(n)) return;
      let i = n;
      if (i.fileID === void 0) return;
      let s = PS(i.fileID);
      if (!s || s === "0") return;
      let o = NS(r).join(".");
      TS(o) || t.push({ path: r.join("."), fileID: s, guid: PS(i.guid) });
    }),
    t
  );
}
function uC(e, t, n) {
  let r = t.toLowerCase();
  return e.entityKind === "prefab_instance" &&
    r.includes("m_modification.m_modifications") &&
    r.endsWith("objectreference")
    ? "prefab_property_object_reference"
    : r.includes("dependencies")
      ? "asset_dependency"
      : r.includes("m_materials")
        ? "uses_material"
        : r.includes("m_outputaudiomixergroup")
          ? "USES_AUDIO_MIXER_GROUP"
          : r.endsWith("m_mesh") || r.includes(".m_mesh")
            ? "RENDERS_MESH"
            : r.includes("m_sourceprefab")
              ? "PREFAB_INSTANCE_GUID"
              : n.entityKind === "audio_mixer_group"
                ? "USES_AUDIO_MIXER_GROUP"
                : n.typeName === "Material"
                  ? "uses_material"
                  : e.entityKind === "component"
                    ? "component_reference"
                    : "asset_reference";
}
function kS(e, t, n) {
  let r = e.entityIdByFileIdAndLocalKey.get($e(t, n));
  return r === void 0 ? null : (e.entitySummaryById.get(r) ?? null);
}
function fC(e) {
  let t = new Map();
  for (let n of e.entitySummaryById.values()) {
    if (n.yamlObjectId === null) continue;
    let r = t.get(n.yamlObjectId) ?? [];
    (r.push(n), t.set(n.yamlObjectId, r));
  }
  return t;
}
function mC(e, t) {
  if (!t.targetGuid) return e.assetIdByFileId.has(t.sourceFileId) ? t.sourceFileId : null;
  let n = e.assetIdByGuid.get(t.targetGuid);
  return n === void 0 ? null : (e.fileIdByAssetId.get(n) ?? null);
}
function PS(e) {
  return typeof e == "string" ? e.trim() || null : typeof e == "number" ? String(e) : null;
}
function NS(e) {
  return e.filter((t) => !/^\d+$/.test(t));
}
function yC(e) {
  return NS(e.replace(/\[\d+\]/g, "").split(".")).join(".");
}
function Ff(e, t, n) {
  if ((n(e, t), !(!e || typeof e != "object"))) {
    if (Array.isArray(e)) {
      e.forEach((r, i) => Ff(r, [...t, String(i)], n));
      return;
    }
    Object.entries(e).forEach(([r, i]) => Ff(i, [...t, r], n));
  }
}
function Df(e) {
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
function US(e) {
  return { entities: [], edges: [], nextEntityId: e.nextEntityId, nextEdgeId: e.nextEdgeId };
}
import { readFileSync as pC } from "node:fs";
function jt(e, t) {
  let n = e.get(t);
  if (!n) return null;
  try {
    return pC(n, "utf8");
  } catch {
    return null;
  }
}
import jf from "node:path";
import gC from "node:path";
function pl(e, t) {
  if (t === "project-settings") return "project_settings";
  if (t === "scene") return "scene";
  if (t === "prefab") return "prefab";
  let n = dr(e);
  if (n) return n.assetKind;
  let r = gC.posix.extname(e).toLowerCase();
  return r === ".mat" ? "material" : r === ".mixer" ? "audio_mixer" : "yaml-asset";
}
function LS(e) {
  let t = 1,
    n = new Set();
  return e
    .filter((r) => IC(r))
    .filter((r) => {
      let i = AS(r);
      return n.has(i) ? !1 : (n.add(i), !0);
    })
    .map((r) => ({
      id: t++,
      projectId: 1,
      fileId: r.id,
      assetKind: pl(r.projectRelPath, r.kind),
      guid: AS(r),
      name: jf.posix.basename(r.projectRelPath, jf.posix.extname(r.projectRelPath)),
      vfsRootPath: r.projectRelPath,
    }));
}
function IC(e) {
  return ["asset", "asmdef", "csharp", "scene", "prefab", "yaml-asset"].includes(e.kind)
    ? !!e.guid
    : e.kind === "project-settings" && bC(e.projectRelPath);
}
function AS(e) {
  return e.guid ?? `project-settings:${e.projectRelPath}`;
}
function bC(e) {
  let t = jf.posix.extname(e).toLowerCase();
  return t === ".asset" || t === ".yaml" || t === ".yml";
}
function OS(e) {
  let t = [],
    n = [],
    r = [],
    i = RC(e.yamlObjects, (o) => o.fileId),
    s = e.nextEntityId;
  for (let o of e.assets) {
    if (o.assetKind !== "project_settings") continue;
    let a = i.get(o.fileId) ?? [];
    for (let l of a) (t.push(gt(s++, o, l, "subasset")), r.push(...SC(o.fileId, l, e.payloadReader)));
  }
  return { entities: t, edges: n, nextEntityId: s, nextEdgeId: e.nextEdgeId, pendingEdgeIntents: r };
}
function CS(e) {
  let t = [],
    n = e.nextEdgeId;
  for (let r of e.intents) {
    if (r.targetLocalId === null) continue;
    let i = _C(r.targetFileId, r.sourceFileId);
    if (i === null) continue;
    let s = e.entityIndexes.entityIdByFileIdAndLocalKey.get($e(r.sourceFileId, r.sourceLocalKey)),
      o = e.entityIndexes.entityIdByFileIdAndLocalKey.get($e(i, r.targetLocalId));
    if (s === void 0 || o === void 0 || s === o) continue;
    let a = _t(s, o, "refs", r.edgeSubkind);
    e.edgeState.seenEntityEdges.has(a) ||
      (e.edgeState.seenEntityEdges.add(a), t.push({ id: n++, fromEntityId: s, toEntityId: o, edgeKind: "refs" }));
  }
  return { edges: t, nextEdgeId: n };
}
function SC(e, t, n) {
  return Of(Qt(t, n))
    .sort(EC)
    .map((r) => ({
      referenceKind: "yaml_local_ref",
      sourceYamlObjectId: t.id,
      sourceFileId: t.fileId,
      sourceLocalKey: t.localIdentifier,
      fieldPath: `local_file_id:${r}`,
      targetGuid: null,
      targetFileId: String(e),
      targetLocalId: r,
      edgeSubkind: null,
    }));
}
function _C(e, t) {
  if (e === null) return t;
  let n = Number(e);
  return Number.isInteger(n) ? n : null;
}
function EC(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function RC(e, t) {
  let n = new Map();
  for (let r of e) {
    let i = t(r),
      s = n.get(i) ?? [];
    (s.push(r), n.set(i, s));
  }
  return n;
}
function MS(e) {
  let t = [],
    n = [],
    r = wC(e.yamlObjects, (s) => s.fileId),
    i = e.nextEntityId;
  for (let s of e.assets) {
    if (s.assetKind !== "material") continue;
    let o = r.get(s.fileId);
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
      id: i++,
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
  return { entities: t, edges: n, nextEntityId: i, nextEdgeId: e.nextEdgeId };
}
function wC(e, t) {
  let n = new Map();
  for (let r of e) {
    let i = t(r),
      s = n.get(i) ?? [];
    (s.push(r), n.set(i, s));
  }
  return n;
}
var PC = new Set(["LightmapSettings", "NavMeshSettings", "OcclusionCullingSettings", "RenderSettings"]);
function FS(e) {
  let t = [],
    n = [],
    r = new Map(e.assets.filter((o) => o.assetKind === "scene").map((o) => [o.fileId, o])),
    i = new Set(e.existingEntities.map((o) => o.yamlObjectId).filter((o) => o !== null));
  for (let o of e.entityIndexes?.entitySummaryByYamlObjectId.keys() ?? []) i.add(o);
  let s = e.nextEntityId;
  for (let o of e.yamlObjects) {
    if (!PC.has(o.objectType)) continue;
    let a = r.get(o.fileId);
    a &&
      (i.has(o.id) ||
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
function DS(e) {
  let t = [],
    n = [],
    r = Ht(e.yamlObjects),
    i = e.nextEntityId;
  for (let s of e.assets) {
    if (s.assetKind !== "scene_template") continue;
    let o = jt(e.fileAbsPathById, s.fileId);
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
    let a = (r.get(s.fileId) ?? []).find((c) => c.objectType === "MonoBehaviour");
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
    let l = RS(o);
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
        id: i++,
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
  return { entities: t, edges: n, nextEntityId: i, nextEdgeId: e.nextEdgeId };
}
function jS(e) {
  let t = [],
    n = [],
    r = Ht(e.yamlObjects),
    i = e.nextEntityId,
    s = e.nextEdgeId;
  for (let o of e.assets) {
    if (o.assetKind !== "scriptable_object") continue;
    let a = [],
      l = r.get(o.fileId) ?? [];
    for (let c of l) {
      let d = c.scriptGuid ? (e.scriptSymbolByFileGuid.get(c.scriptGuid) ?? null) : null,
        u = c.objectType === "MonoBehaviour" || !!d,
        f = gt(i++, o, c, u ? "scriptable_object" : "subasset", {
          name: u && d ? d.simpleName : c.name,
          typeName: u && d ? d.qualifiedName : c.objectType,
          scriptSymbolId: d?.id ?? null,
        });
      (t.push(f), a.push(f));
    }
    s = yS({ edges: n, assetId: o.id, entities: a, yamlObjects: l, nextEdgeId: s, payloadReader: e.payloadReader });
  }
  return { entities: t, edges: n, nextEntityId: i, nextEdgeId: s };
}
function vr(e, t) {
  return e?.trim() || t;
}
function Vf(e) {
  let t = vC(e),
    n = new Map(),
    r = t.find((a) => xC(a)) ?? t[0] ?? null;
  for (let a of t) {
    let l = Xt(a);
    l && a && typeof a == "object" && n.set(l, a);
  }
  VC(n, r);
  let i = TC(t, r, n),
    s = kC(r, n),
    o = NC(t, r, n);
  return (
    UC(o, r, n, i),
    { graphName: Ee(r, ["m_Name", "name", "displayName", "m_Path"]), properties: i, settings: s, nodes: o }
  );
}
function $f(e, t) {
  let n = new Map();
  (n.set(
    `shader_graph_properties:${t}`,
    JSON.stringify(
      {
        type: "ShaderGraphProperties",
        properties: e.properties.map((r) => ({
          name: r.name,
          refName: r.refName,
          propertyType: r.propertyType,
          defaultValue: r.defaultValue,
          ...(r.objectId ? { objectId: r.objectId } : {}),
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
  for (let r of e.nodes)
    n.set(
      `shader_graph_node:${r.objectId}`,
      JSON.stringify(
        { type: r.typeName, name: r.displayName, params: r.params, inputs: r.inputs, outputs: r.outputs },
        null,
        2,
      ),
    );
  return n;
}
function qS(e, t) {
  return $f(Vf(e), t);
}
function Gf(e) {
  return e === "shader_graph_properties" || e === "shader_graph_settings" || e === "shader_graph_node";
}
function vC(e) {
  let t = [],
    n = 0;
  for (; n < e.length;) {
    for (; n < e.length && /\s/.test(e[n]);) n += 1;
    if (n >= e.length) break;
    let r = n,
      i = !1,
      s = !1,
      o = 0;
    for (; n < e.length; n += 1) {
      let a = e[n];
      if (i) {
        if (s) {
          s = !1;
          continue;
        }
        if (a === "\\") {
          s = !0;
          continue;
        }
        a === '"' && (i = !1);
        continue;
      }
      if (a === '"') {
        i = !0;
        continue;
      }
      if (a === "{" || a === "[") {
        o += 1;
        continue;
      }
      if ((a === "}" || a === "]") && ((o -= 1), o === 0)) {
        ((n += 1), t.push(JSON.parse(e.slice(r, n))));
        break;
      }
    }
    if (o !== 0 || i) throw new SyntaxError("Unexpected end of JSON input");
  }
  return t;
}
function xC(e) {
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
function TC(e, t, n) {
  let r = [],
    i = new Set(),
    s = (o) => {
      let a = Xt(o),
        l = Ee(o, ["m_Name", "m_DisplayName", "displayName", "name"]) ?? (a ? `Property@${eo(a)}` : null);
      if (!l) return;
      let c = a ?? l;
      i.has(c) ||
        (i.add(c),
        r.push({
          name: l,
          refName: Ee(o, ["m_RefName", "m_DefaultReferenceName", "overrideReferenceName", "referenceName"]),
          propertyType: Kf(Ee(o, ["m_Type", "type", "m_SerializedType"]) ?? "ShaderProperty"),
          defaultValue: o.m_Value ?? o.m_Default ?? null,
          objectId: a,
        }));
    };
  for (let o of Et(t, "m_Properties")) {
    let a = Ge(o);
    if (!a) continue;
    let l = Xt(a),
      c = l && n.has(l) ? n.get(l) : a;
    s(c);
  }
  for (let o of Et(t, "m_SerializedProperties")) {
    let a = vi(o);
    a && s(a);
  }
  for (let o of e) {
    if (!o || typeof o != "object" || Array.isArray(o)) continue;
    let a = o,
      l = Ee(a, ["m_Type", "type", "m_SerializedType"]) ?? "";
    /property/i.test(l) && s(a);
  }
  return r;
}
function kC(e, t) {
  let n = new Set();
  for (let s of Et(e, "m_ActiveTargets")) {
    let o = zS(s, t) ?? Ge(s),
      a = Ee(o, ["m_SerializedDescriptor", "serializedDescriptor", "m_DisplayName", "displayName", "m_Name", "name"]);
    a && n.add(a);
  }
  for (let s of t.values()) {
    let o = Ee(s, ["m_Type", "type", "m_SerializedType"]) ?? "";
    if (!/target/i.test(o)) continue;
    let a = Ee(s, ["m_SerializedDescriptor", "serializedDescriptor", "m_DisplayName", "displayName", "m_Name", "name"]);
    a && n.add(a);
  }
  let r = Ee(e, ["m_OutputNode", "m_ActiveOutputNode", "m_ActiveOutputNodeGuidSerialized"]),
    i = Pr(Ge(e)?.m_GraphPrecision ?? Ge(e)?.graphPrecision ?? Ge(e)?.m_ConcretePrecision);
  return {
    targets: [...n],
    activeOutput: r ? QS(r, t) : null,
    keywords: [...KC(e, "m_Keywords"), ...BC(e)],
    precision: i,
  };
}
function NC(e, t, n) {
  let r = [],
    i = new Set(),
    s = (o, a) => {
      let l = Xt(o) ?? $C(o, a);
      if (i.has(l)) return;
      let c = Kf(Ee(o, ["m_Type", "type", "m_SerializedType"]) ?? "ShaderGraphNode");
      if (GS(c)) return;
      i.add(l);
      let d = Ee(o, ["m_Name", "m_Title", "title", "displayName", "m_DisplayName"]),
        u = d ? `${d}@${eo(l)}` : `${c}@${eo(l)}`;
      r.push({
        objectId: l,
        displayName: u,
        typeName: c,
        params: OC(o),
        inputs: [],
        outputs: CC(o, n),
        guidReferences: xr(o),
      });
    };
  return (
    Et(t, "m_Nodes").forEach((o, a) => {
      let l = zS(o, n);
      if (l) {
        s(l, `root-node:${a}`);
        return;
      }
      let c = Ge(o);
      c && s(c, `root-node:${a}`);
    }),
    Et(t, "m_SerializableNodes").forEach((o, a) => {
      let l = vi(o);
      l && s(l, `legacy-node:${a}`);
    }),
    e.forEach((o, a) => {
      if (!o || typeof o != "object" || Array.isArray(o)) return;
      let l = o,
        c = Ee(l, ["m_Type", "type", "m_SerializedType"]) ?? "";
      !c || GS(c) || s(l, `document:${a}`);
    }),
    r
  );
}
function UC(e, t, n, r) {
  let i = new Map(e.map((c) => [c.objectId, c])),
    s = AC(n, r),
    o = LC(e, n, s),
    a = new WeakSet(),
    l = (c) => {
      let d = Ge(c);
      if (!(!d || a.has(d))) {
        a.add(d);
        for (let u of Et(d, "m_Edges")) VS(u, i, o, n, s);
        for (let u of Et(d, "m_SerializableEdges")) {
          let f = vi(u);
          f && VS(f, i, o, n, s);
        }
      }
    };
  l(t);
  for (let c of n.values()) l(c);
}
function AC(e, t) {
  let n = new Map();
  t.forEach((i) => {
    i.objectId && n.set(i.objectId, i);
  });
  let r = new Map();
  return (
    e.forEach((i, s) => {
      let o = Kf(Ee(i, ["m_Type", "type", "m_SerializedType"]) ?? "");
      if (!HS(o)) return;
      let a = Xt(Ge(i.m_Property)) ?? Ee(i, ["m_PropertyGuidSerialized", "propertyGuidSerialized"]),
        l = a ? n.get(a) : void 0,
        c = a ? e.get(a) : void 0,
        d = l?.refName ?? Ee(c, ["m_DefaultReferenceName", "m_RefName", "overrideReferenceName"]),
        u = l?.name ?? Ee(c, ["m_Name", "m_DisplayName"]),
        f = d ?? u ?? "Property";
      r.set(s, `${f}@${eo(s)}`);
    }),
    r
  );
}
function BS(e, t, n, r) {
  Et(t, "m_Slots").forEach((i) => {
    let s = Xt(Ge(i));
    if (!s) return;
    let o = n.get(s);
    if (!o) return;
    let a = Pr(o.m_Id);
    if (a === null) return;
    let l = Ee(o, ["m_DisplayName", "displayName", "m_ShaderOutputName", "shaderOutputName"]) ?? `slot ${a}`;
    r.set(`${e}:${a}`, l);
  });
}
function LC(e, t, n) {
  let r = new Map();
  return (
    e.forEach((i) => {
      i.outputs.forEach((o) => {
        let a = o.name.match(/^slot (\d+)$/)?.[1];
        a ? r.set(`${i.objectId}:${a}`, o.name) : r.set(`${i.objectId}:${o.name}`, o.name);
      });
      let s = t.get(i.objectId);
      s && BS(i.objectId, s, t, r);
    }),
    n.forEach((i, s) => {
      let o = t.get(s);
      (o && BS(s, o, t, r), r.has(`${s}:0`) || r.set(`${s}:0`, "Out"));
    }),
    r
  );
}
function VS(e, t, n, r, i) {
  let s = Ge(e);
  if (!s) return;
  let o = Ge(s.m_OutputSlot),
    a = Ge(s.m_InputSlot);
  if (!o || !a) return;
  let l = $S(o),
    c = $S(a),
    d = Pr(o.m_SlotId),
    u = Pr(a.m_SlotId);
  if (!l || !c) return;
  let f = KS(l, d, t, n, r, i),
    m = KS(c, u, t, n, r, i),
    y = t.get(c);
  if (y) {
    let h = n.get(`${c}:${u}`) ?? `slot ${u ?? "0"}`,
      b = y.inputs.find((S) => S.name === h);
    b ? (b.from = f) : y.inputs.push({ name: h, from: f });
  }
  let g = t.get(l);
  if (g) {
    let h = n.get(`${l}:${d}`) ?? `slot ${d ?? "0"}`,
      b = g.outputs.find((S) => S.name === h);
    b ? (b.to = [...(b.to ?? []), m]) : g.outputs.push({ name: h, to: [m] });
  }
}
function OC(e) {
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
  for (let [r, i] of Object.entries(e))
    if (!n.has(r) && i != null) {
      if (typeof i == "object" && !Array.isArray(i)) {
        let s = i;
        if ("guid" in s || "fileID" in s) {
          t[WS(r)] = s;
          continue;
        }
      }
      (typeof i == "string" || typeof i == "number" || typeof i == "boolean" || Array.isArray(i)) && (t[WS(r)] = i);
    }
  return t;
}
function CC(e, t) {
  let n = Et(e, "m_SerializableSlots");
  if (n.length > 0)
    return n
      .map((i, s) => {
        let o = vi(i) ?? Ge(i);
        if (!o) return { name: `slot ${s}` };
        let a = Pr(o.m_Id) ?? String(s);
        return {
          name: Ee(o, ["m_DisplayName", "displayName", "m_ShaderOutputName", "shaderOutputName"]) ?? `slot ${a}`,
          to: [],
        };
      })
      .filter(Boolean);
  let r = [];
  return (
    Et(e, "m_Slots").forEach((i) => {
      let s = Xt(Ge(i));
      if (!s) return;
      let o = t.get(s);
      if (!o) return;
      let a = o.m_SlotType;
      if (a !== 1 && a !== "1") return;
      let l = Pr(o.m_Id),
        c =
          Ee(o, ["m_DisplayName", "displayName", "m_ShaderOutputName", "shaderOutputName"]) ??
          (l ? `slot ${l}` : "Out");
      r.push({ name: c, to: [] });
    }),
    r
  );
}
function xr(e) {
  let t = [];
  return (
    Bf(e, [], (n, r) => {
      if (!n || typeof n != "object" || Array.isArray(n)) return;
      let i = n,
        s = YS(i.guid);
      s && t.push({ path: r.join("."), fileID: YS(i.fileID), guid: s });
    }),
    t
  );
}
function zS(e, t) {
  if (e && typeof e == "object" && !Array.isArray(e)) {
    let n = e,
      r = Xt(n);
    if (r && t.has(r)) return t.get(r);
    if (FC(n) || MC(n)) return n;
  }
  return null;
}
function MC(e) {
  let t = Ee(e, ["m_Type", "type", "m_SerializedType"]) ?? "";
  return /target/i.test(t) || typeof e.m_SerializedDescriptor == "string" || typeof e.serializedDescriptor == "string";
}
function FC(e) {
  return !!(Ee(e, ["m_Type", "type"]) || Array.isArray(e.m_SerializableSlots) || e.m_FunctionSource || e.m_SubGraph);
}
function Xt(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return null;
  let t = e,
    n = Ee(t, ["m_ObjectId", "m_Id", "m_GuidSerialized", "objectId", "id"]) ?? null;
  if (n) return n;
  let r = Ge(t.m_Guid);
  return Ee(r, ["m_GuidSerialized", "guidSerialized"]) ?? null;
}
function DC(e) {
  return Xt(e);
}
function $S(e) {
  return DC(e.m_Node) ?? Ee(e, ["m_NodeGUIDSerialized", "m_NodeGuidSerialized"]);
}
function vi(e) {
  let t = Ge(e);
  if (!t) return null;
  let n = t.JSONnodeData;
  if (typeof n != "string" || !n.trim()) return t;
  try {
    let r = JSON.parse(n),
      i = Ee(t.typeInfo, ["fullName"]);
    return (i && (r.m_Type = i), r);
  } catch {
    return null;
  }
}
function jC(e) {
  return /ShaderProperty$/i.test(e);
}
function HS(e) {
  return /^PropertyNode$/i.test(e);
}
function GS(e) {
  return (
    jC(e) ||
    HS(e) ||
    /MaterialSlot$/i.test(e) ||
    /^CategoryData$/i.test(e) ||
    /^GraphData$/i.test(e) ||
    /target$/i.test(e) ||
    /UniversalTarget|HDTarget/.test(e)
  );
}
function BC(e) {
  let t = [];
  for (let n of Et(e, "m_SerializedKeywords")) {
    let r = vi(n),
      i = Ee(r, ["m_Name", "m_DisplayName", "name"]);
    i && t.push(i);
  }
  return t;
}
function VC(e, t) {
  for (let n of ["m_SerializedProperties", "m_SerializableNodes", "m_SerializableEdges"])
    for (let r of Et(t, n)) {
      let i = vi(r),
        s = i ? Xt(i) : null;
      i && s && !e.has(s) && e.set(s, i);
    }
}
function Et(e, t) {
  let r = Ge(e)?.[t];
  return Array.isArray(r) ? r : [];
}
function Ge(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? null : e;
}
function eo(e) {
  return e.replace(/-/g, "").slice(0, 8);
}
function $C(e, t) {
  let n = Ee(e, ["m_Type", "type", "m_SerializedType"]) ?? "ShaderGraphNode",
    r = Ee(e, ["m_Name", "m_Title", "title", "displayName", "m_DisplayName"]) ?? "",
    i = `${n}|${r}|${t}`,
    s = 0;
  for (let a = 0; a < i.length; a += 1) s = (s * 31 + i.charCodeAt(a)) | 0;
  let o = (Math.abs(s) >>> 0).toString(16).padStart(8, "0").slice(-8);
  return `${o}-0000-4000-8000-${o}00000000`.slice(0, 36);
}
function QS(e, t) {
  let n = t.get(e);
  return `${(n ? Ee(n, ["m_Name", "name", "m_DisplayName"]) : null) ?? "Node"}@${eo(e)}`;
}
function GC(e, t, n, r) {
  let i = t.get(e);
  if (i) return i.displayName;
  let s = r.get(e);
  return s || QS(e, n);
}
function KS(e, t, n, r, i, s) {
  let o = GC(e, n, i, s),
    a = (t ? r.get(`${e}:${t}`) : null) ?? (t ? `slot ${t}` : "Out");
  return `${o}.${a}`;
}
function WS(e) {
  return e.startsWith("m_") ? e.slice(2) : e;
}
function Kf(e) {
  return (
    e
      .split(/[.$,+]/)
      .map((t) => t.trim())
      .filter(Boolean)
      .at(-1) ?? e
  );
}
function Ee(e, t) {
  let n = Ge(e);
  if (!n) return null;
  for (let r of t) {
    let i = n[r];
    if (typeof i == "string" && i.trim()) return i.trim();
  }
  return null;
}
function KC(e, t) {
  let r = Ge(e)?.[t];
  return Array.isArray(r) ? r.map((i) => (typeof i == "string" ? i.trim() : "")).filter(Boolean) : [];
}
function Pr(e) {
  return typeof e == "string" ? e.trim() || null : typeof e == "number" ? String(e) : null;
}
function YS(e) {
  return Pr(e);
}
function Bf(e, t, n) {
  if ((n(e, t), Array.isArray(e))) {
    e.forEach((r, i) => Bf(r, [...t, String(i)], n));
    return;
  }
  e && typeof e == "object" && Object.entries(e).forEach(([r, i]) => Bf(i, [...t, r], n));
}
var WC = "7d4c867f6b72b714dbb5fd1780afe208",
  YC = "d01270efd3285ea4a9d6c555cb0a8027",
  XS = {
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
  e_ = {
    "73a13919d81fb7444849bae8b5c812a2": "Spawn system",
    "9dfea48843f53fc438eabc12a3a30abc": "Initialize Particle",
    "2dc095764ededfa4bb32fa602511ea4b": "Particle Update",
    a0b9e6b9139e58d4c957ec54595da7d3: "Output Particle",
    "5e382412bb691334bb79457a6c127924": "Spawn Rate",
    d16c6aeaef944094b9a1633041804207: "Orient Particle",
    a971fa2e110a0ac42ac1d8dae408704b: "Set Size",
  },
  qC = [
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
  zC = new Set([
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
function t_(e, t) {
  let n = new Map(),
    r = new Map();
  for (let y of e) {
    let g = t.read(y);
    !g ||
      typeof g != "object" ||
      Array.isArray(g) ||
      (n.set(y.localIdentifier, g), r.set(y.localIdentifier, y.scriptGuid?.trim().toLowerCase() ?? null));
  }
  let i = HC(n, r);
  if (!i) return null;
  let s = n.get(i),
    o = ct(s, ["m_Name", "name"]) ?? null,
    a = c_(s, ["m_GraphVersion"]),
    l = new Set(),
    c = new Set();
  for (let [y, g] of n.entries())
    if (!(y === i || QC(g, r.get(y)))) {
      if (qf(g)) {
        l.add(y);
        continue;
      }
      XC(g, n, l) && c.add(y);
    }
  let d = new Map();
  for (let y of l) {
    let g = n.get(y),
      h = r.get(y),
      b = ct(g, ["m_Label", "label"]),
      S = Yf(g, h),
      P = a_(b, S, h, g, y),
      I = JS(g, "m_InputFlowSlot", n, d, l, r),
      E = JS(g, "m_OutputFlowSlot", n, d, l, r),
      w = [...c].filter((x) => xi(n.get(x), "m_Parent") === y),
      T = ZS(g, n);
    d.set(y, {
      localId: y,
      displayName: P,
      label: b,
      typeName: S,
      flowInputs: I,
      flowOutputs: E,
      blockLocalIds: w,
      params: T,
      guidReferences: xr(T),
    });
  }
  let u = [];
  for (let y of c) {
    let g = n.get(y),
      h = r.get(y),
      b = ct(g, ["attribute", "m_Attribute"]),
      S = Yf(g, h),
      P =
        xi(g, "m_Parent") ??
        [...l].find((w) => {
          let T = n.get(w);
          return o0(T, "m_Children").includes(y);
        }) ??
        "",
      I = i0(b, g, S, h, y),
      E = ZS(g, n);
    u.push({
      localId: y,
      displayName: I,
      attribute: b,
      typeName: S,
      parentContextLocalId: P,
      params: E,
      guidReferences: xr(E),
    });
  }
  let f = JC(s),
    m = ZC(s);
  return {
    graphName: o,
    graphVersion: a,
    properties: f,
    subgraphDependencies: m,
    contexts: [...d.values()],
    blocks: u,
  };
}
function n_(e, t) {
  let n = new Map();
  n.set(
    `vfx_graph_properties:${t}`,
    JSON.stringify(
      { type: "Properties", graphName: e.graphName, graphVersion: e.graphVersion, properties: e.properties },
      null,
      2,
    ),
  );
  for (let r of e.contexts)
    n.set(
      `vfx_graph_context:${r.localId}`,
      JSON.stringify(
        {
          type: r.typeName,
          name: r.displayName,
          label: r.label,
          flowInputs: r.flowInputs,
          flowOutputs: r.flowOutputs,
          blocks: r.blockLocalIds.map((i) => e.blocks.find((o) => o.localId === i)?.displayName ?? i),
          params: r.params,
        },
        null,
        2,
      ),
    );
  for (let r of e.blocks)
    n.set(
      `vfx_graph_block:${r.localId}`,
      JSON.stringify(
        {
          type: r.typeName,
          name: r.displayName,
          attribute: r.attribute,
          parentContext: e.contexts.find((i) => i.localId === r.parentContextLocalId)?.displayName,
          params: r.params,
        },
        null,
        2,
      ),
    );
  return n;
}
function r_(e) {
  return (
    e === "visual_effect_graph_properties" ||
    e === "visual_effect_graph_property" ||
    e === "visual_effect_graph_context" ||
    e === "visual_effect_graph_block"
  );
}
function HC(e, t) {
  for (let [n, r] of e.entries())
    if (
      (r.m_GraphVersion !== void 0 || t.get(n) === WC) &&
      (Array.isArray(r.m_Children) || r.m_ParameterInfo !== void 0)
    )
      return n;
  for (let [n, r] of e.entries()) if (Array.isArray(r.m_Children) && r.m_UIInfos !== void 0) return n;
  return null;
}
function QC(e, t) {
  return t === YC || ct(e, ["m_Name", "name"]) === "VFXUI"
    ? !0
    : e.m_Owners !== void 0 && e.m_Data !== void 0
      ? !qf(e) && !i_(e)
      : !!s_(e);
}
function qf(e) {
  return e.m_InputFlowSlot !== void 0 || e.m_OutputFlowSlot !== void 0 || (e.m_Label !== void 0 && e.m_Data !== void 0);
}
function i_(e) {
  return (
    e.attribute !== void 0 ||
    e.m_Attribute !== void 0 ||
    e.m_ActivationSlot !== void 0 ||
    (Array.isArray(e.m_InputSlots) && e.m_Parent !== void 0)
  );
}
function XC(e, t, n) {
  if (!i_(e) || s_(e)) return !1;
  let r = xi(e, "m_Parent");
  if (r && n.has(r)) return !0;
  if (!r) return !1;
  let i = t.get(r);
  return i ? qf(i) : !1;
}
function s_(e) {
  return e.m_MasterSlot === void 0 || e.m_Label !== void 0 || e.attribute !== void 0
    ? !1
    : e.m_Property !== void 0 || e.m_InputSlots === void 0;
}
function JC(e) {
  let t = e.m_ParameterInfo;
  return Array.isArray(t)
    ? t
        .map((n) => lt(n))
        .filter((n) => n !== null)
        .map((n) => ({
          name: ct(n, ["name", "m_Name"]) ?? "Property",
          path: ct(n, ["path", "m_Path"]),
          realType: ct(n, ["realType", "m_RealType"]),
          sheetType: ct(n, ["sheetType", "m_SheetType"]),
          defaultValue: n0(n),
        }))
    : [];
}
function ZC(e) {
  let t = e.m_SubgraphDependencies;
  return Array.isArray(t)
    ? t
        .map((n) => lt(n))
        .filter((n) => n !== null)
        .map((n) => ({ asset: n, guidReferences: xr(n) }))
    : [];
}
function JS(e, t, n, r, i, s) {
  let o = e[t];
  if (!Array.isArray(o)) return [];
  let a = [];
  for (let l of o) {
    let c = lt(l);
    if (!c) continue;
    let d = c.link ?? c.m_Link;
    if (Array.isArray(d))
      for (let u of d) {
        let f = lt(u);
        if (!f) continue;
        let m = lt(f.context ?? f.m_Context),
          y = m ? (xi(m, "fileID") ?? xi(m, "m_FileID")) : null;
        if (!y || !i.has(y)) continue;
        let g = c_(f, ["slotIndex", "m_SlotIndex"]) ?? 0;
        a.push(e0(y, g, n, r, s));
      }
  }
  return a;
}
function e0(e, t, n, r, i) {
  let s = r.get(e);
  if (s) return `${s.displayName}.slot${t}`;
  let o = n.get(e),
    a = i.get(e),
    l = o ? ct(o, ["m_Label", "label"]) : null,
    c = o ? Yf(o, a) : "Context";
  return `${o ? a_(l, c, a, o, e) : `Context@${zf(e)}`}.slot${t}`;
}
function ZS(e, t) {
  let n = {};
  for (let i of qC) e[i] !== void 0 && (n[i] = e[i]);
  for (let [i, s] of Object.entries(e)) zC.has(i) || i in n || (o_(s) && (n[i] = s));
  let r = e.m_InputSlots;
  if (Array.isArray(r))
    for (let i of r) {
      let s = lt(i);
      if (!s) continue;
      let o = xi(s, "m_Link"),
        a = o ? t.get(o) : null,
        l = lt(a ? (a.m_Property ?? a.m_MasterSlot) : s.m_Property),
        c = (l ? ct(l, ["name", "m_Name"]) : null) ?? ct(s, ["m_Name", "name"]) ?? "input",
        d = lt(a?.m_MasterData)?.m_Value ?? lt(s.m_MasterData)?.m_Value ?? s.m_Value;
      d !== void 0 && (n[c] = Wf(d));
    }
  return n;
}
function o_(e) {
  if (e === null || typeof e == "string" || typeof e == "number" || typeof e == "boolean") return !0;
  if (Array.isArray(e)) return e.every((t) => o_(t));
  if (e && typeof e == "object") {
    let t = e;
    return t0(t.guid) !== null || t.fileID !== void 0 || t.m_FileID !== void 0;
  }
  return !1;
}
function t0(e) {
  if (typeof e != "string") return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
function n0(e) {
  let t = e.defaultValue ?? e.m_DefaultValue;
  if (t === void 0) return null;
  let n = lt(t);
  if (!n) return t;
  let r = n.m_SerializableObject;
  if (typeof r == "string") {
    let i = Wf(r);
    if (i && typeof i == "object" && !Array.isArray(i)) {
      let s = i;
      if (s.obj !== void 0) return Wf(s.obj);
    }
    return i;
  }
  return t;
}
function a_(e, t, n, r, i) {
  return `${e ?? (n ? e_[n] : null) ?? r0(r, t)}@${zf(i)}`;
}
function r0(e, t) {
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
          : l_(t) || "Context";
}
function i0(e, t, n, r, i) {
  let s = ct(t, ["m_Name", "name"]),
    o = r ? e_[r] : null;
  return `${e ?? s ?? o ?? s0(n) ?? "Block"}@${zf(i)}`;
}
function Wf(e) {
  if (typeof e != "string") return e;
  let t = e.trim();
  return !t.startsWith("{") && !t.startsWith("[") ? e : (a0(t) ?? e);
}
function Yf(e, t) {
  let n = t?.trim().toLowerCase();
  if (n && XS[n]) return XS[n];
  let r = ct(e, ["m_EditorClassIdentifier", "editorClassIdentifier"]);
  if (r) {
    let o = (r.split(":").pop()?.split(".") ?? []).at(-1);
    if (o) return o;
  }
  let i = ct(e, ["m_Type", "type"]);
  return i ? (i.split(".").at(-1) ?? i) : "VFXNode";
}
function l_(e) {
  return e
    .replace(/^VFX/i, "")
    .replace(/Context$/i, "")
    .replace(/Initialize$/i, " Initialize")
    .trim();
}
function s0(e) {
  return /SetAttribute/i.test(e) || /Constant/i.test(e) ? null : l_(e) || null;
}
function xi(e, t) {
  if (!e) return null;
  let n = e[t];
  if (typeof n == "string" || typeof n == "number") {
    let s = String(n).trim();
    return s.length > 0 && s !== "0" ? s : null;
  }
  let r = lt(n);
  if (!r) return null;
  let i = r.fileID ?? r.m_FileID;
  if (typeof i == "string" || typeof i == "number") {
    let s = String(i).trim();
    return s.length > 0 && s !== "0" ? s : null;
  }
  return null;
}
function o0(e, t) {
  if (!e) return [];
  let n = e[t];
  return Array.isArray(n)
    ? n
        .map((r) => {
          let i = lt(r);
          if (!i) return null;
          let s = i.fileID ?? i.m_FileID;
          if (typeof s == "string" || typeof s == "number") {
            let o = String(s).trim();
            return o.length > 0 && o !== "0" ? o : null;
          }
          return null;
        })
        .filter((r) => r !== null)
    : [];
}
function zf(e) {
  return e.replace(/-/g, "").slice(-8);
}
function ct(e, t) {
  for (let n of t) {
    let r = e[n];
    if (typeof r == "string") {
      let i = r.trim();
      if (i.length > 0) return i;
    }
  }
  return null;
}
function c_(e, t) {
  for (let n of t) {
    let r = e[n];
    if (typeof r == "number" && Number.isFinite(r)) return r;
    if (typeof r == "string" && r.trim().length > 0) {
      let i = Number(r);
      if (Number.isFinite(i)) return i;
    }
  }
  return null;
}
function lt(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? null : e;
}
function a0(e) {
  try {
    let t = JSON.parse(e);
    return lt(t);
  } catch {
    return null;
  }
}
function d_(e) {
  let t = [],
    n = [],
    r = [],
    i = e.nextEntityId,
    s = e.nextEdgeId;
  for (let a of e.assets) {
    if (!(a.assetKind === "shader_lab" || a.assetKind === "shader_graph" || a.vfsRootPath.endsWith(".shadersubgraph")))
      continue;
    let c = jt(e.fileAbsPathById, a.fileId);
    if (
      c &&
      (a.assetKind === "shader_lab" && (i = l0(t, i, a.id, c)),
      a.assetKind === "shader_graph" || a.vfsRootPath.endsWith(".shadersubgraph"))
    ) {
      let d = d0(t, i, s, a.id, a.guid, a.vfsRootPath, c, e, r);
      ((i = d.nextEntityId), (s = d.nextEdgeId));
    }
  }
  let o = u0(t, n, i, s, r, e);
  return ((i = o.nextEntityId), (s = o.nextEdgeId), { entities: t, edges: n, nextEntityId: i, nextEdgeId: s });
}
function u_(e, t) {
  let n = [],
    r = [],
    i = e.nextEntityId;
  for (let s of e.assets) {
    if (s.assetKind !== "visual_effect_graph") continue;
    let o = e.yamlObjects.filter((f) => f.fileId === s.fileId);
    if (o.length === 0) continue;
    let a = [],
      l = [],
      c = t.has(s.fileId),
      d = c0(a, c ? i : 1, e.nextEdgeId, s.id, s.guid, s.vfsRootPath, jt(e.fileAbsPathById, s.fileId) ?? "", e, l);
    c && (n.push(...a), (i = d.nextEntityId));
    let u = o[0].id;
    for (let f of l)
      r.push(
        ...f.references.map((m) => ({
          referenceKind: "shader_graph_guid_ref",
          sourceYamlObjectId: u,
          sourceFileId: s.fileId,
          sourceLocalKey: f.sourceEntity.localKey,
          fieldPath: m.path,
          targetGuid: m.guid,
          targetFileId: null,
          targetLocalId: m.fileID,
          edgeSubkind: "vfx_graph_guid_reference",
        })),
      );
  }
  return { entities: n, edges: [], pendingEdgeIntents: r, nextEntityId: i, nextEdgeId: e.nextEdgeId };
}
function f_(e) {
  let t = [],
    n = [],
    r = new Map(e.assets.map((a) => [a.id, a])),
    i = new Map(),
    s = e.nextEntityId,
    o = e.nextEdgeId;
  for (let a of e.intents) {
    let l = e.entityIndexes.entityIdByFileIdAndLocalKey.get($e(a.sourceFileId, a.sourceLocalKey)),
      c = e.assetIndexes.assetIdByGuid.get(a.targetGuid ?? ""),
      d = c === void 0 ? void 0 : r.get(c);
    if (!l || !d || d.fileId === a.sourceFileId) continue;
    let u = a.targetLocalId ?? d.guid,
      f = a.targetLocalId ? e.entityIndexes.entityIdByFileIdAndLocalKey.get($e(d.fileId, a.targetLocalId)) : void 0;
    if (
      ((f ??= i.get(`${d.id}:${u}`)),
      f === void 0 &&
        (f = [...e.entityIndexes.entitySummaryById.values()]
          .filter((y) => y.assetId === d.id)
          .find(
            (y) => y.entityKind === "shader_graph_properties" || y.entityKind === "visual_effect_graph_properties",
          )?.entityId),
      f === void 0)
    ) {
      let y = {
        id: s++,
        assetId: d.id,
        yamlObjectId: null,
        entityKind: "subasset",
        localKey: u,
        name: d.name,
        hierarchyName: null,
        typeName: m_(d.assetKind),
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: 1,
        lineEnd: 1,
      };
      (t.push(y), i.set(`${d.id}:${u}`, y.id), (f = y.id));
    }
    let m = _t(l, f, "refs", a.edgeSubkind);
    e.edgeState.seenEntityEdges.has(m) ||
      (e.edgeState.seenEntityEdges.add(m),
      n.push({ id: o++, fromEntityId: l, toEntityId: f, edgeKind: "refs", edgeSubkind: a.edgeSubkind }));
  }
  return { entities: t, edges: n, nextEntityId: s, nextEdgeId: o };
}
function l0(e, t, n, r) {
  let i = r.match(/\bProperties\s*\{([\s\S]*?)^\s*\}/m)?.[1] ?? "",
    s = /^\s*([A-Za-z_][\w]*)\s*\([^,]+,\s*([^)]+)\)/gm;
  for (let l of i.matchAll(s)) {
    let c = l[1],
      d = l[2]?.trim() ?? "";
    e.push(Hf(t++, n, "shader_property", c, g0(d) ? "TextureProperty" : "ShaderProperty"));
  }
  let o = /\bPass\s*\{[\s\S]*?\bName\s+"([^"]+)"/g;
  for (let l of r.matchAll(o)) e.push(Hf(t++, n, "shader_pass", l[1], "ShaderPass"));
  let a = r.match(/\bFallback\s+"([^"]+)"/)?.[1] ?? null;
  return (a && e.push(Hf(t++, n, "shader_fallback", a, "ShaderFallback")), t);
}
function c0(e, t, n, r, i, s, o, a, l) {
  if (!p0(o))
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
  let c = a.yamlObjects.filter((S) => S.fileId === a.assets.find((P) => P.id === r)?.fileId),
    d = t_(c, a.payloadReader);
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
  let u = vr(i, s),
    f = n_(d, u),
    m = `vfx_graph_properties:${u}`,
    y = {
      id: t++,
      assetId: r,
      yamlObjectId: null,
      entityKind: "visual_effect_graph_properties",
      localKey: m,
      name: "Properties",
      hierarchyName: null,
      typeName: "Properties",
      scriptSymbolId: null,
      parentEntityId: null,
      sourceEntityId: null,
      lineStart: 1,
      lineEnd: 1,
      generatedContent: f.get(m) ?? null,
    };
  e.push(y);
  let g = d.subgraphDependencies.flatMap((S) => S.guidReferences),
    h = xr(d.properties),
    b = [...g, ...h];
  b.length > 0 && l.push({ sourceEntity: y, references: b });
  for (let S of d.contexts) {
    let P = `vfx_graph_context:${S.localId}`,
      I = {
        id: t++,
        assetId: r,
        yamlObjectId: null,
        entityKind: "visual_effect_graph_context",
        localKey: P,
        name: S.displayName,
        hierarchyName: null,
        typeName: S.typeName,
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: 1,
        lineEnd: 1,
        generatedContent: f.get(P) ?? null,
      };
    (e.push(I), S.guidReferences.length > 0 && l.push({ sourceEntity: I, references: S.guidReferences }));
  }
  for (let S of d.blocks) {
    let P = `vfx_graph_block:${S.localId}`,
      I = {
        id: t++,
        assetId: r,
        yamlObjectId: null,
        entityKind: "visual_effect_graph_block",
        localKey: P,
        name: S.displayName,
        hierarchyName: null,
        typeName: S.typeName,
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: 1,
        lineEnd: 1,
        generatedContent: f.get(P) ?? null,
      };
    (e.push(I), S.guidReferences.length > 0 && l.push({ sourceEntity: I, references: S.guidReferences }));
  }
  return { nextEntityId: t, nextEdgeId: n };
}
function d0(e, t, n, r, i, s, o, a, l) {
  let c;
  try {
    c = Vf(o);
  } catch (h) {
    return (
      a.diagnostics.push({
        severity: "warning",
        category: "extract",
        stage: "resolve",
        filePath: s,
        message: `Failed to parse ShaderGraph JSON: ${h0(h)}`,
      }),
      { nextEntityId: t, nextEdgeId: n }
    );
  }
  let d = vr(i, s),
    u = $f(c, d),
    f = `shader_graph_properties:${d}`,
    m = {
      id: t++,
      assetId: r,
      yamlObjectId: null,
      entityKind: "shader_graph_properties",
      localKey: f,
      name: "ShaderGraphProperties",
      hierarchyName: null,
      typeName: "ShaderGraphProperties",
      scriptSymbolId: null,
      parentEntityId: null,
      sourceEntityId: null,
      lineStart: 1,
      lineEnd: 1,
      generatedContent: u.get(f) ?? null,
    };
  e.push(m);
  let y = `shader_graph_settings:${d}`,
    g = {
      id: t++,
      assetId: r,
      yamlObjectId: null,
      entityKind: "shader_graph_settings",
      localKey: y,
      name: "ShaderGraphSettings",
      hierarchyName: null,
      typeName: "ShaderGraphSettings",
      scriptSymbolId: null,
      parentEntityId: null,
      sourceEntityId: null,
      lineStart: 1,
      lineEnd: 1,
      generatedContent: u.get(y) ?? null,
    };
  e.push(g);
  for (let h of c.nodes) {
    let b = `shader_graph_node:${h.objectId}`,
      S = {
        id: t++,
        assetId: r,
        yamlObjectId: null,
        entityKind: "shader_graph_node",
        localKey: b,
        name: h.displayName,
        hierarchyName: null,
        typeName: h.typeName,
        scriptSymbolId: null,
        parentEntityId: null,
        sourceEntityId: null,
        lineStart: 1,
        lineEnd: 1,
        generatedContent: u.get(b) ?? null,
      };
    (e.push(S), h.guidReferences.length > 0 && l.push({ sourceEntity: S, references: h.guidReferences }));
  }
  return { nextEntityId: t, nextEdgeId: n };
}
function u0(e, t, n, r, i, s) {
  let o = new Map(s.assets.map((c) => [c.guid, c])),
    a = new Map(s.existingEntities.concat(e).map((c) => [`${c.assetId}:${c.localKey}`, c])),
    l = new Set();
  for (let c of i)
    for (let d of c.references) {
      let u = o.get(d.guid);
      if (!u || u.id === c.sourceEntity.assetId) continue;
      let f = f0(e, a, n, u, d);
      n = f.nextEntityId;
      let m = m0(c.sourceEntity.entityKind, d.path),
        y = `${c.sourceEntity.id}:${f.entity.id}:${m}`;
      l.has(y) ||
        (l.add(y),
        t.push({
          id: r++,
          fromEntityId: c.sourceEntity.id,
          toEntityId: f.entity.id,
          edgeKind: "refs",
          edgeSubkind: m,
        }));
    }
  return { nextEntityId: n, nextEdgeId: r };
}
function f0(e, t, n, r, i) {
  let s = i.fileID ?? r.guid,
    o = t.get(`${r.id}:${s}`);
  if (o) return { entity: o, nextEntityId: n };
  let a = e.find(
    (c) =>
      c.assetId === r.id &&
      (c.entityKind === "shader_graph_properties" || c.entityKind === "visual_effect_graph_properties"),
  );
  if (a) return { entity: a, nextEntityId: n };
  let l = {
    id: n++,
    assetId: r.id,
    yamlObjectId: null,
    entityKind: "subasset",
    localKey: s,
    name: r.name,
    hierarchyName: null,
    typeName: m_(r.assetKind),
    scriptSymbolId: null,
    parentEntityId: null,
    sourceEntityId: null,
    lineStart: 1,
    lineEnd: 1,
  };
  return (e.push(l), t.set(`${r.id}:${l.localKey}`, l), { entity: l, nextEntityId: n });
}
function m0(e, t) {
  return e === "visual_effect_graph_properties" ||
    e === "visual_effect_graph_context" ||
    e === "visual_effect_graph_block"
    ? "vfx_graph_guid_reference"
    : y0(t);
}
function y0(e) {
  let t = e.toLowerCase();
  return t.includes("custom") || t.includes("function") || t.includes("source")
    ? "shader_graph_custom_function"
    : "shader_graph_guid_reference";
}
function m_(e) {
  return e
    .split(/[_-]+/g)
    .filter(Boolean)
    .map((t) => `${t[0]?.toUpperCase() ?? ""}${t.slice(1)}`)
    .join("");
}
function p0(e) {
  return /^\s*%YAML\b/m.test(e) || /^\s*---\s*!u!/m.test(e);
}
function Hf(e, t, n, r, i) {
  return {
    id: e,
    assetId: t,
    yamlObjectId: null,
    entityKind: n,
    localKey: `${n}:${e}`,
    name: r,
    hierarchyName: null,
    typeName: i,
    scriptSymbolId: null,
    parentEntityId: null,
    sourceEntityId: null,
    lineStart: 1,
    lineEnd: 1,
  };
}
function g0(e) {
  return ["2D", "3D", "Cube", "2DArray", "CubeArray"].includes(e);
}
function h0(e) {
  return e instanceof Error ? e.message : String(e);
}
var y_ = Oo(Ys(), 1);
import I0 from "node:path";
var b0 = { intAsBigInt: !0, uniqueKeys: !1 };
function p_(e) {
  let t = [],
    n = e.nextEntityId,
    r = new Map(e.scopedFiles.map((i) => [i.projectRelPath, i]));
  for (let i of e.assets) {
    if (i.assetKind !== "texture") continue;
    let s = r.get(`${i.vfsRootPath}.meta`)?.id ?? -1,
      o = jt(e.fileAbsPathById, s) ?? "",
      a = S0(o);
    for (let l of w0(a, e.metaFileIdToNameByFileId.get(i.fileId)))
      t.push({
        id: n++,
        assetId: i.id,
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
function S0(e) {
  if (!e.trim()) return [];
  try {
    let t = y_.default.parseDocument(e, b0);
    if (t.errors.length > 0) return [];
    let n = t.toJS(),
      r = to(n)?.TextureImporter,
      i = to(r)?.spriteSheet;
    return _0(i);
  } catch {
    return [];
  }
}
function _0(e) {
  let t = to(e);
  if (!t) return [];
  let n = E0(t.sprites),
    r = new Set(n.map((i) => i.name));
  for (let i of R0(t.nameFileIdTable)) r.has(i.name) || (r.add(i.name), n.push(i));
  return n;
}
function E0(e) {
  return Array.isArray(e)
    ? e.flatMap((t) => {
        let n = to(t),
          r = g_(n?.name),
          i = h_(n?.internalID);
        return r && i ? [{ name: r, localKey: i }] : [];
      })
    : [];
}
function R0(e) {
  let t = to(e);
  return t
    ? Object.entries(t).flatMap(([n, r]) => {
        let i = h_(r);
        return i ? [{ name: n, localKey: i }] : [];
      })
    : [];
}
function w0(e, t) {
  if (!t) return e;
  let n = new Set(e.map((i) => i.localKey)),
    r = [...e];
  for (let [i, s] of t) n.has(i) || !s.trim() || (n.add(i), r.push({ name: I0.posix.basename(s.trim()), localKey: i }));
  return r;
}
function to(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : null;
}
function g_(e) {
  return typeof e == "string" && e.trim() ? e.trim() : null;
}
function h_(e) {
  return typeof e == "bigint" || typeof e == "number" ? String(e) : g_(e);
}
function I_(e) {
  let t = [],
    n = e.nextEntityId;
  for (let r of e.assets) {
    if (!(r.assetKind === "uxml" || r.assetKind === "uss")) continue;
    let s = jt(e.fileAbsPathById, r.fileId);
    s && (r.assetKind === "uxml" && (n = P0(t, n, r.id, s)), r.assetKind === "uss" && (n = v0(t, n, r.id, s)));
  }
  return { entities: t, edges: [], nextEntityId: n, nextEdgeId: e.nextEdgeId };
}
function P0(e, t, n, r) {
  let i = /<\s*Template\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  for (let o of r.matchAll(i)) e.push(no(t++, n, "uxml_reference", o[1], "UXMLTemplateReference"));
  let s = /<\s*Style\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
  for (let o of r.matchAll(s)) e.push(no(t++, n, "uxml_reference", o[1], "UXMLStylesheetReference"));
  return t;
}
function v0(e, t, n, r) {
  let i = /@import\s+(?:url\()?["']?([^"');]+)["']?\)?\s*;/gi;
  for (let a of r.matchAll(i)) e.push(no(t++, n, "uss_reference", a[1], "USSImportReference"));
  let s = /\burl\(\s*["']?([^"')]+)["']?\s*\)/gi;
  for (let a of r.matchAll(s)) e.push(no(t++, n, "uss_reference", a[1], "USSUrlReference"));
  let o = /\bresource\(\s*["']([^"']+)["']\s*\)/gi;
  for (let a of r.matchAll(o)) e.push(no(t++, n, "uss_reference", a[1], "USSResourceReference"));
  return t;
}
function no(e, t, n, r, i) {
  return {
    id: e,
    assetId: t,
    yamlObjectId: null,
    entityKind: n,
    localKey: `${n}:${e}`,
    name: r,
    hierarchyName: null,
    typeName: i,
    scriptSymbolId: null,
    parentEntityId: null,
    sourceEntityId: null,
    lineStart: 1,
    lineEnd: 1,
  };
}
function S_(e) {
  return x0(e.payload).flatMap((t) => {
    let n = T0(t.item),
      r = Il(t.item.m_MethodName);
    return r
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
            methodName: r,
            callState: Qf(t.item.m_CallState),
            argumentMode: Qf(t.item.m_Mode),
            objectArgumentTypeName: E_(t.item),
          },
        ]
      : [];
  });
}
function __(e) {
  let t = O0(
      e.symbols.filter((i) => i.symbolKind === "method"),
      (i) => i.containingSymbolId,
    ),
    n = [],
    r = e.nextEntitySymbolEdgeId;
  for (let i of e.intents) {
    let s =
      e.entityIndexes.entitySummaryByYamlObjectId.get(i.sourceYamlObjectId) ??
      b_(e.entityIndexes, i.sourceFileId, i.sourceLocalKey);
    if (!s || !i.targetLocalId || i.targetLocalId === "0" || i.targetGuid || i.callState === 0) continue;
    let o = b_(e.entityIndexes, i.sourceFileId, i.targetLocalId);
    if (!o || o.entityKind !== "component" || o.scriptSymbolId === null) continue;
    let a = (t.get(o.scriptSymbolId) ?? []).filter((c) => c.simpleName === i.methodName),
      l = k0(a, {
        m_Mode: i.argumentMode,
        m_Arguments: { m_ObjectArgumentAssemblyTypeName: i.objectArgumentTypeName },
      });
    if (l.status === "resolved") {
      let c = oS(s.entityId, l.symbol.id, "calls", "unity_event", i.fieldPath);
      if (e.edgeState.seenEntitySymbolEdges.has(c)) continue;
      (e.edgeState.seenEntitySymbolEdges.add(c),
        n.push({
          id: r++,
          fromEntityId: s.entityId,
          toSymbolId: l.symbol.id,
          edgeKind: "calls",
          edgeSubkind: "unity_event",
          sourceFieldPath: i.fieldPath,
        }));
      continue;
    }
    L0({
      diagnostics: e.diagnostics,
      seenDiagnostics: e.edgeState.seenDiagnostics,
      sourcePath: e.sourcePathByFileId?.get(i.sourceFileId) ?? `file:${i.sourceFileId}`,
      sourceLocalKey: i.sourceLocalKey,
      methodName: i.methodName,
      fieldPath: i.fieldPath,
      targetScriptSymbolId: o.scriptSymbolId,
      candidates: a,
      code: l.status === "ambiguous" ? "unity_event_ambiguous_method" : "unity_event_unresolved_method",
    });
  }
  return { entitySymbolEdges: n, nextEntitySymbolEdgeId: r };
}
function x0(e) {
  let t = [];
  return (
    Xf(e, [], (n, r) => {
      if (!n || typeof n != "object" || Array.isArray(n)) return;
      let s = n.m_PersistentCalls;
      if (!s || typeof s != "object" || Array.isArray(s)) return;
      let o = s.m_Calls;
      Array.isArray(o) &&
        o.forEach((a, l) => {
          !a ||
            typeof a != "object" ||
            Array.isArray(a) ||
            t.push({ item: a, fieldPath: [...r, "m_PersistentCalls", "m_Calls", String(l)].join(".") });
        });
    }),
    t
  );
}
function T0(e) {
  let t = e.m_Target;
  if (!t || typeof t != "object" || Array.isArray(t)) return { fileID: null, guid: null };
  let n = t;
  return { fileID: Il(n.fileID), guid: Il(n.guid) };
}
function k0(e, t) {
  if (e.length === 0) return { status: "missing" };
  if (e.length === 1) return { status: "resolved", symbol: e[0] };
  let n = Qf(t.m_Mode),
    r = N0(e, n, t);
  return r.length === 1 ? { status: "resolved", symbol: r[0] } : { status: r.length === 0 ? "missing" : "ambiguous" };
}
function N0(e, t, n) {
  switch (t) {
    case 1:
      return e.filter((r) => hl(r).length === 0);
    case 2:
      return U0(e, n);
    case 3:
      return e.filter((r) => gl(r, ["int", "int32"]));
    case 4:
      return e.filter((r) => gl(r, ["float", "single"]));
    case 5:
      return e.filter((r) => gl(r, ["string"]));
    case 6:
      return e.filter((r) => gl(r, ["bool", "boolean"]));
    default:
      return e;
  }
}
function U0(e, t) {
  let n = E_(t),
    r = e.filter((i) => hl(i).length === 1);
  return n ? r.filter((i) => hl(i)[0] === n) : r;
}
function E_(e) {
  let t = e.m_Arguments;
  if (!t || typeof t != "object" || Array.isArray(t)) return null;
  let n = Il(t.m_ObjectArgumentAssemblyTypeName);
  return n ? R_(n.split(",")[0] ?? n) : null;
}
function gl(e, t) {
  let n = hl(e);
  return n.length === 1 && t.includes(n[0] ?? "");
}
function hl(e) {
  return A0(e.signature).parameterTypes;
}
function A0(e) {
  if (!e) return { parameterTypes: [] };
  let t = e.match(/\((.*)\)/)?.[1]?.trim() ?? "";
  return t
    ? {
        parameterTypes: t
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean)
          .map((n) => n.split(/\s+/)[0] ?? "")
          .map((n) => R_(n)),
      }
    : { parameterTypes: [] };
}
function R_(e) {
  let n = e.replace(/\[\]$/g, "").replace(/<.*>$/g, "");
  return (n.split(".").pop() ?? n).toLowerCase();
}
function L0(e) {
  let t = [e.code, e.sourcePath, e.sourceLocalKey, e.fieldPath, e.methodName, e.targetScriptSymbolId].join(":");
  if (e.seenDiagnostics.has(t)) return;
  e.seenDiagnostics.add(t);
  let n = e.candidates.map((r) => r.signature ?? r.displayName).join("; ");
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
function b_(e, t, n) {
  let r = e.entityIdByFileIdAndLocalKey.get($e(t, n));
  return r === void 0 ? null : (e.entitySummaryById.get(r) ?? null);
}
function Il(e) {
  return typeof e == "string" ? e.trim() || null : typeof e == "number" ? String(e) : null;
}
function Qf(e) {
  if (typeof e == "number") return e;
  if (typeof e == "string" && e.trim()) {
    let t = Number.parseInt(e, 10);
    return Number.isFinite(t) ? t : null;
  }
  return null;
}
function Xf(e, t, n) {
  if ((n(e, t), !(!e || typeof e != "object"))) {
    if (Array.isArray(e)) {
      e.forEach((r, i) => Xf(r, [...t, String(i)], n));
      return;
    }
    Object.entries(e).forEach(([r, i]) => Xf(i, [...t, r], n));
  }
}
function O0(e, t) {
  let n = new Map();
  for (let r of e) {
    let i = t(r),
      s = n.get(i) ?? [];
    (s.push(r), n.set(i, s));
  }
  return n;
}
function ro(e) {
  return {
    *iterateFileBatches(t) {
      C0(t);
      let n = M0(e, t.fileIds),
        r = F0(n),
        i = { fileIds: [], yamlObjectIds: [] };
      for (let [s, o] of r) {
        let a = i.fileIds.length > 0 && i.fileIds.length + 1 > t.maxFilesPerBatch,
          l = i.yamlObjectIds.length > 0 && i.yamlObjectIds.length + o.length > t.maxObjectsPerBatch;
        ((a || l) && (yield i, (i = { fileIds: [], yamlObjectIds: [] })),
          i.fileIds.push(s),
          i.yamlObjectIds.push(...o));
      }
      i.fileIds.length > 0 && (yield i);
    },
    loadRowsForBatch(t) {
      return D0(e, t.yamlObjectIds);
    },
    loadReferencesForBatch(t) {
      return j0(e, t.yamlObjectIds);
    },
  };
}
function C0(e) {
  if (!Number.isFinite(e.maxFilesPerBatch) || e.maxFilesPerBatch <= 0)
    throw new Error("maxFilesPerBatch must be positive.");
  if (!Number.isFinite(e.maxObjectsPerBatch) || e.maxObjectsPerBatch <= 0)
    throw new Error("maxObjectsPerBatch must be positive.");
}
function M0(e, t) {
  let n = `SELECT id, file_id
       FROM yaml_objects`,
    r = t === void 0 ? void 0 : Qe(t);
  return (
    r !== void 0
      ? ke(
          e,
          `${n}
           WHERE file_id IN (`,
          r,
          ") ORDER BY file_id, id",
        )
      : e.prepare(`${n} ORDER BY file_id, id`).all()
  ).sort(w_);
}
function F0(e) {
  let t = new Map();
  for (let n of e) {
    let r = t.get(n.file_id) ?? [];
    (r.push(n.id), t.set(n.file_id, r));
  }
  return t;
}
function D0(e, t) {
  return ke(
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
    .sort(w_)
    .map((r) => ({
      id: r.id,
      fileId: r.file_id,
      objectType: r.object_type,
      localIdentifier: r.local_identifier,
      gameObjectFileId: r.game_object_file_id,
      scriptGuid: r.script_guid,
      scriptFileId: r.script_file_id,
      name: r.name,
      lineStart: r.line_start,
      lineEnd: r.line_end,
    }));
}
function j0(e, t) {
  return ke(
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
    .sort((r, i) => r.id - i.id)
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
function w_(e, t) {
  return e.file_id - t.file_id || e.id - t.id;
}
function Zf(e) {
  let t = rM(e.batchOptions),
    n = e.batchSource ?? ro(e.database),
    r = X0(LS(e.files), e.startAssetId ?? 1);
  Zb(e.database, r);
  let i = V0({ input: e, assets: r }),
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
        P_(i, a.rows.length);
        let c = { database: e.database, state: i, input: e, batch: a };
        (l === "rebuild_entities"
          ? $0(c)
          : (N_(c), k_(c), i.intentStore.addMany(Cf({ yamlObjects: a.rows, payloadReader: a.payloadReader })), Sl(i)),
          W0({ state: i, batch: a }));
      });
    },
    finalize() {
      return (
        o(() => {
          K0({ database: e.database, state: i, input: e });
          for (let a of n.iterateFileBatches({ ...t, fileIds: e.sourceFileIds })) {
            let l = B0(n, a);
            (P_(i, l.rows.length), G0({ database: e.database, state: i, input: e, batch: l }));
          }
        }),
        e.stopwatch?.recordDuration("emit_asset_entities", Math.ceil(s)),
        Jf(e.stopwatch, "collect_pending_edge_intents", () => {}),
        Y0({ database: e.database, state: i, input: e }),
        z0(e.database, i),
        e.onBeforeWriteRows?.(i.summary),
        i.summary
      );
    },
  };
}
function B0(e, t) {
  return { rows: e.loadRowsForBatch(t), yamlReferencesByObjectId: new Map(), yamlMetadataById: new Map() };
}
function T_(e) {
  return {
    rows: e.rows,
    yamlReferencesByObjectId: sM(e.references),
    payloadReader: Df(e.payloadByYamlObjectId),
    yamlMetadataById: vb(e.rows, e.yamlMetadataById, iM(e.references), e.payloadByYamlObjectId),
  };
}
function V0(e) {
  let n = [...(e.input.preservedAssets ?? []), ...e.assets],
    r = new Map(n.map((s) => [s.id, s])),
    i = Nf();
  for (let s of e.input.preservedEntitySummaries ?? []) i.addEntity(s);
  return {
    assets: e.assets,
    indexedAssets: n,
    assetById: r,
    assetIndexes: kf(n, J0(e.input.fileAbsPathById, e.input.preservedFileAbsPathById)),
    entityIndexes: i,
    intentStore: iS(),
    edgeState: sS(),
    scopedMonoScriptSymbols: Wb(e.input.files, e.input.scriptSymbolByFileGuid),
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
function $0(e) {
  let t = new Set(e.batch.rows.map((i) => i.fileId)),
    n = e.state.assets.filter((i) => t.has(i.fileId)),
    r = [dS, MS, DS, OS, pS, gS, bS, jS];
  for (let i of r) {
    let s = U_({ ...e, extractor: i, assets: n });
    bl({ database: e.database, state: e.state, input: e.input, result: s });
  }
  (N_(e), k_(e));
}
function k_(e) {
  (e.state.intentStore.addMany(
    Z0({
      assets: e.state.assets,
      preservedAssets: e.input.preservedAssets ?? [],
      yamlObjects: e.batch.rows,
      yamlMetadataById: e.batch.yamlMetadataById,
      preservedEntitySummaries: e.input.preservedEntitySummaries ?? [],
      edgeSourceFileIds: e.input.edgeSourceFileIds,
      payloadReader: e.batch.payloadReader,
    }),
  ),
    Sl(e.state));
}
function G0(e) {
  let t = FS({
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
  bl({ database: e.database, state: e.state, input: e.input, result: t });
}
function K0(e) {
  let t = [
    { extractor: d_, assets: e.state.assets.filter((n) => n.assetKind !== "visual_effect_graph") },
    {
      extractor: I_,
      assets: e.state.assets.filter(
        (n) => n.assetKind === "uxml" || n.assetKind === "uss" || n.assetKind === "json_file",
      ),
    },
    { extractor: p_, assets: e.state.assets.filter((n) => n.assetKind === "texture") },
    { extractor: US, assets: e.state.assets },
  ];
  for (let { extractor: n, assets: r } of t) {
    if (r.length === 0) continue;
    let i = U_({
      state: e.state,
      input: e.input,
      batch: {
        rows: [],
        yamlMetadataById: new Map(),
        yamlReferencesByObjectId: new Map(),
        payloadReader: Df(new Map()),
      },
      extractor: n,
      assets: r,
    });
    bl({ database: e.database, state: e.state, input: e.input, result: i });
  }
  for (let n of e.state.assets) {
    if (n.assetKind !== "visual_effect_graph" || e.state.processedVisualEffectGraphFileIds.has(n.fileId)) continue;
    jt(e.state.assetIndexes.fileAbsPathById, n.fileId) !== null &&
      e.input.diagnostics.push({
        severity: "warning",
        category: "extract",
        stage: "resolve",
        filePath: n.vfsRootPath,
        message: "Visual Effect Graph structured indexing supports YAML .vfx files only; skipping structured entities.",
      });
  }
}
function N_(e) {
  let t = new Set(e.batch.rows.map((o) => o.fileId)),
    n = new Set(e.state.assets.filter((o) => o.assetKind === "visual_effect_graph").map((o) => o.fileId)),
    r = new Set(e.input.edgeSourceFileIds ?? []),
    i = e.state.indexedAssets.filter(
      (o) => o.assetKind === "visual_effect_graph" && t.has(o.fileId) && (n.has(o.fileId) || r.has(o.fileId)),
    );
  if (i.length === 0) return;
  i.forEach((o) => e.state.processedVisualEffectGraphFileIds.add(o.fileId));
  let s = u_(
    {
      assets: i,
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
  bl({ database: e.database, state: e.state, input: e.input, result: s });
}
function U_(e) {
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
function bl(e) {
  (L_(e.state, { entities: e.result.entities.length, entityEdges: e.result.edges.length }),
    Tf(e.database, [...e.result.entities]),
    (e.state.summary.entityCount += e.result.entities.length));
  for (let t of e.result.entities)
    (e.state.entityIndexes.addEntity(O_(e.state.assetById, t)),
      (t.entityKind === "gameobject" || t.entityKind === "prefab_instance") &&
        e.state.streamedHierarchyEntityById.set(t.id, t));
  (Tr({ database: e.database, state: e.state, input: e.input, edges: e.result.edges }),
    A_({ database: e.database, state: e.state, input: e.input, edges: e.result.entitySymbolEdges ?? [] }),
    "pendingEdgeIntents" in e.result && (e.state.intentStore.addMany(e.result.pendingEdgeIntents), Sl(e.state)),
    (e.state.nextEntityId = e.result.nextEntityId),
    (e.state.nextEdgeId = e.result.nextEdgeId),
    (e.state.nextEntitySymbolEdgeId = e.result.nextEntitySymbolEdgeId ?? e.state.nextEntitySymbolEdgeId));
}
function W0(e) {
  for (let t of e.batch.rows)
    (e.state.intentStore.addMany(
      vS({ yamlObject: t, yamlReferences: e.batch.yamlReferencesByObjectId.get(t.id) ?? [] }),
    ),
      e.state.intentStore.addMany(S_({ yamlObject: t, payload: e.batch.payloadReader.read(t) })));
  Sl(e.state);
}
function Y0(e) {
  let t = Jf(e.input.stopwatch, "sort_pending_edge_intents", () => e.state.intentStore.toSortedArray());
  e.state.summary.pendingEdgeIntentCount = t.length;
  let n = oM(t, e.state.assetIndexes);
  Jf(e.input.stopwatch, "resolve_pending_edge_intents", () => {
    for (let r of lM(t, 2e4)) {
      let i = uS({
        intents: Zn(r, "prefab_link"),
        entityIndexes: e.state.entityIndexes,
        assetIndexes: e.state.assetIndexes,
        edgeState: e.state.edgeState,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = i.nextEdgeId),
        Tr({ database: e.database, state: e.state, input: e.input, edges: i.edges }),
        q0({ database: e.database, state: e.state, input: e.input, updates: i.sourceEntityUpdates }));
      let s = CS({
        intents: Zn(r, "yaml_local_ref").filter((u) => !n.has(aM(u))),
        entityIndexes: e.state.entityIndexes,
        edgeState: e.state.edgeState,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = s.nextEdgeId),
        Tr({ database: e.database, state: e.state, input: e.input, edges: s.edges }));
      let o = hS({
        intents: Zn(r, "animator_ref"),
        entityIndexes: e.state.entityIndexes,
        assetIndexes: e.state.assetIndexes,
        edgeState: e.state.edgeState,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = o.nextEdgeId),
        Tr({ database: e.database, state: e.state, input: e.input, edges: o.edges }));
      let a = xS({
        intents: Zn(r, "asset_ref"),
        entityIndexes: e.state.entityIndexes,
        assetIndexes: e.state.assetIndexes,
        edgeState: e.state.edgeState,
        diagnostics: e.input.diagnostics,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = a.nextEdgeId),
        Tr({ database: e.database, state: e.state, input: e.input, edges: a.edges }));
      let l = SS({
        intents: Zn(r, "audio_mixer_group_ref"),
        entityIndexes: e.state.entityIndexes,
        assetIndexes: e.state.assetIndexes,
        edgeState: e.state.edgeState,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEdgeId = l.nextEdgeId),
        Tr({ database: e.database, state: e.state, input: e.input, edges: l.edges }));
      let c = f_({
        intents: Zn(r, "shader_graph_guid_ref"),
        assets: e.state.indexedAssets,
        assetIndexes: e.state.assetIndexes,
        entityIndexes: e.state.entityIndexes,
        edgeState: e.state.edgeState,
        nextEntityId: e.state.nextEntityId,
        nextEdgeId: e.state.nextEdgeId,
      });
      ((e.state.nextEntityId = c.nextEntityId),
        (e.state.nextEdgeId = c.nextEdgeId),
        Tf(e.database, c.entities),
        (e.state.summary.entityCount += c.entities.length));
      for (let u of c.entities) e.state.entityIndexes.addEntity(O_(e.state.assetById, u));
      Tr({ database: e.database, state: e.state, input: e.input, edges: c.edges });
      let d = __({
        intents: Zn(r, "unity_event"),
        entityIndexes: e.state.entityIndexes,
        symbols: e.input.symbols,
        edgeState: e.state.edgeState,
        diagnostics: e.input.diagnostics,
        nextEntitySymbolEdgeId: e.state.nextEntitySymbolEdgeId,
        sourcePathByFileId: new Map(e.state.indexedAssets.map((u) => [u.fileId, u.vfsRootPath])),
      });
      ((e.state.nextEntitySymbolEdgeId = d.nextEntitySymbolEdgeId),
        A_({ database: e.database, state: e.state, input: e.input, edges: d.entitySymbolEdges }));
    }
  });
}
function Tr(e) {
  L_(e.state, { entities: 0, entityEdges: e.edges.length });
  let t = eM(
    [...e.edges],
    e.state.entityIndexes.entitySummaryById,
    e.input.edgeSourceFileIds,
    e.input.completeEdgeSourceFileIds,
    e.input.edgeTargetFileIds,
  );
  (eS(e.database, t), (e.state.summary.entityEdgeCount += t.length));
}
function A_(e) {
  let t = tM(
    [...e.edges],
    e.state.entityIndexes.entitySummaryById,
    e.input.symbols,
    e.input.edgeSourceFileIds,
    e.input.completeEdgeSourceFileIds,
    e.input.entitySymbolEdgeTargetFileIds,
  );
  (tS(e.database, t), (e.state.summary.entitySymbolEdgeCount += t.length));
}
function q0(e) {
  let t = nM(
    e.updates,
    e.state.entityIndexes.entitySummaryById,
    e.input.edgeSourceFileIds,
    e.input.completeEdgeSourceFileIds,
    e.input.edgeTargetFileIds,
  );
  nS(e.database, t);
  for (let n of t) {
    let r = e.state.streamedHierarchyEntityById.get(n.entityId);
    r && (r.sourceEntityId = n.sourceEntityId);
  }
}
function z0(e, t) {
  let n = new Map();
  for (let i of t.streamedHierarchyEntityById.values()) {
    let s = t.assetIndexes.fileIdByAssetId.get(i.assetId);
    if (s === void 0) continue;
    let o = `${s}:${i.parentEntityId ?? "root"}`,
      a = n.get(o) ?? [];
    (a.push(i), n.set(o, a));
  }
  let r = [];
  for (let i of n.values()) {
    if (!i.some((a) => H0(a, t))) continue;
    i.sort((a, l) => (a.hierarchyOrder ?? a.id) - (l.hierarchyOrder ?? l.id) || a.id - l.id);
    let s = i.map((a) => Q0(a, t)),
      o = new Map();
    for (let a of s) o.set(a, (o.get(a) ?? 0) + 1);
    i.forEach((a, l) => {
      let c = s[l],
        d = (o.get(c) ?? 0) > 1 ? `${c}#${l}` : c;
      ((a.hierarchyName = d), r.push({ entityId: a.id, hierarchyName: d }));
    });
  }
  rS(e, r);
}
function H0(e, t) {
  if (e.entityKind !== "prefab_instance" || !e.sourceEntityId) return !1;
  let n = t.assetById.get(e.assetId),
    r = (e.name ?? e.typeName).trim() || e.typeName;
  return !!(n && r === x_.posix.basename(n.vfsRootPath));
}
function Q0(e, t) {
  let n = (e.name ?? e.typeName).trim() || e.typeName;
  if (e.entityKind !== "prefab_instance" || !e.sourceEntityId) return n;
  let r = t.assetById.get(e.assetId);
  if (!r || n !== x_.posix.basename(r.vfsRootPath)) return n;
  let i = t.streamedHierarchyEntityById.get(e.sourceEntityId),
    s = t.entityIndexes.entitySummaryById.get(e.sourceEntityId);
  return i?.name ?? s?.name ?? i?.typeName ?? s?.typeName ?? n;
}
function P_(e, t) {
  e.summary.peakLoadedYamlObjectRowCount = Math.max(e.summary.peakLoadedYamlObjectRowCount, t);
}
function L_(e, t) {
  ((e.summary.peakBufferedEntityRowCount = Math.max(e.summary.peakBufferedEntityRowCount, t.entities)),
    (e.summary.peakBufferedEntityEdgeRowCount = Math.max(e.summary.peakBufferedEntityEdgeRowCount, t.entityEdges)));
}
function Sl(e) {
  ((e.summary.peakPendingEdgeIntentCount = Math.max(e.summary.peakPendingEdgeIntentCount, e.intentStore.count())),
    (e.summary.peakPendingEdgeIntentBytes = Math.max(
      e.summary.peakPendingEdgeIntentBytes,
      e.intentStore.approximateSizeBytes(),
    )));
}
function X0(e, t) {
  let n = t;
  return e.map((r) => ({ ...r, id: n++ }));
}
function J0(e, t) {
  return t === void 0 || t.size === 0 ? e : new Map([...t, ...e]);
}
function Jf(e, t, n) {
  if (!e) return n();
  e.start(t);
  try {
    return n();
  } finally {
    e.stop(t);
  }
}
function Z0(e) {
  if (e.preservedAssets.length === 0) return [];
  let t = new Set(e.assets.map((o) => o.fileId)),
    n = e.edgeSourceFileIds === void 0 ? void 0 : new Set(e.edgeSourceFileIds),
    r = new Map(e.preservedAssets.map((o) => [o.fileId, o])),
    i = Nf();
  for (let o of e.preservedEntitySummaries) i.addEntity(o);
  let s = [];
  for (let o of e.yamlObjects) {
    if (o.objectType !== "PrefabInstance" || t.has(o.fileId) || (n !== void 0 && !n.has(o.fileId))) continue;
    let a = r.get(o.fileId),
      l = e.yamlMetadataById.get(o.id)?.sourcePrefabGuid;
    if (!a || !l) continue;
    let c = i.projectableRootEntityIdByAssetId.get(a.id),
      d = c ? i.entitySummaryById.get(c)?.yamlObjectId : null;
    s.push({
      referenceKind: "prefab_link",
      sourceYamlObjectId: o.id,
      sourceFileId: o.fileId,
      sourceLocalKey: o.localIdentifier,
      fieldPath: "PrefabInstance.m_SourcePrefab",
      targetGuid: l,
      targetFileId: null,
      targetLocalId: pt(e.payloadReader.read(o), ["m_SourcePrefab"]),
      edgeKind: a.assetKind === "prefab" && o.id === d ? "variant_of" : "instance_of",
      prefabSourceGuid: l,
    });
  }
  return s;
}
function eM(e, t, n, r, i) {
  if (n === void 0) return e;
  let s = new Set(n),
    o = new Set(r ?? []),
    a = i !== void 0,
    l = new Set(i ?? []);
  return e.filter((c) => {
    let d = t.get(c.fromEntityId);
    if (d === void 0 || !s.has(d.fileId)) return !1;
    if (o.has(d.fileId) || !a) return !0;
    let u = t.get(c.toEntityId);
    return u !== void 0 && l.has(u.fileId);
  });
}
function tM(e, t, n, r, i, s) {
  if (r === void 0) return e;
  let o = new Set(r),
    a = new Set(i ?? []),
    l = s !== void 0,
    c = new Set(s ?? []),
    d = new Map(n.map((u) => [u.id, u]));
  return e.filter((u) => {
    let f = t.get(u.fromEntityId);
    if (f === void 0 || !o.has(f.fileId)) return !1;
    if (a.has(f.fileId) || !l) return !0;
    let m = d.get(u.toSymbolId);
    return m !== void 0 && m.fileId !== null && c.has(m.fileId);
  });
}
function nM(e, t, n, r, i) {
  if (n === void 0) return e;
  let s = new Set(n),
    o = new Set(r ?? []),
    a = i !== void 0,
    l = new Set(i ?? []);
  return e.filter((c) => {
    let d = t.get(c.entityId);
    if (d === void 0 || !s.has(d.fileId)) return !1;
    if (o.has(d.fileId) || !a) return !0;
    let u = t.get(c.sourceEntityId ?? -1);
    return u !== void 0 && l.has(u.fileId);
  });
}
function rM(e = {}) {
  return { maxFilesPerBatch: v_(e.maxFilesPerBatch, 750), maxObjectsPerBatch: v_(e.maxObjectsPerBatch, 2e4) };
}
function v_(e, t) {
  return e === void 0 || !Number.isFinite(e) || e <= 0 ? t : Math.floor(e);
}
function iM(e) {
  let t = new Map();
  for (let n of e) {
    if (n.refKind !== "guid-file" || n.targetGuid === null) continue;
    let r = t.get(n.sourceYamlObjectId) ?? new Map();
    (r.has(n.fieldPath) || r.set(n.fieldPath, n.targetGuid), t.set(n.sourceYamlObjectId, r));
  }
  return t;
}
function sM(e) {
  let t = new Map();
  for (let n of e) {
    let r = t.get(n.sourceYamlObjectId);
    r === void 0 ? t.set(n.sourceYamlObjectId, [n]) : r.push(n);
  }
  return t;
}
function O_(e, t) {
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
function Zn(e, t) {
  return e.filter((n) => n.referenceKind === t);
}
function oM(e, t) {
  return new Set(
    Zn(e, "asset_ref")
      .filter(
        (n) =>
          n.targetGuid === null || t.fileIdByAssetId.get(t.assetIdByGuid.get(n.targetGuid) ?? -1) === n.sourceFileId,
      )
      .map((n) => C_(n.sourceYamlObjectId, n.sourceFileId, n.sourceLocalKey, n.targetLocalId ?? n.targetFileId)),
  );
}
function aM(e) {
  return C_(e.sourceYamlObjectId, e.sourceFileId, e.sourceLocalKey, e.targetLocalId);
}
function C_(e, t, n, r) {
  return [e, t, n, r ?? ""].join(":");
}
function lM(e, t) {
  let n = [];
  for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
  return n;
}
import { readFileSync as cM } from "node:fs";
function dM() {
  let e = process.env.UNITY_INSIGHT_MAX_FANOUT_SCOPES;
  if (!e?.trim()) return 64;
  let t = Number.parseInt(e, 10);
  return Number.isFinite(t) && t > 0 ? t : 64;
}
function Jt(e, t) {
  for (let n of e) {
    let r = t.get(n.key);
    if (!r) {
      t.set(n.key, {
        ...n,
        fileIds: [...n.fileIds],
        projectRelPaths: [...n.projectRelPaths],
        vfsPathPrefixes: [...n.vfsPathPrefixes],
      });
      continue;
    }
    let i = new Set([...r.fileIds, ...n.fileIds]),
      s = new Set([...r.projectRelPaths, ...n.projectRelPaths]),
      o = new Set([...r.vfsPathPrefixes, ...n.vfsPathPrefixes]);
    t.set(n.key, { kind: r.kind, key: r.key, fileIds: [...i], projectRelPaths: [...s], vfsPathPrefixes: [...o] });
  }
}
function em(e, t, n = "file", r = "fanout") {
  let i = e.prepare("SELECT project_rel_path FROM files WHERE id = ?").get(t);
  if (!i) return null;
  let s = i.project_rel_path.replace(/\\/g, "/");
  return { kind: n, key: `${r}:${s}`, fileIds: [t], projectRelPaths: [s], vfsPathPrefixes: ys(s) };
}
function uM(e, t) {
  let n = new Set();
  for (let r of t)
    e.prepare(
      `SELECT DISTINCT file_id
         FROM yaml_references
         WHERE target_guid = ?`,
    )
      .all(r)
      .forEach((s) => n.add(s.file_id));
  return [...n];
}
function fM(e, t, n, r) {
  let i = new Set(),
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
    if (i.has(d)) continue;
    i.add(d);
    let u = l.all(d);
    for (let f of u) {
      if (!n.has(f.id) && !s.has(f.id)) {
        if (o >= r) return { fileIds: Qe([...s]), overflow: !0 };
        o += 1;
      }
      (s.add(f.id), f.guid && !i.has(f.guid) && c.push(f.guid));
    }
  }
  return { fileIds: Qe([...s]), overflow: !1 };
}
function tm(e) {
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
function mM(e, t) {
  let n = new Set();
  for (let r of t) {
    let i = r.replace(/\\/g, "/"),
      s = `${i}:/`,
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
        .all(`${s}%`, i, `${s}%`, `${s}%`, `${s}%`);
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
function _l(e, t) {
  let n = new Set(),
    r = yM(e);
  for (let i of t) {
    let s = r.get(i) ?? null,
      o = e
        .prepare(
          `SELECT decl_kind, qualified_name_text
         FROM cs_declarations
         WHERE file_id = ?
           AND decl_kind IN ('class', 'interface', 'struct')
           AND qualified_name_text IS NOT NULL
         ORDER BY decl_kind, qualified_name_text`,
        )
        .all(i);
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
        .filter((d) => (r.get(d.file_id) ?? null) === s);
      c.length <= 1 || c.forEach((d) => n.add(d.file_id));
    }
  }
  return [...n].sort((i, s) => i - s);
}
function yM(e) {
  let t = new Map(
      e
        .prepare("SELECT id, name FROM assemblies")
        .all()
        .map((s) => [s.name, s.id]),
    ),
    n = pM(e, t),
    r = e
      .prepare(
        `SELECT id, project_rel_path
       FROM files
       WHERE kind = 'csharp'`,
      )
      .all(),
    i = new Map();
  for (let s of r) {
    let o = s.project_rel_path.replace(/\\/g, "/"),
      a = gM(o, n);
    if (a) {
      i.set(s.id, a);
      continue;
    }
    let l = o.toLowerCase().includes("/editor/") ? "Assembly-CSharp-Editor" : "Assembly-CSharp";
    i.set(s.id, t.get(l) ?? null);
  }
  return i;
}
function pM(e, t) {
  let n = new Map(),
    r = e
      .prepare(
        `SELECT project_rel_path, abs_path
       FROM files
       WHERE kind = 'asmdef'`,
      )
      .all();
  for (let i of r)
    try {
      let s = cM(i.abs_path, "utf8"),
        o = mr(s),
        a = t.get(o.name);
      a && n.set(nm(i.project_rel_path.replace(/\\/g, "/")), a);
    } catch {}
  return n;
}
function gM(e, t) {
  let n = nm(e);
  for (; n !== "." && n !== "";) {
    let r = t.get(n);
    if (r) return r;
    n = nm(n);
  }
  return null;
}
function nm(e) {
  let t = e.replace(/\\/g, "/"),
    n = t.lastIndexOf("/");
  return n < 0 ? "." : t.slice(0, n);
}
function rm(e, t, n, r = {}) {
  let i = r.maxFanoutScopes ?? dM(),
    s = r.csharpSymbolOnly ?? t.csharpSymbolOnlyChanges,
    o = r.assetSelfOnly ?? t.assetSelfOnlyChanges,
    a = r.referenceFanout ?? !1,
    l = a && !s && !o,
    c = new Map();
  if ((Jt(t.scopes, c), c.size > i || t.requiresFullDerivedRebuild)) return tm(t);
  let d = [];
  if (l)
    for (let _ of t.resolveFileIds) {
      let L = e.prepare("SELECT guid FROM files WHERE id = ?").get(_);
      L?.guid && d.push(L.guid);
    }
  let u = l ? uM(e, d) : [],
    f = t.scopes
      .filter((_) => _.kind === "structural")
      .flatMap((_) => _.projectRelPaths)
      .filter((_) => !_.endsWith(".meta")),
    m = a ? mM(e, f) : [],
    y = fM(
      e,
      Qe([...t.scopes.flatMap((_) => _.fileIds), ...t.deletedFileIds]),
      new Set([...t.resolveFileIds, ...t.scopes.flatMap((_) => _.fileIds)]),
      i - c.size,
    );
  if (y.overflow) return tm(t);
  let g = y.fileIds;
  g.length > 0 && (o = !1);
  let h = _l(e, t.resolveFileIds),
    b = [],
    S = [...u, ...m, ...g, ...h];
  for (let _ of S) {
    if (t.resolveFileIds.includes(_)) continue;
    let L = em(e, _, "file", g.includes(_) ? "prefab-consumer" : "fanout");
    L && b.push(L);
  }
  Jt(b, c);
  let P = [...c.values()];
  if (P.length > i) return tm(t);
  let I = Qe([...t.resolveFileIds, ...P.flatMap((_) => _.fileIds)]),
    E = wr(e, I),
    w = _l(e, E),
    T = a && s ? Xb(e, E) : [],
    x = s ? Qe([...E, ...w, ...T]) : o ? Qe(t.resolveFileIds) : I,
    O = new Map(),
    F = new Map();
  if (s) {
    (Jt(t.scopes, O), Jt(t.scopes, F));
    for (let _ of w) {
      let L = em(e, _, "file", "fanout");
      L && Jt([L], F);
    }
    for (let _ of x) {
      if (t.resolveFileIds.includes(_)) continue;
      let L = em(e, _, "file", "fanout");
      L && Jt([L], O);
    }
  } else o ? (Jt(t.scopes, O), Jt(t.scopes, F)) : (Jt(P, O), Jt(P, F));
  let Y = new Set(x),
    K = s ? og(e, wr(e, t.resolveFileIds)) : [];
  return {
    scopes: P,
    materializeScopes: [...O.values()],
    purgeScopes: [...F.values()],
    resolveFileIds: [...Y],
    fanoutTruncated: !1,
    csharpSymbolOnly: s,
    assetSelfOnly: o,
    scriptPatchGuids: K,
  };
}
function im(e, t, n, r) {
  let i = new Map(),
    s = Oe(e, "symbols");
  for (let d of [...t].sort((u, f) => u.id - f.id)) {
    let u = s++;
    (i.set(d.id, u), (d.id = u));
  }
  for (let d of t)
    d.containingSymbolId !== null &&
      i.has(d.containingSymbolId) &&
      (d.containingSymbolId = i.get(d.containingSymbolId) ?? d.containingSymbolId);
  let o = Oe(e, "symbol_edges"),
    a = n.map((d) => ({
      ...d,
      id: o++,
      fromSymbolId: i.get(d.fromSymbolId) ?? d.fromSymbolId,
      toSymbolId: i.get(d.toSymbolId) ?? d.toSymbolId,
    })),
    l = Oe(e, "semantic_bindings"),
    c = r.map((d) => ({
      ...d,
      id: l++,
      sourceSymbolId: i.get(d.sourceSymbolId) ?? d.sourceSymbolId,
      targetSymbolId: d.targetSymbolId === null ? null : (i.get(d.targetSymbolId) ?? d.targetSymbolId),
    }));
  return { symbols: t, edges: a, bindings: c };
}
import { existsSync as bM } from "node:fs";
import { fileURLToPath as j_ } from "node:url";
import { Worker as SM } from "node:worker_threads";
import { createHash as M_ } from "node:crypto";
import { readFile as hM } from "node:fs/promises";
function sm(e, t = IM(e)) {
  if (!e?.startsWith("%YAML")) return { kind: "skipped_binary", observedHash: t };
  try {
    let n = Ub();
    return { kind: "extracted", extracted: Ab(e, n), phaseDurations: n, observedHash: t };
  } catch (n) {
    return { kind: "error", message: D_(n), observedHash: t };
  }
}
async function F_(e) {
  try {
    let t = await hM(e),
      n = M_("sha256").update(t).digest("hex");
    return al(t) ? sm(t.toString("utf8"), n) : { kind: "skipped_binary", observedHash: n };
  } catch (t) {
    return { kind: "error", message: D_(t), observedHash: null };
  }
}
function IM(e) {
  return e === null ? null : M_("sha256").update(e).digest("hex");
}
function D_(e) {
  return e instanceof Error ? e.message : String(e);
}
var _M = 64 * 1024 * 1024,
  EM = 16 * 1024 * 1024,
  RM = 2;
function wM(e = process.env) {
  return {
    recycleBytes: om(e.UNITY_INSIGHT_YAML_WORKER_RECYCLE_BYTES, _M),
    largeFileBytes: om(e.UNITY_INSIGHT_YAML_LARGE_FILE_BYTES, EM),
    maxConcurrentLargeFiles: TM(e.UNITY_INSIGHT_YAML_MAX_CONCURRENT_LARGE_FILES, RM),
  };
}
function am() {
  return tg();
}
function PM(e, t, n = {}) {
  return process.env.UNITY_INSIGHT_YAML_PARSE_WORKERS === "0" || t < 1 || e <= 1 || n.hasOnlyDeferredContent === !1
    ? !1
    : (n.canCreateWorker ?? V_() !== null);
}
async function B_(e, t = {}) {
  if (e.length === 0) return [];
  let n = t.concurrency ?? am(),
    r = V_(),
    i = e.every((o) => o.contentText === null),
    s = t.dependencies?.createWorker !== void 0 || r !== null;
  return PM(e.length, n, { hasOnlyDeferredContent: i, canCreateWorker: s })
    ? vM(e, r ?? "", n, t)
    : xM(e, n, t.onFileComplete, t.onFileOutcome, t.deliverOutcomesInOrder === !0, t.retainResults !== !1);
}
async function vM(e, t, n, r) {
  let i = r.reusePolicy ?? wM(),
    s = Math.min(n, e.length),
    o = s * 2,
    a = r.retainResults !== !1,
    l = a ? new Array(e.length) : void 0,
    c = new Map(),
    d = new Uint8Array(e.length),
    u = new Set(),
    f = new Map(),
    m = [],
    y = r.dependencies?.createWorker ?? ((B) => new SM(B)),
    g = {
      ...i,
      initialWorkerCount: 0,
      replacementWorkerCount: 0,
      retiredForLargeFileCount: 0,
      retiredForCumulativeBytesCount: 0,
      processedBytes: 0,
      peakConcurrentLargeFiles: 0,
    },
    h = 1,
    b = 0,
    S = 0,
    P = 0,
    I = 0,
    E = 0,
    w = 0,
    T = !1,
    x = !1,
    O = null,
    F = null,
    Y = [],
    K = [],
    _ = !1,
    L = new Promise((B, W) => {
      ((O = B), (F = W));
    }),
    N = (B) => {
      T || ((T = !0), F?.(B instanceof Error ? B : new Error(String(B))));
    },
    j = (B) => {
      let W = m.indexOf(B);
      W >= 0 && m.splice(W, 1);
    },
    z = (B) => (B.terminationPromise || (B.terminationPromise = B.worker.terminate()), B.terminationPromise),
    te = () => I < e.length,
    se = (B) => i.largeFileBytes > 0 && e[B].sizeBytes >= i.largeFileBytes,
    ce = () => {
      if (r.deliverOutcomesInOrder !== !0) {
        if (w < i.maxConcurrentLargeFiles && P < Y.length) {
          let W = Y[P];
          return ((P += 1), W);
        }
        for (; S < e.length;) {
          let W = S;
          if (((S += 1), se(W) && w >= i.maxConcurrentLargeFiles)) {
            Y.push(W);
            continue;
          }
          return W;
        }
        return null;
      }
      let B = Math.min(e.length, b + o);
      for (let W = b; W < B; W += 1) if (d[W] === 0 && !(se(W) && w >= i.maxConcurrentLargeFiles)) return W;
      return null;
    },
    ie = (B) => {
      if (T || x || B.state !== "idle") return !1;
      let W = ce();
      if (W === null) return !1;
      let ue = se(W);
      ((d[W] = 1),
        (B.state = "busy"),
        (B.activeTaskIndex = W),
        (B.activeTaskIsLarge = ue),
        ue && ((w += 1), (g.peakConcurrentLargeFiles = Math.max(g.peakConcurrentLargeFiles, w))));
      let xe = e[W];
      try {
        B.worker.postMessage({ type: "extract", taskIndex: W, absolutePath: xe.absolutePath });
      } catch (Se) {
        N(Se);
      }
      return !0;
    },
    re = () => {
      for (let B = 0; B < m.length && !T;) {
        let W = m[B];
        if (W.state !== "idle") {
          m.splice(B, 1);
          continue;
        }
        if (ie(W)) {
          m.splice(B, 1);
          continue;
        }
        B += 1;
      }
    },
    k = () => {
      !T && I === e.length && E === e.length && ((T = !0), O?.(l ?? []));
    },
    C = async () => {
      if (!(_ || T)) {
        _ = !0;
        try {
          for (; !T;) {
            let B = r.deliverOutcomesInOrder === !0 ? c.get(b) : K.shift();
            if (!B) break;
            r.deliverOutcomesInOrder === !0 && c.delete(b);
            let W = r.onFileOutcome?.(B);
            for (W && typeof W.then == "function" && (await W), d[B.taskIndex] = 3, E += 1; b < d.length && d[b] === 3;)
              b += 1;
            re();
          }
          k();
        } catch (B) {
          N(B);
        } finally {
          _ = !1;
        }
      }
    },
    v = (B) => {
      (r.deliverOutcomesInOrder === !0 ? c.set(B.taskIndex, B) : K.push(B), C());
    },
    A = async (B, W) => {
      B.state === "retiring" ||
        B.state === "closing" ||
        B.state === "stopped" ||
        ((B.state = W === "pool_close" ? "closing" : "retiring"),
        j(B),
        W === "large_file"
          ? (g.retiredForLargeFileCount += 1)
          : W === "cumulative_bytes" && (g.retiredForCumulativeBytesCount += 1),
        await z(B),
        (B.state = "stopped"),
        u.delete(B),
        f.delete(B.worker),
        W !== "pool_close" && !T && !x && te() && u.size < s && (D(!0), re()));
    },
    M = (B, W) => {
      if (T || x || W.type !== "result") return;
      if (B.state !== "busy" || B.activeTaskIndex === null || W.taskIndex !== B.activeTaskIndex) {
        N(new Error(`YAML extract worker ${B.generation} returned unexpected task ${W.taskIndex}`));
        return;
      }
      let ue = B.activeTaskIndex,
        xe = B.activeTaskIsLarge;
      ((B.activeTaskIndex = null), (B.activeTaskIsLarge = !1), xe && (w -= 1));
      let Se = e[ue];
      ((B.processedBytes += Se.sizeBytes), (g.processedBytes += Se.sizeBytes), (d[ue] = 2));
      let fn = { taskIndex: ue, file: Se, outcome: W.outcome };
      (a && l && (l[ue] = fn), (I += 1));
      try {
        (v(fn), r.onFileComplete?.());
      } catch (Ie) {
        N(Ie);
        return;
      }
      let Z = i.largeFileBytes > 0 && Se.sizeBytes >= i.largeFileBytes,
        ne = i.recycleBytes > 0 && B.processedBytes >= i.recycleBytes,
        ge = Z ? "large_file" : ne ? "cumulative_bytes" : null;
      (ge ? A(B, ge).catch(N) : ((B.state = "idle"), m.push(B)), k(), I !== e.length && re());
    },
    D = (B) => {
      let W = y(t),
        ue = {
          worker: W,
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
        f.set(W, ue),
        W.on("message", (xe) => {
          M(ue, xe);
        }),
        W.once("error", (xe) => {
          !T && !x && N(xe);
        }),
        W.once("exit", (xe) => {
          let Se = f.get(W);
          Se &&
            (Se.state === "retiring" ||
              Se.state === "closing" ||
              Se.state === "stopped" ||
              N(new Error(`YAML extract worker ${Se.generation} exited unexpectedly with code ${xe}`)));
        }),
        B ? (g.replacementWorkerCount += 1) : (g.initialWorkerCount += 1),
        (ue.state = "idle"),
        m.push(ue),
        ue
      );
    },
    H,
    ae,
    Q = !1;
  try {
    for (let B = 0; B < s; B += 1)
      try {
        D(!1);
      } catch (W) {
        N(W);
        break;
      }
    (re(), (H = await L));
  } catch (B) {
    ((Q = !0), (ae = B));
  }
  ((x = !0), (m.length = 0));
  let fe = [...u];
  for (let B of fe) B.state !== "retiring" && B.state !== "stopped" && (B.state = "closing");
  let Re = await Promise.allSettled(fe.map(async (B) => z(B)));
  (u.clear(), f.clear());
  for (let B of fe) B.state = "stopped";
  if ((kM(r.onPoolSummary, g), Q)) throw ae;
  let Pe = Re.find((B) => B.status === "rejected");
  if (Pe) throw Pe.reason;
  return H ?? [];
}
async function xM(e, t, n, r, i = !1, s = !0) {
  let o = s ? new Array(e.length) : void 0,
    a = new Map(),
    l = new Map(),
    c = 0,
    d = 0,
    u = !1,
    f,
    m = Math.min(t, e.length),
    y = async () => {
      if (!u) {
        u = !0;
        try {
          for (; a.has(d);) {
            let b = a.get(d);
            (a.delete(d), await r?.(b), l.get(d)?.resolve(), l.delete(d), (d += 1));
          }
        } catch (b) {
          f = b;
          for (let S of l.values()) S.reject(b);
          l.clear();
        } finally {
          u = !1;
        }
      }
    },
    g = (b) => {
      if (f !== void 0) return Promise.reject(f);
      if (!i) return Promise.resolve(r?.(b));
      a.set(b.taskIndex, b);
      let S = new Promise((P, I) => {
        l.set(b.taskIndex, { resolve: P, reject: I });
      });
      return (y(), S);
    };
  async function h() {
    for (;;) {
      let b = c;
      if (((c += 1), b >= e.length)) return;
      let S = e[b],
        P = S.contentText === null ? await F_(S.absolutePath) : sm(S.contentText),
        I = { taskIndex: b, file: S, outcome: P };
      (s && o && (o[b] = I), n?.(), await g(I));
    }
  }
  return (await Promise.all(Array.from({ length: m }, () => h())), o ?? []);
}
function om(e, t) {
  if (e === void 0 || !/^\d+$/.test(e)) return t;
  let n = Number(e);
  return Number.isSafeInteger(n) && n >= 0 ? n : t;
}
function TM(e, t) {
  let n = om(e, t);
  return n > 0 ? n : t;
}
function kM(e, t) {
  try {
    e?.({ ...t });
  } catch {}
}
function V_() {
  let e = [
    j_(new URL("./yamlExtractWorker.js", import.meta.url)),
    j_(new URL("../../../bundle/yamlExtractWorker.js", import.meta.url)),
  ];
  for (let t of e) if (bM(t)) return t;
  return null;
}
async function lm(e) {
  let t = NM(e.workItems),
    n = new Map(t.map((c) => [c.absolutePath, c])),
    r = e.dependencies?.extractYamlFiles ?? B_,
    i = ro(e.database),
    s = [],
    o = Oe(e.database, "yaml_objects"),
    a = Oe(e.database, "yaml_references"),
    l = 0;
  e.stopwatch?.start("yaml_parallel_extract");
  try {
    await r(t, {
      concurrency: am(),
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
          let b =
            u.rawMode === "reuse_existing_raw" &&
            d.kind === "skipped_binary" &&
            e.database.prepare("SELECT 1 FROM yaml_objects WHERE file_id = ? LIMIT 1").get(u.id) === void 0;
          if (u.rawMode === "reuse_existing_raw" && !b)
            throw new Error(
              `Failed to reuse indexed YAML source ${u.absolutePath}: ${d.kind === "error" ? d.message : "not text YAML"}.`,
            );
          let S = [],
            P = [];
          (wf(u, d, e.diagnostics, o, a, S, P), G_(e, ++l, t.length));
          return;
        }
        s.push(d.phaseDurations);
        let f, m, y, g;
        if (u.rawMode === "refresh_raw") {
          let b = [],
            S = [],
            P = wf(u, d, e.diagnostics, o, a, b, S);
          ((o = P.nextObjectId),
            (a = P.nextReferenceId),
            Tg(e.database, b, S),
            (f = b.map(UM)),
            (m = S),
            ({ payloadByYamlObjectId: y, yamlMetadataById: g } = $_(f, d.extracted.objects, u.absolutePath)));
        } else {
          let b = [
            ...i.iterateFileBatches({
              fileIds: [u.id],
              maxFilesPerBatch: 1,
              maxObjectsPerBatch: Number.MAX_SAFE_INTEGER,
            }),
          ][0] ?? { fileIds: [u.id], yamlObjectIds: [] };
          ((f = i.loadRowsForBatch(b)),
            (m = i.loadReferencesForBatch(b)),
            ({ payloadByYamlObjectId: y, yamlMetadataById: g } = $_(f, d.extracted.objects, u.absolutePath)));
        }
        let h = T_({ rows: f, references: m, payloadByYamlObjectId: y, yamlMetadataById: g });
        try {
          u.semanticRole !== "none" && e.stream.consumeBatch(h, u.semanticRole);
        } finally {
          h.payloadReader.clear();
        }
        G_(e, ++l, t.length);
      },
    });
  } finally {
    e.stopwatch?.stop("yaml_parallel_extract");
  }
  return (Db(e.stopwatch, s), e.stream.finalize());
}
function NM(e) {
  let t = new Map();
  for (let n of e) {
    let r = t.get(n.absolutePath);
    if (!r) {
      t.set(n.absolutePath, { ...n });
      continue;
    }
    ((r.rawMode = AM(r.rawMode, n.rawMode)), (r.semanticRole = LM(r.semanticRole, n.semanticRole)));
  }
  return [...t.values()].sort((n, r) => n.id - r.id || n.projectRelPath.localeCompare(r.projectRelPath));
}
function $_(e, t, n) {
  let r = new Map();
  for (let l of e) {
    if (r.has(l.localIdentifier)) throw new Error(`Duplicate indexed YAML identifier ${l.localIdentifier} in ${n}.`);
    r.set(l.localIdentifier, l);
  }
  let i = new Set(),
    s = new Set(),
    o = new Map(),
    a = new Map();
  for (let l of t) {
    if (s.has(l.localIdentifier)) throw new Error(`Duplicate parsed YAML identifier ${l.localIdentifier} in ${n}.`);
    s.add(l.localIdentifier);
    let c = r.get(l.localIdentifier);
    if (!c) throw new Error(`Parsed YAML object ${l.localIdentifier} has no indexed row in ${n}.`);
    if (c.objectType !== l.objectType) throw new Error(`Parsed YAML object ${l.localIdentifier} changed type in ${n}.`);
    (i.add(c.id), o.set(c.id, l.payload), a.set(c.id, l.metadata));
  }
  for (let l of e)
    if (!i.has(l.id)) throw new Error(`Indexed YAML object ${l.localIdentifier} was not parsed from ${n}.`);
  return { payloadByYamlObjectId: o, yamlMetadataById: a };
}
function UM(e) {
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
function AM(e, t) {
  return e === "refresh_raw" || t === "refresh_raw" ? "refresh_raw" : "reuse_existing_raw";
}
function LM(e, t) {
  let n = { none: 0, intent_only: 1, rebuild_entities: 2 };
  return n[e] >= n[t] ? e : t;
}
function G_(e, t, n) {
  e.onProgress?.(t, n, `Parsing and resolving Unity assets (${t}/${n})`);
}
async function MM(e, t) {
  let { stopwatch: n } = t;
  n?.start("load_raw_rows");
  let r = er(e),
    i = wl(e),
    s = Pl(e),
    o = vl(e);
  (n?.stop("load_raw_rows"), n?.start("resolve_symbols"));
  let a = await Hs({ files: r, assemblies: i, declarations: s, mentions: o }),
    l = a.symbols.length,
    c = a.bindings.length;
  (t.onProgress?.(l, l, `Resolved ${l} symbols`), n?.stop("resolve_symbols"));
  let d = cm(r),
    u = await q_(r);
  return (
    n?.start("write_resolved_rows"),
    ea(e),
    Xs(e, a.symbols, a.edges, a.bindings),
    t.onProgress?.(l, l, `Wrote ${l} symbol rows`),
    n?.stop("write_resolved_rows"),
    {
      files: r,
      fileAbsPathById: d,
      metaFileIdToNameByFileId: u,
      scriptSymbolByFileGuid: a.scriptSymbolByFileGuid,
      symbols: a.symbols,
      symbolCount: l,
      bindingCount: c,
    }
  );
}
async function ki(e, t = {}) {
  let { stopwatch: n } = t,
    r = await MM(e, t);
  n?.start("build_asset_graph");
  let i = !1,
    s = Zf({
      database: e,
      files: r.files,
      fileAbsPathById: r.fileAbsPathById,
      metaFileIdToNameByFileId: r.metaFileIdToNameByFileId,
      scriptSymbolByFileGuid: r.scriptSymbolByFileGuid,
      symbols: r.symbols,
      diagnostics: t.diagnostics ?? [],
      batchOptions: t.yamlBatchOptions,
      stopwatch: n,
      onBeforeWriteRows: (c) => {
        (t.onProgress?.(c.assetCount, c.assetCount, `Resolved ${c.assetCount} assets`),
          t.onProgress?.(c.entityCount, c.entityCount, `Resolved ${c.entityCount} entities`),
          n?.stop("build_asset_graph"),
          n?.start("write_resolved_rows"),
          (i = !0));
      },
    }),
    o = new Set(t.refreshedYamlFileIds ?? []),
    a = await lm({
      database: e,
      diagnostics: t.diagnostics ?? [],
      stream: s,
      stopwatch: n,
      onProgress: t.onProgress,
      dependencies: t.yamlIndexPassDependencies,
      workItems: r.files.flatMap((c) =>
        Lt(c.projectRelPath) === "unity-yaml"
          ? [
              z_(
                c,
                t.reuseExistingYamlRaw === !0 && !o.has(c.id) ? "reuse_existing_raw" : "refresh_raw",
                "rebuild_entities",
              ),
            ]
          : [],
      ),
    });
  return (
    i || (n?.stop("build_asset_graph"), n?.start("write_resolved_rows")),
    t.onProgress?.(a.entityCount, a.entityCount, `Wrote ${a.entityCount} entity rows`),
    n?.stop("write_resolved_rows"),
    {
      symbols: { symbolCount: r.symbolCount, bindingCount: r.bindingCount },
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
async function K_(e, t, n = {}) {
  return { symbols: await FM(e, t, n), assetCount: fm(e), entityCount: mm(e), entityEdgeCount: ym(e) };
}
async function dm(e, t = {}) {
  let n = er(e),
    r = wl(e),
    i = Pl(e),
    s = vl(e),
    o = await Hs({ files: n, assemblies: r, declarations: i, mentions: s });
  return (
    t.onProgress?.(o.symbols.length, o.symbols.length, `Resolved ${o.symbols.length} symbols`),
    wd(e),
    Xs(e, o.symbols, o.edges, o.bindings),
    t.onProgress?.(o.symbols.length, o.symbols.length, `Wrote ${o.symbols.length} symbol rows`),
    {
      symbols: { symbolCount: o.symbols.length, bindingCount: o.bindings.length },
      assetCount: fm(e),
      entityCount: mm(e),
      entityEdgeCount: ym(e),
    }
  );
}
async function W_(e, t) {
  if (t.symbolsOnly) return dm(e, t);
  if (t.fullDerived) return (ea(e), ki(e, { ...t, reuseExistingYamlRaw: !0 }));
  if (t.resolveFileIds.length === 0) return (ea(e), ki(e, t));
  let n = Ti([...wr(e, t.resolveFileIds), ..._l(e, t.resolveFileIds)]),
    r = Ti([...n]),
    i = await DM(e, n, r, t),
    s = dl(e, []).map(um),
    o = er(e, t.resolveFileIds),
    a = cm(o),
    l = await q_(o);
  if (!ZM(o))
    return { symbols: i, assetCount: fm(e), entityCount: mm(e), entityEdgeCount: ym(e), materializeFileIds: Qe(n) };
  let c = qM(e, t.resolveFileIds),
    d = GM(e),
    u = QM(e, t.resolveFileIds, d),
    f = cm(
      er(
        e,
        c.map((w) => w.fileId),
      ),
    ),
    m = Ti([...t.resolveFileIds, ...zM(e, t.resolveFileIds)]);
  ta(e, t.resolveFileIds);
  let { stopwatch: y } = t;
  y?.start("build_asset_graph");
  let g = {
      database: e,
      files: o,
      fileAbsPathById: a,
      metaFileIdToNameByFileId: l,
      scriptSymbolByFileGuid: d,
      symbols: s,
      diagnostics: t.diagnostics ?? [],
      batchOptions: t.yamlBatchOptions,
      sourceFileIds: m,
      preservedAssets: c,
      preservedEntitySummaries: u,
      preservedFileAbsPathById: f,
      edgeSourceFileIds: m,
      completeEdgeSourceFileIds: t.resolveFileIds,
      edgeTargetFileIds: t.resolveFileIds,
      entitySymbolEdgeTargetFileIds: n,
      startAssetId: Oe(e, "assets"),
      startEntityId: Oe(e, "entities"),
      startEdgeId: Oe(e, "entity_edges"),
      startEntitySymbolEdgeId: Oe(e, "entity_symbol_edges"),
      stopwatch: y,
    },
    h = Zf(g),
    b = new Set(t.resolveFileIds),
    S = new Set(t.refreshedYamlFileIds ?? []),
    P = er(e, Ti([...m, ...t.resolveFileIds, ...S])),
    I = await lm({
      database: e,
      diagnostics: t.diagnostics ?? [],
      stream: h,
      stopwatch: y,
      onProgress: t.onProgress,
      dependencies: t.yamlIndexPassDependencies,
      workItems: P.flatMap((w) =>
        Lt(w.projectRelPath) !== "unity-yaml"
          ? []
          : [
              z_(
                w,
                S.has(w.id) ? "refresh_raw" : "reuse_existing_raw",
                b.has(w.id) ? "rebuild_entities" : m.includes(w.id) ? "intent_only" : "none",
              ),
            ],
      ),
    });
  y?.stop("build_asset_graph");
  let E = Qe([...t.resolveFileIds]);
  return (
    t.onProgress?.(I.entityCount, I.entityCount, `Wrote scoped entity rows for ${o.length} files`),
    {
      symbols: i,
      assetCount: I.assetCount,
      entityCount: I.entityCount,
      entityEdgeCount: I.entityEdgeCount,
      pendingEdgeIntentCount: I.pendingEdgeIntentCount,
      peakPendingEdgeIntentCount: I.peakPendingEdgeIntentCount,
      peakPendingEdgeIntentBytes: I.peakPendingEdgeIntentBytes,
      peakLoadedYamlObjectRowCount: I.peakLoadedYamlObjectRowCount,
      peakBufferedEntityRowCount: I.peakBufferedEntityRowCount,
      peakBufferedEntityEdgeRowCount: I.peakBufferedEntityEdgeRowCount,
      materializeFileIds: E,
    }
  );
}
async function FM(e, t, n) {
  if (t.length === 0) return { symbolCount: El(e), bindingCount: Rl(e) };
  let r = new Set(t),
    i = Y_(e),
    s = Ti([...t, ...i]),
    o = er(e, s),
    a = dl(e, []).map(um),
    l = await Hs({
      files: o,
      assemblies: wl(e),
      declarations: Pl(e, t),
      mentions: vl(e, t),
      persistedSymbols: a,
      mentionFileIds: r,
    }),
    c = new Set(a.map((f) => f.id)),
    d = jM(l.bindings, c);
  (n.onProgress?.(d.length, d.length, `Resolved ${d.length} bindings`),
    ps(e, { symbolFileIds: [], bindingFileIds: t }));
  let u = im(e, [], [], d);
  return (
    Xs(e, [], [], u.bindings),
    n.onProgress?.(u.bindings.length, u.bindings.length, `Wrote ${u.bindings.length} binding rows`),
    { symbolCount: El(e), bindingCount: Rl(e) }
  );
}
async function DM(e, t, n, r) {
  if (t.length === 0) return { symbolCount: El(e), bindingCount: Rl(e) };
  let i = new Set(t),
    s = new Set(n),
    o = Y_(e),
    a = Ti([...n, ...o]),
    l = er(e, a),
    c = dl(e, t).map(um),
    d = new Set(c.map((h) => h.id)),
    u = await Hs({
      files: l,
      assemblies: wl(e),
      declarations: Pl(e, t),
      mentions: vl(e, n),
      persistedSymbols: c,
      mentionFileIds: s,
    }),
    f = u.edges.filter((h) => h.sourceFileId !== null && i.has(h.sourceFileId)),
    m = BM(u.symbols, f, u.bindings, i, d);
  (r.onProgress?.(m.length, m.length, `Resolved ${m.length} symbols`), ps(e, { symbolFileIds: t, bindingFileIds: n }));
  let y = $M(e, VM(m), f, u.bindings),
    g = im(e, y.symbols, y.edges, y.bindings);
  return (
    Xs(e, g.symbols, g.edges, g.bindings),
    r.onProgress?.(g.symbols.length, g.symbols.length, `Wrote ${g.symbols.length} symbol rows`),
    r.onProgress?.(g.bindings.length, g.bindings.length, `Wrote ${g.bindings.length} binding rows`),
    { symbolCount: El(e), bindingCount: Rl(e) }
  );
}
function jM(e, t) {
  return e
    .filter((n) => t.has(n.sourceSymbolId))
    .map((n) =>
      n.targetSymbolId !== null && !t.has(n.targetSymbolId)
        ? { ...n, targetSymbolId: null, resolutionStatus: "unresolved", confidence: 0 }
        : n,
    );
}
function BM(e, t, n, r, i) {
  let s = new Map(e.map((l) => [l.id, l])),
    o = new Set();
  for (let l of e) l.fileId !== null && r.has(l.fileId) && o.add(l.id);
  let a = (l) => {
    if (l === null || i.has(l)) return;
    s.get(l) && o.add(l);
  };
  for (let l of t) (a(l.fromSymbolId), a(l.toSymbolId));
  for (let l of n) (a(l.sourceSymbolId), a(l.targetSymbolId));
  return e.filter((l) => o.has(l.id)).sort((l, c) => l.id - c.id);
}
function VM(e) {
  let t = new Map();
  for (let n of e) {
    let r = `${n.assemblyId ?? "null"}\0${n.qualifiedName}`;
    t.has(r) || t.set(r, n);
  }
  return [...t.values()];
}
function $M(e, t, n, r) {
  let i = new Map(),
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
      i.set(a.id, l.id);
      continue;
    }
    s.push(a);
  }
  let o = (a) => (a === null ? null : (i.get(a) ?? a));
  for (let a of s) a.containingSymbolId !== null && (a.containingSymbolId = o(a.containingSymbolId));
  return {
    symbols: s,
    edges: n.map((a) => ({
      ...a,
      fromSymbolId: o(a.fromSymbolId) ?? a.fromSymbolId,
      toSymbolId: o(a.toSymbolId) ?? a.toSymbolId,
    })),
    bindings: r.map((a) => ({
      ...a,
      sourceSymbolId: o(a.sourceSymbolId) ?? a.sourceSymbolId,
      targetSymbolId: o(a.targetSymbolId),
    })),
  };
}
function Ti(e) {
  return [...new Set(e)].sort((t, n) => t - n);
}
function Y_(e) {
  return e
    .prepare("SELECT id FROM files WHERE kind IN ('asmdef', 'asmref')")
    .all()
    .map((t) => t.id);
}
function um(e) {
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
function GM(e) {
  let t = KM(er(e).filter((r) => r.kind === "csharp" && r.guid)),
    n = WM(e);
  return Kb(t, n);
}
function KM(e) {
  return e.map((t) => {
    try {
      let n = ci(OM(`${t.absPath}.meta`, "utf8"));
      if (n.guid) return { ...t, guid: n.guid };
    } catch {}
    return t;
  });
}
function WM(e) {
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
function El(e) {
  return e.prepare("SELECT COUNT(*) AS count FROM symbols").get().count;
}
function Rl(e) {
  return e.prepare("SELECT COUNT(*) AS count FROM semantic_bindings").get().count;
}
function cm(e) {
  let t = new Map();
  for (let n of e) ss(n.projectRelPath, n.sizeBytes) && t.set(n.id, n.absPath);
  return t;
}
async function q_(e) {
  let t = new Map();
  return (
    await YM(e, 16, async (n) => {
      let r = `${n.absPath}.meta`,
        i = await CM(r, "utf8").catch(() => null);
      if (!i) return;
      let s = Ad(i);
      s.size > 0 && t.set(n.id, s);
    }),
    t
  );
}
async function YM(e, t, n) {
  let r = 0,
    i = Math.min(t, e.length);
  async function s() {
    for (;;) {
      let o = r;
      if (((r += 1), o >= e.length)) return;
      await n(e[o]);
    }
  }
  await Promise.all(Array.from({ length: i }, () => s()));
}
function er(e, t) {
  let n = `SELECT id, project_rel_path, abs_path, kind, guid, size_bytes,
                          content_hash
       FROM files`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ke(
            e,
            `${n}
             WHERE id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((i) => {
    let s = i;
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
function z_(e, t, n) {
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
function H_(e) {
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
function qM(e, t) {
  let n = new Set(t);
  return H_(e).filter((r) => !n.has(r.fileId));
}
function zM(e, t) {
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
    .map((i) => i.file_id);
}
function HM(e) {
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
function QM(e, t, n) {
  let r = new Set(t),
    i = new Map(H_(e).map((o) => [o.id, o.fileId])),
    s = XM(e, n);
  return HM(e).flatMap((o) => {
    let a = i.get(o.assetId);
    return a === void 0 || r.has(a)
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
function XM(e, t) {
  if (t.size === 0) return new Map();
  let n = e
      .prepare(
        `SELECT id, script_guid
       FROM yaml_objects
       WHERE script_guid IS NOT NULL
       ORDER BY id`,
      )
      .all(),
    r = new Map();
  for (let i of n) {
    let s = t.get(i.script_guid);
    s && r.set(i.id, s.id);
  }
  return r;
}
function wl(e) {
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
function Pl(e, t) {
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
        : ke(
            e,
            `${n}
             WHERE file_id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((i) => {
    let s = i;
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
function vl(e, t) {
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
        : ke(
            e,
            `${n}
             WHERE file_id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((i) => {
    let s = i;
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
var JM = new Set([
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
function ZM(e) {
  return e.some((t) => JM.has(t.kind));
}
function fm(e) {
  return e.prepare("SELECT COUNT(*) AS count FROM assets").get().count;
}
function mm(e) {
  return e.prepare("SELECT COUNT(*) AS count FROM entities").get().count;
}
function ym(e) {
  return e.prepare("SELECT COUNT(*) AS count FROM entity_edges").get().count;
}
import { readFile as XF } from "node:fs/promises";
import { readFileSync as JF } from "node:fs";
import wn from "node:path";
function xl(e) {
  return e === "texture" ? "image" : e;
}
var eF = {
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
  tF = {
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
  nF = {
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
  rF = {
    "0000000000000000f000000000000000": "extra",
    "0000000000000000e000000000000000": "default",
    "0000000000000000d000000000000000": "editor",
  },
  iF = { extra: eF, default: tF, editor: nF };
function Q_(e, t) {
  let n = rF[e.toLowerCase()];
  if (!n) return;
  let r = iF[n][t] ?? t;
  return `unity://builtin/${n}/${r}`;
}
var sF = "[0-9A-Za-z+/_=-]+",
  Rt = "[+-]?0(?:\\.0+)?",
  oF = new RegExp(`^${Rt}$`),
  aF = new RegExp(`^\\{\\s*x:\\s*${Rt}\\s*,\\s*y:\\s*${Rt}\\s*,\\s*z:\\s*${Rt}\\s*\\}$`),
  lF = new RegExp(`^\\{\\s*x:\\s*${Rt}\\s*,\\s*y:\\s*${Rt}\\s*\\}$`),
  cF = new RegExp(`^\\{\\s*r:\\s*${Rt}\\s*,\\s*g:\\s*${Rt}\\s*,\\s*b:\\s*${Rt}(?:\\s*,\\s*a:\\s*[^}]+)?\\s*\\}$`),
  dF = new RegExp(`^\\{\\s*r:\\s*${Rt}\\s*,\\s*g:\\s*${Rt}\\s*\\}$`),
  uF = new RegExp(`^\\{\\s*fileID:\\s*${Rt}\\s*\\}$`),
  fF = /^\{path:\s*""\s*\}$/,
  mF = new Set(["enabled", "m_Enabled", "m_IsActive", "minMaxState"]),
  yF = new RegExp(`\\{\\s*fileID:\\s*(-?\\d+)\\s*,\\s*guid:\\s*(${sF})\\s*,\\s*type:\\s*\\d+\\s*\\}`, "g"),
  pF =
    /\{\s*guid:\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*fileID:\s*(-?\d+))?(?:\s*,\s*script:\s*"(?:[^"\\]|\\.)*")?(?:\s*,\s*qualifiedScript:\s*"(?:[^"\\]|\\.)*")?\s*\}/g,
  gF = /\{\s*fileID:\s*(-?\d+)\s*\}/g,
  hF = /^--- !u!\d+\s+&[^\s]+(?:\s+.*)?$/,
  IF = /^(\s*m_SceneGUID:\s*)([0-9a-fA-F]{32})\s*$/gm,
  bF = "0".repeat(32),
  SF = /^(\s*(?:-\s*)?[^:\r\n]*guid[^:\r\n]*:\s*)0{32}\s*$/gim,
  _F = /\{[^{}\r\n]*\}/g,
  EF = /(?:^|[,{]\s*)guid:\s*0{32}(?=\s*(?:,|}))/i,
  RF = /(?:^|[,{]\s*)fileID:\s*([+-]?\d+)(?=\s*(?:,|}))/i,
  wF = new Map([
    ["f5f67c52d1564df4a8936ccd202a3bd8", "Packages/com.unity.ugui/UnityEngine.UI.dll"],
    ["f70555f144d8491a825f0804e09c671c", "Packages/com.unity.ugui/Standalone/UnityEngine.UI.dll"],
    ["80a3616ca19596e4da0f10f14d241e9f", "Packages/com.unity.ugui/Editor/UnityEditor.UI.dll"],
  ]);
function X_(e) {
  return e.startsWith("0000000000000000");
}
function PF(e) {
  return wF.get(e.toLowerCase());
}
var vF = /^(\s{2})([A-Za-z0-9_]+Module):\s*$/,
  xF = new Set(["m_IndexBuffer", "m_CompressedMesh", "m_BakedConvexCollisionMesh", "m_BakedTriangleCollisionMesh"]);
function Ni(e) {
  return e ? e.replace(/\\/g, "\\\\").replace(/"/g, '\\"') : "";
}
function io(e) {
  return e.trim() === "";
}
function TF(e) {
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
function Ui(e) {
  let t = 0;
  for (; t < e.length && io(e[t]);) t += 1;
  let n = t;
  if (e[t] === "-") {
    for (t += 1; t < e.length && io(e[t]);) t += 1;
    e[t] === ":" && (t = n);
  }
  let r = t;
  for (; t < e.length && TF(e[t]);) t += 1;
  if (t === r || e[t] !== ":") return null;
  let i = e.slice(r, t);
  for (t += 1; t < e.length && io(e[t]);) t += 1;
  let s = t,
    o = e.length;
  for (; o > s && io(e[o - 1]);) o -= 1;
  return { key: i, value: e.slice(s, o) };
}
function J_(e, t) {
  for (let n of e.split(/\r\n|\n|\r/)) {
    let r = Ui(n);
    if (r) return r.key === t && r.value === "";
  }
  return !1;
}
function kF(e) {
  if (e === "{}") return !0;
  let t = 1;
  for (; t < e.length && io(e[t]);) t += 1;
  return e.startsWith("x:", t)
    ? lF.test(e) || aF.test(e)
    : e.startsWith("r:", t)
      ? dF.test(e) || cF.test(e)
      : e.startsWith("fileID:", t)
        ? uF.test(e)
        : e.startsWith("path:", t)
          ? fF.test(e)
          : !1;
}
function NF(e) {
  let t = Ui(e);
  if (!t || mF.has(t.key)) return !1;
  if (t.key === "serializedVersion") return t.value.length > 0;
  switch (t.value[0]) {
    case "[":
      return t.value === "[]";
    case "{":
      return kF(t.value);
    case "+":
    case "-":
    case "0":
      return oF.test(t.value);
    default:
      return !1;
  }
}
function UF(e) {
  let t = new Set(),
    n = [],
    r = () => {
      let i = n.pop();
      if (!i) return;
      if (!i.hasContent) {
        t.add(i.index);
        return;
      }
      let s = n[n.length - 1];
      s && (s.hasContent = !0);
    };
  for (let i = 0; i < e.length; i += 1) {
    let s = e[i] ?? "";
    if (!s.trim()) continue;
    let o = Ai(s),
      a = /^\s*-\s+/.test(s);
    for (; n.length > 0 && (o < n[n.length - 1].indent || (o === n[n.length - 1].indent && !a));) r();
    let l = Ui(s);
    if (o > 0 && l !== null && l.value === "") {
      n.push({ index: i, indent: o, hasContent: !1 });
      continue;
    }
    for (let d of n) d.hasContent = !0;
  }
  for (; n.length > 0;) r();
  return { lines: e.filter((i, s) => !t.has(s)), removedLineCount: t.size };
}
function AF(e) {
  return hF.test(e);
}
function LF(e) {
  if (!e || !e.trim()) return { text: "", removedLineCount: 0 };
  let t = e.split(/\r\n|\n|\r/),
    n = [],
    r = 0;
  for (let s of t) NF(s) ? (r += 1) : n.push(s);
  let i = UF(n);
  return (
    (r += i.removedLineCount),
    {
      text: i.lines.join(`
`),
      removedLineCount: r,
    }
  );
}
function OF(e) {
  if (!e || !e.trim()) return { text: "", removedLineCount: 0 };
  let t = e.split(/\r\n|\n|\r/),
    n = 0;
  return {
    text: t.filter((i) => {
      let s = AF(i);
      return (s && (n += 1), !s);
    }).join(`
`),
    removedLineCount: n,
  };
}
function Ai(e) {
  return e.match(/^\s*/)?.[0].length ?? 0;
}
function CF(e) {
  if (!e.includes("Mesh:") && !e.includes("Texture2D:")) return e;
  let t = e.split(/\r\n|\n|\r/),
    n = t.findIndex((o) => Ui(o)),
    r = n < 0 ? null : Ui(t[n]);
  if (!r || r.value !== "" || (r.key !== "Mesh" && r.key !== "Texture2D")) return e;
  let i = t.slice(0, n + 1),
    s = [{ key: r.key, indent: Ai(t[n]) }];
  for (let o = n + 1; o < t.length; o += 1) {
    let a = t[o] ?? "",
      l = Ui(a);
    if (!l) {
      i.push(a);
      continue;
    }
    let c = Ai(a);
    for (; s.length > 0 && c <= s[s.length - 1].indent;) s.pop();
    let d = s[s.length - 1];
    if (
      (s.length === 1 &&
        ((r.key === "Mesh" && xF.has(l.key)) || (r.key === "Texture2D" && l.key === "_typelessdata"))) ||
      (r.key === "Mesh" && l.key === "_typelessdata" && d?.key === "m_VertexData" && s[s.length - 2]?.key === "Mesh")
    ) {
      for (; o + 1 < t.length && (!t[o + 1].trim() || Ai(t[o + 1]) > c);) o += 1;
      continue;
    }
    (i.push(a), l.value === "" && s.push({ key: l.key, indent: c }));
  }
  return i.join(`
`);
}
function MF(e) {
  if (!J_(e, "ParticleSystem")) return { yaml: e, omittedLineCount: 0 };
  let t = e.split(/\r\n|\n|\r/),
    n = [],
    r = 0;
  for (let i = 0; i < t.length; i += 1) {
    let s = t[i] ?? "",
      o = s.match(vF);
    if (!o) {
      n.push(s);
      continue;
    }
    let a = o[1] ?? "  ",
      l = o[2] ?? "",
      c = [s],
      d = i + 1;
    for (; d < t.length; d += 1) {
      let y = t[d] ?? "";
      if (y.trim() && Ai(y) <= a.length) break;
      c.push(y);
    }
    let u = `${a}  enabled:`,
      f = c.find((y) => y.startsWith(u));
    if (!(f ? /^enabled:\s*0(?:\.0+)?\s*$/.test(f.trim()) : !1)) {
      (n.push(...c), (i = d - 1));
      continue;
    }
    ((r += c.slice(1).filter((y) => y.trim()).length), n.push(`${a}${l}: {enabled: 0} # folded defaults`), (i = d - 1));
  }
  return {
    yaml: n.join(`
`),
    omittedLineCount: r,
  };
}
function Tl(e, t, n) {
  let r = `${t}${n}:`,
    i = e.find((o) => o.startsWith(r));
  if (!i) return null;
  let s = i.slice(r.length).trim();
  return s.length > 0 ? s : null;
}
function FF(e) {
  if (!J_(e, "ParticleSystem")) return { yaml: e, omittedLineCount: 0 };
  let t = e.split(/\r\n|\n|\r/),
    n = [],
    r = 0;
  for (let i = 0; i < t.length; i += 1) {
    let s = t[i] ?? "",
      o = s.match(/^(\s+)([A-Za-z0-9_]+):\s*$/);
    if (!o) {
      n.push(s);
      continue;
    }
    let a = o[1] ?? "",
      l = o[2] ?? "",
      c = [s],
      d = i + 1;
    for (; d < t.length; d += 1) {
      let b = t[d] ?? "";
      if (b.trim() && Ai(b) <= a.length) break;
      c.push(b);
    }
    let u = `${a}  `;
    if (Tl(c, u, "minMaxState") !== "0") {
      n.push(s);
      continue;
    }
    let m = Tl(c, u, "scalar"),
      y = Tl(c, u, "maxColor"),
      g = Tl(c, u, "minColor"),
      h = m ?? y ?? g;
    if (h === null) {
      n.push(s);
      continue;
    }
    ((r += c.slice(1).filter((b) => b.trim()).length), n.push(`${a}${l}: ${h}`), (i = d - 1));
  }
  return {
    yaml: n.join(`
`),
    omittedLineCount: r,
  };
}
function kl(e) {
  return Z_(e).text;
}
function Z_(e) {
  if (!e || !e.trim()) return { text: "", rewrittenCount: 0 };
  if (!e.includes("guid:")) return { text: e, rewrittenCount: 0 };
  let t = 0;
  return {
    text: e.replace(yF, (r, i, s) => {
      t += 1;
      let o = Ni(s);
      return X_(s) ? `{guid: "${o}", fileID: ${i}}` : `{guid: "${o}"}`;
    }),
    rewrittenCount: t,
  };
}
function Nl(e, t) {
  return !e || !e.trim()
    ? ""
    : e.includes("{guid:")
      ? e.replace(pF, (n, r, i) => {
          let s = DF(r),
            o = PF(s);
          if (o) return `{path: "${Ni(o)}"}`;
          if (X_(s)) {
            if (i !== void 0) {
              let l = Q_(s, i);
              if (l) return `{path: "${Ni(l)}"}`;
            }
            return '{path: "unity://builtin", status: "builtin"}';
          }
          let a = t.get(s);
          return a === void 0 ? '{path: "", status: "missing"}' : `{path: "${Ni(a)}"}`;
        })
      : e;
}
function DF(e) {
  return e.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
}
function jF(e, t) {
  if (!e.includes("fileID:")) return { text: e, rewrittenCount: 0 };
  let n = 0;
  return {
    text: e.replace(gF, (i, s) => {
      let o = Number.parseInt(s, 10);
      if (Number.isNaN(o)) return i;
      if (o === 0) return ((n += 1), '{path: ""}');
      let a = t.get(s);
      return a === void 0 ? i : ((n += 1), `{path: "${Ni(a)}"}`);
    }),
    rewrittenCount: n,
  };
}
function BF(e) {
  return !e.toLowerCase().includes("guid") || !e.includes(bF)
    ? e
    : e
        .replace(SF, (n, r) => `${r}{path: ""}`)
        .replace(_F, (n) => {
          if (!EF.test(n)) return n;
          let r = RF.exec(n)?.[1];
          return r === void 0 || /^[+-]?0+$/.test(r) ? '{path: ""}' : n;
        });
}
function VF(e) {
  return e.includes("m_SceneGUID:") ? e.replace(IF, (t, n, r) => `${n}{guid: "${Ni(r)}"}`) : e;
}
function eE(e, t) {
  if (!e || !e.trim()) return { text: "", stats: $F() };
  let n = CF(e),
    r = MF(n),
    i = FF(r.yaml),
    s = BF(i.yaml),
    o = VF(s),
    a = Z_(o),
    l = jF(a.text, t.localFileIdToVfsPath),
    c = OF(l.text),
    d = LF(c.text),
    u = r.omittedLineCount + i.omittedLineCount;
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
function $F() {
  return { defaultLinesRemoved: 0, guidRefsTokenized: 0, localFileRefsRewritten: 0, readCompactLinesOmitted: 0 };
}
function Ul(e, t) {
  return !e || !e.includes("{guid:") ? e : Nl(e, t);
}
function so(e) {
  let t = new Map();
  return (
    e.forEach((n) => {
      if (n.kind !== "meta" && n.guid) for (let r of Rr(n.guid)) t.set(r, n.projectRelPath);
    }),
    t
  );
}
var GF = 1,
  pm = 26,
  gm = 5,
  Ol = 256,
  KF = 512,
  Al = class {
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
        this.buffer.length >= (this.options.batchRows ?? Ol) && this.flush());
    }
    flush() {
      if (this.buffer.length === 0) return;
      let t = this.buffer.splice(0);
      if (this.options.mode === "full") {
        tE(this.database, t);
        return;
      }
      let n = [],
        r = [],
        i = ke(
          this.database,
          "SELECT id FROM vfs_entries WHERE id IN (",
          t.map((o) => o.id),
          ")",
        ),
        s = new Set(i.map((o) => o.id));
      for (let o of t) (s.has(o.id) ? n : r).push(o);
      (WF(this.database, n), tE(this.database, r));
    }
    get searchCandidateCount() {
      return this.searchCandidates;
    }
    get peakBatchRows() {
      return this.peakBatch;
    }
  },
  Ll = class {
    constructor(t, n = KF, r) {
      this.database = t;
      this.batchRows = n;
      this.beforeFlush = r;
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
      let n = qF(t);
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
      let n = YF(this.database, t);
      ((this.insertedCount += n), (this.duplicateCount += t.length - n));
    }
    get peakBatchRows() {
      return this.peakBatch;
    }
  };
function tE(e, t) {
  if (t.length === 0) return;
  let n = ur(pm),
    r = `INSERT INTO vfs_entries (
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
    i = t.length >= n ? e.prepare(`${r}${Mt(n, pm)}`) : null;
  for (let s of He(t, n))
    (s.length === n ? i : e.prepare(`${r}${Mt(s.length, pm)}`)).run(
      ...s.flatMap((a) => {
        let l = oo(a.content),
          c = oo(a.metaContent);
        return [
          a.id,
          GF,
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
function WF(e, t) {
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
  for (let r of t) {
    let i = oo(r.content),
      s = oo(r.metaContent);
    n.run(
      r.entryType,
      r.entryKind,
      r.fileFamily,
      r.vfsPath,
      r.parentVfsPath,
      r.hostFileId,
      r.sourceFileId,
      r.sourceSymbolId,
      r.sourceEntityId,
      r.displayName,
      r.childOrder ?? 2e9,
      i,
      s,
      r.lineStart,
      r.lineEnd,
      r.sizeBytes,
      r.targetVfsPath,
      r.projectionKind,
      r.sourceVfsPath,
      r.sourceOwnerVfsPath,
      r.instanceRootVfsPath,
      r.vfsLogicalKey,
      r.sourceLogicalKey,
      r.materializationGeneration ?? 0,
      r.id,
    );
  }
}
function nE(e, t) {
  if (t.length === 0) return;
  let n = e.prepare(`UPDATE vfs_entries
     SET content = ?,
         size_bytes = ?
     WHERE id = ?`);
  for (let r of t) n.run(oo(r.content), r.sizeBytes, r.id);
}
function YF(e, t) {
  if (t.length === 0) return 0;
  let n = ur(gm),
    r = `INSERT OR IGNORE INTO vfs_edges (
      id,
      from_entry_id,
      to_entry_id,
      edge_kind,
      edge_subkind
    ) VALUES `,
    i = t.length >= n ? e.prepare(`${r}${Mt(n, gm)}`) : null,
    s = 0;
  for (let o of He(t, n)) {
    let l = (o.length === n ? i : e.prepare(`${r}${Mt(o.length, gm)}`)).run(
      ...o.flatMap((c) => [c.id, c.fromEntryId, c.toEntryId, c.edgeKind, c.edgeSubkind ?? null]),
    );
    s += Number(l.changes);
  }
  return s;
}
function oo(e) {
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
function qF(e) {
  return `${e.fromEntryId}:${e.toEntryId}:${e.edgeKind}:${e.edgeSubkind ?? ""}`;
}
function zF(e) {
  return e.startsWith("0000000000000000");
}
function rE(e) {
  if (typeof e != "string") return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
function HF(e) {
  return !e || typeof e != "object" || Array.isArray(e) ? !1 : rE(e.guid) !== null;
}
function QF(e, t) {
  let n = rE(e.guid);
  if (!n) return { path: "", status: "missing" };
  let r = t.get(n);
  return r !== void 0
    ? { path: r }
    : zF(n)
      ? { path: "unity://builtin", status: "builtin" }
      : { path: "", status: "missing" };
}
function ao(e, t) {
  if (Array.isArray(e)) return e.map((n) => ao(n, t));
  if (HF(e)) return QF(e, t);
  if (e && typeof e == "object") {
    let n = e,
      r = {};
    for (let [i, s] of Object.entries(n)) r[i] = ao(s, t);
    return r;
  }
  return e;
}
function hm(e) {
  return e === "shader_graph_properties" || e === "shader_graph_settings" || e === "shader_graph_node";
}
function iE(e, t) {
  let n = e.trim();
  if (!n) return e;
  let r;
  try {
    r = JSON.parse(n);
  } catch {
    return e;
  }
  return JSON.stringify(ao(r, t), null, 2);
}
function Im(e) {
  return (
    e === "visual_effect_graph_properties" ||
    e === "visual_effect_graph_property" ||
    e === "visual_effect_graph_context" ||
    e === "visual_effect_graph_block"
  );
}
function sE(e, t) {
  let n = e.trim();
  if (!n) return e;
  let r;
  try {
    r = JSON.parse(n);
  } catch {
    return e;
  }
  return JSON.stringify(ao(r, t), null, 2);
}
function oE(e) {
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
function aE(e) {
  let t = [0];
  for (let n = 0; n < e.length; n += 1)
    e[n] ===
      `
` && t.push(n + 1);
  return t;
}
function bm(e, t, n, r) {
  let i = t[n - 1] ?? 0,
    s = r >= t.length ? e.length : t[r] - 1;
  return e.slice(i, s);
}
function lE(e, t, n, r) {
  return e - n || (t.lineStart ?? 0) - (r.lineStart ?? 0) || t.id - r.id;
}
var cE = 4096,
  dE = 2048;
function kr(e) {
  return e.entityKind === "component" && (e.typeName === "Transform" || e.typeName === "RectTransform");
}
function ZF(e) {
  let t = new Map();
  for (let n of e)
    if (kr(n) && n.parentEntityId !== null) {
      let r = t.get(n.parentEntityId) ?? [];
      (r.push(n), t.set(n.parentEntityId, r));
    }
  for (let n of t.values()) n.sort((r, i) => r.lineStart - i.lineStart);
  return t;
}
function uE(e) {
  return [e.severity, e.category, e.stage ?? "", e.code ?? "", e.filePath ?? "", e.message].join("\0");
}
function fE(e, t) {
  return !e || t === null ? !e : e.has(t);
}
function eD(e, t) {
  if (t.length === 0) return [];
  let n = Math.floor(Qo / 3),
    r = new Set();
  for (let i of He(t, n)) {
    let s = ze(i.length);
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
      .all(...i, ...i, ...i)
      .forEach((a) => r.add(a.id));
  }
  return Qe([...r]);
}
async function Pm(e, t, n = {}) {
  let r = new Set(t);
  return rd(e, () =>
    bE(e, { ...n, scopeFileIds: r, startEntryId: Oe(e, "vfs_entries"), startEdgeId: Oe(e, "vfs_edges") }),
  );
}
async function Dl(e, t = {}) {
  return rd(e, () => bE(e, t));
}
async function bE(e, t = {}) {
  let { stopwatch: n, scopeFileIds: r } = t;
  (n?.start("load_rows"), ed(e));
  let i = r !== void 0 ? eD(e, [...r]) : void 0,
    s = Cl(e, i),
    o = rD(e, tD(e, i)),
    a = new Map(o.map((p) => [p.id, p])),
    l = r ? o.filter((p) => fE(r, p.fileId)) : o,
    c = lD(e, i),
    d = mE(e, i),
    u = new Map(d.map((p) => [p.id, p])),
    f = cD(e, i),
    m = new Map(f.map((p) => [p.id, p])),
    y = uD(e, i),
    g = fD(e, i),
    h =
      r !== void 0
        ? f.filter((p) => {
            let R = u.get(p.assetId);
            return R !== void 0 && r.has(R.fileId);
          })
        : f,
    b = gD(e, i),
    S = new Map(s.map((p) => [p.id, p])),
    P = i === void 0 ? s : Cl(e),
    I = new Map(
      P.filter((p) => p.kind !== "meta").map((p) => {
        let R = Fl(p.kind, p.projectRelPath);
        return [p.id, xl(R)];
      }),
    ),
    E = new Map(P.map((p) => [p.id, p])),
    w = new Map(
      d.flatMap((p) => {
        let R = E.get(p.fileId);
        return R?.guid ? [[R.guid, R.id]] : [];
      }),
    );
  if (i !== void 0)
    for (let p of mE(e)) {
      let R = E.get(p.fileId);
      R?.guid && w.set(R.guid, R.id);
    }
  let T = new Map();
  for (let p of f) {
    let R = u.get(p.assetId);
    R && T.set(`${R.fileId}\0${p.localKey}`, p.id);
  }
  let x = e.prepare(`SELECT id, object_type, game_object_file_id
     FROM yaml_objects
     WHERE file_id = ? AND local_identifier = ?`),
    O = e.prepare(`SELECT target_guid,
            coalesce(target_local_id, target_file_id) AS target_local_id
     FROM yaml_references
     WHERE source_yaml_object_id = ?
       AND field_path = 'm_CorrespondingSourceObject'
     LIMIT 1`),
    F = e.prepare(`SELECT coalesce(target_local_id, target_file_id) AS target_local_id
     FROM yaml_references
     WHERE source_yaml_object_id = ?
       AND field_path = 'm_PrefabInstance'
     LIMIT 1`),
    Y = e.prepare(`SELECT entities.id
     FROM entities
     JOIN assets ON assets.id = entities.asset_id
     WHERE assets.file_id = ? AND entities.local_key = ?
     LIMIT 1`),
    K = e.prepare(`SELECT vfs_path
     FROM vfs_entries
     WHERE project_id = 1
       AND source_vfs_path = ?
       AND vfs_path LIKE ? ESCAPE '\\'
       AND (? IS NULL OR instance_root_vfs_path = ?)
     ORDER BY id
     LIMIT 2`);
  function _(p) {
    let R = p.sourceGuid,
      U = p.sourceLocalId,
      V = new Set(),
      X = [],
      $ = null;
    for (; R && U;) {
      let Xe = `${R}\0${U}`;
      if (V.has(Xe)) return null;
      V.add(Xe);
      let Te = w.get(R);
      if (Te === void 0) return null;
      let De = x.get(Te, U);
      if (!De) return null;
      let je =
        De.game_object_file_id ?? (De.object_type === "GameObject" || De.object_type === "PrefabInstance" ? U : null);
      if (je) {
        let Xi = T.get(`${Te}\0${je}`);
        if (Xi !== void 0) {
          $ = Xi;
          break;
        }
        $ = Y.get(Te, je)?.id ?? null;
        break;
      }
      let tt = F.get(De.id)?.target_local_id ?? null,
        Ln = tt && tt !== "0" ? (T.get(`${Te}\0${tt}`) ?? Y.get(Te, tt)?.id ?? null) : null;
      X.push({ fileId: Te, sourceGuid: R, sourceLocalId: U, owningPrefabInstanceEntityId: Ln });
      let On = O.get(De.id);
      ((R = On?.target_guid ?? null), (U = On?.target_local_id ?? null));
    }
    if ($ === null) return null;
    let ee = le($),
      et = m.get($),
      be = et ? u.get(et.assetId)?.fileId : void 0;
    for (let Xe = X.length - 1; ee && Xe >= 0; Xe -= 1) {
      let Te = X[Xe],
        De = E.get(Te.fileId);
      if (!De) return null;
      let je = Te.owningPrefabInstanceEntityId ? le(Te.owningPrefabInstanceEntityId) : null;
      if (je === null && Te.owningPrefabInstanceEntityId !== null) {
        let Ln = m.get(Te.owningPrefabInstanceEntityId),
          On = Ln ? u.get(Ln.assetId) : void 0;
        Ln && On && (je = Rn(e, At(On.fileId, Ln.localKey))?.vfsPath ?? null);
      }
      let yn = De.projectRelPath.replace(/[\\%_]/g, "\\$&"),
        tt = K.all(ee, `${yn}:/%`, je, je);
      if (tt.length === 1) {
        ee = tt[0].vfs_path;
        continue;
      }
      if (Xe === X.length - 1) {
        if (Te.fileId !== be) return null;
        continue;
      }
      return null;
    }
    return ee;
  }
  let L = new Set((t.diagnostics ?? []).map(uE)),
    N = (p) => {
      let R = uE(p);
      L.has(R) || (L.add(R), t.diagnostics?.push(p));
    },
    j = new Map();
  (await hD(s, 16, async (p) => {
    if (p.kind !== "meta") return;
    let R = await XF(p.absPath, "utf8").catch(() => "");
    if (R.length > 0) {
      let U = kg(R);
      U && j.set(p.id, U);
    }
  }),
    n?.stop("load_rows"));
  let z = r ? OD(e) : LD(e);
  AD(cE, Ol);
  let te = new Al(e, { mode: r ? "scoped" : "full", generation: z, batchRows: Ol }),
    se = new wm(e, cE),
    ce = new Map(),
    ie = (p) => {
      (p.entryKind === "source_prefab_link" || p.entryKind === "prefab_overrides") &&
        ce.set(p.vfsPath, p.sourceEntityId);
    },
    re = e.prepare(`SELECT source_entity_id
     FROM vfs_entries
     WHERE project_id = 1 AND vfs_path = ?`),
    k = new Ll(e, void 0, () => {
      te.flush();
    }),
    C = new Map(),
    v = new Map(),
    A = new Map(),
    M = t.startEntryId ?? 1,
    D = t.startEdgeId ?? 1;
  function H(p) {
    return Bo(p.projectRelPath, p.sizeBytes);
  }
  function ae(p) {
    let R = p.sizeBytes ?? Buffer.byteLength(p.metaContent ?? "", "utf8"),
      U = p.hostFileId ?? p.sourceFileId,
      V = p.sourceFileId === null ? null : (I.get(p.sourceFileId) ?? null);
    if (r) {
      let ee =
        p.vfsLogicalKey ??
        Sm({
          id: 0,
          sizeBytes: R,
          fileFamily: V,
          ...p,
          hostFileId: U,
          content: null,
          projectionKind: p.projectionKind ?? null,
          sourceVfsPath: p.sourceVfsPath ?? null,
          sourceOwnerVfsPath: p.sourceOwnerVfsPath ?? null,
          instanceRootVfsPath: p.instanceRootVfsPath ?? null,
          vfsLogicalKey: p.vfsLogicalKey ?? null,
          sourceLogicalKey: p.sourceLogicalKey ?? null,
        });
      if (ee?.startsWith("entity_file_local:")) {
        let et = Rn(e, ee);
        if (et) {
          let be = {
            id: et.id,
            sizeBytes: R,
            fileFamily: V,
            ...p,
            hostFileId: U,
            content: null,
            projectionKind: p.projectionKind ?? null,
            sourceVfsPath: p.sourceVfsPath ?? null,
            sourceOwnerVfsPath: p.sourceOwnerVfsPath ?? null,
            instanceRootVfsPath: p.instanceRootVfsPath ?? null,
            vfsLogicalKey: ee,
            sourceLogicalKey: p.sourceLogicalKey ?? null,
          };
          return (
            (be.sourceLogicalKey = be.sourceLogicalKey ?? _m(be)),
            Em(be),
            te.add(be),
            se.remember(be.vfsPath, be.id),
            ie(be),
            be
          );
        }
      }
    }
    let X = se.byPath(p.vfsPath);
    if (X !== void 0) {
      if (r) {
        let ee = {
          id: X,
          sizeBytes: R,
          fileFamily: V,
          ...p,
          hostFileId: U,
          content: null,
          projectionKind: p.projectionKind ?? null,
          sourceVfsPath: p.sourceVfsPath ?? null,
          sourceOwnerVfsPath: p.sourceOwnerVfsPath ?? null,
          instanceRootVfsPath: p.instanceRootVfsPath ?? null,
          vfsLogicalKey: p.vfsLogicalKey ?? null,
          sourceLogicalKey: p.sourceLogicalKey ?? null,
        };
        return (
          (ee.vfsLogicalKey = ee.vfsLogicalKey ?? Sm(ee)),
          (ee.sourceLogicalKey = ee.sourceLogicalKey ?? _m(ee)),
          Em(ee),
          te.add(ee),
          se.remember(ee.vfsPath, ee.id),
          ie(ee),
          ee
        );
      }
      return (console.warn(`Duplicate materialized VFS path: ${p.vfsPath} \u2014 skipping duplicate entry`), null);
    }
    let $ = {
      id: M++,
      sizeBytes: R,
      fileFamily: V,
      ...p,
      hostFileId: U,
      content: null,
      projectionKind: p.projectionKind ?? null,
      sourceVfsPath: p.sourceVfsPath ?? null,
      sourceOwnerVfsPath: p.sourceOwnerVfsPath ?? null,
      instanceRootVfsPath: p.instanceRootVfsPath ?? null,
      vfsLogicalKey: p.vfsLogicalKey ?? null,
      sourceLogicalKey: p.sourceLogicalKey ?? null,
    };
    return (
      ($.vfsLogicalKey = $.vfsLogicalKey ?? Sm($)),
      ($.sourceLogicalKey = $.sourceLogicalKey ?? _m($)),
      Em($),
      te.add($),
      se.remember($.vfsPath, $.id),
      ie($),
      $
    );
  }
  function Q(p, R, U, V = null) {
    if (!p || !R) return;
    let X = se.byPath(p),
      $ = se.byPath(R);
    if (!X || !$) {
      k.recordMissingEndpoint();
      return;
    }
    k.add({ id: D++, fromEntryId: X, toEntryId: $, edgeKind: U, edgeSubkind: V });
  }
  function fe(p) {
    if (p != null) return C.get(p);
  }
  r &&
    s.forEach((p) => {
      if (p.kind === "meta") return;
      let R = de(p.projectRelPath, "file");
      se.byPath(R) !== void 0 && A.set(p.id, R);
    });
  let Re = new Map();
  s.forEach((p) => {
    p.metaFileId !== null && Re.set(p.metaFileId, p);
  });
  let Pe = new Map();
  (s.forEach((p) => {
    if (p.kind !== "meta") return;
    let R = Re.get(p.id);
    R && Pe.set(R.id, p);
  }),
    n?.start("materialize_directories"));
  let B = ID(s.filter((p) => p.kind !== "meta"));
  (B.forEach((p) => {
    let R = de(p, "directory"),
      U = bD(p);
    ae({
      entryType: "directory",
      entryKind: "directory",
      vfsPath: R,
      parentVfsPath: U ? de(U, "directory") : null,
      sourceFileId: null,
      sourceSymbolId: null,
      sourceEntityId: null,
      displayName: wn.posix.basename(p),
      content: null,
      metaContent: null,
      lineStart: null,
      lineEnd: null,
      targetVfsPath: null,
      projectionKind: null,
      sizeBytes: 0,
    });
  }),
    t.onProgress?.(B.length, B.length, `Materialized ${B.length} directories`),
    n?.stop("materialize_directories"),
    n?.start("materialize_files"));
  let W = s.filter((p) => p.kind !== "meta");
  (W.forEach((p) => {
    let R = Pe.get(p.id);
    (ae({
      entryType: "file",
      entryKind: Fl(p.kind, p.projectRelPath),
      vfsPath: de(p.projectRelPath, "file"),
      parentVfsPath: de(wn.posix.dirname(p.projectRelPath), "directory"),
      sourceFileId: p.id,
      sourceSymbolId: null,
      sourceEntityId: null,
      displayName: wn.posix.basename(p.projectRelPath),
      content: null,
      metaContent: R ? (j.get(R.id) ?? null) : null,
      lineStart: null,
      lineEnd: null,
      targetVfsPath: null,
      projectionKind: null,
      sizeBytes: p.sizeBytes,
    }),
      A.set(p.id, de(p.projectRelPath, "file")));
  }),
    t.onProgress?.(W.length, W.length, `Materialized ${W.length} files`),
    n?.stop("materialize_files"),
    n?.start("materialize_file_content_nodes"));
  let ue = 0;
  (W.forEach((p) => {
    let R = Fl(p.kind, p.projectRelPath);
    if (!Np(p.projectRelPath, R, p.sizeBytes) || !H(p) || p.sizeBytes === 0) return;
    let U = de(p.projectRelPath, "file");
    (ae({
      entryType: "node",
      entryKind: "file_content",
      vfsPath: de(os(U), "leaf"),
      parentVfsPath: U,
      sourceFileId: p.id,
      sourceSymbolId: null,
      sourceEntityId: null,
      displayName: ".content",
      content: null,
      metaContent: null,
      lineStart: null,
      lineEnd: null,
      targetVfsPath: null,
      projectionKind: null,
      sizeBytes: p.sizeBytes,
    }),
      (ue += 1));
  }),
    t.onProgress?.(ue, ue, `Materialized ${ue} file content nodes`),
    n?.stop("materialize_file_content_nodes"),
    n?.start("materialize_symbols"));
  let xe = new Map(),
    Se = new Map();
  function fn(p, R, U, V) {
    let X = Fn(R, V),
      $ = de(Ye(p, X), U),
      ee = (xe.get($) ?? 0) + 1;
    return (xe.set($, ee), ee === 1 ? $ : de(Ye(p, Fn(`${R}#${ee}`, V)), U));
  }
  function Z(p) {
    if (Se.has(p)) return Se.get(p) ?? null;
    let R = a.get(p);
    if (!R || R.isExternalStub !== 0 || !R.fileId) return (Se.set(p, null), null);
    let U = A.get(R.fileId);
    if (!U) return (Se.set(p, null), null);
    let V = [],
      X = R;
    for (; X;)
      (V.unshift({ simpleName: X.simpleName, symbolKind: X.symbolKind }),
        (X = X.containingSymbolId ? a.get(X.containingSymbolId) : void 0));
    let $ = null;
    for (let ee = 0; ee < V.length; ee += 1) {
      let { simpleName: et, symbolKind: be } = V[ee],
        Xe = ee === V.length - 1,
        Te = SD(be),
        De = $ ?? `${U}:/`;
      if (Xe) {
        $ = fn(De, et, Te, be);
        continue;
      }
      let je = Fn(et, be);
      $ = de(Ye(De, je), "container");
    }
    return (Se.set(p, $), $);
  }
  let ne = l.filter((p) => p.isExternalStub === 0 && p.fileId !== null);
  (ne
    .sort((p, R) => lE(p.fileId, p, R.fileId, R))
    .forEach((p) => {
      let R = Z(p.id);
      if (!R) return;
      let U = p.containingSymbolId ? Z(p.containingSymbolId) : A.get(p.fileId);
      (ae({
        entryType: "node",
        entryKind: p.symbolKind,
        vfsPath: R,
        parentVfsPath: U ?? null,
        sourceFileId: p.fileId,
        sourceSymbolId: p.id,
        sourceEntityId: null,
        displayName: p.displayName,
        content: null,
        metaContent: null,
        lineStart: p.lineStart,
        lineEnd: p.lineEnd,
        targetVfsPath: null,
        projectionKind: null,
      }),
        C.set(p.id, R));
    }),
    t.onProgress?.(ne.length, ne.length, `Materialized ${ne.length} symbols`),
    n?.stop("materialize_symbols"),
    n?.start("materialize_entities"));
  let ge = new Map(),
    Ie = new Map(),
    Nt = new Map();
  for (let p of h) {
    if (p.parentEntityId === null) continue;
    let R = Ie.get(p.parentEntityId) ?? [];
    (R.push(p), Ie.set(p.parentEntityId, R));
  }
  Ie.forEach((p) => {
    p.sort((R, U) => R.id - U.id);
  });
  function sr(p, R) {
    let U = Number.parseInt(p, 10),
      V = Number.parseInt(R, 10);
    return Number.isFinite(U) && Number.isFinite(V) && String(U) === p && String(V) === R ? U - V : p.localeCompare(R);
  }
  function It(p, R) {
    return r ? sr(p.localKey, R.localKey) : p.id - R.id;
  }
  let Hr = new Map(),
    mt = new Map();
  for (let p of h) {
    let R = `${p.parentEntityId}|${p.assetId}|${Ml(p)}`,
      U = mt.get(R) ?? [];
    (U.push(p), mt.set(R, U));
  }
  for (let p of mt.values())
    (p.sort((R, U) => (r ? sr(R.localKey, U.localKey) : R.id - U.id)),
      p.forEach((R, U) => {
        Hr.set(R.id, U);
      }));
  function Un(p) {
    return Hr.get(p.id) ?? 0;
  }
  function G(p, R) {
    let U = Ml(p),
      V = _D(p.entityKind),
      X = u.get(p.assetId),
      $ = r && X ? Rn(e, At(X.fileId, p.localKey))?.vfsPath : void 0;
    return Ut(R, U, V, p.entityKind, Un(p), $);
  }
  function J(p) {
    let R = v.get(p.id);
    if (R) return R;
    if (qc(p)) return null;
    let U = u.get(p.assetId);
    if (!U) return null;
    let V = Rn(e, At(U.fileId, p.localKey));
    return V ? (v.set(p.id, V.vfsPath), V.vfsPath) : null;
  }
  function le(p) {
    let R = m.get(p);
    if (R) return J(R);
    let U = e
      .prepare(
        `SELECT assets.file_id, entities.local_key
         FROM entities
         JOIN assets ON assets.id = entities.asset_id
         WHERE entities.id = ?`,
      )
      .get(p);
    if (!U) return null;
    let V = Rn(e, At(U.file_id, U.local_key));
    return V ? (v.set(p, V.vfsPath), V.vfsPath) : null;
  }
  let oe = new Map();
  function me(p) {
    for (let R of oe.keys()) p.startsWith(R) && oe.delete(R);
  }
  function We(p) {
    let R = oe.get(p);
    if (R) return R;
    te.flush();
    let U = oi(p),
      V = e
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
        .all(U.lowerBound, U.upperBound)
        .map(_E),
      X = V.find((ee) => ee.vfsPath === p),
      $ = r && X?.materializationGeneration === z ? V.filter((ee) => ee.materializationGeneration === z) : V;
    return (oe.set(p, $), $);
  }
  function Ut(p, R, U, V, X = 0, $) {
    let ee = X + 1,
      et = ee === 1 ? R : `${R}#${ee}`,
      be = Fn(et, V),
      Xe = de(Ye(p, be), U);
    if (Xe === $ || se.byPath(Xe) === void 0) return Xe;
    let Te = ee;
    for (;;) {
      Te += 1;
      let De = Fn(`${R}#${Te}`, V),
        je = de(Ye(p, De), U);
      if (je === $ || se.byPath(je) === void 0) return je;
    }
  }
  let mn = e.prepare(`SELECT id
     FROM vfs_entries
     WHERE project_id = 1
       AND vfs_path = ?
       AND projection_kind = 'prefab_inherited'
       AND instance_root_vfs_path = ?`),
    An = new Set();
  function QP(p, R, U) {
    let V = pE(R.vfsPath),
      X = Fn("", R.entryKind),
      $ = X && V.endsWith(X) ? V.slice(0, -X.length) : V,
      ee = gn(R.displayName, R.entryKind),
      et = $.match(/^(.*)#(\d+)$/),
      be = et?.[1] === ee ? et : null,
      Xe = be?.[1] ?? $,
      Te = be ? Number.parseInt(be[2], 10) - 1 : 0,
      De = R.vfsPath.endsWith("/") ? "container" : "leaf",
      je = de(Ye(p, V), De),
      yn = Te + 1,
      tt = je;
    for (; An.has(tt) || (se.byPath(tt) !== void 0 && (!r || mn.get(tt, U) === void 0));)
      ((yn += 1), (tt = de(Ye(p, Fn(`${Xe}#${yn}`, R.entryKind)), De)));
    return (An.add(tt), tt);
  }
  function To(p) {
    if (ge.has(p)) return ge.get(p) ?? null;
    let R = v.get(p);
    if (R) return (ge.set(p, R), R);
    let U = m.get(p);
    if (!U) return (ge.set(p, null), null);
    if (U.entityKind === "prefab_instance") return null;
    let V = u.get(U.assetId);
    if (!V) return (ge.set(p, null), null);
    let X = U.parentEntityId ? To(U.parentEntityId) : `${V.vfsRootPath}:/`;
    if (!X) return null;
    let $ = G(U, X);
    return (ge.set(p, $), $);
  }
  let Yc = h.filter((p) => p.entityKind !== "prefab_instance" && !kr(p) && !g.has(p.id));
  function qc(p) {
    let R = u.get(p.assetId);
    return fE(r, R?.fileId ?? null);
  }
  function ko(p, R) {
    if (!qc(p) || p.entityKind === "material" || kr(p) || v.has(p.id)) return;
    let U = R ? G(p, R) : To(p.id);
    if (!U) return;
    let V = u.get(p.assetId),
      X = V ? A.get(V.fileId) : null,
      $ = R ?? (p.parentEntityId ? To(p.parentEntityId) : X);
    (ae({
      entryType: "node",
      entryKind: yE(p.entityKind),
      vfsPath: U,
      parentVfsPath: $ ?? null,
      sourceFileId: V?.fileId ?? null,
      sourceSymbolId: p.scriptSymbolId,
      sourceEntityId: p.id,
      displayName: Rm(p),
      childOrder: p.hierarchyOrder,
      content: null,
      metaContent: null,
      lineStart: p.lineStart,
      lineEnd: p.lineEnd,
      targetVfsPath: null,
      projectionKind: null,
      vfsLogicalKey: V ? At(V.fileId, p.localKey) : null,
    }),
      v.set(p.id, U));
  }
  function Qy(p) {
    let R = m.get(p);
    !R ||
      v.has(p) ||
      !qc(R) ||
      (R.entityKind !== "prefab_instance" && (kr(R) || (R.parentEntityId && Qy(R.parentEntityId), ko(R))));
  }
  Yc.sort(It).forEach((p) => {
    ko(p);
  });
  for (let p of h) {
    if (!kr(p) || p.parentEntityId === null) continue;
    let R = v.get(p.parentEntityId);
    R && v.set(p.id, R);
  }
  function zc(p) {
    if (p.entityKind !== "prefab_instance" || v.has(p.id)) return v.get(p.id) ?? null;
    let R = u.get(p.assetId);
    if (!R) return null;
    let U = A.get(R.fileId) ?? null;
    p.parentEntityId && Qy(p.parentEntityId);
    let X = Nt.get(p.id) ?? (p.parentEntityId ? To(p.parentEntityId) : U),
      $ = p.parentEntityId ? X : `${R.vfsRootPath}:/`;
    if (!$) return null;
    let ee = Ut(
      $,
      Ml(p),
      "container",
      p.entityKind,
      Un(p),
      r ? (Rn(e, At(R.fileId, p.localKey))?.vfsPath ?? ep.get(p.id)) : void 0,
    );
    return (
      ae({
        entryType: "node",
        entryKind: yE(p.entityKind),
        vfsPath: ee,
        parentVfsPath: X,
        sourceFileId: R.fileId,
        sourceSymbolId: p.scriptSymbolId,
        sourceEntityId: p.id,
        displayName: Rm(p),
        childOrder: p.hierarchyOrder,
        content: null,
        metaContent: null,
        lineStart: p.lineStart,
        lineEnd: p.lineEnd,
        targetVfsPath: null,
        projectionKind: null,
        vfsLogicalKey: At(R.fileId, p.localKey),
      }),
      v.set(p.id, ee),
      Jy(p, ee, R),
      Zy(p),
      ee
    );
  }
  function Xy(p) {
    let R = Nt.get(p.id);
    if (R) return R;
    if (p.parentEntityId) {
      let V = m.get(p.parentEntityId);
      return V ? J(V) : null;
    }
    let U = u.get(p.assetId);
    return U ? `${U.vfsRootPath}:/` : null;
  }
  function zi(p, R) {
    let U = de(`${R.vfsRootPath}:/`, "container");
    return de(p, "container") === U ? R.vfsRootPath : p;
  }
  function XP(p, R, U, V) {
    let X = de(Ye(R, ".SourcePrefab"), "link"),
      $ = de(V.projectRelPath, "file");
    (ae({
      entryType: "link",
      entryKind: "source_prefab_link",
      vfsPath: X,
      parentVfsPath: zi(R, U),
      sourceFileId: U.fileId,
      sourceSymbolId: null,
      sourceEntityId: p.id,
      displayName: ".SourcePrefab",
      content: null,
      metaContent: null,
      lineStart: null,
      lineEnd: null,
      targetVfsPath: $,
      projectionKind: "source_prefab",
      instanceRootVfsPath: R,
      sizeBytes: 0,
    }),
      Q(X, $, "source_prefab"),
      Q(R, $, "instance_of"));
  }
  function Jy(p, R, U) {
    let V = de(Ye(R, ".PrefabOverrides"), "leaf");
    ae({
      entryType: "node",
      entryKind: "prefab_overrides",
      vfsPath: V,
      parentVfsPath: zi(R, U),
      sourceFileId: U.fileId,
      sourceSymbolId: null,
      sourceEntityId: p.id,
      displayName: ".PrefabOverrides",
      content: null,
      metaContent: null,
      lineStart: p.lineStart,
      lineEnd: p.lineEnd,
      targetVfsPath: null,
      projectionKind: null,
      sourceVfsPath: null,
      sourceOwnerVfsPath: R,
      instanceRootVfsPath: R,
    });
  }
  function JP(p, R) {
    return [".SourcePrefab", ".PrefabOverrides"].some((U) => {
      let V = de(Ye(R, U), U === ".SourcePrefab" ? "link" : "leaf"),
        X = ce.get(V);
      if (ce.has(V)) return X !== p.id;
      let $ = re.get(V);
      return $ !== void 0 && $.source_entity_id !== null && $.source_entity_id !== p.id;
    });
  }
  function Zy(p, R) {
    let U = [...(Ie.get(p.id) ?? [])];
    for (let V = 0; V < U.length; V += 1) {
      let X = U[V],
        $ = R?.get(X.id);
      if (kr(X)) {
        let ee = X.parentEntityId ? v.get(X.parentEntityId) : null;
        ee && v.set(X.id, ee);
      } else X.entityKind === "prefab_instance" ? $ && Nt.set(X.id, $) : ko(X, $);
      U.push(...(Ie.get(X.id) ?? []));
    }
  }
  let No = new Map(),
    Uo = new Map(),
    Hc = h.filter((p) => p.entityKind === "prefab_instance").sort(It),
    ep = new Map();
  if (r)
    for (let p of Hc) {
      let R = u.get(p.assetId),
        U = R ? (Rn(e, At(R.fileId, p.localKey))?.vfsPath ?? Rn(e, td(p.id))?.instanceRootVfsPath ?? void 0) : void 0;
      U && ep.set(p.id, U);
    }
  let Hi = new Map(),
    Ao = new Set(),
    tp = new Map(),
    ZP = new Map(Hc.map((p) => [p.id, p])),
    np = (p) => {
      if (Ao.has(p.id)) return;
      (Ao.add(p.id), v.delete(p.id));
      let R = u.get(p.assetId),
        U = R ? S.get(R.fileId) : void 0,
        V = y.get(p.id),
        X = V ? w.get(V) : void 0,
        $ = X ? E.get(X) : void 0;
      ($ && tp.set(p.id, $),
        N({
          severity: "warning",
          category: "materialize",
          stage: "materialize",
          code: $ ? "prefab_projection_source_unprojectable" : "prefab_projection_source_missing",
          filePath: U?.projectRelPath,
          message: $
            ? `Prefab instance source ${$.projectRelPath} exists but has no projectable root entity.`
            : V
              ? `Prefab instance source ${V} could not be found.`
              : `Prefab instance ${p.localKey} has no source.`,
        }));
    },
    rp = [];
  for (let p of Hc) {
    if (Hi.has(p.id)) continue;
    let R = [{ entity: p, expanded: !1 }];
    for (; R.length > 0;) {
      let U = R.pop();
      if (U.expanded) {
        (Hi.set(U.entity.id, "visited"), rp.push(U.entity));
        continue;
      }
      if (Hi.get(U.entity.id) === "visited") continue;
      (Hi.set(U.entity.id, "visiting"), R.push({ entity: U.entity, expanded: !0 }));
      let V = U.entity.sourceEntityId ? ZP.get(U.entity.sourceEntityId) : void 0;
      if (!V) {
        U.entity.sourceEntityId === null && np(U.entity);
        continue;
      }
      let X = Hi.get(V.id);
      if (X === "visiting") {
        Ao.add(U.entity.id);
        let $ = u.get(U.entity.assetId),
          ee = $ ? S.get($.fileId) : void 0;
        N({
          severity: "warning",
          category: "materialize",
          stage: "materialize",
          code: "prefab_projection_cycle",
          filePath: ee?.projectRelPath,
          message: `Prefab projection cycle detected at ${ee?.projectRelPath ?? U.entity.localKey}.`,
        });
      } else X !== "visited" && R.push({ entity: V, expanded: !1 });
    }
  }
  let Qi = rp;
  for (; Qi.length > 0;) {
    (No.clear(),
      Uo.clear(),
      Qi.forEach((R) => {
        let U = Xy(R),
          V = R.sourceEntityId ? le(R.sourceEntityId) : null;
        if (!U || (Uo.set(U, (Uo.get(U) ?? 0) + 1), !V)) return;
        let X = `${U}|${V}`;
        No.set(X, (No.get(X) ?? 0) + 1);
      }));
    let p = [];
    for (let R of Qi) {
      if (Ao.has(R.id)) {
        let we = zc(R);
        if (we) {
          let Cn = tp.get(R.id),
            pn = u.get(R.assetId);
          (Cn && pn && XP(R, we, pn, Cn), te.flush());
        } else p.push(R);
        continue;
      }
      let U = Xy(R),
        V = R.sourceEntityId ? le(R.sourceEntityId) : null;
      if (!U || !V) {
        p.push(R);
        continue;
      }
      let X = R.sourceEntityId;
      if (!X) continue;
      let $ = le(X),
        ee = u.get(R.assetId);
      if (!$ || !ee) {
        p.push(R);
        continue;
      }
      let et = We($),
        be = et.find((we) => we.vfsPath === $);
      if (!be) {
        p.push(R);
        continue;
      }
      let Xe = `${U}|${V}`,
        Te = pE(V),
        De = be.displayName,
        je = Ml(R),
        yn = R.name?.trim() ?? "",
        tt = wn.posix.basename(ee.vfsRootPath),
        Ln = (yn && yn !== tt ? yn : De) || "PrefabInstance",
        On = () => {
          let we = Ut(U, je, "container", be.entryKind, Un(R), r ? Rn(e, At(ee.fileId, R.localKey))?.vfsPath : void 0);
          return (
            ae({
              entryType: "node",
              entryKind: be.entryKind,
              vfsPath: we,
              parentVfsPath: zi(U, ee),
              hostFileId: ee.fileId,
              sourceFileId: be.sourceFileId,
              sourceSymbolId: be.sourceSymbolId,
              sourceEntityId: be.sourceEntityId,
              displayName: Ln,
              childOrder: R.hierarchyOrder,
              content: null,
              metaContent: null,
              lineStart: be.lineStart,
              lineEnd: be.lineEnd,
              targetVfsPath: null,
              projectionKind: "prefab_inherited",
              sourceVfsPath: $,
              sourceOwnerVfsPath: $,
              sourceLogicalKey: be.vfsLogicalKey,
              instanceRootVfsPath: we,
              vfsLogicalKey: At(ee.fileId, R.localKey),
            }),
            we
          );
        },
        Xi = R.parentEntityId === null || (No.get(Xe) ?? 0) > 1 || (Uo.get(U) ?? 0) > 1 || je !== Te,
        rt = U;
      Xi && (rt = On());
      let Qc = de(Ye(rt, ".SourcePrefab"), "link");
      (!Xi && JP(R, rt) && ((rt = On()), (Qc = de(Ye(rt, ".SourcePrefab"), "link"))),
        me(rt),
        v.set(R.id, rt),
        ae({
          entryType: "link",
          entryKind: "source_prefab_link",
          vfsPath: Qc,
          parentVfsPath: zi(rt, ee),
          sourceFileId: ee.fileId,
          sourceSymbolId: null,
          sourceEntityId: R.id,
          displayName: ".SourcePrefab",
          content: null,
          metaContent: null,
          lineStart: null,
          lineEnd: null,
          targetVfsPath: V,
          projectionKind: "source_prefab",
          instanceRootVfsPath: rt,
          sizeBytes: 0,
        }),
        Q(Qc, V, "source_prefab"),
        Q(rt, V, "instance_of"),
        Jy(R, rt, ee));
      let Xc = new Map([[$, rt]]);
      for (let we of et) {
        if (we.vfsPath === $) continue;
        let Cn = we.parentVfsPath,
          pn = Cn ? (Xc.get(Cn) ?? null) : null;
        if (!pn) continue;
        let Ji = QP(pn, we, rt);
        (Xc.set(we.vfsPath, Ji),
          ae({
            entryType: "node",
            entryKind: we.entryKind,
            vfsPath: Ji,
            parentVfsPath: zi(pn, ee),
            hostFileId: ee.fileId,
            sourceFileId: we.sourceFileId,
            sourceSymbolId: we.sourceSymbolId,
            sourceEntityId: we.sourceEntityId,
            displayName: we.displayName,
            childOrder: we.childOrder,
            content: null,
            metaContent: null,
            lineStart: we.lineStart,
            lineEnd: we.lineEnd,
            targetVfsPath: null,
            projectionKind: "prefab_inherited",
            sourceVfsPath: we.vfsPath,
            sourceLogicalKey: we.vfsLogicalKey,
            sourceOwnerVfsPath: $,
            instanceRootVfsPath: rt,
          }));
      }
      let lp = new Map();
      for (let we of Ie.get(R.id) ?? []) {
        let Cn = g.get(we.id),
          pn = Cn ? _(Cn) : null,
          Ji = pn ? Xc.get(pn) : void 0;
        Ji && lp.set(we.id, Ji);
      }
      (Zy(R, lp), te.flush());
    }
    if (p.length === Qi.length) {
      for (let R of p) (np(R), zc(R));
      break;
    }
    Qi = p;
  }
  h.filter((p) => p.entityKind === "prefab_instance")
    .sort((p, R) => p.id - R.id)
    .forEach((p) => {
      zc(p);
    });
  for (let p of Yc) v.has(p.id) || ge.delete(p.id);
  (Yc.sort(It).forEach((p) => {
    ko(p);
  }),
    t.onProgress?.(h.length, h.length, `Materialized ${h.length} entities`),
    n?.stop("materialize_entities"));
  for (let p of h) {
    if (p.entityKind !== "material") continue;
    let R = u.get(p.assetId);
    if (!R) continue;
    let U = A.get(R.fileId);
    U && v.set(p.id, U);
  }
  (UD({
    insertEntry: ae,
    entities: h,
    assetById: u,
    fileById: S,
    shouldDeferSourceContent: (p) => {
      let R = S.get(p);
      return R ? R.sizeBytes > 0 && H(R) : !1;
    },
    normalizeCanonical: de,
  }),
    te.flush(),
    MD(e, {
      fileById: S,
      symbolById: a,
      entityById: m,
      transformEntitiesByGameObjectEntityId: ZF(f),
      guidToProjectRelPath: so(i !== void 0 ? Cl(e) : s),
      localFileIdToVfsPathByFileId: hE(f, v, u),
      generation: r !== void 0 ? z : void 0,
    }),
    r !== void 0 && i !== void 0 && CD(e, i, z),
    se.clear(),
    n?.start("build_edges"),
    r !== void 0 && i !== void 0 && Pd(e, i),
    FD(e, Q, z, { scoped: r !== void 0 }),
    l.forEach((p) => {
      let R = C.get(p.id),
        U = p.fileId ? A.get(p.fileId) : null;
      Q(R, U, "defined_in", "symbol_file");
    }),
    h.forEach((p) => {
      let R = v.get(p.id);
      R && p.scriptSymbolId && Q(R, C.get(p.scriptSymbolId), "binds_to", "component_script");
    }));
  let ip = Qe(
    [
      ...c
        .filter(
          (p) => p.targetSymbolId !== null && p.resolutionStatus !== "unresolved" && p.resolutionStatus !== "ambiguous",
        )
        .map((p) => p.targetSymbolId),
      ...b.map((p) => p.toSymbolId),
    ].filter((p) => !C.has(p)),
  );
  if (ip.length > 0) {
    let p = aD(e, ip);
    for (let [R, U] of p) C.set(R, U);
  }
  c.forEach((p) => {
    if (p.resolutionStatus === "unresolved" || p.resolutionStatus === "ambiguous") return;
    let R = p.bindingKind === "invokes" ? "calls" : "refs";
    Q(fe(p.sourceSymbolId), fe(p.targetSymbolId), R, p.bindingKind);
  });
  let sp = (p) => {
    if (p.edgeKind === "component_of" || p.edgeKind === "child_of") {
      let R = m.get(p.fromEntityId);
      if (R && kr(R)) return;
      Q(v.get(p.fromEntityId), v.get(p.toEntityId), "child_of", p.edgeSubkind ?? p.edgeKind);
      return;
    }
    Q(v.get(p.fromEntityId), iv(p.toEntityId), p.edgeKind, p.edgeSubkind);
  };
  if (i !== void 0) yD(e, i).forEach(sp);
  else {
    let p = 0;
    for (;;) {
      let R = pD(e, p, 1024);
      if (R.length === 0) break;
      ((p = R[R.length - 1].id), R.forEach(sp));
    }
  }
  b.forEach((p) => {
    Q(v.get(p.fromEntityId), C.get(p.toSymbolId), p.edgeKind, p.edgeSubkind);
  });
  let op = i !== void 0 ? Cl(e) : s,
    ev = so(op),
    tv = new Map(op.map((p) => [p.projectRelPath, p.id])),
    nv = hE(f, v, u),
    ap = {
      sourceEntitiesByYamlObjectId: ND(f),
      fileById: S,
      guidToProjectRelPath: ev,
      entityEntryPathById: v,
      projectRelPathToFileId: tv,
      localFileIdToVfsPathByFileId: nv,
      insertEdge: (p, R) => {
        Q(p, R, "depends_on");
      },
    };
  if (i !== void 0) gE({ ...ap, yamlReferences: dD(e, i) });
  else {
    let p = 0;
    for (;;) {
      let R = mD(e, p, 1024);
      if (R.length === 0) break;
      ((p = R[R.length - 1].id), gE({ ...ap, yamlReferences: R }));
    }
  }
  (k.flush(),
    t.onProgress?.(k.emittedCount, k.emittedCount, `Materialized ${k.emittedCount} VFS edges`),
    n?.stop("build_edges"),
    n?.start("format_and_write"));
  let rv = DD(e, r !== void 0 ? z : void 0),
    or = { entryCount: te.emittedCount, edgeCount: k.insertedCount, searchIndexedEntryCount: rv };
  return (
    t.onProgress?.(or.entryCount, or.entryCount, `Wrote ${or.entryCount} VFS entries`),
    t.onProgress?.(or.edgeCount, or.edgeCount, `Wrote ${or.edgeCount} VFS edges`),
    n?.stop("format_and_write"),
    or
  );
  function iv(p) {
    let R = m.get(p);
    if (!R) return;
    let U = u.get(R.assetId);
    return U && SE(R) ? (A.get(U.fileId) ?? v.get(p)) : v.get(p);
  }
}
function Cl(e, t) {
  let n = `SELECT id, project_rel_path, abs_path, kind, guid, meta_file_id, size_bytes
       FROM files`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ke(
            e,
            `${n}
             WHERE id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((i) => {
    let s = i;
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
function tD(e, t) {
  let n = `SELECT id, file_id, symbol_kind, simple_name, display_name, qualified_name,
              signature, containing_symbol_id, line_start, line_end,
              is_external_stub, skeleton_content
       FROM symbols`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ke(
            e,
            `${n}
             WHERE file_id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((i) => {
    let s = i;
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
function nD(e, t) {
  return t.length === 0
    ? []
    : ke(
        e,
        `SELECT id, file_id, symbol_kind, simple_name, display_name, qualified_name,
              signature, containing_symbol_id, line_start, line_end,
              is_external_stub, skeleton_content
       FROM symbols
     WHERE id IN (`,
        t,
        ") ORDER BY id",
      ).map((i) => {
        let s = i;
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
function rD(e, t) {
  let n = new Map(t.map((s) => [s.id, s])),
    r = new Set(),
    i = (s) => {
      let o = s;
      for (; o !== null;) {
        let a = n.get(o);
        if (a) {
          o = a.containingSymbolId;
          continue;
        }
        r.add(o);
        break;
      }
    };
  for (let s of t) i(s.containingSymbolId);
  for (; r.size > 0;) {
    let s = nD(e, [...r]);
    r.clear();
    for (let o of s) n.set(o.id, o);
    for (let o of s) i(o.containingSymbolId);
  }
  return [...n.values()].sort((s, o) => s.id - o.id);
}
function iD(e) {
  return e === "class" || e === "interface" || e === "struct";
}
function sD(e, t) {
  if (e.length === 0) return null;
  let n = e.map((r) => {
    let i = 0;
    return (
      r.projectionKind === null && (i += 100),
      t && r.vfsPath.startsWith(t) && (i += 50),
      r.vfsPath.includes(".cs:") && (i += 10),
      { candidate: r, score: i }
    );
  });
  return (
    n.sort((r, i) => i.score - r.score || r.candidate.vfsPath.localeCompare(i.candidate.vfsPath)),
    n[0]?.candidate.vfsPath ?? null
  );
}
function oD(e, t) {
  if (t.length === 0) return new Map();
  let n = ke(
    e,
    `SELECT symbols.id AS symbol_id, files.project_rel_path AS project_rel_path
     FROM symbols
     JOIN files ON files.id = symbols.file_id
     WHERE symbols.id IN (`,
    t,
    ")",
  );
  return new Map(n.map((r) => [r.symbol_id, r.project_rel_path.replace(/\\/g, "/")]));
}
function aD(e, t) {
  let n = Qe(t);
  if (n.length === 0) return new Map();
  let r = oD(e, n),
    i = new Map();
  for (let o of He(n)) {
    let a = ke(
      e,
      `SELECT source_symbol_id, vfs_path, projection_kind
       FROM vfs_entries
       WHERE source_symbol_id IN (`,
      o,
      ") ORDER BY source_symbol_id, id",
    );
    for (let l of a) {
      let c = i.get(l.source_symbol_id) ?? [];
      (c.push({ vfsPath: l.vfs_path, projectionKind: l.projection_kind }), i.set(l.source_symbol_id, c));
    }
  }
  let s = new Map();
  for (let o of n) {
    let a = i.get(o);
    if (!a) continue;
    let l = sD(a, r.get(o) ?? null);
    l && s.set(o, l);
  }
  return s;
}
function lD(e, t) {
  let n = `SELECT sb.source_symbol_id, sb.target_symbol_id, sb.binding_kind, sb.resolution_status
       FROM semantic_bindings sb`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ke(
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
  ).map((i) => {
    let s = i;
    return {
      sourceSymbolId: s.source_symbol_id,
      targetSymbolId: s.target_symbol_id,
      bindingKind: s.binding_kind,
      resolutionStatus: s.resolution_status,
    };
  });
}
function mE(e, t) {
  let n = `SELECT id, file_id, asset_kind, name, vfs_root_path
       FROM assets`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ke(
            e,
            `${n}
             WHERE file_id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((i) => {
    let s = i;
    return { id: s.id, fileId: s.file_id, assetKind: s.asset_kind, name: s.name, vfsRootPath: s.vfs_root_path };
  });
}
function cD(e, t) {
  let n = `SELECT e.id, e.asset_id, e.yaml_object_id, e.entity_kind, e.local_key, e.name, e.hierarchy_name, e.hierarchy_order, e.type_name,
              e.script_symbol_id, e.parent_entity_id, e.source_entity_id,
              e.line_start, e.line_end, e.generated_content
       FROM entities e`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ke(
            e,
            `${n}
               JOIN assets a ON a.id = e.asset_id
               WHERE a.file_id IN (`,
            t,
            ") ORDER BY e.id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((i) => {
    let s = i;
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
function dD(e, t) {
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
        : ke(
            e,
            `${n}
             WHERE file_id IN (`,
            t,
            ") ORDER BY id",
          )
      : e.prepare(`${n} ORDER BY id`).all()
  ).map((i) => {
    let s = i;
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
function uD(e, t) {
  let n = `SELECT e.id AS entity_id, r.target_guid
       FROM entities e
       JOIN assets a ON a.id = e.asset_id
       JOIN yaml_references r
         ON r.file_id = a.file_id
        AND r.source_yaml_object_id = e.yaml_object_id
       WHERE e.entity_kind = 'prefab_instance'
         AND r.field_path = 'm_SourcePrefab'
         AND r.target_guid IS NOT NULL`,
    r =
      t !== void 0
        ? t.length === 0
          ? []
          : ke(
              e,
              `${n}
               AND a.file_id IN (`,
              t,
              ") ORDER BY e.id",
            )
        : e.prepare(`${n} ORDER BY e.id`).all();
  return new Map(r.map((i) => [i.entity_id, i.target_guid]));
}
function fD(e, t) {
  let n = (i) => {
      let s =
          i === "gameobject"
            ? `hierarchy_object.file_id = child_asset.file_id
           AND hierarchy_object.game_object_file_id = child.local_key`
            : "hierarchy_object.id = child.yaml_object_id",
        o = i === "gameobject" ? "m_Father" : "m_Modification.m_TransformParent",
        a = "CROSS JOIN",
        l =
          i === "gameobject"
            ? `yaml_objects hierarchy_object
           INDEXED BY idx_yaml_objects_game_object_file_id`
            : "yaml_objects hierarchy_object",
        c = `yaml_references parent_ref
           INDEXED BY idx_yaml_references_source_object`,
        d = `yaml_objects stripped_transform
           INDEXED BY idx_yaml_objects_local_identifier`,
        u = `yaml_references source_ref
           INDEXED BY idx_yaml_references_source_object`,
        f =
          i === "gameobject"
            ? `${a} yaml_references prefab_instance_ref
             INDEXED BY idx_yaml_references_source_object
           ON prefab_instance_ref.source_yaml_object_id = stripped_transform.id
          AND prefab_instance_ref.field_path = 'm_PrefabInstance'
          AND coalesce(
                prefab_instance_ref.target_local_id,
                prefab_instance_ref.target_file_id
              ) <> '0'`
            : "",
        m = `SELECT child.id AS entity_id,
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
       ${f}
       ${a} ${u}
         ON source_ref.source_yaml_object_id = stripped_transform.id
        AND source_ref.field_path = 'm_CorrespondingSourceObject'
       WHERE child.entity_kind = '${i}'
         AND source_ref.target_guid IS NOT NULL
         AND coalesce(source_ref.target_local_id, source_ref.target_file_id)
           IS NOT NULL`;
      return t !== void 0
        ? t.length === 0
          ? []
          : ke(
              e,
              `${m}
               AND child_asset.file_id IN (`,
              t,
              ")",
            )
        : e.prepare(m).all();
    },
    r = [...n("gameobject"), ...n("prefab_instance")].sort((i, s) => i.entity_id - s.entity_id);
  return new Map(r.map((i) => [i.entity_id, { sourceGuid: i.source_guid, sourceLocalId: i.source_local_id }]));
}
function mD(e, t, n) {
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
function yD(e, t) {
  let n = `SELECT ee.from_entity_id, ee.to_entity_id, ee.edge_kind, ee.edge_subkind
       FROM entity_edges ee`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ig(
            e,
            (i) => `${n}
               JOIN entities e_from ON e_from.id = ee.from_entity_id
               JOIN entities e_to ON e_to.id = ee.to_entity_id
               JOIN assets a_from ON a_from.id = e_from.asset_id
               JOIN assets a_to ON a_to.id = e_to.asset_id
               WHERE a_from.file_id IN (${i})
                 AND a_to.file_id IN (${i})
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
  ).map((i) => {
    let s = i;
    return {
      fromEntityId: s.from_entity_id,
      toEntityId: s.to_entity_id,
      edgeKind: s.edge_kind,
      edgeSubkind: s.edge_subkind,
    };
  });
}
function pD(e, t, n) {
  return e
    .prepare(
      `SELECT id, from_entity_id, to_entity_id, edge_kind, edge_subkind
       FROM entity_edges
       WHERE id > ?
       ORDER BY id
       LIMIT ?`,
    )
    .all(t, n)
    .map((i) => ({
      id: i.id,
      fromEntityId: i.from_entity_id,
      toEntityId: i.to_entity_id,
      edgeKind: i.edge_kind,
      edgeSubkind: i.edge_subkind,
    }));
}
function gD(e, t) {
  let n = `SELECT ese.from_entity_id, ese.to_symbol_id, ese.edge_kind, ese.edge_subkind
       FROM entity_symbol_edges ese`;
  return (
    t !== void 0
      ? t.length === 0
        ? []
        : ke(
            e,
            `${n}
             JOIN entities entity ON entity.id = ese.from_entity_id
             JOIN assets asset ON asset.id = entity.asset_id
             WHERE asset.file_id IN (`,
            t,
            ") ORDER BY ese.id",
          )
      : e.prepare(`${n} ORDER BY ese.id`).all()
  ).map((i) => {
    let s = i;
    return {
      fromEntityId: s.from_entity_id,
      toSymbolId: s.to_symbol_id,
      edgeKind: s.edge_kind,
      edgeSubkind: s.edge_subkind,
    };
  });
}
async function hD(e, t, n) {
  let r = 0,
    i = Math.min(t, e.length);
  async function s() {
    for (;;) {
      let o = r;
      if (((r += 1), o >= e.length)) return;
      await n(e[o]);
    }
  }
  await Promise.all(Array.from({ length: i }, () => s()));
}
function ID(e) {
  let t = new Set();
  return (
    e.forEach((n) => {
      let r = wn.posix.dirname(n.projectRelPath);
      for (; r !== "." && r !== "";) (t.add(r), (r = wn.posix.dirname(r)));
    }),
    [...t].sort((n, r) => n.localeCompare(r))
  );
}
function bD(e) {
  let t = wn.posix.dirname(e);
  return t === "." || t === "" ? null : t;
}
function Fl(e, t) {
  switch (e) {
    case "csharp":
    case "asmdef":
    case "asset":
    case "scene":
    case "prefab":
    case "yaml-asset":
      return pl(t, e);
    case "package-manifest":
      return "package_manifest";
    default:
      return e.replace(/-/g, "_");
  }
}
function SD(e) {
  return ["namespace", "class", "interface", "struct", "enum"].includes(e) ? "container" : "leaf";
}
function _D(e) {
  return ["gameobject", "subasset", "texture", "sprite"].includes(e) ? "container" : "leaf";
}
function yE(e) {
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
function Rm(e) {
  return (e.name ?? e.typeName).trim() || e.typeName;
}
function ED(e) {
  return gn(Rm(e), e.entityKind);
}
function Ml(e) {
  let t = e.hierarchyName?.trim();
  if (!t) return ED(e);
  if (!es(e.entityKind) && e.parentEntityId && t.includes("/") && !Zi(t)) {
    let n = wn.posix.basename(t) || t;
    return gn(n, e.entityKind);
  }
  return gn(t, e.entityKind);
}
function pE(e) {
  let t = e.endsWith("/") ? e.slice(0, -1) : e;
  return wn.posix.basename(t);
}
function Sm(e) {
  return e.entryType === "file" && e.sourceFileId !== null
    ? Jr(e.sourceFileId)
    : e.entryKind === "file_content" && e.sourceFileId !== null
      ? Fo(e.sourceFileId)
      : e.entryType === "link" && e.sourceEntityId !== null
        ? td(e.sourceEntityId)
        : e.sourceEntityId !== null && e.entryType === "node" && e.projectionKind !== "prefab_inherited"
          ? e.vfsLogicalKey?.startsWith("entity_file_local:")
            ? e.vfsLogicalKey
            : lr(e.sourceEntityId)
          : e.sourceSymbolId !== null && e.sourceFileId !== null
            ? ts(e.sourceFileId, e.sourceSymbolId)
            : e.entryType === "directory"
              ? Zr(e.vfsPath)
              : Zr(e.vfsPath);
}
function _m(e) {
  return e.sourceVfsPath
    ? e.projectionKind === "prefab_inherited" && e.sourceEntityId !== null
      ? lr(e.sourceEntityId)
      : Zr(e.sourceVfsPath)
    : null;
}
function RD(e) {
  return e.sourceSymbolId !== null
    ? "symbol_containment"
    : e.sourceEntityId !== null
      ? "entity_hierarchy"
      : e.entryType === "directory" || e.entryType === "file"
        ? "directory_parent"
        : "vfs_parent";
}
function wD(e) {
  return e.kind === "scene" || e.kind === "prefab" || e.kind === "yaml-asset" || Lt(e.projectRelPath) === "unity-yaml";
}
var PD = [
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
function vD(e) {
  return PD.some((t) => e === t || e.endsWith(`.${t}`));
}
function xD(e) {
  return e.startsWith("0000000000000000");
}
function TD(e) {
  let t = de(e.targetProjectRelPath, "file"),
    n = e.targetFileId?.trim() || e.targetLocalId?.trim() || null;
  if (!n) return t;
  let r = e.projectRelPathToFileId.get(e.targetProjectRelPath);
  if (!r) return t;
  let i = e.localFileIdToVfsPathByFileId.get(r)?.get(n);
  if (!i) return t;
  let s = i.endsWith("/") ? "container" : "leaf";
  return de(Ye(`${e.targetProjectRelPath}:`, i), s);
}
function kD(e, t) {
  if (e.length === 0) return null;
  let n = e.filter((r) => Zs(r.entityKind));
  return n.length > 0 ? (n.find((r) => yl(r.entityKind, t)) ?? null) : (e[0] ?? null);
}
function gE(e) {
  e.yamlReferences.forEach((t) => {
    if (t.refKind !== "guid-file" || !t.targetGuid || vD(t.fieldPath) || xD(t.targetGuid)) return;
    let n = kD(e.sourceEntitiesByYamlObjectId.get(t.sourceYamlObjectId) ?? [], t.fieldPath);
    if (!n) return;
    let r = e.entityEntryPathById.get(n.id);
    if (!r) return;
    let i = e.guidToProjectRelPath.get(t.targetGuid);
    if (!i) return;
    let s = e.fileById.get(t.fileId);
    if (!s || i === s.projectRelPath || (n.entityKind === "component" && n.scriptSymbolId && i.endsWith(".cs"))) return;
    let o = TD({
      targetProjectRelPath: i,
      targetFileId: t.targetFileId,
      targetLocalId: t.targetLocalId,
      projectRelPathToFileId: e.projectRelPathToFileId,
      localFileIdToVfsPathByFileId: e.localFileIdToVfsPathByFileId,
    });
    r !== o && e.insertEdge(r, o);
  });
}
function ND(e) {
  let t = new Map();
  for (let n of e) {
    if (n.yamlObjectId === null) continue;
    let r = t.get(n.yamlObjectId) ?? [];
    (r.push(n), t.set(n.yamlObjectId, r));
  }
  return t;
}
function hE(e, t, n) {
  let r = new Map();
  return (
    e.forEach((i) => {
      if (i.entityKind === "prefab_instance") return;
      let s = t.get(i.id),
        o = n.get(i.assetId);
      if (!s || !o || SE(i)) return;
      let a = `${o.vfsRootPath}:/`;
      if (!s.startsWith(a)) return;
      let l = s.slice(a.length),
        c = r.get(o.fileId);
      (c || ((c = new Map()), r.set(o.fileId, c)), c.set(i.localKey, l));
    }),
    r
  );
}
function SE(e) {
  return ml(e.localKey) && e.parentEntityId === null;
}
function UD(e) {
  let t = new Map();
  (e.entities.forEach((n) => {
    n.entityKind === "material" && t.set(n.assetId, n);
  }),
    e.assetById.forEach((n) => {
      let r = e.fileById.get(n.fileId);
      if (!r || !jl(r)) return;
      let i = t.get(n.id);
      if (!i || !e.shouldDeferSourceContent(r.id)) return;
      let s = e.normalizeCanonical(r.projectRelPath, "file");
      e.insertEntry({
        entryType: "node",
        entryKind: "material",
        vfsPath: e.normalizeCanonical(os(s), "leaf"),
        parentVfsPath: s,
        sourceFileId: r.id,
        sourceSymbolId: null,
        sourceEntityId: i.id,
        displayName: ".content",
        content: null,
        metaContent: null,
        lineStart: i.lineStart,
        lineEnd: i.lineEnd,
        targetVfsPath: null,
        projectionKind: null,
        sizeBytes: 0,
      });
    }));
}
function jl(e) {
  return Fl(e.kind, e.projectRelPath) === "material";
}
function Em(e) {
  e.metaContent && (e.metaContent = kl(e.metaContent));
}
function AD(e, t) {
  if (e < t)
    throw new Error(
      `Entry identity cache capacity (${e}) must be at least the entry batch size (${t}) so unflushed paths cannot be evicted`,
    );
}
var wm = class {
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
    let r = this.statement.get(t);
    return (r && this.remember(t, r.id), r?.id);
  }
  remember(t, n) {
    for (this.cache.delete(t), this.cache.set(t, n); this.cache.size > this.capacity;) {
      let r = this.cache.keys().next().value;
      if (r === void 0) break;
      this.cache.delete(r);
    }
  }
  clear() {
    this.cache.clear();
  }
};
function Rn(e, t) {
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
function LD(e) {
  return e.prepare("SELECT materialization_generation FROM projects WHERE id = 1").get().materialization_generation;
}
function OD(e) {
  return e
    .prepare(
      `UPDATE projects
       SET materialization_generation = materialization_generation + 1
       WHERE id = 1
       RETURNING materialization_generation`,
    )
    .get().materialization_generation;
}
function CD(e, t, n) {
  for (let r of He(t)) {
    let i = ze(r.length);
    e.prepare(
      `DELETE FROM vfs_entries
         WHERE project_id = 1
           AND host_file_id IN (${i})
           AND materialization_generation < ?`,
    ).run(...r, n);
  }
}
function MD(e, t) {
  let n = e.prepare("DELETE FROM vfs_entries WHERE id = ?"),
    r = t.generation !== void 0,
    i = e.prepare(`SELECT id, entry_type, entry_kind, file_family, vfs_path, parent_vfs_path,
            host_file_id, source_file_id, source_symbol_id, source_entity_id,
            display_name,
            content, meta_content, line_start, line_end, size_bytes,
            target_vfs_path, projection_kind, source_vfs_path,
            source_owner_vfs_path, instance_root_vfs_path, vfs_logical_key,
            source_logical_key, materialization_generation
     FROM vfs_entries INDEXED BY ${r ? "idx_vfs_entries_file_generation" : "idx_vfs_entries_source_file_id"}
     WHERE project_id = 1
       AND source_file_id IS NOT NULL
       ${r ? "AND materialization_generation = ?" : ""}
       AND (source_file_id, id) > (?, ?)
     ORDER BY source_file_id, id
     LIMIT ?`),
    s = 0,
    o = 0,
    a = null,
    l = null;
  for (;;) {
    let c = r ? [t.generation, s, o, dE] : [s, o, dE],
      d = i.all(...c).map(_E);
    if (d.length === 0) break;
    let u = d[d.length - 1];
    ((s = u.sourceFileId), (o = u.id));
    for (let f = 0; f < d.length;) {
      let m = d[f].sourceFileId,
        y = f + 1;
      for (; y < d.length && d[y].sourceFileId === m;) y += 1;
      a !== m && ((a = m), (l = null));
      let g = t.fileById.get(m);
      if (g) {
        let h = d.slice(f, y),
          b = h.map((I) => ({ entry: I, fileId: m }));
        l === null && b.some((I) => GD(I, g, t)) && (l = $D(g.absPath));
        let S = jD(g, b, t, l),
          P = new Set(S.map((I) => I.id));
        nE(e, S);
        for (let I of h) P.has(I.id) || n.run(I.id);
      }
      f = y;
    }
  }
}
function _E(e) {
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
function FD(e, t, n, r) {
  let i = 0;
  for (;;) {
    let s = r.scoped ? [n, i, 512] : [i, 512],
      o = r.scoped ? "vfs_entries INDEXED BY idx_vfs_entries_generation_id" : "vfs_entries NOT INDEXED",
      a = r.scoped ? "AND materialization_generation = ?" : "",
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
    i = l[l.length - 1].id;
    for (let c of l)
      t(
        c.vfs_path,
        c.parent_vfs_path,
        "child_of",
        RD({ entryType: c.entry_type, sourceSymbolId: c.source_symbol_id, sourceEntityId: c.source_entity_id }),
      );
  }
}
function DD(e, t) {
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
function jD(e, t, n, r) {
  return t.flatMap((i) => {
    let s = KD(i.entry, e, n, r);
    if (s === "") return VD(i.entry) ? [] : [i.entry];
    if (!s) return [i.entry];
    let o = WD(i.entry, s, n.fileById, n.guidToProjectRelPath, n.localFileIdToVfsPathByFileId),
      a = YD(o);
    return [{ ...i.entry, content: a, sizeBytes: BD(i.entry, o) }];
  });
}
function BD(e, t) {
  return e.entryType === "file" || e.entryKind === "file_content" ? e.sizeBytes : Buffer.byteLength(t, "utf8");
}
function VD(e) {
  return (
    e.entryType === "node" &&
    e.displayName === ".content" &&
    (e.entryKind === "file_content" || e.entryKind === "material")
  );
}
function $D(e) {
  try {
    return IE(JF(e, "utf8"));
  } catch {
    return IE("");
  }
}
function IE(e) {
  return { raw: e, normalized: oE(e), lineStarts: aE(e) };
}
function GD(e, t, n) {
  if (EE(e.entry) || RE(e.entry, t, n, null) !== null || !Bo(t.projectRelPath, t.sizeBytes)) return !1;
  let r = e.entry.sourceEntityId !== null ? n.entityById.get(e.entry.sourceEntityId) : void 0;
  return r && Gf(r.entityKind)
    ? !0
    : e.entry.entryType === "file" || e.entry.entryKind === "file_content"
      ? !(e.entry.entryType === "file" && jl(t))
      : e.entry.lineStart !== null && e.entry.lineEnd !== null;
}
function KD(e, t, n, r) {
  if (EE(e)) return null;
  let i = RE(e, t, n, r?.normalized ?? null);
  if (i !== null) return i;
  if (r === null || !Bo(t.projectRelPath, t.sizeBytes)) return null;
  if (e.entryType === "file" || e.entryKind === "file_content") return e.entryType === "file" && jl(t) ? null : r.raw;
  if (e.lineStart !== null && e.lineEnd !== null) {
    let s = bm(r.raw, r.lineStarts, e.lineStart, e.lineEnd),
      o = e.sourceEntityId !== null ? n.entityById.get(e.sourceEntityId) : void 0;
    if (o?.entityKind !== "gameobject") return s;
    let a = n.transformEntitiesByGameObjectEntityId.get(o.id);
    return a?.length
      ? a.reduce((l, c) => {
          let d = bm(r.raw, r.lineStarts, c.lineStart, c.lineEnd),
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
function EE(e) {
  return e.entryType === "file" || e.projectionKind === "prefab_inherited";
}
function RE(e, t, n, r) {
  if (e.sourceEntityId === null && e.sourceSymbolId !== null) {
    let s = n.symbolById.get(e.sourceSymbolId);
    if (s && iD(s.symbolKind) && s.skeletonContent?.trim()) return s.skeletonContent;
  }
  if (e.sourceEntityId === null) return null;
  let i = n.entityById.get(e.sourceEntityId);
  return i
    ? Zs(i.entityKind) || r_(i.entityKind)
      ? i.generatedContent?.trim()
        ? i.generatedContent
        : null
      : Gf(i.entityKind)
        ? i.generatedContent?.trim()
          ? i.generatedContent
          : !t || !r
            ? null
            : (qS(r, vr(t.guid, t.projectRelPath)).get(i.localKey) ?? null)
        : (hm(e.entryKind) || Im(e.entryKind)) && i.generatedContent?.trim()
          ? i.generatedContent
          : null
    : null;
}
function WD(e, t, n, r, i) {
  if (hm(e.entryKind)) return iE(t, r);
  if (Im(e.entryKind)) return sE(t, r);
  if (!e.sourceFileId) return t;
  let s = n.get(e.sourceFileId);
  if (!s || !wD(s) || (e.entryType === "file" && e.entryKind === "material")) return t;
  let o = eE(t, { guidToProjectRelPath: r, localFileIdToVfsPath: i.get(e.sourceFileId) ?? new Map() });
  return e.entryKind === "material" && e.entryType === "node" && jl(s) ? Nl(o.text, r) : o.text;
}
function YD(e) {
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
var Bl = class {
  entries = [];
  stack = [];
  globalStartMs = Date.now();
  start(t) {
    this.stack.push({ label: t, startMs: Date.now(), children: [] });
  }
  stop(t) {
    let n = Date.now() - this.peekStartMs(t),
      r = this.stack.pop(),
      i = { label: r.label, durationMs: n, children: r.children };
    this.stack.length > 0 ? this.stack[this.stack.length - 1].children.push(i) : this.entries.push(i);
  }
  recordDuration(t, n) {
    if (n <= 0) return;
    let r = this.stack[this.stack.length - 1];
    if (!r) throw new Error(`IndexBuildStopwatch.recordDuration('${t}') called with no active section`);
    let i = r.children.find((s) => s.label === t);
    if (i) {
      i.durationMs += n;
      return;
    }
    r.children.push({ label: t, durationMs: n, children: [] });
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
function wE(e) {
  let t = [];
  return (
    t.push(""),
    t.push("=== Index Build Timing Report ==="),
    t.push(""),
    PE(t, e.stages, 0),
    t.push(""),
    t.push(`  Total: ${vE(e.totalMs)}`),
    t.push(""),
    t.join(`
`)
  );
}
function PE(e, t, n) {
  let r = "  ".repeat(n + 1);
  for (let i of t) (e.push(`${r}${i.label}: ${vE(i.durationMs)}`), i.children.length > 0 && PE(e, i.children, n + 1));
}
function vE(e) {
  if (e < 1e3) return `${e}ms`;
  let t = e / 1e3;
  if (t < 60) return `${t.toFixed(2)}s`;
  let n = Math.floor(t / 60),
    r = t % 60;
  return `${n}m ${r.toFixed(1)}s`;
}
import Tm from "node:crypto";
import * as TE from "node:https";
import { execFile as qD } from "node:child_process";
import { promises as Vl } from "node:fs";
import ht from "node:os";
import lo from "node:path";
import { promisify as zD } from "node:util";
function Li() {
  let e = process.env.UNITY_INSIGHT_VERSION?.trim();
  return e || "0.0.1";
}
function Oi() {
  return "6e92ad2ce0a2918d63e1faeb5e76d6660fdf8143";
}
var vm = new URL("https://api.gamecowork.invalid/api/metrics/events"),
  xm = 5e3,
  HD = xm + 1e3,
  QD = 1e3 * 30,
  xE = 100,
  XD = "unity-metrics-distinct-id",
  JD = "gamecowork-unity-metrics-v1",
  ZD = zD(qD),
  $l = class e {
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
        (this.events.length >= xE && this.events.shift(),
        this.events.push({
          eventName: t,
          eventTime: new Date(),
          uuid: Tm.randomUUID(),
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
          let r = await this.buildPayloads(t);
          for (let i = 0; i < r.length; i++) (await this.sendRequest(r[i]), (n = i + 1));
        } catch (r) {
          return (
            this.restoreEvents(t.slice(n)),
            rj() &&
              console.debug(
                "[UnityInsightMetrics] Failed to flush events:",
                r instanceof Error ? r.message : String(r),
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
        }, QD)),
        this.flushTimer.unref?.());
    }
    restoreEvents(t) {
      let n = [...t, ...this.events].slice(-xE);
      ((this.events.length = 0), this.events.push(...n));
    }
    async buildPayloads(t) {
      let n = await this.getBaseFields(),
        r = Li(),
        i = Oi();
      return t.map((s) => {
        let o = {
          type: "track",
          time: ij(s.eventTime),
          distinct_id: n.distinctId,
          event_name: s.eventName,
          uuid: s.uuid,
          source: "unity_insight_cli",
          platform: ht.platform(),
          architecture: ht.arch(),
          version: r,
          git_commit: i,
          client_type: "unity_insight",
          status: s.status,
          duration_ms: s.durationMs,
          ip: n.ip,
          ...n.machineInfo,
          ...aj(s.error),
          ...(s.extra ?? {}),
        };
        return (yj(o), JSON.stringify(o));
      });
    }
    getBaseFields() {
      return (this.baseFieldsPromise || (this.baseFieldsPromise = nj()), this.baseFieldsPromise);
    }
    async sendRequest(t) {
      let n = {
        hostname: vm.hostname,
        path: `${vm.pathname}${vm.search}`,
        method: "POST",
        timeout: xm,
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(t) },
      };
      await new Promise((r, i) => {
        let s = TE.request(n, (o) => {
          (o.resume(),
            o.on("end", () => {
              o.statusCode && o.statusCode >= 200 && o.statusCode < 300
                ? r()
                : i(new Error(`HTTP ${o.statusCode ?? 0} ${o.statusMessage ?? ""}`));
            }));
        });
        (s.on("error", i),
          s.on("timeout", () => {
            (s.destroy(), i(new Error(`Request timeout after ${xm}ms`)));
          }),
          s.write(t),
          s.end());
      });
    }
  };
function co(e, t = {}) {
  $l.getInstance().enqueue(e, t);
}
async function ej(e = {}) {
  let t = $l.getInstance().flush();
  if (e.timeoutMs === void 0) {
    await t;
    return;
  }
  await tj(t, e.timeoutMs);
}
function Pn() {
  return ej({ timeoutMs: HD });
}
function tj(e, t) {
  let n;
  return Promise.race([
    e,
    new Promise((r) => {
      ((n = setTimeout(r, t)), n.unref?.());
    }),
  ]).finally(() => {
    n && clearTimeout(n);
  });
}
async function nj() {
  let e = await lj();
  return { distinctId: e, ip: oj(), machineInfo: sj(e) };
}
function rj() {
  let e = process.env.UNITY_INSIGHT_DEBUG_METRICS;
  return e === "1" || e?.toLowerCase() === "true";
}
function ij(e) {
  let t = (n, r = 2) => String(n).padStart(r, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())} ${t(e.getHours())}:${t(e.getMinutes())}:${t(e.getSeconds())}.${t(e.getMilliseconds(), 3)}`;
}
function sj(e) {
  return {
    machine_id: e,
    hostname: ht.hostname(),
    os: ht.platform(),
    os_type: ht.type(),
    os_release: ht.release(),
    arch: ht.arch(),
    cpu_model: ht.cpus()[0]?.model,
  };
}
function oj() {
  for (let e of Object.values(ht.networkInterfaces()))
    for (let t of e ?? []) if (!t.internal && t.family === "IPv4" && t.address) return t.address;
}
function aj(e) {
  return e
    ? e instanceof Error
      ? { error_name: e.name, error_message: e.message }
      : { error_message: String(e) }
    : {};
}
async function lj() {
  let e = await dj();
  if (e) return mj(e);
  let t = cj();
  try {
    let r = (await Vl.readFile(t, "utf8")).trim();
    if (r) return r;
  } catch {}
  let n = Tm.randomUUID().replace(/-/g, "");
  return (await Vl.mkdir(lo.dirname(t), { recursive: !0 }), await Vl.writeFile(t, n, "utf8"), n);
}
function cj() {
  let e =
    process.env.XDG_DATA_HOME ||
    (process.platform === "darwin"
      ? lo.join(ht.homedir(), "Library", "Application Support")
      : process.platform === "win32"
        ? process.env.LOCALAPPDATA || lo.join(ht.homedir(), "AppData", "Local")
        : lo.join(ht.homedir(), ".local", "share"));
  return lo.join(e, "Tuanjie Cowork", XD);
}
async function dj() {
  return process.platform === "darwin"
    ? await uj()
    : process.platform === "win32"
      ? process.env.COMPUTERNAME || ht.hostname()
      : await fj();
}
async function uj() {
  try {
    let { stdout: e } = await ZD("ioreg", ["-rd1", "-c", "IOPlatformExpertDevice"], { timeout: 1e3 });
    return e.toString().match(/"IOPlatformUUID"\s=\s"([^"]+)"/)?.[1];
  } catch {
    return;
  }
}
async function fj() {
  for (let e of ["/etc/machine-id", "/var/lib/dbus/machine-id"])
    try {
      let t = (await Vl.readFile(e, "utf8")).trim();
      if (t) return t;
    } catch {}
}
function mj(e) {
  return Tm.createHash("sha256").update(e.trim()).update(JD).digest("hex");
}
function yj(e) {
  for (let t of Object.keys(e)) e[t] === void 0 && delete e[t];
}
var pj = "unity_insight_index_build",
  gj = "unity_insight_index_sync";
function km(e) {
  co(pj, { status: hj(e), durationMs: e.durationMs, error: e.error, extra: bj(e.result) });
}
function Nm(e) {
  co(gj, { status: Ij(e), durationMs: e.durationMs, error: e.error, extra: Sj(e.result) });
}
function hj(e) {
  return e.error ? "error" : "completed";
}
function Ij(e) {
  return e.error ? "error" : e.result?.skipReason ? "skipped" : "completed";
}
function bj(e) {
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
function Sj(e) {
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
var Um = { bootstrap: 2, discovery: 3, extract: 38, resolve: 22, materialize: 28, finalize: 4, publish: 3 },
  Am = ["bootstrap", "discovery", "extract", "resolve", "materialize", "finalize", "publish"],
  _j = Am.reduce((e, t) => e + (Um[t] ?? 0), 0),
  Ej = {
    bootstrap: "Bootstrapping",
    discovery: "Discovering files",
    extract: "Extracting facts",
    resolve: "Resolving refs",
    materialize: "Materializing VFS",
    finalize: "Finalizing",
    publish: "Publishing",
  };
function Rj(e) {
  return Math.min(1, Math.max(0, e));
}
function wj(e) {
  return e.total > 0 ? Rj(e.current / e.total) : e.current > 0 ? 1 : 0;
}
function Nr(e) {
  let t = Am.indexOf(e.phase);
  if (t < 0) return 0;
  let n = 0;
  for (let o = 0; o < t; o += 1) {
    let a = Am[o];
    n += Um[a] ?? 0;
  }
  let r = Um[e.phase] ?? 0,
    s = ((n + r * wj(e)) / _j) * 100;
  return Math.min(100, Math.max(0, Math.round(s)));
}
function Ur(e) {
  let t = Ej[e.phase] ?? e.phase;
  return e.status && e.status.trim() !== "" ? e.status.trim() : e.total > 0 ? `${t} (${e.current}/${e.total})` : t;
}
function Pj(e, t = 20) {
  let n = Math.round((t * e) / 100),
    r = Math.max(0, t - n);
  return `${"#".repeat(n)}${"-".repeat(r)}`;
}
function kE(e, t) {
  let n = Nr(e),
    r = Ur(e),
    i = Pj(n);
  return `[${t}s] Indexing ${i} ${n}% ${r}`;
}
import { createHash as jE, randomUUID as Fi } from "node:crypto";
import { execFile as xj } from "node:child_process";
import { realpathSync as Tj } from "node:fs";
import {
  chmod as kj,
  link as Nj,
  mkdir as Uj,
  readFile as Aj,
  rename as BE,
  rm as Cm,
  stat as Di,
  writeFile as uo,
} from "node:fs/promises";
import { connect as VE, createServer as Lj } from "node:net";
import { once as Oj } from "node:events";
import Cj from "node:os";
import Pt from "node:path";
import { DatabaseSync as Mj } from "node:sqlite";
import { promisify as Fj } from "node:util";
import vj from "node:os";
import NE from "node:path";
function Ci(e = process.env, t = vj.homedir()) {
  let n = e.UNITY_INSIGHT_HOME?.trim();
  return n ? NE.resolve(n) : NE.join(t, ".unity-insight");
}
var Dj = 5,
  UE = 3,
  jj = 10,
  Om = 448,
  wt = 384,
  Bj = 3,
  Vj = 100,
  $j = 2e4,
  Gl = 2e4,
  $E = 16,
  AE = Math.floor($E / 2) + 1,
  GE = 250,
  Wl = `UNITY_INSIGHT_SINGLETON_GUARD/1
`,
  KE = "UNITY_INSIGHT_SINGLETON_GUARD/1 ",
  Gj = 128,
  LE = Fj(xj),
  OE,
  Kj = [
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
  ].join("; "),
  Yl = class extends Error {
    code;
    constructor(t, n) {
      (super(t, { cause: n.cause }), (this.name = "UnityInsightServeLifecycleLockError"), (this.code = n.code));
    }
  },
  Mi = class extends Error {
    code;
    constructor(t, n) {
      (super(t, { cause: n.cause }), (this.name = "UnityInsightServeSingletonGuardError"), (this.code = n.code));
    }
  },
  ql = new Map();
function Wj(e) {
  try {
    return Tj.native(e);
  } catch {
    return;
  }
}
function Ce(e) {
  let t = Pt.resolve(e),
    n = [],
    r = t;
  for (;;) {
    let i = Wj(r);
    if (i !== void 0) return Pt.join(i, ...n);
    let s = Pt.dirname(r);
    if (s === r) return t;
    (n.unshift(Pt.basename(r)), (r = s));
  }
}
function Ar(e) {
  let t = Ce(e);
  return process.platform === "win32" ? t.toLowerCase() : t;
}
function WE(e) {
  return e instanceof Yl && e.code === "busy";
}
function Yj(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = e;
  return t.errcode === Dj || (typeof t.message == "string" && /database is locked/i.test(t.message));
}
function YE(e) {
  try {
    e.exec("ROLLBACK");
  } catch {}
  try {
    e.close();
  } catch {}
}
function qj() {
  let e = Ce(Dm()),
    t = jE("sha256").update(Ar(e)).digest("hex");
  return Pt.join(Pt.dirname(e), ".unity-insight-serve-lifecycle", `${t}.db`);
}
function zj() {
  let e = Ar(Dm());
  return jE("sha256").update(e).digest("hex");
}
function Hj(e) {
  let t = Buffer.from(e, "hex"),
    n = t.readUInt32BE(0) % Gl,
    r = t.readUInt32BE(4) % Gl;
  for (r % 2 === 0 && (r += 1); r % 5 === 0;) r += 2;
  return ((r %= Gl), Array.from({ length: $E }, (i, s) => $j + ((n + s * r) % Gl)));
}
function Mm(e) {
  return e instanceof Mi && e.code === "busy";
}
function Qj(e, t) {
  let n = new Set(),
    r = `${KE}${e}
`,
    i = Lj((o) => {
      (n.add(o),
        o.on("error", () => {}),
        o.once("close", () => {
          n.delete(o);
        }),
        o.setTimeout(GE, () => {
          o.destroy();
        }));
      let a = "";
      o.on("data", (l) => {
        if (((a += l.toString("utf8")), Buffer.byteLength(a) > Buffer.byteLength(Wl) || !Wl.startsWith(a))) {
          o.destroy();
          return;
        }
        a === Wl && o.end(r);
      });
    }),
    s = { port: t, server: i, sockets: n };
  return (
    i.on("error", (o) => {
      s.runtimeError ??= o;
    }),
    s
  );
}
async function Xj(e, t) {
  await new Promise((n, r) => {
    let i = (o) => {
        (e.off("listening", s), r(o));
      },
      s = () => {
        (e.off("error", i), n());
      };
    (e.once("error", i), e.once("listening", s), e.listen({ host: "127.0.0.1", port: t, exclusive: !0 }));
  });
}
async function Jj(e, t) {
  let n = `${KE}${t}
`;
  return await new Promise((r) => {
    let i = VE({ host: "127.0.0.1", port: e }),
      s = "",
      o = !1,
      a = setTimeout(() => l(!1), GE),
      l = (c) => {
        o || ((o = !0), clearTimeout(a), i.destroy(), r(c));
      };
    (i.on("error", () => l(!1)),
      i.on("close", () => l(!1)),
      i.on("end", () => l(s === n)),
      i.on("connect", () => {
        i.write(Wl);
      }),
      i.on("data", (c) => {
        if (((s += c.toString("utf8")), Buffer.byteLength(s) > Gj || !n.startsWith(s))) {
          l(!1);
          return;
        }
        s === n && l(!0);
      }));
  });
}
function qE(e) {
  for (let t of e.sockets) t.destroy();
  (e.sockets.clear(), e.server.listening && e.server.close());
}
function Lm(e) {
  for (let t of e) qE(t);
}
async function Fm() {
  let e = zj(),
    t = Hj(e),
    n = [],
    r;
  for (let i of t) {
    let s = Qj(e, i);
    try {
      (await Xj(s.server, i), n.push(s));
    } catch (o) {
      if ((qE(s), !(o.code === "EADDRINUSE")))
        throw (
          Lm(n),
          new Mi(`Failed to acquire Unity Insight singleton guard port ${i}.`, { cause: o, code: "failed" })
        );
      if (((r = o), await Jj(i, e)))
        throw (
          Lm(n),
          new Mi(`Unity Insight singleton guard is already owned on port ${i}.`, { cause: o, code: "busy" })
        );
    }
  }
  if (n.length >= AE) return { bindings: n };
  throw (
    Lm(n),
    new Mi(
      `Failed to acquire a Unity Insight singleton guard quorum: retained ${n.length} of ${t.length} deterministic port candidates, but ${AE} are required.`,
      { cause: r, code: "failed" },
    )
  );
}
async function fo(e) {
  await Promise.all(
    e.bindings.map(async (t) => {
      for (let n of t.sockets) n.destroy();
      (t.sockets.clear(),
        t.server.listening &&
          (await new Promise((n) => {
            t.server.close(() => n());
          })));
    }),
  );
}
async function Zj(e, t) {
  (await Hl(Pt.dirname(e)), await uo(e, "", { flag: "a", mode: wt }), await tr(e, wt));
  let n = await Di(e, { bigint: !0 }),
    r;
  try {
    ((r = new Mj(e)),
      r.exec("PRAGMA busy_timeout = 0"),
      r.exec(`
      CREATE TABLE IF NOT EXISTS lifecycle_identity (
        singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
        generation TEXT NOT NULL
      )
    `),
      r
        .prepare(
          `INSERT OR IGNORE INTO lifecycle_identity(singleton, generation)
         VALUES (1, ?)`,
        )
        .run(Fi()));
    let i = r.prepare("SELECT generation FROM lifecycle_identity WHERE singleton = 1").get();
    if (typeof i?.generation != "string" || i.generation.trim() === "")
      throw new Error("Lifecycle database identity is missing.");
    let s = i.generation;
    r.exec("BEGIN IMMEDIATE");
    let o = await Di(e, { bigint: !0 });
    if (o.dev !== n.dev || o.ino !== n.ino) throw new Error(`Lifecycle lock pathname changed while acquiring ${e}.`);
    let a = {
      lifecycleLockDbPath: e,
      projectPath: t,
      token: Fi(),
      lifecycleGeneration: s,
      device: o.dev,
      inode: o.ino,
    };
    return (ql.set(a.token, r), a);
  } catch (i) {
    r && YE(r);
    let s = Yj(i);
    throw new Yl(
      s
        ? `Unity Insight shared serve is already running for ${t}.`
        : `Failed to acquire Unity Insight serve lifecycle lock at ${e}.`,
      { cause: i, code: s ? "busy" : "failed" },
    );
  }
}
async function zE() {
  return Zj(qj(), "the device-global daemon");
}
function nr(e) {
  let t = ql.get(e.token);
  t && (ql.delete(e.token), YE(t));
}
async function zl(e) {
  if (!ql.has(e.token)) return !1;
  try {
    let t = await Di(e.lifecycleLockDbPath, { bigint: !0 });
    return t.dev === e.device && t.ino === e.inode;
  } catch {
    return !1;
  }
}
function HE() {
  return { instanceId: Fi(), capabilityToken: Fi(), startedAt: Date.now() };
}
var e1 = 3e4;
function Dm() {
  return Pt.join(Cj.homedir(), ".unity-insight");
}
function jm() {
  return Pt.join(Dm(), ".serve.lock");
}
async function QE(e, t) {
  let n = await Zt(jm());
  if (n && Lr(n.pid)) {
    if (!t || n.servedProjectPaths === void 0) return !0;
    let r = Ar(t);
    if (n.servedProjectPaths.some((i) => Ar(i) === r)) return !0;
  }
  if (e) {
    let r = await Zt(e);
    if (r && Lr(r.pid)) return !0;
  }
  return !1;
}
function Lr(e) {
  if (!Number.isFinite(e) || e <= 0) return !1;
  try {
    return (process.kill(e, 0), !0);
  } catch {
    return !1;
  }
}
function Bm(e) {
  return `${JSON.stringify(e)}
`;
}
function Kl(e) {
  if (typeof e != "string") return;
  let t = e.trim();
  return t === "" ? void 0 : t;
}
function CE(e, t, n) {
  return typeof e == "number" && Number.isInteger(e) && e >= t && e <= n;
}
function t1(e) {
  let t = JSON.parse(e),
    n = Kl(t.host);
  if (!CE(t.pid, 1, Number.POSITIVE_INFINITY) || !n || !CE(t.port, 0, 65535)) return;
  let r = t.scope === "global" ? "global" : void 0,
    i = typeof t.projectPath == "string" && t.projectPath.trim() !== "" ? Ce(t.projectPath) : void 0;
  if (r !== "global" && !i) return;
  let s = Kl(t.instanceId),
    o = Kl(t.capabilityToken);
  if (!!s != !!o) return;
  let a = typeof t.startedAt == "number" && Number.isFinite(t.startedAt) && t.startedAt > 0 ? t.startedAt : void 0,
    l = Kl(t.lifecycleGeneration),
    c = typeof t.watchEnabled == "boolean" ? t.watchEnabled : void 0,
    d = Array.isArray(t.servedProjectPaths)
      ? [...new Set(t.servedProjectPaths.filter((u) => typeof u == "string" && u.trim() !== "").map((u) => Ce(u)))]
      : void 0;
  return {
    pid: t.pid,
    host: n,
    port: t.port,
    ...(r ? { scope: r } : {}),
    ...(i ? { projectPath: i } : {}),
    ...(s ? { instanceId: s } : {}),
    ...(o ? { capabilityToken: o } : {}),
    ...(a !== void 0 ? { startedAt: a } : {}),
    ...(l ? { lifecycleGeneration: l } : {}),
    ...(c !== void 0 ? { watchEnabled: c } : {}),
    ...(d ? { servedProjectPaths: d } : {}),
  };
}
async function tr(e, t) {
  if (process.platform === "win32") {
    OE ??= LE("powershell.exe", [
      "-NoLogo",
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      "[System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value",
    ]).then(({ stdout: r }) => {
      let i = r.trim();
      if (!/^S-\d(?:-\d+)+$/.test(i)) throw new Error("Failed to resolve the current Windows user SID.");
      return i;
    });
    let n = await OE;
    await LE("powershell.exe", [
      "-NoLogo",
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      Kj,
      e,
      n,
      t === Om ? "directory" : "file",
    ]);
    return;
  }
  try {
    await kj(e, t);
  } catch {}
}
async function Hl(e) {
  (await Uj(e, { recursive: !0, mode: Om }), await tr(e, Om));
}
async function Zt(e) {
  try {
    return t1(await Aj(e, "utf8"));
  } catch {
    return;
  }
}
async function Vm(e, t, n = {}) {
  await Hl(Pt.dirname(e));
  let r = `${e}.${process.pid}.tmp`;
  (await uo(r, Bm(t), { encoding: "utf8", mode: wt }), await tr(r, wt));
  let i = n.renameFile ?? BE,
    s = n.wait ?? ((o) => new Promise((a) => setTimeout(a, o)));
  for (let o = 1; o <= UE; o += 1)
    try {
      (await i(r, e), await tr(e, wt));
      return;
    } catch (a) {
      let l = a.code;
      if (o === UE || (l !== "EPERM" && l !== "EBUSY" && l !== "EACCES")) throw a;
      await s(jj * o);
    }
}
function n1(e, t) {
  if (
    e.pid !== t.pid ||
    (t.port > 0 && e.port !== t.port) ||
    (t.instanceId && e.instanceId && t.instanceId !== e.instanceId) ||
    (t.capabilityToken && e.capabilityToken && t.capabilityToken !== e.capabilityToken) ||
    (t.lifecycleGeneration && e.lifecycleGeneration !== t.lifecycleGeneration)
  )
    return !1;
  let n = t.scope === "global",
    r = e.scope === "global";
  return n || r ? n && r : !e.projectPath || !t.projectPath ? !1 : Ar(e.projectPath) === Ar(t.projectPath);
}
async function mo(e, t = 1e3) {
  if (!Number.isInteger(e.port) || e.port <= 0 || e.port > 65535 || e.host.trim() === "") return !1;
  let n;
  try {
    let r = VE({ host: e.host, port: e.port });
    if (
      ((n = r),
      r.setTimeout(t, () => {
        r.destroy(new Error("Serve health probe timed out"));
      }),
      await Oj(r, "connect"),
      !e.capabilityToken || !e.instanceId)
    )
      return (r.destroy(), !0);
    let i = `health-${Fi()}`,
      s = `${JSON.stringify({ id: i, method: "ping", params: { capability_token: e.capabilityToken } })}
`,
      o = new Promise((l) => {
        let c = "",
          d = (u) => {
            c += u.toString("utf8");
            let f = c.indexOf(`
`);
            if (!(f < 0)) {
              r.off("data", d);
              try {
                let m = JSON.parse(c.slice(0, f));
                l(m.id === i && m.status === "ok" && m.data?.instanceId === e.instanceId);
              } catch {
                l(!1);
              }
            }
          };
        (r.on("data", d), r.once("error", () => l(!1)), r.once("close", () => l(!1)));
      });
    r.write(s);
    let a = await Promise.race([
      o,
      new Promise((l) => {
        setTimeout(() => l(!1), t);
      }),
    ]);
    return (r.destroy(), a);
  } catch {
    return (n?.destroy(), !1);
  }
}
async function XE(e, t) {
  return JE(e, t);
}
function r1(e, t) {
  return (
    e.pid === t.pid &&
    e.host === t.host &&
    e.port === t.port &&
    e.scope === t.scope &&
    e.projectPath === t.projectPath &&
    e.instanceId === t.instanceId &&
    e.capabilityToken === t.capabilityToken &&
    e.startedAt === t.startedAt &&
    e.lifecycleGeneration === t.lifecycleGeneration
  );
}
async function i1(e, t) {
  try {
    await Nj(e, t);
  } catch {
  } finally {
    await Cm(e, { force: !0 });
  }
}
async function JE(e, t, n) {
  let r = `${e}.${process.pid}.${Fi()}.stale`;
  try {
    await BE(e, r);
  } catch {
    return !1;
  }
  let i = await Zt(r),
    s = n === void 0;
  if (n)
    try {
      let o = await Di(r);
      s = o.dev === n.dev && o.ino === n.ino && o.size === n.size && o.mtimeMs === n.mtimeMs;
    } catch {
      s = !1;
    }
  return !i || !s || !r1(i, t) ? (await i1(r, e), !1) : (await Cm(r, { force: !0 }), !0);
}
async function ME(e, t) {
  try {
    return await JE(e, t, await Di(e));
  } catch {
    return !1;
  }
}
async function s1(e) {
  try {
    let t = await Di(e);
    return Date.now() - t.mtimeMs > e1;
  } catch {
    return !1;
  }
}
async function $m(e, t = {}) {
  let n = await Zt(e);
  if (n) {
    if (t.lifecycleOwnershipConfirmed === !0) return ME(e, n);
    if (Lr(n.pid)) {
      if (t.probeHealth === !0 && n.port > 0 && n.capabilityToken && n.instanceId) {
        let r = t.healthProbe ?? mo,
          i = t.wait ?? ((s) => new Promise((o) => setTimeout(o, s)));
        for (let s = 1; s <= Bj; s += 1) if ((s > 1 && (await i(Vj)), await r(n))) return !1;
        return !1;
      }
      return !1;
    }
    return ME(e, n);
  }
  return (await s1(e)) ? (await Cm(e, { force: !0 }), !0) : !1;
}
async function ZE(e, t) {
  await Hl(Pt.dirname(e));
  let n = Bm(t);
  try {
    (await uo(e, n, { flag: "wx", encoding: "utf8", mode: wt }), await tr(e, wt));
  } catch (r) {
    if ((await tr(e, wt), !(await $m(e)))) throw r;
    (await uo(e, n, { flag: "wx", encoding: "utf8", mode: wt }), await tr(e, wt));
  }
}
function FE(e) {
  return (e.servedProjectPaths ?? []).map(Ar).sort();
}
function o1(e, t) {
  return (
    e.host === t.host &&
    e.port === t.port &&
    e.instanceId === t.instanceId &&
    e.capabilityToken === t.capabilityToken &&
    e.startedAt === t.startedAt &&
    e.lifecycleGeneration === t.lifecycleGeneration &&
    e.watchEnabled === t.watchEnabled &&
    JSON.stringify(FE(e)) === JSON.stringify(FE(t))
  );
}
function DE(e, t) {
  if (e && n1(e, t)) return o1(e, t) ? "ok" : void 0;
  if (e && e.pid !== t.pid && Lr(e.pid)) return "lost";
}
async function eR(e, t, n) {
  if (t.port <= 0 || t.pid <= 0) return "ok";
  let r = () => n?.shouldAbort?.() === !0,
    i = await Zt(e);
  if (r()) return "ok";
  let s = DE(i, t);
  if (s) return s;
  if (!i)
    try {
      return r() || (await Hl(Pt.dirname(e)), r())
        ? "ok"
        : (await uo(e, Bm(t), { flag: "wx", encoding: "utf8", mode: wt }), await tr(e, wt), "rewritten");
    } catch {
      if (r()) return "ok";
      let o = DE(await Zt(e), t);
      if (o) return o;
    }
  return r() ? "ok" : (await Vm(e, t), "rewritten");
}
var Ql = new Map();
function Gm(e) {
  return Ce(e);
}
function en(e, t) {
  let n = Gm(e),
    r = Nr(t),
    i = Ql.get(n),
    s = i !== void 0 ? Math.max(i.percent, r) : r;
  Ql.set(n, {
    percent: s,
    phase: t.phase,
    detail: Ur(t),
    current: t.current,
    total: t.total,
    updatedAt: new Date().toISOString(),
  });
}
function tn(e) {
  Ql.delete(Gm(e));
}
function vn(e) {
  return Ql.get(Gm(e)) ?? null;
}
import { mkdir as a1 } from "node:fs/promises";
import Km from "node:path";
import { setTimeout as l1 } from "node:timers/promises";
var c1 = 2e3;
function d1() {
  let t = Ci();
  return {
    indexLockPath: Km.join(t, ".global-index-build.lock"),
    indexWriteLockDbPath: Km.join(t, "global-index-build.lock.db"),
  };
}
async function tR(e = {}, t = {}) {
  let n = t.lockPaths ?? d1(),
    r = t.wait ?? l1,
    i = !1;
  for (await a1(Km.dirname(n.indexWriteLockDbPath), { recursive: !0, mode: 448 }); ;)
    try {
      return await Dn(n, "build");
    } catch (s) {
      if (!Wt(s)) throw s;
      (i || (e.onWaiting?.(), (i = !0)), await r(c1));
    }
}
async function nR(e) {
  return Ct(e);
}
var xn = class extends Error {
  constructor() {
    (super("Unity Insight index build is no longer needed"), (this.name = "UnityInsightIndexBuildSkippedError"));
  }
};
async function Xl(e, t = {}) {
  let n = Date.now(),
    r = vt.resolve(e.projectPath);
  try {
    return await m1(e, t);
  } catch (i) {
    throw (i instanceof xn || km({ durationMs: Date.now() - n, error: i }), i);
  } finally {
    tn(r);
  }
}
async function m1(e, t = {}) {
  let n = Date.now(),
    r = t.resolveIndexPaths ?? Be,
    i = t.readTextFile ?? ((S, P) => f1(S, P)),
    s = t.onProgress ?? e.onProgress,
    o = vt.resolve(e.projectPath),
    a = (S) => {
      (en(o, S), s?.(S));
    },
    l = e.schemaVersion ?? 11,
    d = e.timing === !0 ? new Bl() : void 0;
  if (l !== 11) throw new Error(`Unsupported Unity Insight schema version ${l}. Expected ${11}.`);
  (d?.start("validate"), await ri(o), d?.stop("validate"), d?.start("resolve_paths"));
  let u = r(o),
    f = e.outputPath ? "" : u1(),
    m = e.outputPath ? vt.resolve(e.outputPath) : vt.join(u.indexDirectoryPath, `index.${f}.db`),
    y = e.outputPath ? vt.join(vt.dirname(m), `${vt.basename(m)}.tmp`) : u.tempDbPath,
    g = e.outputPath
      ? { indexLockPath: vt.join(vt.dirname(m), Jc), indexWriteLockDbPath: vt.join(vt.dirname(m), Zc) }
      : u,
    h = vt.dirname(m);
  await Fp(h);
  let b = await Dn(g, "build");
  try {
    (d?.stop("resolve_paths"), d?.start("queue_wait"));
    let S = await tR(
      {
        onWaiting: () => {
          a({ phase: "waiting", current: 0, total: 1, status: "Waiting for another project index build..." });
        },
      },
      t.globalBuildLock,
    );
    try {
      d?.stop("queue_wait");
      let P = e.outputPath ? m : (it(u) ?? u.liveDbPath);
      if ((await t.shouldSkipAfterLock?.(P)) === !0) throw new xn();
      await md(y);
      let I = new Date().toISOString(),
        E = [],
        w = ["bootstrap"],
        T = { discoveredFileCount: 0, diagnosticCount: E.length, discoveredTotalBytes: 0 };
      d?.start("bootstrap");
      let x = await Dp(o, i),
        O;
      try {
        (a({ phase: "bootstrap", current: 1, total: 1 }),
          (O = Vo(y)),
          Bp(
            O,
            { projectPath: o, unityVersion: x, indexedAt: I, schemaVersion: l },
            { publishedIndexPath: m, mode: e.mode ?? "full", summary: T, completedStages: [...w], createdAt: I },
          ),
          d?.stop("bootstrap"),
          d?.start("extract"));
        let K = await Cb(
          O,
          o,
          E,
          {
            stopwatch: d,
            onDiscoveryComplete: (_) => {
              a({ phase: "discovery", current: _, total: _, status: `Discovered ${_} files` });
            },
            onExtractProgress: (_, L, N) => {
              a({ phase: "extract", current: _, total: L, status: N });
            },
            onExtractComplete: (_) => {
              a({ phase: "extract", current: _, total: _, status: `Prepared ${_} files and non-YAML facts` });
            },
          },
          { includePackages: e.includePackages },
        );
        (d?.stop("extract"),
          w.push("discovery", "extract"),
          (T.discoveredFileCount = K.discoveredFileCount),
          (T.discoveredTotalBytes = K.discoveredTotalBytes),
          (T.diagnosticCount = E.length),
          d?.start("resolve"),
          await ki(O, {
            stopwatch: d,
            diagnostics: E,
            yamlIndexPassDependencies: t.yamlIndexPassDependencies,
            onProgress: (_, L, N) => {
              a({ phase: "resolve", current: _, total: L, status: N });
            },
          }),
          d?.stop("resolve"),
          w.push("resolve"),
          (T.diagnosticCount = E.length),
          d?.start("materialize"),
          await Dl(O, {
            stopwatch: d,
            diagnostics: E,
            onProgress: (_, L, N) => {
              a({ phase: "materialize", current: _, total: L, status: N });
            },
          }),
          d?.stop("materialize"),
          w.push("materialize"),
          (T.diagnosticCount = E.length),
          d?.start("finalize"),
          O.prepare(
            `UPDATE rebuild_summary
           SET discovered_file_count = ?,
               diagnostic_count = ?,
               completed_stages_json = ?
           WHERE project_id = ?`,
          ).run(T.discoveredFileCount, T.diagnosticCount, JSON.stringify([...w, "finalize"]), 1),
          cs(O, E, I),
          gp(O),
          Vp(O),
          a({ phase: "finalize", current: 1, total: 1 }),
          d?.stop("finalize"),
          w.push("finalize"),
          d?.start("publish"),
          jp(O),
          O.close(),
          (O = void 0),
          e.outputPath
            ? await $p(y, m)
            : (await Jp(y, u, { randomUUID: () => f }), (await QE(u.serveLockPath, o)) || (await bd(u))),
          a({ phase: "publish", current: 1, total: 1 }),
          d?.stop("publish"));
      } catch (K) {
        throw (O?.close(), await md(y), e.outputPath || (await qo(u, m)), K);
      }
      let F = d?.snapshot(),
        Y = {
          projectPath: o,
          publishedIndexPath: m,
          tempIndexPath: y,
          mode: e.mode ?? "full",
          schemaVersion: l,
          completedStages: [...w],
          diagnostics: E,
          summary: T,
          timing: F,
        };
      return (km({ durationMs: Date.now() - n, result: Y }), Y);
    } finally {
      await nR(S);
    }
  } finally {
    await Ct(b);
  }
}
import { existsSync as D1 } from "node:fs";
import bR from "node:path";
import { createHash as p1 } from "node:crypto";
import { readFile as g1 } from "node:fs/promises";
function y1(e) {
  return e.replace(/\\/g, "/");
}
function rR(e, t) {
  let n = y1(e);
  return !n.startsWith("Assets/") || n.endsWith(".meta") ? !0 : t.has(`${n}.meta`);
}
function iR(e) {
  return e.deleted.length > 0 && e.created.length === 0 && e.modified.length === 0;
}
function h1(e, t) {
  return e.absolutePath === t.absolutePath && e.mtimeMs === t.mtimeMs && e.sizeBytes === t.sizeBytes;
}
async function Or(e) {
  let t = await g1(e);
  return p1("sha256").update(t).digest("hex");
}
function Jl(e) {
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
async function Zl(e, t, n = {}) {
  let r = await ui(e, { includePackages: n.includePackages }),
    i = Jl(t),
    s = new Map(i.map((m) => [m.projectRelPath, m])),
    o = new Map(r.files.map((m) => [m.projectRelPath, m])),
    a = new Set(r.files.map((m) => m.projectRelPath)),
    l = [],
    c = [],
    d = [],
    u = [];
  for (let m of r.files) {
    let y = s.get(m.projectRelPath);
    if (!y && !rR(m.projectRelPath, a)) continue;
    if (!y) {
      l.push(m);
      continue;
    }
    if (h1(m, y)) {
      d.push(m.projectRelPath);
      continue;
    }
    if ((await Or(m.absolutePath)) !== y.contentHash) {
      c.push({ discovered: m, fileId: y.id });
      continue;
    }
    (d.push(m.projectRelPath),
      u.push({
        fileId: y.id,
        projectRelPath: m.projectRelPath,
        absolutePath: m.absolutePath,
        mtimeMs: m.mtimeMs,
        sizeBytes: m.sizeBytes,
      }));
  }
  let f = i.filter((m) => !o.has(m.projectRelPath)).map((m) => ({ projectRelPath: m.projectRelPath, fileId: m.id }));
  return { created: l, modified: c, deleted: f, unchanged: d, metadataStale: u };
}
function ec(e, t = 50) {
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
function Wm(e) {
  return e.endsWith(".meta");
}
function I1(e) {
  return Wm(e) ? e.slice(0, -5) : `${e}.meta`;
}
function sR(e, t) {
  if (t.length === 0) return new Map();
  let n = t.map(() => "?").join(", "),
    r = e
      .prepare(
        `SELECT id, project_rel_path, guid, kind, meta_file_id, content_hash
       FROM files
       WHERE id IN (${n})`,
      )
      .all(...t);
  return new Map(
    r.map((i) => [
      i.id,
      {
        id: i.id,
        projectRelPath: i.project_rel_path,
        guid: i.guid,
        kind: i.kind,
        metaFileId: i.meta_file_id,
        contentHash: i.content_hash,
      },
    ]),
  );
}
function b1(e) {
  let t = new Map();
  e.forEach((r) => {
    r.kind === "meta" && r.guid && t.set(r.projectRelPath.slice(0, -5), r);
  });
  let n = new Map();
  return (
    e.forEach((r) => {
      if (Wm(r.projectRelPath)) return;
      let s = t.get(r.projectRelPath)?.guid;
      s && n.set(s, r);
    }),
    n
  );
}
async function S1(e, t) {
  let n = t.deleted.filter((l) => !Wm(l.projectRelPath));
  if (n.length === 0 || t.created.length === 0) return [];
  let r = sR(
      e,
      n.map((l) => l.fileId),
    ),
    i = b1(t.created),
    s = new Map(t.created.map((l) => [l.projectRelPath, l])),
    o = [],
    a = new Set();
  for (let l of n) {
    let c = r.get(l.fileId);
    if (!c?.guid || c.kind === "meta") continue;
    let d = i.get(c.guid);
    if (!d || d.projectRelPath === c.projectRelPath) continue;
    let u = I1(d.projectRelPath),
      f = u ? s.get(u) : void 0,
      m = c.metaFileId !== null ? sR(e, [c.metaFileId]).get(c.metaFileId) : void 0,
      y = await Or(d.absolutePath),
      g = !!f != !!m;
    (f && m && (g = (await Or(f.absolutePath)) !== m.contentHash),
      o.push({
        guid: c.guid,
        fileId: l.fileId,
        oldProjectRelPath: c.projectRelPath,
        discovered: d,
        metaFileId: c.metaFileId ?? void 0,
        oldMetaProjectRelPath: m?.projectRelPath,
        metaDiscovered: f,
        contentChanged: y !== c.contentHash || g,
      }),
      a.add(d.projectRelPath),
      f && a.add(f.projectRelPath));
  }
  return o;
}
function _1(e, t) {
  if (t.length === 0) return { ...e, moved: [] };
  let n = new Set(),
    r = new Set();
  for (let i of t)
    (n.add(i.fileId),
      r.add(i.oldProjectRelPath),
      r.add(i.discovered.projectRelPath),
      i.metaFileId !== void 0 && n.add(i.metaFileId),
      i.oldMetaProjectRelPath && r.add(i.oldMetaProjectRelPath),
      i.metaDiscovered && r.add(i.metaDiscovered.projectRelPath));
  return {
    ...e,
    moved: t,
    created: e.created.filter((i) => !r.has(i.projectRelPath)),
    deleted: e.deleted.filter((i) => !n.has(i.fileId)),
  };
}
async function oR(e, t) {
  let n = await S1(e, t);
  return _1(t, n);
}
function aR(e) {
  let t = new Set();
  for (let n of e)
    (t.add(n.oldProjectRelPath),
      (n.oldProjectRelPath.endsWith(".cs") ||
        n.oldProjectRelPath.endsWith(".prefab") ||
        n.oldProjectRelPath.endsWith(".unity")) &&
        t.add(`${n.oldProjectRelPath}:/`));
  return [...t];
}
import { mkdir as E1, writeFile as R1 } from "node:fs/promises";
import qm from "node:path";
function cR(e) {
  return e?.syncLog === !0;
}
function w1() {
  return { write() {} };
}
function P1(e) {
  let t = new Map();
  for (let n of e) {
    let r = [n.phase, n.operation, n.table ?? "", n.sql].join("\0"),
      i = t.get(r);
    if (i) {
      ((i.statementCount += 1), (i.totalRows += n.rows));
      continue;
    }
    t.set(r, {
      phase: n.phase,
      operation: n.operation,
      table: n.table,
      sql: n.sql,
      statementCount: 1,
      totalRows: n.rows,
    });
  }
  return [...t.values()].sort(L1);
}
function v1(e) {
  let t = new Map();
  for (let n of e) {
    let r = [n.phase, n.operation, n.table ?? ""].join("\0"),
      i = t.get(r);
    if (i) {
      ((i.statementCount += 1), (i.totalRows += n.rows));
      continue;
    }
    t.set(r, { phase: n.phase, operation: n.operation, table: n.table, statementCount: 1, totalRows: n.rows });
  }
  return [...t.values()].sort(O1);
}
function x1(e = process.cwd()) {
  let t = new Date().toISOString().replace(/[:.]/g, "-");
  return qm.join(e, "log", `sync-db-${t}.md`);
}
function T1(e, t) {
  let n = t.generatedAt ?? new Date().toISOString(),
    r = P1(e),
    i = v1(e),
    s = r.filter((c) => c.operation === "SELECT" && c.totalRows >= 100),
    o = r.filter((c) => c.operation !== "SELECT" && c.statementCount >= 2),
    a = r.filter(
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
      `- Distinct SQL shapes: ${r.length}`,
      "",
      "## Summary by phase / operation / table",
      "",
      "| Phase | Operation | Table | Statements | Rows |",
      "| --- | --- | --- | ---: | ---: |",
    ));
  for (let c of i)
    l.push(`| ${lR(c.phase)} | ${c.operation} | ${lR(c.table ?? "")} | ${c.statementCount} | ${c.totalRows} |`);
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
        Ym(c.sql),
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
        Ym(c.sql),
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
        Ym(c.sql),
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
async function k1(e, t, n) {
  let r = qm.resolve(e);
  return (await E1(qm.dirname(r), { recursive: !0 }), await R1(r, T1(t, n), "utf8"), r);
}
async function dR(e) {
  if (!e.enabled || e.entries.length === 0) return;
  let t = e.outputPath?.trim() || x1();
  return k1(t, e.entries, e.metadata);
}
function uR(e, t) {
  if (!t.enabled) return { database: e, setPhase: () => {}, getEntries: () => [] };
  let n = t.sink ?? w1(),
    r = [],
    i = t.initialPhase ?? "sync",
    s = (a) => {
      let l = { phase: i, ...a };
      (r.push(l), n.write(l));
    };
  return {
    database: new Proxy(e, {
      get(a, l, c) {
        if (l === "prepare") return (u) => N1(a.prepare(u), u, s);
        if (l === "exec") return (u) => U1(a, u, s);
        let d = Reflect.get(a, l, c);
        return typeof d == "function" ? d.bind(a) : d;
      },
    }),
    setPhase(a) {
      i = a;
    },
    getEntries: () => r,
  };
}
function N1(e, t, n) {
  let r = fR(t);
  return mR(r)
    ? e
    : new Proxy(e, {
        get(i, s, o) {
          if (s === "run")
            return (...l) => {
              let c = i.run(...l);
              return (
                (r.op === "insert" || r.op === "update" || r.op === "delete") &&
                  n({ operation: r.op.toUpperCase(), table: r.table, rows: c.changes, sql: t }),
                c
              );
            };
          if (s === "get")
            return (...l) => {
              let c = i.get(...l);
              return (
                r.op === "select" && n({ operation: "SELECT", table: r.table, rows: c === void 0 ? 0 : 1, sql: t }),
                c
              );
            };
          if (s === "all")
            return (...l) => {
              let c = i.all(...l);
              return (r.op === "select" && n({ operation: "SELECT", table: r.table, rows: c.length, sql: t }), c);
            };
          let a = Reflect.get(i, s, o);
          return typeof a == "function" ? a.bind(i) : a;
        },
      });
}
function U1(e, t, n) {
  let r = A1(t);
  for (let i of r) {
    let s = fR(i);
    if (mR(s)) {
      e.exec(i);
      continue;
    }
    if (s.op === "insert" || s.op === "update" || s.op === "delete") {
      let o = e.prepare(i).run();
      n({ operation: s.op.toUpperCase(), table: s.table, rows: o.changes, sql: i });
      continue;
    }
    (e.exec(i), s.op !== "other" && n({ operation: "EXEC", table: s.table, rows: 0, sql: i }));
  }
}
function fR(e) {
  let t = e.trim().replace(/\s+/g, " "),
    n = t.toUpperCase();
  if (n.startsWith("PRAGMA ")) return { op: "other" };
  if (n === "BEGIN" || n === "COMMIT" || n === "ROLLBACK" || n.startsWith("SAVEPOINT ") || n.startsWith("RELEASE "))
    return { op: "other" };
  let r = /^INSERT\s+(?:OR\s+\w+\s+)?INTO\s+[`"[]?(\w+)/i.exec(t);
  if (r) return { op: "insert", table: r[1] };
  let i = /^UPDATE\s+[`"[]?(\w+)/i.exec(t);
  if (i) return { op: "update", table: i[1] };
  let s = /^DELETE\s+FROM\s+[`"[]?(\w+)/i.exec(t);
  return s
    ? { op: "delete", table: s[1] }
    : n.startsWith("SELECT")
      ? { op: "select", table: /\bFROM\s+[`"[]?(\w+)/i.exec(t)?.[1] }
      : { op: "other" };
}
function mR(e) {
  return e.op === "other";
}
function A1(e) {
  return e
    .split(";")
    .map((t) => t.trim())
    .filter(Boolean);
}
function Ym(e) {
  return e.trim().replace(/\s+/g, " ");
}
function lR(e) {
  return e.replace(/\|/g, "\\|");
}
function L1(e, t) {
  return (
    e.phase.localeCompare(t.phase) ||
    e.operation.localeCompare(t.operation) ||
    (e.table ?? "").localeCompare(t.table ?? "") ||
    t.statementCount - e.statementCount
  );
}
function O1(e, t) {
  return (
    e.phase.localeCompare(t.phase) ||
    e.operation.localeCompare(t.operation) ||
    (e.table ?? "").localeCompare(t.table ?? "")
  );
}
import { existsSync as zm, statSync as C1 } from "node:fs";
import pR from "node:path";
var tc = [],
  yR = new Map();
function M1(e, t) {
  let n = yR.get(e);
  if (n && n.mtimeMs === t.mtimeMs && n.size === t.size) return n.compatible;
  let r = !1,
    i;
  try {
    i = Kt(e);
    let o = i.prepare("SELECT schema_version AS schemaVersion FROM projects WHERE id = 1").get()?.schemaVersion ?? 0,
      a = i.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'vfs_entries'").get() != null;
    r = o === 11 && a;
  } catch {
    r = !1;
  } finally {
    i?.close();
  }
  return (yR.set(e, { ...t, compatible: r }), r);
}
function xt(e, t = {}, n = {}) {
  let r = pR.resolve(e),
    i = Be(r),
    { liveDbPath: s, tempDbPath: o } = i,
    a =
      n.statIndex ??
      ((S) => {
        let P = C1(S);
        return { mtimeMs: P.mtimeMs, size: P.size };
      }),
    l,
    c,
    d = !1;
  for (let S = 0; S < 2 && ((l = it(i)), !!l); S += 1) {
    try {
      c = a(l);
    } catch (P) {
      if (S === 0 && !zm(l)) continue;
      throw P;
    }
    if (
      ((d = !t.requireQueryableVfs || M1(l, { mtimeMs: c.mtimeMs, size: c.size })),
      t.requireQueryableVfs && !d && S === 0 && !zm(l))
    ) {
      c = void 0;
      continue;
    }
    break;
  }
  let u = l ?? s,
    f = vn(r) != null,
    m = zm(o) || f,
    y = ii(i)?.mode === "sync",
    g = l !== void 0 && c != null && d,
    h = c?.mtimeMs,
    b;
  return (
    g ? (b = "ready") : m ? (b = "first_build") : (b = "no_index"),
    { indexReady: g, indexBuilding: m, indexSyncing: y, indexPath: u, indexMtimeMs: h, availability: b }
  );
}
function F1(e) {
  return e.indexBuilding
    ? "\u26A0\uFE0F A full Unity Insight index rebuild is in progress. Results below come from the complete previously published snapshot and may be stale."
    : e.indexSyncing
      ? "\u26A0\uFE0F An incremental Unity Insight index sync is in progress. Results below come from the previously published snapshot and may be stale."
      : null;
}
function gR(e, t) {
  let n = F1(e);
  return e.indexBuilding ? n : (t ?? n);
}
function Hm(e, t) {
  let n = pR.resolve(t);
  return e === "first_build"
    ? `Unity Insight is building its first index for this project (full build in progress).
Queries are not available until \`index.current\` selects a published database; the build writes to a temp database first.
Use Read/Grep on project files for live content until the build completes.
Project: ${n}
Run \`unity-insight-cli index status --project <path>\` to check progress.`
    : `No Unity Insight index is available for this project yet.
Expected index selector at: ${Be(n).currentPointerPath}
Run \`unity-insight-cli index build --project <path>\` to create one.
Until then, use Read/Grep/Glob on project files directly \u2014 indexing is optional and user-driven.`;
}
function hR(e, t) {
  let n = Hm(e, t);
  return { llmContent: n, returnDisplay: n };
}
var IR = {
  createdCount: 0,
  modifiedCount: 0,
  deletedCount: 0,
  movedCount: 0,
  unchangedCount: 0,
  createdPaths: tc,
  modifiedPaths: tc,
  deletedPaths: tc,
  movedPaths: tc,
};
function Qm(e) {
  let t = [{ severity: "info", category: "environment", message: e.message, code: e.reason }];
  return {
    projectPath: e.projectPath,
    publishedIndexPath: e.publishedIndexPath,
    mode: "incremental",
    schemaVersion: e.schemaVersion ?? 11,
    completedStages: [],
    diagnostics: t,
    summary: { discoveredFileCount: 0, diagnosticCount: t.length },
    reconcile: { ...IR },
    synced: !1,
    skipReason: e.reason,
  };
}
function j1(e) {
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
function nc(e, t, n, r) {
  let i = new Set([
      ...n.flatMap((a) => a.projectRelPaths.flatMap((l) => (l.endsWith(".meta") ? [l, l.slice(0, -5)] : [l]))),
      ...r,
    ]),
    s = (a) => [a.severity, a.category, a.stage ?? "", a.code ?? "", a.filePath ?? "", a.message].join("\0"),
    o = new Set(e.map(s));
  for (let a of t) {
    if (a.filePath && i.has(a.filePath)) continue;
    let l = s(a);
    o.has(l) || (o.add(l), e.push(a));
  }
}
function B1(e, t) {
  let n = new Map();
  for (let r of t)
    (n.set(r.oldProjectRelPath, r.discovered.projectRelPath),
      r.oldMetaProjectRelPath && r.metaDiscovered && n.set(r.oldMetaProjectRelPath, r.metaDiscovered.projectRelPath));
  return e.map((r) => {
    let i = r.filePath ? n.get(r.filePath) : void 0;
    return i ? { ...r, filePath: i } : r;
  });
}
async function rc(e, t = {}) {
  let n = Date.now(),
    r = bR.resolve(e.projectPath),
    i = !1;
  try {
    return await V1(e, t, () => {
      i = !0;
    });
  } catch (s) {
    throw (Nm({ durationMs: Date.now() - n, error: s }), s);
  } finally {
    i && tn(r);
  }
}
async function V1(e, t = {}, n) {
  let r = Date.now(),
    i = (w) => (Nm({ durationMs: Date.now() - r, result: w }), w),
    s = t.resolveIndexPaths ?? Be,
    o = t.onProgress ?? e.onProgress,
    a,
    l = bR.resolve(e.projectPath),
    c = (w) => {
      (a?.setPhase(w.phase), en(l, w), n?.(), o?.(w));
    },
    d = e.syncMode ?? "partial",
    u = e.schemaVersion ?? 11;
  if (u !== 11) throw new Error(`Unsupported Unity Insight schema version ${u}. Expected ${11}.`);
  await ri(l);
  let f = s(l),
    m = it(f) ?? f.liveDbPath;
  if (D1(f.tempDbPath))
    return i(
      Qm({
        projectPath: l,
        publishedIndexPath: m,
        schemaVersion: u,
        reason: "build_in_progress",
        message: `Unity Insight index build is in progress for ${l}.`,
      }),
    );
  let y;
  try {
    y = await Dn(f, "sync");
  } catch (w) {
    if (Wt(w))
      return i(
        Qm({ projectPath: l, publishedIndexPath: m, schemaVersion: u, reason: "lock_unavailable", message: w.message }),
      );
    throw w instanceof hn
      ? w
      : new hn(`Failed to acquire Unity Insight index write lock at ${f.indexWriteLockDbPath}.`, {
          cause: w,
          code: "failed",
        });
  }
  let g = [],
    h = [],
    b = { discoveredFileCount: 0, diagnosticCount: 0 },
    S = d,
    P = !1,
    I,
    E = cR(e);
  try {
    m = Id(f);
    let w = Kt(m),
      T;
    try {
      T = cd(w);
    } finally {
      w.close();
    }
    if (T !== u)
      throw new Error(
        `Cannot sync Unity Insight schema version ${T}. Rebuild the index with 'unity-insight-cli index build'.`,
      );
    ((I = Vo(m)),
      E && ((a = uR(I, { enabled: !0, sink: t.syncLogSink, initialPhase: "reconcile" })), (I = a.database)),
      jo(I));
    let x = j1(I);
    c({ phase: "reconcile", current: 0, total: 1 });
    let O = await Zl(l, I, { includePackages: e.includePackages }),
      F = await oR(I, O),
      Y = ec(F);
    if (
      (c({
        phase: "reconcile",
        current: 1,
        total: 1,
        status: `Reconcile: +${Y.createdCount} ~${Y.modifiedCount} -${Y.deletedCount} \u21C4${Y.movedCount}`,
      }),
      F.metadataStale.length > 0 &&
        wg(
          I,
          F.metadataStale.map((Z) => ({
            fileId: Z.fileId,
            absolutePath: Z.absolutePath,
            mtimeMs: Z.mtimeMs,
            sizeBytes: Z.sizeBytes,
          })),
        ),
      !(F.created.length > 0 || F.modified.length > 0 || F.deleted.length > 0 || (F.moved?.length ?? 0) > 0))
    ) {
      let Z = I.prepare("SELECT COUNT(*) AS count FROM files").get();
      return (
        (b.discoveredFileCount = Z.count),
        nc(g, x, [], []),
        (b.diagnosticCount = g.length),
        ei(I),
        I.close(),
        (I = void 0),
        await Ct(y),
        i({
          projectPath: l,
          publishedIndexPath: m,
          mode: "incremental",
          schemaVersion: u,
          completedStages: h,
          diagnostics: g,
          summary: b,
          reconcile: Y,
          synced: !1,
          resolveMode: S,
          fanoutTruncated: P,
        })
      );
    }
    c({ phase: "sync", current: 0, total: 1, status: "Planning scopes" });
    let _ = F.moved ?? [],
      L = _.filter((Z) => !Z.contentChanged),
      N = [],
      j = [],
      z = !1;
    if (_.length > 0) {
      ({ fastPathMoves: N, slowPathMoves: j } = vp(_, { allowFastPath: d !== "full_derived" }));
      let Z = N.filter((ne) => ne.discovered.kind === "prefab");
      ((N = N.filter((ne) => ne.discovered.kind !== "prefab")),
        (j = [...j, ...Z.map((ne) => ({ ...ne, contentChanged: !0 }))]));
      for (let ne of _) {
        let ge = await Or(ne.discovered.absolutePath);
        if (
          (Nd(I, {
            fileId: ne.fileId,
            projectRelPath: ne.discovered.projectRelPath,
            absolutePath: ne.discovered.absolutePath,
            sizeBytes: ne.discovered.sizeBytes,
            mtimeMs: ne.discovered.mtimeMs,
            contentHash: ge,
          }),
          ne.metaFileId !== void 0 && ne.metaDiscovered)
        ) {
          let Ie = await Or(ne.metaDiscovered.absolutePath);
          Nd(I, {
            fileId: ne.metaFileId,
            projectRelPath: ne.metaDiscovered.projectRelPath,
            absolutePath: ne.metaDiscovered.absolutePath,
            sizeBytes: ne.metaDiscovered.sizeBytes,
            mtimeMs: ne.metaDiscovered.mtimeMs,
            contentHash: Ie,
          });
        }
        ne.contentChanged && Zo(I, [ne.fileId]);
      }
      if (N.length > 0) {
        c({ phase: "vfs_rewrite", current: 0, total: N.length, status: "Rewriting moved VFS paths" });
        try {
          (xp(I, N.map(Pp)), (z = !0), c({ phase: "vfs_rewrite", current: N.length, total: N.length }));
        } catch (ne) {
          if (ne instanceof ni) ((j = [...j, ...N]), (N = []));
          else throw ne;
        }
      }
      (j.length > 0 && na(I, aR(j)), (x = B1(x, L)));
    }
    let te = { ...F, moved: j };
    if (!(te.created.length > 0 || te.modified.length > 0 || te.deleted.length > 0 || j.length > 0) && z) {
      let Z = I.prepare("SELECT COUNT(*) AS count FROM files").get();
      ((b.discoveredFileCount = Z.count),
        nc(g, x, [], []),
        (b.diagnosticCount = g.length),
        (S = "move_rewrite"),
        (P = !1));
      let ne = new Date().toISOString();
      return (
        ia(I),
        cs(I, g, ne),
        fd(I, {
          indexedAt: ne,
          mode: "incremental",
          discoveredFileCount: b.discoveredFileCount,
          diagnosticCount: b.diagnosticCount,
          completedStages: ["vfs_rewrite", "finalize"],
        }),
        h.push("vfs_rewrite", "finalize"),
        c({ phase: "finalize", current: 1, total: 1 }),
        ei(I),
        I.close(),
        (I = void 0),
        await Ct(y),
        i({
          projectPath: l,
          publishedIndexPath: m,
          mode: "incremental",
          schemaVersion: u,
          completedStages: [...h],
          diagnostics: g,
          summary: b,
          reconcile: Y,
          synced: !0,
          resolveMode: S,
          fanoutTruncated: P,
        })
      );
    }
    let ce = await ui(l, { includePackages: e.includePackages });
    c({ phase: "sync", current: 1, total: 2, status: `Discovered ${ce.files.length} project files` });
    let ie = Jl(I),
      re = new Map(ie.map((Z) => [Z.projectRelPath, Z.id])),
      k = new Map(
        I.prepare("SELECT id, guid FROM files")
          .all()
          .map((Z) => {
            let ne = Z;
            return [ne.id, ne.guid];
          }),
      ),
      C = dg(te, ce.files, { pathFilter: e.paths, indexedPathToId: re, indexedGuidByFileId: k }),
      v = C.csharpSymbolOnlyChanges && d !== "full_derived",
      A = C.assetSelfOnlyChanges && d !== "full_derived",
      M = rm(I, C, ce.files, { csharpSymbolOnly: v, assetSelfOnly: A });
    P = M.fanoutTruncated;
    let D = M.scriptPatchGuids;
    c({
      phase: "sync",
      current: 2,
      total: 2,
      status: `Planned ${M.resolveFileIds.length} resolve files (${M.scopes.length} scopes)`,
    });
    let H = d === "full_derived" || P || C.requiresFullDerivedRebuild;
    H && (S = "full_derived");
    let ae = iR(te),
      Q = C.deletedFileIds.length > 0 ? wr(I, C.deletedFileIds) : [];
    (C.deletedFileIds.length > 0 &&
      mg(
        I,
        te.deleted.filter((Z) => C.deletedFileIds.includes(Z.fileId)),
        re,
      ),
      Q.length > 0 && ps(I, { symbolFileIds: Q, bindingFileIds: Q }),
      fg(I, C.deletedFileIds),
      Zo(I, C.refreshFileIds),
      C.rebuildAllAssemblies && yg(I),
      H ? (ia(I), ra(I)) : vd(I, M.purgeScopes),
      c({
        phase: "extract",
        current: 0,
        total: C.extractDiscovered.length,
        status: "Preparing changed files and non-YAML facts",
      }));
    let fe = await jb(I, l, C.extractDiscovered, g, {
      onProgress: (Z, ne, ge) => {
        c({ phase: "extract", current: Z, total: ne, status: ge });
      },
    });
    if ((h.push("discovery", "extract"), C.rebuildAllAssemblies)) {
      let Z = await Fb(ce.files);
      oa(I, sa(Z, g));
    }
    ((b.discoveredFileCount = ce.files.length), (b.diagnosticCount = g.length));
    let Re = new Map(Jl(I).map((Z) => [Z.projectRelPath, Z.id])),
      Pe = M.resolveFileIds,
      B = M.purgeScopes;
    if (!H) {
      let Z = Rd(M.scopes, Re),
        ne = ug(C, Re),
        ge = { ...C, scopes: Z, resolveFileIds: ne, materializeScopes: Rd(C.materializeScopes, Re) },
        Ie = rm(I, ge, ce.files, { csharpSymbolOnly: v, assetSelfOnly: A });
      Ie.fanoutTruncated
        ? ((P = !0), (H = !0), (S = "full_derived"), ra(I))
        : (vd(I, Ie.purgeScopes), (B = Ie.purgeScopes), (Pe = Ie.resolveFileIds), (D = Ie.scriptPatchGuids));
    }
    let W = !H && ae && Pe.length === 0,
      ue = !H && C.rebuildProjectSymbolGraph && !ae;
    !H && Pe.length === 0 && !ae && ((H = !0), (S = "full_derived"), ra(I));
    let xe = new Set(
      L.flatMap((Z) => [Z.discovered.projectRelPath, ...(Z.metaDiscovered ? [Z.metaDiscovered.projectRelPath] : [])]),
    );
    if (
      (nc(
        g,
        x.filter((Z) => Z.filePath !== void 0 && xe.has(Z.filePath)),
        [],
        [],
      ),
      H ||
        nc(g, x, B, [
          ...te.deleted.map((Z) => Z.projectRelPath),
          ...j.flatMap((Z) => [Z.oldProjectRelPath, ...(Z.oldMetaProjectRelPath ? [Z.oldMetaProjectRelPath] : [])]),
        ]),
      H)
    )
      (await ki(I, {
        diagnostics: g,
        refreshedYamlFileIds: fe.refreshedYamlFileIds,
        reuseExistingYamlRaw: !0,
        yamlIndexPassDependencies: t.yamlIndexPassDependencies,
        onProgress: (Z, ne, ge) => {
          c({ phase: "resolve", current: Z, total: ne, status: ge });
        },
      }),
        await Dl(I, {
          diagnostics: g,
          onProgress: (Z, ne, ge) => {
            c({ phase: "materialize", current: Z, total: ne, status: ge });
          },
        }),
        h.push("resolve", "materialize"));
    else if (ue) {
      (a?.setPhase("resolve"),
        await dm(I, {
          diagnostics: g,
          onProgress: (ne, ge, Ie) => {
            c({ phase: "resolve", current: ne, total: ge, status: Ie });
          },
        }),
        h.push("resolve"));
      let Z = Jo(M.materializeScopes);
      Z.length > 0 &&
        (await Pm(I, Z, {
          diagnostics: g,
          onProgress: (ne, ge, Ie) => {
            c({ phase: "materialize", current: ne, total: ge, status: Ie });
          },
        }),
        h.push("materialize"));
    } else if (W)
      (a?.setPhase("resolve"),
        await K_(I, [], {
          diagnostics: g,
          onProgress: (Z, ne, ge) => {
            c({ phase: "resolve", current: Z, total: ne, status: ge });
          },
        }),
        h.push("resolve"));
    else {
      a?.setPhase("resolve");
      let Z = await W_(I, {
          resolveFileIds: Pe,
          diagnostics: g,
          refreshedYamlFileIds: fe.refreshedYamlFileIds,
          yamlIndexPassDependencies: t.yamlIndexPassDependencies,
          onProgress: (ge, Ie, Nt) => {
            c({ phase: "resolve", current: ge, total: Ie, status: Nt });
          },
        }),
        ne = [...new Set([...Pe, ...(Z.materializeFileIds ?? [])])];
      (await Pm(I, ne, {
        diagnostics: g,
        onProgress: (ge, Ie, Nt) => {
          c({ phase: "materialize", current: ge, total: Ie, status: Nt });
        },
      }),
        D.length > 0 && ag(I, D),
        h.push("resolve", "materialize"));
    }
    b.diagnosticCount = g.length;
    let Se = new Date().toISOString();
    (a?.setPhase("finalize"),
      ia(I),
      cs(I, g, Se),
      fd(I, {
        indexedAt: Se,
        mode: "incremental",
        discoveredFileCount: b.discoveredFileCount,
        diagnosticCount: b.diagnosticCount,
        completedStages: [...h, "finalize"],
      }),
      h.push("finalize"),
      c({ phase: "finalize", current: 1, total: 1 }));
    let fn = await dR({
      enabled: E,
      entries: a?.getEntries() ?? [],
      outputPath: e.syncLogPath,
      metadata: {
        projectPath: l,
        publishedIndexPath: m,
        synced: !0,
        resolveMode: S,
        fanoutTruncated: P,
        reconcileSummary: `+${Y.createdCount} ~${Y.modifiedCount} -${Y.deletedCount}`,
        completedStages: [...h],
      },
    });
    return (
      ei(I),
      I.close(),
      (I = void 0),
      await Ct(y),
      i({
        projectPath: l,
        publishedIndexPath: m,
        mode: "incremental",
        schemaVersion: u,
        completedStages: [...h],
        diagnostics: g,
        summary: b,
        reconcile: Y,
        synced: !0,
        resolveMode: S,
        fanoutTruncated: P,
        syncLogPath: fn,
      })
    );
  } catch (w) {
    let T = [];
    if (I && ns(I))
      try {
        nd(I);
      } catch (x) {
        T.push(x);
      }
    try {
      I?.close();
    } catch (x) {
      T.push(x);
    }
    try {
      await Ct(y);
    } catch (x) {
      T.push(x);
    }
    throw T.length > 0
      ? new AggregateError([w, ...T], "Unity Insight sync failed and cleanup was incomplete.", { cause: w })
      : w;
  }
}
import { existsSync as $1 } from "node:fs";
import G1 from "node:path";
function SR(e) {
  let t = vn(e.projectPath);
  return {
    ...e,
    progressPercent: t?.percent ?? null,
    progressPhase: t?.phase ?? null,
    progressDetail: t?.detail ?? null,
  };
}
async function ic(e, t = {}) {
  let n = t.resolveIndexPaths ?? Be,
    r = t.openDatabase ?? Kt,
    i = G1.resolve(e.projectPath),
    s = e.pendingPathLimit ?? 50;
  await ri(i);
  let o = n(i),
    a = vn(i),
    l = $1(o.tempDbPath) || a != null,
    c = ii(o),
    d;
  try {
    d = Yo(o, { openDatabase: r });
  } catch (m) {
    if (!(m instanceof Ot)) throw m;
    return SR({
      projectPath: i,
      indexReady: !1,
      indexBuilding: l,
      writer: c,
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
  let { indexPath: u, database: f } = d;
  try {
    let m = f.prepare("SELECT schema_version, indexed_at FROM projects WHERE id = 1").get(),
      y = f
        .prepare(
          `SELECT mode, discovered_file_count, diagnostic_count
               FROM rebuild_summary
               WHERE project_id = 1`,
        )
        .get(),
      g = await Zl(i, f),
      h = ec(g, s),
      b = [...h.createdPaths, ...h.modifiedPaths].slice(0, s);
    return SR({
      projectPath: i,
      indexReady: !0,
      indexBuilding: l,
      writer: c,
      publishedIndexPath: u,
      schemaVersion: m?.schema_version ?? null,
      indexedAt: m?.indexed_at ?? null,
      lastMode: y?.mode ?? null,
      discoveredFileCount: y?.discovered_file_count ?? null,
      diagnosticCount: y?.diagnostic_count ?? null,
      reconcile: h,
      pendingSyncPaths: b,
      watcherPendingPaths: [],
      watcherIndexing: !1,
      pendingEntries: [],
    });
  } finally {
    f.close();
  }
}
var Ue = "sqlite",
  _R = [
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
var Xm = class extends Error {
  constructor(n, r, i = "Unity Insight SQLite query service is not implemented yet.") {
    super(i);
    this.backend = n;
    this.methodName = r;
    this.name = "UnityInsightQueryServiceNotReadyError";
  }
  backend;
  methodName;
};
function nt(e, t, n) {
  return async () => {
    throw new Xm(e, t, `${n} (${String(t)})`);
  };
}
function sc(e = "Unity Insight SQLite query service is not implemented yet.") {
  return {
    backend: Ue,
    withQuerySession: async (t) => t(),
    dispose: () => {},
    warmupProjectIndex: async () => !1,
    refreshProjectIndexGeneration: async () => !1,
    queryProjectIndex: nt(Ue, "queryProjectIndex", e),
    queryVfsEntry: nt(Ue, "queryVfsEntry", e),
    queryVfsChildren: nt(Ue, "queryVfsChildren", e),
    queryVfsEntrySummaries: nt(Ue, "queryVfsEntrySummaries", e),
    queryVfsGlob: nt(Ue, "queryVfsGlob", e),
    queryVfsEntryContent: nt(Ue, "queryVfsEntryContent", e),
    queryVfsEntryContentBatch: nt(Ue, "queryVfsEntryContentBatch", e),
    queryVfsEntryMetaContent: nt(Ue, "queryVfsEntryMetaContent", e),
    queryVfsContent: nt(Ue, "queryVfsContent", e),
    queryVfsSearch: nt(Ue, "queryVfsSearch", e),
    querySemanticVfsRefs: nt(Ue, "querySemanticVfsRefs", e),
    queryOwningGameObject: nt(Ue, "queryOwningGameObject", e),
    queryGuidToProjectRelPath: nt(Ue, "queryGuidToProjectRelPath", e),
    queryIndexStatus: nt(Ue, "queryIndexStatus", e),
    formatVfsReadContent: nt(Ue, "formatVfsReadContent", e),
    formatVfsReadMetaContent: nt(Ue, "formatVfsReadMetaContent", e),
  };
}
import { AsyncLocalStorage as zB } from "node:async_hooks";
import { statSync as HB } from "node:fs";
import YR from "node:path";
var nn = [
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
function ER(e) {
  return { sql: "entry.entry_kind = ?", params: [e] };
}
function K1(e) {
  return e.length === 0
    ? { sql: "1 = 0", params: [] }
    : { sql: `entry.entry_kind IN (${e.map(() => "?").join(", ")})`, params: [...e] };
}
function W1(e, t) {
  let n = e.length === 1 ? ER(e[0]) : K1(e);
  return t.length === 0
    ? n
    : t.length === 1
      ? {
          sql: `(${n.sql} OR (entry.entry_type = 'file' AND lower(entry.vfs_path) LIKE ?))`,
          params: [...n.params, `%${t[0]}`],
        }
      : {
          sql: `(${n.sql} OR (entry.entry_type = 'file' AND (${t.map(() => "lower(entry.vfs_path) LIKE ?").join(" OR ")})))`,
          params: [...n.params, ...t.map((r) => `%${r}`)],
        };
}
function Y1(e) {
  return { sql: "entry.entry_type = ?", params: [e] };
}
var q1 = [
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
function z1(e) {
  return [...(e.fileKinds ?? []), ...(e.additionalEntryKinds ?? [])];
}
function H1(e) {
  return e.entryType ? Y1(e.entryType) : W1(z1(e), e.fileExtensions ?? []);
}
function Q1(e) {
  return [...new Set((e.fileKinds ?? []).map(xl))];
}
function oc(e) {
  return (e ?? "").trim().toLowerCase();
}
function Jm(e) {
  let t = oc(e);
  return q1.find((n) => n.filters.some((r) => r.toLowerCase() === t));
}
function Cr(e) {
  let t = oc(e);
  return nn.find((n) => n.toLowerCase() === t) ?? null;
}
function RR(e) {
  let t = Cr(e);
  if (!t || t === "ALL") return [];
  let n = Jm(t);
  return n ? n.filters : [t];
}
function yo(e, t) {
  let n = oc(e);
  if (!n) return !1;
  let r = RR(t);
  return r.length === 0 ? !0 : r.some((i) => i.toLowerCase() === n);
}
function wR(e, t) {
  return RR(t).length === 0 ? !0 : e.some((r) => yo(r, t));
}
function Zm(e) {
  let t = oc(e);
  if (!t || t === "all") return null;
  let n = Jm(t);
  return n ? H1(n) : t === "asset" ? null : ER(t);
}
function PR(e) {
  let t = Zm(e);
  if (!t) return null;
  let n = Jm(e),
    r = n ? Q1(n) : [];
  return r.length === 0
    ? t
    : { sql: `(${t.sql} OR entry.file_family IN (${r.map(() => "?").join(", ")}))`, params: [...t.params, ...r] };
}
import { randomUUID as bB } from "node:crypto";
var ji = nn.map((e) => `\`${e}\``).join(", ");
function ac() {
  return [...nn];
}
var lc = [
    {
      name: "vfs_ls",
      displayName: "VFS LS",
      description: `List child VFS entry paths under a virtual path with **size in KB** for every row. \`path\` is a Unity project-relative VFS path, not an absolute filesystem path: use \`Assets/\` for the project asset root, never \`/Users/.../Assets\` or the Unity project directory. **Files** and **virtual nodes** show their own indexed or on-disk size; **directories** show the **recursive sum of all disk files** in that subtree. Canonical paths follow **entry_role**: directories and container nodes (Class, GameObject) end with **\`/\`**; files, leaves, and links do not. Prefab-boundary **\`.SourcePrefab\`** link rows include **\`target_vfs_path\`** (container targets also end with **\`/\`**), and **\`.PrefabOverrides\`** remains visible in listings. Optional \`show_type\` filters returned children using the same enum values as \`vfs_refs.target_type\`: ${ji}. Text files such as \`.csv\`, \`.cs\`, \`.shader\`, and \`.hlsl\` expose a synthetic **\`/.content\`** child that can be read with **\`vfs_read(file:/.content)\`**. Use **\`depth\`** (1\u20135) to widen the listing. Pair with **\`vfs_read\`** on specific paths or with **\`depth\`** on node paths for subtree content.`,
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
            enum: ac(),
            description: `Optional returned child type filter. \`ALL\` or omission disables filtering. Allowed values match \`vfs_refs.target_type\`: ${ji}.`,
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
            enum: ac(),
            description: `Required Unity VFS node type filter. Prefer the most precise concrete type because it is pushed into the graph query and is much faster. Do not use \`ALL\` unless necessary; it searches all supported entries without a type filter and can be slow. Use \`ALL\` only when no concrete type fits. Allowed values: ${ji}.`,
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
            enum: ac(),
            description: `Required Unity VFS type filter applied before content matching. A type that matches a physical file selects that file family; exact node types select only their existing node rule. Prefer the most precise concrete type because it is pushed into the graph query and is much faster. Do not use \`ALL\` unless necessary; it searches all supported entries without a type filter and can be slow. Allowed values: ${ji}. Enum declarations are indexed as Class-kind nodes.`,
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
      description: `Query related VFS entries for a target path. **No \`mode\` argument**\u2014behavior is inferred from **\`path\`**: paths ending in **\`.cs\`** return Unity Component -> ScriptClass bindings (always **incoming**; \`direction\` is ignored); script class paths such as **\`Foo.cs:/Foo/\`** and method paths such as **\`Foo.cs:/Foo/Bar.fn\`** return call relationships (\`direction\` **\`in\`** or **\`out\`**, default **\`out\`**); all other paths return general reference relationships (\`direction\` default **\`out\`**). For ordinary file/assets with \`direction: in\`, results union Component \`DEPENDS_ON\` chains, direct incoming \`DEPENDS_ON\` (e.g. Scene\u2192Model), and for **Model** files also \`INSTANCE_OF\`, \`RENDERS_MESH\`, and \`PREFAB_INSTANCE_GUID\` edges. Optional \`target_type\` narrows the returned side only: \`direction: in\` filters referencing sources, \`direction: out\` filters referenced targets. Allowed \`target_type\` values: ${ji}. Omit \`target_type\` or use \`ALL\` for unfiltered results. For Scene, Prefab, and GameObject paths, reference queries inspect Component leaves under that scope. Text output groups file-internal results only by Unity file (\`.unity\`, \`.prefab\`, \`.cs\`, \`.asset\`); each \`- /...\` row below the file header is a complete concrete returned path, not an additional shared-prefix tree.`,
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
            enum: ac(),
            description: `Optional returned-side type filter. \`ALL\` or omission disables type filtering. Allowed values: ${ji}.`,
          },
        },
        required: ["path"],
        additionalProperties: !1,
        $schema: "http://json-schema.org/draft-07/schema#",
      },
      defaultEnabled: !0,
    },
  ],
  J9 = lc.map((e) => e.name);
function vR(e) {
  let t = lc.find((n) => n.name === e);
  if (!t) throw new Error(`Unknown Unity Insight tool: ${e}`);
  return t;
}
function X1(e, t) {
  let n = e.startsWith("/") ? e : `/${e}`;
  return ar(n, { nodeType: t.nodeType, entryRole: t.entryRole, entryType: "node" });
}
function J1(e) {
  return e.entryType
    ? e.entryType
    : e.backingKind === "fs_directory" || e.relativePath.endsWith("/")
      ? "directory"
      : e.backingKind === "fs_file"
        ? "file"
        : e.relativePath.includes(":/")
          ? "node"
          : "file";
}
function Z1(e) {
  switch (e) {
    case "directory":
      return "fs_directory";
    case "file":
      return "fs_file";
    case "node":
    case "link":
      return "virtual";
    default:
      return "fs_file";
  }
}
function ey(e) {
  let t = ar(e.relativePath, { nodeType: e.nodeType, entryRole: e.entryRole, entryType: e.entryType }),
    n = e.targetVfsPath ? ar(e.targetVfsPath, { entryRole: "container", entryType: "node" }) : "",
    r = n ? `${t} -> ${n}` : t;
  return e.annotation ? `${r} ${e.annotation}` : r;
}
function eB(e) {
  let t = e.indexOf(":/"),
    n = t >= 0 ? e.slice(0, t) : e,
    r = t >= 0 ? e.slice(t + 2) : void 0,
    i = n.split("/").filter(Boolean),
    s = i.map((o, a) => (a === i.length - 1 ? o : `${o}/`));
  if (r !== void 0) {
    let o = s.pop();
    o && s.push(`${o}:/`);
    let a = r.split("/").filter(Boolean);
    s.push(...a.map((l, c) => (c === a.length - 1 ? l : `${l}/`)));
  } else if (e.endsWith("/") && s.length > 0) {
    let o = s.pop();
    o && s.push(o.endsWith("/") ? o : `${o}/`);
  }
  return s;
}
function po(e) {
  return e
    .map((t) => (typeof t == "string" ? { relativePath: t } : t))
    .filter((t) => typeof t.relativePath == "string" && t.relativePath.length > 0)
    .map((t) => {
      let {
          relativePath: n,
          backingKind: r,
          nodeType: i,
          entryRole: s,
          sizeKb: o,
          childCount: a,
          targetVfsPath: l,
        } = t,
        c = J1(t);
      return {
        relativePath: n,
        segments: eB(n),
        entryType: c,
        backingKind: r ?? Z1(c),
        ...(s ? { entryRole: s } : {}),
        ...(i ? { nodeType: i } : {}),
        ...(o !== void 0 ? { sizeKb: o } : {}),
        ...(a !== void 0 ? { childCount: a } : {}),
        ...(l ? { targetVfsPath: l } : {}),
        ...(typeof t.annotation == "string" && t.annotation.length > 0 ? { annotation: t.annotation } : {}),
      };
    })
    .sort((t, n) => t.relativePath.localeCompare(n.relativePath));
}
function TR(e, t) {
  return e.length > 0
    ? e.map((n) => `- ${n}`).join(`
`)
    : t;
}
function tB(e) {
  return e.childCount !== void 0
    ? String(e.childCount).padStart(8)
    : e.sizeKb !== void 0
      ? String(e.sizeKb).padStart(8)
      : "-".padStart(8);
}
function cc(e, t) {
  return `${tB(e)}  ${t}`;
}
function ty(e, t) {
  return e.length > 0
    ? e.map((n) => cc(n, `- ${ey(n)}`)).join(`
`)
    : t;
}
function xR(e) {
  let t = e.indexOf(":/");
  return t < 0 ? null : e.slice(0, t);
}
function nB(e) {
  let t = new Map();
  for (let i of e) {
    let s = xR(i.relativePath);
    if (!s) continue;
    let o = t.get(s) ?? [];
    (o.push(i), t.set(s, o));
  }
  let n = new Set(t.keys());
  return { flatEntries: e.filter((i) => !(xR(i.relativePath) || n.has(i.relativePath))), fileGroups: t };
}
function ny(e) {
  if (e.length === 0) return "No matches found.";
  let { flatEntries: t, fileGroups: n } = nB(e);
  if (n.size === 0)
    return e.map((i) => cc(i, `- ${ey(i)}`)).join(`
`);
  let r = [];
  for (let i of t) r.push(cc(i, `- ${ey(i)}`));
  for (let i of [...n.keys()].sort((s, o) => s.localeCompare(o))) {
    let o = (n.get(i) ?? [])
      .map((a) => ({
        entry: a,
        suffix: (() => {
          let l = a.relativePath.slice(i.length + 1),
            c = X1(l, { nodeType: a.nodeType, entryRole: a.entryRole }),
            d = a.targetVfsPath ? `${c} -> ${ar(a.targetVfsPath, { entryRole: "container", entryType: "node" })}` : c;
          return a.annotation ? `${d} ${a.annotation}` : d;
        })(),
      }))
      .sort((a, l) => a.suffix.localeCompare(l.suffix));
    (r.length > 0 && r.push(""), r.push(`File: ${i}`));
    for (let a of o) r.push(cc(a.entry, `- ${a.suffix}`));
  }
  return r.join(`
`);
}
var NR = !1;
function pe(e) {
  return typeof e == "string" ? e : "";
}
function rB(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : 0;
}
function Mr(e) {
  return Array.isArray(e) ? e.filter((t) => typeof t == "object" && t !== null) : [];
}
function rn(e) {
  return e.endsWith(".") ? e.slice(0, -1) : e;
}
function UR(e) {
  return e
    .replace(/\.?\s*Scanned\s+\d+\s+rows\.?/gi, ".")
    .replace(/\.?\s*Scanned\s+rows:\s*\d+\.?/gi, ".")
    .replace(/\.\s*\./g, ".")
    .replace(/^\.+\s*/, "")
    .replace(/\s+$/, "");
}
function AR(e) {
  return e === "flat" ? "flat" : "grouped_list";
}
function LR(e) {
  return e.some((t) => t.childCount !== void 0) ? "SIZE/ENTRIES  PATH" : "SIZE_KB  PATH";
}
function OR(e) {
  return e === "fs_directory" || e === "fs_file" || e === "virtual" ? e : void 0;
}
function CR(e) {
  return e === "directory" || e === "file" || e === "node" || e === "link" ? e : void 0;
}
function iy(e) {
  return e === "directory" || e === "file" || e === "node" || e === "link" ? e : void 0;
}
function Tn(e, t = {}) {
  if (!e) return e;
  let n = t.nodeType || t.type,
    r = iy(t.entryType),
    i = OR(t.backingKind);
  return ar(e, { ...(n ? { nodeType: n } : {}), ...(r ? { entryType: r } : {}), ...(i ? { backingKind: i } : {}) });
}
function MR(e, t = {}) {
  let n = [];
  for (let r of Mr(e)) {
    let i = pe(r.relativePath);
    if (!i) continue;
    let s = OR(r.backingKind),
      o = CR(r.entryType),
      a = pe(r.entryRole),
      l = pe(r.nodeType),
      c = typeof r.sizeKb == "number" ? r.sizeKb : void 0,
      d = typeof r.childCount == "number" ? r.childCount : void 0,
      u = pe(r.targetVfsPath),
      f = pe(r.projectionKind),
      m = FR(pe(r.sourceVfsPath), { nodeType: l }),
      y = pe(r.annotation) || iB(f, m, { includeSource: t.includeProjectionSourceInAnnotation });
    n.push({
      relativePath: i,
      ...(o ? { entryType: o } : {}),
      ...(a ? { entryRole: a } : {}),
      ...(s ? { backingKind: s } : {}),
      ...(l ? { nodeType: l } : {}),
      ...(c !== void 0 ? { sizeKb: c } : {}),
      ...(d !== void 0 ? { childCount: d } : {}),
      ...(u ? { targetVfsPath: u } : {}),
      ...(y ? { annotation: y } : {}),
    });
  }
  return n;
}
function Fr(e) {
  return pe(e) === "prefab_inherited";
}
function FR(e, t = {}) {
  return e ? Tn(e, { entryType: "node", ...(t.nodeType ? { nodeType: t.nodeType } : {}) }) : "";
}
function iB(e, t, n = {}) {
  if (!NR || !Fr(e)) return "";
  let r = ["prefab inherited"];
  return (n.includeSource && t && r.push(`source: ${t}`), `[${r.join(", ")}]`);
}
function DR(e) {
  return NR && e
    ? "Note: entries marked [prefab inherited] come from the source prefab and are shown here for navigation."
    : "";
}
function jR(e) {
  let t = pe(e.type);
  return FR(pe(e.source_vfs_path), { nodeType: t });
}
function ry(e, t) {
  let n = jR(e);
  return n ? [t, n] : [];
}
function kR(e) {
  return `Read projected content for '${e}'.`;
}
function sB(e, t, n, r) {
  return `Found ${t} ${n} ${r} for projected path '${e}'.`;
}
function oB(e) {
  return e.includes("final scene-resolved value")
    ? e
    : "Note: this is inherited prefab content projected into the scene path; returned content is from the source prefab, not the final scene-resolved value.";
}
function aB(e) {
  return e.includes("final scene-resolved value")
    ? e
    : "Note: this is inherited prefab content projected into the scene path; returned references are resolved from the source prefab node, not the final scene-resolved value.";
}
function lB(e) {
  let t = [],
    n = jR(e);
  return (n && t.push(`Source VFS path: ${n}`), t);
}
function cB(e) {
  let t = Array.isArray(e.data.entries) ? e.data.entries.filter((l) => typeof l == "string") : [],
    n = MR(e.data.grouped_entries, { includeProjectionSourceInAnnotation: !0 }),
    r = AR(e.data.output_format),
    i = n.length > 0 ? po(n) : po(t),
    s = r === "grouped_list" ? ny(i) : ty(i, "No matches found."),
    o = LR(i),
    a = DR(Mr(e.data.grouped_entries).some((l) => Fr(l.projectionKind)));
  return {
    llmContent:
      `${rn(e.summary)}

${o}

${s}` +
      (a
        ? `

${a}`
        : ""),
    returnDisplay: `Listed ${t.length} entries`,
  };
}
function dB(e) {
  let t = AR(e.data.output_format),
    n = Mr(e.data.nodes),
    r = n.map((f) => pe(f.vfs_path)).filter((f) => f.length > 0),
    i = Mr(e.data.grouped_entries),
    s = MR(i, { includeProjectionSourceInAnnotation: !0 }),
    o = n
      .map((f) => {
        let m = pe(f.vfs_path);
        if (!m) return null;
        let y = CR(f.entry_type),
          g = pe(f.type),
          h = pe(f.target_vfs_path),
          b = typeof f.size_kb == "number" ? f.size_kb : void 0,
          S = typeof f.child_count == "number" ? f.child_count : void 0;
        return {
          relativePath: m,
          ...(y ? { entryType: y } : {}),
          ...(g ? { nodeType: g } : {}),
          ...(b !== void 0 ? { sizeKb: b } : {}),
          ...(S !== void 0 ? { childCount: S } : {}),
          ...(h ? { targetVfsPath: h } : {}),
        };
      })
      .filter((f) => f !== null),
    a = s.length > 0 ? po(s) : po(o.length > 0 ? o : r),
    l = t === "grouped_list" ? ny(a) : a.length > 0 ? ty(a, "No matches found.") : TR(r, "No matches found."),
    c = UR(e.summary),
    d =
      a.length > 0
        ? `${LR(a)}

`
        : "",
    u = DR(i.some((f) => Fr(f.projectionKind)) || n.some((f) => Fr(f.projection_kind)));
  return {
    llmContent:
      `${rn(c)}

${d}${l}` +
      (u
        ? `

${u}`
        : ""),
    returnDisplay: `Matched ${r.length} VFS entries`,
  };
}
function uB(e) {
  let t = pe(e.data.path),
    n = pe(e.data.type),
    r = iy(e.data.entry_type),
    i = Tn(t, { nodeType: n, entryType: r }),
    s = pe(e.data.kind),
    o = e.data.content,
    a = Fr(e.data.projection_kind),
    l = lB(e.data),
    c = pe(e.data.warning),
    d = oB(c);
  if (s === "content_tree" && typeof o == "string") {
    let y = Mr(e.data.children)
        .map((h) => {
          let b = pe(h.path),
            S = pe(h.content);
          return !b || !S
            ? ""
            : `=== ${Tn(b, { nodeType: pe(h.type), entryType: "node" })} ===
${S}`;
        })
        .filter((h) => h.length > 0),
      g = o;
    if (
      (y.length > 0 &&
        (g = `${o}

${y.join(`

`)}`),
      a)
    ) {
      let h = kR(i),
        b = ry(e.data, "Actual content read from source prefab path:");
      return {
        llmContent: [h, "", ...b, d, "", g].join(`
`),
        returnDisplay: `Read ${i}`,
      };
    }
    return { llmContent: g, returnDisplay: `Read ${i}` };
  }
  if (typeof o == "string") {
    if (s === "meta") {
      let m = pe(e.data.meta_path),
        y = pe(e.data.type);
      return {
        llmContent:
          `${rn(e.summary)}

Path: ${i}
Kind: meta
Type: ${y}
Meta: ${m}

` + o,
        returnDisplay: `Read meta ${i}`,
      };
    }
    if (a) {
      let m = kR(i),
        y = ry(e.data, "Actual content read from source prefab path:");
      return {
        llmContent: [m, "", ...y, d, "", o].join(`
`),
        returnDisplay: `Read ${i}`,
      };
    }
    return { llmContent: o, returnDisplay: `Read ${i}` };
  }
  let u = pe(e.data.type);
  if (pe(e.data.entry_type) === "link") {
    let m = pe(e.data.link_kind),
      y = pe(e.data.target_vfs_path),
      g = pe(e.data.target_type),
      h = y ? Tn(y, { nodeType: g, entryType: "node" }) : "[target unavailable]",
      b = y
        ? "Next step: call vfs_read on the Target path to inspect the source prefab."
        : "Next step: the link target is unavailable; inspect the current boundary or graph data.";
    return {
      llmContent: `${rn(e.summary)}

Path: ${i}
Kind: ${s || "link"}
Type: ${u}
Entry type: link
${
  m
    ? `Link kind: ${m}
`
    : ""
}${
        l.length > 0
          ? `${l.join(`
`)}
`
          : ""
      }${
        c
          ? `${c}
`
          : ""
      }Target: ${h}

${b}`,
      returnDisplay: `Read link ${i}`,
    };
  }
  return { llmContent: rn(e.summary), returnDisplay: i ? `Read ${i}` : rn(e.summary) };
}
function fB(e) {
  let t = Mr(e.data.matches),
    n = new Map();
  for (let s of t) {
    let o = pe(s.vfs_path);
    if (!o) continue;
    let a = n.get(o) ?? { type: pe(s.type), rows: [] };
    (a.rows.push({ line: rB(s.line), text: pe(s.text) }), n.set(o, a));
  }
  let r = `No matches found.
---`;
  n.size > 0 &&
    (r = Array.from(n.entries()).map(([s, o]) => {
      let a = Tn(s, { nodeType: o.type, entryType: "node" }),
        l = o.type
          ? `Type: ${o.type}
`
          : "",
        c = o.rows.map((d) => d.text).join(`
`);
      return `File: ${a}
${l}${c}
---`;
    }).join(`
`));
  let i = UR(e.summary);
  return {
    llmContent: `${rn(i)}
---
${r}`,
    returnDisplay: `Found ${t.length} matches`,
  };
}
var mB = [".unity", ".prefab", ".cs", ".asset"],
  yB = [".anim", ".controller", ".mat"];
function pB(e) {
  let t = e.toLowerCase();
  return yB.some((n) => t.endsWith(n));
}
function gB(e) {
  let t = e.replace(/\\/g, "/").trim(),
    n = t.indexOf(":/");
  if (n >= 0) {
    let a = t.slice(n + 1);
    return { filePath: t.slice(0, n), suffix: a.startsWith("/") ? a : `/${a}` };
  }
  let r = t.toLowerCase(),
    i = -1,
    s = "";
  for (let a of mB) {
    let l = r.indexOf(a);
    l < 0 || t[l + a.length] !== "/" || ((i < 0 || l < i) && ((i = l), (s = a)));
  }
  if (i < 0) return null;
  let o = i + s.length;
  return { filePath: t.slice(0, o), suffix: t.slice(o) || "/" };
}
function hB(e) {
  let t = new Set(),
    n = new Map();
  for (let i of e) {
    if (!i.path) continue;
    let s = gB(i.path);
    if (!s) {
      t.add(Tn(i.path, { nodeType: i.nodeType }));
      continue;
    }
    if (pB(s.filePath)) {
      t.add(Tn(s.filePath, { nodeType: i.nodeType }));
      continue;
    }
    let o = n.get(s.filePath) ?? new Set();
    (o.add(Tn(s.suffix, { nodeType: i.nodeType, entryType: "node" })), n.set(s.filePath, o));
  }
  for (let i of n.keys())
    for (let s of [...t]) {
      let o = s.replace(/\/$/, ""),
        a = i.replace(/\/$/, "");
      o === a && t.delete(s);
    }
  let r = [...t].sort().map((i) => `- ${i}`);
  for (let i of [...n.keys()].sort((s, o) => s.localeCompare(o)))
    (r.length > 0 && r.push(""), r.push(i), r.push(...[...n.get(i)].sort().map((s) => `  - ${s}`)));
  return r.join(`
`);
}
function IB(e, t) {
  let n = Mr(e.data[t === "VFS references" ? "refs" : "calls"]),
    r = e.summary.includes("incoming") ? "incoming" : "outgoing",
    i =
      n.length > 0
        ? hB(
            n.map((m) => {
              let y = pe(m.from),
                g = pe(m.to),
                h = pe(m.fromType),
                b = pe(m.toType);
              return r === "incoming" ? { path: y || g, nodeType: h || b } : { path: g || y, nodeType: b || h };
            }),
          )
        : `No ${t} found.`,
    s = [],
    o = pe(e.data.path),
    a = pe(e.data.type),
    l = iy(e.data.entry_type),
    c = Tn(o, { nodeType: a, entryType: l }),
    d = Fr(e.data.projection_kind);
  Fr(e.data.projection_kind) && s.push(...ry(e.data, "Actual references resolved from source prefab path:"));
  let u = d ? sB(c, n.length, r, t) : rn(e.summary),
    f = d ? aB(pe(e.data.warning)) : "";
  return {
    llmContent: `${u}

${
  s.length > 0
    ? `${s.join(`
`)}
`
    : ""
}${
      f
        ? `${f}

`
        : s.length > 0
          ? `
`
          : ""
    }${i}`,
    returnDisplay: `Found ${n.length} ${r} ${t}`,
  };
}
function BR(e, t) {
  switch (t) {
    case "vfs_ls":
      return cB(e);
    case "vfs_glob":
      return dB(e);
    case "vfs_read":
      return uB(e);
    case "vfs_grep":
      return fB(e);
    case "vfs_refs":
      return IB(e, e.data.mode === "call" ? "calls" : "VFS references");
    default:
      return { llmContent: rn(e.summary), returnDisplay: rn(e.summary) };
  }
}
function sy(e, t) {
  return e.status === "error"
    ? { llmContent: e.summary, returnDisplay: e.summary, error: { code: e.error.code, message: e.error.message } }
    : t
      ? BR(e, t)
      : { llmContent: e.summary, returnDisplay: e.summary };
}
var ye = class extends Error {
  constructor(n, r, i = "Unity Insight local execution failed.") {
    super(r);
    this.code = n;
    this.summary = i;
    this.name = "LocalUnityInsightToolError";
  }
  code;
  summary;
};
function VR(e) {
  return `local-${e}-${bB()}`;
}
function SB(e, t, n) {
  let r = { request_id: VR(e), status: "ok", data: n.data, summary: n.summary, elapsed_ms: Date.now() - t };
  return sy(r, e);
}
function _B(e, t) {
  let n = t instanceof ye ? t : new ye("LOCAL_EXECUTION_FAILED", t instanceof Error ? t.message : String(t)),
    r = { request_id: VR(e), status: "error", error: { code: n.code, message: n.message }, summary: n.summary };
  return sy(r, e);
}
function $R(e, t) {
  let n = vR(e);
  return {
    name: n.name,
    displayName: n.displayName,
    description: n.description,
    parameterSchema: n.parameterSchema,
    execute: async (r) => {
      let i = Date.now();
      try {
        return SB(e, i, await t(r));
      } catch (s) {
        return _B(e, s);
      }
    },
  };
}
var RB = Oo(Ys(), 1);
import { access as EB, readdir as f5, readFile as m5 } from "node:fs/promises";
import GR from "node:path";
function oy(e) {
  let t = e?.trim();
  return t ? GR.resolve(t) : GR.resolve(process.cwd());
}
async function KR(e) {
  let t = oy(e);
  try {
    await EB(t);
  } catch {
    throw new ye("PROJECT_PATH_NOT_FOUND", `Unity project path does not exist: ${t}`, "Unity project path not found.");
  }
  return t;
}
function wB(e, t) {
  let n = e[t];
  if (typeof n != "string") return;
  let r = n.trim();
  return r.length > 0 ? r : void 0;
}
function PB(e) {
  if (e?.queryService) return e.queryService;
  throw new ye(
    "QUERY_SERVICE_REQUIRED",
    "Unity Insight SQLite query access is required for local execution.",
    "Unity Insight SQLite query access required.",
  );
}
function sn(e, t, n) {
  return $R(e, async (r) => {
    let i = PB(t),
      s = await KR(t?.projectPath ?? wB(r, "project_path"));
    return i.withQuerySession(() => n(r, i, s));
  });
}
var WR = nn,
  vB = 100,
  xB = 1e4;
function Ae(e) {
  return typeof e == "string" ? e : "";
}
function go(e) {
  if (typeof e == "number" && Number.isFinite(e)) return Math.trunc(e);
  if (typeof e == "string" && e.trim().length > 0) {
    let t = Number.parseInt(e, 10);
    if (Number.isFinite(t)) return t;
  }
  return 0;
}
function dc(e) {
  let t = go(e);
  return t <= 0 ? vB : Math.min(t, xB);
}
function uc(e, t) {
  let n = Ae(e).trim();
  if (!n)
    throw new ye("INVALID_REQUEST", `type is required and must be one of ${WR.join(", ")}.`, `Invalid ${t} request.`);
  let r = Cr(n);
  if (r) return r === "ALL" ? "" : r;
  throw new ye("INVALID_REQUEST", `type must be one of ${WR.join(", ")}.`, `Invalid ${t} request.`);
}
function fc(e) {
  let t = typeof e == "string" ? e.trim() : "";
  return t === "flat" ? t : "grouped_list";
}
function Tt(e) {
  return e <= 0 ? 0 : Math.max(1, Math.ceil(e / 1024));
}
function mc(e, t) {
  return t.includes(":/") ? !0 : dt(e) === "node";
}
function yc(e, t) {
  let n = dt(t) || void 0,
    r = Xr({ entryRole: t.entryRole, entryType: t.entryType, labels: t.labels });
  return {
    relativePath: e,
    backingKind: TB(t),
    entryType: n,
    entryRole: r,
    ...(n === "node" ? { nodeType: ly(t.labels) } : {}),
    ...(t.targetVfsPath ? { targetVfsPath: ve(t.targetVfsPath, "container") } : {}),
    ...(t.projectionKind ? { projectionKind: t.projectionKind } : {}),
    ...(t.sourceVfsPath ? { sourceVfsPath: t.sourceVfsPath } : {}),
    ...(t.sourceOwnerVfsPath ? { sourceOwnerVfsPath: t.sourceOwnerVfsPath } : {}),
    ...(t.instanceRootVfsPath ? { instanceRootVfsPath: t.instanceRootVfsPath } : {}),
  };
}
function Bi(e) {
  let t = e.trim();
  if (!t || t === ".") return 0;
  let n = t.indexOf(":/");
  if (n >= 0) {
    let r = t.slice(0, n),
      i = t.slice(n + 2);
    return r.split("/").filter(Boolean).length + i.split("/").filter(Boolean).length;
  }
  return t.split("/").filter(Boolean).length;
}
function qR(e) {
  return e.projectionKind === "prefab_inherited" || e.labels.includes("VfsProjection");
}
function Ze(e) {
  let t = e.replace(/\\/g, "/").trim();
  return t.length > 1 && t.endsWith("/") ? t.replace(/\/+$/, "") : t;
}
function ay(e) {
  return e.length > 0 ? e.split(/\r?\n/) : [];
}
function dt(e) {
  return e.entryType
    ? e.entryType
    : e.labels.includes("VfsLink") || (e.targetVfsPath ?? "").trim().length > 0
      ? "link"
      : e.labels.includes("Directory")
        ? "directory"
        : e.sourcePath.trim().length > 0 && !e.path.includes(":/")
          ? "file"
          : e.path.includes(":/")
            ? "node"
            : "";
}
function TB(e) {
  let t = dt(e);
  return t === "directory" ? "fs_directory" : t === "file" ? "fs_file" : "virtual";
}
function zR(e) {
  let t = Ze(e);
  return !t || t === "/" ? "" : t.includes(":/") ? `${t}/` : YR.posix.extname(t) ? `${t}:/` : `${t}/`;
}
function ly(e) {
  if (e.includes("Enum")) return "Class";
  let t = [
    "VfsLink",
    "PrefabOverrides",
    "FileContent",
    "GameObject",
    "Component",
    "Class",
    "Method",
    "Property",
    "Script",
    "Scene",
    "SceneSettings",
    "Prefab",
    "PrefabVariant",
    "ScriptableObject",
    "ScriptableObjectSubAsset",
    "Texture",
    "Sprite",
    "Mesh",
    "Model",
    "AudioClip",
    "Material",
    "ShaderGraphProperties",
    "ShaderGraphSettings",
    "ShaderGraphNode",
    "ShaderGraph",
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
    "Reference",
    "Call",
    "Asset",
    "Directory",
  ];
  for (let n of t) if (e.includes(n)) return n;
  return e[0] ?? "Entry";
}
function on(e) {
  let t = Xr({ entryRole: e.entryRole, entryType: e.entryType, labels: e.labels });
  return ve(e.path, t);
}
function Vi(e) {
  return on(e);
}
function kB(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function NB(e, t) {
  if (e[t] !== "[") return null;
  let n = e.indexOf("]", t + 1);
  if (n <= t + 1) return null;
  let i = e.slice(t + 1, n);
  return (i[0] === "!" && (i = `^${i.slice(1)}`), (i = i.replace(/\\/g, "\\\\")), { regex: `[${i}]`, nextIndex: n });
}
function UB(e) {
  if (typeof e == "boolean") return e;
  if (e == null) return;
  let t = Ae(e).trim().toLowerCase();
  if (t === "true") return !0;
  if (t === "false") return !1;
}
function pc(e, t = !1) {
  return e == null ? t : UB(e);
}
function Dr(e, t = !0) {
  let n = e.trim(),
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
      let o = NB(n, i);
      if (o) {
        ((r += o.regex), (i = o.nextIndex));
        continue;
      }
    }
    r += kB(s);
  }
  return new RegExp(`^${r}$`, t ? "i" : "");
}
function kn(e, t = !0) {
  let n = e.trim().replace(/:\*\*\//g, ":/**/");
  return t ? n.toLowerCase() : n;
}
function cy(e) {
  return e.includes(":/") ? e.replace(":/", "/") : e;
}
function $i(e) {
  let t = new Set();
  for (let n of e) n && (t.add(n), t.add(cy(n)));
  return [...t];
}
function gc(e) {
  let t = Ze(e);
  return !t || t === "/" ? "" : t.includes(":/") || YR.posix.extname(t) || t.endsWith("/") ? t : `${t}/`;
}
function jr(e, t, n) {
  let r = ve(n),
    i = ve(e),
    s = bp(t);
  return !i && !t ? r : r === i ? "." : s && r.startsWith(s) ? r.slice(s.length).replace(/^\//, "") : r;
}
import BB from "node:path";
import AB from "node:path";
function hc(e) {
  return (e ?? "").trim().toLowerCase();
}
function LB(e) {
  if (e.entryType === "directory") return "directory";
  if (e.entryType === "link") return "leaf";
  switch (hc(e.entryKind)) {
    case "class":
    case "enum":
    case "interface":
    case "struct":
    case "namespace":
    case "gameobject":
    case "texture":
    case "sprite":
      return e.entryType === "node" ? "container" : void 0;
    default:
      return e.entryType === "node" ? "leaf" : void 0;
  }
}
function HR(e, t) {
  switch (hc(e)) {
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
      return t === "directory" ? ["Directory"] : t === "link" ? ["VfsLink"] : t === "file" ? ["Asset"] : [];
  }
}
function OB(e) {
  if (e.sourceFilePath?.trim()) return e.sourceFilePath;
  let [t] = e.vfsPath.split(":/", 1);
  return t ?? e.vfsPath;
}
function Ke(e, t) {
  let n = hc(e.entryKind),
    r = HR(e.entryKind, e.entryType);
  return (
    e.projectionKind === "prefab_inherited" && r.push("VfsProjection"),
    {
      path: e.vfsPath,
      entryType: e.entryType,
      entryRole: LB(e),
      sourcePath: OB(e),
      content: t?.content ?? "",
      metaContent: t?.metaContent ?? "",
      linkKind: e.entryType === "link" ? n : "",
      targetVfsPath: e.targetVfsPath ?? "",
      name: e.displayName,
      lineStart: e.lineStart ?? 0,
      lineEnd: e.lineEnd ?? 0,
      labels: r,
      typeKind: n === "enum" ? "enum" : "",
      guid: "",
      importer: "",
      metaPath: "",
      revision: 1,
      size: e.sizeBytes ?? 0,
      signature: "",
      projectionKind: e.projectionKind,
      sourceVfsPath: e.sourceVfsPath,
      sourceOwnerVfsPath: e.sourceOwnerVfsPath,
      instanceRootVfsPath: e.instanceRootVfsPath,
    }
  );
}
function an(e, t, n) {
  let r = HR(e, t);
  if (r.length > 0) return r[0] ?? "Entry";
  if (t === "directory") return "Directory";
  if (t === "link") return "VfsLink";
  if (t === "file") {
    let i = AB.posix.extname(n).toLowerCase();
    return i === ".cs" ? "Script" : i === ".unity" ? "Scene" : i === ".prefab" ? "Prefab" : "Asset";
  }
  return "Entry";
}
function QR(e) {
  switch (hc(e)) {
    case "defined_in":
      return "DEFINED_IN";
    case "binds_to":
      return "BINDS_TO";
    case "calls":
      return "CALL";
    case "instance_of":
      return "INSTANCE_OF";
    case "source_prefab":
      return "SOURCE_PREFAB";
    case "depends_on":
      return "DEPENDS_ON";
    default:
      return e.toUpperCase();
  }
}
function CB(e) {
  let t = Ze(e.path),
    n = dt(e);
  return !t || t === "/" ? "" : n === "file" ? `${t}:/` : `${t}/`;
}
function MB(e) {
  let t = new Set(),
    n = [];
  for (let r of e) {
    let i = [Ze(r.path), r.lineStart, r.signature ?? ""].join("|");
    !i || t.has(i) || (t.add(i), n.push(r));
  }
  return n;
}
function dy(e, t) {
  let n = Ze(e.path),
    r = Ze(t.path);
  if (!n || r === n) return 0;
  if (r.startsWith(`${n}:/`)) {
    let i = r.slice(n.length + 2);
    return Bi(i || ".");
  }
  if (r.startsWith(`${n}/`)) {
    let i = r.slice(n.length + 1);
    return Bi(i || ".");
  }
  return Bi(jr(e.path, CB(e), t.path));
}
function FB(e, t, n) {
  return t.filter((r) => dy(e, r) <= n);
}
async function Ic(e, t, n, r) {
  let i = (await e.queryVfsChildren({ projectPath: t, path: n.path, depth: r })).map((s) => Ke(s));
  return FB(n, MB(i), r);
}
async function JR(e, t, n) {
  let r = n.includes("guid:") ? kl(n) : n;
  if (!r.includes("{guid:")) return r;
  let i = await e.queryGuidToProjectRelPath({ projectPath: t });
  return Ul(r, i);
}
function ZR(e) {
  return e.projectionKind === "prefab_inherited" && (e.sourceVfsPath ?? "").trim().length > 0;
}
function VB(e) {
  return e.labels.includes("FileContent");
}
async function ew(e, t, n) {
  let r = n,
    i = new Set();
  for (; ZR(r);) {
    let s = Ze(r.sourceVfsPath ?? "");
    if (!s) break;
    if (i.has(s))
      throw new ye(
        "INVALID_GRAPH_STATE",
        `Projection source resolution cycle detected for '${n.path}'.`,
        "Projection source resolution failed.",
      );
    i.add(s);
    let o = await e.queryVfsEntryContent({ projectPath: t, path: s });
    if (!o) throw new ye("ENTRY_NOT_FOUND", `No VFS entry found for projection source '${s}'.`, "VFS entry not found.");
    r = Ke(o.entry, { content: o.content });
  }
  return { requestedEntry: n, semanticEntry: r };
}
async function tw(e, t, n, r) {
  let i = n;
  try {
    i = (await ew(e, t, n)).semanticEntry;
  } catch (s) {
    if (!(r?.softProjectionFallback ?? !0)) throw s;
  }
  return JR(e, t, i.content);
}
async function nw(e, t, n) {
  return JR(e, t, n);
}
function $B(e) {
  return e === void 0 ? 0 : Math.max(0, Math.min(go(e) || 0, 5));
}
var XR =
  "The depth parameter cannot be used on non-node paths to read content. Use depth only on file-internal node paths (file:/node/...).";
function GB(e, t, n) {
  if (!(e < 1)) {
    if (n === "link") throw new ye("INVALID_REQUEST", XR, "Invalid vfs_read request.");
    if (!t.includes(":/")) throw new ye("INVALID_REQUEST", XR, "Invalid vfs_read request.");
  }
}
function uy(e) {
  return sn("vfs_read", e, async (t, n, r) => {
    let i = Ae(t.path).trim();
    if (!i) throw new ye("INVALID_REQUEST", "The path argument is required.", "Invalid vfs_read request.");
    let s = $B(t.depth);
    if (t.mode !== void 0)
      throw new ye(
        "INVALID_REQUEST",
        "vfs_read does not accept mode. Use vfs_ls to list structure and vfs_read with file:/.content for full file bodies.",
        "Invalid vfs_read request.",
      );
    if (t.start_byte !== void 0)
      throw new ye(
        "INVALID_REQUEST",
        "vfs_read does not accept start_byte. vfs_read now returns the full indexed content without byte pagination.",
        "Invalid vfs_read request.",
      );
    let o = await n.queryVfsEntry({ projectPath: r, path: i });
    if (!o) throw new ye("ENTRY_NOT_FOUND", `No VFS entry found for '${i}'.`, "VFS entry not found.");
    let a = Ke(o),
      l = on(a),
      c = Vi(a),
      d = an(o.entryKind, o.entryType, o.vfsPath),
      u = dt(a);
    if ((GB(s, i, u), u === "link")) {
      let b = a.targetVfsPath ? await n.queryVfsEntry({ projectPath: r, path: a.targetVfsPath }) : null;
      return {
        data: {
          path: l,
          kind: "content",
          type: d,
          entry_type: "link",
          ...(a.linkKind ? { link_kind: a.linkKind } : {}),
          ...(a.targetVfsPath
            ? {
                target_vfs_path: ve(a.targetVfsPath),
                ...(b ? { target_type: an(b.entryKind, b.entryType, b.vfsPath) } : {}),
              }
            : {}),
        },
        summary: `Read link for '${c}'.`,
      };
    }
    if (mc(a, i)) {
      let b = await n.queryVfsEntryContent({ projectPath: r, path: a.path });
      if (!b) throw new ye("ENTRY_NOT_FOUND", `No VFS entry found for '${i}'.`, "VFS entry not found.");
      let S = Ke(b.entry, { content: b.content }),
        P = await ew(n, r, S),
        I = ZR(S),
        E = await n.formatVfsReadContent({ projectPath: r, entry: b.entry, content: b.content });
      if (s >= 1) {
        let w = await Ic(n, r, a, s),
          T = Ze(a.path),
          x = [];
        for (let K of w.sort((_, L) => _.path.localeCompare(L.path)))
          Ze(K.path) !== T && (dy(a, K) <= 0 || (dt(K) !== "link" && x.push(K)));
        let O =
            x.length > 0
              ? await n.queryVfsEntryContentBatch({ projectPath: r, paths: x.map((K) => K.path) })
              : new Map(),
          F = [];
        for (let K of x) {
          let _ = O.get(K.path);
          if (!_) continue;
          let L = await n.formatVfsReadContent({ projectPath: r, entry: _.entry, content: _.content });
          L.trim() && F.push({ path: on(K), type: ly(K.labels), content: L });
        }
        let Y = I
          ? {
              projection_kind: a.projectionKind,
              source_vfs_path: ve(P.semanticEntry.path, P.semanticEntry.entryRole),
              ...(a.sourceOwnerVfsPath ? { source_owner_vfs_path: a.sourceOwnerVfsPath } : {}),
              ...(a.instanceRootVfsPath ? { instance_root_vfs_path: a.instanceRootVfsPath } : {}),
            }
          : {};
        return {
          data: { path: l, kind: "content_tree", type: d, entry_type: u, content: E, children: F, depth: s, ...Y },
          summary: I
            ? `Read projected content tree for '${c}' (depth=${s}).`
            : `Read content tree for '${c}' (depth=${s}).`,
        };
      }
      return {
        data: {
          path: l,
          kind: "content",
          type: d,
          entry_type: u,
          content: E,
          ...(I
            ? {
                projection_kind: a.projectionKind,
                source_vfs_path: ve(P.semanticEntry.path, P.semanticEntry.entryRole),
                ...(a.sourceOwnerVfsPath ? { source_owner_vfs_path: a.sourceOwnerVfsPath } : {}),
                ...(a.instanceRootVfsPath ? { instance_root_vfs_path: a.instanceRootVfsPath } : {}),
              }
            : {}),
        },
        summary: VB(S)
          ? `Read text content for '${c}'.`
          : I
            ? `Read projected content for '${c}'.`
            : `Read content for '${c}'.`,
      };
    }
    let f = a.sourcePath.trim() || i.replace(/\/+$/, ""),
      m = f.endsWith(".meta") ? f : `${f}.meta`,
      g = (await n.queryVfsEntryMetaContent({ projectPath: r, path: a.path }))?.metaContent?.trim() ?? "";
    if (!g)
      throw new ye("META_NOT_FOUND", `No indexed meta_content found for '${c}'.`, "Unity .meta content not found.");
    let h = await n.formatVfsReadMetaContent({ projectPath: r, metaContent: g });
    return {
      data: {
        path: l,
        kind: "meta",
        type: d,
        entry_type: u,
        meta_path: a.sourcePath.trim().length > 0 ? m : `${BB.posix.normalize(i.replace(/\/+$/, ""))}.meta`,
        content: h,
      },
      summary: `Read meta for '${c}'.`,
    };
  });
}
var rw = ["calls", "binds_to", "depends_on", "instance_of", "refs"];
function iw(e, t) {
  return KB(e, t);
}
function KB(e, t) {
  let n = WB(t.edgeKinds),
    r = n.map(() => "?").join(", "),
    i =
      t.direction === "in"
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
    s = e
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
      .all(1, t.semanticPath, ...n, 1);
  return qB(YB(s));
}
function WB(e) {
  if (!e || e.length === 0) return [...rw];
  let t = e.map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? [...rw] : [...new Set(t)];
}
function YB(e) {
  return e.map((t) => ({
    fromPath: t.from_path,
    toPath: t.to_path,
    fromEntryKind: t.from_entry_kind,
    fromEntryType: t.from_entry_type,
    toEntryKind: t.to_entry_kind,
    toEntryType: t.to_entry_type,
    edgeKind: t.edge_kind,
    edgeSubkind: t.edge_subkind ?? void 0,
    sourceFilePath: t.source_file_path ?? void 0,
    lineStart: t.line_start ?? void 0,
    lineEnd: t.line_end ?? void 0,
  }));
}
function qB(e) {
  let t = new Set();
  return e.filter((n) => {
    let r = [
      n.fromPath,
      n.toPath,
      n.edgeKind,
      n.edgeSubkind ?? "",
      n.sourceFilePath ?? "",
      n.lineStart ?? "",
      n.lineEnd ?? "",
    ].join("\0");
    return t.has(r) ? !1 : (t.add(r), !0);
  });
}
var Vr = Oo(Ys(), 1),
  ho = "[path masked]";
function bc(e) {
  return e
    .replace(/(\b[\w.-]*path\b\s*[:=]\s*)(["'])(.*?)\2/gi, (t, n, r) => `${n}${r}${ho}${r}`)
    .replace(/(\b[\w.-]*path\b\s*[:=]\s*)(?!["'])(?!\s*\[path masked\])([^,\]}]+)/gi, (t, n) => `${n}${ho}`);
}
function Sc(e) {
  return e.length > 0 ? e.split(/\r?\n/) : [];
}
function sw(e) {
  let t = [];
  try {
    let r = (0, Vr.parseAllDocuments)(e, { merge: !0, prettyErrors: !1 });
    for (let i of r)
      (0, Vr.visit)(i, {
        Pair(s, o) {
          let a = o.key,
            l = o.value;
          if (
            !(0, Vr.isScalar)(a) ||
            !(0, Vr.isScalar)(l) ||
            !String(a.value ?? "")
              .toLowerCase()
              .includes("path")
          )
            return;
          let c = l.range;
          c && t.push({ start: c[0], end: c[1] });
        },
      });
  } catch {
    return Sc(e).map((r) => bc(r)).join(`
`);
  }
  let n =
    t.length === 0
      ? e
      : t.sort((r, i) => i.start - r.start).reduce((r, i) => `${r.slice(0, i.start)}${ho}${r.slice(i.end)}`, e);
  return Sc(n).map((r) => bc(r)).join(`
`);
}
var ow = `EXISTS (
                SELECT 1
                FROM vfs_entries child
                WHERE child.project_id = entry.project_id
                  AND child.parent_vfs_path = entry.vfs_path
              ) AS has_children`;
function rr(e) {
  let t = [
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
    (e === "content" || e === "both") && t.push("entry.content"),
    (e === "meta" || e === "both") && t.push("entry.meta_content"),
    t.join(`,
              `)
  );
}
function Gi(e = {}) {
  let t = e.resolveIndexPaths ?? Be,
    n = e.openDatabase ?? Kt,
    r = e.persistentConnections === !0,
    i = new zB(),
    s = new Map(),
    o = new Map(),
    a = new Map(),
    l = new Map(),
    c = new Set(),
    d = new Map();
  function u(_) {
    let L = n(_);
    return (ud(L), L);
  }
  function f(_) {
    if (_) {
      let L = s.get(_);
      if (!L) return;
      try {
        L.database.close();
      } catch {}
      s.delete(_);
      return;
    }
    for (let L of s.values())
      try {
        L.database.close();
      } catch {}
    s.clear();
  }
  function m(_) {
    let L = HB(_).mtimeMs,
      N = s.get(_);
    if (N && N.mtimeMs === L) return N.database;
    if (N) {
      try {
        N.database.close();
      } catch {}
      s.delete(_);
    }
    let j = u(_);
    return (s.set(_, { database: j, mtimeMs: L }), j);
  }
  function y(_, L) {
    let N = _.databasesByIndexPath.get(L);
    if (N) return N;
    let j = u(L);
    return (_.databasesByIndexPath.set(L, j), j);
  }
  function g(_) {
    for (let L of _.databasesByIndexPath.values()) L.close();
    _.databasesByIndexPath.clear();
  }
  async function h(_) {
    if (!c.has(_) || (l.get(_) ?? 0) > 0) return;
    let L = d.get(_);
    if (L) return L;
    let N = (async () => {
      f(_);
      let j = a.get(_);
      if (!j) {
        c.delete(_);
        return;
      }
      (await qo(j, _)).length === 0 && (c.delete(_), a.delete(_));
    })().finally(() => {
      d.delete(_);
    });
    return (d.set(_, N), N);
  }
  function b(_) {
    l.set(_, (l.get(_) ?? 0) + 1);
  }
  async function S(_) {
    let L = Math.max(0, (l.get(_) ?? 0) - 1);
    (L === 0 ? l.delete(_) : l.set(_, L), await h(_));
  }
  function P(_, L, N) {
    a.set(N, L);
    let j = o.get(_);
    (o.set(_, N), j && j !== N && (c.add(j), h(j)));
  }
  function I(_, L) {
    return _
      ? { database: y(_, L), closeAfterCallback: !1 }
      : r
        ? { database: m(L), closeAfterCallback: !1 }
        : { database: u(L), closeAfterCallback: !0 };
  }
  async function E(_, L) {
    let N = t(_),
      j = i.getStore(),
      z = j?.indexPathsByProjectPath.get(_),
      te,
      se;
    if (z) ((te = z), (se = I(j, te)));
    else {
      let ce = !1;
      try {
        let ie = Yo(N, {
          openDatabase(re) {
            let k = I(j, re);
            return ((ce = k.closeAfterCallback), k.database);
          },
        });
        ((te = ie.indexPath), (se = { database: ie.database, closeAfterCallback: ce }));
      } catch (ie) {
        if (ie instanceof Ot) return null;
        throw ie;
      }
      (P(_, N, te), b(te), j?.indexPathsByProjectPath.set(_, te));
    }
    try {
      return await L(se.database, te);
    } finally {
      (se.closeAfterCallback && se.database.close(), j || (await S(te)));
    }
  }
  async function w(_, L, N = "none") {
    let j = await T(_, L.path, N);
    if (j) return j;
    let z = Mo(L.path);
    if (z.length === 0) return null;
    let te = _.prepare(`SELECT ${rr(N)}
       FROM vfs_entries entry
       LEFT JOIN files file
         ON file.id = entry.source_file_id
       WHERE entry.project_id = ?
         AND entry.vfs_path = ?
       LIMIT 1`);
    for (let ce of z) {
      let ie = te.get(1, ce);
      if (ie) return Bt(ie);
    }
    let se = _.prepare(`SELECT ${rr(N)}
       FROM vfs_entries entry
       LEFT JOIN files file
         ON file.id = entry.source_file_id
       WHERE entry.project_id = ?
         AND lower(entry.vfs_path) = lower(?)
       LIMIT 1`);
    for (let ce of z) {
      let ie = se.get(1, ce);
      if (ie) return Bt(ie);
    }
    return x(_, L.path, N);
  }
  async function T(_, L, N) {
    if (!Sp(L)) return null;
    let j = _p(L);
    if (!j) return null;
    let z = _.prepare(
      `SELECT ${rr(N)}
         FROM vfs_entries entry
         LEFT JOIN files file
           ON file.id = entry.source_file_id
         WHERE entry.project_id = ?
           AND entry.vfs_logical_key = ?
         ORDER BY entry.id
         LIMIT 1`,
    ).get(1, j);
    return z ? Bt(z) : null;
  }
  function x(_, L, N) {
    let j = L.replace(/\\/g, "/").trim();
    if (j.indexOf(":/") >= 0) return null;
    let te = j,
      ce =
        _.prepare(
          `SELECT id
         FROM files
         WHERE project_id = ?
           AND project_rel_path = ?
         LIMIT 1`,
        ).get(1, te) ??
        _.prepare(
          `SELECT id
         FROM files
         WHERE project_id = ?
           AND lower(project_rel_path) = lower(?)
         LIMIT 1`,
        ).get(1, te);
    if (!ce) return null;
    let ie = _.prepare(
      `SELECT ${rr(N)}
         FROM vfs_entries entry
         LEFT JOIN files file
           ON file.id = entry.source_file_id
         WHERE entry.project_id = ?
           AND entry.vfs_logical_key = ?
         ORDER BY entry.id
         LIMIT 1`,
    ).get(1, Jr(ce.id));
    return ie ? Bt(ie) : null;
  }
  async function O(_, L) {
    let N = await w(_, L);
    if (!N) return null;
    if (N.entryKind.toLowerCase() === "gameobject") return ln(N);
    let j = _.prepare(
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
    ).get(1, N.vfsPath, 1);
    return j ? ln(Bt(j)) : null;
  }
  function F(_, L) {
    let N = [...new Set(L.paths.map((D) => D.trim()).filter(Boolean))];
    if (N.length === 0) return new Map();
    let j = new Map(),
      z = new Set();
    for (let D of N) {
      let H = Mo(D);
      j.set(D, H);
      for (let ae of H) z.add(ae);
    }
    if (z.size === 0) return new Map();
    let te = [...z],
      se = te.map(() => "?").join(", "),
      ce = _.prepare(
        `SELECT ${rr("none")}
         FROM vfs_entries entry
         LEFT JOIN files file
           ON file.id = entry.source_file_id
         WHERE entry.project_id = ?
           AND entry.vfs_path IN (${se})
         ORDER BY entry.id`,
      )
        .all(1, ...te)
        .map(Bt),
      ie = new Map(ce.map((D) => [D.vfsPath, D])),
      re = new Map(),
      k = new Map();
    for (let D of N) {
      let H = j.get(D) ?? [];
      for (let ae of H) {
        let Q = ie.get(ae);
        if (Q) {
          (k.set(Q.vfsPath, Q), re.set(D, { entry: ln(Q), directChildCount: 0 }));
          break;
        }
      }
    }
    if (k.size === 0) return re;
    let C = [...k.keys()],
      v = C.map(() => "?").join(", "),
      A = _.prepare(
        `SELECT parent_vfs_path AS parentVfsPath,
                COUNT(*) AS directChildCount
         FROM vfs_entries
         WHERE project_id = ?
           AND parent_vfs_path IN (${v})
         GROUP BY parent_vfs_path`,
      ).all(1, ...C),
      M = new Map(A.map((D) => [D.parentVfsPath, D.directChildCount]));
    for (let [D, H] of re) re.set(D, { ...H, directChildCount: M.get(H.entry.vfsPath) ?? 0 });
    return re;
  }
  function Y(_, L) {
    let N = [...new Set(L.paths.map((k) => k.trim()).filter(Boolean))];
    if (N.length === 0) return new Map();
    let j = new Map(),
      z = new Set();
    for (let k of N) {
      let C = Mo(k);
      j.set(k, C);
      for (let v of C) z.add(v);
    }
    if (z.size === 0) return new Map();
    let te = [...z],
      se = te.map(() => "?").join(", "),
      ce = _.prepare(
        `SELECT ${rr("content")}
         FROM vfs_entries entry
         LEFT JOIN files file
           ON file.id = entry.source_file_id
         WHERE entry.project_id = ?
           AND entry.vfs_path IN (${se})
         ORDER BY entry.id`,
      )
        .all(1, ...te)
        .map(Bt),
      ie = new Map(ce.map((k) => [k.vfsPath, k])),
      re = new Map();
    for (let k of N) {
      let C = j.get(k) ?? [];
      for (let v of C) {
        let A = ie.get(v);
        if (A) {
          re.set(k, { entry: ln(A), content: A.content ?? null });
          break;
        }
      }
    }
    return re;
  }
  let K = {
    backend: Ue,
    dispose() {
      f();
    },
    async withQuerySession(_) {
      if (i.getStore()) return _();
      let N = { databasesByIndexPath: new Map(), indexPathsByProjectPath: new Map() };
      return i.run(N, async () => {
        try {
          return await _();
        } finally {
          (g(N), await Promise.all([...N.indexPathsByProjectPath.values()].map((j) => S(j))));
        }
      });
    },
    async warmupProjectIndex(_) {
      return (await E(_, () => !0)) === !0;
    },
    async refreshProjectIndexGeneration(_) {
      let L = t(_),
        N = it(L);
      return N ? (P(_, L, N), await Promise.all([...c].map(h)), !0) : !1;
    },
    async queryProjectIndex(_) {
      return E(_.projectPath, (L, N) => {
        let j = L.prepare(
          `SELECT project_path, schema_version
             FROM projects
             WHERE project_path = ?
             LIMIT 1`,
        ).get(_.projectPath);
        if (!j) return null;
        let z = j;
        return { projectPath: z.project_path, indexPath: N, schemaVersion: z.schema_version, backend: Ue };
      });
    },
    async queryVfsEntry(_) {
      let L = await E(_.projectPath, (N) => w(N, _));
      return L ? ln(L) : null;
    },
    async queryVfsChildren(_) {
      return (
        (
          await await E(_.projectPath, async (N) => {
            let j = await w(N, _);
            if (!j) return [];
            let z = Math.max(_.depth ?? 1, 1);
            if (z === 1) {
              let ie = N.prepare(
                `SELECT ${rr("none")},
                      ${ow}
               FROM vfs_entries entry
               LEFT JOIN files file
                 ON file.id = entry.source_file_id
               WHERE entry.project_id = ?
                 AND entry.parent_vfs_path = ?`,
              )
                .all(1, j.vfsPath)
                .map(Bt);
              return aw(j.vfsPath, ie);
            }
            let te = oi(j.vfsPath),
              ce = N.prepare(
                `SELECT ${rr("none")}
             FROM vfs_entries entry
             LEFT JOIN files file
               ON file.id = entry.source_file_id
             WHERE entry.project_id = ?
               AND entry.vfs_path != ?
               AND entry.vfs_path >= ?
               AND entry.vfs_path < ?
             ORDER BY entry.vfs_path ASC`,
              )
                .all(1, j.vfsPath, te.lowerBound, te.upperBound)
                .map(Bt)
                .filter((ie) => _c(j.vfsPath, ie.vfsPath) && ZB(j.vfsPath, ie.vfsPath) <= z);
            return aw(j.vfsPath, ce);
          })
        )?.map(ln) ?? []
      );
    },
    async queryVfsEntrySummaries(_) {
      return (await E(_.projectPath, (N) => F(N, _))) ?? new Map();
    },
    async queryVfsGlob(_) {
      return (
        (
          await await E(_.projectPath, async (N) => {
            let j = _.path ? ((await w(N, { projectPath: _.projectPath, path: _.path }))?.vfsPath ?? uw(_.path)) : "",
              z = kn(_.pattern, _.ignoreCase ?? !0),
              te = Dr(z, _.ignoreCase ?? !0),
              se = z === "**/*",
              ce = !j && z === "*",
              ie = tV(_.pattern),
              re = ie !== null,
              k = ["entry.project_id = ?"],
              C = [1];
            (j && fw(k, C, j), ce && k.push("entry.parent_vfs_path IS NULL"));
            let v = Zm(_.type);
            if ((v && (k.push(v.sql), C.push(...v.params)), se && k.push("entry.vfs_path LIKE '%/%'"), re)) {
              let fe = _.ignoreCase ?? !0;
              ie.includes("/")
                ? (k.push(
                    fe
                      ? `(instr(lower(entry.vfs_path), lower(?)) > 0
               OR instr(lower(replace(entry.vfs_path, ':/', '/')), lower(?)) > 0)`
                      : `(instr(entry.vfs_path, ?) > 0
               OR instr(replace(entry.vfs_path, ':/', '/'), ?) > 0)`,
                  ),
                  C.push(ie, ie))
                : (k.push(fe ? "instr(lower(entry.vfs_path), lower(?)) > 0" : "instr(entry.vfs_path, ?) > 0"),
                  C.push(ie));
            }
            let A = !j && (se || re),
              M = A && _.limit !== void 0 ? "LIMIT ? OFFSET ?" : A && _.offset !== void 0 ? "LIMIT -1 OFFSET ?" : "";
            A && _.limit !== void 0 ? C.push(_.limit, _.offset ?? 0) : A && _.offset !== void 0 && C.push(_.offset);
            let D = ce ? "" : "ORDER BY entry.vfs_path ASC",
              H = N.prepare(
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
                      ce
                        ? `,
                    ${ow}`
                        : ""
                    }
             FROM vfs_entries entry
             LEFT JOIN files file
               ON file.id = entry.source_file_id
             WHERE ${k.join(`
               AND `)}
             ${D}
             ${M}`,
              )
                .all(...C)
                .map(Bt),
              ae = ce ? H.sort((fe, Re) => fe.vfsPath.localeCompare(Re.vfsPath)) : H,
              Q = j ? ae.filter((fe) => _c(j, fe.vfsPath)) : ae;
            return se || re
              ? j
                ? Q.slice(_.offset ?? 0, (_.offset ?? 0) + (_.limit ?? Q.length))
                : Q
              : Q.filter((fe) => nV(te, fe.vfsPath)).slice(_.offset ?? 0, (_.offset ?? 0) + (_.limit ?? H.length));
          })
        )?.map(ln) ?? []
      );
    },
    async queryVfsEntryContent(_) {
      let L = await E(_.projectPath, (N) => w(N, _, "content"));
      return L ? { entry: ln(L), content: L.content ?? null } : null;
    },
    async queryVfsEntryContentBatch(_) {
      return (await E(_.projectPath, (N) => Y(N, _))) ?? new Map();
    },
    async queryVfsEntryMetaContent(_) {
      let L = await E(_.projectPath, (N) => w(N, _, "meta"));
      return L ? { entry: ln(L), metaContent: L.metaContent ?? null } : null;
    },
    async queryVfsContent(_) {
      return (await E(_.projectPath, async (N) => (await w(N, _, "content"))?.content ?? null)) ?? null;
    },
    async queryVfsSearch(_) {
      return (
        (await await E(_.projectPath, async (N) => {
          let j = _.path ? ((await w(N, { projectPath: _.projectPath, path: _.path }))?.vfsPath ?? uw(_.path)) : "",
            z = _.include ? Dr(kn(_.include)) : null,
            te = iV(_),
            se = QB(N, { scopePath: j, type: _.type, contentLiteral: te?.literal, contentIgnoreCase: te?.ignoreCase }),
            ce = rV(_),
            ie = mw(_),
            re = [],
            k = new Set();
          for (let C of se) {
            if (!_c(j, C.vfsPath)) continue;
            let v = an(C.entryKind, C.entryType, C.vfsPath),
              A = Ke(ln(C)),
              M = on(A);
            if (z && !JB(A, M, z)) continue;
            if (
              (lw(
                re,
                k,
                M,
                C.entryKind,
                v,
                "content",
                cw({
                  rawContent: C.content ?? "",
                  matcher: ce,
                  limit: _.limit ?? Number.MAX_SAFE_INTEGER,
                  allowMaskedOnlyMatch: ie,
                }),
                0,
                _.limit ?? Number.MAX_SAFE_INTEGER,
              ),
              re.length >= (_.limit ?? Number.MAX_SAFE_INTEGER))
            )
              return re;
            let D = ay(C.content ?? "").length;
            if (
              (lw(
                re,
                k,
                M,
                C.entryKind,
                v,
                "meta_content",
                cw({
                  rawContent: C.metaContent ?? "",
                  matcher: ce,
                  limit: _.limit ?? Number.MAX_SAFE_INTEGER,
                  allowMaskedOnlyMatch: ie,
                }),
                D,
                _.limit ?? Number.MAX_SAFE_INTEGER,
              ),
              re.length >= (_.limit ?? Number.MAX_SAFE_INTEGER))
            )
              return re;
          }
          return re;
        })) ?? []
      );
    },
    async querySemanticVfsRefs(_) {
      return (await E(_.projectPath, (N) => iw(N, _))) ?? [];
    },
    async queryOwningGameObject(_) {
      return (await E(_.projectPath, (N) => O(N, _))) ?? null;
    },
    async queryGuidToProjectRelPath(_) {
      return (
        (await E(_.projectPath, (N) => {
          let j = N.prepare(
            `SELECT guid, project_rel_path, kind
             FROM files
             WHERE project_id = ? AND guid IS NOT NULL`,
          ).all(1);
          return so(j.map((z) => ({ guid: z.guid, projectRelPath: z.project_rel_path, kind: z.kind })));
        })) ?? new Map()
      );
    },
    async queryIndexStatus(_) {
      return ic(_);
    },
    async formatVfsReadContent(_) {
      return tw(K, _.projectPath, Ke(_.entry, { content: _.content }), {
        softProjectionFallback: _.softProjectionFallback,
      });
    },
    async formatVfsReadMetaContent(_) {
      return nw(K, _.projectPath, _.metaContent);
    },
  };
  return K;
}
function Bt(e) {
  let t = e;
  return {
    vfsPath: t.vfs_path,
    entryType: t.entry_type,
    entryKind: t.entry_kind,
    displayName: t.display_name,
    childOrder: t.child_order,
    parentVfsPath: t.parent_vfs_path,
    targetVfsPath: t.target_vfs_path,
    sourceFilePath: t.source_file_path,
    projectionKind: t.projection_kind,
    sourceVfsPath: t.source_vfs_path,
    sourceOwnerVfsPath: t.source_owner_vfs_path,
    instanceRootVfsPath: t.instance_root_vfs_path,
    lineStart: t.line_start,
    lineEnd: t.line_end,
    sizeBytes: t.size_bytes,
    content: t.content,
    metaContent: t.meta_content,
    hasChildren: t.has_children === void 0 || t.has_children === null ? void 0 : !!t.has_children,
  };
}
function aw(e, t) {
  let n = new Map();
  for (let s of t) {
    if (!s.parentVfsPath) continue;
    let o = n.get(s.parentVfsPath) ?? [];
    (o.push(s), n.set(s.parentVfsPath, o));
  }
  for (let s of n.values()) s.sort((o, a) => o.childOrder - a.childOrder || o.vfsPath.localeCompare(a.vfsPath));
  let r = [],
    i = (s) => {
      for (let o of n.get(s) ?? []) (r.push(o), i(o.vfsPath));
    };
  return (i(e), r);
}
function* QB(e, t) {
  let n = XB(t),
    r = e.prepare(n.sql);
  for (let i of r.iterate(...n.params)) yield Bt(i);
}
function XB(e) {
  let t = [1],
    n = [
      "entry.project_id = ?",
      `(entry.meta_content IS NOT NULL
      OR (entry.entry_type <> 'file' AND entry.content IS NOT NULL))`,
    ];
  e.scopePath && fw(n, t, e.scopePath);
  let r = PR(e.type);
  return (
    r && (n.push(r.sql), t.push(...r.params)),
    e.contentLiteral !== void 0 &&
      (e.contentIgnoreCase
        ? (n.push(`(
             instr(lower(COALESCE(entry.meta_content, '')), ?) > 0
             OR (
               entry.entry_type <> 'file'
               AND instr(lower(COALESCE(entry.content, '')), ?) > 0
             )
           )`),
          t.push(e.contentLiteral.toLowerCase(), e.contentLiteral.toLowerCase()))
        : (n.push(`(
             instr(COALESCE(entry.meta_content, ''), ?) > 0
             OR (
               entry.entry_type <> 'file'
               AND instr(COALESCE(entry.content, ''), ?) > 0
             )
           )`),
          t.push(e.contentLiteral, e.contentLiteral))),
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
      params: t,
    }
  );
}
function lw(e, t, n, r, i, s, o, a, l) {
  for (let c of o) {
    let d = a + c.line,
      u = c.text,
      f = `${n}|${s}|${d}|${u}`;
    if (
      !t.has(f) &&
      (t.add(f),
      e.push({ vfsPath: n, entryKind: r, displayType: i, line: d, text: u, contentSource: s }),
      e.length >= l)
    )
      return;
  }
}
function cw(e) {
  let t = ay(e.rawContent);
  if (t.length === 0) return [];
  let n = e.allowMaskedOnlyMatch ? t.map((s, o) => o) : t.map((s, o) => (e.matcher(s) ? o : -1)).filter((s) => s >= 0);
  if (n.length === 0) return [];
  let r = e.allowMaskedOnlyMatch ? Sc((e.maskContent ?? sw)(e.rawContent)) : t.map((s) => bc(s)),
    i = [];
  for (let s of n)
    if (e.matcher(r[s] ?? "") && (i.push({ line: s + 1, text: t[s] ?? "" }), i.length >= e.limit)) return i;
  return i;
}
function dw(e) {
  return e.replace(/\\/g, "/");
}
function JB(e, t, n) {
  let r = dw(e.path),
    i = dw(t),
    s = e.sourcePath.replace(/\\/g, "/"),
    o = s ? `${s}.meta` : "",
    a = t ? `${t}.meta` : "";
  return [
    e.path,
    r,
    t,
    i,
    s,
    s ? (s.split("/").pop() ?? "") : "",
    o,
    o ? (o.split("/").pop() ?? "") : "",
    a,
    a ? (a.split("/").pop() ?? "") : "",
  ].some((c) => c && n.test(c));
}
function ln(e) {
  return {
    vfsPath: e.vfsPath,
    entryType: e.entryType,
    entryKind: e.entryKind,
    displayName: e.displayName,
    parentVfsPath: e.parentVfsPath ?? void 0,
    targetVfsPath: e.targetVfsPath ?? void 0,
    sourceFilePath: e.sourceFilePath ?? void 0,
    projectionKind: e.projectionKind ?? void 0,
    sourceVfsPath: e.sourceVfsPath ?? void 0,
    sourceOwnerVfsPath: e.sourceOwnerVfsPath ?? void 0,
    instanceRootVfsPath: e.instanceRootVfsPath ?? void 0,
    lineStart: e.lineStart ?? void 0,
    lineEnd: e.lineEnd ?? void 0,
    sizeBytes: e.sizeBytes,
    ...(e.hasChildren === void 0 ? {} : { hasChildren: e.hasChildren }),
  };
}
function _c(e, t) {
  return e
    ? t === e || t.startsWith(`${e}/`) || t.startsWith(`${e}:`) || t.startsWith(e.endsWith("/") ? e : `${e}/`)
    : !0;
}
function ZB(e, t) {
  if (!_c(e, t) || t === e) return 0;
  let n = e.endsWith("/") ? e : eV(e) === "container" ? `${e}/` : e;
  return t.replace(n, "").replace(/^:/, "").replace(/^\/+/, "").split("/").filter(Boolean).length;
}
function eV(e) {
  return Xr({
    entryType: e.endsWith("/") || e.includes(":/") ? "node" : "file",
    entryRole: e.endsWith("/") ? "container" : void 0,
    labels: [],
  });
}
function uw(e) {
  let t = e.trim();
  return t ? (t.endsWith("/") ? de(t, "directory") : t) : "";
}
function fw(e, t, n) {
  let r = n.endsWith("/") ? n : `${n}/`,
    i = oi(r),
    s = oi(`${n}:`);
  (e.push(`(
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
    t.push(n, i.lowerBound, i.upperBound, s.lowerBound, s.upperBound));
}
function tV(e) {
  let t = e.trim();
  if (!t.startsWith("**") || !t.endsWith("**") || t.length < 4) return null;
  let n = t.slice(2, -2);
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
function nV(e, t) {
  for (let n of $i([t])) if (e.test(n) || (n.length > 1 && n.endsWith("/") && e.test(n.replace(/\/+$/, "")))) return !0;
  return !1;
}
function rV(e) {
  let t = e.ignoreCase ?? !0;
  if (e.pattern) {
    let r = t ? "i" : "",
      i = new RegExp(e.pattern, r);
    return (s) => i.test(s);
  }
  let n = e.query ?? "";
  return n ? (t ? (r) => r.toLowerCase().includes(n.toLowerCase()) : (r) => r.includes(n)) : () => !1;
}
function iV(e) {
  let t = e.ignoreCase ?? !0,
    n = e.pattern
      ? /[.*+?^${}()|[\]\\]/.test(e.pattern)
        ? null
        : e.pattern
      : e.query && !e.query.includes("*") && !e.query.includes("?") && !e.query.includes("[")
        ? e.query
        : null;
  return !n || mw(e) || (t && Buffer.byteLength(n, "utf8") !== n.length) ? null : { literal: n, ignoreCase: t };
}
function mw(e) {
  return (e.pattern ?? e.query ?? "").replace(/\\/g, "").toLowerCase().includes(ho.toLowerCase());
}
import { AsyncLocalStorage as _w } from "node:async_hooks";
function ir(e = process.platform) {
  let t = process.env.UNITY_INSIGHT_SERVE_PERSISTENT_CONNECTIONS?.trim().toLowerCase();
  return t === "0" || t === "false" ? !1 : t === "1" || t === "true" ? !0 : e !== "win32";
}
import { existsSync as sV } from "node:fs";
import oV from "node:path";
import { fileURLToPath as yw } from "node:url";
import { Worker as aV } from "node:worker_threads";
var lV = 1,
  cV = 12e4,
  dV = [50, 150, 450, 1350];
function uV(e) {
  if (typeof e != "object" || e === null) return !1;
  let t = e;
  if (t.type !== "result" || typeof t.id != "number" || !Number.isSafeInteger(t.id) || typeof t.ok != "boolean")
    return !1;
  if (t.ok) return !0;
  if (typeof t.error != "object" || t.error === null) return !1;
  let n = t.error;
  return typeof n.name == "string" && typeof n.message == "string";
}
function pw(e, t) {
  if (!e) return null;
  let n = Number.parseInt(e, 10);
  return !Number.isFinite(n) || n < t ? null : n;
}
function gw() {
  let e = [
    yw(new URL("./sqliteQueryWorker.js", import.meta.url)),
    yw(new URL("../../bundle/sqliteQueryWorker.js", import.meta.url)),
  ];
  for (let t of e) if (sV(t)) return t;
  return null;
}
function hw(e = process.env) {
  let t = e.INSIGHT_QUERY_WORKER_COUNT?.trim();
  if (t === "0") return 0;
  let n = pw(t, 0);
  return n !== null ? n : lV;
}
function fV(e = process.env) {
  let t = e.UNITY_INSIGHT_QUERY_WORKER_TIMEOUT_MS?.trim();
  return pw(t, 0) ?? cV;
}
function bo(e) {
  return typeof e != "string" || e.trim() === "" ? "__unbound__" : e === "__unbound__" ? e : oV.resolve(e.trim());
}
function _o(e, t) {
  if (e === "warmupProjectIndex" || e === "refreshProjectIndexGeneration")
    return bo(typeof t[0] == "string" ? t[0] : void 0);
  let n = t[0];
  return n && typeof n == "object" && typeof n.projectPath == "string" ? bo(n.projectPath) : "__unbound__";
}
var fy = "Query worker is unavailable.",
  Iw = "QUERY_WORKER_UNAVAILABLE",
  bw = "QUERY_WORKER_TIMEOUT",
  So = class extends Error {
    code = Iw;
    constructor(t) {
      (super(t ? `${fy} ${t.message}` : fy, t ? { cause: t } : void 0), (this.name = "QueryWorkerUnavailableError"));
    }
  };
function Rc(e) {
  return e instanceof Error && "code" in e && e.code === Iw;
}
var my = class extends Error {
  code = bw;
  constructor(t) {
    (super(`Query worker request timed out after ${t}ms.`), (this.name = "QueryWorkerTimeoutError"));
  }
};
function Sw(e) {
  return e instanceof Error && "code" in e && e.code === bw;
}
function Io(e) {
  return e.reason instanceof Error ? e.reason : new Error("Query worker request cancelled.");
}
function Ec(e) {
  (clearTimeout(e.timer), e.signal && e.onAbort && e.signal.removeEventListener("abort", e.onAbort));
}
function yy(e = {}) {
  let t = e.size ?? hw();
  if (t <= 0) return null;
  let n = e.workerPath === void 0 ? gw() : e.workerPath;
  if (!n && !e.createWorker) return null;
  let r = { persistentConnections: e.persistentConnections ?? ir() },
    i = e.createWorker ?? ((v, A) => new aV(v, { workerData: A })),
    s = [],
    o = [],
    a = new Map(),
    l = e.replacementRetryDelaysMs ?? dV,
    c = e.requestTimeoutMs ?? fV(),
    d = [],
    u = [],
    f = !1;
  function m(v) {
    return v instanceof Error ? v : new Error(String(v));
  }
  function y(v) {
    return !!v && v.available && !v.busy;
  }
  function g(v) {
    return !v.available && d[v.index] === void 0;
  }
  function h() {
    return s.every((v) => g(v));
  }
  function b(v) {
    return new So(u[v]);
  }
  function S(v, A) {
    let M = { index: v, worker: A, busy: !1, available: !0, pending: new Map(), nextId: 1, stickyProjects: new Set() };
    return (
      A.on("message", (D) => {
        if (s[v] !== M) return;
        if (!uV(D)) {
          F(M, new Error("Query worker returned a malformed response."));
          return;
        }
        let H = M.pending.get(D.id);
        if (!H) return;
        if ((M.pending.delete(D.id), Ec(H), D.ok)) {
          H.resolve(D.value);
          return;
        }
        let ae = new Error(D.error?.message ?? "Worker query failed");
        ((ae.name = D.error?.name ?? "Error"), H.reject(ae));
      }),
      A.once("error", (D) => {
        F(M, m(D));
      }),
      A.once("exit", (D) => {
        F(M, new Error(`Query worker exited unexpectedly (code=${D}).`));
      }),
      M
    );
  }
  function P(v) {
    for (let A of v.stickyProjects) a.get(A) === v.index && a.delete(A);
    v.stickyProjects.clear();
  }
  function I(v, A) {
    for (let M of v.pending.values()) (Ec(M), M.reject(A));
    v.pending.clear();
  }
  function E(v) {
    for (; o.length > 0;) o.shift()?.reject(v);
  }
  function w(v) {
    (clearTimeout(d[v]), (d[v] = void 0));
  }
  function T(v, A) {
    ((u[v] = A), z(), h() && E(A));
  }
  function x(v, A) {
    if (!f)
      try {
        let M = S(v, i(n ?? "", r));
        ((u[v] = void 0), (s[v] = M), z());
      } catch (M) {
        let D = new Error(`Query worker replacement failed: ${m(M).message}`);
        if (A >= l.length) {
          T(v, D);
          return;
        }
        let H = l[A] ?? 0,
          ae = setTimeout(() => {
            ((d[v] = void 0), x(v, A + 1));
          }, H);
        (ae.unref?.(), (d[v] = ae));
      }
  }
  function O(v, A) {
    if (f || s[v.index] !== v || !v.available) {
      I(v, A);
      return;
    }
    ((v.available = !1), w(v.index), I(v, new So(A)), P(v));
    try {
      v.worker.terminate().catch(() => 0);
    } catch {}
    x(v.index, 0);
  }
  function F(v, A) {
    if (s[v.index] === v)
      try {
        O(v, A);
      } catch (M) {
        (I(v, A), T(v.index, m(M)));
      }
  }
  try {
    for (let v = 0; v < t; v += 1) s.push(S(v, i(n ?? "", r)));
  } catch (v) {
    f = !0;
    for (let A of s)
      try {
        A.worker.terminate().catch(() => 0);
      } catch {}
    throw v;
  }
  function Y(v, A) {
    let M = bo(v),
      D = a.get(M);
    (D !== void 0 && D !== A.index && s[D]?.stickyProjects.delete(M), a.set(M, A.index), A.stickyProjects.add(M));
  }
  function K(v) {
    let A = bo(v),
      M = a.get(A);
    if (M === void 0) return null;
    let D = s[M];
    return !D || g(D) ? (a.delete(A), D?.stickyProjects.delete(A), null) : M;
  }
  function _() {
    let v = null,
      A = Number.POSITIVE_INFINITY;
    for (let M of s) {
      if (!M.available) continue;
      let D = M.stickyProjects.size + (M.busy ? 1e3 : 0);
      D < A && ((A = D), (v = M.index));
    }
    return v;
  }
  function L(v) {
    let A = v === null ? s.find((M) => y(M)) : s[v];
    return y(A) ? A : void 0;
  }
  function N(v) {
    let A = bo(v);
    return A === "__unbound__" ? void 0 : A;
  }
  function j(v) {
    if (v === void 0) return null;
    let A = K(v);
    if (A !== null) return A;
    let M = _();
    return (M !== null && Y(v, s[M]), M);
  }
  function z() {
    for (let v = 0; v < o.length;) {
      let A = o[v],
        M = L(j(A.projectKey));
      if (!M) {
        v += 1;
        continue;
      }
      (o.splice(v, 1), A.resolve(M));
    }
  }
  function te(v, A) {
    if (f) return Promise.reject(new Error("Query worker pool has been disposed."));
    if (A?.aborted) return Promise.reject(Io(A));
    if (h()) return Promise.reject(b(0));
    let M = N(v),
      D = j(M);
    function H(Q) {
      return ((Q.busy = !0), Q);
    }
    let ae = L(D);
    return ae
      ? Promise.resolve(H(ae))
      : new Promise((Q, fe) => {
          let Re = () => {
              A?.removeEventListener("abort", Pe);
            },
            Pe = () => {
              let W = o.indexOf(B);
              (W >= 0 && o.splice(W, 1), Re(), fe(Io(A)));
            },
            B = {
              projectKey: M,
              resolve: (W) => {
                (Re(), Q(H(W)));
              },
              reject: (W) => {
                (Re(), fe(W));
              },
            };
          (A?.addEventListener("abort", Pe, { once: !0 }), o.push(B));
        });
  }
  function se(v) {
    s[v.index] === v && ((v.busy = !1), z());
  }
  function ce(v, A, M) {
    if (s[v.index] !== v || !v.available) return Promise.reject(new So());
    if (M?.aborted) return Promise.reject(Io(M));
    let D = v.nextId++;
    return new Promise((H, ae) => {
      let Q = { resolve: H, reject: ae, signal: M };
      (M &&
        ((Q.onAbort = () => {
          v.pending.get(D) === Q && O(v, new Error(`Query worker request ${D} was cancelled.`));
        }),
        M.addEventListener("abort", Q.onAbort, { once: !0 })),
        c > 0 &&
          ((Q.timer = setTimeout(() => {
            v.pending.get(D) === Q &&
              (v.pending.delete(D),
              Ec(Q),
              Q.reject(new my(c)),
              O(v, new Error(`Query worker request timed out after ${c}ms.`)));
          }, c)),
          Q.timer.unref?.()),
        v.pending.set(D, Q));
      try {
        let fe = { id: D, ...A };
        v.worker.postMessage(fe);
      } catch (fe) {
        (v.pending.delete(D), Ec(Q), ae(fe instanceof Error ? fe : new Error(String(fe))));
      }
    });
  }
  async function ie(v = {}) {
    let { projectKey: A, signal: M } = v,
      D = await te(A, M),
      H = !1,
      ae = !1,
      Q = null,
      fe = Promise.resolve();
    function Re(W, ue) {
      if (ue?.aborted) return Promise.reject(Io(ue));
      let xe = !1,
        Se = !1;
      return new Promise((Z, ne) => {
        let ge = () => {
            ue && ue.removeEventListener("abort", Ie);
          },
          Ie = () => {
            !ue || Se || ((xe = !0), ge(), ne(Io(ue)));
          };
        (ue && (ue.addEventListener("abort", Ie, { once: !0 }), ue.aborted && Ie()),
          (fe = fe
            .then(async () => {
              if (!xe) {
                ((Se = !0), ge());
                try {
                  Z(await ce(D, W, ue));
                } catch (sr) {
                  ne(sr);
                }
              }
            })
            .then(
              () => {},
              () => {},
            )));
      });
    }
    async function Pe(W) {
      if (!ae) {
        Q ??= Re({ type: "session-start" }, W).then(() => {
          ae = !0;
        });
        try {
          await Q;
        } catch (ue) {
          throw ((Q = null), ue);
        }
      }
    }
    async function B() {
      if ((await Q, !!ae))
        try {
          await Re({ type: "session-end" });
        } finally {
          ((ae = !1), (Q = null));
        }
    }
    return {
      invoke: (W, ue, xe) => Re({ type: ae ? "session-call" : "call", method: W, args: ue }, xe?.signal),
      startSession: Pe,
      endSession: B,
      release: () => {
        H || ((H = !0), se(D));
      },
    };
  }
  async function re(v, A, M = {}) {
    let D = M.projectKey ?? _o(v, A),
      H = await ie({ projectKey: D, signal: M.signal });
    try {
      return await H.invoke(v, A, { signal: M.signal });
    } finally {
      H.release();
    }
  }
  async function k(v, A = {}) {
    let M = await ie(A);
    try {
      return await v(M.invoke);
    } finally {
      M.release();
    }
  }
  function C() {
    if (!f) {
      for (f = !0; o.length > 0;) o.shift()?.reject(new Error("Query worker pool disposed."));
      a.clear();
      for (let v of s) {
        (w(v.index), v.stickyProjects.clear(), I(v, new Error("Query worker pool disposed.")));
        try {
          v.worker.postMessage({ type: "dispose", id: v.nextId++ });
        } catch {}
        v.worker.terminate().catch(() => 0);
      }
    }
  }
  return { invoke: re, acquire: ie, withWorker: k, dispose: C, size: t };
}
function mV(e) {
  return !!e && typeof e == "object" && e.__type === "Map" && Array.isArray(e.entries);
}
function yV(e) {
  return mV(e) ? new Map(e.entries) : e;
}
function Ew(e = {}) {
  let t = e.persistentConnections ?? ir(),
    n = yy({ ...e, persistentConnections: t });
  if (!n) return Gi({ persistentConnections: t });
  let r = n,
    i = new _w(),
    s = new _w();
  function o(y) {
    return y.reason instanceof Error ? y.reason : new Error("Query request cancelled.");
  }
  function a(y) {
    if (y?.aborted) throw o(y);
  }
  function l() {
    a(s.getStore());
  }
  async function c(y, g) {
    return (
      a(g),
      g
        ? new Promise((h, b) => {
            let S = () => {
                b(o(g));
              },
              P = () => {
                g.removeEventListener("abort", S);
              };
            (g.addEventListener("abort", S, { once: !0 }),
              y.then(
                (I) => {
                  (P(), h(I));
                },
                (I) => {
                  (P(), b(I));
                },
              ));
          })
        : y
    );
  }
  async function d(y, g, h, b) {
    let S = _o(g, h);
    if (y.projectKey === null) y.projectKey = S;
    else if (y.projectKey !== S) throw new Error(`A query session cannot span projects (${y.projectKey} and ${S}).`);
    if (y.failure) throw y.failure;
    return y.handle
      ? y.handle
      : (a(b),
        y.setupPromise ||
          (y.setupPromise = (async () => {
            for (let P = 0; ; P += 1) {
              let I = await r.acquire({ projectKey: S, signal: b });
              try {
                return (await I.startSession(b), (y.handle = I), I);
              } catch (E) {
                if ((I.release(), P >= 1 || !Rc(E))) throw E;
                a(b);
              }
            }
          })().catch((P) => {
            y.setupPromise = null;
            let I = P instanceof Error ? P : new Error(String(P));
            throw ((y.failure ??= I), I);
          })),
        c(y.setupPromise, b));
  }
  async function u(y, g, h) {
    let b = s.getStore(),
      S = await d(y, g, h, b);
    a(b);
    try {
      return await S.invoke(g, h, { signal: b });
    } catch (P) {
      throw ((Rc(P) || Sw(P)) && ((y.failure ??= P), y.handle === S && ((y.handle = null), S.release())), P);
    }
  }
  async function f(y, ...g) {
    let h = i.getStore();
    try {
      let b = h ? await u(h, y, g) : await r.invoke(y, g, { projectKey: _o(y, g), signal: s.getStore() });
      return yV(b);
    } catch (b) {
      throw (Rc(b) && l(), b);
    }
  }
  let m = Object.fromEntries(_R.map((y) => [y, (...g) => f(y, ...g)]));
  return {
    backend: Ue,
    dispose() {
      r.dispose();
    },
    async withCancellationSignal(y, g) {
      return s.run(y, async () => (l(), g()));
    },
    async withQuerySession(y) {
      if (i.getStore()) return y();
      let g = { handle: null, setupPromise: null, failure: null, projectKey: null };
      try {
        return await i.run(g, () => y());
      } finally {
        if (g.handle)
          try {
            await g.handle.endSession();
          } finally {
            g.handle.release();
          }
      }
    },
    ...m,
  };
}
function Rw(e = {}) {
  return { queryService: e.queryService ?? sc(), projectPath: e.projectPath };
}
function py(e) {
  return Ze(e);
}
function pV(e) {
  return e ? `under '${e}'` : "globally";
}
function gV(e, t, n, r, i) {
  let s = { vfs_path: e, source_path: t };
  return (
    n > 0 && r > 0 && ((s.line_start = n), (s.line_end = r)),
    i?.sizeKb !== void 0 && (s.size_kb = i.sizeKb),
    i?.childCount !== void 0 && (s.child_count = i.childCount),
    i?.entryType && (s.entry_type = i.entryType),
    i?.targetVfsPath && (s.target_vfs_path = i.targetVfsPath),
    i?.projectionKind && (s.projection_kind = i.projectionKind),
    i?.sourceVfsPath && (s.source_vfs_path = i.sourceVfsPath),
    s
  );
}
function gy(e) {
  return sn("vfs_glob", e, async (t, n, r) => {
    let i = Ae(t.pattern).trim();
    if (!i) throw new ye("INVALID_REQUEST", "The pattern argument is required.", "Invalid vfs_glob request.");
    let s = pc(t.ignore_case);
    if (s === void 0)
      throw new ye("INVALID_REQUEST", "The ignore_case argument must be true or false.", "Invalid vfs_glob request.");
    let o = Ae(t.path).trim(),
      a = gc(o),
      l = zR(a),
      c = fc(t.output_format),
      d = uc(t.type, "vfs_glob"),
      u = dc(t.limit),
      f = kn(i, s),
      m = Dr(f, s),
      y = new Set(),
      g = [],
      h = [],
      b = new Map(),
      S = new Map(),
      P = (x) => {
        let O = S.get(x);
        if (O) return O;
        let F = n.queryVfsEntry({ projectPath: r, path: x });
        return (S.set(x, F), F);
      },
      I = await n.queryVfsGlob({
        projectPath: r,
        pattern: f,
        path: a || void 0,
        type: d || void 0,
        limit: Math.max(u * 10, 100),
        ignoreCase: s,
      }),
      E = I.length;
    for (let x of I) {
      let O = Ke(x),
        F = on(O),
        Y = jr(a, l, F);
      if (!$i([O.path, py(O.path), F, py(F), Y, py(Y)]).some((L) => m.test(L))) continue;
      let _ = an(x.entryKind, x.entryType, x.vfsPath);
      if (
        !(d && !yo(_, d)) &&
        !y.has(F) &&
        (y.add(F),
        b.set(F, O),
        h.push(yc(F, O)),
        g.push(
          gV(F, O.sourcePath, O.lineStart, O.lineEnd, {
            entryType: dt(O),
            targetVfsPath: O.targetVfsPath ? ve(O.targetVfsPath, "container") : void 0,
            projectionKind: O.projectionKind,
            sourceVfsPath: O.sourceVfsPath,
          }),
        ),
        g.length >= u)
      )
        break;
    }
    let w = await Promise.all(
        h.map(async (x) => {
          let O = b.get(x.relativePath);
          if (!O) return x;
          if (x.entryType === "directory") {
            let Y = (await n.queryVfsChildren({ projectPath: r, path: O.path, depth: 25 }))
              .filter((K) => K.entryType === "file")
              .reduce((K, _) => K + (_.sizeBytes ?? 0), 0);
            return { ...x, sizeKb: Tt(Y) };
          }
          if (x.entryType === "link" && O.targetVfsPath) {
            let F = await P(O.targetVfsPath);
            if (!F) return x;
            let Y = await n.queryVfsChildren({ projectPath: r, path: F.vfsPath, depth: 1 });
            return F.entryType === "directory" || Y.length > 0
              ? { ...x, childCount: Y.length }
              : { ...x, sizeKb: Tt(F.sizeBytes ?? 0) };
          }
          if (x.sourceVfsPath) {
            let F = await P(x.sourceVfsPath);
            if ((F?.sizeBytes ?? 0) > 0) return { ...x, sizeKb: Tt(F?.sizeBytes ?? 0) };
          }
          return { ...x, sizeKb: (O.size ?? 0) > 0 ? Tt(O.size ?? 0) : void 0 };
        }),
      ),
      T = new Map(w.map((x) => [x.relativePath, x]));
    for (let x of g) {
      let O = Ae(x.vfs_path),
        F = T.get(O);
      F &&
        (F.sizeKb !== void 0 && (x.size_kb = F.sizeKb),
        F.childCount !== void 0 && (x.child_count = F.childCount),
        F.entryType && (x.entry_type = F.entryType),
        F.targetVfsPath && (x.target_vfs_path = F.targetVfsPath));
    }
    return {
      data: {
        path: a,
        nodes: g,
        grouped_entries: w,
        type: d || void 0,
        scanned_rows: E,
        limit: u,
        output_format: c,
        ignore_case: s,
      },
      summary: `Matched ${g.length} VFS entries for pattern '${i}' ${pV(a)} (limit ${u}). Scanned ${E} rows.`,
    };
  });
}
function hV(e) {
  let t = Ae(e).trim();
  if (!t) return;
  let n = Cr(t);
  if (n) return n;
  throw new ye("INVALID_REQUEST", `show_type must be one of ${nn.join(", ")}.`, "Invalid vfs_ls request.");
}
function IV(e, t) {
  return !t || t === "ALL" ? e : e.filter((n) => wR(n.labels, t));
}
function bV(e) {
  let t = Ze(e.path),
    n = dt(e);
  return !t || t === "/" ? "" : n === "file" ? `${t}:/` : `${t}/`;
}
async function SV(e, t, n, r) {
  let i = [
      ...new Set(
        n
          .map((o) => r.get(o.relativePath))
          .filter((o) => !!o?.targetVfsPath)
          .map((o) => o.targetVfsPath),
      ),
    ],
    s = i.length > 0 ? await e.queryVfsEntrySummaries({ projectPath: t, paths: i }) : new Map();
  return Promise.all(
    n.map(async (o) => {
      let a = r.get(o.relativePath);
      if (!a) return o;
      if (o.entryType === "directory") {
        let c = (await e.queryVfsChildren({ projectPath: t, path: a.path, depth: 25 }))
          .filter((d) => d.entryType === "file")
          .reduce((d, u) => d + (u.sizeBytes ?? 0), 0);
        return { ...o, sizeKb: Tt(c) };
      }
      if (o.entryType === "link" && a.targetVfsPath) {
        let l = s.get(a.targetVfsPath);
        if (l)
          return l.entry.entryType === "directory" || l.directChildCount > 0
            ? { ...o, childCount: l.directChildCount }
            : (l.entry.sizeBytes ?? 0) > 0
              ? { ...o, sizeKb: Tt(l.entry.sizeBytes ?? 0) }
              : o;
        let c = await e.queryVfsEntry({ projectPath: t, path: a.targetVfsPath });
        if (!c) return o;
        let d = await e.queryVfsChildren({ projectPath: t, path: c.vfsPath, depth: 1 });
        return c.entryType === "directory" || d.length > 0
          ? { ...o, childCount: d.length }
          : (c.sizeBytes ?? 0) > 0
            ? { ...o, sizeKb: Tt(c.sizeBytes ?? 0) }
            : o;
      }
      if ((a.size ?? 0) > 0) return { ...o, sizeKb: Tt(a.size ?? 0) };
      if (o.sourceVfsPath) {
        let l = await e.queryVfsEntry({ projectPath: t, path: o.sourceVfsPath });
        if ((l?.sizeBytes ?? 0) > 0) return { ...o, sizeKb: Tt(l?.sizeBytes ?? 0) };
      }
      return o;
    }),
  );
}
function hy(e) {
  return sn("vfs_ls", e, async (t, n, r) => {
    let i = Ae(t.path).trim();
    if (!i) throw new ye("INVALID_REQUEST", "The path argument is required.", "Invalid vfs_ls request.");
    let s = Math.max(1, Math.min(go(t.depth) || 1, 5)),
      o = fc(t.output_format),
      a = hV(t.show_type),
      l = await n.queryVfsEntry({ projectPath: r, path: i });
    if (!l) throw new ye("ENTRY_NOT_FOUND", `No VFS entry found for '${i}'.`, "VFS entry not found.");
    let c = Ke(l),
      d = bV(c),
      u = IV(await Ic(n, r, c, s), a),
      f = u
        .map((h) => yc(jr(c.path, d, h.path), h))
        .filter((h, b, S) => S.findIndex((P) => P.relativePath === h.relativePath) === b)
        .sort((h, b) => h.relativePath.localeCompare(b.relativePath)),
      m = new Map(u.map((h) => [jr(c.path, d, h.path), h])),
      y = await SV(n, r, f, m),
      g = y.map((h) => h.relativePath);
    return {
      data: { entries: g, grouped_entries: y, output_format: o, ...(a ? { show_type: a } : {}) },
      summary: `Listed ${g.length} entries under '${Vi(c)}' (depth=${s}${a ? `, show_type=${a}` : ""}).`,
    };
  });
}
function ww(e) {
  return e.startsWith("(?i)")
    ? { pattern: e.slice(4), ignoreCase: !0 }
    : e.startsWith("(?i:") && e.endsWith(")")
      ? { pattern: e.slice(4, -1), ignoreCase: !0 }
      : { pattern: e, ignoreCase: !1 };
}
function Pw(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function _V(e, t) {
  if (e[t] !== "[") return null;
  let n = e.indexOf("]", t + 1);
  if (n <= t + 1) return null;
  let i = e.slice(t + 1, n);
  return (i[0] === "!" && (i = `^${i.slice(1)}`), (i = i.replace(/\\/g, "\\\\")), { regex: `[${i}]`, nextIndex: n });
}
function EV(e, t) {
  let n = e.trim();
  if (!n || !(n.includes("*") || n.includes("?") || n.includes("["))) return null;
  let i = "";
  for (let s = 0; s < n.length; s += 1) {
    let o = n[s];
    if (o === "*") {
      i += ".*";
      continue;
    }
    if (o === "?") {
      i += ".";
      continue;
    }
    if (o === "[") {
      let a = _V(n, s);
      if (a) {
        ((i += a.regex), (s = a.nextIndex));
        continue;
      }
    }
    i += Pw(n[s]);
  }
  return new RegExp(i, t ? "i" : "");
}
function RV(e, t) {
  let n = Ae(e.pattern).trim(),
    r = Ae(e.query).trim();
  if (!n && !r)
    throw new ye(
      "INVALID_REQUEST",
      "Provide non-empty `pattern` (regex, preferred) or deprecated `query`.",
      "Invalid vfs_grep request.",
    );
  if (n) {
    let s = ww(n),
      o = t || s.ignoreCase;
    try {
      return { regex: new RegExp(s.pattern, o ? "i" : ""), label: n };
    } catch (a) {
      let l = a instanceof Error ? a.message : String(a);
      throw new ye("INVALID_REQUEST", `Invalid regular expression pattern: ${l}`, "Invalid vfs_grep request.");
    }
  }
  let i = EV(r, t);
  return i ? { regex: i, label: r } : { regex: new RegExp(Pw(r), t ? "i" : ""), label: r };
}
function Iy(e) {
  return sn("vfs_grep", e, async (t, n, r) => {
    let i = pc(t.ignore_case);
    if (i === void 0)
      throw new ye("INVALID_REQUEST", "The ignore_case argument must be true or false.", "Invalid vfs_grep request.");
    let { label: s } = RV(t, i),
      o = Ae(t.path).trim(),
      a = gc(o),
      l = Ae(t.include).trim(),
      c = uc(t.type, "vfs_grep"),
      d = dc(t.limit),
      u = l ? kn(l) : "",
      f = Ae(t.pattern).trim(),
      m = Ae(t.query).trim(),
      y = f ? ww(f) : null,
      g = i || y?.ignoreCase || !1,
      h = await n.queryVfsSearch({
        projectPath: r,
        pattern: y?.pattern || void 0,
        query: m || void 0,
        path: a || void 0,
        include: u || void 0,
        type: c || void 0,
        limit: d,
        ignoreCase: g,
      }),
      S = h.some((T) => T.text.includes("{guid:")) ? await n.queryGuidToProjectRelPath({ projectPath: r }) : void 0,
      P = h.map((T) => ({
        vfs_path: T.vfsPath,
        type: T.displayType,
        line: T.line,
        text: S !== void 0 ? Ul(T.text, S) : T.text,
        contentSource: T.contentSource,
      })),
      I = h.length,
      E = u ? ` (include: ${u})` : "",
      w = c ? ` (type: ${c})` : "";
    return {
      data: {
        scope: a,
        pattern: s,
        include: u || void 0,
        type: c || void 0,
        matches: P,
        scanned_rows: I,
        limit: d,
        ignore_case: i,
      },
      summary: `Found ${P.length} matches for pattern '${s}' ${a ? `in '${a}'` : "globally"}${E}${w} (limit ${d}). Scanned ${I} rows.`,
    };
  });
}
function wV(e) {
  return (e.typeKind ?? "").trim().toLowerCase() === "enum";
}
function PV(e, t) {
  if (t === "defined") return "in";
  let n = Ae(e).trim().toLowerCase();
  if (!n) return "out";
  if (n === "in" || n === "out") return n;
  throw new ye("INVALID_REQUEST", "direction must be 'in' or 'out'.", "Invalid vfs_refs request.");
}
function vV(e) {
  let t = Ae(e).trim();
  if (!t) return;
  let n = Cr(t);
  if (n) return n;
  throw new ye("INVALID_REQUEST", `target_type must be one of ${nn.join(", ")}.`, "Invalid vfs_refs request.");
}
function xV(e) {
  let t = ve(e),
    n = t.indexOf(":/");
  return n >= 0 ? t.slice(0, n) : t;
}
function TV(e, t) {
  let n = xV(e).toLowerCase();
  switch (t) {
    case "Prefab":
      return n.endsWith(".prefab");
    case "Scene":
      return n.endsWith(".unity") || n.endsWith(".scene");
    default:
      return !1;
  }
}
function wc(e) {
  return e.projectionKind === "prefab_inherited" && (e.sourceVfsPath ?? "").trim().length > 0;
}
function xw(e, t) {
  let n = ve(t.trim());
  if (/\.cs$/i.test(n) && !n.includes(":/")) return "defined";
  let r = e.labels ?? [];
  return r.includes("Method") || r.includes("Property") || e.entryKind === "method" || e.entryKind === "property"
    ? "call"
    : wV(e)
      ? "reference"
      : r.includes("Class") || r.includes("Script") || e.entryKind === "class" || e.entryKind === "script"
        ? "call"
        : "reference";
}
function vw(e, t) {
  let n = t === "from" ? e.fromEntryKind : e.toEntryKind,
    r = t === "from" ? e.fromEntryType : e.toEntryType,
    i = t === "from" ? e.fromPath : e.toPath;
  return an(n, r, i);
}
async function kV(e, t, n) {
  let r = n,
    i = new Set();
  for (; wc(r);) {
    let s = Ze(r.sourceVfsPath ?? "");
    if (!s) break;
    if (i.has(s))
      throw new ye(
        "INVALID_GRAPH_STATE",
        `Projection source resolution cycle detected for '${n.path}'.`,
        "Projection source resolution failed.",
      );
    i.add(s);
    let o = await e.queryVfsEntry({ projectPath: t, path: s });
    if (!o) throw new ye("ENTRY_NOT_FOUND", `No VFS entry found for projection source '${s}'.`, "VFS entry not found.");
    r = Ke(o);
  }
  return r;
}
async function NV(e, t, n, r, i) {
  if (!i || i === "ALL") return { path: ve(n), ...(r ? { type: r } : {}) };
  if (TV(n, i)) return { path: ve(n), ...(r ? { type: r } : {}) };
  if (i === "Component") return r !== "Component" ? null : { path: ve(n), type: r };
  if (i === "GameObject") {
    if (r === "GameObject") return { path: ve(n), type: "GameObject" };
    let s = await e.queryOwningGameObject({ projectPath: t, path: n });
    return s ? { path: ve(s.vfsPath), type: "GameObject" } : null;
  }
  return yo(r, i) ? { path: ve(n), type: r } : null;
}
async function UV(e, t, n, r, i) {
  if (!i || i === "ALL") return n;
  let s = r === "in" ? "from" : "to",
    o = n[s],
    a = s === "from" ? n.fromType : n.toType,
    l = await NV(e, t, o, a, i);
  return l ? { ...n, ...(s === "from" ? { from: l.path, fromType: l.type } : { to: l.path, toType: l.type }) } : null;
}
function by(e) {
  return sn("vfs_refs", e, async (t, n, r) => {
    let i = Ae(t.path).trim();
    if (!i) throw new ye("INVALID_REQUEST", "The path argument is required.", "Invalid vfs_refs request.");
    let s = await n.queryVfsEntry({ projectPath: r, path: i });
    if (!s) throw new ye("ENTRY_NOT_FOUND", `No VFS entry found for '${i}'.`, "VFS entry not found.");
    let o = Ke(s),
      a = xw({ path: s.vfsPath, entryKind: s.entryKind, labels: o.labels, typeKind: o.typeKind }, i),
      l = on(o),
      c = Vi(o),
      d = an(s.entryKind, s.entryType, s.vfsPath),
      u = dt(o),
      f = PV(t.direction, a),
      m = vV(t.target_type),
      y = await kV(n, r, o),
      g = await n.querySemanticVfsRefs({
        projectPath: r,
        requestedPath: o.path,
        semanticPath: y.path,
        mode: a,
        direction: f,
        ...(a === "defined" ? { edgeKinds: ["binds_to"] } : {}),
      }),
      h = new Set(),
      b = [];
    for (let S of g) {
      let P = vw(S, "from"),
        I = vw(S, "to"),
        E = {
          from: ve(S.fromPath),
          to: ve(S.toPath),
          ...(P ? { fromType: P } : {}),
          ...(I ? { toType: I } : {}),
          type: QR(S.edgeKind),
          sourcePath: S.sourceFilePath ?? "",
          sourceRange: { startLine: S.lineStart ?? 0, endLine: S.lineEnd ?? 0 },
        },
        w = await UV(n, r, E, f, m);
      if (!w) continue;
      let T = a === "reference" ? `${w.from}|${w.to}` : `${w.from}|${w.to}|${w.type}|${w.sourcePath}`;
      h.has(T) || (h.add(T), b.push(w));
    }
    return a === "defined"
      ? {
          data: {
            path: l,
            type: d,
            entry_type: u,
            ...(wc(o) ? { projection_kind: o.projectionKind, source_vfs_path: ve(y.path, y.entryRole) } : {}),
            mode: "defined",
            ...(m ? { target_type: m } : {}),
            refs: b,
          },
          summary: `Found ${b.length} incoming script bindings (Component -> Script) for '${c}'${m ? ` (target_type: ${m})` : ""}.`,
        }
      : a === "call"
        ? {
            data: {
              path: l,
              type: d,
              entry_type: u,
              ...(wc(o) ? { projection_kind: o.projectionKind, source_vfs_path: ve(y.path, y.entryRole) } : {}),
              mode: "call",
              ...(m ? { target_type: m } : {}),
              calls: b,
            },
            summary: `Found ${b.length} ${f === "in" ? "incoming" : "outgoing"} calls for '${c}'${m ? ` (target_type: ${m})` : ""}.`,
          }
        : {
            data: {
              path: l,
              type: d,
              entry_type: u,
              ...(wc(o) ? { projection_kind: o.projectionKind, source_vfs_path: ve(y.path, y.entryRole) } : {}),
              mode: "reference",
              ...(m ? { target_type: m } : {}),
              refs: b,
            },
            summary: `Found ${b.length} ${f === "in" ? "incoming" : "outgoing"} VFS references for '${c}'${m ? ` (target_type: ${m})` : ""}.`,
          };
  });
}
function $r(e) {
  let t = Rw({ ...e, queryService: e?.queryService ?? Gi() }),
    n = { queryService: t.queryService, projectPath: t.projectPath };
  return [hy(n), gy(n), uy(n), Iy(n), by(n)];
}
import { createHash as A$, timingSafeEqual as L$ } from "node:crypto";
import { stat as O$ } from "node:fs/promises";
import Lc from "node:path";
import { existsSync as AV } from "node:fs";
import { fileURLToPath as Uw } from "node:url";
import { Worker as LV } from "node:worker_threads";
function Sy(e) {
  return typeof e == "object" && e !== null;
}
function _y(e) {
  return Sy(e) && typeof e.id == "number" && Number.isSafeInteger(e.id);
}
function Tw(e) {
  return !_y(e) || e.type !== "result" || typeof e.ok != "boolean"
    ? !1
    : e.ok
      ? !0
      : Sy(e.error) && typeof e.error.name == "string" && typeof e.error.message == "string";
}
function kw(e) {
  return (
    _y(e) &&
    e.type === "progress" &&
    Sy(e.progress) &&
    typeof e.progress.phase == "string" &&
    typeof e.progress.current == "number" &&
    typeof e.progress.total == "number"
  );
}
function Nw(e) {
  return _y(e) && e.type === "shouldSkipAfterLock" && typeof e.liveDbPath == "string";
}
var OV = { name: "Error", message: "Index build worker failed." },
  Pc = new Set(),
  CV = 1;
function MV() {
  let e = [
    Uw(new URL("./indexBuildWorker.js", import.meta.url)),
    Uw(new URL("../../../bundle/indexBuildWorker.js", import.meta.url)),
  ];
  for (let t of e) if (AV(t)) return t;
  return null;
}
function FV(e = process.env) {
  return e.UNITY_INSIGHT_INDEX_BUILD_WORKERS !== "0";
}
function DV(e) {
  return new LV(e);
}
function jV(e) {
  return (
    e.resolveIndexPaths !== void 0 ||
    e.readTextFile !== void 0 ||
    e.globalBuildLock !== void 0 ||
    e.yamlIndexPassDependencies !== void 0
  );
}
function BV(e, t) {
  return FV() && t !== null && !jV(e);
}
function VV(e) {
  if (e.name === xn.name) return new xn();
  let t = new Error(e.message);
  return ((t.name = e.name), t);
}
async function Aw(e) {
  try {
    await e.terminate();
  } catch {}
}
async function Lw() {
  let e = [...Pc];
  (Pc.clear(), await Promise.all(e.map((t) => Aw(t))));
}
function $V(e, t, n) {
  return {
    type: "build",
    id: e,
    projectPath: t.projectPath,
    ...(t.mode !== void 0 ? { mode: t.mode } : {}),
    ...(t.outputPath !== void 0 ? { outputPath: t.outputPath } : {}),
    ...(t.schemaVersion !== void 0 ? { schemaVersion: t.schemaVersion } : {}),
    ...(t.includePackages !== void 0 ? { includePackages: t.includePackages } : {}),
    ...(t.timing !== void 0 ? { timing: t.timing } : {}),
    ...(n ? { querySkipAfterLock: !0 } : {}),
  };
}
function GV(e, t, n, r, i) {
  if (kw(e)) {
    e.id === t && n?.(e.progress);
    return;
  }
  if (!(!Tw(e) || e.id !== t)) {
    if (e.ok) {
      r(e.value);
      return;
    }
    i(VV(e.error ?? OV));
  }
}
function KV(e, t, n, r, i) {
  Promise.resolve(r?.(n))
    .then((s) => {
      e.postMessage({ type: "shouldSkipAfterLockResult", id: t, skip: s === !0 });
    })
    .catch((s) => {
      i(s instanceof Error ? s : new Error(String(s)));
    });
}
async function WV(e, t, n, r, i) {
  let s = n(t);
  Pc.add(s);
  let o = CV++;
  try {
    return await new Promise((a, l) => {
      let c = !1,
        d = (f) => {
          c || ((c = !0), a(f));
        },
        u = (f) => {
          c || ((c = !0), l(f));
        };
      (s.on("message", (f) => {
        if (Nw(f) && f.id === o) {
          KV(s, o, f.liveDbPath, i, u);
          return;
        }
        GV(f, o, r, d, u);
      }),
        s.once("error", u),
        s.once("exit", (f) => {
          u(new Error(`Index build worker exited with code ${f} before returning a result.`));
        }),
        s.postMessage($V(o, e, i !== void 0)));
    });
  } finally {
    (Pc.delete(s), await Aw(s));
  }
}
async function Ow(e, t = {}) {
  let n = t.workerPath === void 0 ? MV() : t.workerPath,
    r = e.onProgress ?? t.onProgress;
  if (!BV(t, n))
    return Xl(e, {
      resolveIndexPaths: t.resolveIndexPaths,
      readTextFile: t.readTextFile,
      onProgress: r,
      shouldSkipAfterLock: t.shouldSkipAfterLock,
      globalBuildLock: t.globalBuildLock,
      yamlIndexPassDependencies: t.yamlIndexPassDependencies,
    });
  try {
    return await WV(
      e,
      n,
      t.createWorker ?? DV,
      (i) => {
        (en(e.projectPath, i), r?.(i));
      },
      t.shouldSkipAfterLock,
    );
  } finally {
    tn(e.projectPath);
  }
}
import { existsSync as YV } from "node:fs";
import { fileURLToPath as Dw } from "node:url";
import { Worker as qV } from "node:worker_threads";
function Ey(e) {
  return typeof e == "object" && e !== null;
}
function Cw(e) {
  return Ey(e) && typeof e.id == "number" && Number.isSafeInteger(e.id);
}
function Mw(e) {
  return !Cw(e) || e.type !== "result" || typeof e.ok != "boolean"
    ? !1
    : e.ok
      ? !0
      : Ey(e.error) && typeof e.error.name == "string" && typeof e.error.message == "string";
}
function Fw(e) {
  return (
    Cw(e) &&
    e.type === "progress" &&
    Ey(e.progress) &&
    typeof e.progress.phase == "string" &&
    typeof e.progress.current == "number" &&
    typeof e.progress.total == "number"
  );
}
var zV = { name: "Error", message: "Index sync worker failed." },
  vc = new Set(),
  HV = 1;
function QV() {
  let e = [
    Dw(new URL("./indexSyncWorker.js", import.meta.url)),
    Dw(new URL("../../../bundle/indexSyncWorker.js", import.meta.url)),
  ];
  for (let t of e) if (YV(t)) return t;
  return null;
}
function XV(e = process.env) {
  return e.UNITY_INSIGHT_INDEX_SYNC_WORKERS !== "0";
}
function JV(e) {
  return new qV(e);
}
function ZV(e) {
  return e.resolveIndexPaths !== void 0 || e.syncLogSink !== void 0 || e.yamlIndexPassDependencies !== void 0;
}
function e$(e, t) {
  return XV() && t !== null && !ZV(e);
}
function t$(e) {
  let t = new Error(e.message);
  return ((t.name = e.name), t);
}
async function jw(e) {
  try {
    await e.terminate();
  } catch {}
}
async function Bw() {
  let e = [...vc];
  (vc.clear(), await Promise.all(e.map((t) => jw(t))));
}
function n$(e, t) {
  return {
    type: "sync",
    id: e,
    projectPath: t.projectPath,
    ...(t.paths ? { paths: t.paths } : {}),
    ...(t.schemaVersion !== void 0 ? { schemaVersion: t.schemaVersion } : {}),
    ...(t.includePackages !== void 0 ? { includePackages: t.includePackages } : {}),
    ...(t.syncMode !== void 0 ? { syncMode: t.syncMode } : {}),
    ...(t.syncLog !== void 0 ? { syncLog: t.syncLog } : {}),
    ...(t.syncLogPath !== void 0 ? { syncLogPath: t.syncLogPath } : {}),
  };
}
function r$(e, t, n, r, i) {
  if (Fw(e)) {
    e.id === t && n?.(e.progress);
    return;
  }
  if (!(!Mw(e) || e.id !== t)) {
    if (e.ok) {
      r(e.value);
      return;
    }
    i(t$(e.error ?? zV));
  }
}
async function i$(e, t, n, r) {
  let i = n(t);
  vc.add(i);
  let s = HV++;
  try {
    return await new Promise((o, a) => {
      let l = !1,
        c = (u) => {
          l || ((l = !0), o(u));
        },
        d = (u) => {
          l || ((l = !0), a(u));
        };
      (i.on("message", (u) => {
        r$(u, s, r, c, d);
      }),
        i.once("error", d),
        i.once("exit", (u) => {
          d(new Error(`Index sync worker exited with code ${u} before returning a result.`));
        }),
        i.postMessage(n$(s, e)));
    });
  } finally {
    (vc.delete(i), await jw(i));
  }
}
async function Ry(e, t = {}) {
  let n = t.workerPath === void 0 ? QV() : t.workerPath,
    r = e.onProgress ?? t.onProgress;
  if (!e$(t, n))
    return rc(e, {
      resolveIndexPaths: t.resolveIndexPaths,
      onProgress: r,
      syncLogSink: t.syncLogSink,
      yamlIndexPassDependencies: t.yamlIndexPassDependencies,
    });
  let i = !1;
  try {
    return await i$(e, n, t.createWorker ?? JV, (s) => {
      (en(e.projectPath, s), (i = !0), r?.(s));
    });
  } finally {
    i && tn(e.projectPath);
  }
}
var s$ = [
  "initialize",
  "get_tool_schemas",
  "shutdown",
  "status",
  "ping",
  "cancel",
  "index.ensure",
  "index.build",
  "index.sync",
  "lookup_vfs_entry",
  "vfs_ls",
  "vfs_glob",
  "vfs_read",
  "vfs_grep",
  "vfs_refs",
  "cowork.vfs_children",
  "cowork.vfs_entry",
  "cowork.vfs_search",
  "cowork.vfs_path_search",
  "cowork.vfs_refs",
];
function o$(e) {
  return s$.includes(e);
}
function xc(e) {
  let t;
  try {
    t = JSON.parse(e);
  } catch {
    throw new ut("INVALID_REQUEST", "Request line must be valid JSON.");
  }
  if (typeof t != "object" || t === null || Array.isArray(t))
    throw new ut("INVALID_REQUEST", "Request must be a JSON object.");
  let n = t,
    r = n.id,
    i = n.method;
  if (typeof r != "string" || r.trim() === "")
    throw new ut("INVALID_REQUEST", "Request requires a non-empty string 'id'.");
  if (typeof i != "string" || !o$(i)) throw new ut("INVALID_REQUEST", `Unknown or missing method: ${String(i)}`);
  let s = n.params;
  if (s !== void 0 && (typeof s != "object" || s === null || Array.isArray(s)))
    throw new ut("INVALID_REQUEST", "Optional 'params' must be a JSON object.");
  return { id: r.trim(), method: i, params: s };
}
function Vw(e) {
  return `${JSON.stringify(e)}
`;
}
function $w() {
  return { status: "event", event: "heavy_query_queued" };
}
function Vt(e, t, n, r = n) {
  return { id: e, status: "error", error: { code: t, message: n }, summary: r };
}
var ut = class extends Error {
  constructor(n, r) {
    super(r);
    this.code = n;
    this.name = "StdioProtocolError";
  }
  code;
};
var Ki = class {
  entries = new Map();
  requeuedWhileIndexing = new Set();
  markPending(t) {
    let n = new Date().toISOString();
    for (let r of t) {
      let i = Gr(r);
      if (!i) continue;
      let s = this.entries.get(i);
      if (s?.state === "indexing") {
        (this.requeuedWhileIndexing.add(i), this.entries.set(i, { ...s, lastSeenAt: n }));
        continue;
      }
      this.entries.set(i, { projectRelPath: i, state: "pending", firstSeenAt: s?.firstSeenAt ?? n, lastSeenAt: n });
    }
  }
  markIndexing(t) {
    let n = new Date().toISOString(),
      r = t && t.length > 0 ? t.map(Gr).filter(Boolean) : [...this.entries.keys()];
    for (let i of r) {
      this.requeuedWhileIndexing.delete(i);
      let s = this.entries.get(i);
      this.entries.set(i, { projectRelPath: i, state: "indexing", firstSeenAt: s?.firstSeenAt ?? n, lastSeenAt: n });
    }
  }
  markDone(t) {
    for (let n of t) {
      let r = Gr(n);
      if (!r) continue;
      if (!this.requeuedWhileIndexing.delete(r)) {
        this.entries.delete(r);
        continue;
      }
      let i = this.entries.get(r);
      i && this.entries.set(r, { ...i, state: "pending" });
    }
  }
  markError(t, n) {
    let r = Gr(t);
    if (!r) return;
    let i = new Date().toISOString(),
      s = this.entries.get(r);
    (this.requeuedWhileIndexing.delete(r),
      this.entries.set(r, {
        projectRelPath: r,
        state: "error",
        firstSeenAt: s?.firstSeenAt ?? i,
        lastSeenAt: i,
        errorMessage: n,
      }));
  }
  clear() {
    (this.entries.clear(), this.requeuedWhileIndexing.clear());
  }
  getEntries() {
    return [...this.entries.values()].sort((t, n) => t.projectRelPath.localeCompare(n.projectRelPath));
  }
  getStalePaths() {
    return this.getEntries()
      .filter((t) => t.state === "pending" || t.state === "indexing")
      .map((t) => t.projectRelPath);
  }
  isPathStale(t) {
    let n = wy(t);
    if (n.length === 0) return !1;
    for (let r of this.entries.values())
      if (!(r.state !== "pending" && r.state !== "indexing")) {
        for (let i of n)
          if (i === r.projectRelPath || i.startsWith(`${r.projectRelPath}/`) || r.projectRelPath.startsWith(`${i}/`))
            return !0;
      }
    return !1;
  }
  isIndexing() {
    return this.getEntries().some((t) => t.state === "indexing");
  }
};
function Gr(e) {
  return e.replace(/\\/g, "/").trim();
}
function wy(e) {
  let t = Gr(e);
  if (!t) return [];
  if (t.includes(":/")) {
    let n = t.split(":/")[0]?.trim();
    return n ? [n] : [];
  }
  return [t.replace(/\/$/, "") || t];
}
function Gw() {
  let e = process.env.UNITY_INSIGHT_WATCH_DEBOUNCE_MS,
    t = 3e4;
  if (!e?.trim()) return t;
  let n = Number.parseInt(e, 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, 100), 6e4) : t;
}
import { readdirSync as a$, realpathSync as Kw, statSync as l$, watch as c$ } from "node:fs";
import Kr from "node:path";
var d$ = ["Library/", "Logs/", "Temp/", "Obj/", "UserSettings/", "node_modules/", ".git/", ".gamecowork-cli/"],
  Py = 3,
  u$ = 6e4;
function f$(e) {
  if (process.platform !== "win32") return e;
  try {
    return Kw.native(e);
  } catch {
    try {
      return Kw(e);
    } catch {
      return e;
    }
  }
}
function m$(e) {
  if (!e || e.includes(":/")) return !0;
  for (let t of d$) if (e === t.slice(0, -1) || e.startsWith(t)) return !0;
  return Yt(e) === null;
}
function Yw(e, t) {
  let n = Kr.relative(e, t);
  if (!n || n.startsWith("..")) return null;
  let r = Gr(n);
  return m$(r) ? null : r;
}
function qw(e) {
  let t = f$(Kr.resolve(e.projectPath)),
    n = e.debounceMs ?? Gw(),
    r = e.log ?? (() => {}),
    i = [],
    s,
    o,
    a = new Map(),
    l = !1,
    c = !1,
    d = !1,
    u = 0,
    f = new Set(),
    m = new Map(),
    y = (E, w) => {
      if (d) return;
      for (let x of E) f.add(x);
      let T = Math.min(n * 2 ** Math.max(0, w - 1), u$);
      s = setTimeout(() => {
        ((s = void 0), h());
      }, T);
    },
    g = () => {
      d ||
        (s && clearTimeout(s),
        (s = setTimeout(() => {
          ((s = void 0), h());
        }, n)));
    },
    h = async () => {
      if (d) return;
      if (l) {
        c = !0;
        return;
      }
      l = !0;
      let E = Date.now(),
        w = [...f];
      f.clear();
      try {
        if (
          (w.length > 0 &&
            (e.pendingQueue.markPending(w),
            e.pendingQueue.markIndexing(w),
            r(`[unity-insight-watch] syncing ${w.length} changed path(s) after ${n}ms debounce`),
            e.log?.(`index.sync start project=${t} source=watcher path_count=${w.length}`, "INFO")),
          (await e.onDebouncedSync(w)) === "retry")
        ) {
          ((u += 1),
            r(`[unity-insight-watch] sync skipped (lock or build in progress); pending preserved (retry ${u})`, "WARN"),
            w.length > 0 && (e.pendingQueue.markPending(w), y(w, u)));
          return;
        }
        u = 0;
        for (let x of w) m.delete(x);
        (e.pendingQueue.markDone(w),
          e.log?.(`index.sync complete project=${t} source=watcher duration_ms=${Date.now() - E}`, "INFO"));
      } catch (T) {
        u = 0;
        let x = T instanceof Error ? T.message : String(T),
          O = [],
          F = 0;
        for (let Y of w) {
          e.pendingQueue.markError(Y, x);
          let K = (m.get(Y) ?? 0) + 1;
          (m.set(Y, K),
            K <= Py
              ? (O.push(Y), (F = Math.max(F, K)))
              : r(`[unity-insight-watch] sync failed permanently for ${Y} after ${Py} retries: ${x}`, "ERROR"));
        }
        O.length > 0
          ? (r(
              `[unity-insight-watch] sync failed; retrying ${O.length} path(s) automatically (retry ${F}/${Py}): ${x}`,
              "WARN",
            ),
            y(O, F))
          : r(`[unity-insight-watch] sync failed: ${x}`, "ERROR");
      } finally {
        ((l = !1), c && !d && ((c = !1), g()));
      }
    },
    b = (E) => {
      d || (m.delete(E), f.add(E), e.pendingQueue.markPending([E]), g());
    },
    S = (E, w, T) => {
      if (!T) return;
      let x = typeof T == "string" ? T : T.toString("utf8"),
        O = Kr.resolve(E, x),
        F = Yw(t, O);
      F && b(F);
    },
    P = [Kr.join(t, "Assets"), Kr.join(t, "ProjectSettings"), Kr.join(t, "Packages")],
    I = () => {
      if (d || o) return;
      a = Ww(t, P);
      let E = Math.max(250, n);
      ((o = setInterval(() => {
        let w = Ww(t, P),
          T = new Set();
        for (let [x, O] of w.entries()) a.get(x) !== O && T.add(x);
        for (let x of a.keys()) w.has(x) || T.add(x);
        a = w;
        for (let x of T) b(x);
      }, E)),
        r(`[unity-insight-watch] using polling fallback (interval ${E}ms)`));
    };
  for (let E of P)
    try {
      let w = c$(E, { recursive: !0 }, (T, x) => S(E, T, x));
      (w.on("error", (T) => {
        (r(`[unity-insight-watch] watcher error for ${E}: ${T instanceof Error ? T.message : String(T)}`), I());
      }),
        i.push(w));
    } catch (w) {
      (r(`[unity-insight-watch] failed to watch ${E}: ${w instanceof Error ? w.message : String(w)}`), I());
    }
  return (
    r(`[unity-insight-watch] watching Assets/, ProjectSettings/, Packages/ (debounce ${n}ms)`),
    {
      stop: () => {
        if (!d) {
          ((d = !0), (c = !1), s && (clearTimeout(s), (s = void 0)), o && (clearInterval(o), (o = void 0)));
          for (let E of i) E.close();
        }
      },
    }
  );
}
function Ww(e, t) {
  let n = new Map();
  for (let r of t) zw(e, r, n);
  return n;
}
function zw(e, t, n) {
  let r;
  try {
    r = l$(t);
  } catch {
    return;
  }
  if (r.isDirectory()) {
    for (let s of a$(t)) zw(e, Kr.join(t, s), n);
    return;
  }
  let i = Yw(e, t);
  i && n.set(i, r.mtimeMs);
}
function Nn(e) {
  return !(process.env.UNITY_INSIGHT_NO_WATCH?.trim() === "1" || e === !1);
}
function vy(e, t) {
  if (e.includes("--no-watch") || t["no-watch"] === "true" || process.env.UNITY_INSIGHT_NO_WATCH?.trim() === "1")
    return !1;
  if (e.includes("--watch") || t.watch === "true") return !0;
}
function Hw(e, t) {
  let n = Date.parse(e.lastSeenAt);
  return Number.isFinite(n) ? Math.max(0, t - n) : 0;
}
function y$(e, t) {
  let n = Hw(e, t),
    r = e.state === "indexing" ? "indexing in progress" : "pending sync";
  return `  - ${e.projectRelPath} (edited ${n}ms ago, ${r})`;
}
function p$(e) {
  if (e.length === 0) return null;
  let t = Date.now();
  return (
    `\u26A0\uFE0F Some files referenced below were edited since the last index sync \u2014 their Unity Insight entries may be stale:
` +
    e.map((r) => y$(r, t)).join(`
`) +
    "\nFor accurate content of those specific files, use `vfs_read` or Read them directly. The rest of this response is fresh."
  );
}
function g$(e) {
  if (e.length === 0) return null;
  let t = 5,
    n = Date.now(),
    r = e.slice(0, t),
    i = r.map((o) => {
      let a = Hw(o, n);
      return `  - ${o.projectRelPath} (edited ${a}ms ago)`;
    }),
    s = e.length > r.length ? ` (+${e.length - r.length} more)` : "";
  return `(Note: ${e.length} file(s) elsewhere in this project are pending index sync but were not referenced above${s}:
${i.join(`
`)})`;
}
function h$(e, t) {
  if (!t) return [];
  let n = new Set();
  for (let r of wy(e)) t.isPathStale(r) && n.add(r);
  return [...n];
}
function I$(e, t) {
  let n = new Set(t);
  return e.getEntries().filter((r) => (r.state === "pending" || r.state === "indexing") && n.has(r.projectRelPath));
}
function b$(e, t) {
  return e.getEntries().filter((n) => (n.state === "pending" || n.state === "indexing") && !t.has(n.projectRelPath));
}
function Qw(e, t) {
  if (!e) return { pendingPaths: [], indexingPaths: [], banner: null, footer: null };
  let n = new Set();
  for (let a of t) for (let l of h$(a, e)) n.add(l);
  let r = I$(e, [...n]),
    i = b$(e, n),
    s = r.map((a) => a.projectRelPath),
    o = r.filter((a) => a.state === "indexing").map((a) => a.projectRelPath);
  return { pendingPaths: s, indexingPaths: o, banner: p$(r), footer: g$(i) };
}
function xy(e, t, n = null) {
  return !t && !n
    ? e
    : [t, e, n].filter(Boolean).join(`

`);
}
function Xw(e, t) {
  if (!t) return [];
  let n = [],
    r = t.path;
  if ((typeof r == "string" && r.trim() !== "" && n.push(r.trim()), e === "vfs_grep" || e === "vfs_glob")) {
    let i = t.pattern;
    typeof i == "string" && i.includes("/");
  }
  return n;
}
var S$ = ["cowork.vfs_children", "cowork.vfs_entry", "cowork.vfs_search", "cowork.vfs_path_search", "cowork.vfs_refs"];
function eP(e) {
  return S$.includes(e);
}
function Tc(e) {
  return e.displayName || e.vfsPath.split("/").pop() || e.vfsPath;
}
function tP(e) {
  let t = e.replace(/\/+$/, ""),
    n = t.lastIndexOf("/"),
    r = t.lastIndexOf(":/");
  if (r >= 0 && r > n) {
    let s = t
      .slice(r + 2)
      .split("/")
      .pop();
    return s && s.length > 0 ? s : t;
  }
  return n >= 0 ? t.slice(n + 1) : t;
}
var kc = ":/.content",
  Eo = ":/.meta";
function ky(e) {
  return e.endsWith(kc);
}
function nP(e) {
  return e.endsWith(Eo);
}
function rP(e) {
  return ky(e) ? e.slice(0, -kc.length) : nP(e) ? e.slice(0, -Eo.length) : e;
}
function iP(e) {
  return ky(e) ? `${e.slice(0, -kc.length)}${Eo}` : e;
}
function Ro(e) {
  let { availability: t } = xt(e);
  return { ok: !1, ready: !1, error: t === "ready" ? "Unity Insight index is not queryable." : Hm(t, e) };
}
function wo(e) {
  return xt(e).availability === "ready";
}
function sP(e) {
  return e.includes("{guid:") || e.includes("--- !u!") || /,\s*guid\s*:/.test(e);
}
function Jw(e, t, n) {
  return qR(e) && e.sourceVfsPath?.trim() ? !0 : n != null && (mc(e, t) || sP(n));
}
async function Zw(e, t, n, r) {
  try {
    return await e.formatVfsReadContent({ projectPath: t, entry: n, content: r, softProjectionFallback: !0 });
  } catch {
    if (r == null) return r;
    try {
      return await e.formatVfsReadMetaContent({ projectPath: t, metaContent: r });
    } catch {
      return r;
    }
  }
}
async function Ty(e, t, n) {
  if (!sP(n)) return n;
  try {
    return await e.formatVfsReadMetaContent({ projectPath: t, metaContent: n });
  } catch {
    return n;
  }
}
async function _$(e, t, n) {
  let r = n.filter((s) => typeof s.hasChildren != "boolean"),
    i = r.length === 0 ? new Map() : await e.queryVfsEntrySummaries({ projectPath: t, paths: r.map((s) => s.vfsPath) });
  return n.map((s) => {
    let o = i.get(s.vfsPath),
      a = iP(s.vfsPath),
      l = a !== s.vfsPath;
    return {
      path: a,
      name: l ? ".meta" : Tc(s),
      entryType: s.entryType,
      entryKind: s.entryKind,
      hasChildren: typeof s.hasChildren == "boolean" ? s.hasChildren : (o?.directChildCount ?? 0) > 0,
      targetVfsPath: s.targetVfsPath ?? null,
      sizeBytes: s.sizeBytes ?? null,
    };
  });
}
async function E$(e, t, n) {
  if (!wo(t)) return { ...Ro(t), parentPath: null, entries: [] };
  let r = n?.parentPath ?? n?.parent_path,
    i = typeof r == "string" && r.trim() !== "" ? r.trim() : null,
    s =
      i == null
        ? (await e.queryVfsGlob({ projectPath: t, pattern: "*", ignoreCase: !0, limit: 500 })).filter(
            (a) => !a.parentVfsPath,
          )
        : await e.queryVfsChildren({ projectPath: t, path: i, depth: 1 }),
    o = await _$(e, t, s);
  return { ok: !0, ready: !0, parentPath: i, entries: o };
}
async function R$(e, t, n) {
  if (!wo(t)) return { ...Ro(t), entry: null };
  let r = n?.path ?? n?.vfsPath ?? n?.vfs_path;
  if (typeof r != "string" || r.trim() === "") return { ok: !1, ready: !0, entry: null, error: "path is required" };
  let i = r.trim();
  if (nP(i)) {
    let u = rP(i),
      f = await e.queryVfsEntryMetaContent({ projectPath: t, path: u }),
      m = f?.entry ?? null;
    if (!m) return { ok: !1, ready: !0, entry: null, error: `VFS entry not found: ${u}` };
    let y = f?.metaContent ?? null;
    return (
      y != null && (y = await Ty(e, t, y)),
      {
        ok: !0,
        ready: !0,
        entry: {
          path: i,
          name: ".meta",
          entryType: m.entryType,
          entryKind: m.entryKind,
          content: y,
          metaContent: null,
          sourceFilePath: m.sourceFilePath ?? null,
          lineStart: m.lineStart ?? null,
          lineEnd: m.lineEnd ?? null,
          sizeBytes: m.sizeBytes ?? null,
          targetVfsPath: m.targetVfsPath ?? null,
        },
      }
    );
  }
  let [s, o] = await Promise.all([
      e.queryVfsEntryContent({ projectPath: t, path: i }),
      e.queryVfsEntryMetaContent({ projectPath: t, path: i }),
    ]),
    a = s?.entry ?? o?.entry ?? null;
  if (!a) return { ok: !1, ready: !0, entry: null, error: `VFS entry not found: ${i}` };
  if (a.entryType === "file" && !i.includes(":/")) {
    let u = `${i}${kc}`,
      f = await e.queryVfsEntryContent({ projectPath: t, path: u }),
      m = f?.content ?? null;
    if (f && m != null) {
      let g = Ke(f.entry, { content: m });
      Jw(g, u, m) && (m = await Zw(e, t, f.entry, m));
    }
    let y = null;
    return (
      m == null && o?.metaContent != null && (y = await Ty(e, t, o.metaContent)),
      {
        ok: !0,
        ready: !0,
        entry: {
          path: a.vfsPath,
          name: Tc(a),
          entryType: a.entryType,
          entryKind: a.entryKind,
          content: m,
          metaContent: y,
          sourceFilePath: a.sourceFilePath ?? null,
          lineStart: a.lineStart ?? null,
          lineEnd: a.lineEnd ?? null,
          sizeBytes: a.sizeBytes ?? null,
          targetVfsPath: a.targetVfsPath ?? null,
        },
      }
    );
  }
  let c = s?.content ?? null;
  if (s) {
    let u = Ke(s.entry, { content: c });
    Jw(u, i, c) && (c = await Zw(e, t, s.entry, c));
  }
  let d = o?.metaContent ?? null;
  return (
    d != null && (d = await Ty(e, t, d)),
    {
      ok: !0,
      ready: !0,
      entry: {
        path: a.vfsPath,
        name: Tc(a),
        entryType: a.entryType,
        entryKind: a.entryKind,
        content: c,
        metaContent: d,
        sourceFilePath: a.sourceFilePath ?? null,
        lineStart: a.lineStart ?? null,
        lineEnd: a.lineEnd ?? null,
        sizeBytes: a.sizeBytes ?? null,
        targetVfsPath: a.targetVfsPath ?? null,
      },
    }
  );
}
function w$(e, t, n) {
  let r = n ? e : e.toLowerCase(),
    i = n ? t : t.toLowerCase();
  if (!i) return !1;
  let s = 0;
  for (; s <= r.length;) {
    let o = r.indexOf(i, s);
    if (o < 0) return !1;
    let a = o === 0 ? "" : r[o - 1],
      l = o + i.length,
      c = l >= r.length ? "" : r[l],
      d = !a || !/[\w]/.test(a),
      u = !c || !/[\w]/.test(c);
    if (d && u) return !0;
    s = o + 1;
  }
  return !1;
}
async function P$(e, t, n) {
  if (!wo(t)) return { ...Ro(t), results: [] };
  let r = n?.query ?? n?.pattern,
    i = typeof r == "string" ? r.trim() : "";
  if (!i) return { ok: !0, ready: !0, results: [] };
  let s = n?.matchCase === !0 || n?.match_case === !0,
    o = n?.matchWholeWord === !0 || n?.match_whole_word === !0,
    a = n?.limit,
    l = typeof a == "number" && Number.isFinite(a) ? Math.max(1, Math.min(500, Math.trunc(a))) : 200,
    c = await e.queryVfsSearch({ projectPath: t, query: i, ignoreCase: !s, limit: o ? Math.min(2e3, l * 8) : l }),
    d = [];
  for (let u of c) {
    if (o && !w$(u.text, i, s)) continue;
    let f = u.vfsPath;
    u.contentSource === "meta_content" && !u.vfsPath.includes(":/")
      ? (f = `${u.vfsPath}${Eo}`)
      : ky(u.vfsPath) && (f = rP(u.vfsPath));
    let m = f.endsWith(Eo);
    if (
      (d.push({
        path: f,
        name: m ? ".meta" : tP(f),
        entryType: "node",
        entryKind: u.entryKind || u.displayType || "unknown",
        lineNumber: u.line,
        lineText: u.text,
      }),
      d.length >= l)
    )
      break;
  }
  return { ok: !0, ready: !0, results: d };
}
function v$(e) {
  return `**${e.replace(/\\/g, "/").replace(/([*?[\]])/g, "\\$1")}**`;
}
async function x$(e, t, n) {
  if (!wo(t)) return { ...Ro(t), results: [] };
  let r = n?.query ?? n?.pattern,
    i = typeof r == "string" ? r.trim() : "";
  if (!i) return { ok: !0, ready: !0, results: [] };
  let s = n?.limit,
    o = typeof s == "number" && Number.isFinite(s) ? Math.max(1, Math.min(500, Math.trunc(s))) : 100,
    a = n?.offset,
    l = typeof a == "number" && Number.isFinite(a) ? Math.max(0, Math.trunc(a)) : 0;
  return {
    ok: !0,
    ready: !0,
    results: (
      await e.queryVfsGlob({
        projectPath: t,
        pattern: v$(i),
        ignoreCase: !0,
        limit: o,
        ...(l > 0 ? { offset: l } : {}),
      })
    ).map((d) => {
      let u = iP(d.vfsPath),
        f = u !== d.vfsPath;
      return { path: u, name: f ? ".meta" : Tc(d), entryType: d.entryType, entryKind: d.entryKind };
    }),
  };
}
async function T$(e, t, n) {
  if (!wo(t)) return { ...Ro(t), entries: [] };
  let r = n?.path ?? n?.vfsPath ?? n?.vfs_path;
  if (typeof r != "string" || r.trim() === "") return { ok: !1, ready: !0, entries: [], error: "path is required" };
  let i = r.trim(),
    s = typeof n?.direction == "string" ? n.direction.trim().toLowerCase() : "out",
    o = s === "in" || s === "both",
    a = s !== "in",
    l = n?.limit,
    c = typeof l == "number" && Number.isFinite(l) ? Math.max(1, Math.min(500, Math.trunc(l))) : 200,
    d = [];
  (o && d.push("in"), a && d.push("out"));
  let u = [],
    f = new Set();
  for (let m of d) {
    let y = await e.querySemanticVfsRefs({
      projectPath: t,
      requestedPath: i,
      semanticPath: i,
      mode: "reference",
      direction: m,
    });
    for (let g of y) {
      let h = m === "in" ? g.fromPath : g.toPath,
        b = m === "in" ? g.fromEntryType : g.toEntryType,
        S = m === "in" ? g.fromEntryKind : g.toEntryKind;
      if (
        !f.has(h) &&
        (f.add(h),
        u.push({ path: h, name: tP(h), entryType: b, entryKind: S, direction: m, edgeKind: g.edgeKind }),
        u.length >= c)
      )
        break;
    }
    if (u.length >= c) break;
  }
  return { ok: !0, ready: !0, entries: u };
}
async function oP(e, t, n, r, i, s) {
  let o = await e.withQuerySession(async () => {
    switch (n) {
      case "cowork.vfs_children":
        return E$(e, t, r);
      case "cowork.vfs_entry":
        return R$(e, t, r);
      case "cowork.vfs_search":
        return P$(e, t, r);
      case "cowork.vfs_path_search":
        return x$(e, t, r);
      case "cowork.vfs_refs":
        return T$(e, t, r);
      default: {
        let a = n;
        throw new Error(`Unsupported cowork method: ${String(a)}`);
      }
    }
  });
  return { id: i, status: "ok", data: o, summary: `Cowork ${n}`, elapsed_ms: Date.now() - s };
}
import aP from "node:path";
function k$(e) {
  return { projectPath: aP.resolve(e), pendingQueue: new Ki(), forceBuildRequested: !1 };
}
function Ny(e, t) {
  let n = aP.resolve(t),
    r = e.get(n);
  if (r) return r;
  let i = k$(n);
  return (e.set(n, i), i);
}
function lP() {
  let e = Promise.resolve();
  return {
    runExclusive(t) {
      let n = e.then(t, t);
      return (
        (e = n.then(
          () => {},
          () => {},
        )),
        n
      );
    },
  };
}
function N$(e) {
  return !!(e.buildInFlight || e.syncInFlight);
}
function Uy(e) {
  for (let t of e.values()) if (N$(t)) return !0;
  return !1;
}
function U$(e) {
  let t = [];
  for (let n of e.values()) (n.buildInFlight && t.push(n.buildInFlight), n.syncInFlight && t.push(n.syncInFlight));
  return t;
}
async function Ay(e, t) {
  let n = t === void 0 ? void 0 : Date.now() + t;
  for (;;) {
    let r = U$(e);
    if (r.length === 0) return !0;
    if (n === void 0) {
      await Promise.allSettled(r);
      continue;
    }
    let i = n - Date.now();
    if (i <= 0) return !1;
    let s,
      o = await Promise.race([
        Promise.allSettled(r).then(() => !0),
        new Promise((a) => {
          s = setTimeout(() => a(!1), i);
        }),
      ]);
    if ((s && clearTimeout(s), !o)) return !1;
  }
}
function cP(e) {
  for (let t of e.values()) (t.watcherHandle?.stop(), (t.watcherHandle = void 0));
}
var C$ = [
  "watcherHandle",
  "buildInFlight",
  "syncInFlight",
  "forceBuildRequested",
  "forceBuildAfterSyncScheduled",
  "lastBuildError",
  "lastSyncError",
];
function mP(e) {
  let t = {};
  for (let n of C$)
    t[n] = {
      configurable: !0,
      enumerable: !0,
      get: () => e[n],
      set: (r) => {
        e[n] = r;
      },
    };
  return t;
}
function Uc(e, t) {
  let n = Ce(t);
  if (e.projectSessions) return Ny(e.projectSessions, n);
  let r = { projectPath: e.projectPath ?? n, pendingQueue: e.pendingQueue };
  return (Object.defineProperties(r, mP(e)), r);
}
function yP(e, t) {
  ((e.projectPath = t.projectPath),
    (e.initialized = !0),
    e.projectSessions &&
      Object.defineProperties(e, {
        pendingQueue: { configurable: !0, enumerable: !0, get: () => t.pendingQueue },
        ...mP(t),
      }));
}
function pP(e) {
  let t = { ...e };
  return (
    Object.defineProperties(t, {
      authenticated: {
        configurable: !0,
        enumerable: !0,
        get: () => e.authenticated,
        set: (n) => {
          e.authenticated = n;
        },
      },
      shuttingDown: {
        configurable: !0,
        enumerable: !0,
        get: () => e.shuttingDown,
        set: (n) => {
          e.shuttingDown = n;
        },
      },
    }),
    t
  );
}
async function Oy(e, t) {
  return e.runIndexWriteExclusive ? e.runIndexWriteExclusive(t) : t();
}
var M$ = 100,
  F$ = 12e4,
  D$ = 100,
  j$ = 2e3,
  Ac = 3;
function dP(e) {
  return Math.min(D$ * 2 ** Math.max(0, e - 1), j$);
}
function Oc(e) {
  return e
    .getEntries()
    .filter((t) => t.state === "pending")
    .map((t) => t.projectRelPath);
}
function uP(e) {
  let t = e
    .getEntries()
    .filter((n) => n.state === "indexing")
    .map((n) => n.projectRelPath);
  (e.markPending(t), e.markDone(t));
}
function gP(e, t, n, r) {
  if (e.shuttingDown || t.buildInFlight || t.syncInFlight || t.forceBuildRequested) return;
  let i = new Promise((s) => {
    setTimeout(s, r.delayMs);
  }).then(() => {
    if ((t.syncInFlight === i && (t.syncInFlight = void 0), e.shuttingDown || t.buildInFlight)) return;
    let s = Oc(t.pendingQueue);
    s.length > 0 ? Cc(e, t, s, n, r.errorRetryCount) : r.retryFullSync && Cc(e, t, void 0, n, r.errorRetryCount);
  });
  t.syncInFlight = i;
}
function Cc(e, t, n, r, i = 0) {
  if (e.shuttingDown || t.buildInFlight || t.syncInFlight) return !1;
  let s = t.projectPath,
    o = n && n.length > 0 ? n.filter((f) => f.trim() !== "") : void 0;
  (o && t.pendingQueue.markPending(o),
    t.pendingQueue.markIndexing(o ?? t.pendingQueue.getStalePaths()),
    (t.lastSyncError = void 0));
  let a,
    l = 0,
    c = !1,
    d = (f) => {
      t.lastSyncError = f;
      for (let m of Oc(t.pendingQueue)) t.pendingQueue.markError(m, f);
    },
    u = Oy(e, () => Ry({ projectPath: s, paths: o }))
      .then((f) => {
        if (f.skipReason) {
          uP(t.pendingQueue);
          let m = `index.sync skipped (${f.skipReason})`;
          if (i < Ac) {
            ((a = dP(i + 1)), (l = i + 1), (c = o === void 0), r(`${m} for ${s}; retry ${l}/${Ac} in ${a}ms`));
            return;
          }
          (r(`${m} for ${s}; pausing after ${Ac} retries; paths kept pending`), (t.lastSyncError = m));
          return;
        }
        if (o) t.pendingQueue.markDone(o);
        else {
          let m = t.pendingQueue
            .getEntries()
            .filter((y) => y.state === "indexing")
            .map((y) => y.projectRelPath);
          t.pendingQueue.markDone(m);
        }
        Oc(t.pendingQueue).length > 0 && (a = 0);
      })
      .catch((f) => {
        let m = f instanceof Error ? f.message : String(f);
        if ((r(`index.sync failed for ${s}: ${m}`), uP(t.pendingQueue), !(f instanceof Ot) && i < Ac)) {
          ((a = dP(i + 1)), (l = i + 1), (c = o === void 0));
          return;
        }
        d(m);
      })
      .finally(() => {
        (t.syncInFlight === u && (t.syncInFlight = void 0),
          a !== void 0 && !t.forceBuildRequested && gP(e, t, r, { delayMs: a, errorRetryCount: l, retryFullSync: c }));
      });
  return ((t.syncInFlight = u), !0);
}
function hP(e, t, n, r, i) {
  if (t.buildInFlight) {
    r && (t.forceBuildRequested = !0);
    return;
  }
  ((t.forceBuildRequested = r), (t.forceBuildAfterSyncScheduled = !1), tn(n), (t.lastBuildError = void 0));
  let s = t.pendingQueue.getStalePaths();
  t.pendingQueue.markDone(s);
  let o = !1,
    a = Oy(e, () => V$(n, () => t.forceBuildRequested))
      .then(() => {
        o = !0;
        let l = t.pendingQueue
          .getEntries()
          .filter((c) => c.state === "error")
          .map((c) => c.projectRelPath);
        t.pendingQueue.markDone(l);
      })
      .catch((l) => {
        t.pendingQueue.markPending(s);
        let c = l instanceof Error ? l.message : String(l);
        ((t.lastBuildError = c), i.log(`index.build failed for ${n}: ${c}`));
      })
      .finally(() => {
        if (
          (t.buildInFlight === a && ((t.buildInFlight = void 0), (t.forceBuildRequested = !1)),
          o && !e.shuttingDown && !t.syncInFlight)
        ) {
          let l = t.pendingQueue.getStalePaths();
          l.length > 0 && Cc(e, t, l, i.log);
        }
      });
  t.buildInFlight = a;
}
function B$(e, t, n, r) {
  ((t.forceBuildRequested = !0),
    !(t.buildInFlight || t.forceBuildAfterSyncScheduled) &&
      ((t.forceBuildAfterSyncScheduled = !0),
      en(n, { phase: "waiting", current: 0, total: 1, status: "Waiting for in-flight index sync..." }),
      (async () => {
        try {
          for (; t.syncInFlight && !t.buildInFlight;) {
            let i = t.syncInFlight;
            if (!i) break;
            r.log(`index.build force waiting for in-flight sync on ${n}`);
            try {
              await i;
            } catch {}
            t.syncInFlight === i && (t.syncInFlight = void 0);
          }
          !t.buildInFlight && !e.shuttingDown && t.forceBuildRequested && hP(e, t, n, !0, r);
        } catch (i) {
          let s = i instanceof Error ? i.message : String(i);
          (r.log(`index.build force after sync failed for ${n}: ${s}`), (t.forceBuildAfterSyncScheduled = !1));
        }
      })()));
}
async function V$(e, t) {
  let n = Date.now() + F$;
  for (;;)
    try {
      await Ow(
        { projectPath: e },
        { shouldSkipAfterLock: () => !t() && xt(e, { requireQueryableVfs: !0 }).indexReady },
      );
      return;
    } catch (r) {
      if (r instanceof xn) return;
      if (!Wt(r) || Date.now() >= n) throw r;
      await new Promise((i) => {
        setTimeout(i, M$);
      });
    }
}
function $$(e) {
  return e.map((t) => ({
    name: t.name,
    displayName: t.displayName,
    description: t.description,
    parameterSchema: t.parameterSchema,
  }));
}
function Wr(e, t, n) {
  let r = t?.project_path,
    i = null;
  return (
    typeof r == "string" && r.trim() !== "" ? (i = Ce(r.trim())) : n && (i = Ce(typeof n == "function" ? n() : n)),
    i && _P(e, i),
    i
  );
}
function IP(e) {
  let t = e?.capability_token;
  if (typeof t != "string") return;
  let n = t.trim();
  return n === "" ? void 0 : n;
}
function fP(e) {
  return A$("sha256").update(e, "utf8").digest();
}
function bP(e, t) {
  return e ? L$(fP(e), fP(t)) : !1;
}
function G$(e, t) {
  let n = Ce(e),
    r = Ce(t);
  if (n === r) return !0;
  let i = Lc.relative(r, n);
  return i !== "" && !i.startsWith("..") && !Lc.isAbsolute(i);
}
function SP(e = process.env) {
  let t = e.UNITY_INSIGHT_ALLOWED_PROJECT_ROOTS?.trim();
  return t
    ? t
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n !== "")
        .map((n) => Ce(n))
    : [];
}
function Ly(e, t) {
  if (!e.auth) return;
  let n = IP(t);
  if (!bP(n, e.auth.capabilityToken))
    throw new Ne(
      "UNAUTHORIZED",
      "Shared serve requires a valid 'capability_token' (from ~/.unity-insight/.serve.lock).",
    );
  e.authenticated = !0;
}
function K$(e, t, n) {
  if (!e.auth || e.authenticated || t === "initialize" || t === "ping" || t === "cancel") return;
  let r = IP(n);
  if (bP(r, e.auth.capabilityToken)) {
    e.authenticated = !0;
    return;
  }
  throw new Ne(
    "UNAUTHORIZED",
    "Shared serve connection is not authenticated. Call initialize or ping with capability_token first.",
  );
}
function _P(e, t) {
  let n = e.auth?.allowedProjectRoots ?? [];
  if (n.length !== 0 && !n.some((r) => G$(t, r)))
    throw new Ne("PROJECT_NOT_ALLOWED", `Project path is not under UNITY_INSIGHT_ALLOWED_PROJECT_ROOTS: ${t}`);
}
async function EP(e) {
  let t;
  try {
    t = await O$(e);
  } catch {
    throw new Ne("PROJECT_PATH_NOT_FOUND", `Unity project path does not exist: ${e}`);
  }
  if (!t.isDirectory()) throw new Ne("PROJECT_PATH_NOT_DIRECTORY", `Unity project path is not a directory: ${e}`);
}
function RP(e) {
  let { availability: t } = xt(e);
  return t === "ready" ? null : hR(t, e);
}
function cn(e) {
  if (!e.initialized || !e.projectPath)
    throw new Ne("NOT_INITIALIZED", "Server not initialized. Call initialize first.");
  return e.projectPath;
}
var W$ = new Set(["status", "index.ensure", "index.build", "index.sync"]);
async function Cy(e, t) {
  K$(e, t.method, t.params);
  let n;
  if (t.method === "initialize") {
    if ((Ly(e, t.params), (n = Wr(e, t.params, e.projectPath)), !n))
      throw new Ne("INVALID_PARAMS", "initialize requires 'project_path'.");
  } else
    W$.has(t.method)
      ? (n = Wr(e, t.params, () => cn(e)))
      : (t.method === "lookup_vfs_entry" || t.method.startsWith("vfs_") || t.method.startsWith("cowork.vfs_")) &&
        ((n = Ce(cn(e))), _P(e, n));
  if (n) return (await EP(n), n);
}
function Y$(e, t) {
  return { ...e, project_path: t };
}
async function q$(e, t, n) {
  let r = cn(e),
    i = RP(r);
  if (i) return i;
  let s = e.toolDefinitions.get(t);
  if (!s) throw new Ne("UNKNOWN_TOOL", `Unknown Unity Insight tool: ${t}`);
  return s.execute(Y$(n ?? {}, r));
}
var Ne = class extends Error {
  constructor(n, r) {
    super(r);
    this.code = n;
    this.name = "ServeHandlerError";
  }
  code;
};
function $t(e) {
  if (e?.aborted) throw new Ne("CANCELLED", "Request was cancelled by the client.");
}
function z$(e, t, n = 50) {
  return [...new Set([...t, ...e])].slice(0, n);
}
function H$(e, t, n) {
  if (!e.watchEnabled || t.watcherHandle) return;
  let r = t.projectPath;
  t.watcherHandle = qw({
    projectPath: r,
    pendingQueue: t.pendingQueue,
    log: n.log,
    onDebouncedSync: async (i) => {
      if (t.buildInFlight || t.syncInFlight) return "retry";
      if (!it(Be(r))) return;
      t.pendingQueue.markIndexing(i);
      let s,
        o = Oy(e, () => Ry({ projectPath: r, paths: i.length > 0 ? i : void 0 })).then((d) => {
          s = d;
        }),
        a = o.catch(() => {});
      t.syncInFlight = a;
      let l = () => {
          t.syncInFlight === a && (t.syncInFlight = void 0);
        },
        c = () => {
          gP(e, t, n.log, { delayMs: 0 });
        };
      try {
        await o;
      } catch (d) {
        throw (l(), Oc(t.pendingQueue).length > 0 && c(), d);
      }
      if ((l(), s?.skipReason)) return "retry";
      c();
    },
  });
}
function Mc(e, t = {}) {
  let n = t.shared?.queryService ?? Gi({ persistentConnections: ir() }),
    r = t.shared?.toolDefinitions ?? new Map($r({ queryService: n }).map((o) => [o.name, o])),
    i = typeof e == "string" && e.trim() !== "" ? Lc.resolve(e.trim()) : void 0,
    s = {
      projectPath: i,
      initialized: !!i,
      shuttingDown: !1,
      shutdownMode: t.shutdownMode ?? "server",
      watchEnabled: t.watchEnabled !== void 0 ? t.watchEnabled : Nn(),
      queryService: n,
      toolDefinitions: r,
      pendingQueue: new Ki(),
      forceBuildRequested: !1,
      projectSessions: t.shared?.projectSessions,
      runIndexWriteExclusive: t.shared?.runIndexWriteExclusive,
      auth: t.shared?.auth,
      authenticated: !t.shared?.auth,
    };
  if (t.shared?.lifecycle) {
    let o = t.shared.lifecycle;
    Object.defineProperty(s, "shuttingDown", {
      configurable: !0,
      enumerable: !0,
      get: () => o.shuttingDown,
      set: (a) => {
        o.shuttingDown = a;
      },
    });
  }
  return (i && s.projectSessions && yP(s, Ny(s.projectSessions, i)), s);
}
async function My(e, t, n, r) {
  let i = Date.now();
  try {
    switch ((await Cy(e, t), $t(r), t.method)) {
      case "ping":
        return (
          Ly(e, t.params),
          {
            id: t.id,
            status: "ok",
            data: { protocolVersion: 4, instanceId: e.auth?.instanceId, authenticated: e.authenticated },
            summary: "pong",
            elapsed_ms: Date.now() - i,
          }
        );
      case "cancel":
        return {
          id: t.id,
          status: "ok",
          data: { cancelled: !1 },
          summary: "Cancel request acknowledged (no matching in-flight id).",
          elapsed_ms: Date.now() - i,
        };
      case "initialize": {
        Ly(e, t.params);
        let s = Wr(e, t.params, e.projectPath);
        if (!s) throw new Ne("INVALID_PARAMS", "initialize requires 'project_path'.");
        (await EP(s), $t(r));
        let o = xt(s),
          a = Date.now(),
          l = 0,
          c = !1;
        if (o.indexReady) {
          c = !0;
          try {
            (await e.queryService.warmupProjectIndex(s), (l = Date.now() - a), $t(r));
          } catch (u) {
            l = Date.now() - a;
            let f = u instanceof Error ? u.message : String(u);
            n.log(`Index warmup skipped: ${f}`);
          }
        }
        (n.log(
          `switch-timing initialize project=${Lc.basename(s)} warmupRan=${c} warmupMs=${l} totalMs=${Date.now() - i}`,
          "INFO",
        ),
          $t(r));
        let d = Uc(e, s);
        return (
          yP(e, d),
          H$(e, d, n),
          {
            id: t.id,
            status: "ok",
            data: {
              protocolVersion: 4,
              version: Li(),
              gitCommit: Oi(),
              projectPath: s,
              instanceId: e.auth?.instanceId,
              indexReady: o.indexReady,
              indexBuilding: o.indexBuilding,
              indexPath: o.indexPath,
              writer: ii(Be(s)),
              capabilities: [...e.toolDefinitions.keys()],
              watchEnabled: e.watchEnabled,
            },
            summary: "Unity Insight stdio server initialized.",
            elapsed_ms: Date.now() - i,
          }
        );
      }
      case "get_tool_schemas":
        return {
          id: t.id,
          status: "ok",
          data: { toolSchemas: $$(lc) },
          summary: "Unity Insight tool schemas.",
          elapsed_ms: Date.now() - i,
        };
      case "shutdown":
        return e.shutdownMode === "server"
          ? ((e.shuttingDown = !0),
            e.watcherHandle?.stop(),
            (e.watcherHandle = void 0),
            {
              id: t.id,
              status: "ok",
              data: { shuttingDown: !0 },
              summary: "Unity Insight stdio server shutting down.",
              elapsed_ms: Date.now() - i,
            })
          : {
              id: t.id,
              status: "ok",
              data: { shuttingDown: !0, clientDisconnect: !0 },
              summary: "Unity Insight shared serve client disconnecting; daemon keeps running.",
              elapsed_ms: Date.now() - i,
            };
      case "status": {
        let s = Wr(e, t.params, () => cn(e));
        if (!s) throw new Ne("INVALID_PARAMS", "status requires an initialized project or 'project_path'.");
        let o = Uc(e, s),
          a = xt(s, { requireQueryableVfs: t.params?.requireQueryableVfs === !0 }),
          l = vn(s),
          c = !!o.buildInFlight || l != null,
          d = !!o.syncInFlight || a.indexSyncing,
          u = o.pendingQueue.getStalePaths(),
          f = o.pendingQueue.getEntries();
        if (t.params?.light === !0 || t.params?.mode === "light")
          return {
            id: t.id,
            status: "ok",
            data: {
              projectPath: s,
              indexReady: a.indexReady,
              indexBuilding: c,
              indexSyncing: d,
              indexPath: a.indexPath,
              indexMtimeMs: a.indexMtimeMs,
              schemaVersion: null,
              protocolVersion: 4,
              indexedAt: null,
              lastMode: null,
              discoveredFileCount: null,
              diagnosticCount: null,
              pendingSyncPaths: u,
              watcherPendingPaths: u,
              watcherIndexing: o.pendingQueue.isIndexing(),
              pendingEntries: f,
              reconcile: null,
              progressPercent: l?.percent ?? null,
              progressPhase: l?.phase ?? null,
              progressDetail: l?.detail ?? null,
              lastBuildError: o.lastBuildError ?? null,
              lastSyncError: o.lastSyncError ?? null,
              light: !0,
            },
            summary: "Unity Insight status (light).",
            elapsed_ms: Date.now() - i,
          };
        let y = await e.queryService.queryIndexStatus({ projectPath: s });
        $t(r);
        let g = z$(y.pendingSyncPaths, u);
        return {
          id: t.id,
          status: "ok",
          data: {
            projectPath: s,
            indexReady: y.indexReady,
            indexBuilding: c,
            indexSyncing: d,
            indexPath: y.publishedIndexPath,
            indexMtimeMs: a.indexPath === y.publishedIndexPath ? a.indexMtimeMs : void 0,
            writer: y.writer,
            schemaVersion: y.schemaVersion,
            protocolVersion: 4,
            indexedAt: y.indexedAt,
            lastMode: y.lastMode,
            discoveredFileCount: y.discoveredFileCount,
            diagnosticCount: y.diagnosticCount,
            pendingSyncPaths: g,
            watcherPendingPaths: u,
            watcherIndexing: o.pendingQueue.isIndexing(),
            pendingEntries: f,
            reconcile: y.reconcile,
            progressPercent: y.progressPercent,
            progressPhase: y.progressPhase,
            progressDetail: y.progressDetail,
            lastBuildError: o.lastBuildError ?? null,
            lastSyncError: o.lastSyncError ?? null,
          },
          summary: "Unity Insight status.",
          elapsed_ms: Date.now() - i,
        };
      }
      case "index.ensure": {
        let s = Wr(e, t.params, () => cn(e));
        if (!s) throw new Ne("INVALID_PARAMS", "index.ensure requires an initialized project or 'project_path'.");
        let o = xt(s, { requireQueryableVfs: !0 }).indexReady ? "sync" : "build",
          a = o === "build" ? "index.build" : "index.sync",
          l = o === "build" ? { ...t.params, requireQueryableVfs: !0 } : t.params,
          c = await My(e, { ...t, method: a, params: l }, n, r);
        return c.status === "error" ? c : { ...c, data: { ...c.data, action: o } };
      }
      case "index.build": {
        let s = Wr(e, t.params, () => cn(e));
        if (!s) throw new Ne("INVALID_PARAMS", "index.build requires an initialized project or 'project_path'.");
        let o = Uc(e, s),
          a = xt(s, { requireQueryableVfs: t.params?.requireQueryableVfs === !0 }),
          l = t.params?.force === !0,
          c = !!o.buildInFlight;
        if ((c && l && (o.forceBuildRequested = !0), a.indexReady && !c && !l))
          return {
            id: t.id,
            status: "ok",
            data: { projectPath: s, triggered: !1, indexReady: !0, indexBuilding: !1, progressPercent: null },
            summary: `Index already ready for ${s}.`,
            elapsed_ms: Date.now() - i,
          };
        if (o.syncInFlight && !o.buildInFlight) {
          if (!l)
            return {
              id: t.id,
              status: "ok",
              data: {
                projectPath: s,
                triggered: !1,
                indexReady: a.indexReady,
                indexBuilding: !1,
                indexSyncing: !0,
                deferred: !0,
                reason: "index_sync_in_progress",
                progressPercent: null,
                progressPhase: null,
                progressDetail: null,
              },
              summary: `Index sync already in progress for ${s}; build not started.`,
              elapsed_ms: Date.now() - i,
            };
          ($t(r), B$(e, o, s, n));
          let f = vn(s);
          return {
            id: t.id,
            status: "ok",
            data: {
              projectPath: s,
              triggered: !0,
              indexReady: a.indexReady,
              indexBuilding: !0,
              indexSyncing: !0,
              progressPercent: f?.percent ?? 0,
              progressPhase: f?.phase ?? "waiting",
              progressDetail: f?.detail ?? null,
            },
            summary: `Index build queued after in-flight sync for ${s}.`,
            elapsed_ms: Date.now() - i,
          };
        }
        let d = !!o.buildInFlight;
        (d && l && (o.forceBuildRequested = !0), d || ($t(r), hP(e, o, s, l, n)));
        let u = vn(s);
        return {
          id: t.id,
          status: "ok",
          data: {
            projectPath: s,
            triggered: !d,
            indexReady: a.indexReady,
            indexBuilding: !0,
            progressPercent: u?.percent ?? null,
            progressPhase: u?.phase ?? null,
            progressDetail: u?.detail ?? null,
          },
          summary: d ? `Index build already in progress for ${s}.` : `Started index build for ${s}.`,
          elapsed_ms: Date.now() - i,
        };
      }
      case "index.sync": {
        let s = Wr(e, t.params, () => cn(e));
        if (!s) throw new Ne("INVALID_PARAMS", "index.sync requires an initialized project or 'project_path'.");
        let o = Uc(e, s);
        if (xt(s).availability === "no_index")
          throw new Ne("INDEX_NOT_FOUND", `Unity Insight index not found for ${s}. Run index.build first.`);
        let l = t.params?.paths,
          c = Array.isArray(l) ? l.filter((y) => typeof y == "string" && y.trim() !== "") : void 0,
          d = !!o.syncInFlight,
          u = !!o.buildInFlight;
        ($t(r), c && (d || u) && o.pendingQueue.markPending(c));
        let f = !1;
        !d && !u && (f = Cc(e, o, c, n.log));
        let m;
        return (
          f
            ? (m = `Started index sync for ${s}.`)
            : d
              ? (m = `Index sync already in progress for ${s}.`)
              : (m = `Index build already in progress for ${s}; sync not started.`),
          {
            id: t.id,
            status: "ok",
            data: { projectPath: s, triggered: f, indexSyncing: !!o.syncInFlight, paths: c ?? null },
            summary: m,
            elapsed_ms: Date.now() - i,
          }
        );
      }
      case "lookup_vfs_entry": {
        let s = cn(e),
          o = RP(s);
        if (o)
          return {
            id: t.id,
            status: "ok",
            data: { entry: null, guidance: !0 },
            summary: o.returnDisplay,
            llmContent: o.llmContent,
            returnDisplay: o.returnDisplay,
            elapsed_ms: Date.now() - i,
          };
        let a = t.params?.path;
        if (typeof a != "string" || a.trim() === "")
          throw new Ne("INVALID_PARAMS", "lookup_vfs_entry requires string 'path'.");
        let l = await e.queryService.queryVfsEntry({ projectPath: s, path: a });
        return (
          $t(r),
          {
            id: t.id,
            status: "ok",
            data: { entry: l },
            summary: l ? `Resolved VFS entry for ${a}.` : `No VFS entry found for ${a}.`,
            elapsed_ms: Date.now() - i,
          }
        );
      }
      case "vfs_ls":
      case "vfs_glob":
      case "vfs_read":
      case "vfs_grep":
      case "vfs_refs": {
        let s = cn(e),
          o = await q$(e, t.method, t.params);
        if (($t(r), o.error))
          return Vt(t.id, o.error.code ?? "TOOL_EXECUTION_FAILED", o.error.message, o.returnDisplay);
        let a = Xw(t.method, t.params),
          l = Qw(e.pendingQueue, a),
          c = xt(s),
          d = gR(c, l.banner),
          u = c.indexBuilding ? null : l.footer,
          f = xy(o.llmContent, d, u),
          m = xy(o.returnDisplay, d, u);
        return {
          id: t.id,
          status: "ok",
          summary: o.returnDisplay,
          data: { staleness: { pendingPaths: l.pendingPaths, indexingPaths: l.indexingPaths, banner: d, footer: u } },
          llmContent: f,
          returnDisplay: m,
          elapsed_ms: Date.now() - i,
        };
      }
      case "cowork.vfs_children":
      case "cowork.vfs_entry":
      case "cowork.vfs_search":
      case "cowork.vfs_path_search":
      case "cowork.vfs_refs": {
        let s = cn(e);
        if (!eP(t.method)) throw new Ne("UNKNOWN_METHOD", `Unsupported method: ${t.method}`);
        let o = await oP(e.queryService, s, t.method, t.params, t.id, i);
        return ($t(r), o);
      }
      default: {
        let s = t.method;
        throw new Ne("UNKNOWN_METHOD", `Unsupported method: ${String(s)}`);
      }
    }
  } catch (s) {
    return s instanceof Ne
      ? Vt(t.id, s.code, s.message)
      : Vt(t.id, "INTERNAL_ERROR", s instanceof Error ? s.message : String(s));
  }
}
import { Readable as Q$ } from "node:stream";
import { StringDecoder as Fy } from "node:string_decoder";
var wP = 16 * 1024 * 1024;
function Po(e = process.env) {
  let t = e.UNITY_INSIGHT_MAX_NDJSON_LINE_BYTES?.trim();
  if (!t) return wP;
  let n = Number.parseInt(t, 10);
  return !Number.isFinite(n) || n < 1 ? wP : n;
}
var dn = class extends Error {
  constructor(n) {
    super(`NDJSON request line exceeds ${n} bytes.`);
    this.maxBytes = n;
    this.name = "NdjsonLineLimitError";
  }
  maxBytes;
};
function X$(e) {
  return e instanceof Q$ ? e.iterator({ destroyOnReturn: !1 }) : e;
}
function PP(e) {
  return e.endsWith("\r") ? e.slice(0, -1) : e;
}
function J$(e, t, n, r) {
  if (e + t - (r ? 1 : 0) > n) throw new dn(n);
}
function Z$(e, t) {
  return t.length === 0 ? e.endsWith("\r") : typeof t == "string" ? t.endsWith("\r") : t[t.length - 1] === 13;
}
async function* Fc(e, t = Po()) {
  let n = "",
    r = 0,
    i = new Fy("utf8");
  function s(a, l) {
    let c = Buffer.byteLength(a, "utf8");
    J$(r, c, t, Z$(n, a));
    let d;
    if ((Buffer.isBuffer(a) ? (d = i.write(a)) : ((d = i.end() + a), (i = new Fy("utf8"))), !l)) {
      ((n += d), (r += c));
      return;
    }
    let u = PP(n + d + i.end());
    if (((i = new Fy("utf8")), Buffer.byteLength(u, "utf8") > t)) throw new dn(t);
    return ((n = ""), (r = 0), u);
  }
  for await (let a of X$(e)) {
    if (Buffer.isBuffer(a)) {
      let d = 0;
      for (; d < a.length;) {
        let u = a.indexOf(10, d),
          f = u < 0 ? a.length : u,
          m = s(a.subarray(d, f), u >= 0);
        (m !== void 0 && (yield m), (d = f + 1));
      }
      continue;
    }
    let l = typeof a == "string" ? a : String(a),
      c = 0;
    for (; c < l.length;) {
      let d = l.indexOf(
          `
`,
          c,
        ),
        u = d < 0 ? l.length : d,
        f = s(l.slice(c, u), d >= 0);
      (f !== void 0 && (yield f), (c = u + 1));
    }
  }
  let o = i.end();
  if ((o && (n += o), n.length > 0)) {
    if (r > t) throw new dn(t);
    let a = PP(n);
    if (Buffer.byteLength(a, "utf8") > t) throw new dn(t);
    yield a;
  }
}
async function vo(e, t, n, r) {
  let i = t.trim();
  if (!i) return;
  let s = "unknown",
    o = "unknown",
    a = Date.now();
  try {
    let l = xc(i);
    ((s = l.id), (o = l.method), n.log(`rpc request start id=${s} method=${o}`, "DEBUG"));
    let c = await eG(e, l, n, r);
    if (c.status === "ok")
      n.log(`rpc request complete id=${s} method=${o} status=ok elapsed_ms=${Date.now() - a}`, "DEBUG");
    else {
      let d = c.error.code === "INTERNAL_ERROR" ? "ERROR" : "WARN";
      n.log(`rpc request failed id=${s} method=${o} code=${c.error.code} elapsed_ms=${Date.now() - a}`, d);
    }
    return c;
  } catch (l) {
    return l instanceof ut
      ? (n.log(`rpc request failed id=${s} method=${o} code=${l.code} elapsed_ms=${Date.now() - a}`, "WARN"),
        Vt(s, l.code, l.message))
      : (n.log(`rpc request failed id=${s} method=${o} code=INTERNAL_ERROR elapsed_ms=${Date.now() - a}`, "ERROR"),
        Vt(s, "INTERNAL_ERROR", l instanceof Error ? l.message : String(l)));
  }
}
async function eG(e, t, n, r) {
  return My(e, t, n, r);
}
function Dc(e, t) {
  return e.write(Vw(t));
}
function vP(e, t) {
  return e.shutdownMode === "server"
    ? e.shuttingDown
    : t.status === "ok" && t.data?.shuttingDown === !0 && t.data?.clientDisconnect === !0;
}
import { closeSync as xP, mkdirSync as tG, openSync as nG, writeSync as rG } from "node:fs";
import { readdir as iG, rm as sG, stat as oG } from "node:fs/promises";
import jy from "node:path";
import { format as qr } from "node:util";
import { BroadcastChannel as aG, threadId as p6 } from "node:worker_threads";
var Wi = { DEBUG: 10, INFO: 20, WARN: 30, ERROR: 40, OFF: 50 },
  lG = 10080 * 60 * 1e3,
  cG = /^\d{8}T\d{6}\.\d{3}-p(\d+)\.log$/,
  dG = "unity-insight-process-log",
  Dy = { debug: "DEBUG", log: "INFO", info: "INFO", warn: "WARN", error: "ERROR", trace: "ERROR" },
  kt,
  jc = class {
    debug() {}
    info() {}
    warn() {}
    error() {}
    close() {
      kt === this && (kt = void 0);
    }
  },
  By = class {
    constructor(t, n, r) {
      this.minimumLevel = n;
      this.directStderr = r;
      ((this.descriptor = t), this.installConsoleTee(), this.installWorkerListener());
    }
    minimumLevel;
    directStderr;
    descriptor;
    startedAt = Date.now();
    originalConsole = new Map();
    channel;
    reportedWriteFailure = !1;
    debug(...t) {
      this.writeFormatted("DEBUG", qr(...t));
    }
    info(...t) {
      this.writeFormatted("INFO", qr(...t));
    }
    warn(...t) {
      this.writeFormatted("WARN", qr(...t));
    }
    error(...t) {
      this.writeFormatted("ERROR", qr(...t));
    }
    writeFormatted(t, n, r = new Date(), i) {
      if (!(this.descriptor === void 0 || Wi[t] < Wi[this.minimumLevel]))
        try {
          rG(this.descriptor, fG({ date: r, pid: process.pid, threadId: i, level: t, message: n }));
        } catch (s) {
          this.disableAfterWriteFailure(s);
        }
    }
    close(t) {
      if (
        (this.info(`process exit code=${t} duration_ms=${Date.now() - this.startedAt}`),
        this.restoreConsole(),
        this.channel?.close(),
        (this.channel = void 0),
        this.descriptor !== void 0)
      ) {
        try {
          xP(this.descriptor);
        } catch {}
        this.descriptor = void 0;
      }
      kt === this && (kt = void 0);
    }
    installConsoleTee() {
      pG(console, this.originalConsole, (n, r) => this.writeFormatted(n, r));
    }
    restoreConsole() {
      let t = console;
      for (let [n, r] of this.originalConsole) t[n] = r;
      this.originalConsole.clear();
    }
    installWorkerListener() {
      try {
        let t = new aG(dG);
        ((t.onmessage = ({ data: n }) => {
          hG(n) && this.writeFormatted(n.level, n.message, new Date(n.timestamp), n.threadId);
        }),
          t.unref(),
          (this.channel = t));
      } catch {}
    }
    disableAfterWriteFailure(t) {
      if (this.descriptor !== void 0) {
        try {
          xP(this.descriptor);
        } catch {}
        this.descriptor = void 0;
      }
      if (!this.reportedWriteFailure) {
        this.reportedWriteFailure = !0;
        try {
          this.directStderr(`[unity-insight] file logging disabled: ${UP(t)}
`);
        } catch {}
      }
    }
  };
function TP(e) {
  let t = e?.trim();
  if (!t) return { level: "INFO" };
  let n = t.toUpperCase();
  return n in Wi ? { level: n } : { level: "INFO", invalidValue: t };
}
function Bc(e) {
  let t = TP(process.env.UNITY_INSIGHT_LOG_LEVEL).level;
  return Wi[e] >= Wi[t];
}
function uG(e, t) {
  return `${NP(e, !1).replace(/[-:]/g, "")}-p${t}.log`;
}
function fG(e) {
  let t = e.threadId === void 0 ? "" : ` [thread=${e.threadId}]`,
    n = `${NP(e.date, !0)} [pid=${e.pid}]${t} [${e.level}]`,
    r = e.message.replace(
      /\r\n/g,
      `
`,
    ).split(`
`);
  return (
    r.length > 1 && r.at(-1) === "" && r.pop(),
    `${r.map((i) => `${n} ${i}`).join(`
`)}
`
  );
}
function kP(e = {}) {
  if (kt) return kt;
  let t = TP(process.env.UNITY_INSIGHT_LOG_LEVEL);
  if (t.level === "OFF") return ((kt = new jc()), kt);
  let n =
    e.stderr ??
    ((r) => {
      process.stderr.write(r);
    });
  try {
    let r = jy.join(Ci(), "logs"),
      i = jy.join(r, uG(new Date(), process.pid));
    tG(r, { recursive: !0, mode: 448 });
    let s = nG(i, "a", 384),
      o = new By(s, t.level, n);
    kt = o;
    let a = bG(e.argv ?? process.argv.slice(2));
    return (
      o.info(
        `process start command=${a.command}${a.subcommand ? ` subcommand=${a.subcommand}` : ""} version=${Li()} git_commit=${Oi()} cwd=${process.cwd()}`,
      ),
      t.invalidValue && o.warn(`invalid UNITY_INSIGHT_LOG_LEVEL '${t.invalidValue}'; using INFO`),
      mG({ logDirectory: r, currentLogPath: i }),
      o
    );
  } catch (r) {
    try {
      n(`[unity-insight] file logging unavailable: ${UP(r)}
`);
    } catch {}
    return ((kt = new jc()), kt);
  }
}
function ft(e, ...t) {
  kt?.[e.toLowerCase()](...t);
}
async function mG(e) {
  let t;
  try {
    t = await iG(e.logDirectory, { withFileTypes: !0 });
  } catch {
    return;
  }
  let n = e.nowMs ?? Date.now(),
    r = e.isPidAlive ?? IG;
  await Promise.all(
    t.map(async (i) => {
      let s = i.isFile() ? cG.exec(i.name) : null;
      if (!s) return;
      let o = jy.join(e.logDirectory, i.name);
      if (o !== e.currentLogPath)
        try {
          if ((await oG(o)).mtimeMs >= n - lG) return;
          let a = Number(s[1]);
          if (r(a)) return;
          await sG(o, { force: !0 });
        } catch {}
    }),
  );
}
function NP(e, t) {
  let n = `${e.getFullYear()}-${Yr(e.getMonth() + 1)}-${Yr(e.getDate())}`,
    r = `${Yr(e.getHours())}:${Yr(e.getMinutes())}:${Yr(e.getSeconds())}.${String(e.getMilliseconds()).padStart(3, "0")}`;
  if (!t) return `${n}T${r}`;
  let i = -e.getTimezoneOffset(),
    s = i >= 0 ? "+" : "-",
    o = Math.abs(i);
  return `${n}T${r}${s}${Yr(Math.floor(o / 60))}:${Yr(o % 60)}`;
}
function Yr(e) {
  return String(e).padStart(2, "0");
}
function yG(e) {
  let t = qr(...e);
  return (new Error(t).stack ?? `Trace: ${t}`).replace(/^Error(?=:)/, "Trace");
}
function pG(e, t, n) {
  for (let r of Object.keys(Dy)) t.set(r, e[r]);
  for (let r of Object.keys(Dy)) {
    let i = t.get(r);
    if (r === "trace") {
      let s = t.get("error");
      e.trace = (...o) => {
        let a = e.error,
          l;
        e.error = (...c) => {
          ((l = gG(qr(...c))), s.apply(console, [l]));
        };
        try {
          i.apply(console, o);
        } finally {
          e.error = a;
        }
        n("ERROR", l ?? yG(o));
      };
      continue;
    }
    e[r] = (...s) => {
      (i.apply(console, s), n(Dy[r], qr(...s)));
    };
  }
}
function gG(e) {
  let t = e.includes(`\r
`)
      ? `\r
`
      : `
`,
    n = e.split(t);
  return (n.length > 1 && n.splice(1, 1), n.join(t));
}
function UP(e) {
  return e instanceof Error ? (e.stack ?? e.message) : String(e);
}
function hG(e) {
  if (!e || typeof e != "object") return !1;
  let t = e;
  return (
    typeof t.timestamp == "number" &&
    typeof t.threadId == "number" &&
    typeof t.message == "string" &&
    typeof t.level == "string" &&
    t.level in Wi
  );
}
function IG(e) {
  try {
    return (process.kill(e, 0), !0);
  } catch (t) {
    return t.code === "EPERM";
  }
}
function bG(e) {
  let t = e[0]?.trim() || "unknown";
  if (t === "index") {
    let n = e[1]?.trim();
    return n ? { command: t, subcommand: n } : { command: t };
  }
  if (t === "serve") {
    if (e.includes("--daemon")) return { command: t, subcommand: "daemon" };
    if (e.includes("--stdio")) return { command: t, subcommand: "stdio" };
  }
  return { command: t };
}
function SG(e) {
  let t = e ?? process.stderr;
  return {
    log(n, r = "INFO") {
      (ft(r, n),
        Bc(r) &&
          t.write(`${n}
`));
    },
  };
}
async function AP(e = {}) {
  let t = e.stdin ?? process.stdin,
    n = e.stdout ?? process.stdout,
    r = SG(e.stderr),
    i = Mc(e.projectPath, { watchEnabled: Nn(e.watch) });
  i.initialized && i.projectPath && r.log(`[unity-insight-serve] pre-initialized for project: ${i.projectPath}`);
  let s = 0;
  try {
    for await (let o of Fc(t, Po())) {
      let a = await vo(i, o, r);
      if (a && (Dc(n, a), vP(i, a))) break;
    }
  } catch (o) {
    if (o instanceof dn)
      (r.log(`[unity-insight-serve] stopping stdio server: NDJSON line exceeds ${o.maxBytes} bytes.`, "WARN"), (s = 1));
    else throw o;
  } finally {
    try {
      await Pn();
    } catch {}
  }
  return { exitCode: s };
}
import { createServer as kG } from "node:net";
import Yi from "node:path";
var _G = { maxHeavy: 6, maxHeavyPerProject: 3, maxHeavyQueue: 64, retryAfterMs: 100 },
  EG = new Set([
    "lookup_vfs_entry",
    "vfs_ls",
    "vfs_glob",
    "vfs_read",
    "vfs_grep",
    "vfs_refs",
    "cowork.vfs_children",
    "cowork.vfs_entry",
    "cowork.vfs_search",
    "cowork.vfs_path_search",
    "cowork.vfs_refs",
  ]),
  RG = {
    maxHeavy: "UNITY_INSIGHT_MAX_HEAVY_QUERIES",
    maxHeavyPerProject: "UNITY_INSIGHT_MAX_HEAVY_QUERIES_PER_PROJECT",
    maxHeavyQueue: "UNITY_INSIGHT_MAX_HEAVY_QUEUE",
    retryAfterMs: "UNITY_INSIGHT_HEAVY_QUERY_RETRY_AFTER_MS",
  };
function wG(e, t) {
  let n = process.env[e]?.trim();
  if (!n) return t;
  let r = Number.parseInt(n, 10);
  return !Number.isFinite(r) || r < 1 ? t : r;
}
function Vc(e, t) {
  return e ?? wG(RG[t], _G[t]);
}
function PG(e = {}) {
  return {
    maxHeavy: Vc(e.maxHeavy, "maxHeavy"),
    maxHeavyPerProject: Vc(e.maxHeavyPerProject, "maxHeavyPerProject"),
    maxHeavyQueue: Vc(e.maxHeavyQueue, "maxHeavyQueue"),
    retryAfterMs: Vc(e.retryAfterMs, "retryAfterMs"),
  };
}
function OP(e, t) {
  return e === "status"
    ? t?.light === !0 || t?.mode === "light"
      ? "interactive"
      : "heavy"
    : EG.has(e)
      ? "heavy"
      : "interactive";
}
function Vy(e, t) {
  return new ut("RESOURCE_EXHAUSTED", `${e} Retry after ${t}ms.`);
}
function LP(e, t) {
  return Vy(`Heavy query cancelled ${t}.`, e);
}
function Gc(e, t) {
  return e.reason instanceof Error ? e.reason : Vy(t, 0);
}
function $c(e, t, n) {
  return t
    ? t.aborted
      ? Promise.reject(Gc(t, n))
      : new Promise((r, i) => {
          let s = () => {
            i(Gc(t, n));
          };
          (t.addEventListener("abort", s, { once: !0 }),
            e.then(
              (o) => {
                (t.removeEventListener("abort", s), r(o));
              },
              (o) => {
                (t.removeEventListener("abort", s), i(o));
              },
            ));
        })
    : e;
}
function CP(e = {}) {
  let t = PG(e),
    n = Promise.resolve(),
    r = 0,
    i = [],
    s = 0,
    o = 0,
    a = new Map(),
    l = [];
  function c() {
    return r === 0
      ? Promise.resolve()
      : new Promise((I) => {
          i.push(I);
        });
  }
  function d() {
    if (r === 0) for (; i.length > 0;) i.shift()?.();
  }
  function u(I) {
    return a.get(I) ?? 0;
  }
  function f(I) {
    return s < t.maxHeavy && u(I) < t.maxHeavyPerProject;
  }
  function m(I) {
    ((s += 1), a.set(I, u(I) + 1));
  }
  function y() {
    let I = 0;
    for (; I < l.length;) {
      let E = l[I];
      if (!E || !f(E.projectKey)) {
        I += 1;
        continue;
      }
      (l.splice(I, 1), (o -= 1), m(E.projectKey), E.resolve());
    }
  }
  function g(I) {
    s = Math.max(0, s - 1);
    let E = u(I) - 1;
    (E <= 0 ? a.delete(I) : a.set(I, E), y());
  }
  async function h(I, E = {}) {
    let { signal: w, onQueued: T } = E;
    if (w?.aborted) throw LP(t.retryAfterMs, "before start");
    if (f(I)) {
      m(I);
      return;
    }
    if (o >= t.maxHeavyQueue) throw Vy(`Heavy query queue is full (${t.maxHeavyQueue}).`, t.retryAfterMs);
    ((o += 1),
      T?.(),
      await new Promise((x, O) => {
        let F = (_) => {
            (w?.removeEventListener("abort", K), _());
          },
          Y = { projectKey: I, resolve: () => F(x), reject: (_) => F(() => O(_)) };
        function K() {
          let _ = l.indexOf(Y);
          (_ >= 0 && (l.splice(_, 1), (o -= 1)), Y.reject(LP(t.retryAfterMs, "while queued")));
        }
        (w && w.addEventListener("abort", K, { once: !0 }), l.push(Y));
      }));
  }
  function b(I) {
    let E = async () => (await c(), I()),
      w = n.then(E, E);
    return (
      (n = w.then(
        () => {},
        () => {},
      )),
      w
    );
  }
  async function S(I, E, w, T) {
    for (;;) {
      let x = n;
      if ((await $c(x, E, w), x === n)) {
        if (E?.aborted) throw Gc(E, T);
        return I();
      }
    }
  }
  function P(I, E) {
    r += 1;
    let w = () => {
      ((r -= 1), d(), E?.());
    };
    I.then(w, w);
  }
  return {
    runExclusive: b,
    runInteractive(I, E = {}) {
      let { signal: w } = E;
      return S(
        () => {
          let T = I();
          return (P(T), $c(T, w, "Interactive query cancelled."));
        },
        w,
        "Interactive query cancelled while waiting for exclusive work.",
        "Interactive query cancelled.",
      );
    },
    async runHeavy(I, E) {
      let { projectKey: w, signal: T, runSignal: x, onQueued: O } = E,
        F = x ?? T;
      (await $c(n, T, "Heavy query cancelled while waiting for exclusive work."),
        await h(w, { signal: T, onQueued: O }));
      let K = !1;
      try {
        return await S(
          () => {
            if (F?.aborted) throw Gc(F, "Heavy query cancelled before start.");
            let _ = I();
            return (
              (K = !0),
              P(_, () => {
                g(w);
              }),
              $c(_, F, "Heavy query cancelled while running.")
            );
          },
          T,
          "Heavy query cancelled while waiting for exclusive work.",
          "Heavy query cancelled before start.",
        );
      } finally {
        K || g(w);
      }
    },
    getHeavyStats() {
      return { activeHeavy: s, queuedHeavy: o, activeByProject: Object.fromEntries(a) };
    },
  };
}
var vG = "unity_insight_process_crash",
  MP = !1,
  $y = !1,
  FP,
  DP;
function xG(e) {
  let t = e.argv ?? process.argv.slice(2),
    n = TG(t);
  co(vG, {
    status: "error",
    durationMs: e.durationMs ?? Math.round(process.uptime() * 1e3),
    error: e.error,
    extra: {
      crash_type: e.crashType,
      command: n.command,
      subcommand: n.subcommand,
      serve_mode: n.serveMode,
      pid: process.pid,
      node_version: process.version,
    },
  });
}
async function xo(e) {
  if (!$y) {
    $y = !0;
    try {
      (xG(e), await Pn());
    } catch {
    } finally {
      $y = !1;
    }
  }
}
function jP(e = {}) {
  if (MP) return;
  MP = !0;
  let t = e.argv ?? process.argv.slice(2),
    n =
      e.exit ??
      ((s) => {
        process.exit(s);
      }),
    r =
      e.stderr ??
      ((s) => {
        try {
          process.stderr.write(s);
        } catch {}
      }),
    i = (s, o) => {
      let a = o instanceof Error ? o.message : String(o);
      (ft("ERROR", o instanceof Error ? (o.stack ?? o.message) : String(o)),
        r(`[unity-insight] ${s}: ${a}
`),
        xo({ crashType: s, error: o, argv: t }).finally(() => {
          n(1);
        }));
    };
  ((FP = (s) => {
    i("uncaught_exception", s);
  }),
    (DP = (s) => {
      i("unhandled_rejection", s);
    }),
    process.on("uncaughtException", FP),
    process.on("unhandledRejection", DP));
}
function TG(e) {
  let t = e[0]?.trim() || "unknown";
  if (t === "serve")
    return e.includes("--daemon")
      ? { command: t, serveMode: "daemon" }
      : e.includes("--stdio")
        ? { command: t, serveMode: "stdio" }
        : { command: t };
  if (t === "index") {
    let n = e[1]?.trim();
    return n ? { command: t, subcommand: n } : { command: t };
  }
  return { command: t };
}
var NG = 12e4,
  UG = 1e4,
  AG = 5e3,
  LG = 1e3,
  GP = 15e3,
  Ky = 50,
  OG = 2e3,
  BP = 2e3,
  Gy = 2e3,
  CG = 2e3,
  VP = 64,
  MG = 16;
function Me(e) {
  return e instanceof Error ? e.message : String(e);
}
function qi(e, t, n) {
  let r = process.env[e]?.trim();
  if (!r) return t;
  let i = Number.parseInt(r, 10);
  return !Number.isFinite(i) || i < n ? t : i;
}
function FG() {
  return qi("UNITY_INSIGHT_DAEMON_IDLE_MS", NG, 0);
}
function DG() {
  return qi("UNITY_INSIGHT_AUTHENTICATION_TIMEOUT_MS", UG, 0);
}
function jG() {
  return qi("UNITY_INSIGHT_MAX_INTERACTIVE_QUERIES_PER_CONNECTION", MG, 1);
}
function BG() {
  return qi("UNITY_INSIGHT_INDEX_REFRESH_INTERVAL_MS", AG, 1);
}
function VG() {
  return qi("UNITY_INSIGHT_SERVE_LOCK_HEAL_INTERVAL_MS", LG, 1);
}
function KP() {
  return qi("UNITY_INSIGHT_REPLACED_OWNER_WAIT_MS", GP, 1);
}
function $G(e) {
  let t = e ?? process.stderr;
  return {
    log(n, r = "INFO") {
      (ft(r, n),
        Bc(r) &&
          t.write(`${n}
`));
    },
  };
}
async function $P(e, t = OG) {
  if (e.size === 0) return;
  let n;
  try {
    await Promise.race([
      Promise.allSettled([...e]).then(() => {}),
      new Promise((r) => {
        n = setTimeout(r, t);
      }),
    ]);
  } finally {
    n && clearTimeout(n);
  }
}
function GG(e, t = Gy) {
  return e.destroyed || !e.writableNeedDrain
    ? Promise.resolve(!0)
    : new Promise((n) => {
        let r = (a) => {
            (clearTimeout(o), e.off("drain", i), e.off("close", s), e.off("error", s), n(a));
          },
          i = () => r(!0),
          s = () => r(!1),
          o = setTimeout(() => r(!1), t);
        (o.unref(), e.once("drain", i), e.once("close", s), e.once("error", s));
      });
}
async function KG(e, t, n, r, i, s, o, a) {
  let l = jG(),
    c = new AbortController(),
    d = new Map(),
    u = Fc(e, Po()),
    f = { tasks: new Set(), ids: new Set(), interactiveCount: 0 },
    m = Promise.resolve(),
    y = Promise.resolve(),
    g = 0,
    h = (w) => {
      if (((g += 1), g > VP))
        return (
          (g -= 1),
          n.log(`[unity-insight-serve] response queue exceeded ${VP}; closing client connection.`, "WARN"),
          e.destroy(),
          Promise.resolve()
        );
      let T = m.then(async () => {
        e.destroyed ||
          !e.writable ||
          Dc(e, w) ||
          (!(await GG(e)) &&
            !e.destroyed &&
            (n.log(`[unity-insight-serve] response drain exceeded ${Gy}ms; closing client connection.`, "WARN"),
            e.destroy()));
      });
      return (
        (m = T.catch((x) => {
          e.destroyed || n.log(`[unity-insight-serve] response write failed: ${Me(x)}`, "WARN");
        }).finally(() => {
          g = Math.max(0, g - 1);
        })),
        T
      );
    },
    b = !1;
  function S() {
    b || ((b = !0), h($w()));
  }
  let P = !1;
  function I(w) {
    P || !w || w === "ping" || w === "cancel" || !t.authenticated || ((P = !0), s?.());
  }
  function E(w, T) {
    w?.status === "ok" && I(T);
  }
  try {
    for await (let w of u) {
      let T = w.trim();
      if (!T) continue;
      let x;
      try {
        x = xc(T);
      } catch {}
      if (x && f.ids.has(x.id)) {
        (n.log(`[unity-insight-serve] duplicate in-flight request id '${x.id}'; closing client connection.`, "WARN"),
          e.destroy());
        break;
      }
      if (x?.method === "cancel") {
        let N = x.params?.request_id,
          j = !1;
        if (typeof N == "string" && N.trim() !== "") {
          let te = d.get(N.trim());
          te && (te.abort(), (j = !0));
        }
        let z = {
          id: x.id,
          status: "ok",
          data: { cancelled: j, request_id: N },
          summary: j ? "Cancelled in-flight request." : "No matching in-flight request to cancel.",
        };
        (await h(z), i?.());
        continue;
      }
      if ((x && f.ids.add(x.id), x?.method === "shutdown")) {
        await $P(f.tasks);
        let N = await vo(t, w, n);
        (E(N, x.method), i?.(), N && (await h(N)), f.ids.delete(x.id));
        break;
      }
      let O = new AbortController();
      x && d.set(x.id, O);
      let F = O.signal;
      typeof AbortSignal.any == "function"
        ? (F = AbortSignal.any([c.signal, O.signal]))
        : c.signal.aborted && (F = c.signal);
      let Y = () => {
          x && d.delete(x.id);
        },
        K = y,
        _ = (async () => {
          let N = !1,
            j = Promise.resolve(void 0),
            z = !1,
            te = !1,
            se,
            ce = () => {
              N || ((N = !0), i?.());
            },
            ie = () => {
              (z && (f.interactiveCount = Math.max(0, f.interactiveCount - 1)), te && se !== void 0 && a?.(se));
            };
          try {
            await K;
            let re = x?.method === "initialize" ? t : pP(t),
              k;
            x && (k = await Cy(re, x));
            let C = x ? OP(x.method, x.params) : "interactive",
              v = k ?? "__unbound__";
            ((se = v === "__unbound__" ? void 0 : v), se && (await o?.(se), (te = !0)));
            let A = () => {
                let H = () => vo(re, w, n, F);
                return (
                  (j = re.queryService.withCancellationSignal ? re.queryService.withCancellationSignal(F, H) : H()),
                  j
                );
              },
              M;
            if (C === "heavy") M = r.runHeavy(A, { projectKey: v, signal: F, onQueued: S });
            else {
              if (f.interactiveCount >= l)
                throw new ut(
                  "RESOURCE_EXHAUSTED",
                  `Connection already has ${f.interactiveCount} interactive queries in flight (max ${l}).`,
                );
              ((f.interactiveCount += 1), (z = !0), (M = r.runInteractive(A, { signal: F })));
            }
            let D = await M;
            (E(D, x?.method), D && !O.signal.aborted && (await h(D)));
          } catch (re) {
            O.signal.aborted && x
              ? await h(Vt(x.id, "CANCELLED", "Request was cancelled by the client."))
              : (re instanceof ut || re instanceof Ne) && x
                ? await h(Vt(x.id, re.code, Me(re)))
                : (n.log(`[unity-insight-serve] request failed: ${Me(re)}`, "ERROR"),
                  await h(Vt(x?.id ?? "unknown", "INTERNAL_ERROR", Me(re))));
          } finally {
            try {
              await j;
            } catch {}
            (Y(), ce(), x && f.ids.delete(x.id), ie());
          }
        })();
      (f.tasks.add(_),
        x?.method === "initialize" &&
          (y = _.then(
            () => {},
            () => {},
          )));
      let L = () => {
        f.tasks.delete(_);
      };
      _.then(L, L);
    }
  } catch (w) {
    if (w instanceof dn)
      (n.log(`[unity-insight-serve] closing client: NDJSON line exceeds ${w.maxBytes} bytes.`, "WARN"), e.destroy());
    else if (!(
      e.destroyed ||
      (w instanceof Error && (w.message === "Premature close" || w.code === "ECONNRESET" || w.code === "EPIPE"))
    ))
      throw w;
  } finally {
    c.abort();
    for (let w of d.values()) w.abort();
    (await $P(f.tasks),
      await Promise.race([
        m,
        new Promise((w) => {
          setTimeout(w, Gy).unref();
        }),
      ]),
      e.destroyed || (g > 0 || e.writableNeedDrain ? e.destroy() : e.end()));
  }
}
function WG(e, t) {
  return (
    e?.pid === t.pid &&
    e.instanceId === t.instanceId &&
    e.capabilityToken === t.capabilityToken &&
    e.host === t.host &&
    e.port === t.port
  );
}
async function YG(e, t) {
  let n = Date.now() + KP();
  for (; Date.now() < n;) {
    let r = await Zt(e);
    if (!WG(r, t)) return r === void 0;
    if (!Lr(t.pid) && !(await mo(t))) return !0;
    await new Promise((i) => {
      setTimeout(i, Ky);
    });
  }
  return !1;
}
async function qG() {
  let e = Date.now() + KP();
  for (;;) {
    try {
      return await Fm();
    } catch (t) {
      if (!Mm(t)) throw t;
    }
    if (Date.now() >= e) return;
    await new Promise((t) => {
      setTimeout(t, Ky);
    });
  }
}
async function zG(e, t, n) {
  let r = Date.now() + GP;
  for (;;) {
    let i = await Zt(e);
    if (i && Lr(i.pid) && i.port > 0 && i.capabilityToken && i.instanceId && (await mo(i)))
      return i.watchEnabled !== void 0 && i.watchEnabled !== n
        ? (t.log(
            `[unity-insight-serve] existing daemon watch policy (${i.watchEnabled ? "watch" : "no-watch"}) conflicts with requested policy (${n ? "watch" : "no-watch"}).`,
            "ERROR",
          ),
          { exitCode: 1 })
        : (t.log(`[unity-insight-serve] shared serve lifecycle already owned (pid=${i.pid}, port=${i.port}).`),
          { exitCode: 0 });
    if (Date.now() >= r) return;
    await new Promise((s) => {
      setTimeout(s, Ky);
    });
  }
}
async function WP(e = {}) {
  let t = typeof e.projectPath == "string" && e.projectPath.trim() !== "" ? Ce(e.projectPath.trim()) : void 0,
    n = jm(),
    r = $G(e.stderr),
    i = e.host ?? "127.0.0.1",
    s = Nn(e.watch),
    o = SP();
  if (t && o.length > 0) {
    let G = Ce(t);
    if (
      !o.some((le) => {
        let oe = Ce(le);
        if (G === oe) return !0;
        let me = Yi.relative(oe, G);
        return me !== "" && !me.startsWith("..") && !Yi.isAbsolute(me);
      })
    )
      return (
        r.log(`[unity-insight-serve] warmup project is not under UNITY_INSIGHT_ALLOWED_PROJECT_ROOTS: ${G}`, "ERROR"),
        { exitCode: 1 }
      );
  }
  let a = HE(),
    l;
  r.log(`[unity-insight-serve] shared serve start${t ? ` project=${t}` : " scope=global"}`, "INFO");
  try {
    l = await zE();
  } catch (G) {
    if (WE(G)) {
      let J = await zG(n, r, s);
      if (J) return J;
    }
    return (
      r.log(`[unity-insight-serve] failed to acquire shared serve lifecycle lock: ${Me(G)}`, "ERROR"),
      { exitCode: 1 }
    );
  }
  let c,
    d,
    u = (G) => {
      d ??= G;
    };
  try {
    c = await Fm();
  } catch (G) {
    if (!Mm(G))
      return (
        nr(l),
        r.log(`[unity-insight-serve] failed to acquire OS singleton guard: ${Me(G)}`, "ERROR"),
        { exitCode: 1 }
      );
    r.log(
      "[unity-insight-serve] lifecycle path was reacquired while the old OS singleton guard is still held; waiting for non-overlapping handoff.",
      "WARN",
    );
    try {
      let J = await qG();
      if (!J)
        return (
          nr(l),
          r.log(
            "[unity-insight-serve] timed out waiting for OS singleton guard handoff; refusing overlapping serve startup.",
            "ERROR",
          ),
          { exitCode: 1 }
        );
      c = J;
    } catch (J) {
      return (
        nr(l),
        r.log(`[unity-insight-serve] OS singleton guard handoff failed: ${Me(J)}`, "ERROR"),
        { exitCode: 1 }
      );
    }
  }
  for (let G of c.bindings) ((d ??= G.runtimeError), G.server.on("error", u));
  let f = {
    pid: process.pid,
    host: i,
    port: 0,
    scope: "global",
    instanceId: a.instanceId,
    capabilityToken: a.capabilityToken,
    startedAt: a.startedAt,
    lifecycleGeneration: l.lifecycleGeneration,
    watchEnabled: s,
    servedProjectPaths: t ? [t] : [],
  };
  try {
    if (d || c.bindings.some((le) => !le.server.listening))
      throw d ?? new Error("OS singleton guard stopped listening during startup.");
    let G = await Zt(n),
      J = G?.lifecycleGeneration !== void 0 && G.lifecycleGeneration === l.lifecycleGeneration;
    if (G?.instanceId && G.capabilityToken && G.port > 0 && (await mo(G))) {
      if (J)
        return (
          nr(l),
          await fo(c),
          G.watchEnabled !== void 0 && G.watchEnabled !== s
            ? (r.log("[unity-insight-serve] healthy discovery owner has a conflicting watch policy.", "ERROR"),
              { exitCode: 1 })
            : (r.log(`[unity-insight-serve] healthy discovery owner retained (pid=${G.pid}, port=${G.port}).`),
              { exitCode: 0 })
        );
      if (
        (r.log(
          `[unity-insight-serve] waiting for the old discovery owner to stop after lifecycle path replacement (pid=${G.pid}, port=${G.port}).`,
          "WARN",
        ),
        !(await YG(n, G)))
      )
        return (
          nr(l),
          await fo(c),
          r.log(
            "[unity-insight-serve] timed out waiting for the old lifecycle owner to stop; refusing overlapping serve startup.",
            "ERROR",
          ),
          { exitCode: 1 }
        );
    }
    if (!(await zl(l))) throw new Error("Lifecycle lock path changed before discovery ownership was claimed.");
    if ((await $m(n, { lifecycleOwnershipConfirmed: !0 }), !(await zl(l))))
      throw new Error("Lifecycle lock path changed while discovery ownership was claimed.");
    await ZE(n, f);
  } catch (G) {
    return (
      nr(l),
      await fo(c),
      r.log(`[unity-insight-serve] failed to acquire shared serve lock: ${Me(G)}`, "ERROR"),
      { exitCode: 1 }
    );
  }
  let m = new Map(),
    y = lP(),
    g = { shuttingDown: !1 },
    h = { capabilityToken: a.capabilityToken, instanceId: a.instanceId, allowedProjectRoots: o },
    b = sc("Shared serve is still starting."),
    S = new Map($r({ queryService: b }).map((G) => [G.name, G])),
    P = () =>
      Mc(t, {
        watchEnabled: s,
        shutdownMode: "client",
        shared: {
          queryService: b,
          toolDefinitions: S,
          projectSessions: m,
          runIndexWriteExclusive: y.runExclusive,
          lifecycle: g,
          auth: h,
        },
      }),
    I = new Map(),
    E = new Set(),
    w = async (G) => {
      try {
        let J = await eg(Be(G));
        if (J === void 0) return !1;
        for (let le of J)
          r.log(`[unity-insight-serve] deferred stale index cleanup for ${le.path}: ${Me(le.error)}`, "WARN");
        return J.length === 0;
      } catch (J) {
        return (r.log(`[unity-insight-serve] stale index cleanup skipped: ${Me(J)}`, "WARN"), !1);
      }
    },
    T = !1,
    x = !1,
    O = !1,
    F,
    Y = new AbortController(),
    K = !1,
    _ = [],
    L = async () => {
      K ||
        (await new Promise((G) => {
          _.push(G);
        }));
    },
    N = () => {
      K = !0;
      for (let G of _.splice(0)) G();
    },
    j = CP(),
    z = (G) => {
      let J = Yi.resolve(G);
      if (I.has(J)) return;
      let le;
      try {
        le = it(Be(J));
      } catch {
        le = void 0;
      }
      (I.set(J, le), E.add(J));
    };
  t && z(t);
  let te = () => {
      for (let G of m.values()) z(G.projectPath);
      for (let G of I.keys())
        try {
          let J = it(Be(G));
          J !== I.get(G) &&
            (r.log(`[unity-insight-serve] index generation changed; refreshing query service project=${G}`, "INFO"),
            I.set(G, J),
            E.add(G));
        } catch {
          (I.set(G, void 0), E.add(G));
        }
    },
    se = () => {
      if ((te(), E.size === 0 || T || Y.signal.aborted)) return;
      if (x) {
        O = !0;
        return;
      }
      let G = [...E].map((le) => ({ projectPath: le, observedIndexPath: I.get(le) }));
      x = !0;
      let J = j
        .runExclusive(async () => {
          if (!Y.signal.aborted)
            for (let { projectPath: le, observedIndexPath: oe } of G) {
              if (Y.signal.aborted) return;
              let me = !1;
              try {
                me = await b.refreshProjectIndexGeneration(le);
              } catch {}
              if (Y.signal.aborted) return;
              if ((!me && oe !== void 0) || !(await w(le))) continue;
              if (Y.signal.aborted) return;
              I.get(le) === oe && oe !== void 0 && E.delete(le);
            }
        })
        .finally(() => {
          ((x = !1), F === J && (F = void 0), O && !Y.signal.aborted && ((O = !1), se()));
        });
      F = J;
    },
    ce = setInterval(se, BG());
  ce.unref();
  let ie,
    re,
    k = !1,
    C,
    v,
    A,
    M = f,
    D = 0,
    H = !1,
    ae = () => {
      H = !0;
    },
    Q = new Set(),
    fe = new Set(),
    Re = new Map(),
    Pe = new WeakSet(),
    B = () => {
      let G = new Set(Re.keys());
      for (let le of fe) le.projectPath && G.add(Ce(le.projectPath));
      let J = [...G].sort();
      return JSON.stringify(M.servedProjectPaths ?? []) === JSON.stringify(J)
        ? !1
        : ((M = { ...M, servedProjectPaths: J }), !0);
    },
    W = () => {
      let G = new Set();
      for (let J of fe) J.projectPath && G.add(Yi.resolve(J.projectPath));
      for (let J of Re.keys()) G.add(Yi.resolve(J));
      for (let [J, le] of m) {
        if (G.has(Yi.resolve(J))) continue;
        let oe = [le.buildInFlight, le.syncInFlight].filter((me) => !!me);
        if (oe.length > 0) {
          for (let me of oe) {
            if (Pe.has(me)) continue;
            Pe.add(me);
            let We = () => {
              (Pe.delete(me), W() && Se());
            };
            me.then(We, We);
          }
          continue;
        }
        (le.watcherHandle?.stop(), (le.watcherHandle = void 0), m.delete(J), I.delete(J), E.delete(J));
      }
      return B();
    },
    ue,
    xe = FG(),
    Se = async () =>
      T || M.port <= 0
        ? !1
        : re
          ? ((k = !0), re)
          : ((re = (async () => {
              if (!(await zl(l)))
                return (
                  r.log("[unity-insight-serve] lifecycle lock path was removed or replaced; shutting down.", "ERROR"),
                  It(),
                  !1
                );
              let J;
              do {
                ((k = !1), (J = M));
                try {
                  let le = await eR(n, J, { shouldAbort: () => T });
                  if (T) return !1;
                  if (le === "rewritten") r.log("[unity-insight-serve] updated serve lock metadata.");
                  else if (le === "lost")
                    return (
                      r.log("[unity-insight-serve] serve lock claimed by another process; shutting down.", "ERROR"),
                      It(),
                      !1
                    );
                } catch (le) {
                  return (r.log(`[unity-insight-serve] serve lock heal skipped: ${Me(le)}`, "WARN"), !1);
                }
              } while (!T && (k || J !== M));
              return !0;
            })().finally(() => {
              re = void 0;
            })),
            re),
    fn = () => {
      W() && Se();
    },
    Z = (G) => {
      let J = Ce(G),
        le = Re.get(J);
      (le === void 0 || le <= 1 ? Re.delete(J) : Re.set(J, le - 1), fn());
    },
    ne = async (G) => {
      let J = Ce(G);
      if ((Re.set(J, (Re.get(J) ?? 0) + 1), W(), !(await Se())))
        throw (Z(J), new Error(`Failed to publish the project lease before request execution: ${J}`));
    },
    ge = () => {
      ue && (clearTimeout(ue), (ue = void 0));
    },
    Ie = () => {
      if ((ge(), !(T || D > 0) && !(!H && xe <= 0))) {
        if (Uy(m)) {
          Ay(m).finally(() => {
            Ie();
          });
          return;
        }
        if (H) {
          (r.log("[unity-insight-serve] shutting down: no clients after at least one TCP connection."), It());
          return;
        }
        ue = setTimeout(() => {
          if (D > 0 || Uy(m)) {
            Ie();
            return;
          }
          (r.log(`[unity-insight-serve] shutting down after ${xe}ms with no clients.`), It());
        }, xe);
      }
    },
    Nt,
    sr = () => (
      (Nt ??= (async () => {
        T = !0;
        let G = re,
          J = F;
        if (
          (Y.abort(),
          N(),
          ge(),
          (g.shuttingDown = !0),
          v && (process.off("SIGINT", v), process.off("SIGTERM", v), (v = void 0)),
          A)
        ) {
          for (let me of c.bindings) me.server.off("error", A);
          A = void 0;
        }
        (clearInterval(ce), ie && (clearInterval(ie), (ie = void 0)), cP(m));
        for (let me of Q) me.destroy();
        if ((Q.clear(), fe.clear(), C)) {
          let me = C;
          ((C = void 0),
            await new Promise((We) => {
              let Ut = setTimeout(We, 2e3);
              me.close(() => {
                (clearTimeout(Ut), We());
              });
            }));
        }
        let le = Date.now() + 2e3;
        for (; D > 0 && Date.now() < le;)
          await new Promise((me) => {
            setTimeout(me, 25);
          });
        (await Ay(m, BP)) ||
          r.log(`[unity-insight-serve] timed out after ${BP}ms waiting for index work during shutdown.`, "WARN");
        try {
          await Promise.race([
            J,
            new Promise((me) => {
              setTimeout(me, CG).unref();
            }),
          ]);
        } catch {}
        (await Lw(), await Bw(), b.dispose());
        try {
          await G;
        } catch {}
        try {
          await XE(n, M);
        } catch (me) {
          r.log(`[unity-insight-serve] failed to release serve lock: ${Me(me)}`, "ERROR");
        } finally {
          (nr(l), await fo(c));
        }
        try {
          await Pn();
        } catch {}
      })()),
      Nt
    ),
    It,
    Hr = !1,
    mt = "binding",
    Un;
  try {
    let G = new Promise((oe) => {
      It = async () => {
        try {
          await sr();
        } catch (me) {
          r.log(`[unity-insight-serve] shutdown cleanup failed: ${Me(me)}`, "ERROR");
        } finally {
          oe();
        }
      };
    });
    A = (oe) => {
      ((d ??= oe),
        (Hr = !0),
        r.log(`[unity-insight-serve] OS singleton guard failed: ${Me(oe)}`, "ERROR"),
        mt === "running" ? It() : ((Un ??= oe), (mt = "failed")));
    };
    for (let oe of c.bindings) (oe.server.on("error", A), oe.server.off("error", u));
    C = (e.serverFactory ?? kG)((oe) => {
      let me = P();
      (fe.add(me), (D += 1));
      let We = `${oe.remoteAddress ?? "unknown"}:${oe.remotePort ?? 0}`;
      (r.log(`[unity-insight-serve] tcp client connected remote=${We} active_connections=${D}`, "INFO"), Q.add(oe));
      let Ut = DG(),
        mn;
      (oe.once("close", () => {
        (Q.delete(oe), mn && clearTimeout(mn));
      }),
        ge(),
        (async () => {
          (await L(),
            !(oe.destroyed || T) &&
              ((me.queryService = b),
              Ut > 0 &&
                ((mn = setTimeout(() => {
                  !me.authenticated &&
                    !oe.destroyed &&
                    (r.log(`[unity-insight-serve] closing unauthenticated client after ${Ut}ms remote=${We}`, "WARN"),
                    oe.destroy());
                }, Ut)),
                mn.unref()),
              await KG(
                oe,
                me,
                r,
                j,
                () => {
                  (W() && Se(), se());
                },
                ae,
                ne,
                Z,
              )));
        })()
          .catch((An) => {
            r.log(`[unity-insight-serve] client error: ${Me(An)}`, "ERROR");
          })
          .finally(() => {
            (fe.delete(me),
              W() && Se(),
              (D = Math.max(0, D - 1)),
              r.log(`[unity-insight-serve] tcp client disconnected remote=${We} active_connections=${D}`, "INFO"),
              D === 0 && Ie());
          }));
    });
    let J = () => {
      let oe = Un ?? d;
      if (oe) throw oe;
      if (T || g.shuttingDown) throw new Error("Shared serve startup was interrupted by shutdown.");
    };
    (await new Promise((oe, me) => {
      let We = C,
        Ut = (An) => {
          if (((Hr = !0), mt === "binding")) {
            ((mt = "failed"), We.off("listening", mn), me(An));
            return;
          }
          if (
            (r.log(`[unity-insight-serve] runtime TCP server error: ${Me(An)}`, "ERROR"),
            mt === "post-listen-initializing")
          ) {
            ((Un ??= An), (mt = "failed"));
            return;
          }
          mt !== "failed" && It();
        },
        mn = () => {
          ((mt = "post-listen-initializing"), oe());
        };
      (We.on("error", Ut), We.once("listening", mn), We.listen({ host: i, port: 0 }));
    }),
      J());
    let le = C.address();
    if (!le || typeof le == "string") throw new Error("Failed to resolve shared serve listen port.");
    M = {
      pid: process.pid,
      host: i,
      port: le.port,
      scope: "global",
      instanceId: a.instanceId,
      capabilityToken: a.capabilityToken,
      startedAt: a.startedAt,
      lifecycleGeneration: l.lifecycleGeneration,
      watchEnabled: s,
      servedProjectPaths: t ? [t] : [],
    };
    try {
      await Vm(n, M);
    } catch (oe) {
      throw (r.log(`[unity-insight-serve] failed to publish startup metadata: ${Me(oe)}`, "ERROR"), oe);
    }
    (J(), r.log(`[unity-insight-serve] shared serve listening on ${i}:${le.port}` + (t ? ` for ${t}` : " (global)")));
    try {
      let oe = Ew({ persistentConnections: ir() });
      ((Un || T || g.shuttingDown) && (oe.dispose(), J()), (b = oe), S.clear());
      for (let me of $r({ queryService: b })) S.set(me.name, me);
    } catch (oe) {
      throw (r.log(`[unity-insight-serve] shared serve initialization failed: ${Me(oe)}`, "ERROR"), oe);
    }
    return (
      J(),
      t &&
        b.warmupProjectIndex(t).catch((oe) => {
          r.log(`[unity-insight-serve] index warmup skipped: ${Me(oe)}`, "WARN");
        }),
      N(),
      (v = () => {
        (r.log("[unity-insight-serve] received shutdown signal.", "INFO"), It());
      }),
      process.once("SIGINT", v),
      process.once("SIGTERM", v),
      (ie = setInterval(() => {
        Se();
      }, VG())),
      ie.unref(),
      J(),
      (mt = "running"),
      Ie(),
      await G,
      { exitCode: Hr ? 1 : 0 }
    );
  } catch (G) {
    return (
      r.log(`[unity-insight-serve] shared serve failed: ${Me(G)}`, "ERROR"),
      ft("ERROR", G),
      await xo({ crashType: "fatal_error", error: G, argv: process.argv.slice(2) }),
      { exitCode: 1 }
    );
  } finally {
    try {
      await sr();
    } catch (G) {
      r.log(`[unity-insight-serve] final cleanup failed: ${Me(G)}`, "ERROR");
    }
  }
}
import { Worker as HG } from "node:worker_threads";
import { fileURLToPath as QG } from "node:url";
function YP() {
  let e = QG(new URL("./shimmer-worker.js", import.meta.url)),
    t = new HG(e, { workerData: { startTime: Date.now() } });
  return {
    onProgress(n) {
      t.postMessage({ type: "update", phase: n.phase, detail: Ur(n), percent: Nr(n), count: 0 });
    },
    stop() {
      return new Promise((n) => {
        let r = setTimeout(() => {
          t.terminate().then(() => n());
        }, 2e3);
        (t.on("message", (i) => {
          i.type === "stopped" && (clearTimeout(r), t.terminate().then(() => n()));
        }),
          t.postMessage({ type: "stop" }));
      });
    },
  };
}
function XG(e) {
  let t = -1,
    n = "",
    r = !1,
    i = Date.now(),
    s = () => {
      r &&
        (e(`
`),
        (r = !1));
    },
    o = (a) => {
      let l = ((Date.now() - i) / 1e3).toFixed(1),
        c = Nr(a),
        d = Ur(a),
        u = kE(a, l);
      (c >= t + 1 || c === 100 || d !== n) && ((t = c), (n = d), e(`\r\x1B[K${u}`), (r = !0));
    };
  return ((o.finish = s), o);
}
function Wy(e) {
  if (!e.useShimmer) return XG(e.stdout);
  let t = YP(),
    n = (r) => {
      t.onProgress(r);
    };
  return ((n.finish = () => t.stop()), n);
}
function JG() {
  return process.env.UNITY_INSIGHT_ASCII === "1"
    ? !1
    : process.env.UNITY_INSIGHT_UNICODE === "1"
      ? !0
      : process.platform === "win32"
        ? !1
        : process.env.TERM !== "linux";
}
var ZG = {
    spinner: ["\xB7", "\u2722", "\u2733", "\u2736", "\u273B", "\u273D"],
    barFilled: "\u2588",
    barEmpty: "\u2591",
    rail: "\u2502",
    phaseDone: "\u25C6",
    dash: "\u2014",
  },
  eK = { spinner: [".", "*", "+", "x", "o", "O"], barFilled: "#", barEmpty: "-", rail: "|", phaseDone: "*", dash: "-" },
  Yy = null;
function qy() {
  return (Yy === null && (Yy = JG() ? ZG : eK), Yy);
}
function nK() {
  let e = $r(),
    t = new Map(e.map((n) => [n.name, n.execute]));
  return {
    stdout: (n) => {
      process.stdout.write(n);
    },
    stderr: (n) => {
      (ft("ERROR", n), process.stderr.write(n));
    },
    execute: async (n, r) => {
      let i = t.get(n);
      if (!i) throw new Error(`Unknown Unity Insight tool: ${n}`);
      return i(r);
    },
    buildIndex: async (n) =>
      Xl({
        projectPath: n.projectPath,
        outputPath: n.outputPath,
        schemaVersion: n.schemaVersion,
        includePackages: n.includePackages,
        timing: n.timing,
        onProgress: n.onProgress,
      }),
    syncIndex: async (n) =>
      rc({
        projectPath: n.projectPath,
        paths: n.paths,
        schemaVersion: n.schemaVersion,
        includePackages: n.includePackages,
        syncLog: n.syncLog,
        syncLogPath: n.syncLogPath,
        onProgress: n.onProgress,
      }),
    queryIndexStatus: async (n) => ic({ projectPath: n.projectPath, pendingPathLimit: n.pendingPathLimit }),
  };
}
function un() {
  return [
    "Usage:",
    "  unity-insight-cli <command> [options]",
    "",
    "Commands:",
    "  serve --stdio    Start the Unity Insight stdio RPC server (NDJSON over stdin/stdout).",
    "                   Watches Assets/ by default; use --no-watch to disable.",
    "  serve --daemon   Start the device-global shared TCP RPC server (used by GameCowork CLI).",
    "  index build      Build and publish the local SQLite Unity Insight index.",
    "  index sync       Incrementally update the live Unity Insight index.",
    "  index status     Show index metadata and disk reconcile summary.",
    "  vfs_ls           List virtual entries under a VFS path.",
    "  vfs_glob         Match VFS entries by virtual path glob pattern.",
    "  vfs_read         Read .meta (file/folder), indexed content (node), or full text (:/.content).",
    "  vfs_grep         Search VFS entries under a virtual scope.",
    "  vfs_refs         Query related VFS references or calls (in/out).",
    "",
    "Options:",
    "  --stdio                  Required flag for serve (logs on stderr, protocol on stdout).",
    "  --daemon                 Start device-global shared TCP serve for GameCowork CLI.",
    "  --watch                  Explicitly enable file watch (default on for serve --stdio).",
    "  --no-watch               Disable watch (or set UNITY_INSIGHT_NO_WATCH=1).",
    "  --project                Unity project root (serve --stdio: required; serve --daemon: optional warmup; index: defaults to cwd).",
    "  --paths                  Optional comma-separated project_rel_paths for index sync.",
    "  --full_derived           Force full derived rebuild during index sync (debug).",
    "  --output_path            Optional explicit index output path for index build.",
    "  --schema_version         Optional schema version override for index build/sync.",
    "  --index_packages         Whether index build/sync includes package contents (true|false; default true).",
    "  --no-packages            Disable indexing package contents for index build/sync.",
    "  -q, --quiet              Suppress index build/sync progress output.",
    "  --sync_log               Write aggregated SQLite CRUD log to ./log/sync-db-*.md.",
    "  --sync_log_output        Optional markdown output path for --sync_log.",
    "  --timing                 Print detailed timing report after index build.",
    "  --pattern                Glob pattern for vfs_glob; regex for vfs_grep.",
    "  --path                   VFS path for vfs_ls/vfs_glob/vfs_read/vfs_grep/vfs_refs.",
    "  --type                   Optional for vfs_glob/vfs_grep (default ALL); prefer concrete types when possible.",
    "  --limit                  Maximum matches for vfs_glob/vfs_grep (default 100).",
    "  --depth                  Recursion depth for vfs_ls (default 1) or vfs_read on node paths (0\u20135).",
    "  --show_type              Optional returned child type filter for vfs_ls (GameObject|Component|Prefab|...|ALL).",
    "  --output_format          Text output style for vfs_ls/vfs_glob (flat|grouped_list).",
    "  --include                Optional glob filter for vfs_grep paths.",
    "  --ignore_case            Case-insensitive matching for vfs_glob/vfs_grep (default false).",
    "  --direction              Direction for vfs_refs (in/out; ignored for .cs script paths).",
    "  --target_type            Returned-side type filter for vfs_refs (GameObject|Component|Material|...|ALL).",
    "  --help                   Show this help message.",
    "",
  ].join(`
`);
}
function Kc(e) {
  let t = {};
  for (let n = 0; n < e.length; n += 1) {
    let r = e[n];
    if (!r?.startsWith("--")) continue;
    let i = r.slice(2),
      s = e[n + 1];
    s !== void 0 && !s.startsWith("--") ? ((t[i] = s), (n += 1)) : (t[i] = "true");
  }
  return t;
}
function zy(e) {
  if (e !== void 0) {
    if (e === "true") return !0;
    if (e === "false") return !1;
  }
}
function zr(e) {
  if (e !== void 0) return Number.parseInt(e, 10);
}
function HP(e) {
  return e["no-packages"] === "true" ? !1 : zy(e.index_packages);
}
var rK = "ALL";
function zP(e) {
  let t = e?.trim();
  return t && t !== "" ? t : rK;
}
function iK(e, t) {
  let n = (r) => {
    let i = t.project_path?.trim() || t.project?.trim();
    return (i && (r.project_path = i), r);
  };
  switch (e) {
    case "vfs_ls":
      return t.path
        ? n({
            path: t.path,
            depth: zr(t.depth),
            output_format: t.output_format,
            ...(t.show_type ? { show_type: t.show_type } : {}),
          })
        : null;
    case "vfs_glob": {
      if (!t.pattern) return null;
      let r = zy(t.ignore_case);
      return n({
        pattern: t.pattern,
        path: t.path,
        type: zP(t.type),
        limit: zr(t.limit),
        output_format: t.output_format,
        ignore_case: r ?? !1,
      });
    }
    case "vfs_read":
      return t.path ? n({ path: t.path, depth: zr(t.depth) }) : null;
    case "vfs_grep": {
      let r = t.pattern?.trim();
      if (!r) return null;
      let i = zP(t.type),
        s = zr(t.limit),
        o = zy(t.ignore_case) ?? !1;
      return n({
        pattern: r,
        ...(t.path ? { path: t.path } : {}),
        ...(t.include ? { include: t.include } : {}),
        type: i,
        ...(s !== void 0 ? { limit: s } : {}),
        ignore_case: o,
      });
    }
    case "vfs_refs":
      return t.path
        ? n({ path: t.path, direction: t.direction, ...(t.target_type ? { target_type: t.target_type } : {}) })
        : null;
    default:
      return null;
  }
}
function sK(e) {
  if (e?.trim())
    return e
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
}
function Hy(e) {
  return oy(e.project);
}
function oK(e) {
  let t = { projectPath: Hy(e) };
  e.output_path?.trim() && (t.outputPath = e.output_path.trim());
  let n = zr(e.schema_version);
  n !== void 0 && (t.schemaVersion = n);
  let r = HP(e);
  return (r !== void 0 && (t.includePackages = r), t);
}
function aK(e) {
  let t = { projectPath: Hy(e), paths: sK(e.paths) },
    n = zr(e.schema_version);
  n !== void 0 && (t.schemaVersion = n);
  let r = HP(e);
  (r !== void 0 && (t.includePackages = r),
    (e.full_derived === "true" || e.sync_mode === "full_derived") && (t.syncMode = "full_derived"),
    e.sync_log === "true" && (t.syncLog = !0));
  let i = e.sync_log_output?.trim();
  return (i && ((t.syncLogPath = i), (t.syncLog = !0)), t);
}
function lK(e) {
  let t = zr(e.pending_path_limit);
  return { projectPath: Hy(e), pendingPathLimit: t };
}
function cK(e) {
  return `Reconcile: +${e.createdCount} ~${e.modifiedCount} -${e.deletedCount} \u21C4${e.movedCount}`;
}
function dK(e) {
  if (e.skipReason)
    return `Unity Insight index sync skipped (${e.skipReason}).
${e.diagnostics[0]?.message ?? "Another writer holds the index lock."}
Published index: ${e.publishedIndexPath}
`;
  let t = [
    e.synced ? "Unity Insight index sync completed." : "Unity Insight index is up to date.",
    `Published index: ${e.publishedIndexPath}`,
    cK(e.reconcile),
  ];
  return (
    e.synced &&
      (t.push(`Resolve mode: ${e.resolveMode ?? "partial"}`),
      t.push(`Fanout truncated: ${e.fanoutTruncated === !0 ? "true" : "false"}`)),
    t.push(`Completed stages: ${e.completedStages.join(", ") || "none"}`, `Diagnostics: ${e.summary.diagnosticCount}`),
    e.reconcile.movedPaths.length > 0 && t.push(`Moved: ${e.reconcile.movedPaths.join(", ")}`),
    e.syncLogPath && t.push(`Sync DB log: ${e.syncLogPath}`),
    t.join(`
`) +
      `
`
  );
}
function uK(e) {
  let t = e.writer
      ? `Writer: ${e.writer.mode} (pid ${e.writer.pid}` +
        (e.writer.startedAt ? `, since ${e.writer.startedAt}` : "") +
        ")"
      : "Writer: none",
    n = [
      `Project: ${e.projectPath}`,
      `Index ready: ${e.indexReady}`,
      `Index building: ${e.indexBuilding}`,
      t,
      `Published index: ${e.publishedIndexPath}`,
      `Schema version: ${e.schemaVersion ?? "n/a"}`,
      `Indexed at: ${e.indexedAt ?? "n/a"}`,
      `Last mode: ${e.lastMode ?? "n/a"}`,
      `Discovered files: ${e.discoveredFileCount ?? "n/a"}`,
      `Diagnostics: ${e.diagnosticCount ?? "n/a"}`,
    ];
  return (
    e.progressPercent != null && n.push(`Progress: ${e.progressPercent}%`),
    e.progressPhase && n.push(`Progress phase: ${e.progressPhase}`),
    e.progressDetail && n.push(`Progress detail: ${e.progressDetail}`),
    e.reconcile &&
      (n.push(
        `Reconcile: +${e.reconcile.createdCount} ~${e.reconcile.modifiedCount} -${e.reconcile.deletedCount} =${e.reconcile.unchangedCount}`,
      ),
      e.reconcile.createdPaths.length > 0 && n.push(`Created: ${e.reconcile.createdPaths.join(", ")}`),
      e.reconcile.modifiedPaths.length > 0 && n.push(`Modified: ${e.reconcile.modifiedPaths.join(", ")}`),
      e.reconcile.deletedPaths.length > 0 && n.push(`Deleted: ${e.reconcile.deletedPaths.join(", ")}`)),
    e.watcherIndexing && n.push("Watcher indexing: true"),
    e.watcherPendingPaths.length > 0 && n.push(`Watcher pending paths: ${e.watcherPendingPaths.join(", ")}`),
    e.pendingSyncPaths.length > 0 && n.push(`Pending sync paths: ${e.pendingSyncPaths.join(", ")}`),
    n.join(`
`)
  );
}
function fK(e, t) {
  switch (e) {
    case "vfs_ls":
    case "vfs_refs":
      return "Missing required option: --path";
    case "vfs_read":
      return "Missing required option: --path";
    case "vfs_glob":
      return "Missing required option: vfs_glob requires --pattern (--type defaults to ALL).";
    case "vfs_grep":
      return "Missing required option: vfs_grep requires --pattern (--type defaults to ALL).";
    default:
      return "Missing required option.";
  }
}
function mK(e) {
  return e === "vfs_ls" || e === "vfs_glob" || e === "vfs_read" || e === "vfs_grep" || e === "vfs_refs";
}
function Wc(e) {
  if (e instanceof Error) {
    let t = e.stack
      ? `
${e.stack}`
      : "";
    return `CLI execution failed: ${e.message}${t}
`;
  }
  return `CLI execution failed: ${String(e)}
`;
}
async function yK(e, t = nK(), n = () => {}) {
  let [r, i, ...s] = e;
  if (!r || r === "--help" || r === "-h") return (t.stdout(un()), 0);
  if (r === "serve") {
    let c = [i, ...s].filter((h) => !!h);
    if (c.includes("--help") || c.includes("-h") || i === "--help" || i === "-h") return (t.stdout(un()), 0);
    if (c.includes("--daemon")) {
      let h = Kc(c.filter((E) => E !== "--daemon")),
        b = h.project?.trim(),
        S = vy(s, h),
        P = Nn(S);
      return (n(), (await WP({ ...(b ? { projectPath: b } : {}), watch: P })).exitCode);
    }
    if (i !== "--stdio" && !s.includes("--stdio") && i !== "--help" && i !== "-h")
      return (
        t.stderr(
          `serve requires '--stdio' or '--daemon'.

` + un(),
        ),
        1
      );
    let d = [...(i === "--stdio" ? [] : [i]), ...s].filter((h) => !!h),
      u = Kc(i === "--stdio" ? s : ["--stdio", ...d]),
      f = u.project?.trim();
    if (!f)
      return (
        t.stderr(
          `serve --stdio requires --project <UnityProjectRoot>.

` + un(),
        ),
        1
      );
    let m = vy(s, u),
      y = Nn(m);
    return (n(), (await AP({ projectPath: f, watch: y })).exitCode);
  }
  if (r === "index") {
    if (!i || i === "--help" || i === "-h") return (t.stdout(un()), 0);
    let c = i;
    if (c !== "build" && c !== "sync" && c !== "status")
      return (
        t.stderr(`Unknown command: index ${i}

${un()}`),
        1
      );
    if (s.includes("--help") || s.includes("-h")) return (t.stdout(un()), 0);
    let d = Kc(s);
    if (c === "status") {
      let m = lK(d);
      n();
      try {
        let y = await t.queryIndexStatus(m);
        return (
          t.stdout(
            uK(y) +
              `
`,
          ),
          0
        );
      } catch (y) {
        return (t.stderr(Wc(y)), 1);
      }
    }
    if (c === "sync") {
      let m = aK(d);
      n();
      let y = Date.now();
      ft("INFO", `index.sync start project=${m.projectPath}`);
      try {
        let h =
          !(s.includes("--quiet") || s.includes("-q")) &&
          process.stdout.isTTY === !0 &&
          process.env.UNITY_INSIGHT_PLAIN_PROGRESS !== "1";
        if (h) {
          let P = qy();
          t.stdout(`\x1B[2m${P.rail}\x1B[0m
`);
        }
        let b = Wy({ stdout: t.stdout, useShimmer: h }),
          S = await t.syncIndex({ ...m, onProgress: b });
        return (
          await b.finish(),
          t.stdout(dK(S)),
          ft(
            S.skipReason ? "WARN" : "INFO",
            S.skipReason
              ? `index.sync skipped project=${m.projectPath} reason=${S.skipReason} duration_ms=${Date.now() - y}`
              : `index.sync complete project=${m.projectPath} duration_ms=${Date.now() - y}`,
          ),
          0
        );
      } catch (g) {
        return (t.stderr(Wc(g)), 1);
      } finally {
        await Pn();
      }
    }
    let u = oK(d);
    n();
    let f = Date.now();
    ft("INFO", `index.build start project=${u.projectPath}`);
    try {
      let m = s.includes("--quiet") || s.includes("-q"),
        y = s.includes("--timing"),
        g = !m && process.stdout.isTTY === !0 && process.env.UNITY_INSIGHT_PLAIN_PROGRESS !== "1";
      if (g) {
        let S = qy();
        t.stdout(`\x1B[2m${S.rail}\x1B[0m
`);
      }
      let h = m ? void 0 : Wy({ stdout: t.stdout, useShimmer: g }),
        b = await t.buildIndex({ ...u, timing: y, onProgress: h });
      return (
        await h?.finish(),
        t.stdout(
          [
            "Unity Insight index build completed.",
            `Published index: ${b.publishedIndexPath}`,
            `Schema version: ${b.schemaVersion}`,
            `Completed stages: ${b.completedStages.join(", ")}`,
            `Diagnostics: ${b.summary.diagnosticCount}`,
          ].join(`
`) +
            `
`,
        ),
        b.timing && t.stdout(wE(b.timing)),
        ft("INFO", `index.build complete project=${u.projectPath} duration_ms=${Date.now() - f}`),
        0
      );
    } catch (m) {
      return Wt(m)
        ? (t.stdout(`Unity Insight index build skipped (writer_busy).
${m.message}
`),
          ft("WARN", `index.build skipped project=${u.projectPath} reason=writer_busy duration_ms=${Date.now() - f}`),
          0)
        : (t.stderr(Wc(m)), 1);
    } finally {
      await Pn();
    }
  }
  let o = [i, ...s].filter((c) => c !== void 0);
  if (!mK(r))
    return (
      t.stderr(`Unknown command: ${r}

${un()}`),
      1
    );
  if (o.includes("--help") || o.includes("-h")) return (t.stdout(un()), 0);
  let a = Kc(o),
    l = iK(r, a);
  if (l === null)
    return (
      t.stderr(`${fK(r, a)}

${un()}`),
      1
    );
  n();
  try {
    let c = await t.execute(r, l);
    return (
      t.stdout(
        c.llmContent +
          `
`,
      ),
      c.error
        ? (t.stderr(
            c.error.message +
              `
`,
          ),
          1)
        : 0
    );
  } catch (c) {
    return (t.stderr(Wc(c)), 1);
  }
}
function pK(e, t) {
  if (t === void 0) return !1;
  let n = tK(e);
  try {
    return qP(n) === qP(t);
  } catch {
    return n === t;
  }
}
var gK = pK(import.meta.url, process.argv[1]);
if (gK) {
  let e = process.argv.slice(2);
  jP({ argv: e });
  let t;
  try {
    let n = await yK(e, void 0, () => {
      t = kP({ argv: e });
    });
    (t?.close(n), process.exit(n));
  } catch (n) {
    (t?.error(n), await xo({ crashType: "fatal_error", error: n, argv: e }), t?.close(1), process.exit(1));
  }
}
export { pK as isMainModulePath, yK as runCli };
