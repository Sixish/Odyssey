/*global OdysseyEventDispatcher, OdysseyEventDispatchInterface*/
var OdysseyWorldSpawns = (function () {
    "use strict";
    function OdysseyWorldSpawns() {
        this.eventDispatcher = new OdysseyEventDispatcher();
    }
    OdysseyWorldSpawns.prototype = new OdysseyEventDispatchInterface();

    return OdysseyWorldSpawns;
}());
