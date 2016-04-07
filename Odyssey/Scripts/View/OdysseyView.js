/*global extend, OdysseyEventDispatcher, OdysseyEventDispatchInterface*/
/** OdysseyModel.js
 * Contains UI components. This includes:
 *   Minimap : the minimap of the model.
 *   WorldMap : the world map of the model.
 *   TileMap : the tile map of the model.
 */
var OdysseyView = (function () {
    "use strict";
    function OdysseyView() {
        this.eventDispatcher = new OdysseyEventDispatcher();
        this.minimap = null;
        this.worldMap = null;
        this.tileMap = null;
        this.tileInfo = null;
        this.overlay = null;
        this.spriteIndex = null;
    }
    extend(OdysseyView.prototype, new OdysseyEventDispatchInterface());

    /**
     * Proxy method for updating a view. This method returns a function
     * that can safely be passed as event listeners with a custom context.
     * @param {OdysseyView} instance the view to update.
     */
    OdysseyView.updateProxy = function (instance) {
        return function () {
            instance.update();
        };
    };

    /**
     * Sets the resource manager of the view. This will be used to store sprites.
     * @param {ResourceManager} resourceManager the resource manager for the view.
     */
    OdysseyView.prototype.setResourceManager = function (resourceManager) {
        this.resourceManager = resourceManager;
        this.resourceManager.setParentEventHandler(this.eventDispatcher);
    };

    /**
     * Gets the resource manager of he view.
     * @returns {ResourceManager} the resource manager of the view.
     */
    OdysseyView.prototype.getResourceManager = function () {
        return this.resourceManager;
    };

    /**
     * Sets the model for the view. This will be the subject of
     * the rendering.
     * @param {OdysseyModel} model the model to use for the view.
     */
    OdysseyView.prototype.setModel = function (model) {
        this.model = model;
    };

    /**
     * Gets the model of the view.
     * @returns {OdysseyModel} the model of the view.
     */
    OdysseyView.prototype.getModel = function () {
        return this.model;
    };
    /**
     * Sets the minimap of the view.
     * @param {OdysseyMinimap} minimap the minimap for the view.
     */
    OdysseyView.prototype.setMinimap = function (minimap) {
        this.minimap = minimap;
        this.minimap.setParentEventHandler(this.eventDispatcher);
    };

    /**
     * Gets the minimap of the view.
     * @returns {OdysseyMinimap} the minimap of the view, or null if one is not set.
     */
    OdysseyView.prototype.getMinimap = function () {
        return this.minimap;
    };

    /**
     * Sets the world map of the view.
     * @param {OdysseyWorldMap} worldMap the world map for the view.
     */
    OdysseyView.prototype.setWorldMap = function (worldMap) {
        this.worldMap = worldMap;
        this.worldMap.setParentEventHandler(this.eventDispatcher);
    };

    /**
     * Gets the world map of the view.
     * @returns {OdysseyWorldMap} the world map of the view, or null if one is not set.
     */
    OdysseyView.prototype.getWorldMap = function () {
        return this.worldMap;
    };

    /**
     * Sets the tile map of the view.
     * @param {OdysseyTileMap} tileMap the tile map for the view.
     */
    OdysseyView.prototype.setTileMap = function (tileMap) {
        this.tileMap = tileMap;
        this.tileMap.setParentEventHandler(this.eventDispatcher);
    };

    /**
     * Gets the tile map of the view.
     * @returns {OdysseyTileMap} the tile map for the view, or null if one is not set.
     */
    OdysseyView.prototype.getTileMap = function () {
        return this.tileMap;
    };

    /**
     * Sets the tile info view component.
     * @param {OdysseyTileInfo} tileInfo the tile info view component.
     */
    OdysseyView.prototype.setTileInfo = function (tileInfo) {
        this.tileInfo = tileInfo;
        this.tileInfo.setParentEventHandler(this.eventDispatcher);
    };

    /**
     * Gets the tile info view component.
     * @returns {OdysseyTileInfo} the tile info view component.
     */
    OdysseyView.prototype.getTileInfo = function () {
        return this.tileInfo;
    };

    /**
     * Sets the overlay view component.
     * TODO : OdysseyOverlay is not a type.
     * @param {OdysseyOverlay} overlay the overlay view component.
     */
    OdysseyView.prototype.setOverlay = function (overlay) {
        this.overlay = overlay;
        this.overlay.setParentEventHandler(this.eventDispatcher);
    };

    /**
     * Gets the overlay view component.
     * TODO : OdysseyOverlay is not a type.
     * @returns {OdysseyOverlay} the overlay view component.
     */
    OdysseyView.prototype.getOverlay = function () {
        return this.overlay;
    };

    /**
     * Sets the sprite index.
     * @param {OdysseySpriteIndex} spriteIndex the sprite index to use.
     */
    OdysseyView.prototype.setSpriteIndex = function (spriteIndex) {
        this.spriteIndex = spriteIndex;
        this.spriteIndex.setParentEventHandler(this.eventDispatcher);
    };

    /**
     * Gets the sprite index.
     * @returns {OdysseySpriteIndex} the sprite index used by the view.
     */
    OdysseyView.prototype.getSpriteIndex = function () {
        return this.spriteIndex;
    };

    /**
     * Gets the status view component.
     * @returns {OdysseyStatus} the status view component.
     */
    OdysseyView.prototype.getStatus = function () {
        return this.status;
    };

    /**
     * Sets the status view component.
     * @param {OdysseyStatus} status the status view component.
     */
    OdysseyView.prototype.setStatus = function (status) {
        this.status = status;
    };

    /**
     * Updates the view.
     */
    OdysseyView.prototype.update = function () {
        if (this.minimap !== null) {
            this.minimap.update(this.model, this);
        }
        if (this.worldMap !== null) {
            this.worldMap.update(this.model, this);
        }
        if (this.tileMap !== null) {
            this.tileMap.update(this.model, this);
        }
        if (this.tileInfo !== null) {
            this.tileInfo.update(this.model, this);
        }
        if (this.overlay !== null) {
            this.overlay.update(this.model, this);
        }
    };

    return OdysseyView;
}());
