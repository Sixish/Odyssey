(function (map) {
	/* Controls for manipulating the map */
	// KeyCodes
	var KEYCODE_ARROW_DOWN  = 40,
		KEYCODE_ARROW_LEFT  = 37,
		KEYCODE_ARROW_UP    = 38,
		KEYCODE_ARROW_RIGHT = 39,
		KEYCODE_PAGE_UP     = 33,
		KEYCODE_PAGE_DOWN   = 34;
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
	// Where is the center of the map?
	var center = map.position;
	// How many tiles are in focus?
	var focusedCount = 0;
	// Map - which tiles are currently focused?
	var focused = {};
	// Which tiles currently have the .active-tile class?
	var cssFocused = {};
	var gridElements = [];
	// Data representation elements
	var elementPositionInfoItems = document.getElementById("map-info-position-items");
	var elementPositionInfoRecordings = document.getElementById("map-info-position-recordings");
	function toggleFocus(e) {
		var x = e.target.getAttribute("data-grid-x"),
			y = e.target.getAttribute("data-grid-y"),
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
		console.log(focusedCount);
	}
	function isFocused(x, y, z) {
		return ((focused[x] && focused[x][y] && focused[x][y][z]) || false);
	}
	function setFocused(x, y, z) {
		createObjectNesting(focused, x, y);
		if (!focused[x][y][z]) {
			toggleFocused(x, y, z);
		}
	}
	function toggleFocused(x, y, z) {
		var currFocused;
		createObjectNesting(focused, x, y);
		currFocused = (focused[x][y][z] || false);
		focused[x][y][z] = !currFocused;
		focusedCount += (currFocused ? -1 : 1);
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
		for (x = 0; x < 15; x += 1) {
			for (y = 0; y < 11; y += 1) {
				for (z = 0; z < 1; z += 1) {
					if (isFocused(cx + x - 7, cy + y - 5, cz + z) !== hasFocusedClass(x - 7, y - 5, z)) {
						toggleFocusedClass(x - 7, y - 5, z);
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
			c = children[i]
			x = c.getAttribute("data-grid-x");
			y = c.getAttribute("data-grid-y");
			console.assert(x !== null && y !== null, "Grid values are null.");
			createObjectNesting(gridElements, x);
			gridElements[x][y] = c;
		}
	}
	// Automatically set up the
	setGridElements();
	function setMousePosition(x, y, z) {
		var items = tw.map.getItemsAt(x, y, z), i, len, itemsStr = "", recordings = tw.map.getRecordingsAt(x, y, z), recInfo = '';
		// TODO COMPAT textContent
		if (items === null || items === undefined) {
			itemsStr = "NONE";
		} else {
			for (i = 0, len = items.length; i < len; i += 1) {
				itemsStr += (itemsStr ? ", " : "") + String(items[i].id);
			}
		}
		
		if (recordings === null || recordings === undefined) {
			recInfo = "NONE";
		} else {
			for (i = 0, len = recordings.length; i < len; i += 1) {
				recInfo += (recInfo !== '' ? ', ' : '') + recordings[i];
			}
		}
		elementPositionInfoItems.textContent = itemsStr;
		elementPositionInfoRecordings.textContent = recInfo;
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
	function mapShift(e) {
		var position = tw.map.position,
			ctrlModifier = e.ctrlKey ? 10 : 1;
		if (e.keyCode === KEYCODE_ARROW_DOWN) {
			e.preventDefault();
			return position.shift(0, 1 * ctrlModifier, 0);
		}
		if (e.keyCode === KEYCODE_ARROW_LEFT) {
			e.preventDefault();
			return position.shift(-1 * ctrlModifier, 0, 0);
		}
		if (e.keyCode === KEYCODE_ARROW_UP) {
			e.preventDefault();
			return position.shift(0, -1 * ctrlModifier, 0);
		}
		if (e.keyCode === KEYCODE_ARROW_RIGHT) {
			e.preventDefault();
			return position.shift(1 * ctrlModifier, 0, 0);
		}
		if (e.keyCode === KEYCODE_PAGE_DOWN) {
			e.preventDefault();
			if (position.z > 0) {
				return position.shift(0, 0, -1);
			}
			return false;
		}
		if (e.keyCode === KEYCODE_PAGE_UP) {
			e.preventDefault();
			if (position.z < 15) {
				return position.shift(0, 0, 1);
			}
			return false;
		}
	}
	document.body.addEventListener("keydown", mapShift);
}(window.tw.Odyssey));
