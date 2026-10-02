//#region node_modules/@unity/hub-unity-version/dist/index.mjs
var e = class e {
	version;
	major;
	minor;
	update;
	channel;
	iteration;
	constructor(t) {
		if (typeof t != `string`) throw TypeError();
		let n = e.VERSION_REGEX.exec(t);
		if (n === null || n.length !== 6) throw TypeError(`UnityVersion: version argument is not a valid unity version`);
		this.version = t, this.major = parseInt(n[1], 10), this.minor = parseInt(n[2], 10), this.update = parseInt(n[3], 10), this.channel = n[4], this.iteration = parseInt(n[5], 10);
	}
	get branch() {
		return `${this.major}.${this.minor}`;
	}
	compare(t) {
		if (!(t instanceof e)) try {
			t = new e(t);
		} catch (e) {
			throw TypeError(`${JSON.stringify(t)} cannot be compared with UnityVersion instance`, { cause: e });
		}
		let n = t;
		return this.major === n.major ? this.minor === n.minor ? this.update === n.update ? this.channel === n.channel ? this.iteration === n.iteration ? 0 : this.iteration > n.iteration ? 1 : -1 : this.channel > n.channel ? 1 : -1 : this.update > n.update ? 1 : -1 : this.minor > n.minor ? 1 : -1 : this.major > n.major ? 1 : -1;
	}
	static isOfficial(t) {
		return e.#e(t, `f`);
	}
	static isAlpha(t) {
		return e.#e(t, `a`);
	}
	static isBeta(t) {
		return e.#e(t, `b`);
	}
	static #e(t, n) {
		let r = e.VERSION_REGEX.exec(t);
		return r === null || r.length < 5 ? !1 : r[4] === n;
	}
	static isValid(t) {
		if (typeof t != `string`) return !1;
		let n = e.VERSION_REGEX.exec(t);
		return !(n === null || n.length !== 6);
	}
	static VERSION_REGEX = /^(\d+)\.(\d+)\.(\d+)([a|b|f|p|c])(\d+)/;
};
//#endregion

export { e as UnityVersion };
