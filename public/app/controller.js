/**
 * Created by jasonbyrne on 11/20/16.
 */
/// <reference path="../typings/handlebars.d.ts" />
// <reference path="promise.ts" />
// <reference path="component.ts" />
var Whamsauce;
(function (Whamsauce) {
    var Controller = (function () {
        function Controller(html, data) {
            this.data = {};
            this.template = null;
            this.templateEngine = null;
            this.templateEngine = Handlebars.create();
            this.template = this.templateEngine.compile(html);
            this.data = data || {};
            this.dependenciesLoaded = this.loadPartials();
        }
        Controller.prototype.init = function (promise) {
            return false;
        };
        Controller.prototype.onDependenciesLoaded = function (callback) {
            this.dependenciesLoaded.then(callback);
        };
        Controller.prototype.partials = function () {
            return {};
        };
        Controller.prototype.loadPartials = function () {
            var me = this, promise = new Whamsauce.Promise(), partials = this.partials(), partialsCount = 0, partialsLoaded = 0;
            var _loop_1 = function(partialName) {
                partialsCount++;
                var componentName = partials[partialName];
                Whamsauce.Component.load(componentName, me.data).then(function (partial) {
                    me.templateEngine.registerPartial(partialName, partial.getTemplate());
                    partialsLoaded++;
                    if (partialsCount == partialsLoaded) {
                        promise.resolve();
                    }
                });
            };
            for (var partialName in partials) {
                _loop_1(partialName);
            }
            if (partialsCount == 0) {
                promise.resolve();
            }
            return promise;
        };
        Controller.prototype.render = function () {
            return this.template(this.data);
        };
        Controller.prototype.getTemplate = function () {
            return this.template;
        };
        return Controller;
    }());
    Whamsauce.Controller = Controller;
})(Whamsauce || (Whamsauce = {}));
//# sourceMappingURL=controller.js.map