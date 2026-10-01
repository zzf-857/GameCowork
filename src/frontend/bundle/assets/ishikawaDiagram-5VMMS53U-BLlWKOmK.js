import {
  _ as o,
  d as ot,
  Q as ut,
  I as dt,
  av as ft,
  t as yt,
  n as pt,
  p as it,
  a as gt,
  b as kt,
  g as wt,
  s as mt,
  q as bt,
  e as _t,
} from "./registry-BL-NPVNy.js";
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
      a = new t.Error().stack;
    a &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[a] = "a7ab25d6-6261-4eb1-9521-db6fb6df85b2"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-a7ab25d6-6261-4eb1-9521-db6fb6df85b2"));
  })();
} catch {}
var tt = (function () {
  var t = o(function (T, e, s, i) {
      for (s = s || {}, i = T.length; i--; s[T[i]] = e);
      return s;
    }, "o"),
    a = [1, 4],
    r = [1, 14],
    n = [1, 12],
    l = [1, 13],
    f = [6, 7, 8],
    y = [1, 20],
    u = [1, 18],
    m = [1, 19],
    h = [6, 7, 11],
    x = [1, 6, 13, 14],
    k = [1, 23],
    g = [1, 24],
    S = [1, 6, 7, 11, 13, 14],
    D = {
      trace: o(function () {}, "trace"),
      yy: {},
      symbols_: {
        error: 2,
        start: 3,
        ishikawa: 4,
        spaceLines: 5,
        SPACELINE: 6,
        NL: 7,
        ISHIKAWA: 8,
        document: 9,
        stop: 10,
        EOF: 11,
        statement: 12,
        SPACELIST: 13,
        TEXT: 14,
        $accept: 0,
        $end: 1,
      },
      terminals_: { 2: "error", 6: "SPACELINE", 7: "NL", 8: "ISHIKAWA", 11: "EOF", 13: "SPACELIST", 14: "TEXT" },
      productions_: [
        0,
        [3, 1],
        [3, 2],
        [5, 1],
        [5, 2],
        [5, 2],
        [4, 2],
        [4, 3],
        [10, 1],
        [10, 1],
        [10, 1],
        [10, 2],
        [10, 2],
        [9, 3],
        [9, 2],
        [12, 2],
        [12, 1],
        [12, 1],
        [12, 1],
      ],
      performAction: o(function (e, s, i, d, p, c, E) {
        var _ = c.length - 1;
        switch (p) {
          case 6:
          case 7:
            return d;
          case 15:
            d.addNode(c[_ - 1].length, c[_].trim());
            break;
          case 16:
            d.addNode(0, c[_].trim());
            break;
        }
      }, "anonymous"),
      table: [
        { 3: 1, 4: 2, 5: 3, 6: [1, 5], 8: a },
        { 1: [3] },
        { 1: [2, 1] },
        { 4: 6, 6: [1, 7], 7: [1, 8], 8: a },
        { 6: r, 7: [1, 10], 9: 9, 12: 11, 13: n, 14: l },
        t(f, [2, 3]),
        { 1: [2, 2] },
        t(f, [2, 4]),
        t(f, [2, 5]),
        { 1: [2, 6], 6: r, 12: 15, 13: n, 14: l },
        { 6: r, 9: 16, 12: 11, 13: n, 14: l },
        { 6: y, 7: u, 10: 17, 11: m },
        t(h, [2, 18], { 14: [1, 21] }),
        t(h, [2, 16]),
        t(h, [2, 17]),
        { 6: y, 7: u, 10: 22, 11: m },
        { 1: [2, 7], 6: r, 12: 15, 13: n, 14: l },
        t(x, [2, 14], { 7: k, 11: g }),
        t(S, [2, 8]),
        t(S, [2, 9]),
        t(S, [2, 10]),
        t(h, [2, 15]),
        t(x, [2, 13], { 7: k, 11: g }),
        t(S, [2, 11]),
        t(S, [2, 12]),
      ],
      defaultActions: { 2: [2, 1], 6: [2, 2] },
      parseError: o(function (e, s) {
        if (s.recoverable) this.trace(e);
        else {
          var i = new Error(e);
          throw ((i.hash = s), i);
        }
      }, "parseError"),
      parse: o(function (e) {
        var s = this,
          i = [0],
          d = [],
          p = [null],
          c = [],
          E = this.table,
          _ = "",
          v = 0,
          M = 0,
          I = 2,
          L = 1,
          N = c.slice.call(arguments, 1),
          w = Object.create(this.lexer),
          V = { yy: {} };
        for (var j in this.yy) Object.prototype.hasOwnProperty.call(this.yy, j) && (V.yy[j] = this.yy[j]);
        (w.setInput(e, V.yy), (V.yy.lexer = w), (V.yy.parser = this), typeof w.yylloc > "u" && (w.yylloc = {}));
        var z = w.yylloc;
        c.push(z);
        var Z = w.options && w.options.ranges;
        typeof V.yy.parseError == "function"
          ? (this.parseError = V.yy.parseError)
          : (this.parseError = Object.getPrototypeOf(this).parseError);
        function X(B) {
          ((i.length = i.length - 2 * B), (p.length = p.length - B), (c.length = c.length - B));
        }
        o(X, "popStack");
        function Y() {
          var B;
          return (
            (B = d.pop() || w.lex() || L),
            typeof B != "number" && (B instanceof Array && ((d = B), (B = d.pop())), (B = s.symbols_[B] || B)),
            B
          );
        }
        o(Y, "lex");
        for (var $, W, b, P, O = {}, F, C, et, q; ;) {
          if (
            ((W = i[i.length - 1]),
            this.defaultActions[W]
              ? (b = this.defaultActions[W])
              : (($ === null || typeof $ > "u") && ($ = Y()), (b = E[W] && E[W][$])),
            typeof b > "u" || !b.length || !b[0])
          ) {
            var Q = "";
            q = [];
            for (F in E[W]) this.terminals_[F] && F > I && q.push("'" + this.terminals_[F] + "'");
            (w.showPosition
              ? (Q =
                  "Parse error on line " +
                  (v + 1) +
                  `:
` +
                  w.showPosition() +
                  `
Expecting ` +
                  q.join(", ") +
                  ", got '" +
                  (this.terminals_[$] || $) +
                  "'")
              : (Q =
                  "Parse error on line " +
                  (v + 1) +
                  ": Unexpected " +
                  ($ == L ? "end of input" : "'" + (this.terminals_[$] || $) + "'")),
              this.parseError(Q, {
                text: w.match,
                token: this.terminals_[$] || $,
                line: w.yylineno,
                loc: z,
                expected: q,
              }));
          }
          if (b[0] instanceof Array && b.length > 1)
            throw new Error("Parse Error: multiple actions possible at state: " + W + ", token: " + $);
          switch (b[0]) {
            case 1:
              (i.push($),
                p.push(w.yytext),
                c.push(w.yylloc),
                i.push(b[1]),
                ($ = null),
                (M = w.yyleng),
                (_ = w.yytext),
                (v = w.yylineno),
                (z = w.yylloc));
              break;
            case 2:
              if (
                ((C = this.productions_[b[1]][1]),
                (O.$ = p[p.length - C]),
                (O._$ = {
                  first_line: c[c.length - (C || 1)].first_line,
                  last_line: c[c.length - 1].last_line,
                  first_column: c[c.length - (C || 1)].first_column,
                  last_column: c[c.length - 1].last_column,
                }),
                Z && (O._$.range = [c[c.length - (C || 1)].range[0], c[c.length - 1].range[1]]),
                (P = this.performAction.apply(O, [_, M, v, V.yy, b[1], p, c].concat(N))),
                typeof P < "u")
              )
                return P;
              (C && ((i = i.slice(0, -1 * C * 2)), (p = p.slice(0, -1 * C)), (c = c.slice(0, -1 * C))),
                i.push(this.productions_[b[1]][0]),
                p.push(O.$),
                c.push(O._$),
                (et = E[i[i.length - 2]][i[i.length - 1]]),
                i.push(et));
              break;
            case 3:
              return !0;
          }
        }
        return !0;
      }, "parse"),
    },
    R = (function () {
      var T = {
        EOF: 1,
        parseError: o(function (s, i) {
          if (this.yy.parser) this.yy.parser.parseError(s, i);
          else throw new Error(s);
        }, "parseError"),
        setInput: o(function (e, s) {
          return (
            (this.yy = s || this.yy || {}),
            (this._input = e),
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
        input: o(function () {
          var e = this._input[0];
          ((this.yytext += e), this.yyleng++, this.offset++, (this.match += e), (this.matched += e));
          var s = e.match(/(?:\r\n?|\n).*/g);
          return (
            s ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++,
            this.options.ranges && this.yylloc.range[1]++,
            (this._input = this._input.slice(1)),
            e
          );
        }, "input"),
        unput: o(function (e) {
          var s = e.length,
            i = e.split(/(?:\r\n?|\n)/g);
          ((this._input = e + this._input),
            (this.yytext = this.yytext.substr(0, this.yytext.length - s)),
            (this.offset -= s));
          var d = this.match.split(/(?:\r\n?|\n)/g);
          ((this.match = this.match.substr(0, this.match.length - 1)),
            (this.matched = this.matched.substr(0, this.matched.length - 1)),
            i.length - 1 && (this.yylineno -= i.length - 1));
          var p = this.yylloc.range;
          return (
            (this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: i
                ? (i.length === d.length ? this.yylloc.first_column : 0) + d[d.length - i.length].length - i[0].length
                : this.yylloc.first_column - s,
            }),
            this.options.ranges && (this.yylloc.range = [p[0], p[0] + this.yyleng - s]),
            (this.yyleng = this.yytext.length),
            this
          );
        }, "unput"),
        more: o(function () {
          return ((this._more = !0), this);
        }, "more"),
        reject: o(function () {
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
        less: o(function (e) {
          this.unput(this.match.slice(e));
        }, "less"),
        pastInput: o(function () {
          var e = this.matched.substr(0, this.matched.length - this.match.length);
          return (e.length > 20 ? "..." : "") + e.substr(-20).replace(/\n/g, "");
        }, "pastInput"),
        upcomingInput: o(function () {
          var e = this.match;
          return (
            e.length < 20 && (e += this._input.substr(0, 20 - e.length)),
            (e.substr(0, 20) + (e.length > 20 ? "..." : "")).replace(/\n/g, "")
          );
        }, "upcomingInput"),
        showPosition: o(function () {
          var e = this.pastInput(),
            s = new Array(e.length + 1).join("-");
          return (
            e +
            this.upcomingInput() +
            `
` +
            s +
            "^"
          );
        }, "showPosition"),
        test_match: o(function (e, s) {
          var i, d, p;
          if (
            (this.options.backtrack_lexer &&
              ((p = {
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
              this.options.ranges && (p.yylloc.range = this.yylloc.range.slice(0))),
            (d = e[0].match(/(?:\r\n?|\n).*/g)),
            d && (this.yylineno += d.length),
            (this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: d
                ? d[d.length - 1].length - d[d.length - 1].match(/\r?\n?/)[0].length
                : this.yylloc.last_column + e[0].length,
            }),
            (this.yytext += e[0]),
            (this.match += e[0]),
            (this.matches = e),
            (this.yyleng = this.yytext.length),
            this.options.ranges && (this.yylloc.range = [this.offset, (this.offset += this.yyleng)]),
            (this._more = !1),
            (this._backtrack = !1),
            (this._input = this._input.slice(e[0].length)),
            (this.matched += e[0]),
            (i = this.performAction.call(this, this.yy, this, s, this.conditionStack[this.conditionStack.length - 1])),
            this.done && this._input && (this.done = !1),
            i)
          )
            return i;
          if (this._backtrack) {
            for (var c in p) this[c] = p[c];
            return !1;
          }
          return !1;
        }, "test_match"),
        next: o(function () {
          if (this.done) return this.EOF;
          this._input || (this.done = !0);
          var e, s, i, d;
          this._more || ((this.yytext = ""), (this.match = ""));
          for (var p = this._currentRules(), c = 0; c < p.length; c++)
            if (((i = this._input.match(this.rules[p[c]])), i && (!s || i[0].length > s[0].length))) {
              if (((s = i), (d = c), this.options.backtrack_lexer)) {
                if (((e = this.test_match(i, p[c])), e !== !1)) return e;
                if (this._backtrack) {
                  s = !1;
                  continue;
                } else return !1;
              } else if (!this.options.flex) break;
            }
          return s
            ? ((e = this.test_match(s, p[d])), e !== !1 ? e : !1)
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
        lex: o(function () {
          var s = this.next();
          return s || this.lex();
        }, "lex"),
        begin: o(function (s) {
          this.conditionStack.push(s);
        }, "begin"),
        popState: o(function () {
          var s = this.conditionStack.length - 1;
          return s > 0 ? this.conditionStack.pop() : this.conditionStack[0];
        }, "popState"),
        _currentRules: o(function () {
          return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]
            ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
            : this.conditions.INITIAL.rules;
        }, "_currentRules"),
        topState: o(function (s) {
          return ((s = this.conditionStack.length - 1 - Math.abs(s || 0)), s >= 0 ? this.conditionStack[s] : "INITIAL");
        }, "topState"),
        pushState: o(function (s) {
          this.begin(s);
        }, "pushState"),
        stateStackSize: o(function () {
          return this.conditionStack.length;
        }, "stateStackSize"),
        options: { "case-insensitive": !0 },
        performAction: o(function (s, i, d, p) {
          switch (d) {
            case 0:
              return 6;
            case 1:
              return 8;
            case 2:
              return 8;
            case 3:
              return 6;
            case 4:
              return 7;
            case 5:
              return 13;
            case 6:
              return 14;
            case 7:
              return 11;
          }
        }, "anonymous"),
        rules: [
          /^(?:\s*%%.*)/i,
          /^(?:ishikawa-beta\b)/i,
          /^(?:ishikawa\b)/i,
          /^(?:[\s]+[\n])/i,
          /^(?:[\n]+)/i,
          /^(?:[\s]+)/i,
          /^(?:[^\n]+)/i,
          /^(?:$)/i,
        ],
        conditions: { INITIAL: { rules: [0, 1, 2, 3, 4, 5, 6, 7], inclusive: !0 } },
      };
      return T;
    })();
  D.lexer = R;
  function A() {
    this.yy = {};
  }
  return (o(A, "Parser"), (A.prototype = D), (D.Parser = A), new A());
})();
tt.parser = tt;
var xt = tt,
  U,
  vt =
    ((U = class {
      constructor() {
        ((this.stack = []),
          (this.clear = this.clear.bind(this)),
          (this.addNode = this.addNode.bind(this)),
          (this.getRoot = this.getRoot.bind(this)));
      }
      clear() {
        ((this.root = void 0), (this.stack = []), (this.baseLevel = void 0), yt());
      }
      getRoot() {
        return this.root;
      }
      addNode(a, r) {
        var u;
        const n = pt.sanitizeText(r, ot());
        if (!this.root) {
          ((this.root = { text: n, children: [] }), (this.stack = [{ level: 0, node: this.root }]), it(n));
          return;
        }
        (u = this.baseLevel) != null || (this.baseLevel = a);
        let l = a - this.baseLevel + 1;
        for (l <= 0 && (l = 1); this.stack.length > 1 && this.stack[this.stack.length - 1].level >= l;)
          this.stack.pop();
        const f = this.stack[this.stack.length - 1].node,
          y = { text: n, children: [] };
        (f.children.push(y), this.stack.push({ level: l, node: y }));
      }
      getAccTitle() {
        return gt();
      }
      setAccTitle(a) {
        kt(a);
      }
      getAccDescription() {
        return wt();
      }
      setAccDescription(a) {
        mt(a);
      }
      getDiagramTitle() {
        return bt();
      }
      setDiagramTitle(a) {
        it(a);
      }
    }),
    o(U, "IshikawaDB"),
    U),
  St = 14,
  H = 250,
  Et = 30,
  It = 60,
  $t = 5,
  ht = (82 * Math.PI) / 180,
  st = Math.cos(ht),
  nt = Math.sin(ht),
  at = o((t, a, r) => {
    const n = t.node().getBBox(),
      l = n.width + a * 2,
      f = n.height + a * 2;
    (_t(t, f, l, r), t.attr("viewBox", `${n.x - a} ${n.y - a} ${l} ${f}`));
  }, "applyPaddedViewBox"),
  At = o((t, a, r, n) => {
    var V, j, z, Z, X, Y, $, W;
    const f = n.db.getRoot();
    if (!f) return;
    const y = ot(),
      { look: u, handDrawnSeed: m, themeVariables: h } = y,
      x = (V = ut(y.fontSize)[0]) != null ? V : St,
      k = u === "handDrawn",
      g = (j = f.children) != null ? j : [],
      S = (Z = (z = y.ishikawa) == null ? void 0 : z.diagramPadding) != null ? Z : 20,
      D = (Y = (X = y.ishikawa) == null ? void 0 : X.useMaxWidth) != null ? Y : !1,
      R = dt(a),
      A = R.append("g").attr("class", "ishikawa"),
      T = k ? ft.svg(R.node()) : void 0,
      e = T
        ? {
            roughSvg: T,
            seed: m != null ? m : 0,
            lineColor: ($ = h == null ? void 0 : h.lineColor) != null ? $ : "#333",
            fillColor: (W = h == null ? void 0 : h.mainBkg) != null ? W : "#fff",
          }
        : void 0,
      s = `ishikawa-arrow-${a}`;
    k ||
      A.append("defs")
        .append("marker")
        .attr("id", s)
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 0)
        .attr("refY", 5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 10 0 L 0 5 L 10 10 Z")
        .attr("class", "ishikawa-arrow");
    let i = 0,
      d = H;
    const p = k ? void 0 : G(A, i, d, i, d, "ishikawa-spine");
    if ((Lt(A, i, d, f.text, x, e), !g.length)) {
      (k && G(A, i, d, i, d, "ishikawa-spine", e), at(R, S, D));
      return;
    }
    i -= 20;
    const c = g.filter((b, P) => P % 2 === 0),
      E = g.filter((b, P) => P % 2 === 1),
      _ = rt(c),
      v = rt(E),
      M = _.total + v.total;
    let I = H,
      L = H;
    if (M > 0) {
      const b = H * 2,
        P = H * 0.3;
      ((I = Math.max(P, b * (_.total / M))), (L = Math.max(P, b * (v.total / M))));
    }
    const N = x * 2;
    ((I = Math.max(I, _.max * N)),
      (L = Math.max(L, v.max * N)),
      (d = Math.max(I, H)),
      p && p.attr("y1", d).attr("y2", d),
      A.select(".ishikawa-head-group").attr("transform", `translate(0,${d})`));
    const w = Math.ceil(g.length / 2);
    for (let b = 0; b < w; b++) {
      const P = A.append("g").attr("class", "ishikawa-pair");
      for (const [O, F, C] of [
        [g[b * 2], -1, I],
        [g[b * 2 + 1], 1, L],
      ])
        O && Nt(P, O, i, d, F, C, x, e);
      i = P.selectAll("text")
        .nodes()
        .reduce((O, F) => Math.min(O, F.getBBox().x), 1 / 0);
    }
    if (k) G(A, i, d, 0, d, "ishikawa-spine", e);
    else {
      p.attr("x1", i);
      const b = `url(#${s})`;
      A.selectAll("line.ishikawa-branch, line.ishikawa-sub-branch").attr("marker-start", b);
    }
    at(R, S, D);
  }, "draw"),
  rt = o((t) => {
    const a = o((r) => r.children.reduce((n, l) => n + 1 + a(l), 0), "countDescendants");
    return t.reduce(
      (r, n) => {
        const l = a(n);
        return ((r.total += l), (r.max = Math.max(r.max, l)), r);
      },
      { total: 0, max: 0 },
    );
  }, "sideStats"),
  Lt = o((t, a, r, n, l, f) => {
    const y = Math.max(6, Math.floor(110 / (l * 0.6))),
      u = t.append("g").attr("class", "ishikawa-head-group").attr("transform", `translate(${a},${r})`),
      m = K(u, ct(n, y), 0, 0, "ishikawa-head-label", "start", l),
      h = m.node().getBBox(),
      x = Math.max(60, h.width + 6),
      k = Math.max(40, h.height * 2 + 40),
      g = `M 0 ${-k / 2} L 0 ${k / 2} Q ${x * 2.4} 0 0 ${-k / 2} Z`;
    if (f) {
      const S = f.roughSvg.path(g, {
        roughness: 1.5,
        seed: f.seed,
        fill: f.fillColor,
        fillStyle: "hachure",
        fillWeight: 2.5,
        hachureGap: 5,
        stroke: f.lineColor,
        strokeWidth: 2,
      });
      u.insert(() => S, ":first-child").attr("class", "ishikawa-head");
    } else u.insert("path", ":first-child").attr("class", "ishikawa-head").attr("d", g);
    m.attr("transform", `translate(${(x - h.width) / 2 - h.x + 3},${-h.y - h.height / 2})`);
  }, "drawHead"),
  Tt = o((t, a) => {
    const r = [],
      n = [],
      l = o((f, y, u) => {
        var h;
        const m = a === -1 ? [...f].reverse() : f;
        for (const x of m) {
          const k = r.length,
            g = (h = x.children) != null ? h : [];
          (r.push({ depth: u, text: ct(x.text, 15), parentIndex: y, childCount: g.length }),
            u % 2 === 0 ? (n.push(k), g.length && l(g, k, u + 1)) : (g.length && l(g, k, u + 1), n.push(k)));
        }
      }, "walk");
    return (l(t, -1, 2), { entries: r, yOrder: n });
  }, "flattenTree"),
  Mt = o((t, a, r, n, l, f, y) => {
    const u = t.append("g").attr("class", "ishikawa-label-group"),
      h = K(u, a, r, n + 11 * l, "ishikawa-label cause", "middle", f)
        .node()
        .getBBox();
    if (y) {
      const x = y.roughSvg.rectangle(h.x - 20, h.y - 2, h.width + 40, h.height + 4, {
        roughness: 1.5,
        seed: y.seed,
        fill: y.fillColor,
        fillStyle: "hachure",
        fillWeight: 2.5,
        hachureGap: 5,
        stroke: y.lineColor,
        strokeWidth: 2,
      });
      u.insert(() => x, ":first-child").attr("class", "ishikawa-label-box");
    } else
      u.insert("rect", ":first-child")
        .attr("class", "ishikawa-label-box")
        .attr("x", h.x - 20)
        .attr("y", h.y - 2)
        .attr("width", h.width + 40)
        .attr("height", h.height + 4);
  }, "drawCauseLabel"),
  J = o((t, a, r, n, l, f) => {
    const y = Math.sqrt(n * n + l * l);
    if (y === 0) return;
    const u = n / y,
      m = l / y,
      h = 6,
      x = -m * h,
      k = u * h,
      g = a,
      S = r,
      D = `M ${g} ${S} L ${g - u * h * 2 + x} ${S - m * h * 2 + k} L ${g - u * h * 2 - x} ${S - m * h * 2 - k} Z`,
      R = f.roughSvg.path(D, {
        roughness: 1,
        seed: f.seed,
        fill: f.lineColor,
        fillStyle: "solid",
        stroke: f.lineColor,
        strokeWidth: 1,
      });
    t.append(() => R);
  }, "drawArrowMarker"),
  Nt = o((t, a, r, n, l, f, y, u) => {
    var p;
    const m = (p = a.children) != null ? p : [],
      h = f * (m.length ? 1 : 0.2),
      x = -st * h,
      k = nt * h * l,
      g = r + x,
      S = n + k;
    if (
      (G(t, r, n, g, S, "ishikawa-branch", u),
      u && J(t, r, n, r - g, n - S, u),
      Mt(t, a.text, g, S, l, y, u),
      !m.length)
    )
      return;
    const { entries: D, yOrder: R } = Tt(m, l),
      A = D.length,
      T = new Array(A);
    for (const [c, E] of R.entries()) T[E] = n + k * ((c + 1) / (A + 1));
    const e = new Map();
    e.set(-1, { x0: r, y0: n, x1: g, y1: S, childCount: m.length, childrenDrawn: 0 });
    const s = -st,
      i = nt * l,
      d = l < 0 ? "ishikawa-label up" : "ishikawa-label down";
    for (const [c, E] of D.entries()) {
      const _ = T[c],
        v = e.get(E.parentIndex),
        M = t.append("g").attr("class", "ishikawa-sub-group");
      let I = 0,
        L = 0,
        N = 0;
      if (E.depth % 2 === 0) {
        const w = v.y1 - v.y0;
        ((I = lt(v.x0, v.x1, w ? (_ - v.y0) / w : 0.5)),
          (L = _),
          (N = I - (E.childCount > 0 ? It + E.childCount * $t : Et)),
          G(M, I, _, N, _, "ishikawa-sub-branch", u),
          u && J(M, I, _, 1, 0, u),
          K(M, E.text, N, _, "ishikawa-label align", "end", y));
      } else {
        const w = v.childrenDrawn++;
        ((I = lt(v.x0, v.x1, (v.childCount - w) / (v.childCount + 1))),
          (L = v.y0),
          (N = I + s * ((_ - L) / i)),
          G(M, I, L, N, _, "ishikawa-sub-branch", u),
          u && J(M, I, L, I - N, L - _, u),
          K(M, E.text, N, _, d, "end", y));
      }
      E.childCount > 0 && e.set(c, { x0: I, y0: L, x1: N, y1: _, childCount: E.childCount, childrenDrawn: 0 });
    }
  }, "drawBranch"),
  Pt = o((t) => t.split(/<br\s*\/?>|\n/), "splitLines"),
  ct = o((t, a) => {
    if (t.length <= a) return t;
    const r = [];
    for (const n of t.split(/\s+/)) {
      const l = r.length - 1;
      l >= 0 && r[l].length + 1 + n.length <= a ? (r[l] += " " + n) : r.push(n);
    }
    return r.join(`
`);
  }, "wrapText"),
  K = o((t, a, r, n, l, f, y) => {
    const u = Pt(a),
      m = y * 1.05,
      h = t
        .append("text")
        .attr("class", l)
        .attr("text-anchor", f)
        .attr("x", r)
        .attr("y", n - ((u.length - 1) * m) / 2);
    for (const [x, k] of u.entries())
      h.append("tspan")
        .attr("x", r)
        .attr("dy", x === 0 ? 0 : m)
        .text(k);
    return h;
  }, "drawMultilineText"),
  lt = o((t, a, r) => t + (a - t) * r, "lerp"),
  G = o((t, a, r, n, l, f, y) => {
    if (y) {
      const u = y.roughSvg.line(a, r, n, l, { roughness: 1.5, seed: y.seed, stroke: y.lineColor, strokeWidth: 2 });
      t.append(() => u).attr("class", f);
      return;
    }
    return t.append("line").attr("class", f).attr("x1", a).attr("y1", r).attr("x2", n).attr("y2", l);
  }, "drawLine"),
  Bt = { draw: At },
  Dt = o(
    (t) => `
.ishikawa .ishikawa-spine,
.ishikawa .ishikawa-branch,
.ishikawa .ishikawa-sub-branch {
  stroke: ${t.lineColor};
  stroke-width: 2;
  fill: none;
}

.ishikawa .ishikawa-sub-branch {
  stroke-width: 1;
}

.ishikawa .ishikawa-arrow {
  fill: ${t.lineColor};
}

.ishikawa .ishikawa-head {
  fill: ${t.mainBkg};
  stroke: ${t.lineColor};
  stroke-width: 2;
}

.ishikawa .ishikawa-label-box {
  fill: ${t.mainBkg};
  stroke: ${t.lineColor};
  stroke-width: 2;
}

.ishikawa text {
  font-family: ${t.fontFamily};
  font-size: ${t.fontSize};
  fill: ${t.textColor};
}

.ishikawa .ishikawa-head-label {
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  font-size: 14px;
}

.ishikawa .ishikawa-label {
  text-anchor: end;
}

.ishikawa .ishikawa-label.cause {
  text-anchor: middle;
  dominant-baseline: middle;
}

.ishikawa .ishikawa-label.align {
  text-anchor: end;
  dominant-baseline: middle;
}

.ishikawa .ishikawa-label.up {
  dominant-baseline: baseline;
}

.ishikawa .ishikawa-label.down {
  dominant-baseline: hanging;
}
`,
    "getStyles",
  ),
  Ot = Dt,
  Rt = {
    parser: xt,
    get db() {
      return new vt();
    },
    renderer: Bt,
    styles: Ot,
  };
export { Rt as diagram };
