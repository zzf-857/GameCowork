import { I as he } from "./chunk-2Q5K7J3B-rsPRkHm0.js";
import { p as $e } from "./chunk-JWPE2WC7-mi7oxMEc.js";
import {
  _ as $,
  q as fe,
  p as ge,
  s as ue,
  g as ye,
  a as xe,
  b as me,
  D as Q,
  l as v,
  m as pe,
  d as Y,
  B as be,
  E as we,
  t as ke,
  n as M,
  F as ve,
  G as Ee,
  H as Be,
} from "./registry-BL-NPVNy.js";
import { p as Ce } from "./cynefin-OW5HDTMX-Cm6ltTqe.js";
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
  e.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
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
      r = new e.Error().stack;
    r &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[r] = "df564626-b604-48d1-a781-a772cf979632"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-df564626-b604-48d1-a781-a772cf979632"));
  })();
} catch {}
var p = { NORMAL: 0, REVERSE: 1, HIGHLIGHT: 2, MERGE: 3, CHERRY_PICK: 4 },
  Te = Ee.gitGraph,
  P = $(() => ve({ ...Te, ...Q().gitGraph }), "getConfig"),
  i = new he(() => {
    const e = P(),
      r = e.mainBranchName,
      t = e.mainBranchOrder;
    return {
      mainBranchName: r,
      commits: new Map(),
      head: null,
      branchConfig: new Map([[r, { name: r, order: t }]]),
      branches: new Map([[r, null]]),
      currBranch: r,
      direction: "LR",
      seq: 0,
      options: {},
    };
  });
function K() {
  return Be({ length: 7 });
}
$(K, "getID");
function ae(e, r) {
  const t = Object.create(null);
  return e.reduce((o, s) => {
    const c = r(s);
    return (t[c] || ((t[c] = !0), o.push(s)), o);
  }, []);
}
$(ae, "uniqBy");
var Le = $(function (e) {
    i.records.direction = e;
  }, "setDirection"),
  Me = $(function (e) {
    (v.debug("options str", e), (e = e == null ? void 0 : e.trim()), (e = e || "{}"));
    try {
      i.records.options = JSON.parse(e);
    } catch (r) {
      v.error("error while parsing gitGraph options", r.message);
    }
  }, "setOptions"),
  Ie = $(function () {
    return i.records.options;
  }, "getOptions"),
  Re = $(function (e) {
    let r = e.msg,
      t = e.id;
    const o = e.type;
    let s = e.tags;
    (v.info("commit", r, t, o, s), v.debug("Entering commit:", r, t, o, s));
    const c = P();
    ((t = M.sanitizeText(t, c)),
      (r = M.sanitizeText(r, c)),
      (s = s == null ? void 0 : s.map((a) => M.sanitizeText(a, c))));
    const n = {
      id: t || i.records.seq + "-" + K(),
      message: r,
      seq: i.records.seq++,
      type: o != null ? o : p.NORMAL,
      tags: s != null ? s : [],
      parents: i.records.head == null ? [] : [i.records.head.id],
      branch: i.records.currBranch,
    };
    ((i.records.head = n),
      v.info("main branch", c.mainBranchName),
      i.records.commits.has(n.id) && v.warn(`Commit ID ${n.id} already exists`),
      i.records.commits.set(n.id, n),
      i.records.branches.set(i.records.currBranch, n.id),
      v.debug("in pushCommit " + n.id));
  }, "commit"),
  _e = $(function (e) {
    let r = e.name;
    const t = e.order;
    if (((r = M.sanitizeText(r, P())), i.records.branches.has(r)))
      throw new Error(
        `Trying to create an existing branch. (Help: Either use a new name if you want create a new branch or try using "checkout ${r}")`,
      );
    (i.records.branches.set(r, i.records.head != null ? i.records.head.id : null),
      i.records.branchConfig.set(r, { name: r, order: t }),
      ne(r),
      v.debug("in createBranch"));
  }, "branch"),
  Oe = $((e) => {
    let r = e.branch,
      t = e.id;
    const o = e.type,
      s = e.tags,
      c = P();
    ((r = M.sanitizeText(r, c)), t && (t = M.sanitizeText(t, c)));
    const n = i.records.branches.get(i.records.currBranch),
      a = i.records.branches.get(r),
      d = n ? i.records.commits.get(n) : void 0,
      l = a ? i.records.commits.get(a) : void 0;
    if (d && l && d.branch === r) throw new Error(`Cannot merge branch '${r}' into itself.`);
    if (i.records.currBranch === r) {
      const h = new Error('Incorrect usage of "merge". Cannot merge a branch to itself');
      throw ((h.hash = { text: `merge ${r}`, token: `merge ${r}`, expected: ["branch abc"] }), h);
    }
    if (d === void 0 || !d) {
      const h = new Error(`Incorrect usage of "merge". Current branch (${i.records.currBranch})has no commits`);
      throw ((h.hash = { text: `merge ${r}`, token: `merge ${r}`, expected: ["commit"] }), h);
    }
    if (!i.records.branches.has(r)) {
      const h = new Error('Incorrect usage of "merge". Branch to be merged (' + r + ") does not exist");
      throw ((h.hash = { text: `merge ${r}`, token: `merge ${r}`, expected: [`branch ${r}`] }), h);
    }
    if (l === void 0 || !l) {
      const h = new Error('Incorrect usage of "merge". Branch to be merged (' + r + ") has no commits");
      throw ((h.hash = { text: `merge ${r}`, token: `merge ${r}`, expected: ['"commit"'] }), h);
    }
    if (d === l) {
      const h = new Error('Incorrect usage of "merge". Both branches have same head');
      throw ((h.hash = { text: `merge ${r}`, token: `merge ${r}`, expected: ["branch abc"] }), h);
    }
    if (t && i.records.commits.has(t)) {
      const h = new Error(
        'Incorrect usage of "merge". Commit with id:' + t + " already exists, use different custom id",
      );
      throw (
        (h.hash = {
          text: `merge ${r} ${t} ${o} ${s == null ? void 0 : s.join(" ")}`,
          token: `merge ${r} ${t} ${o} ${s == null ? void 0 : s.join(" ")}`,
          expected: [`merge ${r} ${t}_UNIQUE ${o} ${s == null ? void 0 : s.join(" ")}`],
        }),
        h
      );
    }
    const g = a || "",
      f = {
        id: t || `${i.records.seq}-${K()}`,
        message: `merged branch ${r} into ${i.records.currBranch}`,
        seq: i.records.seq++,
        parents: i.records.head == null ? [] : [i.records.head.id, g],
        branch: i.records.currBranch,
        type: p.MERGE,
        customType: o,
        customId: !!t,
        tags: s != null ? s : [],
      };
    ((i.records.head = f),
      i.records.commits.set(f.id, f),
      i.records.branches.set(i.records.currBranch, f.id),
      v.debug(i.records.branches),
      v.debug("in mergeBranch"));
  }, "merge"),
  Ge = $(function (e) {
    let r = e.id,
      t = e.targetId,
      o = e.tags,
      s = e.parent;
    v.debug("Entering cherryPick:", r, t, o);
    const c = P();
    if (
      ((r = M.sanitizeText(r, c)),
      (t = M.sanitizeText(t, c)),
      (o = o == null ? void 0 : o.map((d) => M.sanitizeText(d, c))),
      (s = M.sanitizeText(s, c)),
      !r || !i.records.commits.has(r))
    ) {
      const d = new Error('Incorrect usage of "cherryPick". Source commit id should exist and provided');
      throw (
        (d.hash = { text: `cherryPick ${r} ${t}`, token: `cherryPick ${r} ${t}`, expected: ["cherry-pick abc"] }),
        d
      );
    }
    const n = i.records.commits.get(r);
    if (n === void 0 || !n)
      throw new Error('Incorrect usage of "cherryPick". Source commit id should exist and provided');
    if (s && !(Array.isArray(n.parents) && n.parents.includes(s)))
      throw new Error(
        "Invalid operation: The specified parent commit is not an immediate parent of the cherry-picked commit.",
      );
    const a = n.branch;
    if (n.type === p.MERGE && !s)
      throw new Error(
        "Incorrect usage of cherry-pick: If the source commit is a merge commit, an immediate parent commit must be specified.",
      );
    if (!t || !i.records.commits.has(t)) {
      if (a === i.records.currBranch) {
        const f = new Error('Incorrect usage of "cherryPick". Source commit is already on current branch');
        throw (
          (f.hash = { text: `cherryPick ${r} ${t}`, token: `cherryPick ${r} ${t}`, expected: ["cherry-pick abc"] }),
          f
        );
      }
      const d = i.records.branches.get(i.records.currBranch);
      if (d === void 0 || !d) {
        const f = new Error(`Incorrect usage of "cherry-pick". Current branch (${i.records.currBranch})has no commits`);
        throw (
          (f.hash = { text: `cherryPick ${r} ${t}`, token: `cherryPick ${r} ${t}`, expected: ["cherry-pick abc"] }),
          f
        );
      }
      const l = i.records.commits.get(d);
      if (l === void 0 || !l) {
        const f = new Error(`Incorrect usage of "cherry-pick". Current branch (${i.records.currBranch})has no commits`);
        throw (
          (f.hash = { text: `cherryPick ${r} ${t}`, token: `cherryPick ${r} ${t}`, expected: ["cherry-pick abc"] }),
          f
        );
      }
      const g = {
        id: i.records.seq + "-" + K(),
        message: `cherry-picked ${n == null ? void 0 : n.message} into ${i.records.currBranch}`,
        seq: i.records.seq++,
        parents: i.records.head == null ? [] : [i.records.head.id, n.id],
        branch: i.records.currBranch,
        type: p.CHERRY_PICK,
        tags: o ? o.filter(Boolean) : [`cherry-pick:${n.id}${n.type === p.MERGE ? `|parent:${s}` : ""}`],
      };
      ((i.records.head = g),
        i.records.commits.set(g.id, g),
        i.records.branches.set(i.records.currBranch, g.id),
        v.debug(i.records.branches),
        v.debug("in cherryPick"));
    }
  }, "cherryPick"),
  ne = $(function (e) {
    var r;
    if (((e = M.sanitizeText(e, P())), i.records.branches.has(e))) {
      i.records.currBranch = e;
      const t = i.records.branches.get(i.records.currBranch);
      t === void 0 || !t
        ? (i.records.head = null)
        : (i.records.head = (r = i.records.commits.get(t)) != null ? r : null);
    } else {
      const t = new Error(`Trying to checkout branch which is not yet created. (Help try using "branch ${e}")`);
      throw ((t.hash = { text: `checkout ${e}`, token: `checkout ${e}`, expected: [`branch ${e}`] }), t);
    }
  }, "checkout");
