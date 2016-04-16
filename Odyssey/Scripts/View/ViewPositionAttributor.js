goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Model.Matrix3D');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Events.EventDispatcher');
goog.provide('Odyssey.View.ViewPositionAttributor');

Odyssey.View.ViewPositionAttributor = (function () {
    "use strict";
    function OdysseyViewPositionAttributor() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
    }
    extend(OdysseyViewPositionAttributor.prototype, new Odyssey.Events.EventDispatchInterface());

    /**
     * Sets the current map position of the View. This method should be used
     * instead of position's set method because it registers an event
     * for listeners.
     * @param {Number} x the new x-coordinate.
     * @param {Number} y the new y-coordinate.
     * @param {Number} z the new z-coordinate.
     */
    OdysseyViewPositionAttributor.prototype.setPosition = function (x, y, z) {
        this.position.set(x, y, z);
        this.dispatchEvent(new Odyssey.Events.MapPositionChangedEvent(this, this.position));
    };

    /**
     * Gets the map position.
     * @returns {Matrix3D} the map position.
     */
    OdysseyViewPositionAttributor.prototype.getPosition = function () {
        return this.position;
    };

    return OdysseyViewPositionAttributor;
}());

