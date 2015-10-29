// var common = require('../../common'),
//   assert = require('assert'),
//   should = require('should'),
//   path = require('path'),
//   async = require('async'),
//   resolver = require('../../resolver'),
//   memWatch = require('../../memwatch');
//
// describe('Integration', function() {
//   describe('Navigator', function() {
//     describe("Keep Memory Stable", function() {
//       beforeEach(function(done) {
//         var subject = resolver.resolve('main');
//         subject.load({}, done);
//       });
//
//       afterEach(function(done) {
//         var subject = resolver.resolve('main');
//         subject.unload({}, done);
//       });
//
//       /*it('callback fired', function(done) {
//         var WinJS = require('winjs');
//         var ioc = resolver.resolve('ioc');
//         var conf = resolver.resolve('config');
//         var viewBase = resolver.resolve('view/base');
//         var viewModelBase = resolver.resolve('view-model/base');
//         var messageService = ioc.getService("message");
//         var navigationService = ioc.getService("navigation");
//
//         var page1ViewModel = WinJS.Class.derive(viewModelBase, function(options) {
//           viewModelBase.apply(this, arguments);
//         }, {
//           onDataSet: function() {
//             var that = this;
//             return viewModelBase.prototype.onDataSet.apply(this, arguments).then(
//               function() {
//                 that.body = window.document.body;
//               });
//           }
//         });
//
//         ioc.registerView("page1", viewBase);
//         ioc.registerViewModel("page1", page1ViewModel);
//         conf.set("pages:page1:template", path.join(__dirname, "..", "harness", "default.template.html"));
//
//         window.document.body.appendChild(navigationService.getRootElement());
//
//         var memoryUsage = [];
//
//         // Do the test
//         memWatch.start();
//
//         for (var i = 0; i <= 50; i++) {
//           messageService.send('navigateToMessage', {
//             viewKey: "page1"
//           });
//
//           messageService.send('navigateBackMessage');
//         }
//
//         memWatch.end();
//         memWatch.assert();
//         return done();
//       });*/
//     });
//   });
// });
