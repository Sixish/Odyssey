/*jslint browser: true, devel:true */
/*globals jQuery*/
(function (map, worldmap, $) {
    "use strict";
    var // Keys that change map position.
        KEYCODE_ARROW_DOWN  = 40,
        KEYCODE_ARROW_LEFT  = 37,
        KEYCODE_ARROW_UP    = 38,
        KEYCODE_ARROW_RIGHT = 39,
        KEYCODE_PAGE_UP     = 33,
        KEYCODE_PAGE_DOWN   = 34,
        // Keys that affect movement speed.
        CTRL_MULTIPLIER     = 10,
        NOCTRL_MULTIPLIER   = 1,
        // Current map position.
        center = map.position,
        // How many tiles are in focus?
        focusedCount = 0,
        // Map - which tiles are currently focused?
        focused = {},
        // Which tiles currently have the .active-tile class?
        cssFocused = {},
        gridElements = [],
        requestAnimationFrame = window.requestAnimationFrame;

    // Utility
    // Create nested objects
    function createObjectNesting(obj) {
        var i, len, p, cObj = obj;
        for (i = 1, len = arguments.length; i < len; i += 1) {
            p = arguments[i];
            if (cObj[p] === undefined) {
                cObj[p] = {};
            }
            cObj = cObj[p];
        }
    }

    function toggleFocus(e) {
        var x = e.target.getAttribute("data-grid-x"),
            y = e.target.getAttribute("data-grid-y"),
            z = map.position.z,
            currFocused;
        // Ensure focused[x][y] is defined
        createObjectNesting(focused, x, y);
        currFocused = (focused[x][y][z] || false);
        focused[x][y][z] = !currFocused;
        if (currFocused) {
            focusedCount -= 1;
        } else {
            focusedCount += 1;
        }
    }
    function isFocused(x, y, z) {
        return ((focused[x] && focused[x][y] && focused[x][y][z]) || false);
    }
    function toggleFocused(x, y, z) {
        var currFocused;
        createObjectNesting(focused, x, y);
        currFocused = (focused[x][y][z] || false);
        focused[x][y][z] = !currFocused;
        focusedCount += (currFocused ? -1 : 1);
    }
    function setFocused(x, y, z) {
        createObjectNesting(focused, x, y);
        if (!focused[x][y][z]) {
            toggleFocused(x, y, z);
        }
    }
    function hasFocusedClass(x, y, z) {
        return ((cssFocused[x] && cssFocused[x][y]) || false);
    }
    function toggleFocusedClass(x, y, z) {
        var isFocused = hasFocusedClass(x, y, z);
        createObjectNesting(cssFocused, x);
        if (isFocused) {
            gridElements[x][y].className = "";
            cssFocused[x][y] = false;
        } else {
            gridElements[x][y].className = "active-tile";
            cssFocused[x][y] = true;
        }
    }
    function unfocusAll() {
        var x, y, z;
        // brace yourself the messy loop is coming
        focused = {};
        focusedCount = 0;
    }
    function updateFocusedClass() {
        var x, y, z, cx, cy, cz;
        cx = center.x;
        cy = center.y;
        cz = center.z;
        for (x = -map.origin.x; x <= map.origin.x; x += 1) {
            for (y = -map.origin.y; y <= map.origin.y; y += 1) {
                for (z = 0; z < 1; z += 1) {
                    if (isFocused(cx + x, cy + y, cz + z) !== hasFocusedClass(x, y, z)) {
                        toggleFocusedClass(x, y, z);
                    }
                }
            }
        }
        requestAnimationFrame(updateFocusedClass);
    }
    function setGridElements() {
        var children = document.getElementById("map-grid").children, i, len, x, y, c;
        for (i = 0, len = children.length; i < len; i += 1) {
            // TODO CHECK NODE TYPE
            c = children[i];
            x = c.getAttribute("data-grid-x");
            y = c.getAttribute("data-grid-y");
            console.assert(x !== null && y !== null, "Grid values are null.");
            createObjectNesting(gridElements, x);
            gridElements[x][y] = c;
        }
    }
    // Automatically set up the grid elements
    setGridElements();
    function setMousePosition(x, y, z) {
        var items = map.getTileItems(x, y, z), i, len, $ToolTipItems, ttLength;

        $ToolTipItems = $(".OdysseyToolTipItem");
        ttLength = $ToolTipItems.length;

        if (items === null || items === undefined) {
            items = [];
        }
        for (i = 0, len = items.length; i < len; i += 1) {
            $($ToolTipItems[i]).find(".OdysseyToolTipID").text(items[i].ID);
            $($ToolTipItems[i]).find(".OdysseyToolTipCount").text(items[i].Count);
            $($ToolTipItems[i]).show();
        }
        for (i; i < ttLength; i += 1) {
            $($ToolTipItems[i]).hide();
        }
    }

    function handleGridClick(e) {
        var element = e.target,
            x = element.getAttribute("data-grid-x"),
            y = element.getAttribute("data-grid-y");
        console.assert(x !== null && y !== null, "data-grid-* undefined.");
        if (!e.ctrlKey) {
            unfocusAll();
        }
        toggleFocused(center.x + Number(x), center.y + Number(y), center.z);
    }
    function handleGridOver(e) {
        var element = e.target,
            x = element.getAttribute("data-grid-x"),
            y = element.getAttribute("data-grid-y");
        console.assert(x !== null && y !== null, "data-grid-* undefined.");
        setMousePosition(center.x + Number(x), center.y + Number(y), center.z);
    }
    document.getElementById("map-grid").addEventListener("mousedown", handleGridClick);
    document.getElementById("map-grid").addEventListener("mouseover", handleGridOver);
    requestAnimationFrame(updateFocusedClass);
    //requestAnimationFrame(updateFocusedItems);
    function handleMapShiftControls(e) {
        var position = map.position,
            ctrlModifier = e.ctrlKey ? CTRL_MULTIPLIER : NOCTRL_MULTIPLIER,
            hasChanged = false;
        // Down.
        if (e.keyCode === KEYCODE_ARROW_DOWN) {
            e.preventDefault();
            hasChanged = true;
            position.shift(0, ctrlModifier, 0);
        }
        
        // Left.
        if (e.keyCode === KEYCODE_ARROW_LEFT) {
            e.preventDefault();
            hasChanged = true;
            position.shift(-1 * ctrlModifier, 0, 0);
        }
        
        // Up.
        if (e.keyCode === KEYCODE_ARROW_UP) {
            e.preventDefault();
            hasChanged = true;
            position.shift(0, -1 * ctrlModifier, 0);
        }
        
        if (e.keyCode === KEYCODE_ARROW_RIGHT) {
            e.preventDefault();
            hasChanged = true;
            position.shift(ctrlModifier, 0, 0);
        }
        
        // Down a floor.
        if (e.keyCode === KEYCODE_PAGE_DOWN) {
            // Top floor is 0, so controls are reversed (PgDn = +z)
            e.preventDefault();
            // Test if the current position is legal.
            if (0 <= position.z && position.z <= 15) {
                // Don't advance if Z = max Z.
                if (position.z < 15) {
                    hasChanged = true;
                    position.shift(0, 0, 1);
                }
            } else {
                // Set the floor to the default of 7.
                hasChanged = true;
                position.set(position.x, position.y, 7);
            }
        }
        
        // Up a floor.
        if (e.keyCode === KEYCODE_PAGE_UP) {
            e.preventDefault();
            if (0 <= position.z && position.z <= 15) {
                if (position.z > 0) {
                    hasChanged = true;
                    position.shift(0, 0, -1);
                }
            } else {
                // Set the floor to the default of 7.
                hasChanged = true;
                position.set(position.x, position.y, 7);
            }
        }
        if (hasChanged) {
            worldmap.setMapPosition(position);
        }
        return false;
    }
    $(document.body).keydown(handleMapShiftControls);
    // Update the map position to reflect the WorldMap position.
    worldmap.onClose(function () {
        var pos = worldmap.getMapPosition();
        map.position.set(pos.x, pos.y, pos.z);
    });
}(window.Odyssey, window.WorldMap, jQuery));
