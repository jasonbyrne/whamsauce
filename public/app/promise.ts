

namespace Whamsauce {

    /**
     * Minimalistic promise object used internally
     */
    export class Promise {

        protected _resolved:boolean = false;
        protected _opts:any = null;
        protected _callback:Function = null;

        protected done() {
            if (this._callback != null) {
                let me = this;
                setTimeout(function() {
                    me._callback.apply(me, [me._opts]);
                }, 0);
            }
        }

        public then(callback:Function) {
            // Remember callback
            this._callback = callback;
            // If it was already completed
            if (this._resolved) {
                this.done();
            }
        }

        public resolve(opts?:any) {
            // If it was already completed
            if (this._resolved) {
                return null;
            }
            // Remember it has been resolved already and the options
            this._resolved = true;
            this._opts = (opts || {});
            this.done();
        }

    }

}