// <reference path="rule.ts" />
// <reference path="promise.ts" />
var Whamsauce;
(function (Whamsauce) {
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
                router._rules.push(new Whamsauce.Rule(path, rules[path]));
            }
            Whamsauce.Router.instance = router;
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
                data._path = path;
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