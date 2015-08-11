var async = require('async');

exports.loadResourcesSeries = function(resources, callback) {
  async.eachSeries(resources,
    function(resource, scriptCb) {
      exports.loadResource(resource.url, resource.type, scriptCb);
    },
    callback);
};

exports.loadResources = function(resources, callback) {
  async.each(resources,
    function(resource, scriptCb) {
      exports.loadResource(resource.url, resource.type, scriptCb);
    },
    callback);
};

exports.loadResource = function(url, type, callback) {
  var head = document.getElementsByTagName('head')[0];
  switch (type) {
    case "script":
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;

      if (script.readyState)
        script.onreadystatechange = callback;
      else
        script.onload = callback;

      head.appendChild(script);
      break;
    case "stylesheet":
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.href = url;
      link.type = "text/css";
      link.rel = "stylesheet";
      link.media = "screen,print";

      if (link.readyState)
        link.onreadystatechange = callback;
      else
        link.onload = callback;

      head.appendChild(link);
      break;
  }
};
