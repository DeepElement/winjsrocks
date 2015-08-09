var assert = require('assert'),
  should = require('should');

describe('Integration', function() {
  describe('Main', function() {
    describe("load", function() {
      it('callback fired', function(done) {
        var subject = require('../../src/main');
        subject.load({}, done);
      });

      afterEach(function(done) {
        var subject = require('../../src/main');
        subject.unload({}, done);
      });
    });

    describe("unload", function() {
      it('callback fired', function(done) {
        var subject = require('../../src/main');
        subject.unload({}, done);
      });
    });

    describe("resume", function() {
      it('callback fired', function(done) {
        var subject = require('../../src/main');
        subject.resume({}, done);
      });
    });

    describe("pause", function() {
      it('callback fired', function(done) {
        var subject = require('../../src/main');
        subject.pause({}, done);
      });
    });
  });
});
