/*global OdysseyEventDispatchInterface, OdysseyEventDispatcher*/
/**
 * OdysseyWorld.js
 *
 * Contains map information.
 */
var OdysseyWorld = (function () {
    "use strict";
    function OdysseyWorld() {
        this.eventDispatcher = new OdysseyEventDispatcher();
        this.items = {};
    }
    OdysseyWorld.prototype = new OdysseyEventDispatchInterface();
    OdysseyWorld.prototype.tileExists = function (x, y, z) {
        return !(this[x] === undefined || this[x][y] === undefined || this[x][y][z] === undefined);
    };
    OdysseyWorld.prototype.getTile = function (x, y, z) {
        if (this.tileExists(x, y, z)) {
            return this[x][y][z];
        }
        return null;
    };
    OdysseyWorld.prototype.containsItem = function (itemID) {
        return this.items.hasOwnProperty(itemID);
    };
    OdysseyWorld.prototype.addItem = function (itemID) {
        if (this.items[itemID] === undefined) {
            this.items[itemID] = 0;
        }
        this.items[itemID] += 1;
    };
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
