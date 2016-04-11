/* OdysseyCanvasSection.js
 * Handles Canvas sections.
 * OdysseyTileMap uses nine canvas sections of size 3x3.
 */
goog.provide('Odyssey.View.CanvasSection');
Odyssey.View.CanvasSection = (function () {
    "use strict";
    /**
     * Creates a new OdysseyCanvasSection.
     * @constructor
     */
    function OdysseyCanvasSection() {
        this.x = null;
        this.y = null;
        this.z = null;
    }
    return OdysseyCanvasSection;
}());
