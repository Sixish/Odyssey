// jscs:disable
///*global jQuery, document*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.Event');
goog.provide('Odyssey.View.Zoom');
Odyssey.View.Zoom = (function ($) {
    "use strict";
    var $body = $(document.body),
        $viewport = $("#map-viewport"),
        KEYCODE_PLUS = 107,
        KEYCODE_MINUS = 109,
        KEYCODE_CTRL_PLUS = 61,
        KEYCODE_CTRL_MINUS = 173,
        zoomLevels = [ "025", "050", "100", "200", "400" ],
        zoomLevelValues = [ 0.25, 0.5, 1, 2, 4 ],
        minZoomLevel = 0,
        maxZoomLevel = zoomLevels.length - 1,
        defaultZoomLevel = Math.floor((zoomLevels.length - 1) / 2),
        onZoomListeners = [];

    function OdysseyZoomEvent(zoom) {
        this.zoom = zoom;
    }
    extend(OdysseyZoomEvent.prototype, new Odyssey.Events.Event('OdysseyZoom'));

    function fireZoomEvent(e) {
        var i, len = onZoomListeners.length;
        for (i = 0; i < len; i += 1) {
            onZoomListeners[i](e);
        }
    }

    function OdysseyZoom() {
        var ctx = this;
        this.zoomLevel = defaultZoomLevel;

        function handleMapZoom(e) {
            // Only handle (-, CTRL -, +, CTRL +).
            if (e.shiftKey || e.metaKey || e.altKey) {
                return;
            }

            if ((e.ctrlKey && e.keyCode === KEYCODE_CTRL_MINUS) || (!e.ctrl && e.keyCode === KEYCODE_MINUS)) {
                ctx.zoom(-1);
                return;
            }

            if ((e.ctrlKey && e.keyCode === KEYCODE_CTRL_PLUS) || (!e.ctrl && e.keyCode === KEYCODE_PLUS)) {
                ctx.zoom(+1);
                return;
            }
        }
        $body.keydown(handleMapZoom);
    }

    OdysseyZoom.prototype.zoom = function zoom(diff) {
        $viewport.removeClass("zoom-" + zoomLevels[this.zoomLevel]);
        this.zoomLevel += diff;
        if (this.zoomLevel < 0) {
            this.zoomLevel = defaultZoomLevel;
        }
        if (this.zoomLevel > maxZoomLevel) {
            this.zoomLevel = defaultZoomLevel;
        }
        $viewport.addClass("zoom-" + zoomLevels[this.zoomLevel]);
        fireZoomEvent(new OdysseyZoomEvent(zoomLevelValues[this.zoomLevel]));
    };

    OdysseyZoom.prototype.onZoom = function (fn) {
        if (typeof fn !== "function") {
            throw new Error("Cannot add non-function to onZoom listeners.");
        }
        onZoomListeners.push(fn);
    };
    return OdysseyZoom;
}(jQuery));
