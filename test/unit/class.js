// var common = require('../common'),
//     assert = require('assert'),
//     should = require('should'),
//     util = require("util"),
//     sinon = require("sinon");
//
// describe('Unit', function() {
//     describe('WinJS.UI.Pages.define', function() {
//         describe("base-view", function() {
//             it("Can provide baseview type", function() {
//                 // arrange
//                 var WinJS = require('winjs');
// 
//                 function abs(uri) {
//                     var a = document.createElement("a");
//                     a.href = uri;
//                     return a.href;
//                 }
//
//                 var templateUri = "/all/your/base.html";
//                 var absTemplateUri = abs(templateUri);
//                 var pageClassDef = WinJS.UI.Pages.get(absTemplateUri);
//                 var baseViewDef = WinJS.Class.define(
//                     function() {
//                         this._super.apply(this, arguments);
//                     }, {
//                         init: function(element, options) {
//                             return this._super.prototype.init.apply(this, arguments);
//                         }
//                     });
//
//                 baseViewDef.prototype._super = pageClassDef;
//                 var pageClassDeriveDef = WinJS.Class.derive(pageClassDef, baseViewDef, baseViewDef.prototype);
//                 WinJS.UI.Pages._viewMap[absTemplateUri] = pageClassDeriveDef;
//
//                 var pageClassInstance = new WinJS.UI.Pages._viewMap[absTemplateUri]()
//                 pageClassInstance.init();
//                 pageClassInstance.ready();
//
//                 // assert
//                 (pageClassInstance instanceof baseViewDef).should.be.ok();
//                 (pageClassInstance instanceof pageClassDef).should.be.ok();
//             });
//         });
//     });
// });
