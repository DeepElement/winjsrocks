var common = require('../common'),
  assert = require('assert'),
  should = require('should'),
  resolver = require('../resolver');

describe('Integration', function() {
  describe('Main', function() {
    describe("load", function() {
      it('callback fired', function(done) {
        // arrange
        var Application = resolver.resolve('./application');
        var subject = new Application();

        // act
        subject.load({}, function(err) {

          // assert
          should.exist(err);

          return done();
        });
      });
    });

    describe("config", function() {
      it('callback fired', function(done) {
        // arrange
        var Application = resolver.resolve('./application');
        var subject = new Application();

        // act
        subject.configure({}, function(err) {

          // assert
          should.not.exist(err);

          return done();
        });
      });
    });

    // describe("resume", function() {
    //   it('callback fired', function(done) {
    //     var subject = require('../../src/main');
    //     subject.resume({}, done);
    //   });
    // });
    //
    // describe("pause", function() {
    //   it('callback fired', function(done) {
    //     var subject = require('../../src/main');
    //     subject.pause({}, done);
    //   });
    // });
  });
});
