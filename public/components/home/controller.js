/// <reference path="../../app/controller.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Whamsauce;
(function (Whamsauce) {
    var Controller_Home = (function (_super) {
        __extends(Controller_Home, _super);
        function Controller_Home() {
            _super.apply(this, arguments);
        }
        Controller_Home.prototype.partials = function () {
            return {
                'button': 'button',
                'test': 'input'
            };
        };
        ;
        return Controller_Home;
    }(Whamsauce.Controller));
    Whamsauce.Controller_Home = Controller_Home;
})(Whamsauce || (Whamsauce = {}));
//# sourceMappingURL=controller.js.map