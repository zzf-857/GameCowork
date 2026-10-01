import { g as ae } from "./chunk-XXDRQBXY-BIM2G3fn.js";
import { s as oe } from "./chunk-POPQ4Y6H-C8aRCy1M.js";
import {
  _ as h,
  l as A,
  u as ce,
  v as le,
  y as he,
  B as W,
  c as U,
  i as H,
  af as de,
  ag as ge,
  V as ue,
  W as pe,
  X as fe,
} from "../index-DG7m4Xaq.js";
var J = (function () {
  var i = h(function (O, s, n, a) {
      for (n = n || {}, a = O.length; a--; n[O[a]] = s);
      return n;
    }, "o"),
    e = [1, 4],
    o = [1, 13],
    d = [1, 12],
    l = [1, 15],
    t = [1, 16],
    u = [1, 20],
    E = [1, 19],
    k = [6, 7, 8],
    _ = [1, 26],
    L = [1, 24],
    D = [1, 25],
    f = [6, 7, 11],
    x = [1, 6, 13, 15, 16, 19, 22],
    B = [1, 33],
    P = [1, 34],
    m = [1, 6, 7, 11, 13, 15, 16, 19, 22],
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
      performAction: h(function (s, n, a, c, p, r, M) {
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
        { 6: o, 7: [1, 10], 9: 9, 12: 11, 13: d, 14: 14, 15: l, 16: t, 17: 17, 18: 18, 19: u, 22: E },
        i(k, [2, 3]),
        { 1: [2, 2] },
        i(k, [2, 4]),
        i(k, [2, 5]),
        { 1: [2, 6], 6: o, 12: 21, 13: d, 14: 14, 15: l, 16: t, 17: 17, 18: 18, 19: u, 22: E },
        { 6: o, 9: 22, 12: 11, 13: d, 14: 14, 15: l, 16: t, 17: 17, 18: 18, 19: u, 22: E },
        { 6: _, 7: L, 10: 23, 11: D },
        i(f, [2, 22], { 17: 17, 18: 18, 14: 27, 15: [1, 28], 16: [1, 29], 19: u, 22: E }),
        i(f, [2, 18]),
        i(f, [2, 19]),
        i(f, [2, 20]),
        i(f, [2, 21]),
        i(f, [2, 23]),
        i(f, [2, 24]),
        i(f, [2, 26], { 19: [1, 30] }),
        { 20: [1, 31] },
        { 6: _, 7: L, 10: 32, 11: D },
        { 1: [2, 7], 6: o, 12: 21, 13: d, 14: 14, 15: l, 16: t, 17: 17, 18: 18, 19: u, 22: E },
        i(x, [2, 14], { 7: B, 11: P }),
        i(m, [2, 8]),
        i(m, [2, 9]),
        i(m, [2, 10]),
        i(f, [2, 15]),
        i(f, [2, 16]),
        i(f, [2, 17]),
        { 20: [1, 35] },
        { 21: [1, 36] },
        i(x, [2, 13], { 7: B, 11: P }),
        i(m, [2, 11]),
        i(m, [2, 12]),
        { 21: [1, 37] },
        i(f, [2, 25]),
        i(f, [2, 27]),
      ],
      defaultActions: { 2: [2, 1], 6: [2, 2] },
      parseError: h(function (s, n) {
        if (n.recoverable) this.trace(s);
        else {
          var a = new Error(s);
          throw ((a.hash = n), a);
        }
      }, "parseError"),
      parse: h(function (s) {
        var n = this,
          a = [0],
          c = [],
          p = [null],
          r = [],
          M = this.table,
          g = "",
          F = 0,
          K = 0,
          ie = 2,
          Q = 1,
          ne = r.slice.call(arguments, 1),
          y = Object.create(this.lexer),
          C = { yy: {} };
        for (var X in this.yy) Object.prototype.hasOwnProperty.call(this.yy, X) && (C.yy[X] = this.yy[X]);
        (y.setInput(s, C.yy), (C.yy.lexer = y), (C.yy.parser = this), typeof y.yylloc > "u" && (y.yylloc = {}));
        var z = y.yylloc;
        r.push(z);
        var se = y.options && y.options.ranges;
        typeof C.yy.parseError == "function"
          ? (this.parseError = C.yy.parseError)
          : (this.parseError = Object.getPrototypeOf(this).parseError);
        function re(S) {
          ((a.length = a.length - 2 * S), (p.length = p.length - S), (r.length = r.length - S));
        }
        h(re, "popStack");
        function Z() {
          var S;
          return (
            (S = c.pop() || y.lex() || Q),
            typeof S != "number" && (S instanceof Array && ((c = S), (S = c.pop())), (S = n.symbols_[S] || S)),
            S
          );
        }
        h(Z, "lex");
        for (var b, I, N, Y, R = {}, G, v, ee, j; ;) {
          if (
            ((I = a[a.length - 1]),
            this.defaultActions[I]
              ? (N = this.defaultActions[I])
              : ((b === null || typeof b > "u") && (b = Z()), (N = M[I] && M[I][b])),
            typeof N > "u" || !N.length || !N[0])
          ) {
            var q = "";
            j = [];
            for (G in M[I]) this.terminals_[G] && G > ie && j.push("'" + this.terminals_[G] + "'");
            (y.showPosition
              ? (q =
                  "Parse error on line " +
                  (F + 1) +
                  `:
` +
                  y.showPosition() +
                  `
Expecting ` +
                  j.join(", ") +
                  ", got '" +
                  (this.terminals_[b] || b) +
                  "'")
              : (q =
                  "Parse error on line " +
                  (F + 1) +
                  ": Unexpected " +
                  (b == Q ? "end of input" : "'" + (this.terminals_[b] || b) + "'")),
              this.parseError(q, {
                text: y.match,
                token: this.terminals_[b] || b,
                line: y.yylineno,
                loc: z,
                expected: j,
              }));
          }
          if (N[0] instanceof Array && N.length > 1)
            throw new Error("Parse Error: multiple actions possible at state: " + I + ", token: " + b);
          switch (N[0]) {
            case 1:
              (a.push(b),
                p.push(y.yytext),
                r.push(y.yylloc),
                a.push(N[1]),
                (b = null),
                (K = y.yyleng),
                (g = y.yytext),
                (F = y.yylineno),
                (z = y.yylloc));
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
                (Y = this.performAction.apply(R, [g, K, F, C.yy, N[1], p, r].concat(ne))),
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
        parseError: h(function (n, a) {
          if (this.yy.parser) this.yy.parser.parseError(n, a);
          else throw new Error(n);
        }, "parseError"),
        setInput: h(function (s, n) {
          return (
            (this.yy = n || this.yy || {}),
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
          var n = s.match(/(?:\r\n?|\n).*/g);
          return (
            n ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++,
            this.options.ranges && this.yylloc.range[1]++,
            (this._input = this._input.slice(1)),
            s
          );
        }, "input"),
        unput: h(function (s) {
          var n = s.length,
            a = s.split(/(?:\r\n?|\n)/g);
          ((this._input = s + this._input),
            (this.yytext = this.yytext.substr(0, this.yytext.length - n)),
            (this.offset -= n));
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
                : this.yylloc.first_column - n,
            }),
            this.options.ranges && (this.yylloc.range = [p[0], p[0] + this.yyleng - n]),
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
            n = new Array(s.length + 1).join("-");
          return (
            s +
            this.upcomingInput() +
            `
` +
            n +
            "^"
          );
        }, "showPosition"),
        test_match: h(function (s, n) {
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
            (a = this.performAction.call(this, this.yy, this, n, this.conditionStack[this.conditionStack.length - 1])),
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
          var s, n, a, c;
          this._more || ((this.yytext = ""), (this.match = ""));
          for (var p = this._currentRules(), r = 0; r < p.length; r++)
            if (((a = this._input.match(this.rules[p[r]])), a && (!n || a[0].length > n[0].length))) {
              if (((n = a), (c = r), this.options.backtrack_lexer)) {
                if (((s = this.test_match(a, p[r])), s !== !1)) return s;
                if (this._backtrack) {
                  n = !1;
                  continue;
                } else return !1;
              } else if (!this.options.flex) break;
            }
          return n
            ? ((s = this.test_match(n, p[c])), s !== !1 ? s : !1)
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
          var n = this.next();
          return n || this.lex();
        }, "lex"),
        begin: h(function (n) {
          this.conditionStack.push(n);
        }, "begin"),
        popState: h(function () {
          var n = this.conditionStack.length - 1;
          return n > 0 ? this.conditionStack.pop() : this.conditionStack[0];
        }, "popState"),
        _currentRules: h(function () {
          return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]
            ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
            : this.conditions.INITIAL.rules;
        }, "_currentRules"),
        topState: h(function (n) {
          return ((n = this.conditionStack.length - 1 - Math.abs(n || 0)), n >= 0 ? this.conditionStack[n] : "INITIAL");
        }, "topState"),
        pushState: h(function (n) {
          this.begin(n);
        }, "pushState"),
        stateStackSize: h(function () {
          return this.conditionStack.length;
        }, "stateStackSize"),
        options: { "case-insensitive": !0 },
        performAction: h(function (n, a, c, p) {
          switch (c) {
            case 0:
              return (n.getLogger().trace("Found comment", a.yytext), 6);
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
              (n.getLogger().trace("Begin icon"), this.begin("ICON"));
              break;
            case 6:
              return (n.getLogger().trace("SPACELINE"), 6);
            case 7:
              return 7;
            case 8:
              return 15;
            case 9:
              (n.getLogger().trace("end icon"), this.popState());
              break;
            case 10:
              return (n.getLogger().trace("Exploding node"), this.begin("NODE"), 19);
            case 11:
              return (n.getLogger().trace("Cloud"), this.begin("NODE"), 19);
            case 12:
              return (n.getLogger().trace("Explosion Bang"), this.begin("NODE"), 19);
            case 13:
              return (n.getLogger().trace("Cloud Bang"), this.begin("NODE"), 19);
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
              (n.getLogger().trace("Starting NSTR"), this.begin("NSTR"));
              break;
            case 25:
              return (n.getLogger().trace("description:", a.yytext), "NODE_DESCR");
            case 26:
              this.popState();
              break;
            case 27:
              return (this.popState(), n.getLogger().trace("node end ))"), "NODE_DEND");
            case 28:
              return (this.popState(), n.getLogger().trace("node end )"), "NODE_DEND");
            case 29:
              return (this.popState(), n.getLogger().trace("node end ...", a.yytext), "NODE_DEND");
            case 30:
              return (this.popState(), n.getLogger().trace("node end (("), "NODE_DEND");
            case 31:
              return (this.popState(), n.getLogger().trace("node end (-"), "NODE_DEND");
            case 32:
              return (this.popState(), n.getLogger().trace("node end (-"), "NODE_DEND");
            case 33:
              return (this.popState(), n.getLogger().trace("node end (("), "NODE_DEND");
            case 34:
              return (this.popState(), n.getLogger().trace("node end (("), "NODE_DEND");
            case 35:
              return (n.getLogger().trace("Long description:", a.yytext), 20);
            case 36:
              return (n.getLogger().trace("Long description:", a.yytext), 20);
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
var me = J,
  ye = 12,
  T = { DEFAULT: 0, NO_BORDER: 0, ROUNDED_RECT: 1, RECT: 2, CIRCLE: 3, CLOUD: 4, BANG: 5, HEXAGON: 6 },
  $,
  Ee =
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
        var L, D, f, x;
        A.info("addNode", e, o, d, l);
        let t = !1;
        this.nodes.length === 0
          ? ((this.baseLevel = e), (e = 0), (t = !0))
          : this.baseLevel !== void 0 && ((e = e - this.baseLevel), (t = !1));
        const u = U();
        let E = (D = (L = u.mindmap) == null ? void 0 : L.padding) != null ? D : W.mindmap.padding;
        switch (l) {
          case this.nodeType.ROUNDED_RECT:
          case this.nodeType.RECT:
          case this.nodeType.HEXAGON:
            E *= 2;
            break;
        }
        const k = {
            id: this.count++,
            nodeId: H(o, u),
            level: e,
            descr: H(d, u),
            type: l,
            children: [],
            width: (x = (f = u.mindmap) == null ? void 0 : f.maxNodeWidth) != null ? x : W.mindmap.maxNodeWidth,
            padding: E,
            isRoot: t,
          },
          _ = this.getParent(e);
        if (_) (_.children.push(k), this.nodes.push(k));
        else if (t) this.nodes.push(k);
        else throw new Error(`There can be only one root. No parent could be found for ("${k.descr}")`);
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
            const t = e.level === 0 ? d % (ye - 1) : o;
            this.assignSections(l, t);
          }
      }
      flattenNodes(e, o) {
        var k;
        const d = U(),
          l = ["mindmap-node"];
        (e.isRoot === !0
          ? l.push("section-root", "section--1")
          : e.section !== void 0 && l.push(`section-${e.section}`),
          e.class && l.push(e.class));
        const t = l.join(" "),
          u = h((_) => {
            var f, x;
            const D = ((x = (f = d.theme) == null ? void 0 : f.toLowerCase()) != null ? x : "").includes("redux");
            switch (_) {
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
                return D ? "rounded" : "defaultMindmapNode";
              case T.NO_BORDER:
              default:
                return "rect";
            }
          }, "getShapeFromType"),
          E = {
            id: e.id.toString(),
            domId: "node_" + e.id.toString(),
            label: e.descr,
            labelType: "markdown",
            isGroup: !1,
            shape: u(e.type),
            width: e.width,
            height: (k = e.height) != null ? k : 0,
            padding: e.padding,
            cssClasses: t,
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
        if ((o.push(E), e.children)) for (const _ of e.children) this.flattenNodes(_, o);
      }
      generateEdges(e, o) {
        if (!e.children) return;
        const d = U();
        for (const l of e.children) {
          let t = "edge";
          l.section !== void 0 && (t += ` section-edge-${l.section}`);
          const u = e.level + 1;
          t += ` edge-depth-${u}`;
          const E = {
            id: `edge_${e.id}_${l.id}`,
            start: e.id.toString(),
            end: l.id.toString(),
            type: "normal",
            curve: "basis",
            thickness: "normal",
            look: d.look,
            classes: t,
            depth: e.level,
            section: l.section,
          };
          (o.push(E), this.generateEdges(l, o));
        }
      }
      getData() {
        const e = this.getMindmap(),
          o = U(),
          l = de().layout !== void 0,
          t = o;
        if ((l || (t.layout = "cose-bilkent"), !e)) return { nodes: [], edges: [], config: t };
        (A.debug("getData: mindmapRoot", e, o), this.assignSections(e));
        const u = [],
          E = [];
        (this.flattenNodes(e, u),
          this.generateEdges(e, E),
          A.debug(`getData: processed ${u.length} nodes and ${E.length} edges`));
        const k = new Map();
        for (const _ of u) k.set(_.id, { shape: _.shape, width: _.width, height: _.height, padding: _.padding });
        return {
          nodes: u,
          edges: E,
          config: t,
          rootNode: e,
          markers: ["point"],
          direction: "TB",
          nodeSpacing: 50,
          rankSpacing: 50,
          shapes: Object.fromEntries(k),
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
  _e = h(async (i, e, o, d) => {
    var f, x, B, P;
    A.debug(
      `Rendering mindmap diagram
` + i,
    );
    const l = d.db,
      t = l.getData(),
      u = ae(e, t.config.securityLevel);
    if (
      ((t.type = d.type),
      (t.layoutAlgorithm = ce(t.config.layout, { fallback: "cose-bilkent" })),
      (t.diagramId = e),
      !l.getMindmap())
    )
      return;
    (t.nodes.forEach((m) => {
      m.shape === "rounded"
        ? ((m.radius = 15), (m.taper = 15), (m.stroke = "none"), (m.width = 0), (m.padding = 15))
        : m.shape === "circle"
          ? (m.padding = 10)
          : m.shape === "rect"
            ? ((m.width = 0), (m.padding = 10))
            : m.shape === "hexagon" && ((m.width = 0), (m.height = 0));
    }),
      await le(t, u));
    const { themeVariables: k } = he(),
      { useGradient: _, gradientStart: L, gradientStop: D } = k;
    if (_ && L && D) {
      const m = u.attr("id"),
        w = u
          .append("defs")
          .append("linearGradient")
          .attr("id", `${m}-gradient`)
          .attr("gradientUnits", "objectBoundingBox")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");
      (w.append("stop").attr("offset", "0%").attr("stop-color", L).attr("stop-opacity", 1),
        w.append("stop").attr("offset", "100%").attr("stop-color", D).attr("stop-opacity", 1));
    }
    oe(
      u,
      (x = (f = t.config.mindmap) == null ? void 0 : f.padding) != null ? x : W.mindmap.padding,
      "mindmapDiagram",
      (P = (B = t.config.mindmap) == null ? void 0 : B.useMaxWidth) != null ? P : W.mindmap.useMaxWidth,
    );
  }, "draw"),
  ke = { draw: _e },
  be = h((i) => {
    var l;
    const { theme: e, look: o } = i;
    let d = "";
    for (let t = 0; t < i.THEME_COLOR_LIMIT; t++)
      ((i["lineColor" + t] = i["lineColor" + t] || i["cScaleInv" + t]),
        ue(i["lineColor" + t])
          ? (i["lineColor" + t] = pe(i["lineColor" + t], 20))
          : (i["lineColor" + t] = fe(i["lineColor" + t], 20)));
    for (let t = 0; t < i.THEME_COLOR_LIMIT; t++) {
      const u = "" + (o === "neo" ? Math.max(10 - (t - 1) * 2, 2) : 17 - 3 * t);
      d += `
    .section-${t - 1} rect, .section-${t - 1} path, .section-${t - 1} circle, .section-${t - 1} polygon, .section-${t - 1} path  {
      fill: ${i["cScale" + t]};
    }
    .section-${t - 1} text {
     fill: ${i["cScaleLabel" + t]};
    }
     .section-${t - 1} span {
     color: ${i["cScaleLabel" + t]};
    }
    .node-icon-${t - 1} {
      font-size: 40px;
      color: ${i["cScaleLabel" + t]};
    }
    .section-edge-${t - 1}{
      stroke: ${i["cScale" + t]};
    }
    .edge-depth-${t - 1}{
      stroke-width: ${u};
    }
    .section-${t - 1} line {
      stroke: ${i["cScaleInv" + t]} ;
      stroke-width: 3;
    }

    .disabled, .disabled circle, .disabled text {
      fill: lightgray;
    }
    .disabled text {
      fill: #efefef;
    }
    [data-look="neo"].mindmap-node.section-${t - 1} rect, [data-look="neo"].mindmap-node.section-${t - 1} path, [data-look="neo"].mindmap-node.section-${t - 1} circle, [data-look="neo"].mindmap-node.section-${t - 1} polygon {
      fill: ${e === "redux" || e === "redux-dark" || e === "neutral" ? i.mainBkg : i["cScale" + t]};
      stroke: ${e === "redux" || e === "redux-dark" ? i.nodeBorder : i["cScale" + t]};
      stroke-width: ${(l = i.strokeWidth) != null ? l : 2}px;
    }
    [data-look="neo"].section-edge-${t - 1}{
      stroke: ${(e != null && e.includes("redux")) || e === "neo-dark" ? i.nodeBorder : i["cScale" + t]};
    }
    [data-look="neo"].mindmap-node.section-${t - 1} text {
     fill: ${e === "redux" || e === "redux-dark" ? i.nodeBorder : i["cScaleLabel" + (e === "neutral" ? 1 : t)]};
    }
    `;
    }
    return d;
  }, "genSections"),
  Se = h((i, e, o) => {
    let d = "";
    for (let l = 0; l < i; l++)
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
  Ne = h((i) => {
    const { theme: e } = i,
      o = i.svgId,
      d = i.dropShadow ? i.dropShadow.replace("url(#drop-shadow)", `url(${o}-drop-shadow)`) : "none";
    return `
  .edge {
    stroke-width: 3;
  }
  ${be(i)}
  .section-root rect, .section-root path, .section-root circle, .section-root polygon  {
    fill: ${i.git0};
  }
  .section-root text {
    fill: ${i.gitBranchLabel0};
  }
  .section-root span {
    color: ${e != null && e.includes("redux") ? i.nodeBorder : i.gitBranchLabel0};
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
    fill: ${e != null && e.includes("redux") ? i.mainBkg : i.git0};
  }
  [data-look="neo"].mindmap-node.section-root .text-inner-tspan {
    fill:  ${e != null && e.includes("redux") ? i.nodeBorder : i["cScaleLabel" + (e === "neutral" ? 1 : 0)]};
  }
  ${i.useGradient && o && i.mainBkg ? Se(i.THEME_COLOR_LIMIT, o, i.mainBkg) : ""}
`;
  }, "getStyles"),
  xe = Ne,
  Te = {
    get db() {
      return new Ee();
    },
    renderer: ke,
    parser: me,
    styles: xe,
  };
export { Te as diagram };
