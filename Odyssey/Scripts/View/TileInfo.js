///*global jQuery, extend*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.provide('Odyssey.View.TileInfo');
Odyssey.View.TileInfo = (function ($) {
    "use strict";
    var $ToolTipItems = $(".OdysseyToolTipItem"),
        $ToolTipItemsID = $(".OdysseyToolTipItem .OdysseyToolTipID"),
        $ToolTipItemsCount = $(".OdysseyToolTipItem .OdysseyToolTipCount"),
        ttLength = $ToolTipItems.length;
    /**
     * Creates a tile info view component.
     * @constructor
     */
    function OdysseyTileInfo() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
    }
    extend(OdysseyTileInfo.prototype, new Odyssey.Events.EventDispatchInterface());

    /**
     * Sets the context.
     * @TODO remove
     * @param {Odyssey} Odyssey the Odyssey context to use.
     */
    OdysseyTileInfo.prototype.setContext = function (Odyssey) {
        this.context = Odyssey;
    };

    /**
     * Shows the tile information for the tile at (x, y, z).
     * @param {Number} x the x-coordinate of the tile to show information for.
     * @param {Number} y the y-coordinate of the tile to show information for.
     * @param {Number} z the z-coordinate of the tile to show information for.
     */
    OdysseyTileInfo.prototype.showInfo = function (x, y, z) {
        var items = this.context.getTileItems(x, y, z), i, len;

        if (items === null || items === undefined) {
            items = [];
        }

        for (i = 0, len = items.length; i < len; i += 1) {
            $($ToolTipItemsID[i]).text(items[i].ID);
            $($ToolTipItemsCount[i]).text(items[i].Count);
            $($ToolTipItems[i]).show();
        }
        for (i = i; i < ttLength; i += 1) {
            $($ToolTipItems[i]).hide();
        }
    };

    /**
     * Updates the tile info view component.
     */
    OdysseyTileInfo.prototype.update = function () {
        // TODO
        // We need access to the tile map because it has position?
        // Or, controller could set this.position.
    };

    return OdysseyTileInfo;
}(jQuery));
