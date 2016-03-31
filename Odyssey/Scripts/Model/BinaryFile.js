/*global jQuery, OdysseyEventDispatcher, OdysseyEventDispatchInterface, OdysseyBinaryFileErrorEvent, OdysseyBinaryFileLoadedEvent*/
var BinaryFile = (function ($) {
    "use strict";
    /**
     * Constructor for binary files.
     * @constructor
     */
    function BinaryFile() {
        this.contents = null;
    }

    /**
     *
     */
    BinaryFile.prototype.setContents = function (string) {
        this.contents = string;
    };

    return BinaryFile;
}(jQuery));
