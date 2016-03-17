var OdysseyMapFileLoadedEvent = (function () {
    /**
     * @constructor
     */
    function OdysseyMapFileLoadedEvent(map) {
        this.target = map;
    }
    OdysseyMapFileLoadedEvent.prototype = new OdysseyEvent('OdysseyMapFileLoaded');

    return OdysseyMapFileLoadedEvent;
}());
