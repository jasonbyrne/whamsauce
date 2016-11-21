var Whamsauce;
(function (Whamsauce) {
    var Exception = (function () {
        function Exception(message) {
            this.message = null;
            this.message = message;
        }
        Exception.prototype.getMessage = function () {
            return this.message;
        };
        return Exception;
    }());
    Whamsauce.Exception = Exception;
})(Whamsauce || (Whamsauce = {}));
//# sourceMappingURL=exception.js.map