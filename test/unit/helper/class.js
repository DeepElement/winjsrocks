var common = require('../../common'),
    assert = require('assert'),
    should = require('should'),
    resolver = require('../../resolver');

describe('Unit', function () {
    describe('Helper Class', function () {
        describe('define', function () {
            it("standard success", function () {
                // arrange
                var subject = resolver.resolve('helper/class');
                var samplePropertyValue = 1;
                var privateOnlyPropertyValue = 2;
                var sampleMethodValue = 25;
                var sampleOptions = {
                    aConfigurationValue : 75
                };
                var _constructor = function (options) {
                    this.options = options;
                    this._sampleProperty = samplePropertyValue;
                    this._privateOnlyProperty = privateOnlyPropertyValue;
                };
                var members = {
                    sampleProperty : {
                        get: function () {
                            return this._sampleProperty;
                        },
                        set: function (val) {
                            this._sampleProperty = val;
                        }
                    },
                    sampleMethod: function () {
                        return sampleMethodValue;
                    }
                };

                // act
                var classDef = subject.define(_constructor, members);
                var instance = new classDef(sampleOptions);

                // assert
                should.exist(instance.sampleProperty);
                should.exist(instance.sampleMethod);
                should.exist(instance.options);
                should.exist(instance._privateOnlyProperty);
                instance.sampleProperty.should.equal(samplePropertyValue);
                instance.sampleMethod().should.equal(sampleMethodValue);
                instance.options.should.equal(sampleOptions);
                instance._privateOnlyProperty.should.equal(privateOnlyPropertyValue);
            });
        });

        describe('derive', function () {
            it("First Level - members available", function () {
                // arrange
                var subject = resolver.resolve('helper/class');
                var samplePropertyValue = 1;
                var privateOnlyPropertyValue = 2;
                var sampleMethodValue = 25;
                var sampleOptions = {
                    aConfigurationValue : 75
                };
                var _constructor = function (options) {
                    this.options = options;
                    this._sampleProperty = samplePropertyValue;
                    this._privateOnlyProperty = privateOnlyPropertyValue;
                };
                var members = {
                    sampleProperty : {
                        get: function () {
                            return this._sampleProperty;
                        },
                        set: function (val) {
                            this._sampleProperty = val;
                        }
                    },
                    sampleMethod: function () {
                        return sampleMethodValue;
                    }
                };

                var concereteConstructor = function (options) {
                    return this.super.call(this, arguments);
                };

                var concreteMembers = {
                };

                // act
                var baseClassDef = subject.define(_constructor, members);
                var concereteClassDef = subject.derive(baseClassDef, concereteConstructor, concreteMembers);
                var instance = new concereteClassDef(sampleOptions);

                // assert
                should.exist(instance.sampleProperty);
                should.exist(instance.sampleMethod);
                //should.exist(instance.options);
                should.exist(instance._privateOnlyProperty);
                instance.sampleProperty.should.equal(samplePropertyValue);
                instance.sampleMethod().should.equal(sampleMethodValue);
                instance._privateOnlyProperty.should.equal(privateOnlyPropertyValue);
            });
        });

        describe('derive', function () {
            it("First Level - override method", function () {
                // arrange
                var subject = resolver.resolve('helper/class');
                var samplePropertyValue = 1;
                var privateOnlyPropertyValue = 2;
                var sampleMethodValue = 25;
                var sampleOptions = {
                    aConfigurationValue : 75
                };
                var firstLevelCalled = false, secondLevelCalled = false;
                var _constructor = function (options) {
                    this.options = options;
                    this._sampleProperty = samplePropertyValue;
                    this._privateOnlyProperty = privateOnlyPropertyValue;
                };
                var members = {
                    baseClassProperty: 234,
                    sampleProperty : {
                        get: function () {
                            return this._sampleProperty;
                        },
                        set: function (val) {
                            this._sampleProperty = val;
                        }
                    },
                    sampleMethod: function () {
                        firstLevelCalled = true;
                        return sampleMethodValue;
                    }
                };

                var concereteConstructor = function (options) {
                    this.super.call(this, arguments);
                };

                var concreteMembers = {
                    concereteClassProperty: 2343,
                    sampleMethod: function () {
                        secondLevelCalled = true;
                        return this.base.sampleMethod.call(this, arguments);
                    }
                };

                // act
                var baseClassDef = subject.define(_constructor, members);
                var concereteClassDef = subject.derive(baseClassDef, concereteConstructor, concreteMembers);
                var instance = new concereteClassDef(sampleOptions);

                // assert
                should.exist(instance.sampleProperty);
                should.exist(instance.sampleMethod);
                should.exist(instance.options);
                should.exist(instance._privateOnlyProperty);
                instance.sampleProperty.should.equal(samplePropertyValue);
                instance.sampleMethod().should.equal(sampleMethodValue);
                instance._privateOnlyProperty.should.equal(privateOnlyPropertyValue);
                firstLevelCalled.should.be.ok;
                secondLevelCalled.should.be.ok;
            });
        });
    });
});
