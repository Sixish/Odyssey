/*jslint browser: true, bitwise: true, devel:true */
/*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile, OdysseyMapSearchEvent, Worker */
/**
 * Search.js
 *
 * Provides the search methods. Search functionality works by sending map
 * data to the Search.Worker.js script, which performs the search asynchronously.
 * @TODO remove View components.
 * @TODO isolate classes (1 file = 1 class).
 */
var OdysseyMapSearch = (function () {
    "use strict";
    var handlers = {}; // TODO isolate outside global

    function OdysseyMapSearchRequest(action) {
        this.action = action;
        this.data = {};
    }

    function OdysseyMapSearchArguments() {
        this.items = [];
        this.creatures = [];
        this.sections = [];
        this.events = {
            find: new OdysseyMapSearchEvent("mapsearchfind"),
            complete: new OdysseyMapSearchEvent("mapsearchcomplete")
        };
    }

    OdysseyMapSearchArguments.fromConfiguration = function (o) {
        var args = new OdysseyMapSearchArguments(), prop;

        if (o.hasOwnProperty('items')) {
            args.setItems(o.items);
        }

        if (o.hasOwnProperty('creatures')) {
            args.setCreatures(o.creatures);
        }

        if (o.hasOwnProperty('sections')) {
            args.setSections(o.sections);
        }

        if (o.hasOwnProperty('events')) {
            for (prop in o.events) {
                if (o.events.hasOwnProperty(prop)) {
                    if (!args.events.hasOwnProperty(prop)) {
                        throw "Could not find event named " + prop;
                    }

                    args.events[prop].bind(o.events[prop]);
                }
            }
        }

        if (o.hasOwnProperty('async')) {
            args.async = o.async;
        }

        if (o.hasOwnProperty('interval')) {
            args.interval = o.interval;
        }

        return args;
    };

    OdysseyMapSearchArguments.prototype.setItems = function (arr) {
        Array.prototype.push.apply(this.items, arr);
    };

    OdysseyMapSearchArguments.prototype.setCreatures = function (arr) {
        Array.prototype.push.apply(this.creatures, arr);
    };

    OdysseyMapSearchArguments.prototype.setSections = function (arr) {
        Array.prototype.push.apply(this.sections, arr);
    };

    function OdysseyMapSection(from, to) {
        this.from = from;
        this.to = to;
    }

    OdysseyMapSearchArguments.prototype.async = true;
    OdysseyMapSearchArguments.prototype.interval = 500;
    OdysseyMapSearchArguments.prototype.duration = 250;

    function OdysseyMapSearchEvent(eventName) {
        this.name = eventName;
        this.listeners = [];
    }
    OdysseyMapSearchEvent.prototype.bind = function (callback) {
        this.listeners.push(callback);
    };

    function OdysseyMapSearchPromise() {
        this.events = {};
    }
    OdysseyMapSearchPromise.prototype.on = function (e, fn) {
        if (!this.events.hasOwnProperty(e)) {
            this.events[e] = new OdysseyMapSearchEvent(e);
        }
        this.events[e].bind(fn);
    };
    OdysseyMapSearchPromise.prototype.fireEvent = function (e, ctx, args) {
        var event;
        if (this.events.hasOwnProperty(e)) {
            event = this.events[e];
            event.fire.apply(ctx, args);
        }
    };

    function OdysseyMapSearch() {
        var w, requestID, messageListeners;
        w = new Worker("Odyssey/Scripts/Search.Worker.js");
        requestID = 0;
        messageListeners = {};

        function addMessageListener(messageID, fn) {
            if (!messageListeners.hasOwnProperty(messageID)) {
                messageListeners[messageID] = [];
            }

            messageListeners[messageID].push(fn);
        }

        w.onmessage = function (e) {
            var msg = JSON.parse(e.data), id;

            id = msg.requestID;
            if (handlers[id]) {
                handlers[id](msg);
            }
        };

        this.send = function (data) {
            var request = new OdysseyMapSearchRequest("send");
            request.requestID += 1;
            request.data = data;
            w.postMessage(JSON.stringify(request));
        };

        this.find = function (o) {
            var request = new OdysseyMapSearchRequest("search"), id;
            id = request.requestID;
            requestID += 1;

            handlers[request.requestID] = function (r) {
                if (r.status === 'complete') {
                    // We have finished searching the whole map.
                    if (r.hasOwnProperty('results') && o.hasOwnProperty('oncomplete')) {
                        o.oncomplete(r);
                    }
                }

                if (r.status === 'find') {
                    // We found a single item.
                    if (r.hasOwnProperty('result') && o.hasOwnProperty('onfind')) {
                        o.onfind(r);
                    }
                }

            };

            request.data.items = o.items;
            request.data.sections = o.sections;

            w.postMessage(JSON.stringify(request));

        };

    }

    window.onmessage = function handleMessage(e) {
        var data = e.data;

        if (data.hasOwnProperty('messageID')) {
            if (handlers.hasOwnProperty(data.messageID)) {
                handlers[data.messageID](data);
            }
        }
    };

    return OdysseyMapSearch;
}());
