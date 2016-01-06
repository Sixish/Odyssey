(function (imap) {
	var $type = $("#select-type");
	var $typeItem = $("#search-type-item"),
		$typeArea = $("#search-type-area"),
		$typeNpc  = $("#search-type-npc"),
		$typeTile = $("#search-type-tile");
	var $visible = $();
	var mapNameToSearchGroup = {
		'tile': $typeTile,
		'area': $typeArea,
		'item': $typeItem,
		'npc': $typeNpc
	};
	function updateType(type) {
		$visible.hide();
		$visible = mapNameToSearchGroup[type];
		$visible.show();
	}
	$type.change(function () {
		updateType(this.value);
	});
}(window.tw.imap));