goog.provide('Odyssey.Events.EventHandler');
Odyssey.Events.EventHandler = (function () {
    "use strict";
    function OdysseyEventHandler(type) {
        this.type = type;
        this.listeners = [];
    }
    OdysseyEventHandler.prototype.fire = function (ctx, e) {
        var i, len = this.listeners.length;
        for (i = 0; (i < len && !e.propagationStopped); i += 1) {
            this.listeners[i].call(ctx, e);
        }
    };

    OdysseyEventHandler.prototype.addListener = function (fn) {
        this.listeners.push(fn);
    };

    OdysseyEventHandler.prototype.removeListener = function (fn) {
        var index = this.listeners.indexOf(fn), len;
        if (index !== -1) {
            this.listeners[index] = undefined;
            // Shift all to the left.
            for (len = this.listeners.length - 1; index < len; index += 1) {
                this.listeners[index] = this.listeners[index + 1];
            }
            this.listeners[index] = undefined;
            this.listeners.length -= 1;
        }
    };

    return OdysseyEventHandler;
}());
