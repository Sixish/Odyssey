goog.provide('Odyssey.Controller.ControllerAttributor');
Odyssey.Controller.ControllerAttributor = (function () {
    "use strict";
    function OdysseyControllerAttributor() {}
    /**
     * Sets the controller. This object should contain methods to bind controls.
     * @param {OdysseyController} controller the controller. This must implement the
     * OdysseyEventDispatchInterface and have an eventDispatcher object field.
     */
    OdysseyControllerAttributor.prototype.setController = function (controller) {
        this.controller = controller;
    };

    /**
     * Gets the controller.
     * @returns {OdysseyController} the controller.
     */
    OdysseyControllerAttributor.prototype.getController = function () {
        return this.controller;
    };

    return OdysseyControllerAttributor;
}());
