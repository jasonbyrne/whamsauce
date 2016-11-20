/// <reference path="../../typings/handlebars.d.ts" />
/// <reference path="whamsauce.ts" />
var Whamsauce;
(function (Whamsauce) {
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
    Whamsauce.Rule = Rule;
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
            Whamsauce.Router.instance = router;
            Whamsauce.Router.execute(window.location.pathname);
        };
        /**
         *
         * @param path
         * @returns {Rule}
         */
        Router.evaluate = function (path) {
            if (Whamsauce.Router.instance == null) {
                throw new Whamsauce.Exception('Router not yet instantiated');
            }
            var me = Whamsauce.Router.instance, matchingRule = null, i = 0;
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
         * @returns {Whamsauce.Promise}
         */
        Router.execute = function (path, selector) {
            var promise = new Whamsauce.Promise(), rule = Whamsauce.Router.evaluate(path);
            // If found a matching rule
            if (rule != null) {
                var data = rule.getParams(path);
                Whamsauce.Component.load(rule.componentName, data).then(function (controller) {
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
    Whamsauce.Router = Router;
})(Whamsauce || (Whamsauce = {}));
//# sourceMappingURL=router.js.map