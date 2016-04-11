/*jslint browser:true*/
/*globals jQuery*/
// TODO
goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.provide('Odyssey.View.NavigationList');
Odyssey.View.NavigationList = (function ($) {
    "use strict";
    var $body = $(document.body);
    function OdysseyNavigationList() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
    }
    extend(OdysseyNavigationList.prototype, new Odyssey.Events.EventDispatchInterface());

    // Hidden by default.
    OdysseyNavigationList.prototype.hidden = true;

    /**
     * Displays the navigation list.
     */
    OdysseyNavigationList.prototype.open = function openNavigationList() {
        $body.addClass('state-navlist-active');
        this.hidden = false;
    };

    /**
     * Hides the navigation list.
     */
    OdysseyNavigationList.prototype.close = function closeNavigationList() {
        $body.removeClass('state-navlist-active');
        this.hidden = true;
    };

    /**
     * Toggles the display of the navigation list.
     */
    OdysseyNavigationList.prototype.toggle = function toggleNavigationList() {
        if (this.hidden) {
            this.open();
        } else {
            this.close();
        }
    };

    return OdysseyNavigationList;
}(jQuery));
