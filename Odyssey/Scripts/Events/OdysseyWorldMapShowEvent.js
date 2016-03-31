/*global extend, OdysseyEvent*/
var OdysseyWorldMapShowEvent = (function () {
    "use strict";
    function OdysseyWorldMapShowEvent() {}
    extend(OdysseyWorldMapShowEvent.prototype, new OdysseyEvent('OdysseyWorldMapShow'));

    return OdysseyWorldMapShowEvent;
}());
