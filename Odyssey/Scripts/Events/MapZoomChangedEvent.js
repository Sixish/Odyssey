/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.MapZoomChangedEvent');
Odyssey.Events.MapZoomChangedEvent = (function () {
    "use strict";
    /**
     * Creates an instance of the zoom changed event.
     * TODO : check if this is obsolete
     * @param {Object} target the target that initiated this event.
     * @param {Number} zoom the new zoom level.
     * @constructor
     */
    function OdysseyMapZoomChangedEvent(target, zoom) {
        this.zoom = zoom;
    }
    // Extends OdysseyEvent
    extend(OdysseyMapZoomChangedEvent.prototype, new Odyssey.Events.Event('OdysseyMapZoomChanged'));

    return OdysseyMapZoomChangedEvent;
}());
