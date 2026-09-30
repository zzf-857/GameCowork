import { g as pe } from "./chunk-GLLZNHP4-n6A-sPkM.js";
import {
  _ as c,
  B as ne,
  y as z,
  ab as ye,
  aI as be,
  aJ as me,
  aK as Ee,
  aD as _e,
  a9 as J,
  G as F,
  X as ke,
  Y as Se,
  aE as Ne,
  aF as le,
  aG as ce,
} from "./VscTheme-B-CSeuv5.js";
import "./registry-CHHSpXp3.js";
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
  e.SENTRY_RELEASE = { id: "a9a604ff7ed4f880dc7535e2471d79d2388dc4a0" };
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
      h = new e.Error().stack;
    h &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[h] = "66a8e1e7-64e4-4dfe-838c-745791657730"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-66a8e1e7-64e4-4dfe-838c-745791657730"));
  })();
} catch {}
var ee = (function () {
  var e = c(function (f, s, t, a) {
      for (t = t || {}, a = f.length; a--; t[f[a]] = s);
      return t;
    }, "o"),
    h = [1, 4],
    p = [1, 13],
    r = [1, 12],
    m = [1, 15],
    k = [1, 16],
    g = [1, 20],
    y = [1, 19],
    D = [6, 7, 8],
    d = [1, 26],
    I = [1, 24],
    L = [1, 25],
    E = [6, 7, 11],
    O = [1, 31],
    i = [6, 7, 11, 24],
    B = [1, 6, 13, 16, 17, 20, 23],
    M = [1, 35],
    U = [1, 36],
    C = [1, 6, 7, 11, 13, 16, 17, 20, 23],
    j = [1, 38],
    V = {
      trace: c(function () {}, "trace"),
      yy: {},
      symbols_: {
        error: 2,
        start: 3,
        mindMap: 4,
        spaceLines: 5,
        SPACELINE: 6,
        NL: 7,
        KANBAN: 8,
        document: 9,
        stop: 10,
        EOF: 11,
        statement: 12,
        SPACELIST: 13,
        node: 14,
        shapeData: 15,
        ICON: 16,
        CLASS: 17,
        nodeWithId: 18,
        nodeWithoutId: 19,
        NODE_DSTART: 20,
        NODE_DESCR: 21,
        NODE_DEND: 22,
        NODE_ID: 23,
        SHAPE_DATA: 24,
        $accept: 0,
        $end: 1,
      },
      terminals_: {
        2: "error",
        6: "SPACELINE",
        7: "NL",
        8: "KANBAN",
        11: "EOF",
        13: "SPACELIST",
        16: "ICON",
        17: "CLASS",
        20: "NODE_DSTART",
        21: "NODE_DESCR",
        22: "NODE_DEND",
        23: "NODE_ID",
        24: "SHAPE_DATA",
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
        [12, 3],
        [12, 2],
        [12, 2],
        [12, 2],
        [12, 1],
        [12, 2],
        [12, 1],
        [12, 1],
        [12, 1],
        [12, 1],
        [14, 1],
        [14, 1],
        [19, 3],
        [18, 1],
        [18, 4],
        [15, 2],
        [15, 1],
      ],
      performAction: c(function (s, t, a, l, u, n, T) {
        var o = n.length - 1;
        switch (u) {
          case 6:
          case 7:
            return l;
          case 8:
            l.getLogger().trace("Stop NL ");
            break;
          case 9:
            l.getLogger().trace("Stop EOF ");
            break;
          case 11:
            l.getLogger().trace("Stop NL2 ");
            break;
          case 12:
            l.getLogger().trace("Stop EOF2 ");
            break;
          case 15:
            (l.getLogger().info("Node: ", n[o - 1].id),
              l.addNode(n[o - 2].length, n[o - 1].id, n[o - 1].descr, n[o - 1].type, n[o]));
            break;
          case 16:
            (l.getLogger().info("Node: ", n[o].id), l.addNode(n[o - 1].length, n[o].id, n[o].descr, n[o].type));
            break;
          case 17:
            (l.getLogger().trace("Icon: ", n[o]), l.decorateNode({ icon: n[o] }));
            break;
          case 18:
          case 23:
            l.decorateNode({ class: n[o] });
            break;
          case 19:
            l.getLogger().trace("SPACELIST");
            break;
          case 20:
            (l.getLogger().trace("Node: ", n[o - 1].id),
              l.addNode(0, n[o - 1].id, n[o - 1].descr, n[o - 1].type, n[o]));
            break;
          case 21:
            (l.getLogger().trace("Node: ", n[o].id), l.addNode(0, n[o].id, n[o].descr, n[o].type));
            break;
          case 22:
            l.decorateNode({ icon: n[o] });
            break;
          case 27:
            (l.getLogger().trace("node found ..", n[o - 2]),
              (this.$ = { id: n[o - 1], descr: n[o - 1], type: l.getType(n[o - 2], n[o]) }));
            break;
          case 28:
            this.$ = { id: n[o], descr: n[o], type: 0 };
            break;
          case 29:
            (l.getLogger().trace("node found ..", n[o - 3]),
              (this.$ = { id: n[o - 3], descr: n[o - 1], type: l.getType(n[o - 2], n[o]) }));
            break;
          case 30:
            this.$ = n[o - 1] + n[o];
            break;
          case 31:
            this.$ = n[o];
            break;
        }
      }, "anonymous"),
      table: [
        { 3: 1, 4: 2, 5: 3, 6: [1, 5], 8: h },
        { 1: [3] },
        { 1: [2, 1] },
        { 4: 6, 6: [1, 7], 7: [1, 8], 8: h },
        { 6: p, 7: [1, 10], 9: 9, 12: 11, 13: r, 14: 14, 16: m, 17: k, 18: 17, 19: 18, 20: g, 23: y },
        e(D, [2, 3]),
        { 1: [2, 2] },
        e(D, [2, 4]),
        e(D, [2, 5]),
        { 1: [2, 6], 6: p, 12: 21, 13: r, 14: 14, 16: m, 17: k, 18: 17, 19: 18, 20: g, 23: y },
        { 6: p, 9: 22, 12: 11, 13: r, 14: 14, 16: m, 17: k, 18: 17, 19: 18, 20: g, 23: y },
        { 6: d, 7: I, 10: 23, 11: L },
        e(E, [2, 24], { 18: 17, 19: 18, 14: 27, 16: [1, 28], 17: [1, 29], 20: g, 23: y }),
        e(E, [2, 19]),
        e(E, [2, 21], { 15: 30, 24: O }),
        e(E, [2, 22]),
        e(E, [2, 23]),
        e(i, [2, 25]),
        e(i, [2, 26]),
        e(i, [2, 28], { 20: [1, 32] }),
        { 21: [1, 33] },
        { 6: d, 7: I, 10: 34, 11: L },
        { 1: [2, 7], 6: p, 12: 21, 13: r, 14: 14, 16: m, 17: k, 18: 17, 19: 18, 20: g, 23: y },
        e(B, [2, 14], { 7: M, 11: U }),
        e(C, [2, 8]),
        e(C, [2, 9]),
        e(C, [2, 10]),
        e(E, [2, 16], { 15: 37, 24: O }),
        e(E, [2, 17]),
        e(E, [2, 18]),
        e(E, [2, 20], { 24: j }),
        e(i, [2, 31]),
        { 21: [1, 39] },
        { 22: [1, 40] },
        e(B, [2, 13], { 7: M, 11: U }),
        e(C, [2, 11]),
        e(C, [2, 12]),
        e(E, [2, 15], { 24: j }),
        e(i, [2, 30]),
        { 22: [1, 41] },
        e(i, [2, 27]),
        e(i, [2, 29]),
      ],
      defaultActions: { 2: [2, 1], 6: [2, 2] },
      parseError: c(function (s, t) {
        if (t.recoverable) this.trace(s);
        else {
          var a = new Error(s);
          throw ((a.hash = t), a);
        }
      }, "parseError"),
      parse: c(function (s) {
        var t = this,
          a = [0],
          l = [],
          u = [null],
          n = [],
          T = this.table,
          o = "",
          H = 0,
          W = 0,
          ue = 2,
          re = 1,
          ge = n.slice.call(arguments, 1),
          _ = Object.create(this.lexer),
          R = { yy: {} };
        for (var q in this.yy) Object.prototype.hasOwnProperty.call(this.yy, q) && (R.yy[q] = this.yy[q]);
        (_.setInput(s, R.yy), (R.yy.lexer = _), (R.yy.parser = this), typeof _.yylloc > "u" && (_.yylloc = {}));
        var Q = _.yylloc;
        n.push(Q);
        var de = _.options && _.options.ranges;
        typeof R.yy.parseError == "function"
          ? (this.parseError = R.yy.parseError)
          : (this.parseError = Object.getPrototypeOf(this).parseError);
        function fe(N) {
          ((a.length = a.length - 2 * N), (u.length = u.length - N), (n.length = n.length - N));
        }
        c(fe, "popStack");
        function ae() {
          var N;
          return (
            (N = l.pop() || _.lex() || re),
            typeof N != "number" && (N instanceof Array && ((l = N), (N = l.pop())), (N = t.symbols_[N] || N)),
            N
          );
        }
        c(ae, "lex");
        for (var S, P, x, Z, G = {}, Y, w, oe, K; ;) {
          if (
            ((P = a[a.length - 1]),
            this.defaultActions[P]
              ? (x = this.defaultActions[P])
              : ((S === null || typeof S > "u") && (S = ae()), (x = T[P] && T[P][S])),
            typeof x > "u" || !x.length || !x[0])
          ) {
            var $ = "";
            K = [];
            for (Y in T[P]) this.terminals_[Y] && Y > ue && K.push("'" + this.terminals_[Y] + "'");
            (_.showPosition
              ? ($ =
                  "Parse error on line " +
                  (H + 1) +
                  `:
` +
                  _.showPosition() +
                  `
Expecting ` +
                  K.join(", ") +
                  ", got '" +
                  (this.terminals_[S] || S) +
                  "'")
              : ($ =
                  "Parse error on line " +
                  (H + 1) +
                  ": Unexpected " +
                  (S == re ? "end of input" : "'" + (this.terminals_[S] || S) + "'")),
              this.parseError($, {
                text: _.match,
                token: this.terminals_[S] || S,
                line: _.yylineno,
                loc: Q,
                expected: K,
              }));
          }
          if (x[0] instanceof Array && x.length > 1)
            throw new Error("Parse Error: multiple actions possible at state: " + P + ", token: " + S);
          switch (x[0]) {
            case 1:
              (a.push(S),
                u.push(_.yytext),
                n.push(_.yylloc),
                a.push(x[1]),
                (S = null),
                (W = _.yyleng),
                (o = _.yytext),
                (H = _.yylineno),
                (Q = _.yylloc));
              break;
            case 2:
              if (
                ((w = this.productions_[x[1]][1]),
                (G.$ = u[u.length - w]),
                (G._$ = {
                  first_line: n[n.length - (w || 1)].first_line,
                  last_line: n[n.length - 1].last_line,
                  first_column: n[n.length - (w || 1)].first_column,
                  last_column: n[n.length - 1].last_column,
                }),
                de && (G._$.range = [n[n.length - (w || 1)].range[0], n[n.length - 1].range[1]]),
                (Z = this.performAction.apply(G, [o, W, H, R.yy, x[1], u, n].concat(ge))),
                typeof Z < "u")
              )
                return Z;
              (w && ((a = a.slice(0, -1 * w * 2)), (u = u.slice(0, -1 * w)), (n = n.slice(0, -1 * w))),
                a.push(this.productions_[x[1]][0]),
                u.push(G.$),
                n.push(G._$),
                (oe = T[a[a.length - 2]][a[a.length - 1]]),
                a.push(oe));
              break;
            case 3:
              return !0;
          }
        }
        return !0;
      }, "parse"),
    },
    X = (function () {
      var f = {
        EOF: 1,
        parseError: c(function (t, a) {
          if (this.yy.parser) this.yy.parser.parseError(t, a);
          else throw new Error(t);
        }, "parseError"),
        setInput: c(function (s, t) {
          return (
            (this.yy = t || this.yy || {}),
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
          var t = s.match(/(?:\r\n?|\n).*/g);
          return (
            t ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++,
            this.options.ranges && this.yylloc.range[1]++,
            (this._input = this._input.slice(1)),
            s
          );
        }, "input"),
        unput: c(function (s) {
          var t = s.length,
            a = s.split(/(?:\r\n?|\n)/g);
          ((this._input = s + this._input),
            (this.yytext = this.yytext.substr(0, this.yytext.length - t)),
            (this.offset -= t));
          var l = this.match.split(/(?:\r\n?|\n)/g);
          ((this.match = this.match.substr(0, this.match.length - 1)),
            (this.matched = this.matched.substr(0, this.matched.length - 1)),
            a.length - 1 && (this.yylineno -= a.length - 1));
          var u = this.yylloc.range;
          return (
            (this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: a
                ? (a.length === l.length ? this.yylloc.first_column : 0) + l[l.length - a.length].length - a[0].length
                : this.yylloc.first_column - t,
            }),
            this.options.ranges && (this.yylloc.range = [u[0], u[0] + this.yyleng - t]),
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
            t = new Array(s.length + 1).join("-");
          return (
            s +
            this.upcomingInput() +
            `
` +
            t +
            "^"
          );
        }, "showPosition"),
        test_match: c(function (s, t) {
          var a, l, u;
          if (
            (this.options.backtrack_lexer &&
              ((u = {
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
              this.options.ranges && (u.yylloc.range = this.yylloc.range.slice(0))),
            (l = s[0].match(/(?:\r\n?|\n).*/g)),
            l && (this.yylineno += l.length),
            (this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: l
                ? l[l.length - 1].length - l[l.length - 1].match(/\r?\n?/)[0].length
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
            (a = this.performAction.call(this, this.yy, this, t, this.conditionStack[this.conditionStack.length - 1])),
            this.done && this._input && (this.done = !1),
            a)
          )
            return a;
          if (this._backtrack) {
            for (var n in u) this[n] = u[n];
            return !1;
          }
          return !1;
        }, "test_match"),
        next: c(function () {
          if (this.done) return this.EOF;
          this._input || (this.done = !0);
          var s, t, a, l;
          this._more || ((this.yytext = ""), (this.match = ""));
          for (var u = this._currentRules(), n = 0; n < u.length; n++)
            if (((a = this._input.match(this.rules[u[n]])), a && (!t || a[0].length > t[0].length))) {
              if (((t = a), (l = n), this.options.backtrack_lexer)) {
                if (((s = this.test_match(a, u[n])), s !== !1)) return s;
                if (this._backtrack) {
                  t = !1;
                  continue;
                } else return !1;
              } else if (!this.options.flex) break;
            }
          return t
            ? ((s = this.test_match(t, u[l])), s !== !1 ? s : !1)
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
          var t = this.next();
          return t || this.lex();
        }, "lex"),
        begin: c(function (t) {
          this.conditionStack.push(t);
        }, "begin"),
        popState: c(function () {
          var t = this.conditionStack.length - 1;
          return t > 0 ? this.conditionStack.pop() : this.conditionStack[0];
        }, "popState"),
        _currentRules: c(function () {
          return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]
            ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
            : this.conditions.INITIAL.rules;
        }, "_currentRules"),
        topState: c(function (t) {
          return ((t = this.conditionStack.length - 1 - Math.abs(t || 0)), t >= 0 ? this.conditionStack[t] : "INITIAL");
        }, "topState"),
        pushState: c(function (t) {
          this.begin(t);
        }, "pushState"),
        stateStackSize: c(function () {
          return this.conditionStack.length;
        }, "stateStackSize"),
        options: { "case-insensitive": !0 },
        performAction: c(function (t, a, l, u) {
          switch (l) {
            case 0:
              return (this.pushState("shapeData"), (a.yytext = ""), 24);
            case 1:
              return (this.pushState("shapeDataStr"), 24);
            case 2:
              return (this.popState(), 24);
            case 3:
              const n = /\n\s*/g;
              return ((a.yytext = a.yytext.replace(n, "<br/>")), 24);
            case 4:
              return 24;
            case 5:
              this.popState();
              break;
            case 6:
              return (t.getLogger().trace("Found comment", a.yytext), 6);
            case 7:
              return 8;
            case 8:
              this.begin("CLASS");
              break;
            case 9:
              return (this.popState(), 17);
            case 10:
              this.popState();
              break;
            case 11:
              (t.getLogger().trace("Begin icon"), this.begin("ICON"));
              break;
            case 12:
              return (t.getLogger().trace("SPACELINE"), 6);
            case 13:
              return 7;
            case 14:
              return 16;
            case 15:
              (t.getLogger().trace("end icon"), this.popState());
              break;
            case 16:
              return (t.getLogger().trace("Exploding node"), this.begin("NODE"), 20);
            case 17:
              return (t.getLogger().trace("Cloud"), this.begin("NODE"), 20);
            case 18:
              return (t.getLogger().trace("Explosion Bang"), this.begin("NODE"), 20);
            case 19:
              return (t.getLogger().trace("Cloud Bang"), this.begin("NODE"), 20);
            case 20:
              return (this.begin("NODE"), 20);
            case 21:
              return (this.begin("NODE"), 20);
            case 22:
              return (this.begin("NODE"), 20);
            case 23:
              return (this.begin("NODE"), 20);
            case 24:
              return 13;
            case 25:
              return 23;
            case 26:
              return 11;
            case 27:
              this.begin("NSTR2");
              break;
            case 28:
              return "NODE_DESCR";
            case 29:
              this.popState();
              break;
            case 30:
              (t.getLogger().trace("Starting NSTR"), this.begin("NSTR"));
              break;
            case 31:
              return (t.getLogger().trace("description:", a.yytext), "NODE_DESCR");
            case 32:
              this.popState();
              break;
            case 33:
              return (this.popState(), t.getLogger().trace("node end ))"), "NODE_DEND");
            case 34:
              return (this.popState(), t.getLogger().trace("node end )"), "NODE_DEND");
            case 35:
              return (this.popState(), t.getLogger().trace("node end ...", a.yytext), "NODE_DEND");
            case 36:
              return (this.popState(), t.getLogger().trace("node end (("), "NODE_DEND");
            case 37:
              return (this.popState(), t.getLogger().trace("node end (-"), "NODE_DEND");
            case 38:
              return (this.popState(), t.getLogger().trace("node end (-"), "NODE_DEND");
            case 39:
              return (this.popState(), t.getLogger().trace("node end (("), "NODE_DEND");
            case 40:
              return (this.popState(), t.getLogger().trace("node end (("), "NODE_DEND");
            case 41:
              return (t.getLogger().trace("Long description:", a.yytext), 21);
            case 42:
              return (t.getLogger().trace("Long description:", a.yytext), 21);
          }
        }, "anonymous"),
        rules: [
          /^(?:@\{)/i,
          /^(?:["])/i,
          /^(?:["])/i,
          /^(?:[^\"]+)/i,
          /^(?:[^}^"]+)/i,
          /^(?:\})/i,
          /^(?:\s*%%.*)/i,
          /^(?:kanban\b)/i,
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
          /^(?:[^\(\[\n\)\{\}@]+)/i,
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
          shapeDataEndBracket: { rules: [], inclusive: !1 },
          shapeDataStr: { rules: [2, 3], inclusive: !1 },
          shapeData: { rules: [1, 4, 5], inclusive: !1 },
          CLASS: { rules: [9, 10], inclusive: !1 },
          ICON: { rules: [14, 15], inclusive: !1 },
          NSTR2: { rules: [28, 29], inclusive: !1 },
          NSTR: { rules: [31, 32], inclusive: !1 },
          NODE: { rules: [27, 30, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42], inclusive: !1 },
          INITIAL: { rules: [0, 6, 7, 8, 11, 12, 13, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], inclusive: !0 },
        },
      };
      return f;
    })();
  V.lexer = X;
  function A() {
    this.yy = {};
  }
  return (c(A, "Parser"), (A.prototype = V), (V.Parser = A), new A());
})();
ee.parser = ee;
var xe = ee,
  v = [],
  se = [],
  te = 0,
  ie = {},
  ve = c(() => {
    ((v = []), (se = []), (te = 0), (ie = {}));
  }, "clear"),
  De = c((e) => {
    if (v.length === 0) return null;
    const h = v[0].level;
    let p = null;
    for (let r = v.length - 1; r >= 0; r--)
      if ((v[r].level === h && !p && (p = v[r]), v[r].level < h))
        throw new Error('Items without section detected, found section ("' + v[r].label + '")');
    return e === (p == null ? void 0 : p.level) ? null : p;
  }, "getSection"),
  he = c(function () {
    return se;
  }, "getSections"),
  Le = c(function () {
    var m, k;
    const e = [],
      h = [],
      p = he(),
      r = z();
    for (const g of p) {
      const y = {
        id: g.id,
        label: F((m = g.label) != null ? m : "", r),
        isGroup: !0,
        ticket: g.ticket,
        shape: "kanbanSection",
        level: g.level,
        look: r.look,
      };
      h.push(y);
      const D = v.filter((d) => d.parentId === g.id);
      for (const d of D) {
        const I = {
          id: d.id,
          parentId: g.id,
          label: F((k = d.label) != null ? k : "", r),
          isGroup: !1,
          ticket: d == null ? void 0 : d.ticket,
          priority: d == null ? void 0 : d.priority,
          assigned: d == null ? void 0 : d.assigned,
          icon: d == null ? void 0 : d.icon,
          shape: "kanbanItem",
          level: d.level,
          rx: 5,
          ry: 5,
          cssStyles: ["text-align: left"],
        };
        h.push(I);
      }
    }
    return { nodes: h, edges: e, other: {}, config: z() };
  }, "getData"),
  Ie = c((e, h, p, r, m) => {
    var d, I, L, E;
    const k = z();
    let g = (I = (d = k.mindmap) == null ? void 0 : d.padding) != null ? I : J.mindmap.padding;
    switch (r) {
      case b.ROUNDED_RECT:
      case b.RECT:
      case b.HEXAGON:
        g *= 2;
    }
    const y = {
      id: F(h, k) || "kbn" + te++,
      level: e,
      label: F(p, k),
      width: (E = (L = k.mindmap) == null ? void 0 : L.maxNodeWidth) != null ? E : J.mindmap.maxNodeWidth,
      padding: g,
      isGroup: !1,
    };
    if (m !== void 0) {
      let O;
      m.includes(`
`)
        ? (O =
            m +
            `
`)
        : (O =
            `{
` +
            m +
            `
}`);
      const i = ke(O, { schema: Se });
      if (i.shape && (i.shape !== i.shape.toLowerCase() || i.shape.includes("_")))
        throw new Error(`No such shape: ${i.shape}. Shape names should be lowercase.`);
      (i != null && i.shape && i.shape === "kanbanItem" && (y.shape = i == null ? void 0 : i.shape),
        i != null && i.label && (y.label = i == null ? void 0 : i.label),
        i != null && i.icon && (y.icon = i == null ? void 0 : i.icon.toString()),
        i != null && i.assigned && (y.assigned = i == null ? void 0 : i.assigned.toString()),
        i != null && i.ticket && (y.ticket = i == null ? void 0 : i.ticket.toString()),
        i != null && i.priority && (y.priority = i == null ? void 0 : i.priority));
    }
    const D = De(e);
    (D ? (y.parentId = D.id || "kbn" + te++) : se.push(y), v.push(y));
  }, "addNode"),
  b = { DEFAULT: 0, NO_BORDER: 0, ROUNDED_RECT: 1, RECT: 2, CIRCLE: 3, CLOUD: 4, BANG: 5, HEXAGON: 6 },
  Oe = c((e, h) => {
    switch ((ne.debug("In get type", e, h), e)) {
      case "[":
        return b.RECT;
      case "(":
        return h === ")" ? b.ROUNDED_RECT : b.CLOUD;
      case "((":
        return b.CIRCLE;
      case ")":
        return b.CLOUD;
      case "))":
        return b.BANG;
      case "{{":
        return b.HEXAGON;
      default:
        return b.DEFAULT;
    }
  }, "getType"),
  we = c((e, h) => {
    ie[e] = h;
  }, "setElementForId"),
  Ce = c((e) => {
    if (!e) return;
    const h = z(),
      p = v[v.length - 1];
    (e.icon && (p.icon = F(e.icon, h)), e.class && (p.cssClasses = F(e.class, h)));
  }, "decorateNode"),
  Ae = c((e) => {
    switch (e) {
      case b.DEFAULT:
        return "no-border";
      case b.RECT:
        return "rect";
      case b.ROUNDED_RECT:
        return "rounded-rect";
      case b.CIRCLE:
        return "circle";
      case b.CLOUD:
        return "cloud";
      case b.BANG:
        return "bang";
      case b.HEXAGON:
        return "hexgon";
      default:
        return "no-border";
    }
  }, "type2Str"),
  Te = c(() => ne, "getLogger"),
  Re = c((e) => ie[e], "getElementById"),
  Pe = {
    clear: ve,
    addNode: Ie,
    getSections: he,
    getData: Le,
    nodeType: b,
    getType: Oe,
    setElementForId: we,
    decorateNode: Ce,
    type2Str: Ae,
    getLogger: Te,
    getElementById: Re,
  },
  Be = Pe,
  Ve = c(async (e, h, p, r) => {
    var M, U, C, j, V, X, A;
    ne.debug(
      `Rendering kanban diagram
` + e,
    );
    const k = r.db.getData(),
      g = z();
    g.htmlLabels = !1;
    const y = ye(h),
      D = y.append("g");
    D.attr("class", "sections");
    const d = y.append("g");
    d.attr("class", "items");
    const I = k.nodes.filter((f) => f.isGroup);
    let L = 0;
    const E = 10,
      O = [];
    let i = 25;
    for (const f of I) {
      const s = ((M = g == null ? void 0 : g.kanban) == null ? void 0 : M.sectionWidth) || 200;
      ((L = L + 1),
        (f.x = s * L + ((L - 1) * E) / 2),
        (f.width = s),
        (f.y = 0),
        (f.height = s * 3),
        (f.rx = 5),
        (f.ry = 5),
        (f.cssClasses = f.cssClasses + " section-" + L));
      const t = await be(D, f);
      ((i = Math.max(i, (U = t == null ? void 0 : t.labelBBox) == null ? void 0 : U.height)), O.push(t));
    }
    let B = 0;
    for (const f of I) {
      const s = O[B];
      B = B + 1;
      const t = ((C = g == null ? void 0 : g.kanban) == null ? void 0 : C.sectionWidth) || 200,
        a = (-t * 3) / 2 + i;
      let l = a;
      const u = k.nodes.filter((o) => o.parentId === f.id);
      for (const o of u) {
        if (o.isGroup) throw new Error("Groups within groups are not allowed in Kanban diagrams");
        ((o.x = f.x), (o.width = t - 1.5 * E));
        const W = (await me(d, o, { config: g })).node().getBBox();
        ((o.y = l + W.height / 2), await Ee(o), (l = o.y + W.height / 2 + E / 2));
      }
      const n = s.cluster.select("rect"),
        T = Math.max(l - a + 3 * E, 50) + (i - 25);
      n.attr("height", T);
    }
    _e(
      void 0,
      y,
      (V = (j = g.mindmap) == null ? void 0 : j.padding) != null ? V : J.kanban.padding,
      (A = (X = g.mindmap) == null ? void 0 : X.useMaxWidth) != null ? A : J.kanban.useMaxWidth,
    );
  }, "draw"),
  Ge = { draw: Ve },
  Fe = c((e) => {
    let h = "";
    for (let r = 0; r < e.THEME_COLOR_LIMIT; r++)
      ((e["lineColor" + r] = e["lineColor" + r] || e["cScaleInv" + r]),
        Ne(e["lineColor" + r])
          ? (e["lineColor" + r] = le(e["lineColor" + r], 20))
          : (e["lineColor" + r] = ce(e["lineColor" + r], 20)));
    const p = c((r, m) => (e.darkMode ? ce(r, m) : le(r, m)), "adjuster");
    for (let r = 0; r < e.THEME_COLOR_LIMIT; r++) {
      const m = "" + (17 - 3 * r);
      h += `
    .section-${r - 1} rect, .section-${r - 1} path, .section-${r - 1} circle, .section-${r - 1} polygon, .section-${r - 1} path  {
      fill: ${p(e["cScale" + r], 10)};
      stroke: ${p(e["cScale" + r], 10)};

    }
    .section-${r - 1} text {
     fill: ${e["cScaleLabel" + r]};
    }
    .node-icon-${r - 1} {
      font-size: 40px;
      color: ${e["cScaleLabel" + r]};
    }
    .section-edge-${r - 1}{
      stroke: ${e["cScale" + r]};
    }
    .edge-depth-${r - 1}{
      stroke-width: ${m};
    }
    .section-${r - 1} line {
      stroke: ${e["cScaleInv" + r]} ;
      stroke-width: 3;
    }

    .disabled, .disabled circle, .disabled text {
      fill: lightgray;
    }
    .disabled text {
      fill: #efefef;
    }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${e.background};
    stroke: ${e.nodeBorder};
    stroke-width: 1px;
  }

  .kanban-ticket-link {
    fill: ${e.background};
    stroke: ${e.nodeBorder};
    text-decoration: underline;
  }
    `;
    }
    return h;
  }, "genSections"),
  Me = c(
    (e) => `
  .edge {
    stroke-width: 3;
  }
  ${Fe(e)}
  .section-root rect, .section-root path, .section-root circle, .section-root polygon  {
    fill: ${e.git0};
  }
  .section-root text {
    fill: ${e.gitBranchLabel0};
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
  .cluster-label, .label {
    color: ${e.textColor};
    fill: ${e.textColor};
    }
  .kanban-label {
    dy: 1em;
    alignment-baseline: middle;
    text-anchor: middle;
    dominant-baseline: middle;
    text-align: center;
  }
    ${pe()}
`,
    "getStyles",
  ),
  Ue = Me,
  ze = { db: Be, renderer: Ge, parser: xe, styles: Ue };
export { ze as diagram };
