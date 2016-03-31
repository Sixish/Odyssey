/*global extend, OdysseyEvent*/
var OdysseyMapPositionChangedEvent = (function () {
    "use strict";
    /**
     * @constructor
     * @TODO check if this is obsolete
     */
    function OdysseyMapPositionChangedEvent(target, position) {
        this.position = position;
    }
    // Extends OdysseyEvent
    extend(OdysseyMapPositionChangedEvent.prototype, new OdysseyEvent('OdysseyMapPositionChange'));

    return OdysseyMapPositionChangedEvent;
}());
