

namespace Whamsauce {

    export class Exception {

        protected message:string = null;

        constructor(message:string) {
            this.message = message;
        }

        public getMessage():string {
            return this.message;
        }

    }

}
