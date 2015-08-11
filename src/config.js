var _ = require("underscore"),
    ioc = require('./ioc'),
    async = require('async');

var store = {};
exports.get = function(path) {
    try {
        var _context = resolve(path);
        return _context.scope[_context.property];
    } catch (ex) {
        return null;
    }
}

exports.getStore = function() {
    return store;
}

exports.assert = function(path) {
    if (!exports.get(path))
        throw new Error("Configuration " + path + " not present");
}

exports.set = function(path, value) {
    var parts = path.split(':');
    var scope = store;
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

exports.defaults = function(defaultConfig) {
    _.extend(store, defaultConfig);
}

var resolve = function(path) {
    var parts = path.split(':');
    var scope = store;
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

exports.file = function(path, callback) {
    exports.loadFile(path,
        function(err, respObj) {
            if (err)
                return callback(err);
            _.extend(store, respObj);
            return callback();
        });
}

exports.loadFile = function(path, callback) {
    var result = null;
    var networkProvider = ioc.getProvider("network");

    async.waterfall([
            function(done) {
                networkProvider.get({
                    url: path,
                    jsonParse: true
                }, function(err, resp) {
                    if (!err)
                        result = resp.parsed.json;
                    return done();
                });
            },
            function(done) {
                if (!result)
                {
                    if(!(typeof location === "undefined"))
                    {
                        var browserCompatiblePath = path.replace("ms-appx://",
                            location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''));
                        networkProvider.get({
                            url: browserCompatiblePath,
                            jsonParse: true
                        }, function(err, resp) {
                            if (!err)
                                result = resp.parsed.json;
                            return done();
                        });
                    }
                    else
                    {
                        result = require(path);
                        return done();
                    }
                }
                else
                    return done();
            }
        ],
        function(err) {
            if (err)
                return callback();
            return callback(null, result);
        });
}
