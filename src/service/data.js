var ioc = require('../ioc'),
  base = require('./base'),
  async = require('async'),
  WinJS = require("winjs"),
  loki = require('lokijs');

var _constructor = function(options) {
  base.call(this, arguments);
  this._lokiDbName = "winjs-rocks";
  this._lokiStorageProvider = ioc.getProvider("lokiStorage");
}

var instanceMembers = {
  start: function() {
    var that = this;
    return base.prototype.start.apply(this, arguments).then(function() {
      return new WinJS.Promise(function(complete, error) {
        that._db = new loki(that._lokiDbName, {
          adapter: that._lokiStorageProvider
        });

        var creationFactoryMapping = {};
        var modelKeys = ioc.getModelKeys();
        modelKeys.forEach(function(modelKey) {
          creationFactoryMapping[modelKey] = {
            proto: ioc.getModelDef(modelKey)
          }
        });
        console.log('load database', creationFactoryMapping);
        that._db.loadDatabase(creationFactoryMapping,
          function(resp) {
            console.log('a');
            if (resp === 'Database not found')
              that._db.saveDatabase(function() {
                return complete();
              });
            else
              return complete();
          });
      });
    });
  },

  getDatabase: function() {
    return this._db;
  },

  stop: function() {
    var that = this;
    return base.prototype.stop.apply(this, arguments)
      .then(function() {
        return new WinJS.Promise(function(complete, error) {
          if (that._db)
            that._db.saveDatabase(function(err) {
              if (err)
                return error(err);
              return complete();
            });
          else
            return complete();
        });
      });
  }
};

module.exports = WinJS.Class.derive(base, _constructor, instanceMembers);
