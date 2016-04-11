/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.MapPositionChangedEvent');
Odyssey.Events.MapPositionChangedEvent = (function () {
    "use strict";
    /**
     * Creates a new instance of the map position changed event.
     * TODO : check if this is obsolete
     * @param {Object} target the object that initiated this event.
     * @param {Matrix3D} position the current position on the map.
     * @constructor
     */
    function OdysseyMapPositionChangedEvent(target, position) {
        this.position = position;
    }
    // Extends OdysseyEvent
    extend(OdysseyMapPositionChangedEvent.prototype, new Odyssey.Events.Event('OdysseyMapPositionChange'));

    return OdysseyMapPositionChangedEvent;
}());
