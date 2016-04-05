/*global extend, OdysseyEventDispatchInterface, OdysseyEventDispatcher*/
var OdysseyOverlayControl = (function () {
    "use strict";
    function OdysseyOverlayControl() {
        this.eventDispatcher = new OdysseyEventDispatcher();
    }
    extend(OdysseyOverlayControl.prototype, new OdysseyEventDispatchInterface());

    OdysseyOverlayControl.clearCanvas = function clearCanvas(cvs, xStart, yStart, width, height) {
        cvs.getContext('2d').clearRect(xStart, yStart, width, height);
    };

    OdysseyOverlayControl.unpaintAll = function unpaintAll() {
        var canvases = this.context.overlayCanvases, i, len = canvases.length;
        for (i = 0; i < len; i += 1) {
            OdysseyOverlayControl.clearCanvas(canvases[i], 0, 0, canvases[i].width, canvases[i].height);
        }
    };

    OdysseyOverlayControl.prototype.select = function select(pos) {
        var index = this.context.getCanvasSectionIndex(pos.x, pos.y), cvs, ctx;
        if (index !== -1) {
            cvs = this.context.overlayCanvases[index];
            ctx = cvs.getContext('2d');
            ctx.strokeStyle = "#35ff60";
            ctx.strokeRect(32 * (1 + (pos.x % this.context.sizeX)), 32 * (1 + (pos.y % this.context.sizeY)), 32, 32);
        }
    };

    OdysseyOverlayControl.prototype.unselect = function unselect(pos) {
        var index = this.context.getCanvasSectionIndex(pos.x, pos.y), cvs;
        if (index !== -1) {
            cvs = this.context.overlayCanvases[index];
            OdysseyOverlayControl.clearCanvas(cvs, 32 * (1 + (pos.x % this.context.sizeX)), 32 * (1 + (pos.y % this.context.sizeY)), 32, 32);
        }
    };

    OdysseyOverlayControl.prototype.setContext = function (Odyssey) {
        this.context = Odyssey;
    };

    OdysseyOverlayControl.prototype.update = function () {
        // TODO. Need access to position.
    };

    return OdysseyOverlayControl;
}());
