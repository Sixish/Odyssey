/*jslint browser: true, devel:true */
/*globals jQuery, extend, Odyssey, OdysseyWorldMap, OdysseyMapSearch, OdysseyEventDispatchInterface*/
// TODO move from Controls.js to more specialized classes.
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
    extend(OdysseyController.prototype, new OdysseyEventDispatchInterface());

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

    /**
     * Handles the keyboard controls of map position shifting.
     * @param {Object} e the keyboard event.
     */
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
     * @param {Object} e the event that fired on the input.
     */
    function inputPreventPropagation(e) {
        e.stopPropagation();
    }

    // DOM event listeners.
    $body.keydown(handleMapShiftControls);
    $inputs.keydown(inputPreventPropagation);
}(Odyssey.getMapRenderer(), Odyssey.getWorldMap(), jQuery));
