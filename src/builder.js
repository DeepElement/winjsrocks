export default class {
  constructor(application) {
    this._application = application;
  }

  registerService(key, constructor) {
    this._application.container.registerService(key, constructor);
  }

  registerProvider(key, constructor) {
    this._application.container.registerProvider(key, constructor);
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
    this._application.WinJSPageDefine(key, templateUri, viewConstructor, true);
  }

  unregisterModelView(key) {
    console.log("TODO:impl");
  }

  registerView(key, viewConstructor, viewModelConstructor, templateUri) {
    this._application.container.registerView(key, viewConstructor);
    this._application.container.registerViewModel(key, viewModelConstructor);
    this._application.WinJSPageDefine(key, templateUri, viewConstructor, false);
  }

  unregisterView(key) {
    console.log("TODO:impl");
  }
};
