/// <reference path="../../../src/controller.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Whamsauce;
(function (Whamsauce) {
    var Controller_FileNotFound = (function (_super) {
        __extends(Controller_FileNotFound, _super);
        function Controller_FileNotFound() {
            _super.apply(this, arguments);
        }
        Controller_FileNotFound.prototype.partials = function () {
            return {
                'button': 'button',
                'test': 'input'
            };
        };
        ;
        return Controller_FileNotFound;
    }(Whamsauce.Controller));
    Whamsauce.Controller_FileNotFound = Controller_FileNotFound;
})(Whamsauce || (Whamsauce = {}));
//# sourceMappingURL=controller.js.map