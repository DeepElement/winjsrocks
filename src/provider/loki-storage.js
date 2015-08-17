var WinJS = require('winjs'),
  base = require('./base'),
  ioc = require('../ioc'),
  log = require("../log");

var _constructor = function(options) {
  base.call(this, arguments);
  this._lokiStorageKey = "-lokiStorage.json";
  this._storageProvider = ioc.getProvider("localStorage");
};

var instanceMembers = {
  loadDatabase: function(dbname, callback) {
    log.log("LokiStorage:loadDatabase");
    var dbStorageKey = dbname + this._lokiStorageKey;
    this._storageProvider.get({
        filename: dbStorageKey
      },
      function(err, resp) {
        if (err) {
          if (err === 'does-not-exist')
            return callback();
          return callback(err);
        }
        var resultStr = "";
        if (!(typeof(resp.data) === 'string'))
          resultStr = JSON.stringify(resp.data);
        else
          resultStr = String(resp.data);
        return callback(resultStr);
      });
  },
  saveDatabase: function(dbname, dbstring, callback) {
    log.log("LokiStorage:saveDatabase");
    var dbStorageKey = dbname + this._lokiStorageKey;
    var storageStr = "";
    if (!(typeof(dbstring) === 'string'))
      storageStr = JSON.stringify(dbstring);
    else
      storageStr = String(dbstring);
    this._storageProvider.createOrUpdate({
        fileName: dbStorageKey,
        data: storageStr
      },
      function(err) {
        if (err)
          return callback(err);
        return callback();
      });
  }
};

module.exports = WinJS.Class.derive(base,
  _constructor, instanceMembers);
