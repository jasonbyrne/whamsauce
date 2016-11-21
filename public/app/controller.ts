/**
 * Created by jasonbyrne on 11/20/16.
 */

/// <reference path="../typings/handlebars.d.ts" />
// <reference path="promise.ts" />
// <reference path="component.ts" />

namespace Whamsauce {

    export class Controller {

        protected data:any = {};
        protected template:Function = null;
        protected dependenciesLoaded:Promise;
        protected templateEngine:any = null;

        constructor(html:string, data?:any) {
            this.templateEngine = Handlebars.create();
            this.template = this.templateEngine.compile(html);
            this.data = data || {};
            this.dependenciesLoaded = this.loadPartials();
        }

        public init(promise:Promise):boolean {
            return false;
        }

        public onDependenciesLoaded(callback:Function) {
            this.dependenciesLoaded.then(callback);
        }

        protected partials():any {
            return {};
        }

        private loadPartials():Promise {
            let me = this,
                promise = new Whamsauce.Promise(),
                partials:any = this.partials(),
                partialsCount:number = 0,
                partialsLoaded:number = 0;
            for (let partialName in partials) {
                partialsCount++;
                let componentName:string = partials[partialName];
                Whamsauce.Component.load(componentName, me.data).then(function(partial:Controller) {
                    me.templateEngine.registerPartial(partialName, partial.getTemplate());
                    partialsLoaded++;
                    if (partialsCount == partialsLoaded) {
                        promise.resolve();
                    }
                });
            }
            if (partialsCount == 0) {
                promise.resolve();
            }
            return promise;
        }

        public render():string {
            return this.template(this.data);
        }

        public getTemplate():Function {
            return this.template;
        }

    }


}