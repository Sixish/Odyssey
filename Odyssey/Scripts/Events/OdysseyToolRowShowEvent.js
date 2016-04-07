/*global extend, OdysseyEvent*/
var OdysseyToolRowShowEvent = (function () {
    "use strict";
    /**
     * Creates an instance of the tool row show event.
     * @constructor
     */
    function OdysseyToolRowShowEvent() {}
    extend(OdysseyToolRowShowEvent.prototype, new OdysseyEvent('OdysseyToolRowShow'));

    return OdysseyToolRowShowEvent;
}());
