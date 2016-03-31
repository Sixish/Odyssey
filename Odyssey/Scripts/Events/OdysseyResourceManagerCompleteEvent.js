/*global extend, OdysseyEvent*/
var OdysseyResourceManagerCompleteEvent = (function () {
    "use strict";
    function OdysseyResourceManagerCompleteEvent() {}
    extend(OdysseyResourceManagerCompleteEvent.prototype, new OdysseyEvent("OdysseyResourceManagerComplete"));

    return OdysseyResourceManagerCompleteEvent;
}());
