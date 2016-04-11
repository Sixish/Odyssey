/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.WorldMapHideEvent');
Odyssey.Events.WorldMapHideEvent = (function () {
    "use strict";
    function OdysseyWorldMapHideEvent() {}
    extend(OdysseyWorldMapHideEvent.prototype, new Odyssey.Events.Event('OdysseyWorldMapHide'));

    return OdysseyWorldMapHideEvent;
}());
