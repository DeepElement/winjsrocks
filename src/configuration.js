import async from 'async';
import extend from 'extend-object';
import Component from "./common/component";

export default class extends Component {
  constructor(application) {
    super(application);
    this._store = {};
  }

  get(path) {
    var that = this;
    try {
      var _context = that.resolve(path);
      return _context.scope[_context.property];
    } catch (ex) {
      return null;
    }
  }

  get store() {
    return this._store;
  }

  assert(path) {
    if (!this.get(path))
      throw new Error("Configuration " + path + " not present");
  }

  set(path, value) {
    var that = this;
    var parts = path.split(':');
    var scope = this.store;
    if (parts.length > 1) {
      for (var i = 0; i <= parts.length - 2; i++) {
        if (!scope[parts[i]])
          scope[parts[i]] = {};
        scope = scope[parts[i]];
      }
    }
    var property = parts[parts.length - 1];
    scope[property] = value;
  }

  defaults(defaultConfig) {
    extend(this.store, defaultConfig);
  }

  resolve(path) {
    var parts = path.split(':');
    var scope = this.store;
    if (parts.length > 1) {
      for (var i = 0; i <= parts.length - 2; i++) {
        scope = scope[parts[i]];
      }
    }
    var property = parts[parts.length - 1];
    if (!property || !scope[property])
      throw new Error(path + " not defined");

    var result = {
      scope: scope,
      property: property
    };
    return result;
  }

  file(path, callback) {
    var that = this;
    this.loadFile(path,
      function(err, respObj) {
        if (err)
          return callback(err);
        extend(that.store, respObj);
        return callback();
      });
  }

  loadFile(path, callback) {
    var result = null;

    //TODO: decouple this to a resource resolver

    async.waterfall([
        function(done) {
          WinJS.xhr({
              url: path
            })
            .done(function(resp) {
                result = JSON.parse(resp.response);
                return done();
              },
              function(result) {
                return done();
              });
        },
        function(done) {
          if (!result) {
            if (!(typeof location === "undefined")) {
              var browserCompatiblePath = path.replace("ms-appx://",
                location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''));
              WinJS.xhr({
                url: browserCompatiblePath
              }).done(function(resp) {
                  result = JSON.parse(resp.response);
                  return done();
                },
                function(result) {
                  return done();
                });
            } else {
              result = require(path);
              return done();
            }
          } else
            return done();
        }
      ],
      function(err) {
        if (err)
          return callback();
        return callback(null, result);
      });
  }
};
