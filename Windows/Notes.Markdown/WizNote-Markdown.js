;function WizMarkdown(document, path) {
    var basePath = path;
    var doc = document;

    function isMarkdown() {
        try {
            var title = doc.title;

            if (-1 != title.indexOf(".md")) {
                return true;
            }
            return false;
        }
        catch (err) {
            return false;
        }
    }

    //-----------------------------------------------------------------
    //-----------------------------------------------------------------
    function insertElem(part, elem_type, callbackfunc) {
        var oPart = doc.getElementsByTagName(part).item(0);
        var oElem = doc.createElement(elem_type);
        callbackfunc(oElem);
        //oHead.appendChild(oElem); 
        oPart.insertBefore(oElem, null);
        return oElem;
    }
    //--------------------------------------------

    function appendScriptSrc(part, script_type, str, isServer) {
        return insertElem(part, "script", function(oScript) {
            oScript.type = script_type;
            if (isServer) {
                oScript.src = str;
            } else {
                oScript.src = ("file:///" + basePath + str).replace(/\\/g, '/');
            }
        }
      );
    }

    function appendCssSrc(str) {
        insertElem('HEAD', "link", function(oCss) {
            oCss.rel = "stylesheet";
            oCss.href = ("file:///" + basePath + str).replace(/\\/g, '/');
        }
      );
    }

    function appendScriptInnerHtml(part, script_type, innerHtmlStr) {
        insertElem(part, "script", function(oScript) {
            oScript.type = script_type;
            oScript.innerHTML = innerHtmlStr;
        }
      );
    }
    /*
    *解析markdown内容
    */
    function appendScriptSrc2(part, script_type, str, isServer, onLoadFunc) {

        var oPart = doc.getElementsByTagName(part).item(0);
        var oElem = doc.createElement('script');

        oElem.type = script_type;
        if (!!onLoadFunc) {
            oElem.onload = function() { onLoadFunc(); };
        }
        //
        if (isServer) {
            oElem.src = str;
        } else {
            oElem.src = ("file:///" + basePath + str).replace(/\\/g, '/');
        }

        oPart.insertBefore(oElem, null);
        return oElem;
    }

    function initMarkdown() {
        appendCssSrc("markdown\\GitHub2.css");
        appendScriptSrc('HEAD', "text/javascript", "markdown\\marked.min.js");
        appendScriptSrc('HEAD', "text/javascript", "google-code-prettify\\prettify.js");

        appendScriptSrc2('HEAD', "text/javascript", "markdown\\jquery.min.js", false, function() {
            appendScriptSrc('HEAD', "text/javascript", "wiznote-markdown-inject.js");
       });
    }

    function onDocumentComplete() {
        if (isMarkdown()) {
            initMarkdown();
        }
    }

    function isRenderCompleted() {
        try {
            return doc.defaultView.WizIsMarkdownRendered();
        }
        catch(e) {

        }
    }

    return {
        onDocumentComplete: onDocumentComplete,
        isRenderCompleted: isRenderCompleted
    }

}

// var g_markdown;
// function WizMD_OnDocumentComplete(path, doc) {
//     if (!doc) {
//         doc = document;
//     }
//     //
//     g_markdown = new WizMarkdown(doc, path);
//     g_markdown.onDocumentComplete();
// }

(function() {

    if (!!objApp) {
        try {
            var WizMD_pluginPath = objApp.GetPluginPathByScriptFileName("WizNote-Markdown.js");
            //---------------------------------------------------------------

            function onDocumentComplete(doc) {
                var mardown = new WizMarkdown(doc, WizMD_pluginPath);
                mardown.onDocumentComplete();
            }

            if (eventsHtmlDocumentComplete) {
                eventsHtmlDocumentComplete.add(onDocumentComplete);
            }
        }
        catch(e) {

        }
    }
    
})();