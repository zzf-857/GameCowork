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
} from "./VscTheme-B-CSeuv5.js";
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
      (u._sentryDebugIds[t] = "545ba40d-5843-4fc3-ac81-c9cd09626d3e"),
      (u._sentryDebugIdIdentifier = "sentry-dbid-545ba40d-5843-4fc3-ac81-c9cd09626d3e"));
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
function hn(u, t, P, I, v, R, N, a) {
  var S = P - u,
    s = I - t,
    n = N - v,
    p = a - R,
    i = p * S - n * s;
  if (!(i * i < y)) return ((i = (n * (t - R) - p * (u - v)) / i), [u + i * S, t + i * s]);
}
function Q(u, t, P, I, v, R, N) {
  var a = u - P,
    S = t - I,
    s = (N ? R : -R) / F(a * a + S * S),
    n = s * S,
    p = -s * a,
    i = u + n,
    f = t + p,
    d = P + n,
    c = I + p,
    O = (i + d) / 2,
    l = (f + c) / 2,
    h = d - i,
    g = c - f,
    T = h * h + g * g,
    b = v - R,
    A = i * c - d * f,
    q = (g < 0 ? -1 : 1) * F(tn(0, b * b * T - A * A)),
    j = (A * g - h * q) / T,
    k = (-A * h - g * q) / T,
    w = (A * g + h * q) / T,
    m = (-A * h + g * q) / T,
    x = j - O,
    e = k - l,
    r = w - O,
    Y = m - l;
  return (
    x * x + e * e > r * r + Y * Y && ((j = w), (k = m)),
    { cx: j, cy: k, x01: -n, y01: -p, x11: j * (v / b - 1), y11: k * (v / b - 1) }
  );
}
function xn() {
  var u = dn,
    t = cn,
    P = L(0),
    I = null,
    v = yn,
    R = gn,
    N = pn,
    a = null,
    S = fn(s);
  function s() {
    var n,
      p,
      i = +u.apply(this, arguments),
      f = +t.apply(this, arguments),
      d = v.apply(this, arguments) - an,
      c = R.apply(this, arguments) - an,
      O = un(c - d),
      l = c > d;
    if ((a || (a = n = S()), f < i && ((p = f), (f = i), (i = p)), !(f > y))) a.moveTo(0, 0);
    else if (O > ln - y)
      (a.moveTo(f * z(d), f * E(d)),
        a.arc(0, 0, f, d, c, !l),
        i > y && (a.moveTo(i * z(c), i * E(c)), a.arc(0, 0, i, c, d, l)));
    else {
      var h = d,
        g = c,
        T = d,
        b = c,
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
        ((A -= Y * 2) > y ? ((Y *= l ? 1 : -1), (T += Y), (b -= Y)) : ((A = 0), (T = b = (d + c) / 2)),
          (q -= G * 2) > y ? ((G *= l ? 1 : -1), (h += G), (g -= G)) : ((q = 0), (h = g = (d + c) / 2)));
      }
      var B = f * z(h),
        C = f * E(h),
        H = i * z(b),
        J = i * E(b);
      if (w > y) {
        var K = f * z(g),
          M = f * E(g),
          U = i * z(T),
          V = i * E(T),
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
            : a.arc(0, 0, i, b, T, l));
    }
    if ((a.closePath(), n)) return ((a = null), n + "" || null);
  }
  return (
    (s.centroid = function () {
      var n = (+u.apply(this, arguments) + +t.apply(this, arguments)) / 2,
        p = (+v.apply(this, arguments) + +R.apply(this, arguments)) / 2 - rn / 2;
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
      return arguments.length ? ((R = typeof n == "function" ? n : L(+n)), s) : R;
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
