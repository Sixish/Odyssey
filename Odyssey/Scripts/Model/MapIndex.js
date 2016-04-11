///*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Model.Matrix3D');
goog.require('Odyssey.Model.MapFile');
goog.require('Odyssey.Model.MapFileParserResult');
goog.provide('Odyssey.Model.MapIndex');
Odyssey.Model.MapIndex = OdysseyMapIndex = (function () {
    "use strict";
    /**
     * Creates a map index.
     * @constructor
     */
    function OdysseyMapIndex() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
        this.startPosition = new Odyssey.Model.Matrix3D(0, 0, 0);
        this.endPosition = new Odyssey.Model.Matrix3D(0, 0, 0);
    }
    extend(OdysseyMapIndex.prototype, new Odyssey.Events.EventDispatchInterface());

    /**
     * Sets the start position of the map index.
     * @param {Number} x the start x-coordinate of the map index.
     * @param {Number} y the start y-coordinate of the map index.
     * @param {Number} z the start z-coordinate of the map index.
     */
    OdysseyMapIndex.prototype.setStartPosition = function (x, y, z) {
        this.startPosition.set(x, y, z);
    };

    /**
     * Sets the end position of the map index.
     * @param {Number} x the end x-coordinate of the map index.
     * @param {Number} y the end y-coordinate of the map index.
     * @param {Number} z the end z-coordinate of the map index.
     */
    OdysseyMapIndex.prototype.setEndPosition = function (x, y, z) {
        this.endPosition.set(x, y, z);
    };

    /**
     * Adds the map index data to the resource manager so that
     * the resource manager knows which resources are valid.
     * @param {ResourceManager} the resource manager to add to.
     */
    OdysseyMapIndex.prototype.addToResourceManager = function (resourceManager) {
        var x, y, z, startX, startY, startZ, endX, endY, endZ;
        startX = Odyssey.Model.MapFile.getFileX(this.startPosition.x);
        startY = Odyssey.Model.MapFile.getFileY(this.startPosition.y);
        startZ = Odyssey.Model.MapFile.getFileZ(this.startPosition.z);
        endX = Odyssey.Model.MapFile.getFileX(this.endPosition.x);
        endY = Odyssey.Model.MapFile.getFileY(this.endPosition.y);
        endZ = Odyssey.Model.MapFile.getFileZ(this.endPosition.z);

        for (x = startX; x <= endX; x += 1) {
            for (y = startY; y <= endY; y += 1) {
                for (z = startZ; z <= endZ; z += 1) {
                    // Z-component is not included in the filename.
                    resourceManager.addBinaryFile(Odyssey.Model.MapFileParserResult.resolveIndex(x, y, z) + ".json");
                }
            }
        }
    };

    return OdysseyMapIndex;
}());
