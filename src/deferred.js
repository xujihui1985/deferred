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
        var Status = {
            PENDING: 0,
            RESOLVED: 'done',
            REJECTED: 'fail'
        },
        module = {
            callbacks: {
                done: [],
                fail: []
            },
            currentStatus: Status.PENDING,
            reason: null,
            publicInterface: {
                promise: {}
            }
        };

    // The Promise Resolution Procedure
    module.end = function (toStatus, x) {
        if (!module.isPending()) {
            return;
        }

        if (module.publicInterface.promise === x) {
            module.currentStatus = Status.REJECTED;
            module.reason = 'TypeError';
        }

        // TODO Fix this check to see if "x" is a promise
        if (x && (x.then instanceof Function)) {
            module.publicInterface.promise = x;
        }

        //if (!(x instanceof Function) && !(x instanceof Object)) {
            module.currentStatus = toStatus;
            module.reason = x;
        //}

        module.invokeCallbacks(module.callbacks[module.currentStatus]);
    };

    module.invokeCallbacks = function (callbacks) {
        setTimeout(function (callbackList) {
            callbackList.forEach(function (callback) {
                if (callback instanceof Function) {
                    callback(this.reason);
                }
            }.bind(this));
        }.bind(module, callbacks), 5);
    };

    module.isPending = function () {
        return module.currentStatus === Status.PENDING;
    };

    module.attach = function (callbacksToAttachTo, newCallbacks, shouldRunCallbacks) {
        if (module.isPending()) {
            newCallbacks.forEach(function (callback) {
                if (callback instanceof Function) {
                    callbacksToAttachTo.push(callback);
                }
            });
        } else if (shouldRunCallbacks) {
            module.invokeCallbacks(newCallbacks);
        }
    };

    // Resolves the deferred object
    module.publicInterface.resolve = function (value) {
        module.end(Status.RESOLVED, value);

        return module.publicInterface;
    };

    // Resolves the deferred object
    module.publicInterface.reject = function (reason) {
        module.end(Status.REJECTED, reason);

        return module.publicInterface;
    };

    /********** PROMISE **********/

    module.publicInterface.promise.getStatus = function () {
        return module.currentStatus;
    };

    module.publicInterface.promise.done = function () {
        var newCallbacks = Array.prototype.slice.apply(arguments);
        module.attach(module.callbacks.done, newCallbacks, module.currentStatus === Status.RESOLVED);

        return module.publicInterface.promise;
    };

    module.publicInterface.promise.fail = function () {
        var newCallbacks = Array.prototype.slice.apply(arguments);
        module.attach(module.callbacks.fail, newCallbacks, module.currentStatus === Status.REJECTED);

        return module.publicInterface.promise;
    };

    module.publicInterface.promise.then = function(onFulfilled, onRejected) {
        if (onFulfilled instanceof Function) {
            module.publicInterface.promise.done(onFulfilled);
        }
        if (onRejected instanceof Function) {
            module.publicInterface.promise.fail(onRejected);
        }
        return module.publicInterface.promise;
    };

    // Return only the public properties
    return module.publicInterface;
}));

