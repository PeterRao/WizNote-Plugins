;(function() {
    var doc = document;
    var text; 
    var body = doc.getElementsByTagName('BODY').item(0);

    var math = [];
    var inline = "$"; 
    var SPLIT = /(\$\$?|\\(?:begin|end)\{[a-z]*\*?\}|\\[\\{}$]|[{}]|(?:\n\s*)+|@@\d+@@)/i;

    var isMathJax = WizIsMathJax();

    var converter = new Markdown.Converter();
    Markdown.Extra.init(converter, { extensions: "all", highlighter: "prettify"});

    function WizclearMathJaxMsg() {
        var msg = document.getElementById("MathJax_Message");
        if (!!msg && !!msg.parentNode) {
            msg.parentNode.removeChild(msg);
        }
    }

    function WizOnRenderCompleted() {

        if (window.customObject) {
            try {
                WizclearMathJaxMsg();
                window.customObject.Execute("Wiz_OnRenderCompleted", null, null, null, null);
            }
            catch(e) {
            }
        }
        else {
            console.log("wiznote-markdown-inject, can't implementation customObject");
        }
    }

    function WizOnMarkdownRendered() {
        
        if (!isMathJax) {
            WizOnRenderCompleted();
        }
    }

    function WizOnMathjaxRendered() {  
        WizOnRenderCompleted();
    }

    function WizIsMathJax() {
        var text = doc.body.innerText.replace(/\n/g,'\\n').replace(/\r\n?/g, "\n").replace(/```(.*\n)+?```/gm,'');
        var SPLIT = /(\$\$?)[^$\n]+\1/;
        return SPLIT.test(text);
    }

    function wizInsertElem(doc, part, elem_type, callback) {
        var oPart = doc.getElementsByTagName(part).item(0);
        var oElem = doc.createElement(elem_type);
        callback(oElem);
        oPart.insertBefore(oElem, null);
        return oElem;
    }
    function wizAppendScriptSrc(doc, part, script_type, str) {
        return wizInsertElem(doc, part, "script", function(oScript) {
            oScript.type = script_type;
            oScript.className = "wiz-html-render-unsave";
            oScript.src = str;
        }
      );
    }
    function wizAppendScriptInnerHtml(doc, part, script_type, innerHtmlStr) {
        wizInsertElem(doc, part, "script", function(oScript) {
            oScript.type = script_type;
            oScript.className = "wiz-html-render-unsave";
            oScript.innerHTML = innerHtmlStr;
        }
      );
    }

    function htmlUnEncode( input ) {
        return String(input)
            .replace(/\&amp;/g,'&')
            .replace(/\&gt;/g, '>')
            .replace(/\&lt;/g,'<')
            .replace(/\&quot;/g, '"')
            .replace(/\&&#39;/g, "'");
    }
    function init() {
        if (!jQuery) {
            console.log("markdown inject require jquery");
            WizOnRenderCompleted();
            return;         
        }
        //
        try {
            doc.body.setAttribute("wiz_markdown_inited", "true");
            // g_markdownInited = true;
            ParseContent();
        }
        catch(e) {
            console.log("markdown-inject, unknown exception.");
            WizOnRenderCompleted();
        }
    }

    function processMath(i, j) {
        var block = blocks.slice(i, j + 1).join("")
        .replace(/&/g, "&amp;") // use HTML entity for &
        .replace(/</g, "&lt;")  // use HTML entity for <
        .replace(/>/g, "&gt;"); // use HTML entity for
        while (j > i) {
            blocks[j] = "";
            j--;
        }
        blocks[i] = "@@" + math.length + "@@";
        math.push(block);
        start = end = last = null;
    }

    function replaceMath(text) {
        text = text.replace(/@@(\d+)@@/g, function(match, n) {
            return math[n];
        });
        math = null;
        return text;
    }

    function parseMDContent(text, callback) {
        var content = converter.makeHtml(text);
        WizOnMarkdownRendered();
        callback(content);
    }

    function replaceCodeP2Div() {
        $('p').each(function(){
            $(this).replaceWith($('<div>' + this.innerHTML + '</div>'));
        });
    }
    function ParseContent() {
        try {
            $(doc).find('label.wiz-todo-label').each(function(index) {
                // 防止innerText后产生换行符
                var span = $("<span></span>");
                var parent = $(this).parent();
                span[0].innerText = htmlUnEncode(parent[0].outerHTML);
                span.insertAfter(parent);
                parent.remove();
            });
            $(doc).find('img').each(function(index) {
                var span = $("<span></span>");
                span[0].innerText = htmlUnEncode($(this)[0].outerHTML);
                span.insertAfter($(this));
                $(this).remove();
            });
            $(doc).find('a').each(function(index, link) {
                var linkObj = $(link);
                var href = linkObj.attr('href');
                if (href.indexOf("wiz:") === 0) {
                    var span = $("<span></span>");
                    span[0].innerText = htmlUnEncode(linkObj[0].outerHTML);
                    span.insertAfter(linkObj);
                    linkObj.remove();
                }
            });
        } catch (e) {
            console.log(e);
        }
        replaceCodeP2Div();
        // 替换unicode160的空格为unicode为32的空格，否则pagedown无法识别
        var text = removeMath(body.innerText.replace(/\u00a0/g, " "));
        text = parseMDContent(text, function(content) {
            text = replaceMath(content);
            body.innerHTML = text;
            prettyPrint();
            if (isMathJax) {
                // mathjax 配置
                var config = 'MathJax.Hub.Config({\
                            skipStartupTypeset: true,\
                            "HTML-CSS": {\
                                preferredFont: "TeX",\
                                availableFonts: [\
                                    "STIX",\
                                    "TeX"\
                                ],\
                                linebreaks: {\
                                    automatic: true\
                                },\
                                EqnChunk: 10,\
                                imageFont: null\
                            },\
                            tex2jax: {\
                                inlineMath: [["$","$"],["\\\\\\\\(","\\\\\\\\)"]],\
                                displayMath: [["$$","$$"],["\\\\[","\\\\]"]],\
                                processEscapes: true },\
                            TeX: {\
                                equationNumbers: {\
                                    autoNumber: "AMS"\
                                },\
                                noUndefined: {\
                                    attributes: {\
                                        mathcolor: "red",\
                                        mathbackground: "#FFEEEE",\
                                        mathsize: "90%"\
                                    }\
                                },\
                                Safe: {\
                                    allow: {\
                                        URLs: "safe",\
                                        classes: "safe",\
                                        cssIDs: "safe",\
                                        styles: "safe",\
                                        fontsize: "all"\
                                    }\
                                }\
                            },\
                            messageStyle: "none"\
                        });';
                wizAppendScriptInnerHtml(doc, 'HEAD', "text/x-mathjax-config", config);
                var MathJaxScript = wizAppendScriptSrc(doc, 'HEAD', "text/javascript", "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML");
                MathJaxScript.onload = function() {
                    MathJax.Hub.Queue(
                        ["Typeset", MathJax.Hub, document.body],
                        [function() {
                            WizOnMathjaxRendered();
                        }]
                    );
                };
            }
        });
    }

    function removeMath(text) {
        start = end = last = null; // for tracking math delimiters
        math = []; // stores math strings for latter

        blocks = text.replace(/\r\n?/g, "\n").split(SPLIT);
        for ( var i = 1, m = blocks.length; i < m; i += 2) {
            var block = blocks[i];
            if (block.charAt(0) === "@") {
 
                blocks[i] = "@@" + math.length + "@@";
                math.push(block);
            } else if (start) {

                if (block === end) {
                    if (braces) {
                        last = i;
                    } else {
                        processMath(start, i);
                    }
                } else if (block.match(/\n.*\n/)) {
                    if (last) {
                        i = last;
                        processMath(start, i);
                    }
                    start = end = last = null;
                    braces = 0;
                } else if (block === "{") {
                    braces++;
                } else if (block === "}" && braces) {
                    braces--;
                }
            } else {
                //
                // Look for math start delimiters and when
                // found, set up the end delimiter.
                //
                if (block === "$$") {
                    start = i;
                    end = block;
                    braces = 0;
                } else if (block.substr(1, 5) === "begin") {
                    start = i;
                    end = "\\end" + block.substr(6);
                    braces = 0;
                }
            }
        }
        if (last) {
            processMath(start, last);
        }
        return blocks.join("");
    }
    init();
})();
