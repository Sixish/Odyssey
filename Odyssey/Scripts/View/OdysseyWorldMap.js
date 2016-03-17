/*jslint browser:true*/
/*globals jQuery, Matrix3D, OdysseyEventDispatcher, OdysseyWorldMapPositionChangeEvent, OdysseyEventDispatchInterface, OdysseyWorldMapToggleEvent, OdysseyWorldMapHideEvent, OdysseyWorldMapShowEvent*/
var OdysseyWorldMap = (function ($) {
    "use strict";
    function OdysseyWorldMap() {
        this.eventDispatcher = new OdysseyEventDispatcher();
        this.position = new Matrix3D(null, null, null);
        this.mapZoom = 1;
        // UI elements. Most of its properties are defined later.
        this.ui = {
            mapImages: []
        };
        // TODO move all below to OdysseyController | prototype?
        this.mouseIsDown = false;
        // Whether or not the large minimap is visible.
        this.visible = false;
        this.mapPosition = new Matrix3D(33053, 31013, 7);
    }
    OdysseyWorldMap.prototype = new OdysseyEventDispatchInterface();

    /** @const */
    OdysseyWorldMap.MIN_POSITION_X = (124 * 256);
    /** @const */
    OdysseyWorldMap.MIN_POSITION_Y = (121 * 256);
    /** @const */
    OdysseyWorldMap.SIZE_X = 2049;
    /** @const */
    OdysseyWorldMap.SIZE_Y = 2305;
    /** @const */
    OdysseyWorldMap.MIN_ZOOM = 1;
    /** @const */
    OdysseyWorldMap.MAX_ZOOM = 5;
    /** @const */
    OdysseyWorldMap.DEFAULT_ZOOM = 1;

    OdysseyWorldMap.prototype.show = function () {
        this.visible = true;
        $("body").addClass('state-minimap-active');
        this.dispatchEvent(new OdysseyWorldMapShowEvent());
    };
    OdysseyWorldMap.prototype.hide = function () {
        this.visible = false;
        $("body").removeClass('state-minimap-active');
        this.dispatchEvent(new OdysseyWorldMapHideEvent());
    };
    OdysseyWorldMap.prototype.toggle = function () {
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
        this.dispatchEvent(new OdysseyWorldMapToggleEvent());
    };

    /**
     * Sets the WorldMap's position.
     */
    OdysseyWorldMap.prototype.setPosition = function (x, y, z) {
        this.position.set(x, y, z);
        this.dispatchEvent(new OdysseyWorldMapPositionChangeEvent(this.position));
    };

    OdysseyWorldMap.prototype.setFocusAreaElement = function (element) {
        this.ui.focusArea = element;
    };
    OdysseyWorldMap.prototype.getFocusAreaElement = function () {
        return this.ui.focusArea || null;
    };

    OdysseyWorldMap.prototype.setWrapperElement = function (element) {
        this.ui.wrapper = element;
    };
    OdysseyWorldMap.prototype.getWrapperElement = function () {
        return this.ui.wrapper || null;
    };

    OdysseyWorldMap.prototype.setMapViewportElement = function (element) {
        this.ui.viewport = element;
    };
    OdysseyWorldMap.prototype.getMapViewportElement = function () {
        return this.ui.viewport || null;
    };

    OdysseyWorldMap.prototype.setMapContainerElement = function (element) {
        this.ui.mapContainer = element;
    };
    OdysseyWorldMap.prototype.getMapContainerElement = function () {
        return this.ui.mapContainer || null;
    };

    OdysseyWorldMap.prototype.setMapImageElement = function (z, element) {
        this.ui.mapImages[z] = element;
    };
    OdysseyWorldMap.prototype.getMapImageElement = function (z) {
        return this.ui.mapImages[z] || null;
    };

    OdysseyWorldMap.prototype.getMapImageElements = function () {
        return this.ui.mapImages || null;
    };

    /**
     * Updates WorldMap.
     */
    OdysseyWorldMap.prototype.update = function () {
        var $container = $(this.getMapViewportElement()),
            // Static width and height of the viewport.
            mmViewportWidth = $container.width(),
            mmViewportHeight = $container.height(),
            e;
        // Adjust the focus area position.
        e = this.getFocusAreaElement();
        if (e !== null) {
            e.style.left = this.mapZoom * this.position.x + 'px';
            e.style.top = this.mapZoom * this.position.y + 'px';
        }
        // Adjust the map container position.
        e = this.getMapContainerElement();
        if (e !== null) {
            e.style.left = -this.mapZoom * (this.position.x - mmViewportWidth / 2) + 'px';
            e.style.top = -this.mapZoom * (this.position.y - mmViewportHeight / 2) + 'px';
        }
    };

    /**
     * Sets the zoom for the WorldMap.
     */
    OdysseyWorldMap.prototype.zoom = function (n) {
        var e, elements, i, len, valX, valY;
        // Set the zoom value.
        this.mapZoom = n;
        // Update the map image sizes.
        elements = this.getMapImageElements();
        valX = Math.floor(OdysseyWorldMap.SIZE_X * n);
        valY = Math.floor(OdysseyWorldMap.SIZE_Y * n);
        for (i = 0, len = elements.length; i < len; i += 1) {
            e = elements[i];
            if (e !== null) {
                e.width = valX;
                e.height = valY;
            }
        }
        // Handle the map control elements.
        this.update();
    };

    /**
     * Sets the current WorldMap floor.
     */
    OdysseyWorldMap.prototype.setFloor = function (z) {
        $(this.getMapImageElement(this.position.z))
            .removeClass("active")
            .addClass("inactive");
        $(this.getMapImageElement(z))
            .removeClass("inactive")
            .addClass("active");
    };

    /**
     * Gets the position of the WorldMap.
     */
    OdysseyWorldMap.prototype.getMapPosition = function () {
        return this.mapPosition;
    };

    /**
     * Sets the WorldMap position and updates the WorldMap.
     * @param position The new WorldMap position.
     */
    OdysseyWorldMap.prototype.setMapPosition = function setMapPosition(position) {
        this.mapPosition.set(Math.floor(position.x), Math.floor(position.y), Math.floor(position.z));
        // Update mmPosXYZ based on new mapPosition.
        this.position.x = this.mapPosition.x - OdysseyWorldMap.MIN_POSITION_X;
        this.position.y = this.mapPosition.y - OdysseyWorldMap.MIN_POSITION_Y;
        if (this.mapPosition.z !== this.position.z) {
            this.setFloor(this.mapPosition.z);
            this.position.z = this.mapPosition.z;
        }
        this.update();
    };

    return OdysseyWorldMap;
}(jQuery));
