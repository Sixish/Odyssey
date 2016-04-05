/*jslint browser: true, devel:true */
/*globals jQuery, extend, OdysseyEventDispatcher, OdysseyViewAttributor, OdysseyModelAttributor, OdysseyWorldMap, OdysseyMapSearch, OdysseyEventDispatchInterface*/
// TODO move from Controls.js to more specialized classes.
var OdysseyNavigationControl = (function ($) {
    "use strict";
    /**
     * @constructor
     */
    function OdysseyNavigationControl() {
        this.eventDispatcher = new OdysseyEventDispatcher();
        this.context = null;
    }
    extend(OdysseyNavigationControl.prototype, new OdysseyEventDispatchInterface());
    extend(OdysseyNavigationControl.prototype, new OdysseyViewAttributor());
    extend(OdysseyNavigationControl.prototype, new OdysseyModelAttributor());

    // Keys that affect map position.
    /** @const */
    OdysseyNavigationControl.KEYCODE_ARROW_DOWN = 40;
    /** @const */
    OdysseyNavigationControl.KEYCODE_ARROW_LEFT = 37;
    /** @const */
    OdysseyNavigationControl.KEYCODE_ARROW_UP = 38;
    /** @const */
    OdysseyNavigationControl.KEYCODE_ARROW_RIGHT = 39;
    /** @const */
    OdysseyNavigationControl.KEYCODE_PAGE_UP = 33;
    /** @const */
    OdysseyNavigationControl.KEYCODE_PAGE_DOWN = 34;

    // Keys that affect movement speed.
    /** @const */
    OdysseyNavigationControl.CTRL_MULTIPLIER = 10;
    /** @const */
    OdysseyNavigationControl.NOCTRL_MULTIPLIER = 1;

    /**
     * Handles the keyboard controls of map position shifting.
     * @param {Object} e the keyboard event.
     */
    OdysseyNavigationControl.prototype.handleMapShiftControls = function handleMapShiftControls(e) {
        var tileMap = this.getView().getTileMap(),
            worldMap = this.getView().getWorldMap(),
            position = tileMap.getPosition(),
            ctrlModifier = e.ctrlKey ? OdysseyNavigationControl.CTRL_MULTIPLIER : OdysseyNavigationControl.NOCTRL_MULTIPLIER,
            hasChanged = false;
        // Down.
        if (e.keyCode === OdysseyNavigationControl.KEYCODE_ARROW_DOWN) {
            e.preventDefault();
            hasChanged = true;
            tileMap.setPosition(position.x, position.y + ctrlModifier, position.z);
        }

        // Left.
        if (e.keyCode === OdysseyNavigationControl.KEYCODE_ARROW_LEFT) {
            e.preventDefault();
            hasChanged = true;
            tileMap.setPosition(position.x + (-1) * ctrlModifier, position.y, position.z);
        }

        // Up.
        if (e.keyCode === OdysseyNavigationControl.KEYCODE_ARROW_UP) {
            e.preventDefault();
            hasChanged = true;
            tileMap.setPosition(position.x, position.y + (-1) * ctrlModifier, position.z);
        }

        // Right.
        if (e.keyCode === OdysseyNavigationControl.KEYCODE_ARROW_RIGHT) {
            e.preventDefault();
            hasChanged = true;
            tileMap.setPosition(position.x + ctrlModifier, position.y, position.z);
        }

        // Down a floor.
        if (e.keyCode === OdysseyNavigationControl.KEYCODE_PAGE_DOWN) {
            // Top floor is 0, so controls are reversed (PgDn = +z)
            e.preventDefault();
            // Test if the current position is legal.
            if (0 <= position.z && position.z <= 15) {
                // Don't advance if Z = max Z.
                if (position.z < 15) {
                    hasChanged = true;
                    tileMap.setPosition(position.x, position.y, position.z + 1);
                }
            } else {
                // Set the floor to the default of 7.
                hasChanged = true;
                tileMap.setPosition(position.x, position.y, 7);
            }
        }

        // Up a floor.
        if (e.keyCode === OdysseyNavigationControl.KEYCODE_PAGE_UP) {
            e.preventDefault();
            if (0 <= position.z && position.z <= 15) {
                if (position.z > 0) {
                    hasChanged = true;
                    tileMap.setPosition(position.x, position.y, position.z + (-1));
                }
            } else {
                // Set the floor to the default of 7.
                hasChanged = true;
                tileMap.setPosition(position.x, position.y, 7);
            }
        }
        if (hasChanged && worldMap) {
            worldMap.setMapPosition(position);
        }
        // Do not return false. It will prevent event bubbling
        // i.e. it will disable other controls and browser behaviors.
        //return false;
    };

    /**
     * Handles keydown events for input fields. Prevents event propagation
     * to ensure other controls do not respond to this event.
     * @param {Object} e the event that fired on the input.
     */
    OdysseyNavigationControl.prototype.inputPreventPropagation = function inputPreventPropagation(e) {
        e.stopPropagation();
    };

    OdysseyNavigationControl.prototype.initialize = function () {
        var ctx = this,
            $body = $(document.body),
            $inputs = $("input");
        // DOM event listeners.
        $body.keydown(function (e) {
            ctx.handleMapShiftControls(e);
        });
        $inputs.keydown(function (e) {
            ctx.inputPreventPropagation(e);
        });
    };

    return OdysseyNavigationControl;
}(jQuery));
