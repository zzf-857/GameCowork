import {
  h as ln,
  V as b,
  i as pe,
  j as he,
  Q as X,
  k as yt,
  l as j,
  R as hn,
  m as un,
  d as B,
  n as Ee,
  o as fn,
  p as Pe,
  q as de,
  F as ot,
  T as Mt,
  r as xe,
  s as Ye,
  e as We,
  t as Se,
  u as pn,
  v as q,
  w as U,
  c as F,
  E as dn,
  x as M,
  y as _e,
  z as Ze,
  I as ve,
  O as ue,
  P as Lt,
  J as qe,
  K as It,
  D as Pt,
  N as Dt,
  b as Ct,
  U as Ot,
  X as Ft,
  Y as kt,
  Z as mn,
  _ as Ie,
  $ as ce,
  a0 as gn,
  a1 as yn,
  a2 as Tn,
  a3 as ie,
  a4 as Nt,
  a5 as Qe,
  a6 as Je,
  a7 as $e,
  a8 as _n,
  a9 as et,
  aa as Bt,
  ab as J,
  ac as $,
  ad as wn,
  ae as En,
  af as xn,
  ag as ke,
  ah as vn,
  ai as Ut,
  aj as bn,
  ak as An,
  al as Rn,
  L as tt,
  am as Ht,
  an as Sn,
  ao as Mn,
  ap as Ne,
  aq as jt,
  ar as Ln,
  M as Te,
  as as In,
  at as Pn,
  au as Dn,
  av as Cn,
  aw as On,
  ax as Gt,
  ay as Fn,
  az as kn,
  aA as Nn,
  B as Bn,
  aB as Un,
} from "./three.module-C8hHHSST.js";
(function () {
  var c =
    typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof globalThis < "u"
          ? globalThis
          : typeof self < "u"
            ? self
            : {};
  c.SENTRY_RELEASE = { id: "2f1423c32bade03815c417fcfe4cfeec506373e0" };
})();
try {
  (function () {
    var c =
        typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : typeof globalThis < "u"
              ? globalThis
              : typeof self < "u"
                ? self
                : {},
      e = new c.Error().stack;
    e &&
      ((c._sentryDebugIds = c._sentryDebugIds || {}),
      (c._sentryDebugIds[e] = "cf98a44f-8aac-4362-a37d-a843461a9c1d"),
      (c._sentryDebugIdIdentifier = "sentry-dbid-cf98a44f-8aac-4362-a37d-a843461a9c1d"));
  })();
} catch {}
const Tt = { type: "change" },
  at = { type: "start" },
  Kt = { type: "end" },
  Me = new hn(),
  _t = new un(),
  Hn = Math.cos(70 * B.DEG2RAD),
  O = new b(),
  H = 2 * Math.PI,
  S = {
    NONE: -1,
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2,
    TOUCH_ROTATE: 3,
    TOUCH_PAN: 4,
    TOUCH_DOLLY_PAN: 5,
    TOUCH_DOLLY_ROTATE: 6,
  },
  Be = 1e-6;
