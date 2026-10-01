import { p as B } from "./chunk-JWPE2WC7-CKTugQKa.js";
import {
  _ as b,
  F as w,
  I as C,
  e as D,
  l as y,
  b as S,
  a as T,
  p as E,
  q as F,
  g as P,
  s as _,
  D as z,
  G as A,
  t as W,
} from "./registry-CHHSpXp3.js";
import { p as I } from "./cynefin-OW5HDTMX-DFqCVa-v.js";
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
      t = new e.Error().stack;
    t &&
      ((e._sentryDebugIds = e._sentryDebugIds || {}),
      (e._sentryDebugIds[t] = "02637c4f-392a-479f-82ec-876ddeb9ddef"),
      (e._sentryDebugIdIdentifier = "sentry-dbid-02637c4f-392a-479f-82ec-876ddeb9ddef"));
  })();
} catch {}
var N = A.packet,
  k,
  m =
    ((k = class {
      constructor() {
        ((this.packet = []),
          (this.setAccTitle = S),
          (this.getAccTitle = T),
          (this.setDiagramTitle = E),
          (this.getDiagramTitle = F),
          (this.getAccDescription = P),
          (this.setAccDescription = _));
      }
      getConfig() {
        const t = w({ ...N, ...z().packet });
        return (t.showBits && (t.paddingY += 10), t);
      }
      getPacket() {
        return this.packet;
      }
      pushWord(t) {
        t.length > 0 && this.packet.push(t);
      }
      clear() {
        (W(), (this.packet = []));
      }
    }),
    b(k, "PacketDB"),
    k),
  L = 1e4,
  Y = b((e, t) => {
    B(e, t);
    let s = -1,
      r = [],
      l = 1;
    const { bitsPerRow: c } = t.getConfig();
    for (let { start: a, end: o, bits: n, label: d } of e.blocks) {
      if (a !== void 0 && o !== void 0 && o < a)
        throw new Error(`Packet block ${a} - ${o} is invalid. End must be greater than start.`);
      if ((a != null || (a = s + 1), a !== s + 1))
        throw new Error(`Packet block ${a} - ${o != null ? o : a} is not contiguous. It should start from ${s + 1}.`);
      if (n === 0) throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);
      for (
        o != null || (o = a + (n != null ? n : 1) - 1),
          n != null || (n = o - a + 1),
          s = o,
          y.debug(`Packet block ${a} - ${s} with label ${d}`);
        r.length <= c + 1 && t.getPacket().length < L;
      ) {
        const [f, i] = M({ start: a, end: o, bits: n, label: d }, l, c);
        if ((r.push(f), f.end + 1 === l * c && (t.pushWord(r), (r = []), l++), !i)) break;
        ({ start: a, end: o, bits: n, label: d } = i);
      }
    }
    t.pushWord(r);
  }, "populate"),
  M = b((e, t, s) => {
    if (e.start === void 0) throw new Error("start should have been set during first phase");
    if (e.end === void 0) throw new Error("end should have been set during first phase");
    if (e.start > e.end) throw new Error(`Block start ${e.start} is greater than block end ${e.end}.`);
    if (e.end + 1 <= t * s) return [e, void 0];
    const r = t * s - 1,
      l = t * s;
    return [
      { start: e.start, end: r, label: e.label, bits: r - e.start },
      { start: l, end: e.end, label: e.label, bits: e.end - l },
    ];
  }, "getNextFittingBlock"),
  v = {
    parser: { yy: void 0 },
    parse: b(async (e) => {
      var r;
      const t = await I("packet", e),
        s = (r = v.parser) == null ? void 0 : r.yy;
      if (!(s instanceof m))
        throw new Error(
          "parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.",
        );
      (y.debug(t), Y(t, s));
    }, "parse"),
  },
  R = b((e, t, s, r) => {
    const l = r.db,
      c = l.getConfig(),
      { rowHeight: a, paddingY: o, bitWidth: n, bitsPerRow: d } = c,
      f = l.getPacket(),
      i = l.getDiagramTitle(),
      g = a + o,
      p = g * (f.length + 1) - (i ? 0 : a),
      h = n * d + 2,
      u = C(t);
    (u.attr("viewBox", `0 0 ${h} ${p}`), D(u, p, h, c.useMaxWidth));
    for (const [x, $] of f.entries()) G(u, $, x, c);
    u.append("text")
      .text(i)
      .attr("x", h / 2)
      .attr("y", p - g / 2)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("class", "packetTitle");
  }, "draw"),
  G = b((e, t, s, { rowHeight: r, paddingX: l, paddingY: c, bitWidth: a, bitsPerRow: o, showBits: n }) => {
    const d = e.append("g"),
      f = s * (r + c) + c;
    for (const i of t) {
      const g = (i.start % o) * a + 1,
        p = (i.end - i.start + 1) * a - l;
      if (
        (d.append("rect").attr("x", g).attr("y", f).attr("width", p).attr("height", r).attr("class", "packetBlock"),
        d
          .append("text")
          .attr("x", g + p / 2)
          .attr("y", f + r / 2)
          .attr("class", "packetLabel")
          .attr("dominant-baseline", "middle")
          .attr("text-anchor", "middle")
          .text(i.label),
        !n)
      )
        continue;
      const h = i.end === i.start,
        u = f - 2;
      (d
        .append("text")
        .attr("x", g + (h ? p / 2 : 0))
        .attr("y", u)
        .attr("class", "packetByte start")
        .attr("dominant-baseline", "auto")
        .attr("text-anchor", h ? "middle" : "start")
        .text(i.start),
        h ||
          d
            .append("text")
            .attr("x", g + p)
            .attr("y", u)
            .attr("class", "packetByte end")
            .attr("dominant-baseline", "auto")
            .attr("text-anchor", "end")
            .text(i.end));
    }
  }, "drawWord"),
  O = { draw: R },
  j = {
    byteFontSize: "10px",
    startByteColor: "black",
    endByteColor: "black",
    labelColor: "black",
    labelFontSize: "12px",
    titleColor: "black",
    titleFontSize: "14px",
    blockStrokeColor: "black",
    blockStrokeWidth: "1",
    blockFillColor: "#efefef",
  },
  q = b(({ packet: e } = {}) => {
    const t = w(j, e);
    return `
	.packetByte {
		font-size: ${t.byteFontSize};
	}
	.packetByte.start {
		fill: ${t.startByteColor};
	}
	.packetByte.end {
		fill: ${t.endByteColor};
	}
	.packetLabel {
		fill: ${t.labelColor};
		font-size: ${t.labelFontSize};
	}
	.packetTitle {
		fill: ${t.titleColor};
		font-size: ${t.titleFontSize};
	}
	.packetBlock {
		stroke: ${t.blockStrokeColor};
		stroke-width: ${t.blockStrokeWidth};
		fill: ${t.blockFillColor};
	}
	`;
  }, "styles"),
  X = {
    parser: v,
    get db() {
      return new m();
    },
    renderer: O,
    styles: q,
  };
export { X as diagram };
