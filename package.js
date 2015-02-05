Package.describe({
  "name": "arsnebula:tracex",
  "summary": "Simple logging of debug and trace information.",
  "version": "0.9.0",
  "git": "https://github.com/arsnebula/tracex.git"
});

Npm.depends({
  "colors": "0.6.2"
});

Package.onUse(function (api) {

  api.versionsFrom("1.0");
  api.use("meteor-platform");
  api.use("reactive-var");
  api.use("underscore");
  api.use("arsnebula:classx@2.0.5");
  api.use("arsnebula:reactive-varx@0.9.1");

  api.addFiles([
    "lib/js/tracex.namespace.js",
    "lib/js/tracex.service.js",
    "lib/js/tracex.logger.js"
  ],["client", "server"]);

  api.export("TraceX");

});
