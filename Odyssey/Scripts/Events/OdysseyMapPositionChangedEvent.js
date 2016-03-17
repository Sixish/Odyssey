var OdysseyMapPositionChangedEvent = (function () {
    /**
     * @constructor
     */
    function OdysseyMapPositionChangedEvent(target, position) {
        this.position = position;
    }
    // Extends OdysseyEvent
    OdysseyMapPositionChangedEvent.prototype = new OdysseyEvent('OdysseyMapPositionChange');

    return OdysseyMapPositionChangedEvent;
}());
