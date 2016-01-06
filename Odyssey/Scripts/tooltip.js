(function (map) {
	function setTooltipPosition(x, y, z) {
		
	}
	function updateTooltipPosition(x, y, z) {
		
	}
	// On each grid tile hover, set the focus position
	var $tooltip = $("#map-tooltip");
	var focusPosition = new Matrix3D(0, 0, 0);
	$("#map-grid > div").mouseover(function () {
		var $this = $(this), data = $this.data(), $offset, gridX, gridY;
		gridX = gridY = 0;
		gridX = data.gridX || 0;
		gridY = data.gridY || 0;
		offset = $this.offset();
		focusPosition.set(
			map.position.x + gridX,
			map.position.y + gridY,
			map.position.z
		);
		$tooltip.text("Position: " + focusPosition.toString());
	});
	window.$tt = $("#map-tooltip");
}(window && window.tw.Odyssey));