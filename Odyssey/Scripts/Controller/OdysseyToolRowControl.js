var OdysseyToolRowControl = (function ($) {
    /**
     * Creates an instance of the tool row control.
     * @constructor
     */
    function OdysseyToolRowControl() {
        this.eventDispatcher = new OdysseyEventDispatcher();
    }
    extend(OdysseyToolRowControl.prototype, new OdysseyEventDispatchInterface());
    extend(OdysseyToolRowControl.prototype, new OdysseyModelAttributor());
    extend(OdysseyToolRowControl.prototype, new OdysseyViewAttributor());

    /**
     * Initializes the controls.
     */
    OdysseyToolRowControl.prototype.initialize = function () {
        var toolRow = this.getView().getToolRow();
        $(toolRow.getToggleElement()).click(function () {
            console.log(toolRow);
            toolRow.toggle();
        });
    };

    return OdysseyToolRowControl;
}(jQuery));
