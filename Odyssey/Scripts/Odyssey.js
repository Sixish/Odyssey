/*global extend, OdysseyEventDispatcher, OdysseyEventDispatchInterface, OdysseyControllerAttributor, OdysseyViewAttributor, OdysseyModelAttributor*/
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
    extend(Odyssey.prototype, new OdysseyEventDispatchInterface());
    extend(Odyssey.prototype, new OdysseyModelAttributor());
    extend(Odyssey.prototype, new OdysseyViewAttributor());
    extend(Odyssey.prototype, new OdysseyControllerAttributor());

    return Odyssey;
}());
