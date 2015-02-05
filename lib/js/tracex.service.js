TraceX.TraceService = ClassX.extend(TraceX.Class, function(base) {

  var LOG_FORMAT = {
    "TEXT": "text",               // show just the level and message
    "META": "meta",               // display level, message and additional metadata
    "JSON": "json"                // display in full JSON
  };

  if ( Meteor.isServer ) {
    var _colors = Npm.require('colors');
  }

  var logToConsole = function(logEntry) {

    var settings = this._ns.settings;
    var LOG_LEVEL = this._ns.LOG_LEVEL;

    // filter logging based on log level
    var levels = ( Meteor.isClient ) ? settings.console.levels.client : settings.console.levels.server;
    if ( _.indexOf(levels, logEntry.level) < 0 ) { return; }

    // prepare the message for logging to console
    var msg;
    var format = settings.console.format || LOG_FORMAT.META;

    if ( format === LOG_FORMAT.TEXT) {
      msg = "[" + logEntry.level.toUpperCase() + "]  " + logEntry.msg;
    }
    else if ( format === LOG_FORMAT.META) {
      msg = "[" + logEntry.level.toUpperCase() + "]  " + logEntry.msg + " " + JSON.stringify(logEntry.meta);
    }
    else { msg = JSON.stringify(logEntry); }

    // on the server color the message
    if ( Meteor.isServer ) {
      if ( logEntry.level === LOG_LEVEL.DEBUG ) { msg = msg.grey; }
      else if ( logEntry.level === LOG_LEVEL.INFO ) { msg = msg.green; }
      else if ( logEntry.level === LOG_LEVEL.WARNING ) { msg = msg.yellow; }
      else if ( logEntry.level === LOG_LEVEL.EXCEPTION) { msg = msg.magenta; }
      else if ( logEntry.level === LOG_LEVEL.ERROR ) { msg = msg.red; }
      else { msg = msg.white.bold; }
    }

    if ( typeof console !== "undefined" ) {
      console.log(msg);
    }

  };

  // apply filter rules for database and log if appropriate
  var logToDatabase = function(logEntry) {

    // only log to database on the server
    if ( ! Meteor.isServer ) { return; }

    // filter logging based on log level
    var settings = this._ns.settings;
    var levels = settings.database.levels;
    if ( _.indexOf(levels, logEntry.level) < 0 ) { return; }

    this.__collection.insert(logEntry);

  };

  // log trace messages to trace log providers
  var onLogMethod = function() {

    var ctx = this;

    return function(logEntry) {

      // augment the log entry with date and timestamp
      logEntry.logged = new Date();
      logEntry.timestamp = new Date().getTime();

      // log to providers
      logToConsole.call(ctx, logEntry);
      logToDatabase.call(ctx, logEntry);

    };

  };

  // auto-log global trace messages
  var onTraceEvent = function() {

    var ctx = this;

    return function(data) {

      // validate that the data object has accepted properites
      // for a trace
      var valid = Match.test(data, {
        "level": String,
        "msg": Match.OneOf(String, Object),
        "meta": Match.Optional(Object)
      });

      // use trace logger to send message to ourself
      // to ensure proper call formating and rules
      var logger = new ctx._ns.TraceLogger();
      logger.log(data.level, data.msg, data.meta);

    };

  };

  this.constructor = function TraceService() {

    base.constructor.call(this);

    // initialize database collection on server
    if ( Meteor.isServer ) {
      var collectionId = this._ns.settings.database.collection;
      this.__collection = new Mongo.Collection(collectionId);
    }

    // register logging method
    Meteor.methods({
      "tracex/log": onLogMethod.call(this)
    });

    // register global event listener
    var eventId = this._ns.settings.event.id;
    this.addEventListener(eventId, onTraceEvent.call(this), true);

  };

});