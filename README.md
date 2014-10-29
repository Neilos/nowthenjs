## What does this library give me?
* Nicer syntax for function binding: Increase the readability of your code, by eliminating `bind`, `call` and `apply` from your code.
* State `when` functions get executed, and trigger that execution by `announce`ing events

---
## Library Overview

This library provides two top level (i.e. global) objects:
* `now`
* `then`

Both objects have the following functions:

* `get`
* `when`
* `announce`

These functions all accept function arguments (as well as others). For the `then` versions, they return a bound version of the function argument (i.e. a version of the function argument with a specified object bound to the value of `this`), and for the `now` versions, they return the result of executing a bound version of the function argument.

(Read on: it will become clear).

---
## Executing functions and binding to this

### Borrowing functions from other objects
#### (AKA: An alternative to calling/applying)

Suppose we have an object with some function(s) and attribute(s):

```javascript
var bob = {
  sleep: function(){ this.state = "asleep"; },
  state: "awake"
}
```

...and another object missing those same function(s) or attribute(s)

```javascript
var freddy = {};
freddy.state;    /// => undefined
freddy.sleep();  /// Won't work! Sleep is not defined on freddy
freddy.state;    /// => still undefined
```

If we want to share the first object's function(s) with the second object, then, in Javascript, we can "borrow" the first object's function, by binding the second object to the value of `this` when calling the first object's function.

```javascript
/// Any of the following...
bob.sleep.call(freddy);   /// option 1 using call
bob.sleep.apply(freddy);  /// option 2 using apply
bob.sleep.bind(freddy)(); /// option 3 using bind and ()

/// ...will result in:
freddy.state;  /// => 'asleep'
```

Alternatively, using this library...

```javascript
/// This executes bob.sleep with freddy bound as 'this'
now.get(freddy, {acting_as: bob, to: "sleep"});

freddy.state;  /// => 'asleep'
```

### Callback functions
#### AKA An alternative to binding

Suppose we have an object with some function(s) and attribute(s):

```javascript
var bob = {
  sleep: function(){ this.state = "asleep"; },
  state: "awake"
}
```

And suppose we have a function that executes another function as a callback
(for example, the `window.setTimeout` method).

In Javascript, we cannot just pass in the unexecuted version of our function, if we care about the value of `this`. (Remember that Javascript sets the value of `this` according to the context when the function is executed.)

```javascript
bob.state; /// => "awake"

/// The following won't work!
/// It sets window state to "asleep"; not bob's state
setTimeout( bob.sleep , 1000);

bob.state; /// => still "awake"
window.state; /// => "asleep"!!?
```

To get our function to execute with the right object bound to `this` the normal javascript way (in ECMA 5) is to use `bind`

```javascript
setTimeout( bob.sleep.bind(bob), 1000);

bob.state;  /// => "asleep"
```

Alternatively, using this library...

```javascript
/// The following binds bob to this in the function sleep
setTimeout( then.get(bob, {to: 'sleep'});, 1000);

bob.state;  /// => "asleep"
```

### Binding and executing versus just binding

Note that when we want to bind to the value of `this` *but don't want to execute the function immediately* we call `get` on the `then` object:

```javascript
/// binds freddy to this but doesn't execute the sleep function
/// same as bob.sleep.bind(freddy);
then.get(freddy, {acting_as: bob, to: 'sleep'});
```

However, if we want to *both* bind to `this` *and also immediately execute* the function, what then?

We could just call the bound function, just like any normal javascript function.

```javascript
/// All of the following bind bob to this and execute sleep immediately
then.get(freddy, {acting_as: bob, to: 'sleep'})();       // 1: using ()
then.get(freddy, {acting_as: bob, to: 'sleep'}).call();  // 2: using call
then.get(freddy, {acting_as: bob, to: 'sleep'}).apply(); // 3: using apply
```

An alternative, to make it more explicit that we are executing the function *now*, we can call `get` on the `now` object.

