goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Model.ModelAttributor');
goog.require('Odyssey.View.ViewAttributor');
goog.require('Odyssey.Events.MapClickEvent');
goog.require('Odyssey.Model.Matrix3D');
goog.require('Odyssey.View.CanvasInterface');
goog.provide('Odyssey.View.Overlay');
Odyssey.View.Overlay = (function ($) {
    "use strict";
    function OdysseyOverlay() {
        var z = 0;

        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
        /**
         * The overlay canvases. We use this to render shapes on top of the map.
         * These overlay canvases are also used as control events, i.e. click events
         * may be bound to these canvases.
         */
        this.canvases = [];

        // Selected tiles.
        this.selected = {};
        // Painted tiles.
        this.painted = {};

        /**
         * The current map position. This value should never
         * be overwritten.
         */
        this.position = new Odyssey.Model.Matrix3D(0, 0, 0);

        /**
         * The current rendered map position. This value should
         * never be overwritten.
         */
        this.renderedPosition = new Odyssey.Model.Matrix3D(0, 0, 0);

        /**
         * The tiles that have failed to render.
         * These are stored for selective rendering.
         */
        this.failedRenderedTiles = {};
        // Set up the keys of failedRenderedTiles.
        for (z = 0; z < 16; z += 1) {
            this.failedRenderedTiles[z] = {};
            this.selected[z] = {};
            this.painted[z] = {};
        }
    }
    extend(OdysseyOverlay.prototype, new Odyssey.Events.EventDispatchInterface());
    extend(OdysseyOverlay.prototype, new Odyssey.View.ViewAttributor());
    extend(OdysseyOverlay.prototype, new Odyssey.View.CanvasInterface());

    OdysseyOverlay.prototype.resize = function (dimens) {
        $(this.getCanvases())
            .attr('width', 32 * (dimens + 1))
            .attr('height', 32 * (dimens + 1));
        //$(this.getViewport()).css({ 'fontSize': (32 * (dimens - 1)) + 'px' });
        this.setSize(dimens, dimens);
    };

    OdysseyOverlay.prototype.isPainted = function (cvsID, offsetX, offsetY) {
        //return (this.painted[z] && this.painted[z][y] && this.painted[z][y][x]) || false;
        return (this.painted[cvsID] && this.painted[cvsID][offsetY] && this.painted[cvsID][offsetY][offsetX]) || false;
    };

    OdysseyOverlay.prototype.setPainted = function (index, rx, ry, val) {
        if (!this.painted.hasOwnProperty(index)) {
            this.painted[index] = {};
        }
        if (!this.painted[index].hasOwnProperty(ry)) {
            this.painted[index][ry] = {};
        }
        if (!this.painted[index][ry][rx]) {
            this.painted[index][ry][rx] = val;
        }
    };

    OdysseyOverlay.prototype.clear = function () {
        var i, len = this.canvases.length;
        for (i = 0; i < len; i += 1) {
            if (this.canvases[i]) {
                this.canvases[i].getContext('2d').clearRect(0, 0, this.canvases[i].width, this.canvases[i].height);
            }
        }
    };

    OdysseyOverlay.prototype.drawSelected = function (x, y, z, isSelected) {
        var index = this.getCanvasSectionIndex(x, y, z), cvs, ctx, offsetX, offsetY;
        if (index === -1) {
            return;
        }
        cvs = this.canvases[index];
        ctx = cvs.getContext('2d');
        ctx.fillStyle = "rgba(53, 255, 96, 0.5)";
        offsetX = (1 + (x % this.sizeX));
        offsetY = (1 + (y % this.sizeY));
        // Draw the square if it's selected; clear the square if it's not.
        if (isSelected) {
            if (!this.isPainted(index, x, y, z)) {
                ctx.fillRect(32 * offsetX, 32 * offsetY, 32, 32);
                this.setPainted(index, x, y, true);
            }
        } else {
            if (this.isPainted(index, x, y, z)) {
                ctx.clearRect(32 * offsetX, 32 * offsetY, 32, 32);
                this.setPainted(index, x, y, false);
            }
        }
    };

    OdysseyOverlay.prototype.isSelected = function (x, y, z) {
        return Boolean(this.selected[z] && this.selected[z][y] && this.selected[z][y][x]);
    };

    OdysseyOverlay.prototype.setSelectedStatus = function (x, y, z, val) {
        if (!this.selected.hasOwnProperty(z)) {
            this.selected[z] = {};
        }
        if (!this.selected[z].hasOwnProperty(y)) {
            this.selected[z][y] = {};
        }
        if (!this.selected[z][y][x]) {
            this.selected[z][y][x] = val;
        }
    };

    /**
     * Refreshes the whole viewport. This is used when the sprites are known to be loaded.
     * @returns {Boolean} true if the refresh was successful; false otherwise.
     * @TODO generalize and move to interface. Derived from TileMap.
     */
    OdysseyOverlay.prototype.refresh = function () {
        var currentMapPosition = this.position, xs, xe, ys, ye, zs, ze, x, y, z, success = true;
        // Set the range of position values to render.
        xs = (currentMapPosition.x - (currentMapPosition.x % this.sizeX)) - this.sizeX;
        xe = (currentMapPosition.x - (currentMapPosition.x % this.sizeX)) + 2 * this.sizeX - 1;

        ys = (currentMapPosition.y - (currentMapPosition.y % this.sizeY)) - this.sizeY;
        ye = (currentMapPosition.y - (currentMapPosition.y % this.sizeY)) + 2 * this.sizeY - 1;

        // Our map doesn't support multi-level rendering just yet.
        zs = currentMapPosition.z;
        ze = currentMapPosition.z;

        //var x, xs, xe, y, ys, ye, z, zs, ze, currentMapPosition = this.position, success = true;

        for (x = xs; x <= xe; x += 1) {
            for (y = ys; y <= ye; y += 1) {
                for (z = zs; z <= ze; z += 1) {
                    this.drawSelected(x, y, z, this.isSelected(x, y, z));
                }
            }
        }
        return success;
    };

    OdysseyOverlay.prototype.render = function () {
        if (this.translate()) {
            this.refresh();
            this.renderedPosition.set(this.position.x, this.position.y, this.position.z);
        }
    };

    OdysseyOverlay.prototype.select = function select(x, y, z) {
        if (!this.isSelected(x, y, z)) {
            this.setSelectedStatus(x, y, z, true);
            this.drawSelected(x, y, z, true);
        }
        this.dispatchEvent(new Odyssey.Events.MapClickEvent(new Odyssey.Model.Matrix3D(x, y, z)));
    };

    OdysseyOverlay.prototype.unselect = function unselect(x, y, z) {
        if (this.isSelected(x, y, z)) {
            this.setSelectedStatus(x, y, z, false);
            this.drawSelected(x, y, z, false);
        }
    };

    OdysseyOverlay.prototype.update = function () {
        this.render();
    };

    return OdysseyOverlay;
}(jQuery));
