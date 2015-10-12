// ResourceManager for managing spritesheets.
var resourceManager = new ResourceManager();
resourceManager.setFilepathPrefix("Sprites/");

// ResourceManager for managing map files.
var resourceManagerMaps = new ResourceManager();
resourceManagerMaps.setFilepathPrefix("Maps/");

function OdysseyMapRenderer() {
	this.lastSpriteLoad = 0;
	this.lastRenderTime = 0;
	
	// Stores meta information for the viewport.
	this.heights = [];
	
	// Stores the current viewport position in the map.
	this.position = new Matrix3D(0, 0, 0);
	
	// Stores the origin on the canvas.
	this.origin = new Matrix3D(18, 6, 0);
	
	// The maps loaded.
	this.maps = {};
	this.mapsLoaded = {};
	this.mapsLoading = {};
	this.mapsFailed = {};
	
	// The tiles that have failed to load,
	// for selective rendering.
	this.failedRenderedTiles = [];
	this.refreshRenderedTiles = [];
	
	this.drawContext = null;
	
}
// Helper function to load the dependencies.
OdysseyMapRenderer.prototype.initialize = function (callback) {
	var ctx = this;
	Dat.load(function () {
		// Load all the spritesheets
		(function loadSpriteSheetIndex() {
			$.ajax({
				url: 'Data/SpriteSheetIndex.json',
				dataType: 'json',
				success: function (jso) {
					console.log("SpriteSheetIndex loaded.");
					ctx.spritesheets = spritesheets = jso;
					for (var i = 0, len = spritesheets.length; i < len; i += 1) {
						resourceManager.addImage(spritesheets[i].src);
					}
					if (callback) {
						callback.call(ctx);
					}
				}
			});
		}());
		(function setupMaps(startX, startY, startZ, endX, endY, endZ) {
			startX = MapFile.getFileX(startX);
			startY = MapFile.getFileX(startY);
			startZ = MapFile.getFileX(startZ);
			
			endX = MapFile.getFileX(endX);
			endY = MapFile.getFileX(endY);
			endZ = MapFile.getFileX(endZ);
			
			for (x = startX; x <= endX; x += 1) {
				for (y = startY; y <= endY; y += 1) {
					// Z-component is not included in the filename.
					resourceManagerMaps.addBinaryFile(String(MapFileParserResult.resolveIndex(x, y, 0)));
				}
			}
		}(31744, 30976, 0, 33536, 33024, 15));
	});
};

OdysseyMapRenderer.getSpriteID = function (itemId, posx, posy, posz, hasVertical, hasHorizontal) {
	var item = Dat.getItem(itemId), max;
	// Animated sprites: divide by item.a
	max = item.spr.length;
	if (item.hasOwnProperty(18)) {
		if (hasHorizontal) {
			// TODO refactor - change behavior so the
			// return value below is valid
			return item.spr[1 % item.x];
		}
		if (hasVertical) {
			// TODO refactor - change behavior so the
			// return value below is valid
			return item.spr[2 % item.x];
		}
	}
	if (item.a) {
		max = max / item.a;
	}
	return item.spr[(((posy % item.y) * item.x) + (posx % item.x)) % max];
};

OdysseyMapRenderer.prototype.parseMapDataFile = function (input) {
	//var i, len, lines = txt.split("\n"), cLine, ssplit, coords, arr = [], x, y, z, j, jLen, rSplit, iSplit, cItem, cItemArr, tile;
	var parser, results, mapFiles, mf, i, len, key, maps = this.maps;
	parser = new MapFileParser();
	results = parser.parse(input);
	mapFiles = results && results.mapFiles;
	if (mapFiles && mapFiles.length) {
		for (key in mapFiles) {
			if (mapFiles.hasOwnProperty(key) && (!maps.hasOwnProperty(key))) {
				maps[key] = mapFiles[key];
			}
		}
	}
	return;
}
OdysseyMapRenderer.prototype.loadMapFile = function (mapX, mapY, mapZ) {
	var ctx = this;
	// Z-component is not used in filenames.
	var index = MapFileParserResult.resolveIndex(mapX, mapY, 0);
	var id = resourceManagerMaps.getResourceIDByFilename(index);
	if (id === null) {
		console.log("Could not load map file " + index);
		return;
	}
	var resource = resourceManagerMaps.getResource(id);
	if (!resource.isLoading()) {
		resource.addEventListener('load', function () {
			ctx.parseMapDataFile(resource.getResourceContents());
		});
		resource.load();
	}
	
	// This will throw a SyntaxError on Firefox because it tries to parse XML ...
	return;
	$.ajax({
		url: "Maps/" + mapChunkID,
		dataType: 'text',
		success: function (txt) {
			console.log("Loaded ... " + mapChunkID);
			ctx.parseMapDataFile(txt);
			ctx.mapsLoaded[mapChunkID] = true;
			ctx.mapsLoading[mapChunkID] = false;
			return true;
		},
		error: function () {
			ctx.mapsFailed[mapChunkID] = true;
			ctx.mapsLoading[mapChunkID] = false;
		}
	});
};

