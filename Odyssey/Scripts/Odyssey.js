/*global OdysseyEventDispatcher, OdysseyEventDispatchInterface*/
/** Odyssey.js
 * Initializes the Odyssey Map Renderer.
 * Tasks:
 * - establishes a link between the MVC components,
 * - provides a front-end API including event handlers,
 * - creates the starting state for the components.
 *
 * OdysseyModel.js        Main entry point for the Model.
 * OdysseyView.js         Main entry point for the View.
 * OdysseyController.js   Main entry point for the Controller.
 *
 * Rules :
 *   OdysseyModel : Model
 * - Stores the state of the map.
 * - Implements event handling, bubbling to Odyssey.
 * - Cannot access the View in any way.
 * - Cannot access the Controller in any way.
 *
 *   OdysseyView : View
 * - Stores the state of the rendered map.
 * - Updates the map, including changes to the DOM.
 * - Implements event handling, bubbling to Odyssey.
 * - Holds a reference to the Model.
 * - Cannot access the Controller in any way.
 *
 *   OdysseyController : Controller
 * - Stores the state of active controls.
 * - Implements event handling, bubbling to Odyssey.
 * - Holds a reference to the Model.
 * - Holds a reference to the View.
 */
var Odyssey = (function () {
    "use strict";

    /**
     * Constructor for the web application.
     * @constructor
     */
    function Odyssey() {
        this.eventDispatcher = new OdysseyEventDispatcher();
        this.model = null;
        this.view = null;
        this.controller = null;
    }
    Odyssey.prototype = new OdysseyEventDispatchInterface();

    /**
     * Sets the controller. This object should contain methods to bind controls.
     * @param {OdysseyController} controller the controller. This must implement the
     * OdysseyEventDispatchInterface and have an eventDispatcher object field.
     */
    Odyssey.prototype.setController = function (controller) {
        this.controller = controller;
        this.controller.setParentEventHandler(this.eventDispatcher);
    };

    /**
     * Gets the controller.
     * @returns {OdysseyController} the controller.
     */
    Odyssey.prototype.getController = function () {
        return this.controller;
    };

    /**
     * Sets the view. This object should contain all information required
     * for rendering the map, given a reference to the model able to reconstruct
     * the map.
     * @param {OdysseyView} view the view. This must implement the OdysseyEventDispatchInterface
     * and have an eventDispatcher object field.
     */
    Odyssey.prototype.setView = function (view) {
        this.view = view;
        this.view.setParentEventHandler(this.eventDispatcher);
    };

    /**
     * Gets the view.
     * @returns {OdysseyView} the view.
     */
    Odyssey.prototype.getView = function () {
        return this.view;
    };

    /**
     * Sets the model. This object should contain all information required
     * for reconstruction of the map, including: the map data, a Dat context.
     * @param {ODysseyModel} model the model. This must implement the OdysseyEventDispatchInterface
     * and have an eventDispatcher object field.
     */
    Odyssey.prototype.setModel = function (model) {
        this.model = model;
        this.model.setParentEventHandler(this.eventDispatcher);
    };

    /**
     * Gets the model.
     * @returns {OdysseyModel} the model.
     */
    Odyssey.prototype.getModel = function () {
        return this.model;
    };

    return Odyssey;
}());
