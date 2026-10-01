import { g as Pe } from "./chunk-5VM5RSS4-B_J8sMxO.js";
import {
  aF as Fe,
  aG as me,
  aH as Me,
  aI as Ke,
  aJ as Ye,
  aK as We,
  aL as Ve,
  aM as Ue,
  aN as He,
  aO as Xe,
  aP as je,
  aQ as Ge,
  aR as qe,
  aS as Je,
  aT as Ze,
  aU as Qe,
  aV as $e,
  aW as et,
  aX as tt,
  aY as st,
  aZ as rt,
  a_ as it,
  a$ as at,
  b0 as nt,
  b1 as ot,
  _ as h,
  y as Q,
  j as te,
  b2 as ct,
  d as lt,
  l as w,
  p as ut,
  r as gt,
  c as be,
  Q as ht,
  aB as dt,
  aA as pt,
  aC as ft,
  k as St,
  b3 as xt,
  ai as we,
  aj as Lt,
} from "../index-CKZIQMcw.js";
import { c as yt } from "./channel-DT5O4FfY.js";
function mt(e) {
  return Array.isArray(e);
}
function bt(e) {
  if (Fe(e)) return e;
  const a = me(e);
  if (!wt(e)) return {};
  if (mt(e)) {
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
  if (a === "[object ArrayBuffer]") return new ArrayBuffer(e.byteLength);
  if (a === "[object DataView]") {
    const s = e,
      o = s.buffer,
      p = s.byteOffset,
      u = s.byteLength,
      f = new ArrayBuffer(u),
      S = new Uint8Array(o, p, u);
    return (new Uint8Array(f).set(S), new DataView(f));
  }
  if (a === "[object Boolean]" || a === "[object Number]" || a === "[object String]") {
    const s = e.constructor,
      o = new s(e.valueOf());
    return (a === "[object String]" ? _t(o, e) : ne(o, e), o);
  }
  if (a === "[object Date]") return new Date(Number(e));
  if (a === "[object RegExp]") {
    const s = e,
      o = new RegExp(s.source, s.flags);
    return ((o.lastIndex = s.lastIndex), o);
  }
  if (a === "[object Symbol]") return Object(Symbol.prototype.valueOf.call(e));
  if (a === "[object Map]") {
    const s = e,
      o = new Map();
    return (
      s.forEach((p, u) => {
        o.set(u, p);
      }),
      o
    );
  }
  if (a === "[object Set]") {
    const s = e,
      o = new Set();
    return (
      s.forEach((p) => {
        o.add(p);
      }),
      o
    );
  }
  if (a === "[object Arguments]") {
    const s = e,
      o = {};
    return (ne(o, s), (o.length = s.length), (o[Symbol.iterator] = s[Symbol.iterator]), o);
  }
  const c = {};
  return (Dt(c, e), ne(c, e), Et(c, e), c);
}
function wt(e) {
  switch (me(e)) {
    case ot:
    case nt:
    case at:
    case it:
    case rt:
    case st:
    case tt:
    case et:
    case $e:
    case Qe:
    case Ze:
    case Je:
    case qe:
    case Ge:
    case je:
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
function ne(e, a) {
  for (const c in a) Object.hasOwn(a, c) && (e[c] = a[c]);
}
function Et(e, a) {
  const c = Object.getOwnPropertySymbols(a);
  for (let s = 0; s < c.length; s++) {
    const o = c[s];
    Object.prototype.propertyIsEnumerable.call(a, o) && (e[o] = a[o]);
  }
}
function _t(e, a) {
  const c = a.valueOf().length;
  for (const s in a) Object.hasOwn(a, s) && (Number.isNaN(Number(s)) || Number(s) >= c) && (e[s] = a[s]);
}
function Dt(e, a) {
  const c = Object.getPrototypeOf(a);
  c !== null && typeof a.constructor == "function" && Object.setPrototypeOf(e, c);
}
var ce = (function () {
  var e = h(function (C, d, r, n) {
      for (r = r || {}, n = C.length; n--; r[C[n]] = d);
      return r;
    }, "o"),
    a = [1, 15],
    c = [1, 7],
    s = [1, 13],
    o = [1, 14],
    p = [1, 19],
    u = [1, 16],
    f = [1, 17],
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
      performAction: h(function (d, r, n, g, m, t, R) {
        var i = t.length - 1;
        switch (m) {
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
            (g.getLogger().debug("Rule: hierarchy: ", t[i - 1]), g.setHierarchy(t[i - 1]));
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
            (g.getLogger().debug("Rule: statement: ", t[i]),
              typeof t[i].length == "number" ? (this.$ = t[i]) : (this.$ = [t[i]]));
            break;
          case 13:
            (g.getLogger().debug("Rule: statement #2: ", t[i - 1]), (this.$ = [t[i - 1]].concat(t[i])));
            break;
          case 14:
            (g.getLogger().debug("Rule: link: ", t[i], d), (this.$ = { edgeTypeStr: t[i], label: "" }));
            break;
          case 15:
            (g.getLogger().debug("Rule: LABEL link: ", t[i - 3], t[i - 1], t[i]),
              (this.$ = { edgeTypeStr: t[i], label: t[i - 1] }));
            break;
          case 18:
            const M = parseInt(t[i]),
              b = g.generateId();
            this.$ = { id: b, type: "space", label: "", width: M, children: [] };
            break;
          case 23:
            g.getLogger().debug(
              "Rule: (nodeStatement link node) ",
              t[i - 2],
              t[i - 1],
              t[i],
              " typestr: ",
              t[i - 1].edgeTypeStr,
            );
            const K = g.edgeStrToEdgeData(t[i - 1].edgeTypeStr),
              k = g.edgeStrToEdgeStartData(t[i - 1].edgeTypeStr),
              q = g.edgeStrToThickness(t[i - 1].edgeTypeStr),
              _ = g.edgeStrToPattern(t[i - 1].edgeTypeStr);
            this.$ = [
              { id: t[i - 2].id, label: t[i - 2].label, type: t[i - 2].type, directions: t[i - 2].directions },
              {
                id: t[i - 2].id + "-" + t[i].id,
                start: t[i - 2].id,
                end: t[i].id,
                label: t[i - 1].label,
                type: "edge",
                thickness: q,
                pattern: _,
                directions: t[i].directions,
                arrowTypeEnd: K,
                arrowTypeStart: k,
              },
              { id: t[i].id, label: t[i].label, type: g.typeStr2Type(t[i].typeStr), directions: t[i].directions },
            ];
            break;
          case 24:
            (g.getLogger().debug("Rule: nodeStatement (abc88 node size) ", t[i - 1], t[i]),
              (this.$ = {
                id: t[i - 1].id,
                label: t[i - 1].label,
                type: g.typeStr2Type(t[i - 1].typeStr),
                directions: t[i - 1].directions,
                widthInColumns: parseInt(t[i], 10),
              }));
            break;
          case 25:
            (g.getLogger().debug("Rule: nodeStatement (node) ", t[i]),
              (this.$ = {
                id: t[i].id,
                label: t[i].label,
                type: g.typeStr2Type(t[i].typeStr),
                directions: t[i].directions,
                widthInColumns: 1,
              }));
            break;
          case 26:
            (g.getLogger().debug("APA123", this ? this : "na"),
              g.getLogger().debug("COLUMNS: ", t[i]),
              (this.$ = { type: "column-setting", columns: t[i] === "auto" ? -1 : parseInt(t[i]) }));
            break;
          case 27:
            (g.getLogger().debug("Rule: id-block statement : ", t[i - 2], t[i - 1]),
              g.generateId(),
              (this.$ = { ...t[i - 2], type: "composite", children: t[i - 1] }));
            break;
          case 28:
            g.getLogger().debug("Rule: blockStatement : ", t[i - 2], t[i - 1], t[i]);
            const Y = g.generateId();
            this.$ = { id: Y, type: "composite", label: "", children: t[i - 1] };
            break;
          case 29:
            (g.getLogger().debug("Rule: node (NODE_ID separator): ", t[i]), (this.$ = { id: t[i] }));
            break;
          case 30:
            (g.getLogger().debug("Rule: node (NODE_ID nodeShapeNLabel separator): ", t[i - 1], t[i]),
              (this.$ = { id: t[i - 1], label: t[i].label, typeStr: t[i].typeStr, directions: t[i].directions }));
            break;
          case 31:
            (g.getLogger().debug("Rule: dirList: ", t[i]), (this.$ = [t[i]]));
            break;
          case 32:
            (g.getLogger().debug("Rule: dirList: ", t[i - 1], t[i]), (this.$ = [t[i - 1]].concat(t[i])));
            break;
          case 33:
            (g.getLogger().debug("Rule: nodeShapeNLabel: ", t[i - 2], t[i - 1], t[i]),
              (this.$ = { typeStr: t[i - 2] + t[i], label: t[i - 1] }));
            break;
          case 34:
            (g.getLogger().debug("Rule: BLOCK_ARROW nodeShapeNLabel: ", t[i - 3], t[i - 2], " #3:", t[i - 1], t[i]),
              (this.$ = { typeStr: t[i - 3] + t[i], label: t[i - 2], directions: t[i - 1] }));
            break;
          case 35:
          case 36:
            this.$ = { type: "classDef", id: t[i - 1].trim(), css: t[i].trim() };
            break;
          case 37:
            this.$ = { type: "applyClass", id: t[i - 1].trim(), styleClass: t[i].trim() };
            break;
          case 38:
            this.$ = { type: "applyStyles", id: t[i - 1].trim(), stylesStr: t[i].trim() };
            break;
        }
      }, "anonymous"),
      table: [
        { 9: 1, 10: [1, 2] },
        { 1: [3] },
        {
          10: a,
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
          31: p,
          39: u,
          43: f,
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
          10: a,
          21: c,
          28: s,
          29: o,
          31: p,
          39: u,
          43: f,
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
        { 19: 26, 26: 12, 31: p },
        {
          10: a,
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
          31: p,
          39: u,
          43: f,
          46: S,
        },
        { 40: [1, 28], 42: [1, 29] },
        { 44: [1, 30] },
        { 47: [1, 31] },
        e(D, [2, 29], { 32: 32, 35: [1, 33], 37: [1, 34] }),
        { 1: [2, 7] },
        e(y, [2, 13]),
        { 26: 35, 31: p },
        { 31: [2, 14] },
        { 17: [1, 36] },
        e(z, [2, 24]),
        {
          10: a,
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
          31: p,
          39: u,
          43: f,
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
          var n = new Error(d);
          throw ((n.hash = r), n);
        }
      }, "parseError"),
      parse: h(function (d) {
        var r = this,
          n = [0],
          g = [],
          m = [null],
          t = [],
          R = this.table,
          i = "",
          M = 0,
          b = 0,
          K = 2,
          k = 1,
          q = t.slice.call(arguments, 1),
          _ = Object.create(this.lexer),
          Y = { yy: {} };
        for (var X in this.yy) Object.prototype.hasOwnProperty.call(this.yy, X) && (Y.yy[X] = this.yy[X]);
        (_.setInput(d, Y.yy), (Y.yy.lexer = _), (Y.yy.parser = this), typeof _.yylloc > "u" && (_.yylloc = {}));
        var j = _.yylloc;
        t.push(j);
        var J = _.options && _.options.ranges;
        typeof Y.yy.parseError == "function"
          ? (this.parseError = Y.yy.parseError)
          : (this.parseError = Object.getPrototypeOf(this).parseError);
        function L(F) {
          ((n.length = n.length - 2 * F), (m.length = m.length - F), (t.length = t.length - F));
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
        for (var E, P, v, G, U = {}, H, W, $, ee; ;) {
          if (
            ((P = n[n.length - 1]),
            this.defaultActions[P]
              ? (v = this.defaultActions[P])
              : ((E === null || typeof E > "u") && (E = I()), (v = R[P] && R[P][E])),
            typeof v > "u" || !v.length || !v[0])
          ) {
            var ae = "";
            ee = [];
            for (H in R[P]) this.terminals_[H] && H > K && ee.push("'" + this.terminals_[H] + "'");
            (_.showPosition
              ? (ae =
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
              : (ae =
                  "Parse error on line " +
                  (M + 1) +
                  ": Unexpected " +
                  (E == k ? "end of input" : "'" + (this.terminals_[E] || E) + "'")),
              this.parseError(ae, {
                text: _.match,
                token: this.terminals_[E] || E,
                line: _.yylineno,
                loc: j,
                expected: ee,
              }));
          }
          if (v[0] instanceof Array && v.length > 1)
            throw new Error("Parse Error: multiple actions possible at state: " + P + ", token: " + E);
          switch (v[0]) {
            case 1:
              (n.push(E),
                m.push(_.yytext),
                t.push(_.yylloc),
                n.push(v[1]),
                (E = null),
                (b = _.yyleng),
                (i = _.yytext),
                (M = _.yylineno),
                (j = _.yylloc));
              break;
            case 2:
              if (
                ((W = this.productions_[v[1]][1]),
                (U.$ = m[m.length - W]),
                (U._$ = {
                  first_line: t[t.length - (W || 1)].first_line,
                  last_line: t[t.length - 1].last_line,
                  first_column: t[t.length - (W || 1)].first_column,
                  last_column: t[t.length - 1].last_column,
                }),
                J && (U._$.range = [t[t.length - (W || 1)].range[0], t[t.length - 1].range[1]]),
                (G = this.performAction.apply(U, [i, b, M, Y.yy, v[1], m, t].concat(q))),
                typeof G < "u")
              )
                return G;
              (W && ((n = n.slice(0, -1 * W * 2)), (m = m.slice(0, -1 * W)), (t = t.slice(0, -1 * W))),
                n.push(this.productions_[v[1]][0]),
                m.push(U.$),
                t.push(U._$),
                ($ = R[n[n.length - 2]][n[n.length - 1]]),
                n.push($));
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
        parseError: h(function (r, n) {
          if (this.yy.parser) this.yy.parser.parseError(r, n);
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
            n = d.split(/(?:\r\n?|\n)/g);
          ((this._input = d + this._input),
            (this.yytext = this.yytext.substr(0, this.yytext.length - r)),
            (this.offset -= r));
          var g = this.match.split(/(?:\r\n?|\n)/g);
          ((this.match = this.match.substr(0, this.match.length - 1)),
            (this.matched = this.matched.substr(0, this.matched.length - 1)),
            n.length - 1 && (this.yylineno -= n.length - 1));
          var m = this.yylloc.range;
          return (
            (this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: n
                ? (n.length === g.length ? this.yylloc.first_column : 0) + g[g.length - n.length].length - n[0].length
                : this.yylloc.first_column - r,
            }),
            this.options.ranges && (this.yylloc.range = [m[0], m[0] + this.yyleng - r]),
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
          var n, g, m;
          if (
            (this.options.backtrack_lexer &&
              ((m = {
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
              this.options.ranges && (m.yylloc.range = this.yylloc.range.slice(0))),
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
            (n = this.performAction.call(this, this.yy, this, r, this.conditionStack[this.conditionStack.length - 1])),
            this.done && this._input && (this.done = !1),
            n)
          )
            return n;
          if (this._backtrack) {
            for (var t in m) this[t] = m[t];
            return !1;
          }
          return !1;
        }, "test_match"),
        next: h(function () {
          if (this.done) return this.EOF;
          this._input || (this.done = !0);
          var d, r, n, g;
          this._more || ((this.yytext = ""), (this.match = ""));
          for (var m = this._currentRules(), t = 0; t < m.length; t++)
            if (((n = this._input.match(this.rules[m[t]])), n && (!r || n[0].length > r[0].length))) {
              if (((r = n), (g = t), this.options.backtrack_lexer)) {
                if (((d = this.test_match(n, m[t])), d !== !1)) return d;
                if (this._backtrack) {
                  r = !1;
                  continue;
                } else return !1;
              } else if (!this.options.flex) break;
            }
          return r
            ? ((d = this.test_match(r, m[g])), d !== !1 ? d : !1)
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
        performAction: h(function (r, n, g, m) {
          switch (g) {
            case 0:
              return (r.getLogger().debug("Found block-beta"), 10);
            case 1:
              return (r.getLogger().debug("Found id-block"), 29);
            case 2:
              return (r.getLogger().debug("Found block"), 10);
            case 3:
              r.getLogger().debug(".", n.yytext);
              break;
            case 4:
              r.getLogger().debug("_", n.yytext);
              break;
            case 5:
              return 5;
            case 6:
              return ((n.yytext = -1), 28);
            case 7:
              return (
                (n.yytext = n.yytext.replace(/columns\s+/, "")),
                r.getLogger().debug("COLUMNS (LEX)", n.yytext),
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
              (r.getLogger().debug("LEX: POPPING STR:", n.yytext), this.popState());
              break;
            case 13:
              return (r.getLogger().debug("LEX: STR end:", n.yytext), "STR");
            case 14:
              return (
                (n.yytext = n.yytext.replace(/space\:/, "")),
                r.getLogger().debug("SPACE NUM (LEX)", n.yytext),
                21
              );
            case 15:
              return ((n.yytext = "1"), r.getLogger().debug("COLUMNS (LEX)", n.yytext), 21);
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
              return (r.getLogger().debug("Lex: NODE_ID", n.yytext), 31);
            case 75:
              return (r.getLogger().debug("Lex: EOF", n.yytext), 8);
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
              return (r.getLogger().debug("LEX: NODE_DESCR:", n.yytext), "NODE_DESCR");
            case 83:
              (r.getLogger().debug("LEX POPPING"), this.popState());
              break;
            case 84:
              (r.getLogger().debug("Lex: =>BAE"), this.pushState("ARROW_DIR"));
              break;
            case 85:
              return (
                (n.yytext = n.yytext.replace(/^,\s*/, "")),
                r.getLogger().debug("Lex (right): dir:", n.yytext),
                "DIR"
              );
            case 86:
              return ((n.yytext = n.yytext.replace(/^,\s*/, "")), r.getLogger().debug("Lex (left):", n.yytext), "DIR");
            case 87:
              return ((n.yytext = n.yytext.replace(/^,\s*/, "")), r.getLogger().debug("Lex (x):", n.yytext), "DIR");
            case 88:
              return ((n.yytext = n.yytext.replace(/^,\s*/, "")), r.getLogger().debug("Lex (y):", n.yytext), "DIR");
            case 89:
              return ((n.yytext = n.yytext.replace(/^,\s*/, "")), r.getLogger().debug("Lex (up):", n.yytext), "DIR");
            case 90:
              return ((n.yytext = n.yytext.replace(/^,\s*/, "")), r.getLogger().debug("Lex (down):", n.yytext), "DIR");
            case 91:
              return (
                (n.yytext = "]>"),
                r.getLogger().debug("Lex (ARROW_DIR end):", n.yytext),
                this.popState(),
                this.popState(),
                "BLOCK_ARROW_END"
              );
            case 92:
              return (r.getLogger().debug("Lex: LINK", "#" + n.yytext + "#"), 15);
            case 93:
              return (r.getLogger().debug("Lex: LINK", n.yytext), 15);
            case 94:
              return (r.getLogger().debug("Lex: LINK", n.yytext), 15);
            case 95:
              return (r.getLogger().debug("Lex: LINK", n.yytext), 15);
            case 96:
              return (r.getLogger().debug("Lex: START_LINK", n.yytext), this.pushState("LLABEL"), 16);
            case 97:
              return (r.getLogger().debug("Lex: START_LINK", n.yytext), this.pushState("LLABEL"), 16);
            case 98:
              return (r.getLogger().debug("Lex: START_LINK", n.yytext), this.pushState("LLABEL"), 16);
            case 99:
              this.pushState("md_string");
              break;
            case 100:
              return (r.getLogger().debug("Lex: Starting string"), this.pushState("string"), "LINK_LABEL");
            case 101:
              return (this.popState(), r.getLogger().debug("Lex: LINK", "#" + n.yytext + "#"), 15);
            case 102:
              return (this.popState(), r.getLogger().debug("Lex: LINK", n.yytext), 15);
            case 103:
              return (this.popState(), r.getLogger().debug("Lex: LINK", n.yytext), 15);
            case 104:
              return (r.getLogger().debug("Lex: COLON", n.yytext), (n.yytext = n.yytext.slice(1)), 27);
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
  function B() {
    this.yy = {};
  }
  return (h(B, "Parser"), (B.prototype = A), (A.Parser = B), new B());
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
  It = h((e) => St.sanitizeText(e, be()), "sanitizeText"),
  Ot = h(function (e, a = "") {
    let c = se.get(e);
    (c || ((c = { id: e, styles: [], textStyles: [] }), se.set(e, c)),
      a != null &&
        a.split(Ee).forEach((s) => {
          const o = s.replace(/([^;]*);/, "$1").trim();
          if (RegExp(xe).exec(s)) {
            const u = o.replace(Le, Nt).replace(xe, Le);
            c.textStyles.push(u);
          }
          c.styles.push(o);
        }));
  }, "addStyleClass"),
  Ct = h(function (e, a = "") {
    const c = V.get(e);
    a != null && (c.styles = a.split(Ee));
  }, "addStyle2Node"),
  vt = h(function (e, a) {
    e.split(",").forEach(function (c) {
      let s = V.get(c);
      if (s === void 0) {
        const o = c.trim();
        ((s = { id: o, type: "na", children: [] }), V.set(o, s));
      }
      (s.classes || (s.classes = []), s.classes.push(a));
    });
  }, "setCssClass"),
  _e = h((e, a) => {
    var u, f, S, y, x;
    const c = e.flat(),
      s = [],
      o = c.find((l) => (l == null ? void 0 : l.type) === "column-setting"),
      p = (u = o == null ? void 0 : o.columns) != null ? u : -1;
    for (const l of c) {
      if (
        (typeof p == "number" &&
          p > 0 &&
          l.type !== "column-setting" &&
          typeof l.widthInColumns == "number" &&
          l.widthInColumns > p &&
          w.warn(`Block ${l.id} width ${l.widthInColumns} exceeds configured column width ${p}`),
        l.label && (l.label = It(l.label)),
        l.type === "classDef")
      ) {
        Ot(l.id, l.css);
        continue;
      }
      if (l.type === "applyClass") {
        vt(l.id, (f = l == null ? void 0 : l.styleClass) != null ? f : "");
        continue;
      }
      if (l.type === "applyStyles") {
        l != null && l.stylesStr && Ct(l.id, l == null ? void 0 : l.stylesStr);
        continue;
      }
      if (l.type === "column-setting") a.columns = (S = l.columns) != null ? S : -1;
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
            const N = bt(l);
            ((N.id = N.id + "-" + D), V.set(N.id, N), s.push(N));
          }
        } else T === void 0 && s.push(l);
      }
    }
    a.children = s;
  }, "populateBlockDatabase"),
  de = [],
  Z = { id: "root", type: "composite", children: [], columns: -1 },
  At = h(() => {
    (w.debug("Clear called"),
      ut(),
      (Z = { id: "root", type: "composite", children: [], columns: -1 }),
      (V = new Map([["root", Z]])),
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
  Bt = h((e) => {
    ((Z.children = e), _e(e, Z), (de = Z.children));
  }, "setHierarchy"),
  Rt = h((e) => {
    const a = V.get(e);
    return a ? (a.columns ? a.columns : a.children ? a.children.length : -1) : -1;
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
    setHierarchy: Bt,
    getBlock: Mt,
    setBlock: Kt,
    getColumns: Rt,
    getClasses: Ut,
    clear: At,
    generateId: zt,
    setDiagramId: Yt,
    getDiagramId: Wt,
  },
  Xt = Ht,
  oe = h((e, a) => {
    const c = yt,
      s = c(e, "r"),
      o = c(e, "g"),
      p = c(e, "b");
    return gt(s, o, p, a);
  }, "fade"),
  jt = h(
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
  Gt = jt;
function ue(e, a) {
  if (e === 0 || !Number.isInteger(e)) throw new Error("Columns must be an integer !== 0.");
  if (a < 0 || !Number.isInteger(a)) throw new Error("Position must be a non-negative integer." + a);
  if (e < 0) return { px: a, py: 0 };
  if (e === 1) return { px: 0, py: a };
  const c = a % e,
    s = Math.floor(a / e);
  return { px: c, py: s };
}
h(ue, "calculateBlockPosition");
var qt = h((e) => {
  var s, o;
  let a = 0,
    c = 0;
  for (const p of e.children) {
    const { width: u, height: f, x: S, y } = (s = p.size) != null ? s : { width: 0, height: 0, x: 0, y: 0 };
    if (
      (w.debug("getMaxChildSize abc95 child:", p.id, "width:", u, "height:", f, "x:", S, "y:", y, p.type),
      p.type === "space")
    )
      continue;
    const x = u / ((o = p.widthInColumns) != null ? o : 1);
    (x > a && (a = x), f > c && (c = f));
  }
  return { width: a, height: c };
}, "getMaxChildSize");
function re(e, a, c = 0, s = 0, o = 8) {
  var f, S, y, x, l, T, z, D, N, A, O, B, C, d, r;
  (w.debug(
    "setBlockSizes abc95 (start)",
    e.id,
    (f = e == null ? void 0 : e.size) == null ? void 0 : f.x,
    "block width =",
    e == null ? void 0 : e.size,
    "siblingWidth",
    c,
  ),
    ((S = e == null ? void 0 : e.size) != null && S.width) || (e.size = { width: c, height: s, x: 0, y: 0 }));
  let p = 0,
    u = 0;
  if (((y = e.children) == null ? void 0 : y.length) > 0) {
    for (const b of e.children) re(b, a, 0, 0, o);
    const n = qt(e);
    ((p = n.width), (u = n.height), w.debug("setBlockSizes abc95 maxWidth of", e.id, ":s children is ", p, u));
    for (const b of e.children)
      b.size &&
        (w.debug(`abc95 Setting size of children of ${e.id} id=${b.id} ${p} ${u} ${JSON.stringify(b.size)}`),
        (b.size.width =
          p * ((x = b.widthInColumns) != null ? x : 1) + o * (((l = b.widthInColumns) != null ? l : 1) - 1)),
        (b.size.height = u),
        (b.size.x = 0),
        (b.size.y = 0),
        w.debug(`abc95 updating size of ${e.id} children child:${b.id} maxWidth:${p} maxHeight:${u}`));
    for (const b of e.children) re(b, a, p, u, o);
    const g = (T = e.columns) != null ? T : -1;
    let m = 0;
    for (const b of e.children) m += (z = b.widthInColumns) != null ? z : 1;
    let t = e.children.length;
    g > 0 && g < m && (t = g);
    const R = Math.ceil(m / t);
    let i = t * (p + o) + o,
      M = R * (u + o) + o;
    if (i < c) {
      (w.debug(`Detected to small sibling: abc95 ${e.id} siblingWidth ${c} siblingHeight ${s} width ${i}`),
        (i = c),
        (M = s));
      const b = (c - t * o - o) / t,
        K = (s - R * o - o) / R;
      (w.debug("Size indata abc88", e.id, "childWidth", b, "maxWidth", p),
        w.debug("Size indata abc88", e.id, "childHeight", K, "maxHeight", u),
        w.debug("Size indata abc88 xSize", t, "padding", o));
      for (const k of e.children) k.size && ((k.size.width = b), (k.size.height = K), (k.size.x = 0), (k.size.y = 0));
    }
    if (
      (w.debug(
        `abc95 (finale calc) ${e.id} xSize ${t} ySize ${R} columns ${g}${e.children.length} width=${Math.max(i, ((D = e.size) == null ? void 0 : D.width) || 0)}`,
      ),
      i < (((N = e == null ? void 0 : e.size) == null ? void 0 : N.width) || 0))
    ) {
      i = ((A = e == null ? void 0 : e.size) == null ? void 0 : A.width) || 0;
      const b = g > 0 ? Math.min(e.children.length, g) : e.children.length;
      if (b > 0) {
        const K = (i - b * o - o) / b;
        w.debug("abc95 (growing to fit) width", e.id, i, (O = e.size) == null ? void 0 : O.width, K);
        for (const k of e.children) k.size && (k.size.width = K);
      }
    }
    e.size = { width: i, height: M, x: 0, y: 0 };
  }
  w.debug(
    "setBlockSizes abc94 (done)",
    e.id,
    (B = e == null ? void 0 : e.size) == null ? void 0 : B.x,
    (C = e == null ? void 0 : e.size) == null ? void 0 : C.width,
    (d = e == null ? void 0 : e.size) == null ? void 0 : d.y,
    (r = e == null ? void 0 : e.size) == null ? void 0 : r.height,
  );
}
h(re, "setBlockSizes");
function pe(e, a, c = 8) {
  var o, p, u, f, S, y, x, l, T, z, D, N, A, O, B, C, d, r, n, g, m, t, R, i, M, b, K;
  w.debug(
    `abc85 layout blocks (=>layoutBlocks) ${e.id} x: ${(o = e == null ? void 0 : e.size) == null ? void 0 : o.x} y: ${(p = e == null ? void 0 : e.size) == null ? void 0 : p.y} width: ${(u = e == null ? void 0 : e.size) == null ? void 0 : u.width}`,
  );
  const s = (f = e.columns) != null ? f : -1;
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
    let j =
        (N = e == null ? void 0 : e.size) != null && N.x
          ? ((A = e == null ? void 0 : e.size) == null ? void 0 : A.x) +
            (-((O = e == null ? void 0 : e.size) == null ? void 0 : O.width) / 2 || 0)
          : -c,
      J = 0;
    for (const L of e.children) {
      const I = e;
      if (!L.size) continue;
      const { width: E, height: P } = L.size,
        { px: v, py: G } = ue(s, X);
      if (
        (G != J &&
          ((J = G),
          (j =
            (B = e == null ? void 0 : e.size) != null && B.x
              ? ((C = e == null ? void 0 : e.size) == null ? void 0 : C.x) +
                (-((d = e == null ? void 0 : e.size) == null ? void 0 : d.width) / 2 || 0)
              : -c),
          w.debug("New row in layout for block", e.id, " and child ", L.id, J)),
        w.debug(
          `abc89 layout blocks (child) id: ${L.id} Pos: ${X} (px, py) ${v},${G} (${(r = I == null ? void 0 : I.size) == null ? void 0 : r.x},${(n = I == null ? void 0 : I.size) == null ? void 0 : n.y}) parent: ${I.id} width: ${E}${c}`,
        ),
        I.size)
      ) {
        const H = E / 2;
        ((L.size.x = j + c + H),
          w.debug(
            `abc91 layout blocks (calc) px, pyid:${L.id} startingPos=X${j} new startingPosX${L.size.x} ${H} padding=${c} width=${E} halfWidth=${H} => x:${L.size.x} y:${L.size.y} ${L.widthInColumns} (width * (child?.w || 1)) / 2 ${(E * ((g = L == null ? void 0 : L.widthInColumns) != null ? g : 1)) / 2}`,
          ),
          (j = L.size.x + H));
        const W = (m = Y.get(G)) != null ? m : 0,
          $ = (t = _.get(G)) != null ? t : P;
        ((L.size.y = I.size.y - I.size.height / 2 + W + $ / 2 + c),
          w.debug(
            `abc88 layout blocks (calc) px, pyid:${L.id}startingPosX${j}${c}${H}=>x:${L.size.x}y:${L.size.y}${L.widthInColumns}(width * (child?.w || 1)) / 2${(E * ((R = L == null ? void 0 : L.widthInColumns) != null ? R : 1)) / 2}`,
          ));
      }
      L.children && pe(L, a, c);
      let U = (i = L == null ? void 0 : L.widthInColumns) != null ? i : 1;
      (s > 0 && (U = Math.min(U, s - (X % s))), (X += U), w.debug("abc88 columnsPos", L, X));
    }
  }
  w.debug(
    `layout blocks (<==layoutBlocks) ${e.id} x: ${(M = e == null ? void 0 : e.size) == null ? void 0 : M.x} y: ${(b = e == null ? void 0 : e.size) == null ? void 0 : b.y} width: ${(K = e == null ? void 0 : e.size) == null ? void 0 : K.width}`,
  );
}
h(pe, "layoutBlocks");
function fe(e, { minX: a, minY: c, maxX: s, maxY: o } = { minX: 0, minY: 0, maxX: 0, maxY: 0 }) {
  if (e.size && e.id !== "root") {
    const { x: p, y: u, width: f, height: S } = e.size;
    (p - f / 2 < a && (a = p - f / 2),
      u - S / 2 < c && (c = u - S / 2),
      p + f / 2 > s && (s = p + f / 2),
      u + S / 2 > o && (o = u + S / 2));
  }
  if (e.children)
    for (const p of e.children)
      ({ minX: a, minY: c, maxX: s, maxY: o } = fe(p, { minX: a, minY: c, maxX: s, maxY: o }));
  return { minX: a, minY: c, maxX: s, maxY: o };
}
h(fe, "findBounds");
function ve(e) {
  var y, x, l;
  const a = e.getBlock("root");
  if (!a) return;
  const c = (l = (x = (y = be()) == null ? void 0 : y.block) == null ? void 0 : x.padding) != null ? l : 8;
  (re(a, e, 0, 0, c), pe(a, e, c), w.debug("getBlocks", JSON.stringify(a, null, 2)));
  const { minX: s, minY: o, maxX: p, maxY: u } = fe(a),
    f = u - o,
    S = p - s;
  return { x: s, y: o, width: S, height: f };
}
h(ve, "layout");
function Se(e, a, c = !1) {
  var D, N, A, O, B, C, d, r, n, g;
  const s = e;
  let o = "default";
  ((((D = s == null ? void 0 : s.classes) == null ? void 0 : D.length) || 0) > 0 &&
    (o = ((N = s == null ? void 0 : s.classes) != null ? N : []).join(" ")),
    (o = o + " flowchart-label"));
  const p = ((A = s == null ? void 0 : s.classes) != null ? A : []).flatMap((m) => {
    var t, R;
    return (R = (t = a.getClasses().get(m)) == null ? void 0 : t.styles) != null ? R : [];
  });
  let u = 0,
    f = "rect",
    S;
  switch (s.type) {
    case "round":
      ((u = 5), (f = "rect"));
      break;
    case "composite":
      ((u = 0), (f = "composite"), (S = 0));
      break;
    case "square":
      f = "rect";
      break;
    case "diamond":
      f = "question";
      break;
    case "hexagon":
      f = "hexagon";
      break;
    case "block_arrow":
      f = "block_arrow";
      break;
    case "odd":
      f = "rect_left_inv_arrow";
      break;
    case "lean_right":
      f = "lean_right";
      break;
    case "lean_left":
      f = "lean_left";
      break;
    case "trapezoid":
      f = "trapezoid";
      break;
    case "inv_trapezoid":
      f = "inv_trapezoid";
      break;
    case "rect_left_inv_arrow":
      f = "rect_left_inv_arrow";
      break;
    case "circle":
      f = "circle";
      break;
    case "ellipse":
      f = "ellipse";
      break;
    case "stadium":
      f = "stadium";
      break;
    case "subroutine":
      f = "subroutine";
      break;
    case "cylinder":
      f = "cylinder";
      break;
    case "group":
      f = "rect";
      break;
    case "doublecircle":
      f = "doublecircle";
      break;
    default:
      f = "rect";
  }
  const y = xt((O = s == null ? void 0 : s.styles) != null ? O : []),
    x = s.label,
    l = (B = s.size) != null ? B : { width: 0, height: 0, x: 0, y: 0 },
    T = a.getDiagramId();
  return {
    labelStyle: y.labelStyle,
    shape: f,
    label: x,
    labelText: x,
    rx: u,
    ry: u,
    class: o,
    cssClasses: o,
    cssStyles: (C = s == null ? void 0 : s.styles) != null ? C : [],
    cssCompiledStyles: p,
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
      (n = S != null ? S : (r = (d = Q()) == null ? void 0 : d.block) == null ? void 0 : r.padding) != null ? n : 0,
    widthInColumns: (g = s.widthInColumns) != null ? g : 1,
  };
}
h(Se, "getNodeFromBlock");
async function Ae(e, a, c) {
  var S, y;
  const s = Se(a, c, !1);
  if (a.type === "group") return;
  const o = Q(),
    p = await we(e, s, { config: o }),
    u = (y = (S = p.node()) == null ? void 0 : S.getBBox()) != null ? y : { width: 0, height: 0 },
    f = c.getBlock(s.id);
  ((f.size = { width: u.width, height: u.height, x: 0, y: 0, node: p }), c.setBlock(f), p.remove());
}
h(Ae, "calculateBlockSize");
async function ze(e, a, c) {
  const s = Se(a, c, !0);
  if (c.getBlock(s.id).type !== "space") {
    const p = Q();
    (await we(e, s, { config: p }), (a.intersect = s == null ? void 0 : s.intersect), Lt(s));
  }
}
h(ze, "insertBlockPositioned");
async function ie(e, a, c, s) {
  for (const o of a) (await s(e, o, c), o.children && (await ie(e, o.children, c, s)));
}
h(ie, "performOperations");
async function Be(e, a, c) {
  await ie(e, a, c, Ae);
}
h(Be, "calculateBlockSizes");
async function Re(e, a, c) {
  await ie(e, a, c, ze);
}
h(Re, "insertBlocks");
async function ke(e, a, c, s, o) {
  const p = new ht({ multigraph: !0, compound: !0 });
  p.setGraph({ rankdir: "TB", nodesep: 10, ranksep: 10, marginx: 8, marginy: 8 });
  for (const u of c) u.size && p.setNode(u.id, { width: u.size.width, height: u.size.height, intersect: u.intersect });
  for (const u of a)
    if (u.start && u.end) {
      const f = s.getBlock(u.start),
        S = s.getBlock(u.end);
      if (f != null && f.size && S != null && S.size) {
        const y = f.size,
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
          p.node(u.start),
          p.node(u.end),
          o,
        ),
          u.label &&
            (await pt(e, {
              ...u,
              label: u.label,
              labelStyle: "stroke: #333; stroke-width: 1.5px;fill:none;",
              arrowTypeEnd: u.arrowTypeEnd,
              arrowTypeStart: u.arrowTypeStart,
              points: l,
              classes: N,
            }),
            ft({ ...u, x: l[1].x, y: l[1].y }, { originalPath: l })));
      }
    }
}
h(ke, "insertEdges");
var Jt = h(function (e, a) {
    return a.db.getClasses();
  }, "getClasses"),
  Zt = h(async function (e, a, c, s) {
    var B;
    const { securityLevel: o, block: p } = Q(),
      u = s.db;
    u.setDiagramId(a);
    let f;
    o === "sandbox" && (f = te("#i" + a));
    const S = o === "sandbox" ? te(f.nodes()[0].contentDocument.body) : te("body"),
      y = o === "sandbox" ? S.select(`[id="${a}"]`) : te(`[id="${a}"]`);
    ct(y, ["point", "circle", "cross"], s.type, a);
    const l = u.getBlocks(),
      T = u.getBlocksFlat(),
      z = u.getEdges(),
      D = y.insert("g").attr("class", "block");
    await Be(D, l, u);
    const N = ve(u);
    (await Re(D, l, u), await ke(D, z, T, u, a));
    const A = (B = D.node()) == null ? void 0 : B.getBBox(),
      O = A && Number.isFinite(A.width) && Number.isFinite(A.height) ? A : N;
    if (O) {
      const C = Math.max(1, Math.round(0.125 * (O.width / O.height))),
        d = O.height + C + 10,
        r = O.width + 10,
        { useMaxWidth: n } = p;
      (lt(y, d, r, !!n),
        w.debug("Here Bounds", N, O),
        y.attr("viewBox", `${O.x - 5} ${O.y - 5} ${O.width + 10} ${O.height + 10}`));
    }
  }, "draw"),
  Qt = { draw: Zt, getClasses: Jt },
  ss = { parser: Tt, db: Xt, renderer: Qt, styles: Gt };
export { ss as diagram };
