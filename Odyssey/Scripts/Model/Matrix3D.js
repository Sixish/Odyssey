/*jslint devel:true */
goog.provide('Odyssey.Model.Matrix3D');
Odyssey.Model.Matrix3D = (function () {
    "use strict";
    /**
     * Creates a new Matrix3D. Generic matrix of 3 dimensions.
     * @param {Number} x The x component of the Matrix3D.
     * @param {Number} y The y component of the Matrix3D.
     * @param {Number} z The z component of the Matrix3D.
     * @constructor
     */
    function Matrix3D(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Sets the Matrix3D x, y, z components.
     * @param {Number} x The new X component.
     * @param {Number} y The new Y component.
     * @param {Number} z The new Z component.
     */
    Matrix3D.prototype.set = function set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    };

    /**
     * Sets the Matrix3D x, y, z components.
     * @param {Matrix3D} m2 The Matrix3D-like object whose x, y, z components are used.
     */
    Matrix3D.prototype.setEqual = function setEqual(m2) {
        this.set(m2.x, m2.y, m2.z);
    };

    /**
     * Shifts the Matrix3D x, y, z components.
     * @param {Number} offsetX the value to add to the x component.
     * @param {Number} offsetY the value to add to the y component.
     * @param {Number} offsetZ the value to add to the z component.
     * @returns {Matrix3D} the resulting Matrix3D object.
     */
    Matrix3D.prototype.shift = function (offsetX, offsetY, offsetZ) {
        console.assert(this.x !== null && this.y !== null && this.z !== null, "Cannot shift nulled matrix.");
        this.set(this.x + offsetX, this.y + offsetY, this.z + offsetZ);
        return this;
    };

    /**
     * Compares the x, y, z components.
     * @param {Number} x the value to compare with the x component.
     * @param {Number} y the value to compare with the y component.
     * @param {Number} z the value to compare with the z component.
     * @returns {Boolean} true if the input x, y, z match the values of the corresponding Matrix components; false otherwise.
     */
    Matrix3D.prototype.equals = function equals(x, y, z) {
        return this.x === x && this.y === y && this.z === z;
    };

    /**
     * Compares the x, y, z components of the Matrix3D.
     * @param {Matrix3D} m2 the Matrix3D-like object to compare against the context Matrix3D.
     * @returns {Boolean} true if the x, y, z components of both objects match.
     */
    Matrix3D.prototype.equalsMatrix = function (m2) {
        return this.equals(m2.x, m2.y, m2.z);
    };

    /**
     * Gets the string representation of the Matrix3D.
     * @returns {String} the string representation of the Matrix3D.
     */
    Matrix3D.prototype.toString = function () {
        return this.x + ", " + this.y + ", " + this.z;
    };
    return Matrix3D;
}());
