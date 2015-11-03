var common = require('../common'),
  assert = require('assert'),
  should = require('should'),
  resolver = require('../resolver');

describe('Integration', function() {
  describe('Main', function() {
    describe("load", function() {
      it('error before config call', function(done) {
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

      it('success after config call', function(done) {
        // arrange
        var Application = resolver.resolve('./application');
        var subject = new Application();

        // act
        subject.configure({}, function(err) {
          should.not.exist(err);
          subject.load({}, function(err) {
            should.not.exist(err);
            subject.unload({}, done);
          });
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

    describe("resume", function() {
      it('error before config call', function(done) {
        // arrange
        var Application = resolver.resolve('./application');
        var subject = new Application();

        // act
        subject.resume({}, function(err) {

          // assert
          should.exist(err);

          return done();
        });
      });

      it('error before load call', function(done) {
        // arrange
        var Application = resolver.resolve('./application');
        var subject = new Application();

        // act
        subject.configure({}, function(err) {
          should.not.exist(err);
          subject.resume({}, function(err) {
            should.exist(err);

            return done();
          });
        });
      });

      it('error before pause call', function(done) {
        // arrange
        var Application = resolver.resolve('./application');
        var subject = new Application();

        // act
        subject.configure({}, function(err) {
          should.not.exist(err);
          subject.load({}, function(err) {
            should.not.exist(err);
            subject.resume({}, function(err) {
              should.exist(err);

              subject.unload({}, done);
            });
          });
        });
      });

      it('success after config, load and pause call', function(done) {
        // arrange
        var Application = resolver.resolve('./application');
        var subject = new Application();

        // act
        subject.configure({}, function(err) {
          should.not.exist(err);
          subject.load({}, function(err) {
            should.not.exist(err);
            subject.pause({}, function(err) {
              should.not.exist(err);
              subject.resume({}, function(err) {
                should.not.exist(err);
                subject.unload({}, done);
              });
            });
          });
        });
      });
    });
  });
});
