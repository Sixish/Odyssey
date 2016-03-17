var OdysseyMapRenderCompleteEvent = (function () {
    /**
     * @constructor
     */
    function OdysseyMapRenderCompleteEvent() {}
    // Extends OdysseyEvent
    OdysseyMapRenderCompleteEvent.prototype = new OdysseyEvent('OdysseyMapRenderComplete');

    return OdysseyMapRenderCompleteEvent;
}());
