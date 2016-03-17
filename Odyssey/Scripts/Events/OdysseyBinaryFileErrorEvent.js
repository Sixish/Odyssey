/*global OdysseyEvent*/
var OdysseyBinaryFileErrorEvent = (function () {
    "use strict";
    function OdysseyBinaryFileErrorEvent(context) {
        this.file = context;
    }
    OdysseyBinaryFileErrorEvent.prototype = new OdysseyEvent("OdysseyBinaryFileError");

    return OdysseyBinaryFileErrorEvent;
}());
