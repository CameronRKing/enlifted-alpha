import { v as vnode, h as hyperscriptVnode, a as hyperscript_1$1, r as render$1, b as hasOwn, c as componentcreated } from './common/render-afc49bc4.js';
import { c as createCommonjsModule, a as commonjsGlobal } from './common/_commonjsHelpers-b3efd043.js';
import './common/stream-73cd9106.js';

var trust = function(html) {
	if (html == null) html = "";
	return vnode("<", undefined, undefined, html, undefined, undefined)
};

var fragment = function() {
	var vnode$1 = hyperscriptVnode.apply(0, arguments);

	vnode$1.tag = "[";
	vnode$1.children = vnode.normalizeChildren(vnode$1.children);
	return vnode$1
};

hyperscript_1$1.trust = trust;
hyperscript_1$1.fragment = fragment;

var hyperscript_1 = hyperscript_1$1;

/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with 'new'.")
	if (typeof executor !== "function") throw new TypeError("executor must be a function.")

	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false);
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors};
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout;
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then;
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved with itself.")
					executeOnce(then.bind(value));
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value);
						for (var i = 0; i < list.length; i++) list[i](value);
						resolvers.length = 0, rejectors.length = 0;
						instance.state = shouldAbsorb;
						instance.retry = function() {execute(value);};
					});
				}
			}
			catch (e) {
				rejectCurrent(e);
			}
		}
	}
	function executeOnce(then) {
		var runs = 0;
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value);
			}
		}
		var onerror = run(rejectCurrent);
		try {then(run(resolveCurrent), onerror);} catch (e) {onerror(e);}
	}

	executeOnce(executor);
};
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance;
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value);
			else try {resolveNext(callback(value));} catch (e) {if (rejectNext) rejectNext(e);}
		});
		if (typeof instance.retry === "function" && state === instance.state) instance.retry();
	}
	var resolveNext, rejectNext;
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject;});
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false);
	return promise
};
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
};
PromisePolyfill.prototype.finally = function(callback) {
	return this.then(
		function(value) {
			return PromisePolyfill.resolve(callback()).then(function() {
				return value
			})
		},
		function(reason) {
			return PromisePolyfill.resolve(callback()).then(function() {
				return PromisePolyfill.reject(reason);
			})
		}
	)
};
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value);})
};
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value);})
};
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = [];
		if (list.length === 0) resolve([]);
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++;
					values[i] = value;
					if (count === total) resolve(values);
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject);
				}
				else consume(list[i]);
			})(i);
		}
	})
};
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject);
		}
	})
};

var polyfill = PromisePolyfill;

var promise = createCommonjsModule(function (module) {



if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") {
		window.Promise = polyfill;
	} else if (!window.Promise.prototype.finally) {
		window.Promise.prototype.finally = polyfill.prototype.finally;
	}
	module.exports = window.Promise;
} else if (typeof commonjsGlobal !== "undefined") {
	if (typeof commonjsGlobal.Promise === "undefined") {
		commonjsGlobal.Promise = polyfill;
	} else if (!commonjsGlobal.Promise.prototype.finally) {
		commonjsGlobal.Promise.prototype.finally = polyfill.prototype.finally;
	}
	module.exports = commonjsGlobal.Promise;
} else {
	module.exports = polyfill;
}
});

var render = render$1(typeof window !== "undefined" ? window : null);

var mountRedraw = function(render, schedule, console) {
	var subscriptions = [];
	var pending = false;
	var offset = -1;

	function sync() {
		for (offset = 0; offset < subscriptions.length; offset += 2) {
			try { render(subscriptions[offset], vnode(subscriptions[offset + 1]), redraw); }
			catch (e) { console.error(e); }
		}
		offset = -1;
	}

	function redraw() {
		if (!pending) {
			pending = true;
			schedule(function() {
				pending = false;
				sync();
			});
		}
	}

	redraw.sync = sync;

	function mount(root, component) {
		if (component != null && component.view == null && typeof component !== "function") {
			throw new TypeError("m.mount expects a component, not a vnode.")
		}

		var index = subscriptions.indexOf(root);
		if (index >= 0) {
			subscriptions.splice(index, 2);
			if (index <= offset) offset -= 2;
			render(root, []);
		}

		if (component != null) {
			subscriptions.push(root, component);
			render(root, vnode(component), redraw);
		}
	}

	return {mount: mount, redraw: redraw}
};

