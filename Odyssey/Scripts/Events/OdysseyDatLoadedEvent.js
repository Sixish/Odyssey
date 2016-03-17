/*global OdysseyEvent*/
var OdysseyDatLoadedEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyDatLoadedEvent() {}
    OdysseyDatLoadedEvent.prototype = new OdysseyEvent("OdysseyDatLoaded");

    return OdysseyDatLoadedEvent;
}());