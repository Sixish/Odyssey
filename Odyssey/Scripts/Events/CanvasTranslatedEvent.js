goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.CanvasTranslatedEvent');
Odyssey.Events.CanvasTranslatedEvent = (function () {
    "use strict";
    function OdysseyCanvasTranslatedEvent() {}
    extend(OdysseyCanvasTranslatedEvent.prototype, new Odyssey.Events.Event("CanvasTranslatedEvent"));

    return OdysseyCanvasTranslatedEvent;
}());