var jsdom = require('jsdom'),
  path = require('path');

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

var winJSShim = function() {
  global = global || {};
  global.window = global.window || {};
  global.msWriteProfilerMark = function() {};
  global.addEventListener = function() {};
  global.navigator = {
    userAgent: ""
  };
  global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
};

var jsdomShim = function() {
  global.document.documentElement.classList = {
    add: function() {

    }
  };
};

var deleteRequireModulesInPath = function(path) {
  for (var key in require.cache) {
    if (require.cache[key].id.indexOf(path) > -1)
      delete require.cache[key];
  }
};

var includeScript = function include(f) {
  var fs = require("fs");
  var path = require("path");
  var full = path.join(f);
  eval.apply(global, [fs.readFileSync(full).toString()]);
};

beforeEach(function(done) {
  jsdom.env("<html></html>", function(err, window) {
    if (err)
      return done(err);

    // SHIM Globals
    winJSShim();

    global.window = window;
    global.window.process = global.window.process || {};
    global.window.process.env = global.window.process.env || {};
    global.document = window.document;

    // SHIM JSDOM
    jsdomShim();

    deleteRequireModulesInPath(path.join(__dirname, ".."));

    return done();
  });
});

afterEach(function(done) {
  //var ioc = resolver.resolve('sdk/helper/ioc.node');
  //ioc.clear();
  return done();
});
