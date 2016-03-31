/*jslint browser: true*/
/*global jQuery*/
/** DelayLoad.js
 * Reduces page load time by delaying image loading to
 * after DOM is ready.
 */
(function ($) {
    "use strict";
    $(window).load(function () {
        $("img[data-src]").each(function () {
            $(this).attr("src", $(this).data('src'));
        });
    });
}(jQuery));