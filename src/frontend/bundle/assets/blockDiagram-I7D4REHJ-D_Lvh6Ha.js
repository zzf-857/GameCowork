import { g as Pe } from "./chunk-5VM5RSS4-C8njHi2S.js";
import {
  aO as Fe,
  aP as be,
  aQ as Me,
  aR as Ke,
  aS as Ye,
  aT as We,
  aU as Ve,
  aV as Ue,
  aW as He,
  aX as Xe,
  aY as Ge,
  aZ as je,
  a_ as qe,
  a$ as Ze,
  b0 as Je,
  b1 as Qe,
  b2 as $e,
  b3 as et,
  b4 as tt,
  b5 as st,
  b6 as rt,
  b7 as it,
  b8 as nt,
  b9 as at,
  ba as ot,
  _ as h,
  D as Q,
  m as te,
  bb as ct,
  e as lt,
  l as w,
  t as ut,
  x as gt,
  d as me,
  V as ht,
  aH as dt,
  aG as ft,
  aI as pt,
  n as St,
  bc as xt,
  an as we,
  ao as Lt,
} from "./registry-BL-NPVNy.js";
import { c as yt } from "./channel-0rJEtiuR.js";
(function () {
  var e =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  e.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
})();
try {
  (function () {
    var e =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      i = new e.Error().stack;
    i &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[i] = "eb303f07-0dde-4025-a995-7f864826e128"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-eb303f07-0dde-4025-a995-7f864826e128"));
  })();
} catch {}
function bt(e) {
  return Array.isArray(e);
}
function mt(e) {
  if (Fe(e)) return e;
  const i = be(e);
  if (!wt(e)) return {};
  if (bt(e)) {
    const s = Array.from(e);
    return (
      e.length > 0 &&
        typeof e[0] == "string" &&
        Object.hasOwn(e, "index") &&
        ((s.index = e.index), (s.input = e.input)),
      s
    );
  }
  if (Me(e)) {
    const s = e,
      o = s.constructor;
    return new o(s.buffer, s.byteOffset, s.length);
  }
  if (i === "[object ArrayBuffer]") return new ArrayBuffer(e.byteLength);
  if (i === "[object DataView]") {
    const s = e,
      o = s.buffer,
      f = s.byteOffset,
      u = s.byteLength,
      p = new ArrayBuffer(u),
      S = new Uint8Array(o, f, u);
    return (new Uint8Array(p).set(S), new DataView(p));
  }
  if (i === "[object Boolean]" || i === "[object Number]" || i === "[object String]") {
    const s = e.constructor,
      o = new s(e.valueOf());
    return (i === "[object String]" ? _t(o, e) : ae(o, e), o);
  }
  if (i === "[object Date]") return new Date(Number(e));
  if (i === "[object RegExp]") {
    const s = e,
      o = new RegExp(s.source, s.flags);
    return ((o.lastIndex = s.lastIndex), o);
  }
  if (i === "[object Symbol]") return Object(Symbol.prototype.valueOf.call(e));
  if (i === "[object Map]") {
    const s = e,
      o = new Map();
    return (
      s.forEach((f, u) => {
        o.set(u, f);
      }),
      o
    );
  }
  if (i === "[object Set]") {
    const s = e,
      o = new Set();
    return (
      s.forEach((f) => {
        o.add(f);
      }),
      o
    );
  }
  if (i === "[object Arguments]") {
    const s = e,
      o = {};
    return (ae(o, s), (o.length = s.length), (o[Symbol.iterator] = s[Symbol.iterator]), o);
  }
  const c = {};
  return (Dt(c, e), ae(c, e), Et(c, e), c);
}
function wt(e) {
  switch (be(e)) {
    case ot:
    case at:
    case nt:
    case it:
    case rt:
    case st:
    case tt:
    case et:
    case $e:
    case Qe:
    case Je:
    case Ze:
    case qe:
    case je:
    case Ge:
    case Xe:
    case He:
    case Ue:
    case Ve:
    case We:
    case Ye:
    case Ke:
      return !0;
    default:
      return !1;
  }
}
function ae(e, i) {
  for (const c in i) Object.hasOwn(i, c) && (e[c] = i[c]);
}
function Et(e, i) {
  const c = Object.getOwnPropertySymbols(i);
  for (let s = 0; s < c.length; s++) {
    const o = c[s];
    Object.prototype.propertyIsEnumerable.call(i, o) && (e[o] = i[o]);
  }
}
function _t(e, i) {
  const c = i.valueOf().length;
  for (const s in i) Object.hasOwn(i, s) && (Number.isNaN(Number(s)) || Number(s) >= c) && (e[s] = i[s]);
}
function Dt(e, i) {
  const c = Object.getPrototypeOf(i);
  c !== null && typeof i.constructor == "function" && Object.setPrototypeOf(e, c);
}
var ce = (function () {
  var e = h(function (C, d, r, a) {
      for (r = r || {}, a = C.length; a--; r[C[a]] = d);
      return r;
    }, "o"),
    i = [1, 15],
    c = [1, 7],
    s = [1, 13],
    o = [1, 14],
    f = [1, 19],
    u = [1, 16],
    p = [1, 17],
    S = [1, 18],
    y = [8, 30],
    x = [8, 10, 21, 28, 29, 30, 31, 39, 43, 46],
    l = [1, 23],
    T = [1, 24],
    z = [8, 10, 15, 16, 21, 28, 29, 30, 31, 39, 43, 46],
    D = [8, 10, 15, 16, 21, 27, 28, 29, 30, 31, 39, 43, 46],
    N = [1, 49],
    A = {
      trace: h(function () {}, "trace"),
      yy: {},
      symbols_: {
        error: 2,
        spaceLines: 3,
        SPACELINE: 4,
        NL: 5,
        separator: 6,
        SPACE: 7,
        EOF: 8,
        start: 9,
        BLOCK_DIAGRAM_KEY: 10,
        document: 11,
        stop: 12,
        statement: 13,
        link: 14,
        LINK: 15,
        START_LINK: 16,
        LINK_LABEL: 17,
        STR: 18,
        nodeStatement: 19,
        columnsStatement: 20,
        SPACE_BLOCK: 21,
        blockStatement: 22,
        classDefStatement: 23,
        cssClassStatement: 24,
        styleStatement: 25,
        node: 26,
        SIZE: 27,
        COLUMNS: 28,
        "id-block": 29,
        end: 30,
        NODE_ID: 31,
        nodeShapeNLabel: 32,
        dirList: 33,
        DIR: 34,
        NODE_DSTART: 35,
        NODE_DEND: 36,
        BLOCK_ARROW_START: 37,
        BLOCK_ARROW_END: 38,
        classDef: 39,
        CLASSDEF_ID: 40,
        CLASSDEF_STYLEOPTS: 41,
        DEFAULT: 42,
        class: 43,
        CLASSENTITY_IDS: 44,
        STYLECLASS: 45,
        style: 46,
        STYLE_ENTITY_IDS: 47,
        STYLE_DEFINITION_DATA: 48,
        $accept: 0,
        $end: 1,
      },
      terminals_: {
        2: "error",
        4: "SPACELINE",
        5: "NL",
        7: "SPACE",
        8: "EOF",
        10: "BLOCK_DIAGRAM_KEY",
        15: "LINK",
        16: "START_LINK",
        17: "LINK_LABEL",
        18: "STR",
        21: "SPACE_BLOCK",
        27: "SIZE",
        28: "COLUMNS",
        29: "id-block",
        30: "end",
        31: "NODE_ID",
        34: "DIR",
        35: "NODE_DSTART",
        36: "NODE_DEND",
        37: "BLOCK_ARROW_START",
        38: "BLOCK_ARROW_END",
        39: "classDef",
        40: "CLASSDEF_ID",
        41: "CLASSDEF_STYLEOPTS",
        42: "DEFAULT",
        43: "class",
        44: "CLASSENTITY_IDS",
        45: "STYLECLASS",
        46: "style",
        47: "STYLE_ENTITY_IDS",
        48: "STYLE_DEFINITION_DATA",
      },
      productions_: [
        0,
        [3, 1],
        [3, 2],
        [3, 2],
        [6, 1],
        [6, 1],
        [6, 1],
        [9, 3],
        [12, 1],
        [12, 1],
        [12, 2],
        [12, 2],
        [11, 1],
        [11, 2],
        [14, 1],
        [14, 4],
        [13, 1],
        [13, 1],
        [13, 1],
        [13, 1],
        [13, 1],
        [13, 1],
        [13, 1],
        [19, 3],
        [19, 2],
        [19, 1],
        [20, 1],
        [22, 4],
        [22, 3],
        [26, 1],
        [26, 2],
        [33, 1],
        [33, 2],
        [32, 3],
        [32, 4],
        [23, 3],
        [23, 3],
        [24, 3],
        [25, 3],
      ],
      performAction: h(function (d, r, a, g, b, t, B) {
        var n = t.length - 1;
        switch (b) {
          case 4:
            g.getLogger().debug("Rule: separator (NL) ");
            break;
          case 5:
            g.getLogger().debug("Rule: separator (Space) ");
            break;
          case 6:
            g.getLogger().debug("Rule: separator (EOF) ");
            break;
          case 7:
            (g.getLogger().debug("Rule: hierarchy: ", t[n - 1]), g.setHierarchy(t[n - 1]));
            break;
          case 8:
            g.getLogger().debug("Stop NL ");
            break;
          case 9:
            g.getLogger().debug("Stop EOF ");
            break;
          case 10:
            g.getLogger().debug("Stop NL2 ");
            break;
          case 11:
            g.getLogger().debug("Stop EOF2 ");
            break;
          case 12:
            (g.getLogger().debug("Rule: statement: ", t[n]),
              typeof t[n].length == "number" ? (this.$ = t[n]) : (this.$ = [t[n]]));
            break;
          case 13:
            (g.getLogger().debug("Rule: statement #2: ", t[n - 1]), (this.$ = [t[n - 1]].concat(t[n])));
            break;
          case 14:
            (g.getLogger().debug("Rule: link: ", t[n], d), (this.$ = { edgeTypeStr: t[n], label: "" }));
            break;
          case 15:
            (g.getLogger().debug("Rule: LABEL link: ", t[n - 3], t[n - 1], t[n]),
              (this.$ = { edgeTypeStr: t[n], label: t[n - 1] }));
            break;
          case 18:
            const M = parseInt(t[n]),
              m = g.generateId();
            this.$ = { id: m, type: "space", label: "", width: M, children: [] };
            break;
          case 23:
            g.getLogger().debug(
              "Rule: (nodeStatement link node) ",
              t[n - 2],
              t[n - 1],
              t[n],
              " typestr: ",
              t[n - 1].edgeTypeStr,
            );
            const K = g.edgeStrToEdgeData(t[n - 1].edgeTypeStr),
              k = g.edgeStrToEdgeStartData(t[n - 1].edgeTypeStr),
              q = g.edgeStrToThickness(t[n - 1].edgeTypeStr),
              _ = g.edgeStrToPattern(t[n - 1].edgeTypeStr);
            this.$ = [
              { id: t[n - 2].id, label: t[n - 2].label, type: t[n - 2].type, directions: t[n - 2].directions },
              {
                id: t[n - 2].id + "-" + t[n].id,
                start: t[n - 2].id,
                end: t[n].id,
                label: t[n - 1].label,
                type: "edge",
                thickness: q,
                pattern: _,
                directions: t[n].directions,
                arrowTypeEnd: K,
                arrowTypeStart: k,
              },
              { id: t[n].id, label: t[n].label, type: g.typeStr2Type(t[n].typeStr), directions: t[n].directions },
            ];
            break;
          case 24:
            (g.getLogger().debug("Rule: nodeStatement (abc88 node size) ", t[n - 1], t[n]),
              (this.$ = {
                id: t[n - 1].id,
                label: t[n - 1].label,
                type: g.typeStr2Type(t[n - 1].typeStr),
                directions: t[n - 1].directions,
                widthInColumns: parseInt(t[n], 10),
              }));
            break;
          case 25:
            (g.getLogger().debug("Rule: nodeStatement (node) ", t[n]),
              (this.$ = {
                id: t[n].id,
                label: t[n].label,
                type: g.typeStr2Type(t[n].typeStr),
                directions: t[n].directions,
                widthInColumns: 1,
              }));
            break;
          case 26:
            (g.getLogger().debug("APA123", this ? this : "na"),
              g.getLogger().debug("COLUMNS: ", t[n]),
              (this.$ = { type: "column-setting", columns: t[n] === "auto" ? -1 : parseInt(t[n]) }));
            break;
          case 27:
            (g.getLogger().debug("Rule: id-block statement : ", t[n - 2], t[n - 1]),
              g.generateId(),
              (this.$ = { ...t[n - 2], type: "composite", children: t[n - 1] }));
            break;
          case 28:
            g.getLogger().debug("Rule: blockStatement : ", t[n - 2], t[n - 1], t[n]);
            const Y = g.generateId();
            this.$ = { id: Y, type: "composite", label: "", children: t[n - 1] };
            break;
          case 29:
            (g.getLogger().debug("Rule: node (NODE_ID separator): ", t[n]), (this.$ = { id: t[n] }));
            break;
          case 30:
            (g.getLogger().debug("Rule: node (NODE_ID nodeShapeNLabel separator): ", t[n - 1], t[n]),
              (this.$ = { id: t[n - 1], label: t[n].label, typeStr: t[n].typeStr, directions: t[n].directions }));
            break;
          case 31:
            (g.getLogger().debug("Rule: dirList: ", t[n]), (this.$ = [t[n]]));
            break;
          case 32:
            (g.getLogger().debug("Rule: dirList: ", t[n - 1], t[n]), (this.$ = [t[n - 1]].concat(t[n])));
            break;
          case 33:
            (g.getLogger().debug("Rule: nodeShapeNLabel: ", t[n - 2], t[n - 1], t[n]),
              (this.$ = { typeStr: t[n - 2] + t[n], label: t[n - 1] }));
            break;
          case 34:
            (g.getLogger().debug("Rule: BLOCK_ARROW nodeShapeNLabel: ", t[n - 3], t[n - 2], " #3:", t[n - 1], t[n]),
              (this.$ = { typeStr: t[n - 3] + t[n], label: t[n - 2], directions: t[n - 1] }));
            break;
          case 35:
          case 36:
            this.$ = { type: "classDef", id: t[n - 1].trim(), css: t[n].trim() };
            break;
          case 37:
            this.$ = { type: "applyClass", id: t[n - 1].trim(), styleClass: t[n].trim() };
            break;
          case 38:
            this.$ = { type: "applyStyles", id: t[n - 1].trim(), stylesStr: t[n].trim() };
            break;
        }
      }, "anonymous"),
      table: [
        { 9: 1, 10: [1, 2] },
        { 1: [3] },
        {
          10: i,
          11: 3,
          13: 4,
          19: 5,
          20: 6,
          21: c,
          22: 8,
          23: 9,
          24: 10,
          25: 11,
          26: 12,
          28: s,
          29: o,
          31: f,
          39: u,
          43: p,
          46: S,
        },
        { 8: [1, 20] },
        e(y, [2, 12], {
          13: 4,
          19: 5,
          20: 6,
          22: 8,
          23: 9,
          24: 10,
          25: 11,
          26: 12,
          11: 21,
          10: i,
          21: c,
          28: s,
          29: o,
          31: f,
          39: u,
          43: p,
          46: S,
        }),
        e(x, [2, 16], { 14: 22, 15: l, 16: T }),
        e(x, [2, 17]),
        e(x, [2, 18]),
        e(x, [2, 19]),
        e(x, [2, 20]),
        e(x, [2, 21]),
        e(x, [2, 22]),
        e(z, [2, 25], { 27: [1, 25] }),
        e(x, [2, 26]),
        { 19: 26, 26: 12, 31: f },
        {
          10: i,
          11: 27,
          13: 4,
          19: 5,
          20: 6,
          21: c,
          22: 8,
          23: 9,
          24: 10,
          25: 11,
          26: 12,
          28: s,
          29: o,
          31: f,
          39: u,
          43: p,
          46: S,
        },
        { 40: [1, 28], 42: [1, 29] },
        { 44: [1, 30] },
        { 47: [1, 31] },
        e(D, [2, 29], { 32: 32, 35: [1, 33], 37: [1, 34] }),
        { 1: [2, 7] },
        e(y, [2, 13]),
        { 26: 35, 31: f },
        { 31: [2, 14] },
        { 17: [1, 36] },
        e(z, [2, 24]),
        {
          10: i,
          11: 37,
          13: 4,
          14: 22,
          15: l,
          16: T,
          19: 5,
          20: 6,
          21: c,
          22: 8,
          23: 9,
          24: 10,
          25: 11,
          26: 12,
          28: s,
          29: o,
          31: f,
          39: u,
          43: p,
          46: S,
        },
        { 30: [1, 38] },
        { 41: [1, 39] },
        { 41: [1, 40] },
        { 45: [1, 41] },
        { 48: [1, 42] },
        e(D, [2, 30]),
        { 18: [1, 43] },
        { 18: [1, 44] },
        e(z, [2, 23]),
        { 18: [1, 45] },
        { 30: [1, 46] },
        e(x, [2, 28]),
        e(x, [2, 35]),
        e(x, [2, 36]),
        e(x, [2, 37]),
        e(x, [2, 38]),
        { 36: [1, 47] },
        { 33: 48, 34: N },
        { 15: [1, 50] },
        e(x, [2, 27]),
        e(D, [2, 33]),
        { 38: [1, 51] },
        { 33: 52, 34: N, 38: [2, 31] },
        { 31: [2, 15] },
        e(D, [2, 34]),
        { 38: [2, 32] },
      ],
      defaultActions: { 20: [2, 7], 23: [2, 14], 50: [2, 15], 52: [2, 32] },
      parseError: h(function (d, r) {
        if (r.recoverable) this.trace(d);
        else {
          var a = new Error(d);
          throw ((a.hash = r), a);
        }
      }, "parseError"),
      parse: h(function (d) {
        var r = this,
          a = [0],
          g = [],
          b = [null],
          t = [],
          B = this.table,
          n = "",
          M = 0,
          m = 0,
          K = 2,
          k = 1,
          q = t.slice.call(arguments, 1),
          _ = Object.create(this.lexer),
          Y = { yy: {} };
        for (var X in this.yy) Object.prototype.hasOwnProperty.call(this.yy, X) && (Y.yy[X] = this.yy[X]);
        (_.setInput(d, Y.yy), (Y.yy.lexer = _), (Y.yy.parser = this), typeof _.yylloc > "u" && (_.yylloc = {}));
        var G = _.yylloc;
        t.push(G);
        var Z = _.options && _.options.ranges;
        typeof Y.yy.parseError == "function"
          ? (this.parseError = Y.yy.parseError)
          : (this.parseError = Object.getPrototypeOf(this).parseError);
        function L(F) {
          ((a.length = a.length - 2 * F), (b.length = b.length - F), (t.length = t.length - F));
        }
        h(L, "popStack");
        function I() {
          var F;
          return (
            (F = g.pop() || _.lex() || k),
            typeof F != "number" && (F instanceof Array && ((g = F), (F = g.pop())), (F = r.symbols_[F] || F)),
            F
          );
        }
        h(I, "lex");
        for (var E, P, v, j, U = {}, H, W, $, ee; ;) {
          if (
            ((P = a[a.length - 1]),
            this.defaultActions[P]
              ? (v = this.defaultActions[P])
              : ((E === null || typeof E > "u") && (E = I()), (v = B[P] && B[P][E])),
            typeof v > "u" || !v.length || !v[0])
          ) {
            var ne = "";
            ee = [];
            for (H in B[P]) this.terminals_[H] && H > K && ee.push("'" + this.terminals_[H] + "'");
            (_.showPosition
              ? (ne =
                  "Parse error on line " +
                  (M + 1) +
                  `:
` +
                  _.showPosition() +
                  `
Expecting ` +
                  ee.join(", ") +
                  ", got '" +
                  (this.terminals_[E] || E) +
                  "'")
              : (ne =
                  "Parse error on line " +
                  (M + 1) +
                  ": Unexpected " +
                  (E == k ? "end of input" : "'" + (this.terminals_[E] || E) + "'")),
              this.parseError(ne, {
                text: _.match,
                token: this.terminals_[E] || E,
                line: _.yylineno,
                loc: G,
                expected: ee,
              }));
          }
          if (v[0] instanceof Array && v.length > 1)
            throw new Error("Parse Error: multiple actions possible at state: " + P + ", token: " + E);
          switch (v[0]) {
            case 1:
              (a.push(E),
                b.push(_.yytext),
                t.push(_.yylloc),
                a.push(v[1]),
                (E = null),
                (m = _.yyleng),
                (n = _.yytext),
                (M = _.yylineno),
                (G = _.yylloc));
              break;
            case 2:
              if (
                ((W = this.productions_[v[1]][1]),
                (U.$ = b[b.length - W]),
                (U._$ = {
                  first_line: t[t.length - (W || 1)].first_line,
                  last_line: t[t.length - 1].last_line,
                  first_column: t[t.length - (W || 1)].first_column,
                  last_column: t[t.length - 1].last_column,
                }),
                Z && (U._$.range = [t[t.length - (W || 1)].range[0], t[t.length - 1].range[1]]),
                (j = this.performAction.apply(U, [n, m, M, Y.yy, v[1], b, t].concat(q))),
                typeof j < "u")
              )
                return j;
              (W && ((a = a.slice(0, -1 * W * 2)), (b = b.slice(0, -1 * W)), (t = t.slice(0, -1 * W))),
                a.push(this.productions_[v[1]][0]),
                b.push(U.$),
                t.push(U._$),
                ($ = B[a[a.length - 2]][a[a.length - 1]]),
                a.push($));
              break;
            case 3:
              return !0;
          }
        }
        return !0;
      }, "parse"),
    },
    O = (function () {
      var C = {
        EOF: 1,
        parseError: h(function (r, a) {
          if (this.yy.parser) this.yy.parser.parseError(r, a);
          else throw new Error(r);
        }, "parseError"),
        setInput: h(function (d, r) {
          return (
            (this.yy = r || this.yy || {}),
            (this._input = d),
            (this._more = this._backtrack = this.done = !1),
            (this.yylineno = this.yyleng = 0),
            (this.yytext = this.matched = this.match = ""),
            (this.conditionStack = ["INITIAL"]),
            (this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 }),
            this.options.ranges && (this.yylloc.range = [0, 0]),
            (this.offset = 0),
            this
          );
        }, "setInput"),
        input: h(function () {
          var d = this._input[0];
          ((this.yytext += d), this.yyleng++, this.offset++, (this.match += d), (this.matched += d));
          var r = d.match(/(?:\r\n?|\n).*/g);
          return (
            r ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++,
            this.options.ranges && this.yylloc.range[1]++,
            (this._input = this._input.slice(1)),
            d
          );
        }, "input"),
        unput: h(function (d) {
          var r = d.length,
            a = d.split(/(?:\r\n?|\n)/g);
          ((this._input = d + this._input),
            (this.yytext = this.yytext.substr(0, this.yytext.length - r)),
            (this.offset -= r));
          var g = this.match.split(/(?:\r\n?|\n)/g);
          ((this.match = this.match.substr(0, this.match.length - 1)),
            (this.matched = this.matched.substr(0, this.matched.length - 1)),
            a.length - 1 && (this.yylineno -= a.length - 1));
          var b = this.yylloc.range;
          return (
            (this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: a
                ? (a.length === g.length ? this.yylloc.first_column : 0) + g[g.length - a.length].length - a[0].length
                : this.yylloc.first_column - r,
            }),
            this.options.ranges && (this.yylloc.range = [b[0], b[0] + this.yyleng - r]),
            (this.yyleng = this.yytext.length),
            this
          );
        }, "unput"),
        more: h(function () {
          return ((this._more = !0), this);
        }, "more"),
        reject: h(function () {
          if (this.options.backtrack_lexer) this._backtrack = !0;
          else
            return this.parseError(
              "Lexical error on line " +
                (this.yylineno + 1) +
                `. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
` +
                this.showPosition(),
              { text: "", token: null, line: this.yylineno },
            );
          return this;
        }, "reject"),
        less: h(function (d) {
          this.unput(this.match.slice(d));
        }, "less"),
        pastInput: h(function () {
          var d = this.matched.substr(0, this.matched.length - this.match.length);
          return (d.length > 20 ? "..." : "") + d.substr(-20).replace(/\n/g, "");
        }, "pastInput"),
        upcomingInput: h(function () {
          var d = this.match;
          return (
            d.length < 20 && (d += this._input.substr(0, 20 - d.length)),
            (d.substr(0, 20) + (d.length > 20 ? "..." : "")).replace(/\n/g, "")
          );
        }, "upcomingInput"),
        showPosition: h(function () {
          var d = this.pastInput(),
            r = new Array(d.length + 1).join("-");
          return (
            d +
            this.upcomingInput() +
            `
` +
            r +
            "^"
          );
        }, "showPosition"),
        test_match: h(function (d, r) {
          var a, g, b;
          if (
            (this.options.backtrack_lexer &&
              ((b = {
                yylineno: this.yylineno,
                yylloc: {
                  first_line: this.yylloc.first_line,
                  last_line: this.last_line,
                  first_column: this.yylloc.first_column,
                  last_column: this.yylloc.last_column,
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done,
              }),
              this.options.ranges && (b.yylloc.range = this.yylloc.range.slice(0))),
            (g = d[0].match(/(?:\r\n?|\n).*/g)),
            g && (this.yylineno += g.length),
            (this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: g
                ? g[g.length - 1].length - g[g.length - 1].match(/\r?\n?/)[0].length
                : this.yylloc.last_column + d[0].length,
            }),
            (this.yytext += d[0]),
            (this.match += d[0]),
            (this.matches = d),
            (this.yyleng = this.yytext.length),
            this.options.ranges && (this.yylloc.range = [this.offset, (this.offset += this.yyleng)]),
            (this._more = !1),
            (this._backtrack = !1),
            (this._input = this._input.slice(d[0].length)),
            (this.matched += d[0]),
            (a = this.performAction.call(this, this.yy, this, r, this.conditionStack[this.conditionStack.length - 1])),
            this.done && this._input && (this.done = !1),
            a)
          )
            return a;
          if (this._backtrack) {
            for (var t in b) this[t] = b[t];
            return !1;
          }
          return !1;
        }, "test_match"),
        next: h(function () {
          if (this.done) return this.EOF;
          this._input || (this.done = !0);
          var d, r, a, g;
          this._more || ((this.yytext = ""), (this.match = ""));
          for (var b = this._currentRules(), t = 0; t < b.length; t++)
            if (((a = this._input.match(this.rules[b[t]])), a && (!r || a[0].length > r[0].length))) {
              if (((r = a), (g = t), this.options.backtrack_lexer)) {
                if (((d = this.test_match(a, b[t])), d !== !1)) return d;
                if (this._backtrack) {
                  r = !1;
                  continue;
                } else return !1;
              } else if (!this.options.flex) break;
            }
          return r
            ? ((d = this.test_match(r, b[g])), d !== !1 ? d : !1)
            : this._input === ""
              ? this.EOF
              : this.parseError(
                  "Lexical error on line " +
                    (this.yylineno + 1) +
                    `. Unrecognized text.
` +
                    this.showPosition(),
                  { text: "", token: null, line: this.yylineno },
                );
        }, "next"),
        lex: h(function () {
          var r = this.next();
          return r || this.lex();
        }, "lex"),
        begin: h(function (r) {
          this.conditionStack.push(r);
        }, "begin"),
        popState: h(function () {
          var r = this.conditionStack.length - 1;
          return r > 0 ? this.conditionStack.pop() : this.conditionStack[0];
        }, "popState"),
        _currentRules: h(function () {
          return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]
            ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
            : this.conditions.INITIAL.rules;
        }, "_currentRules"),
        topState: h(function (r) {
          return ((r = this.conditionStack.length - 1 - Math.abs(r || 0)), r >= 0 ? this.conditionStack[r] : "INITIAL");
        }, "topState"),
        pushState: h(function (r) {
          this.begin(r);
        }, "pushState"),
        stateStackSize: h(function () {
          return this.conditionStack.length;
        }, "stateStackSize"),
        options: {},
        performAction: h(function (r, a, g, b) {
          switch (g) {
            case 0:
              return (r.getLogger().debug("Found block-beta"), 10);
            case 1:
              return (r.getLogger().debug("Found id-block"), 29);
            case 2:
              return (r.getLogger().debug("Found block"), 10);
            case 3:
              r.getLogger().debug(".", a.yytext);
              break;
            case 4:
              r.getLogger().debug("_", a.yytext);
              break;
            case 5:
              return 5;
            case 6:
              return ((a.yytext = -1), 28);
            case 7:
              return (
                (a.yytext = a.yytext.replace(/columns\s+/, "")),
                r.getLogger().debug("COLUMNS (LEX)", a.yytext),
                28
              );
            case 8:
              this.pushState("md_string");
              break;
            case 9:
              return "MD_STR";
            case 10:
              this.popState();
              break;
            case 11:
              this.pushState("string");
              break;
            case 12:
              (r.getLogger().debug("LEX: POPPING STR:", a.yytext), this.popState());
              break;
            case 13:
              return (r.getLogger().debug("LEX: STR end:", a.yytext), "STR");
            case 14:
              return (
                (a.yytext = a.yytext.replace(/space\:/, "")),
                r.getLogger().debug("SPACE NUM (LEX)", a.yytext),
                21
              );
            case 15:
              return ((a.yytext = "1"), r.getLogger().debug("COLUMNS (LEX)", a.yytext), 21);
            case 16:
              return 42;
            case 17:
              return "LINKSTYLE";
            case 18:
              return "INTERPOLATE";
            case 19:
              return (this.pushState("CLASSDEF"), 39);
            case 20:
              return (this.popState(), this.pushState("CLASSDEFID"), "DEFAULT_CLASSDEF_ID");
            case 21:
              return (this.popState(), this.pushState("CLASSDEFID"), 40);
            case 22:
              return (this.popState(), 41);
            case 23:
              return (this.pushState("CLASS"), 43);
            case 24:
              return (this.popState(), this.pushState("CLASS_STYLE"), 44);
            case 25:
              return (this.popState(), 45);
            case 26:
              return (this.pushState("STYLE_STMNT"), 46);
            case 27:
              return (this.popState(), this.pushState("STYLE_DEFINITION"), 47);
            case 28:
              return (this.popState(), 48);
            case 29:
              return (this.pushState("acc_title"), "acc_title");
            case 30:
              return (this.popState(), "acc_title_value");
            case 31:
              return (this.pushState("acc_descr"), "acc_descr");
            case 32:
              return (this.popState(), "acc_descr_value");
            case 33:
              this.pushState("acc_descr_multiline");
              break;
            case 34:
              this.popState();
              break;
            case 35:
              return "acc_descr_multiline_value";
            case 36:
              return 30;
            case 37:
              return (this.popState(), r.getLogger().debug("Lex: (("), "NODE_DEND");
            case 38:
              return (this.popState(), r.getLogger().debug("Lex: (("), "NODE_DEND");
            case 39:
              return (this.popState(), r.getLogger().debug("Lex: ))"), "NODE_DEND");
            case 40:
              return (this.popState(), r.getLogger().debug("Lex: (("), "NODE_DEND");
            case 41:
              return (this.popState(), r.getLogger().debug("Lex: (("), "NODE_DEND");
            case 42:
              return (this.popState(), r.getLogger().debug("Lex: (-"), "NODE_DEND");
            case 43:
              return (this.popState(), r.getLogger().debug("Lex: -)"), "NODE_DEND");
            case 44:
              return (this.popState(), r.getLogger().debug("Lex: (("), "NODE_DEND");
            case 45:
              return (this.popState(), r.getLogger().debug("Lex: ]]"), "NODE_DEND");
            case 46:
              return (this.popState(), r.getLogger().debug("Lex: ("), "NODE_DEND");
            case 47:
              return (this.popState(), r.getLogger().debug("Lex: ])"), "NODE_DEND");
            case 48:
              return (this.popState(), r.getLogger().debug("Lex: /]"), "NODE_DEND");
            case 49:
              return (this.popState(), r.getLogger().debug("Lex: /]"), "NODE_DEND");
            case 50:
              return (this.popState(), r.getLogger().debug("Lex: )]"), "NODE_DEND");
            case 51:
              return (this.popState(), r.getLogger().debug("Lex: )"), "NODE_DEND");
            case 52:
              return (this.popState(), r.getLogger().debug("Lex: ]>"), "NODE_DEND");
            case 53:
              return (this.popState(), r.getLogger().debug("Lex: ]"), "NODE_DEND");
            case 54:
              return (r.getLogger().debug("Lexa: -)"), this.pushState("NODE"), 35);
            case 55:
              return (r.getLogger().debug("Lexa: (-"), this.pushState("NODE"), 35);
            case 56:
              return (r.getLogger().debug("Lexa: ))"), this.pushState("NODE"), 35);
            case 57:
              return (r.getLogger().debug("Lexa: )"), this.pushState("NODE"), 35);
            case 58:
              return (r.getLogger().debug("Lex: ((("), this.pushState("NODE"), 35);
            case 59:
              return (r.getLogger().debug("Lexa: )"), this.pushState("NODE"), 35);
            case 60:
              return (r.getLogger().debug("Lexa: )"), this.pushState("NODE"), 35);
            case 61:
              return (r.getLogger().debug("Lexa: )"), this.pushState("NODE"), 35);
            case 62:
              return (r.getLogger().debug("Lexc: >"), this.pushState("NODE"), 35);
            case 63:
              return (r.getLogger().debug("Lexa: (["), this.pushState("NODE"), 35);
            case 64:
              return (r.getLogger().debug("Lexa: )"), this.pushState("NODE"), 35);
            case 65:
              return (this.pushState("NODE"), 35);
            case 66:
              return (this.pushState("NODE"), 35);
            case 67:
              return (this.pushState("NODE"), 35);
            case 68:
              return (this.pushState("NODE"), 35);
            case 69:
              return (this.pushState("NODE"), 35);
            case 70:
              return (this.pushState("NODE"), 35);
            case 71:
              return (this.pushState("NODE"), 35);
            case 72:
              return (r.getLogger().debug("Lexa: ["), this.pushState("NODE"), 35);
            case 73:
              return (this.pushState("BLOCK_ARROW"), r.getLogger().debug("LEX ARR START"), 37);
            case 74:
              return (r.getLogger().debug("Lex: NODE_ID", a.yytext), 31);
            case 75:
              return (r.getLogger().debug("Lex: EOF", a.yytext), 8);
            case 76:
              this.pushState("md_string");
              break;
            case 77:
              this.pushState("md_string");
              break;
            case 78:
              return "NODE_DESCR";
            case 79:
              this.popState();
              break;
            case 80:
              (r.getLogger().debug("Lex: Starting string"), this.pushState("string"));
              break;
            case 81:
              (r.getLogger().debug("LEX ARR: Starting string"), this.pushState("string"));
              break;
            case 82:
              return (r.getLogger().debug("LEX: NODE_DESCR:", a.yytext), "NODE_DESCR");
            case 83:
              (r.getLogger().debug("LEX POPPING"), this.popState());
              break;
            case 84:
              (r.getLogger().debug("Lex: =>BAE"), this.pushState("ARROW_DIR"));
              break;
            case 85:
              return (
                (a.yytext = a.yytext.replace(/^,\s*/, "")),
                r.getLogger().debug("Lex (right): dir:", a.yytext),
                "DIR"
              );
            case 86:
              return ((a.yytext = a.yytext.replace(/^,\s*/, "")), r.getLogger().debug("Lex (left):", a.yytext), "DIR");
            case 87:
              return ((a.yytext = a.yytext.replace(/^,\s*/, "")), r.getLogger().debug("Lex (x):", a.yytext), "DIR");
            case 88:
              return ((a.yytext = a.yytext.replace(/^,\s*/, "")), r.getLogger().debug("Lex (y):", a.yytext), "DIR");
            case 89:
              return ((a.yytext = a.yytext.replace(/^,\s*/, "")), r.getLogger().debug("Lex (up):", a.yytext), "DIR");
            case 90:
              return ((a.yytext = a.yytext.replace(/^,\s*/, "")), r.getLogger().debug("Lex (down):", a.yytext), "DIR");
            case 91:
              return (
                (a.yytext = "]>"),
                r.getLogger().debug("Lex (ARROW_DIR end):", a.yytext),
                this.popState(),
                this.popState(),
                "BLOCK_ARROW_END"
              );
            case 92:
              return (r.getLogger().debug("Lex: LINK", "#" + a.yytext + "#"), 15);
            case 93:
              return (r.getLogger().debug("Lex: LINK", a.yytext), 15);
            case 94:
              return (r.getLogger().debug("Lex: LINK", a.yytext), 15);
            case 95:
              return (r.getLogger().debug("Lex: LINK", a.yytext), 15);
            case 96:
              return (r.getLogger().debug("Lex: START_LINK", a.yytext), this.pushState("LLABEL"), 16);
            case 97:
              return (r.getLogger().debug("Lex: START_LINK", a.yytext), this.pushState("LLABEL"), 16);
            case 98:
              return (r.getLogger().debug("Lex: START_LINK", a.yytext), this.pushState("LLABEL"), 16);
            case 99:
              this.pushState("md_string");
              break;
            case 100:
              return (r.getLogger().debug("Lex: Starting string"), this.pushState("string"), "LINK_LABEL");
            case 101:
              return (this.popState(), r.getLogger().debug("Lex: LINK", "#" + a.yytext + "#"), 15);
            case 102:
              return (this.popState(), r.getLogger().debug("Lex: LINK", a.yytext), 15);
            case 103:
              return (this.popState(), r.getLogger().debug("Lex: LINK", a.yytext), 15);
            case 104:
              return (r.getLogger().debug("Lex: COLON", a.yytext), (a.yytext = a.yytext.slice(1)), 27);
          }
        }, "anonymous"),
        rules: [
          /^(?:block-beta\b)/,
          /^(?:block:)/,
          /^(?:block\b)/,
          /^(?:[\s]+)/,
          /^(?:[\n]+)/,
          /^(?:((\u000D\u000A)|(\u000A)))/,
          /^(?:columns\s+auto\b)/,
          /^(?:columns\s+[\d]+)/,
          /^(?:["][`])/,
          /^(?:[^`"]+)/,
          /^(?:[`]["])/,
          /^(?:["])/,
          /^(?:["])/,
          /^(?:[^"]*)/,
          /^(?:space[:]\d+)/,
          /^(?:space\b)/,
          /^(?:default\b)/,
          /^(?:linkStyle\b)/,
          /^(?:interpolate\b)/,
          /^(?:classDef\s+)/,
          /^(?:DEFAULT\s+)/,
          /^(?:\w+\s+)/,
          /^(?:[^\n]*)/,
          /^(?:class\s+)/,
          /^(?:(\w+)+((,\s*\w+)*))/,
          /^(?:[^\n]*)/,
          /^(?:style\s+)/,
          /^(?:(\w+)+((,\s*\w+)*))/,
          /^(?:[^\n]*)/,
          /^(?:accTitle\s*:\s*)/,
          /^(?:(?!\n||)*[^\n]*)/,
          /^(?:accDescr\s*:\s*)/,
          /^(?:(?!\n||)*[^\n]*)/,
          /^(?:accDescr\s*\{\s*)/,
          /^(?:[\}])/,
          /^(?:[^\}]*)/,
          /^(?:end\b\s*)/,
          /^(?:\(\(\()/,
          /^(?:\)\)\))/,
          /^(?:[\)]\))/,
          /^(?:\}\})/,
          /^(?:\})/,
          /^(?:\(-)/,
          /^(?:-\))/,
          /^(?:\(\()/,
          /^(?:\]\])/,
          /^(?:\()/,
          /^(?:\]\))/,
          /^(?:\\\])/,
          /^(?:\/\])/,
          /^(?:\)\])/,
          /^(?:[\)])/,
          /^(?:\]>)/,
          /^(?:[\]])/,
          /^(?:-\))/,
          /^(?:\(-)/,
          /^(?:\)\))/,
          /^(?:\))/,
          /^(?:\(\(\()/,
          /^(?:\(\()/,
          /^(?:\{\{)/,
          /^(?:\{)/,
          /^(?:>)/,
          /^(?:\(\[)/,
          /^(?:\()/,
          /^(?:\[\[)/,
          /^(?:\[\|)/,
          /^(?:\[\()/,
          /^(?:\)\)\))/,
          /^(?:\[\\)/,
          /^(?:\[\/)/,
          /^(?:\[\\)/,
          /^(?:\[)/,
          /^(?:<\[)/,
          /^(?:[^\(\[\n\-\)\{\}\s\<\>:=]+)/,
          /^(?:$)/,
          /^(?:["][`])/,
          /^(?:["][`])/,
          /^(?:[^`"]+)/,
          /^(?:[`]["])/,
          /^(?:["])/,
          /^(?:["])/,
          /^(?:[^"]+)/,
          /^(?:["])/,
          /^(?:\]>\s*\()/,
          /^(?:,?\s*right\s*)/,
          /^(?:,?\s*left\s*)/,
          /^(?:,?\s*x\s*)/,
          /^(?:,?\s*y\s*)/,
          /^(?:,?\s*up\s*)/,
          /^(?:,?\s*down\s*)/,
          /^(?:\)\s*)/,
          /^(?:\s*[xo<]?--+[-xo>]\s*)/,
          /^(?:\s*[xo<]?==+[=xo>]\s*)/,
          /^(?:\s*[xo<]?-?\.+-[xo>]?\s*)/,
          /^(?:\s*~~[\~]+\s*)/,
          /^(?:\s*[xo<]?--\s*)/,
          /^(?:\s*[xo<]?==\s*)/,
          /^(?:\s*[xo<]?-\.\s*)/,
          /^(?:["][`])/,
          /^(?:["])/,
          /^(?:\s*[xo<]?--+[-xo>]\s*)/,
          /^(?:\s*[xo<]?==+[=xo>]\s*)/,
          /^(?:\s*[xo<]?-?\.+-[xo>]?\s*)/,
          /^(?::\d+)/,
        ],
        conditions: {
          STYLE_DEFINITION: { rules: [28], inclusive: !1 },
          STYLE_STMNT: { rules: [27], inclusive: !1 },
          CLASSDEFID: { rules: [22], inclusive: !1 },
          CLASSDEF: { rules: [20, 21], inclusive: !1 },
          CLASS_STYLE: { rules: [25], inclusive: !1 },
          CLASS: { rules: [24], inclusive: !1 },
          LLABEL: { rules: [99, 100, 101, 102, 103], inclusive: !1 },
          ARROW_DIR: { rules: [85, 86, 87, 88, 89, 90, 91], inclusive: !1 },
          BLOCK_ARROW: { rules: [76, 81, 84], inclusive: !1 },
          NODE: { rules: [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 77, 80], inclusive: !1 },
          md_string: { rules: [9, 10, 78, 79], inclusive: !1 },
          space: { rules: [], inclusive: !1 },
          string: { rules: [12, 13, 82, 83], inclusive: !1 },
          acc_descr_multiline: { rules: [34, 35], inclusive: !1 },
          acc_descr: { rules: [32], inclusive: !1 },
          acc_title: { rules: [30], inclusive: !1 },
          INITIAL: {
            rules: [
              0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 14, 15, 16, 17, 18, 19, 23, 26, 29, 31, 33, 36, 54, 55, 56, 57, 58, 59, 60,
              61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 92, 93, 94, 95, 96, 97, 98, 104,
            ],
            inclusive: !0,
          },
        },
      };
      return C;
    })();
  A.lexer = O;
  function R() {
    this.yy = {};
  }
  return (h(R, "Parser"), (R.prototype = A), (A.Parser = R), new R());
})();
ce.parser = ce;
var Tt = ce,
  V = new Map(),
  ge = [],
  le = new Map(),
  xe = "color",
  Le = "fill",
  Nt = "bgFill",
  Ee = ",",
  se = new Map(),
  he = "",
  It = h((e) => St.sanitizeText(e, me()), "sanitizeText"),
  Ot = h(function (e, i = "") {
    let c = se.get(e);
    (c || ((c = { id: e, styles: [], textStyles: [] }), se.set(e, c)),
      i != null &&
        i.split(Ee).forEach((s) => {
          const o = s.replace(/([^;]*);/, "$1").trim();
          if (RegExp(xe).exec(s)) {
            const u = o.replace(Le, Nt).replace(xe, Le);
            c.textStyles.push(u);
          }
          c.styles.push(o);
        }));
  }, "addStyleClass"),
  Ct = h(function (e, i = "") {
    const c = V.get(e);
    i != null && (c.styles = i.split(Ee));
  }, "addStyle2Node"),
  vt = h(function (e, i) {
    e.split(",").forEach(function (c) {
      let s = V.get(c);
      if (s === void 0) {
        const o = c.trim();
        ((s = { id: o, type: "na", children: [] }), V.set(o, s));
      }
      (s.classes || (s.classes = []), s.classes.push(i));
    });
  }, "setCssClass"),
  _e = h((e, i) => {
    var u, p, S, y, x;
    const c = e.flat(),
      s = [],
      o = c.find((l) => (l == null ? void 0 : l.type) === "column-setting"),
      f = (u = o == null ? void 0 : o.columns) != null ? u : -1;
    for (const l of c) {
      if (
        (typeof f == "number" &&
          f > 0 &&
          l.type !== "column-setting" &&
          typeof l.widthInColumns == "number" &&
          l.widthInColumns > f &&
          w.warn(`Block ${l.id} width ${l.widthInColumns} exceeds configured column width ${f}`),
        l.label && (l.label = It(l.label)),
        l.type === "classDef")
      ) {
        Ot(l.id, l.css);
        continue;
      }
      if (l.type === "applyClass") {
        vt(l.id, (p = l == null ? void 0 : l.styleClass) != null ? p : "");
        continue;
      }
      if (l.type === "applyStyles") {
        l != null && l.stylesStr && Ct(l.id, l == null ? void 0 : l.stylesStr);
        continue;
      }
      if (l.type === "column-setting") i.columns = (S = l.columns) != null ? S : -1;
      else if (l.type === "edge") {
        const T = ((y = le.get(l.id)) != null ? y : 0) + 1;
        (le.set(l.id, T), (l.id = T + "-" + l.id), ge.push(l));
      } else {
        l.label || (l.type === "composite" ? (l.label = "") : (l.label = l.id));
        const T = V.get(l.id);
        if (
          (T === void 0
            ? V.set(l.id, l)
            : (l.type !== "na" && (T.type = l.type), l.label !== l.id && (T.label = l.label)),
          l.children && _e(l.children, l),
          l.type === "space")
        ) {
          const z = (x = l.width) != null ? x : 1;
          for (let D = 0; D < z; D++) {
            const N = mt(l);
            ((N.id = N.id + "-" + D), V.set(N.id, N), s.push(N));
          }
        } else T === void 0 && s.push(l);
      }
    }
    i.children = s;
  }, "populateBlockDatabase"),
  de = [],
  J = { id: "root", type: "composite", children: [], columns: -1 },
  At = h(() => {
    (w.debug("Clear called"),
      ut(),
      (J = { id: "root", type: "composite", children: [], columns: -1 }),
      (V = new Map([["root", J]])),
      (de = []),
      (se = new Map()),
      (ge = []),
      (le = new Map()),
      (he = ""));
  }, "clear");
function De(e) {
  switch ((w.debug("typeStr2Type", e), e)) {
    case "[]":
      return "square";
    case "()":
      return (w.debug("we have a round"), "round");
    case "(())":
      return "circle";
    case ">]":
      return "rect_left_inv_arrow";
    case "{}":
      return "diamond";
    case "{{}}":
      return "hexagon";
    case "([])":
      return "stadium";
    case "[[]]":
      return "subroutine";
    case "[()]":
      return "cylinder";
    case "((()))":
      return "doublecircle";
    case "[//]":
      return "lean_right";
    case "[\\\\]":
      return "lean_left";
    case "[/\\]":
      return "trapezoid";
    case "[\\/]":
      return "inv_trapezoid";
    case "<[]>":
      return "block_arrow";
    default:
      return "na";
  }
}
h(De, "typeStr2Type");
function Te(e) {
  switch ((w.debug("typeStr2Type", e), e)) {
    case "==":
      return "thick";
    default:
      return "normal";
  }
}
h(Te, "edgeTypeStr2Type");
function Ne(e) {
  switch (e.trim().slice(-1)) {
    case "x":
      return "arrow_cross";
    case "o":
      return "arrow_circle";
    case ">":
      return "arrow_point";
    default:
      return "";
  }
}
h(Ne, "edgeStrToEdgeData");
function Ie(e) {
  switch (e.trim().charAt(0)) {
    case "x":
      return "arrow_cross";
    case "o":
      return "arrow_circle";
    case "<":
      return "arrow_point";
    default:
      return "arrow_open";
  }
}
h(Ie, "edgeStrToEdgeStartData");
function Oe(e) {
  return e.includes("==") ? "thick" : "normal";
}
h(Oe, "edgeStrToThickness");
function Ce(e) {
  return e.includes(".-") ? "dotted" : "solid";
}
h(Ce, "edgeStrToPattern");
var ye = 0,
  zt = h(() => (ye++, "id-" + Math.random().toString(36).substr(2, 12) + "-" + ye), "generateId"),
  Rt = h((e) => {
    ((J.children = e), _e(e, J), (de = J.children));
  }, "setHierarchy"),
  Bt = h((e) => {
    const i = V.get(e);
    return i ? (i.columns ? i.columns : i.children ? i.children.length : -1) : -1;
  }, "getColumns"),
  kt = h(() => [...V.values()], "getBlocksFlat"),
  Pt = h(() => de || [], "getBlocks"),
  Ft = h(() => ge, "getEdges"),
  Mt = h((e) => V.get(e), "getBlock"),
  Kt = h((e) => {
    V.set(e.id, e);
  }, "setBlock"),
  Yt = h((e) => {
    he = e;
  }, "setDiagramId"),
  Wt = h(() => he, "getDiagramId"),
  Vt = h(() => w, "getLogger"),
  Ut = h(function () {
    return se;
  }, "getClasses"),
  Ht = {
    getConfig: h(() => Q().block, "getConfig"),
    typeStr2Type: De,
    edgeTypeStr2Type: Te,
    edgeStrToEdgeData: Ne,
    edgeStrToEdgeStartData: Ie,
    edgeStrToThickness: Oe,
    edgeStrToPattern: Ce,
    getLogger: Vt,
    getBlocksFlat: kt,
    getBlocks: Pt,
    getEdges: Ft,
    setHierarchy: Rt,
    getBlock: Mt,
    setBlock: Kt,
    getColumns: Bt,
    getClasses: Ut,
    clear: At,
    generateId: zt,
    setDiagramId: Yt,
    getDiagramId: Wt,
  },
  Xt = Ht,
  oe = h((e, i) => {
    const c = yt,
      s = c(e, "r"),
      o = c(e, "g"),
      f = c(e, "b");
    return gt(s, o, f, i);
  }, "fade"),
  Gt = h(
    (e) => `.label {
    font-family: ${e.fontFamily};
    color: ${e.nodeTextColor || e.textColor};
  }
  .cluster-label text {
    fill: ${e.titleColor};
  }
  .cluster-label span {
    color: ${e.titleColor};
  }



  .label text,span {
    fill: ${e.nodeTextColor || e.textColor};
    color: ${e.nodeTextColor || e.textColor};
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${e.mainBkg};
    stroke: ${e.nodeBorder};
    stroke-width: 1px;
  }
  .flowchart-label text {
    text-anchor: middle;
  }
  // .flowchart-label .text-outer-tspan {
  //   text-anchor: middle;
  // }
  // .flowchart-label .text-inner-tspan {
  //   text-anchor: start;
  // }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${e.arrowheadColor};
  }

  .edgePaths .path {
    stroke: ${e.lineColor};
    stroke-width: 2.0px;
  }

  .flowchart-link {
    stroke: ${e.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${e.edgeLabelBackground};
    /*
     * This is for backward compatibility with existing code that didn't
     * add a \`<p>\` around edge labels.
     *
     * TODO: We should probably remove this in a future release.
     */
    p {
      margin: 0;
      padding: 0;
      display: inline;
    }
    rect {
      opacity: 0.5;
      background-color: ${e.edgeLabelBackground};
      fill: ${e.edgeLabelBackground};
    }
    text-align: center;
  }

  /* For html labels only */
  .labelBkg {
    background-color: ${e.edgeLabelBackground};
  }

  .node .cluster {
    // fill: ${oe(e.mainBkg, 0.5)};
    fill: ${oe(e.clusterBkg, 0.5)};
    stroke: ${oe(e.clusterBorder, 0.2)};
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    stroke-width: 1px;
  }

  .cluster text {
    fill: ${e.titleColor};
  }

  .cluster span {
    color: ${e.titleColor};
  }
  /* .cluster div {
    color: ${e.titleColor};
  } */

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${e.fontFamily};
    font-size: 12px;
    background: ${e.tertiaryColor};
    border: 1px solid ${e.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .flowchartTitleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${e.textColor};
  }
  ${Pe()}
`,
    "getStyles",
  ),
  jt = Gt;
function ue(e, i) {
  if (e === 0 || !Number.isInteger(e)) throw new Error("Columns must be an integer !== 0.");
  if (i < 0 || !Number.isInteger(i)) throw new Error("Position must be a non-negative integer." + i);
  if (e < 0) return { px: i, py: 0 };
  if (e === 1) return { px: 0, py: i };
  const c = i % e,
    s = Math.floor(i / e);
  return { px: c, py: s };
}
h(ue, "calculateBlockPosition");
var qt = h((e) => {
  var s, o;
  let i = 0,
    c = 0;
  for (const f of e.children) {
    const { width: u, height: p, x: S, y } = (s = f.size) != null ? s : { width: 0, height: 0, x: 0, y: 0 };
    if (
      (w.debug("getMaxChildSize abc95 child:", f.id, "width:", u, "height:", p, "x:", S, "y:", y, f.type),
      f.type === "space")
    )
      continue;
    const x = u / ((o = f.widthInColumns) != null ? o : 1);
    (x > i && (i = x), p > c && (c = p));
  }
  return { width: i, height: c };
}, "getMaxChildSize");
function re(e, i, c = 0, s = 0, o = 8) {
  var p, S, y, x, l, T, z, D, N, A, O, R, C, d, r;
  (w.debug(
    "setBlockSizes abc95 (start)",
    e.id,
    (p = e == null ? void 0 : e.size) == null ? void 0 : p.x,
    "block width =",
    e == null ? void 0 : e.size,
    "siblingWidth",
    c,
  ),
    ((S = e == null ? void 0 : e.size) != null && S.width) || (e.size = { width: c, height: s, x: 0, y: 0 }));
  let f = 0,
    u = 0;
  if (((y = e.children) == null ? void 0 : y.length) > 0) {
    for (const m of e.children) re(m, i, 0, 0, o);
    const a = qt(e);
    ((f = a.width), (u = a.height), w.debug("setBlockSizes abc95 maxWidth of", e.id, ":s children is ", f, u));
    for (const m of e.children)
      m.size &&
        (w.debug(`abc95 Setting size of children of ${e.id} id=${m.id} ${f} ${u} ${JSON.stringify(m.size)}`),
        (m.size.width =
          f * ((x = m.widthInColumns) != null ? x : 1) + o * (((l = m.widthInColumns) != null ? l : 1) - 1)),
        (m.size.height = u),
        (m.size.x = 0),
        (m.size.y = 0),
        w.debug(`abc95 updating size of ${e.id} children child:${m.id} maxWidth:${f} maxHeight:${u}`));
    for (const m of e.children) re(m, i, f, u, o);
    const g = (T = e.columns) != null ? T : -1;
    let b = 0;
    for (const m of e.children) b += (z = m.widthInColumns) != null ? z : 1;
    let t = e.children.length;
    g > 0 && g < b && (t = g);
    const B = Math.ceil(b / t);
    let n = t * (f + o) + o,
      M = B * (u + o) + o;
    if (n < c) {
      (w.debug(`Detected to small sibling: abc95 ${e.id} siblingWidth ${c} siblingHeight ${s} width ${n}`),
        (n = c),
        (M = s));
      const m = (c - t * o - o) / t,
        K = (s - B * o - o) / B;
      (w.debug("Size indata abc88", e.id, "childWidth", m, "maxWidth", f),
        w.debug("Size indata abc88", e.id, "childHeight", K, "maxHeight", u),
        w.debug("Size indata abc88 xSize", t, "padding", o));
      for (const k of e.children) k.size && ((k.size.width = m), (k.size.height = K), (k.size.x = 0), (k.size.y = 0));
    }
    if (
      (w.debug(
        `abc95 (finale calc) ${e.id} xSize ${t} ySize ${B} columns ${g}${e.children.length} width=${Math.max(n, ((D = e.size) == null ? void 0 : D.width) || 0)}`,
      ),
      n < (((N = e == null ? void 0 : e.size) == null ? void 0 : N.width) || 0))
    ) {
      n = ((A = e == null ? void 0 : e.size) == null ? void 0 : A.width) || 0;
      const m = g > 0 ? Math.min(e.children.length, g) : e.children.length;
      if (m > 0) {
        const K = (n - m * o - o) / m;
        w.debug("abc95 (growing to fit) width", e.id, n, (O = e.size) == null ? void 0 : O.width, K);
        for (const k of e.children) k.size && (k.size.width = K);
      }
    }
    e.size = { width: n, height: M, x: 0, y: 0 };
  }
  w.debug(
    "setBlockSizes abc94 (done)",
    e.id,
    (R = e == null ? void 0 : e.size) == null ? void 0 : R.x,
    (C = e == null ? void 0 : e.size) == null ? void 0 : C.width,
    (d = e == null ? void 0 : e.size) == null ? void 0 : d.y,
    (r = e == null ? void 0 : e.size) == null ? void 0 : r.height,
  );
}
h(re, "setBlockSizes");
function fe(e, i, c = 8) {
  var o, f, u, p, S, y, x, l, T, z, D, N, A, O, R, C, d, r, a, g, b, t, B, n, M, m, K;
  w.debug(
    `abc85 layout blocks (=>layoutBlocks) ${e.id} x: ${(o = e == null ? void 0 : e.size) == null ? void 0 : o.x} y: ${(f = e == null ? void 0 : e.size) == null ? void 0 : f.y} width: ${(u = e == null ? void 0 : e.size) == null ? void 0 : u.width}`,
  );
  const s = (p = e.columns) != null ? p : -1;
  if ((w.debug("layoutBlocks columns abc95", e.id, "=>", s, e), e.children && e.children.length > 0)) {
    const k =
        (x = (y = (S = e == null ? void 0 : e.children[0]) == null ? void 0 : S.size) == null ? void 0 : y.width) !=
        null
          ? x
          : 0,
      q = e.children.length * k + (e.children.length - 1) * c;
    w.debug("widthOfChildren 88", q, "posX");
    const _ = new Map();
    {
      let L = 0;
      for (const I of e.children) {
        if (!I.size) continue;
        const { py: E } = ue(s, L),
          P = (l = _.get(E)) != null ? l : 0;
        I.size.height > P && _.set(E, I.size.height);
        let v = (T = I == null ? void 0 : I.widthInColumns) != null ? T : 1;
        (s > 0 && (v = Math.min(v, s - (L % s))), (L += v));
      }
    }
    const Y = new Map();
    {
      let L = 0;
      const I = [..._.keys()].sort((E, P) => E - P);
      for (const E of I) (Y.set(E, L), (L += ((z = _.get(E)) != null ? z : 0) + c));
    }
    let X = 0;
    w.debug("abc91 block?.size?.x", e.id, (D = e == null ? void 0 : e.size) == null ? void 0 : D.x);
    let G =
        (N = e == null ? void 0 : e.size) != null && N.x
          ? ((A = e == null ? void 0 : e.size) == null ? void 0 : A.x) +
            (-((O = e == null ? void 0 : e.size) == null ? void 0 : O.width) / 2 || 0)
          : -c,
      Z = 0;
    for (const L of e.children) {
      const I = e;
      if (!L.size) continue;
      const { width: E, height: P } = L.size,
        { px: v, py: j } = ue(s, X);
      if (
        (j != Z &&
          ((Z = j),
          (G =
            (R = e == null ? void 0 : e.size) != null && R.x
              ? ((C = e == null ? void 0 : e.size) == null ? void 0 : C.x) +
                (-((d = e == null ? void 0 : e.size) == null ? void 0 : d.width) / 2 || 0)
              : -c),
          w.debug("New row in layout for block", e.id, " and child ", L.id, Z)),
        w.debug(
          `abc89 layout blocks (child) id: ${L.id} Pos: ${X} (px, py) ${v},${j} (${(r = I == null ? void 0 : I.size) == null ? void 0 : r.x},${(a = I == null ? void 0 : I.size) == null ? void 0 : a.y}) parent: ${I.id} width: ${E}${c}`,
        ),
        I.size)
      ) {
        const H = E / 2;
        ((L.size.x = G + c + H),
          w.debug(
            `abc91 layout blocks (calc) px, pyid:${L.id} startingPos=X${G} new startingPosX${L.size.x} ${H} padding=${c} width=${E} halfWidth=${H} => x:${L.size.x} y:${L.size.y} ${L.widthInColumns} (width * (child?.w || 1)) / 2 ${(E * ((g = L == null ? void 0 : L.widthInColumns) != null ? g : 1)) / 2}`,
          ),
          (G = L.size.x + H));
        const W = (b = Y.get(j)) != null ? b : 0,
          $ = (t = _.get(j)) != null ? t : P;
        ((L.size.y = I.size.y - I.size.height / 2 + W + $ / 2 + c),
          w.debug(
            `abc88 layout blocks (calc) px, pyid:${L.id}startingPosX${G}${c}${H}=>x:${L.size.x}y:${L.size.y}${L.widthInColumns}(width * (child?.w || 1)) / 2${(E * ((B = L == null ? void 0 : L.widthInColumns) != null ? B : 1)) / 2}`,
          ));
      }
      L.children && fe(L, i, c);
      let U = (n = L == null ? void 0 : L.widthInColumns) != null ? n : 1;
      (s > 0 && (U = Math.min(U, s - (X % s))), (X += U), w.debug("abc88 columnsPos", L, X));
    }
  }
  w.debug(
    `layout blocks (<==layoutBlocks) ${e.id} x: ${(M = e == null ? void 0 : e.size) == null ? void 0 : M.x} y: ${(m = e == null ? void 0 : e.size) == null ? void 0 : m.y} width: ${(K = e == null ? void 0 : e.size) == null ? void 0 : K.width}`,
  );
}
h(fe, "layoutBlocks");
function pe(e, { minX: i, minY: c, maxX: s, maxY: o } = { minX: 0, minY: 0, maxX: 0, maxY: 0 }) {
  if (e.size && e.id !== "root") {
    const { x: f, y: u, width: p, height: S } = e.size;
    (f - p / 2 < i && (i = f - p / 2),
      u - S / 2 < c && (c = u - S / 2),
      f + p / 2 > s && (s = f + p / 2),
      u + S / 2 > o && (o = u + S / 2));
  }
  if (e.children)
    for (const f of e.children)
      ({ minX: i, minY: c, maxX: s, maxY: o } = pe(f, { minX: i, minY: c, maxX: s, maxY: o }));
  return { minX: i, minY: c, maxX: s, maxY: o };
}
h(pe, "findBounds");
function ve(e) {
  var y, x, l;
  const i = e.getBlock("root");
  if (!i) return;
  const c = (l = (x = (y = me()) == null ? void 0 : y.block) == null ? void 0 : x.padding) != null ? l : 8;
  (re(i, e, 0, 0, c), fe(i, e, c), w.debug("getBlocks", JSON.stringify(i, null, 2)));
  const { minX: s, minY: o, maxX: f, maxY: u } = pe(i),
    p = u - o,
    S = f - s;
  return { x: s, y: o, width: S, height: p };
}
h(ve, "layout");
function Se(e, i, c = !1) {
  var D, N, A, O, R, C, d, r, a, g;
  const s = e;
  let o = "default";
  ((((D = s == null ? void 0 : s.classes) == null ? void 0 : D.length) || 0) > 0 &&
    (o = ((N = s == null ? void 0 : s.classes) != null ? N : []).join(" ")),
    (o = o + " flowchart-label"));
  const f = ((A = s == null ? void 0 : s.classes) != null ? A : []).flatMap((b) => {
    var t, B;
    return (B = (t = i.getClasses().get(b)) == null ? void 0 : t.styles) != null ? B : [];
  });
  let u = 0,
    p = "rect",
    S;
  switch (s.type) {
    case "round":
      ((u = 5), (p = "rect"));
      break;
    case "composite":
      ((u = 0), (p = "composite"), (S = 0));
      break;
    case "square":
      p = "rect";
      break;
    case "diamond":
      p = "question";
      break;
    case "hexagon":
      p = "hexagon";
      break;
    case "block_arrow":
      p = "block_arrow";
      break;
    case "odd":
      p = "rect_left_inv_arrow";
      break;
    case "lean_right":
      p = "lean_right";
      break;
    case "lean_left":
      p = "lean_left";
      break;
    case "trapezoid":
      p = "trapezoid";
      break;
    case "inv_trapezoid":
      p = "inv_trapezoid";
      break;
    case "rect_left_inv_arrow":
      p = "rect_left_inv_arrow";
      break;
    case "circle":
      p = "circle";
      break;
    case "ellipse":
      p = "ellipse";
      break;
    case "stadium":
      p = "stadium";
      break;
    case "subroutine":
      p = "subroutine";
      break;
    case "cylinder":
      p = "cylinder";
      break;
    case "group":
      p = "rect";
      break;
    case "doublecircle":
      p = "doublecircle";
      break;
    default:
      p = "rect";
  }
  const y = xt((O = s == null ? void 0 : s.styles) != null ? O : []),
    x = s.label,
    l = (R = s.size) != null ? R : { width: 0, height: 0, x: 0, y: 0 },
    T = i.getDiagramId();
  return {
    labelStyle: y.labelStyle,
    shape: p,
    label: x,
    labelText: x,
    rx: u,
    ry: u,
    class: o,
    cssClasses: o,
    cssStyles: (C = s == null ? void 0 : s.styles) != null ? C : [],
    cssCompiledStyles: f,
    style: y.style,
    id: s.id,
    domId: T ? `${T}-${s.id}` : s.id,
    isGroup: !1,
    directions: s.directions,
    width: l.width || void 0,
    height: l.height || void 0,
    wrappingWidth: l.width || Number.POSITIVE_INFINITY,
    x: l.x,
    y: l.y,
    positioned: c,
    intersect: void 0,
    padding:
      (a = S != null ? S : (r = (d = Q()) == null ? void 0 : d.block) == null ? void 0 : r.padding) != null ? a : 0,
    widthInColumns: (g = s.widthInColumns) != null ? g : 1,
  };
}
h(Se, "getNodeFromBlock");
async function Ae(e, i, c) {
  var S, y;
  const s = Se(i, c, !1);
  if (i.type === "group") return;
  const o = Q(),
    f = await we(e, s, { config: o }),
    u = (y = (S = f.node()) == null ? void 0 : S.getBBox()) != null ? y : { width: 0, height: 0 },
    p = c.getBlock(s.id);
  ((p.size = { width: u.width, height: u.height, x: 0, y: 0, node: f }), c.setBlock(p), f.remove());
}
h(Ae, "calculateBlockSize");
async function ze(e, i, c) {
  const s = Se(i, c, !0);
  if (c.getBlock(s.id).type !== "space") {
    const f = Q();
    (await we(e, s, { config: f }), (i.intersect = s == null ? void 0 : s.intersect), Lt(s));
  }
}
h(ze, "insertBlockPositioned");
async function ie(e, i, c, s) {
  for (const o of i) (await s(e, o, c), o.children && (await ie(e, o.children, c, s)));
}
h(ie, "performOperations");
async function Re(e, i, c) {
  await ie(e, i, c, Ae);
}
h(Re, "calculateBlockSizes");
async function Be(e, i, c) {
  await ie(e, i, c, ze);
}
h(Be, "insertBlocks");
async function ke(e, i, c, s, o) {
  const f = new ht({ multigraph: !0, compound: !0 });
  f.setGraph({ rankdir: "TB", nodesep: 10, ranksep: 10, marginx: 8, marginy: 8 });
  for (const u of c) u.size && f.setNode(u.id, { width: u.size.width, height: u.size.height, intersect: u.intersect });
  for (const u of i)
    if (u.start && u.end) {
      const p = s.getBlock(u.start),
        S = s.getBlock(u.end);
      if (p != null && p.size && S != null && S.size) {
        const y = p.size,
          x = S.size,
          l = [
            { x: y.x, y: y.y },
            { x: y.x + (x.x - y.x) / 2, y: y.y + (x.y - y.y) / 2 },
            { x: x.x, y: x.y },
          ],
          T = o ? `${o}-${u.id}` : u.id,
          z = u.thickness === "thick" ? "edge-thickness-thick" : "edge-thickness-normal",
          D = u.pattern === "dotted" ? "edge-pattern-dotted" : "edge-pattern-solid",
          N = `${z} ${D} flowchart-link LS-a1 LE-b1`;
        (dt(
          e,
          { ...u, id: T, arrowTypeEnd: u.arrowTypeEnd, arrowTypeStart: u.arrowTypeStart, points: l, classes: N },
          {},
          "block",
          f.node(u.start),
          f.node(u.end),
          o,
        ),
          u.label &&
            (await ft(e, {
              ...u,
              label: u.label,
              labelStyle: "stroke: #333; stroke-width: 1.5px;fill:none;",
              arrowTypeEnd: u.arrowTypeEnd,
              arrowTypeStart: u.arrowTypeStart,
              points: l,
              classes: N,
            }),
            pt({ ...u, x: l[1].x, y: l[1].y }, { originalPath: l })));
      }
    }
}
h(ke, "insertEdges");
var Zt = h(function (e, i) {
    return i.db.getClasses();
  }, "getClasses"),
  Jt = h(async function (e, i, c, s) {
    var R;
    const { securityLevel: o, block: f } = Q(),
      u = s.db;
    u.setDiagramId(i);
    let p;
    o === "sandbox" && (p = te("#i" + i));
    const S = o === "sandbox" ? te(p.nodes()[0].contentDocument.body) : te("body"),
      y = o === "sandbox" ? S.select(`[id="${i}"]`) : te(`[id="${i}"]`);
    ct(y, ["point", "circle", "cross"], s.type, i);
    const l = u.getBlocks(),
      T = u.getBlocksFlat(),
      z = u.getEdges(),
      D = y.insert("g").attr("class", "block");
    await Re(D, l, u);
    const N = ve(u);
    (await Be(D, l, u), await ke(D, z, T, u, i));
    const A = (R = D.node()) == null ? void 0 : R.getBBox(),
      O = A && Number.isFinite(A.width) && Number.isFinite(A.height) ? A : N;
    if (O) {
      const C = Math.max(1, Math.round(0.125 * (O.width / O.height))),
        d = O.height + C + 10,
        r = O.width + 10,
        { useMaxWidth: a } = f;
      (lt(y, d, r, !!a),
        w.debug("Here Bounds", N, O),
        y.attr("viewBox", `${O.x - 5} ${O.y - 5} ${O.width + 10} ${O.height + 10}`));
    }
  }, "draw"),
  Qt = { draw: Jt, getClasses: Zt },
  ss = { parser: Tt, db: Xt, renderer: Qt, styles: jt };
export { ss as diagram };
