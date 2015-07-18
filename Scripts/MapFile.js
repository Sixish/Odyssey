"use strict";
// Utility functions
function padLeft(str, width, padding) {
	while (str.length < width) {
		str = (padding || '0') + str;
	}
	return str;
}

// We cannot read bytes in hexadecimal strings,
// so we use half bytes
var HALF_BYTES_POSX = 4,
	HALF_BYTES_POSY = 4,
	HALF_BYTES_POSZ = 2,
	HALF_BYTES_ITEMS_ON_TILE = 2,
	HALF_BYTES_ITEMID = 4,
	HALF_BYTES_ITEMCOUNT = 2,
	HALF_BYTES_ITEMSPLASH = 2,
	HALF_BYTES_ITEMFLUID = 2,
	HALF_BYTES_ITEMFRAME = 2;

function MapFile(x, y, z) {
	// Each MapFile contains (256 x 256 x 1), enforce it.
	console.assert(x <= 0xFF, 'MapFile has invalid x. Must be between 0 and 255. x=' + x);
	console.assert(y <= 0xFF, 'MapFile has invalid y. Must be between 0 and 255. y=' + y);
	console.assert(z <= 0xF, 'MapFile has invalid z. Must be between 0 and 15. z=' + z);
	// baseX,Y,Z used for filename resolution
	this.baseX = (x & 0xFF);
	this.baseY = (y & 0xFF);
	this.baseZ = (z & 0xF);
	
	// Tile structure (flat array, y << 8 + x)
	this.structure = [];
}
MapFile.getFileX = function (posx) {
	console.assert(typeof posx === 'number', 'Cannot get filename X-component of a non-number.');
	return ((posx >> 8) & 0xFF);
};
MapFile.getFileY = function (posy) {
	console.assert(typeof posy === 'number', 'Cannot get filename Y-component of a non-number.');
	return ((posy >> 8) & 0xFF);
};
MapFile.getFileZ = function (posz) {
	console.assert(typeof posz === 'number', 'Cannot get filename Z-component of a non-number.');
	return ((posz >> 0) & 0xFF);
};
MapFile.getFilename = function (fposx, fposy, fposz) {
	var str = '';
	str += padLeft(fposx.toString(), 3, '0');
	str += padLeft(fposy.toString(), 3, '0');
	str += padLeft(fposz.toString(), 2, '0');
	return str;
};
MapFile.resolveTileOffset = function (x, y) {
	return ((x & 0xFF) << 0) + ((y & 0xFF) << 8);
	//return (x - ((MapFile.getFileX(x) & 0xFF) << 0)) + (y - ((MapFile.getFileY(y) & 0xFF) << 8));
};
MapFile.prototype.toString = function () {
	return MapFile.getFilename(this.baseX, this.baseY, this.baseZ);
};
MapFile.prototype.addTile = function (x, y, mapTile) {
	var offset = MapFile.resolveTileOffset(x, y);
	console.assert(mapTile instanceof MapTile, 'MapFile.addTile requires a MapTile');
	this.structure[offset] = mapTile;
};

// Each MapTile contains an instance of a tile sight
function MapTile() {
	this.items = [];
}
MapTile.getTileX = function (posx) {
	return posx & 0xFF;
};
MapTile.getTileY = function (posy) {
	return posy & 0xFF;
};
MapTile.getTileZ = function (posz) {
	return posz & 0xFF;
};
MapTile.prototype.addItem = function (mapItem) {
	this.items.push(mapItem);
};

// Each MapItem contains an instance of an item on a tile
function MapItem() {
	this.id = 0;
}

// Result of a MapFileParser
function MapFileParserResult() {
	this.mapFiles = [];
}
MapFileParserResult.getMapOffset = function (posx, posy, posz) {
	return (((fposx >> 8) & 0xFF) << 0) + (((fposy >> 8) & 0xFF) << 8) + (((fposz >> 0) & 0xFF) << 16);
};
MapFileParserResult.resolveIndex = function (fposx, fposy, fposz) {
	return ((fposx & 0xFF) << 0) + ((fposy & 0xFF) << 8) + ((fposz & 0xFF) << 16);
};
MapFileParserResult.prototype.hasMapFile = function (fposx, fposy, fposz) {
	return this.mapFiles.hasOwnProperty(MapFileParserResult.resolveIndex(fposx, fposy, fposz));
};
MapFileParserResult.prototype.getMapFile = function (fposx, fposy, fposz) {
	return this.mapFiles[MapFileParserResult.resolveIndex(fposx, fposy, fposz)];
};
MapFileParserResult.prototype.addMapFile = function (mapFile) {
	console.assert(mapFile instanceof MapFile, 'Cannot add to MapFileParserResult, mapFile is not a MapFile.');
	this.mapFiles[MapFileParserResult.resolveIndex(mapFile.baseX, mapFile.baseY, mapFile.baseZ)] = mapFile;
};

