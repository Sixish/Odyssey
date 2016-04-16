/*jslint browser:true*/
///*globals jQuery, extend, OdysseyWorldMapPositionChangeEvent, OdysseyWorldMapToggleEvent, OdysseyWorldMapHideEvent, OdysseyWorldMapShowEvent*/
/* OdysseyWorldMap.js
 * Represents the state of the world map, i.e. the large pixel map.
 */
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Model.Matrix3D');
goog.require('Odyssey.Events.WorldMapShowEvent');
goog.require('Odyssey.Events.WorldMapHideEvent');
goog.require('Odyssey.Events.WorldMapToggleEvent');
goog.provide('Odyssey.View.WorldMap');
/**
 * Creates a closure for the OdysseyWorldMap class.
 * @param {jQuery} $ the jQuery instance.
 */
Odyssey.View.WorldMap = (function ($) {
    "use strict";
    /**
     * Creates a new OdysseyWorldMap.
     * @constructor
     */
    function OdysseyWorldMap() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
        this.position = new Odyssey.Model.Matrix3D(null, null, null);
        this.mapZoom = 1;
        // UI elements. Most of its properties are defined later.
        this.ui = {
            mapImages: []
        };
        // TODO move all below to OdysseyController | prototype?
        this.mouseIsDown = false;
        // Whether or not the large minimap is visible.
        this.visible = false;
        this.mapPosition = new Odyssey.Model.Matrix3D(33053, 31013, 7);
    }
    extend(OdysseyWorldMap.prototype, new Odyssey.Events.EventDispatchInterface());
    extend(OdysseyWorldMap.prototype, new Odyssey.View.ViewAttributor());

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

    /**
     * Shows the world map.
     */
    OdysseyWorldMap.prototype.show = function () {
        this.visible = true;
        $("body").addClass('state-minimap-active');
        this.dispatchEvent(new Odyssey.Events.WorldMapShowEvent());
    };

    /**
     * Hides the world map.
     */
    OdysseyWorldMap.prototype.hide = function () {
        this.visible = false;
        $("body").removeClass('state-minimap-active');
        this.dispatchEvent(new Odyssey.Events.WorldMapHideEvent());
    };

    /**
     * Toggles the visibility of the world map.
     */
    OdysseyWorldMap.prototype.toggle = function () {
        if (this.visible) {
            this.hide();
        } else {
            this.show();
        }
        this.dispatchEvent(new Odyssey.Events.WorldMapToggleEvent());
    };

    /**
     * Sets the world map's position and updates the map.
     * @param {Number} x the new x position.
     * @param {Number} y the new y position.
     * @param {Number} z the new z position.
     */
    OdysseyWorldMap.prototype.setPosition = function (x, y, z) {
        this.position.set(x, y, z);
        // TODO check: does this event exist?
        this.dispatchEvent(new Odyssey.Events.WorldMapPositionChangeEvent(this.position));
    };

    /**
     * Sets the element of the focus area.
     * @param {Object} element the DOM element to use for the focus area.
     */
    OdysseyWorldMap.prototype.setFocusAreaElement = function (element) {
        this.ui.focusArea = element;
    };

    /**
     * Gets the element of the focus area.
     * @returns {Object} the DOM element to use for the focus area.
     */
    OdysseyWorldMap.prototype.getFocusAreaElement = function () {
        return this.ui.focusArea || null;
    };

    /**
     * Sets the element for the wrapper.
     * @param {Object} element the element to use for the wrapper.
     */
    OdysseyWorldMap.prototype.setWrapperElement = function (element) {
        this.ui.wrapper = element;
    };

    /**
     * Gets the element for the wrapper.
     * @returns {Object} the element used for the wrapper.
     */
    OdysseyWorldMap.prototype.getWrapperElement = function () {
        return this.ui.wrapper || null;
    };

    /**
     * Sets the element for the viewport.
     * @param {Object} element the DOM element to use for the viewport.
     */
    OdysseyWorldMap.prototype.setMapViewportElement = function (element) {
        this.ui.viewport = element;
    };

    /**
     * Gets the element for the viewport.
     * @returns {Object} the DOM element used for the viewport.
     */
    OdysseyWorldMap.prototype.getMapViewportElement = function () {
        return this.ui.viewport || null;
    };

    /**
     * Sets the element used to contain the map.
     * @param {Object} element the element to contain the map.
     */
    OdysseyWorldMap.prototype.setMapContainerElement = function (element) {
        this.ui.mapContainer = element;
    };

    /**
     * Gets the element used to contain the map.
     * @returns {Object} the element used to contain the map.
     */
    OdysseyWorldMap.prototype.getMapContainerElement = function () {
        return this.ui.mapContainer || null;
    };

    /**
     * Sets the image element used for a floor of the world map.
     * @param {Number} z the floor of the world map corresponding to the map image.
     * @param {Object} element the DOM image element containing the map.
     */
    OdysseyWorldMap.prototype.setMapImageElement = function (z, element) {
        this.ui.mapImages[z] = element;
    };

    /**
     * Gets the image element corresponding to the floor.
     * @param {Number} z the floor.
     * @returns {Object} the image element corresponding to this floor.
     */
    OdysseyWorldMap.prototype.getMapImageElement = function (z) {
        return this.ui.mapImages[z] || null;
    };

    /**
     * Gets all the DOM image elements used as maps.
     * @returns {Array<Object>} all DOM image elements used for the maps.
     */
    OdysseyWorldMap.prototype.getMapImageElements = function () {
        return this.ui.mapImages || null;
    };

    /**
     * Updates the world map.
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
     * Sets the zoom for the world map and updates the map.
     * @param {Number} n the zoom state of the map.
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
     * Sets the current world map floor.
     * @param {Number} z the active floor.
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
     * Gets the position of the world map.
     * @returns {Matrix3D} the map position.
     */
    OdysseyWorldMap.prototype.getMapPosition = function () {
        return this.mapPosition;
    };

    /**
     * Sets the world map position and updates the world map.
     * @param {Matrix3D} position the new world map position.
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
