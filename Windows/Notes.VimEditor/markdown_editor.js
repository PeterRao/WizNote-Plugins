var objApp = WizExplorerApp;
var objWindow = objApp.Window;

if (objWindow.CurrentDocument != null)
{
    var pluginPath = objApp.GetPluginPathByScriptFileName("markdown_editor.js");
    var editorFileName = pluginPath + "markdown_editor.html?guid=" + objWindow.CurrentDocument.GUID + "&kbguid=" + objWindow.CurrentDocument.Database.KbGUID;
    objWindow.ViewHtml(editorFileName, true);
}
