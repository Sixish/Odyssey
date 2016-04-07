/*global extend, OdysseyEvent*/
var OdysseyMapClickEvent = (function () {
    "use strict";
    /**
     * Creates an instance of the map click event.
     * @param {Matrix3D} pos the position on the map that was clicked.
     * @constructor
     */
    function OdysseyMapClickEvent(pos) {
        this.position = pos;
    }
    extend(OdysseyMapClickEvent.prototype, new OdysseyEvent('OdysseyMapClick'));

    return OdysseyMapClickEvent;
}());
