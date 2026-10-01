import {
  a5 as fn,
  a6 as an,
  a7 as y,
  a8 as ln,
  a9 as z,
  aa as E,
  ab as _,
  ac as un,
  ad as N,
  ae as rn,
  af as F,
  ag as o,
  ah as sn,
  ai as on,
  aj as tn,
} from "./registry-CHHSpXp3.js";
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
  u.SENTRY_RELEASE = { id: "a9a604ff7ed4f880dc7535e2471d79d2388dc4a0" };
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
      (u._sentryDebugIds[t] = "5ffbf498-7f33-48f7-b952-6882ec1dd61d"),
      (u._sentryDebugIdIdentifier = "sentry-dbid-5ffbf498-7f33-48f7-b952-6882ec1dd61d"));
  })();
} catch {}
function dn(u) {
  return u.innerRadius;
}
function cn(u) {
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
function hn(u, t, P, I, v, b, O, a) {
  var S = P - u,
    s = I - t,
    n = O - v,
    p = a - b,
    i = p * S - n * s;
  if (!(i * i < y)) return ((i = (n * (t - b) - p * (u - v)) / i), [u + i * S, t + i * s]);
}
function Q(u, t, P, I, v, b, O) {
  var a = u - P,
    S = t - I,
    s = (O ? b : -b) / F(a * a + S * S),
    n = s * S,
    p = -s * a,
    i = u + n,
    f = t + p,
    d = P + n,
    c = I + p,
    Y = (i + d) / 2,
    l = (f + c) / 2,
    h = d - i,
    g = c - f,
    R = h * h + g * g,
    T = v - b,
    A = i * c - d * f,
    j = (g < 0 ? -1 : 1) * F(tn(0, T * T * R - A * A)),
    q = (A * g - h * j) / R,
    L = (-A * h - g * j) / R,
    w = (A * g + h * j) / R,
    m = (-A * h + g * j) / R,
    x = q - Y,
    e = L - l,
    r = w - Y,
    k = m - l;
  return (
    x * x + e * e > r * r + k * k && ((q = w), (L = m)),
    { cx: q, cy: L, x01: -n, y01: -p, x11: q * (v / T - 1), y11: L * (v / T - 1) }
  );
}
function xn() {
  var u = dn,
    t = cn,
    P = N(0),
    I = null,
    v = yn,
    b = gn,
    O = pn,
    a = null,
    S = fn(s);
  function s() {
    var n,
      p,
      i = +u.apply(this, arguments),
      f = +t.apply(this, arguments),
      d = v.apply(this, arguments) - an,
      c = b.apply(this, arguments) - an,
      Y = un(c - d),
      l = c > d;
    if ((a || (a = n = S()), f < i && ((p = f), (f = i), (i = p)), !(f > y))) a.moveTo(0, 0);
    else if (Y > ln - y)
      (a.moveTo(f * z(d), f * E(d)),
        a.arc(0, 0, f, d, c, !l),
        i > y && (a.moveTo(i * z(c), i * E(c)), a.arc(0, 0, i, c, d, l)));
    else {
      var h = d,
        g = c,
        R = d,
        T = c,
        A = Y,
        j = Y,
        q = O.apply(this, arguments) / 2,
        L = q > y && (I ? +I.apply(this, arguments) : F(i * i + f * f)),
        w = _(un(f - i) / 2, +P.apply(this, arguments)),
        m = w,
        x = w,
        e,
        r;
      if (L > y) {
        var k = sn((L / i) * E(q)),
          G = sn((L / f) * E(q));
        ((A -= k * 2) > y ? ((k *= l ? 1 : -1), (R += k), (T -= k)) : ((A = 0), (R = T = (d + c) / 2)),
          (j -= G * 2) > y ? ((G *= l ? 1 : -1), (h += G), (g -= G)) : ((j = 0), (h = g = (d + c) / 2)));
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
        if (Y < rn)
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
      (j > y
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
      return arguments.length ? ((u = typeof n == "function" ? n : N(+n)), s) : u;
    }),
    (s.outerRadius = function (n) {
      return arguments.length ? ((t = typeof n == "function" ? n : N(+n)), s) : t;
    }),
    (s.cornerRadius = function (n) {
      return arguments.length ? ((P = typeof n == "function" ? n : N(+n)), s) : P;
    }),
    (s.padRadius = function (n) {
      return arguments.length ? ((I = n == null ? null : typeof n == "function" ? n : N(+n)), s) : I;
    }),
    (s.startAngle = function (n) {
      return arguments.length ? ((v = typeof n == "function" ? n : N(+n)), s) : v;
    }),
    (s.endAngle = function (n) {
      return arguments.length ? ((b = typeof n == "function" ? n : N(+n)), s) : b;
    }),
    (s.padAngle = function (n) {
      return arguments.length ? ((O = typeof n == "function" ? n : N(+n)), s) : O;
    }),
    (s.context = function (n) {
      return arguments.length ? ((a = n == null ? null : n), s) : a;
    }),
    s
  );
}
export { xn as d };
