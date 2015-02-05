var env = require('system').env;
var url = env.ROOT_URL;

describe("TraceX", function() {
  before(function() {
    casper.start(url);
    casper.on('remote.message', function(message) {
      this.echo(message);
    });
  });
  it("should have a namespace and base class and exception", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        return {
          "hasNamespace": ( TraceX && typeof TraceX === "object" ),
          "hasBaseClass": ( _.has(TraceX, "Class") && typeof TraceX.Class === "function"),
          "hasBaseException": ( _.has(TraceX, "Exception") && typeof TraceX.Exception === "function")
        }
      });
      evalResult.hasNamespace.should.equal(true);
      evalResult.hasBaseClass.should.equal(true);
      evalResult.hasBaseException.should.equal(true);
    });
  });
  it("should have settings property", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        return {
          "hasSettings": ( _.isObject(TraceX.settings) ),
          "hasEventSettings": ( _.has(TraceX.settings, "event") && TraceX.settings.event.id === "trace"),
          "hasConsoleSettings": ( _.has(TraceX.settings, "console") && TraceX.settings.console.format === "meta"),
          "hasDatabaseSettings": ( _.has(TraceX.settings, "database") && TraceX.settings.database.collection === "tracex")
        }
      });
      evalResult.hasSettings.should.equal(true);
      evalResult.hasEventSettings.should.equal(true);
      evalResult.hasConsoleSettings.should.equal(true);
      evalResult.hasDatabaseSettings.should.equal(true);
    });
  });
  it("should allow creation of a custom TraceLogger", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var logger = new TraceX.TraceLogger();
        return ( logger && logger instanceof TraceX.TraceLogger);
      });
      evalResult.should.equal(true);
    });
  });
  it("should catch and log global trace events to database", function() {
    casper.then(function () {
      casper.evaluate(function() {
        var logger = new TraceX.TraceLogger();
        logger.raiseEvent("trace", {"level": "test", "msg": "verify", "meta": {}}, true);
      });
      this.waitForText("verify", function() {
        var msg = this.fetchText(".trace");
        msg.should.equal("verify");
      });
    });
  });
});