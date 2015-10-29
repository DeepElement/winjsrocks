var WinJS = require('winjs'),
  base = require('./base'),
  log = require("../log");

var _constructor = function(options) {
  base.call(this, arguments);
  this._lokiStorageKey = "-lokiStorage.json";
};

var instanceMembers = {
  loadDatabase: function(dbname, callback) {
    var storageProvider = this.application.container.getProvider("localStorage");
    var dbStorageKey = dbname + this._lokiStorageKey;
    storageProvider.get({
        fileName: dbStorageKey
      },
      function(err, resp) {
        if (err) {
          if (err === 'does-not-exist')
            return callback({});
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
    var storageProvider = this.application.container.getProvider("localStorage");
    var dbStorageKey = dbname + this._lokiStorageKey;
    var storageStr = "";

    if (typeof dbstring === 'string' || dbstring instanceof String)
      storageStr = String(dbstring);
    else
      storageStr = JSON.stringify(dbstring);

    storageProvider.createOrUpdate({
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
