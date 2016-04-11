goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.View.ViewAttributor');
goog.require('Odyssey.Model.ModelAttributor');
goog.provide('Odyssey.Controller.ToolRowControl');
Odyssey.Controller.ToolRowControl = (function ($) {
    "use strict";
    /**
     * Creates an instance of the tool row control.
     * @constructor
     */
    function OdysseyToolRowControl() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
    }
    extend(OdysseyToolRowControl.prototype, new Odyssey.Events.EventDispatchInterface());
    extend(OdysseyToolRowControl.prototype, new Odyssey.Model.ModelAttributor());
    extend(OdysseyToolRowControl.prototype, new Odyssey.View.ViewAttributor());

    /**
     * Initializes the controls.
     */
    OdysseyToolRowControl.prototype.initialize = function () {
        var toolRow = this.getView().getToolRow();
        $(toolRow.getToggleElement()).click(function () {
            toolRow.toggle();
        });
    };

    return OdysseyToolRowControl;
}(jQuery));
