import {
  _ as G,
  B as Q,
  y as st,
  ab as Et,
  aD as Lt,
  a9 as it,
  G as J,
  aE as Tt,
  aF as Nt,
  aG as Dt,
  z as mt,
  aN as Ot,
  av as At,
} from "./VscTheme-BExNMG_K.js";
import { c as ft } from "./cytoscape.esm-Bq8ucWvb.js";
import { bg as It } from "./registry-BL-NPVNy.js";
(function () {
  var I =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  I.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
})();
try {
  (function () {
    var I =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      w = new I.Error().stack;
    w &&
      ((I._sentryDebugIds = I._sentryDebugIds || {}),
      (I._sentryDebugIds[w] = "5ab953f9-a48c-43ed-afa1-d7046de59028"),
      (I._sentryDebugIdIdentifier = "sentry-dbid-5ab953f9-a48c-43ed-afa1-d7046de59028"));
  })();
} catch {}
var tt = { exports: {} },
  et = { exports: {} },
  rt = { exports: {} },
  Ct = rt.exports,
  ct;
function Rt() {
  return (
    ct ||
      ((ct = 1),
      (function (I, w) {
        (function (m, y) {
          I.exports = y();
        })(Ct, function () {
          return (function (u) {
            var m = {};
            function y(r) {
              if (m[r]) return m[r].exports;
              var t = (m[r] = { i: r, l: !1, exports: {} });
              return (u[r].call(t.exports, t, t.exports, y), (t.l = !0), t.exports);
            }
            return (
              (y.m = u),
              (y.c = m),
              (y.i = function (r) {
                return r;
              }),
              (y.d = function (r, t, e) {
                y.o(r, t) || Object.defineProperty(r, t, { configurable: !1, enumerable: !0, get: e });
              }),
              (y.n = function (r) {
                var t =
                  r && r.__esModule
                    ? function () {
                        return r.default;
                      }
                    : function () {
                        return r;
                      };
                return (y.d(t, "a", t), t);
              }),
              (y.o = function (r, t) {
                return Object.prototype.hasOwnProperty.call(r, t);
              }),
              (y.p = ""),
              y((y.s = 26))
            );
          })([
            function (u, m, y) {
              function r() {}
              ((r.QUALITY = 1),
                (r.DEFAULT_CREATE_BENDS_AS_NEEDED = !1),
                (r.DEFAULT_INCREMENTAL = !1),
                (r.DEFAULT_ANIMATION_ON_LAYOUT = !0),
                (r.DEFAULT_ANIMATION_DURING_LAYOUT = !1),
                (r.DEFAULT_ANIMATION_PERIOD = 50),
                (r.DEFAULT_UNIFORM_LEAF_NODE_SIZES = !1),
                (r.DEFAULT_GRAPH_MARGIN = 15),
                (r.NODE_DIMENSIONS_INCLUDE_LABELS = !1),
                (r.SIMPLE_NODE_SIZE = 40),
                (r.SIMPLE_NODE_HALF_SIZE = r.SIMPLE_NODE_SIZE / 2),
                (r.EMPTY_COMPOUND_NODE_SIZE = 40),
                (r.MIN_EDGE_LENGTH = 1),
                (r.WORLD_BOUNDARY = 1e6),
                (r.INITIAL_WORLD_BOUNDARY = r.WORLD_BOUNDARY / 1e3),
                (r.WORLD_CENTER_X = 1200),
                (r.WORLD_CENTER_Y = 900),
                (u.exports = r));
            },
            function (u, m, y) {
              var r = y(2),
                t = y(8),
                e = y(9);
              function i(g, a, d) {
                (r.call(this, d),
                  (this.isOverlapingSourceAndTarget = !1),
                  (this.vGraphObject = d),
                  (this.bendpoints = []),
                  (this.source = g),
                  (this.target = a));
              }
              i.prototype = Object.create(r.prototype);
              for (var o in r) i[o] = r[o];
              ((i.prototype.getSource = function () {
                return this.source;
              }),
                (i.prototype.getTarget = function () {
                  return this.target;
                }),
                (i.prototype.isInterGraph = function () {
                  return this.isInterGraph;
                }),
                (i.prototype.getLength = function () {
                  return this.length;
                }),
                (i.prototype.isOverlapingSourceAndTarget = function () {
                  return this.isOverlapingSourceAndTarget;
                }),
                (i.prototype.getBendpoints = function () {
                  return this.bendpoints;
                }),
                (i.prototype.getLca = function () {
                  return this.lca;
                }),
                (i.prototype.getSourceInLca = function () {
                  return this.sourceInLca;
                }),
                (i.prototype.getTargetInLca = function () {
                  return this.targetInLca;
                }),
                (i.prototype.getOtherEnd = function (g) {
                  if (this.source === g) return this.target;
                  if (this.target === g) return this.source;
                  throw "Node is not incident with this edge";
                }),
                (i.prototype.getOtherEndInGraph = function (g, a) {
                  for (var d = this.getOtherEnd(g), n = a.getGraphManager().getRoot(); ;) {
                    if (d.getOwner() == a) return d;
                    if (d.getOwner() == n) break;
                    d = d.getOwner().getParent();
                  }
                  return null;
                }),
                (i.prototype.updateLength = function () {
                  var g = new Array(4);
                  ((this.isOverlapingSourceAndTarget = t.getIntersection(
                    this.target.getRect(),
                    this.source.getRect(),
                    g,
                  )),
                    this.isOverlapingSourceAndTarget ||
                      ((this.lengthX = g[0] - g[2]),
                      (this.lengthY = g[1] - g[3]),
                      Math.abs(this.lengthX) < 1 && (this.lengthX = e.sign(this.lengthX)),
                      Math.abs(this.lengthY) < 1 && (this.lengthY = e.sign(this.lengthY)),
                      (this.length = Math.sqrt(this.lengthX * this.lengthX + this.lengthY * this.lengthY))));
                }),
                (i.prototype.updateLengthSimple = function () {
                  ((this.lengthX = this.target.getCenterX() - this.source.getCenterX()),
                    (this.lengthY = this.target.getCenterY() - this.source.getCenterY()),
                    Math.abs(this.lengthX) < 1 && (this.lengthX = e.sign(this.lengthX)),
                    Math.abs(this.lengthY) < 1 && (this.lengthY = e.sign(this.lengthY)),
                    (this.length = Math.sqrt(this.lengthX * this.lengthX + this.lengthY * this.lengthY)));
                }),
                (u.exports = i));
            },
            function (u, m, y) {
              function r(t) {
                this.vGraphObject = t;
              }
              u.exports = r;
            },
            function (u, m, y) {
              var r = y(2),
                t = y(10),
                e = y(13),
                i = y(0),
                o = y(16),
                g = y(4);
              function a(n, h, c, E) {
                (c == null && E == null && (E = h),
                  r.call(this, E),
                  n.graphManager != null && (n = n.graphManager),
                  (this.estimatedSize = t.MIN_VALUE),
                  (this.inclusionTreeDepth = t.MAX_VALUE),
                  (this.vGraphObject = E),
                  (this.edges = []),
                  (this.graphManager = n),
                  c != null && h != null ? (this.rect = new e(h.x, h.y, c.width, c.height)) : (this.rect = new e()));
              }
              a.prototype = Object.create(r.prototype);
              for (var d in r) a[d] = r[d];
              ((a.prototype.getEdges = function () {
                return this.edges;
              }),
                (a.prototype.getChild = function () {
                  return this.child;
                }),
                (a.prototype.getOwner = function () {
                  return this.owner;
                }),
                (a.prototype.getWidth = function () {
                  return this.rect.width;
                }),
                (a.prototype.setWidth = function (n) {
                  this.rect.width = n;
                }),
                (a.prototype.getHeight = function () {
                  return this.rect.height;
                }),
                (a.prototype.setHeight = function (n) {
                  this.rect.height = n;
                }),
                (a.prototype.getCenterX = function () {
                  return this.rect.x + this.rect.width / 2;
                }),
                (a.prototype.getCenterY = function () {
                  return this.rect.y + this.rect.height / 2;
                }),
                (a.prototype.getCenter = function () {
                  return new g(this.rect.x + this.rect.width / 2, this.rect.y + this.rect.height / 2);
                }),
                (a.prototype.getLocation = function () {
                  return new g(this.rect.x, this.rect.y);
                }),
                (a.prototype.getRect = function () {
                  return this.rect;
                }),
                (a.prototype.getDiagonal = function () {
                  return Math.sqrt(this.rect.width * this.rect.width + this.rect.height * this.rect.height);
                }),
                (a.prototype.getHalfTheDiagonal = function () {
                  return Math.sqrt(this.rect.height * this.rect.height + this.rect.width * this.rect.width) / 2;
                }),
                (a.prototype.setRect = function (n, h) {
                  ((this.rect.x = n.x),
                    (this.rect.y = n.y),
                    (this.rect.width = h.width),
                    (this.rect.height = h.height));
                }),
                (a.prototype.setCenter = function (n, h) {
                  ((this.rect.x = n - this.rect.width / 2), (this.rect.y = h - this.rect.height / 2));
                }),
                (a.prototype.setLocation = function (n, h) {
                  ((this.rect.x = n), (this.rect.y = h));
                }),
                (a.prototype.moveBy = function (n, h) {
                  ((this.rect.x += n), (this.rect.y += h));
                }),
                (a.prototype.getEdgeListToNode = function (n) {
                  var h = [],
                    c = this;
                  return (
                    c.edges.forEach(function (E) {
                      if (E.target == n) {
                        if (E.source != c) throw "Incorrect edge source!";
                        h.push(E);
                      }
                    }),
                    h
                  );
                }),
                (a.prototype.getEdgesBetween = function (n) {
                  var h = [],
                    c = this;
                  return (
                    c.edges.forEach(function (E) {
                      if (!(E.source == c || E.target == c)) throw "Incorrect edge source and/or target";
                      (E.target == n || E.source == n) && h.push(E);
                    }),
                    h
                  );
                }),
                (a.prototype.getNeighborsList = function () {
                  var n = new Set(),
                    h = this;
                  return (
                    h.edges.forEach(function (c) {
                      if (c.source == h) n.add(c.target);
                      else {
                        if (c.target != h) throw "Incorrect incidency!";
                        n.add(c.source);
                      }
                    }),
                    n
                  );
                }),
                (a.prototype.withChildren = function () {
                  var n = new Set(),
                    h,
                    c;
                  if ((n.add(this), this.child != null))
                    for (var E = this.child.getNodes(), T = 0; T < E.length; T++)
                      ((h = E[T]),
                        (c = h.withChildren()),
                        c.forEach(function (D) {
                          n.add(D);
                        }));
                  return n;
                }),
                (a.prototype.getNoOfChildren = function () {
                  var n = 0,
                    h;
                  if (this.child == null) n = 1;
                  else
                    for (var c = this.child.getNodes(), E = 0; E < c.length; E++)
                      ((h = c[E]), (n += h.getNoOfChildren()));
                  return (n == 0 && (n = 1), n);
                }),
                (a.prototype.getEstimatedSize = function () {
                  if (this.estimatedSize == t.MIN_VALUE) throw "assert failed";
                  return this.estimatedSize;
                }),
                (a.prototype.calcEstimatedSize = function () {
                  return this.child == null
                    ? (this.estimatedSize = (this.rect.width + this.rect.height) / 2)
                    : ((this.estimatedSize = this.child.calcEstimatedSize()),
                      (this.rect.width = this.estimatedSize),
                      (this.rect.height = this.estimatedSize),
                      this.estimatedSize);
                }),
                (a.prototype.scatter = function () {
                  var n,
                    h,
                    c = -i.INITIAL_WORLD_BOUNDARY,
                    E = i.INITIAL_WORLD_BOUNDARY;
                  n = i.WORLD_CENTER_X + o.nextDouble() * (E - c) + c;
                  var T = -i.INITIAL_WORLD_BOUNDARY,
                    D = i.INITIAL_WORLD_BOUNDARY;
                  ((h = i.WORLD_CENTER_Y + o.nextDouble() * (D - T) + T), (this.rect.x = n), (this.rect.y = h));
                }),
                (a.prototype.updateBounds = function () {
                  if (this.getChild() == null) throw "assert failed";
                  if (this.getChild().getNodes().length != 0) {
                    var n = this.getChild();
                    if (
                      (n.updateBounds(!0),
                      (this.rect.x = n.getLeft()),
                      (this.rect.y = n.getTop()),
                      this.setWidth(n.getRight() - n.getLeft()),
                      this.setHeight(n.getBottom() - n.getTop()),
                      i.NODE_DIMENSIONS_INCLUDE_LABELS)
                    ) {
                      var h = n.getRight() - n.getLeft(),
                        c = n.getBottom() - n.getTop();
                      (this.labelWidth > h &&
                        ((this.rect.x -= (this.labelWidth - h) / 2), this.setWidth(this.labelWidth)),
                        this.labelHeight > c &&
                          (this.labelPos == "center"
                            ? (this.rect.y -= (this.labelHeight - c) / 2)
                            : this.labelPos == "top" && (this.rect.y -= this.labelHeight - c),
                          this.setHeight(this.labelHeight)));
                    }
                  }
                }),
                (a.prototype.getInclusionTreeDepth = function () {
                  if (this.inclusionTreeDepth == t.MAX_VALUE) throw "assert failed";
                  return this.inclusionTreeDepth;
                }),
                (a.prototype.transform = function (n) {
                  var h = this.rect.x;
                  h > i.WORLD_BOUNDARY ? (h = i.WORLD_BOUNDARY) : h < -i.WORLD_BOUNDARY && (h = -i.WORLD_BOUNDARY);
                  var c = this.rect.y;
                  c > i.WORLD_BOUNDARY ? (c = i.WORLD_BOUNDARY) : c < -i.WORLD_BOUNDARY && (c = -i.WORLD_BOUNDARY);
                  var E = new g(h, c),
                    T = n.inverseTransformPoint(E);
                  this.setLocation(T.x, T.y);
                }),
                (a.prototype.getLeft = function () {
                  return this.rect.x;
                }),
                (a.prototype.getRight = function () {
                  return this.rect.x + this.rect.width;
                }),
                (a.prototype.getTop = function () {
                  return this.rect.y;
                }),
                (a.prototype.getBottom = function () {
                  return this.rect.y + this.rect.height;
                }),
                (a.prototype.getParent = function () {
                  return this.owner == null ? null : this.owner.getParent();
                }),
                (u.exports = a));
            },
            function (u, m, y) {
              function r(t, e) {
                t == null && e == null ? ((this.x = 0), (this.y = 0)) : ((this.x = t), (this.y = e));
              }
              ((r.prototype.getX = function () {
                return this.x;
              }),
                (r.prototype.getY = function () {
                  return this.y;
                }),
                (r.prototype.setX = function (t) {
                  this.x = t;
                }),
                (r.prototype.setY = function (t) {
                  this.y = t;
                }),
                (r.prototype.getDifference = function (t) {
                  return new DimensionD(this.x - t.x, this.y - t.y);
                }),
                (r.prototype.getCopy = function () {
                  return new r(this.x, this.y);
                }),
                (r.prototype.translate = function (t) {
                  return ((this.x += t.width), (this.y += t.height), this);
                }),
                (u.exports = r));
            },
            function (u, m, y) {
              var r = y(2),
                t = y(10),
                e = y(0),
                i = y(6),
                o = y(3),
                g = y(1),
                a = y(13),
                d = y(12),
                n = y(11);
              function h(E, T, D) {
                (r.call(this, D),
                  (this.estimatedSize = t.MIN_VALUE),
                  (this.margin = e.DEFAULT_GRAPH_MARGIN),
                  (this.edges = []),
                  (this.nodes = []),
                  (this.isConnected = !1),
                  (this.parent = E),
                  T != null && T instanceof i
                    ? (this.graphManager = T)
                    : T != null && T instanceof Layout && (this.graphManager = T.graphManager));
              }
              h.prototype = Object.create(r.prototype);
              for (var c in r) h[c] = r[c];
              ((h.prototype.getNodes = function () {
                return this.nodes;
              }),
                (h.prototype.getEdges = function () {
                  return this.edges;
                }),
                (h.prototype.getGraphManager = function () {
                  return this.graphManager;
                }),
                (h.prototype.getParent = function () {
                  return this.parent;
                }),
                (h.prototype.getLeft = function () {
                  return this.left;
                }),
                (h.prototype.getRight = function () {
                  return this.right;
                }),
                (h.prototype.getTop = function () {
                  return this.top;
                }),
                (h.prototype.getBottom = function () {
                  return this.bottom;
                }),
                (h.prototype.isConnected = function () {
                  return this.isConnected;
                }),
                (h.prototype.add = function (E, T, D) {
                  if (T == null && D == null) {
                    var L = E;
                    if (this.graphManager == null) throw "Graph has no graph mgr!";
                    if (this.getNodes().indexOf(L) > -1) throw "Node already in graph!";
                    return ((L.owner = this), this.getNodes().push(L), L);
                  } else {
                    var O = E;
                    if (!(this.getNodes().indexOf(T) > -1 && this.getNodes().indexOf(D) > -1))
                      throw "Source or target not in graph!";
                    if (!(T.owner == D.owner && T.owner == this)) throw "Both owners must be this graph!";
                    return T.owner != D.owner
                      ? null
                      : ((O.source = T),
                        (O.target = D),
                        (O.isInterGraph = !1),
                        this.getEdges().push(O),
                        T.edges.push(O),
                        D != T && D.edges.push(O),
                        O);
                  }
                }),
                (h.prototype.remove = function (E) {
                  var T = E;
                  if (E instanceof o) {
                    if (T == null) throw "Node is null!";
                    if (!(T.owner != null && T.owner == this)) throw "Owner graph is invalid!";
                    if (this.graphManager == null) throw "Owner graph manager is invalid!";
                    for (var D = T.edges.slice(), L, O = D.length, v = 0; v < O; v++)
                      ((L = D[v]), L.isInterGraph ? this.graphManager.remove(L) : L.source.owner.remove(L));
                    var N = this.nodes.indexOf(T);
                    if (N == -1) throw "Node not in owner node list!";
                    this.nodes.splice(N, 1);
                  } else if (E instanceof g) {
                    var L = E;
                    if (L == null) throw "Edge is null!";
                    if (!(L.source != null && L.target != null)) throw "Source and/or target is null!";
                    if (!(
                      L.source.owner != null &&
                      L.target.owner != null &&
                      L.source.owner == this &&
                      L.target.owner == this
                    ))
                      throw "Source and/or target owner is invalid!";
                    var s = L.source.edges.indexOf(L),
                      l = L.target.edges.indexOf(L);
                    if (!(s > -1 && l > -1)) throw "Source and/or target doesn't know this edge!";
                    (L.source.edges.splice(s, 1), L.target != L.source && L.target.edges.splice(l, 1));
                    var N = L.source.owner.getEdges().indexOf(L);
                    if (N == -1) throw "Not in owner's edge list!";
                    L.source.owner.getEdges().splice(N, 1);
                  }
                }),
                (h.prototype.updateLeftTop = function () {
                  for (
                    var E = t.MAX_VALUE, T = t.MAX_VALUE, D, L, O, v = this.getNodes(), N = v.length, s = 0;
                    s < N;
                    s++
                  ) {
                    var l = v[s];
                    ((D = l.getTop()), (L = l.getLeft()), E > D && (E = D), T > L && (T = L));
                  }
                  return E == t.MAX_VALUE
                    ? null
                    : (v[0].getParent().paddingLeft != null ? (O = v[0].getParent().paddingLeft) : (O = this.margin),
                      (this.left = T - O),
                      (this.top = E - O),
                      new d(this.left, this.top));
                }),
                (h.prototype.updateBounds = function (E) {
                  for (
                    var T = t.MAX_VALUE,
                      D = -t.MAX_VALUE,
                      L = t.MAX_VALUE,
                      O = -t.MAX_VALUE,
                      v,
                      N,
                      s,
                      l,
                      f,
                      p = this.nodes,
                      A = p.length,
                      C = 0;
                    C < A;
                    C++
                  ) {
                    var R = p[C];
                    (E && R.child != null && R.updateBounds(),
                      (v = R.getLeft()),
                      (N = R.getRight()),
                      (s = R.getTop()),
                      (l = R.getBottom()),
                      T > v && (T = v),
                      D < N && (D = N),
                      L > s && (L = s),
                      O < l && (O = l));
                  }
                  var x = new a(T, L, D - T, O - L);
                  (T == t.MAX_VALUE &&
                    ((this.left = this.parent.getLeft()),
                    (this.right = this.parent.getRight()),
                    (this.top = this.parent.getTop()),
                    (this.bottom = this.parent.getBottom())),
                    p[0].getParent().paddingLeft != null ? (f = p[0].getParent().paddingLeft) : (f = this.margin),
                    (this.left = x.x - f),
                    (this.right = x.x + x.width + f),
                    (this.top = x.y - f),
                    (this.bottom = x.y + x.height + f));
                }),
                (h.calculateBounds = function (E) {
                  for (
                    var T = t.MAX_VALUE,
                      D = -t.MAX_VALUE,
                      L = t.MAX_VALUE,
                      O = -t.MAX_VALUE,
                      v,
                      N,
                      s,
                      l,
                      f = E.length,
                      p = 0;
                    p < f;
                    p++
                  ) {
                    var A = E[p];
                    ((v = A.getLeft()),
                      (N = A.getRight()),
                      (s = A.getTop()),
                      (l = A.getBottom()),
                      T > v && (T = v),
                      D < N && (D = N),
                      L > s && (L = s),
                      O < l && (O = l));
                  }
                  var C = new a(T, L, D - T, O - L);
                  return C;
                }),
                (h.prototype.getInclusionTreeDepth = function () {
                  return this == this.graphManager.getRoot() ? 1 : this.parent.getInclusionTreeDepth();
                }),
                (h.prototype.getEstimatedSize = function () {
                  if (this.estimatedSize == t.MIN_VALUE) throw "assert failed";
                  return this.estimatedSize;
                }),
                (h.prototype.calcEstimatedSize = function () {
                  for (var E = 0, T = this.nodes, D = T.length, L = 0; L < D; L++) {
                    var O = T[L];
                    E += O.calcEstimatedSize();
                  }
                  return (
                    E == 0
                      ? (this.estimatedSize = e.EMPTY_COMPOUND_NODE_SIZE)
                      : (this.estimatedSize = E / Math.sqrt(this.nodes.length)),
                    this.estimatedSize
                  );
                }),
                (h.prototype.updateConnected = function () {
                  var E = this;
                  if (this.nodes.length == 0) {
                    this.isConnected = !0;
                    return;
                  }
                  var T = new n(),
                    D = new Set(),
                    L = this.nodes[0],
                    O,
                    v,
                    N = L.withChildren();
                  for (
                    N.forEach(function (C) {
                      (T.push(C), D.add(C));
                    });
                    T.length !== 0;
                  ) {
                    ((L = T.shift()), (O = L.getEdges()));
                    for (var s = O.length, l = 0; l < s; l++) {
                      var f = O[l];
                      if (((v = f.getOtherEndInGraph(L, this)), v != null && !D.has(v))) {
                        var p = v.withChildren();
                        p.forEach(function (C) {
                          (T.push(C), D.add(C));
                        });
                      }
                    }
                  }
                  if (((this.isConnected = !1), D.size >= this.nodes.length)) {
                    var A = 0;
                    (D.forEach(function (C) {
                      C.owner == E && A++;
                    }),
                      A == this.nodes.length && (this.isConnected = !0));
                  }
                }),
                (u.exports = h));
            },
            function (u, m, y) {
              var r,
                t = y(1);
              function e(i) {
                ((r = y(5)), (this.layout = i), (this.graphs = []), (this.edges = []));
              }
              ((e.prototype.addRoot = function () {
                var i = this.layout.newGraph(),
                  o = this.layout.newNode(null),
                  g = this.add(i, o);
                return (this.setRootGraph(g), this.rootGraph);
              }),
                (e.prototype.add = function (i, o, g, a, d) {
                  if (g == null && a == null && d == null) {
                    if (i == null) throw "Graph is null!";
                    if (o == null) throw "Parent node is null!";
                    if (this.graphs.indexOf(i) > -1) throw "Graph already in this graph mgr!";
                    if ((this.graphs.push(i), i.parent != null)) throw "Already has a parent!";
                    if (o.child != null) throw "Already has a child!";
                    return ((i.parent = o), (o.child = i), i);
                  } else {
                    ((d = g), (a = o), (g = i));
                    var n = a.getOwner(),
                      h = d.getOwner();
                    if (!(n != null && n.getGraphManager() == this)) throw "Source not in this graph mgr!";
                    if (!(h != null && h.getGraphManager() == this)) throw "Target not in this graph mgr!";
                    if (n == h) return ((g.isInterGraph = !1), n.add(g, a, d));
                    if (((g.isInterGraph = !0), (g.source = a), (g.target = d), this.edges.indexOf(g) > -1))
                      throw "Edge already in inter-graph edge list!";
                    if ((this.edges.push(g), !(g.source != null && g.target != null)))
                      throw "Edge source and/or target is null!";
                    if (!(g.source.edges.indexOf(g) == -1 && g.target.edges.indexOf(g) == -1))
                      throw "Edge already in source and/or target incidency list!";
                    return (g.source.edges.push(g), g.target.edges.push(g), g);
                  }
                }),
                (e.prototype.remove = function (i) {
                  if (i instanceof r) {
                    var o = i;
                    if (o.getGraphManager() != this) throw "Graph not in this graph mgr";
                    if (!(o == this.rootGraph || (o.parent != null && o.parent.graphManager == this)))
                      throw "Invalid parent node!";
                    var g = [];
                    g = g.concat(o.getEdges());
                    for (var a, d = g.length, n = 0; n < d; n++) ((a = g[n]), o.remove(a));
                    var h = [];
                    h = h.concat(o.getNodes());
                    var c;
                    d = h.length;
                    for (var n = 0; n < d; n++) ((c = h[n]), o.remove(c));
                    o == this.rootGraph && this.setRootGraph(null);
                    var E = this.graphs.indexOf(o);
                    (this.graphs.splice(E, 1), (o.parent = null));
                  } else if (i instanceof t) {
                    if (((a = i), a == null)) throw "Edge is null!";
                    if (!a.isInterGraph) throw "Not an inter-graph edge!";
                    if (!(a.source != null && a.target != null)) throw "Source and/or target is null!";
                    if (!(a.source.edges.indexOf(a) != -1 && a.target.edges.indexOf(a) != -1))
                      throw "Source and/or target doesn't know this edge!";
                    var E = a.source.edges.indexOf(a);
                    if (
                      (a.source.edges.splice(E, 1),
                      (E = a.target.edges.indexOf(a)),
                      a.target.edges.splice(E, 1),
                      !(a.source.owner != null && a.source.owner.getGraphManager() != null))
                    )
                      throw "Edge owner graph or owner graph manager is null!";
                    if (a.source.owner.getGraphManager().edges.indexOf(a) == -1)
                      throw "Not in owner graph manager's edge list!";
                    var E = a.source.owner.getGraphManager().edges.indexOf(a);
                    a.source.owner.getGraphManager().edges.splice(E, 1);
                  }
                }),
                (e.prototype.updateBounds = function () {
                  this.rootGraph.updateBounds(!0);
                }),
                (e.prototype.getGraphs = function () {
                  return this.graphs;
                }),
                (e.prototype.getAllNodes = function () {
                  if (this.allNodes == null) {
                    for (var i = [], o = this.getGraphs(), g = o.length, a = 0; a < g; a++)
                      i = i.concat(o[a].getNodes());
                    this.allNodes = i;
                  }
                  return this.allNodes;
                }),
                (e.prototype.resetAllNodes = function () {
                  this.allNodes = null;
                }),
                (e.prototype.resetAllEdges = function () {
                  this.allEdges = null;
                }),
                (e.prototype.resetAllNodesToApplyGravitation = function () {
                  this.allNodesToApplyGravitation = null;
                }),
                (e.prototype.getAllEdges = function () {
                  if (this.allEdges == null) {
                    var i = [],
                      o = this.getGraphs();
                    o.length;
                    for (var g = 0; g < o.length; g++) i = i.concat(o[g].getEdges());
                    ((i = i.concat(this.edges)), (this.allEdges = i));
                  }
                  return this.allEdges;
                }),
                (e.prototype.getAllNodesToApplyGravitation = function () {
                  return this.allNodesToApplyGravitation;
                }),
                (e.prototype.setAllNodesToApplyGravitation = function (i) {
                  if (this.allNodesToApplyGravitation != null) throw "assert failed";
                  this.allNodesToApplyGravitation = i;
                }),
                (e.prototype.getRoot = function () {
                  return this.rootGraph;
                }),
                (e.prototype.setRootGraph = function (i) {
                  if (i.getGraphManager() != this) throw "Root not in this graph mgr!";
                  ((this.rootGraph = i), i.parent == null && (i.parent = this.layout.newNode("Root node")));
                }),
                (e.prototype.getLayout = function () {
                  return this.layout;
                }),
                (e.prototype.isOneAncestorOfOther = function (i, o) {
                  if (!(i != null && o != null)) throw "assert failed";
                  if (i == o) return !0;
                  var g = i.getOwner(),
                    a;
                  do {
                    if (((a = g.getParent()), a == null)) break;
                    if (a == o) return !0;
                    if (((g = a.getOwner()), g == null)) break;
                  } while (!0);
                  g = o.getOwner();
                  do {
                    if (((a = g.getParent()), a == null)) break;
                    if (a == i) return !0;
                    if (((g = a.getOwner()), g == null)) break;
                  } while (!0);
                  return !1;
                }),
                (e.prototype.calcLowestCommonAncestors = function () {
                  for (var i, o, g, a, d, n = this.getAllEdges(), h = n.length, c = 0; c < h; c++) {
                    if (
                      ((i = n[c]),
                      (o = i.source),
                      (g = i.target),
                      (i.lca = null),
                      (i.sourceInLca = o),
                      (i.targetInLca = g),
                      o == g)
                    ) {
                      i.lca = o.getOwner();
                      continue;
                    }
                    for (a = o.getOwner(); i.lca == null;) {
                      for (i.targetInLca = g, d = g.getOwner(); i.lca == null;) {
                        if (d == a) {
                          i.lca = d;
                          break;
                        }
                        if (d == this.rootGraph) break;
                        if (i.lca != null) throw "assert failed";
                        ((i.targetInLca = d.getParent()), (d = i.targetInLca.getOwner()));
                      }
                      if (a == this.rootGraph) break;
                      i.lca == null && ((i.sourceInLca = a.getParent()), (a = i.sourceInLca.getOwner()));
                    }
                    if (i.lca == null) throw "assert failed";
                  }
                }),
                (e.prototype.calcLowestCommonAncestor = function (i, o) {
                  if (i == o) return i.getOwner();
                  var g = i.getOwner();
                  do {
                    if (g == null) break;
                    var a = o.getOwner();
                    do {
                      if (a == null) break;
                      if (a == g) return a;
                      a = a.getParent().getOwner();
                    } while (!0);
                    g = g.getParent().getOwner();
                  } while (!0);
                  return g;
                }),
                (e.prototype.calcInclusionTreeDepths = function (i, o) {
                  i == null && o == null && ((i = this.rootGraph), (o = 1));
                  for (var g, a = i.getNodes(), d = a.length, n = 0; n < d; n++)
                    ((g = a[n]),
                      (g.inclusionTreeDepth = o),
                      g.child != null && this.calcInclusionTreeDepths(g.child, o + 1));
                }),
                (e.prototype.includesInvalidEdge = function () {
                  for (var i, o = this.edges.length, g = 0; g < o; g++)
                    if (((i = this.edges[g]), this.isOneAncestorOfOther(i.source, i.target))) return !0;
                  return !1;
                }),
                (u.exports = e));
            },
            function (u, m, y) {
              var r = y(0);
              function t() {}
              for (var e in r) t[e] = r[e];
              ((t.MAX_ITERATIONS = 2500),
                (t.DEFAULT_EDGE_LENGTH = 50),
                (t.DEFAULT_SPRING_STRENGTH = 0.45),
                (t.DEFAULT_REPULSION_STRENGTH = 4500),
                (t.DEFAULT_GRAVITY_STRENGTH = 0.4),
                (t.DEFAULT_COMPOUND_GRAVITY_STRENGTH = 1),
                (t.DEFAULT_GRAVITY_RANGE_FACTOR = 3.8),
                (t.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = 1.5),
                (t.DEFAULT_USE_SMART_IDEAL_EDGE_LENGTH_CALCULATION = !0),
                (t.DEFAULT_USE_SMART_REPULSION_RANGE_CALCULATION = !0),
                (t.DEFAULT_COOLING_FACTOR_INCREMENTAL = 0.3),
                (t.COOLING_ADAPTATION_FACTOR = 0.33),
                (t.ADAPTATION_LOWER_NODE_LIMIT = 1e3),
                (t.ADAPTATION_UPPER_NODE_LIMIT = 5e3),
                (t.MAX_NODE_DISPLACEMENT_INCREMENTAL = 100),
                (t.MAX_NODE_DISPLACEMENT = t.MAX_NODE_DISPLACEMENT_INCREMENTAL * 3),
                (t.MIN_REPULSION_DIST = t.DEFAULT_EDGE_LENGTH / 10),
                (t.CONVERGENCE_CHECK_PERIOD = 100),
                (t.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = 0.1),
                (t.MIN_EDGE_LENGTH = 1),
                (t.GRID_CALCULATION_CHECK_PERIOD = 10),
                (u.exports = t));
            },
            function (u, m, y) {
              var r = y(12);
              function t() {}
              ((t.calcSeparationAmount = function (e, i, o, g) {
                if (!e.intersects(i)) throw "assert failed";
                var a = new Array(2);
                (this.decideDirectionsForOverlappingNodes(e, i, a),
                  (o[0] = Math.min(e.getRight(), i.getRight()) - Math.max(e.x, i.x)),
                  (o[1] = Math.min(e.getBottom(), i.getBottom()) - Math.max(e.y, i.y)),
                  e.getX() <= i.getX() && e.getRight() >= i.getRight()
                    ? (o[0] += Math.min(i.getX() - e.getX(), e.getRight() - i.getRight()))
                    : i.getX() <= e.getX() &&
                      i.getRight() >= e.getRight() &&
                      (o[0] += Math.min(e.getX() - i.getX(), i.getRight() - e.getRight())),
                  e.getY() <= i.getY() && e.getBottom() >= i.getBottom()
                    ? (o[1] += Math.min(i.getY() - e.getY(), e.getBottom() - i.getBottom()))
                    : i.getY() <= e.getY() &&
                      i.getBottom() >= e.getBottom() &&
                      (o[1] += Math.min(e.getY() - i.getY(), i.getBottom() - e.getBottom())));
                var d = Math.abs((i.getCenterY() - e.getCenterY()) / (i.getCenterX() - e.getCenterX()));
                i.getCenterY() === e.getCenterY() && i.getCenterX() === e.getCenterX() && (d = 1);
                var n = d * o[0],
                  h = o[1] / d;
                (o[0] < h ? (h = o[0]) : (n = o[1]),
                  (o[0] = -1 * a[0] * (h / 2 + g)),
                  (o[1] = -1 * a[1] * (n / 2 + g)));
              }),
                (t.decideDirectionsForOverlappingNodes = function (e, i, o) {
                  (e.getCenterX() < i.getCenterX() ? (o[0] = -1) : (o[0] = 1),
                    e.getCenterY() < i.getCenterY() ? (o[1] = -1) : (o[1] = 1));
                }),
                (t.getIntersection2 = function (e, i, o) {
                  var g = e.getCenterX(),
                    a = e.getCenterY(),
                    d = i.getCenterX(),
                    n = i.getCenterY();
                  if (e.intersects(i)) return ((o[0] = g), (o[1] = a), (o[2] = d), (o[3] = n), !0);
                  var h = e.getX(),
                    c = e.getY(),
                    E = e.getRight(),
                    T = e.getX(),
                    D = e.getBottom(),
                    L = e.getRight(),
                    O = e.getWidthHalf(),
                    v = e.getHeightHalf(),
                    N = i.getX(),
                    s = i.getY(),
                    l = i.getRight(),
                    f = i.getX(),
                    p = i.getBottom(),
                    A = i.getRight(),
                    C = i.getWidthHalf(),
                    R = i.getHeightHalf(),
                    x = !1,
                    _ = !1;
                  if (g === d) {
                    if (a > n) return ((o[0] = g), (o[1] = c), (o[2] = d), (o[3] = p), !1);
                    if (a < n) return ((o[0] = g), (o[1] = D), (o[2] = d), (o[3] = s), !1);
                  } else if (a === n) {
                    if (g > d) return ((o[0] = h), (o[1] = a), (o[2] = l), (o[3] = n), !1);
                    if (g < d) return ((o[0] = E), (o[1] = a), (o[2] = N), (o[3] = n), !1);
                  } else {
                    var U = e.height / e.width,
                      X = i.height / i.width,
                      M = (n - a) / (d - g),
                      S = void 0,
                      F = void 0,
                      b = void 0,
                      Y = void 0,
                      k = void 0,
                      H = void 0;
                    if (
                      (-U === M
                        ? g > d
                          ? ((o[0] = T), (o[1] = D), (x = !0))
                          : ((o[0] = E), (o[1] = c), (x = !0))
                        : U === M && (g > d ? ((o[0] = h), (o[1] = c), (x = !0)) : ((o[0] = L), (o[1] = D), (x = !0))),
                      -X === M
                        ? d > g
                          ? ((o[2] = f), (o[3] = p), (_ = !0))
                          : ((o[2] = l), (o[3] = s), (_ = !0))
                        : X === M && (d > g ? ((o[2] = N), (o[3] = s), (_ = !0)) : ((o[2] = A), (o[3] = p), (_ = !0))),
                      x && _)
                    )
                      return !1;
                    if (
                      (g > d
                        ? a > n
                          ? ((S = this.getCardinalDirection(U, M, 4)), (F = this.getCardinalDirection(X, M, 2)))
                          : ((S = this.getCardinalDirection(-U, M, 3)), (F = this.getCardinalDirection(-X, M, 1)))
                        : a > n
                          ? ((S = this.getCardinalDirection(-U, M, 1)), (F = this.getCardinalDirection(-X, M, 3)))
                          : ((S = this.getCardinalDirection(U, M, 2)), (F = this.getCardinalDirection(X, M, 4))),
                      !x)
                    )
                      switch (S) {
                        case 1:
                          ((Y = c), (b = g + -v / M), (o[0] = b), (o[1] = Y));
                          break;
                        case 2:
                          ((b = L), (Y = a + O * M), (o[0] = b), (o[1] = Y));
                          break;
                        case 3:
                          ((Y = D), (b = g + v / M), (o[0] = b), (o[1] = Y));
                          break;
                        case 4:
                          ((b = T), (Y = a + -O * M), (o[0] = b), (o[1] = Y));
                          break;
                      }
                    if (!_)
                      switch (F) {
                        case 1:
                          ((H = s), (k = d + -R / M), (o[2] = k), (o[3] = H));
                          break;
                        case 2:
                          ((k = A), (H = n + C * M), (o[2] = k), (o[3] = H));
                          break;
                        case 3:
                          ((H = p), (k = d + R / M), (o[2] = k), (o[3] = H));
                          break;
                        case 4:
                          ((k = f), (H = n + -C * M), (o[2] = k), (o[3] = H));
                          break;
                      }
                  }
                  return !1;
                }),
                (t.getCardinalDirection = function (e, i, o) {
                  return e > i ? o : 1 + (o % 4);
                }),
                (t.getIntersection = function (e, i, o, g) {
                  if (g == null) return this.getIntersection2(e, i, o);
                  var a = e.x,
                    d = e.y,
                    n = i.x,
                    h = i.y,
                    c = o.x,
                    E = o.y,
                    T = g.x,
                    D = g.y,
                    L = void 0,
                    O = void 0,
                    v = void 0,
                    N = void 0,
                    s = void 0,
                    l = void 0,
                    f = void 0,
                    p = void 0,
                    A = void 0;
                  return (
                    (v = h - d),
                    (s = a - n),
                    (f = n * d - a * h),
                    (N = D - E),
                    (l = c - T),
                    (p = T * E - c * D),
                    (A = v * l - N * s),
                    A === 0 ? null : ((L = (s * p - l * f) / A), (O = (N * f - v * p) / A), new r(L, O))
                  );
                }),
                (t.angleOfVector = function (e, i, o, g) {
                  var a = void 0;
                  return (
                    e !== o
                      ? ((a = Math.atan((g - i) / (o - e))), o < e ? (a += Math.PI) : g < i && (a += this.TWO_PI))
                      : g < i
                        ? (a = this.ONE_AND_HALF_PI)
                        : (a = this.HALF_PI),
                    a
                  );
                }),
                (t.doIntersect = function (e, i, o, g) {
                  var a = e.x,
                    d = e.y,
                    n = i.x,
                    h = i.y,
                    c = o.x,
                    E = o.y,
                    T = g.x,
                    D = g.y,
                    L = (n - a) * (D - E) - (T - c) * (h - d);
                  if (L === 0) return !1;
                  var O = ((D - E) * (T - a) + (c - T) * (D - d)) / L,
                    v = ((d - h) * (T - a) + (n - a) * (D - d)) / L;
                  return 0 < O && O < 1 && 0 < v && v < 1;
                }),
                (t.HALF_PI = 0.5 * Math.PI),
                (t.ONE_AND_HALF_PI = 1.5 * Math.PI),
                (t.TWO_PI = 2 * Math.PI),
                (t.THREE_PI = 3 * Math.PI),
                (u.exports = t));
            },
            function (u, m, y) {
              function r() {}
              ((r.sign = function (t) {
                return t > 0 ? 1 : t < 0 ? -1 : 0;
              }),
                (r.floor = function (t) {
                  return t < 0 ? Math.ceil(t) : Math.floor(t);
                }),
                (r.ceil = function (t) {
                  return t < 0 ? Math.floor(t) : Math.ceil(t);
                }),
                (u.exports = r));
            },
            function (u, m, y) {
              function r() {}
              ((r.MAX_VALUE = 2147483647), (r.MIN_VALUE = -2147483648), (u.exports = r));
            },
            function (u, m, y) {
              var r = (function () {
                function a(d, n) {
                  for (var h = 0; h < n.length; h++) {
                    var c = n[h];
                    ((c.enumerable = c.enumerable || !1),
                      (c.configurable = !0),
                      "value" in c && (c.writable = !0),
                      Object.defineProperty(d, c.key, c));
                  }
                }
                return function (d, n, h) {
                  return (n && a(d.prototype, n), h && a(d, h), d);
                };
              })();
              function t(a, d) {
                if (!(a instanceof d)) throw new TypeError("Cannot call a class as a function");
              }
              var e = function (d) {
                  return { value: d, next: null, prev: null };
                },
                i = function (d, n, h, c) {
                  return (
                    d !== null ? (d.next = n) : (c.head = n),
                    h !== null ? (h.prev = n) : (c.tail = n),
                    (n.prev = d),
                    (n.next = h),
                    c.length++,
                    n
                  );
                },
                o = function (d, n) {
                  var h = d.prev,
                    c = d.next;
                  return (
                    h !== null ? (h.next = c) : (n.head = c),
                    c !== null ? (c.prev = h) : (n.tail = h),
                    (d.prev = d.next = null),
                    n.length--,
                    d
                  );
                },
                g = (function () {
                  function a(d) {
                    var n = this;
                    (t(this, a),
                      (this.length = 0),
                      (this.head = null),
                      (this.tail = null),
                      d != null &&
                        d.forEach(function (h) {
                          return n.push(h);
                        }));
                  }
                  return (
                    r(a, [
                      {
                        key: "size",
                        value: function () {
                          return this.length;
                        },
                      },
                      {
                        key: "insertBefore",
                        value: function (n, h) {
                          return i(h.prev, e(n), h, this);
                        },
                      },
                      {
                        key: "insertAfter",
                        value: function (n, h) {
                          return i(h, e(n), h.next, this);
                        },
                      },
                      {
                        key: "insertNodeBefore",
                        value: function (n, h) {
                          return i(h.prev, n, h, this);
                        },
                      },
                      {
                        key: "insertNodeAfter",
                        value: function (n, h) {
                          return i(h, n, h.next, this);
                        },
                      },
                      {
                        key: "push",
                        value: function (n) {
                          return i(this.tail, e(n), null, this);
                        },
                      },
                      {
                        key: "unshift",
                        value: function (n) {
                          return i(null, e(n), this.head, this);
                        },
                      },
                      {
                        key: "remove",
                        value: function (n) {
                          return o(n, this);
                        },
                      },
                      {
                        key: "pop",
                        value: function () {
                          return o(this.tail, this).value;
                        },
                      },
                      {
                        key: "popNode",
                        value: function () {
                          return o(this.tail, this);
                        },
                      },
                      {
                        key: "shift",
                        value: function () {
                          return o(this.head, this).value;
                        },
                      },
                      {
                        key: "shiftNode",
                        value: function () {
                          return o(this.head, this);
                        },
                      },
                      {
                        key: "get_object_at",
                        value: function (n) {
                          if (n <= this.length()) {
                            for (var h = 1, c = this.head; h < n;) ((c = c.next), h++);
                            return c.value;
                          }
                        },
                      },
                      {
                        key: "set_object_at",
                        value: function (n, h) {
                          if (n <= this.length()) {
                            for (var c = 1, E = this.head; c < n;) ((E = E.next), c++);
                            E.value = h;
                          }
                        },
                      },
                    ]),
                    a
                  );
                })();
              u.exports = g;
            },
            function (u, m, y) {
              function r(t, e, i) {
                ((this.x = null),
                  (this.y = null),
                  t == null && e == null && i == null
                    ? ((this.x = 0), (this.y = 0))
                    : typeof t == "number" && typeof e == "number" && i == null
                      ? ((this.x = t), (this.y = e))
                      : t.constructor.name == "Point" &&
                        e == null &&
                        i == null &&
                        ((i = t), (this.x = i.x), (this.y = i.y)));
              }
              ((r.prototype.getX = function () {
                return this.x;
              }),
                (r.prototype.getY = function () {
                  return this.y;
                }),
                (r.prototype.getLocation = function () {
                  return new r(this.x, this.y);
                }),
                (r.prototype.setLocation = function (t, e, i) {
                  t.constructor.name == "Point" && e == null && i == null
                    ? ((i = t), this.setLocation(i.x, i.y))
                    : typeof t == "number" &&
                      typeof e == "number" &&
                      i == null &&
                      (parseInt(t) == t && parseInt(e) == e
                        ? this.move(t, e)
                        : ((this.x = Math.floor(t + 0.5)), (this.y = Math.floor(e + 0.5))));
                }),
                (r.prototype.move = function (t, e) {
                  ((this.x = t), (this.y = e));
                }),
                (r.prototype.translate = function (t, e) {
                  ((this.x += t), (this.y += e));
                }),
                (r.prototype.equals = function (t) {
                  if (t.constructor.name == "Point") {
                    var e = t;
                    return this.x == e.x && this.y == e.y;
                  }
                  return this == t;
                }),
                (r.prototype.toString = function () {
                  return new r().constructor.name + "[x=" + this.x + ",y=" + this.y + "]";
                }),
                (u.exports = r));
            },
            function (u, m, y) {
              function r(t, e, i, o) {
                ((this.x = 0),
                  (this.y = 0),
                  (this.width = 0),
                  (this.height = 0),
                  t != null &&
                    e != null &&
                    i != null &&
                    o != null &&
                    ((this.x = t), (this.y = e), (this.width = i), (this.height = o)));
              }
              ((r.prototype.getX = function () {
                return this.x;
              }),
                (r.prototype.setX = function (t) {
                  this.x = t;
                }),
                (r.prototype.getY = function () {
                  return this.y;
                }),
                (r.prototype.setY = function (t) {
                  this.y = t;
                }),
                (r.prototype.getWidth = function () {
                  return this.width;
                }),
                (r.prototype.setWidth = function (t) {
                  this.width = t;
                }),
                (r.prototype.getHeight = function () {
                  return this.height;
                }),
                (r.prototype.setHeight = function (t) {
                  this.height = t;
                }),
                (r.prototype.getRight = function () {
                  return this.x + this.width;
                }),
                (r.prototype.getBottom = function () {
                  return this.y + this.height;
                }),
                (r.prototype.intersects = function (t) {
                  return !(
                    this.getRight() < t.x ||
                    this.getBottom() < t.y ||
                    t.getRight() < this.x ||
                    t.getBottom() < this.y
                  );
                }),
                (r.prototype.getCenterX = function () {
                  return this.x + this.width / 2;
                }),
                (r.prototype.getMinX = function () {
                  return this.getX();
                }),
                (r.prototype.getMaxX = function () {
                  return this.getX() + this.width;
                }),
                (r.prototype.getCenterY = function () {
                  return this.y + this.height / 2;
                }),
                (r.prototype.getMinY = function () {
                  return this.getY();
                }),
                (r.prototype.getMaxY = function () {
                  return this.getY() + this.height;
                }),
                (r.prototype.getWidthHalf = function () {
                  return this.width / 2;
                }),
                (r.prototype.getHeightHalf = function () {
                  return this.height / 2;
                }),
                (u.exports = r));
            },
            function (u, m, y) {
              var r =
                typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
                  ? function (e) {
                      return typeof e;
                    }
                  : function (e) {
                      return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype
                        ? "symbol"
                        : typeof e;
                    };
              function t() {}
              ((t.lastID = 0),
                (t.createID = function (e) {
                  return t.isPrimitive(e)
                    ? e
                    : (e.uniqueID != null || ((e.uniqueID = t.getString()), t.lastID++), e.uniqueID);
                }),
                (t.getString = function (e) {
                  return (e == null && (e = t.lastID), "Object#" + e);
                }),
                (t.isPrimitive = function (e) {
                  var i = typeof e > "u" ? "undefined" : r(e);
                  return e == null || (i != "object" && i != "function");
                }),
                (u.exports = t));
            },
            function (u, m, y) {
              function r(c) {
                if (Array.isArray(c)) {
                  for (var E = 0, T = Array(c.length); E < c.length; E++) T[E] = c[E];
                  return T;
                } else return Array.from(c);
              }
              var t = y(0),
                e = y(6),
                i = y(3),
                o = y(1),
                g = y(5),
                a = y(4),
                d = y(17),
                n = y(27);
              function h(c) {
                (n.call(this),
                  (this.layoutQuality = t.QUALITY),
                  (this.createBendsAsNeeded = t.DEFAULT_CREATE_BENDS_AS_NEEDED),
                  (this.incremental = t.DEFAULT_INCREMENTAL),
                  (this.animationOnLayout = t.DEFAULT_ANIMATION_ON_LAYOUT),
                  (this.animationDuringLayout = t.DEFAULT_ANIMATION_DURING_LAYOUT),
                  (this.animationPeriod = t.DEFAULT_ANIMATION_PERIOD),
                  (this.uniformLeafNodeSizes = t.DEFAULT_UNIFORM_LEAF_NODE_SIZES),
                  (this.edgeToDummyNodes = new Map()),
                  (this.graphManager = new e(this)),
                  (this.isLayoutFinished = !1),
                  (this.isSubLayout = !1),
                  (this.isRemoteUse = !1),
                  c != null && (this.isRemoteUse = c));
              }
              ((h.RANDOM_SEED = 1),
                (h.prototype = Object.create(n.prototype)),
                (h.prototype.getGraphManager = function () {
                  return this.graphManager;
                }),
                (h.prototype.getAllNodes = function () {
                  return this.graphManager.getAllNodes();
                }),
                (h.prototype.getAllEdges = function () {
                  return this.graphManager.getAllEdges();
                }),
                (h.prototype.getAllNodesToApplyGravitation = function () {
                  return this.graphManager.getAllNodesToApplyGravitation();
                }),
                (h.prototype.newGraphManager = function () {
                  var c = new e(this);
                  return ((this.graphManager = c), c);
                }),
                (h.prototype.newGraph = function (c) {
                  return new g(null, this.graphManager, c);
                }),
                (h.prototype.newNode = function (c) {
                  return new i(this.graphManager, c);
                }),
                (h.prototype.newEdge = function (c) {
                  return new o(null, null, c);
                }),
                (h.prototype.checkLayoutSuccess = function () {
                  return (
                    this.graphManager.getRoot() == null ||
                    this.graphManager.getRoot().getNodes().length == 0 ||
                    this.graphManager.includesInvalidEdge()
                  );
                }),
                (h.prototype.runLayout = function () {
                  ((this.isLayoutFinished = !1), this.tilingPreLayout && this.tilingPreLayout(), this.initParameters());
                  var c;
                  return (
                    this.checkLayoutSuccess() ? (c = !1) : (c = this.layout()),
                    t.ANIMATE === "during"
                      ? !1
                      : (c && (this.isSubLayout || this.doPostLayout()),
                        this.tilingPostLayout && this.tilingPostLayout(),
                        (this.isLayoutFinished = !0),
                        c)
                  );
                }),
                (h.prototype.doPostLayout = function () {
                  (this.incremental || this.transform(), this.update());
                }),
                (h.prototype.update2 = function () {
                  if (
                    (this.createBendsAsNeeded &&
                      (this.createBendpointsFromDummyNodes(), this.graphManager.resetAllEdges()),
                    !this.isRemoteUse)
                  ) {
                    for (var c = this.graphManager.getAllEdges(), E = 0; E < c.length; E++) c[E];
                    for (var T = this.graphManager.getRoot().getNodes(), E = 0; E < T.length; E++) T[E];
                    this.update(this.graphManager.getRoot());
                  }
                }),
                (h.prototype.update = function (c) {
                  if (c == null) this.update2();
                  else if (c instanceof i) {
                    var E = c;
                    if (E.getChild() != null)
                      for (var T = E.getChild().getNodes(), D = 0; D < T.length; D++) update(T[D]);
                    if (E.vGraphObject != null) {
                      var L = E.vGraphObject;
                      L.update(E);
                    }
                  } else if (c instanceof o) {
                    var O = c;
                    if (O.vGraphObject != null) {
                      var v = O.vGraphObject;
                      v.update(O);
                    }
                  } else if (c instanceof g) {
                    var N = c;
                    if (N.vGraphObject != null) {
                      var s = N.vGraphObject;
                      s.update(N);
                    }
                  }
                }),
                (h.prototype.initParameters = function () {
                  (this.isSubLayout ||
                    ((this.layoutQuality = t.QUALITY),
                    (this.animationDuringLayout = t.DEFAULT_ANIMATION_DURING_LAYOUT),
                    (this.animationPeriod = t.DEFAULT_ANIMATION_PERIOD),
                    (this.animationOnLayout = t.DEFAULT_ANIMATION_ON_LAYOUT),
                    (this.incremental = t.DEFAULT_INCREMENTAL),
                    (this.createBendsAsNeeded = t.DEFAULT_CREATE_BENDS_AS_NEEDED),
                    (this.uniformLeafNodeSizes = t.DEFAULT_UNIFORM_LEAF_NODE_SIZES)),
                    this.animationDuringLayout && (this.animationOnLayout = !1));
                }),
                (h.prototype.transform = function (c) {
                  if (c == null) this.transform(new a(0, 0));
                  else {
                    var E = new d(),
                      T = this.graphManager.getRoot().updateLeftTop();
                    if (T != null) {
                      (E.setWorldOrgX(c.x), E.setWorldOrgY(c.y), E.setDeviceOrgX(T.x), E.setDeviceOrgY(T.y));
                      for (var D = this.getAllNodes(), L, O = 0; O < D.length; O++) ((L = D[O]), L.transform(E));
                    }
                  }
                }),
                (h.prototype.positionNodesRandomly = function (c) {
                  if (c == null)
                    (this.positionNodesRandomly(this.getGraphManager().getRoot()),
                      this.getGraphManager().getRoot().updateBounds(!0));
                  else
                    for (var E, T, D = c.getNodes(), L = 0; L < D.length; L++)
                      ((E = D[L]),
                        (T = E.getChild()),
                        T == null || T.getNodes().length == 0
                          ? E.scatter()
                          : (this.positionNodesRandomly(T), E.updateBounds()));
                }),
                (h.prototype.getFlatForest = function () {
                  for (var c = [], E = !0, T = this.graphManager.getRoot().getNodes(), D = !0, L = 0; L < T.length; L++)
                    T[L].getChild() != null && (D = !1);
                  if (!D) return c;
                  var O = new Set(),
                    v = [],
                    N = new Map(),
                    s = [];
                  for (s = s.concat(T); s.length > 0 && E;) {
                    for (v.push(s[0]); v.length > 0 && E;) {
                      var l = v[0];
                      (v.splice(0, 1), O.add(l));
                      for (var f = l.getEdges(), L = 0; L < f.length; L++) {
                        var p = f[L].getOtherEnd(l);
                        if (N.get(l) != p)
                          if (!O.has(p)) (v.push(p), N.set(p, l));
                          else {
                            E = !1;
                            break;
                          }
                      }
                    }
                    if (!E) c = [];
                    else {
                      var A = [].concat(r(O));
                      c.push(A);
                      for (var L = 0; L < A.length; L++) {
                        var C = A[L],
                          R = s.indexOf(C);
                        R > -1 && s.splice(R, 1);
                      }
                      ((O = new Set()), (N = new Map()));
                    }
                  }
                  return c;
                }),
                (h.prototype.createDummyNodesForBendpoints = function (c) {
                  for (
                    var E = [], T = c.source, D = this.graphManager.calcLowestCommonAncestor(c.source, c.target), L = 0;
                    L < c.bendpoints.length;
                    L++
                  ) {
                    var O = this.newNode(null);
                    (O.setRect(new Point(0, 0), new Dimension(1, 1)), D.add(O));
                    var v = this.newEdge(null);
                    (this.graphManager.add(v, T, O), E.add(O), (T = O));
                  }
                  var v = this.newEdge(null);
                  return (
                    this.graphManager.add(v, T, c.target),
                    this.edgeToDummyNodes.set(c, E),
                    c.isInterGraph() ? this.graphManager.remove(c) : D.remove(c),
                    E
                  );
                }),
                (h.prototype.createBendpointsFromDummyNodes = function () {
                  var c = [];
                  ((c = c.concat(this.graphManager.getAllEdges())),
                    (c = [].concat(r(this.edgeToDummyNodes.keys())).concat(c)));
                  for (var E = 0; E < c.length; E++) {
                    var T = c[E];
                    if (T.bendpoints.length > 0) {
                      for (var D = this.edgeToDummyNodes.get(T), L = 0; L < D.length; L++) {
                        var O = D[L],
                          v = new a(O.getCenterX(), O.getCenterY()),
                          N = T.bendpoints.get(L);
                        ((N.x = v.x), (N.y = v.y), O.getOwner().remove(O));
                      }
                      this.graphManager.add(T, T.source, T.target);
                    }
                  }
                }),
                (h.transform = function (c, E, T, D) {
                  if (T != null && D != null) {
                    var L = E;
                    if (c <= 50) {
                      var O = E / T;
                      L -= ((E - O) / 50) * (50 - c);
                    } else {
                      var v = E * D;
                      L += ((v - E) / 50) * (c - 50);
                    }
                    return L;
                  } else {
                    var N, s;
                    return (
                      c <= 50 ? ((N = (9 * E) / 500), (s = E / 10)) : ((N = (9 * E) / 50), (s = -8 * E)),
                      N * c + s
                    );
                  }
                }),
                (h.findCenterOfTree = function (c) {
                  var E = [];
                  E = E.concat(c);
                  var T = [],
                    D = new Map(),
                    L = !1,
                    O = null;
                  (E.length == 1 || E.length == 2) && ((L = !0), (O = E[0]));
                  for (var v = 0; v < E.length; v++) {
                    var N = E[v],
                      s = N.getNeighborsList().size;
                    (D.set(N, N.getNeighborsList().size), s == 1 && T.push(N));
                  }
                  var l = [];
                  for (l = l.concat(T); !L;) {
                    var f = [];
                    ((f = f.concat(l)), (l = []));
                    for (var v = 0; v < E.length; v++) {
                      var N = E[v],
                        p = E.indexOf(N);
                      p >= 0 && E.splice(p, 1);
                      var A = N.getNeighborsList();
                      A.forEach(function (x) {
                        if (T.indexOf(x) < 0) {
                          var _ = D.get(x),
                            U = _ - 1;
                          (U == 1 && l.push(x), D.set(x, U));
                        }
                      });
                    }
                    ((T = T.concat(l)), (E.length == 1 || E.length == 2) && ((L = !0), (O = E[0])));
                  }
                  return O;
                }),
                (h.prototype.setGraphManager = function (c) {
                  this.graphManager = c;
                }),
                (u.exports = h));
            },
            function (u, m, y) {
              function r() {}
              ((r.seed = 1),
                (r.x = 0),
                (r.nextDouble = function () {
                  return ((r.x = Math.sin(r.seed++) * 1e4), r.x - Math.floor(r.x));
                }),
                (u.exports = r));
            },
            function (u, m, y) {
              var r = y(4);
              function t(e, i) {
                ((this.lworldOrgX = 0),
                  (this.lworldOrgY = 0),
                  (this.ldeviceOrgX = 0),
                  (this.ldeviceOrgY = 0),
                  (this.lworldExtX = 1),
                  (this.lworldExtY = 1),
                  (this.ldeviceExtX = 1),
                  (this.ldeviceExtY = 1));
              }
              ((t.prototype.getWorldOrgX = function () {
                return this.lworldOrgX;
              }),
                (t.prototype.setWorldOrgX = function (e) {
                  this.lworldOrgX = e;
                }),
                (t.prototype.getWorldOrgY = function () {
                  return this.lworldOrgY;
                }),
                (t.prototype.setWorldOrgY = function (e) {
                  this.lworldOrgY = e;
                }),
                (t.prototype.getWorldExtX = function () {
                  return this.lworldExtX;
                }),
                (t.prototype.setWorldExtX = function (e) {
                  this.lworldExtX = e;
                }),
                (t.prototype.getWorldExtY = function () {
                  return this.lworldExtY;
                }),
                (t.prototype.setWorldExtY = function (e) {
                  this.lworldExtY = e;
                }),
                (t.prototype.getDeviceOrgX = function () {
                  return this.ldeviceOrgX;
                }),
                (t.prototype.setDeviceOrgX = function (e) {
                  this.ldeviceOrgX = e;
                }),
                (t.prototype.getDeviceOrgY = function () {
                  return this.ldeviceOrgY;
                }),
                (t.prototype.setDeviceOrgY = function (e) {
                  this.ldeviceOrgY = e;
                }),
                (t.prototype.getDeviceExtX = function () {
                  return this.ldeviceExtX;
                }),
                (t.prototype.setDeviceExtX = function (e) {
                  this.ldeviceExtX = e;
                }),
                (t.prototype.getDeviceExtY = function () {
                  return this.ldeviceExtY;
                }),
                (t.prototype.setDeviceExtY = function (e) {
                  this.ldeviceExtY = e;
                }),
                (t.prototype.transformX = function (e) {
                  var i = 0,
                    o = this.lworldExtX;
                  return (o != 0 && (i = this.ldeviceOrgX + ((e - this.lworldOrgX) * this.ldeviceExtX) / o), i);
                }),
                (t.prototype.transformY = function (e) {
                  var i = 0,
                    o = this.lworldExtY;
                  return (o != 0 && (i = this.ldeviceOrgY + ((e - this.lworldOrgY) * this.ldeviceExtY) / o), i);
                }),
                (t.prototype.inverseTransformX = function (e) {
                  var i = 0,
                    o = this.ldeviceExtX;
                  return (o != 0 && (i = this.lworldOrgX + ((e - this.ldeviceOrgX) * this.lworldExtX) / o), i);
                }),
                (t.prototype.inverseTransformY = function (e) {
                  var i = 0,
                    o = this.ldeviceExtY;
                  return (o != 0 && (i = this.lworldOrgY + ((e - this.ldeviceOrgY) * this.lworldExtY) / o), i);
                }),
                (t.prototype.inverseTransformPoint = function (e) {
                  var i = new r(this.inverseTransformX(e.x), this.inverseTransformY(e.y));
                  return i;
                }),
                (u.exports = t));
            },
            function (u, m, y) {
              function r(n) {
                if (Array.isArray(n)) {
                  for (var h = 0, c = Array(n.length); h < n.length; h++) c[h] = n[h];
                  return c;
                } else return Array.from(n);
              }
              var t = y(15),
                e = y(7),
                i = y(0),
                o = y(8),
                g = y(9);
              function a() {
                (t.call(this),
                  (this.useSmartIdealEdgeLengthCalculation = e.DEFAULT_USE_SMART_IDEAL_EDGE_LENGTH_CALCULATION),
                  (this.idealEdgeLength = e.DEFAULT_EDGE_LENGTH),
                  (this.springConstant = e.DEFAULT_SPRING_STRENGTH),
                  (this.repulsionConstant = e.DEFAULT_REPULSION_STRENGTH),
                  (this.gravityConstant = e.DEFAULT_GRAVITY_STRENGTH),
                  (this.compoundGravityConstant = e.DEFAULT_COMPOUND_GRAVITY_STRENGTH),
                  (this.gravityRangeFactor = e.DEFAULT_GRAVITY_RANGE_FACTOR),
                  (this.compoundGravityRangeFactor = e.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR),
                  (this.displacementThresholdPerNode = (3 * e.DEFAULT_EDGE_LENGTH) / 100),
                  (this.coolingFactor = e.DEFAULT_COOLING_FACTOR_INCREMENTAL),
                  (this.initialCoolingFactor = e.DEFAULT_COOLING_FACTOR_INCREMENTAL),
                  (this.totalDisplacement = 0),
                  (this.oldTotalDisplacement = 0),
                  (this.maxIterations = e.MAX_ITERATIONS));
              }
              a.prototype = Object.create(t.prototype);
              for (var d in t) a[d] = t[d];
              ((a.prototype.initParameters = function () {
                (t.prototype.initParameters.call(this, arguments),
                  (this.totalIterations = 0),
                  (this.notAnimatedIterations = 0),
                  (this.useFRGridVariant = e.DEFAULT_USE_SMART_REPULSION_RANGE_CALCULATION),
                  (this.grid = []));
              }),
                (a.prototype.calcIdealEdgeLengths = function () {
                  for (var n, h, c, E, T, D, L = this.getGraphManager().getAllEdges(), O = 0; O < L.length; O++)
                    ((n = L[O]),
                      (n.idealLength = this.idealEdgeLength),
                      n.isInterGraph &&
                        ((c = n.getSource()),
                        (E = n.getTarget()),
                        (T = n.getSourceInLca().getEstimatedSize()),
                        (D = n.getTargetInLca().getEstimatedSize()),
                        this.useSmartIdealEdgeLengthCalculation && (n.idealLength += T + D - 2 * i.SIMPLE_NODE_SIZE),
                        (h = n.getLca().getInclusionTreeDepth()),
                        (n.idealLength +=
                          e.DEFAULT_EDGE_LENGTH *
                          e.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR *
                          (c.getInclusionTreeDepth() + E.getInclusionTreeDepth() - 2 * h))));
                }),
                (a.prototype.initSpringEmbedder = function () {
                  var n = this.getAllNodes().length;
                  (this.incremental
                    ? (n > e.ADAPTATION_LOWER_NODE_LIMIT &&
                        (this.coolingFactor = Math.max(
                          this.coolingFactor * e.COOLING_ADAPTATION_FACTOR,
                          this.coolingFactor -
                            ((n - e.ADAPTATION_LOWER_NODE_LIMIT) /
                              (e.ADAPTATION_UPPER_NODE_LIMIT - e.ADAPTATION_LOWER_NODE_LIMIT)) *
                              this.coolingFactor *
                              (1 - e.COOLING_ADAPTATION_FACTOR),
                        )),
                      (this.maxNodeDisplacement = e.MAX_NODE_DISPLACEMENT_INCREMENTAL))
                    : (n > e.ADAPTATION_LOWER_NODE_LIMIT
                        ? (this.coolingFactor = Math.max(
                            e.COOLING_ADAPTATION_FACTOR,
                            1 -
                              ((n - e.ADAPTATION_LOWER_NODE_LIMIT) /
                                (e.ADAPTATION_UPPER_NODE_LIMIT - e.ADAPTATION_LOWER_NODE_LIMIT)) *
                                (1 - e.COOLING_ADAPTATION_FACTOR),
                          ))
                        : (this.coolingFactor = 1),
                      (this.initialCoolingFactor = this.coolingFactor),
                      (this.maxNodeDisplacement = e.MAX_NODE_DISPLACEMENT)),
                    (this.maxIterations = Math.max(this.getAllNodes().length * 5, this.maxIterations)),
                    (this.totalDisplacementThreshold = this.displacementThresholdPerNode * this.getAllNodes().length),
                    (this.repulsionRange = this.calcRepulsionRange()));
                }),
                (a.prototype.calcSpringForces = function () {
                  for (var n = this.getAllEdges(), h, c = 0; c < n.length; c++)
                    ((h = n[c]), this.calcSpringForce(h, h.idealLength));
                }),
                (a.prototype.calcRepulsionForces = function () {
                  var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0,
                    h = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
                    c,
                    E,
                    T,
                    D,
                    L = this.getAllNodes(),
                    O;
                  if (this.useFRGridVariant)
                    for (
                      this.totalIterations % e.GRID_CALCULATION_CHECK_PERIOD == 1 && n && this.updateGrid(),
                        O = new Set(),
                        c = 0;
                      c < L.length;
                      c++
                    )
                      ((T = L[c]), this.calculateRepulsionForceOfANode(T, O, n, h), O.add(T));
                  else
                    for (c = 0; c < L.length; c++)
                      for (T = L[c], E = c + 1; E < L.length; E++)
                        ((D = L[E]), T.getOwner() == D.getOwner() && this.calcRepulsionForce(T, D));
                }),
                (a.prototype.calcGravitationalForces = function () {
                  for (var n, h = this.getAllNodesToApplyGravitation(), c = 0; c < h.length; c++)
                    ((n = h[c]), this.calcGravitationalForce(n));
                }),
                (a.prototype.moveNodes = function () {
                  for (var n = this.getAllNodes(), h, c = 0; c < n.length; c++) ((h = n[c]), h.move());
                }),
                (a.prototype.calcSpringForce = function (n, h) {
                  var c = n.getSource(),
                    E = n.getTarget(),
                    T,
                    D,
                    L,
                    O;
                  if (this.uniformLeafNodeSizes && c.getChild() == null && E.getChild() == null) n.updateLengthSimple();
                  else if ((n.updateLength(), n.isOverlapingSourceAndTarget)) return;
                  ((T = n.getLength()),
                    T != 0 &&
                      ((D = this.springConstant * (T - h)),
                      (L = D * (n.lengthX / T)),
                      (O = D * (n.lengthY / T)),
                      (c.springForceX += L),
                      (c.springForceY += O),
                      (E.springForceX -= L),
                      (E.springForceY -= O)));
                }),
                (a.prototype.calcRepulsionForce = function (n, h) {
                  var c = n.getRect(),
                    E = h.getRect(),
                    T = new Array(2),
                    D = new Array(4),
                    L,
                    O,
                    v,
                    N,
                    s,
                    l,
                    f;
                  if (c.intersects(E)) {
                    (o.calcSeparationAmount(c, E, T, e.DEFAULT_EDGE_LENGTH / 2), (l = 2 * T[0]), (f = 2 * T[1]));
                    var p = (n.noOfChildren * h.noOfChildren) / (n.noOfChildren + h.noOfChildren);
                    ((n.repulsionForceX -= p * l),
                      (n.repulsionForceY -= p * f),
                      (h.repulsionForceX += p * l),
                      (h.repulsionForceY += p * f));
                  } else
                    (this.uniformLeafNodeSizes && n.getChild() == null && h.getChild() == null
                      ? ((L = E.getCenterX() - c.getCenterX()), (O = E.getCenterY() - c.getCenterY()))
                      : (o.getIntersection(c, E, D), (L = D[2] - D[0]), (O = D[3] - D[1])),
                      Math.abs(L) < e.MIN_REPULSION_DIST && (L = g.sign(L) * e.MIN_REPULSION_DIST),
                      Math.abs(O) < e.MIN_REPULSION_DIST && (O = g.sign(O) * e.MIN_REPULSION_DIST),
                      (v = L * L + O * O),
                      (N = Math.sqrt(v)),
                      (s = (this.repulsionConstant * n.noOfChildren * h.noOfChildren) / v),
                      (l = (s * L) / N),
                      (f = (s * O) / N),
                      (n.repulsionForceX -= l),
                      (n.repulsionForceY -= f),
                      (h.repulsionForceX += l),
                      (h.repulsionForceY += f));
                }),
                (a.prototype.calcGravitationalForce = function (n) {
                  var h, c, E, T, D, L, O, v;
                  ((h = n.getOwner()),
                    (c = (h.getRight() + h.getLeft()) / 2),
                    (E = (h.getTop() + h.getBottom()) / 2),
                    (T = n.getCenterX() - c),
                    (D = n.getCenterY() - E),
                    (L = Math.abs(T) + n.getWidth() / 2),
                    (O = Math.abs(D) + n.getHeight() / 2),
                    n.getOwner() == this.graphManager.getRoot()
                      ? ((v = h.getEstimatedSize() * this.gravityRangeFactor),
                        (L > v || O > v) &&
                          ((n.gravitationForceX = -this.gravityConstant * T),
                          (n.gravitationForceY = -this.gravityConstant * D)))
                      : ((v = h.getEstimatedSize() * this.compoundGravityRangeFactor),
                        (L > v || O > v) &&
                          ((n.gravitationForceX = -this.gravityConstant * T * this.compoundGravityConstant),
                          (n.gravitationForceY = -this.gravityConstant * D * this.compoundGravityConstant))));
                }),
                (a.prototype.isConverged = function () {
                  var n,
                    h = !1;
                  return (
                    this.totalIterations > this.maxIterations / 3 &&
                      (h = Math.abs(this.totalDisplacement - this.oldTotalDisplacement) < 2),
                    (n = this.totalDisplacement < this.totalDisplacementThreshold),
                    (this.oldTotalDisplacement = this.totalDisplacement),
                    n || h
                  );
                }),
                (a.prototype.animate = function () {
                  this.animationDuringLayout &&
                    !this.isSubLayout &&
                    (this.notAnimatedIterations == this.animationPeriod
                      ? (this.update(), (this.notAnimatedIterations = 0))
                      : this.notAnimatedIterations++);
                }),
                (a.prototype.calcNoOfChildrenForAllNodes = function () {
                  for (var n, h = this.graphManager.getAllNodes(), c = 0; c < h.length; c++)
                    ((n = h[c]), (n.noOfChildren = n.getNoOfChildren()));
                }),
                (a.prototype.calcGrid = function (n) {
                  var h = 0,
                    c = 0;
                  ((h = parseInt(Math.ceil((n.getRight() - n.getLeft()) / this.repulsionRange))),
                    (c = parseInt(Math.ceil((n.getBottom() - n.getTop()) / this.repulsionRange))));
                  for (var E = new Array(h), T = 0; T < h; T++) E[T] = new Array(c);
                  for (var T = 0; T < h; T++) for (var D = 0; D < c; D++) E[T][D] = new Array();
                  return E;
                }),
                (a.prototype.addNodeToGrid = function (n, h, c) {
                  var E = 0,
                    T = 0,
                    D = 0,
                    L = 0;
                  ((E = parseInt(Math.floor((n.getRect().x - h) / this.repulsionRange))),
                    (T = parseInt(Math.floor((n.getRect().width + n.getRect().x - h) / this.repulsionRange))),
                    (D = parseInt(Math.floor((n.getRect().y - c) / this.repulsionRange))),
                    (L = parseInt(Math.floor((n.getRect().height + n.getRect().y - c) / this.repulsionRange))));
                  for (var O = E; O <= T; O++)
                    for (var v = D; v <= L; v++) (this.grid[O][v].push(n), n.setGridCoordinates(E, T, D, L));
                }),
                (a.prototype.updateGrid = function () {
                  var n,
                    h,
                    c = this.getAllNodes();
                  for (this.grid = this.calcGrid(this.graphManager.getRoot()), n = 0; n < c.length; n++)
                    ((h = c[n]),
                      this.addNodeToGrid(
                        h,
                        this.graphManager.getRoot().getLeft(),
                        this.graphManager.getRoot().getTop(),
                      ));
                }),
                (a.prototype.calculateRepulsionForceOfANode = function (n, h, c, E) {
                  if ((this.totalIterations % e.GRID_CALCULATION_CHECK_PERIOD == 1 && c) || E) {
                    var T = new Set();
                    n.surrounding = new Array();
                    for (var D, L = this.grid, O = n.startX - 1; O < n.finishX + 2; O++)
                      for (var v = n.startY - 1; v < n.finishY + 2; v++)
                        if (!(O < 0 || v < 0 || O >= L.length || v >= L[0].length)) {
                          for (var N = 0; N < L[O][v].length; N++)
                            if (
                              ((D = L[O][v][N]), !(n.getOwner() != D.getOwner() || n == D) && !h.has(D) && !T.has(D))
                            ) {
                              var s = Math.abs(n.getCenterX() - D.getCenterX()) - (n.getWidth() / 2 + D.getWidth() / 2),
                                l = Math.abs(n.getCenterY() - D.getCenterY()) - (n.getHeight() / 2 + D.getHeight() / 2);
                              s <= this.repulsionRange && l <= this.repulsionRange && T.add(D);
                            }
                        }
                    n.surrounding = [].concat(r(T));
                  }
                  for (O = 0; O < n.surrounding.length; O++) this.calcRepulsionForce(n, n.surrounding[O]);
                }),
                (a.prototype.calcRepulsionRange = function () {
                  return 0;
                }),
                (u.exports = a));
            },
            function (u, m, y) {
              var r = y(1),
                t = y(7);
              function e(o, g, a) {
                (r.call(this, o, g, a), (this.idealLength = t.DEFAULT_EDGE_LENGTH));
              }
              e.prototype = Object.create(r.prototype);
              for (var i in r) e[i] = r[i];
              u.exports = e;
            },
            function (u, m, y) {
              var r = y(3);
              function t(i, o, g, a) {
                (r.call(this, i, o, g, a),
                  (this.springForceX = 0),
                  (this.springForceY = 0),
                  (this.repulsionForceX = 0),
                  (this.repulsionForceY = 0),
                  (this.gravitationForceX = 0),
                  (this.gravitationForceY = 0),
                  (this.displacementX = 0),
                  (this.displacementY = 0),
                  (this.startX = 0),
                  (this.finishX = 0),
                  (this.startY = 0),
                  (this.finishY = 0),
                  (this.surrounding = []));
              }
              t.prototype = Object.create(r.prototype);
              for (var e in r) t[e] = r[e];
              ((t.prototype.setGridCoordinates = function (i, o, g, a) {
                ((this.startX = i), (this.finishX = o), (this.startY = g), (this.finishY = a));
              }),
                (u.exports = t));
            },
            function (u, m, y) {
              function r(t, e) {
                ((this.width = 0),
                  (this.height = 0),
                  t !== null && e !== null && ((this.height = e), (this.width = t)));
              }
              ((r.prototype.getWidth = function () {
                return this.width;
              }),
                (r.prototype.setWidth = function (t) {
                  this.width = t;
                }),
                (r.prototype.getHeight = function () {
                  return this.height;
                }),
                (r.prototype.setHeight = function (t) {
                  this.height = t;
                }),
                (u.exports = r));
            },
            function (u, m, y) {
              var r = y(14);
              function t() {
                ((this.map = {}), (this.keys = []));
              }
              ((t.prototype.put = function (e, i) {
                var o = r.createID(e);
                this.contains(o) || ((this.map[o] = i), this.keys.push(e));
              }),
                (t.prototype.contains = function (e) {
                  return (r.createID(e), this.map[e] != null);
                }),
                (t.prototype.get = function (e) {
                  var i = r.createID(e);
                  return this.map[i];
                }),
                (t.prototype.keySet = function () {
                  return this.keys;
                }),
                (u.exports = t));
            },
            function (u, m, y) {
              var r = y(14);
              function t() {
                this.set = {};
              }
              ((t.prototype.add = function (e) {
                var i = r.createID(e);
                this.contains(i) || (this.set[i] = e);
              }),
                (t.prototype.remove = function (e) {
                  delete this.set[r.createID(e)];
                }),
                (t.prototype.clear = function () {
                  this.set = {};
                }),
                (t.prototype.contains = function (e) {
                  return this.set[r.createID(e)] == e;
                }),
                (t.prototype.isEmpty = function () {
                  return this.size() === 0;
                }),
                (t.prototype.size = function () {
                  return Object.keys(this.set).length;
                }),
                (t.prototype.addAllTo = function (e) {
                  for (var i = Object.keys(this.set), o = i.length, g = 0; g < o; g++) e.push(this.set[i[g]]);
                }),
                (t.prototype.size = function () {
                  return Object.keys(this.set).length;
                }),
                (t.prototype.addAll = function (e) {
                  for (var i = e.length, o = 0; o < i; o++) {
                    var g = e[o];
                    this.add(g);
                  }
                }),
                (u.exports = t));
            },
            function (u, m, y) {
              var r = (function () {
                function o(g, a) {
                  for (var d = 0; d < a.length; d++) {
                    var n = a[d];
                    ((n.enumerable = n.enumerable || !1),
                      (n.configurable = !0),
                      "value" in n && (n.writable = !0),
                      Object.defineProperty(g, n.key, n));
                  }
                }
                return function (g, a, d) {
                  return (a && o(g.prototype, a), d && o(g, d), g);
                };
              })();
              function t(o, g) {
                if (!(o instanceof g)) throw new TypeError("Cannot call a class as a function");
              }
              var e = y(11),
                i = (function () {
                  function o(g, a) {
                    (t(this, o), (a !== null || a !== void 0) && (this.compareFunction = this._defaultCompareFunction));
                    var d = void 0;
                    (g instanceof e ? (d = g.size()) : (d = g.length), this._quicksort(g, 0, d - 1));
                  }
                  return (
                    r(o, [
                      {
                        key: "_quicksort",
                        value: function (a, d, n) {
                          if (d < n) {
                            var h = this._partition(a, d, n);
                            (this._quicksort(a, d, h), this._quicksort(a, h + 1, n));
                          }
                        },
                      },
                      {
                        key: "_partition",
                        value: function (a, d, n) {
                          for (var h = this._get(a, d), c = d, E = n; ;) {
                            for (; this.compareFunction(h, this._get(a, E));) E--;
                            for (; this.compareFunction(this._get(a, c), h);) c++;
                            if (c < E) (this._swap(a, c, E), c++, E--);
                            else return E;
                          }
                        },
                      },
                      {
                        key: "_get",
                        value: function (a, d) {
                          return a instanceof e ? a.get_object_at(d) : a[d];
                        },
                      },
                      {
                        key: "_set",
                        value: function (a, d, n) {
                          a instanceof e ? a.set_object_at(d, n) : (a[d] = n);
                        },
                      },
                      {
                        key: "_swap",
                        value: function (a, d, n) {
                          var h = this._get(a, d);
                          (this._set(a, d, this._get(a, n)), this._set(a, n, h));
                        },
                      },
                      {
                        key: "_defaultCompareFunction",
                        value: function (a, d) {
                          return d > a;
                        },
                      },
                    ]),
                    o
                  );
                })();
              u.exports = i;
            },
            function (u, m, y) {
              var r = (function () {
                function i(o, g) {
                  for (var a = 0; a < g.length; a++) {
                    var d = g[a];
                    ((d.enumerable = d.enumerable || !1),
                      (d.configurable = !0),
                      "value" in d && (d.writable = !0),
                      Object.defineProperty(o, d.key, d));
                  }
                }
                return function (o, g, a) {
                  return (g && i(o.prototype, g), a && i(o, a), o);
                };
              })();
              function t(i, o) {
                if (!(i instanceof o)) throw new TypeError("Cannot call a class as a function");
              }
              var e = (function () {
                function i(o, g) {
                  var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1,
                    d = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : -1,
                    n = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : -1;
                  (t(this, i),
                    (this.sequence1 = o),
                    (this.sequence2 = g),
                    (this.match_score = a),
                    (this.mismatch_penalty = d),
                    (this.gap_penalty = n),
                    (this.iMax = o.length + 1),
                    (this.jMax = g.length + 1),
                    (this.grid = new Array(this.iMax)));
                  for (var h = 0; h < this.iMax; h++) {
                    this.grid[h] = new Array(this.jMax);
                    for (var c = 0; c < this.jMax; c++) this.grid[h][c] = 0;
                  }
                  this.tracebackGrid = new Array(this.iMax);
                  for (var E = 0; E < this.iMax; E++) {
                    this.tracebackGrid[E] = new Array(this.jMax);
                    for (var T = 0; T < this.jMax; T++) this.tracebackGrid[E][T] = [null, null, null];
                  }
                  ((this.alignments = []), (this.score = -1), this.computeGrids());
                }
                return (
                  r(i, [
                    {
                      key: "getScore",
                      value: function () {
                        return this.score;
                      },
                    },
                    {
                      key: "getAlignments",
                      value: function () {
                        return this.alignments;
                      },
                    },
                    {
                      key: "computeGrids",
                      value: function () {
                        for (var g = 1; g < this.jMax; g++)
                          ((this.grid[0][g] = this.grid[0][g - 1] + this.gap_penalty),
                            (this.tracebackGrid[0][g] = [!1, !1, !0]));
                        for (var a = 1; a < this.iMax; a++)
                          ((this.grid[a][0] = this.grid[a - 1][0] + this.gap_penalty),
                            (this.tracebackGrid[a][0] = [!1, !0, !1]));
                        for (var d = 1; d < this.iMax; d++)
                          for (var n = 1; n < this.jMax; n++) {
                            var h = void 0;
                            this.sequence1[d - 1] === this.sequence2[n - 1]
                              ? (h = this.grid[d - 1][n - 1] + this.match_score)
                              : (h = this.grid[d - 1][n - 1] + this.mismatch_penalty);
                            var c = this.grid[d - 1][n] + this.gap_penalty,
                              E = this.grid[d][n - 1] + this.gap_penalty,
                              T = [h, c, E],
                              D = this.arrayAllMaxIndexes(T);
                            ((this.grid[d][n] = T[D[0]]),
                              (this.tracebackGrid[d][n] = [D.includes(0), D.includes(1), D.includes(2)]));
                          }
                        this.score = this.grid[this.iMax - 1][this.jMax - 1];
                      },
                    },
                    {
                      key: "alignmentTraceback",
                      value: function () {
                        var g = [];
                        for (
                          g.push({ pos: [this.sequence1.length, this.sequence2.length], seq1: "", seq2: "" });
                          g[0];
                        ) {
                          var a = g[0],
                            d = this.tracebackGrid[a.pos[0]][a.pos[1]];
                          (d[0] &&
                            g.push({
                              pos: [a.pos[0] - 1, a.pos[1] - 1],
                              seq1: this.sequence1[a.pos[0] - 1] + a.seq1,
                              seq2: this.sequence2[a.pos[1] - 1] + a.seq2,
                            }),
                            d[1] &&
                              g.push({
                                pos: [a.pos[0] - 1, a.pos[1]],
                                seq1: this.sequence1[a.pos[0] - 1] + a.seq1,
                                seq2: "-" + a.seq2,
                              }),
                            d[2] &&
                              g.push({
                                pos: [a.pos[0], a.pos[1] - 1],
                                seq1: "-" + a.seq1,
                                seq2: this.sequence2[a.pos[1] - 1] + a.seq2,
                              }),
                            a.pos[0] === 0 &&
                              a.pos[1] === 0 &&
                              this.alignments.push({ sequence1: a.seq1, sequence2: a.seq2 }),
                            g.shift());
                        }
                        return this.alignments;
                      },
                    },
                    {
                      key: "getAllIndexes",
                      value: function (g, a) {
                        for (var d = [], n = -1; (n = g.indexOf(a, n + 1)) !== -1;) d.push(n);
                        return d;
                      },
                    },
                    {
                      key: "arrayAllMaxIndexes",
                      value: function (g) {
                        return this.getAllIndexes(g, Math.max.apply(null, g));
                      },
                    },
                  ]),
                  i
                );
              })();
              u.exports = e;
            },
            function (u, m, y) {
              var r = function () {};
              ((r.FDLayout = y(18)),
                (r.FDLayoutConstants = y(7)),
                (r.FDLayoutEdge = y(19)),
                (r.FDLayoutNode = y(20)),
                (r.DimensionD = y(21)),
                (r.HashMap = y(22)),
                (r.HashSet = y(23)),
                (r.IGeometry = y(8)),
                (r.IMath = y(9)),
                (r.Integer = y(10)),
                (r.Point = y(12)),
                (r.PointD = y(4)),
                (r.RandomSeed = y(16)),
                (r.RectangleD = y(13)),
                (r.Transform = y(17)),
                (r.UniqueIDGeneretor = y(14)),
                (r.Quicksort = y(24)),
                (r.LinkedList = y(11)),
                (r.LGraphObject = y(2)),
                (r.LGraph = y(5)),
                (r.LEdge = y(1)),
                (r.LGraphManager = y(6)),
                (r.LNode = y(3)),
                (r.Layout = y(15)),
                (r.LayoutConstants = y(0)),
                (r.NeedlemanWunsch = y(25)),
                (u.exports = r));
            },
            function (u, m, y) {
              function r() {
                this.listeners = [];
              }
              var t = r.prototype;
              ((t.addListener = function (e, i) {
                this.listeners.push({ event: e, callback: i });
              }),
                (t.removeListener = function (e, i) {
                  for (var o = this.listeners.length; o >= 0; o--) {
                    var g = this.listeners[o];
                    g.event === e && g.callback === i && this.listeners.splice(o, 1);
                  }
                }),
                (t.emit = function (e, i) {
                  for (var o = 0; o < this.listeners.length; o++) {
                    var g = this.listeners[o];
                    e === g.event && g.callback(i);
                  }
                }),
                (u.exports = r));
            },
          ]);
        });
      })(rt)),
    rt.exports
  );
}
var xt = et.exports,
  gt;
