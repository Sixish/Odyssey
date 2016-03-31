/*global extend, OdysseyEvent*/
var OdysseyMapFileLoadedEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyMapFileLoadedEvent(map) {
        this.target = map;
    }
    extend(OdysseyMapFileLoadedEvent.prototype, new OdysseyEvent('OdysseyMapFileLoaded'));

    return OdysseyMapFileLoadedEvent;
}());
