var deferred = function () {
    var callbacks = {
            done: [],
            fail: []
        },
        public = {},
        resolved, rejected;

    // Ends the object by resolving or rejecting
    var end = function (type, param) {
        if (isClosed()) {
            return;
        }
        type === "done" ? resolved = param : rejected = param;
        invokeCallbacks(callbacks[type], param);
    };

    var invokeCallbacks = function (callbacks, param) {
        callbacks.forEach(function (callback) {
            if (callback instanceof Function) {
                callback.apply(undefined, param);
            }
        });
    };

    var isClosed = function () {
        return (resolved || rejected) ? true : false;
    };

    var attach = function (callbacks, newCallbacks, params, test) {
        if (!isClosed()) {
            newCallbacks.forEach(function (el) {
                callbacks.push(el);
            });
        } else if (test) {
            invokeCallbacks(newCallbacks, params);
        }
    };

    public.resolve = function () {
        end("done", Array.prototype.slice.apply(arguments));

        return public;
    };

    public.reject = function (param) {
        end("fail", Array.prototype.slice.apply(arguments));

        return public;
    };

    public.isResolved = function () {
        return resolved !== undefined;
    };

    public.isRejected = function () {
        return rejected !== undefined;
    };

    public.done = function () {
        var calls = Array.prototype.slice.apply(arguments);
        attach(callbacks.done, calls, resolved, public.isResolved());

        return public;
    };

    public.fail = function () {
        var calls = Array.prototype.slice.apply(arguments);
        attach(callbacks.fail, calls, rejected, public.isRejected());

        return public;
    }

    public.promise = function () {
        return {
            done: public.done,
            fail: public.fail,
            isResolved: public.isResolved,
            isRejected: public.isRejected
        };
    };

    // Return only the public properties
    return public;
};
