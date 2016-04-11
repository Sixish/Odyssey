/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.WorldMapOpenLinkClickEvent');
Odyssey.Events.WorldMapOpenLinkClickEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyWorldMapOpenLinkClickEvent() {}
    extend(OdysseyWorldMapOpenLinkClickEvent.prototype, new Odyssey.Events.Event('OdysseyWorldMapOpenLinkClick'));

    return OdysseyWorldMapOpenLinkClickEvent;
}());
