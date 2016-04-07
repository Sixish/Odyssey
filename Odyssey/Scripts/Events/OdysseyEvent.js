var OdysseyEvent = (function () {
    "use strict";
    /**
     * Creates a new Odyssey event. This should be used to extend
     * an existing constructor's prototype.
     * @param {String} eventName the event's name.
     * @constructor
     */
    function OdysseyEvent(eventName) {
        this.type = eventName;
    }
    OdysseyEvent.prototype.propagationStopped = false;
    OdysseyEvent.prototype.stopPropagation = function () {
        this.propagationStopped = true;
    };
    OdysseyEvent.prototype.defaultPrevented = false;
    OdysseyEvent.prototype.preventDefault = function () {
        this.defaultPrevented = true;
    };

    return OdysseyEvent;
}());
