/*global extend, OdysseyEventDispatchInterface, OdysseyEventDispatcher*/
var OdysseyWorldSpawns = (function () {
    "use strict";
    /**
     * Creates a world spawns object.
     * @constructor
     */
    function OdysseyWorldSpawns() {
        this.eventDispatcher = new OdysseyEventDispatcher();
    }
    extend(OdysseyWorldSpawns.prototype, new OdysseyEventDispatchInterface());

    return OdysseyWorldSpawns;
}());
