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
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Model.ModelAttributor');
goog.require('Odyssey.View.ViewAttributor');
goog.require('Odyssey.Controller.ControllerAttributor');
goog.provide('Odyssey.Odyssey');
Odyssey.Odyssey = (function () {
    "use strict";

    /**
     * Constructor for the web application.
     * @constructor
     */
    function O() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
        this.model = null;
        this.view = null;
        this.controller = null;
    }
    extend(O.prototype, new Odyssey.Events.EventDispatchInterface());
    extend(O.prototype, new Odyssey.Model.ModelAttributor());
    extend(O.prototype, new Odyssey.View.ViewAttributor());
    extend(O.prototype, new Odyssey.Controller.ControllerAttributor());

    return O;
}());
