var OdysseyMapClickEvent = (function () {
    /**
     * @constructor
     */
    function OdysseyMapClickEvent(pos) {
        this.position = pos;
    }
    OdysseyMapClickEvent.prototype = new OdysseyEvent('OdysseyMapClick');

    return OdysseyMapClickEvent;
}());
