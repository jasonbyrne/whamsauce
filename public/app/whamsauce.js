/// <reference path="router.ts" />
var Whamsauce;
(function (Whamsauce) {
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
    Whamsauce.Exception = Exception;
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
    Whamsauce.Promise = Promise;
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
         * @returns {Whamsauce.Promise}
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
         * @returns {Whamsauce.Promise}
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
         * @returns {Whamsauce.Promise}
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
    Whamsauce.Load = Load;
})(Whamsauce || (Whamsauce = {}));
var PATH_ROUTES = '/conf/routes.json', PATH_ROUTER = '/app/router.js', PATH_COMPONENT = '/app/component.js', PATH_CONTROLLER = '/app/controller.js';
// Initialize our base script after the DOM has loaded
document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener('popstate', function (event) {
        Whamsauce.Router.execute(window.location.pathname);
    }, false);
    Whamsauce.Load.all(PATH_ROUTES, PATH_ROUTER, PATH_COMPONENT, PATH_CONTROLLER, '/vendor/handlebars.min.js', '/vendor/cash.min.js').then(function (results) {
        Whamsauce.Router.init(results[PATH_ROUTES].data);
        $('body').on('click', 'a', function (e) {
            e.preventDefault();
            var href = $(this).attr('href');
            history.pushState(null, null, href);
            Whamsauce.Router.execute(href);
        });
    });
});
//# sourceMappingURL=whamsauce.js.map