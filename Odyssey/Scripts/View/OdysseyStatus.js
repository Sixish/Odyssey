/*global extend, OdysseyEventDispatchInterface, OdysseyTileMap
/** OdysseyStatus.js
 * Creates an interface to display the current status of the web app.
 * Since the web app requires a lot of resources, the user should be
 * informed of the progress so that they do not assume it is stuck.
 */
var OdysseyStatus = (function ($) {
    "use strict";
    function OdysseyStatus() {
        /**
         * The event dispatcher. Manages Odyssey events.
         */
        this.eventDispatcher = new OdysseyEventDispatcher();

        this.ui = {};
    }
    extend(OdysseyTileMap.prototype, new OdysseyEventDispatchInterface());

    OdysseyStatus.prototype.getStatusTextField = function () {
        return this.ui.statusText;
    };
    OdysseyStatus.prototype.setStatusTextField = function (element) {
        this.ui.statusText = element;
    };

    OdysseyStatus.prototype.setContainer = function (element) {
        this.ui.container = element;
    };
    OdysseyStatus.prototype.getContainer = function () {
        return this.ui.container;
    };

    OdysseyStatus.prototype.setProgressBar = function (element) {
        this.ui.progressBar = element;
    };
    OdysseyStatus.prototype.getProgressBar = function () {
        return this.ui.progressBar;
    };

    OdysseyStatus.prototype.setStatusText = function (txt) {
        $(this.getStatusTextField()).text(txt);
    };

    OdysseyStatus.prototype.setProgress = function (percent) {
        this.progress = percent;
        $(this.getProgressBar()).width((100 * percent) + "%");
    };
    OdysseyStatus.prototype.update = function () {
        // TODO.
    };

    return OdysseyStatus;
}(jQuery));