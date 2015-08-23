var platform = require('platform');

// This feature module appends platform identifiers to the body of the windows
exports.execute = function(options, callback) {
  var body = document.body;
  body.setAttribute("data-platform-description", platform.description);
  body.setAttribute("data-platform-layout", platform.layout);
  body.setAttribute("data-platform-manufacturer", platform.manufacturer);
  body.setAttribute("data-platform-name", platform.name);
  body.setAttribute("data-platform-prerelease", platform.prerelease);
  body.setAttribute("data-platform-product", platform.product);
  body.setAttribute("data-platform-ua", platform.ua);
  body.setAttribute("data-os-architecture", platform.os.architecture);
  body.setAttribute("data-os-family", platform.os.family);
  body.setAttribute("data-os-version", platform.os.version);
  return callback();
}
