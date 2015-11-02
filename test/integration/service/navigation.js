var common = require('../../common'),
  assert = require('assert'),
  should = require('should'),
  path = require('path'),
  async = require('async'),
  resolver = require('../../resolver');

describe('Integration', function() {
  describe('Navigation Service', function() {
    var applicationInstance;
    beforeEach(function(done) {
      var Application = resolver.resolve('./application');
      applicationInstance = new Application();
      applicationInstance.configure({}, function(err) {
        if (err)
          return done(err);
        applicationInstance.load({}, done);
      });
    });

    describe("Navigation Forward", function() {
      it('standard success', function(done) {
        // arrange
        var entry = resolver.resolve('./entry');
        var messageService = applicationInstance.container.getService("message");
        var navigationService = applicationInstance.container.getService("navigation");
        var pages = [{
          key: "viewA",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {

          },
          templateUri: path.join(__dirname, "..", "harness", "default.template.html")
        }];

        //act
        async.eachSeries(pages,
          function(page, pageCb) {
            applicationInstance.builder.registerView(page.key,
              page.view,
              page.viewModel,
              page.templateUri
            );

            messageService.send("navigateToMessage", {
              viewKey: page.key
            })

            navigationService.view.should.be.an.instanceOf(page.view);
            navigationService.viewModel.should.be.an.instanceOf(page.viewModel);

            return pageCb();
          },
          done);

      });
    });
  });
});
