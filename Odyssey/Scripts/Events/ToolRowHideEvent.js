/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.ToolRowHideEvent');
Odyssey.Events.ToolRowHideEvent = (function () {
    "use strict";
    /**
     * Creates an instance of the tool row hide event.
     * @constructor
     */
    function OdysseyToolRowHideEvent() {}
    extend(OdysseyToolRowHideEvent.prototype, new Odyssey.Events.Event('OdysseyToolRowHide'));

    return OdysseyToolRowHideEvent;
}());
