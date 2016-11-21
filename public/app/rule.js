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
})(Whamsauce || (Whamsauce = {}));
//# sourceMappingURL=rule.js.map