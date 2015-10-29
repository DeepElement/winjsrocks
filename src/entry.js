import "./runtime";
import "./winjs.shim";

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

var ViewModel = {
  Base: BaseViewModel,
  Item: ItemViewModel
}

var View = {
  Base: BaseView,
  Control: ControlView,
  Page: PageView
}

var Service = {
  Base: BaseService
}

var Provider ={
  Base: BaseProvider
}

var Plugin = {
  Base: BasePlugin
}

var Model= {
  Base: BaseModel
}

var Command = {
  Base: BaseCommand
}

// The surface API
export default {
  Application,
  ViewModel,
  View,
  Service,
  Provider,
  Plugin,
  Model,
  Command
}
