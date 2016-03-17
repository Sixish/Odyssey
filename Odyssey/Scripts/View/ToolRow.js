/*jslint browser:true*/
/*global jQuery*/
(function ($) {
    "use strict";
    var active = false,
        $linkToggleIcons = $("#OdysseyOpenToolRow"),
        $body = $(document.body);
    function toggleToolRow() {
        if (active) {
            $body.removeClass("state-tools-active");
        } else {
            $body.addClass("state-tools-active");
        }
        active = !active;
    }

    // Event listeners.
    $linkToggleIcons.click(toggleToolRow);
}(jQuery));
