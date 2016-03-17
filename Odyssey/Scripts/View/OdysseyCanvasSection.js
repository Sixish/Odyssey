/*jslint browser: true, bitwise: true, devel:true */
/*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile, OdysseyMapSearchEvent, Worker */
/* OdysseyCanvasSection.js
 * Handles Canvas sections.
 * OdysseyTileMap uses nine canvas sections of size 3x3.
 */
var OdysseyCanvasSection = (function () {
    "use strict";
    /**
     * Creates a new OdysseyCanvasSection.
     * @constructor
     */
    function OdysseyCanvasSection() {
        this.x = null;
        this.y = null;
        this.z = null;
    }
    return OdysseyCanvasSection;
}());
