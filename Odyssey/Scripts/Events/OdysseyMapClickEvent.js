/*global extend, OdysseyEvent*/
var OdysseyMapClickEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyMapClickEvent(pos) {
        this.position = pos;
    }
    extend(OdysseyMapClickEvent.prototype, new OdysseyEvent('OdysseyMapClick'));

    return OdysseyMapClickEvent;
}());
