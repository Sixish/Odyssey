/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.MinimapRenderedEvent');
Odyssey.Events.MinimapRenderedEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyMinimapRenderedEvent() {}
    extend(OdysseyMinimapRenderedEvent.prototype, new Odyssey.Events.Event('OdysseyMiniMapRendered'));

    return OdysseyMinimapRenderedEvent;
}());
