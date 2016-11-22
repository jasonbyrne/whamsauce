"use strict";
var Rule = require("./rule").Rule, Component = require("./component").Component, Promise = require("./promise").Promise, Exception = require("./exception").Exception;
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