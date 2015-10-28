import "./runtime";
import "./winjs.shim";

import application from "./application";
import container from "./ioc";
import logger from "./log";
import configuration from "./config";
import baseViewModel from "./view-model/base";
import itemViewModel from "./view-model/item";
import baseView from "./view/base";
import controlView from "./view/control";
import pageView from "./view/page";
import baseService from "./service/base";
import baseProvider from "./provider/base";
import basePlugin from "./plugin/base";
import baseModel from "./model/base";
import baseCommand from "./command/base";
import builder from "./builder";

var viewModel = {
  baseViewModel,
  itemViewModel
}

var view = {
  baseView,
  controlView,
  pageView
}

var service = {
  baseService
}

var provider ={
  baseProvider
}

var plugin = {
  basePlugin
}

var model= {
  baseModel
}

var command = {
  baseCommand
}

// The surface API
export default {
  application,
  builder,
  container,
  logger,
  configuration,
  viewModel,
  view,
  service,
  provider,
  plugin,
  model,
  command
}