function wt() {
  return (
    gt ||
      ((gt = 1),
      (function (I, w) {
        (function (m, y) {
          I.exports = y(Rt());
        })(xt, function (u) {
          return (function (m) {
            var y = {};
            function r(t) {
              if (y[t]) return y[t].exports;
              var e = (y[t] = { i: t, l: !1, exports: {} });
              return (m[t].call(e.exports, e, e.exports, r), (e.l = !0), e.exports);
            }
            return (
              (r.m = m),
              (r.c = y),
              (r.i = function (t) {
                return t;
              }),
              (r.d = function (t, e, i) {
                r.o(t, e) || Object.defineProperty(t, e, { configurable: !1, enumerable: !0, get: i });
              }),
              (r.n = function (t) {
                var e =
                  t && t.__esModule
                    ? function () {
                        return t.default;
                      }
                    : function () {
                        return t;
                      };
                return (r.d(e, "a", e), e);
              }),
              (r.o = function (t, e) {
                return Object.prototype.hasOwnProperty.call(t, e);
              }),
              (r.p = ""),
              r((r.s = 7))
            );
          })([
            function (m, y) {
              m.exports = u;
            },
            function (m, y, r) {
              var t = r(0).FDLayoutConstants;
              function e() {}
              for (var i in t) e[i] = t[i];
              ((e.DEFAULT_USE_MULTI_LEVEL_SCALING = !1),
                (e.DEFAULT_RADIAL_SEPARATION = t.DEFAULT_EDGE_LENGTH),
                (e.DEFAULT_COMPONENT_SEPERATION = 60),
                (e.TILE = !0),
                (e.TILING_PADDING_VERTICAL = 10),
                (e.TILING_PADDING_HORIZONTAL = 10),
                (e.TREE_REDUCTION_ON_INCREMENTAL = !1),
                (m.exports = e));
            },
            function (m, y, r) {
              var t = r(0).FDLayoutEdge;
              function e(o, g, a) {
                t.call(this, o, g, a);
              }
              e.prototype = Object.create(t.prototype);
              for (var i in t) e[i] = t[i];
              m.exports = e;
            },
            function (m, y, r) {
              var t = r(0).LGraph;
              function e(o, g, a) {
                t.call(this, o, g, a);
              }
              e.prototype = Object.create(t.prototype);
              for (var i in t) e[i] = t[i];
              m.exports = e;
            },
            function (m, y, r) {
              var t = r(0).LGraphManager;
              function e(o) {
                t.call(this, o);
              }
              e.prototype = Object.create(t.prototype);
              for (var i in t) e[i] = t[i];
              m.exports = e;
            },
            function (m, y, r) {
              var t = r(0).FDLayoutNode,
                e = r(0).IMath;
              function i(g, a, d, n) {
                t.call(this, g, a, d, n);
              }
              i.prototype = Object.create(t.prototype);
              for (var o in t) i[o] = t[o];
              ((i.prototype.move = function () {
                var g = this.graphManager.getLayout();
                ((this.displacementX =
                  (g.coolingFactor * (this.springForceX + this.repulsionForceX + this.gravitationForceX)) /
                  this.noOfChildren),
                  (this.displacementY =
                    (g.coolingFactor * (this.springForceY + this.repulsionForceY + this.gravitationForceY)) /
                    this.noOfChildren),
                  Math.abs(this.displacementX) > g.coolingFactor * g.maxNodeDisplacement &&
                    (this.displacementX = g.coolingFactor * g.maxNodeDisplacement * e.sign(this.displacementX)),
                  Math.abs(this.displacementY) > g.coolingFactor * g.maxNodeDisplacement &&
                    (this.displacementY = g.coolingFactor * g.maxNodeDisplacement * e.sign(this.displacementY)),
                  this.child == null
                    ? this.moveBy(this.displacementX, this.displacementY)
                    : this.child.getNodes().length == 0
                      ? this.moveBy(this.displacementX, this.displacementY)
                      : this.propogateDisplacementToChildren(this.displacementX, this.displacementY),
                  (g.totalDisplacement += Math.abs(this.displacementX) + Math.abs(this.displacementY)),
                  (this.springForceX = 0),
                  (this.springForceY = 0),
                  (this.repulsionForceX = 0),
                  (this.repulsionForceY = 0),
                  (this.gravitationForceX = 0),
                  (this.gravitationForceY = 0),
                  (this.displacementX = 0),
                  (this.displacementY = 0));
              }),
                (i.prototype.propogateDisplacementToChildren = function (g, a) {
                  for (var d = this.getChild().getNodes(), n, h = 0; h < d.length; h++)
                    ((n = d[h]),
                      n.getChild() == null
                        ? (n.moveBy(g, a), (n.displacementX += g), (n.displacementY += a))
                        : n.propogateDisplacementToChildren(g, a));
                }),
                (i.prototype.setPred1 = function (g) {
                  this.pred1 = g;
                }),
                (i.prototype.getPred1 = function () {
                  return pred1;
                }),
                (i.prototype.getPred2 = function () {
                  return pred2;
                }),
                (i.prototype.setNext = function (g) {
                  this.next = g;
                }),
                (i.prototype.getNext = function () {
                  return next;
                }),
                (i.prototype.setProcessed = function (g) {
                  this.processed = g;
                }),
                (i.prototype.isProcessed = function () {
                  return processed;
                }),
                (m.exports = i));
            },
            function (m, y, r) {
              var t = r(0).FDLayout,
                e = r(4),
                i = r(3),
                o = r(5),
                g = r(2),
                a = r(1),
                d = r(0).FDLayoutConstants,
                n = r(0).LayoutConstants,
                h = r(0).Point,
                c = r(0).PointD,
                E = r(0).Layout,
                T = r(0).Integer,
                D = r(0).IGeometry,
                L = r(0).LGraph,
                O = r(0).Transform;
              function v() {
                (t.call(this), (this.toBeTiled = {}));
              }
              v.prototype = Object.create(t.prototype);
              for (var N in t) v[N] = t[N];
              ((v.prototype.newGraphManager = function () {
                var s = new e(this);
                return ((this.graphManager = s), s);
              }),
                (v.prototype.newGraph = function (s) {
                  return new i(null, this.graphManager, s);
                }),
                (v.prototype.newNode = function (s) {
                  return new o(this.graphManager, s);
                }),
                (v.prototype.newEdge = function (s) {
                  return new g(null, null, s);
                }),
                (v.prototype.initParameters = function () {
                  (t.prototype.initParameters.call(this, arguments),
                    this.isSubLayout ||
                      (a.DEFAULT_EDGE_LENGTH < 10
                        ? (this.idealEdgeLength = 10)
                        : (this.idealEdgeLength = a.DEFAULT_EDGE_LENGTH),
                      (this.useSmartIdealEdgeLengthCalculation = a.DEFAULT_USE_SMART_IDEAL_EDGE_LENGTH_CALCULATION),
                      (this.springConstant = d.DEFAULT_SPRING_STRENGTH),
                      (this.repulsionConstant = d.DEFAULT_REPULSION_STRENGTH),
                      (this.gravityConstant = d.DEFAULT_GRAVITY_STRENGTH),
                      (this.compoundGravityConstant = d.DEFAULT_COMPOUND_GRAVITY_STRENGTH),
                      (this.gravityRangeFactor = d.DEFAULT_GRAVITY_RANGE_FACTOR),
                      (this.compoundGravityRangeFactor = d.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR),
                      (this.prunedNodesAll = []),
                      (this.growTreeIterations = 0),
                      (this.afterGrowthIterations = 0),
                      (this.isTreeGrowing = !1),
                      (this.isGrowthFinished = !1),
                      (this.coolingCycle = 0),
                      (this.maxCoolingCycle = this.maxIterations / d.CONVERGENCE_CHECK_PERIOD),
                      (this.finalTemperature = d.CONVERGENCE_CHECK_PERIOD / this.maxIterations),
                      (this.coolingAdjuster = 1)));
                }),
                (v.prototype.layout = function () {
                  var s = n.DEFAULT_CREATE_BENDS_AS_NEEDED;
                  return (
                    s && (this.createBendpoints(), this.graphManager.resetAllEdges()),
                    (this.level = 0),
                    this.classicLayout()
                  );
                }),
                (v.prototype.classicLayout = function () {
                  if (
                    ((this.nodesWithGravity = this.calculateNodesToApplyGravitationTo()),
                    this.graphManager.setAllNodesToApplyGravitation(this.nodesWithGravity),
                    this.calcNoOfChildrenForAllNodes(),
                    this.graphManager.calcLowestCommonAncestors(),
                    this.graphManager.calcInclusionTreeDepths(),
                    this.graphManager.getRoot().calcEstimatedSize(),
                    this.calcIdealEdgeLengths(),
                    this.incremental)
                  ) {
                    if (a.TREE_REDUCTION_ON_INCREMENTAL) {
                      (this.reduceTrees(), this.graphManager.resetAllNodesToApplyGravitation());
                      var l = new Set(this.getAllNodes()),
                        f = this.nodesWithGravity.filter(function (C) {
                          return l.has(C);
                        });
                      this.graphManager.setAllNodesToApplyGravitation(f);
                    }
                  } else {
                    var s = this.getFlatForest();
                    if (s.length > 0) this.positionNodesRadially(s);
                    else {
                      (this.reduceTrees(), this.graphManager.resetAllNodesToApplyGravitation());
                      var l = new Set(this.getAllNodes()),
                        f = this.nodesWithGravity.filter(function (p) {
                          return l.has(p);
                        });
                      (this.graphManager.setAllNodesToApplyGravitation(f), this.positionNodesRandomly());
                    }
                  }
                  return (this.initSpringEmbedder(), this.runSpringEmbedder(), !0);
                }),
                (v.prototype.tick = function () {
                  if (
                    (this.totalIterations++,
                    this.totalIterations === this.maxIterations && !this.isTreeGrowing && !this.isGrowthFinished)
                  )
                    if (this.prunedNodesAll.length > 0) this.isTreeGrowing = !0;
                    else return !0;
                  if (
                    this.totalIterations % d.CONVERGENCE_CHECK_PERIOD == 0 &&
                    !this.isTreeGrowing &&
                    !this.isGrowthFinished
                  ) {
                    if (this.isConverged())
                      if (this.prunedNodesAll.length > 0) this.isTreeGrowing = !0;
                      else return !0;
                    (this.coolingCycle++,
                      this.layoutQuality == 0
                        ? (this.coolingAdjuster = this.coolingCycle)
                        : this.layoutQuality == 1 && (this.coolingAdjuster = this.coolingCycle / 3),
                      (this.coolingFactor = Math.max(
                        this.initialCoolingFactor -
                          (Math.pow(
                            this.coolingCycle,
                            Math.log(100 * (this.initialCoolingFactor - this.finalTemperature)) /
                              Math.log(this.maxCoolingCycle),
                          ) /
                            100) *
                            this.coolingAdjuster,
                        this.finalTemperature,
                      )),
                      (this.animationPeriod = Math.ceil(this.initialAnimationPeriod * Math.sqrt(this.coolingFactor))));
                  }
                  if (this.isTreeGrowing) {
                    if (this.growTreeIterations % 10 == 0)
                      if (this.prunedNodesAll.length > 0) {
                        (this.graphManager.updateBounds(),
                          this.updateGrid(),
                          this.growTree(this.prunedNodesAll),
                          this.graphManager.resetAllNodesToApplyGravitation());
                        var s = new Set(this.getAllNodes()),
                          l = this.nodesWithGravity.filter(function (A) {
                            return s.has(A);
                          });
                        (this.graphManager.setAllNodesToApplyGravitation(l),
                          this.graphManager.updateBounds(),
                          this.updateGrid(),
                          (this.coolingFactor = d.DEFAULT_COOLING_FACTOR_INCREMENTAL));
                      } else ((this.isTreeGrowing = !1), (this.isGrowthFinished = !0));
                    this.growTreeIterations++;
                  }
                  if (this.isGrowthFinished) {
                    if (this.isConverged()) return !0;
                    (this.afterGrowthIterations % 10 == 0 && (this.graphManager.updateBounds(), this.updateGrid()),
                      (this.coolingFactor =
                        d.DEFAULT_COOLING_FACTOR_INCREMENTAL * ((100 - this.afterGrowthIterations) / 100)),
                      this.afterGrowthIterations++);
                  }
                  var f = !this.isTreeGrowing && !this.isGrowthFinished,
                    p =
                      (this.growTreeIterations % 10 == 1 && this.isTreeGrowing) ||
                      (this.afterGrowthIterations % 10 == 1 && this.isGrowthFinished);
                  return (
                    (this.totalDisplacement = 0),
                    this.graphManager.updateBounds(),
                    this.calcSpringForces(),
                    this.calcRepulsionForces(f, p),
                    this.calcGravitationalForces(),
                    this.moveNodes(),
                    this.animate(),
                    !1
                  );
                }),
                (v.prototype.getPositionsData = function () {
                  for (var s = this.graphManager.getAllNodes(), l = {}, f = 0; f < s.length; f++) {
                    var p = s[f].rect,
                      A = s[f].id;
                    l[A] = { id: A, x: p.getCenterX(), y: p.getCenterY(), w: p.width, h: p.height };
                  }
                  return l;
                }),
                (v.prototype.runSpringEmbedder = function () {
                  ((this.initialAnimationPeriod = 25), (this.animationPeriod = this.initialAnimationPeriod));
                  var s = !1;
                  if (d.ANIMATE === "during") this.emit("layoutstarted");
                  else {
                    for (; !s;) s = this.tick();
                    this.graphManager.updateBounds();
                  }
                }),
                (v.prototype.calculateNodesToApplyGravitationTo = function () {
                  var s = [],
                    l,
                    f = this.graphManager.getGraphs(),
                    p = f.length,
                    A;
                  for (A = 0; A < p; A++)
                    ((l = f[A]), l.updateConnected(), l.isConnected || (s = s.concat(l.getNodes())));
                  return s;
                }),
                (v.prototype.createBendpoints = function () {
                  var s = [];
                  s = s.concat(this.graphManager.getAllEdges());
                  var l = new Set(),
                    f;
                  for (f = 0; f < s.length; f++) {
                    var p = s[f];
                    if (!l.has(p)) {
                      var A = p.getSource(),
                        C = p.getTarget();
                      if (A == C)
                        (p.getBendpoints().push(new c()),
                          p.getBendpoints().push(new c()),
                          this.createDummyNodesForBendpoints(p),
                          l.add(p));
                      else {
                        var R = [];
                        if (
                          ((R = R.concat(A.getEdgeListToNode(C))), (R = R.concat(C.getEdgeListToNode(A))), !l.has(R[0]))
                        ) {
                          if (R.length > 1) {
                            var x;
                            for (x = 0; x < R.length; x++) {
                              var _ = R[x];
                              (_.getBendpoints().push(new c()), this.createDummyNodesForBendpoints(_));
                            }
                          }
                          R.forEach(function (U) {
                            l.add(U);
                          });
                        }
                      }
                    }
                    if (l.size == s.length) break;
                  }
                }),
                (v.prototype.positionNodesRadially = function (s) {
                  for (
                    var l = new h(0, 0),
                      f = Math.ceil(Math.sqrt(s.length)),
                      p = 0,
                      A = 0,
                      C = 0,
                      R = new c(0, 0),
                      x = 0;
                    x < s.length;
                    x++
                  ) {
                    x % f == 0 && ((C = 0), (A = p), x != 0 && (A += a.DEFAULT_COMPONENT_SEPERATION), (p = 0));
                    var _ = s[x],
                      U = E.findCenterOfTree(_);
                    ((l.x = C),
                      (l.y = A),
                      (R = v.radialLayout(_, U, l)),
                      R.y > p && (p = Math.floor(R.y)),
                      (C = Math.floor(R.x + a.DEFAULT_COMPONENT_SEPERATION)));
                  }
                  this.transform(new c(n.WORLD_CENTER_X - R.x / 2, n.WORLD_CENTER_Y - R.y / 2));
                }),
                (v.radialLayout = function (s, l, f) {
                  var p = Math.max(this.maxDiagonalInTree(s), a.DEFAULT_RADIAL_SEPARATION);
                  v.branchRadialLayout(l, null, 0, 359, 0, p);
                  var A = L.calculateBounds(s),
                    C = new O();
                  (C.setDeviceOrgX(A.getMinX()),
                    C.setDeviceOrgY(A.getMinY()),
                    C.setWorldOrgX(f.x),
                    C.setWorldOrgY(f.y));
                  for (var R = 0; R < s.length; R++) {
                    var x = s[R];
                    x.transform(C);
                  }
                  var _ = new c(A.getMaxX(), A.getMaxY());
                  return C.inverseTransformPoint(_);
                }),
                (v.branchRadialLayout = function (s, l, f, p, A, C) {
                  var R = (p - f + 1) / 2;
                  R < 0 && (R += 180);
                  var x = (R + f) % 360,
                    _ = (x * D.TWO_PI) / 360,
                    U = A * Math.cos(_),
                    X = A * Math.sin(_);
                  s.setCenter(U, X);
                  var M = [];
                  M = M.concat(s.getEdges());
                  var S = M.length;
                  l != null && S--;
                  for (var F = 0, b = M.length, Y, k = s.getEdgesBetween(l); k.length > 1;) {
                    var H = k[0];
                    k.splice(0, 1);
                    var P = M.indexOf(H);
                    (P >= 0 && M.splice(P, 1), b--, S--);
                  }
                  l != null ? (Y = (M.indexOf(k[0]) + 1) % b) : (Y = 0);
                  for (var B = Math.abs(p - f) / S, $ = Y; F != S; $ = ++$ % b) {
                    var z = M[$].getOtherEnd(s);
                    if (z != l) {
                      var V = (f + F * B) % 360,
                        j = (V + B) % 360;
                      (v.branchRadialLayout(z, s, V, j, A + C, C), F++);
                    }
                  }
                }),
                (v.maxDiagonalInTree = function (s) {
                  for (var l = T.MIN_VALUE, f = 0; f < s.length; f++) {
                    var p = s[f],
                      A = p.getDiagonal();
                    A > l && (l = A);
                  }
                  return l;
                }),
                (v.prototype.calcRepulsionRange = function () {
                  return 2 * (this.level + 1) * this.idealEdgeLength;
                }),
                (v.prototype.groupZeroDegreeMembers = function () {
                  var s = this,
                    l = {};
                  ((this.memberGroups = {}), (this.idToDummyNode = {}));
                  for (var f = [], p = this.graphManager.getAllNodes(), A = 0; A < p.length; A++) {
                    var C = p[A],
                      R = C.getParent();
                    this.getNodeDegreeWithChildren(C) === 0 && (R.id == null || !this.getToBeTiled(R)) && f.push(C);
                  }
                  for (var A = 0; A < f.length; A++) {
                    var C = f[A],
                      x = C.getParent().id;
                    (typeof l[x] > "u" && (l[x] = []), (l[x] = l[x].concat(C)));
                  }
                  Object.keys(l).forEach(function (_) {
                    if (l[_].length > 1) {
                      var U = "DummyCompound_" + _;
                      s.memberGroups[U] = l[_];
                      var X = l[_][0].getParent(),
                        M = new o(s.graphManager);
                      ((M.id = U),
                        (M.paddingLeft = X.paddingLeft || 0),
                        (M.paddingRight = X.paddingRight || 0),
                        (M.paddingBottom = X.paddingBottom || 0),
                        (M.paddingTop = X.paddingTop || 0),
                        (s.idToDummyNode[U] = M));
                      var S = s.getGraphManager().add(s.newGraph(), M),
                        F = X.getChild();
                      F.add(M);
                      for (var b = 0; b < l[_].length; b++) {
                        var Y = l[_][b];
                        (F.remove(Y), S.add(Y));
                      }
                    }
                  });
                }),
                (v.prototype.clearCompounds = function () {
                  var s = {},
                    l = {};
                  this.performDFSOnCompounds();
                  for (var f = 0; f < this.compoundOrder.length; f++)
                    ((l[this.compoundOrder[f].id] = this.compoundOrder[f]),
                      (s[this.compoundOrder[f].id] = [].concat(this.compoundOrder[f].getChild().getNodes())),
                      this.graphManager.remove(this.compoundOrder[f].getChild()),
                      (this.compoundOrder[f].child = null));
                  (this.graphManager.resetAllNodes(), this.tileCompoundMembers(s, l));
                }),
                (v.prototype.clearZeroDegreeMembers = function () {
                  var s = this,
                    l = (this.tiledZeroDegreePack = []);
                  Object.keys(this.memberGroups).forEach(function (f) {
                    var p = s.idToDummyNode[f];
                    ((l[f] = s.tileNodes(s.memberGroups[f], p.paddingLeft + p.paddingRight)),
                      (p.rect.width = l[f].width),
                      (p.rect.height = l[f].height));
                  });
                }),
                (v.prototype.repopulateCompounds = function () {
                  for (var s = this.compoundOrder.length - 1; s >= 0; s--) {
                    var l = this.compoundOrder[s],
                      f = l.id,
                      p = l.paddingLeft,
                      A = l.paddingTop;
                    this.adjustLocations(this.tiledMemberPack[f], l.rect.x, l.rect.y, p, A);
                  }
                }),
                (v.prototype.repopulateZeroDegreeMembers = function () {
                  var s = this,
                    l = this.tiledZeroDegreePack;
                  Object.keys(l).forEach(function (f) {
                    var p = s.idToDummyNode[f],
                      A = p.paddingLeft,
                      C = p.paddingTop;
                    s.adjustLocations(l[f], p.rect.x, p.rect.y, A, C);
                  });
                }),
                (v.prototype.getToBeTiled = function (s) {
                  var l = s.id;
                  if (this.toBeTiled[l] != null) return this.toBeTiled[l];
                  var f = s.getChild();
                  if (f == null) return ((this.toBeTiled[l] = !1), !1);
                  for (var p = f.getNodes(), A = 0; A < p.length; A++) {
                    var C = p[A];
                    if (this.getNodeDegree(C) > 0) return ((this.toBeTiled[l] = !1), !1);
                    if (C.getChild() == null) {
                      this.toBeTiled[C.id] = !1;
                      continue;
                    }
                    if (!this.getToBeTiled(C)) return ((this.toBeTiled[l] = !1), !1);
                  }
                  return ((this.toBeTiled[l] = !0), !0);
                }),
                (v.prototype.getNodeDegree = function (s) {
                  s.id;
                  for (var l = s.getEdges(), f = 0, p = 0; p < l.length; p++) {
                    var A = l[p];
                    A.getSource().id !== A.getTarget().id && (f = f + 1);
                  }
                  return f;
                }),
                (v.prototype.getNodeDegreeWithChildren = function (s) {
                  var l = this.getNodeDegree(s);
                  if (s.getChild() == null) return l;
                  for (var f = s.getChild().getNodes(), p = 0; p < f.length; p++) {
                    var A = f[p];
                    l += this.getNodeDegreeWithChildren(A);
                  }
                  return l;
                }),
                (v.prototype.performDFSOnCompounds = function () {
                  ((this.compoundOrder = []), this.fillCompexOrderByDFS(this.graphManager.getRoot().getNodes()));
                }),
                (v.prototype.fillCompexOrderByDFS = function (s) {
                  for (var l = 0; l < s.length; l++) {
                    var f = s[l];
                    (f.getChild() != null && this.fillCompexOrderByDFS(f.getChild().getNodes()),
                      this.getToBeTiled(f) && this.compoundOrder.push(f));
                  }
                }),
                (v.prototype.adjustLocations = function (s, l, f, p, A) {
                  ((l += p), (f += A));
                  for (var C = l, R = 0; R < s.rows.length; R++) {
                    var x = s.rows[R];
                    l = C;
                    for (var _ = 0, U = 0; U < x.length; U++) {
                      var X = x[U];
                      ((X.rect.x = l),
                        (X.rect.y = f),
                        (l += X.rect.width + s.horizontalPadding),
                        X.rect.height > _ && (_ = X.rect.height));
                    }
                    f += _ + s.verticalPadding;
                  }
                }),
                (v.prototype.tileCompoundMembers = function (s, l) {
                  var f = this;
                  ((this.tiledMemberPack = []),
                    Object.keys(s).forEach(function (p) {
                      var A = l[p];
                      ((f.tiledMemberPack[p] = f.tileNodes(s[p], A.paddingLeft + A.paddingRight)),
                        (A.rect.width = f.tiledMemberPack[p].width),
                        (A.rect.height = f.tiledMemberPack[p].height));
                    }));
                }),
                (v.prototype.tileNodes = function (s, l) {
                  var f = a.TILING_PADDING_VERTICAL,
                    p = a.TILING_PADDING_HORIZONTAL,
                    A = {
                      rows: [],
                      rowWidth: [],
                      rowHeight: [],
                      width: 0,
                      height: l,
                      verticalPadding: f,
                      horizontalPadding: p,
                    };
                  s.sort(function (x, _) {
                    return x.rect.width * x.rect.height > _.rect.width * _.rect.height
                      ? -1
                      : x.rect.width * x.rect.height < _.rect.width * _.rect.height
                        ? 1
                        : 0;
                  });
                  for (var C = 0; C < s.length; C++) {
                    var R = s[C];
                    (A.rows.length == 0
                      ? this.insertNodeToRow(A, R, 0, l)
                      : this.canAddHorizontal(A, R.rect.width, R.rect.height)
                        ? this.insertNodeToRow(A, R, this.getShortestRowIndex(A), l)
                        : this.insertNodeToRow(A, R, A.rows.length, l),
                      this.shiftToLastRow(A));
                  }
                  return A;
                }),
                (v.prototype.insertNodeToRow = function (s, l, f, p) {
                  var A = p;
                  if (f == s.rows.length) {
                    var C = [];
                    (s.rows.push(C), s.rowWidth.push(A), s.rowHeight.push(0));
                  }
                  var R = s.rowWidth[f] + l.rect.width;
                  (s.rows[f].length > 0 && (R += s.horizontalPadding),
                    (s.rowWidth[f] = R),
                    s.width < R && (s.width = R));
                  var x = l.rect.height;
                  f > 0 && (x += s.verticalPadding);
                  var _ = 0;
                  (x > s.rowHeight[f] && ((_ = s.rowHeight[f]), (s.rowHeight[f] = x), (_ = s.rowHeight[f] - _)),
                    (s.height += _),
                    s.rows[f].push(l));
                }),
                (v.prototype.getShortestRowIndex = function (s) {
                  for (var l = -1, f = Number.MAX_VALUE, p = 0; p < s.rows.length; p++)
                    s.rowWidth[p] < f && ((l = p), (f = s.rowWidth[p]));
                  return l;
                }),
                (v.prototype.getLongestRowIndex = function (s) {
                  for (var l = -1, f = Number.MIN_VALUE, p = 0; p < s.rows.length; p++)
                    s.rowWidth[p] > f && ((l = p), (f = s.rowWidth[p]));
                  return l;
                }),
                (v.prototype.canAddHorizontal = function (s, l, f) {
                  var p = this.getShortestRowIndex(s);
                  if (p < 0) return !0;
                  var A = s.rowWidth[p];
                  if (A + s.horizontalPadding + l <= s.width) return !0;
                  var C = 0;
                  s.rowHeight[p] < f && p > 0 && (C = f + s.verticalPadding - s.rowHeight[p]);
                  var R;
                  (s.width - A >= l + s.horizontalPadding
                    ? (R = (s.height + C) / (A + l + s.horizontalPadding))
                    : (R = (s.height + C) / s.width),
                    (C = f + s.verticalPadding));
                  var x;
                  return (
                    s.width < l ? (x = (s.height + C) / l) : (x = (s.height + C) / s.width),
                    x < 1 && (x = 1 / x),
                    R < 1 && (R = 1 / R),
                    R < x
                  );
                }),
                (v.prototype.shiftToLastRow = function (s) {
                  var l = this.getLongestRowIndex(s),
                    f = s.rowWidth.length - 1,
                    p = s.rows[l],
                    A = p[p.length - 1],
                    C = A.width + s.horizontalPadding;
                  if (s.width - s.rowWidth[f] > C && l != f) {
                    (p.splice(-1, 1),
                      s.rows[f].push(A),
                      (s.rowWidth[l] = s.rowWidth[l] - C),
                      (s.rowWidth[f] = s.rowWidth[f] + C),
                      (s.width = s.rowWidth[instance.getLongestRowIndex(s)]));
                    for (var R = Number.MIN_VALUE, x = 0; x < p.length; x++) p[x].height > R && (R = p[x].height);
                    l > 0 && (R += s.verticalPadding);
                    var _ = s.rowHeight[l] + s.rowHeight[f];
                    ((s.rowHeight[l] = R),
                      s.rowHeight[f] < A.height + s.verticalPadding && (s.rowHeight[f] = A.height + s.verticalPadding));
                    var U = s.rowHeight[l] + s.rowHeight[f];
                    ((s.height += U - _), this.shiftToLastRow(s));
                  }
                }),
                (v.prototype.tilingPreLayout = function () {
                  a.TILE && (this.groupZeroDegreeMembers(), this.clearCompounds(), this.clearZeroDegreeMembers());
                }),
                (v.prototype.tilingPostLayout = function () {
                  a.TILE && (this.repopulateZeroDegreeMembers(), this.repopulateCompounds());
                }),
                (v.prototype.reduceTrees = function () {
                  for (var s = [], l = !0, f; l;) {
                    var p = this.graphManager.getAllNodes(),
                      A = [];
                    l = !1;
                    for (var C = 0; C < p.length; C++)
                      ((f = p[C]),
                        f.getEdges().length == 1 &&
                          !f.getEdges()[0].isInterGraph &&
                          f.getChild() == null &&
                          (A.push([f, f.getEdges()[0], f.getOwner()]), (l = !0)));
                    if (l == !0) {
                      for (var R = [], x = 0; x < A.length; x++)
                        A[x][0].getEdges().length == 1 && (R.push(A[x]), A[x][0].getOwner().remove(A[x][0]));
                      (s.push(R), this.graphManager.resetAllNodes(), this.graphManager.resetAllEdges());
                    }
                  }
                  this.prunedNodesAll = s;
                }),
                (v.prototype.growTree = function (s) {
                  for (var l = s.length, f = s[l - 1], p, A = 0; A < f.length; A++)
                    ((p = f[A]),
                      this.findPlaceforPrunedNode(p),
                      p[2].add(p[0]),
                      p[2].add(p[1], p[1].source, p[1].target));
                  (s.splice(s.length - 1, 1), this.graphManager.resetAllNodes(), this.graphManager.resetAllEdges());
                }),
                (v.prototype.findPlaceforPrunedNode = function (s) {
                  var l,
                    f,
                    p = s[0];
                  p == s[1].source ? (f = s[1].target) : (f = s[1].source);
                  var A = f.startX,
                    C = f.finishX,
                    R = f.startY,
                    x = f.finishY,
                    _ = 0,
                    U = 0,
                    X = 0,
                    M = 0,
                    S = [_, X, U, M];
                  if (R > 0)
                    for (var F = A; F <= C; F++) S[0] += this.grid[F][R - 1].length + this.grid[F][R].length - 1;
                  if (C < this.grid.length - 1)
                    for (var F = R; F <= x; F++) S[1] += this.grid[C + 1][F].length + this.grid[C][F].length - 1;
                  if (x < this.grid[0].length - 1)
                    for (var F = A; F <= C; F++) S[2] += this.grid[F][x + 1].length + this.grid[F][x].length - 1;
                  if (A > 0)
                    for (var F = R; F <= x; F++) S[3] += this.grid[A - 1][F].length + this.grid[A][F].length - 1;
                  for (var b = T.MAX_VALUE, Y, k, H = 0; H < S.length; H++)
                    S[H] < b ? ((b = S[H]), (Y = 1), (k = H)) : S[H] == b && Y++;
                  if (Y == 3 && b == 0)
                    S[0] == 0 && S[1] == 0 && S[2] == 0
                      ? (l = 1)
                      : S[0] == 0 && S[1] == 0 && S[3] == 0
                        ? (l = 0)
                        : S[0] == 0 && S[2] == 0 && S[3] == 0
                          ? (l = 3)
                          : S[1] == 0 && S[2] == 0 && S[3] == 0 && (l = 2);
                  else if (Y == 2 && b == 0) {
                    var P = Math.floor(Math.random() * 2);
                    S[0] == 0 && S[1] == 0
                      ? P == 0
                        ? (l = 0)
                        : (l = 1)
                      : S[0] == 0 && S[2] == 0
                        ? P == 0
                          ? (l = 0)
                          : (l = 2)
                        : S[0] == 0 && S[3] == 0
                          ? P == 0
                            ? (l = 0)
                            : (l = 3)
                          : S[1] == 0 && S[2] == 0
                            ? P == 0
                              ? (l = 1)
                              : (l = 2)
                            : S[1] == 0 && S[3] == 0
                              ? P == 0
                                ? (l = 1)
                                : (l = 3)
                              : P == 0
                                ? (l = 2)
                                : (l = 3);
                  } else if (Y == 4 && b == 0) {
                    var P = Math.floor(Math.random() * 4);
                    l = P;
                  } else l = k;
                  l == 0
                    ? p.setCenter(
                        f.getCenterX(),
                        f.getCenterY() - f.getHeight() / 2 - d.DEFAULT_EDGE_LENGTH - p.getHeight() / 2,
                      )
                    : l == 1
                      ? p.setCenter(
                          f.getCenterX() + f.getWidth() / 2 + d.DEFAULT_EDGE_LENGTH + p.getWidth() / 2,
                          f.getCenterY(),
                        )
                      : l == 2
                        ? p.setCenter(
                            f.getCenterX(),
                            f.getCenterY() + f.getHeight() / 2 + d.DEFAULT_EDGE_LENGTH + p.getHeight() / 2,
                          )
                        : p.setCenter(
                            f.getCenterX() - f.getWidth() / 2 - d.DEFAULT_EDGE_LENGTH - p.getWidth() / 2,
                            f.getCenterY(),
                          );
                }),
                (m.exports = v));
            },
            function (m, y, r) {
              var t = {};
              ((t.layoutBase = r(0)),
                (t.CoSEConstants = r(1)),
                (t.CoSEEdge = r(2)),
                (t.CoSEGraph = r(3)),
                (t.CoSEGraphManager = r(4)),
                (t.CoSELayout = r(6)),
                (t.CoSENode = r(5)),
                (m.exports = t));
            },
          ]);
        });
      })(et)),
    et.exports
  );
}
var Mt = tt.exports,
  ut;
