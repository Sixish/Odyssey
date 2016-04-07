var OdysseyModelAttributor = (function () {
    "use strict";
    /**
     * Creates a model attributor object. This should be used to
     * extend another object's prototype.
     * @constructor
     */
    function OdysseyModelAttributor() {}
    /**
     * Sets the model. This object should contain all information required
     * for reconstruction of the map, including: the map data, a Dat context.
     * @param {ODysseyModel} model the model. This must implement the OdysseyEventDispatchInterface
     * and have an eventDispatcher object field.
     */
    OdysseyModelAttributor.prototype.setModel = function (model) {
        this.model = model;
    };

    /**
     * Gets the model.
     * @returns {OdysseyModel} the model.
     */
    OdysseyModelAttributor.prototype.getModel = function () {
        return this.model;
    };

    return OdysseyModelAttributor;
}());