function X(e, r, t) {
  const o = e.indexOf(r);
  o === -1 ? e.push(t) : e.splice(o, 1, t);
}
$(X, "upsert");
function Z(e) {
  const r = e.reduce((s, c) => (s.seq > c.seq ? s : c), e[0]);
  let t = "";
  e.forEach(function (s) {
    s === r ? (t += "	*") : (t += "	|");
  });
  const o = [t, r.id, r.seq];
  for (const s in i.records.branches) i.records.branches.get(s) === r.id && o.push(s);
  if ((v.debug(o.join(" ")), r.parents && r.parents.length == 2 && r.parents[0] && r.parents[1])) {
    const s = i.records.commits.get(r.parents[0]);
    (X(e, r, s), r.parents[1] && e.push(i.records.commits.get(r.parents[1])));
  } else {
    if (r.parents.length == 0) return;
    if (r.parents[0]) {
      const s = i.records.commits.get(r.parents[0]);
      X(e, r, s);
    }
  }
  ((e = ae(e, (s) => s.id)), Z(e));
}
$(Z, "prettyPrintCommitHistory");
var He = $(function () {
    v.debug(i.records.commits);
    const e = se()[0];
    Z([e]);
  }, "prettyPrint"),
  Se = $(function () {
    (i.reset(), ke());
  }, "clear"),
  Ae = $(function () {
    return [...i.records.branchConfig.values()]
      .map((r, t) => (r.order !== null && r.order !== void 0 ? r : { ...r, order: parseFloat(`0.${t}`) }))
      .sort((r, t) => {
        var o, s;
        return ((o = r.order) != null ? o : 0) - ((s = t.order) != null ? s : 0);
      })
      .map(({ name: r }) => ({ name: r }));
  }, "getBranchesAsObjArray"),
  De = $(function () {
    return i.records.branches;
  }, "getBranches"),
  qe = $(function () {
    return i.records.commits;
  }, "getCommits"),
  se = $(function () {
    const e = [...i.records.commits.values()];
    return (
      e.forEach(function (r) {
        v.debug(r.id);
      }),
      e.sort((r, t) => r.seq - t.seq),
      e
    );
  }, "getCommitsArray"),
  Pe = $(function () {
    return i.records.currBranch;
  }, "getCurrentBranch"),
  We = $(function () {
    return i.records.direction;
  }, "getDirection"),
  Ne = $(function () {
    return i.records.head;
  }, "getHead"),
  oe = {
    commitType: p,
    getConfig: P,
    setDirection: Le,
    setOptions: Me,
    getOptions: Ie,
    commit: Re,
    branch: _e,
    merge: Oe,
    cherryPick: Ge,
    checkout: ne,
    prettyPrint: He,
    clear: Se,
    getBranchesAsObjArray: Ae,
    getBranches: De,
    getCommits: qe,
    getCommitsArray: se,
    getCurrentBranch: Pe,
    getDirection: We,
    getHead: Ne,
    setAccTitle: me,
    getAccTitle: xe,
    getAccDescription: ye,
    setAccDescription: ue,
    setDiagramTitle: ge,
    getDiagramTitle: fe,
  },
  Fe = $((e, r) => {
    ($e(e, r), e.dir && r.setDirection(e.dir));
    for (const t of e.statements) ze(t, r);
  }, "populate"),
  ze = $((e, r) => {
    const o = {
      Commit: $((s) => r.commit(Ye(s)), "Commit"),
      Branch: $((s) => r.branch(je(s)), "Branch"),
      Merge: $((s) => r.merge(Ue(s)), "Merge"),
      Checkout: $((s) => r.checkout(Ke(s)), "Checkout"),
      CherryPicking: $((s) => r.cherryPick(Ve(s)), "CherryPicking"),
    }[e.$type];
    o ? o(e) : v.error(`Unknown statement type: ${e.$type}`);
  }, "parseStatement"),
  Ye = $((e) => {
    var t, o;
    return {
      id: e.id,
      msg: (t = e.message) != null ? t : "",
      type: e.type !== void 0 ? p[e.type] : p.NORMAL,
      tags: (o = e.tags) != null ? o : void 0,
    };
  }, "parseCommit"),
  je = $((e) => {
    var t;
    return { name: e.name, order: (t = e.order) != null ? t : 0 };
  }, "parseBranch"),
  Ue = $((e) => {
    var t, o;
    return {
      branch: e.branch,
      id: (t = e.id) != null ? t : "",
      type: e.type !== void 0 ? p[e.type] : void 0,
      tags: (o = e.tags) != null ? o : void 0,
    };
  }, "parseMerge"),
  Ke = $((e) => e.branch, "parseCheckout"),
  Ve = $((e) => {
    var t;
    return {
      id: e.id,
      targetId: "",
      tags: ((t = e.tags) == null ? void 0 : t.length) === 0 ? void 0 : e.tags,
      parent: e.parent,
    };
  }, "parseCherryPicking"),
  Xe = {
    parse: $(async (e) => {
      const r = await Ce("gitGraph", e);
      (v.debug(r), Fe(r, oe));
    }, "parse"),
  },
  S = 10,
  A = 40,
  I = 4,
  G = 2,
  D = 8,
  V = new Set(["redux", "redux-dark", "redux-color", "redux-dark-color"]),
  J = 12,
  ee = new Set(["redux-color", "redux-dark-color"]),
  Je = new Set(["dark", "redux-dark", "redux-dark-color", "neo-dark"]),
  q = $((e, r, t = !1) => (t && e > 0 ? ((e - 1) % (r - 1)) + 1 : e % r), "calcColorIndex"),
  C = new Map(),
  T = new Map(),
  j = 30,
  F = new Map(),
  U = [],
  H = 0,
  x = "LR",
  Qe = $(() => {
    (C.clear(), T.clear(), F.clear(), (H = 0), (U = []), (x = "LR"));
  }, "clear"),
  ce = $((e) => {
    const r = document.createElementNS("http://www.w3.org/2000/svg", "text");
    return (
      (typeof e == "string" ? e.split(/\\n|\n|<br\s*\/?>/gi) : e).forEach((o) => {
        const s = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        (s.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve"),
          s.setAttribute("dy", "1em"),
          s.setAttribute("x", "0"),
          s.setAttribute("class", "row"),
          (s.textContent = o.trim()),
          r.appendChild(s));
      }),
      r
    );
  }, "drawText"),
  ie = $((e) => {
    let r, t, o;
    return (
      x === "BT"
        ? ((t = $((s, c) => s <= c, "comparisonFunc")), (o = 1 / 0))
        : ((t = $((s, c) => s >= c, "comparisonFunc")), (o = 0)),
      e.forEach((s) => {
        var n, a;
        const c =
          x === "TB" || x == "BT" ? ((n = T.get(s)) == null ? void 0 : n.y) : (a = T.get(s)) == null ? void 0 : a.x;
        c !== void 0 && t(c, o) && ((r = s), (o = c));
      }),
      r
    );
  }, "findClosestParent"),
  Ze = $((e) => {
    let r = "",
      t = 1 / 0;
    return (
      e.forEach((o) => {
        const s = T.get(o).y;
        s <= t && ((r = o), (t = s));
      }),
      r || void 0
    );
  }, "findClosestParentBT"),
  er = $((e, r, t) => {
    let o = t,
      s = t;
    const c = [];
    (e.forEach((n) => {
      const a = r.get(n);
      if (!a) throw new Error(`Commit not found for key ${n}`);
      (a.parents.length ? ((o = tr(a)), (s = Math.max(o, s))) : c.push(a), ar(a, o));
    }),
      (o = s),
      c.forEach((n) => {
        nr(n, o, t);
      }),
      e.forEach((n) => {
        const a = r.get(n);
        if (a != null && a.parents.length) {
          const d = Ze(a.parents);
          ((o = T.get(d).y - A), o <= s && (s = o));
          const l = C.get(a.branch).pos,
            g = o - S;
          T.set(a.id, { x: l, y: g });
        }
      }));
  }, "setParallelBTPos"),
  rr = $((e) => {
    var o;
    const r = ie(e.parents.filter((s) => s !== null));
    if (!r) throw new Error(`Closest parent not found for commit ${e.id}`);
    const t = (o = T.get(r)) == null ? void 0 : o.y;
    if (t === void 0) throw new Error(`Closest parent position not found for commit ${e.id}`);
    return t;
  }, "findClosestParentPos"),
  tr = $((e) => rr(e) + A, "calculateCommitPosition"),
  ar = $((e, r) => {
    const t = C.get(e.branch);
    if (!t) throw new Error(`Branch not found for commit ${e.id}`);
    const o = t.pos,
      s = r + S;
    return (T.set(e.id, { x: o, y: s }), { x: o, y: s });
  }, "setCommitPosition"),
  nr = $((e, r, t) => {
    const o = C.get(e.branch);
    if (!o) throw new Error(`Branch not found for commit ${e.id}`);
    const s = r + t,
      c = o.pos;
    T.set(e.id, { x: c, y: s });
  }, "setRootPosition"),
  sr = $((e, r, t, o, s, c) => {
    const { theme: n } = Y(),
      a = V.has(n != null ? n : ""),
      d = ee.has(n != null ? n : ""),
      l = Je.has(n != null ? n : "");
    if (c === p.HIGHLIGHT)
      (e
        .append("rect")
        .attr("x", t.x - 10 + (a ? 3 : 0))
        .attr("y", t.y - 10 + (a ? 3 : 0))
        .attr("width", a ? 14 : 20)
        .attr("height", a ? 14 : 20)
        .attr("class", `commit ${r.id} commit-highlight${q(s, D, d)} ${o}-outer`),
        e
          .append("rect")
          .attr("x", t.x - 6 + (a ? 2 : 0))
          .attr("y", t.y - 6 + (a ? 2 : 0))
          .attr("width", a ? 8 : 12)
          .attr("height", a ? 8 : 12)
          .attr("class", `commit ${r.id} commit${q(s, D, d)} ${o}-inner`));
    else if (c === p.CHERRY_PICK)
      (e
        .append("circle")
        .attr("cx", t.x)
        .attr("cy", t.y)
        .attr("r", a ? 7 : 10)
        .attr("class", `commit ${r.id} ${o}`),
        e
          .append("circle")
          .attr("cx", t.x - 3)
          .attr("cy", t.y + 2)
          .attr("r", a ? 2.5 : 2.75)
          .attr("fill", l ? "#000000" : "#fff")
          .attr("class", `commit ${r.id} ${o}`),
        e
          .append("circle")
          .attr("cx", t.x + 3)
          .attr("cy", t.y + 2)
          .attr("r", a ? 2.5 : 2.75)
          .attr("fill", l ? "#000000" : "#fff")
          .attr("class", `commit ${r.id} ${o}`),
        e
          .append("line")
          .attr("x1", t.x + 3)
          .attr("y1", t.y + 1)
          .attr("x2", t.x)
          .attr("y2", t.y - 5)
          .attr("stroke", l ? "#000000" : "#fff")
          .attr("class", `commit ${r.id} ${o}`),
        e
          .append("line")
          .attr("x1", t.x - 3)
          .attr("y1", t.y + 1)
          .attr("x2", t.x)
          .attr("y2", t.y - 5)
          .attr("stroke", l ? "#000000" : "#fff")
          .attr("class", `commit ${r.id} ${o}`));
    else {
      const g = e.append("circle");
      if (
        (g.attr("cx", t.x),
        g.attr("cy", t.y),
        g.attr("r", a ? 7 : 10),
        g.attr("class", `commit ${r.id} commit${q(s, D, d)}`),
        c === p.MERGE)
      ) {
        const f = e.append("circle");
        (f.attr("cx", t.x),
          f.attr("cy", t.y),
          f.attr("r", a ? 5 : 6),
          f.attr("class", `commit ${o} ${r.id} commit${q(s, D, d)}`));
      }
      if (c === p.REVERSE) {
        const f = e.append("path"),
          h = a ? 4 : 5;
        f.attr("d", `M ${t.x - h},${t.y - h}L${t.x + h},${t.y + h}M${t.x - h},${t.y + h}L${t.x + h},${t.y - h}`).attr(
          "class",
          `commit ${o} ${r.id} commit${q(s, D, d)}`,
        );
      }
    }
  }, "drawCommitBullet"),
  or = $((e, r, t, o, s) => {
    var c;
    if (r.type !== p.CHERRY_PICK && ((r.customId && r.type === p.MERGE) || r.type !== p.MERGE) && s.showCommitLabel) {
      const n = e.append("g"),
        a = n.insert("rect").attr("class", "commit-label-bkg"),
        d = n
          .append("text")
          .attr("x", o)
          .attr("y", t.y + 25)
          .attr("class", "commit-label")
          .text(r.id),
        l = (c = d.node()) == null ? void 0 : c.getBBox();
      if (
        l &&
        (a
          .attr("x", t.posWithOffset - l.width / 2 - G)
          .attr("y", t.y + 13.5)
          .attr("width", l.width + 2 * G)
          .attr("height", l.height + 2 * G),
        x === "TB" || x === "BT"
          ? (a.attr("x", t.x - (l.width + 4 * I + 5)).attr("y", t.y - 12),
            d.attr("x", t.x - (l.width + 4 * I)).attr("y", t.y + l.height - 12))
          : d.attr("x", t.posWithOffset - l.width / 2),
        s.rotateCommitLabel)
      )
        if (x === "TB" || x === "BT")
          (d.attr("transform", "rotate(-45, " + t.x + ", " + t.y + ")"),
            a.attr("transform", "rotate(-45, " + t.x + ", " + t.y + ")"));
        else {
          const g = -7.5 - ((l.width + 10) / 25) * 9.5,
            f = 10 + (l.width / 25) * 8.5;
          n.attr("transform", "translate(" + g + ", " + f + ") rotate(-45, " + o + ", " + t.y + ")");
        }
    }
  }, "drawCommitLabel"),
  cr = $((e, r, t, o) => {
    var s;
    if (r.tags.length > 0) {
      let c = 0,
        n = 0,
        a = 0;
      const d = [];
      for (const l of r.tags.reverse()) {
        const g = e.insert("polygon"),
          f = e.append("circle"),
          h = e
            .append("text")
            .attr("y", t.y - 16 - c)
            .attr("class", "tag-label")
            .text(l),
          y = (s = h.node()) == null ? void 0 : s.getBBox();
        if (!y) throw new Error("Tag bbox not found");
        ((n = Math.max(n, y.width)),
          (a = Math.max(a, y.height)),
          h.attr("x", t.posWithOffset - y.width / 2),
          d.push({ tag: h, hole: f, rect: g, yOffset: c }),
          (c += 20));
      }
      for (const { tag: l, hole: g, rect: f, yOffset: h } of d) {
        const y = a / 2,
          u = t.y - 19.2 - h;
        if (
          (f.attr("class", "tag-label-bkg").attr(
            "points",
            `
      ${o - n / 2 - I / 2},${u + G}  
      ${o - n / 2 - I / 2},${u - G}
      ${t.posWithOffset - n / 2 - I},${u - y - G}
      ${t.posWithOffset + n / 2 + I},${u - y - G}
      ${t.posWithOffset + n / 2 + I},${u + y + G}
      ${t.posWithOffset - n / 2 - I},${u + y + G}`,
          ),
          g
            .attr("cy", u)
            .attr("cx", o - n / 2 + I / 2)
            .attr("r", 1.5)
            .attr("class", "tag-hole"),
          x === "TB" || x === "BT")
        ) {
          const m = o + h;
          (f
            .attr("class", "tag-label-bkg")
            .attr(
              "points",
              `
        ${t.x},${m + 2}
        ${t.x},${m - 2}
        ${t.x + S},${m - y - 2}
        ${t.x + S + n + 4},${m - y - 2}
        ${t.x + S + n + 4},${m + y + 2}
        ${t.x + S},${m + y + 2}`,
            )
            .attr("transform", "translate(12,12) rotate(45, " + t.x + "," + o + ")"),
            g
              .attr("cx", t.x + I / 2)
              .attr("cy", m)
              .attr("transform", "translate(12,12) rotate(45, " + t.x + "," + o + ")"),
            l
              .attr("x", t.x + 5)
              .attr("y", m + 3)
              .attr("transform", "translate(14,14) rotate(45, " + t.x + "," + o + ")"));
        }
      }
    }
  }, "drawCommitTags"),
  ir = $((e) => {
    var t;
    switch ((t = e.customType) != null ? t : e.type) {
      case p.NORMAL:
        return "commit-normal";
      case p.REVERSE:
        return "commit-reverse";
      case p.HIGHLIGHT:
        return "commit-highlight";
      case p.MERGE:
        return "commit-merge";
      case p.CHERRY_PICK:
        return "commit-cherry-pick";
      default:
        return "commit-normal";
    }
  }, "getCommitClassType"),
  dr = $((e, r, t, o) => {
    var c, n, a;
    const s = { x: 0, y: 0 };
    if (e.parents.length > 0) {
      const d = ie(e.parents);
      if (d) {
        const l = (c = o.get(d)) != null ? c : s;
        return r === "TB" ? l.y + A : r === "BT" ? ((n = o.get(e.id)) != null ? n : s).y - A : l.x + A;
      }
    } else return r === "TB" ? j : r === "BT" ? ((a = o.get(e.id)) != null ? a : s).y - A : 0;
    return 0;
  }, "calculatePosition"),
  lr = $((e, r, t) => {
    var d, l, g;
    const o = x === "BT" && t ? r : r + S,
      s = (d = C.get(e.branch)) == null ? void 0 : d.pos,
      c = x === "TB" || x === "BT" ? ((l = C.get(e.branch)) == null ? void 0 : l.pos) : o;
    if (c === void 0 || s === void 0) throw new Error(`Position were undefined for commit ${e.id}`);
    const n = V.has((g = Y().theme) != null ? g : ""),
      a = x === "TB" || x === "BT" ? o : s + (n ? J / 2 + 1 : -2);
    return { x: c, y: a, posWithOffset: o };
  }, "getCommitPosition"),
  te = $((e, r, t, o) => {
    var f;
    const s = e.append("g").attr("class", "commit-bullets"),
      c = e.append("g").attr("class", "commit-labels");
    let n = x === "TB" || x === "BT" ? j : 0;
    const a = [...r.keys()],
      d = (f = o.parallelCommits) != null ? f : !1,
      l = $((h, y) => {
        var E, b;
        const u = (E = r.get(h)) == null ? void 0 : E.seq,
          m = (b = r.get(y)) == null ? void 0 : b.seq;
        return u !== void 0 && m !== void 0 ? u - m : 0;
      }, "sortKeys");
    let g = a.sort(l);
    (x === "BT" && (d && er(g, r, n), (g = g.reverse())),
      g.forEach((h) => {
        var m, E, b;
        const y = r.get(h);
        if (!y) throw new Error(`Commit not found for key ${h}`);
        d && (n = dr(y, x, n, T));
        const u = lr(y, n, d);
        if (t) {
          const R = ir(y),
            L = (m = y.customType) != null ? m : y.type,
            w = (b = (E = C.get(y.branch)) == null ? void 0 : E.index) != null ? b : 0;
          (sr(s, y, u, R, w, L), or(c, y, u, n, o), cr(c, y, u, n));
        }
        (x === "TB" || x === "BT"
          ? T.set(y.id, { x: u.x, y: u.posWithOffset })
          : T.set(y.id, { x: u.posWithOffset, y: u.y }),
          (n = x === "BT" && d ? n + A : n + A + S),
          n > H && (H = n));
      }));
  }, "drawCommits"),
  hr = $((e, r, t, o, s) => {
    const n = (x === "TB" || x === "BT" ? t.x < o.x : t.y < o.y) ? r.branch : e.branch,
      a = $((l) => l.branch === n, "isOnBranchToGetCurve"),
      d = $((l) => l.seq > e.seq && l.seq < r.seq, "isBetweenCommits");
    return [...s.values()].some((l) => d(l) && a(l));
  }, "shouldRerouteArrow"),
  z = $((e, r, t = 0) => {
    const o = e + Math.abs(e - r) / 2;
    if (t > 5) return o;
    if (U.every((n) => Math.abs(n - o) >= 10)) return (U.push(o), o);
    const c = Math.abs(e - r);
    return z(e, r - c / 5, t + 1);
  }, "findLane"),
  $r = $((e, r, t, o) => {
    var m, E, b, R, L;
    const { theme: s } = Y(),
      c = ee.has(s != null ? s : ""),
      n = T.get(r.id),
      a = T.get(t.id);
    if (n === void 0 || a === void 0) throw new Error(`Commit positions not found for commits ${r.id} and ${t.id}`);
    const d = hr(r, t, n, a, o);
    let l = "",
      g = "",
      f = 0,
      h = 0,
      y = (m = C.get(t.branch)) == null ? void 0 : m.index;
    t.type === p.MERGE && r.id !== t.parents[0] && (y = (E = C.get(r.branch)) == null ? void 0 : E.index);
    let u;
    if (d) {
      ((l = "A 10 10, 0, 0, 0,"), (g = "A 10 10, 0, 0, 1,"), (f = 10), (h = 10));
      const w = n.y < a.y ? z(n.y, a.y) : z(a.y, n.y),
        k = n.x < a.x ? z(n.x, a.x) : z(a.x, n.x);
      x === "TB"
        ? n.x < a.x
          ? (u = `M ${n.x} ${n.y} L ${k - f} ${n.y} ${g} ${k} ${n.y + h} L ${k} ${a.y - f} ${l} ${k + h} ${a.y} L ${a.x} ${a.y}`)
          : ((y = (b = C.get(r.branch)) == null ? void 0 : b.index),
            (u = `M ${n.x} ${n.y} L ${k + f} ${n.y} ${l} ${k} ${n.y + h} L ${k} ${a.y - f} ${g} ${k - h} ${a.y} L ${a.x} ${a.y}`))
        : x === "BT"
          ? n.x < a.x
            ? (u = `M ${n.x} ${n.y} L ${k - f} ${n.y} ${l} ${k} ${n.y - h} L ${k} ${a.y + f} ${g} ${k + h} ${a.y} L ${a.x} ${a.y}`)
            : ((y = (R = C.get(r.branch)) == null ? void 0 : R.index),
              (u = `M ${n.x} ${n.y} L ${k + f} ${n.y} ${g} ${k} ${n.y - h} L ${k} ${a.y + f} ${l} ${k - h} ${a.y} L ${a.x} ${a.y}`))
          : n.y < a.y
            ? (u = `M ${n.x} ${n.y} L ${n.x} ${w - f} ${l} ${n.x + h} ${w} L ${a.x - f} ${w} ${g} ${a.x} ${w + h} L ${a.x} ${a.y}`)
            : ((y = (L = C.get(r.branch)) == null ? void 0 : L.index),
              (u = `M ${n.x} ${n.y} L ${n.x} ${w + f} ${g} ${n.x + h} ${w} L ${a.x - f} ${w} ${l} ${a.x} ${w - h} L ${a.x} ${a.y}`));
    } else
      ((l = "A 20 20, 0, 0, 0,"),
        (g = "A 20 20, 0, 0, 1,"),
        (f = 20),
        (h = 20),
        x === "TB"
          ? (n.x < a.x &&
              (t.type === p.MERGE && r.id !== t.parents[0]
                ? (u = `M ${n.x} ${n.y} L ${n.x} ${a.y - f} ${l} ${n.x + h} ${a.y} L ${a.x} ${a.y}`)
                : (u = `M ${n.x} ${n.y} L ${a.x - f} ${n.y} ${g} ${a.x} ${n.y + h} L ${a.x} ${a.y}`)),
            n.x > a.x &&
              ((l = "A 20 20, 0, 0, 0,"),
              (g = "A 20 20, 0, 0, 1,"),
              (f = 20),
              (h = 20),
              t.type === p.MERGE && r.id !== t.parents[0]
                ? (u = `M ${n.x} ${n.y} L ${n.x} ${a.y - f} ${g} ${n.x - h} ${a.y} L ${a.x} ${a.y}`)
                : (u = `M ${n.x} ${n.y} L ${a.x + f} ${n.y} ${l} ${a.x} ${n.y + h} L ${a.x} ${a.y}`)),
            n.x === a.x && (u = `M ${n.x} ${n.y} L ${a.x} ${a.y}`))
          : x === "BT"
            ? (n.x < a.x &&
                (t.type === p.MERGE && r.id !== t.parents[0]
                  ? (u = `M ${n.x} ${n.y} L ${n.x} ${a.y + f} ${g} ${n.x + h} ${a.y} L ${a.x} ${a.y}`)
                  : (u = `M ${n.x} ${n.y} L ${a.x - f} ${n.y} ${l} ${a.x} ${n.y - h} L ${a.x} ${a.y}`)),
              n.x > a.x &&
                ((l = "A 20 20, 0, 0, 0,"),
                (g = "A 20 20, 0, 0, 1,"),
                (f = 20),
                (h = 20),
                t.type === p.MERGE && r.id !== t.parents[0]
                  ? (u = `M ${n.x} ${n.y} L ${n.x} ${a.y + f} ${l} ${n.x - h} ${a.y} L ${a.x} ${a.y}`)
                  : (u = `M ${n.x} ${n.y} L ${a.x + f} ${n.y} ${g} ${a.x} ${n.y - h} L ${a.x} ${a.y}`)),
              n.x === a.x && (u = `M ${n.x} ${n.y} L ${a.x} ${a.y}`))
            : (n.y < a.y &&
                (t.type === p.MERGE && r.id !== t.parents[0]
                  ? (u = `M ${n.x} ${n.y} L ${a.x - f} ${n.y} ${g} ${a.x} ${n.y + h} L ${a.x} ${a.y}`)
                  : (u = `M ${n.x} ${n.y} L ${n.x} ${a.y - f} ${l} ${n.x + h} ${a.y} L ${a.x} ${a.y}`)),
              n.y > a.y &&
                (t.type === p.MERGE && r.id !== t.parents[0]
                  ? (u = `M ${n.x} ${n.y} L ${a.x - f} ${n.y} ${l} ${a.x} ${n.y - h} L ${a.x} ${a.y}`)
                  : (u = `M ${n.x} ${n.y} L ${n.x} ${a.y + f} ${g} ${n.x + h} ${a.y} L ${a.x} ${a.y}`)),
              n.y === a.y && (u = `M ${n.x} ${n.y} L ${a.x} ${a.y}`)));
    if (u === void 0) throw new Error("Line definition not found");
    e.append("path")
      .attr("d", u)
      .attr("class", "arrow arrow" + q(y, D, c));
  }, "drawArrow"),
  fr = $((e, r) => {
    const t = e.append("g").attr("class", "commit-arrows");
    [...r.keys()].forEach((o) => {
      const s = r.get(o);
      s.parents &&
        s.parents.length > 0 &&
        s.parents.forEach((c) => {
          $r(t, r.get(c), s, r);
        });
    });
  }, "drawArrows"),
  gr = $((e, r, t, o) => {
    const { look: s, theme: c, themeVariables: n } = Y(),
      { dropShadow: a, THEME_COLOR_LIMIT: d } = n,
      l = V.has(c != null ? c : ""),
      g = ee.has(c != null ? c : ""),
      f = e.append("g");
    r.forEach((h, y) => {
      var re;
      const u = q(y, l ? d : D, g),
        m = (re = C.get(h.name)) == null ? void 0 : re.pos;
      if (m === void 0) throw new Error(`Position not found for branch ${h.name}`);
      const E = x === "TB" || x === "BT" ? m : l ? m + J / 2 + 1 : m - 2,
        b = f.append("line");
      (b.attr("x1", 0),
        b.attr("y1", E),
        b.attr("x2", H),
        b.attr("y2", E),
        b.attr("class", "branch branch" + u),
        x === "TB"
          ? (b.attr("y1", j), b.attr("x1", m), b.attr("y2", H), b.attr("x2", m))
          : x === "BT" && (b.attr("y1", H), b.attr("x1", m), b.attr("y2", j), b.attr("x2", m)),
        U.push(E));
      const R = h.name,
        L = ce(R),
        w = f.insert("rect"),
        _ = f
          .insert("g")
          .attr("class", "branchLabel")
          .insert("g")
          .attr("class", "label branch-label" + u);
      _.node().appendChild(L);
      const B = L.getBBox(),
        N = l ? 0 : 4,
        W = l ? 16 : 0,
        O = l ? J : 0;
      (s === "neo" && w.attr("data-look", "neo"),
        w
          .attr("class", "branchLabelBkg label" + u)
          .attr("style", s === "neo" ? `filter:${l ? `url(#${o}-drop-shadow)` : a}` : "")
          .attr("rx", N)
          .attr("ry", N)
          .attr("x", -B.width - 4 - (t.rotateCommitLabel === !0 ? 30 : 0))
          .attr("y", -B.height / 2 + 10)
          .attr("width", B.width + 18 + W)
          .attr("height", B.height + 4 + O),
        _.attr(
          "transform",
          "translate(" +
            (-B.width - 14 - (t.rotateCommitLabel === !0 ? 30 : 0) + W / 2) +
            ", " +
            (E - B.height / 2 - 2) +
            ")",
        ),
        x === "TB"
          ? (w.attr("x", m - B.width / 2 - 10).attr("y", 0),
            _.attr("transform", "translate(" + (m - B.width / 2 - 5) + ", 0)"),
            l &&
              (w.attr("transform", `translate(${-W / 2 - 3}, ${-O - 10})`),
              _.attr("transform", "translate(" + (m - B.width / 2 - 5) + ", " + (-O * 2 + 7) + ")")))
          : x === "BT"
            ? (w.attr("x", m - B.width / 2 - 10).attr("y", H),
              _.attr("transform", "translate(" + (m - B.width / 2 - 5) + ", " + H + ")"),
              l &&
                (w.attr("transform", `translate(${-W / 2 - 3}, ${O + 10})`),
                _.attr("transform", "translate(" + (m - B.width / 2 - 5) + ", " + (H + O * 2 + 4) + ")")))
            : w.attr("transform", "translate(-19, " + (E - 12 - O / 2) + ")"));
    });
  }, "drawBranches"),
  ur = $(function (e, r, t, o, s) {
    return (C.set(e, { pos: r, index: t }), (r += 50 + (s ? 40 : 0) + (x === "TB" || x === "BT" ? o.width / 2 : 0)), r);
  }, "setBranchPosition"),
  yr = $(function (e, r, t, o) {
    var b, R;
    (Qe(),
      v.debug(
        "in gitgraph renderer",
        e +
          `
`,
        "id:",
        r,
        t,
      ));
    const s = o.db;
    if (!s.getConfig) {
      v.error("getConfig method is not available on db");
      return;
    }
    const c = s.getConfig(),
      n = (b = c.rotateCommitLabel) != null ? b : !1;
    F = s.getCommits();
    const a = s.getBranchesAsObjArray();
    x = s.getDirection();
    const d = pe(`[id="${r}"]`),
      { look: l, theme: g, themeVariables: f } = Y(),
      { useGradient: h, gradientStart: y, gradientStop: u, filterColor: m } = f;
    if (h) {
      const L = d
        .append("defs")
        .append("linearGradient")
        .attr("id", r + "-gradient")
        .attr("gradientUnits", "objectBoundingBox")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
      (L.append("stop").attr("offset", "0%").attr("stop-color", y).attr("stop-opacity", 1),
        L.append("stop").attr("offset", "100%").attr("stop-color", u).attr("stop-opacity", 1));
    }
    l === "neo" &&
      V.has(g != null ? g : "") &&
      d
        .append("defs")
        .append("filter")
        .attr("id", r + "-drop-shadow")
        .attr("height", "130%")
        .attr("width", "130%")
        .append("feDropShadow")
        .attr("dx", "4")
        .attr("dy", "4")
        .attr("stdDeviation", 0)
        .attr("flood-opacity", "0.06")
        .attr("flood-color", m);
    let E = 0;
    (a.forEach((L, w) => {
      var O;
      const k = ce(L.name),
        _ = d.append("g"),
        B = _.insert("g").attr("class", "branchLabel"),
        N = B.insert("g").attr("class", "label branch-label");
      (O = N.node()) == null || O.appendChild(k);
      const W = k.getBBox();
      ((E = ur(L.name, E, w, W, n)), N.remove(), B.remove(), _.remove());
    }),
      te(d, F, !1, c),
      c.showBranches && gr(d, a, c, r),
      fr(d, F),
      te(d, F, !0, c),
      be.insertTitle(d, "gitTitleText", (R = c.titleTopMargin) != null ? R : 0, s.getDiagramTitle()),
      we(void 0, d, c.diagramPadding, c.useMaxWidth));
  }, "draw"),
  xr = { draw: yr },
  de = 8,
  le = new Set(["redux", "redux-dark", "redux-color", "redux-dark-color"]),
  mr = new Set(["redux-color", "redux-dark-color"]),
  pr = new Set(["neo", "neo-dark"]),
  br = new Set(["dark", "redux-dark", "redux-dark-color", "neo-dark"]),
  wr = new Set(["redux", "redux-dark", "redux-color", "redux-dark-color", "neo", "neo-dark"]),
  kr = $((e) => {
    const { svgId: r } = e;
    let t = "";
    if (e.useGradient && r)
      for (let o = 0; o < e.THEME_COLOR_LIMIT; o++)
        t += `
      .label${o}  { fill: ${e.mainBkg}; stroke: url(${r}-gradient); stroke-width: ${e.strokeWidth};}
             `;
    return t;
  }, "genGitGraphGradient"),
  vr = $((e) => {
    const r = Q(),
      { theme: t, themeVariables: o } = r,
      { borderColorArray: s } = o,
      c = le.has(t);
    if (pr.has(t)) {
      let n = "";
      for (let a = 0; a < e.THEME_COLOR_LIMIT; a++)
        if (a === 0)
          n += `
        .branch-label${a} { fill: ${e.nodeBorder};}
        .commit${a} { stroke: ${e.nodeBorder};   }
        .commit-highlight${a} { stroke: ${e.nodeBorder}; fill: ${e.nodeBorder}; }
        .arrow${a} { stroke: ${e.nodeBorder}; }
        .commit-bullets { fill: ${e.nodeBorder}; }
        .commit-cherry-pick${a} { stroke: ${e.nodeBorder}; }
        ${kr(e)}`;
        else {
          const d = a % de;
          n += `
        .branch-label${a} { fill: ${e["gitBranchLabel" + d]}; }
        .commit${a} { stroke: ${e["git" + d]}; fill: ${e["git" + d]}; }
        .commit-highlight${a} { stroke: ${e["gitInv" + d]}; fill: ${e["gitInv" + d]}; }
        .arrow${a} { stroke: ${e["git" + d]}; }
        `;
        }
      return n;
    } else if (mr.has(t)) {
      let n = "";
      for (let a = 0; a < e.THEME_COLOR_LIMIT; a++)
        if (a === 0)
          n += `
        .branch-label${a} { fill: ${e.nodeBorder}; ${c ? `font-weight:${e.noteFontWeight}` : ""} }
        .commit${a} { stroke: ${e.nodeBorder}; }
        .commit-highlight${a} { stroke: ${e.nodeBorder}; fill: ${e.mainBkg}; }
        .label${a}  { fill: ${e.mainBkg}; stroke: ${e.nodeBorder}; stroke-width: ${e.strokeWidth}; ${c ? `font-weight:${e.noteFontWeight}` : ""} }
        .arrow${a} { stroke: ${e.nodeBorder}; }
        .commit-bullets { fill: ${e.nodeBorder}; }
        `;
        else {
          const d = a % s.length;
          n += `
        .branch-label${a} { fill: ${e.nodeBorder}; ${c ? `font-weight:${e.noteFontWeight}` : ""} }
        .commit${a} { stroke: ${s[d]}; fill: ${s[d]}; }
        .commit-highlight${a} { stroke: ${s[d]}; fill: ${s[d]}; }
        .label${a}  { fill: ${br.has(t) ? e.mainBkg : s[d]}; stroke: ${s[d]};  stroke-width: ${e.strokeWidth}; }
        .arrow${a} { stroke: ${s[d]}; }
        `;
        }
      return n;
    } else {
      let n = "";
      for (let a = 0; a < e.THEME_COLOR_LIMIT; a++)
        n += `
        .branch-label${a} { fill: ${e.nodeBorder}; ${c ? `font-weight:${e.noteFontWeight}` : ""} }
        .commit${a} { stroke: ${e.nodeBorder};   }
        .commit-highlight${a} { stroke: ${e.nodeBorder}; fill: ${e.nodeBorder}; }
        .label${a}  { fill: ${e.mainBkg}; stroke: ${e.nodeBorder}; stroke-width: ${e.strokeWidth}; ${c ? `font-weight:${e.noteFontWeight}` : ""}}
        .arrow${a} { stroke: ${e.nodeBorder}; }
        .commit-bullets { fill: ${e.nodeBorder}; }
        .commit-cherry-pick${a} { stroke: ${e.nodeBorder}; }
        `;
      return n;
    }
  }, "genColor"),
  Er = $(
    (e) =>
      `${Array.from({ length: e.THEME_COLOR_LIMIT }, (r, t) => t).map((r) => {
        const t = r % de;
        return `
        .branch-label${r} { fill: ${e["gitBranchLabel" + t]}; }
        .commit${r} { stroke: ${e["git" + t]}; fill: ${e["git" + t]}; }
        .commit-highlight${r} { stroke: ${e["gitInv" + t]}; fill: ${e["gitInv" + t]}; }
        .label${r}  { fill: ${e["git" + t]}; }
        .arrow${r} { stroke: ${e["git" + t]}; }
        `;
      }).join(`
`)}`,
    "normalTheme",
  ),
  Br = $((e) => {
    var s;
    const r = Q(),
      { theme: t } = r,
      o = wr.has(t);
    return `
  .commit-id,
  .commit-msg,
  .branch-label {
    fill: lightgrey;
    color: lightgrey;
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);
  }
  
  ${o ? vr(e) : Er(e)}

  .branch {
    stroke-width: ${e.strokeWidth};
    stroke: ${(s = e.commitLineColor) != null ? s : e.lineColor};
    stroke-dasharray:  ${o ? "4 2" : "2"};
  }
  .commit-label { font-size: ${e.commitLabelFontSize}; fill: ${o ? e.nodeBorder : e.commitLabelColor}; ${o ? `font-weight:${e.noteFontWeight};` : ""}}
  .commit-label-bkg { font-size: ${e.commitLabelFontSize}; fill: ${o ? "transparent" : e.commitLabelBackground}; opacity: ${o ? "" : 0.5};  }
  .tag-label { font-size: ${e.tagLabelFontSize}; fill: ${e.tagLabelColor};}
  .tag-label-bkg { fill: ${o ? e.mainBkg : e.tagLabelBackground}; stroke: ${o ? e.nodeBorder : e.tagLabelBorder}; ${o ? `filter:${e.dropShadow}` : ""}  }
  .tag-hole { fill: ${e.textColor}; }

  .commit-merge {
    stroke: ${o ? e.mainBkg : e.primaryColor};
    fill: ${o ? e.mainBkg : e.primaryColor};
  }
  .commit-reverse {
    stroke: ${o ? e.mainBkg : e.primaryColor};
    fill: ${o ? e.mainBkg : e.primaryColor};
    stroke-width: ${o ? e.strokeWidth : 3};
  }
  .commit-highlight-outer {
  }
  .commit-highlight-inner {
    stroke: ${o ? e.mainBkg : e.primaryColor};
    fill: ${o ? e.mainBkg : e.primaryColor};
  }

  .arrow {
    /* Intentional: neo themes keep the bold 8px arrow (like classic themes); only redux-geometry themes use the thinner options.strokeWidth. */
    stroke-width: ${le.has(t) ? e.strokeWidth : 8};
    stroke-linecap: round;
    fill: none
  }
  .gitTitleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${e.textColor};
  }
`;
  }, "getStyles"),
  Cr = Br,
  Rr = { parser: Xe, db: oe, renderer: xr, styles: Cr };
export { Rr as diagram };
