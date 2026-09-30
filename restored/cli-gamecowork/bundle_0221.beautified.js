var zx = Object.create;
var Pu = Object.defineProperty;
var Lx = Object.getOwnPropertyDescriptor;
var Ux = Object.getOwnPropertyNames;
var Bx = Object.getPrototypeOf,
  Hx = Object.prototype.hasOwnProperty;
var Ze = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports),
  vp = (t, e) => {
    for (var n in e) Pu(t, n, { get: e[n], enumerable: !0 });
  },
  qx = (t, e, n, l) => {
    if ((e && typeof e == "object") || typeof e == "function")
      for (let i of Ux(e))
        !Hx.call(t, i) && i !== n && Pu(t, i, { get: () => e[i], enumerable: !(l = Lx(e, i)) || l.enumerable });
    return t;
  };
var G = (t, e, n) => (
  (n = t != null ? zx(Bx(t)) : {}),
  qx(e || !t || !t.__esModule ? Pu(n, "default", { value: t, enumerable: !0 }) : n, t)
);
var Mp = Ze((mt) => {
  "use strict";
  var Xu = Symbol.for("react.transitional.element"),
    Ix = Symbol.for("react.portal"),
    jx = Symbol.for("react.fragment"),
    Yx = Symbol.for("react.strict_mode"),
    Fx = Symbol.for("react.profiler"),
    Vx = Symbol.for("react.consumer"),
    Qx = Symbol.for("react.context"),
    Px = Symbol.for("react.forward_ref"),
    Gx = Symbol.for("react.suspense"),
    Xx = Symbol.for("react.memo"),
    Tp = Symbol.for("react.lazy"),
    bp = Symbol.iterator;
  function Zx(t) {
    return t === null || typeof t != "object"
      ? null
      : ((t = (bp && t[bp]) || t["@@iterator"]), typeof t == "function" ? t : null);
  }
  var Ep = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    Cp = Object.assign,
    Ap = {};
  function Qi(t, e, n) {
    ((this.props = t), (this.context = e), (this.refs = Ap), (this.updater = n || Ep));
  }
  Qi.prototype.isReactComponent = {};
  Qi.prototype.setState = function (t, e) {
    if (typeof t != "object" && typeof t != "function" && t != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables.",
      );
    this.updater.enqueueSetState(this, t, e, "setState");
  };
  Qi.prototype.forceUpdate = function (t) {
    this.updater.enqueueForceUpdate(this, t, "forceUpdate");
  };
  function Np() {}
  Np.prototype = Qi.prototype;
  function Zu(t, e, n) {
    ((this.props = t), (this.context = e), (this.refs = Ap), (this.updater = n || Ep));
  }
  var Ku = (Zu.prototype = new Np());
  Ku.constructor = Zu;
  Cp(Ku, Qi.prototype);
  Ku.isPureReactComponent = !0;
  var xp = Array.isArray,
    Kt = { H: null, A: null, T: null, S: null, V: null },
    Rp = Object.prototype.hasOwnProperty;
  function Ju(t, e, n, l, i, r) {
    return ((n = r.ref), { $$typeof: Xu, type: t, key: e, ref: n !== void 0 ? n : null, props: r });
  }
  function Kx(t, e) {
    return Ju(t.type, e, void 0, void 0, void 0, t.props);
  }
  function $u(t) {
    return typeof t == "object" && t !== null && t.$$typeof === Xu;
  }
  function Jx(t) {
    var e = { "=": "=0", ":": "=2" };
    return (
      "$" +
      t.replace(/[=:]/g, function (n) {
        return e[n];
      })
    );
  }
  var kp = /\/+/g;
  function Gu(t, e) {
    return typeof t == "object" && t !== null && t.key != null ? Jx("" + t.key) : e.toString(36);
  }
  function Sp() {}
  function $x(t) {
    switch (t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw t.reason;
      default:
        switch (
          (typeof t.status == "string"
            ? t.then(Sp, Sp)
            : ((t.status = "pending"),
              t.then(
                function (e) {
                  t.status === "pending" && ((t.status = "fulfilled"), (t.value = e));
                },
                function (e) {
                  t.status === "pending" && ((t.status = "rejected"), (t.reason = e));
                },
              )),
          t.status)
        ) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw t.reason;
        }
    }
    throw t;
  }
  function Vi(t, e, n, l, i) {
    var r = typeof t;
    (r === "undefined" || r === "boolean") && (t = null);
    var a = !1;
    if (t === null) a = !0;
    else
      switch (r) {
        case "bigint":
        case "string":
        case "number":
          a = !0;
          break;
        case "object":
          switch (t.$$typeof) {
            case Xu:
            case Ix:
              a = !0;
              break;
            case Tp:
              return ((a = t._init), Vi(a(t._payload), e, n, l, i));
          }
      }
    if (a)
      return (
        (i = i(t)),
        (a = l === "" ? "." + Gu(t, 0) : l),
        xp(i)
          ? ((n = ""),
            a != null && (n = a.replace(kp, "$&/") + "/"),
            Vi(i, e, n, "", function (u) {
              return u;
            }))
          : i != null &&
            ($u(i) &&
              (i = Kx(
                i,
                n + (i.key == null || (t && t.key === i.key) ? "" : ("" + i.key).replace(kp, "$&/") + "/") + a,
              )),
            e.push(i)),
        1
      );
    a = 0;
    var o = l === "" ? "." : l + ":";
    if (xp(t)) for (var s = 0; s < t.length; s++) ((l = t[s]), (r = o + Gu(l, s)), (a += Vi(l, e, n, r, i)));
    else if (((s = Zx(t)), typeof s == "function"))
      for (t = s.call(t), s = 0; !(l = t.next()).done;) ((l = l.value), (r = o + Gu(l, s++)), (a += Vi(l, e, n, r, i)));
    else if (r === "object") {
      if (typeof t.then == "function") return Vi($x(t), e, n, l, i);
      throw (
        (e = String(t)),
        Error(
          "Objects are not valid as a React child (found: " +
            (e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    }
    return a;
  }
  function Ao(t, e, n) {
    if (t == null) return t;
    var l = [],
      i = 0;
    return (
      Vi(t, l, "", "", function (r) {
        return e.call(n, r, i++);
      }),
      l
    );
  }
  function Wx(t) {
    if (t._status === -1) {
      var e = t._result;
      ((e = e()),
        e.then(
          function (n) {
            (t._status === 0 || t._status === -1) && ((t._status = 1), (t._result = n));
          },
          function (n) {
            (t._status === 0 || t._status === -1) && ((t._status = 2), (t._result = n));
          },
        ),
        t._status === -1 && ((t._status = 0), (t._result = e)));
    }
    if (t._status === 1) return t._result.default;
    throw t._result;
  }
  var wp =
    typeof reportError == "function"
      ? reportError
      : function (t) {
          if (typeof window == "object" && typeof window.ErrorEvent == "function") {
            var e = new window.ErrorEvent("error", {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
              error: t,
            });
            if (!window.dispatchEvent(e)) return;
          } else if (typeof process == "object" && typeof process.emit == "function") {
            process.emit("uncaughtException", t);
            return;
          }
          console.error(t);
        };
  function tk() {}
  mt.Children = {
    map: Ao,
    forEach: function (t, e, n) {
      Ao(
        t,
        function () {
          e.apply(this, arguments);
        },
        n,
      );
    },
    count: function (t) {
      var e = 0;
      return (
        Ao(t, function () {
          e++;
        }),
        e
      );
    },
    toArray: function (t) {
      return (
        Ao(t, function (e) {
          return e;
        }) || []
      );
    },
    only: function (t) {
      if (!$u(t)) throw Error("React.Children.only expected to receive a single React element child.");
      return t;
    },
  };
  mt.Component = Qi;
  mt.Fragment = jx;
  mt.Profiler = Fx;
  mt.PureComponent = Zu;
  mt.StrictMode = Yx;
  mt.Suspense = Gx;
  mt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Kt;
  mt.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function (t) {
      return Kt.H.useMemoCache(t);
    },
  };
  mt.cache = function (t) {
    return function () {
      return t.apply(null, arguments);
    };
  };
  mt.cloneElement = function (t, e, n) {
    if (t == null) throw Error("The argument must be a React element, but you passed " + t + ".");
    var l = Cp({}, t.props),
      i = t.key,
      r = void 0;
    if (e != null)
      for (a in (e.ref !== void 0 && (r = void 0), e.key !== void 0 && (i = "" + e.key), e))
        !Rp.call(e, a) ||
          a === "key" ||
          a === "__self" ||
          a === "__source" ||
          (a === "ref" && e.ref === void 0) ||
          (l[a] = e[a]);
    var a = arguments.length - 2;
    if (a === 1) l.children = n;
    else if (1 < a) {
      for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
      l.children = o;
    }
    return Ju(t.type, i, void 0, void 0, r, l);
  };
  mt.createContext = function (t) {
    return (
      (t = { $$typeof: Qx, _currentValue: t, _currentValue2: t, _threadCount: 0, Provider: null, Consumer: null }),
      (t.Provider = t),
      (t.Consumer = { $$typeof: Vx, _context: t }),
      t
    );
  };
  mt.createElement = function (t, e, n) {
    var l,
      i = {},
      r = null;
    if (e != null)
      for (l in (e.key !== void 0 && (r = "" + e.key), e))
        Rp.call(e, l) && l !== "key" && l !== "__self" && l !== "__source" && (i[l] = e[l]);
    var a = arguments.length - 2;
    if (a === 1) i.children = n;
    else if (1 < a) {
      for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
      i.children = o;
    }
    if (t && t.defaultProps) for (l in ((a = t.defaultProps), a)) i[l] === void 0 && (i[l] = a[l]);
    return Ju(t, r, void 0, void 0, null, i);
  };
  mt.createRef = function () {
    return { current: null };
  };
  mt.forwardRef = function (t) {
    return { $$typeof: Px, render: t };
  };
  mt.isValidElement = $u;
  mt.lazy = function (t) {
    return { $$typeof: Tp, _payload: { _status: -1, _result: t }, _init: Wx };
  };
  mt.memo = function (t, e) {
    return { $$typeof: Xx, type: t, compare: e === void 0 ? null : e };
  };
  mt.startTransition = function (t) {
    var e = Kt.T,
      n = {};
    Kt.T = n;
    try {
      var l = t(),
        i = Kt.S;
      (i !== null && i(n, l), typeof l == "object" && l !== null && typeof l.then == "function" && l.then(tk, wp));
    } catch (r) {
      wp(r);
    } finally {
      Kt.T = e;
    }
  };
  mt.unstable_useCacheRefresh = function () {
    return Kt.H.useCacheRefresh();
  };
  mt.use = function (t) {
    return Kt.H.use(t);
  };
  mt.useActionState = function (t, e, n) {
    return Kt.H.useActionState(t, e, n);
  };
  mt.useCallback = function (t, e) {
    return Kt.H.useCallback(t, e);
  };
  mt.useContext = function (t) {
    return Kt.H.useContext(t);
  };
  mt.useDebugValue = function () {};
  mt.useDeferredValue = function (t, e) {
    return Kt.H.useDeferredValue(t, e);
  };
  mt.useEffect = function (t, e, n) {
    var l = Kt.H;
    if (typeof n == "function") throw Error("useEffect CRUD overload is not enabled in this build of React.");
    return l.useEffect(t, e);
  };
  mt.useId = function () {
    return Kt.H.useId();
  };
  mt.useImperativeHandle = function (t, e, n) {
    return Kt.H.useImperativeHandle(t, e, n);
  };
  mt.useInsertionEffect = function (t, e) {
    return Kt.H.useInsertionEffect(t, e);
  };
  mt.useLayoutEffect = function (t, e) {
    return Kt.H.useLayoutEffect(t, e);
  };
  mt.useMemo = function (t, e) {
    return Kt.H.useMemo(t, e);
  };
  mt.useOptimistic = function (t, e) {
    return Kt.H.useOptimistic(t, e);
  };
  mt.useReducer = function (t, e, n) {
    return Kt.H.useReducer(t, e, n);
  };
  mt.useRef = function (t) {
    return Kt.H.useRef(t);
  };
  mt.useState = function (t) {
    return Kt.H.useState(t);
  };
  mt.useSyncExternalStore = function (t, e, n) {
    return Kt.H.useSyncExternalStore(t, e, n);
  };
  mt.useTransition = function () {
    return Kt.H.useTransition();
  };
  mt.version = "19.1.1";
});
var le = Ze(($N, Dp) => {
  "use strict";
  Dp.exports = Mp();
});
var jp = Ze((Jt) => {
  "use strict";
  function nc(t, e) {
    var n = t.length;
    t.push(e);
    t: for (; 0 < n;) {
      var l = (n - 1) >>> 1,
        i = t[l];
      if (0 < No(i, e)) ((t[l] = e), (t[n] = i), (n = l));
      else break t;
    }
  }
  function jn(t) {
    return t.length === 0 ? null : t[0];
  }
  function Mo(t) {
    if (t.length === 0) return null;
    var e = t[0],
      n = t.pop();
    if (n !== e) {
      t[0] = n;
      t: for (var l = 0, i = t.length, r = i >>> 1; l < r;) {
        var a = 2 * (l + 1) - 1,
          o = t[a],
          s = a + 1,
          u = t[s];
        if (0 > No(o, n)) s < i && 0 > No(u, o) ? ((t[l] = u), (t[s] = n), (l = s)) : ((t[l] = o), (t[a] = n), (l = a));
        else if (s < i && 0 > No(u, n)) ((t[l] = u), (t[s] = n), (l = s));
        else break t;
      }
    }
    return e;
  }
  function No(t, e) {
    var n = t.sortIndex - e.sortIndex;
    return n !== 0 ? n : t.id - e.id;
  }
  Jt.unstable_now = void 0;
  typeof performance == "object" && typeof performance.now == "function"
    ? ((_p = performance),
      (Jt.unstable_now = function () {
        return _p.now();
      }))
    : ((Wu = Date),
      (Op = Wu.now()),
      (Jt.unstable_now = function () {
        return Wu.now() - Op;
      }));
  var _p,
    Wu,
    Op,
    el = [],
    kl = [],
    ek = 1,
    wn = null,
    Ie = 3,
    lc = !1,
    Wr = !1,
    ta = !1,
    ic = !1,
    Up = typeof setTimeout == "function" ? setTimeout : null,
    Bp = typeof clearTimeout == "function" ? clearTimeout : null,
    zp = typeof setImmediate < "u" ? setImmediate : null;
  function Ro(t) {
    for (var e = jn(kl); e !== null;) {
      if (e.callback === null) Mo(kl);
      else if (e.startTime <= t) (Mo(kl), (e.sortIndex = e.expirationTime), nc(el, e));
      else break;
      e = jn(kl);
    }
  }
  function rc(t) {
    if (((ta = !1), Ro(t), !Wr))
      if (jn(el) !== null) ((Wr = !0), Gi || ((Gi = !0), Pi()));
      else {
        var e = jn(kl);
        e !== null && ac(rc, e.startTime - t);
      }
  }
  var Gi = !1,
    ea = -1,
    Hp = 5,
    qp = -1;
  function Ip() {
    return ic ? !0 : !(Jt.unstable_now() - qp < Hp);
  }
  function tc() {
    if (((ic = !1), Gi)) {
      var t = Jt.unstable_now();
      qp = t;
      var e = !0;
      try {
        t: {
          ((Wr = !1), ta && ((ta = !1), Bp(ea), (ea = -1)), (lc = !0));
          var n = Ie;
          try {
            e: {
              for (Ro(t), wn = jn(el); wn !== null && !(wn.expirationTime > t && Ip());) {
                var l = wn.callback;
                if (typeof l == "function") {
                  ((wn.callback = null), (Ie = wn.priorityLevel));
                  var i = l(wn.expirationTime <= t);
                  if (((t = Jt.unstable_now()), typeof i == "function")) {
                    ((wn.callback = i), Ro(t), (e = !0));
                    break e;
                  }
                  (wn === jn(el) && Mo(el), Ro(t));
                } else Mo(el);
                wn = jn(el);
              }
              if (wn !== null) e = !0;
              else {
                var r = jn(kl);
                (r !== null && ac(rc, r.startTime - t), (e = !1));
              }
            }
            break t;
          } finally {
            ((wn = null), (Ie = n), (lc = !1));
          }
          e = void 0;
        }
      } finally {
        e ? Pi() : (Gi = !1);
      }
    }
  }
  var Pi;
  typeof zp == "function"
    ? (Pi = function () {
        zp(tc);
      })
    : typeof MessageChannel < "u"
      ? ((ec = new MessageChannel()),
        (Lp = ec.port2),
        (ec.port1.onmessage = tc),
        (Pi = function () {
          Lp.postMessage(null);
        }))
      : (Pi = function () {
          Up(tc, 0);
        });
  var ec, Lp;
  function ac(t, e) {
    ea = Up(function () {
      t(Jt.unstable_now());
    }, e);
  }
  Jt.unstable_IdlePriority = 5;
  Jt.unstable_ImmediatePriority = 1;
  Jt.unstable_LowPriority = 4;
  Jt.unstable_NormalPriority = 3;
  Jt.unstable_Profiling = null;
  Jt.unstable_UserBlockingPriority = 2;
  Jt.unstable_cancelCallback = function (t) {
    t.callback = null;
  };
  Jt.unstable_forceFrameRate = function (t) {
    0 > t || 125 < t
      ? console.error(
          "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
        )
      : (Hp = 0 < t ? Math.floor(1e3 / t) : 5);
  };
  Jt.unstable_getCurrentPriorityLevel = function () {
    return Ie;
  };
  Jt.unstable_next = function (t) {
    switch (Ie) {
      case 1:
      case 2:
      case 3:
        var e = 3;
        break;
      default:
        e = Ie;
    }
    var n = Ie;
    Ie = e;
    try {
      return t();
    } finally {
      Ie = n;
    }
  };
  Jt.unstable_requestPaint = function () {
    ic = !0;
  };
  Jt.unstable_runWithPriority = function (t, e) {
    switch (t) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        t = 3;
    }
    var n = Ie;
    Ie = t;
    try {
      return e();
    } finally {
      Ie = n;
    }
  };
  Jt.unstable_scheduleCallback = function (t, e, n) {
    var l = Jt.unstable_now();
    switch (
      (typeof n == "object" && n !== null ? ((n = n.delay), (n = typeof n == "number" && 0 < n ? l + n : l)) : (n = l),
      t)
    ) {
      case 1:
        var i = -1;
        break;
      case 2:
        i = 250;
        break;
      case 5:
        i = 1073741823;
        break;
      case 4:
        i = 1e4;
        break;
      default:
        i = 5e3;
    }
    return (
      (i = n + i),
      (t = { id: ek++, callback: e, priorityLevel: t, startTime: n, expirationTime: i, sortIndex: -1 }),
      n > l
        ? ((t.sortIndex = n),
          nc(kl, t),
          jn(el) === null && t === jn(kl) && (ta ? (Bp(ea), (ea = -1)) : (ta = !0), ac(rc, n - l)))
        : ((t.sortIndex = i), nc(el, t), Wr || lc || ((Wr = !0), Gi || ((Gi = !0), Pi()))),
      t
    );
  };
  Jt.unstable_shouldYield = Ip;
  Jt.unstable_wrapCallback = function (t) {
    var e = Ie;
    return function () {
      var n = Ie;
      Ie = e;
      try {
        return t.apply(this, arguments);
      } finally {
        Ie = n;
      }
    };
  };
});
var Fp = Ze((tR, Yp) => {
  "use strict";
  Yp.exports = jp();
});
var Qp = Ze((Je) => {
  "use strict";
  var nk = le();
  function Vp(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++) e += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return (
      "Minified React error #" +
      t +
      "; visit " +
      e +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function Sl() {}
  var Ke = {
      d: {
        f: Sl,
        r: function () {
          throw Error(Vp(522));
        },
        D: Sl,
        C: Sl,
        L: Sl,
        m: Sl,
        X: Sl,
        S: Sl,
        M: Sl,
      },
      p: 0,
      findDOMNode: null,
    },
    lk = Symbol.for("react.portal");
  function ik(t, e, n) {
    var l = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: lk, key: l == null ? null : "" + l, children: t, containerInfo: e, implementation: n };
  }
  var na = nk.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function Do(t, e) {
    if (t === "font") return "";
    if (typeof e == "string") return e === "use-credentials" ? e : "";
  }
  Je.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Ke;
  Je.createPortal = function (t, e) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)) throw Error(Vp(299));
    return ik(t, e, null, n);
  };
  Je.flushSync = function (t) {
    var e = na.T,
      n = Ke.p;
    try {
      if (((na.T = null), (Ke.p = 2), t)) return t();
    } finally {
      ((na.T = e), (Ke.p = n), Ke.d.f());
    }
  };
  Je.preconnect = function (t, e) {
    typeof t == "string" &&
      (e ? ((e = e.crossOrigin), (e = typeof e == "string" ? (e === "use-credentials" ? e : "") : void 0)) : (e = null),
      Ke.d.C(t, e));
  };
  Je.prefetchDNS = function (t) {
    typeof t == "string" && Ke.d.D(t);
  };
  Je.preinit = function (t, e) {
    if (typeof t == "string" && e && typeof e.as == "string") {
      var n = e.as,
        l = Do(n, e.crossOrigin),
        i = typeof e.integrity == "string" ? e.integrity : void 0,
        r = typeof e.fetchPriority == "string" ? e.fetchPriority : void 0;
      n === "style"
        ? Ke.d.S(t, typeof e.precedence == "string" ? e.precedence : void 0, {
            crossOrigin: l,
            integrity: i,
            fetchPriority: r,
          })
        : n === "script" &&
          Ke.d.X(t, {
            crossOrigin: l,
            integrity: i,
            fetchPriority: r,
            nonce: typeof e.nonce == "string" ? e.nonce : void 0,
          });
    }
  };
  Je.preinitModule = function (t, e) {
    if (typeof t == "string")
      if (typeof e == "object" && e !== null) {
        if (e.as == null || e.as === "script") {
          var n = Do(e.as, e.crossOrigin);
          Ke.d.M(t, {
            crossOrigin: n,
            integrity: typeof e.integrity == "string" ? e.integrity : void 0,
            nonce: typeof e.nonce == "string" ? e.nonce : void 0,
          });
        }
      } else e == null && Ke.d.M(t);
  };
  Je.preload = function (t, e) {
    if (typeof t == "string" && typeof e == "object" && e !== null && typeof e.as == "string") {
      var n = e.as,
        l = Do(n, e.crossOrigin);
      Ke.d.L(t, n, {
        crossOrigin: l,
        integrity: typeof e.integrity == "string" ? e.integrity : void 0,
        nonce: typeof e.nonce == "string" ? e.nonce : void 0,
        type: typeof e.type == "string" ? e.type : void 0,
        fetchPriority: typeof e.fetchPriority == "string" ? e.fetchPriority : void 0,
        referrerPolicy: typeof e.referrerPolicy == "string" ? e.referrerPolicy : void 0,
        imageSrcSet: typeof e.imageSrcSet == "string" ? e.imageSrcSet : void 0,
        imageSizes: typeof e.imageSizes == "string" ? e.imageSizes : void 0,
        media: typeof e.media == "string" ? e.media : void 0,
      });
    }
  };
  Je.preloadModule = function (t, e) {
    if (typeof t == "string")
      if (e) {
        var n = Do(e.as, e.crossOrigin);
        Ke.d.m(t, {
          as: typeof e.as == "string" && e.as !== "script" ? e.as : void 0,
          crossOrigin: n,
          integrity: typeof e.integrity == "string" ? e.integrity : void 0,
        });
      } else Ke.d.m(t);
  };
  Je.requestFormReset = function (t) {
    Ke.d.r(t);
  };
  Je.unstable_batchedUpdates = function (t, e) {
    return t(e);
  };
  Je.useFormState = function (t, e, n) {
    return na.H.useFormState(t, e, n);
  };
  Je.useFormStatus = function () {
    return na.H.useHostTransitionStatus();
  };
  Je.version = "19.1.1";
});
var oc = Ze((nR, Gp) => {
  "use strict";
  function Pp() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Pp);
      } catch (t) {
        console.error(t);
      }
  }
  (Pp(), (Gp.exports = Qp()));
});
var Zv = Ze((Ws) => {
  "use strict";
  var we = Fp(),
    hg = le(),
    rk = oc();
  function O(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++) e += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return (
      "Minified React error #" +
      t +
      "; visit " +
      e +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function gg(t) {
    return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
  }
  function Fa(t) {
    var e = t,
      n = t;
    if (t.alternate) for (; e.return;) e = e.return;
    else {
      t = e;
      do ((e = t), (e.flags & 4098) !== 0 && (n = e.return), (t = e.return));
      while (t);
    }
    return e.tag === 3 ? n : null;
  }
  function yg(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if ((e === null && ((t = t.alternate), t !== null && (e = t.memoizedState)), e !== null)) return e.dehydrated;
    }
    return null;
  }
  function Xp(t) {
    if (Fa(t) !== t) throw Error(O(188));
  }
  function ak(t) {
    var e = t.alternate;
    if (!e) {
      if (((e = Fa(t)), e === null)) throw Error(O(188));
      return e !== t ? null : t;
    }
    for (var n = t, l = e; ;) {
      var i = n.return;
      if (i === null) break;
      var r = i.alternate;
      if (r === null) {
        if (((l = i.return), l !== null)) {
          n = l;
          continue;
        }
        break;
      }
      if (i.child === r.child) {
        for (r = i.child; r;) {
          if (r === n) return (Xp(i), t);
          if (r === l) return (Xp(i), e);
          r = r.sibling;
        }
        throw Error(O(188));
      }
      if (n.return !== l.return) ((n = i), (l = r));
      else {
        for (var a = !1, o = i.child; o;) {
          if (o === n) {
            ((a = !0), (n = i), (l = r));
            break;
          }
          if (o === l) {
            ((a = !0), (l = i), (n = r));
            break;
          }
          o = o.sibling;
        }
        if (!a) {
          for (o = r.child; o;) {
            if (o === n) {
              ((a = !0), (n = r), (l = i));
              break;
            }
            if (o === l) {
              ((a = !0), (l = r), (n = i));
              break;
            }
            o = o.sibling;
          }
          if (!a) throw Error(O(189));
        }
      }
      if (n.alternate !== l) throw Error(O(190));
    }
    if (n.tag !== 3) throw Error(O(188));
    return n.stateNode.current === n ? t : e;
  }
  function vg(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null;) {
      if (((e = vg(t)), e !== null)) return e;
      t = t.sibling;
    }
    return null;
  }
  var Zt = Object.assign,
    ok = Symbol.for("react.element"),
    _o = Symbol.for("react.transitional.element"),
    fa = Symbol.for("react.portal"),
    tr = Symbol.for("react.fragment"),
    bg = Symbol.for("react.strict_mode"),
    qc = Symbol.for("react.profiler"),
    sk = Symbol.for("react.provider"),
    xg = Symbol.for("react.consumer"),
    al = Symbol.for("react.context"),
    Lf = Symbol.for("react.forward_ref"),
    Ic = Symbol.for("react.suspense"),
    jc = Symbol.for("react.suspense_list"),
    Uf = Symbol.for("react.memo"),
    El = Symbol.for("react.lazy");
  Symbol.for("react.scope");
  var Yc = Symbol.for("react.activity");
  Symbol.for("react.legacy_hidden");
  Symbol.for("react.tracing_marker");
  var uk = Symbol.for("react.memo_cache_sentinel");
  Symbol.for("react.view_transition");
  var Zp = Symbol.iterator;
  function la(t) {
    return t === null || typeof t != "object"
      ? null
      : ((t = (Zp && t[Zp]) || t["@@iterator"]), typeof t == "function" ? t : null);
  }
  var ck = Symbol.for("react.client.reference");
  function Fc(t) {
    if (t == null) return null;
    if (typeof t == "function") return t.$$typeof === ck ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case tr:
        return "Fragment";
      case qc:
        return "Profiler";
      case bg:
        return "StrictMode";
      case Ic:
        return "Suspense";
      case jc:
        return "SuspenseList";
      case Yc:
        return "Activity";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case fa:
          return "Portal";
        case al:
          return (t.displayName || "Context") + ".Provider";
        case xg:
          return (t._context.displayName || "Context") + ".Consumer";
        case Lf:
          var e = t.render;
          return (
            (t = t.displayName),
            t || ((t = e.displayName || e.name || ""), (t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")),
            t
          );
        case Uf:
          return ((e = t.displayName || null), e !== null ? e : Fc(t.type) || "Memo");
        case El:
          ((e = t._payload), (t = t._init));
          try {
            return Fc(t(e));
          } catch {}
      }
    return null;
  }
  var da = Array.isArray,
    at = hg.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    Lt = rk.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    fi = { pending: !1, data: null, method: null, action: null },
    Vc = [],
    er = -1;
  function Xn(t) {
    return { current: t };
  }
  function _e(t) {
    0 > er || ((t.current = Vc[er]), (Vc[er] = null), er--);
  }
  function Wt(t, e) {
    (er++, (Vc[er] = t.current), (t.current = e));
  }
  var Qn = Xn(null),
    Ra = Xn(null),
    Ll = Xn(null),
    ss = Xn(null);
  function us(t, e) {
    switch ((Wt(Ll, e), Wt(Ra, t), Wt(Qn, null), e.nodeType)) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? eg(t) : 0;
        break;
      default:
        if (((t = e.tagName), (e = e.namespaceURI))) ((e = eg(e)), (t = Bv(e, t)));
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    (_e(Qn), Wt(Qn, t));
  }
  function xr() {
    (_e(Qn), _e(Ra), _e(Ll));
  }
  function Qc(t) {
    t.memoizedState !== null && Wt(ss, t);
    var e = Qn.current,
      n = Bv(e, t.type);
    e !== n && (Wt(Ra, t), Wt(Qn, n));
  }
  function cs(t) {
    (Ra.current === t && (_e(Qn), _e(Ra)), ss.current === t && (_e(ss), (qa._currentValue = fi)));
  }
  var Pc = Object.prototype.hasOwnProperty,
    Bf = we.unstable_scheduleCallback,
    sc = we.unstable_cancelCallback,
    fk = we.unstable_shouldYield,
    dk = we.unstable_requestPaint,
    Pn = we.unstable_now,
    mk = we.unstable_getCurrentPriorityLevel,
    kg = we.unstable_ImmediatePriority,
    Sg = we.unstable_UserBlockingPriority,
    fs = we.unstable_NormalPriority,
    pk = we.unstable_LowPriority,
    wg = we.unstable_IdlePriority,
    hk = we.log,
    gk = we.unstable_setDisableYieldValue,
    Va = null,
    pn = null;
  function Dl(t) {
    if ((typeof hk == "function" && gk(t), pn && typeof pn.setStrictMode == "function"))
      try {
        pn.setStrictMode(Va, t);
      } catch {}
  }
  var hn = Math.clz32 ? Math.clz32 : bk,
    yk = Math.log,
    vk = Math.LN2;
  function bk(t) {
    return ((t >>>= 0), t === 0 ? 32 : (31 - ((yk(t) / vk) | 0)) | 0);
  }
  var Oo = 256,
    zo = 4194304;
  function si(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 4194048;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function Hs(t, e, n) {
    var l = t.pendingLanes;
    if (l === 0) return 0;
    var i = 0,
      r = t.suspendedLanes,
      a = t.pingedLanes;
    t = t.warmLanes;
    var o = l & 134217727;
    return (
      o !== 0
        ? ((l = o & ~r),
          l !== 0 ? (i = si(l)) : ((a &= o), a !== 0 ? (i = si(a)) : n || ((n = o & ~t), n !== 0 && (i = si(n)))))
        : ((o = l & ~r), o !== 0 ? (i = si(o)) : a !== 0 ? (i = si(a)) : n || ((n = l & ~t), n !== 0 && (i = si(n)))),
      i === 0
        ? 0
        : e !== 0 &&
            e !== i &&
            (e & r) === 0 &&
            ((r = i & -i), (n = e & -e), r >= n || (r === 32 && (n & 4194048) !== 0))
          ? e
          : i
    );
  }
  function Qa(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function xk(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Tg() {
    var t = Oo;
    return ((Oo <<= 1), (Oo & 4194048) === 0 && (Oo = 256), t);
  }
  function Eg() {
    var t = zo;
    return ((zo <<= 1), (zo & 62914560) === 0 && (zo = 4194304), t);
  }
  function uc(t) {
    for (var e = [], n = 0; 31 > n; n++) e.push(t);
    return e;
  }
  function Pa(t, e) {
    ((t.pendingLanes |= e), e !== 268435456 && ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0)));
  }
  function kk(t, e, n, l, i, r) {
    var a = t.pendingLanes;
    ((t.pendingLanes = n),
      (t.suspendedLanes = 0),
      (t.pingedLanes = 0),
      (t.warmLanes = 0),
      (t.expiredLanes &= n),
      (t.entangledLanes &= n),
      (t.errorRecoveryDisabledLanes &= n),
      (t.shellSuspendCounter = 0));
    var o = t.entanglements,
      s = t.expirationTimes,
      u = t.hiddenUpdates;
    for (n = a & ~n; 0 < n;) {
      var f = 31 - hn(n),
        c = 1 << f;
      ((o[f] = 0), (s[f] = -1));
      var m = u[f];
      if (m !== null)
        for (u[f] = null, f = 0; f < m.length; f++) {
          var d = m[f];
          d !== null && (d.lane &= -536870913);
        }
      n &= ~c;
    }
    (l !== 0 && Cg(t, l, 0), r !== 0 && i === 0 && t.tag !== 0 && (t.suspendedLanes |= r & ~(a & ~e)));
  }
  function Cg(t, e, n) {
    ((t.pendingLanes |= e), (t.suspendedLanes &= ~e));
    var l = 31 - hn(e);
    ((t.entangledLanes |= e), (t.entanglements[l] = t.entanglements[l] | 1073741824 | (n & 4194090)));
  }
  function Ag(t, e) {
    var n = (t.entangledLanes |= e);
    for (t = t.entanglements; n;) {
      var l = 31 - hn(n),
        i = 1 << l;
      ((i & e) | (t[l] & e) && (t[l] |= e), (n &= ~i));
    }
  }
  function Hf(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function qf(t) {
    return ((t &= -t), 2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
  }
  function Ng() {
    var t = Lt.p;
    return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : Gv(t.type));
  }
  function Sk(t, e) {
    var n = Lt.p;
    try {
      return ((Lt.p = t), e());
    } finally {
      Lt.p = n;
    }
  }
  var Pl = Math.random().toString(36).slice(2),
    je = "__reactFiber$" + Pl,
    an = "__reactProps$" + Pl,
    Dr = "__reactContainer$" + Pl,
    Gc = "__reactEvents$" + Pl,
    wk = "__reactListeners$" + Pl,
    Tk = "__reactHandles$" + Pl,
    Kp = "__reactResources$" + Pl,
    Ga = "__reactMarker$" + Pl;
  function If(t) {
    (delete t[je], delete t[an], delete t[Gc], delete t[wk], delete t[Tk]);
  }
  function nr(t) {
    var e = t[je];
    if (e) return e;
    for (var n = t.parentNode; n;) {
      if ((e = n[Dr] || n[je])) {
        if (((n = e.alternate), e.child !== null || (n !== null && n.child !== null)))
          for (t = ig(t); t !== null;) {
            if ((n = t[je])) return n;
            t = ig(t);
          }
        return e;
      }
      ((t = n), (n = t.parentNode));
    }
    return null;
  }
  function _r(t) {
    if ((t = t[je] || t[Dr])) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 26 || e === 27 || e === 3) return t;
    }
    return null;
  }
  function ma(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(O(33));
  }
  function dr(t) {
    var e = t[Kp];
    return (e || (e = t[Kp] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), e);
  }
  function Me(t) {
    t[Ga] = !0;
  }
  var Rg = new Set(),
    Mg = {};
  function Si(t, e) {
    (kr(t, e), kr(t + "Capture", e));
  }
  function kr(t, e) {
    for (Mg[t] = e, t = 0; t < e.length; t++) Rg.add(e[t]);
  }
  var Ek = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    Jp = {},
    $p = {};
  function Ck(t) {
    return Pc.call($p, t) ? !0 : Pc.call(Jp, t) ? !1 : Ek.test(t) ? ($p[t] = !0) : ((Jp[t] = !0), !1);
  }
  function Zo(t, e, n) {
    if (Ck(e))
      if (n === null) t.removeAttribute(e);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var l = e.toLowerCase().slice(0, 5);
            if (l !== "data-" && l !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, "" + n);
      }
  }
  function Lo(t, e, n) {
    if (n === null) t.removeAttribute(e);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, "" + n);
    }
  }
  function nl(t, e, n, l) {
    if (l === null) t.removeAttribute(n);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(n);
          return;
      }
      t.setAttributeNS(e, n, "" + l);
    }
  }
  var cc, Wp;
  function Ji(t) {
    if (cc === void 0)
      try {
        throw Error();
      } catch (n) {
        var e = n.stack.trim().match(/\n( *(at )?)/);
        ((cc = (e && e[1]) || ""),
          (Wp =
            -1 <
            n.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < n.stack.indexOf("@")
                ? "@unknown:0:0"
                : ""));
      }
    return (
      `
` +
      cc +
      t +
      Wp
    );
  }
  var fc = !1;
  function dc(t, e) {
    if (!t || fc) return "";
    fc = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function () {
          try {
            if (e) {
              var c = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(c.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(c, []);
                } catch (d) {
                  var m = d;
                }
                Reflect.construct(t, [], c);
              } else {
                try {
                  c.call();
                } catch (d) {
                  m = d;
                }
                t.call(c.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (d) {
                m = d;
              }
              (c = t()) && typeof c.catch == "function" && c.catch(function () {});
            }
          } catch (d) {
            if (d && m && typeof d.stack == "string") return [d.stack, m.stack];
          }
          return [null, null];
        },
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var i = Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot, "name");
      i &&
        i.configurable &&
        Object.defineProperty(l.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
      var r = l.DetermineComponentFrameRoot(),
        a = r[0],
        o = r[1];
      if (a && o) {
        var s = a.split(`
`),
          u = o.split(`
`);
        for (i = l = 0; l < s.length && !s[l].includes("DetermineComponentFrameRoot");) l++;
        for (; i < u.length && !u[i].includes("DetermineComponentFrameRoot");) i++;
        if (l === s.length || i === u.length)
          for (l = s.length - 1, i = u.length - 1; 1 <= l && 0 <= i && s[l] !== u[i];) i--;
        for (; 1 <= l && 0 <= i; l--, i--)
          if (s[l] !== u[i]) {
            if (l !== 1 || i !== 1)
              do
                if ((l--, i--, 0 > i || s[l] !== u[i])) {
                  var f =
                    `
` + s[l].replace(" at new ", " at ");
                  return (
                    t.displayName && f.includes("<anonymous>") && (f = f.replace("<anonymous>", t.displayName)),
                    f
                  );
                }
              while (1 <= l && 0 <= i);
            break;
          }
      }
    } finally {
      ((fc = !1), (Error.prepareStackTrace = n));
    }
    return (n = t ? t.displayName || t.name : "") ? Ji(n) : "";
  }
  function Ak(t) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return Ji(t.type);
      case 16:
        return Ji("Lazy");
      case 13:
        return Ji("Suspense");
      case 19:
        return Ji("SuspenseList");
      case 0:
      case 15:
        return dc(t.type, !1);
      case 11:
        return dc(t.type.render, !1);
      case 1:
        return dc(t.type, !0);
      case 31:
        return Ji("Activity");
      default:
        return "";
    }
  }
  function th(t) {
    try {
      var e = "";
      do ((e += Ak(t)), (t = t.return));
      while (t);
      return e;
    } catch (n) {
      return (
        `
Error generating stack: ` +
        n.message +
        `
` +
        n.stack
      );
    }
  }
  function En(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function Dg(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function Nk(t) {
    var e = Dg(t) ? "checked" : "value",
      n = Object.getOwnPropertyDescriptor(t.constructor.prototype, e),
      l = "" + t[e];
    if (!t.hasOwnProperty(e) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var i = n.get,
        r = n.set;
      return (
        Object.defineProperty(t, e, {
          configurable: !0,
          get: function () {
            return i.call(this);
          },
          set: function (a) {
            ((l = "" + a), r.call(this, a));
          },
        }),
        Object.defineProperty(t, e, { enumerable: n.enumerable }),
        {
          getValue: function () {
            return l;
          },
          setValue: function (a) {
            l = "" + a;
          },
          stopTracking: function () {
            ((t._valueTracker = null), delete t[e]);
          },
        }
      );
    }
  }
  function ds(t) {
    t._valueTracker || (t._valueTracker = Nk(t));
  }
  function _g(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var n = e.getValue(),
      l = "";
    return (t && (l = Dg(t) ? (t.checked ? "true" : "false") : t.value), (t = l), t !== n ? (e.setValue(t), !0) : !1);
  }
  function ms(t) {
    if (((t = t || (typeof document < "u" ? document : void 0)), typeof t > "u")) return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var Rk = /[\n"\\]/g;
  function Nn(t) {
    return t.replace(Rk, function (e) {
      return "\\" + e.charCodeAt(0).toString(16) + " ";
    });
  }
  function Xc(t, e, n, l, i, r, a, o) {
    ((t.name = ""),
      a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean"
        ? (t.type = a)
        : t.removeAttribute("type"),
      e != null
        ? a === "number"
          ? ((e === 0 && t.value === "") || t.value != e) && (t.value = "" + En(e))
          : t.value !== "" + En(e) && (t.value = "" + En(e))
        : (a !== "submit" && a !== "reset") || t.removeAttribute("value"),
      e != null ? Zc(t, a, En(e)) : n != null ? Zc(t, a, En(n)) : l != null && t.removeAttribute("value"),
      i == null && r != null && (t.defaultChecked = !!r),
      i != null && (t.checked = i && typeof i != "function" && typeof i != "symbol"),
      o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean"
        ? (t.name = "" + En(o))
        : t.removeAttribute("name"));
  }
  function Og(t, e, n, l, i, r, a, o) {
    if (
      (r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" && (t.type = r),
      e != null || n != null)
    ) {
      if (!((r !== "submit" && r !== "reset") || e != null)) return;
      ((n = n != null ? "" + En(n) : ""),
        (e = e != null ? "" + En(e) : n),
        o || e === t.value || (t.value = e),
        (t.defaultValue = e));
    }
    ((l = l ?? i),
      (l = typeof l != "function" && typeof l != "symbol" && !!l),
      (t.checked = o ? t.checked : !!l),
      (t.defaultChecked = !!l),
      a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (t.name = a));
  }
  function Zc(t, e, n) {
    (e === "number" && ms(t.ownerDocument) === t) || t.defaultValue === "" + n || (t.defaultValue = "" + n);
  }
  function mr(t, e, n, l) {
    if (((t = t.options), e)) {
      e = {};
      for (var i = 0; i < n.length; i++) e["$" + n[i]] = !0;
      for (n = 0; n < t.length; n++)
        ((i = e.hasOwnProperty("$" + t[n].value)),
          t[n].selected !== i && (t[n].selected = i),
          i && l && (t[n].defaultSelected = !0));
    } else {
      for (n = "" + En(n), e = null, i = 0; i < t.length; i++) {
        if (t[i].value === n) {
          ((t[i].selected = !0), l && (t[i].defaultSelected = !0));
          return;
        }
        e !== null || t[i].disabled || (e = t[i]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function zg(t, e, n) {
    if (e != null && ((e = "" + En(e)), e !== t.value && (t.value = e), n == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = n != null ? "" + En(n) : "";
  }
  function Lg(t, e, n, l) {
    if (e == null) {
      if (l != null) {
        if (n != null) throw Error(O(92));
        if (da(l)) {
          if (1 < l.length) throw Error(O(93));
          l = l[0];
        }
        n = l;
      }
      (n == null && (n = ""), (e = n));
    }
    ((n = En(e)), (t.defaultValue = n), (l = t.textContent), l === n && l !== "" && l !== null && (t.value = l));
  }
  function Sr(t, e) {
    if (e) {
      var n = t.firstChild;
      if (n && n === t.lastChild && n.nodeType === 3) {
        n.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var Mk = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " ",
    ),
  );
  function eh(t, e, n) {
    var l = e.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === ""
      ? l
        ? t.setProperty(e, "")
        : e === "float"
          ? (t.cssFloat = "")
          : (t[e] = "")
      : l
        ? t.setProperty(e, n)
        : typeof n != "number" || n === 0 || Mk.has(e)
          ? e === "float"
            ? (t.cssFloat = n)
            : (t[e] = ("" + n).trim())
          : (t[e] = n + "px");
  }
  function Ug(t, e, n) {
    if (e != null && typeof e != "object") throw Error(O(62));
    if (((t = t.style), n != null)) {
      for (var l in n)
        !n.hasOwnProperty(l) ||
          (e != null && e.hasOwnProperty(l)) ||
          (l.indexOf("--") === 0 ? t.setProperty(l, "") : l === "float" ? (t.cssFloat = "") : (t[l] = ""));
      for (var i in e) ((l = e[i]), e.hasOwnProperty(i) && n[i] !== l && eh(t, i, l));
    } else for (var r in e) e.hasOwnProperty(r) && eh(t, r, e[r]);
  }
  function jf(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Dk = new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    _k =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ko(t) {
    return _k.test("" + t)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : t;
  }
  var Kc = null;
  function Yf(t) {
    return (
      (t = t.target || t.srcElement || window),
      t.correspondingUseElement && (t = t.correspondingUseElement),
      t.nodeType === 3 ? t.parentNode : t
    );
  }
  var lr = null,
    pr = null;
  function nh(t) {
    var e = _r(t);
    if (e && (t = e.stateNode)) {
      var n = t[an] || null;
      t: switch (((t = e.stateNode), e.type)) {
        case "input":
          if (
            (Xc(t, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name),
            (e = n.name),
            n.type === "radio" && e != null)
          ) {
            for (n = t; n.parentNode;) n = n.parentNode;
            for (n = n.querySelectorAll('input[name="' + Nn("" + e) + '"][type="radio"]'), e = 0; e < n.length; e++) {
              var l = n[e];
              if (l !== t && l.form === t.form) {
                var i = l[an] || null;
                if (!i) throw Error(O(90));
                Xc(l, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name);
              }
            }
            for (e = 0; e < n.length; e++) ((l = n[e]), l.form === t.form && _g(l));
          }
          break t;
        case "textarea":
          zg(t, n.value, n.defaultValue);
          break t;
        case "select":
          ((e = n.value), e != null && mr(t, !!n.multiple, e, !1));
      }
    }
  }
  var mc = !1;
  function Bg(t, e, n) {
    if (mc) return t(e, n);
    mc = !0;
    try {
      var l = t(e);
      return l;
    } finally {
      if (((mc = !1), (lr !== null || pr !== null) && (Xs(), lr && ((e = lr), (t = pr), (pr = lr = null), nh(e), t))))
        for (e = 0; e < t.length; e++) nh(t[e]);
    }
  }
  function Ma(t, e) {
    var n = t.stateNode;
    if (n === null) return null;
    var l = n[an] || null;
    if (l === null) return null;
    n = l[e];
    t: switch (e) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((l = !l.disabled) ||
          ((t = t.type), (l = !(t === "button" || t === "input" || t === "select" || t === "textarea"))),
          (t = !l));
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (n && typeof n != "function") throw Error(O(231, e, typeof n));
    return n;
  }
  var ml = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
    Jc = !1;
  if (ml)
    try {
      ((Xi = {}),
        Object.defineProperty(Xi, "passive", {
          get: function () {
            Jc = !0;
          },
        }),
        window.addEventListener("test", Xi, Xi),
        window.removeEventListener("test", Xi, Xi));
    } catch {
      Jc = !1;
    }
  var Xi,
    _l = null,
    Ff = null,
    Jo = null;
  function Hg() {
    if (Jo) return Jo;
    var t,
      e = Ff,
      n = e.length,
      l,
      i = "value" in _l ? _l.value : _l.textContent,
      r = i.length;
    for (t = 0; t < n && e[t] === i[t]; t++);
    var a = n - t;
    for (l = 1; l <= a && e[n - l] === i[r - l]; l++);
    return (Jo = i.slice(t, 1 < l ? 1 - l : void 0));
  }
  function $o(t) {
    var e = t.keyCode;
    return (
      "charCode" in t ? ((t = t.charCode), t === 0 && e === 13 && (t = 13)) : (t = e),
      t === 10 && (t = 13),
      32 <= t || t === 13 ? t : 0
    );
  }
  function Uo() {
    return !0;
  }
  function lh() {
    return !1;
  }
  function on(t) {
    function e(n, l, i, r, a) {
      ((this._reactName = n),
        (this._targetInst = i),
        (this.type = l),
        (this.nativeEvent = r),
        (this.target = a),
        (this.currentTarget = null));
      for (var o in t) t.hasOwnProperty(o) && ((n = t[o]), (this[o] = n ? n(r) : r[o]));
      return (
        (this.isDefaultPrevented = (r.defaultPrevented != null ? r.defaultPrevented : r.returnValue === !1) ? Uo : lh),
        (this.isPropagationStopped = lh),
        this
      );
    }
    return (
      Zt(e.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var n = this.nativeEvent;
          n &&
            (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1),
            (this.isDefaultPrevented = Uo));
        },
        stopPropagation: function () {
          var n = this.nativeEvent;
          n &&
            (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
            (this.isPropagationStopped = Uo));
        },
        persist: function () {},
        isPersistent: Uo,
      }),
      e
    );
  }
  var wi = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (t) {
        return t.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    qs = on(wi),
    Xa = Zt({}, wi, { view: 0, detail: 0 }),
    Ok = on(Xa),
    pc,
    hc,
    ia,
    Is = Zt({}, Xa, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Vf,
      button: 0,
      buttons: 0,
      relatedTarget: function (t) {
        return t.relatedTarget === void 0
          ? t.fromElement === t.srcElement
            ? t.toElement
            : t.fromElement
          : t.relatedTarget;
      },
      movementX: function (t) {
        return "movementX" in t
          ? t.movementX
          : (t !== ia &&
              (ia && t.type === "mousemove"
                ? ((pc = t.screenX - ia.screenX), (hc = t.screenY - ia.screenY))
                : (hc = pc = 0),
              (ia = t)),
            pc);
      },
      movementY: function (t) {
        return "movementY" in t ? t.movementY : hc;
      },
    }),
    ih = on(Is),
    zk = Zt({}, Is, { dataTransfer: 0 }),
    Lk = on(zk),
    Uk = Zt({}, Xa, { relatedTarget: 0 }),
    gc = on(Uk),
    Bk = Zt({}, wi, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Hk = on(Bk),
    qk = Zt({}, wi, {
      clipboardData: function (t) {
        return "clipboardData" in t ? t.clipboardData : window.clipboardData;
      },
    }),
    Ik = on(qk),
    jk = Zt({}, wi, { data: 0 }),
    rh = on(jk),
    Yk = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    Fk = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    Vk = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Qk(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = Vk[t]) ? !!e[t] : !1;
  }
  function Vf() {
    return Qk;
  }
  var Pk = Zt({}, Xa, {
      key: function (t) {
        if (t.key) {
          var e = Yk[t.key] || t.key;
          if (e !== "Unidentified") return e;
        }
        return t.type === "keypress"
          ? ((t = $o(t)), t === 13 ? "Enter" : String.fromCharCode(t))
          : t.type === "keydown" || t.type === "keyup"
            ? Fk[t.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Vf,
      charCode: function (t) {
        return t.type === "keypress" ? $o(t) : 0;
      },
      keyCode: function (t) {
        return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
      },
      which: function (t) {
        return t.type === "keypress" ? $o(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
      },
    }),
    Gk = on(Pk),
    Xk = Zt({}, Is, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    ah = on(Xk),
    Zk = Zt({}, Xa, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Vf,
    }),
    Kk = on(Zk),
    Jk = Zt({}, wi, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    $k = on(Jk),
    Wk = Zt({}, Is, {
      deltaX: function (t) {
        return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
      },
      deltaY: function (t) {
        return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    tS = on(Wk),
    eS = Zt({}, wi, { newState: 0, oldState: 0 }),
    nS = on(eS),
    lS = [9, 13, 27, 32],
    Qf = ml && "CompositionEvent" in window,
    ha = null;
  ml && "documentMode" in document && (ha = document.documentMode);
  var iS = ml && "TextEvent" in window && !ha,
    qg = ml && (!Qf || (ha && 8 < ha && 11 >= ha)),
    oh = " ",
    sh = !1;
  function Ig(t, e) {
    switch (t) {
      case "keyup":
        return lS.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function jg(t) {
    return ((t = t.detail), typeof t == "object" && "data" in t ? t.data : null);
  }
  var ir = !1;
  function rS(t, e) {
    switch (t) {
      case "compositionend":
        return jg(e);
      case "keypress":
        return e.which !== 32 ? null : ((sh = !0), oh);
      case "textInput":
        return ((t = e.data), t === oh && sh ? null : t);
      default:
        return null;
    }
  }
  function aS(t, e) {
    if (ir)
      return t === "compositionend" || (!Qf && Ig(t, e)) ? ((t = Hg()), (Jo = Ff = _l = null), (ir = !1), t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || (e.ctrlKey && e.altKey)) {
          if (e.char && 1 < e.char.length) return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return qg && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var oS = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function uh(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!oS[t.type] : e === "textarea";
  }
  function Yg(t, e, n, l) {
    (lr ? (pr ? pr.push(l) : (pr = [l])) : (lr = l),
      (e = Ds(e, "onChange")),
      0 < e.length && ((n = new qs("onChange", "change", null, n, l)), t.push({ event: n, listeners: e })));
  }
  var ga = null,
    Da = null;
  function sS(t) {
    zv(t, 0);
  }
  function js(t) {
    var e = ma(t);
    if (_g(e)) return t;
  }
  function ch(t, e) {
    if (t === "change") return e;
  }
  var Fg = !1;
  ml &&
    (ml
      ? ((Ho = "oninput" in document),
        Ho ||
          ((yc = document.createElement("div")),
          yc.setAttribute("oninput", "return;"),
          (Ho = typeof yc.oninput == "function")),
        (Bo = Ho))
      : (Bo = !1),
    (Fg = Bo && (!document.documentMode || 9 < document.documentMode)));
  var Bo, Ho, yc;
  function fh() {
    ga && (ga.detachEvent("onpropertychange", Vg), (Da = ga = null));
  }
  function Vg(t) {
    if (t.propertyName === "value" && js(Da)) {
      var e = [];
      (Yg(e, Da, t, Yf(t)), Bg(sS, e));
    }
  }
  function uS(t, e, n) {
    t === "focusin" ? (fh(), (ga = e), (Da = n), ga.attachEvent("onpropertychange", Vg)) : t === "focusout" && fh();
  }
  function cS(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown") return js(Da);
  }
  function fS(t, e) {
    if (t === "click") return js(e);
  }
  function dS(t, e) {
    if (t === "input" || t === "change") return js(e);
  }
  function mS(t, e) {
    return (t === e && (t !== 0 || 1 / t === 1 / e)) || (t !== t && e !== e);
  }
  var vn = typeof Object.is == "function" ? Object.is : mS;
  function _a(t, e) {
    if (vn(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null) return !1;
    var n = Object.keys(t),
      l = Object.keys(e);
    if (n.length !== l.length) return !1;
    for (l = 0; l < n.length; l++) {
      var i = n[l];
      if (!Pc.call(e, i) || !vn(t[i], e[i])) return !1;
    }
    return !0;
  }
  function dh(t) {
    for (; t && t.firstChild;) t = t.firstChild;
    return t;
  }
  function mh(t, e) {
    var n = dh(t);
    t = 0;
    for (var l; n;) {
      if (n.nodeType === 3) {
        if (((l = t + n.textContent.length), t <= e && l >= e)) return { node: n, offset: e - t };
        t = l;
      }
      t: {
        for (; n;) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break t;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = dh(n);
    }
  }
  function Qg(t, e) {
    return t && e
      ? t === e
        ? !0
        : t && t.nodeType === 3
          ? !1
          : e && e.nodeType === 3
            ? Qg(t, e.parentNode)
            : "contains" in t
              ? t.contains(e)
              : t.compareDocumentPosition
                ? !!(t.compareDocumentPosition(e) & 16)
                : !1
      : !1;
  }
  function Pg(t) {
    t =
      t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null
        ? t.ownerDocument.defaultView
        : window;
    for (var e = ms(t.document); e instanceof t.HTMLIFrameElement;) {
      try {
        var n = typeof e.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) t = e.contentWindow;
      else break;
      e = ms(t.document);
    }
    return e;
  }
  function Pf(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return (
      e &&
      ((e === "input" &&
        (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password")) ||
        e === "textarea" ||
        t.contentEditable === "true")
    );
  }
  var pS = ml && "documentMode" in document && 11 >= document.documentMode,
    rr = null,
    $c = null,
    ya = null,
    Wc = !1;
  function ph(t, e, n) {
    var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Wc ||
      rr == null ||
      rr !== ms(l) ||
      ((l = rr),
      "selectionStart" in l && Pf(l)
        ? (l = { start: l.selectionStart, end: l.selectionEnd })
        : ((l = ((l.ownerDocument && l.ownerDocument.defaultView) || window).getSelection()),
          (l = {
            anchorNode: l.anchorNode,
            anchorOffset: l.anchorOffset,
            focusNode: l.focusNode,
            focusOffset: l.focusOffset,
          })),
      (ya && _a(ya, l)) ||
        ((ya = l),
        (l = Ds($c, "onSelect")),
        0 < l.length &&
          ((e = new qs("onSelect", "select", null, e, n)), t.push({ event: e, listeners: l }), (e.target = rr))));
  }
  function oi(t, e) {
    var n = {};
    return ((n[t.toLowerCase()] = e.toLowerCase()), (n["Webkit" + t] = "webkit" + e), (n["Moz" + t] = "moz" + e), n);
  }
  var ar = {
      animationend: oi("Animation", "AnimationEnd"),
      animationiteration: oi("Animation", "AnimationIteration"),
      animationstart: oi("Animation", "AnimationStart"),
      transitionrun: oi("Transition", "TransitionRun"),
      transitionstart: oi("Transition", "TransitionStart"),
      transitioncancel: oi("Transition", "TransitionCancel"),
      transitionend: oi("Transition", "TransitionEnd"),
    },
    vc = {},
    Gg = {};
  ml &&
    ((Gg = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete ar.animationend.animation, delete ar.animationiteration.animation, delete ar.animationstart.animation),
    "TransitionEvent" in window || delete ar.transitionend.transition);
  function Ti(t) {
    if (vc[t]) return vc[t];
    if (!ar[t]) return t;
    var e = ar[t],
      n;
    for (n in e) if (e.hasOwnProperty(n) && n in Gg) return (vc[t] = e[n]);
    return t;
  }
  var Xg = Ti("animationend"),
    Zg = Ti("animationiteration"),
    Kg = Ti("animationstart"),
    hS = Ti("transitionrun"),
    gS = Ti("transitionstart"),
    yS = Ti("transitioncancel"),
    Jg = Ti("transitionend"),
    $g = new Map(),
    tf =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  tf.push("scrollEnd");
  function Bn(t, e) {
    ($g.set(t, e), Si(e, [t]));
  }
  var hh = new WeakMap();
  function Rn(t, e) {
    if (typeof t == "object" && t !== null) {
      var n = hh.get(t);
      return n !== void 0 ? n : ((e = { value: t, source: e, stack: th(e) }), hh.set(t, e), e);
    }
    return { value: t, source: e, stack: th(e) };
  }
  var Tn = [],
    or = 0,
    Gf = 0;
  function Ys() {
    for (var t = or, e = (Gf = or = 0); e < t;) {
      var n = Tn[e];
      Tn[e++] = null;
      var l = Tn[e];
      Tn[e++] = null;
      var i = Tn[e];
      Tn[e++] = null;
      var r = Tn[e];
      if (((Tn[e++] = null), l !== null && i !== null)) {
        var a = l.pending;
        (a === null ? (i.next = i) : ((i.next = a.next), (a.next = i)), (l.pending = i));
      }
      r !== 0 && Wg(n, i, r);
    }
  }
  function Fs(t, e, n, l) {
    ((Tn[or++] = t),
      (Tn[or++] = e),
      (Tn[or++] = n),
      (Tn[or++] = l),
      (Gf |= l),
      (t.lanes |= l),
      (t = t.alternate),
      t !== null && (t.lanes |= l));
  }
  function Xf(t, e, n, l) {
    return (Fs(t, e, n, l), ps(t));
  }
  function Or(t, e) {
    return (Fs(t, null, null, e), ps(t));
  }
  function Wg(t, e, n) {
    t.lanes |= n;
    var l = t.alternate;
    l !== null && (l.lanes |= n);
    for (var i = !1, r = t.return; r !== null;)
      ((r.childLanes |= n),
        (l = r.alternate),
        l !== null && (l.childLanes |= n),
        r.tag === 22 && ((t = r.stateNode), t === null || t._visibility & 1 || (i = !0)),
        (t = r),
        (r = r.return));
    return t.tag === 3
      ? ((r = t.stateNode),
        i &&
          e !== null &&
          ((i = 31 - hn(n)),
          (t = r.hiddenUpdates),
          (l = t[i]),
          l === null ? (t[i] = [e]) : l.push(e),
          (e.lane = n | 536870912)),
        r)
      : null;
  }
  function ps(t) {
    if (50 < Aa) throw ((Aa = 0), (Sf = null), Error(O(185)));
    for (var e = t.return; e !== null;) ((t = e), (e = t.return));
    return t.tag === 3 ? t.stateNode : null;
  }
  var sr = {};
  function vS(t, e, n, l) {
    ((this.tag = t),
      (this.key = n),
      (this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = e),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = l),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function mn(t, e, n, l) {
    return new vS(t, e, n, l);
  }
  function Zf(t) {
    return ((t = t.prototype), !(!t || !t.isReactComponent));
  }
  function fl(t, e) {
    var n = t.alternate;
    return (
      n === null
        ? ((n = mn(t.tag, e, t.key, t.mode)),
          (n.elementType = t.elementType),
          (n.type = t.type),
          (n.stateNode = t.stateNode),
          (n.alternate = t),
          (t.alternate = n))
        : ((n.pendingProps = e), (n.type = t.type), (n.flags = 0), (n.subtreeFlags = 0), (n.deletions = null)),
      (n.flags = t.flags & 65011712),
      (n.childLanes = t.childLanes),
      (n.lanes = t.lanes),
      (n.child = t.child),
      (n.memoizedProps = t.memoizedProps),
      (n.memoizedState = t.memoizedState),
      (n.updateQueue = t.updateQueue),
      (e = t.dependencies),
      (n.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }),
      (n.sibling = t.sibling),
      (n.index = t.index),
      (n.ref = t.ref),
      (n.refCleanup = t.refCleanup),
      n
    );
  }
  function ty(t, e) {
    t.flags &= 65011714;
    var n = t.alternate;
    return (
      n === null
        ? ((t.childLanes = 0),
          (t.lanes = e),
          (t.child = null),
          (t.subtreeFlags = 0),
          (t.memoizedProps = null),
          (t.memoizedState = null),
          (t.updateQueue = null),
          (t.dependencies = null),
          (t.stateNode = null))
        : ((t.childLanes = n.childLanes),
          (t.lanes = n.lanes),
          (t.child = n.child),
          (t.subtreeFlags = 0),
          (t.deletions = null),
          (t.memoizedProps = n.memoizedProps),
          (t.memoizedState = n.memoizedState),
          (t.updateQueue = n.updateQueue),
          (t.type = n.type),
          (e = n.dependencies),
          (t.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
      t
    );
  }
  function Wo(t, e, n, l, i, r) {
    var a = 0;
    if (((l = t), typeof t == "function")) Zf(t) && (a = 1);
    else if (typeof t == "string")
      a = vw(t, n, Qn.current) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (t) {
        case Yc:
          return ((t = mn(31, n, e, i)), (t.elementType = Yc), (t.lanes = r), t);
        case tr:
          return di(n.children, i, r, e);
        case bg:
          ((a = 8), (i |= 24));
          break;
        case qc:
          return ((t = mn(12, n, e, i | 2)), (t.elementType = qc), (t.lanes = r), t);
        case Ic:
          return ((t = mn(13, n, e, i)), (t.elementType = Ic), (t.lanes = r), t);
        case jc:
          return ((t = mn(19, n, e, i)), (t.elementType = jc), (t.lanes = r), t);
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case sk:
              case al:
                a = 10;
                break t;
              case xg:
                a = 9;
                break t;
              case Lf:
                a = 11;
                break t;
              case Uf:
                a = 14;
                break t;
              case El:
                ((a = 16), (l = null));
                break t;
            }
          ((a = 29), (n = Error(O(130, t === null ? "null" : typeof t, ""))), (l = null));
      }
    return ((e = mn(a, n, e, i)), (e.elementType = t), (e.type = l), (e.lanes = r), e);
  }
  function di(t, e, n, l) {
    return ((t = mn(7, t, l, e)), (t.lanes = n), t);
  }
  function bc(t, e, n) {
    return ((t = mn(6, t, null, e)), (t.lanes = n), t);
  }
  function xc(t, e, n) {
    return (
      (e = mn(4, t.children !== null ? t.children : [], t.key, e)),
      (e.lanes = n),
      (e.stateNode = { containerInfo: t.containerInfo, pendingChildren: null, implementation: t.implementation }),
      e
    );
  }
  var ur = [],
    cr = 0,
    hs = null,
    gs = 0,
    Cn = [],
    An = 0,
    mi = null,
    ol = 1,
    sl = "";
  function ui(t, e) {
    ((ur[cr++] = gs), (ur[cr++] = hs), (hs = t), (gs = e));
  }
  function ey(t, e, n) {
    ((Cn[An++] = ol), (Cn[An++] = sl), (Cn[An++] = mi), (mi = t));
    var l = ol;
    t = sl;
    var i = 32 - hn(l) - 1;
    ((l &= ~(1 << i)), (n += 1));
    var r = 32 - hn(e) + i;
    if (30 < r) {
      var a = i - (i % 5);
      ((r = (l & ((1 << a) - 1)).toString(32)),
        (l >>= a),
        (i -= a),
        (ol = (1 << (32 - hn(e) + i)) | (n << i) | l),
        (sl = r + t));
    } else ((ol = (1 << r) | (n << i) | l), (sl = t));
  }
  function Kf(t) {
    t.return !== null && (ui(t, 1), ey(t, 1, 0));
  }
  function Jf(t) {
    for (; t === hs;) ((hs = ur[--cr]), (ur[cr] = null), (gs = ur[--cr]), (ur[cr] = null));
    for (; t === mi;)
      ((mi = Cn[--An]), (Cn[An] = null), (sl = Cn[--An]), (Cn[An] = null), (ol = Cn[--An]), (Cn[An] = null));
  }
  var $e = null,
    ie = null,
    zt = !1,
    pi = null,
    Fn = !1,
    ef = Error(O(519));
  function vi(t) {
    var e = Error(O(418, ""));
    throw (Oa(Rn(e, t)), ef);
  }
  function gh(t) {
    var e = t.stateNode,
      n = t.type,
      l = t.memoizedProps;
    switch (((e[je] = t), (e[an] = l), n)) {
      case "dialog":
        (vt("cancel", e), vt("close", e));
        break;
      case "iframe":
      case "object":
      case "embed":
        vt("load", e);
        break;
      case "video":
      case "audio":
        for (n = 0; n < Ua.length; n++) vt(Ua[n], e);
        break;
      case "source":
        vt("error", e);
        break;
      case "img":
      case "image":
      case "link":
        (vt("error", e), vt("load", e));
        break;
      case "details":
        vt("toggle", e);
        break;
      case "input":
        (vt("invalid", e), Og(e, l.value, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name, !0), ds(e));
        break;
      case "select":
        vt("invalid", e);
        break;
      case "textarea":
        (vt("invalid", e), Lg(e, l.value, l.defaultValue, l.children), ds(e));
    }
    ((n = l.children),
      (typeof n != "string" && typeof n != "number" && typeof n != "bigint") ||
      e.textContent === "" + n ||
      l.suppressHydrationWarning === !0 ||
      Uv(e.textContent, n)
        ? (l.popover != null && (vt("beforetoggle", e), vt("toggle", e)),
          l.onScroll != null && vt("scroll", e),
          l.onScrollEnd != null && vt("scrollend", e),
          l.onClick != null && (e.onclick = Js),
          (e = !0))
        : (e = !1),
      e || vi(t));
  }
  function yh(t) {
    for ($e = t.return; $e;)
      switch ($e.tag) {
        case 5:
        case 13:
          Fn = !1;
          return;
        case 27:
        case 3:
          Fn = !0;
          return;
        default:
          $e = $e.return;
      }
  }
  function ra(t) {
    if (t !== $e) return !1;
    if (!zt) return (yh(t), (zt = !0), !1);
    var e = t.tag,
      n;
    if (
      ((n = e !== 3 && e !== 27) &&
        ((n = e === 5) && ((n = t.type), (n = !(n !== "form" && n !== "button") || Nf(t.type, t.memoizedProps))),
        (n = !n)),
      n && ie && vi(t),
      yh(t),
      e === 13)
    ) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t)) throw Error(O(317));
      t: {
        for (t = t.nextSibling, e = 0; t;) {
          if (t.nodeType === 8)
            if (((n = t.data), n === "/$")) {
              if (e === 0) {
                ie = Un(t.nextSibling);
                break t;
              }
              e--;
            } else (n !== "$" && n !== "$!" && n !== "$?") || e++;
          t = t.nextSibling;
        }
        ie = null;
      }
    } else
      e === 27
        ? ((e = ie), Gl(t.type) ? ((t = Df), (Df = null), (ie = t)) : (ie = e))
        : (ie = $e ? Un(t.stateNode.nextSibling) : null);
    return !0;
  }
  function Za() {
    ((ie = $e = null), (zt = !1));
  }
  function vh() {
    var t = pi;
    return (t !== null && (rn === null ? (rn = t) : rn.push.apply(rn, t), (pi = null)), t);
  }
  function Oa(t) {
    pi === null ? (pi = [t]) : pi.push(t);
  }
  var nf = Xn(null),
    Ei = null,
    ul = null;
  function Al(t, e, n) {
    (Wt(nf, e._currentValue), (e._currentValue = n));
  }
  function dl(t) {
    ((t._currentValue = nf.current), _e(nf));
  }
  function lf(t, e, n) {
    for (; t !== null;) {
      var l = t.alternate;
      if (
        ((t.childLanes & e) !== e
          ? ((t.childLanes |= e), l !== null && (l.childLanes |= e))
          : l !== null && (l.childLanes & e) !== e && (l.childLanes |= e),
        t === n)
      )
        break;
      t = t.return;
    }
  }
  function rf(t, e, n, l) {
    var i = t.child;
    for (i !== null && (i.return = t); i !== null;) {
      var r = i.dependencies;
      if (r !== null) {
        var a = i.child;
        r = r.firstContext;
        t: for (; r !== null;) {
          var o = r;
          r = i;
          for (var s = 0; s < e.length; s++)
            if (o.context === e[s]) {
              ((r.lanes |= n), (o = r.alternate), o !== null && (o.lanes |= n), lf(r.return, n, t), l || (a = null));
              break t;
            }
          r = o.next;
        }
      } else if (i.tag === 18) {
        if (((a = i.return), a === null)) throw Error(O(341));
        ((a.lanes |= n), (r = a.alternate), r !== null && (r.lanes |= n), lf(a, n, t), (a = null));
      } else a = i.child;
      if (a !== null) a.return = i;
      else
        for (a = i; a !== null;) {
          if (a === t) {
            a = null;
            break;
          }
          if (((i = a.sibling), i !== null)) {
            ((i.return = a.return), (a = i));
            break;
          }
          a = a.return;
        }
      i = a;
    }
  }
  function Ka(t, e, n, l) {
    t = null;
    for (var i = e, r = !1; i !== null;) {
      if (!r) {
        if ((i.flags & 524288) !== 0) r = !0;
        else if ((i.flags & 262144) !== 0) break;
      }
      if (i.tag === 10) {
        var a = i.alternate;
        if (a === null) throw Error(O(387));
        if (((a = a.memoizedProps), a !== null)) {
          var o = i.type;
          vn(i.pendingProps.value, a.value) || (t !== null ? t.push(o) : (t = [o]));
        }
      } else if (i === ss.current) {
        if (((a = i.alternate), a === null)) throw Error(O(387));
        a.memoizedState.memoizedState !== i.memoizedState.memoizedState && (t !== null ? t.push(qa) : (t = [qa]));
      }
      i = i.return;
    }
    (t !== null && rf(e, t, n, l), (e.flags |= 262144));
  }
  function ys(t) {
    for (t = t.firstContext; t !== null;) {
      if (!vn(t.context._currentValue, t.memoizedValue)) return !0;
      t = t.next;
    }
    return !1;
  }
  function bi(t) {
    ((Ei = t), (ul = null), (t = t.dependencies), t !== null && (t.firstContext = null));
  }
  function Ye(t) {
    return ny(Ei, t);
  }
  function qo(t, e) {
    return (Ei === null && bi(t), ny(t, e));
  }
  function ny(t, e) {
    var n = e._currentValue;
    if (((e = { context: e, memoizedValue: n, next: null }), ul === null)) {
      if (t === null) throw Error(O(308));
      ((ul = e), (t.dependencies = { lanes: 0, firstContext: e }), (t.flags |= 524288));
    } else ul = ul.next = e;
    return n;
  }
  var bS =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var t = [],
              e = (this.signal = {
                aborted: !1,
                addEventListener: function (n, l) {
                  t.push(l);
                },
              });
            this.abort = function () {
              ((e.aborted = !0),
                t.forEach(function (n) {
                  return n();
                }));
            };
          },
    xS = we.unstable_scheduleCallback,
    kS = we.unstable_NormalPriority,
    ke = { $$typeof: al, Consumer: null, Provider: null, _currentValue: null, _currentValue2: null, _threadCount: 0 };
  function $f() {
    return { controller: new bS(), data: new Map(), refCount: 0 };
  }
  function Ja(t) {
    (t.refCount--,
      t.refCount === 0 &&
        xS(kS, function () {
          t.controller.abort();
        }));
  }
  var va = null,
    af = 0,
    wr = 0,
    hr = null;
  function SS(t, e) {
    if (va === null) {
      var n = (va = []);
      ((af = 0),
        (wr = kd()),
        (hr = {
          status: "pending",
          value: void 0,
          then: function (l) {
            n.push(l);
          },
        }));
    }
    return (af++, e.then(bh, bh), e);
  }
  function bh() {
    if (--af === 0 && va !== null) {
      hr !== null && (hr.status = "fulfilled");
      var t = va;
      ((va = null), (wr = 0), (hr = null));
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function wS(t, e) {
    var n = [],
      l = {
        status: "pending",
        value: null,
        reason: null,
        then: function (i) {
          n.push(i);
        },
      };
    return (
      t.then(
        function () {
          ((l.status = "fulfilled"), (l.value = e));
          for (var i = 0; i < n.length; i++) (0, n[i])(e);
        },
        function (i) {
          for (l.status = "rejected", l.reason = i, i = 0; i < n.length; i++) (0, n[i])(void 0);
        },
      ),
      l
    );
  }
  var xh = at.S;
  at.S = function (t, e) {
    (typeof e == "object" && e !== null && typeof e.then == "function" && SS(t, e), xh !== null && xh(t, e));
  };
  var hi = Xn(null);
  function Wf() {
    var t = hi.current;
    return t !== null ? t : Gt.pooledCache;
  }
  function ts(t, e) {
    e === null ? Wt(hi, hi.current) : Wt(hi, e.pool);
  }
  function ly() {
    var t = Wf();
    return t === null ? null : { parent: ke._currentValue, pool: t };
  }
  var $a = Error(O(460)),
    iy = Error(O(474)),
    Vs = Error(O(542)),
    of = { then: function () {} };
  function kh(t) {
    return ((t = t.status), t === "fulfilled" || t === "rejected");
  }
  function Io() {}
  function ry(t, e, n) {
    switch (((n = t[n]), n === void 0 ? t.push(e) : n !== e && (e.then(Io, Io), (e = n)), e.status)) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw ((t = e.reason), wh(t), t);
      default:
        if (typeof e.status == "string") e.then(Io, Io);
        else {
          if (((t = Gt), t !== null && 100 < t.shellSuspendCounter)) throw Error(O(482));
          ((t = e),
            (t.status = "pending"),
            t.then(
              function (l) {
                if (e.status === "pending") {
                  var i = e;
                  ((i.status = "fulfilled"), (i.value = l));
                }
              },
              function (l) {
                if (e.status === "pending") {
                  var i = e;
                  ((i.status = "rejected"), (i.reason = l));
                }
              },
            ));
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw ((t = e.reason), wh(t), t);
        }
        throw ((ba = e), $a);
    }
  }
  var ba = null;
  function Sh() {
    if (ba === null) throw Error(O(459));
    var t = ba;
    return ((ba = null), t);
  }
  function wh(t) {
    if (t === $a || t === Vs) throw Error(O(483));
  }
  var Cl = !1;
  function td(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function sf(t, e) {
    ((t = t.updateQueue),
      e.updateQueue === t &&
        (e.updateQueue = {
          baseState: t.baseState,
          firstBaseUpdate: t.firstBaseUpdate,
          lastBaseUpdate: t.lastBaseUpdate,
          shared: t.shared,
          callbacks: null,
        }));
  }
  function Ul(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Bl(t, e, n) {
    var l = t.updateQueue;
    if (l === null) return null;
    if (((l = l.shared), (qt & 2) !== 0)) {
      var i = l.pending;
      return (
        i === null ? (e.next = e) : ((e.next = i.next), (i.next = e)),
        (l.pending = e),
        (e = ps(t)),
        Wg(t, null, n),
        e
      );
    }
    return (Fs(t, l, e, n), ps(t));
  }
  function xa(t, e, n) {
    if (((e = e.updateQueue), e !== null && ((e = e.shared), (n & 4194048) !== 0))) {
      var l = e.lanes;
      ((l &= t.pendingLanes), (n |= l), (e.lanes = n), Ag(t, n));
    }
  }
  function kc(t, e) {
    var n = t.updateQueue,
      l = t.alternate;
    if (l !== null && ((l = l.updateQueue), n === l)) {
      var i = null,
        r = null;
      if (((n = n.firstBaseUpdate), n !== null)) {
        do {
          var a = { lane: n.lane, tag: n.tag, payload: n.payload, callback: null, next: null };
          (r === null ? (i = r = a) : (r = r.next = a), (n = n.next));
        } while (n !== null);
        r === null ? (i = r = e) : (r = r.next = e);
      } else i = r = e;
      ((n = {
        baseState: l.baseState,
        firstBaseUpdate: i,
        lastBaseUpdate: r,
        shared: l.shared,
        callbacks: l.callbacks,
      }),
        (t.updateQueue = n));
      return;
    }
    ((t = n.lastBaseUpdate), t === null ? (n.firstBaseUpdate = e) : (t.next = e), (n.lastBaseUpdate = e));
  }
  var uf = !1;
  function ka() {
    if (uf) {
      var t = hr;
      if (t !== null) throw t;
    }
  }
  function Sa(t, e, n, l) {
    uf = !1;
    var i = t.updateQueue;
    Cl = !1;
    var r = i.firstBaseUpdate,
      a = i.lastBaseUpdate,
      o = i.shared.pending;
    if (o !== null) {
      i.shared.pending = null;
      var s = o,
        u = s.next;
      ((s.next = null), a === null ? (r = u) : (a.next = u), (a = s));
      var f = t.alternate;
      f !== null &&
        ((f = f.updateQueue),
        (o = f.lastBaseUpdate),
        o !== a && (o === null ? (f.firstBaseUpdate = u) : (o.next = u), (f.lastBaseUpdate = s)));
    }
    if (r !== null) {
      var c = i.baseState;
      ((a = 0), (f = u = s = null), (o = r));
      do {
        var m = o.lane & -536870913,
          d = m !== o.lane;
        if (d ? (Ct & m) === m : (l & m) === m) {
          (m !== 0 && m === wr && (uf = !0),
            f !== null && (f = f.next = { lane: 0, tag: o.tag, payload: o.payload, callback: null, next: null }));
          t: {
            var g = t,
              x = o;
            m = e;
            var C = n;
            switch (x.tag) {
              case 1:
                if (((g = x.payload), typeof g == "function")) {
                  c = g.call(C, c, m);
                  break t;
                }
                c = g;
                break t;
              case 3:
                g.flags = (g.flags & -65537) | 128;
              case 0:
                if (((g = x.payload), (m = typeof g == "function" ? g.call(C, c, m) : g), m == null)) break t;
                c = Zt({}, c, m);
                break t;
              case 2:
                Cl = !0;
            }
          }
          ((m = o.callback),
            m !== null &&
              ((t.flags |= 64),
              d && (t.flags |= 8192),
              (d = i.callbacks),
              d === null ? (i.callbacks = [m]) : d.push(m)));
        } else
          ((d = { lane: m, tag: o.tag, payload: o.payload, callback: o.callback, next: null }),
            f === null ? ((u = f = d), (s = c)) : (f = f.next = d),
            (a |= m));
        if (((o = o.next), o === null)) {
          if (((o = i.shared.pending), o === null)) break;
          ((d = o), (o = d.next), (d.next = null), (i.lastBaseUpdate = d), (i.shared.pending = null));
        }
      } while (!0);
      (f === null && (s = c),
        (i.baseState = s),
        (i.firstBaseUpdate = u),
        (i.lastBaseUpdate = f),
        r === null && (i.shared.lanes = 0),
        (Ql |= a),
        (t.lanes = a),
        (t.memoizedState = c));
    }
  }
  function ay(t, e) {
    if (typeof t != "function") throw Error(O(191, t));
    t.call(e);
  }
  function oy(t, e) {
    var n = t.callbacks;
    if (n !== null) for (t.callbacks = null, t = 0; t < n.length; t++) ay(n[t], e);
  }
  var Tr = Xn(null),
    vs = Xn(0);
  function Th(t, e) {
    ((t = gl), Wt(vs, t), Wt(Tr, e), (gl = t | e.baseLanes));
  }
  function cf() {
    (Wt(vs, gl), Wt(Tr, Tr.current));
  }
  function ed() {
    ((gl = vs.current), _e(Tr), _e(vs));
  }
  var Fl = 0,
    ht = null,
    Ft = null,
    ve = null,
    bs = !1,
    gr = !1,
    xi = !1,
    xs = 0,
    za = 0,
    yr = null,
    TS = 0;
  function ue() {
    throw Error(O(321));
  }
  function nd(t, e) {
    if (e === null) return !1;
    for (var n = 0; n < e.length && n < t.length; n++) if (!vn(t[n], e[n])) return !1;
    return !0;
  }
  function ld(t, e, n, l, i, r) {
    return (
      (Fl = r),
      (ht = e),
      (e.memoizedState = null),
      (e.updateQueue = null),
      (e.lanes = 0),
      (at.H = t === null || t.memoizedState === null ? Hy : qy),
      (xi = !1),
      (r = n(l, i)),
      (xi = !1),
      gr && (r = uy(e, n, l, i)),
      sy(t),
      r
    );
  }
  function sy(t) {
    at.H = ks;
    var e = Ft !== null && Ft.next !== null;
    if (((Fl = 0), (ve = Ft = ht = null), (bs = !1), (za = 0), (yr = null), e)) throw Error(O(300));
    t === null || De || ((t = t.dependencies), t !== null && ys(t) && (De = !0));
  }
  function uy(t, e, n, l) {
    ht = t;
    var i = 0;
    do {
      if ((gr && (yr = null), (za = 0), (gr = !1), 25 <= i)) throw Error(O(301));
      if (((i += 1), (ve = Ft = null), t.updateQueue != null)) {
        var r = t.updateQueue;
        ((r.lastEffect = null), (r.events = null), (r.stores = null), r.memoCache != null && (r.memoCache.index = 0));
      }
      ((at.H = DS), (r = e(n, l)));
    } while (gr);
    return r;
  }
  function ES() {
    var t = at.H,
      e = t.useState()[0];
    return (
      (e = typeof e.then == "function" ? Wa(e) : e),
      (t = t.useState()[0]),
      (Ft !== null ? Ft.memoizedState : null) !== t && (ht.flags |= 1024),
      e
    );
  }
  function id() {
    var t = xs !== 0;
    return ((xs = 0), t);
  }
  function rd(t, e, n) {
    ((e.updateQueue = t.updateQueue), (e.flags &= -2053), (t.lanes &= ~n));
  }
  function ad(t) {
    if (bs) {
      for (t = t.memoizedState; t !== null;) {
        var e = t.queue;
        (e !== null && (e.pending = null), (t = t.next));
      }
      bs = !1;
    }
    ((Fl = 0), (ve = Ft = ht = null), (gr = !1), (za = xs = 0), (yr = null));
  }
  function nn() {
    var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (ve === null ? (ht.memoizedState = ve = t) : (ve = ve.next = t), ve);
  }
  function be() {
    if (Ft === null) {
      var t = ht.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Ft.next;
    var e = ve === null ? ht.memoizedState : ve.next;
    if (e !== null) ((ve = e), (Ft = t));
    else {
      if (t === null) throw ht.alternate === null ? Error(O(467)) : Error(O(310));
      ((Ft = t),
        (t = {
          memoizedState: Ft.memoizedState,
          baseState: Ft.baseState,
          baseQueue: Ft.baseQueue,
          queue: Ft.queue,
          next: null,
        }),
        ve === null ? (ht.memoizedState = ve = t) : (ve = ve.next = t));
    }
    return ve;
  }
  function od() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Wa(t) {
    var e = za;
    return (
      (za += 1),
      yr === null && (yr = []),
      (t = ry(yr, t, e)),
      (e = ht),
      (ve === null ? e.memoizedState : ve.next) === null &&
        ((e = e.alternate), (at.H = e === null || e.memoizedState === null ? Hy : qy)),
      t
    );
  }
  function Qs(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return Wa(t);
      if (t.$$typeof === al) return Ye(t);
    }
    throw Error(O(438, String(t)));
  }
  function sd(t) {
    var e = null,
      n = ht.updateQueue;
    if ((n !== null && (e = n.memoCache), e == null)) {
      var l = ht.alternate;
      l !== null &&
        ((l = l.updateQueue),
        l !== null &&
          ((l = l.memoCache),
          l != null &&
            (e = {
              data: l.data.map(function (i) {
                return i.slice();
              }),
              index: 0,
            })));
    }
    if (
      (e == null && (e = { data: [], index: 0 }),
      n === null && ((n = od()), (ht.updateQueue = n)),
      (n.memoCache = e),
      (n = e.data[e.index]),
      n === void 0)
    )
      for (n = e.data[e.index] = Array(t), l = 0; l < t; l++) n[l] = uk;
    return (e.index++, n);
  }
  function pl(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function es(t) {
    var e = be();
    return ud(e, Ft, t);
  }
  function ud(t, e, n) {
    var l = t.queue;
    if (l === null) throw Error(O(311));
    l.lastRenderedReducer = n;
    var i = t.baseQueue,
      r = l.pending;
    if (r !== null) {
      if (i !== null) {
        var a = i.next;
        ((i.next = r.next), (r.next = a));
      }
      ((e.baseQueue = i = r), (l.pending = null));
    }
    if (((r = t.baseState), i === null)) t.memoizedState = r;
    else {
      e = i.next;
      var o = (a = null),
        s = null,
        u = e,
        f = !1;
      do {
        var c = u.lane & -536870913;
        if (c !== u.lane ? (Ct & c) === c : (Fl & c) === c) {
          var m = u.revertLane;
          if (m === 0)
            (s !== null &&
              (s = s.next =
                {
                  lane: 0,
                  revertLane: 0,
                  action: u.action,
                  hasEagerState: u.hasEagerState,
                  eagerState: u.eagerState,
                  next: null,
                }),
              c === wr && (f = !0));
          else if ((Fl & m) === m) {
            ((u = u.next), m === wr && (f = !0));
            continue;
          } else
            ((c = {
              lane: 0,
              revertLane: u.revertLane,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
              s === null ? ((o = s = c), (a = r)) : (s = s.next = c),
              (ht.lanes |= m),
              (Ql |= m));
          ((c = u.action), xi && n(r, c), (r = u.hasEagerState ? u.eagerState : n(r, c)));
        } else
          ((m = {
            lane: c,
            revertLane: u.revertLane,
            action: u.action,
            hasEagerState: u.hasEagerState,
            eagerState: u.eagerState,
            next: null,
          }),
            s === null ? ((o = s = m), (a = r)) : (s = s.next = m),
            (ht.lanes |= c),
            (Ql |= c));
        u = u.next;
      } while (u !== null && u !== e);
      if ((s === null ? (a = r) : (s.next = o), !vn(r, t.memoizedState) && ((De = !0), f && ((n = hr), n !== null))))
        throw n;
      ((t.memoizedState = r), (t.baseState = a), (t.baseQueue = s), (l.lastRenderedState = r));
    }
    return (i === null && (l.lanes = 0), [t.memoizedState, l.dispatch]);
  }
  function Sc(t) {
    var e = be(),
      n = e.queue;
    if (n === null) throw Error(O(311));
    n.lastRenderedReducer = t;
    var l = n.dispatch,
      i = n.pending,
      r = e.memoizedState;
    if (i !== null) {
      n.pending = null;
      var a = (i = i.next);
      do ((r = t(r, a.action)), (a = a.next));
      while (a !== i);
      (vn(r, e.memoizedState) || (De = !0),
        (e.memoizedState = r),
        e.baseQueue === null && (e.baseState = r),
        (n.lastRenderedState = r));
    }
    return [r, l];
  }
  function cy(t, e, n) {
    var l = ht,
      i = be(),
      r = zt;
    if (r) {
      if (n === void 0) throw Error(O(407));
      n = n();
    } else n = e();
    var a = !vn((Ft || i).memoizedState, n);
    (a && ((i.memoizedState = n), (De = !0)), (i = i.queue));
    var o = my.bind(null, l, i, t);
    if ((to(2048, 8, o, [t]), i.getSnapshot !== e || a || (ve !== null && ve.memoizedState.tag & 1))) {
      if (((l.flags |= 2048), Er(9, Ps(), dy.bind(null, l, i, n, e), null), Gt === null)) throw Error(O(349));
      r || (Fl & 124) !== 0 || fy(l, e, n);
    }
    return n;
  }
  function fy(t, e, n) {
    ((t.flags |= 16384),
      (t = { getSnapshot: e, value: n }),
      (e = ht.updateQueue),
      e === null
        ? ((e = od()), (ht.updateQueue = e), (e.stores = [t]))
        : ((n = e.stores), n === null ? (e.stores = [t]) : n.push(t)));
  }
  function dy(t, e, n, l) {
    ((e.value = n), (e.getSnapshot = l), py(e) && hy(t));
  }
  function my(t, e, n) {
    return n(function () {
      py(e) && hy(t);
    });
  }
  function py(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var n = e();
      return !vn(t, n);
    } catch {
      return !0;
    }
  }
  function hy(t) {
    var e = Or(t, 2);
    e !== null && yn(e, t, 2);
  }
  function ff(t) {
    var e = nn();
    if (typeof t == "function") {
      var n = t;
      if (((t = n()), xi)) {
        Dl(!0);
        try {
          n();
        } finally {
          Dl(!1);
        }
      }
    }
    return (
      (e.memoizedState = e.baseState = t),
      (e.queue = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: pl, lastRenderedState: t }),
      e
    );
  }
  function gy(t, e, n, l) {
    return ((t.baseState = n), ud(t, Ft, typeof l == "function" ? l : pl));
  }
  function CS(t, e, n, l, i) {
    if (Gs(t)) throw Error(O(485));
    if (((t = e.action), t !== null)) {
      var r = {
        payload: i,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (a) {
          r.listeners.push(a);
        },
      };
      (at.T !== null ? n(!0) : (r.isTransition = !1),
        l(r),
        (n = e.pending),
        n === null ? ((r.next = e.pending = r), yy(e, r)) : ((r.next = n.next), (e.pending = n.next = r)));
    }
  }
  function yy(t, e) {
    var n = e.action,
      l = e.payload,
      i = t.state;
    if (e.isTransition) {
      var r = at.T,
        a = {};
      at.T = a;
      try {
        var o = n(i, l),
          s = at.S;
        (s !== null && s(a, o), Eh(t, e, o));
      } catch (u) {
        df(t, e, u);
      } finally {
        at.T = r;
      }
    } else
      try {
        ((r = n(i, l)), Eh(t, e, r));
      } catch (u) {
        df(t, e, u);
      }
  }
  function Eh(t, e, n) {
    n !== null && typeof n == "object" && typeof n.then == "function"
      ? n.then(
          function (l) {
            Ch(t, e, l);
          },
          function (l) {
            return df(t, e, l);
          },
        )
      : Ch(t, e, n);
  }
  function Ch(t, e, n) {
    ((e.status = "fulfilled"),
      (e.value = n),
      vy(e),
      (t.state = n),
      (e = t.pending),
      e !== null && ((n = e.next), n === e ? (t.pending = null) : ((n = n.next), (e.next = n), yy(t, n))));
  }
  function df(t, e, n) {
    var l = t.pending;
    if (((t.pending = null), l !== null)) {
      l = l.next;
      do ((e.status = "rejected"), (e.reason = n), vy(e), (e = e.next));
      while (e !== l);
    }
    t.action = null;
  }
  function vy(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function by(t, e) {
    return e;
  }
  function Ah(t, e) {
    if (zt) {
      var n = Gt.formState;
      if (n !== null) {
        t: {
          var l = ht;
          if (zt) {
            if (ie) {
              e: {
                for (var i = ie, r = Fn; i.nodeType !== 8;) {
                  if (!r) {
                    i = null;
                    break e;
                  }
                  if (((i = Un(i.nextSibling)), i === null)) {
                    i = null;
                    break e;
                  }
                }
                ((r = i.data), (i = r === "F!" || r === "F" ? i : null));
              }
              if (i) {
                ((ie = Un(i.nextSibling)), (l = i.data === "F!"));
                break t;
              }
            }
            vi(l);
          }
          l = !1;
        }
        l && (e = n[0]);
      }
    }
    return (
      (n = nn()),
      (n.memoizedState = n.baseState = e),
      (l = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: by, lastRenderedState: e }),
      (n.queue = l),
      (n = Ly.bind(null, ht, l)),
      (l.dispatch = n),
      (l = ff(!1)),
      (r = md.bind(null, ht, !1, l.queue)),
      (l = nn()),
      (i = { state: e, dispatch: null, action: t, pending: null }),
      (l.queue = i),
      (n = CS.bind(null, ht, i, r, n)),
      (i.dispatch = n),
      (l.memoizedState = t),
      [e, n, !1]
    );
  }
  function Nh(t) {
    var e = be();
    return xy(e, Ft, t);
  }
  function xy(t, e, n) {
    if (((e = ud(t, e, by)[0]), (t = es(pl)[0]), typeof e == "object" && e !== null && typeof e.then == "function"))
      try {
        var l = Wa(e);
      } catch (a) {
        throw a === $a ? Vs : a;
      }
    else l = e;
    e = be();
    var i = e.queue,
      r = i.dispatch;
    return (n !== e.memoizedState && ((ht.flags |= 2048), Er(9, Ps(), AS.bind(null, i, n), null)), [l, r, t]);
  }
  function AS(t, e) {
    t.action = e;
  }
  function Rh(t) {
    var e = be(),
      n = Ft;
    if (n !== null) return xy(e, n, t);
    (be(), (e = e.memoizedState), (n = be()));
    var l = n.queue.dispatch;
    return ((n.memoizedState = t), [e, l, !1]);
  }
  function Er(t, e, n, l) {
    return (
      (t = { tag: t, create: n, deps: l, inst: e, next: null }),
      (e = ht.updateQueue),
      e === null && ((e = od()), (ht.updateQueue = e)),
      (n = e.lastEffect),
      n === null ? (e.lastEffect = t.next = t) : ((l = n.next), (n.next = t), (t.next = l), (e.lastEffect = t)),
      t
    );
  }
  function Ps() {
    return { destroy: void 0, resource: void 0 };
  }
  function ky() {
    return be().memoizedState;
  }
  function ns(t, e, n, l) {
    var i = nn();
    ((l = l === void 0 ? null : l), (ht.flags |= t), (i.memoizedState = Er(1 | e, Ps(), n, l)));
  }
  function to(t, e, n, l) {
    var i = be();
    l = l === void 0 ? null : l;
    var r = i.memoizedState.inst;
    Ft !== null && l !== null && nd(l, Ft.memoizedState.deps)
      ? (i.memoizedState = Er(e, r, n, l))
      : ((ht.flags |= t), (i.memoizedState = Er(1 | e, r, n, l)));
  }
  function Mh(t, e) {
    ns(8390656, 8, t, e);
  }
  function Sy(t, e) {
    to(2048, 8, t, e);
  }
  function wy(t, e) {
    return to(4, 2, t, e);
  }
  function Ty(t, e) {
    return to(4, 4, t, e);
  }
  function Ey(t, e) {
    if (typeof e == "function") {
      t = t();
      var n = e(t);
      return function () {
        typeof n == "function" ? n() : e(null);
      };
    }
    if (e != null)
      return (
        (t = t()),
        (e.current = t),
        function () {
          e.current = null;
        }
      );
  }
  function Cy(t, e, n) {
    ((n = n != null ? n.concat([t]) : null), to(4, 4, Ey.bind(null, e, t), n));
  }
  function cd() {}
  function Ay(t, e) {
    var n = be();
    e = e === void 0 ? null : e;
    var l = n.memoizedState;
    return e !== null && nd(e, l[1]) ? l[0] : ((n.memoizedState = [t, e]), t);
  }
  function Ny(t, e) {
    var n = be();
    e = e === void 0 ? null : e;
    var l = n.memoizedState;
    if (e !== null && nd(e, l[1])) return l[0];
    if (((l = t()), xi)) {
      Dl(!0);
      try {
        t();
      } finally {
        Dl(!1);
      }
    }
    return ((n.memoizedState = [l, e]), l);
  }
  function fd(t, e, n) {
    return n === void 0 || (Fl & 1073741824) !== 0
      ? (t.memoizedState = e)
      : ((t.memoizedState = n), (t = vv()), (ht.lanes |= t), (Ql |= t), n);
  }
  function Ry(t, e, n, l) {
    return vn(n, e)
      ? n
      : Tr.current !== null
        ? ((t = fd(t, n, l)), vn(t, e) || (De = !0), t)
        : (Fl & 42) === 0
          ? ((De = !0), (t.memoizedState = n))
          : ((t = vv()), (ht.lanes |= t), (Ql |= t), e);
  }
  function My(t, e, n, l, i) {
    var r = Lt.p;
    Lt.p = r !== 0 && 8 > r ? r : 8;
    var a = at.T,
      o = {};
    ((at.T = o), md(t, !1, e, n));
    try {
      var s = i(),
        u = at.S;
      if ((u !== null && u(o, s), s !== null && typeof s == "object" && typeof s.then == "function")) {
        var f = wS(s, l);
        wa(t, e, f, gn(t));
      } else wa(t, e, l, gn(t));
    } catch (c) {
      wa(t, e, { then: function () {}, status: "rejected", reason: c }, gn());
    } finally {
      ((Lt.p = r), (at.T = a));
    }
  }
  function NS() {}
  function mf(t, e, n, l) {
    if (t.tag !== 5) throw Error(O(476));
    var i = Dy(t).queue;
    My(
      t,
      i,
      e,
      fi,
      n === null
        ? NS
        : function () {
            return (_y(t), n(l));
          },
    );
  }
  function Dy(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: fi,
      baseState: fi,
      baseQueue: null,
      queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: pl, lastRenderedState: fi },
      next: null,
    };
    var n = {};
    return (
      (e.next = {
        memoizedState: n,
        baseState: n,
        baseQueue: null,
        queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: pl, lastRenderedState: n },
        next: null,
      }),
      (t.memoizedState = e),
      (t = t.alternate),
      t !== null && (t.memoizedState = e),
      e
    );
  }
  function _y(t) {
    var e = Dy(t).next.queue;
    wa(t, e, {}, gn());
  }
  function dd() {
    return Ye(qa);
  }
  function Oy() {
    return be().memoizedState;
  }
  function zy() {
    return be().memoizedState;
  }
  function RS(t) {
    for (var e = t.return; e !== null;) {
      switch (e.tag) {
        case 24:
        case 3:
          var n = gn();
          t = Ul(n);
          var l = Bl(e, t, n);
          (l !== null && (yn(l, e, n), xa(l, e, n)), (e = { cache: $f() }), (t.payload = e));
          return;
      }
      e = e.return;
    }
  }
  function MS(t, e, n) {
    var l = gn();
    ((n = { lane: l, revertLane: 0, action: n, hasEagerState: !1, eagerState: null, next: null }),
      Gs(t) ? Uy(e, n) : ((n = Xf(t, e, n, l)), n !== null && (yn(n, t, l), By(n, e, l))));
  }
  function Ly(t, e, n) {
    var l = gn();
    wa(t, e, n, l);
  }
  function wa(t, e, n, l) {
    var i = { lane: l, revertLane: 0, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Gs(t)) Uy(e, i);
    else {
      var r = t.alternate;
      if (t.lanes === 0 && (r === null || r.lanes === 0) && ((r = e.lastRenderedReducer), r !== null))
        try {
          var a = e.lastRenderedState,
            o = r(a, n);
          if (((i.hasEagerState = !0), (i.eagerState = o), vn(o, a))) return (Fs(t, e, i, 0), Gt === null && Ys(), !1);
        } catch {
        } finally {
        }
      if (((n = Xf(t, e, i, l)), n !== null)) return (yn(n, t, l), By(n, e, l), !0);
    }
    return !1;
  }
  function md(t, e, n, l) {
    if (((l = { lane: 2, revertLane: kd(), action: l, hasEagerState: !1, eagerState: null, next: null }), Gs(t))) {
      if (e) throw Error(O(479));
    } else ((e = Xf(t, n, l, 2)), e !== null && yn(e, t, 2));
  }
  function Gs(t) {
    var e = t.alternate;
    return t === ht || (e !== null && e === ht);
  }
  function Uy(t, e) {
    gr = bs = !0;
    var n = t.pending;
    (n === null ? (e.next = e) : ((e.next = n.next), (n.next = e)), (t.pending = e));
  }
  function By(t, e, n) {
    if ((n & 4194048) !== 0) {
      var l = e.lanes;
      ((l &= t.pendingLanes), (n |= l), (e.lanes = n), Ag(t, n));
    }
  }
  var ks = {
      readContext: Ye,
      use: Qs,
      useCallback: ue,
      useContext: ue,
      useEffect: ue,
      useImperativeHandle: ue,
      useLayoutEffect: ue,
      useInsertionEffect: ue,
      useMemo: ue,
      useReducer: ue,
      useRef: ue,
      useState: ue,
      useDebugValue: ue,
      useDeferredValue: ue,
      useTransition: ue,
      useSyncExternalStore: ue,
      useId: ue,
      useHostTransitionStatus: ue,
      useFormState: ue,
      useActionState: ue,
      useOptimistic: ue,
      useMemoCache: ue,
      useCacheRefresh: ue,
    },
    Hy = {
      readContext: Ye,
      use: Qs,
      useCallback: function (t, e) {
        return ((nn().memoizedState = [t, e === void 0 ? null : e]), t);
      },
      useContext: Ye,
      useEffect: Mh,
      useImperativeHandle: function (t, e, n) {
        ((n = n != null ? n.concat([t]) : null), ns(4194308, 4, Ey.bind(null, e, t), n));
      },
      useLayoutEffect: function (t, e) {
        return ns(4194308, 4, t, e);
      },
      useInsertionEffect: function (t, e) {
        ns(4, 2, t, e);
      },
      useMemo: function (t, e) {
        var n = nn();
        e = e === void 0 ? null : e;
        var l = t();
        if (xi) {
          Dl(!0);
          try {
            t();
          } finally {
            Dl(!1);
          }
        }
        return ((n.memoizedState = [l, e]), l);
      },
      useReducer: function (t, e, n) {
        var l = nn();
        if (n !== void 0) {
          var i = n(e);
          if (xi) {
            Dl(!0);
            try {
              n(e);
            } finally {
              Dl(!1);
            }
          }
        } else i = e;
        return (
          (l.memoizedState = l.baseState = i),
          (t = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: t, lastRenderedState: i }),
          (l.queue = t),
          (t = t.dispatch = MS.bind(null, ht, t)),
          [l.memoizedState, t]
        );
      },
      useRef: function (t) {
        var e = nn();
        return ((t = { current: t }), (e.memoizedState = t));
      },
      useState: function (t) {
        t = ff(t);
        var e = t.queue,
          n = Ly.bind(null, ht, e);
        return ((e.dispatch = n), [t.memoizedState, n]);
      },
      useDebugValue: cd,
      useDeferredValue: function (t, e) {
        var n = nn();
        return fd(n, t, e);
      },
      useTransition: function () {
        var t = ff(!1);
        return ((t = My.bind(null, ht, t.queue, !0, !1)), (nn().memoizedState = t), [!1, t]);
      },
      useSyncExternalStore: function (t, e, n) {
        var l = ht,
          i = nn();
        if (zt) {
          if (n === void 0) throw Error(O(407));
          n = n();
        } else {
          if (((n = e()), Gt === null)) throw Error(O(349));
          (Ct & 124) !== 0 || fy(l, e, n);
        }
        i.memoizedState = n;
        var r = { value: n, getSnapshot: e };
        return (
          (i.queue = r),
          Mh(my.bind(null, l, r, t), [t]),
          (l.flags |= 2048),
          Er(9, Ps(), dy.bind(null, l, r, n, e), null),
          n
        );
      },
      useId: function () {
        var t = nn(),
          e = Gt.identifierPrefix;
        if (zt) {
          var n = sl,
            l = ol;
          ((n = (l & ~(1 << (32 - hn(l) - 1))).toString(32) + n),
            (e = "\xAB" + e + "R" + n),
            (n = xs++),
            0 < n && (e += "H" + n.toString(32)),
            (e += "\xBB"));
        } else ((n = TS++), (e = "\xAB" + e + "r" + n.toString(32) + "\xBB"));
        return (t.memoizedState = e);
      },
      useHostTransitionStatus: dd,
      useFormState: Ah,
      useActionState: Ah,
      useOptimistic: function (t) {
        var e = nn();
        e.memoizedState = e.baseState = t;
        var n = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: null, lastRenderedState: null };
        return ((e.queue = n), (e = md.bind(null, ht, !0, n)), (n.dispatch = e), [t, e]);
      },
      useMemoCache: sd,
      useCacheRefresh: function () {
        return (nn().memoizedState = RS.bind(null, ht));
      },
    },
    qy = {
      readContext: Ye,
      use: Qs,
      useCallback: Ay,
      useContext: Ye,
      useEffect: Sy,
      useImperativeHandle: Cy,
      useInsertionEffect: wy,
      useLayoutEffect: Ty,
      useMemo: Ny,
      useReducer: es,
      useRef: ky,
      useState: function () {
        return es(pl);
      },
      useDebugValue: cd,
      useDeferredValue: function (t, e) {
        var n = be();
        return Ry(n, Ft.memoizedState, t, e);
      },
      useTransition: function () {
        var t = es(pl)[0],
          e = be().memoizedState;
        return [typeof t == "boolean" ? t : Wa(t), e];
      },
      useSyncExternalStore: cy,
      useId: Oy,
      useHostTransitionStatus: dd,
      useFormState: Nh,
      useActionState: Nh,
      useOptimistic: function (t, e) {
        var n = be();
        return gy(n, Ft, t, e);
      },
      useMemoCache: sd,
      useCacheRefresh: zy,
    },
    DS = {
      readContext: Ye,
      use: Qs,
      useCallback: Ay,
      useContext: Ye,
      useEffect: Sy,
      useImperativeHandle: Cy,
      useInsertionEffect: wy,
      useLayoutEffect: Ty,
      useMemo: Ny,
      useReducer: Sc,
      useRef: ky,
      useState: function () {
        return Sc(pl);
      },
      useDebugValue: cd,
      useDeferredValue: function (t, e) {
        var n = be();
        return Ft === null ? fd(n, t, e) : Ry(n, Ft.memoizedState, t, e);
      },
      useTransition: function () {
        var t = Sc(pl)[0],
          e = be().memoizedState;
        return [typeof t == "boolean" ? t : Wa(t), e];
      },
      useSyncExternalStore: cy,
      useId: Oy,
      useHostTransitionStatus: dd,
      useFormState: Rh,
      useActionState: Rh,
      useOptimistic: function (t, e) {
        var n = be();
        return Ft !== null ? gy(n, Ft, t, e) : ((n.baseState = t), [t, n.queue.dispatch]);
      },
      useMemoCache: sd,
      useCacheRefresh: zy,
    },
    vr = null,
    La = 0;
  function jo(t) {
    var e = La;
    return ((La += 1), vr === null && (vr = []), ry(vr, t, e));
  }
  function aa(t, e) {
    ((e = e.props.ref), (t.ref = e !== void 0 ? e : null));
  }
  function Yo(t, e) {
    throw e.$$typeof === ok
      ? Error(O(525))
      : ((t = Object.prototype.toString.call(e)),
        Error(O(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t)));
  }
  function Dh(t) {
    var e = t._init;
    return e(t._payload);
  }
  function Iy(t) {
    function e(h, p) {
      if (t) {
        var y = h.deletions;
        y === null ? ((h.deletions = [p]), (h.flags |= 16)) : y.push(p);
      }
    }
    function n(h, p) {
      if (!t) return null;
      for (; p !== null;) (e(h, p), (p = p.sibling));
      return null;
    }
    function l(h) {
      for (var p = new Map(); h !== null;) (h.key !== null ? p.set(h.key, h) : p.set(h.index, h), (h = h.sibling));
      return p;
    }
    function i(h, p) {
      return ((h = fl(h, p)), (h.index = 0), (h.sibling = null), h);
    }
    function r(h, p, y) {
      return (
        (h.index = y),
        t
          ? ((y = h.alternate),
            y !== null ? ((y = y.index), y < p ? ((h.flags |= 67108866), p) : y) : ((h.flags |= 67108866), p))
          : ((h.flags |= 1048576), p)
      );
    }
    function a(h) {
      return (t && h.alternate === null && (h.flags |= 67108866), h);
    }
    function o(h, p, y, T) {
      return p === null || p.tag !== 6
        ? ((p = bc(y, h.mode, T)), (p.return = h), p)
        : ((p = i(p, y)), (p.return = h), p);
    }
    function s(h, p, y, T) {
      var N = y.type;
      return N === tr
        ? f(h, p, y.props.children, T, y.key)
        : p !== null &&
            (p.elementType === N || (typeof N == "object" && N !== null && N.$$typeof === El && Dh(N) === p.type))
          ? ((p = i(p, y.props)), aa(p, y), (p.return = h), p)
          : ((p = Wo(y.type, y.key, y.props, null, h.mode, T)), aa(p, y), (p.return = h), p);
    }
    function u(h, p, y, T) {
      return p === null ||
        p.tag !== 4 ||
        p.stateNode.containerInfo !== y.containerInfo ||
        p.stateNode.implementation !== y.implementation
        ? ((p = xc(y, h.mode, T)), (p.return = h), p)
        : ((p = i(p, y.children || [])), (p.return = h), p);
    }
    function f(h, p, y, T, N) {
      return p === null || p.tag !== 7
        ? ((p = di(y, h.mode, T, N)), (p.return = h), p)
        : ((p = i(p, y)), (p.return = h), p);
    }
    function c(h, p, y) {
      if ((typeof p == "string" && p !== "") || typeof p == "number" || typeof p == "bigint")
        return ((p = bc("" + p, h.mode, y)), (p.return = h), p);
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case _o:
            return ((y = Wo(p.type, p.key, p.props, null, h.mode, y)), aa(y, p), (y.return = h), y);
          case fa:
            return ((p = xc(p, h.mode, y)), (p.return = h), p);
          case El:
            var T = p._init;
            return ((p = T(p._payload)), c(h, p, y));
        }
        if (da(p) || la(p)) return ((p = di(p, h.mode, y, null)), (p.return = h), p);
        if (typeof p.then == "function") return c(h, jo(p), y);
        if (p.$$typeof === al) return c(h, qo(h, p), y);
        Yo(h, p);
      }
      return null;
    }
    function m(h, p, y, T) {
      var N = p !== null ? p.key : null;
      if ((typeof y == "string" && y !== "") || typeof y == "number" || typeof y == "bigint")
        return N !== null ? null : o(h, p, "" + y, T);
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case _o:
            return y.key === N ? s(h, p, y, T) : null;
          case fa:
            return y.key === N ? u(h, p, y, T) : null;
          case El:
            return ((N = y._init), (y = N(y._payload)), m(h, p, y, T));
        }
        if (da(y) || la(y)) return N !== null ? null : f(h, p, y, T, null);
        if (typeof y.then == "function") return m(h, p, jo(y), T);
        if (y.$$typeof === al) return m(h, p, qo(h, y), T);
        Yo(h, y);
      }
      return null;
    }
    function d(h, p, y, T, N) {
      if ((typeof T == "string" && T !== "") || typeof T == "number" || typeof T == "bigint")
        return ((h = h.get(y) || null), o(p, h, "" + T, N));
      if (typeof T == "object" && T !== null) {
        switch (T.$$typeof) {
          case _o:
            return ((h = h.get(T.key === null ? y : T.key) || null), s(p, h, T, N));
          case fa:
            return ((h = h.get(T.key === null ? y : T.key) || null), u(p, h, T, N));
          case El:
            var E = T._init;
            return ((T = E(T._payload)), d(h, p, y, T, N));
        }
        if (da(T) || la(T)) return ((h = h.get(y) || null), f(p, h, T, N, null));
        if (typeof T.then == "function") return d(h, p, y, jo(T), N);
        if (T.$$typeof === al) return d(h, p, y, qo(p, T), N);
        Yo(p, T);
      }
      return null;
    }
    function g(h, p, y, T) {
      for (var N = null, E = null, M = p, z = (p = 0), F = null; M !== null && z < y.length; z++) {
        M.index > z ? ((F = M), (M = null)) : (F = M.sibling);
        var w = m(h, M, y[z], T);
        if (w === null) {
          M === null && (M = F);
          break;
        }
        (t && M && w.alternate === null && e(h, M),
          (p = r(w, p, z)),
          E === null ? (N = w) : (E.sibling = w),
          (E = w),
          (M = F));
      }
      if (z === y.length) return (n(h, M), zt && ui(h, z), N);
      if (M === null) {
        for (; z < y.length; z++)
          ((M = c(h, y[z], T)), M !== null && ((p = r(M, p, z)), E === null ? (N = M) : (E.sibling = M), (E = M)));
        return (zt && ui(h, z), N);
      }
      for (M = l(M); z < y.length; z++)
        ((F = d(M, h, z, y[z], T)),
          F !== null &&
            (t && F.alternate !== null && M.delete(F.key === null ? z : F.key),
            (p = r(F, p, z)),
            E === null ? (N = F) : (E.sibling = F),
            (E = F)));
      return (
        t &&
          M.forEach(function (Z) {
            return e(h, Z);
          }),
        zt && ui(h, z),
        N
      );
    }
    function x(h, p, y, T) {
      if (y == null) throw Error(O(151));
      for (
        var N = null, E = null, M = p, z = (p = 0), F = null, w = y.next();
        M !== null && !w.done;
        z++, w = y.next()
      ) {
        M.index > z ? ((F = M), (M = null)) : (F = M.sibling);
        var Z = m(h, M, w.value, T);
        if (Z === null) {
          M === null && (M = F);
          break;
        }
        (t && M && Z.alternate === null && e(h, M),
          (p = r(Z, p, z)),
          E === null ? (N = Z) : (E.sibling = Z),
          (E = Z),
          (M = F));
      }
      if (w.done) return (n(h, M), zt && ui(h, z), N);
      if (M === null) {
        for (; !w.done; z++, w = y.next())
          ((w = c(h, w.value, T)), w !== null && ((p = r(w, p, z)), E === null ? (N = w) : (E.sibling = w), (E = w)));
        return (zt && ui(h, z), N);
      }
      for (M = l(M); !w.done; z++, w = y.next())
        ((w = d(M, h, z, w.value, T)),
          w !== null &&
            (t && w.alternate !== null && M.delete(w.key === null ? z : w.key),
            (p = r(w, p, z)),
            E === null ? (N = w) : (E.sibling = w),
            (E = w)));
      return (
        t &&
          M.forEach(function (L) {
            return e(h, L);
          }),
        zt && ui(h, z),
        N
      );
    }
    function C(h, p, y, T) {
      if (
        (typeof y == "object" && y !== null && y.type === tr && y.key === null && (y = y.props.children),
        typeof y == "object" && y !== null)
      ) {
        switch (y.$$typeof) {
          case _o:
            t: {
              for (var N = y.key; p !== null;) {
                if (p.key === N) {
                  if (((N = y.type), N === tr)) {
                    if (p.tag === 7) {
                      (n(h, p.sibling), (T = i(p, y.props.children)), (T.return = h), (h = T));
                      break t;
                    }
                  } else if (
                    p.elementType === N ||
                    (typeof N == "object" && N !== null && N.$$typeof === El && Dh(N) === p.type)
                  ) {
                    (n(h, p.sibling), (T = i(p, y.props)), aa(T, y), (T.return = h), (h = T));
                    break t;
                  }
                  n(h, p);
                  break;
                } else e(h, p);
                p = p.sibling;
              }
              y.type === tr
                ? ((T = di(y.props.children, h.mode, T, y.key)), (T.return = h), (h = T))
                : ((T = Wo(y.type, y.key, y.props, null, h.mode, T)), aa(T, y), (T.return = h), (h = T));
            }
            return a(h);
          case fa:
            t: {
              for (N = y.key; p !== null;) {
                if (p.key === N)
                  if (
                    p.tag === 4 &&
                    p.stateNode.containerInfo === y.containerInfo &&
                    p.stateNode.implementation === y.implementation
                  ) {
                    (n(h, p.sibling), (T = i(p, y.children || [])), (T.return = h), (h = T));
                    break t;
                  } else {
                    n(h, p);
                    break;
                  }
                else e(h, p);
                p = p.sibling;
              }
              ((T = xc(y, h.mode, T)), (T.return = h), (h = T));
            }
            return a(h);
          case El:
            return ((N = y._init), (y = N(y._payload)), C(h, p, y, T));
        }
        if (da(y)) return g(h, p, y, T);
        if (la(y)) {
          if (((N = la(y)), typeof N != "function")) throw Error(O(150));
          return ((y = N.call(y)), x(h, p, y, T));
        }
        if (typeof y.then == "function") return C(h, p, jo(y), T);
        if (y.$$typeof === al) return C(h, p, qo(h, y), T);
        Yo(h, y);
      }
      return (typeof y == "string" && y !== "") || typeof y == "number" || typeof y == "bigint"
        ? ((y = "" + y),
          p !== null && p.tag === 6
            ? (n(h, p.sibling), (T = i(p, y)), (T.return = h), (h = T))
            : (n(h, p), (T = bc(y, h.mode, T)), (T.return = h), (h = T)),
          a(h))
        : n(h, p);
    }
    return function (h, p, y, T) {
      try {
        La = 0;
        var N = C(h, p, y, T);
        return ((vr = null), N);
      } catch (M) {
        if (M === $a || M === Vs) throw M;
        var E = mn(29, M, null, h.mode);
        return ((E.lanes = T), (E.return = h), E);
      } finally {
      }
    };
  }
  var Cr = Iy(!0),
    jy = Iy(!1),
    Dn = Xn(null),
    Gn = null;
  function Nl(t) {
    var e = t.alternate;
    (Wt(Se, Se.current & 1),
      Wt(Dn, t),
      Gn === null && (e === null || Tr.current !== null || e.memoizedState !== null) && (Gn = t));
  }
  function Yy(t) {
    if (t.tag === 22) {
      if ((Wt(Se, Se.current), Wt(Dn, t), Gn === null)) {
        var e = t.alternate;
        e !== null && e.memoizedState !== null && (Gn = t);
      }
    } else Rl(t);
  }
  function Rl() {
    (Wt(Se, Se.current), Wt(Dn, Dn.current));
  }
  function cl(t) {
    (_e(Dn), Gn === t && (Gn = null), _e(Se));
  }
  var Se = Xn(0);
  function Ss(t) {
    for (var e = t; e !== null;) {
      if (e.tag === 13) {
        var n = e.memoizedState;
        if (n !== null && ((n = n.dehydrated), n === null || n.data === "$?" || Mf(n))) return e;
      } else if (e.tag === 19 && e.memoizedProps.revealOrder !== void 0) {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        ((e.child.return = e), (e = e.child));
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null;) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      ((e.sibling.return = e.return), (e = e.sibling));
    }
    return null;
  }
  function wc(t, e, n, l) {
    ((e = t.memoizedState),
      (n = n(l, e)),
      (n = n == null ? e : Zt({}, e, n)),
      (t.memoizedState = n),
      t.lanes === 0 && (t.updateQueue.baseState = n));
  }
  var pf = {
    enqueueSetState: function (t, e, n) {
      t = t._reactInternals;
      var l = gn(),
        i = Ul(l);
      ((i.payload = e), n != null && (i.callback = n), (e = Bl(t, i, l)), e !== null && (yn(e, t, l), xa(e, t, l)));
    },
    enqueueReplaceState: function (t, e, n) {
      t = t._reactInternals;
      var l = gn(),
        i = Ul(l);
      ((i.tag = 1),
        (i.payload = e),
        n != null && (i.callback = n),
        (e = Bl(t, i, l)),
        e !== null && (yn(e, t, l), xa(e, t, l)));
    },
    enqueueForceUpdate: function (t, e) {
      t = t._reactInternals;
      var n = gn(),
        l = Ul(n);
      ((l.tag = 2), e != null && (l.callback = e), (e = Bl(t, l, n)), e !== null && (yn(e, t, n), xa(e, t, n)));
    },
  };
  function _h(t, e, n, l, i, r, a) {
    return (
      (t = t.stateNode),
      typeof t.shouldComponentUpdate == "function"
        ? t.shouldComponentUpdate(l, r, a)
        : e.prototype && e.prototype.isPureReactComponent
          ? !_a(n, l) || !_a(i, r)
          : !0
    );
  }
  function Oh(t, e, n, l) {
    ((t = e.state),
      typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, l),
      typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, l),
      e.state !== t && pf.enqueueReplaceState(e, e.state, null));
  }
  function ki(t, e) {
    var n = e;
    if ("ref" in e) {
      n = {};
      for (var l in e) l !== "ref" && (n[l] = e[l]);
    }
    if ((t = t.defaultProps)) {
      n === e && (n = Zt({}, n));
      for (var i in t) n[i] === void 0 && (n[i] = t[i]);
    }
    return n;
  }
  var ws =
    typeof reportError == "function"
      ? reportError
      : function (t) {
          if (typeof window == "object" && typeof window.ErrorEvent == "function") {
            var e = new window.ErrorEvent("error", {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
              error: t,
            });
            if (!window.dispatchEvent(e)) return;
          } else if (typeof process == "object" && typeof process.emit == "function") {
            process.emit("uncaughtException", t);
            return;
          }
          console.error(t);
        };
  function Fy(t) {
    ws(t);
  }
  function Vy(t) {
    console.error(t);
  }
  function Qy(t) {
    ws(t);
  }
  function Ts(t, e) {
    try {
      var n = t.onUncaughtError;
      n(e.value, { componentStack: e.stack });
    } catch (l) {
      setTimeout(function () {
        throw l;
      });
    }
  }
  function zh(t, e, n) {
    try {
      var l = t.onCaughtError;
      l(n.value, { componentStack: n.stack, errorBoundary: e.tag === 1 ? e.stateNode : null });
    } catch (i) {
      setTimeout(function () {
        throw i;
      });
    }
  }
  function hf(t, e, n) {
    return (
      (n = Ul(n)),
      (n.tag = 3),
      (n.payload = { element: null }),
      (n.callback = function () {
        Ts(t, e);
      }),
      n
    );
  }
  function Py(t) {
    return ((t = Ul(t)), (t.tag = 3), t);
  }
  function Gy(t, e, n, l) {
    var i = n.type.getDerivedStateFromError;
    if (typeof i == "function") {
      var r = l.value;
      ((t.payload = function () {
        return i(r);
      }),
        (t.callback = function () {
          zh(e, n, l);
        }));
    }
    var a = n.stateNode;
    a !== null &&
      typeof a.componentDidCatch == "function" &&
      (t.callback = function () {
        (zh(e, n, l), typeof i != "function" && (Hl === null ? (Hl = new Set([this])) : Hl.add(this)));
        var o = l.stack;
        this.componentDidCatch(l.value, { componentStack: o !== null ? o : "" });
      });
  }
  function _S(t, e, n, l, i) {
    if (((n.flags |= 32768), l !== null && typeof l == "object" && typeof l.then == "function")) {
      if (((e = n.alternate), e !== null && Ka(e, n, i, !0), (n = Dn.current), n !== null)) {
        switch (n.tag) {
          case 13:
            return (
              Gn === null ? wf() : n.alternate === null && re === 0 && (re = 3),
              (n.flags &= -257),
              (n.flags |= 65536),
              (n.lanes = i),
              l === of
                ? (n.flags |= 16384)
                : ((e = n.updateQueue), e === null ? (n.updateQueue = new Set([l])) : e.add(l), zc(t, l, i)),
              !1
            );
          case 22:
            return (
              (n.flags |= 65536),
              l === of
                ? (n.flags |= 16384)
                : ((e = n.updateQueue),
                  e === null
                    ? ((e = { transitions: null, markerInstances: null, retryQueue: new Set([l]) }),
                      (n.updateQueue = e))
                    : ((n = e.retryQueue), n === null ? (e.retryQueue = new Set([l])) : n.add(l)),
                  zc(t, l, i)),
              !1
            );
        }
        throw Error(O(435, n.tag));
      }
      return (zc(t, l, i), wf(), !1);
    }
    if (zt)
      return (
        (e = Dn.current),
        e !== null
          ? ((e.flags & 65536) === 0 && (e.flags |= 256),
            (e.flags |= 65536),
            (e.lanes = i),
            l !== ef && ((t = Error(O(422), { cause: l })), Oa(Rn(t, n))))
          : (l !== ef && ((e = Error(O(423), { cause: l })), Oa(Rn(e, n))),
            (t = t.current.alternate),
            (t.flags |= 65536),
            (i &= -i),
            (t.lanes |= i),
            (l = Rn(l, n)),
            (i = hf(t.stateNode, l, i)),
            kc(t, i),
            re !== 4 && (re = 2)),
        !1
      );
    var r = Error(O(520), { cause: l });
    if (((r = Rn(r, n)), Ca === null ? (Ca = [r]) : Ca.push(r), re !== 4 && (re = 2), e === null)) return !0;
    ((l = Rn(l, n)), (n = e));
    do {
      switch (n.tag) {
        case 3:
          return ((n.flags |= 65536), (t = i & -i), (n.lanes |= t), (t = hf(n.stateNode, l, t)), kc(n, t), !1);
        case 1:
          if (
            ((e = n.type),
            (r = n.stateNode),
            (n.flags & 128) === 0 &&
              (typeof e.getDerivedStateFromError == "function" ||
                (r !== null && typeof r.componentDidCatch == "function" && (Hl === null || !Hl.has(r)))))
          )
            return ((n.flags |= 65536), (i &= -i), (n.lanes |= i), (i = Py(i)), Gy(i, t, n, l), kc(n, i), !1);
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Xy = Error(O(461)),
    De = !1;
  function Ue(t, e, n, l) {
    e.child = t === null ? jy(e, null, n, l) : Cr(e, t.child, n, l);
  }
  function Lh(t, e, n, l, i) {
    n = n.render;
    var r = e.ref;
    if ("ref" in l) {
      var a = {};
      for (var o in l) o !== "ref" && (a[o] = l[o]);
    } else a = l;
    return (
      bi(e),
      (l = ld(t, e, n, a, r, i)),
      (o = id()),
      t !== null && !De ? (rd(t, e, i), hl(t, e, i)) : (zt && o && Kf(e), (e.flags |= 1), Ue(t, e, l, i), e.child)
    );
  }
  function Uh(t, e, n, l, i) {
    if (t === null) {
      var r = n.type;
      return typeof r == "function" && !Zf(r) && r.defaultProps === void 0 && n.compare === null
        ? ((e.tag = 15), (e.type = r), Zy(t, e, r, l, i))
        : ((t = Wo(n.type, null, l, e, e.mode, i)), (t.ref = e.ref), (t.return = e), (e.child = t));
    }
    if (((r = t.child), !pd(t, i))) {
      var a = r.memoizedProps;
      if (((n = n.compare), (n = n !== null ? n : _a), n(a, l) && t.ref === e.ref)) return hl(t, e, i);
    }
    return ((e.flags |= 1), (t = fl(r, l)), (t.ref = e.ref), (t.return = e), (e.child = t));
  }
  function Zy(t, e, n, l, i) {
    if (t !== null) {
      var r = t.memoizedProps;
      if (_a(r, l) && t.ref === e.ref)
        if (((De = !1), (e.pendingProps = l = r), pd(t, i))) (t.flags & 131072) !== 0 && (De = !0);
        else return ((e.lanes = t.lanes), hl(t, e, i));
    }
    return gf(t, e, n, l, i);
  }
  function Ky(t, e, n) {
    var l = e.pendingProps,
      i = l.children,
      r = t !== null ? t.memoizedState : null;
    if (l.mode === "hidden") {
      if ((e.flags & 128) !== 0) {
        if (((l = r !== null ? r.baseLanes | n : n), t !== null)) {
          for (i = e.child = t.child, r = 0; i !== null;) ((r = r | i.lanes | i.childLanes), (i = i.sibling));
          e.childLanes = r & ~l;
        } else ((e.childLanes = 0), (e.child = null));
        return Bh(t, e, l, n);
      }
      if ((n & 536870912) !== 0)
        ((e.memoizedState = { baseLanes: 0, cachePool: null }),
          t !== null && ts(e, r !== null ? r.cachePool : null),
          r !== null ? Th(e, r) : cf(),
          Yy(e));
      else return ((e.lanes = e.childLanes = 536870912), Bh(t, e, r !== null ? r.baseLanes | n : n, n));
    } else
      r !== null
        ? (ts(e, r.cachePool), Th(e, r), Rl(e), (e.memoizedState = null))
        : (t !== null && ts(e, null), cf(), Rl(e));
    return (Ue(t, e, i, n), e.child);
  }
  function Bh(t, e, n, l) {
    var i = Wf();
    return (
      (i = i === null ? null : { parent: ke._currentValue, pool: i }),
      (e.memoizedState = { baseLanes: n, cachePool: i }),
      t !== null && ts(e, null),
      cf(),
      Yy(e),
      t !== null && Ka(t, e, l, !0),
      null
    );
  }
  function ls(t, e) {
    var n = e.ref;
    if (n === null) t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object") throw Error(O(284));
      (t === null || t.ref !== n) && (e.flags |= 4194816);
    }
  }
  function gf(t, e, n, l, i) {
    return (
      bi(e),
      (n = ld(t, e, n, l, void 0, i)),
      (l = id()),
      t !== null && !De ? (rd(t, e, i), hl(t, e, i)) : (zt && l && Kf(e), (e.flags |= 1), Ue(t, e, n, i), e.child)
    );
  }
  function Hh(t, e, n, l, i, r) {
    return (
      bi(e),
      (e.updateQueue = null),
      (n = uy(e, l, n, i)),
      sy(t),
      (l = id()),
      t !== null && !De ? (rd(t, e, r), hl(t, e, r)) : (zt && l && Kf(e), (e.flags |= 1), Ue(t, e, n, r), e.child)
    );
  }
  function qh(t, e, n, l, i) {
    if ((bi(e), e.stateNode === null)) {
      var r = sr,
        a = n.contextType;
      (typeof a == "object" && a !== null && (r = Ye(a)),
        (r = new n(l, r)),
        (e.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null),
        (r.updater = pf),
        (e.stateNode = r),
        (r._reactInternals = e),
        (r = e.stateNode),
        (r.props = l),
        (r.state = e.memoizedState),
        (r.refs = {}),
        td(e),
        (a = n.contextType),
        (r.context = typeof a == "object" && a !== null ? Ye(a) : sr),
        (r.state = e.memoizedState),
        (a = n.getDerivedStateFromProps),
        typeof a == "function" && (wc(e, n, a, l), (r.state = e.memoizedState)),
        typeof n.getDerivedStateFromProps == "function" ||
          typeof r.getSnapshotBeforeUpdate == "function" ||
          (typeof r.UNSAFE_componentWillMount != "function" && typeof r.componentWillMount != "function") ||
          ((a = r.state),
          typeof r.componentWillMount == "function" && r.componentWillMount(),
          typeof r.UNSAFE_componentWillMount == "function" && r.UNSAFE_componentWillMount(),
          a !== r.state && pf.enqueueReplaceState(r, r.state, null),
          Sa(e, l, r, i),
          ka(),
          (r.state = e.memoizedState)),
        typeof r.componentDidMount == "function" && (e.flags |= 4194308),
        (l = !0));
    } else if (t === null) {
      r = e.stateNode;
      var o = e.memoizedProps,
        s = ki(n, o);
      r.props = s;
      var u = r.context,
        f = n.contextType;
      ((a = sr), typeof f == "object" && f !== null && (a = Ye(f)));
      var c = n.getDerivedStateFromProps;
      ((f = typeof c == "function" || typeof r.getSnapshotBeforeUpdate == "function"),
        (o = e.pendingProps !== o),
        f ||
          (typeof r.UNSAFE_componentWillReceiveProps != "function" &&
            typeof r.componentWillReceiveProps != "function") ||
          ((o || u !== a) && Oh(e, r, l, a)),
        (Cl = !1));
      var m = e.memoizedState;
      ((r.state = m),
        Sa(e, l, r, i),
        ka(),
        (u = e.memoizedState),
        o || m !== u || Cl
          ? (typeof c == "function" && (wc(e, n, c, l), (u = e.memoizedState)),
            (s = Cl || _h(e, n, s, l, m, u, a))
              ? (f ||
                  (typeof r.UNSAFE_componentWillMount != "function" && typeof r.componentWillMount != "function") ||
                  (typeof r.componentWillMount == "function" && r.componentWillMount(),
                  typeof r.UNSAFE_componentWillMount == "function" && r.UNSAFE_componentWillMount()),
                typeof r.componentDidMount == "function" && (e.flags |= 4194308))
              : (typeof r.componentDidMount == "function" && (e.flags |= 4194308),
                (e.memoizedProps = l),
                (e.memoizedState = u)),
            (r.props = l),
            (r.state = u),
            (r.context = a),
            (l = s))
          : (typeof r.componentDidMount == "function" && (e.flags |= 4194308), (l = !1)));
    } else {
      ((r = e.stateNode),
        sf(t, e),
        (a = e.memoizedProps),
        (f = ki(n, a)),
        (r.props = f),
        (c = e.pendingProps),
        (m = r.context),
        (u = n.contextType),
        (s = sr),
        typeof u == "object" && u !== null && (s = Ye(u)),
        (o = n.getDerivedStateFromProps),
        (u = typeof o == "function" || typeof r.getSnapshotBeforeUpdate == "function") ||
          (typeof r.UNSAFE_componentWillReceiveProps != "function" &&
            typeof r.componentWillReceiveProps != "function") ||
          ((a !== c || m !== s) && Oh(e, r, l, s)),
        (Cl = !1),
        (m = e.memoizedState),
        (r.state = m),
        Sa(e, l, r, i),
        ka());
      var d = e.memoizedState;
      a !== c || m !== d || Cl || (t !== null && t.dependencies !== null && ys(t.dependencies))
        ? (typeof o == "function" && (wc(e, n, o, l), (d = e.memoizedState)),
          (f = Cl || _h(e, n, f, l, m, d, s) || (t !== null && t.dependencies !== null && ys(t.dependencies)))
            ? (u ||
                (typeof r.UNSAFE_componentWillUpdate != "function" && typeof r.componentWillUpdate != "function") ||
                (typeof r.componentWillUpdate == "function" && r.componentWillUpdate(l, d, s),
                typeof r.UNSAFE_componentWillUpdate == "function" && r.UNSAFE_componentWillUpdate(l, d, s)),
              typeof r.componentDidUpdate == "function" && (e.flags |= 4),
              typeof r.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024))
            : (typeof r.componentDidUpdate != "function" ||
                (a === t.memoizedProps && m === t.memoizedState) ||
                (e.flags |= 4),
              typeof r.getSnapshotBeforeUpdate != "function" ||
                (a === t.memoizedProps && m === t.memoizedState) ||
                (e.flags |= 1024),
              (e.memoizedProps = l),
              (e.memoizedState = d)),
          (r.props = l),
          (r.state = d),
          (r.context = s),
          (l = f))
        : (typeof r.componentDidUpdate != "function" ||
            (a === t.memoizedProps && m === t.memoizedState) ||
            (e.flags |= 4),
          typeof r.getSnapshotBeforeUpdate != "function" ||
            (a === t.memoizedProps && m === t.memoizedState) ||
            (e.flags |= 1024),
          (l = !1));
    }
    return (
      (r = l),
      ls(t, e),
      (l = (e.flags & 128) !== 0),
      r || l
        ? ((r = e.stateNode),
          (n = l && typeof n.getDerivedStateFromError != "function" ? null : r.render()),
          (e.flags |= 1),
          t !== null && l ? ((e.child = Cr(e, t.child, null, i)), (e.child = Cr(e, null, n, i))) : Ue(t, e, n, i),
          (e.memoizedState = r.state),
          (t = e.child))
        : (t = hl(t, e, i)),
      t
    );
  }
  function Ih(t, e, n, l) {
    return (Za(), (e.flags |= 256), Ue(t, e, n, l), e.child);
  }
  var Tc = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
  function Ec(t) {
    return { baseLanes: t, cachePool: ly() };
  }
  function Cc(t, e, n) {
    return ((t = t !== null ? t.childLanes & ~n : 0), e && (t |= Mn), t);
  }
  function Jy(t, e, n) {
    var l = e.pendingProps,
      i = !1,
      r = (e.flags & 128) !== 0,
      a;
    if (
      ((a = r) || (a = t !== null && t.memoizedState === null ? !1 : (Se.current & 2) !== 0),
      a && ((i = !0), (e.flags &= -129)),
      (a = (e.flags & 32) !== 0),
      (e.flags &= -33),
      t === null)
    ) {
      if (zt) {
        if ((i ? Nl(e) : Rl(e), zt)) {
          var o = ie,
            s;
          if ((s = o)) {
            t: {
              for (s = o, o = Fn; s.nodeType !== 8;) {
                if (!o) {
                  o = null;
                  break t;
                }
                if (((s = Un(s.nextSibling)), s === null)) {
                  o = null;
                  break t;
                }
              }
              o = s;
            }
            o !== null
              ? ((e.memoizedState = {
                  dehydrated: o,
                  treeContext: mi !== null ? { id: ol, overflow: sl } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (s = mn(18, null, null, 0)),
                (s.stateNode = o),
                (s.return = e),
                (e.child = s),
                ($e = e),
                (ie = null),
                (s = !0))
              : (s = !1);
          }
          s || vi(e);
        }
        if (((o = e.memoizedState), o !== null && ((o = o.dehydrated), o !== null)))
          return (Mf(o) ? (e.lanes = 32) : (e.lanes = 536870912), null);
        cl(e);
      }
      return (
        (o = l.children),
        (l = l.fallback),
        i
          ? (Rl(e),
            (i = e.mode),
            (o = Es({ mode: "hidden", children: o }, i)),
            (l = di(l, i, n, null)),
            (o.return = e),
            (l.return = e),
            (o.sibling = l),
            (e.child = o),
            (i = e.child),
            (i.memoizedState = Ec(n)),
            (i.childLanes = Cc(t, a, n)),
            (e.memoizedState = Tc),
            l)
          : (Nl(e), yf(e, o))
      );
    }
    if (((s = t.memoizedState), s !== null && ((o = s.dehydrated), o !== null))) {
      if (r)
        e.flags & 256
          ? (Nl(e), (e.flags &= -257), (e = Ac(t, e, n)))
          : e.memoizedState !== null
            ? (Rl(e), (e.child = t.child), (e.flags |= 128), (e = null))
            : (Rl(e),
              (i = l.fallback),
              (o = e.mode),
              (l = Es({ mode: "visible", children: l.children }, o)),
              (i = di(i, o, n, null)),
              (i.flags |= 2),
              (l.return = e),
              (i.return = e),
              (l.sibling = i),
              (e.child = l),
              Cr(e, t.child, null, n),
              (l = e.child),
              (l.memoizedState = Ec(n)),
              (l.childLanes = Cc(t, a, n)),
              (e.memoizedState = Tc),
              (e = i));
      else if ((Nl(e), Mf(o))) {
        if (((a = o.nextSibling && o.nextSibling.dataset), a)) var u = a.dgst;
        ((a = u),
          (l = Error(O(419))),
          (l.stack = ""),
          (l.digest = a),
          Oa({ value: l, source: null, stack: null }),
          (e = Ac(t, e, n)));
      } else if ((De || Ka(t, e, n, !1), (a = (n & t.childLanes) !== 0), De || a)) {
        if (
          ((a = Gt),
          a !== null &&
            ((l = n & -n),
            (l = (l & 42) !== 0 ? 1 : Hf(l)),
            (l = (l & (a.suspendedLanes | n)) !== 0 ? 0 : l),
            l !== 0 && l !== s.retryLane))
        )
          throw ((s.retryLane = l), Or(t, l), yn(a, t, l), Xy);
        (o.data === "$?" || wf(), (e = Ac(t, e, n)));
      } else
        o.data === "$?"
          ? ((e.flags |= 192), (e.child = t.child), (e = null))
          : ((t = s.treeContext),
            (ie = Un(o.nextSibling)),
            ($e = e),
            (zt = !0),
            (pi = null),
            (Fn = !1),
            t !== null && ((Cn[An++] = ol), (Cn[An++] = sl), (Cn[An++] = mi), (ol = t.id), (sl = t.overflow), (mi = e)),
            (e = yf(e, l.children)),
            (e.flags |= 4096));
      return e;
    }
    return i
      ? (Rl(e),
        (i = l.fallback),
        (o = e.mode),
        (s = t.child),
        (u = s.sibling),
        (l = fl(s, { mode: "hidden", children: l.children })),
        (l.subtreeFlags = s.subtreeFlags & 65011712),
        u !== null ? (i = fl(u, i)) : ((i = di(i, o, n, null)), (i.flags |= 2)),
        (i.return = e),
        (l.return = e),
        (l.sibling = i),
        (e.child = l),
        (l = i),
        (i = e.child),
        (o = t.child.memoizedState),
        o === null
          ? (o = Ec(n))
          : ((s = o.cachePool),
            s !== null ? ((u = ke._currentValue), (s = s.parent !== u ? { parent: u, pool: u } : s)) : (s = ly()),
            (o = { baseLanes: o.baseLanes | n, cachePool: s })),
        (i.memoizedState = o),
        (i.childLanes = Cc(t, a, n)),
        (e.memoizedState = Tc),
        l)
      : (Nl(e),
        (n = t.child),
        (t = n.sibling),
        (n = fl(n, { mode: "visible", children: l.children })),
        (n.return = e),
        (n.sibling = null),
        t !== null && ((a = e.deletions), a === null ? ((e.deletions = [t]), (e.flags |= 16)) : a.push(t)),
        (e.child = n),
        (e.memoizedState = null),
        n);
  }
  function yf(t, e) {
    return ((e = Es({ mode: "visible", children: e }, t.mode)), (e.return = t), (t.child = e));
  }
  function Es(t, e) {
    return (
      (t = mn(22, t, null, e)),
      (t.lanes = 0),
      (t.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }),
      t
    );
  }
  function Ac(t, e, n) {
    return (Cr(e, t.child, null, n), (t = yf(e, e.pendingProps.children)), (t.flags |= 2), (e.memoizedState = null), t);
  }
  function jh(t, e, n) {
    t.lanes |= e;
    var l = t.alternate;
    (l !== null && (l.lanes |= e), lf(t.return, e, n));
  }
  function Nc(t, e, n, l, i) {
    var r = t.memoizedState;
    r === null
      ? (t.memoizedState = { isBackwards: e, rendering: null, renderingStartTime: 0, last: l, tail: n, tailMode: i })
      : ((r.isBackwards = e),
        (r.rendering = null),
        (r.renderingStartTime = 0),
        (r.last = l),
        (r.tail = n),
        (r.tailMode = i));
  }
  function $y(t, e, n) {
    var l = e.pendingProps,
      i = l.revealOrder,
      r = l.tail;
    if ((Ue(t, e, l.children, n), (l = Se.current), (l & 2) !== 0)) ((l = (l & 1) | 2), (e.flags |= 128));
    else {
      if (t !== null && (t.flags & 128) !== 0)
        t: for (t = e.child; t !== null;) {
          if (t.tag === 13) t.memoizedState !== null && jh(t, n, e);
          else if (t.tag === 19) jh(t, n, e);
          else if (t.child !== null) {
            ((t.child.return = t), (t = t.child));
            continue;
          }
          if (t === e) break t;
          for (; t.sibling === null;) {
            if (t.return === null || t.return === e) break t;
            t = t.return;
          }
          ((t.sibling.return = t.return), (t = t.sibling));
        }
      l &= 1;
    }
    switch ((Wt(Se, l), i)) {
      case "forwards":
        for (n = e.child, i = null; n !== null;)
          ((t = n.alternate), t !== null && Ss(t) === null && (i = n), (n = n.sibling));
        ((n = i),
          n === null ? ((i = e.child), (e.child = null)) : ((i = n.sibling), (n.sibling = null)),
          Nc(e, !1, i, n, r));
        break;
      case "backwards":
        for (n = null, i = e.child, e.child = null; i !== null;) {
          if (((t = i.alternate), t !== null && Ss(t) === null)) {
            e.child = i;
            break;
          }
          ((t = i.sibling), (i.sibling = n), (n = i), (i = t));
        }
        Nc(e, !0, n, null, r);
        break;
      case "together":
        Nc(e, !1, null, null, void 0);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function hl(t, e, n) {
    if ((t !== null && (e.dependencies = t.dependencies), (Ql |= e.lanes), (n & e.childLanes) === 0))
      if (t !== null) {
        if ((Ka(t, e, n, !1), (n & e.childLanes) === 0)) return null;
      } else return null;
    if (t !== null && e.child !== t.child) throw Error(O(153));
    if (e.child !== null) {
      for (t = e.child, n = fl(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null;)
        ((t = t.sibling), (n = n.sibling = fl(t, t.pendingProps)), (n.return = e));
      n.sibling = null;
    }
    return e.child;
  }
  function pd(t, e) {
    return (t.lanes & e) !== 0 ? !0 : ((t = t.dependencies), !!(t !== null && ys(t)));
  }
  function OS(t, e, n) {
    switch (e.tag) {
      case 3:
        (us(e, e.stateNode.containerInfo), Al(e, ke, t.memoizedState.cache), Za());
        break;
      case 27:
      case 5:
        Qc(e);
        break;
      case 4:
        us(e, e.stateNode.containerInfo);
        break;
      case 10:
        Al(e, e.type, e.memoizedProps.value);
        break;
      case 13:
        var l = e.memoizedState;
        if (l !== null)
          return l.dehydrated !== null
            ? (Nl(e), (e.flags |= 128), null)
            : (n & e.child.childLanes) !== 0
              ? Jy(t, e, n)
              : (Nl(e), (t = hl(t, e, n)), t !== null ? t.sibling : null);
        Nl(e);
        break;
      case 19:
        var i = (t.flags & 128) !== 0;
        if (((l = (n & e.childLanes) !== 0), l || (Ka(t, e, n, !1), (l = (n & e.childLanes) !== 0)), i)) {
          if (l) return $y(t, e, n);
          e.flags |= 128;
        }
        if (
          ((i = e.memoizedState),
          i !== null && ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
          Wt(Se, Se.current),
          l)
        )
          break;
        return null;
      case 22:
      case 23:
        return ((e.lanes = 0), Ky(t, e, n));
      case 24:
        Al(e, ke, t.memoizedState.cache);
    }
    return hl(t, e, n);
  }
  function Wy(t, e, n) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps) De = !0;
      else {
        if (!pd(t, n) && (e.flags & 128) === 0) return ((De = !1), OS(t, e, n));
        De = (t.flags & 131072) !== 0;
      }
    else ((De = !1), zt && (e.flags & 1048576) !== 0 && ey(e, gs, e.index));
    switch (((e.lanes = 0), e.tag)) {
      case 16:
        t: {
          t = e.pendingProps;
          var l = e.elementType,
            i = l._init;
          if (((l = i(l._payload)), (e.type = l), typeof l == "function"))
            Zf(l)
              ? ((t = ki(l, t)), (e.tag = 1), (e = qh(null, e, l, t, n)))
              : ((e.tag = 0), (e = gf(null, e, l, t, n)));
          else {
            if (l != null) {
              if (((i = l.$$typeof), i === Lf)) {
                ((e.tag = 11), (e = Lh(null, e, l, t, n)));
                break t;
              } else if (i === Uf) {
                ((e.tag = 14), (e = Uh(null, e, l, t, n)));
                break t;
              }
            }
            throw ((e = Fc(l) || l), Error(O(306, e, "")));
          }
        }
        return e;
      case 0:
        return gf(t, e, e.type, e.pendingProps, n);
      case 1:
        return ((l = e.type), (i = ki(l, e.pendingProps)), qh(t, e, l, i, n));
      case 3:
        t: {
          if ((us(e, e.stateNode.containerInfo), t === null)) throw Error(O(387));
          l = e.pendingProps;
          var r = e.memoizedState;
          ((i = r.element), sf(t, e), Sa(e, l, null, n));
          var a = e.memoizedState;
          if (((l = a.cache), Al(e, ke, l), l !== r.cache && rf(e, [ke], n, !0), ka(), (l = a.element), r.isDehydrated))
            if (
              ((r = { element: l, isDehydrated: !1, cache: a.cache }),
              (e.updateQueue.baseState = r),
              (e.memoizedState = r),
              e.flags & 256)
            ) {
              e = Ih(t, e, l, n);
              break t;
            } else if (l !== i) {
              ((i = Rn(Error(O(424)), e)), Oa(i), (e = Ih(t, e, l, n)));
              break t;
            } else {
              switch (((t = e.stateNode.containerInfo), t.nodeType)) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
              }
              for (ie = Un(t.firstChild), $e = e, zt = !0, pi = null, Fn = !0, n = jy(e, null, l, n), e.child = n; n;)
                ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
            }
          else {
            if ((Za(), l === i)) {
              e = hl(t, e, n);
              break t;
            }
            Ue(t, e, l, n);
          }
          e = e.child;
        }
        return e;
      case 26:
        return (
          ls(t, e),
          t === null
            ? (n = ag(e.type, null, e.pendingProps, null))
              ? (e.memoizedState = n)
              : zt ||
                ((n = e.type),
                (t = e.pendingProps),
                (l = _s(Ll.current).createElement(n)),
                (l[je] = e),
                (l[an] = t),
                He(l, n, t),
                Me(l),
                (e.stateNode = l))
            : (e.memoizedState = ag(e.type, t.memoizedProps, e.pendingProps, t.memoizedState)),
          null
        );
      case 27:
        return (
          Qc(e),
          t === null &&
            zt &&
            ((l = e.stateNode = qv(e.type, e.pendingProps, Ll.current)),
            ($e = e),
            (Fn = !0),
            (i = ie),
            Gl(e.type) ? ((Df = i), (ie = Un(l.firstChild))) : (ie = i)),
          Ue(t, e, e.pendingProps.children, n),
          ls(t, e),
          t === null && (e.flags |= 4194304),
          e.child
        );
      case 5:
        return (
          t === null &&
            zt &&
            ((i = l = ie) &&
              ((l = rw(l, e.type, e.pendingProps, Fn)),
              l !== null ? ((e.stateNode = l), ($e = e), (ie = Un(l.firstChild)), (Fn = !1), (i = !0)) : (i = !1)),
            i || vi(e)),
          Qc(e),
          (i = e.type),
          (r = e.pendingProps),
          (a = t !== null ? t.memoizedProps : null),
          (l = r.children),
          Nf(i, r) ? (l = null) : a !== null && Nf(i, a) && (e.flags |= 32),
          e.memoizedState !== null && ((i = ld(t, e, ES, null, null, n)), (qa._currentValue = i)),
          ls(t, e),
          Ue(t, e, l, n),
          e.child
        );
      case 6:
        return (
          t === null &&
            zt &&
            ((t = n = ie) &&
              ((n = aw(n, e.pendingProps, Fn)),
              n !== null ? ((e.stateNode = n), ($e = e), (ie = null), (t = !0)) : (t = !1)),
            t || vi(e)),
          null
        );
      case 13:
        return Jy(t, e, n);
      case 4:
        return (
          us(e, e.stateNode.containerInfo),
          (l = e.pendingProps),
          t === null ? (e.child = Cr(e, null, l, n)) : Ue(t, e, l, n),
          e.child
        );
      case 11:
        return Lh(t, e, e.type, e.pendingProps, n);
      case 7:
        return (Ue(t, e, e.pendingProps, n), e.child);
      case 8:
        return (Ue(t, e, e.pendingProps.children, n), e.child);
      case 12:
        return (Ue(t, e, e.pendingProps.children, n), e.child);
      case 10:
        return ((l = e.pendingProps), Al(e, e.type, l.value), Ue(t, e, l.children, n), e.child);
      case 9:
        return (
          (i = e.type._context),
          (l = e.pendingProps.children),
          bi(e),
          (i = Ye(i)),
          (l = l(i)),
          (e.flags |= 1),
          Ue(t, e, l, n),
          e.child
        );
      case 14:
        return Uh(t, e, e.type, e.pendingProps, n);
      case 15:
        return Zy(t, e, e.type, e.pendingProps, n);
      case 19:
        return $y(t, e, n);
      case 31:
        return (
          (l = e.pendingProps),
          (n = e.mode),
          (l = { mode: l.mode, children: l.children }),
          t === null
            ? ((n = Es(l, n)), (n.ref = e.ref), (e.child = n), (n.return = e), (e = n))
            : ((n = fl(t.child, l)), (n.ref = e.ref), (e.child = n), (n.return = e), (e = n)),
          e
        );
      case 22:
        return Ky(t, e, n);
      case 24:
        return (
          bi(e),
          (l = Ye(ke)),
          t === null
            ? ((i = Wf()),
              i === null &&
                ((i = Gt),
                (r = $f()),
                (i.pooledCache = r),
                r.refCount++,
                r !== null && (i.pooledCacheLanes |= n),
                (i = r)),
              (e.memoizedState = { parent: l, cache: i }),
              td(e),
              Al(e, ke, i))
            : ((t.lanes & n) !== 0 && (sf(t, e), Sa(e, null, null, n), ka()),
              (i = t.memoizedState),
              (r = e.memoizedState),
              i.parent !== l
                ? ((i = { parent: l, cache: l }),
                  (e.memoizedState = i),
                  e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = i),
                  Al(e, ke, l))
                : ((l = r.cache), Al(e, ke, l), l !== i.cache && rf(e, [ke], n, !0))),
          Ue(t, e, e.pendingProps.children, n),
          e.child
        );
      case 29:
        throw e.pendingProps;
    }
    throw Error(O(156, e.tag));
  }
  function ll(t) {
    t.flags |= 4;
  }
  function Yh(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0) t.flags &= -16777217;
    else if (((t.flags |= 16777216), !Yv(e))) {
      if (
        ((e = Dn.current),
        e !== null &&
          ((Ct & 4194048) === Ct ? Gn !== null : ((Ct & 62914560) !== Ct && (Ct & 536870912) === 0) || e !== Gn))
      )
        throw ((ba = of), iy);
      t.flags |= 8192;
    }
  }
  function Fo(t, e) {
    (e !== null && (t.flags |= 4),
      t.flags & 16384 && ((e = t.tag !== 22 ? Eg() : 536870912), (t.lanes |= e), (Ar |= e)));
  }
  function oa(t, e) {
    if (!zt)
      switch (t.tailMode) {
        case "hidden":
          e = t.tail;
          for (var n = null; e !== null;) (e.alternate !== null && (n = e), (e = e.sibling));
          n === null ? (t.tail = null) : (n.sibling = null);
          break;
        case "collapsed":
          n = t.tail;
          for (var l = null; n !== null;) (n.alternate !== null && (l = n), (n = n.sibling));
          l === null ? (e || t.tail === null ? (t.tail = null) : (t.tail.sibling = null)) : (l.sibling = null);
      }
  }
  function ne(t) {
    var e = t.alternate !== null && t.alternate.child === t.child,
      n = 0,
      l = 0;
    if (e)
      for (var i = t.child; i !== null;)
        ((n |= i.lanes | i.childLanes),
          (l |= i.subtreeFlags & 65011712),
          (l |= i.flags & 65011712),
          (i.return = t),
          (i = i.sibling));
    else
      for (i = t.child; i !== null;)
        ((n |= i.lanes | i.childLanes), (l |= i.subtreeFlags), (l |= i.flags), (i.return = t), (i = i.sibling));
    return ((t.subtreeFlags |= l), (t.childLanes = n), e);
  }
  function zS(t, e, n) {
    var l = e.pendingProps;
    switch ((Jf(e), e.tag)) {
      case 31:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (ne(e), null);
      case 1:
        return (ne(e), null);
      case 3:
        return (
          (n = e.stateNode),
          (l = null),
          t !== null && (l = t.memoizedState.cache),
          e.memoizedState.cache !== l && (e.flags |= 2048),
          dl(ke),
          xr(),
          n.pendingContext && ((n.context = n.pendingContext), (n.pendingContext = null)),
          (t === null || t.child === null) &&
            (ra(e)
              ? ll(e)
              : t === null || (t.memoizedState.isDehydrated && (e.flags & 256) === 0) || ((e.flags |= 1024), vh())),
          ne(e),
          null
        );
      case 26:
        return (
          (n = e.memoizedState),
          t === null
            ? (ll(e), n !== null ? (ne(e), Yh(e, n)) : (ne(e), (e.flags &= -16777217)))
            : n
              ? n !== t.memoizedState
                ? (ll(e), ne(e), Yh(e, n))
                : (ne(e), (e.flags &= -16777217))
              : (t.memoizedProps !== l && ll(e), ne(e), (e.flags &= -16777217)),
          null
        );
      case 27:
        (cs(e), (n = Ll.current));
        var i = e.type;
        if (t !== null && e.stateNode != null) t.memoizedProps !== l && ll(e);
        else {
          if (!l) {
            if (e.stateNode === null) throw Error(O(166));
            return (ne(e), null);
          }
          ((t = Qn.current), ra(e) ? gh(e, t) : ((t = qv(i, l, n)), (e.stateNode = t), ll(e)));
        }
        return (ne(e), null);
      case 5:
        if ((cs(e), (n = e.type), t !== null && e.stateNode != null)) t.memoizedProps !== l && ll(e);
        else {
          if (!l) {
            if (e.stateNode === null) throw Error(O(166));
            return (ne(e), null);
          }
          if (((t = Qn.current), ra(e))) gh(e, t);
          else {
            switch (((i = _s(Ll.current)), t)) {
              case 1:
                t = i.createElementNS("http://www.w3.org/2000/svg", n);
                break;
              case 2:
                t = i.createElementNS("http://www.w3.org/1998/Math/MathML", n);
                break;
              default:
                switch (n) {
                  case "svg":
                    t = i.createElementNS("http://www.w3.org/2000/svg", n);
                    break;
                  case "math":
                    t = i.createElementNS("http://www.w3.org/1998/Math/MathML", n);
                    break;
                  case "script":
                    ((t = i.createElement("div")),
                      (t.innerHTML = "<script><\/script>"),
                      (t = t.removeChild(t.firstChild)));
                    break;
                  case "select":
                    ((t =
                      typeof l.is == "string" ? i.createElement("select", { is: l.is }) : i.createElement("select")),
                      l.multiple ? (t.multiple = !0) : l.size && (t.size = l.size));
                    break;
                  default:
                    t = typeof l.is == "string" ? i.createElement(n, { is: l.is }) : i.createElement(n);
                }
            }
            ((t[je] = e), (t[an] = l));
            t: for (i = e.child; i !== null;) {
              if (i.tag === 5 || i.tag === 6) t.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                ((i.child.return = i), (i = i.child));
                continue;
              }
              if (i === e) break t;
              for (; i.sibling === null;) {
                if (i.return === null || i.return === e) break t;
                i = i.return;
              }
              ((i.sibling.return = i.return), (i = i.sibling));
            }
            e.stateNode = t;
            t: switch ((He(t, n, l), n)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                t = !!l.autoFocus;
                break t;
              case "img":
                t = !0;
                break t;
              default:
                t = !1;
            }
            t && ll(e);
          }
        }
        return (ne(e), (e.flags &= -16777217), null);
      case 6:
        if (t && e.stateNode != null) t.memoizedProps !== l && ll(e);
        else {
          if (typeof l != "string" && e.stateNode === null) throw Error(O(166));
          if (((t = Ll.current), ra(e))) {
            if (((t = e.stateNode), (n = e.memoizedProps), (l = null), (i = $e), i !== null))
              switch (i.tag) {
                case 27:
                case 5:
                  l = i.memoizedProps;
              }
            ((t[je] = e),
              (t = !!(t.nodeValue === n || (l !== null && l.suppressHydrationWarning === !0) || Uv(t.nodeValue, n))),
              t || vi(e));
          } else ((t = _s(t).createTextNode(l)), (t[je] = e), (e.stateNode = t));
        }
        return (ne(e), null);
      case 13:
        if (((l = e.memoizedState), t === null || (t.memoizedState !== null && t.memoizedState.dehydrated !== null))) {
          if (((i = ra(e)), l !== null && l.dehydrated !== null)) {
            if (t === null) {
              if (!i) throw Error(O(318));
              if (((i = e.memoizedState), (i = i !== null ? i.dehydrated : null), !i)) throw Error(O(317));
              i[je] = e;
            } else (Za(), (e.flags & 128) === 0 && (e.memoizedState = null), (e.flags |= 4));
            (ne(e), (i = !1));
          } else
            ((i = vh()), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = i), (i = !0));
          if (!i) return e.flags & 256 ? (cl(e), e) : (cl(e), null);
        }
        if ((cl(e), (e.flags & 128) !== 0)) return ((e.lanes = n), e);
        if (((n = l !== null), (t = t !== null && t.memoizedState !== null), n)) {
          ((l = e.child),
            (i = null),
            l.alternate !== null &&
              l.alternate.memoizedState !== null &&
              l.alternate.memoizedState.cachePool !== null &&
              (i = l.alternate.memoizedState.cachePool.pool));
          var r = null;
          (l.memoizedState !== null && l.memoizedState.cachePool !== null && (r = l.memoizedState.cachePool.pool),
            r !== i && (l.flags |= 2048));
        }
        return (n !== t && n && (e.child.flags |= 8192), Fo(e, e.updateQueue), ne(e), null);
      case 4:
        return (xr(), t === null && Sd(e.stateNode.containerInfo), ne(e), null);
      case 10:
        return (dl(e.type), ne(e), null);
      case 19:
        if ((_e(Se), (i = e.memoizedState), i === null)) return (ne(e), null);
        if (((l = (e.flags & 128) !== 0), (r = i.rendering), r === null))
          if (l) oa(i, !1);
          else {
            if (re !== 0 || (t !== null && (t.flags & 128) !== 0))
              for (t = e.child; t !== null;) {
                if (((r = Ss(t)), r !== null)) {
                  for (
                    e.flags |= 128,
                      oa(i, !1),
                      t = r.updateQueue,
                      e.updateQueue = t,
                      Fo(e, t),
                      e.subtreeFlags = 0,
                      t = n,
                      n = e.child;
                    n !== null;
                  )
                    (ty(n, t), (n = n.sibling));
                  return (Wt(Se, (Se.current & 1) | 2), e.child);
                }
                t = t.sibling;
              }
            i.tail !== null && Pn() > As && ((e.flags |= 128), (l = !0), oa(i, !1), (e.lanes = 4194304));
          }
        else {
          if (!l)
            if (((t = Ss(r)), t !== null)) {
              if (
                ((e.flags |= 128),
                (l = !0),
                (t = t.updateQueue),
                (e.updateQueue = t),
                Fo(e, t),
                oa(i, !0),
                i.tail === null && i.tailMode === "hidden" && !r.alternate && !zt)
              )
                return (ne(e), null);
            } else
              2 * Pn() - i.renderingStartTime > As &&
                n !== 536870912 &&
                ((e.flags |= 128), (l = !0), oa(i, !1), (e.lanes = 4194304));
          i.isBackwards
            ? ((r.sibling = e.child), (e.child = r))
            : ((t = i.last), t !== null ? (t.sibling = r) : (e.child = r), (i.last = r));
        }
        return i.tail !== null
          ? ((e = i.tail),
            (i.rendering = e),
            (i.tail = e.sibling),
            (i.renderingStartTime = Pn()),
            (e.sibling = null),
            (t = Se.current),
            Wt(Se, l ? (t & 1) | 2 : t & 1),
            e)
          : (ne(e), null);
      case 22:
      case 23:
        return (
          cl(e),
          ed(),
          (l = e.memoizedState !== null),
          t !== null ? (t.memoizedState !== null) !== l && (e.flags |= 8192) : l && (e.flags |= 8192),
          l
            ? (n & 536870912) !== 0 && (e.flags & 128) === 0 && (ne(e), e.subtreeFlags & 6 && (e.flags |= 8192))
            : ne(e),
          (n = e.updateQueue),
          n !== null && Fo(e, n.retryQueue),
          (n = null),
          t !== null &&
            t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (n = t.memoizedState.cachePool.pool),
          (l = null),
          e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool),
          l !== n && (e.flags |= 2048),
          t !== null && _e(hi),
          null
        );
      case 24:
        return (
          (n = null),
          t !== null && (n = t.memoizedState.cache),
          e.memoizedState.cache !== n && (e.flags |= 2048),
          dl(ke),
          ne(e),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(O(156, e.tag));
  }
  function LS(t, e) {
    switch ((Jf(e), e.tag)) {
      case 1:
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 3:
        return (
          dl(ke),
          xr(),
          (t = e.flags),
          (t & 65536) !== 0 && (t & 128) === 0 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 26:
      case 27:
      case 5:
        return (cs(e), null);
      case 13:
        if ((cl(e), (t = e.memoizedState), t !== null && t.dehydrated !== null)) {
          if (e.alternate === null) throw Error(O(340));
          Za();
        }
        return ((t = e.flags), t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null);
      case 19:
        return (_e(Se), null);
      case 4:
        return (xr(), null);
      case 10:
        return (dl(e.type), null);
      case 22:
      case 23:
        return (
          cl(e),
          ed(),
          t !== null && _e(hi),
          (t = e.flags),
          t & 65536 ? ((e.flags = (t & -65537) | 128), e) : null
        );
      case 24:
        return (dl(ke), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function tv(t, e) {
    switch ((Jf(e), e.tag)) {
      case 3:
        (dl(ke), xr());
        break;
      case 26:
      case 27:
      case 5:
        cs(e);
        break;
      case 4:
        xr();
        break;
      case 13:
        cl(e);
        break;
      case 19:
        _e(Se);
        break;
      case 10:
        dl(e.type);
        break;
      case 22:
      case 23:
        (cl(e), ed(), t !== null && _e(hi));
        break;
      case 24:
        dl(ke);
    }
  }
  function eo(t, e) {
    try {
      var n = e.updateQueue,
        l = n !== null ? n.lastEffect : null;
      if (l !== null) {
        var i = l.next;
        n = i;
        do {
          if ((n.tag & t) === t) {
            l = void 0;
            var r = n.create,
              a = n.inst;
            ((l = r()), (a.destroy = l));
          }
          n = n.next;
        } while (n !== i);
      }
    } catch (o) {
      Qt(e, e.return, o);
    }
  }
  function Vl(t, e, n) {
    try {
      var l = e.updateQueue,
        i = l !== null ? l.lastEffect : null;
      if (i !== null) {
        var r = i.next;
        l = r;
        do {
          if ((l.tag & t) === t) {
            var a = l.inst,
              o = a.destroy;
            if (o !== void 0) {
              ((a.destroy = void 0), (i = e));
              var s = n,
                u = o;
              try {
                u();
              } catch (f) {
                Qt(i, s, f);
              }
            }
          }
          l = l.next;
        } while (l !== r);
      }
    } catch (f) {
      Qt(e, e.return, f);
    }
  }
  function ev(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var n = t.stateNode;
      try {
        oy(e, n);
      } catch (l) {
        Qt(t, t.return, l);
      }
    }
  }
  function nv(t, e, n) {
    ((n.props = ki(t.type, t.memoizedProps)), (n.state = t.memoizedState));
    try {
      n.componentWillUnmount();
    } catch (l) {
      Qt(t, e, l);
    }
  }
  function Ta(t, e) {
    try {
      var n = t.ref;
      if (n !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var l = t.stateNode;
            break;
          case 30:
            l = t.stateNode;
            break;
          default:
            l = t.stateNode;
        }
        typeof n == "function" ? (t.refCleanup = n(l)) : (n.current = l);
      }
    } catch (i) {
      Qt(t, e, i);
    }
  }
  function Vn(t, e) {
    var n = t.ref,
      l = t.refCleanup;
    if (n !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (i) {
          Qt(t, e, i);
        } finally {
          ((t.refCleanup = null), (t = t.alternate), t != null && (t.refCleanup = null));
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (i) {
          Qt(t, e, i);
        }
      else n.current = null;
  }
  function lv(t) {
    var e = t.type,
      n = t.memoizedProps,
      l = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && l.focus();
          break t;
        case "img":
          n.src ? (l.src = n.src) : n.srcSet && (l.srcset = n.srcSet);
      }
    } catch (i) {
      Qt(t, t.return, i);
    }
  }
  function Rc(t, e, n) {
    try {
      var l = t.stateNode;
      (tw(l, t.type, n, e), (l[an] = e));
    } catch (i) {
      Qt(t, t.return, i);
    }
  }
  function iv(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || (t.tag === 27 && Gl(t.type)) || t.tag === 4;
  }
  function Mc(t) {
    t: for (;;) {
      for (; t.sibling === null;) {
        if (t.return === null || iv(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18;) {
        if ((t.tag === 27 && Gl(t.type)) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        ((t.child.return = t), (t = t.child));
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function vf(t, e, n) {
    var l = t.tag;
    if (l === 5 || l === 6)
      ((t = t.stateNode),
        e
          ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(t, e)
          : ((e = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n),
            e.appendChild(t),
            (n = n._reactRootContainer),
            n != null || e.onclick !== null || (e.onclick = Js)));
    else if (l !== 4 && (l === 27 && Gl(t.type) && ((n = t.stateNode), (e = null)), (t = t.child), t !== null))
      for (vf(t, e, n), t = t.sibling; t !== null;) (vf(t, e, n), (t = t.sibling));
  }
  function Cs(t, e, n) {
    var l = t.tag;
    if (l === 5 || l === 6) ((t = t.stateNode), e ? n.insertBefore(t, e) : n.appendChild(t));
    else if (l !== 4 && (l === 27 && Gl(t.type) && (n = t.stateNode), (t = t.child), t !== null))
      for (Cs(t, e, n), t = t.sibling; t !== null;) (Cs(t, e, n), (t = t.sibling));
  }
  function rv(t) {
    var e = t.stateNode,
      n = t.memoizedProps;
    try {
      for (var l = t.type, i = e.attributes; i.length;) e.removeAttributeNode(i[0]);
      (He(e, l, n), (e[je] = t), (e[an] = n));
    } catch (r) {
      Qt(t, t.return, r);
    }
  }
  var rl = !1,
    ce = !1,
    Dc = !1,
    Fh = typeof WeakSet == "function" ? WeakSet : Set,
    Re = null;
  function US(t, e) {
    if (((t = t.containerInfo), (Cf = Us), (t = Pg(t)), Pf(t))) {
      if ("selectionStart" in t) var n = { start: t.selectionStart, end: t.selectionEnd };
      else
        t: {
          n = ((n = t.ownerDocument) && n.defaultView) || window;
          var l = n.getSelection && n.getSelection();
          if (l && l.rangeCount !== 0) {
            n = l.anchorNode;
            var i = l.anchorOffset,
              r = l.focusNode;
            l = l.focusOffset;
            try {
              (n.nodeType, r.nodeType);
            } catch {
              n = null;
              break t;
            }
            var a = 0,
              o = -1,
              s = -1,
              u = 0,
              f = 0,
              c = t,
              m = null;
            e: for (;;) {
              for (
                var d;
                c !== n || (i !== 0 && c.nodeType !== 3) || (o = a + i),
                  c !== r || (l !== 0 && c.nodeType !== 3) || (s = a + l),
                  c.nodeType === 3 && (a += c.nodeValue.length),
                  (d = c.firstChild) !== null;
              )
                ((m = c), (c = d));
              for (;;) {
                if (c === t) break e;
                if ((m === n && ++u === i && (o = a), m === r && ++f === l && (s = a), (d = c.nextSibling) !== null))
                  break;
                ((c = m), (m = c.parentNode));
              }
              c = d;
            }
            n = o === -1 || s === -1 ? null : { start: o, end: s };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Af = { focusedElem: t, selectionRange: n }, Us = !1, Re = e; Re !== null;)
      if (((e = Re), (t = e.child), (e.subtreeFlags & 1024) !== 0 && t !== null)) ((t.return = e), (Re = t));
      else
        for (; Re !== null;) {
          switch (((e = Re), (r = e.alternate), (t = e.flags), e.tag)) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && r !== null) {
                ((t = void 0), (n = e), (i = r.memoizedProps), (r = r.memoizedState), (l = n.stateNode));
                try {
                  var g = ki(n.type, i, n.elementType === n.type);
                  ((t = l.getSnapshotBeforeUpdate(g, r)), (l.__reactInternalSnapshotBeforeUpdate = t));
                } catch (x) {
                  Qt(n, n.return, x);
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (((t = e.stateNode.containerInfo), (n = t.nodeType), n === 9)) Rf(t);
                else if (n === 1)
                  switch (t.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Rf(t);
                      break;
                    default:
                      t.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((t & 1024) !== 0) throw Error(O(163));
          }
          if (((t = e.sibling), t !== null)) {
            ((t.return = e.return), (Re = t));
            break;
          }
          Re = e.return;
        }
  }
  function av(t, e, n) {
    var l = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        (wl(t, n), l & 4 && eo(5, n));
        break;
      case 1:
        if ((wl(t, n), l & 4))
          if (((t = n.stateNode), e === null))
            try {
              t.componentDidMount();
            } catch (a) {
              Qt(n, n.return, a);
            }
          else {
            var i = ki(n.type, e.memoizedProps);
            e = e.memoizedState;
            try {
              t.componentDidUpdate(i, e, t.__reactInternalSnapshotBeforeUpdate);
            } catch (a) {
              Qt(n, n.return, a);
            }
          }
        (l & 64 && ev(n), l & 512 && Ta(n, n.return));
        break;
      case 3:
        if ((wl(t, n), l & 64 && ((t = n.updateQueue), t !== null))) {
          if (((e = null), n.child !== null))
            switch (n.child.tag) {
              case 27:
              case 5:
                e = n.child.stateNode;
                break;
              case 1:
                e = n.child.stateNode;
            }
          try {
            oy(t, e);
          } catch (a) {
            Qt(n, n.return, a);
          }
        }
        break;
      case 27:
        e === null && l & 4 && rv(n);
      case 26:
      case 5:
        (wl(t, n), e === null && l & 4 && lv(n), l & 512 && Ta(n, n.return));
        break;
      case 12:
        wl(t, n);
        break;
      case 13:
        (wl(t, n),
          l & 4 && uv(t, n),
          l & 64 &&
            ((t = n.memoizedState),
            t !== null && ((t = t.dehydrated), t !== null && ((n = QS.bind(null, n)), ow(t, n)))));
        break;
      case 22:
        if (((l = n.memoizedState !== null || rl), !l)) {
          ((e = (e !== null && e.memoizedState !== null) || ce), (i = rl));
          var r = ce;
          ((rl = l), (ce = e) && !r ? Tl(t, n, (n.subtreeFlags & 8772) !== 0) : wl(t, n), (rl = i), (ce = r));
        }
        break;
      case 30:
        break;
      default:
        wl(t, n);
    }
  }
  function ov(t) {
    var e = t.alternate;
    (e !== null && ((t.alternate = null), ov(e)),
      (t.child = null),
      (t.deletions = null),
      (t.sibling = null),
      t.tag === 5 && ((e = t.stateNode), e !== null && If(e)),
      (t.stateNode = null),
      (t.return = null),
      (t.dependencies = null),
      (t.memoizedProps = null),
      (t.memoizedState = null),
      (t.pendingProps = null),
      (t.stateNode = null),
      (t.updateQueue = null));
  }
  var $t = null,
    ln = !1;
  function il(t, e, n) {
    for (n = n.child; n !== null;) (sv(t, e, n), (n = n.sibling));
  }
  function sv(t, e, n) {
    if (pn && typeof pn.onCommitFiberUnmount == "function")
      try {
        pn.onCommitFiberUnmount(Va, n);
      } catch {}
    switch (n.tag) {
      case 26:
        (ce || Vn(n, e),
          il(t, e, n),
          n.memoizedState ? n.memoizedState.count-- : n.stateNode && ((n = n.stateNode), n.parentNode.removeChild(n)));
        break;
      case 27:
        ce || Vn(n, e);
        var l = $t,
          i = ln;
        (Gl(n.type) && (($t = n.stateNode), (ln = !1)), il(t, e, n), Na(n.stateNode), ($t = l), (ln = i));
        break;
      case 5:
        ce || Vn(n, e);
      case 6:
        if (((l = $t), (i = ln), ($t = null), il(t, e, n), ($t = l), (ln = i), $t !== null))
          if (ln)
            try {
              ($t.nodeType === 9 ? $t.body : $t.nodeName === "HTML" ? $t.ownerDocument.body : $t).removeChild(
                n.stateNode,
              );
            } catch (r) {
              Qt(n, e, r);
            }
          else
            try {
              $t.removeChild(n.stateNode);
            } catch (r) {
              Qt(n, e, r);
            }
        break;
      case 18:
        $t !== null &&
          (ln
            ? ((t = $t),
              lg(t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, n.stateNode),
              Ya(t))
            : lg($t, n.stateNode));
        break;
      case 4:
        ((l = $t), (i = ln), ($t = n.stateNode.containerInfo), (ln = !0), il(t, e, n), ($t = l), (ln = i));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (ce || Vl(2, n, e), ce || Vl(4, n, e), il(t, e, n));
        break;
      case 1:
        (ce || (Vn(n, e), (l = n.stateNode), typeof l.componentWillUnmount == "function" && nv(n, e, l)), il(t, e, n));
        break;
      case 21:
        il(t, e, n);
        break;
      case 22:
        ((ce = (l = ce) || n.memoizedState !== null), il(t, e, n), (ce = l));
        break;
      default:
        il(t, e, n);
    }
  }
  function uv(t, e) {
    if (
      e.memoizedState === null &&
      ((t = e.alternate), t !== null && ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
    )
      try {
        Ya(t);
      } catch (n) {
        Qt(e, e.return, n);
      }
  }
  function BS(t) {
    switch (t.tag) {
      case 13:
      case 19:
        var e = t.stateNode;
        return (e === null && (e = t.stateNode = new Fh()), e);
      case 22:
        return ((t = t.stateNode), (e = t._retryCache), e === null && (e = t._retryCache = new Fh()), e);
      default:
        throw Error(O(435, t.tag));
    }
  }
  function _c(t, e) {
    var n = BS(t);
    e.forEach(function (l) {
      var i = PS.bind(null, t, l);
      n.has(l) || (n.add(l), l.then(i, i));
    });
  }
  function cn(t, e) {
    var n = e.deletions;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var i = n[l],
          r = t,
          a = e,
          o = a;
        t: for (; o !== null;) {
          switch (o.tag) {
            case 27:
              if (Gl(o.type)) {
                (($t = o.stateNode), (ln = !1));
                break t;
              }
              break;
            case 5:
              (($t = o.stateNode), (ln = !1));
              break t;
            case 3:
            case 4:
              (($t = o.stateNode.containerInfo), (ln = !0));
              break t;
          }
          o = o.return;
        }
        if ($t === null) throw Error(O(160));
        (sv(r, a, i), ($t = null), (ln = !1), (r = i.alternate), r !== null && (r.return = null), (i.return = null));
      }
    if (e.subtreeFlags & 13878) for (e = e.child; e !== null;) (cv(e, t), (e = e.sibling));
  }
  var Ln = null;
  function cv(t, e) {
    var n = t.alternate,
      l = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (cn(e, t), fn(t), l & 4 && (Vl(3, t, t.return), eo(3, t), Vl(5, t, t.return)));
        break;
      case 1:
        (cn(e, t),
          fn(t),
          l & 512 && (ce || n === null || Vn(n, n.return)),
          l & 64 &&
            rl &&
            ((t = t.updateQueue),
            t !== null &&
              ((l = t.callbacks),
              l !== null &&
                ((n = t.shared.hiddenCallbacks), (t.shared.hiddenCallbacks = n === null ? l : n.concat(l))))));
        break;
      case 26:
        var i = Ln;
        if ((cn(e, t), fn(t), l & 512 && (ce || n === null || Vn(n, n.return)), l & 4)) {
          var r = n !== null ? n.memoizedState : null;
          if (((l = t.memoizedState), n === null))
            if (l === null)
              if (t.stateNode === null) {
                t: {
                  ((l = t.type), (n = t.memoizedProps), (i = i.ownerDocument || i));
                  e: switch (l) {
                    case "title":
                      ((r = i.getElementsByTagName("title")[0]),
                        (!r ||
                          r[Ga] ||
                          r[je] ||
                          r.namespaceURI === "http://www.w3.org/2000/svg" ||
                          r.hasAttribute("itemprop")) &&
                          ((r = i.createElement(l)), i.head.insertBefore(r, i.querySelector("head > title"))),
                        He(r, l, n),
                        (r[je] = t),
                        Me(r),
                        (l = r));
                      break t;
                    case "link":
                      var a = sg("link", "href", i).get(l + (n.href || ""));
                      if (a) {
                        for (var o = 0; o < a.length; o++)
                          if (
                            ((r = a[o]),
                            r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) &&
                              r.getAttribute("rel") === (n.rel == null ? null : n.rel) &&
                              r.getAttribute("title") === (n.title == null ? null : n.title) &&
                              r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin))
                          ) {
                            a.splice(o, 1);
                            break e;
                          }
                      }
                      ((r = i.createElement(l)), He(r, l, n), i.head.appendChild(r));
                      break;
                    case "meta":
                      if ((a = sg("meta", "content", i).get(l + (n.content || "")))) {
                        for (o = 0; o < a.length; o++)
                          if (
                            ((r = a[o]),
                            r.getAttribute("content") === (n.content == null ? null : "" + n.content) &&
                              r.getAttribute("name") === (n.name == null ? null : n.name) &&
                              r.getAttribute("property") === (n.property == null ? null : n.property) &&
                              r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) &&
                              r.getAttribute("charset") === (n.charSet == null ? null : n.charSet))
                          ) {
                            a.splice(o, 1);
                            break e;
                          }
                      }
                      ((r = i.createElement(l)), He(r, l, n), i.head.appendChild(r));
                      break;
                    default:
                      throw Error(O(468, l));
                  }
                  ((r[je] = t), Me(r), (l = r));
                }
                t.stateNode = l;
              } else ug(i, t.type, t.stateNode);
            else t.stateNode = og(i, l, t.memoizedProps);
          else
            r !== l
              ? (r === null ? n.stateNode !== null && ((n = n.stateNode), n.parentNode.removeChild(n)) : r.count--,
                l === null ? ug(i, t.type, t.stateNode) : og(i, l, t.memoizedProps))
              : l === null && t.stateNode !== null && Rc(t, t.memoizedProps, n.memoizedProps);
        }
        break;
      case 27:
        (cn(e, t),
          fn(t),
          l & 512 && (ce || n === null || Vn(n, n.return)),
          n !== null && l & 4 && Rc(t, t.memoizedProps, n.memoizedProps));
        break;
      case 5:
        if ((cn(e, t), fn(t), l & 512 && (ce || n === null || Vn(n, n.return)), t.flags & 32)) {
          i = t.stateNode;
          try {
            Sr(i, "");
          } catch (d) {
            Qt(t, t.return, d);
          }
        }
        (l & 4 && t.stateNode != null && ((i = t.memoizedProps), Rc(t, i, n !== null ? n.memoizedProps : i)),
          l & 1024 && (Dc = !0));
        break;
      case 6:
        if ((cn(e, t), fn(t), l & 4)) {
          if (t.stateNode === null) throw Error(O(162));
          ((l = t.memoizedProps), (n = t.stateNode));
          try {
            n.nodeValue = l;
          } catch (d) {
            Qt(t, t.return, d);
          }
        }
        break;
      case 3:
        if (
          ((as = null),
          (i = Ln),
          (Ln = Os(e.containerInfo)),
          cn(e, t),
          (Ln = i),
          fn(t),
          l & 4 && n !== null && n.memoizedState.isDehydrated)
        )
          try {
            Ya(e.containerInfo);
          } catch (d) {
            Qt(t, t.return, d);
          }
        Dc && ((Dc = !1), fv(t));
        break;
      case 4:
        ((l = Ln), (Ln = Os(t.stateNode.containerInfo)), cn(e, t), fn(t), (Ln = l));
        break;
      case 12:
        (cn(e, t), fn(t));
        break;
      case 13:
        (cn(e, t),
          fn(t),
          t.child.flags & 8192 && (t.memoizedState !== null) != (n !== null && n.memoizedState !== null) && (bd = Pn()),
          l & 4 && ((l = t.updateQueue), l !== null && ((t.updateQueue = null), _c(t, l))));
        break;
      case 22:
        i = t.memoizedState !== null;
        var s = n !== null && n.memoizedState !== null,
          u = rl,
          f = ce;
        if (((rl = u || i), (ce = f || s), cn(e, t), (ce = f), (rl = u), fn(t), l & 8192))
          t: for (
            e = t.stateNode,
              e._visibility = i ? e._visibility & -2 : e._visibility | 1,
              i && (n === null || s || rl || ce || ci(t)),
              n = null,
              e = t;
            ;
          ) {
            if (e.tag === 5 || e.tag === 26) {
              if (n === null) {
                s = n = e;
                try {
                  if (((r = s.stateNode), i))
                    ((a = r.style),
                      typeof a.setProperty == "function"
                        ? a.setProperty("display", "none", "important")
                        : (a.display = "none"));
                  else {
                    o = s.stateNode;
                    var c = s.memoizedProps.style,
                      m = c != null && c.hasOwnProperty("display") ? c.display : null;
                    o.style.display = m == null || typeof m == "boolean" ? "" : ("" + m).trim();
                  }
                } catch (d) {
                  Qt(s, s.return, d);
                }
              }
            } else if (e.tag === 6) {
              if (n === null) {
                s = e;
                try {
                  s.stateNode.nodeValue = i ? "" : s.memoizedProps;
                } catch (d) {
                  Qt(s, s.return, d);
                }
              }
            } else if (((e.tag !== 22 && e.tag !== 23) || e.memoizedState === null || e === t) && e.child !== null) {
              ((e.child.return = e), (e = e.child));
              continue;
            }
            if (e === t) break t;
            for (; e.sibling === null;) {
              if (e.return === null || e.return === t) break t;
              (n === e && (n = null), (e = e.return));
            }
            (n === e && (n = null), (e.sibling.return = e.return), (e = e.sibling));
          }
        l & 4 &&
          ((l = t.updateQueue), l !== null && ((n = l.retryQueue), n !== null && ((l.retryQueue = null), _c(t, n))));
        break;
      case 19:
        (cn(e, t), fn(t), l & 4 && ((l = t.updateQueue), l !== null && ((t.updateQueue = null), _c(t, l))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (cn(e, t), fn(t));
    }
  }
  function fn(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var n, l = t.return; l !== null;) {
          if (iv(l)) {
            n = l;
            break;
          }
          l = l.return;
        }
        if (n == null) throw Error(O(160));
        switch (n.tag) {
          case 27:
            var i = n.stateNode,
              r = Mc(t);
            Cs(t, r, i);
            break;
          case 5:
            var a = n.stateNode;
            n.flags & 32 && (Sr(a, ""), (n.flags &= -33));
            var o = Mc(t);
            Cs(t, o, a);
            break;
          case 3:
          case 4:
            var s = n.stateNode.containerInfo,
              u = Mc(t);
            vf(t, u, s);
            break;
          default:
            throw Error(O(161));
        }
      } catch (f) {
        Qt(t, t.return, f);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function fv(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null;) {
        var e = t;
        (fv(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), (t = t.sibling));
      }
  }
  function wl(t, e) {
    if (e.subtreeFlags & 8772) for (e = e.child; e !== null;) (av(t, e.alternate, e), (e = e.sibling));
  }
  function ci(t) {
    for (t = t.child; t !== null;) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (Vl(4, e, e.return), ci(e));
          break;
        case 1:
          Vn(e, e.return);
          var n = e.stateNode;
          (typeof n.componentWillUnmount == "function" && nv(e, e.return, n), ci(e));
          break;
        case 27:
          Na(e.stateNode);
        case 26:
        case 5:
          (Vn(e, e.return), ci(e));
          break;
        case 22:
          e.memoizedState === null && ci(e);
          break;
        case 30:
          ci(e);
          break;
        default:
          ci(e);
      }
      t = t.sibling;
    }
  }
  function Tl(t, e, n) {
    for (n = n && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null;) {
      var l = e.alternate,
        i = t,
        r = e,
        a = r.flags;
      switch (r.tag) {
        case 0:
        case 11:
        case 15:
          (Tl(i, r, n), eo(4, r));
          break;
        case 1:
          if ((Tl(i, r, n), (l = r), (i = l.stateNode), typeof i.componentDidMount == "function"))
            try {
              i.componentDidMount();
            } catch (u) {
              Qt(l, l.return, u);
            }
          if (((l = r), (i = l.updateQueue), i !== null)) {
            var o = l.stateNode;
            try {
              var s = i.shared.hiddenCallbacks;
              if (s !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < s.length; i++) ay(s[i], o);
            } catch (u) {
              Qt(l, l.return, u);
            }
          }
          (n && a & 64 && ev(r), Ta(r, r.return));
          break;
        case 27:
          rv(r);
        case 26:
        case 5:
          (Tl(i, r, n), n && l === null && a & 4 && lv(r), Ta(r, r.return));
          break;
        case 12:
          Tl(i, r, n);
          break;
        case 13:
          (Tl(i, r, n), n && a & 4 && uv(i, r));
          break;
        case 22:
          (r.memoizedState === null && Tl(i, r, n), Ta(r, r.return));
          break;
        case 30:
          break;
        default:
          Tl(i, r, n);
      }
      e = e.sibling;
    }
  }
  function hd(t, e) {
    var n = null;
    (t !== null &&
      t.memoizedState !== null &&
      t.memoizedState.cachePool !== null &&
      (n = t.memoizedState.cachePool.pool),
      (t = null),
      e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool),
      t !== n && (t != null && t.refCount++, n != null && Ja(n)));
  }
  function gd(t, e) {
    ((t = null),
      e.alternate !== null && (t = e.alternate.memoizedState.cache),
      (e = e.memoizedState.cache),
      e !== t && (e.refCount++, t != null && Ja(t)));
  }
  function Yn(t, e, n, l) {
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) (dv(t, e, n, l), (e = e.sibling));
  }
  function dv(t, e, n, l) {
    var i = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (Yn(t, e, n, l), i & 2048 && eo(9, e));
        break;
      case 1:
        Yn(t, e, n, l);
        break;
      case 3:
        (Yn(t, e, n, l),
          i & 2048 &&
            ((t = null),
            e.alternate !== null && (t = e.alternate.memoizedState.cache),
            (e = e.memoizedState.cache),
            e !== t && (e.refCount++, t != null && Ja(t))));
        break;
      case 12:
        if (i & 2048) {
          (Yn(t, e, n, l), (t = e.stateNode));
          try {
            var r = e.memoizedProps,
              a = r.id,
              o = r.onPostCommit;
            typeof o == "function" && o(a, e.alternate === null ? "mount" : "update", t.passiveEffectDuration, -0);
          } catch (s) {
            Qt(e, e.return, s);
          }
        } else Yn(t, e, n, l);
        break;
      case 13:
        Yn(t, e, n, l);
        break;
      case 23:
        break;
      case 22:
        ((r = e.stateNode),
          (a = e.alternate),
          e.memoizedState !== null
            ? r._visibility & 2
              ? Yn(t, e, n, l)
              : Ea(t, e)
            : r._visibility & 2
              ? Yn(t, e, n, l)
              : ((r._visibility |= 2), $i(t, e, n, l, (e.subtreeFlags & 10256) !== 0)),
          i & 2048 && hd(a, e));
        break;
      case 24:
        (Yn(t, e, n, l), i & 2048 && gd(e.alternate, e));
        break;
      default:
        Yn(t, e, n, l);
    }
  }
  function $i(t, e, n, l, i) {
    for (i = i && (e.subtreeFlags & 10256) !== 0, e = e.child; e !== null;) {
      var r = t,
        a = e,
        o = n,
        s = l,
        u = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          ($i(r, a, o, s, i), eo(8, a));
          break;
        case 23:
          break;
        case 22:
          var f = a.stateNode;
          (a.memoizedState !== null
            ? f._visibility & 2
              ? $i(r, a, o, s, i)
              : Ea(r, a)
            : ((f._visibility |= 2), $i(r, a, o, s, i)),
            i && u & 2048 && hd(a.alternate, a));
          break;
        case 24:
          ($i(r, a, o, s, i), i && u & 2048 && gd(a.alternate, a));
          break;
        default:
          $i(r, a, o, s, i);
      }
      e = e.sibling;
    }
  }
  function Ea(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null;) {
        var n = t,
          l = e,
          i = l.flags;
        switch (l.tag) {
          case 22:
            (Ea(n, l), i & 2048 && hd(l.alternate, l));
            break;
          case 24:
            (Ea(n, l), i & 2048 && gd(l.alternate, l));
            break;
          default:
            Ea(n, l);
        }
        e = e.sibling;
      }
  }
  var pa = 8192;
  function Zi(t) {
    if (t.subtreeFlags & pa) for (t = t.child; t !== null;) (mv(t), (t = t.sibling));
  }
  function mv(t) {
    switch (t.tag) {
      case 26:
        (Zi(t), t.flags & pa && t.memoizedState !== null && xw(Ln, t.memoizedState, t.memoizedProps));
        break;
      case 5:
        Zi(t);
        break;
      case 3:
      case 4:
        var e = Ln;
        ((Ln = Os(t.stateNode.containerInfo)), Zi(t), (Ln = e));
        break;
      case 22:
        t.memoizedState === null &&
          ((e = t.alternate),
          e !== null && e.memoizedState !== null ? ((e = pa), (pa = 16777216), Zi(t), (pa = e)) : Zi(t));
        break;
      default:
        Zi(t);
    }
  }
  function pv(t) {
    var e = t.alternate;
    if (e !== null && ((t = e.child), t !== null)) {
      e.child = null;
      do ((e = t.sibling), (t.sibling = null), (t = e));
      while (t !== null);
    }
  }
  function sa(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var l = e[n];
          ((Re = l), gv(l, t));
        }
      pv(t);
    }
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) (hv(t), (t = t.sibling));
  }
  function hv(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (sa(t), t.flags & 2048 && Vl(9, t, t.return));
        break;
      case 3:
        sa(t);
        break;
      case 12:
        sa(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13)
          ? ((e._visibility &= -3), is(t))
          : sa(t);
        break;
      default:
        sa(t);
    }
  }
  function is(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var l = e[n];
          ((Re = l), gv(l, t));
        }
      pv(t);
    }
    for (t = t.child; t !== null;) {
      switch (((e = t), e.tag)) {
        case 0:
        case 11:
        case 15:
          (Vl(8, e, e.return), is(e));
          break;
        case 22:
          ((n = e.stateNode), n._visibility & 2 && ((n._visibility &= -3), is(e)));
          break;
        default:
          is(e);
      }
      t = t.sibling;
    }
  }
  function gv(t, e) {
    for (; Re !== null;) {
      var n = Re;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Vl(8, n, e);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var l = n.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          Ja(n.memoizedState.cache);
      }
      if (((l = n.child), l !== null)) ((l.return = n), (Re = l));
      else
        t: for (n = t; Re !== null;) {
          l = Re;
          var i = l.sibling,
            r = l.return;
          if ((ov(l), l === n)) {
            Re = null;
            break t;
          }
          if (i !== null) {
            ((i.return = r), (Re = i));
            break t;
          }
          Re = r;
        }
    }
  }
  var HS = {
      getCacheForType: function (t) {
        var e = Ye(ke),
          n = e.data.get(t);
        return (n === void 0 && ((n = t()), e.data.set(t, n)), n);
      },
    },
    qS = typeof WeakMap == "function" ? WeakMap : Map,
    qt = 0,
    Gt = null,
    bt = null,
    Ct = 0,
    Ht = 0,
    dn = null,
    Ol = !1,
    zr = !1,
    yd = !1,
    gl = 0,
    re = 0,
    Ql = 0,
    gi = 0,
    vd = 0,
    Mn = 0,
    Ar = 0,
    Ca = null,
    rn = null,
    bf = !1,
    bd = 0,
    As = 1 / 0,
    Ns = null,
    Hl = null,
    Be = 0,
    ql = null,
    Nr = null,
    br = 0,
    xf = 0,
    kf = null,
    yv = null,
    Aa = 0,
    Sf = null;
  function gn() {
    if ((qt & 2) !== 0 && Ct !== 0) return Ct & -Ct;
    if (at.T !== null) {
      var t = wr;
      return t !== 0 ? t : kd();
    }
    return Ng();
  }
  function vv() {
    Mn === 0 && (Mn = (Ct & 536870912) === 0 || zt ? Tg() : 536870912);
    var t = Dn.current;
    return (t !== null && (t.flags |= 32), Mn);
  }
  function yn(t, e, n) {
    (((t === Gt && (Ht === 2 || Ht === 9)) || t.cancelPendingCommit !== null) && (Rr(t, 0), zl(t, Ct, Mn, !1)),
      Pa(t, n),
      ((qt & 2) === 0 || t !== Gt) &&
        (t === Gt && ((qt & 2) === 0 && (gi |= n), re === 4 && zl(t, Ct, Mn, !1)), Zn(t)));
  }
  function bv(t, e, n) {
    if ((qt & 6) !== 0) throw Error(O(327));
    var l = (!n && (e & 124) === 0 && (e & t.expiredLanes) === 0) || Qa(t, e),
      i = l ? YS(t, e) : Oc(t, e, !0),
      r = l;
    do {
      if (i === 0) {
        zr && !l && zl(t, e, 0, !1);
        break;
      } else {
        if (((n = t.current.alternate), r && !IS(n))) {
          ((i = Oc(t, e, !1)), (r = !1));
          continue;
        }
        if (i === 2) {
          if (((r = e), t.errorRecoveryDisabledLanes & r)) var a = 0;
          else ((a = t.pendingLanes & -536870913), (a = a !== 0 ? a : a & 536870912 ? 536870912 : 0));
          if (a !== 0) {
            e = a;
            t: {
              var o = t;
              i = Ca;
              var s = o.current.memoizedState.isDehydrated;
              if ((s && (Rr(o, a).flags |= 256), (a = Oc(o, a, !1)), a !== 2)) {
                if (yd && !s) {
                  ((o.errorRecoveryDisabledLanes |= r), (gi |= r), (i = 4));
                  break t;
                }
                ((r = rn), (rn = i), r !== null && (rn === null ? (rn = r) : rn.push.apply(rn, r)));
              }
              i = a;
            }
            if (((r = !1), i !== 2)) continue;
          }
        }
        if (i === 1) {
          (Rr(t, 0), zl(t, e, 0, !0));
          break;
        }
        t: {
          switch (((l = t), (r = i), r)) {
            case 0:
            case 1:
              throw Error(O(345));
            case 4:
              if ((e & 4194048) !== e) break;
            case 6:
              zl(l, e, Mn, !Ol);
              break t;
            case 2:
              rn = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(O(329));
          }
          if ((e & 62914560) === e && ((i = bd + 300 - Pn()), 10 < i)) {
            if ((zl(l, e, Mn, !Ol), Hs(l, 0, !0) !== 0)) break t;
            l.timeoutHandle = Hv(Vh.bind(null, l, n, rn, Ns, bf, e, Mn, gi, Ar, Ol, r, 2, -0, 0), i);
            break t;
          }
          Vh(l, n, rn, Ns, bf, e, Mn, gi, Ar, Ol, r, 0, -0, 0);
        }
      }
      break;
    } while (!0);
    Zn(t);
  }
  function Vh(t, e, n, l, i, r, a, o, s, u, f, c, m, d) {
    if (
      ((t.timeoutHandle = -1),
      (c = e.subtreeFlags),
      (c & 8192 || (c & 16785408) === 16785408) &&
        ((Ha = { stylesheets: null, count: 0, unsuspend: bw }), mv(e), (c = kw()), c !== null))
    ) {
      ((t.cancelPendingCommit = c(Ph.bind(null, t, e, r, n, l, i, a, o, s, f, 1, m, d))), zl(t, r, a, !u));
      return;
    }
    Ph(t, e, r, n, l, i, a, o, s);
  }
  function IS(t) {
    for (var e = t; ;) {
      var n = e.tag;
      if (
        (n === 0 || n === 11 || n === 15) &&
        e.flags & 16384 &&
        ((n = e.updateQueue), n !== null && ((n = n.stores), n !== null))
      )
        for (var l = 0; l < n.length; l++) {
          var i = n[l],
            r = i.getSnapshot;
          i = i.value;
          try {
            if (!vn(r(), i)) return !1;
          } catch {
            return !1;
          }
        }
      if (((n = e.child), e.subtreeFlags & 16384 && n !== null)) ((n.return = e), (e = n));
      else {
        if (e === t) break;
        for (; e.sibling === null;) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    }
    return !0;
  }
  function zl(t, e, n, l) {
    ((e &= ~vd),
      (e &= ~gi),
      (t.suspendedLanes |= e),
      (t.pingedLanes &= ~e),
      l && (t.warmLanes |= e),
      (l = t.expirationTimes));
    for (var i = e; 0 < i;) {
      var r = 31 - hn(i),
        a = 1 << r;
      ((l[r] = -1), (i &= ~a));
    }
    n !== 0 && Cg(t, n, e);
  }
  function Xs() {
    return (qt & 6) === 0 ? (no(0, !1), !1) : !0;
  }
  function xd() {
    if (bt !== null) {
      if (Ht === 0) var t = bt.return;
      else ((t = bt), (ul = Ei = null), ad(t), (vr = null), (La = 0), (t = bt));
      for (; t !== null;) (tv(t.alternate, t), (t = t.return));
      bt = null;
    }
  }
  function Rr(t, e) {
    var n = t.timeoutHandle;
    (n !== -1 && ((t.timeoutHandle = -1), nw(n)),
      (n = t.cancelPendingCommit),
      n !== null && ((t.cancelPendingCommit = null), n()),
      xd(),
      (Gt = t),
      (bt = n = fl(t.current, null)),
      (Ct = e),
      (Ht = 0),
      (dn = null),
      (Ol = !1),
      (zr = Qa(t, e)),
      (yd = !1),
      (Ar = Mn = vd = gi = Ql = re = 0),
      (rn = Ca = null),
      (bf = !1),
      (e & 8) !== 0 && (e |= e & 32));
    var l = t.entangledLanes;
    if (l !== 0)
      for (t = t.entanglements, l &= e; 0 < l;) {
        var i = 31 - hn(l),
          r = 1 << i;
        ((e |= t[i]), (l &= ~r));
      }
    return ((gl = e), Ys(), n);
  }
  function xv(t, e) {
    ((ht = null),
      (at.H = ks),
      e === $a || e === Vs
        ? ((e = Sh()), (Ht = 3))
        : e === iy
          ? ((e = Sh()), (Ht = 4))
          : (Ht = e === Xy ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1),
      (dn = e),
      bt === null && ((re = 1), Ts(t, Rn(e, t.current))));
  }
  function kv() {
    var t = at.H;
    return ((at.H = ks), t === null ? ks : t);
  }
  function Sv() {
    var t = at.A;
    return ((at.A = HS), t);
  }
  function wf() {
    ((re = 4),
      Ol || ((Ct & 4194048) !== Ct && Dn.current !== null) || (zr = !0),
      ((Ql & 134217727) === 0 && (gi & 134217727) === 0) || Gt === null || zl(Gt, Ct, Mn, !1));
  }
  function Oc(t, e, n) {
    var l = qt;
    qt |= 2;
    var i = kv(),
      r = Sv();
    ((Gt !== t || Ct !== e) && ((Ns = null), Rr(t, e)), (e = !1));
    var a = re;
    t: do
      try {
        if (Ht !== 0 && bt !== null) {
          var o = bt,
            s = dn;
          switch (Ht) {
            case 8:
              (xd(), (a = 6));
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              Dn.current === null && (e = !0);
              var u = Ht;
              if (((Ht = 0), (dn = null), fr(t, o, s, u), n && zr)) {
                a = 0;
                break t;
              }
              break;
            default:
              ((u = Ht), (Ht = 0), (dn = null), fr(t, o, s, u));
          }
        }
        (jS(), (a = re));
        break;
      } catch (f) {
        xv(t, f);
      }
    while (!0);
    return (
      e && t.shellSuspendCounter++,
      (ul = Ei = null),
      (qt = l),
      (at.H = i),
      (at.A = r),
      bt === null && ((Gt = null), (Ct = 0), Ys()),
      a
    );
  }
  function jS() {
    for (; bt !== null;) wv(bt);
  }
  function YS(t, e) {
    var n = qt;
    qt |= 2;
    var l = kv(),
      i = Sv();
    Gt !== t || Ct !== e ? ((Ns = null), (As = Pn() + 500), Rr(t, e)) : (zr = Qa(t, e));
    t: do
      try {
        if (Ht !== 0 && bt !== null) {
          e = bt;
          var r = dn;
          e: switch (Ht) {
            case 1:
              ((Ht = 0), (dn = null), fr(t, e, r, 1));
              break;
            case 2:
            case 9:
              if (kh(r)) {
                ((Ht = 0), (dn = null), Qh(e));
                break;
              }
              ((e = function () {
                ((Ht !== 2 && Ht !== 9) || Gt !== t || (Ht = 7), Zn(t));
              }),
                r.then(e, e));
              break t;
            case 3:
              Ht = 7;
              break t;
            case 4:
              Ht = 5;
              break t;
            case 7:
              kh(r) ? ((Ht = 0), (dn = null), Qh(e)) : ((Ht = 0), (dn = null), fr(t, e, r, 7));
              break;
            case 5:
              var a = null;
              switch (bt.tag) {
                case 26:
                  a = bt.memoizedState;
                case 5:
                case 27:
                  var o = bt;
                  if (!a || Yv(a)) {
                    ((Ht = 0), (dn = null));
                    var s = o.sibling;
                    if (s !== null) bt = s;
                    else {
                      var u = o.return;
                      u !== null ? ((bt = u), Zs(u)) : (bt = null);
                    }
                    break e;
                  }
              }
              ((Ht = 0), (dn = null), fr(t, e, r, 5));
              break;
            case 6:
              ((Ht = 0), (dn = null), fr(t, e, r, 6));
              break;
            case 8:
              (xd(), (re = 6));
              break t;
            default:
              throw Error(O(462));
          }
        }
        FS();
        break;
      } catch (f) {
        xv(t, f);
      }
    while (!0);
    return ((ul = Ei = null), (at.H = l), (at.A = i), (qt = n), bt !== null ? 0 : ((Gt = null), (Ct = 0), Ys(), re));
  }
  function FS() {
    for (; bt !== null && !fk();) wv(bt);
  }
  function wv(t) {
    var e = Wy(t.alternate, t, gl);
    ((t.memoizedProps = t.pendingProps), e === null ? Zs(t) : (bt = e));
  }
  function Qh(t) {
    var e = t,
      n = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = Hh(n, e, e.pendingProps, e.type, void 0, Ct);
        break;
      case 11:
        e = Hh(n, e, e.pendingProps, e.type.render, e.ref, Ct);
        break;
      case 5:
        ad(e);
      default:
        (tv(n, e), (e = bt = ty(e, gl)), (e = Wy(n, e, gl)));
    }
    ((t.memoizedProps = t.pendingProps), e === null ? Zs(t) : (bt = e));
  }
  function fr(t, e, n, l) {
    ((ul = Ei = null), ad(e), (vr = null), (La = 0));
    var i = e.return;
    try {
      if (_S(t, i, e, n, Ct)) {
        ((re = 1), Ts(t, Rn(n, t.current)), (bt = null));
        return;
      }
    } catch (r) {
      if (i !== null) throw ((bt = i), r);
      ((re = 1), Ts(t, Rn(n, t.current)), (bt = null));
      return;
    }
    e.flags & 32768
      ? (zt || l === 1
          ? (t = !0)
          : zr || (Ct & 536870912) !== 0
            ? (t = !1)
            : ((Ol = t = !0),
              (l === 2 || l === 9 || l === 3 || l === 6) &&
                ((l = Dn.current), l !== null && l.tag === 13 && (l.flags |= 16384))),
        Tv(e, t))
      : Zs(e);
  }
  function Zs(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        Tv(e, Ol);
        return;
      }
      t = e.return;
      var n = zS(e.alternate, e, gl);
      if (n !== null) {
        bt = n;
        return;
      }
      if (((e = e.sibling), e !== null)) {
        bt = e;
        return;
      }
      bt = e = t;
    } while (e !== null);
    re === 0 && (re = 5);
  }
  function Tv(t, e) {
    do {
      var n = LS(t.alternate, t);
      if (n !== null) {
        ((n.flags &= 32767), (bt = n));
        return;
      }
      if (
        ((n = t.return),
        n !== null && ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
        !e && ((t = t.sibling), t !== null))
      ) {
        bt = t;
        return;
      }
      bt = t = n;
    } while (t !== null);
    ((re = 6), (bt = null));
  }
  function Ph(t, e, n, l, i, r, a, o, s) {
    t.cancelPendingCommit = null;
    do Ks();
    while (Be !== 0);
    if ((qt & 6) !== 0) throw Error(O(327));
    if (e !== null) {
      if (e === t.current) throw Error(O(177));
      if (
        ((r = e.lanes | e.childLanes),
        (r |= Gf),
        kk(t, n, r, a, o, s),
        t === Gt && ((bt = Gt = null), (Ct = 0)),
        (Nr = e),
        (ql = t),
        (br = n),
        (xf = r),
        (kf = i),
        (yv = l),
        (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
          ? ((t.callbackNode = null),
            (t.callbackPriority = 0),
            GS(fs, function () {
              return (Rv(!0), null);
            }))
          : ((t.callbackNode = null), (t.callbackPriority = 0)),
        (l = (e.flags & 13878) !== 0),
        (e.subtreeFlags & 13878) !== 0 || l)
      ) {
        ((l = at.T), (at.T = null), (i = Lt.p), (Lt.p = 2), (a = qt), (qt |= 4));
        try {
          US(t, e, n);
        } finally {
          ((qt = a), (Lt.p = i), (at.T = l));
        }
      }
      ((Be = 1), Ev(), Cv(), Av());
    }
  }
  function Ev() {
    if (Be === 1) {
      Be = 0;
      var t = ql,
        e = Nr,
        n = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || n) {
        ((n = at.T), (at.T = null));
        var l = Lt.p;
        Lt.p = 2;
        var i = qt;
        qt |= 4;
        try {
          cv(e, t);
          var r = Af,
            a = Pg(t.containerInfo),
            o = r.focusedElem,
            s = r.selectionRange;
          if (a !== o && o && o.ownerDocument && Qg(o.ownerDocument.documentElement, o)) {
            if (s !== null && Pf(o)) {
              var u = s.start,
                f = s.end;
              if ((f === void 0 && (f = u), "selectionStart" in o))
                ((o.selectionStart = u), (o.selectionEnd = Math.min(f, o.value.length)));
              else {
                var c = o.ownerDocument || document,
                  m = (c && c.defaultView) || window;
                if (m.getSelection) {
                  var d = m.getSelection(),
                    g = o.textContent.length,
                    x = Math.min(s.start, g),
                    C = s.end === void 0 ? x : Math.min(s.end, g);
                  !d.extend && x > C && ((a = C), (C = x), (x = a));
                  var h = mh(o, x),
                    p = mh(o, C);
                  if (
                    h &&
                    p &&
                    (d.rangeCount !== 1 ||
                      d.anchorNode !== h.node ||
                      d.anchorOffset !== h.offset ||
                      d.focusNode !== p.node ||
                      d.focusOffset !== p.offset)
                  ) {
                    var y = c.createRange();
                    (y.setStart(h.node, h.offset),
                      d.removeAllRanges(),
                      x > C
                        ? (d.addRange(y), d.extend(p.node, p.offset))
                        : (y.setEnd(p.node, p.offset), d.addRange(y)));
                  }
                }
              }
            }
            for (c = [], d = o; (d = d.parentNode);)
              d.nodeType === 1 && c.push({ element: d, left: d.scrollLeft, top: d.scrollTop });
            for (typeof o.focus == "function" && o.focus(), o = 0; o < c.length; o++) {
              var T = c[o];
              ((T.element.scrollLeft = T.left), (T.element.scrollTop = T.top));
            }
          }
          ((Us = !!Cf), (Af = Cf = null));
        } finally {
          ((qt = i), (Lt.p = l), (at.T = n));
        }
      }
      ((t.current = e), (Be = 2));
    }
  }
  function Cv() {
    if (Be === 2) {
      Be = 0;
      var t = ql,
        e = Nr,
        n = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || n) {
        ((n = at.T), (at.T = null));
        var l = Lt.p;
        Lt.p = 2;
        var i = qt;
        qt |= 4;
        try {
          av(t, e.alternate, e);
        } finally {
          ((qt = i), (Lt.p = l), (at.T = n));
        }
      }
      Be = 3;
    }
  }
  function Av() {
    if (Be === 4 || Be === 3) {
      ((Be = 0), dk());
      var t = ql,
        e = Nr,
        n = br,
        l = yv;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0
        ? (Be = 5)
        : ((Be = 0), (Nr = ql = null), Nv(t, t.pendingLanes));
      var i = t.pendingLanes;
      if ((i === 0 && (Hl = null), qf(n), (e = e.stateNode), pn && typeof pn.onCommitFiberRoot == "function"))
        try {
          pn.onCommitFiberRoot(Va, e, void 0, (e.current.flags & 128) === 128);
        } catch {}
      if (l !== null) {
        ((e = at.T), (i = Lt.p), (Lt.p = 2), (at.T = null));
        try {
          for (var r = t.onRecoverableError, a = 0; a < l.length; a++) {
            var o = l[a];
            r(o.value, { componentStack: o.stack });
          }
        } finally {
          ((at.T = e), (Lt.p = i));
        }
      }
      ((br & 3) !== 0 && Ks(),
        Zn(t),
        (i = t.pendingLanes),
        (n & 4194090) !== 0 && (i & 42) !== 0 ? (t === Sf ? Aa++ : ((Aa = 0), (Sf = t))) : (Aa = 0),
        no(0, !1));
    }
  }
  function Nv(t, e) {
    (t.pooledCacheLanes &= e) === 0 && ((e = t.pooledCache), e != null && ((t.pooledCache = null), Ja(e)));
  }
  function Ks(t) {
    return (Ev(), Cv(), Av(), Rv(t));
  }
  function Rv() {
    if (Be !== 5) return !1;
    var t = ql,
      e = xf;
    xf = 0;
    var n = qf(br),
      l = at.T,
      i = Lt.p;
    try {
      ((Lt.p = 32 > n ? 32 : n), (at.T = null), (n = kf), (kf = null));
      var r = ql,
        a = br;
      if (((Be = 0), (Nr = ql = null), (br = 0), (qt & 6) !== 0)) throw Error(O(331));
      var o = qt;
      if (
        ((qt |= 4),
        hv(r.current),
        dv(r, r.current, a, n),
        (qt = o),
        no(0, !1),
        pn && typeof pn.onPostCommitFiberRoot == "function")
      )
        try {
          pn.onPostCommitFiberRoot(Va, r);
        } catch {}
      return !0;
    } finally {
      ((Lt.p = i), (at.T = l), Nv(t, e));
    }
  }
  function Gh(t, e, n) {
    ((e = Rn(n, e)), (e = hf(t.stateNode, e, 2)), (t = Bl(t, e, 2)), t !== null && (Pa(t, 2), Zn(t)));
  }
  function Qt(t, e, n) {
    if (t.tag === 3) Gh(t, t, n);
    else
      for (; e !== null;) {
        if (e.tag === 3) {
          Gh(e, t, n);
          break;
        } else if (e.tag === 1) {
          var l = e.stateNode;
          if (
            typeof e.type.getDerivedStateFromError == "function" ||
            (typeof l.componentDidCatch == "function" && (Hl === null || !Hl.has(l)))
          ) {
            ((t = Rn(n, t)), (n = Py(2)), (l = Bl(e, n, 2)), l !== null && (Gy(n, l, e, t), Pa(l, 2), Zn(l)));
            break;
          }
        }
        e = e.return;
      }
  }
  function zc(t, e, n) {
    var l = t.pingCache;
    if (l === null) {
      l = t.pingCache = new qS();
      var i = new Set();
      l.set(e, i);
    } else ((i = l.get(e)), i === void 0 && ((i = new Set()), l.set(e, i)));
    i.has(n) || ((yd = !0), i.add(n), (t = VS.bind(null, t, e, n)), e.then(t, t));
  }
  function VS(t, e, n) {
    var l = t.pingCache;
    (l !== null && l.delete(e),
      (t.pingedLanes |= t.suspendedLanes & n),
      (t.warmLanes &= ~n),
      Gt === t &&
        (Ct & n) === n &&
        (re === 4 || (re === 3 && (Ct & 62914560) === Ct && 300 > Pn() - bd) ? (qt & 2) === 0 && Rr(t, 0) : (vd |= n),
        Ar === Ct && (Ar = 0)),
      Zn(t));
  }
  function Mv(t, e) {
    (e === 0 && (e = Eg()), (t = Or(t, e)), t !== null && (Pa(t, e), Zn(t)));
  }
  function QS(t) {
    var e = t.memoizedState,
      n = 0;
    (e !== null && (n = e.retryLane), Mv(t, n));
  }
  function PS(t, e) {
    var n = 0;
    switch (t.tag) {
      case 13:
        var l = t.stateNode,
          i = t.memoizedState;
        i !== null && (n = i.retryLane);
        break;
      case 19:
        l = t.stateNode;
        break;
      case 22:
        l = t.stateNode._retryCache;
        break;
      default:
        throw Error(O(314));
    }
    (l !== null && l.delete(e), Mv(t, n));
  }
  function GS(t, e) {
    return Bf(t, e);
  }
  var Rs = null,
    Wi = null,
    Tf = !1,
    Ms = !1,
    Lc = !1,
    yi = 0;
  function Zn(t) {
    (t !== Wi && t.next === null && (Wi === null ? (Rs = Wi = t) : (Wi = Wi.next = t)),
      (Ms = !0),
      Tf || ((Tf = !0), ZS()));
  }
  function no(t, e) {
    if (!Lc && Ms) {
      Lc = !0;
      do
        for (var n = !1, l = Rs; l !== null;) {
          if (!e)
            if (t !== 0) {
              var i = l.pendingLanes;
              if (i === 0) var r = 0;
              else {
                var a = l.suspendedLanes,
                  o = l.pingedLanes;
                ((r = (1 << (31 - hn(42 | t) + 1)) - 1),
                  (r &= i & ~(a & ~o)),
                  (r = r & 201326741 ? (r & 201326741) | 1 : r ? r | 2 : 0));
              }
              r !== 0 && ((n = !0), Xh(l, r));
            } else
              ((r = Ct),
                (r = Hs(l, l === Gt ? r : 0, l.cancelPendingCommit !== null || l.timeoutHandle !== -1)),
                (r & 3) === 0 || Qa(l, r) || ((n = !0), Xh(l, r)));
          l = l.next;
        }
      while (n);
      Lc = !1;
    }
  }
  function XS() {
    Dv();
  }
  function Dv() {
    Ms = Tf = !1;
    var t = 0;
    yi !== 0 && (ew() && (t = yi), (yi = 0));
    for (var e = Pn(), n = null, l = Rs; l !== null;) {
      var i = l.next,
        r = _v(l, e);
      (r === 0
        ? ((l.next = null), n === null ? (Rs = i) : (n.next = i), i === null && (Wi = n))
        : ((n = l), (t !== 0 || (r & 3) !== 0) && (Ms = !0)),
        (l = i));
    }
    no(t, !1);
  }
  function _v(t, e) {
    for (var n = t.suspendedLanes, l = t.pingedLanes, i = t.expirationTimes, r = t.pendingLanes & -62914561; 0 < r;) {
      var a = 31 - hn(r),
        o = 1 << a,
        s = i[a];
      (s === -1 ? ((o & n) === 0 || (o & l) !== 0) && (i[a] = xk(o, e)) : s <= e && (t.expiredLanes |= o), (r &= ~o));
    }
    if (
      ((e = Gt),
      (n = Ct),
      (n = Hs(t, t === e ? n : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
      (l = t.callbackNode),
      n === 0 || (t === e && (Ht === 2 || Ht === 9)) || t.cancelPendingCommit !== null)
    )
      return (l !== null && l !== null && sc(l), (t.callbackNode = null), (t.callbackPriority = 0));
    if ((n & 3) === 0 || Qa(t, n)) {
      if (((e = n & -n), e === t.callbackPriority)) return e;
      switch ((l !== null && sc(l), qf(n))) {
        case 2:
        case 8:
          n = Sg;
          break;
        case 32:
          n = fs;
          break;
        case 268435456:
          n = wg;
          break;
        default:
          n = fs;
      }
      return ((l = Ov.bind(null, t)), (n = Bf(n, l)), (t.callbackPriority = e), (t.callbackNode = n), e);
    }
    return (l !== null && l !== null && sc(l), (t.callbackPriority = 2), (t.callbackNode = null), 2);
  }
  function Ov(t, e) {
    if (Be !== 0 && Be !== 5) return ((t.callbackNode = null), (t.callbackPriority = 0), null);
    var n = t.callbackNode;
    if (Ks(!0) && t.callbackNode !== n) return null;
    var l = Ct;
    return (
      (l = Hs(t, t === Gt ? l : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1)),
      l === 0
        ? null
        : (bv(t, l, e), _v(t, Pn()), t.callbackNode != null && t.callbackNode === n ? Ov.bind(null, t) : null)
    );
  }
  function Xh(t, e) {
    if (Ks()) return null;
    bv(t, e, !0);
  }
  function ZS() {
    lw(function () {
      (qt & 6) !== 0 ? Bf(kg, XS) : Dv();
    });
  }
  function kd() {
    return (yi === 0 && (yi = Tg()), yi);
  }
  function Zh(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : Ko("" + t);
  }
  function Kh(t, e) {
    var n = e.ownerDocument.createElement("input");
    return (
      (n.name = e.name),
      (n.value = e.value),
      t.id && n.setAttribute("form", t.id),
      e.parentNode.insertBefore(n, e),
      (t = new FormData(t)),
      n.parentNode.removeChild(n),
      t
    );
  }
  function KS(t, e, n, l, i) {
    if (e === "submit" && n && n.stateNode === i) {
      var r = Zh((i[an] || null).action),
        a = l.submitter;
      a &&
        ((e = (e = a[an] || null) ? Zh(e.formAction) : a.getAttribute("formAction")),
        e !== null && ((r = e), (a = null)));
      var o = new qs("action", "action", null, l, i);
      t.push({
        event: o,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (l.defaultPrevented) {
                if (yi !== 0) {
                  var s = a ? Kh(i, a) : new FormData(i);
                  mf(n, { pending: !0, data: s, method: i.method, action: r }, null, s);
                }
              } else
                typeof r == "function" &&
                  (o.preventDefault(),
                  (s = a ? Kh(i, a) : new FormData(i)),
                  mf(n, { pending: !0, data: s, method: i.method, action: r }, r, s));
            },
            currentTarget: i,
          },
        ],
      });
    }
  }
  for (Vo = 0; Vo < tf.length; Vo++)
    ((Qo = tf[Vo]), (Jh = Qo.toLowerCase()), ($h = Qo[0].toUpperCase() + Qo.slice(1)), Bn(Jh, "on" + $h));
  var Qo, Jh, $h, Vo;
  Bn(Xg, "onAnimationEnd");
  Bn(Zg, "onAnimationIteration");
  Bn(Kg, "onAnimationStart");
  Bn("dblclick", "onDoubleClick");
  Bn("focusin", "onFocus");
  Bn("focusout", "onBlur");
  Bn(hS, "onTransitionRun");
  Bn(gS, "onTransitionStart");
  Bn(yS, "onTransitionCancel");
  Bn(Jg, "onTransitionEnd");
  kr("onMouseEnter", ["mouseout", "mouseover"]);
  kr("onMouseLeave", ["mouseout", "mouseover"]);
  kr("onPointerEnter", ["pointerout", "pointerover"]);
  kr("onPointerLeave", ["pointerout", "pointerover"]);
  Si("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  Si("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  Si("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
  Si("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  Si("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  Si("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Ua =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    JS = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Ua));
  function zv(t, e) {
    e = (e & 4) !== 0;
    for (var n = 0; n < t.length; n++) {
      var l = t[n],
        i = l.event;
      l = l.listeners;
      t: {
        var r = void 0;
        if (e)
          for (var a = l.length - 1; 0 <= a; a--) {
            var o = l[a],
              s = o.instance,
              u = o.currentTarget;
            if (((o = o.listener), s !== r && i.isPropagationStopped())) break t;
            ((r = o), (i.currentTarget = u));
            try {
              r(i);
            } catch (f) {
              ws(f);
            }
            ((i.currentTarget = null), (r = s));
          }
        else
          for (a = 0; a < l.length; a++) {
            if (
              ((o = l[a]),
              (s = o.instance),
              (u = o.currentTarget),
              (o = o.listener),
              s !== r && i.isPropagationStopped())
            )
              break t;
            ((r = o), (i.currentTarget = u));
            try {
              r(i);
            } catch (f) {
              ws(f);
            }
            ((i.currentTarget = null), (r = s));
          }
      }
    }
  }
  function vt(t, e) {
    var n = e[Gc];
    n === void 0 && (n = e[Gc] = new Set());
    var l = t + "__bubble";
    n.has(l) || (Lv(e, t, 2, !1), n.add(l));
  }
  function Uc(t, e, n) {
    var l = 0;
    (e && (l |= 4), Lv(n, t, l, e));
  }
  var Po = "_reactListening" + Math.random().toString(36).slice(2);
  function Sd(t) {
    if (!t[Po]) {
      ((t[Po] = !0),
        Rg.forEach(function (n) {
          n !== "selectionchange" && (JS.has(n) || Uc(n, !1, t), Uc(n, !0, t));
        }));
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Po] || ((e[Po] = !0), Uc("selectionchange", !1, e));
    }
  }
  function Lv(t, e, n, l) {
    switch (Gv(e)) {
      case 2:
        var i = Tw;
        break;
      case 8:
        i = Ew;
        break;
      default:
        i = Cd;
    }
    ((n = i.bind(null, e, n, t)),
      (i = void 0),
      !Jc || (e !== "touchstart" && e !== "touchmove" && e !== "wheel") || (i = !0),
      l
        ? i !== void 0
          ? t.addEventListener(e, n, { capture: !0, passive: i })
          : t.addEventListener(e, n, !0)
        : i !== void 0
          ? t.addEventListener(e, n, { passive: i })
          : t.addEventListener(e, n, !1));
  }
  function Bc(t, e, n, l, i) {
    var r = l;
    if ((e & 1) === 0 && (e & 2) === 0 && l !== null)
      t: for (;;) {
        if (l === null) return;
        var a = l.tag;
        if (a === 3 || a === 4) {
          var o = l.stateNode.containerInfo;
          if (o === i) break;
          if (a === 4)
            for (a = l.return; a !== null;) {
              var s = a.tag;
              if ((s === 3 || s === 4) && a.stateNode.containerInfo === i) return;
              a = a.return;
            }
          for (; o !== null;) {
            if (((a = nr(o)), a === null)) return;
            if (((s = a.tag), s === 5 || s === 6 || s === 26 || s === 27)) {
              l = r = a;
              continue t;
            }
            o = o.parentNode;
          }
        }
        l = l.return;
      }
    Bg(function () {
      var u = r,
        f = Yf(n),
        c = [];
      t: {
        var m = $g.get(t);
        if (m !== void 0) {
          var d = qs,
            g = t;
          switch (t) {
            case "keypress":
              if ($o(n) === 0) break t;
            case "keydown":
            case "keyup":
              d = Gk;
              break;
            case "focusin":
              ((g = "focus"), (d = gc));
              break;
            case "focusout":
              ((g = "blur"), (d = gc));
              break;
            case "beforeblur":
            case "afterblur":
              d = gc;
              break;
            case "click":
              if (n.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              d = ih;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              d = Lk;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              d = Kk;
              break;
            case Xg:
            case Zg:
            case Kg:
              d = Hk;
              break;
            case Jg:
              d = $k;
              break;
            case "scroll":
            case "scrollend":
              d = Ok;
              break;
            case "wheel":
              d = tS;
              break;
            case "copy":
            case "cut":
            case "paste":
              d = Ik;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              d = ah;
              break;
            case "toggle":
            case "beforetoggle":
              d = nS;
          }
          var x = (e & 4) !== 0,
            C = !x && (t === "scroll" || t === "scrollend"),
            h = x ? (m !== null ? m + "Capture" : null) : m;
          x = [];
          for (var p = u, y; p !== null;) {
            var T = p;
            if (
              ((y = T.stateNode),
              (T = T.tag),
              (T !== 5 && T !== 26 && T !== 27) ||
                y === null ||
                h === null ||
                ((T = Ma(p, h)), T != null && x.push(Ba(p, T, y))),
              C)
            )
              break;
            p = p.return;
          }
          0 < x.length && ((m = new d(m, g, null, n, f)), c.push({ event: m, listeners: x }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (
            ((m = t === "mouseover" || t === "pointerover"),
            (d = t === "mouseout" || t === "pointerout"),
            m && n !== Kc && (g = n.relatedTarget || n.fromElement) && (nr(g) || g[Dr]))
          )
            break t;
          if (
            (d || m) &&
            ((m = f.window === f ? f : (m = f.ownerDocument) ? m.defaultView || m.parentWindow : window),
            d
              ? ((g = n.relatedTarget || n.toElement),
                (d = u),
                (g = g ? nr(g) : null),
                g !== null && ((C = Fa(g)), (x = g.tag), g !== C || (x !== 5 && x !== 27 && x !== 6)) && (g = null))
              : ((d = null), (g = u)),
            d !== g)
          ) {
            if (
              ((x = ih),
              (T = "onMouseLeave"),
              (h = "onMouseEnter"),
              (p = "mouse"),
              (t === "pointerout" || t === "pointerover") &&
                ((x = ah), (T = "onPointerLeave"), (h = "onPointerEnter"), (p = "pointer")),
              (C = d == null ? m : ma(d)),
              (y = g == null ? m : ma(g)),
              (m = new x(T, p + "leave", d, n, f)),
              (m.target = C),
              (m.relatedTarget = y),
              (T = null),
              nr(f) === u && ((x = new x(h, p + "enter", g, n, f)), (x.target = y), (x.relatedTarget = C), (T = x)),
              (C = T),
              d && g)
            )
              e: {
                for (x = d, h = g, p = 0, y = x; y; y = Ki(y)) p++;
                for (y = 0, T = h; T; T = Ki(T)) y++;
                for (; 0 < p - y;) ((x = Ki(x)), p--);
                for (; 0 < y - p;) ((h = Ki(h)), y--);
                for (; p--;) {
                  if (x === h || (h !== null && x === h.alternate)) break e;
                  ((x = Ki(x)), (h = Ki(h)));
                }
                x = null;
              }
            else x = null;
            (d !== null && Wh(c, m, d, x, !1), g !== null && C !== null && Wh(c, C, g, x, !0));
          }
        }
        t: {
          if (
            ((m = u ? ma(u) : window),
            (d = m.nodeName && m.nodeName.toLowerCase()),
            d === "select" || (d === "input" && m.type === "file"))
          )
            var N = ch;
          else if (uh(m))
            if (Fg) N = dS;
            else {
              N = cS;
              var E = uS;
            }
          else
            ((d = m.nodeName),
              !d || d.toLowerCase() !== "input" || (m.type !== "checkbox" && m.type !== "radio")
                ? u && jf(u.elementType) && (N = ch)
                : (N = fS));
          if (N && (N = N(t, u))) {
            Yg(c, N, n, f);
            break t;
          }
          (E && E(t, m, u),
            t === "focusout" && u && m.type === "number" && u.memoizedProps.value != null && Zc(m, "number", m.value));
        }
        switch (((E = u ? ma(u) : window), t)) {
          case "focusin":
            (uh(E) || E.contentEditable === "true") && ((rr = E), ($c = u), (ya = null));
            break;
          case "focusout":
            ya = $c = rr = null;
            break;
          case "mousedown":
            Wc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((Wc = !1), ph(c, n, f));
            break;
          case "selectionchange":
            if (pS) break;
          case "keydown":
          case "keyup":
            ph(c, n, f);
        }
        var M;
        if (Qf)
          t: {
            switch (t) {
              case "compositionstart":
                var z = "onCompositionStart";
                break t;
              case "compositionend":
                z = "onCompositionEnd";
                break t;
              case "compositionupdate":
                z = "onCompositionUpdate";
                break t;
            }
            z = void 0;
          }
        else
          ir
            ? Ig(t, n) && (z = "onCompositionEnd")
            : t === "keydown" && n.keyCode === 229 && (z = "onCompositionStart");
        (z &&
          (qg &&
            n.locale !== "ko" &&
            (ir || z !== "onCompositionStart"
              ? z === "onCompositionEnd" && ir && (M = Hg())
              : ((_l = f), (Ff = "value" in _l ? _l.value : _l.textContent), (ir = !0))),
          (E = Ds(u, z)),
          0 < E.length &&
            ((z = new rh(z, t, null, n, f)),
            c.push({ event: z, listeners: E }),
            M ? (z.data = M) : ((M = jg(n)), M !== null && (z.data = M)))),
          (M = iS ? rS(t, n) : aS(t, n)) &&
            ((z = Ds(u, "onBeforeInput")),
            0 < z.length &&
              ((E = new rh("onBeforeInput", "beforeinput", null, n, f)),
              c.push({ event: E, listeners: z }),
              (E.data = M))),
          KS(c, t, u, n, f));
      }
      zv(c, e);
    });
  }
  function Ba(t, e, n) {
    return { instance: t, listener: e, currentTarget: n };
  }
  function Ds(t, e) {
    for (var n = e + "Capture", l = []; t !== null;) {
      var i = t,
        r = i.stateNode;
      if (
        ((i = i.tag),
        (i !== 5 && i !== 26 && i !== 27) ||
          r === null ||
          ((i = Ma(t, n)), i != null && l.unshift(Ba(t, i, r)), (i = Ma(t, e)), i != null && l.push(Ba(t, i, r))),
        t.tag === 3)
      )
        return l;
      t = t.return;
    }
    return [];
  }
  function Ki(t) {
    if (t === null) return null;
    do t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function Wh(t, e, n, l, i) {
    for (var r = e._reactName, a = []; n !== null && n !== l;) {
      var o = n,
        s = o.alternate,
        u = o.stateNode;
      if (((o = o.tag), s !== null && s === l)) break;
      ((o !== 5 && o !== 26 && o !== 27) ||
        u === null ||
        ((s = u),
        i
          ? ((u = Ma(n, r)), u != null && a.unshift(Ba(n, u, s)))
          : i || ((u = Ma(n, r)), u != null && a.push(Ba(n, u, s)))),
        (n = n.return));
    }
    a.length !== 0 && t.push({ event: e, listeners: a });
  }
  var $S = /\r\n?/g,
    WS = /\u0000|\uFFFD/g;
  function tg(t) {
    return (typeof t == "string" ? t : "" + t)
      .replace(
        $S,
        `
`,
      )
      .replace(WS, "");
  }
  function Uv(t, e) {
    return ((e = tg(e)), tg(t) === e);
  }
  function Js() {}
  function Yt(t, e, n, l, i, r) {
    switch (n) {
      case "children":
        typeof l == "string"
          ? e === "body" || (e === "textarea" && l === "") || Sr(t, l)
          : (typeof l == "number" || typeof l == "bigint") && e !== "body" && Sr(t, "" + l);
        break;
      case "className":
        Lo(t, "class", l);
        break;
      case "tabIndex":
        Lo(t, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Lo(t, n, l);
        break;
      case "style":
        Ug(t, l, r);
        break;
      case "data":
        if (e !== "object") {
          Lo(t, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (e !== "a" || n !== "href")) {
          t.removeAttribute(n);
          break;
        }
        if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
          t.removeAttribute(n);
          break;
        }
        ((l = Ko("" + l)), t.setAttribute(n, l));
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
          t.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof r == "function" &&
            (n === "formAction"
              ? (e !== "input" && Yt(t, e, "name", i.name, i, null),
                Yt(t, e, "formEncType", i.formEncType, i, null),
                Yt(t, e, "formMethod", i.formMethod, i, null),
                Yt(t, e, "formTarget", i.formTarget, i, null))
              : (Yt(t, e, "encType", i.encType, i, null),
                Yt(t, e, "method", i.method, i, null),
                Yt(t, e, "target", i.target, i, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          t.removeAttribute(n);
          break;
        }
        ((l = Ko("" + l)), t.setAttribute(n, l));
        break;
      case "onClick":
        l != null && (t.onclick = Js);
        break;
      case "onScroll":
        l != null && vt("scroll", t);
        break;
      case "onScrollEnd":
        l != null && vt("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l)) throw Error(O(61));
          if (((n = l.__html), n != null)) {
            if (i.children != null) throw Error(O(60));
            t.innerHTML = n;
          }
        }
        break;
      case "multiple":
        t.multiple = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "muted":
        t.muted = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (l == null || typeof l == "function" || typeof l == "boolean" || typeof l == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        ((n = Ko("" + l)), t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n));
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        l != null && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(n, "" + l) : t.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        l && typeof l != "function" && typeof l != "symbol" ? t.setAttribute(n, "") : t.removeAttribute(n);
        break;
      case "capture":
      case "download":
        l === !0
          ? t.setAttribute(n, "")
          : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol"
            ? t.setAttribute(n, l)
            : t.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l
          ? t.setAttribute(n, l)
          : t.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l)
          ? t.removeAttribute(n)
          : t.setAttribute(n, l);
        break;
      case "popover":
        (vt("beforetoggle", t), vt("toggle", t), Zo(t, "popover", l));
        break;
      case "xlinkActuate":
        nl(t, "http://www.w3.org/1999/xlink", "xlink:actuate", l);
        break;
      case "xlinkArcrole":
        nl(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", l);
        break;
      case "xlinkRole":
        nl(t, "http://www.w3.org/1999/xlink", "xlink:role", l);
        break;
      case "xlinkShow":
        nl(t, "http://www.w3.org/1999/xlink", "xlink:show", l);
        break;
      case "xlinkTitle":
        nl(t, "http://www.w3.org/1999/xlink", "xlink:title", l);
        break;
      case "xlinkType":
        nl(t, "http://www.w3.org/1999/xlink", "xlink:type", l);
        break;
      case "xmlBase":
        nl(t, "http://www.w3.org/XML/1998/namespace", "xml:base", l);
        break;
      case "xmlLang":
        nl(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", l);
        break;
      case "xmlSpace":
        nl(t, "http://www.w3.org/XML/1998/namespace", "xml:space", l);
        break;
      case "is":
        Zo(t, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || (n[0] !== "o" && n[0] !== "O") || (n[1] !== "n" && n[1] !== "N")) &&
          ((n = Dk.get(n) || n), Zo(t, n, l));
    }
  }
  function Ef(t, e, n, l, i, r) {
    switch (n) {
      case "style":
        Ug(t, l, r);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l)) throw Error(O(61));
          if (((n = l.__html), n != null)) {
            if (i.children != null) throw Error(O(60));
            t.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof l == "string" ? Sr(t, l) : (typeof l == "number" || typeof l == "bigint") && Sr(t, "" + l);
        break;
      case "onScroll":
        l != null && vt("scroll", t);
        break;
      case "onScrollEnd":
        l != null && vt("scrollend", t);
        break;
      case "onClick":
        l != null && (t.onclick = Js);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!Mg.hasOwnProperty(n))
          t: {
            if (
              n[0] === "o" &&
              n[1] === "n" &&
              ((i = n.endsWith("Capture")),
              (e = n.slice(2, i ? n.length - 7 : void 0)),
              (r = t[an] || null),
              (r = r != null ? r[n] : null),
              typeof r == "function" && t.removeEventListener(e, r, i),
              typeof l == "function")
            ) {
              (typeof r != "function" &&
                r !== null &&
                (n in t ? (t[n] = null) : t.hasAttribute(n) && t.removeAttribute(n)),
                t.addEventListener(e, l, i));
              break t;
            }
            n in t ? (t[n] = l) : l === !0 ? t.setAttribute(n, "") : Zo(t, n, l);
          }
    }
  }
  function He(t, e, n) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        (vt("error", t), vt("load", t));
        var l = !1,
          i = !1,
          r;
        for (r in n)
          if (n.hasOwnProperty(r)) {
            var a = n[r];
            if (a != null)
              switch (r) {
                case "src":
                  l = !0;
                  break;
                case "srcSet":
                  i = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(O(137, e));
                default:
                  Yt(t, e, r, a, n, null);
              }
          }
        (i && Yt(t, e, "srcSet", n.srcSet, n, null), l && Yt(t, e, "src", n.src, n, null));
        return;
      case "input":
        vt("invalid", t);
        var o = (r = a = i = null),
          s = null,
          u = null;
        for (l in n)
          if (n.hasOwnProperty(l)) {
            var f = n[l];
            if (f != null)
              switch (l) {
                case "name":
                  i = f;
                  break;
                case "type":
                  a = f;
                  break;
                case "checked":
                  s = f;
                  break;
                case "defaultChecked":
                  u = f;
                  break;
                case "value":
                  r = f;
                  break;
                case "defaultValue":
                  o = f;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (f != null) throw Error(O(137, e));
                  break;
                default:
                  Yt(t, e, l, f, n, null);
              }
          }
        (Og(t, r, o, s, u, a, i, !1), ds(t));
        return;
      case "select":
        (vt("invalid", t), (l = a = r = null));
        for (i in n)
          if (n.hasOwnProperty(i) && ((o = n[i]), o != null))
            switch (i) {
              case "value":
                r = o;
                break;
              case "defaultValue":
                a = o;
                break;
              case "multiple":
                l = o;
              default:
                Yt(t, e, i, o, n, null);
            }
        ((e = r), (n = a), (t.multiple = !!l), e != null ? mr(t, !!l, e, !1) : n != null && mr(t, !!l, n, !0));
        return;
      case "textarea":
        (vt("invalid", t), (r = i = l = null));
        for (a in n)
          if (n.hasOwnProperty(a) && ((o = n[a]), o != null))
            switch (a) {
              case "value":
                l = o;
                break;
              case "defaultValue":
                i = o;
                break;
              case "children":
                r = o;
                break;
              case "dangerouslySetInnerHTML":
                if (o != null) throw Error(O(91));
                break;
              default:
                Yt(t, e, a, o, n, null);
            }
        (Lg(t, l, i, r), ds(t));
        return;
      case "option":
        for (s in n)
          if (n.hasOwnProperty(s) && ((l = n[s]), l != null))
            switch (s) {
              case "selected":
                t.selected = l && typeof l != "function" && typeof l != "symbol";
                break;
              default:
                Yt(t, e, s, l, n, null);
            }
        return;
      case "dialog":
        (vt("beforetoggle", t), vt("toggle", t), vt("cancel", t), vt("close", t));
        break;
      case "iframe":
      case "object":
        vt("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Ua.length; l++) vt(Ua[l], t);
        break;
      case "image":
        (vt("error", t), vt("load", t));
        break;
      case "details":
        vt("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        (vt("error", t), vt("load", t));
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (u in n)
          if (n.hasOwnProperty(u) && ((l = n[u]), l != null))
            switch (u) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(O(137, e));
              default:
                Yt(t, e, u, l, n, null);
            }
        return;
      default:
        if (jf(e)) {
          for (f in n) n.hasOwnProperty(f) && ((l = n[f]), l !== void 0 && Ef(t, e, f, l, n, void 0));
          return;
        }
    }
    for (o in n) n.hasOwnProperty(o) && ((l = n[o]), l != null && Yt(t, e, o, l, n, null));
  }
  function tw(t, e, n, l) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var i = null,
          r = null,
          a = null,
          o = null,
          s = null,
          u = null,
          f = null;
        for (d in n) {
          var c = n[d];
          if (n.hasOwnProperty(d) && c != null)
            switch (d) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                s = c;
              default:
                l.hasOwnProperty(d) || Yt(t, e, d, null, l, c);
            }
        }
        for (var m in l) {
          var d = l[m];
          if (((c = n[m]), l.hasOwnProperty(m) && (d != null || c != null)))
            switch (m) {
              case "type":
                r = d;
                break;
              case "name":
                i = d;
                break;
              case "checked":
                u = d;
                break;
              case "defaultChecked":
                f = d;
                break;
              case "value":
                a = d;
                break;
              case "defaultValue":
                o = d;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (d != null) throw Error(O(137, e));
                break;
              default:
                d !== c && Yt(t, e, m, d, l, c);
            }
        }
        Xc(t, a, o, s, u, f, r, i);
        return;
      case "select":
        d = a = o = m = null;
        for (r in n)
          if (((s = n[r]), n.hasOwnProperty(r) && s != null))
            switch (r) {
              case "value":
                break;
              case "multiple":
                d = s;
              default:
                l.hasOwnProperty(r) || Yt(t, e, r, null, l, s);
            }
        for (i in l)
          if (((r = l[i]), (s = n[i]), l.hasOwnProperty(i) && (r != null || s != null)))
            switch (i) {
              case "value":
                m = r;
                break;
              case "defaultValue":
                o = r;
                break;
              case "multiple":
                a = r;
              default:
                r !== s && Yt(t, e, i, r, l, s);
            }
        ((e = o),
          (n = a),
          (l = d),
          m != null ? mr(t, !!n, m, !1) : !!l != !!n && (e != null ? mr(t, !!n, e, !0) : mr(t, !!n, n ? [] : "", !1)));
        return;
      case "textarea":
        d = m = null;
        for (o in n)
          if (((i = n[o]), n.hasOwnProperty(o) && i != null && !l.hasOwnProperty(o)))
            switch (o) {
              case "value":
                break;
              case "children":
                break;
              default:
                Yt(t, e, o, null, l, i);
            }
        for (a in l)
          if (((i = l[a]), (r = n[a]), l.hasOwnProperty(a) && (i != null || r != null)))
            switch (a) {
              case "value":
                m = i;
                break;
              case "defaultValue":
                d = i;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (i != null) throw Error(O(91));
                break;
              default:
                i !== r && Yt(t, e, a, i, l, r);
            }
        zg(t, m, d);
        return;
      case "option":
        for (var g in n)
          if (((m = n[g]), n.hasOwnProperty(g) && m != null && !l.hasOwnProperty(g)))
            switch (g) {
              case "selected":
                t.selected = !1;
                break;
              default:
                Yt(t, e, g, null, l, m);
            }
        for (s in l)
          if (((m = l[s]), (d = n[s]), l.hasOwnProperty(s) && m !== d && (m != null || d != null)))
            switch (s) {
              case "selected":
                t.selected = m && typeof m != "function" && typeof m != "symbol";
                break;
              default:
                Yt(t, e, s, m, l, d);
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var x in n)
          ((m = n[x]), n.hasOwnProperty(x) && m != null && !l.hasOwnProperty(x) && Yt(t, e, x, null, l, m));
        for (u in l)
          if (((m = l[u]), (d = n[u]), l.hasOwnProperty(u) && m !== d && (m != null || d != null)))
            switch (u) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (m != null) throw Error(O(137, e));
                break;
              default:
                Yt(t, e, u, m, l, d);
            }
        return;
      default:
        if (jf(e)) {
          for (var C in n)
            ((m = n[C]), n.hasOwnProperty(C) && m !== void 0 && !l.hasOwnProperty(C) && Ef(t, e, C, void 0, l, m));
          for (f in l)
            ((m = l[f]),
              (d = n[f]),
              !l.hasOwnProperty(f) || m === d || (m === void 0 && d === void 0) || Ef(t, e, f, m, l, d));
          return;
        }
    }
    for (var h in n) ((m = n[h]), n.hasOwnProperty(h) && m != null && !l.hasOwnProperty(h) && Yt(t, e, h, null, l, m));
    for (c in l)
      ((m = l[c]), (d = n[c]), !l.hasOwnProperty(c) || m === d || (m == null && d == null) || Yt(t, e, c, m, l, d));
  }
  var Cf = null,
    Af = null;
  function _s(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function eg(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Bv(t, e) {
    if (t === 0)
      switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function Nf(t, e) {
    return (
      t === "textarea" ||
      t === "noscript" ||
      typeof e.children == "string" ||
      typeof e.children == "number" ||
      typeof e.children == "bigint" ||
      (typeof e.dangerouslySetInnerHTML == "object" &&
        e.dangerouslySetInnerHTML !== null &&
        e.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Hc = null;
  function ew() {
    var t = window.event;
    return t && t.type === "popstate" ? (t === Hc ? !1 : ((Hc = t), !0)) : ((Hc = null), !1);
  }
  var Hv = typeof setTimeout == "function" ? setTimeout : void 0,
    nw = typeof clearTimeout == "function" ? clearTimeout : void 0,
    ng = typeof Promise == "function" ? Promise : void 0,
    lw =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof ng < "u"
          ? function (t) {
              return ng.resolve(null).then(t).catch(iw);
            }
          : Hv;
  function iw(t) {
    setTimeout(function () {
      throw t;
    });
  }
  function Gl(t) {
    return t === "head";
  }
  function lg(t, e) {
    var n = e,
      l = 0,
      i = 0;
    do {
      var r = n.nextSibling;
      if ((t.removeChild(n), r && r.nodeType === 8))
        if (((n = r.data), n === "/$")) {
          if (0 < l && 8 > l) {
            n = l;
            var a = t.ownerDocument;
            if ((n & 1 && Na(a.documentElement), n & 2 && Na(a.body), n & 4))
              for (n = a.head, Na(n), a = n.firstChild; a;) {
                var o = a.nextSibling,
                  s = a.nodeName;
                (a[Ga] ||
                  s === "SCRIPT" ||
                  s === "STYLE" ||
                  (s === "LINK" && a.rel.toLowerCase() === "stylesheet") ||
                  n.removeChild(a),
                  (a = o));
              }
          }
          if (i === 0) {
            (t.removeChild(r), Ya(e));
            return;
          }
          i--;
        } else n === "$" || n === "$?" || n === "$!" ? i++ : (l = n.charCodeAt(0) - 48);
      else l = 0;
      n = r;
    } while (n);
    Ya(e);
  }
  function Rf(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e;) {
      var n = e;
      switch (((e = e.nextSibling), n.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          (Rf(n), If(n));
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(n);
    }
  }
  function rw(t, e, n, l) {
    for (; t.nodeType === 1;) {
      var i = n;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!l && (t.nodeName !== "INPUT" || t.type !== "hidden")) break;
      } else if (l) {
        if (!t[Ga])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (((r = t.getAttribute("rel")), r === "stylesheet" && t.hasAttribute("data-precedence"))) break;
              if (
                r !== i.rel ||
                t.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) ||
                t.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) ||
                t.getAttribute("title") !== (i.title == null ? null : i.title)
              )
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (
                ((r = t.getAttribute("src")),
                (r !== (i.src == null ? null : i.src) ||
                  t.getAttribute("type") !== (i.type == null ? null : i.type) ||
                  t.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) &&
                  r &&
                  t.hasAttribute("async") &&
                  !t.hasAttribute("itemprop"))
              )
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var r = i.name == null ? null : "" + i.name;
        if (i.type === "hidden" && t.getAttribute("name") === r) return t;
      } else return t;
      if (((t = Un(t.nextSibling)), t === null)) break;
    }
    return null;
  }
  function aw(t, e, n) {
    if (e === "") return null;
    for (; t.nodeType !== 3;)
      if (
        ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !n) ||
        ((t = Un(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function Mf(t) {
    return t.data === "$!" || (t.data === "$?" && t.ownerDocument.readyState === "complete");
  }
  function ow(t, e) {
    var n = t.ownerDocument;
    if (t.data !== "$?" || n.readyState === "complete") e();
    else {
      var l = function () {
        (e(), n.removeEventListener("DOMContentLoaded", l));
      };
      (n.addEventListener("DOMContentLoaded", l), (t._reactRetry = l));
    }
  }
  function Un(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (((e = t.data), e === "$" || e === "$!" || e === "$?" || e === "F!" || e === "F")) break;
        if (e === "/$") return null;
      }
    }
    return t;
  }
  var Df = null;
  function ig(t) {
    t = t.previousSibling;
    for (var e = 0; t;) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "$" || n === "$!" || n === "$?") {
          if (e === 0) return t;
          e--;
        } else n === "/$" && e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function qv(t, e, n) {
    switch (((e = _s(n)), t)) {
      case "html":
        if (((t = e.documentElement), !t)) throw Error(O(452));
        return t;
      case "head":
        if (((t = e.head), !t)) throw Error(O(453));
        return t;
      case "body":
        if (((t = e.body), !t)) throw Error(O(454));
        return t;
      default:
        throw Error(O(451));
    }
  }
  function Na(t) {
    for (var e = t.attributes; e.length;) t.removeAttributeNode(e[0]);
    If(t);
  }
  var _n = new Map(),
    rg = new Set();
  function Os(t) {
    return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument;
  }
  var yl = Lt.d;
  Lt.d = { f: sw, r: uw, D: cw, C: fw, L: dw, m: mw, X: hw, S: pw, M: gw };
  function sw() {
    var t = yl.f(),
      e = Xs();
    return t || e;
  }
  function uw(t) {
    var e = _r(t);
    e !== null && e.tag === 5 && e.type === "form" ? _y(e) : yl.r(t);
  }
  var Lr = typeof document > "u" ? null : document;
  function Iv(t, e, n) {
    var l = Lr;
    if (l && typeof e == "string" && e) {
      var i = Nn(e);
      ((i = 'link[rel="' + t + '"][href="' + i + '"]'),
        typeof n == "string" && (i += '[crossorigin="' + n + '"]'),
        rg.has(i) ||
          (rg.add(i),
          (t = { rel: t, crossOrigin: n, href: e }),
          l.querySelector(i) === null &&
            ((e = l.createElement("link")), He(e, "link", t), Me(e), l.head.appendChild(e))));
    }
  }
  function cw(t) {
    (yl.D(t), Iv("dns-prefetch", t, null));
  }
  function fw(t, e) {
    (yl.C(t, e), Iv("preconnect", t, e));
  }
  function dw(t, e, n) {
    yl.L(t, e, n);
    var l = Lr;
    if (l && t && e) {
      var i = 'link[rel="preload"][as="' + Nn(e) + '"]';
      e === "image" && n && n.imageSrcSet
        ? ((i += '[imagesrcset="' + Nn(n.imageSrcSet) + '"]'),
          typeof n.imageSizes == "string" && (i += '[imagesizes="' + Nn(n.imageSizes) + '"]'))
        : (i += '[href="' + Nn(t) + '"]');
      var r = i;
      switch (e) {
        case "style":
          r = Mr(t);
          break;
        case "script":
          r = Ur(t);
      }
      _n.has(r) ||
        ((t = Zt({ rel: "preload", href: e === "image" && n && n.imageSrcSet ? void 0 : t, as: e }, n)),
        _n.set(r, t),
        l.querySelector(i) !== null ||
          (e === "style" && l.querySelector(lo(r))) ||
          (e === "script" && l.querySelector(io(r))) ||
          ((e = l.createElement("link")), He(e, "link", t), Me(e), l.head.appendChild(e)));
    }
  }
  function mw(t, e) {
    yl.m(t, e);
    var n = Lr;
    if (n && t) {
      var l = e && typeof e.as == "string" ? e.as : "script",
        i = 'link[rel="modulepreload"][as="' + Nn(l) + '"][href="' + Nn(t) + '"]',
        r = i;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          r = Ur(t);
      }
      if (!_n.has(r) && ((t = Zt({ rel: "modulepreload", href: t }, e)), _n.set(r, t), n.querySelector(i) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(io(r))) return;
        }
        ((l = n.createElement("link")), He(l, "link", t), Me(l), n.head.appendChild(l));
      }
    }
  }
  function pw(t, e, n) {
    yl.S(t, e, n);
    var l = Lr;
    if (l && t) {
      var i = dr(l).hoistableStyles,
        r = Mr(t);
      e = e || "default";
      var a = i.get(r);
      if (!a) {
        var o = { loading: 0, preload: null };
        if ((a = l.querySelector(lo(r)))) o.loading = 5;
        else {
          ((t = Zt({ rel: "stylesheet", href: t, "data-precedence": e }, n)), (n = _n.get(r)) && wd(t, n));
          var s = (a = l.createElement("link"));
          (Me(s),
            He(s, "link", t),
            (s._p = new Promise(function (u, f) {
              ((s.onload = u), (s.onerror = f));
            })),
            s.addEventListener("load", function () {
              o.loading |= 1;
            }),
            s.addEventListener("error", function () {
              o.loading |= 2;
            }),
            (o.loading |= 4),
            rs(a, e, l));
        }
        ((a = { type: "stylesheet", instance: a, count: 1, state: o }), i.set(r, a));
      }
    }
  }
  function hw(t, e) {
    yl.X(t, e);
    var n = Lr;
    if (n && t) {
      var l = dr(n).hoistableScripts,
        i = Ur(t),
        r = l.get(i);
      r ||
        ((r = n.querySelector(io(i))),
        r ||
          ((t = Zt({ src: t, async: !0 }, e)),
          (e = _n.get(i)) && Td(t, e),
          (r = n.createElement("script")),
          Me(r),
          He(r, "link", t),
          n.head.appendChild(r)),
        (r = { type: "script", instance: r, count: 1, state: null }),
        l.set(i, r));
    }
  }
  function gw(t, e) {
    yl.M(t, e);
    var n = Lr;
    if (n && t) {
      var l = dr(n).hoistableScripts,
        i = Ur(t),
        r = l.get(i);
      r ||
        ((r = n.querySelector(io(i))),
        r ||
          ((t = Zt({ src: t, async: !0, type: "module" }, e)),
          (e = _n.get(i)) && Td(t, e),
          (r = n.createElement("script")),
          Me(r),
          He(r, "link", t),
          n.head.appendChild(r)),
        (r = { type: "script", instance: r, count: 1, state: null }),
        l.set(i, r));
    }
  }
  function ag(t, e, n, l) {
    var i = (i = Ll.current) ? Os(i) : null;
    if (!i) throw Error(O(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string"
          ? ((e = Mr(n.href)),
            (n = dr(i).hoistableStyles),
            (l = n.get(e)),
            l || ((l = { type: "style", instance: null, count: 0, state: null }), n.set(e, l)),
            l)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          t = Mr(n.href);
          var r = dr(i).hoistableStyles,
            a = r.get(t);
          if (
            (a ||
              ((i = i.ownerDocument || i),
              (a = { type: "stylesheet", instance: null, count: 0, state: { loading: 0, preload: null } }),
              r.set(t, a),
              (r = i.querySelector(lo(t))) && !r._p && ((a.instance = r), (a.state.loading = 5)),
              _n.has(t) ||
                ((n = {
                  rel: "preload",
                  as: "style",
                  href: n.href,
                  crossOrigin: n.crossOrigin,
                  integrity: n.integrity,
                  media: n.media,
                  hrefLang: n.hrefLang,
                  referrerPolicy: n.referrerPolicy,
                }),
                _n.set(t, n),
                r || yw(i, t, n, a.state))),
            e && l === null)
          )
            throw Error(O(528, ""));
          return a;
        }
        if (e && l !== null) throw Error(O(529, ""));
        return null;
      case "script":
        return (
          (e = n.async),
          (n = n.src),
          typeof n == "string" && e && typeof e != "function" && typeof e != "symbol"
            ? ((e = Ur(n)),
              (n = dr(i).hoistableScripts),
              (l = n.get(e)),
              l || ((l = { type: "script", instance: null, count: 0, state: null }), n.set(e, l)),
              l)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(O(444, t));
    }
  }
  function Mr(t) {
    return 'href="' + Nn(t) + '"';
  }
  function lo(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function jv(t) {
    return Zt({}, t, { "data-precedence": t.precedence, precedence: null });
  }
  function yw(t, e, n, l) {
    t.querySelector('link[rel="preload"][as="style"][' + e + "]")
      ? (l.loading = 1)
      : ((e = t.createElement("link")),
        (l.preload = e),
        e.addEventListener("load", function () {
          return (l.loading |= 1);
        }),
        e.addEventListener("error", function () {
          return (l.loading |= 2);
        }),
        He(e, "link", n),
        Me(e),
        t.head.appendChild(e));
  }
  function Ur(t) {
    return '[src="' + Nn(t) + '"]';
  }
  function io(t) {
    return "script[async]" + t;
  }
  function og(t, e, n) {
    if ((e.count++, e.instance === null))
      switch (e.type) {
        case "style":
          var l = t.querySelector('style[data-href~="' + Nn(n.href) + '"]');
          if (l) return ((e.instance = l), Me(l), l);
          var i = Zt({}, n, { "data-href": n.href, "data-precedence": n.precedence, href: null, precedence: null });
          return (
            (l = (t.ownerDocument || t).createElement("style")),
            Me(l),
            He(l, "style", i),
            rs(l, n.precedence, t),
            (e.instance = l)
          );
        case "stylesheet":
          i = Mr(n.href);
          var r = t.querySelector(lo(i));
          if (r) return ((e.state.loading |= 4), (e.instance = r), Me(r), r);
          ((l = jv(n)), (i = _n.get(i)) && wd(l, i), (r = (t.ownerDocument || t).createElement("link")), Me(r));
          var a = r;
          return (
            (a._p = new Promise(function (o, s) {
              ((a.onload = o), (a.onerror = s));
            })),
            He(r, "link", l),
            (e.state.loading |= 4),
            rs(r, n.precedence, t),
            (e.instance = r)
          );
        case "script":
          return (
            (r = Ur(n.src)),
            (i = t.querySelector(io(r)))
              ? ((e.instance = i), Me(i), i)
              : ((l = n),
                (i = _n.get(r)) && ((l = Zt({}, n)), Td(l, i)),
                (t = t.ownerDocument || t),
                (i = t.createElement("script")),
                Me(i),
                He(i, "link", l),
                t.head.appendChild(i),
                (e.instance = i))
          );
        case "void":
          return null;
        default:
          throw Error(O(443, e.type));
      }
    else
      e.type === "stylesheet" &&
        (e.state.loading & 4) === 0 &&
        ((l = e.instance), (e.state.loading |= 4), rs(l, n.precedence, t));
    return e.instance;
  }
  function rs(t, e, n) {
    for (
      var l = n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
        i = l.length ? l[l.length - 1] : null,
        r = i,
        a = 0;
      a < l.length;
      a++
    ) {
      var o = l[a];
      if (o.dataset.precedence === e) r = o;
      else if (r !== i) break;
    }
    r
      ? r.parentNode.insertBefore(t, r.nextSibling)
      : ((e = n.nodeType === 9 ? n.head : n), e.insertBefore(t, e.firstChild));
  }
  function wd(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.title == null && (t.title = e.title));
  }
  function Td(t, e) {
    (t.crossOrigin == null && (t.crossOrigin = e.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy),
      t.integrity == null && (t.integrity = e.integrity));
  }
  var as = null;
  function sg(t, e, n) {
    if (as === null) {
      var l = new Map(),
        i = (as = new Map());
      i.set(n, l);
    } else ((i = as), (l = i.get(n)), l || ((l = new Map()), i.set(n, l)));
    if (l.has(t)) return l;
    for (l.set(t, null), n = n.getElementsByTagName(t), i = 0; i < n.length; i++) {
      var r = n[i];
      if (
        !(r[Ga] || r[je] || (t === "link" && r.getAttribute("rel") === "stylesheet")) &&
        r.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var a = r.getAttribute(e) || "";
        a = t + a;
        var o = l.get(a);
        o ? o.push(r) : l.set(a, [r]);
      }
    }
    return l;
  }
  function ug(t, e, n) {
    ((t = t.ownerDocument || t), t.head.insertBefore(n, e === "title" ? t.querySelector("head > title") : null));
  }
  function vw(t, e, n) {
    if (n === 1 || e.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "") break;
        return !0;
      case "link":
        if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError) break;
        switch (e.rel) {
          case "stylesheet":
            return ((t = e.disabled), typeof e.precedence == "string" && t == null);
          default:
            return !0;
        }
      case "script":
        if (
          e.async &&
          typeof e.async != "function" &&
          typeof e.async != "symbol" &&
          !e.onLoad &&
          !e.onError &&
          e.src &&
          typeof e.src == "string"
        )
          return !0;
    }
    return !1;
  }
  function Yv(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  var Ha = null;
  function bw() {}
  function xw(t, e, n) {
    if (Ha === null) throw Error(O(475));
    var l = Ha;
    if (
      e.type === "stylesheet" &&
      (typeof n.media != "string" || matchMedia(n.media).matches !== !1) &&
      (e.state.loading & 4) === 0
    ) {
      if (e.instance === null) {
        var i = Mr(n.href),
          r = t.querySelector(lo(i));
        if (r) {
          ((t = r._p),
            t !== null &&
              typeof t == "object" &&
              typeof t.then == "function" &&
              (l.count++, (l = zs.bind(l)), t.then(l, l)),
            (e.state.loading |= 4),
            (e.instance = r),
            Me(r));
          return;
        }
        ((r = t.ownerDocument || t), (n = jv(n)), (i = _n.get(i)) && wd(n, i), (r = r.createElement("link")), Me(r));
        var a = r;
        ((a._p = new Promise(function (o, s) {
          ((a.onload = o), (a.onerror = s));
        })),
          He(r, "link", n),
          (e.instance = r));
      }
      (l.stylesheets === null && (l.stylesheets = new Map()),
        l.stylesheets.set(e, t),
        (t = e.state.preload) &&
          (e.state.loading & 3) === 0 &&
          (l.count++, (e = zs.bind(l)), t.addEventListener("load", e), t.addEventListener("error", e)));
    }
  }
  function kw() {
    if (Ha === null) throw Error(O(475));
    var t = Ha;
    return (
      t.stylesheets && t.count === 0 && _f(t, t.stylesheets),
      0 < t.count
        ? function (e) {
            var n = setTimeout(function () {
              if ((t.stylesheets && _f(t, t.stylesheets), t.unsuspend)) {
                var l = t.unsuspend;
                ((t.unsuspend = null), l());
              }
            }, 6e4);
            return (
              (t.unsuspend = e),
              function () {
                ((t.unsuspend = null), clearTimeout(n));
              }
            );
          }
        : null
    );
  }
  function zs() {
    if ((this.count--, this.count === 0)) {
      if (this.stylesheets) _f(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        ((this.unsuspend = null), t());
      }
    }
  }
  var Ls = null;
  function _f(t, e) {
    ((t.stylesheets = null),
      t.unsuspend !== null && (t.count++, (Ls = new Map()), e.forEach(Sw, t), (Ls = null), zs.call(t)));
  }
  function Sw(t, e) {
    if (!(e.state.loading & 4)) {
      var n = Ls.get(t);
      if (n) var l = n.get(null);
      else {
        ((n = new Map()), Ls.set(t, n));
        for (var i = t.querySelectorAll("link[data-precedence],style[data-precedence]"), r = 0; r < i.length; r++) {
          var a = i[r];
          (a.nodeName === "LINK" || a.getAttribute("media") !== "not all") && (n.set(a.dataset.precedence, a), (l = a));
        }
        l && n.set(null, l);
      }
      ((i = e.instance),
        (a = i.getAttribute("data-precedence")),
        (r = n.get(a) || l),
        r === l && n.set(null, i),
        n.set(a, i),
        this.count++,
        (l = zs.bind(this)),
        i.addEventListener("load", l),
        i.addEventListener("error", l),
        r
          ? r.parentNode.insertBefore(i, r.nextSibling)
          : ((t = t.nodeType === 9 ? t.head : t), t.insertBefore(i, t.firstChild)),
        (e.state.loading |= 4));
    }
  }
  var qa = { $$typeof: al, Provider: null, Consumer: null, _currentValue: fi, _currentValue2: fi, _threadCount: 0 };
  function ww(t, e, n, l, i, r, a, o) {
    ((this.tag = 1),
      (this.containerInfo = t),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null),
      (this.callbackPriority = 0),
      (this.expirationTimes = uc(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = uc(0)),
      (this.hiddenUpdates = uc(null)),
      (this.identifierPrefix = l),
      (this.onUncaughtError = i),
      (this.onCaughtError = r),
      (this.onRecoverableError = a),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = o),
      (this.incompleteTransitions = new Map()));
  }
  function Fv(t, e, n, l, i, r, a, o, s, u, f, c) {
    return (
      (t = new ww(t, e, n, a, o, s, u, c)),
      (e = 1),
      r === !0 && (e |= 24),
      (r = mn(3, null, null, e)),
      (t.current = r),
      (r.stateNode = t),
      (e = $f()),
      e.refCount++,
      (t.pooledCache = e),
      e.refCount++,
      (r.memoizedState = { element: l, isDehydrated: n, cache: e }),
      td(r),
      t
    );
  }
  function Vv(t) {
    return t ? ((t = sr), t) : sr;
  }
  function Qv(t, e, n, l, i, r) {
    ((i = Vv(i)),
      l.context === null ? (l.context = i) : (l.pendingContext = i),
      (l = Ul(e)),
      (l.payload = { element: n }),
      (r = r === void 0 ? null : r),
      r !== null && (l.callback = r),
      (n = Bl(t, l, e)),
      n !== null && (yn(n, t, e), xa(n, t, e)));
  }
  function cg(t, e) {
    if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
      var n = t.retryLane;
      t.retryLane = n !== 0 && n < e ? n : e;
    }
  }
  function Ed(t, e) {
    (cg(t, e), (t = t.alternate) && cg(t, e));
  }
  function Pv(t) {
    if (t.tag === 13) {
      var e = Or(t, 67108864);
      (e !== null && yn(e, t, 67108864), Ed(t, 67108864));
    }
  }
  var Us = !0;
  function Tw(t, e, n, l) {
    var i = at.T;
    at.T = null;
    var r = Lt.p;
    try {
      ((Lt.p = 2), Cd(t, e, n, l));
    } finally {
      ((Lt.p = r), (at.T = i));
    }
  }
  function Ew(t, e, n, l) {
    var i = at.T;
    at.T = null;
    var r = Lt.p;
    try {
      ((Lt.p = 8), Cd(t, e, n, l));
    } finally {
      ((Lt.p = r), (at.T = i));
    }
  }
  function Cd(t, e, n, l) {
    if (Us) {
      var i = Of(l);
      if (i === null) (Bc(t, e, l, Bs, n), fg(t, l));
      else if (Aw(i, t, e, n, l)) l.stopPropagation();
      else if ((fg(t, l), e & 4 && -1 < Cw.indexOf(t))) {
        for (; i !== null;) {
          var r = _r(i);
          if (r !== null)
            switch (r.tag) {
              case 3:
                if (((r = r.stateNode), r.current.memoizedState.isDehydrated)) {
                  var a = si(r.pendingLanes);
                  if (a !== 0) {
                    var o = r;
                    for (o.pendingLanes |= 2, o.entangledLanes |= 2; a;) {
                      var s = 1 << (31 - hn(a));
                      ((o.entanglements[1] |= s), (a &= ~s));
                    }
                    (Zn(r), (qt & 6) === 0 && ((As = Pn() + 500), no(0, !1)));
                  }
                }
                break;
              case 13:
                ((o = Or(r, 2)), o !== null && yn(o, r, 2), Xs(), Ed(r, 2));
            }
          if (((r = Of(l)), r === null && Bc(t, e, l, Bs, n), r === i)) break;
          i = r;
        }
        i !== null && l.stopPropagation();
      } else Bc(t, e, l, null, n);
    }
  }
  function Of(t) {
    return ((t = Yf(t)), Ad(t));
  }
  var Bs = null;
  function Ad(t) {
    if (((Bs = null), (t = nr(t)), t !== null)) {
      var e = Fa(t);
      if (e === null) t = null;
      else {
        var n = e.tag;
        if (n === 13) {
          if (((t = yg(e)), t !== null)) return t;
          t = null;
        } else if (n === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated) return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return ((Bs = t), null);
  }
  function Gv(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (mk()) {
          case kg:
            return 2;
          case Sg:
            return 8;
          case fs:
          case pk:
            return 32;
          case wg:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var zf = !1,
    Il = null,
    jl = null,
    Yl = null,
    Ia = new Map(),
    ja = new Map(),
    Ml = [],
    Cw =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " ",
      );
  function fg(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        Il = null;
        break;
      case "dragenter":
      case "dragleave":
        jl = null;
        break;
      case "mouseover":
      case "mouseout":
        Yl = null;
        break;
      case "pointerover":
      case "pointerout":
        Ia.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ja.delete(e.pointerId);
    }
  }
  function ua(t, e, n, l, i, r) {
    return t === null || t.nativeEvent !== r
      ? ((t = { blockedOn: e, domEventName: n, eventSystemFlags: l, nativeEvent: r, targetContainers: [i] }),
        e !== null && ((e = _r(e)), e !== null && Pv(e)),
        t)
      : ((t.eventSystemFlags |= l), (e = t.targetContainers), i !== null && e.indexOf(i) === -1 && e.push(i), t);
  }
  function Aw(t, e, n, l, i) {
    switch (e) {
      case "focusin":
        return ((Il = ua(Il, t, e, n, l, i)), !0);
      case "dragenter":
        return ((jl = ua(jl, t, e, n, l, i)), !0);
      case "mouseover":
        return ((Yl = ua(Yl, t, e, n, l, i)), !0);
      case "pointerover":
        var r = i.pointerId;
        return (Ia.set(r, ua(Ia.get(r) || null, t, e, n, l, i)), !0);
      case "gotpointercapture":
        return ((r = i.pointerId), ja.set(r, ua(ja.get(r) || null, t, e, n, l, i)), !0);
    }
    return !1;
  }
  function Xv(t) {
    var e = nr(t.target);
    if (e !== null) {
      var n = Fa(e);
      if (n !== null) {
        if (((e = n.tag), e === 13)) {
          if (((e = yg(n)), e !== null)) {
            ((t.blockedOn = e),
              Sk(t.priority, function () {
                if (n.tag === 13) {
                  var l = gn();
                  l = Hf(l);
                  var i = Or(n, l);
                  (i !== null && yn(i, n, l), Ed(n, l));
                }
              }));
            return;
          }
        } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function os(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length;) {
      var n = Of(t.nativeEvent);
      if (n === null) {
        n = t.nativeEvent;
        var l = new n.constructor(n.type, n);
        ((Kc = l), n.target.dispatchEvent(l), (Kc = null));
      } else return ((e = _r(n)), e !== null && Pv(e), (t.blockedOn = n), !1);
      e.shift();
    }
    return !0;
  }
  function dg(t, e, n) {
    os(t) && n.delete(e);
  }
  function Nw() {
    ((zf = !1),
      Il !== null && os(Il) && (Il = null),
      jl !== null && os(jl) && (jl = null),
      Yl !== null && os(Yl) && (Yl = null),
      Ia.forEach(dg),
      ja.forEach(dg));
  }
  function Go(t, e) {
    t.blockedOn === e &&
      ((t.blockedOn = null), zf || ((zf = !0), we.unstable_scheduleCallback(we.unstable_NormalPriority, Nw)));
  }
  var Xo = null;
  function mg(t) {
    Xo !== t &&
      ((Xo = t),
      we.unstable_scheduleCallback(we.unstable_NormalPriority, function () {
        Xo === t && (Xo = null);
        for (var e = 0; e < t.length; e += 3) {
          var n = t[e],
            l = t[e + 1],
            i = t[e + 2];
          if (typeof l != "function") {
            if (Ad(l || n) === null) continue;
            break;
          }
          var r = _r(n);
          r !== null && (t.splice(e, 3), (e -= 3), mf(r, { pending: !0, data: i, method: n.method, action: l }, l, i));
        }
      }));
  }
  function Ya(t) {
    function e(s) {
      return Go(s, t);
    }
    (Il !== null && Go(Il, t), jl !== null && Go(jl, t), Yl !== null && Go(Yl, t), Ia.forEach(e), ja.forEach(e));
    for (var n = 0; n < Ml.length; n++) {
      var l = Ml[n];
      l.blockedOn === t && (l.blockedOn = null);
    }
    for (; 0 < Ml.length && ((n = Ml[0]), n.blockedOn === null);) (Xv(n), n.blockedOn === null && Ml.shift());
    if (((n = (t.ownerDocument || t).$$reactFormReplay), n != null))
      for (l = 0; l < n.length; l += 3) {
        var i = n[l],
          r = n[l + 1],
          a = i[an] || null;
        if (typeof r == "function") a || mg(n);
        else if (a) {
          var o = null;
          if (r && r.hasAttribute("formAction")) {
            if (((i = r), (a = r[an] || null))) o = a.formAction;
            else if (Ad(i) !== null) continue;
          } else o = a.action;
          (typeof o == "function" ? (n[l + 1] = o) : (n.splice(l, 3), (l -= 3)), mg(n));
        }
      }
  }
  function Nd(t) {
    this._internalRoot = t;
  }
  $s.prototype.render = Nd.prototype.render = function (t) {
    var e = this._internalRoot;
    if (e === null) throw Error(O(409));
    var n = e.current,
      l = gn();
    Qv(n, l, t, e, null, null);
  };
  $s.prototype.unmount = Nd.prototype.unmount = function () {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      (Qv(t.current, 2, null, t, null, null), Xs(), (e[Dr] = null));
    }
  };
  function $s(t) {
    this._internalRoot = t;
  }
  $s.prototype.unstable_scheduleHydration = function (t) {
    if (t) {
      var e = Ng();
      t = { blockedOn: null, target: t, priority: e };
      for (var n = 0; n < Ml.length && e !== 0 && e < Ml[n].priority; n++);
      (Ml.splice(n, 0, t), n === 0 && Xv(t));
    }
  };
  var pg = hg.version;
  if (pg !== "19.1.1") throw Error(O(527, pg, "19.1.1"));
  Lt.findDOMNode = function (t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(O(188)) : ((t = Object.keys(t).join(",")), Error(O(268, t)));
    return ((t = ak(e)), (t = t !== null ? vg(t) : null), (t = t === null ? null : t.stateNode), t);
  };
  var Rw = {
    bundleType: 0,
    version: "19.1.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: at,
    reconcilerVersion: "19.1.1",
  };
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" &&
    ((ca = __REACT_DEVTOOLS_GLOBAL_HOOK__), !ca.isDisabled && ca.supportsFiber)
  )
    try {
      ((Va = ca.inject(Rw)), (pn = ca));
    } catch {}
  var ca;
  Ws.createRoot = function (t, e) {
    if (!gg(t)) throw Error(O(299));
    var n = !1,
      l = "",
      i = Fy,
      r = Vy,
      a = Qy,
      o = null;
    return (
      e != null &&
        (e.unstable_strictMode === !0 && (n = !0),
        e.identifierPrefix !== void 0 && (l = e.identifierPrefix),
        e.onUncaughtError !== void 0 && (i = e.onUncaughtError),
        e.onCaughtError !== void 0 && (r = e.onCaughtError),
        e.onRecoverableError !== void 0 && (a = e.onRecoverableError),
        e.unstable_transitionCallbacks !== void 0 && (o = e.unstable_transitionCallbacks)),
      (e = Fv(t, 1, !1, null, null, n, l, i, r, a, o, null)),
      (t[Dr] = e.current),
      Sd(t),
      new Nd(e)
    );
  };
  Ws.hydrateRoot = function (t, e, n) {
    if (!gg(t)) throw Error(O(299));
    var l = !1,
      i = "",
      r = Fy,
      a = Vy,
      o = Qy,
      s = null,
      u = null;
    return (
      n != null &&
        (n.unstable_strictMode === !0 && (l = !0),
        n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
        n.onUncaughtError !== void 0 && (r = n.onUncaughtError),
        n.onCaughtError !== void 0 && (a = n.onCaughtError),
        n.onRecoverableError !== void 0 && (o = n.onRecoverableError),
        n.unstable_transitionCallbacks !== void 0 && (s = n.unstable_transitionCallbacks),
        n.formState !== void 0 && (u = n.formState)),
      (e = Fv(t, 1, !0, e, n ?? null, l, i, r, a, o, s, u)),
      (e.context = Vv(null)),
      (n = e.current),
      (l = gn()),
      (l = Hf(l)),
      (i = Ul(l)),
      (i.callback = null),
      Bl(n, i, l),
      (n = l),
      (e.current.lanes = n),
      Pa(e, n),
      Zn(e),
      (t[Dr] = e.current),
      Sd(t),
      new $s(e)
    );
  };
  Ws.version = "19.1.1";
});
var $v = Ze((iR, Jv) => {
  "use strict";
  function Kv() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Kv);
      } catch (t) {
        console.error(t);
      }
  }
  (Kv(), (Jv.exports = Zv()));
});
var pb = Ze((u2, mb) => {
  "use strict";
  var ub = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,
    Iw = /\n/g,
    jw = /^\s*/,
    Yw = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,
    Fw = /^:\s*/,
    Vw = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,
    Qw = /^[;\s]*/,
    Pw = /^\s+|\s+$/g,
    Gw = `
`,
    cb = "/",
    fb = "*",
    Ni = "",
    Xw = "comment",
    Zw = "declaration";
  function Kw(t, e) {
    if (typeof t != "string") throw new TypeError("First argument must be a string");
    if (!t) return [];
    e = e || {};
    var n = 1,
      l = 1;
    function i(g) {
      var x = g.match(Iw);
      x && (n += x.length);
      var C = g.lastIndexOf(Gw);
      l = ~C ? g.length - C : l + g.length;
    }
    function r() {
      var g = { line: n, column: l };
      return function (x) {
        return ((x.position = new a(g)), u(), x);
      };
    }
    function a(g) {
      ((this.start = g), (this.end = { line: n, column: l }), (this.source = e.source));
    }
    a.prototype.content = t;
    function o(g) {
      var x = new Error(e.source + ":" + n + ":" + l + ": " + g);
      if (((x.reason = g), (x.filename = e.source), (x.line = n), (x.column = l), (x.source = t), !e.silent)) throw x;
    }
    function s(g) {
      var x = g.exec(t);
      if (x) {
        var C = x[0];
        return (i(C), (t = t.slice(C.length)), x);
      }
    }
    function u() {
      s(jw);
    }
    function f(g) {
      var x;
      for (g = g || []; (x = c());) x !== !1 && g.push(x);
      return g;
    }
    function c() {
      var g = r();
      if (!(cb != t.charAt(0) || fb != t.charAt(1))) {
        for (var x = 2; Ni != t.charAt(x) && (fb != t.charAt(x) || cb != t.charAt(x + 1));) ++x;
        if (((x += 2), Ni === t.charAt(x - 1))) return o("End of comment missing");
        var C = t.slice(2, x - 2);
        return ((l += 2), i(C), (t = t.slice(x)), (l += 2), g({ type: Xw, comment: C }));
      }
    }
    function m() {
      var g = r(),
        x = s(Yw);
      if (x) {
        if ((c(), !s(Fw))) return o("property missing ':'");
        var C = s(Vw),
          h = g({ type: Zw, property: db(x[0].replace(ub, Ni)), value: C ? db(C[0].replace(ub, Ni)) : Ni });
        return (s(Qw), h);
      }
    }
    function d() {
      var g = [];
      f(g);
      for (var x; (x = m());) x !== !1 && (g.push(x), f(g));
      return g;
    }
    return (u(), d());
  }
  function db(t) {
    return t ? t.replace(Pw, Ni) : Ni;
  }
  mb.exports = Kw;
});
var hb = Ze((oo) => {
  "use strict";
  var Jw =
    (oo && oo.__importDefault) ||
    function (t) {
      return t && t.__esModule ? t : { default: t };
    };
  Object.defineProperty(oo, "__esModule", { value: !0 });
  oo.default = Ww;
  var $w = Jw(pb());
  function Ww(t, e) {
    let n = null;
    if (!t || typeof t != "string") return n;
    let l = (0, $w.default)(t),
      i = typeof e == "function";
    return (
      l.forEach((r) => {
        if (r.type !== "declaration") return;
        let { property: a, value: o } = r;
        i ? e(a, o, r) : o && ((n = n || {}), (n[a] = o));
      }),
      n
    );
  }
});
var yb = Ze((au) => {
  "use strict";
  Object.defineProperty(au, "__esModule", { value: !0 });
  au.camelCase = void 0;
  var tT = /^--[a-zA-Z0-9_-]+$/,
    eT = /-([a-z])/g,
    nT = /^[^-]+$/,
    lT = /^-(webkit|moz|ms|o|khtml)-/,
    iT = /^-(ms)-/,
    rT = function (t) {
      return !t || nT.test(t) || tT.test(t);
    },
    aT = function (t, e) {
      return e.toUpperCase();
    },
    gb = function (t, e) {
      return "".concat(e, "-");
    },
    oT = function (t, e) {
      return (
        e === void 0 && (e = {}),
        rT(t)
          ? t
          : ((t = t.toLowerCase()),
            e.reactCompat ? (t = t.replace(iT, gb)) : (t = t.replace(lT, gb)),
            t.replace(eT, aT))
      );
    };
  au.camelCase = oT;
});
var bb = Ze((Id, vb) => {
  "use strict";
  var sT =
      (Id && Id.__importDefault) ||
      function (t) {
        return t && t.__esModule ? t : { default: t };
      },
    uT = sT(hb()),
    cT = yb();
  function qd(t, e) {
    var n = {};
    return (
      !t ||
        typeof t != "string" ||
        (0, uT.default)(t, function (l, i) {
          l && i && (n[(0, cT.camelCase)(l, e)] = i);
        }),
      n
    );
  }
  qd.default = qd;
  vb.exports = qd;
});
var Rb = Ze((su) => {
  "use strict";
  var MT = Symbol.for("react.transitional.element"),
    DT = Symbol.for("react.fragment");
  function Nb(t, e, n) {
    var l = null;
    if ((n !== void 0 && (l = "" + n), e.key !== void 0 && (l = "" + e.key), "key" in e)) {
      n = {};
      for (var i in e) i !== "key" && (n[i] = e[i]);
    } else n = e;
    return ((e = n.ref), { $$typeof: MT, type: t, key: l, ref: e !== void 0 ? e : null, props: n });
  }
  su.Fragment = DT;
  su.jsx = Nb;
  su.jsxs = Nb;
});
var it = Ze((U2, Mb) => {
  "use strict";
  Mb.exports = Rb();
});
var P0 = Ze((jz, Q0) => {
  "use strict";
  var Du = Object.prototype.hasOwnProperty,
    V0 = Object.prototype.toString,
    H0 = Object.defineProperty,
    q0 = Object.getOwnPropertyDescriptor,
    I0 = function (e) {
      return typeof Array.isArray == "function" ? Array.isArray(e) : V0.call(e) === "[object Array]";
    },
    j0 = function (e) {
      if (!e || V0.call(e) !== "[object Object]") return !1;
      var n = Du.call(e, "constructor"),
        l = e.constructor && e.constructor.prototype && Du.call(e.constructor.prototype, "isPrototypeOf");
      if (e.constructor && !n && !l) return !1;
      var i;
      for (i in e);
      return typeof i > "u" || Du.call(e, i);
    },
    Y0 = function (e, n) {
      H0 && n.name === "__proto__"
        ? H0(e, n.name, { enumerable: !0, configurable: !0, value: n.newValue, writable: !0 })
        : (e[n.name] = n.newValue);
    },
    F0 = function (e, n) {
      if (n === "__proto__")
        if (Du.call(e, n)) {
          if (q0) return q0(e, n).value;
        } else return;
      return e[n];
    };
  Q0.exports = function t() {
    var e,
      n,
      l,
      i,
      r,
      a,
      o = arguments[0],
      s = 1,
      u = arguments.length,
      f = !1;
    for (
      typeof o == "boolean" && ((f = o), (o = arguments[1] || {}), (s = 2)),
        (o == null || (typeof o != "object" && typeof o != "function")) && (o = {});
      s < u;
      ++s
    )
      if (((e = arguments[s]), e != null))
        for (n in e)
          ((l = F0(o, n)),
            (i = F0(e, n)),
            o !== i &&
              (f && i && (j0(i) || (r = I0(i)))
                ? (r ? ((r = !1), (a = l && I0(l) ? l : [])) : (a = l && j0(l) ? l : {}),
                  Y0(o, { name: n, newValue: t(f, a, i) }))
                : typeof i < "u" && Y0(o, { name: n, newValue: i })));
    return o;
  };
});
var Dx = G(le(), 1),
  _x = G($v(), 1);
var Mt = G(le(), 1);
function Wv() {
  return window.__GAMECOWORK__ ?? {};
}
function Rd(t) {
  return t.mode ?? "chat";
}
function tu(t) {
  return t.controlPlaneApiBase ?? "/__gamecowork__/control-plane";
}
function Mw(t) {
  return t.resumeSessionId ? t.resumeSessionId : window.location.pathname.match(/^\/resume-session\/([^/]+)$/)?.[1];
}
function tb(t) {
  let e = Mw(t);
  if (e)
    return (
      window.location.pathname !== `/resume-session/${e}` &&
        window.history.replaceState({}, "", `/resume-session/${e}`),
      e
    );
}
var Q1 = G(le(), 1);
function eb(t, e) {
  let n = e || {};
  return (t[t.length - 1] === "" ? [...t, ""] : t)
    .join((n.padRight ? " " : "") + "," + (n.padLeft === !1 ? "" : " "))
    .trim();
}
var Dw = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,
  _w = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,
  Ow = {};
function eu(t, e) {
  return ((e || Ow).jsx ? _w : Dw).test(t);
}
var zw = /[ \t\n\f\r]/g;
function Md(t) {
  return typeof t == "object" ? (t.type === "text" ? nb(t.value) : !1) : nb(t);
}
function nb(t) {
  return t.replace(zw, "") === "";
}
var vl = class {
  constructor(e, n, l) {
    ((this.normal = n), (this.property = e), l && (this.space = l));
  }
};
vl.prototype.normal = {};
vl.prototype.property = {};
vl.prototype.space = void 0;
function Dd(t, e) {
  let n = {},
    l = {};
  for (let i of t) (Object.assign(n, i.property), Object.assign(l, i.normal));
  return new vl(n, l, e);
}
function ro(t) {
  return t.toLowerCase();
}
var Oe = class {
  constructor(e, n) {
    ((this.attribute = n), (this.property = e));
  }
};
Oe.prototype.attribute = "";
Oe.prototype.booleanish = !1;
Oe.prototype.boolean = !1;
Oe.prototype.commaOrSpaceSeparated = !1;
Oe.prototype.commaSeparated = !1;
Oe.prototype.defined = !1;
Oe.prototype.mustUseProperty = !1;
Oe.prototype.number = !1;
Oe.prototype.overloadedBoolean = !1;
Oe.prototype.property = "";
Oe.prototype.spaceSeparated = !1;
Oe.prototype.space = void 0;
var ao = {};
vp(ao, {
  boolean: () => ct,
  booleanish: () => ae,
  commaOrSpaceSeparated: () => sn,
  commaSeparated: () => Xl,
  number: () => B,
  overloadedBoolean: () => nu,
  spaceSeparated: () => It,
});
var Lw = 0,
  ct = Ci(),
  ae = Ci(),
  nu = Ci(),
  B = Ci(),
  It = Ci(),
  Xl = Ci(),
  sn = Ci();
function Ci() {
  return 2 ** ++Lw;
}
var _d = Object.keys(ao),
  Ai = class extends Oe {
    constructor(e, n, l, i) {
      let r = -1;
      if ((super(e, n), lb(this, "space", i), typeof l == "number"))
        for (; ++r < _d.length;) {
          let a = _d[r];
          lb(this, _d[r], (l & ao[a]) === ao[a]);
        }
    }
  };
Ai.prototype.defined = !0;
function lb(t, e, n) {
  n && (t[e] = n);
}
function On(t) {
  let e = {},
    n = {};
  for (let [l, i] of Object.entries(t.properties)) {
    let r = new Ai(l, t.transform(t.attributes || {}, l), i, t.space);
    (t.mustUseProperty && t.mustUseProperty.includes(l) && (r.mustUseProperty = !0),
      (e[l] = r),
      (n[ro(l)] = l),
      (n[ro(r.attribute)] = l));
  }
  return new vl(e, n, t.space);
}
var Od = On({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: ae,
    ariaAutoComplete: null,
    ariaBusy: ae,
    ariaChecked: ae,
    ariaColCount: B,
    ariaColIndex: B,
    ariaColSpan: B,
    ariaControls: It,
    ariaCurrent: null,
    ariaDescribedBy: It,
    ariaDetails: null,
    ariaDisabled: ae,
    ariaDropEffect: It,
    ariaErrorMessage: null,
    ariaExpanded: ae,
    ariaFlowTo: It,
    ariaGrabbed: ae,
    ariaHasPopup: null,
    ariaHidden: ae,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: It,
    ariaLevel: B,
    ariaLive: null,
    ariaModal: ae,
    ariaMultiLine: ae,
    ariaMultiSelectable: ae,
    ariaOrientation: null,
    ariaOwns: It,
    ariaPlaceholder: null,
    ariaPosInSet: B,
    ariaPressed: ae,
    ariaReadOnly: ae,
    ariaRelevant: null,
    ariaRequired: ae,
    ariaRoleDescription: It,
    ariaRowCount: B,
    ariaRowIndex: B,
    ariaRowSpan: B,
    ariaSelected: ae,
    ariaSetSize: B,
    ariaSort: null,
    ariaValueMax: B,
    ariaValueMin: B,
    ariaValueNow: B,
    ariaValueText: null,
    role: null,
  },
  transform(t, e) {
    return e === "role" ? e : "aria-" + e.slice(4).toLowerCase();
  },
});
function lu(t, e) {
  return e in t ? t[e] : e;
}
function iu(t, e) {
  return lu(t, e.toLowerCase());
}
var ib = On({
  attributes: { acceptcharset: "accept-charset", classname: "class", htmlfor: "for", httpequiv: "http-equiv" },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    abbr: null,
    accept: Xl,
    acceptCharset: It,
    accessKey: It,
    action: null,
    allow: null,
    allowFullScreen: ct,
    allowPaymentRequest: ct,
    allowUserMedia: ct,
    alt: null,
    as: null,
    async: ct,
    autoCapitalize: null,
    autoComplete: It,
    autoFocus: ct,
    autoPlay: ct,
    blocking: It,
    capture: null,
    charSet: null,
    checked: ct,
    cite: null,
    className: It,
    cols: B,
    colSpan: null,
    content: null,
    contentEditable: ae,
    controls: ct,
    controlsList: It,
    coords: B | Xl,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: ct,
    defer: ct,
    dir: null,
    dirName: null,
    disabled: ct,
    download: nu,
    draggable: ae,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: ct,
    formTarget: null,
    headers: It,
    height: B,
    hidden: nu,
    high: B,
    href: null,
    hrefLang: null,
    htmlFor: It,
    httpEquiv: It,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: ct,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: ct,
    itemId: null,
    itemProp: It,
    itemRef: It,
    itemScope: ct,
    itemType: It,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: ct,
    low: B,
    manifest: null,
    max: null,
    maxLength: B,
    media: null,
    method: null,
    min: null,
    minLength: B,
    multiple: ct,
    muted: ct,
    name: null,
    nonce: null,
    noModule: ct,
    noValidate: ct,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: ct,
    optimum: B,
    pattern: null,
    ping: It,
    placeholder: null,
    playsInline: ct,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: ct,
    referrerPolicy: null,
    rel: It,
    required: ct,
    reversed: ct,
    rows: B,
    rowSpan: B,
    sandbox: It,
    scope: null,
    scoped: ct,
    seamless: ct,
    selected: ct,
    shadowRootClonable: ct,
    shadowRootDelegatesFocus: ct,
    shadowRootMode: null,
    shape: null,
    size: B,
    sizes: null,
    slot: null,
    span: B,
    spellCheck: ae,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: B,
    step: null,
    style: null,
    tabIndex: B,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: ct,
    useMap: null,
    value: ae,
    width: B,
    wrap: null,
    writingSuggestions: null,
    align: null,
    aLink: null,
    archive: It,
    axis: null,
    background: null,
    bgColor: null,
    border: B,
    borderColor: null,
    bottomMargin: B,
    cellPadding: null,
    cellSpacing: null,
    char: null,
    charOff: null,
    classId: null,
    clear: null,
    code: null,
    codeBase: null,
    codeType: null,
    color: null,
    compact: ct,
    declare: ct,
    event: null,
    face: null,
    frame: null,
    frameBorder: null,
    hSpace: B,
    leftMargin: B,
    link: null,
    longDesc: null,
    lowSrc: null,
    marginHeight: B,
    marginWidth: B,
    noResize: ct,
    noHref: ct,
    noShade: ct,
    noWrap: ct,
    object: null,
    profile: null,
    prompt: null,
    rev: null,
    rightMargin: B,
    rules: null,
    scheme: null,
    scrolling: ae,
    standby: null,
    summary: null,
    text: null,
    topMargin: B,
    valueType: null,
    version: null,
    vAlign: null,
    vLink: null,
    vSpace: B,
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    disablePictureInPicture: ct,
    disableRemotePlayback: ct,
    prefix: null,
    property: null,
    results: B,
    security: null,
    unselectable: null,
  },
  space: "html",
  transform: iu,
});
var rb = On({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin",
  },
  properties: {
    about: sn,
    accentHeight: B,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: B,
    amplitude: B,
    arabicForm: null,
    ascent: B,
    attributeName: null,
    attributeType: null,
    azimuth: B,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: B,
    by: null,
    calcMode: null,
    capHeight: B,
    className: It,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: B,
    diffuseConstant: B,
    direction: null,
    display: null,
    dur: null,
    divisor: B,
    dominantBaseline: null,
    download: ct,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: B,
    enableBackground: null,
    end: null,
    event: null,
    exponent: B,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: B,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: Xl,
    g2: Xl,
    glyphName: Xl,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: B,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: B,
    horizOriginX: B,
    horizOriginY: B,
    id: null,
    ideographic: B,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: B,
    k: B,
    k1: B,
    k2: B,
    k3: B,
    k4: B,
    kernelMatrix: sn,
    kernelUnitLength: null,
    keyPoints: null,
    keySplines: null,
    keyTimes: null,
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: B,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: B,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: B,
    overlineThickness: B,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: B,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: It,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: B,
    pointsAtY: B,
    pointsAtZ: B,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: sn,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: sn,
    rev: sn,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: sn,
    requiredFeatures: sn,
    requiredFonts: sn,
    requiredFormats: sn,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: B,
    specularExponent: B,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: B,
    strikethroughThickness: B,
    string: null,
    stroke: null,
    strokeDashArray: sn,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: B,
    strokeOpacity: B,
    strokeWidth: null,
    style: null,
    surfaceScale: B,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: sn,
    tabIndex: B,
    tableValues: null,
    target: null,
    targetX: B,
    targetY: B,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: sn,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: B,
    underlineThickness: B,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: B,
    values: null,
    vAlphabetic: B,
    vMathematical: B,
    vectorEffect: null,
    vHanging: B,
    vIdeographic: B,
    version: null,
    vertAdvY: B,
    vertOriginX: B,
    vertOriginY: B,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: B,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null,
  },
  space: "svg",
  transform: lu,
});
var zd = On({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null,
  },
  space: "xlink",
  transform(t, e) {
    return "xlink:" + e.slice(5).toLowerCase();
  },
});
var Ld = On({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: iu,
});
var Ud = On({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(t, e) {
    return "xml:" + e.slice(3).toLowerCase();
  },
});
var Bd = {
  classId: "classID",
  dataType: "datatype",
  itemId: "itemID",
  strokeDashArray: "strokeDasharray",
  strokeDashOffset: "strokeDashoffset",
  strokeLineCap: "strokeLinecap",
  strokeLineJoin: "strokeLinejoin",
  strokeMiterLimit: "strokeMiterlimit",
  typeOf: "typeof",
  xLinkActuate: "xlinkActuate",
  xLinkArcRole: "xlinkArcrole",
  xLinkHref: "xlinkHref",
  xLinkRole: "xlinkRole",
  xLinkShow: "xlinkShow",
  xLinkTitle: "xlinkTitle",
  xLinkType: "xlinkType",
  xmlnsXLink: "xmlnsXlink",
};
var Uw = /[A-Z]/g,
  ab = /-[a-z]/g,
  Bw = /^data[-\w.:]+$/i;
function Hd(t, e) {
  let n = ro(e),
    l = e,
    i = Oe;
  if (n in t.normal) return t.property[t.normal[n]];
  if (n.length > 4 && n.slice(0, 4) === "data" && Bw.test(e)) {
    if (e.charAt(4) === "-") {
      let r = e.slice(5).replace(ab, qw);
      l = "data" + r.charAt(0).toUpperCase() + r.slice(1);
    } else {
      let r = e.slice(4);
      if (!ab.test(r)) {
        let a = r.replace(Uw, Hw);
        (a.charAt(0) !== "-" && (a = "-" + a), (e = "data" + a));
      }
    }
    i = Ai;
  }
  return new i(l, e);
}
function Hw(t) {
  return "-" + t.toLowerCase();
}
function qw(t) {
  return t.charAt(1).toUpperCase();
}
var ob = Dd([Od, ib, zd, Ld, Ud], "html"),
  ru = Dd([Od, rb, zd, Ld, Ud], "svg");
function sb(t) {
  return t.join(" ").trim();
}
var wb = G(bb(), 1);
var ou = xb("end"),
  Br = xb("start");
function xb(t) {
  return e;
  function e(n) {
    let l = (n && n.position && n.position[t]) || {};
    if (typeof l.line == "number" && l.line > 0 && typeof l.column == "number" && l.column > 0)
      return {
        line: l.line,
        column: l.column,
        offset: typeof l.offset == "number" && l.offset > -1 ? l.offset : void 0,
      };
  }
}
function jd(t) {
  let e = Br(t),
    n = ou(t);
  if (e && n) return { start: e, end: n };
}
function Zl(t) {
  return !t || typeof t != "object"
    ? ""
    : "position" in t || "type" in t
      ? kb(t.position)
      : "start" in t || "end" in t
        ? kb(t)
        : "line" in t || "column" in t
          ? Yd(t)
          : "";
}
function Yd(t) {
  return Sb(t && t.line) + ":" + Sb(t && t.column);
}
function kb(t) {
  return Yd(t && t.start) + "-" + Yd(t && t.end);
}
function Sb(t) {
  return t && typeof t == "number" ? t : 1;
}
var fe = class extends Error {
  constructor(e, n, l) {
    (super(), typeof n == "string" && ((l = n), (n = void 0)));
    let i = "",
      r = {},
      a = !1;
    if (
      (n &&
        ("line" in n && "column" in n
          ? (r = { place: n })
          : "start" in n && "end" in n
            ? (r = { place: n })
            : "type" in n
              ? (r = { ancestors: [n], place: n.position })
              : (r = { ...n })),
      typeof e == "string" ? (i = e) : !r.cause && e && ((a = !0), (i = e.message), (r.cause = e)),
      !r.ruleId && !r.source && typeof l == "string")
    ) {
      let s = l.indexOf(":");
      s === -1 ? (r.ruleId = l) : ((r.source = l.slice(0, s)), (r.ruleId = l.slice(s + 1)));
    }
    if (!r.place && r.ancestors && r.ancestors) {
      let s = r.ancestors[r.ancestors.length - 1];
      s && (r.place = s.position);
    }
    let o = r.place && "start" in r.place ? r.place.start : r.place;
    ((this.ancestors = r.ancestors || void 0),
      (this.cause = r.cause || void 0),
      (this.column = o ? o.column : void 0),
      (this.fatal = void 0),
      (this.file = ""),
      (this.message = i),
      (this.line = o ? o.line : void 0),
      (this.name = Zl(r.place) || "1:1"),
      (this.place = r.place || void 0),
      (this.reason = this.message),
      (this.ruleId = r.ruleId || void 0),
      (this.source = r.source || void 0),
      (this.stack = a && r.cause && typeof r.cause.stack == "string" ? r.cause.stack : ""),
      (this.actual = void 0),
      (this.expected = void 0),
      (this.note = void 0),
      (this.url = void 0));
  }
};
fe.prototype.file = "";
fe.prototype.name = "";
fe.prototype.reason = "";
fe.prototype.message = "";
fe.prototype.stack = "";
fe.prototype.column = void 0;
fe.prototype.line = void 0;
fe.prototype.ancestors = void 0;
fe.prototype.cause = void 0;
fe.prototype.fatal = void 0;
fe.prototype.place = void 0;
fe.prototype.ruleId = void 0;
fe.prototype.source = void 0;
var Fd = {}.hasOwnProperty,
  fT = new Map(),
  dT = /[A-Z]/g,
  mT = new Set(["table", "tbody", "thead", "tfoot", "tr"]),
  pT = new Set(["td", "th"]),
  Tb = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function Vd(t, e) {
  if (!e || e.Fragment === void 0) throw new TypeError("Expected `Fragment` in options");
  let n = e.filePath || void 0,
    l;
  if (e.development) {
    if (typeof e.jsxDEV != "function") throw new TypeError("Expected `jsxDEV` in options when `development: true`");
    l = ST(n, e.jsxDEV);
  } else {
    if (typeof e.jsx != "function") throw new TypeError("Expected `jsx` in production options");
    if (typeof e.jsxs != "function") throw new TypeError("Expected `jsxs` in production options");
    l = kT(n, e.jsx, e.jsxs);
  }
  let i = {
      Fragment: e.Fragment,
      ancestors: [],
      components: e.components || {},
      create: l,
      elementAttributeNameCase: e.elementAttributeNameCase || "react",
      evaluater: e.createEvaluater ? e.createEvaluater() : void 0,
      filePath: n,
      ignoreInvalidStyle: e.ignoreInvalidStyle || !1,
      passKeys: e.passKeys !== !1,
      passNode: e.passNode || !1,
      schema: e.space === "svg" ? ru : ob,
      stylePropertyNameCase: e.stylePropertyNameCase || "dom",
      tableCellAlignToStyle: e.tableCellAlignToStyle !== !1,
    },
    r = Eb(i, t, void 0);
  return r && typeof r != "string" ? r : i.create(t, i.Fragment, { children: r || void 0 }, void 0);
}
function Eb(t, e, n) {
  if (e.type === "element") return hT(t, e, n);
  if (e.type === "mdxFlowExpression" || e.type === "mdxTextExpression") return gT(t, e);
  if (e.type === "mdxJsxFlowElement" || e.type === "mdxJsxTextElement") return vT(t, e, n);
  if (e.type === "mdxjsEsm") return yT(t, e);
  if (e.type === "root") return bT(t, e, n);
  if (e.type === "text") return xT(t, e);
}
function hT(t, e, n) {
  let l = t.schema,
    i = l;
  (e.tagName.toLowerCase() === "svg" && l.space === "html" && ((i = ru), (t.schema = i)), t.ancestors.push(e));
  let r = Ab(t, e.tagName, !1),
    a = wT(t, e),
    o = Pd(t, e);
  return (
    mT.has(e.tagName) &&
      (o = o.filter(function (s) {
        return typeof s == "string" ? !Md(s) : !0;
      })),
    Cb(t, a, r, e),
    Qd(a, o),
    t.ancestors.pop(),
    (t.schema = l),
    t.create(e, r, a, n)
  );
}
function gT(t, e) {
  if (e.data && e.data.estree && t.evaluater) {
    let l = e.data.estree.body[0];
    return (l.type, t.evaluater.evaluateExpression(l.expression));
  }
  so(t, e.position);
}
function yT(t, e) {
  if (e.data && e.data.estree && t.evaluater) return t.evaluater.evaluateProgram(e.data.estree);
  so(t, e.position);
}
function vT(t, e, n) {
  let l = t.schema,
    i = l;
  (e.name === "svg" && l.space === "html" && ((i = ru), (t.schema = i)), t.ancestors.push(e));
  let r = e.name === null ? t.Fragment : Ab(t, e.name, !0),
    a = TT(t, e),
    o = Pd(t, e);
  return (Cb(t, a, r, e), Qd(a, o), t.ancestors.pop(), (t.schema = l), t.create(e, r, a, n));
}
function bT(t, e, n) {
  let l = {};
  return (Qd(l, Pd(t, e)), t.create(e, t.Fragment, l, n));
}
function xT(t, e) {
  return e.value;
}
function Cb(t, e, n, l) {
  typeof n != "string" && n !== t.Fragment && t.passNode && (e.node = l);
}
function Qd(t, e) {
  if (e.length > 0) {
    let n = e.length > 1 ? e : e[0];
    n && (t.children = n);
  }
}
function kT(t, e, n) {
  return l;
  function l(i, r, a, o) {
    let u = Array.isArray(a.children) ? n : e;
    return o ? u(r, a, o) : u(r, a);
  }
}
function ST(t, e) {
  return n;
  function n(l, i, r, a) {
    let o = Array.isArray(r.children),
      s = Br(l);
    return e(
      i,
      r,
      a,
      o,
      { columnNumber: s ? s.column - 1 : void 0, fileName: t, lineNumber: s ? s.line : void 0 },
      void 0,
    );
  }
}
function wT(t, e) {
  let n = {},
    l,
    i;
  for (i in e.properties)
    if (i !== "children" && Fd.call(e.properties, i)) {
      let r = ET(t, i, e.properties[i]);
      if (r) {
        let [a, o] = r;
        t.tableCellAlignToStyle && a === "align" && typeof o == "string" && pT.has(e.tagName) ? (l = o) : (n[a] = o);
      }
    }
  if (l) {
    let r = n.style || (n.style = {});
    r[t.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = l;
  }
  return n;
}
function TT(t, e) {
  let n = {};
  for (let l of e.attributes)
    if (l.type === "mdxJsxExpressionAttribute")
      if (l.data && l.data.estree && t.evaluater) {
        let r = l.data.estree.body[0];
        r.type;
        let a = r.expression;
        a.type;
        let o = a.properties[0];
        (o.type, Object.assign(n, t.evaluater.evaluateExpression(o.argument)));
      } else so(t, e.position);
    else {
      let i = l.name,
        r;
      if (l.value && typeof l.value == "object")
        if (l.value.data && l.value.data.estree && t.evaluater) {
          let o = l.value.data.estree.body[0];
          (o.type, (r = t.evaluater.evaluateExpression(o.expression)));
        } else so(t, e.position);
      else r = l.value === null ? !0 : l.value;
      n[i] = r;
    }
  return n;
}
function Pd(t, e) {
  let n = [],
    l = -1,
    i = t.passKeys ? new Map() : fT;
  for (; ++l < e.children.length;) {
    let r = e.children[l],
      a;
    if (t.passKeys) {
      let s =
        r.type === "element"
          ? r.tagName
          : r.type === "mdxJsxFlowElement" || r.type === "mdxJsxTextElement"
            ? r.name
            : void 0;
      if (s) {
        let u = i.get(s) || 0;
        ((a = s + "-" + u), i.set(s, u + 1));
      }
    }
    let o = Eb(t, r, a);
    o !== void 0 && n.push(o);
  }
  return n;
}
function ET(t, e, n) {
  let l = Hd(t.schema, e);
  if (!(n == null || (typeof n == "number" && Number.isNaN(n)))) {
    if ((Array.isArray(n) && (n = l.commaSeparated ? eb(n) : sb(n)), l.property === "style")) {
      let i = typeof n == "object" ? n : CT(t, String(n));
      return (t.stylePropertyNameCase === "css" && (i = AT(i)), ["style", i]);
    }
    return [t.elementAttributeNameCase === "react" && l.space ? Bd[l.property] || l.property : l.attribute, n];
  }
}
function CT(t, e) {
  try {
    return (0, wb.default)(e, { reactCompat: !0 });
  } catch (n) {
    if (t.ignoreInvalidStyle) return {};
    let l = n,
      i = new fe("Cannot parse `style` attribute", {
        ancestors: t.ancestors,
        cause: l,
        ruleId: "style",
        source: "hast-util-to-jsx-runtime",
      });
    throw ((i.file = t.filePath || void 0), (i.url = Tb + "#cannot-parse-style-attribute"), i);
  }
}
function Ab(t, e, n) {
  let l;
  if (!n) l = { type: "Literal", value: e };
  else if (e.includes(".")) {
    let i = e.split("."),
      r = -1,
      a;
    for (; ++r < i.length;) {
      let o = eu(i[r]) ? { type: "Identifier", name: i[r] } : { type: "Literal", value: i[r] };
      a = a
        ? { type: "MemberExpression", object: a, property: o, computed: !!(r && o.type === "Literal"), optional: !1 }
        : o;
    }
    l = a;
  } else l = eu(e) && !/^[a-z]/.test(e) ? { type: "Identifier", name: e } : { type: "Literal", value: e };
  if (l.type === "Literal") {
    let i = l.value;
    return Fd.call(t.components, i) ? t.components[i] : i;
  }
  if (t.evaluater) return t.evaluater.evaluateExpression(l);
  so(t);
}
function so(t, e) {
  let n = new fe("Cannot handle MDX estrees without `createEvaluater`", {
    ancestors: t.ancestors,
    place: e,
    ruleId: "mdx-estree",
    source: "hast-util-to-jsx-runtime",
  });
  throw ((n.file = t.filePath || void 0), (n.url = Tb + "#cannot-handle-mdx-estrees-without-createevaluater"), n);
}
function AT(t) {
  let e = {},
    n;
  for (n in t) Fd.call(t, n) && (e[NT(n)] = t[n]);
  return e;
}
function NT(t) {
  let e = t.replace(dT, RT);
  return (e.slice(0, 3) === "ms-" && (e = "-" + e), e);
}
function RT(t) {
  return "-" + t.toLowerCase();
}
var uo = {
  action: ["form"],
  cite: ["blockquote", "del", "ins", "q"],
  data: ["object"],
  formAction: ["button", "input"],
  href: ["a", "area", "base", "link"],
  icon: ["menuitem"],
  itemId: null,
  manifest: ["html"],
  ping: ["a", "area"],
  poster: ["video"],
  src: ["audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"],
};
var Yr = G(it(), 1),
  n1 = G(le(), 1);
var _T = {};
function Ri(t, e) {
  let n = e || _T,
    l = typeof n.includeImageAlt == "boolean" ? n.includeImageAlt : !0,
    i = typeof n.includeHtml == "boolean" ? n.includeHtml : !0;
  return _b(t, l, i);
}
function _b(t, e, n) {
  if (OT(t)) {
    if ("value" in t) return t.type === "html" && !n ? "" : t.value;
    if (e && "alt" in t && t.alt) return t.alt;
    if ("children" in t) return Db(t.children, e, n);
  }
  return Array.isArray(t) ? Db(t, e, n) : "";
}
function Db(t, e, n) {
  let l = [],
    i = -1;
  for (; ++i < t.length;) l[i] = _b(t[i], e, n);
  return l.join("");
}
function OT(t) {
  return !!(t && typeof t == "object");
}
var Ob = document.createElement("i");
function Hr(t) {
  let e = "&" + t + ";";
  Ob.innerHTML = e;
  let n = Ob.textContent;
  return (n.charCodeAt(n.length - 1) === 59 && t !== "semi") || n === e ? !1 : n;
}
function de(t, e, n, l) {
  let i = t.length,
    r = 0,
    a;
  if ((e < 0 ? (e = -e > i ? 0 : i + e) : (e = e > i ? i : e), (n = n > 0 ? n : 0), l.length < 1e4))
    ((a = Array.from(l)), a.unshift(e, n), t.splice(...a));
  else
    for (n && t.splice(e, n); r < l.length;)
      ((a = l.slice(r, r + 1e4)), a.unshift(e, 0), t.splice(...a), (r += 1e4), (e += 1e4));
}
function We(t, e) {
  return t.length > 0 ? (de(t, t.length, 0, e), t) : e;
}
var zb = {}.hasOwnProperty;
function uu(t) {
  let e = {},
    n = -1;
  for (; ++n < t.length;) zT(e, t[n]);
  return e;
}
function zT(t, e) {
  let n;
  for (n in e) {
    let i = (zb.call(t, n) ? t[n] : void 0) || (t[n] = {}),
      r = e[n],
      a;
    if (r)
      for (a in r) {
        zb.call(i, a) || (i[a] = []);
        let o = r[a];
        LT(i[a], Array.isArray(o) ? o : o ? [o] : []);
      }
  }
}
function LT(t, e) {
  let n = -1,
    l = [];
  for (; ++n < e.length;) (e[n].add === "after" ? t : l).push(e[n]);
  de(t, 0, 0, l);
}
function cu(t, e) {
  let n = Number.parseInt(t, e);
  return n < 9 ||
    n === 11 ||
    (n > 13 && n < 32) ||
    (n > 126 && n < 160) ||
    (n > 55295 && n < 57344) ||
    (n > 64975 && n < 65008) ||
    (n & 65535) === 65535 ||
    (n & 65535) === 65534 ||
    n > 1114111
    ? "\uFFFD"
    : String.fromCodePoint(n);
}
function Fe(t) {
  return t
    .replace(/[\t\n\r ]+/g, " ")
    .replace(/^ | $/g, "")
    .toLowerCase()
    .toUpperCase();
}
var Te = Kl(/[A-Za-z]/),
  oe = Kl(/[\dA-Za-z]/),
  Lb = Kl(/[#-'*+\--9=?A-Z^-~]/);
function Mi(t) {
  return t !== null && (t < 32 || t === 127);
}
var co = Kl(/\d/),
  Ub = Kl(/[\dA-Fa-f]/),
  Bb = Kl(/[!-/:-@[-`{-~]/);
function Q(t) {
  return t !== null && t < -2;
}
function yt(t) {
  return t !== null && (t < 0 || t === 32);
}
function lt(t) {
  return t === -2 || t === -1 || t === 32;
}
var Di = Kl(/\p{P}|\p{S}/u),
  Kn = Kl(/\s/);
function Kl(t) {
  return e;
  function e(n) {
    return n !== null && n > -1 && t.test(String.fromCharCode(n));
  }
}
function zn(t) {
  let e = [],
    n = -1,
    l = 0,
    i = 0;
  for (; ++n < t.length;) {
    let r = t.charCodeAt(n),
      a = "";
    if (r === 37 && oe(t.charCodeAt(n + 1)) && oe(t.charCodeAt(n + 2))) i = 2;
    else if (r < 128) /[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(r)) || (a = String.fromCharCode(r));
    else if (r > 55295 && r < 57344) {
      let o = t.charCodeAt(n + 1);
      r < 56320 && o > 56319 && o < 57344 ? ((a = String.fromCharCode(r, o)), (i = 1)) : (a = "\uFFFD");
    } else a = String.fromCharCode(r);
    (a && (e.push(t.slice(l, n), encodeURIComponent(a)), (l = n + i + 1), (a = "")), i && ((n += i), (i = 0)));
  }
  return e.join("") + t.slice(l);
}
function W(t, e, n, l) {
  let i = l ? l - 1 : Number.POSITIVE_INFINITY,
    r = 0;
  return a;
  function a(s) {
    return lt(s) ? (t.enter(n), o(s)) : e(s);
  }
  function o(s) {
    return lt(s) && r++ < i ? (t.consume(s), o) : (t.exit(n), e(s));
  }
}
var Hb = { tokenize: UT };
function UT(t) {
  let e = t.attempt(this.parser.constructs.contentInitial, l, i),
    n;
  return e;
  function l(o) {
    if (o === null) {
      t.consume(o);
      return;
    }
    return (t.enter("lineEnding"), t.consume(o), t.exit("lineEnding"), W(t, e, "linePrefix"));
  }
  function i(o) {
    return (t.enter("paragraph"), r(o));
  }
  function r(o) {
    let s = t.enter("chunkText", { contentType: "text", previous: n });
    return (n && (n.next = s), (n = s), a(o));
  }
  function a(o) {
    if (o === null) {
      (t.exit("chunkText"), t.exit("paragraph"), t.consume(o));
      return;
    }
    return Q(o) ? (t.consume(o), t.exit("chunkText"), r) : (t.consume(o), a);
  }
}
var Ib = { tokenize: BT },
  qb = { tokenize: HT };
function BT(t) {
  let e = this,
    n = [],
    l = 0,
    i,
    r,
    a;
  return o;
  function o(y) {
    if (l < n.length) {
      let T = n[l];
      return ((e.containerState = T[1]), t.attempt(T[0].continuation, s, u)(y));
    }
    return u(y);
  }
  function s(y) {
    if ((l++, e.containerState._closeFlow)) {
      ((e.containerState._closeFlow = void 0), i && p());
      let T = e.events.length,
        N = T,
        E;
      for (; N--;)
        if (e.events[N][0] === "exit" && e.events[N][1].type === "chunkFlow") {
          E = e.events[N][1].end;
          break;
        }
      h(l);
      let M = T;
      for (; M < e.events.length;) ((e.events[M][1].end = { ...E }), M++);
      return (de(e.events, N + 1, 0, e.events.slice(T)), (e.events.length = M), u(y));
    }
    return o(y);
  }
  function u(y) {
    if (l === n.length) {
      if (!i) return m(y);
      if (i.currentConstruct && i.currentConstruct.concrete) return g(y);
      e.interrupt = !!(i.currentConstruct && !i._gfmTableDynamicInterruptHack);
    }
    return ((e.containerState = {}), t.check(qb, f, c)(y));
  }
  function f(y) {
    return (i && p(), h(l), m(y));
  }
  function c(y) {
    return ((e.parser.lazy[e.now().line] = l !== n.length), (a = e.now().offset), g(y));
  }
  function m(y) {
    return ((e.containerState = {}), t.attempt(qb, d, g)(y));
  }
  function d(y) {
    return (l++, n.push([e.currentConstruct, e.containerState]), m(y));
  }
  function g(y) {
    if (y === null) {
      (i && p(), h(0), t.consume(y));
      return;
    }
    return (
      (i = i || e.parser.flow(e.now())),
      t.enter("chunkFlow", { _tokenizer: i, contentType: "flow", previous: r }),
      x(y)
    );
  }
  function x(y) {
    if (y === null) {
      (C(t.exit("chunkFlow"), !0), h(0), t.consume(y));
      return;
    }
    return Q(y) ? (t.consume(y), C(t.exit("chunkFlow")), (l = 0), (e.interrupt = void 0), o) : (t.consume(y), x);
  }
  function C(y, T) {
    let N = e.sliceStream(y);
    if (
      (T && N.push(null),
      (y.previous = r),
      r && (r.next = y),
      (r = y),
      i.defineSkip(y.start),
      i.write(N),
      e.parser.lazy[y.start.line])
    ) {
      let E = i.events.length;
      for (; E--;)
        if (i.events[E][1].start.offset < a && (!i.events[E][1].end || i.events[E][1].end.offset > a)) return;
      let M = e.events.length,
        z = M,
        F,
        w;
      for (; z--;)
        if (e.events[z][0] === "exit" && e.events[z][1].type === "chunkFlow") {
          if (F) {
            w = e.events[z][1].end;
            break;
          }
          F = !0;
        }
      for (h(l), E = M; E < e.events.length;) ((e.events[E][1].end = { ...w }), E++);
      (de(e.events, z + 1, 0, e.events.slice(M)), (e.events.length = E));
    }
  }
  function h(y) {
    let T = n.length;
    for (; T-- > y;) {
      let N = n[T];
      ((e.containerState = N[1]), N[0].exit.call(e, t));
    }
    n.length = y;
  }
  function p() {
    (i.write([null]), (r = void 0), (i = void 0), (e.containerState._closeFlow = void 0));
  }
}
function HT(t, e, n) {
  return W(
    t,
    t.attempt(this.parser.constructs.document, e, n),
    "linePrefix",
    this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4,
  );
}
function bl(t) {
  if (t === null || yt(t) || Kn(t)) return 1;
  if (Di(t)) return 2;
}
function Jl(t, e, n) {
  let l = [],
    i = -1;
  for (; ++i < t.length;) {
    let r = t[i].resolveAll;
    r && !l.includes(r) && ((e = r(e, n)), l.push(r));
  }
  return e;
}
var fo = { name: "attention", resolveAll: qT, tokenize: IT };
function qT(t, e) {
  let n = -1,
    l,
    i,
    r,
    a,
    o,
    s,
    u,
    f;
  for (; ++n < t.length;)
    if (t[n][0] === "enter" && t[n][1].type === "attentionSequence" && t[n][1]._close) {
      for (l = n; l--;)
        if (
          t[l][0] === "exit" &&
          t[l][1].type === "attentionSequence" &&
          t[l][1]._open &&
          e.sliceSerialize(t[l][1]).charCodeAt(0) === e.sliceSerialize(t[n][1]).charCodeAt(0)
        ) {
          if (
            (t[l][1]._close || t[n][1]._open) &&
            (t[n][1].end.offset - t[n][1].start.offset) % 3 &&
            !((t[l][1].end.offset - t[l][1].start.offset + t[n][1].end.offset - t[n][1].start.offset) % 3)
          )
            continue;
          s = t[l][1].end.offset - t[l][1].start.offset > 1 && t[n][1].end.offset - t[n][1].start.offset > 1 ? 2 : 1;
          let c = { ...t[l][1].end },
            m = { ...t[n][1].start };
          (jb(c, -s),
            jb(m, s),
            (a = { type: s > 1 ? "strongSequence" : "emphasisSequence", start: c, end: { ...t[l][1].end } }),
            (o = { type: s > 1 ? "strongSequence" : "emphasisSequence", start: { ...t[n][1].start }, end: m }),
            (r = { type: s > 1 ? "strongText" : "emphasisText", start: { ...t[l][1].end }, end: { ...t[n][1].start } }),
            (i = { type: s > 1 ? "strong" : "emphasis", start: { ...a.start }, end: { ...o.end } }),
            (t[l][1].end = { ...a.start }),
            (t[n][1].start = { ...o.end }),
            (u = []),
            t[l][1].end.offset - t[l][1].start.offset &&
              (u = We(u, [
                ["enter", t[l][1], e],
                ["exit", t[l][1], e],
              ])),
            (u = We(u, [
              ["enter", i, e],
              ["enter", a, e],
              ["exit", a, e],
              ["enter", r, e],
            ])),
            (u = We(u, Jl(e.parser.constructs.insideSpan.null, t.slice(l + 1, n), e))),
            (u = We(u, [
              ["exit", r, e],
              ["enter", o, e],
              ["exit", o, e],
              ["exit", i, e],
            ])),
            t[n][1].end.offset - t[n][1].start.offset
              ? ((f = 2),
                (u = We(u, [
                  ["enter", t[n][1], e],
                  ["exit", t[n][1], e],
                ])))
              : (f = 0),
            de(t, l - 1, n - l + 3, u),
            (n = l + u.length - f - 2));
          break;
        }
    }
  for (n = -1; ++n < t.length;) t[n][1].type === "attentionSequence" && (t[n][1].type = "data");
  return t;
}
function IT(t, e) {
  let n = this.parser.constructs.attentionMarkers.null,
    l = this.previous,
    i = bl(l),
    r;
  return a;
  function a(s) {
    return ((r = s), t.enter("attentionSequence"), o(s));
  }
  function o(s) {
    if (s === r) return (t.consume(s), o);
    let u = t.exit("attentionSequence"),
      f = bl(s),
      c = !f || (f === 2 && i) || n.includes(s),
      m = !i || (i === 2 && f) || n.includes(l);
    return ((u._open = !!(r === 42 ? c : c && (i || !m))), (u._close = !!(r === 42 ? m : m && (f || !c))), e(s));
  }
}
function jb(t, e) {
  ((t.column += e), (t.offset += e), (t._bufferIndex += e));
}
var Gd = { name: "autolink", tokenize: jT };
function jT(t, e, n) {
  let l = 0;
  return i;
  function i(d) {
    return (
      t.enter("autolink"),
      t.enter("autolinkMarker"),
      t.consume(d),
      t.exit("autolinkMarker"),
      t.enter("autolinkProtocol"),
      r
    );
  }
  function r(d) {
    return Te(d) ? (t.consume(d), a) : d === 64 ? n(d) : u(d);
  }
  function a(d) {
    return d === 43 || d === 45 || d === 46 || oe(d) ? ((l = 1), o(d)) : u(d);
  }
  function o(d) {
    return d === 58
      ? (t.consume(d), (l = 0), s)
      : (d === 43 || d === 45 || d === 46 || oe(d)) && l++ < 32
        ? (t.consume(d), o)
        : ((l = 0), u(d));
  }
  function s(d) {
    return d === 62
      ? (t.exit("autolinkProtocol"),
        t.enter("autolinkMarker"),
        t.consume(d),
        t.exit("autolinkMarker"),
        t.exit("autolink"),
        e)
      : d === null || d === 32 || d === 60 || Mi(d)
        ? n(d)
        : (t.consume(d), s);
  }
  function u(d) {
    return d === 64 ? (t.consume(d), f) : Lb(d) ? (t.consume(d), u) : n(d);
  }
  function f(d) {
    return oe(d) ? c(d) : n(d);
  }
  function c(d) {
    return d === 46
      ? (t.consume(d), (l = 0), f)
      : d === 62
        ? ((t.exit("autolinkProtocol").type = "autolinkEmail"),
          t.enter("autolinkMarker"),
          t.consume(d),
          t.exit("autolinkMarker"),
          t.exit("autolink"),
          e)
        : m(d);
  }
  function m(d) {
    if ((d === 45 || oe(d)) && l++ < 63) {
      let g = d === 45 ? m : c;
      return (t.consume(d), g);
    }
    return n(d);
  }
}
var Jn = { partial: !0, tokenize: YT };
function YT(t, e, n) {
  return l;
  function l(r) {
    return lt(r) ? W(t, i, "linePrefix")(r) : i(r);
  }
  function i(r) {
    return r === null || Q(r) ? e(r) : n(r);
  }
}
var fu = { continuation: { tokenize: VT }, exit: QT, name: "blockQuote", tokenize: FT };
function FT(t, e, n) {
  let l = this;
  return i;
  function i(a) {
    if (a === 62) {
      let o = l.containerState;
      return (
        o.open || (t.enter("blockQuote", { _container: !0 }), (o.open = !0)),
        t.enter("blockQuotePrefix"),
        t.enter("blockQuoteMarker"),
        t.consume(a),
        t.exit("blockQuoteMarker"),
        r
      );
    }
    return n(a);
  }
  function r(a) {
    return lt(a)
      ? (t.enter("blockQuotePrefixWhitespace"),
        t.consume(a),
        t.exit("blockQuotePrefixWhitespace"),
        t.exit("blockQuotePrefix"),
        e)
      : (t.exit("blockQuotePrefix"), e(a));
  }
}
function VT(t, e, n) {
  let l = this;
  return i;
  function i(a) {
    return lt(a)
      ? W(t, r, "linePrefix", l.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(a)
      : r(a);
  }
  function r(a) {
    return t.attempt(fu, e, n)(a);
  }
}
function QT(t) {
  t.exit("blockQuote");
}
var du = { name: "characterEscape", tokenize: PT };
function PT(t, e, n) {
  return l;
  function l(r) {
    return (t.enter("characterEscape"), t.enter("escapeMarker"), t.consume(r), t.exit("escapeMarker"), i);
  }
  function i(r) {
    return Bb(r)
      ? (t.enter("characterEscapeValue"), t.consume(r), t.exit("characterEscapeValue"), t.exit("characterEscape"), e)
      : n(r);
  }
}
var mu = { name: "characterReference", tokenize: GT };
function GT(t, e, n) {
  let l = this,
    i = 0,
    r,
    a;
  return o;
  function o(c) {
    return (
      t.enter("characterReference"),
      t.enter("characterReferenceMarker"),
      t.consume(c),
      t.exit("characterReferenceMarker"),
      s
    );
  }
  function s(c) {
    return c === 35
      ? (t.enter("characterReferenceMarkerNumeric"), t.consume(c), t.exit("characterReferenceMarkerNumeric"), u)
      : (t.enter("characterReferenceValue"), (r = 31), (a = oe), f(c));
  }
  function u(c) {
    return c === 88 || c === 120
      ? (t.enter("characterReferenceMarkerHexadecimal"),
        t.consume(c),
        t.exit("characterReferenceMarkerHexadecimal"),
        t.enter("characterReferenceValue"),
        (r = 6),
        (a = Ub),
        f)
      : (t.enter("characterReferenceValue"), (r = 7), (a = co), f(c));
  }
  function f(c) {
    if (c === 59 && i) {
      let m = t.exit("characterReferenceValue");
      return a === oe && !Hr(l.sliceSerialize(m))
        ? n(c)
        : (t.enter("characterReferenceMarker"),
          t.consume(c),
          t.exit("characterReferenceMarker"),
          t.exit("characterReference"),
          e);
    }
    return a(c) && i++ < r ? (t.consume(c), f) : n(c);
  }
}
var Yb = { partial: !0, tokenize: ZT },
  pu = { concrete: !0, name: "codeFenced", tokenize: XT };
function XT(t, e, n) {
  let l = this,
    i = { partial: !0, tokenize: N },
    r = 0,
    a = 0,
    o;
  return s;
  function s(E) {
    return u(E);
  }
  function u(E) {
    let M = l.events[l.events.length - 1];
    return (
      (r = M && M[1].type === "linePrefix" ? M[2].sliceSerialize(M[1], !0).length : 0),
      (o = E),
      t.enter("codeFenced"),
      t.enter("codeFencedFence"),
      t.enter("codeFencedFenceSequence"),
      f(E)
    );
  }
  function f(E) {
    return E === o
      ? (a++, t.consume(E), f)
      : a < 3
        ? n(E)
        : (t.exit("codeFencedFenceSequence"), lt(E) ? W(t, c, "whitespace")(E) : c(E));
  }
  function c(E) {
    return E === null || Q(E)
      ? (t.exit("codeFencedFence"), l.interrupt ? e(E) : t.check(Yb, x, T)(E))
      : (t.enter("codeFencedFenceInfo"), t.enter("chunkString", { contentType: "string" }), m(E));
  }
  function m(E) {
    return E === null || Q(E)
      ? (t.exit("chunkString"), t.exit("codeFencedFenceInfo"), c(E))
      : lt(E)
        ? (t.exit("chunkString"), t.exit("codeFencedFenceInfo"), W(t, d, "whitespace")(E))
        : E === 96 && E === o
          ? n(E)
          : (t.consume(E), m);
  }
  function d(E) {
    return E === null || Q(E)
      ? c(E)
      : (t.enter("codeFencedFenceMeta"), t.enter("chunkString", { contentType: "string" }), g(E));
  }
  function g(E) {
    return E === null || Q(E)
      ? (t.exit("chunkString"), t.exit("codeFencedFenceMeta"), c(E))
      : E === 96 && E === o
        ? n(E)
        : (t.consume(E), g);
  }
  function x(E) {
    return t.attempt(i, T, C)(E);
  }
  function C(E) {
    return (t.enter("lineEnding"), t.consume(E), t.exit("lineEnding"), h);
  }
  function h(E) {
    return r > 0 && lt(E) ? W(t, p, "linePrefix", r + 1)(E) : p(E);
  }
  function p(E) {
    return E === null || Q(E) ? t.check(Yb, x, T)(E) : (t.enter("codeFlowValue"), y(E));
  }
  function y(E) {
    return E === null || Q(E) ? (t.exit("codeFlowValue"), p(E)) : (t.consume(E), y);
  }
  function T(E) {
    return (t.exit("codeFenced"), e(E));
  }
  function N(E, M, z) {
    let F = 0;
    return w;
    function w(tt) {
      return (E.enter("lineEnding"), E.consume(tt), E.exit("lineEnding"), Z);
    }
    function Z(tt) {
      return (
        E.enter("codeFencedFence"),
        lt(tt)
          ? W(E, L, "linePrefix", l.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(tt)
          : L(tt)
      );
    }
    function L(tt) {
      return tt === o ? (E.enter("codeFencedFenceSequence"), H(tt)) : z(tt);
    }
    function H(tt) {
      return tt === o
        ? (F++, E.consume(tt), H)
        : F >= a
          ? (E.exit("codeFencedFenceSequence"), lt(tt) ? W(E, X, "whitespace")(tt) : X(tt))
          : z(tt);
    }
    function X(tt) {
      return tt === null || Q(tt) ? (E.exit("codeFencedFence"), M(tt)) : z(tt);
    }
  }
}
function ZT(t, e, n) {
  let l = this;
  return i;
  function i(a) {
    return a === null ? n(a) : (t.enter("lineEnding"), t.consume(a), t.exit("lineEnding"), r);
  }
  function r(a) {
    return l.parser.lazy[l.now().line] ? n(a) : e(a);
  }
}
var mo = { name: "codeIndented", tokenize: JT },
  KT = { partial: !0, tokenize: $T };
function JT(t, e, n) {
  let l = this;
  return i;
  function i(u) {
    return (t.enter("codeIndented"), W(t, r, "linePrefix", 5)(u));
  }
  function r(u) {
    let f = l.events[l.events.length - 1];
    return f && f[1].type === "linePrefix" && f[2].sliceSerialize(f[1], !0).length >= 4 ? a(u) : n(u);
  }
  function a(u) {
    return u === null ? s(u) : Q(u) ? t.attempt(KT, a, s)(u) : (t.enter("codeFlowValue"), o(u));
  }
  function o(u) {
    return u === null || Q(u) ? (t.exit("codeFlowValue"), a(u)) : (t.consume(u), o);
  }
  function s(u) {
    return (t.exit("codeIndented"), e(u));
  }
}
function $T(t, e, n) {
  let l = this;
  return i;
  function i(a) {
    return l.parser.lazy[l.now().line]
      ? n(a)
      : Q(a)
        ? (t.enter("lineEnding"), t.consume(a), t.exit("lineEnding"), i)
        : W(t, r, "linePrefix", 5)(a);
  }
  function r(a) {
    let o = l.events[l.events.length - 1];
    return o && o[1].type === "linePrefix" && o[2].sliceSerialize(o[1], !0).length >= 4 ? e(a) : Q(a) ? i(a) : n(a);
  }
}
var Xd = { name: "codeText", previous: tE, resolve: WT, tokenize: eE };
function WT(t) {
  let e = t.length - 4,
    n = 3,
    l,
    i;
  if (
    (t[n][1].type === "lineEnding" || t[n][1].type === "space") &&
    (t[e][1].type === "lineEnding" || t[e][1].type === "space")
  ) {
    for (l = n; ++l < e;)
      if (t[l][1].type === "codeTextData") {
        ((t[n][1].type = "codeTextPadding"), (t[e][1].type = "codeTextPadding"), (n += 2), (e -= 2));
        break;
      }
  }
  for (l = n - 1, e++; ++l <= e;)
    i === void 0
      ? l !== e && t[l][1].type !== "lineEnding" && (i = l)
      : (l === e || t[l][1].type === "lineEnding") &&
        ((t[i][1].type = "codeTextData"),
        l !== i + 2 && ((t[i][1].end = t[l - 1][1].end), t.splice(i + 2, l - i - 2), (e -= l - i - 2), (l = i + 2)),
        (i = void 0));
  return t;
}
function tE(t) {
  return t !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function eE(t, e, n) {
  let l = this,
    i = 0,
    r,
    a;
  return o;
  function o(m) {
    return (t.enter("codeText"), t.enter("codeTextSequence"), s(m));
  }
  function s(m) {
    return m === 96 ? (t.consume(m), i++, s) : (t.exit("codeTextSequence"), u(m));
  }
  function u(m) {
    return m === null
      ? n(m)
      : m === 32
        ? (t.enter("space"), t.consume(m), t.exit("space"), u)
        : m === 96
          ? ((a = t.enter("codeTextSequence")), (r = 0), c(m))
          : Q(m)
            ? (t.enter("lineEnding"), t.consume(m), t.exit("lineEnding"), u)
            : (t.enter("codeTextData"), f(m));
  }
  function f(m) {
    return m === null || m === 32 || m === 96 || Q(m) ? (t.exit("codeTextData"), u(m)) : (t.consume(m), f);
  }
  function c(m) {
    return m === 96
      ? (t.consume(m), r++, c)
      : r === i
        ? (t.exit("codeTextSequence"), t.exit("codeText"), e(m))
        : ((a.type = "codeTextData"), f(m));
  }
}
var hu = class {
  constructor(e) {
    ((this.left = e ? [...e] : []), (this.right = []));
  }
  get(e) {
    if (e < 0 || e >= this.left.length + this.right.length)
      throw new RangeError(
        "Cannot access index `" + e + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`",
      );
    return e < this.left.length ? this.left[e] : this.right[this.right.length - e + this.left.length - 1];
  }
  get length() {
    return this.left.length + this.right.length;
  }
  shift() {
    return (this.setCursor(0), this.right.pop());
  }
  slice(e, n) {
    let l = n ?? Number.POSITIVE_INFINITY;
    return l < this.left.length
      ? this.left.slice(e, l)
      : e > this.left.length
        ? this.right.slice(this.right.length - l + this.left.length, this.right.length - e + this.left.length).reverse()
        : this.left.slice(e).concat(this.right.slice(this.right.length - l + this.left.length).reverse());
  }
  splice(e, n, l) {
    let i = n || 0;
    this.setCursor(Math.trunc(e));
    let r = this.right.splice(this.right.length - i, Number.POSITIVE_INFINITY);
    return (l && po(this.left, l), r.reverse());
  }
  pop() {
    return (this.setCursor(Number.POSITIVE_INFINITY), this.left.pop());
  }
  push(e) {
    (this.setCursor(Number.POSITIVE_INFINITY), this.left.push(e));
  }
  pushMany(e) {
    (this.setCursor(Number.POSITIVE_INFINITY), po(this.left, e));
  }
  unshift(e) {
    (this.setCursor(0), this.right.push(e));
  }
  unshiftMany(e) {
    (this.setCursor(0), po(this.right, e.reverse()));
  }
  setCursor(e) {
    if (!(
      e === this.left.length ||
      (e > this.left.length && this.right.length === 0) ||
      (e < 0 && this.left.length === 0)
    ))
      if (e < this.left.length) {
        let n = this.left.splice(e, Number.POSITIVE_INFINITY);
        po(this.right, n.reverse());
      } else {
        let n = this.right.splice(this.left.length + this.right.length - e, Number.POSITIVE_INFINITY);
        po(this.left, n.reverse());
      }
  }
};
function po(t, e) {
  let n = 0;
  if (e.length < 1e4) t.push(...e);
  else for (; n < e.length;) (t.push(...e.slice(n, n + 1e4)), (n += 1e4));
}
function gu(t) {
  let e = {},
    n = -1,
    l,
    i,
    r,
    a,
    o,
    s,
    u,
    f = new hu(t);
  for (; ++n < f.length;) {
    for (; n in e;) n = e[n];
    if (
      ((l = f.get(n)),
      n &&
        l[1].type === "chunkFlow" &&
        f.get(n - 1)[1].type === "listItemPrefix" &&
        ((s = l[1]._tokenizer.events),
        (r = 0),
        r < s.length && s[r][1].type === "lineEndingBlank" && (r += 2),
        r < s.length && s[r][1].type === "content"))
    )
      for (; ++r < s.length && s[r][1].type !== "content";)
        s[r][1].type === "chunkText" && ((s[r][1]._isInFirstContentOfListItem = !0), r++);
    if (l[0] === "enter") l[1].contentType && (Object.assign(e, nE(f, n)), (n = e[n]), (u = !0));
    else if (l[1]._container) {
      for (r = n, i = void 0; r--;)
        if (((a = f.get(r)), a[1].type === "lineEnding" || a[1].type === "lineEndingBlank"))
          a[0] === "enter" && (i && (f.get(i)[1].type = "lineEndingBlank"), (a[1].type = "lineEnding"), (i = r));
        else if (!(a[1].type === "linePrefix" || a[1].type === "listItemIndent")) break;
      i && ((l[1].end = { ...f.get(i)[1].start }), (o = f.slice(i, n)), o.unshift(l), f.splice(i, n - i + 1, o));
    }
  }
  return (de(t, 0, Number.POSITIVE_INFINITY, f.slice(0)), !u);
}
function nE(t, e) {
  let n = t.get(e)[1],
    l = t.get(e)[2],
    i = e - 1,
    r = [],
    a = n._tokenizer;
  a || ((a = l.parser[n.contentType](n.start)), n._contentTypeTextTrailing && (a._contentTypeTextTrailing = !0));
  let o = a.events,
    s = [],
    u = {},
    f,
    c,
    m = -1,
    d = n,
    g = 0,
    x = 0,
    C = [x];
  for (; d;) {
    for (; t.get(++i)[1] !== d;);
    (r.push(i),
      d._tokenizer ||
        ((f = l.sliceStream(d)),
        d.next || f.push(null),
        c && a.defineSkip(d.start),
        d._isInFirstContentOfListItem && (a._gfmTasklistFirstContentOfListItem = !0),
        a.write(f),
        d._isInFirstContentOfListItem && (a._gfmTasklistFirstContentOfListItem = void 0)),
      (c = d),
      (d = d.next));
  }
  for (d = n; ++m < o.length;)
    o[m][0] === "exit" &&
      o[m - 1][0] === "enter" &&
      o[m][1].type === o[m - 1][1].type &&
      o[m][1].start.line !== o[m][1].end.line &&
      ((x = m + 1), C.push(x), (d._tokenizer = void 0), (d.previous = void 0), (d = d.next));
  for (a.events = [], d ? ((d._tokenizer = void 0), (d.previous = void 0)) : C.pop(), m = C.length; m--;) {
    let h = o.slice(C[m], C[m + 1]),
      p = r.pop();
    (s.push([p, p + h.length - 1]), t.splice(p, 2, h));
  }
  for (s.reverse(), m = -1; ++m < s.length;) ((u[g + s[m][0]] = g + s[m][1]), (g += s[m][1] - s[m][0] - 1));
  return u;
}
var Zd = { resolve: iE, tokenize: rE },
  lE = { partial: !0, tokenize: aE };
function iE(t) {
  return (gu(t), t);
}
function rE(t, e) {
  let n;
  return l;
  function l(o) {
    return (t.enter("content"), (n = t.enter("chunkContent", { contentType: "content" })), i(o));
  }
  function i(o) {
    return o === null ? r(o) : Q(o) ? t.check(lE, a, r)(o) : (t.consume(o), i);
  }
  function r(o) {
    return (t.exit("chunkContent"), t.exit("content"), e(o));
  }
  function a(o) {
    return (
      t.consume(o),
      t.exit("chunkContent"),
      (n.next = t.enter("chunkContent", { contentType: "content", previous: n })),
      (n = n.next),
      i
    );
  }
}
function aE(t, e, n) {
  let l = this;
  return i;
  function i(a) {
    return (t.exit("chunkContent"), t.enter("lineEnding"), t.consume(a), t.exit("lineEnding"), W(t, r, "linePrefix"));
  }
  function r(a) {
    if (a === null || Q(a)) return n(a);
    let o = l.events[l.events.length - 1];
    return !l.parser.constructs.disable.null.includes("codeIndented") &&
      o &&
      o[1].type === "linePrefix" &&
      o[2].sliceSerialize(o[1], !0).length >= 4
      ? e(a)
      : t.interrupt(l.parser.constructs.flow, n, e)(a);
  }
}
function yu(t, e, n, l, i, r, a, o, s) {
  let u = s || Number.POSITIVE_INFINITY,
    f = 0;
  return c;
  function c(h) {
    return h === 60
      ? (t.enter(l), t.enter(i), t.enter(r), t.consume(h), t.exit(r), m)
      : h === null || h === 32 || h === 41 || Mi(h)
        ? n(h)
        : (t.enter(l), t.enter(a), t.enter(o), t.enter("chunkString", { contentType: "string" }), x(h));
  }
  function m(h) {
    return h === 62
      ? (t.enter(r), t.consume(h), t.exit(r), t.exit(i), t.exit(l), e)
      : (t.enter(o), t.enter("chunkString", { contentType: "string" }), d(h));
  }
  function d(h) {
    return h === 62
      ? (t.exit("chunkString"), t.exit(o), m(h))
      : h === null || h === 60 || Q(h)
        ? n(h)
        : (t.consume(h), h === 92 ? g : d);
  }
  function g(h) {
    return h === 60 || h === 62 || h === 92 ? (t.consume(h), d) : d(h);
  }
  function x(h) {
    return !f && (h === null || h === 41 || yt(h))
      ? (t.exit("chunkString"), t.exit(o), t.exit(a), t.exit(l), e(h))
      : f < u && h === 40
        ? (t.consume(h), f++, x)
        : h === 41
          ? (t.consume(h), f--, x)
          : h === null || h === 32 || h === 40 || Mi(h)
            ? n(h)
            : (t.consume(h), h === 92 ? C : x);
  }
  function C(h) {
    return h === 40 || h === 41 || h === 92 ? (t.consume(h), x) : x(h);
  }
}
function vu(t, e, n, l, i, r) {
  let a = this,
    o = 0,
    s;
  return u;
  function u(d) {
    return (t.enter(l), t.enter(i), t.consume(d), t.exit(i), t.enter(r), f);
  }
  function f(d) {
    return o > 999 ||
      d === null ||
      d === 91 ||
      (d === 93 && !s) ||
      (d === 94 && !o && "_hiddenFootnoteSupport" in a.parser.constructs)
      ? n(d)
      : d === 93
        ? (t.exit(r), t.enter(i), t.consume(d), t.exit(i), t.exit(l), e)
        : Q(d)
          ? (t.enter("lineEnding"), t.consume(d), t.exit("lineEnding"), f)
          : (t.enter("chunkString", { contentType: "string" }), c(d));
  }
  function c(d) {
    return d === null || d === 91 || d === 93 || Q(d) || o++ > 999
      ? (t.exit("chunkString"), f(d))
      : (t.consume(d), s || (s = !lt(d)), d === 92 ? m : c);
  }
  function m(d) {
    return d === 91 || d === 92 || d === 93 ? (t.consume(d), o++, c) : c(d);
  }
}
function bu(t, e, n, l, i, r) {
  let a;
  return o;
  function o(m) {
    return m === 34 || m === 39 || m === 40
      ? (t.enter(l), t.enter(i), t.consume(m), t.exit(i), (a = m === 40 ? 41 : m), s)
      : n(m);
  }
  function s(m) {
    return m === a ? (t.enter(i), t.consume(m), t.exit(i), t.exit(l), e) : (t.enter(r), u(m));
  }
  function u(m) {
    return m === a
      ? (t.exit(r), s(a))
      : m === null
        ? n(m)
        : Q(m)
          ? (t.enter("lineEnding"), t.consume(m), t.exit("lineEnding"), W(t, u, "linePrefix"))
          : (t.enter("chunkString", { contentType: "string" }), f(m));
  }
  function f(m) {
    return m === a || m === null || Q(m) ? (t.exit("chunkString"), u(m)) : (t.consume(m), m === 92 ? c : f);
  }
  function c(m) {
    return m === a || m === 92 ? (t.consume(m), f) : f(m);
  }
}
function _i(t, e) {
  let n;
  return l;
  function l(i) {
    return Q(i)
      ? (t.enter("lineEnding"), t.consume(i), t.exit("lineEnding"), (n = !0), l)
      : lt(i)
        ? W(t, l, n ? "linePrefix" : "lineSuffix")(i)
        : e(i);
  }
}
var Kd = { name: "definition", tokenize: sE },
  oE = { partial: !0, tokenize: uE };
function sE(t, e, n) {
  let l = this,
    i;
  return r;
  function r(d) {
    return (t.enter("definition"), a(d));
  }
  function a(d) {
    return vu.call(l, t, o, n, "definitionLabel", "definitionLabelMarker", "definitionLabelString")(d);
  }
  function o(d) {
    return (
      (i = Fe(l.sliceSerialize(l.events[l.events.length - 1][1]).slice(1, -1))),
      d === 58 ? (t.enter("definitionMarker"), t.consume(d), t.exit("definitionMarker"), s) : n(d)
    );
  }
  function s(d) {
    return yt(d) ? _i(t, u)(d) : u(d);
  }
  function u(d) {
    return yu(
      t,
      f,
      n,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString",
    )(d);
  }
  function f(d) {
    return t.attempt(oE, c, c)(d);
  }
  function c(d) {
    return lt(d) ? W(t, m, "whitespace")(d) : m(d);
  }
  function m(d) {
    return d === null || Q(d) ? (t.exit("definition"), l.parser.defined.push(i), e(d)) : n(d);
  }
}
function uE(t, e, n) {
  return l;
  function l(o) {
    return yt(o) ? _i(t, i)(o) : n(o);
  }
  function i(o) {
    return bu(t, r, n, "definitionTitle", "definitionTitleMarker", "definitionTitleString")(o);
  }
  function r(o) {
    return lt(o) ? W(t, a, "whitespace")(o) : a(o);
  }
  function a(o) {
    return o === null || Q(o) ? e(o) : n(o);
  }
}
var Jd = { name: "hardBreakEscape", tokenize: cE };
function cE(t, e, n) {
  return l;
  function l(r) {
    return (t.enter("hardBreakEscape"), t.consume(r), i);
  }
  function i(r) {
    return Q(r) ? (t.exit("hardBreakEscape"), e(r)) : n(r);
  }
}
var $d = { name: "headingAtx", resolve: fE, tokenize: dE };
function fE(t, e) {
  let n = t.length - 2,
    l = 3,
    i,
    r;
  return (
    t[l][1].type === "whitespace" && (l += 2),
    n - 2 > l && t[n][1].type === "whitespace" && (n -= 2),
    t[n][1].type === "atxHeadingSequence" &&
      (l === n - 1 || (n - 4 > l && t[n - 2][1].type === "whitespace")) &&
      (n -= l + 1 === n ? 2 : 4),
    n > l &&
      ((i = { type: "atxHeadingText", start: t[l][1].start, end: t[n][1].end }),
      (r = { type: "chunkText", start: t[l][1].start, end: t[n][1].end, contentType: "text" }),
      de(t, l, n - l + 1, [
        ["enter", i, e],
        ["enter", r, e],
        ["exit", r, e],
        ["exit", i, e],
      ])),
    t
  );
}
function dE(t, e, n) {
  let l = 0;
  return i;
  function i(f) {
    return (t.enter("atxHeading"), r(f));
  }
  function r(f) {
    return (t.enter("atxHeadingSequence"), a(f));
  }
  function a(f) {
    return f === 35 && l++ < 6 ? (t.consume(f), a) : f === null || yt(f) ? (t.exit("atxHeadingSequence"), o(f)) : n(f);
  }
  function o(f) {
    return f === 35
      ? (t.enter("atxHeadingSequence"), s(f))
      : f === null || Q(f)
        ? (t.exit("atxHeading"), e(f))
        : lt(f)
          ? W(t, o, "whitespace")(f)
          : (t.enter("atxHeadingText"), u(f));
  }
  function s(f) {
    return f === 35 ? (t.consume(f), s) : (t.exit("atxHeadingSequence"), o(f));
  }
  function u(f) {
    return f === null || f === 35 || yt(f) ? (t.exit("atxHeadingText"), o(f)) : (t.consume(f), u);
  }
}
var Fb = [
    "address",
    "article",
    "aside",
    "base",
    "basefont",
    "blockquote",
    "body",
    "caption",
    "center",
    "col",
    "colgroup",
    "dd",
    "details",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "html",
    "iframe",
    "legend",
    "li",
    "link",
    "main",
    "menu",
    "menuitem",
    "nav",
    "noframes",
    "ol",
    "optgroup",
    "option",
    "p",
    "param",
    "search",
    "section",
    "summary",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "title",
    "tr",
    "track",
    "ul",
  ],
  Wd = ["pre", "script", "style", "textarea"];
var tm = { concrete: !0, name: "htmlFlow", resolveTo: hE, tokenize: gE },
  mE = { partial: !0, tokenize: vE },
  pE = { partial: !0, tokenize: yE };
function hE(t) {
  let e = t.length;
  for (; e-- && !(t[e][0] === "enter" && t[e][1].type === "htmlFlow"););
  return (
    e > 1 &&
      t[e - 2][1].type === "linePrefix" &&
      ((t[e][1].start = t[e - 2][1].start), (t[e + 1][1].start = t[e - 2][1].start), t.splice(e - 2, 2)),
    t
  );
}
function gE(t, e, n) {
  let l = this,
    i,
    r,
    a,
    o,
    s;
  return u;
  function u(S) {
    return f(S);
  }
  function f(S) {
    return (t.enter("htmlFlow"), t.enter("htmlFlowData"), t.consume(S), c);
  }
  function c(S) {
    return S === 33
      ? (t.consume(S), m)
      : S === 47
        ? (t.consume(S), (r = !0), x)
        : S === 63
          ? (t.consume(S), (i = 3), l.interrupt ? e : k)
          : Te(S)
            ? (t.consume(S), (a = String.fromCharCode(S)), C)
            : n(S);
  }
  function m(S) {
    return S === 45
      ? (t.consume(S), (i = 2), d)
      : S === 91
        ? (t.consume(S), (i = 5), (o = 0), g)
        : Te(S)
          ? (t.consume(S), (i = 4), l.interrupt ? e : k)
          : n(S);
  }
  function d(S) {
    return S === 45 ? (t.consume(S), l.interrupt ? e : k) : n(S);
  }
  function g(S) {
    let ut = "CDATA[";
    return S === ut.charCodeAt(o++) ? (t.consume(S), o === ut.length ? (l.interrupt ? e : L) : g) : n(S);
  }
  function x(S) {
    return Te(S) ? (t.consume(S), (a = String.fromCharCode(S)), C) : n(S);
  }
  function C(S) {
    if (S === null || S === 47 || S === 62 || yt(S)) {
      let ut = S === 47,
        pe = a.toLowerCase();
      return !ut && !r && Wd.includes(pe)
        ? ((i = 1), l.interrupt ? e(S) : L(S))
        : Fb.includes(a.toLowerCase())
          ? ((i = 6), ut ? (t.consume(S), h) : l.interrupt ? e(S) : L(S))
          : ((i = 7), l.interrupt && !l.parser.lazy[l.now().line] ? n(S) : r ? p(S) : y(S));
    }
    return S === 45 || oe(S) ? (t.consume(S), (a += String.fromCharCode(S)), C) : n(S);
  }
  function h(S) {
    return S === 62 ? (t.consume(S), l.interrupt ? e : L) : n(S);
  }
  function p(S) {
    return lt(S) ? (t.consume(S), p) : w(S);
  }
  function y(S) {
    return S === 47
      ? (t.consume(S), w)
      : S === 58 || S === 95 || Te(S)
        ? (t.consume(S), T)
        : lt(S)
          ? (t.consume(S), y)
          : w(S);
  }
  function T(S) {
    return S === 45 || S === 46 || S === 58 || S === 95 || oe(S) ? (t.consume(S), T) : N(S);
  }
  function N(S) {
    return S === 61 ? (t.consume(S), E) : lt(S) ? (t.consume(S), N) : y(S);
  }
  function E(S) {
    return S === null || S === 60 || S === 61 || S === 62 || S === 96
      ? n(S)
      : S === 34 || S === 39
        ? (t.consume(S), (s = S), M)
        : lt(S)
          ? (t.consume(S), E)
          : z(S);
  }
  function M(S) {
    return S === s ? (t.consume(S), (s = null), F) : S === null || Q(S) ? n(S) : (t.consume(S), M);
  }
  function z(S) {
    return S === null || S === 34 || S === 39 || S === 47 || S === 60 || S === 61 || S === 62 || S === 96 || yt(S)
      ? N(S)
      : (t.consume(S), z);
  }
  function F(S) {
    return S === 47 || S === 62 || lt(S) ? y(S) : n(S);
  }
  function w(S) {
    return S === 62 ? (t.consume(S), Z) : n(S);
  }
  function Z(S) {
    return S === null || Q(S) ? L(S) : lt(S) ? (t.consume(S), Z) : n(S);
  }
  function L(S) {
    return S === 45 && i === 2
      ? (t.consume(S), st)
      : S === 60 && i === 1
        ? (t.consume(S), Dt)
        : S === 62 && i === 4
          ? (t.consume(S), Rt)
          : S === 63 && i === 3
            ? (t.consume(S), k)
            : S === 93 && i === 5
              ? (t.consume(S), U)
              : Q(S) && (i === 6 || i === 7)
                ? (t.exit("htmlFlowData"), t.check(mE, _t, H)(S))
                : S === null || Q(S)
                  ? (t.exit("htmlFlowData"), H(S))
                  : (t.consume(S), L);
  }
  function H(S) {
    return t.check(pE, X, _t)(S);
  }
  function X(S) {
    return (t.enter("lineEnding"), t.consume(S), t.exit("lineEnding"), tt);
  }
  function tt(S) {
    return S === null || Q(S) ? H(S) : (t.enter("htmlFlowData"), L(S));
  }
  function st(S) {
    return S === 45 ? (t.consume(S), k) : L(S);
  }
  function Dt(S) {
    return S === 47 ? (t.consume(S), (a = ""), Ut) : L(S);
  }
  function Ut(S) {
    if (S === 62) {
      let ut = a.toLowerCase();
      return Wd.includes(ut) ? (t.consume(S), Rt) : L(S);
    }
    return Te(S) && a.length < 8 ? (t.consume(S), (a += String.fromCharCode(S)), Ut) : L(S);
  }
  function U(S) {
    return S === 93 ? (t.consume(S), k) : L(S);
  }
  function k(S) {
    return S === 62 ? (t.consume(S), Rt) : S === 45 && i === 2 ? (t.consume(S), k) : L(S);
  }
  function Rt(S) {
    return S === null || Q(S) ? (t.exit("htmlFlowData"), _t(S)) : (t.consume(S), Rt);
  }
  function _t(S) {
    return (t.exit("htmlFlow"), e(S));
  }
}
function yE(t, e, n) {
  let l = this;
  return i;
  function i(a) {
    return Q(a) ? (t.enter("lineEnding"), t.consume(a), t.exit("lineEnding"), r) : n(a);
  }
  function r(a) {
    return l.parser.lazy[l.now().line] ? n(a) : e(a);
  }
}
function vE(t, e, n) {
  return l;
  function l(i) {
    return (t.enter("lineEnding"), t.consume(i), t.exit("lineEnding"), t.attempt(Jn, e, n));
  }
}
var em = { name: "htmlText", tokenize: bE };
function bE(t, e, n) {
  let l = this,
    i,
    r,
    a;
  return o;
  function o(k) {
    return (t.enter("htmlText"), t.enter("htmlTextData"), t.consume(k), s);
  }
  function s(k) {
    return k === 33
      ? (t.consume(k), u)
      : k === 47
        ? (t.consume(k), N)
        : k === 63
          ? (t.consume(k), y)
          : Te(k)
            ? (t.consume(k), z)
            : n(k);
  }
  function u(k) {
    return k === 45 ? (t.consume(k), f) : k === 91 ? (t.consume(k), (r = 0), g) : Te(k) ? (t.consume(k), p) : n(k);
  }
  function f(k) {
    return k === 45 ? (t.consume(k), d) : n(k);
  }
  function c(k) {
    return k === null ? n(k) : k === 45 ? (t.consume(k), m) : Q(k) ? ((a = c), Dt(k)) : (t.consume(k), c);
  }
  function m(k) {
    return k === 45 ? (t.consume(k), d) : c(k);
  }
  function d(k) {
    return k === 62 ? st(k) : k === 45 ? m(k) : c(k);
  }
  function g(k) {
    let Rt = "CDATA[";
    return k === Rt.charCodeAt(r++) ? (t.consume(k), r === Rt.length ? x : g) : n(k);
  }
  function x(k) {
    return k === null ? n(k) : k === 93 ? (t.consume(k), C) : Q(k) ? ((a = x), Dt(k)) : (t.consume(k), x);
  }
  function C(k) {
    return k === 93 ? (t.consume(k), h) : x(k);
  }
  function h(k) {
    return k === 62 ? st(k) : k === 93 ? (t.consume(k), h) : x(k);
  }
  function p(k) {
    return k === null || k === 62 ? st(k) : Q(k) ? ((a = p), Dt(k)) : (t.consume(k), p);
  }
  function y(k) {
    return k === null ? n(k) : k === 63 ? (t.consume(k), T) : Q(k) ? ((a = y), Dt(k)) : (t.consume(k), y);
  }
  function T(k) {
    return k === 62 ? st(k) : y(k);
  }
  function N(k) {
    return Te(k) ? (t.consume(k), E) : n(k);
  }
  function E(k) {
    return k === 45 || oe(k) ? (t.consume(k), E) : M(k);
  }
  function M(k) {
    return Q(k) ? ((a = M), Dt(k)) : lt(k) ? (t.consume(k), M) : st(k);
  }
  function z(k) {
    return k === 45 || oe(k) ? (t.consume(k), z) : k === 47 || k === 62 || yt(k) ? F(k) : n(k);
  }
  function F(k) {
    return k === 47
      ? (t.consume(k), st)
      : k === 58 || k === 95 || Te(k)
        ? (t.consume(k), w)
        : Q(k)
          ? ((a = F), Dt(k))
          : lt(k)
            ? (t.consume(k), F)
            : st(k);
  }
  function w(k) {
    return k === 45 || k === 46 || k === 58 || k === 95 || oe(k) ? (t.consume(k), w) : Z(k);
  }
  function Z(k) {
    return k === 61 ? (t.consume(k), L) : Q(k) ? ((a = Z), Dt(k)) : lt(k) ? (t.consume(k), Z) : F(k);
  }
  function L(k) {
    return k === null || k === 60 || k === 61 || k === 62 || k === 96
      ? n(k)
      : k === 34 || k === 39
        ? (t.consume(k), (i = k), H)
        : Q(k)
          ? ((a = L), Dt(k))
          : lt(k)
            ? (t.consume(k), L)
            : (t.consume(k), X);
  }
  function H(k) {
    return k === i ? (t.consume(k), (i = void 0), tt) : k === null ? n(k) : Q(k) ? ((a = H), Dt(k)) : (t.consume(k), H);
  }
  function X(k) {
    return k === null || k === 34 || k === 39 || k === 60 || k === 61 || k === 96
      ? n(k)
      : k === 47 || k === 62 || yt(k)
        ? F(k)
        : (t.consume(k), X);
  }
  function tt(k) {
    return k === 47 || k === 62 || yt(k) ? F(k) : n(k);
  }
  function st(k) {
    return k === 62 ? (t.consume(k), t.exit("htmlTextData"), t.exit("htmlText"), e) : n(k);
  }
  function Dt(k) {
    return (t.exit("htmlTextData"), t.enter("lineEnding"), t.consume(k), t.exit("lineEnding"), Ut);
  }
  function Ut(k) {
    return lt(k)
      ? W(t, U, "linePrefix", l.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(k)
      : U(k);
  }
  function U(k) {
    return (t.enter("htmlTextData"), a(k));
  }
}
var Oi = { name: "labelEnd", resolveAll: wE, resolveTo: TE, tokenize: EE },
  xE = { tokenize: CE },
  kE = { tokenize: AE },
  SE = { tokenize: NE };
function wE(t) {
  let e = -1,
    n = [];
  for (; ++e < t.length;) {
    let l = t[e][1];
    if ((n.push(t[e]), l.type === "labelImage" || l.type === "labelLink" || l.type === "labelEnd")) {
      let i = l.type === "labelImage" ? 4 : 2;
      ((l.type = "data"), (e += i));
    }
  }
  return (t.length !== n.length && de(t, 0, t.length, n), t);
}
function TE(t, e) {
  let n = t.length,
    l = 0,
    i,
    r,
    a,
    o;
  for (; n--;)
    if (((i = t[n][1]), r)) {
      if (i.type === "link" || (i.type === "labelLink" && i._inactive)) break;
      t[n][0] === "enter" && i.type === "labelLink" && (i._inactive = !0);
    } else if (a) {
      if (
        t[n][0] === "enter" &&
        (i.type === "labelImage" || i.type === "labelLink") &&
        !i._balanced &&
        ((r = n), i.type !== "labelLink")
      ) {
        l = 2;
        break;
      }
    } else i.type === "labelEnd" && (a = n);
  let s = {
      type: t[r][1].type === "labelLink" ? "link" : "image",
      start: { ...t[r][1].start },
      end: { ...t[t.length - 1][1].end },
    },
    u = { type: "label", start: { ...t[r][1].start }, end: { ...t[a][1].end } },
    f = { type: "labelText", start: { ...t[r + l + 2][1].end }, end: { ...t[a - 2][1].start } };
  return (
    (o = [
      ["enter", s, e],
      ["enter", u, e],
    ]),
    (o = We(o, t.slice(r + 1, r + l + 3))),
    (o = We(o, [["enter", f, e]])),
    (o = We(o, Jl(e.parser.constructs.insideSpan.null, t.slice(r + l + 4, a - 3), e))),
    (o = We(o, [["exit", f, e], t[a - 2], t[a - 1], ["exit", u, e]])),
    (o = We(o, t.slice(a + 1))),
    (o = We(o, [["exit", s, e]])),
    de(t, r, t.length, o),
    t
  );
}
function EE(t, e, n) {
  let l = this,
    i = l.events.length,
    r,
    a;
  for (; i--;)
    if ((l.events[i][1].type === "labelImage" || l.events[i][1].type === "labelLink") && !l.events[i][1]._balanced) {
      r = l.events[i][1];
      break;
    }
  return o;
  function o(m) {
    return r
      ? r._inactive
        ? c(m)
        : ((a = l.parser.defined.includes(Fe(l.sliceSerialize({ start: r.end, end: l.now() })))),
          t.enter("labelEnd"),
          t.enter("labelMarker"),
          t.consume(m),
          t.exit("labelMarker"),
          t.exit("labelEnd"),
          s)
      : n(m);
  }
  function s(m) {
    return m === 40 ? t.attempt(xE, f, a ? f : c)(m) : m === 91 ? t.attempt(kE, f, a ? u : c)(m) : a ? f(m) : c(m);
  }
  function u(m) {
    return t.attempt(SE, f, c)(m);
  }
  function f(m) {
    return e(m);
  }
  function c(m) {
    return ((r._balanced = !0), n(m));
  }
}
function CE(t, e, n) {
  return l;
  function l(c) {
    return (t.enter("resource"), t.enter("resourceMarker"), t.consume(c), t.exit("resourceMarker"), i);
  }
  function i(c) {
    return yt(c) ? _i(t, r)(c) : r(c);
  }
  function r(c) {
    return c === 41
      ? f(c)
      : yu(
          t,
          a,
          o,
          "resourceDestination",
          "resourceDestinationLiteral",
          "resourceDestinationLiteralMarker",
          "resourceDestinationRaw",
          "resourceDestinationString",
          32,
        )(c);
  }
  function a(c) {
    return yt(c) ? _i(t, s)(c) : f(c);
  }
  function o(c) {
    return n(c);
  }
  function s(c) {
    return c === 34 || c === 39 || c === 40
      ? bu(t, u, n, "resourceTitle", "resourceTitleMarker", "resourceTitleString")(c)
      : f(c);
  }
  function u(c) {
    return yt(c) ? _i(t, f)(c) : f(c);
  }
  function f(c) {
    return c === 41 ? (t.enter("resourceMarker"), t.consume(c), t.exit("resourceMarker"), t.exit("resource"), e) : n(c);
  }
}
function AE(t, e, n) {
  let l = this;
  return i;
  function i(o) {
    return vu.call(l, t, r, a, "reference", "referenceMarker", "referenceString")(o);
  }
  function r(o) {
    return l.parser.defined.includes(Fe(l.sliceSerialize(l.events[l.events.length - 1][1]).slice(1, -1))) ? e(o) : n(o);
  }
  function a(o) {
    return n(o);
  }
}
function NE(t, e, n) {
  return l;
  function l(r) {
    return (t.enter("reference"), t.enter("referenceMarker"), t.consume(r), t.exit("referenceMarker"), i);
  }
  function i(r) {
    return r === 93
      ? (t.enter("referenceMarker"), t.consume(r), t.exit("referenceMarker"), t.exit("reference"), e)
      : n(r);
  }
}
var nm = { name: "labelStartImage", resolveAll: Oi.resolveAll, tokenize: RE };
function RE(t, e, n) {
  let l = this;
  return i;
  function i(o) {
    return (t.enter("labelImage"), t.enter("labelImageMarker"), t.consume(o), t.exit("labelImageMarker"), r);
  }
  function r(o) {
    return o === 91 ? (t.enter("labelMarker"), t.consume(o), t.exit("labelMarker"), t.exit("labelImage"), a) : n(o);
  }
  function a(o) {
    return o === 94 && "_hiddenFootnoteSupport" in l.parser.constructs ? n(o) : e(o);
  }
}
var lm = { name: "labelStartLink", resolveAll: Oi.resolveAll, tokenize: ME };
function ME(t, e, n) {
  let l = this;
  return i;
  function i(a) {
    return (t.enter("labelLink"), t.enter("labelMarker"), t.consume(a), t.exit("labelMarker"), t.exit("labelLink"), r);
  }
  function r(a) {
    return a === 94 && "_hiddenFootnoteSupport" in l.parser.constructs ? n(a) : e(a);
  }
}
var ho = { name: "lineEnding", tokenize: DE };
function DE(t, e) {
  return n;
  function n(l) {
    return (t.enter("lineEnding"), t.consume(l), t.exit("lineEnding"), W(t, e, "linePrefix"));
  }
}
var zi = { name: "thematicBreak", tokenize: _E };
function _E(t, e, n) {
  let l = 0,
    i;
  return r;
  function r(u) {
    return (t.enter("thematicBreak"), a(u));
  }
  function a(u) {
    return ((i = u), o(u));
  }
  function o(u) {
    return u === i
      ? (t.enter("thematicBreakSequence"), s(u))
      : l >= 3 && (u === null || Q(u))
        ? (t.exit("thematicBreak"), e(u))
        : n(u);
  }
  function s(u) {
    return u === i
      ? (t.consume(u), l++, s)
      : (t.exit("thematicBreakSequence"), lt(u) ? W(t, o, "whitespace")(u) : o(u));
  }
}
var Ve = { continuation: { tokenize: UE }, exit: HE, name: "list", tokenize: LE },
  OE = { partial: !0, tokenize: qE },
  zE = { partial: !0, tokenize: BE };
function LE(t, e, n) {
  let l = this,
    i = l.events[l.events.length - 1],
    r = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0,
    a = 0;
  return o;
  function o(d) {
    let g = l.containerState.type || (d === 42 || d === 43 || d === 45 ? "listUnordered" : "listOrdered");
    if (g === "listUnordered" ? !l.containerState.marker || d === l.containerState.marker : co(d)) {
      if (
        (l.containerState.type || ((l.containerState.type = g), t.enter(g, { _container: !0 })), g === "listUnordered")
      )
        return (t.enter("listItemPrefix"), d === 42 || d === 45 ? t.check(zi, n, u)(d) : u(d));
      if (!l.interrupt || d === 49) return (t.enter("listItemPrefix"), t.enter("listItemValue"), s(d));
    }
    return n(d);
  }
  function s(d) {
    return co(d) && ++a < 10
      ? (t.consume(d), s)
      : (!l.interrupt || a < 2) && (l.containerState.marker ? d === l.containerState.marker : d === 41 || d === 46)
        ? (t.exit("listItemValue"), u(d))
        : n(d);
  }
  function u(d) {
    return (
      t.enter("listItemMarker"),
      t.consume(d),
      t.exit("listItemMarker"),
      (l.containerState.marker = l.containerState.marker || d),
      t.check(Jn, l.interrupt ? n : f, t.attempt(OE, m, c))
    );
  }
  function f(d) {
    return ((l.containerState.initialBlankLine = !0), r++, m(d));
  }
  function c(d) {
    return lt(d) ? (t.enter("listItemPrefixWhitespace"), t.consume(d), t.exit("listItemPrefixWhitespace"), m) : n(d);
  }
  function m(d) {
    return ((l.containerState.size = r + l.sliceSerialize(t.exit("listItemPrefix"), !0).length), e(d));
  }
}
function UE(t, e, n) {
  let l = this;
  return ((l.containerState._closeFlow = void 0), t.check(Jn, i, r));
  function i(o) {
    return (
      (l.containerState.furtherBlankLines = l.containerState.furtherBlankLines || l.containerState.initialBlankLine),
      W(t, e, "listItemIndent", l.containerState.size + 1)(o)
    );
  }
  function r(o) {
    return l.containerState.furtherBlankLines || !lt(o)
      ? ((l.containerState.furtherBlankLines = void 0), (l.containerState.initialBlankLine = void 0), a(o))
      : ((l.containerState.furtherBlankLines = void 0),
        (l.containerState.initialBlankLine = void 0),
        t.attempt(zE, e, a)(o));
  }
  function a(o) {
    return (
      (l.containerState._closeFlow = !0),
      (l.interrupt = void 0),
      W(t, t.attempt(Ve, e, n), "linePrefix", l.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(o)
    );
  }
}
function BE(t, e, n) {
  let l = this;
  return W(t, i, "listItemIndent", l.containerState.size + 1);
  function i(r) {
    let a = l.events[l.events.length - 1];
    return a && a[1].type === "listItemIndent" && a[2].sliceSerialize(a[1], !0).length === l.containerState.size
      ? e(r)
      : n(r);
  }
}
function HE(t) {
  t.exit(this.containerState.type);
}
function qE(t, e, n) {
  let l = this;
  return W(t, i, "listItemPrefixWhitespace", l.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5);
  function i(r) {
    let a = l.events[l.events.length - 1];
    return !lt(r) && a && a[1].type === "listItemPrefixWhitespace" ? e(r) : n(r);
  }
}
var xu = { name: "setextUnderline", resolveTo: IE, tokenize: jE };
function IE(t, e) {
  let n = t.length,
    l,
    i,
    r;
  for (; n--;)
    if (t[n][0] === "enter") {
      if (t[n][1].type === "content") {
        l = n;
        break;
      }
      t[n][1].type === "paragraph" && (i = n);
    } else (t[n][1].type === "content" && t.splice(n, 1), !r && t[n][1].type === "definition" && (r = n));
  let a = { type: "setextHeading", start: { ...t[l][1].start }, end: { ...t[t.length - 1][1].end } };
  return (
    (t[i][1].type = "setextHeadingText"),
    r
      ? (t.splice(i, 0, ["enter", a, e]), t.splice(r + 1, 0, ["exit", t[l][1], e]), (t[l][1].end = { ...t[r][1].end }))
      : (t[l][1] = a),
    t.push(["exit", a, e]),
    t
  );
}
function jE(t, e, n) {
  let l = this,
    i;
  return r;
  function r(u) {
    let f = l.events.length,
      c;
    for (; f--;)
      if (
        l.events[f][1].type !== "lineEnding" &&
        l.events[f][1].type !== "linePrefix" &&
        l.events[f][1].type !== "content"
      ) {
        c = l.events[f][1].type === "paragraph";
        break;
      }
    return !l.parser.lazy[l.now().line] && (l.interrupt || c) ? (t.enter("setextHeadingLine"), (i = u), a(u)) : n(u);
  }
  function a(u) {
    return (t.enter("setextHeadingLineSequence"), o(u));
  }
  function o(u) {
    return u === i ? (t.consume(u), o) : (t.exit("setextHeadingLineSequence"), lt(u) ? W(t, s, "lineSuffix")(u) : s(u));
  }
  function s(u) {
    return u === null || Q(u) ? (t.exit("setextHeadingLine"), e(u)) : n(u);
  }
}
var Vb = { tokenize: YE };
function YE(t) {
  let e = this,
    n = t.attempt(
      Jn,
      l,
      t.attempt(
        this.parser.constructs.flowInitial,
        i,
        W(t, t.attempt(this.parser.constructs.flow, i, t.attempt(Zd, i)), "linePrefix"),
      ),
    );
  return n;
  function l(r) {
    if (r === null) {
      t.consume(r);
      return;
    }
    return (t.enter("lineEndingBlank"), t.consume(r), t.exit("lineEndingBlank"), (e.currentConstruct = void 0), n);
  }
  function i(r) {
    if (r === null) {
      t.consume(r);
      return;
    }
    return (t.enter("lineEnding"), t.consume(r), t.exit("lineEnding"), (e.currentConstruct = void 0), n);
  }
}
var Qb = { resolveAll: Zb() },
  Pb = Xb("string"),
  Gb = Xb("text");
function Xb(t) {
  return { resolveAll: Zb(t === "text" ? FE : void 0), tokenize: e };
  function e(n) {
    let l = this,
      i = this.parser.constructs[t],
      r = n.attempt(i, a, o);
    return a;
    function a(f) {
      return u(f) ? r(f) : o(f);
    }
    function o(f) {
      if (f === null) {
        n.consume(f);
        return;
      }
      return (n.enter("data"), n.consume(f), s);
    }
    function s(f) {
      return u(f) ? (n.exit("data"), r(f)) : (n.consume(f), s);
    }
    function u(f) {
      if (f === null) return !0;
      let c = i[f],
        m = -1;
      if (c)
        for (; ++m < c.length;) {
          let d = c[m];
          if (!d.previous || d.previous.call(l, l.previous)) return !0;
        }
      return !1;
    }
  }
}
function Zb(t) {
  return e;
  function e(n, l) {
    let i = -1,
      r;
    for (; ++i <= n.length;)
      r === void 0
        ? n[i] && n[i][1].type === "data" && ((r = i), i++)
        : (!n[i] || n[i][1].type !== "data") &&
          (i !== r + 2 && ((n[r][1].end = n[i - 1][1].end), n.splice(r + 2, i - r - 2), (i = r + 2)), (r = void 0));
    return t ? t(n, l) : n;
  }
}
function FE(t, e) {
  let n = 0;
  for (; ++n <= t.length;)
    if ((n === t.length || t[n][1].type === "lineEnding") && t[n - 1][1].type === "data") {
      let l = t[n - 1][1],
        i = e.sliceStream(l),
        r = i.length,
        a = -1,
        o = 0,
        s;
      for (; r--;) {
        let u = i[r];
        if (typeof u == "string") {
          for (a = u.length; u.charCodeAt(a - 1) === 32;) (o++, a--);
          if (a) break;
          a = -1;
        } else if (u === -2) ((s = !0), o++);
        else if (u !== -1) {
          r++;
          break;
        }
      }
      if ((e._contentTypeTextTrailing && n === t.length && (o = 0), o)) {
        let u = {
          type: n === t.length || s || o < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            _bufferIndex: r ? a : l.start._bufferIndex + a,
            _index: l.start._index + r,
            line: l.end.line,
            column: l.end.column - o,
            offset: l.end.offset - o,
          },
          end: { ...l.end },
        };
        ((l.end = { ...u.start }),
          l.start.offset === l.end.offset
            ? Object.assign(l, u)
            : (t.splice(n, 0, ["enter", u, e], ["exit", u, e]), (n += 2)));
      }
      n++;
    }
  return t;
}
var im = {};
vp(im, {
  attentionMarkers: () => JE,
  contentInitial: () => QE,
  disable: () => $E,
  document: () => VE,
  flow: () => GE,
  flowInitial: () => PE,
  insideSpan: () => KE,
  string: () => XE,
  text: () => ZE,
});
var VE = {
    42: Ve,
    43: Ve,
    45: Ve,
    48: Ve,
    49: Ve,
    50: Ve,
    51: Ve,
    52: Ve,
    53: Ve,
    54: Ve,
    55: Ve,
    56: Ve,
    57: Ve,
    62: fu,
  },
  QE = { 91: Kd },
  PE = { [-2]: mo, [-1]: mo, 32: mo },
  GE = { 35: $d, 42: zi, 45: [xu, zi], 60: tm, 61: xu, 95: zi, 96: pu, 126: pu },
  XE = { 38: mu, 92: du },
  ZE = {
    [-5]: ho,
    [-4]: ho,
    [-3]: ho,
    33: nm,
    38: mu,
    42: fo,
    60: [Gd, em],
    91: lm,
    92: [Jd, du],
    93: Oi,
    95: fo,
    96: Xd,
  },
  KE = { null: [fo, Qb] },
  JE = { null: [42, 95] },
  $E = { null: [] };
function Kb(t, e, n) {
  let l = {
      _bufferIndex: -1,
      _index: 0,
      line: (n && n.line) || 1,
      column: (n && n.column) || 1,
      offset: (n && n.offset) || 0,
    },
    i = {},
    r = [],
    a = [],
    o = [],
    s = !0,
    u = { attempt: F(M), check: F(z), consume: T, enter: N, exit: E, interrupt: F(z, { interrupt: !0 }) },
    f = {
      code: null,
      containerState: {},
      defineSkip: h,
      events: [],
      now: C,
      parser: t,
      previous: null,
      sliceSerialize: g,
      sliceStream: x,
      write: d,
    },
    c = e.tokenize.call(f, u),
    m;
  return (e.resolveAll && r.push(e), f);
  function d(H) {
    return ((a = We(a, H)), p(), a[a.length - 1] !== null ? [] : (w(e, 0), (f.events = Jl(r, f.events, f)), f.events));
  }
  function g(H, X) {
    return tC(x(H), X);
  }
  function x(H) {
    return WE(a, H);
  }
  function C() {
    let { _bufferIndex: H, _index: X, line: tt, column: st, offset: Dt } = l;
    return { _bufferIndex: H, _index: X, line: tt, column: st, offset: Dt };
  }
  function h(H) {
    ((i[H.line] = H.column), L());
  }
  function p() {
    let H;
    for (; l._index < a.length;) {
      let X = a[l._index];
      if (typeof X == "string")
        for (H = l._index, l._bufferIndex < 0 && (l._bufferIndex = 0); l._index === H && l._bufferIndex < X.length;)
          y(X.charCodeAt(l._bufferIndex));
      else y(X);
    }
  }
  function y(H) {
    ((s = void 0), (m = H), (c = c(H)));
  }
  function T(H) {
    (Q(H) ? (l.line++, (l.column = 1), (l.offset += H === -3 ? 2 : 1), L()) : H !== -1 && (l.column++, l.offset++),
      l._bufferIndex < 0
        ? l._index++
        : (l._bufferIndex++, l._bufferIndex === a[l._index].length && ((l._bufferIndex = -1), l._index++)),
      (f.previous = H),
      (s = !0));
  }
  function N(H, X) {
    let tt = X || {};
    return ((tt.type = H), (tt.start = C()), f.events.push(["enter", tt, f]), o.push(tt), tt);
  }
  function E(H) {
    let X = o.pop();
    return ((X.end = C()), f.events.push(["exit", X, f]), X);
  }
  function M(H, X) {
    w(H, X.from);
  }
  function z(H, X) {
    X.restore();
  }
  function F(H, X) {
    return tt;
    function tt(st, Dt, Ut) {
      let U, k, Rt, _t;
      return Array.isArray(st) ? ut(st) : "tokenize" in st ? ut([st]) : S(st);
      function S(gt) {
        return se;
        function se(Xt) {
          let ge = Xt !== null && gt[Xt],
            I = Xt !== null && gt.null,
            V = [...(Array.isArray(ge) ? ge : ge ? [ge] : []), ...(Array.isArray(I) ? I : I ? [I] : [])];
          return ut(V)(Xt);
        }
      }
      function ut(gt) {
        return ((U = gt), (k = 0), gt.length === 0 ? Ut : pe(gt[k]));
      }
      function pe(gt) {
        return se;
        function se(Xt) {
          return (
            (_t = Z()),
            (Rt = gt),
            gt.partial || (f.currentConstruct = gt),
            gt.name && f.parser.constructs.disable.null.includes(gt.name)
              ? Ne(Xt)
              : gt.tokenize.call(X ? Object.assign(Object.create(f), X) : f, u, he, Ne)(Xt)
          );
        }
      }
      function he(gt) {
        return ((s = !0), H(Rt, _t), Dt);
      }
      function Ne(gt) {
        return ((s = !0), _t.restore(), ++k < U.length ? pe(U[k]) : Ut);
      }
    }
  }
  function w(H, X) {
    (H.resolveAll && !r.includes(H) && r.push(H),
      H.resolve && de(f.events, X, f.events.length - X, H.resolve(f.events.slice(X), f)),
      H.resolveTo && (f.events = H.resolveTo(f.events, f)));
  }
  function Z() {
    let H = C(),
      X = f.previous,
      tt = f.currentConstruct,
      st = f.events.length,
      Dt = Array.from(o);
    return { from: st, restore: Ut };
    function Ut() {
      ((l = H), (f.previous = X), (f.currentConstruct = tt), (f.events.length = st), (o = Dt), L());
    }
  }
  function L() {
    l.line in i && l.column < 2 && ((l.column = i[l.line]), (l.offset += i[l.line] - 1));
  }
}
function WE(t, e) {
  let n = e.start._index,
    l = e.start._bufferIndex,
    i = e.end._index,
    r = e.end._bufferIndex,
    a;
  if (n === i) a = [t[n].slice(l, r)];
  else {
    if (((a = t.slice(n, i)), l > -1)) {
      let o = a[0];
      typeof o == "string" ? (a[0] = o.slice(l)) : a.shift();
    }
    r > 0 && a.push(t[i].slice(0, r));
  }
  return a;
}
function tC(t, e) {
  let n = -1,
    l = [],
    i;
  for (; ++n < t.length;) {
    let r = t[n],
      a;
    if (typeof r == "string") a = r;
    else
      switch (r) {
        case -5: {
          a = "\r";
          break;
        }
        case -4: {
          a = `
`;
          break;
        }
        case -3: {
          a = `\r
`;
          break;
        }
        case -2: {
          a = e ? " " : "	";
          break;
        }
        case -1: {
          if (!e && i) continue;
          a = " ";
          break;
        }
        default:
          a = String.fromCharCode(r);
      }
    ((i = r === -2), l.push(a));
  }
  return l.join("");
}
function rm(t) {
  let l = {
    constructs: uu([im, ...((t || {}).extensions || [])]),
    content: i(Hb),
    defined: [],
    document: i(Ib),
    flow: i(Vb),
    lazy: {},
    string: i(Pb),
    text: i(Gb),
  };
  return l;
  function i(r) {
    return a;
    function a(o) {
      return Kb(l, r, o);
    }
  }
}
function am(t) {
  for (; !gu(t););
  return t;
}
var Jb = /[\0\t\n\r]/g;
function om() {
  let t = 1,
    e = "",
    n = !0,
    l;
  return i;
  function i(r, a, o) {
    let s = [],
      u,
      f,
      c,
      m,
      d;
    for (
      r = e + (typeof r == "string" ? r.toString() : new TextDecoder(a || void 0).decode(r)),
        c = 0,
        e = "",
        n && (r.charCodeAt(0) === 65279 && c++, (n = void 0));
      c < r.length;
    ) {
      if (
        ((Jb.lastIndex = c),
        (u = Jb.exec(r)),
        (m = u && u.index !== void 0 ? u.index : r.length),
        (d = r.charCodeAt(m)),
        !u)
      ) {
        e = r.slice(c);
        break;
      }
      if (d === 10 && c === m && l) (s.push(-3), (l = void 0));
      else
        switch ((l && (s.push(-5), (l = void 0)), c < m && (s.push(r.slice(c, m)), (t += m - c)), d)) {
          case 0: {
            (s.push(65533), t++);
            break;
          }
          case 9: {
            for (f = Math.ceil(t / 4) * 4, s.push(-2); t++ < f;) s.push(-1);
            break;
          }
          case 10: {
            (s.push(-4), (t = 1));
            break;
          }
          default:
            ((l = !0), (t = 1));
        }
      c = m + 1;
    }
    return (o && (l && s.push(-5), e && s.push(e), s.push(null)), s);
  }
}
var eC = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function $b(t) {
  return t.replace(eC, nC);
}
function nC(t, e, n) {
  if (e) return e;
  if (n.charCodeAt(0) === 35) {
    let i = n.charCodeAt(1),
      r = i === 120 || i === 88;
    return cu(n.slice(r ? 2 : 1), r ? 16 : 10);
  }
  return Hr(n) || t;
}
var t0 = {}.hasOwnProperty;
function sm(t, e, n) {
  return (
    typeof e != "string" && ((n = e), (e = void 0)),
    lC(n)(
      am(
        rm(n)
          .document()
          .write(om()(t, e, !0)),
      ),
    )
  );
}
function lC(t) {
  let e = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: r(ye),
      autolinkProtocol: F,
      autolinkEmail: F,
      atxHeading: r(K),
      blockQuote: r(Xt),
      characterEscape: F,
      characterReference: F,
      codeFenced: r(ge),
      codeFencedFenceInfo: a,
      codeFencedFenceMeta: a,
      codeIndented: r(ge, a),
      codeText: r(I, a),
      codeTextData: F,
      data: F,
      codeFlowValue: F,
      definition: r(V),
      definitionDestinationString: a,
      definitionLabelString: a,
      definitionTitleString: a,
      emphasis: r(Y),
      hardBreakEscape: r(et),
      hardBreakTrailing: r(et),
      htmlFlow: r(ot, a),
      htmlFlowData: F,
      htmlText: r(ot, a),
      htmlTextData: F,
      image: r(Et),
      label: a,
      link: r(ye),
      listItem: r(jt),
      listItemValue: m,
      listOrdered: r(Vt, c),
      listUnordered: r(Vt),
      paragraph: r(Ge),
      reference: S,
      referenceString: a,
      resourceDestinationString: a,
      resourceTitleString: a,
      setextHeading: r(K),
      strong: r(Le),
      thematicBreak: r(Xe),
    },
    exit: {
      atxHeading: s(),
      atxHeadingSequence: N,
      autolink: s(),
      autolinkEmail: se,
      autolinkProtocol: gt,
      blockQuote: s(),
      characterEscapeValue: w,
      characterReferenceMarkerHexadecimal: pe,
      characterReferenceMarkerNumeric: pe,
      characterReferenceValue: he,
      characterReference: Ne,
      codeFenced: s(C),
      codeFencedFence: x,
      codeFencedFenceInfo: d,
      codeFencedFenceMeta: g,
      codeFlowValue: w,
      codeIndented: s(h),
      codeText: s(tt),
      codeTextData: w,
      data: w,
      definition: s(),
      definitionDestinationString: T,
      definitionLabelString: p,
      definitionTitleString: y,
      emphasis: s(),
      hardBreakEscape: s(L),
      hardBreakTrailing: s(L),
      htmlFlow: s(H),
      htmlFlowData: w,
      htmlText: s(X),
      htmlTextData: w,
      image: s(Dt),
      label: U,
      labelText: Ut,
      lineEnding: Z,
      link: s(st),
      listItem: s(),
      listOrdered: s(),
      listUnordered: s(),
      paragraph: s(),
      referenceString: ut,
      resourceDestinationString: k,
      resourceTitleString: Rt,
      resource: _t,
      setextHeading: s(z),
      setextHeadingLineSequence: M,
      setextHeadingText: E,
      strong: s(),
      thematicBreak: s(),
    },
  };
  e0(e, (t || {}).mdastExtensions || []);
  let n = {};
  return l;
  function l(R) {
    let q = { type: "root", children: [] },
      nt = { stack: [q], tokenStack: [], config: e, enter: o, exit: u, buffer: a, resume: f, data: n },
      rt = [],
      wt = -1;
    for (; ++wt < R.length;)
      if (R[wt][1].type === "listOrdered" || R[wt][1].type === "listUnordered")
        if (R[wt][0] === "enter") rt.push(wt);
        else {
          let xe = rt.pop();
          wt = i(R, xe, wt);
        }
    for (wt = -1; ++wt < R.length;) {
      let xe = e[R[wt][0]];
      t0.call(xe, R[wt][1].type) &&
        xe[R[wt][1].type].call(Object.assign({ sliceSerialize: R[wt][2].sliceSerialize }, nt), R[wt][1]);
    }
    if (nt.tokenStack.length > 0) {
      let xe = nt.tokenStack[nt.tokenStack.length - 1];
      (xe[1] || Wb).call(nt, void 0, xe[0]);
    }
    for (
      q.position = {
        start: $l(R.length > 0 ? R[0][1].start : { line: 1, column: 1, offset: 0 }),
        end: $l(R.length > 0 ? R[R.length - 2][1].end : { line: 1, column: 1, offset: 0 }),
      },
        wt = -1;
      ++wt < e.transforms.length;
    )
      q = e.transforms[wt](q) || q;
    return q;
  }
  function i(R, q, nt) {
    let rt = q - 1,
      wt = -1,
      xe = !1,
      v,
      _,
      j,
      P;
    for (; ++rt <= nt;) {
      let J = R[rt];
      switch (J[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote": {
          (J[0] === "enter" ? wt++ : wt--, (P = void 0));
          break;
        }
        case "lineEndingBlank": {
          J[0] === "enter" && (v && !P && !wt && !j && (j = rt), (P = void 0));
          break;
        }
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          P = void 0;
      }
      if (
        (!wt && J[0] === "enter" && J[1].type === "listItemPrefix") ||
        (wt === -1 && J[0] === "exit" && (J[1].type === "listUnordered" || J[1].type === "listOrdered"))
      ) {
        if (v) {
          let Pt = rt;
          for (_ = void 0; Pt--;) {
            let Tt = R[Pt];
            if (Tt[1].type === "lineEnding" || Tt[1].type === "lineEndingBlank") {
              if (Tt[0] === "exit") continue;
              (_ && ((R[_][1].type = "lineEndingBlank"), (xe = !0)), (Tt[1].type = "lineEnding"), (_ = Pt));
            } else if (!(
              Tt[1].type === "linePrefix" ||
              Tt[1].type === "blockQuotePrefix" ||
              Tt[1].type === "blockQuotePrefixWhitespace" ||
              Tt[1].type === "blockQuoteMarker" ||
              Tt[1].type === "listItemIndent"
            ))
              break;
          }
          (j && (!_ || j < _) && (v._spread = !0),
            (v.end = Object.assign({}, _ ? R[_][1].start : J[1].end)),
            R.splice(_ || rt, 0, ["exit", v, J[2]]),
            rt++,
            nt++);
        }
        if (J[1].type === "listItemPrefix") {
          let Pt = { type: "listItem", _spread: !1, start: Object.assign({}, J[1].start), end: void 0 };
          ((v = Pt), R.splice(rt, 0, ["enter", Pt, J[2]]), rt++, nt++, (j = void 0), (P = !0));
        }
      }
    }
    return ((R[q][1]._spread = xe), nt);
  }
  function r(R, q) {
    return nt;
    function nt(rt) {
      (o.call(this, R(rt), rt), q && q.call(this, rt));
    }
  }
  function a() {
    this.stack.push({ type: "fragment", children: [] });
  }
  function o(R, q, nt) {
    (this.stack[this.stack.length - 1].children.push(R),
      this.stack.push(R),
      this.tokenStack.push([q, nt || void 0]),
      (R.position = { start: $l(q.start), end: void 0 }));
  }
  function s(R) {
    return q;
    function q(nt) {
      (R && R.call(this, nt), u.call(this, nt));
    }
  }
  function u(R, q) {
    let nt = this.stack.pop(),
      rt = this.tokenStack.pop();
    if (rt) rt[0].type !== R.type && (q ? q.call(this, R, rt[0]) : (rt[1] || Wb).call(this, R, rt[0]));
    else
      throw new Error("Cannot close `" + R.type + "` (" + Zl({ start: R.start, end: R.end }) + "): it\u2019s not open");
    nt.position.end = $l(R.end);
  }
  function f() {
    return Ri(this.stack.pop());
  }
  function c() {
    this.data.expectingFirstListItemValue = !0;
  }
  function m(R) {
    if (this.data.expectingFirstListItemValue) {
      let q = this.stack[this.stack.length - 2];
      ((q.start = Number.parseInt(this.sliceSerialize(R), 10)), (this.data.expectingFirstListItemValue = void 0));
    }
  }
  function d() {
    let R = this.resume(),
      q = this.stack[this.stack.length - 1];
    q.lang = R;
  }
  function g() {
    let R = this.resume(),
      q = this.stack[this.stack.length - 1];
    q.meta = R;
  }
  function x() {
    this.data.flowCodeInside || (this.buffer(), (this.data.flowCodeInside = !0));
  }
  function C() {
    let R = this.resume(),
      q = this.stack[this.stack.length - 1];
    ((q.value = R.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "")), (this.data.flowCodeInside = void 0));
  }
  function h() {
    let R = this.resume(),
      q = this.stack[this.stack.length - 1];
    q.value = R.replace(/(\r?\n|\r)$/g, "");
  }
  function p(R) {
    let q = this.resume(),
      nt = this.stack[this.stack.length - 1];
    ((nt.label = q), (nt.identifier = Fe(this.sliceSerialize(R)).toLowerCase()));
  }
  function y() {
    let R = this.resume(),
      q = this.stack[this.stack.length - 1];
    q.title = R;
  }
  function T() {
    let R = this.resume(),
      q = this.stack[this.stack.length - 1];
    q.url = R;
  }
  function N(R) {
    let q = this.stack[this.stack.length - 1];
    if (!q.depth) {
      let nt = this.sliceSerialize(R).length;
      q.depth = nt;
    }
  }
  function E() {
    this.data.setextHeadingSlurpLineEnding = !0;
  }
  function M(R) {
    let q = this.stack[this.stack.length - 1];
    q.depth = this.sliceSerialize(R).codePointAt(0) === 61 ? 1 : 2;
  }
  function z() {
    this.data.setextHeadingSlurpLineEnding = void 0;
  }
  function F(R) {
    let nt = this.stack[this.stack.length - 1].children,
      rt = nt[nt.length - 1];
    ((!rt || rt.type !== "text") && ((rt = en()), (rt.position = { start: $l(R.start), end: void 0 }), nt.push(rt)),
      this.stack.push(rt));
  }
  function w(R) {
    let q = this.stack.pop();
    ((q.value += this.sliceSerialize(R)), (q.position.end = $l(R.end)));
  }
  function Z(R) {
    let q = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      let nt = q.children[q.children.length - 1];
      ((nt.position.end = $l(R.end)), (this.data.atHardBreak = void 0));
      return;
    }
    !this.data.setextHeadingSlurpLineEnding && e.canContainEols.includes(q.type) && (F.call(this, R), w.call(this, R));
  }
  function L() {
    this.data.atHardBreak = !0;
  }
  function H() {
    let R = this.resume(),
      q = this.stack[this.stack.length - 1];
    q.value = R;
  }
  function X() {
    let R = this.resume(),
      q = this.stack[this.stack.length - 1];
    q.value = R;
  }
  function tt() {
    let R = this.resume(),
      q = this.stack[this.stack.length - 1];
    q.value = R;
  }
  function st() {
    let R = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      let q = this.data.referenceType || "shortcut";
      ((R.type += "Reference"), (R.referenceType = q), delete R.url, delete R.title);
    } else (delete R.identifier, delete R.label);
    this.data.referenceType = void 0;
  }
  function Dt() {
    let R = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      let q = this.data.referenceType || "shortcut";
      ((R.type += "Reference"), (R.referenceType = q), delete R.url, delete R.title);
    } else (delete R.identifier, delete R.label);
    this.data.referenceType = void 0;
  }
  function Ut(R) {
    let q = this.sliceSerialize(R),
      nt = this.stack[this.stack.length - 2];
    ((nt.label = $b(q)), (nt.identifier = Fe(q).toLowerCase()));
  }
  function U() {
    let R = this.stack[this.stack.length - 1],
      q = this.resume(),
      nt = this.stack[this.stack.length - 1];
    if (((this.data.inReference = !0), nt.type === "link")) {
      let rt = R.children;
      nt.children = rt;
    } else nt.alt = q;
  }
  function k() {
    let R = this.resume(),
      q = this.stack[this.stack.length - 1];
    q.url = R;
  }
  function Rt() {
    let R = this.resume(),
      q = this.stack[this.stack.length - 1];
    q.title = R;
  }
  function _t() {
    this.data.inReference = void 0;
  }
  function S() {
    this.data.referenceType = "collapsed";
  }
  function ut(R) {
    let q = this.resume(),
      nt = this.stack[this.stack.length - 1];
    ((nt.label = q), (nt.identifier = Fe(this.sliceSerialize(R)).toLowerCase()), (this.data.referenceType = "full"));
  }
  function pe(R) {
    this.data.characterReferenceType = R.type;
  }
  function he(R) {
    let q = this.sliceSerialize(R),
      nt = this.data.characterReferenceType,
      rt;
    nt
      ? ((rt = cu(q, nt === "characterReferenceMarkerNumeric" ? 10 : 16)), (this.data.characterReferenceType = void 0))
      : (rt = Hr(q));
    let wt = this.stack[this.stack.length - 1];
    wt.value += rt;
  }
  function Ne(R) {
    let q = this.stack.pop();
    q.position.end = $l(R.end);
  }
  function gt(R) {
    w.call(this, R);
    let q = this.stack[this.stack.length - 1];
    q.url = this.sliceSerialize(R);
  }
  function se(R) {
    w.call(this, R);
    let q = this.stack[this.stack.length - 1];
    q.url = "mailto:" + this.sliceSerialize(R);
  }
  function Xt() {
    return { type: "blockquote", children: [] };
  }
  function ge() {
    return { type: "code", lang: null, meta: null, value: "" };
  }
  function I() {
    return { type: "inlineCode", value: "" };
  }
  function V() {
    return { type: "definition", identifier: "", label: null, title: null, url: "" };
  }
  function Y() {
    return { type: "emphasis", children: [] };
  }
  function K() {
    return { type: "heading", depth: 0, children: [] };
  }
  function et() {
    return { type: "break" };
  }
  function ot() {
    return { type: "html", value: "" };
  }
  function Et() {
    return { type: "image", title: null, url: "", alt: null };
  }
  function ye() {
    return { type: "link", title: null, url: "", children: [] };
  }
  function Vt(R) {
    return { type: "list", ordered: R.type === "listOrdered", start: null, spread: R._spread, children: [] };
  }
  function jt(R) {
    return { type: "listItem", spread: R._spread, checked: null, children: [] };
  }
  function Ge() {
    return { type: "paragraph", children: [] };
  }
  function Le() {
    return { type: "strong", children: [] };
  }
  function en() {
    return { type: "text", value: "" };
  }
  function Xe() {
    return { type: "thematicBreak" };
  }
}
function $l(t) {
  return { line: t.line, column: t.column, offset: t.offset };
}
function e0(t, e) {
  let n = -1;
  for (; ++n < e.length;) {
    let l = e[n];
    Array.isArray(l) ? e0(t, l) : iC(t, l);
  }
}
function iC(t, e) {
  let n;
  for (n in e)
    if (t0.call(e, n))
      switch (n) {
        case "canContainEols": {
          let l = e[n];
          l && t[n].push(...l);
          break;
        }
        case "transforms": {
          let l = e[n];
          l && t[n].push(...l);
          break;
        }
        case "enter":
        case "exit": {
          let l = e[n];
          l && Object.assign(t[n], l);
          break;
        }
      }
}
function Wb(t, e) {
  throw t
    ? new Error(
        "Cannot close `" +
          t.type +
          "` (" +
          Zl({ start: t.start, end: t.end }) +
          "): a different token (`" +
          e.type +
          "`, " +
          Zl({ start: e.start, end: e.end }) +
          ") is open",
      )
    : new Error(
        "Cannot close document, a token (`" + e.type + "`, " + Zl({ start: e.start, end: e.end }) + ") is still open",
      );
}
function ku(t) {
  let e = this;
  e.parser = n;
  function n(l) {
    return sm(l, {
      ...e.data("settings"),
      ...t,
      extensions: e.data("micromarkExtensions") || [],
      mdastExtensions: e.data("fromMarkdownExtensions") || [],
    });
  }
}
function n0(t, e) {
  let n = { type: "element", tagName: "blockquote", properties: {}, children: t.wrap(t.all(e), !0) };
  return (t.patch(e, n), t.applyData(e, n));
}
function l0(t, e) {
  let n = { type: "element", tagName: "br", properties: {}, children: [] };
  return (
    t.patch(e, n),
    [
      t.applyData(e, n),
      {
        type: "text",
        value: `
`,
      },
    ]
  );
}
function i0(t, e) {
  let n = e.value
      ? e.value +
        `
`
      : "",
    l = {},
    i = e.lang ? e.lang.split(/\s+/) : [];
  i.length > 0 && (l.className = ["language-" + i[0]]);
  let r = { type: "element", tagName: "code", properties: l, children: [{ type: "text", value: n }] };
  return (
    e.meta && (r.data = { meta: e.meta }),
    t.patch(e, r),
    (r = t.applyData(e, r)),
    (r = { type: "element", tagName: "pre", properties: {}, children: [r] }),
    t.patch(e, r),
    r
  );
}
function r0(t, e) {
  let n = { type: "element", tagName: "del", properties: {}, children: t.all(e) };
  return (t.patch(e, n), t.applyData(e, n));
}
function a0(t, e) {
  let n = { type: "element", tagName: "em", properties: {}, children: t.all(e) };
  return (t.patch(e, n), t.applyData(e, n));
}
function o0(t, e) {
  let n = typeof t.options.clobberPrefix == "string" ? t.options.clobberPrefix : "user-content-",
    l = String(e.identifier).toUpperCase(),
    i = zn(l.toLowerCase()),
    r = t.footnoteOrder.indexOf(l),
    a,
    o = t.footnoteCounts.get(l);
  (o === void 0 ? ((o = 0), t.footnoteOrder.push(l), (a = t.footnoteOrder.length)) : (a = r + 1),
    (o += 1),
    t.footnoteCounts.set(l, o));
  let s = {
    type: "element",
    tagName: "a",
    properties: {
      href: "#" + n + "fn-" + i,
      id: n + "fnref-" + i + (o > 1 ? "-" + o : ""),
      dataFootnoteRef: !0,
      ariaDescribedBy: ["footnote-label"],
    },
    children: [{ type: "text", value: String(a) }],
  };
  t.patch(e, s);
  let u = { type: "element", tagName: "sup", properties: {}, children: [s] };
  return (t.patch(e, u), t.applyData(e, u));
}
function s0(t, e) {
  let n = { type: "element", tagName: "h" + e.depth, properties: {}, children: t.all(e) };
  return (t.patch(e, n), t.applyData(e, n));
}
function u0(t, e) {
  if (t.options.allowDangerousHtml) {
    let n = { type: "raw", value: e.value };
    return (t.patch(e, n), t.applyData(e, n));
  }
}
function Su(t, e) {
  let n = e.referenceType,
    l = "]";
  if (
    (n === "collapsed" ? (l += "[]") : n === "full" && (l += "[" + (e.label || e.identifier) + "]"),
    e.type === "imageReference")
  )
    return [{ type: "text", value: "![" + e.alt + l }];
  let i = t.all(e),
    r = i[0];
  r && r.type === "text" ? (r.value = "[" + r.value) : i.unshift({ type: "text", value: "[" });
  let a = i[i.length - 1];
  return (a && a.type === "text" ? (a.value += l) : i.push({ type: "text", value: l }), i);
}
function c0(t, e) {
  let n = String(e.identifier).toUpperCase(),
    l = t.definitionById.get(n);
  if (!l) return Su(t, e);
  let i = { src: zn(l.url || ""), alt: e.alt };
  l.title !== null && l.title !== void 0 && (i.title = l.title);
  let r = { type: "element", tagName: "img", properties: i, children: [] };
  return (t.patch(e, r), t.applyData(e, r));
}
function f0(t, e) {
  let n = { src: zn(e.url) };
  (e.alt !== null && e.alt !== void 0 && (n.alt = e.alt),
    e.title !== null && e.title !== void 0 && (n.title = e.title));
  let l = { type: "element", tagName: "img", properties: n, children: [] };
  return (t.patch(e, l), t.applyData(e, l));
}
function d0(t, e) {
  let n = { type: "text", value: e.value.replace(/\r?\n|\r/g, " ") };
  t.patch(e, n);
  let l = { type: "element", tagName: "code", properties: {}, children: [n] };
  return (t.patch(e, l), t.applyData(e, l));
}
function m0(t, e) {
  let n = String(e.identifier).toUpperCase(),
    l = t.definitionById.get(n);
  if (!l) return Su(t, e);
  let i = { href: zn(l.url || "") };
  l.title !== null && l.title !== void 0 && (i.title = l.title);
  let r = { type: "element", tagName: "a", properties: i, children: t.all(e) };
  return (t.patch(e, r), t.applyData(e, r));
}
function p0(t, e) {
  let n = { href: zn(e.url) };
  e.title !== null && e.title !== void 0 && (n.title = e.title);
  let l = { type: "element", tagName: "a", properties: n, children: t.all(e) };
  return (t.patch(e, l), t.applyData(e, l));
}
function h0(t, e, n) {
  let l = t.all(e),
    i = n ? rC(n) : g0(e),
    r = {},
    a = [];
  if (typeof e.checked == "boolean") {
    let f = l[0],
      c;
    (f && f.type === "element" && f.tagName === "p"
      ? (c = f)
      : ((c = { type: "element", tagName: "p", properties: {}, children: [] }), l.unshift(c)),
      c.children.length > 0 && c.children.unshift({ type: "text", value: " " }),
      c.children.unshift({
        type: "element",
        tagName: "input",
        properties: { type: "checkbox", checked: e.checked, disabled: !0 },
        children: [],
      }),
      (r.className = ["task-list-item"]));
  }
  let o = -1;
  for (; ++o < l.length;) {
    let f = l[o];
    ((i || o !== 0 || f.type !== "element" || f.tagName !== "p") &&
      a.push({
        type: "text",
        value: `
`,
      }),
      f.type === "element" && f.tagName === "p" && !i ? a.push(...f.children) : a.push(f));
  }
  let s = l[l.length - 1];
  s &&
    (i || s.type !== "element" || s.tagName !== "p") &&
    a.push({
      type: "text",
      value: `
`,
    });
  let u = { type: "element", tagName: "li", properties: r, children: a };
  return (t.patch(e, u), t.applyData(e, u));
}
function rC(t) {
  let e = !1;
  if (t.type === "list") {
    e = t.spread || !1;
    let n = t.children,
      l = -1;
    for (; !e && ++l < n.length;) e = g0(n[l]);
  }
  return e;
}
function g0(t) {
  let e = t.spread;
  return e ?? t.children.length > 1;
}
function y0(t, e) {
  let n = {},
    l = t.all(e),
    i = -1;
  for (typeof e.start == "number" && e.start !== 1 && (n.start = e.start); ++i < l.length;) {
    let a = l[i];
    if (
      a.type === "element" &&
      a.tagName === "li" &&
      a.properties &&
      Array.isArray(a.properties.className) &&
      a.properties.className.includes("task-list-item")
    ) {
      n.className = ["contains-task-list"];
      break;
    }
  }
  let r = { type: "element", tagName: e.ordered ? "ol" : "ul", properties: n, children: t.wrap(l, !0) };
  return (t.patch(e, r), t.applyData(e, r));
}
function v0(t, e) {
  let n = { type: "element", tagName: "p", properties: {}, children: t.all(e) };
  return (t.patch(e, n), t.applyData(e, n));
}
function b0(t, e) {
  let n = { type: "root", children: t.wrap(t.all(e)) };
  return (t.patch(e, n), t.applyData(e, n));
}
function x0(t, e) {
  let n = { type: "element", tagName: "strong", properties: {}, children: t.all(e) };
  return (t.patch(e, n), t.applyData(e, n));
}
function k0(t, e) {
  let n = t.all(e),
    l = n.shift(),
    i = [];
  if (l) {
    let a = { type: "element", tagName: "thead", properties: {}, children: t.wrap([l], !0) };
    (t.patch(e.children[0], a), i.push(a));
  }
  if (n.length > 0) {
    let a = { type: "element", tagName: "tbody", properties: {}, children: t.wrap(n, !0) },
      o = Br(e.children[1]),
      s = ou(e.children[e.children.length - 1]);
    (o && s && (a.position = { start: o, end: s }), i.push(a));
  }
  let r = { type: "element", tagName: "table", properties: {}, children: t.wrap(i, !0) };
  return (t.patch(e, r), t.applyData(e, r));
}
function S0(t, e, n) {
  let l = n ? n.children : void 0,
    r = (l ? l.indexOf(e) : 1) === 0 ? "th" : "td",
    a = n && n.type === "table" ? n.align : void 0,
    o = a ? a.length : e.children.length,
    s = -1,
    u = [];
  for (; ++s < o;) {
    let c = e.children[s],
      m = {},
      d = a ? a[s] : void 0;
    d && (m.align = d);
    let g = { type: "element", tagName: r, properties: m, children: [] };
    (c && ((g.children = t.all(c)), t.patch(c, g), (g = t.applyData(c, g))), u.push(g));
  }
  let f = { type: "element", tagName: "tr", properties: {}, children: t.wrap(u, !0) };
  return (t.patch(e, f), t.applyData(e, f));
}
function w0(t, e) {
  let n = { type: "element", tagName: "td", properties: {}, children: t.all(e) };
  return (t.patch(e, n), t.applyData(e, n));
}
function E0(t) {
  let e = String(t),
    n = /\r?\n|\r/g,
    l = n.exec(e),
    i = 0,
    r = [];
  for (; l;) (r.push(T0(e.slice(i, l.index), i > 0, !0), l[0]), (i = l.index + l[0].length), (l = n.exec(e)));
  return (r.push(T0(e.slice(i), i > 0, !1)), r.join(""));
}
function T0(t, e, n) {
  let l = 0,
    i = t.length;
  if (e) {
    let r = t.codePointAt(l);
    for (; r === 9 || r === 32;) (l++, (r = t.codePointAt(l)));
  }
  if (n) {
    let r = t.codePointAt(i - 1);
    for (; r === 9 || r === 32;) (i--, (r = t.codePointAt(i - 1)));
  }
  return i > l ? t.slice(l, i) : "";
}
function C0(t, e) {
  let n = { type: "text", value: E0(String(e.value)) };
  return (t.patch(e, n), t.applyData(e, n));
}
function A0(t, e) {
  let n = { type: "element", tagName: "hr", properties: {}, children: [] };
  return (t.patch(e, n), t.applyData(e, n));
}
var N0 = {
  blockquote: n0,
  break: l0,
  code: i0,
  delete: r0,
  emphasis: a0,
  footnoteReference: o0,
  heading: s0,
  html: u0,
  imageReference: c0,
  image: f0,
  inlineCode: d0,
  linkReference: m0,
  link: p0,
  listItem: h0,
  list: y0,
  paragraph: v0,
  root: b0,
  strong: x0,
  table: k0,
  tableCell: w0,
  tableRow: S0,
  text: C0,
  thematicBreak: A0,
  toml: wu,
  yaml: wu,
  definition: wu,
  footnoteDefinition: wu,
};
function wu() {}
var R0 = typeof self == "object" ? self : globalThis,
  uC = (t, e) => {
    let n = (i, r) => (t.set(r, i), i),
      l = (i) => {
        if (t.has(i)) return t.get(i);
        let [r, a] = e[i];
        switch (r) {
          case 0:
          case -1:
            return n(a, i);
          case 1: {
            let o = n([], i);
            for (let s of a) o.push(l(s));
            return o;
          }
          case 2: {
            let o = n({}, i);
            for (let [s, u] of a) o[l(s)] = l(u);
            return o;
          }
          case 3:
            return n(new Date(a), i);
          case 4: {
            let { source: o, flags: s } = a;
            return n(new RegExp(o, s), i);
          }
          case 5: {
            let o = n(new Map(), i);
            for (let [s, u] of a) o.set(l(s), l(u));
            return o;
          }
          case 6: {
            let o = n(new Set(), i);
            for (let s of a) o.add(l(s));
            return o;
          }
          case 7: {
            let { name: o, message: s } = a;
            return n(new R0[o](s), i);
          }
          case 8:
            return n(BigInt(a), i);
          case "BigInt":
            return n(Object(BigInt(a)), i);
          case "ArrayBuffer":
            return n(new Uint8Array(a).buffer, a);
          case "DataView": {
            let { buffer: o } = new Uint8Array(a);
            return n(new DataView(o), a);
          }
        }
        return n(new R0[r](a), i);
      };
    return l;
  },
  fm = (t) => uC(new Map(), t)(0);
var qr = "",
  { toString: cC } = {},
  { keys: fC } = Object,
  go = (t) => {
    let e = typeof t;
    if (e !== "object" || !t) return [0, e];
    let n = cC.call(t).slice(8, -1);
    switch (n) {
      case "Array":
        return [1, qr];
      case "Object":
        return [2, qr];
      case "Date":
        return [3, qr];
      case "RegExp":
        return [4, qr];
      case "Map":
        return [5, qr];
      case "Set":
        return [6, qr];
      case "DataView":
        return [1, n];
    }
    return n.includes("Array") ? [1, n] : n.includes("Error") ? [7, n] : [2, n];
  },
  Eu = ([t, e]) => t === 0 && (e === "function" || e === "symbol"),
  dC = (t, e, n, l) => {
    let i = (a, o) => {
        let s = l.push(a) - 1;
        return (n.set(o, s), s);
      },
      r = (a) => {
        if (n.has(a)) return n.get(a);
        let [o, s] = go(a);
        switch (o) {
          case 0: {
            let f = a;
            switch (s) {
              case "bigint":
                ((o = 8), (f = a.toString()));
                break;
              case "function":
              case "symbol":
                if (t) throw new TypeError("unable to serialize " + s);
                f = null;
                break;
              case "undefined":
                return i([-1], a);
            }
            return i([o, f], a);
          }
          case 1: {
            if (s) {
              let m = a;
              return (
                s === "DataView" ? (m = new Uint8Array(a.buffer)) : s === "ArrayBuffer" && (m = new Uint8Array(a)),
                i([s, [...m]], a)
              );
            }
            let f = [],
              c = i([o, f], a);
            for (let m of a) f.push(r(m));
            return c;
          }
          case 2: {
            if (s)
              switch (s) {
                case "BigInt":
                  return i([s, a.toString()], a);
                case "Boolean":
                case "Number":
                case "String":
                  return i([s, a.valueOf()], a);
              }
            if (e && "toJSON" in a) return r(a.toJSON());
            let f = [],
              c = i([o, f], a);
            for (let m of fC(a)) (t || !Eu(go(a[m]))) && f.push([r(m), r(a[m])]);
            return c;
          }
          case 3:
            return i([o, a.toISOString()], a);
          case 4: {
            let { source: f, flags: c } = a;
            return i([o, { source: f, flags: c }], a);
          }
          case 5: {
            let f = [],
              c = i([o, f], a);
            for (let [m, d] of a) (t || !(Eu(go(m)) || Eu(go(d)))) && f.push([r(m), r(d)]);
            return c;
          }
          case 6: {
            let f = [],
              c = i([o, f], a);
            for (let m of a) (t || !Eu(go(m))) && f.push(r(m));
            return c;
          }
        }
        let { message: u } = a;
        return i([o, { name: s, message: u }], a);
      };
    return r;
  },
  dm = (t, { json: e, lossy: n } = {}) => {
    let l = [];
    return (dC(!(e || n), !!e, new Map(), l)(t), l);
  };
var Ir =
  typeof structuredClone == "function"
    ? (t, e) => (e && ("json" in e || "lossy" in e) ? fm(dm(t, e)) : structuredClone(t))
    : (t, e) => fm(dm(t, e));
function mC(t, e) {
  let n = [{ type: "text", value: "\u21A9" }];
  return (
    e > 1 &&
      n.push({ type: "element", tagName: "sup", properties: {}, children: [{ type: "text", value: String(e) }] }),
    n
  );
}
function pC(t, e) {
  return "Back to reference " + (t + 1) + (e > 1 ? "-" + e : "");
}
function z0(t) {
  let e = typeof t.options.clobberPrefix == "string" ? t.options.clobberPrefix : "user-content-",
    n = t.options.footnoteBackContent || mC,
    l = t.options.footnoteBackLabel || pC,
    i = t.options.footnoteLabel || "Footnotes",
    r = t.options.footnoteLabelTagName || "h2",
    a = t.options.footnoteLabelProperties || { className: ["sr-only"] },
    o = [],
    s = -1;
  for (; ++s < t.footnoteOrder.length;) {
    let u = t.footnoteById.get(t.footnoteOrder[s]);
    if (!u) continue;
    let f = t.all(u),
      c = String(u.identifier).toUpperCase(),
      m = zn(c.toLowerCase()),
      d = 0,
      g = [],
      x = t.footnoteCounts.get(c);
    for (; x !== void 0 && ++d <= x;) {
      g.length > 0 && g.push({ type: "text", value: " " });
      let p = typeof n == "string" ? n : n(s, d);
      (typeof p == "string" && (p = { type: "text", value: p }),
        g.push({
          type: "element",
          tagName: "a",
          properties: {
            href: "#" + e + "fnref-" + m + (d > 1 ? "-" + d : ""),
            dataFootnoteBackref: "",
            ariaLabel: typeof l == "string" ? l : l(s, d),
            className: ["data-footnote-backref"],
          },
          children: Array.isArray(p) ? p : [p],
        }));
    }
    let C = f[f.length - 1];
    if (C && C.type === "element" && C.tagName === "p") {
      let p = C.children[C.children.length - 1];
      (p && p.type === "text" ? (p.value += " ") : C.children.push({ type: "text", value: " " }),
        C.children.push(...g));
    } else f.push(...g);
    let h = { type: "element", tagName: "li", properties: { id: e + "fn-" + m }, children: t.wrap(f, !0) };
    (t.patch(u, h), o.push(h));
  }
  if (o.length !== 0)
    return {
      type: "element",
      tagName: "section",
      properties: { dataFootnotes: !0, className: ["footnotes"] },
      children: [
        {
          type: "element",
          tagName: r,
          properties: { ...Ir(a), id: "footnote-label" },
          children: [{ type: "text", value: i }],
        },
        {
          type: "text",
          value: `
`,
        },
        { type: "element", tagName: "ol", properties: {}, children: t.wrap(o, !0) },
        {
          type: "text",
          value: `
`,
        },
      ],
    };
}
var Wl = function (t) {
  if (t == null) return vC;
  if (typeof t == "function") return Cu(t);
  if (typeof t == "object") return Array.isArray(t) ? hC(t) : gC(t);
  if (typeof t == "string") return yC(t);
  throw new Error("Expected function, string, or object as test");
};
function hC(t) {
  let e = [],
    n = -1;
  for (; ++n < t.length;) e[n] = Wl(t[n]);
  return Cu(l);
  function l(...i) {
    let r = -1;
    for (; ++r < e.length;) if (e[r].apply(this, i)) return !0;
    return !1;
  }
}
function gC(t) {
  let e = t;
  return Cu(n);
  function n(l) {
    let i = l,
      r;
    for (r in t) if (i[r] !== e[r]) return !1;
    return !0;
  }
}
function yC(t) {
  return Cu(e);
  function e(n) {
    return n && n.type === t;
  }
}
function Cu(t) {
  return e;
  function e(n, l, i) {
    return !!(bC(n) && t.call(this, n, typeof l == "number" ? l : void 0, i || void 0));
  }
}
function vC() {
  return !0;
}
function bC(t) {
  return t !== null && typeof t == "object" && "type" in t;
}
var L0 = [],
  Au = !0,
  Li = !1,
  Nu = "skip";
function yo(t, e, n, l) {
  let i;
  typeof e == "function" && typeof n != "function" ? ((l = n), (n = e)) : (i = e);
  let r = Wl(i),
    a = l ? -1 : 1;
  o(t, void 0, [])();
  function o(s, u, f) {
    let c = s && typeof s == "object" ? s : {};
    if (typeof c.type == "string") {
      let d = typeof c.tagName == "string" ? c.tagName : typeof c.name == "string" ? c.name : void 0;
      Object.defineProperty(m, "name", { value: "node (" + (s.type + (d ? "<" + d + ">" : "")) + ")" });
    }
    return m;
    function m() {
      let d = L0,
        g,
        x,
        C;
      if ((!e || r(s, u, f[f.length - 1] || void 0)) && ((d = xC(n(s, f))), d[0] === Li)) return d;
      if ("children" in s && s.children) {
        let h = s;
        if (h.children && d[0] !== Nu)
          for (x = (l ? h.children.length : -1) + a, C = f.concat(h); x > -1 && x < h.children.length;) {
            let p = h.children[x];
            if (((g = o(p, x, C)()), g[0] === Li)) return g;
            x = typeof g[1] == "number" ? g[1] : x + a;
          }
      }
      return d;
    }
  }
}
function xC(t) {
  return Array.isArray(t) ? t : typeof t == "number" ? [Au, t] : t == null ? L0 : [t];
}
function Ui(t, e, n, l) {
  let i, r, a;
  (typeof e == "function" && typeof n != "function" ? ((r = void 0), (a = e), (i = n)) : ((r = e), (a = n), (i = l)),
    yo(t, r, o, i));
  function o(s, u) {
    let f = u[u.length - 1],
      c = f ? f.children.indexOf(s) : void 0;
    return a(s, c, f);
  }
}
var mm = {}.hasOwnProperty,
  kC = {};
function B0(t, e) {
  let n = e || kC,
    l = new Map(),
    i = new Map(),
    r = new Map(),
    a = { ...N0, ...n.handlers },
    o = {
      all: u,
      applyData: wC,
      definitionById: l,
      footnoteById: i,
      footnoteCounts: r,
      footnoteOrder: [],
      handlers: a,
      one: s,
      options: n,
      patch: SC,
      wrap: EC,
    };
  return (
    Ui(t, function (f) {
      if (f.type === "definition" || f.type === "footnoteDefinition") {
        let c = f.type === "definition" ? l : i,
          m = String(f.identifier).toUpperCase();
        c.has(m) || c.set(m, f);
      }
    }),
    o
  );
  function s(f, c) {
    let m = f.type,
      d = o.handlers[m];
    if (mm.call(o.handlers, m) && d) return d(o, f, c);
    if (o.options.passThrough && o.options.passThrough.includes(m)) {
      if ("children" in f) {
        let { children: x, ...C } = f,
          h = Ir(C);
        return ((h.children = o.all(f)), h);
      }
      return Ir(f);
    }
    return (o.options.unknownHandler || TC)(o, f, c);
  }
  function u(f) {
    let c = [];
    if ("children" in f) {
      let m = f.children,
        d = -1;
      for (; ++d < m.length;) {
        let g = o.one(m[d], f);
        if (g) {
          if (
            d &&
            m[d - 1].type === "break" &&
            (!Array.isArray(g) && g.type === "text" && (g.value = U0(g.value)),
            !Array.isArray(g) && g.type === "element")
          ) {
            let x = g.children[0];
            x && x.type === "text" && (x.value = U0(x.value));
          }
          Array.isArray(g) ? c.push(...g) : c.push(g);
        }
      }
    }
    return c;
  }
}
function SC(t, e) {
  t.position && (e.position = jd(t));
}
function wC(t, e) {
  let n = e;
  if (t && t.data) {
    let l = t.data.hName,
      i = t.data.hChildren,
      r = t.data.hProperties;
    if (typeof l == "string")
      if (n.type === "element") n.tagName = l;
      else {
        let a = "children" in n ? n.children : [n];
        n = { type: "element", tagName: l, properties: {}, children: a };
      }
    (n.type === "element" && r && Object.assign(n.properties, Ir(r)),
      "children" in n && n.children && i !== null && i !== void 0 && (n.children = i));
  }
  return n;
}
function TC(t, e) {
  let n = e.data || {},
    l =
      "value" in e && !(mm.call(n, "hProperties") || mm.call(n, "hChildren"))
        ? { type: "text", value: e.value }
        : { type: "element", tagName: "div", properties: {}, children: t.all(e) };
  return (t.patch(e, l), t.applyData(e, l));
}
function EC(t, e) {
  let n = [],
    l = -1;
  for (
    e &&
    n.push({
      type: "text",
      value: `
`,
    });
    ++l < t.length;
  )
    (l &&
      n.push({
        type: "text",
        value: `
`,
      }),
      n.push(t[l]));
  return (
    e &&
      t.length > 0 &&
      n.push({
        type: "text",
        value: `
`,
      }),
    n
  );
}
function U0(t) {
  let e = 0,
    n = t.charCodeAt(e);
  for (; n === 9 || n === 32;) (e++, (n = t.charCodeAt(e)));
  return t.slice(e);
}
function Ru(t, e) {
  let n = B0(t, e),
    l = n.one(t, void 0),
    i = z0(n),
    r = Array.isArray(l) ? { type: "root", children: l } : l || { type: "root", children: [] };
  return (
    i &&
      ("children" in r,
      r.children.push(
        {
          type: "text",
          value: `
`,
        },
        i,
      )),
    r
  );
}
function Mu(t, e) {
  return t && "run" in t
    ? async function (n, l) {
        let i = Ru(n, { file: l, ...e });
        await t.run(i, l);
      }
    : function (n, l) {
        return Ru(n, { file: l, ...(t || e) });
      };
}
function pm(t) {
  if (t) throw t;
}
var Ou = G(P0(), 1);
function vo(t) {
  if (typeof t != "object" || t === null) return !1;
  let e = Object.getPrototypeOf(t);
  return (
    (e === null || e === Object.prototype || Object.getPrototypeOf(e) === null) &&
    !(Symbol.toStringTag in t) &&
    !(Symbol.iterator in t)
  );
}
function hm() {
  let t = [],
    e = { run: n, use: l };
  return e;
  function n(...i) {
    let r = -1,
      a = i.pop();
    if (typeof a != "function") throw new TypeError("Expected function as last argument, not " + a);
    o(null, ...i);
    function o(s, ...u) {
      let f = t[++r],
        c = -1;
      if (s) {
        a(s);
        return;
      }
      for (; ++c < i.length;) (u[c] === null || u[c] === void 0) && (u[c] = i[c]);
      ((i = u), f ? G0(f, o)(...u) : a(null, ...u));
    }
  }
  function l(i) {
    if (typeof i != "function") throw new TypeError("Expected `middelware` to be a function, not " + i);
    return (t.push(i), e);
  }
}
function G0(t, e) {
  let n;
  return l;
  function l(...a) {
    let o = t.length > a.length,
      s;
    o && a.push(i);
    try {
      s = t.apply(this, a);
    } catch (u) {
      let f = u;
      if (o && n) throw f;
      return i(f);
    }
    o || (s && s.then && typeof s.then == "function" ? s.then(r, i) : s instanceof Error ? i(s) : r(s));
  }
  function i(a, ...o) {
    n || ((n = !0), e(a, ...o));
  }
  function r(a) {
    i(null, a);
  }
}
var Hn = { basename: CC, dirname: AC, extname: NC, join: RC, sep: "/" };
function CC(t, e) {
  if (e !== void 0 && typeof e != "string") throw new TypeError('"ext" argument must be a string');
  bo(t);
  let n = 0,
    l = -1,
    i = t.length,
    r;
  if (e === void 0 || e.length === 0 || e.length > t.length) {
    for (; i--;)
      if (t.codePointAt(i) === 47) {
        if (r) {
          n = i + 1;
          break;
        }
      } else l < 0 && ((r = !0), (l = i + 1));
    return l < 0 ? "" : t.slice(n, l);
  }
  if (e === t) return "";
  let a = -1,
    o = e.length - 1;
  for (; i--;)
    if (t.codePointAt(i) === 47) {
      if (r) {
        n = i + 1;
        break;
      }
    } else
      (a < 0 && ((r = !0), (a = i + 1)),
        o > -1 && (t.codePointAt(i) === e.codePointAt(o--) ? o < 0 && (l = i) : ((o = -1), (l = a))));
  return (n === l ? (l = a) : l < 0 && (l = t.length), t.slice(n, l));
}
function AC(t) {
  if ((bo(t), t.length === 0)) return ".";
  let e = -1,
    n = t.length,
    l;
  for (; --n;)
    if (t.codePointAt(n) === 47) {
      if (l) {
        e = n;
        break;
      }
    } else l || (l = !0);
  return e < 0 ? (t.codePointAt(0) === 47 ? "/" : ".") : e === 1 && t.codePointAt(0) === 47 ? "//" : t.slice(0, e);
}
function NC(t) {
  bo(t);
  let e = t.length,
    n = -1,
    l = 0,
    i = -1,
    r = 0,
    a;
  for (; e--;) {
    let o = t.codePointAt(e);
    if (o === 47) {
      if (a) {
        l = e + 1;
        break;
      }
      continue;
    }
    (n < 0 && ((a = !0), (n = e + 1)), o === 46 ? (i < 0 ? (i = e) : r !== 1 && (r = 1)) : i > -1 && (r = -1));
  }
  return i < 0 || n < 0 || r === 0 || (r === 1 && i === n - 1 && i === l + 1) ? "" : t.slice(i, n);
}
function RC(...t) {
  let e = -1,
    n;
  for (; ++e < t.length;) (bo(t[e]), t[e] && (n = n === void 0 ? t[e] : n + "/" + t[e]));
  return n === void 0 ? "." : MC(n);
}
function MC(t) {
  bo(t);
  let e = t.codePointAt(0) === 47,
    n = DC(t, !e);
  return (
    n.length === 0 && !e && (n = "."),
    n.length > 0 && t.codePointAt(t.length - 1) === 47 && (n += "/"),
    e ? "/" + n : n
  );
}
function DC(t, e) {
  let n = "",
    l = 0,
    i = -1,
    r = 0,
    a = -1,
    o,
    s;
  for (; ++a <= t.length;) {
    if (a < t.length) o = t.codePointAt(a);
    else {
      if (o === 47) break;
      o = 47;
    }
    if (o === 47) {
      if (!(i === a - 1 || r === 1))
        if (i !== a - 1 && r === 2) {
          if (n.length < 2 || l !== 2 || n.codePointAt(n.length - 1) !== 46 || n.codePointAt(n.length - 2) !== 46) {
            if (n.length > 2) {
              if (((s = n.lastIndexOf("/")), s !== n.length - 1)) {
                (s < 0 ? ((n = ""), (l = 0)) : ((n = n.slice(0, s)), (l = n.length - 1 - n.lastIndexOf("/"))),
                  (i = a),
                  (r = 0));
                continue;
              }
            } else if (n.length > 0) {
              ((n = ""), (l = 0), (i = a), (r = 0));
              continue;
            }
          }
          e && ((n = n.length > 0 ? n + "/.." : ".."), (l = 2));
        } else (n.length > 0 ? (n += "/" + t.slice(i + 1, a)) : (n = t.slice(i + 1, a)), (l = a - i - 1));
      ((i = a), (r = 0));
    } else o === 46 && r > -1 ? r++ : (r = -1);
  }
  return n;
}
function bo(t) {
  if (typeof t != "string") throw new TypeError("Path must be a string. Received " + JSON.stringify(t));
}
var X0 = { cwd: _C };
function _C() {
  return "/";
}
function jr(t) {
  return !!(
    t !== null &&
    typeof t == "object" &&
    "href" in t &&
    t.href &&
    "protocol" in t &&
    t.protocol &&
    t.auth === void 0
  );
}
function Z0(t) {
  if (typeof t == "string") t = new URL(t);
  else if (!jr(t)) {
    let e = new TypeError('The "path" argument must be of type string or an instance of URL. Received `' + t + "`");
    throw ((e.code = "ERR_INVALID_ARG_TYPE"), e);
  }
  if (t.protocol !== "file:") {
    let e = new TypeError("The URL must be of scheme file");
    throw ((e.code = "ERR_INVALID_URL_SCHEME"), e);
  }
  return OC(t);
}
function OC(t) {
  if (t.hostname !== "") {
    let l = new TypeError('File URL host must be "localhost" or empty on darwin');
    throw ((l.code = "ERR_INVALID_FILE_URL_HOST"), l);
  }
  let e = t.pathname,
    n = -1;
  for (; ++n < e.length;)
    if (e.codePointAt(n) === 37 && e.codePointAt(n + 1) === 50) {
      let l = e.codePointAt(n + 2);
      if (l === 70 || l === 102) {
        let i = new TypeError("File URL path must not include encoded / characters");
        throw ((i.code = "ERR_INVALID_FILE_URL_PATH"), i);
      }
    }
  return decodeURIComponent(e);
}
var gm = ["history", "path", "basename", "stem", "extname", "dirname"],
  Bi = class {
    constructor(e) {
      let n;
      (e ? (jr(e) ? (n = { path: e }) : typeof e == "string" || zC(e) ? (n = { value: e }) : (n = e)) : (n = {}),
        (this.cwd = "cwd" in n ? "" : X0.cwd()),
        (this.data = {}),
        (this.history = []),
        (this.messages = []),
        this.value,
        this.map,
        this.result,
        this.stored);
      let l = -1;
      for (; ++l < gm.length;) {
        let r = gm[l];
        r in n && n[r] !== void 0 && n[r] !== null && (this[r] = r === "history" ? [...n[r]] : n[r]);
      }
      let i;
      for (i in n) gm.includes(i) || (this[i] = n[i]);
    }
    get basename() {
      return typeof this.path == "string" ? Hn.basename(this.path) : void 0;
    }
    set basename(e) {
      (vm(e, "basename"), ym(e, "basename"), (this.path = Hn.join(this.dirname || "", e)));
    }
    get dirname() {
      return typeof this.path == "string" ? Hn.dirname(this.path) : void 0;
    }
    set dirname(e) {
      (K0(this.basename, "dirname"), (this.path = Hn.join(e || "", this.basename)));
    }
    get extname() {
      return typeof this.path == "string" ? Hn.extname(this.path) : void 0;
    }
    set extname(e) {
      if ((ym(e, "extname"), K0(this.dirname, "extname"), e)) {
        if (e.codePointAt(0) !== 46) throw new Error("`extname` must start with `.`");
        if (e.includes(".", 1)) throw new Error("`extname` cannot contain multiple dots");
      }
      this.path = Hn.join(this.dirname, this.stem + (e || ""));
    }
    get path() {
      return this.history[this.history.length - 1];
    }
    set path(e) {
      (jr(e) && (e = Z0(e)), vm(e, "path"), this.path !== e && this.history.push(e));
    }
    get stem() {
      return typeof this.path == "string" ? Hn.basename(this.path, this.extname) : void 0;
    }
    set stem(e) {
      (vm(e, "stem"), ym(e, "stem"), (this.path = Hn.join(this.dirname || "", e + (this.extname || ""))));
    }
    fail(e, n, l) {
      let i = this.message(e, n, l);
      throw ((i.fatal = !0), i);
    }
    info(e, n, l) {
      let i = this.message(e, n, l);
      return ((i.fatal = void 0), i);
    }
    message(e, n, l) {
      let i = new fe(e, n, l);
      return (
        this.path && ((i.name = this.path + ":" + i.name), (i.file = this.path)),
        (i.fatal = !1),
        this.messages.push(i),
        i
      );
    }
    toString(e) {
      return this.value === void 0
        ? ""
        : typeof this.value == "string"
          ? this.value
          : new TextDecoder(e || void 0).decode(this.value);
    }
  };
function ym(t, e) {
  if (t && t.includes(Hn.sep)) throw new Error("`" + e + "` cannot be a path: did not expect `" + Hn.sep + "`");
}
function vm(t, e) {
  if (!t) throw new Error("`" + e + "` cannot be empty");
}
function K0(t, e) {
  if (!t) throw new Error("Setting `" + e + "` requires `path` to be set too");
}
function zC(t) {
  return !!(t && typeof t == "object" && "byteLength" in t && "byteOffset" in t);
}
var J0 = function (t) {
  let l = this.constructor.prototype,
    i = l[t],
    r = function () {
      return i.apply(r, arguments);
    };
  return (Object.setPrototypeOf(r, l), r);
};
var LC = {}.hasOwnProperty,
  Sm = class t extends J0 {
    constructor() {
      (super("copy"),
        (this.Compiler = void 0),
        (this.Parser = void 0),
        (this.attachers = []),
        (this.compiler = void 0),
        (this.freezeIndex = -1),
        (this.frozen = void 0),
        (this.namespace = {}),
        (this.parser = void 0),
        (this.transformers = hm()));
    }
    copy() {
      let e = new t(),
        n = -1;
      for (; ++n < this.attachers.length;) {
        let l = this.attachers[n];
        e.use(...l);
      }
      return (e.data((0, Ou.default)(!0, {}, this.namespace)), e);
    }
    data(e, n) {
      return typeof e == "string"
        ? arguments.length === 2
          ? (km("data", this.frozen), (this.namespace[e] = n), this)
          : (LC.call(this.namespace, e) && this.namespace[e]) || void 0
        : e
          ? (km("data", this.frozen), (this.namespace = e), this)
          : this.namespace;
    }
    freeze() {
      if (this.frozen) return this;
      let e = this;
      for (; ++this.freezeIndex < this.attachers.length;) {
        let [n, ...l] = this.attachers[this.freezeIndex];
        if (l[0] === !1) continue;
        l[0] === !0 && (l[0] = void 0);
        let i = n.call(e, ...l);
        typeof i == "function" && this.transformers.use(i);
      }
      return ((this.frozen = !0), (this.freezeIndex = Number.POSITIVE_INFINITY), this);
    }
    parse(e) {
      this.freeze();
      let n = _u(e),
        l = this.parser || this.Parser;
      return (bm("parse", l), l(String(n), n));
    }
    process(e, n) {
      let l = this;
      return (
        this.freeze(),
        bm("process", this.parser || this.Parser),
        xm("process", this.compiler || this.Compiler),
        n ? i(void 0, n) : new Promise(i)
      );
      function i(r, a) {
        let o = _u(e),
          s = l.parse(o);
        l.run(s, o, function (f, c, m) {
          if (f || !c || !m) return u(f);
          let d = c,
            g = l.stringify(d, m);
          (BC(g) ? (m.value = g) : (m.result = g), u(f, m));
        });
        function u(f, c) {
          f || !c ? a(f) : r ? r(c) : n(void 0, c);
        }
      }
    }
    processSync(e) {
      let n = !1,
        l;
      return (
        this.freeze(),
        bm("processSync", this.parser || this.Parser),
        xm("processSync", this.compiler || this.Compiler),
        this.process(e, i),
        W0("processSync", "process", n),
        l
      );
      function i(r, a) {
        ((n = !0), pm(r), (l = a));
      }
    }
    run(e, n, l) {
      ($0(e), this.freeze());
      let i = this.transformers;
      return (!l && typeof n == "function" && ((l = n), (n = void 0)), l ? r(void 0, l) : new Promise(r));
      function r(a, o) {
        let s = _u(n);
        i.run(e, s, u);
        function u(f, c, m) {
          let d = c || e;
          f ? o(f) : a ? a(d) : l(void 0, d, m);
        }
      }
    }
    runSync(e, n) {
      let l = !1,
        i;
      return (this.run(e, n, r), W0("runSync", "run", l), i);
      function r(a, o) {
        (pm(a), (i = o), (l = !0));
      }
    }
    stringify(e, n) {
      this.freeze();
      let l = _u(n),
        i = this.compiler || this.Compiler;
      return (xm("stringify", i), $0(e), i(e, l));
    }
    use(e, ...n) {
      let l = this.attachers,
        i = this.namespace;
      if ((km("use", this.frozen), e != null))
        if (typeof e == "function") s(e, n);
        else if (typeof e == "object") Array.isArray(e) ? o(e) : a(e);
        else throw new TypeError("Expected usable value, not `" + e + "`");
      return this;
      function r(u) {
        if (typeof u == "function") s(u, []);
        else if (typeof u == "object")
          if (Array.isArray(u)) {
            let [f, ...c] = u;
            s(f, c);
          } else a(u);
        else throw new TypeError("Expected usable value, not `" + u + "`");
      }
      function a(u) {
        if (!("plugins" in u) && !("settings" in u))
          throw new Error(
            "Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither",
          );
        (o(u.plugins), u.settings && (i.settings = (0, Ou.default)(!0, i.settings, u.settings)));
      }
      function o(u) {
        let f = -1;
        if (u != null)
          if (Array.isArray(u))
            for (; ++f < u.length;) {
              let c = u[f];
              r(c);
            }
          else throw new TypeError("Expected a list of plugins, not `" + u + "`");
      }
      function s(u, f) {
        let c = -1,
          m = -1;
        for (; ++c < l.length;)
          if (l[c][0] === u) {
            m = c;
            break;
          }
        if (m === -1) l.push([u, ...f]);
        else if (f.length > 0) {
          let [d, ...g] = f,
            x = l[m][1];
          (vo(x) && vo(d) && (d = (0, Ou.default)(!0, x, d)), (l[m] = [u, d, ...g]));
        }
      }
    }
  },
  wm = new Sm().freeze();
function bm(t, e) {
  if (typeof e != "function") throw new TypeError("Cannot `" + t + "` without `parser`");
}
function xm(t, e) {
  if (typeof e != "function") throw new TypeError("Cannot `" + t + "` without `compiler`");
}
function km(t, e) {
  if (e)
    throw new Error(
      "Cannot call `" +
        t +
        "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.",
    );
}
function $0(t) {
  if (!vo(t) || typeof t.type != "string") throw new TypeError("Expected node, got `" + t + "`");
}
function W0(t, e, n) {
  if (!n) throw new Error("`" + t + "` finished async. Use `" + e + "` instead");
}
function _u(t) {
  return UC(t) ? t : new Bi(t);
}
function UC(t) {
  return !!(t && typeof t == "object" && "message" in t && "messages" in t);
}
function BC(t) {
  return typeof t == "string" || HC(t);
}
function HC(t) {
  return !!(t && typeof t == "object" && "byteLength" in t && "byteOffset" in t);
}
var qC = "https://github.com/remarkjs/react-markdown/blob/main/changelog.md",
  t1 = [],
  e1 = { allowDangerousHtml: !0 },
  IC = /^(https?|ircs?|mailto|xmpp)$/i,
  jC = [
    { from: "astPlugins", id: "remove-buggy-html-in-markdown-parser" },
    { from: "allowDangerousHtml", id: "remove-buggy-html-in-markdown-parser" },
    { from: "allowNode", id: "replace-allownode-allowedtypes-and-disallowedtypes", to: "allowElement" },
    { from: "allowedTypes", id: "replace-allownode-allowedtypes-and-disallowedtypes", to: "allowedElements" },
    { from: "className", id: "remove-classname" },
    { from: "disallowedTypes", id: "replace-allownode-allowedtypes-and-disallowedtypes", to: "disallowedElements" },
    { from: "escapeHtml", id: "remove-buggy-html-in-markdown-parser" },
    { from: "includeElementIndex", id: "#remove-includeelementindex" },
    { from: "includeNodeIndex", id: "change-includenodeindex-to-includeelementindex" },
    { from: "linkTarget", id: "remove-linktarget" },
    { from: "plugins", id: "change-plugins-to-remarkplugins", to: "remarkPlugins" },
    { from: "rawSourcePos", id: "#remove-rawsourcepos" },
    { from: "renderers", id: "change-renderers-to-components", to: "components" },
    { from: "source", id: "change-source-to-children", to: "children" },
    { from: "sourcePos", id: "#remove-sourcepos" },
    { from: "transformImageUri", id: "#add-urltransform", to: "urlTransform" },
    { from: "transformLinkUri", id: "#add-urltransform", to: "urlTransform" },
  ];
function xo(t) {
  let e = YC(t),
    n = FC(t);
  return VC(e.runSync(e.parse(n), n), t);
}
function YC(t) {
  let e = t.rehypePlugins || t1,
    n = t.remarkPlugins || t1,
    l = t.remarkRehypeOptions ? { ...t.remarkRehypeOptions, ...e1 } : e1;
  return wm().use(ku).use(n).use(Mu, l).use(e);
}
function FC(t) {
  let e = t.children || "",
    n = new Bi();
  return (typeof e == "string" ? (n.value = e) : ("" + e, void 0), n);
}
function VC(t, e) {
  let n = e.allowedElements,
    l = e.allowElement,
    i = e.components,
    r = e.disallowedElements,
    a = e.skipHtml,
    o = e.unwrapDisallowed,
    s = e.urlTransform || l1;
  for (let f of jC)
    Object.hasOwn(e, f.from) && ("" + f.from + (f.to ? "use `" + f.to + "` instead" : "remove it") + qC + f.id, void 0);
  return (
    n && r && void 0,
    Ui(t, u),
    Vd(t, {
      Fragment: Yr.Fragment,
      components: i,
      ignoreInvalidStyle: !0,
      jsx: Yr.jsx,
      jsxs: Yr.jsxs,
      passKeys: !0,
      passNode: !0,
    })
  );
  function u(f, c, m) {
    if (f.type === "raw" && m && typeof c == "number")
      return (a ? m.children.splice(c, 1) : (m.children[c] = { type: "text", value: f.value }), c);
    if (f.type === "element") {
      let d;
      for (d in uo)
        if (Object.hasOwn(uo, d) && Object.hasOwn(f.properties, d)) {
          let g = f.properties[d],
            x = uo[d];
          (x === null || x.includes(f.tagName)) && (f.properties[d] = s(String(g || ""), d, f));
        }
    }
    if (f.type === "element") {
      let d = n ? !n.includes(f.tagName) : r ? r.includes(f.tagName) : !1;
      if ((!d && l && typeof c == "number" && (d = !l(f, c, m)), d && m && typeof c == "number"))
        return (o && f.children ? m.children.splice(c, 1, ...f.children) : m.children.splice(c, 1), c);
    }
  }
}
function l1(t) {
  let e = t.indexOf(":"),
    n = t.indexOf("?"),
    l = t.indexOf("#"),
    i = t.indexOf("/");
  return e === -1 || (i !== -1 && e > i) || (n !== -1 && e > n) || (l !== -1 && e > l) || IC.test(t.slice(0, e))
    ? t
    : "";
}
function Tm(t, e) {
  let n = String(t);
  if (typeof e != "string") throw new TypeError("Expected character");
  let l = 0,
    i = n.indexOf(e);
  for (; i !== -1;) (l++, (i = n.indexOf(e, i + e.length)));
  return l;
}
function Em(t) {
  if (typeof t != "string") throw new TypeError("Expected a string");
  return t.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function Cm(t, e, n) {
  let i = Wl((n || {}).ignore || []),
    r = QC(e),
    a = -1;
  for (; ++a < r.length;) yo(t, "text", o);
  function o(u, f) {
    let c = -1,
      m;
    for (; ++c < f.length;) {
      let d = f[c],
        g = m ? m.children : void 0;
      if (i(d, g ? g.indexOf(d) : void 0, m)) return;
      m = d;
    }
    if (m) return s(u, f);
  }
  function s(u, f) {
    let c = f[f.length - 1],
      m = r[a][0],
      d = r[a][1],
      g = 0,
      C = c.children.indexOf(u),
      h = !1,
      p = [];
    m.lastIndex = 0;
    let y = m.exec(u.value);
    for (; y;) {
      let T = y.index,
        N = { index: y.index, input: y.input, stack: [...f, u] },
        E = d(...y, N);
      if (
        (typeof E == "string" && (E = E.length > 0 ? { type: "text", value: E } : void 0),
        E === !1
          ? (m.lastIndex = T + 1)
          : (g !== T && p.push({ type: "text", value: u.value.slice(g, T) }),
            Array.isArray(E) ? p.push(...E) : E && p.push(E),
            (g = T + y[0].length),
            (h = !0)),
        !m.global)
      )
        break;
      y = m.exec(u.value);
    }
    return (
      h
        ? (g < u.value.length && p.push({ type: "text", value: u.value.slice(g) }), c.children.splice(C, 1, ...p))
        : (p = [u]),
      C + p.length
    );
  }
}
function QC(t) {
  let e = [];
  if (!Array.isArray(t)) throw new TypeError("Expected find and replace tuple or list of tuples");
  let n = !t[0] || Array.isArray(t[0]) ? t : [t],
    l = -1;
  for (; ++l < n.length;) {
    let i = n[l];
    e.push([PC(i[0]), GC(i[1])]);
  }
  return e;
}
function PC(t) {
  return typeof t == "string" ? new RegExp(Em(t), "g") : t;
}
function GC(t) {
  return typeof t == "function"
    ? t
    : function () {
        return t;
      };
}
var Am = "phrasing",
  Nm = ["autolink", "link", "image", "label"];
function Mm() {
  return {
    transforms: [WC],
    enter: { literalAutolink: XC, literalAutolinkEmail: Rm, literalAutolinkHttp: Rm, literalAutolinkWww: Rm },
    exit: { literalAutolink: $C, literalAutolinkEmail: JC, literalAutolinkHttp: ZC, literalAutolinkWww: KC },
  };
}
function Dm() {
  return {
    unsafe: [
      { character: "@", before: "[+\\-.\\w]", after: "[\\-.\\w]", inConstruct: Am, notInConstruct: Nm },
      { character: ".", before: "[Ww]", after: "[\\-.\\w]", inConstruct: Am, notInConstruct: Nm },
      { character: ":", before: "[ps]", after: "\\/", inConstruct: Am, notInConstruct: Nm },
    ],
  };
}
function XC(t) {
  this.enter({ type: "link", title: null, url: "", children: [] }, t);
}
function Rm(t) {
  this.config.enter.autolinkProtocol.call(this, t);
}
function ZC(t) {
  this.config.exit.autolinkProtocol.call(this, t);
}
function KC(t) {
  this.config.exit.data.call(this, t);
  let e = this.stack[this.stack.length - 1];
  (e.type, (e.url = "http://" + this.sliceSerialize(t)));
}
function JC(t) {
  this.config.exit.autolinkEmail.call(this, t);
}
function $C(t) {
  this.exit(t);
}
function WC(t) {
  Cm(
    t,
    [
      [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, tA],
      [/(?<=^|\s|\p{P}|\p{S})([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/gu, eA],
    ],
    { ignore: ["link", "linkReference"] },
  );
}
function tA(t, e, n, l, i) {
  let r = "";
  if (!i1(i) || (/^w/i.test(e) && ((n = e + n), (e = ""), (r = "http://")), !nA(n))) return !1;
  let a = lA(n + l);
  if (!a[0]) return !1;
  let o = { type: "link", title: null, url: r + e + a[0], children: [{ type: "text", value: e + a[0] }] };
  return a[1] ? [o, { type: "text", value: a[1] }] : o;
}
function eA(t, e, n, l) {
  return !i1(l, !0) || /[-\d_]$/.test(n)
    ? !1
    : { type: "link", title: null, url: "mailto:" + e + "@" + n, children: [{ type: "text", value: e + "@" + n }] };
}
function nA(t) {
  let e = t.split(".");
  return !(
    e.length < 2 ||
    (e[e.length - 1] && (/_/.test(e[e.length - 1]) || !/[a-zA-Z\d]/.test(e[e.length - 1]))) ||
    (e[e.length - 2] && (/_/.test(e[e.length - 2]) || !/[a-zA-Z\d]/.test(e[e.length - 2])))
  );
}
function lA(t) {
  let e = /[!"&'),.:;<>?\]}]+$/.exec(t);
  if (!e) return [t, void 0];
  t = t.slice(0, e.index);
  let n = e[0],
    l = n.indexOf(")"),
    i = Tm(t, "("),
    r = Tm(t, ")");
  for (; l !== -1 && i > r;) ((t += n.slice(0, l + 1)), (n = n.slice(l + 1)), (l = n.indexOf(")")), r++);
  return [t, n];
}
function i1(t, e) {
  let n = t.input.charCodeAt(t.index - 1);
  return (t.index === 0 || Kn(n) || Di(n)) && (!e || n !== 47);
}
r1.peek = dA;
function iA() {
  this.buffer();
}
function rA(t) {
  this.enter({ type: "footnoteReference", identifier: "", label: "" }, t);
}
function aA() {
  this.buffer();
}
function oA(t) {
  this.enter({ type: "footnoteDefinition", identifier: "", label: "", children: [] }, t);
}
function sA(t) {
  let e = this.resume(),
    n = this.stack[this.stack.length - 1];
  (n.type, (n.identifier = Fe(this.sliceSerialize(t)).toLowerCase()), (n.label = e));
}
function uA(t) {
  this.exit(t);
}
function cA(t) {
  let e = this.resume(),
    n = this.stack[this.stack.length - 1];
  (n.type, (n.identifier = Fe(this.sliceSerialize(t)).toLowerCase()), (n.label = e));
}
function fA(t) {
  this.exit(t);
}
function dA() {
  return "[";
}
function r1(t, e, n, l) {
  let i = n.createTracker(l),
    r = i.move("[^"),
    a = n.enter("footnoteReference"),
    o = n.enter("reference");
  return ((r += i.move(n.safe(n.associationId(t), { after: "]", before: r }))), o(), a(), (r += i.move("]")), r);
}
function _m() {
  return {
    enter: {
      gfmFootnoteCallString: iA,
      gfmFootnoteCall: rA,
      gfmFootnoteDefinitionLabelString: aA,
      gfmFootnoteDefinition: oA,
    },
    exit: {
      gfmFootnoteCallString: sA,
      gfmFootnoteCall: uA,
      gfmFootnoteDefinitionLabelString: cA,
      gfmFootnoteDefinition: fA,
    },
  };
}
function Om(t) {
  let e = !1;
  return (
    t && t.firstLineBlank && (e = !0),
    {
      handlers: { footnoteDefinition: n, footnoteReference: r1 },
      unsafe: [{ character: "[", inConstruct: ["label", "phrasing", "reference"] }],
    }
  );
  function n(l, i, r, a) {
    let o = r.createTracker(a),
      s = o.move("[^"),
      u = r.enter("footnoteDefinition"),
      f = r.enter("label");
    return (
      (s += o.move(r.safe(r.associationId(l), { before: s, after: "]" }))),
      f(),
      (s += o.move("]:")),
      l.children &&
        l.children.length > 0 &&
        (o.shift(4),
        (s += o.move(
          (e
            ? `
`
            : " ") + r.indentLines(r.containerFlow(l, o.current()), e ? a1 : mA),
        ))),
      u(),
      s
    );
  }
}
function mA(t, e, n) {
  return e === 0 ? t : a1(t, e, n);
}
function a1(t, e, n) {
  return (n ? "" : "    ") + t;
}
var pA = ["autolink", "destinationLiteral", "destinationRaw", "reference", "titleQuote", "titleApostrophe"];
o1.peek = yA;
function zm() {
  return { canContainEols: ["delete"], enter: { strikethrough: hA }, exit: { strikethrough: gA } };
}
function Lm() {
  return { unsafe: [{ character: "~", inConstruct: "phrasing", notInConstruct: pA }], handlers: { delete: o1 } };
}
function hA(t) {
  this.enter({ type: "delete", children: [] }, t);
}
function gA(t) {
  this.exit(t);
}
function o1(t, e, n, l) {
  let i = n.createTracker(l),
    r = n.enter("strikethrough"),
    a = i.move("~~");
  return ((a += n.containerPhrasing(t, { ...i.current(), before: a, after: "~" })), (a += i.move("~~")), r(), a);
}
function yA() {
  return "~";
}
function vA(t) {
  return t.length;
}
function u1(t, e) {
  let n = e || {},
    l = (n.align || []).concat(),
    i = n.stringLength || vA,
    r = [],
    a = [],
    o = [],
    s = [],
    u = 0,
    f = -1;
  for (; ++f < t.length;) {
    let x = [],
      C = [],
      h = -1;
    for (t[f].length > u && (u = t[f].length); ++h < t[f].length;) {
      let p = bA(t[f][h]);
      if (n.alignDelimiters !== !1) {
        let y = i(p);
        ((C[h] = y), (s[h] === void 0 || y > s[h]) && (s[h] = y));
      }
      x.push(p);
    }
    ((a[f] = x), (o[f] = C));
  }
  let c = -1;
  if (typeof l == "object" && "length" in l) for (; ++c < u;) r[c] = s1(l[c]);
  else {
    let x = s1(l);
    for (; ++c < u;) r[c] = x;
  }
  c = -1;
  let m = [],
    d = [];
  for (; ++c < u;) {
    let x = r[c],
      C = "",
      h = "";
    x === 99 ? ((C = ":"), (h = ":")) : x === 108 ? (C = ":") : x === 114 && (h = ":");
    let p = n.alignDelimiters === !1 ? 1 : Math.max(1, s[c] - C.length - h.length),
      y = C + "-".repeat(p) + h;
    (n.alignDelimiters !== !1 && ((p = C.length + p + h.length), p > s[c] && (s[c] = p), (d[c] = p)), (m[c] = y));
  }
  (a.splice(1, 0, m), o.splice(1, 0, d), (f = -1));
  let g = [];
  for (; ++f < a.length;) {
    let x = a[f],
      C = o[f];
    c = -1;
    let h = [];
    for (; ++c < u;) {
      let p = x[c] || "",
        y = "",
        T = "";
      if (n.alignDelimiters !== !1) {
        let N = s[c] - (C[c] || 0),
          E = r[c];
        E === 114
          ? (y = " ".repeat(N))
          : E === 99
            ? N % 2
              ? ((y = " ".repeat(N / 2 + 0.5)), (T = " ".repeat(N / 2 - 0.5)))
              : ((y = " ".repeat(N / 2)), (T = y))
            : (T = " ".repeat(N));
      }
      (n.delimiterStart !== !1 && !c && h.push("|"),
        n.padding !== !1 && !(n.alignDelimiters === !1 && p === "") && (n.delimiterStart !== !1 || c) && h.push(" "),
        n.alignDelimiters !== !1 && h.push(y),
        h.push(p),
        n.alignDelimiters !== !1 && h.push(T),
        n.padding !== !1 && h.push(" "),
        (n.delimiterEnd !== !1 || c !== u - 1) && h.push("|"));
    }
    g.push(n.delimiterEnd === !1 ? h.join("").replace(/ +$/, "") : h.join(""));
  }
  return g.join(`
`);
}
function bA(t) {
  return t == null ? "" : String(t);
}
function s1(t) {
  let e = typeof t == "string" ? t.codePointAt(0) : 0;
  return e === 67 || e === 99 ? 99 : e === 76 || e === 108 ? 108 : e === 82 || e === 114 ? 114 : 0;
}
function c1(t, e, n, l) {
  let i = n.enter("blockquote"),
    r = n.createTracker(l);
  (r.move("> "), r.shift(2));
  let a = n.indentLines(n.containerFlow(t, r.current()), xA);
  return (i(), a);
}
function xA(t, e, n) {
  return ">" + (n ? "" : " ") + t;
}
function d1(t, e) {
  return f1(t, e.inConstruct, !0) && !f1(t, e.notInConstruct, !1);
}
function f1(t, e, n) {
  if ((typeof e == "string" && (e = [e]), !e || e.length === 0)) return n;
  let l = -1;
  for (; ++l < e.length;) if (t.includes(e[l])) return !0;
  return !1;
}
function Um(t, e, n, l) {
  let i = -1;
  for (; ++i < n.unsafe.length;)
    if (
      n.unsafe[i].character ===
        `
` &&
      d1(n.stack, n.unsafe[i])
    )
      return /[ \t]/.test(l.before) ? "" : " ";
  return `\\
`;
}
function m1(t, e) {
  let n = String(t),
    l = n.indexOf(e),
    i = l,
    r = 0,
    a = 0;
  if (typeof e != "string") throw new TypeError("Expected substring");
  for (; l !== -1;) (l === i ? ++r > a && (a = r) : (r = 1), (i = l + e.length), (l = n.indexOf(e, i)));
  return a;
}
function p1(t, e) {
  return !!(
    e.options.fences === !1 &&
    t.value &&
    !t.lang &&
    /[^ \r\n]/.test(t.value) &&
    !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(t.value)
  );
}
function h1(t) {
  let e = t.options.fence || "`";
  if (e !== "`" && e !== "~")
    throw new Error("Cannot serialize code with `" + e + "` for `options.fence`, expected `` ` `` or `~`");
  return e;
}
function g1(t, e, n, l) {
  let i = h1(n),
    r = t.value || "",
    a = i === "`" ? "GraveAccent" : "Tilde";
  if (p1(t, n)) {
    let c = n.enter("codeIndented"),
      m = n.indentLines(r, kA);
    return (c(), m);
  }
  let o = n.createTracker(l),
    s = i.repeat(Math.max(m1(r, i) + 1, 3)),
    u = n.enter("codeFenced"),
    f = o.move(s);
  if (t.lang) {
    let c = n.enter(`codeFencedLang${a}`);
    ((f += o.move(n.safe(t.lang, { before: f, after: " ", encode: ["`"], ...o.current() }))), c());
  }
  if (t.lang && t.meta) {
    let c = n.enter(`codeFencedMeta${a}`);
    ((f += o.move(" ")),
      (f += o.move(
        n.safe(t.meta, {
          before: f,
          after: `
`,
          encode: ["`"],
          ...o.current(),
        }),
      )),
      c());
  }
  return (
    (f += o.move(`
`)),
    r &&
      (f += o.move(
        r +
          `
`,
      )),
    (f += o.move(s)),
    u(),
    f
  );
}
function kA(t, e, n) {
  return (n ? "" : "    ") + t;
}
function Fr(t) {
  let e = t.options.quote || '"';
  if (e !== '"' && e !== "'")
    throw new Error("Cannot serialize title with `" + e + "` for `options.quote`, expected `\"`, or `'`");
  return e;
}
function y1(t, e, n, l) {
  let i = Fr(n),
    r = i === '"' ? "Quote" : "Apostrophe",
    a = n.enter("definition"),
    o = n.enter("label"),
    s = n.createTracker(l),
    u = s.move("[");
  return (
    (u += s.move(n.safe(n.associationId(t), { before: u, after: "]", ...s.current() }))),
    (u += s.move("]: ")),
    o(),
    !t.url || /[\0- \u007F]/.test(t.url)
      ? ((o = n.enter("destinationLiteral")),
        (u += s.move("<")),
        (u += s.move(n.safe(t.url, { before: u, after: ">", ...s.current() }))),
        (u += s.move(">")))
      : ((o = n.enter("destinationRaw")),
        (u += s.move(
          n.safe(t.url, {
            before: u,
            after: t.title
              ? " "
              : `
`,
            ...s.current(),
          }),
        ))),
    o(),
    t.title &&
      ((o = n.enter(`title${r}`)),
      (u += s.move(" " + i)),
      (u += s.move(n.safe(t.title, { before: u, after: i, ...s.current() }))),
      (u += s.move(i)),
      o()),
    a(),
    u
  );
}
function v1(t) {
  let e = t.options.emphasis || "*";
  if (e !== "*" && e !== "_")
    throw new Error("Cannot serialize emphasis with `" + e + "` for `options.emphasis`, expected `*`, or `_`");
  return e;
}
function ti(t) {
  return "&#x" + t.toString(16).toUpperCase() + ";";
}
function Vr(t, e, n) {
  let l = bl(t),
    i = bl(e);
  return l === void 0
    ? i === void 0
      ? n === "_"
        ? { inside: !0, outside: !0 }
        : { inside: !1, outside: !1 }
      : i === 1
        ? { inside: !0, outside: !0 }
        : { inside: !1, outside: !0 }
    : l === 1
      ? i === void 0
        ? { inside: !1, outside: !1 }
        : i === 1
          ? { inside: !0, outside: !0 }
          : { inside: !1, outside: !1 }
      : i === void 0
        ? { inside: !1, outside: !1 }
        : i === 1
          ? { inside: !0, outside: !1 }
          : { inside: !1, outside: !1 };
}
Bm.peek = SA;
function Bm(t, e, n, l) {
  let i = v1(n),
    r = n.enter("emphasis"),
    a = n.createTracker(l),
    o = a.move(i),
    s = a.move(n.containerPhrasing(t, { after: i, before: o, ...a.current() })),
    u = s.charCodeAt(0),
    f = Vr(l.before.charCodeAt(l.before.length - 1), u, i);
  f.inside && (s = ti(u) + s.slice(1));
  let c = s.charCodeAt(s.length - 1),
    m = Vr(l.after.charCodeAt(0), c, i);
  m.inside && (s = s.slice(0, -1) + ti(c));
  let d = a.move(i);
  return (r(), (n.attentionEncodeSurroundingInfo = { after: m.outside, before: f.outside }), o + s + d);
}
function SA(t, e, n) {
  return n.options.emphasis || "*";
}
function b1(t, e) {
  let n = !1;
  return (
    Ui(t, function (l) {
      if (("value" in l && /\r?\n|\r/.test(l.value)) || l.type === "break") return ((n = !0), Li);
    }),
    !!((!t.depth || t.depth < 3) && Ri(t) && (e.options.setext || n))
  );
}
function x1(t, e, n, l) {
  let i = Math.max(Math.min(6, t.depth || 1), 1),
    r = n.createTracker(l);
  if (b1(t, n)) {
    let f = n.enter("headingSetext"),
      c = n.enter("phrasing"),
      m = n.containerPhrasing(t, {
        ...r.current(),
        before: `
`,
        after: `
`,
      });
    return (
      c(),
      f(),
      m +
        `
` +
        (i === 1 ? "=" : "-").repeat(
          m.length -
            (Math.max(
              m.lastIndexOf("\r"),
              m.lastIndexOf(`
`),
            ) +
              1),
        )
    );
  }
  let a = "#".repeat(i),
    o = n.enter("headingAtx"),
    s = n.enter("phrasing");
  r.move(a + " ");
  let u = n.containerPhrasing(t, {
    before: "# ",
    after: `
`,
    ...r.current(),
  });
  return (
    /^[\t ]/.test(u) && (u = ti(u.charCodeAt(0)) + u.slice(1)),
    (u = u ? a + " " + u : a),
    n.options.closeAtx && (u += " " + a),
    s(),
    o(),
    u
  );
}
Hm.peek = wA;
function Hm(t) {
  return t.value || "";
}
function wA() {
  return "<";
}
qm.peek = TA;
function qm(t, e, n, l) {
  let i = Fr(n),
    r = i === '"' ? "Quote" : "Apostrophe",
    a = n.enter("image"),
    o = n.enter("label"),
    s = n.createTracker(l),
    u = s.move("![");
  return (
    (u += s.move(n.safe(t.alt, { before: u, after: "]", ...s.current() }))),
    (u += s.move("](")),
    o(),
    (!t.url && t.title) || /[\0- \u007F]/.test(t.url)
      ? ((o = n.enter("destinationLiteral")),
        (u += s.move("<")),
        (u += s.move(n.safe(t.url, { before: u, after: ">", ...s.current() }))),
        (u += s.move(">")))
      : ((o = n.enter("destinationRaw")),
        (u += s.move(n.safe(t.url, { before: u, after: t.title ? " " : ")", ...s.current() })))),
    o(),
    t.title &&
      ((o = n.enter(`title${r}`)),
      (u += s.move(" " + i)),
      (u += s.move(n.safe(t.title, { before: u, after: i, ...s.current() }))),
      (u += s.move(i)),
      o()),
    (u += s.move(")")),
    a(),
    u
  );
}
function TA() {
  return "!";
}
Im.peek = EA;
function Im(t, e, n, l) {
  let i = t.referenceType,
    r = n.enter("imageReference"),
    a = n.enter("label"),
    o = n.createTracker(l),
    s = o.move("!["),
    u = n.safe(t.alt, { before: s, after: "]", ...o.current() });
  ((s += o.move(u + "][")), a());
  let f = n.stack;
  ((n.stack = []), (a = n.enter("reference")));
  let c = n.safe(n.associationId(t), { before: s, after: "]", ...o.current() });
  return (
    a(),
    (n.stack = f),
    r(),
    i === "full" || !u || u !== c
      ? (s += o.move(c + "]"))
      : i === "shortcut"
        ? (s = s.slice(0, -1))
        : (s += o.move("]")),
    s
  );
}
function EA() {
  return "!";
}
jm.peek = CA;
function jm(t, e, n) {
  let l = t.value || "",
    i = "`",
    r = -1;
  for (; new RegExp("(^|[^`])" + i + "([^`]|$)").test(l);) i += "`";
  for (
    /[^ \r\n]/.test(l) && ((/^[ \r\n]/.test(l) && /[ \r\n]$/.test(l)) || /^`|`$/.test(l)) && (l = " " + l + " ");
    ++r < n.unsafe.length;
  ) {
    let a = n.unsafe[r],
      o = n.compilePattern(a),
      s;
    if (a.atBreak)
      for (; (s = o.exec(l));) {
        let u = s.index;
        (l.charCodeAt(u) === 10 && l.charCodeAt(u - 1) === 13 && u--, (l = l.slice(0, u) + " " + l.slice(s.index + 1)));
      }
  }
  return i + l + i;
}
function CA() {
  return "`";
}
function Ym(t, e) {
  let n = Ri(t);
  return !!(
    !e.options.resourceLink &&
    t.url &&
    !t.title &&
    t.children &&
    t.children.length === 1 &&
    t.children[0].type === "text" &&
    (n === t.url || "mailto:" + n === t.url) &&
    /^[a-z][a-z+.-]+:/i.test(t.url) &&
    !/[\0- <>\u007F]/.test(t.url)
  );
}
Fm.peek = AA;
function Fm(t, e, n, l) {
  let i = Fr(n),
    r = i === '"' ? "Quote" : "Apostrophe",
    a = n.createTracker(l),
    o,
    s;
  if (Ym(t, n)) {
    let f = n.stack;
    ((n.stack = []), (o = n.enter("autolink")));
    let c = a.move("<");
    return (
      (c += a.move(n.containerPhrasing(t, { before: c, after: ">", ...a.current() }))),
      (c += a.move(">")),
      o(),
      (n.stack = f),
      c
    );
  }
  ((o = n.enter("link")), (s = n.enter("label")));
  let u = a.move("[");
  return (
    (u += a.move(n.containerPhrasing(t, { before: u, after: "](", ...a.current() }))),
    (u += a.move("](")),
    s(),
    (!t.url && t.title) || /[\0- \u007F]/.test(t.url)
      ? ((s = n.enter("destinationLiteral")),
        (u += a.move("<")),
        (u += a.move(n.safe(t.url, { before: u, after: ">", ...a.current() }))),
        (u += a.move(">")))
      : ((s = n.enter("destinationRaw")),
        (u += a.move(n.safe(t.url, { before: u, after: t.title ? " " : ")", ...a.current() })))),
    s(),
    t.title &&
      ((s = n.enter(`title${r}`)),
      (u += a.move(" " + i)),
      (u += a.move(n.safe(t.title, { before: u, after: i, ...a.current() }))),
      (u += a.move(i)),
      s()),
    (u += a.move(")")),
    o(),
    u
  );
}
function AA(t, e, n) {
  return Ym(t, n) ? "<" : "[";
}
Vm.peek = NA;
function Vm(t, e, n, l) {
  let i = t.referenceType,
    r = n.enter("linkReference"),
    a = n.enter("label"),
    o = n.createTracker(l),
    s = o.move("["),
    u = n.containerPhrasing(t, { before: s, after: "]", ...o.current() });
  ((s += o.move(u + "][")), a());
  let f = n.stack;
  ((n.stack = []), (a = n.enter("reference")));
  let c = n.safe(n.associationId(t), { before: s, after: "]", ...o.current() });
  return (
    a(),
    (n.stack = f),
    r(),
    i === "full" || !u || u !== c
      ? (s += o.move(c + "]"))
      : i === "shortcut"
        ? (s = s.slice(0, -1))
        : (s += o.move("]")),
    s
  );
}
function NA() {
  return "[";
}
function Qr(t) {
  let e = t.options.bullet || "*";
  if (e !== "*" && e !== "+" && e !== "-")
    throw new Error("Cannot serialize items with `" + e + "` for `options.bullet`, expected `*`, `+`, or `-`");
  return e;
}
function k1(t) {
  let e = Qr(t),
    n = t.options.bulletOther;
  if (!n) return e === "*" ? "-" : "*";
  if (n !== "*" && n !== "+" && n !== "-")
    throw new Error("Cannot serialize items with `" + n + "` for `options.bulletOther`, expected `*`, `+`, or `-`");
  if (n === e) throw new Error("Expected `bullet` (`" + e + "`) and `bulletOther` (`" + n + "`) to be different");
  return n;
}
function S1(t) {
  let e = t.options.bulletOrdered || ".";
  if (e !== "." && e !== ")")
    throw new Error("Cannot serialize items with `" + e + "` for `options.bulletOrdered`, expected `.` or `)`");
  return e;
}
function zu(t) {
  let e = t.options.rule || "*";
  if (e !== "*" && e !== "-" && e !== "_")
    throw new Error("Cannot serialize rules with `" + e + "` for `options.rule`, expected `*`, `-`, or `_`");
  return e;
}
function w1(t, e, n, l) {
  let i = n.enter("list"),
    r = n.bulletCurrent,
    a = t.ordered ? S1(n) : Qr(n),
    o = t.ordered ? (a === "." ? ")" : ".") : k1(n),
    s = e && n.bulletLastUsed ? a === n.bulletLastUsed : !1;
  if (!t.ordered) {
    let f = t.children ? t.children[0] : void 0;
    if (
      ((a === "*" || a === "-") &&
        f &&
        (!f.children || !f.children[0]) &&
        n.stack[n.stack.length - 1] === "list" &&
        n.stack[n.stack.length - 2] === "listItem" &&
        n.stack[n.stack.length - 3] === "list" &&
        n.stack[n.stack.length - 4] === "listItem" &&
        n.indexStack[n.indexStack.length - 1] === 0 &&
        n.indexStack[n.indexStack.length - 2] === 0 &&
        n.indexStack[n.indexStack.length - 3] === 0 &&
        (s = !0),
      zu(n) === a && f)
    ) {
      let c = -1;
      for (; ++c < t.children.length;) {
        let m = t.children[c];
        if (m && m.type === "listItem" && m.children && m.children[0] && m.children[0].type === "thematicBreak") {
          s = !0;
          break;
        }
      }
    }
  }
  (s && (a = o), (n.bulletCurrent = a));
  let u = n.containerFlow(t, l);
  return ((n.bulletLastUsed = a), (n.bulletCurrent = r), i(), u);
}
function T1(t) {
  let e = t.options.listItemIndent || "one";
  if (e !== "tab" && e !== "one" && e !== "mixed")
    throw new Error(
      "Cannot serialize items with `" + e + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`",
    );
  return e;
}
function E1(t, e, n, l) {
  let i = T1(n),
    r = n.bulletCurrent || Qr(n);
  e &&
    e.type === "list" &&
    e.ordered &&
    (r =
      (typeof e.start == "number" && e.start > -1 ? e.start : 1) +
      (n.options.incrementListMarker === !1 ? 0 : e.children.indexOf(t)) +
      r);
  let a = r.length + 1;
  (i === "tab" || (i === "mixed" && ((e && e.type === "list" && e.spread) || t.spread))) && (a = Math.ceil(a / 4) * 4);
  let o = n.createTracker(l);
  (o.move(r + " ".repeat(a - r.length)), o.shift(a));
  let s = n.enter("listItem"),
    u = n.indentLines(n.containerFlow(t, o.current()), f);
  return (s(), u);
  function f(c, m, d) {
    return m ? (d ? "" : " ".repeat(a)) + c : (d ? r : r + " ".repeat(a - r.length)) + c;
  }
}
function C1(t, e, n, l) {
  let i = n.enter("paragraph"),
    r = n.enter("phrasing"),
    a = n.containerPhrasing(t, l);
  return (r(), i(), a);
}
var Qm = Wl([
  "break",
  "delete",
  "emphasis",
  "footnote",
  "footnoteReference",
  "image",
  "imageReference",
  "inlineCode",
  "inlineMath",
  "link",
  "linkReference",
  "mdxJsxTextElement",
  "mdxTextExpression",
  "strong",
  "text",
  "textDirective",
]);
function A1(t, e, n, l) {
  return (
    t.children.some(function (a) {
      return Qm(a);
    })
      ? n.containerPhrasing
      : n.containerFlow
  ).call(n, t, l);
}
function N1(t) {
  let e = t.options.strong || "*";
  if (e !== "*" && e !== "_")
    throw new Error("Cannot serialize strong with `" + e + "` for `options.strong`, expected `*`, or `_`");
  return e;
}
Pm.peek = RA;
function Pm(t, e, n, l) {
  let i = N1(n),
    r = n.enter("strong"),
    a = n.createTracker(l),
    o = a.move(i + i),
    s = a.move(n.containerPhrasing(t, { after: i, before: o, ...a.current() })),
    u = s.charCodeAt(0),
    f = Vr(l.before.charCodeAt(l.before.length - 1), u, i);
  f.inside && (s = ti(u) + s.slice(1));
  let c = s.charCodeAt(s.length - 1),
    m = Vr(l.after.charCodeAt(0), c, i);
  m.inside && (s = s.slice(0, -1) + ti(c));
  let d = a.move(i + i);
  return (r(), (n.attentionEncodeSurroundingInfo = { after: m.outside, before: f.outside }), o + s + d);
}
function RA(t, e, n) {
  return n.options.strong || "*";
}
function R1(t, e, n, l) {
  return n.safe(t.value, l);
}
function M1(t) {
  let e = t.options.ruleRepetition || 3;
  if (e < 3)
    throw new Error(
      "Cannot serialize rules with repetition `" + e + "` for `options.ruleRepetition`, expected `3` or more",
    );
  return e;
}
function D1(t, e, n) {
  let l = (zu(n) + (n.options.ruleSpaces ? " " : "")).repeat(M1(n));
  return n.options.ruleSpaces ? l.slice(0, -1) : l;
}
var ko = {
  blockquote: c1,
  break: Um,
  code: g1,
  definition: y1,
  emphasis: Bm,
  hardBreak: Um,
  heading: x1,
  html: Hm,
  image: qm,
  imageReference: Im,
  inlineCode: jm,
  link: Fm,
  linkReference: Vm,
  list: w1,
  listItem: E1,
  paragraph: C1,
  root: A1,
  strong: Pm,
  text: R1,
  thematicBreak: D1,
};
function Xm() {
  return {
    enter: { table: MA, tableData: _1, tableHeader: _1, tableRow: _A },
    exit: { codeText: OA, table: DA, tableData: Gm, tableHeader: Gm, tableRow: Gm },
  };
}
function MA(t) {
  let e = t._align;
  (this.enter(
    {
      type: "table",
      align: e.map(function (n) {
        return n === "none" ? null : n;
      }),
      children: [],
    },
    t,
  ),
    (this.data.inTable = !0));
}
function DA(t) {
  (this.exit(t), (this.data.inTable = void 0));
}
function _A(t) {
  this.enter({ type: "tableRow", children: [] }, t);
}
function Gm(t) {
  this.exit(t);
}
function _1(t) {
  this.enter({ type: "tableCell", children: [] }, t);
}
function OA(t) {
  let e = this.resume();
  this.data.inTable && (e = e.replace(/\\([\\|])/g, zA));
  let n = this.stack[this.stack.length - 1];
  (n.type, (n.value = e), this.exit(t));
}
function zA(t, e) {
  return e === "|" ? e : t;
}
function Zm(t) {
  let e = t || {},
    n = e.tableCellPadding,
    l = e.tablePipeAlign,
    i = e.stringLength,
    r = n ? " " : "|";
  return {
    unsafe: [
      { character: "\r", inConstruct: "tableCell" },
      {
        character: `
`,
        inConstruct: "tableCell",
      },
      { atBreak: !0, character: "|", after: "[	 :-]" },
      { character: "|", inConstruct: "tableCell" },
      { atBreak: !0, character: ":", after: "-" },
      { atBreak: !0, character: "-", after: "[:|-]" },
    ],
    handlers: { inlineCode: m, table: a, tableCell: s, tableRow: o },
  };
  function a(d, g, x, C) {
    return u(f(d, x, C), d.align);
  }
  function o(d, g, x, C) {
    let h = c(d, x, C),
      p = u([h]);
    return p.slice(
      0,
      p.indexOf(`
`),
    );
  }
  function s(d, g, x, C) {
    let h = x.enter("tableCell"),
      p = x.enter("phrasing"),
      y = x.containerPhrasing(d, { ...C, before: r, after: r });
    return (p(), h(), y);
  }
  function u(d, g) {
    return u1(d, { align: g, alignDelimiters: l, padding: n, stringLength: i });
  }
  function f(d, g, x) {
    let C = d.children,
      h = -1,
      p = [],
      y = g.enter("table");
    for (; ++h < C.length;) p[h] = c(C[h], g, x);
    return (y(), p);
  }
  function c(d, g, x) {
    let C = d.children,
      h = -1,
      p = [],
      y = g.enter("tableRow");
    for (; ++h < C.length;) p[h] = s(C[h], d, g, x);
    return (y(), p);
  }
  function m(d, g, x) {
    let C = ko.inlineCode(d, g, x);
    return (x.stack.includes("tableCell") && (C = C.replace(/\|/g, "\\$&")), C);
  }
}
function Km() {
  return { exit: { taskListCheckValueChecked: O1, taskListCheckValueUnchecked: O1, paragraph: LA } };
}
function Jm() {
  return { unsafe: [{ atBreak: !0, character: "-", after: "[:|-]" }], handlers: { listItem: UA } };
}
function O1(t) {
  let e = this.stack[this.stack.length - 2];
  (e.type, (e.checked = t.type === "taskListCheckValueChecked"));
}
function LA(t) {
  let e = this.stack[this.stack.length - 2];
  if (e && e.type === "listItem" && typeof e.checked == "boolean") {
    let n = this.stack[this.stack.length - 1];
    n.type;
    let l = n.children[0];
    if (l && l.type === "text") {
      let i = e.children,
        r = -1,
        a;
      for (; ++r < i.length;) {
        let o = i[r];
        if (o.type === "paragraph") {
          a = o;
          break;
        }
      }
      a === n &&
        ((l.value = l.value.slice(1)),
        l.value.length === 0
          ? n.children.shift()
          : n.position &&
            l.position &&
            typeof l.position.start.offset == "number" &&
            (l.position.start.column++,
            l.position.start.offset++,
            (n.position.start = Object.assign({}, l.position.start))));
    }
  }
  this.exit(t);
}
function UA(t, e, n, l) {
  let i = t.children[0],
    r = typeof t.checked == "boolean" && i && i.type === "paragraph",
    a = "[" + (t.checked ? "x" : " ") + "] ",
    o = n.createTracker(l);
  r && o.move(a);
  let s = ko.listItem(t, e, n, { ...l, ...o.current() });
  return (r && (s = s.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, u)), s);
  function u(f) {
    return f + a;
  }
}
function $m() {
  return [Mm(), _m(), zm(), Xm(), Km()];
}
function Wm(t) {
  return { extensions: [Dm(), Om(t), Lm(), Zm(t), Jm()] };
}
var BA = { tokenize: YA, partial: !0 },
  z1 = { tokenize: FA, partial: !0 },
  L1 = { tokenize: VA, partial: !0 },
  U1 = { tokenize: QA, partial: !0 },
  HA = { tokenize: PA, partial: !0 },
  B1 = { name: "wwwAutolink", tokenize: IA, previous: q1 },
  H1 = { name: "protocolAutolink", tokenize: jA, previous: I1 },
  xl = { name: "emailAutolink", tokenize: qA, previous: j1 },
  $n = {};
function ep() {
  return { text: $n };
}
var Hi = 48;
for (; Hi < 123;) (($n[Hi] = xl), Hi++, Hi === 58 ? (Hi = 65) : Hi === 91 && (Hi = 97));
$n[43] = xl;
$n[45] = xl;
$n[46] = xl;
$n[95] = xl;
$n[72] = [xl, H1];
$n[104] = [xl, H1];
$n[87] = [xl, B1];
$n[119] = [xl, B1];
function qA(t, e, n) {
  let l = this,
    i,
    r;
  return a;
  function a(c) {
    return !tp(c) || !j1.call(l, l.previous) || np(l.events)
      ? n(c)
      : (t.enter("literalAutolink"), t.enter("literalAutolinkEmail"), o(c));
  }
  function o(c) {
    return tp(c) ? (t.consume(c), o) : c === 64 ? (t.consume(c), s) : n(c);
  }
  function s(c) {
    return c === 46 ? t.check(HA, f, u)(c) : c === 45 || c === 95 || oe(c) ? ((r = !0), t.consume(c), s) : f(c);
  }
  function u(c) {
    return (t.consume(c), (i = !0), s);
  }
  function f(c) {
    return r && i && Te(l.previous) ? (t.exit("literalAutolinkEmail"), t.exit("literalAutolink"), e(c)) : n(c);
  }
}
function IA(t, e, n) {
  let l = this;
  return i;
  function i(a) {
    return (a !== 87 && a !== 119) || !q1.call(l, l.previous) || np(l.events)
      ? n(a)
      : (t.enter("literalAutolink"),
        t.enter("literalAutolinkWww"),
        t.check(BA, t.attempt(z1, t.attempt(L1, r), n), n)(a));
  }
  function r(a) {
    return (t.exit("literalAutolinkWww"), t.exit("literalAutolink"), e(a));
  }
}
function jA(t, e, n) {
  let l = this,
    i = "",
    r = !1;
  return a;
  function a(c) {
    return (c === 72 || c === 104) && I1.call(l, l.previous) && !np(l.events)
      ? (t.enter("literalAutolink"), t.enter("literalAutolinkHttp"), (i += String.fromCodePoint(c)), t.consume(c), o)
      : n(c);
  }
  function o(c) {
    if (Te(c) && i.length < 5) return ((i += String.fromCodePoint(c)), t.consume(c), o);
    if (c === 58) {
      let m = i.toLowerCase();
      if (m === "http" || m === "https") return (t.consume(c), s);
    }
    return n(c);
  }
  function s(c) {
    return c === 47 ? (t.consume(c), r ? u : ((r = !0), s)) : n(c);
  }
  function u(c) {
    return c === null || Mi(c) || yt(c) || Kn(c) || Di(c) ? n(c) : t.attempt(z1, t.attempt(L1, f), n)(c);
  }
  function f(c) {
    return (t.exit("literalAutolinkHttp"), t.exit("literalAutolink"), e(c));
  }
}
function YA(t, e, n) {
  let l = 0;
  return i;
  function i(a) {
    return (a === 87 || a === 119) && l < 3 ? (l++, t.consume(a), i) : a === 46 && l === 3 ? (t.consume(a), r) : n(a);
  }
  function r(a) {
    return a === null ? n(a) : e(a);
  }
}
function FA(t, e, n) {
  let l, i, r;
  return a;
  function a(u) {
    return u === 46 || u === 95
      ? t.check(U1, s, o)(u)
      : u === null || yt(u) || Kn(u) || (u !== 45 && Di(u))
        ? s(u)
        : ((r = !0), t.consume(u), a);
  }
  function o(u) {
    return (u === 95 ? (l = !0) : ((i = l), (l = void 0)), t.consume(u), a);
  }
  function s(u) {
    return i || l || !r ? n(u) : e(u);
  }
}
function VA(t, e) {
  let n = 0,
    l = 0;
  return i;
  function i(a) {
    return a === 40
      ? (n++, t.consume(a), i)
      : a === 41 && l < n
        ? r(a)
        : a === 33 ||
            a === 34 ||
            a === 38 ||
            a === 39 ||
            a === 41 ||
            a === 42 ||
            a === 44 ||
            a === 46 ||
            a === 58 ||
            a === 59 ||
            a === 60 ||
            a === 63 ||
            a === 93 ||
            a === 95 ||
            a === 126
          ? t.check(U1, e, r)(a)
          : a === null || yt(a) || Kn(a)
            ? e(a)
            : (t.consume(a), i);
  }
  function r(a) {
    return (a === 41 && l++, t.consume(a), i);
  }
}
function QA(t, e, n) {
  return l;
  function l(o) {
    return o === 33 ||
      o === 34 ||
      o === 39 ||
      o === 41 ||
      o === 42 ||
      o === 44 ||
      o === 46 ||
      o === 58 ||
      o === 59 ||
      o === 63 ||
      o === 95 ||
      o === 126
      ? (t.consume(o), l)
      : o === 38
        ? (t.consume(o), r)
        : o === 93
          ? (t.consume(o), i)
          : o === 60 || o === null || yt(o) || Kn(o)
            ? e(o)
            : n(o);
  }
  function i(o) {
    return o === null || o === 40 || o === 91 || yt(o) || Kn(o) ? e(o) : l(o);
  }
  function r(o) {
    return Te(o) ? a(o) : n(o);
  }
  function a(o) {
    return o === 59 ? (t.consume(o), l) : Te(o) ? (t.consume(o), a) : n(o);
  }
}
function PA(t, e, n) {
  return l;
  function l(r) {
    return (t.consume(r), i);
  }
  function i(r) {
    return oe(r) ? n(r) : e(r);
  }
}
function q1(t) {
  return t === null || t === 40 || t === 42 || t === 95 || t === 91 || t === 93 || t === 126 || yt(t);
}
function I1(t) {
  return !Te(t);
}
function j1(t) {
  return !(t === 47 || tp(t));
}
function tp(t) {
  return t === 43 || t === 45 || t === 46 || t === 95 || oe(t);
}
function np(t) {
  let e = t.length,
    n = !1;
  for (; e--;) {
    let l = t[e][1];
    if ((l.type === "labelLink" || l.type === "labelImage") && !l._balanced) {
      n = !0;
      break;
    }
    if (l._gfmAutolinkLiteralWalkedInto) {
      n = !1;
      break;
    }
  }
  return (t.length > 0 && !n && (t[t.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), n);
}
var GA = { tokenize: tN, partial: !0 };
function lp() {
  return {
    document: { 91: { name: "gfmFootnoteDefinition", tokenize: JA, continuation: { tokenize: $A }, exit: WA } },
    text: {
      91: { name: "gfmFootnoteCall", tokenize: KA },
      93: { name: "gfmPotentialFootnoteCall", add: "after", tokenize: XA, resolveTo: ZA },
    },
  };
}
function XA(t, e, n) {
  let l = this,
    i = l.events.length,
    r = l.parser.gfmFootnotes || (l.parser.gfmFootnotes = []),
    a;
  for (; i--;) {
    let s = l.events[i][1];
    if (s.type === "labelImage") {
      a = s;
      break;
    }
    if (
      s.type === "gfmFootnoteCall" ||
      s.type === "labelLink" ||
      s.type === "label" ||
      s.type === "image" ||
      s.type === "link"
    )
      break;
  }
  return o;
  function o(s) {
    if (!a || !a._balanced) return n(s);
    let u = Fe(l.sliceSerialize({ start: a.end, end: l.now() }));
    return u.codePointAt(0) !== 94 || !r.includes(u.slice(1))
      ? n(s)
      : (t.enter("gfmFootnoteCallLabelMarker"), t.consume(s), t.exit("gfmFootnoteCallLabelMarker"), e(s));
  }
}
function ZA(t, e) {
  let n = t.length,
    l;
  for (; n--;)
    if (t[n][1].type === "labelImage" && t[n][0] === "enter") {
      l = t[n][1];
      break;
    }
  ((t[n + 1][1].type = "data"), (t[n + 3][1].type = "gfmFootnoteCallLabelMarker"));
  let i = {
      type: "gfmFootnoteCall",
      start: Object.assign({}, t[n + 3][1].start),
      end: Object.assign({}, t[t.length - 1][1].end),
    },
    r = {
      type: "gfmFootnoteCallMarker",
      start: Object.assign({}, t[n + 3][1].end),
      end: Object.assign({}, t[n + 3][1].end),
    };
  (r.end.column++, r.end.offset++, r.end._bufferIndex++);
  let a = {
      type: "gfmFootnoteCallString",
      start: Object.assign({}, r.end),
      end: Object.assign({}, t[t.length - 1][1].start),
    },
    o = {
      type: "chunkString",
      contentType: "string",
      start: Object.assign({}, a.start),
      end: Object.assign({}, a.end),
    },
    s = [
      t[n + 1],
      t[n + 2],
      ["enter", i, e],
      t[n + 3],
      t[n + 4],
      ["enter", r, e],
      ["exit", r, e],
      ["enter", a, e],
      ["enter", o, e],
      ["exit", o, e],
      ["exit", a, e],
      t[t.length - 2],
      t[t.length - 1],
      ["exit", i, e],
    ];
  return (t.splice(n, t.length - n + 1, ...s), t);
}
function KA(t, e, n) {
  let l = this,
    i = l.parser.gfmFootnotes || (l.parser.gfmFootnotes = []),
    r = 0,
    a;
  return o;
  function o(c) {
    return (
      t.enter("gfmFootnoteCall"),
      t.enter("gfmFootnoteCallLabelMarker"),
      t.consume(c),
      t.exit("gfmFootnoteCallLabelMarker"),
      s
    );
  }
  function s(c) {
    return c !== 94
      ? n(c)
      : (t.enter("gfmFootnoteCallMarker"),
        t.consume(c),
        t.exit("gfmFootnoteCallMarker"),
        t.enter("gfmFootnoteCallString"),
        (t.enter("chunkString").contentType = "string"),
        u);
  }
  function u(c) {
    if (r > 999 || (c === 93 && !a) || c === null || c === 91 || yt(c)) return n(c);
    if (c === 93) {
      t.exit("chunkString");
      let m = t.exit("gfmFootnoteCallString");
      return i.includes(Fe(l.sliceSerialize(m)))
        ? (t.enter("gfmFootnoteCallLabelMarker"),
          t.consume(c),
          t.exit("gfmFootnoteCallLabelMarker"),
          t.exit("gfmFootnoteCall"),
          e)
        : n(c);
    }
    return (yt(c) || (a = !0), r++, t.consume(c), c === 92 ? f : u);
  }
  function f(c) {
    return c === 91 || c === 92 || c === 93 ? (t.consume(c), r++, u) : u(c);
  }
}
function JA(t, e, n) {
  let l = this,
    i = l.parser.gfmFootnotes || (l.parser.gfmFootnotes = []),
    r,
    a = 0,
    o;
  return s;
  function s(g) {
    return (
      (t.enter("gfmFootnoteDefinition")._container = !0),
      t.enter("gfmFootnoteDefinitionLabel"),
      t.enter("gfmFootnoteDefinitionLabelMarker"),
      t.consume(g),
      t.exit("gfmFootnoteDefinitionLabelMarker"),
      u
    );
  }
  function u(g) {
    return g === 94
      ? (t.enter("gfmFootnoteDefinitionMarker"),
        t.consume(g),
        t.exit("gfmFootnoteDefinitionMarker"),
        t.enter("gfmFootnoteDefinitionLabelString"),
        (t.enter("chunkString").contentType = "string"),
        f)
      : n(g);
  }
  function f(g) {
    if (a > 999 || (g === 93 && !o) || g === null || g === 91 || yt(g)) return n(g);
    if (g === 93) {
      t.exit("chunkString");
      let x = t.exit("gfmFootnoteDefinitionLabelString");
      return (
        (r = Fe(l.sliceSerialize(x))),
        t.enter("gfmFootnoteDefinitionLabelMarker"),
        t.consume(g),
        t.exit("gfmFootnoteDefinitionLabelMarker"),
        t.exit("gfmFootnoteDefinitionLabel"),
        m
      );
    }
    return (yt(g) || (o = !0), a++, t.consume(g), g === 92 ? c : f);
  }
  function c(g) {
    return g === 91 || g === 92 || g === 93 ? (t.consume(g), a++, f) : f(g);
  }
  function m(g) {
    return g === 58
      ? (t.enter("definitionMarker"),
        t.consume(g),
        t.exit("definitionMarker"),
        i.includes(r) || i.push(r),
        W(t, d, "gfmFootnoteDefinitionWhitespace"))
      : n(g);
  }
  function d(g) {
    return e(g);
  }
}
function $A(t, e, n) {
  return t.check(Jn, e, t.attempt(GA, e, n));
}
function WA(t) {
  t.exit("gfmFootnoteDefinition");
}
function tN(t, e, n) {
  let l = this;
  return W(t, i, "gfmFootnoteDefinitionIndent", 5);
  function i(r) {
    let a = l.events[l.events.length - 1];
    return a && a[1].type === "gfmFootnoteDefinitionIndent" && a[2].sliceSerialize(a[1], !0).length === 4 ? e(r) : n(r);
  }
}
function ip(t) {
  let n = (t || {}).singleTilde,
    l = { name: "strikethrough", tokenize: r, resolveAll: i };
  return (n == null && (n = !0), { text: { 126: l }, insideSpan: { null: [l] }, attentionMarkers: { null: [126] } });
  function i(a, o) {
    let s = -1;
    for (; ++s < a.length;)
      if (a[s][0] === "enter" && a[s][1].type === "strikethroughSequenceTemporary" && a[s][1]._close) {
        let u = s;
        for (; u--;)
          if (
            a[u][0] === "exit" &&
            a[u][1].type === "strikethroughSequenceTemporary" &&
            a[u][1]._open &&
            a[s][1].end.offset - a[s][1].start.offset === a[u][1].end.offset - a[u][1].start.offset
          ) {
            ((a[s][1].type = "strikethroughSequence"), (a[u][1].type = "strikethroughSequence"));
            let f = {
                type: "strikethrough",
                start: Object.assign({}, a[u][1].start),
                end: Object.assign({}, a[s][1].end),
              },
              c = {
                type: "strikethroughText",
                start: Object.assign({}, a[u][1].end),
                end: Object.assign({}, a[s][1].start),
              },
              m = [
                ["enter", f, o],
                ["enter", a[u][1], o],
                ["exit", a[u][1], o],
                ["enter", c, o],
              ],
              d = o.parser.constructs.insideSpan.null;
            (d && de(m, m.length, 0, Jl(d, a.slice(u + 1, s), o)),
              de(m, m.length, 0, [
                ["exit", c, o],
                ["enter", a[s][1], o],
                ["exit", a[s][1], o],
                ["exit", f, o],
              ]),
              de(a, u - 1, s - u + 3, m),
              (s = u + m.length - 2));
            break;
          }
      }
    for (s = -1; ++s < a.length;) a[s][1].type === "strikethroughSequenceTemporary" && (a[s][1].type = "data");
    return a;
  }
  function r(a, o, s) {
    let u = this.previous,
      f = this.events,
      c = 0;
    return m;
    function m(g) {
      return u === 126 && f[f.length - 1][1].type !== "characterEscape"
        ? s(g)
        : (a.enter("strikethroughSequenceTemporary"), d(g));
    }
    function d(g) {
      let x = bl(u);
      if (g === 126) return c > 1 ? s(g) : (a.consume(g), c++, d);
      if (c < 2 && !n) return s(g);
      let C = a.exit("strikethroughSequenceTemporary"),
        h = bl(g);
      return ((C._open = !h || (h === 2 && !!x)), (C._close = !x || (x === 2 && !!h)), o(g));
    }
  }
}
var Lu = class {
  constructor() {
    this.map = [];
  }
  add(e, n, l) {
    eN(this, e, n, l);
  }
  consume(e) {
    if (
      (this.map.sort(function (r, a) {
        return r[0] - a[0];
      }),
      this.map.length === 0)
    )
      return;
    let n = this.map.length,
      l = [];
    for (; n > 0;)
      ((n -= 1), l.push(e.slice(this.map[n][0] + this.map[n][1]), this.map[n][2]), (e.length = this.map[n][0]));
    (l.push(e.slice()), (e.length = 0));
    let i = l.pop();
    for (; i;) {
      for (let r of i) e.push(r);
      i = l.pop();
    }
    this.map.length = 0;
  }
};
function eN(t, e, n, l) {
  let i = 0;
  if (!(n === 0 && l.length === 0)) {
    for (; i < t.map.length;) {
      if (t.map[i][0] === e) {
        ((t.map[i][1] += n), t.map[i][2].push(...l));
        return;
      }
      i += 1;
    }
    t.map.push([e, n, l]);
  }
}
function Y1(t, e) {
  let n = !1,
    l = [];
  for (; e < t.length;) {
    let i = t[e];
    if (n) {
      if (i[0] === "enter")
        i[1].type === "tableContent" && l.push(t[e + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
      else if (i[1].type === "tableContent") {
        if (t[e - 1][1].type === "tableDelimiterMarker") {
          let r = l.length - 1;
          l[r] = l[r] === "left" ? "center" : "right";
        }
      } else if (i[1].type === "tableDelimiterRow") break;
    } else i[0] === "enter" && i[1].type === "tableDelimiterRow" && (n = !0);
    e += 1;
  }
  return l;
}
function rp() {
  return { flow: { null: { name: "table", tokenize: nN, resolveAll: lN } } };
}
function nN(t, e, n) {
  let l = this,
    i = 0,
    r = 0,
    a;
  return o;
  function o(w) {
    let Z = l.events.length - 1;
    for (; Z > -1;) {
      let X = l.events[Z][1].type;
      if (X === "lineEnding" || X === "linePrefix") Z--;
      else break;
    }
    let L = Z > -1 ? l.events[Z][1].type : null,
      H = L === "tableHead" || L === "tableRow" ? E : s;
    return H === E && l.parser.lazy[l.now().line] ? n(w) : H(w);
  }
  function s(w) {
    return (t.enter("tableHead"), t.enter("tableRow"), u(w));
  }
  function u(w) {
    return (w === 124 || ((a = !0), (r += 1)), f(w));
  }
  function f(w) {
    return w === null
      ? n(w)
      : Q(w)
        ? r > 1
          ? ((r = 0),
            (l.interrupt = !0),
            t.exit("tableRow"),
            t.enter("lineEnding"),
            t.consume(w),
            t.exit("lineEnding"),
            d)
          : n(w)
        : lt(w)
          ? W(t, f, "whitespace")(w)
          : ((r += 1),
            a && ((a = !1), (i += 1)),
            w === 124
              ? (t.enter("tableCellDivider"), t.consume(w), t.exit("tableCellDivider"), (a = !0), f)
              : (t.enter("data"), c(w)));
  }
  function c(w) {
    return w === null || w === 124 || yt(w) ? (t.exit("data"), f(w)) : (t.consume(w), w === 92 ? m : c);
  }
  function m(w) {
    return w === 92 || w === 124 ? (t.consume(w), c) : c(w);
  }
  function d(w) {
    return (
      (l.interrupt = !1),
      l.parser.lazy[l.now().line]
        ? n(w)
        : (t.enter("tableDelimiterRow"),
          (a = !1),
          lt(w)
            ? W(t, g, "linePrefix", l.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(w)
            : g(w))
    );
  }
  function g(w) {
    return w === 45 || w === 58
      ? C(w)
      : w === 124
        ? ((a = !0), t.enter("tableCellDivider"), t.consume(w), t.exit("tableCellDivider"), x)
        : N(w);
  }
  function x(w) {
    return lt(w) ? W(t, C, "whitespace")(w) : C(w);
  }
  function C(w) {
    return w === 58
      ? ((r += 1), (a = !0), t.enter("tableDelimiterMarker"), t.consume(w), t.exit("tableDelimiterMarker"), h)
      : w === 45
        ? ((r += 1), h(w))
        : w === null || Q(w)
          ? T(w)
          : N(w);
  }
  function h(w) {
    return w === 45 ? (t.enter("tableDelimiterFiller"), p(w)) : N(w);
  }
  function p(w) {
    return w === 45
      ? (t.consume(w), p)
      : w === 58
        ? ((a = !0),
          t.exit("tableDelimiterFiller"),
          t.enter("tableDelimiterMarker"),
          t.consume(w),
          t.exit("tableDelimiterMarker"),
          y)
        : (t.exit("tableDelimiterFiller"), y(w));
  }
  function y(w) {
    return lt(w) ? W(t, T, "whitespace")(w) : T(w);
  }
  function T(w) {
    return w === 124
      ? g(w)
      : w === null || Q(w)
        ? !a || i !== r
          ? N(w)
          : (t.exit("tableDelimiterRow"), t.exit("tableHead"), e(w))
        : N(w);
  }
  function N(w) {
    return n(w);
  }
  function E(w) {
    return (t.enter("tableRow"), M(w));
  }
  function M(w) {
    return w === 124
      ? (t.enter("tableCellDivider"), t.consume(w), t.exit("tableCellDivider"), M)
      : w === null || Q(w)
        ? (t.exit("tableRow"), e(w))
        : lt(w)
          ? W(t, M, "whitespace")(w)
          : (t.enter("data"), z(w));
  }
  function z(w) {
    return w === null || w === 124 || yt(w) ? (t.exit("data"), M(w)) : (t.consume(w), w === 92 ? F : z);
  }
  function F(w) {
    return w === 92 || w === 124 ? (t.consume(w), z) : z(w);
  }
}
function lN(t, e) {
  let n = -1,
    l = !0,
    i = 0,
    r = [0, 0, 0, 0],
    a = [0, 0, 0, 0],
    o = !1,
    s = 0,
    u,
    f,
    c,
    m = new Lu();
  for (; ++n < t.length;) {
    let d = t[n],
      g = d[1];
    d[0] === "enter"
      ? g.type === "tableHead"
        ? ((o = !1),
          s !== 0 && (F1(m, e, s, u, f), (f = void 0), (s = 0)),
          (u = { type: "table", start: Object.assign({}, g.start), end: Object.assign({}, g.end) }),
          m.add(n, 0, [["enter", u, e]]))
        : g.type === "tableRow" || g.type === "tableDelimiterRow"
          ? ((l = !0),
            (c = void 0),
            (r = [0, 0, 0, 0]),
            (a = [0, n + 1, 0, 0]),
            o &&
              ((o = !1),
              (f = { type: "tableBody", start: Object.assign({}, g.start), end: Object.assign({}, g.end) }),
              m.add(n, 0, [["enter", f, e]])),
            (i = g.type === "tableDelimiterRow" ? 2 : f ? 3 : 1))
          : i && (g.type === "data" || g.type === "tableDelimiterMarker" || g.type === "tableDelimiterFiller")
            ? ((l = !1),
              a[2] === 0 &&
                (r[1] !== 0 && ((a[0] = a[1]), (c = Uu(m, e, r, i, void 0, c)), (r = [0, 0, 0, 0])), (a[2] = n)))
            : g.type === "tableCellDivider" &&
              (l
                ? (l = !1)
                : (r[1] !== 0 && ((a[0] = a[1]), (c = Uu(m, e, r, i, void 0, c))), (r = a), (a = [r[1], n, 0, 0])))
      : g.type === "tableHead"
        ? ((o = !0), (s = n))
        : g.type === "tableRow" || g.type === "tableDelimiterRow"
          ? ((s = n),
            r[1] !== 0 ? ((a[0] = a[1]), (c = Uu(m, e, r, i, n, c))) : a[1] !== 0 && (c = Uu(m, e, a, i, n, c)),
            (i = 0))
          : i &&
            (g.type === "data" || g.type === "tableDelimiterMarker" || g.type === "tableDelimiterFiller") &&
            (a[3] = n);
  }
  for (s !== 0 && F1(m, e, s, u, f), m.consume(e.events), n = -1; ++n < e.events.length;) {
    let d = e.events[n];
    d[0] === "enter" && d[1].type === "table" && (d[1]._align = Y1(e.events, n));
  }
  return t;
}
function Uu(t, e, n, l, i, r) {
  let a = l === 1 ? "tableHeader" : l === 2 ? "tableDelimiter" : "tableData",
    o = "tableContent";
  n[0] !== 0 && ((r.end = Object.assign({}, Pr(e.events, n[0]))), t.add(n[0], 0, [["exit", r, e]]));
  let s = Pr(e.events, n[1]);
  if (
    ((r = { type: a, start: Object.assign({}, s), end: Object.assign({}, s) }),
    t.add(n[1], 0, [["enter", r, e]]),
    n[2] !== 0)
  ) {
    let u = Pr(e.events, n[2]),
      f = Pr(e.events, n[3]),
      c = { type: o, start: Object.assign({}, u), end: Object.assign({}, f) };
    if ((t.add(n[2], 0, [["enter", c, e]]), l !== 2)) {
      let m = e.events[n[2]],
        d = e.events[n[3]];
      if (
        ((m[1].end = Object.assign({}, d[1].end)),
        (m[1].type = "chunkText"),
        (m[1].contentType = "text"),
        n[3] > n[2] + 1)
      ) {
        let g = n[2] + 1,
          x = n[3] - n[2] - 1;
        t.add(g, x, []);
      }
    }
    t.add(n[3] + 1, 0, [["exit", c, e]]);
  }
  return (
    i !== void 0 && ((r.end = Object.assign({}, Pr(e.events, i))), t.add(i, 0, [["exit", r, e]]), (r = void 0)),
    r
  );
}
function F1(t, e, n, l, i) {
  let r = [],
    a = Pr(e.events, n);
  (i && ((i.end = Object.assign({}, a)), r.push(["exit", i, e])),
    (l.end = Object.assign({}, a)),
    r.push(["exit", l, e]),
    t.add(n + 1, 0, r));
}
function Pr(t, e) {
  let n = t[e],
    l = n[0] === "enter" ? "start" : "end";
  return n[1][l];
}
var iN = { name: "tasklistCheck", tokenize: rN };
function ap() {
  return { text: { 91: iN } };
}
function rN(t, e, n) {
  let l = this;
  return i;
  function i(s) {
    return l.previous !== null || !l._gfmTasklistFirstContentOfListItem
      ? n(s)
      : (t.enter("taskListCheck"), t.enter("taskListCheckMarker"), t.consume(s), t.exit("taskListCheckMarker"), r);
  }
  function r(s) {
    return yt(s)
      ? (t.enter("taskListCheckValueUnchecked"), t.consume(s), t.exit("taskListCheckValueUnchecked"), a)
      : s === 88 || s === 120
        ? (t.enter("taskListCheckValueChecked"), t.consume(s), t.exit("taskListCheckValueChecked"), a)
        : n(s);
  }
  function a(s) {
    return s === 93
      ? (t.enter("taskListCheckMarker"), t.consume(s), t.exit("taskListCheckMarker"), t.exit("taskListCheck"), o)
      : n(s);
  }
  function o(s) {
    return Q(s) ? e(s) : lt(s) ? t.check({ tokenize: aN }, e, n)(s) : n(s);
  }
}
function aN(t, e, n) {
  return W(t, l, "whitespace");
  function l(i) {
    return i === null ? n(i) : e(i);
  }
}
function V1(t) {
  return uu([ep(), lp(), ip(t), rp(), ap()]);
}
var oN = {};
function Gr(t) {
  let e = this,
    n = t || oN,
    l = e.data(),
    i = l.micromarkExtensions || (l.micromarkExtensions = []),
    r = l.fromMarkdownExtensions || (l.fromMarkdownExtensions = []),
    a = l.toMarkdownExtensions || (l.toMarkdownExtensions = []);
  (i.push(V1(n)), r.push($m()), a.push(Wm(n)));
}
function op(t) {
  if (!t) return t;
  let e = t.toLowerCase(),
    n = e.indexOf("<think>"),
    l = e.indexOf("<thinking>"),
    i = -1,
    r = 0;
  if ((n !== -1 && (l === -1 || n < l) ? ((i = n), (r = 7)) : l !== -1 && ((i = l), (r = 10)), i === -1))
    return t.replace(
      /\n\n+/g,
      `

`,
    );
  let a = t.slice(0, i),
    o = t.slice(i + r),
    s = o.toLowerCase(),
    u = s.indexOf("</think>"),
    f = s.indexOf("</thinking>"),
    c = -1,
    m = 0;
  if ((u !== -1 && (f === -1 || u < f) ? ((c = u), (m = 8)) : f !== -1 && ((c = f), (m = 11)), c === -1))
    return (
      a +
      `
__THINK_START__
` +
      o
    ).replace(
      /\n\n+/g,
      `

`,
    );
  let d = o.slice(0, c),
    g = o.slice(c + m);
  return (
    a +
    `
__THINK_START__
` +
    d +
    `
__THINK_END__
` +
    op(g)
  ).replace(
    /\n\n+/g,
    `

`,
  );
}
var bn = G(it(), 1),
  So = ({ text: t, enableThinkTags: e = !0 }) => {
    let n = e ? op(t) : t;
    if (e && n.includes("__THINK_START__")) {
      let l = n.split(/__(?:THINK_START|THINK_END)__/),
        i = l[0] || "",
        r = l[1] || "",
        a = l[2] || "",
        o = !n.includes("__THINK_END__");
      return (0, bn.jsxs)("div", {
        className: "md",
        children: [
          i.trim() && (0, bn.jsx)(xo, { remarkPlugins: [Gr], children: i }),
          o
            ? (0, bn.jsxs)("div", {
                className: "think active",
                children: [
                  (0, bn.jsx)("div", { className: "think-header", children: "Thinking\u2026" }),
                  (0, bn.jsx)("pre", {
                    className: "think-content",
                    children: r
                      .split(
                        `
`,
                      )
                      .slice(-3).join(`
`),
                  }),
                ],
              })
            : (0, bn.jsxs)("details", {
                className: "think",
                children: [
                  (0, bn.jsx)("summary", { children: "Thought" }),
                  (0, bn.jsx)("pre", { className: "think-content", children: r }),
                ],
              }),
          a.trim() && (0, bn.jsx)(xo, { remarkPlugins: [Gr], children: a }),
        ],
      });
    }
    return (0, bn.jsx)("div", { className: "md", children: (0, bn.jsx)(xo, { remarkPlugins: [Gr], children: n }) });
  };
var qn = G(it(), 1);
function Bu({ message: t }) {
  let e = (0, Q1.useMemo)(
    () =>
      t.completed || t.type !== "thought"
        ? t.text
        : t.text
            .split(
              `
`,
            )
            .slice(-3).join(`
`),
    [t.completed, t.text, t.type],
  );
  return (0, qn.jsx)(qn.Fragment, {
    children:
      t.type === "thought"
        ? (0, qn.jsxs)("details", {
            className: `think${t.completed ? "" : " active"}`,
            open: !t.completed,
            children: [
              (0, qn.jsx)("summary", { children: "Thinking" }),
              (0, qn.jsx)("div", {
                className: "think-body",
                children: (0, qn.jsx)("pre", { className: "think-content", children: t.completed ? t.text : e }),
              }),
            ],
          })
        : (0, qn.jsx)("div", {
            className: t.role === "user" ? "user-message" : "assistant-message",
            children: (0, qn.jsx)(So, { text: t.text, enableThinkTags: !0 }),
          }),
  });
}
var wo = G(it(), 1);
function sN(t) {
  return t.startsWith("+")
    ? "add"
    : t.startsWith("-")
      ? "del"
      : t.startsWith("@@")
        ? "hunk"
        : t.startsWith("---") || t.startsWith("+++")
          ? "meta"
          : "";
}
function Hu({ oldText: t, newText: e, maxLines: n = 80 }) {
  let l = t
      ? String(t).split(`
`)
      : [],
    i = e
      ? String(e).split(`
`)
      : [],
    r = Math.min(Math.max(l.length, i.length), n);
  if (r === 0) return null;
  let a = [];
  (a.push("--- old"), a.push("+++ new"));
  for (let o = 0; o < r; o++) {
    let s = l[o] ?? "",
      u = i[o] ?? "";
    s === u ? a.push(` ${s}`) : (s !== "" && a.push(`-${s}`), u !== "" && a.push(`+${u}`));
  }
  return (0, wo.jsx)("div", {
    className: "diff",
    children: (0, wo.jsx)("pre", {
      children: a.slice(0, n).map((o, s) =>
        (0, wo.jsxs)(
          "span",
          {
            className: sN(o),
            children: [
              o,
              `
`,
            ],
          },
          s,
        ),
      ),
    }),
  });
}
var pt = G(it(), 1);
function uN(t) {
  if (!t) return null;
  for (let e of t) if (e && e.type === "diff") return e;
  return null;
}
function cN(t) {
  return typeof t == "object" && t !== null;
}
function fN(t) {
  return typeof t.title == "string" && t.title.startsWith("Execute Unity ");
}
function dN(t) {
  let e = t.rawInput;
  return cN(e) ? typeof e.agent_name == "string" && typeof e.task == "string" : !1;
}
function mN(t) {
  return t.name === "ask_user";
}
function P1(t) {
  if (!t) return !1;
  for (let e of t)
    if (e) {
      if (e.type === "diff") return !0;
      if (e.type === "content" && e.content?.type === "text") {
        let n = (e.content.text ?? "").trim();
        if (n.length > 0) {
          if (n.startsWith("Listed ") && n.includes("item(s)")) continue;
          return !0;
        }
      }
    }
  return !1;
}
function pN({ raw: t }) {
  let e = Object.entries(t)
    .filter(([n]) => n !== "agent_name" && n !== "task")
    .map(([n, l]) =>
      typeof l == "string" && l.length > 100 ? `${n}: ${l.slice(0, 100)}...` : `${n}: ${JSON.stringify(l)}`,
    );
  return e.length === 0
    ? null
    : (0, pt.jsx)("div", {
        className: "subagent-params",
        children: e.map((n, l) => (0, pt.jsx)("div", { className: "subagent-param", children: n }, l)),
      });
}
function qu({ tool: t, onOpenDiff: e }) {
  let n = uN(t.content),
    l = dN(t),
    i = typeof t.streamingArgumentDisplay == "string" && t.streamingArgumentDisplay.length > 0;
  if ((mN(t) || !P1(t.content)) && !fN(t) && !l && !i)
    return (0, pt.jsxs)("div", {
      className: "tool-compact",
      children: [
        (0, pt.jsx)("span", { className: "tool-compact-arrow", children: "\u2192" }),
        (0, pt.jsx)("span", { className: "tool-compact-kind", children: t.kind ?? "other" }),
        (0, pt.jsx)("span", { className: "tool-compact-title", children: t.title || "Tool call" }),
        (0, pt.jsx)("span", { className: "tool-compact-status", children: t.status ?? "pending" }),
      ],
    });
  if (l) {
    let a = t.rawInput,
      o = a.agent_name || "agent",
      s = a.task || "",
      u = t.status === "pending" || t.status === "in_progress";
    return (0, pt.jsxs)("div", {
      className: "tool-card subagent-card",
      children: [
        (0, pt.jsxs)("div", {
          className: `subagent-header ${u ? "running" : ""}`,
          children: [
            (0, pt.jsxs)("div", {
              className: "subagent-title",
              children: [
                (0, pt.jsx)("span", { className: "subagent-label", children: "subagent" }),
                (0, pt.jsx)("span", { className: "subagent-name", children: o }),
              ],
            }),
            (0, pt.jsxs)("div", {
              className: "subagent-status-wrap",
              children: [
                u && (0, pt.jsx)("div", { className: "subagent-spinner" }),
                (0, pt.jsx)("span", { className: "subagent-status", children: t.status ?? "pending" }),
              ],
            }),
          ],
        }),
        (0, pt.jsxs)("div", {
          className: "subagent-task",
          children: [
            (0, pt.jsx)("div", { className: "subagent-task-label", children: "Task:" }),
            (0, pt.jsx)("div", { className: "subagent-task-text", children: s }),
          ],
        }),
        a && (0, pt.jsx)(pN, { raw: a }),
        P1(t.content) &&
          (0, pt.jsx)("div", {
            className: "subagent-result",
            children: (t.content ?? []).map((f, c) =>
              f && f.type === "content" && f.content?.type === "text"
                ? (0, pt.jsx)(So, { text: f.content.text ?? "", enableThinkTags: !0 }, c)
                : null,
            ),
          }),
      ],
    });
  }
  return (0, pt.jsxs)("div", {
    className: "tool-card",
    children: [
      (0, pt.jsxs)("div", {
        className: "tool-card-header",
        children: [
          (0, pt.jsxs)("div", {
            className: "tool-card-title",
            children: [
              (0, pt.jsx)("span", { className: "tool-kind", children: t.kind ?? "other" }),
              (0, pt.jsx)("span", { children: t.title || "Tool call" }),
            ],
          }),
          (0, pt.jsx)("span", { className: "tool-status", children: t.status ?? "pending" }),
        ],
      }),
      (0, pt.jsxs)("div", {
        className: "tool-card-body",
        children: [
          i &&
            (0, pt.jsxs)("div", {
              className: "tool-streaming-arguments",
              children: [
                (0, pt.jsx)("div", { className: "pill", children: "Streaming arguments" }),
                (0, pt.jsx)("pre", { children: t.streamingArgumentDisplay }),
              ],
            }),
          (t.content ?? []).map((a, o) =>
            a
              ? a.type === "content" && a.content?.type === "text"
                ? (0, pt.jsx)(So, { text: a.content.text ?? "", enableThinkTags: !0 }, o)
                : a.type === "diff"
                  ? (0, pt.jsxs)(
                      "div",
                      {
                        children: [
                          (0, pt.jsxs)("div", {
                            style: {
                              display: "flex",
                              gap: 10,
                              alignItems: "center",
                              flexWrap: "wrap",
                              marginBottom: 8,
                            },
                            children: [
                              (0, pt.jsx)("div", {
                                className: "pill",
                                children: (0, pt.jsx)("span", { children: `Diff: ${a.path}` }),
                              }),
                              (0, pt.jsx)("button", {
                                className: "btn",
                                onClick: () => e({ title: a.path, oldText: a.oldText ?? "", newText: a.newText ?? "" }),
                                children: "Open diff",
                              }),
                            ],
                          }),
                          (0, pt.jsx)(Hu, { oldText: a.oldText ?? "", newText: a.newText }),
                        ],
                      },
                      o,
                    )
                  : null
              : null,
          ),
          null,
        ],
      }),
    ],
  });
}
var ei = G(it(), 1);
function sp({ items: t, activeIndex: e, onPick: n, onHover: l }) {
  return !t || t.length === 0
    ? null
    : (0, ei.jsxs)("div", {
        className: "autocomplete",
        children: [
          (0, ei.jsx)("div", { className: "ac-header", children: "Commands" }),
          t.map((i, r) =>
            (0, ei.jsxs)(
              "div",
              {
                className: `ac-item${r === e ? " active" : ""}`,
                onMouseEnter: () => l(r),
                onMouseDown: (a) => {
                  (a.preventDefault(), n(r));
                },
                children: [
                  (0, ei.jsx)("div", {
                    className: "ac-name",
                    children: (0, ei.jsx)("code", { children: `/${i.name}` }),
                  }),
                  (0, ei.jsx)("div", { className: "ac-desc", children: i.description }),
                ],
              },
              i.name,
            ),
          ),
        ],
      });
}
var qi = G(it(), 1);
function G1({ items: t, activeIndex: e, onPick: n, onHover: l }) {
  return !t || t.length === 0
    ? null
    : (0, qi.jsxs)("div", {
        className: "autocomplete",
        children: [
          (0, qi.jsx)("div", { className: "ac-header", children: "Paths" }),
          t.map((i, r) =>
            (0, qi.jsx)(
              "div",
              {
                className: `ac-item${r === e ? " active" : ""}`,
                onMouseEnter: () => l(r),
                onMouseDown: (a) => {
                  (a.preventDefault(), n(r));
                },
                children: (0, qi.jsx)("div", {
                  className: "ac-name",
                  children: (0, qi.jsx)("code", { children: `@${i}` }),
                }),
              },
              `${i}_${r}`,
            ),
          ),
        ],
      });
}
var In = G(it(), 1);
var ni = ({
  textareaRef: t,
  value: e,
  placeholder: n,
  onChange: l,
  onKeyDown: i,
  onSubmit: r,
  onCancel: a,
  isBusy: o = !1,
  disabled: s = !1,
  textareaClassName: u,
  submitClassName: f = "composer-submit",
  submitDisabled: c = !1,
  submitLabel: m,
  busyLabel: d,
}) =>
  (0, In.jsxs)(In.Fragment, {
    children: [
      (0, In.jsx)("textarea", {
        ref: t,
        className: u,
        value: e,
        placeholder: n,
        onChange: l,
        onKeyDown: i,
        disabled: s,
      }),
      (0, In.jsx)("button", {
        type: "button",
        className: `${f}${o ? " busy" : ""}`,
        onClick: () => {
          if (o) {
            a?.();
            return;
          }
          r();
        },
        title: o ? "Stop" : "Send",
        disabled: s || c,
        children: o
          ? (d ??
            (0, In.jsx)("svg", {
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              children: (0, In.jsx)("rect", { x: "6", y: "6", width: "12", height: "12", rx: "2" }),
            }))
          : m ||
            (0, In.jsx)("svg", {
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "3",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: (0, In.jsx)("path", { d: "M12 19V5M5 12l7-7 7 7" }),
            }),
      }),
    ],
  });
var Iu = G(le(), 1);
var X1 = G(oc(), 1),
  li = G(it(), 1);
function Ee({ children: t, onClose: e }) {
  return (0, X1.createPortal)(
    (0, li.jsx)("div", {
      className: "modal-backdrop",
      role: "presentation",
      onMouseDown: (l) => {
        l.target === l.currentTarget && e();
      },
      children: t,
    }),
    document.body,
  );
}
function Ce({ title: t, onClose: e, children: n, footer: l }) {
  return (0, li.jsxs)("div", {
    className: "modal",
    role: "dialog",
    "aria-modal": "true",
    children: [
      (0, li.jsxs)("div", {
        className: "modal-header",
        children: [
          (0, li.jsx)("h2", { children: t }),
          (0, li.jsx)("button", { className: "btn", onClick: e, children: "Close" }),
        ],
      }),
      n,
      l ? (0, li.jsx)("div", { className: "modal-footer", children: l }) : null,
    ],
  });
}
var Qe = G(it(), 1);
function Xr({ title: t, oldText: e, newText: n, onClose: l, onConfirm: i }) {
  let [r, a] = (0, Iu.useState)(n),
    o = (0, Iu.useMemo)(() => typeof i == "function", [i]);
  return (0, Qe.jsx)(Ee, {
    onClose: l,
    children: (0, Qe.jsx)(Ce, {
      title: t ? `Review change \xB7 ${t}` : "Review change",
      onClose: l,
      footer: (0, Qe.jsxs)(Qe.Fragment, {
        children: [
          (0, Qe.jsx)("button", { className: "btn", onClick: l, children: "Cancel" }),
          o
            ? (0, Qe.jsx)("button", { className: "btn primary", onClick: () => i?.(r), children: "Use this version" })
            : null,
        ],
      }),
      children: (0, Qe.jsxs)("div", {
        className: "modal-body",
        children: [
          (0, Qe.jsxs)("div", {
            className: "modal-pane",
            children: [
              (0, Qe.jsx)("div", { className: "pane-title", children: "Current (read-only)" }),
              (0, Qe.jsx)("textarea", { readOnly: !0, value: e }),
            ],
          }),
          (0, Qe.jsxs)("div", {
            className: "modal-pane",
            children: [
              (0, Qe.jsx)("div", { className: "pane-title", children: "Proposed (editable)" }),
              (0, Qe.jsx)("textarea", { value: r, onChange: (s) => a(s.target.value) }),
            ],
          }),
        ],
      }),
    }),
  });
}
var To = G(le(), 1);
var At = G(it(), 1);
function hN(t) {
  if (typeof t != "object" || t === null) return !1;
  let e = t;
  return e.hookTrust === !0 && Array.isArray(e.hooks);
}
function gN({ hooks: t }) {
  return (0, At.jsxs)("div", {
    style: { display: "flex", flexDirection: "column", gap: 8 },
    children: [
      (0, At.jsx)("div", {
        className: "pill",
        style: { background: "var(--warning-bg, #332b00)", padding: "6px 10px" },
        children: "This workspace has project hooks that are not yet trusted.",
      }),
      (0, At.jsx)("div", { className: "section-title", children: "Blocked hooks" }),
      (0, At.jsx)("div", {
        style: { display: "flex", flexDirection: "column", gap: 6 },
        children: t.map((e) =>
          (0, At.jsxs)(
            "div",
            {
              style: { padding: "6px 10px", borderRadius: 6, background: "var(--surface-alt, #1e1e1e)", fontSize: 13 },
              children: [
                (0, At.jsx)("strong", { children: e.name }),
                (0, At.jsx)("div", {
                  style: { opacity: 0.8, marginTop: 2 },
                  children: (0, At.jsx)("code", { children: e.command }),
                }),
                (0, At.jsxs)("div", {
                  style: { opacity: 0.7, marginTop: 2 },
                  children: ["events: ", e.eventNames.join(", ")],
                }),
              ],
            },
            e.key,
          ),
        ),
      }),
    ],
  });
}
function yN(t) {
  return t.kind === "allow_once" || t.kind === "allow_always";
}
function vN(t) {
  return t.kind === "reject_once" || t.kind === "reject_always";
}
function Z1({ req: t, onSelect: e }) {
  let [n, l] = (0, To.useState)(() => {
      let o = t.toolCall?.content ?? [];
      for (let s of o)
        if (s && s.type === "diff") return { title: s.path, oldText: s.oldText ?? "", newText: s.newText ?? "" };
      return null;
    }),
    [i, r] = (0, To.useState)(!1),
    a = (0, To.useMemo)(() => (n ? { gamecowork: { toolConfirmationPayload: { newContent: n.newText } } } : null), [n]);
  return (0, At.jsxs)(At.Fragment, {
    children: [
      (0, At.jsx)(Ee, {
        onClose: () => {
          e({ outcome: "cancelled" });
        },
        children: (0, At.jsx)(Ce, {
          title: `Approval required \xB7 ${t.toolCall?.title ?? "Tool call"}`,
          onClose: () => e({ outcome: "cancelled" }),
          footer: (0, At.jsx)("button", {
            className: "btn",
            onClick: () => e({ outcome: "cancelled" }),
            children: "Cancel",
          }),
          children: (0, At.jsx)("div", {
            className: "modal-body",
            style: { gridTemplateColumns: "1fr" },
            children: (0, At.jsxs)("div", {
              className: "modal-pane",
              children: [
                (0, At.jsx)("div", { className: "pane-title", children: "Details" }),
                (0, At.jsxs)("div", {
                  style: { padding: "10px 12px", display: "flex", flexDirection: "column", gap: 10 },
                  children: [
                    (0, At.jsxs)("div", {
                      className: "pill",
                      children: [
                        (0, At.jsx)("span", { children: `Kind: ${t.toolCall?.kind ?? "other"}` }),
                        (0, At.jsx)("span", {
                          style: { marginLeft: 10 },
                          children: `Status: ${t.toolCall?.status ?? "pending"}`,
                        }),
                      ],
                    }),
                    hN(t.toolCall?.rawInput) ? (0, At.jsx)(gN, { hooks: t.toolCall.rawInput.hooks }) : null,
                    n
                      ? (0, At.jsxs)("div", {
                          style: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },
                          children: [
                            (0, At.jsx)("div", {
                              className: "pill",
                              children: (0, At.jsx)("span", { children: `File: ${n.title}` }),
                            }),
                            (0, At.jsx)("button", {
                              className: "btn",
                              onClick: () => r(!0),
                              children: "Edit diff\u2026",
                            }),
                          ],
                        })
                      : null,
                    n ? (0, At.jsx)(Hu, { oldText: n.oldText, newText: n.newText }) : null,
                    (0, At.jsx)("div", { className: "section-title", children: "Options" }),
                    (0, At.jsx)("div", {
                      style: { display: "flex", flexWrap: "wrap", gap: 10 },
                      children: (t.options ?? []).map((o) =>
                        (0, At.jsx)(
                          "button",
                          {
                            className: vN(o) ? "btn danger" : o.kind === "allow_always" ? "btn primary" : "btn",
                            onClick: () => {
                              e({ outcome: "selected", optionId: o.optionId, meta: yN(o) ? (a ?? void 0) : void 0 });
                            },
                            children: o.name || o.optionId,
                          },
                          o.optionId,
                        ),
                      ),
                    }),
                  ],
                }),
              ],
            }),
          }),
        }),
      }),
      i && n
        ? (0, At.jsx)(Xr, {
            title: n.title,
            oldText: n.oldText,
            newText: n.newText,
            onClose: () => r(!1),
            onConfirm: (o) => {
              (l({ ...n, newText: o }), r(!1));
            },
          })
        : null,
    ],
  });
}
var Ae = G(le(), 1);
function ju(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
function K1(t) {
  let e = t?.toolCall?.rawInput;
  if (!ju(e)) return null;
  let n = e.questions;
  return Array.isArray(n) ? n : null;
}
function J1(t) {
  if (!ju(t)) return !1;
  let e = t.header,
    n = t.question;
  return typeof e == "string" && e.trim().length > 0 && typeof n == "string" && n.trim().length > 0;
}
function Yu(t) {
  let e = K1(t);
  return !e || e.length === 0 ? !1 : J1(e[0]);
}
function bN(t) {
  return t === "text" || t === "yesno" || t === "choice" ? t : "choice";
}
function xN(t) {
  if (!Array.isArray(t)) return;
  let e = [];
  for (let n of t) {
    if (!ju(n)) continue;
    let l = n.label;
    if (typeof l != "string" || !l.trim()) continue;
    let i = n.description;
    e.push({ label: l, description: typeof i == "string" ? i : void 0 });
  }
  return e.length > 0 ? e : void 0;
}
function $1(t) {
  let e = K1(t);
  if (!e) return [];
  let n = [];
  for (let l of e) {
    if (!J1(l)) continue;
    let i = l,
      r = i.placeholder;
    n.push({
      header: String(i.header),
      question: String(i.question),
      type: bN(i.type),
      options: xN(i.options),
      multiSelect: i.multiSelect === !0,
      placeholder: typeof r == "string" ? r : void 0,
    });
  }
  return n;
}
function W1(t) {
  let e = t?.toolCall?.rawInput;
  if (!ju(e)) return null;
  let n = e.autoContinueAtMs,
    l = e.autoContinueMessage;
  return typeof n != "number" || !Number.isFinite(n) || typeof l != "string" || l.trim().length === 0
    ? null
    : { autoContinueAtMs: n, autoContinueMessage: l };
}
function tx(t) {
  return { gamecowork: { toolConfirmationPayload: { answers: { ...t } } } };
}
var ft = G(it(), 1);
var kN = [{ label: "Yes" }, { label: "No" }];
function SN(t, e, n) {
  if (t === void 0 || !e) return null;
  let l = Math.max(0, Math.ceil((t - n) / 1e3));
  return { message: e, remainingSeconds: l };
}
function wN(t) {
  if (t.type === "yesno") return new Set(["Yes"]);
  if (t.type !== "choice") return new Set();
  let e = t.options ?? [];
  if (t.multiSelect) return new Set(e.map((l) => l.label));
  let n = e[0]?.label;
  return n ? new Set([n]) : new Set();
}
function ex({ req: t, onSubmit: e, onCancel: n }) {
  let l = (0, Ae.useMemo)(() => $1(t), [t]),
    i = (0, Ae.useMemo)(() => W1(t), [t]),
    [r, a] = (0, Ae.useState)(() => Date.now()),
    [o, s] = (0, Ae.useState)(0),
    [u, f] = (0, Ae.useState)({}),
    [c, m] = (0, Ae.useState)(""),
    [d, g] = (0, Ae.useState)(new Set()),
    x = l.length,
    C = l[o],
    h = (0, Ae.useMemo)(() => SN(i?.autoContinueAtMs, i?.autoContinueMessage, r), [i, r]),
    p = (0, Ae.useMemo)(() => (C ? wN(C) : new Set()), [C]);
  (0, Ae.useEffect)(() => {
    if (i?.autoContinueAtMs === void 0) return;
    a(Date.now());
    let Z = setInterval(() => {
      a(Date.now());
    }, 1e3);
    return () => {
      clearInterval(Z);
    };
  }, [i?.autoContinueAtMs, i?.autoContinueMessage]);
  let y = (0, Ae.useCallback)(
      (Z) => {
        let L = { ...u },
          H = Z.trim();
        if ((H.length > 0 && (L[String(o)] = H), f(L), o + 1 >= x)) {
          e(L);
          return;
        }
        (s(o + 1), m(""), g(new Set()));
      },
      [u, e, o, x],
    ),
    T = (0, Ae.useCallback)(
      (Z) => {
        y(Z);
      },
      [y],
    ),
    N = (0, Ae.useCallback)((Z) => {
      g((L) => {
        let H = new Set(L);
        return (H.has(Z) ? H.delete(Z) : H.add(Z), H);
      });
    }, []),
    E = (0, Ae.useCallback)(() => {
      if (!C || C.type !== "choice") return;
      let Z = (C.options ?? []).map((L) => L.label).filter((L) => d.has(L));
      y(Z.join(", "));
    }, [y, C, d]),
    M = (0, Ae.useCallback)(() => {
      y(c);
    }, [y, c]);
  if (x === 0)
    return (0, ft.jsx)(Ee, {
      onClose: n,
      children: (0, ft.jsx)(Ce, {
        title: "Ask User",
        onClose: n,
        footer: (0, ft.jsx)("button", { className: "btn", onClick: n, children: "Cancel" }),
        children: (0, ft.jsx)("div", {
          className: "modal-body",
          style: { gridTemplateColumns: "1fr" },
          children: (0, ft.jsx)("div", {
            className: "modal-pane",
            children: (0, ft.jsx)("div", { className: "pane-title", children: "No questions provided." }),
          }),
        }),
      }),
    });
  if (!C) return null;
  let z = (Z) =>
      p.has(Z)
        ? (0, ft.jsx)("span", { className: "ask-user-default-badge", "aria-hidden": "true", children: "Default" })
        : null,
    F = () => {
      if (C.type === "yesno")
        return (0, ft.jsx)("div", {
          style: { display: "flex", gap: 10 },
          children: kN.map((L) =>
            (0, ft.jsxs)(
              "button",
              {
                className: `btn ask-user-option${p.has(L.label) ? " ask-user-option-default" : ""}`,
                onClick: () => T(L.label),
                children: [(0, ft.jsx)("span", { children: L.label }), z(L.label)],
              },
              L.label,
            ),
          ),
        });
      if (C.type === "text")
        return (0, ft.jsx)("div", {
          style: { display: "flex", flexDirection: "column", gap: 10 },
          children: (0, ft.jsx)("textarea", {
            value: c,
            placeholder: C.placeholder ?? "",
            onChange: (L) => m(L.target.value),
            style: { minHeight: 120 },
          }),
        });
      let Z = C.options ?? [];
      return C.multiSelect
        ? (0, ft.jsx)("div", {
            style: { display: "flex", flexDirection: "column", gap: 8 },
            children: Z.map((L) => {
              let H = p.has(L.label);
              return (0, ft.jsxs)(
                "label",
                {
                  className: `ask-user-option ask-user-option-checkbox${H ? " ask-user-option-default" : ""}`,
                  children: [
                    (0, ft.jsx)("input", {
                      type: "checkbox",
                      "aria-label": L.label,
                      checked: d.has(L.label),
                      onChange: () => N(L.label),
                    }),
                    (0, ft.jsxs)("span", {
                      children: [
                        (0, ft.jsx)("strong", { children: L.label }),
                        L.description
                          ? (0, ft.jsx)("span", { style: { marginLeft: 6, opacity: 0.75 }, children: L.description })
                          : null,
                      ],
                    }),
                    z(L.label),
                  ],
                },
                L.label,
              );
            }),
          })
        : (0, ft.jsx)("div", {
            style: { display: "flex", flexWrap: "wrap", gap: 8 },
            children: Z.map((L) =>
              (0, ft.jsxs)(
                "button",
                {
                  className: `btn ask-user-option${p.has(L.label) ? " ask-user-option-default" : ""}`,
                  onClick: () => T(L.label),
                  children: [(0, ft.jsx)("span", { children: L.label }), z(L.label)],
                },
                L.label,
              ),
            ),
          });
    },
    w = (0, ft.jsxs)(ft.Fragment, {
      children: [
        (0, ft.jsx)("button", { className: "btn", onClick: n, children: "Cancel" }),
        C.type === "text" ? (0, ft.jsx)("button", { className: "btn primary", onClick: M, children: "Submit" }) : null,
        C.type === "choice" && C.multiSelect
          ? (0, ft.jsx)("button", { className: "btn primary", onClick: E, children: "Done" })
          : null,
      ],
    });
  return (0, ft.jsx)(Ee, {
    onClose: n,
    children: (0, ft.jsx)(Ce, {
      title: `Ask User \xB7 ${C.header}`,
      onClose: n,
      footer: w,
      children: (0, ft.jsx)("div", {
        className: "modal-body",
        style: { gridTemplateColumns: "1fr" },
        children: (0, ft.jsxs)("div", {
          className: "modal-pane",
          children: [
            (0, ft.jsxs)("div", {
              style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px" },
              children: [
                (0, ft.jsx)("span", { className: "pill", children: (0, ft.jsx)("strong", { children: C.header }) }),
                (0, ft.jsxs)("span", { style: { opacity: 0.7, fontSize: 12 }, children: [o + 1, " / ", x] }),
              ],
            }),
            (0, ft.jsxs)("div", {
              style: { padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 12 },
              children: [
                (0, ft.jsx)("div", { className: "pane-title", children: C.question }),
                h
                  ? (0, ft.jsxs)("div", {
                      className: "ask-user-countdown",
                      role: "status",
                      "aria-label": "YOLO auto-continue countdown",
                      children: [
                        (0, ft.jsx)("div", {
                          className: "ask-user-countdown-label",
                          children: "Auto-selects defaults in",
                        }),
                        (0, ft.jsxs)("div", {
                          className: "ask-user-countdown-time",
                          children: [h.remainingSeconds, "s"],
                        }),
                        (0, ft.jsx)("div", { className: "ask-user-countdown-message", children: h.message }),
                      ],
                    })
                  : null,
                F(),
              ],
            }),
          ],
        }),
      }),
    }),
  });
}
var nx = G(le(), 1);
var xn = G(it(), 1);
function lx({ params: t, onDone: e }) {
  let [n, l] = (0, nx.useState)(t.defaultValue ?? "");
  return (0, xn.jsx)(Ee, {
    onClose: () => e({ outcome: "cancelled" }),
    children: (0, xn.jsx)(Ce, {
      title: t.title || "Input required",
      onClose: () => e({ outcome: "cancelled" }),
      footer: (0, xn.jsxs)(xn.Fragment, {
        children: [
          (0, xn.jsx)("button", { className: "btn", onClick: () => e({ outcome: "cancelled" }), children: "Cancel" }),
          (0, xn.jsx)("button", {
            className: "btn primary",
            onClick: () => e({ outcome: "submitted", text: n }),
            children: "Submit",
          }),
        ],
      }),
      children: (0, xn.jsx)("div", {
        className: "modal-body",
        style: { gridTemplateColumns: "1fr" },
        children: (0, xn.jsxs)("div", {
          className: "modal-pane",
          children: [
            (0, xn.jsx)("div", { className: "pane-title", children: t.prompt || "Please provide input:" }),
            (0, xn.jsx)("textarea", { value: n, onChange: (i) => l(i.target.value), style: { minHeight: 140 } }),
          ],
        }),
      }),
    }),
  });
}
var Wn = G(it(), 1);
function ix({ methods: t, onPick: e, onClose: n }) {
  return (0, Wn.jsx)(Ee, {
    onClose: n,
    children: (0, Wn.jsx)(Ce, {
      title: "Authenticate",
      onClose: n,
      footer: (0, Wn.jsx)("button", { className: "btn", onClick: n, children: "Cancel" }),
      children: (0, Wn.jsx)("div", {
        className: "modal-body",
        style: { gridTemplateColumns: "1fr" },
        children: (0, Wn.jsxs)("div", {
          className: "modal-pane",
          children: [
            (0, Wn.jsx)("div", { className: "pane-title", children: "Choose an auth method (stored by the CLI)" }),
            (0, Wn.jsx)("div", {
              style: { padding: "10px 12px", display: "flex", flexDirection: "column", gap: 10 },
              children: t.map((l) =>
                (0, Wn.jsx)(
                  "button",
                  { className: "btn primary", onClick: () => e(l), children: l.name || l.id },
                  l.id,
                ),
              ),
            }),
          ],
        }),
      }),
    }),
  });
}
var rx = G(le(), 1);
function ax(t, e = []) {
  (0, rx.useLayoutEffect)(() => {
    let n = t.current;
    n && ((n.style.height = "auto"), (n.style.height = `${Math.min(n.scrollHeight, 180)}px`));
  }, [t, ...e]);
}
var xt = G(le(), 1);
var TN = new Set(["extensions", "commands", "skills", "agents"]);
function EN(t) {
  return typeof t == "object" && t !== null;
}
function CN(t) {
  return !EN(t) ||
    typeof t.active != "boolean" ||
    typeof t.key != "string" ||
    t.key.length === 0 ||
    typeof t.title != "string" ||
    t.title.length === 0 ||
    !Array.isArray(t.kinds) ||
    !t.kinds.every((e) => typeof e == "string" && TN.has(e)) ||
    (t.message != null && (typeof t.message != "string" || t.message.length === 0)) ||
    (t.timestamp != null && (typeof t.timestamp != "string" || t.timestamp.length === 0))
    ? null
    : {
        active: t.active,
        key: t.key,
        kinds: t.kinds,
        title: t.title,
        ...(typeof t.message == "string" ? { message: t.message } : {}),
        ...(typeof t.timestamp == "string" ? { timestamp: t.timestamp } : {}),
      };
}
function Fu(t) {
  let e = CN(t);
  if (!e || !e.active) return null;
  let n = e.message?.trim();
  if (n) return n;
  let l = e.title.trim();
  return l.length > 0 ? l : null;
}
var Zr = class {
  constructor(e) {
    this.ws = e;
  }
  nextId = 0;
  pending = new Map();
  handlers = new Map();
  on(e, n) {
    this.handlers.set(e, n);
  }
  request(e, n) {
    let l = this.nextId++,
      i = { jsonrpc: "2.0", id: l, method: e, params: n };
    return (
      this.ws.send(JSON.stringify(i)),
      new Promise((r, a) => {
        let o = (u) => r(u),
          s = (u) => a(u);
        this.pending.set(l, { resolve: o, reject: s });
      })
    );
  }
  notify(e, n) {
    let l = { jsonrpc: "2.0", method: e, params: n };
    this.ws.send(JSON.stringify(l));
  }
  handleMessage(e) {
    if (!e || typeof e != "object") return;
    let n = e,
      l = "id" in n,
      i = "method" in n;
    if (l && !i) {
      let r = n.id;
      if (typeof r != "number") return;
      let a = this.pending.get(r);
      if (!a) return;
      (this.pending.delete(r), "result" in n ? a.resolve(n.result) : a.reject(n.error));
      return;
    }
    if (l && i) {
      let r = n.id,
        a = n.method;
      if (typeof r != "number" || typeof a != "string") return;
      let o = this.handlers.get(a);
      if (!o) {
        this.respondError(r, { code: -32601, message: `Method not found: ${a}` });
        return;
      }
      Promise.resolve()
        .then(() => o(n.params))
        .then((s) => this.respond(r, s ?? null))
        .catch((s) => this.respondError(r, { code: -32603, message: s instanceof Error ? s.message : String(s) }));
      return;
    }
    if (i) {
      let r = n.method;
      if (typeof r != "string") return;
      let a = this.handlers.get(r);
      a && Promise.resolve(a(n.params));
    }
  }
  respond(e, n) {
    let l = { jsonrpc: "2.0", id: e, result: n };
    this.ws.send(JSON.stringify(l));
  }
  respondError(e, n) {
    let l = { jsonrpc: "2.0", id: e, error: n };
    this.ws.send(JSON.stringify(l));
  }
};
function kn() {
  try {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}
function Ii(t) {
  return typeof t == "object" && t !== null;
}
function AN(t) {
  let e = t.toolCall?.rawInput;
  return typeof e == "object" && e !== null && e.hookTrust === !0;
}
function NN(t) {
  return AN(t) || Yu(t);
}
function RN(t) {
  let e =
    t.options.find((n) => n.kind === "allow_always") ?? t.options.find((n) => n.kind === "allow_once") ?? t.options[0];
  return e ? { outcome: { outcome: "selected", optionId: e.optionId } } : { outcome: { outcome: "cancelled" } };
}
function ox(t) {
  if (!Ii(t)) return !1;
  let e = t.code,
    n = t.message;
  return !!(e === -32002 || (typeof n == "string" && n.toLowerCase().includes("auth")));
}
function sx(t) {
  if (!Ii(t)) return !1;
  let e = t.kind;
  if (e === "message") {
    let n = t.message;
    return up(n);
  }
  return e === "tool" ? typeof t.toolCallId == "string" && t.toolCallId.length > 0 : !1;
}
function ux(t) {
  return Ii(t)
    ? typeof t.toolCallId == "string" &&
        typeof t.title == "string" &&
        typeof t.status == "string" &&
        typeof t.kind == "string"
    : !1;
}
function up(t) {
  if (!Ii(t)) return !1;
  let e = t.role,
    n = t.type,
    l = t.text;
  return (e === "user" || e === "assistant") && n === "text" && typeof l == "string";
}
function MN(t) {
  let e = {};
  if (
    t.sessionUpdate === "replace_history" &&
    (Array.isArray(t.feed) && (e.feed = t.feed.filter(sx)),
    Array.isArray(t.tools) && (e.tools = t.tools.filter(ux)),
    Array.isArray(t.messages) && (e.messages = t.messages.filter(up)),
    e.feed || e.tools || e.messages)
  )
    return e;
  let n = t?._meta;
  if (!Ii(n)) return null;
  let l = n.gamecowork;
  if (!Ii(l)) return null;
  let i = l.ui;
  if (!Ii(i) || i.action !== "replace_history") return null;
  let r = i.feed;
  Array.isArray(r) && (e.feed = r.filter(sx));
  let a = i.tools;
  Array.isArray(a) && (e.tools = a.filter(ux));
  let o = i.messages;
  return (Array.isArray(o) && (e.messages = o.filter(up)), !e.feed && !e.tools && !e.messages ? null : e);
}
function cx(t) {
  let [e, n] = (0, xt.useState)("connecting"),
    [l, i] = (0, xt.useState)(null),
    [r, a] = (0, xt.useState)("idle"),
    [o, s] = (0, xt.useState)({ open: !1, methods: [] }),
    [u, f] = (0, xt.useState)([]),
    [c, m] = (0, xt.useState)([]),
    [d, g] = (0, xt.useState)([]),
    [x, C] = (0, xt.useState)([]),
    [h, p] = (0, xt.useState)(null),
    [y, T] = (0, xt.useState)(null),
    [N, E] = (0, xt.useState)([]),
    [M, z] = (0, xt.useState)(null),
    F = (0, xt.useRef)(null),
    [w, Z] = (0, xt.useState)(!1),
    L = (0, xt.useRef)(null),
    H = (0, xt.useRef)(null),
    X = (0, xt.useRef)(!0),
    tt = (0, xt.useRef)(0),
    st = (0, xt.useRef)(null),
    Dt = e === "connected" ? (y ?? h) : (h ?? y),
    Ut = (0, xt.useCallback)((I, V) => {
      let Y = L.current;
      if (((L.current = null), (H.current = null), !!Y))
        try {
          Y.close(I, V);
        } catch {
          try {
            Y.close();
          } catch {}
        }
    }, []),
    U = (0, xt.useCallback)((I) => {
      g((V) => [...V, I]);
    }, []),
    k = (0, xt.useCallback)((I) => {
      let { role: V, type: Y, chunk: K } = I;
      if (!K) return;
      let et = V === "assistant" ? (st.current ?? void 0) : void 0;
      g((ot) => {
        let Et = ot.map((jt) =>
            jt.kind === "message" && !jt.message.completed && (jt.message.role !== V || jt.message.type !== Y)
              ? { ...jt, message: { ...jt.message, completed: !0 } }
              : jt,
          ),
          ye = Et[Et.length - 1];
        if (ye && ye.kind === "message" && ye.message.role === V && ye.message.type === Y && !ye.message.completed) {
          let jt = { kind: "message", message: { ...ye.message, text: (ye.message.text ?? "") + K } };
          return [...Et.slice(0, -1), jt];
        }
        let Vt = {
          kind: "message",
          message: {
            id: `${V}_${Y}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
            role: V,
            type: Y,
            time: kn(),
            text: K,
            completed: V === "user",
            ...(et !== void 0 ? { turnId: et } : {}),
          },
        };
        return [...Et, Vt];
      });
    }, []),
    Rt = (0, xt.useCallback)(() => {
      let I = st.current;
      I !== null &&
        (g((V) =>
          V.map((Y) =>
            Y.kind !== "message" || Y.message.role !== "assistant" || Y.message.turnId !== I || Y.message.completed
              ? Y
              : { ...Y, message: { ...Y.message, completed: !0 } },
          ),
        ),
        (st.current = null),
        Z(!1));
    }, []),
    _t = (0, xt.useCallback)(
      (I) => {
        let V = MN(I);
        if (V) {
          (V.tools ? C(V.tools) : C([]),
            V.feed
              ? g(
                  V.feed.map((Y) => {
                    if (Y.kind === "tool") return { kind: "tool", toolCallId: Y.toolCallId, time: kn() };
                    let K = Y.message;
                    return {
                      kind: "message",
                      message: {
                        id: `rehydrate_${K.role}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                        role: K.role,
                        type: "text",
                        time: kn(),
                        text: K.text,
                        completed: !0,
                        ...(typeof K.model == "string" && K.model ? { model: K.model } : {}),
                      },
                    };
                  }),
                )
              : V.messages
                ? g(
                    V.messages.map((Y) => ({
                      kind: "message",
                      message: {
                        id: `rehydrate_${Y.role}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                        role: Y.role,
                        type: "text",
                        time: kn(),
                        text: Y.text,
                        completed: !0,
                        ...(typeof Y.model == "string" && Y.model ? { model: Y.model } : {}),
                      },
                    })),
                  )
                : g([]),
            m([]),
            p(null),
            (st.current = null),
            Z(!1));
          return;
        }
        if (I.sessionUpdate === "available_commands_update") {
          f(I.availableCommands ?? []);
          return;
        }
        if (I.sessionUpdate === "plan") {
          m(I.entries ?? []);
          return;
        }
        if (I.sessionUpdate === "agent_message_chunk") {
          I.content?.type === "text" && k({ role: "assistant", type: "text", chunk: I.content.text ?? "" });
          return;
        }
        if (I.sessionUpdate === "agent_thought_chunk") {
          I.content?.type === "text" && k({ role: "assistant", type: "thought", chunk: I.content.text ?? "" });
          return;
        }
        if (I.sessionUpdate === "tool_call") {
          let Y = {
            toolCallId: I.toolCallId,
            title: I.title,
            status: I.status,
            kind: I.kind,
            content: I.content,
            rawInput: I.rawInput,
            locations: I.locations,
          };
          (C((K) => [...K, Y]),
            g((K) =>
              K.map((et) =>
                et.kind === "message" && !et.message.completed
                  ? { ...et, message: { ...et.message, completed: !0 } }
                  : et,
              ),
            ),
            U({ kind: "tool", toolCallId: Y.toolCallId, time: kn() }));
          return;
        }
        if (I.sessionUpdate === "tool_call_update") {
          (C((Y) =>
            Y.map((K) =>
              K.toolCallId === I.toolCallId
                ? {
                    ...K,
                    ...(I.title ? { title: I.title } : {}),
                    ...(I.status ? { status: I.status } : {}),
                    ...(I.kind ? { kind: I.kind } : {}),
                    ...(I.content ? { content: I.content } : {}),
                  }
                : K,
            ),
          ),
            (I.status === "completed" || I.status === "failed") &&
              E((Y) => {
                let K = Y.findIndex((Et) => Et.req.toolCall.toolCallId === I.toolCallId);
                if (K === -1) return Y;
                let et = [...Y],
                  [ot] = et.splice(K, 1);
                return (ot?.resolve({ outcome: { outcome: "cancelled" } }), et);
              }));
          return;
        }
      },
      [U, k],
    ),
    S = (0, xt.useCallback)(async () => {
      if (!X.current) return;
      (Ut(1e3, "reconnect"),
        (st.current = null),
        n("connecting"),
        i(null),
        a(t.resumeSessionId ? "resuming" : "idle"),
        p(null),
        T(null));
      let I = (() => {
          let K = location.protocol === "https:" ? "wss:" : "ws:",
            et = new URL(`${K}//${location.host}${t.wsPath || "/ws"}`);
          return (t.resumeSessionId && et.searchParams.set("resumeSession", t.resumeSessionId), et.toString());
        })(),
        V = new WebSocket(I);
      L.current = V;
      let Y = () => X.current && L.current === V;
      (V.addEventListener("open", async () => {
        if (!Y()) {
          try {
            V.close(1e3, "stale connection");
          } catch {}
          return;
        }
        n("connected");
        let K = new Zr(V);
        if (!Y()) {
          try {
            V.close(1e3, "stale connection");
          } catch {}
          return;
        }
        ((H.current = K),
          K.on("session/update", (et) => {
            let ot = et;
            return (ot && ot.update && _t(ot.update), null);
          }),
          K.on("gamecowork/external_load_diagnostics", (et) => (T(Fu(et)), null)),
          K.on("session/request_permission", (et) => {
            let ot = et;
            return t.yolo && !NN(ot)
              ? RN(ot)
              : new Promise((Et) => {
                  E((ye) => [...ye, { req: ot, resolve: Et }]);
                });
          }),
          K.on("_session/request_input", (et) => {
            let ot = et;
            return new Promise((Et) => {
              ((F.current = Et), z(ot));
            });
          }),
          V.addEventListener("message", (et) => {
            if (Y())
              try {
                let ot = JSON.parse(String(et.data));
                K.handleMessage(ot);
              } catch {}
          }));
        try {
          let et = await K.request("initialize", {
            protocolVersion: 1,
            clientCapabilities: { fs: { readTextFile: !1, writeTextFile: !1 }, terminal: !1 },
            clientInfo: { name: "gamecowork-web-ui", version: "0.0.0", title: "GameCowork Web UI" },
          });
          if (!Y()) return;
          let ot = et?.authMethods ?? [];
          s({ open: !1, methods: ot });
          try {
            let Et = await K.request("session/new", {
              cwd: t.cwd || "",
              mcpServers: [],
              ...(t.resumeSessionId ? { _meta: { gamecowork: { resumeSessionId: t.resumeSessionId } } } : {}),
            });
            if (!Y()) return;
            (i(Et.sessionId), a("ready"), p(null), T(null));
          } catch (Et) {
            if (!Y()) return;
            ox(Et)
              ? (s({ open: !0, methods: ot }), p("Authentication required."))
              : p(`Failed to create session: ${String(Et?.message ?? Et)}`);
          }
        } catch (et) {
          if (!Y()) return;
          p(`Failed to initialize ACP: ${String(et?.message ?? et)}`);
        }
      }),
        V.addEventListener("close", (K) => {
          let et = L.current === V;
          if ((et && ((L.current = null), (H.current = null)), !et || !X.current)) return;
          let ot = K,
            Et = [];
          (ot && typeof ot.code == "number" && Et.push(`code=${ot.code}`),
            ot && typeof ot.reason == "string" && ot.reason.trim() !== "" && Et.push(`reason=${ot.reason}`),
            ot && typeof ot.wasClean == "boolean" && Et.push(`clean=${ot.wasClean}`),
            n("disconnected"),
            i(null),
            a("idle"),
            p(Et.length > 0 ? `Disconnected (${Et.join(" ")})` : "Disconnected."));
        }),
        V.addEventListener("error", () => {
          let K = L.current === V;
          (K && ((L.current = null), (H.current = null)),
            !(!K || !X.current) && (n("disconnected"), i(null), a("idle"), p("Connection error.")));
        }));
    }, [Ut, t.cwd, t.resumeSessionId, t.wsPath, t.yolo, _t]),
    ut = (0, xt.useCallback)(
      async (I) => {
        let V = H.current;
        if (V)
          try {
            await V.request("authenticate", { methodId: I.id });
            let Y = await V.request("session/new", { cwd: t.cwd || "", mcpServers: [] });
            if (!X.current) return;
            (i(Y.sessionId), s((K) => ({ ...K, open: !1 })), p(null), T(null));
          } catch (Y) {
            if (!X.current) return;
            p(`Authentication failed: ${String(Y?.message ?? Y)}`);
          }
      },
      [t.cwd],
    ),
    pe = (0, xt.useCallback)(
      async (I) => {
        let V = H.current;
        if (!V || !l) {
          p("Not connected.");
          return;
        }
        let { displayText: Y, prompt: K } =
          typeof I == "string" ? { displayText: I, prompt: [{ type: "text", text: I }] } : I;
        (k({ role: "user", type: "text", chunk: Y }), (tt.current += 1), (st.current = tt.current), Z(!0));
        try {
          let et = await V.request("session/prompt", { sessionId: l, prompt: K });
          (Rt(), et?.stopReason === "cancelled" && p("Cancelled."));
        } catch (et) {
          if ((Rt(), ox(et))) {
            (i(null), s((ot) => ({ ...ot, open: !0 })), p("Authentication required."));
            return;
          }
          p(`Request failed: ${String(et?.message ?? et)}`);
        }
      },
      [k, Rt, l],
    ),
    he = (0, xt.useCallback)(() => {
      let I = H.current;
      if (!(!I || !l))
        try {
          I.notify("session/cancel", { sessionId: l });
        } catch {}
    }, [l]),
    Ne = (0, xt.useCallback)(
      async (I, V = 10) => {
        let Y = H.current;
        if (!Y || !l) return [];
        try {
          let K = await Y.request("_workspace/suggest_paths", { sessionId: l, pattern: I, maxResults: V });
          return Array.isArray(K?.paths) ? K.paths : [];
        } catch {
          return [];
        }
      },
      [l],
    ),
    gt = (0, xt.useCallback)(
      async (I, V = 10) => {
        let Y = H.current;
        if (!Y || !l) return [];
        try {
          let K = await Y.request("_slash/complete", { sessionId: l, line: I, maxResults: V });
          return Array.isArray(K?.items) ? K.items : [];
        } catch {
          return [];
        }
      },
      [l],
    ),
    se = N[0]?.req ?? null,
    Xt = (0, xt.useCallback)((I) => {
      E((V) => {
        let Y = V[0];
        return Y ? (Y.resolve(I), V.slice(1)) : V;
      });
    }, []),
    ge = (0, xt.useCallback)((I) => {
      let V = F.current;
      ((F.current = null), z(null), V && V(I));
    }, []);
  return (
    (0, xt.useEffect)(() => {
      ((X.current = !0), (t.autoConnect ?? !0) && S());
      let I = () => {
        ((X.current = !1), Ut(1001, "page unload"));
      };
      return (
        window.addEventListener("pagehide", I),
        window.addEventListener("beforeunload", I),
        () => {
          ((X.current = !1),
            window.removeEventListener("pagehide", I),
            window.removeEventListener("beforeunload", I),
            Ut(1001, "component unmount"));
        }
      );
    }, []),
    {
      connection: e,
      sessionId: l,
      sessionPhase: r,
      statusText: Dt,
      auth: o,
      availableCommands: u,
      planEntries: c,
      feed: d,
      tools: x,
      connect: S,
      sendPrompt: pe,
      cancel: he,
      suggestPaths: Ne,
      completeSlashCommand: gt,
      authenticate: ut,
      permissionReq: se,
      resolvePermission: Xt,
      inputReq: M,
      resolveInput: ge,
      isBusy: w,
    }
  );
}
var dt = G(le(), 1);
function DN(t) {
  return t ? (t.endsWith("/") ? t.slice(0, -1) : t) : "/__gamecowork__/control-plane";
}
async function ii(t, e) {
  let n = await fetch(t, { ...e, headers: { "content-type": "application/json", ...(e?.headers ?? {}) } }),
    l = await n.text(),
    i = l ? JSON.parse(l) : null;
  if (!n.ok) {
    let r = typeof i?.error == "string" ? i.error : `${n.status} ${n.statusText}`;
    throw new Error(r);
  }
  return i;
}
function fx(t) {
  let e = DN(t);
  return {
    list: async () => (await ii(`${e}/registry`)).endpoints,
    getById: async (n) => (await ii(`${e}/registry/${encodeURIComponent(n)}`)).endpoint,
    create: async (n) => (await ii(`${e}/registry`, { method: "POST", body: JSON.stringify(n) })).endpoint,
    update: async (n, l) =>
      (await ii(`${e}/registry/${encodeURIComponent(n)}`, { method: "PUT", body: JSON.stringify(l) })).endpoint,
    remove: async (n) => {
      await ii(`${e}/registry/${encodeURIComponent(n)}`, { method: "DELETE" });
    },
    health: async (n) => ii(`${e}/health?endpointId=${encodeURIComponent(n)}`),
    getRawRegistryJson: async () => (await ii(`${e}/registry/raw`)).json,
    saveRawRegistryJson: async (n) => {
      await ii(`${e}/registry/raw`, { method: "PUT", body: JSON.stringify({ json: n }) });
    },
  };
}
var ri = G(le(), 1);
var tn = G(it(), 1);
function _N(t) {
  return t.trim()
    ? t
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e.length > 0)
    : [];
}
var dx = ({ open: t, endpoint: e, onClose: n, onSave: l }) => {
  let [i, r] = (0, ri.useState)(""),
    [a, o] = (0, ri.useState)(""),
    [s, u] = (0, ri.useState)(""),
    [f, c] = (0, ri.useState)(null),
    [m, d] = (0, ri.useState)(!1);
  if (
    ((0, ri.useEffect)(() => {
      t && (r(e?.name ?? ""), o(e?.baseUrl ?? ""), u((e?.tags ?? []).join(", ")), c(null), d(!1));
    }, [e, t]),
    !t)
  )
    return null;
  let g = async () => {
    if (!i.trim() || !a.trim()) {
      c("Name and base URL are required.");
      return;
    }
    (d(!0), c(null));
    try {
      (await l({ name: i.trim(), baseUrl: a.trim(), tags: _N(s) }), n());
    } catch (x) {
      c(x instanceof Error ? x.message : "Save failed");
    } finally {
      d(!1);
    }
  };
  return (0, tn.jsx)(Ee, {
    onClose: n,
    children: (0, tn.jsx)(Ce, {
      title: e ? "Edit endpoint" : "Add endpoint",
      onClose: n,
      footer: (0, tn.jsxs)("div", {
        className: "cp-modal-actions",
        children: [
          (0, tn.jsx)("button", { className: "btn", onClick: n, disabled: m, children: "Cancel" }),
          (0, tn.jsx)("button", {
            className: "btn primary",
            onClick: () => void g(),
            disabled: m,
            children: m ? "Saving\u2026" : "Save",
          }),
        ],
      }),
      children: (0, tn.jsxs)("div", {
        className: "cp-modal-body",
        children: [
          (0, tn.jsxs)("label", {
            className: "cp-label",
            children: [
              "Name",
              (0, tn.jsx)("input", {
                className: "cp-input",
                value: i,
                onChange: (x) => r(x.target.value),
                placeholder: "e.g. Mac Mini - local",
              }),
            ],
          }),
          (0, tn.jsxs)("label", {
            className: "cp-label",
            children: [
              "Base URL",
              (0, tn.jsx)("input", {
                className: "cp-input",
                value: a,
                onChange: (x) => o(x.target.value),
                placeholder: "http://127.0.0.1:3939",
              }),
            ],
          }),
          (0, tn.jsxs)("label", {
            className: "cp-label",
            children: [
              "Tags (comma-separated)",
              (0, tn.jsx)("input", {
                className: "cp-input",
                value: s,
                onChange: (x) => u(x.target.value),
                placeholder: "local, gpu, staging",
              }),
            ],
          }),
          f ? (0, tn.jsx)("div", { className: "cp-error", children: f }) : null,
        ],
      }),
    }),
  });
};
var ai = G(le(), 1);
var ze = G(it(), 1);
function mx(t) {
  let e = t.split(/\r?\n/),
    n = [],
    l = [];
  for (let i = 0; i < e.length; i += 1) {
    let r = e[i]?.trim() ?? "";
    if (!r) continue;
    let a = r.split(",").map((f) => f.trim());
    if (a.length > 3) {
      l.push(`Line ${i + 1}: expected "url[, name[, tag]]"`);
      continue;
    }
    let o = a[0] ?? "";
    if (!o) {
      l.push(`Line ${i + 1}: missing endpoint url`);
      continue;
    }
    let s = a[1]?.trim() || o,
      u = a[2]?.trim() || o;
    n.push({ name: s, baseUrl: o, tags: u ? [u] : [] });
  }
  return l.length > 0
    ? {
        ok: !1,
        error: l.join(`
`),
      }
    : n.length === 0
      ? { ok: !1, error: "No endpoints found." }
      : { ok: !0, inputs: n };
}
var px = ({ open: t, onClose: e, onSubmit: n }) => {
  let [l, i] = (0, ai.useState)(""),
    [r, a] = (0, ai.useState)(null),
    [o, s] = (0, ai.useState)(!1);
  (0, ai.useEffect)(() => {
    t && (i(""), a(null), s(!1));
  }, [t]);
  let u = (0, ai.useMemo)(() => mx(l), [l]);
  if (!t) return null;
  let f = async () => {
    let c = mx(l);
    if (!c.ok) {
      a(c.error);
      return;
    }
    (s(!0), a(null));
    try {
      (await n(c.inputs), e());
    } catch (m) {
      a(m instanceof Error ? m.message : "Batch add failed");
    } finally {
      s(!1);
    }
  };
  return (0, ze.jsx)(Ee, {
    onClose: e,
    children: (0, ze.jsx)(Ce, {
      title: "Batch add endpoints",
      onClose: e,
      footer: (0, ze.jsxs)("div", {
        className: "cp-modal-actions",
        children: [
          (0, ze.jsx)("button", { className: "btn", onClick: e, disabled: o, children: "Cancel" }),
          (0, ze.jsx)("button", {
            className: "btn primary",
            onClick: () => void f(),
            disabled: o,
            children: o ? "Adding\u2026" : "Add",
          }),
        ],
      }),
      children: (0, ze.jsxs)("div", {
        className: "cp-modal-body",
        children: [
          (0, ze.jsxs)("div", {
            className: "cp-muted",
            style: { marginBottom: 8 },
            children: [
              "One entry per line (empty lines allowed):",
              (0, ze.jsx)("br", {}),
              (0, ze.jsx)("code", { children: "url[, name[, tag]]" }),
              (0, ze.jsx)("br", {}),
              "If only ",
              (0, ze.jsx)("code", { children: "url" }),
              " is provided, ",
              (0, ze.jsx)("code", { children: "name" }),
              " and",
              " ",
              (0, ze.jsx)("code", { children: "tag" }),
              " default to the same url.",
            ],
          }),
          (0, ze.jsx)("textarea", {
            className: "cp-textarea",
            placeholder: `http://127.0.0.1:3939, Local, local
http://127.0.0.1:3940`,
            value: l,
            onChange: (c) => i(c.target.value),
            rows: 8,
          }),
          u.ok
            ? (0, ze.jsxs)("div", {
                className: "cp-muted",
                style: { marginTop: 8 },
                children: ["Parsed ", u.inputs.length, " endpoint(s)"],
              })
            : null,
          r ? (0, ze.jsx)("div", { className: "cp-error", style: { whiteSpace: "pre-wrap" }, children: r }) : null,
        ],
      }),
    }),
  });
};
var te = G(it(), 1);
function ON(t) {
  return t === void 0
    ? (0, te.jsx)("span", { className: "cp-health unknown", children: "Unknown" })
    : t === null
      ? (0, te.jsx)("span", { className: "cp-health pending", children: "Checking\u2026" })
      : t.ok
        ? (0, te.jsxs)("span", {
            className: "cp-health ok",
            children: ["Healthy ", (0, te.jsxs)("span", { className: "cp-health-ms", children: [t.durationMs, "ms"] })],
          })
        : (0, te.jsxs)("span", {
            className: "cp-health err",
            children: ["Unhealthy ", t.error ? `\xB7 ${t.error}` : ""],
          });
}
var cp = ({
  endpoints: t,
  healthById: e,
  onEdit: n,
  onDelete: l,
  onRefreshHealth: i,
  selectedIds: r,
  onToggleSelect: a,
}) =>
  t.length === 0
    ? (0, te.jsx)("div", { className: "cp-empty", children: "No endpoints registered yet." })
    : (0, te.jsx)("div", {
        className: "cp-list",
        children: t.map((o) =>
          (0, te.jsxs)(
            "div",
            {
              className: "cp-row",
              children: [
                (0, te.jsx)("div", {
                  className: "cp-select-box",
                  children: (0, te.jsx)("input", {
                    type: "checkbox",
                    checked: r?.has(o.id) ?? !1,
                    onChange: (s) => a?.(o.id, s.target.checked),
                  }),
                }),
                (0, te.jsxs)("div", {
                  className: "cp-row-main",
                  children: [
                    (0, te.jsxs)("div", {
                      className: "cp-row-title",
                      children: [
                        (0, te.jsx)("span", { className: "cp-name", children: o.name }),
                        (0, te.jsx)("span", { className: "cp-url", children: o.baseUrl }),
                      ],
                    }),
                    (0, te.jsxs)("div", {
                      className: "cp-row-meta",
                      children: [
                        ON(e[o.id]),
                        (0, te.jsx)("div", {
                          className: "cp-tags",
                          children:
                            o.tags.length === 0
                              ? (0, te.jsx)("span", { className: "cp-tag muted", children: "no tags" })
                              : o.tags.map((s) => (0, te.jsx)("span", { className: "cp-tag", children: s }, s)),
                        }),
                      ],
                    }),
                  ],
                }),
                (0, te.jsxs)("div", {
                  className: "cp-actions",
                  children: [
                    (0, te.jsx)("button", { className: "btn", onClick: () => i(o), children: "Health" }),
                    (0, te.jsx)("button", { className: "btn", onClick: () => n(o), children: "Edit" }),
                    (0, te.jsx)("button", { className: "btn danger", onClick: () => l(o), children: "Delete" }),
                  ],
                }),
              ],
            },
            o.id,
          ),
        ),
      });
var hx = G(le(), 1);
var Kr = G(le(), 1);
var ji = G(it(), 1);
var Jr = ({ feed: t, tools: e, onOpenDiff: n }) => {
  let l = (0, Kr.useRef)(null),
    i = (0, Kr.useMemo)(() => {
      let r = new Map();
      for (let a of e) r.set(a.toolCallId, a);
      return r;
    }, [e]);
  return (
    (0, Kr.useEffect)(() => {
      l.current && (l.current.scrollTop = l.current.scrollHeight);
    }, [t]),
    (0, ji.jsx)("div", {
      className: "cp-task-body",
      ref: l,
      children:
        t.length === 0
          ? (0, ji.jsx)("div", { className: "cp-empty", children: "No activity yet." })
          : t.map((r) => {
              if (r.kind === "message")
                return (0, ji.jsx)(
                  "div",
                  { className: "cp-task-message", children: (0, ji.jsx)(Bu, { message: r.message }) },
                  r.message.id,
                );
              let a = i.get(r.toolCallId);
              return a
                ? (0, ji.jsx)(
                    "div",
                    {
                      className: "cp-task-tool",
                      children: (0, ji.jsx)(qu, {
                        tool: a,
                        onOpenDiff: (o) => n({ title: o.title, oldText: o.oldText, newText: o.newText }),
                      }),
                    },
                    r.toolCallId,
                  )
                : null;
            }),
    })
  );
};
var Nt = G(it(), 1);
var fp = ({
  state: t,
  selected: e,
  onSelect: n,
  onClick: l,
  onForceCancel: i,
  onForceRefresh: r,
  onRetry: a,
  onSendPrompt: o,
  onOpenDiff: s,
  compact: u = !1,
  hideInput: f = !1,
}) => {
  let [c, m] = (0, hx.useState)(""),
    d = t.connection === "connected" ? (t.isBusy ? "busy" : "idle") : "disconnected",
    g = t.connection === "disconnected" || t.lastError !== null,
    x = () => {
      if (t.connection !== "connected") return;
      let p = c.trim();
      p && (o(t.endpoint.id, p), m(""));
    },
    C = (p) => {
      p.key === "Enter" && p.ctrlKey && (p.preventDefault(), x());
    };
  if (u) {
    let p = "";
    if (t.connection === "connected" && t.statusText) p = t.statusText;
    else {
      let y = t.feed[t.feed.length - 1];
      y && (y.kind === "message" ? (p = y.message.text) : (p = `Tool: ${y.toolCallId}`));
    }
    return (0, Nt.jsxs)("div", {
      className: `cp-task-card-compact${g ? " error" : ""}`,
      onClick: () => l(t.endpoint.id),
      children: [
        (0, Nt.jsxs)("div", {
          className: "cp-task-card-compact-body",
          children: [
            (0, Nt.jsxs)("div", {
              className: "cp-task-card-compact-top",
              children: [
                (0, Nt.jsx)("span", { className: "cp-task-card-compact-name", children: t.endpoint.name }),
                (0, Nt.jsx)("span", { className: `cp-conn ${t.connection}`, children: d }),
              ],
            }),
            (0, Nt.jsxs)("div", {
              className: "cp-task-card-compact-meta",
              children: [
                t.queuedCount > 0 && (0, Nt.jsxs)("span", { children: ["queue ", t.queuedCount] }),
                t.lastActivityAt && (0, Nt.jsx)("span", { children: new Date(t.lastActivityAt).toLocaleTimeString() }),
              ],
            }),
            p && (0, Nt.jsx)("div", { className: "cp-task-card-compact-preview", children: p }),
          ],
        }),
        (0, Nt.jsx)("span", { className: "cp-task-card-compact-chevron", children: "\u203A" }),
      ],
    });
  }
  let h = ["cp-task-card", e ? "selected" : "", g ? "error" : ""].filter(Boolean).join(" ");
  return (0, Nt.jsxs)("div", {
    className: h,
    onClick: () => l(t.endpoint.id),
    children: [
      (0, Nt.jsxs)("div", {
        className: "cp-task-header",
        children: [
          (0, Nt.jsx)("div", {
            className: "cp-task-header-top",
            children: (0, Nt.jsxs)("div", {
              className: "cp-task-header-left",
              children: [
                (0, Nt.jsx)("input", {
                  type: "checkbox",
                  checked: e,
                  onClick: (p) => p.stopPropagation(),
                  onChange: (p) => n(t.endpoint.id, p.target.checked),
                  style: { width: 16, height: 16, cursor: "pointer" },
                }),
                (0, Nt.jsxs)("div", {
                  className: "cp-task-header-info",
                  children: [
                    (0, Nt.jsx)("div", { className: "cp-task-name", children: t.endpoint.name }),
                    (0, Nt.jsx)("a", {
                      className: "cp-task-url",
                      href: t.endpoint.baseUrl,
                      target: "_blank",
                      rel: "noreferrer noopener",
                      title: "Open in new tab",
                      onClick: (p) => p.stopPropagation(),
                      children: t.endpoint.baseUrl,
                    }),
                  ],
                }),
              ],
            }),
          }),
          (0, Nt.jsxs)("div", {
            className: "cp-task-actions-row",
            children: [
              (0, Nt.jsxs)("div", {
                className: "cp-task-actions",
                children: [
                  (0, Nt.jsx)("button", {
                    className: "btn danger",
                    onClick: (p) => {
                      (p.stopPropagation(), i(t.endpoint.id));
                    },
                    children: "Cancel",
                  }),
                  (0, Nt.jsx)("button", {
                    className: "btn",
                    onClick: (p) => {
                      (p.stopPropagation(), r(t.endpoint.id));
                    },
                    children: "Refresh",
                  }),
                  t.lastFailed
                    ? (0, Nt.jsx)("button", {
                        className: "btn",
                        onClick: (p) => {
                          (p.stopPropagation(), a(t.endpoint.id));
                        },
                        children: "Retry",
                      })
                    : null,
                ],
              }),
              (0, Nt.jsxs)("div", {
                className: "cp-task-meta",
                children: [
                  (0, Nt.jsx)("span", { className: `cp-conn ${t.connection}`, children: d }),
                  (0, Nt.jsxs)("span", { className: "cp-queue", children: ["queue ", t.queuedCount] }),
                  t.lastActivityAt
                    ? (0, Nt.jsx)("span", {
                        className: "cp-activity",
                        children: new Date(t.lastActivityAt).toLocaleTimeString(),
                      })
                    : null,
                ],
              }),
            ],
          }),
        ],
      }),
      t.connection === "connected" && t.statusText
        ? (0, Nt.jsx)("div", { className: "cp-task-notice", children: t.statusText })
        : null,
      t.lastError ? (0, Nt.jsxs)("div", { className: "cp-task-error", children: ["Last error: ", t.lastError] }) : null,
      (0, Nt.jsx)(Jr, { feed: t.feed, tools: t.tools, onOpenDiff: s }),
      !f &&
        (0, Nt.jsx)("div", {
          className: "cp-task-input",
          onClick: (p) => p.stopPropagation(),
          children: (0, Nt.jsx)(ni, {
            value: c,
            textareaClassName: "cp-task-textarea",
            placeholder: "Send prompt...",
            onChange: (p) => m(p.target.value),
            onKeyDown: C,
            onSubmit: x,
            submitClassName: "btn primary",
            submitDisabled: !c.trim() || t.connection !== "connected",
            submitLabel: "Send",
          }),
        }),
    ],
  });
};
var Yi = G(le(), 1);
var tl = G(it(), 1);
var gx = ({ open: t, onClose: e, onLoad: n, onSave: l }) => {
  let [i, r] = (0, Yi.useState)(""),
    [a, o] = (0, Yi.useState)(!1),
    [s, u] = (0, Yi.useState)(!1),
    [f, c] = (0, Yi.useState)(null);
  if (
    ((0, Yi.useEffect)(() => {
      t &&
        (o(!0),
        u(!1),
        c(null),
        (async () => {
          try {
            let d = await n();
            r(d);
          } catch (d) {
            c(d instanceof Error ? d.message : "Failed to load JSON");
          } finally {
            o(!1);
          }
        })());
    }, [n, t]),
    !t)
  )
    return null;
  let m = async () => {
    (u(!0), c(null));
    try {
      (await l(i), e());
    } catch (d) {
      c(d instanceof Error ? d.message : "Save failed");
    } finally {
      u(!1);
    }
  };
  return (0, tl.jsx)(Ee, {
    onClose: e,
    children: (0, tl.jsx)(Ce, {
      title: "Edit registry JSON",
      onClose: e,
      footer: (0, tl.jsxs)("div", {
        className: "cp-modal-actions",
        children: [
          (0, tl.jsx)("button", { className: "btn", onClick: e, disabled: s || a, children: "Cancel" }),
          (0, tl.jsx)("button", {
            className: "btn primary",
            onClick: () => void m(),
            disabled: s || a,
            children: s ? "Saving\u2026" : "Save",
          }),
        ],
      }),
      children: (0, tl.jsxs)("div", {
        className: "cp-modal-body",
        children: [
          (0, tl.jsx)("textarea", {
            className: "cp-textarea",
            value: i,
            onChange: (d) => r(d.target.value),
            rows: 12,
            placeholder: a ? "Loading\u2026" : "",
            disabled: a,
          }),
          f ? (0, tl.jsx)("div", { className: "cp-error", style: { whiteSpace: "pre-wrap" }, children: f }) : null,
        ],
      }),
    }),
  });
};
var Pe = G(le(), 1);
function $r(t) {
  return typeof t == "object" && t !== null;
}
function yx(t) {
  return $r(t)
    ? typeof t.toolCallId == "string" &&
        typeof t.title == "string" &&
        typeof t.status == "string" &&
        typeof t.kind == "string"
    : !1;
}
function dp(t) {
  if (!$r(t)) return !1;
  let e = t.role,
    n = t.type,
    l = t.text;
  return (e === "user" || e === "assistant") && n === "text" && typeof l == "string";
}
function vx(t) {
  if (!$r(t)) return !1;
  let e = t.kind;
  if (e === "message") {
    let n = t.message;
    return dp(n);
  }
  return e === "tool" ? typeof t.toolCallId == "string" && t.toolCallId.length > 0 : !1;
}
function zN(t) {
  let e = {};
  if (
    t.sessionUpdate === "replace_history" &&
    (Array.isArray(t.feed) && (e.feed = t.feed.filter(vx)),
    Array.isArray(t.tools) && (e.tools = t.tools.filter(yx)),
    Array.isArray(t.messages) && (e.messages = t.messages.filter(dp)),
    e.feed || e.tools || e.messages)
  )
    return e;
  let n = t?._meta;
  if (!$r(n)) return null;
  let l = n.gamecowork;
  if (!$r(l)) return null;
  let i = l.ui;
  if (!$r(i) || i.action !== "replace_history") return null;
  let r = i.feed;
  Array.isArray(r) && (e.feed = r.filter(vx));
  let a = i.tools;
  Array.isArray(a) && (e.tools = a.filter(yx));
  let o = i.messages;
  return (Array.isArray(o) && (e.messages = o.filter(dp)), !e.feed && !e.tools && !e.messages ? null : e);
}
function LN(t) {
  let e = t.toolCall?.rawInput;
  return typeof e == "object" && e !== null && e.hookTrust === !0;
}
function UN(t) {
  if (LN(t)) return { outcome: { outcome: "cancelled" } };
  let e =
    t.options.find((n) => n.kind === "allow_always") ?? t.options.find((n) => n.kind === "allow_once") ?? t.options[0];
  return e ? { outcome: { outcome: "selected", optionId: e.optionId } } : { outcome: { outcome: "cancelled" } };
}
var Vu = class {
  constructor(e, n) {
    this.wsUrl = e;
    this.onStateChange = n;
  }
  ws = null;
  rpc = null;
  sessionId = null;
  reconnectTimer = null;
  reconnectAttempts = 0;
  disposed = !1;
  currentTurnId = 0;
  activeTurnId = null;
  sessionReadyPromise = null;
  sessionReadyResolve = null;
  sessionReadyReject = null;
  baseStatusText = null;
  externalStatusText = null;
  streamingToolCallIds = new Map();
  state = {
    connection: "disconnected",
    sessionId: null,
    statusText: null,
    feed: [],
    tools: [],
    isBusy: !1,
    lastActivityAt: null,
  };
  connect() {
    if (this.disposed || (this.ws && this.ws.readyState <= WebSocket.OPEN)) return;
    (this.clearReconnect(),
      this.resetSessionReadyPromise(),
      (this.externalStatusText = null),
      this.updateState({ connection: "connecting", sessionId: null, statusText: null }));
    let e = new WebSocket(this.wsUrl);
    ((this.ws = e),
      e.addEventListener("open", () => {
        if (this.ws !== e || this.disposed) return;
        ((this.reconnectAttempts = 0), this.updateState({ connection: "connected" }));
        let n = new Zr(e);
        ((this.rpc = n),
          n.on("session/update", (l) => {
            let i = l;
            return (i?.update && this.onSessionUpdate(i.update), null);
          }),
          n.on("gamecowork/external_load_diagnostics", (l) => (this.setExternalStatusText(Fu(l)), null)),
          n.on("session/request_permission", (l) => UN(l)),
          n.on("_session/request_input", () => ({ outcome: "cancelled" })),
          e.addEventListener("message", (l) => {
            if (!(this.ws !== e || this.disposed))
              try {
                let i = JSON.parse(String(l.data));
                n.handleMessage(i);
              } catch {}
          }),
          this.bootstrap(n));
      }),
      e.addEventListener("close", () => {
        this.ws === e &&
          ((this.rpc = null),
          (this.sessionId = null),
          (this.activeTurnId = null),
          (this.ws = null),
          this.sessionReadyReject?.(new Error("Disconnected")),
          this.clearSessionReadyHandlers(),
          this.updateState({ connection: "disconnected", sessionId: null, statusText: "Disconnected.", isBusy: !1 }),
          this.scheduleReconnect());
      }),
      e.addEventListener("error", () => {
        this.ws === e &&
          ((this.rpc = null),
          (this.sessionId = null),
          (this.activeTurnId = null),
          (this.ws = null),
          this.sessionReadyReject?.(new Error("Connection error")),
          this.clearSessionReadyHandlers(),
          this.updateState({
            connection: "disconnected",
            sessionId: null,
            statusText: "Connection error.",
            isBusy: !1,
          }),
          this.scheduleReconnect());
      }));
  }
  dispose() {
    ((this.disposed = !0), this.clearReconnect(), this.closeWs("dispose"));
  }
  forceClose() {
    this.closeWs("force");
  }
  forceRefresh() {
    if (this.disposed) return;
    (this.clearReconnect(),
      (this.externalStatusText = null),
      (this.currentTurnId = 0),
      (this.activeTurnId = null),
      this.streamingToolCallIds.clear(),
      this.updateState({ feed: [], tools: [], isBusy: !1, lastActivityAt: null, statusText: "Refreshing\u2026" }));
    let e = this.ws;
    if (
      ((this.ws = null),
      (this.rpc = null),
      (this.sessionId = null),
      this.sessionReadyReject?.(new Error("Refreshed")),
      this.clearSessionReadyHandlers(),
      e)
    )
      try {
        e.close();
      } catch {}
    this.connect();
  }
  cancel() {
    let e = this.rpc;
    if (!(!e || !this.sessionId))
      try {
        e.notify("session/cancel", { sessionId: this.sessionId });
      } catch {}
  }
  async sendPrompt(e) {
    (!this.rpc || !this.ws || !this.sessionId) && (this.connect(), await this.waitForSessionReady(3e4));
    let n = this.rpc;
    if (!n || !this.ws || !this.sessionId)
      throw (this.updateState({ statusText: "Not connected." }), new Error("Not connected"));
    if (this.state.isBusy) throw (this.updateState({ statusText: "Session busy." }), new Error("Session busy"));
    let l = this.ws;
    (this.appendChunkToFeed({ role: "user", type: "text", chunk: e }),
      (this.currentTurnId += 1),
      (this.activeTurnId = this.currentTurnId),
      this.updateState({ isBusy: !0 }),
      this.touchActivity());
    let i = null,
      r = new Promise((a, o) => {
        ((i = () => o(new Error("Connection closed"))), l.addEventListener("close", i), l.addEventListener("error", i));
      });
    try {
      let a = await Promise.race([
        n.request("session/prompt", { sessionId: this.sessionId, prompt: [{ type: "text", text: e }] }),
        r,
      ]);
      (this.markAssistantCompleted(), a?.stopReason === "cancelled" && this.updateState({ statusText: "Cancelled." }));
    } catch (a) {
      throw (
        this.markAssistantCompleted(),
        this.updateState({ statusText: `Request failed: ${String(a?.message ?? a)}` }),
        a
      );
    } finally {
      i && (l.removeEventListener("close", i), l.removeEventListener("error", i));
    }
  }
  getState() {
    return this.state;
  }
  async bootstrap(e) {
    try {
      (
        (
          await e.request("initialize", {
            protocolVersion: 1,
            clientCapabilities: { fs: { readTextFile: !1, writeTextFile: !1 }, terminal: !1 },
            clientInfo: { name: "gamecowork-control-plane", version: "0.0.0", title: "GameCowork Control Plane" },
          })
        )?.authMethods ?? []
      ).length > 0 && this.updateState({ statusText: "Authentication required (unsupported)." });
      let i = await e.request("session/new", { cwd: "", mcpServers: [] });
      ((this.sessionId = i.sessionId),
        this.updateState({ sessionId: i.sessionId, statusText: null }),
        this.touchActivity(),
        this.sessionReadyResolve?.(),
        this.clearSessionReadyHandlers());
    } catch (n) {
      (this.updateState({ statusText: `Failed to initialize ACP: ${String(n?.message ?? n)}` }),
        this.sessionReadyReject?.(n instanceof Error ? n : new Error(String(n))),
        this.clearSessionReadyHandlers(),
        this.closeWs("bootstrap failed"));
    }
  }
  closeWs(e) {
    if (this.ws)
      try {
        this.ws.readyState <= WebSocket.OPEN && this.ws.close();
      } catch {}
    ((this.ws = null),
      (this.rpc = null),
      (this.sessionId = null),
      this.sessionReadyReject?.(new Error(e ?? "closed")),
      this.clearSessionReadyHandlers(),
      e &&
        this.updateState({
          connection: "disconnected",
          sessionId: null,
          statusText: e === "force" ? "Force cancelled." : this.state.statusText,
          isBusy: !1,
        }));
  }
  resetSessionReadyPromise() {
    (this.sessionReadyReject?.(new Error("Replaced by new connection")),
      this.clearSessionReadyHandlers(),
      (this.sessionReadyPromise = new Promise((e, n) => {
        ((this.sessionReadyResolve = e), (this.sessionReadyReject = n));
      })));
  }
  clearSessionReadyHandlers() {
    ((this.sessionReadyResolve = null), (this.sessionReadyReject = null));
  }
  async waitForSessionReady(e) {
    let n = this.sessionReadyPromise;
    if (!n) throw new Error("Not connected");
    let l = null,
      i = new Promise((r, a) => {
        l = window.setTimeout(() => {
          a(new Error("Session not ready"));
        }, e);
      });
    try {
      await Promise.race([n, i]);
    } finally {
      l !== null && clearTimeout(l);
    }
  }
  scheduleReconnect() {
    if (this.disposed || this.reconnectTimer !== null) return;
    let e = Math.min(1e3 * 2 ** this.reconnectAttempts, 5e3);
    ((this.reconnectAttempts += 1),
      (this.reconnectTimer = window.setTimeout(() => {
        ((this.reconnectTimer = null), this.connect());
      }, e)));
  }
  clearReconnect() {
    this.reconnectTimer !== null && (clearTimeout(this.reconnectTimer), (this.reconnectTimer = null));
  }
  updateState(e) {
    Object.hasOwn(e, "statusText") && (this.baseStatusText = e.statusText ?? null);
    let n = e.connection ?? this.state.connection;
    ((this.state = { ...this.state, ...e, statusText: this.resolveVisibleStatusText(n) }),
      this.onStateChange?.(this.state));
  }
  setExternalStatusText(e) {
    ((this.externalStatusText = e), this.updateState({}));
  }
  resolveVisibleStatusText(e) {
    return e === "connected"
      ? (this.externalStatusText ?? this.baseStatusText)
      : (this.baseStatusText ?? this.externalStatusText);
  }
  touchActivity() {
    this.updateState({ lastActivityAt: Date.now() });
  }
  appendFeed(e) {
    this.updateState({ feed: [...this.state.feed, e] });
  }
  appendChunkToFeed(e) {
    let { role: n, type: l, chunk: i } = e;
    if (!i) return;
    let r = n === "assistant" ? (this.activeTurnId ?? void 0) : void 0,
      a = this.state.feed.map((u) =>
        u.kind === "message" && !u.message.completed && (u.message.role !== n || u.message.type !== l)
          ? { ...u, message: { ...u.message, completed: !0 } }
          : u,
      ),
      o = a[a.length - 1];
    if (o && o.kind === "message" && o.message.role === n && o.message.type === l && !o.message.completed) {
      let u = { kind: "message", message: { ...o.message, text: (o.message.text ?? "") + i } };
      this.updateState({ feed: [...a.slice(0, -1), u] });
      return;
    }
    let s = {
      kind: "message",
      message: {
        id: `${n}_${l}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        role: n,
        type: l,
        time: kn(),
        text: i,
        completed: n === "user",
        ...(r !== void 0 ? { turnId: r } : {}),
      },
    };
    this.updateState({ feed: [...a, s] });
  }
  markAssistantCompleted() {
    let e = this.activeTurnId;
    if (e === null) return;
    let n = this.state.feed.map((l) =>
      l.kind !== "message" || l.message.role !== "assistant" || l.message.turnId !== e || l.message.completed
        ? l
        : { ...l, message: { ...l.message, completed: !0 } },
    );
    ((this.activeTurnId = null), this.updateState({ feed: n, isBusy: !1 }));
  }
  upsertStreamingToolCall(e) {
    let n = this.streamingToolCallIds.get(e.streamId) ?? e.streamId,
      l = e.toolCallId ?? n;
    this.streamingToolCallIds.set(e.streamId, l);
    let i = e.title ?? (e.name ? `Preparing ${e.name} arguments` : "Preparing tool arguments"),
      r = {
        toolCallId: l,
        title: i,
        ...(e.name ? { name: e.name } : {}),
        status: "pending",
        kind: "other",
        content: [],
        rawInput: e.rawInput,
        streamingArgumentDisplay: e.argumentsText,
      },
      a = !1,
      o = this.state.tools.map((u) => (u.toolCallId !== l && u.toolCallId !== n ? u : ((a = !0), { ...u, ...r })));
    if (
      (this.updateState({ tools: a ? o : [...this.state.tools, r] }),
      !this.state.feed.some((u) => u.kind === "tool" && u.toolCallId === l))
    ) {
      let u = this.state.feed.map((c) => (c.kind === "tool" && c.toolCallId === n ? { ...c, toolCallId: l } : c)),
        f = u.some((c) => c.kind === "tool" && c.toolCallId === l);
      (this.updateState({ feed: u }), f || this.appendFeed({ kind: "tool", toolCallId: l, time: kn() }));
    }
  }
  onSessionUpdate(e) {
    this.touchActivity();
    let n = zN(e);
    if (n) {
      if ((n.tools ? this.updateState({ tools: n.tools }) : this.updateState({ tools: [] }), n.feed)) {
        let l = n.feed.map((i) => {
          if (i.kind === "tool") return { kind: "tool", toolCallId: i.toolCallId, time: kn() };
          let r = i.message;
          return {
            kind: "message",
            message: {
              id: `rehydrate_${r.role}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
              role: r.role,
              type: "text",
              time: kn(),
              text: r.text,
              completed: !0,
              ...(typeof r.model == "string" && r.model ? { model: r.model } : {}),
            },
          };
        });
        this.updateState({ feed: l });
      } else if (n.messages) {
        let l = n.messages.map((i) => ({
          kind: "message",
          message: {
            id: `rehydrate_${i.role}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
            role: i.role,
            type: "text",
            time: kn(),
            text: i.text,
            completed: !0,
            ...(typeof i.model == "string" && i.model ? { model: i.model } : {}),
          },
        }));
        this.updateState({ feed: l });
      } else this.updateState({ feed: [] });
      ((this.activeTurnId = null), this.updateState({ isBusy: !1 }));
      return;
    }
    if (e.sessionUpdate === "agent_message_chunk") {
      e.content?.type === "text" &&
        this.appendChunkToFeed({ role: "assistant", type: "text", chunk: e.content.text ?? "" });
      return;
    }
    if (e.sessionUpdate === "agent_thought_chunk") {
      e.content?.type === "text" &&
        this.appendChunkToFeed({ role: "assistant", type: "thought", chunk: e.content.text ?? "" });
      return;
    }
    if (e.sessionUpdate === "tool_call_streaming_update") {
      this.upsertStreamingToolCall(e);
      return;
    }
    if (e.sessionUpdate === "tool_call") {
      let l = {
          toolCallId: e.toolCallId,
          title: e.title,
          name: e.name ?? void 0,
          status: e.status,
          kind: e.kind,
          content: e.content,
          rawInput: e.rawInput,
          locations: e.locations,
        },
        i = this.state.tools.some((r) => r.toolCallId === l.toolCallId);
      if (
        (this.updateState({
          tools: i ? this.state.tools.map((r) => (r.toolCallId === l.toolCallId ? l : r)) : [...this.state.tools, l],
        }),
        !i)
      ) {
        let r = this.state.feed.map((a) =>
          a.kind === "message" && !a.message.completed ? { ...a, message: { ...a.message, completed: !0 } } : a,
        );
        (this.updateState({ feed: r }), this.appendFeed({ kind: "tool", toolCallId: l.toolCallId, time: kn() }));
      }
      return;
    }
    if (e.sessionUpdate === "tool_call_update") {
      let l = this.state.tools.map((i) =>
        i.toolCallId === e.toolCallId
          ? {
              ...i,
              ...(e.title ? { title: e.title } : {}),
              ...(e.status ? { status: e.status } : {}),
              ...(e.kind ? { kind: e.kind } : {}),
              ...(e.name ? { name: e.name } : {}),
              ...(e.content ? { content: e.content } : {}),
              ...(e.rawInput !== void 0 ? { rawInput: e.rawInput } : {}),
            }
          : i,
      );
      this.updateState({ tools: l });
      return;
    }
  }
};
function BN() {
  return { maxRetries: 3, backoffMs: 1e3 };
}
var Qu = class {
  constructor(e, n) {
    this.handler = e;
    ((this.retryPolicy = n?.retryPolicy ?? BN()), (this.onChange = n?.onChange));
  }
  queue = [];
  running = null;
  lastError = null;
  lastFailed = null;
  retryTimer = null;
  retryPolicy;
  onChange;
  enqueue(e) {
    let n = { id: `${Date.now()}_${Math.random().toString(16).slice(2)}`, prompt: e, attempts: 0 };
    return (this.queue.push(n), this.emit(), this.runNext(), n);
  }
  clear() {
    ((this.queue = []),
      (this.lastError = null),
      (this.lastFailed = null),
      this.retryTimer !== null && (clearTimeout(this.retryTimer), (this.retryTimer = null)),
      this.emit());
  }
  retryLastFailed() {
    if (!this.lastFailed) return;
    let e = { ...this.lastFailed, attempts: 0 };
    ((this.lastFailed = null), this.queue.unshift(e), this.emit(), this.runNext());
  }
  getSnapshot() {
    return {
      queuedCount: this.queue.length,
      running: !!this.running,
      lastError: this.lastError,
      lastFailed: this.lastFailed,
    };
  }
  emit() {
    this.onChange?.(this.getSnapshot());
  }
  async runNext() {
    if (this.running || this.retryTimer !== null) return;
    let e = this.queue.shift();
    if (!e) {
      this.emit();
      return;
    }
    ((this.running = e), this.emit());
    try {
      (await this.handler(e.prompt), (this.running = null), (this.lastError = null), this.emit(), this.runNext());
    } catch (n) {
      if (
        ((this.running = null),
        (this.lastError = n instanceof Error ? n.message : String(n)),
        (e.attempts += 1),
        e.attempts <= this.retryPolicy.maxRetries)
      ) {
        ((this.retryTimer = window.setTimeout(() => {
          ((this.retryTimer = null), this.queue.unshift(e), this.emit(), this.runNext());
        }, this.retryPolicy.backoffMs)),
          this.emit());
        return;
      }
      ((this.lastFailed = { ...e }), this.emit());
    }
  }
};
function HN(t) {
  let e = t.startsWith("http") ? t : `${window.location.protocol}//${window.location.host}${t}`,
    n = new URL(e);
  return (
    (n.protocol = n.protocol === "https:" ? "wss:" : "ws:"),
    (n.pathname = n.pathname.replace(/\/$/, "")),
    (n.hash = ""),
    (n.search = ""),
    n.toString()
  );
}
function qN(t, e) {
  return `${t}/ws/${encodeURIComponent(e)}`;
}
function bx(t, e) {
  let n = (0, Pe.useMemo)(() => HN(e), [e]),
    l = (0, Pe.useRef)(new Map()),
    [i, r] = (0, Pe.useState)({}),
    a = (0, Pe.useCallback)((d) => {
      let g = {
        endpoint: d.endpoint,
        connection: d.clientState.connection,
        statusText: d.clientState.statusText,
        feed: d.clientState.feed,
        tools: d.clientState.tools,
        isBusy: d.clientState.isBusy,
        queuedCount: d.schedulerState.queuedCount,
        lastError: d.schedulerState.lastError,
        lastFailed: d.schedulerState.lastFailed
          ? { prompt: d.schedulerState.lastFailed.prompt, attempts: d.schedulerState.lastFailed.attempts }
          : null,
        lastActivityAt: d.clientState.lastActivityAt,
      };
      r((x) => ({ ...x, [d.endpoint.id]: g }));
    }, []);
  (0, Pe.useEffect)(() => {
    let d = l.current,
      g = new Set(t.map((x) => x.id));
    for (let x of t) {
      let C = d.get(x.id);
      if (C) {
        ((C.endpoint = x), a(C));
        continue;
      }
      let h = qN(n, x.id),
        p = new Vu(h, (E) => {
          let M = d.get(x.id);
          M && ((M.clientState = E), a(M));
        }),
        y = new Qu(async (E) => p.sendPrompt(E), {
          retryPolicy: { maxRetries: 3, backoffMs: 1e3 },
          onChange: (E) => {
            let M = d.get(x.id);
            M && ((M.schedulerState = E), a(M));
          },
        }),
        T = p.getState(),
        N = { endpoint: x, client: p, scheduler: y, clientState: T, schedulerState: y.getSnapshot() };
      (d.set(x.id, N), p.connect(), a(N));
    }
    for (let [x, C] of d.entries())
      g.has(x) ||
        (C.client.dispose(),
        d.delete(x),
        r((h) => {
          let p = { ...h };
          return (delete p[x], p);
        }));
  }, [t, a, n]);
  let o = (0, Pe.useCallback)(
      (d, g) => {
        let x = g.length > 0 ? g : t.map((C) => C.id);
        for (let C of x) {
          let h = l.current.get(C);
          h && h.scheduler.enqueue(d);
        }
      },
      [t],
    ),
    s = (0, Pe.useCallback)(
      (d) => {
        let g = l.current.get(d);
        g && (g.scheduler.clear(), g.client.cancel(), a(g));
      },
      [a],
    ),
    u = (0, Pe.useCallback)(
      (d) => {
        let g = l.current.get(d);
        g && (g.scheduler.clear(), g.client.cancel(), g.client.forceRefresh(), a(g));
      },
      [a],
    ),
    f = (0, Pe.useCallback)(
      (d) => {
        let g = l.current.get(d);
        g && (g.scheduler.retryLastFailed(), a(g));
      },
      [a],
    ),
    c = (0, Pe.useCallback)((d, g) => {
      let x = l.current.get(d);
      x && x.scheduler.enqueue(g);
    }, []),
    m = (0, Pe.useMemo)(() => t.map((d) => i[d.id]).filter(Boolean), [t, i]);
  return {
    stateById: i,
    ordered: m,
    broadcastPrompt: o,
    forceCancel: s,
    forceRefresh: u,
    retryEndpoint: f,
    sendToEndpoint: c,
  };
}
var xx = G(le(), 1);
var me = G(it(), 1);
var kx = ({
  open: t,
  onClose: e,
  state: n,
  onSendPrompt: l,
  onForceCancel: i,
  onForceRefresh: r,
  onRetry: a,
  onOpenDiff: o,
}) => {
  let [s, u] = (0, xx.useState)("");
  if (!t) return null;
  let f = () => {
      if (n.connection !== "connected") return;
      let d = s.trim();
      d && (l(n.endpoint.id, d), u(""));
    },
    c = (d) => {
      d.key === "Enter" && d.ctrlKey && (d.preventDefault(), f());
    },
    m = n.connection === "connected" ? (n.isBusy ? "busy" : "idle") : "disconnected";
  return (0, me.jsx)(Ee, {
    onClose: e,
    children: (0, me.jsx)(Ce, {
      title: n.endpoint.name,
      onClose: e,
      footer: null,
      children: (0, me.jsxs)("div", {
        className: "cp-modal-body",
        style: { height: "80vh", display: "flex", flexDirection: "column", padding: 0 },
        children: [
          (0, me.jsxs)("div", {
            className: "cp-task-header",
            style: { borderBottom: "1px solid var(--border)", padding: "12px" },
            children: [
              (0, me.jsxs)("div", {
                children: [
                  (0, me.jsx)("div", { className: "cp-task-url", children: n.endpoint.baseUrl }),
                  (0, me.jsxs)("div", {
                    className: "cp-task-meta",
                    style: { flexDirection: "row", gap: 12, marginTop: 4 },
                    children: [
                      (0, me.jsx)("span", { className: `cp-conn ${n.connection}`, children: m }),
                      (0, me.jsxs)("span", { className: "cp-queue", children: ["queue ", n.queuedCount] }),
                    ],
                  }),
                ],
              }),
              (0, me.jsxs)("div", {
                className: "cp-task-actions",
                style: { flexDirection: "row" },
                children: [
                  (0, me.jsx)("button", {
                    className: "btn danger",
                    onClick: () => i(n.endpoint.id),
                    children: "Cancel",
                  }),
                  (0, me.jsx)("button", { className: "btn", onClick: () => r(n.endpoint.id), children: "Refresh" }),
                  n.lastFailed &&
                    (0, me.jsx)("button", { className: "btn", onClick: () => a(n.endpoint.id), children: "Retry" }),
                ],
              }),
            ],
          }),
          n.connection === "connected" &&
            n.statusText &&
            (0, me.jsx)("div", { className: "cp-task-notice", children: n.statusText }),
          n.lastError && (0, me.jsxs)("div", { className: "cp-task-error", children: ["Last error: ", n.lastError] }),
          (0, me.jsx)("div", {
            style: { flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" },
            children: (0, me.jsx)(Jr, { feed: n.feed, tools: n.tools, onOpenDiff: o }),
          }),
          (0, me.jsx)("div", {
            className: "cp-task-input",
            children: (0, me.jsx)(ni, {
              value: s,
              textareaClassName: "cp-task-textarea",
              placeholder: "Send prompt...",
              onChange: (d) => u(d.target.value),
              onKeyDown: c,
              onSubmit: f,
              submitClassName: "btn primary",
              submitDisabled: !s.trim() || n.connection !== "connected",
              submitLabel: "Send",
            }),
          }),
        ],
      }),
    }),
  });
};
var A = G(it(), 1);
var mp = 8,
  IN = ({
    open: t,
    onClose: e,
    endpoints: n,
    selectedIds: l,
    onToggle: i,
    onSelectAll: r,
    onClearAll: a,
    onSend: o,
  }) => {
    let [s, u] = (0, dt.useState)("");
    if (
      ((0, dt.useEffect)(() => {
        t || u("");
      }, [t]),
      !t)
    )
      return null;
    let f = l.size > 0 ? l.size : n.length;
    return (0, A.jsx)("div", {
      className: "cp-broadcast-modal-backdrop",
      onClick: e,
      children: (0, A.jsxs)("div", {
        className: "cp-broadcast-modal",
        onClick: (c) => c.stopPropagation(),
        children: [
          (0, A.jsxs)("div", {
            className: "cp-broadcast-modal-header",
            children: [
              (0, A.jsx)("div", { className: "cp-broadcast-modal-title", children: "Broadcast Prompt" }),
              (0, A.jsx)("button", { className: "cp-broadcast-modal-close", onClick: e, children: "\u2715" }),
            ],
          }),
          (0, A.jsxs)("div", {
            className: "cp-broadcast-modal-body",
            children: [
              (0, A.jsxs)("div", {
                className: "cp-broadcast-modal-left",
                children: [
                  (0, A.jsx)("div", { className: "cp-broadcast-modal-label", children: "Prompt" }),
                  (0, A.jsx)("textarea", {
                    className: "cp-broadcast-modal-textarea",
                    placeholder: "Type a prompt to broadcast to selected workers...",
                    value: s,
                    onChange: (c) => u(c.target.value),
                    onKeyDown: (c) => {
                      c.key === "Enter" &&
                        c.ctrlKey &&
                        (c.preventDefault(), s.trim() && n.length > 0 && (o(s.trim()), e()));
                    },
                    autoFocus: !0,
                  }),
                  (0, A.jsxs)("div", {
                    className: "cp-broadcast-modal-footer",
                    children: [
                      (0, A.jsxs)("span", {
                        className: "cp-broadcast-modal-target",
                        children: ["\u2192 ", f, " worker", f !== 1 ? "s" : ""],
                      }),
                      (0, A.jsxs)("div", {
                        style: { display: "flex", gap: 8 },
                        children: [
                          (0, A.jsx)("button", { className: "btn", onClick: e, children: "Cancel" }),
                          (0, A.jsx)("button", {
                            className: "btn primary",
                            disabled: !s.trim() || n.length === 0,
                            onClick: () => {
                              (o(s.trim()), e());
                            },
                            children: "Broadcast",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, A.jsxs)("div", {
                className: "cp-broadcast-modal-right",
                children: [
                  (0, A.jsxs)("div", {
                    className: "cp-broadcast-modal-label",
                    children: [
                      "Target Workers",
                      (0, A.jsxs)("div", {
                        className: "cp-broadcast-modal-node-actions",
                        children: [
                          (0, A.jsx)("button", { className: "btn", onClick: r, children: "All" }),
                          (0, A.jsx)("button", { className: "btn", onClick: a, children: "None" }),
                        ],
                      }),
                    ],
                  }),
                  (0, A.jsx)("div", {
                    className: "cp-broadcast-modal-node-list",
                    children: n.map((c) =>
                      (0, A.jsxs)(
                        "label",
                        {
                          className: "cp-broadcast-modal-node-item",
                          children: [
                            (0, A.jsx)("input", {
                              type: "checkbox",
                              checked: l.has(c.id),
                              onChange: (m) => i(c.id, m.target.checked),
                            }),
                            (0, A.jsxs)("div", {
                              className: "cp-broadcast-modal-node-info",
                              children: [
                                (0, A.jsx)("span", { className: "cp-broadcast-modal-node-name", children: c.name }),
                                (0, A.jsx)("span", { className: "cp-broadcast-modal-node-url", children: c.baseUrl }),
                                c.tags.length > 0 &&
                                  (0, A.jsx)("span", {
                                    className: "cp-broadcast-modal-node-tags",
                                    children: c.tags.join(", "),
                                  }),
                              ],
                            }),
                          ],
                        },
                        c.id,
                      ),
                    ),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    });
  },
  Sx = ({ config: t }) => {
    let e = tu(t),
      n = (0, dt.useMemo)(() => fx(e), [e]),
      [l, i] = (0, dt.useState)([]),
      [r, a] = (0, dt.useState)({}),
      [o, s] = (0, dt.useState)(!1),
      [u, f] = (0, dt.useState)(null),
      [c, m] = (0, dt.useState)(""),
      [d, g] = (0, dt.useState)("all"),
      [x, C] = (0, dt.useState)(1),
      [h, p] = (0, dt.useState)(!1),
      [y, T] = (0, dt.useState)(null),
      [N, E] = (0, dt.useState)(new Set()),
      [M, z] = (0, dt.useState)(null),
      [F, w] = (0, dt.useState)(!1),
      [Z, L] = (0, dt.useState)(!1),
      [H, X] = (0, dt.useState)(!1),
      [tt, st] = (0, dt.useState)(!0),
      [Dt, Ut] = (0, dt.useState)(!1),
      [U, k] = (0, dt.useState)(null),
      [Rt, _t] = (0, dt.useState)(!1);
    (0, dt.useEffect)(() => {
      if (typeof window > "u" || typeof window.matchMedia != "function") return;
      let D = window.matchMedia("(max-width: 768px)"),
        kt = (Ot) => _t(Ot.matches);
      return (D.addEventListener("change", kt), _t(D.matches), () => D.removeEventListener("change", kt));
    }, []);
    let [S, ut] = (0, dt.useState)("workers"),
      [pe, he] = (0, dt.useState)("list"),
      [Ne, gt] = (0, dt.useState)(null),
      [se, Xt] = (0, dt.useState)(""),
      [ge, I] = (0, dt.useState)(""),
      {
        ordered: V,
        broadcastPrompt: Y,
        forceCancel: K,
        forceRefresh: et,
        retryEndpoint: ot,
        sendToEndpoint: Et,
      } = bx(l, e),
      ye = (0, dt.useMemo)(() => (U ? V.find((D) => D.endpoint.id === U) : null), [U, V]),
      Vt = (0, dt.useMemo)(() => (Ne ? V.find((D) => D.endpoint.id === Ne) : null), [Ne, V]),
      jt = (0, dt.useCallback)(async () => {
        (s(!0), f(null));
        try {
          let D = await n.list();
          i(D);
        } catch (D) {
          f(D instanceof Error ? D.message : "Failed to load endpoints");
        } finally {
          s(!1);
        }
      }, [n]);
    (0, dt.useEffect)(() => {
      jt();
    }, [jt]);
    let Ge = (0, dt.useMemo)(() => {
        let D = c.trim().toLowerCase();
        return l.filter((kt) => {
          if (D && !`${kt.name} ${kt.baseUrl} ${kt.tags.join(" ")}`.toLowerCase().includes(D)) return !1;
          if (d === "all") return !0;
          let Ot = r[kt.id];
          return Ot ? (d === "healthy" ? Ot.ok : !Ot.ok) : !1;
        });
      }, [l, c, d, r]),
      Le = Math.max(1, Math.ceil(Ge.length / mp));
    ((0, dt.useEffect)(() => {
      x > Le && C(Le);
    }, [x, Le]),
      (0, dt.useEffect)(() => {
        E((D) => {
          let kt = new Set();
          for (let Ot of D) l.some((ee) => ee.id === Ot) && kt.add(Ot);
          return kt;
        });
      }, [l]));
    let en = (0, dt.useMemo)(() => {
        let D = (x - 1) * mp;
        return Ge.slice(D, D + mp);
      }, [Ge, x]),
      Xe = (D) => {
        (T(D), p(!0));
      },
      R = async (D) => {
        if (y) {
          let Ot = await n.update(y.id, D);
          (i((ee) => ee.map((yp) => (yp.id === Ot.id ? Ot : yp))), T(Ot));
          return;
        }
        let kt = await n.create(D);
        i((Ot) => [...Ot, kt]);
      },
      q = async (D) => {
        window.confirm(`Delete endpoint "${D.name}"?`) &&
          (await n.remove(D.id),
          i((Ot) => Ot.filter((ee) => ee.id !== D.id)),
          a((Ot) => {
            let ee = { ...Ot };
            return (delete ee[D.id], ee);
          }));
      },
      nt = async (D) => {
        a((kt) => ({ ...kt, [D.id]: null }));
        try {
          let kt = await n.health(D.id);
          a((Ot) => ({ ...Ot, [D.id]: kt }));
        } catch (kt) {
          a((Ot) => ({
            ...Ot,
            [D.id]: { ok: !1, error: kt instanceof Error ? kt.message : "Health check failed", durationMs: 0 },
          }));
        }
      },
      rt = (D, kt) => {
        E((Ot) => {
          let ee = new Set(Ot);
          return (kt ? ee.add(D) : ee.delete(D), ee);
        });
      },
      wt = () => E(new Set(l.map((D) => D.id))),
      xe = () => E(new Set()),
      v = (D) => {
        let kt = N.size > 0 ? Array.from(N) : [];
        Y(D, kt);
      },
      _ = () => {
        let D = ge.trim();
        if (!D) return;
        let kt = N.size > 0 ? Array.from(N) : [];
        (Y(D, kt), I(""));
      },
      j = async (D) => {
        for (let kt of D) await n.create(kt);
        await jt();
      },
      P = (0, dt.useCallback)(async () => await n.getRawRegistryJson(), [n]),
      J = (0, dt.useCallback)(
        async (D) => {
          (await n.saveRawRegistryJson(D), await jt());
        },
        [n, jt],
      ),
      Pt = (0, dt.useCallback)((D, kt) => {
        E((Ot) => {
          let ee = new Set(Ot);
          return (kt ? ee.add(D) : ee.delete(D), ee);
        });
      }, []),
      Tt = (D) => {
        (gt(D), Xt(""), he("detail"));
      },
      Bt = () => {
        (he("list"), gt(null));
      },
      Sn = () => {
        if (!Vt || Vt.connection !== "connected") return;
        let D = se.trim();
        D && (Et(Vt.endpoint.id, D), Xt(""));
      },
      qe = N.size > 0 ? `${N.size} of ${l.length} selected` : `All ${l.length} workers`;
    return (0, A.jsxs)("div", {
      className: "app control-plane",
      children: [
        (0, A.jsx)(IN, {
          open: Dt,
          onClose: () => Ut(!1),
          endpoints: l,
          selectedIds: N,
          onToggle: rt,
          onSelectAll: wt,
          onClearAll: xe,
          onSend: v,
        }),
        !Rt &&
          (0, A.jsxs)("div", {
            className: "cp-header cp-header-pc",
            children: [
              (0, A.jsxs)("div", {
                children: [
                  (0, A.jsx)("h1", { children: "Control Plane" }),
                  (0, A.jsxs)("div", { className: "cp-subtitle", children: [l.length, " endpoints registered"] }),
                ],
              }),
              (0, A.jsx)("div", {
                className: "cp-header-actions",
                children: (0, A.jsxs)("button", {
                  className: "btn",
                  onClick: () => w(!F),
                  children: [F ? "Hide" : "Show", " Endpoints"],
                }),
              }),
            ],
          }),
        Rt &&
          (0, A.jsx)("div", {
            className: "cp-header cp-header-mobile",
            children:
              pe === "detail" && Vt
                ? (0, A.jsxs)(A.Fragment, {
                    children: [
                      (0, A.jsx)("button", { className: "cp-mobile-back-btn", onClick: Bt, children: "\u2039 Back" }),
                      (0, A.jsx)("span", {
                        className: "cp-mobile-detail-title",
                        style: { flex: 1, minWidth: 0 },
                        children: Vt.endpoint.name,
                      }),
                      (0, A.jsxs)("div", {
                        style: { display: "flex", gap: 6 },
                        children: [
                          (0, A.jsx)("button", {
                            className: "btn danger",
                            onClick: () => K(Vt.endpoint.id),
                            children: "Cancel",
                          }),
                          (0, A.jsx)("button", {
                            className: "btn",
                            onClick: () => et(Vt.endpoint.id),
                            children: "Refresh",
                          }),
                        ],
                      }),
                    ],
                  })
                : (0, A.jsxs)("div", {
                    children: [
                      (0, A.jsx)("div", {
                        className: "cp-mobile-header-title",
                        children: S === "broadcast" ? "Broadcast" : S === "endpoints" ? "Endpoints" : "Control Plane",
                      }),
                      (0, A.jsx)("div", {
                        className: "cp-subtitle",
                        children:
                          S === "broadcast"
                            ? N.size > 0
                              ? `${N.size} of ${l.length} selected`
                              : `${l.length} workers`
                            : `${l.length} workers`,
                      }),
                    ],
                  }),
          }),
        (0, A.jsxs)("div", {
          className: "cp-body",
          children: [
            (0, A.jsxs)("div", {
              className: "cp-sidebar",
              children: [
                (0, A.jsxs)("div", {
                  className: "cp-sidebar-broadcast-section",
                  children: [
                    (0, A.jsx)("div", { className: "cp-sidebar-section-label", children: "Broadcast" }),
                    (0, A.jsx)("div", { className: "cp-sidebar-broadcast-target", children: qe }),
                    (0, A.jsx)("button", {
                      className: "btn primary cp-sidebar-broadcast-btn",
                      onClick: () => Ut(!0),
                      disabled: l.length === 0,
                      children: "Broadcast\u2026",
                    }),
                  ],
                }),
                (0, A.jsxs)("div", {
                  className: "cp-sidebar-section-label cp-sidebar-workers-label",
                  children: [
                    "Workers",
                    (0, A.jsx)("span", { className: "cp-sidebar-workers-count", children: V.length }),
                  ],
                }),
                (0, A.jsx)("div", {
                  className: "cp-sidebar-workers",
                  children:
                    V.length === 0
                      ? (0, A.jsx)("div", {
                          className: "cp-empty",
                          style: { padding: "8px 12px" },
                          children: "No workers yet.",
                        })
                      : V.map((D) => {
                          let kt = D.connection === "connected" ? (D.isBusy ? "busy" : "idle") : "disc",
                            Ot = U === D.endpoint.id;
                          return (0, A.jsxs)(
                            "div",
                            {
                              className: `cp-sidebar-worker-item${Ot ? " active" : ""}`,
                              onClick: () => k(D.endpoint.id),
                              children: [
                                (0, A.jsx)("input", {
                                  type: "checkbox",
                                  "aria-hidden": "true",
                                  tabIndex: -1,
                                  checked: N.has(D.endpoint.id),
                                  onClick: (ee) => ee.stopPropagation(),
                                  onChange: (ee) => Pt(D.endpoint.id, ee.target.checked),
                                }),
                                (0, A.jsxs)("div", {
                                  className: "cp-sidebar-worker-info",
                                  children: [
                                    (0, A.jsx)("span", {
                                      className: "cp-sidebar-worker-name",
                                      children: D.endpoint.name,
                                    }),
                                    (0, A.jsx)("span", {
                                      className: "cp-sidebar-worker-url",
                                      children: D.endpoint.baseUrl,
                                    }),
                                    D.endpoint.tags.length > 0 &&
                                      (0, A.jsx)("span", {
                                        className: "cp-sidebar-worker-tags",
                                        children: D.endpoint.tags.join(" \xB7 "),
                                      }),
                                  ],
                                }),
                                (0, A.jsx)("span", {
                                  className: `cp-conn ${D.connection} cp-sidebar-worker-status`,
                                  children: kt,
                                }),
                              ],
                            },
                            D.endpoint.id,
                          );
                        }),
                }),
              ],
            }),
            (0, A.jsx)("div", {
              className: "cp-main",
              children: (0, A.jsxs)("div", {
                className: "cp-workers",
                children: [
                  (0, A.jsxs)("div", {
                    className: "cp-workers-header",
                    children: [
                      (0, A.jsx)("span", { children: "Workers" }),
                      (0, A.jsx)("button", {
                        className: "btn",
                        onClick: () => st((D) => !D),
                        title: tt ? "Show input boxes" : "Hide input boxes",
                        children: tt ? "Expand" : "Compact",
                      }),
                    ],
                  }),
                  V.length === 0
                    ? (0, A.jsx)("div", {
                        className: "cp-empty",
                        style: { padding: "12px 16px" },
                        children: "No workers yet. Add endpoints from the Endpoints panel.",
                      })
                    : (0, A.jsx)("div", {
                        className: "cp-worker-grid",
                        children: V.map((D) =>
                          (0, A.jsx)(
                            fp,
                            {
                              state: D,
                              selected: N.has(D.endpoint.id),
                              onSelect: Pt,
                              onClick: k,
                              onForceCancel: K,
                              onForceRefresh: et,
                              onRetry: ot,
                              onSendPrompt: Et,
                              onOpenDiff: z,
                              hideInput: tt,
                            },
                            D.endpoint.id,
                          ),
                        ),
                      }),
                ],
              }),
            }),
            S === "workers" &&
              pe === "list" &&
              (0, A.jsx)("div", {
                className: "cp-mobile-list",
                children:
                  V.length === 0
                    ? (0, A.jsx)("div", { className: "cp-empty", children: "No workers yet." })
                    : V.map((D) =>
                        (0, A.jsx)(
                          fp,
                          {
                            state: D,
                            selected: N.has(D.endpoint.id),
                            onSelect: Pt,
                            onClick: Tt,
                            onForceCancel: K,
                            onForceRefresh: et,
                            onRetry: ot,
                            onSendPrompt: Et,
                            onOpenDiff: z,
                            compact: !0,
                          },
                          D.endpoint.id,
                        ),
                      ),
              }),
            S === "workers" &&
              pe === "detail" &&
              Vt &&
              (0, A.jsxs)("div", {
                className: "cp-mobile-detail",
                children: [
                  Vt.lastError &&
                    (0, A.jsxs)("div", { className: "cp-task-error", children: ["Last error: ", Vt.lastError] }),
                  (0, A.jsx)("div", {
                    className: "cp-mobile-detail-feed",
                    children: (0, A.jsx)(Jr, { feed: Vt.feed, tools: Vt.tools, onOpenDiff: z }),
                  }),
                  (0, A.jsx)("div", {
                    className: "cp-mobile-detail-input",
                    children: (0, A.jsx)(ni, {
                      value: se,
                      textareaClassName: "cp-mobile-detail-textarea",
                      placeholder: "Send a prompt...",
                      onChange: (D) => Xt(D.target.value),
                      onKeyDown: (D) => {
                        D.key === "Enter" && D.ctrlKey && (D.preventDefault(), Sn());
                      },
                      onSubmit: Sn,
                      submitClassName: "btn primary cp-mobile-detail-send",
                      submitDisabled: !se.trim() || Vt.connection !== "connected",
                      submitLabel: "Send",
                    }),
                  }),
                ],
              }),
            S === "broadcast" &&
              (0, A.jsxs)("div", {
                className: "cp-mobile-broadcast-tab",
                children: [
                  (0, A.jsxs)("div", {
                    className: "cp-broadcast-sheet-nodes",
                    children: [
                      (0, A.jsxs)("div", {
                        className: "cp-broadcast-sheet-nodes-header",
                        children: [
                          (0, A.jsx)("span", {
                            className: "cp-broadcast-sheet-subtitle",
                            children: N.size > 0 ? `${N.size} of ${l.length} selected` : `All ${l.length} workers`,
                          }),
                          (0, A.jsxs)("div", {
                            style: { display: "flex", gap: 6 },
                            children: [
                              (0, A.jsx)("button", { className: "btn", onClick: wt, children: "All" }),
                              (0, A.jsx)("button", { className: "btn", onClick: xe, children: "None" }),
                            ],
                          }),
                        ],
                      }),
                      (0, A.jsx)("div", {
                        className: "cp-broadcast-sheet-node-list",
                        children: l.map((D) =>
                          (0, A.jsxs)(
                            "label",
                            {
                              className: "cp-broadcast-sheet-node-item",
                              children: [
                                (0, A.jsx)("input", {
                                  type: "checkbox",
                                  checked: N.has(D.id),
                                  onChange: (kt) => rt(D.id, kt.target.checked),
                                }),
                                (0, A.jsxs)("div", {
                                  className: "cp-broadcast-sheet-node-info",
                                  children: [
                                    (0, A.jsx)("span", { className: "cp-broadcast-sheet-node-name", children: D.name }),
                                    (0, A.jsx)("span", {
                                      className: "cp-broadcast-sheet-node-url",
                                      children: D.baseUrl,
                                    }),
                                  ],
                                }),
                              ],
                            },
                            D.id,
                          ),
                        ),
                      }),
                    ],
                  }),
                  (0, A.jsxs)("div", {
                    className: "cp-broadcast-sheet-compose",
                    children: [
                      (0, A.jsx)("textarea", {
                        className: "cp-broadcast-sheet-textarea",
                        placeholder: "Type a prompt...",
                        value: ge,
                        onChange: (D) => I(D.target.value),
                        onKeyDown: (D) => {
                          D.key === "Enter" && D.ctrlKey && (D.preventDefault(), _());
                        },
                      }),
                      (0, A.jsx)("div", {
                        className: "cp-broadcast-sheet-footer",
                        children: (0, A.jsx)("button", {
                          className: "btn primary",
                          onClick: _,
                          disabled: !ge.trim() || l.length === 0,
                          children: "Send",
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            S === "endpoints" &&
              (0, A.jsxs)("div", {
                className: "cp-mobile-endpoints-tab",
                children: [
                  (0, A.jsxs)("div", {
                    className: "cp-mobile-endpoints-toolbar",
                    children: [
                      (0, A.jsxs)("div", {
                        style: { display: "flex", gap: 8, flexWrap: "wrap" },
                        children: [
                          (0, A.jsx)("button", { className: "btn", onClick: () => L(!0), children: "Batch add" }),
                          (0, A.jsx)("button", { className: "btn", onClick: () => X(!0), children: "Edit JSON" }),
                          (0, A.jsx)("button", { className: "btn primary", onClick: () => Xe(null), children: "Add" }),
                        ],
                      }),
                      (0, A.jsxs)("div", {
                        style: { display: "flex", gap: 8, marginTop: 8 },
                        children: [
                          (0, A.jsx)("input", {
                            className: "cp-input",
                            placeholder: "Search...",
                            value: c,
                            onChange: (D) => m(D.target.value),
                            style: { flex: 1 },
                          }),
                          (0, A.jsx)("button", { className: "btn", onClick: () => void jt(), children: "Refresh" }),
                        ],
                      }),
                    ],
                  }),
                  u && (0, A.jsx)("div", { className: "cp-error", style: { padding: "0 14px" }, children: u }),
                  o &&
                    (0, A.jsx)("div", {
                      className: "cp-loading",
                      style: { padding: "0 14px" },
                      children: "Loading...",
                    }),
                  (0, A.jsx)("div", {
                    style: { flex: 1, overflow: "auto", padding: "8px 14px" },
                    children: (0, A.jsx)(cp, {
                      endpoints: en,
                      healthById: r,
                      onEdit: Xe,
                      onDelete: q,
                      onRefreshHealth: nt,
                      selectedIds: N,
                      onToggleSelect: rt,
                    }),
                  }),
                  (0, A.jsxs)("div", {
                    className: "cp-pagination",
                    children: [
                      (0, A.jsxs)("div", { className: "cp-page-info", children: [en.length, " / ", Ge.length] }),
                      (0, A.jsxs)("div", {
                        className: "cp-page-controls",
                        children: [
                          (0, A.jsx)("button", {
                            className: "btn",
                            onClick: () => C((D) => Math.max(1, D - 1)),
                            disabled: x <= 1,
                            children: "Prev",
                          }),
                          (0, A.jsxs)("span", { className: "cp-page-number", children: [x, " / ", Le] }),
                          (0, A.jsx)("button", {
                            className: "btn",
                            onClick: () => C((D) => Math.min(Le, D + 1)),
                            disabled: x >= Le,
                            children: "Next",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
          ],
        }),
        (0, A.jsxs)("nav", {
          className: "cp-mobile-tab-bar",
          children: [
            (0, A.jsxs)("button", {
              className: `cp-mobile-tab${S === "workers" ? " active" : ""}`,
              onClick: () => {
                (ut("workers"), he("list"));
              },
              children: [
                (0, A.jsxs)("svg", {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    (0, A.jsx)("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }),
                    (0, A.jsx)("path", { d: "M8 21h8M12 17v4" }),
                  ],
                }),
                (0, A.jsx)("span", { children: "Workers" }),
              ],
            }),
            (0, A.jsxs)("button", {
              className: `cp-mobile-tab${S === "broadcast" ? " active" : ""}`,
              onClick: () => {
                (ut("broadcast"), he("list"));
              },
              children: [
                (0, A.jsx)("svg", {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: (0, A.jsx)("path", {
                    d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
                  }),
                }),
                (0, A.jsx)("span", { children: "Broadcast" }),
                N.size > 0 && (0, A.jsx)("span", { className: "cp-mobile-tab-badge", children: N.size }),
              ],
            }),
            (0, A.jsxs)("button", {
              className: `cp-mobile-tab${S === "endpoints" ? " active" : ""}`,
              onClick: () => {
                (ut("endpoints"), he("list"));
              },
              children: [
                (0, A.jsxs)("svg", {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    (0, A.jsx)("circle", { cx: "12", cy: "12", r: "3" }),
                    (0, A.jsx)("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" }),
                  ],
                }),
                (0, A.jsx)("span", { children: "Endpoints" }),
              ],
            }),
          ],
        }),
        F && (0, A.jsx)("div", { className: "cp-drawer-backdrop", onClick: () => w(!1) }),
        (0, A.jsxs)("div", {
          className: `cp-drawer ${F ? "open" : ""}`,
          children: [
            (0, A.jsxs)("div", {
              className: "cp-drawer-header",
              children: [
                (0, A.jsx)("h2", { children: "Endpoints" }),
                (0, A.jsxs)("div", {
                  style: { display: "flex", gap: 8, flexWrap: "wrap" },
                  children: [
                    (0, A.jsx)("button", { className: "btn", onClick: () => w(!1), children: "Close" }),
                    (0, A.jsx)("button", { className: "btn", onClick: () => L(!0), children: "Batch add" }),
                    (0, A.jsx)("button", { className: "btn", onClick: () => X(!0), children: "Edit JSON" }),
                    (0, A.jsx)("button", { className: "btn primary", onClick: () => Xe(null), children: "Add" }),
                  ],
                }),
              ],
            }),
            (0, A.jsxs)("div", {
              className: "cp-drawer-toolbar",
              children: [
                (0, A.jsx)("input", {
                  className: "cp-input",
                  placeholder: "Search...",
                  value: c,
                  onChange: (D) => m(D.target.value),
                }),
                (0, A.jsxs)("select", {
                  className: "cp-select",
                  value: d,
                  onChange: (D) => g(D.target.value),
                  children: [
                    (0, A.jsx)("option", { value: "all", children: "All" }),
                    (0, A.jsx)("option", { value: "healthy", children: "Healthy" }),
                    (0, A.jsx)("option", { value: "unhealthy", children: "Unhealthy" }),
                  ],
                }),
                (0, A.jsx)("button", { className: "btn", onClick: () => void jt(), children: "Refresh" }),
              ],
            }),
            u && (0, A.jsx)("div", { className: "cp-error", children: u }),
            o && (0, A.jsx)("div", { className: "cp-loading", children: "Loading..." }),
            (0, A.jsx)("div", {
              className: "cp-drawer-content",
              children: (0, A.jsx)(cp, {
                endpoints: en,
                healthById: r,
                onEdit: Xe,
                onDelete: q,
                onRefreshHealth: nt,
                selectedIds: N,
                onToggleSelect: rt,
              }),
            }),
            (0, A.jsxs)("div", {
              className: "cp-pagination",
              children: [
                (0, A.jsxs)("div", { className: "cp-page-info", children: [en.length, " / ", Ge.length] }),
                (0, A.jsxs)("div", {
                  className: "cp-page-controls",
                  children: [
                    (0, A.jsx)("button", {
                      className: "btn",
                      onClick: () => C((D) => Math.max(1, D - 1)),
                      disabled: x <= 1,
                      children: "Prev",
                    }),
                    (0, A.jsxs)("span", { className: "cp-page-number", children: [x, " / ", Le] }),
                    (0, A.jsx)("button", {
                      className: "btn",
                      onClick: () => C((D) => Math.min(Le, D + 1)),
                      disabled: x >= Le,
                      children: "Next",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        (0, A.jsx)(dx, { open: h, endpoint: y, onClose: () => p(!1), onSave: R }),
        (0, A.jsx)(px, { open: Z, onClose: () => L(!1), onSubmit: j }),
        (0, A.jsx)(gx, { open: H, onClose: () => X(!1), onLoad: P, onSave: J }),
        ye &&
          (0, A.jsx)(kx, {
            open: !!ye,
            onClose: () => k(null),
            state: ye,
            onSendPrompt: Et,
            onForceCancel: K,
            onForceRefresh: et,
            onRetry: ot,
            onOpenDiff: z,
          }),
        M && (0, A.jsx)(Xr, { title: M.title, oldText: M.oldText, newText: M.newText, onClose: () => z(null) }),
      ],
    });
  };
var $ = G(le(), 1),
  b = G(it(), 1);
var Eo = "unity-cn-registry.cn-shanghai.cr.aliyuncs.com/codesearch/unity2022",
  Fi = [
    { label: "1080p (1920\xD71080)", value: "1920x1080x24", image: `${Eo}:batch-20260303` },
    { label: "2K (2560\xD71440)", value: "2560x1440x24", image: `${Eo}:batch-20260303-2k` },
    { label: "4K (3840\xD72160)", value: "3840x2160x24", image: `${Eo}:batch-20260303-4k` },
  ],
  Nx = ["gpt-5.2", "gpt-4.1", "claude-sonnet-4-20250514", "o3", "gemini-2.5-pro"],
  wx = {
    prompts: ["\u6784\u5EFA\u4E00\u4E2Aflappy bird\u6E38\u620F\u5E76\u622A\u56FE\u9A8C\u8BC1"],
    model: "gpt-5.2",
    tags: [],
    image: `${Eo}:batch-20260303`,
    timeout: 900,
    env: {},
  };
function Co(t, e) {
  return `${t}/rollout${e}`;
}
async function un(t, e, n = "GET", l) {
  let i = Co(t, e),
    r = { method: n, headers: { "Content-Type": "application/json" } };
  l !== void 0 && (r.body = JSON.stringify(l));
  let a = await fetch(i, r),
    o = await a.text();
  if (!o) throw new Error(`Empty response (${a.status})`);
  try {
    return JSON.parse(o);
  } catch {
    throw new Error(`Invalid JSON (${a.status}): ${o.slice(0, 200)}`);
  }
}
async function Tx(t, e) {
  let n = Co(t, e),
    l = await fetch(n);
  if ((l.headers.get("content-type") ?? "").includes("json")) {
    let r = await l.json();
    return typeof r == "string" ? r : JSON.stringify(r, null, 2);
  }
  return l.text();
}
function Ex(t, e) {
  if (!t) return "";
  let n = Math.round(((e ? new Date(e).getTime() : Date.now()) - new Date(t).getTime()) / 1e3);
  return n < 60 ? `${n}s` : `${Math.floor(n / 60)}m ${n % 60}s`;
}
var jN = "\x1B",
  YN = new RegExp(`${jN}\\[[0-9;]*m`, "g");
function FN(t) {
  return t.replace(YN, "");
}
function pp(t) {
  return t ? (Fi.find((n) => n.image === t)?.value ?? Fi[0].value) : Fi[0].value;
}
function Cx(t) {
  return Fi.find((n) => n.value === t)?.image ?? Fi[0].image;
}
function hp(t) {
  let e = {};
  for (let n of t.split(`
`)) {
    let l = n.indexOf("=");
    l > 0 && (e[n.slice(0, l).trim()] = n.slice(l + 1).trim());
  }
  return e;
}
function Ax(t) {
  return Object.entries(t).map(([e, n]) => `${e}=${n}`).join(`
`);
}
var VN = ({ open: t, mode: e, config: n, onClose: l, onSubmit: i }) => {
    let [r, a] = (0, $.useState)(e),
      [o, s] = (0, $.useState)(""),
      [u, f] = (0, $.useState)(n.model),
      [c, m] = (0, $.useState)(""),
      [d, g] = (0, $.useState)(pp(n.image)),
      [x, C] = (0, $.useState)(String(n.timeout)),
      [h, p] = (0, $.useState)(""),
      [y, T] = (0, $.useState)(!1),
      [N, E] = (0, $.useState)(""),
      [M, z] = (0, $.useState)(""),
      [F, w] = (0, $.useState)(!1),
      [Z, L] = (0, $.useState)(""),
      [H, X] = (0, $.useState)("");
    ((0, $.useEffect)(() => {
      a(e);
    }, [e]),
      (0, $.useEffect)(() => {
        if (!t) return;
        (s(""), f(n.model), m(""), g(pp(n.image)), C(String(n.timeout)), p(""), T(!1), E(""), z(""), w(!1), X(""));
        let U = { ...wx, model: n.model, image: n.image, timeout: n.timeout };
        L(JSON.stringify(U, null, 2));
      }, [t, n]));
    let tt = (0, $.useCallback)(() => {
        let U = o
            .split(
              `
`,
            )
            .map((ut) => ut.trim())
            .filter((ut) => ut && !ut.startsWith("#")),
          k = c
            .split(",")
            .map((ut) => ut.trim())
            .filter(Boolean),
          Rt = y && h ? h : Cx(d),
          _t = hp(N),
          S = {
            prompts: U.length > 0 ? U : [""],
            model: u,
            command: F && M ? M : void 0,
            tags: k.length > 0 ? k : void 0,
            image: Rt,
            timeout: parseInt(x, 10) || void 0,
            env: Object.keys(_t).length > 0 ? _t : void 0,
          };
        (L(JSON.stringify(S, null, 2)), X(""));
      }, [o, u, c, d, x, h, y, N, M, F]),
      st = (U) => {
        (U === "json" && r === "form" && tt(), a(U));
      },
      Dt = () => {
        let U = o
          .split(
            `
`,
          )
          .map((S) => S.trim())
          .filter((S) => S && !S.startsWith("#"));
        if (U.length === 0) return;
        let k = c
            .split(",")
            .map((S) => S.trim())
            .filter(Boolean),
          Rt = y && h ? h : Cx(d),
          _t = hp(N);
        i({
          prompts: U,
          model: u,
          command: F && M ? M : void 0,
          tags: k.length > 0 ? k : void 0,
          image: Rt,
          timeout: parseInt(x, 10) || void 0,
          env: Object.keys(_t).length > 0 ? _t : void 0,
        });
      },
      Ut = () => {
        try {
          let U = JSON.parse(Z);
          if (!U.prompt && (!U.prompts || U.prompts.length === 0)) {
            X('Must have "prompt" or "prompts"');
            return;
          }
          (X(""), i(U));
        } catch (U) {
          X(`Invalid JSON: ${U instanceof Error ? U.message : U}`);
        }
      };
    return t
      ? (0, b.jsxs)(b.Fragment, {
          children: [
            (0, b.jsx)("div", { className: "rollout-log-backdrop", onClick: l }),
            (0, b.jsxs)("div", {
              className: "rollout-dialog",
              children: [
                (0, b.jsxs)("div", {
                  className: "rollout-dialog-header",
                  children: [
                    (0, b.jsx)("h3", { children: "New Tasks" }),
                    (0, b.jsxs)("div", {
                      className: "rollout-row",
                      style: { gap: "4px" },
                      children: [
                        (0, b.jsx)("button", {
                          className: `rollout-detail-tab ${r === "form" ? "active" : ""}`,
                          onClick: () => st("form"),
                          children: "Form",
                        }),
                        (0, b.jsx)("button", {
                          className: `rollout-detail-tab ${r === "json" ? "active" : ""}`,
                          onClick: () => st("json"),
                          children: "JSON",
                        }),
                        (0, b.jsx)("button", {
                          className: "btn",
                          onClick: l,
                          style: { marginLeft: 8 },
                          children: "\u2715",
                        }),
                      ],
                    }),
                  ],
                }),
                r === "form"
                  ? (0, b.jsxs)("div", {
                      className: "rollout-dialog-body",
                      children: [
                        (0, b.jsxs)("div", {
                          className: "rollout-form-group",
                          children: [
                            (0, b.jsxs)("label", {
                              className: "rollout-label",
                              children: [
                                "Prompts",
                                " ",
                                (0, b.jsx)("span", {
                                  style: { color: "var(--muted)", fontWeight: 400 },
                                  children: "(one per line)",
                                }),
                              ],
                            }),
                            (0, b.jsx)("textarea", {
                              className: "rollout-textarea",
                              rows: 6,
                              placeholder: `\u6784\u5EFA\u4E00\u4E2Aflappy bird\u6E38\u620F\u5E76\u622A\u56FE\u9A8C\u8BC1
\u521B\u5EFA\u4E00\u4E2A\u6253\u7816\u5757\u6E38\u620F
# Lines starting with # are ignored`,
                              value: o,
                              onChange: (U) => s(U.target.value),
                            }),
                          ],
                        }),
                        (0, b.jsxs)("div", {
                          className: "rollout-form-row",
                          children: [
                            (0, b.jsxs)("div", {
                              className: "rollout-form-group",
                              style: { flex: 1 },
                              children: [
                                (0, b.jsx)("label", { className: "rollout-label", children: "Model" }),
                                (0, b.jsx)("input", {
                                  type: "text",
                                  className: "rollout-input",
                                  list: "rollout-model-suggestions",
                                  placeholder: "e.g. gpt-5.2",
                                  value: u,
                                  onChange: (U) => f(U.target.value),
                                }),
                                (0, b.jsx)("datalist", {
                                  id: "rollout-model-suggestions",
                                  children: Nx.map((U) => (0, b.jsx)("option", { value: U }, U)),
                                }),
                              ],
                            }),
                            (0, b.jsxs)("div", {
                              className: "rollout-form-group",
                              style: { flex: 1 },
                              children: [
                                (0, b.jsx)("label", { className: "rollout-label", children: "Resolution" }),
                                (0, b.jsxs)("select", {
                                  className: "rollout-select",
                                  value: y ? "__custom__" : d,
                                  onChange: (U) => {
                                    U.target.value === "__custom__" ? T(!0) : (T(!1), g(U.target.value));
                                  },
                                  children: [
                                    Fi.map((U) => (0, b.jsx)("option", { value: U.value, children: U.label }, U.value)),
                                    (0, b.jsx)("option", { value: "__custom__", children: "Custom image..." }),
                                  ],
                                }),
                              ],
                            }),
                            (0, b.jsxs)("div", {
                              className: "rollout-form-group",
                              style: { flex: 1 },
                              children: [
                                (0, b.jsx)("label", { className: "rollout-label", children: "Timeout (s)" }),
                                (0, b.jsx)("input", {
                                  type: "number",
                                  className: "rollout-input",
                                  min: 60,
                                  max: 7200,
                                  value: x,
                                  onChange: (U) => C(U.target.value),
                                }),
                              ],
                            }),
                          ],
                        }),
                        y &&
                          (0, b.jsxs)("div", {
                            className: "rollout-form-group",
                            children: [
                              (0, b.jsx)("label", { className: "rollout-label", children: "Custom Docker Image" }),
                              (0, b.jsx)("input", {
                                type: "text",
                                className: "rollout-input",
                                placeholder: `${Eo}:my-tag`,
                                value: h,
                                onChange: (U) => p(U.target.value),
                              }),
                            ],
                          }),
                        (0, b.jsxs)("div", {
                          className: "rollout-form-group",
                          children: [
                            (0, b.jsxs)("label", {
                              className: "rollout-label",
                              children: [
                                "Tags",
                                " ",
                                (0, b.jsx)("span", {
                                  style: { color: "var(--muted)", fontWeight: 400 },
                                  children: "(comma-separated)",
                                }),
                              ],
                            }),
                            (0, b.jsx)("input", {
                              type: "text",
                              className: "rollout-input",
                              placeholder: "experiment-001, batch-1",
                              value: c,
                              onChange: (U) => m(U.target.value),
                            }),
                          ],
                        }),
                        (0, b.jsxs)("details", {
                          className: "rollout-form-details",
                          children: [
                            (0, b.jsx)("summary", {
                              className: "rollout-label",
                              style: { cursor: "pointer" },
                              children: "Advanced",
                            }),
                            (0, b.jsxs)("div", {
                              style: { display: "flex", flexDirection: "column", gap: 10, marginTop: 8 },
                              children: [
                                (0, b.jsxs)("div", {
                                  className: "rollout-form-group",
                                  children: [
                                    (0, b.jsxs)("label", {
                                      style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        fontSize: 12,
                                        color: "var(--muted)",
                                      },
                                      children: [
                                        (0, b.jsx)("input", {
                                          type: "checkbox",
                                          checked: F,
                                          onChange: (U) => w(U.target.checked),
                                        }),
                                        "Override command (replaces default",
                                        " ",
                                        (0, b.jsx)("code", { children: "gamecowork -m ... -y -p ..." }),
                                        ")",
                                      ],
                                    }),
                                    F &&
                                      (0, b.jsx)("input", {
                                        type: "text",
                                        className: "rollout-input",
                                        placeholder: "e.g. codex --model o3 $PROMPT  or  claude -p $PROMPT",
                                        value: M,
                                        onChange: (U) => z(U.target.value),
                                        style: { fontFamily: "var(--mono)", fontSize: 12, marginTop: 4 },
                                      }),
                                    !F &&
                                      (0, b.jsxs)("div", {
                                        style: { fontSize: 11, color: "var(--muted)", marginTop: 2 },
                                        children: [
                                          "Default:",
                                          " ",
                                          (0, b.jsxs)("code", {
                                            style: { fontSize: 11 },
                                            children: ["gamecowork -m ", u, " -y -p '...'"],
                                          }),
                                        ],
                                      }),
                                  ],
                                }),
                                (0, b.jsxs)("div", {
                                  className: "rollout-form-group",
                                  children: [
                                    (0, b.jsx)("label", {
                                      className: "rollout-label",
                                      style: { fontSize: 12 },
                                      children: "Environment Variables",
                                    }),
                                    (0, b.jsx)("textarea", {
                                      className: "rollout-textarea",
                                      rows: 3,
                                      placeholder: `KEY=VALUE
ANOTHER_KEY=value`,
                                      value: N,
                                      onChange: (U) => E(U.target.value),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        (0, b.jsxs)("div", {
                          className: "rollout-dialog-footer",
                          children: [
                            (0, b.jsxs)("span", {
                              style: { color: "var(--muted)", fontSize: 12 },
                              children: [
                                o
                                  .split(
                                    `
`,
                                  )
                                  .filter((U) => U.trim() && !U.trim().startsWith("#")).length,
                                " ",
                                "task(s) will be created",
                              ],
                            }),
                            (0, b.jsxs)("div", {
                              className: "rollout-row",
                              children: [
                                (0, b.jsx)("button", { className: "btn", onClick: l, children: "Cancel" }),
                                (0, b.jsx)("button", {
                                  className: "btn primary",
                                  onClick: Dt,
                                  disabled: !o
                                    .split(
                                      `
`,
                                    )
                                    .some((U) => U.trim() && !U.trim().startsWith("#")),
                                  children: "Submit",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    })
                  : (0, b.jsxs)("div", {
                      className: "rollout-dialog-body",
                      children: [
                        (0, b.jsxs)("div", {
                          className: "rollout-form-group",
                          style: { flex: 1, display: "flex", flexDirection: "column" },
                          children: [
                            (0, b.jsxs)("label", {
                              className: "rollout-label",
                              children: [
                                "Request JSON",
                                (0, b.jsx)("span", {
                                  style: { color: "var(--muted)", fontWeight: 400, marginLeft: 8 },
                                  children: "POST /__gamecowork__/control-plane/rollout/tasks",
                                }),
                              ],
                            }),
                            (0, b.jsx)("textarea", {
                              className: "rollout-textarea rollout-json-editor",
                              value: Z,
                              onChange: (U) => {
                                (L(U.target.value), X(""));
                              },
                              spellCheck: !1,
                            }),
                            H && (0, b.jsx)("div", { className: "rollout-json-error", children: H }),
                          ],
                        }),
                        (0, b.jsxs)("div", {
                          className: "rollout-dialog-footer",
                          children: [
                            (0, b.jsx)("button", {
                              className: "btn",
                              onClick: () => {
                                let U = { ...wx, model: n.model, image: n.image, timeout: n.timeout };
                                (L(JSON.stringify(U, null, 2)), X(""));
                              },
                              children: "Reset Template",
                            }),
                            (0, b.jsxs)("div", {
                              className: "rollout-row",
                              children: [
                                (0, b.jsx)("button", { className: "btn", onClick: l, children: "Cancel" }),
                                (0, b.jsx)("button", { className: "btn primary", onClick: Ut, children: "Submit" }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
              ],
            }),
          ],
        })
      : null;
  },
  Rx = ({ apiBase: t }) => {
    let [e, n] = (0, $.useState)([]),
      [l, i] = (0, $.useState)(null),
      [r, a] = (0, $.useState)("20"),
      [o, s] = (0, $.useState)("active"),
      [u, f] = (0, $.useState)("all"),
      [c, m] = (0, $.useState)(null),
      [d, g] = (0, $.useState)("16"),
      [x, C] = (0, $.useState)(!1),
      [h, p] = (0, $.useState)("form"),
      [y, T] = (0, $.useState)(""),
      [N, E] = (0, $.useState)(""),
      [M, z] = (0, $.useState)(""),
      [F, w] = (0, $.useState)(""),
      [Z, L] = (0, $.useState)(""),
      [H, X] = (0, $.useState)(!1),
      [tt, st] = (0, $.useState)(""),
      [Dt, Ut] = (0, $.useState)(""),
      [U, k] = (0, $.useState)(null),
      [Rt, _t] = (0, $.useState)("container"),
      [S, ut] = (0, $.useState)(""),
      [pe, he] = (0, $.useState)(!1),
      Ne = (0, $.useRef)(null);
    (0, $.useEffect)(() => {
      let v = Co(t, "/events"),
        _ = new EventSource(v);
      return (
        (_.onmessage = (j) => {
          try {
            let P = JSON.parse(j.data);
            ((P.type === "task_added" || P.type === "task_updated") &&
              (n((J) => {
                let Pt = J.findIndex((Tt) => Tt.id === P.task.id);
                if (Pt >= 0) {
                  let Tt = [...J];
                  return ((Tt[Pt] = P.task), Tt);
                }
                return [P.task, ...J];
              }),
              P.task.id === U?.id && k(P.task)),
              P.type === "workers_updated" &&
                (a(String(P.desiredWorkers)), i((J) => J && { ...J, desiredWorkers: P.desiredWorkers })),
              P.type === "pool_updated" && m(P.pool));
          } catch {}
        }),
        () => _.close()
      );
    }, [t, U?.id]);
    let gt = (0, $.useCallback)(async () => {
      let [v, _, j] = await Promise.all([un(t, "/status"), un(t, "/tasks"), un(t, "/pool")]);
      (i(v), n(_), a(String(v.desiredWorkers)), m(j), j.desired > 0 && g(String(j.desired)));
    }, [t]);
    ((0, $.useEffect)(() => {
      gt();
    }, [gt]),
      (0, $.useEffect)(() => {
        l &&
          (T(l.config.image),
          E(l.config.model),
          z(String(l.config.timeout)),
          w(l.config.resultsDir),
          L(Ax(l.config.defaultEnv)),
          st(""));
      }, [l]));
    let se = (0, $.useMemo)(() => {
        let v = { total: e.length, running: 0, queued: 0, completed: 0, failed: 0 };
        for (let _ of e)
          _.status === "running"
            ? v.running++
            : _.status === "queued"
              ? v.queued++
              : _.status === "completed"
                ? v.completed++
                : v.failed++;
        return v;
      }, [e]),
      Xt = (0, $.useMemo)(() => e.filter((v) => v.status === "running" || v.status === "queued"), [e]),
      ge = (0, $.useMemo)(() => {
        let v = e.filter((_) => !["running", "queued"].includes(_.status));
        return u === "all" ? v : v.filter((_) => _.status === u);
      }, [e, u]),
      I = () => {
        l &&
          (T(l.config.image),
          E(l.config.model),
          z(String(l.config.timeout)),
          w(l.config.resultsDir),
          L(Ax(l.config.defaultEnv)),
          st(""));
      },
      V = async () => {
        let v = parseInt(M, 10);
        if (!y.trim()) {
          st("Image is required.");
          return;
        }
        if (!N.trim()) {
          st("Model is required.");
          return;
        }
        if (!F.trim()) {
          st("Results directory is required.");
          return;
        }
        if (isNaN(v) || v <= 0) {
          st("Timeout must be a positive number.");
          return;
        }
        (X(!0), st(""));
        try {
          (await un(t, "/config", "PUT", {
            image: y.trim(),
            model: N.trim(),
            timeout: v,
            resultsDir: F.trim(),
            defaultEnv: hp(Z),
          }),
            await gt());
        } catch (_) {
          st(_ instanceof Error ? _.message : "Failed to update config.");
        } finally {
          X(!1);
        }
      },
      Y = async () => {
        let v = parseInt(r, 10);
        isNaN(v) || v < 0 || (await un(t, "/workers", "POST", { count: v }));
      },
      K = async (v) => {
        (await un(t, "/tasks", "POST", v), C(!1), await gt());
      },
      et = async () => {
        let v = Dt.split(
          `
`,
        )
          .map((_) => _.trim())
          .filter((_) => _ && !_.startsWith("#"));
        v.length !== 0 &&
          (await un(t, "/tasks", "POST", { prompts: v, model: l?.config.model ?? "gpt-5.2" }), Ut(""), await gt());
      },
      ot = async (v) => {
        (await un(t, `/tasks/${v}/stop`, "POST"), await gt());
      },
      Et = async (v) => {
        (await un(t, `/tasks/${v}/retry`, "POST"), await gt());
      },
      ye = async () => {
        (await un(t, "/tasks/stop-all", "POST"), await gt());
      },
      Vt = async () => {
        (await un(t, "/tasks/clear", "POST"), await gt());
      },
      jt = async (v) => {
        let _ = v ?? parseInt(d, 10);
        isNaN(_) || _ < 0 || (await un(t, "/pool/warm", "POST", { count: _ }));
      },
      Ge = async () => {
        await un(t, "/pool/drain", "POST");
      },
      Le = async () => {
        await un(t, "/pool/destroy", "POST");
      },
      en = () => {
        Ne.current && (clearInterval(Ne.current), (Ne.current = null));
      },
      Xe = (0, $.useCallback)(
        async (v, _) => {
          let j = await Tx(t, `/tasks/${v}/logs/${_}`);
          return FN(j);
        },
        [t],
      ),
      R = (0, $.useCallback)(
        async (v, _) => {
          he(!0);
          try {
            if (_ === "container") {
              let j = await Xe(v.id, "container.log");
              ut(j || "(no container log yet)");
            } else if (_ === "unity") {
              let j = await Xe(v.id, "unity.log");
              ut(j || "(no unity log yet)");
            } else if (_ === "autosave") {
              let j = v.artifacts.find((P) => P.endsWith(".md") && P.startsWith("autosaves/"));
              if (j) {
                let P = await Tx(t, `/tasks/${v.id}/artifacts/${j}`);
                ut(P);
              } else ut("(no autosave MD found)");
            } else if (_ === "artifacts") {
              let j = v.artifacts;
              ut(
                j.length > 0
                  ? j.join(`
`)
                  : "(no artifacts)",
              );
            }
          } catch (j) {
            ut(`Error: ${j}`);
          }
          he(!1);
        },
        [t, Xe],
      ),
      q = (0, $.useCallback)(
        (v, _) => {
          if (v.status !== "running" || (_ !== "container" && _ !== "unity")) return;
          let j = _ === "container" ? "container.log" : "unity.log";
          Ne.current = setInterval(async () => {
            try {
              let P = await Xe(v.id, j);
              ut(P || "(waiting for output...)");
            } catch {}
          }, 2e3);
        },
        [Xe],
      ),
      nt = (0, $.useCallback)(
        async (v, _ = "container") => {
          (en(), k(v), _t(_), await R(v, _), q(v, _));
        },
        [R, q],
      ),
      rt = (0, $.useCallback)(
        async (v) => {
          (en(), _t(v), U && (await R(U, v), q(U, v)));
        },
        [U, R, q],
      ),
      wt = () => {
        (en(), k(null), ut(""));
      };
    (0, $.useEffect)(() => () => en(), []);
    let xe = (v) => {
      let _ = v.status === "running",
        j = ["completed", "failed", "stopped", "cancelled"].includes(v.status),
        P = v.artifacts?.some((Bt) => Bt.endsWith(".md") && Bt.startsWith("autosaves/")),
        J = v.artifacts?.some((Bt) => Bt.endsWith(".json") && Bt.startsWith("autosaves/")),
        Pt = (() => {
          let Bt = Fi.find((Sn) => Sn.image === v.image);
          return Bt ? Bt.label.split(" ")[0] : null;
        })(),
        Tt = (() => {
          let Bt = v.command?.match(/-m\s+(\S+)/);
          return Bt ? Bt[1] : v.model && v.model !== "custom" ? v.model : null;
        })();
      return (0, b.jsxs)(
        "div",
        {
          className: `rollout-task-card ${_ ? "is-running" : ""}`,
          children: [
            (0, b.jsxs)("div", {
              className: "rollout-task-card-header",
              children: [
                (0, b.jsxs)("div", {
                  className: "rollout-task-card-left",
                  children: [
                    (0, b.jsx)("span", { className: "rollout-task-id", children: v.id }),
                    Tt && (0, b.jsx)("span", { className: "rollout-task-model", children: Tt }),
                    Pt && (0, b.jsx)("span", { className: "rollout-task-resolution", children: Pt }),
                    v.tags.length > 0 &&
                      (0, b.jsx)("span", { className: "rollout-task-tags", children: v.tags.join(", ") }),
                  ],
                }),
                (0, b.jsx)("span", { className: `rollout-task-status ${v.status}`, children: v.status }),
              ],
            }),
            (0, b.jsx)("div", { className: "rollout-task-prompt", children: v.prompt }),
            (0, b.jsx)("div", { className: "rollout-task-command", children: v.command }),
            (0, b.jsxs)("div", {
              className: "rollout-task-meta",
              children: [
                v.startTime && (0, b.jsxs)("span", { children: ["\u23F1 ", Ex(v.startTime, _ ? null : v.endTime)] }),
                v.exitCode !== null && (0, b.jsxs)("span", { children: ["exit: ", v.exitCode] }),
                v.containerName && (0, b.jsxs)("span", { children: ["\u{1F4E6} ", v.containerName] }),
                v.artifacts?.length > 0 &&
                  (0, b.jsxs)("span", { children: ["\u{1F4CE} ", v.artifacts.length, " files"] }),
              ],
            }),
            (0, b.jsxs)("div", {
              className: "rollout-task-actions",
              children: [
                (0, b.jsx)("button", {
                  className: "btn rollout-btn-sm",
                  onClick: () => nt(v, "container"),
                  children: _ ? "Live Log" : "Log",
                }),
                P &&
                  (0, b.jsx)("button", {
                    className: "btn rollout-btn-sm",
                    onClick: () => nt(v, "autosave"),
                    children: "Autosave",
                  }),
                j &&
                  v.artifacts?.length > 0 &&
                  (0, b.jsx)("button", {
                    className: "btn rollout-btn-sm",
                    onClick: () => nt(v, "artifacts"),
                    children: "Artifacts",
                  }),
                J &&
                  (0, b.jsx)("a", {
                    className: "btn rollout-btn-sm",
                    href: Co(
                      t,
                      `/tasks/${v.id}/artifacts/${v.artifacts.find((Bt) => Bt.endsWith(".json") && Bt.startsWith("autosaves/"))}`,
                    ),
                    target: "_blank",
                    rel: "noreferrer",
                    children: "JSON \u2197",
                  }),
                _ &&
                  (0, b.jsx)("button", {
                    className: "btn danger rollout-btn-sm",
                    onClick: () => ot(v.id),
                    children: "Stop",
                  }),
                j &&
                  (0, b.jsx)("button", { className: "btn rollout-btn-sm", onClick: () => Et(v.id), children: "Retry" }),
              ],
            }),
          ],
        },
        v.id,
      );
    };
    return (0, b.jsxs)("div", {
      className: "rollout-app",
      children: [
        (0, b.jsxs)("div", {
          className: "rollout-stats",
          children: [
            (0, b.jsxs)("div", {
              className: "rollout-stat",
              onClick: () => s("active"),
              style: { cursor: "pointer" },
              children: [
                (0, b.jsx)("div", { className: "rollout-stat-value rollout-running", children: se.running }),
                (0, b.jsx)("div", { className: "rollout-stat-label", children: "Running" }),
              ],
            }),
            (0, b.jsxs)("div", {
              className: "rollout-stat",
              onClick: () => s("active"),
              style: { cursor: "pointer" },
              children: [
                (0, b.jsx)("div", { className: "rollout-stat-value rollout-queued", children: se.queued }),
                (0, b.jsx)("div", { className: "rollout-stat-label", children: "Queued" }),
              ],
            }),
            (0, b.jsxs)("div", {
              className: "rollout-stat",
              onClick: () => {
                (s("history"), f("completed"));
              },
              style: { cursor: "pointer" },
              children: [
                (0, b.jsx)("div", { className: "rollout-stat-value rollout-completed", children: se.completed }),
                (0, b.jsx)("div", { className: "rollout-stat-label", children: "Completed" }),
              ],
            }),
            (0, b.jsxs)("div", {
              className: "rollout-stat",
              onClick: () => {
                (s("history"), f("failed"));
              },
              style: { cursor: "pointer" },
              children: [
                (0, b.jsx)("div", { className: "rollout-stat-value rollout-failed", children: se.failed }),
                (0, b.jsx)("div", { className: "rollout-stat-label", children: "Failed" }),
              ],
            }),
            (0, b.jsxs)("div", {
              className: "rollout-stat",
              children: [
                (0, b.jsx)("div", { className: "rollout-stat-value", children: se.total }),
                (0, b.jsx)("div", { className: "rollout-stat-label", children: "Total" }),
              ],
            }),
          ],
        }),
        (0, b.jsxs)("div", {
          className: "rollout-tabs",
          children: [
            (0, b.jsxs)("button", {
              className: `rollout-tab ${o === "active" ? "active" : ""}`,
              onClick: () => s("active"),
              children: ["Active (", Xt.length, ")"],
            }),
            (0, b.jsxs)("button", {
              className: `rollout-tab ${o === "history" ? "active" : ""}`,
              onClick: () => s("history"),
              children: ["History (", ge.length, ")"],
            }),
            (0, b.jsxs)("button", {
              className: `rollout-tab ${o === "pool" ? "active" : ""}`,
              onClick: () => s("pool"),
              children: ["Pool (", c?.containers.length ?? 0, ")"],
            }),
            (0, b.jsx)("div", { style: { flex: 1 } }),
            (0, b.jsx)("button", {
              className: "btn rollout-btn-sm",
              style: { marginRight: 6 },
              onClick: () => {
                (p("form"), C(!0));
              },
              children: "+ New Tasks",
            }),
            (0, b.jsx)("button", {
              className: "btn rollout-btn-sm",
              style: { marginRight: 6 },
              onClick: () => {
                (p("json"), C(!0));
              },
              children: "{ } JSON",
            }),
            (0, b.jsx)("button", { className: "btn rollout-btn-sm", onClick: gt, children: "Refresh" }),
          ],
        }),
        (0, b.jsxs)("div", {
          className: "rollout-body",
          children: [
            (0, b.jsxs)("div", {
              className: "rollout-sidebar",
              children: [
                (0, b.jsxs)("div", {
                  className: "rollout-sidebar-section",
                  children: [
                    (0, b.jsx)("label", { className: "rollout-label", children: "Workers" }),
                    (0, b.jsxs)("div", {
                      className: "rollout-row",
                      children: [
                        (0, b.jsx)("input", {
                          type: "number",
                          className: "rollout-input rollout-input-sm",
                          min: 0,
                          max: 200,
                          value: r,
                          onChange: (v) => a(v.target.value),
                        }),
                        (0, b.jsx)("button", { className: "btn", onClick: Y, children: "Apply" }),
                      ],
                    }),
                  ],
                }),
                (0, b.jsxs)("div", {
                  className: "rollout-sidebar-section",
                  children: [
                    (0, b.jsx)("label", { className: "rollout-label", children: "Container Pool" }),
                    c && c.containers.length > 0
                      ? (0, b.jsxs)("div", {
                          className: "rollout-pool-status",
                          children: [
                            (0, b.jsxs)("div", {
                              className: "rollout-pool-counts",
                              style: { display: "flex", gap: "8px", fontSize: "13px", marginBottom: "6px" },
                              children: [
                                (0, b.jsxs)("span", { style: { color: "#4caf50" }, children: [c.idle, " idle"] }),
                                (0, b.jsxs)("span", { style: { color: "#ff9800" }, children: [c.busy, " busy"] }),
                                (0, b.jsxs)("span", {
                                  style: { color: "#2196f3" },
                                  children: [c.starting, " starting"],
                                }),
                                c.dead > 0 &&
                                  (0, b.jsxs)("span", { style: { color: "#f44336" }, children: [c.dead, " dead"] }),
                              ],
                            }),
                            (0, b.jsxs)("div", {
                              className: "rollout-row",
                              children: [
                                (0, b.jsx)("input", {
                                  type: "number",
                                  className: "rollout-input rollout-input-sm",
                                  min: 0,
                                  max: 50,
                                  value: d,
                                  onChange: (v) => g(v.target.value),
                                }),
                                (0, b.jsx)("button", { className: "btn", onClick: () => jt(), children: "Warm" }),
                                (0, b.jsx)("button", { className: "btn danger", onClick: Ge, children: "Drain" }),
                              ],
                            }),
                          ],
                        })
                      : (0, b.jsxs)("div", {
                          className: "rollout-row",
                          children: [
                            (0, b.jsx)("input", {
                              type: "number",
                              className: "rollout-input rollout-input-sm",
                              min: 0,
                              max: 50,
                              value: d,
                              onChange: (v) => g(v.target.value),
                            }),
                            (0, b.jsx)("button", { className: "btn", onClick: () => jt(), children: "Start Pool" }),
                          ],
                        }),
                  ],
                }),
                (0, b.jsxs)("div", {
                  className: "rollout-sidebar-section",
                  children: [
                    (0, b.jsx)("label", { className: "rollout-label", children: "Quick Add" }),
                    (0, b.jsx)("textarea", {
                      className: "rollout-textarea",
                      rows: 3,
                      placeholder: `One prompt per line...
Uses default model + image`,
                      value: Dt,
                      onChange: (v) => Ut(v.target.value),
                    }),
                    (0, b.jsxs)("div", {
                      className: "rollout-row",
                      style: { marginTop: 4 },
                      children: [
                        (0, b.jsx)("button", {
                          className: "btn primary",
                          style: { flex: 1 },
                          onClick: et,
                          disabled: !Dt.trim(),
                          children: "Add",
                        }),
                        (0, b.jsx)("button", {
                          className: "btn",
                          onClick: () => {
                            (p("form"), C(!0));
                          },
                          children: "+ Advanced",
                        }),
                      ],
                    }),
                  ],
                }),
                (0, b.jsxs)("div", {
                  className: "rollout-sidebar-section",
                  children: [
                    (0, b.jsx)("label", { className: "rollout-label", children: "Bulk Actions" }),
                    (0, b.jsxs)("div", {
                      className: "rollout-row",
                      children: [
                        (0, b.jsx)("button", { className: "btn danger", onClick: ye, children: "Stop All" }),
                        (0, b.jsx)("button", { className: "btn", onClick: Vt, children: "Clear Done" }),
                      ],
                    }),
                  ],
                }),
                l &&
                  (0, b.jsxs)("div", {
                    className: "rollout-sidebar-section",
                    children: [
                      (0, b.jsx)("label", { className: "rollout-label", children: "Current Config" }),
                      (0, b.jsxs)("div", {
                        className: "rollout-config-info",
                        children: [
                          (0, b.jsxs)("div", {
                            children: ["Image: ", (0, b.jsx)("code", { children: l.config.image.split("/").pop() })],
                          }),
                          (0, b.jsxs)("div", {
                            children: ["Model: ", (0, b.jsx)("code", { children: l.config.model })],
                          }),
                          (0, b.jsxs)("div", {
                            children: ["Timeout: ", (0, b.jsxs)("code", { children: [l.config.timeout, "s"] })],
                          }),
                          (0, b.jsxs)("div", {
                            children: [
                              "Resolution:",
                              " ",
                              (0, b.jsx)("code", { children: pp(l.config.image).replace("x24", "") }),
                            ],
                          }),
                        ],
                      }),
                      (0, b.jsxs)("details", {
                        className: "rollout-form-details",
                        style: { marginTop: 12 },
                        children: [
                          (0, b.jsx)("summary", {
                            className: "rollout-label",
                            style: { cursor: "pointer" },
                            children: "Edit Server Defaults",
                          }),
                          (0, b.jsxs)("div", {
                            className: "rollout-add-form",
                            style: { marginTop: 8 },
                            children: [
                              (0, b.jsxs)("div", {
                                className: "rollout-form-group",
                                children: [
                                  (0, b.jsx)("label", { className: "rollout-label", children: "Docker Image" }),
                                  (0, b.jsx)("input", {
                                    type: "text",
                                    className: "rollout-input",
                                    value: y,
                                    onChange: (v) => T(v.target.value),
                                  }),
                                ],
                              }),
                              (0, b.jsxs)("div", {
                                className: "rollout-form-group",
                                children: [
                                  (0, b.jsx)("label", { className: "rollout-label", children: "Model" }),
                                  (0, b.jsx)("input", {
                                    type: "text",
                                    className: "rollout-input",
                                    list: "rollout-server-model-suggestions",
                                    value: N,
                                    onChange: (v) => E(v.target.value),
                                  }),
                                  (0, b.jsx)("datalist", {
                                    id: "rollout-server-model-suggestions",
                                    children: Nx.map((v) => (0, b.jsx)("option", { value: v }, v)),
                                  }),
                                ],
                              }),
                              (0, b.jsxs)("div", {
                                className: "rollout-form-group",
                                children: [
                                  (0, b.jsx)("label", { className: "rollout-label", children: "Timeout (s)" }),
                                  (0, b.jsx)("input", {
                                    type: "number",
                                    min: 1,
                                    className: "rollout-input",
                                    value: M,
                                    onChange: (v) => z(v.target.value),
                                  }),
                                ],
                              }),
                              (0, b.jsxs)("div", {
                                className: "rollout-form-group",
                                children: [
                                  (0, b.jsx)("label", { className: "rollout-label", children: "Results Directory" }),
                                  (0, b.jsx)("input", {
                                    type: "text",
                                    className: "rollout-input",
                                    value: F,
                                    onChange: (v) => w(v.target.value),
                                  }),
                                ],
                              }),
                              (0, b.jsxs)("div", {
                                className: "rollout-form-group",
                                children: [
                                  (0, b.jsx)("label", { className: "rollout-label", children: "Default Environment" }),
                                  (0, b.jsx)("textarea", {
                                    className: "rollout-textarea",
                                    rows: 3,
                                    placeholder: `KEY=VALUE
ANOTHER_KEY=value`,
                                    value: Z,
                                    onChange: (v) => L(v.target.value),
                                  }),
                                ],
                              }),
                              tt && (0, b.jsx)("div", { className: "rollout-json-error", children: tt }),
                              (0, b.jsxs)("div", {
                                className: "rollout-row",
                                children: [
                                  (0, b.jsx)("button", { className: "btn", onClick: I, children: "Reset" }),
                                  (0, b.jsx)("button", {
                                    className: "btn primary",
                                    onClick: V,
                                    disabled: H,
                                    children: H ? "Saving..." : "Save Defaults",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
              ],
            }),
            (0, b.jsxs)("div", {
              className: "rollout-main",
              children: [
                o === "active" &&
                  (0, b.jsxs)(b.Fragment, {
                    children: [
                      (0, b.jsx)("div", {
                        className: "rollout-main-header",
                        children: (0, b.jsxs)("div", {
                          className: "rollout-main-title",
                          children: [
                            "Active Tasks",
                            Xt.length === 0 &&
                              (0, b.jsxs)("span", {
                                className: "rollout-hint",
                                children: [" ", "\u2014 no running or queued tasks"],
                              }),
                          ],
                        }),
                      }),
                      (0, b.jsx)("div", {
                        className: "rollout-task-list",
                        children:
                          Xt.length === 0
                            ? (0, b.jsxs)("div", {
                                className: "rollout-empty",
                                children: [
                                  "No active tasks. Use ",
                                  (0, b.jsx)("strong", { children: "+ New Tasks" }),
                                  " or the sidebar to add prompts.",
                                ],
                              })
                            : Xt.map(xe),
                      }),
                    ],
                  }),
                o === "history" &&
                  (0, b.jsxs)(b.Fragment, {
                    children: [
                      (0, b.jsxs)("div", {
                        className: "rollout-main-header",
                        children: [
                          (0, b.jsx)("div", { className: "rollout-main-title", children: "History" }),
                          (0, b.jsx)("div", {
                            className: "rollout-main-controls",
                            children: (0, b.jsxs)("select", {
                              className: "rollout-select",
                              value: u,
                              onChange: (v) => f(v.target.value),
                              children: [
                                (0, b.jsx)("option", { value: "all", children: "All" }),
                                (0, b.jsx)("option", { value: "completed", children: "Completed" }),
                                (0, b.jsx)("option", { value: "failed", children: "Failed" }),
                                (0, b.jsx)("option", { value: "stopped", children: "Stopped" }),
                              ],
                            }),
                          }),
                        ],
                      }),
                      (0, b.jsx)("div", {
                        className: "rollout-task-list",
                        children:
                          ge.length === 0
                            ? (0, b.jsx)("div", { className: "rollout-empty", children: "No history tasks." })
                            : ge.map(xe),
                      }),
                    ],
                  }),
                o === "pool" &&
                  (0, b.jsxs)(b.Fragment, {
                    children: [
                      (0, b.jsxs)("div", {
                        className: "rollout-main-header",
                        children: [
                          (0, b.jsxs)("div", {
                            className: "rollout-main-title",
                            children: [
                              "Container Pool",
                              c &&
                                (0, b.jsxs)("span", {
                                  className: "rollout-hint",
                                  children: [
                                    " ",
                                    "\u2014 ",
                                    c.containers.length,
                                    " containers (",
                                    c.enabled ? "enabled" : "disabled",
                                    ")",
                                  ],
                                }),
                            ],
                          }),
                          (0, b.jsx)("div", {
                            className: "rollout-main-controls",
                            children: (0, b.jsx)("button", {
                              className: "btn danger",
                              onClick: Le,
                              children: "Destroy All",
                            }),
                          }),
                        ],
                      }),
                      (0, b.jsx)("div", {
                        className: "rollout-task-list",
                        children:
                          !c || c.containers.length === 0
                            ? (0, b.jsx)("div", {
                                className: "rollout-empty",
                                children: "No pool containers. Use the sidebar to start a pool.",
                              })
                            : c.containers.map((v) =>
                                (0, b.jsxs)(
                                  "div",
                                  {
                                    className: `rollout-task-card ${v.state === "busy" ? "is-running" : ""}`,
                                    children: [
                                      (0, b.jsxs)("div", {
                                        className: "rollout-task-card-header",
                                        children: [
                                          (0, b.jsxs)("div", {
                                            className: "rollout-task-card-left",
                                            children: [
                                              (0, b.jsx)("span", { className: "rollout-task-id", children: v.name }),
                                              (0, b.jsxs)("span", {
                                                className: "rollout-task-model",
                                                children: ["port:", v.mcpPort],
                                              }),
                                            ],
                                          }),
                                          (0, b.jsx)("span", {
                                            className: `rollout-task-status ${v.state === "idle" ? "completed" : v.state === "busy" ? "running" : v.state === "dead" ? "failed" : "queued"}`,
                                            children: v.state,
                                          }),
                                        ],
                                      }),
                                      (0, b.jsxs)("div", {
                                        className: "rollout-task-meta",
                                        children: [
                                          (0, b.jsxs)("span", {
                                            children: ["Started: ", new Date(v.startedAt).toLocaleTimeString()],
                                          }),
                                          (0, b.jsxs)("span", { children: ["Uptime: ", Ex(v.startedAt, null)] }),
                                          (0, b.jsxs)("span", { children: ["Tasks done: ", v.tasksCompleted] }),
                                          v.currentTaskId &&
                                            (0, b.jsxs)("span", { children: ["Current: ", v.currentTaskId] }),
                                          v.lastHealthCheck &&
                                            (0, b.jsxs)("span", {
                                              children: [
                                                "Last check:",
                                                " ",
                                                new Date(v.lastHealthCheck).toLocaleTimeString(),
                                              ],
                                            }),
                                        ],
                                      }),
                                    ],
                                  },
                                  v.name,
                                ),
                              ),
                      }),
                    ],
                  }),
              ],
            }),
          ],
        }),
        l && (0, b.jsx)(VN, { open: x, mode: h, config: l.config, onClose: () => C(!1), onSubmit: K }),
        U &&
          (0, b.jsxs)(b.Fragment, {
            children: [
              (0, b.jsx)("div", { className: "rollout-log-backdrop", onClick: wt }),
              (0, b.jsxs)("div", {
                className: "rollout-log-panel",
                children: [
                  (0, b.jsxs)("div", {
                    className: "rollout-log-header",
                    children: [
                      (0, b.jsxs)("h3", {
                        children: [U.id, " \u2014 ", U.prompt.slice(0, 50), U.prompt.length > 50 ? "..." : ""],
                      }),
                      (0, b.jsxs)("div", {
                        className: "rollout-row",
                        children: [
                          U.status === "running" &&
                            (Rt === "container" || Rt === "unity") &&
                            (0, b.jsx)("span", { className: "rollout-live-dot", children: "\u25CF LIVE" }),
                          (0, b.jsx)("button", { className: "btn", onClick: wt, children: "Close" }),
                        ],
                      }),
                    ],
                  }),
                  (0, b.jsxs)("div", {
                    className: "rollout-detail-tabs",
                    children: [
                      (0, b.jsx)("button", {
                        className: `rollout-detail-tab ${Rt === "container" ? "active" : ""}`,
                        onClick: () => rt("container"),
                        children: U.status === "running" ? "\u25CF GameCowork Log" : "GameCowork Log",
                      }),
                      (0, b.jsx)("button", {
                        className: `rollout-detail-tab ${Rt === "unity" ? "active" : ""}`,
                        onClick: () => rt("unity"),
                        children: "Unity Log",
                      }),
                      (0, b.jsx)("button", {
                        className: `rollout-detail-tab ${Rt === "autosave" ? "active" : ""}`,
                        onClick: () => rt("autosave"),
                        children: "Autosave",
                      }),
                      (0, b.jsxs)("button", {
                        className: `rollout-detail-tab ${Rt === "artifacts" ? "active" : ""}`,
                        onClick: () => rt("artifacts"),
                        children: ["Artifacts (", U.artifacts?.length ?? 0, ")"],
                      }),
                    ],
                  }),
                  Rt === "artifacts"
                    ? (0, b.jsx)("div", {
                        className: "rollout-artifact-list",
                        children: (U.artifacts ?? []).map((v) =>
                          (0, b.jsxs)(
                            "a",
                            {
                              className: "rollout-artifact-item",
                              href: Co(t, `/tasks/${U.id}/artifacts/${v}`),
                              target: "_blank",
                              rel: "noreferrer",
                              children: [
                                (0, b.jsx)("span", {
                                  className: "rollout-artifact-icon",
                                  children: v.endsWith(".json")
                                    ? "\u{1F4C4}"
                                    : v.endsWith(".md")
                                      ? "\u{1F4DD}"
                                      : v.endsWith(".png")
                                        ? "\u{1F5BC}\uFE0F"
                                        : v.endsWith(".log") || v.endsWith(".txt")
                                          ? "\u{1F4CB}"
                                          : "\u{1F4CE}",
                                }),
                                v,
                              ],
                            },
                            v,
                          ),
                        ),
                      })
                    : (0, b.jsx)("pre", { className: `rollout-log-content ${pe ? "loading" : ""}`, children: S }),
                ],
              }),
            ],
          }),
      ],
    });
  };
var St = G(it(), 1);
function QN(t) {
  return t
    ? t
        .split("|")
        .map((e) => e.trim())
        .filter((e) => e.length > 0)
    : [];
}
function PN(t) {
  let e = [],
    n = /(^|\s)@([^\s]+)/g,
    l;
  for (; (l = n.exec(t)) !== null;) {
    let r = (l[2] ?? "").replace(/[),.;:!?]+$/g, "");
    r.length > 0 && e.push(r);
  }
  return Array.from(new Set(e));
}
function GN(t) {
  return t.kind === "tool";
}
function XN(t) {
  return t.kind === "message";
}
var ZN = ({ config: t }) => {
    let e = tb(t),
      {
        connection: n,
        sessionPhase: l,
        auth: i,
        availableCommands: r,
        planEntries: a,
        feed: o,
        tools: s,
        connect: u,
        sendPrompt: f,
        suggestPaths: c,
        completeSlashCommand: m,
        authenticate: d,
        statusText: g,
        permissionReq: x,
        resolvePermission: C,
        inputReq: h,
        resolveInput: p,
        isBusy: y,
        cancel: T,
      } = cx({
        cwd: t.cwd ?? "",
        wsPath: t.wsPath ?? "/ws",
        yolo: !!t.yolo,
        resumeSessionId: e,
        autoConnect: e !== void 0,
      }),
      [N, E] = (0, Mt.useState)(!1),
      M = (0, Mt.useRef)(null);
    Mt.default.useEffect(
      () => (
        M.current && clearTimeout(M.current),
        y
          ? (E(!1),
            (M.current = setTimeout(() => {
              E(!0);
            }, 500)))
          : E(!1),
        () => {
          M.current && clearTimeout(M.current);
        }
      ),
      [y, o, s],
    );
    let [z, F] = (0, Mt.useState)(null),
      w = (0, Mt.useRef)(null),
      [Z, L] = (0, Mt.useState)("");
    ax(w, [Z]);
    let [H, X] = (0, Mt.useState)([]),
      tt = (v) => {
        v.preventDefault();
        let _ = v.dataTransfer;
        if (_.files && _.files.length > 0) {
          let P = Array.from(_.files).map((J) => ({
            id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            type: "file",
            label: J.name,
            uri: J.name,
          }));
          X((J) => [...J, ...P]);
          return;
        }
        let j = _.getData("text");
        if (j) {
          let P = /^https?:\/\//.test(j);
          X((J) => [
            ...J,
            {
              id: `ref-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              type: P ? "link" : "default",
              label: j.length > 30 ? j.slice(0, 30) + "..." : j,
              uri: j,
            },
          ]);
        }
      },
      st = (v) => {
        X((_) => _.filter((j) => j.id !== v));
      },
      [Dt, Ut] = (0, Mt.useState)(!1),
      [U, k] = (0, Mt.useState)(0),
      [Rt, _t] = (0, Mt.useState)(!1),
      [S, ut] = (0, Mt.useState)(0),
      [pe, he] = (0, Mt.useState)([]),
      Ne = (0, Mt.useRef)(0),
      gt = (0, Mt.useMemo)(() => {
        let v = Z.trimStart();
        if (!v.startsWith("/")) return [];
        let _ = v.slice(1),
          j = /\s$/.test(_),
          P = _.split(/\s+/).filter((Tt) => Tt.length > 0),
          J = P,
          Pt = "";
        if ((!j && P.length > 0 && ((Pt = P[P.length - 1] ?? ""), (J = P.slice(0, -1))), J.length === 0)) {
          let Tt = Pt;
          return (r ?? []).filter((Bt) => Bt && Bt.name && Bt.name.startsWith(Tt)).slice(0, 10);
        }
        if (J.length === 1) {
          let Tt = J[0] ?? "",
            Bt = (r ?? []).find((D) => D.name === Tt),
            Sn = QN(Bt?.input?.hint ?? null);
          if (Sn.length === 0) return [];
          let qe = Pt;
          return Sn.filter((D) => D.startsWith(qe))
            .slice(0, 10)
            .map((D) => ({ name: `${Tt} ${D}`, description: Bt?.description ?? "" }));
        }
        return [];
      }, [r, Z]),
      [se, Xt] = (0, Mt.useState)(!1),
      [ge, I] = (0, Mt.useState)(0),
      [V, Y] = (0, Mt.useState)([]),
      [K, et] = (0, Mt.useState)(null),
      ot = (0, Mt.useRef)(null),
      Et = (0, Mt.useRef)(0),
      ye = (v, _) => {
        let j = v.slice(0, _),
          P = j.lastIndexOf("@");
        if (P < 0 || (P > 0 && !/\s/.test(j[P - 1] ?? ""))) return null;
        let J = j.slice(P + 1);
        return /\s/.test(J) ? null : { start: P, end: _, query: J };
      },
      Vt = se && V.length > 0,
      jt = Rt && pe.length > 0 && !Vt,
      Ge = Dt && gt.length > 0 && !Vt && !jt;
    (Mt.default.useEffect(() => {
      let v = Z.trimStart();
      if (!v.startsWith("/")) {
        (_t(!1), he((qe) => (qe.length === 0 ? qe : [])), ut(0));
        return;
      }
      let _ = v.slice(1),
        j = /\s$/.test(_),
        P = _.split(/\s+/).filter((qe) => qe.length > 0);
      if (P.length < 2) {
        (_t(!1), he((qe) => (qe.length === 0 ? qe : [])), ut(0));
        return;
      }
      let J = P.slice(2),
        Pt = J.length === 0 && j,
        Tt = J.length === 1 && !j;
      if (!Pt && !Tt) {
        (_t(!1), he((qe) => (qe.length === 0 ? qe : [])), ut(0));
        return;
      }
      let Bt = ++Ne.current,
        Sn = setTimeout(() => {
          (async () => {
            let qe = await m(v, 10);
            if (Bt !== Ne.current) return;
            let D = j ? J : J.slice(0, -1),
              kt = [...P.slice(0, 2), ...D].join(" ").trim(),
              Ot = qe.map((ee) => ({ name: `${kt} ${ee}`.trim(), description: "" }));
            (he(Ot), ut(0), _t(Ot.length > 0));
          })();
        }, 120);
      return () => clearTimeout(Sn);
    }, [m, Z]),
      Mt.default.useEffect(() => {
        if (!se || K === null) return;
        let v = ++Et.current,
          _ = setTimeout(() => {
            (async () => {
              let j = await c(K, 10);
              v === Et.current && (Y(j), I(0));
            })();
          }, 120);
        return () => clearTimeout(_);
      }, [K, se, c]));
    let Le = (v) => {
        let _ = gt[v];
        if (!_) return;
        let j = Z.match(/^\s*/)?.[0] ?? "";
        (L(`${j}/${_.name} `), Ut(!1), k(0), setTimeout(() => w.current?.focus(), 0));
      },
      en = (v) => {
        let _ = pe[v];
        if (!_) return;
        let j = Z.match(/^\s*/)?.[0] ?? "";
        (L(`${j}/${_.name} `), _t(!1), ut(0), setTimeout(() => w.current?.focus(), 0));
      },
      Xe = (v) => {
        let _ = V[v],
          j = ot.current;
        if (!_ || !j) return;
        let P = Z.slice(0, j.start),
          J = Z.slice(j.end),
          Pt = `@${_} `,
          Tt = `${P}${Pt}${J}`;
        (L(Tt),
          Xt(!1),
          Y([]),
          I(0),
          et(null),
          (ot.current = null),
          setTimeout(() => {
            let Bt = w.current;
            if (!Bt) return;
            Bt.focus();
            let Sn = P.length + Pt.length;
            Bt.setSelectionRange(Sn, Sn);
          }, 0));
      },
      R = async () => {
        let v = Z.trim();
        if (!v && H.length === 0) return;
        let _ = [],
          P = v || (H.length > 0 ? "Attached references." : "");
        if (H.length > 0) {
          let J = H.map((Tt) => `[${Tt.label}](${Tt.uri})`).join(" ");
          H.some((Tt) => Tt.type !== "file") &&
            (P = `${P}

References: ${J}`.trim());
        }
        (L(""),
          X([]),
          Ut(!1),
          k(0),
          Xt(!1),
          Y([]),
          I(0),
          et(null),
          (ot.current = null),
          _.push({ type: "text", text: P }));
        for (let J of PN(P)) _.push({ type: "resource_link", uri: `file://${J}`, name: J });
        for (let J of H)
          J.type === "file" && _.push({ type: "resource_link", uri: `file://${J.uri}`, name: J.label || J.uri });
        await f({ displayText: P, prompt: _ });
      },
      q = (0, Mt.useRef)(null),
      nt = (0, Mt.useRef)(null),
      rt = (0, Mt.useRef)(!0),
      wt = () => {
        q.current && q.current.scrollIntoView({ behavior: "auto", block: "end" });
      },
      xe = (v, _ = 100) => {
        let { scrollTop: j, scrollHeight: P, clientHeight: J } = v;
        return P - j - J < _;
      };
    return (
      Mt.default.useEffect(() => {
        let v = nt.current;
        if (!v) return;
        let _ = () => {
          rt.current = xe(v);
        };
        return (v.addEventListener("scroll", _, { passive: !0 }), () => v.removeEventListener("scroll", _));
      }, []),
      Mt.default.useLayoutEffect(() => {
        rt.current && wt();
      }, [o, s]),
      Mt.default.useEffect(() => {
        if (n !== "disconnected") return;
        let v = setTimeout(() => {
          u();
        }, 3e3);
        return () => clearTimeout(v);
      }, [n, u]),
      (0, St.jsxs)("div", {
        className: "app",
        children: [
          (0, St.jsxs)("div", {
            className: "main",
            children: [
              (0, St.jsxs)("div", {
                className: "content",
                ref: nt,
                children: [
                  n === "connected" && g
                    ? (0, St.jsx)("div", {
                        className: "session-notice",
                        role: "status",
                        "aria-live": "polite",
                        children: g,
                      })
                    : null,
                  o.map((v) => {
                    if (XN(v)) {
                      let _ = v.message;
                      return (0, St.jsx)(Bu, { message: _ }, _.id);
                    }
                    if (GN(v)) {
                      let _ = s.find((j) => j.toolCallId === v.toolCallId);
                      return _ ? (0, St.jsx)(qu, { tool: _, onOpenDiff: (j) => F(j) }, `tool_${v.toolCallId}`) : null;
                    }
                    return null;
                  }),
                  N &&
                    (0, St.jsx)("div", {
                      className: "planning-indicator",
                      children:
                        a.find((v) => v.status === "in_progress")?.content ||
                        a.find((v) => v.status === "pending")?.content ||
                        "Planning next moves\u2026",
                    }),
                  (0, St.jsx)("div", { ref: q, style: { height: 20 } }),
                ],
              }),
              (0, St.jsx)("div", {
                className: "composer",
                children: (0, St.jsxs)("div", {
                  className: "composer-inner",
                  children: [
                    (0, St.jsxs)("div", {
                      className: "input-wrap",
                      onDragOver: (v) => v.preventDefault(),
                      onDrop: tt,
                      children: [
                        H.length > 0 &&
                          (0, St.jsx)("div", {
                            className: "composer-references",
                            children: H.map((v) =>
                              (0, St.jsxs)(
                                "div",
                                {
                                  className: `ref-chip ${v.type}`,
                                  children: [
                                    (0, St.jsx)("span", { className: "ref-label", children: v.label }),
                                    (0, St.jsx)("button", {
                                      className: "ref-remove",
                                      onClick: () => st(v.id),
                                      children: "\xD7",
                                    }),
                                  ],
                                },
                                v.id,
                              ),
                            ),
                          }),
                        Vt ? (0, St.jsx)(G1, { items: V, activeIndex: ge, onPick: Xe, onHover: (v) => I(v) }) : null,
                        jt ? (0, St.jsx)(sp, { items: pe, activeIndex: S, onPick: en, onHover: (v) => ut(v) }) : null,
                        Ge ? (0, St.jsx)(sp, { items: gt, activeIndex: U, onPick: Le, onHover: (v) => k(v) }) : null,
                        (0, St.jsx)(ni, {
                          textareaRef: w,
                          value: Z,
                          placeholder:
                            l === "resuming"
                              ? "Restoring previous session, please wait\u2026"
                              : "Type a message\u2026 (use / for commands, @ for paths)",
                          disabled: l === "resuming",
                          onChange: (v) => {
                            let _ = v.target.value;
                            (L(_), Ut(!0));
                            let j = v.target.selectionStart ?? _.length,
                              P = ye(_, j);
                            ((ot.current = P), et(P ? P.query : null), Xt(!!P), P || (Y([]), I(0)));
                          },
                          onKeyDown: (v) => {
                            if (Vt && (v.key === "ArrowDown" || v.key === "ArrowUp")) {
                              v.preventDefault();
                              let _ = v.key === "ArrowDown" ? 1 : -1,
                                j = V.length;
                              j > 0 && I((P) => (P + _ + j) % j);
                              return;
                            }
                            if (Vt && (v.key === "Tab" || (v.key === "Enter" && !v.shiftKey))) {
                              (v.preventDefault(), Xe(ge));
                              return;
                            }
                            if (jt && (v.key === "ArrowDown" || v.key === "ArrowUp")) {
                              v.preventDefault();
                              let _ = v.key === "ArrowDown" ? 1 : -1,
                                j = pe.length;
                              j > 0 && ut((P) => (P + _ + j) % j);
                              return;
                            }
                            if (jt && (v.key === "Tab" || (v.key === "Enter" && !v.shiftKey))) {
                              (v.preventDefault(), en(S));
                              return;
                            }
                            if (Ge && (v.key === "ArrowDown" || v.key === "ArrowUp")) {
                              v.preventDefault();
                              let _ = v.key === "ArrowDown" ? 1 : -1,
                                j = gt.length;
                              j > 0 && k((P) => (P + _ + j) % j);
                              return;
                            }
                            if (Ge && v.key === "Tab") {
                              (v.preventDefault(), Le(U));
                              return;
                            }
                            if (Ge && v.key === "Enter" && !v.shiftKey) {
                              (v.preventDefault(), Le(U));
                              return;
                            }
                            if (v.key === "Escape") {
                              Vt
                                ? (Xt(!1), Y([]), I(0), et(null), (ot.current = null))
                                : Ge
                                  ? (Ut(!1), k(0))
                                  : jt
                                    ? (_t(!1), he([]), ut(0))
                                    : y && T();
                              return;
                            }
                            v.key === "Enter" && !v.shiftKey && (v.metaKey || v.ctrlKey) && (v.preventDefault(), R());
                          },
                          isBusy: y,
                          onSubmit: () => void R(),
                          onCancel: T,
                        }),
                      ],
                    }),
                    (0, St.jsxs)("div", {
                      className: "composer-footer",
                      children: [
                        (0, St.jsxs)("div", {
                          className: "workspace-info",
                          title: t.cwd,
                          children: ["Workspace: ", t.cwd || "(unknown)"],
                        }),
                        (0, St.jsxs)("div", {
                          className: "composer-footer-right",
                          children: [
                            (0, St.jsx)("div", {
                              className: "hint",
                              children:
                                "Cmd/Ctrl+Enter to send \xB7 Enter for newline \xB7 \u2191/\u2193 to pick command",
                            }),
                            (0, St.jsxs)("div", {
                              className: "status-bar",
                              onClick: () => void u(),
                              children: [
                                n === "disconnected" &&
                                  (0, St.jsx)("span", { className: "status-text", children: g || "Disconnected" }),
                                (0, St.jsx)("div", { className: `status-dot ${n}`, title: g || n }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          }),
          z
            ? (0, St.jsx)(Xr, { title: z.title, oldText: z.oldText, newText: z.newText, onClose: () => F(null) })
            : null,
          x
            ? Yu(x)
              ? (0, St.jsx)(ex, {
                  req: x,
                  onSubmit: (v) => {
                    let _ = x.options.find((j) => j.kind === "allow_once") ?? x.options[0];
                    if (!_) {
                      C({ outcome: { outcome: "cancelled" } });
                      return;
                    }
                    C({ outcome: { outcome: "selected", optionId: _.optionId }, _meta: tx(v) });
                  },
                  onCancel: () => C({ outcome: { outcome: "cancelled" } }),
                })
              : (0, St.jsx)(Z1, {
                  req: x,
                  onSelect: (v) => {
                    if (v.outcome === "cancelled") {
                      C({ outcome: { outcome: "cancelled" } });
                      return;
                    }
                    C({ outcome: { outcome: "selected", optionId: v.optionId }, ...(v.meta ? { _meta: v.meta } : {}) });
                  },
                })
            : null,
          h
            ? (0, St.jsx)(lx, {
                params: h,
                onDone: (v) => {
                  p(v);
                },
              })
            : null,
          i.open
            ? (0, St.jsx)(ix, {
                methods: i.methods,
                onPick: (v) => void d(v),
                onClose: () => {
                  console.warn("Auth dialog closed by user");
                },
              })
            : null,
        ],
      })
    );
  },
  Mx = () => {
    let t = Wv();
    if (Rd(t) === "control-plane" && typeof window < "u" && window.location.pathname.startsWith("/rollout")) {
      let e = tu(t);
      return (0, St.jsx)(Rx, { apiBase: e });
    }
    return Rd(t) === "control-plane" ? (0, St.jsx)(Sx, { config: t }) : (0, St.jsx)(ZN, { config: t });
  };
var gp = G(it(), 1);
var Ox = document.getElementById("app");
if (!Ox) throw new Error("Missing #app container");
(0, _x.createRoot)(Ox).render((0, gp.jsx)(Dx.default.StrictMode, { children: (0, gp.jsx)(Mx, {}) }));
/**
 * @license
 * Copyright 2025 GameCowork
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2026 GameCowork
 * SPDX-License-Identifier: Apache-2.0
 */
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.js:
  (**
   * @license React
   * scheduler.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom-client.production.js:
  (**
   * @license React
   * react-dom-client.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
