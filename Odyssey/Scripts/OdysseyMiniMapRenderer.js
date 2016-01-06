/*jslint browser: true, bitwise: true */
var OdysseyMiniMapRenderer = (function () {
    "use strict";
    /**
     * Creates a new OdysseyMiniMapRenderer. This is used to
     * render the minimap.
     * @constructor
     */
    function OdysseyMiniMapRenderer() {
        /**
         * The canvas to draw to.
         */
        this.canvas = null;

        /**
         * The 2D draw context of the canvas.
         */
        this.drawContext = null;

        /**
         * The minimap's current map position.
         */
        this.position = null;

        // ImageData objects for pixel manipulation.
    }

    /**
     * Draws a pixel of a color at position on the canvas.
     * @param rgba the color as an RGBA integer (0xRRGGBBAA).
     * @param x the X coordinate on the canvas.
     * @param y the Y coordinate on the canvas.
     */
    OdysseyMiniMapRenderer.prototype.drawPixel = function (rgba, x, y) {
        var r = ((rgba >> 24) & 0xFF),
            g = ((rgba >> 16) & 0xFF),
            b = ((rgba >> 8) & 0xFF),
            a = ((rgba >> 0) & 0xFF);

        this.drawContext.fillStyle = "rgba(" + r + "," + g + "," + b + ", " + a + ")";
        this.drawContext.fillRect(x, y, 1, 1);
    };

    /**
     * Sets the minimap canvas.
     * @param canvas the canvas to use for the minimap.
     */
    OdysseyMiniMapRenderer.prototype.setCanvas = function (canvas) {
        this.canvas = canvas;
        this.drawContext = canvas.getContext("2d");
    };

    /**
     * Initializes the OdysseyMiniMapRenderer.
     * @param Odyssey the OdysseyMapRenderer to use.
     */
    OdysseyMiniMapRenderer.prototype.initialize = function (Odyssey, Dat) {
        // Dependencies.
        this.Odyssey = Odyssey;
        this.Dat = Dat;
        this.position = Odyssey.position;
    };

    /**
     * Re-renders the minimap.
     */
    OdysseyMiniMapRenderer.prototype.update = function () {
        var xs, ys, zs, items, i, itemCount, itemMapColor, dx, dy;
        xs = this.position.x - 63;
        ys = this.position.y - 63;
        zs = this.position.z;

        for (dx = 0; dx < 127; dx += 1) {
            for (dy = 0; dy < 127; dy += 1) {
                itemMapColor = null;

                items = this.Odyssey.getTileItems(xs + dx, ys + dy, zs);
                itemCount = ((items === undefined || items === null) ? 0 : items.length);

                // Search the tile items from top to bottom until we find a map color.
                for (i = itemCount - 1; i >= 0 && itemMapColor === null; i -= 1) {
                    itemMapColor = this.Dat.getMapColor(items[i].ID);
                }

                // Use black (0, 0, 0, 255) if there is no (null) map color.
                this.drawPixel((itemMapColor || 0x000000FF), dx, dy);
            }
        }
    };
    return OdysseyMiniMapRenderer;
}());