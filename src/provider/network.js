var WinJS = require('winjs'),
  base = require('./base'),
  request = require('request');

var _constructor = function(options) {

};

var instanceMembers = {
  get: function(data, callback) {
    var that = this;
    data.jsonParse = data.jsonParse || false;
    request({
      url: data.url,
      followAllRedirects: true,
      gzip: true
    }, function(error, response) {
      if (!that.pendingDispose) {
        if (error)
          return callback(error);
        if (!error && (response.statusCode / 100) > 3) {
          return callback(error || response.statusCode);
        }
        response.parsed = {};
        try {
          if (data.jsonParse)
            response.parsed.json = JSON.parse(response.body);
        } catch (x) {
          return callback('network-error');
        }
        return callback(null, response);
      }
    });
  }
};

module.exports = WinJS.Class.derive(base, _constructor, instanceMembers);
