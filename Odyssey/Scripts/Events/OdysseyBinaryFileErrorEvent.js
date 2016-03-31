/*global extend, OdysseyEvent*/
var OdysseyBinaryFileErrorEvent = (function () {
    "use strict";
    function OdysseyBinaryFileErrorEvent(context) {
        this.file = context;
    }
    extend(OdysseyBinaryFileErrorEvent.prototype, new OdysseyEvent("OdysseyBinaryFileError"));

    return OdysseyBinaryFileErrorEvent;
}());
