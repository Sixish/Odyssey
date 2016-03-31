/*jslint browser: true, bitwise: true, devel:true */
/*global extend, OdysseyEventDispatcher, OdysseySearchCompleteEvent, OdysseySearchFindEvent, OdysseyEventDispatchInterface, ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile, OdysseyMapSearchEvent, Worker */
/** Search.js
 * Provides the search methods. Search functionality works by sending map
 * data to the Search.Worker.js script, which performs the search asynchronously.
 * @TODO remove View components.
 * @TODO isolate classes (1 file = 1 class).
 */
var OdysseyMapSearch = (function () {
    "use strict";
    // Handlers for messages.
    var handlers = {};

    // Listen to the events.
    // TODO CLEANUP : do we use this method or OdysseyMapSearch.worker.onmessage ?
    // does not seem to be used.
    window.onmessage = function handleMessage(e) {
        var id, type, data;
        if (e.hasOwnProperty('id')) {
            id = e.id;
            type = e.type;
            data = e.data;
            if (handlers.hasOwnProperty(id)) {
                if (e.type === "find") {
                    handlers[id].dispatchEvent(new OdysseySearchFindEvent(data));
                } else if (e.type === "complete") {
                    handlers[id].dispatchEvent(new OdysseySearchCompleteEvent(data));
                }
            }
        }
    };

    // Handles the window.onmessage event. This is not
    // part of the class because it accesses the window.
    /*
    function handleMessage(str) {
        var o = JSON.parse(str);
        if (!o.messageID) {
            return;
        }
        if (handlers.hasOwnProperty(o.messageID)) {
            if (o.type === "find") {
                handlers[o.messageID].dispatchEvent(new OdysseySearchFindEvent(o.data));
            } else if (o.type === "complete") {
                handlers[o.messageID].dispatchEvent(new OdysseySearchCompleteEvent(o.data));
            }
        }
    }
    */

    function OdysseyMapSearchRequest(action) {
        this.eventDispatcher = new OdysseyEventDispatcher();
        this.action = action;
        this.data = {};
    }
    extend(OdysseyMapSearchRequest.prototype, new OdysseyEventDispatchInterface());
    OdysseyMapSearchRequest.prototype.setData = function (data) {
        this.data = data;
    };
    OdysseyMapSearchRequest.prototype.setID = function (id) {
        this.id = id;
    };

    function OdysseyMapSearch() {
        var ctx = this;
        this.worker = new Worker("Odyssey/Scripts/Controller/Search.Worker.js");
        this.eventDispatcher = new OdysseyEventDispatcher();
        this.messages = [];

        this.worker.onmessage = function (e) {
            var msg = JSON.parse(e.data), id = msg.id, handler;
            // Request handler for this message ID.
            handler = (ctx.messages.hasOwnProperty(id) ? ctx.messages[id] : null);
            if (handler !== null) {
                if (msg.type === "find") {
                    handler.dispatchEvent(new OdysseySearchFindEvent(msg));
                } else if (msg.type === "complete") {
                    handler.dispatchEvent(new OdysseySearchCompleteEvent(msg));
                }
            }
        };
    }
    extend(OdysseyMapSearch.prototype, new OdysseyEventDispatchInterface());

    OdysseyMapSearch.prototype.createRequest = function (type, data) {
        var req = new OdysseyMapSearchRequest(type);
        req.setParentEventHandler(this.eventDispatcher);
        req.setID(this.messages.length);
        req.setData(data);
        this.messages.push(req);
        return req;
    };

    OdysseyMapSearch.prototype.sendRequest = function (req) {
        this.worker.postMessage(JSON.stringify(req));
    };

    OdysseyMapSearch.prototype.find = function (o, fnFind, fnComplete) {
        var data, req;
        data = {
            items: o.items,
            sections: o.sections
        };
        req = this.createRequest("search", data);
        if (typeof fnFind === "function") {
            req.addEventListener("OdysseySearchFind", fnFind);
        }
        if (typeof fnComplete === "function") {
            req.addEventListener("OdysseySearchComplete", fnComplete);
        }
        this.sendRequest(req);
        return req;
    };

    OdysseyMapSearch.prototype.sendData = function (maps) {
        var req = this.createRequest("send", maps);
        this.sendRequest(req);
        return req;
    };

    return OdysseyMapSearch;
}());
