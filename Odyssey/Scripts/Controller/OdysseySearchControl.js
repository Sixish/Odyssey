/*jslint browser: true*/
/*global jQuery, extend, OdysseyMapSearch, OdysseyModelAttributor, OdysseyViewAttributor, OdysseyEventDispatchInterface, OdysseyEventDispatcher*/
var OdysseySearchControl = (function ($) {
    "use strict";
    /** @const */
    var KEYCODE_ENTER = 13;

    /**
     * Constructor for search controls.
     * @constructor
     */
    function OdysseySearchControl() {
        this.eventDispatcher = new OdysseyEventDispatcher();
        this.mouseIsDown = false;
    }
    extend(OdysseySearchControl.prototype, new OdysseyEventDispatchInterface());
    extend(OdysseySearchControl.prototype, new OdysseyViewAttributor());
    extend(OdysseySearchControl.prototype, new OdysseyModelAttributor());

    /**
     * Initializes the search control.
     */
    OdysseySearchControl.prototype.initialize = function () {
        var ctx = this;
        ctx.searcher = new OdysseyMapSearch();
        ctx.searcher.setParentEventHandler(ctx.eventDispatcher);

        // Open search.
        $("#OdysseyOpenSearch").click(function () {
            $(document.body).toggleClass("state-search-active");
        });

        // Close search.
        $("#OdysseySearchContainer > .OdysseyDarkenBackground, #OdysseySearchHeader").click(function () {
            $(document.body).toggleClass("state-search-active");
        });

        /**
         * Performs the search with the input information.
         */
        function performSearch() {
            var $results, $positions, $criteria, i = 0, o;
            $results = $("#OdysseySearchResultsContainer li");
            $positions = $("#OdysseySearchResultsContainer li .search-position");
            $criteria = $("#OdysseySearchResultsContainer li .search-criteria");
            $results.removeClass('active').addClass('inactive');

            /**
             * Handles the search on find event.
             * @param {Object} e the search event that fired.
             */
            function handleSearchFind(e) {
                var result = e.result;
                $($results[i]).removeClass('inactive').addClass('active');
                $($criteria[i]).text(result.items.join(", "));
                $($positions[i]).text(result.position.x + ", " + result.position.y + ", " + result.position.z);
                i += 1;
            }

            /**
             * Handles the search on complete event.
             * @param {Object} e the search event that fired.
             */
            function handleSearchComplete(e) {
                // Completed search.
            }

            // Send the data to the worker.
            ctx.searcher.sendData(ctx.getModel().maps);
            o = {
                items: [
                    parseInt($("#OdysseySearchItemID").val(), 10)
                ]
            };
            ctx.searcher.find(o, handleSearchFind, handleSearchComplete);
        }

        /**
         * Handles input field key presses.
         * @param {Object} e the keypress event that fired.
         */
        function handleSearchKeyInput(e) {
            // Submit the search when the user presses enter.
            if (e.keyCode === KEYCODE_ENTER) {
                e.preventDefault();
                e.stopPropagation();
                performSearch();
            }
        }
        /**
         * Handles search button click.
         * @param {Object} e the click event that fired.
         */
        function handleSearchClick(e) {
            e.stopPropagation();
            performSearch();
        }
        // Handle key input.
        $("#OdysseySearchItemID").keypress(handleSearchKeyInput);
        // Submit search request.
        $("#OdysseySearchSubmit").click(handleSearchClick);
    };

    return OdysseySearchControl;
}(jQuery));
