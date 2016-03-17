    /*jslint browser: true, devel:true */
/*globals jQuery, Odyssey, OdysseyWorldMap, OdysseyMapSearch, OdysseyEventDispatchInterface*/
(function (map, worldmap, $) {
    "use strict";
    var $body = $(document.body),
        $inputs = $("input"),
        requestAnimationFrame = window.requestAnimationFrame;
    /**
     * @constructor
     */
    function OdysseyController() {
        this.context = null;
    }
    OdysseyController.prototype = new OdysseyEventDispatchInterface();

    // Keys that affect map position.
    /** @const */
    OdysseyController.KEYCODE_ARROW_DOWN = 40;
    /** @const */
    OdysseyController.KEYCODE_ARROW_LEFT = 37;
    /** @const */
    OdysseyController.KEYCODE_ARROW_UP = 38;
    /** @const */
    OdysseyController.KEYCODE_ARROW_RIGHT = 39;
    /** @const */
    OdysseyController.KEYCODE_PAGE_UP = 33;
    /** @const */
    OdysseyController.KEYCODE_PAGE_DOWN = 34;

    // Keys that affect movement speed.
    /** @const */
    OdysseyController.CTRL_MULTIPLIER = 10;
    /** @const */
    OdysseyController.NOCTRL_MULTIPLIER = 1;

    OdysseyController.prototype.setContext = function (ctx) {
        this.context = ctx;
    };

    function handleMapShiftControls(e) {
        var position = map.getPosition(),
            ctrlModifier = e.ctrlKey ? OdysseyController.CTRL_MULTIPLIER : OdysseyController.NOCTRL_MULTIPLIER,
            hasChanged = false;
        // Down.
        if (e.keyCode === OdysseyController.KEYCODE_ARROW_DOWN) {
            e.preventDefault();
            hasChanged = true;
            map.setPosition(position.x, position.y + ctrlModifier, position.z);
        }

        // Left.
        if (e.keyCode === OdysseyController.KEYCODE_ARROW_LEFT) {
            e.preventDefault();
            hasChanged = true;
            map.setPosition(position.x + (-1) * ctrlModifier, position.y, position.z);
        }

        // Up.
        if (e.keyCode === OdysseyController.KEYCODE_ARROW_UP) {
            e.preventDefault();
            hasChanged = true;
            map.setPosition(position.x, position.y + (-1) * ctrlModifier, position.z);
        }

        // Right.
        if (e.keyCode === OdysseyController.KEYCODE_ARROW_RIGHT) {
            e.preventDefault();
            hasChanged = true;
            map.setPosition(position.x + ctrlModifier, position.y, position.z);
        }

        // Down a floor.
        if (e.keyCode === OdysseyController.KEYCODE_PAGE_DOWN) {
            // Top floor is 0, so controls are reversed (PgDn = +z)
            e.preventDefault();
            // Test if the current position is legal.
            if (0 <= position.z && position.z <= 15) {
                // Don't advance if Z = max Z.
                if (position.z < 15) {
                    hasChanged = true;
                    map.setPosition(position.x, position.y, position.z + 1);
                }
            } else {
                // Set the floor to the default of 7.
                hasChanged = true;
                map.setPosition(position.x, position.y, 7);
            }
        }

        // Up a floor.
        if (e.keyCode === OdysseyController.KEYCODE_PAGE_UP) {
            e.preventDefault();
            if (0 <= position.z && position.z <= 15) {
                if (position.z > 0) {
                    hasChanged = true;
                    map.setPosition(position.x, position.y, position.z + (-1));
                }
            } else {
                // Set the floor to the default of 7.
                hasChanged = true;
                map.setPosition(position.x, position.y, 7);
            }
        }
        if (hasChanged) {
            worldmap.setMapPosition(position);
        }
        // Do not return false. It will prevent event bubbling
        // i.e. it will disable other controls and browser behaviors.
        //return false;
    }

    /**
     * Handles keydown events for input fields. Prevents event propagation
     * to ensure other controls do not respond to this event.
     */
    function inputPreventPropagation(e) {
        e.stopPropagation();
    }

    // DOM event listeners.
    $body.keydown(handleMapShiftControls);
    $inputs.keydown(inputPreventPropagation);
    // Search
    $("#OdysseySearchSubmit").click(function () {
        var search = new OdysseyMapSearch(), $results, $positions, $criteria, i = 0;
        $results = $("#OdysseySearchResultsContainer li");
        $positions = $("#OdysseySearchResultsContainer li .search-position");
        $criteria = $("#OdysseySearchResultsContainer li .search-criteria");
        search.send(map.maps);
        $results.removeClass('active').addClass('inactive');
        search.find({
            items: [
                parseInt($("#OdysseySearchItemID").val(), 10)
            ],
            onfind: function (e) {
                var result = e.result;
                $($results[i]).removeClass('inactive').addClass('active');
                $($criteria[i]).text(result.items.join(", "));
                $($positions[i]).text(result.position.x + ", " + result.position.y + ", " + result.position.z);
                i += 1;
            },
            oncomplete: function (e) {
                // Completed search.
            }
        });
    });

    (function () {
        // Handle WorldMap mouse drag.
        var mousedownActive = false;
        /**
         * Shifts the viewport based on the event arguments.
         * @param e the event arguments.
         */
        function handleViewportShiftEvent(e) {
            var offset = $(worldmap.getMapContainerElement()).offset();
            // Catch unexpected values.
            if ((e.pageX - offset.left) < 0) {
                return false;
            }
            if ((e.pageY - offset.top) < 0) {
                return false;
            }

            // Set the relative minimap position based on the mouse position.
            worldmap.setMapPosition({
                x: OdysseyWorldMap.MIN_POSITION_X + (e.pageX - offset.left) / worldmap.mapZoom,
                y: OdysseyWorldMap.MIN_POSITION_Y + (e.pageY - offset.top) / worldmap.mapZoom,
                z: worldmap.mapPosition.z
            });
        }
        // Handle mouse up / down for WorldMap state.
        // Mouse up on document to catch movements over the bounds of the viewport.
        function handleDocumentMouseUpEvent() {
            mousedownActive = false;
        }

        // Mouse down on viewport.
        function handleViewportMouseDownEvent() {
            mousedownActive = true;
            // Prevent drag selection.
            return false;
        }

        // Handle desktop mouse move.
        function handleViewportMouseMoveEvent(e) {
            // If the mouse is down, handle the viewport and active area movement.
            if (mousedownActive) {
                handleViewportShiftEvent(e);
            }
        }

        // Handle mobile touch move.
        function handleViewportTouchMoveEvent(e) {
            handleViewportShiftEvent(e.originalEvent.targetTouches[0]);
        }

        // Attach event listeners.
        $("body").mouseup(handleDocumentMouseUpEvent);
        $(worldmap.getMapViewportElement()).mousedown(handleViewportMouseDownEvent);
        $(worldmap.getMapViewportElement()).mousemove(handleViewportMouseMoveEvent);
        $(worldmap.getMapViewportElement()).on('touch', handleViewportTouchMoveEvent);
        // WorldMap event listeners.
        worldmap.addEventListener('OdysseyWorldMapClose', function () {
            // Update the map position to reflect the WorldMap position.
            var pos = worldmap.getMapPosition();
            map.setPosition(pos.x, pos.y, pos.z);
        });
    }());

    return OdysseyController;
}(Odyssey.getMapRenderer(), Odyssey.getWorldMap(), jQuery));
