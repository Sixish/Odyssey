/*jslint browser: true, bitwise: true, devel:true */
/*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile, OdysseyMapSearchEvent, Worker */
(function () {
    "use strict";
    /* Utility functions */
    function extend(a, b) {
        var p;
        for (p in b) {
            if (b.hasOwnProperty(p)) {
                a[p] = b[p];
            }
        }
        return a;
    }

    function OdysseySearchResult() {
        this.position = {};
        this.items = [];
        this.creatures = [];
    }
    OdysseySearchResult.prototype.setPosition = function (o) {
        this.position.x = o.x;
        this.position.y = o.y;
        this.position.z = o.z;
    };
    OdysseySearchResult.prototype.setItems = function (items) {
        Array.prototype.push.apply(this.items, items);
    };
    OdysseySearchResult.prototype.setCreatures = function (creatures) {
        Array.prototype.push.apply(this.creatures, creatures);
    };

    var savedMap = {};

    function setData(msg) {
        extend(savedMap, msg.data);
    }

    function resolveOffset(x, y, z) {
        return (x + (y << 8) + (z << 16));
    }

    function getTile(map, x, y, z) {
        var offset = resolveOffset(x, y, z);

        return map && map.structure && map.structure[offset];
    }

    function tileContainsItem(tile, itemID) {
        if (tile.hasOwnProperty('items')) {
            var i, len = tile.items.length;
            for (i = 0; i < len; i += 1) {
                if (tile.items[i].id === itemID) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    function getTileAbsolutePosition(map, x, y, z) {
        return {
            x: (map.baseX << 8) + x,
            y: (map.baseY << 8) + y,
            z: z
        };
    }

    function tileContainsCreature(tile, creature) {
        if (tile.hasOwnProperty('creatures')) {
            return tile.creatures.indexOf(creature) !== -1;
        }
        return false;
    }

    function searchData(o) {
        var mapX,
            mapY,
            mapZ,
            map,
            minMapX,
            minMapY,
            minMapZ,
            maxMapX,
            maxMapY,
            maxMapZ,
            i,
            len,
            searchItems = (o && o.data && o.data.items) || [],
            searchCreatures = (o && o.data && o.data.creatures) || [],
            tile,
            results = [],
            itemsFound = [],
            creaturesFound = [],
            r;

        minMapX = minMapY = minMapZ = 0;
        maxMapX = maxMapY = 256;
        maxMapZ = 16;

        for (map in savedMap) {
            if (savedMap.hasOwnProperty(map)) {
                for (mapX = minMapX; mapX < maxMapX; mapX += 1) {
                    for (mapY = minMapY; mapY < maxMapY; mapY += 1) {
                        for (mapZ = minMapZ; mapZ < maxMapZ; mapZ += 1) {

                            tile = getTile(savedMap[map], mapX, mapY, mapZ);

                            if (tile) {

                                for (i = 0, len = searchItems.length; i < len; i += 1) {
                                    if (tileContainsItem(tile, searchItems[i])) {
                                        itemsFound.push(searchItems[i]);
                                    }
                                }

                                for (i = 0, len = searchCreatures.length; i < len; i += 1) {
                                    if (tileContainsCreature(tile, searchCreatures[i])) {
                                        creaturesFound.push(searchCreatures[i]);
                                    }
                                }

                                if (itemsFound.length || creaturesFound.length) {
                                    r = new OdysseySearchResult();
                                    r.setPosition(getTileAbsolutePosition(savedMap[map], mapX, mapY, mapZ));

                                    if (itemsFound.length) {
                                        r.setItems(itemsFound);
                                        itemsFound = [];
                                    }

                                    if (creaturesFound.length) {
                                        r.setCreatures(creaturesFound);
                                        creaturesFound = [];
                                    }

                                    if (o.onfind) {
                                        o.onfind(r);
                                    }

                                    results.push(r);
                                }

                            }

                        }
                    }
                }
            }
        }

        if (o.oncomplete) {
            o.oncomplete(results);
        }

    }

    onmessage = function (e) {
        var msg = JSON.parse(e.data);

        // Handle search.
        if (msg.action === 'search') {
            searchData(extend(msg, {
                onfind: function (result) {
                    var request = {
                        result: result,
                        requestID: msg.requestID,
                        status: "find"
                    };
                    postMessage(JSON.stringify(request));
                },
                oncomplete: function (results) {
                    var request = {
                        results: results,
                        requestID: msg.requestID,
                        status: "complete"
                    };
                    postMessage(JSON.stringify(request));
                }
            }));
        }
        if (msg.action === 'send') {
            setData(msg);
        }
    };
}());