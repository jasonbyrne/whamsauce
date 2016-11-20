/// <reference path="whamsauce.ts" />
// <reference path="controller.ts" />
var Whamsauce;
(function (Whamsauce) {
    var Component = (function () {
        function Component() {
        }
        Component.load = function (componentName, data) {
            var promise = new Whamsauce.Promise(), componentClassName = Component.getComponentClassName(componentName), componentPath = Component.getComponentPath(componentName), controllerPath = componentPath + 'controller.js', viewPath = componentPath + 'view.html';
            Whamsauce.Load.all(controllerPath, viewPath).then(function (results) {
                // If not an error loading component
                if (!results[controllerPath].error) {
                    var html = results[viewPath].data, controller_1 = new Whamsauce[componentClassName](html, data);
                    // Wait for any sub-components to load
                    controller_1.onDependenciesLoaded(function () {
                        var onceReady = new Whamsauce.Promise(), init = controller_1.init(onceReady);
                        // If synchronous initialization, just resolve it
                        !init && onceReady.resolve();
                        // Once it is ready
                        onceReady.then(function () {
                            promise.resolve(controller_1);
                        });
                    });
                }
            });
            return promise;
        };
        Component.getComponentPath = function (componentName) {
            return '/components/' + componentName + '/';
        };
        Component.getComponentClassName = function (componentName) {
            return 'Controller_' + componentName.charAt(0).toUpperCase() + componentName.slice(1);
        };
        return Component;
    }());
    Whamsauce.Component = Component;
})(Whamsauce || (Whamsauce = {}));
//# sourceMappingURL=component.js.map