var mountRedraw$1 = mountRedraw(render, typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : null, typeof console !== "undefined" ? console : null);

var build = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""

	var args = [];
	for (var key in object) {
		destructure(key, object[key]);
	}

	return args.join("&")

	function destructure(key, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key + "[" + i + "]", value[i]);
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key + "[" + i + "]", value[i]);
			}
		}
		else args.push(encodeURIComponent(key) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""));
	}
};

var assign = Object.assign || function(target, source) {
	for (var key in source) {
		if (hasOwn.call(source, key)) target[key] = source[key];
	}
};

// Returns `path` from `template` + `params`
var build$1 = function(template, params) {
	if ((/:([^\/\.-]+)(\.{3})?:/).test(template)) {
		throw new SyntaxError("Template parameter names must be separated by either a '/', '-', or '.'.")
	}
	if (params == null) return template
	var queryIndex = template.indexOf("?");
	var hashIndex = template.indexOf("#");
	var queryEnd = hashIndex < 0 ? template.length : hashIndex;
	var pathEnd = queryIndex < 0 ? queryEnd : queryIndex;
	var path = template.slice(0, pathEnd);
	var query = {};

	assign(query, params);

	var resolved = path.replace(/:([^\/\.-]+)(\.{3})?/g, function(m, key, variadic) {
		delete query[key];
		// If no such parameter exists, don't interpolate it.
		if (params[key] == null) return m
		// Escape normal parameters, but not variadic ones.
		return variadic ? params[key] : encodeURIComponent(String(params[key]))
	});

	// In case the template substitution adds new query/hash parameters.
	var newQueryIndex = resolved.indexOf("?");
	var newHashIndex = resolved.indexOf("#");
	var newQueryEnd = newHashIndex < 0 ? resolved.length : newHashIndex;
	var newPathEnd = newQueryIndex < 0 ? newQueryEnd : newQueryIndex;
	var result = resolved.slice(0, newPathEnd);

	if (queryIndex >= 0) result += template.slice(queryIndex, queryEnd);
	if (newQueryIndex >= 0) result += (queryIndex < 0 ? "?" : "&") + resolved.slice(newQueryIndex, newQueryEnd);
	var querystring = build(query);
	if (querystring) result += (queryIndex < 0 && newQueryIndex < 0 ? "?" : "&") + querystring;
	if (hashIndex >= 0) result += template.slice(hashIndex);
	if (newHashIndex >= 0) result += (hashIndex < 0 ? "" : "&") + resolved.slice(newHashIndex);
	return result
};

