/*jslint browser: true, bitwise: true */
/*global Matrix3D, OdysseyCanvasSection, MapFile, MapFileParser, MapFileParserResult, jQuery*/
///*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser */
var OdysseyMapRenderer = (function ($) {
    "use strict";
    // TODO : create object pool for Matrix3D.
    // TODO REMOVE - ONE FILE ONE CLASS.
    // ResourceManager for managing spritesheets.
    //var resourceManager, resourceManagerMaps;

    // ResourceManager for managing sprite files.
    //resourceManager = new ResourceManager();
    //resourceManager.setFilepathPrefix("Odyssey/Sprites/");

    // ResourceManager for managing map files.
    //this.mapFileManager = new ResourceManager();
    //this.mapFileManager.setFilepathPrefix("Odyssey/Maps/");

    /**
     * Creates a new OdysseyMapRenderer. Used to render the game world.
     * @constructor
     */
    function OdysseyMapRenderer() {
        /**
         * The current map position. This value should
         * never be overwritten. Instead, use the Matrix3D
         * methods to set or shift the values.
         */
        this.position = new Matrix3D(0, 0, 0);

        /**
         * The position of the origin on the canvas.
         */
        this.origin = new Matrix3D(18, 10, 0);

        /**
         * The maps that are loaded.
         */
        this.maps = {};

        /**
         * The maps that have failed to load.
         */
        this.mapsFailed = {};

        /**
         * The tiles that have failed to render.
         * These are stored for selective rendering.
         */
        this.failedRenderedTiles = [];

        /**
         * The number of tiles to display on the viewport in the X direction.
         */
        this.sizeX = 0;

        /**
         * The number of tiles to display on the viewport in the Y direction.
         */
        this.sizeY = 0;

        /**
         * The canvases to draw on. Each canvas has a name which labels the canvas.
         */
        this.canvases = {};

        /**
         * The canvas data, used for canvas translations.
         */
        this.canvasData = {
            northwest: new OdysseyCanvasSection(),
            north: new OdysseyCanvasSection(),
            northeast: new OdysseyCanvasSection(),
            west: new OdysseyCanvasSection(),
            pivot: new OdysseyCanvasSection(),
            east: new OdysseyCanvasSection(),
            southwest: new OdysseyCanvasSection(),
            south: new OdysseyCanvasSection(),
            southeast: new OdysseyCanvasSection()
        };
    }

    /**
     * The minimum allowed value for the position x component.
     */
    OdysseyMapRenderer.POS_MIN_X = 31744;

    /**
     * The maximum allowed value for the position x component.
     */
    OdysseyMapRenderer.POS_MAX_X = 33791;//33536;

    /**
     * The minimum allowed value for the position y component.
     */
    OdysseyMapRenderer.POS_MIN_Y = 30976;

    /**
     * The maximum allowed value for the position y component.
     */
    OdysseyMapRenderer.POS_MAX_Y = 33279;//33024;

    /**
     * The minimum allowed value for the position z component.
     */
    OdysseyMapRenderer.POS_MIN_Z = 0;//0;

    /**
     * The maximum allowed value for the position z component.
     */
    OdysseyMapRenderer.POS_MAX_Z = 15;//15;

    /**
     * The width (x) of a map file.
     */
    OdysseyMapRenderer.MAPFILE_SIZE_X = 16;

    /**
     * The height (y) of a map file.
     */
    OdysseyMapRenderer.MAPFILE_SIZE_Y = 16;

    /**
     * The depth (z) of a map file.
     */
    OdysseyMapRenderer.MAPFILE_SIZE_Z = 1;

    /**
     * Whether or not the renderer is awaiting a full refresh.
     * This value is used by the render method to determine if a
     * full refresh is to be performed after all sprites have loaded.
     */
    OdysseyMapRenderer.prototype.awaitingRefresh = false;

    /**
     * Initializes the OdysseyMapRenderer.
     * Loads the following:
     *     SpriteSheetIndex.json.
     * @param Dat the Dat object to use for rendering.
     */
    OdysseyMapRenderer.prototype.initialize = function (Dat, spriteFileManager, mapFileManager) {
        var ctx = this;
		this.Dat = Dat;
        this.spriteFileManager = spriteFileManager;
        this.mapFileManager = mapFileManager;
		// Load all the spritesheets
		(function loadSpriteSheetIndex() {
			$.ajax({
				url: 'Odyssey/Data/SpriteSheetIndex.json',
				dataType: 'json',
				success: function (jso) {
					var spritesheets, i, len;
					ctx.spritesheets = spritesheets = jso;
					for (i = 0, len = spritesheets.length; i < len; i += 1) {
						ctx.spriteFileManager.addImage(spritesheets[i].src);
					}
				}
			});
		}());
		(function setupMaps(startX, startY, startZ, endX, endY, endZ) {
			var x, y, z;
			startX = MapFile.getFileX(startX);
			startY = MapFile.getFileY(startY);
			startZ = MapFile.getFileZ(startZ);

			endX = MapFile.getFileX(endX);
			endY = MapFile.getFileY(endY);
			endZ = MapFile.getFileZ(endZ);

			for (x = startX; x <= endX; x += 1) {
				for (y = startY; y <= endY; y += 1) {
					for (z = startZ; z <= endZ; z += 1) {
						// Z-component is not included in the filename.
						ctx.mapFileManager.addBinaryFile(MapFileParserResult.resolveIndex(x, y, z) + ".json");
					}
				}
			}
		}(OdysseyMapRenderer.POS_MIN_X, OdysseyMapRenderer.POS_MIN_Y, OdysseyMapRenderer.POS_MIN_Z,
			OdysseyMapRenderer.POS_MAX_X, OdysseyMapRenderer.POS_MAX_Y, OdysseyMapRenderer.POS_MAX_Z));
    };

    /**
     * Sets the size of the display. The canvases should have
     * sizes corresponding to 32 times the size of the
     * OdysseyMapRenderer, plus 32x32 to resolve clipping for 64x64px
     * sprites.
     * @param sx the amount of tiles in the X direction on the viewport and each canvas.
     * @param sy the amount of tiles in the Y direction on the viewport and each canvas.
     */
    OdysseyMapRenderer.prototype.setSize = function (sx, sy) {
        this.sizeX = sx;
        this.sizeY = sy;
    };

    /**
     * Gets the canvas section corresponding to the input position components.
     * @param posx the position X component of the canvas section.
     * @param posy the position Y component of the canvas section.
     */
    OdysseyMapRenderer.prototype.getCanvasSection = function (posx, posy) {
        var sx = this.sizeX,
            sy = this.sizeY,
            px = this.canvasData.pivot.x,
            py = this.canvasData.pivot.y,
            south = false,
            north = false,
            east = false,
            west = false,
            unchangedX = false,
            unchangedY = false;

        // PosX.
        if ((px - sx) <= posx && posx < px) {
            west = true;
        }
        if (px <= posx && posx < (px + sx)) {
            unchangedX = true;
        }
        if ((px + sx) <= posx && posx < (px + 2 * sx)) {
            east = true;
        }

        // PosY.
        if ((py - sy) <= posy && posy < py) {
            north = true;
        }
        if (py <= posy && posy < (py + sy)) {
            unchangedY = true;
        }
        if ((py + sy) <= posy && posy < (py + 2 * sy)) {
            south = true;
        }

        if (unchangedX && unchangedY) {
            return this.canvases.pivot;
        }

        if (north && west) {
            return this.canvases.northwest;
        }

        if (north && east) {
            return this.canvases.northeast;
        }

        if (south && west) {
            return this.canvases.southwest;
        }

        if (south && east) {
            return this.canvases.southeast;
        }

        if (west) {
            return this.canvases.west;
        }

        if (east) {
            return this.canvases.east;
        }

        if (north) {
            return this.canvases.north;
        }

        if (south) {
            return this.canvases.south;
        }

        return null;
    };

    /**
     * Gets the sprite ID for the corresponding item given the inputs.
     * 1. Items can have "gradient" sprites which correspond to position on the map.
     * 2. Items can have "hangable" sprites corresponding to the properties of an underlying wall.
     * 3. Items can have "animation" sprites. We discard animations.
     * @param itemId the item ID.
     * @param posx the position X component of the item.
     * @param posy the position Y component of the item.
     * @param posz the position Z component of the item.
     * @param hasVertical whether or not the tile has a vertical wall on it.
     * @param hasHorizontal whether or not the tile has a horizontal wall on it.
     */
    OdysseyMapRenderer.prototype.getSpriteID = function (itemId, posx, posy, posz, hasVertical, hasHorizontal) {
        var item = this.Dat.getItem(itemId), max;
        // Animated sprites: divide by item.a
        max = item.spr.length;
        if (item.hasOwnProperty(18)) {
            if (hasHorizontal) {
                // TODO refactor - change behavior so the
                // return value below is valid
                return item.spr[1 % item.x];
            }
            if (hasVertical) {
                // TODO refactor - change behavior so the
                // return value below is valid
                return item.spr[2 % item.x];
            }
        }
        if (item.a) {
            max = max / item.a;
        }
        return item.spr[(((posy % item.y) * item.x) + (posx % item.x)) % max];
    };

    /**
     * Parses the text of a map file.
     * @param input the text of the map file to parse.
     */
    OdysseyMapRenderer.prototype.parseMapDataFile = function (input) {
        //var i, len, lines = txt.split("\n"), cLine, ssplit, coords, arr = [], x, y, z, j, jLen, rSplit, iSplit, cItem, cItemArr, tile;
        var parser, results, key, maps = this.maps;
        parser = new MapFileParser();
        results = parser.parse(input);
        key = MapFileParserResult.resolveIndex(MapFile.getFileX(results.BaseX), MapFile.getFileY(results.BaseY), MapFile.getFileZ(results.BaseZ));
        maps[key] = results;
    };

    /**
     * Loads the map file at the given position.
     * @param mapX the map file's base X component. Use MapFile.getFileX to get this value.
     * @param mapY the map file's base X component. Use MapFile.getFileY to get this value.
     * @param mapZ the map file's base X component. Use MapFile.getFileZ to get this value.
     */
    OdysseyMapRenderer.prototype.loadMapFile = function (mapX, mapY, mapZ) {
        var ctx = this, index, id, resource;
        index = MapFileParserResult.resolveIndex(mapX, mapY, mapZ) + ".json";
        id = this.mapFileManager.getResourceIDByFilename(index);
        resource = this.mapFileManager.getResource(id);
        if (!resource.isLoading()) {
            resource.addEventListener('load', function () {
                ctx.parseMapDataFile(resource.getResourceContents());
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
    OdysseyMapRenderer.prototype.getMap = function (x, y, z) {
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
    OdysseyMapRenderer.prototype.getTileItems = function (x, y, z) {
        var map = this.getMap(x, y, z), tile;

        if (!map) {
            return null;
        }

        tile = map.Map[((x - map.BaseX) << 4) + (y - map.BaseY)];

        if (!tile) {
            return null;
        }

        return tile.Items || null;
    };

    /**
     * Gets the sprite file index containing the sprite ID.
     * @param sprID the ID of the sprite to search for.
     * @returns the index of the spritesheet containing the sprite, or -1 if not found.
     */
    OdysseyMapRenderer.prototype.getSpriteFileID = function (sprID) {
        var spritesheets = this.spritesheets, i, len = spritesheets.length, sheet;
        // Iterate across all spritesheets until we find one within our range.
        for (i = 0; i < len; i += 1) {
            sheet = spritesheets[i];
            if (sheet.from <= sprID && sprID <= sheet.to) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Gets the sprite file containing a sprite.
     * @param sprID the ID of the sprite to search for.
     * @returns the spritesheet containing the sprite.
     */
    OdysseyMapRenderer.prototype.getSpriteFileContaining = function (sprID) {
        return this.spritesheets[this.getSpriteFileID(sprID)];
    };

    /**
     * Gets the sprite's offset X component.
     * @param sprID the ID of the sprite.
     * @returns the sprite's offset X component.
     */
    OdysseyMapRenderer.prototype.getSpriteOffsetX = function (sprID) {
        var sheet = this.getSpriteFileContaining(sprID),
            // We don't need the height.
            //h = (1 + sheet.size & 1),
            w = (1 + ((sheet.size >> 1) & 1)),
            offset = sprID - sheet.from,
            posX = ((offset % (24 / w))) * w;
        return posX;
    };

    /**
     * Gets the sprite's offset Y component.
     * @param sprID the ID of the sprite.
     * @returns the sprite's offset Y component.
     */
    OdysseyMapRenderer.prototype.getSpriteOffsetY = function (sprID) {
        var sheet = this.getSpriteFileContaining(sprID),
            h = (1 + (sheet.size & 1)),
            w = (1 + ((sheet.size >> 1) & 1)),
            offset = sprID - sheet.from,
            posY = (Math.floor(offset / (24 / w))) * h;
        return posY;
    };

    /**
     * Gets the sprite's size X component.
     * @param sprID the ID of the sprite.
     * @returns the sprite's size X component.
     */
    OdysseyMapRenderer.prototype.getSpriteSizeX = function (sprID) {
        var sheet = this.getSpriteFileContaining(sprID);
        return (1 + ((sheet.size >> 1) & 1));
    };

    /**
     * Gets the sprite's size Y component.
     * @param sprID the ID of the sprite.
     * @returns the sprite's size Y component.
     */
    OdysseyMapRenderer.prototype.getSpriteSizeY = function (sprID) {
        var sheet = this.getSpriteFileContaining(sprID);
        return (1 + (sheet.size & 1));
    };

    /**
     * Sets a canvas for rendering.
     * @param name the name of the canvas.
     * @param canvas the DOM canvas element.
     * @coords an array [x, y] as the position relative to the center ([-1, -1] to [+1, +1]).
     */
    OdysseyMapRenderer.prototype.setCanvas = function (name, canvas, coords) {
        this.canvases[name] = canvas;
        this.canvasData[name].x = this.position.x + (coords[0] * this.sizeX);
        this.canvasData[name].y = this.position.y + (coords[1] * this.sizeY);
        this.canvasData[name].z = 0;
    };

    /**
     * Gets the named canvas.
     * @param name the name of the canvas to get.
     * @returns the canvas corresponding to the name.
     */
    OdysseyMapRenderer.prototype.getCanvas = function (z) {
        return this.canvases[z];
    };

    OdysseyMapRenderer.prototype.clear = function () {
        console.log("I am still used!! OdysseyMapRenderer.prototype.clear");
        var cvs, i, len;
        for (i = 0, len = this.canvases.length; i < len; i += 1) {
            cvs = this.canvases[i];
            if (cvs) {
                cvs.getContext("2d").clearRect(0, 0, cvs.width, cvs.height);
            }
        }
    };

    /**
     * Tests if the map is loaded at the given position.
     * @param posx the position X component.
     * @param posy the position Y component.
     * @param posz the position Z component.
     * @returns true if the map is loaded; false otherwise.
     */
    OdysseyMapRenderer.prototype.mapIsLoaded = function (posx, posy, posz) {
        var fposx, fposy, fposz, filename, resourceID;

        // Get the MapFile position components.
        fposx = MapFile.getFileX(posx);
        fposy = MapFile.getFileY(posy);
        fposz = MapFile.getFileZ(posz);

        // Get the filename for the corresponding MapFile position components.
        filename = MapFileParserResult.resolveIndex(fposx, fposy, fposz) + ".json";

        // Get the resource ID for the filename.
        resourceID = this.mapFileManager.getResourceIDByFilename(filename);

        return this.mapFileManager.isLoaded(resourceID);
    };

    /**
     * Tests if a map has failed to load.
     * @param posx the position X component.
     * @param posy the position Y component.
     * @param posz the position Z component.
     * @returns true if the map is loaded; false otherwise.
     */
    OdysseyMapRenderer.prototype.mapHasFailed = function (posx, posy, posz) {
        var fposx, fposy, fposz, filename, resourceID;
        // Get the MapFile position components.
        fposx = MapFile.getFileX(posx);
        fposy = MapFile.getFileY(posy);
        fposz = MapFile.getFileZ(posz);

        // Get the filename for the corresponding MapFile position components.
        filename = MapFileParserResult.resolveIndex(fposx, fposy, fposz) + ".json";

        // Get the resource ID for the filename.
        resourceID = this.mapFileManager.getResourceIDByFilename(filename);

        return this.mapFileManager.hasFailed(resourceID);
    };

    /**
     * Renders a sprite on the canvas.
     * @param sprID the sprite ID.
     * @param x the X component of the map tile's position.
     * @param y the Y component of the map tile's position.
     * @param z the Z component of the map tile's position.
     * @param ox the offset X of the item.
     * @param oy the offset Y of the item.
     * @param height the height of the tile beneath the item.
     * @returns true if the render was successful; false otherwise.
     */
    OdysseyMapRenderer.prototype.renderSprite = function (sprID, x, y, z, ox, oy, height) {
        var spritesheet, spriteOffsetX, spriteOffsetY, spriteSizeX, spriteSizeY, offsetX, offsetY, cvs;

        spritesheet = this.getSpriteFileID(sprID);
        if (!this.spriteFileManager.isLoaded(spritesheet)) {
            this.spriteFileManager.load(spritesheet);
            return false;
        }

        try {
            cvs = this.getCanvasSection(x, y);
            if (cvs) {
                spriteOffsetX = this.getSpriteOffsetX(sprID);
                spriteOffsetY = this.getSpriteOffsetY(sprID);
                spriteSizeX = this.getSpriteSizeX(sprID);
                spriteSizeY = this.getSpriteSizeY(sprID);
                offsetX = (x % this.sizeX) + 1;
                offsetY = (y % this.sizeY) + 1;
                cvs.getContext("2d").drawImage(
                    this.spriteFileManager.getResourceImage(spritesheet),
                    spriteOffsetX * 32,
                    spriteOffsetY * 32,
                    spriteSizeX * 32,
                    spriteSizeY * 32,
                    ((offsetX - (spriteSizeX - 1)) * 32) - (height + ox),
                    ((offsetY - (spriteSizeY - 1)) * 32) - (height + oy),
                    spriteSizeX * 32,
                    spriteSizeY * 32
                );
            }
            return true;
        } catch (err) {
            return false;
        }
    };

    /**
     * Renders an item on the canvas.
     * @param itemID the ID of the item to draw.
     * @param x the X component of the map tile's position.
     * @param y the Y component of the map tile's position.
     * @param z the Z component of the map tile's position.
     * @param ox the offset X of the item.
     * @param oy the offset Y of the item.
     * @param height the height of the tile beneath the item.
     * @param hasVertical whether or not the tile has a vertical wall beneath it.
     * @param hasHorizontal whether or not the tile has a horizontal wall beneath it.
     * @returns true if the render was successful; false otherwise.
     */
    OdysseyMapRenderer.prototype.renderItem = function (itemID, x, y, z, ox, oy, height, hasVertical, hasHorizontal) {
        var sprID = this.getSpriteID(itemID, x, y, z, hasVertical, hasHorizontal),
            success = true;
        if (!this.renderSprite(sprID, x, y, z, ox, oy, height)) {
            success = false;
        }
        return success;
    };

    /**
     * Renders a tile.
     * @param x the map position X component.
     * @param y the map position Y component.
     * @param z the map position Z component.
     * @returns true if the whole tile was rendered; false otherwise.
     */
    OdysseyMapRenderer.prototype.renderTile = function (x, y, z) {
        var items = this.getTileItems(x, y, z),
            i,
            len,
            itemID,
            height = 0,
            hasVertical = false,
            hasHorizontal = false,
            offsetX,
            offsetY,
            item,
            success = true;
        if (items === null) {
            if (!this.mapIsLoaded(x, y, z) && !this.mapHasFailed(x, y, z)) {
                // The render failed because the map is not loaded.

                // Start loading the map.
                this.loadMapFile(
                    MapFile.getFileX(x),
                    MapFile.getFileY(y),
                    MapFile.getFileZ(z)
                );
                return false;
            }
            // The render didn't fail, it just isn't possible
            // because no items exist at these coordinates.
            return true;
        }
        len = items.length;
        for (i = 0; i < len; i += 1) {
            itemID = items[i].ID;
            item = this.Dat.getItem(itemID);
            offsetX = item.hasOwnProperty(25) ? (item[25][0] || 0) : 0;
            offsetY = item.hasOwnProperty(25) ? (item[25][1] || 0) : 0;
            if (!this.renderItem(itemID, x, y, z, offsetX, offsetY, height, hasVertical, hasHorizontal)) {
                success = false;
            }

            // We need to record the total height of all
            // items on the stack.
            if (item.hasOwnProperty(26)) {
                height += item[26][0];
            }

            // We need to remember if there are horizontal
            // or vertical items on the stack, so that
            // hangable items are displayed with the correct
            // orientation.
            if (item.hasOwnProperty(19)) {
                hasHorizontal = true;
            }
            if (item.hasOwnProperty(20)) {
                hasVertical = true;
            }
        }
        return success;
    };

    /**
     * Refreshes the whole viewport. This is used when the sprites are known to be loaded.
     * @returns true if the refresh was successful; false otherwise.
     */
    OdysseyMapRenderer.prototype.refresh = function () {
        var x, xs, xe, y, ys, ye, z, zs, ze, currentMapPosition = this.position, success = true;

        // Set the range of position values to render.

        //xs = (currentMapPosition.x - this.origin.x);
        xs = (currentMapPosition.x - (currentMapPosition.x % this.sizeX)) - this.sizeX;
        //xe = (currentMapPosition.x + this.origin.x);
        xe = (currentMapPosition.x - (currentMapPosition.x % this.sizeX)) + 2 * this.sizeX - 1;

        //ys = (currentMapPosition.y - this.origin.y);
        ys = (currentMapPosition.y - (currentMapPosition.y % this.sizeY)) - this.sizeY;
        //ye = (currentMapPosition.y + this.origin.y);
        ye = (currentMapPosition.y - (currentMapPosition.y % this.sizeY)) + 2 * this.sizeY - 1;

        // Our map doesn't support multi-level rendering just yet.
        zs = currentMapPosition.z;
        ze = currentMapPosition.z;

        // Clear the list of failed tiles.
        this.clearRenderFailed();

        // Ensure the maps are loaded.
        if (!this.mapsLoadedInRange(xs, ys, zs, xe, ye, ze)) {
            this.loadMaps(xs, ys, zs, xe, ye, ze);
        }
        for (x = xs; x <= xe; x += 1) {
            for (y = ys; y <= ye; y += 1) {
                for (z = zs; z <= ze; z += 1) {
                    if (!this.renderTile(x, y, z)) {
                        // If the map was loaded, this tile does not exist.
                        if (!this.mapIsLoaded(x, y, z)) {
                            // This tile was not correctly rendered.
                            // Try again later (after resources are loaded).
                            this.setRenderFailed(x, y, z);

                            // Full render was not successful because
                            // the tile failed to load.
                            success = false;
                        }
                    }
                }
            }
        }
        return success;
    };

    /**
     * Handles rendering the viewport. It will use CSS properties to avoid
     * re-rendering if possible, such as if the outside canvases have the
     * tiles pre-rendered. If rendering to the canvas is necessary, tiles
     * will be selectively rendered to the canvas.
     * @returns true if rendering was successful; false otherwise.
     */
    OdysseyMapRenderer.prototype.render = function () {
        // We cannot proceed until we've loaded the dat file
        if (!this.Dat.isLoaded) {
            console.assert(this.Dat.isLoading, "Script must initialize before rendering.");
            return false;
        }
        if (this.translate()) {
            this.awaitingRefresh = true;
        }

        if (this.renderSelective()) {
            // Selective rendering successful.
            // Perform a refresh to resolve issues with 64x64 sprites.
            if (this.awaitingRefresh) {
                return this.refresh();
            }
            return true;
        }

        return false;
    };

    /**
     * Selectively renders tiles that have failed to render
     * in previous rendering attempts.
     * @returns false if rendering failed or if there was nothing to render.
     */
    OdysseyMapRenderer.prototype.renderSelective = function () {
        var arr = this.failedRenderedTiles, pos, i;
        if (arr.length === 0) {
            // Nothing to render, so we are done.
            return false;
        }

        for (i = arr.length - 1; i > 0; i -= 1) {
            pos = arr[i];
            if (!this.renderTile(pos.x, pos.y, pos.z)) {
                // We failed again. We can't reliably remove
                // array indices if we continue. Break and remove
                // what we can.
                break;
            }
        }
        arr.length = i;

        if (i === 0) {
            // We have finished rendering all objects, perform
            // a full render so that we can resolve any issues
            // with 64px display.
            return true;
        }
        return false;
    };

    /**
     * Adds a tile to the list of tiles that failed to render,
     * allowing for the selective rendering of failed tiles.
     * @param x the map position X component.
     * @param y the map position Y component.
     * @param z the map position Z component.
     */
    OdysseyMapRenderer.prototype.setRenderFailed = function (x, y, z) {
        this.failedRenderedTiles.push(new Matrix3D(x, y, z));
    };

    /**
     * Clears the list of tiles that failed to render.
     * Calling this method will result in selective rendering
     * to pause until tiles are added.
     */
    OdysseyMapRenderer.prototype.clearRenderFailed = function () {
        this.failedRenderedTiles.splice(0);
    };

    // TEMPORARY.
    OdysseyMapRenderer.prototype.updateCanvasClasses = function () {
        this.canvases.northwest.setAttribute('id', 'OdysseyMapCanvas-NW');
        this.canvases.north.setAttribute('id', 'OdysseyMapCanvas-N');
        this.canvases.northeast.setAttribute('id', 'OdysseyMapCanvas-NE');
        this.canvases.west.setAttribute('id', 'OdysseyMapCanvas-W');
        this.canvases.pivot.setAttribute('id', 'OdysseyMapCanvas-P');
        this.canvases.east.setAttribute('id', 'OdysseyMapCanvas-E');
        this.canvases.southwest.setAttribute('id', 'OdysseyMapCanvas-SW');
        this.canvases.south.setAttribute('id', 'OdysseyMapCanvas-S');
        this.canvases.southeast.setAttribute('id', 'OdysseyMapCanvas-SE');
    };
    /**
     * Translates a series of canvases so that we don't need to repaint the whole canvas.
     * We will use 9 canvases: NW, N, NE, W, P, E, SW, S, SE.
     * These canvases will have widths equal to the viewport.
     * The canvases will be translated using CSS when the user moves position.
     * If the user moves out of the bounds of the three canvases, the viewport won't shift.
     */
    OdysseyMapRenderer.prototype.translate = function () {
        var pos = this.position,
            cd = this.canvasData,
            cr = this.canvases,
            dx,
            dy,
            ox,
            oy,
            oz,
            sx = this.sizeX,
            sy = this.sizeY,
            inRange = false,
            sgn,
            x,
            y,
            tmpCvs,
            tmpCvsData,
            swapped = false,
            reRenderTiles = [],
            rrX,
            rrY,
            viewport,
            i;

        ox = (pos.x - cd.pivot.x);
        oy = (pos.y - cd.pivot.y);
        oz = (pos.z - cd.pivot.z);
        dx = Math.floor(ox / sx);
        dy = Math.floor(oy / sy);

        inRange = (-2 <= dx && dx <= 2) || (-2 <= dy && dy <= 2);
        swapped = inRange && (dx !== 0 || dy !== 0);

        if (inRange) {
            // In range, the current canvases are relevant.
            // We may be swapping canvases.
            sgn = (dx < 0 ? -1 : +1);
            for (x = dx; x; x -= sgn) {
                // Shift the canvases.
                if (sgn === -1) {
                    // Moved west.

                    // Column: middle
                    tmpCvs = cr.east;
                    tmpCvsData = cd.east;

                    cr.east = cr.pivot;
                    cd.east = cd.pivot;

                    cr.pivot = cr.west;
                    cd.pivot = cd.west;

                    cr.west = tmpCvs;
                    cd.west = tmpCvsData;
                    cd.west.x = cd.pivot.x - sx;
                    cd.west.y = cd.pivot.y;
                    tmpCvs.getContext('2d').clearRect(0, 0, 32 * (sx + 1), 32 * (sy + 1));

                    // Column: top
                    tmpCvs = cr.northeast;
                    tmpCvsData = cd.northeast;

                    cr.northeast = cr.north;
                    cd.northeast = cd.north;

                    cr.north = cr.northwest;
                    cd.north = cd.northwest;

                    cr.northwest = tmpCvs;
                    cd.northwest = tmpCvsData;
                    cd.northwest.x = cd.pivot.x - sx;
                    cd.northwest.y = cd.pivot.y - sy;
                    tmpCvs.getContext('2d').clearRect(0, 0, 32 * (sx + 1), 32 * (sy + 1));

                    // Column: bottom
                    tmpCvs = cr.southeast;
                    tmpCvsData = cd.southeast;

                    cr.southeast = cr.south;
                    cd.southeast = cd.south;

                    cr.south = cr.southwest;
                    cd.south = cd.southwest;

                    cr.southwest = tmpCvs;
                    cd.southwest = tmpCvsData;
                    cd.southwest.x = cd.pivot.x - sx;
                    cd.southwest.y = cd.pivot.y + sy;
                    tmpCvs.getContext('2d').clearRect(0, 0, 32 * (sx + 1), 32 * (sy + 1));

                    for (rrX = 0; rrX < sx; rrX += 1) {
                        for (rrY = 0; rrY < (3 * sy); rrY += 1) {
                            reRenderTiles.push({
                                x: cd.pivot.x + (sx * dx) + rrX,
                                y: cd.pivot.y - sy + rrY,
                                z: pos.z
                            });
                        }
                    }

                } else {
                    // Moved east.

                    // Column: middle
                    tmpCvs = cr.west;
                    tmpCvsData = cd.west;

                    cr.west = cr.pivot;
                    cd.west = cd.pivot;

                    cr.pivot = cr.east;
                    cd.pivot = cd.east;

                    cr.east = tmpCvs;
                    cd.east = tmpCvsData;
                    cd.east.x = cd.pivot.x + sx;
                    cd.east.y = cd.pivot.y;
                    tmpCvs.getContext('2d').clearRect(0, 0, 32 * (sx + 1), 32 * (sy + 1));

                    // Column: top
                    tmpCvs = cr.northwest;
                    tmpCvsData = cd.northwest;

                    cr.northwest = cr.north;
                    cd.northwest = cd.north;

                    cr.north = cr.northeast;
                    cd.north = cd.northeast;

                    cr.northeast = tmpCvs;
                    cd.northeast = tmpCvsData;
                    cd.northeast.x = cd.pivot.x + sx;
                    cd.northeast.y = cd.pivot.y - sy;
                    tmpCvs.getContext('2d').clearRect(0, 0, 32 * (sx + 1), 32 * (sy + 1));

                    // Column: bottom
                    tmpCvs = cr.southwest;
                    tmpCvsData = cd.southwest;

                    cr.southwest = cr.south;
                    cd.southwest = cd.south;

                    cr.south = cr.southeast;
                    cd.south = cd.southeast;

                    cr.southeast = tmpCvs;
                    cd.southeast = tmpCvsData;
                    cd.southeast.x = cd.pivot.x + sx;
                    cd.southeast.y = cd.pivot.y + sy;
                    tmpCvs.getContext('2d').clearRect(0, 0, 32 * (sx + 1), 32 * (sy + 1));

                    // Re-render: NW, W, SW.
                    for (rrX = 0; rrX < sx; rrX += 1) {
                        for (rrY = 0; rrY < (3 * sy); rrY += 1) {
                            reRenderTiles.push({
                                x: cd.pivot.x + (sx * dx) + rrX,
                                y: cd.pivot.y - sy + rrY,
                                z: pos.z
                            });
                        }
                    }

                }
            }

            sgn = (dy < 0 ? -1 : +1);
            for (y = dy; y; y -= sgn) {
                // Shift the canvases.
                if (sgn === -1) {
                    // Moved north.

                    // Column: middle
                    tmpCvs = cr.south;
                    tmpCvsData = cd.south;

                    cr.south = cr.pivot;
                    cd.south = cd.pivot;

                    cr.pivot = cr.north;
                    cd.pivot = cd.north;

                    cr.north = tmpCvs;
                    cd.north = tmpCvsData;
                    cd.north.x = cd.pivot.x;
                    cd.north.y = cd.pivot.y - sy;
                    tmpCvs.getContext('2d').clearRect(0, 0, 32 * (sx + 1), 32 * (sy + 1));

                    // Column: left
                    tmpCvs = cr.southwest;
                    tmpCvsData = cd.southwest;

                    cr.southwest = cr.west;
                    cd.southwest = cd.west;

                    cr.west = cr.northwest;
                    cd.west = cd.northwest;

                    cr.northwest = tmpCvs;
                    cd.northwest = tmpCvsData;
                    cd.northwest.x = cd.pivot.x - sx;
                    cd.northwest.y = cd.pivot.y - sy;
                    tmpCvs.getContext('2d').clearRect(0, 0, 32 * (sx + 1), 32 * (sy + 1));

                    // Column: right
                    tmpCvs = cr.southeast;
                    tmpCvsData = cd.southeast;

                    cr.southeast = cr.east;
                    cd.southeast = cd.east;

                    cr.east = cr.northeast;
                    cd.east = cd.northeast;

                    cr.northeast = tmpCvs;
                    cd.northeast = tmpCvsData;
                    cd.northeast.x = cd.pivot.x + sx;
                    cd.northeast.y = cd.pivot.y - sy;
                    tmpCvs.getContext('2d').clearRect(0, 0, 32 * (sx + 1), 32 * (sy + 1));

                    // Re-render: SW, S, SE.
                    for (rrX = 0; rrX < (3 * sx); rrX += 1) {
                        for (rrY = 0; rrY < sy; rrY += 1) {
                            reRenderTiles.push({
                                x: cd.pivot.x - sx + rrX,
                                y: cd.pivot.y + (dy * sy) + rrY,
                                z: pos.z
                            });
                        }
                    }

                } else {
                    // Moved south.

                    // Column: middle
                    tmpCvs = cr.north;
                    tmpCvsData = cd.north;

                    cr.north = cr.pivot;
                    cd.north = cd.pivot;

                    cr.pivot = cr.south;
                    cd.pivot = cd.south;

                    cr.south = tmpCvs;
                    cd.south = tmpCvsData;
                    cd.south.x = cd.pivot.x;
                    cd.south.y = cd.pivot.y + sy;
                    tmpCvs.getContext('2d').clearRect(0, 0, 32 * (sx + 1), 32 * (sy + 1));

                    // Column: left
                    tmpCvs = cr.northwest;
                    tmpCvsData = cd.northwest;

                    cr.northwest = cr.west;
                    cd.northwest = cd.west;

                    cr.west = cr.southwest;
                    cd.west = cd.southwest;

                    cr.southwest = tmpCvs;
                    cd.southwest = tmpCvsData;
                    cd.southwest.x = cd.pivot.x - sx;
                    cd.southwest.y = cd.pivot.y + sy;
                    tmpCvs.getContext('2d').clearRect(0, 0, 32 * (sx + 1), 32 * (sy + 1));

                    // Column: right
                    tmpCvs = cr.northeast;
                    tmpCvsData = cd.northeast;

                    cr.northeast = cr.east;
                    cd.northeast = cd.east;

                    cr.east = cr.southeast;
                    cd.east = cd.southeast;

                    cr.southeast = tmpCvs;
                    cd.southeast = tmpCvsData;
                    cd.southeast.x = cd.pivot.x + sx;
                    cd.southeast.y = cd.pivot.y + sy;
                    tmpCvs.getContext('2d').clearRect(0, 0, 32 * (sx + 1), 32 * (sy + 1));

                    // Re-render: NW, N, NE.
                    for (rrX = 0; rrX < (3 * sx); rrX += 1) {
                        for (rrY = 0; rrY < sy; rrY += 1) {
                            reRenderTiles.push({
                                x: cd.pivot.x - sx + rrX,
                                y: cd.pivot.y + (dy * sy) + rrY,
                                z: pos.z
                            });
                        }
                    }

                }
            }

        } else {
            // Not in range, we need to clear
            // the canvases and update their data.
            cd.pivot.x = pos.x - (pos.x % sx);
            cd.pivot.y = pos.y - (pos.y % sy);

            cd.west.x = cd.pivot.x - sx;
            cd.west.y = cd.pivot.y;

            cd.east.x = cd.pivot.x + sx;
            cd.east.y = cd.pivot.y;

            cd.north.x = cd.pivot.x;
            cd.north.y = cd.pivot.y - sy;

            cd.south.x = cd.pivot.x;
            cd.south.y = cd.pivot.y + sy;

            cd.northwest.x = cd.pivot.x - sx;
            cd.northwest.y = cd.pivot.y - sy;

            cd.northeast.x = cd.pivot.x + sx;
            cd.northeast.y = cd.pivot.y - sy;

            cd.southwest.x = cd.pivot.x - sx;
            cd.southwest.y = cd.pivot.y + sy;

            cd.southeast.x = cd.pivot.x + sx;
            cd.southeast.y = cd.pivot.y + sy;

            // Clear all canvas sections.
            cr.northwest.getContext('2d').clearRect(0, 0, (32 * (sx + 1)), (32 * (sy + 1)));
            cr.north.getContext('2d').clearRect(0, 0, (32 * (sx + 1)), (32 * (sy + 1)));
            cr.northeast.getContext('2d').clearRect(0, 0, (32 * (sx + 1)), (32 * (sy + 1)));
            cr.west.getContext('2d').clearRect(0, 0, (32 * (sx + 1)), (32 * (sy + 1)));
            cr.pivot.getContext('2d').clearRect(0, 0, (32 * (sx + 1)), (32 * (sy + 1)));
            cr.east.getContext('2d').clearRect(0, 0, (32 * (sx + 1)), (32 * (sy + 1)));
            cr.southwest.getContext('2d').clearRect(0, 0, (32 * (sx + 1)), (32 * (sy + 1)));
            cr.south.getContext('2d').clearRect(0, 0, (32 * (sx + 1)), (32 * (sy + 1)));
            cr.southeast.getContext('2d').clearRect(0, 0, (32 * (sx + 1)), (32 * (sy + 1)));

            // Re-render: ALL. (NW-NE, SW-SE).
            for (rrX = 0; rrX < (3 * sx); rrX += 1) {
                for (rrY = 0; rrY < (3 * sy); rrY += 1) {
                    reRenderTiles.push({
                        x: cd.pivot.x - sx + rrX,
                        y: cd.pivot.y - sy + rrY,
                        z: pos.z
                    });
                }
            }
        }

        viewport = document.getElementById("map-viewport-translator");
        viewport.style.transform = "translate(" + (32 * ((cd.pivot.x + ((sx - 1) / 2)) - pos.x)) + "px, " + (32 * ((cd.pivot.y + ((sy - 1) / 2)) - pos.y)) + "px)";
        this.updateCanvasClasses();

        if (!inRange || reRenderTiles.length) {
            for (i = 0; i < reRenderTiles.length; i += 1) {
                this.setRenderFailed(reRenderTiles[i].x, reRenderTiles[i].y, reRenderTiles[i].z);
            }
            // There are tiles to update.
            return true;
        }
        // There is nothing to update.
        return false;
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
    OdysseyMapRenderer.prototype.loadMaps = function (xs, ys, zs, xe, ye, ze) {
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
                    resourceID = this.mapFileManager.getResourceIDByFilename(filename);
                    if (!this.mapFileManager.isLoaded(resourceID)) {
                        this.loadMapFile(x, y, z);
                        return false;
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
    OdysseyMapRenderer.prototype.mapsLoadedInRange = function (xs, ys, zs, xe, ye, ze) {
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
                    resourceID = this.mapFileManager.getResourceIDByFilename(filename);
                    if (!this.mapFileManager.isLoaded(resourceID)) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    return OdysseyMapRenderer;
}(jQuery));