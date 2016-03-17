/*global OdysseyEvent*/
var OdysseyWorldMapShowEvent = (function () {
    "use strict";
    function OdysseyWorldMapShowEvent() {}
    OdysseyWorldMapShowEvent.prototype = new OdysseyEvent('OdysseyWorldMapShow');

    return OdysseyWorldMapShowEvent;
}());