var request = function($window, Promise, oncompletion) {
	var callbackCount = 0;

	function PromiseProxy(executor) {
		return new Promise(executor)
	}

	// In case the global Promise is some userland library's where they rely on
	// `foo instanceof this.constructor`, `this.constructor.resolve(value)`, or
	// similar. Let's *not* break them.
	PromiseProxy.prototype = Promise.prototype;
	PromiseProxy.__proto__ = Promise; // eslint-disable-line no-proto

	function makeRequest(factory) {
		return function(url, args) {
			if (typeof url !== "string") { args = url; url = url.url; }
			else if (args == null) args = {};
			var promise = new Promise(function(resolve, reject) {
				factory(build$1(url, args.params), args, function (data) {
					if (typeof args.type === "function") {
						if (Array.isArray(data)) {
							for (var i = 0; i < data.length; i++) {
								data[i] = new args.type(data[i]);
							}
						}
						else data = new args.type(data);
					}
					resolve(data);
				}, reject);
			});
			if (args.background === true) return promise
			var count = 0;
			function complete() {
				if (--count === 0 && typeof oncompletion === "function") oncompletion();
			}

			return wrap(promise)

			function wrap(promise) {
				var then = promise.then;
				// Set the constructor, so engines know to not await or resolve
				// this as a native promise. At the time of writing, this is
				// only necessary for V8, but their behavior is the correct
				// behavior per spec. See this spec issue for more details:
				// https://github.com/tc39/ecma262/issues/1577. Also, see the
				// corresponding comment in `request/tests/test-request.js` for
				// a bit more background on the issue at hand.
				promise.constructor = PromiseProxy;
				promise.then = function() {
					count++;
					var next = then.apply(promise, arguments);
					next.then(complete, function(e) {
						complete();
						if (count === 0) throw e
					});
					return wrap(next)
				};
				return promise
			}
		}
	}

	function hasHeader(args, name) {
		for (var key in args.headers) {
			if (hasOwn.call(args.headers, key) && name.test(key)) return true
		}
		return false
	}

	return {
		request: makeRequest(function(url, args, resolve, reject) {
			var method = args.method != null ? args.method.toUpperCase() : "GET";
			var body = args.body;
			var assumeJSON = (args.serialize == null || args.serialize === JSON.serialize) && !(body instanceof $window.FormData);
			var responseType = args.responseType || (typeof args.extract === "function" ? "" : "json");

			var xhr = new $window.XMLHttpRequest(), aborted = false, isTimeout = false;
			var original = xhr, replacedAbort;
			var abort = xhr.abort;

			xhr.abort = function() {
				aborted = true;
				abort.call(this);
			};

			xhr.open(method, url, args.async !== false, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined);

			if (assumeJSON && body != null && !hasHeader(args, /^content-type$/i)) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
			}
			if (typeof args.deserialize !== "function" && !hasHeader(args, /^accept$/i)) {
				xhr.setRequestHeader("Accept", "application/json, text/*");
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials;
			if (args.timeout) xhr.timeout = args.timeout;
			xhr.responseType = responseType;

			for (var key in args.headers) {
				if (hasOwn.call(args.headers, key)) {
					xhr.setRequestHeader(key, args.headers[key]);
				}
			}

			xhr.onreadystatechange = function(ev) {
				// Don't throw errors on xhr.abort().
				if (aborted) return

				if (ev.target.readyState === 4) {
					try {
						var success = (ev.target.status >= 200 && ev.target.status < 300) || ev.target.status === 304 || (/^file:\/\//i).test(url);
						// When the response type isn't "" or "text",
						// `xhr.responseText` is the wrong thing to use.
						// Browsers do the right thing and throw here, and we
						// should honor that and do the right thing by
						// preferring `xhr.response` where possible/practical.
						var response = ev.target.response, message;

						if (responseType === "json") {
							// For IE and Edge, which don't implement
							// `responseType: "json"`.
							if (!ev.target.responseType && typeof args.extract !== "function") response = JSON.parse(ev.target.responseText);
						} else if (!responseType || responseType === "text") {
							// Only use this default if it's text. If a parsed
							// document is needed on old IE and friends (all
							// unsupported), the user should use a custom
							// `config` instead. They're already using this at
							// their own risk.
							if (response == null) response = ev.target.responseText;
						}

						if (typeof args.extract === "function") {
							response = args.extract(ev.target, args);
							success = true;
						} else if (typeof args.deserialize === "function") {
							response = args.deserialize(response);
						}
						if (success) resolve(response);
						else {
							var completeErrorResponse = function() {
								try { message = ev.target.responseText; }
								catch (e) { message = response; }
								var error = new Error(message);
								error.code = ev.target.status;
								error.response = response;
								reject(error);
							};

							if (xhr.status === 0) {
								// Use setTimeout to push this code block onto the event queue
								// This allows `xhr.ontimeout` to run in the case that there is a timeout
								// Without this setTimeout, `xhr.ontimeout` doesn't have a chance to reject
								// as `xhr.onreadystatechange` will run before it
								setTimeout(function() {
									if (isTimeout) return
									completeErrorResponse();
								});
							} else completeErrorResponse();
						}
					}
					catch (e) {
						reject(e);
					}
				}
			};

			xhr.ontimeout = function (ev) {
				isTimeout = true;
				var error = new Error("Request timed out");
				error.code = ev.target.status;
				reject(error);
			};

			if (typeof args.config === "function") {
				xhr = args.config(xhr, args, url) || xhr;

				// Propagate the `abort` to any replacement XHR as well.
				if (xhr !== original) {
					replacedAbort = xhr.abort;
					xhr.abort = function() {
						aborted = true;
						replacedAbort.call(this);
					};
				}
			}

			if (body == null) xhr.send();
			else if (typeof args.serialize === "function") xhr.send(args.serialize(body));
			else if (body instanceof $window.FormData) xhr.send(body);
			else xhr.send(JSON.stringify(body));
		}),
		jsonp: makeRequest(function(url, args, resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++;
			var script = $window.document.createElement("script");
			$window[callbackName] = function(data) {
				delete $window[callbackName];
				script.parentNode.removeChild(script);
				resolve(data);
			};
			script.onerror = function() {
				delete $window[callbackName];
				script.parentNode.removeChild(script);
				reject(new Error("JSONP request failed"));
			};
			script.src = url + (url.indexOf("?") < 0 ? "?" : "&") +
				encodeURIComponent(args.callbackKey || "callback") + "=" +
				encodeURIComponent(callbackName);
			$window.document.documentElement.appendChild(script);
		}),
	}
};

var request$1 = request(typeof window !== "undefined" ? window : null, promise, mountRedraw$1.redraw);

var parse = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1);

	var entries = string.split("&"), counters = {}, data = {};
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=");
		var key = decodeURIComponent(entry[0]);
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : "";

		if (value === "true") value = true;
		else if (value === "false") value = false;

		var levels = key.split(/\]\[?|\[/);
		var cursor = data;
		if (key.indexOf("[") > -1) levels.pop();
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1];
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10));
			if (level === "") {
				var key = levels.slice(0, j).join();
				if (counters[key] == null) {
					counters[key] = Array.isArray(cursor) ? cursor.length : 0;
				}
				level = counters[key]++;
			}
			// Disallow direct prototype pollution
			else if (level === "__proto__") break
			if (j === levels.length - 1) cursor[level] = value;
			else {
				// Read own properties exclusively to disallow indirect
				// prototype pollution
				var desc = Object.getOwnPropertyDescriptor(cursor, level);
				if (desc != null) desc = desc.value;
				if (desc == null) cursor[level] = desc = isNumber ? [] : {};
				cursor = desc;
			}
		}
	}
	return data
};

