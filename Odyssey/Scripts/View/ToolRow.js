/*jslint browser:true*/
/*global jQuery*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Events.ToolRowShowEvent');
goog.require('Odyssey.Events.ToolRowHideEvent');
goog.provide('Odyssey.View.ToolRow');
Odyssey.View.ToolRow = (function ($) {
    "use strict";
    var /** @const */
        ACTIVE_CLASS = "state-tools-active";

    /**
     * Creates an instance of the tool row.
     * @constructor
     */
    function OdysseyToolRow() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
        this.active = false;
        this.ui = {};
    }
    extend(OdysseyToolRow.prototype, new Odyssey.Events.EventDispatchInterface());
    extend(OdysseyToolRow.prototype, new Odyssey.View.ViewAttributor());

    /**
     * Sets the element used to toggle this view component's visibility.
     * @param {Object} element the DOM element used to toggle this view
     * component's visibility.
     */
    OdysseyToolRow.prototype.setToggleElement = function (element) {
        this.ui.open = element;
    };

    /**
     * Gets the element used to toggle this view component's visibility.
     * @returns {Object} the DOM element used to toggle this view
     * component's visibility.
     */
    OdysseyToolRow.prototype.getToggleElement = function () {
        return this.ui.open;
    };

    /**
     * Shows the view component. This toggles classes on the body.
     */
    OdysseyToolRow.prototype.show = function () {
        $(document.body).addClass(ACTIVE_CLASS);
        this.active = true;
        this.dispatchEvent(new Odyssey.Events.ToolRowShowEvent());
    };

    /**
     * Hides the view component. This toggles classes on the body.
     */
    OdysseyToolRow.prototype.hide = function () {
        $(document.body).removeClass(ACTIVE_CLASS);
        this.active = false;
        this.dispatchEvent(new Odyssey.Events.ToolRowHideEvent());
    };

    /**
     * Toggles the visibility of the view component. This calls the
     * show or hide method, which toggle classes on the body.
     */
    OdysseyToolRow.prototype.toggle = function () {
        if (this.active) {
            this.hide();
        } else {
            this.show();
        }
    };

    return OdysseyToolRow;
}(jQuery));
