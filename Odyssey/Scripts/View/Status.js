///*global extend*/
/* OdysseyStatus.js
 * Creates an interface to display the current status of the web app.
 * Since the web app requires a lot of resources, the user should be
 * informed of the progress so that they do not assume it is stuck.
 */
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.View.TileMap');
goog.provide('Odyssey.View.Status');
Odyssey.View.Status = (function ($) {
    "use strict";
    /**
     * Creates a status view component.
     * @constructor
     */
    function OdysseyStatus() {
        /**
         * The event dispatcher. Manages Odyssey events.
         */
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();

        this.ui = {};
    }
    extend(OdysseyStatus.prototype, new Odyssey.Events.EventDispatchInterface());

    /**
     * Gets the status text field DOM element.
     * @param {Object} element the DOM element used for the status text.
     */
    OdysseyStatus.prototype.getStatusTextField = function () {
        return this.ui.statusText;
    };

    /**
     * Sets the status text field DOM element.
     * @param {Object} element the DOM element to use for the status text.
     */
    OdysseyStatus.prototype.setStatusTextField = function (element) {
        this.ui.statusText = element;
    };

    /**
     * Sets the container of the status view component.
     * @param {Object} element the DOM element to use for the container.
     */
    OdysseyStatus.prototype.setContainer = function (element) {
        this.ui.container = element;
    };

    /**
     * Gets the container of the status view component.
     * @returns {Object} the DOM element used for the container.
     */
    OdysseyStatus.prototype.getContainer = function () {
        return this.ui.container;
    };

    /**
     * Sets the progress bar DOM element.
     * @param {Object} element the DOM element to use for the progress bar.
     */
    OdysseyStatus.prototype.setProgressBar = function (element) {
        this.ui.progressBar = element;
    };

    /**
     * Gets the progress bar DOM element.
     * @returns {Object} the progress bar's DOM element.
     */
    OdysseyStatus.prototype.getProgressBar = function () {
        return this.ui.progressBar;
    };

    /**
     * Sets the text for the status view component.
     * @param {String} txt the text to display on the view component.
     */
    OdysseyStatus.prototype.setStatusText = function (txt) {
        $(this.getStatusTextField()).text(txt);
    };

    /**
     * Sets the progress for the progress bar.
     * @param {Number} percent the percentage to use between 0 and 1.
     */
    OdysseyStatus.prototype.setProgress = function (percent) {
        this.progress = percent;
        $(this.getProgressBar()).width((100 * percent) + "%");
    };

    /**
     * Updates the status view component.
     */
    OdysseyStatus.prototype.update = function () {
        // TODO.
    };

    return OdysseyStatus;
}(jQuery));
