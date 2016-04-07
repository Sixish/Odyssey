/*global extend, OdysseyEventDispatcher, OdysseyEventDispatchInterface*/
var OdysseyGeography = (function () {
    "use strict";
    /**
     * Creates a geography object to use for the model.
     * @constructor
     */
    function OdysseyGeography() {
        this.eventDispatcher = new OdysseyEventDispatcher();
    }
    extend(OdysseyGeography.prototype, new OdysseyEventDispatchInterface());

    return OdysseyGeography;
}());
