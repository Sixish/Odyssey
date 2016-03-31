/*jslint browser: true, bitwise: true, devel:true */
/*global extend, proxy, OdysseyEventDispatchInterface, OdysseyEventDispatcher, ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerFile, ResourceManagerPromise */
var ResourceManager = (function () {
    "use strict";
    function ResourceManager() {
        this.eventDispatcher = new OdysseyEventDispatcher();
        var fileUID = 0;

        this.spritesheets = [];

        // Sources to UID map.
        this.srcs = {};

        this.resources = [];

        // Source file prefix.
        this.prefix = "";

        // Getter for private fileUID.
        this.getUniqueFileID = function () {
            var id = fileUID;
            fileUID += 1;
            return id;
        };

        // File IDs awaiting load.
        this.resourcesAwaitingLoad = [];
        this.resourcesAwaitingLoadMap = {};

        // Event listeners.
        //this.addEventListener("OdysseyBinaryFileLoaded", proxy(this.stopLoader, this, null));
        //this.addEventListener("OdysseyBinaryFileLoaded", proxy(this.startLoader, this, null));
        this.addEventListener("OdysseyBinaryFileLoaded", proxy(this.filterAwaiting, this, null));
        this.addEventListener("OdysseyBinaryFileLoaded", proxy(this.loadNextResource, this, null));

        // The number of active loaders.
        this.activeLoaders = 0;
    }
    extend(ResourceManager.prototype, new OdysseyEventDispatchInterface());
    ResourceManager.MAX_CONNECTIONS = 1;

    // Gets the Bitmask ID (property name of the bitmask) for imageID.
    ResourceManager.getFileBitmaskID = function (imageID) {
        return Math.floor(imageID / 32);
    };
    // Gets the Bitmask value (if state is true) for imageID.
    ResourceManager.getFileBitmask = function (imageID) {
        return 1 << (imageID % 32);
    };

    // Set the filepath prefix.
    ResourceManager.prototype.setFilepathPrefix = function (path) {
        this.prefix = path;
    };

    /**
     * Manage a binary file.
     * @param src the filepath for the binary file.
     */
    ResourceManager.prototype.addBinaryFile = function (src) {
        var uid, filename, rmFile, bitmaskID;

        // Get a unique ID for the file.
        uid = this.getUniqueFileID();

        // The filename for the file.
        filename = this.prefix + src;

        // ResourceManagerFile will manage this file.
        rmFile = new ResourceManagerFile(filename);
        rmFile.setParentEventHandler(this.eventDispatcher);

        // Bitmask ID for the file.
        bitmaskID = ResourceManager.getFileBitmaskID(uid);

        this.resources[uid] = rmFile;
        this.srcs[filename] = uid;

        return uid;
    };

    ResourceManager.prototype.getValue = function (resourceID) {
        var bitmaskID, bitmask;
        bitmaskID = ResourceManager.getFileBitmaskID(resourceID);

        bitmask = ResourceManager.getFileBitmask(resourceID);
        return Boolean(this[bitmaskID] & bitmask);
    };

    ResourceManager.prototype.setValue = function (resourceID, value) {
        var bitmaskID, bitmask;
        if (value !== this.getValue(resourceID)) {
            bitmaskID = ResourceManager.getFileBitmaskID(resourceID);

            bitmask = ResourceManager.getFileBitmask(resourceID);
            this[bitmaskID] ^= bitmask;
            return true;
        }
        return false;
    };
    ResourceManager.prototype.getResource = function (index) {
        if (this.resources[index] === undefined) {
            //throw new Error("Resource not found at index " + index + ".");
            return null;
        }
        return this.resources[index];
    };
    ResourceManager.prototype.getResourceImage = function (index) {
        var file = this.getResource(index);
        if (file && file.resource instanceof Image) {
            return file.resource;
        }
    };
    ResourceManager.prototype.getResourceData = function (index) {
        var resource = this.getResource(index);
        if (resource) {
            return resource.getData();
        }
    };
    ResourceManager.prototype.isLoading = function () {
        var i, len = arguments.length, resource;
        for (i = 0; i < len; i += 1) {
            resource = this.getResource(arguments[i]);
            if (resource.isLoading()) {
                return true;
            }
        }
        return false;
    };

    ResourceManager.prototype.isLoaded = function () {
        var i, len = arguments.length, resource;
        for (i = 0; i < len; i += 1) {
            resource = this.getResource(arguments[i]);
            if (!resource.isLoaded()) {
                return false;
            }
        }
        return true;
    };

    ResourceManager.prototype.isNotFound = function () {
        var i, len = arguments.length, resource;
        for (i = 0; i < len; i += 1) {
            resource = this.getResource(arguments[i]);
            if (resource.isNotFound()) {
                return true;
            }
        }
        return false;
    };

    ResourceManager.prototype.hasFailed = function () {
        // Returns true if at least one has failed.
        var i, len = arguments.length, resource;
        for (i = 0; i < len; i += 1) {
            resource = this.getResource(arguments[i]);
            if (resource.hasFailed()) {
                return true;
            }
        }
        return false;
    };

    ResourceManager.prototype.isAwaitingLoad = function (o) {
        return this.resourcesAwaitingLoadMap.hasOwnProperty(o);
    };

    ResourceManager.prototype.setAwaitingLoad = function (id) {
        if (!this.isAwaitingLoad(id)) {
            this.resourcesAwaitingLoadMap[id] = 0;
            this.resourcesAwaitingLoad.push(id);
        }
        this.resourcesAwaitingLoadMap[id] += 1;
    };

    // TODO
    ResourceManager.prototype.filterAwaiting = function () {
        var i, len = this.resourcesAwaitingLoad.length, r, skip = 0;
        for (i = 0; i < len; i += 1) {
            r = this.getResource(this.resourcesAwaitingLoad[i]);
            // Order matters: the skip applies to the elements after
            // the pivot. Thus, reposition elements before checking if
            // they are removed.
            // Reposition the current element according to the number of
            // invalid entries prior to it.
            if (skip) {
                this.resourcesAwaitingLoad[i - skip] = this.resourcesAwaitingLoad[i];
            }
            // Check if the current element is invalid, ensuring next
            // elements will replace it.
            if (r === null || r.isLoaded()) {
                skip += 1;
            }
        }
        // We removed skip elements from the array; shrink it accordingly.
        this.resourcesAwaitingLoad.length -= skip;
    };

    ResourceManager.prototype.sortAwaiting = function () {
        var map = this.resourcesAwaitingLoadMap;
        this.resourcesAwaitingLoad.sort(function (a, b) {
            return (map[a] || 0) - (map[b] || 0);
        });
    };

    ResourceManager.prototype.start = function (n) {
        var i;
        // Let n = 1 if not set or 0.
        n = n || 1;
        // TODO
        //this.filterAwaiting();
        //this.sortAwaiting();
        this.resourceCount = this.resourcesAwaitingLoad.length;
        this.resourceIndex = this.resourceCount;
        for (i = 0; i < n; i += 1) {
            this.activeLoaders += 1;
            // TODO figure out why this is sometimes negative.
            this.loadNextResource();
        }
    };

    ResourceManager.prototype.stop = function (n) {
        this.activeLoaders -= n;
    };

    ResourceManager.prototype.stopLoader = function () {
        this.stop(1);
    };

    ResourceManager.prototype.startLoader = function () {
        this.start(1);
    };

    ResourceManager.prototype.load = function (id) {
        if (!(this.isLoading(id) || this.isLoaded(id))) {
            this.setAwaitingLoad(id);
            if (this.canOpenConnection()) {
                this.start(1);
            }
        }
    };

    ResourceManager.prototype.canOpenConnection = function () {
        return (this.activeLoaders < ResourceManager.MAX_CONNECTIONS);
    };

    ResourceManager.prototype.loadNextResource = function () {
        var id = this.getNextLoadResourceID();
        if (id === -1) {
            this.stop(1);
            return;
        }
        this.loadResource(id);
    };

    ResourceManager.prototype.getNextLoadResourceID = function () {
        var r, arr = this.resourcesAwaitingLoad;
        this.resourceIndex = arr.length;
        while (this.resourceIndex > 0) {
            this.resourceIndex -= 1;
            if (arr[this.resourceIndex] !== undefined) {
                r = this.getResource(arr[this.resourceIndex]);
                if (!(r.isLoaded() || r.isLoading())) {
                    return this.resourceIndex;
                }
            }
        }
        return -1;
    };

    ResourceManager.prototype.resourceExists = function (id) {
        return this.getResource(id) !== null;
    };

    ResourceManager.prototype.isBusy = function () {
        return (this.resourcesAwaitingLoad.length > 0);
    };

    ResourceManager.prototype.loadResource = function (id) {
        var resource = this.getResource(this.resourcesAwaitingLoad[id]),
            exists = (this.resourcesAwaitingLoad[id] !== undefined) && this.resourceExists(this.resourcesAwaitingLoad[id]);

        // Perform various checks on the resource to ensure it is awaiting load.
        // If it's loading or has loaded, we should skip this resource.
        // These checks should never catch anything, but it doesn't hurt to
        // ensure the resources are actually awaiting load.
        if (!exists) {
            // Strange. The resource does not exist? Oh well. Exit anyway.
            return;
        }
        if (resource.isLoaded()) {
            // Already loaded.
            return;
        }
        if (resource.isLoading()) {
            // Already loading. Another loading process must have loaded
            // this resource.
            return;
        }
        // Not loaded, so start loading it. When it's loaded we will
        // continue by listening to the load event.
        resource.load(resource.src);
    };

    ResourceManager.prototype.getResourceIDByFilename = function (filename) {
        return this.getResourceIDByFilenameWithPrefix(this.prefix + filename);
    };

    ResourceManager.prototype.getResourceIDByFilenameWithPrefix = function (filename) {
        if (!this.hasFileWithPrefix(filename)) {
            throw new Error("Resource " + filename + " does not exist.");
        }
        return this.srcs[filename];
    };

    ResourceManager.prototype.hasFile = function (filename) {
        return this.hasFileWithPrefix(this.prefix + filename);
    };

    ResourceManager.prototype.hasFileWithPrefix = function (filename) {
        return this.srcs.hasOwnProperty(filename);
    };

    return ResourceManager;
}());
