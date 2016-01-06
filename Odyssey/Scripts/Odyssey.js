/*jslint browser: true, bitwise: true, devel:true */
/*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile, OdysseyMapSearchEvent, Worker, OdysseyMapRenderer, OdysseyMiniMapRenderer */
/* Odyssey.js
 * Initializes the Odyssey Map Renderer.
 * Tasks:
 *   Create the dependencies.
 *   Assign the MapFile to a queue.
 *   Set the starting MapPosition.
 *   Expose API.
 */
var Odyssey = window.Odyssey || (function () {
    "use strict";
    var dat = Dat.load("Odyssey/Data/dat.json"),
        odysseyMapRenderer = new OdysseyMapRenderer(),
        odysseyMiniMapRenderer = new OdysseyMiniMapRenderer(),
        resourceManagerMaps = new ResourceManager(),
        resourceManagerSprites = new ResourceManager(),
        requestAnimationFrame = window.requestAnimationFrame;

    // Resource Managers
    resourceManagerMaps.setFilepathPrefix("Odyssey/Maps/");
    resourceManagerSprites.setFilepathPrefix("Odyssey/Sprites/");
    
    // Map Renderer
    odysseyMapRenderer.initialize(dat, resourceManagerSprites, resourceManagerMaps);
    odysseyMapRenderer.setSize(11, 11);
    odysseyMapRenderer.setCanvas('northwest', document.getElementById("OdysseyMapCanvas-NW"), [-1, -1]);
    odysseyMapRenderer.setCanvas('north', document.getElementById("OdysseyMapCanvas-N"), [0, -1]);
    odysseyMapRenderer.setCanvas('northeast', document.getElementById("OdysseyMapCanvas-NE"), [1, -1]);
    odysseyMapRenderer.setCanvas('west', document.getElementById("OdysseyMapCanvas-W"), [-1, 0]);
    odysseyMapRenderer.setCanvas('pivot', document.getElementById("OdysseyMapCanvas-P"), [0, 0]);
    odysseyMapRenderer.setCanvas('east', document.getElementById("OdysseyMapCanvas-E"), [1, 0]);
    odysseyMapRenderer.setCanvas('southwest', document.getElementById("OdysseyMapCanvas-SW"), [-1, 1]);
    odysseyMapRenderer.setCanvas('south', document.getElementById("OdysseyMapCanvas-S"), [0, 1]);
    odysseyMapRenderer.setCanvas('southeast', document.getElementById("OdysseyMapCanvas-SE"), [1, 1]);
    //odysseyMapRenderer.position.set(32255, 32648, 13);
    odysseyMapRenderer.position.set(0x82A0, 0x79FF, 0x0F);
    // Minimap
    odysseyMiniMapRenderer.setCanvas(document.getElementById("OdysseyMiniMapCanvas"));
    odysseyMiniMapRenderer.initialize(odysseyMapRenderer, dat);
    window.mmr = odysseyMiniMapRenderer;

    requestAnimationFrame((function () {
        var sPos = new Matrix3D(0, 0, 0),
            mPos = odysseyMapRenderer.position;
        return function update() {
            if (mPos.x !== sPos.x || mPos.y !== sPos.y || mPos.z !== sPos.z) {
                //odysseyMapRenderer.clear();
                odysseyMapRenderer.render();
                odysseyMiniMapRenderer.update();
                sPos.x = mPos.x;
                sPos.y = mPos.y;
                sPos.z = mPos.z;
            } else if (odysseyMapRenderer.failedRenderedTiles.length) {
                // render() handles everything now.
                if (odysseyMapRenderer.render()) {
                    odysseyMiniMapRenderer.update();
                }

            }

            requestAnimationFrame(update);
        };
    }()));//, 100);
    return odysseyMapRenderer;
}());