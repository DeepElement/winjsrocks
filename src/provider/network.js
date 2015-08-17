var WinJS = require('winjs'),
  base = require('./base'),
  $ = require('jquery');

var _constructor = function(options) {
  base.call(this, arguments);
};

var instanceMembers = {
  get: function(data, callback) {
    var that = this;
    $.ajax({
      type: "GET",
      crossDomain: true,
      url: data.url,
      headers: {
      },
      success: function(data, text) {
        return callback(null, data);
      },
      error: function(request, status, error) {
        return callback(error);
      }
    });
  },

  post: function(data, callback) {
    var that = this;
    $.ajax({
      type: "POST",
      crossDomain: true,
      url: data.url,
      data: data.form,
      headers: {
      },
      success: function(data, text) {
        return callback(null, data);
      },
      error: function(request, status, error) {
        return callback(error);
      }
    });
  }
};

module.exports = WinJS.Class.derive(base, _constructor, instanceMembers);
