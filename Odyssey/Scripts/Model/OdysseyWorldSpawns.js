/*global extend, OdysseyEventDispatchInterface, OdysseyEventDispatcher*/
var OdysseyWorldSpawns = (function () {
    "use strict";
    function OdysseyWorldSpawns() {
        this.eventDispatcher = new OdysseyEventDispatcher();
    }
    extend(OdysseyWorldSpawns.prototype, new OdysseyEventDispatchInterface());

    return OdysseyWorldSpawns;
}());
