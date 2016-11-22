"use strict";
var Promise = require("./promise").Promise, Load = require("./load").Load, Rule = require("./rule").Rule, Router = require("./router").Router, Controller = require("./controller").Controller, Component = require("./component").Component, Exception = require("./exception").Exception;
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