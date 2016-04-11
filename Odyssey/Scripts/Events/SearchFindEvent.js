/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.SearchFindEvent');
Odyssey.Events.SearchFindEvent = (function () {
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
    extend(OdysseySearchFindEvent.prototype, new Odyssey.Events.Event('OdysseySearchFind'));

    return OdysseySearchFindEvent;
}());