OdysseyMapRenderer.getSpriteX = function (itemID) {
	return Number(Dat.getItem(itemID).w);
};
OdysseyMapRenderer.getSpriteY = function (itemID) {
	return Number(Dat.getItem(itemID).h);
};

OdysseyMapRenderer.prototype.getMap = function (x, y, z) {
	var mapOffset = MapFileParserResult.resolveIndex(MapFile.getFileX(x), MapFile.getFileY(y), MapFile.getFileZ(z));
	return this.maps[mapOffset];
};
OdysseyMapRenderer.prototype.getTileItems = function (x, y, z) {
	var map = this.getMap(x, y, z), tileOffset;
	tileOffset = MapFile.resolveTileOffset(MapTile.getTileX(x), MapTile.getTileY(y));
	// Should this be using MapTile.getTileX(Y, Z)?
	return (map && map.structure && map.structure[tileOffset] && map.structure[tileOffset].items) || null;
};
OdysseyMapRenderer.prototype.clearMetaForTile = function (x, y, z) {
	// TODO
	var offset = OdysseyMapRenderer.getOffset(x, y, z);
};

// Gets the ID for the spritesheet containing sprID.
OdysseyMapRenderer.prototype.getSpriteFileID = function (sprID) {
	var spritesheets = this.spritesheets, i, len = spritesheets.length, sheet;
	// Iterate across all spritesheets until we find one within our range.
	for (i = 0; i < len; i += 1) {
		sheet = spritesheets[i];
		if (sheet.from <= sprID && sprID <= sheet.to) {
			return i;
		}
	}
	return -1;
};

OdysseyMapRenderer.prototype.getSpriteFileContaining = function (sprID) {
	return this.spritesheets[this.getSpriteFileID(sprID)];
};
OdysseyMapRenderer.prototype.getSpriteOffsetX = function (sprID) {
	var sheet = this.getSpriteFileContaining(sprID),
		h = (1 + sheet.size & 1),
		w = (1 + ((sheet.size >> 1) & 1)),
		offset = sprID - sheet.from,
		posX = ((offset % (24 / w))) * w;
	return posX;
};
OdysseyMapRenderer.prototype.getSpriteOffsetY = function (sprID) {
	var sheet = this.getSpriteFileContaining(sprID),
		h = (1 + (sheet.size & 1)),
		w = (1 + ((sheet.size >> 1) & 1)),
		offset = sprID - sheet.from,
		posY = (Math.floor(offset / (24 / w))) * h;
	return posY;
};

OdysseyMapRenderer.prototype.getSpriteSizeX = function (sprID) {
	var sheet = this.getSpriteFileContaining(sprID);
	return (1 + ((sheet.size >> 1) & 1));
};

OdysseyMapRenderer.prototype.getSpriteSizeY = function (sprID) {
	var sheet = this.getSpriteFileContaining(sprID);
	return (1 + (sheet.size & 1));
};

// Get the OffsetX/Y for the viewport.
OdysseyMapRenderer.prototype.getPositionOffsetX = function (x) {
	return this.origin.x + (x - this.position.x);
};
OdysseyMapRenderer.prototype.getPositionOffsetY = function (y) {
	return this.origin.y + (y - this.position.y);
};

// Set the current drawContext (Canvas 2D context).
OdysseyMapRenderer.prototype.setCanvas = function (canvas) {
	this.canvas = canvas;
	this.drawContext = canvas.getContext("2d");
};

