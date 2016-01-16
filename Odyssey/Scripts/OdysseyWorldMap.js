/*jslint browser:true*/
/*globals jQuery*/
var WorldMap = (function ($) {
    "use strict";
    var // Minimap position relative to map image.
        mmPosX = -1,
        mmPosY = -1,
        // Active floor map image.
        mmPosZ = 7,
        // Minimap zoom factor.
        mmZoom = 1,
        // Start XY point of the images.
        MIN_X = (124 * 256),
        MIN_Y = (121 * 256),
        // Size of the images.
        SIZE_X = 2049,
        SIZE_Y = 2305,
        // How big to shift maps when moving.
        MAP_MOVE_INTERVAL = 127,
        // Minimum, maximum and default zoom levels.
        MIN_ZOOM = 1,
        MAX_ZOOM = 5,
        DEFAULT_ZOOM_VALUE = 1,
        // Whether or not the mouse is down.
        mouseIsDown = false,
        // Parent viewport.
        $mmViewport = $("#OdysseyMinimapViewport"),
        // Map container.
        $mmContainer = $("#OdysseyMinimapContainer"),
        // Map images.
        $mmContainerMaps = $("#OdysseyMinimapContainer > img"),
        // Focus area.
        $mmFocusArea = $("#OdysseyMinimapActive"),
        // Document body.
        $body = $(document.body),
        // Small Minimap.
        $mmSmallMinimap = $("#OdysseyMiniMap"),
        // Open/close links.
        $mmOpen = $("#OdysseyOpenMinimap"),
        $mmClose = $("#OdysseyMinimapCloseLink"),
        // Large minimap display (static images).
        $mmMinimapLarge = $("#OdysseyLargeMinimap"),
        // Whether or not the large minimap is visible.
        visible = false,
        // Margin of the map container, i.e. map offset.
        mmContainerMarginLeft = parseInt($mmContainer.css('marginLeft').replace('px', ''), 10) || 0,
        mmContainerMarginTop = parseInt($mmContainer.css('marginTop').replace('px', ''), 10) || 0,
        // Radius of the focus area.
        radiusFocusArea = parseInt($mmFocusArea.css('fontSize').replace('px', ''), 10) || 0,
        mapPosition = {
            x: null,
            y: null,
            z: null
        };

    function getMapPosition() {
        return mapPosition;
    }

    function setMapPosition(position) {
        mapPosition.x = position.x;
        mapPosition.y = position.y;
        mapPosition.z = position.z;
    }

    function handleControlMapShift() {
        var // Static width and height of the viewport.
            mmViewportWidth = $mmViewport.width(),
            mmViewportHeight = $mmViewport.height();

        // X.
        while (((radiusFocusArea / 2) - (mmContainerMarginLeft) >= (mmPosX * mmZoom))) {
            mmContainerMarginLeft += MAP_MOVE_INTERVAL;
        }
        while ((((mmViewportWidth - mmContainerMarginLeft - (radiusFocusArea / 2))) <= (mmPosX * mmZoom)) && ((mmViewportWidth - (SIZE_X * mmZoom)) < mmContainerMarginLeft)) {
            mmContainerMarginLeft -= MAP_MOVE_INTERVAL;
        }
        // Y.
        while (((radiusFocusArea / 2) - (mmContainerMarginTop) >= (mmPosY * mmZoom))) {
            mmContainerMarginTop += MAP_MOVE_INTERVAL;
        }
        while ((((mmViewportHeight - mmContainerMarginTop - (radiusFocusArea / 2))) <= (mmPosY * mmZoom)) &&  ((mmViewportHeight - (SIZE_Y * mmZoom)) < mmContainerMarginTop)) {
            mmContainerMarginTop -= MAP_MOVE_INTERVAL;
        }

        // Focus area CSS.
        $mmFocusArea.css({
            'left': mmZoom * mmPosX + 'px',
            'top': mmZoom * mmPosY + 'px'
        });

        // Container CSS updates.
        $mmContainer.css({
            'left': mmContainerMarginLeft + 'px',
            'top': mmContainerMarginTop + 'px'
        });
    }

    function zoom(n) {
        // Set the zoom value.
        mmZoom = n;
        // Update the map image sizes.
        $mmContainerMaps
            .attr('width', Math.floor(SIZE_X * n))
            .attr('height', Math.floor(SIZE_Y * n));
        // Handle the map control elements.
        handleControlMapShift();
    }

    function setFloor(z) {
        $($mmContainerMaps[mmPosZ]).removeClass("active").addClass("inactive");
        $($mmContainerMaps[z]).removeClass("inactive").addClass("active");
    }

    function handleDocumentMouseUpEvent() {
        mouseIsDown = false;
    }

    function handleViewportMouseDownEvent() {
        mouseIsDown = true;
        // Prevent drag selection.
        return false;
    }

    /**
     * Shifts the viewport based on the event arguments.
     * @param e the event arguments.
     */
    function handleViewportShiftEvent(e) {
        var offset = $mmContainer.offset();
        // Catch unexpected values.
        if ((e.pageX - offset.left) < 0) {
            return false;
        }
        if ((e.pageY - offset.top) < 0) {
            return false;
        }

        // Set the relative minimap position based on the mouse position.
        mapPosition.x = mmPosX = (e.pageX - offset.left) / mmZoom;
        mapPosition.y = mmPosY = (e.pageY - offset.top) / mmZoom;
    }

    // Handle desktop mouse move.
    function handleViewportMouseMoveEvent(e) {
        // If the mouse is down, handle the viewport and active area movement.
        if (mouseIsDown) {
            handleViewportShiftEvent(e);
            handleControlMapShift();
        }
    }

    // Handle mobile touch move.
    function handleViewportTouchMoveEvent(e) {
        handleViewportShiftEvent(e.originalEvent.targetTouches[0]);
        handleControlMapShift();
    }

    function toggleMinimap() {
        if (visible) {
            $body.removeClass('state-minimap-active');
        } else {
            $body.addClass('state-minimap-active');
        }
        visible = !visible;
    }

    function handleMinimapClickEvent() {
        toggleMinimap();
    }

    function toggleZoomLevel(sgn) {
        var newZoom;
        // New zoom value is either default, +1, or -1.
        if (sgn === 0) {
            newZoom = DEFAULT_ZOOM_VALUE;
        } else if (sgn < 0) {
            newZoom = mmZoom - 1;
        } else {
            newZoom = mmZoom + 1;
        }

        // Ensure the new zoom level is within the bounds.
        while (newZoom > MAX_ZOOM) {
            newZoom -= MAX_ZOOM;
        }
        while (newZoom < MIN_ZOOM) {
            newZoom += MIN_ZOOM;
        }
        zoom(newZoom);
    }

    // Attach listeners.
    $body.mouseup(handleDocumentMouseUpEvent);
    $mmViewport.mousedown(handleViewportMouseDownEvent);
    $mmViewport.mousemove(handleViewportMouseMoveEvent);
    $mmViewport.on('touchmove', handleViewportTouchMoveEvent);
    $mmViewport.click(handleControlMapShift);
    $mmContainer.dblclick(function () {
        toggleZoomLevel(+1);
    });
    $mmSmallMinimap.click(handleMinimapClickEvent);
    // Open/close.
    $mmOpen.click(toggleMinimap);
    $mmClose.click(toggleMinimap);

    return {
        'toggleZoomLevel': toggleZoomLevel,
        'setFloor': setFloor,
        'toggleMinimap': toggleMinimap,
        'getMapPosition': getMapPosition,
        'setMapPosition': setMapPosition
    };
}(jQuery));