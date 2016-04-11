/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.MapRenderCompleteEvent');
Odyssey.Events.MapRenderCompleteEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyMapRenderCompleteEvent() {}
    // Extends OdysseyEvent
    extend(OdysseyMapRenderCompleteEvent.prototype, new Odyssey.Events.Event('OdysseyMapRenderComplete'));

    return OdysseyMapRenderCompleteEvent;
}());
