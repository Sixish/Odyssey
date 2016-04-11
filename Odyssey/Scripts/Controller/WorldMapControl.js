/*jslint browser: true*/
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.View.ViewAttributor');
goog.require('Odyssey.Model.ModelAttributor');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.WorldMapOpenLinkClickEvent');
goog.require('Odyssey.Events.WorldMapCloseLinkClickEvent');
goog.require('Odyssey.View.WorldMap');
goog.provide('Odyssey.Controller.WorldMapControl');
Odyssey.Controller.WorldMapControl = (function ($) {
    "use strict";
    function OdysseyWorldMapControl() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
        this.mouseIsDown = false;
    }
    extend(OdysseyWorldMapControl.prototype, new Odyssey.Events.EventDispatchInterface());
    extend(OdysseyWorldMapControl.prototype, new Odyssey.View.ViewAttributor());
    extend(OdysseyWorldMapControl.prototype, new Odyssey.Model.ModelAttributor());

    OdysseyWorldMapControl.prototype.processShowClick = function () {
        this.getView().getWorldMap().show();
    };

    OdysseyWorldMapControl.prototype.processHideClick = function () {
        this.getView().getWorldMap().hide();
    };

    OdysseyWorldMapControl.prototype.setPosition = function (x, y, z) {
        this.getView().getWorldMap().setMapPosition(x, y, z);
    };

    OdysseyWorldMapControl.prototype.initialize = function () {
        var ctx = this;
        $("#OdysseyOpenMinimap").click(function () {
            ctx.dispatchEvent(new Odyssey.Events.WorldMapOpenLinkClickEvent(), ctx.processShowClick);
            // Stop propagation.
            return false;
        });

        $("#OdysseyMinimapCloseLink").click(function (e) {
            ctx.dispatchEvent(new Odyssey.Events.WorldMapCloseLinkClickEvent(), ctx.processHideClick);
            // Stop propagation.
            return false;
        });

        /**
         * Shifts the viewport based on the event arguments.
         * @param {Object} e the event arguments.
         */
        function handleViewportShiftEvent(e) {
            var wm = ctx.getView().getWorldMap(), offset = $(wm.getMapContainerElement()).offset();
            // Catch unexpected values.
            if ((e.pageX - offset.left) < 0) {
                return false;
            }
            if ((e.pageY - offset.top) < 0) {
                return false;
            }

            // Set the relative minimap position based on the mouse position.
            wm.setMapPosition({
                x: Odyssey.View.WorldMap.MIN_POSITION_X + (e.pageX - offset.left) / wm.mapZoom,
                y: Odyssey.View.WorldMap.MIN_POSITION_Y + (e.pageY - offset.top) / wm.mapZoom,
                z: wm.mapPosition.z
            });
        }

        /**
         * Handles mouse movements for desktop users.
         * @param {Object} e the mouse movement event.
         */
        function handleViewportMouseMoveEvent(e) {
            // If the mouse is down, handle the viewport and active area movement.
            if (ctx.mouseIsDown) {
                handleViewportShiftEvent(e);
            }
        }

        /**
         * Handles the document mouse up event for the WorldMap state.
         * Applied to the document to catch movements over the bounds of the viewport.
         */
        function handleDocumentMouseUpEvent() {
            ctx.mouseIsDown = false;
        }

        /**
         * Handles the viewport mouse down event for the WorldMap state.
         * @returns {Boolean} false to prevent event propagation (e.g. drag selection).
         */
        function handleViewportMouseDownEvent() {
            ctx.mouseIsDown = true;
            // Prevent drag selection.
            return false;
        }

        /**
         * Handles touch movements for mobile users.
         * @param {Object} e the touch mvement event.
         */
        function handleViewportTouchMoveEvent(e) {
            handleViewportShiftEvent(e.originalEvent.targetTouches[0]);
        }

		// DOM events.
		$(document.body).mouseup(handleDocumentMouseUpEvent);
		$(this.getView().getWorldMap().getMapViewportElement()).mousedown(handleViewportMouseDownEvent);
		$(this.getView().getWorldMap().getMapViewportElement()).mousemove(handleViewportMouseMoveEvent);
		$(this.getView().getWorldMap().getMapViewportElement()).on('touch', handleViewportTouchMoveEvent);
		this.getView().getWorldMap().addEventListener('OdysseyWorldMapClose', function () {
			// Update the map position to reflect the WorldMap position.
			var pos = this.getView().getWorldMap().getMapPosition();
			this.getView().getTileMap().setPosition(pos.x, pos.y, pos.z);
		});
    };

    return OdysseyWorldMapControl;
}(jQuery));
