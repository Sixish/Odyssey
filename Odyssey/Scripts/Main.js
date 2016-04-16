/* Main.js.
 * Main entry point for the TibiaOdyssey web application.
 * Creates an Odyssey instance, which represents the state
 * of the web application.
 */
goog.require('Odyssey.Events.InitializedEvent');
goog.require('Odyssey.Model.Model');
goog.require('Odyssey.Model.Dat');
goog.require('Odyssey.Generics.ResourceManager');
goog.require('Odyssey.Model.MapIndex');
goog.require('Odyssey.Model.World');
goog.require('Odyssey.Model.Geography');
goog.require('Odyssey.Model.WorldSpawns');
goog.require('Odyssey.View.View');
goog.require('Odyssey.View.SpriteIndex');
goog.require('Odyssey.View.ToolRow');
goog.require('Odyssey.View.Minimap');
goog.require('Odyssey.View.TileMap');
goog.require('Odyssey.View.Overlay');
goog.require('Odyssey.View.TileInfo');
goog.require('Odyssey.View.Status');
goog.require('Odyssey.View.NavigationList');
goog.require('Odyssey.Controller.Controller');
goog.require('Odyssey.Controller.OverlayControl');
goog.require('Odyssey.Controller.ControlManager');
goog.require('Odyssey.Controller.ToolRowControl');
goog.require('Odyssey.Controller.LinkClickControl');
goog.require('Odyssey.Controller.WorldMapControl');
goog.require('Odyssey.Controller.SearchControl');
goog.require('Odyssey.Controller.NavigationControl');
goog.require('Odyssey.Controller.NavigationMenuControl');
goog.require('Odyssey.Odyssey');
goog.require('Odyssey.View.DelayLoad');
goog.provide('Odyssey.main');
Odyssey.main = (function () {
    "use strict";
    var odyssey = new Odyssey.Odyssey(),
        /** The number of dependencies before we can start the core features. */
        dependencies = 2,// dat, sprite index,
        /** The number of dependencies that have already loaded. */
        dependenciesLoaded = 0,
        /** The minimum allowed value for the position x component. @const */
        POS_MIN_X = 31744,
        /** The maximum allowed value for the position x component. @const */
        POS_MAX_X = 33791,//33536;
        /** The minimum allowed value for the position y component. @const */
        POS_MIN_Y = 30976,
        /** The maximum allowed value for the position y component. @const */
        POS_MAX_Y = 33279,//33024;
        /** The minimum allowed value for the position z component. @const */
        POS_MIN_Z = 0,//0;
        /** The maximum allowed value for the position z component. @const */
        POS_MAX_Z = 15;//15;

    /**
     * Left-pads a string until it is of a given length.
     * @param {string} str the string to pad.
     * @param {string} padding the string to use as padding.
     * @param {number} length the length of the output string.
     */
    function padLeft(str, padding, length) {
        while (str.length < length) {
            str += padding;
        }
        return str;
    }

    /**
     * Declares that a dependency has loaded.
     */
    function dependencyLoaded() {
        dependenciesLoaded += 1;
        if (dependenciesLoaded >= dependencies) {
            odyssey.dispatchEvent(new Odyssey.Events.InitializedEvent());
        }
    }

    // Model.
    odyssey.setModel((function () {
        var model = new Odyssey.Model.Model();
        model.setParentEventHandler(odyssey.eventDispatcher);

        // Dat.
        model.setDat((function () {
            var dat = Odyssey.Model.Dat.load("Odyssey/Data/dat.json");
            dat.addEventListener("OdysseyDatLoaded", dependencyLoaded);
            return dat;
        }()));

        // Resource Manager (maps)
        model.setResourceManager((function () {
            var resourceManager = new Odyssey.Generics.ResourceManager();
            resourceManager.setFilepathPrefix("Odyssey/Maps/");
            return resourceManager;
        }()));

        // Map Index.
        model.setMapIndex((function () {
            var mapIndex = new Odyssey.Model.MapIndex();
            mapIndex.setStartPosition(POS_MIN_X, POS_MIN_Y, POS_MIN_Z);
            mapIndex.setEndPosition(POS_MAX_X, POS_MAX_Y, POS_MAX_Z);
            mapIndex.addToResourceManager(model.getResourceManager());
            return mapIndex;
        }()));

        // World.
        model.setWorld((function () {
            var world = new Odyssey.Model.World();
            world.setParentEventHandler(model.eventDispatcher);
            return world;
        }()));

        // Geography.
        model.setGeography((function () {
            var geo = new Odyssey.Model.Geography();
            geo.setParentEventHandler(model.eventDispatcher);
            return geo;
        }()));

        // World Spawns.
        model.setWorldSpawns((function () {
            var spawns = new Odyssey.Model.WorldSpawns();
            spawns.setParentEventHandler(model.eventDispatcher);
            return spawns;
        }()));

        return model;
    }()));

    // View.
    odyssey.setView((function () {
        var view = new Odyssey.View.View();
        view.setParentEventHandler(odyssey.eventDispatcher);
        // View needs a reference to the model.
        view.setModel(odyssey.getModel());
        // Global event listeners.
        odyssey.addEventListener("OdysseyInitialized", Odyssey.View.View.updateProxy(view));
        odyssey.addEventListener("OdysseyBinaryFileLoaded", Odyssey.View.View.updateProxy(view));
        odyssey.addEventListener("OdysseyMapZoomChange", Odyssey.View.View.updateProxy(view));
        odyssey.addEventListener("OdysseyMapPositionChange", Odyssey.View.View.updateProxy(view));

        // Resource Manager (sprites).
        view.setResourceManager((function () {
            var resourceManager = new Odyssey.Generics.ResourceManager();
            resourceManager.setFilepathPrefix("Odyssey/Sprites/");
            return resourceManager;
        }()));

        // Sprite Index.
        view.setSpriteIndex((function () {
            var spriteIndex = Odyssey.View.SpriteIndex.load("Odyssey/Data/SpriteSheetIndex.json");

            /**
             * Populates the resource manager.
             */
            function populate() {
                Odyssey.View.SpriteIndex.populateResourceManager(spriteIndex, view.getResourceManager());
            }

            // Attach the event listeners.
            spriteIndex.addEventListener('OdysseySpriteIndexLoaded', dependencyLoaded);
            spriteIndex.addEventListener("OdysseySpriteIndexLoaded", populate);

            // If by chance the file already loaded.
            if (spriteIndex.isLoaded) {
                populate();
                dependencyLoaded();
            }
            return spriteIndex;
        }()));

        view.setToolRow((function () {
            var toolRow = new Odyssey.View.ToolRow();
            toolRow.setToggleElement(document.getElementById("OdysseyOpenToolRow"));
            return toolRow;
        }()));

        // Minimap.
        view.setMinimap((function () {
            var minimap = new Odyssey.View.Minimap();
            minimap.setParentEventHandler(view.eventDispatcher);
            minimap.setCanvas(document.getElementById("OdysseyMinimapCanvas"));

            return minimap;
        }()));

        // World Map.
        view.setWorldMap((function () {
            var wm = new Odyssey.View.WorldMap(), z, maxZ;
            wm.setParentEventHandler(view.eventDispatcher);
            // Set the WorldMap's DOM structure.
            wm.setWrapperElement(document.getElementById("OdysseyLargeMinimap"));
            wm.setMapViewportElement(document.getElementById("OdysseyMinimapViewport"));
            wm.setMapContainerElement(document.getElementById("OdysseyMinimapContainer"));
            wm.setFocusAreaElement(document.getElementById("OdysseyMinimapActive"));
            for (z = 0, maxZ = 16; z < maxZ; z += 1) {
                wm.setMapImageElement(z, document.getElementById("MinimapFloor" + padLeft(String(z), "0", 2)));
            }
            return wm;
        }()));

        // Tile Map.
        view.setTileMap((function () {
            var tileMap = new Odyssey.View.TileMap();
            tileMap.setParentEventHandler(view.eventDispatcher);
            // tile map needs a reference to the view.
            tileMap.setView(view);

            tileMap.setContainer(document.getElementById("map-container"));
            tileMap.setViewport(document.getElementById("map-viewport-translator"));
            // To debug non-graphical aspects, try setting the size lower.
            // This reduces the amount of sprites that need to load,
            // meaning faster load times.
            // Note that this does not adjust the size of the canvases.
            tileMap.setSize(23, 23);
            //tileMap.setSize(3, 3);
            // Canvases.
            tileMap.setCanvas(Odyssey.View.CanvasInterface.CANVAS_NORTHWEST_ID, document.getElementById("OdysseyMapCanvas-NW"));
            tileMap.setCanvas(Odyssey.View.CanvasInterface.CANVAS_NORTH_ID, document.getElementById("OdysseyMapCanvas-N"));
            tileMap.setCanvas(Odyssey.View.CanvasInterface.CANVAS_NORTHEAST_ID, document.getElementById("OdysseyMapCanvas-NE"));
            tileMap.setCanvas(Odyssey.View.CanvasInterface.CANVAS_WEST_ID, document.getElementById("OdysseyMapCanvas-W"));
            tileMap.setCanvas(Odyssey.View.CanvasInterface.CANVAS_PIVOT_ID, document.getElementById("OdysseyMapCanvas-P"));
            tileMap.setCanvas(Odyssey.View.CanvasInterface.CANVAS_EAST_ID, document.getElementById("OdysseyMapCanvas-E"));
            tileMap.setCanvas(Odyssey.View.CanvasInterface.CANVAS_SOUTHWEST_ID, document.getElementById("OdysseyMapCanvas-SW"));
            tileMap.setCanvas(Odyssey.View.CanvasInterface.CANVAS_SOUTH_ID, document.getElementById("OdysseyMapCanvas-S"));
            tileMap.setCanvas(Odyssey.View.CanvasInterface.CANVAS_SOUTHEAST_ID, document.getElementById("OdysseyMapCanvas-SE"));

            //tileMap.setPosition(32255, 32648, 13);
            tileMap.setPosition(32367, 32615, 7);
            
            view.addEventListener("OdysseyWorldMapHide", function () {
                var pos = this.getMapPosition();
                tileMap.setPosition(pos.x, pos.y, pos.z);
            });

            return tileMap;
        }()));

        // Overlay. Needs to be applied before the tile map has
        // its initial position / size.
        view.setOverlay((function () {
            var overlay = new Odyssey.View.Overlay(),
                tileMap = view.getTileMap();
            overlay.setParentEventHandler(view.eventDispatcher);

            // Set the initial position and size to match that of the tile map.
            overlay.setPosition(tileMap.getPosition().x, tileMap.getPosition().y, tileMap.getPosition().z);
            overlay.setSize(tileMap.sizeX, tileMap.sizeY);

            // Overlay Canvas.
            overlay.setCanvas(Odyssey.View.CanvasInterface.CANVAS_NORTHWEST_ID, document.getElementById("OdysseyMapCanvasOverlay-NW"));
            overlay.setCanvas(Odyssey.View.CanvasInterface.CANVAS_NORTH_ID, document.getElementById("OdysseyMapCanvasOverlay-N"));
            overlay.setCanvas(Odyssey.View.CanvasInterface.CANVAS_NORTHEAST_ID, document.getElementById("OdysseyMapCanvasOverlay-NE"));
            overlay.setCanvas(Odyssey.View.CanvasInterface.CANVAS_WEST_ID, document.getElementById("OdysseyMapCanvasOverlay-W"));
            overlay.setCanvas(Odyssey.View.CanvasInterface.CANVAS_PIVOT_ID, document.getElementById("OdysseyMapCanvasOverlay-P"));
            overlay.setCanvas(Odyssey.View.CanvasInterface.CANVAS_EAST_ID, document.getElementById("OdysseyMapCanvasOverlay-E"));
            overlay.setCanvas(Odyssey.View.CanvasInterface.CANVAS_SOUTHWEST_ID, document.getElementById("OdysseyMapCanvasOverlay-SW"));
            overlay.setCanvas(Odyssey.View.CanvasInterface.CANVAS_SOUTH_ID, document.getElementById("OdysseyMapCanvasOverlay-S"));
            overlay.setCanvas(Odyssey.View.CanvasInterface.CANVAS_SOUTHEAST_ID, document.getElementById("OdysseyMapCanvasOverlay-SE"));

            /**
             * Updates the overlay's position when the TileMap position changes.
             */
            function handlePositionChange(e) {
                overlay.setPosition(e.position.x, e.position.y, e.position.z);
                overlay.translate();
                //overlay.refresh();
            }
            //odyssey.addEventListener("OdysseyMapClick", handleOverlaySelect);
            //overlay.setParentEventHandler(view.eventDispatcher);
            view.getTileMap().addEventListener("OdysseyMapPositionChange", handlePositionChange);
            return overlay;
        }()));

        // Tile Info.
        view.setTileInfo((function () {
            var tileInfo = new Odyssey.View.TileInfo();
            tileInfo.setView(view);

            /**
             * Responds to the map click event to update the TileInfo object.
             * @param {OdysseyMapClickEvent} e the map click event being triggered.
             */
            function handleTileSelect(e) {
                tileInfo.showInfo(e.position.x, e.position.y, e.position.z);
            }

            odyssey.addEventListener("OdysseyMapClick", handleTileSelect);
            tileInfo.setParentEventHandler(view.eventDispatcher);
            return tileInfo;
        }()));

        view.setStatus((function () {
            var status = new Odyssey.View.Status();
            status.setContainer(document.getElementById("OdysseyStatus"));
            status.setStatusTextField(document.getElementById("ProgressText"));
            status.setProgressBar(document.getElementById("ProgressBar"));

            /**
             * Updates the progress bar in response to core files being loaded.
             * @TODO implement
             */
            function updateProgressBarLoadingCore() {
                var loading = 0, loaded = 0;
                loading += view.getModel().getResourceManager().getLoadingCount();
                loaded += view.getModel().getResourceManager().getLoadedCount();
                // Progress %
                status.setProgress(Math.floor(100 * (loaded || 0) / ((loading || 0) + (loaded || 1))) / 100);
            }

            /**
             * Updates the progress bar in response to sprites being loaded.
             */
            function updateProgressBarLoadingSprites() {
                var loading = 0, loaded = 0;
                // Loading.
                loading += view.getResourceManager().getLoadingCount();
                // Loaded.
                loaded += view.getResourceManager().getLoadedCount();
                // Progress %
                status.setStatusText("Loading Sprites (" + loaded + " / " + (loaded + loading) + ")");
                status.setProgress(Math.floor(100 * (loaded || 0) / (((loading || 0) + (loaded || 0)) || Infinity)) / 100);
            }
            odyssey.addEventListener("OdysseyBinaryFileLoaded", updateProgressBarLoadingSprites);

            return status;
        }()));

        view.setNavigationMenu((function () {
            var navList = new Odyssey.View.NavigationList();
            return navList;
        }()));

        return view;
    }()));

    // Controller.
    odyssey.setController((function () {
        var controller = new Odyssey.Controller.Controller();
        controller.setParentEventHandler(odyssey.eventDispatcher);

        controller.setControlManager((function () {
            var m = new Odyssey.Controller.ControlManager();
            m.setParentEventHandler(controller.eventDispatcher);
            // Controls will have a reference to the Model and View,
            // the control manager will provide these to them.
            // Controls should implement the initialize method if
            // their functionality relies on either the view or model.
            // The initialize method will be called after the controls
            // are provided reference to these.
            // Controls should implement:
            // - OdysseyViewAttributor, to get and set the View,
            // - OdysseyModelAttributor, to get and set the Model.
            m.setView(odyssey.getView());
            m.setModel(odyssey.getModel());

            // Tool row control.
            m.addControl((function () {
                var control = new Odyssey.Controller.ToolRowControl();
                return control;
            }()));

            // Odyssey link clicks.
            m.addControl((function () {
                var control = new Odyssey.Controller.LinkClickControl();
                return control;
            }()));

            // World Map controls.
            m.addControl((function () {
                var control = new Odyssey.Controller.WorldMapControl();
                return control;
            }()));

            // Search controls.
            m.addControl((function () {
                var control = new Odyssey.Controller.SearchControl();
                return control;
            }()));

            m.addControl((function () {
                var control = new Odyssey.Controller.NavigationControl();
                return control;
            }()));

            m.addControl((function () {
                var control = new Odyssey.Controller.NavigationMenuControl();
                return control;
            }()));

            m.addControl((function () {
                var control = new Odyssey.Controller.OverlayControl();
                return control;
            }()));

            return m;
        }()));

        return controller;
    }()));

    // Expose the Odyssey API.
    return odyssey;
}());