OdysseyMapRenderer.prototype.clear = function () {
	this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

OdysseyMapRenderer.prototype.mapIsLoaded = function (posx, posy, posz) {
	var fposx = MapFile.getFileX(posx);
	var fposy = MapFile.getFileY(posy);
	var fposz = MapFile.getFileZ(posz);
	
	return this.maps.hasOwnProperty(MapFileParserResult.resolveIndex(fposx, fposy, fposz));
};
// Renders one sprite.
OdysseyMapRenderer.prototype.renderSprite = function (sprID, x, y, z, ox, oy, height) {
	var spritesheet = this.getSpriteFileID(sprID),
		spriteOffsetX = this.getSpriteOffsetX(sprID),
		spriteOffsetY = this.getSpriteOffsetY(sprID),
		spriteSizeX = this.getSpriteSizeX(sprID),
		spriteSizeY = this.getSpriteSizeY(sprID),
		offsetX = this.getPositionOffsetX(x),
		offsetY = this.getPositionOffsetY(y);
	if (!resourceManager.isLoaded(spritesheet)) {
		resourceManager.load(spritesheet);
		return false;
	}
	try {
		this.drawContext.drawImage(
			resourceManager.getResourceImage(spritesheet),
			spriteOffsetX * 32,
			spriteOffsetY * 32,
			spriteSizeX * 32,
			spriteSizeY * 32,
			((offsetX - (spriteSizeX - 1)) * 32) - (height + ox),
			((offsetY - (spriteSizeY - 1)) * 32) - (height + oy),
			spriteSizeX * 32,
			spriteSizeY * 32
		);
		return true;
	} catch (err) {
		return false;
	}
};

// Renders one item.
OdysseyMapRenderer.prototype.renderItem = function (itemID, x, y, z, ox, oy, height, hasVertical, hasHorizontal) {
	var sprID = OdysseyMapRenderer.getSpriteID(itemID, x, y, z, hasVertical, hasHorizontal),
		success = true;
	if (!this.renderSprite(sprID, x, y, z, ox, oy, height)) {
		success = false;
	}
	return success;
};

// Renders one tile.
OdysseyMapRenderer.prototype.renderTile = function (x, y, z) {
	var items = this.getTileItems(x, y, z),
		i,
		len,
		itemID,
		height = 0,
		hasVertical = false,
		hasHorizontal = false,
		offsetX,
		offsetY,
		item,
		success = true;
	if (items === null) {
		if (!this.mapIsLoaded(x, y, z)) {
			// The render failed because the map is not loaded.
			
			// Start loading the map.
			this.loadMapFile(
				MapFile.getFileX(x),
				MapFile.getFileY(y),
				MapFile.getFileZ(z)
			);
			return false;
		}
		// The render didn't fail, it just isn't possible
		// because no items exist at these coordinates.
		return true;
	}
	len = items.length;
	for (i = 0; i < len; i += 1) {
		itemID = items[i].id;
		item = Dat.getItem(itemID);
		offsetX = item.hasOwnProperty(25) ? (item[25][0] || 0) : 0;
		offsetY = item.hasOwnProperty(25) ? (item[25][1] || 0) : 0;
		if (!this.renderItem(itemID, x, y, z, offsetX, offsetY, height, hasVertical, hasHorizontal)) {
			success = false;
		}
		
		// We need to record the total height of all
		// items on the stack.
		if (item.hasOwnProperty(26)) {
			height += item[26][0];
		}
		
		// We need to remember if there are horizontal
		// or vertical items on the stack, so that
		// hangable items are displayed with the correct
		// orientation.
		if (item.hasOwnProperty(19)) {
			hasHorizontal = true;
		}
		if (item.hasOwnProperty(20)) {
			hasVertical = true;
		}
	}
	return success;
};

// Renders one frame.
OdysseyMapRenderer.prototype.render = function () {
	var x, xs, xe, y, ys, ye, z, zs, ze, currentMapPosition = this.position, success = true;
	
	// We cannot proceed until we've loaded the dat file
	if (!Dat.isLoaded) {
		console.assert(Dat.isLoading, "Script must initialize before rendering.");
		// TODO REMOVE
		this.initialize();
		return false;
	}
	
	// Set the range of position values to render.
	
	xs = (currentMapPosition.x - 18);
	xe = (currentMapPosition.x + 18);
	
	ys = (currentMapPosition.y - 6);
	ye = (currentMapPosition.y + 6);
	
	// Our map doesn't support multi-level rendering just yet.
	zs = currentMapPosition.z;
	ze = currentMapPosition.z;
	
	// Clear the list of failed tiles.
	this.clearRenderFailed();
	
	// Ensure the maps are loaded.
	if (!this.mapsLoadedInRange(xs, ys, zs, xe, ye, ze)) {
		this.loadMaps(xs, ys, zs, xe, ye, ze);
	}
	for (x = xs; x <= xe; x += 1) {
		for (y = ys; y <= ye; y += 1) {
			for (z = zs; z <= ze; z += 1) {
				if (!this.renderTile(x, y, z)) {
					// This tile was not correctly rendered.
					// Try again later (after resources are loaded).
					this.setRenderFailed(x, y, z);
					
					// Full render was not successful because
					// the tile failed to load.
					success = false;
				}
			}
		}
	}
	return success;
};
OdysseyMapRenderer.prototype.renderSelective = function () {
	var arr = this.failedRenderedTiles, pos;
	for (i = arr.length - 1; i > 0; i -= 1) {
		pos = arr[i];
		if (!this.renderTile(pos.x, pos.y, pos.z)) {
			// We failed again. We can't reliably remove
			// array indices if we continue. Break and remove
			// what we can.
			break;
		}
	}
	
	arr.length = i;
	if (i === 0) {
		// We have finished rendering all objects, perform
		// a full render so that we can resolve any issues
		// with 64px display.
		this.render();
	}
};

OdysseyMapRenderer.prototype.setRenderFailed = function (x, y, z) {
	this.failedRenderedTiles.push(new Matrix3D(x, y, z));
};
OdysseyMapRenderer.prototype.clearRenderFailed = function () {
	this.failedRenderedTiles.splice(0);
};

OdysseyMapRenderer.prototype.loadMaps = function (xs, ys, zs, xe, ye, ze) {
	var x, y, z, filename, resourceID, arr = [];
	
	// Get the base values for the maps.
	xs = MapFile.getFileX(xs);
	ys = MapFile.getFileY(ys);
	zs = MapFile.getFileZ(zs);
	
	xe = MapFile.getFileX(xe);
	ye = MapFile.getFileY(ye);
	ze = MapFile.getFileZ(ze);
	
	for (x = xs; x <= xe; x += 1) {
		for (y = ys; y <= ye; y += 1) {
			for (z = zs; z <= ze; z += 1) {
				filename = MapFileParserResult.resolveIndex(x, y, 0);
				resourceID = resourceManagerMaps.getResourceIDByFilename(filename);
				if (resourceID === null) {
					console.log("Whoops..." + filename + " does not exist in the ResourceManager.");
					break;
				}
				if (!resourceManagerMaps.isLoaded(resourceID)) {
					return false;
				}
			}
		}
	}
	return true;
};
OdysseyMapRenderer.prototype.mapsLoadedInRange = function (xs, ys, zs, xe, ye, ze) {
	var x, y, z, filename, resourceID, arr = [];
	
	// Get the base values for the maps.
	xs = MapFile.getFileX(xs);
	ys = MapFile.getFileY(ys);
	zs = MapFile.getFileZ(zs);
	
	xe = MapFile.getFileX(xe);
	ye = MapFile.getFileY(ye);
	ze = MapFile.getFileZ(ze);
	
	for (x = xs; x <= xe; x += 1) {
		for (y = ys; y <= ye; y += 1) {
			for (z = zs; z <= ze; z += 1) {
				filename = MapFileParserResult.resolveIndex(x, y, 0);
				resourceID = resourceManagerMaps.getResourceIDByFilename(filename);
				if (resourceID === null) {
					console.log("Whoops..." + filename + " does not exist in the ResourceManager.");
					break;
				}
				if (!resourceManagerMaps.isLoaded(resourceID)) {
					return false;
				}
			}
		}
	}
	return true;
};