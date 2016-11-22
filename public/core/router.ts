import { Promise } from './promise';
import { Rule } from './rule';
import { Component } from './component';
import { Controller } from './controller';
import { Exception } from './exception';


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
        Router.instance = router;
    }

    /**
     *
     * @param path
     * @returns {Rule}
     */
    static evaluate(path:string):Rule {
        if (Router.instance == null) {
            throw new Exception('Router not yet instantiated');
        }
        let me:Router = Router.instance,
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
     * @returns {Promise}
     */
    static execute(path:string, selector?:string) {
        let promise = new Promise(),
            rule:Rule = Router.evaluate(path);
        // If found a matching rule
        if (rule != null) {
            let data = rule.getParams(path);
            data._path = path;
            Component.load(rule.componentName, data).then(function(controller:Controller) {
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

