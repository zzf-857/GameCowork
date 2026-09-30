import {
  _ as c,
  D as yt,
  a0 as Vt,
  a1 as Ft,
  a2 as Gt,
  d as mt,
  l as w,
  I as zt,
  Q as Ot,
  a3 as xt,
  m as Q,
  y as Dt,
  a4 as Kt,
  t as Ut,
} from "./registry-BL-NPVNy.js";
import { d as dt } from "./arc-DXqqVeYx.js";
(function () {
  var n =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  n.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
})();
try {
  (function () {
    var n =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      t = new n.Error().stack;
    t &&
      ((n._sentryDebugIds = n._sentryDebugIds || {}),
      (n._sentryDebugIds[t] = "1e0044a4-e1b1-4172-9710-76872c01f3b0"),
      (n._sentryDebugIdIdentifier = "sentry-dbid-1e0044a4-e1b1-4172-9710-76872c01f3b0"));
  })();
} catch {}
var nt = (function () {
  var n = c(function (g, s, h, d) {
      for (h = h || {}, d = g.length; d--; h[g[d]] = s);
      return h;
    }, "o"),
    t = [6, 11, 13, 14, 15, 17, 19, 20, 23, 24],
    r = [1, 12],
    i = [1, 13],
    e = [1, 14],
    a = [1, 15],
    o = [1, 16],
    l = [1, 19],
    f = [1, 20],
    m = {
      trace: c(function () {}, "trace"),
      yy: {},
      symbols_: {
        error: 2,
        start: 3,
        timeline_header: 4,
        document: 5,
        EOF: 6,
        timeline: 7,
        timeline_lr: 8,
        timeline_td: 9,
        line: 10,
        SPACE: 11,
        statement: 12,
        NEWLINE: 13,
        title: 14,
        acc_title: 15,
        acc_title_value: 16,
        acc_descr: 17,
        acc_descr_value: 18,
        acc_descr_multiline_value: 19,
        section: 20,
        period_statement: 21,
        event_statement: 22,
        period: 23,
        event: 24,
        $accept: 0,
        $end: 1,
      },
      terminals_: {
        2: "error",
        6: "EOF",
        7: "timeline",
        8: "timeline_lr",
        9: "timeline_td",
        11: "SPACE",
        13: "NEWLINE",
        14: "title",
        15: "acc_title",
        16: "acc_title_value",
        17: "acc_descr",
        18: "acc_descr_value",
        19: "acc_descr_multiline_value",
        20: "section",
        23: "period",
        24: "event",
      },
      productions_: [
        0,
        [3, 3],
        [4, 1],
        [4, 1],
        [4, 1],
        [5, 0],
        [5, 2],
        [10, 2],
        [10, 1],
        [10, 1],
        [10, 1],
        [12, 1],
        [12, 2],
        [12, 2],
        [12, 1],
        [12, 1],
        [12, 1],
        [12, 1],
        [21, 1],
        [22, 1],
      ],
      performAction: c(function (s, h, d, p, k, u, _) {
        var b = u.length - 1;
        switch (k) {
          case 1:
            return u[b - 1];
          case 3:
            p.setDirection("LR");
            break;
          case 4:
            p.setDirection("TD");
            break;
          case 5:
            this.$ = [];
            break;
          case 6:
            (u[b - 1].push(u[b]), (this.$ = u[b - 1]));
            break;
          case 7:
          case 8:
            this.$ = u[b];
            break;
          case 9:
          case 10:
            this.$ = [];
            break;
          case 11:
            (p.getCommonDb().setDiagramTitle(u[b].substr(6)), (this.$ = u[b].substr(6)));
            break;
          case 12:
            ((this.$ = u[b].trim()), p.getCommonDb().setAccTitle(this.$));
            break;
          case 13:
          case 14:
            ((this.$ = u[b].trim()), p.getCommonDb().setAccDescription(this.$));
            break;
          case 15:
            (p.addSection(u[b].substr(8)), (this.$ = u[b].substr(8)));
            break;
          case 18:
            (p.addTask(u[b], 0, ""), (this.$ = u[b]));
            break;
          case 19:
            (p.addEvent(u[b].substr(2)), (this.$ = u[b]));
            break;
        }
      }, "anonymous"),
      table: [
        { 3: 1, 4: 2, 7: [1, 3], 8: [1, 4], 9: [1, 5] },
        { 1: [3] },
        n(t, [2, 5], { 5: 6 }),
        n(t, [2, 2]),
        n(t, [2, 3]),
        n(t, [2, 4]),
        {
          6: [1, 7],
          10: 8,
          11: [1, 9],
          12: 10,
          13: [1, 11],
          14: r,
          15: i,
          17: e,
          19: a,
          20: o,
          21: 17,
          22: 18,
          23: l,
          24: f,
        },
        n(t, [2, 10], { 1: [2, 1] }),
        n(t, [2, 6]),
        { 12: 21, 14: r, 15: i, 17: e, 19: a, 20: o, 21: 17, 22: 18, 23: l, 24: f },
        n(t, [2, 8]),
        n(t, [2, 9]),
        n(t, [2, 11]),
        { 16: [1, 22] },
        { 18: [1, 23] },
        n(t, [2, 14]),
        n(t, [2, 15]),
        n(t, [2, 16]),
        n(t, [2, 17]),
        n(t, [2, 18]),
        n(t, [2, 19]),
        n(t, [2, 7]),
        n(t, [2, 12]),
        n(t, [2, 13]),
      ],
      defaultActions: {},
      parseError: c(function (s, h) {
        if (h.recoverable) this.trace(s);
        else {
          var d = new Error(s);
          throw ((d.hash = h), d);
        }
      }, "parseError"),
      parse: c(function (s) {
        var h = this,
          d = [0],
          p = [],
          k = [null],
          u = [],
          _ = this.table,
          b = "",
          R = 0,
          F = 0,
          W = 2,
          z = 1,
          H = u.slice.call(arguments, 1),
          v = Object.create(this.lexer),
          $ = { yy: {} };
        for (var P in this.yy) Object.prototype.hasOwnProperty.call(this.yy, P) && ($.yy[P] = this.yy[P]);
        (v.setInput(s, $.yy), ($.yy.lexer = v), ($.yy.parser = this), typeof v.yylloc > "u" && (v.yylloc = {}));
        var G = v.yylloc;
        u.push(G);
        var q = v.options && v.options.ranges;
        typeof $.yy.parseError == "function"
          ? (this.parseError = $.yy.parseError)
          : (this.parseError = Object.getPrototypeOf(this).parseError);
        function U(T) {
          ((d.length = d.length - 2 * T), (k.length = k.length - T), (u.length = u.length - T));
        }
        c(U, "popStack");
        function K() {
          var T;
          return (
            (T = p.pop() || v.lex() || z),
            typeof T != "number" && (T instanceof Array && ((p = T), (T = p.pop())), (T = h.symbols_[T] || T)),
            T
          );
        }
        c(K, "lex");
        for (var N, B, M, O, L = {}, E, S, I, A; ;) {
          if (
            ((B = d[d.length - 1]),
            this.defaultActions[B]
              ? (M = this.defaultActions[B])
              : ((N === null || typeof N > "u") && (N = K()), (M = _[B] && _[B][N])),
            typeof M > "u" || !M.length || !M[0])
          ) {
            var V = "";
            A = [];
            for (E in _[B]) this.terminals_[E] && E > W && A.push("'" + this.terminals_[E] + "'");
            (v.showPosition
              ? (V =
                  "Parse error on line " +
                  (R + 1) +
                  `:
` +
                  v.showPosition() +
                  `
Expecting ` +
                  A.join(", ") +
                  ", got '" +
                  (this.terminals_[N] || N) +
                  "'")
              : (V =
                  "Parse error on line " +
                  (R + 1) +
                  ": Unexpected " +
                  (N == z ? "end of input" : "'" + (this.terminals_[N] || N) + "'")),
              this.parseError(V, {
                text: v.match,
                token: this.terminals_[N] || N,
                line: v.yylineno,
                loc: G,
                expected: A,
              }));
          }
          if (M[0] instanceof Array && M.length > 1)
            throw new Error("Parse Error: multiple actions possible at state: " + B + ", token: " + N);
          switch (M[0]) {
            case 1:
              (d.push(N),
                k.push(v.yytext),
                u.push(v.yylloc),
                d.push(M[1]),
                (N = null),
                (F = v.yyleng),
                (b = v.yytext),
                (R = v.yylineno),
                (G = v.yylloc));
              break;
            case 2:
              if (
                ((S = this.productions_[M[1]][1]),
                (L.$ = k[k.length - S]),
                (L._$ = {
                  first_line: u[u.length - (S || 1)].first_line,
                  last_line: u[u.length - 1].last_line,
                  first_column: u[u.length - (S || 1)].first_column,
                  last_column: u[u.length - 1].last_column,
                }),
                q && (L._$.range = [u[u.length - (S || 1)].range[0], u[u.length - 1].range[1]]),
                (O = this.performAction.apply(L, [b, F, R, $.yy, M[1], k, u].concat(H))),
                typeof O < "u")
              )
                return O;
              (S && ((d = d.slice(0, -1 * S * 2)), (k = k.slice(0, -1 * S)), (u = u.slice(0, -1 * S))),
                d.push(this.productions_[M[1]][0]),
                k.push(L.$),
                u.push(L._$),
                (I = _[d[d.length - 2]][d[d.length - 1]]),
                d.push(I));
              break;
            case 3:
              return !0;
          }
        }
        return !0;
      }, "parse"),
    },
    x = (function () {
      var g = {
        EOF: 1,
        parseError: c(function (h, d) {
          if (this.yy.parser) this.yy.parser.parseError(h, d);
          else throw new Error(h);
        }, "parseError"),
        setInput: c(function (s, h) {
          return (
            (this.yy = h || this.yy || {}),
            (this._input = s),
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
        input: c(function () {
          var s = this._input[0];
          ((this.yytext += s), this.yyleng++, this.offset++, (this.match += s), (this.matched += s));
          var h = s.match(/(?:\r\n?|\n).*/g);
          return (
            h ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++,
            this.options.ranges && this.yylloc.range[1]++,
            (this._input = this._input.slice(1)),
            s
          );
        }, "input"),
        unput: c(function (s) {
          var h = s.length,
            d = s.split(/(?:\r\n?|\n)/g);
          ((this._input = s + this._input),
            (this.yytext = this.yytext.substr(0, this.yytext.length - h)),
            (this.offset -= h));
          var p = this.match.split(/(?:\r\n?|\n)/g);
          ((this.match = this.match.substr(0, this.match.length - 1)),
            (this.matched = this.matched.substr(0, this.matched.length - 1)),
            d.length - 1 && (this.yylineno -= d.length - 1));
          var k = this.yylloc.range;
          return (
            (this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: d
                ? (d.length === p.length ? this.yylloc.first_column : 0) + p[p.length - d.length].length - d[0].length
                : this.yylloc.first_column - h,
            }),
            this.options.ranges && (this.yylloc.range = [k[0], k[0] + this.yyleng - h]),
            (this.yyleng = this.yytext.length),
            this
          );
        }, "unput"),
        more: c(function () {
          return ((this._more = !0), this);
        }, "more"),
        reject: c(function () {
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
        less: c(function (s) {
          this.unput(this.match.slice(s));
        }, "less"),
        pastInput: c(function () {
          var s = this.matched.substr(0, this.matched.length - this.match.length);
          return (s.length > 20 ? "..." : "") + s.substr(-20).replace(/\n/g, "");
        }, "pastInput"),
        upcomingInput: c(function () {
          var s = this.match;
          return (
            s.length < 20 && (s += this._input.substr(0, 20 - s.length)),
            (s.substr(0, 20) + (s.length > 20 ? "..." : "")).replace(/\n/g, "")
          );
        }, "upcomingInput"),
        showPosition: c(function () {
          var s = this.pastInput(),
            h = new Array(s.length + 1).join("-");
          return (
            s +
            this.upcomingInput() +
            `
` +
            h +
            "^"
          );
        }, "showPosition"),
        test_match: c(function (s, h) {
          var d, p, k;
          if (
            (this.options.backtrack_lexer &&
              ((k = {
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
              this.options.ranges && (k.yylloc.range = this.yylloc.range.slice(0))),
            (p = s[0].match(/(?:\r\n?|\n).*/g)),
            p && (this.yylineno += p.length),
            (this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: p
                ? p[p.length - 1].length - p[p.length - 1].match(/\r?\n?/)[0].length
                : this.yylloc.last_column + s[0].length,
            }),
            (this.yytext += s[0]),
            (this.match += s[0]),
            (this.matches = s),
            (this.yyleng = this.yytext.length),
            this.options.ranges && (this.yylloc.range = [this.offset, (this.offset += this.yyleng)]),
            (this._more = !1),
            (this._backtrack = !1),
            (this._input = this._input.slice(s[0].length)),
            (this.matched += s[0]),
            (d = this.performAction.call(this, this.yy, this, h, this.conditionStack[this.conditionStack.length - 1])),
            this.done && this._input && (this.done = !1),
            d)
          )
            return d;
          if (this._backtrack) {
            for (var u in k) this[u] = k[u];
            return !1;
          }
          return !1;
        }, "test_match"),
        next: c(function () {
          if (this.done) return this.EOF;
          this._input || (this.done = !0);
          var s, h, d, p;
          this._more || ((this.yytext = ""), (this.match = ""));
          for (var k = this._currentRules(), u = 0; u < k.length; u++)
            if (((d = this._input.match(this.rules[k[u]])), d && (!h || d[0].length > h[0].length))) {
              if (((h = d), (p = u), this.options.backtrack_lexer)) {
                if (((s = this.test_match(d, k[u])), s !== !1)) return s;
                if (this._backtrack) {
                  h = !1;
                  continue;
                } else return !1;
              } else if (!this.options.flex) break;
            }
          return h
            ? ((s = this.test_match(h, k[p])), s !== !1 ? s : !1)
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
        lex: c(function () {
          var h = this.next();
          return h || this.lex();
        }, "lex"),
        begin: c(function (h) {
          this.conditionStack.push(h);
        }, "begin"),
        popState: c(function () {
          var h = this.conditionStack.length - 1;
          return h > 0 ? this.conditionStack.pop() : this.conditionStack[0];
        }, "popState"),
        _currentRules: c(function () {
          return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]
            ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
            : this.conditions.INITIAL.rules;
        }, "_currentRules"),
        topState: c(function (h) {
          return ((h = this.conditionStack.length - 1 - Math.abs(h || 0)), h >= 0 ? this.conditionStack[h] : "INITIAL");
        }, "topState"),
        pushState: c(function (h) {
          this.begin(h);
        }, "pushState"),
        stateStackSize: c(function () {
          return this.conditionStack.length;
        }, "stateStackSize"),
        options: { "case-insensitive": !0 },
        performAction: c(function (h, d, p, k) {
          switch (p) {
            case 0:
              break;
            case 1:
              break;
            case 2:
              return 13;
            case 3:
              break;
            case 4:
              break;
            case 5:
              return 8;
            case 6:
              return 9;
            case 7:
              return 7;
            case 8:
              return 14;
            case 9:
              return (this.begin("acc_title"), 15);
            case 10:
              return (this.popState(), "acc_title_value");
            case 11:
              return (this.begin("acc_descr"), 17);
            case 12:
              return (this.popState(), "acc_descr_value");
            case 13:
              this.begin("acc_descr_multiline");
              break;
            case 14:
              this.popState();
              break;
            case 15:
              return "acc_descr_multiline_value";
            case 16:
              return 20;
            case 17:
              return 24;
            case 18:
              return 23;
            case 19:
              return 6;
            case 20:
              return "INVALID";
          }
        }, "anonymous"),
        rules: [
          /^(?:%(?!\{)[^\n]*)/i,
          /^(?:[^\}]%%[^\n]*)/i,
          /^(?:[\n]+)/i,
          /^(?:\s+)/i,
          /^(?:#[^\n]*)/i,
          /^(?:timeline[ \t]+LR\b)/i,
          /^(?:timeline[ \t]+TD\b)/i,
          /^(?:timeline\b)/i,
          /^(?:title\s[^\n]+)/i,
          /^(?:accTitle\s*:\s*)/i,
          /^(?:(?!\n||)*[^\n]*)/i,
          /^(?:accDescr\s*:\s*)/i,
          /^(?:(?!\n||)*[^\n]*)/i,
          /^(?:accDescr\s*\{\s*)/i,
          /^(?:[\}])/i,
          /^(?:[^\}]*)/i,
          /^(?:section\s[^:\n]+)/i,
          /^(?::\s(?:[^:\n]|:(?!\s))+)/i,
          /^(?:[^#:\n]+)/i,
          /^(?:$)/i,
          /^(?:.)/i,
        ],
        conditions: {
          acc_descr_multiline: { rules: [14, 15], inclusive: !1 },
          acc_descr: { rules: [12], inclusive: !1 },
          acc_title: { rules: [10], inclusive: !1 },
          INITIAL: { rules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 16, 17, 18, 19, 20], inclusive: !0 },
        },
      };
      return g;
    })();
  m.lexer = x;
  function y() {
    this.yy = {};
  }
  return (c(y, "Parser"), (y.prototype = m), (m.Parser = y), new y());
})();
nt.parser = nt;
var Xt = nt,
  kt = {};
Dt(kt, {
  addEvent: () => Nt,
  addSection: () => Et,
  addTask: () => It,
  addTaskOrg: () => Ht,
  clear: () => _t,
  default: () => Zt,
  getCommonDb: () => vt,
  getDirection: () => St,
  getSections: () => Tt,
  getTasks: () => $t,
  setDirection: () => wt,
});
var X = "",
  bt = 0,
  st = "LR",
  it = [],
  J = [],
  Z = [],
  vt = c(() => Kt, "getCommonDb"),
  _t = c(function () {
    ((it.length = 0), (J.length = 0), (X = ""), (Z.length = 0), (st = "LR"), Ut());
  }, "clear"),
  wt = c(function (n) {
    st = n;
  }, "setDirection"),
  St = c(function () {
    return st;
  }, "getDirection"),
  Et = c(function (n) {
    ((X = n), it.push(n));
  }, "addSection"),
  Tt = c(function () {
    return it;
  }, "getSections"),
  $t = c(function () {
    let n = ht();
    const t = 100;
    let r = 0;
    for (; !n && r < t;) ((n = ht()), r++);
    return (J.push(...Z), J);
  }, "getTasks"),
  It = c(function (n, t, r) {
    const i = { id: bt++, section: X, type: X, task: n, score: t || 0, events: r ? [r] : [] };
    Z.push(i);
  }, "addTask"),
  Nt = c(function (n) {
    Z.find((r) => r.id === bt - 1).events.push(n);
  }, "addEvent"),
  Ht = c(function (n) {
    const t = { section: X, type: X, description: n, task: n, classes: [] };
    J.push(t);
  }, "addTaskOrg"),
  ht = c(function () {
    const n = c(function (r) {
      return Z[r].processed;
    }, "compileTask");
    let t = !0;
    for (const [r, i] of Z.entries()) (n(r), (t = t && i.processed));
    return t;
  }, "compileTasks"),
  Zt = {
    clear: _t,
    getCommonDb: vt,
    getDirection: St,
    setDirection: wt,
    addSection: Et,
    getSections: Tt,
    getTasks: $t,
    addTask: It,
    addTaskOrg: Ht,
    addEvent: Nt,
  },
  Lt = 0,
  j = c(function (n, t) {
    const r = n.append("rect");
    return (
      r.attr("x", t.x),
      r.attr("y", t.y),
      r.attr("fill", t.fill),
      r.attr("stroke", t.stroke),
      r.attr("width", t.width),
      r.attr("height", t.height),
      r.attr("rx", t.rx),
      r.attr("ry", t.ry),
      t.class !== void 0 && r.attr("class", t.class),
      r
    );
  }, "drawRect"),
  qt = c(function (n, t) {
    const i = n
        .append("circle")
        .attr("cx", t.cx)
        .attr("cy", t.cy)
        .attr("class", "face")
        .attr("r", 15)
        .attr("stroke-width", 2)
        .attr("overflow", "visible"),
      e = n.append("g");
    (e
      .append("circle")
      .attr("cx", t.cx - 15 / 3)
      .attr("cy", t.cy - 15 / 3)
      .attr("r", 1.5)
      .attr("stroke-width", 2)
      .attr("fill", "#666")
      .attr("stroke", "#666"),
      e
        .append("circle")
        .attr("cx", t.cx + 15 / 3)
        .attr("cy", t.cy - 15 / 3)
        .attr("r", 1.5)
        .attr("stroke-width", 2)
        .attr("fill", "#666")
        .attr("stroke", "#666"));
    function a(f) {
      const m = dt()
        .startAngle(Math.PI / 2)
        .endAngle(3 * (Math.PI / 2))
        .innerRadius(7.5)
        .outerRadius(6.8181818181818175);
      f.append("path")
        .attr("class", "mouth")
        .attr("d", m)
        .attr("transform", "translate(" + t.cx + "," + (t.cy + 2) + ")");
    }
    c(a, "smile");
    function o(f) {
      const m = dt()
        .startAngle((3 * Math.PI) / 2)
        .endAngle(5 * (Math.PI / 2))
        .innerRadius(7.5)
        .outerRadius(6.8181818181818175);
      f.append("path")
        .attr("class", "mouth")
        .attr("d", m)
        .attr("transform", "translate(" + t.cx + "," + (t.cy + 7) + ")");
    }
    c(o, "sad");
    function l(f) {
      f.append("line")
        .attr("class", "mouth")
        .attr("stroke", 2)
        .attr("x1", t.cx - 5)
        .attr("y1", t.cy + 7)
        .attr("x2", t.cx + 5)
        .attr("y2", t.cy + 7)
        .attr("class", "mouth")
        .attr("stroke-width", "1px")
        .attr("stroke", "#666");
    }
    return (c(l, "ambivalent"), t.score > 3 ? a(e) : t.score < 3 ? o(e) : l(e), i);
  }, "drawFace"),
  Qt = c(function (n, t) {
    const r = n.append("circle");
    return (
      r.attr("cx", t.cx),
      r.attr("cy", t.cy),
      r.attr("class", "actor-" + t.pos),
      r.attr("fill", t.fill),
      r.attr("stroke", t.stroke),
      r.attr("r", t.r),
      r.class !== void 0 && r.attr("class", r.class),
      t.title !== void 0 && r.append("title").text(t.title),
      r
    );
  }, "drawCircle"),
  Mt = c(function (n, t) {
    const r = t.text.replace(/<br\s*\/?>/gi, " "),
      i = n.append("text");
    (i.attr("x", t.x),
      i.attr("y", t.y),
      i.attr("class", "legend"),
      i.style("text-anchor", t.anchor),
      t.class !== void 0 && i.attr("class", t.class));
    const e = i.append("tspan");
    return (e.attr("x", t.x + t.textMargin * 2), e.text(r), i);
  }, "drawText"),
  Jt = c(function (n, t) {
    function r(e, a, o, l, f) {
      return (
        e +
        "," +
        a +
        " " +
        (e + o) +
        "," +
        a +
        " " +
        (e + o) +
        "," +
        (a + l - f) +
        " " +
        (e + o - f * 1.2) +
        "," +
        (a + l) +
        " " +
        e +
        "," +
        (a + l)
      );
    }
    c(r, "genPoints");
    const i = n.append("polygon");
    (i.attr("points", r(t.x, t.y, 50, 20, 7)),
      i.attr("class", "labelBox"),
      (t.y = t.y + t.labelMargin),
      (t.x = t.x + 0.5 * t.labelMargin),
      Mt(n, t));
  }, "drawLabel"),
  jt = c(function (n, t, r) {
    const i = n.append("g"),
      e = at();
    ((e.x = t.x),
      (e.y = t.y),
      (e.fill = t.fill),
      (e.width = r.width),
      (e.height = r.height),
      (e.class = "journey-section section-type-" + t.num),
      (e.rx = 3),
      (e.ry = 3),
      j(i, e),
      At(r)(t.text, i, e.x, e.y, e.width, e.height, { class: "journey-section section-type-" + t.num }, r, t.colour));
  }, "drawSection"),
  rt = -1,
  Yt = c(function (n, t, r, i) {
    const e = t.x + r.width / 2,
      a = n.append("g");
    rt++;
    const o = 300 + 5 * 30;
    (a
      .append("line")
      .attr("id", i + "-task" + rt)
      .attr("x1", e)
      .attr("y1", t.y)
      .attr("x2", e)
      .attr("y2", o)
      .attr("class", "task-line")
      .attr("stroke-width", "1px")
      .attr("stroke-dasharray", "4 2")
      .attr("stroke", "#666"),
      qt(a, { cx: e, cy: 300 + (5 - t.score) * 30, score: t.score }));
    const l = at();
    ((l.x = t.x),
      (l.y = t.y),
      (l.fill = t.fill),
      (l.width = r.width),
      (l.height = r.height),
      (l.class = "task task-type-" + t.num),
      (l.rx = 3),
      (l.ry = 3),
      j(a, l),
      At(r)(t.task, a, l.x, l.y, l.width, l.height, { class: "task" }, r, t.colour));
  }, "drawTask"),
  te = c(function (n, t) {
    j(n, {
      x: t.startx,
      y: t.starty,
      width: t.stopx - t.startx,
      height: t.stopy - t.starty,
      fill: t.fill,
      class: "rect",
    }).lower();
  }, "drawBackgroundRect"),
  ee = c(function () {
    return { x: 0, y: 0, fill: void 0, "text-anchor": "start", width: 100, height: 100, textMargin: 0, rx: 0, ry: 0 };
  }, "getTextObj"),
  at = c(function () {
    return { x: 0, y: 0, width: 100, anchor: "start", height: 100, rx: 0, ry: 0 };
  }, "getNoteRect"),
  At = (function () {
    function n(e, a, o, l, f, m, x, y) {
      const g = a
        .append("text")
        .attr("x", o + f / 2)
        .attr("y", l + m / 2 + 5)
        .style("font-color", y)
        .style("text-anchor", "middle")
        .text(e);
      i(g, x);
    }
    c(n, "byText");
    function t(e, a, o, l, f, m, x, y, g) {
      const { taskFontSize: s, taskFontFamily: h } = y,
        d = e.split(/<br\s*\/?>/gi);
      for (let p = 0; p < d.length; p++) {
        const k = p * s - (s * (d.length - 1)) / 2,
          u = a
            .append("text")
            .attr("x", o + f / 2)
            .attr("y", l)
            .attr("fill", g)
            .style("text-anchor", "middle")
            .style("font-size", s)
            .style("font-family", h);
        (u
          .append("tspan")
          .attr("x", o + f / 2)
          .attr("dy", k)
          .text(d[p]),
          u
            .attr("y", l + m / 2)
            .attr("dominant-baseline", "central")
            .attr("alignment-baseline", "central"),
          i(u, x));
      }
    }
    c(t, "byTspan");
    function r(e, a, o, l, f, m, x, y) {
      const g = a.append("switch"),
        h = g
          .append("foreignObject")
          .attr("x", o)
          .attr("y", l)
          .attr("width", f)
          .attr("height", m)
          .attr("position", "fixed")
          .append("xhtml:div")
          .style("display", "table")
          .style("height", "100%")
          .style("width", "100%");
      (h
        .append("div")
        .attr("class", "label")
        .style("display", "table-cell")
        .style("text-align", "center")
        .style("vertical-align", "middle")
        .text(e),
        t(e, g, o, l, f, m, x, y),
        i(h, x));
    }
    c(r, "byFo");
    function i(e, a) {
      for (const o in a) o in a && e.attr(o, a[o]);
    }
    return (
      c(i, "_setTextAttrs"),
      function (e) {
        return e.textPlacement === "fo" ? r : e.textPlacement === "old" ? n : t;
      }
    );
  })(),
  ne = c(function (n, t) {
    ((Lt = 0),
      (rt = -1),
      n
        .append("defs")
        .append("marker")
        .attr("id", t + "-arrowhead")
        .attr("refX", 5)
        .attr("refY", 2)
        .attr("markerWidth", 6)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0,0 V 4 L6,2 Z"));
  }, "initGraphics");
function ot(n, t) {
  n.each(function () {
    var r = Q(this),
      i = r
        .text()
        .split(/(\s+|<br>)/)
        .reverse(),
      e,
      a = [],
      o = 1.1,
      l = r.attr("y"),
      f = parseFloat(r.attr("dy")),
      m = r
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", l)
        .attr("dy", f + "em");
    for (let x = 0; x < i.length; x++)
      ((e = i[i.length - 1 - x]),
        a.push(e),
        m.text(a.join(" ").trim()),
        (m.node().getComputedTextLength() > t || e === "<br>") &&
          (a.pop(),
          m.text(a.join(" ").trim()),
          e === "<br>" ? (a = [""]) : (a = [e]),
          (m = r
            .append("tspan")
            .attr("x", 0)
            .attr("y", l)
            .attr("dy", o + "em")
            .text(e))));
  });
}
c(ot, "wrap");
var re = c(function (n, t, r, i, e, a = !1) {
    var k, u, _, b, R, F;
    const { theme: o, look: l } = i,
      f = o == null ? void 0 : o.includes("redux"),
      m = (u = (k = i == null ? void 0 : i.themeVariables) == null ? void 0 : k.THEME_COLOR_LIMIT) != null ? u : 12,
      x = (r % m) - 1,
      y = n.append("g");
    ((t.section = x), y.attr("class", (t.class ? t.class + " " : "") + "timeline-node " + ("section-" + x)));
    const g = y.append("g"),
      s = y.append("g"),
      d = s
        .append("text")
        .text(t.descr)
        .attr("dy", "1em")
        .attr("alignment-baseline", "middle")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .call(ot, t.width)
        .node()
        .getBBox(),
      p = (_ = i.fontSize) != null && _.replace ? i.fontSize.replace("px", "") : i.fontSize;
    if (
      ((t.height = d.height + p * 1.1 * 0.5 + t.padding),
      (t.height = Math.max(t.height, t.maxHeight)),
      (t.width = t.width + 2 * t.padding),
      s.attr("transform", "translate(" + t.width / 2 + ", " + t.padding / 2 + ")"),
      f && s.attr("transform", `translate(${t.width / 2}, ${a ? t.padding / 2 + 3 : t.padding})`),
      ie(g, t, x, e, i),
      l === "neo" && (y.attr("data-look", "neo"), f))
    ) {
      const W = o.includes("dark"),
        z = (R = (b = n.node()) == null ? void 0 : b.ownerSVGElement) != null ? R : n.node(),
        H = Q(z),
        v = (F = H.attr("id")) != null ? F : "",
        $ = v ? `${v}-drop-shadow` : "drop-shadow";
      if (H.select(`#${$}`).empty()) {
        const P = H.select("defs");
        (P.empty() ? H.append("defs") : P)
          .append("filter")
          .attr("id", $)
          .attr("height", "130%")
          .attr("width", "130%")
          .append("feDropShadow")
          .attr("dx", "4")
          .attr("dy", "4")
          .attr("stdDeviation", 0)
          .attr("flood-opacity", W ? "0.2" : "0.06")
          .attr("flood-color", W ? "#FFFFFF" : "#000000");
      }
    }
    return t;
  }, "drawNode"),
  se = c(function (n, t, r) {
    var l;
    const i = n.append("g"),
      a = i
        .append("text")
        .text(t.descr)
        .attr("dy", "1em")
        .attr("alignment-baseline", "middle")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .call(ot, t.width)
        .node()
        .getBBox(),
      o = (l = r.fontSize) != null && l.replace ? r.fontSize.replace("px", "") : r.fontSize;
    return (i.remove(), a.height + o * 1.1 * 0.5 + t.padding);
  }, "getVirtualNodeHeight"),
  ie = c(function (n, t, r, i, e) {
    const { theme: a } = e,
      o = a != null && a.includes("redux") ? 0 : 5,
      l = 5,
      f =
        o > 0
          ? `M0 ${t.height - l} v${-t.height + 2 * l} q0,-${o},${o},-${o} h${t.width - 2 * l} q${o},0,${o},${o} v${t.height - l} H0 Z`
          : `M0 ${t.height - l} v${-(t.height - l)} h${t.width} v${t.height} H0 Z`;
    (n
      .append("path")
      .attr("id", i + "-node-" + Lt++)
      .attr("class", "node-bkg node-" + t.type)
      .attr("d", f),
      (a != null && a.includes("redux")) ||
        n
          .append("line")
          .attr("class", "node-line-" + r)
          .attr("x1", 0)
          .attr("y1", t.height)
          .attr("x2", t.width)
          .attr("y2", t.height));
  }, "defaultBkg"),
  C = {
    drawRect: j,
    drawCircle: Qt,
    drawSection: jt,
    drawText: Mt,
    drawLabel: Jt,
    drawTask: Yt,
    drawBackgroundRect: te,
    getTextObj: ee,
    getNoteRect: at,
    initGraphics: ne,
    drawNode: re,
    getVirtualNodeHeight: se,
  },
  ae = c(function (n, t, r, i) {
    var U, K, N, B, M, O;
    const e = mt(),
      { look: a, theme: o, themeVariables: l } = e,
      { useGradient: f, gradientStart: m, gradientStop: x } = l,
      y = (K = (U = e.timeline) == null ? void 0 : U.leftMargin) != null ? K : 50;
    w.debug("timeline", i.db);
    const g = e.securityLevel;
    let s;
    g === "sandbox" && (s = Q("#i" + t));
    const d = (g === "sandbox" ? Q(s.nodes()[0].contentDocument.body) : Q("body")).select("#" + t);
    d.append("g");
    const p = i.db.getTasks(),
      k = i.db.getCommonDb().getDiagramTitle();
    (w.debug("task", p), C.initGraphics(d, t));
    const u = i.db.getSections();
    w.debug("sections", u);
    let _ = 0,
      b = 0,
      R = 0,
      F = 0,
      W = 50 + y,
      z = 50;
    F = 50;
    let H = 0,
      v = !0;
    u.forEach(function (L) {
      const E = { number: H, descr: L, section: H, width: 150, padding: 20, maxHeight: _ },
        S = C.getVirtualNodeHeight(d, E, e);
      (w.debug("sectionHeight before draw", S), (_ = Math.max(_, S + 20)));
    });
    let $ = 0,
      P = 0;
    w.debug("tasks.length", p.length);
    for (const [L, E] of p.entries()) {
      const S = { number: L, descr: E, section: E.section, width: 150, padding: 20, maxHeight: b },
        I = C.getVirtualNodeHeight(d, S, e);
      (w.debug("taskHeight before draw", I), (b = Math.max(b, I + 20)), ($ = Math.max($, E.events.length)));
      let A = 0;
      for (const V of E.events) {
        const T = { descr: V, section: E.section, number: E.section, width: 150, padding: 20, maxHeight: 50 };
        A += C.getVirtualNodeHeight(d, T, e);
      }
      (E.events.length > 0 && (A += (E.events.length - 1) * 10), (P = Math.max(P, A)));
    }
    (w.debug("maxSectionHeight before draw", _),
      w.debug("maxTaskHeight before draw", b),
      u && u.length > 0
        ? u.forEach((L) => {
            const E = p.filter((V) => V.section === L),
              S = {
                number: H,
                descr: L,
                section: H,
                width: 200 * Math.max(E.length, 1) - 50,
                padding: 20,
                maxHeight: _,
              };
            w.debug("sectionNode", S);
            const I = d.append("g"),
              A = C.drawNode(I, S, H, e, t);
            (w.debug("sectionNode output", A),
              I.attr("transform", `translate(${W}, ${F})`),
              (z += _ + 50),
              E.length > 0 && ut(d, E, H, W, z, b, e, $, P, _, !1, t),
              (W += 200 * Math.max(E.length, 1)),
              (z = F),
              H++);
          })
        : ((v = !1), ut(d, p, H, W, z, b, e, $, P, _, !0, t)));
    const G = d.node().getBBox();
    if (
      (w.debug("bounds", G),
      k &&
        d
          .append("text")
          .text(k)
          .attr("x", a === "neo" ? G.x * 2 + y : G.width / 2 - y)
          .attr("font-size", "4ex")
          .attr("font-weight", "bold")
          .attr("y", 20),
      (R = v ? _ + b + 150 : b + 100),
      d
        .append("g")
        .attr("class", "lineWrapper")
        .append("line")
        .attr("x1", y)
        .attr("y1", R)
        .attr("x2", G.width + 3 * y)
        .attr("y2", R)
        .attr("stroke-width", 4)
        .attr("stroke", "black")
        .attr("marker-end", `url(#${t}-arrowhead)`),
      a === "neo" && f && o !== "neutral")
    ) {
      const L = d.select("defs"),
        S = (L.empty() ? d.append("defs") : L)
          .append("linearGradient")
          .attr("id", d.attr("id") + "-gradient")
          .attr("gradientUnits", "objectBoundingBox")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");
      (S.append("stop").attr("offset", "0%").attr("stop-color", m).attr("stop-opacity", 1),
        S.append("stop").attr("offset", "100%").attr("stop-color", x).attr("stop-opacity", 1));
    }
    xt(
      void 0,
      d,
      (B = (N = e.timeline) == null ? void 0 : N.padding) != null ? B : 50,
      (O = (M = e.timeline) == null ? void 0 : M.useMaxWidth) != null ? O : !1,
    );
  }, "draw"),
  ut = c(function (n, t, r, i, e, a, o, l, f, m, x, y) {
    var g;
    for (const s of t) {
      const h = { descr: s.task, section: r, number: r, width: 150, padding: 20, maxHeight: a };
      w.debug("taskNode", h);
      const d = n.append("g").attr("class", "taskWrapper"),
        k = C.drawNode(d, h, r, o, y).height;
      if (
        (w.debug("taskHeight after draw", k),
        d.attr("transform", `translate(${i}, ${e})`),
        (a = Math.max(a, k)),
        s.events)
      ) {
        const u = n.append("g").attr("class", "lineWrapper");
        let _ = a;
        ((e += 100),
          (_ = _ + oe(n, s.events, r, i, e, o, y)),
          (e -= 100),
          u
            .append("line")
            .attr("x1", i + 190 / 2)
            .attr("y1", e + a)
            .attr("x2", i + 190 / 2)
            .attr("y2", e + a + 100 + f + 100)
            .attr("stroke-width", 2)
            .attr("stroke", "black")
            .attr("marker-end", `url(#${y}-arrowhead)`)
            .attr("stroke-dasharray", "5,5"));
      }
      ((i = i + 200), x && !((g = o.timeline) != null && g.disableMulticolor) && r++);
    }
    e = e - 10;
  }, "drawTasks"),
  oe = c(function (n, t, r, i, e, a, o) {
    let l = 0;
    const f = e;
    e = e + 100;
    for (const m of t) {
      const x = { descr: m, section: r, number: r, width: 150, padding: 20, maxHeight: 50 };
      w.debug("eventNode", x);
      const y = n.append("g").attr("class", "eventWrapper"),
        s = C.drawNode(y, x, r, a, o, !0).height;
      ((l = l + s), y.attr("transform", `translate(${i}, ${e})`), (e = e + 10 + s));
    }
    return ((e = f), l);
  }, "drawEvents"),
  le = { setConf: c(() => {}, "setConf"), draw: ae },
  Y = 200,
  D = 5,
  ce = Y + D * 2,
  lt = Y + 100,
  de = lt + D * 2,
  Rt = 10,
  he = 0,
  pt = 20,
  Ct = 20,
  gt = 30,
  Wt = 50,
  ue = c(function (n, t, r, i) {
    var U, K, N, B, M, O, L, E;
    const e = mt(),
      a = (K = (U = e.timeline) == null ? void 0 : U.leftMargin) != null ? K : 50;
    w.debug("timeline", i.db);
    const o = zt(t);
    o.append("g");
    const l = i.db.getTasks(),
      f = i.db.getCommonDb().getDiagramTitle();
    (w.debug("task", l), C.initGraphics(o));
    const m = i.db.getSections();
    w.debug("sections", m);
    let x = 0,
      y = 0;
    const g = 50 + a;
    let s = 50;
    const h = s,
      d = g,
      p = ce + Ct,
      k = de + Wt,
      u = d + p;
    let _ = 0;
    const b = m && m.length > 0,
      R = b ? u : g + p,
      F = Math.max(50, p + k - D * 2);
    m.forEach(function (S) {
      const I = { number: _, descr: S, section: _, width: F, padding: D, maxHeight: x },
        A = C.getVirtualNodeHeight(o, I, e);
      (w.debug("sectionHeight before draw", A), (x = Math.max(x, A)));
    });
    let W = 0;
    w.debug("tasks.length", l.length);
    for (const [S, I] of l.entries()) {
      const A = { number: S, descr: I, section: I.section, width: Y, padding: D, maxHeight: y },
        V = C.getVirtualNodeHeight(o, A, e);
      (w.debug("taskHeight before draw", V), (y = Math.max(y, V)));
      let T = 0;
      for (const tt of I.events) {
        const et = { descr: tt, section: I.section, number: I.section, width: lt, padding: D, maxHeight: 50 };
        T += C.getVirtualNodeHeight(o, et, e);
      }
      (I.events.length > 0 && (T += (I.events.length - 1) * Rt), (W = Math.max(W, T) + he));
    }
    (w.debug("maxSectionHeight before draw", x), w.debug("maxTaskHeight before draw", y));
    const H = Math.max(y, W) + gt;
    b
      ? m.forEach((S) => {
          const I = l.filter((Bt) => Bt.section === S),
            A = { number: _, descr: S, section: _, width: F, padding: D, maxHeight: x };
          w.debug("sectionNode", A);
          const V = o.append("g"),
            T = C.drawNode(V, A, _, e);
          w.debug("sectionNode output", T);
          const tt = R - p;
          V.attr("transform", `translate(${tt}, ${s})`);
          const et = s + T.height + pt;
          I.length > 0 && ft(o, I, _, R, et, y, e, H, !1);
          const ct = I.length,
            Pt = T.height + pt + H * Math.max(ct, 1) - (ct > 0 ? gt * 2 : 0);
          ((s += Pt), _++);
        })
      : ft(o, l, _, R, s, y, e, H, !0);
    let v = (N = o.node()) == null ? void 0 : N.getBBox();
    if (!v) throw new Error("bbox not found");
    if ((w.debug("bounds", v), f)) {
      if (
        (o
          .append("text")
          .text(f)
          .attr("x", v.width / 2 - a)
          .attr("font-size", "4ex")
          .attr("font-weight", "bold")
          .attr("y", 20),
        (v = (B = o.node()) == null ? void 0 : B.getBBox()),
        !v)
      )
        throw new Error("bbox not found");
      w.debug("bounds after title", v);
    }
    const [$] = Ot(e.fontSize),
      P = ($ != null ? $ : 16) * 2,
      G = ($ != null ? $ : 16) * 0.5 + 20,
      q = o.append("g").attr("class", "lineWrapper");
    (q
      .append("line")
      .attr("x1", R)
      .attr("y1", h - P)
      .attr("x2", R)
      .attr("y2", v.y + v.height + G)
      .attr("stroke-width", 4)
      .attr("stroke", "black")
      .attr("marker-end", "url(#arrowhead)"),
      q.lower(),
      xt(
        void 0,
        o,
        (O = (M = e.timeline) == null ? void 0 : M.padding) != null ? O : 50,
        (E = (L = e.timeline) == null ? void 0 : L.useMaxWidth) != null ? E : !1,
      ));
  }, "draw"),
  ft = c(function (n, t, r, i, e, a, o, l, f) {
    var m;
    for (const x of t) {
      const y = { descr: x.task, section: r, number: r, width: Y, padding: D, maxHeight: a };
      w.debug("taskNode", y);
      const g = n.append("g").attr("class", "taskWrapper"),
        s = C.drawNode(g, y, r, o),
        h = s.height;
      w.debug("taskHeight after draw", h);
      const d = i - Ct - s.width;
      if ((g.attr("transform", `translate(${d}, ${e})`), (a = Math.max(a, h)), x.events && x.events.length > 0)) {
        const p = e,
          k = i + Wt;
        pe(n, x.events, r, i, k, p, o);
      }
      ((e = e + l), f && !((m = o.timeline) != null && m.disableMulticolor) && r++);
    }
  }, "drawTasks"),
  pe = c(function (n, t, r, i, e, a, o) {
    let l = a;
    for (const f of t) {
      const m = { descr: f, section: r, number: r, width: lt, padding: D, maxHeight: 0 };
      w.debug("eventNode", m);
      const x = n.append("g").attr("class", "eventWrapper"),
        g = C.drawNode(x, m, r, o).height;
      x.attr("transform", `translate(${e}, ${l})`);
      const s = n.append("g").attr("class", "lineWrapper"),
        h = l + g / 2;
      (s
        .append("line")
        .attr("x1", i)
        .attr("y1", h)
        .attr("x2", e)
        .attr("y2", h)
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .attr("marker-end", "url(#arrowhead)")
        .attr("stroke-dasharray", "5,5"),
        (l = l + g + Rt));
    }
    return l - a;
  }, "drawEvents"),
  ge = { setConf: c(() => {}, "setConf"), draw: ue },
  fe = c((n) => {
    var l, f, m, x, y;
    const { theme: t } = yt(),
      r = t == null ? void 0 : t.includes("dark"),
      i = t == null ? void 0 : t.includes("color"),
      e = (f = (l = n.svgId) == null ? void 0 : l.replace(/^#/, "")) != null ? f : "",
      a = e ? `url(#${e}-drop-shadow)` : (m = n.dropShadow) != null ? m : "none";
    let o = "";
    for (let g = 0; g < n.THEME_COLOR_LIMIT; g++) {
      const s = `${17 - 3 * g}`,
        h = i ? n.borderColorArray[g] : n.mainBkg,
        d = i ? n.borderColorArray[g] : n.nodeBorder;
      o += `
    .section-${g - 1} rect,
    .section-${g - 1} path,
    .section-${g - 1} circle {
      fill: ${r && i ? n.mainBkg : h};
      stroke: ${d};
      stroke-width: ${n.strokeWidth};
      filter: ${a};
    }

    .section-${g - 1} text {
      fill: ${n.nodeBorder};
      font-weight: ${n.fontWeight}
    }

    .node-icon-${g - 1} {
      font-size: 40px;
      color: ${n["cScaleLabel" + g]};
    }

    .section-edge-${g - 1} {
      stroke: ${n["cScale" + g]};
    }

    .edge-depth-${g - 1} {
      stroke-width: ${s};
    }

    .section-${g - 1} line {
      stroke: ${n["cScaleInv" + g]};
      stroke-width: 3;
    }

    .lineWrapper line {
      stroke: ${n.nodeBorder};
      stroke-width:${n.strokeWidth}
    }

    .disabled,
    .disabled circle,
    .disabled text {
      fill: ${(x = n.tertiaryColor) != null ? x : "lightgray"};
    }

    .disabled text {
      fill: ${(y = n.clusterBorder) != null ? y : "#efefef"};
    }
    `;
    }
    return o;
  }, "genReduxSections"),
  ye = c((n) => {
    var r, i;
    let t = "";
    for (let e = 0; e < n.THEME_COLOR_LIMIT; e++)
      ((n["lineColor" + e] = n["lineColor" + e] || n["cScaleInv" + e]),
        Vt(n["lineColor" + e])
          ? (n["lineColor" + e] = Ft(n["lineColor" + e], 20))
          : (n["lineColor" + e] = Gt(n["lineColor" + e], 20)));
    for (let e = 0; e < n.THEME_COLOR_LIMIT; e++) {
      const a = "" + (17 - 3 * e);
      t += `
    .section-${e - 1} rect, .section-${e - 1} path, .section-${e - 1} circle, .section-${e - 1} path  {
      fill: ${n["cScale" + e]};
    }
    .section-${e - 1} text {
     fill: ${n["cScaleLabel" + e]};
    }
    .node-icon-${e - 1} {
      font-size: 40px;
      color: ${n["cScaleLabel" + e]};
    }
    .section-edge-${e - 1}{
      stroke: ${n["cScale" + e]};
    }
    .edge-depth-${e - 1}{
      stroke-width: ${a};
    }
    .section-${e - 1} line {
      stroke: ${n["cScaleInv" + e]} ;
      stroke-width: 3;
    }

    .lineWrapper line{
      stroke: ${n["cScaleLabel" + e]} ;
    }

    .disabled, .disabled circle, .disabled text {
      fill: ${(r = n.tertiaryColor) != null ? r : "lightgray"};
    }
    .disabled text {
      fill: ${(i = n.clusterBorder) != null ? i : "#efefef"};
    }
    `;
    }
    return t;
  }, "genSections"),
  me = c((n) => {
    var o, l;
    const { theme: t } = yt(),
      r = t == null ? void 0 : t.includes("redux"),
      i = t === "neutral",
      e = (l = (o = n.svgId) == null ? void 0 : o.replace(/^#/, "")) != null ? l : "";
    let a = "";
    if (n.useGradient && e && n.THEME_COLOR_LIMIT && !i)
      for (let f = 0; f < n.THEME_COLOR_LIMIT; f++)
        a += `
      .section-${f - 1}[data-look="neo"] rect,
      .section-${f - 1}[data-look="neo"] path,
      .section-${f - 1}[data-look="neo"] circle {
        fill: ${n.mainBkg};
        stroke: url(#${e}-gradient);
        stroke-width: 2;
      }
      .section-${f - 1}[data-look="neo"] line {
        stroke: url(#${e}-gradient);
        stroke-width: 2;
      }`;
    return `
  .edge {
    stroke-width: 3;
  }
  ${r ? fe(n) : ye(n)}
  ${a}
  .section-root rect, .section-root path, .section-root circle  {
    fill: ${n.git0};
  }
  .section-root text {
    fill: ${n.gitBranchLabel0};
  }
  .icon-container {
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .edge {
    fill: none;
  }
  .eventWrapper  {
   filter: brightness(120%);
  }
`;
  }, "getStyles"),
  xe = me,
  ke = {
    setConf: c(() => {}, "setConf"),
    draw: c((n, t, r, i) => {
      var a, o, l;
      return ((l =
        (o = (a = i == null ? void 0 : i.db) == null ? void 0 : a.getDirection) == null ? void 0 : o.call(a)) != null
        ? l
        : "LR") === "TD"
        ? ge.draw(n, t, r, i)
        : le.draw(n, t, r, i);
    }, "draw"),
  },
  _e = { db: kt, renderer: ke, parser: Xt, styles: xe };
export { _e as diagram };
