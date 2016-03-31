/*global extend, OdysseyEvent*/
var OdysseyMapZoomChangedEvent = (function () {
    "use strict";
    /**
     * @constructor
     * @TODO check if this is obsolete
     */
    function OdysseyMapZoomChangedEvent(target, zoom) {
        this.zoom = zoom;
    }
    // Extends OdysseyEvent
    extend(OdysseyMapZoomChangedEvent.prototype, new OdysseyEvent('OdysseyMapZoomChanged'));

    return OdysseyMapZoomChangedEvent;
}());
