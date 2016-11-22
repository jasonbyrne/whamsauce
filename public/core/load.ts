// <reference path="./promise.ts" />

import { Promise } from './promise';


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
     * @returns {Promise}
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
     * @returns {Promise}
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
     * @returns {Promise}
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
