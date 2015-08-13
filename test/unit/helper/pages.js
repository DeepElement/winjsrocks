var common = require('../../common'),
    assert = require('assert'),
    should = require('should'),
    sinon = require("sinon");

describe('Unit', function() {
    describe('Helper', function() {
        describe("Pages", function() {
            describe("define", function() {
                var winjsPageMethods = ['dispose', 'load', 'init', 'process', 'processed', 'render', 'ready', 'error'];

                it("Inheritence - Type Validation", function() {
                    // arrange
                    var WinJS = require('winjs');
                    var helper = require('../../../src/helper/pages');

                    var baseViewDef = WinJS.Class.define(
                        function() {
                            this._super.apply(this, arguments);
                        }, {});
                    var pageClassDef = helper.define("/all/your/base.html", baseViewDef);
                    var pageInstance = new pageClassDef();

                    // assert
                    (pageInstance instanceof pageClassDef).should.be.ok();
                    (pageInstance instanceof baseViewDef).should.be.ok();
                });

                it("Inheritence - Method Validation", function() {
                    // arrange
                    var WinJS = require('winjs');
                    var helper = require('../../../src/helper/pages');

                    var baseViewDef = WinJS.Class.define(
                        function() {
                            this._super.apply(this, arguments);
                        }, {});
                    var pageClassDef = helper.define("/all/your/base.html", baseViewDef);
                    var pageInstance = new pageClassDef();

                    // verify page level methods
                    winjsPageMethods.forEach(function(m) {
                        should.exist(pageInstance[m]);
                    });
                });

                it("Inheritence - Overriden method", function() {
                    // arrange
                    var WinJS = require('winjs');
                    var helper = require('../../../src/helper/pages');

                    var overrideMethodCalled = false;
                    var baseViewDef = WinJS.Class.define(
                        function() {
                            this._super.apply(this, arguments);
                        }, {
                            init: function() {
                                this._super.prototype.init.apply(this, arguments);
                            }
                        });
                    var pageClassDef = helper.define("/all/your/base.html", baseViewDef);
                    var pageInstance = new pageClassDef();

                    // act
                    pageInstance.init();

                    // assert
                    overrideMethodCalled.should.be.ok();
                });
            });
        });
    });
});
