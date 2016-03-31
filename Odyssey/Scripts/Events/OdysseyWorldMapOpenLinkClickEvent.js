/*global OdysseyEvent, extend*/
var OdysseyWorldMapOpenLinkClickEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyWorldMapOpenLinkClickEvent() {}
    extend(OdysseyWorldMapOpenLinkClickEvent.prototype, new OdysseyEvent('OdysseyWorldMapOpenLinkClick'));

    return OdysseyWorldMapOpenLinkClickEvent;
}());
