/*global extend, OdysseyEvent*/
var OdysseyLinkClickEvent = (function () {
    "use strict";
    function OdysseyLinkClickEvent(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    extend(OdysseyLinkClickEvent.prototype, new OdysseyEvent("OdysseyLinkClick"));

    return OdysseyLinkClickEvent;
}());
