/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.MapFileLoadedEvent');
Odyssey.Events.MapFileLoadedEvent = (function () {
    "use strict";
    /**
     * Creates an instance of the map file loaded event.
     * @param {Object} map the map file that was loaded.
     * @constructor
     */
    function OdysseyMapFileLoadedEvent(map) {
        this.target = map;
    }
    extend(OdysseyMapFileLoadedEvent.prototype, new Odyssey.Events.Event('OdysseyMapFileLoaded'));

    return OdysseyMapFileLoadedEvent;
}());
