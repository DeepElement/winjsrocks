export.define = function(template, viewInstance) {
    var baseMembers = {
        dispose: function() {

        },
        load: function(uri) {

        },
        init: function(element, options) {

        },
        process: function(element, options) {

        },
        processed: function(element, options) {

        },
        render: function(element, options, loadResult) {

        },
        ready: function(element, options) {

        },
        error: function(err) {

        }
    };

    var basePageClassDef = WinJS.Pages.define(template, {});
    WinJS.Pages._viewmap[template] = viewInstance;
    return viewInstance;
}
