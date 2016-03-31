/*global extend, OdysseyEvent*/
var OdysseySearchFindEvent = (function () {
    "use strict";
    /**
     * @constructor
     */
    function OdysseySearchFindEvent(response) {
        this.messageID = response.id;
        this.result = response.result;
    }
    extend(OdysseySearchFindEvent.prototype, new OdysseyEvent('OdysseySearchFind'));

    return OdysseySearchFindEvent;
}());
