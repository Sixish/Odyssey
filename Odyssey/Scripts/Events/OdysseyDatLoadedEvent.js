/*global extend, OdysseyEvent*/
var OdysseyDatLoadedEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyDatLoadedEvent() {}
    extend(OdysseyDatLoadedEvent.prototype, new OdysseyEvent("OdysseyDatLoaded"));

    return OdysseyDatLoadedEvent;
}());
