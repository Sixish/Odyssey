/*jslint browser: true, bitwise: true, devel:true */
/* OdysseyLinkClickControl.js
 * Attaches event handlers to links to the Odyssey map.
 */
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.View.ViewAttributor');
goog.require('Odyssey.Model.ModelAttributor');
goog.require('Odyssey.Events.LinkClickEvent');
goog.provide('Odyssey.Controller.LinkClickControl');
Odyssey.Controller.LinkClickControl = (function ($) {
    "use strict";
    /**
     * Constructor for the link handler control.
     * @constructor
     */
    function OdysseyLinkClickControl() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
    }
    extend(OdysseyLinkClickControl.prototype, new Odyssey.Events.EventDispatchInterface());
    extend(OdysseyLinkClickControl.prototype, new Odyssey.View.ViewAttributor());
    extend(OdysseyLinkClickControl.prototype, new Odyssey.Model.ModelAttributor());

    /**
     * Tests whether a DOM element is an anchor element (link).
     * @param {Element} e the DOM element.
     * @returns {Boolean} true if the element is an anchor (<a>) element; false otherwise.
     */
    OdysseyLinkClickControl.isLink = function isLink(e) {
        return e.nodeName === "A";
    };

    /**
     * Sets the view's position based on an event.
     * @param {OdysseyEvent} e the event containing coordinates.
     */
    OdysseyLinkClickControl.prototype.setViewPosition = function (e) {
        // Set the position based on the coordinates of the fired event.
        this.getView().getTileMap().setPosition(parseInt(e.x, 10), parseInt(e.y, 10), parseInt(e.z, 10));
    };

    /**
     * Processes click events for Odyssey links.
     * @param {Object} e the click event object.
     */
    OdysseyLinkClickControl.prototype.processClick = function (e) {
        var query, keyValuePair, args = {}, i, len;
        if (!OdysseyLinkClickControl.isLink(e)) {
            return;
        }
        query = e.href.split("?");
        query = query && query[1];
        query = query && query.split("&");
        if (query && query.length) {
            for (i = 0, len = query.length; i < len; i += 1) {
                keyValuePair = query[i].split("=");
                args[keyValuePair[0]] = keyValuePair[1];
            }
        }
        // Check if the query string contains X, Y, Z coordinates.
        if (args.x && args.y && args.z) {
            // Fire an so that we can respond to it appropriately.
            this.dispatchEvent(new Odyssey.Events.LinkClickEvent(parseInt(args.x, 10), parseInt(args.y, 10), parseInt(args.z, 10)), this.setViewPosition);
            // Don't navigate to the URL; instruct the caller to
            // prevent the default action and stop propagation.
            return false;
        }
    };

    /**
     * Creates a proxy to handle clicks.
     * @param {OdysseyLinkClickControl} ctx the link control.
     * @returns {Function} the 
     */
    OdysseyLinkClickControl.handleClickProxy = function (ctx) {
        return function (e) {
            if (!ctx.processClick(e.target)) {
                e.preventDefault();
            }
        };
    };

    /**
     * Initializes the control by setting event listeners to links.
     */
    OdysseyLinkClickControl.prototype.initialize = function () {
        $(document).click(OdysseyLinkClickControl.handleClickProxy(this));
    };

    return OdysseyLinkClickControl;
}(jQuery));
