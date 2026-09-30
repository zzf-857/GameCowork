import { p as Z } from "./chunk-ANTBXLJU-CTfKZ_Qj.js";
import { I as F } from "./chunk-FHKO5MBM-CV_6k-Kx.js";
import {
  _ as l,
  W as U,
  V as ee,
  t as re,
  v as te,
  w as ae,
  x as ne,
  B as w,
  y as se,
  z as oe,
  U as ce,
  a6 as ie,
  a0 as de,
  K as L,
  a7 as he,
  a8 as le,
  a9 as $e,
  aa as fe,
} from "./VscTheme-B-CSeuv5.js";
import { p as ye } from "./treemap-75Q7IDZK-B-05wwdi.js";
import "./registry-CHHSpXp3.js";
import "./_baseUniq-B4kfiVVD.js";
import "./_basePickBy-BL7sFKyx.js";
import "./clone-CIq-NCRc.js";
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
      (t._sentryDebugIds[e] = "1bdbc6ce-3af0-456f-9cae-15dcee6c0cab"),
      (t._sentryDebugIdIdentifier = "sentry-dbid-1bdbc6ce-3af0-456f-9cae-15dcee6c0cab"));
  })();
} catch {}
var p = { NORMAL: 0, REVERSE: 1, HIGHLIGHT: 2, MERGE: 3, CHERRY_PICK: 4 },
  ge = $e.gitGraph,
  z = l(() => he({ ...ge, ...le().gitGraph }), "getConfig"),
  i = new F(() => {
    const t = z(),
      e = t.mainBranchName,
      a = t.mainBranchOrder;
    return {
      mainBranchName: e,
      commits: new Map(),
      head: null,
      branchConfig: new Map([[e, { name: e, order: a }]]),
      branches: new Map([[e, null]]),
      currBranch: e,
      direction: "LR",
      seq: 0,
      options: {},
    };
  });
