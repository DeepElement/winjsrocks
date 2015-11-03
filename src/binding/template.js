import WinJS from 'winjs';
import Component from "../common/component";

export default class extends Component {
  constructor(application) {
    super(application);
  }

  ItemTemplateSelector(itemPromise) {
    var that = this;
    var mediaTile = document.createElement("div");
    WinJS.Utilities.addClass(mediaTile, "item-template");
    var _renderCompletePromise = itemPromise.then(function(item) {
      var itemViewModel = item instanceof Array ? item[0].data : item.data;
      var viewKey = itemViewModel.item.contentType.toLowerCase();
      var viewTemplateUri = that.application.configuration.get("domain:" + viewKey + ":template");
      WinJS.Utilities.addClass(mediaTile, "item-template-" + viewKey);
      var viewClassDef = that.application.container.getItemViewDef(viewKey);
      winjsHelper.pageDefine(viewKey, viewTemplateUri, viewClassDef);
      return WinJS.UI.Pages.render(viewTemplateUri, mediaTile, itemViewModel);
    });
    return {
      element: mediaTile,
      renderComplete: _renderCompletePromise
    };
  }
}
