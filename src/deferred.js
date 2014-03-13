var deferred = function () {
    var callbacks = {
            done: [],
            fail: []
        },
        public = {
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
    public.resolve = function () {
        end("done", Array.prototype.slice.apply(arguments));

        return public;
    };

    // Resolves the deferred object
    public.reject = function (param) {
        end("fail", Array.prototype.slice.apply(arguments));

        return public;
    };

    public.promise.isResolved = function () {
        return resolved !== undefined;
    };

    public.promise.isRejected = function () {
        return rejected !== undefined;
    };

    public.promise.done = function () {
        var calls = Array.prototype.slice.apply(arguments);
        attach(callbacks.done, calls, resolved, public.promise.isResolved());

        return public.promise;
    };

    public.promise.fail = function () {
        var calls = Array.prototype.slice.apply(arguments);
        attach(callbacks.fail, calls, rejected, public.promise.isRejected());

        return public.promise;
    };

    public.promise.then = function(onFulfilled, onRejected) {
        if (onFulfilled instanceof Function) {
            public.done(onFulfilled);
        }
        if (onRejected instanceof Function) {
            public.fail(onRejected);
        }
        return public.promise;
    };


    // Return only the public properties
    return public;
};