function D() {
  return fe({ length: 7 });
}
l(D, "getID");
function K(t, e) {
  const a = Object.create(null);
  return t.reduce((s, r) => {
    const n = e(r);
    return (a[n] || ((a[n] = !0), s.push(r)), s);
  }, []);
}
l(K, "uniqBy");
var ue = l(function (t) {
    i.records.direction = t;
  }, "setDirection"),
  pe = l(function (t) {
    (w.debug("options str", t), (t = t == null ? void 0 : t.trim()), (t = t || "{}"));
    try {
      i.records.options = JSON.parse(t);
    } catch (e) {
      w.error("error while parsing gitGraph options", e.message);
    }
  }, "setOptions"),
  xe = l(function () {
    return i.records.options;
  }, "getOptions"),
  be = l(function (t) {
    let e = t.msg,
      a = t.id;
    const s = t.type;
    let r = t.tags;
    (w.info("commit", e, a, s, r), w.debug("Entering commit:", e, a, s, r));
    const n = z();
    ((a = L.sanitizeText(a, n)),
      (e = L.sanitizeText(e, n)),
      (r = r == null ? void 0 : r.map((o) => L.sanitizeText(o, n))));
    const c = {
      id: a || i.records.seq + "-" + D(),
      message: e,
      seq: i.records.seq++,
      type: s != null ? s : p.NORMAL,
      tags: r != null ? r : [],
      parents: i.records.head == null ? [] : [i.records.head.id],
      branch: i.records.currBranch,
    };
    ((i.records.head = c),
      w.info("main branch", n.mainBranchName),
      i.records.commits.has(c.id) && w.warn(`Commit ID ${c.id} already exists`),
      i.records.commits.set(c.id, c),
      i.records.branches.set(i.records.currBranch, c.id),
      w.debug("in pushCommit " + c.id));
  }, "commit"),
  me = l(function (t) {
    let e = t.name;
    const a = t.order;
    if (((e = L.sanitizeText(e, z())), i.records.branches.has(e)))
      throw new Error(
        `Trying to create an existing branch. (Help: Either use a new name if you want create a new branch or try using "checkout ${e}")`,
      );
    (i.records.branches.set(e, i.records.head != null ? i.records.head.id : null),
      i.records.branchConfig.set(e, { name: e, order: a }),
      N(e),
      w.debug("in createBranch"));
  }, "branch"),
  we = l((t) => {
    let e = t.branch,
      a = t.id;
    const s = t.type,
      r = t.tags,
      n = z();
    ((e = L.sanitizeText(e, n)), a && (a = L.sanitizeText(a, n)));
    const c = i.records.branches.get(i.records.currBranch),
      o = i.records.branches.get(e),
      $ = c ? i.records.commits.get(c) : void 0,
      h = o ? i.records.commits.get(o) : void 0;
    if ($ && h && $.branch === e) throw new Error(`Cannot merge branch '${e}' into itself.`);
    if (i.records.currBranch === e) {
      const d = new Error('Incorrect usage of "merge". Cannot merge a branch to itself');
      throw ((d.hash = { text: `merge ${e}`, token: `merge ${e}`, expected: ["branch abc"] }), d);
    }
    if ($ === void 0 || !$) {
      const d = new Error(`Incorrect usage of "merge". Current branch (${i.records.currBranch})has no commits`);
      throw ((d.hash = { text: `merge ${e}`, token: `merge ${e}`, expected: ["commit"] }), d);
    }
    if (!i.records.branches.has(e)) {
      const d = new Error('Incorrect usage of "merge". Branch to be merged (' + e + ") does not exist");
      throw ((d.hash = { text: `merge ${e}`, token: `merge ${e}`, expected: [`branch ${e}`] }), d);
    }
    if (h === void 0 || !h) {
      const d = new Error('Incorrect usage of "merge". Branch to be merged (' + e + ") has no commits");
      throw ((d.hash = { text: `merge ${e}`, token: `merge ${e}`, expected: ['"commit"'] }), d);
    }
    if ($ === h) {
      const d = new Error('Incorrect usage of "merge". Both branches have same head');
      throw ((d.hash = { text: `merge ${e}`, token: `merge ${e}`, expected: ["branch abc"] }), d);
    }
    if (a && i.records.commits.has(a)) {
      const d = new Error(
        'Incorrect usage of "merge". Commit with id:' + a + " already exists, use different custom id",
      );
      throw (
        (d.hash = {
          text: `merge ${e} ${a} ${s} ${r == null ? void 0 : r.join(" ")}`,
          token: `merge ${e} ${a} ${s} ${r == null ? void 0 : r.join(" ")}`,
          expected: [`merge ${e} ${a}_UNIQUE ${s} ${r == null ? void 0 : r.join(" ")}`],
        }),
        d
      );
    }
    const f = o || "",
      u = {
        id: a || `${i.records.seq}-${D()}`,
        message: `merged branch ${e} into ${i.records.currBranch}`,
        seq: i.records.seq++,
        parents: i.records.head == null ? [] : [i.records.head.id, f],
        branch: i.records.currBranch,
        type: p.MERGE,
        customType: s,
        customId: !!a,
        tags: r != null ? r : [],
      };
    ((i.records.head = u),
      i.records.commits.set(u.id, u),
      i.records.branches.set(i.records.currBranch, u.id),
      w.debug(i.records.branches),
      w.debug("in mergeBranch"));
  }, "merge"),
  ve = l(function (t) {
    let e = t.id,
      a = t.targetId,
      s = t.tags,
      r = t.parent;
    w.debug("Entering cherryPick:", e, a, s);
    const n = z();
    if (
      ((e = L.sanitizeText(e, n)),
      (a = L.sanitizeText(a, n)),
      (s = s == null ? void 0 : s.map(($) => L.sanitizeText($, n))),
      (r = L.sanitizeText(r, n)),
      !e || !i.records.commits.has(e))
    ) {
      const $ = new Error('Incorrect usage of "cherryPick". Source commit id should exist and provided');
      throw (
        ($.hash = { text: `cherryPick ${e} ${a}`, token: `cherryPick ${e} ${a}`, expected: ["cherry-pick abc"] }),
        $
      );
    }
    const c = i.records.commits.get(e);
    if (c === void 0 || !c)
      throw new Error('Incorrect usage of "cherryPick". Source commit id should exist and provided');
    if (r && !(Array.isArray(c.parents) && c.parents.includes(r)))
      throw new Error(
        "Invalid operation: The specified parent commit is not an immediate parent of the cherry-picked commit.",
      );
    const o = c.branch;
    if (c.type === p.MERGE && !r)
      throw new Error(
        "Incorrect usage of cherry-pick: If the source commit is a merge commit, an immediate parent commit must be specified.",
      );
    if (!a || !i.records.commits.has(a)) {
      if (o === i.records.currBranch) {
        const u = new Error('Incorrect usage of "cherryPick". Source commit is already on current branch');
        throw (
          (u.hash = { text: `cherryPick ${e} ${a}`, token: `cherryPick ${e} ${a}`, expected: ["cherry-pick abc"] }),
          u
        );
      }
      const $ = i.records.branches.get(i.records.currBranch);
      if ($ === void 0 || !$) {
        const u = new Error(`Incorrect usage of "cherry-pick". Current branch (${i.records.currBranch})has no commits`);
        throw (
          (u.hash = { text: `cherryPick ${e} ${a}`, token: `cherryPick ${e} ${a}`, expected: ["cherry-pick abc"] }),
          u
        );
      }
      const h = i.records.commits.get($);
      if (h === void 0 || !h) {
        const u = new Error(`Incorrect usage of "cherry-pick". Current branch (${i.records.currBranch})has no commits`);
        throw (
          (u.hash = { text: `cherryPick ${e} ${a}`, token: `cherryPick ${e} ${a}`, expected: ["cherry-pick abc"] }),
          u
        );
      }
      const f = {
        id: i.records.seq + "-" + D(),
        message: `cherry-picked ${c == null ? void 0 : c.message} into ${i.records.currBranch}`,
        seq: i.records.seq++,
        parents: i.records.head == null ? [] : [i.records.head.id, c.id],
        branch: i.records.currBranch,
        type: p.CHERRY_PICK,
        tags: s ? s.filter(Boolean) : [`cherry-pick:${c.id}${c.type === p.MERGE ? `|parent:${r}` : ""}`],
      };
      ((i.records.head = f),
        i.records.commits.set(f.id, f),
        i.records.branches.set(i.records.currBranch, f.id),
        w.debug(i.records.branches),
        w.debug("in cherryPick"));
    }
  }, "cherryPick"),
  N = l(function (t) {
    var e;
    if (((t = L.sanitizeText(t, z())), i.records.branches.has(t))) {
      i.records.currBranch = t;
      const a = i.records.branches.get(i.records.currBranch);
      a === void 0 || !a
        ? (i.records.head = null)
        : (i.records.head = (e = i.records.commits.get(a)) != null ? e : null);
    } else {
      const a = new Error(`Trying to checkout branch which is not yet created. (Help try using "branch ${t}")`);
      throw ((a.hash = { text: `checkout ${t}`, token: `checkout ${t}`, expected: [`branch ${t}`] }), a);
    }
  }, "checkout");
