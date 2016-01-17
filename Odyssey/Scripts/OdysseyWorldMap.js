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
        // Minimum, maximum and default zoom levels.
        MIN_ZOOM = 1,
        MAX_ZOOM = 5,
        DEFAULT_ZOOM_VALUE = 1,
        // Whether or not the mouse is down.
        mouseIsDown = false,
        // Viewport's container. This has a set width, while $mmViewport's varies.
        $mmViewportContainer = $("#OdysseyLargeMinimap"),
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
        // Whether or not the large minimap is visible.
        visible = false,
        mapPosition = {
            x: 33053,
            y: 31013,
            z: 7
        },
        events = {
            'onClose': {
                'listeners': []
            },
            'onOpen': {
                'listeners': []
            },
            'onToggle': {
                'listeners': []
            }
        };

    /**
     * Fires the event with the specified context and arguments.
     *
     * @param e the name of the event.
     * @param ctx the context (i.e. the value of 'this') in which to call the listeners.
     * @param args an array of arguments to pass to the listener.
     */
    function fire(e, ctx, args) {
        var event = events[e], listeners, i, len;
        if (!event) {
            return false;
        }
        // Listeners of the event.
        listeners = event.listeners;
        if (listeners && listeners.length) {
            for (i = 0, len = listeners.length; i < len; i += 1) {
                listeners[i].apply(ctx, args);
            }
            return true;
        }
        return false;
    }

    /**
     * Gets the position of the WorldMap.
     */
    function getMapPosition() {
        return mapPosition;
    }

    function handleControlMapShift() {
        var // Static width and height of the viewport.
            mmViewportWidth = $mmViewportContainer.width(),
            mmViewportHeight = $mmViewportContainer.height();

        // Focus area CSS.
        $mmFocusArea.css({
            'left': mmZoom * mmPosX + 'px',
            'top': mmZoom * mmPosY + 'px'
        });

        // Container CSS updates.
        $mmContainer.css({
            'left': -mmZoom * (mmPosX - mmViewportWidth / 2) + 'px',
            'top': -mmZoom * (mmPosY - mmViewportHeight / 2) + 'px'
        });
    }

    function setMapPosition(position) {
        mapPosition.x = Math.floor(position.x);
        mapPosition.y = Math.floor(position.y);
        mapPosition.z = Math.floor(position.z);
        // Update mmPosXYZ based on new mapPosition.
        mmPosX = mapPosition.x - MIN_X;
        mmPosY = mapPosition.y - MIN_Y;
        mmPosZ = mapPosition.z;
        handleControlMapShift();
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
        setMapPosition({
            x: MIN_X + (e.pageX - offset.left) / mmZoom,
            y: MIN_Y + (e.pageY - offset.top) / mmZoom,
            z: mapPosition.z
        });
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
        // Toggle the visibility.
        visible = !visible;
        // Adjust classes based on new value.
        // Fire the event corresponding to each state change.
        if (visible) {
            $body.addClass('state-minimap-active');
            fire('onOpen');
        } else {
            $body.removeClass('state-minimap-active');
            fire('onClose');
        }
        fire('onToggle');
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

    /**
     * Binds a function to the close event.
     *
     * @param fn the function to call when the WorldMap is closed.
     */
    function attachOnCloseListener(fn) {
        events.onClose.listeners.push(fn);
    }
    /**
     * Binds a function to the open event.
     *
     * @param fn the function to call when the WorldMap is opened.
     */
    function attachOnOpenListener(fn) {
        events.onOpen.listeners.push(fn);
    }

    /**
     * Binds a function to the toggle event.
     *
     * @param fn the function to call when the WorldMap is toggled.
     */
    function attachOnToggleListener(fn) {
        events.onToggle.listeners.push(fn);
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
        'setMapPosition': setMapPosition,
        // Events
        'onClose': attachOnCloseListener,
        'onOpen': attachOnOpenListener,
        'onToggle': attachOnToggleListener
    };
}(jQuery));