/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.MapClickEvent');
Odyssey.Events.MapClickEvent = (function () {
    "use strict";
    /**
     * Creates an instance of the map click event.
     * @param {Matrix3D} pos the position on the map that was clicked.
     * @constructor
     */
    function OdysseyMapClickEvent(pos) {
        this.position = pos;
    }
    extend(OdysseyMapClickEvent.prototype, new Odyssey.Events.Event('OdysseyMapClick'));

    return OdysseyMapClickEvent;
}());
