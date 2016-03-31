/*jslint browser: true, bitwise: true, devel:true */
/*global extend, OdysseyViewAttributor, OdysseyModelAttributor, OdysseyLinkClickEvent, OdysseyEventDispatchInterface, OdysseyEventDispatcher, ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile, OdysseyMapSearchEvent, Worker, Odyssey */
/* OdysseyLinkClickControl.js
 * Attaches event handlers to links to the Odyssey map.
 */
var OdysseyLinkClickControl = (function ($) {
    "use strict";
    /**
     * Constructor for the link handler control.
     * @constructor
     */
    function OdysseyLinkClickControl() {
        this.eventDispatcher = new OdysseyEventDispatcher();
    }
    extend(OdysseyLinkClickControl.prototype, new OdysseyEventDispatchInterface());
    extend(OdysseyLinkClickControl.prototype, new OdysseyViewAttributor());
    extend(OdysseyLinkClickControl.prototype, new OdysseyModelAttributor());

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
            this.dispatchEvent(new OdysseyLinkClickEvent(parseInt(args.x, 10), parseInt(args.y, 10), parseInt(args.z, 10)), this.setViewPosition);
            // Don't navigate to the URL; instruct the caller to
            // prevent the default action and stop propagation.
            return false;
        }
    };

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
