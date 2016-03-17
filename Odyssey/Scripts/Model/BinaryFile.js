/*jslint browser: true, bitwise: true, devel:true */
var BinaryFile = (function () {
    "use strict";
    /**
     * Loads a file.
     */
    function BinaryFile() {
        this.onerror = null;
        this.onload = null;
        this.contents = null;
        this.eventDispatcher = new OdysseyEventDispatcher();
    }
    BinaryFile.prototype = new OdysseyEventDispatchInterface();
    /**
     * Creates a new BinaryFile from the source.
     * @param src the source of the BinaryFile.
     */
    BinaryFile.load = function (sr) {
        var file = new BinaryFile();
        file.load(src);
        return file;
    };

    /**
     * Loads the BinaryFile.
     */
    BinaryFile.prototype.load = function (src) {
        var ctx = this;
        $.ajax({
            url: src,
            success: function (e) {
                ctx.dispatchEvent(new OdysseyBinaryFileLoadedEvent(ctx));
            },
            error: function (e) {
                ctx.dispatchEvent(new OdysseyBinaryFileErrorEvent(ctx));
            }
        });
    };

    /**
     *
     */
    BinaryFile.prototype.setContents = function (string) {
        this.contents = string;
    };

    return BinaryFile;
}());
