export default class {
  constructor(application) {
    this._application = application;
  }

  registerDomainModel(key, constructor) {
    this._application.container.registerItemModel(key, constructor);
  }

  unregisterDomainModel(key) {
    console.log("TODO:impl");
  }

  registerDomainModelView(key, viewConstructor, viewModelConstructor, templateUri) {
    this._application.container.registerItemView(key, viewConstructor);
    this._application.container.registerItemViewModel(key, viewModelConstructor);
    this._application.WinJSPageDefine(key, templateUri, viewConstructor);
  }

  unregisterModelView(key) {
    console.log("TODO:impl");
  }

  registerView(key, viewConstructor, viewModelConstructor, templateUri) {
    this._application.container.registerView(key, viewConstructor);
    this._application.container.registerViewModel(key, viewModelConstructor);
    this._application.WinJSPageDefine(key, templateUri, viewConstructor);
  }

  unregisterView(key) {
    console.log("TODO:impl");
  }
};
