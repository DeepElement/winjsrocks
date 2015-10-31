// var common = require('../../common'),
//   assert = require('assert'),
//   async = require('async'),
//   resolver = require('../../resolver'),
//   memWatch = require('../../memwatch'),
//   should = require('should');
//
// describe('Integration', function() {
//   describe('Main', function() {
//     describe("Memory Diposed Correctly", function() {
//       it('callback fired', function(done) {
//         var memoryUsage = [];
//         var subject = resolver.resolve('main');
//
//         memWatch.start();
//         async.waterfall([
//             function(cb) {
//               subject.load({}, cb);
//             },
//             function(cb) {
//               subject.unload({}, cb);
//             }
//           ],
//           function() {
//             memWatch.end();
//             memWatch.assert();
//             return done();
//           });
//       });
//     });
//   });
// });
