/*jslint browser:true*/
/*globals jQuery*/
(function ($) {
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
        // "Close" link.
        $mmClose = $("#OdysseyMinimapCloseLink"),
        // Margin of the map container, i.e. map offset.
        mmContainerMarginLeft = parseInt($mmContainer.css('marginLeft').replace('px', ''), 10) || 0,
        mmContainerMarginTop = parseInt($mmContainer.css('marginTop').replace('px', ''), 10) || 0,
        // Radius of the focus area.
        radiusFocusArea = parseInt($mmFocusArea.css('fontSize').replace('px', ''), 10) || 0;

    function getMapPositionX() {
        return (MIN_X + mmPosX);
    }

    function getMapPositionY() {
        return (MIN_Y + mmPosY);
    }

    function getMapPositionZ() {
        return (mmPosZ);
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

    function handleViewportMouseMoveEvent(e) {
        var offset = $mmContainer.offset();
        // Catch unexpected values.
        if ((e.pageX - offset.left) < 0) {
            return false;
        }
        if ((e.pageY - offset.top) < 0) {
            return false;
        }

        // Set the relative minimap position based on the mouse position.
        mmPosX = (e.pageX - offset.left) / mmZoom;
        mmPosY = (e.pageY - offset.top) / mmZoom;

        // If the mouse is down, handle the active area movement.
        if (mouseIsDown) {
            handleControlMapShift();
        }
    }

    function handleMinimapClickEvent() {
        $("#OdysseyLargeMinimap")
            .removeClass("inactive")
            .addClass("active");
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
    $mmViewport.click(handleControlMapShift);
    $mmContainer.dblclick(function () {
        toggleZoomLevel(+1);
    });
    $mmSmallMinimap.click(handleMinimapClickEvent);
    $mmClose.click(function () {
        $("#OdysseyLargeMinimap")
            .removeClass("active")
            .addClass("inactive");
    });

    return {
        'toggleZoomLevel': toggleZoomLevel,
        'setFloor': setFloor
    };
}(jQuery));