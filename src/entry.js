import Application from "./application";
import BaseViewModel from "./view-model/base";
import ItemViewModel from "./view-model/item";
import BaseView from "./view/base";
import ControlView from "./view/control";
import PageView from "./view/page";
import BaseService from "./service/base";
import BaseProvider from "./provider/base";
import BasePlugin from "./plugin/base";
import BaseModel from "./model/base";
import BaseCommand from "./command/base";
import Builder from "./builder";
import WinJSHelper from "./helper/winjs";

class EntryClass {
  static get Application() {
    return Application;
  }

  static get ViewModel() {
    return {
      Base: BaseViewModel,
      Item: ItemViewModel
    }
  }

  static get View() {
    return {
      Base: BaseView,
      Control: ControlView,
      Page: PageView
    }
  }

  static get Service() {
    return {
      Base: BaseService
    }
  }

  static get Provider() {
    return {
      Base: BaseProvider
    }
  }

  static get Plugin() {
    return {
      Base: BasePlugin
    }
  }

  static get Model() {
    return {
      Base: BaseModel
    }
  }

  static get Command() {
    return {
      Base: BaseCommand
    }
  }

  static markForProcessing(subject) {
    return WinJSHelper.markForProcessing(subject);
  }
}

EntryClass.markForProcessing(EntryClass);

export default EntryClass;
