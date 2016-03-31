/*global extend, OdysseyEvent*/
var OdysseyWorldMapHideEvent = (function () {
    "use strict";
    function OdysseyWorldMapHideEvent() {}
    extend(OdysseyWorldMapHideEvent.prototype, new OdysseyEvent('OdysseyWorldMapHide'));

    return OdysseyWorldMapHideEvent;
}());