// Returns `{path, params}` from `url`
var parse$1 = function(url) {
	var queryIndex = url.indexOf("?");
	var hashIndex = url.indexOf("#");
	var queryEnd = hashIndex < 0 ? url.length : hashIndex;
	var pathEnd = queryIndex < 0 ? queryEnd : queryIndex;
	var path = url.slice(0, pathEnd).replace(/\/{2,}/g, "/");

	if (!path) path = "/";
	else {
		if (path[0] !== "/") path = "/" + path;
		if (path.length > 1 && path[path.length - 1] === "/") path = path.slice(0, -1);
	}
	return {
		path: path,
		params: queryIndex < 0
			? {}
			: parse(url.slice(queryIndex + 1, queryEnd)),
	}
};

// Compiles a template into a function that takes a resolved path (without query
// strings) and returns an object containing the template parameters with their
// parsed values. This expects the input of the compiled template to be the
// output of `parsePathname`. Note that it does *not* remove query parameters
// specified in the template.
var compileTemplate = function(template) {
	var templateData = parse$1(template);
	var templateKeys = Object.keys(templateData.params);
	var keys = [];
	var regexp = new RegExp("^" + templateData.path.replace(
		// I escape literal text so people can use things like `:file.:ext` or
		// `:lang-:locale` in routes. This is all merged into one pass so I
		// don't also accidentally escape `-` and make it harder to detect it to
		// ban it from template parameters.
		/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g,
		function(m, key, extra) {
			if (key == null) return "\\" + m
			keys.push({k: key, r: extra === "..."});
			if (extra === "...") return "(.*)"
			if (extra === ".") return "([^/]+)\\."
			return "([^/]+)" + (extra || "")
		}
	) + "$");
	return function(data) {
		// First, check the params. Usually, there isn't any, and it's just
		// checking a static set.
		for (var i = 0; i < templateKeys.length; i++) {
			if (templateData.params[templateKeys[i]] !== data.params[templateKeys[i]]) return false
		}
		// If no interpolations exist, let's skip all the ceremony
		if (!keys.length) return regexp.test(data.path)
		var values = regexp.exec(data.path);
		if (values == null) return false
		for (var i = 0; i < keys.length; i++) {
			data.params[keys[i].k] = keys[i].r ? values[i + 1] : decodeURIComponent(values[i + 1]);
		}
		return true
	}
};

