// <reference path="rule.ts" />
// <reference path="promise.ts" />

namespace Whamsauce {

    export class Router {

        protected _rules:Array<Rule> = [];
        protected static instance:Router = null;

        /**
         *
         * @param rules
         */
        static init(rules:Object) {
            let router = new Router();
            for (let path in rules) {
                router._rules.push(new Rule(path, rules[path]));
            }
            Whamsauce.Router.instance = router;
        }

        /**
         *
         * @param path
         * @returns {Rule}
         */
        static evaluate(path:string):Rule {
            if (Whamsauce.Router.instance == null) {
                throw new Whamsauce.Exception('Router not yet instantiated');
            }
            let me:Router = Whamsauce.Router.instance,
                matchingRule:Rule = null,
                i = 0;
            for (; i < me._rules.length; i++) {
                if (me._rules[i].isMatch(path)) {
                    matchingRule = me._rules[i];
                    break;
                }
            }
            return matchingRule;
        }

        /**
         *
         * @param path
         * @param selector
         * @returns {Whamsauce.Promise}
         */
        static execute(path:string, selector?:string) {
            let promise = new Whamsauce.Promise(),
                rule:Rule = Whamsauce.Router.evaluate(path);
            // If found a matching rule
            if (rule != null) {
                let data = rule.getParams(path);
                data._path = path;
                Whamsauce.Component.load(rule.componentName, data).then(function(controller:Controller) {
                    let html:string = controller.render();
                    document.querySelector(selector || 'app').innerHTML = html;
                    promise.resolve({
                        controller: controller,
                        html: html
                    });
                });
            }
            return promise;
        }

    }


}