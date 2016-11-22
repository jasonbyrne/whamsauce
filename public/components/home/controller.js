"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var controller_1 = require("../../core/controller");
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
}(controller_1.Controller));
//# sourceMappingURL=controller.js.map