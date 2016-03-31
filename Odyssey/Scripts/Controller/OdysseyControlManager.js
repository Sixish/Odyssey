/*global extend, OdysseyEventDispatchInterface, OdysseyEventDispatcher, OdysseyControllerAttributor, OdysseyViewAttributor, OdysseyModelAttributor*/
var OdysseyControlManager = (function () {
    "use strict";
    function OdysseyControlManager() {
        this.eventDispatcher = new OdysseyEventDispatcher();
        this.controls = [];
    }
    extend(OdysseyControlManager.prototype, new OdysseyEventDispatchInterface());
    extend(OdysseyControlManager.prototype, new OdysseyModelAttributor());
    extend(OdysseyControlManager.prototype, new OdysseyViewAttributor());
    extend(OdysseyControlManager.prototype, new OdysseyControllerAttributor());

    OdysseyControlManager.prototype.addControl = function (control) {
        this.controls.push(control);
        control.setParentEventHandler(this.eventDispatcher);
        control.setView(this.getView());
        control.setModel(this.getModel());
        if (typeof control.initialize === "function") {
            control.initialize();
        }
    };

    return OdysseyControlManager;
}());
