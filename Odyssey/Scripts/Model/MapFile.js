/*jslint bitwise: true */
/*global console*/
var MapFile = (function () {
    "use strict";

    /**
     * Creates a new MapFile corresponding to 16 x 16 x 1 world tiles.
     * @constructor
     * @param x The base X value. Use MapFile.getFileX to get the base X value from position.
     * @param y The base Y value. Use MapFile.getFileY to get the base Y value from position.
     * @param z The base Z value. Use MapFile.getFileZ to get the base Z value from position.
     */
    function MapFile(x, y, z) {
        // Each MapFile contains (16 x 16 x 1), enforce it.
        console.assert(x <= 0xFFF, 'MapFile has invalid x. Must be between 0 and 4095. x=' + x);
        console.assert(y <= 0xFFF, 'MapFile has invalid y. Must be between 0 and 4095. y=' + y);
        console.assert(z <= 0xF, 'MapFile has invalid z. Must be between 0 and 15. z=' + z);
        // baseX,Y,Z used for filename resolution
        this.baseX = (x & 0xFFF);
        this.baseY = (y & 0xFFF);
        //this.baseZ = (z & 0xF);
        this.baseZ = (z & 0xF); //Debug
    }

    /**
     * Gets the MapFile's position offset.
     * @static
     * @param posx the map X position.
     * @param posy the map Y position.
     * @returns The position offset corresponding to position (x, y) on this MapFile.
     */
    MapFile.getOffset = function (x, y) {
        return ((x & 0xFFFF) << 16) + (y & 0xFFFF);
    };

    /**
     * Gets the MapFile's base X value.
     * @static
     * @param posx The map X position.
     * @returns The base X value corresponding to position posx.
     */
    MapFile.getFileX = function (posx) {
        console.assert(typeof posx === 'number', 'Cannot get filename X-component of a non-number.');
        return ((posx >> 8) & 0xFF);
    };

    /**
     * Gets the MapFile's base Y value.
     * @static
     * @param posy The map Y position.
     * @returns The base Y value corresponding to position posy.
     */
    MapFile.getFileY = function (posy) {
        console.assert(typeof posy === 'number', 'Cannot get filename Y-component of a non-number.');
        return ((posy >> 8) & 0xFF);
    };

    /**
     * Gets the MapFile's base Z value.
     * @static
     * @param posz The map Z position.
     * @returns The base Z value corresponding to position posz.
     */
    MapFile.getFileZ = function (posz) {
        console.assert(typeof posz === 'number', 'Cannot get filename Z-component of a non-number.');
        return ((posz >> 0) & 0xFF);
    };

    return MapFile;
}());
