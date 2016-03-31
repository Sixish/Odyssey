/*global jQuery, OdysseyEventDispatchInterface, OdysseyEventDispatcher*/
var OdysseyTileInfo = (function ($) {
    "use strict";
    var $ToolTipItems = $(".OdysseyToolTipItem"),
        $ToolTipItemsID = $(".OdysseyToolTipItem .OdysseyToolTipID"),
        $ToolTipItemsCount = $(".OdysseyToolTipItem .OdysseyToolTipCount"),
        ttLength = $ToolTipItems.length;
    function OdysseyTileInfo() {
        this.eventDispatcher = new OdysseyEventDispatcher();
    }
    extend(OdysseyTileInfo.prototype, new OdysseyEventDispatchInterface());

    OdysseyTileInfo.prototype.setContext = function (Odyssey) {
        this.context = Odyssey;
    };
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
    OdysseyTileInfo.prototype.update = function (model) {
        // TODO
        // We need access to the tile map because it has position?
        // Or, controller could set this.position.
    };

    return OdysseyTileInfo;
}(jQuery));
