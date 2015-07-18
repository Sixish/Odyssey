(function (map, undefined) {
	$.ajax({
		url: 'dat.json',
		dataType: 'json',
		success: function (response) {
			// Expose
			map.data = response;
			map.dataLoaded = true;
		}
	});
}(window.tw.Odyssey));