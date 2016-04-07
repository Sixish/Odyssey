/*jslint browser: true, bitwise: true, devel:true */
/*global extend, ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerFile, ResourceManagerPromise, BinaryFile, OdysseyEventDispatcher, OdysseyEventDispatchInterface, OdysseyBinaryFileErrorEvent, OdysseyBinaryFileLoadedEvent*/
/** ResourceManagerFile.js
 *
 * Represents a resource managed binary file.
 */
/**
 * Creates a closure for the ResourceManagerFile class.
 * @param {jQuery} $ the jQuery instance.
 * @return {Function} the class constructor.
 */
var ResourceManagerFile = (function ($) {
    "use strict";
    /**
     * Constructor for resource managers.
     * @param {String} src the source URL of the file.
     * @constructor
     */
    function ResourceManagerFile(src) {
        this.eventDispatcher = new OdysseyEventDispatcher();
        this.src = src;
        this.resource = null;
        this.state = 0;
        this.contents = null;
    }
    extend(ResourceManagerFile.prototype, new OdysseyEventDispatchInterface());
    ResourceManagerFile.imageFormats = [".png"];
    /** Loaded flag. @const */
    ResourceManagerFile.FLAG_LOADED = 1;
    /** Load failed flag. @const */
    ResourceManagerFile.FLAG_LOAD_FAILED = 2;
    /** Loading flag. @const */
    ResourceManagerFile.FLAG_LOADING = 4;
    /** Not found flag. @const */
    ResourceManagerFile.FLAG_NOT_FOUND = 8;
    // Unused flags
    /** @const */
    ResourceManagerFile.FLAG_A = 16;
    /** @const */
    ResourceManagerFile.FLAG_A = 32;
    /** @const */
    ResourceManagerFile.FLAG_A = 64;
    /** @const */
    ResourceManagerFile.FLAG_A = 128;
    /** @const */
    ResourceManagerFile.FLAG_A = 256;
    /** @const */
    ResourceManagerFile.FLAG_A = 512;
    /** @const */
    ResourceManagerFile.FLAG_A = 1024;
    /** @const */
    ResourceManagerFile.FLAG_A = 2048;
    /** @const */
    ResourceManagerFile.FLAG_A = 4096;
    /** @const */
    ResourceManagerFile.FLAG_A = 8192;
    /** @const */
    ResourceManagerFile.FLAG_A = 16384;
    /** @const */
    ResourceManagerFile.FLAG_A = 32768;
    /** @const */
    ResourceManagerFile.FLAG_A = 65536;
    /** @const */
    ResourceManagerFile.FLAG_A = 131072;
    /** @const */
    ResourceManagerFile.FLAG_A = 262144;
    /** @const */
    ResourceManagerFile.FLAG_A = 524288;
    /** @const */
    ResourceManagerFile.FLAG_A = 1048576;

    /**
     * Creates a new ResourceManagerFile from the source.
     * @param {String} src the source of the file.
     */
    ResourceManagerFile.load = function (src) {
        var file = new ResourceManagerFile();
        file.load(src);
        return file;
    };

    /**
     * Returns the file's loaded state.
     * @returns {Boolean} true if the file has loaded, false otherwise.
     */
    ResourceManagerFile.prototype.isLoaded = function () {
        return Boolean(this.state & ResourceManagerFile.FLAG_LOADED);
    };

    /**
     * Sets the file's loaded sate.
     * @param {Boolean} flag the new loaded flag.
     */
    ResourceManagerFile.prototype.setIsLoaded = function (flag) {
        if (this.isLoaded() !== flag) {
            this.state ^= ResourceManagerFile.FLAG_LOADED;
        }
    };

    /**
     * Gets the file's loading flag.
     * @returns {Boolean} true if the file is loading, false otherwise.
     */
    ResourceManagerFile.prototype.isLoading = function () {
        return Boolean(this.state & ResourceManagerFile.FLAG_LOADING);
    };

    /**
     * Sets the file's loading state.
     * @param {Boolean} flag the new loading flag value.
     */
    ResourceManagerFile.prototype.setIsLoading = function (flag) {
        if (this.isLoading() !== flag) {
            this.state ^= ResourceManagerFile.FLAG_LOADING;
        }
    };

    /**
     * Gets the file's not found state.
     * @returns {Boolean} true if the file was not found, false otherwise.
     */
    ResourceManagerFile.prototype.isNotFound = function () {
        return Boolean(this.state & ResourceManagerFile.FLAG_NOT_FOUND);
    };

    /**
     * Sets the file's not found state.
     * @param {Boolean} flag the new not found flag state.
     */
    ResourceManagerFile.prototype.setIsNotFound = function (flag) {
        if (this.isNotFound() !== flag) {
            this.state ^= ResourceManagerFile.FLAG_NOT_FOUND;
        }
    };

    /**
     * Returns the has load failed flag.
     * @returns {Boolean} true if the file has failed to load.
     */
    ResourceManagerFile.prototype.hasFailed = function () {
        return Boolean(this.state & ResourceManagerFile.FLAG_LOAD_FAILED);
    };

    /**
     * Sets the load failed flag.
     * @param {Boolean} flag the new load failed flag value.
     */
    ResourceManagerFile.prototype.setLoadFailed = function (flag) {
        if (this.hasFailed() !== flag) {
            this.state ^= ResourceManagerFile.FLAG_LOAD_FAILED;
        }
    };

    /**
     * Sets the state of the file, overwriting existing state.
     * @param {Number} state state of the file.
     */
    ResourceManagerFile.prototype.setState = function (state) {
        this.state = state;
    };

    /**
     * Loads the ResourceManagerFile.
     * @param {String} src the URL of the file.
     */
    ResourceManagerFile.prototype.load = function (src) {
        var ext = src.slice(-4);
        if (ResourceManagerFile.imageFormats.indexOf(ext) !== -1) {
            this.loadImage(src);
        } else {
            this.loadBinary(src);
        }
    };

    /**
     * Loads the file assuming that it is an image file.
     * @param {String} src the URL of the file.
     */
    ResourceManagerFile.prototype.loadImage = function (src) {
        var ctx = this;
        if (ctx.isLoaded()) {
            return;
        }
        ctx.setIsLoading(true);
        if (!(this.resource instanceof Image)) {
            this.resource = new Image();
            this.resource.onload = function () {
                ctx.setIsLoading(false);
                if (!ctx.isLoaded()) {
                    ctx.setIsLoaded(true);
                    ctx.dispatchEvent(new OdysseyBinaryFileLoadedEvent(ctx));
                }
            };
            this.resource.onerror = function () {
                ctx.setIsLoading(false);
                ctx.setLoadFailed(true);
                ctx.dispatchEvent(new OdysseyBinaryFileErrorEvent(ctx));
            };
            this.resource.src = src;
        }

        // Catch case where the cache contains the image.
        if (this.resource.complete) {
            ctx.setIsLoading(false);
            if (!ctx.isLoaded()) {
                ctx.setIsLoaded(true);
                ctx.dispatchEvent(new OdysseyBinaryFileLoadedEvent(ctx));
            }
        }
    };

    /**
     * Loads the file assuming that it is a binary file.
     * @param {String} src the URL of the file.
     */
    ResourceManagerFile.prototype.loadBinary = function (src) {
        var ctx = this;
        ctx.setIsLoading(true);

        /**
         * Handles the successful loading of the binary file.
         * @param {Object} data the web server response.
         */
        function handleLoadSuccess(data) {
            ctx.setContents(data);
            ctx.setIsLoading(false);
            if (!ctx.isLoaded()) {
                ctx.setIsLoaded(true);
                ctx.dispatchEvent(new OdysseyBinaryFileLoadedEvent(ctx));
            }
        }

        /**
         * Handles the unsuccessful loading of the binary file.
         */
        function handleLoadError() {
            ctx.setIsLoading(false);
            ctx.setLoadFailed(true);
            ctx.dispatchEvent(new OdysseyBinaryFileErrorEvent(ctx));
        }

        $.ajax({
            url: src,
            dataType: 'json',
            success: handleLoadSuccess,
            error: handleLoadError
        });
    };

    /**
     * Gets the managed resource.
     * @returns {Image|BinaryFile} the resource being managed.
     */
    ResourceManagerFile.prototype.getResource = function () {
        return this.resource;
    };

    /**
     * Gets the managed resource's contents.
     * @returns {String} the resource's contents.
     */
    ResourceManagerFile.prototype.getResourceContents = function () {
        return ((this.resource && this.resource.contents) || null);
    };

    ResourceManagerFile.prototype.setContents = function (o) {
        this.contents = o;
    };
    return ResourceManagerFile;
}(jQuery));