class Ti extends ln {
  constructor(e, t = null) {
    (super(e, t),
      (this.state = S.NONE),
      (this.target = new b()),
      (this.cursor = new b()),
      (this.minDistance = 0),
      (this.maxDistance = 1 / 0),
      (this.minZoom = 0),
      (this.maxZoom = 1 / 0),
      (this.minTargetRadius = 0),
      (this.maxTargetRadius = 1 / 0),
      (this.minPolarAngle = 0),
      (this.maxPolarAngle = Math.PI),
      (this.minAzimuthAngle = -1 / 0),
      (this.maxAzimuthAngle = 1 / 0),
      (this.enableDamping = !1),
      (this.dampingFactor = 0.05),
      (this.enableZoom = !0),
      (this.zoomSpeed = 1),
      (this.enableRotate = !0),
      (this.rotateSpeed = 1),
      (this.keyRotateSpeed = 1),
      (this.enablePan = !0),
      (this.panSpeed = 1),
      (this.screenSpacePanning = !0),
      (this.keyPanSpeed = 7),
      (this.zoomToCursor = !1),
      (this.autoRotate = !1),
      (this.autoRotateSpeed = 2),
      (this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }),
      (this.mouseButtons = { LEFT: pe.ROTATE, MIDDLE: pe.DOLLY, RIGHT: pe.PAN }),
      (this.touches = { ONE: he.ROTATE, TWO: he.DOLLY_PAN }),
      (this.target0 = this.target.clone()),
      (this.position0 = this.object.position.clone()),
      (this.zoom0 = this.object.zoom),
      (this._cursorStyle = "auto"),
      (this._domElementKeyEvents = null),
      (this._lastPosition = new b()),
      (this._lastQuaternion = new X()),
      (this._lastTargetPosition = new b()),
      (this._quat = new X().setFromUnitVectors(e.up, new b(0, 1, 0))),
      (this._quatInverse = this._quat.clone().invert()),
      (this._spherical = new yt()),
      (this._sphericalDelta = new yt()),
      (this._scale = 1),
      (this._panOffset = new b()),
      (this._rotateStart = new j()),
      (this._rotateEnd = new j()),
      (this._rotateDelta = new j()),
      (this._panStart = new j()),
      (this._panEnd = new j()),
      (this._panDelta = new j()),
      (this._dollyStart = new j()),
      (this._dollyEnd = new j()),
      (this._dollyDelta = new j()),
      (this._dollyDirection = new b()),
      (this._mouse = new j()),
      (this._performCursorZoom = !1),
      (this._pointers = []),
      (this._pointerPositions = {}),
      (this._controlActive = !1),
      (this._onPointerMove = Gn.bind(this)),
      (this._onPointerDown = jn.bind(this)),
      (this._onPointerUp = Kn.bind(this)),
      (this._onContextMenu = qn.bind(this)),
      (this._onMouseWheel = Xn.bind(this)),
      (this._onKeyDown = Yn.bind(this)),
      (this._onTouchStart = Wn.bind(this)),
      (this._onTouchMove = Zn.bind(this)),
      (this._onMouseDown = zn.bind(this)),
      (this._onMouseMove = Vn.bind(this)),
      (this._interceptControlDown = Qn.bind(this)),
      (this._interceptControlUp = Jn.bind(this)),
      this.domElement !== null && this.connect(this.domElement),
      this.update());
  }
  set cursorStyle(e) {
    ((this._cursorStyle = e),
      e === "grab" ? (this.domElement.style.cursor = "grab") : (this.domElement.style.cursor = "auto"));
  }
  get cursorStyle() {
    return this._cursorStyle;
  }
  connect(e) {
    (super.connect(e),
      this.domElement.addEventListener("pointerdown", this._onPointerDown),
      this.domElement.addEventListener("pointercancel", this._onPointerUp),
      this.domElement.addEventListener("contextmenu", this._onContextMenu),
      this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: !1 }),
      this.domElement
        .getRootNode()
        .addEventListener("keydown", this._interceptControlDown, { passive: !0, capture: !0 }),
      (this.domElement.style.touchAction = "none"));
  }
  disconnect() {
    (this.domElement.removeEventListener("pointerdown", this._onPointerDown),
      this.domElement.ownerDocument.removeEventListener("pointermove", this._onPointerMove),
      this.domElement.ownerDocument.removeEventListener("pointerup", this._onPointerUp),
      this.domElement.removeEventListener("pointercancel", this._onPointerUp),
      this.domElement.removeEventListener("wheel", this._onMouseWheel),
      this.domElement.removeEventListener("contextmenu", this._onContextMenu),
      this.stopListenToKeyEvents(),
      this.domElement.getRootNode().removeEventListener("keydown", this._interceptControlDown, { capture: !0 }),
      (this.domElement.style.touchAction = ""));
  }
  dispose() {
    this.disconnect();
  }
  getPolarAngle() {
    return this._spherical.phi;
  }
  getAzimuthalAngle() {
    return this._spherical.theta;
  }
  getDistance() {
    return this.object.position.distanceTo(this.target);
  }
  listenToKeyEvents(e) {
    (e.addEventListener("keydown", this._onKeyDown), (this._domElementKeyEvents = e));
  }
  stopListenToKeyEvents() {
    this._domElementKeyEvents !== null &&
      (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), (this._domElementKeyEvents = null));
  }
  saveState() {
    (this.target0.copy(this.target), this.position0.copy(this.object.position), (this.zoom0 = this.object.zoom));
  }
  reset() {
    (this.target.copy(this.target0),
      this.object.position.copy(this.position0),
      (this.object.zoom = this.zoom0),
      this.object.updateProjectionMatrix(),
      this.dispatchEvent(Tt),
      this.update(),
      (this.state = S.NONE));
  }
  pan(e, t) {
    (this._pan(e, t), this.update());
  }
  dollyIn(e) {
    (this._dollyIn(e), this.update());
  }
  dollyOut(e) {
    (this._dollyOut(e), this.update());
  }
  rotateLeft(e) {
    (this._rotateLeft(e), this.update());
  }
  rotateUp(e) {
    (this._rotateUp(e), this.update());
  }
  update(e = null) {
    const t = this.object.position;
    (O.copy(t).sub(this.target),
      O.applyQuaternion(this._quat),
      this._spherical.setFromVector3(O),
      this.autoRotate && this.state === S.NONE && this._rotateLeft(this._getAutoRotationAngle(e)),
      this.enableDamping
        ? ((this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor),
          (this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor))
        : ((this._spherical.theta += this._sphericalDelta.theta), (this._spherical.phi += this._sphericalDelta.phi)));
    let n = this.minAzimuthAngle,
      s = this.maxAzimuthAngle;
    (isFinite(n) &&
      isFinite(s) &&
      (n < -Math.PI ? (n += H) : n > Math.PI && (n -= H),
      s < -Math.PI ? (s += H) : s > Math.PI && (s -= H),
      n <= s
        ? (this._spherical.theta = Math.max(n, Math.min(s, this._spherical.theta)))
        : (this._spherical.theta =
            this._spherical.theta > (n + s) / 2
              ? Math.max(n, this._spherical.theta)
              : Math.min(s, this._spherical.theta))),
      (this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi))),
      this._spherical.makeSafe(),
      this.enableDamping === !0
        ? this.target.addScaledVector(this._panOffset, this.dampingFactor)
        : this.target.add(this._panOffset),
      this.target.sub(this.cursor),
      this.target.clampLength(this.minTargetRadius, this.maxTargetRadius),
      this.target.add(this.cursor));
    let i = !1;
    if ((this.zoomToCursor && this._performCursorZoom) || this.object.isOrthographicCamera)
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const r = this._spherical.radius;
      ((this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale)),
        (i = r != this._spherical.radius));
    }
    if (
      (O.setFromSpherical(this._spherical),
      O.applyQuaternion(this._quatInverse),
      t.copy(this.target).add(O),
      this.object.lookAt(this.target),
      this.enableDamping === !0
        ? ((this._sphericalDelta.theta *= 1 - this.dampingFactor),
          (this._sphericalDelta.phi *= 1 - this.dampingFactor),
          this._panOffset.multiplyScalar(1 - this.dampingFactor))
        : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)),
      this.zoomToCursor && this._performCursorZoom)
    ) {
      let r = null;
      if (this.object.isPerspectiveCamera) {
        const o = O.length();
        r = this._clampDistance(o * this._scale);
        const a = o - r;
        (this.object.position.addScaledVector(this._dollyDirection, a), this.object.updateMatrixWorld(), (i = !!a));
      } else if (this.object.isOrthographicCamera) {
        const o = new b(this._mouse.x, this._mouse.y, 0);
        o.unproject(this.object);
        const a = this.object.zoom;
        ((this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale))),
          this.object.updateProjectionMatrix(),
          (i = a !== this.object.zoom));
        const h = new b(this._mouse.x, this._mouse.y, 0);
        (h.unproject(this.object),
          this.object.position.sub(h).add(o),
          this.object.updateMatrixWorld(),
          (r = O.length()));
      } else
        (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),
          (this.zoomToCursor = !1));
      r !== null &&
        (this.screenSpacePanning
          ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(r).add(this.object.position)
          : (Me.origin.copy(this.object.position),
            Me.direction.set(0, 0, -1).transformDirection(this.object.matrix),
            Math.abs(this.object.up.dot(Me.direction)) < Hn
              ? this.object.lookAt(this.target)
              : (_t.setFromNormalAndCoplanarPoint(this.object.up, this.target), Me.intersectPlane(_t, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const r = this.object.zoom;
      ((this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale))),
        r !== this.object.zoom && (this.object.updateProjectionMatrix(), (i = !0)));
    }
    return (
      (this._scale = 1),
      (this._performCursorZoom = !1),
      i ||
      this._lastPosition.distanceToSquared(this.object.position) > Be ||
      8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > Be ||
      this._lastTargetPosition.distanceToSquared(this.target) > Be
        ? (this.dispatchEvent(Tt),
          this._lastPosition.copy(this.object.position),
          this._lastQuaternion.copy(this.object.quaternion),
          this._lastTargetPosition.copy(this.target),
          !0)
        : !1
    );
  }
  _getAutoRotationAngle(e) {
    return e !== null ? (H / 60) * this.autoRotateSpeed * e : (H / 60 / 60) * this.autoRotateSpeed;
  }
  _getZoomScale(e) {
    const t = Math.abs(e * 0.01);
    return Math.pow(0.95, this.zoomSpeed * t);
  }
  _rotateLeft(e) {
    this._sphericalDelta.theta -= e;
  }
  _rotateUp(e) {
    this._sphericalDelta.phi -= e;
  }
  _panLeft(e, t) {
    (O.setFromMatrixColumn(t, 0), O.multiplyScalar(-e), this._panOffset.add(O));
  }
  _panUp(e, t) {
    (this.screenSpacePanning === !0
      ? O.setFromMatrixColumn(t, 1)
      : (O.setFromMatrixColumn(t, 0), O.crossVectors(this.object.up, O)),
      O.multiplyScalar(e),
      this._panOffset.add(O));
  }
  _pan(e, t) {
    const n = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const s = this.object.position;
      O.copy(s).sub(this.target);
      let i = O.length();
      ((i *= Math.tan(((this.object.fov / 2) * Math.PI) / 180)),
        this._panLeft((2 * e * i) / n.clientHeight, this.object.matrix),
        this._panUp((2 * t * i) / n.clientHeight, this.object.matrix));
    } else
      this.object.isOrthographicCamera
        ? (this._panLeft(
            (e * (this.object.right - this.object.left)) / this.object.zoom / n.clientWidth,
            this.object.matrix,
          ),
          this._panUp(
            (t * (this.object.top - this.object.bottom)) / this.object.zoom / n.clientHeight,
            this.object.matrix,
          ))
        : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),
          (this.enablePan = !1));
  }
  _dollyOut(e) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera
      ? (this._scale /= e)
      : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),
        (this.enableZoom = !1));
  }
  _dollyIn(e) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera
      ? (this._scale *= e)
      : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),
        (this.enableZoom = !1));
  }
  _updateZoomParameters(e, t) {
    if (!this.zoomToCursor) return;
    this._performCursorZoom = !0;
    const n = this.domElement.getBoundingClientRect(),
      s = e - n.left,
      i = t - n.top,
      r = n.width,
      o = n.height;
    ((this._mouse.x = (s / r) * 2 - 1),
      (this._mouse.y = -(i / o) * 2 + 1),
      this._dollyDirection
        .set(this._mouse.x, this._mouse.y, 1)
        .unproject(this.object)
        .sub(this.object.position)
        .normalize());
  }
  _clampDistance(e) {
    return Math.max(this.minDistance, Math.min(this.maxDistance, e));
  }
  _handleMouseDownRotate(e) {
    this._rotateStart.set(e.clientX, e.clientY);
  }
  _handleMouseDownDolly(e) {
    (this._updateZoomParameters(e.clientX, e.clientX), this._dollyStart.set(e.clientX, e.clientY));
  }
  _handleMouseDownPan(e) {
    this._panStart.set(e.clientX, e.clientY);
  }
  _handleMouseMoveRotate(e) {
    (this._rotateEnd.set(e.clientX, e.clientY),
      this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed));
    const t = this.domElement;
    (this._rotateLeft((H * this._rotateDelta.x) / t.clientHeight),
      this._rotateUp((H * this._rotateDelta.y) / t.clientHeight),
      this._rotateStart.copy(this._rotateEnd),
      this.update());
  }
  _handleMouseMoveDolly(e) {
    (this._dollyEnd.set(e.clientX, e.clientY),
      this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart),
      this._dollyDelta.y > 0
        ? this._dollyOut(this._getZoomScale(this._dollyDelta.y))
        : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)),
      this._dollyStart.copy(this._dollyEnd),
      this.update());
  }
  _handleMouseMovePan(e) {
    (this._panEnd.set(e.clientX, e.clientY),
      this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed),
      this._pan(this._panDelta.x, this._panDelta.y),
      this._panStart.copy(this._panEnd),
      this.update());
  }
  _handleMouseWheel(e) {
    (this._updateZoomParameters(e.clientX, e.clientY),
      e.deltaY < 0
        ? this._dollyIn(this._getZoomScale(e.deltaY))
        : e.deltaY > 0 && this._dollyOut(this._getZoomScale(e.deltaY)),
      this.update());
  }
  _handleKeyDown(e) {
    let t = !1;
    switch (e.code) {
      case this.keys.UP:
        (e.ctrlKey || e.metaKey || e.shiftKey
          ? this.enableRotate && this._rotateUp((H * this.keyRotateSpeed) / this.domElement.clientHeight)
          : this.enablePan && this._pan(0, this.keyPanSpeed),
          (t = !0));
        break;
      case this.keys.BOTTOM:
        (e.ctrlKey || e.metaKey || e.shiftKey
          ? this.enableRotate && this._rotateUp((-H * this.keyRotateSpeed) / this.domElement.clientHeight)
          : this.enablePan && this._pan(0, -this.keyPanSpeed),
          (t = !0));
        break;
      case this.keys.LEFT:
        (e.ctrlKey || e.metaKey || e.shiftKey
          ? this.enableRotate && this._rotateLeft((H * this.keyRotateSpeed) / this.domElement.clientHeight)
          : this.enablePan && this._pan(this.keyPanSpeed, 0),
          (t = !0));
        break;
      case this.keys.RIGHT:
        (e.ctrlKey || e.metaKey || e.shiftKey
          ? this.enableRotate && this._rotateLeft((-H * this.keyRotateSpeed) / this.domElement.clientHeight)
          : this.enablePan && this._pan(-this.keyPanSpeed, 0),
          (t = !0));
        break;
    }
    t && (e.preventDefault(), this.update());
  }
  _handleTouchStartRotate(e) {
    if (this._pointers.length === 1) this._rotateStart.set(e.pageX, e.pageY);
    else {
      const t = this._getSecondPointerPosition(e),
        n = 0.5 * (e.pageX + t.x),
        s = 0.5 * (e.pageY + t.y);
      this._rotateStart.set(n, s);
    }
  }
  _handleTouchStartPan(e) {
    if (this._pointers.length === 1) this._panStart.set(e.pageX, e.pageY);
    else {
      const t = this._getSecondPointerPosition(e),
        n = 0.5 * (e.pageX + t.x),
        s = 0.5 * (e.pageY + t.y);
      this._panStart.set(n, s);
    }
  }
  _handleTouchStartDolly(e) {
    const t = this._getSecondPointerPosition(e),
      n = e.pageX - t.x,
      s = e.pageY - t.y,
      i = Math.sqrt(n * n + s * s);
    this._dollyStart.set(0, i);
  }
  _handleTouchStartDollyPan(e) {
    (this.enableZoom && this._handleTouchStartDolly(e), this.enablePan && this._handleTouchStartPan(e));
  }
  _handleTouchStartDollyRotate(e) {
    (this.enableZoom && this._handleTouchStartDolly(e), this.enableRotate && this._handleTouchStartRotate(e));
  }
  _handleTouchMoveRotate(e) {
    if (this._pointers.length == 1) this._rotateEnd.set(e.pageX, e.pageY);
    else {
      const n = this._getSecondPointerPosition(e),
        s = 0.5 * (e.pageX + n.x),
        i = 0.5 * (e.pageY + n.y);
      this._rotateEnd.set(s, i);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const t = this.domElement;
    (this._rotateLeft((H * this._rotateDelta.x) / t.clientHeight),
      this._rotateUp((H * this._rotateDelta.y) / t.clientHeight),
      this._rotateStart.copy(this._rotateEnd));
  }
  _handleTouchMovePan(e) {
    if (this._pointers.length === 1) this._panEnd.set(e.pageX, e.pageY);
    else {
      const t = this._getSecondPointerPosition(e),
        n = 0.5 * (e.pageX + t.x),
        s = 0.5 * (e.pageY + t.y);
      this._panEnd.set(n, s);
    }
    (this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed),
      this._pan(this._panDelta.x, this._panDelta.y),
      this._panStart.copy(this._panEnd));
  }
  _handleTouchMoveDolly(e) {
    const t = this._getSecondPointerPosition(e),
      n = e.pageX - t.x,
      s = e.pageY - t.y,
      i = Math.sqrt(n * n + s * s);
    (this._dollyEnd.set(0, i),
      this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)),
      this._dollyOut(this._dollyDelta.y),
      this._dollyStart.copy(this._dollyEnd));
    const r = (e.pageX + t.x) * 0.5,
      o = (e.pageY + t.y) * 0.5;
    this._updateZoomParameters(r, o);
  }
  _handleTouchMoveDollyPan(e) {
    (this.enableZoom && this._handleTouchMoveDolly(e), this.enablePan && this._handleTouchMovePan(e));
  }
  _handleTouchMoveDollyRotate(e) {
    (this.enableZoom && this._handleTouchMoveDolly(e), this.enableRotate && this._handleTouchMoveRotate(e));
  }
  _addPointer(e) {
    this._pointers.push(e.pointerId);
  }
  _removePointer(e) {
    delete this._pointerPositions[e.pointerId];
    for (let t = 0; t < this._pointers.length; t++)
      if (this._pointers[t] == e.pointerId) {
        this._pointers.splice(t, 1);
        return;
      }
  }
  _isTrackingPointer(e) {
    for (let t = 0; t < this._pointers.length; t++) if (this._pointers[t] == e.pointerId) return !0;
    return !1;
  }
  _trackPointer(e) {
    let t = this._pointerPositions[e.pointerId];
    (t === void 0 && ((t = new j()), (this._pointerPositions[e.pointerId] = t)), t.set(e.pageX, e.pageY));
  }
  _getSecondPointerPosition(e) {
    const t = e.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[t];
  }
  _customWheelEvent(e) {
    const t = e.deltaMode,
      n = { clientX: e.clientX, clientY: e.clientY, deltaY: e.deltaY };
    switch (t) {
      case 1:
        n.deltaY *= 16;
        break;
      case 2:
        n.deltaY *= 100;
        break;
    }
    return (e.ctrlKey && !this._controlActive && (n.deltaY *= 10), n);
  }
}
function jn(c) {
  this.enabled !== !1 &&
    (this._pointers.length === 0 &&
      (this.domElement.setPointerCapture(c.pointerId),
      this.domElement.ownerDocument.addEventListener("pointermove", this._onPointerMove),
      this.domElement.ownerDocument.addEventListener("pointerup", this._onPointerUp)),
    !this._isTrackingPointer(c) &&
      (this._addPointer(c),
      c.pointerType === "touch" ? this._onTouchStart(c) : this._onMouseDown(c),
      this._cursorStyle === "grab" && (this.domElement.style.cursor = "grabbing")));
}
function Gn(c) {
  this.enabled !== !1 && (c.pointerType === "touch" ? this._onTouchMove(c) : this._onMouseMove(c));
}
function Kn(c) {
  switch ((this._removePointer(c), this._pointers.length)) {
    case 0:
      (this.domElement.releasePointerCapture(c.pointerId),
        this.domElement.ownerDocument.removeEventListener("pointermove", this._onPointerMove),
        this.domElement.ownerDocument.removeEventListener("pointerup", this._onPointerUp),
        this.dispatchEvent(Kt),
        (this.state = S.NONE),
        this._cursorStyle === "grab" && (this.domElement.style.cursor = "grab"));
      break;
    case 1:
      const e = this._pointers[0],
        t = this._pointerPositions[e];
      this._onTouchStart({ pointerId: e, pageX: t.x, pageY: t.y });
      break;
  }
}
function zn(c) {
  let e;
  switch (c.button) {
    case 0:
      e = this.mouseButtons.LEFT;
      break;
    case 1:
      e = this.mouseButtons.MIDDLE;
      break;
    case 2:
      e = this.mouseButtons.RIGHT;
      break;
    default:
      e = -1;
  }
  switch (e) {
    case pe.DOLLY:
      if (this.enableZoom === !1) return;
      (this._handleMouseDownDolly(c), (this.state = S.DOLLY));
      break;
    case pe.ROTATE:
      if (c.ctrlKey || c.metaKey || c.shiftKey) {
        if (this.enablePan === !1) return;
        (this._handleMouseDownPan(c), (this.state = S.PAN));
      } else {
        if (this.enableRotate === !1) return;
        (this._handleMouseDownRotate(c), (this.state = S.ROTATE));
      }
      break;
    case pe.PAN:
      if (c.ctrlKey || c.metaKey || c.shiftKey) {
        if (this.enableRotate === !1) return;
        (this._handleMouseDownRotate(c), (this.state = S.ROTATE));
      } else {
        if (this.enablePan === !1) return;
        (this._handleMouseDownPan(c), (this.state = S.PAN));
      }
      break;
    default:
      this.state = S.NONE;
  }
  this.state !== S.NONE && this.dispatchEvent(at);
}
function Vn(c) {
  switch (this.state) {
    case S.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(c);
      break;
    case S.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(c);
      break;
    case S.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(c);
      break;
  }
}
function Xn(c) {
  this.enabled === !1 ||
    this.enableZoom === !1 ||
    this.state !== S.NONE ||
    (c.preventDefault(),
    this.dispatchEvent(at),
    this._handleMouseWheel(this._customWheelEvent(c)),
    this.dispatchEvent(Kt));
}
function Yn(c) {
  this.enabled !== !1 && this._handleKeyDown(c);
}
function Wn(c) {
  switch ((this._trackPointer(c), this._pointers.length)) {
    case 1:
      switch (this.touches.ONE) {
        case he.ROTATE:
          if (this.enableRotate === !1) return;
          (this._handleTouchStartRotate(c), (this.state = S.TOUCH_ROTATE));
          break;
        case he.PAN:
          if (this.enablePan === !1) return;
          (this._handleTouchStartPan(c), (this.state = S.TOUCH_PAN));
          break;
        default:
          this.state = S.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case he.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          (this._handleTouchStartDollyPan(c), (this.state = S.TOUCH_DOLLY_PAN));
          break;
        case he.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          (this._handleTouchStartDollyRotate(c), (this.state = S.TOUCH_DOLLY_ROTATE));
          break;
        default:
          this.state = S.NONE;
      }
      break;
    default:
      this.state = S.NONE;
  }
  this.state !== S.NONE && this.dispatchEvent(at);
}
function Zn(c) {
  switch ((this._trackPointer(c), this.state)) {
    case S.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      (this._handleTouchMoveRotate(c), this.update());
      break;
    case S.TOUCH_PAN:
      if (this.enablePan === !1) return;
      (this._handleTouchMovePan(c), this.update());
      break;
    case S.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      (this._handleTouchMoveDollyPan(c), this.update());
      break;
    case S.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      (this._handleTouchMoveDollyRotate(c), this.update());
      break;
    default:
      this.state = S.NONE;
  }
}
function qn(c) {
  this.enabled !== !1 && c.preventDefault();
}
function Qn(c) {
  c.key === "Control" &&
    ((this._controlActive = !0),
    this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function Jn(c) {
  c.key === "Control" &&
    ((this._controlActive = !1),
    this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.8.2
*/ var z = Uint8Array,
  fe = Uint16Array,
  $n = Int32Array,
  zt = new z([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]),
  Vt = new z([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]),
  es = new z([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]),
  Xt = function (c, e) {
    for (var t = new fe(31), n = 0; n < 31; ++n) t[n] = e += 1 << c[n - 1];
    for (var s = new $n(t[30]), n = 1; n < 30; ++n) for (var i = t[n]; i < t[n + 1]; ++i) s[i] = ((i - t[n]) << 5) | n;
    return { b: t, r: s };
  },
  Yt = Xt(zt, 2),
  Wt = Yt.b,
  ts = Yt.r;
((Wt[28] = 258), (ts[258] = 28));
var ns = Xt(Vt, 0),
  ss = ns.b,
  nt = new fe(32768);
for (var I = 0; I < 32768; ++I) {
  var te = ((I & 43690) >> 1) | ((I & 21845) << 1);
  ((te = ((te & 52428) >> 2) | ((te & 13107) << 2)),
    (te = ((te & 61680) >> 4) | ((te & 3855) << 4)),
    (nt[I] = (((te & 65280) >> 8) | ((te & 255) << 8)) >> 1));
}
var we = function (c, e, t) {
    for (var n = c.length, s = 0, i = new fe(e); s < n; ++s) c[s] && ++i[c[s] - 1];
    var r = new fe(e);
    for (s = 1; s < e; ++s) r[s] = (r[s - 1] + i[s - 1]) << 1;
    var o;
    if (t) {
      o = new fe(1 << e);
      var a = 15 - e;
      for (s = 0; s < n; ++s)
        if (c[s])
          for (var h = (s << 4) | c[s], u = e - c[s], l = r[c[s] - 1]++ << u, f = l | ((1 << u) - 1); l <= f; ++l)
            o[nt[l] >> a] = h;
    } else for (o = new fe(n), s = 0; s < n; ++s) c[s] && (o[s] = nt[r[c[s] - 1]++] >> (15 - c[s]));
    return o;
  },
  Ae = new z(288);
for (var I = 0; I < 144; ++I) Ae[I] = 8;
for (var I = 144; I < 256; ++I) Ae[I] = 9;
for (var I = 256; I < 280; ++I) Ae[I] = 7;
for (var I = 280; I < 288; ++I) Ae[I] = 8;
var Zt = new z(32);
for (var I = 0; I < 32; ++I) Zt[I] = 5;
var is = we(Ae, 9, 1),
  rs = we(Zt, 5, 1),
  Ue = function (c) {
    for (var e = c[0], t = 1; t < c.length; ++t) c[t] > e && (e = c[t]);
    return e;
  },
  Y = function (c, e, t) {
    var n = (e / 8) | 0;
    return ((c[n] | (c[n + 1] << 8)) >> (e & 7)) & t;
  },
  He = function (c, e) {
    var t = (e / 8) | 0;
    return (c[t] | (c[t + 1] << 8) | (c[t + 2] << 16)) >> (e & 7);
  },
  os = function (c) {
    return ((c + 7) / 8) | 0;
  },
  ct = function (c, e, t) {
    return ((e == null || e < 0) && (e = 0), (t == null || t > c.length) && (t = c.length), new z(c.subarray(e, t)));
  },
  as = [
    "unexpected EOF",
    "invalid block type",
    "invalid length/literal",
    "invalid distance",
    "stream finished",
    "no stream handler",
    ,
    "no callback",
    "invalid UTF-8 data",
    "extra field too long",
    "date not in range 1980-2099",
    "filename too long",
    "stream finishing",
    "invalid zip data",
  ],
  G = function (c, e, t) {
    var n = new Error(e || as[c]);
    if (((n.code = c), Error.captureStackTrace && Error.captureStackTrace(n, G), !t)) throw n;
    return n;
  },
  qt = function (c, e, t, n) {
    var s = c.length,
      i = n ? n.length : 0;
    if (!s || (e.f && !e.l)) return t || new z(0);
    var r = !t,
      o = r || e.i != 2,
      a = e.i;
    r && (t = new z(s * 3));
    var h = function (dt) {
        var mt = t.length;
        if (dt > mt) {
          var gt = new z(Math.max(mt * 2, dt));
          (gt.set(t), (t = gt));
        }
      },
      u = e.f || 0,
      l = e.p || 0,
      f = e.b || 0,
      p = e.l,
      d = e.d,
      g = e.m,
      m = e.n,
      T = s * 8;
    do {
      if (!p) {
        u = Y(c, l, 1);
        var _ = Y(c, l + 1, 3);
        if (((l += 3), _))
          if (_ == 1) ((p = is), (d = rs), (g = 9), (m = 5));
          else if (_ == 2) {
            var A = Y(c, l, 31) + 257,
              L = Y(c, l + 10, 15) + 4,
              P = A + Y(c, l + 5, 31) + 1;
            l += 14;
            for (var k = new z(P), K = new z(19), R = 0; R < L; ++R) K[es[R]] = Y(c, l + R * 3, 7);
            l += L * 3;
            for (var re = Ue(K), De = (1 << re) - 1, rn = we(K, re, 1), R = 0; R < P;) {
              var lt = rn[Y(c, l, De)];
              l += lt & 15;
              var y = lt >> 4;
              if (y < 16) k[R++] = y;
              else {
                var oe = 0,
                  Re = 0;
                for (
                  y == 16
                    ? ((Re = 3 + Y(c, l, 3)), (l += 2), (oe = k[R - 1]))
                    : y == 17
                      ? ((Re = 3 + Y(c, l, 7)), (l += 3))
                      : y == 18 && ((Re = 11 + Y(c, l, 127)), (l += 7));
                  Re--;
                )
                  k[R++] = oe;
              }
            }
            var ht = k.subarray(0, A),
              ee = k.subarray(A);
            ((g = Ue(ht)), (m = Ue(ee)), (p = we(ht, g, 1)), (d = we(ee, m, 1)));
          } else G(1);
        else {
          var y = os(l) + 4,
            w = c[y - 4] | (c[y - 3] << 8),
            v = y + w;
          if (v > s) {
            a && G(0);
            break;
          }
          (o && h(f + w), t.set(c.subarray(y, v), f), (e.b = f += w), (e.p = l = v * 8), (e.f = u));
          continue;
        }
        if (l > T) {
          a && G(0);
          break;
        }
      }
      o && h(f + 131072);
      for (var on = (1 << g) - 1, an = (1 << m) - 1, Ce = l; ; Ce = l) {
        var oe = p[He(c, l) & on],
          ae = oe >> 4;
        if (((l += oe & 15), l > T)) {
          a && G(0);
          break;
        }
        if ((oe || G(2), ae < 256)) t[f++] = ae;
        else if (ae == 256) {
          ((Ce = l), (p = null));
          break;
        } else {
          var ut = ae - 254;
          if (ae > 264) {
            var R = ae - 257,
              ge = zt[R];
            ((ut = Y(c, l, (1 << ge) - 1) + Wt[R]), (l += ge));
          }
          var Oe = d[He(c, l) & an],
            Fe = Oe >> 4;
          (Oe || G(3), (l += Oe & 15));
          var ee = ss[Fe];
          if (Fe > 3) {
            var ge = Vt[Fe];
            ((ee += He(c, l) & ((1 << ge) - 1)), (l += ge));
          }
          if (l > T) {
            a && G(0);
            break;
          }
          o && h(f + 131072);
          var ft = f + ut;
          if (f < ee) {
            var pt = i - ee,
              cn = Math.min(ee, ft);
            for (pt + f < 0 && G(3); f < cn; ++f) t[f] = n[pt + f];
          }
          for (; f < ft; ++f) t[f] = t[f - ee];
        }
      }
      ((e.l = p), (e.p = Ce), (e.b = f), (e.f = u), p && ((u = 1), (e.m = g), (e.d = d), (e.n = m)));
    } while (!u);
    return f != t.length && r ? ct(t, 0, f) : t.subarray(0, f);
  },
  cs = new z(0),
  Q = function (c, e) {
    return c[e] | (c[e + 1] << 8);
  },
  W = function (c, e) {
    return (c[e] | (c[e + 1] << 8) | (c[e + 2] << 16) | (c[e + 3] << 24)) >>> 0;
  },
  je = function (c, e) {
    return W(c, e) + W(c, e + 4) * 4294967296;
  },
  ls = function (c, e) {
    return (
      ((c[0] & 15) != 8 || c[0] >> 4 > 7 || ((c[0] << 8) | c[1]) % 31) && G(6, "invalid zlib data"),
      ((c[1] >> 5) & 1) == 1 && G(6, "invalid zlib data: " + (c[1] & 32 ? "need" : "unexpected") + " dictionary"),
      ((c[1] >> 3) & 4) + 2
    );
  };
function hs(c, e) {
  return qt(c, { i: 2 }, e && e.out, e && e.dictionary);
}
function us(c, e) {
  return qt(c.subarray(ls(c), -4), { i: 2 }, e, e);
}
var st = typeof TextDecoder < "u" && new TextDecoder(),
  fs = 0;
try {
  (st.decode(cs, { stream: !0 }), (fs = 1));
} catch {}
var ps = function (c) {
  for (var e = "", t = 0; ;) {
    var n = c[t++],
      s = (n > 127) + (n > 223) + (n > 239);
    if (t + s > c.length) return { s: e, r: ct(c, t - 1) };
    s
      ? s == 3
        ? ((n = (((n & 15) << 18) | ((c[t++] & 63) << 12) | ((c[t++] & 63) << 6) | (c[t++] & 63)) - 65536),
          (e += String.fromCharCode(55296 | (n >> 10), 56320 | (n & 1023))))
        : s & 1
          ? (e += String.fromCharCode(((n & 31) << 6) | (c[t++] & 63)))
          : (e += String.fromCharCode(((n & 15) << 12) | ((c[t++] & 63) << 6) | (c[t++] & 63)))
      : (e += String.fromCharCode(n));
  }
};
function ds(c, e) {
  if (e) {
    for (var t = "", n = 0; n < c.length; n += 16384) t += String.fromCharCode.apply(null, c.subarray(n, n + 16384));
    return t;
  } else {
    if (st) return st.decode(c);
    var s = ps(c),
      i = s.s,
      t = s.r;
    return (t.length && G(8), i);
  }
}
var ms = function (c, e) {
    return e + 30 + Q(c, e + 26) + Q(c, e + 28);
  },
  gs = function (c, e, t) {
    var n = Q(c, e + 28),
      s = ds(c.subarray(e + 46, e + 46 + n), !(Q(c, e + 8) & 2048)),
      i = e + 46 + n,
      r = W(c, e + 20),
      o = t && r == 4294967295 ? ys(c, i) : [r, W(c, e + 24), W(c, e + 42)],
      a = o[0],
      h = o[1],
      u = o[2];
    return [Q(c, e + 10), a, h, s, i + Q(c, e + 30) + Q(c, e + 32), u];
  },
  ys = function (c, e) {
    for (; Q(c, e) != 1; e += 4 + Q(c, e + 2));
    return [je(c, e + 12), je(c, e + 4), je(c, e + 20)];
  };
function _i(c, e) {
  for (var t = {}, n = c.length - 22; W(c, n) != 101010256; --n) (!n || c.length - n > 65558) && G(13);
  var s = Q(c, n + 8);
  if (!s) return {};
  var i = W(c, n + 16),
    r = i == 4294967295 || s == 65535;
  if (r) {
    var o = W(c, n - 12);
    ((r = W(c, o) == 101075792), r && ((s = W(c, o + 32)), (i = W(c, o + 48))));
  }
  for (var a = 0; a < s; ++a) {
    var h = gs(c, i, r),
      u = h[0],
      l = h[1],
      f = h[2],
      p = h[3],
      d = h[4],
      g = h[5],
      m = ms(c, g);
    ((i = d),
      u
        ? u == 8
          ? (t[p] = hs(c.subarray(m, m + l), { out: new z(f) }))
          : G(14, "unknown compression type " + u)
        : (t[p] = ct(c, m, m + l)));
  }
  return t;
}
function Qt(c, e, t) {
  const n = t.length - c - 1;
  if (e >= t[n]) return n - 1;
  if (e <= t[c]) return c;
  let s = c,
    i = n,
    r = Math.floor((s + i) / 2);
  for (; e < t[r] || e >= t[r + 1];) (e < t[r] ? (i = r) : (s = r), (r = Math.floor((s + i) / 2)));
  return r;
}
function Ts(c, e, t, n) {
  const s = [],
    i = [],
    r = [];
  s[0] = 1;
  for (let o = 1; o <= t; ++o) {
    ((i[o] = e - n[c + 1 - o]), (r[o] = n[c + o] - e));
    let a = 0;
    for (let h = 0; h < o; ++h) {
      const u = r[h + 1],
        l = i[o - h],
        f = s[h] / (u + l);
      ((s[h] = a + u * f), (a = l * f));
    }
    s[o] = a;
  }
  return s;
}
function _s(c, e, t, n) {
  const s = Qt(c, n, e),
    i = Ts(s, n, c, e),
    r = new Ee(0, 0, 0, 0);
  for (let o = 0; o <= c; ++o) {
    const a = t[s - c + o],
      h = i[o],
      u = a.w * h;
    ((r.x += a.x * u), (r.y += a.y * u), (r.z += a.z * u), (r.w += a.w * h));
  }
  return r;
}
function ws(c, e, t, n, s) {
  const i = [];
  for (let l = 0; l <= t; ++l) i[l] = 0;
  const r = [];
  for (let l = 0; l <= n; ++l) r[l] = i.slice(0);
  const o = [];
  for (let l = 0; l <= t; ++l) o[l] = i.slice(0);
  o[0][0] = 1;
  const a = i.slice(0),
    h = i.slice(0);
  for (let l = 1; l <= t; ++l) {
    ((a[l] = e - s[c + 1 - l]), (h[l] = s[c + l] - e));
    let f = 0;
    for (let p = 0; p < l; ++p) {
      const d = h[p + 1],
        g = a[l - p];
      o[l][p] = d + g;
      const m = o[p][l - 1] / o[l][p];
      ((o[p][l] = f + d * m), (f = g * m));
    }
    o[l][l] = f;
  }
  for (let l = 0; l <= t; ++l) r[0][l] = o[l][t];
  for (let l = 0; l <= t; ++l) {
    let f = 0,
      p = 1;
    const d = [];
    for (let g = 0; g <= t; ++g) d[g] = i.slice(0);
    d[0][0] = 1;
    for (let g = 1; g <= n; ++g) {
      let m = 0;
      const T = l - g,
        _ = t - g;
      l >= g && ((d[p][0] = d[f][0] / o[_ + 1][T]), (m = d[p][0] * o[T][_]));
      const y = T >= -1 ? 1 : -T,
        w = l - 1 <= _ ? g - 1 : t - l;
      for (let A = y; A <= w; ++A)
        ((d[p][A] = (d[f][A] - d[f][A - 1]) / o[_ + 1][T + A]), (m += d[p][A] * o[T + A][_]));
      (l <= _ && ((d[p][g] = -d[f][g - 1] / o[_ + 1][l]), (m += d[p][g] * o[l][_])), (r[g][l] = m));
      const v = f;
      ((f = p), (p = v));
    }
  }
  let u = t;
  for (let l = 1; l <= n; ++l) {
    for (let f = 0; f <= t; ++f) r[l][f] *= u;
    u *= t - l;
  }
  return r;
}
function Es(c, e, t, n, s) {
  const i = s < c ? s : c,
    r = [],
    o = Qt(c, n, e),
    a = ws(o, n, c, i, e),
    h = [];
  for (let u = 0; u < t.length; ++u) {
    const l = t[u].clone(),
      f = l.w;
    ((l.x *= f), (l.y *= f), (l.z *= f), (h[u] = l));
  }
  for (let u = 0; u <= i; ++u) {
    const l = h[o - c].clone().multiplyScalar(a[u][0]);
    for (let f = 1; f <= c; ++f) l.add(h[o - c + f].clone().multiplyScalar(a[u][f]));
    r[u] = l;
  }
  for (let u = i + 1; u <= s + 1; ++u) r[u] = new Ee(0, 0, 0);
  return r;
}
function xs(c, e) {
  let t = 1;
  for (let s = 2; s <= c; ++s) t *= s;
  let n = 1;
  for (let s = 2; s <= e; ++s) n *= s;
  for (let s = 2; s <= c - e; ++s) n *= s;
  return t / n;
}
function vs(c) {
  const e = c.length,
    t = [],
    n = [];
  for (let i = 0; i < e; ++i) {
    const r = c[i];
    ((t[i] = new b(r.x, r.y, r.z)), (n[i] = r.w));
  }
  const s = [];
  for (let i = 0; i < e; ++i) {
    const r = t[i].clone();
    for (let o = 1; o <= i; ++o) r.sub(s[i - o].clone().multiplyScalar(xs(i, o) * n[o]));
    s[i] = r.divideScalar(n[0]);
  }
  return s;
}
function bs(c, e, t, n, s) {
  const i = Es(c, e, t, n, s);
  return vs(i);
}
class As extends fn {
  constructor(e, t, n, s, i) {
    super();
    const r = t ? t.length - 1 : 0,
      o = n ? n.length : 0;
    ((this.degree = e),
      (this.knots = t),
      (this.controlPoints = []),
      (this.startKnot = s || 0),
      (this.endKnot = i || r));
    for (let a = 0; a < o; ++a) {
      const h = n[a];
      this.controlPoints[a] = new Ee(h.x, h.y, h.z, h.w);
    }
  }
  getPoint(e, t = new b()) {
    const n = t,
      s = this.knots[this.startKnot] + e * (this.knots[this.endKnot] - this.knots[this.startKnot]),
      i = _s(this.degree, this.knots, this.controlPoints, s);
    return (i.w !== 1 && i.divideScalar(i.w), n.set(i.x, i.y, i.z));
  }
  getTangent(e, t = new b()) {
    const n = t,
      s = this.knots[0] + e * (this.knots[this.knots.length - 1] - this.knots[0]),
      i = bs(this.degree, this.knots, this.controlPoints, s, 1);
    return (n.copy(i[1]).normalize(), n);
  }
  toJSON() {
    const e = super.toJSON();
    return (
      (e.degree = this.degree),
      (e.knots = [...this.knots]),
      (e.controlPoints = this.controlPoints.map((t) => t.toArray())),
      (e.startKnot = this.startKnot),
      (e.endKnot = this.endKnot),
      e
    );
  }
  fromJSON(e) {
    return (
      super.fromJSON(e),
      (this.degree = e.degree),
      (this.knots = [...e.knots]),
      (this.controlPoints = e.controlPoints.map((t) => new Ee(t[0], t[1], t[2], t[3]))),
      (this.startKnot = e.startKnot),
      (this.endKnot = e.endKnot),
      this
    );
  }
}
let E, D, N;
class wi extends Pe {
  constructor(e) {
    super(e);
  }
  load(e, t, n, s) {
    const i = this,
      r = i.path === "" ? de.extractUrlBase(e) : i.path,
      o = new ot(this.manager);
    (o.setPath(i.path),
      o.setResponseType("arraybuffer"),
      o.setRequestHeader(i.requestHeader),
      o.setWithCredentials(i.withCredentials),
      o.load(
        e,
        function (a) {
          try {
            t(i.parse(a, r));
          } catch (h) {
            (s ? s(h) : console.error(h), i.manager.itemError(e));
          }
        },
        n,
        s,
      ));
  }
  parse(e, t) {
    if (Ps(e)) E = new Is().parse(e);
    else {
      const s = en(e);
      if (!Ds(s)) throw new Error("THREE.FBXLoader: Unknown format.");
      if (Et(s) < 7e3) throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: " + Et(s));
      E = new Ls().parse(s);
    }
    const n = new Mt(this.manager).setPath(this.resourcePath || t).setCrossOrigin(this.crossOrigin);
    return new Rs(n, this.manager).parse(E);
  }
}
class Rs {
  constructor(e, t) {
    ((this.textureLoader = e), (this.manager = t));
  }
  parse() {
    D = this.parseConnections();
    const e = this.parseImages(),
      t = this.parseTextures(e),
      n = this.parseMaterials(t),
      s = this.parseDeformers(),
      i = new Ss().parse(s);
    return (this.parseScene(s, i, n), N);
  }
  parseConnections() {
    const e = new Map();
    return (
      "Connections" in E &&
        E.Connections.connections.forEach(function (n) {
          const s = n[0],
            i = n[1],
            r = n[2];
          e.has(s) || e.set(s, { parents: [], children: [] });
          const o = { ID: i, relationship: r };
          (e.get(s).parents.push(o), e.has(i) || e.set(i, { parents: [], children: [] }));
          const a = { ID: s, relationship: r };
          e.get(i).children.push(a);
        }),
      e
    );
  }
  parseImages() {
    const e = {},
      t = {};
    if ("Video" in E.Objects) {
      const n = E.Objects.Video;
      for (const s in n) {
        const i = n[s],
          r = parseInt(s);
        if (((e[r] = i.RelativeFilename || i.Filename), "Content" in i)) {
          const o = i.Content instanceof ArrayBuffer && i.Content.byteLength > 0,
            a = typeof i.Content == "string" && i.Content !== "";
          if (o || a) {
            const h = this.parseImage(n[s]);
            t[i.RelativeFilename || i.Filename] = h;
          }
        }
      }
    }
    for (const n in e) {
      const s = e[n];
      t[s] !== void 0 ? (e[n] = t[s]) : (e[n] = e[n].split("\\").pop());
    }
    return e;
  }
  parseImage(e) {
    const t = e.Content,
      n = e.RelativeFilename || e.Filename,
      s = n.slice(n.lastIndexOf(".") + 1).toLowerCase();
    let i;
    switch (s) {
      case "bmp":
        i = "image/bmp";
        break;
      case "jpg":
      case "jpeg":
        i = "image/jpeg";
        break;
      case "png":
        i = "image/png";
        break;
      case "tif":
        i = "image/tiff";
        break;
      case "tga":
        (this.manager.getHandler(".tga") === null && console.warn("FBXLoader: TGA loader not found, skipping ", n),
          (i = "image/tga"));
        break;
      case "webp":
        i = "image/webp";
        break;
      default:
        console.warn('FBXLoader: Image type "' + s + '" is not supported.');
        return;
    }
    if (typeof t == "string") return "data:" + i + ";base64," + t;
    {
      const r = new Uint8Array(t);
      return window.URL.createObjectURL(new Blob([r], { type: i }));
    }
  }
  parseTextures(e) {
    const t = new Map();
    if ("Texture" in E.Objects) {
      const n = E.Objects.Texture;
      for (const s in n) {
        const i = this.parseTexture(n[s], e);
        t.set(parseInt(s), i);
      }
    }
    return t;
  }
  parseTexture(e, t) {
    const n = this.loadTexture(e, t);
    ((n.ID = e.id), (n.name = e.attrName));
    const s = e.WrapModeU,
      i = e.WrapModeV,
      r = s !== void 0 ? s.value : 0,
      o = i !== void 0 ? i.value : 0;
    if (((n.wrapS = r === 0 ? xe : Ye), (n.wrapT = o === 0 ? xe : Ye), "Scaling" in e)) {
      const a = e.Scaling.value;
      ((n.repeat.x = a[0]), (n.repeat.y = a[1]));
    }
    if ("Translation" in e) {
      const a = e.Translation.value;
      ((n.offset.x = a[0]), (n.offset.y = a[1]));
    }
    return n;
  }
  loadTexture(e, t) {
    const n = e.FileName.split(".").pop().toLowerCase();
    let s = this.manager.getHandler(`.${n}`);
    s === null && (s = this.textureLoader);
    const i = s.path;
    i || s.setPath(this.textureLoader.path);
    const r = D.get(e.id).children;
    let o;
    if (
      (r !== void 0 &&
        r.length > 0 &&
        t[r[0].ID] !== void 0 &&
        ((o = t[r[0].ID]), (o.indexOf("blob:") === 0 || o.indexOf("data:") === 0) && s.setPath(void 0)),
      o === void 0)
    )
      return (console.warn("FBXLoader: Undefined filename, creating placeholder texture."), new We());
    const a = s.load(o);
    return (s.setPath(i), a);
  }
  parseMaterials(e) {
    const t = new Map();
    if ("Material" in E.Objects) {
      const n = E.Objects.Material;
      for (const s in n) {
        const i = this.parseMaterial(n[s], e);
        i !== null && t.set(parseInt(s), i);
      }
    }
    return t;
  }
  parseMaterial(e, t) {
    const n = e.id,
      s = e.attrName;
    let i = e.ShadingModel;
    if ((typeof i == "object" && (i = i.value), !D.has(n))) return null;
    const r = this.parseParameters(e, t, n);
    let o;
    switch (i.toLowerCase()) {
      case "phong":
        o = new Se();
        break;
      case "lambert":
        o = new pn();
        break;
      default:
        (console.warn('THREE.FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.', i),
          (o = new Se()));
        break;
    }
    return (o.setValues(r), (o.name = s), o);
  }
  parseParameters(e, t, n) {
    const s = {};
    (e.BumpFactor && (s.bumpScale = e.BumpFactor.value),
      e.Diffuse
        ? (s.color = q.colorSpaceToWorking(new U().fromArray(e.Diffuse.value), F))
        : e.DiffuseColor &&
          (e.DiffuseColor.type === "Color" || e.DiffuseColor.type === "ColorRGB") &&
          (s.color = q.colorSpaceToWorking(new U().fromArray(e.DiffuseColor.value), F)),
      e.DisplacementFactor && (s.displacementScale = e.DisplacementFactor.value),
      e.Emissive
        ? (s.emissive = q.colorSpaceToWorking(new U().fromArray(e.Emissive.value), F))
        : e.EmissiveColor &&
          (e.EmissiveColor.type === "Color" || e.EmissiveColor.type === "ColorRGB") &&
          (s.emissive = q.colorSpaceToWorking(new U().fromArray(e.EmissiveColor.value), F)),
      e.EmissiveFactor && (s.emissiveIntensity = parseFloat(e.EmissiveFactor.value)),
      (s.opacity = 1 - (e.TransparencyFactor ? parseFloat(e.TransparencyFactor.value) : 0)),
      (s.opacity === 1 || s.opacity === 0) &&
        ((s.opacity = e.Opacity ? parseFloat(e.Opacity.value) : null), s.opacity === null && (s.opacity = 1)),
      s.opacity < 1 && (s.transparent = !0),
      e.ReflectionFactor && (s.reflectivity = e.ReflectionFactor.value),
      e.Shininess && (s.shininess = e.Shininess.value),
      e.Specular
        ? (s.specular = q.colorSpaceToWorking(new U().fromArray(e.Specular.value), F))
        : e.SpecularColor &&
          e.SpecularColor.type === "Color" &&
          (s.specular = q.colorSpaceToWorking(new U().fromArray(e.SpecularColor.value), F)));
    const i = this;
    return (
      D.get(n).children.forEach(function (r) {
        const o = r.relationship;
        switch (o) {
          case "Bump":
            s.bumpMap = i.getTexture(t, r.ID);
            break;
          case "Maya|TEX_ao_map":
            s.aoMap = i.getTexture(t, r.ID);
            break;
          case "DiffuseColor":
          case "Maya|TEX_color_map":
            ((s.map = i.getTexture(t, r.ID)), s.map !== void 0 && (s.map.colorSpace = F));
            break;
          case "DisplacementColor":
            s.displacementMap = i.getTexture(t, r.ID);
            break;
          case "EmissiveColor":
            ((s.emissiveMap = i.getTexture(t, r.ID)), s.emissiveMap !== void 0 && (s.emissiveMap.colorSpace = F));
            break;
          case "NormalMap":
          case "Maya|TEX_normal_map":
            s.normalMap = i.getTexture(t, r.ID);
            break;
          case "ReflectionColor":
            ((s.envMap = i.getTexture(t, r.ID)),
              s.envMap !== void 0 && ((s.envMap.mapping = dn), (s.envMap.colorSpace = F)));
            break;
          case "SpecularColor":
            ((s.specularMap = i.getTexture(t, r.ID)), s.specularMap !== void 0 && (s.specularMap.colorSpace = F));
            break;
          case "TransparentColor":
          case "TransparencyFactor":
            ((s.alphaMap = i.getTexture(t, r.ID)), (s.transparent = !0));
            break;
          case "AmbientColor":
          case "ShininessExponent":
          case "SpecularFactor":
          case "VectorDisplacementColor":
          default:
            console.warn("THREE.FBXLoader: %s map is not supported in three.js, skipping texture.", o);
            break;
        }
      }),
      s
    );
  }
  getTexture(e, t) {
    return (
      "LayeredTexture" in E.Objects &&
        t in E.Objects.LayeredTexture &&
        (console.warn(
          "THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer.",
        ),
        (t = D.get(t).children[0].ID)),
      e.get(t)
    );
  }
  parseDeformers() {
    const e = {},
      t = {};
    if ("Deformer" in E.Objects) {
      const n = E.Objects.Deformer;
      for (const s in n) {
        const i = n[s],
          r = D.get(parseInt(s));
        if (i.attrType === "Skin") {
          const o = this.parseSkeleton(r, n);
          ((o.ID = s),
            r.parents.length > 1 &&
              console.warn("THREE.FBXLoader: skeleton attached to more than one geometry is not supported."),
            (o.geometryID = r.parents[0].ID),
            (e[s] = o));
        } else if (i.attrType === "BlendShape") {
          const o = { id: s };
          ((o.rawTargets = this.parseMorphTargets(r, n)),
            (o.id = s),
            r.parents.length > 1 &&
              console.warn("THREE.FBXLoader: morph target attached to more than one geometry is not supported."),
            (t[s] = o));
        }
      }
    }
    return { skeletons: e, morphTargets: t };
  }
  parseSkeleton(e, t) {
    const n = [];
    return (
      e.children.forEach(function (s) {
        const i = t[s.ID];
        if (i.attrType !== "Cluster") return;
        const r = { ID: s.ID, indices: [], weights: [], transformLink: new M().fromArray(i.TransformLink.a) };
        ("Indexes" in i && ((r.indices = i.Indexes.a), (r.weights = i.Weights.a)), n.push(r));
      }),
      { rawBones: n, bones: [] }
    );
  }
  parseMorphTargets(e, t) {
    const n = [];
    for (let s = 0; s < e.children.length; s++) {
      const i = e.children[s],
        r = t[i.ID],
        o = { name: r.attrName, initialWeight: r.DeformPercent, id: r.id, fullWeights: r.FullWeights.a };
      if (r.attrType !== "BlendShapeChannel") return;
      ((o.geoID = D.get(parseInt(i.ID)).children.filter(function (a) {
        return a.relationship === void 0;
      })[0].ID),
        n.push(o));
    }
    return n;
  }
  parseScene(e, t, n) {
    N = new _e();
    const s = this.parseModels(e.skeletons, t, n),
      i = E.Objects.Model,
      r = this;
    (s.forEach(function (l) {
      const f = i[l.ID];
      (r.setLookAtProperties(l, f),
        D.get(l.ID).parents.forEach(function (d) {
          const g = s.get(d.ID);
          g !== void 0 && g.add(l);
        }),
        l.parent === null && N.add(l));
    }),
      this.addGlobalSceneSettings(),
      N.traverse(function (l) {
        if (l.userData.transformData) {
          l.parent &&
            ((l.userData.transformData.parentMatrix = l.parent.matrix),
            (l.userData.transformData.parentMatrixWorld = l.parent.matrixWorld));
          const f = $t(l.userData.transformData);
          (l.applyMatrix4(f), l.updateWorldMatrix());
        }
      }));
    const o = this.parsePoseNodes(),
      a = new Set();
    for (const l in e.skeletons)
      e.skeletons[l].rawBones.forEach(function (f, p) {
        const d = e.skeletons[l].bones[p];
        d && a.add(d.ID);
      });
    const h = new M();
    (N.traverse(function (l) {
      if (l.isBone && l.ID !== void 0 && !a.has(l.ID)) {
        const f = o[l.ID];
        f !== void 0 &&
          (l.parent ? (h.copy(l.parent.matrixWorld).invert(), h.multiply(f)) : h.copy(f),
          h.decompose(l.position, l.quaternion, l.scale),
          l.updateMatrix(),
          l.matrixWorld.copy(f));
      }
    }),
      this.bindSkeleton(e.skeletons, t, s));
    const u = new Ms().parse();
    (N.children.length === 1 && N.children[0].isGroup && ((N.children[0].animations = u), (N = N.children[0])),
      (N.animations = u),
      "GlobalSettings" in E &&
        "UpAxis" in E.GlobalSettings &&
        E.GlobalSettings.UpAxis.value === 2 &&
        (console.warn(
          "THREE.FBXLoader: You are loading an asset with a Z-UP coordinate system. The loader just rotates the asset to transform it into Y-UP. The vertex data are not converted.",
        ),
        N.rotation.set(-Math.PI / 2, 0, 0)));
  }
  parseModels(e, t, n) {
    const s = new Map(),
      i = E.Objects.Model;
    for (const r in i) {
      const o = parseInt(r),
        a = i[r],
        h = D.get(o);
      let u = this.buildSkeleton(h, e, o, a.attrName);
      if (!u) {
        switch (a.attrType) {
          case "Camera":
            u = this.createCamera(h);
            break;
          case "Light":
            u = this.createLight(h);
            break;
          case "Mesh":
            u = this.createMesh(h, t, n);
            break;
          case "NurbsCurve":
            u = this.createCurve(h, t);
            break;
          case "LimbNode":
          case "Root":
            u = new Ze();
            break;
          case "Null":
          default:
            u = new _e();
            break;
        }
        ((u.name = a.attrName ? ve.sanitizeNodeName(a.attrName) : ""),
          (u.userData.originalName = a.attrName),
          (u.ID = o));
      }
      (this.getTransformData(u, a), s.set(o, u));
    }
    return s;
  }
  buildSkeleton(e, t, n, s) {
    let i = null;
    return (
      e.parents.forEach(function (r) {
        for (const o in t) {
          const a = t[o];
          a.rawBones.forEach(function (h, u) {
            if (h.ID === r.ID) {
              const l = i;
              ((i = new Ze()),
                i.matrixWorld.copy(h.transformLink),
                (i.name = s ? ve.sanitizeNodeName(s) : ""),
                (i.userData.originalName = s),
                (i.ID = n),
                (a.bones[u] = i),
                l !== null && i.add(l));
            }
          });
        }
      }),
      i
    );
  }
  createCamera(e) {
    let t, n;
    if (
      (e.children.forEach(function (s) {
        const i = E.Objects.NodeAttribute[s.ID];
        i !== void 0 && (n = i);
      }),
      n === void 0)
    )
      t = new ue();
    else {
      let s = 0;
      n.CameraProjectionType !== void 0 && n.CameraProjectionType.value === 1 && (s = 1);
      let i = 1;
      n.NearPlane !== void 0 && (i = n.NearPlane.value / 1e3);
      let r = 1e3;
      n.FarPlane !== void 0 && (r = n.FarPlane.value / 1e3);
      let o = window.innerWidth,
        a = window.innerHeight;
      n.AspectWidth !== void 0 && n.AspectHeight !== void 0 && ((o = n.AspectWidth.value), (a = n.AspectHeight.value));
      const h = o / a;
      let u = 45;
      n.FieldOfView !== void 0 && (u = n.FieldOfView.value);
      const l = n.FocalLength ? n.FocalLength.value : null;
      switch (s) {
        case 0:
          ((t = new Lt(u, h, i, r)), l !== null && t.setFocalLength(l));
          break;
        case 1:
          (console.warn("THREE.FBXLoader: Orthographic cameras not supported yet."), (t = new ue()));
          break;
        default:
          (console.warn("THREE.FBXLoader: Unknown camera type " + s + "."), (t = new ue()));
          break;
      }
    }
    return t;
  }
  createLight(e) {
    let t, n;
    if (
      (e.children.forEach(function (s) {
        const i = E.Objects.NodeAttribute[s.ID];
        i !== void 0 && (n = i);
      }),
      n === void 0)
    )
      t = new ue();
    else {
      let s;
      n.LightType === void 0 ? (s = 0) : (s = n.LightType.value);
      let i = 16777215;
      n.Color !== void 0 && (i = q.colorSpaceToWorking(new U().fromArray(n.Color.value), F));
      let r = n.Intensity === void 0 ? 1 : n.Intensity.value / 100;
      n.CastLightOnObject !== void 0 && n.CastLightOnObject.value === 0 && (r = 0);
      let o = 0;
      n.FarAttenuationEnd !== void 0 &&
        (n.EnableFarAttenuation !== void 0 && n.EnableFarAttenuation.value === 0
          ? (o = 0)
          : (o = n.FarAttenuationEnd.value));
      const a = 1;
      switch (s) {
        case 0:
          t = new qe(i, r, o, a);
          break;
        case 1:
          t = new Pt(i, r);
          break;
        case 2:
          let h = Math.PI / 3,
            u = 0;
          (n.OuterAngle !== void 0
            ? ((h = B.degToRad(n.OuterAngle.value)),
              n.InnerAngle !== void 0 && ((u = 1 - n.InnerAngle.value / n.OuterAngle.value), (u = Math.max(0, u))))
            : n.InnerAngle !== void 0 && (h = B.degToRad(n.InnerAngle.value)),
            (t = new It(i, r, o, h, u, a)));
          break;
        default:
          (console.warn("THREE.FBXLoader: Unknown light type " + n.LightType.value + ", defaulting to a PointLight."),
            (t = new qe(i, r)));
          break;
      }
      n.CastShadows !== void 0 && n.CastShadows.value === 1 && (t.castShadow = !0);
    }
    return t;
  }
  createMesh(e, t, n) {
    let s,
      i = null,
      r = null;
    const o = [];
    if (
      (e.children.forEach(function (a) {
        (t.has(a.ID) && (i = t.get(a.ID)), n.has(a.ID) && o.push(n.get(a.ID)));
      }),
      o.length > 1
        ? (r = o)
        : o.length > 0
          ? (r = o[0])
          : ((r = new Se({ name: Pe.DEFAULT_MATERIAL_NAME, color: 13421772 })), o.push(r)),
      "color" in i.attributes &&
        o.forEach(function (a) {
          a.vertexColors = !0;
        }),
      i.groups.length > 0)
    ) {
      let a = !1;
      for (let h = 0, u = i.groups.length; h < u; h++) {
        const l = i.groups[h];
        (l.materialIndex < 0 || l.materialIndex >= o.length) && ((l.materialIndex = o.length), (a = !0));
      }
      if (a) {
        const h = new Se();
        o.push(h);
      }
    }
    return (i.FBX_Deformer ? ((s = new Dt(i, r)), s.normalizeSkinWeights()) : (s = new Ct(i, r)), s);
  }
  createCurve(e, t) {
    const n = e.children.reduce(function (i, r) {
        return (t.has(r.ID) && (i = t.get(r.ID)), i);
      }, null),
      s = new Ot({ name: Pe.DEFAULT_MATERIAL_NAME, color: 3342591, linewidth: 1 });
    return new Ft(n, s);
  }
  getTransformData(e, t) {
    const n = {};
    ("InheritType" in t && (n.inheritType = parseInt(t.InheritType.value)),
      "RotationOrder" in t ? (n.eulerOrder = be(t.RotationOrder.value)) : (n.eulerOrder = be(0)),
      "Lcl_Translation" in t && (n.translation = t.Lcl_Translation.value),
      "PreRotation" in t && (n.preRotation = t.PreRotation.value),
      "Lcl_Rotation" in t && (n.rotation = t.Lcl_Rotation.value),
      "PostRotation" in t && (n.postRotation = t.PostRotation.value),
      "Lcl_Scaling" in t && (n.scale = t.Lcl_Scaling.value),
      "ScalingOffset" in t && (n.scalingOffset = t.ScalingOffset.value),
      "ScalingPivot" in t && (n.scalingPivot = t.ScalingPivot.value),
      "RotationOffset" in t && (n.rotationOffset = t.RotationOffset.value),
      "RotationPivot" in t && (n.rotationPivot = t.RotationPivot.value),
      (e.userData.transformData = n));
  }
  setLookAtProperties(e, t) {
    "LookAtProperty" in t &&
      D.get(e.ID).children.forEach(function (s) {
        if (s.relationship === "LookAtProperty") {
          const i = E.Objects.Model[s.ID];
          if ("Lcl_Translation" in i) {
            const r = i.Lcl_Translation.value;
            e.target !== void 0 ? (e.target.position.fromArray(r), N.add(e.target)) : e.lookAt(new b().fromArray(r));
          }
        }
      });
  }
  bindSkeleton(e, t, n) {
    for (const s in e) {
      const i = e[s],
        r = [];
      for (let a = 0, h = i.bones.length; a < h; a++) {
        const u = new M();
        (i.bones[a] && i.rawBones[a] && u.copy(i.rawBones[a].transformLink).invert(), r.push(u));
      }
      D.get(parseInt(i.ID)).parents.forEach(function (a) {
        if (t.has(a.ID)) {
          const h = a.ID;
          D.get(h).parents.forEach(function (l) {
            if (n.has(l.ID)) {
              const f = n.get(l.ID);
              (f.updateMatrixWorld(!0), f.bind(new kt(i.bones, r), f.matrixWorld));
            }
          });
        }
      });
    }
  }
  parsePoseNodes() {
    const e = {};
    if ("Pose" in E.Objects) {
      const t = E.Objects.Pose;
      for (const n in t)
        if (t[n].attrType === "BindPose" && t[n].NbPoseNodes > 0) {
          const s = t[n].PoseNode;
          Array.isArray(s)
            ? s.forEach(function (i) {
                e[i.Node] = new M().fromArray(i.Matrix.a);
              })
            : (e[s.Node] = new M().fromArray(s.Matrix.a));
        }
    }
    return e;
  }
  addGlobalSceneSettings() {
    if ("GlobalSettings" in E) {
      if ("AmbientColor" in E.GlobalSettings) {
        const e = E.GlobalSettings.AmbientColor.value,
          t = e[0],
          n = e[1],
          s = e[2];
        if (t !== 0 || n !== 0 || s !== 0) {
          const i = new U().setRGB(t, n, s, F);
          N.add(new mn(i, 1));
        }
      }
      "UnitScaleFactor" in E.GlobalSettings && (N.userData.unitScaleFactor = E.GlobalSettings.UnitScaleFactor.value);
    }
  }
}
class Ss {
  constructor() {
    this.negativeMaterialIndices = !1;
  }
  parse(e) {
    const t = new Map();
    if ("Geometry" in E.Objects) {
      const n = E.Objects.Geometry;
      for (const s in n) {
        const i = D.get(parseInt(s)),
          r = this.parseGeometry(i, n[s], e);
        t.set(parseInt(s), r);
      }
    }
    return (
      this.negativeMaterialIndices === !0 &&
        console.warn(
          "THREE.FBXLoader: The FBX file contains invalid (negative) material indices. The asset might not render as expected.",
        ),
      t
    );
  }
  parseGeometry(e, t, n) {
    switch (t.attrType) {
      case "Mesh":
        return this.parseMeshGeometry(e, t, n);
      case "NurbsCurve":
        return this.parseNurbsGeometry(t);
    }
  }
  parseMeshGeometry(e, t, n) {
    const s = n.skeletons,
      i = [],
      r = e.parents.map(function (l) {
        return E.Objects.Model[l.ID];
      });
    if (r.length === 0) return;
    const o = e.children.reduce(function (l, f) {
      return (s[f.ID] !== void 0 && (l = s[f.ID]), l);
    }, null);
    e.children.forEach(function (l) {
      n.morphTargets[l.ID] !== void 0 && i.push(n.morphTargets[l.ID]);
    });
    const a = r[0],
      h = {};
    ("RotationOrder" in a && (h.eulerOrder = be(a.RotationOrder.value)),
      "InheritType" in a && (h.inheritType = parseInt(a.InheritType.value)),
      "GeometricTranslation" in a && (h.translation = a.GeometricTranslation.value),
      "GeometricRotation" in a && (h.rotation = a.GeometricRotation.value),
      "GeometricScaling" in a && (h.scale = a.GeometricScaling.value));
    const u = $t(h);
    return this.genGeometry(t, o, i, u);
  }
  genGeometry(e, t, n, s) {
    const i = new Ie();
    e.attrName && (i.name = e.attrName);
    const r = this.parseGeoNode(e, t),
      o = this.genBuffers(r),
      a = new ce(o.vertex, 3);
    if (
      (a.applyMatrix4(s),
      i.setAttribute("position", a),
      o.colors.length > 0 && i.setAttribute("color", new ce(o.colors, 3)),
      t &&
        (i.setAttribute("skinIndex", new gn(o.weightsIndices, 4)),
        i.setAttribute("skinWeight", new ce(o.vertexWeights, 4)),
        (i.FBX_Deformer = t)),
      o.normal.length > 0)
    ) {
      const h = new yn().getNormalMatrix(s),
        u = new ce(o.normal, 3);
      (u.applyNormalMatrix(h), i.setAttribute("normal", u));
    }
    if (
      (o.uvs.forEach(function (h, u) {
        const l = u === 0 ? "uv" : `uv${u}`;
        i.setAttribute(l, new ce(o.uvs[u], 2));
      }),
      r.material && r.material.mappingType !== "AllSame")
    ) {
      let h = o.materialIndex[0],
        u = 0;
      if (
        (o.materialIndex.forEach(function (l, f) {
          l !== h && (i.addGroup(u, f - u, h), (h = l), (u = f));
        }),
        i.groups.length > 0)
      ) {
        const l = i.groups[i.groups.length - 1],
          f = l.start + l.count;
        f !== o.materialIndex.length && i.addGroup(f, o.materialIndex.length - f, h);
      }
      i.groups.length === 0 && i.addGroup(0, o.materialIndex.length, o.materialIndex[0]);
    }
    return (this.addMorphTargets(i, e, n, s), i);
  }
  parseGeoNode(e, t) {
    const n = {};
    if (
      ((n.vertexPositions = e.Vertices !== void 0 ? e.Vertices.a : []),
      (n.vertexIndices = e.PolygonVertexIndex !== void 0 ? e.PolygonVertexIndex.a : []),
      e.LayerElementColor &&
        e.LayerElementColor[0].Colors &&
        (n.color = this.parseVertexColors(e.LayerElementColor[0])),
      e.LayerElementMaterial && (n.material = this.parseMaterialIndices(e.LayerElementMaterial[0])),
      e.LayerElementNormal && (n.normal = this.parseNormals(e.LayerElementNormal[0])),
      e.LayerElementUV)
    ) {
      n.uv = [];
      let s = 0;
      for (; e.LayerElementUV[s];) (e.LayerElementUV[s].UV && n.uv.push(this.parseUVs(e.LayerElementUV[s])), s++);
    }
    return (
      (n.weightTable = {}),
      t !== null &&
        ((n.skeleton = t),
        t.rawBones.forEach(function (s, i) {
          s.indices.forEach(function (r, o) {
            (n.weightTable[r] === void 0 && (n.weightTable[r] = []),
              n.weightTable[r].push({ id: i, weight: s.weights[o] }));
          });
        })),
      n
    );
  }
  genBuffers(e) {
    const t = { vertex: [], normal: [], colors: [], uvs: [], materialIndex: [], vertexWeights: [], weightsIndices: [] };
    let n = 0,
      s = 0,
      i = !1,
      r = [],
      o = [],
      a = [],
      h = [],
      u = [],
      l = [];
    const f = this;
    return (
      e.vertexIndices.forEach(function (p, d) {
        let g,
          m = !1;
        p < 0 && ((p = p ^ -1), (m = !0));
        let T = [],
          _ = [];
        if ((r.push(p * 3, p * 3 + 1, p * 3 + 2), e.color)) {
          const y = Le(d, n, p, e.color);
          a.push(y[0], y[1], y[2]);
        }
        if (e.skeleton) {
          if (
            (e.weightTable[p] !== void 0 &&
              e.weightTable[p].forEach(function (y) {
                (_.push(y.weight), T.push(y.id));
              }),
            _.length > 4)
          ) {
            i ||
              (console.warn(
                "THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights.",
              ),
              (i = !0));
            const y = [0, 0, 0, 0],
              w = [0, 0, 0, 0];
            (_.forEach(function (v, A) {
              let L = v,
                P = T[A];
              w.forEach(function (k, K, R) {
                if (L > k) {
                  ((R[K] = L), (L = k));
                  const re = y[K];
                  ((y[K] = P), (P = re));
                }
              });
            }),
              (T = y),
              (_ = w));
          }
          for (; _.length < 4;) (_.push(0), T.push(0));
          for (let y = 0; y < 4; ++y) (u.push(_[y]), l.push(T[y]));
        }
        if (e.normal) {
          const y = Le(d, n, p, e.normal);
          o.push(y[0], y[1], y[2]);
        }
        (e.material &&
          e.material.mappingType !== "AllSame" &&
          ((g = Le(d, n, p, e.material)[0]), g < 0 && ((f.negativeMaterialIndices = !0), (g = 0))),
          e.uv &&
            e.uv.forEach(function (y, w) {
              const v = Le(d, n, p, y);
              (h[w] === void 0 && (h[w] = []), h[w].push(v[0]), h[w].push(v[1]));
            }),
          s++,
          m &&
            (f.genFace(t, e, r, g, o, a, h, u, l, s),
            n++,
            (s = 0),
            (r = []),
            (o = []),
            (a = []),
            (h = []),
            (u = []),
            (l = [])));
      }),
      t
    );
  }
  getNormalNewell(e) {
    const t = new b(0, 0, 0);
    for (let n = 0; n < e.length; n++) {
      const s = e[n],
        i = e[(n + 1) % e.length];
      ((t.x += (s.y - i.y) * (s.z + i.z)), (t.y += (s.z - i.z) * (s.x + i.x)), (t.z += (s.x - i.x) * (s.y + i.y)));
    }
    return (t.normalize(), t);
  }
  getNormalTangentAndBitangent(e) {
    const t = this.getNormalNewell(e),
      s = (Math.abs(t.z) > 0.5 ? new b(0, 1, 0) : new b(0, 0, 1)).cross(t).normalize(),
      i = t.clone().cross(s).normalize();
    return { normal: t, tangent: s, bitangent: i };
  }
  flattenVertex(e, t, n) {
    return new j(e.dot(t), e.dot(n));
  }
  genFace(e, t, n, s, i, r, o, a, h, u) {
    let l;
    if (u > 3) {
      const f = [],
        p = t.baseVertexPositions || t.vertexPositions;
      for (let T = 0; T < n.length; T += 3) f.push(new b(p[n[T]], p[n[T + 1]], p[n[T + 2]]));
      const { tangent: d, bitangent: g } = this.getNormalTangentAndBitangent(f),
        m = [];
      for (const T of f) m.push(this.flattenVertex(T, d, g));
      l = Tn.triangulateShape(m, []);
    } else l = [[0, 1, 2]];
    for (const [f, p, d] of l)
      (e.vertex.push(t.vertexPositions[n[f * 3]]),
        e.vertex.push(t.vertexPositions[n[f * 3 + 1]]),
        e.vertex.push(t.vertexPositions[n[f * 3 + 2]]),
        e.vertex.push(t.vertexPositions[n[p * 3]]),
        e.vertex.push(t.vertexPositions[n[p * 3 + 1]]),
        e.vertex.push(t.vertexPositions[n[p * 3 + 2]]),
        e.vertex.push(t.vertexPositions[n[d * 3]]),
        e.vertex.push(t.vertexPositions[n[d * 3 + 1]]),
        e.vertex.push(t.vertexPositions[n[d * 3 + 2]]),
        t.skeleton &&
          (e.vertexWeights.push(a[f * 4]),
          e.vertexWeights.push(a[f * 4 + 1]),
          e.vertexWeights.push(a[f * 4 + 2]),
          e.vertexWeights.push(a[f * 4 + 3]),
          e.vertexWeights.push(a[p * 4]),
          e.vertexWeights.push(a[p * 4 + 1]),
          e.vertexWeights.push(a[p * 4 + 2]),
          e.vertexWeights.push(a[p * 4 + 3]),
          e.vertexWeights.push(a[d * 4]),
          e.vertexWeights.push(a[d * 4 + 1]),
          e.vertexWeights.push(a[d * 4 + 2]),
          e.vertexWeights.push(a[d * 4 + 3]),
          e.weightsIndices.push(h[f * 4]),
          e.weightsIndices.push(h[f * 4 + 1]),
          e.weightsIndices.push(h[f * 4 + 2]),
          e.weightsIndices.push(h[f * 4 + 3]),
          e.weightsIndices.push(h[p * 4]),
          e.weightsIndices.push(h[p * 4 + 1]),
          e.weightsIndices.push(h[p * 4 + 2]),
          e.weightsIndices.push(h[p * 4 + 3]),
          e.weightsIndices.push(h[d * 4]),
          e.weightsIndices.push(h[d * 4 + 1]),
          e.weightsIndices.push(h[d * 4 + 2]),
          e.weightsIndices.push(h[d * 4 + 3])),
        t.color &&
          (e.colors.push(r[f * 3]),
          e.colors.push(r[f * 3 + 1]),
          e.colors.push(r[f * 3 + 2]),
          e.colors.push(r[p * 3]),
          e.colors.push(r[p * 3 + 1]),
          e.colors.push(r[p * 3 + 2]),
          e.colors.push(r[d * 3]),
          e.colors.push(r[d * 3 + 1]),
          e.colors.push(r[d * 3 + 2])),
        t.material &&
          t.material.mappingType !== "AllSame" &&
          (e.materialIndex.push(s), e.materialIndex.push(s), e.materialIndex.push(s)),
        t.normal &&
          (e.normal.push(i[f * 3]),
          e.normal.push(i[f * 3 + 1]),
          e.normal.push(i[f * 3 + 2]),
          e.normal.push(i[p * 3]),
          e.normal.push(i[p * 3 + 1]),
          e.normal.push(i[p * 3 + 2]),
          e.normal.push(i[d * 3]),
          e.normal.push(i[d * 3 + 1]),
          e.normal.push(i[d * 3 + 2])),
        t.uv &&
          t.uv.forEach(function (g, m) {
            (e.uvs[m] === void 0 && (e.uvs[m] = []),
              e.uvs[m].push(o[m][f * 2]),
              e.uvs[m].push(o[m][f * 2 + 1]),
              e.uvs[m].push(o[m][p * 2]),
              e.uvs[m].push(o[m][p * 2 + 1]),
              e.uvs[m].push(o[m][d * 2]),
              e.uvs[m].push(o[m][d * 2 + 1]));
          }));
  }
  addMorphTargets(e, t, n, s) {
    if (n.length === 0) return;
    ((e.morphTargetsRelative = !0), (e.morphAttributes.position = []));
    const i = s.clone().setPosition(0, 0, 0),
      r = this;
    n.forEach(function (o) {
      o.rawTargets.forEach(function (a) {
        const h = E.Objects.Geometry[a.geoID];
        h !== void 0 && r.genMorphGeometry(e, t, h, i, a.name);
      });
    });
  }
  genMorphGeometry(e, t, n, s, i) {
    const r = t.Vertices !== void 0 ? t.Vertices.a : [],
      o = t.PolygonVertexIndex !== void 0 ? t.PolygonVertexIndex.a : [],
      a = n.Vertices !== void 0 ? n.Vertices.a : [],
      h = n.Indexes !== void 0 ? n.Indexes.a : [],
      u = e.attributes.position.count * 3,
      l = new Float32Array(u);
    for (let g = 0; g < h.length; g++) {
      const m = h[g] * 3;
      ((l[m] = a[g * 3]), (l[m + 1] = a[g * 3 + 1]), (l[m + 2] = a[g * 3 + 2]));
    }
    const f = { vertexIndices: o, vertexPositions: l, baseVertexPositions: r },
      p = this.genBuffers(f),
      d = new ce(p.vertex, 3);
    ((d.name = i || n.attrName), d.applyMatrix4(s), e.morphAttributes.position.push(d));
  }
  parseNormals(e) {
    const t = e.MappingInformationType,
      n = e.ReferenceInformationType,
      s = e.Normals.a;
    let i = [];
    return (
      n === "IndexToDirect" &&
        ("NormalIndex" in e ? (i = e.NormalIndex.a) : "NormalsIndex" in e && (i = e.NormalsIndex.a)),
      { dataSize: 3, buffer: s, indices: i, mappingType: t, referenceType: n }
    );
  }
  parseUVs(e) {
    const t = e.MappingInformationType,
      n = e.ReferenceInformationType,
      s = e.UV.a;
    let i = [];
    return (
      n === "IndexToDirect" && (i = e.UVIndex.a),
      { dataSize: 2, buffer: s, indices: i, mappingType: t, referenceType: n }
    );
  }
  parseVertexColors(e) {
    const t = e.MappingInformationType,
      n = e.ReferenceInformationType,
      s = e.Colors.a;
    let i = [];
    n === "IndexToDirect" && (i = e.ColorIndex.a);
    for (let r = 0, o = new U(); r < s.length; r += 4)
      (o.fromArray(s, r), q.colorSpaceToWorking(o, F), o.toArray(s, r));
    return { dataSize: 4, buffer: s, indices: i, mappingType: t, referenceType: n };
  }
  parseMaterialIndices(e) {
    const t = e.MappingInformationType,
      n = e.ReferenceInformationType;
    if (t === "NoMappingInformation")
      return { dataSize: 1, buffer: [0], indices: [0], mappingType: "AllSame", referenceType: n };
    const s = e.Materials.a,
      i = [];
    for (let r = 0; r < s.length; ++r) i.push(r);
    return { dataSize: 1, buffer: s, indices: i, mappingType: t, referenceType: n };
  }
  parseNurbsGeometry(e) {
    const t = parseInt(e.Order);
    if (isNaN(t))
      return (console.error("THREE.FBXLoader: Invalid Order %s given for geometry ID: %s", e.Order, e.id), new Ie());
    const n = t - 1,
      s = e.KnotVector.a,
      i = [],
      r = e.Points.a;
    for (let l = 0, f = r.length; l < f; l += 4) i.push(new Ee().fromArray(r, l));
    let o, a;
    if (e.Form === "Closed") i.push(i[0]);
    else if (e.Form === "Periodic") {
      ((o = n), (a = s.length - 1 - o));
      for (let l = 0; l < n; ++l) i.push(i[l]);
    }
    const u = new As(n, s, i, o, a).getPoints(i.length * 12);
    return new Ie().setFromPoints(u);
  }
}
class Ms {
  parse() {
    const e = [],
      t = this.parseClips();
    if (t !== void 0)
      for (const n in t) {
        const s = t[n],
          i = this.addClip(s);
        e.push(i);
      }
    return e;
  }
  parseClips() {
    if (E.Objects.AnimationCurve === void 0) return;
    const e = this.parseAnimationCurveNodes();
    this.parseAnimationCurves(e);
    const t = this.parseAnimationLayers(e);
    return this.parseAnimStacks(t);
  }
  parseAnimationCurveNodes() {
    const e = E.Objects.AnimationCurveNode,
      t = new Map();
    for (const n in e) {
      const s = e[n];
      if (s.attrName.match(/S|R|T|DeformPercent/) !== null) {
        const i = { id: s.id, attr: s.attrName, curves: {} };
        t.set(i.id, i);
      }
    }
    return t;
  }
  parseAnimationCurves(e) {
    const t = E.Objects.AnimationCurve;
    for (const n in t) {
      const s = { id: t[n].id, times: t[n].KeyTime.a.map(Cs), values: t[n].KeyValueFloat.a },
        i = D.get(s.id);
      if (i !== void 0) {
        const r = i.parents[0].ID,
          o = i.parents[0].relationship;
        o.match(/X/)
          ? (e.get(r).curves.x = s)
          : o.match(/Y/)
            ? (e.get(r).curves.y = s)
            : o.match(/Z/)
              ? (e.get(r).curves.z = s)
              : o.match(/DeformPercent/) && e.has(r) && (e.get(r).curves.morph = s);
      }
    }
  }
  parseAnimationLayers(e) {
    const t = E.Objects.AnimationLayer,
      n = new Map();
    for (const s in t) {
      const i = [],
        r = D.get(parseInt(s));
      r !== void 0 &&
        (r.children.forEach(function (a, h) {
          if (e.has(a.ID)) {
            const u = e.get(a.ID);
            if (u.curves.x !== void 0 || u.curves.y !== void 0 || u.curves.z !== void 0) {
              if (i[h] === void 0) {
                const l = D.get(a.ID).parents.filter(function (p) {
                  return p.relationship !== void 0;
                });
                if (l.length === 0) return;
                const f = l[0].ID;
                if (f !== void 0) {
                  const p = E.Objects.Model[f.toString()];
                  if (p === void 0) {
                    console.warn("THREE.FBXLoader: Encountered a unused curve.", a);
                    return;
                  }
                  const d = {
                    modelName: p.attrName ? ve.sanitizeNodeName(p.attrName) : "",
                    ID: p.id,
                    initialPosition: [0, 0, 0],
                    initialRotation: [0, 0, 0],
                    initialScale: [1, 1, 1],
                  };
                  (N.traverse(function (g) {
                    g.ID === p.id &&
                      ((d.transform = g.matrix),
                      g.userData.transformData &&
                        ((d.eulerOrder = g.userData.transformData.eulerOrder),
                        g.userData.transformData.rotation && (d.initialRotation = g.userData.transformData.rotation)));
                  }),
                    d.transform || (d.transform = new M()),
                    "PreRotation" in p && (d.preRotation = p.PreRotation.value),
                    "PostRotation" in p && (d.postRotation = p.PostRotation.value),
                    (i[h] = d));
                }
              }
              i[h] && (i[h][u.attr] = u);
            } else if (u.curves.morph !== void 0) {
              if (i[h] === void 0) {
                const l = D.get(a.ID).parents.filter(function (_) {
                  return _.relationship !== void 0;
                });
                if (l.length === 0) return;
                const f = l[0].ID,
                  p = D.get(f).parents[0].ID,
                  d = D.get(p).parents[0].ID,
                  g = D.get(d).parents[0].ID,
                  m = E.Objects.Model[g],
                  T = {
                    modelName: m.attrName ? ve.sanitizeNodeName(m.attrName) : "",
                    morphName: E.Objects.Deformer[f].attrName,
                  };
                i[h] = T;
              }
              i[h][u.attr] = u;
            }
          }
        }),
        n.set(parseInt(s), i));
    }
    return n;
  }
  parseAnimStacks(e) {
    const t = E.Objects.AnimationStack,
      n = {};
    for (const s in t) {
      const i = D.get(parseInt(s)).children;
      i.length > 1 &&
        console.warn(
          "THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.",
        );
      const r = e.get(i[0].ID);
      n[s] = { name: t[s].attrName, layer: r };
    }
    return n;
  }
  addClip(e) {
    let t = [];
    const n = this;
    return (
      e.layer.forEach(function (s) {
        t = t.concat(n.generateTracks(s));
      }),
      new Nt(e.name, -1, t)
    );
  }
  generateTracks(e) {
    const t = [];
    let n = new b(),
      s = new b();
    if (
      (e.transform && e.transform.decompose(n, new X(), s),
      (n = n.toArray()),
      (s = s.toArray()),
      e.T !== void 0 && Object.keys(e.T.curves).length > 0)
    ) {
      const i = this.generateVectorTrack(e.modelName, e.T.curves, n, "position");
      i !== void 0 && t.push(i);
    }
    if (e.R !== void 0 && Object.keys(e.R.curves).length > 0) {
      const i = this.generateRotationTrack(
        e.modelName,
        e.R.curves,
        e.preRotation,
        e.postRotation,
        e.eulerOrder,
        e.initialRotation,
      );
      i !== void 0 && t.push(i);
    }
    if (e.S !== void 0 && Object.keys(e.S.curves).length > 0) {
      const i = this.generateVectorTrack(e.modelName, e.S.curves, s, "scale");
      i !== void 0 && t.push(i);
    }
    if (e.DeformPercent !== void 0) {
      const i = this.generateMorphTrack(e);
      i !== void 0 && t.push(i);
    }
    return t;
  }
  generateVectorTrack(e, t, n, s) {
    const i = this.getTimesForAllAxes(t),
      r = this.getKeyframeTrackValues(i, t, n);
    return new Qe(e + "." + s, i, r);
  }
  generateRotationTrack(e, t, n, s, i, r) {
    let o, a;
    if (t.x !== void 0 || t.y !== void 0 || t.z !== void 0) {
      const p = this.getTimesForAllAxes(t);
      if (p.length > 0) {
        const d = r || [0, 0, 0],
          g = this.synchronizeCurve(t.x, p, d[0]),
          m = this.synchronizeCurve(t.y, p, d[1]),
          T = this.synchronizeCurve(t.z, p, d[2]),
          _ = this.interpolateRotations(g, m, T, i);
        ((o = _[0]), (a = _[1]));
      }
    }
    const h = be(0);
    (n !== void 0 && ((n = n.map(B.degToRad)), n.push(h), (n = new ie().fromArray(n)), (n = new X().setFromEuler(n))),
      s !== void 0 &&
        ((s = s.map(B.degToRad)), s.push(h), (s = new ie().fromArray(s)), (s = new X().setFromEuler(s).invert())));
    const u = new X(),
      l = new ie(),
      f = [];
    if (!(!a || !o)) {
      for (let p = 0; p < a.length; p += 3)
        (l.set(a[p], a[p + 1], a[p + 2], i),
          u.setFromEuler(l),
          n !== void 0 && u.premultiply(n),
          s !== void 0 && u.multiply(s),
          p > 2 && new X().fromArray(f, ((p - 3) / 3) * 4).dot(u) < 0 && u.set(-u.x, -u.y, -u.z, -u.w),
          u.toArray(f, (p / 3) * 4));
      return new Je(e + ".quaternion", o, f);
    }
  }
  generateMorphTrack(e) {
    const t = e.DeformPercent.curves.morph,
      n = t.values.map(function (i) {
        return i / 100;
      }),
      s = N.getObjectByName(e.modelName).morphTargetDictionary[e.morphName];
    return new $e(e.modelName + ".morphTargetInfluences[" + s + "]", t.times, n);
  }
  getTimesForAllAxes(e) {
    let t = [];
    if (
      (e.x !== void 0 && (t = t.concat(e.x.times)),
      e.y !== void 0 && (t = t.concat(e.y.times)),
      e.z !== void 0 && (t = t.concat(e.z.times)),
      (t = t.sort(function (n, s) {
        return n - s;
      })),
      t.length > 1)
    ) {
      let n = 1,
        s = t[0];
      for (let i = 1; i < t.length; i++) {
        const r = t[i];
        r !== s && ((t[n] = r), (s = r), n++);
      }
      t = t.slice(0, n);
    }
    return t;
  }
  getKeyframeTrackValues(e, t, n) {
    const s = n,
      i = [];
    let r = -1,
      o = -1,
      a = -1;
    return (
      e.forEach(function (h) {
        if (
          (t.x && (r = t.x.times.indexOf(h)),
          t.y && (o = t.y.times.indexOf(h)),
          t.z && (a = t.z.times.indexOf(h)),
          r !== -1)
        ) {
          const u = t.x.values[r];
          (i.push(u), (s[0] = u));
        } else i.push(s[0]);
        if (o !== -1) {
          const u = t.y.values[o];
          (i.push(u), (s[1] = u));
        } else i.push(s[1]);
        if (a !== -1) {
          const u = t.z.values[a];
          (i.push(u), (s[2] = u));
        } else i.push(s[2]);
      }),
      i
    );
  }
  synchronizeCurve(e, t, n) {
    if (e === void 0) return { times: t, values: t.map(() => n) };
    if (e.times.length === t.length) return e;
    const s = [];
    for (let i = 0; i < t.length; i++) s.push(this.sampleCurveValue(e, t[i], n));
    return { times: t, values: s };
  }
  sampleCurveValue(e, t, n) {
    const s = e.times,
      i = e.values;
    if (t <= s[0]) return i[0];
    if (t >= s[s.length - 1]) return i[i.length - 1];
    for (let r = 0; r < s.length - 1; r++)
      if (t >= s[r] && t <= s[r + 1]) {
        if (s[r] === t) return i[r];
        const o = (t - s[r]) / (s[r + 1] - s[r]);
        return i[r] * (1 - o) + i[r + 1] * o;
      }
    return n;
  }
  interpolateRotations(e, t, n, s) {
    const i = [],
      r = [];
    (i.push(e.times[0]),
      r.push(B.degToRad(e.values[0])),
      r.push(B.degToRad(t.values[0])),
      r.push(B.degToRad(n.values[0])));
    for (let o = 1; o < e.values.length; o++) {
      const a = [e.values[o - 1], t.values[o - 1], n.values[o - 1]];
      if (isNaN(a[0]) || isNaN(a[1]) || isNaN(a[2])) continue;
      const h = a.map(B.degToRad),
        u = [e.values[o], t.values[o], n.values[o]];
      if (isNaN(u[0]) || isNaN(u[1]) || isNaN(u[2])) continue;
      const l = u.map(B.degToRad),
        f = [u[0] - a[0], u[1] - a[1], u[2] - a[2]],
        p = [Math.abs(f[0]), Math.abs(f[1]), Math.abs(f[2])];
      if (p[0] >= 180 || p[1] >= 180 || p[2] >= 180) {
        const g = Math.max(...p) / 180,
          m = new ie(...h, s),
          T = new ie(...l, s),
          _ = new X().setFromEuler(m),
          y = new X().setFromEuler(T);
        _.dot(y) < 0 && y.set(-y.x, -y.y, -y.z, -y.w);
        const w = e.times[o - 1],
          v = e.times[o] - w,
          A = new X(),
          L = new ie();
        for (let P = 0; P < 1; P += 1 / g)
          (A.copy(_.clone().slerp(y.clone(), P)),
            i.push(w + P * v),
            L.setFromQuaternion(A, s),
            r.push(L.x),
            r.push(L.y),
            r.push(L.z));
      } else
        (i.push(e.times[o]),
          r.push(B.degToRad(e.values[o])),
          r.push(B.degToRad(t.values[o])),
          r.push(B.degToRad(n.values[o])));
    }
    return [i, r];
  }
}
class Ls {
  getPrevNode() {
    return this.nodeStack[this.currentIndent - 2];
  }
  getCurrentNode() {
    return this.nodeStack[this.currentIndent - 1];
  }
  getCurrentProp() {
    return this.currentProp;
  }
  pushStack(e) {
    (this.nodeStack.push(e), (this.currentIndent += 1));
  }
  popStack() {
    (this.nodeStack.pop(), (this.currentIndent -= 1));
  }
  setCurrentProp(e, t) {
    ((this.currentProp = e), (this.currentPropName = t));
  }
  parse(e) {
    ((this.currentIndent = 0),
      (this.allNodes = new Jt()),
      (this.nodeStack = []),
      (this.currentProp = []),
      (this.currentPropName = ""));
    const t = this,
      n = e.split(/[\r\n]+/);
    return (
      n.forEach(function (s, i) {
        const r = s.match(/^[\s\t]*;/),
          o = s.match(/^[\s\t]*$/);
        if (r || o) return;
        const a = s.match("^\\t{" + t.currentIndent + "}(\\w+):(.*){", ""),
          h = s.match("^\\t{" + t.currentIndent + "}(\\w+):[\\s\\t\\r\\n](.*)"),
          u = s.match("^\\t{" + (t.currentIndent - 1) + "}}");
        a
          ? t.parseNodeBegin(s, a)
          : h
            ? t.parseNodeProperty(s, h, n[++i])
            : u
              ? t.popStack()
              : s.match(/^[^\s\t}]/) && t.parseNodePropertyContinued(s);
      }),
      this.allNodes
    );
  }
  parseNodeBegin(e, t) {
    const n = t[1].trim().replace(/^"/, "").replace(/"$/, ""),
      s = t[2].split(",").map(function (a) {
        return a.trim().replace(/^"/, "").replace(/"$/, "");
      }),
      i = { name: n },
      r = this.parseNodeAttr(s),
      o = this.getCurrentNode();
    (this.currentIndent === 0
      ? this.allNodes.add(n, i)
      : n in o
        ? (n === "PoseNode" ? o.PoseNode.push(i) : o[n].id !== void 0 && ((o[n] = {}), (o[n][o[n].id] = o[n])),
          r.id !== "" && (o[n][r.id] = i))
        : typeof r.id == "number"
          ? ((o[n] = {}), (o[n][r.id] = i))
          : n !== "Properties70" && (n === "PoseNode" ? (o[n] = [i]) : (o[n] = i)),
      typeof r.id == "number" && (i.id = r.id),
      r.name !== "" && (i.attrName = r.name),
      r.type !== "" && (i.attrType = r.type),
      this.pushStack(i));
  }
  parseNodeAttr(e) {
    let t = e[0];
    e[0] !== "" && ((t = parseInt(e[0])), isNaN(t) && (t = e[0]));
    let n = "",
      s = "";
    return (e.length > 1 && ((n = e[1].replace(/^(\w+)::/, "")), (s = e[2])), { id: t, name: n, type: s });
  }
  parseNodeProperty(e, t, n) {
    let s = t[1].replace(/^"/, "").replace(/"$/, "").trim(),
      i = t[2].replace(/^"/, "").replace(/"$/, "").trim();
    s === "Content" && i === "," && (i = n.replace(/"/g, "").replace(/,$/, "").trim());
    const r = this.getCurrentNode();
    if (r.name === "Properties70") {
      this.parseNodeSpecialProperty(e, s, i);
      return;
    }
    if (s === "C") {
      const a = i.split(",").slice(1),
        h = parseInt(a[0]),
        u = parseInt(a[1]);
      let l = i.split(",").slice(3);
      ((l = l.map(function (f) {
        return f.trim().replace(/^"/, "");
      })),
        (s = "connections"),
        (i = [h, u]),
        Fs(i, l),
        r[s] === void 0 && (r[s] = []));
    }
    (s === "Node" && (r.id = i),
      s in r && Array.isArray(r[s]) ? r[s].push(i) : s !== "a" ? (r[s] = i) : (r.a = i),
      this.setCurrentProp(r, s),
      s === "a" && i.slice(-1) !== "," && (r.a = Ke(i)));
  }
  parseNodePropertyContinued(e) {
    const t = this.getCurrentNode();
    ((t.a += e), e.slice(-1) !== "," && (t.a = Ke(t.a)));
  }
  parseNodeSpecialProperty(e, t, n) {
    const s = n.split('",').map(function (u) {
        return u.trim().replace(/^\"/, "").replace(/\s/, "_");
      }),
      i = s[0],
      r = s[1],
      o = s[2],
      a = s[3];
    let h = s[4];
    switch (r) {
      case "int":
      case "enum":
      case "bool":
      case "ULongLong":
      case "double":
      case "Number":
      case "FieldOfView":
        h = parseFloat(h);
        break;
      case "Color":
      case "ColorRGB":
      case "Vector3D":
      case "Lcl_Translation":
      case "Lcl_Rotation":
      case "Lcl_Scaling":
        h = Ke(h);
        break;
    }
    ((this.getPrevNode()[i] = { type: r, type2: o, flag: a, value: h }), this.setCurrentProp(this.getPrevNode(), i));
  }
}
class Is {
  parse(e) {
    const t = new wt(e);
    t.skip(23);
    const n = t.getUint32();
    if (n < 6400) throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: " + n);
    const s = new Jt();
    for (; !this.endOfContent(t);) {
      const i = this.parseNode(t, n);
      i !== null && s.add(i.name, i);
    }
    return s;
  }
  endOfContent(e) {
    return e.size() % 16 === 0 ? ((e.getOffset() + 160 + 16) & -16) >= e.size() : e.getOffset() + 160 + 16 >= e.size();
  }
  parseNode(e, t) {
    const n = {},
      s = t >= 7500 ? e.getUint64() : e.getUint32(),
      i = t >= 7500 ? e.getUint64() : e.getUint32();
    t >= 7500 ? e.getUint64() : e.getUint32();
    const r = e.getUint8(),
      o = e.getString(r);
    if (s === 0) return null;
    const a = [];
    for (let f = 0; f < i; f++) a.push(this.parseProperty(e));
    const h = a.length > 0 ? a[0] : "",
      u = a.length > 1 ? a[1] : "",
      l = a.length > 2 ? a[2] : "";
    for (n.singleProperty = i === 1 && e.getOffset() === s; s > e.getOffset();) {
      const f = this.parseNode(e, t);
      f !== null && this.parseSubNode(o, n, f);
    }
    return (
      (n.propertyList = a),
      typeof h == "number" && (n.id = h),
      u !== "" && (n.attrName = u),
      l !== "" && (n.attrType = l),
      o !== "" && (n.name = o),
      n
    );
  }
  parseSubNode(e, t, n) {
    if (n.singleProperty === !0) {
      const s = n.propertyList[0];
      Array.isArray(s) ? ((t[n.name] = n), (n.a = s)) : (t[n.name] = s);
    } else if (e === "Connections" && n.name === "C") {
      const s = [];
      (n.propertyList.forEach(function (i, r) {
        r !== 0 && s.push(i);
      }),
        t.connections === void 0 && (t.connections = []),
        t.connections.push(s));
    } else if (n.name === "Properties70")
      Object.keys(n).forEach(function (i) {
        t[i] = n[i];
      });
    else if (e === "Properties70" && n.name === "P") {
      let s = n.propertyList[0],
        i = n.propertyList[1];
      const r = n.propertyList[2],
        o = n.propertyList[3];
      let a;
      (s.indexOf("Lcl ") === 0 && (s = s.replace("Lcl ", "Lcl_")),
        i.indexOf("Lcl ") === 0 && (i = i.replace("Lcl ", "Lcl_")),
        i === "Color" || i === "ColorRGB" || i === "Vector" || i === "Vector3D" || i.indexOf("Lcl_") === 0
          ? (a = [n.propertyList[4], n.propertyList[5], n.propertyList[6]])
          : (a = n.propertyList[4]),
        (t[s] = { type: i, type2: r, flag: o, value: a }));
    } else
      t[n.name] === void 0
        ? typeof n.id == "number"
          ? ((t[n.name] = {}), (t[n.name][n.id] = n))
          : (t[n.name] = n)
        : n.name === "PoseNode"
          ? (Array.isArray(t[n.name]) || (t[n.name] = [t[n.name]]), t[n.name].push(n))
          : t[n.name][n.id] === void 0 && (t[n.name][n.id] = n);
  }
  parseProperty(e) {
    const t = e.getString(1);
    let n;
    switch (t) {
      case "C":
        return e.getBoolean();
      case "D":
        return e.getFloat64();
      case "F":
        return e.getFloat32();
      case "I":
        return e.getInt32();
      case "L":
        return e.getInt64();
      case "R":
        return ((n = e.getUint32()), e.getArrayBuffer(n));
      case "S":
        return ((n = e.getUint32()), e.getString(n));
      case "Y":
        return e.getInt16();
      case "b":
      case "c":
      case "d":
      case "f":
      case "i":
      case "l":
        const s = e.getUint32(),
          i = e.getUint32(),
          r = e.getUint32();
        if (i === 0)
          switch (t) {
            case "b":
            case "c":
              return e.getBooleanArray(s);
            case "d":
              return e.getFloat64Array(s);
            case "f":
              return e.getFloat32Array(s);
            case "i":
              return e.getInt32Array(s);
            case "l":
              return e.getInt64Array(s);
          }
        const o = us(new Uint8Array(e.getArrayBuffer(r))),
          a = new wt(o.buffer);
        switch (t) {
          case "b":
          case "c":
            return a.getBooleanArray(s);
          case "d":
            return a.getFloat64Array(s);
          case "f":
            return a.getFloat32Array(s);
          case "i":
            return a.getInt32Array(s);
          case "l":
            return a.getInt64Array(s);
        }
        break;
      default:
        throw new Error("THREE.FBXLoader: Unknown property type " + t);
    }
  }
}
class wt {
  constructor(e, t) {
    ((this.dv = new DataView(e)),
      (this.offset = 0),
      (this.littleEndian = t !== void 0 ? t : !0),
      (this._textDecoder = new TextDecoder()));
  }
  getOffset() {
    return this.offset;
  }
  size() {
    return this.dv.buffer.byteLength;
  }
  skip(e) {
    this.offset += e;
  }
  getBoolean() {
    return (this.getUint8() & 1) === 1;
  }
  getBooleanArray(e) {
    const t = [];
    for (let n = 0; n < e; n++) t.push(this.getBoolean());
    return t;
  }
  getUint8() {
    const e = this.dv.getUint8(this.offset);
    return ((this.offset += 1), e);
  }
  getInt16() {
    const e = this.dv.getInt16(this.offset, this.littleEndian);
    return ((this.offset += 2), e);
  }
  getInt32() {
    const e = this.dv.getInt32(this.offset, this.littleEndian);
    return ((this.offset += 4), e);
  }
  getInt32Array(e) {
    const t = [];
    for (let n = 0; n < e; n++) t.push(this.getInt32());
    return t;
  }
  getUint32() {
    const e = this.dv.getUint32(this.offset, this.littleEndian);
    return ((this.offset += 4), e);
  }
  getInt64() {
    let e, t;
    return (
      this.littleEndian
        ? ((e = this.getUint32()), (t = this.getUint32()))
        : ((t = this.getUint32()), (e = this.getUint32())),
      t & 2147483648
        ? ((t = ~t & 4294967295),
          (e = ~e & 4294967295),
          e === 4294967295 && (t = (t + 1) & 4294967295),
          (e = (e + 1) & 4294967295),
          -(t * 4294967296 + e))
        : t * 4294967296 + e
    );
  }
  getInt64Array(e) {
    const t = [];
    for (let n = 0; n < e; n++) t.push(this.getInt64());
    return t;
  }
  getUint64() {
    let e, t;
    return (
      this.littleEndian
        ? ((e = this.getUint32()), (t = this.getUint32()))
        : ((t = this.getUint32()), (e = this.getUint32())),
      t * 4294967296 + e
    );
  }
  getFloat32() {
    const e = this.dv.getFloat32(this.offset, this.littleEndian);
    return ((this.offset += 4), e);
  }
  getFloat32Array(e) {
    const t = [];
    for (let n = 0; n < e; n++) t.push(this.getFloat32());
    return t;
  }
  getFloat64() {
    const e = this.dv.getFloat64(this.offset, this.littleEndian);
    return ((this.offset += 8), e);
  }
  getFloat64Array(e) {
    const t = [];
    for (let n = 0; n < e; n++) t.push(this.getFloat64());
    return t;
  }
  getArrayBuffer(e) {
    const t = this.dv.buffer.slice(this.offset, this.offset + e);
    return ((this.offset += e), t);
  }
  getString(e) {
    const t = this.offset;
    let n = new Uint8Array(this.dv.buffer, t, e);
    this.skip(e);
    const s = n.indexOf(0);
    return (s >= 0 && (n = new Uint8Array(this.dv.buffer, t, s)), this._textDecoder.decode(n));
  }
}
class Jt {
  add(e, t) {
    this[e] = t;
  }
}
function Ps(c) {
  const e = "Kaydara FBX Binary  \0";
  return c.byteLength >= e.length && e === en(c, 0, e.length);
}
function Ds(c) {
  const e = ["K", "a", "y", "d", "a", "r", "a", "\\", "F", "B", "X", "\\", "B", "i", "n", "a", "r", "y", "\\", "\\"];
  let t = 0;
  function n(s) {
    const i = c[s - 1];
    return ((c = c.slice(t + s)), t++, i);
  }
  for (let s = 0; s < e.length; ++s) if (n(1) === e[s]) return !1;
  return !0;
}
function Et(c) {
  const e = /FBXVersion: (\d+)/,
    t = c.match(e);
  if (t) return parseInt(t[1]);
  throw new Error("THREE.FBXLoader: Cannot find the version number for the file given.");
}
function Cs(c) {
  return c / 46186158e3;
}
const Os = [];
function Le(c, e, t, n) {
  let s;
  switch (n.mappingType) {
    case "ByPolygonVertex":
      s = c;
      break;
    case "ByPolygon":
      s = e;
      break;
    case "ByVertice":
      s = t;
      break;
    case "AllSame":
      s = n.indices[0];
      break;
    default:
      console.warn("THREE.FBXLoader: unknown attribute mapping type " + n.mappingType);
  }
  n.referenceType === "IndexToDirect" && (s = n.indices[s]);
  const i = s * n.dataSize,
    r = i + n.dataSize;
  return ks(Os, n.buffer, i, r);
}
const Ge = new ie(),
  le = new b();
function $t(c) {
  const e = new M(),
    t = new M(),
    n = new M(),
    s = new M(),
    i = new M(),
    r = new M(),
    o = new M(),
    a = new M(),
    h = new M(),
    u = new M(),
    l = new M(),
    f = new M(),
    p = c.inheritType ? c.inheritType : 0;
  c.translation && e.setPosition(le.fromArray(c.translation));
  const d = be(0);
  if (c.preRotation) {
    const R = c.preRotation.map(B.degToRad);
    (R.push(d), t.makeRotationFromEuler(Ge.fromArray(R)));
  }
  if (c.rotation) {
    const R = c.rotation.map(B.degToRad);
    (R.push(c.eulerOrder || d), n.makeRotationFromEuler(Ge.fromArray(R)));
  }
  if (c.postRotation) {
    const R = c.postRotation.map(B.degToRad);
    (R.push(d), s.makeRotationFromEuler(Ge.fromArray(R)), s.invert());
  }
  (c.scale && i.scale(le.fromArray(c.scale)),
    c.scalingOffset && o.setPosition(le.fromArray(c.scalingOffset)),
    c.scalingPivot && r.setPosition(le.fromArray(c.scalingPivot)),
    c.rotationOffset && a.setPosition(le.fromArray(c.rotationOffset)),
    c.rotationPivot && h.setPosition(le.fromArray(c.rotationPivot)),
    c.parentMatrixWorld && (l.copy(c.parentMatrix), u.copy(c.parentMatrixWorld)));
  const g = t.clone().multiply(n).multiply(s),
    m = new M();
  m.extractRotation(u);
  const T = new M();
  T.copyPosition(u);
  const _ = T.clone().invert().multiply(u),
    y = m.clone().invert().multiply(_),
    w = i,
    v = new M();
  if (p === 0) v.copy(m).multiply(g).multiply(y).multiply(w);
  else if (p === 1) v.copy(m).multiply(y).multiply(g).multiply(w);
  else {
    const re = new M().scale(new b().setFromMatrixScale(l)).clone().invert(),
      De = y.clone().multiply(re);
    v.copy(m).multiply(g).multiply(De).multiply(w);
  }
  const A = h.clone().invert(),
    L = r.clone().invert();
  let P = e
    .clone()
    .multiply(a)
    .multiply(h)
    .multiply(t)
    .multiply(n)
    .multiply(s)
    .multiply(A)
    .multiply(o)
    .multiply(r)
    .multiply(i)
    .multiply(L);
  const k = new M().copyPosition(P),
    K = u.clone().multiply(k);
  return (f.copyPosition(K), (P = f.clone().multiply(v)), P.premultiply(u.invert()), P);
}
function be(c) {
  c = c || 0;
  const e = ["ZYX", "YZX", "XZY", "ZXY", "YXZ", "XYZ"];
  return c === 6
    ? (console.warn(
        "THREE.FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect.",
      ),
      e[0])
    : e[c];
}
function Ke(c) {
  return c.split(",").map(function (t) {
    return parseFloat(t);
  });
}
function en(c, e, t) {
  return (
    e === void 0 && (e = 0),
    t === void 0 && (t = c.byteLength),
    new TextDecoder().decode(new Uint8Array(c, e, t))
  );
}
function Fs(c, e) {
  for (let t = 0, n = c.length, s = e.length; t < s; t++, n++) c[n] = e[t];
}
function ks(c, e, t, n) {
  for (let s = t, i = 0; s < n; s++, i++) c[i] = e[s];
  return c;
}
function xt(c, e) {
  if (e === _n)
    return (console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), c);
  if (e === et || e === Bt) {
    let t = c.getIndex();
    if (t === null) {
      const r = [],
        o = c.getAttribute("position");
      if (o !== void 0) {
        for (let a = 0; a < o.count; a++) r.push(a);
        (c.setIndex(r), (t = c.getIndex()));
      } else
        return (
          console.error(
            "THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.",
          ),
          c
        );
    }
    const n = t.count - 2,
      s = [];
    if (e === et) for (let r = 1; r <= n; r++) (s.push(t.getX(0)), s.push(t.getX(r)), s.push(t.getX(r + 1)));
    else
      for (let r = 0; r < n; r++)
        r % 2 === 0
          ? (s.push(t.getX(r)), s.push(t.getX(r + 1)), s.push(t.getX(r + 2)))
          : (s.push(t.getX(r + 2)), s.push(t.getX(r + 1)), s.push(t.getX(r)));
    s.length / 3 !== n &&
      console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    const i = c.clone();
    return (i.setIndex(s), i.clearGroups(), i);
  } else return (console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", e), c);
}
function Ns(c) {
  const e = new Map(),
    t = new Map(),
    n = c.clone();
  return (
    tn(c, n, function (s, i) {
      (e.set(i, s), t.set(s, i));
    }),
    n.traverse(function (s) {
      if (!s.isSkinnedMesh) return;
      const i = s,
        r = e.get(s),
        o = r.skeleton.bones;
      ((i.skeleton = r.skeleton.clone()),
        i.bindMatrix.copy(r.bindMatrix),
        (i.skeleton.bones = o.map(function (a) {
          return t.get(a);
        })),
        i.bind(i.skeleton, i.bindMatrix));
    }),
    n
  );
}
function tn(c, e, t) {
  t(c, e);
  for (let n = 0; n < c.children.length; n++) tn(c.children[n], e.children[n], t);
}
class Ei extends Pe {
  constructor(e) {
    (super(e),
      (this.dracoLoader = null),
      (this.ktx2Loader = null),
      (this.meshoptDecoder = null),
      (this.pluginCallbacks = []),
      this.register(function (t) {
        return new Gs(t);
      }),
      this.register(function (t) {
        return new Ks(t);
      }),
      this.register(function (t) {
        return new Js(t);
      }),
      this.register(function (t) {
        return new $s(t);
      }),
      this.register(function (t) {
        return new ei(t);
      }),
      this.register(function (t) {
        return new Vs(t);
      }),
      this.register(function (t) {
        return new Xs(t);
      }),
      this.register(function (t) {
        return new Ys(t);
      }),
      this.register(function (t) {
        return new Ws(t);
      }),
      this.register(function (t) {
        return new js(t);
      }),
      this.register(function (t) {
        return new Zs(t);
      }),
      this.register(function (t) {
        return new zs(t);
      }),
      this.register(function (t) {
        return new Qs(t);
      }),
      this.register(function (t) {
        return new qs(t);
      }),
      this.register(function (t) {
        return new Us(t);
      }),
      this.register(function (t) {
        return new vt(t, x.EXT_MESHOPT_COMPRESSION);
      }),
      this.register(function (t) {
        return new vt(t, x.KHR_MESHOPT_COMPRESSION);
      }),
      this.register(function (t) {
        return new ti(t);
      }));
  }
  load(e, t, n, s) {
    const i = this;
    let r;
    if (this.resourcePath !== "") r = this.resourcePath;
    else if (this.path !== "") {
      const h = de.extractUrlBase(e);
      r = de.resolveURL(h, this.path);
    } else r = de.extractUrlBase(e);
    this.manager.itemStart(e);
    const o = function (h) {
        (s ? s(h) : console.error(h), i.manager.itemError(e), i.manager.itemEnd(e));
      },
      a = new ot(this.manager);
    (a.setPath(this.path),
      a.setResponseType("arraybuffer"),
      a.setRequestHeader(this.requestHeader),
      a.setWithCredentials(this.withCredentials),
      a.load(
        e,
        function (h) {
          try {
            i.parse(
              h,
              r,
              function (u) {
                (t(u), i.manager.itemEnd(e));
              },
              o,
            );
          } catch (u) {
            o(u);
          }
        },
        n,
        o,
      ));
  }
  setDRACOLoader(e) {
    return ((this.dracoLoader = e), this);
  }
  setKTX2Loader(e) {
    return ((this.ktx2Loader = e), this);
  }
  setMeshoptDecoder(e) {
    return ((this.meshoptDecoder = e), this);
  }
  register(e) {
    return (this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this);
  }
  unregister(e) {
    return (
      this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1),
      this
    );
  }
  parse(e, t, n, s) {
    let i;
    const r = {},
      o = {},
      a = new TextDecoder();
    if (typeof e == "string") i = JSON.parse(e);
    else if (e instanceof ArrayBuffer)
      if (a.decode(new Uint8Array(e, 0, 4)) === nn) {
        try {
          r[x.KHR_BINARY_GLTF] = new ni(e);
        } catch (l) {
          s && s(l);
          return;
        }
        i = JSON.parse(r[x.KHR_BINARY_GLTF].content);
      } else i = JSON.parse(a.decode(e));
    else i = e;
    if (i.asset === void 0 || i.asset.version[0] < 2) {
      s && s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const h = new mi(i, {
      path: t || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder,
    });
    h.fileLoader.setRequestHeader(this.requestHeader);
    for (let u = 0; u < this.pluginCallbacks.length; u++) {
      const l = this.pluginCallbacks[u](h);
      (l.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),
        (o[l.name] = l),
        (r[l.name] = !0));
    }
    if (i.extensionsUsed)
      for (let u = 0; u < i.extensionsUsed.length; ++u) {
        const l = i.extensionsUsed[u],
          f = i.extensionsRequired || [];
        switch (l) {
          case x.KHR_MATERIALS_UNLIT:
            r[l] = new Hs();
            break;
          case x.KHR_DRACO_MESH_COMPRESSION:
            r[l] = new si(i, this.dracoLoader);
            break;
          case x.KHR_TEXTURE_TRANSFORM:
            r[l] = new ii();
            break;
          case x.KHR_MESH_QUANTIZATION:
            r[l] = new ri();
            break;
          default:
            f.indexOf(l) >= 0 && o[l] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + l + '".');
        }
      }
    (h.setExtensions(r), h.setPlugins(o), h.parse(n, s));
  }
  parseAsync(e, t) {
    const n = this;
    return new Promise(function (s, i) {
      n.parse(e, t, s, i);
    });
  }
}
function Bs() {
  let c = {};
  return {
    get: function (e) {
      return c[e];
    },
    add: function (e, t) {
      c[e] = t;
    },
    remove: function (e) {
      delete c[e];
    },
    removeAll: function () {
      c = {};
    },
  };
}
function C(c, e, t) {
  const n = c.json.materials[e];
  return n.extensions && n.extensions[t] ? n.extensions[t] : null;
}
const x = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
  KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
  EXT_MATERIALS_BUMP: "EXT_materials_bump",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_TEXTURE_AVIF: "EXT_texture_avif",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
  KHR_MESHOPT_COMPRESSION: "KHR_meshopt_compression",
  EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing",
};
class Us {
  constructor(e) {
    ((this.parser = e), (this.name = x.KHR_LIGHTS_PUNCTUAL), (this.cache = { refs: {}, uses: {} }));
  }
  _markDefs() {
    const e = this.parser,
      t = this.parser.json.nodes || [];
    for (let n = 0, s = t.length; n < s; n++) {
      const i = t[n];
      i.extensions &&
        i.extensions[this.name] &&
        i.extensions[this.name].light !== void 0 &&
        e._addNodeRef(this.cache, i.extensions[this.name].light);
    }
  }
  _loadLight(e) {
    const t = this.parser,
      n = "light:" + e;
    let s = t.cache.get(n);
    if (s) return s;
    const i = t.json,
      a = (((i.extensions && i.extensions[this.name]) || {}).lights || [])[e];
    let h;
    const u = new U(16777215);
    a.color !== void 0 && u.setRGB(a.color[0], a.color[1], a.color[2], $);
    const l = a.range !== void 0 ? a.range : 0;
    switch (a.type) {
      case "directional":
        ((h = new Pt(u)), h.target.position.set(0, 0, -1), h.add(h.target));
        break;
      case "point":
        ((h = new qe(u)), (h.distance = l));
        break;
      case "spot":
        ((h = new It(u)),
          (h.distance = l),
          (a.spot = a.spot || {}),
          (a.spot.innerConeAngle = a.spot.innerConeAngle !== void 0 ? a.spot.innerConeAngle : 0),
          (a.spot.outerConeAngle = a.spot.outerConeAngle !== void 0 ? a.spot.outerConeAngle : Math.PI / 4),
          (h.angle = a.spot.outerConeAngle),
          (h.penumbra = 1 - a.spot.innerConeAngle / a.spot.outerConeAngle),
          h.target.position.set(0, 0, -1),
          h.add(h.target));
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + a.type);
    }
    return (
      h.position.set(0, 0, 0),
      Z(h, a),
      a.intensity !== void 0 && (h.intensity = a.intensity),
      (h.name = t.createUniqueName(a.name || "light_" + e)),
      (s = Promise.resolve(h)),
      t.cache.add(n, s),
      s
    );
  }
  getDependency(e, t) {
    if (e === "light") return this._loadLight(t);
  }
  createNodeAttachment(e) {
    const t = this,
      n = this.parser,
      i = n.json.nodes[e],
      o = ((i.extensions && i.extensions[this.name]) || {}).light;
    return o === void 0
      ? null
      : this._loadLight(o).then(function (a) {
          return n._getNodeRef(t.cache, o, a);
        });
  }
}
class Hs {
  constructor() {
    this.name = x.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return Te;
  }
  extendParams(e, t, n) {
    const s = [];
    ((e.color = new U(1, 1, 1)), (e.opacity = 1));
    const i = t.pbrMetallicRoughness;
    if (i) {
      if (Array.isArray(i.baseColorFactor)) {
        const r = i.baseColorFactor;
        (e.color.setRGB(r[0], r[1], r[2], $), (e.opacity = r[3]));
      }
      i.baseColorTexture !== void 0 && s.push(n.assignTexture(e, "map", i.baseColorTexture, F));
    }
    return Promise.all(s);
  }
}
class js {
  constructor(e) {
    ((this.parser = e), (this.name = x.KHR_MATERIALS_EMISSIVE_STRENGTH));
  }
  extendMaterialParams(e, t) {
    const n = C(this.parser, e, this.name);
    return (
      n === null || (n.emissiveStrength !== void 0 && (t.emissiveIntensity = n.emissiveStrength)),
      Promise.resolve()
    );
  }
}
class Gs {
  constructor(e) {
    ((this.parser = e), (this.name = x.KHR_MATERIALS_CLEARCOAT));
  }
  getMaterialType(e) {
    return C(this.parser, e, this.name) !== null ? J : null;
  }
  extendMaterialParams(e, t) {
    const n = C(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    if (
      (n.clearcoatFactor !== void 0 && (t.clearcoat = n.clearcoatFactor),
      n.clearcoatTexture !== void 0 && s.push(this.parser.assignTexture(t, "clearcoatMap", n.clearcoatTexture)),
      n.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = n.clearcoatRoughnessFactor),
      n.clearcoatRoughnessTexture !== void 0 &&
        s.push(this.parser.assignTexture(t, "clearcoatRoughnessMap", n.clearcoatRoughnessTexture)),
      n.clearcoatNormalTexture !== void 0 &&
        (s.push(this.parser.assignTexture(t, "clearcoatNormalMap", n.clearcoatNormalTexture)),
        n.clearcoatNormalTexture.scale !== void 0))
    ) {
      const i = n.clearcoatNormalTexture.scale;
      t.clearcoatNormalScale = new j(i, i);
    }
    return Promise.all(s);
  }
}
class Ks {
  constructor(e) {
    ((this.parser = e), (this.name = x.KHR_MATERIALS_DISPERSION));
  }
  getMaterialType(e) {
    return C(this.parser, e, this.name) !== null ? J : null;
  }
  extendMaterialParams(e, t) {
    const n = C(this.parser, e, this.name);
    return (n === null || (t.dispersion = n.dispersion !== void 0 ? n.dispersion : 0), Promise.resolve());
  }
}
class zs {
  constructor(e) {
    ((this.parser = e), (this.name = x.KHR_MATERIALS_IRIDESCENCE));
  }
  getMaterialType(e) {
    return C(this.parser, e, this.name) !== null ? J : null;
  }
  extendMaterialParams(e, t) {
    const n = C(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    return (
      n.iridescenceFactor !== void 0 && (t.iridescence = n.iridescenceFactor),
      n.iridescenceTexture !== void 0 && s.push(this.parser.assignTexture(t, "iridescenceMap", n.iridescenceTexture)),
      n.iridescenceIor !== void 0 && (t.iridescenceIOR = n.iridescenceIor),
      t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]),
      n.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = n.iridescenceThicknessMinimum),
      n.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = n.iridescenceThicknessMaximum),
      n.iridescenceThicknessTexture !== void 0 &&
        s.push(this.parser.assignTexture(t, "iridescenceThicknessMap", n.iridescenceThicknessTexture)),
      Promise.all(s)
    );
  }
}
class Vs {
  constructor(e) {
    ((this.parser = e), (this.name = x.KHR_MATERIALS_SHEEN));
  }
  getMaterialType(e) {
    return C(this.parser, e, this.name) !== null ? J : null;
  }
  extendMaterialParams(e, t) {
    const n = C(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    if (((t.sheenColor = new U(0, 0, 0)), (t.sheenRoughness = 0), (t.sheen = 1), n.sheenColorFactor !== void 0)) {
      const i = n.sheenColorFactor;
      t.sheenColor.setRGB(i[0], i[1], i[2], $);
    }
    return (
      n.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = n.sheenRoughnessFactor),
      n.sheenColorTexture !== void 0 && s.push(this.parser.assignTexture(t, "sheenColorMap", n.sheenColorTexture, F)),
      n.sheenRoughnessTexture !== void 0 &&
        s.push(this.parser.assignTexture(t, "sheenRoughnessMap", n.sheenRoughnessTexture)),
      Promise.all(s)
    );
  }
}
class Xs {
  constructor(e) {
    ((this.parser = e), (this.name = x.KHR_MATERIALS_TRANSMISSION));
  }
  getMaterialType(e) {
    return C(this.parser, e, this.name) !== null ? J : null;
  }
  extendMaterialParams(e, t) {
    const n = C(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    return (
      n.transmissionFactor !== void 0 && (t.transmission = n.transmissionFactor),
      n.transmissionTexture !== void 0 &&
        s.push(this.parser.assignTexture(t, "transmissionMap", n.transmissionTexture)),
      Promise.all(s)
    );
  }
}
class Ys {
  constructor(e) {
    ((this.parser = e), (this.name = x.KHR_MATERIALS_VOLUME));
  }
  getMaterialType(e) {
    return C(this.parser, e, this.name) !== null ? J : null;
  }
  extendMaterialParams(e, t) {
    const n = C(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    ((t.thickness = n.thicknessFactor !== void 0 ? n.thicknessFactor : 0),
      n.thicknessTexture !== void 0 && s.push(this.parser.assignTexture(t, "thicknessMap", n.thicknessTexture)),
      (t.attenuationDistance = n.attenuationDistance || 1 / 0));
    const i = n.attenuationColor || [1, 1, 1];
    return ((t.attenuationColor = new U().setRGB(i[0], i[1], i[2], $)), Promise.all(s));
  }
}
class Ws {
  constructor(e) {
    ((this.parser = e), (this.name = x.KHR_MATERIALS_IOR));
  }
  getMaterialType(e) {
    return C(this.parser, e, this.name) !== null ? J : null;
  }
  extendMaterialParams(e, t) {
    const n = C(this.parser, e, this.name);
    return (n === null || ((t.ior = n.ior !== void 0 ? n.ior : 1.5), t.ior === 0 && (t.ior = 1e3)), Promise.resolve());
  }
}
class Zs {
  constructor(e) {
    ((this.parser = e), (this.name = x.KHR_MATERIALS_SPECULAR));
  }
  getMaterialType(e) {
    return C(this.parser, e, this.name) !== null ? J : null;
  }
  extendMaterialParams(e, t) {
    const n = C(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    ((t.specularIntensity = n.specularFactor !== void 0 ? n.specularFactor : 1),
      n.specularTexture !== void 0 && s.push(this.parser.assignTexture(t, "specularIntensityMap", n.specularTexture)));
    const i = n.specularColorFactor || [1, 1, 1];
    return (
      (t.specularColor = new U().setRGB(i[0], i[1], i[2], $)),
      n.specularColorTexture !== void 0 &&
        s.push(this.parser.assignTexture(t, "specularColorMap", n.specularColorTexture, F)),
      Promise.all(s)
    );
  }
}
class qs {
  constructor(e) {
    ((this.parser = e), (this.name = x.EXT_MATERIALS_BUMP));
  }
  getMaterialType(e) {
    return C(this.parser, e, this.name) !== null ? J : null;
  }
  extendMaterialParams(e, t) {
    const n = C(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    return (
      (t.bumpScale = n.bumpFactor !== void 0 ? n.bumpFactor : 1),
      n.bumpTexture !== void 0 && s.push(this.parser.assignTexture(t, "bumpMap", n.bumpTexture)),
      Promise.all(s)
    );
  }
}
class Qs {
  constructor(e) {
    ((this.parser = e), (this.name = x.KHR_MATERIALS_ANISOTROPY));
  }
  getMaterialType(e) {
    return C(this.parser, e, this.name) !== null ? J : null;
  }
  extendMaterialParams(e, t) {
    const n = C(this.parser, e, this.name);
    if (n === null) return Promise.resolve();
    const s = [];
    return (
      n.anisotropyStrength !== void 0 && (t.anisotropy = n.anisotropyStrength),
      n.anisotropyRotation !== void 0 && (t.anisotropyRotation = n.anisotropyRotation),
      n.anisotropyTexture !== void 0 && s.push(this.parser.assignTexture(t, "anisotropyMap", n.anisotropyTexture)),
      Promise.all(s)
    );
  }
}
class Js {
  constructor(e) {
    ((this.parser = e), (this.name = x.KHR_TEXTURE_BASISU));
  }
  loadTexture(e) {
    const t = this.parser,
      n = t.json,
      s = n.textures[e];
    if (!s.extensions || !s.extensions[this.name]) return null;
    const i = s.extensions[this.name],
      r = t.options.ktx2Loader;
    if (!r) {
      if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0)
        throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return t.loadTextureImage(e, i.source, r);
  }
}
class $s {
  constructor(e) {
    ((this.parser = e), (this.name = x.EXT_TEXTURE_WEBP));
  }
  loadTexture(e) {
    const t = this.name,
      n = this.parser,
      s = n.json,
      i = s.textures[e];
    if (!i.extensions || !i.extensions[t]) return null;
    const r = i.extensions[t],
      o = s.images[r.source];
    let a = n.textureLoader;
    if (o.uri) {
      const h = n.options.manager.getHandler(o.uri);
      h !== null && (a = h);
    }
    return n.loadTextureImage(e, r.source, a);
  }
}
class ei {
  constructor(e) {
    ((this.parser = e), (this.name = x.EXT_TEXTURE_AVIF));
  }
  loadTexture(e) {
    const t = this.name,
      n = this.parser,
      s = n.json,
      i = s.textures[e];
    if (!i.extensions || !i.extensions[t]) return null;
    const r = i.extensions[t],
      o = s.images[r.source];
    let a = n.textureLoader;
    if (o.uri) {
      const h = n.options.manager.getHandler(o.uri);
      h !== null && (a = h);
    }
    return n.loadTextureImage(e, r.source, a);
  }
}
class vt {
  constructor(e, t) {
    ((this.name = t), (this.parser = e));
  }
  loadBufferView(e) {
    const t = this.parser.json,
      n = t.bufferViews[e];
    if (n.extensions && n.extensions[this.name]) {
      const s = n.extensions[this.name],
        i = this.parser.getDependency("buffer", s.buffer),
        r = this.parser.options.meshoptDecoder;
      if (!r || !r.supported) {
        if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0)
          throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        return null;
      }
      return i.then(function (o) {
        const a = s.byteOffset || 0,
          h = s.byteLength || 0,
          u = s.count,
          l = s.byteStride,
          f = new Uint8Array(o, a, h);
        return r.decodeGltfBufferAsync
          ? r.decodeGltfBufferAsync(u, l, f, s.mode, s.filter).then(function (p) {
              return p.buffer;
            })
          : r.ready.then(function () {
              const p = new ArrayBuffer(u * l);
              return (r.decodeGltfBuffer(new Uint8Array(p), u, l, f, s.mode, s.filter), p);
            });
      });
    } else return null;
  }
}
class ti {
  constructor(e) {
    ((this.name = x.EXT_MESH_GPU_INSTANCING), (this.parser = e));
  }
  createNodeMesh(e) {
    const t = this.parser.json,
      n = t.nodes[e];
    if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0) return null;
    const s = t.meshes[n.mesh];
    for (const h of s.primitives)
      if (h.mode !== V.TRIANGLES && h.mode !== V.TRIANGLE_STRIP && h.mode !== V.TRIANGLE_FAN && h.mode !== void 0)
        return null;
    const r = n.extensions[this.name].attributes,
      o = [],
      a = {};
    for (const h in r) o.push(this.parser.getDependency("accessor", r[h]).then((u) => ((a[h] = u), a[h])));
    return o.length < 1
      ? null
      : (o.push(this.parser.createNodeMesh(e)),
        Promise.all(o).then((h) => {
          const u = h.pop(),
            l = u.isGroup ? u.children : [u],
            f = h[0].count,
            p = [];
          for (const d of l) {
            const g = new M(),
              m = new b(),
              T = new X(),
              _ = new b(1, 1, 1),
              y = new wn(d.geometry, d.material, f);
            for (let w = 0; w < f; w++)
              (a.TRANSLATION && m.fromBufferAttribute(a.TRANSLATION, w),
                a.ROTATION && T.fromBufferAttribute(a.ROTATION, w),
                a.SCALE && _.fromBufferAttribute(a.SCALE, w),
                y.setMatrixAt(w, g.compose(m, T, _)));
            for (const w in a)
              if (w === "_COLOR_0") {
                const v = a[w];
                y.instanceColor = new En(v.array, v.itemSize, v.normalized);
              } else w !== "TRANSLATION" && w !== "ROTATION" && w !== "SCALE" && d.geometry.setAttribute(w, a[w]);
            (ue.prototype.copy.call(y, d), this.parser.assignFinalMaterial(y), p.push(y));
          }
          return u.isGroup ? (u.clear(), u.add(...p), u) : p[0];
        }));
  }
}
const nn = "glTF",
  ye = 12,
  bt = { JSON: 1313821514, BIN: 5130562 };
class ni {
  constructor(e) {
    ((this.name = x.KHR_BINARY_GLTF), (this.content = null), (this.body = null));
    const t = new DataView(e, 0, ye),
      n = new TextDecoder();
    if (
      ((this.header = {
        magic: n.decode(new Uint8Array(e.slice(0, 4))),
        version: t.getUint32(4, !0),
        length: t.getUint32(8, !0),
      }),
      this.header.magic !== nn)
    )
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2) throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const s = this.header.length - ye,
      i = new DataView(e, ye);
    let r = 0;
    for (; r < s;) {
      const o = i.getUint32(r, !0);
      r += 4;
      const a = i.getUint32(r, !0);
      if (((r += 4), a === bt.JSON)) {
        const h = new Uint8Array(e, ye + r, o);
        this.content = n.decode(h);
      } else if (a === bt.BIN) {
        const h = ye + r;
        this.body = e.slice(h, h + o);
      }
      r += o;
    }
    if (this.content === null) throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}
class si {
  constructor(e, t) {
    if (!t) throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    ((this.name = x.KHR_DRACO_MESH_COMPRESSION), (this.json = e), (this.dracoLoader = t), this.dracoLoader.preload());
  }
  decodePrimitive(e, t) {
    const n = this.json,
      s = this.dracoLoader,
      i = e.extensions[this.name].bufferView,
      r = e.extensions[this.name].attributes,
      o = {},
      a = {},
      h = {};
    for (const u in r) {
      const l = it[u] || u.toLowerCase();
      o[l] = r[u];
    }
    for (const u in e.attributes) {
      const l = it[u] || u.toLowerCase();
      if (r[u] !== void 0) {
        const f = n.accessors[e.attributes[u]],
          p = me[f.componentType];
        ((h[l] = p.name), (a[l] = f.normalized === !0));
      }
    }
    return t.getDependency("bufferView", i).then(function (u) {
      return new Promise(function (l, f) {
        s.decodeDracoFile(
          u,
          function (p) {
            for (const d in p.attributes) {
              const g = p.attributes[d],
                m = a[d];
              m !== void 0 && (g.normalized = m);
            }
            l(p);
          },
          o,
          h,
          $,
          f,
        );
      });
    });
  }
}
class ii {
  constructor() {
    this.name = x.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(e, t) {
    return (
      ((t.texCoord === void 0 || t.texCoord === e.channel) &&
        t.offset === void 0 &&
        t.rotation === void 0 &&
        t.scale === void 0) ||
        ((e = e.clone()),
        t.texCoord !== void 0 && (e.channel = t.texCoord),
        t.offset !== void 0 && e.offset.fromArray(t.offset),
        t.rotation !== void 0 && (e.rotation = t.rotation),
        t.scale !== void 0 && e.repeat.fromArray(t.scale),
        (e.needsUpdate = !0)),
      e
    );
  }
}
class ri {
  constructor() {
    this.name = x.KHR_MESH_QUANTIZATION;
  }
}
class sn extends Nn {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
  copySampleValue_(e) {
    const t = this.resultBuffer,
      n = this.sampleValues,
      s = this.valueSize,
      i = e * s * 3 + s;
    for (let r = 0; r !== s; r++) t[r] = n[i + r];
    return t;
  }
  interpolate_(e, t, n, s) {
    const i = this.resultBuffer,
      r = this.sampleValues,
      o = this.valueSize,
      a = o * 2,
      h = o * 3,
      u = s - t,
      l = (n - t) / u,
      f = l * l,
      p = f * l,
      d = e * h,
      g = d - h,
      m = -2 * p + 3 * f,
      T = p - f,
      _ = 1 - m,
      y = T - f + l;
    for (let w = 0; w !== o; w++) {
      const v = r[g + w + o],
        A = r[g + w + a] * u,
        L = r[d + w + o],
        P = r[d + w] * u;
      i[w] = _ * v + y * A + m * L + T * P;
    }
    return i;
  }
}
const oi = new X();
class ai extends sn {
  interpolate_(e, t, n, s) {
    const i = super.interpolate_(e, t, n, s);
    return (oi.fromArray(i).normalize().toArray(i), i);
  }
}
const V = { POINTS: 0, LINES: 1, LINE_LOOP: 2, LINE_STRIP: 3, TRIANGLES: 4, TRIANGLE_STRIP: 5, TRIANGLE_FAN: 6 },
  me = {
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array,
  },
  At = { 9728: Ht, 9729: tt, 9984: Rn, 9985: An, 9986: bn, 9987: Ut },
  Rt = { 33071: Ye, 33648: Sn, 10497: xe },
  ze = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 },
  it = {
    POSITION: "position",
    NORMAL: "normal",
    TANGENT: "tangent",
    TEXCOORD_0: "uv",
    TEXCOORD_1: "uv1",
    TEXCOORD_2: "uv2",
    TEXCOORD_3: "uv3",
    COLOR_0: "color",
    WEIGHTS_0: "skinWeight",
    JOINTS_0: "skinIndex",
  },
  ne = { scale: "scale", translation: "position", rotation: "quaternion", weights: "morphTargetInfluences" },
  ci = { CUBICSPLINE: void 0, LINEAR: Gt, STEP: On },
  Ve = { OPAQUE: "OPAQUE", MASK: "MASK", BLEND: "BLEND" };
function li(c) {
  return (
    c.DefaultMaterial === void 0 &&
      (c.DefaultMaterial = new jt({
        color: 16777215,
        emissive: 0,
        metalness: 1,
        roughness: 1,
        transparent: !1,
        depthTest: !0,
        side: kn,
      })),
    c.DefaultMaterial
  );
}
function se(c, e, t) {
  for (const n in t.extensions)
    c[n] === void 0 &&
      ((e.userData.gltfExtensions = e.userData.gltfExtensions || {}), (e.userData.gltfExtensions[n] = t.extensions[n]));
}
function Z(c, e) {
  e.extras !== void 0 &&
    (typeof e.extras == "object"
      ? Object.assign(c.userData, e.extras)
      : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras));
}
function hi(c, e, t) {
  let n = !1,
    s = !1,
    i = !1;
  for (let h = 0, u = e.length; h < u; h++) {
    const l = e[h];
    if (
      (l.POSITION !== void 0 && (n = !0),
      l.NORMAL !== void 0 && (s = !0),
      l.COLOR_0 !== void 0 && (i = !0),
      n && s && i)
    )
      break;
  }
  if (!n && !s && !i) return Promise.resolve(c);
  const r = [],
    o = [],
    a = [];
  for (let h = 0, u = e.length; h < u; h++) {
    const l = e[h];
    if (n) {
      const f = l.POSITION !== void 0 ? t.getDependency("accessor", l.POSITION) : c.attributes.position;
      r.push(f);
    }
    if (s) {
      const f = l.NORMAL !== void 0 ? t.getDependency("accessor", l.NORMAL) : c.attributes.normal;
      o.push(f);
    }
    if (i) {
      const f = l.COLOR_0 !== void 0 ? t.getDependency("accessor", l.COLOR_0) : c.attributes.color;
      a.push(f);
    }
  }
  return Promise.all([Promise.all(r), Promise.all(o), Promise.all(a)]).then(function (h) {
    const u = h[0],
      l = h[1],
      f = h[2];
    return (
      n && (c.morphAttributes.position = u),
      s && (c.morphAttributes.normal = l),
      i && (c.morphAttributes.color = f),
      (c.morphTargetsRelative = !0),
      c
    );
  });
}
function ui(c, e) {
  if ((c.updateMorphTargets(), e.weights !== void 0))
    for (let t = 0, n = e.weights.length; t < n; t++) c.morphTargetInfluences[t] = e.weights[t];
  if (e.extras && Array.isArray(e.extras.targetNames)) {
    const t = e.extras.targetNames;
    if (c.morphTargetInfluences.length === t.length) {
      c.morphTargetDictionary = {};
      for (let n = 0, s = t.length; n < s; n++) c.morphTargetDictionary[t[n]] = n;
    } else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function fi(c) {
  let e;
  const t = c.extensions && c.extensions[x.KHR_DRACO_MESH_COMPRESSION];
  if (
    (t
      ? (e = "draco:" + t.bufferView + ":" + t.indices + ":" + Xe(t.attributes))
      : (e = c.indices + ":" + Xe(c.attributes) + ":" + c.mode),
    c.targets !== void 0)
  )
    for (let n = 0, s = c.targets.length; n < s; n++) e += ":" + Xe(c.targets[n]);
  return e;
}
function Xe(c) {
  let e = "";
  const t = Object.keys(c).sort();
  for (let n = 0, s = t.length; n < s; n++) e += t[n] + ":" + c[t[n]] + ";";
  return e;
}
function rt(c) {
  switch (c) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function pi(c) {
  return c.search(/\.jpe?g($|\?)/i) > 0 || c.search(/^data\:image\/jpeg/) === 0
    ? "image/jpeg"
    : c.search(/\.webp($|\?)/i) > 0 || c.search(/^data\:image\/webp/) === 0
      ? "image/webp"
      : c.search(/\.ktx2($|\?)/i) > 0 || c.search(/^data\:image\/ktx2/) === 0
        ? "image/ktx2"
        : "image/png";
}
const di = new M();
class mi {
  constructor(e = {}, t = {}) {
    ((this.json = e),
      (this.extensions = {}),
      (this.plugins = {}),
      (this.options = t),
      (this.cache = new Bs()),
      (this.associations = new Map()),
      (this.primitiveCache = {}),
      (this.nodeCache = {}),
      (this.meshCache = { refs: {}, uses: {} }),
      (this.cameraCache = { refs: {}, uses: {} }),
      (this.lightCache = { refs: {}, uses: {} }),
      (this.sourceCache = {}),
      (this.textureCache = {}),
      (this.nodeNamesUsed = {}));
    let n = !1,
      s = -1,
      i = !1,
      r = -1;
    if (typeof navigator < "u" && typeof navigator.userAgent < "u") {
      const o = navigator.userAgent;
      n = /^((?!chrome|android).)*safari/i.test(o) === !0;
      const a = o.match(/Version\/(\d+)/);
      ((s = n && a ? parseInt(a[1], 10) : -1),
        (i = o.indexOf("Firefox") > -1),
        (r = i ? o.match(/Firefox\/([0-9]+)\./)[1] : -1));
    }
    (typeof createImageBitmap > "u" || (n && s < 17) || (i && r < 98)
      ? (this.textureLoader = new Mt(this.options.manager))
      : (this.textureLoader = new xn(this.options.manager)),
      this.textureLoader.setCrossOrigin(this.options.crossOrigin),
      this.textureLoader.setRequestHeader(this.options.requestHeader),
      (this.fileLoader = new ot(this.options.manager)),
      this.fileLoader.setResponseType("arraybuffer"),
      this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0));
  }
  setExtensions(e) {
    this.extensions = e;
  }
  setPlugins(e) {
    this.plugins = e;
  }
  parse(e, t) {
    const n = this,
      s = this.json,
      i = this.extensions;
    (this.cache.removeAll(),
      (this.nodeCache = {}),
      this._invokeAll(function (r) {
        return r._markDefs && r._markDefs();
      }),
      Promise.all(
        this._invokeAll(function (r) {
          return r.beforeRoot && r.beforeRoot();
        }),
      )
        .then(function () {
          return Promise.all([n.getDependencies("scene"), n.getDependencies("animation"), n.getDependencies("camera")]);
        })
        .then(function (r) {
          const o = {
            scene: r[0][s.scene || 0],
            scenes: r[0],
            animations: r[1],
            cameras: r[2],
            asset: s.asset,
            parser: n,
            userData: {},
          };
          return (
            se(i, o, s),
            Z(o, s),
            Promise.all(
              n._invokeAll(function (a) {
                return a.afterRoot && a.afterRoot(o);
              }),
            ).then(function () {
              for (const a of o.scenes) a.updateMatrixWorld();
              e(o);
            })
          );
        })
        .catch(t));
  }
  _markDefs() {
    const e = this.json.nodes || [],
      t = this.json.skins || [],
      n = this.json.meshes || [];
    for (let s = 0, i = t.length; s < i; s++) {
      const r = t[s].joints;
      for (let o = 0, a = r.length; o < a; o++) e[r[o]].isBone = !0;
    }
    for (let s = 0, i = e.length; s < i; s++) {
      const r = e[s];
      (r.mesh !== void 0 &&
        (this._addNodeRef(this.meshCache, r.mesh), r.skin !== void 0 && (n[r.mesh].isSkinnedMesh = !0)),
        r.camera !== void 0 && this._addNodeRef(this.cameraCache, r.camera));
    }
  }
  _addNodeRef(e, t) {
    t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
  }
  _getNodeRef(e, t, n) {
    if (e.refs[t] <= 1) return n;
    const s = n.clone(),
      i = (r, o) => {
        const a = this.associations.get(r);
        a != null && this.associations.set(o, a);
        for (const [h, u] of r.children.entries()) i(u, o.children[h]);
      };
    return (i(n, s), (s.name += "_instance_" + e.uses[t]++), s);
  }
  _invokeOne(e) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let n = 0; n < t.length; n++) {
      const s = e(t[n]);
      if (s) return s;
    }
    return null;
  }
  _invokeAll(e) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const n = [];
    for (let s = 0; s < t.length; s++) {
      const i = e(t[s]);
      i && n.push(i);
    }
    return n;
  }
  getDependency(e, t) {
    const n = e + ":" + t;
    let s = this.cache.get(n);
    if (!s) {
      switch (e) {
        case "scene":
          s = this.loadScene(t);
          break;
        case "node":
          s = this._invokeOne(function (i) {
            return i.loadNode && i.loadNode(t);
          });
          break;
        case "mesh":
          s = this._invokeOne(function (i) {
            return i.loadMesh && i.loadMesh(t);
          });
          break;
        case "accessor":
          s = this.loadAccessor(t);
          break;
        case "bufferView":
          s = this._invokeOne(function (i) {
            return i.loadBufferView && i.loadBufferView(t);
          });
          break;
        case "buffer":
          s = this.loadBuffer(t);
          break;
        case "material":
          s = this._invokeOne(function (i) {
            return i.loadMaterial && i.loadMaterial(t);
          });
          break;
        case "texture":
          s = this._invokeOne(function (i) {
            return i.loadTexture && i.loadTexture(t);
          });
          break;
        case "skin":
          s = this.loadSkin(t);
          break;
        case "animation":
          s = this._invokeOne(function (i) {
            return i.loadAnimation && i.loadAnimation(t);
          });
          break;
        case "camera":
          s = this.loadCamera(t);
          break;
        default:
          if (
            ((s = this._invokeOne(function (i) {
              return i != this && i.getDependency && i.getDependency(e, t);
            })),
            !s)
          )
            throw new Error("Unknown type: " + e);
          break;
      }
      this.cache.add(n, s);
    }
    return s;
  }
  getDependencies(e) {
    let t = this.cache.get(e);
    if (!t) {
      const n = this,
        s = this.json[e + (e === "mesh" ? "es" : "s")] || [];
      ((t = Promise.all(
        s.map(function (i, r) {
          return n.getDependency(e, r);
        }),
      )),
        this.cache.add(e, t));
    }
    return t;
  }
  loadBuffer(e) {
    const t = this.json.buffers[e],
      n = this.fileLoader;
    if (t.type && t.type !== "arraybuffer")
      throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
    if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[x.KHR_BINARY_GLTF].body);
    const s = this.options;
    return new Promise(function (i, r) {
      n.load(de.resolveURL(t.uri, s.path), i, void 0, function () {
        r(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
      });
    });
  }
  loadBufferView(e) {
    const t = this.json.bufferViews[e];
    return this.getDependency("buffer", t.buffer).then(function (n) {
      const s = t.byteLength || 0,
        i = t.byteOffset || 0;
      return n.slice(i, i + s);
    });
  }
  loadAccessor(e) {
    const t = this,
      n = this.json,
      s = this.json.accessors[e];
    if (s.bufferView === void 0 && s.sparse === void 0) {
      const r = ze[s.type],
        o = me[s.componentType],
        a = s.normalized === !0,
        h = new o(s.count * r);
      return Promise.resolve(new ke(h, r, a));
    }
    const i = [];
    return (
      s.bufferView !== void 0 ? i.push(this.getDependency("bufferView", s.bufferView)) : i.push(null),
      s.sparse !== void 0 &&
        (i.push(this.getDependency("bufferView", s.sparse.indices.bufferView)),
        i.push(this.getDependency("bufferView", s.sparse.values.bufferView))),
      Promise.all(i).then(function (r) {
        const o = r[0],
          a = ze[s.type],
          h = me[s.componentType],
          u = h.BYTES_PER_ELEMENT,
          l = u * a,
          f = s.byteOffset || 0,
          p = s.bufferView !== void 0 ? n.bufferViews[s.bufferView].byteStride : void 0,
          d = s.normalized === !0;
        let g, m;
        if (p && p !== l) {
          const T = Math.floor(f / p),
            _ = "InterleavedBuffer:" + s.bufferView + ":" + s.componentType + ":" + T + ":" + s.count;
          let y = t.cache.get(_);
          (y || ((g = new h(o, T * p, (s.count * p) / u)), (y = new vn(g, p / u)), t.cache.add(_, y)),
            (m = new Fn(y, a, (f % p) / u, d)));
        } else (o === null ? (g = new h(s.count * a)) : (g = new h(o, f, s.count * a)), (m = new ke(g, a, d)));
        if (s.sparse !== void 0) {
          const T = ze.SCALAR,
            _ = me[s.sparse.indices.componentType],
            y = s.sparse.indices.byteOffset || 0,
            w = s.sparse.values.byteOffset || 0,
            v = new _(r[1], y, s.sparse.count * T),
            A = new h(r[2], w, s.sparse.count * a);
          (o !== null && (m = new ke(m.array.slice(), m.itemSize, m.normalized)), (m.normalized = !1));
          for (let L = 0, P = v.length; L < P; L++) {
            const k = v[L];
            if (
              (m.setX(k, A[L * a]),
              a >= 2 && m.setY(k, A[L * a + 1]),
              a >= 3 && m.setZ(k, A[L * a + 2]),
              a >= 4 && m.setW(k, A[L * a + 3]),
              a >= 5)
            )
              throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
          }
          m.normalized = d;
        }
        return m;
      })
    );
  }
  loadTexture(e) {
    const t = this.json,
      n = this.options,
      i = t.textures[e].source,
      r = t.images[i];
    let o = this.textureLoader;
    if (r.uri) {
      const a = n.manager.getHandler(r.uri);
      a !== null && (o = a);
    }
    return this.loadTextureImage(e, i, o);
  }
  loadTextureImage(e, t, n) {
    const s = this,
      i = this.json,
      r = i.textures[e],
      o = i.images[t],
      a = (o.uri || o.bufferView) + ":" + r.sampler;
    if (this.textureCache[a]) return this.textureCache[a];
    const h = this.loadImageSource(t, n)
      .then(function (u) {
        ((u.flipY = !1),
          (u.name = r.name || o.name || ""),
          u.name === "" && typeof o.uri == "string" && o.uri.startsWith("data:image/") === !1 && (u.name = o.uri));
        const f = (i.samplers || {})[r.sampler] || {};
        return (
          (u.magFilter = At[f.magFilter] || tt),
          (u.minFilter = At[f.minFilter] || Ut),
          (u.wrapS = Rt[f.wrapS] || xe),
          (u.wrapT = Rt[f.wrapT] || xe),
          (u.generateMipmaps = !u.isCompressedTexture && u.minFilter !== Ht && u.minFilter !== tt),
          s.associations.set(u, { textures: e }),
          u
        );
      })
      .catch(function () {
        return null;
      });
    return ((this.textureCache[a] = h), h);
  }
  loadImageSource(e, t) {
    const n = this,
      s = this.json,
      i = this.options;
    if (this.sourceCache[e] !== void 0) return this.sourceCache[e].then((l) => l.clone());
    const r = s.images[e],
      o = self.URL || self.webkitURL;
    let a = r.uri || "",
      h = !1;
    if (r.bufferView !== void 0)
      a = n.getDependency("bufferView", r.bufferView).then(function (l) {
        h = !0;
        const f = new Blob([l], { type: r.mimeType });
        return ((a = o.createObjectURL(f)), a);
      });
    else if (r.uri === void 0) throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
    const u = Promise.resolve(a)
      .then(function (l) {
        return new Promise(function (f, p) {
          let d = f;
          (t.isImageBitmapLoader === !0 &&
            (d = function (g) {
              const m = new We(g);
              ((m.needsUpdate = !0), f(m));
            }),
            t.load(de.resolveURL(l, i.path), d, void 0, p));
        });
      })
      .then(function (l) {
        return (h === !0 && o.revokeObjectURL(a), Z(l, r), (l.userData.mimeType = r.mimeType || pi(r.uri)), l);
      })
      .catch(function (l) {
        throw (console.error("THREE.GLTFLoader: Couldn't load texture", a), l);
      });
    return ((this.sourceCache[e] = u), u);
  }
  assignTexture(e, t, n, s) {
    const i = this;
    return this.getDependency("texture", n.index).then(function (r) {
      if (!r) return null;
      if (
        (n.texCoord !== void 0 && n.texCoord > 0 && ((r = r.clone()), (r.channel = n.texCoord)),
        i.extensions[x.KHR_TEXTURE_TRANSFORM])
      ) {
        const o = n.extensions !== void 0 ? n.extensions[x.KHR_TEXTURE_TRANSFORM] : void 0;
        if (o) {
          const a = i.associations.get(r);
          ((r = i.extensions[x.KHR_TEXTURE_TRANSFORM].extendTexture(r, o)), i.associations.set(r, a));
        }
      }
      return (s !== void 0 && (r.colorSpace = s), (e[t] = r), r);
    });
  }
  assignFinalMaterial(e) {
    const t = e.geometry;
    let n = e.material;
    const s = t.attributes.tangent === void 0,
      i = t.attributes.color !== void 0,
      r = t.attributes.normal === void 0;
    if (e.isPoints) {
      const o = "PointsMaterial:" + n.uuid;
      let a = this.cache.get(o);
      (a ||
        ((a = new Mn()),
        Ne.prototype.copy.call(a, n),
        a.color.copy(n.color),
        (a.map = n.map),
        (a.sizeAttenuation = !1),
        this.cache.add(o, a)),
        (n = a));
    } else if (e.isLine) {
      const o = "LineBasicMaterial:" + n.uuid;
      let a = this.cache.get(o);
      (a ||
        ((a = new Ot()), Ne.prototype.copy.call(a, n), a.color.copy(n.color), (a.map = n.map), this.cache.add(o, a)),
        (n = a));
    }
    if (s || i || r) {
      let o = "ClonedMaterial:" + n.uuid + ":";
      (s && (o += "derivative-tangents:"), i && (o += "vertex-colors:"), r && (o += "flat-shading:"));
      let a = this.cache.get(o);
      (a ||
        ((a = n.clone()),
        i && (a.vertexColors = !0),
        r && (a.flatShading = !0),
        s && (a.normalScale && (a.normalScale.y *= -1), a.clearcoatNormalScale && (a.clearcoatNormalScale.y *= -1)),
        this.cache.add(o, a),
        this.associations.set(a, this.associations.get(n))),
        (n = a));
    }
    e.material = n;
  }
  getMaterialType() {
    return jt;
  }
  loadMaterial(e) {
    const t = this,
      n = this.json,
      s = this.extensions,
      i = n.materials[e];
    let r;
    const o = {},
      a = i.extensions || {},
      h = [];
    if (a[x.KHR_MATERIALS_UNLIT]) {
      const l = s[x.KHR_MATERIALS_UNLIT];
      ((r = l.getMaterialType()), h.push(l.extendParams(o, i, t)));
    } else {
      const l = i.pbrMetallicRoughness || {};
      if (((o.color = new U(1, 1, 1)), (o.opacity = 1), Array.isArray(l.baseColorFactor))) {
        const f = l.baseColorFactor;
        (o.color.setRGB(f[0], f[1], f[2], $), (o.opacity = f[3]));
      }
      (l.baseColorTexture !== void 0 && h.push(t.assignTexture(o, "map", l.baseColorTexture, F)),
        (o.metalness = l.metallicFactor !== void 0 ? l.metallicFactor : 1),
        (o.roughness = l.roughnessFactor !== void 0 ? l.roughnessFactor : 1),
        l.metallicRoughnessTexture !== void 0 &&
          (h.push(t.assignTexture(o, "metalnessMap", l.metallicRoughnessTexture)),
          h.push(t.assignTexture(o, "roughnessMap", l.metallicRoughnessTexture))),
        (r = this._invokeOne(function (f) {
          return f.getMaterialType && f.getMaterialType(e);
        })),
        h.push(
          Promise.all(
            this._invokeAll(function (f) {
              return f.extendMaterialParams && f.extendMaterialParams(e, o);
            }),
          ),
        ));
    }
    i.doubleSided === !0 && (o.side = Ln);
    const u = i.alphaMode || Ve.OPAQUE;
    if (
      (u === Ve.BLEND
        ? ((o.transparent = !0), (o.depthWrite = !1))
        : ((o.transparent = !1), u === Ve.MASK && (o.alphaTest = i.alphaCutoff !== void 0 ? i.alphaCutoff : 0.5)),
      i.normalTexture !== void 0 &&
        r !== Te &&
        (h.push(t.assignTexture(o, "normalMap", i.normalTexture)),
        (o.normalScale = new j(1, 1)),
        i.normalTexture.scale !== void 0))
    ) {
      const l = i.normalTexture.scale;
      o.normalScale.set(l, l);
    }
    if (
      (i.occlusionTexture !== void 0 &&
        r !== Te &&
        (h.push(t.assignTexture(o, "aoMap", i.occlusionTexture)),
        i.occlusionTexture.strength !== void 0 && (o.aoMapIntensity = i.occlusionTexture.strength)),
      i.emissiveFactor !== void 0 && r !== Te)
    ) {
      const l = i.emissiveFactor;
      o.emissive = new U().setRGB(l[0], l[1], l[2], $);
    }
    return (
      i.emissiveTexture !== void 0 && r !== Te && h.push(t.assignTexture(o, "emissiveMap", i.emissiveTexture, F)),
      Promise.all(h).then(function () {
        const l = new r(o);
        return (
          i.name && (l.name = i.name),
          Z(l, i),
          t.associations.set(l, { materials: e }),
          i.extensions && se(s, l, i),
          l
        );
      })
    );
  }
  createUniqueName(e) {
    const t = ve.sanitizeNodeName(e || "");
    return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : ((this.nodeNamesUsed[t] = 0), t);
  }
  loadGeometries(e) {
    const t = this,
      n = this.extensions,
      s = this.primitiveCache;
    function i(o) {
      return n[x.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o, t).then(function (a) {
        return St(a, o, t);
      });
    }
    const r = [];
    for (let o = 0, a = e.length; o < a; o++) {
      const h = e[o],
        u = fi(h),
        l = s[u];
      if (l) r.push(l.promise);
      else {
        let f;
        (h.extensions && h.extensions[x.KHR_DRACO_MESH_COMPRESSION] ? (f = i(h)) : (f = St(new Ie(), h, t)),
          (s[u] = { primitive: h, promise: f }),
          r.push(f));
      }
    }
    return Promise.all(r);
  }
  loadMesh(e) {
    const t = this,
      n = this.json,
      s = this.extensions,
      i = n.meshes[e],
      r = i.primitives,
      o = [];
    for (let a = 0, h = r.length; a < h; a++) {
      const u = r[a].material === void 0 ? li(this.cache) : this.getDependency("material", r[a].material);
      o.push(u);
    }
    return (
      o.push(t.loadGeometries(r)),
      Promise.all(o).then(function (a) {
        const h = a.slice(0, a.length - 1),
          u = a[a.length - 1],
          l = [];
        for (let p = 0, d = u.length; p < d; p++) {
          const g = u[p],
            m = r[p];
          let T;
          const _ = h[p];
          if (m.mode === V.TRIANGLES || m.mode === V.TRIANGLE_STRIP || m.mode === V.TRIANGLE_FAN || m.mode === void 0)
            ((T = i.isSkinnedMesh === !0 ? new Dt(g, _) : new Ct(g, _)),
              T.isSkinnedMesh === !0 && T.normalizeSkinWeights(),
              m.mode === V.TRIANGLE_STRIP
                ? (T.geometry = xt(T.geometry, Bt))
                : m.mode === V.TRIANGLE_FAN && (T.geometry = xt(T.geometry, et)));
          else if (m.mode === V.LINES) T = new In(g, _);
          else if (m.mode === V.LINE_STRIP) T = new Ft(g, _);
          else if (m.mode === V.LINE_LOOP) T = new Pn(g, _);
          else if (m.mode === V.POINTS) T = new Dn(g, _);
          else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + m.mode);
          (Object.keys(T.geometry.morphAttributes).length > 0 && ui(T, i),
            (T.name = t.createUniqueName(i.name || "mesh_" + e)),
            Z(T, i),
            m.extensions && se(s, T, m),
            t.assignFinalMaterial(T),
            l.push(T));
        }
        for (let p = 0, d = l.length; p < d; p++) t.associations.set(l[p], { meshes: e, primitives: p });
        if (l.length === 1) return (i.extensions && se(s, l[0], i), l[0]);
        const f = new _e();
        (i.extensions && se(s, f, i), t.associations.set(f, { meshes: e }));
        for (let p = 0, d = l.length; p < d; p++) f.add(l[p]);
        return f;
      })
    );
  }
  loadCamera(e) {
    let t;
    const n = this.json.cameras[e],
      s = n[n.type];
    if (!s) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return (
      n.type === "perspective"
        ? (t = new Lt(B.radToDeg(s.yfov), s.aspectRatio || 1, s.znear || 1, s.zfar || 2e6))
        : n.type === "orthographic" && (t = new Cn(-s.xmag, s.xmag, s.ymag, -s.ymag, s.znear, s.zfar)),
      n.name && (t.name = this.createUniqueName(n.name)),
      Z(t, n),
      Promise.resolve(t)
    );
  }
  loadSkin(e) {
    const t = this.json.skins[e],
      n = [];
    for (let s = 0, i = t.joints.length; s < i; s++) n.push(this._loadNodeShallow(t.joints[s]));
    return (
      t.inverseBindMatrices !== void 0 ? n.push(this.getDependency("accessor", t.inverseBindMatrices)) : n.push(null),
      Promise.all(n).then(function (s) {
        const i = s.pop(),
          r = s,
          o = [],
          a = [];
        for (let h = 0, u = r.length; h < u; h++) {
          const l = r[h];
          if (l) {
            o.push(l);
            const f = new M();
            (i !== null && f.fromArray(i.array, h * 16), a.push(f));
          } else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[h]);
        }
        return new kt(o, a);
      })
    );
  }
  loadAnimation(e) {
    const t = this.json,
      n = this,
      s = t.animations[e],
      i = s.name ? s.name : "animation_" + e,
      r = [],
      o = [],
      a = [],
      h = [],
      u = [];
    for (let l = 0, f = s.channels.length; l < f; l++) {
      const p = s.channels[l],
        d = s.samplers[p.sampler],
        g = p.target,
        m = g.node,
        T = s.parameters !== void 0 ? s.parameters[d.input] : d.input,
        _ = s.parameters !== void 0 ? s.parameters[d.output] : d.output;
      g.node !== void 0 &&
        (r.push(this.getDependency("node", m)),
        o.push(this.getDependency("accessor", T)),
        a.push(this.getDependency("accessor", _)),
        h.push(d),
        u.push(g));
    }
    return Promise.all([Promise.all(r), Promise.all(o), Promise.all(a), Promise.all(h), Promise.all(u)]).then(
      function (l) {
        const f = l[0],
          p = l[1],
          d = l[2],
          g = l[3],
          m = l[4],
          T = [];
        for (let y = 0, w = f.length; y < w; y++) {
          const v = f[y],
            A = p[y],
            L = d[y],
            P = g[y],
            k = m[y];
          if (v === void 0) continue;
          v.updateMatrix && v.updateMatrix();
          const K = n._createAnimationTracks(v, A, L, P, k);
          if (K) for (let R = 0; R < K.length; R++) T.push(K[R]);
        }
        const _ = new Nt(i, void 0, T);
        return (Z(_, s), _);
      },
    );
  }
  createNodeMesh(e) {
    const t = this.json,
      n = this,
      s = t.nodes[e];
    return s.mesh === void 0
      ? null
      : n.getDependency("mesh", s.mesh).then(function (i) {
          const r = n._getNodeRef(n.meshCache, s.mesh, i);
          return (
            s.weights !== void 0 &&
              r.traverse(function (o) {
                if (o.isMesh)
                  for (let a = 0, h = s.weights.length; a < h; a++) o.morphTargetInfluences[a] = s.weights[a];
              }),
            r
          );
        });
  }
  loadNode(e) {
    const t = this.json,
      n = this,
      s = t.nodes[e],
      i = n._loadNodeShallow(e),
      r = [],
      o = s.children || [];
    for (let h = 0, u = o.length; h < u; h++) r.push(n.getDependency("node", o[h]));
    const a = s.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", s.skin);
    return Promise.all([i, Promise.all(r), a]).then(function (h) {
      const u = h[0],
        l = h[1],
        f = h[2];
      f !== null &&
        u.traverse(function (p) {
          p.isSkinnedMesh && p.bind(f, di);
        });
      for (let p = 0, d = l.length; p < d; p++) u.add(l[p]);
      if (u.userData.pivot !== void 0 && l.length > 0) {
        const p = u.userData.pivot,
          d = l[0];
        ((u.pivot = new b().fromArray(p)),
          (u.position.x -= p[0]),
          (u.position.y -= p[1]),
          (u.position.z -= p[2]),
          d.position.set(0, 0, 0),
          delete u.userData.pivot);
      }
      return u;
    });
  }
  _loadNodeShallow(e) {
    const t = this.json,
      n = this.extensions,
      s = this;
    if (this.nodeCache[e] !== void 0) return this.nodeCache[e];
    const i = t.nodes[e],
      r = i.name ? s.createUniqueName(i.name) : "",
      o = [],
      a = s._invokeOne(function (h) {
        return h.createNodeMesh && h.createNodeMesh(e);
      });
    return (
      a && o.push(a),
      i.camera !== void 0 &&
        o.push(
          s.getDependency("camera", i.camera).then(function (h) {
            return s._getNodeRef(s.cameraCache, i.camera, h);
          }),
        ),
      s
        ._invokeAll(function (h) {
          return h.createNodeAttachment && h.createNodeAttachment(e);
        })
        .forEach(function (h) {
          o.push(h);
        }),
      (this.nodeCache[e] = Promise.all(o).then(function (h) {
        let u;
        if (
          (i.isBone === !0
            ? (u = new Ze())
            : h.length > 1
              ? (u = new _e())
              : h.length === 1
                ? (u = h[0])
                : (u = new ue()),
          u !== h[0])
        )
          for (let l = 0, f = h.length; l < f; l++) u.add(h[l]);
        if (
          (i.name && ((u.userData.name = i.name), (u.name = r)),
          Z(u, i),
          i.extensions && se(n, u, i),
          i.matrix !== void 0)
        ) {
          const l = new M();
          (l.fromArray(i.matrix), u.applyMatrix4(l));
        } else
          (i.translation !== void 0 && u.position.fromArray(i.translation),
            i.rotation !== void 0 && u.quaternion.fromArray(i.rotation),
            i.scale !== void 0 && u.scale.fromArray(i.scale));
        if (!s.associations.has(u)) s.associations.set(u, {});
        else if (i.mesh !== void 0 && s.meshCache.refs[i.mesh] > 1) {
          const l = s.associations.get(u);
          s.associations.set(u, { ...l });
        }
        return ((s.associations.get(u).nodes = e), u);
      })),
      this.nodeCache[e]
    );
  }
  loadScene(e) {
    const t = this.extensions,
      n = this.json.scenes[e],
      s = this,
      i = new _e();
    (n.name && (i.name = s.createUniqueName(n.name)), Z(i, n), n.extensions && se(t, i, n));
    const r = n.nodes || [],
      o = [];
    for (let a = 0, h = r.length; a < h; a++) o.push(s.getDependency("node", r[a]));
    return Promise.all(o).then(function (a) {
      for (let u = 0, l = a.length; u < l; u++) {
        const f = a[u];
        f.parent !== null ? i.add(Ns(f)) : i.add(f);
      }
      const h = (u) => {
        const l = new Map();
        for (const [f, p] of s.associations) (f instanceof Ne || f instanceof We) && l.set(f, p);
        return (
          u.traverse((f) => {
            const p = s.associations.get(f);
            p != null && l.set(f, p);
          }),
          l
        );
      };
      return ((s.associations = h(i)), i);
    });
  }
  _createAnimationTracks(e, t, n, s, i) {
    const r = [],
      o = e.name ? e.name : e.uuid,
      a = [];
    function h(p) {
      p.morphTargetInfluences && a.push(p.name ? p.name : p.uuid);
    }
    ne[i.path] === ne.weights ? (h(e), e.isGroup && e.children.forEach(h)) : a.push(o);
    let u;
    switch (ne[i.path]) {
      case ne.weights:
        u = $e;
        break;
      case ne.rotation:
        u = Je;
        break;
      case ne.translation:
      case ne.scale:
        u = Qe;
        break;
      default:
        switch (n.itemSize) {
          case 1:
            u = $e;
            break;
          case 2:
          case 3:
          default:
            u = Qe;
            break;
        }
        break;
    }
    const l = s.interpolation !== void 0 ? ci[s.interpolation] : Gt,
      f = this._getArrayFromAccessor(n);
    for (let p = 0, d = a.length; p < d; p++) {
      const g = new u(a[p] + "." + ne[i.path], t.array, f, l);
      (s.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(g), r.push(g));
    }
    return r;
  }
  _getArrayFromAccessor(e) {
    let t = e.array;
    if (e.normalized) {
      const n = rt(t.constructor),
        s = new Float32Array(t.length);
      for (let i = 0, r = t.length; i < r; i++) s[i] = t[i] * n;
      t = s;
    }
    return t;
  }
  _createCubicSplineTrackInterpolant(e) {
    ((e.createInterpolant = function (n) {
      const s = this instanceof Je ? ai : sn;
      return new s(this.times, this.values, this.getValueSize() / 3, n);
    }),
      (e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0));
  }
}
function gi(c, e, t) {
  const n = e.attributes,
    s = new Bn();
  if (n.POSITION !== void 0) {
    const o = t.json.accessors[n.POSITION],
      a = o.min,
      h = o.max;
    if (a !== void 0 && h !== void 0) {
      if ((s.set(new b(a[0], a[1], a[2]), new b(h[0], h[1], h[2])), o.normalized)) {
        const u = rt(me[o.componentType]);
        (s.min.multiplyScalar(u), s.max.multiplyScalar(u));
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else return;
  const i = e.targets;
  if (i !== void 0) {
    const o = new b(),
      a = new b();
    for (let h = 0, u = i.length; h < u; h++) {
      const l = i[h];
      if (l.POSITION !== void 0) {
        const f = t.json.accessors[l.POSITION],
          p = f.min,
          d = f.max;
        if (p !== void 0 && d !== void 0) {
          if (
            (a.setX(Math.max(Math.abs(p[0]), Math.abs(d[0]))),
            a.setY(Math.max(Math.abs(p[1]), Math.abs(d[1]))),
            a.setZ(Math.max(Math.abs(p[2]), Math.abs(d[2]))),
            f.normalized)
          ) {
            const g = rt(me[f.componentType]);
            a.multiplyScalar(g);
          }
          o.max(a);
        } else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      }
    }
    s.expandByVector(o);
  }
  c.boundingBox = s;
  const r = new Un();
  (s.getCenter(r.center), (r.radius = s.min.distanceTo(s.max) / 2), (c.boundingSphere = r));
}
function St(c, e, t) {
  const n = e.attributes,
    s = [];
  function i(r, o) {
    return t.getDependency("accessor", r).then(function (a) {
      c.setAttribute(o, a);
    });
  }
  for (const r in n) {
    const o = it[r] || r.toLowerCase();
    o in c.attributes || s.push(i(n[r], o));
  }
  if (e.indices !== void 0 && !c.index) {
    const r = t.getDependency("accessor", e.indices).then(function (o) {
      c.setIndex(o);
    });
    s.push(r);
  }
  return (
    q.workingColorSpace !== $ &&
      "COLOR_0" in n &&
      console.warn(
        `THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${q.workingColorSpace}" not supported.`,
      ),
    Z(c, e),
    gi(c, e, t),
    Promise.all(s).then(function () {
      return e.targets !== void 0 ? hi(c, e.targets, t) : c;
    })
  );
}
export { wi as F, Ei as G, Ti as O, _i as u };
