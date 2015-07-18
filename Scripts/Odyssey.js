/*globals $, datIds, Matrix3D*/
/*jslint bitwise:true*/
window.tw = window.tw || {};
var imgPainters = [],
	img_spritesheets = [],
	spritesheets = [],
	DEFAULT_POS_X = 31744,
	DEFAULT_POS_Y = 33624,
	DEFAULT_POS_Z = 6,
	imgPool = [],
	unsaved = {
		markers: []
	},
	maps = {},
	mapsLoaded = {},
	mapsLoading = {},
	mapsFailed = {},
	currentMapFocus,
	currentMapPosition,
	currentRenderPosition,
	renderDisabled = false;
window.maps = maps;
function filterArrayNull(value) {
	return value !== undefined;
}
currentMapFocus = new Matrix3D(null, null, null);
currentMapPosition = new Matrix3D(DEFAULT_POS_X, DEFAULT_POS_Y, DEFAULT_POS_Z);
currentRenderPosition = new Matrix3D(null, null, null);
function parseMapDataFile(input) {
	//var i, len, lines = txt.split("\n"), cLine, ssplit, coords, arr = [], x, y, z, j, jLen, rSplit, iSplit, cItem, cItemArr, tile;
	var parser, results, mapFiles, mf, i, len, key;
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
function getMapChunkName(x, y) {
	return (
		(parseInt(Math.floor((x || currentMapPosition.x) / 256), 10) << 0) +
		(parseInt(Math.floor((y || currentMapPosition.y) / 256), 10) << 8)
	);
}
function loadMapChunk(mapChunkName) {
	if (mapsFailed[mapChunkName]) {
		// Fail silently
		return false;
	}
	if (mapsLoaded[mapChunkName]) {
		return true;
	}
	if (mapsLoading[mapChunkName]) {
		return true;
	}
	mapsLoading[mapChunkName] = true;
	// This will throw a SyntaxError on Firefox because it tries to parse XML ...
	$.ajax({
		url: "Maps/" + mapChunkName,
		dataType: 'text',
		success: function (txt) {
			console.log("Loaded ... " + mapChunkName);
			parseMapDataFile(txt);
			mapsLoaded[mapChunkName] = true;
			mapsLoading[mapChunkName] = false;
			return true;
		},
		error: function () {
			mapsFailed[mapChunkName] = true;
			mapsLoading[mapChunkName] = false;
		}
	});
}
function mapChunkIsLoaded(mapChunkName) {
	if (maps[mapChunkName] !== undefined) {
		return true;
	}
	return false;
}
function getMapChunk(mapChunkName) {
	if (mapsFailed[mapChunkName]) {
		console.assert(typeof maps[mapChunkName] === "object", "No maps found for " + mapChunkName + ".");
		return null;
	}
	var chunk = maps[mapChunkName];
	return chunk;
}
function getItemsAt(x, y, z) {
	var tileData, item;
	tileData = getMapChunk(getMapChunkName(x, y, z));
	if (tileData === null) {
		return [];
	}
	item = tileData.items[((x - tileData.offsetX) << 0) + ((y - tileData.offsetY) << 8)];
	if (item !== undefined) {
		item = item.split("x")[0];
	}
	return item === undefined ? undefined : [ item ];
}
function getCurrentSpriteId(itemId, posx, posy, posz, hasVertical, hasHorizontal) {
	var item = Dat.getItem(itemId), max;
	// Animated sprites: divide by item.a
	max = item.spr.length;
	if (item.hasOwnProperty(18)) {
		if (hasHorizontal) {
			return item.spr[1];
		}
		if (hasVertical) {
			return item.spr[2];
		}
	}
	if (item.a) {
		max = max / item.a;
	}
	return item.spr[(((posy % item.y) * item.x) + (posx % item.x)) % max];
}
function createSpritesheet() {
	var d = document.createElement("div"),
		child = document.createElement("div");
	d.appendChild(child);
	return d;
}
function freeSpritesheetToPool(sheet) {
	imgPool.push(sheet);
}
function getSpritesheetFromPool() {
	var out;
	// Get an image from the pool, or create an image if none are free.
	out = (imgPool.length === 0 ? createSpritesheet() : imgPool.splice(-1, 1)[0]);
	return out;
}
function getSpriteFileIndex(sprId) {
	var i, len = spritesheets.length, sheet, list = [], ret = -1;
	for (i = 0; i < len; i += 1) {
		sheet = spritesheets[i];
		if (sheet.from <= sprId && sprId <= sheet.to) {
			list.push(sheet);
			ret = i;
		}
	}
	if (list.length) {
		if (list.length > 1) {
			console.log("Found multiple files for " + sprId);
			console.log(list);
		}
	}
	return ret;
}
function getSpriteOffset(sprId) {
	var id, sheet, posInSheet, spriteHeight, spriteWidth, w, h, posX, posY;
	id = getSpriteFileIndex(sprId);
	sheet = spritesheets[id];
	if (sheet === undefined) {
		return null;
	}
	posInSheet = sprId - sheet.from;
	// 77 = 87553 - 87409
	h = (1 + (sheet.size & 1));
	w = (1 + ((sheet.size >> 1) & 1));
	// [1, 2]
	spriteHeight = h * 32;
	spriteWidth = w * 32;
	// [32, 64]
	w = spriteWidth / 32;
	h = spriteHeight / 32;
	
	//posX = ((24 / w) - (posInSheet % (24 / w))) * w;
	//posY = ((24 / h) - Math.floor(posInSheet / (24 / w))) * h;
	
	posX = ((posInSheet % (24 / w))) * w;
	// ((24 / 2)) = items per row
	posY = (Math.floor(posInSheet / (24 / w))) * h;
	return {
		x: posX,
		y: posY
	};
}
function getSpriteFileName(sprId) {
	var i = getSpriteFileIndex(sprId);
	if (i === -1) {
		throw new Error("Could not find sprite file.");
	}
	return spritesheets[i].src;
}
function resolveOffset(x, y, z) {
	// Returns the position relative to current map position
	var m = new Matrix3D(x - currentMapPosition.x, y - currentMapPosition.y, z - currentMapPosition.z);
	return m;
}
function getSpriteDimensions(itemId) {
	var item = Dat.getItem(itemId);
	if (item === undefined) {
		console.log('Item with id ' + itemId + ' is undefined.');
		return;
	}
	return {
		x: Number(item.w),
		y: Number(item.h)
	};
}
function getItemsAtTile(x, y, z) {
	var m = maps, tileOffset, mapOffset;
	// Should this be using MapTile.getTileX(Y, Z)?
	mapOffset = MapFileParserResult.resolveIndex(MapFile.getFileX(x), MapFile.getFileY(y), MapFile.getFileZ(z));
	tileOffset = MapFile.resolveTileOffset(MapTile.getTileX(x), MapTile.getTileY(y));
	m = m && m[mapOffset];
	m = m && m.structure;
	m = m && m[tileOffset];
	return (m && m.items) || null;
}
function mapIsLoaded(x, y, z) {
	return mapsLoaded[getMapChunkName(x, y, z)];
}
function mapIsLoading(x, y, z) {
	return mapsLoading[getMapChunkName(x, y, z)];
}
function mapHasFailed(x, y, z) {
	return mapsFailed[getMapChunkName(x, y, z)];
}
function loadTile(x, y, z) {
	var itemList, i, len, element, img, spriteOffset, offset, itemId, itemCount, spriteDimensions, attributes, j, lenj, height = 0, offsetx = 0, offsety = 0, item, hasHorizontal = false, hasVertical = false;
	itemList = getItemsAtTile(x, y, z);
	if (!itemList) {
		return false;
	}
	element = document.getElementById("canvas-floor-" + String(z));
	len = itemList.length;
	for (i = 0; i < len; i += 1) {
		itemId = itemList[i].id;
		itemCount = itemList[i].count;
		item = Dat.getItem(itemId);
		if (item.hasOwnProperty(19)) {
			hasHorizontal = true;
		}
		if (item.hasOwnProperty(20)) {
			hasVertical = true;
		}
		offsetx = item.hasOwnProperty(25) ? (item[25][0] || 0) : 0;
		offsety = item.hasOwnProperty(25) ? (item[25][1] || 0) : 0;
		spriteOffset = getSpriteOffset(getCurrentSpriteId(itemId, x, y, z, hasVertical, hasHorizontal));
		if (spriteOffset !== null) {
			spriteDimensions = getSpriteDimensions(itemId);
			offset = resolveOffset(x, y, z).shift(7, 5, 0);
			element.getContext("2d").drawImage(
				imgPainters[getSpriteFileIndex(getCurrentSpriteId(itemId, x, y, z, hasVertical, hasHorizontal))],
				spriteOffset.x * 32,
				spriteOffset.y * 32,
				spriteDimensions.x * 32,
				spriteDimensions.y * 32,
				((offset.x - (spriteDimensions.x - 1)) * 32) - (height + offsetx),
				((offset.y - (spriteDimensions.y - 1)) * 32) - (height + offsety),
				spriteDimensions.x * 32,
				spriteDimensions.y * 32
			);
		}
		// Height
		if (item.hasOwnProperty(26)) {
			height += item[26][0];
		}
	}
}
function freeAllSpritesheetToPool(e) {
	while (e.lastElementChild) {
		freeSpritesheetToPool(e.lastElementChild);
		e.removeChild(e.lastElementChild);
	}
}
function clearMap() {
	var z = 0, zEnd = 16, cvs;
	for (z; z < zEnd; z += 1) {
		cvs = document.getElementById("canvas-floor-" + z);
		cvs.getContext("2d").clearRect(0, 0, cvs.width, cvs.height);
	}
}
function render() {
	var x, xs, xe, y, ys, ye, z, zs, ze, mapChunkName, fullRender;
	if (renderDisabled) {
		return false;
	}
	x = y = z = 0;
	// fullRender tells us if there were any failed map tiles, e.g. not loaded.
	fullRender = true;
	// Repeat whenever possible
	// We cannot proceed until we've loaded the dat file
	if (!Dat.isLoaded) {
		console.assert(Dat.isLoading, "Script must initialize before rendering.");
		// TODO REMOVE
		initialize();
		return false;
	}
	requestAnimationFrame(render);
	// Has position changed?
	if (!currentRenderPosition.equalToMatrix(currentMapPosition)) {
		// Clear the map
		clearMap();
		// Set the positional bounds for the rendering
		xs = (currentMapPosition.x - 7);
		xe = (currentMapPosition.x + 7);
		ys = (currentMapPosition.y - 5);
		ye = (currentMapPosition.y + 5);
		zs = currentMapPosition.z;//(currentMapPosition.z > 0 ? 0 : Math.max(currentMapPosition.z - 2, -7));
		ze = currentMapPosition.z;//(currentMapPosition.z > 0 ? 4 : Math.min(currentMapPosition.z + 2, -1));
		// Iterate through all the items that will be re-rendered
		for (x = xs; x <= xe; x += 1) {
			for (y = ys; y <= ye; y += 1) {
				for (z = zs; z <= ze; z += 1) {
					// Check if their map is loaded
					if (mapIsLoaded(x, y, z)) {
						loadTile(x, y, z);
					} else {
						if (!mapIsLoading(x, y, z)) {
							// Load the chunk with this tile
							loadMapChunk(getMapChunkName(x, y, z));
						}
						if (!mapHasFailed(x, y, z)) {
							fullRender = false;
						}
					}
				}
			}
		}
		if (fullRender) {
			currentRenderPosition.set(currentMapPosition.x, currentMapPosition.y, currentMapPosition.z);
		}
		// Load the map data file, if necessary.
		//mapChunkName = getMapChunkName(currentMapPosition.x, currentMapPosition.y, currentMapPosition.z);
		//loadMapChunk(mapChunkName);
	}
}
function startRenderer() {
	console.log("Renderer Startup...");
	requestAnimationFrame(render);
}
function initialize(callback) {
	// Load Tibia.dat data
	
	Dat.load(function () {
		// Load all the spritesheets
		(function loadSpriteSheetIndex() {
			$.ajax({
				url: 'Data/SpriteSheetIndex.json',
				dataType: 'json',
				success: function (jso) {
					console.log("SpriteSheetIndex loaded.");
					spritesheets = jso;
					(function loadSpritesheet(id) {
						var img = new Image();
						function done(id) {
							if (spritesheets[id + 1] !== undefined) {
								loadSpritesheet(id + 1);
							} else {
								console.log("Spritesheets ready.");
								if (callback) {
									callback();
								}
							}
						}
						img.addEventListener("error", function () {
							console.log("Error:" + this.src);
							done(id);
						});
						img.addEventListener("load", function () {
							//console.log("Loaded " + this.src);
							done(id);
						});
						img.src = "Sprites/" + spritesheets[id].src;
						imgPainters[id] = img;
					}(0));
				},
				error: function (e) {
					console.log("Failed to load SpriteSheetIndex.json.");
				}
			});
		}());
	});
}
function disableRendering() {
	renderDisabled = true;
}
window.tw.Odyssey = {
	'position': currentMapPosition,
	'focus': currentMapFocus,
	'startRenderer': startRenderer,
	'initialize': initialize,
	'getItemsAt': getItemsAtTile,
	'disableRendering': disableRendering
};
