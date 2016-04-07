/*global extend, OdysseyEvent*/
var OdysseyMapFileLoadedEvent = (function () {
    "use strict";
    /**
     * Creates an instance of the map file loaded event.
     * @param {Object} map the map file that was loaded.
     * @constructor
     */
    function OdysseyMapFileLoadedEvent(map) {
        this.target = map;
    }
    extend(OdysseyMapFileLoadedEvent.prototype, new OdysseyEvent('OdysseyMapFileLoaded'));

    return OdysseyMapFileLoadedEvent;
}());
