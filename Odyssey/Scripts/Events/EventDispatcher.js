/*global OdysseyEventHandler*/
goog.require('Odyssey.Events.EventHandler');
goog.provide('Odyssey.Events.EventDispatcher');
Odyssey.Events.EventDispatcher = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyEventDispatcher() {
        this.events = {};
    }
    OdysseyEventDispatcher.prototype.toJSON = function () {
        // Do not serialize this object, as it is a container for functions.
        return;
    };
    OdysseyEventDispatcher.prototype.parent = null;
    OdysseyEventDispatcher.prototype.getParentEventHandler = function () {
        return this.parent;
    };
    OdysseyEventDispatcher.prototype.setParentEventHandler = function (parent) {
        this.parent = parent;
    };
    OdysseyEventDispatcher.prototype.getEventHandler = function (type) {
        if (!this.events.hasOwnProperty(type)) {
            this.events[type] = new Odyssey.Events.EventHandler(type);
        }
        return this.events[type];
    };

    OdysseyEventDispatcher.prototype.dispatch = function (ctx, e) {
        var handler = this.getEventHandler(e.type), parent;
        handler.fire(ctx, e);
        if (!e.propagationStopped) {
            // Bubble up to the parent.
            parent = this.getParentEventHandler();
            if (parent !== null) {
                parent.dispatch(ctx, e);
            }
        }
    };

    OdysseyEventDispatcher.prototype.addListener = function (type, fn) {
        var handler = this.getEventHandler(type);
        handler.addListener(fn);
    };

    OdysseyEventDispatcher.prototype.removeListener = function (type, fn) {
        var handler = this.getEventHandler(type);
        handler.removeListener(fn);
    };

    return OdysseyEventDispatcher;
}());
