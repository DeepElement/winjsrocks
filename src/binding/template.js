import WinJS from 'winjs';
import Component from "../common/component";

export default class extends Component {
  constructor(application) {
    super(application);

    this.ItemTemplateSelector = function(itemPromise){
      var mediaTile = document.createElement("div");
      WinJS.Utilities.addClass(mediaTile, "item-template");
      var _renderCompletePromise = itemPromise.then(function(item) {
        var itemViewModel = item instanceof Array ? item[0].data : item.data;
        var viewKey = itemViewModel.item.contentType.toLowerCase();
        var viewTemplateUri = application.configuration.get("domain:" + viewKey + ":template");
        WinJS.Utilities.addClass(mediaTile, "item-template-" + viewKey);
        var viewClassDef = application.container.getItemViewDef(viewKey);
        application.WinJSPageDefine(viewKey, viewTemplateUri, viewClassDef);
        return WinJS.UI.Pages.render(viewTemplateUri, mediaTile, itemViewModel);
      });
      return {
        element: mediaTile,
        renderComplete: _renderCompletePromise
      };
    }
  }
}
