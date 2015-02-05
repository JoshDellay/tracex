TraceX = new ( ClassX.extend(ClassX.Class, function(base) {

  var getDefaultSettings = function() {

    return {
      "event": {
        "id": "tracex"
      },
      "console": {
        "format": "meta",
        "levels": {
          "client": null,
          "server": ["debug", "info", "warning", "exception", "error"]
        }
      },
      "database": {
        "collection": "tracex",
        "levels": ["info", "error"]
      }
    };

  };

  this.LOG_LEVEL = {
    "ERROR": "error",             // unanticipated error that cannot be corrected by the application
    "EXCEPTION": "exception",     // anticipated error handled gracefully by the application
    "WARNING": "warning",         // anticipated error that can be corrected by the user
    "INFO": "info",               // general event in the application (e.g. new user registration)
    "DEBUG": "debug"              // general debug information
  };

  this.init = function(options) {

    // the namespace can only be initialized once
    if ( this.__init ) { return false; }

    // merge options with default settings
    this.__settings.extend(true, options);
    this.trace = new TraceX.TraceLogger();
    this.service = new TraceX.TraceService();

    this.__init = true;
    return true;

  };

  // provide read-access to settings
  Object.defineProperty(this, "settings", {
    "get": function() { return this.__settings.get(); }
  });

  this.constructor = function TraceX() {
    base.constructor.call(this);
    this.__settings = new ReactiveVar( getDefaultSettings.call(this) );
    this.__init = false;
  };

}))();

TraceX.Class = ClassX.extend(ClassX.Class, function(base) {
  Object.defineProperty(this, "_ns", { "get": function() { return TraceX; } });
});

TraceX.Exception = ClassX.extend(ClassX.Exception, function(base) {});