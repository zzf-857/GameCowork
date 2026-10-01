import { g as ae } from "./chunk-XXDRQBXY-BRnzwzQF.js";
import { s as oe } from "./chunk-POPQ4Y6H-s3peuQj9.js";
import {
  _ as h,
  l as A,
  z as ce,
  A as le,
  D as he,
  G as z,
  d as U,
  k as H,
  ak as de,
  al as ge,
  a0 as ue,
  a1 as pe,
  a2 as fe,
} from "./registry-CHHSpXp3.js";
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
  t.SENTRY_RELEASE = { id: "a9a604ff7ed4f880dc7535e2471d79d2388dc4a0" };
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
      e = new t.Error().stack;
    e &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[e] = "70647124-58b8-4412-8017-15b3390dbd57"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-70647124-58b8-4412-8017-15b3390dbd57"));
  })();
} catch {}
var J = (function () {
  var t = h(function (O, s, i, a) {
      for (i = i || {}, a = O.length; a--; i[O[a]] = s);
      return i;
    }, "o"),
    e = [1, 4],
    o = [1, 13],
    d = [1, 12],
    l = [1, 15],
    n = [1, 16],
    u = [1, 20],
    b = [1, 19],
    _ = [6, 7, 8],
    E = [1, 26],
    L = [1, 24],
    x = [1, 25],
    f = [6, 7, 11],
    D = [1, 6, 13, 15, 16, 19, 22],
    B = [1, 33],
    P = [1, 34],
    y = [1, 6, 7, 11, 13, 15, 16, 19, 22],
    w = {
      trace: h(function () {}, "trace"),
      yy: {},
      symbols_: {
        error: 2,
        start: 3,
        mindMap: 4,
        spaceLines: 5,
        SPACELINE: 6,
        NL: 7,
        MINDMAP: 8,
        document: 9,
        stop: 10,
        EOF: 11,
        statement: 12,
        SPACELIST: 13,
        node: 14,
        ICON: 15,
        CLASS: 16,
        nodeWithId: 17,
        nodeWithoutId: 18,
        NODE_DSTART: 19,
        NODE_DESCR: 20,
        NODE_DEND: 21,
        NODE_ID: 22,
        $accept: 0,
        $end: 1,
      },
      terminals_: {
        2: "error",
        6: "SPACELINE",
        7: "NL",
        8: "MINDMAP",
        11: "EOF",
        13: "SPACELIST",
        15: "ICON",
        16: "CLASS",
        19: "NODE_DSTART",
        20: "NODE_DESCR",
        21: "NODE_DEND",
        22: "NODE_ID",
      },
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
        [12, 2],
        [12, 2],
        [12, 1],
        [12, 1],
        [12, 1],
        [12, 1],
        [12, 1],
        [14, 1],
        [14, 1],
        [18, 3],
        [17, 1],
        [17, 4],
      ],
      performAction: h(function (s, i, a, c, p, r, M) {
        var g = r.length - 1;
        switch (p) {
          case 6:
          case 7:
            return c;
          case 8:
            c.getLogger().trace("Stop NL ");
            break;
          case 9:
            c.getLogger().trace("Stop EOF ");
            break;
          case 11:
            c.getLogger().trace("Stop NL2 ");
            break;
          case 12:
            c.getLogger().trace("Stop EOF2 ");
            break;
          case 15:
            (c.getLogger().info("Node: ", r[g].id), c.addNode(r[g - 1].length, r[g].id, r[g].descr, r[g].type));
            break;
          case 16:
            (c.getLogger().trace("Icon: ", r[g]), c.decorateNode({ icon: r[g] }));
            break;
          case 17:
          case 21:
            c.decorateNode({ class: r[g] });
            break;
          case 18:
            c.getLogger().trace("SPACELIST");
            break;
          case 19:
            (c.getLogger().trace("Node: ", r[g].id), c.addNode(0, r[g].id, r[g].descr, r[g].type));
            break;
          case 20:
            c.decorateNode({ icon: r[g] });
            break;
          case 25:
            (c.getLogger().trace("node found ..", r[g - 2]),
              (this.$ = { id: r[g - 1], descr: r[g - 1], type: c.getType(r[g - 2], r[g]) }));
            break;
          case 26:
            this.$ = { id: r[g], descr: r[g], type: c.nodeType.DEFAULT };
            break;
          case 27:
            (c.getLogger().trace("node found ..", r[g - 3]),
              (this.$ = { id: r[g - 3], descr: r[g - 1], type: c.getType(r[g - 2], r[g]) }));
            break;
        }
      }, "anonymous"),
      table: [
        { 3: 1, 4: 2, 5: 3, 6: [1, 5], 8: e },
        { 1: [3] },
        { 1: [2, 1] },
        { 4: 6, 6: [1, 7], 7: [1, 8], 8: e },
        { 6: o, 7: [1, 10], 9: 9, 12: 11, 13: d, 14: 14, 15: l, 16: n, 17: 17, 18: 18, 19: u, 22: b },
        t(_, [2, 3]),
        { 1: [2, 2] },
        t(_, [2, 4]),
        t(_, [2, 5]),
        { 1: [2, 6], 6: o, 12: 21, 13: d, 14: 14, 15: l, 16: n, 17: 17, 18: 18, 19: u, 22: b },
        { 6: o, 9: 22, 12: 11, 13: d, 14: 14, 15: l, 16: n, 17: 17, 18: 18, 19: u, 22: b },
        { 6: E, 7: L, 10: 23, 11: x },
        t(f, [2, 22], { 17: 17, 18: 18, 14: 27, 15: [1, 28], 16: [1, 29], 19: u, 22: b }),
        t(f, [2, 18]),
        t(f, [2, 19]),
        t(f, [2, 20]),
        t(f, [2, 21]),
        t(f, [2, 23]),
        t(f, [2, 24]),
        t(f, [2, 26], { 19: [1, 30] }),
        { 20: [1, 31] },
        { 6: E, 7: L, 10: 32, 11: x },
        { 1: [2, 7], 6: o, 12: 21, 13: d, 14: 14, 15: l, 16: n, 17: 17, 18: 18, 19: u, 22: b },
        t(D, [2, 14], { 7: B, 11: P }),
        t(y, [2, 8]),
        t(y, [2, 9]),
        t(y, [2, 10]),
        t(f, [2, 15]),
        t(f, [2, 16]),
        t(f, [2, 17]),
        { 20: [1, 35] },
        { 21: [1, 36] },
        t(D, [2, 13], { 7: B, 11: P }),
        t(y, [2, 11]),
        t(y, [2, 12]),
        { 21: [1, 37] },
        t(f, [2, 25]),
        t(f, [2, 27]),
      ],
      defaultActions: { 2: [2, 1], 6: [2, 2] },
      parseError: h(function (s, i) {
        if (i.recoverable) this.trace(s);
        else {
          var a = new Error(s);
          throw ((a.hash = i), a);
        }
      }, "parseError"),
      parse: h(function (s) {
        var i = this,
          a = [0],
          c = [],
          p = [null],
          r = [],
          M = this.table,
          g = "",
          F = 0,
          K = 0,
          ne = 2,
          Q = 1,
          ie = r.slice.call(arguments, 1),
          m = Object.create(this.lexer),
          I = { yy: {} };
        for (var W in this.yy) Object.prototype.hasOwnProperty.call(this.yy, W) && (I.yy[W] = this.yy[W]);
        (m.setInput(s, I.yy), (I.yy.lexer = m), (I.yy.parser = this), typeof m.yylloc > "u" && (m.yylloc = {}));
        var X = m.yylloc;
        r.push(X);
        var se = m.options && m.options.ranges;
        typeof I.yy.parseError == "function"
          ? (this.parseError = I.yy.parseError)
          : (this.parseError = Object.getPrototypeOf(this).parseError);
        function re(S) {
          ((a.length = a.length - 2 * S), (p.length = p.length - S), (r.length = r.length - S));
        }
        h(re, "popStack");
        function Z() {
          var S;
          return (
            (S = c.pop() || m.lex() || Q),
            typeof S != "number" && (S instanceof Array && ((c = S), (S = c.pop())), (S = i.symbols_[S] || S)),
            S
          );
        }
        h(Z, "lex");
        for (var k, C, N, Y, R = {}, G, v, ee, j; ;) {
          if (
            ((C = a[a.length - 1]),
            this.defaultActions[C]
              ? (N = this.defaultActions[C])
              : ((k === null || typeof k > "u") && (k = Z()), (N = M[C] && M[C][k])),
            typeof N > "u" || !N.length || !N[0])
          ) {
            var q = "";
            j = [];
            for (G in M[C]) this.terminals_[G] && G > ne && j.push("'" + this.terminals_[G] + "'");
            (m.showPosition
              ? (q =
                  "Parse error on line " +
                  (F + 1) +
                  `:
` +
                  m.showPosition() +
                  `
Expecting ` +
                  j.join(", ") +
                  ", got '" +
                  (this.terminals_[k] || k) +
                  "'")
              : (q =
                  "Parse error on line " +
                  (F + 1) +
                  ": Unexpected " +
                  (k == Q ? "end of input" : "'" + (this.terminals_[k] || k) + "'")),
              this.parseError(q, {
                text: m.match,
                token: this.terminals_[k] || k,
                line: m.yylineno,
                loc: X,
                expected: j,
              }));
          }
          if (N[0] instanceof Array && N.length > 1)
            throw new Error("Parse Error: multiple actions possible at state: " + C + ", token: " + k);
          switch (N[0]) {
            case 1:
              (a.push(k),
                p.push(m.yytext),
                r.push(m.yylloc),
                a.push(N[1]),
                (k = null),
                (K = m.yyleng),
                (g = m.yytext),
                (F = m.yylineno),
                (X = m.yylloc));
              break;
            case 2:
              if (
                ((v = this.productions_[N[1]][1]),
                (R.$ = p[p.length - v]),
                (R._$ = {
                  first_line: r[r.length - (v || 1)].first_line,
                  last_line: r[r.length - 1].last_line,
                  first_column: r[r.length - (v || 1)].first_column,
                  last_column: r[r.length - 1].last_column,
                }),
                se && (R._$.range = [r[r.length - (v || 1)].range[0], r[r.length - 1].range[1]]),
                (Y = this.performAction.apply(R, [g, K, F, I.yy, N[1], p, r].concat(ie))),
                typeof Y < "u")
              )
                return Y;
              (v && ((a = a.slice(0, -1 * v * 2)), (p = p.slice(0, -1 * v)), (r = r.slice(0, -1 * v))),
                a.push(this.productions_[N[1]][0]),
                p.push(R.$),
                r.push(R._$),
                (ee = M[a[a.length - 2]][a[a.length - 1]]),
                a.push(ee));
              break;
            case 3:
              return !0;
          }
        }
        return !0;
      }, "parse"),
    },
    te = (function () {
      var O = {
        EOF: 1,
        parseError: h(function (i, a) {
          if (this.yy.parser) this.yy.parser.parseError(i, a);
          else throw new Error(i);
        }, "parseError"),
        setInput: h(function (s, i) {
          return (
            (this.yy = i || this.yy || {}),
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
        input: h(function () {
          var s = this._input[0];
          ((this.yytext += s), this.yyleng++, this.offset++, (this.match += s), (this.matched += s));
          var i = s.match(/(?:\r\n?|\n).*/g);
          return (
            i ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++,
            this.options.ranges && this.yylloc.range[1]++,
            (this._input = this._input.slice(1)),
            s
          );
        }, "input"),
        unput: h(function (s) {
          var i = s.length,
            a = s.split(/(?:\r\n?|\n)/g);
          ((this._input = s + this._input),
            (this.yytext = this.yytext.substr(0, this.yytext.length - i)),
            (this.offset -= i));
          var c = this.match.split(/(?:\r\n?|\n)/g);
          ((this.match = this.match.substr(0, this.match.length - 1)),
            (this.matched = this.matched.substr(0, this.matched.length - 1)),
            a.length - 1 && (this.yylineno -= a.length - 1));
          var p = this.yylloc.range;
          return (
            (this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: a
                ? (a.length === c.length ? this.yylloc.first_column : 0) + c[c.length - a.length].length - a[0].length
                : this.yylloc.first_column - i,
            }),
            this.options.ranges && (this.yylloc.range = [p[0], p[0] + this.yyleng - i]),
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
        less: h(function (s) {
          this.unput(this.match.slice(s));
        }, "less"),
        pastInput: h(function () {
          var s = this.matched.substr(0, this.matched.length - this.match.length);
          return (s.length > 20 ? "..." : "") + s.substr(-20).replace(/\n/g, "");
        }, "pastInput"),
        upcomingInput: h(function () {
          var s = this.match;
          return (
            s.length < 20 && (s += this._input.substr(0, 20 - s.length)),
            (s.substr(0, 20) + (s.length > 20 ? "..." : "")).replace(/\n/g, "")
          );
        }, "upcomingInput"),
        showPosition: h(function () {
          var s = this.pastInput(),
            i = new Array(s.length + 1).join("-");
          return (
            s +
            this.upcomingInput() +
            `
` +
            i +
            "^"
          );
        }, "showPosition"),
        test_match: h(function (s, i) {
          var a, c, p;
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
            (c = s[0].match(/(?:\r\n?|\n).*/g)),
            c && (this.yylineno += c.length),
            (this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: c
                ? c[c.length - 1].length - c[c.length - 1].match(/\r?\n?/)[0].length
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
            (a = this.performAction.call(this, this.yy, this, i, this.conditionStack[this.conditionStack.length - 1])),
            this.done && this._input && (this.done = !1),
            a)
          )
            return a;
          if (this._backtrack) {
            for (var r in p) this[r] = p[r];
            return !1;
          }
          return !1;
        }, "test_match"),
        next: h(function () {
          if (this.done) return this.EOF;
          this._input || (this.done = !0);
          var s, i, a, c;
          this._more || ((this.yytext = ""), (this.match = ""));
          for (var p = this._currentRules(), r = 0; r < p.length; r++)
            if (((a = this._input.match(this.rules[p[r]])), a && (!i || a[0].length > i[0].length))) {
              if (((i = a), (c = r), this.options.backtrack_lexer)) {
                if (((s = this.test_match(a, p[r])), s !== !1)) return s;
                if (this._backtrack) {
                  i = !1;
                  continue;
                } else return !1;
              } else if (!this.options.flex) break;
            }
          return i
            ? ((s = this.test_match(i, p[c])), s !== !1 ? s : !1)
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
          var i = this.next();
          return i || this.lex();
        }, "lex"),
        begin: h(function (i) {
          this.conditionStack.push(i);
        }, "begin"),
        popState: h(function () {
          var i = this.conditionStack.length - 1;
          return i > 0 ? this.conditionStack.pop() : this.conditionStack[0];
        }, "popState"),
        _currentRules: h(function () {
          return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]
            ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
            : this.conditions.INITIAL.rules;
        }, "_currentRules"),
        topState: h(function (i) {
          return ((i = this.conditionStack.length - 1 - Math.abs(i || 0)), i >= 0 ? this.conditionStack[i] : "INITIAL");
        }, "topState"),
        pushState: h(function (i) {
          this.begin(i);
        }, "pushState"),
        stateStackSize: h(function () {
          return this.conditionStack.length;
        }, "stateStackSize"),
        options: { "case-insensitive": !0 },
        performAction: h(function (i, a, c, p) {
          switch (c) {
            case 0:
              return (i.getLogger().trace("Found comment", a.yytext), 6);
            case 1:
              return 8;
            case 2:
              this.begin("CLASS");
              break;
            case 3:
              return (this.popState(), 16);
            case 4:
              this.popState();
              break;
            case 5:
              (i.getLogger().trace("Begin icon"), this.begin("ICON"));
              break;
            case 6:
              return (i.getLogger().trace("SPACELINE"), 6);
            case 7:
              return 7;
            case 8:
              return 15;
            case 9:
              (i.getLogger().trace("end icon"), this.popState());
              break;
            case 10:
              return (i.getLogger().trace("Exploding node"), this.begin("NODE"), 19);
            case 11:
              return (i.getLogger().trace("Cloud"), this.begin("NODE"), 19);
            case 12:
              return (i.getLogger().trace("Explosion Bang"), this.begin("NODE"), 19);
            case 13:
              return (i.getLogger().trace("Cloud Bang"), this.begin("NODE"), 19);
            case 14:
              return (this.begin("NODE"), 19);
            case 15:
              return (this.begin("NODE"), 19);
            case 16:
              return (this.begin("NODE"), 19);
            case 17:
              return (this.begin("NODE"), 19);
            case 18:
              return 13;
            case 19:
              return 22;
            case 20:
              return 11;
            case 21:
              this.begin("NSTR2");
              break;
            case 22:
              return "NODE_DESCR";
            case 23:
              this.popState();
              break;
            case 24:
              (i.getLogger().trace("Starting NSTR"), this.begin("NSTR"));
              break;
            case 25:
              return (i.getLogger().trace("description:", a.yytext), "NODE_DESCR");
            case 26:
              this.popState();
              break;
            case 27:
              return (this.popState(), i.getLogger().trace("node end ))"), "NODE_DEND");
            case 28:
              return (this.popState(), i.getLogger().trace("node end )"), "NODE_DEND");
            case 29:
              return (this.popState(), i.getLogger().trace("node end ...", a.yytext), "NODE_DEND");
            case 30:
              return (this.popState(), i.getLogger().trace("node end (("), "NODE_DEND");
            case 31:
              return (this.popState(), i.getLogger().trace("node end (-"), "NODE_DEND");
            case 32:
              return (this.popState(), i.getLogger().trace("node end (-"), "NODE_DEND");
            case 33:
              return (this.popState(), i.getLogger().trace("node end (("), "NODE_DEND");
            case 34:
              return (this.popState(), i.getLogger().trace("node end (("), "NODE_DEND");
            case 35:
              return (i.getLogger().trace("Long description:", a.yytext), 20);
            case 36:
              return (i.getLogger().trace("Long description:", a.yytext), 20);
          }
        }, "anonymous"),
        rules: [
          /^(?:\s*%%.*)/i,
          /^(?:mindmap\b)/i,
          /^(?::::)/i,
          /^(?:.+)/i,
          /^(?:\n)/i,
          /^(?:::icon\()/i,
          /^(?:[\s]+[\n])/i,
          /^(?:[\n]+)/i,
          /^(?:[^\)]+)/i,
          /^(?:\))/i,
          /^(?:-\))/i,
          /^(?:\(-)/i,
          /^(?:\)\))/i,
          /^(?:\))/i,
          /^(?:\(\()/i,
          /^(?:\{\{)/i,
          /^(?:\()/i,
          /^(?:\[)/i,
          /^(?:[\s]+)/i,
          /^(?:[^\(\[\n\)\{\}]+)/i,
          /^(?:$)/i,
          /^(?:["][`])/i,
          /^(?:[^`"]+)/i,
          /^(?:[`]["])/i,
          /^(?:["])/i,
          /^(?:[^"]+)/i,
          /^(?:["])/i,
          /^(?:[\)]\))/i,
          /^(?:[\)])/i,
          /^(?:[\]])/i,
          /^(?:\}\})/i,
          /^(?:\(-)/i,
          /^(?:-\))/i,
          /^(?:\(\()/i,
          /^(?:\()/i,
          /^(?:[^\)\]\(\}]+)/i,
          /^(?:.+(?!\(\())/i,
        ],
        conditions: {
          CLASS: { rules: [3, 4], inclusive: !1 },
          ICON: { rules: [8, 9], inclusive: !1 },
          NSTR2: { rules: [22, 23], inclusive: !1 },
          NSTR: { rules: [25, 26], inclusive: !1 },
          NODE: { rules: [21, 24, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], inclusive: !1 },
          INITIAL: { rules: [0, 1, 2, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], inclusive: !0 },
        },
      };
      return O;
    })();
  w.lexer = te;
  function V() {
    this.yy = {};
  }
  return (h(V, "Parser"), (V.prototype = w), (w.Parser = V), new V());
})();
J.parser = J;
var ye = J,
  me = 12,
  T = { DEFAULT: 0, NO_BORDER: 0, ROUNDED_RECT: 1, RECT: 2, CIRCLE: 3, CLOUD: 4, BANG: 5, HEXAGON: 6 },
  $,
  be =
    (($ = class {
      constructor() {
        ((this.nodes = []),
          (this.count = 0),
          (this.elements = {}),
          (this.getLogger = this.getLogger.bind(this)),
          (this.nodeType = T),
          this.clear(),
          (this.getType = this.getType.bind(this)),
          (this.getElementById = this.getElementById.bind(this)),
          (this.getParent = this.getParent.bind(this)),
          (this.getMindmap = this.getMindmap.bind(this)),
          (this.addNode = this.addNode.bind(this)),
          (this.decorateNode = this.decorateNode.bind(this)));
      }
      clear() {
        ((this.nodes = []), (this.count = 0), (this.elements = {}), (this.baseLevel = void 0));
      }
      getParent(e) {
        for (let o = this.nodes.length - 1; o >= 0; o--) if (this.nodes[o].level < e) return this.nodes[o];
        return null;
      }
      getMindmap() {
        return this.nodes.length > 0 ? this.nodes[0] : null;
      }
      addNode(e, o, d, l) {
        var L, x, f, D;
        A.info("addNode", e, o, d, l);
        let n = !1;
        this.nodes.length === 0
          ? ((this.baseLevel = e), (e = 0), (n = !0))
          : this.baseLevel !== void 0 && ((e = e - this.baseLevel), (n = !1));
        const u = U();
        let b = (x = (L = u.mindmap) == null ? void 0 : L.padding) != null ? x : z.mindmap.padding;
        switch (l) {
          case this.nodeType.ROUNDED_RECT:
          case this.nodeType.RECT:
          case this.nodeType.HEXAGON:
            b *= 2;
            break;
        }
        const _ = {
            id: this.count++,
            nodeId: H(o, u),
            level: e,
            descr: H(d, u),
            type: l,
            children: [],
            width: (D = (f = u.mindmap) == null ? void 0 : f.maxNodeWidth) != null ? D : z.mindmap.maxNodeWidth,
            padding: b,
            isRoot: n,
          },
          E = this.getParent(e);
        if (E) (E.children.push(_), this.nodes.push(_));
        else if (n) this.nodes.push(_);
        else throw new Error(`There can be only one root. No parent could be found for ("${_.descr}")`);
      }
      getType(e, o) {
        switch ((A.debug("In get type", e, o), e)) {
          case "[":
            return this.nodeType.RECT;
          case "(":
            return o === ")" ? this.nodeType.ROUNDED_RECT : this.nodeType.CLOUD;
          case "((":
            return this.nodeType.CIRCLE;
          case ")":
            return this.nodeType.CLOUD;
          case "))":
            return this.nodeType.BANG;
          case "{{":
            return this.nodeType.HEXAGON;
          default:
            return this.nodeType.DEFAULT;
        }
      }
      setElementForId(e, o) {
        this.elements[e] = o;
      }
      getElementById(e) {
        return this.elements[e];
      }
      decorateNode(e) {
        if (!e) return;
        const o = U(),
          d = this.nodes[this.nodes.length - 1];
        (e.icon && (d.icon = H(e.icon, o)), e.class && (d.class = H(e.class, o)));
      }
      type2Str(e) {
        switch (e) {
          case this.nodeType.DEFAULT:
            return "no-border";
          case this.nodeType.RECT:
            return "rect";
          case this.nodeType.ROUNDED_RECT:
            return "rounded-rect";
          case this.nodeType.CIRCLE:
            return "circle";
          case this.nodeType.CLOUD:
            return "cloud";
          case this.nodeType.BANG:
            return "bang";
          case this.nodeType.HEXAGON:
            return "hexgon";
          default:
            return "no-border";
        }
      }
      assignSections(e, o) {
        if ((e.level === 0 ? (e.section = void 0) : (e.section = o), e.children))
          for (const [d, l] of e.children.entries()) {
            const n = e.level === 0 ? d % (me - 1) : o;
            this.assignSections(l, n);
          }
      }
      flattenNodes(e, o) {
        var _;
        const d = U(),
          l = ["mindmap-node"];
        (e.isRoot === !0
          ? l.push("section-root", "section--1")
          : e.section !== void 0 && l.push(`section-${e.section}`),
          e.class && l.push(e.class));
        const n = l.join(" "),
          u = h((E) => {
            var f, D;
            const x = ((D = (f = d.theme) == null ? void 0 : f.toLowerCase()) != null ? D : "").includes("redux");
            switch (E) {
              case T.CIRCLE:
                return "mindmapCircle";
              case T.RECT:
                return "rect";
              case T.ROUNDED_RECT:
                return "rounded";
              case T.CLOUD:
                return "cloud";
              case T.BANG:
                return "bang";
              case T.HEXAGON:
                return "hexagon";
              case T.DEFAULT:
                return x ? "rounded" : "defaultMindmapNode";
              case T.NO_BORDER:
              default:
                return "rect";
            }
          }, "getShapeFromType"),
          b = {
            id: e.id.toString(),
            domId: "node_" + e.id.toString(),
            label: e.descr,
            labelType: "markdown",
            isGroup: !1,
            shape: u(e.type),
            width: e.width,
            height: (_ = e.height) != null ? _ : 0,
            padding: e.padding,
            cssClasses: n,
            cssStyles: [],
            look: d.look,
            icon: e.icon,
            x: e.x,
            y: e.y,
            level: e.level,
            nodeId: e.nodeId,
            type: e.type,
            section: e.section,
          };
        if ((o.push(b), e.children)) for (const E of e.children) this.flattenNodes(E, o);
      }
      generateEdges(e, o) {
        if (!e.children) return;
        const d = U();
        for (const l of e.children) {
          let n = "edge";
          l.section !== void 0 && (n += ` section-edge-${l.section}`);
          const u = e.level + 1;
          n += ` edge-depth-${u}`;
          const b = {
            id: `edge_${e.id}_${l.id}`,
            start: e.id.toString(),
            end: l.id.toString(),
            type: "normal",
            curve: "basis",
            thickness: "normal",
            look: d.look,
            classes: n,
            depth: e.level,
            section: l.section,
          };
          (o.push(b), this.generateEdges(l, o));
        }
      }
      getData() {
        const e = this.getMindmap(),
          o = U(),
          l = de().layout !== void 0,
          n = o;
        if ((l || (n.layout = "cose-bilkent"), !e)) return { nodes: [], edges: [], config: n };
        (A.debug("getData: mindmapRoot", e, o), this.assignSections(e));
        const u = [],
          b = [];
        (this.flattenNodes(e, u),
          this.generateEdges(e, b),
          A.debug(`getData: processed ${u.length} nodes and ${b.length} edges`));
        const _ = new Map();
        for (const E of u) _.set(E.id, { shape: E.shape, width: E.width, height: E.height, padding: E.padding });
        return {
          nodes: u,
          edges: b,
          config: n,
          rootNode: e,
          markers: ["point"],
          direction: "TB",
          nodeSpacing: 50,
          rankSpacing: 50,
          shapes: Object.fromEntries(_),
          type: "mindmap",
          diagramId: "mindmap-" + ge(),
        };
      }
      getLogger() {
        return A;
      }
    }),
    h($, "MindmapDB"),
    $),
  Ee = h(async (t, e, o, d) => {
    var f, D, B, P;
    A.debug(
      `Rendering mindmap diagram
` + t,
    );
    const l = d.db,
      n = l.getData(),
      u = ae(e, n.config.securityLevel);
    if (
      ((n.type = d.type),
      (n.layoutAlgorithm = ce(n.config.layout, { fallback: "cose-bilkent" })),
      (n.diagramId = e),
      !l.getMindmap())
    )
      return;
    (n.nodes.forEach((y) => {
      y.shape === "rounded"
        ? ((y.radius = 15), (y.taper = 15), (y.stroke = "none"), (y.width = 0), (y.padding = 15))
        : y.shape === "circle"
          ? (y.padding = 10)
          : y.shape === "rect"
            ? ((y.width = 0), (y.padding = 10))
            : y.shape === "hexagon" && ((y.width = 0), (y.height = 0));
    }),
      await le(n, u));
    const { themeVariables: _ } = he(),
      { useGradient: E, gradientStart: L, gradientStop: x } = _;
    if (E && L && x) {
      const y = u.attr("id"),
        w = u
          .append("defs")
          .append("linearGradient")
          .attr("id", `${y}-gradient`)
          .attr("gradientUnits", "objectBoundingBox")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");
      (w.append("stop").attr("offset", "0%").attr("stop-color", L).attr("stop-opacity", 1),
        w.append("stop").attr("offset", "100%").attr("stop-color", x).attr("stop-opacity", 1));
    }
    oe(
      u,
      (D = (f = n.config.mindmap) == null ? void 0 : f.padding) != null ? D : z.mindmap.padding,
      "mindmapDiagram",
      (P = (B = n.config.mindmap) == null ? void 0 : B.useMaxWidth) != null ? P : z.mindmap.useMaxWidth,
    );
  }, "draw"),
  _e = { draw: Ee },
  ke = h((t) => {
    var l;
    const { theme: e, look: o } = t;
    let d = "";
    for (let n = 0; n < t.THEME_COLOR_LIMIT; n++)
      ((t["lineColor" + n] = t["lineColor" + n] || t["cScaleInv" + n]),
        ue(t["lineColor" + n])
          ? (t["lineColor" + n] = pe(t["lineColor" + n], 20))
          : (t["lineColor" + n] = fe(t["lineColor" + n], 20)));
    for (let n = 0; n < t.THEME_COLOR_LIMIT; n++) {
      const u = "" + (o === "neo" ? Math.max(10 - (n - 1) * 2, 2) : 17 - 3 * n);
      d += `
    .section-${n - 1} rect, .section-${n - 1} path, .section-${n - 1} circle, .section-${n - 1} polygon, .section-${n - 1} path  {
      fill: ${t["cScale" + n]};
    }
    .section-${n - 1} text {
     fill: ${t["cScaleLabel" + n]};
    }
     .section-${n - 1} span {
     color: ${t["cScaleLabel" + n]};
    }
    .node-icon-${n - 1} {
      font-size: 40px;
      color: ${t["cScaleLabel" + n]};
    }
    .section-edge-${n - 1}{
      stroke: ${t["cScale" + n]};
    }
    .edge-depth-${n - 1}{
      stroke-width: ${u};
    }
    .section-${n - 1} line {
      stroke: ${t["cScaleInv" + n]} ;
      stroke-width: 3;
    }

    .disabled, .disabled circle, .disabled text {
      fill: lightgray;
    }
    .disabled text {
      fill: #efefef;
    }
    [data-look="neo"].mindmap-node.section-${n - 1} rect, [data-look="neo"].mindmap-node.section-${n - 1} path, [data-look="neo"].mindmap-node.section-${n - 1} circle, [data-look="neo"].mindmap-node.section-${n - 1} polygon {
      fill: ${e === "redux" || e === "redux-dark" || e === "neutral" ? t.mainBkg : t["cScale" + n]};
      stroke: ${e === "redux" || e === "redux-dark" ? t.nodeBorder : t["cScale" + n]};
      stroke-width: ${(l = t.strokeWidth) != null ? l : 2}px;
    }
    [data-look="neo"].section-edge-${n - 1}{
      stroke: ${(e != null && e.includes("redux")) || e === "neo-dark" ? t.nodeBorder : t["cScale" + n]};
    }
    [data-look="neo"].mindmap-node.section-${n - 1} text {
     fill: ${e === "redux" || e === "redux-dark" ? t.nodeBorder : t["cScaleLabel" + (e === "neutral" ? 1 : n)]};
    }
    `;
    }
    return d;
  }, "genSections"),
  Se = h((t, e, o) => {
    let d = "";
    for (let l = 0; l < t; l++)
      d += `
    [data-look="neo"].mindmap-node.section-${l - 1} rect, [data-look="neo"].mindmap-node.section-${l - 1} path, [data-look="neo"].mindmap-node.section-${l - 1} circle, [data-look="neo"].mindmap-node.section-${l - 1} polygon {
      stroke: url(${e}-gradient);
      fill: ${o};
    }
    .section-${l - 1} line {
      stroke-width: 0;
    }`;
    return d;
  }, "genGradient"),
  Ne = h((t) => {
    const { theme: e } = t,
      o = t.svgId,
      d = t.dropShadow ? t.dropShadow.replace("url(#drop-shadow)", `url(${o}-drop-shadow)`) : "none";
    return `
  .edge {
    stroke-width: 3;
  }
  ${ke(t)}
  .section-root rect, .section-root path, .section-root circle, .section-root polygon  {
    fill: ${t.git0};
  }
  .section-root text {
    fill: ${t.gitBranchLabel0};
  }
  .section-root span {
    color: ${e != null && e.includes("redux") ? t.nodeBorder : t.gitBranchLabel0};
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
  .mindmap-node-label {
    dy: 1em;
    alignment-baseline: middle;
    text-anchor: middle;
    dominant-baseline: middle;
    text-align: center;
  }
  [data-look="neo"].mindmap-node  {
    filter: ${d};
  }
  [data-look="neo"].mindmap-node.section-root rect, [data-look="neo"].mindmap-node.section-root path, [data-look="neo"].mindmap-node.section-root circle, [data-look="neo"].mindmap-node.section-root polygon  {
    fill: ${e != null && e.includes("redux") ? t.mainBkg : t.git0};
  }
  [data-look="neo"].mindmap-node.section-root .text-inner-tspan {
    fill:  ${e != null && e.includes("redux") ? t.nodeBorder : t["cScaleLabel" + (e === "neutral" ? 1 : 0)]};
  }
  ${t.useGradient && o && t.mainBkg ? Se(t.THEME_COLOR_LIMIT, o, t.mainBkg) : ""}
`;
  }, "getStyles"),
  De = Ne,
  Te = {
    get db() {
      return new be();
    },
    renderer: _e,
    parser: ye,
    styles: De,
  };
export { Te as diagram };
