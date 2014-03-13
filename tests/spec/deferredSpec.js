describe("The deferred object", function () {
    it("Should contains the right properties", function () {
        var d = deferred();

        expect(d.promise.done).toBeDefined();
        expect(d.promise.fail).toBeDefined();
        expect(d.promise.isRejected).toBeDefined();
        expect(d.promise.isResolved).toBeDefined();
        expect(d.reject).toBeDefined();
        expect(d.resolve).toBeDefined();
        expect(d.promise).toBeDefined();
    });

    it("Should return a promise with the right properties", function() {
        var p = deferred().promise;

        expect(p.done).toBeDefined();
        expect(p.fail).toBeDefined();
        expect(p.isRejected).toBeDefined();
        expect(p.isResolved).toBeDefined();
        expect(p.resolve).not.toBeDefined();
    });

    it("Should only notify 'done' callbacks when resolved", function () {
        var d = deferred();
        var promise = d.promise;

        var calls = {
            done: function (param) {
                console.log("done " + param);
            },
            fail: function (param) {
                console.log("fail " + param);
            }
        };

        spyOn(calls, "done");
        spyOn(calls, "fail");

        promise.done(calls.done).fail(calls.fail);

        d.resolve("Resolved");

        expect(calls.done).toHaveBeenCalled();
        expect(calls.fail).not.toHaveBeenCalled();
    });

    it("Should only notify 'done' callbacks when resolved, even callbacks added after the fact", function () {
        var d = deferred();
        var promise = d.promise;

        var calls = {
            done: function (param) {
                console.log("done " + param);
            },
            fail: function (param) {
                console.log("fail " + param);
            }
        };

        spyOn(calls, "done");
        spyOn(calls, "fail");

        promise.done(calls.done).fail(calls.fail);

        d.resolve("Resolved");

        promise.done(calls.done);

        expect(calls.done.calls.length).toBe(2);
        expect(calls.fail).not.toHaveBeenCalled();
    });

    it("Should only notify 'fail' callbacks when rejected", function () {
        var d = deferred();
        var promise = d.promise;

        var calls = {
            done: function (param) {
                console.log("done " + param);
            },
            fail: function (param) {
                console.log("fail " + param);
            }
        };

        spyOn(calls, "done");
        spyOn(calls, "fail");

        promise.done(calls.done).fail(calls.fail);

        d.reject("Rejected");

        expect(calls.done).not.toHaveBeenCalled();
        expect(calls.fail).toHaveBeenCalled();
    });

    it("Should only notify 'fail' callbacks when rejected, even callbacks added after the fact", function () {
        var d = deferred();
        var promise = d.promise;

        var calls = {
            done: function (param) {
                console.log("done " + param);
            },
            fail: function (param) {
                console.log("fail " + param);
            }
        };

        spyOn(calls, "done");
        spyOn(calls, "fail");

        promise.done(calls.done).fail(calls.fail);

        d.reject("Rejected");

        promise.fail(calls.fail);

        expect(calls.done).not.toHaveBeenCalled();
        expect(calls.fail.calls.length).toBe(2);
    });

    it("Should tell me if it has been resolved", function() {
        var d = deferred();
        var promise = d.promise;

        d.resolve("solved");

        expect(promise.isResolved()).toBe(true);
        expect(promise.isRejected()).toBe(false);
    });

    it("Should tell me if it has been rejected", function() {
        var d = deferred();
        var promise = d.promise;

        d.reject("fail");

        expect(promise.isRejected()).toBe(true);
        expect(promise.isResolved()).toBe(false);
    });
});
