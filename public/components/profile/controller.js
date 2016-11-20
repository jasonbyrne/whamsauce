/// <reference path="../../app/controller.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Whamsauce;
(function (Whamsauce) {
    var Controller_Profile = (function (_super) {
        __extends(Controller_Profile, _super);
        function Controller_Profile() {
            _super.apply(this, arguments);
        }
        Controller_Profile.prototype.init = function (promise) {
            return false;
        };
        Controller_Profile.prototype.partials = function () {
            return {
                'button': 'button'
            };
        };
        ;
        return Controller_Profile;
    }(Whamsauce.Controller));
    Whamsauce.Controller_Profile = Controller_Profile;
})(Whamsauce || (Whamsauce = {}));
//# sourceMappingURL=controller.js.map