// var common = require('../common'),
//     assert = require('assert'),
//     should = require('should'),
//     sinon = require("sinon"),
//     uuid = require('uuid');
//
// describe('Unit', function() {
//     describe('WinJS.shim', function() {
//         describe("Pages", function() {
//             describe("define", function() {
//                 var winjsPageMethods = ['dispose', 'load', 'init', 'process', 'processed', 'render', 'ready', 'error'];
//
//                 it("Inheritence - Type Validation", function() {
//                     // arrange
//                     var WinJS = require('winjs');
//                     var WinJSShim = require('../../src/winjs.shim');
//
//                     var baseViewDef = WinJS.Class.define(
//                         function() {
//                             this._super.apply(this, arguments);
//                         }, {
//
//                         });
//                     var pageClassDef = WinJS.UI.Pages.define(uuid.v4(), {}, baseViewDef);
//                     var pageInstance = new pageClassDef();
//
//                     // assert
//                     (pageInstance instanceof pageClassDef).should.be.ok();
//                     (pageInstance instanceof baseViewDef).should.be.ok();
//                 });
//
//                 it("Inheritence - Method Validation", function() {
//                     // arrange
//                     var WinJS = require('winjs');
//                     var WinJSShim = require('../../src/winjs.shim');
//
//                     var baseViewDef = WinJS.Class.define(
//                         function() {
//                             this._super.apply(this, arguments);
//                         }, {
//
//                         });
//                     var pageClassDef = WinJS.UI.Pages.define(uuid.v4(), {}, baseViewDef);
//                     var pageInstance = new pageClassDef();
//
//                     // verify page level methods
//                     winjsPageMethods.forEach(function(m) {
//                         should.exist(pageInstance[m]);
//                     });
//                 });
//
//                 it("Inheritence - Overriden method", function() {
//                     // arrange
//                     var WinJS = require('winjs');
//                     var WinJSShim = require('../../src/winjs.shim');
//
//                     var overrideMethodCalled = false;
//                     var baseViewDef = WinJS.Class.define(
//                         function() {
//                             this._super.apply(this, arguments);
//                         }, {
//                             init: function() {
//                                 overrideMethodCalled = true;
//                                 this._super.prototype.init.apply(this, arguments);
//                             }
//                         });
//                     var pageClassDef = WinJS.UI.Pages.define(uuid.v4(), {}, baseViewDef);
//                     var pageInstance = new pageClassDef();
//
//                     // act
//                     pageInstance.init();
//
//                     // assert
//                     overrideMethodCalled.should.be.ok();
//                 });
//
//                 it("Inheritence - second level - Overriden method", function() {
//                     // arrange
//                     var WinJS = require('winjs');
//                     var WinJSShim = require('../../src/winjs.shim');
//
//                     var rootOverrideMethodCalled = false;
//                     var overrideMethodCalled = false;
//                     var baseViewDefRoot = WinJS.Class.define(
//                         function() {
//                             this._super.apply(this, arguments);
//                         }, {
//                             init: function() {
//                                 rootOverrideMethodCalled = true;
//                                 this._super.prototype.init.apply(this, arguments);
//                             }
//                         });
//                     var baseViewDef = WinJS.Class.derive(
//                         baseViewDefRoot,
//                         function() {
//                             baseViewDefRoot.apply(this, arguments);
//                         }, {
//                             init: function() {
//                                 overrideMethodCalled = true;
//                                 baseViewDefRoot.prototype.init.apply(this, arguments);
//                             }
//                         });
//                     var pageClassDef = WinJS.UI.Pages.define(uuid.v4(), {}, baseViewDef);
//                     var pageInstance = new pageClassDef();
//
//                     // act
//                     pageInstance.init();
//
//                     // assert
//                     rootOverrideMethodCalled.should.be.ok();
//                     overrideMethodCalled.should.be.ok();
//                 });
//                 it("Inheritence - second level - Overriden method", function() {
//                     // arrange
//                     var WinJS = require('winjs');
//                     var WinJSShim = require('../../src/winjs.shim');
//
//                     var rootOverrideMethodCalled = false;
//                     var overrideMethodCalled = false;
//                     var baseViewDefRoot = WinJS.Class.define(
//                         function() {
//                             this._super.apply(this, arguments);
//                         }, {
//                             init: function() {
//                                 rootOverrideMethodCalled = true;
//                                 this._super.prototype.init.apply(this, arguments);
//                             }
//                         });
//                     var baseViewDef = WinJS.Class.derive(
//                         baseViewDefRoot,
//                         function() {
//                             baseViewDefRoot.apply(this, arguments);
//                         }, {
//                             init: function() {
//                                 overrideMethodCalled = true;
//                                 baseViewDefRoot.prototype.init.apply(this, arguments);
//                             }
//                         });
//                     var pageClassDef = WinJS.UI.Pages.define(uuid.v4(), {}, baseViewDef);
//                     var pageInstance = new pageClassDef();
//
//                     // act
//                     pageInstance.init();
//
//                     // assert
//                     rootOverrideMethodCalled.should.be.ok();
//                     overrideMethodCalled.should.be.ok();
//                 });
//             });
//         });
//     });
// });
