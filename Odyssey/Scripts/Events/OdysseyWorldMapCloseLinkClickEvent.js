/*global extend, OdysseyEvent*/
var OdysseyWorldMapCloseLinkClickEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyWorldMapCloseLinkClickEvent() {}
    extend(OdysseyWorldMapCloseLinkClickEvent.prototype, new OdysseyEvent('OdysseyWorldMapCloseLinkClick'));

    return OdysseyWorldMapCloseLinkClickEvent;
}());
