var common = require('../../common'),
  assert = require('assert'),
  should = require('should'),
  path = require('path'),
  async = require('async'),
  resolver = require('../../resolver');

/*
var Helpers = {
  navigateForward: function(application, viewKeys, callback) {
    var WinJS = require('winjs');
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
        // TODO: verify WINJS backstack
        // TODO: verify browser history
        return callback(err);
      });
  },
  navigateBackward: function(application,
    expectedViewKeys,
    callback) {
    var WinJS = require('winjs');
    var MessageService = application.container.getService('message');
    var NavigationService = application.container.getService('navigation');
    var idx = 0;
    var forceFail = false;
    async.whilst(
      function() {
        return WinJS.Navigation.canGoBack;
      },
      function(stepCb) {
        var currentExpectedKey = expectedViewKeys[idx];
        if (!currentExpectedKey) {
          return stepCb('key-out-of-bounds');
        }

        var navigateDelegate = function() {
          MessageService.unregister("navigatedMessage",
            navigateDelegate);

          NavigationService.viewModel.key.should.equal(currentExpectedKey);

          // TODO: verify WINJS backstack
          // TODO: verify browser history

          idx++;

          return stepCb();
        };

        MessageService.register("navigatedMessage",
          navigateDelegate);

        MessageService.send("navigateBackMessage");
      },
      function(err) {
        return callback(err);
      });
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


    describe("BackStack - View Error", function() {
      it('standard success', function(done) {
        // arrange
        var entry = resolver.resolve('./entry');
        var messageService = applicationInstance.container.getService("message");
        var navigationService = applicationInstance.container.getService("navigation");
        var pages = [{
          key: "splash",
          view: class extends entry.View.Page {},
          viewModel: class extends entry.ViewModel.Base {
            get isModal() {
              return true;
            }
          },
          templateUri: path.join(__dirname, "..", "..", "harness", "template.1.html")
        }, {
          key: "landing",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {},
          templateUri: path.join(__dirname, "..", "..", "harness", "template.2.html")
        }, {
          key: "player",
          view: class extends entry.View.Page {
            render(element, options, loadResult) {
              throw new Error();
              return super.render(element, options, loadResult);
            }
          },
          viewModel: class extends entry.ViewModel.Base {
            get isModal() {
              return true;
            }
          },
          templateUri: path.join(__dirname, "..", "..", "harness", "template.3.html")
        }];

        pages.forEach(function(page) {
          applicationInstance.builder.registerView(page.key,
            page.view,
            page.viewModel,
            "file://" + page.templateUri
          );
        });

        //act
        async.waterfall([
          function(cb) {
            Helpers.navigateForward(applicationInstance, ['splash', 'landing', 'player', 'player'],
              cb);
          },
          function(cb) {
            Helpers.navigateBackward(applicationInstance, ['landing'],
              cb);
          }
        ], done);
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
          templateUri: path.join(__dirname, "..", "..", "harness", "template.1.html")
        }, {
          key: "viewB",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {},
          templateUri: path.join(__dirname, "..", "..", "harness", "template.2.html")
        }];
        pages.forEach(function(page) {
          applicationInstance.builder.registerView(page.key,
            page.view,
            page.viewModel,
            "file://" + page.templateUri
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
          templateUri: path.join(__dirname, "..", "..", "harness", "template.1.html")
        }, {
          key: "viewB",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {},
          templateUri: path.join(__dirname, "..", "..", "harness", "template.2.html")
        }, {
          key: "viewC",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {},
          templateUri: path.join(__dirname, "..", "..", "harness", "template.3.html")
        }];

        pages.forEach(function(page) {
          applicationInstance.builder.registerView(page.key,
            page.view,
            page.viewModel,
            "file://" + page.templateUri
          );
        });

        //act
        async.waterfall([
          function(cb) {
            Helpers.navigateForward(applicationInstance, ['viewA', 'viewB', 'viewC'],
              cb);
          },
          function(cb) {
            Helpers.navigateBackward(applicationInstance, ['viewB', 'viewA'],
              cb);
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
          templateUri: path.join(__dirname, "..", "..", "harness", "template.1.html")
        }, {
          key: "view2",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {
            get isModal() {
              return true;
            }
          },
          templateUri: path.join(__dirname, "..", "..", "harness", "template.2.html")
        }, {
          key: "view3",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {
            get isModal() {
              return true;
            }
          },
          templateUri: path.join(__dirname, "..", "..", "harness", "template.3.html")
        }, {
          key: "view4",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {},
          templateUri: path.join(__dirname, "..", "..", "harness", "template.4.html")
        }];

        pages.forEach(function(page) {
          applicationInstance.builder.registerView(page.key,
            page.view,
            page.viewModel,
            "file://" + page.templateUri
          );
        });

        //act
        async.waterfall([
          function(cb) {
            Helpers.navigateForward(applicationInstance, ['view1', 'view2', 'view3', 'view4'],
              cb);
          },
          function(cb) {
            Helpers.navigateBackward(applicationInstance, ['view1'],
              cb);
          }
        ], done);
      });

      it('splash - landing - player use-case', function(done) {
        // arrange
        var WinJS = require('winjs');
        var entry = resolver.resolve('./entry');
        var messageService = applicationInstance.container.getService("message");
        var navigationService = applicationInstance.container.getService("navigation");
        var pages = [{
          key: "splash",
          view: class extends entry.View.Page {},
          viewModel: class extends entry.ViewModel.Base {
            get isModal() {
              return true;
            }
          },
          templateUri: path.join(__dirname, "..", "..", "harness", "template.1.html")
        }, {
          key: "landing",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {
            get isModal() {
              return false;
            }
          },
          templateUri: path.join(__dirname, "..", "..", "harness", "template.2.html")
        }, {
          key: "player",
          view: class extends entry.View.Page {

          },
          viewModel: class extends entry.ViewModel.Base {
            get isModal() {
              return true;
            }
          },
          templateUri: path.join(__dirname, "..", "..", "harness", "template.3.html")
        }];

        pages.forEach(function(page) {
          applicationInstance.builder.registerView(page.key,
            page.view,
            page.viewModel,
            "file://" + page.templateUri
          );
        });

        //act
        async.waterfall([
          function(cb) {
            Helpers.navigateForward(applicationInstance, ['splash', 'landing', 'player', 'player'],
              cb);
          },
          function(cb) {
            Helpers.navigateBackward(applicationInstance, ['landing'],
              cb);
          }
        ], done);
      });
    });
  });
});*/
