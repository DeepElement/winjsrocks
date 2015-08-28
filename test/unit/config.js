var common = require('../common'),
  assert = require('assert'),
  should = require('should'),
  util = require("util"),
  resolver = require('../resolver'),
  sinon = require("sinon"),
  path = require('path');

describe('Unit', function() {
  describe('Config', function() {
    describe("loadFile", function() {
      it("Network Request succeeds", function(done) {
        // arrange
        var subject = resolver.resolve('config');

        // act
        subject.loadFile(path.join(__dirname, "..", "harness", "app.config.json"),
          function(err) {
            // assert
            should.not.exist(err);
            return done();
          });
      });
    });
  });
});
