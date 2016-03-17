/*jslint bitwise: true*/
/*global OdysseyEventDispatcher, OdysseyEventDispatchInterface, MapFileParser, MapFileParserResult, MapFile, OdysseyMapFileLoadedEvent*/
/**
 * OdysseyModel.js
 *
 * Contains game information. This includes:
 * - World : the world of the game.
 * - Dat : a Dat context on which the map is based on.
 */
var OdysseyModel = (function () {
    "use strict";
    function OdysseyModel() {
        this.eventDispatcher = new OdysseyEventDispatcher();
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
    OdysseyModel.prototype = new OdysseyEventDispatchInterface();

    /**
     * Sets the resource manager for the model.
     * This will be used to load map files.
     * @param {ResourceManager} resourceManager the resource manager to use.
     */
    OdysseyModel.prototype.setResourceManager = function (resourceManager) {
        this.resourceManager = resourceManager;
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
     * @param input the text of the map file to parse.
     */
    OdysseyModel.prototype.parseMapDataFile = function (input) {
        var parser, results, key, maps = this.maps;
        parser = new MapFileParser();
        results = parser.parse(input);
        key = MapFileParserResult.resolveIndex(MapFile.getFileX(results.BaseX), MapFile.getFileY(results.BaseY), MapFile.getFileZ(results.BaseZ));
        maps[key] = results;
        return results;
    };

    /**
     * Loads the map file at the given position.
     * @param mapX the map file's base X component. Use MapFile.getFileX to get this value.
     * @param mapY the map file's base Y component. Use MapFile.getFileY to get this value.
     * @param mapZ the map file's base Z component. Use MapFile.getFileZ to get this value.
     */
    OdysseyModel.prototype.loadMapFile = function (mapX, mapY, mapZ) {
        var ctx = this, index, id, resource;
        index = MapFileParserResult.resolveIndex(mapX, mapY, mapZ) + ".json";
        if (!this.resourceManager.hasFile(index)) {
            return false;
        }
        id = this.resourceManager.getResourceIDByFilename(index);
        resource = this.resourceManager.getResource(id);
        if (!resource.isLoading()) {
            resource.addEventListener('load', function () {
                var map = ctx.parseMapDataFile(resource.getResourceContents());
                ctx.dispatchEvent(new OdysseyMapFileLoadedEvent(map));
            });
            resource.load();
        }
    };

    /**
     * Gets the map file at the position x, y, z.
     * @param x the position X component.
     * @param y the position Y component.
     * @param z the position Z component.
     * @returns the map containing the position.
     */
    OdysseyModel.prototype.getMap = function (x, y, z) {
        var mapOffset = MapFileParserResult.resolveIndex(MapFile.getFileX(x), MapFile.getFileY(y), MapFile.getFileZ(z));
        return this.maps[mapOffset];
    };

    /**
     * Gets the items on the tile at position x, y, z.
     * @param x the position X component.
     * @param y the position Y component.
     * @param z the position Z component.
     * @returns an array of map items.
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
     * @param posx the position X component.
     * @param posy the position Y component.
     * @param posz the position Z component.
     * @returns true if the map is loaded; false otherwise.
     */
    OdysseyModel.prototype.mapIsLoaded = function (posx, posy, posz) {
        var fposx, fposy, fposz, filename, resourceID;

        // Get the MapFile position components.
        fposx = MapFile.getFileX(posx);
        fposy = MapFile.getFileY(posy);
        fposz = MapFile.getFileZ(posz);

        // Get the filename for the corresponding MapFile position components.
        filename = MapFileParserResult.resolveIndex(fposx, fposy, fposz) + ".json";

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
     * @param posx the position X component.
     * @param posy the position Y component.
     * @param posz the position Z component.
     * @returns true if the map is loaded; false otherwise.
     */
    OdysseyModel.prototype.mapHasFailed = function (posx, posy, posz) {
        var fposx, fposy, fposz, filename, resourceID;
        // Get the MapFile position components.
        fposx = MapFile.getFileX(posx);
        fposy = MapFile.getFileY(posy);
        fposz = MapFile.getFileZ(posz);

        // Get the filename for the corresponding MapFile position components.
        filename = MapFileParserResult.resolveIndex(fposx, fposy, fposz) + ".json";

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
     * @param xs the start X coordinate.
     * @param ys the start Y coordinate.
     * @param zs the start Z coordinate.
     * @param xe the end X coordinate.
     * @param ye the end Y coordinate.
     * @param ze the end Z coordinate.
     * @returns true if all maps are loaded; false otherwise.
     */
    OdysseyModel.prototype.loadMaps = function (xs, ys, zs, xe, ye, ze) {
        var x, y, z, filename, resourceID;

        // Get the base values for the maps.
        xs = MapFile.getFileX(xs);
        ys = MapFile.getFileY(ys);
        zs = MapFile.getFileZ(zs);

        xe = MapFile.getFileX(xe);
        ye = MapFile.getFileY(ye);
        ze = MapFile.getFileZ(ze);

        for (x = xs; x <= xe; x += 1) {
            for (y = ys; y <= ye; y += 1) {
                for (z = zs; z <= ze; z += 1) {
                    filename = MapFileParserResult.resolveIndex(x, y, z) + ".json";
                    if (this.resourceManager.hasFile(filename)) {
                        resourceID = this.resourceManager.getResourceIDByFilename(filename);
                        if (!this.resourceManager.isLoaded(resourceID)) {
                            this.loadMapFile(x, y, z);
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };

    /**
     * Tests if maps are loaded in the position range.
     * @param xs the start X coordinate.
     * @param ys the start Y coordinate.
     * @param zs the start Z coordinate.
     * @param xe the end X coordinate.
     * @param ye the end Y coordinate.
     * @param ze the end Z coordinate.
     * @returns true if all maps are loaded; false otherwise.
     */
    OdysseyModel.prototype.mapsLoadedInRange = function (xs, ys, zs, xe, ye, ze) {
        var x, y, z, filename, resourceID;

        // Get the base values for the maps.
        xs = MapFile.getFileX(xs);
        ys = MapFile.getFileY(ys);
        zs = MapFile.getFileZ(zs);

        xe = MapFile.getFileX(xe);
        ye = MapFile.getFileY(ye);
        ze = MapFile.getFileZ(ze);

        for (x = xs; x <= xe; x += 1) {
            for (y = ys; y <= ye; y += 1) {
                for (z = zs; z <= ze; z += 1) {
                    filename = MapFileParserResult.resolveIndex(x, y, z) + ".json";
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
     * @param dat the dat context to be used for the model.
     */
    OdysseyModel.prototype.setDat = function (dat) {
        this.dat = dat;
    };

    /**
     * Gets the dat context used by the model.
     * @returns the dat context used by the model.
     */
    OdysseyModel.prototype.getDat = function () {
        return this.dat;
    };

    /**
     * Sets the world of the model.
     * @param world the world to use for the model.
     */
    OdysseyModel.prototype.setWorld = function (world) {
        this.world = world;
    };

    /**
     * Gets the world of the model.
     * @returns the world of the model, or null if one is not set.
     */
    OdysseyModel.prototype.getWorld = function () {
        return this.world;
    };

    /**
     * Sets the geography object of the model.
     * @param geography the geography object to use for the model.
     */
    OdysseyModel.prototype.setGeography = function (geography) {
        this.geography = geography;
    };

    /**
     * Gets the geography object of the model.
     * @returns the geography object of the model, or null if one is not set.
     */
    OdysseyModel.prototype.getGeography = function () {
        return this.geography;
    };

    /**
     * Sets the spawns of the model world.
     * @param spawns the spawns of the model world.
     */
    OdysseyModel.prototype.setWorldSpawns = function (spawns) {
        this.worldSpawns = spawns;
    };

    /**
     * Gets the spawns of the model world.
     * @returns the spawns object of the model world, or null if one is not set.
     */
    OdysseyModel.prototype.getWorldSpawns = function () {
        return this.worldSpawns;
    };

    /**
     * Sets the map index of the model.
     * @param {OdysseyMapIndex} the map index object to use for the model.
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
