/*jslint browser: true, bitwise: true, devel:true */
/*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile, OdysseyMapSearchEvent, Worker */
var MapItem = (function () {
    "use strict";
    /**
     * Creates a new MapItem.
     * @constructor
     */
    function MapItem() {
        this.id = 0;
    }
    return MapItem;
}());