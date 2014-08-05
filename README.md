#Deferred

**What**

A simple and tiny Javascript implementation of a the Deferred and promise objects, done mainly to learn more about them.

**Getting it**

```
git clone --depth=1 https://github.com/ricca509/deferred.git
```

**Using it**

```javascript
var d = deferred(),
    promise = d.promise;

promise.done(function (param) {
   console.log("done " + param);
}).fail(function (param) {
    console.log("failed " + param);
});

d.resolve("Resolved");  // Logs: "done Resolved"

promise.done(function (param) {
   console.log("After " + param);
}); // Logs: "After Resolved"

```

**Improving it**

If you want to improve/fix the library, make sure to write appropriate tests
and always run
```
grunt
```
to make sure that the code is correctly written and the tests are passing.  

If you have any questions or feedback, feel free to contact me using [@CoppolaRiccardo](https://twitter.com/CoppolaRiccardo) on Twitter.
