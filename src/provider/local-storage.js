var WinJS = require('winjs'),
  base = require('./base'),
  log = require('../log');

var _constructor = function(options) {
  base.call(this, arguments);
  this._repo = {
    /*
    fileName: {
      created: new Date(),
      data: content,
      lastModified: new Date()
    }
    */
  };
  log.warn("LocalStorage Provider using in-memory strategy. Override with concrete impl to persist data between app sessions");
};

var instanceMembers = {
  get: function(options, callback) {
    log.info("LocalStorage:get");
    if (this._repo[options.fileName])
      return callback(null, this._repo[options.fileName]);
    return callback('does-not-exist');
  },
  createOrUpdate: function(options, callback) {
    log.info("LocalStorage:createOrUpdate", options);
    options.data = options.data || {};
    var subject = this._repo[options.fileName];
    if (!subject) {
      subject = {
        created: new Date()
      };
      this._repo[options.fileName] = subject;
    }
    subject.data = options.data;
    subject.lastModified = new Date();
    return callback(null, subject);
  },
  del: function(options, callback) {
    log.info("LocalStorage:createOrUpdate");
    if (this._repo[options.fileName]) {
      delete this._repo[options.fileName];
      this._repo[options.fileName] = null;
    }
    return callback(null, true);
  }
};

module.exports = WinJS.Class.derive(base,
  _constructor, instanceMembers);