```javascript
/// binds bob to this and executes sleep immediately
now.get(freddy, {acting_as: bob, to: 'sleep'});
```

Due to differences in the underlying implementation, the `now.get` version is more performant than the `then.get` version and should be preferred whenever immediate execution of a function is required.


### Parameter passing

```javascript
var chef = {
  mixCake: function () {
    var newIngredients = Array.prototype.slice.call(arguments)
    this.cakeIngredients = this.cakeIngredients.concat(newIngredients);
  },
  cakeIngredients: [],
}
```

Parameters can be passed to a function during binding, in an array, as the last argument to the `get` function.

```javascript
/// parameters passed as an array during binding
then.get( chef, {to: "mixCake"}, [ "egg", "flour", "sugar" ] )();
chef.cakeIngredients /// => [ "egg", "flour", "sugar" ]
```

...or parameters can be passed to a function during execution as a normal list of parameters

```javascript
/// parameters passed only during execution
then.get( chef, {to: "mixCake"} )( "egg", "flour", "sugar" );
chef.cakeIngredients /// => [ "egg", "flour", "sugar" ]
```

...or both: when binding **and** during function execution

```javascript
/// parameters passed both during binding and during execution
then.get( chef, {to: "mixCake"}, [ "egg", "flour" ] )( "sugar" );
chef.cakeIngredients // => [ "egg", "flour", "sugar" ]

/// alternatively
now.get( chef, {to: "mixCake"}, [ "egg", "flour", "sugar" ] );
chef.cakeIngredients /// => [ "egg", "flour", "sugar" ]
```

---
## Event Handling

### Events emitted by a single object

Suppose we have one object that we want to react to some change in another object. We can use the `announce` function to trigger events and the `when` function to specify the event consequences.

```javascript
var husband = {
  marital_status: 'married',
  cheat: function () {
    announce(this, "hasCheated");
  }
}

var wife = {
  marital_status: 'married',
  divorce: function(husband) {
    this.marital_status = 'single';
    husband.marital_status = 'single';
  }
}

now.when(husband, "hasCheated", function (husband) {
  wife.divorce(husband);
});

husband.marital_status /// => 'married'
wife.marital_status /// => 'married'

husband.cheat();

husband.marital_status /// => 'single'
wife.marital_status /// => 'single'
```
### Events emitted by more than one object

When a number of objects emit the same event...

```javascript
var squirrel = {
  run: function () {
    announce(this, "isRunning");
  }
}

var cat = {
  run: function () {
    announce(this, "isRunning");
  }
}

var wolf = {
  run: function () {
    announce(this, "isRunning");
  }
}

// Three objects all emit the "isRunning" event
```

The list of objects whose events will trigger a particular action can be specified by passing an array of objects as the first argument to the `when` function.

```javascript
var dog = {
  chase: function (object) {
    this.state = "chasing";
  },
  state: "lazin' about"
}

then.when([ squirrel, cat ],
          "isRunning",
          function (runningThing) {
            dog.chase(runningThing);
          });

dog.state;  /// => "lazin' about"

wolf.run();
dog.state;  /// => "lazin' about"

squirrel.run();
dog.state;  /// => "chasing"
```

If we don't care what object is emitting the event we can pass the string `"anything"` as the first argument to the `when` function.

```javascript
dog.state;  /// => "lazin' about"

then.when("anything",
          "isRunning",
          function (eventEmittingObject) {
            dog.chase(eventEmittingObject);
          });

wolf.run();
dog.state;  /// => "chasing"
```
### Combining event driven execution with binding to 'this'
For the callback function passed as the third argument to the `when` function we can use the `then.get` syntax discussed earlier to bind the value of `this`.

```javascript
/// Example 1
now.when(husband,
         "hasCheated",
         then.get(wife, {to: "divorce"}));

/// Example 2
now.when("anything",
         "isRunning",
         then.get(dog, {to: "chase"}));
```

---


