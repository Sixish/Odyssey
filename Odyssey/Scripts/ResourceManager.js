/*jslint browser: true, bitwise: true, devel:true */
/*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise */
var ResourceManager = (function () {
    "use strict";
    function ResourceManager() {
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
    }

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

    ResourceManager.prototype.addImage = function (src) {
        var uid, filename, rmImage, bitmaskID;

        // Get a unique ID for the file.
        uid = this.getUniqueFileID();

        // The filename for the image.
        filename = this.prefix + src;

        // ResourceManagerImage will manage this image.
        rmImage = new ResourceManagerImage(filename);

        // Bitmask ID for the file.
        bitmaskID = ResourceManager.getFileBitmaskID(uid);

        this.resources[uid] = rmImage;
        this.srcs[filename] = uid;

        return uid;
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

        // ResourceManagerImage will manage this file.
        rmFile = new ResourceManagerFile(filename);

        // Bitmask ID for the file.
        bitmaskID = ResourceManager.getFileBitmaskID(uid);

        this.resources[uid] = rmFile;
        this.srcs[filename] = uid;

        return uid;
    };

    /**
     * Gets the value of the 
     */
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
            throw new Error("Resource not found at index " + index + ".");
        }
        return this.resources[index];
    };
    ResourceManager.prototype.getResourceImage = function (index) {
        var resource = this.getResource(index);
        if (resource) {
            return resource.getImage();
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
            if (!resource.isLoading()) {
                return false;
            }
        }
        return true;
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

    ResourceManager.prototype.load = function () {
        var files = arguments, promise = new ResourceManagerPromise(), resource, loaded = 0, loading = 0, count = arguments.length, rm = this, onLoadImageProxy, onErrorImageProxy;

        // Controlled resource loading.
        function load(i) {
            if (files[i] === undefined) {
                return;
            }
            resource = rm.getResource(files[i]);
            loading = i;
            if (resource.isLoaded()) {
                loaded += 1;
                if (loaded === count) {
                    promise.fire('load');
                }
                load(i + 1);
            } else {
                if (!resource.isLoading()) {
                    resource.addEventListener("load", onLoadImageProxy(resource, i));
                    resource.addEventListener("error", onErrorImageProxy(resource, i));
                    resource.load();
                }
            }
        }

        onErrorImageProxy = function onErrorImageProxy(ctx, i) {
            return function () {
                loaded += 1;
                ctx.setLoadFailed();
                if (loaded === count) {
                    promise.fire('load');
                }
                load(i + 1);
            };
        };

        onLoadImageProxy = function onLoadImageProxy(ctx, i) {
            return function () {
                loaded += 1;
                ctx.setIsLoaded();
                if (loaded === count) {
                    promise.fire('load');
                }

                load(i + 1);
            };
        };

        load(0);
        return promise;
    };

    ResourceManager.prototype.getResourceIDByFilename = function (filename) {
        if (!this.hasFile(filename)) {
            throw new Error("Resource " + filename + " does not exist.");
        }
        return this.srcs[this.prefix + filename];
    };

    ResourceManager.prototype.hasFile = function (filename) {
        return this.srcs.hasOwnProperty(this.prefix + filename);
    };

    return ResourceManager;
}());