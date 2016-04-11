goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Model.ModelAttributor');
goog.require('Odyssey.View.ViewAttributor');
goog.require('Odyssey.Controller.ControllerAttributor');
goog.provide('Odyssey.Controller.ControlManager');
Odyssey.Controller.ControlManager = (function () {
    "use strict";
    function OdysseyControlManager() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
        this.controls = [];
    }
    extend(OdysseyControlManager.prototype, new Odyssey.Events.EventDispatchInterface());
    extend(OdysseyControlManager.prototype, new Odyssey.Model.ModelAttributor());
    extend(OdysseyControlManager.prototype, new Odyssey.View.ViewAttributor());
    extend(OdysseyControlManager.prototype, new Odyssey.Controller.ControllerAttributor());

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
