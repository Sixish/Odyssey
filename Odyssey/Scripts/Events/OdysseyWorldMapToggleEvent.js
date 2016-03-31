/*global extend, OdysseyEvent*/
var OdysseyWorldMapToggleEvent = (function () {
    "use strict";
    function OdysseyWorldMapToggleEvent() {}
    extend(OdysseyWorldMapToggleEvent.prototype, new OdysseyEvent('OdysseyWorldMapToggle'));

    return OdysseyWorldMapToggleEvent;
}());
