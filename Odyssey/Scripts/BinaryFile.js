/*jslint browser: true, bitwise: true, devel:true */
/*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile, OdysseyMapSearchEvent, Worker */
var BinaryFile = (function () {
    "use strict";
    function BinaryFile() {
        this.onerror = null;
        this.onload = null;
        this.contents = null;
    }

    BinaryFile.prototype.setContents = function (string) {
        this.contents = string;
    };
    return BinaryFile;
}());