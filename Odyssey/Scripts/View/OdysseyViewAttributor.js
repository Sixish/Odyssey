var OdysseyViewAttributor = (function () {
    "use strict";
    /**
     * Creates an OdysseyViewAttributor object. This should be used
     * to extend an existing constructor's prototype.
     * @constructor
     */
    function OdysseyViewAttributor() {}

    /**
     * Sets the view. This object should contain all information required
     * for rendering the map, given a reference to the model able to reconstruct
     * the map.
     * @param {OdysseyView} view the view. This must implement the OdysseyEventDispatchInterface
     * and have an eventDispatcher object field.
     */
    OdysseyViewAttributor.prototype.setView = function (view) {
        this.view = view;
    };

    /**
     * Gets the view.
     * @returns {OdysseyView} the view.
     */
    OdysseyViewAttributor.prototype.getView = function () {
        return this.view;
    };

    return OdysseyViewAttributor;
}());
