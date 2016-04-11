goog.require('Odyssey.Generics.extend');
goog.require('Odyssey.Events.EventDispatchInterface');
goog.require('Odyssey.Events.EventDispatcher');
goog.require('Odyssey.View.ViewAttributor');
goog.require('Odyssey.Model.ModelAttributor');
goog.provide('Odyssey.Controller.NavigationMenuControl');
Odyssey.Controller.NavigationMenuControl = (function ($) {
    "use strict";
    function OdysseyNavigationMenuControl() {
        this.eventDispatcher = new Odyssey.Events.EventDispatcher();
    }
    extend(OdysseyNavigationMenuControl.prototype, new Odyssey.Events.EventDispatchInterface());
    extend(OdysseyNavigationMenuControl.prototype, new Odyssey.View.ViewAttributor());
    extend(OdysseyNavigationMenuControl.prototype, new Odyssey.Model.ModelAttributor());

    OdysseyNavigationMenuControl.prototype.initialize = function () {
        // TODO REPLACE
        var ctx = this;
        $("#OdysseyOpenNavigation, #OdysseyCloseNavigation").click(function () {
            ctx.getView().getNavigationMenu().toggle();
        });
    };

    return OdysseyNavigationMenuControl;
}(jQuery));