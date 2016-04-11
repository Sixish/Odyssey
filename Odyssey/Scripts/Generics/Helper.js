/*jslint browser: true*/
/* Helper functions */
goog.provide('Odyssey.Generics.extend');
// remove:
goog.provide('Odyssey.Generics.proxy');
goog.provide('Odyssey.Generics.count');
(function (ctx) {
    "use strict";

    /**
     * Returns a proxy function to allow context-changing.
     * @param {Function} fn the function to call.
     * @param {Object} ctx the context the function needs.
     * @param {Array} args an array of arguments to the parameter.
     * @returns {Function} a proxy function to call the provided function
     * with the specified context and arguments.
     */
    ctx.proxy = window.proxy = function proxy(fn, ctx, args) {
        return function () {
            fn.apply(ctx, args);
        };
    };

    ctx.count = window.count = function count(arr, val) {
        var cnt = 0, i, len = arr.length;
        for (i = 0; i < len; i += 1) {
            if (arr[i] === val) {
                cnt += 1;
            }
        }
        return cnt;
    };

    ctx.extend = window.extend = function (proto) {
        var k, i, o;
        for (i = arguments.length - 1; i > 0; i -= 1) {
            o = arguments[i];
            for (k in o) {
                // This implementation does not care if the
                // target object is inherited from object,
                // because it tries to emulate subclassing.
                proto[k] = o[k];
            }
        }
        return proto;
    };
}(Odyssey.Generics));
