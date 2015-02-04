TraceX.TraceLogger = ClassX.extend(TraceX.Class, function(base) {

  var LOG_METHOD = "tracex/log";

  this.log = function(level, msg, meta) {

    // merge default metadata with passed metadata
    var metaX = new ReactiveVar(this.settings.meta);
    metaX.extend(true, meta);

    // combine parameters into log object and augment
    var LOG_TIER = this._ns.LOG_TIER;
    var logEntry = {
      "level": level,
      "msg": msg,
      "tier": Meteor.isClient ? LOG_TIER.CLIENT : LOG_TIER.SERVER,
      "meta": metaX.get()
    }

    Meteor.call(LOG_METHOD, logEntry);

  };

  this.debug = function(msg, meta) { this.log(this._ns.LOG_LEVEL.DEBUG, msg, meta); }
  this.info = function(msg, meta) { this.log(this._ns.LOG_LEVEL.INFO, msg, meta); }
  this.warning = function(msg, meta) { this.log(this._ns.LOG_LEVEL.WARNING, msg, meta); }
  this.exception = function(msg, meta) { this.log(this._ns.LOG_LEVEL.EXCEPTION, msg, meta); }
  this.error = function(msg, meta) { this.log(this._ns.LOG_LEVEL.ERROR, msg, meta); }

  this.constructor = function TraceLogger(meta) {
    base.constructor.call(this);
    this.settings = {
      "meta": meta
    };
  };

});