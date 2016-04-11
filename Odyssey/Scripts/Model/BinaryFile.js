goog.provide('Odyssey.Model.BinaryFile');
// TODO CHECK IF THIS IS USED
Odyssey.Model.BinaryFile = (function () {
    "use strict";
    /**
     * Constructor for binary files.
     * @constructor
     */
    function BinaryFile() {
        this.contents = null;
    }

    /**
     * Sets the contents of the BinaryFile.
     * @param {String} string the contents of the BinaryFile.
     */
    BinaryFile.prototype.setContents = function (string) {
        this.contents = string;
    };

    return BinaryFile;
}());
