// <reference path="./promise.ts" />
"use strict";
var Promise = require("./promise").Promise;
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