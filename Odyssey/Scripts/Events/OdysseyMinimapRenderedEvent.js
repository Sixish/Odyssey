/*global extend, OdysseyEvent*/
var OdysseyMinimapRenderedEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyMinimapRenderedEvent() {}
    extend(OdysseyMinimapRenderedEvent.prototype, new OdysseyEvent('OdysseyMiniMapRendered'));

    return OdysseyMinimapRenderedEvent;
}());
