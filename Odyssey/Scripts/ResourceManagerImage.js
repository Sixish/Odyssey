/*jslint browser: true, bitwise: true, devel:true */
/*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile */
var ResourceManagerImage = (function () {
    "use strict";
    function ResourceManagerImage(src) {
        this.src = src;
        this.events = {};
        this.resource = null;
        this.state = 0;
    }
    ResourceManagerImage.FLAG_LOADED = 1;
    ResourceManagerImage.FLAG_LOAD_FAILED = 2;
    ResourceManagerImage.FLAG_LOADING = 4;
    // We can't accurately determine the error code for images. But we'll keep this for future.
    ResourceManagerImage.FLAG_NOT_FOUND = 8;
    // Unused flags
    ResourceManagerImage.FLAG_A = 16;
    ResourceManagerImage.FLAG_A = 32;
    ResourceManagerImage.FLAG_A = 64;
    ResourceManagerImage.FLAG_A = 128;
    ResourceManagerImage.FLAG_A = 256;
    ResourceManagerImage.FLAG_A = 512;
    ResourceManagerImage.FLAG_A = 1024;
    ResourceManagerImage.FLAG_A = 2048;
    ResourceManagerImage.FLAG_A = 4096;
    ResourceManagerImage.FLAG_A = 8192;
    ResourceManagerImage.FLAG_A = 16384;
    ResourceManagerImage.FLAG_A = 32768;
    ResourceManagerImage.FLAG_A = 65536;
    ResourceManagerImage.FLAG_A = 131072;
    ResourceManagerImage.FLAG_A = 262144;
    ResourceManagerImage.FLAG_A = 524288;
    ResourceManagerImage.FLAG_A = 1048576;

    ResourceManagerImage.prototype.isLoaded = function () {
        return Boolean(this.state & ResourceManagerImage.FLAG_LOADED);
    };
    ResourceManagerImage.prototype.setIsLoaded = function (flag) {
        if (this.isLoaded() !== flag) {
            this.state ^= ResourceManagerImage.FLAG_LOADED;
        }
    };

    ResourceManagerImage.prototype.isLoading = function () {
        return Boolean(this.state & ResourceManagerImage.FLAG_LOADING);
    };

    ResourceManagerImage.prototype.setIsLoading = function (flag) {
        if (this.isLoading() !== flag) {
            this.state ^= ResourceManagerImage.FLAG_LOADING;
        }
    };

    ResourceManagerFile.prototype.isNotFound = function () {
        return Boolean(this.state & ResourceManagerFile.FLAG_NOT_FOUND);
    };
    ResourceManagerFile.prototype.setIsNotFound = function (flag) {
        if (this.isNotFound() !== flag) {
            this.state ^= ResourceManagerFile.FLAG_NOT_FOUND;
        }
    };

    ResourceManagerImage.prototype.hasFailed = function () {
        return Boolean(this.state & ResourceManagerImage.FLAG_LOAD_FAILED);
    };
    ResourceManagerImage.prototype.setLoadFailed = function (flag) {
        if (this.hasFailed() !== flag) {
            this.state ^= ResourceManagerImage.FLAG_LOAD_FAILED;
        }
    };

    ResourceManagerImage.prototype.setState = function (state) {
        this.state = state;
    };
    ResourceManagerImage.prototype.addEventListener = function (e, fn) {
        if (!this.events.hasOwnProperty(e)) {
            this.events[e] = [];
        }
        this.events[e].push(fn);
    };
    ResourceManagerImage.prototype.fire = function (e) {
        var i, len, events;
        if (this.events.hasOwnProperty(e)) {
            events = this.events[e];
            for (i = 0, len = events.length; i < len; i += 1) {
                events[i].call(this);
            }
        }
    };

    ResourceManagerImage.prototype.load = function () {
        var ctx = this;
        ctx.setIsLoading(true);
        if (!(this.resource instanceof Image)) {
            this.resource = new Image();
            this.resource.onload = function () {
                ctx.setIsLoaded(true);
                ctx.setIsLoading(false);
                ctx.fire('load');
            };
            this.resource.onerror = function () {
                ctx.setLoadFailed(true);
                ctx.setIsLoading(false);
                ctx.fire('error');
            };
        }

        this.resource.src = this.src;

        // Catch case where the cache contains the image.
        if (this.resource.complete) {
            ctx.setIsLoaded(true);
            ctx.setIsLoading(false);
            ctx.fire('load');
        }
    };

    ResourceManagerImage.prototype.getImage = function () {
        return this.resource;
    };
    return ResourceManagerImage;
}());