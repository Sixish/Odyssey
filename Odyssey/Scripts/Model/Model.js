/* OdysseyModel.js
 * Contains game information. This includes:
 * - World : the world of the game.
 * - Dat : a Dat context on which the map is based on.
 */
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Model.MapFileParser');
goog.require('Odyssey.Model.MapFileParserResult');
goog.require('Odyssey.Model.MapFile');
goog.provide('Odyssey.Model.Model');
Odyssey.Model.Model = (function () {
    "use strict";
    /**
     * Creates a model for the web application.
     * @constructor.
     */
    function OdysseyModel() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
        this.world = null;
        this.geography = null;
        this.worldSpawns = null;

        /**
         * The maps that are loaded.
         */
        this.maps = {};

        /**
         * The maps that have failed to load.
         */
        this.mapsFailed = {};
    }
    extend(OdysseyModel.prototype, new Odyssey.Events.EventDispatchInterface());

    /**
     * Sets the resource manager for the model.
     * This will be used to load map files.
     * @param {ResourceManager} resourceManager the resource manager to use.
     */
    OdysseyModel.prototype.setResourceManager = function (resourceManager) {
        var ctx = this;
        this.resourceManager = resourceManager;
        this.resourceManager.setParentEventHandler(this.eventDispatcher);
        // Handle map file loads.
        this.resourceManager.addEventListener("OdysseyBinaryFileLoaded", function (e) {
            var file = e.file;
            if (file && file.hasOwnProperty('contents')) {
                ctx.parseMapDataFile(file.contents);
            }
        });
    };

    /**
     * Gets the resource manager of the model.
     * @returns {ResourceManager} the resource manager used by the model.
     */
    OdysseyModel.prototype.getResourceManager = function () {
        return this.resourceManager;
    };

    /**
     * Parses the text of a map file.
     * @param {String} input the text of the map file to parse.
     */
    OdysseyModel.prototype.parseMapDataFile = function (input) {
        var parser, results, key, maps = this.maps;
        parser = new Odyssey.Model.MapFileParser();
        results = parser.parse(input);
        key = Odyssey.Model.MapFileParserResult.resolveIndex(
            Odyssey.Model.MapFile.getFileX(results.BaseX),
            Odyssey.Model.MapFile.getFileY(results.BaseY),
            Odyssey.Model.MapFile.getFileZ(results.BaseZ)
        );
        maps[key] = results;
        return results;
    };

    /**
     * Loads the map file at the given position.
     * @param {Number} mapX the map file's base X component. Use MapFile.getFileX to get this value.
     * @param {Number} mapY the map file's base Y component. Use MapFile.getFileY to get this value.
     * @param {Number} mapZ the map file's base Z component. Use MapFile.getFileZ to get this value.
     */
    OdysseyModel.prototype.loadMapFile = function (mapX, mapY, mapZ) {
        var index, id;
        index = Odyssey.Model.MapFileParserResult.resolveIndex(mapX, mapY, mapZ) + ".json";
        if (!this.resourceManager.hasFile(index)) {
            return false;
        }
        id = this.resourceManager.getResourceIDByFilename(index);
        // TODO is this check necessary?
        if (!(this.resourceManager.isLoaded(id) || this.resourceManager.isLoading(id))) {
            this.resourceManager.load(id);
            // Map file is not ready to use.
            return false;
        }
        // Map file is already loaded, indicate that it is ready to use.
        return true;
    };

    /**
     * Gets the map file at the position x, y, z.
     * @param {Number} x the position X component.
     * @param {Number} y the position Y component.
     * @param {Number} z the position Z component.
     * @returns {Object} the map containing the position.
     */
    OdysseyModel.prototype.getMap = function (x, y, z) {
        var mapOffset = Odyssey.Model.MapFileParserResult.resolveIndex(
            Odyssey.Model.MapFile.getFileX(x),
            Odyssey.Model.MapFile.getFileY(y),
            Odyssey.Model.MapFile.getFileZ(z)
        );
        return this.maps[mapOffset];
    };

    /**
     * Gets the items on the tile at position x, y, z.
     * @param {Number} x the position X component.
     * @param {Number} y the position Y component.
     * @param {Number} z the position Z component.
     * @returns {Array<Object>} an array of map items.
     */
    OdysseyModel.prototype.getTileItems = function (x, y, z) {
        var map = this.getMap(x, y, z), tile;

        if (!map) {
            return null;
        }

        tile = map.Map[((x - map.BaseX) << 8) + (y - map.BaseY)];

        if (!tile) {
            return null;
        }

        return tile.Items || null;
    };

    /**
     * Tests if the map is loaded at the given position.
     * @param {Number} posx the position X component.
     * @param {Number} posy the position Y component.
     * @param {Number} posz the position Z component.
     * @returns {Boolean} true if the map is loaded; false otherwise.
     */
    OdysseyModel.prototype.mapIsLoaded = function (posx, posy, posz) {
        var fposx, fposy, fposz, filename, resourceID;

        // Get the MapFile position components.
        fposx = Odyssey.Model.MapFile.getFileX(posx);
        fposy = Odyssey.Model.MapFile.getFileY(posy);
        fposz = Odyssey.Model.MapFile.getFileZ(posz);

        // Get the filename for the corresponding MapFile position components.
        filename = Odyssey.Model.MapFileParserResult.resolveIndex(fposx, fposy, fposz) + ".json";

        // Ensure the file exists.
        if (!this.resourceManager.hasFile(filename)) {
            // We don't want to attempt loading this again.
            return true;
        }

        // Get the resource ID for the filename.
        resourceID = this.resourceManager.getResourceIDByFilename(filename);

        return this.resourceManager.isLoaded(resourceID);
    };

    /**
     * Tests if a map has failed to load.
     * @param {Number} posx the position X component.
     * @param {Number} posy the position Y component.
     * @param {Number} posz the position Z component.
     * @returns {Boolean} true if the map is loaded; false otherwise.
     */
    OdysseyModel.prototype.mapHasFailed = function (posx, posy, posz) {
        var fposx, fposy, fposz, filename, resourceID;
        // Get the MapFile position components.
        fposx = Odyssey.Model.MapFile.getFileX(posx);
        fposy = Odyssey.Model.MapFile.getFileY(posy);
        fposz = Odyssey.Model.MapFile.getFileZ(posz);

        // Get the filename for the corresponding MapFile position components.
        filename = Odyssey.Model.MapFileParserResult.resolveIndex(fposx, fposy, fposz) + ".json";

        // Ensure the file exists.
        if (!this.resourceManager.hasFile(filename)) {
            return true;
        }

        // Get the resource ID for the filename.
        resourceID = this.resourceManager.getResourceIDByFilename(filename);
        return this.resourceManager.hasFailed(resourceID);
    };

    /**
     * Loads the maps in the position range.
     * @param {Number} xs the start X coordinate.
     * @param {Number} ys the start Y coordinate.
     * @param {Number} zs the start Z coordinate.
     * @param {Number} xe the end X coordinate.
     * @param {Number} ye the end Y coordinate.
     * @param {Number} ze the end Z coordinate.
     * @returns {Boolean} true if all maps are loaded; false otherwise.
     */
    OdysseyModel.prototype.loadMaps = function (xs, ys, zs, xe, ye, ze) {
        var x, y, z, success = true;

        // Get the base values for the maps.
        xs = Odyssey.Model.MapFile.getFileX(xs);
        ys = Odyssey.Model.MapFile.getFileY(ys);
        zs = Odyssey.Model.MapFile.getFileZ(zs);

        xe = Odyssey.Model.MapFile.getFileX(xe);
        ye = Odyssey.Model.MapFile.getFileY(ye);
        ze = Odyssey.Model.MapFile.getFileZ(ze);

        for (x = xs; x <= xe; x += 1) {
            for (y = ys; y <= ye; y += 1) {
                for (z = zs; z <= ze; z += 1) {
                    if (!this.loadMapFile(x, y, z)) {
                        success = false;
                    }
                }
            }
        }
        return success;
    };

    /**
     * Tests if maps are loaded in the position range.
     * @param {Number} xs the start X coordinate.
     * @param {Number} ys the start Y coordinate.
     * @param {Number} zs the start Z coordinate.
     * @param {Number} xe the end X coordinate.
     * @param {Number} ye the end Y coordinate.
     * @param {Number} ze the end Z coordinate.
     * @returns {Boolean} true if all maps are loaded; false otherwise.
     */
    OdysseyModel.prototype.mapsLoadedInRange = function (xs, ys, zs, xe, ye, ze) {
        var x, y, z, filename, resourceID;

        // Get the base values for the maps.
        xs = Odyssey.Model.MapFile.getFileX(xs);
        ys = Odyssey.Model.MapFile.getFileY(ys);
        zs = Odyssey.Model.MapFile.getFileZ(zs);

        xe = Odyssey.Model.MapFile.getFileX(xe);
        ye = Odyssey.Model.MapFile.getFileY(ye);
        ze = Odyssey.Model.MapFile.getFileZ(ze);

        for (x = xs; x <= xe; x += 1) {
            for (y = ys; y <= ye; y += 1) {
                for (z = zs; z <= ze; z += 1) {
                    filename = Odyssey.Model.MapFileParserResult.resolveIndex(x, y, z) + ".json";
                    if (this.resourceManager.hasFile(filename)) {
                        resourceID = this.resourceManager.getResourceIDByFilename(filename);
                        if (!this.resourceManager.isLoaded(resourceID)) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };

    /**
     * Sets the dat context to be used for the model.
     * @param {Dat} dat the dat context to be used for the model.
     */
    OdysseyModel.prototype.setDat = function (dat) {
        this.dat = dat;
    };

    /**
     * Gets the dat context used by the model.
     * @returns {Dat} the dat context used by the model.
     */
    OdysseyModel.prototype.getDat = function () {
        return this.dat;
    };

    /**
     * Sets the world of the model.
     * @param {OdysseyWorld} world the world to use for the model.
     */
    OdysseyModel.prototype.setWorld = function (world) {
        this.world = world;
    };

    /**
     * Gets the world of the model.
     * @returns {OdysseyWorld} the world of the model, or null if one is not set.
     */
    OdysseyModel.prototype.getWorld = function () {
        return this.world;
    };

    /**
     * Sets the geography object of the model.
     * @param {OdysseyGeography} geography the geography object to use for the model.
     */
    OdysseyModel.prototype.setGeography = function (geography) {
        this.geography = geography;
    };

    /**
     * Gets the geography object of the model.
     * @returns {OdysseyGeography} the geography object of the model, or null if one is not set.
     */
    OdysseyModel.prototype.getGeography = function () {
        return this.geography;
    };

    /**
     * Sets the spawns of the model world.
     * @param {OdysseyWorldSpawns} spawns the spawns of the model world.
     */
    OdysseyModel.prototype.setWorldSpawns = function (spawns) {
        this.worldSpawns = spawns;
    };

    /**
     * Gets the spawns of the model world.
     * @returns {OdysseyWorldSpawns} the spawns object of the model world, or null if one is not set.
     */
    OdysseyModel.prototype.getWorldSpawns = function () {
        return this.worldSpawns;
    };

    /**
     * Sets the map index of the model.
     * @param {OdysseyMapIndex} mapIndex the map index object to use for the model.
     */
    OdysseyModel.prototype.setMapIndex = function (mapIndex) {
        this.mapIndex = mapIndex;
    };

    /**
     * Gets the map index of the model.
     * @returns {OdysseyMapIndex} the map index object used by the model.
     */
    OdysseyModel.prototype.getMapIndex = function () {
        return this.mapIndex;
    };

    return OdysseyModel;
}());
