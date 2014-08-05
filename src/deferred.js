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

    var OUTCOME = {
        done: 'done',
        fail: 'fail'
    },
    attach = function (callbacksToAttachTo, newCallbacks) {
        newCallbacks.forEach(function (callback) {
            if (typeof callback === 'function') {
                callbacksToAttachTo.push(callback);
            }
        });
    }, Promise, Deferred;

    Promise = function () {
        this.resolved = null;
        this.rejected = null;
        this.callbacks = {
            done:[],
            fail:[]
        };
    };

    Promise.prototype = {
        constructor: Promise,
        isClosed: function (){
            return (this.resolved || this.rejected) ? true : false;
        },
        isResolved: function () {
            return this.resolved !== null;
        },
        isRejected: function () {
            return this.rejected !== null;
        },
        _invokeCallbacks: function (callbacks, param) {
            callbacks.forEach(function (callback) {
                if (typeof callback === 'function') {
                    callback(param);
                }
            });
        },
        done: function () {
            var calls = Array.prototype.slice.call(arguments);
            if(!this.isClosed()) {
                attach(this.callbacks.done, calls, this.resolved);
            } else {
                this._invokeCallbacks(calls,this.resolved);
            }
            return this;
        },
        fail: function () {
            var calls = Array.prototype.slice.call(arguments);
            if(!this.isClosed()) {
                attach(this.callbacks.fail, calls, this.rejected);
            } else {
                this._invokeCallbacks(calls,this.rejected);
            }
            return this;
        },
        then: function (onFulfilled, onRejected) {
            if (typeof onFulfilled === 'function') {
                this.done(onFulfilled);
            }
            if (typeof onRejected === 'function') {
                this.fail(onRejected);
            }
            return this;
        },
        end: function (type, param){
            if (this.isClosed()) { return; }
            if (type === OUTCOME.done) {
                this.resolved = param;
            } else {
                this.rejected = param;
            }
            this._invokeCallbacks(this.callbacks[type], param);
            this.callbacks = null;
        },
    };

    Deferred = function () {
        this.promise = new Promise();
    };

    Deferred.prototype = {
        constructor: Deferred,
        resolve:  function () {
            this.promise.end(OUTCOME.done, Array.prototype.slice.call(arguments));
        },
        reject: function () {
            this.promise.end(OUTCOME.fail, Array.prototype.slice.call(arguments));
        },
    };

    return new Deferred();
}));
