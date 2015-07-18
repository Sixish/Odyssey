/* Matrix3D class
 * Used for generic matrix objects
 */
function Matrix3D(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}
// State-changers
Matrix3D.prototype.set = function set(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};
Matrix3D.prototype.setEqual = function setEqual(m2) {
	this.x = m2.x;
	this.y = m2.y;
	this.z = m2.z;
};
Matrix3D.prototype.shift = function (offsetX, offsetY, offsetZ) {
	console.assert(this.x !== null && this.y !== null && this.z !== null, "Cannot shift nulled matrix.");
	this.x += offsetX;
	this.y += offsetY;
	this.z += offsetZ;
	return this;
};
// Comparators
Matrix3D.prototype.equals = function equals(x, y, z) {
	return this.x === x && this.y === y && this.z === z;
};
Matrix3D.prototype.equalsMatrix = function (m2) {
	return this.x === m2.x && this.y === m2.y && this.z == m2.z;
};
Matrix3D.prototype.equalToMatrix = function (matrix) {
	return (
		this.x === matrix.x &&
		this.y === matrix.y &&
		this.z === matrix.z
	);
};
Matrix3D.prototype.toString = function () {
	return this.x + ", " + this.y + ", " + this.z;
}
