describe('The deferred library', function () {
    beforeEach(function () {
        this.deferred = deferred();
        this.promise = this.deferred.promise;
        this.callbacks = {
            done: jasmine.createSpy('doneCallback'),
            fail: jasmine.createSpy('failCallback'),
        };
    });

    describe('the deferred object', function () {
        it('should contain the right properties', function () {
            expect(this.deferred.promise.done).toBeDefined();
            expect(this.deferred.promise.fail).toBeDefined();
            expect(this.deferred.promise.isRejected).toBeDefined();
            expect(this.deferred.promise.isResolved).toBeDefined();
            expect(this.deferred.reject).toBeDefined();
            expect(this.deferred.resolve).toBeDefined();
            expect(this.deferred.promise).toBeDefined();
        });

        it('should return a promise', function() {
            expect(this.promise).toBeDefined();
        });
    });

    describe('the promise object', function () {
        it('should contain the right properties', function() {
            expect(this.promise.done).toBeDefined();
            expect(this.promise.fail).toBeDefined();
            expect(this.promise.isRejected).toBeDefined();
            expect(this.promise.isResolved).toBeDefined();
            expect(this.promise.resolve).not.toBeDefined();
            expect(this.promise.reject).not.toBeDefined();
        });

        it('Should tell if it has been resolved', function() {
            this.deferred.resolve('solved');

            expect(this.promise.isResolved()).toBe(true);
            expect(this.promise.isRejected()).toBe(false);
        });

        it('Should tell if it has been rejected', function() {
            this.deferred.reject('fail');

            expect(this.promise.isRejected()).toBe(true);
            expect(this.promise.isResolved()).toBe(false);
        });
    });

    describe('when resolved', function () {
        it('Should only notify "done" callbacks', function () {
            this.promise.done(this.callbacks.done).fail(this.callbacks.fail);

            this.deferred.resolve('Resolved');

            expect(this.callbacks.done).toHaveBeenCalled();
            expect(this.callbacks.fail).not.toHaveBeenCalled();
        });

        it('Should only notify "done" callbacks, even callbacks added after the fact', function () {
            this.promise.done(this.callbacks.done).fail(this.callbacks.fail);

            this.deferred.resolve('Resolved');

            this.promise.done(this.callbacks.done);

            expect(this.callbacks.done.calls.count()).toBe(2);
            expect(this.callbacks.fail).not.toHaveBeenCalled();
        });
    });

    describe('when rejected', function () {
        it('Should only notify "fail" callbacks', function () {
            this.promise.done(this.callbacks.done).fail(this.callbacks.fail);

            this.deferred.reject('Rejected');

            expect(this.callbacks.done).not.toHaveBeenCalled();
            expect(this.callbacks.fail).toHaveBeenCalled();
        });

        it('Should only notify "fail" callbacks, even callbacks added after the fact', function () {
            this.promise.done(this.callbacks.done).fail(this.callbacks.fail);

            this.deferred.reject('Rejected');

            this.promise.fail(this.callbacks.fail);

            expect(this.callbacks.done).not.toHaveBeenCalled();
            expect(this.callbacks.fail.calls.count()).toBe(2);
        });
    });
});
