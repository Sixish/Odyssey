/*jslint browser: true, bitwise: true, devel:true */
/*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile, OdysseyMapSearchEvent, Worker, Odyssey */
/* LinkScript.js
 * Attaches event handlers to links to the Odyssey map.
 */
var OdysseyLinkHandler = (function (Odyssey, $) {
    "use strict";
    var controller = Odyssey.getController();

    function OdysseyLinkHandler() {}

    /**
     * Tests whether a DOM element is an anchor element (link).
     * @param e the DOM element.
     * @returns true if the element is an anchor (<a>) element; false otherwise.
     */
    OdysseyLinkHandler.isLink = function isLink(e) {
        return e.nodeName === "A";
    };

    /**
     * Handles click events for Odyssey links.
     * @param e the click event object.
     */
    OdysseyLinkHandler.handleLinkClickEvent = function handleLinkClickEvent(e) {
        var query, keyValuePair, args = {}, i, len;
        if (!OdysseyLinkHandler.isLink(e.target)) {
            return;
        }
        query = e.target.href.split("?");
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
            // Set the position based on these coordinates.
            Odyssey.setPosition(parseInt(args.x, 10), parseInt(args.y, 10), parseInt(args.z, 10));
            e.preventDefault();
        }
    };
    controller.addControl('OdysseyClick', OdysseyLinkHandler.handleLinkClickEvent);

    return OdysseyLinkHandler;
}(Odyssey, jQuery));
