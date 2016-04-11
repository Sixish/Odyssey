/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.DatLoadedEvent');
Odyssey.Events.DatLoadedEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyDatLoadedEvent() {}
    extend(OdysseyDatLoadedEvent.prototype, new Odyssey.Events.Event("OdysseyDatLoaded"));

    return OdysseyDatLoadedEvent;
}());
