//jscs: disable
//TODO FIX
goog.require('Odyssey.Model.Matrix3D');
goog.provide('Odyssey.View.Tooltip');
Odyssey.View.Tooltip = (function (Odyssey, $) {
    "use strict";
    var $tooltip = $("#OdysseyToolTipHeader"),
        focusPosition = new Odyssey.Model.Matrix3D(0, 0, 0);
    function setTooltipPosition(x, y, z) {
    }
    function updateTooltipPosition(x, y, z) {
    }
    // On each grid tile hover, set the focus position
    $("#map-grid > div").mouseover(function () {
        var $this = $(this), data = $this.data(), offset, gridX, gridY;
        gridX = gridY = 0;
        gridX = data.gridX || 0;
        gridY = data.gridY || 0;
        offset = $this.offset();
        focusPosition.set(
            Odyssey.position.x + gridX,
            Odyssey.position.y + gridY,
            Odyssey.position.z
        );
        $tooltip.text(focusPosition.toString());
    });
    window.$tt = $tooltip;
}(window && window.Odyssey, jQuery));
