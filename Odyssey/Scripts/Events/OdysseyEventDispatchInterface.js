/**
 * OdysseyEventDispatchInterface.js
 * Provides the necessary methods for classes implementing event dispatchers.
 * This class should not be used alone, but instead should be used as an
 * extension of an object's prototype.
 */
var OdysseyEventDispatchInterface = (function () {
    "use strict";
    function OdysseyEventDispatchInterface() {}

    /**
     * Gets the object's parent event handler.
     * @returns the object's parent event handler.
     */
    OdysseyEventDispatchInterface.prototype.getParentEventHandler = function () {
        return this.eventDispatcher.getParentEventHandler();
    };

    /**
     * Sets the object's parent event handler. This event handler will receive
     * bubbling events.
     * @param parent the event handler to receive bubbling events.
     */
    OdysseyEventDispatchInterface.prototype.setParentEventHandler = function (parent) {
        this.eventDispatcher.setParentEventHandler(parent);
    };
    /**
     * Binds an event listener to be called when the event is triggered.
     * @param type the event type.
     * @param fn the function to call when the event is triggered.
     */
    OdysseyEventDispatchInterface.prototype.addEventListener = function (type, fn) {
        this.eventDispatcher.addListener(type, fn);
    };

    /**
     * Removes an event listener so that it is no longer called when
     * the event is triggered.
     * @param type the event type.
     * @param fn the function to remove.
     */
    OdysseyEventDispatchInterface.prototype.removeEventListener = function (type, fn) {
        this.eventDispatcher.removeListener(type, fn);
    };

    /**
     * Dispatches an event.
     */
    OdysseyEventDispatchInterface.prototype.dispatchEvent = function (event, defaultAction) {
        this.eventDispatcher.dispatch(this, event);
        if (!event.defaultPrevented && defaultAction !== undefined) {
            defaultAction.call(this, event);
        }
    };

    return OdysseyEventDispatchInterface;
}());
