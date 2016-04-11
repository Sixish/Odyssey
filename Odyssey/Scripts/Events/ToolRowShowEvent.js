/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.ToolRowShowEvent');
Odyssey.Events.ToolRowShowEvent = (function () {
    "use strict";
    /**
     * Creates an instance of the tool row show event.
     * @constructor
     */
    function OdysseyToolRowShowEvent() {}
    extend(OdysseyToolRowShowEvent.prototype, new Odyssey.Events.Event('OdysseyToolRowShow'));

    return OdysseyToolRowShowEvent;
}());
