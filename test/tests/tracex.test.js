var env = require('system').env;
var url = env.ROOT_URL;

describe("TraceX", function() {
  before(function() {
    casper.start(url);
    casper.on('remote.message', function(message) {
      this.echo(message);
    });
  });
  it("should have a global namespace and base class", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        return {
          "hasNamespace": ( TraceX && typeof TraceX === "object" ),
          "hasBaseClass": ( TraceX.Class && typeof TraceX.Class === "function")
        }
      });
      evalResult.hasNamespace.should.equal(true);
      evalResult.hasBaseClass.should.equal(true);
    });
  });
  it("should have settings initialized from Meteor settings", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        return {
          "hasSettings": ( TraceX.settings && typeof TraceX.settings === "object" ),
          "isInit": ( TraceX.settings && TraceX.settings.env === "test")
        }
      });
      evalResult.hasSettings.should.equal(true);
      evalResult.isInit.should.equal(true);
    });
  });
  it("should have a singleton trace service", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        if ( TraceX.service ) { TraceX.service.test = "verify"; }
        var newService = new TraceX.TraceService();
        return {
          "hasSingleton": ( TraceX.service && TraceX.service instanceof TraceX.TraceService ),
          "isSingleton": ( newService && newService instanceof TraceX.TraceService && newService.test === "verify" )
        }
      });
      evalResult.hasSingleton.should.equal(true);
      evalResult.isSingleton.should.equal(true);
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