/*jslint bitwise: true*/
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
     * @param {Number} fposx The MapFile base X value.
     * @param {Number} fposy The MapFile base Y value.
     * @param {Number} fposz The MapFile base Z value.
     * @returns {Number} The unique index of that MapFile - the filename.
     */
    MapFileParserResult.resolveIndex = function (fposx, fposy, fposz) {
        return ((fposx & 0xFF) << 0) + ((fposy & 0xFF) << 8) + ((fposz & 0xF) << 16);
    };

    return MapFileParserResult;
}());
