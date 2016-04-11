/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.InitializedEvent');
Odyssey.Events.InitializedEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyInitializedEvent() {}
    extend(OdysseyInitializedEvent.prototype, new Odyssey.Events.Event("OdysseyInitialized"));

    return OdysseyInitializedEvent;
}());
