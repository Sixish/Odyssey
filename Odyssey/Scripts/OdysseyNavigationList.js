/*jslint browser:true*/
/*globals jQuery*/
var navigationMenu = (function ($) {
    "use strict";
    var hidden = true,
        $openNavigation = $("#OdysseyOpenNavigation"),
        $closeNavigation = $("#OdysseyCloseNavigation"),
        $navListContainer = $("#OdysseyNavList");

    /**
     * Displays the navigation list.
     */
    function openNavigationList() {
        $navListContainer.addClass('visible');
    }

    /**
     * Hides the navigation list.
     */
    function closeNavigationList() {
        $navListContainer.removeClass('visible');
    }

    /**
     * Toggles the display of the navigation list.
     */
    function toggleNavigationList() {
        if (hidden) {
            openNavigationList();
        } else {
            closeNavigationList();
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
    $openNavigation.click(handleNavigationLinkEvent);
    $closeNavigation.click(handleNavigationLinkEvent);

    return {
        'open': openNavigationList,
        'close': closeNavigationList,
        'toggle': toggleNavigationList
    };
}(jQuery));