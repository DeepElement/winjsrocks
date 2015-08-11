var ioc = require('../ioc'),
  async = require('async');

exports.notifyServices = function(method, args, done) {
  async.each(ioc.getServiceKeys(),
    function(key, keyCb) {
      var serviceInstance = ioc.get(key);
      if (serviceInstance["on" + method.capitalizeFirstLetter()])
        serviceInstance["on" + method.capitalizeFirstLetter()](args);
    },
    function(err) {
      if (done) {
        if (err)
          return done(err);
        return done();
      }
    })
}
