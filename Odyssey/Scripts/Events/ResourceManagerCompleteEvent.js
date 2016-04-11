/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.ResourceManagerCompleteEvent');
Odyssey.Events.ResourceManagerCompleteEvent = (function () {
    "use strict";
    function OdysseyResourceManagerCompleteEvent() {}
    extend(OdysseyResourceManagerCompleteEvent.prototype, new Odyssey.Events.Event("OdysseyResourceManagerComplete"));

    return OdysseyResourceManagerCompleteEvent;
}());
