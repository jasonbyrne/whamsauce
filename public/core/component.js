"use strict";
var Promise = require("./promise").Promise, Controller = require("./controller").Controller, Load = require("./load").Load;
var Component = (function () {
    function Component() {
    }
    Component.load = function (componentName, data) {
        var promise = new Promise(), componentClassName = Component.getComponentClassName(componentName), componentPath = Component.getComponentPath(componentName), controllerPath = componentPath + 'controller.js', viewPath = componentPath + 'view.html';
        Load.all(controllerPath, viewPath).then(function (results) {
            // If not an error loading component
            if (!results[controllerPath].error) {
                var html = results[viewPath].data, controller_1 = new window[componentClassName](html, data);
                // Wait for any sub-components to load
                controller_1.onDependenciesLoaded(function () {
                    var onceReady = new Promise(), init = controller_1.init(onceReady);
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
        return '/components/' + componentName.toLowerCase() + '/';
    };
    Component.getComponentClassName = function (componentName) {
        return 'Controller_' + componentName.charAt(0).toUpperCase() + componentName.slice(1);
    };
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=component.js.map