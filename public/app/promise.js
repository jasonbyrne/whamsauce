var Whamsauce;
(function (Whamsauce) {
    /**
     * Minimalistic promise object used internally
     */
    var Promise = (function () {
        function Promise() {
            this._resolved = false;
            this._opts = null;
            this._callback = null;
        }
        Promise.prototype.done = function () {
            if (this._callback != null) {
                var me_1 = this;
                setTimeout(function () {
                    me_1._callback.apply(me_1, [me_1._opts]);
                }, 0);
            }
        };
        Promise.prototype.then = function (callback) {
            // Remember callback
            this._callback = callback;
            // If it was already completed
            if (this._resolved) {
                this.done();
            }
        };
        Promise.prototype.resolve = function (opts) {
            // If it was already completed
            if (this._resolved) {
                return null;
            }
            // Remember it has been resolved already and the options
            this._resolved = true;
            this._opts = (opts || {});
            this.done();
        };
        return Promise;
    }());
    Whamsauce.Promise = Promise;
})(Whamsauce || (Whamsauce = {}));
//# sourceMappingURL=promise.js.map