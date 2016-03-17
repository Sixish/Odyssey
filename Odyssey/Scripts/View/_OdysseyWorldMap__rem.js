// jscs:disable
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
    $mmViewport.click(updateWorldMap);
    $mmContainer.dblclick(function () {
        toggleZoomLevel(+1);
    });
    $mmSmallMinimap.click(handleMinimapClickEvent);
    // Open/close.
    $mmOpen.click(toggleMinimap);
    $mmClose.click(toggleMinimap);
