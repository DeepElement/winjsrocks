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

        //act
        async.eachSeries(pages,
          function(page, pageCb) {
            applicationInstance.builder.registerView(page.key,
              page.view,
              page.viewModel,
              page.templateUri
            );

            var navigateDelegate = function() {
              messageService.unregister("navigatedMessage",
                navigateDelegate);

              navigationService.view.should.be.an.instanceOf(page.view);
              navigationService.viewModel.should.be.an.instanceOf(page.viewModel);

              return pageCb();
            };

            messageService.register("navigatedMessage",
              navigateDelegate);

            messageService.send("navigateToMessage", {
              viewKey: page.key
            });

          }, done);
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

        //act
        async.waterfall([
          function(cb) {
            async.eachSeries(pages,
              function(page, pageCb) {
                applicationInstance.builder.registerView(page.key,
                  page.view,
                  page.viewModel,
                  page.templateUri
                );

                var navigateDelegate = function() {
                  messageService.unregister("navigatedMessage",
                    navigateDelegate);
                  return pageCb();
                };

                messageService.register("navigatedMessage",
                  navigateDelegate);

                messageService.send("navigateToMessage", {
                  viewKey: page.key
                });
              }, cb);
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

        //act
        async.waterfall([
          function(cb) {
            async.eachSeries(pages,
              function(page, pageCb) {
                applicationInstance.builder.registerView(page.key,
                  page.view,
                  page.viewModel,
                  page.templateUri
                );

                var navigateDelegate = function() {
                  messageService.unregister("navigatedMessage",
                    navigateDelegate);
                  return pageCb();
                };

                messageService.register("navigatedMessage",
                  navigateDelegate);

                messageService.send("navigateToMessage", {
                  viewKey: page.key
                });
              }, cb);
          },
          function(cb) {
            async.eachSeries([1, 0],
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
