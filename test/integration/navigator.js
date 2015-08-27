var common = require('../common'),
  assert = require('assert'),
  should = require('should'),
  path = require('path'),
  async = require('async'),
  resolver = require('../resolver');

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
        gc();
        memoryUsage.push(process.memoryUsage());

        messageService.send('navigateToMessage', {
          viewKey: "page2"
        });


        gc();
        memoryUsage.push(process.memoryUsage());

        var diffs = memoryUsage.map(function(mm) {
          return {
            rss: mm.rss - memoryUsage[0].rss,
            heapTotal: mm.heapTotal - memoryUsage[0].heapTotal,
            heapUsed: mm.heapUsed - memoryUsage[0].heapUsed
          };
        });

        for (var i = 0; i <= diffs.length - 1; i++)
          for (var m = 0; m <= diffs[i].length - 1; m++) {
            diffs[i][m].should.be.most(0);
          }

        setTimeout(function() {
          console.log(window.document.body.innerHTML);


          return done();
        }, 5000);
      });
    });
  });
});
