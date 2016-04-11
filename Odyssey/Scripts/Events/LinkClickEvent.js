/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.LinkClickEvent');
Odyssey.Events.LinkClickEvent = (function () {
    "use strict";
    function OdysseyLinkClickEvent(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    extend(OdysseyLinkClickEvent.prototype, new Odyssey.Events.Event("OdysseyLinkClick"));

    return OdysseyLinkClickEvent;
}());
