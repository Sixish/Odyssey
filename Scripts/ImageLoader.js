function ImageLoader() {
	// 32xN binary flag arrays
	this.loading = [];
	this.ready = [];
	// src to id map
	this.src = {};
	// the image pool
	this.imgPool = [];
	// image count
	this.count = 0;
}
ImageLoader.createImages = function (n) {
	while (n--) {
		img = new Image();
		img.onload = function () {
			
		};
	}
};
ImageLoader.prototype.reserve = function () {
	var img = this.imgPool[this.imgPool.length - 1];
	this.imgPool.length -= 1;
	return img;
};
ImageLoader.prototype.release = function (img) {
	this.imgPool.push(img);
};
ImageLoader.prototype.isReady = function (src) {
	var id = this.src[src];
	if (this.ready[id % 32] & (1 << id)) {
		return true;
	}
	return false;
};
ImageLoader.prototype.setReady = function (src, bool) {
	var id = this.src[src];
	this.ready[id % 32] = this.ready[id % 32] | (1 << id);
};
ImageLoader.prototype.load = function (src) {
	var that = this, img = this.getImage();
	img.addEventListener('load', function () {
		that.release(img);
	});
	img.src = src;
};
ImageLoader.prototype.add = function (src) {
	var id;
	console.assert(!this.src.hasOwnProperty(src), 'ImageLoader already contains src ' + src);
	id = this.count;
	this.count += 1;
	
	this.src[src] = id;
};
// Test:
var imgLoader = new ImageLoader();
ImageLoader.createImages(imgLoader);
for (var i = 0, len = spritesheets.length; i < len; i += 1) {
	imgLoader.add(spritesheets[i]);
}