var common = require('../../common'),
  assert = require('assert'),
  should = require('should'),
  path = require('path'),
  async = require('async'),
  resolver = require('../../resolver'),
  memWatch = require('../../memwatch');

describe('Integration', function() {
  describe('Navigator', function() {
    describe("Keep Memory Stable", function() {
      beforeEach(function(done) {
        var subject = resolver.resolve('main');
        subject.load({}, done);
      });

      afterEach(function(done) {
        var subject = resolver.resolve('main');
        subject.unload({}, done);
      });

      it('callback fired', function(done) {
        var ioc = resolver.resolve('ioc');
        var conf = resolver.resolve('config');
        var viewBase = resolver.resolve('view/base');
        var viewModelBase = resolver.resolve('view-model/base');
        var messageService = ioc.getService("message");
        var navigationService = ioc.getService("navigation");

        ioc.registerView("page1", viewBase);
        ioc.registerViewModel("page1", viewModelBase);
        conf.set("pages:page1:template", path.join(__dirname, "..", "harness", "default.template.html"));
        ioc.registerView("page2", viewBase);
        ioc.registerViewModel("page2", viewModelBase);
        conf.set("pages:page2:template", path.join(__dirname, "..", "harness", "default.template.html"));

        window.document.body.appendChild(navigationService.getRootElement());


        var memoryUsage = [];
        messageService.send('navigateToMessage', {
          viewKey: "page1"
        });


        // Do the test
        memWatch.start();

        messageService.send('navigateToMessage', {
          viewKey: "page2"
        });

        memWatch.end();
        memWatch.assert();
        return done();
      });
    });
  });
});
