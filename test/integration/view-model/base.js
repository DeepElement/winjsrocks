// var common = require('../../common'),
//   assert = require('assert'),
//   should = require('should'),
//   resolver = require('../../resolver');
//
// describe('Integration', function() {
//   describe('Base ViewModel', function() {
//
//     beforeEach(function(done) {
//       var subject = resolver.resolve("main");
//       subject.load({}, done);
//     });
//
//     afterEach(function(done) {
//       var subject = resolver.resolve("main");
//       subject.unload({}, done);
//     });
//
//     describe("construction", function() {
//       it('standard success', function() {
//         // Arrange
//         var subject = resolver.resolve("view-model/base");
//
//         // Act
//         var instance = new subject();
//
//         // Assert
//         should.exist(instance);
//       });
//     });
//   });
// });
