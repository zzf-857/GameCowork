import {
  bd as Zt,
  _ as S,
  s as Jt,
  g as Qt,
  q as $t,
  p as te,
  a as ee,
  b as ne,
  D as zt,
  I as se,
  m as ct,
  av as ie,
  a0 as oe,
  a1 as re,
  a2 as ae,
  e as le,
  t as ce,
  F as ue,
  G as fe,
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
      n = new t.Error().stack;
    n &&
      ((t._sentryDebugIds = t._sentryDebugIds || {}),
      (t._sentryDebugIds[n] = "d68542c8-484b-4b93-9d6f-d1590f93aed7"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-d68542c8-484b-4b93-9d6f-d1590f93aed7"));
  })();
} catch {}
const _t = (t, n) => Zt(t, "a", -n),
  At = 1e-10;
function ot(t, n) {
  const s = de(t),
    e = s.filter((l) => he(l, t));
  let i = 0,
    o = 0;
  const r = [];
  if (e.length > 1) {
    const l = Rt(e);
    for (let u = 0; u < e.length; ++u) {
      const a = e[u];
      a.angle = Math.atan2(a.x - l.x, a.y - l.y);
    }
    e.sort((u, a) => a.angle - u.angle);
    let f = e[e.length - 1];
    for (let u = 0; u < e.length; ++u) {
      const a = e[u];
      o += (f.x + a.x) * (a.y - f.y);
      const p = { x: (a.x + f.x) / 2, y: (a.y + f.y) / 2 };
      let y = null;
      for (let b = 0; b < a.parentIndex.length; ++b)
        if (f.parentIndex.includes(a.parentIndex[b])) {
          const x = t[a.parentIndex[b]],
            k = Math.atan2(a.x - x.x, a.y - x.y),
            A = Math.atan2(f.x - x.x, f.y - x.y);
          let E = A - k;
          E < 0 && (E += 2 * Math.PI);
          const w = A - E / 2;
          let d = U(p, { x: x.x + x.radius * Math.sin(w), y: x.y + x.radius * Math.cos(w) });
          (d > x.radius * 2 && (d = x.radius * 2),
            (y == null || y.width > d) && (y = { circle: x, width: d, p1: a, p2: f, large: d > x.radius, sweep: !0 }));
        }
      y != null && (r.push(y), (i += ht(y.circle.radius, y.width)), (f = a));
    }
  } else {
    let l = t[0];
    for (let u = 1; u < t.length; ++u) t[u].radius < l.radius && (l = t[u]);
    let f = !1;
    for (let u = 0; u < t.length; ++u)
      if (U(t[u], l) > Math.abs(l.radius - t[u].radius)) {
        f = !0;
        break;
      }
    f
      ? (i = o = 0)
      : ((i = l.radius * l.radius * Math.PI),
        r.push({
          circle: l,
          p1: { x: l.x, y: l.y + l.radius },
          p2: { x: l.x - At, y: l.y + l.radius },
          width: l.radius * 2,
          large: !0,
          sweep: !0,
        }));
  }
  return (
    (o /= 2),
    n &&
      ((n.area = i + o),
      (n.arcArea = i),
      (n.polygonArea = o),
      (n.arcs = r),
      (n.innerPoints = e),
      (n.intersectionPoints = s)),
    i + o
  );
}
function he(t, n) {
  return n.every((s) => U(t, s) < s.radius + At);
}
function de(t) {
  const n = [];
  for (let s = 0; s < t.length; ++s)
    for (let e = s + 1; e < t.length; ++e) {
      const i = Dt(t[s], t[e]);
      for (const o of i) ((o.parentIndex = [s, e]), n.push(o));
    }
  return n;
}
function ht(t, n) {
  return t * t * Math.acos(1 - n / t) - (t - n) * Math.sqrt(n * (2 * t - n));
}
function U(t, n) {
  return Math.sqrt((t.x - n.x) * (t.x - n.x) + (t.y - n.y) * (t.y - n.y));
}
function bt(t, n, s) {
  if (s >= t + n) return 0;
  if (s <= Math.abs(t - n)) return Math.PI * Math.min(t, n) * Math.min(t, n);
  const e = t - (s * s - n * n + t * t) / (2 * s),
    i = n - (s * s - t * t + n * n) / (2 * s);
  return ht(t, e) + ht(n, i);
}
function Dt(t, n) {
  const s = U(t, n),
    e = t.radius,
    i = n.radius;
  if (s >= e + i || s <= Math.abs(e - i)) return [];
  const o = (e * e - i * i + s * s) / (2 * s),
    r = Math.sqrt(e * e - o * o),
    l = t.x + (o * (n.x - t.x)) / s,
    f = t.y + (o * (n.y - t.y)) / s,
    u = -(n.y - t.y) * (r / s),
    a = -(n.x - t.x) * (r / s);
  return [
    { x: l + u, y: f - a },
    { x: l - u, y: f + a },
  ];
}
function Rt(t) {
  const n = { x: 0, y: 0 };
  for (const s of t) ((n.x += s.x), (n.y += s.y));
  return ((n.x /= t.length), (n.y /= t.length), n);
}
function ge(t, n, s, e) {
  e = e || {};
  const i = e.maxIterations || 100,
    o = e.tolerance || 1e-10,
    r = t(n),
    l = t(s);
  let f = s - n;
  if (r * l > 0) throw "Initial bisect points must have opposite signs";
  if (r === 0) return n;
  if (l === 0) return s;
  for (let u = 0; u < i; ++u) {
    f /= 2;
    const a = n + f,
      p = t(a);
    if ((p * r >= 0 && (n = a), Math.abs(f) < o || p === 0)) return a;
  }
  return n + f;
}
function dt(t) {
  const n = new Array(t);
  for (let s = 0; s < t; ++s) n[s] = 0;
  return n;
}
function Tt(t, n) {
  return dt(t).map(() => dt(n));
}
function et(t, n) {
  let s = 0;
  for (let e = 0; e < t.length; ++e) s += t[e] * n[e];
  return s;
}
function gt(t) {
  return Math.sqrt(et(t, t));
}
function yt(t, n, s) {
  for (let e = 0; e < n.length; ++e) t[e] = n[e] * s;
}
function Q(t, n, s, e, i) {
  for (let o = 0; o < t.length; ++o) t[o] = n * s[o] + e * i[o];
}
function Ct(t, n, s) {
  s = s || {};
  const e = s.maxIterations || n.length * 200,
    i = s.nonZeroDelta || 1.05,
    o = s.zeroDelta || 0.001,
    r = s.minErrorDelta || 1e-6,
    l = s.minErrorDelta || 1e-5,
    f = s.rho !== void 0 ? s.rho : 1,
    u = s.chi !== void 0 ? s.chi : 2,
    a = s.psi !== void 0 ? s.psi : -0.5,
    p = s.sigma !== void 0 ? s.sigma : 0.5;
  let y;
  const b = n.length,
    x = new Array(b + 1);
  ((x[0] = n), (x[0].fx = t(n)), (x[0].id = 0));
  for (let v = 0; v < b; ++v) {
    const c = n.slice();
    ((c[v] = c[v] ? c[v] * i : o), (x[v + 1] = c), (x[v + 1].fx = t(c)), (x[v + 1].id = v + 1));
  }
  function k(v) {
    for (let c = 0; c < v.length; c++) x[b][c] = v[c];
    x[b].fx = v.fx;
  }
  const A = (v, c) => v.fx - c.fx,
    E = n.slice(),
    w = n.slice(),
    d = n.slice(),
    m = n.slice();
  for (let v = 0; v < e; ++v) {
    if ((x.sort(A), s.history)) {
      const g = x.map((h) => {
        const O = h.slice();
        return ((O.fx = h.fx), (O.id = h.id), O);
      });
      (g.sort((h, O) => h.id - O.id), s.history.push({ x: x[0].slice(), fx: x[0].fx, simplex: g }));
    }
    y = 0;
    for (let g = 0; g < b; ++g) y = Math.max(y, Math.abs(x[0][g] - x[1][g]));
    if (Math.abs(x[0].fx - x[b].fx) < r && y < l) break;
    for (let g = 0; g < b; ++g) {
      E[g] = 0;
      for (let h = 0; h < b; ++h) E[g] += x[h][g];
      E[g] /= b;
    }
    const c = x[b];
    if ((Q(w, 1 + f, E, -f, c), (w.fx = t(w)), w.fx < x[0].fx))
      (Q(m, 1 + u, E, -u, c), (m.fx = t(m)), m.fx < w.fx ? k(m) : k(w));
    else if (w.fx >= x[b - 1].fx) {
      let g = !1;
      if (
        (w.fx > c.fx
          ? (Q(d, 1 + a, E, -a, c), (d.fx = t(d)), d.fx < c.fx ? k(d) : (g = !0))
          : (Q(d, 1 - a * f, E, a * f, c), (d.fx = t(d)), d.fx < w.fx ? k(d) : (g = !0)),
        g)
      ) {
        if (p >= 1) break;
        for (let h = 1; h < x.length; ++h) (Q(x[h], 1 - p, x[0], p, x[h]), (x[h].fx = t(x[h])));
      }
    } else k(w);
  }
  return (x.sort(A), { fx: x[0].fx, x: x[0] });
}
function ye(t, n, s, e, i, o, r) {
  const l = s.fx,
    f = et(s.fxprime, n);
  let u = l,
    a = l,
    p = f,
    y = 0;
  ((i = i || 1), (o = o || 1e-6), (r = r || 0.1));
  function b(x, k, A) {
    for (let E = 0; E < 16; ++E)
      if (
        ((i = (x + k) / 2),
        Q(e.x, 1, s.x, i, n),
        (u = e.fx = t(e.x, e.fxprime)),
        (p = et(e.fxprime, n)),
        u > l + o * i * f || u >= A)
      )
        k = i;
      else {
        if (Math.abs(p) <= -r * f) return i;
        (p * (k - x) >= 0 && (k = x), (x = i), (A = u));
      }
    return 0;
  }
  for (let x = 0; x < 10; ++x) {
    if (
      (Q(e.x, 1, s.x, i, n), (u = e.fx = t(e.x, e.fxprime)), (p = et(e.fxprime, n)), u > l + o * i * f || (x && u >= a))
    )
      return b(y, i, a);
    if (Math.abs(p) <= -r * f) return i;
    if (p >= 0) return b(i, y, u);
    ((a = u), (y = i), (i *= 2));
  }
  return i;
}
function xe(t, n, s) {
  let e = { x: n.slice(), fx: 0, fxprime: n.slice() },
    i = { x: n.slice(), fx: 0, fxprime: n.slice() };
  const o = n.slice();
  let r,
    l,
    f = 1,
    u;
  ((s = s || {}),
    (u = s.maxIterations || n.length * 20),
    (e.fx = t(e.x, e.fxprime)),
    (r = e.fxprime.slice()),
    yt(r, e.fxprime, -1));
  for (let a = 0; a < u; ++a) {
    if (
      ((f = ye(t, r, e, i, f)),
      s.history && s.history.push({ x: e.x.slice(), fx: e.fx, fxprime: e.fxprime.slice(), alpha: f }),
      !f)
    )
      yt(r, e.fxprime, -1);
    else {
      Q(o, 1, i.fxprime, -1, e.fxprime);
      const p = et(e.fxprime, e.fxprime),
        y = Math.max(0, et(o, i.fxprime) / p);
      (Q(r, y, r, -1, i.fxprime), (l = e), (e = i), (i = l));
    }
    if (gt(e.fxprime) <= 1e-5) break;
  }
  return (s.history && s.history.push({ x: e.x.slice(), fx: e.fx, fxprime: e.fxprime.slice(), alpha: f }), e);
}
function Nt(t, n = {}) {
  n.maxIterations = n.maxIterations || 500;
  const s = n.initialLayout || ve,
    e = n.lossFunction || nt,
    i = pe(t, n),
    o = s(i, n),
    r = Object.keys(o),
    l = [];
  for (const a of r) (l.push(o[a].x), l.push(o[a].y));
  const u = Ct(
    (a) => {
      const p = {};
      for (let y = 0; y < r.length; ++y) {
        const b = r[y];
        p[b] = { x: a[2 * y], y: a[2 * y + 1], radius: o[b].radius };
      }
      return e(p, i);
    },
    l,
    n,
  ).x;
  for (let a = 0; a < r.length; ++a) {
    const p = r[a];
    ((o[p].x = u[2 * a]), (o[p].y = u[2 * a + 1]));
  }
  return o;
}
const Ot = 1e-10;
function xt(t, n, s) {
  return Math.min(t, n) * Math.min(t, n) * Math.PI <= s + Ot ? Math.abs(t - n) : ge((e) => bt(t, n, e) - s, 0, t + n);
}
function pe(t, n = {}) {
  const s = n.distinct,
    e = t.map((l) => Object.assign({}, l));
  function i(l) {
    return l.join(";");
  }
  if (s) {
    const l = new Map();
    for (const f of e)
      for (let u = 0; u < f.sets.length; u++) {
        const a = String(f.sets[u]);
        l.set(a, f.size + (l.get(a) || 0));
        for (let p = u + 1; p < f.sets.length; p++) {
          const y = String(f.sets[p]),
            b = `${a};${y}`,
            x = `${y};${a}`;
          (l.set(b, f.size + (l.get(b) || 0)), l.set(x, f.size + (l.get(x) || 0)));
        }
      }
    for (const f of e) f.sets.length < 3 && (f.size = l.get(i(f.sets)));
  }
  const o = [],
    r = new Set();
  for (const l of e)
    if (l.sets.length === 1) o.push(l.sets[0]);
    else if (l.sets.length === 2) {
      const f = l.sets[0],
        u = l.sets[1];
      (r.add(i(l.sets)), r.add(i([u, f])));
    }
  o.sort((l, f) => (l === f ? 0 : l < f ? -1 : 1));
  for (let l = 0; l < o.length; ++l) {
    const f = o[l];
    for (let u = l + 1; u < o.length; ++u) {
      const a = o[u];
      r.has(i([f, a])) || e.push({ sets: [f, a], size: 0 });
    }
  }
  return e;
}
function me(t, n, s) {
  const e = Tt(n.length, n.length),
    i = Tt(n.length, n.length);
  return (
    t
      .filter((o) => o.sets.length === 2)
      .forEach((o) => {
        const r = s[o.sets[0]],
          l = s[o.sets[1]],
          f = Math.sqrt(n[r].size / Math.PI),
          u = Math.sqrt(n[l].size / Math.PI),
          a = xt(f, u, o.size);
        e[r][l] = e[l][r] = a;
        let p = 0;
        (o.size + 1e-10 >= Math.min(n[r].size, n[l].size) ? (p = 1) : o.size <= 1e-10 && (p = -1),
          (i[r][l] = i[l][r] = p));
      }),
    { distances: e, constraints: i }
  );
}
function be(t, n, s, e) {
  for (let o = 0; o < n.length; ++o) n[o] = 0;
  let i = 0;
  for (let o = 0; o < s.length; ++o) {
    const r = t[2 * o],
      l = t[2 * o + 1];
    for (let f = o + 1; f < s.length; ++f) {
      const u = t[2 * f],
        a = t[2 * f + 1],
        p = s[o][f],
        y = e[o][f],
        b = (u - r) * (u - r) + (a - l) * (a - l),
        x = Math.sqrt(b),
        k = b - p * p;
      (y > 0 && x <= p) ||
        (y < 0 && x >= p) ||
        ((i += 2 * k * k),
        (n[2 * o] += 4 * k * (r - u)),
        (n[2 * o + 1] += 4 * k * (l - a)),
        (n[2 * f] += 4 * k * (u - r)),
        (n[2 * f + 1] += 4 * k * (a - l)));
    }
  }
  return i;
}
function ve(t, n = {}) {
  let s = ke(t, n);
  const e = n.lossFunction || nt;
  if (t.length >= 8) {
    const i = Ie(t, n),
      o = e(i, t),
      r = e(s, t);
    o + 1e-8 < r && (s = i);
  }
  return s;
}
function Ie(t, n = {}) {
  const s = n.restarts || 10,
    e = [],
    i = {};
  for (const y of t) y.sets.length === 1 && ((i[y.sets[0]] = e.length), e.push(y));
  let { distances: o, constraints: r } = me(t, e, i);
  const l = gt(o.map(gt)) / o.length;
  o = o.map((y) => y.map((b) => b / l));
  const f = (y, b) => be(y, b, o, r);
  let u = null;
  for (let y = 0; y < s; ++y) {
    const b = dt(o.length * 2).map(Math.random),
      x = xe(f, b, n);
    (!u || x.fx < u.fx) && (u = x);
  }
  const a = u.x,
    p = {};
  for (let y = 0; y < e.length; ++y) {
    const b = e[y];
    p[b.sets[0]] = { x: a[2 * y] * l, y: a[2 * y + 1] * l, radius: Math.sqrt(b.size / Math.PI) };
  }
  if (n.history) for (const y of n.history) yt(y.x, l);
  return p;
}
function ke(t, n) {
  const s = n && n.lossFunction ? n.lossFunction : nt,
    e = {},
    i = {};
  for (const p of t)
    if (p.sets.length === 1) {
      const y = p.sets[0];
      ((e[y] = { x: 1e10, y: 1e10, rowid: e.length, size: p.size, radius: Math.sqrt(p.size / Math.PI) }), (i[y] = []));
    }
  t = t.filter((p) => p.sets.length === 2);
  for (const p of t) {
    let y = p.weight != null ? p.weight : 1;
    const b = p.sets[0],
      x = p.sets[1];
    (p.size + Ot >= Math.min(e[b].size, e[x].size) && (y = 0),
      i[b].push({ set: x, size: p.size, weight: y }),
      i[x].push({ set: b, size: p.size, weight: y }));
  }
  const o = [];
  Object.keys(i).forEach((p) => {
    let y = 0;
    for (let b = 0; b < i[p].length; ++b) y += i[p][b].size * i[p][b].weight;
    o.push({ set: p, size: y });
  });
  function r(p, y) {
    return y.size - p.size;
  }
  o.sort(r);
  const l = {};
  function f(p) {
    return p.set in l;
  }
  function u(p, y) {
    ((e[y].x = p.x), (e[y].y = p.y), (l[y] = !0));
  }
  u({ x: 0, y: 0 }, o[0].set);
  for (let p = 1; p < o.length; ++p) {
    const y = o[p].set,
      b = i[y].filter(f),
      x = e[y];
    if ((b.sort(r), b.length === 0)) throw "ERROR: missing pairwise overlap information";
    const k = [];
    for (var a = 0; a < b.length; ++a) {
      const w = e[b[a].set],
        d = xt(x.radius, w.radius, b[a].size);
      (k.push({ x: w.x + d, y: w.y }),
        k.push({ x: w.x - d, y: w.y }),
        k.push({ y: w.y + d, x: w.x }),
        k.push({ y: w.y - d, x: w.x }));
      for (let m = a + 1; m < b.length; ++m) {
        const v = e[b[m].set],
          c = xt(x.radius, v.radius, b[m].size),
          g = Dt({ x: w.x, y: w.y, radius: d }, { x: v.x, y: v.y, radius: c });
        k.push(...g);
      }
    }
    let A = 1e50,
      E = k[0];
    for (const w of k) {
      ((e[y].x = w.x), (e[y].y = w.y));
      const d = s(e, t);
      d < A && ((A = d), (E = w));
    }
    u(E, y);
  }
  return e;
}
function nt(t, n) {
  let s = 0;
  for (const e of n) {
    if (e.sets.length === 1) continue;
    let i;
    if (e.sets.length === 2) {
      const r = t[e.sets[0]],
        l = t[e.sets[1]];
      i = bt(r.radius, l.radius, U(r, l));
    } else i = ot(e.sets.map((r) => t[r]));
    const o = e.weight != null ? e.weight : 1;
    s += o * (i - e.size) * (i - e.size);
  }
  return s;
}
function Ft(t, n) {
  let s = 0;
  for (const e of n) {
    if (e.sets.length === 1) continue;
    let i;
    if (e.sets.length === 2) {
      const l = t[e.sets[0]],
        f = t[e.sets[1]];
      i = bt(l.radius, f.radius, U(l, f));
    } else i = ot(e.sets.map((l) => t[l]));
    const o = e.weight != null ? e.weight : 1,
      r = Math.log((i + 1) / (e.size + 1));
    s += o * r * r;
  }
  return s;
}
function Me(t, n, s) {
  if ((s == null ? t.sort((i, o) => o.radius - i.radius) : t.sort(s), t.length > 0)) {
    const i = t[0].x,
      o = t[0].y;
    for (const r of t) ((r.x -= i), (r.y -= o));
  }
  if (
    (t.length === 2 &&
      U(t[0], t[1]) < Math.abs(t[1].radius - t[0].radius) &&
      ((t[1].x = t[0].x + t[0].radius - t[1].radius - 1e-10), (t[1].y = t[0].y)),
    t.length > 1)
  ) {
    const i = Math.atan2(t[1].x, t[1].y) - n,
      o = Math.cos(i),
      r = Math.sin(i);
    for (const l of t) {
      const f = l.x,
        u = l.y;
      ((l.x = o * f - r * u), (l.y = r * f + o * u));
    }
  }
  if (t.length > 2) {
    let i = Math.atan2(t[2].x, t[2].y) - n;
    for (; i < 0;) i += 2 * Math.PI;
    for (; i > 2 * Math.PI;) i -= 2 * Math.PI;
    if (i > Math.PI) {
      const o = t[1].y / (1e-10 + t[1].x);
      for (const r of t) {
        var e = (r.x + o * r.y) / (1 + o * o);
        ((r.x = 2 * e - r.x), (r.y = 2 * e * o - r.y));
      }
    }
  }
}
function we(t) {
  t.forEach((i) => {
    i.parent = i;
  });
  function n(i) {
    return (i.parent !== i && (i.parent = n(i.parent)), i.parent);
  }
  function s(i, o) {
    const r = n(i),
      l = n(o);
    r.parent = l;
  }
  for (let i = 0; i < t.length; ++i)
    for (let o = i + 1; o < t.length; ++o) {
      const r = t[i].radius + t[o].radius;
      U(t[i], t[o]) + 1e-10 < r && s(t[o], t[i]);
    }
  const e = new Map();
  for (let i = 0; i < t.length; ++i) {
    const o = n(t[i]).parent.setid;
    (e.has(o) || e.set(o, []), e.get(o).push(t[i]));
  }
  return (
    t.forEach((i) => {
      delete i.parent;
    }),
    Array.from(e.values())
  );
}
function pt(t) {
  const n = (s) => {
    const e = t.reduce((o, r) => Math.max(o, r[s] + r.radius), Number.NEGATIVE_INFINITY),
      i = t.reduce((o, r) => Math.min(o, r[s] - r.radius), Number.POSITIVE_INFINITY);
    return { max: e, min: i };
  };
  return { xRange: n("x"), yRange: n("y") };
}
function jt(t, n, s) {
  n == null && (n = Math.PI / 2);
  let e = Bt(t).map((u) => Object.assign({}, u));
  const i = we(e);
  for (const u of i) {
    Me(u, n, s);
    const a = pt(u);
    ((u.size = (a.xRange.max - a.xRange.min) * (a.yRange.max - a.yRange.min)), (u.bounds = a));
  }
  (i.sort((u, a) => a.size - u.size), (e = i[0]));
  let o = e.bounds;
  const r = (o.xRange.max - o.xRange.min) / 50;
  function l(u, a, p) {
    if (!u) return;
    const y = u.bounds;
    let b, x;
    if (a) b = o.xRange.max - y.xRange.min + r;
    else {
      b = o.xRange.max - y.xRange.max;
      const k = (y.xRange.max - y.xRange.min) / 2 - (o.xRange.max - o.xRange.min) / 2;
      k < 0 && (b += k);
    }
    if (p) x = o.yRange.max - y.yRange.min + r;
    else {
      x = o.yRange.max - y.yRange.max;
      const k = (y.yRange.max - y.yRange.min) / 2 - (o.yRange.max - o.yRange.min) / 2;
      k < 0 && (x += k);
    }
    for (const k of u) ((k.x += b), (k.y += x), e.push(k));
  }
  let f = 1;
  for (; f < i.length;) (l(i[f], !0, !1), l(i[f + 1], !1, !0), l(i[f + 2], !0, !0), (f += 3), (o = pt(e)));
  return Pt(e);
}
function Lt(t, n, s, e, i) {
  const o = Bt(t);
  ((n -= 2 * e), (s -= 2 * e));
  const { xRange: r, yRange: l } = pt(o);
  if (r.max === r.min || l.max === l.min) return (console.log("not scaling solution: zero size detected"), t);
  let f, u;
  if (i) {
    const b = Math.sqrt(i / Math.PI) * 2;
    ((f = n / b), (u = s / b));
  } else ((f = n / (r.max - r.min)), (u = s / (l.max - l.min)));
  const a = Math.min(u, f),
    p = (n - (r.max - r.min) * a) / 2,
    y = (s - (l.max - l.min) * a) / 2;
  return Pt(
    o.map((b) => ({
      radius: a * b.radius,
      x: e + p + (b.x - r.min) * a,
      y: e + y + (b.y - l.min) * a,
      setid: b.setid,
    })),
  );
}
function Pt(t) {
  const n = {};
  for (const s of t) n[s.setid] = s;
  return n;
}
function Bt(t) {
  return Object.keys(t).map((s) => Object.assign(t[s], { setid: s }));
}
function Se(t = {}) {
  let n = !1,
    s = 600,
    e = 350,
    i = 15,
    o = 1e3,
    r = Math.PI / 2,
    l = !0,
    f = null,
    u = !0,
    a = !0,
    p = null,
    y = null,
    b = !1,
    x = null,
    k = t && t.symmetricalTextCentre ? t.symmetricalTextCentre : !1,
    A = {},
    E =
      t && t.colourScheme
        ? t.colourScheme
        : t && t.colorScheme
          ? t.colorScheme
          : [
              "#1f77b4",
              "#ff7f0e",
              "#2ca02c",
              "#d62728",
              "#9467bd",
              "#8c564b",
              "#e377c2",
              "#7f7f7f",
              "#bcbd22",
              "#17becf",
            ],
    w = 0,
    d = function (g) {
      if (g in A) return A[g];
      var h = (A[g] = E[w]);
      return ((w += 1), w >= E.length && (w = 0), h);
    },
    m = Nt,
    v = nt;
  function c(g) {
    let h = g.datum();
    const O = new Set();
    (h.forEach((I) => {
      I.size == 0 && I.sets.length == 1 && O.add(I.sets[0]);
    }),
      (h = h.filter((I) => !I.sets.some((_) => O.has(_)))));
    let M = {},
      C = {};
    if (h.length > 0) {
      let I = m(h, { lossFunction: v, distinct: b });
      (l && (I = jt(I, r, y)), (M = Lt(I, s, e, i, f)), (C = qt(M, h, k)));
    }
    const H = {};
    h.forEach((I) => {
      I.label && (H[I.sets] = I.label);
    });
    function q(I) {
      if (I.sets in H) return H[I.sets];
      if (I.sets.length == 1) return "" + I.sets[0];
    }
    g.selectAll("svg").data([M]).enter().append("svg");
    const G = g.select("svg");
    n ? G.attr("viewBox", `0 0 ${s} ${e}`) : G.attr("width", s).attr("height", e);
    const K = {};
    let D = !1;
    G.selectAll(".venn-area path").each(function (I) {
      const _ = this.getAttribute("d");
      I.sets.length == 1 && _ && !b && ((D = !0), (K[I.sets[0]] = Ee(_)));
    });
    function N(I) {
      return (_) => {
        const j = I.sets.map((X) => {
          let P = K[X],
            B = M[X];
          return (
            P || (P = { x: s / 2, y: e / 2, radius: 1 }),
            B || (B = { x: s / 2, y: e / 2, radius: 1 }),
            { x: P.x * (1 - _) + B.x * _, y: P.y * (1 - _) + B.y * _, radius: P.radius * (1 - _) + B.radius * _ }
          );
        });
        return Et(j, x);
      };
    }
    const V = G.selectAll(".venn-area").data(h, (I) => I.sets),
      W = V.enter()
        .append("g")
        .attr(
          "class",
          (I) =>
            `venn-area venn-${I.sets.length == 1 ? "circle" : "intersection"}${I.colour || I.color ? " venn-coloured" : ""}`,
        )
        .attr("data-venn-sets", (I) => I.sets.join("_")),
      Z = W.append("path"),
      J = W.append("text")
        .attr("class", "label")
        .text((I) => q(I))
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("x", s / 2)
        .attr("y", e / 2);
    a &&
      (Z.style("fill-opacity", "0")
        .filter((I) => I.sets.length == 1)
        .style("fill", (I) => (I.colour ? I.colour : I.color ? I.color : d(I.sets)))
        .style("fill-opacity", ".25"),
      J.style("fill", (I) =>
        I.colour || I.color ? "#FFF" : t.textFill ? t.textFill : I.sets.length == 1 ? d(I.sets) : "#444",
      ));
    function Y(I) {
      return typeof I.transition == "function" ? I.transition("venn").duration(o) : I;
    }
    let T = g;
    D && typeof T.transition == "function"
      ? ((T = Y(g)), T.selectAll("path").attrTween("d", N))
      : T.selectAll("path").attr("d", (I) => Et(I.sets.map((_) => M[_])), x);
    const R = T.selectAll("text")
      .filter((I) => I.sets in C)
      .text((I) => q(I))
      .attr("x", (I) => Math.floor(C[I.sets].x))
      .attr("y", (I) => Math.floor(C[I.sets].y));
    u && (D ? ("on" in R ? R.on("end", ut(M, q)) : R.each("end", ut(M, q))) : R.each(ut(M, q)));
    const z = Y(V.exit()).remove();
    typeof V.transition == "function" && z.selectAll("path").attrTween("d", N);
    const F = z
      .selectAll("text")
      .attr("x", s / 2)
      .attr("y", e / 2);
    return (
      p !== null && (J.style("font-size", "0px"), R.style("font-size", p), F.style("font-size", "0px")),
      { circles: M, textCentres: C, nodes: V, enter: W, update: T, exit: z }
    );
  }
  return (
    (c.wrap = function (g) {
      return arguments.length ? ((u = g), c) : u;
    }),
    (c.useViewBox = function () {
      return ((n = !0), c);
    }),
    (c.width = function (g) {
      return arguments.length ? ((s = g), c) : s;
    }),
    (c.height = function (g) {
      return arguments.length ? ((e = g), c) : e;
    }),
    (c.padding = function (g) {
      return arguments.length ? ((i = g), c) : i;
    }),
    (c.distinct = function (g) {
      return arguments.length ? ((b = g), c) : b;
    }),
    (c.colours = function (g) {
      return arguments.length ? ((d = g), c) : d;
    }),
    (c.colors = function (g) {
      return arguments.length ? ((d = g), c) : d;
    }),
    (c.fontSize = function (g) {
      return arguments.length ? ((p = g), c) : p;
    }),
    (c.round = function (g) {
      return arguments.length ? ((x = g), c) : x;
    }),
    (c.duration = function (g) {
      return arguments.length ? ((o = g), c) : o;
    }),
    (c.layoutFunction = function (g) {
      return arguments.length ? ((m = g), c) : m;
    }),
    (c.normalize = function (g) {
      return arguments.length ? ((l = g), c) : l;
    }),
    (c.scaleToFit = function (g) {
      return arguments.length ? ((f = g), c) : f;
    }),
    (c.styled = function (g) {
      return arguments.length ? ((a = g), c) : a;
    }),
    (c.orientation = function (g) {
      return arguments.length ? ((r = g), c) : r;
    }),
    (c.orientationOrder = function (g) {
      return arguments.length ? ((y = g), c) : y;
    }),
    (c.lossFunction = function (g) {
      return arguments.length ? ((v = g === "default" ? nt : g === "logRatio" ? Ft : g), c) : v;
    }),
    c
  );
}
function ut(t, n) {
  return function (s) {
    const e = this,
      i = t[s.sets[0]].radius || 50,
      o = n(s) || "",
      r = o.split(/\s+/).reverse(),
      f = (o.length + r.length) / 3;
    let u = r.pop(),
      a = [u],
      p = 0;
    const y = 1.1;
    e.textContent = null;
    const b = [];
    function x(d) {
      const m = e.ownerDocument.createElementNS(e.namespaceURI, "tspan");
      return ((m.textContent = d), b.push(m), e.append(m), m);
    }
    let k = x(u);
    for (; (u = r.pop()), !!u;) {
      a.push(u);
      const d = a.join(" ");
      ((k.textContent = d),
        d.length > f &&
          k.getComputedTextLength() > i &&
          (a.pop(), (k.textContent = a.join(" ")), (a = [u]), (k = x(u)), p++));
    }
    const A = 0.35 - (p * y) / 2,
      E = e.getAttribute("x"),
      w = e.getAttribute("y");
    b.forEach((d, m) => {
      (d.setAttribute("x", E), d.setAttribute("y", w), d.setAttribute("dy", `${A + m * y}em`));
    });
  };
}
function ft(t, n, s) {
  let e = n[0].radius - U(n[0], t);
  for (let i = 1; i < n.length; ++i) {
    const o = n[i].radius - U(n[i], t);
    o <= e && (e = o);
  }
  for (let i = 0; i < s.length; ++i) {
    const o = U(s[i], t) - s[i].radius;
    o <= e && (e = o);
  }
  return e;
}
function Vt(t, n, s) {
  const e = [];
  for (const a of t)
    (e.push({ x: a.x, y: a.y }),
      e.push({ x: a.x + a.radius / 2, y: a.y }),
      e.push({ x: a.x - a.radius / 2, y: a.y }),
      e.push({ x: a.x, y: a.y + a.radius / 2 }),
      e.push({ x: a.x, y: a.y - a.radius / 2 }));
  let i = e[0],
    o = ft(e[0], t, n);
  for (let a = 1; a < e.length; ++a) {
    const p = ft(e[a], t, n);
    p >= o && ((i = e[a]), (o = p));
  }
  const r = Ct((a) => -1 * ft({ x: a[0], y: a[1] }, t, n), [i.x, i.y], { maxIterations: 500, minErrorDelta: 1e-10 }).x,
    l = { x: s ? 0 : r[0], y: r[1] };
  let f = !0;
  for (const a of t)
    if (U(l, a) > a.radius) {
      f = !1;
      break;
    }
  for (const a of n)
    if (U(l, a) < a.radius) {
      f = !1;
      break;
    }
  if (f) return l;
  if (t.length == 1) return { x: t[0].x, y: t[0].y };
  const u = {};
  return (
    ot(t, u),
    u.arcs.length === 0
      ? { x: 0, y: -1e3, disjoint: !0 }
      : u.arcs.length == 1
        ? { x: u.arcs[0].circle.x, y: u.arcs[0].circle.y }
        : n.length
          ? Vt(t, [])
          : Rt(u.arcs.map((a) => a.p1))
  );
}
function _e(t) {
  const n = {},
    s = Object.keys(t);
  for (const e of s) n[e] = [];
  for (let e = 0; e < s.length; e++) {
    const i = s[e],
      o = t[i];
    for (let r = e + 1; r < s.length; ++r) {
      const l = s[r],
        f = t[l],
        u = U(o, f);
      u + f.radius <= o.radius + 1e-10 ? n[l].push(i) : u + o.radius <= f.radius + 1e-10 && n[i].push(l);
    }
  }
  return n;
}
function qt(t, n, s) {
  const e = {},
    i = _e(t);
  for (let o = 0; o < n.length; ++o) {
    const r = n[o].sets,
      l = {},
      f = {};
    for (let y = 0; y < r.length; ++y) {
      l[r[y]] = !0;
      const b = i[r[y]];
      for (let x = 0; x < b.length; ++x) f[b[x]] = !0;
    }
    const u = [],
      a = [];
    for (let y in t) y in l ? u.push(t[y]) : y in f || a.push(t[y]);
    const p = Vt(u, a, s);
    ((e[r] = p), p.disjoint && n[o].size > 0 && console.log("WARNING: area " + r + " not represented on screen"));
  }
  return e;
}
function Te(t, n, s) {
  const e = [];
  return (
    e.push(
      `
M`,
      t,
      n,
    ),
    e.push(
      `
m`,
      -s,
      0,
    ),
    e.push(
      `
a`,
      s,
      s,
      0,
      1,
      0,
      s * 2,
      0,
    ),
    e.push(
      `
a`,
      s,
      s,
      0,
      1,
      0,
      -s * 2,
      0,
    ),
    e.join(" ")
  );
}
function Ee(t) {
  const n = t.split(" ");
  return { x: Number.parseFloat(n[1]), y: Number.parseFloat(n[2]), radius: -Number.parseFloat(n[4]) };
}
function Ut(t) {
  if (t.length === 0) return [];
  const n = {};
  return (ot(t, n), n.arcs);
}
function Gt(t, n) {
  if (t.length === 0) return "M 0 0";
  const s = Math.pow(10, n || 0),
    e = n != null ? (o) => Math.round(o * s) / s : (o) => o;
  if (t.length == 1) {
    const o = t[0].circle;
    return Te(e(o.x), e(o.y), e(o.radius));
  }
  const i = [
    `
M`,
    e(t[0].p2.x),
    e(t[0].p2.y),
  ];
  for (const o of t) {
    const r = e(o.circle.radius);
    i.push(
      `
A`,
      r,
      r,
      0,
      o.large ? 1 : 0,
      o.sweep ? 1 : 0,
      e(o.p1.x),
      e(o.p1.y),
    );
  }
  return i.join(" ");
}
function Et(t, n) {
  return Gt(Ut(t), n);
}
function ze(t, n = {}) {
  const {
    lossFunction: s,
    layoutFunction: e = Nt,
    normalize: i = !0,
    orientation: o = Math.PI / 2,
    orientationOrder: r,
    width: l = 600,
    height: f = 350,
    padding: u = 15,
    scaleToFit: a = !1,
    symmetricalTextCentre: p = !1,
    distinct: y,
    round: b = 2,
  } = n;
  let x = e(t, { lossFunction: s === "default" || !s ? nt : s === "logRatio" ? Ft : s, distinct: y });
  i && (x = jt(x, o, r));
  const k = Lt(x, l, f, u, a),
    A = qt(k, t, p),
    E = new Map(Object.keys(k).map((m) => [m, { set: m, x: k[m].x, y: k[m].y, radius: k[m].radius }])),
    w = t.map((m) => {
      const v = m.sets.map((h) => E.get(h)),
        c = Ut(v),
        g = Gt(c, b);
      return { circles: v, arcs: c, path: g, area: m, has: new Set(m.sets) };
    });
  function d(m) {
    let v = "";
    for (const c of w) c.has.size > m.length && m.every((g) => c.has.has(g)) && (v += " " + c.path);
    return v;
  }
  return w.map(({ circles: m, arcs: v, path: c, area: g }) => ({
    data: g,
    text: A[g.sets],
    circles: m,
    arcs: v,
    path: c,
    distinctPath: c + d(g.sets),
  }));
}
var mt = (function () {
  var t = S(function (w, d, m, v) {
      for (m = m || {}, v = w.length; v--; m[w[v]] = d);
      return m;
    }, "o"),
    n = [5, 8],
    s = [7, 8, 11, 12, 17, 19, 22, 24],
    e = [1, 17],
    i = [1, 18],
    o = [7, 8, 11, 12, 14, 15, 16, 17, 19, 20, 21, 22, 24, 27],
    r = [1, 31],
    l = [1, 39],
    f = [7, 8, 11, 12, 17, 19, 22, 24, 27],
    u = [1, 57],
    a = [1, 56],
    p = [1, 58],
    y = [1, 59],
    b = [1, 60],
    x = [7, 8, 11, 12, 16, 17, 19, 20, 22, 24, 27, 31, 32, 33],
    k = {
      trace: S(function () {}, "trace"),
      yy: {},
      symbols_: {
        error: 2,
        start: 3,
        optNewlines: 4,
        VENN: 5,
        document: 6,
        EOF: 7,
        NEWLINE: 8,
        line: 9,
        statement: 10,
        TITLE: 11,
        SET: 12,
        identifier: 13,
        BRACKET_LABEL: 14,
        COLON: 15,
        NUMERIC: 16,
        UNION: 17,
        identifierList: 18,
        TEXT: 19,
        IDENTIFIER: 20,
        STRING: 21,
        INDENT_TEXT: 22,
        indentedTextTail: 23,
        STYLE: 24,
        stylesOpt: 25,
        styleField: 26,
        COMMA: 27,
        styleValue: 28,
        valueTokens: 29,
        valueToken: 30,
        HEXCOLOR: 31,
        RGBCOLOR: 32,
        RGBACOLOR: 33,
        $accept: 0,
        $end: 1,
      },
      terminals_: {
        2: "error",
        5: "VENN",
        7: "EOF",
        8: "NEWLINE",
        11: "TITLE",
        12: "SET",
        14: "BRACKET_LABEL",
        15: "COLON",
        16: "NUMERIC",
        17: "UNION",
        19: "TEXT",
        20: "IDENTIFIER",
        21: "STRING",
        22: "INDENT_TEXT",
        24: "STYLE",
        27: "COMMA",
        31: "HEXCOLOR",
        32: "RGBCOLOR",
        33: "RGBACOLOR",
      },
      productions_: [
        0,
        [3, 4],
        [4, 0],
        [4, 2],
        [6, 0],
        [6, 2],
        [9, 1],
        [9, 1],
        [10, 1],
        [10, 2],
        [10, 3],
        [10, 4],
        [10, 5],
        [10, 2],
        [10, 3],
        [10, 4],
        [10, 5],
        [10, 3],
        [10, 3],
        [10, 3],
        [10, 4],
        [10, 4],
        [10, 2],
        [10, 3],
        [23, 1],
        [23, 1],
        [23, 1],
        [23, 2],
        [23, 2],
        [25, 1],
        [25, 3],
        [26, 3],
        [28, 1],
        [28, 1],
        [29, 1],
        [29, 2],
        [30, 1],
        [30, 1],
        [30, 1],
        [30, 1],
        [30, 1],
        [18, 1],
        [18, 3],
        [13, 1],
        [13, 1],
      ],
      performAction: S(function (d, m, v, c, g, h, O) {
        var M = h.length - 1;
        switch (g) {
          case 1:
            return h[M - 1];
          case 2:
          case 3:
          case 4:
            this.$ = [];
            break;
          case 5:
            (h[M - 1].push(h[M]), (this.$ = h[M - 1]));
            break;
          case 6:
            this.$ = [];
            break;
          case 7:
          case 22:
          case 32:
          case 36:
          case 37:
          case 38:
          case 39:
          case 40:
            this.$ = h[M];
            break;
          case 8:
            (c.setDiagramTitle(h[M].substr(6)), (this.$ = h[M].substr(6)));
            break;
          case 9:
            (c.addSubsetData([h[M]], void 0, void 0), c.setIndentMode && c.setIndentMode(!0));
            break;
          case 10:
            (c.addSubsetData([h[M - 1]], h[M], void 0), c.setIndentMode && c.setIndentMode(!0));
            break;
          case 11:
            (c.addSubsetData([h[M - 2]], void 0, parseFloat(h[M])), c.setIndentMode && c.setIndentMode(!0));
            break;
          case 12:
            (c.addSubsetData([h[M - 3]], h[M - 2], parseFloat(h[M])), c.setIndentMode && c.setIndentMode(!0));
            break;
          case 13:
            if (h[M].length < 2) throw new Error("union requires multiple identifiers");
            (c.validateUnionIdentifiers && c.validateUnionIdentifiers(h[M]),
              c.addSubsetData(h[M], void 0, void 0),
              c.setIndentMode && c.setIndentMode(!0));
            break;
          case 14:
            if (h[M - 1].length < 2) throw new Error("union requires multiple identifiers");
            (c.validateUnionIdentifiers && c.validateUnionIdentifiers(h[M - 1]),
              c.addSubsetData(h[M - 1], h[M], void 0),
              c.setIndentMode && c.setIndentMode(!0));
            break;
          case 15:
            if (h[M - 2].length < 2) throw new Error("union requires multiple identifiers");
            (c.validateUnionIdentifiers && c.validateUnionIdentifiers(h[M - 2]),
              c.addSubsetData(h[M - 2], void 0, parseFloat(h[M])),
              c.setIndentMode && c.setIndentMode(!0));
            break;
          case 16:
            if (h[M - 3].length < 2) throw new Error("union requires multiple identifiers");
            (c.validateUnionIdentifiers && c.validateUnionIdentifiers(h[M - 3]),
              c.addSubsetData(h[M - 3], h[M - 2], parseFloat(h[M])),
              c.setIndentMode && c.setIndentMode(!0));
            break;
          case 17:
          case 18:
          case 19:
            c.addTextData(h[M - 1], h[M], void 0);
            break;
          case 20:
          case 21:
            c.addTextData(h[M - 2], h[M - 1], h[M]);
            break;
          case 23:
            c.addStyleData(h[M - 1], h[M]);
            break;
          case 24:
          case 25:
          case 26:
            var C = c.getCurrentSets();
            if (!C) throw new Error("text requires set");
            c.addTextData(C, h[M], void 0);
            break;
          case 27:
          case 28:
            var C = c.getCurrentSets();
            if (!C) throw new Error("text requires set");
            c.addTextData(C, h[M - 1], h[M]);
            break;
          case 29:
          case 41:
            this.$ = [h[M]];
            break;
          case 30:
          case 42:
            this.$ = [...h[M - 2], h[M]];
            break;
          case 31:
            this.$ = [h[M - 2], h[M]];
            break;
          case 33:
            this.$ = h[M].join(" ");
            break;
          case 34:
            this.$ = [h[M]];
            break;
          case 35:
            (h[M - 1].push(h[M]), (this.$ = h[M - 1]));
            break;
          case 43:
          case 44:
            this.$ = h[M];
            break;
        }
      }, "anonymous"),
      table: [
        t(n, [2, 2], { 3: 1, 4: 2 }),
        { 1: [3] },
        { 5: [1, 3], 8: [1, 4] },
        t(s, [2, 4], { 6: 5 }),
        t(n, [2, 3]),
        {
          7: [1, 6],
          8: [1, 8],
          9: 7,
          10: 9,
          11: [1, 10],
          12: [1, 11],
          17: [1, 12],
          19: [1, 13],
          22: [1, 14],
          24: [1, 15],
        },
        { 1: [2, 1] },
        t(s, [2, 5]),
        t(s, [2, 6]),
        t(s, [2, 7]),
        t(s, [2, 8]),
        { 13: 16, 20: e, 21: i },
        { 13: 20, 18: 19, 20: e, 21: i },
        { 13: 20, 18: 21, 20: e, 21: i },
        { 16: [1, 25], 20: [1, 23], 21: [1, 24], 23: 22 },
        { 13: 20, 18: 26, 20: e, 21: i },
        t(s, [2, 9], { 14: [1, 27], 15: [1, 28] }),
        t(o, [2, 43]),
        t(o, [2, 44]),
        t(s, [2, 13], { 14: [1, 29], 15: [1, 30], 27: r }),
        t(o, [2, 41]),
        { 16: [1, 34], 20: [1, 32], 21: [1, 33], 27: r },
        t(s, [2, 22]),
        t(s, [2, 24], { 14: [1, 35] }),
        t(s, [2, 25], { 14: [1, 36] }),
        t(s, [2, 26]),
        { 20: l, 25: 37, 26: 38, 27: r },
        t(s, [2, 10], { 15: [1, 40] }),
        { 16: [1, 41] },
        t(s, [2, 14], { 15: [1, 42] }),
        { 16: [1, 43] },
        { 13: 44, 20: e, 21: i },
        t(s, [2, 17], { 14: [1, 45] }),
        t(s, [2, 18], { 14: [1, 46] }),
        t(s, [2, 19]),
        t(s, [2, 27]),
        t(s, [2, 28]),
        t(s, [2, 23], { 27: [1, 47] }),
        t(f, [2, 29]),
        { 15: [1, 48] },
        { 16: [1, 49] },
        t(s, [2, 11]),
        { 16: [1, 50] },
        t(s, [2, 15]),
        t(o, [2, 42]),
        t(s, [2, 20]),
        t(s, [2, 21]),
        { 20: l, 26: 51 },
        { 16: u, 20: a, 21: [1, 53], 28: 52, 29: 54, 30: 55, 31: p, 32: y, 33: b },
        t(s, [2, 12]),
        t(s, [2, 16]),
        t(f, [2, 30]),
        t(f, [2, 31]),
        t(f, [2, 32]),
        t(f, [2, 33], { 30: 61, 16: u, 20: a, 31: p, 32: y, 33: b }),
        t(x, [2, 34]),
        t(x, [2, 36]),
        t(x, [2, 37]),
        t(x, [2, 38]),
        t(x, [2, 39]),
        t(x, [2, 40]),
        t(x, [2, 35]),
      ],
      defaultActions: { 6: [2, 1] },
      parseError: S(function (d, m) {
        if (m.recoverable) this.trace(d);
        else {
          var v = new Error(d);
          throw ((v.hash = m), v);
        }
      }, "parseError"),
      parse: S(function (d) {
        var m = this,
          v = [0],
          c = [],
          g = [null],
          h = [],
          O = this.table,
          M = "",
          C = 0,
          H = 0,
          q = 2,
          G = 1,
          K = h.slice.call(arguments, 1),
          D = Object.create(this.lexer),
          N = { yy: {} };
        for (var V in this.yy) Object.prototype.hasOwnProperty.call(this.yy, V) && (N.yy[V] = this.yy[V]);
        (D.setInput(d, N.yy), (N.yy.lexer = D), (N.yy.parser = this), typeof D.yylloc > "u" && (D.yylloc = {}));
        var W = D.yylloc;
        h.push(W);
        var Z = D.options && D.options.ranges;
        typeof N.yy.parseError == "function"
          ? (this.parseError = N.yy.parseError)
          : (this.parseError = Object.getPrototypeOf(this).parseError);
        function J(L) {
          ((v.length = v.length - 2 * L), (g.length = g.length - L), (h.length = h.length - L));
        }
        S(J, "popStack");
        function Y() {
          var L;
          return (
            (L = c.pop() || D.lex() || G),
            typeof L != "number" && (L instanceof Array && ((c = L), (L = c.pop())), (L = m.symbols_[L] || L)),
            L
          );
        }
        S(Y, "lex");
        for (var T, R, z, F, I = {}, _, j, X, P; ;) {
          if (
            ((R = v[v.length - 1]),
            this.defaultActions[R]
              ? (z = this.defaultActions[R])
              : ((T === null || typeof T > "u") && (T = Y()), (z = O[R] && O[R][T])),
            typeof z > "u" || !z.length || !z[0])
          ) {
            var B = "";
            P = [];
            for (_ in O[R]) this.terminals_[_] && _ > q && P.push("'" + this.terminals_[_] + "'");
            (D.showPosition
              ? (B =
                  "Parse error on line " +
                  (C + 1) +
                  `:
` +
                  D.showPosition() +
                  `
Expecting ` +
                  P.join(", ") +
                  ", got '" +
                  (this.terminals_[T] || T) +
                  "'")
              : (B =
                  "Parse error on line " +
                  (C + 1) +
                  ": Unexpected " +
                  (T == G ? "end of input" : "'" + (this.terminals_[T] || T) + "'")),
              this.parseError(B, {
                text: D.match,
                token: this.terminals_[T] || T,
                line: D.yylineno,
                loc: W,
                expected: P,
              }));
          }
          if (z[0] instanceof Array && z.length > 1)
            throw new Error("Parse Error: multiple actions possible at state: " + R + ", token: " + T);
          switch (z[0]) {
            case 1:
              (v.push(T),
                g.push(D.yytext),
                h.push(D.yylloc),
                v.push(z[1]),
                (T = null),
                (H = D.yyleng),
                (M = D.yytext),
                (C = D.yylineno),
                (W = D.yylloc));
              break;
            case 2:
              if (
                ((j = this.productions_[z[1]][1]),
                (I.$ = g[g.length - j]),
                (I._$ = {
                  first_line: h[h.length - (j || 1)].first_line,
                  last_line: h[h.length - 1].last_line,
                  first_column: h[h.length - (j || 1)].first_column,
                  last_column: h[h.length - 1].last_column,
                }),
                Z && (I._$.range = [h[h.length - (j || 1)].range[0], h[h.length - 1].range[1]]),
                (F = this.performAction.apply(I, [M, H, C, N.yy, z[1], g, h].concat(K))),
                typeof F < "u")
              )
                return F;
              (j && ((v = v.slice(0, -1 * j * 2)), (g = g.slice(0, -1 * j)), (h = h.slice(0, -1 * j))),
                v.push(this.productions_[z[1]][0]),
                g.push(I.$),
                h.push(I._$),
                (X = O[v[v.length - 2]][v[v.length - 1]]),
                v.push(X));
              break;
            case 3:
              return !0;
          }
        }
        return !0;
      }, "parse"),
    },
    A = (function () {
      var w = {
        EOF: 1,
        parseError: S(function (m, v) {
          if (this.yy.parser) this.yy.parser.parseError(m, v);
          else throw new Error(m);
        }, "parseError"),
        setInput: S(function (d, m) {
          return (
            (this.yy = m || this.yy || {}),
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
        input: S(function () {
          var d = this._input[0];
          ((this.yytext += d), this.yyleng++, this.offset++, (this.match += d), (this.matched += d));
          var m = d.match(/(?:\r\n?|\n).*/g);
          return (
            m ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++,
            this.options.ranges && this.yylloc.range[1]++,
            (this._input = this._input.slice(1)),
            d
          );
        }, "input"),
        unput: S(function (d) {
          var m = d.length,
            v = d.split(/(?:\r\n?|\n)/g);
          ((this._input = d + this._input),
            (this.yytext = this.yytext.substr(0, this.yytext.length - m)),
            (this.offset -= m));
          var c = this.match.split(/(?:\r\n?|\n)/g);
          ((this.match = this.match.substr(0, this.match.length - 1)),
            (this.matched = this.matched.substr(0, this.matched.length - 1)),
            v.length - 1 && (this.yylineno -= v.length - 1));
          var g = this.yylloc.range;
          return (
            (this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: v
                ? (v.length === c.length ? this.yylloc.first_column : 0) + c[c.length - v.length].length - v[0].length
                : this.yylloc.first_column - m,
            }),
            this.options.ranges && (this.yylloc.range = [g[0], g[0] + this.yyleng - m]),
            (this.yyleng = this.yytext.length),
            this
          );
        }, "unput"),
        more: S(function () {
          return ((this._more = !0), this);
        }, "more"),
        reject: S(function () {
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
        less: S(function (d) {
          this.unput(this.match.slice(d));
        }, "less"),
        pastInput: S(function () {
          var d = this.matched.substr(0, this.matched.length - this.match.length);
          return (d.length > 20 ? "..." : "") + d.substr(-20).replace(/\n/g, "");
        }, "pastInput"),
        upcomingInput: S(function () {
          var d = this.match;
          return (
            d.length < 20 && (d += this._input.substr(0, 20 - d.length)),
            (d.substr(0, 20) + (d.length > 20 ? "..." : "")).replace(/\n/g, "")
          );
        }, "upcomingInput"),
        showPosition: S(function () {
          var d = this.pastInput(),
            m = new Array(d.length + 1).join("-");
          return (
            d +
            this.upcomingInput() +
            `
` +
            m +
            "^"
          );
        }, "showPosition"),
        test_match: S(function (d, m) {
          var v, c, g;
          if (
            (this.options.backtrack_lexer &&
              ((g = {
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
              this.options.ranges && (g.yylloc.range = this.yylloc.range.slice(0))),
            (c = d[0].match(/(?:\r\n?|\n).*/g)),
            c && (this.yylineno += c.length),
            (this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: c
                ? c[c.length - 1].length - c[c.length - 1].match(/\r?\n?/)[0].length
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
            (v = this.performAction.call(this, this.yy, this, m, this.conditionStack[this.conditionStack.length - 1])),
            this.done && this._input && (this.done = !1),
            v)
          )
            return v;
          if (this._backtrack) {
            for (var h in g) this[h] = g[h];
            return !1;
          }
          return !1;
        }, "test_match"),
        next: S(function () {
          if (this.done) return this.EOF;
          this._input || (this.done = !0);
          var d, m, v, c;
          this._more || ((this.yytext = ""), (this.match = ""));
          for (var g = this._currentRules(), h = 0; h < g.length; h++)
            if (((v = this._input.match(this.rules[g[h]])), v && (!m || v[0].length > m[0].length))) {
              if (((m = v), (c = h), this.options.backtrack_lexer)) {
                if (((d = this.test_match(v, g[h])), d !== !1)) return d;
                if (this._backtrack) {
                  m = !1;
                  continue;
                } else return !1;
              } else if (!this.options.flex) break;
            }
          return m
            ? ((d = this.test_match(m, g[c])), d !== !1 ? d : !1)
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
        lex: S(function () {
          var m = this.next();
          return m || this.lex();
        }, "lex"),
        begin: S(function (m) {
          this.conditionStack.push(m);
        }, "begin"),
        popState: S(function () {
          var m = this.conditionStack.length - 1;
          return m > 0 ? this.conditionStack.pop() : this.conditionStack[0];
        }, "popState"),
        _currentRules: S(function () {
          return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]
            ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
            : this.conditions.INITIAL.rules;
        }, "_currentRules"),
        topState: S(function (m) {
          return ((m = this.conditionStack.length - 1 - Math.abs(m || 0)), m >= 0 ? this.conditionStack[m] : "INITIAL");
        }, "topState"),
        pushState: S(function (m) {
          this.begin(m);
        }, "pushState"),
        stateStackSize: S(function () {
          return this.conditionStack.length;
        }, "stateStackSize"),
        options: { "case-insensitive": !0 },
        performAction: S(function (m, v, c, g) {
          switch (c) {
            case 0:
              break;
            case 1:
              break;
            case 2:
              break;
            case 3:
              if (m.getIndentMode && m.getIndentMode()) return ((m.consumeIndentText = !0), this.begin("INITIAL"), 22);
              break;
            case 4:
              break;
            case 5:
              (m.setIndentMode && m.setIndentMode(!1), this.begin("INITIAL"), this.unput(v.yytext));
              break;
            case 6:
              return (this.begin("bol"), 8);
            case 7:
              break;
            case 8:
              break;
            case 9:
              return 7;
            case 10:
              return 11;
            case 11:
              return 5;
            case 12:
              return 12;
            case 13:
              return 17;
            case 14:
              if (m.consumeIndentText) m.consumeIndentText = !1;
              else return 19;
              break;
            case 15:
              return 24;
            case 16:
              return ((v.yytext = v.yytext.slice(2, -2)), 14);
            case 17:
              return ((v.yytext = v.yytext.slice(1, -1).trim()), 14);
            case 18:
              return 16;
            case 19:
              return 31;
            case 20:
              return 33;
            case 21:
              return 32;
            case 22:
              return 20;
            case 23:
              return 21;
            case 24:
              return 27;
            case 25:
              return 15;
          }
        }, "anonymous"),
        rules: [
          /^(?:%%(?!\{)[^\n]*)/i,
          /^(?:[^\}]%%[^\n]*)/i,
          /^(?:[ \t]+(?=[\n\r]))/i,
          /^(?:[ \t]+(?=text\b))/i,
          /^(?:[ \t]+)/i,
          /^(?:[^ \t\n\r])/i,
          /^(?:[\n\r]+)/i,
          /^(?:%%[^\n]*)/i,
          /^(?:[ \t]+)/i,
          /^(?:$)/i,
          /^(?:title\s[^#\n;]+)/i,
          /^(?:venn-beta\b)/i,
          /^(?:set\b)/i,
          /^(?:union\b)/i,
          /^(?:text\b)/i,
          /^(?:style\b)/i,
          /^(?:\["[^\"]*"\])/i,
          /^(?:\[[^\]\"]+\])/i,
          /^(?:[+-]?(\d+(\.\d+)?|\.\d+))/i,
          /^(?:#[0-9a-fA-F]{3,8})/i,
          /^(?:rgba\(\s*[0-9.]+\s*[,]\s*[0-9.]+\s*[,]\s*[0-9.]+\s*[,]\s*[0-9.]+\s*\))/i,
          /^(?:rgb\(\s*[0-9.]+\s*[,]\s*[0-9.]+\s*[,]\s*[0-9.]+\s*\))/i,
          /^(?:[A-Za-z_][A-Za-z0-9\-_]*)/i,
          /^(?:"[^\"]*")/i,
          /^(?:,)/i,
          /^(?::)/i,
        ],
        conditions: {
          bol: {
            rules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
            inclusive: !0,
          },
          INITIAL: {
            rules: [0, 1, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
            inclusive: !0,
          },
        },
      };
      return w;
    })();
  k.lexer = A;
  function E() {
    this.yy = {};
  }
  return (S(E, "Parser"), (E.prototype = k), (k.Parser = E), new E());
})();
mt.parser = mt;
var Ae = mt,
  vt = [],
  It = [],
  kt = [],
  Mt = new Set(),
  wt,
  St = !1,
  De = S((t, n, s) => {
    const e = rt(t).sort(),
      i = s != null ? s : 10 / Math.pow(t.length, 2);
    ((wt = e), e.length === 1 && Mt.add(e[0]), vt.push({ sets: e, size: i, label: n ? st(n) : void 0 }));
  }, "addSubsetData"),
  Re = S(() => vt, "getSubsetData"),
  st = S((t) => {
    const n = t.trim();
    return n.length >= 2 && n.startsWith('"') && n.endsWith('"') ? n.slice(1, -1) : n;
  }, "normalizeText"),
  Ce = S((t) => t && st(t), "normalizeStyleValue"),
  Ne = S((t, n, s) => {
    const e = st(n);
    It.push({ sets: rt(t).sort(), id: e, label: s ? st(s) : void 0 });
  }, "addTextData"),
  Oe = S((t, n) => {
    var i;
    const s = rt(t).sort(),
      e = {};
    for (const [o, r] of n) e[o] = (i = Ce(r)) != null ? i : r;
    kt.push({ targets: s, styles: e });
  }, "addStyleData"),
  Fe = S(() => kt, "getStyleData"),
  rt = S((t) => t.map((n) => st(n)), "normalizeIdentifierList"),
  je = S((t) => {
    const s = rt(t).filter((e) => !Mt.has(e));
    if (s.length > 0) throw new Error(`unknown set identifier: ${s.join(", ")}`);
  }, "validateUnionIdentifiers"),
  Le = S(() => It, "getTextData"),
  Pe = S(() => wt, "getCurrentSets"),
  Be = S(() => St, "getIndentMode"),
  Ve = S((t) => {
    St = t;
  }, "setIndentMode"),
  qe = fe.venn;
function Wt() {
  return ue(qe, zt().venn);
}
S(Wt, "getConfig");
var Ue = S(() => {
    (ce(), (vt.length = 0), (It.length = 0), (kt.length = 0), Mt.clear(), (wt = void 0), (St = !1));
  }, "customClear"),
  Ge = {
    getConfig: Wt,
    clear: Ue,
    setAccTitle: ne,
    getAccTitle: ee,
    setDiagramTitle: te,
    getDiagramTitle: $t,
    getAccDescription: Qt,
    setAccDescription: Jt,
    addSubsetData: De,
    getSubsetData: Re,
    addTextData: Ne,
    addStyleData: Oe,
    validateUnionIdentifiers: je,
    getTextData: Le,
    getStyleData: Fe,
    getCurrentSets: Pe,
    getIndentMode: Be,
    setIndentMode: Ve,
  },
  We = S(
    (t) => `
  .venn-title {
    font-size: 32px;
    fill: ${t.vennTitleTextColor};
    font-family: ${t.fontFamily};
  }

  .venn-circle text {
    font-size: 48px;
    font-family: ${t.fontFamily};
  }

  .venn-intersection text {
    font-size: 48px;
    fill: ${t.vennSetTextColor};
    font-family: ${t.fontFamily};
  }

  .venn-text-node {
    font-family: ${t.fontFamily};
    color: ${t.vennSetTextColor};
  }
`,
    "getStyles",
  ),
  Ke = We;
function Kt(t) {
  const n = new Map();
  for (const s of t) {
    const e = s.targets.join("|"),
      i = n.get(e);
    i ? Object.assign(i, s.styles) : n.set(e, { ...s.styles });
  }
  return n;
}
S(Kt, "buildStyleByKey");
var He = S((t, n, s, e) => {
  var K, D, N, V, W, Z, J, Y;
  const i = e.db,
    o = (K = i.getConfig) == null ? void 0 : K.call(i),
    { themeVariables: r, look: l, handDrawnSeed: f } = zt(),
    u = l === "handDrawn",
    a = [r.venn1, r.venn2, r.venn3, r.venn4, r.venn5, r.venn6, r.venn7, r.venn8].filter(Boolean),
    p = (D = i.getDiagramTitle) == null ? void 0 : D.call(i),
    y = i.getSubsetData(),
    b = i.getTextData(),
    x = Kt(i.getStyleData()),
    k = Yt(y),
    A = (N = o == null ? void 0 : o.width) != null ? N : 800,
    E = (V = o == null ? void 0 : o.height) != null ? V : 450,
    d = A / 1600,
    m = p ? 48 * d : 0,
    v = (W = r.primaryTextColor) != null ? W : r.textColor,
    c = se(n);
  (c.attr("viewBox", `0 0 ${A} ${E}`),
    p &&
      c
        .append("text")
        .text(p)
        .attr("class", "venn-title")
        .attr("font-size", `${32 * d}px`)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("x", "50%")
        .attr("y", 32 * d)
        .style("fill", r.vennTitleTextColor || r.titleColor));
  const g = ct(document.createElement("div")),
    h = Se()
      .width(A)
      .height(E - m);
  g.datum(k).call(h);
  const O = u ? ie.svg(g.select("svg").node()) : void 0,
    M = ze(k, { width: A, height: E - m, padding: (Z = o == null ? void 0 : o.padding) != null ? Z : 15 }),
    C = new Map();
  for (const T of M) {
    const R = $([...T.data.sets].sort());
    C.set(R, T);
  }
  b.length > 0 && Ht(o, C, g, b, d, x);
  const H = oe(r.background || "#f4f4f4");
  (g.selectAll(".venn-circle").each(function (T, R) {
    var it, tt;
    const z = ct(this),
      I = $([...T.sets].sort()),
      _ = x.get(I),
      j = (_ == null ? void 0 : _.fill) || a[R % a.length] || r.primaryColor;
    z.classed(`venn-set-${R % 8}`, !0);
    const X = (it = _ == null ? void 0 : _["fill-opacity"]) != null ? it : 0.1,
      P = (_ == null ? void 0 : _.stroke) || j,
      B = (_ == null ? void 0 : _["stroke-width"]) || `${5 * d}`;
    if (u && O) {
      const at = C.get(I);
      if (at && at.circles.length > 0) {
        const lt = at.circles[0],
          Xt = O.circle(lt.x, lt.y, lt.radius * 2, {
            roughness: 0.7,
            seed: f,
            fill: _t(j, 0.7),
            fillStyle: "hachure",
            fillWeight: 2,
            hachureGap: 8,
            hachureAngle: -41 + R * 60,
            stroke: P,
            strokeWidth: parseFloat(String(B)),
          });
        (z.select("path").remove(), (tt = z.node()) == null || tt.insertBefore(Xt, z.select("text").node()));
      }
    } else
      z.select("path")
        .style("fill", j)
        .style("fill-opacity", X)
        .style("stroke", P)
        .style("stroke-width", B)
        .style("stroke-opacity", 0.95);
    const L = (_ == null ? void 0 : _.color) || (H ? re(j, 30) : ae(j, 30));
    z.select("text")
      .style("font-size", `${48 * d}px`)
      .style("fill", L);
  }),
    u && O
      ? g.selectAll(".venn-intersection").each(function (T) {
          var j, X, P;
          const R = ct(this),
            F = $([...T.sets].sort()),
            I = x.get(F),
            _ = I == null ? void 0 : I.fill;
          if (_) {
            const B = R.select("path"),
              L = B.attr("d");
            if (L) {
              const it = O.path(L, {
                  roughness: 0.7,
                  seed: f,
                  fill: _t(_, 0.3),
                  fillStyle: "cross-hatch",
                  fillWeight: 2,
                  hachureGap: 6,
                  hachureAngle: 60,
                  stroke: "none",
                }),
                tt = B.node();
              ((j = tt == null ? void 0 : tt.parentNode) == null || j.insertBefore(it, tt), B.remove());
            }
          } else R.select("path").style("fill-opacity", 0);
          R.select("text")
            .style("font-size", `${48 * d}px`)
            .style("fill", (P = (X = I == null ? void 0 : I.color) != null ? X : r.vennSetTextColor) != null ? P : v);
        })
      : (g
          .selectAll(".venn-intersection text")
          .style("font-size", `${48 * d}px`)
          .style("fill", (T) => {
            var F, I, _;
            const z = $([...T.sets].sort());
            return (_ = (I = (F = x.get(z)) == null ? void 0 : F.color) != null ? I : r.vennSetTextColor) != null
              ? _
              : v;
          }),
        g
          .selectAll(".venn-intersection path")
          .style("fill-opacity", (T) => {
            var F;
            const z = $([...T.sets].sort());
            return (F = x.get(z)) != null && F.fill ? 1 : 0;
          })
          .style("fill", (T) => {
            var F, I;
            const z = $([...T.sets].sort());
            return (I = (F = x.get(z)) == null ? void 0 : F.fill) != null ? I : "transparent";
          })));
  const q = c.append("g").attr("transform", `translate(0, ${m})`),
    G = g.select("svg").node();
  if (G && "childNodes" in G) for (const T of [...G.childNodes]) (J = q.node()) == null || J.appendChild(T);
  le(c, E, A, (Y = o == null ? void 0 : o.useMaxWidth) != null ? Y : !0);
}, "draw");
function $(t) {
  return t.join("|");
}
S($, "stableSetsKey");
function Ht(t, n, s, e, i, o) {
  var a, p, y;
  const r = (a = t == null ? void 0 : t.useDebugLayout) != null ? a : !1,
    f = s.select("svg").append("g").attr("class", "venn-text-nodes"),
    u = new Map();
  for (const b of e) {
    const x = $(b.sets),
      k = u.get(x);
    k ? k.push(b) : u.set(x, [b]);
  }
  for (const [b, x] of u.entries()) {
    const k = n.get(b);
    if (!(k != null && k.text)) continue;
    const A = k.text.x,
      E = k.text.y,
      w = Math.min(...k.circles.map((N) => N.radius)),
      d = Math.min(...k.circles.map((N) => N.radius - Math.hypot(A - N.x, E - N.y)));
    let m = Number.isFinite(d) ? Math.max(0, d) : 0;
    m === 0 && Number.isFinite(w) && (m = w * 0.6);
    const v = f
      .append("g")
      .attr("class", "venn-text-area")
      .attr("font-size", `${40 * i}px`);
    r &&
      v
        .append("circle")
        .attr("class", "venn-text-debug-circle")
        .attr("cx", A)
        .attr("cy", E)
        .attr("r", m)
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-width", 1.5 * i)
        .attr("stroke-dasharray", `${6 * i} ${4 * i}`);
    const c = Math.max(80 * i, m * 2 * 0.95),
      g = Math.max(60 * i, m * 2 * 0.95),
      M = (k.data.label && k.data.label.length > 0 ? Math.min(32 * i, m * 0.25) : 0) + (x.length <= 2 ? 30 * i : 0),
      C = A - c / 2,
      H = E - g / 2 + M,
      q = Math.max(1, Math.ceil(Math.sqrt(x.length))),
      G = Math.max(1, Math.ceil(x.length / q)),
      K = c / q,
      D = g / G;
    for (const [N, V] of x.entries()) {
      const W = N % q,
        Z = Math.floor(N / q),
        J = C + K * (W + 0.5),
        Y = H + D * (Z + 0.5);
      r &&
        v
          .append("rect")
          .attr("class", "venn-text-debug-cell")
          .attr("x", C + K * W)
          .attr("y", H + D * Z)
          .attr("width", K)
          .attr("height", D)
          .attr("fill", "none")
          .attr("stroke", "teal")
          .attr("stroke-width", 1 * i)
          .attr("stroke-dasharray", `${4 * i} ${3 * i}`);
      const T = K * 0.9,
        R = D * 0.9,
        z = v
          .append("foreignObject")
          .attr("class", "venn-text-node-fo")
          .attr("width", T)
          .attr("height", R)
          .attr("x", J - T / 2)
          .attr("y", Y - R / 2)
          .attr("overflow", "visible"),
        F = (p = o.get(V.id)) == null ? void 0 : p.color,
        I = z
          .append("xhtml:span")
          .attr("class", "venn-text-node")
          .style("display", "flex")
          .style("width", "100%")
          .style("height", "100%")
          .style("white-space", "normal")
          .style("align-items", "center")
          .style("justify-content", "center")
          .style("text-align", "center")
          .style("overflow-wrap", "normal")
          .style("word-break", "normal")
          .text((y = V.label) != null ? y : V.id);
      F && I.style("color", F);
    }
  }
}
S(Ht, "renderTextNodes");
function Yt(t) {
  const n = new Set(t.map((i) => [...i.sets].sort().join("|"))),
    s = new Map(t.filter((i) => i.sets.length === 1 && i.size !== void 0).map((i) => [i.sets[0], i.size])),
    e = [];
  for (const i of t) {
    if (i.sets.length < 3) continue;
    const o = [...i.sets].sort();
    for (let r = 0; r < o.length - 1; r++)
      for (let l = r + 1; l < o.length; l++) {
        const f = [o[r], o[l]],
          u = f.join("|");
        if (!n.has(u)) {
          n.add(u);
          const a = s.get(f[0]),
            p = s.get(f[1]),
            y = a !== void 0 && p !== void 0 ? Math.min(a, p) / 4 : 2.5;
          e.push({ sets: f, size: y, label: "" });
        }
      }
  }
  return e.length > 0 ? [...t, ...e] : t;
}
S(Yt, "ensurePairwiseSubsets");
var Ye = { draw: He },
  Ze = { parser: Ae, db: Ge, renderer: Ye, styles: Ke };
export { Ze as diagram };
