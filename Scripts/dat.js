"use strict";
var Dat = (function () {
	// The dat.json object.
	var dat;
	
	// Constants
	var ATTRIBUTE_ID_GROUND          = 0,
		ATTRIBUTE_ID_TOPORDER1       = 1,
		ATTRIBUTE_ID_TOPORDER2       = 2,
		ATTRIBUTE_ID_TOPORDER3       = 3,
		ATTRIBUTE_ID_CONTAINER       = 4,
		ATTRIBUTE_ID_STACKABLE       = 5,
		ATTRIBUTE_ID_CORPSE          = 6,
		ATTRIBUTE_ID_USABLE          = 7,
		ATTRIBUTE_ID_WRITABLE        = 8,
		ATTRIBUTE_ID_READABLE        = 9,
		ATTRIBUTE_ID_FLUID           = 10,
		ATTRIBUTE_ID_SPLASH          = 11,
		ATTRIBUTE_ID_BLOCKING        = 12,
		ATTRIBUTE_ID_IMMOBILE        = 13,
		ATTRIBUTE_ID_BLOCKSMISSILE   = 14,
		ATTRIBUTE_ID_BLOCKSPATH      = 15,
		ATTRIBUTE_ID_BLOCKING2       = 16,
		ATTRIBUTE_ID_PICKUPABLE      = 17,
		ATTRIBUTE_ID_HANGABLE        = 18,
		ATTRIBUTE_ID_HORIZONTAL      = 19,
		ATTRIBUTE_ID_VERTICAL        = 20,
		ATTRIBUTE_ID_ROTATABLE       = 21,
		ATTRIBUTE_ID_LIGHT           = 22,
		ATTRIBUTE_ID_UNKNOWN_17      = 23,
		ATTRIBUTE_ID_FLOORCHANGE     = 24,
		ATTRIBUTE_ID_OFFSET          = 25,
		ATTRIBUTE_ID_HEIGHTED        = 26,
		ATTRIBUTE_ID_BOTTOMLAYER     = 27,
		ATTRIBUTE_ID_IDLEANIMATION   = 28,
		ATTRIBUTE_ID_MINIMAP         = 29,
		ATTRIBUTE_ID_ACTIONED        = 30,
		ATTRIBUTE_ID_GROUNDITEM      = 31,
		ATTRIBUTE_ID_LOOKTHROUGH     = 32,
		ATTRIBUTE_ID_BODYRESTRICTION = 33,
		ATTRIBUTE_ID_MARKETPROPS     = 34,
		ATTRIBUTE_ID_UNKNOWN_1021_23 = 35,
		ATTRIBUTE_ID_UNKNOWN_1021_FE = 254,
		ATTRIBUTE_NAME_FRAMES        = 'a',
		ATTRIBUTE_NAME_WIDTH         = 'w',
		ATTRIBUTE_NAME_HEIGHT        = 'h',
		ATTRIBUTE_NAME_BASE          = 'b',// ?
		ATTRIBUTE_NAME_SIZEX         = 'x',
		ATTRIBUTE_NAME_SIZEY         = 'y',
		ATTRIBUTE_NAME_SIZEZ         = 'z',
		ATTRIBUTE_NAME_SPRITES       = 'spr';
	
	return {
		isLoaded: false,
		load: function (callback) {
			var that = this;
			that.isLoading = true;
            $.ajax({
                'url': 'Data/dat.json',
                'dataType': 'json',
                'success': function (obj) {
                    dat = obj;
					that.isLoaded = true;
					that.isLoading = false;
                    console.log("Tibia.dat.json loaded.");
					callback();
                }
            });
		},
		isStackable: function (id) {
			return dat[0][id].hasOwnProperty(ATTRIBUTE_ID_STACKABLE);
		},
		isSplash: function (id) {
			return dat[0][id].hasOwnProperty(ATTRIBUTE_ID_SPLASH);
		},
		isFluid: function (id) {
			return dat[0][id].hasOwnProperty(ATTRIBUTE_ID_FLUID);
		},
		isAnimated: function (id) {
			return dat[0][id][ATTRIBUTE_NAME_FRAMES] !== 1;
		},
		getItem: function (id) {
			return dat[0][id] || null;
		}
	};
}());