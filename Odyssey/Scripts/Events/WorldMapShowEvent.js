/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.WorldMapShowEvent');
Odyssey.Events.WorldMapShowEvent = (function () {
    "use strict";
    function OdysseyWorldMapShowEvent() {}
    extend(OdysseyWorldMapShowEvent.prototype, new Odyssey.Events.Event('OdysseyWorldMapShow'));

    return OdysseyWorldMapShowEvent;
}());
