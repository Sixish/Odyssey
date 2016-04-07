/*jslint browser: true, bitwise: true, devel:true */
/*global extend, proxy, OdysseyEventDispatchInterface, OdysseyEventDispatcher, ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerFile, ResourceManagerPromise */
var ResourceManager = (function () {
    "use strict";
    /**
     * Creates a resource manager.
     * @constructor
     */
    function ResourceManager() {
        var fileUID = 0;
        this.eventDispatcher = new OdysseyEventDispatcher();

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
        // Needed for progress %.
        this.loaded = [];

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

    /**
     * Gets the Bitmask ID (property name of the bitmask) for imageID.
     * @param {Number} imageID the image's ID.
     * @returns {Number} the property name of the bitmask for the image.
     * @static
     */
    ResourceManager.getFileBitmaskID = function (imageID) {
        return Math.floor(imageID / 32);
    };

    /**
     * Gets the Bitmask value (if state is true) for imageID.
     * @param {Number} imageID the image's ID.
     * @returns {Number} the resource's bitmask ID.
     * @static
     */
    ResourceManager.getFileBitmask = function (imageID) {
        return 1 << (imageID % 32);
    };

    /**
     * Sets the resource manager's filepath prefix.
     * @param {String} path the resource manager's filepath prefix.
     */
    ResourceManager.prototype.setFilepathPrefix = function (path) {
        this.prefix = path;
    };

    /**
     * Manage a binary file.
     * @param {String} src the filepath for the binary file.
     * @returns {Number} the file's resource ID.
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

    /**
     * Gets the status value of the resource of the given ID.
     * @param {Number} resourceID the resource's ID.
     * @returns {Number} the status value representing a set of bitflags.
     */
    ResourceManager.prototype.getValue = function (resourceID) {
        var bitmaskID, bitmask;
        bitmaskID = ResourceManager.getFileBitmaskID(resourceID);

        bitmask = ResourceManager.getFileBitmask(resourceID);
        return Boolean(this[bitmaskID] & bitmask);
    };

    /**
     * Sets the status value of the resource with the given resource ID.
     * @param {Number} resourceID the resource's ID.
     * @param {Number} value a number representing the status as a set of bitflags.
     * @returns {Boolean} true if the value changed; false otherwise.
     */
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

    /**
     * Gets the resource with the given ID.
     * @param {Number} index the resource's ID.
     * @TODO what does this return? ResourceManagerFile?
     */
    ResourceManager.prototype.getResource = function (index) {
        if (this.resources[index] === undefined) {
            //throw new Error("Resource not found at index " + index + ".");
            return null;
        }
        return this.resources[index];
    };

    /**
     * Gets the image of the resource with the given resource ID.
     * @param {Number} index the resource's ID.
     * @returns {Image|Null} the resource's image.
     */
    ResourceManager.prototype.getResourceImage = function (index) {
        var file = this.getResource(index);
        if (file && file.resource instanceof Image) {
            return file.resource;
        }
        return null;
    };

    /**
     * Gets the data of the resource with the given ID.
     * @param {Number} index the resource ID.
     * @returns {Object|Null} the resource's data.
     */
    ResourceManager.prototype.getResourceData = function (index) {
        var resource = this.getResource(index);
        if (resource) {
            return resource.getData();
        }
        return null;
    };

    /**
     * Checks if the resources are loading.
     * @param {...Number} the resource IDs to check.
     * @returns {Boolean} true if any resources are loading; false otherwise.
     */
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

    /**
     * Checks if the resources are loaded.
     * @param {...Number} the resource IDs to check.
     * @returns {Boolean} true if all resources are loaded; false otherwise.
     */
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

    /**
     * Checks if the resources were not found.
     * @param {...Number} the resource IDs to check.
     * @returns {Boolean} true if any resources were not found; false otherwise.
     */
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

    /**
     * Checks if the resource IDs are awaiting load.
     * @param {...Number} the resource IDs to check.
     * @returns {Boolean} true if any resources have failed; false otherwise.
     */
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

    /**
     * Checks if the resource with the given ID is awaiting load.
     * @param {Number} id the resource ID to check.
     * @returns {Boolean} true if the resource is awaiting load; false otherwise.
     * @TODO this is not true, returns true if it's already loaded.
     */
    ResourceManager.prototype.isAwaitingLoad = function (id) {
        return this.resourcesAwaitingLoadMap.hasOwnProperty(id);
    };

    /**
     * Sets the resource with the given resource as awaiting load.
     * @param {Number} id the resource ID to set as awaiting load.
     */
    ResourceManager.prototype.setAwaitingLoad = function (id) {
        if (!this.isAwaitingLoad(id)) {
            this.resourcesAwaitingLoadMap[id] = 0;
            this.resourcesAwaitingLoad.push(id);
        }
        this.resourcesAwaitingLoadMap[id] += 1;
    };

    /**
     * Filters out resources not awaiting load.
     * @TODO
     */
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
                this.loaded.push(r);
                skip += 1;
            }
        }
        // We removed skip elements from the array; shrink it accordingly.
        this.resourcesAwaitingLoad.length -= skip;
    };

    /**
     * Sorts resources awaiting to load by their priority.
     */
    ResourceManager.prototype.sortAwaiting = function () {
        var map = this.resourcesAwaitingLoadMap;
        /**
         * Determines the sort order of two items in an array.
         * @returns {Number} negative if the two items should be swapped; positive otherwise.
         */
        function sorter(a, b) {
            return (map[a] || 0) - (map[b] || 0);
        }
        // Handle sort.
        this.resourcesAwaitingLoad.sort(sorter);
    };

    /**
     * Starts n loaders.
     * @param {Number} n the number of loaders to start.
     */
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

    /**
     * Stops n loaders.
     * @param {Number} n the number of loaders to stop.
     */
    ResourceManager.prototype.stop = function (n) {
        this.activeLoaders -= n;
    };

    /**
     * Stops a loader.
     */
    ResourceManager.prototype.stopLoader = function () {
        this.stop(1);
    };

    /**
     * Starts a loader.
     */
    ResourceManager.prototype.startLoader = function () {
        this.start(1);
    };

    /**
     * Loads a resource of the given resource ID.
     * @param {Number} id the resource's ID.
     */
    ResourceManager.prototype.load = function (id) {
        if (!(this.isLoading(id) || this.isLoaded(id))) {
            this.setAwaitingLoad(id);
            if (this.canOpenConnection()) {
                this.start(1);
            }
        }
    };

    /**
     * Checks if another connection can be opened. That is,
     * checks if the resource manager has not exhausted its
     * open connections limit.
     * @returns {Boolean} true if the resource manager can
     * open another connection; false otherwise.
     */
    ResourceManager.prototype.canOpenConnection = function () {
        return (this.activeLoaders < ResourceManager.MAX_CONNECTIONS);
    };

    /**
     * Loads the next resource.
     */
    ResourceManager.prototype.loadNextResource = function () {
        var id = this.getNextLoadResourceID();
        if (id === -1) {
            this.stop(1);
            return;
        }
        this.loadResource(id);
    };

    /**
     * Gets the ID of the next resource awaiting load.
     * @returns {Number} the resource ID of the next loaded resource,
     * or -1 if all resources are loading or already loaded.
     */
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

    /**
     * Checks if a resource with the given ID exists.
     * @param {Number} id the resource ID.
     * @returns {Boolean} true if the resource identified by the
     * resource ID exists; false otherwise.
     */
    ResourceManager.prototype.resourceExists = function (id) {
        return this.getResource(id) !== null;
    };

    /**
     * Checks if the resource manager is busy loading files.
     * @returns {Boolean} true if the resource manager is currently loading files.
     */
    ResourceManager.prototype.isBusy = function () {
        return (this.resourcesAwaitingLoad.length > 0);
    };

    /**
     * Loads the resource with the given ID.
     * @param {Number} id the resource ID to load.
     */
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

    /**
     * Gets a resource ID by its filename, excluding its path prefix.
     * @returns {Number} the resource ID of the resource identified by the filename.
     */
    ResourceManager.prototype.getResourceIDByFilename = function (filename) {
        return this.getResourceIDByFilenameWithPrefix(this.prefix + filename);
    };

    /**
     * Gets a resource ID by its filename, including its path prefix.
     * @returns {Number} the resource ID of the resource identified by the filename.
     */
    ResourceManager.prototype.getResourceIDByFilenameWithPrefix = function (filename) {
        if (!this.hasFileWithPrefix(filename)) {
            throw new Error("Resource " + filename + " does not exist.");
        }
        return this.srcs[filename];
    };

    /**
     * Checks if a file exists with the given name, excluding its path prefix.
     * @returns {Boolean} true if the file with this name exists; false otherwise.
     */
    ResourceManager.prototype.hasFile = function (filename) {
        return this.hasFileWithPrefix(this.prefix + filename);
    };

    /**
     * Checks if a file exists with the given name, including its path prefix.
     * @returns {Boolean} true if the file with this name exists; false otherwise.
     */
    ResourceManager.prototype.hasFileWithPrefix = function (filename) {
        return this.srcs.hasOwnProperty(filename);
    };

    /**
     * Gets the amount of resources already loaded.
     * @returns {Number} the amount of resources already loaded.
     */
    ResourceManager.prototype.getLoadedCount = function () {
        return this.loaded.length;
    };

    /**
     * Gets the amount of resources being loaded.
     * @returns {Number} the amount of resources being loaded.
     */
    ResourceManager.prototype.getLoadingCount = function () {
        return this.resourcesAwaitingLoad.length;
    };

    return ResourceManager;
}());
