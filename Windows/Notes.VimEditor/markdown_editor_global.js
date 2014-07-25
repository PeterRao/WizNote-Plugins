function MarkdownEditorOnTabClose(objHtmlDocument, objWizDocument) {
    if (objWizDocument)
        return;
    if (!objHtmlDocument)
        return;
    try {
        objHtmlDocument.defaultView.eval("if (onBeforeCloseTab_MarkdownEditor) onBeforeCloseTab_MarkdownEditor();");
    }
    catch (err) {
    }

};

eventsTabClose.add(MarkdownEditorOnTabClose);

function newMarkdownDoc() {
    var pluginPath = objApp.GetPluginPathByScriptFileName("markdown_editor_global.js");
    var setting = pluginPath + "plugin.ini";
    var untitled = objApp.LoadStringFromFile(setting, "Untitled"); 
    var title = untitled + ".md"

    var location = objWindow.CategoryCtrl.SelectedFolder.Location;
    var folder = objDatabase.GetFolderByLocation(location, false);
    doc = folder.CreateDocument2("XXX", "");
    doc.Title = title;
    doc.UpdateDocument3("", 0);
	objWindow.ViewDocument(doc, true);

    var editorFileName = pluginPath + "markdown_editor.html?guid=" + objWindow.CurrentDocument.GUID + "&kbguid=" + objWindow.CurrentDocument.Database.KbGUID;
    objWindow.ViewHtml(editorFileName, true);
};

var pluginPath = objApp.GetPluginPathByScriptFileName("markdown_editor_global.js");
objWindow.AddToolButton("main", "NewMarkdownDoc", "新建md文档", "", "newMarkdownDoc");

