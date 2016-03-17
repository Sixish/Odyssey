/*global OdysseyEventDispatchInterface, OdysseyEventDispatcher*/
var OdysseyOverlay = (function () {
    "use strict";
    function OdysseyOverlay() {
        this.eventDispatcher = new OdysseyEventDispatcher();
    }
    OdysseyOverlay.prototype = new OdysseyEventDispatchInterface();

    OdysseyOverlay.clearCanvas = function clearCanvas(cvs, xStart, yStart, width, height) {
        cvs.getContext('2d').clearRect(xStart, yStart, width, height);
    };

    OdysseyOverlay.unpaintAll = function unpaintAll() {
        var canvases = this.context.overlayCanvases, i, len = canvases.length;
        for (i = 0; i < len; i += 1) {
            OdysseyOverlay.clearCanvas(canvases[i], 0, 0, canvases[i].width, canvases[i].height);
        }
    };

    OdysseyOverlay.prototype.select = function select(pos) {
        var index = this.context.getCanvasSectionIndex(pos.x, pos.y), cvs, ctx;
        if (index !== -1) {
            cvs = this.context.overlayCanvases[index];
            ctx = cvs.getContext('2d');
            ctx.strokeStyle = "#35ff60";
            ctx.strokeRect(32 * (1 + (pos.x % this.context.sizeX)), 32 * (1 + (pos.y % this.context.sizeY)), 32, 32);
        }
    };

    OdysseyOverlay.prototype.unselect = function unselect(pos) {
        var index = this.context.getCanvasSectionIndex(pos.x, pos.y), cvs;
        if (index !== -1) {
            cvs = this.context.overlayCanvases[index];
            OdysseyOverlay.clearCanvas(cvs, 32 * (1 + (pos.x % this.context.sizeX)), 32 * (1 + (pos.y % this.context.sizeY)), 32, 32);
        }
    };

    OdysseyOverlay.prototype.setContext = function (Odyssey) {
        this.context = Odyssey;
    };

    OdysseyOverlay.prototype.update = function (model) {
        // TODO. Need access to position.
    };

    return OdysseyOverlay;
}());
