/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Events.EventDispatcher');
goog.provide('Odyssey.Model.WorldSpawns');
Odyssey.Model.WorldSpawns = (function () {
    "use strict";
    /**
     * Creates a world spawns object.
     * @constructor
     */
    function OdysseyWorldSpawns() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
    }
    extend(OdysseyWorldSpawns.prototype, new Odyssey.Events.EventDispatchInterface());

    return OdysseyWorldSpawns;
}());
