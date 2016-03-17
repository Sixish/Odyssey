/*global OdysseyEvent*/
var OdysseyInitializedEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyInitializedEvent() {}
    OdysseyInitializedEvent.prototype = new OdysseyEvent("OdysseyInitialized");

    return OdysseyInitializedEvent;
}());