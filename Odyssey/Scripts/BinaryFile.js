function BinaryFile() {
	this.onerror = null;
	this.onload = null;
	this.contents = null;
}

BinaryFile.prototype.setContents = function (string) {
	this.contents = string;
};