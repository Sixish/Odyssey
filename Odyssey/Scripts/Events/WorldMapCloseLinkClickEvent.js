/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.WorldMapCloseLinkClickEvent');
Odyssey.Events.WorldMapCloseLinkClickEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyWorldMapCloseLinkClickEvent() {}
    extend(OdysseyWorldMapCloseLinkClickEvent.prototype, new Odyssey.Events.Event('OdysseyWorldMapCloseLinkClick'));

    return OdysseyWorldMapCloseLinkClickEvent;
}());