// MapFileParser to parse the text from a Map file.
function MapFileParser() {
	this.tilePosition = new Matrix3D(0, 0, 0);
}
MapFileParser.prototype.parse = function (str) {
	var result = new MapFileParserResult(), map, b, len, i, tiles, tile, hexString = '', filename, itemCount = '';
	
	var posx, posy, posz;
	var fposx, fposy, fposz;
	var tposx, tposy, tposz;
	var t, item;
	b = 0;
	len = str.length;
	
	while (b < len) {
		/* Parse Position */
		// PosX
		for (i = 0; i < HALF_BYTES_POSX; i += 1, b += 1) {
			hexString += str.charAt(b);
		}
		posx = parseInt(hexString, 16);
		hexString = '';
		
		// PosY
		for (i = 0; i < HALF_BYTES_POSY; i += 1, b += 1) {
			hexString += str.charAt(b);
		}
		posy = parseInt(hexString, 16);
		hexString = '';
		
		// PosZ
		for (i = 0; i < HALF_BYTES_POSZ; i += 1, b += 1) {
			hexString += str.charAt(b);
		}
		posz = parseInt(hexString, 16);
		hexString = '';
		
		// Create a new map, if we don't already have one...
		fposx = MapFile.getFileX(posx);
		fposy = MapFile.getFileY(posy);
		fposz = MapFile.getFileZ(posz);
		
		if (!result.hasMapFile(fposx, fposy, fposz)) {
			if (fposz > 0xF) {
				console.log(fposz, b);
			}
			map = new MapFile(fposx, fposy, fposz);
			result.addMapFile(map);
		}
		map = result.getMapFile(fposx, fposy, fposz);
		
		tposx = MapTile.getTileX(posx);
		tposy = MapTile.getTileY(posy);
		tposz = MapTile.getTileZ(posz);
		
		// Read the amount of items on the tile
		for (i = 0; i < HALF_BYTES_ITEMS_ON_TILE; i += 1, b += 1) {
			hexString += str.charAt(b);
		}
		itemCount = parseInt(hexString, 16);
		hexString = '';
		
		tile = new MapTile();
		map.addTile(tposx, tposy, tile);
		
		for (t = 0; t < itemCount; t += 1) {
			item = new MapItem();
			tile.addItem(item);
			
			for (i = 0; i < HALF_BYTES_ITEMID; i += 1, b += 1) {
				hexString += str.charAt(b);
			}
			item.id = parseInt(hexString, 16);
			hexString = '';
			
			if (Dat.isStackable(item.id)) {
				for (i = 0; i < HALF_BYTES_ITEMCOUNT; i += 1, b += 1) {
					hexString += str.charAt(b);
				}
				item.count = parseInt(hexString, 16);
				hexString = '';
			}
			
			if (Dat.isSplash(item.id)) {
				for (i = 0; i < HALF_BYTES_ITEMSPLASH; i += 1, b += 1) {
					hexString += str.charAt(b);
				}
				item.splash = parseInt(hexString, 16);
				hexString = '';
			}
			
			if (Dat.isFluid(item.id)) {
				for (i = 0; i < HALF_BYTES_ITEMFLUID; i += 1, b += 1) {
					hexString += str.charAt(b);
				}
				item.fluid = parseInt(hexString, 16);
				hexString = '';
			}
			
			if (Dat.isAnimated(item.id)) {
				for (i = 0; i < HALF_BYTES_ITEMFRAME; i += 1, b += 1) {
					hexString += str.charAt(b);
				}
				item.frame = parseInt(hexString, 16);
				hexString = '';
			}
		}
	}
	return result;
};
