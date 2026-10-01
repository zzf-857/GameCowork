import {
  ad as fn,
  ae as an,
  af as y,
  ag as ln,
  ah as z,
  ai as E,
  aj as _,
  ak as un,
  al as L,
  am as rn,
  an as F,
  ao as o,
  ap as sn,
  aq as on,
  ar as tn,
} from "./VscTheme-BExNMG_K.js";
(function () {
  var u =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  u.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
})();
try {
  (function () {
    var u =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      t = new u.Error().stack;
    t &&
      ((u._sentryDebugIds = u._sentryDebugIds || {}),
      (u._sentryDebugIds[t] = "545ba40d-5843-4fc3-ac81-c9cd09626d3e"),
      (u._sentryDebugIdIdentifier = "sentry-dbid-545ba40d-5843-4fc3-ac81-c9cd09626d3e"));
  })();
} catch {}
function cn(u) {
  return u.innerRadius;
}
function dn(u) {
  return u.outerRadius;
}
function yn(u) {
  return u.startAngle;
}
function gn(u) {
  return u.endAngle;
}
function pn(u) {
  return u && u.padAngle;
}
function hn(u, t, P, I, v, b, N, a) {
  var S = P - u,
    s = I - t,
    n = N - v,
    p = a - b,
    i = p * S - n * s;
  if (!(i * i < y)) return ((i = (n * (t - b) - p * (u - v)) / i), [u + i * S, t + i * s]);
}
function Q(u, t, P, I, v, b, N) {
  var a = u - P,
    S = t - I,
    s = (N ? b : -b) / F(a * a + S * S),
    n = s * S,
    p = -s * a,
    i = u + n,
    f = t + p,
    c = P + n,
    d = I + p,
    O = (i + c) / 2,
    l = (f + d) / 2,
    h = c - i,
    g = d - f,
    R = h * h + g * g,
    T = v - b,
    A = i * d - c * f,
    q = (g < 0 ? -1 : 1) * F(tn(0, T * T * R - A * A)),
    j = (A * g - h * q) / R,
    k = (-A * h - g * q) / R,
    w = (A * g + h * q) / R,
    m = (-A * h + g * q) / R,
    x = j - O,
    e = k - l,
    r = w - O,
    Y = m - l;
  return (
    x * x + e * e > r * r + Y * Y && ((j = w), (k = m)),
    { cx: j, cy: k, x01: -n, y01: -p, x11: j * (v / T - 1), y11: k * (v / T - 1) }
  );
}
function xn() {
  var u = cn,
    t = dn,
    P = L(0),
    I = null,
    v = yn,
    b = gn,
    N = pn,
    a = null,
    S = fn(s);
  function s() {
    var n,
      p,
      i = +u.apply(this, arguments),
      f = +t.apply(this, arguments),
      c = v.apply(this, arguments) - an,
      d = b.apply(this, arguments) - an,
      O = un(d - c),
      l = d > c;
    if ((a || (a = n = S()), f < i && ((p = f), (f = i), (i = p)), !(f > y))) a.moveTo(0, 0);
    else if (O > ln - y)
      (a.moveTo(f * z(c), f * E(c)),
        a.arc(0, 0, f, c, d, !l),
        i > y && (a.moveTo(i * z(d), i * E(d)), a.arc(0, 0, i, d, c, l)));
    else {
      var h = c,
        g = d,
        R = c,
        T = d,
        A = O,
        q = O,
        j = N.apply(this, arguments) / 2,
        k = j > y && (I ? +I.apply(this, arguments) : F(i * i + f * f)),
        w = _(un(f - i) / 2, +P.apply(this, arguments)),
        m = w,
        x = w,
        e,
        r;
      if (k > y) {
        var Y = sn((k / i) * E(j)),
          G = sn((k / f) * E(j));
        ((A -= Y * 2) > y ? ((Y *= l ? 1 : -1), (R += Y), (T -= Y)) : ((A = 0), (R = T = (c + d) / 2)),
          (q -= G * 2) > y ? ((G *= l ? 1 : -1), (h += G), (g -= G)) : ((q = 0), (h = g = (c + d) / 2)));
      }
      var B = f * z(h),
        C = f * E(h),
        H = i * z(T),
        J = i * E(T);
      if (w > y) {
        var K = f * z(g),
          M = f * E(g),
          U = i * z(R),
          V = i * E(R),
          D;
        if (O < rn)
          if ((D = hn(B, C, U, V, K, M, H, J))) {
            var W = B - D[0],
              X = C - D[1],
              Z = K - D[0],
              $ = M - D[1],
              nn = 1 / E(on((W * Z + X * $) / (F(W * W + X * X) * F(Z * Z + $ * $))) / 2),
              en = F(D[0] * D[0] + D[1] * D[1]);
            ((m = _(w, (i - en) / (nn - 1))), (x = _(w, (f - en) / (nn + 1))));
          } else m = x = 0;
      }
      (q > y
        ? x > y
          ? ((e = Q(U, V, B, C, f, x, l)),
            (r = Q(K, M, H, J, f, x, l)),
            a.moveTo(e.cx + e.x01, e.cy + e.y01),
            x < w
              ? a.arc(e.cx, e.cy, x, o(e.y01, e.x01), o(r.y01, r.x01), !l)
              : (a.arc(e.cx, e.cy, x, o(e.y01, e.x01), o(e.y11, e.x11), !l),
                a.arc(0, 0, f, o(e.cy + e.y11, e.cx + e.x11), o(r.cy + r.y11, r.cx + r.x11), !l),
                a.arc(r.cx, r.cy, x, o(r.y11, r.x11), o(r.y01, r.x01), !l)))
          : (a.moveTo(B, C), a.arc(0, 0, f, h, g, !l))
        : a.moveTo(B, C),
        !(i > y) || !(A > y)
          ? a.lineTo(H, J)
          : m > y
            ? ((e = Q(H, J, K, M, i, -m, l)),
              (r = Q(B, C, U, V, i, -m, l)),
              a.lineTo(e.cx + e.x01, e.cy + e.y01),
              m < w
                ? a.arc(e.cx, e.cy, m, o(e.y01, e.x01), o(r.y01, r.x01), !l)
                : (a.arc(e.cx, e.cy, m, o(e.y01, e.x01), o(e.y11, e.x11), !l),
                  a.arc(0, 0, i, o(e.cy + e.y11, e.cx + e.x11), o(r.cy + r.y11, r.cx + r.x11), l),
                  a.arc(r.cx, r.cy, m, o(r.y11, r.x11), o(r.y01, r.x01), !l)))
            : a.arc(0, 0, i, T, R, l));
    }
    if ((a.closePath(), n)) return ((a = null), n + "" || null);
  }
  return (
    (s.centroid = function () {
      var n = (+u.apply(this, arguments) + +t.apply(this, arguments)) / 2,
        p = (+v.apply(this, arguments) + +b.apply(this, arguments)) / 2 - rn / 2;
      return [z(p) * n, E(p) * n];
    }),
    (s.innerRadius = function (n) {
      return arguments.length ? ((u = typeof n == "function" ? n : L(+n)), s) : u;
    }),
    (s.outerRadius = function (n) {
      return arguments.length ? ((t = typeof n == "function" ? n : L(+n)), s) : t;
    }),
    (s.cornerRadius = function (n) {
      return arguments.length ? ((P = typeof n == "function" ? n : L(+n)), s) : P;
    }),
    (s.padRadius = function (n) {
      return arguments.length ? ((I = n == null ? null : typeof n == "function" ? n : L(+n)), s) : I;
    }),
    (s.startAngle = function (n) {
      return arguments.length ? ((v = typeof n == "function" ? n : L(+n)), s) : v;
    }),
    (s.endAngle = function (n) {
      return arguments.length ? ((b = typeof n == "function" ? n : L(+n)), s) : b;
    }),
    (s.padAngle = function (n) {
      return arguments.length ? ((N = typeof n == "function" ? n : L(+n)), s) : N;
    }),
    (s.context = function (n) {
      return arguments.length ? ((a = n == null ? null : n), s) : a;
    }),
    s
  );
}
export { xn as d };
