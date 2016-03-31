/*global extend, OdysseyEvent*/
var OdysseyMapRenderCompleteEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyMapRenderCompleteEvent() {}
    // Extends OdysseyEvent
    extend(OdysseyMapRenderCompleteEvent.prototype, new OdysseyEvent('OdysseyMapRenderComplete'));

    return OdysseyMapRenderCompleteEvent;
}());
