import BaseService from "./base"
import StringHelper from "../helper/string";
import Loki from "lokijs";
import Async from "async";

export default class extends BaseService {
  constructor(application) {
    super(application);
    this._lokiDbName = application.instanceKey + "-loki.db";
  }

  loadComponent(options, callback) {
    var that = this;
    super.loadComponent(options, function(err) {
      if (err)
        return callback(err);

      // Init the loki db
      var lokiStorageProvider = that.application.container.getProvider("coreLokiStorage");
      that._db = new Loki(that._lokiDbName, {
        adapter: lokiStorageProvider,
        autosave: true
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

          Async.waterfall([
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
              return callback(err);

            // Expose the dynamic model api on the data service
            modelKeys.forEach(function(modelKey) {
              if (!that._db.getCollection(modelKey)) {
                that._db.addCollection(modelKey);
              }
              that["get" + StringHelper.capitalizeFirstLetter(modelKey) + "Collection"] = function() {
                return that._db.getCollection(modelKey);
              };
            });

            return callback();
          });
        });
    });
  }

  get database() {
    return this._db;
  }

  unloadComponent(options, callback) {
    var that = this;
    return super.unloadComponent(options, function(err) {
      if (err)
        return callback(err);

      if (that._db)
        that._db.saveDatabase(function(err) {
          if (err)
            return callback(err);

          that._db.close(callback);
        });
      else
        return callback();
    });
  }
}
