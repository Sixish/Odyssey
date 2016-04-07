/*global extend, OdysseyEvent*/
var OdysseyToolRowHideEvent = (function () {
    "use strict";
    /**
     * Creates an instance of the tool row hide event.
     * @constructor
     */
    function OdysseyToolRowHideEvent() {}
    extend(OdysseyToolRowHideEvent.prototype, new OdysseyEvent('OdysseyToolRowHide'));

    return OdysseyToolRowHideEvent;
}());
