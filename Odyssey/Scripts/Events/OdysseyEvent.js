var OdysseyEvent = (function () {
    "use strict";
    /**
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
