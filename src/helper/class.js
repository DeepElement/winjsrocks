module.exports = {
  define: function(_constructor, methods) {
    _constructor.prototype.constructor = _constructor;
    module.exports.mix(_constructor, methods);
    var classDef = _constructor;
    return module.exports.decorateObservers(classDef);
  },
  derive: function(parentClassDef, childClassConstructor, childClassMethods) {
    // Parasitic Combination Inheritance
    var copyOfParent = Object.create(parentClassDef.prototype);
    copyOfParent.constructor = childClassConstructor;
    childClassConstructor.prototype = copyOfParent;

    // super/base exposed for profit
    childClassMethods.super = parentClassDef;
    childClassMethods.base = parentClassDef.prototype;

    var classDef = module.exports.define(childClassConstructor, childClassMethods);
    return module.exports.decorateObservers(classDef);
  },
  mix: function(classDef, mixinDef) {
    for (var propertyKey in mixinDef) {
      if (mixinDef[propertyKey] && (mixinDef[propertyKey]["get"] || mixinDef[propertyKey]["set"]))
        Object.defineProperty(classDef.prototype, propertyKey, mixinDef[propertyKey]);
      else
        classDef.prototype[propertyKey] = mixinDef[propertyKey];
    }
  },
  decorateObservers: function(classDef) {
    var properties = Object.getOwnPropertyNames(classDef.prototype).filter(function(p) {
      return !(typeof classDef.prototype[p] === 'function');
    });
    return classDef;
  }
};
