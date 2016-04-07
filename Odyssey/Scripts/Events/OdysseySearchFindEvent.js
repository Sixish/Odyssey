/*global extend, OdysseyEvent*/
var OdysseySearchFindEvent = (function () {
    "use strict";
    /**
     * Creates an instance of a search find event.
     * @param {Object} response the search response.
     * @constructor
     */
    function OdysseySearchFindEvent(response) {
        this.messageID = response.id;
        this.result = response.result;
    }
    extend(OdysseySearchFindEvent.prototype, new OdysseyEvent('OdysseySearchFind'));

    return OdysseySearchFindEvent;
}());
