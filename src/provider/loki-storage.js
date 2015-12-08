import BaseProvider from "./base";

export default class extends BaseProvider {
  constructor(application) {
    super(application);
    this._lokiStorageKey = application.instanceKey + "-lokiStorage.json";
  }

  loadDatabase(dbname, callback) {
    var storageProvider = this.application.container.getProvider("coreLocalStorage");
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
  }

  saveDatabase(dbname, dbstring, callback) {
    var storageProvider = this.application.container.getProvider("coreLocalStorage");
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
}
