/*global extend, OdysseyEventDispatchInterface, OdysseyEventDispatcher, OdysseyDatLoadedEvent, jQuery*/
/* Dat.js
 * Loads Tibia.dat.json files.
 * Handles requests for item information.
 */
var Dat = (function ($) {
    "use strict";
    /**
     * Creates a Dat context containing Tibia item data.
     */
    function Dat() {
        this.eventDispatcher = new OdysseyEventDispatcher();
    }
    extend(Dat.prototype, new OdysseyEventDispatchInterface());
    /** @const */
    Dat.ATTRIBUTE_ID_GROUND          = 0;
    /** @const */
    Dat.ATTRIBUTE_ID_TOPORDER1       = 1;
    /** @const */
    Dat.ATTRIBUTE_ID_TOPORDER2       = 2;
    /** @const */
    Dat.ATTRIBUTE_ID_TOPORDER3       = 3;
    /** @const */
    Dat.ATTRIBUTE_ID_CONTAINER       = 4;
    /** @const */
    Dat.ATTRIBUTE_ID_STACKABLE       = 5;
    /** @const */
    Dat.ATTRIBUTE_ID_CORPSE          = 6;
    /** @const */
    Dat.ATTRIBUTE_ID_USABLE          = 7;
    /** @const */
    Dat.ATTRIBUTE_ID_WRITABLE        = 8;
    /** @const */
    Dat.ATTRIBUTE_ID_READABLE        = 9;
    /** @const */
    Dat.ATTRIBUTE_ID_FLUID           = 10;
    /** @const */
    Dat.ATTRIBUTE_ID_SPLASH          = 11;
    /** @const */
    Dat.ATTRIBUTE_ID_BLOCKING        = 12;
    /** @const */
    Dat.ATTRIBUTE_ID_IMMOBILE        = 13;
    /** @const */
    Dat.ATTRIBUTE_ID_BLOCKSMISSILE   = 14;
    /** @const */
    Dat.ATTRIBUTE_ID_BLOCKSPATH      = 15;
    /** @const */
    Dat.ATTRIBUTE_ID_BLOCKING2       = 16;
    /** @const */
    Dat.ATTRIBUTE_ID_PICKUPABLE      = 17;
    /** @const */
    Dat.ATTRIBUTE_ID_HANGABLE        = 18;
    /** @const */
    Dat.ATTRIBUTE_ID_HORIZONTAL      = 19;
    /** @const */
    Dat.ATTRIBUTE_ID_VERTICAL        = 20;
    /** @const */
    Dat.ATTRIBUTE_ID_ROTATABLE       = 21;
    /** @const */
    Dat.ATTRIBUTE_ID_LIGHT           = 22;
    /** @const */
    Dat.ATTRIBUTE_ID_UNKNOWN_17      = 23;
    /** @const */
    Dat.ATTRIBUTE_ID_FLOORCHANGE     = 24;
    /** @const */
    Dat.ATTRIBUTE_ID_OFFSET          = 25;
    /** @const */
    Dat.ATTRIBUTE_ID_HEIGHTED        = 26;
    /** @const */
    Dat.ATTRIBUTE_ID_BOTTOMLAYER     = 27;
    /** @const */
    Dat.ATTRIBUTE_ID_IDLEANIMATION   = 28;
    /** @const */
    Dat.ATTRIBUTE_ID_MINIMAP         = 29;
    /** @const */
    Dat.ATTRIBUTE_ID_ACTIONED        = 30;
    /** @const */
    Dat.ATTRIBUTE_ID_GROUNDITEM      = 31;
    /** @const */
    Dat.ATTRIBUTE_ID_LOOKTHROUGH     = 32;
    /** @const */
    Dat.ATTRIBUTE_ID_BODYRESTRICTION = 33;
    /** @const */
    Dat.ATTRIBUTE_ID_MARKETPROPS     = 34;
    /** @const */
    Dat.ATTRIBUTE_ID_UNKNOWN_1021_23 = 35;
    /** @const */
    Dat.ATTRIBUTE_ID_UNKNOWN_1021_FE = 254;
    /** @const */
    Dat.ATTRIBUTE_NAME_FRAMES        = 'a';
    /** @const */
    Dat.ATTRIBUTE_NAME_WIDTH         = 'w';
    /** @const */
    Dat.ATTRIBUTE_NAME_HEIGHT        = 'h';
    /** @const */
    Dat.ATTRIBUTE_NAME_BASE          = 'b';// ?
    /** @const */
    Dat.ATTRIBUTE_NAME_SIZEX         = 'x';
    /** @const */
    Dat.ATTRIBUTE_NAME_SIZEY         = 'y';
    /** @const */
    Dat.ATTRIBUTE_NAME_SIZEZ         = 'z';
    /** @const */
    Dat.ATTRIBUTE_NAME_SPRITES       = 'spr';
    /** Map color ID to RGBA @enum */
    Dat.Colors = {
        "0": 0x000000FF,
        "12": 0x006600FF,
        "24": 0x00CC00FF,
        "30": 0x00FF00FF,
        "40": 0x3300CCFF,
        "51": 0x3300ccFF,
        "86": 0x666666FF,
        "114": 0x993300FF,
        "121": 0x996633FF,
        "129": 0x999999FF,
        "179": 0xccffffFF,
        "186": 0xff3300FF,
        "192": 0xff6600FF,
        "207": 0xffcc99FF,
        "210": 0xffff00FF,
        "215": 0xffffffFF
    };

    /**
     * Whether or not the Dat has been loaded.
     */
    Dat.prototype.isLoaded = false;

    /**
     * Whether or not the Dat is loading.
     */
    Dat.prototype.isLoading = false;

    /**
     * Sets the Dat's data.
     * @param o The Tibia.dat data.
     */
    Dat.prototype.setData = function (o) {
        this.data = o;
    };

    /**
     * Sets the Dat's loaded state.
     * @param val Whether or not the Dat is loaded.
     */
    Dat.prototype.setLoaded = function (val) {
        this.isLoaded = val;
        this.dispatchEvent(new OdysseyDatLoadedEvent());
    };

    /**
     * Sets the Dat's loading state.
     * @param val Whether or not the Dat is loading.
     */
    Dat.prototype.setLoading = function (val) {
        this.isLoading = val;
    };

    /**
     * Gets the map color for the item with the corresponding item ID.
     * @param id the ID corresponding to the item.
     * @returns the map color corresponding to the item, or null if it has no map color.
     */
    Dat.prototype.getMapColor = function (id) {
        if (!this.data[0][id].hasOwnProperty(Dat.ATTRIBUTE_ID_MINIMAP)) {
            return null;
        }
        return Dat.Colors[this.data[0][id][Dat.ATTRIBUTE_ID_MINIMAP][0]] || null;
    };

    /**
     * Gets the Tibia.dat object for the item ID.
     * @param id the ID corresponding to the item.
     * @returns the object corresponding to the item.
     */
    Dat.prototype.getItem = function (id) {
        return this.data[0][id] || null;
    };

    /**
     * Loads the Dat file at the url.
     * @param url The filepath for the Tibia.dat.json file.
     * @returns an instance of the Dat object. This object is
     * later populated with data.
     * @static
     */
    Dat.load = function load(url) {
        var dat = new Dat();
        dat.setLoading(true);
        // Load the Tibia.dat.json file.
        $.ajax({
            'url': url,
            'dataType': 'json',
            'success': function (obj) {
                // Tibia.dat.json loaded.
                // Save data for future use.
                dat.setData(obj);

                // Assign state variables.
                dat.setLoaded(true);
                dat.setLoading(false);
            }
        });
        return dat;
    };

    return Dat;
}(jQuery));
