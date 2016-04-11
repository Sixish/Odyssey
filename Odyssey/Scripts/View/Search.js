/*jslint browser:true*/
/*global jQuery*/
goog.provide('Odyssey.View.Search');
Odyssey.View.Search = (function ($) {
    "use strict";
    var active = false,
        $header = $("#OdysseySearchHeader"),
        $body = $(document.body),
        $linkOpenSearch = $("#OdysseyOpenSearch");
    /**
     * Toggles the visibility of the search component.
     */
    function toggleSearch() {
        if (active) {
            $body.removeClass("state-search-active");
        } else {
            $body.addClass("state-search-active");
        }
        active = !active;
    }

    // Event listeners.
    $header.click(toggleSearch);
    $linkOpenSearch.click(toggleSearch);
    // Background click hides search.
    $("#OdysseySearchContainer > .OdysseyDarkenBackground").click(toggleSearch);
}(jQuery));
