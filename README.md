# TraceX

Simple logging of debug and trace information.

## About TraceX

TraceX provides a simple debug and trace logging capability for the console or database. Some
of the features supported by the package include:

* Logging is supported on both the client and the server.
* Trace activities on the client are syndicated to the server automatically.
* Trace activites can be logged to the console and/or a database collection.
* Logging can be filtered to specified trace levels.
* Trace activities are logged in color on the server console for readability.
* If used with [ClassX](https://atmospherejs.com/arsnebula/classx), it can log trace events.

## Current Version

**v0.9.0**

## Setup and Configuration

To begin using **TraceX**, you need to call the ``TraceX.init([options])`` method. The
``options`` parameter (optional) allows you to override some or all of the default
settings.

```js
TraceX.init({
  "event": {
    "id": "tracex"             // the id of the event to listen and auto-log
  },
  "console": {
    "format": "meta",          // format for console logging (text, meta or json)
    "levels": {
      "client": null,          // array of log levels to log to the client console (or null)
      "server": [              // array of log levels to log to the server console (or null)
        "debug",
        "info",
        "warning",
        "exception",
        "error"
      ]
    }
  },
  "database": {
    "collection": "tracex",    // name of the database collection
    "levels": [                // array of log levels to log to the database (or null)
      "info",
      "error"
    ]
  }
});

```

> Log settings are used on both the client and the server, so it is recommended that the
library be initialized with the same settings on both tiers of your application.

### Event Settings

[ClassX](https://atmospherejs.com/arsnebula/classx) provides the ability to raise and listen
for events. TraceX automatically listens for trace events raised with the event identifier specified
in the ``event.id`` settings property.

### Console Settings

Events logged on the client can be logged to both the client and server
consoles. Events logged on the server, can be logged to the server console.

Trace events can be logged in one of three
formats by setting the ``console.format`` setting property to one of three
values: ``text``, ``meta`` or ``json``. The following is an example of the output
in each of the three formats:

```sh
[DEBUG] This is a debug message in text format.
[DEBUG] This is a debug message with additional meta. {"extra": "data"}
{"level": "debug", "msg": "This is a message in JSON format", "meta": {"extra": "data"}}
```

Console logging can be filtered by trace level. Default trace levels are provided
with the following intended usage:

- **debug**: use for logging verbose information about execution for diagnostic purposes.
- **info**: for information about successful events in your application.
- **warning**: validation errors with user data, or anticipated but abnormal program conditions.
- **exception**: anticipated errors the application can process.
- **error**: unanticipated errors that may impact application stability.

Custom trace levels can be logged by using a custom string for the ``level`` parameter when logging
a trace message, or raising a trace event.

To filter activities logged to the console, provide an array of allowed trace levels using the
``console.levels.client`` and ``console.levels.server`` settings properties. To disable
logging, specify either ``null`` or an empty ``[]`` array.

### Database Settings

Specify the name of the database collection using the ``database.collection`` setting property.

Database logging can be filtered by trace level. Provide an
array of trace levels authorized for output using the ``database.levels`` settings
property. To disable logging, specify either ``null``
or an empty ``[]`` array.

## Usage

The library provides a number of ways to log trace events.

### Default Trace Object

A default ``TraceX.trace`` object is provided for convenience. To log any
type of trace message, you can use the default ``log`` function which takes the
following parameters:

- **level**: One of the pre-configured values [debug, info, warning, exception, error] or a custom level.
- **message**: A string containing the description of the event.
- **meta**: A serializable object.

```js
TraceX.trace.log(level, message, meta);
```

Utility functions are also provided for each of the default log levels:

```js
TraceX.trace.debug(message, meta);
TraceX.trace.info(message, meta);
TraceX.trace.warning(message, meta);
TraceX.trace.exception(message, meta);
TraceX.trace.error(message, meta);
```

#### Custom Trace Logging

You can create your own custom trace loggers. One of the benefits
of using custom instances, is the ability to specify additional metadata to
be added to all tracing activities logged with that instance.

```js
var myTrace = new TraceX.TraceLogger({"extra": "data"});
myTrace.debug("This is some debug information.");
//=> This is some debug information {"extra": "data"}
```

> TIP: Use separate instances for each functional area of an application
to capture data relevant to that module.

#### Trace Events

The library supports [ClassX](https://github.com/arsnebula/classx) events, and automatically
listens for **global** events raised that match the ``event.id`` property in
the package settings.

To log a trace message using events, call the ``raiseEvent`` method on any instance of
a **ClassX** class. As an example, the ``TraceX`` object is itself an instance
of a ``ClassX`` class:

```js
TraceX.raiseEvent("trace", {"level": level, "msg": msg, "meta": meta}, true);
```

Within your own class, call the ``raiseEvent`` method on the internal **this** context:

```js
var MyClass = ClassX.extend(ClassX.Class, function(base) {
  this.doSomething = function() {
    this.raiseEvent("trace", {"level": "debug", "msg": "Some debug info.", "meta": {} }, true);
  };
});
```

> To raise an event across class instances, you must specify ``true`` for
the optional ``global`` argument.

## License

[MIT](http://choosealicense.com/licenses/mit/) -
Copyright (c) 2013 [Ars Nebula](http://www.arsnebula.com)