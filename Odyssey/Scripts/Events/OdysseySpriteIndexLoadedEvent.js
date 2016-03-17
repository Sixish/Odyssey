/*global OdysseyEvent*/
var OdysseySpriteIndexLoadedEvent = (function () {
    "use strict";
    function OdysseySpriteIndexLoadedEvent() {}
    OdysseySpriteIndexLoadedEvent.prototype = new OdysseyEvent('OdysseySpriteIndexLoaded');

    return OdysseySpriteIndexLoadedEvent;
}());