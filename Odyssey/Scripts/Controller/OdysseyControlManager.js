var OdysseyControlManager = (function () {
    "use strict";
    function OdysseyControlManager() {
        this.eventDispatcher = new OdysseyEventDispatcher();
    }
    OdysseyControlManager.prototype = new OdysseyEventDispatchInterface();
    // TODO

    return OdysseyControlManager;
}());
