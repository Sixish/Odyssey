///*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.provide('Odyssey.Model.Geography');
Odyssey.Model.Geography = (function () {
    "use strict";
    /**
     * Creates a geography object to use for the model.
     * @constructor
     */
    function OdysseyGeography() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
    }
    extend(OdysseyGeography.prototype, new Odyssey.Events.EventDispatchInterface());

    return OdysseyGeography;
}());
