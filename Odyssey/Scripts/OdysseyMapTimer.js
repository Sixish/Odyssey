setInterval((function () {
	var sPos = new Matrix3D(0, 0, 0),
		mPos = omr.position;
	return function () {
		if (mPos.x !== sPos.x || mPos.y !== sPos.y || mPos.z !== sPos.z) {
			omr.clear();
			omr.render();
			sPos.x = mPos.x;
			sPos.y = mPos.y;
			sPos.z = mPos.z;
			console.log("Rendered.");
		} else if (omr.failedRenderedTiles.length) {
			omr.renderSelective();
			//console.log("Rendered selective.");
		}
		if (omr.refreshRenderedTiles.length) {
			
		}
	};
}()), 100);