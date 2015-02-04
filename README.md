# TraceX for Meteor

Simple trace logging for Meteor.

## Current Version

**v0.4.3**

## Setup and Configuration

The trace logging library supports two types of logging: ``debug`` activities,
and events including ``info``, ``warning``, ``exception`` and ``error``. Custom trace
levels can also be used. Key features provided by the library include:

* Trace logging is supported on both the client and the server.
* Trace activities on the client are syndicated to the server.
* Trace activities can be written to both the console, and a MongoDB collection.
* Console logging is automatically restricted to non-production environments.
* Trace activities are logged in color on the server console for readability.

The library utilizes the following default settings:

```js
TraceX.settings = {
  "debug": "auto",             // rule for logging debug activities
  "events": "auto",            // rule for logging event activities
  "console": "meta",           // format when writing to console (text, meta or json)
  "collection": "trace",       // name of the MongoDB collection to log to
  "eventHook": null,           // global event to handle for trace messages
  "env": "development"         // environment to use for automatic logging rules
}

```

> The settings can be updated programatically, however settings impact both the client
and the server, and it is recommended that settings be updated in both tiers.

In order to standardize logging settings on both the client and the server, the
library will initialize settings from the ``Meteor.settings`` object. All settings must be
placed under ``public``.

```js
{
  "public": {
    "env": "production",
    "trace": {
      "debug": "auto",
      "events": "auto",
      "console": "meta",
      "collection": "trace",
      "eventHook": "trace"
    }
  }
}
```

How debug and event activities are logged depends on the ``trace`` settings, and
the current environment as follows:

- **Debug**

  - **db**: debug activities are logged to the database in all environments.
  - **auto**: (default) logs to console in development, otherwise ignored.
  - **off**: all debug entries are discarded.

- **Events**:

  - **db**: events are logged to the database in all environments.
  - **auto**: (default) events are logged to the console in development, otherwise to the database.
  - **off**: all events are discarded.

In most cases, the default ``auto`` option will be the preferred choice.

## Usage

The library provides a number of ways to log trace events.

### Default Trace Logging

A default ``TraceX.trace`` object is available as a singleton. To log any
type of trace message, you can use the default ``log`` function which takes the
following parameters:

- **level**: One of the pre-configured values [debug, info, warning, error, fatal] or a custom level.
- **message**: A string containing the description of the event.
- **meta**: A serializable object.

```js
TraceX.trace.log(level, message, meta);
```

For convenience, utility functions are provided for the default log levels:

```js
TraceX.trace.debug(message, meta);
TraceX.trace.info(message, meta);
TraceX.trace.warning(message, meta);
TraceX.trace.exception(message, meta);
TraceX.trace.error(message, meta);
```

#### Custom Trace Logging

You can instantiate your own custom trace instances. One of the benefits
of using custom instances, is the ability to define additional metadata to
be added to all tracing activities logged with that instance.

```js
var myTrace = new TraceX.TraceLogger({"extra": "data"});
myTrace.debug("This is some debug information.");
```

> Use separate instances for each functional area of an application
to capture data relevant to that module.

#### Event Hook

The libary supports [ClassX](https://github.com/arsnebula/classx) global events
and provides the ability to register a global event hook to capture and log trace events. If
the ``eventHook`` property in the settings specifies the name of a trace event to monitor,
any properly formatted trace event will be captured and logged.

To log a trace message using the event hook capability, within any class instance,
call ``raiseEvent`` specifying the correct event name, and formatting
the data object with the ``level``, ``msg`` and ``meta`` properties.

```js
this.raiseEvent("trace", {"level": level, "msg": msg, "meta": meta}, true);
```

> To raise an event across class instances, you must
specify ``true`` for the optional ``global`` argument.

## License

[MIT](http://choosealicense.com/licenses/mit/) -
Copyright (c) 2013 [Ars Nebula](http://www.arsnebula.com)