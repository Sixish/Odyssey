/*jslint browser: true, bitwise: true, devel:true */
/*global ResourceManager, Matrix3D, OdysseyCanvasSection, Dat, jQuery, MapFile, MapFileParserResult, MapFileParser, ResourceManagerImage, ResourceManagerFile, ResourceManagerPromise, BinaryFile */
var ResourceManagerFile = (function ($) {
    "use strict";
    function ResourceManagerFile(src) {
        this.src = src;
        this.events = {};
        this.resource = null;
        this.state = 0;
    }
    ResourceManagerFile.FLAG_LOADED = 1;
    ResourceManagerFile.FLAG_LOAD_FAILED = 2;
    ResourceManagerFile.FLAG_LOADING = 4;
    ResourceManagerFile.FLAG_NOT_FOUND = 8;
    // Unused flags
    ResourceManagerFile.FLAG_A = 16;
    ResourceManagerFile.FLAG_A = 32;
    ResourceManagerFile.FLAG_A = 64;
    ResourceManagerFile.FLAG_A = 128;
    ResourceManagerFile.FLAG_A = 256;
    ResourceManagerFile.FLAG_A = 512;
    ResourceManagerFile.FLAG_A = 1024;
    ResourceManagerFile.FLAG_A = 2048;
    ResourceManagerFile.FLAG_A = 4096;
    ResourceManagerFile.FLAG_A = 8192;
    ResourceManagerFile.FLAG_A = 16384;
    ResourceManagerFile.FLAG_A = 32768;
    ResourceManagerFile.FLAG_A = 65536;
    ResourceManagerFile.FLAG_A = 131072;
    ResourceManagerFile.FLAG_A = 262144;
    ResourceManagerFile.FLAG_A = 524288;
    ResourceManagerFile.FLAG_A = 1048576;

    ResourceManagerFile.prototype.isLoaded = function () {
        return Boolean(this.state & ResourceManagerFile.FLAG_LOADED);
    };
    ResourceManagerFile.prototype.setIsLoaded = function (flag) {
        if (this.isLoaded() !== flag) {
            this.state ^= ResourceManagerFile.FLAG_LOADED;
        }
    };

    ResourceManagerFile.prototype.isLoading = function () {
        return Boolean(this.state & ResourceManagerFile.FLAG_LOADING);
    };

    ResourceManagerFile.prototype.setIsLoading = function (flag) {
        if (this.isLoading() !== flag) {
            this.state ^= ResourceManagerFile.FLAG_LOADING;
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

    ResourceManagerFile.prototype.hasFailed = function () {
        return Boolean(this.state & ResourceManagerFile.FLAG_LOAD_FAILED);
    };
    ResourceManagerFile.prototype.setLoadFailed = function (flag) {
        if (this.hasFailed() !== flag) {
            this.state ^= ResourceManagerFile.FLAG_LOAD_FAILED;
        }
    };

    ResourceManagerFile.prototype.setState = function (state) {
        this.state = state;
    };
    ResourceManagerFile.prototype.addEventListener = function (e, fn) {
        if (!this.events.hasOwnProperty(e)) {
            this.events[e] = [];
        }
        this.events[e].push(fn);
    };
    ResourceManagerFile.prototype.fire = function (e) {
        var i, len, events;
        if (this.events.hasOwnProperty(e)) {
            events = this.events[e];
            for (i = 0, len = events.length; i < len; i += 1) {
                events[i].call(this);
            }
        }
    };

    ResourceManagerFile.prototype.load = function () {
        var ctx = this;
        ctx.setIsLoading(true);
        if (!(this.resource instanceof BinaryFile)) {
            this.resource = new BinaryFile();
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

        // Load the BinaryFile src using AJAX.

        $.ajax({
            url: this.src,
            dataType: 'text',
            success: function (r) {
                ctx.resource.setContents(r);
                if (ctx.resource.onload !== null) {
                    ctx.resource.onload();
                }
            },
            error: function (e) {
                if (ctx.resource.onerror !== null) {
                    ctx.resource.onerror();
                }
            }
        });
    };

    ResourceManagerFile.prototype.getData = function () {
        return this.resource;
    };
    ResourceManagerFile.prototype.getResourceContents = function () {
        return ((this.resource && this.resource.contents) || null);
    };
    return ResourceManagerFile;
}(jQuery));