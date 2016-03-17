/*jslint browser: true, bitwise: true */
/*global requestAnimationFrame, console, Matrix3D, OdysseyCanvasSection, MapFile, MapFileParser, MapFileParserResult, jQuery, OdysseyMapRenderCompleteEvent, OdysseyMapZoomChangedEvent, OdysseyMapPositionChangedEvent, OdysseyEventDispatcher, OdysseyMapFileLoadedEvent, OdysseyEventDispatchInterface*/
var OdysseyTileMap = (function ($) {
    "use strict";
    // Helper functions.
    function proxy(fn, ctx, args) {
        return function () {
            fn.apply(ctx, args);
        };
    }

    /**
     * Creates a new OdysseyTileMap. Used to render the game world.
     * @constructor
     */
    function OdysseyTileMap() {
        /**
         * The event dispatcher. Manages Odyssey events.
         */
        this.eventDispatcher = new OdysseyEventDispatcher();

        /**
         * The parent view.
         */
        this.view = null;

        /**
         * The current map position. This value should never
         * be overwritten.
         */
        this.position = new Matrix3D(0, 0, 0);

        /**
         * The currently rendered map position. This is used to
         * determine if the canvases need to be swapped.
         */
        this.renderedPosition = new Matrix3D(0, 0, 0);

        /**
         * The current map zoom. This value should
         * never be overwritten.
         */
        this.zoom = 1;

        /**
         * The position of the origin on the canvas.
         */
        this.origin = new Matrix3D(18, 10, 0);

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
         * The canvases to draw sprites on.
         */
        this.canvases = [];

        /**
         * The overlay canvases. We use this to render shapes on top of the map.
         * These overlay canvases are also used as control events, i.e. click events
         * may be bound to these canvases.
         */
        this.overlayCanvases = [];
    }
    /** @const */
    OdysseyTileMap.CANVAS_NORTHWEST_ID = 0;
    /** @const */
    OdysseyTileMap.CANVAS_WEST_ID = 1;
    /** @const */
    OdysseyTileMap.CANVAS_SOUTHWEST_ID = 2;
    /** @const */
    OdysseyTileMap.CANVAS_NORTH_ID = 3;
    /** @const */
    OdysseyTileMap.CANVAS_PIVOT_ID = 4;
    /** @const */
    OdysseyTileMap.CANVAS_SOUTH_ID = 5;
    /** @const */
    OdysseyTileMap.CANVAS_NORTHEAST_ID = 6;
    /** @const */
    OdysseyTileMap.CANVAS_EAST_ID = 7;
    /** @const */
    OdysseyTileMap.CANVAS_SOUTHEAST_ID = 8;

    /** The width (x) of a map file. @const */
    OdysseyTileMap.MAPFILE_SIZE_X = 256;
    /** The height (y) of a map file. @const */
    OdysseyTileMap.MAPFILE_SIZE_Y = 256;
    /** The depth (z) of a map file. @const */
    OdysseyTileMap.MAPFILE_SIZE_Z = 1;

    /**
     * Proxy method for stop updating a tile map. this method returns a function
     * that can safely be passed as event listeners with a custom context.
     * @param {OdysseyView} instance the view to stop updating.
     */
    OdysseyTileMap.stopUpdateProxy = function (instance) {
        return function () {
            instance.stopRepeatRendering();
        };
    };

    OdysseyTileMap.prototype = new OdysseyEventDispatchInterface();

    /**
     * Sets the view. OdysseyTileMap needs a reference to the parent view.
     * @param {OdysseyView} view the parent view.
     */
    OdysseyTileMap.prototype.setView = function (view) {
        this.view = view;
    };
    /**
     * Sentinel value determining if rendering should continue,
     * i.e. if the rendering has already completed.
     */
    OdysseyTileMap.prototype.hasFullyRendered = false;

    /**
     * Repeats the rendering process until the map has been fully rendered.
     */
    OdysseyTileMap.prototype.repeatRendering = function () {
        // The dat file must be loaded first.
        if (this.view.getModel().getDat().isLoaded) {
            this.render();
        }
        // Check if the canvases have been fully rendered.
        // Use the OdysseyMapRenderComplete event to set this.
        if (!this.hasFullyRendered) {
            // Give the client a chance to load resources and repeat this process.
            requestAnimationFrame(proxy(this.repeatRendering, this, null));
        }
    };

    /**
     * Adjusts the canvases for changes in zoom level.
     * @param e the Zoom event.
     */
    OdysseyTileMap.prototype.adjustForZoomChange = function (e) {
        var zoom = e.zoom,
            newHeightWidth = Math.ceil(23 / zoom),
            canvases = this.canvases,
            canvas;
        // Adjust canvas sizes.
        for (canvas in canvases) {
            if (canvases.hasOwnProperty(canvas)) {
                canvases[canvas].height = 32 * (newHeightWidth + 1);
                canvases[canvas].width = 32 * (newHeightWidth + 1);
            }
        }
        this.setSize(newHeightWidth, newHeightWidth);
    };

    /**
     * Instructs the continuous rendering method to stop.
     * This is called when rendering is complete.
     */
    OdysseyTileMap.prototype.stopRepeatRendering = function () {
        this.hasFullyRendered = true;
    };

    /**
     * Whether or not the renderer is awaiting a full refresh.
     * This value is used by the render method to determine if a
     * full refresh is to be performed after all sprites have loaded.
     */
    OdysseyTileMap.prototype.awaitingRefresh = false;

    /**
     * Handles updating the tile map display.
     * @param model the model to use for updating.
     */
    OdysseyTileMap.prototype.update = function () {
        this.repeatRendering();
    };

    /**
     * Sets the Odyssey viewport.
     * @param element the DOM element to use as a viewport.
     */
    OdysseyTileMap.prototype.setViewport = function (element) {
        this.viewport = element;
    };

    /**
     * Sets the current map position. This method should be used
     * instead of position.set(x, y, z) because it registers an event
     * for listeners.
     * @param x the new x-coordinate.
     * @param y the new y-coordinate.
     * @param z the new z-coordinate.
     */
    OdysseyTileMap.prototype.setPosition = function (x, y, z) {
        this.position.set(x, y, z);
        this.dispatchEvent(new OdysseyMapPositionChangedEvent(this, this.position));
    };

    /**
     * Gets the map position.
     * @returns the map position.
     */
    OdysseyTileMap.prototype.getPosition = function () {
        return this.position;
    };

    /**
     * Sets the current map zoom state. This method should be used
     * instead of zoom.set(zoom) because it registers an event for
     * listeners.
     * @param zoom the new zoom state.
     */
    OdysseyTileMap.prototype.setZoom = function (zoom) {
        this.zoom.set(zoom);
        this.dispatchEvent(new OdysseyMapZoomChangedEvent(this, this.zoom));
    };

    /**
     * Sets the size of the display. The canvases should have
     * sizes corresponding to 32 times the size of the
     * OdysseyTileMap, plus 32x32 to resolve clipping for 64x64px
     * sprites.
     * @param sx the amount of tiles in the X direction on the viewport and each canvas.
     * @param sy the amount of tiles in the Y direction on the viewport and each canvas.
     */
    OdysseyTileMap.prototype.setSize = function (sx, sy) {
        this.sizeX = sx;
        this.sizeY = sy;
    };

    /**
     * Calculates the canvas section index based on the map position.
     * @param posX a map position X component.
     * @param posY a map position Y component.
     * @returns the canvas index that should contain (posX, posY).
     */
    OdysseyTileMap.prototype.getCanvasSectionIndex = function (posX, posY) {
        var dxu = (Math.floor(((posX - (posX % this.sizeX)) - (this.position.x - (this.position.x % this.sizeX))) / this.sizeX)),
            dyu = (Math.floor(((posY - (posY % this.sizeY)) - (this.position.y - (this.position.y % this.sizeY))) / this.sizeY)),
            id = (3 * (1 + dxu) + (1 + dyu));
        // The ID is only valid if (dxu, dyu) are both in range -1 <= x <= +1.
        if ((-1 <= dxu && dxu <= 1) && (-1 <= dyu && dyu <= 1)) {
            return id;
        }
        return -1;
    };

    /**
     * Gets the canvas section corresponding to the input position components.
     * @param posx the position X component of the canvas section.
     * @param posy the position Y component of the canvas section.
     */
    OdysseyTileMap.prototype.getCanvasSection = function (posx, posy) {
        var index = this.getCanvasSectionIndex(posx, posy);
        // Make sure this canvas exists.
        if (index === -1) {
            console.log("Could not find canvas for " + posx + ", " + posy);
            return null;
        }
        return this.canvases[index];
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
    OdysseyTileMap.prototype.getSpriteID = function (itemId, posx, posy, posz, hasVertical, hasHorizontal) {
        var item = this.view.getModel().getDat().getItem(itemId), max;
        // Animated sprites: divide by item.a
        max = item.spr.length;
        if (item.hasOwnProperty(18)) {
            // Hangable items do not correspond to position gradients.
            posx = posy = 0;
            if (hasHorizontal) {
                posx = 1;
            } else if (hasVertical) {
                posx = 2;
            }
        }
        if (item.a) {
            max = max / item.a;
        }
        return item.spr[(((posy % item.y) * item.x) + (posx % item.x)) % max];
    };

    /**
     * Gets the sprite file index containing the sprite ID.
     * @param sprID the ID of the sprite to search for.
     * @returns the index of the spritesheet containing the sprite, or -1 if not found.
     */
    OdysseyTileMap.prototype.getSpriteFileID = function (sprID) {
        var spritesheets = this.view.getSpriteIndex().data, i, len = spritesheets.length, sheet;
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
    OdysseyTileMap.prototype.getSpriteFileContaining = function (sprID) {
        var spritesheets = this.view.getSpriteIndex().data;
        return spritesheets[this.getSpriteFileID(sprID)];
    };

    /**
     * Gets the sprite's offset X component.
     * @param sprID the ID of the sprite.
     * @returns the sprite's offset X component.
     */
    OdysseyTileMap.prototype.getSpriteOffsetX = function (sprID) {
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
    OdysseyTileMap.prototype.getSpriteOffsetY = function (sprID) {
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
    OdysseyTileMap.prototype.getSpriteSizeX = function (sprID) {
        var sheet = this.getSpriteFileContaining(sprID);
        return (1 + ((sheet.size >> 1) & 1));
    };

    /**
     * Gets the sprite's size Y component.
     * @param sprID the ID of the sprite.
     * @returns the sprite's size Y component.
     */
    OdysseyTileMap.prototype.getSpriteSizeY = function (sprID) {
        var sheet = this.getSpriteFileContaining(sprID);
        return (1 + (sheet.size & 1));
    };

    /**
     * Sets a canvas for rendering the map.
     * @param index the index of the canvas.
     * @param canvas the DOM canvas element.
     */
    OdysseyTileMap.prototype.setCanvas = function (index, canvas) {
        this.canvases[index] = canvas;
    };

    /**
     * Sets a canvas for rendering the overlay.
     * @param index the index of the canvas.
     * @param canvas the DOM canvas element.
     */
    OdysseyTileMap.prototype.setOverlayCanvas = function (index, canvas) {
        this.overlayCanvases[index] = canvas;
    };

    /**
     * Gets the canvas at the specified index.
     * @param index the index of the canvas to get.
     * @returns the canvas corresponding to the name.
     */
    OdysseyTileMap.prototype.getCanvas = function (index) {
        return this.canvases[index];
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
    OdysseyTileMap.prototype.renderSprite = function (sprID, x, y, z, ox, oy, height) {
        var spritesheet, spriteOffsetX, spriteOffsetY, spriteSizeX, spriteSizeY, offsetX, offsetY, cvs;

        spritesheet = this.getSpriteFileID(sprID);
        if (!this.view.getResourceManager().isLoaded(spritesheet)) {
            this.view.getResourceManager().load(spritesheet);
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
                    this.view.getResourceManager().getResourceImage(spritesheet),
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
    OdysseyTileMap.prototype.renderItem = function (itemID, x, y, z, ox, oy, height, hasVertical, hasHorizontal) {
        var sprID = this.getSpriteID(itemID, x, y, z, hasVertical, hasHorizontal),
            success = true;
        if (!this.renderSprite(sprID, x, y, z, ox, oy, height)) {
            success = false;
        }
        return success;
    };

    /**
     * Creates a new array of items, sorted according to the provided Dat context.
     * @param items the array of map items to sort.
     * @param Dat the Dat context to sort according to.
     * @static
     */
    OdysseyTileMap.getRenderOrderByDat = function (items, Dat) {
        var sorted = [];
        // Clone the items array.
        Array.prototype.push.apply(sorted, items);
        // Sort the new array according to the Dat context.
        sorted.sort(function (a, b) {
            var itemA = Dat.getItem(a.ID);
            if (itemA.hasOwnProperty(13)) {
                // Don't swap items if the first is not movable.
                // (Items are in the correct order until we reach movable items.)
                return false;
            }
            // Items are in reversed order if they are movable.
            // So swap in every case.
            return true;
        });
        return sorted;
    };

    /**
     * Renders a tile.
     * @param x the map position X component.
     * @param y the map position Y component.
     * @param z the map position Z component.
     * @returns true if the whole tile was rendered; false otherwise.
     */
    OdysseyTileMap.prototype.renderTile = function (x, y, z) {
        var items = this.view.getModel().getTileItems(x, y, z),
            renderItems,
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
            if (!this.view.getModel().mapIsLoaded(x, y, z) && !this.view.getModel().mapHasFailed(x, y, z)) {
                // The render failed because the map is not loaded.

                // Start loading the map.
                this.view.getModel().loadMapFile(
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
        // Create an array with the items in the correct rendering order.
        // Movable items are rendered in the opposite order after the non-moveable items.
        renderItems = OdysseyTileMap.getRenderOrderByDat(items, this.view.getModel().getDat());
        // Render the items in the correct order.
        for (i = 0, len = renderItems.length; i < len; i += 1) {
            itemID = renderItems[i].ID;
            item = this.view.getModel().getDat().getItem(itemID);
            offsetX = item.hasOwnProperty(25) ? (item[25][0] || 0) : 0;
            offsetY = item.hasOwnProperty(25) ? (item[25][1] || 0) : 0;
            if (!this.renderItem(itemID, x, y, z, offsetX, offsetY, height, hasVertical, hasHorizontal)) {
                success = false;
            }

            // We need to record the total height of all items on the stack.
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
    OdysseyTileMap.prototype.refresh = function () {
        var x, xs, xe, y, ys, ye, z, zs, ze, currentMapPosition = this.position, success = true;

        // Set the range of position values to render.

        xs = (currentMapPosition.x - (currentMapPosition.x % this.sizeX)) - this.sizeX;
        xe = (currentMapPosition.x - (currentMapPosition.x % this.sizeX)) + 2 * this.sizeX - 1;

        ys = (currentMapPosition.y - (currentMapPosition.y % this.sizeY)) - this.sizeY;
        ye = (currentMapPosition.y - (currentMapPosition.y % this.sizeY)) + 2 * this.sizeY - 1;

        // Our map doesn't support multi-level rendering just yet.
        zs = currentMapPosition.z;
        ze = currentMapPosition.z;

        // Clear the list of failed tiles.
        this.clearRenderFailed();

        // Ensure the maps are loaded.
        if (!this.view.getModel().mapsLoadedInRange(xs, ys, zs, xe, ye, ze)) {
            this.view.getModel().loadMaps(xs, ys, zs, xe, ye, ze);
        }
        for (x = xs; x <= xe; x += 1) {
            for (y = ys; y <= ye; y += 1) {
                for (z = zs; z <= ze; z += 1) {
                    if (!this.renderTile(x, y, z)) {
                        // If the map was loaded, this tile does not exist.
                        if (!this.view.getModel().mapIsLoaded(x, y, z)) {
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
    OdysseyTileMap.prototype.render = function () {
        // We cannot proceed until we've loaded the dat file.
        if (!this.view.getModel().getDat().isLoaded) {
            console.assert(this.view.getModel().getDat().isLoading, "Script must initialize before rendering.");
            return false;
        }
        if (this.translate()) {
            this.awaitingRefresh = true;
            this.renderedPosition.set(this.position.x, this.position.y, this.position.z);
        }

        if (this.renderSelective()) {
            // Selective rendering successful.
            // Perform a refresh to resolve issues with 64x64 sprites.
            if (this.awaitingRefresh) {
                if (this.refresh()) {
                    this.dispatchEvent(new OdysseyMapRenderCompleteEvent(), this.stopRepeatRendering);
                    this.renderedPosition.set(this.position.x, this.position.y, this.position.z);
                    return true;
                }
                return false;
            }
            this.renderedPosition.set(this.position.x, this.position.y, this.position.z);
            this.dispatchEvent(new OdysseyMapRenderCompleteEvent(), this.stopRepeatRendering);
            return true;
        }

        return false;
    };

    /**
     * Selectively renders tiles that have failed to render
     * in previous rendering attempts.
     * @returns false if rendering failed or if there was nothing to render.
     */
    OdysseyTileMap.prototype.renderSelective = function () {
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
    OdysseyTileMap.prototype.setRenderFailed = function (x, y, z) {
        this.failedRenderedTiles.push(new Matrix3D(x, y, z));
    };

    /**
     * Clears the list of tiles that failed to render.
     * Calling this method will result in selective rendering
     * to pause until tiles are added.
     */
    OdysseyTileMap.prototype.clearRenderFailed = function () {
        this.failedRenderedTiles.splice(0);
    };

    // TEMPORARY.
    OdysseyTileMap.prototype.updateCanvasIDs = function () {
        this.canvases[OdysseyTileMap.CANVAS_NORTHWEST_ID].setAttribute('id', 'OdysseyMapCanvas-NW');
        this.canvases[OdysseyTileMap.CANVAS_NORTH_ID].setAttribute('id', 'OdysseyMapCanvas-N');
        this.canvases[OdysseyTileMap.CANVAS_NORTHEAST_ID].setAttribute('id', 'OdysseyMapCanvas-NE');
        this.canvases[OdysseyTileMap.CANVAS_WEST_ID].setAttribute('id', 'OdysseyMapCanvas-W');
        this.canvases[OdysseyTileMap.CANVAS_PIVOT_ID].setAttribute('id', 'OdysseyMapCanvas-P');
        this.canvases[OdysseyTileMap.CANVAS_EAST_ID].setAttribute('id', 'OdysseyMapCanvas-E');
        this.canvases[OdysseyTileMap.CANVAS_SOUTHWEST_ID].setAttribute('id', 'OdysseyMapCanvas-SW');
        this.canvases[OdysseyTileMap.CANVAS_SOUTH_ID].setAttribute('id', 'OdysseyMapCanvas-S');
        this.canvases[OdysseyTileMap.CANVAS_SOUTHEAST_ID].setAttribute('id', 'OdysseyMapCanvas-SE');
    };

    /**
     * Translates a series of canvases so that we don't need to repaint the whole canvas.
     * We will use 9 canvases: NW, N, NE, W, P, E, SW, S, SE.
     * These canvases will have widths equal to the viewport.
     * The canvases will be translated using CSS when the user moves position.
     * If the user moves out of the bounds of the three canvases, the viewport won't shift.
     */
    OdysseyTileMap.prototype.translate = function () {
        var pos = this.position,
            rPos = this.renderedPosition,
            dxu = (Math.floor(rPos.x / this.sizeX) - Math.floor(pos.x / this.sizeX)),
            dyu = (Math.floor(rPos.y / this.sizeY) - Math.floor(pos.y / this.sizeY)),
            canvasOffsetX = Math.max(-3, Math.min(3, dxu)),
            canvasOffsetY = Math.max(-3, Math.min(3, dyu)),
            maxCanvasOffsetX = Math.max(canvasOffsetX, -canvasOffsetX),
            maxCanvasOffsetY = Math.max(canvasOffsetY, -canvasOffsetY),
            xOffset = Math.max(Math.min(1, dxu), -1),
            yOffset = Math.max(Math.min(1, dyu), -1),
            baseX = pos.x - (pos.x % this.sizeX),
            baseY = pos.y - (pos.y % this.sizeY),
            canvases = this.canvases,
            sgn,
            swapCanvas,
            p,
            c,
            x,
            y,
            needsRefresh = false;
        // East / west canvas movements.
        for (p = 0, sgn = (dxu < 0 ? -1 : +1); p !== canvasOffsetX; p += sgn) {
            for (c = 0; c < 3; c += 1) {
                // Save the west or east canvas (depending on xOffset) for overwriting the index.
                swapCanvas = canvases[3 * (1 + xOffset) + c];
                // Shift all canvases to the left or right.
                canvases[3 * (1 + xOffset) + c] = canvases[3 * (1 + xOffset - sgn) + c];
                canvases[3 * (1 + xOffset - sgn) + c] = canvases[3 * (1 + xOffset - 2 * sgn) + c];
                canvases[3 * (1 + xOffset - 2 * sgn) + c] = swapCanvas;
                // The swap canvas is no longer relevant.
                swapCanvas.getContext('2d').clearRect(0, 0, (32 * (this.sizeX + 1)), (32 * (this.sizeY + 1)));
            }
        }
        // Schedule the canvas for re-rendering.
        for (x = 0; x < (this.sizeX * maxCanvasOffsetX); x += 1) {
            for (y = 0; y < (this.sizeY * 3); y += 1) {
                this.setRenderFailed(
                    baseX + x + xOffset * this.sizeX,
                    baseY + y + (-1) * this.sizeY,
                    pos.z
                );
                needsRefresh = true;
            }
        }
        // South / north canvas movements.
        for (p = 0, sgn = (dyu < 0 ? -1 : +1); p !== canvasOffsetY; p += sgn) {
            for (c = 0; c < 3; c += 1) {
                // Save the top or bottom canvas (depending on yOffset) for overwriting the index.
                swapCanvas = canvases[3 * c + (yOffset + 1)];
                // Shift all canvases to the left or right.
                canvases[3 * c + (yOffset + 1)] = canvases[3 * c + (yOffset + 1 - yOffset)];
                canvases[(3 * c + (yOffset + 1 - yOffset))] = canvases[(3 * c + (yOffset + 1 - 2 * yOffset))];
                canvases[(3 * c + (yOffset + 1 - 2 * yOffset))] = swapCanvas;
                // The swap canvas is no longer relevant.
                swapCanvas.getContext('2d').clearRect(0, 0, (32 * (this.sizeX + 1)), (32 * (this.sizeY + 1)));
            }
        }
        // Schedule the canvas for re-rendering.
        for (x = 0; x < (this.sizeX * 3); x += 1) {
            for (y = 0; y < (this.sizeY * maxCanvasOffsetY); y += 1) {
                this.setRenderFailed(
                    baseX + x + (-1) * this.sizeX,
                    baseY + y + yOffset * this.sizeY,
                    pos.z
                );
                needsRefresh = true;
            }
        }
        // Set the viewport's translation.
        this.viewport.style.transform = "translate(" + (-32 * (1 + (pos.x % this.sizeX) - Math.ceil(this.sizeX / 2))) + "px, " + (-32 * (1 + (pos.y % this.sizeY) - Math.ceil(this.sizeY / 2))) + "px)";
        // Update the canvas IDs.
        this.updateCanvasIDs();
        // Return the success status.
        return needsRefresh;
    };

    return OdysseyTileMap;
}(jQuery));
