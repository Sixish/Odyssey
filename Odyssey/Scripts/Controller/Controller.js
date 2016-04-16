goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Model.ModelAttributor');
goog.require('Odyssey.View.ViewAttributor');
goog.require('Odyssey.View.TileMap');
goog.require('Odyssey.Events.MapClickEvent');
goog.require('Odyssey.Model.Matrix3D');
goog.provide('Odyssey.Controller.Controller');
Odyssey.Controller.Controller = (function ($) {
    "use strict";
    /**
     * The constructor for the controller.
     * @constructor
     */
    function OdysseyController() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
        this.context = null;
        this.controlStates = [];
        this.controlManager = null;
    }
    extend(OdysseyController.prototype, new Odyssey.Events.EventDispatchInterface());
    OdysseyController.CONTROL_OVERLAY_CLICK = 0;

    OdysseyController.prototype.setControlManager = function (controlManager) {
        this.controlManager = controlManager;
    };
    OdysseyController.prototype.setContext = function (Odyssey) {
        this.context = Odyssey;
    };
    OdysseyController.prototype.disable = function (controlID) {
        this.controlStates[controlID] = false;
    };
    OdysseyController.prototype.enable = function (controlID) {
        this.controlStates[controlID] = true;
    };
    OdysseyController.prototype.isDisabled = function (controlID) {
        return (this.controlStates[controlID] === false);
    };
    OdysseyController.prototype.isEnabled = function (controlID) {
        // Controls are enabled by default.
        return (!this.isDisabled(controlID));
    };
    OdysseyController.prototype.initialize = function () {
        var ctx = this;
        // Initialize the canvas selection.
        function dispatchControl() {
            ctx.handleControlOverlayClick();
        }
        $(this.context.overlayCanvases).click(dispatchControl);
    };

    return OdysseyController;
}(jQuery));
