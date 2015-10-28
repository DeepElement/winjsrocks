import ioc from "./ioc";
import winjsHelper from "./helper/winjs";

export default class {

  static registerDomainModel(key, constructor) {
    ioc.registerItemModel(key, constructor);
  }

  static unregisterDomainModel(key) {
    console.log("TODO:impl");
  }

  static registerDomainModelView(key, viewConstructor, viewModelConstructor, templateUri) {
    ioc.registerItemView(key, viewConstructor);
    ioc.registerItemViewModel(key, viewModelConstructor);
    winjsHelper.pageDefine(key, templateUri, viewConstructor);
  }

  static unregisterModelView(key) {
    console.log("TODO:impl");
  }

  static registerView(key, viewConstructor, viewModelConstructor, templateUri) {
    ioc.registerView(key, viewConstructor);
    ioc.registerViewModel(key, viewModelConstructor);
    winjsHelper.pageDefine(key, templateUri, viewConstructor);
  }

  static unregisterView(key) {
    console.log("TODO:impl");
  }
};
