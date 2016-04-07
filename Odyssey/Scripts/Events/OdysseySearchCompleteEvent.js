/*global extend, OdysseyEvent*/
var OdysseySearchCompleteEvent = (function () {
    "use strict";
    /**
     * Creates an instance of the search complete event.
     * @param {Object} response the search response.
     * @constructor
     */
    function OdysseySearchCompleteEvent(response) {
        this.messageID = response.id;
        this.results = response.result;
    }
    extend(OdysseySearchCompleteEvent.prototype, new OdysseyEvent('OdysseySearchComplete'));

    return OdysseySearchCompleteEvent;
}());
