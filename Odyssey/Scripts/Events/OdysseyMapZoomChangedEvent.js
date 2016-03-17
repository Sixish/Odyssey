var OdysseyMapZoomChangedEvent = (function () {
    /**
     * @constructor
     */
    function OdysseyMapZoomChangedEvent(target, zoom) {
        this.zoom = zoom;
    }
    // Extends OdysseyEvent
    OdysseyMapZoomChangedEvent.prototype = new OdysseyEvent('OdysseyMapZoomChanged');

    return OdysseyMapZoomChangedEvent;
}());
