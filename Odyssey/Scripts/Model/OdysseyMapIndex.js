/*global Matrix3D, MapFile, MapFileParserResult*/
var OdysseyMapIndex = (function () {
    "use strict";
    function OdysseyMapIndex() {
        this.eventDispatcher = new OdysseyEventDispatcher();
        this.startPosition = new Matrix3D(0, 0, 0);
        this.endPosition = new Matrix3D(0, 0, 0);
    }
    OdysseyMapIndex.prototype = new OdysseyEventDispatchInterface();
    OdysseyMapIndex.prototype.setStartPosition = function (x, y, z) {
        this.startPosition.set(x, y, z);
    };
    OdysseyMapIndex.prototype.setEndPosition = function (x, y, z) {
        this.endPosition.set(x, y, z);
    };
    OdysseyMapIndex.prototype.addToResourceManager = function (resourceManager) {
        var x, y, z, startX, startY, startZ, endX, endY, endZ;
        startX = MapFile.getFileX(this.startPosition.x);
        startY = MapFile.getFileY(this.startPosition.y);
        startZ = MapFile.getFileZ(this.startPosition.z);
        endX = MapFile.getFileX(this.endPosition.x);
        endY = MapFile.getFileY(this.endPosition.y);
        endZ = MapFile.getFileZ(this.endPosition.z);

        for (x = startX; x <= endX; x += 1) {
            for (y = startY; y <= endY; y += 1) {
                for (z = startZ; z <= endZ; z += 1) {
                    // Z-component is not included in the filename.
                    resourceManager.addBinaryFile(MapFileParserResult.resolveIndex(x, y, z) + ".json");
                }
            }
        }
    };

    return OdysseyMapIndex;
}());