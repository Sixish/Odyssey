/*jslint browser:true*/
/*globals jQuery*/
var navigationMenu = (function ($) {
    "use strict";
    var hidden = true,
        $showNavigation = $("#show-navigation"),
        $navListContainer = $("#OdysseyNavListContainer");

    /**
     * Displays the navigation list.
     */
    function showNavigationList() {
        $navListContainer.addClass('visible');
    }

    /**
     * Hides the navigation list.
     */
    function hideNavigationList() {
        $navListContainer.removeClass('visible');
    }

    /**
     * Toggles the display of the navigation list.
     */
    function toggleNavigationList() {
        if (hidden) {
            showNavigationList();
        } else {
            hideNavigationList();
        }
        hidden = !hidden;
    }

    /**
     * Handles the navigation link click event.
     */
    function handleNavigationLinkEvent() {
        toggleNavigationList();
        return false;
    }

    // Events
    $showNavigation.click(handleNavigationLinkEvent);

    return {
        'show': showNavigationList,
        'hide': hideNavigationList,
        'toggle': toggleNavigationList
    };
}(jQuery));