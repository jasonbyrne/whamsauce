/// <reference path="router.ts" />

namespace Whamsauce {

    export class Exception {
        protected message:string = null;
        constructor(message:string) {
            this.message = message;
        }
        public getMessage():string {
            return this.message;
        }
    }

    /**
     * Minimalistic promise object used internally
     */
    export class Promise {

        protected _resolved:boolean = false;
        protected _opts:any = null;
        protected _callback:Function = null;

        protected done() {
            if (this._callback != null) {
                let me = this;
                setTimeout(function() {
                    me._callback.apply(me, [me._opts]);
                }, 0);
            }
        }

        public then(callback:Function) {
            // Remember callback
            this._callback = callback;
            // If it was already completed
            if (this._resolved) {
                this.done();
            }
        }

        public resolve(opts?:any) {
            // If it was already completed
            if (this._resolved) {
                return null;
            }
            // Remember it has been resolved already and the options
            this._resolved = true;
            this._opts = (opts || {});
            this.done();
        }

    }

    /**
     * Simple file and script loader
     */
    export class Load {

        static all(...args:any[]) {
            let promise = new Promise(),
                results:Object = {},
                count = 0,
                doneCheck = function(url:string, result:any) {
                    results[url] = result;
                    count++;
                    if (count == arguments.length) {
                        promise.resolve(results);
                    }
                };
            for (let i=0; i < arguments.length; i++) {
                let url = arguments[i];
                if ((/\.js$/).test(url)) {
                    Load.script(url).then(function(result) {
                        doneCheck(url, result);
                    });
                }
                else if ((/\.json$/).test(url)) {
                    Load.json(url).then(function(result) {
                        doneCheck(url, result);
                    });
                }
                else {
                    Load.file(url).then(function(result) {
                        doneCheck(url, result);
                    });
                }
            }
            return promise;
        }

        /**
         *
         * @param url
         * @returns {Whamsauce.Promise}
         */
        static script(url:string):Promise {
            // Create a new script and setup the basics.
            let script = document.createElement("script"),
                head = document.getElementsByTagName('head')[0],
                promise = new Promise();
            // Create
            script.async = true;
            script.src = url;
            script.onload = function() {
                script.onload = null;
                promise.resolve({
                    "url": url
                });
            };
            script.onerror = function() {
                promise.resolve({
                    error: 'Error loading script'
                });
            };
            // Attach the script tag to the page (before the first script) so the magic can happen.
            head.appendChild(script);
            return promise;
        }

        /**
         *
         * @param url
         * @returns {Whamsauce.Promise}
         */
        static file(url:string):Promise {
            let request = new XMLHttpRequest(),
                promise = new Promise();
            request.open('GET', url, true);
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    promise.resolve({
                        data: request.responseText
                    });
                } else {
                    promise.resolve({
                        error: 'Error loading file'
                    });
                }
            };
            request.onerror = function() {
                promise.resolve({
                    error: 'Error loading file'
                });
            };
            request.send();
            return promise;
        }

        /**
         *
         * @param url
         * @returns {Whamsauce.Promise}
         */
        static json(url:string):Promise {
            let promise = new Promise();
            Load.file(url).then(function(result) {
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
        }

    }


}

const PATH_ROUTES:string = '/conf/routes.json',
    PATH_ROUTER:string = '/app/router.js',
    PATH_COMPONENT:string = '/app/component.js',
    PATH_CONTROLLER:string = '/app/controller.js';

// Initialize our base script after the DOM has loaded
document.addEventListener("DOMContentLoaded", function() {

    window.addEventListener('popstate', function(event) {
        Whamsauce.Router.execute(window.location.pathname);
    }, false);

    Whamsauce.Load.all(
        PATH_ROUTES,
        PATH_ROUTER,
        PATH_COMPONENT,
        PATH_CONTROLLER,
        '/vendor/handlebars.min.js',
        '/vendor/cash.min.js'
    ).then(function(results) {
        Whamsauce.Router.init(results[PATH_ROUTES].data);

        $('body').on('click', 'a', function(e) {
            e.preventDefault();
            let href:string = $(this).attr('href');
            history.pushState(null, null, href);
            Whamsauce.Router.execute(href);
        });

    });




});
