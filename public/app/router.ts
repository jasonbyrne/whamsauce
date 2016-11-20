/// <reference path="../../typings/handlebars.d.ts" />
/// <reference path="whamsauce.ts" />

namespace Whamsauce {

    export class Rule {

        public pattern:RegExp;
        public componentName:string;
        public componentPath:string;

        protected rawPattern:string;
        protected params:Array<string> = [];

        /**
         *
         * @param pattern
         * @param component
         */
        constructor(pattern:string, component:string) {
            this.rawPattern = pattern;
            this.componentName = component;
            this.componentPath = component.replace('_', '/');
            // Get pattern parameters
            let matches = pattern.match(/{[a-z0-9_]+}/ig);
            if (matches != null) {
                for (let i=0; i < matches.length; i++) {
                    let param:string = matches[i];
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
        public getParams(path:string):any {
            let out:any = {},
                matches = path.match(this.pattern);
            if (matches != null) {
                for (let i=1; i < matches.length; i++) {
                    let key:string = this.params[i - 1];
                    out[key] = matches[i];
                }
            }
            return out;
        }

        /**
         *
         * @param path
         * @returns {boolean}
         */
        public isMatch(path:string):boolean {
            return this.pattern.test(path);
        }

    }


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
            Whamsauce.Router.execute(window.location.pathname);
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