(function () {
    "use strict";
    // Constants
    var MIN_MAP_X = 0,
        MIN_MAP_Y = 0,
        MAX_MAP_X = 256,
        MAX_MAP_Y = 256,
        savedMaps = {};

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

    function setData(msg) {
        extend(savedMaps, msg.data);
    }

    function resolveOffset(x, y) {
        return (x + (y << 8));
    }

    function getTile(map, x, y) {
        var offset = resolveOffset(x, y);

        return map && map.Map[offset];
    }

    function mapContainsItem(map, itemID) {
        return map.Items.indexOf(itemID) !== -1;
    }

    function mapContainsOneOfItem(map, itemIDs) {
        var i, len = itemIDs.length;
        for (i = 0; i < len; i += 1) {
            if (mapContainsItem(map, itemIDs[i])) {
                return true;
            }
        }
        return false;
    }

    function tileContainsItem(tile, itemID) {
        var i, len;
        if (tile.hasOwnProperty('Items')) {
            len = tile.Items.length;
            for (i = 0; i < len; i += 1) {
                if (tile.Items[i].ID === itemID) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    function getTileAbsolutePosition(map, x, y) {
        return {
            x: map.BaseX + x,
            y: map.BaseY + y,
            z: map.BaseZ
        };
    }

    function tileContainsCreature(tile, creature) {
        if (tile.hasOwnProperty('creatures')) {
            return tile.creatures.indexOf(creature) !== -1;
        }
        return false;
    }

    function searchMap(map, o) {
        var mapX, mapY, i, len, searchItems, searchCreatures, tile, results = [], itemsFound = [], creaturesFound = [], r;
        searchItems = (o && o.data && o.data.items) || [];
        searchCreatures = (o && o.data && o.data.creatures) || [];

        // Map files have a small array of items for fast searches.
        if (mapContainsOneOfItem(map, searchItems)) {
            for (mapX = MIN_MAP_X; mapX < MAX_MAP_X; mapX += 1) {
                for (mapY = MIN_MAP_Y; mapY < MAX_MAP_Y; mapY += 1) {
                    tile = getTile(map, mapX, mapY);
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
                            r.setPosition(getTileAbsolutePosition(map, mapX, mapY));

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
    function searchData(o) {
        var map, globalResultSet = [], result;
        for (map in savedMaps) {
            if (savedMaps.hasOwnProperty(map)) {
                result = searchMap(savedMaps[map], o);
                if (result && result.length) {
                    Array.prototype.push.apply(globalResultSet, result);
                }
            }
        }

        if (o.oncomplete) {
            o.oncomplete(globalResultSet);
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
                        id: msg.id,
                        type: "find"
                    };
                    postMessage(JSON.stringify(request));
                },
                oncomplete: function (results) {
                    var request = {
                        results: results,
                        id: msg.id,
                        type: "complete"
                    };
                    postMessage(JSON.stringify(request));
                }
            }));
        } else if (msg.action === 'send') {
            setData(msg);
        }
    };
}());
