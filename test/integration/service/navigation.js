var common = require('../../common'),
  assert = require('assert'),
  should = require('should'),
  path = require('path'),
  async = require('async'),
  resolver = require('../../resolver');


var Helpers = {
  navigateForward: function(application, viewKeys, callback) {
    var MessageService = application.container.getService('message');
    var NavigationService = application.container.getService('navigation');
    async.eachSeries(viewKeys,
      function(viewKey, viewKeyCb) {
        var navigateDelegate = function() {
          MessageService.unregister("navigatedMessage",
            navigateDelegate);
          NavigationService.viewModel.key.should.equal(viewKey);
          return viewKeyCb();
        };

        MessageService.register("navigatedMessage",
          navigateDelegate);
        MessageService.send("navigateToMessage", {
          viewKey: viewKey
        });
      },
      function(err) {
        return callback(err);
      });
  },
  navigateBackwards: function(application,
    expectedViewKeys,
    callback) {


    return callback();
  }
}

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


    describe("Navigate to unregistered view", function() {
      it('standard success', function(done) {
        // arrange
        var entry = resolver.resolve('./entry');
        var messageService = applicationInstance.container.getService("message");
        var navigationService = applicationInstance.container.getService("navigation");

        //act
        messageService.send("navigateToMessage", {
          viewKey: "RandomViewKey"
        });
        return done();
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
          view: class extends entry.View.Page {},
          viewModel: class extends entry.ViewModel.Base {},
          templateUri: path.join(__dirname, "..", "harness", "template.1.html")
        }, {
          key: "viewB",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {},
          templateUri: path.join(__dirname, "..", "harness", "template.2.html")
        }];
        pages.forEach(function(page) {
          applicationInstance.builder.registerView(page.key,
            page.view,
            page.viewModel,
            page.templateUri
          );
        });

        //act
        Helpers.navigateForward(applicationInstance, ['viewA', 'viewB'],
          function(err) {
            should.not.exist(err);
            return done();
          });
      });
    });

    describe("Back Navigation", function() {
      it('standard success', function(done) {
        // arrange
        var WinJS = require('winjs');
        var entry = resolver.resolve('./entry');
        var messageService = applicationInstance.container.getService("message");
        var navigationService = applicationInstance.container.getService("navigation");
        var pages = [{
          key: "viewA",
          view: class extends entry.View.Page {},
          viewModel: class extends entry.ViewModel.Base {},
          templateUri: path.join(__dirname, "..", "harness", "template.1.html")
        }, {
          key: "viewB",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {},
          templateUri: path.join(__dirname, "..", "harness", "template.2.html")
        }, {
          key: "viewC",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {},
          templateUri: path.join(__dirname, "..", "harness", "template.3.html")
        }];

        pages.forEach(function(page) {
          applicationInstance.builder.registerView(page.key,
            page.view,
            page.viewModel,
            page.templateUri
          );
        });

        //act
        async.waterfall([
          function(cb) {
            Helpers.navigateForward(applicationInstance, ['viewA', 'viewB', 'viewC'],
              cb);
          },
          function(cb) {
            async.eachSeries([2, 1, 0],
              function(pageIdx, pageIdxCb) {
                var page = pages[pageIdx];
                if (pageIdx != 0) {
                  //var targetPage = pages[pageIdx - 1];

                  // Assert can go back
                  WinJS.Navigation.canGoBack.should.be.ok();

                  var navigateDelegate = function() {
                    messageService.unregister("navigatedMessage",
                      navigateDelegate);
                    return pageIdxCb();
                  };

                  messageService.register("navigatedMessage",
                    navigateDelegate);

                  messageService.send("navigateBackMessage");
                } else {
                  // Assert cannot go back
                  WinJS.Navigation.canGoBack.should.not.be.ok();
                  return pageIdxCb();
                }
              }, cb);
          }
        ], done);
      });
    });



    describe("Modal Navigation", function() {
      it('standard success', function(done) {
        // arrange
        var WinJS = require('winjs');
        var entry = resolver.resolve('./entry');
        var messageService = applicationInstance.container.getService("message");
        var navigationService = applicationInstance.container.getService("navigation");
        var pages = [{
          key: "view1",
          view: class extends entry.View.Page {},
          viewModel: class extends entry.ViewModel.Base {},
          templateUri: path.join(__dirname, "..", "harness", "template.1.html")
        }, {
          key: "view2",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {
            get isModal() {
              return true;
            }
          },
          templateUri: path.join(__dirname, "..", "harness", "template.2.html")
        }, {
          key: "view3",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {
            get isModal() {
              return true;
            }
          },
          templateUri: path.join(__dirname, "..", "harness", "template.3.html")
        }, {
          key: "view4",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {},
          templateUri: path.join(__dirname, "..", "harness", "template.4.html")
        }];

        pages.forEach(function(page) {
          applicationInstance.builder.registerView(page.key,
            page.view,
            page.viewModel,
            page.templateUri
          );
        });

        //act
        async.waterfall([
          function(cb) {
            Helpers.navigateForward(applicationInstance,
              ['view1', 'view2', 'view3', 'view4'],
              cb);
          },
          function(cb) {
            async.eachSeries([1],
              function(pageIdx, pageIdxCb) {
                var page = pages[pageIdx];
                if (pageIdx != 0) {
                  // Assert can go back
                  WinJS.Navigation.canGoBack.should.be.ok();

                  var navigateDelegate = function() {
                    messageService.unregister("navigatedMessage",
                      navigateDelegate);
                    return pageIdxCb();
                  };

                  messageService.register("navigatedMessage",
                    navigateDelegate);

                  messageService.send("navigateBackMessage");
                } else {
                  // Assert cannot go back
                  WinJS.Navigation.canGoBack.should.not.be.ok();
                  return pageIdxCb();
                }
              }, cb);
          }
        ], done);
      });
    });
  });
});
