goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Events.MapPositionChangedEvent');
goog.require('Odyssey.View.ViewAttributor');
goog.require('Odyssey.Model.MapFile');
goog.require('Odyssey.Events.CanvasTranslatedEvent');
goog.provide('Odyssey.View.CanvasInterface');
Odyssey.View.CanvasInterface = (function () {
    "use strict";
    function OdysseyCanvasInterface() {
        // This should NOT provide its own event dispatcher. Child classes MUST.
        this.eventDispatcher = null;
    }
    /** @const */
    OdysseyCanvasInterface.CANVAS_NORTHWEST_ID = 0;
    /** @const */
    OdysseyCanvasInterface.CANVAS_WEST_ID = 1;
    /** @const */
    OdysseyCanvasInterface.CANVAS_SOUTHWEST_ID = 2;
    /** @const */
    OdysseyCanvasInterface.CANVAS_NORTH_ID = 3;
    /** @const */
    OdysseyCanvasInterface.CANVAS_PIVOT_ID = 4;
    /** @const */
    OdysseyCanvasInterface.CANVAS_SOUTH_ID = 5;
    /** @const */
    OdysseyCanvasInterface.CANVAS_NORTHEAST_ID = 6;
    /** @const */
    OdysseyCanvasInterface.CANVAS_EAST_ID = 7;
    /** @const */
    OdysseyCanvasInterface.CANVAS_SOUTHEAST_ID = 8;

    extend(OdysseyCanvasInterface.prototype, new Odyssey.Events.EventDispatchInterface());
    extend(OdysseyCanvasInterface.prototype, new Odyssey.View.ViewAttributor());

    /**
     * The number of tiles to display on the viewport in the X direction.
     */
    OdysseyCanvasInterface.prototype.sizeX = 0;

    /**
     * The number of tiles to display on the viewport in the Y direction.
     */
    OdysseyCanvasInterface.prototype.sizeY = 0;

    /**
     * Sets the current map position. This method should be used
     * instead of position's set method because it registers an event
     * for listeners.
     * @param {Number} x the new x-coordinate.
     * @param {Number} y the new y-coordinate.
     * @param {Number} z the new z-coordinate.
     */
    OdysseyCanvasInterface.prototype.setPosition = function (x, y, z) {
        this.position.set(x, y, z);
        this.dispatchEvent(new Odyssey.Events.MapPositionChangedEvent(this, this.position));
    };

    /**
     * Gets the map position.
     * @returns {Matrix3D} the map position.
     */
    OdysseyCanvasInterface.prototype.getPosition = function () {
        return this.position;
    };

    /**
     * Calculates the canvas section index based on the map position.
     * @param {Number} posX a map position X component.
     * @param {Number} posY a map position Y component.
     * @returns {Number} the canvas index that should contain (posX, posY).
     */
    OdysseyCanvasInterface.prototype.getCanvasSectionIndex = function (posX, posY) {
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
     * @param {Number} posx the position X component of the canvas section.
     * @param {Number} posy the position Y component of the canvas section.
     */
    OdysseyCanvasInterface.prototype.getCanvasSection = function (posx, posy) {
        var index = this.getCanvasSectionIndex(posx, posy);
        // Make sure this canvas exists.
        if (index === -1) {
            console.log("Could not find canvas for " + posx + ", " + posy);
            return null;
        }
        return this.canvases[index];
    };

    /**
     * Sets a position (tile) as failed to render.
     * @param {Number} x the map position X component.
     * @param {Number} y the map position Y component.
     * @param {Number} z the map position Z component.
     * @param {Boolean} value whether or not the tile failed.
     */
    OdysseyCanvasInterface.prototype.setRenderFailed = function (x, y, z, value) {
        this.failedRenderedTiles[z][Odyssey.Model.MapFile.getOffset(x, y)] = (value !== undefined ? value : true);
    };

    /**
     * Sets the size of the display. The canvases should have sizes
     * corresponding to 32 times the size of the tile map,
     * plus 32x32 to resolve clipping for 64x64px sprites.
     * @param {Number} sx the amount of tiles in the X direction on the viewport and each canvas.
     * @param {Number} sy the amount of tiles in the Y direction on the viewport and each canvas.
     */
    OdysseyCanvasInterface.prototype.setSize = function (x, y) {
        this.sizeX = x;
        this.sizeY = y;
    };

    /**
     * Sets a canvas for rendering the map.
     * @param {Number} index the index of the canvas.
     * @param {Object} canvas the DOM canvas element.
     */
    OdysseyCanvasInterface.prototype.setCanvas = function (id, canvas) {
        this.canvases[id] = canvas;
    };

    /**
     * Gets the canvas at the specified index.
     * @param {Number} index the index of the canvas to get.
     * @returns {Object} the canvas corresponding to the name.
     */
    OdysseyCanvasInterface.prototype.getCanvas = function (id) {
        return this.canvases[id];
    };

    /**
     * Gets all canvases.
     * @returns {Array<Object>} a reference to the canvases array.
     */
    OdysseyCanvasInterface.prototype.getCanvases = function () {
        return this.canvases;
    };

    /**
     * Translates a series of canvases so that we don't need to repaint whole canvases.
     * We will use 9 canvases: NW, N, NE, W, P, E, SW, S, SE.
     * These canvases will have widths equal to the viewport.
     * The canvases will be translated using CSS when the user moves position.
     * If the user moves out of the bounds of the three canvases, the viewport won't shift.
     */
    OdysseyCanvasInterface.prototype.translate = function () {
        var pos = this.position,
            rPos = this.renderedPosition,
            dxu = (Math.floor(pos.x / this.sizeX) - Math.floor(rPos.x / this.sizeX)),
            dyu = (Math.floor(pos.y / this.sizeY) - Math.floor(rPos.y / this.sizeY)),
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
                swapCanvas = canvases[3 * (1 - xOffset) + c];
                // Shift all canvases to the left or right.
                canvases[3 * (1 - xOffset) + c] = canvases[3 * (1 - xOffset + sgn) + c];
                canvases[3 * (1 - xOffset + sgn) + c] = canvases[3 * (1 - xOffset + 2 * sgn) + c];
                canvases[3 * (1 - xOffset + 2 * sgn) + c] = swapCanvas;
                // The swap canvas is no longer relevant.
                swapCanvas.getContext('2d').clearRect(0, 0, (32 * (this.sizeX + 1)), (32 * (this.sizeY + 1)));
            }
        }

        // Schedule the canvas for re-rendering.
        for (x = 0; x < (this.sizeX * maxCanvasOffsetX); x += 1) {
            for (y = 0; y < (this.sizeY * 3); y += 1) {
                // The following is the formula to determine where to start replacing tiles,
                // i.e. the top left canvas, or the rectangle we've not rendered yet.
                // The loops' conditions determine the area of that rectangle.
                // TODO check : there might be a 1px offset?
                this.setRenderFailed(
                    (baseX + (xOffset < 0 ? -1 : (2 - canvasOffsetX)) * this.sizeX) + x,
                    (baseY + (-1 * this.sizeY)) + y,
                    pos.z,
                    true
                );
                needsRefresh = true;
            }
        }
        // South / north canvas movements.
        for (p = 0, sgn = (dyu < 0 ? -1 : +1); p !== canvasOffsetY; p += sgn) {
            for (c = 0; c < 3; c += 1) {
                // Save the top or bottom canvas (depending on yOffset) for overwriting the index.
                swapCanvas = canvases[3 * c + (1 - yOffset)];
                // Shift all canvases to the left or right.
                canvases[3 * c + (1 - yOffset)] = canvases[3 * c + (1 - yOffset + sgn)];
                canvases[(3 * c + (yOffset + 1 - yOffset))] = canvases[3 * c + (1 - yOffset + 2 * sgn)];
                canvases[3 * c + (1 - yOffset + 2 * sgn)] = swapCanvas;
                // The swap canvas is no longer relevant.
                swapCanvas.getContext('2d').clearRect(0, 0, (32 * (this.sizeX + 1)), (32 * (this.sizeY + 1)));
            }
        }

        // Schedule the canvas for re-rendering.
        for (x = 0; x < (this.sizeX * 3); x += 1) {
            for (y = 0; y < (this.sizeY * maxCanvasOffsetY); y += 1) {
                // The following is the formula to determine where to start replacing tiles,
                // i.e. the top left canvas, or the rectangle we've not rendered yet.
                // The loops' conditions determine the area of that rectangle.
                // TODO check : there might be a 1px offset?
                this.setRenderFailed(
                    (baseX + (-1 * this.sizeX)) + x,
                    (baseY + (yOffset < 0 ? -1 : (2 - canvasOffsetY)) * this.sizeY) + y,
                    pos.z,
                    true
                );
                needsRefresh = true;
            }
        }

        this.dispatchEvent(new Odyssey.Events.CanvasTranslatedEvent());
        // Update the canvas IDs.
        this.updateCanvasIDs(this.canvases);
        // Return the success status.
        return needsRefresh;
    };

    /**
     * Updates the IDs of the canvas elements. This ensures that all canvases
     * have correct IDs after performing translations.
     */
    OdysseyCanvasInterface.prototype.updateCanvasIDs = function (canvases) {
        canvases[OdysseyCanvasInterface.CANVAS_NORTHWEST_ID].setAttribute('id', 'OdysseyMapCanvas-NW');
        canvases[OdysseyCanvasInterface.CANVAS_NORTH_ID].setAttribute('id', 'OdysseyMapCanvas-N');
        canvases[OdysseyCanvasInterface.CANVAS_NORTHEAST_ID].setAttribute('id', 'OdysseyMapCanvas-NE');
        canvases[OdysseyCanvasInterface.CANVAS_WEST_ID].setAttribute('id', 'OdysseyMapCanvas-W');
        canvases[OdysseyCanvasInterface.CANVAS_PIVOT_ID].setAttribute('id', 'OdysseyMapCanvas-P');
        canvases[OdysseyCanvasInterface.CANVAS_EAST_ID].setAttribute('id', 'OdysseyMapCanvas-E');
        canvases[OdysseyCanvasInterface.CANVAS_SOUTHWEST_ID].setAttribute('id', 'OdysseyMapCanvas-SW');
        canvases[OdysseyCanvasInterface.CANVAS_SOUTH_ID].setAttribute('id', 'OdysseyMapCanvas-S');
        canvases[OdysseyCanvasInterface.CANVAS_SOUTHEAST_ID].setAttribute('id', 'OdysseyMapCanvas-SE');
    };

    return OdysseyCanvasInterface;
}());