import {
  _ as o,
  t as Se,
  v as Ae,
  W as ie,
  V as ke,
  w as Fe,
  x as Pe,
  y as Rt,
  B as kt,
  z as zt,
  D as ve,
  a0 as Ce,
  a9 as D,
  as as Le,
  G as Ee,
} from "./VscTheme-B-CSeuv5.js";
import { l as ee } from "./linear-k-z42gGN.js";
import "./registry-CHHSpXp3.js";
import "./init-BVqZKxlz.js";
import "./defaultLocale-DLjId3QZ.js";
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
      a = new t.Error().stack;
    a &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[a] = "fce70179-ac0d-47f6-abd1-6c0cca680e7c"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-fce70179-ac0d-47f6-abd1-6c0cca680e7c"));
  })();
} catch {}
var It = (function () {
  var t = o(function (Y, r, l, g) {
      for (l = l || {}, g = Y.length; g--; l[Y[g]] = r);
      return l;
    }, "o"),
    a = [1, 3],
    f = [1, 4],
    d = [1, 5],
    c = [1, 6],
    p = [1, 7],
    y = [
      1, 4, 5, 10, 12, 13, 14, 18, 25, 35, 37, 39, 41, 42, 48, 50, 51, 52, 53, 54, 55, 56, 57, 60, 61, 63, 64, 65, 66,
      67,
    ],
    _ = [
      1, 4, 5, 10, 12, 13, 14, 18, 25, 28, 35, 37, 39, 41, 42, 48, 50, 51, 52, 53, 54, 55, 56, 57, 60, 61, 63, 64, 65,
      66, 67,
    ],
    n = [55, 56, 57],
    A = [2, 36],
    u = [1, 37],
    m = [1, 36],
    b = [1, 38],
    T = [1, 35],
    q = [1, 43],
    h = [1, 41],
    N = [1, 14],
    M = [1, 23],
    j = [1, 18],
    Tt = [1, 19],
    qt = [1, 20],
    ht = [1, 21],
    Pt = [1, 22],
    dt = [1, 24],
    ut = [1, 25],
    ft = [1, 26],
    xt = [1, 27],
    gt = [1, 28],
    pt = [1, 29],
    R = [1, 32],
    e = [1, 33],
    k = [1, 34],
    F = [1, 39],
    P = [1, 40],
    v = [1, 42],
    C = [1, 44],
    O = [1, 62],
    H = [1, 61],
    L = [4, 5, 8, 10, 12, 13, 14, 18, 44, 47, 49, 55, 56, 57, 63, 64, 65, 66, 67],
    Bt = [1, 65],
    Nt = [1, 66],
    Wt = [1, 67],
    Ut = [1, 68],
    Qt = [1, 69],
    Ot = [1, 70],
    Ht = [1, 71],
    Xt = [1, 72],
    Mt = [1, 73],
    Yt = [1, 74],
    jt = [1, 75],
    Gt = [1, 76],
    I = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18],
    Z = [1, 90],
    J = [1, 91],
    $ = [1, 92],
    tt = [1, 99],
    et = [1, 93],
    it = [1, 96],
    at = [1, 94],
    nt = [1, 95],
    st = [1, 97],
    rt = [1, 98],
    vt = [1, 102],
    Kt = [10, 55, 56, 57],
    W = [4, 5, 6, 8, 10, 11, 13, 17, 18, 19, 20, 55, 56, 57],
    Ct = {
      trace: o(function () {}, "trace"),
      yy: {},
      symbols_: {
        error: 2,
        idStringToken: 3,
        ALPHA: 4,
        NUM: 5,
        NODE_STRING: 6,
        DOWN: 7,
        MINUS: 8,
        DEFAULT: 9,
        COMMA: 10,
        COLON: 11,
        AMP: 12,
        BRKT: 13,
        MULT: 14,
        UNICODE_TEXT: 15,
        styleComponent: 16,
        UNIT: 17,
        SPACE: 18,
        STYLE: 19,
        PCT: 20,
        idString: 21,
        style: 22,
        stylesOpt: 23,
        classDefStatement: 24,
        CLASSDEF: 25,
        start: 26,
        eol: 27,
        QUADRANT: 28,
        document: 29,
        line: 30,
        statement: 31,
        axisDetails: 32,
        quadrantDetails: 33,
        points: 34,
        title: 35,
        title_value: 36,
        acc_title: 37,
        acc_title_value: 38,
        acc_descr: 39,
        acc_descr_value: 40,
        acc_descr_multiline_value: 41,
        section: 42,
        text: 43,
        point_start: 44,
        point_x: 45,
        point_y: 46,
        class_name: 47,
        "X-AXIS": 48,
        "AXIS-TEXT-DELIMITER": 49,
        "Y-AXIS": 50,
        QUADRANT_1: 51,
        QUADRANT_2: 52,
        QUADRANT_3: 53,
        QUADRANT_4: 54,
        NEWLINE: 55,
        SEMI: 56,
        EOF: 57,
        alphaNumToken: 58,
        textNoTagsToken: 59,
        STR: 60,
        MD_STR: 61,
        alphaNum: 62,
        PUNCTUATION: 63,
        PLUS: 64,
        EQUALS: 65,
        DOT: 66,
        UNDERSCORE: 67,
        $accept: 0,
        $end: 1,
      },
      terminals_: {
        2: "error",
        4: "ALPHA",
        5: "NUM",
        6: "NODE_STRING",
        7: "DOWN",
        8: "MINUS",
        9: "DEFAULT",
        10: "COMMA",
        11: "COLON",
        12: "AMP",
        13: "BRKT",
        14: "MULT",
        15: "UNICODE_TEXT",
        17: "UNIT",
        18: "SPACE",
        19: "STYLE",
        20: "PCT",
        25: "CLASSDEF",
        28: "QUADRANT",
        35: "title",
        36: "title_value",
        37: "acc_title",
        38: "acc_title_value",
        39: "acc_descr",
        40: "acc_descr_value",
        41: "acc_descr_multiline_value",
        42: "section",
        44: "point_start",
        45: "point_x",
        46: "point_y",
        47: "class_name",
        48: "X-AXIS",
        49: "AXIS-TEXT-DELIMITER",
        50: "Y-AXIS",
        51: "QUADRANT_1",
        52: "QUADRANT_2",
        53: "QUADRANT_3",
        54: "QUADRANT_4",
        55: "NEWLINE",
        56: "SEMI",
        57: "EOF",
        60: "STR",
        61: "MD_STR",
        63: "PUNCTUATION",
        64: "PLUS",
        65: "EQUALS",
        66: "DOT",
        67: "UNDERSCORE",
      },
      productions_: [
        0,
        [3, 1],
        [3, 1],
        [3, 1],
        [3, 1],
        [3, 1],
        [3, 1],
        [3, 1],
        [3, 1],
        [3, 1],
        [3, 1],
        [3, 1],
        [3, 1],
        [16, 1],
        [16, 1],
        [16, 1],
        [16, 1],
        [16, 1],
        [16, 1],
        [16, 1],
        [16, 1],
        [16, 1],
        [16, 1],
        [21, 1],
        [21, 2],
        [22, 1],
        [22, 2],
        [23, 1],
        [23, 3],
        [24, 5],
        [26, 2],
        [26, 2],
        [26, 2],
        [29, 0],
        [29, 2],
        [30, 2],
        [31, 0],
        [31, 1],
        [31, 2],
        [31, 1],
        [31, 1],
        [31, 1],
        [31, 2],
        [31, 2],
        [31, 2],
        [31, 1],
        [31, 1],
        [34, 4],
        [34, 5],
        [34, 5],
        [34, 6],
        [32, 4],
        [32, 3],
        [32, 2],
        [32, 4],
        [32, 3],
        [32, 2],
        [33, 2],
        [33, 2],
        [33, 2],
        [33, 2],
        [27, 1],
        [27, 1],
        [27, 1],
        [43, 1],
        [43, 2],
        [43, 1],
        [43, 1],
        [62, 1],
        [62, 2],
        [58, 1],
        [58, 1],
        [58, 1],
        [58, 1],
        [58, 1],
        [58, 1],
        [58, 1],
        [58, 1],
        [58, 1],
        [58, 1],
        [58, 1],
        [59, 1],
        [59, 1],
        [59, 1],
      ],
      performAction: o(function (r, l, g, x, S, i, yt) {
        var s = i.length - 1;
        switch (S) {
          case 23:
            this.$ = i[s];
            break;
          case 24:
            this.$ = i[s - 1] + "" + i[s];
            break;
          case 26:
            this.$ = i[s - 1] + i[s];
            break;
          case 27:
            this.$ = [i[s].trim()];
            break;
          case 28:
            (i[s - 2].push(i[s].trim()), (this.$ = i[s - 2]));
            break;
          case 29:
            ((this.$ = i[s - 4]), x.addClass(i[s - 2], i[s]));
            break;
          case 37:
            this.$ = [];
            break;
          case 42:
            ((this.$ = i[s].trim()), x.setDiagramTitle(this.$));
            break;
          case 43:
            ((this.$ = i[s].trim()), x.setAccTitle(this.$));
            break;
          case 44:
          case 45:
            ((this.$ = i[s].trim()), x.setAccDescription(this.$));
            break;
          case 46:
            (x.addSection(i[s].substr(8)), (this.$ = i[s].substr(8)));
            break;
          case 47:
            x.addPoint(i[s - 3], "", i[s - 1], i[s], []);
            break;
          case 48:
            x.addPoint(i[s - 4], i[s - 3], i[s - 1], i[s], []);
            break;
          case 49:
            x.addPoint(i[s - 4], "", i[s - 2], i[s - 1], i[s]);
            break;
          case 50:
            x.addPoint(i[s - 5], i[s - 4], i[s - 2], i[s - 1], i[s]);
            break;
          case 51:
            (x.setXAxisLeftText(i[s - 2]), x.setXAxisRightText(i[s]));
            break;
          case 52:
            ((i[s - 1].text += " ⟶ "), x.setXAxisLeftText(i[s - 1]));
            break;
          case 53:
            x.setXAxisLeftText(i[s]);
            break;
          case 54:
            (x.setYAxisBottomText(i[s - 2]), x.setYAxisTopText(i[s]));
            break;
          case 55:
            ((i[s - 1].text += " ⟶ "), x.setYAxisBottomText(i[s - 1]));
            break;
          case 56:
            x.setYAxisBottomText(i[s]);
            break;
          case 57:
            x.setQuadrant1Text(i[s]);
            break;
          case 58:
            x.setQuadrant2Text(i[s]);
            break;
          case 59:
            x.setQuadrant3Text(i[s]);
            break;
          case 60:
            x.setQuadrant4Text(i[s]);
            break;
          case 64:
            this.$ = { text: i[s], type: "text" };
            break;
          case 65:
            this.$ = { text: i[s - 1].text + "" + i[s], type: i[s - 1].type };
            break;
          case 66:
            this.$ = { text: i[s], type: "text" };
            break;
          case 67:
            this.$ = { text: i[s], type: "markdown" };
            break;
          case 68:
            this.$ = i[s];
            break;
          case 69:
            this.$ = i[s - 1] + "" + i[s];
            break;
        }
      }, "anonymous"),
      table: [
        { 18: a, 26: 1, 27: 2, 28: f, 55: d, 56: c, 57: p },
        { 1: [3] },
        { 18: a, 26: 8, 27: 2, 28: f, 55: d, 56: c, 57: p },
        { 18: a, 26: 9, 27: 2, 28: f, 55: d, 56: c, 57: p },
        t(y, [2, 33], { 29: 10 }),
        t(_, [2, 61]),
        t(_, [2, 62]),
        t(_, [2, 63]),
        { 1: [2, 30] },
        { 1: [2, 31] },
        t(n, A, {
          30: 11,
          31: 12,
          24: 13,
          32: 15,
          33: 16,
          34: 17,
          43: 30,
          58: 31,
          1: [2, 32],
          4: u,
          5: m,
          10: b,
          12: T,
          13: q,
          14: h,
          18: N,
          25: M,
          35: j,
          37: Tt,
          39: qt,
          41: ht,
          42: Pt,
          48: dt,
          50: ut,
          51: ft,
          52: xt,
          53: gt,
          54: pt,
          60: R,
          61: e,
          63: k,
          64: F,
          65: P,
          66: v,
          67: C,
        }),
        t(y, [2, 34]),
        { 27: 45, 55: d, 56: c, 57: p },
        t(n, [2, 37]),
        t(n, A, {
          24: 13,
          32: 15,
          33: 16,
          34: 17,
          43: 30,
          58: 31,
          31: 46,
          4: u,
          5: m,
          10: b,
          12: T,
          13: q,
          14: h,
          18: N,
          25: M,
          35: j,
          37: Tt,
          39: qt,
          41: ht,
          42: Pt,
          48: dt,
          50: ut,
          51: ft,
          52: xt,
          53: gt,
          54: pt,
          60: R,
          61: e,
          63: k,
          64: F,
          65: P,
          66: v,
          67: C,
        }),
        t(n, [2, 39]),
        t(n, [2, 40]),
        t(n, [2, 41]),
        { 36: [1, 47] },
        { 38: [1, 48] },
        { 40: [1, 49] },
        t(n, [2, 45]),
        t(n, [2, 46]),
        { 18: [1, 50] },
        { 4: u, 5: m, 10: b, 12: T, 13: q, 14: h, 43: 51, 58: 31, 60: R, 61: e, 63: k, 64: F, 65: P, 66: v, 67: C },
        { 4: u, 5: m, 10: b, 12: T, 13: q, 14: h, 43: 52, 58: 31, 60: R, 61: e, 63: k, 64: F, 65: P, 66: v, 67: C },
        { 4: u, 5: m, 10: b, 12: T, 13: q, 14: h, 43: 53, 58: 31, 60: R, 61: e, 63: k, 64: F, 65: P, 66: v, 67: C },
        { 4: u, 5: m, 10: b, 12: T, 13: q, 14: h, 43: 54, 58: 31, 60: R, 61: e, 63: k, 64: F, 65: P, 66: v, 67: C },
        { 4: u, 5: m, 10: b, 12: T, 13: q, 14: h, 43: 55, 58: 31, 60: R, 61: e, 63: k, 64: F, 65: P, 66: v, 67: C },
        { 4: u, 5: m, 10: b, 12: T, 13: q, 14: h, 43: 56, 58: 31, 60: R, 61: e, 63: k, 64: F, 65: P, 66: v, 67: C },
        {
          4: u,
          5: m,
          8: O,
          10: b,
          12: T,
          13: q,
          14: h,
          18: H,
          44: [1, 57],
          47: [1, 58],
          58: 60,
          59: 59,
          63: k,
          64: F,
          65: P,
          66: v,
          67: C,
        },
        t(L, [2, 64]),
        t(L, [2, 66]),
        t(L, [2, 67]),
        t(L, [2, 70]),
        t(L, [2, 71]),
        t(L, [2, 72]),
        t(L, [2, 73]),
        t(L, [2, 74]),
        t(L, [2, 75]),
        t(L, [2, 76]),
        t(L, [2, 77]),
        t(L, [2, 78]),
        t(L, [2, 79]),
        t(L, [2, 80]),
        t(y, [2, 35]),
        t(n, [2, 38]),
        t(n, [2, 42]),
        t(n, [2, 43]),
        t(n, [2, 44]),
        { 3: 64, 4: Bt, 5: Nt, 6: Wt, 7: Ut, 8: Qt, 9: Ot, 10: Ht, 11: Xt, 12: Mt, 13: Yt, 14: jt, 15: Gt, 21: 63 },
        t(n, [2, 53], {
          59: 59,
          58: 60,
          4: u,
          5: m,
          8: O,
          10: b,
          12: T,
          13: q,
          14: h,
          18: H,
          49: [1, 77],
          63: k,
          64: F,
          65: P,
          66: v,
          67: C,
        }),
        t(n, [2, 56], {
          59: 59,
          58: 60,
          4: u,
          5: m,
          8: O,
          10: b,
          12: T,
          13: q,
          14: h,
          18: H,
          49: [1, 78],
          63: k,
          64: F,
          65: P,
          66: v,
          67: C,
        }),
        t(n, [2, 57], {
          59: 59,
          58: 60,
          4: u,
          5: m,
          8: O,
          10: b,
          12: T,
          13: q,
          14: h,
          18: H,
          63: k,
          64: F,
          65: P,
          66: v,
          67: C,
        }),
        t(n, [2, 58], {
          59: 59,
          58: 60,
          4: u,
          5: m,
          8: O,
          10: b,
          12: T,
          13: q,
          14: h,
          18: H,
          63: k,
          64: F,
          65: P,
          66: v,
          67: C,
        }),
        t(n, [2, 59], {
          59: 59,
          58: 60,
          4: u,
          5: m,
          8: O,
          10: b,
          12: T,
          13: q,
          14: h,
          18: H,
          63: k,
          64: F,
          65: P,
          66: v,
          67: C,
        }),
        t(n, [2, 60], {
          59: 59,
          58: 60,
          4: u,
          5: m,
          8: O,
          10: b,
          12: T,
          13: q,
          14: h,
          18: H,
          63: k,
          64: F,
          65: P,
          66: v,
          67: C,
        }),
        { 45: [1, 79] },
        { 44: [1, 80] },
        t(L, [2, 65]),
        t(L, [2, 81]),
        t(L, [2, 82]),
        t(L, [2, 83]),
        {
          3: 82,
          4: Bt,
          5: Nt,
          6: Wt,
          7: Ut,
          8: Qt,
          9: Ot,
          10: Ht,
          11: Xt,
          12: Mt,
          13: Yt,
          14: jt,
          15: Gt,
          18: [1, 81],
        },
        t(I, [2, 23]),
        t(I, [2, 1]),
        t(I, [2, 2]),
        t(I, [2, 3]),
        t(I, [2, 4]),
        t(I, [2, 5]),
        t(I, [2, 6]),
        t(I, [2, 7]),
        t(I, [2, 8]),
        t(I, [2, 9]),
        t(I, [2, 10]),
        t(I, [2, 11]),
        t(I, [2, 12]),
        t(n, [2, 52], {
          58: 31,
          43: 83,
          4: u,
          5: m,
          10: b,
          12: T,
          13: q,
          14: h,
          60: R,
          61: e,
          63: k,
          64: F,
          65: P,
          66: v,
          67: C,
        }),
        t(n, [2, 55], {
          58: 31,
          43: 84,
          4: u,
          5: m,
          10: b,
          12: T,
          13: q,
          14: h,
          60: R,
          61: e,
          63: k,
          64: F,
          65: P,
          66: v,
          67: C,
        }),
        { 46: [1, 85] },
        { 45: [1, 86] },
        { 4: Z, 5: J, 6: $, 8: tt, 11: et, 13: it, 16: 89, 17: at, 18: nt, 19: st, 20: rt, 22: 88, 23: 87 },
        t(I, [2, 24]),
        t(n, [2, 51], {
          59: 59,
          58: 60,
          4: u,
          5: m,
          8: O,
          10: b,
          12: T,
          13: q,
          14: h,
          18: H,
          63: k,
          64: F,
          65: P,
          66: v,
          67: C,
        }),
        t(n, [2, 54], {
          59: 59,
          58: 60,
          4: u,
          5: m,
          8: O,
          10: b,
          12: T,
          13: q,
          14: h,
          18: H,
          63: k,
          64: F,
          65: P,
          66: v,
          67: C,
        }),
        t(n, [2, 47], {
          22: 88,
          16: 89,
          23: 100,
          4: Z,
          5: J,
          6: $,
          8: tt,
          11: et,
          13: it,
          17: at,
          18: nt,
          19: st,
          20: rt,
        }),
        { 46: [1, 101] },
        t(n, [2, 29], { 10: vt }),
        t(Kt, [2, 27], { 16: 103, 4: Z, 5: J, 6: $, 8: tt, 11: et, 13: it, 17: at, 18: nt, 19: st, 20: rt }),
        t(W, [2, 25]),
        t(W, [2, 13]),
        t(W, [2, 14]),
        t(W, [2, 15]),
        t(W, [2, 16]),
        t(W, [2, 17]),
        t(W, [2, 18]),
        t(W, [2, 19]),
        t(W, [2, 20]),
        t(W, [2, 21]),
        t(W, [2, 22]),
        t(n, [2, 49], { 10: vt }),
        t(n, [2, 48], {
          22: 88,
          16: 89,
          23: 104,
          4: Z,
          5: J,
          6: $,
          8: tt,
          11: et,
          13: it,
          17: at,
          18: nt,
          19: st,
          20: rt,
        }),
        { 4: Z, 5: J, 6: $, 8: tt, 11: et, 13: it, 16: 89, 17: at, 18: nt, 19: st, 20: rt, 22: 105 },
        t(W, [2, 26]),
        t(n, [2, 50], { 10: vt }),
        t(Kt, [2, 28], { 16: 103, 4: Z, 5: J, 6: $, 8: tt, 11: et, 13: it, 17: at, 18: nt, 19: st, 20: rt }),
      ],
      defaultActions: { 8: [2, 30], 9: [2, 31] },
      parseError: o(function (r, l) {
        if (l.recoverable) this.trace(r);
        else {
          var g = new Error(r);
          throw ((g.hash = l), g);
        }
      }, "parseError"),
      parse: o(function (r) {
        var l = this,
          g = [0],
          x = [],
          S = [null],
          i = [],
          yt = this.table,
          s = "",
          bt = 0,
          Zt = 0,
          qe = 2,
          Jt = 1,
          me = i.slice.call(arguments, 1),
          E = Object.create(this.lexer),
          G = { yy: {} };
        for (var Lt in this.yy) Object.prototype.hasOwnProperty.call(this.yy, Lt) && (G.yy[Lt] = this.yy[Lt]);
        (E.setInput(r, G.yy), (G.yy.lexer = E), (G.yy.parser = this), typeof E.yylloc > "u" && (E.yylloc = {}));
        var Et = E.yylloc;
        i.push(Et);
        var be = E.options && E.options.ranges;
        typeof G.yy.parseError == "function"
          ? (this.parseError = G.yy.parseError)
          : (this.parseError = Object.getPrototypeOf(this).parseError);
        function _e(B) {
          ((g.length = g.length - 2 * B), (S.length = S.length - B), (i.length = i.length - B));
        }
        o(_e, "popStack");
        function $t() {
          var B;
          return (
            (B = x.pop() || E.lex() || Jt),
            typeof B != "number" && (B instanceof Array && ((x = B), (B = x.pop())), (B = l.symbols_[B] || B)),
            B
          );
        }
        o($t, "lex");
        for (var V, K, U, Dt, ot = {}, _t, X, te, St; ;) {
          if (
            ((K = g[g.length - 1]),
            this.defaultActions[K]
              ? (U = this.defaultActions[K])
              : ((V === null || typeof V > "u") && (V = $t()), (U = yt[K] && yt[K][V])),
            typeof U > "u" || !U.length || !U[0])
          ) {
            var wt = "";
            St = [];
            for (_t in yt[K]) this.terminals_[_t] && _t > qe && St.push("'" + this.terminals_[_t] + "'");
            (E.showPosition
              ? (wt =
                  "Parse error on line " +
                  (bt + 1) +
                  `:
` +
                  E.showPosition() +
                  `
Expecting ` +
                  St.join(", ") +
                  ", got '" +
                  (this.terminals_[V] || V) +
                  "'")
              : (wt =
                  "Parse error on line " +
                  (bt + 1) +
                  ": Unexpected " +
                  (V == Jt ? "end of input" : "'" + (this.terminals_[V] || V) + "'")),
              this.parseError(wt, {
                text: E.match,
                token: this.terminals_[V] || V,
                line: E.yylineno,
                loc: Et,
                expected: St,
              }));
          }
          if (U[0] instanceof Array && U.length > 1)
            throw new Error("Parse Error: multiple actions possible at state: " + K + ", token: " + V);
          switch (U[0]) {
            case 1:
              (g.push(V),
                S.push(E.yytext),
                i.push(E.yylloc),
                g.push(U[1]),
                (V = null),
                (Zt = E.yyleng),
                (s = E.yytext),
                (bt = E.yylineno),
                (Et = E.yylloc));
              break;
            case 2:
              if (
                ((X = this.productions_[U[1]][1]),
                (ot.$ = S[S.length - X]),
                (ot._$ = {
                  first_line: i[i.length - (X || 1)].first_line,
                  last_line: i[i.length - 1].last_line,
                  first_column: i[i.length - (X || 1)].first_column,
                  last_column: i[i.length - 1].last_column,
                }),
                be && (ot._$.range = [i[i.length - (X || 1)].range[0], i[i.length - 1].range[1]]),
                (Dt = this.performAction.apply(ot, [s, Zt, bt, G.yy, U[1], S, i].concat(me))),
                typeof Dt < "u")
              )
                return Dt;
              (X && ((g = g.slice(0, -1 * X * 2)), (S = S.slice(0, -1 * X)), (i = i.slice(0, -1 * X))),
                g.push(this.productions_[U[1]][0]),
                S.push(ot.$),
                i.push(ot._$),
                (te = yt[g[g.length - 2]][g[g.length - 1]]),
                g.push(te));
              break;
            case 3:
              return !0;
          }
        }
        return !0;
      }, "parse"),
    },
    Te = (function () {
      var Y = {
        EOF: 1,
        parseError: o(function (l, g) {
          if (this.yy.parser) this.yy.parser.parseError(l, g);
          else throw new Error(l);
        }, "parseError"),
        setInput: o(function (r, l) {
          return (
            (this.yy = l || this.yy || {}),
            (this._input = r),
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
          var r = this._input[0];
          ((this.yytext += r), this.yyleng++, this.offset++, (this.match += r), (this.matched += r));
          var l = r.match(/(?:\r\n?|\n).*/g);
          return (
            l ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++,
            this.options.ranges && this.yylloc.range[1]++,
            (this._input = this._input.slice(1)),
            r
          );
        }, "input"),
        unput: o(function (r) {
          var l = r.length,
            g = r.split(/(?:\r\n?|\n)/g);
          ((this._input = r + this._input),
            (this.yytext = this.yytext.substr(0, this.yytext.length - l)),
            (this.offset -= l));
          var x = this.match.split(/(?:\r\n?|\n)/g);
          ((this.match = this.match.substr(0, this.match.length - 1)),
            (this.matched = this.matched.substr(0, this.matched.length - 1)),
            g.length - 1 && (this.yylineno -= g.length - 1));
          var S = this.yylloc.range;
          return (
            (this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: g
                ? (g.length === x.length ? this.yylloc.first_column : 0) + x[x.length - g.length].length - g[0].length
                : this.yylloc.first_column - l,
            }),
            this.options.ranges && (this.yylloc.range = [S[0], S[0] + this.yyleng - l]),
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
        less: o(function (r) {
          this.unput(this.match.slice(r));
        }, "less"),
        pastInput: o(function () {
          var r = this.matched.substr(0, this.matched.length - this.match.length);
          return (r.length > 20 ? "..." : "") + r.substr(-20).replace(/\n/g, "");
        }, "pastInput"),
        upcomingInput: o(function () {
          var r = this.match;
          return (
            r.length < 20 && (r += this._input.substr(0, 20 - r.length)),
            (r.substr(0, 20) + (r.length > 20 ? "..." : "")).replace(/\n/g, "")
          );
        }, "upcomingInput"),
        showPosition: o(function () {
          var r = this.pastInput(),
            l = new Array(r.length + 1).join("-");
          return (
            r +
            this.upcomingInput() +
            `
` +
            l +
            "^"
          );
        }, "showPosition"),
        test_match: o(function (r, l) {
          var g, x, S;
          if (
            (this.options.backtrack_lexer &&
              ((S = {
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
              this.options.ranges && (S.yylloc.range = this.yylloc.range.slice(0))),
            (x = r[0].match(/(?:\r\n?|\n).*/g)),
            x && (this.yylineno += x.length),
            (this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: x
                ? x[x.length - 1].length - x[x.length - 1].match(/\r?\n?/)[0].length
                : this.yylloc.last_column + r[0].length,
            }),
            (this.yytext += r[0]),
            (this.match += r[0]),
            (this.matches = r),
            (this.yyleng = this.yytext.length),
            this.options.ranges && (this.yylloc.range = [this.offset, (this.offset += this.yyleng)]),
            (this._more = !1),
            (this._backtrack = !1),
            (this._input = this._input.slice(r[0].length)),
            (this.matched += r[0]),
            (g = this.performAction.call(this, this.yy, this, l, this.conditionStack[this.conditionStack.length - 1])),
            this.done && this._input && (this.done = !1),
            g)
          )
            return g;
          if (this._backtrack) {
            for (var i in S) this[i] = S[i];
            return !1;
          }
          return !1;
        }, "test_match"),
        next: o(function () {
          if (this.done) return this.EOF;
          this._input || (this.done = !0);
          var r, l, g, x;
          this._more || ((this.yytext = ""), (this.match = ""));
          for (var S = this._currentRules(), i = 0; i < S.length; i++)
            if (((g = this._input.match(this.rules[S[i]])), g && (!l || g[0].length > l[0].length))) {
              if (((l = g), (x = i), this.options.backtrack_lexer)) {
                if (((r = this.test_match(g, S[i])), r !== !1)) return r;
                if (this._backtrack) {
                  l = !1;
                  continue;
                } else return !1;
              } else if (!this.options.flex) break;
            }
          return l
            ? ((r = this.test_match(l, S[x])), r !== !1 ? r : !1)
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
          var l = this.next();
          return l || this.lex();
        }, "lex"),
        begin: o(function (l) {
          this.conditionStack.push(l);
        }, "begin"),
        popState: o(function () {
          var l = this.conditionStack.length - 1;
          return l > 0 ? this.conditionStack.pop() : this.conditionStack[0];
        }, "popState"),
        _currentRules: o(function () {
          return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]
            ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
            : this.conditions.INITIAL.rules;
        }, "_currentRules"),
        topState: o(function (l) {
          return ((l = this.conditionStack.length - 1 - Math.abs(l || 0)), l >= 0 ? this.conditionStack[l] : "INITIAL");
        }, "topState"),
        pushState: o(function (l) {
          this.begin(l);
        }, "pushState"),
        stateStackSize: o(function () {
          return this.conditionStack.length;
        }, "stateStackSize"),
        options: { "case-insensitive": !0 },
        performAction: o(function (l, g, x, S) {
          switch (x) {
            case 0:
              break;
            case 1:
              break;
            case 2:
              return 55;
            case 3:
              break;
            case 4:
              return (this.begin("title"), 35);
            case 5:
              return (this.popState(), "title_value");
            case 6:
              return (this.begin("acc_title"), 37);
            case 7:
              return (this.popState(), "acc_title_value");
            case 8:
              return (this.begin("acc_descr"), 39);
            case 9:
              return (this.popState(), "acc_descr_value");
            case 10:
              this.begin("acc_descr_multiline");
              break;
            case 11:
              this.popState();
              break;
            case 12:
              return "acc_descr_multiline_value";
            case 13:
              return 48;
            case 14:
              return 50;
            case 15:
              return 49;
            case 16:
              return 51;
            case 17:
              return 52;
            case 18:
              return 53;
            case 19:
              return 54;
            case 20:
              return 25;
            case 21:
              this.begin("md_string");
              break;
            case 22:
              return "MD_STR";
            case 23:
              this.popState();
              break;
            case 24:
              this.begin("string");
              break;
            case 25:
              this.popState();
              break;
            case 26:
              return "STR";
            case 27:
              this.begin("class_name");
              break;
            case 28:
              return (this.popState(), 47);
            case 29:
              return (this.begin("point_start"), 44);
            case 30:
              return (this.begin("point_x"), 45);
            case 31:
              this.popState();
              break;
            case 32:
              (this.popState(), this.begin("point_y"));
              break;
            case 33:
              return (this.popState(), 46);
            case 34:
              return 28;
            case 35:
              return 4;
            case 36:
              return 11;
            case 37:
              return 64;
            case 38:
              return 10;
            case 39:
              return 65;
            case 40:
              return 65;
            case 41:
              return 14;
            case 42:
              return 13;
            case 43:
              return 67;
            case 44:
              return 66;
            case 45:
              return 12;
            case 46:
              return 8;
            case 47:
              return 5;
            case 48:
              return 18;
            case 49:
              return 56;
            case 50:
              return 63;
            case 51:
              return 57;
          }
        }, "anonymous"),
        rules: [
          /^(?:%%(?!\{)[^\n]*)/i,
          /^(?:[^\}]%%[^\n]*)/i,
          /^(?:[\n\r]+)/i,
          /^(?:%%[^\n]*)/i,
          /^(?:title\b)/i,
          /^(?:(?!\n||)*[^\n]*)/i,
          /^(?:accTitle\s*:\s*)/i,
          /^(?:(?!\n||)*[^\n]*)/i,
          /^(?:accDescr\s*:\s*)/i,
          /^(?:(?!\n||)*[^\n]*)/i,
          /^(?:accDescr\s*\{\s*)/i,
          /^(?:[\}])/i,
          /^(?:[^\}]*)/i,
          /^(?: *x-axis *)/i,
          /^(?: *y-axis *)/i,
          /^(?: *--+> *)/i,
          /^(?: *quadrant-1 *)/i,
          /^(?: *quadrant-2 *)/i,
          /^(?: *quadrant-3 *)/i,
          /^(?: *quadrant-4 *)/i,
          /^(?:classDef\b)/i,
          /^(?:["][`])/i,
          /^(?:[^`"]+)/i,
          /^(?:[`]["])/i,
          /^(?:["])/i,
          /^(?:["])/i,
          /^(?:[^"]*)/i,
          /^(?::::)/i,
          /^(?:^\w+)/i,
          /^(?:\s*:\s*\[\s*)/i,
          /^(?:(1)|(0(.\d+)?))/i,
          /^(?:\s*\] *)/i,
          /^(?:\s*,\s*)/i,
          /^(?:(1)|(0(.\d+)?))/i,
          /^(?: *quadrantChart *)/i,
          /^(?:[A-Za-z]+)/i,
          /^(?::)/i,
          /^(?:\+)/i,
          /^(?:,)/i,
          /^(?:=)/i,
          /^(?:=)/i,
          /^(?:\*)/i,
          /^(?:#)/i,
          /^(?:[\_])/i,
          /^(?:\.)/i,
          /^(?:&)/i,
          /^(?:-)/i,
          /^(?:[0-9]+)/i,
          /^(?:\s)/i,
          /^(?:;)/i,
          /^(?:[!"#$%&'*+,-.`?\\_/])/i,
          /^(?:$)/i,
        ],
        conditions: {
          class_name: { rules: [28], inclusive: !1 },
          point_y: { rules: [33], inclusive: !1 },
          point_x: { rules: [32], inclusive: !1 },
          point_start: { rules: [30, 31], inclusive: !1 },
          acc_descr_multiline: { rules: [11, 12], inclusive: !1 },
          acc_descr: { rules: [9], inclusive: !1 },
          acc_title: { rules: [7], inclusive: !1 },
          title: { rules: [5], inclusive: !1 },
          md_string: { rules: [22, 23], inclusive: !1 },
          string: { rules: [25, 26], inclusive: !1 },
          INITIAL: {
            rules: [
              0, 1, 2, 3, 4, 6, 8, 10, 13, 14, 15, 16, 17, 18, 19, 20, 21, 24, 27, 29, 34, 35, 36, 37, 38, 39, 40, 41,
              42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
            ],
            inclusive: !0,
          },
        },
      };
      return Y;
    })();
  Ct.lexer = Te;
  function mt() {
    this.yy = {};
  }
  return (o(mt, "Parser"), (mt.prototype = Ct), (Ct.Parser = mt), new mt());
})();
It.parser = It;
var De = It,
  z = Le(),
  lt,
  we =
    ((lt = class {
      constructor() {
        ((this.classes = new Map()),
          (this.config = this.getDefaultConfig()),
          (this.themeConfig = this.getDefaultThemeConfig()),
          (this.data = this.getDefaultData()));
      }
      getDefaultData() {
        return {
          titleText: "",
          quadrant1Text: "",
          quadrant2Text: "",
          quadrant3Text: "",
          quadrant4Text: "",
          xAxisLeftText: "",
          xAxisRightText: "",
          yAxisBottomText: "",
          yAxisTopText: "",
          points: [],
        };
      }
      getDefaultConfig() {
        var a, f, d, c, p, y, _, n, A, u, m, b, T, q, h, N, M, j;
        return {
          showXAxis: !0,
          showYAxis: !0,
          showTitle: !0,
          chartHeight: ((a = D.quadrantChart) == null ? void 0 : a.chartWidth) || 500,
          chartWidth: ((f = D.quadrantChart) == null ? void 0 : f.chartHeight) || 500,
          titlePadding: ((d = D.quadrantChart) == null ? void 0 : d.titlePadding) || 10,
          titleFontSize: ((c = D.quadrantChart) == null ? void 0 : c.titleFontSize) || 20,
          quadrantPadding: ((p = D.quadrantChart) == null ? void 0 : p.quadrantPadding) || 5,
          xAxisLabelPadding: ((y = D.quadrantChart) == null ? void 0 : y.xAxisLabelPadding) || 5,
          yAxisLabelPadding: ((_ = D.quadrantChart) == null ? void 0 : _.yAxisLabelPadding) || 5,
          xAxisLabelFontSize: ((n = D.quadrantChart) == null ? void 0 : n.xAxisLabelFontSize) || 16,
          yAxisLabelFontSize: ((A = D.quadrantChart) == null ? void 0 : A.yAxisLabelFontSize) || 16,
          quadrantLabelFontSize: ((u = D.quadrantChart) == null ? void 0 : u.quadrantLabelFontSize) || 16,
          quadrantTextTopPadding: ((m = D.quadrantChart) == null ? void 0 : m.quadrantTextTopPadding) || 5,
          pointTextPadding: ((b = D.quadrantChart) == null ? void 0 : b.pointTextPadding) || 5,
          pointLabelFontSize: ((T = D.quadrantChart) == null ? void 0 : T.pointLabelFontSize) || 12,
          pointRadius: ((q = D.quadrantChart) == null ? void 0 : q.pointRadius) || 5,
          xAxisPosition: ((h = D.quadrantChart) == null ? void 0 : h.xAxisPosition) || "top",
          yAxisPosition: ((N = D.quadrantChart) == null ? void 0 : N.yAxisPosition) || "left",
          quadrantInternalBorderStrokeWidth:
            ((M = D.quadrantChart) == null ? void 0 : M.quadrantInternalBorderStrokeWidth) || 1,
          quadrantExternalBorderStrokeWidth:
            ((j = D.quadrantChart) == null ? void 0 : j.quadrantExternalBorderStrokeWidth) || 2,
        };
      }
      getDefaultThemeConfig() {
        return {
          quadrant1Fill: z.quadrant1Fill,
          quadrant2Fill: z.quadrant2Fill,
          quadrant3Fill: z.quadrant3Fill,
          quadrant4Fill: z.quadrant4Fill,
          quadrant1TextFill: z.quadrant1TextFill,
          quadrant2TextFill: z.quadrant2TextFill,
          quadrant3TextFill: z.quadrant3TextFill,
          quadrant4TextFill: z.quadrant4TextFill,
          quadrantPointFill: z.quadrantPointFill,
          quadrantPointTextFill: z.quadrantPointTextFill,
          quadrantXAxisTextFill: z.quadrantXAxisTextFill,
          quadrantYAxisTextFill: z.quadrantYAxisTextFill,
          quadrantTitleFill: z.quadrantTitleFill,
          quadrantInternalBorderStrokeFill: z.quadrantInternalBorderStrokeFill,
          quadrantExternalBorderStrokeFill: z.quadrantExternalBorderStrokeFill,
        };
      }
      clear() {
        ((this.config = this.getDefaultConfig()),
          (this.themeConfig = this.getDefaultThemeConfig()),
          (this.data = this.getDefaultData()),
          (this.classes = new Map()),
          kt.info("clear called"));
      }
      setData(a) {
        this.data = { ...this.data, ...a };
      }
      addPoints(a) {
        this.data.points = [...a, ...this.data.points];
      }
      addClass(a, f) {
        this.classes.set(a, f);
      }
      setConfig(a) {
        (kt.trace("setConfig called with: ", a), (this.config = { ...this.config, ...a }));
      }
      setThemeConfig(a) {
        (kt.trace("setThemeConfig called with: ", a), (this.themeConfig = { ...this.themeConfig, ...a }));
      }
      calculateSpace(a, f, d, c) {
        const p = this.config.xAxisLabelPadding * 2 + this.config.xAxisLabelFontSize,
          y = { top: a === "top" && f ? p : 0, bottom: a === "bottom" && f ? p : 0 },
          _ = this.config.yAxisLabelPadding * 2 + this.config.yAxisLabelFontSize,
          n = {
            left: this.config.yAxisPosition === "left" && d ? _ : 0,
            right: this.config.yAxisPosition === "right" && d ? _ : 0,
          },
          A = this.config.titleFontSize + this.config.titlePadding * 2,
          u = { top: c ? A : 0 },
          m = this.config.quadrantPadding + n.left,
          b = this.config.quadrantPadding + y.top + u.top,
          T = this.config.chartWidth - this.config.quadrantPadding * 2 - n.left - n.right,
          q = this.config.chartHeight - this.config.quadrantPadding * 2 - y.top - y.bottom - u.top,
          h = T / 2,
          N = q / 2;
        return {
          xAxisSpace: y,
          yAxisSpace: n,
          titleSpace: u,
          quadrantSpace: {
            quadrantLeft: m,
            quadrantTop: b,
            quadrantWidth: T,
            quadrantHalfWidth: h,
            quadrantHeight: q,
            quadrantHalfHeight: N,
          },
        };
      }
      getAxisLabels(a, f, d, c) {
        const { quadrantSpace: p, titleSpace: y } = c,
          {
            quadrantHalfHeight: _,
            quadrantHeight: n,
            quadrantLeft: A,
            quadrantHalfWidth: u,
            quadrantTop: m,
            quadrantWidth: b,
          } = p,
          T = !!this.data.xAxisRightText,
          q = !!this.data.yAxisTopText,
          h = [];
        return (
          this.data.xAxisLeftText &&
            f &&
            h.push({
              text: this.data.xAxisLeftText,
              fill: this.themeConfig.quadrantXAxisTextFill,
              x: A + (T ? u / 2 : 0),
              y:
                a === "top"
                  ? this.config.xAxisLabelPadding + y.top
                  : this.config.xAxisLabelPadding + m + n + this.config.quadrantPadding,
              fontSize: this.config.xAxisLabelFontSize,
              verticalPos: T ? "center" : "left",
              horizontalPos: "top",
              rotation: 0,
            }),
          this.data.xAxisRightText &&
            f &&
            h.push({
              text: this.data.xAxisRightText,
              fill: this.themeConfig.quadrantXAxisTextFill,
              x: A + u + (T ? u / 2 : 0),
              y:
                a === "top"
                  ? this.config.xAxisLabelPadding + y.top
                  : this.config.xAxisLabelPadding + m + n + this.config.quadrantPadding,
              fontSize: this.config.xAxisLabelFontSize,
              verticalPos: T ? "center" : "left",
              horizontalPos: "top",
              rotation: 0,
            }),
          this.data.yAxisBottomText &&
            d &&
            h.push({
              text: this.data.yAxisBottomText,
              fill: this.themeConfig.quadrantYAxisTextFill,
              x:
                this.config.yAxisPosition === "left"
                  ? this.config.yAxisLabelPadding
                  : this.config.yAxisLabelPadding + A + b + this.config.quadrantPadding,
              y: m + n - (q ? _ / 2 : 0),
              fontSize: this.config.yAxisLabelFontSize,
              verticalPos: q ? "center" : "left",
              horizontalPos: "top",
              rotation: -90,
            }),
          this.data.yAxisTopText &&
            d &&
            h.push({
              text: this.data.yAxisTopText,
              fill: this.themeConfig.quadrantYAxisTextFill,
              x:
                this.config.yAxisPosition === "left"
                  ? this.config.yAxisLabelPadding
                  : this.config.yAxisLabelPadding + A + b + this.config.quadrantPadding,
              y: m + _ - (q ? _ / 2 : 0),
              fontSize: this.config.yAxisLabelFontSize,
              verticalPos: q ? "center" : "left",
              horizontalPos: "top",
              rotation: -90,
            }),
          h
        );
      }
      getQuadrants(a) {
        const { quadrantSpace: f } = a,
          { quadrantHalfHeight: d, quadrantLeft: c, quadrantHalfWidth: p, quadrantTop: y } = f,
          _ = [
            {
              text: {
                text: this.data.quadrant1Text,
                fill: this.themeConfig.quadrant1TextFill,
                x: 0,
                y: 0,
                fontSize: this.config.quadrantLabelFontSize,
                verticalPos: "center",
                horizontalPos: "middle",
                rotation: 0,
              },
              x: c + p,
              y,
              width: p,
              height: d,
              fill: this.themeConfig.quadrant1Fill,
            },
            {
              text: {
                text: this.data.quadrant2Text,
                fill: this.themeConfig.quadrant2TextFill,
                x: 0,
                y: 0,
                fontSize: this.config.quadrantLabelFontSize,
                verticalPos: "center",
                horizontalPos: "middle",
                rotation: 0,
              },
              x: c,
              y,
              width: p,
              height: d,
              fill: this.themeConfig.quadrant2Fill,
            },
            {
              text: {
                text: this.data.quadrant3Text,
                fill: this.themeConfig.quadrant3TextFill,
                x: 0,
                y: 0,
                fontSize: this.config.quadrantLabelFontSize,
                verticalPos: "center",
                horizontalPos: "middle",
                rotation: 0,
              },
              x: c,
              y: y + d,
              width: p,
              height: d,
              fill: this.themeConfig.quadrant3Fill,
            },
            {
              text: {
                text: this.data.quadrant4Text,
                fill: this.themeConfig.quadrant4TextFill,
                x: 0,
                y: 0,
                fontSize: this.config.quadrantLabelFontSize,
                verticalPos: "center",
                horizontalPos: "middle",
                rotation: 0,
              },
              x: c + p,
              y: y + d,
              width: p,
              height: d,
              fill: this.themeConfig.quadrant4Fill,
            },
          ];
        for (const n of _)
          ((n.text.x = n.x + n.width / 2),
            this.data.points.length === 0
              ? ((n.text.y = n.y + n.height / 2), (n.text.horizontalPos = "middle"))
              : ((n.text.y = n.y + this.config.quadrantTextTopPadding), (n.text.horizontalPos = "top")));
        return _;
      }
      getQuadrantPoints(a) {
        const { quadrantSpace: f } = a,
          { quadrantHeight: d, quadrantLeft: c, quadrantTop: p, quadrantWidth: y } = f,
          _ = ee()
            .domain([0, 1])
            .range([c, y + c]),
          n = ee()
            .domain([0, 1])
            .range([d + p, p]);
        return this.data.points.map((u) => {
          var T, q, h, N;
          const m = this.classes.get(u.className);
          return (
            m && (u = { ...m, ...u }),
            {
              x: _(u.x),
              y: n(u.y),
              fill: (T = u.color) != null ? T : this.themeConfig.quadrantPointFill,
              radius: (q = u.radius) != null ? q : this.config.pointRadius,
              text: {
                text: u.text,
                fill: this.themeConfig.quadrantPointTextFill,
                x: _(u.x),
                y: n(u.y) + this.config.pointTextPadding,
                verticalPos: "center",
                horizontalPos: "top",
                fontSize: this.config.pointLabelFontSize,
                rotation: 0,
              },
              strokeColor: (h = u.strokeColor) != null ? h : this.themeConfig.quadrantPointFill,
              strokeWidth: (N = u.strokeWidth) != null ? N : "0px",
            }
          );
        });
      }
      getBorders(a) {
        const f = this.config.quadrantExternalBorderStrokeWidth / 2,
          { quadrantSpace: d } = a,
          {
            quadrantHalfHeight: c,
            quadrantHeight: p,
            quadrantLeft: y,
            quadrantHalfWidth: _,
            quadrantTop: n,
            quadrantWidth: A,
          } = d;
        return [
          {
            strokeFill: this.themeConfig.quadrantExternalBorderStrokeFill,
            strokeWidth: this.config.quadrantExternalBorderStrokeWidth,
            x1: y - f,
            y1: n,
            x2: y + A + f,
            y2: n,
          },
          {
            strokeFill: this.themeConfig.quadrantExternalBorderStrokeFill,
            strokeWidth: this.config.quadrantExternalBorderStrokeWidth,
            x1: y + A,
            y1: n + f,
            x2: y + A,
            y2: n + p - f,
          },
          {
            strokeFill: this.themeConfig.quadrantExternalBorderStrokeFill,
            strokeWidth: this.config.quadrantExternalBorderStrokeWidth,
            x1: y - f,
            y1: n + p,
            x2: y + A + f,
            y2: n + p,
          },
          {
            strokeFill: this.themeConfig.quadrantExternalBorderStrokeFill,
            strokeWidth: this.config.quadrantExternalBorderStrokeWidth,
            x1: y,
            y1: n + f,
            x2: y,
            y2: n + p - f,
          },
          {
            strokeFill: this.themeConfig.quadrantInternalBorderStrokeFill,
            strokeWidth: this.config.quadrantInternalBorderStrokeWidth,
            x1: y + _,
            y1: n + f,
            x2: y + _,
            y2: n + p - f,
          },
          {
            strokeFill: this.themeConfig.quadrantInternalBorderStrokeFill,
            strokeWidth: this.config.quadrantInternalBorderStrokeWidth,
            x1: y + f,
            y1: n + c,
            x2: y + A - f,
            y2: n + c,
          },
        ];
      }
      getTitle(a) {
        if (a)
          return {
            text: this.data.titleText,
            fill: this.themeConfig.quadrantTitleFill,
            fontSize: this.config.titleFontSize,
            horizontalPos: "top",
            verticalPos: "center",
            rotation: 0,
            y: this.config.titlePadding,
            x: this.config.chartWidth / 2,
          };
      }
      build() {
        const a = this.config.showXAxis && !!(this.data.xAxisLeftText || this.data.xAxisRightText),
          f = this.config.showYAxis && !!(this.data.yAxisTopText || this.data.yAxisBottomText),
          d = this.config.showTitle && !!this.data.titleText,
          c = this.data.points.length > 0 ? "bottom" : this.config.xAxisPosition,
          p = this.calculateSpace(c, a, f, d);
        return {
          points: this.getQuadrantPoints(p),
          quadrants: this.getQuadrants(p),
          axisLabels: this.getAxisLabels(c, a, f, p),
          borderLines: this.getBorders(p),
          title: this.getTitle(d),
        };
      }
    }),
    o(lt, "QuadrantBuilder"),
    lt),
  ct,
  At =
    ((ct = class extends Error {
      constructor(a, f, d) {
        (super(`value for ${a} ${f} is invalid, please use a valid ${d}`), (this.name = "InvalidStyleError"));
      }
    }),
    o(ct, "InvalidStyleError"),
    ct);
function Vt(t) {
  return !/^#?([\dA-Fa-f]{6}|[\dA-Fa-f]{3})$/.test(t);
}
o(Vt, "validateHexCode");
function ae(t) {
  return !/^\d+$/.test(t);
}
o(ae, "validateNumber");
function ne(t) {
  return !/^\d+px$/.test(t);
}
o(ne, "validateSizeInPixels");
var ze = Rt();
function Q(t) {
  return Ee(t.trim(), ze);
}
o(Q, "textSanitizer");
var w = new we();
function se(t) {
  w.setData({ quadrant1Text: Q(t.text) });
}
o(se, "setQuadrant1Text");
function re(t) {
  w.setData({ quadrant2Text: Q(t.text) });
}
o(re, "setQuadrant2Text");
function oe(t) {
  w.setData({ quadrant3Text: Q(t.text) });
}
o(oe, "setQuadrant3Text");
function le(t) {
  w.setData({ quadrant4Text: Q(t.text) });
}
o(le, "setQuadrant4Text");
function ce(t) {
  w.setData({ xAxisLeftText: Q(t.text) });
}
o(ce, "setXAxisLeftText");
function he(t) {
  w.setData({ xAxisRightText: Q(t.text) });
}
o(he, "setXAxisRightText");
function de(t) {
  w.setData({ yAxisTopText: Q(t.text) });
}
o(de, "setYAxisTopText");
function ue(t) {
  w.setData({ yAxisBottomText: Q(t.text) });
}
o(ue, "setYAxisBottomText");
function Ft(t) {
  const a = {};
  for (const f of t) {
    const [d, c] = f.trim().split(/\s*:\s*/);
    if (d === "radius") {
      if (ae(c)) throw new At(d, c, "number");
      a.radius = parseInt(c);
    } else if (d === "color") {
      if (Vt(c)) throw new At(d, c, "hex code");
      a.color = c;
    } else if (d === "stroke-color") {
      if (Vt(c)) throw new At(d, c, "hex code");
      a.strokeColor = c;
    } else if (d === "stroke-width") {
      if (ne(c)) throw new At(d, c, "number of pixels (eg. 10px)");
      a.strokeWidth = c;
    } else throw new Error(`style named ${d} is not supported.`);
  }
  return a;
}
o(Ft, "parseStyles");
function fe(t, a, f, d, c) {
  const p = Ft(c);
  w.addPoints([{ x: f, y: d, text: Q(t.text), className: a, ...p }]);
}
o(fe, "addPoint");
function xe(t, a) {
  w.addClass(t, Ft(a));
}
o(xe, "addClass");
function ge(t) {
  w.setConfig({ chartWidth: t });
}
o(ge, "setWidth");
function pe(t) {
  w.setConfig({ chartHeight: t });
}
o(pe, "setHeight");
function ye() {
  const t = Rt(),
    { themeVariables: a, quadrantChart: f } = t;
  return (
    f && w.setConfig(f),
    w.setThemeConfig({
      quadrant1Fill: a.quadrant1Fill,
      quadrant2Fill: a.quadrant2Fill,
      quadrant3Fill: a.quadrant3Fill,
      quadrant4Fill: a.quadrant4Fill,
      quadrant1TextFill: a.quadrant1TextFill,
      quadrant2TextFill: a.quadrant2TextFill,
      quadrant3TextFill: a.quadrant3TextFill,
      quadrant4TextFill: a.quadrant4TextFill,
      quadrantPointFill: a.quadrantPointFill,
      quadrantPointTextFill: a.quadrantPointTextFill,
      quadrantXAxisTextFill: a.quadrantXAxisTextFill,
      quadrantYAxisTextFill: a.quadrantYAxisTextFill,
      quadrantExternalBorderStrokeFill: a.quadrantExternalBorderStrokeFill,
      quadrantInternalBorderStrokeFill: a.quadrantInternalBorderStrokeFill,
      quadrantTitleFill: a.quadrantTitleFill,
    }),
    w.setData({ titleText: ie() }),
    w.build()
  );
}
o(ye, "getQuadrantData");
var Ie = o(function () {
    (w.clear(), Ce());
  }, "clear"),
  Ve = {
    setWidth: ge,
    setHeight: pe,
    setQuadrant1Text: se,
    setQuadrant2Text: re,
    setQuadrant3Text: oe,
    setQuadrant4Text: le,
    setXAxisLeftText: ce,
    setXAxisRightText: he,
    setYAxisTopText: de,
    setYAxisBottomText: ue,
    parseStyles: Ft,
    addPoint: fe,
    addClass: xe,
    getQuadrantData: ye,
    clear: Ie,
    setAccTitle: Pe,
    getAccTitle: Fe,
    setDiagramTitle: ke,
    getDiagramTitle: ie,
    getAccDescription: Ae,
    setAccDescription: Se,
  },
  Re = o((t, a, f, d) => {
    var ut, ft, xt, gt, pt, R;
    function c(e) {
      return e === "top" ? "hanging" : "middle";
    }
    o(c, "getDominantBaseLine");
    function p(e) {
      return e === "left" ? "start" : "middle";
    }
    o(p, "getTextAnchor");
    function y(e) {
      return `translate(${e.x}, ${e.y}) rotate(${e.rotation || 0})`;
    }
    o(y, "getTransformation");
    const _ = Rt();
    kt.debug(
      `Rendering quadrant chart
` + t,
    );
    const n = _.securityLevel;
    let A;
    n === "sandbox" && (A = zt("#i" + a));
    const m = (n === "sandbox" ? zt(A.nodes()[0].contentDocument.body) : zt("body")).select(`[id="${a}"]`),
      b = m.append("g").attr("class", "main"),
      T = (ft = (ut = _.quadrantChart) == null ? void 0 : ut.chartWidth) != null ? ft : 500,
      q = (gt = (xt = _.quadrantChart) == null ? void 0 : xt.chartHeight) != null ? gt : 500;
    (ve(m, q, T, (R = (pt = _.quadrantChart) == null ? void 0 : pt.useMaxWidth) != null ? R : !0),
      m.attr("viewBox", "0 0 " + T + " " + q),
      d.db.setHeight(q),
      d.db.setWidth(T));
    const h = d.db.getQuadrantData(),
      N = b.append("g").attr("class", "quadrants"),
      M = b.append("g").attr("class", "border"),
      j = b.append("g").attr("class", "data-points"),
      Tt = b.append("g").attr("class", "labels"),
      qt = b.append("g").attr("class", "title");
    (h.title &&
      qt
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", h.title.fill)
        .attr("font-size", h.title.fontSize)
        .attr("dominant-baseline", c(h.title.horizontalPos))
        .attr("text-anchor", p(h.title.verticalPos))
        .attr("transform", y(h.title))
        .text(h.title.text),
      h.borderLines &&
        M.selectAll("line")
          .data(h.borderLines)
          .enter()
          .append("line")
          .attr("x1", (e) => e.x1)
          .attr("y1", (e) => e.y1)
          .attr("x2", (e) => e.x2)
          .attr("y2", (e) => e.y2)
          .style("stroke", (e) => e.strokeFill)
          .style("stroke-width", (e) => e.strokeWidth));
    const ht = N.selectAll("g.quadrant").data(h.quadrants).enter().append("g").attr("class", "quadrant");
    (ht
      .append("rect")
      .attr("x", (e) => e.x)
      .attr("y", (e) => e.y)
      .attr("width", (e) => e.width)
      .attr("height", (e) => e.height)
      .attr("fill", (e) => e.fill),
      ht
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", (e) => e.text.fill)
        .attr("font-size", (e) => e.text.fontSize)
        .attr("dominant-baseline", (e) => c(e.text.horizontalPos))
        .attr("text-anchor", (e) => p(e.text.verticalPos))
        .attr("transform", (e) => y(e.text))
        .text((e) => e.text.text),
      Tt.selectAll("g.label")
        .data(h.axisLabels)
        .enter()
        .append("g")
        .attr("class", "label")
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .text((e) => e.text)
        .attr("fill", (e) => e.fill)
        .attr("font-size", (e) => e.fontSize)
        .attr("dominant-baseline", (e) => c(e.horizontalPos))
        .attr("text-anchor", (e) => p(e.verticalPos))
        .attr("transform", (e) => y(e)));
    const dt = j.selectAll("g.data-point").data(h.points).enter().append("g").attr("class", "data-point");
    (dt
      .append("circle")
      .attr("cx", (e) => e.x)
      .attr("cy", (e) => e.y)
      .attr("r", (e) => e.radius)
      .attr("fill", (e) => e.fill)
      .attr("stroke", (e) => e.strokeColor)
      .attr("stroke-width", (e) => e.strokeWidth),
      dt
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .text((e) => e.text.text)
        .attr("fill", (e) => e.text.fill)
        .attr("font-size", (e) => e.text.fontSize)
        .attr("dominant-baseline", (e) => c(e.text.horizontalPos))
        .attr("text-anchor", (e) => p(e.text.verticalPos))
        .attr("transform", (e) => y(e.text)));
  }, "draw"),
  Be = { draw: Re },
  He = { parser: De, db: Ve, renderer: Be, styles: o(() => "", "styles") };
export { He as diagram };
