///*global extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Model.ModelAttributor');
goog.require('Odyssey.View.ViewAttributor');
goog.provide('Odyssey.Controller.OverlayControl');
Odyssey.Controller.OverlayControl = (function () {
    "use strict";
    var NORTHWEST = Odyssey.View.CanvasInterface.CANVAS_NORTHWEST_ID,
        NORTH = Odyssey.View.CanvasInterface.CANVAS_NORTH_ID,
        NORTHEAST = Odyssey.View.CanvasInterface.CANVAS_NORTHEAST_ID,
        WEST = Odyssey.View.CanvasInterface.CANVAS_WEST_ID,
        PIVOT = Odyssey.View.CanvasInterface.CANVAS_PIVOT_ID,
        EAST = Odyssey.View.CanvasInterface.CANVAS_EAST_ID,
        SOUTHWEST = Odyssey.View.CanvasInterface.CANVAS_SOUTHWEST_ID,
        SOUTH = Odyssey.View.CanvasInterface.CANVAS_SOUTH_ID,
        SOUTHEAST = Odyssey.View.CanvasInterface.CANVAS_SOUTHEAST_ID;

    function OdysseyOverlayControl() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
    }
    extend(OdysseyOverlayControl.prototype, new Odyssey.Events.EventDispatchInterface());
    extend(OdysseyOverlayControl.prototype, new Odyssey.View.ViewAttributor());
    extend(OdysseyOverlayControl.prototype, new Odyssey.Model.ModelAttributor());

    /**
     * Gets the x-offset of the canvas.
     * @param {Element} c the canvas.
     * @param {Array<Element>} canvases the array of canvases.
     * @returns {Number} the x-offset of the canvas according to the
     * position in the array.
     * @static
     */
    OdysseyOverlayControl.getX = function getX(c, canvases) {
        if (c === canvases[EAST] || c === canvases[NORTHEAST] || c === canvases[SOUTHEAST]) {
            return 1;
        }
        if (c === canvases[WEST] || c === canvases[NORTHWEST] || c === canvases[SOUTHWEST]) {
            return -1;
        }
        return 0;
    };

    /**
     * Gets the x-offset of the canvas.
     * @param {Element} c the canvas.
     * @param {Array<Element>} canvases the array of canvases.
     * @returns {Number} the x-offset of the canvas according to the
     * position in the array.
     * @static
     */
    OdysseyOverlayControl.getY = function getY(c, canvases) {
        if (c === canvases[SOUTH] || c === canvases[SOUTHWEST] || c === canvases[SOUTHEAST]) {
            return 1;
        }
        if (c === canvases[NORTH] || c === canvases[NORTHWEST] || c === canvases[NORTHEAST]) {
            return -1;
        }
        return 0;
    }

    OdysseyOverlayControl.prototype.initialize = function () {
        var tileMap = this.getView().getTileMap(),
            overlay = this.getView().getOverlay();
        $(overlay.getCanvases()).click(function (e) {
            // Determine the coordinates the click event fired on.
            var xOffset = OdysseyOverlayControl.getX(e.target, overlay.canvases) * tileMap.sizeX,
                yOffset = OdysseyOverlayControl.getY(e.target, overlay.canvases) * tileMap.sizeY,
                x = (tileMap.position.x - (tileMap.position.x % tileMap.sizeX)) + xOffset + (Math.floor(e.offsetX / 32) - 1),
                y = (tileMap.position.y - (tileMap.position.y % tileMap.sizeY)) + yOffset + (Math.floor(e.offsetY / 32) - 1),
                z = tileMap.position.z;
            // Select the tile.
            console.log(xOffset, yOffset);
            overlay.select(x, y, z);
        });
    };

    return OdysseyOverlayControl;
}());
