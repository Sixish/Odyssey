/*global OdysseyEvent*/
var OdysseyWorldMapHideEvent = (function () {
    "use strict";
    function OdysseyWorldMapHideEvent() {}
    OdysseyWorldMapHideEvent.prototype = new OdysseyEvent('OdysseyWorldMapHide');

    return OdysseyWorldMapHideEvent;
}());
