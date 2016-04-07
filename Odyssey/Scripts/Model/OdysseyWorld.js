/*global extend, OdysseyEventDispatchInterface, OdysseyEventDispatcher*/
/** OdysseyWorld.js
 * Contains map information.
 */
var OdysseyWorld = (function () {
    "use strict";
    /**
     * Creates a world object.
     * @constructor
     */
    function OdysseyWorld() {
        this.eventDispatcher = new OdysseyEventDispatcher();
        this.items = {};
    }
    extend(OdysseyWorld.prototype, new OdysseyEventDispatchInterface());

    /**
     * Checks whether a tile exists at (x, y, z).
     * @param {Number} x the tile's x-coordinate.
     * @param {Number} y the tile's y-coordinate.
     * @param {Number} z the tile's z-coordinate.
     * @returns {Boolean} true if a tile exists at (x, y, z); false otherwise.
     */
    OdysseyWorld.prototype.tileExists = function (x, y, z) {
        return !(this[x] === undefined || this[x][y] === undefined || this[x][y][z] === undefined);
    };

    /**
     * Gets the tile at the position (x, y, z).
     * @param {Number} x the tile's x-coordinate.
     * @param {Number} y the tile's y-coordinate.
     * @param {Number} z the tile's z-coordinate.
     * @returns {Object} the tile at (x, y, z).
     */
    OdysseyWorld.prototype.getTile = function (x, y, z) {
        if (this.tileExists(x, y, z)) {
            return this[x][y][z];
        }
        return null;
    };

    /**
     * Checks if the world contains the item of the item's ID.
     * @param {Number} itemID the item ID to search for.
     */
    OdysseyWorld.prototype.containsItem = function (itemID) {
        return this.items.hasOwnProperty(itemID);
    };

    /**
     * Adds an item to the world.
     * @param {Number} itemID the item's ID.
     */
    OdysseyWorld.prototype.addItem = function (itemID) {
        if (this.items[itemID] === undefined) {
            this.items[itemID] = 0;
        }
        this.items[itemID] += 1;
    };

    /**
     * Adds a tile to the world.
     * @param {Number} x the tile's x-coordinate.
     * @param {Number} y the tile's y-coordinate.
     * @param {Number} z the tile's z-coordinate.
     * @param {Object} tile the tile to place at (x, y, z).
     */
    OdysseyWorld.prototype.addTile = function (x, y, z, tile) {
        var i, item;
        if (this[x] === undefined) {
            this[x] = {};
        }
        if (this[x][y] === undefined) {
            this[x][y] = {};
        }
        this[x][y][z] = tile;
        // Add all the items in the list.
        for (i = 0; i < tile.items.length; i += 1) {
            item = tile.items[i];
            this.addItem(item.ID);
        }
    };

    return OdysseyWorld;
}());
