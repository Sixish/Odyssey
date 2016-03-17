/*jslint browser: true, bitwise: true, devel:true */
/*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile, OdysseyMapSearchEvent, Worker */
var MapFileParserResult = (function () {
    "use strict";
    /**
     * Creates a new MapFileParserResult. The result of parsing a map file.
     * @constructor
     */
    function MapFileParserResult() {
        this.mapFiles = [];
    }
    /**
     * Resolves the filename index for the MapFile.
     * @param fposx The MapFile base X value.
     * @param fposy The MapFile base Y value.
     * @param fposz The MapFile base Z value.
     * @returns The unique index of that MapFile - the filename.
     */
    MapFileParserResult.resolveIndex = function (fposx, fposy, fposz) {
        return ((fposx & 0xFF) << 0) + ((fposy & 0xFF) << 8) + ((fposz & 0xF) << 16);
    };
    return MapFileParserResult;
}());
