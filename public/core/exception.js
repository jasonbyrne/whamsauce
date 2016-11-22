"use strict";
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
exports.Exception = Exception;
//# sourceMappingURL=exception.js.map