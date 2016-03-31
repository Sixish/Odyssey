/*global extend, OdysseyEvent*/
var OdysseyBinaryFileLoadedEvent = (function () {
    "use strict";
    function OdysseyBinaryFileLoadedEvent(context) {
        this.file = context;
    }
    extend(OdysseyBinaryFileLoadedEvent.prototype, new OdysseyEvent("OdysseyBinaryFileLoaded"));

    return OdysseyBinaryFileLoadedEvent;
}());
