/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.BinaryFileLoadedEvent');
Odyssey.Events.BinaryFileLoadedEvent = (function () {
    "use strict";
    function OdysseyBinaryFileLoadedEvent(context) {
        this.file = context;
    }
    extend(OdysseyBinaryFileLoadedEvent.prototype, new Odyssey.Events.Event("OdysseyBinaryFileLoaded"));

    return OdysseyBinaryFileLoadedEvent;
}());
