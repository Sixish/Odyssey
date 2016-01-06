/*jslint browser: true, bitwise: true, devel:true */
/*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile, OdysseyMapSearchEvent, Worker */
var MapFileParser = (function () {
    "use strict";
    /**
     * Creates a new MapFileParser. A parser to parse Odyssey MapFiles.
     * @constructor
     */
    function MapFileParser() {
        this.tilePosition = new Matrix3D(0, 0, 0);
    }

    /**
     * Parses the text of a MapFile.
     * @param str The text of the MapFile.
     * @returns The parsed map.
     */
    MapFileParser.prototype.parse = function (str) {
        var map = JSON.parse(str), x, y, explored, tileMap, mapReplacement = [], i = 0;

        if (!map) {
            return null;
        }

        explored = map.Explored;
        tileMap = map.Map;

        // Recreate the map structure.
        for (x = 15; x >= 0; x -= 1) {
            for (y = 15; y >= 0; y -= 1) {
                if ((explored[x] >> y) & 0x1) {
                    i += 1;
                    mapReplacement[(x << 4) + y] = tileMap[tileMap.length - i];
                }
            }
        }
        map.Map = mapReplacement;
        return map;
    };
    return MapFileParser;
}());