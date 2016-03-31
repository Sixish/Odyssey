/*global extend, OdysseyEvent*/
var OdysseySearchCompleteEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseySearchCompleteEvent(response) {
        this.messageID = response.id;
        this.results = response.result;
    }
    extend(OdysseySearchCompleteEvent.prototype, new OdysseyEvent('OdysseySearchComplete'));

    return OdysseySearchCompleteEvent;
}());
