/*global extend, OdysseyEvent*/
var OdysseySpriteIndexLoadedEvent = (function () {
    "use strict";
    function OdysseySpriteIndexLoadedEvent() {}
    extend(OdysseySpriteIndexLoadedEvent.prototype, new OdysseyEvent('OdysseySpriteIndexLoaded'));

    return OdysseySpriteIndexLoadedEvent;
}());
