/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Whamsauce = window.Whamsauce = __webpack_require__(1);

	Whamsauce.App.init({
	    "/": "Home",
	    "/profiles/{name}/test/{id}": "Profile",
	    ".*": "FileNotFound"
	}).then(function() {
	    Whamsauce.Router.execute(window.location.pathname);
	});



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Promise = __webpack_require__(2).Promise, Load = __webpack_require__(3).Load, Rule = __webpack_require__(4).Rule, Router = __webpack_require__(5).Router, Controller = __webpack_require__(6).Controller, Component = __webpack_require__(7).Component, Exception = __webpack_require__(8).Exception;
	exports.Promise = Promise;
	exports.Load = Load;
	exports.Rule = Rule;
	exports.Router = Router;
	exports.Controller = Controller;
	exports.Component = Component;
	exports.Exception = Exception;
	var App = (function () {
	    function App() {
	    }
	    App.init = function (routes) {
	        var promise = new Promise();
	        // Listen for history change
	        window.addEventListener('popstate', function () {
	            Router.execute(window.location.pathname);
	        }, false);
	        // Listen for hash change
	        window.addEventListener("hashchange", function () {
	            var hash = location.hash;
	            if (hash.length > 0) {
	                hash = hash.substr(1, hash.length - 1);
	                Router.execute(hash);
	            }
	        });
	        //
	        Load.all('/vendor/handlebars.min.js', '/vendor/cash.min.js').then(function (results) {
	            Router.init(routes);
	            $('body').on('click', 'a', function (e) {
	                var href = $(this).attr('href');
	                if (href.length > 0 && href.substr(0, 1) == '/') {
	                    e.preventDefault();
	                    history.pushState(null, null, href);
	                    Router.execute(href);
	                }
	            });
	            promise.resolve();
	        });
	        return promise;
	    };
	    return App;
	}());
	exports.App = App;
	//# sourceMappingURL=app.js.map

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Minimalistic promise object used internally
	 */
	var Promise = (function () {
	    function Promise() {
	        this._resolved = false;
	        this._opts = null;
	        this._callback = null;
	    }
	    Promise.prototype.done = function () {
	        if (this._callback != null) {
	            var me_1 = this;
	            setTimeout(function () {
	                me_1._callback.apply(me_1, [me_1._opts]);
	            }, 0);
	        }
	    };
	    Promise.prototype.then = function (callback) {
	        // Remember callback
	        this._callback = callback;
	        // If it was already completed
	        if (this._resolved) {
	            this.done();
	        }
	    };
	    Promise.prototype.resolve = function (opts) {
	        // If it was already completed
	        if (this._resolved) {
	            return null;
	        }
	        // Remember it has been resolved already and the options
	        this._resolved = true;
	        this._opts = (opts || {});
	        this.done();
	    };
	    return Promise;
	}());
	exports.Promise = Promise;
	//# sourceMappingURL=promise.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// <reference path="./promise.ts" />
	"use strict";
	var Promise = __webpack_require__(2).Promise;
	/**
	 * Simple file and script loader
	 */
	var Load = (function () {
	    function Load() {
	    }
	    Load.all = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i - 0] = arguments[_i];
	        }
	        var promise = new Promise(), results = {}, count = 0, doneCheck = function (url, result) {
	            results[url] = result;
	            count++;
	            if (count == arguments.length) {
	                promise.resolve(results);
	            }
	        };
	        var _loop_1 = function(i) {
	            var url = arguments_1[i];
	            if ((/\.js$/).test(url)) {
	                Load.script(url).then(function (result) {
	                    doneCheck(url, result);
	                });
	            }
	            else if ((/\.json$/).test(url)) {
	                Load.json(url).then(function (result) {
	                    doneCheck(url, result);
	                });
	            }
	            else {
	                Load.file(url).then(function (result) {
	                    doneCheck(url, result);
	                });
	            }
	        };
	        var arguments_1 = arguments;
	        for (var i = 0; i < arguments.length; i++) {
	            _loop_1(i);
	        }
	        return promise;
	    };
	    /**
	     *
	     * @param url
	     * @returns {Promise}
	     */
	    Load.script = function (url) {
	        // Create a new script and setup the basics.
	        var script = document.createElement("script"), head = document.getElementsByTagName('head')[0], promise = new Promise();
	        // Create
	        script.async = true;
	        script.src = url;
	        script.onload = function () {
	            script.onload = null;
	            promise.resolve({
	                "url": url
	            });
	        };
	        script.onerror = function () {
	            promise.resolve({
	                error: 'Error loading script'
	            });
	        };
	        // Attach the script tag to the page (before the first script) so the magic can happen.
	        head.appendChild(script);
	        return promise;
	    };
	    /**
	     *
	     * @param url
	     * @returns {Promise}
	     */
	    Load.file = function (url) {
	        var request = new XMLHttpRequest(), promise = new Promise();
	        request.open('GET', url, true);
	        request.onload = function () {
	            if (request.status >= 200 && request.status < 400) {
	                promise.resolve({
	                    data: request.responseText
	                });
	            }
	            else {
	                promise.resolve({
	                    error: 'Error loading file'
	                });
	            }
	        };
	        request.onerror = function () {
	            promise.resolve({
	                error: 'Error loading file'
	            });
	        };
	        request.send();
	        return promise;
	    };
	    /**
	     *
	     * @param url
	     * @returns {Promise}
	     */
	    Load.json = function (url) {
	        var promise = new Promise();
	        Load.file(url).then(function (result) {
	            if (result.error) {
	                promise.resolve(result);
	            }
	            else {
	                promise.resolve({
	                    data: JSON.parse(result.data)
	                });
	            }
	        });
	        return promise;
	    };
	    return Load;
	}());
	exports.Load = Load;
	//# sourceMappingURL=load.js.map

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	var Rule = (function () {
	    /**
	     *
	     * @param pattern
	     * @param component
	     */
	    function Rule(pattern, component) {
	        this.params = [];
	        this.rawPattern = pattern;
	        this.componentName = component;
	        this.componentPath = component.replace('_', '/');
	        // Get pattern parameters
	        var matches = pattern.match(/{[a-z0-9_]+}/ig);
	        if (matches != null) {
	            for (var i = 0; i < matches.length; i++) {
	                var param = matches[i];
	                this.params.push(param.substring(1, param.length - 1));
	            }
	        }
	        // Turn pattern into regex
	        pattern = pattern.replace(/{[a-z0-9_]+}/ig, '([a-z0-9_]+)');
	        this.pattern = new RegExp('^' + pattern + '$', 'i');
	    }
	    /**
	     *
	     * @param path
	     * @returns {any}
	     */
	    Rule.prototype.getParams = function (path) {
	        var out = {}, matches = path.match(this.pattern);
	        if (matches != null) {
	            for (var i = 1; i < matches.length; i++) {
	                var key = this.params[i - 1];
	                out[key] = matches[i];
	            }
	        }
	        return out;
	    };
	    /**
	     *
	     * @param path
	     * @returns {boolean}
	     */
	    Rule.prototype.isMatch = function (path) {
	        return this.pattern.test(path);
	    };
	    return Rule;
	}());
	exports.Rule = Rule;
	//# sourceMappingURL=rule.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Rule = __webpack_require__(4).Rule, Component = __webpack_require__(7).Component, Promise = __webpack_require__(2).Promise, Exception = __webpack_require__(8).Exception;
	var Router = (function () {
	    function Router() {
	        this._rules = [];
	    }
	    /**
	     *
	     * @param rules
	     */
	    Router.init = function (rules) {
	        var router = new Router();
	        for (var path in rules) {
	            router._rules.push(new Rule(path, rules[path]));
	        }
	        Router.instance = router;
	    };
	    /**
	     *
	     * @param path
	     * @returns {Rule}
	     */
	    Router.evaluate = function (path) {
	        if (Router.instance == null) {
	            throw new Exception('Router not yet instantiated');
	        }
	        var me = Router.instance, matchingRule = null, i = 0;
	        for (; i < me._rules.length; i++) {
	            if (me._rules[i].isMatch(path)) {
	                matchingRule = me._rules[i];
	                break;
	            }
	        }
	        return matchingRule;
	    };
	    /**
	     *
	     * @param path
	     * @param selector
	     * @returns {Promise}
	     */
	    Router.execute = function (path, selector) {
	        var promise = new Promise(), rule = Router.evaluate(path);
	        // If found a matching rule
	        if (rule != null) {
	            var data = rule.getParams(path);
	            data._path = path;
	            Component.load(rule.componentName, data).then(function (controller) {
	                var html = controller.render();
	                document.querySelector(selector || 'app').innerHTML = html;
	                promise.resolve({
	                    controller: controller,
	                    html: html
	                });
	            });
	        }
	        return promise;
	    };
	    Router.instance = null;
	    return Router;
	}());
	exports.Router = Router;
	//# sourceMappingURL=router.js.map

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by jasonbyrne on 11/20/16.
	 */
	"use strict";
	var Promise = __webpack_require__(2).Promise, Component = __webpack_require__(7).Component;
	var Controller = (function () {
	    function Controller(html, data) {
	        this.data = {};
	        this.template = null;
	        this.templateEngine = null;
	        this.templateEngine = Handlebars.create();
	        this.template = this.templateEngine.compile(html);
	        this.data = data || {};
	        this.dependenciesLoaded = this.loadPartials();
	    }
	    Controller.prototype.init = function (promise) {
	        return false;
	    };
	    Controller.prototype.onDependenciesLoaded = function (callback) {
	        this.dependenciesLoaded.then(callback);
	    };
	    Controller.prototype.partials = function () {
	        return {};
	    };
	    Controller.prototype.loadPartials = function () {
	        var me = this, promise = new Promise(), partials = this.partials(), partialsCount = 0, partialsLoaded = 0;
	        var _loop_1 = function(partialName) {
	            partialsCount++;
	            var componentName = partials[partialName];
	            Component.load(componentName, me.data).then(function (partial) {
	                me.templateEngine.registerPartial(partialName, partial.getTemplate());
	                partialsLoaded++;
	                if (partialsCount == partialsLoaded) {
	                    promise.resolve();
	                }
	            });
	        };
	        for (var partialName in partials) {
	            _loop_1(partialName);
	        }
	        if (partialsCount == 0) {
	            promise.resolve();
	        }
	        return promise;
	    };
	    Controller.prototype.render = function () {
	        return this.template(this.data);
	    };
	    Controller.prototype.getTemplate = function () {
	        return this.template;
	    };
	    return Controller;
	}());
	exports.Controller = Controller;
	//# sourceMappingURL=controller.js.map

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Promise = __webpack_require__(2).Promise, Controller = __webpack_require__(6).Controller, Load = __webpack_require__(3).Load;
	var Component = (function () {
	    function Component() {
	    }
	    Component.load = function (componentName, data) {
	        var promise = new Promise(), componentClassName = Component.getComponentClassName(componentName), componentPath = Component.getComponentPath(componentName), controllerPath = componentPath + 'controller.js', viewPath = componentPath + 'view.html';
	        Load.all(controllerPath, viewPath).then(function (results) {
	            // If not an error loading component
	            if (!results[controllerPath].error) {
	                var html = results[viewPath].data, controller_1 = new window[componentClassName](html, data);
	                // Wait for any sub-components to load
	                controller_1.onDependenciesLoaded(function () {
	                    var onceReady = new Promise(), init = controller_1.init(onceReady);
	                    // If synchronous initialization, just resolve it
	                    !init && onceReady.resolve();
	                    // Once it is ready
	                    onceReady.then(function () {
	                        promise.resolve(controller_1);
	                    });
	                });
	            }
	        });
	        return promise;
	    };
	    Component.getComponentPath = function (componentName) {
	        return '/components/' + componentName.toLowerCase() + '/';
	    };
	    Component.getComponentClassName = function (componentName) {
	        return 'Controller_' + componentName.charAt(0).toUpperCase() + componentName.slice(1);
	    };
	    return Component;
	}());
	exports.Component = Component;
	//# sourceMappingURL=component.js.map

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	var Exception = (function () {
	    function Exception(message) {
	        this.message = null;
	        this.message = message;
	    }
	    Exception.prototype.getMessage = function () {
	        return this.message;
	    };
	    return Exception;
	}());
	exports.Exception = Exception;
	//# sourceMappingURL=exception.js.map

/***/ }
/******/ ]);