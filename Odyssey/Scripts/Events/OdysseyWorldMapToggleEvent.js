/*global OdysseyEvent*/
var OdysseyWorldMapToggleEvent = (function () {
    "use strict";
    function OdysseyWorldMapToggleEvent() {}
    OdysseyWorldMapToggleEvent.prototype = new OdysseyEvent('OdysseyWorldMapToggle');

    return OdysseyWorldMapToggleEvent;
}());
