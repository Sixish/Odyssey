/*jslint browser: true, bitwise: true, devel:true */
/** Search.js
 * Provides the search methods. Search functionality works by sending map
 * data to the Search.Worker.js script, which performs the search asynchronously.
 * @TODO remove View components.
 * @TODO isolate classes (1 file = 1 class).
 */
// TODO SPLIT : 1 CLASS PER FILE
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Events.SearchFindEvent');
goog.require('Odyssey.Events.SearchCompleteEvent');
goog.provide('Odyssey.Controller.MapSearch');
Odyssey.Controller.MapSearch = (function () {
    "use strict";
    // Handlers for messages.
    var handlers = {};

	/**
	 * Listens to messages from the server.
     * @TODO does not seem to be used.
     * @TODO : CLEANUP : do we use this method or OdysseyMapSearch.worker.onmessage ?
     * @param {Object} e the message event.
	 */
    window.onmessage = function handleMessage(e) {
        var id, type, data;
        if (e.hasOwnProperty('id')) {
            id = e.id;
            type = e.type;
            data = e.data;
            if (handlers.hasOwnProperty(id)) {
                if (e.type === "find") {
                    handlers[id].dispatchEvent(new Odyssey.Events.SearchFindEvent(data));
                } else if (e.type === "complete") {
                    handlers[id].dispatchEvent(new Odyssey.Events.SearchCompleteEvent(data));
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
                handlers[o.messageID].dispatchEvent(new Odyssey.Events.SearchFindEvent(o.data));
            } else if (o.type === "complete") {
                handlers[o.messageID].dispatchEvent(new Odyssey.Events.SearchCompleteEvent(o.data));
            }
        }
    }
    */

    /**
     * Creates a map search request.
     * @param {String} action the request's action.
     * @constructor
     */
    function OdysseyMapSearchRequest(action) {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
        this.action = action;
        this.data = {};
    }
    extend(OdysseyMapSearchRequest.prototype, new Odyssey.Events.EventDispatchInterface());

    /**
     * Sets the request data.
     * @param {Object} data the request data.
     */
    OdysseyMapSearchRequest.prototype.setData = function (data) {
        this.data = data;
    };

    /**
     * Sets the request ID.
     * @param {Number} id the request ID.
     */
    OdysseyMapSearchRequest.prototype.setID = function (id) {
        this.id = id;
    };

    /**
     * Creates a map search object.
     * @constructor
     */
    function OdysseyMapSearch() {
        var ctx = this;
        this.worker = new Worker("Odyssey/Scripts/Controller/Search.Worker.js");
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
        this.messages = [];

        /**
         * Handles the message event of the Worker.
         * @param {Object} e the message event.
         */
        this.worker.onmessage = function (e) {
            var msg = JSON.parse(e.data), id = msg.id, handler;
            // Request handler for this message ID.
            handler = (ctx.messages.hasOwnProperty(id) ? ctx.messages[id] : null);
            if (handler !== null) {
                if (msg.type === "find") {
                    handler.dispatchEvent(new Odyssey.Events.SearchFindEvent(msg));
                } else if (msg.type === "complete") {
                    handler.dispatchEvent(new Odyssey.Events.SearchCompleteEvent(msg));
                }
            }
        };
    }
    extend(OdysseyMapSearch.prototype, new Odyssey.Events.EventDispatchInterface());

    /**
     * Creates a request.
     * @param {String} type the request's type.
     * @param {Object} data the request's data.
     * @returns {OdysseyMapSearchRequest} the created request.
     */
    OdysseyMapSearch.prototype.createRequest = function (type, data) {
        var req = new OdysseyMapSearchRequest(type);
        req.setParentEventHandler(this.eventDispatcher);
        req.setID(this.messages.length);
        req.setData(data);
        this.messages.push(req);
        return req;
    };

    /**
     * Sends a request.
     * @param {OdysseyMapSearchRequest} req the request to send.
     */
    OdysseyMapSearch.prototype.sendRequest = function (req) {
        this.worker.postMessage(JSON.stringify(req));
    };

    /**
     * Creates a find request.
     * @param {Object} the data to use.
     * @param {Function} fnFind the callback to use when an item is found.
     * @param {Function} fnComplete the callback to use when the search is complete.
     */
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

    /**
     * Sends map data.
     * @param {Object} maps the map data.
     */
    OdysseyMapSearch.prototype.sendData = function (maps) {
        var req = this.createRequest("send", maps);
        this.sendRequest(req);
        return req;
    };

    return OdysseyMapSearch;
}());
