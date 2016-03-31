/*global extend, OdysseyEvent*/
var OdysseyInitializedEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyInitializedEvent() {}
    extend(OdysseyInitializedEvent.prototype, new OdysseyEvent("OdysseyInitialized"));

    return OdysseyInitializedEvent;
}());