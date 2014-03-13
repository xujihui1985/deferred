(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory;
    } else {
        // Browser globals (root is window)
        root.deferred = factory;
    }
}(this, function () {
    'use strict';
    var callbacks = {
            done: [],
            fail: []
        },
        publicInterface = {
            promise: {}
        },
        resolved, rejected;

    // Ends the object by resolving or rejecting
    var end = function (type, param) {
        if (isClosed()) {
            return;
        }
        if (type === "done") {
            resolved = param;
        } else {
            rejected = param;
        }
        invokeCallbacks(callbacks[type], param);
    };

    var invokeCallbacks = function (callbacks, param) {
        callbacks.forEach(function (callback) {
            if (callback instanceof Function) {
                callback(param);
            }
        });
    };

    var isClosed = function () {
        return (resolved || rejected) ? true : false;
    };

    var attach = function (callbacksToAttachTo, newCallbacks, params, test) {
        if (!isClosed()) {
            newCallbacks.forEach(function (callback) {
                if (callback instanceof Function) {
                    callbacksToAttachTo.push(callback);
                }
            });
        } else if (test) {
            invokeCallbacks(newCallbacks, params);
        }
    };

    // Resolves the deferred object
    publicInterface.resolve = function () {
        end("done", Array.prototype.slice.apply(arguments));

        return publicInterface;
    };

    // Resolves the deferred object
    publicInterface.reject = function (param) {
        end("fail", Array.prototype.slice.apply(arguments));

        return publicInterface;
    };

    publicInterface.promise.isResolved = function () {
        return resolved !== undefined;
    };

    publicInterface.promise.isRejected = function () {
        return rejected !== undefined;
    };

    publicInterface.promise.done = function () {
        var calls = Array.prototype.slice.apply(arguments);
        attach(callbacks.done, calls, resolved, publicInterface.promise.isResolved());

        return publicInterface.promise;
    };

    publicInterface.promise.fail = function () {
        var calls = Array.prototype.slice.apply(arguments);
        attach(callbacks.fail, calls, rejected, publicInterface.promise.isRejected());

        return publicInterface.promise;
    };

    publicInterface.promise.then = function(onFulfilled, onRejected) {
        if (onFulfilled instanceof Function) {
            publicInterface.promise.done(onFulfilled);
        }
        if (onRejected instanceof Function) {
            publicInterface.promise.fail(onRejected);
        }
        return publicInterface.promise;
    };

    // Return only the public properties
    return publicInterface;
}));

