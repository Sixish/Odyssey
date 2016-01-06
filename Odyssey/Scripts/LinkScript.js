/*jslint browser: true, bitwise: true, devel:true */
/*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile, OdysseyMapSearchEvent, Worker, Odyssey */
/* LinkScript.js
 * Attaches event handlers to links to the Odyssey map.
 */
(function (Odyssey, $) {
    "use strict";
    $((function () {
        return function () {
            /**
             * Tests whether a DOM element is an anchor element (link).
             * @param e the DOM element.
             * @returns true if the element is an anchor (<a>) element; false otherwise.
             */
            function isLink(e) {
                return e.nodeName === "A";
            }

            /**
             * Handles click events for Odyssey links.
             * @param e the click event object.
             */
            function handleLinkClickEvent(e) {
                var query, keyValuePair, args = {}, i, len;
                if (!isLink(e.target)) {
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
                    Odyssey.position.set(parseInt(args.x, 10), parseInt(args.y, 10), parseInt(args.z, 10));
                    e.preventDefault();
                }
            }

            // Attach the event to the document. This allows us to
            //   dynamically add links, since the handler is not
            //   bound to each <a> element.
            $(document).click(handleLinkClickEvent);
        };
    }()));
}(Odyssey, jQuery));