/*global OdysseyEventDispatcher, OdysseyEventDispatchInterface*/
var OdysseyGeography = (function () {
    "use strict";
    function OdysseyGeography() {
        this.eventDispatcher = new OdysseyEventDispatcher();
    }
    OdysseyGeography.prototype = new OdysseyEventDispatchInterface();

    return OdysseyGeography;
}());
