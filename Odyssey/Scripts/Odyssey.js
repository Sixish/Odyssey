window.tw = window.tw || {};
window.tw.Odyssey = window.tw.Odyssey || (function () {
	var odysseyMapRenderer = new OdysseyMapRenderer();
	
	odysseyMapRenderer.initialize(function () {
		// Thais Lighthouse
		//this.position.set(32343, 32255, 7);
		// Kazordoon Prison
		//this.position.set(32609, 31980, 11);
		// Hive
		this.position.set(0x82C3, 0x79DF, 7);
		this.setCanvas(document.getElementById("canvas-floor-7"));
	});
	
	setInterval((function () {
		var sPos = new Matrix3D(0, 0, 0),
			mPos = odysseyMapRenderer.position;
		return function () {
			if (mPos.x !== sPos.x || mPos.y !== sPos.y || mPos.z !== sPos.z) {
				odysseyMapRenderer.clear();
				odysseyMapRenderer.render();
				sPos.x = mPos.x;
				sPos.y = mPos.y;
				sPos.z = mPos.z;
				console.log("Rendered.");
			} else if (odysseyMapRenderer.failedRenderedTiles.length) {
				odysseyMapRenderer.renderSelective();
				//console.log("Rendered selective.");
			}
			if (odysseyMapRenderer.refreshRenderedTiles.length) {
				
			}
		};
	}()), 100);
	return odysseyMapRenderer;
}());