// Note: this is mildly perf-sensitive.
//
// It does *not* use `delete` - dynamic `delete`s usually cause objects to bail
// out into dictionary mode and just generally cause a bunch of optimization
// issues within engines.
//
// Ideally, I would've preferred to do this, if it weren't for the optimization
// issues:
//
// ```js
// const hasOwn = require("./hasOwn")
// const magic = [
//     "key", "oninit", "oncreate", "onbeforeupdate", "onupdate",
//     "onbeforeremove", "onremove",
// ]
// module.exports = (attrs, extras) => {
//     const result = Object.assign(Object.create(null), attrs)
//     for (const key of magic) delete result[key]
//     if (extras != null) for (const key of extras) delete result[key]
//     return result
// }
// ```


var magic = /^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$/;

var censor = function(attrs, extras) {
	var result = {};

	if (extras != null) {
		for (var key in attrs) {
			if (hasOwn.call(attrs, key) && !magic.test(key) && extras.indexOf(key) < 0) {
				result[key] = attrs[key];
			}
		}
	} else {
		for (var key in attrs) {
			if (hasOwn.call(attrs, key) && !magic.test(key)) {
				result[key] = attrs[key];
			}
		}
	}

	return result
};

var sentinel = {};

var router = function($window, mountRedraw) {
	var callAsync = $window == null
		// In case Mithril's loaded globally without the DOM, let's not break
		? null
		: typeof $window.setImmediate === "function" ? $window.setImmediate : $window.setTimeout;
	var p = promise.resolve();

	var scheduled = false;

	// state === 0: init
	// state === 1: scheduled
	// state === 2: done
	var ready = false;
	var state = 0;

	var compiled, fallbackRoute;

	var currentResolver = sentinel, component, attrs, currentPath, lastUpdate;

	var RouterRoot = {
		onbeforeupdate: function() {
			state = state ? 2 : 1;
			return !(!state || sentinel === currentResolver)
		},
		onremove: function() {
			$window.removeEventListener("popstate", fireAsync, false);
			$window.removeEventListener("hashchange", resolveRoute, false);
		},
		view: function() {
			if (!state || sentinel === currentResolver) return
			// Wrap in a fragment to preserve existing key semantics
			var vnode$1 = [vnode(component, attrs.key, attrs)];
			if (currentResolver) vnode$1 = currentResolver.render(vnode$1[0]);
			return vnode$1
		},
	};

	var SKIP = route.SKIP = {};

	function resolveRoute() {
		scheduled = false;
		// Consider the pathname holistically. The prefix might even be invalid,
		// but that's not our problem.
		var prefix = $window.location.hash;
		if (route.prefix[0] !== "#") {
			prefix = $window.location.search + prefix;
			if (route.prefix[0] !== "?") {
				prefix = $window.location.pathname + prefix;
				if (prefix[0] !== "/") prefix = "/" + prefix;
			}
		}
		// This seemingly useless `.concat()` speeds up the tests quite a bit,
		// since the representation is consistently a relatively poorly
		// optimized cons string.
		var path = prefix.concat()
			.replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
			.slice(route.prefix.length);
		var data = parse$1(path);

		assign(data.params, $window.history.state);

		function reject(e) {
			console.error(e);
			setPath(fallbackRoute, null, {replace: true});
		}

		loop(0);
		function loop(i) {
			// state === 0: init
			// state === 1: scheduled
			// state === 2: done
			for (; i < compiled.length; i++) {
				if (compiled[i].check(data)) {
					var payload = compiled[i].component;
					var matchedRoute = compiled[i].route;
					var localComp = payload;
					var update = lastUpdate = function(comp) {
						if (update !== lastUpdate) return
						if (comp === SKIP) return loop(i + 1)
						component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div";
						attrs = data.params, currentPath = path, lastUpdate = null;
						currentResolver = payload.render ? payload : null;
						if (state === 2) mountRedraw.redraw();
						else {
							state = 2;
							mountRedraw.redraw.sync();
						}
					};
					// There's no understating how much I *wish* I could
					// use `async`/`await` here...
					if (payload.view || typeof payload === "function") {
						payload = {};
						update(localComp);
					}
					else if (payload.onmatch) {
						p.then(function () {
							return payload.onmatch(data.params, path, matchedRoute)
						}).then(update, path === fallbackRoute ? null : reject);
					}
					else update("div");
					return
				}
			}

			if (path === fallbackRoute) {
				throw new Error("Could not resolve default route " + fallbackRoute + ".")
			}
			setPath(fallbackRoute, null, {replace: true});
		}
	}

	// Set it unconditionally so `m.route.set` and `m.route.Link` both work,
	// even if neither `pushState` nor `hashchange` are supported. It's
	// cleared if `hashchange` is used, since that makes it automatically
	// async.
	function fireAsync() {
		if (!scheduled) {
			scheduled = true;
			// TODO: just do `mountRedraw.redraw()` here and elide the timer
			// dependency. Note that this will muck with tests a *lot*, so it's
			// not as easy of a change as it sounds.
			callAsync(resolveRoute);
		}
	}

	function setPath(path, data, options) {
		path = build$1(path, data);
		if (ready) {
			fireAsync();
			var state = options ? options.state : null;
			var title = options ? options.title : null;
			if (options && options.replace) $window.history.replaceState(state, title, route.prefix + path);
			else $window.history.pushState(state, title, route.prefix + path);
		}
		else {
			$window.location.href = route.prefix + path;
		}
	}

	function route(root, defaultRoute, routes) {
		if (!root) throw new TypeError("DOM element being rendered to does not exist.")

		compiled = Object.keys(routes).map(function(route) {
			if (route[0] !== "/") throw new SyntaxError("Routes must start with a '/'.")
			if ((/:([^\/\.-]+)(\.{3})?:/).test(route)) {
				throw new SyntaxError("Route parameter names must be separated with either '/', '.', or '-'.")
			}
			return {
				route: route,
				component: routes[route],
				check: compileTemplate(route),
			}
		});
		fallbackRoute = defaultRoute;
		if (defaultRoute != null) {
			var defaultData = parse$1(defaultRoute);

			if (!compiled.some(function (i) { return i.check(defaultData) })) {
				throw new ReferenceError("Default route doesn't match any known routes.")
			}
		}

		if (typeof $window.history.pushState === "function") {
			$window.addEventListener("popstate", fireAsync, false);
		} else if (route.prefix[0] === "#") {
			$window.addEventListener("hashchange", resolveRoute, false);
		}

		ready = true;
		mountRedraw.mount(root, RouterRoot);
		resolveRoute();
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {};
			options.replace = true;
		}
		lastUpdate = null;
		setPath(path, data, options);
	};
	route.get = function() {return currentPath};
	route.prefix = "#!";
	route.Link = {
		view: function(vnode) {
			// Omit the used parameters from the rendered element - they are
			// internal. Also, censor the various lifecycle methods.
			//
			// We don't strip the other parameters because for convenience we
			// let them be specified in the selector as well.
			var child = hyperscript_1$1(
				vnode.attrs.selector || "a",
				censor(vnode.attrs, ["options", "params", "selector", "onclick"]),
				vnode.children
			);
			var options, onclick, href;

			// Let's provide a *right* way to disable a route link, rather than
			// letting people screw up accessibility on accident.
			//
			// The attribute is coerced so users don't get surprised over
			// `disabled: 0` resulting in a button that's somehow routable
			// despite being visibly disabled.
			if (child.attrs.disabled = Boolean(child.attrs.disabled)) {
				child.attrs.href = null;
				child.attrs["aria-disabled"] = "true";
				// If you *really* do want add `onclick` on a disabled link, use
				// an `oncreate` hook to add it.
			} else {
				options = vnode.attrs.options;
				onclick = vnode.attrs.onclick;
				// Easier to build it now to keep it isomorphic.
				href = build$1(child.attrs.href, vnode.attrs.params);
				child.attrs.href = route.prefix + href;
				child.attrs.onclick = function(e) {
					var result;
					if (typeof onclick === "function") {
						result = onclick.call(e.currentTarget, e);
					} else if (onclick == null || typeof onclick !== "object") ; else if (typeof onclick.handleEvent === "function") {
						onclick.handleEvent(e);
					}

					// Adapted from React Router's implementation:
					// https://github.com/ReactTraining/react-router/blob/520a0acd48ae1b066eb0b07d6d4d1790a1d02482/packages/react-router-dom/modules/Link.js
					//
					// Try to be flexible and intuitive in how we handle links.
					// Fun fact: links aren't as obvious to get right as you
					// would expect. There's a lot more valid ways to click a
					// link than this, and one might want to not simply click a
					// link, but right click or command-click it to copy the
					// link target, etc. Nope, this isn't just for blind people.
					if (
						// Skip if `onclick` prevented default
						result !== false && !e.defaultPrevented &&
						// Ignore everything but left clicks
						(e.button === 0 || e.which === 0 || e.which === 1) &&
						// Let the browser handle `target=_blank`, etc.
						(!e.currentTarget.target || e.currentTarget.target === "_self") &&
						// No modifier keys
						!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
					) {
						e.preventDefault();
						e.redraw = false;
						route.set(href, null, options);
					}
				};
			}
			return child
		},
	};
	route.param = function(key) {
		return attrs && key != null ? attrs[key] : attrs
	};

	return route
};

