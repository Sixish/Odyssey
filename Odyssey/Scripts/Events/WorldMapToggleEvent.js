/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.WorldMapToggleEvent');
Odyssey.Events.WorldMapToggleEvent = (function () {
    "use strict";
    function OdysseyWorldMapToggleEvent() {}
    extend(OdysseyWorldMapToggleEvent.prototype, new Odyssey.Events.Event('OdysseyWorldMapToggle'));

    return OdysseyWorldMapToggleEvent;
}());
