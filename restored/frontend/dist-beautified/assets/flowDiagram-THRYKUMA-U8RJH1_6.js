import { g as H1 } from "./chunk-GLLZNHP4-CFc8j2Qt.js";
import {
  _ as S,
  O as O1,
  B as et,
  y as kt,
  z as Dt,
  Q as q1,
  R as X1,
  U as i1,
  x as Q1,
  t as Z1,
  V as J1,
  w as $1,
  v as te,
  W as ee,
  K as se,
  X as ie,
  Y as re,
  Z as ne,
  $ as s1,
  a0 as ae,
  a1 as ue,
  a2 as oe,
} from "./VscTheme-BExNMG_K.js";
import { g as le } from "./chunk-WVR4S24B-e1hq11hy.js";
import { s as ce } from "./chunk-NRVI72HA-Dc8s2S3s.js";
import { c as he } from "./channel-CuOp09P9.js";
import "./registry-BL-NPVNy.js";
(function () {
  var s =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  s.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
})();
try {
  (function () {
    var s =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      i = new s.Error().stack;
    i &&
      ((s._sentryDebugIds = s._sentryDebugIds || {}),
      (s._sentryDebugIds[i] = "273d810e-6fba-4667-84d4-244c66b96b8e"),
      (s._sentryDebugIdIdentifier = "sentry-dbid-273d810e-6fba-4667-84d4-244c66b96b8e"));
  })();
} catch {}
var de = "flowchart-",
  Ot,
  pe =
    ((Ot = class {
      constructor() {
        ((this.vertexCounter = 0),
          (this.config = kt()),
          (this.vertices = new Map()),
          (this.edges = []),
          (this.classes = new Map()),
          (this.subGraphs = []),
          (this.subGraphLookup = new Map()),
          (this.tooltips = new Map()),
          (this.subCount = 0),
          (this.firstGraphFlag = !0),
          (this.secCount = -1),
          (this.posCrossRef = []),
          (this.funs = []),
          (this.setAccTitle = Q1),
          (this.setAccDescription = Z1),
          (this.setDiagramTitle = J1),
          (this.getAccTitle = $1),
          (this.getAccDescription = te),
          (this.getDiagramTitle = ee),
          this.funs.push(this.setupToolTips.bind(this)),
          (this.addVertex = this.addVertex.bind(this)),
          (this.firstGraph = this.firstGraph.bind(this)),
          (this.setDirection = this.setDirection.bind(this)),
          (this.addSubGraph = this.addSubGraph.bind(this)),
          (this.addLink = this.addLink.bind(this)),
          (this.setLink = this.setLink.bind(this)),
          (this.updateLink = this.updateLink.bind(this)),
          (this.addClass = this.addClass.bind(this)),
          (this.setClass = this.setClass.bind(this)),
          (this.destructLink = this.destructLink.bind(this)),
          (this.setClickEvent = this.setClickEvent.bind(this)),
          (this.setTooltip = this.setTooltip.bind(this)),
          (this.updateLinkInterpolate = this.updateLinkInterpolate.bind(this)),
          (this.setClickFun = this.setClickFun.bind(this)),
          (this.bindFunctions = this.bindFunctions.bind(this)),
          (this.lex = { firstGraph: this.firstGraph.bind(this) }),
          this.clear(),
          this.setGen("gen-2"));
      }
      sanitizeText(i) {
        return se.sanitizeText(i, this.config);
      }
      lookUpDomId(i) {
        for (const n of this.vertices.values()) if (n.id === i) return n.domId;
        return i;
      }
      addVertex(i, n, a, u, o, p, c = {}, b) {
        var U, x;
        if (!i || i.trim().length === 0) return;
        let r;
        if (b !== void 0) {
          let h;
          (b.includes(`
`)
            ? (h =
                b +
                `
`)
            : (h =
                `{
` +
                b +
                `
}`),
            (r = ie(h, { schema: re })));
        }
        const k = this.edges.find((h) => h.id === i);
        if (k) {
          const h = r;
          ((h == null ? void 0 : h.animate) !== void 0 && (k.animate = h.animate),
            (h == null ? void 0 : h.animation) !== void 0 && (k.animation = h.animation),
            (h == null ? void 0 : h.curve) !== void 0 && (k.interpolate = h.curve));
          return;
        }
        let m,
          A = this.vertices.get(i);
        if (
          (A === void 0 &&
            ((A = { id: i, labelType: "text", domId: de + i + "-" + this.vertexCounter, styles: [], classes: [] }),
            this.vertices.set(i, A)),
          this.vertexCounter++,
          n !== void 0
            ? ((this.config = kt()),
              (m = this.sanitizeText(n.text.trim())),
              (A.labelType = n.type),
              m.startsWith('"') && m.endsWith('"') && (m = m.substring(1, m.length - 1)),
              (A.text = m))
            : A.text === void 0 && (A.text = i),
          a !== void 0 && (A.type = a),
          u != null &&
            u.forEach((h) => {
              A.styles.push(h);
            }),
          o != null &&
            o.forEach((h) => {
              A.classes.push(h);
            }),
          p !== void 0 && (A.dir = p),
          A.props === void 0 ? (A.props = c) : c !== void 0 && Object.assign(A.props, c),
          r !== void 0)
        ) {
          if (r.shape) {
            if (r.shape !== r.shape.toLowerCase() || r.shape.includes("_"))
              throw new Error(`No such shape: ${r.shape}. Shape names should be lowercase.`);
            if (!ne(r.shape)) throw new Error(`No such shape: ${r.shape}.`);
            A.type = r == null ? void 0 : r.shape;
          }
          (r != null && r.label && (A.text = r == null ? void 0 : r.label),
            r != null &&
              r.icon &&
              ((A.icon = r == null ? void 0 : r.icon),
              !((U = r.label) != null && U.trim()) && A.text === i && (A.text = "")),
            r != null && r.form && (A.form = r == null ? void 0 : r.form),
            r != null && r.pos && (A.pos = r == null ? void 0 : r.pos),
            r != null &&
              r.img &&
              ((A.img = r == null ? void 0 : r.img),
              !((x = r.label) != null && x.trim()) && A.text === i && (A.text = "")),
            r != null && r.constraint && (A.constraint = r.constraint),
            r.w && (A.assetWidth = Number(r.w)),
            r.h && (A.assetHeight = Number(r.h)));
        }
      }
      addSingleLink(i, n, a, u) {
        var r;
        const c = {
          start: i,
          end: n,
          type: void 0,
          text: "",
          labelType: "text",
          classes: [],
          isUserDefinedId: !1,
          interpolate: this.edges.defaultInterpolate,
        };
        et.info("abc78 Got edge...", c);
        const b = a.text;
        if (
          (b !== void 0 &&
            ((c.text = this.sanitizeText(b.text.trim())),
            c.text.startsWith('"') && c.text.endsWith('"') && (c.text = c.text.substring(1, c.text.length - 1)),
            (c.labelType = b.type)),
          a !== void 0 && ((c.type = a.type), (c.stroke = a.stroke), (c.length = a.length > 10 ? 10 : a.length)),
          u && !this.edges.some((k) => k.id === u))
        )
          ((c.id = u), (c.isUserDefinedId = !0));
        else {
          const k = this.edges.filter((m) => m.start === c.start && m.end === c.end);
          k.length === 0
            ? (c.id = s1(c.start, c.end, { counter: 0, prefix: "L" }))
            : (c.id = s1(c.start, c.end, { counter: k.length + 1, prefix: "L" }));
        }
        if (this.edges.length < ((r = this.config.maxEdges) != null ? r : 500))
          (et.info("Pushing edge..."), this.edges.push(c));
        else
          throw new Error(`Edge limit exceeded. ${this.edges.length} edges found, but the limit is ${this.config.maxEdges}.

Initialize mermaid with maxEdges set to a higher number to allow more edges.
You cannot set this config via configuration inside the diagram as it is a secure config.
You have to call mermaid.initialize.`);
      }
      isLinkData(i) {
        return i !== null && typeof i == "object" && "id" in i && typeof i.id == "string";
      }
      addLink(i, n, a) {
        const u = this.isLinkData(a) ? a.id.replace("@", "") : void 0;
        et.info("addLink", i, n, u);
        for (const o of i)
          for (const p of n) {
            const c = o === i[i.length - 1],
              b = p === n[0];
            c && b ? this.addSingleLink(o, p, a, u) : this.addSingleLink(o, p, a, void 0);
          }
      }
      updateLinkInterpolate(i, n) {
        i.forEach((a) => {
          a === "default" ? (this.edges.defaultInterpolate = n) : (this.edges[a].interpolate = n);
        });
      }
      updateLink(i, n) {
        i.forEach((a) => {
          var u, o, p, c, b, r, k;
          if (typeof a == "number" && a >= this.edges.length)
            throw new Error(
              `The index ${a} for linkStyle is out of bounds. Valid indices for linkStyle are between 0 and ${this.edges.length - 1}. (Help: Ensure that the index is within the range of existing edges.)`,
            );
          a === "default"
            ? (this.edges.defaultStyle = n)
            : ((this.edges[a].style = n),
              ((p = (o = (u = this.edges[a]) == null ? void 0 : u.style) == null ? void 0 : o.length) != null ? p : 0) >
                0 &&
                !(
                  (b = (c = this.edges[a]) == null ? void 0 : c.style) != null &&
                  b.some((m) => (m == null ? void 0 : m.startsWith("fill")))
                ) &&
                ((k = (r = this.edges[a]) == null ? void 0 : r.style) == null || k.push("fill:none")));
        });
      }
      addClass(i, n) {
        const a = n.join().replace(/\\,/g, "§§§").replace(/,/g, ";").replace(/§§§/g, ",").split(";");
        i.split(",").forEach((u) => {
          let o = this.classes.get(u);
          (o === void 0 && ((o = { id: u, styles: [], textStyles: [] }), this.classes.set(u, o)),
            a != null &&
              a.forEach((p) => {
                if (/color/.exec(p)) {
                  const c = p.replace("fill", "bgFill");
                  o.textStyles.push(c);
                }
                o.styles.push(p);
              }));
        });
      }
      setDirection(i) {
        ((this.direction = i.trim()),
          /.*</.exec(this.direction) && (this.direction = "RL"),
          /.*\^/.exec(this.direction) && (this.direction = "BT"),
          /.*>/.exec(this.direction) && (this.direction = "LR"),
          /.*v/.exec(this.direction) && (this.direction = "TB"),
          this.direction === "TD" && (this.direction = "TB"));
      }
      setClass(i, n) {
        for (const a of i.split(",")) {
          const u = this.vertices.get(a);
          u && u.classes.push(n);
          const o = this.edges.find((c) => c.id === a);
          o && o.classes.push(n);
          const p = this.subGraphLookup.get(a);
          p && p.classes.push(n);
        }
      }
      setTooltip(i, n) {
        if (n !== void 0) {
          n = this.sanitizeText(n);
          for (const a of i.split(",")) this.tooltips.set(this.version === "gen-1" ? this.lookUpDomId(a) : a, n);
        }
      }
      setClickFun(i, n, a) {
        const u = this.lookUpDomId(i);
        if (kt().securityLevel !== "loose" || n === void 0) return;
        let o = [];
        if (typeof a == "string") {
          o = a.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          for (let c = 0; c < o.length; c++) {
            let b = o[c].trim();
            (b.startsWith('"') && b.endsWith('"') && (b = b.substr(1, b.length - 2)), (o[c] = b));
          }
        }
        o.length === 0 && o.push(i);
        const p = this.vertices.get(i);
        p &&
          ((p.haveCallback = !0),
          this.funs.push(() => {
            const c = document.querySelector(`[id="${u}"]`);
            c !== null &&
              c.addEventListener(
                "click",
                () => {
                  i1.runFunc(n, ...o);
                },
                !1,
              );
          }));
      }
      setLink(i, n, a) {
        (i.split(",").forEach((u) => {
          const o = this.vertices.get(u);
          o !== void 0 && ((o.link = i1.formatUrl(n, this.config)), (o.linkTarget = a));
        }),
          this.setClass(i, "clickable"));
      }
      getTooltip(i) {
        return this.tooltips.get(i);
      }
      setClickEvent(i, n, a) {
        (i.split(",").forEach((u) => {
          this.setClickFun(u, n, a);
        }),
          this.setClass(i, "clickable"));
      }
      bindFunctions(i) {
        this.funs.forEach((n) => {
          n(i);
        });
      }
      getDirection() {
        var i;
        return (i = this.direction) == null ? void 0 : i.trim();
      }
      getVertices() {
        return this.vertices;
      }
      getEdges() {
        return this.edges;
      }
      getClasses() {
        return this.classes;
      }
      setupToolTips(i) {
        let n = Dt(".mermaidTooltip");
        ((n._groups || n)[0][0] === null &&
          (n = Dt("body").append("div").attr("class", "mermaidTooltip").style("opacity", 0)),
          Dt(i)
            .select("svg")
            .selectAll("g.node")
            .on("mouseover", (o) => {
              var r;
              const p = Dt(o.currentTarget);
              if (p.attr("title") === null) return;
              const b = (r = o.currentTarget) == null ? void 0 : r.getBoundingClientRect();
              (n.transition().duration(200).style("opacity", ".9"),
                n
                  .text(p.attr("title"))
                  .style("left", window.scrollX + b.left + (b.right - b.left) / 2 + "px")
                  .style("top", window.scrollY + b.bottom + "px"),
                n.html(n.html().replace(/&lt;br\/&gt;/g, "<br/>")),
                p.classed("hover", !0));
            })
            .on("mouseout", (o) => {
              (n.transition().duration(500).style("opacity", 0), Dt(o.currentTarget).classed("hover", !1));
            }));
      }
      clear(i = "gen-2") {
        ((this.vertices = new Map()),
          (this.classes = new Map()),
          (this.edges = []),
          (this.funs = [this.setupToolTips.bind(this)]),
          (this.subGraphs = []),
          (this.subGraphLookup = new Map()),
          (this.subCount = 0),
          (this.tooltips = new Map()),
          (this.firstGraphFlag = !0),
          (this.version = i),
          (this.config = kt()),
          ae());
      }
      setGen(i) {
        this.version = i || "gen-2";
      }
      defaultStyle() {
        return "fill:#ffa;stroke: #f66; stroke-width: 3px; stroke-dasharray: 5, 5;fill:#ffa;stroke: #666;";
      }
      addSubGraph(i, n, a) {
        var A, U, x;
        let u = i.text.trim(),
          o = a.text;
        i === a && /\s/.exec(a.text) && (u = void 0);
        const c = S((h) => {
            const K = { boolean: {}, number: {}, string: {} },
              j = [];
            let $;
            return {
              nodeList: h.filter(function (W) {
                const v = typeof W;
                return W.stmt && W.stmt === "dir"
                  ? (($ = W.value), !1)
                  : W.trim() === ""
                    ? !1
                    : v in K
                      ? K[v].hasOwnProperty(W)
                        ? !1
                        : (K[v][W] = !0)
                      : j.includes(W)
                        ? !1
                        : j.push(W);
              }),
              dir: $,
            };
          }, "uniq")(n.flat()),
          b = c.nodeList;
        let r = c.dir;
        const k = (A = kt().flowchart) != null ? A : {};
        if (
          ((r =
            r != null
              ? r
              : k.inheritDir && (x = (U = this.getDirection()) != null ? U : kt().direction) != null
                ? x
                : void 0),
          this.version === "gen-1")
        )
          for (let h = 0; h < b.length; h++) b[h] = this.lookUpDomId(b[h]);
        ((u = u != null ? u : "subGraph" + this.subCount),
          (o = o || ""),
          (o = this.sanitizeText(o)),
          (this.subCount = this.subCount + 1));
        const m = { id: u, nodes: b, title: o.trim(), classes: [], dir: r, labelType: a.type };
        return (
          et.info("Adding", m.id, m.nodes, m.dir),
          (m.nodes = this.makeUniq(m, this.subGraphs).nodes),
          this.subGraphs.push(m),
          this.subGraphLookup.set(u, m),
          u
        );
      }
      getPosForId(i) {
        for (const [n, a] of this.subGraphs.entries()) if (a.id === i) return n;
        return -1;
      }
      indexNodes2(i, n) {
        const a = this.subGraphs[n].nodes;
        if (((this.secCount = this.secCount + 1), this.secCount > 2e3)) return { result: !1, count: 0 };
        if (((this.posCrossRef[this.secCount] = n), this.subGraphs[n].id === i)) return { result: !0, count: 0 };
        let u = 0,
          o = 1;
        for (; u < a.length;) {
          const p = this.getPosForId(a[u]);
          if (p >= 0) {
            const c = this.indexNodes2(i, p);
            if (c.result) return { result: !0, count: o + c.count };
            o = o + c.count;
          }
          u = u + 1;
        }
        return { result: !1, count: o };
      }
      getDepthFirstPos(i) {
        return this.posCrossRef[i];
      }
      indexNodes() {
        ((this.secCount = -1), this.subGraphs.length > 0 && this.indexNodes2("none", this.subGraphs.length - 1));
      }
      getSubGraphs() {
        return this.subGraphs;
      }
      firstGraph() {
        return this.firstGraphFlag ? ((this.firstGraphFlag = !1), !0) : !1;
      }
      destructStartLink(i) {
        let n = i.trim(),
          a = "arrow_open";
        switch (n[0]) {
          case "<":
            ((a = "arrow_point"), (n = n.slice(1)));
            break;
          case "x":
            ((a = "arrow_cross"), (n = n.slice(1)));
            break;
          case "o":
            ((a = "arrow_circle"), (n = n.slice(1)));
            break;
        }
        let u = "normal";
        return (n.includes("=") && (u = "thick"), n.includes(".") && (u = "dotted"), { type: a, stroke: u });
      }
      countChar(i, n) {
        const a = n.length;
        let u = 0;
        for (let o = 0; o < a; ++o) n[o] === i && ++u;
        return u;
      }
      destructEndLink(i) {
        const n = i.trim();
        let a = n.slice(0, -1),
          u = "arrow_open";
        switch (n.slice(-1)) {
          case "x":
            ((u = "arrow_cross"), n.startsWith("x") && ((u = "double_" + u), (a = a.slice(1))));
            break;
          case ">":
            ((u = "arrow_point"), n.startsWith("<") && ((u = "double_" + u), (a = a.slice(1))));
            break;
          case "o":
            ((u = "arrow_circle"), n.startsWith("o") && ((u = "double_" + u), (a = a.slice(1))));
            break;
        }
        let o = "normal",
          p = a.length - 1;
        (a.startsWith("=") && (o = "thick"), a.startsWith("~") && (o = "invisible"));
        const c = this.countChar(".", a);
        return (c && ((o = "dotted"), (p = c)), { type: u, stroke: o, length: p });
      }
      destructLink(i, n) {
        const a = this.destructEndLink(i);
        let u;
        if (n) {
          if (((u = this.destructStartLink(n)), u.stroke !== a.stroke)) return { type: "INVALID", stroke: "INVALID" };
          if (u.type === "arrow_open") u.type = a.type;
          else {
            if (u.type !== a.type) return { type: "INVALID", stroke: "INVALID" };
            u.type = "double_" + u.type;
          }
          return (u.type === "double_arrow" && (u.type = "double_arrow_point"), (u.length = a.length), u);
        }
        return a;
      }
      exists(i, n) {
        for (const a of i) if (a.nodes.includes(n)) return !0;
        return !1;
      }
      makeUniq(i, n) {
        const a = [];
        return (
          i.nodes.forEach((u, o) => {
            this.exists(n, u) || a.push(i.nodes[o]);
          }),
          { nodes: a }
        );
      }
      getTypeFromVertex(i) {
        if (i.img) return "imageSquare";
        if (i.icon)
          return i.form === "circle"
            ? "iconCircle"
            : i.form === "square"
              ? "iconSquare"
              : i.form === "rounded"
                ? "iconRounded"
                : "icon";
        switch (i.type) {
          case "square":
          case void 0:
            return "squareRect";
          case "round":
            return "roundedRect";
          case "ellipse":
            return "ellipse";
          default:
            return i.type;
        }
      }
      findNode(i, n) {
        return i.find((a) => a.id === n);
      }
      destructEdgeType(i) {
        let n = "none",
          a = "arrow_point";
        switch (i) {
          case "arrow_point":
          case "arrow_circle":
          case "arrow_cross":
            a = i;
            break;
          case "double_arrow_point":
          case "double_arrow_circle":
          case "double_arrow_cross":
            ((n = i.replace("double_", "")), (a = n));
            break;
        }
        return { arrowTypeStart: n, arrowTypeEnd: a };
      }
      addNodeFromVertex(i, n, a, u, o, p) {
        var k, m;
        const c = a.get(i.id),
          b = (k = u.get(i.id)) != null ? k : !1,
          r = this.findNode(n, i.id);
        if (r)
          ((r.cssStyles = i.styles),
            (r.cssCompiledStyles = this.getCompiledStyles(i.classes)),
            (r.cssClasses = i.classes.join(" ")));
        else {
          const A = {
            id: i.id,
            label: i.text,
            labelStyle: "",
            parentId: c,
            padding: ((m = o.flowchart) == null ? void 0 : m.padding) || 8,
            cssStyles: i.styles,
            cssCompiledStyles: this.getCompiledStyles(["default", "node", ...i.classes]),
            cssClasses: "default " + i.classes.join(" "),
            dir: i.dir,
            domId: i.domId,
            look: p,
            link: i.link,
            linkTarget: i.linkTarget,
            tooltip: this.getTooltip(i.id),
            icon: i.icon,
            pos: i.pos,
            img: i.img,
            assetWidth: i.assetWidth,
            assetHeight: i.assetHeight,
            constraint: i.constraint,
          };
          b
            ? n.push({ ...A, isGroup: !0, shape: "rect" })
            : n.push({ ...A, isGroup: !1, shape: this.getTypeFromVertex(i) });
        }
      }
      getCompiledStyles(i) {
        var a, u;
        let n = [];
        for (const o of i) {
          const p = this.classes.get(o);
          (p != null && p.styles && (n = [...n, ...((a = p.styles) != null ? a : [])].map((c) => c.trim())),
            p != null && p.textStyles && (n = [...n, ...((u = p.textStyles) != null ? u : [])].map((c) => c.trim())));
        }
        return n;
      }
      getData() {
        const i = kt(),
          n = [],
          a = [],
          u = this.getSubGraphs(),
          o = new Map(),
          p = new Map();
        for (let r = u.length - 1; r >= 0; r--) {
          const k = u[r];
          k.nodes.length > 0 && p.set(k.id, !0);
          for (const m of k.nodes) o.set(m, k.id);
        }
        for (let r = u.length - 1; r >= 0; r--) {
          const k = u[r];
          n.push({
            id: k.id,
            label: k.title,
            labelStyle: "",
            parentId: o.get(k.id),
            padding: 8,
            cssCompiledStyles: this.getCompiledStyles(k.classes),
            cssClasses: k.classes.join(" "),
            shape: "rect",
            dir: k.dir,
            isGroup: !0,
            look: i.look,
          });
        }
        this.getVertices().forEach((r) => {
          this.addNodeFromVertex(r, n, o, p, i, i.look || "classic");
        });
        const b = this.getEdges();
        return (
          b.forEach((r, k) => {
            var h, K, j;
            const { arrowTypeStart: m, arrowTypeEnd: A } = this.destructEdgeType(r.type),
              U = [...((h = b.defaultStyle) != null ? h : [])];
            r.style && U.push(...r.style);
            const x = {
              id: s1(r.start, r.end, { counter: k, prefix: "L" }, r.id),
              isUserDefinedId: r.isUserDefinedId,
              start: r.start,
              end: r.end,
              type: (K = r.type) != null ? K : "normal",
              label: r.text,
              labelpos: "c",
              thickness: r.stroke,
              minlen: r.length,
              classes:
                (r == null ? void 0 : r.stroke) === "invisible"
                  ? ""
                  : "edge-thickness-normal edge-pattern-solid flowchart-link",
              arrowTypeStart:
                (r == null ? void 0 : r.stroke) === "invisible" || (r == null ? void 0 : r.type) === "arrow_open"
                  ? "none"
                  : m,
              arrowTypeEnd:
                (r == null ? void 0 : r.stroke) === "invisible" || (r == null ? void 0 : r.type) === "arrow_open"
                  ? "none"
                  : A,
              arrowheadStyle: "fill: #333",
              cssCompiledStyles: this.getCompiledStyles(r.classes),
              labelStyle: U,
              style: U,
              pattern: r.stroke,
              look: i.look,
              animate: r.animate,
              animation: r.animation,
              curve: r.interpolate || this.edges.defaultInterpolate || ((j = i.flowchart) == null ? void 0 : j.curve),
            };
            a.push(x);
          }),
          { nodes: n, edges: a, other: {}, config: i }
        );
      }
      defaultConfig() {
        return ue.flowchart;
      }
    }),
    S(Ot, "FlowDB"),
    Ot),
  fe = S(function (s, i) {
    return i.db.getClasses();
  }, "getClasses"),
  ge = S(async function (s, i, n, a) {
    var U, x;
    (et.info("REF0:"), et.info("Drawing state diagram (v2)", i));
    const { securityLevel: u, flowchart: o, layout: p } = kt();
    let c;
    u === "sandbox" && (c = Dt("#i" + i));
    const b = u === "sandbox" ? c.nodes()[0].contentDocument : document;
    et.debug("Before getData: ");
    const r = a.db.getData();
    et.debug("Data: ", r);
    const k = le(i, u),
      m = a.db.getDirection();
    ((r.type = a.type),
      (r.layoutAlgorithm = q1(p)),
      r.layoutAlgorithm === "dagre" &&
        p === "elk" &&
        et.warn(
          "flowchart-elk was moved to an external package in Mermaid v11. Please refer [release notes](https://github.com/mermaid-js/mermaid/releases/tag/v11.0.0) for more details. This diagram will be rendered using `dagre` layout as a fallback.",
        ),
      (r.direction = m),
      (r.nodeSpacing = (o == null ? void 0 : o.nodeSpacing) || 50),
      (r.rankSpacing = (o == null ? void 0 : o.rankSpacing) || 50),
      (r.markers = ["point", "circle", "cross"]),
      (r.diagramId = i),
      et.debug("REF1:", r),
      await X1(r, k));
    const A = (x = (U = r.config.flowchart) == null ? void 0 : U.diagramPadding) != null ? x : 8;
    (i1.insertTitle(k, "flowchartTitleText", (o == null ? void 0 : o.titleTopMargin) || 0, a.db.getDiagramTitle()),
      ce(k, A, "flowchart", (o == null ? void 0 : o.useMaxWidth) || !1));
    for (const h of r.nodes) {
      const K = Dt(`#${i} [id="${h.id}"]`);
      if (!K || !h.link) continue;
      const j = b.createElementNS("http://www.w3.org/2000/svg", "a");
      (j.setAttributeNS("http://www.w3.org/2000/svg", "class", h.cssClasses),
        j.setAttributeNS("http://www.w3.org/2000/svg", "rel", "noopener"),
        u === "sandbox"
          ? j.setAttributeNS("http://www.w3.org/2000/svg", "target", "_top")
          : h.linkTarget && j.setAttributeNS("http://www.w3.org/2000/svg", "target", h.linkTarget));
      const $ = K.insert(function () {
          return j;
        }, ":first-child"),
        ft = K.select(".label-container");
      ft &&
        $.append(function () {
          return ft.node();
        });
      const W = K.select(".label");
      W &&
        $.append(function () {
          return W.node();
        });
    }
  }, "draw"),
  be = { getClasses: fe, draw: ge },
  r1 = (function () {
    var s = S(function (At, d, f, g) {
        for (f = f || {}, g = At.length; g--; f[At[g]] = d);
        return f;
      }, "o"),
      i = [1, 4],
      n = [1, 3],
      a = [1, 5],
      u = [
        1, 8, 9, 10, 11, 27, 34, 36, 38, 44, 60, 84, 85, 86, 87, 88, 89, 102, 105, 106, 109, 111, 114, 115, 116, 121,
        122, 123, 124,
      ],
      o = [2, 2],
      p = [1, 13],
      c = [1, 14],
      b = [1, 15],
      r = [1, 16],
      k = [1, 23],
      m = [1, 25],
      A = [1, 26],
      U = [1, 27],
      x = [1, 49],
      h = [1, 48],
      K = [1, 29],
      j = [1, 30],
      $ = [1, 31],
      ft = [1, 32],
      W = [1, 33],
      v = [1, 44],
      V = [1, 46],
      I = [1, 42],
      w = [1, 47],
      R = [1, 43],
      N = [1, 50],
      G = [1, 45],
      P = [1, 51],
      O = [1, 52],
      Ut = [1, 34],
      Wt = [1, 35],
      zt = [1, 36],
      Kt = [1, 37],
      gt = [1, 57],
      E = [
        1, 8, 9, 10, 11, 27, 32, 34, 36, 38, 44, 60, 84, 85, 86, 87, 88, 89, 102, 105, 106, 109, 111, 114, 115, 116,
        121, 122, 123, 124,
      ],
      st = [1, 61],
      it = [1, 60],
      rt = [1, 62],
      Tt = [8, 9, 11, 75, 77, 78],
      n1 = [1, 78],
      yt = [1, 91],
      xt = [1, 96],
      Et = [1, 95],
      Ft = [1, 92],
      _t = [1, 88],
      Bt = [1, 94],
      vt = [1, 90],
      Lt = [1, 97],
      Vt = [1, 93],
      It = [1, 98],
      wt = [1, 89],
      mt = [8, 9, 10, 11, 40, 75, 77, 78],
      z = [8, 9, 10, 11, 40, 46, 75, 77, 78],
      X = [
        8, 9, 10, 11, 29, 40, 44, 46, 48, 50, 52, 54, 56, 58, 60, 63, 65, 67, 68, 70, 75, 77, 78, 89, 102, 105, 106,
        109, 111, 114, 115, 116,
      ],
      a1 = [8, 9, 11, 44, 60, 75, 77, 78, 89, 102, 105, 106, 109, 111, 114, 115, 116],
      Rt = [44, 60, 89, 102, 105, 106, 109, 111, 114, 115, 116],
      u1 = [1, 121],
      o1 = [1, 122],
      jt = [1, 124],
      Yt = [1, 123],
      l1 = [44, 60, 62, 74, 89, 102, 105, 106, 109, 111, 114, 115, 116],
      c1 = [1, 133],
      h1 = [1, 147],
      d1 = [1, 148],
      p1 = [1, 149],
      f1 = [1, 150],
      g1 = [1, 135],
      b1 = [1, 137],
      A1 = [1, 141],
      k1 = [1, 142],
      m1 = [1, 143],
      S1 = [1, 144],
      C1 = [1, 145],
      D1 = [1, 146],
      T1 = [1, 151],
      y1 = [1, 152],
      x1 = [1, 131],
      E1 = [1, 132],
      F1 = [1, 139],
      _1 = [1, 134],
      B1 = [1, 138],
      v1 = [1, 136],
      Qt = [
        8, 9, 10, 11, 27, 32, 34, 36, 38, 44, 60, 84, 85, 86, 87, 88, 89, 102, 105, 106, 109, 111, 114, 115, 116, 121,
        122, 123, 124,
      ],
      L1 = [1, 154],
      V1 = [1, 156],
      B = [8, 9, 11],
      Q = [8, 9, 10, 11, 14, 44, 60, 89, 105, 106, 109, 111, 114, 115, 116],
      C = [1, 176],
      Y = [1, 172],
      H = [1, 173],
      D = [1, 177],
      T = [1, 174],
      y = [1, 175],
      Nt = [77, 116, 119],
      F = [8, 9, 10, 11, 12, 14, 27, 29, 32, 44, 60, 75, 84, 85, 86, 87, 88, 89, 90, 105, 109, 111, 114, 115, 116],
      I1 = [10, 106],
      bt = [31, 49, 51, 53, 55, 57, 62, 64, 66, 67, 69, 71, 116, 117, 118],
      nt = [1, 247],
      at = [1, 245],
      ut = [1, 249],
      ot = [1, 243],
      lt = [1, 244],
      ct = [1, 246],
      ht = [1, 248],
      dt = [1, 250],
      Gt = [1, 268],
      w1 = [8, 9, 11, 106],
      tt = [8, 9, 10, 11, 60, 84, 105, 106, 109, 110, 111, 112],
      Zt = {
        trace: S(function () {}, "trace"),
        yy: {},
        symbols_: {
          error: 2,
          start: 3,
          graphConfig: 4,
          document: 5,
          line: 6,
          statement: 7,
          SEMI: 8,
          NEWLINE: 9,
          SPACE: 10,
          EOF: 11,
          GRAPH: 12,
          NODIR: 13,
          DIR: 14,
          FirstStmtSeparator: 15,
          ending: 16,
          endToken: 17,
          spaceList: 18,
          spaceListNewline: 19,
          vertexStatement: 20,
          separator: 21,
          styleStatement: 22,
          linkStyleStatement: 23,
          classDefStatement: 24,
          classStatement: 25,
          clickStatement: 26,
          subgraph: 27,
          textNoTags: 28,
          SQS: 29,
          text: 30,
          SQE: 31,
          end: 32,
          direction: 33,
          acc_title: 34,
          acc_title_value: 35,
          acc_descr: 36,
          acc_descr_value: 37,
          acc_descr_multiline_value: 38,
          shapeData: 39,
          SHAPE_DATA: 40,
          link: 41,
          node: 42,
          styledVertex: 43,
          AMP: 44,
          vertex: 45,
          STYLE_SEPARATOR: 46,
          idString: 47,
          DOUBLECIRCLESTART: 48,
          DOUBLECIRCLEEND: 49,
          PS: 50,
          PE: 51,
          "(-": 52,
          "-)": 53,
          STADIUMSTART: 54,
          STADIUMEND: 55,
          SUBROUTINESTART: 56,
          SUBROUTINEEND: 57,
          VERTEX_WITH_PROPS_START: 58,
          "NODE_STRING[field]": 59,
          COLON: 60,
          "NODE_STRING[value]": 61,
          PIPE: 62,
          CYLINDERSTART: 63,
          CYLINDEREND: 64,
          DIAMOND_START: 65,
          DIAMOND_STOP: 66,
          TAGEND: 67,
          TRAPSTART: 68,
          TRAPEND: 69,
          INVTRAPSTART: 70,
          INVTRAPEND: 71,
          linkStatement: 72,
          arrowText: 73,
          TESTSTR: 74,
          START_LINK: 75,
          edgeText: 76,
          LINK: 77,
          LINK_ID: 78,
          edgeTextToken: 79,
          STR: 80,
          MD_STR: 81,
          textToken: 82,
          keywords: 83,
          STYLE: 84,
          LINKSTYLE: 85,
          CLASSDEF: 86,
          CLASS: 87,
          CLICK: 88,
          DOWN: 89,
          UP: 90,
          textNoTagsToken: 91,
          stylesOpt: 92,
          "idString[vertex]": 93,
          "idString[class]": 94,
          CALLBACKNAME: 95,
          CALLBACKARGS: 96,
          HREF: 97,
          LINK_TARGET: 98,
          "STR[link]": 99,
          "STR[tooltip]": 100,
          alphaNum: 101,
          DEFAULT: 102,
          numList: 103,
          INTERPOLATE: 104,
          NUM: 105,
          COMMA: 106,
          style: 107,
          styleComponent: 108,
          NODE_STRING: 109,
          UNIT: 110,
          BRKT: 111,
          PCT: 112,
          idStringToken: 113,
          MINUS: 114,
          MULT: 115,
          UNICODE_TEXT: 116,
          TEXT: 117,
          TAGSTART: 118,
          EDGE_TEXT: 119,
          alphaNumToken: 120,
          direction_tb: 121,
          direction_bt: 122,
          direction_rl: 123,
          direction_lr: 124,
          $accept: 0,
          $end: 1,
        },
        terminals_: {
          2: "error",
          8: "SEMI",
          9: "NEWLINE",
          10: "SPACE",
          11: "EOF",
          12: "GRAPH",
          13: "NODIR",
          14: "DIR",
          27: "subgraph",
          29: "SQS",
          31: "SQE",
          32: "end",
          34: "acc_title",
          35: "acc_title_value",
          36: "acc_descr",
          37: "acc_descr_value",
          38: "acc_descr_multiline_value",
          40: "SHAPE_DATA",
          44: "AMP",
          46: "STYLE_SEPARATOR",
          48: "DOUBLECIRCLESTART",
          49: "DOUBLECIRCLEEND",
          50: "PS",
          51: "PE",
          52: "(-",
          53: "-)",
          54: "STADIUMSTART",
          55: "STADIUMEND",
          56: "SUBROUTINESTART",
          57: "SUBROUTINEEND",
          58: "VERTEX_WITH_PROPS_START",
          59: "NODE_STRING[field]",
          60: "COLON",
          61: "NODE_STRING[value]",
          62: "PIPE",
          63: "CYLINDERSTART",
          64: "CYLINDEREND",
          65: "DIAMOND_START",
          66: "DIAMOND_STOP",
          67: "TAGEND",
          68: "TRAPSTART",
          69: "TRAPEND",
          70: "INVTRAPSTART",
          71: "INVTRAPEND",
          74: "TESTSTR",
          75: "START_LINK",
          77: "LINK",
          78: "LINK_ID",
          80: "STR",
          81: "MD_STR",
          84: "STYLE",
          85: "LINKSTYLE",
          86: "CLASSDEF",
          87: "CLASS",
          88: "CLICK",
          89: "DOWN",
          90: "UP",
          93: "idString[vertex]",
          94: "idString[class]",
          95: "CALLBACKNAME",
          96: "CALLBACKARGS",
          97: "HREF",
          98: "LINK_TARGET",
          99: "STR[link]",
          100: "STR[tooltip]",
          102: "DEFAULT",
          104: "INTERPOLATE",
          105: "NUM",
          106: "COMMA",
          109: "NODE_STRING",
          110: "UNIT",
          111: "BRKT",
          112: "PCT",
          114: "MINUS",
          115: "MULT",
          116: "UNICODE_TEXT",
          117: "TEXT",
          118: "TAGSTART",
          119: "EDGE_TEXT",
          121: "direction_tb",
          122: "direction_bt",
          123: "direction_rl",
          124: "direction_lr",
        },
        productions_: [
          0,
          [3, 2],
          [5, 0],
          [5, 2],
          [6, 1],
          [6, 1],
          [6, 1],
          [6, 1],
          [6, 1],
          [4, 2],
          [4, 2],
          [4, 2],
          [4, 3],
          [16, 2],
          [16, 1],
          [17, 1],
          [17, 1],
          [17, 1],
          [15, 1],
          [15, 1],
          [15, 2],
          [19, 2],
          [19, 2],
          [19, 1],
          [19, 1],
          [18, 2],
          [18, 1],
          [7, 2],
          [7, 2],
          [7, 2],
          [7, 2],
          [7, 2],
          [7, 2],
          [7, 9],
          [7, 6],
          [7, 4],
          [7, 1],
          [7, 2],
          [7, 2],
          [7, 1],
          [21, 1],
          [21, 1],
          [21, 1],
          [39, 2],
          [39, 1],
          [20, 4],
          [20, 3],
          [20, 4],
          [20, 2],
          [20, 2],
          [20, 1],
          [42, 1],
          [42, 6],
          [42, 5],
          [43, 1],
          [43, 3],
          [45, 4],
          [45, 4],
          [45, 6],
          [45, 4],
          [45, 4],
          [45, 4],
          [45, 8],
          [45, 4],
          [45, 4],
          [45, 4],
          [45, 6],
          [45, 4],
          [45, 4],
          [45, 4],
          [45, 4],
          [45, 4],
          [45, 1],
          [41, 2],
          [41, 3],
          [41, 3],
          [41, 1],
          [41, 3],
          [41, 4],
          [76, 1],
          [76, 2],
          [76, 1],
          [76, 1],
          [72, 1],
          [72, 2],
          [73, 3],
          [30, 1],
          [30, 2],
          [30, 1],
          [30, 1],
          [83, 1],
          [83, 1],
          [83, 1],
          [83, 1],
          [83, 1],
          [83, 1],
          [83, 1],
          [83, 1],
          [83, 1],
          [83, 1],
          [83, 1],
          [28, 1],
          [28, 2],
          [28, 1],
          [28, 1],
          [24, 5],
          [25, 5],
          [26, 2],
          [26, 4],
          [26, 3],
          [26, 5],
          [26, 3],
          [26, 5],
          [26, 5],
          [26, 7],
          [26, 2],
          [26, 4],
          [26, 2],
          [26, 4],
          [26, 4],
          [26, 6],
          [22, 5],
          [23, 5],
          [23, 5],
          [23, 9],
          [23, 9],
          [23, 7],
          [23, 7],
          [103, 1],
          [103, 3],
          [92, 1],
          [92, 3],
          [107, 1],
          [107, 2],
          [108, 1],
          [108, 1],
          [108, 1],
          [108, 1],
          [108, 1],
          [108, 1],
          [108, 1],
          [108, 1],
          [113, 1],
          [113, 1],
          [113, 1],
          [113, 1],
          [113, 1],
          [113, 1],
          [113, 1],
          [113, 1],
          [113, 1],
          [113, 1],
          [113, 1],
          [82, 1],
          [82, 1],
          [82, 1],
          [82, 1],
          [91, 1],
          [91, 1],
          [91, 1],
          [91, 1],
          [91, 1],
          [91, 1],
          [91, 1],
          [91, 1],
          [91, 1],
          [91, 1],
          [91, 1],
          [79, 1],
          [79, 1],
          [120, 1],
          [120, 1],
          [120, 1],
          [120, 1],
          [120, 1],
          [120, 1],
          [120, 1],
          [120, 1],
          [120, 1],
          [120, 1],
          [120, 1],
          [47, 1],
          [47, 2],
          [101, 1],
          [101, 2],
          [33, 1],
          [33, 1],
          [33, 1],
          [33, 1],
        ],
        performAction: S(function (d, f, g, l, _, t, Mt) {
          var e = t.length - 1;
          switch (_) {
            case 2:
              this.$ = [];
              break;
            case 3:
              ((!Array.isArray(t[e]) || t[e].length > 0) && t[e - 1].push(t[e]), (this.$ = t[e - 1]));
              break;
            case 4:
            case 183:
              this.$ = t[e];
              break;
            case 11:
              (l.setDirection("TB"), (this.$ = "TB"));
              break;
            case 12:
              (l.setDirection(t[e - 1]), (this.$ = t[e - 1]));
              break;
            case 27:
              this.$ = t[e - 1].nodes;
              break;
            case 28:
            case 29:
            case 30:
            case 31:
            case 32:
              this.$ = [];
              break;
            case 33:
              this.$ = l.addSubGraph(t[e - 6], t[e - 1], t[e - 4]);
              break;
            case 34:
              this.$ = l.addSubGraph(t[e - 3], t[e - 1], t[e - 3]);
              break;
            case 35:
              this.$ = l.addSubGraph(void 0, t[e - 1], void 0);
              break;
            case 37:
              ((this.$ = t[e].trim()), l.setAccTitle(this.$));
              break;
            case 38:
            case 39:
              ((this.$ = t[e].trim()), l.setAccDescription(this.$));
              break;
            case 43:
              this.$ = t[e - 1] + t[e];
              break;
            case 44:
              this.$ = t[e];
              break;
            case 45:
              (l.addVertex(t[e - 1][t[e - 1].length - 1], void 0, void 0, void 0, void 0, void 0, void 0, t[e]),
                l.addLink(t[e - 3].stmt, t[e - 1], t[e - 2]),
                (this.$ = { stmt: t[e - 1], nodes: t[e - 1].concat(t[e - 3].nodes) }));
              break;
            case 46:
              (l.addLink(t[e - 2].stmt, t[e], t[e - 1]), (this.$ = { stmt: t[e], nodes: t[e].concat(t[e - 2].nodes) }));
              break;
            case 47:
              (l.addLink(t[e - 3].stmt, t[e - 1], t[e - 2]),
                (this.$ = { stmt: t[e - 1], nodes: t[e - 1].concat(t[e - 3].nodes) }));
              break;
            case 48:
              this.$ = { stmt: t[e - 1], nodes: t[e - 1] };
              break;
            case 49:
              (l.addVertex(t[e - 1][t[e - 1].length - 1], void 0, void 0, void 0, void 0, void 0, void 0, t[e]),
                (this.$ = { stmt: t[e - 1], nodes: t[e - 1], shapeData: t[e] }));
              break;
            case 50:
              this.$ = { stmt: t[e], nodes: t[e] };
              break;
            case 51:
              this.$ = [t[e]];
              break;
            case 52:
              (l.addVertex(t[e - 5][t[e - 5].length - 1], void 0, void 0, void 0, void 0, void 0, void 0, t[e - 4]),
                (this.$ = t[e - 5].concat(t[e])));
              break;
            case 53:
              this.$ = t[e - 4].concat(t[e]);
              break;
            case 54:
              this.$ = t[e];
              break;
            case 55:
              ((this.$ = t[e - 2]), l.setClass(t[e - 2], t[e]));
              break;
            case 56:
              ((this.$ = t[e - 3]), l.addVertex(t[e - 3], t[e - 1], "square"));
              break;
            case 57:
              ((this.$ = t[e - 3]), l.addVertex(t[e - 3], t[e - 1], "doublecircle"));
              break;
            case 58:
              ((this.$ = t[e - 5]), l.addVertex(t[e - 5], t[e - 2], "circle"));
              break;
            case 59:
              ((this.$ = t[e - 3]), l.addVertex(t[e - 3], t[e - 1], "ellipse"));
              break;
            case 60:
              ((this.$ = t[e - 3]), l.addVertex(t[e - 3], t[e - 1], "stadium"));
              break;
            case 61:
              ((this.$ = t[e - 3]), l.addVertex(t[e - 3], t[e - 1], "subroutine"));
              break;
            case 62:
              ((this.$ = t[e - 7]),
                l.addVertex(
                  t[e - 7],
                  t[e - 1],
                  "rect",
                  void 0,
                  void 0,
                  void 0,
                  Object.fromEntries([[t[e - 5], t[e - 3]]]),
                ));
              break;
            case 63:
              ((this.$ = t[e - 3]), l.addVertex(t[e - 3], t[e - 1], "cylinder"));
              break;
            case 64:
              ((this.$ = t[e - 3]), l.addVertex(t[e - 3], t[e - 1], "round"));
              break;
            case 65:
              ((this.$ = t[e - 3]), l.addVertex(t[e - 3], t[e - 1], "diamond"));
              break;
            case 66:
              ((this.$ = t[e - 5]), l.addVertex(t[e - 5], t[e - 2], "hexagon"));
              break;
            case 67:
              ((this.$ = t[e - 3]), l.addVertex(t[e - 3], t[e - 1], "odd"));
              break;
            case 68:
              ((this.$ = t[e - 3]), l.addVertex(t[e - 3], t[e - 1], "trapezoid"));
              break;
            case 69:
              ((this.$ = t[e - 3]), l.addVertex(t[e - 3], t[e - 1], "inv_trapezoid"));
              break;
            case 70:
              ((this.$ = t[e - 3]), l.addVertex(t[e - 3], t[e - 1], "lean_right"));
              break;
            case 71:
              ((this.$ = t[e - 3]), l.addVertex(t[e - 3], t[e - 1], "lean_left"));
              break;
            case 72:
              ((this.$ = t[e]), l.addVertex(t[e]));
              break;
            case 73:
              ((t[e - 1].text = t[e]), (this.$ = t[e - 1]));
              break;
            case 74:
            case 75:
              ((t[e - 2].text = t[e - 1]), (this.$ = t[e - 2]));
              break;
            case 76:
              this.$ = t[e];
              break;
            case 77:
              var L = l.destructLink(t[e], t[e - 2]);
              this.$ = { type: L.type, stroke: L.stroke, length: L.length, text: t[e - 1] };
              break;
            case 78:
              var L = l.destructLink(t[e], t[e - 2]);
              this.$ = { type: L.type, stroke: L.stroke, length: L.length, text: t[e - 1], id: t[e - 3] };
              break;
            case 79:
              this.$ = { text: t[e], type: "text" };
              break;
            case 80:
              this.$ = { text: t[e - 1].text + "" + t[e], type: t[e - 1].type };
              break;
            case 81:
              this.$ = { text: t[e], type: "string" };
              break;
            case 82:
              this.$ = { text: t[e], type: "markdown" };
              break;
            case 83:
              var L = l.destructLink(t[e]);
              this.$ = { type: L.type, stroke: L.stroke, length: L.length };
              break;
            case 84:
              var L = l.destructLink(t[e]);
              this.$ = { type: L.type, stroke: L.stroke, length: L.length, id: t[e - 1] };
              break;
            case 85:
              this.$ = t[e - 1];
              break;
            case 86:
              this.$ = { text: t[e], type: "text" };
              break;
            case 87:
              this.$ = { text: t[e - 1].text + "" + t[e], type: t[e - 1].type };
              break;
            case 88:
              this.$ = { text: t[e], type: "string" };
              break;
            case 89:
            case 104:
              this.$ = { text: t[e], type: "markdown" };
              break;
            case 101:
              this.$ = { text: t[e], type: "text" };
              break;
            case 102:
              this.$ = { text: t[e - 1].text + "" + t[e], type: t[e - 1].type };
              break;
            case 103:
              this.$ = { text: t[e], type: "text" };
              break;
            case 105:
              ((this.$ = t[e - 4]), l.addClass(t[e - 2], t[e]));
              break;
            case 106:
              ((this.$ = t[e - 4]), l.setClass(t[e - 2], t[e]));
              break;
            case 107:
            case 115:
              ((this.$ = t[e - 1]), l.setClickEvent(t[e - 1], t[e]));
              break;
            case 108:
            case 116:
              ((this.$ = t[e - 3]), l.setClickEvent(t[e - 3], t[e - 2]), l.setTooltip(t[e - 3], t[e]));
              break;
            case 109:
              ((this.$ = t[e - 2]), l.setClickEvent(t[e - 2], t[e - 1], t[e]));
              break;
            case 110:
              ((this.$ = t[e - 4]), l.setClickEvent(t[e - 4], t[e - 3], t[e - 2]), l.setTooltip(t[e - 4], t[e]));
              break;
            case 111:
              ((this.$ = t[e - 2]), l.setLink(t[e - 2], t[e]));
              break;
            case 112:
              ((this.$ = t[e - 4]), l.setLink(t[e - 4], t[e - 2]), l.setTooltip(t[e - 4], t[e]));
              break;
            case 113:
              ((this.$ = t[e - 4]), l.setLink(t[e - 4], t[e - 2], t[e]));
              break;
            case 114:
              ((this.$ = t[e - 6]), l.setLink(t[e - 6], t[e - 4], t[e]), l.setTooltip(t[e - 6], t[e - 2]));
              break;
            case 117:
              ((this.$ = t[e - 1]), l.setLink(t[e - 1], t[e]));
              break;
            case 118:
              ((this.$ = t[e - 3]), l.setLink(t[e - 3], t[e - 2]), l.setTooltip(t[e - 3], t[e]));
              break;
            case 119:
              ((this.$ = t[e - 3]), l.setLink(t[e - 3], t[e - 2], t[e]));
              break;
            case 120:
              ((this.$ = t[e - 5]), l.setLink(t[e - 5], t[e - 4], t[e]), l.setTooltip(t[e - 5], t[e - 2]));
              break;
            case 121:
              ((this.$ = t[e - 4]), l.addVertex(t[e - 2], void 0, void 0, t[e]));
              break;
            case 122:
              ((this.$ = t[e - 4]), l.updateLink([t[e - 2]], t[e]));
              break;
            case 123:
              ((this.$ = t[e - 4]), l.updateLink(t[e - 2], t[e]));
              break;
            case 124:
              ((this.$ = t[e - 8]), l.updateLinkInterpolate([t[e - 6]], t[e - 2]), l.updateLink([t[e - 6]], t[e]));
              break;
            case 125:
              ((this.$ = t[e - 8]), l.updateLinkInterpolate(t[e - 6], t[e - 2]), l.updateLink(t[e - 6], t[e]));
              break;
            case 126:
              ((this.$ = t[e - 6]), l.updateLinkInterpolate([t[e - 4]], t[e]));
              break;
            case 127:
              ((this.$ = t[e - 6]), l.updateLinkInterpolate(t[e - 4], t[e]));
              break;
            case 128:
            case 130:
              this.$ = [t[e]];
              break;
            case 129:
            case 131:
              (t[e - 2].push(t[e]), (this.$ = t[e - 2]));
              break;
            case 133:
              this.$ = t[e - 1] + t[e];
              break;
            case 181:
              this.$ = t[e];
              break;
            case 182:
              this.$ = t[e - 1] + "" + t[e];
              break;
            case 184:
              this.$ = t[e - 1] + "" + t[e];
              break;
            case 185:
              this.$ = { stmt: "dir", value: "TB" };
              break;
            case 186:
              this.$ = { stmt: "dir", value: "BT" };
              break;
            case 187:
              this.$ = { stmt: "dir", value: "RL" };
              break;
            case 188:
              this.$ = { stmt: "dir", value: "LR" };
              break;
          }
        }, "anonymous"),
        table: [
          { 3: 1, 4: 2, 9: i, 10: n, 12: a },
          { 1: [3] },
          s(u, o, { 5: 6 }),
          { 4: 7, 9: i, 10: n, 12: a },
          { 4: 8, 9: i, 10: n, 12: a },
          { 13: [1, 9], 14: [1, 10] },
          {
            1: [2, 1],
            6: 11,
            7: 12,
            8: p,
            9: c,
            10: b,
            11: r,
            20: 17,
            22: 18,
            23: 19,
            24: 20,
            25: 21,
            26: 22,
            27: k,
            33: 24,
            34: m,
            36: A,
            38: U,
            42: 28,
            43: 38,
            44: x,
            45: 39,
            47: 40,
            60: h,
            84: K,
            85: j,
            86: $,
            87: ft,
            88: W,
            89: v,
            102: V,
            105: I,
            106: w,
            109: R,
            111: N,
            113: 41,
            114: G,
            115: P,
            116: O,
            121: Ut,
            122: Wt,
            123: zt,
            124: Kt,
          },
          s(u, [2, 9]),
          s(u, [2, 10]),
          s(u, [2, 11]),
          { 8: [1, 54], 9: [1, 55], 10: gt, 15: 53, 18: 56 },
          s(E, [2, 3]),
          s(E, [2, 4]),
          s(E, [2, 5]),
          s(E, [2, 6]),
          s(E, [2, 7]),
          s(E, [2, 8]),
          { 8: st, 9: it, 11: rt, 21: 58, 41: 59, 72: 63, 75: [1, 64], 77: [1, 66], 78: [1, 65] },
          { 8: st, 9: it, 11: rt, 21: 67 },
          { 8: st, 9: it, 11: rt, 21: 68 },
          { 8: st, 9: it, 11: rt, 21: 69 },
          { 8: st, 9: it, 11: rt, 21: 70 },
          { 8: st, 9: it, 11: rt, 21: 71 },
          { 8: st, 9: it, 10: [1, 72], 11: rt, 21: 73 },
          s(E, [2, 36]),
          { 35: [1, 74] },
          { 37: [1, 75] },
          s(E, [2, 39]),
          s(Tt, [2, 50], { 18: 76, 39: 77, 10: gt, 40: n1 }),
          { 10: [1, 79] },
          { 10: [1, 80] },
          { 10: [1, 81] },
          { 10: [1, 82] },
          {
            14: yt,
            44: xt,
            60: Et,
            80: [1, 86],
            89: Ft,
            95: [1, 83],
            97: [1, 84],
            101: 85,
            105: _t,
            106: Bt,
            109: vt,
            111: Lt,
            114: Vt,
            115: It,
            116: wt,
            120: 87,
          },
          s(E, [2, 185]),
          s(E, [2, 186]),
          s(E, [2, 187]),
          s(E, [2, 188]),
          s(mt, [2, 51]),
          s(mt, [2, 54], { 46: [1, 99] }),
          s(z, [2, 72], {
            113: 112,
            29: [1, 100],
            44: x,
            48: [1, 101],
            50: [1, 102],
            52: [1, 103],
            54: [1, 104],
            56: [1, 105],
            58: [1, 106],
            60: h,
            63: [1, 107],
            65: [1, 108],
            67: [1, 109],
            68: [1, 110],
            70: [1, 111],
            89: v,
            102: V,
            105: I,
            106: w,
            109: R,
            111: N,
            114: G,
            115: P,
            116: O,
          }),
          s(X, [2, 181]),
          s(X, [2, 142]),
          s(X, [2, 143]),
          s(X, [2, 144]),
          s(X, [2, 145]),
          s(X, [2, 146]),
          s(X, [2, 147]),
          s(X, [2, 148]),
          s(X, [2, 149]),
          s(X, [2, 150]),
          s(X, [2, 151]),
          s(X, [2, 152]),
          s(u, [2, 12]),
          s(u, [2, 18]),
          s(u, [2, 19]),
          { 9: [1, 113] },
          s(a1, [2, 26], { 18: 114, 10: gt }),
          s(E, [2, 27]),
          {
            42: 115,
            43: 38,
            44: x,
            45: 39,
            47: 40,
            60: h,
            89: v,
            102: V,
            105: I,
            106: w,
            109: R,
            111: N,
            113: 41,
            114: G,
            115: P,
            116: O,
          },
          s(E, [2, 40]),
          s(E, [2, 41]),
          s(E, [2, 42]),
          s(Rt, [2, 76], { 73: 116, 62: [1, 118], 74: [1, 117] }),
          { 76: 119, 79: 120, 80: u1, 81: o1, 116: jt, 119: Yt },
          { 75: [1, 125], 77: [1, 126] },
          s(l1, [2, 83]),
          s(E, [2, 28]),
          s(E, [2, 29]),
          s(E, [2, 30]),
          s(E, [2, 31]),
          s(E, [2, 32]),
          {
            10: c1,
            12: h1,
            14: d1,
            27: p1,
            28: 127,
            32: f1,
            44: g1,
            60: b1,
            75: A1,
            80: [1, 129],
            81: [1, 130],
            83: 140,
            84: k1,
            85: m1,
            86: S1,
            87: C1,
            88: D1,
            89: T1,
            90: y1,
            91: 128,
            105: x1,
            109: E1,
            111: F1,
            114: _1,
            115: B1,
            116: v1,
          },
          s(Qt, o, { 5: 153 }),
          s(E, [2, 37]),
          s(E, [2, 38]),
          s(Tt, [2, 48], { 44: L1 }),
          s(Tt, [2, 49], { 18: 155, 10: gt, 40: V1 }),
          s(mt, [2, 44]),
          { 44: x, 47: 157, 60: h, 89: v, 102: V, 105: I, 106: w, 109: R, 111: N, 113: 41, 114: G, 115: P, 116: O },
          { 102: [1, 158], 103: 159, 105: [1, 160] },
          { 44: x, 47: 161, 60: h, 89: v, 102: V, 105: I, 106: w, 109: R, 111: N, 113: 41, 114: G, 115: P, 116: O },
          { 44: x, 47: 162, 60: h, 89: v, 102: V, 105: I, 106: w, 109: R, 111: N, 113: 41, 114: G, 115: P, 116: O },
          s(B, [2, 107], { 10: [1, 163], 96: [1, 164] }),
          { 80: [1, 165] },
          s(B, [2, 115], {
            120: 167,
            10: [1, 166],
            14: yt,
            44: xt,
            60: Et,
            89: Ft,
            105: _t,
            106: Bt,
            109: vt,
            111: Lt,
            114: Vt,
            115: It,
            116: wt,
          }),
          s(B, [2, 117], { 10: [1, 168] }),
          s(Q, [2, 183]),
          s(Q, [2, 170]),
          s(Q, [2, 171]),
          s(Q, [2, 172]),
          s(Q, [2, 173]),
          s(Q, [2, 174]),
          s(Q, [2, 175]),
          s(Q, [2, 176]),
          s(Q, [2, 177]),
          s(Q, [2, 178]),
          s(Q, [2, 179]),
          s(Q, [2, 180]),
          { 44: x, 47: 169, 60: h, 89: v, 102: V, 105: I, 106: w, 109: R, 111: N, 113: 41, 114: G, 115: P, 116: O },
          { 30: 170, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          { 30: 178, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          { 30: 180, 50: [1, 179], 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          { 30: 181, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          { 30: 182, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          { 30: 183, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          { 109: [1, 184] },
          { 30: 185, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          { 30: 186, 65: [1, 187], 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          { 30: 188, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          { 30: 189, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          { 30: 190, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          s(X, [2, 182]),
          s(u, [2, 20]),
          s(a1, [2, 25]),
          s(Tt, [2, 46], { 39: 191, 18: 192, 10: gt, 40: n1 }),
          s(Rt, [2, 73], { 10: [1, 193] }),
          { 10: [1, 194] },
          { 30: 195, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          { 77: [1, 196], 79: 197, 116: jt, 119: Yt },
          s(Nt, [2, 79]),
          s(Nt, [2, 81]),
          s(Nt, [2, 82]),
          s(Nt, [2, 168]),
          s(Nt, [2, 169]),
          { 76: 198, 79: 120, 80: u1, 81: o1, 116: jt, 119: Yt },
          s(l1, [2, 84]),
          {
            8: st,
            9: it,
            10: c1,
            11: rt,
            12: h1,
            14: d1,
            21: 200,
            27: p1,
            29: [1, 199],
            32: f1,
            44: g1,
            60: b1,
            75: A1,
            83: 140,
            84: k1,
            85: m1,
            86: S1,
            87: C1,
            88: D1,
            89: T1,
            90: y1,
            91: 201,
            105: x1,
            109: E1,
            111: F1,
            114: _1,
            115: B1,
            116: v1,
          },
          s(F, [2, 101]),
          s(F, [2, 103]),
          s(F, [2, 104]),
          s(F, [2, 157]),
          s(F, [2, 158]),
          s(F, [2, 159]),
          s(F, [2, 160]),
          s(F, [2, 161]),
          s(F, [2, 162]),
          s(F, [2, 163]),
          s(F, [2, 164]),
          s(F, [2, 165]),
          s(F, [2, 166]),
          s(F, [2, 167]),
          s(F, [2, 90]),
          s(F, [2, 91]),
          s(F, [2, 92]),
          s(F, [2, 93]),
          s(F, [2, 94]),
          s(F, [2, 95]),
          s(F, [2, 96]),
          s(F, [2, 97]),
          s(F, [2, 98]),
          s(F, [2, 99]),
          s(F, [2, 100]),
          {
            6: 11,
            7: 12,
            8: p,
            9: c,
            10: b,
            11: r,
            20: 17,
            22: 18,
            23: 19,
            24: 20,
            25: 21,
            26: 22,
            27: k,
            32: [1, 202],
            33: 24,
            34: m,
            36: A,
            38: U,
            42: 28,
            43: 38,
            44: x,
            45: 39,
            47: 40,
            60: h,
            84: K,
            85: j,
            86: $,
            87: ft,
            88: W,
            89: v,
            102: V,
            105: I,
            106: w,
            109: R,
            111: N,
            113: 41,
            114: G,
            115: P,
            116: O,
            121: Ut,
            122: Wt,
            123: zt,
            124: Kt,
          },
          { 10: gt, 18: 203 },
          { 44: [1, 204] },
          s(mt, [2, 43]),
          {
            10: [1, 205],
            44: x,
            60: h,
            89: v,
            102: V,
            105: I,
            106: w,
            109: R,
            111: N,
            113: 112,
            114: G,
            115: P,
            116: O,
          },
          { 10: [1, 206] },
          { 10: [1, 207], 106: [1, 208] },
          s(I1, [2, 128]),
          {
            10: [1, 209],
            44: x,
            60: h,
            89: v,
            102: V,
            105: I,
            106: w,
            109: R,
            111: N,
            113: 112,
            114: G,
            115: P,
            116: O,
          },
          {
            10: [1, 210],
            44: x,
            60: h,
            89: v,
            102: V,
            105: I,
            106: w,
            109: R,
            111: N,
            113: 112,
            114: G,
            115: P,
            116: O,
          },
          { 80: [1, 211] },
          s(B, [2, 109], { 10: [1, 212] }),
          s(B, [2, 111], { 10: [1, 213] }),
          { 80: [1, 214] },
          s(Q, [2, 184]),
          { 80: [1, 215], 98: [1, 216] },
          s(mt, [2, 55], {
            113: 112,
            44: x,
            60: h,
            89: v,
            102: V,
            105: I,
            106: w,
            109: R,
            111: N,
            114: G,
            115: P,
            116: O,
          }),
          { 31: [1, 217], 67: C, 82: 218, 116: D, 117: T, 118: y },
          s(bt, [2, 86]),
          s(bt, [2, 88]),
          s(bt, [2, 89]),
          s(bt, [2, 153]),
          s(bt, [2, 154]),
          s(bt, [2, 155]),
          s(bt, [2, 156]),
          { 49: [1, 219], 67: C, 82: 218, 116: D, 117: T, 118: y },
          { 30: 220, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          { 51: [1, 221], 67: C, 82: 218, 116: D, 117: T, 118: y },
          { 53: [1, 222], 67: C, 82: 218, 116: D, 117: T, 118: y },
          { 55: [1, 223], 67: C, 82: 218, 116: D, 117: T, 118: y },
          { 57: [1, 224], 67: C, 82: 218, 116: D, 117: T, 118: y },
          { 60: [1, 225] },
          { 64: [1, 226], 67: C, 82: 218, 116: D, 117: T, 118: y },
          { 66: [1, 227], 67: C, 82: 218, 116: D, 117: T, 118: y },
          { 30: 228, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          { 31: [1, 229], 67: C, 82: 218, 116: D, 117: T, 118: y },
          { 67: C, 69: [1, 230], 71: [1, 231], 82: 218, 116: D, 117: T, 118: y },
          { 67: C, 69: [1, 233], 71: [1, 232], 82: 218, 116: D, 117: T, 118: y },
          s(Tt, [2, 45], { 18: 155, 10: gt, 40: V1 }),
          s(Tt, [2, 47], { 44: L1 }),
          s(Rt, [2, 75]),
          s(Rt, [2, 74]),
          { 62: [1, 234], 67: C, 82: 218, 116: D, 117: T, 118: y },
          s(Rt, [2, 77]),
          s(Nt, [2, 80]),
          { 77: [1, 235], 79: 197, 116: jt, 119: Yt },
          { 30: 236, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          s(Qt, o, { 5: 237 }),
          s(F, [2, 102]),
          s(E, [2, 35]),
          {
            43: 238,
            44: x,
            45: 39,
            47: 40,
            60: h,
            89: v,
            102: V,
            105: I,
            106: w,
            109: R,
            111: N,
            113: 41,
            114: G,
            115: P,
            116: O,
          },
          { 10: gt, 18: 239 },
          { 10: nt, 60: at, 84: ut, 92: 240, 105: ot, 107: 241, 108: 242, 109: lt, 110: ct, 111: ht, 112: dt },
          {
            10: nt,
            60: at,
            84: ut,
            92: 251,
            104: [1, 252],
            105: ot,
            107: 241,
            108: 242,
            109: lt,
            110: ct,
            111: ht,
            112: dt,
          },
          {
            10: nt,
            60: at,
            84: ut,
            92: 253,
            104: [1, 254],
            105: ot,
            107: 241,
            108: 242,
            109: lt,
            110: ct,
            111: ht,
            112: dt,
          },
          { 105: [1, 255] },
          { 10: nt, 60: at, 84: ut, 92: 256, 105: ot, 107: 241, 108: 242, 109: lt, 110: ct, 111: ht, 112: dt },
          { 44: x, 47: 257, 60: h, 89: v, 102: V, 105: I, 106: w, 109: R, 111: N, 113: 41, 114: G, 115: P, 116: O },
          s(B, [2, 108]),
          { 80: [1, 258] },
          { 80: [1, 259], 98: [1, 260] },
          s(B, [2, 116]),
          s(B, [2, 118], { 10: [1, 261] }),
          s(B, [2, 119]),
          s(z, [2, 56]),
          s(bt, [2, 87]),
          s(z, [2, 57]),
          { 51: [1, 262], 67: C, 82: 218, 116: D, 117: T, 118: y },
          s(z, [2, 64]),
          s(z, [2, 59]),
          s(z, [2, 60]),
          s(z, [2, 61]),
          { 109: [1, 263] },
          s(z, [2, 63]),
          s(z, [2, 65]),
          { 66: [1, 264], 67: C, 82: 218, 116: D, 117: T, 118: y },
          s(z, [2, 67]),
          s(z, [2, 68]),
          s(z, [2, 70]),
          s(z, [2, 69]),
          s(z, [2, 71]),
          s([10, 44, 60, 89, 102, 105, 106, 109, 111, 114, 115, 116], [2, 85]),
          s(Rt, [2, 78]),
          { 31: [1, 265], 67: C, 82: 218, 116: D, 117: T, 118: y },
          {
            6: 11,
            7: 12,
            8: p,
            9: c,
            10: b,
            11: r,
            20: 17,
            22: 18,
            23: 19,
            24: 20,
            25: 21,
            26: 22,
            27: k,
            32: [1, 266],
            33: 24,
            34: m,
            36: A,
            38: U,
            42: 28,
            43: 38,
            44: x,
            45: 39,
            47: 40,
            60: h,
            84: K,
            85: j,
            86: $,
            87: ft,
            88: W,
            89: v,
            102: V,
            105: I,
            106: w,
            109: R,
            111: N,
            113: 41,
            114: G,
            115: P,
            116: O,
            121: Ut,
            122: Wt,
            123: zt,
            124: Kt,
          },
          s(mt, [2, 53]),
          {
            43: 267,
            44: x,
            45: 39,
            47: 40,
            60: h,
            89: v,
            102: V,
            105: I,
            106: w,
            109: R,
            111: N,
            113: 41,
            114: G,
            115: P,
            116: O,
          },
          s(B, [2, 121], { 106: Gt }),
          s(w1, [2, 130], { 108: 269, 10: nt, 60: at, 84: ut, 105: ot, 109: lt, 110: ct, 111: ht, 112: dt }),
          s(tt, [2, 132]),
          s(tt, [2, 134]),
          s(tt, [2, 135]),
          s(tt, [2, 136]),
          s(tt, [2, 137]),
          s(tt, [2, 138]),
          s(tt, [2, 139]),
          s(tt, [2, 140]),
          s(tt, [2, 141]),
          s(B, [2, 122], { 106: Gt }),
          { 10: [1, 270] },
          s(B, [2, 123], { 106: Gt }),
          { 10: [1, 271] },
          s(I1, [2, 129]),
          s(B, [2, 105], { 106: Gt }),
          s(B, [2, 106], {
            113: 112,
            44: x,
            60: h,
            89: v,
            102: V,
            105: I,
            106: w,
            109: R,
            111: N,
            114: G,
            115: P,
            116: O,
          }),
          s(B, [2, 110]),
          s(B, [2, 112], { 10: [1, 272] }),
          s(B, [2, 113]),
          { 98: [1, 273] },
          { 51: [1, 274] },
          { 62: [1, 275] },
          { 66: [1, 276] },
          { 8: st, 9: it, 11: rt, 21: 277 },
          s(E, [2, 34]),
          s(mt, [2, 52]),
          { 10: nt, 60: at, 84: ut, 105: ot, 107: 278, 108: 242, 109: lt, 110: ct, 111: ht, 112: dt },
          s(tt, [2, 133]),
          {
            14: yt,
            44: xt,
            60: Et,
            89: Ft,
            101: 279,
            105: _t,
            106: Bt,
            109: vt,
            111: Lt,
            114: Vt,
            115: It,
            116: wt,
            120: 87,
          },
          {
            14: yt,
            44: xt,
            60: Et,
            89: Ft,
            101: 280,
            105: _t,
            106: Bt,
            109: vt,
            111: Lt,
            114: Vt,
            115: It,
            116: wt,
            120: 87,
          },
          { 98: [1, 281] },
          s(B, [2, 120]),
          s(z, [2, 58]),
          { 30: 282, 67: C, 80: Y, 81: H, 82: 171, 116: D, 117: T, 118: y },
          s(z, [2, 66]),
          s(Qt, o, { 5: 283 }),
          s(w1, [2, 131], { 108: 269, 10: nt, 60: at, 84: ut, 105: ot, 109: lt, 110: ct, 111: ht, 112: dt }),
          s(B, [2, 126], {
            120: 167,
            10: [1, 284],
            14: yt,
            44: xt,
            60: Et,
            89: Ft,
            105: _t,
            106: Bt,
            109: vt,
            111: Lt,
            114: Vt,
            115: It,
            116: wt,
          }),
          s(B, [2, 127], {
            120: 167,
            10: [1, 285],
            14: yt,
            44: xt,
            60: Et,
            89: Ft,
            105: _t,
            106: Bt,
            109: vt,
            111: Lt,
            114: Vt,
            115: It,
            116: wt,
          }),
          s(B, [2, 114]),
          { 31: [1, 286], 67: C, 82: 218, 116: D, 117: T, 118: y },
          {
            6: 11,
            7: 12,
            8: p,
            9: c,
            10: b,
            11: r,
            20: 17,
            22: 18,
            23: 19,
            24: 20,
            25: 21,
            26: 22,
            27: k,
            32: [1, 287],
            33: 24,
            34: m,
            36: A,
            38: U,
            42: 28,
            43: 38,
            44: x,
            45: 39,
            47: 40,
            60: h,
            84: K,
            85: j,
            86: $,
            87: ft,
            88: W,
            89: v,
            102: V,
            105: I,
            106: w,
            109: R,
            111: N,
            113: 41,
            114: G,
            115: P,
            116: O,
            121: Ut,
            122: Wt,
            123: zt,
            124: Kt,
          },
          { 10: nt, 60: at, 84: ut, 92: 288, 105: ot, 107: 241, 108: 242, 109: lt, 110: ct, 111: ht, 112: dt },
          { 10: nt, 60: at, 84: ut, 92: 289, 105: ot, 107: 241, 108: 242, 109: lt, 110: ct, 111: ht, 112: dt },
          s(z, [2, 62]),
          s(E, [2, 33]),
          s(B, [2, 124], { 106: Gt }),
          s(B, [2, 125], { 106: Gt }),
        ],
        defaultActions: {},
        parseError: S(function (d, f) {
          if (f.recoverable) this.trace(d);
          else {
            var g = new Error(d);
            throw ((g.hash = f), g);
          }
        }, "parseError"),
        parse: S(function (d) {
          var f = this,
            g = [0],
            l = [],
            _ = [null],
            t = [],
            Mt = this.table,
            e = "",
            L = 0,
            R1 = 0,
            z1 = 2,
            N1 = 1,
            K1 = t.slice.call(arguments, 1),
            M = Object.create(this.lexer),
            St = { yy: {} };
          for (var Jt in this.yy) Object.prototype.hasOwnProperty.call(this.yy, Jt) && (St.yy[Jt] = this.yy[Jt]);
          (M.setInput(d, St.yy), (St.yy.lexer = M), (St.yy.parser = this), typeof M.yylloc > "u" && (M.yylloc = {}));
          var $t = M.yylloc;
          t.push($t);
          var j1 = M.options && M.options.ranges;
          typeof St.yy.parseError == "function"
            ? (this.parseError = St.yy.parseError)
            : (this.parseError = Object.getPrototypeOf(this).parseError);
          function Y1(Z) {
            ((g.length = g.length - 2 * Z), (_.length = _.length - Z), (t.length = t.length - Z));
          }
          S(Y1, "popStack");
          function G1() {
            var Z;
            return (
              (Z = l.pop() || M.lex() || N1),
              typeof Z != "number" && (Z instanceof Array && ((l = Z), (Z = l.pop())), (Z = f.symbols_[Z] || Z)),
              Z
            );
          }
          S(G1, "lex");
          for (var q, Ct, J, t1, Pt = {}, qt, pt, P1, Xt; ;) {
            if (
              ((Ct = g[g.length - 1]),
              this.defaultActions[Ct]
                ? (J = this.defaultActions[Ct])
                : ((q === null || typeof q > "u") && (q = G1()), (J = Mt[Ct] && Mt[Ct][q])),
              typeof J > "u" || !J.length || !J[0])
            ) {
              var e1 = "";
              Xt = [];
              for (qt in Mt[Ct]) this.terminals_[qt] && qt > z1 && Xt.push("'" + this.terminals_[qt] + "'");
              (M.showPosition
                ? (e1 =
                    "Parse error on line " +
                    (L + 1) +
                    `:
` +
                    M.showPosition() +
                    `
Expecting ` +
                    Xt.join(", ") +
                    ", got '" +
                    (this.terminals_[q] || q) +
                    "'")
                : (e1 =
                    "Parse error on line " +
                    (L + 1) +
                    ": Unexpected " +
                    (q == N1 ? "end of input" : "'" + (this.terminals_[q] || q) + "'")),
                this.parseError(e1, {
                  text: M.match,
                  token: this.terminals_[q] || q,
                  line: M.yylineno,
                  loc: $t,
                  expected: Xt,
                }));
            }
            if (J[0] instanceof Array && J.length > 1)
              throw new Error("Parse Error: multiple actions possible at state: " + Ct + ", token: " + q);
            switch (J[0]) {
              case 1:
                (g.push(q),
                  _.push(M.yytext),
                  t.push(M.yylloc),
                  g.push(J[1]),
                  (q = null),
                  (R1 = M.yyleng),
                  (e = M.yytext),
                  (L = M.yylineno),
                  ($t = M.yylloc));
                break;
              case 2:
                if (
                  ((pt = this.productions_[J[1]][1]),
                  (Pt.$ = _[_.length - pt]),
                  (Pt._$ = {
                    first_line: t[t.length - (pt || 1)].first_line,
                    last_line: t[t.length - 1].last_line,
                    first_column: t[t.length - (pt || 1)].first_column,
                    last_column: t[t.length - 1].last_column,
                  }),
                  j1 && (Pt._$.range = [t[t.length - (pt || 1)].range[0], t[t.length - 1].range[1]]),
                  (t1 = this.performAction.apply(Pt, [e, R1, L, St.yy, J[1], _, t].concat(K1))),
                  typeof t1 < "u")
                )
                  return t1;
                (pt && ((g = g.slice(0, -1 * pt * 2)), (_ = _.slice(0, -1 * pt)), (t = t.slice(0, -1 * pt))),
                  g.push(this.productions_[J[1]][0]),
                  _.push(Pt.$),
                  t.push(Pt._$),
                  (P1 = Mt[g[g.length - 2]][g[g.length - 1]]),
                  g.push(P1));
                break;
              case 3:
                return !0;
            }
          }
          return !0;
        }, "parse"),
      },
      W1 = (function () {
        var At = {
          EOF: 1,
          parseError: S(function (f, g) {
            if (this.yy.parser) this.yy.parser.parseError(f, g);
            else throw new Error(f);
          }, "parseError"),
          setInput: S(function (d, f) {
            return (
              (this.yy = f || this.yy || {}),
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
            var f = d.match(/(?:\r\n?|\n).*/g);
            return (
              f ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++,
              this.options.ranges && this.yylloc.range[1]++,
              (this._input = this._input.slice(1)),
              d
            );
          }, "input"),
          unput: S(function (d) {
            var f = d.length,
              g = d.split(/(?:\r\n?|\n)/g);
            ((this._input = d + this._input),
              (this.yytext = this.yytext.substr(0, this.yytext.length - f)),
              (this.offset -= f));
            var l = this.match.split(/(?:\r\n?|\n)/g);
            ((this.match = this.match.substr(0, this.match.length - 1)),
              (this.matched = this.matched.substr(0, this.matched.length - 1)),
              g.length - 1 && (this.yylineno -= g.length - 1));
            var _ = this.yylloc.range;
            return (
              (this.yylloc = {
                first_line: this.yylloc.first_line,
                last_line: this.yylineno + 1,
                first_column: this.yylloc.first_column,
                last_column: g
                  ? (g.length === l.length ? this.yylloc.first_column : 0) + l[l.length - g.length].length - g[0].length
                  : this.yylloc.first_column - f,
              }),
              this.options.ranges && (this.yylloc.range = [_[0], _[0] + this.yyleng - f]),
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
              f = new Array(d.length + 1).join("-");
            return (
              d +
              this.upcomingInput() +
              `
` +
              f +
              "^"
            );
          }, "showPosition"),
          test_match: S(function (d, f) {
            var g, l, _;
            if (
              (this.options.backtrack_lexer &&
                ((_ = {
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
                this.options.ranges && (_.yylloc.range = this.yylloc.range.slice(0))),
              (l = d[0].match(/(?:\r\n?|\n).*/g)),
              l && (this.yylineno += l.length),
              (this.yylloc = {
                first_line: this.yylloc.last_line,
                last_line: this.yylineno + 1,
                first_column: this.yylloc.last_column,
                last_column: l
                  ? l[l.length - 1].length - l[l.length - 1].match(/\r?\n?/)[0].length
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
              (g = this.performAction.call(
                this,
                this.yy,
                this,
                f,
                this.conditionStack[this.conditionStack.length - 1],
              )),
              this.done && this._input && (this.done = !1),
              g)
            )
              return g;
            if (this._backtrack) {
              for (var t in _) this[t] = _[t];
              return !1;
            }
            return !1;
          }, "test_match"),
          next: S(function () {
            if (this.done) return this.EOF;
            this._input || (this.done = !0);
            var d, f, g, l;
            this._more || ((this.yytext = ""), (this.match = ""));
            for (var _ = this._currentRules(), t = 0; t < _.length; t++)
              if (((g = this._input.match(this.rules[_[t]])), g && (!f || g[0].length > f[0].length))) {
                if (((f = g), (l = t), this.options.backtrack_lexer)) {
                  if (((d = this.test_match(g, _[t])), d !== !1)) return d;
                  if (this._backtrack) {
                    f = !1;
                    continue;
                  } else return !1;
                } else if (!this.options.flex) break;
              }
            return f
              ? ((d = this.test_match(f, _[l])), d !== !1 ? d : !1)
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
            var f = this.next();
            return f || this.lex();
          }, "lex"),
          begin: S(function (f) {
            this.conditionStack.push(f);
          }, "begin"),
          popState: S(function () {
            var f = this.conditionStack.length - 1;
            return f > 0 ? this.conditionStack.pop() : this.conditionStack[0];
          }, "popState"),
          _currentRules: S(function () {
            return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]
              ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
              : this.conditions.INITIAL.rules;
          }, "_currentRules"),
          topState: S(function (f) {
            return (
              (f = this.conditionStack.length - 1 - Math.abs(f || 0)),
              f >= 0 ? this.conditionStack[f] : "INITIAL"
            );
          }, "topState"),
          pushState: S(function (f) {
            this.begin(f);
          }, "pushState"),
          stateStackSize: S(function () {
            return this.conditionStack.length;
          }, "stateStackSize"),
          options: {},
          performAction: S(function (f, g, l, _) {
            switch (l) {
              case 0:
                return (this.begin("acc_title"), 34);
              case 1:
                return (this.popState(), "acc_title_value");
              case 2:
                return (this.begin("acc_descr"), 36);
              case 3:
                return (this.popState(), "acc_descr_value");
              case 4:
                this.begin("acc_descr_multiline");
                break;
              case 5:
                this.popState();
                break;
              case 6:
                return "acc_descr_multiline_value";
              case 7:
                return (this.pushState("shapeData"), (g.yytext = ""), 40);
              case 8:
                return (this.pushState("shapeDataStr"), 40);
              case 9:
                return (this.popState(), 40);
              case 10:
                const t = /\n\s*/g;
                return ((g.yytext = g.yytext.replace(t, "<br/>")), 40);
              case 11:
                return 40;
              case 12:
                this.popState();
                break;
              case 13:
                this.begin("callbackname");
                break;
              case 14:
                this.popState();
                break;
              case 15:
                (this.popState(), this.begin("callbackargs"));
                break;
              case 16:
                return 95;
              case 17:
                this.popState();
                break;
              case 18:
                return 96;
              case 19:
                return "MD_STR";
              case 20:
                this.popState();
                break;
              case 21:
                this.begin("md_string");
                break;
              case 22:
                return "STR";
              case 23:
                this.popState();
                break;
              case 24:
                this.pushState("string");
                break;
              case 25:
                return 84;
              case 26:
                return 102;
              case 27:
                return 85;
              case 28:
                return 104;
              case 29:
                return 86;
              case 30:
                return 87;
              case 31:
                return 97;
              case 32:
                this.begin("click");
                break;
              case 33:
                this.popState();
                break;
              case 34:
                return 88;
              case 35:
                return (f.lex.firstGraph() && this.begin("dir"), 12);
              case 36:
                return (f.lex.firstGraph() && this.begin("dir"), 12);
              case 37:
                return (f.lex.firstGraph() && this.begin("dir"), 12);
              case 38:
                return 27;
              case 39:
                return 32;
              case 40:
                return 98;
              case 41:
                return 98;
              case 42:
                return 98;
              case 43:
                return 98;
              case 44:
                return (this.popState(), 13);
              case 45:
                return (this.popState(), 14);
              case 46:
                return (this.popState(), 14);
              case 47:
                return (this.popState(), 14);
              case 48:
                return (this.popState(), 14);
              case 49:
                return (this.popState(), 14);
              case 50:
                return (this.popState(), 14);
              case 51:
                return (this.popState(), 14);
              case 52:
                return (this.popState(), 14);
              case 53:
                return (this.popState(), 14);
              case 54:
                return (this.popState(), 14);
              case 55:
                return 121;
              case 56:
                return 122;
              case 57:
                return 123;
              case 58:
                return 124;
              case 59:
                return 78;
              case 60:
                return 105;
              case 61:
                return 111;
              case 62:
                return 46;
              case 63:
                return 60;
              case 64:
                return 44;
              case 65:
                return 8;
              case 66:
                return 106;
              case 67:
                return 115;
              case 68:
                return (this.popState(), 77);
              case 69:
                return (this.pushState("edgeText"), 75);
              case 70:
                return 119;
              case 71:
                return (this.popState(), 77);
              case 72:
                return (this.pushState("thickEdgeText"), 75);
              case 73:
                return 119;
              case 74:
                return (this.popState(), 77);
              case 75:
                return (this.pushState("dottedEdgeText"), 75);
              case 76:
                return 119;
              case 77:
                return 77;
              case 78:
                return (this.popState(), 53);
              case 79:
                return "TEXT";
              case 80:
                return (this.pushState("ellipseText"), 52);
              case 81:
                return (this.popState(), 55);
              case 82:
                return (this.pushState("text"), 54);
              case 83:
                return (this.popState(), 57);
              case 84:
                return (this.pushState("text"), 56);
              case 85:
                return 58;
              case 86:
                return (this.pushState("text"), 67);
              case 87:
                return (this.popState(), 64);
              case 88:
                return (this.pushState("text"), 63);
              case 89:
                return (this.popState(), 49);
              case 90:
                return (this.pushState("text"), 48);
              case 91:
                return (this.popState(), 69);
              case 92:
                return (this.popState(), 71);
              case 93:
                return 117;
              case 94:
                return (this.pushState("trapText"), 68);
              case 95:
                return (this.pushState("trapText"), 70);
              case 96:
                return 118;
              case 97:
                return 67;
              case 98:
                return 90;
              case 99:
                return "SEP";
              case 100:
                return 89;
              case 101:
                return 115;
              case 102:
                return 111;
              case 103:
                return 44;
              case 104:
                return 109;
              case 105:
                return 114;
              case 106:
                return 116;
              case 107:
                return (this.popState(), 62);
              case 108:
                return (this.pushState("text"), 62);
              case 109:
                return (this.popState(), 51);
              case 110:
                return (this.pushState("text"), 50);
              case 111:
                return (this.popState(), 31);
              case 112:
                return (this.pushState("text"), 29);
              case 113:
                return (this.popState(), 66);
              case 114:
                return (this.pushState("text"), 65);
              case 115:
                return "TEXT";
              case 116:
                return "QUOTE";
              case 117:
                return 9;
              case 118:
                return 10;
              case 119:
                return 11;
            }
          }, "anonymous"),
          rules: [
            /^(?:accTitle\s*:\s*)/,
            /^(?:(?!\n||)*[^\n]*)/,
            /^(?:accDescr\s*:\s*)/,
            /^(?:(?!\n||)*[^\n]*)/,
            /^(?:accDescr\s*\{\s*)/,
            /^(?:[\}])/,
            /^(?:[^\}]*)/,
            /^(?:@\{)/,
            /^(?:["])/,
            /^(?:["])/,
            /^(?:[^\"]+)/,
            /^(?:[^}^"]+)/,
            /^(?:\})/,
            /^(?:call[\s]+)/,
            /^(?:\([\s]*\))/,
            /^(?:\()/,
            /^(?:[^(]*)/,
            /^(?:\))/,
            /^(?:[^)]*)/,
            /^(?:[^`"]+)/,
            /^(?:[`]["])/,
            /^(?:["][`])/,
            /^(?:[^"]+)/,
            /^(?:["])/,
            /^(?:["])/,
            /^(?:style\b)/,
            /^(?:default\b)/,
            /^(?:linkStyle\b)/,
            /^(?:interpolate\b)/,
            /^(?:classDef\b)/,
            /^(?:class\b)/,
            /^(?:href[\s])/,
            /^(?:click[\s]+)/,
            /^(?:[\s\n])/,
            /^(?:[^\s\n]*)/,
            /^(?:flowchart-elk\b)/,
            /^(?:graph\b)/,
            /^(?:flowchart\b)/,
            /^(?:subgraph\b)/,
            /^(?:end\b\s*)/,
            /^(?:_self\b)/,
            /^(?:_blank\b)/,
            /^(?:_parent\b)/,
            /^(?:_top\b)/,
            /^(?:(\r?\n)*\s*\n)/,
            /^(?:\s*LR\b)/,
            /^(?:\s*RL\b)/,
            /^(?:\s*TB\b)/,
            /^(?:\s*BT\b)/,
            /^(?:\s*TD\b)/,
            /^(?:\s*BR\b)/,
            /^(?:\s*<)/,
            /^(?:\s*>)/,
            /^(?:\s*\^)/,
            /^(?:\s*v\b)/,
            /^(?:.*direction\s+TB[^\n]*)/,
            /^(?:.*direction\s+BT[^\n]*)/,
            /^(?:.*direction\s+RL[^\n]*)/,
            /^(?:.*direction\s+LR[^\n]*)/,
            /^(?:[^\s\"]+@(?=[^\{\"]))/,
            /^(?:[0-9]+)/,
            /^(?:#)/,
            /^(?::::)/,
            /^(?::)/,
            /^(?:&)/,
            /^(?:;)/,
            /^(?:,)/,
            /^(?:\*)/,
            /^(?:\s*[xo<]?--+[-xo>]\s*)/,
            /^(?:\s*[xo<]?--\s*)/,
            /^(?:[^-]|-(?!-)+)/,
            /^(?:\s*[xo<]?==+[=xo>]\s*)/,
            /^(?:\s*[xo<]?==\s*)/,
            /^(?:[^=]|=(?!))/,
            /^(?:\s*[xo<]?-?\.+-[xo>]?\s*)/,
            /^(?:\s*[xo<]?-\.\s*)/,
            /^(?:[^\.]|\.(?!))/,
            /^(?:\s*~~[\~]+\s*)/,
            /^(?:[-/\)][\)])/,
            /^(?:[^\(\)\[\]\{\}]|!\)+)/,
            /^(?:\(-)/,
            /^(?:\]\))/,
            /^(?:\(\[)/,
            /^(?:\]\])/,
            /^(?:\[\[)/,
            /^(?:\[\|)/,
            /^(?:>)/,
            /^(?:\)\])/,
            /^(?:\[\()/,
            /^(?:\)\)\))/,
            /^(?:\(\(\()/,
            /^(?:[\\(?=\])][\]])/,
            /^(?:\/(?=\])\])/,
            /^(?:\/(?!\])|\\(?!\])|[^\\\[\]\(\)\{\}\/]+)/,
            /^(?:\[\/)/,
            /^(?:\[\\)/,
            /^(?:<)/,
            /^(?:>)/,
            /^(?:\^)/,
            /^(?:\\\|)/,
            /^(?:v\b)/,
            /^(?:\*)/,
            /^(?:#)/,
            /^(?:&)/,
            /^(?:([A-Za-z0-9!"\#$%&'*+\.`?\\_\/]|-(?=[^\>\-\.])|(?!))+)/,
            /^(?:-)/,
            /^(?:[\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6]|[\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377]|[\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5]|[\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA]|[\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE]|[\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA]|[\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0]|[\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977]|[\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2]|[\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A]|[\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39]|[\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8]|[\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C]|[\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C]|[\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99]|[\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0]|[\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D]|[\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3]|[\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10]|[\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1]|[\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81]|[\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3]|[\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6]|[\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A]|[\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081]|[\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D]|[\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0]|[\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310]|[\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C]|[\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711]|[\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7]|[\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C]|[\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16]|[\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF]|[\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC]|[\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D]|[\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D]|[\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3]|[\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F]|[\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128]|[\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184]|[\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3]|[\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6]|[\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE]|[\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C]|[\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D]|[\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC]|[\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B]|[\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788]|[\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805]|[\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB]|[\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28]|[\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5]|[\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4]|[\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E]|[\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D]|[\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36]|[\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D]|[\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC]|[\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF]|[\uFFD2-\uFFD7\uFFDA-\uFFDC])/,
            /^(?:\|)/,
            /^(?:\|)/,
            /^(?:\))/,
            /^(?:\()/,
            /^(?:\])/,
            /^(?:\[)/,
            /^(?:(\}))/,
            /^(?:\{)/,
            /^(?:[^\[\]\(\)\{\}\|\"]+)/,
            /^(?:")/,
            /^(?:(\r?\n)+)/,
            /^(?:\s)/,
            /^(?:$)/,
          ],
          conditions: {
            shapeDataEndBracket: { rules: [21, 24, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114], inclusive: !1 },
            shapeDataStr: { rules: [9, 10, 21, 24, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114], inclusive: !1 },
            shapeData: {
              rules: [8, 11, 12, 21, 24, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114],
              inclusive: !1,
            },
            callbackargs: {
              rules: [17, 18, 21, 24, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114],
              inclusive: !1,
            },
            callbackname: {
              rules: [14, 15, 16, 21, 24, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114],
              inclusive: !1,
            },
            href: { rules: [21, 24, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114], inclusive: !1 },
            click: { rules: [21, 24, 33, 34, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114], inclusive: !1 },
            dottedEdgeText: {
              rules: [21, 24, 74, 76, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114],
              inclusive: !1,
            },
            thickEdgeText: {
              rules: [21, 24, 71, 73, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114],
              inclusive: !1,
            },
            edgeText: { rules: [21, 24, 68, 70, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114], inclusive: !1 },
            trapText: {
              rules: [21, 24, 77, 80, 82, 84, 88, 90, 91, 92, 93, 94, 95, 108, 110, 112, 114],
              inclusive: !1,
            },
            ellipseText: { rules: [21, 24, 77, 78, 79, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114], inclusive: !1 },
            text: {
              rules: [
                21, 24, 77, 80, 81, 82, 83, 84, 87, 88, 89, 90, 94, 95, 107, 108, 109, 110, 111, 112, 113, 114, 115,
              ],
              inclusive: !1,
            },
            vertex: { rules: [21, 24, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114], inclusive: !1 },
            dir: {
              rules: [
                21, 24, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114,
              ],
              inclusive: !1,
            },
            acc_descr_multiline: {
              rules: [5, 6, 21, 24, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114],
              inclusive: !1,
            },
            acc_descr: { rules: [3, 21, 24, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114], inclusive: !1 },
            acc_title: { rules: [1, 21, 24, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114], inclusive: !1 },
            md_string: { rules: [19, 20, 21, 24, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114], inclusive: !1 },
            string: { rules: [21, 22, 23, 24, 77, 80, 82, 84, 88, 90, 94, 95, 108, 110, 112, 114], inclusive: !1 },
            INITIAL: {
              rules: [
                0, 2, 4, 7, 13, 21, 24, 25, 26, 27, 28, 29, 30, 31, 32, 35, 36, 37, 38, 39, 40, 41, 42, 43, 55, 56, 57,
                58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 72, 74, 75, 77, 80, 82, 84, 85, 86, 88, 90, 94, 95,
                96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 108, 110, 112, 114, 116, 117, 118, 119,
              ],
              inclusive: !0,
            },
          },
        };
        return At;
      })();
    Zt.lexer = W1;
    function Ht() {
      this.yy = {};
    }
    return (S(Ht, "Parser"), (Ht.prototype = Zt), (Zt.Parser = Ht), new Ht());
  })();
r1.parser = r1;
var M1 = r1,
  U1 = Object.assign({}, M1);
U1.parse = (s) => {
  const i = s.replace(
    /}\s*\n/g,
    `}
`,
  );
  return M1.parse(i);
};
var Ae = U1,
  ke = S((s, i) => {
    const n = he,
      a = n(s, "r"),
      u = n(s, "g"),
      o = n(s, "b");
    return oe(a, u, o, i);
  }, "fade"),
  me = S(
    (s) => `.label {
    font-family: ${s.fontFamily};
    color: ${s.nodeTextColor || s.textColor};
  }
  .cluster-label text {
    fill: ${s.titleColor};
  }
  .cluster-label span {
    color: ${s.titleColor};
  }
  .cluster-label span p {
    background-color: transparent;
  }

  .label text,span {
    fill: ${s.nodeTextColor || s.textColor};
    color: ${s.nodeTextColor || s.textColor};
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${s.mainBkg};
    stroke: ${s.nodeBorder};
    stroke-width: 1px;
  }
  .rough-node .label text , .node .label text, .image-shape .label, .icon-shape .label {
    text-anchor: middle;
  }
  // .flowchart-label .text-outer-tspan {
  //   text-anchor: middle;
  // }
  // .flowchart-label .text-inner-tspan {
  //   text-anchor: start;
  // }

  .node .katex path {
    fill: #000;
    stroke: #000;
    stroke-width: 1px;
  }

  .rough-node .label,.node .label, .image-shape .label, .icon-shape .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }


  .root .anchor path {
    fill: ${s.lineColor} !important;
    stroke-width: 0;
    stroke: ${s.lineColor};
  }

  .arrowheadPath {
    fill: ${s.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${s.lineColor};
    stroke-width: 2.0px;
  }

  .flowchart-link {
    stroke: ${s.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${s.edgeLabelBackground};
    p {
      background-color: ${s.edgeLabelBackground};
    }
    rect {
      opacity: 0.5;
      background-color: ${s.edgeLabelBackground};
      fill: ${s.edgeLabelBackground};
    }
    text-align: center;
  }

  /* For html labels only */
  .labelBkg {
    background-color: ${ke(s.edgeLabelBackground, 0.5)};
    // background-color:
  }

  .cluster rect {
    fill: ${s.clusterBkg};
    stroke: ${s.clusterBorder};
    stroke-width: 1px;
  }

  .cluster text {
    fill: ${s.titleColor};
  }

  .cluster span {
    color: ${s.titleColor};
  }
  /* .cluster div {
    color: ${s.titleColor};
  } */

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${s.fontFamily};
    font-size: 12px;
    background: ${s.tertiaryColor};
    border: 1px solid ${s.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .flowchartTitleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${s.textColor};
  }

  rect.text {
    fill: none;
    stroke-width: 0;
  }

  .icon-shape, .image-shape {
    background-color: ${s.edgeLabelBackground};
    p {
      background-color: ${s.edgeLabelBackground};
      padding: 2px;
    }
    rect {
      opacity: 0.5;
      background-color: ${s.edgeLabelBackground};
      fill: ${s.edgeLabelBackground};
    }
    text-align: center;
  }
  ${H1()}
`,
    "getStyles",
  ),
  Se = me,
  Fe = {
    parser: Ae,
    get db() {
      return new pe();
    },
    renderer: be,
    styles: Se,
    init: S((s) => {
      (s.flowchart || (s.flowchart = {}),
        s.layout && O1({ layout: s.layout }),
        (s.flowchart.arrowMarkerAbsolute = s.arrowMarkerAbsolute),
        O1({ flowchart: { arrowMarkerAbsolute: s.arrowMarkerAbsolute } }));
    }, "init"),
  };
export { Fe as diagram };
