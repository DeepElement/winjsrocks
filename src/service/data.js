var base = require('./base'),
  async = require('async'),
  WinJS = require("winjs"),
  loki = require('lokijs');

var _constructor = function(options) {
  base.call(this, arguments);
  this._lokiDbName = "winjs-rocks";
}

var instanceMembers = {
  start: function() {
    var that = this;
    return base.prototype.start.apply(this, arguments).then(function() {
      return new WinJS.Promise(function(complete, error) {
        // Init the loki db
        var lokiStorageProvider = that.application.container.getProvider("lokiStorage");
        that._db = new loki(that._lokiDbName, {
          adapter: lokiStorageProvider
        });

        // Build the dynamic creation factory for Loki deserialization
        var creationFactoryMapping = {};
        var modelKeys = that.application.container.getItemModelKeys();
        modelKeys.forEach(function(modelKey) {
          creationFactoryMapping[modelKey] = {
            proto: that.application.container.getItemModelDef(modelKey)
          }
        });

        // load the db
        that._db.loadDatabase(creationFactoryMapping,
          function(resp) {

            async.waterfall([
              function(done) {
                if (resp === 'Database not found') {
                  that._db.saveDatabase(function() {
                    return done();
                  });
                } else
                  return done();
              }
            ], function(err) {
              if (err)
                return error(err);

              // Expose the dynamic model api on the data service
              modelKeys.forEach(function(modelKey) {
                if (!that._db.getCollection(modelKey)) {
                  that._db.addCollection(modelKey);
                }
                that["get" + modelKey.capitalizeFirstLetter() + "Collection"] = function() {
                  return that._db.getCollection(modelKey);
                };
              });

              return complete();
            });
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