function j(t, e, a) {
  const s = t.indexOf(e);
  s === -1 ? t.push(a) : t.splice(s, 1, a);
}
l(j, "upsert");
function A(t) {
  const e = t.reduce((r, n) => (r.seq > n.seq ? r : n), t[0]);
  let a = "";
  t.forEach(function (r) {
    r === e ? (a += "	*") : (a += "	|");
  });
  const s = [a, e.id, e.seq];
  for (const r in i.records.branches) i.records.branches.get(r) === e.id && s.push(r);
  if ((w.debug(s.join(" ")), e.parents && e.parents.length == 2 && e.parents[0] && e.parents[1])) {
    const r = i.records.commits.get(e.parents[0]);
    (j(t, e, r), e.parents[1] && t.push(i.records.commits.get(e.parents[1])));
  } else {
    if (e.parents.length == 0) return;
    if (e.parents[0]) {
      const r = i.records.commits.get(e.parents[0]);
      j(t, e, r);
    }
  }
  ((t = K(t, (r) => r.id)), A(t));
}
l(A, "prettyPrintCommitHistory");
var Ce = l(function () {
    w.debug(i.records.commits);
    const t = V()[0];
    A([t]);
  }, "prettyPrint"),
  Ee = l(function () {
    (i.reset(), de());
  }, "clear"),
  Be = l(function () {
    return [...i.records.branchConfig.values()]
      .map((e, a) => (e.order !== null && e.order !== void 0 ? e : { ...e, order: parseFloat(`0.${a}`) }))
      .sort((e, a) => {
        var s, r;
        return ((s = e.order) != null ? s : 0) - ((r = a.order) != null ? r : 0);
      })
      .map(({ name: e }) => ({ name: e }));
  }, "getBranchesAsObjArray"),
  ke = l(function () {
    return i.records.branches;
  }, "getBranches"),
  Le = l(function () {
    return i.records.commits;
  }, "getCommits"),
  V = l(function () {
    const t = [...i.records.commits.values()];
    return (
      t.forEach(function (e) {
        w.debug(e.id);
      }),
      t.sort((e, a) => e.seq - a.seq),
      t
    );
  }, "getCommitsArray"),
  Te = l(function () {
    return i.records.currBranch;
  }, "getCurrentBranch"),
  Me = l(function () {
    return i.records.direction;
  }, "getDirection"),
  Re = l(function () {
    return i.records.head;
  }, "getHead"),
  X = {
    commitType: p,
    getConfig: z,
    setDirection: ue,
    setOptions: pe,
    getOptions: xe,
    commit: be,
    branch: me,
    merge: we,
    cherryPick: ve,
    checkout: N,
    prettyPrint: Ce,
    clear: Ee,
    getBranchesAsObjArray: Be,
    getBranches: ke,
    getCommits: Le,
    getCommitsArray: V,
    getCurrentBranch: Te,
    getDirection: Me,
    getHead: Re,
    setAccTitle: ne,
    getAccTitle: ae,
    getAccDescription: te,
    setAccDescription: re,
    setDiagramTitle: ee,
    getDiagramTitle: U,
  },
  Ie = l((t, e) => {
    (Z(t, e), t.dir && e.setDirection(t.dir));
    for (const a of t.statements) qe(a, e);
  }, "populate"),
  qe = l((t, e) => {
    const s = {
      Commit: l((r) => e.commit(Oe(r)), "Commit"),
      Branch: l((r) => e.branch(ze(r)), "Branch"),
      Merge: l((r) => e.merge(Ge(r)), "Merge"),
      Checkout: l((r) => e.checkout(He(r)), "Checkout"),
      CherryPicking: l((r) => e.cherryPick(Pe(r)), "CherryPicking"),
    }[t.$type];
    s ? s(t) : w.error(`Unknown statement type: ${t.$type}`);
  }, "parseStatement"),
  Oe = l((t) => {
    var a, s;
    return {
      id: t.id,
      msg: (a = t.message) != null ? a : "",
      type: t.type !== void 0 ? p[t.type] : p.NORMAL,
      tags: (s = t.tags) != null ? s : void 0,
    };
  }, "parseCommit"),
  ze = l((t) => {
    var a;
    return { name: t.name, order: (a = t.order) != null ? a : 0 };
  }, "parseBranch"),
  Ge = l((t) => {
    var a, s;
    return {
      branch: t.branch,
      id: (a = t.id) != null ? a : "",
      type: t.type !== void 0 ? p[t.type] : void 0,
      tags: (s = t.tags) != null ? s : void 0,
    };
  }, "parseMerge"),
  He = l((t) => t.branch, "parseCheckout"),
  Pe = l((t) => {
    var a;
    return {
      id: t.id,
      targetId: "",
      tags: ((a = t.tags) == null ? void 0 : a.length) === 0 ? void 0 : t.tags,
      parent: t.parent,
    };
  }, "parseCherryPicking"),
  Se = {
    parse: l(async (t) => {
      const e = await ye("gitGraph", t);
      (w.debug(e), Ie(e, X));
    }, "parse"),
  },
  _ = se(),
  m = _ == null ? void 0 : _.gitGraph,
  I = 10,
  q = 40,
  T = 4,
  M = 2,
  O = 8,
  C = new Map(),
  E = new Map(),
  S = 30,
  H = new Map(),
  W = [],
  R = 0,
  g = "LR",
  We = l(() => {
    (C.clear(), E.clear(), H.clear(), (R = 0), (W = []), (g = "LR"));
  }, "clear"),
  J = l((t) => {
    const e = document.createElementNS("http://www.w3.org/2000/svg", "text");
    return (
      (typeof t == "string" ? t.split(/\\n|\n|<br\s*\/?>/gi) : t).forEach((s) => {
        const r = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        (r.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve"),
          r.setAttribute("dy", "1em"),
          r.setAttribute("x", "0"),
          r.setAttribute("class", "row"),
          (r.textContent = s.trim()),
          e.appendChild(r));
      }),
      e
    );
  }, "drawText"),
  Q = l((t) => {
    let e, a, s;
    return (
      g === "BT"
        ? ((a = l((r, n) => r <= n, "comparisonFunc")), (s = 1 / 0))
        : ((a = l((r, n) => r >= n, "comparisonFunc")), (s = 0)),
      t.forEach((r) => {
        var c, o;
        const n =
          g === "TB" || g == "BT" ? ((c = E.get(r)) == null ? void 0 : c.y) : (o = E.get(r)) == null ? void 0 : o.x;
        n !== void 0 && a(n, s) && ((e = r), (s = n));
      }),
      e
    );
  }, "findClosestParent"),
  De = l((t) => {
    let e = "",
      a = 1 / 0;
    return (
      t.forEach((s) => {
        const r = E.get(s).y;
        r <= a && ((e = s), (a = r));
      }),
      e || void 0
    );
  }, "findClosestParentBT"),
  _e = l((t, e, a) => {
    let s = a,
      r = a;
    const n = [];
    (t.forEach((c) => {
      const o = e.get(c);
      if (!o) throw new Error(`Commit not found for key ${c}`);
      (o.parents.length ? ((s = Ae(o)), (r = Math.max(s, r))) : n.push(o), Ye(o, s));
    }),
      (s = r),
      n.forEach((c) => {
        Ke(c, s, a);
      }),
      t.forEach((c) => {
        const o = e.get(c);
        if (o != null && o.parents.length) {
          const $ = De(o.parents);
          ((s = E.get($).y - q), s <= r && (r = s));
          const h = C.get(o.branch).pos,
            f = s - I;
          E.set(o.id, { x: h, y: f });
        }
      }));
  }, "setParallelBTPos"),
  je = l((t) => {
    var s;
    const e = Q(t.parents.filter((r) => r !== null));
    if (!e) throw new Error(`Closest parent not found for commit ${t.id}`);
    const a = (s = E.get(e)) == null ? void 0 : s.y;
    if (a === void 0) throw new Error(`Closest parent position not found for commit ${t.id}`);
    return a;
  }, "findClosestParentPos"),
  Ae = l((t) => je(t) + q, "calculateCommitPosition"),
  Ye = l((t, e) => {
    const a = C.get(t.branch);
    if (!a) throw new Error(`Branch not found for commit ${t.id}`);
    const s = a.pos,
      r = e + I;
    return (E.set(t.id, { x: s, y: r }), { x: s, y: r });
  }, "setCommitPosition"),
  Ke = l((t, e, a) => {
    const s = C.get(t.branch);
    if (!s) throw new Error(`Branch not found for commit ${t.id}`);
    const r = e + a,
      n = s.pos;
    E.set(t.id, { x: n, y: r });
  }, "setRootPosition"),
  Ne = l((t, e, a, s, r, n) => {
    if (n === p.HIGHLIGHT)
      (t
        .append("rect")
        .attr("x", a.x - 10)
        .attr("y", a.y - 10)
        .attr("width", 20)
        .attr("height", 20)
        .attr("class", `commit ${e.id} commit-highlight${r % O} ${s}-outer`),
        t
          .append("rect")
          .attr("x", a.x - 6)
          .attr("y", a.y - 6)
          .attr("width", 12)
          .attr("height", 12)
          .attr("class", `commit ${e.id} commit${r % O} ${s}-inner`));
    else if (n === p.CHERRY_PICK)
      (t.append("circle").attr("cx", a.x).attr("cy", a.y).attr("r", 10).attr("class", `commit ${e.id} ${s}`),
        t
          .append("circle")
          .attr("cx", a.x - 3)
          .attr("cy", a.y + 2)
          .attr("r", 2.75)
          .attr("fill", "#fff")
          .attr("class", `commit ${e.id} ${s}`),
        t
          .append("circle")
          .attr("cx", a.x + 3)
          .attr("cy", a.y + 2)
          .attr("r", 2.75)
          .attr("fill", "#fff")
          .attr("class", `commit ${e.id} ${s}`),
        t
          .append("line")
          .attr("x1", a.x + 3)
          .attr("y1", a.y + 1)
          .attr("x2", a.x)
          .attr("y2", a.y - 5)
          .attr("stroke", "#fff")
          .attr("class", `commit ${e.id} ${s}`),
        t
          .append("line")
          .attr("x1", a.x - 3)
          .attr("y1", a.y + 1)
          .attr("x2", a.x)
          .attr("y2", a.y - 5)
          .attr("stroke", "#fff")
          .attr("class", `commit ${e.id} ${s}`));
    else {
      const c = t.append("circle");
      if (
        (c.attr("cx", a.x),
        c.attr("cy", a.y),
        c.attr("r", e.type === p.MERGE ? 9 : 10),
        c.attr("class", `commit ${e.id} commit${r % O}`),
        n === p.MERGE)
      ) {
        const o = t.append("circle");
        (o.attr("cx", a.x), o.attr("cy", a.y), o.attr("r", 6), o.attr("class", `commit ${s} ${e.id} commit${r % O}`));
      }
      n === p.REVERSE &&
        t
          .append("path")
          .attr("d", `M ${a.x - 5},${a.y - 5}L${a.x + 5},${a.y + 5}M${a.x - 5},${a.y + 5}L${a.x + 5},${a.y - 5}`)
          .attr("class", `commit ${s} ${e.id} commit${r % O}`);
    }
  }, "drawCommitBullet"),
  Ve = l((t, e, a, s) => {
    var r;
    if (
      e.type !== p.CHERRY_PICK &&
      ((e.customId && e.type === p.MERGE) || e.type !== p.MERGE) &&
      m != null &&
      m.showCommitLabel
    ) {
      const n = t.append("g"),
        c = n.insert("rect").attr("class", "commit-label-bkg"),
        o = n
          .append("text")
          .attr("x", s)
          .attr("y", a.y + 25)
          .attr("class", "commit-label")
          .text(e.id),
        $ = (r = o.node()) == null ? void 0 : r.getBBox();
      if (
        $ &&
        (c
          .attr("x", a.posWithOffset - $.width / 2 - M)
          .attr("y", a.y + 13.5)
          .attr("width", $.width + 2 * M)
          .attr("height", $.height + 2 * M),
        g === "TB" || g === "BT"
          ? (c.attr("x", a.x - ($.width + 4 * T + 5)).attr("y", a.y - 12),
            o.attr("x", a.x - ($.width + 4 * T)).attr("y", a.y + $.height - 12))
          : o.attr("x", a.posWithOffset - $.width / 2),
        m.rotateCommitLabel)
      )
        if (g === "TB" || g === "BT")
          (o.attr("transform", "rotate(-45, " + a.x + ", " + a.y + ")"),
            c.attr("transform", "rotate(-45, " + a.x + ", " + a.y + ")"));
        else {
          const h = -7.5 - (($.width + 10) / 25) * 9.5,
            f = 10 + ($.width / 25) * 8.5;
          n.attr("transform", "translate(" + h + ", " + f + ") rotate(-45, " + s + ", " + a.y + ")");
        }
    }
  }, "drawCommitLabel"),
  Xe = l((t, e, a, s) => {
    var r;
    if (e.tags.length > 0) {
      let n = 0,
        c = 0,
        o = 0;
      const $ = [];
      for (const h of e.tags.reverse()) {
        const f = t.insert("polygon"),
          u = t.append("circle"),
          d = t
            .append("text")
            .attr("y", a.y - 16 - n)
            .attr("class", "tag-label")
            .text(h),
          y = (r = d.node()) == null ? void 0 : r.getBBox();
        if (!y) throw new Error("Tag bbox not found");
        ((c = Math.max(c, y.width)),
          (o = Math.max(o, y.height)),
          d.attr("x", a.posWithOffset - y.width / 2),
          $.push({ tag: d, hole: u, rect: f, yOffset: n }),
          (n += 20));
      }
      for (const { tag: h, hole: f, rect: u, yOffset: d } of $) {
        const y = o / 2,
          x = a.y - 19.2 - d;
        if (
          (u.attr("class", "tag-label-bkg").attr(
            "points",
            `
      ${s - c / 2 - T / 2},${x + M}  
      ${s - c / 2 - T / 2},${x - M}
      ${a.posWithOffset - c / 2 - T},${x - y - M}
      ${a.posWithOffset + c / 2 + T},${x - y - M}
      ${a.posWithOffset + c / 2 + T},${x + y + M}
      ${a.posWithOffset - c / 2 - T},${x + y + M}`,
          ),
          f
            .attr("cy", x)
            .attr("cx", s - c / 2 + T / 2)
            .attr("r", 1.5)
            .attr("class", "tag-hole"),
          g === "TB" || g === "BT")
        ) {
          const b = s + d;
          (u
            .attr("class", "tag-label-bkg")
            .attr(
              "points",
              `
        ${a.x},${b + 2}
        ${a.x},${b - 2}
        ${a.x + I},${b - y - 2}
        ${a.x + I + c + 4},${b - y - 2}
        ${a.x + I + c + 4},${b + y + 2}
        ${a.x + I},${b + y + 2}`,
            )
            .attr("transform", "translate(12,12) rotate(45, " + a.x + "," + s + ")"),
            f
              .attr("cx", a.x + T / 2)
              .attr("cy", b)
              .attr("transform", "translate(12,12) rotate(45, " + a.x + "," + s + ")"),
            h
              .attr("x", a.x + 5)
              .attr("y", b + 3)
              .attr("transform", "translate(14,14) rotate(45, " + a.x + "," + s + ")"));
        }
      }
    }
  }, "drawCommitTags"),
  Je = l((t) => {
    var a;
    switch ((a = t.customType) != null ? a : t.type) {
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
  Qe = l((t, e, a, s) => {
    var n, c, o;
    const r = { x: 0, y: 0 };
    if (t.parents.length > 0) {
      const $ = Q(t.parents);
      if ($) {
        const h = (n = s.get($)) != null ? n : r;
        return e === "TB" ? h.y + q : e === "BT" ? ((c = s.get(t.id)) != null ? c : r).y - q : h.x + q;
      }
    } else return e === "TB" ? S : e === "BT" ? ((o = s.get(t.id)) != null ? o : r).y - q : 0;
    return 0;
  }, "calculatePosition"),
  Ze = l((t, e, a) => {
    var c, o;
    const s = g === "BT" && a ? e : e + I,
      r = g === "TB" || g === "BT" ? s : (c = C.get(t.branch)) == null ? void 0 : c.pos,
      n = g === "TB" || g === "BT" ? ((o = C.get(t.branch)) == null ? void 0 : o.pos) : s;
    if (n === void 0 || r === void 0) throw new Error(`Position were undefined for commit ${t.id}`);
    return { x: n, y: r, posWithOffset: s };
  }, "getCommitPosition"),
  Y = l((t, e, a) => {
    var f;
    if (!m) throw new Error("GitGraph config not found");
    const s = t.append("g").attr("class", "commit-bullets"),
      r = t.append("g").attr("class", "commit-labels");
    let n = g === "TB" || g === "BT" ? S : 0;
    const c = [...e.keys()],
      o = (f = m == null ? void 0 : m.parallelCommits) != null ? f : !1,
      $ = l((u, d) => {
        var b, k;
        const y = (b = e.get(u)) == null ? void 0 : b.seq,
          x = (k = e.get(d)) == null ? void 0 : k.seq;
        return y !== void 0 && x !== void 0 ? y - x : 0;
      }, "sortKeys");
    let h = c.sort($);
    (g === "BT" && (o && _e(h, e, n), (h = h.reverse())),
      h.forEach((u) => {
        var x, b, k;
        const d = e.get(u);
        if (!d) throw new Error(`Commit not found for key ${u}`);
        o && (n = Qe(d, g, n, E));
        const y = Ze(d, n, o);
        if (a) {
          const G = Je(d),
            B = (x = d.customType) != null ? x : d.type,
            v = (k = (b = C.get(d.branch)) == null ? void 0 : b.index) != null ? k : 0;
          (Ne(s, d, y, G, v, B), Ve(r, d, y, n), Xe(r, d, y, n));
        }
        (g === "TB" || g === "BT"
          ? E.set(d.id, { x: y.x, y: y.posWithOffset })
          : E.set(d.id, { x: y.posWithOffset, y: y.y }),
          (n = g === "BT" && o ? n + q : n + q + I),
          n > R && (R = n));
      }));
  }, "drawCommits"),
  Fe = l((t, e, a, s, r) => {
    const c = (g === "TB" || g === "BT" ? a.x < s.x : a.y < s.y) ? e.branch : t.branch,
      o = l((h) => h.branch === c, "isOnBranchToGetCurve"),
      $ = l((h) => h.seq > t.seq && h.seq < e.seq, "isBetweenCommits");
    return [...r.values()].some((h) => $(h) && o(h));
  }, "shouldRerouteArrow"),
  P = l((t, e, a = 0) => {
    const s = t + Math.abs(t - e) / 2;
    if (a > 5) return s;
    if (W.every((c) => Math.abs(c - s) >= 10)) return (W.push(s), s);
    const n = Math.abs(t - e);
    return P(t, e - n / 5, a + 1);
  }, "findLane"),
  Ue = l((t, e, a, s) => {
    var y, x, b, k, G;
    const r = E.get(e.id),
      n = E.get(a.id);
    if (r === void 0 || n === void 0) throw new Error(`Commit positions not found for commits ${e.id} and ${a.id}`);
    const c = Fe(e, a, r, n, s);
    let o = "",
      $ = "",
      h = 0,
      f = 0,
      u = (y = C.get(a.branch)) == null ? void 0 : y.index;
    a.type === p.MERGE && e.id !== a.parents[0] && (u = (x = C.get(e.branch)) == null ? void 0 : x.index);
    let d;
    if (c) {
      ((o = "A 10 10, 0, 0, 0,"), ($ = "A 10 10, 0, 0, 1,"), (h = 10), (f = 10));
      const B = r.y < n.y ? P(r.y, n.y) : P(n.y, r.y),
        v = r.x < n.x ? P(r.x, n.x) : P(n.x, r.x);
      g === "TB"
        ? r.x < n.x
          ? (d = `M ${r.x} ${r.y} L ${v - h} ${r.y} ${$} ${v} ${r.y + f} L ${v} ${n.y - h} ${o} ${v + f} ${n.y} L ${n.x} ${n.y}`)
          : ((u = (b = C.get(e.branch)) == null ? void 0 : b.index),
            (d = `M ${r.x} ${r.y} L ${v + h} ${r.y} ${o} ${v} ${r.y + f} L ${v} ${n.y - h} ${$} ${v - f} ${n.y} L ${n.x} ${n.y}`))
        : g === "BT"
          ? r.x < n.x
            ? (d = `M ${r.x} ${r.y} L ${v - h} ${r.y} ${o} ${v} ${r.y - f} L ${v} ${n.y + h} ${$} ${v + f} ${n.y} L ${n.x} ${n.y}`)
            : ((u = (k = C.get(e.branch)) == null ? void 0 : k.index),
              (d = `M ${r.x} ${r.y} L ${v + h} ${r.y} ${$} ${v} ${r.y - f} L ${v} ${n.y + h} ${o} ${v - f} ${n.y} L ${n.x} ${n.y}`))
          : r.y < n.y
            ? (d = `M ${r.x} ${r.y} L ${r.x} ${B - h} ${o} ${r.x + f} ${B} L ${n.x - h} ${B} ${$} ${n.x} ${B + f} L ${n.x} ${n.y}`)
            : ((u = (G = C.get(e.branch)) == null ? void 0 : G.index),
              (d = `M ${r.x} ${r.y} L ${r.x} ${B + h} ${$} ${r.x + f} ${B} L ${n.x - h} ${B} ${o} ${n.x} ${B - f} L ${n.x} ${n.y}`));
    } else
      ((o = "A 20 20, 0, 0, 0,"),
        ($ = "A 20 20, 0, 0, 1,"),
        (h = 20),
        (f = 20),
        g === "TB"
          ? (r.x < n.x &&
              (a.type === p.MERGE && e.id !== a.parents[0]
                ? (d = `M ${r.x} ${r.y} L ${r.x} ${n.y - h} ${o} ${r.x + f} ${n.y} L ${n.x} ${n.y}`)
                : (d = `M ${r.x} ${r.y} L ${n.x - h} ${r.y} ${$} ${n.x} ${r.y + f} L ${n.x} ${n.y}`)),
            r.x > n.x &&
              ((o = "A 20 20, 0, 0, 0,"),
              ($ = "A 20 20, 0, 0, 1,"),
              (h = 20),
              (f = 20),
              a.type === p.MERGE && e.id !== a.parents[0]
                ? (d = `M ${r.x} ${r.y} L ${r.x} ${n.y - h} ${$} ${r.x - f} ${n.y} L ${n.x} ${n.y}`)
                : (d = `M ${r.x} ${r.y} L ${n.x + h} ${r.y} ${o} ${n.x} ${r.y + f} L ${n.x} ${n.y}`)),
            r.x === n.x && (d = `M ${r.x} ${r.y} L ${n.x} ${n.y}`))
          : g === "BT"
            ? (r.x < n.x &&
                (a.type === p.MERGE && e.id !== a.parents[0]
                  ? (d = `M ${r.x} ${r.y} L ${r.x} ${n.y + h} ${$} ${r.x + f} ${n.y} L ${n.x} ${n.y}`)
                  : (d = `M ${r.x} ${r.y} L ${n.x - h} ${r.y} ${o} ${n.x} ${r.y - f} L ${n.x} ${n.y}`)),
              r.x > n.x &&
                ((o = "A 20 20, 0, 0, 0,"),
                ($ = "A 20 20, 0, 0, 1,"),
                (h = 20),
                (f = 20),
                a.type === p.MERGE && e.id !== a.parents[0]
                  ? (d = `M ${r.x} ${r.y} L ${r.x} ${n.y + h} ${o} ${r.x - f} ${n.y} L ${n.x} ${n.y}`)
                  : (d = `M ${r.x} ${r.y} L ${n.x - h} ${r.y} ${o} ${n.x} ${r.y - f} L ${n.x} ${n.y}`)),
              r.x === n.x && (d = `M ${r.x} ${r.y} L ${n.x} ${n.y}`))
            : (r.y < n.y &&
                (a.type === p.MERGE && e.id !== a.parents[0]
                  ? (d = `M ${r.x} ${r.y} L ${n.x - h} ${r.y} ${$} ${n.x} ${r.y + f} L ${n.x} ${n.y}`)
                  : (d = `M ${r.x} ${r.y} L ${r.x} ${n.y - h} ${o} ${r.x + f} ${n.y} L ${n.x} ${n.y}`)),
              r.y > n.y &&
                (a.type === p.MERGE && e.id !== a.parents[0]
                  ? (d = `M ${r.x} ${r.y} L ${n.x - h} ${r.y} ${o} ${n.x} ${r.y - f} L ${n.x} ${n.y}`)
                  : (d = `M ${r.x} ${r.y} L ${r.x} ${n.y + h} ${$} ${r.x + f} ${n.y} L ${n.x} ${n.y}`)),
              r.y === n.y && (d = `M ${r.x} ${r.y} L ${n.x} ${n.y}`)));
    if (d === void 0) throw new Error("Line definition not found");
    t.append("path")
      .attr("d", d)
      .attr("class", "arrow arrow" + (u % O));
  }, "drawArrow"),
  er = l((t, e) => {
    const a = t.append("g").attr("class", "commit-arrows");
    [...e.keys()].forEach((s) => {
      const r = e.get(s);
      r.parents &&
        r.parents.length > 0 &&
        r.parents.forEach((n) => {
          Ue(a, e.get(n), r, e);
        });
    });
  }, "drawArrows"),
  rr = l((t, e) => {
    const a = t.append("g");
    e.forEach((s, r) => {
      var x;
      const n = r % O,
        c = (x = C.get(s.name)) == null ? void 0 : x.pos;
      if (c === void 0) throw new Error(`Position not found for branch ${s.name}`);
      const o = a.append("line");
      (o.attr("x1", 0),
        o.attr("y1", c),
        o.attr("x2", R),
        o.attr("y2", c),
        o.attr("class", "branch branch" + n),
        g === "TB"
          ? (o.attr("y1", S), o.attr("x1", c), o.attr("y2", R), o.attr("x2", c))
          : g === "BT" && (o.attr("y1", R), o.attr("x1", c), o.attr("y2", S), o.attr("x2", c)),
        W.push(c));
      const $ = s.name,
        h = J($),
        f = a.insert("rect"),
        d = a
          .insert("g")
          .attr("class", "branchLabel")
          .insert("g")
          .attr("class", "label branch-label" + n);
      d.node().appendChild(h);
      const y = h.getBBox();
      (f
        .attr("class", "branchLabelBkg label" + n)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("x", -y.width - 4 - ((m == null ? void 0 : m.rotateCommitLabel) === !0 ? 30 : 0))
        .attr("y", -y.height / 2 + 8)
        .attr("width", y.width + 18)
        .attr("height", y.height + 4),
        d.attr(
          "transform",
          "translate(" +
            (-y.width - 14 - ((m == null ? void 0 : m.rotateCommitLabel) === !0 ? 30 : 0)) +
            ", " +
            (c - y.height / 2 - 1) +
            ")",
        ),
        g === "TB"
          ? (f.attr("x", c - y.width / 2 - 10).attr("y", 0),
            d.attr("transform", "translate(" + (c - y.width / 2 - 5) + ", 0)"))
          : g === "BT"
            ? (f.attr("x", c - y.width / 2 - 10).attr("y", R),
              d.attr("transform", "translate(" + (c - y.width / 2 - 5) + ", " + R + ")"))
            : f.attr("transform", "translate(-19, " + (c - y.height / 2) + ")"));
    });
  }, "drawBranches"),
  tr = l(function (t, e, a, s, r) {
    return (C.set(t, { pos: e, index: a }), (e += 50 + (r ? 40 : 0) + (g === "TB" || g === "BT" ? s.width / 2 : 0)), e);
  }, "setBranchPosition"),
  ar = l(function (t, e, a, s) {
    var h, f;
    if (
      (We(),
      w.debug(
        "in gitgraph renderer",
        t +
          `
`,
        "id:",
        e,
        a,
      ),
      !m)
    )
      throw new Error("GitGraph config not found");
    const r = (h = m.rotateCommitLabel) != null ? h : !1,
      n = s.db;
    H = n.getCommits();
    const c = n.getBranchesAsObjArray();
    g = n.getDirection();
    const o = oe(`[id="${e}"]`);
    let $ = 0;
    (c.forEach((u, d) => {
      var B;
      const y = J(u.name),
        x = o.append("g"),
        b = x.insert("g").attr("class", "branchLabel"),
        k = b.insert("g").attr("class", "label branch-label");
      (B = k.node()) == null || B.appendChild(y);
      const G = y.getBBox();
      (($ = tr(u.name, $, d, G, r)), k.remove(), b.remove(), x.remove());
    }),
      Y(o, H, !1),
      m.showBranches && rr(o, c),
      er(o, H),
      Y(o, H, !0),
      ce.insertTitle(o, "gitTitleText", (f = m.titleTopMargin) != null ? f : 0, n.getDiagramTitle()),
      ie(void 0, o, m.diagramPadding, m.useMaxWidth));
  }, "draw"),
  nr = { draw: ar },
  sr = l(
    (t) => `
  .commit-id,
  .commit-msg,
  .branch-label {
    fill: lightgrey;
    color: lightgrey;
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);
  }
  ${[0, 1, 2, 3, 4, 5, 6, 7].map(
    (e) => `
        .branch-label${e} { fill: ${t["gitBranchLabel" + e]}; }
        .commit${e} { stroke: ${t["git" + e]}; fill: ${t["git" + e]}; }
        .commit-highlight${e} { stroke: ${t["gitInv" + e]}; fill: ${t["gitInv" + e]}; }
        .label${e}  { fill: ${t["git" + e]}; }
        .arrow${e} { stroke: ${t["git" + e]}; }
        `,
  ).join(`
`)}

  .branch {
    stroke-width: 1;
    stroke: ${t.lineColor};
    stroke-dasharray: 2;
  }
  .commit-label { font-size: ${t.commitLabelFontSize}; fill: ${t.commitLabelColor};}
  .commit-label-bkg { font-size: ${t.commitLabelFontSize}; fill: ${t.commitLabelBackground}; opacity: 0.5; }
  .tag-label { font-size: ${t.tagLabelFontSize}; fill: ${t.tagLabelColor};}
  .tag-label-bkg { fill: ${t.tagLabelBackground}; stroke: ${t.tagLabelBorder}; }
  .tag-hole { fill: ${t.textColor}; }

  .commit-merge {
    stroke: ${t.primaryColor};
    fill: ${t.primaryColor};
  }
  .commit-reverse {
    stroke: ${t.primaryColor};
    fill: ${t.primaryColor};
    stroke-width: 3;
  }
  .commit-highlight-outer {
  }
  .commit-highlight-inner {
    stroke: ${t.primaryColor};
    fill: ${t.primaryColor};
  }

  .arrow { stroke-width: 8; stroke-linecap: round; fill: none}
  .gitTitleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.textColor};
  }
`,
    "getStyles",
  ),
  or = sr,
  gr = { parser: Se, db: X, renderer: nr, styles: or };
export { gr as diagram };
