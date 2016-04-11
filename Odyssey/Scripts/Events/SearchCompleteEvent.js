/*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.Events.SearchCompleteEvent');
Odyssey.Events.SearchCompleteEvent = (function () {
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
    extend(OdysseySearchCompleteEvent.prototype, new Odyssey.Events.Event('OdysseySearchComplete'));

    return OdysseySearchCompleteEvent;
}());
