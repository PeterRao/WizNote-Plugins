
var WizSlide_pluginPath = objApp.GetPluginPathByScriptFileName("WizNote-Slide.js");
var WizSlide_inited = -1;

function WizIsSlide(wizDoc) {
    try {
        var title = wizDoc.Title;

        if (-1 != title.indexOf(".sld")) {
            return true;
        }
        if (title.lastIndexOf(".sld") == -1) {
            return false;
        }
        if (title.lastIndexOf(".sld") == title.length - 3) {
            return true;
        }
        return false;
    }
    catch (err) {
        return false;
    }
}

//---------------------------------------------------------------
eventsHtmlDocumentCompleteEx.add(OnSlideHtmlDocumentCompleteEx);
eventsDocumentBeforeEdit.add(OnSlideHtmlDocumentBeforeEdit);

function OnSlideHtmlDocumentCompleteEx(doc, wizDoc) {
    var btnAdd = doc.getElementById('slideAdd');
    btnAdd.parentNode.removeChild(btnAdd);
    if (WizIsSlide(wizDoc)) {
        WizInitSlide(doc, wizDoc);
        WizSlide_inited = 1;
    }
    else {
        WizSlide_inited = 0;
    }
}

function OnSlideHtmlDocumentBeforeEdit(doc, wizDoc) {
    alert('BeforeEdit');
    if (WizIsSlide(wizDoc)) { 
        if (doc.getElementById('slideAdd') === null) {
            var btnAdd = doc.createElement('button');
            btnAdd.id = 'slideAdd';
            btnAdd.innerText = '增加';
            doc.body.insertBefore(btnAdd);
        }
    }
}
//-----------------------------------------------------------------
//-----------------------------------------------------------------
function WizSlideInsertElem(doc, type, callback) {
    var oPart = doc.getElementsByTagName('head').item(0);
    var oElem = doc.createElement(type);
    callback(oElem);
    //oHead.appendChild(oElem); 
    oPart.insertBefore(oElem, null);
    return oElem;
}
//--------------------------------------------

function WizAppendScript(doc, str) {
    return WizSlideInsertElem(doc,'script', function(oScript) {
        oScript.src = ("file:///" + WizSlide_pluginPath + str).replace(/\\/g, '/');
    });
}

function WizAppendCss(doc, str) {
    WizSlideInsertElem(doc, "link", function(oCss) {
        oCss.rel = "stylesheet";
        oCss.href = ("file:///" + WizSlide_pluginPath + str).replace(/\\/g, '/');
    }
  );
}

// function WizRVAppendScriptInnerHtml(doc, part, script_type, innerHtmlStr) {
//     WizRVInsertElem(doc, part, "div", function(oDiv) {
//         oDiv.innerHTML = "<input type=\"hidden\"><script defer=\"true\" type=\"" + script_type + "\">" + innerHtmlStr + "</scr" + "ipt>";
//     }
//   );
// }
/*
*解析reveal内容
*/

function WizInitSlide(doc, wizDoc) {
    WizAppendCss(doc, "revealjs\\css\\reveal.min.css");
    WizAppendCss(doc, "revealjs\\css\\theme\\solarized.css");
    WizAppendCss(doc, "revealjs\\css\\reveal.my.css");
    WizAppendScript(doc, "revealjs\\js\\reveal.js");
    var jqueryScript = WizAppendScript(doc, "revealjs\\lib\\js\\jquery.min.js");
    jqueryScript.onload = function() {
        WizAppendScript(doc, "wiznote-slide-inject.js");
        //
        doc.addEventListener('keydown', function(e) {
            if (27 == e.keyCode) {
                objApp.Window.CloseFullScreenDocumentWindow(wizDoc);
            }
        });
        doc.addEventListener('dblclick', function(e) {
            objApp.Window.CloseFullScreenDocumentWindow(wizDoc);
        });
    };
}



function WizOnSlideButtonClicked() {
    objWindow.ViewDocumentFullScreen(objWindow.CurrentDocument, "");
}
function WizInitSlideButton() {
    var pluginPath = objApp.GetPluginPathByScriptFileName("WizNote-Slide.js");
    var languangeFileName = pluginPath + "plugin.ini";
    var buttonText = objApp.LoadStringFromFile(languangeFileName, "strPlaySlide");
    objWindow.AddToolButton("document", "SlideButton", buttonText, pluginPath + "Slide.ico", "WizOnSlideButtonClicked");
}

WizInitSlideButton();
