/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.BinaryFileErrorEvent');
Odyssey.Events.BinaryFileErrorEvent = (function () {
    "use strict";
    function OdysseyBinaryFileErrorEvent(context) {
        this.file = context;
    }
    extend(OdysseyBinaryFileErrorEvent.prototype, new Odyssey.Events.Event("OdysseyBinaryFileError"));

    return OdysseyBinaryFileErrorEvent;
}());