function St() {
  return (
    ut ||
      ((ut = 1),
      (function (I, w) {
        (function (m, y) {
          I.exports = y(wt());
        })(Mt, function (u) {
          return (function (m) {
            var y = {};
            function r(t) {
              if (y[t]) return y[t].exports;
              var e = (y[t] = { i: t, l: !1, exports: {} });
              return (m[t].call(e.exports, e, e.exports, r), (e.l = !0), e.exports);
            }
            return (
              (r.m = m),
              (r.c = y),
              (r.i = function (t) {
                return t;
              }),
              (r.d = function (t, e, i) {
                r.o(t, e) || Object.defineProperty(t, e, { configurable: !1, enumerable: !0, get: i });
              }),
              (r.n = function (t) {
                var e =
                  t && t.__esModule
                    ? function () {
                        return t.default;
                      }
                    : function () {
                        return t;
                      };
                return (r.d(e, "a", e), e);
              }),
              (r.o = function (t, e) {
                return Object.prototype.hasOwnProperty.call(t, e);
              }),
              (r.p = ""),
              r((r.s = 1))
            );
          })([
            function (m, y) {
              m.exports = u;
            },
            function (m, y, r) {
              var t = r(0).layoutBase.LayoutConstants,
                e = r(0).layoutBase.FDLayoutConstants,
                i = r(0).CoSEConstants,
                o = r(0).CoSELayout,
                g = r(0).CoSENode,
                a = r(0).layoutBase.PointD,
                d = r(0).layoutBase.DimensionD,
                n = {
                  ready: function () {},
                  stop: function () {},
                  quality: "default",
                  nodeDimensionsIncludeLabels: !1,
                  refresh: 30,
                  fit: !0,
                  padding: 10,
                  randomize: !0,
                  nodeRepulsion: 4500,
                  idealEdgeLength: 50,
                  edgeElasticity: 0.45,
                  nestingFactor: 0.1,
                  gravity: 0.25,
                  numIter: 2500,
                  tile: !0,
                  animate: "end",
                  animationDuration: 500,
                  tilingPaddingVertical: 10,
                  tilingPaddingHorizontal: 10,
                  gravityRangeCompound: 1.5,
                  gravityCompound: 1,
                  gravityRange: 3.8,
                  initialEnergyOnIncremental: 0.5,
                };
              function h(D, L) {
                var O = {};
                for (var v in D) O[v] = D[v];
                for (var v in L) O[v] = L[v];
                return O;
              }
              function c(D) {
                ((this.options = h(n, D)), E(this.options));
              }
              var E = function (L) {
                (L.nodeRepulsion != null &&
                  (i.DEFAULT_REPULSION_STRENGTH = e.DEFAULT_REPULSION_STRENGTH = L.nodeRepulsion),
                  L.idealEdgeLength != null && (i.DEFAULT_EDGE_LENGTH = e.DEFAULT_EDGE_LENGTH = L.idealEdgeLength),
                  L.edgeElasticity != null &&
                    (i.DEFAULT_SPRING_STRENGTH = e.DEFAULT_SPRING_STRENGTH = L.edgeElasticity),
                  L.nestingFactor != null &&
                    (i.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = e.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = L.nestingFactor),
                  L.gravity != null && (i.DEFAULT_GRAVITY_STRENGTH = e.DEFAULT_GRAVITY_STRENGTH = L.gravity),
                  L.numIter != null && (i.MAX_ITERATIONS = e.MAX_ITERATIONS = L.numIter),
                  L.gravityRange != null &&
                    (i.DEFAULT_GRAVITY_RANGE_FACTOR = e.DEFAULT_GRAVITY_RANGE_FACTOR = L.gravityRange),
                  L.gravityCompound != null &&
                    (i.DEFAULT_COMPOUND_GRAVITY_STRENGTH = e.DEFAULT_COMPOUND_GRAVITY_STRENGTH = L.gravityCompound),
                  L.gravityRangeCompound != null &&
                    (i.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = e.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR =
                      L.gravityRangeCompound),
                  L.initialEnergyOnIncremental != null &&
                    (i.DEFAULT_COOLING_FACTOR_INCREMENTAL = e.DEFAULT_COOLING_FACTOR_INCREMENTAL =
                      L.initialEnergyOnIncremental),
                  L.quality == "draft" ? (t.QUALITY = 0) : L.quality == "proof" ? (t.QUALITY = 2) : (t.QUALITY = 1),
                  (i.NODE_DIMENSIONS_INCLUDE_LABELS =
                    e.NODE_DIMENSIONS_INCLUDE_LABELS =
                    t.NODE_DIMENSIONS_INCLUDE_LABELS =
                      L.nodeDimensionsIncludeLabels),
                  (i.DEFAULT_INCREMENTAL = e.DEFAULT_INCREMENTAL = t.DEFAULT_INCREMENTAL = !L.randomize),
                  (i.ANIMATE = e.ANIMATE = t.ANIMATE = L.animate),
                  (i.TILE = L.tile),
                  (i.TILING_PADDING_VERTICAL =
                    typeof L.tilingPaddingVertical == "function"
                      ? L.tilingPaddingVertical.call()
                      : L.tilingPaddingVertical),
                  (i.TILING_PADDING_HORIZONTAL =
                    typeof L.tilingPaddingHorizontal == "function"
                      ? L.tilingPaddingHorizontal.call()
                      : L.tilingPaddingHorizontal));
              };
              ((c.prototype.run = function () {
                var D,
                  L,
                  O = this.options;
                this.idToLNode = {};
                var v = (this.layout = new o()),
                  N = this;
                ((N.stopped = !1), (this.cy = this.options.cy), this.cy.trigger({ type: "layoutstart", layout: this }));
                var s = v.newGraphManager();
                this.gm = s;
                var l = this.options.eles.nodes(),
                  f = this.options.eles.edges();
                ((this.root = s.addRoot()), this.processChildrenList(this.root, this.getTopMostNodes(l), v));
                for (var p = 0; p < f.length; p++) {
                  var A = f[p],
                    C = this.idToLNode[A.data("source")],
                    R = this.idToLNode[A.data("target")];
                  if (C !== R && C.getEdgesBetween(R).length == 0) {
                    var x = s.add(v.newEdge(), C, R);
                    x.id = A.id();
                  }
                }
                var _ = function (M, S) {
                    typeof M == "number" && (M = S);
                    var F = M.data("id"),
                      b = N.idToLNode[F];
                    return { x: b.getRect().getCenterX(), y: b.getRect().getCenterY() };
                  },
                  U = function X() {
                    for (
                      var M = function () {
                          (O.fit && O.cy.fit(O.eles, O.padding),
                            D ||
                              ((D = !0),
                              N.cy.one("layoutready", O.ready),
                              N.cy.trigger({ type: "layoutready", layout: N })));
                        },
                        S = N.options.refresh,
                        F,
                        b = 0;
                      b < S && !F;
                      b++
                    )
                      F = N.stopped || N.layout.tick();
                    if (F) {
                      (v.checkLayoutSuccess() && !v.isSubLayout && v.doPostLayout(),
                        v.tilingPostLayout && v.tilingPostLayout(),
                        (v.isLayoutFinished = !0),
                        N.options.eles.nodes().positions(_),
                        M(),
                        N.cy.one("layoutstop", N.options.stop),
                        N.cy.trigger({ type: "layoutstop", layout: N }),
                        L && cancelAnimationFrame(L),
                        (D = !1));
                      return;
                    }
                    var Y = N.layout.getPositionsData();
                    (O.eles.nodes().positions(function (k, H) {
                      if ((typeof k == "number" && (k = H), !k.isParent())) {
                        for (
                          var P = k.id(), B = Y[P], $ = k;
                          B == null &&
                          ((B = Y[$.data("parent")] || Y["DummyCompound_" + $.data("parent")]),
                          (Y[P] = B),
                          ($ = $.parent()[0]),
                          $ != null);
                        );
                        return B != null ? { x: B.x, y: B.y } : { x: k.position("x"), y: k.position("y") };
                      }
                    }),
                      M(),
                      (L = requestAnimationFrame(X)));
                  };
                return (
                  v.addListener("layoutstarted", function () {
                    N.options.animate === "during" && (L = requestAnimationFrame(U));
                  }),
                  v.runLayout(),
                  this.options.animate !== "during" &&
                    (N.options.eles.nodes().not(":parent").layoutPositions(N, N.options, _), (D = !1)),
                  this
                );
              }),
                (c.prototype.getTopMostNodes = function (D) {
                  for (var L = {}, O = 0; O < D.length; O++) L[D[O].id()] = !0;
                  var v = D.filter(function (N, s) {
                    typeof N == "number" && (N = s);
                    for (var l = N.parent()[0]; l != null;) {
                      if (L[l.id()]) return !1;
                      l = l.parent()[0];
                    }
                    return !0;
                  });
                  return v;
                }),
                (c.prototype.processChildrenList = function (D, L, O) {
                  for (var v = L.length, N = 0; N < v; N++) {
                    var s = L[N],
                      l = s.children(),
                      f,
                      p = s.layoutDimensions({ nodeDimensionsIncludeLabels: this.options.nodeDimensionsIncludeLabels });
                    if (
                      (s.outerWidth() != null && s.outerHeight() != null
                        ? (f = D.add(
                            new g(
                              O.graphManager,
                              new a(s.position("x") - p.w / 2, s.position("y") - p.h / 2),
                              new d(parseFloat(p.w), parseFloat(p.h)),
                            ),
                          ))
                        : (f = D.add(new g(this.graphManager))),
                      (f.id = s.data("id")),
                      (f.paddingLeft = parseInt(s.css("padding"))),
                      (f.paddingTop = parseInt(s.css("padding"))),
                      (f.paddingRight = parseInt(s.css("padding"))),
                      (f.paddingBottom = parseInt(s.css("padding"))),
                      this.options.nodeDimensionsIncludeLabels && s.isParent())
                    ) {
                      var A = s.boundingBox({ includeLabels: !0, includeNodes: !1 }).w,
                        C = s.boundingBox({ includeLabels: !0, includeNodes: !1 }).h,
                        R = s.css("text-halign");
                      ((f.labelWidth = A), (f.labelHeight = C), (f.labelPos = R));
                    }
                    if (
                      ((this.idToLNode[s.data("id")] = f),
                      isNaN(f.rect.x) && (f.rect.x = 0),
                      isNaN(f.rect.y) && (f.rect.y = 0),
                      l != null && l.length > 0)
                    ) {
                      var x;
                      ((x = O.getGraphManager().add(O.newGraph(), f)), this.processChildrenList(x, l, O));
                    }
                  }
                }),
                (c.prototype.stop = function () {
                  return ((this.stopped = !0), this);
                }));
              var T = function (L) {
                L("layout", "cose-bilkent", c);
              };
              (typeof cytoscape < "u" && T(cytoscape), (m.exports = T));
            },
          ]);
        });
      })(tt)),
    tt.exports
  );
}
var _t = St();
const Gt = It(_t);
var at = (function () {
  var I = G(function (O, v, N, s) {
      for (N = N || {}, s = O.length; s--; N[O[s]] = v);
      return N;
    }, "o"),
    w = [1, 4],
    u = [1, 13],
    m = [1, 12],
    y = [1, 15],
    r = [1, 16],
    t = [1, 20],
    e = [1, 19],
    i = [6, 7, 8],
    o = [1, 26],
    g = [1, 24],
    a = [1, 25],
    d = [6, 7, 11],
    n = [1, 6, 13, 15, 16, 19, 22],
    h = [1, 33],
    c = [1, 34],
    E = [1, 6, 7, 11, 13, 15, 16, 19, 22],
    T = {
      trace: G(function () {}, "trace"),
      yy: {},
      symbols_: {
        error: 2,
        start: 3,
        mindMap: 4,
        spaceLines: 5,
        SPACELINE: 6,
        NL: 7,
        MINDMAP: 8,
        document: 9,
        stop: 10,
        EOF: 11,
        statement: 12,
        SPACELIST: 13,
        node: 14,
        ICON: 15,
        CLASS: 16,
        nodeWithId: 17,
        nodeWithoutId: 18,
        NODE_DSTART: 19,
        NODE_DESCR: 20,
        NODE_DEND: 21,
        NODE_ID: 22,
        $accept: 0,
        $end: 1,
      },
      terminals_: {
        2: "error",
        6: "SPACELINE",
        7: "NL",
        8: "MINDMAP",
        11: "EOF",
        13: "SPACELIST",
        15: "ICON",
        16: "CLASS",
        19: "NODE_DSTART",
        20: "NODE_DESCR",
        21: "NODE_DEND",
        22: "NODE_ID",
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
        [12, 2],
        [12, 2],
        [12, 2],
        [12, 1],
        [12, 1],
        [12, 1],
        [12, 1],
        [12, 1],
        [14, 1],
        [14, 1],
        [18, 3],
        [17, 1],
        [17, 4],
      ],
      performAction: G(function (v, N, s, l, f, p, A) {
        var C = p.length - 1;
        switch (f) {
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
            (l.getLogger().info("Node: ", p[C].id), l.addNode(p[C - 1].length, p[C].id, p[C].descr, p[C].type));
            break;
          case 16:
            (l.getLogger().trace("Icon: ", p[C]), l.decorateNode({ icon: p[C] }));
            break;
          case 17:
          case 21:
            l.decorateNode({ class: p[C] });
            break;
          case 18:
            l.getLogger().trace("SPACELIST");
            break;
          case 19:
            (l.getLogger().trace("Node: ", p[C].id), l.addNode(0, p[C].id, p[C].descr, p[C].type));
            break;
          case 20:
            l.decorateNode({ icon: p[C] });
            break;
          case 25:
            (l.getLogger().trace("node found ..", p[C - 2]),
              (this.$ = { id: p[C - 1], descr: p[C - 1], type: l.getType(p[C - 2], p[C]) }));
            break;
          case 26:
            this.$ = { id: p[C], descr: p[C], type: l.nodeType.DEFAULT };
            break;
          case 27:
            (l.getLogger().trace("node found ..", p[C - 3]),
              (this.$ = { id: p[C - 3], descr: p[C - 1], type: l.getType(p[C - 2], p[C]) }));
            break;
        }
      }, "anonymous"),
      table: [
        { 3: 1, 4: 2, 5: 3, 6: [1, 5], 8: w },
        { 1: [3] },
        { 1: [2, 1] },
        { 4: 6, 6: [1, 7], 7: [1, 8], 8: w },
        { 6: u, 7: [1, 10], 9: 9, 12: 11, 13: m, 14: 14, 15: y, 16: r, 17: 17, 18: 18, 19: t, 22: e },
        I(i, [2, 3]),
        { 1: [2, 2] },
        I(i, [2, 4]),
        I(i, [2, 5]),
        { 1: [2, 6], 6: u, 12: 21, 13: m, 14: 14, 15: y, 16: r, 17: 17, 18: 18, 19: t, 22: e },
        { 6: u, 9: 22, 12: 11, 13: m, 14: 14, 15: y, 16: r, 17: 17, 18: 18, 19: t, 22: e },
        { 6: o, 7: g, 10: 23, 11: a },
        I(d, [2, 22], { 17: 17, 18: 18, 14: 27, 15: [1, 28], 16: [1, 29], 19: t, 22: e }),
        I(d, [2, 18]),
        I(d, [2, 19]),
        I(d, [2, 20]),
        I(d, [2, 21]),
        I(d, [2, 23]),
        I(d, [2, 24]),
        I(d, [2, 26], { 19: [1, 30] }),
        { 20: [1, 31] },
        { 6: o, 7: g, 10: 32, 11: a },
        { 1: [2, 7], 6: u, 12: 21, 13: m, 14: 14, 15: y, 16: r, 17: 17, 18: 18, 19: t, 22: e },
        I(n, [2, 14], { 7: h, 11: c }),
        I(E, [2, 8]),
        I(E, [2, 9]),
        I(E, [2, 10]),
        I(d, [2, 15]),
        I(d, [2, 16]),
        I(d, [2, 17]),
        { 20: [1, 35] },
        { 21: [1, 36] },
        I(n, [2, 13], { 7: h, 11: c }),
        I(E, [2, 11]),
        I(E, [2, 12]),
        { 21: [1, 37] },
        I(d, [2, 25]),
        I(d, [2, 27]),
      ],
      defaultActions: { 2: [2, 1], 6: [2, 2] },
      parseError: G(function (v, N) {
        if (N.recoverable) this.trace(v);
        else {
          var s = new Error(v);
          throw ((s.hash = N), s);
        }
      }, "parseError"),
      parse: G(function (v) {
        var N = this,
          s = [0],
          l = [],
          f = [null],
          p = [],
          A = this.table,
          C = "",
          R = 0,
          x = 0,
          _ = 2,
          U = 1,
          X = p.slice.call(arguments, 1),
          M = Object.create(this.lexer),
          S = { yy: {} };
        for (var F in this.yy) Object.prototype.hasOwnProperty.call(this.yy, F) && (S.yy[F] = this.yy[F]);
        (M.setInput(v, S.yy), (S.yy.lexer = M), (S.yy.parser = this), typeof M.yylloc > "u" && (M.yylloc = {}));
        var b = M.yylloc;
        p.push(b);
        var Y = M.options && M.options.ranges;
        typeof S.yy.parseError == "function"
          ? (this.parseError = S.yy.parseError)
          : (this.parseError = Object.getPrototypeOf(this).parseError);
        function k(W) {
          ((s.length = s.length - 2 * W), (f.length = f.length - W), (p.length = p.length - W));
        }
        G(k, "popStack");
        function H() {
          var W;
          return (
            (W = l.pop() || M.lex() || U),
            typeof W != "number" && (W instanceof Array && ((l = W), (W = l.pop())), (W = N.symbols_[W] || W)),
            W
          );
        }
        G(H, "lex");
        for (var P, B, $, z, V = {}, j, Z, lt, q; ;) {
          if (
            ((B = s[s.length - 1]),
            this.defaultActions[B]
              ? ($ = this.defaultActions[B])
              : ((P === null || typeof P > "u") && (P = H()), ($ = A[B] && A[B][P])),
            typeof $ > "u" || !$.length || !$[0])
          ) {
            var nt = "";
            q = [];
            for (j in A[B]) this.terminals_[j] && j > _ && q.push("'" + this.terminals_[j] + "'");
            (M.showPosition
              ? (nt =
                  "Parse error on line " +
                  (R + 1) +
                  `:
` +
                  M.showPosition() +
                  `
Expecting ` +
                  q.join(", ") +
                  ", got '" +
                  (this.terminals_[P] || P) +
                  "'")
              : (nt =
                  "Parse error on line " +
                  (R + 1) +
                  ": Unexpected " +
                  (P == U ? "end of input" : "'" + (this.terminals_[P] || P) + "'")),
              this.parseError(nt, {
                text: M.match,
                token: this.terminals_[P] || P,
                line: M.yylineno,
                loc: b,
                expected: q,
              }));
          }
          if ($[0] instanceof Array && $.length > 1)
            throw new Error("Parse Error: multiple actions possible at state: " + B + ", token: " + P);
          switch ($[0]) {
            case 1:
              (s.push(P),
                f.push(M.yytext),
                p.push(M.yylloc),
                s.push($[1]),
                (P = null),
                (x = M.yyleng),
                (C = M.yytext),
                (R = M.yylineno),
                (b = M.yylloc));
              break;
            case 2:
              if (
                ((Z = this.productions_[$[1]][1]),
                (V.$ = f[f.length - Z]),
                (V._$ = {
                  first_line: p[p.length - (Z || 1)].first_line,
                  last_line: p[p.length - 1].last_line,
                  first_column: p[p.length - (Z || 1)].first_column,
                  last_column: p[p.length - 1].last_column,
                }),
                Y && (V._$.range = [p[p.length - (Z || 1)].range[0], p[p.length - 1].range[1]]),
                (z = this.performAction.apply(V, [C, x, R, S.yy, $[1], f, p].concat(X))),
                typeof z < "u")
              )
                return z;
              (Z && ((s = s.slice(0, -1 * Z * 2)), (f = f.slice(0, -1 * Z)), (p = p.slice(0, -1 * Z))),
                s.push(this.productions_[$[1]][0]),
                f.push(V.$),
                p.push(V._$),
                (lt = A[s[s.length - 2]][s[s.length - 1]]),
                s.push(lt));
              break;
            case 3:
              return !0;
          }
        }
        return !0;
      }, "parse"),
    },
    D = (function () {
      var O = {
        EOF: 1,
        parseError: G(function (N, s) {
          if (this.yy.parser) this.yy.parser.parseError(N, s);
          else throw new Error(N);
        }, "parseError"),
        setInput: G(function (v, N) {
          return (
            (this.yy = N || this.yy || {}),
            (this._input = v),
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
        input: G(function () {
          var v = this._input[0];
          ((this.yytext += v), this.yyleng++, this.offset++, (this.match += v), (this.matched += v));
          var N = v.match(/(?:\r\n?|\n).*/g);
          return (
            N ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++,
            this.options.ranges && this.yylloc.range[1]++,
            (this._input = this._input.slice(1)),
            v
          );
        }, "input"),
        unput: G(function (v) {
          var N = v.length,
            s = v.split(/(?:\r\n?|\n)/g);
          ((this._input = v + this._input),
            (this.yytext = this.yytext.substr(0, this.yytext.length - N)),
            (this.offset -= N));
          var l = this.match.split(/(?:\r\n?|\n)/g);
          ((this.match = this.match.substr(0, this.match.length - 1)),
            (this.matched = this.matched.substr(0, this.matched.length - 1)),
            s.length - 1 && (this.yylineno -= s.length - 1));
          var f = this.yylloc.range;
          return (
            (this.yylloc = {
              first_line: this.yylloc.first_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.first_column,
              last_column: s
                ? (s.length === l.length ? this.yylloc.first_column : 0) + l[l.length - s.length].length - s[0].length
                : this.yylloc.first_column - N,
            }),
            this.options.ranges && (this.yylloc.range = [f[0], f[0] + this.yyleng - N]),
            (this.yyleng = this.yytext.length),
            this
          );
        }, "unput"),
        more: G(function () {
          return ((this._more = !0), this);
        }, "more"),
        reject: G(function () {
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
        less: G(function (v) {
          this.unput(this.match.slice(v));
        }, "less"),
        pastInput: G(function () {
          var v = this.matched.substr(0, this.matched.length - this.match.length);
          return (v.length > 20 ? "..." : "") + v.substr(-20).replace(/\n/g, "");
        }, "pastInput"),
        upcomingInput: G(function () {
          var v = this.match;
          return (
            v.length < 20 && (v += this._input.substr(0, 20 - v.length)),
            (v.substr(0, 20) + (v.length > 20 ? "..." : "")).replace(/\n/g, "")
          );
        }, "upcomingInput"),
        showPosition: G(function () {
          var v = this.pastInput(),
            N = new Array(v.length + 1).join("-");
          return (
            v +
            this.upcomingInput() +
            `
` +
            N +
            "^"
          );
        }, "showPosition"),
        test_match: G(function (v, N) {
          var s, l, f;
          if (
            (this.options.backtrack_lexer &&
              ((f = {
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
              this.options.ranges && (f.yylloc.range = this.yylloc.range.slice(0))),
            (l = v[0].match(/(?:\r\n?|\n).*/g)),
            l && (this.yylineno += l.length),
            (this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: l
                ? l[l.length - 1].length - l[l.length - 1].match(/\r?\n?/)[0].length
                : this.yylloc.last_column + v[0].length,
            }),
            (this.yytext += v[0]),
            (this.match += v[0]),
            (this.matches = v),
            (this.yyleng = this.yytext.length),
            this.options.ranges && (this.yylloc.range = [this.offset, (this.offset += this.yyleng)]),
            (this._more = !1),
            (this._backtrack = !1),
            (this._input = this._input.slice(v[0].length)),
            (this.matched += v[0]),
            (s = this.performAction.call(this, this.yy, this, N, this.conditionStack[this.conditionStack.length - 1])),
            this.done && this._input && (this.done = !1),
            s)
          )
            return s;
          if (this._backtrack) {
            for (var p in f) this[p] = f[p];
            return !1;
          }
          return !1;
        }, "test_match"),
        next: G(function () {
          if (this.done) return this.EOF;
          this._input || (this.done = !0);
          var v, N, s, l;
          this._more || ((this.yytext = ""), (this.match = ""));
          for (var f = this._currentRules(), p = 0; p < f.length; p++)
            if (((s = this._input.match(this.rules[f[p]])), s && (!N || s[0].length > N[0].length))) {
              if (((N = s), (l = p), this.options.backtrack_lexer)) {
                if (((v = this.test_match(s, f[p])), v !== !1)) return v;
                if (this._backtrack) {
                  N = !1;
                  continue;
                } else return !1;
              } else if (!this.options.flex) break;
            }
          return N
            ? ((v = this.test_match(N, f[l])), v !== !1 ? v : !1)
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
        lex: G(function () {
          var N = this.next();
          return N || this.lex();
        }, "lex"),
        begin: G(function (N) {
          this.conditionStack.push(N);
        }, "begin"),
        popState: G(function () {
          var N = this.conditionStack.length - 1;
          return N > 0 ? this.conditionStack.pop() : this.conditionStack[0];
        }, "popState"),
        _currentRules: G(function () {
          return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]
            ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
            : this.conditions.INITIAL.rules;
        }, "_currentRules"),
        topState: G(function (N) {
          return ((N = this.conditionStack.length - 1 - Math.abs(N || 0)), N >= 0 ? this.conditionStack[N] : "INITIAL");
        }, "topState"),
        pushState: G(function (N) {
          this.begin(N);
        }, "pushState"),
        stateStackSize: G(function () {
          return this.conditionStack.length;
        }, "stateStackSize"),
        options: { "case-insensitive": !0 },
        performAction: G(function (N, s, l, f) {
          switch (l) {
            case 0:
              return (N.getLogger().trace("Found comment", s.yytext), 6);
            case 1:
              return 8;
            case 2:
              this.begin("CLASS");
              break;
            case 3:
              return (this.popState(), 16);
            case 4:
              this.popState();
              break;
            case 5:
              (N.getLogger().trace("Begin icon"), this.begin("ICON"));
              break;
            case 6:
              return (N.getLogger().trace("SPACELINE"), 6);
            case 7:
              return 7;
            case 8:
              return 15;
            case 9:
              (N.getLogger().trace("end icon"), this.popState());
              break;
            case 10:
              return (N.getLogger().trace("Exploding node"), this.begin("NODE"), 19);
            case 11:
              return (N.getLogger().trace("Cloud"), this.begin("NODE"), 19);
            case 12:
              return (N.getLogger().trace("Explosion Bang"), this.begin("NODE"), 19);
            case 13:
              return (N.getLogger().trace("Cloud Bang"), this.begin("NODE"), 19);
            case 14:
              return (this.begin("NODE"), 19);
            case 15:
              return (this.begin("NODE"), 19);
            case 16:
              return (this.begin("NODE"), 19);
            case 17:
              return (this.begin("NODE"), 19);
            case 18:
              return 13;
            case 19:
              return 22;
            case 20:
              return 11;
            case 21:
              this.begin("NSTR2");
              break;
            case 22:
              return "NODE_DESCR";
            case 23:
              this.popState();
              break;
            case 24:
              (N.getLogger().trace("Starting NSTR"), this.begin("NSTR"));
              break;
            case 25:
              return (N.getLogger().trace("description:", s.yytext), "NODE_DESCR");
            case 26:
              this.popState();
              break;
            case 27:
              return (this.popState(), N.getLogger().trace("node end ))"), "NODE_DEND");
            case 28:
              return (this.popState(), N.getLogger().trace("node end )"), "NODE_DEND");
            case 29:
              return (this.popState(), N.getLogger().trace("node end ...", s.yytext), "NODE_DEND");
            case 30:
              return (this.popState(), N.getLogger().trace("node end (("), "NODE_DEND");
            case 31:
              return (this.popState(), N.getLogger().trace("node end (-"), "NODE_DEND");
            case 32:
              return (this.popState(), N.getLogger().trace("node end (-"), "NODE_DEND");
            case 33:
              return (this.popState(), N.getLogger().trace("node end (("), "NODE_DEND");
            case 34:
              return (this.popState(), N.getLogger().trace("node end (("), "NODE_DEND");
            case 35:
              return (N.getLogger().trace("Long description:", s.yytext), 20);
            case 36:
              return (N.getLogger().trace("Long description:", s.yytext), 20);
          }
        }, "anonymous"),
        rules: [
          /^(?:\s*%%.*)/i,
          /^(?:mindmap\b)/i,
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
          /^(?:[^\(\[\n\)\{\}]+)/i,
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
          CLASS: { rules: [3, 4], inclusive: !1 },
          ICON: { rules: [8, 9], inclusive: !1 },
          NSTR2: { rules: [22, 23], inclusive: !1 },
          NSTR: { rules: [25, 26], inclusive: !1 },
          NODE: { rules: [21, 24, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], inclusive: !1 },
          INITIAL: { rules: [0, 1, 2, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], inclusive: !0 },
        },
      };
      return O;
    })();
  T.lexer = D;
  function L() {
    this.yy = {};
  }
  return (G(L, "Parser"), (L.prototype = T), (T.Parser = L), new L());
})();
at.parser = at;
var Ft = at,
  bt = { DEFAULT: 0, NO_BORDER: 0, ROUNDED_RECT: 1, RECT: 2, CIRCLE: 3, CLOUD: 4, BANG: 5, HEXAGON: 6 },
  K,
  Ut =
    ((K = class {
      constructor() {
        ((this.nodes = []),
          (this.count = 0),
          (this.elements = {}),
          (this.getLogger = this.getLogger.bind(this)),
          (this.nodeType = bt),
          this.clear(),
          (this.getType = this.getType.bind(this)),
          (this.getMindmap = this.getMindmap.bind(this)),
          (this.getElementById = this.getElementById.bind(this)),
          (this.getParent = this.getParent.bind(this)),
          (this.getMindmap = this.getMindmap.bind(this)),
          (this.addNode = this.addNode.bind(this)),
          (this.decorateNode = this.decorateNode.bind(this)));
      }
      clear() {
        ((this.nodes = []), (this.count = 0), (this.elements = {}));
      }
      getParent(w) {
        for (let u = this.nodes.length - 1; u >= 0; u--) if (this.nodes[u].level < w) return this.nodes[u];
        return null;
      }
      getMindmap() {
        return this.nodes.length > 0 ? this.nodes[0] : null;
      }
      addNode(w, u, m, y) {
        var o, g, a, d;
        Q.info("addNode", w, u, m, y);
        const r = st();
        let t = (g = (o = r.mindmap) == null ? void 0 : o.padding) != null ? g : it.mindmap.padding;
        switch (y) {
          case this.nodeType.ROUNDED_RECT:
          case this.nodeType.RECT:
          case this.nodeType.HEXAGON:
            t *= 2;
            break;
        }
        const e = {
            id: this.count++,
            nodeId: J(u, r),
            level: w,
            descr: J(m, r),
            type: y,
            children: [],
            width: (d = (a = r.mindmap) == null ? void 0 : a.maxNodeWidth) != null ? d : it.mindmap.maxNodeWidth,
            padding: t,
          },
          i = this.getParent(w);
        if (i) (i.children.push(e), this.nodes.push(e));
        else if (this.nodes.length === 0) this.nodes.push(e);
        else throw new Error(`There can be only one root. No parent could be found for ("${e.descr}")`);
      }
      getType(w, u) {
        switch ((Q.debug("In get type", w, u), w)) {
          case "[":
            return this.nodeType.RECT;
          case "(":
            return u === ")" ? this.nodeType.ROUNDED_RECT : this.nodeType.CLOUD;
          case "((":
            return this.nodeType.CIRCLE;
          case ")":
            return this.nodeType.CLOUD;
          case "))":
            return this.nodeType.BANG;
          case "{{":
            return this.nodeType.HEXAGON;
          default:
            return this.nodeType.DEFAULT;
        }
      }
      setElementForId(w, u) {
        this.elements[w] = u;
      }
      getElementById(w) {
        return this.elements[w];
      }
      decorateNode(w) {
        if (!w) return;
        const u = st(),
          m = this.nodes[this.nodes.length - 1];
        (w.icon && (m.icon = J(w.icon, u)), w.class && (m.class = J(w.class, u)));
      }
      type2Str(w) {
        switch (w) {
          case this.nodeType.DEFAULT:
            return "no-border";
          case this.nodeType.RECT:
            return "rect";
          case this.nodeType.ROUNDED_RECT:
            return "rounded-rect";
          case this.nodeType.CIRCLE:
            return "circle";
          case this.nodeType.CLOUD:
            return "cloud";
          case this.nodeType.BANG:
            return "bang";
          case this.nodeType.HEXAGON:
            return "hexgon";
          default:
            return "no-border";
        }
      }
      getLogger() {
        return Q;
      }
    }),
    G(K, "MindmapDB"),
    K),
  Pt = 12,
  Yt = G(function (I, w, u, m) {
    (w
      .append("path")
      .attr("id", "node-" + u.id)
      .attr("class", "node-bkg node-" + I.type2Str(u.type))
      .attr(
        "d",
        `M0 ${u.height - 5} v${-u.height + 2 * 5} q0,-5 5,-5 h${u.width - 2 * 5} q5,0 5,5 v${u.height - 5} H0 Z`,
      ),
      w
        .append("line")
        .attr("class", "node-line-" + m)
        .attr("x1", 0)
        .attr("y1", u.height)
        .attr("x2", u.width)
        .attr("y2", u.height));
  }, "defaultBkg"),
  Xt = G(function (I, w, u) {
    w.append("rect")
      .attr("id", "node-" + u.id)
      .attr("class", "node-bkg node-" + I.type2Str(u.type))
      .attr("height", u.height)
      .attr("width", u.width);
  }, "rectBkg"),
  kt = G(function (I, w, u) {
    const m = u.width,
      y = u.height,
      r = 0.15 * m,
      t = 0.25 * m,
      e = 0.35 * m,
      i = 0.2 * m;
    w.append("path")
      .attr("id", "node-" + u.id)
      .attr("class", "node-bkg node-" + I.type2Str(u.type))
      .attr(
        "d",
        `M0 0 a${r},${r} 0 0,1 ${m * 0.25},${-1 * m * 0.1}
      a${e},${e} 1 0,1 ${m * 0.4},${-1 * m * 0.1}
      a${t},${t} 1 0,1 ${m * 0.35},${1 * m * 0.2}

      a${r},${r} 1 0,1 ${m * 0.15},${1 * y * 0.35}
      a${i},${i} 1 0,1 ${-1 * m * 0.15},${1 * y * 0.65}

      a${t},${r} 1 0,1 ${-1 * m * 0.25},${m * 0.15}
      a${e},${e} 1 0,1 ${-1 * m * 0.5},0
      a${r},${r} 1 0,1 ${-1 * m * 0.25},${-1 * m * 0.15}

      a${r},${r} 1 0,1 ${-1 * m * 0.1},${-1 * y * 0.35}
      a${i},${i} 1 0,1 ${m * 0.1},${-1 * y * 0.65}

    H0 V0 Z`,
      );
  }, "cloudBkg"),
  Ht = G(function (I, w, u) {
    const m = u.width,
      y = u.height,
      r = 0.15 * m;
    w.append("path")
      .attr("id", "node-" + u.id)
      .attr("class", "node-bkg node-" + I.type2Str(u.type))
      .attr(
        "d",
        `M0 0 a${r},${r} 1 0,0 ${m * 0.25},${-1 * y * 0.1}
      a${r},${r} 1 0,0 ${m * 0.25},0
      a${r},${r} 1 0,0 ${m * 0.25},0
      a${r},${r} 1 0,0 ${m * 0.25},${1 * y * 0.1}

      a${r},${r} 1 0,0 ${m * 0.15},${1 * y * 0.33}
      a${r * 0.8},${r * 0.8} 1 0,0 0,${1 * y * 0.34}
      a${r},${r} 1 0,0 ${-1 * m * 0.15},${1 * y * 0.33}

      a${r},${r} 1 0,0 ${-1 * m * 0.25},${y * 0.15}
      a${r},${r} 1 0,0 ${-1 * m * 0.25},0
      a${r},${r} 1 0,0 ${-1 * m * 0.25},0
      a${r},${r} 1 0,0 ${-1 * m * 0.25},${-1 * y * 0.15}

      a${r},${r} 1 0,0 ${-1 * m * 0.1},${-1 * y * 0.33}
      a${r * 0.8},${r * 0.8} 1 0,0 0,${-1 * y * 0.34}
      a${r},${r} 1 0,0 ${m * 0.1},${-1 * y * 0.33}

    H0 V0 Z`,
      );
  }, "bangBkg"),
  $t = G(function (I, w, u) {
    w.append("circle")
      .attr("id", "node-" + u.id)
      .attr("class", "node-bkg node-" + I.type2Str(u.type))
      .attr("r", u.width / 2);
  }, "circleBkg");
function pt(I, w, u, m, y) {
  return I.insert("polygon", ":first-child")
    .attr(
      "points",
      m
        .map(function (r) {
          return r.x + "," + r.y;
        })
        .join(" "),
    )
    .attr("transform", "translate(" + (y.width - w) / 2 + ", " + u + ")");
}
G(pt, "insertPolygonShape");
var Bt = G(function (I, w, u) {
    const m = u.height,
      r = m / 4,
      t = u.width - u.padding + 2 * r,
      e = [
        { x: r, y: 0 },
        { x: t - r, y: 0 },
        { x: t, y: -m / 2 },
        { x: t - r, y: -m },
        { x: r, y: -m },
        { x: 0, y: -m / 2 },
      ];
    pt(w, t, m, e, u);
  }, "hexagonBkg"),
  Wt = G(function (I, w, u) {
    w.append("rect")
      .attr("id", "node-" + u.id)
      .attr("class", "node-bkg node-" + I.type2Str(u.type))
      .attr("height", u.height)
      .attr("rx", u.padding)
      .attr("ry", u.padding)
      .attr("width", u.width);
  }, "roundedRectBkg"),
  Vt = G(async function (I, w, u, m, y) {
    const r = y.htmlLabels,
      t = m % (Pt - 1),
      e = w.append("g");
    u.section = t;
    let i = "section-" + t;
    (t < 0 && (i += " section-root"), e.attr("class", (u.class ? u.class + " " : "") + "mindmap-node " + i));
    const o = e.append("g"),
      g = e.append("g"),
      a = u.descr.replace(
        /(<br\/*>)/g,
        `
`,
      );
    (await Ot(g, a, { useHtmlLabels: r, width: u.width, classes: "mindmap-node-label" }, y),
      r ||
        g
          .attr("dy", "1em")
          .attr("alignment-baseline", "middle")
          .attr("dominant-baseline", "middle")
          .attr("text-anchor", "middle"));
    const d = g.node().getBBox(),
      [n] = At(y.fontSize);
    if (((u.height = d.height + n * 1.1 * 0.5 + u.padding), (u.width = d.width + 2 * u.padding), u.icon))
      if (u.type === I.nodeType.CIRCLE)
        ((u.height += 50),
          (u.width += 50),
          e
            .append("foreignObject")
            .attr("height", "50px")
            .attr("width", u.width)
            .attr("style", "text-align: center;")
            .append("div")
            .attr("class", "icon-container")
            .append("i")
            .attr("class", "node-icon-" + t + " " + u.icon),
          g.attr("transform", "translate(" + u.width / 2 + ", " + (u.height / 2 - 1.5 * u.padding) + ")"));
      else {
        u.width += 50;
        const h = u.height;
        u.height = Math.max(h, 60);
        const c = Math.abs(u.height - h);
        (e
          .append("foreignObject")
          .attr("width", "60px")
          .attr("height", u.height)
          .attr("style", "text-align: center;margin-top:" + c / 2 + "px;")
          .append("div")
          .attr("class", "icon-container")
          .append("i")
          .attr("class", "node-icon-" + t + " " + u.icon),
          g.attr("transform", "translate(" + (25 + u.width / 2) + ", " + (c / 2 + u.padding / 2) + ")"));
      }
    else if (r) {
      const h = (u.width - d.width) / 2,
        c = (u.height - d.height) / 2;
      g.attr("transform", "translate(" + h + ", " + c + ")");
    } else {
      const h = u.width / 2,
        c = u.padding / 2;
      g.attr("transform", "translate(" + h + ", " + c + ")");
    }
    switch (u.type) {
      case I.nodeType.DEFAULT:
        Yt(I, o, u, t);
        break;
      case I.nodeType.ROUNDED_RECT:
        Wt(I, o, u, t);
        break;
      case I.nodeType.RECT:
        Xt(I, o, u, t);
        break;
      case I.nodeType.CIRCLE:
        (o.attr("transform", "translate(" + u.width / 2 + ", " + +u.height / 2 + ")"), $t(I, o, u, t));
        break;
      case I.nodeType.CLOUD:
        kt(I, o, u, t);
        break;
      case I.nodeType.BANG:
        Ht(I, o, u, t);
        break;
      case I.nodeType.HEXAGON:
        Bt(I, o, u, t);
        break;
    }
    return (I.setElementForId(u.id, e), u.height);
  }, "drawNode"),
  Zt = G(function (I, w) {
    const u = I.getElementById(w.id),
      m = w.x || 0,
      y = w.y || 0;
    u.attr("transform", "translate(" + m + "," + y + ")");
  }, "positionNode");
ft.use(Gt);
async function ot(I, w, u, m, y) {
  (await Vt(I, w, u, m, y), u.children && (await Promise.all(u.children.map((r, t) => ot(I, w, r, m < 0 ? t : m, y)))));
}
G(ot, "drawNodes");
function dt(I, w) {
  w.edges().map((u, m) => {
    const y = u.data();
    if (u[0]._private.bodyBounds) {
      const r = u[0]._private.rscratch;
      (Q.trace("Edge: ", m, y),
        I.insert("path")
          .attr("d", `M ${r.startX},${r.startY} L ${r.midX},${r.midY} L${r.endX},${r.endY} `)
          .attr("class", "edge section-edge-" + y.section + " edge-depth-" + y.depth));
    }
  });
}
G(dt, "drawEdges");
function ht(I, w, u, m) {
  (w.add({
    group: "nodes",
    data: {
      id: I.id.toString(),
      labelText: I.descr,
      height: I.height,
      width: I.width,
      level: m,
      nodeId: I.id,
      padding: I.padding,
      type: I.type,
    },
    position: { x: I.x, y: I.y },
  }),
    I.children &&
      I.children.forEach((y) => {
        (ht(y, w, u, m + 1),
          w.add({
            group: "edges",
            data: { id: `${I.id}_${y.id}`, source: I.id, target: y.id, depth: m, section: y.section },
          }));
      }));
}
G(ht, "addNodes");
function vt(I, w) {
  return new Promise((u) => {
    const m = mt("body").append("div").attr("id", "cy").attr("style", "display:none"),
      y = ft({
        container: document.getElementById("cy"),
        style: [{ selector: "edge", style: { "curve-style": "bezier" } }],
      });
    (m.remove(),
      ht(I, y, w, 0),
      y.nodes().forEach(function (r) {
        r.layoutDimensions = () => {
          const t = r.data();
          return { w: t.width, h: t.height };
        };
      }),
      y.layout({ name: "cose-bilkent", quality: "proof", styleEnabled: !1, animate: !1 }).run(),
      y.ready((r) => {
        (Q.info("Ready", r), u(y));
      }));
  });
}
G(vt, "layoutMindmap");
function yt(I, w) {
  w.nodes().map((u, m) => {
    const y = u.data();
    ((y.x = u.position().x), (y.y = u.position().y), Zt(I, y));
    const r = I.getElementById(y.nodeId);
    (Q.info("id:", m, "Position: (", u.position().x, ", ", u.position().y, ")", y),
      r.attr("transform", `translate(${u.position().x - y.width / 2}, ${u.position().y - y.height / 2})`),
      r.attr("attr", `apa-${m})`));
  });
}
G(yt, "positionNodes");
var Qt = G(async (I, w, u, m) => {
    var a, d, n, h;
    Q.debug(
      `Rendering mindmap diagram
` + I,
    );
    const y = m.db,
      r = y.getMindmap();
    if (!r) return;
    const t = st();
    t.htmlLabels = !1;
    const e = Et(w),
      i = e.append("g");
    i.attr("class", "mindmap-edges");
    const o = e.append("g");
    (o.attr("class", "mindmap-nodes"), await ot(y, o, r, -1, t));
    const g = await vt(r, t);
    (dt(i, g),
      yt(y, g),
      Lt(
        void 0,
        e,
        (d = (a = t.mindmap) == null ? void 0 : a.padding) != null ? d : it.mindmap.padding,
        (h = (n = t.mindmap) == null ? void 0 : n.useMaxWidth) != null ? h : it.mindmap.useMaxWidth,
      ));
  }, "draw"),
  zt = { draw: Qt },
  jt = G((I) => {
    let w = "";
    for (let u = 0; u < I.THEME_COLOR_LIMIT; u++)
      ((I["lineColor" + u] = I["lineColor" + u] || I["cScaleInv" + u]),
        Tt(I["lineColor" + u])
          ? (I["lineColor" + u] = Nt(I["lineColor" + u], 20))
          : (I["lineColor" + u] = Dt(I["lineColor" + u], 20)));
    for (let u = 0; u < I.THEME_COLOR_LIMIT; u++) {
      const m = "" + (17 - 3 * u);
      w += `
    .section-${u - 1} rect, .section-${u - 1} path, .section-${u - 1} circle, .section-${u - 1} polygon, .section-${u - 1} path  {
      fill: ${I["cScale" + u]};
    }
    .section-${u - 1} text {
     fill: ${I["cScaleLabel" + u]};
    }
    .node-icon-${u - 1} {
      font-size: 40px;
      color: ${I["cScaleLabel" + u]};
    }
    .section-edge-${u - 1}{
      stroke: ${I["cScale" + u]};
    }
    .edge-depth-${u - 1}{
      stroke-width: ${m};
    }
    .section-${u - 1} line {
      stroke: ${I["cScaleInv" + u]} ;
      stroke-width: 3;
    }

    .disabled, .disabled circle, .disabled text {
      fill: lightgray;
    }
    .disabled text {
      fill: #efefef;
    }
    `;
    }
    return w;
  }, "genSections"),
  Kt = G(
    (I) => `
  .edge {
    stroke-width: 3;
  }
  ${jt(I)}
  .section-root rect, .section-root path, .section-root circle, .section-root polygon  {
    fill: ${I.git0};
  }
  .section-root text {
    fill: ${I.gitBranchLabel0};
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
  .mindmap-node-label {
    dy: 1em;
    alignment-baseline: middle;
    text-anchor: middle;
    dominant-baseline: middle;
    text-align: center;
  }
`,
    "getStyles",
  ),
  qt = Kt,
  re = {
    get db() {
      return new Ut();
    },
    renderer: zt,
    parser: Ft,
    styles: qt,
  };
export { re as diagram };
