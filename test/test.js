TraceX.init({
  "event": {
    "id": "trace"
  }
});

if (Meteor.isClient) {

  Traces = new Mongo.Collection("tracex");

  Template.TraceX.helpers({
    "traces": function() {
      return Traces.find({"level": "test"});
    }
  });

  Meteor.startup(function () {
    // code to run on client at startup
    TraceX.trace.info("Client info message.");
    TraceX.raiseEvent("trace", {"level": "debug", "msg": "This is a client debug event.", "meta": {"package": "test"} }, true);
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    TraceX.trace.info("Server info message.");
    TraceX.raiseEvent("trace", {"level": "debug", "msg": "This is a server debug event.", "meta": {"package": "test"} }, true);
  });
}
