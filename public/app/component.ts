// <reference path="promise.ts" />
// <reference path="controller.ts" />


namespace Whamsauce {

    export class Component {

        static load(componentName:string, data:any):Promise {
            let promise:Promise = new Whamsauce.Promise(),
                componentClassName:string = Component.getComponentClassName(componentName),
                componentPath:string = Component.getComponentPath(componentName),
                controllerPath:string = componentPath + 'controller.js',
                viewPath:string = componentPath + 'view.html';
            Whamsauce.Load.all(
                controllerPath,
                viewPath
            ).then(function(results) {
                // If not an error loading component
                if (!results[controllerPath].error) {
                    let html:string = results[viewPath].data,
                        controller:Controller = new Whamsauce[componentClassName](html, data);
                    // Wait for any sub-components to load
                    controller.onDependenciesLoaded(function() {
                        let onceReady = new Promise(),
                            init = controller.init(onceReady);
                        // If synchronous initialization, just resolve it
                        !init && onceReady.resolve();
                        // Once it is ready
                        onceReady.then(function() {
                            promise.resolve(controller);
                        });
                    });
                }
            });
            return promise;
        }

        private static getComponentPath(componentName:string):string {
            return '/components/' + componentName.toLowerCase() + '/';
        }

        private static getComponentClassName(componentName:string):string {
            return 'Controller_' + componentName.charAt(0).toUpperCase() + componentName.slice(1);
        }

    }


}