/*global jQuery, OdysseyEventDispatchInterface, OdysseyEventDispatcher, OdysseyMapClickEvent, Matrix3D, OdysseyTileMap*/
var OdysseyController = (function ($) {
    "use strict";
    var NORTHWEST = OdysseyTileMap.CANVAS_NORTHWEST_ID,
        NORTH = OdysseyTileMap.CANVAS_NORTH_ID,
        NORTHEAST = OdysseyTileMap.CANVAS_NORTHEAST_ID,
        WEST = OdysseyTileMap.CANVAS_WEST_ID,
        PIVOT = OdysseyTileMap.CANVAS_PIVOT_ID,
        EAST = OdysseyTileMap.CANVAS_EAST_ID,
        SOUTHWEST = OdysseyTileMap.CANVAS_SOUTHWEST_ID,
        SOUTH = OdysseyTileMap.CANVAS_SOUTH_ID,
        SOUTHEAST = OdysseyTileMap.CANVAS_SOUTHEAST_ID;

    function getX(c, canvases) {
        if (c === canvases[EAST] || c === canvases[NORTHEAST] || c === canvases[SOUTHEAST]) {
            return 1;
        }
        if (c === canvases[WEST] || c === canvases[NORTHWEST] || c === canvases[SOUTHWEST]) {
            return -1;
        }
        return 0;
    }

    function getY(c, canvases) {
        if (c === canvases[SOUTH] || c === canvases[SOUTHWEST] || c === canvases[SOUTHEAST]) {
            return 1;
        }
        if (c === canvases[NORTH] || c === canvases[NORTHWEST] || c === canvases[NORTHEAST]) {
            return -1;
        }
        return 0;
    }

    function dispatchControlProxy(fn, ctx) {
        return function (e) {
            fn.call(ctx, e);
        };
    }

    function OdysseyController() {
        this.eventDispatcher = new OdysseyEventDispatcher();
        this.context = null;
        this.controlStates = [];
        this.controlManager = null;
    }
    OdysseyController.prototype = new OdysseyEventDispatchInterface();
    OdysseyController.CONTROL_OVERLAY_CLICK = 0;
    OdysseyController.handleControlOverlayClick = function (e) {
        var Odyssey = this.context,
            xOffset = getX(e.target, Odyssey.overlayCanvases) * Odyssey.sizeX,
            yOffset = getY(e.target, Odyssey.overlayCanvases) * Odyssey.sizeY,
            x = (Odyssey.position.x - (Odyssey.position.x % Odyssey.sizeX)) + xOffset + (Math.floor(e.offsetX / 32) - 1),
            y = (Odyssey.position.y - (Odyssey.position.y % Odyssey.sizeY)) + yOffset + (Math.floor(e.offsetY / 32) - 1),
            z = Odyssey.position.z;
        if (this.isDisabled(OdysseyController.CONTROL_OVERLAY_CLICK)) {
            return;
        }
        Odyssey.dispatchEvent(new OdysseyMapClickEvent(new Matrix3D(x, y, z)));
    };

    OdysseyController.prototype.setControlManager = function (controlManager) {
        this.controlmanager = controlManager;
    };
    OdysseyController.prototype.setContext = function (Odyssey) {
        this.context = Odyssey;
    };
    OdysseyController.prototype.disable = function (controlID) {
        this.controlStates[controlID] = false;
    };
    OdysseyController.prototype.enable = function (controlID) {
        this.controlStates[controlID] = true;
    };
    OdysseyController.prototype.isDisabled = function (controlID) {
        return (this.controlStates[controlID] === false);
    };
    OdysseyController.prototype.isEnabled = function (controlID) {
        // Controls are enabled by default.
        return (!this.isDisabled(controlID));
    };
    OdysseyController.prototype.initialize = function () {
        var ctx = this;
        // Initialize the canvas selection.
        $(this.context.overlayCanvases).click(dispatchControlProxy(OdysseyController.handleControlOverlayClick, ctx, null));
    };

    return OdysseyController;
}(jQuery));