var route = router(typeof window !== "undefined" ? window : null, mountRedraw$1);

var find_1 = createCommonjsModule(function (module) {
module.exports.find = function(node, test) {
    if (test(node)) return node;

    if (node.instance) {
        return m.find(node.instance, test);
    } else if (node.children && node.children.length) {
        for (let idx = 0; idx < node.children.length; idx++) {
            if (!node.children[idx]) continue;

            const recurse = find(node.children[idx], test);
            if (recurse) return recurse;
        }
    }
    return null;
};

module.exports.findAll = function(node, test, acc = []) {
    // if node not given, assume one is attached to document.body
    if (!test && typeof node === 'function') {
        return module.exports.findAll(document.body.vnodes[0], node);
    }
    
    if (test(node)) acc.push(node);

    if (node.instance) {
        m.findAll(node.instance, test, acc);
    } else if (node.children && node.children.length) {
        for (let idx = 0; idx < node.children.length; idx++) {
            if (!node.children[idx]) continue;

            m.findAll(node.children[idx], test, acc);
        }
    }
    return acc;
};
});

var m$1 = function m() { return hyperscript_1.apply(this, arguments) };
m$1.m = hyperscript_1;
m$1.trust = hyperscript_1.trust;
m$1.fragment = hyperscript_1.fragment;
m$1.mount = mountRedraw$1.mount;
m$1.route = route;
m$1.render = render;
m$1.redraw = mountRedraw$1.redraw;
m$1.request = request$1.request;
m$1.jsonp = request$1.jsonp;
m$1.parseQueryString = parse;
m$1.buildQueryString = build;
m$1.parsePathname = parse$1;
m$1.buildPathname = build$1;
m$1.vnode = vnode;
m$1.PromisePolyfill = polyfill;
m$1.censor = censor;
const { find: find$1, findAll } = find_1;
m$1.find = find$1;
m$1.findAll = findAll;
m$1.componentCreated = componentcreated.addHandler;

// stub functions to help autocomplete
// logic is in mithil-rewrite snowpack plugin (happens at build-time)
// though a run-time version would be a fine idea too
// (to assist in rapid experimentation/prototyping in-browser)
m$1.xhtml = (str) => str;
m$1.cmp = (obj, cb) => {
    if (cb) cb(obj);
    return obj;
};

var mithril_js = m$1;

export default mithril_js;
//# sourceMappingURL=mithril.js.map
