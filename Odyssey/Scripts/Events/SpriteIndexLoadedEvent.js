/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.SpriteIndexLoadedEvent');
Odyssey.Events.SpriteIndexLoadedEvent = (function () {
    "use strict";
    function OdysseySpriteIndexLoadedEvent() {}
    extend(OdysseySpriteIndexLoadedEvent.prototype, new Odyssey.Events.Event('OdysseySpriteIndexLoaded'));

    return OdysseySpriteIndexLoadedEvent;
}());
