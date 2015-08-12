var common = require('../common'),
    assert = require('assert'),
    should = require('should'),
    sinon = require("sinon");

describe('Unit', function() {
    describe('WinJS.Pages.define', function() {
        describe("base-view", function() {
            it("Can provide baseview type", function() {
                // arrange
                var WinJS = require('winjs');

                var templateUri = "/all/your/base.html";
                var pageClassDef = WinJS.UI.Pages.define(templateUri);
                var baseViewDef = WinJS.Class.define(
                    function() {
                        this._super.apply(this);
                    }, {
                        init: function(element, options) {
                            return this._super.prototype.init.apply(this, arguments);
                        }
                    });

                baseViewDef.prototype._super = pageClassDef;
                var pageClassDeriveDef = WinJS.Class.derive(pageClassDef, baseViewDef, baseViewDef.prototype);
                WinJS.UI.Pages._viewMap[templateUri] = pageClassDeriveDef;

                // create the instance for testing
                var pageClassInstance = new pageClassDeriveDef();
                pageClassInstance.init();
                pageClassInstance.ready();

                // assert
                (pageClassInstance instanceof baseViewDef).should.be.ok();
                (pageClassInstance instanceof pageClassDef).should.be.ok();
            });
        });
    });

    describe('WinJS.Class.define', function() {
        // TODO:
    });

    describe('WinJS.Class.derive', function() {
        // TODO:
    });
});
