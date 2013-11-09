var sourceURLctr = 1;

var getPreparedCode = (function () {

  var consoleTest = /(^.|\b)console\./,
      re = {
        docReady: /\$\(document\)\.ready/,
        shortDocReady: /\$\(function/,
        console: /(^.|\b)console\.(\S+)/g,
        script: /<\/script/ig,
        code: /%code%/,
        csscode: /%css%/,
        title: /<title>(.*)<\/title>/i,
        winLoad: /window\.onload\s*=/,
        scriptopen: /<script/gi
      };

  var two = function (i) {
    return ('0'+i).slice(-2);
  };

  return function (nojs) {
    // reset all the regexp positions for reuse
    re.docReady.lastIndex = 0;
    re.shortDocReady.lastIndex = 0;
    re.console.lastIndex = 0;
    re.script.lastIndex = 0;
    re.code.lastIndex = 0;
    re.csscode.lastIndex = 0;
    re.title.lastIndex = 0;
    re.winLoad.lastIndex = 0;
    re.scriptopen.lastIndex = 0;

    var parts = [],
        source = '',
        js = '',
        css = '',
        close = '',
        hasHTML = false,
        hasCSS = false,
        hasJS = false,
        date = new Date();

    try {
      source = editors.html.render();
    } catch (e) {
      if (editors.html.processor.id) {
        window.console && window.console.warn(editors.html.processor.id + ' processor compilation failed');
      }
      window.console && window.console.error(e.message);
    }

    try {
      css = editors.css.render();
    } catch (e) {
      if (editors.css.processor.id) {
        window.console && window.console.warn(editors.css.processor.id + ' processor compilation failed');
      }

      window.console && window.console.error(e.message);
    }

    hasHTML = !!$.trim(source);

    if (!nojs) {
      try { // the try/catch is to catch and preprocessor errors
        js = editors.javascript.render();

//    generate websquare.xml
        if(css.trim()) {
          parts = [];
          close = "";
          if (js.indexOf('</head>') !== -1) {
            parts.push(js.substring(0, js.lastIndexOf('</head>')));
            parts.push(js.substring(js.lastIndexOf('</head>')));
            js = parts[0];
            close = parts.length == 2 && parts[1] ? parts[1] : '';
          }
          js += '<style type=\"text/css\"><![CDATA[\n' + css + '\n]]></style>\n' + close;
          css = "";
          parts = [];
          close = "";
        }
//        console.log(js);
        js = " WebSquare.startApplication_jsbin = WebSquare.startApplication;\n" +
            " WebSquare.startApplication = function () {\n" +
            "   try{\n" +
            "     WebSquare.jsbin = {};\n" +
            "     WebSquare.jsbin.str = \"" + js.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/\n|\r/g,"\\n").replace(/script/g,"scr\"+\"ipt") + "\";\n" +
            "//     $l(WebSquare.jsbin.str);\n"+
            "     WebSquare.jsbin.xmlDoc = WebSquare.xml.parse(WebSquare.jsbin.str);\n" +
            "     if( WebSquare.jsbin.xmlDoc != null ) {\n" +
            "       WebSquare.startApplication_jsbin();\n" +
            "     }\n" +
            "   } catch(e) {\n" +
            "   }\n" +
            " }\n" +
            " WebSquare.initialize = function(url){\n" +
            "   var pageFaultMsg = \"\", urlFunc = \"\", xmlDoc;\n" +
            "   if(WebSquare.WebSquaredoc == null){\n" +
            "     try {\n" +
            "       WebSquare.pageURLPrefix = WebSquare.core.getConfiguration(\"/WebSquare/pageURLPrefix/@value\");\n" +
            "       WebSquare.pageURLPrefixType = WebSquare.core.getConfiguration(\"/WebSquare/pageURLPrefix/@type\");\n" +
            "       xmlDoc = WebSquare.jsbin.xmlDoc;\n" +
            "       \n" +
            "       if( xmlDoc != null ) {\n" +
            "         WebSquare.WebSquaredoc = new WebSquare.WebSquareDocument(xmlDoc);\n" +
            "         WebSquare.WebSquaredoc.parsing();\n" +
            "         return true;\n" +
            "       } else {\n" +
            "         pageFaultMsg = WebSquare.core.getConfiguration(\"/WebSquare/pageFaultMsg/@value\");\n" +
            "         if( pageFaultMsg != \"false\" ) {\n" +
            "           WebSquare.loadErrorHandler({code:\"E_initializer_XMLLoadFailError\", msg : WebSquare.language.getMessage( \"E_initializer_XMLLoadFailError\", url )})\n" +
            "         }\n" +
            "       }\n" +
            "     } catch (e){\n" +
            "       if( pageFaultMsg != \"false\" ) {\n" +
            "         WebSquare.loadErrorHandler({code:\"E_initializer_XMLLoadFailError1\", msg : WebSquare.language.getMessage( \"E_initializer_XMLLoadFailError1\", url )})\n" +
            "       }\n" +
            "       WebSquare.exception.printStackTrace( e );\n" +
            "       //throw e;\n" +
            "     }\n" +
            "   }\n" +
            "   return false;\n" +
            " };" +
            "WebSquare.logger.printLog = function( msg ) {\n" +
            " try {\n" +
            "   if(WebSquare.isPrintLog) {\n" +
            "     if( WebSquare.logMsgArray.length > 500 ) {\n" +
            "       delete WebSquare.logMsgArray;\n" +
            "       WebSquare.logMsgArray = [];\n" +
            "       WebSquare.logMsgArray.push(WebSquare.logger.getLogTime() + \" \" + WebSquare.logger.getFileName() + \"] Delete logs for reducing memory usage.\");\n" +
            "     }\n" +
            "     var logMsg1 = WebSquare.BootLoader.getLogTime();\n" +
            "     var logMsg2 = \" \" + WebSquare.logger.getFileName() + \"] \" + msg;\n" +
            "     WebSquare.logMsgArray.push(logMsg1 + logMsg2);\n" +
            "     if(WebSquare.printConsole) {\n" +
            "       console.log(logMsg1 + logMsg2);\n" +
            "     }\n" +
            "     if(WebSquare.remoteConsole) {\n" +
            "       WebSquare.remoteLogMsgArray.push(logMsg1 + WebSquare.logFileName + logMsg2);\n" +
            "     }\n" +
            "     window.top._console.log(logMsg1 + logMsg2);\n" +
            "   }\n" +
            " } catch( e ) {}\n" +
            "};" +
            "WebSquare.BootLoader.printLog = function( msg ) {\n" +
            "  try {\n" +
            "    if(!window.console) {\n" +
            "      var names = [\"log\", \"debug\", \"info\", \"warn\", \"error\", \"assert\", \"dir\", \"dirxml\",\n" +
            "      \"group\", \"groupEnd\", \"time\", \"timeEnd\", \"count\", \"trace\", \"profile\", \"profileEnd\"];\n" +
            "      window.console = {};\n" +
            "      for (var i = 0; i < names.length; ++i) {\n" +
            "        window.console[names[i]] = function() {};\n" +
            "      }\n" +
            "    }\n" +
            "    if( WebSquare.logMsgArray.length > 500 ) {\n" +
            "      delete WebSquare.logMsgArray;\n" +
            "      WebSquare.logMsgArray = [];\n" +
            "      WebSquare.logMsgArray.push(WebSquare.BootLoader.getLogTime() + \" \" + \"BootLoader] Delete logs for reducing memory usage.\");\n" +
            "    }\n" +
            "    var logMsg1 = WebSquare.BootLoader.getLogTime();\n" +
            "    var logMsg2 = \" \" + \"BootLoader] \" + msg;\n" +
            "    WebSquare.logMsgArray.push(logMsg1 + logMsg2);\n" +
            "    if(WebSquare.printConsole) {\n" +
            "      console.log(logMsg1 + logMsg2);\n" +
            "    }\n" +
            "    if(WebSquare.remoteConsole) {\n" +
            "      WebSquare.remoteLogMsgArray.push(logMsg1 + WebSquare.logFileName + logMsg2);\n" +
            "    }\n" +
            "     window.top._console.log(logMsg1 + logMsg2);\n" +
            "  } catch( e ) {}\n" +
            "};\n" +
            "(function() {for(var i = 0 ; i < WebSquare.logMsgArray.length ; i++ ) { window.top._console.log(WebSquare.logMsgArray[i]); }})()\n" +
            "";

        var sourceURL = 'sourceURL=jsbin' + jsbin.getURL(true).replace(/\//g, '.') + '-' + sourceURLctr + '.js';
        if (js.trim()) js = js + '\n\n//# ' + sourceURL + '\n//@ ' + sourceURL;
        sourceURLctr++;
      } catch (e) {
        if (editors.javascript.processor.id) {
          window.console && window.console.warn(editors.javascript.processor.id + ' processor compilation failed');
        }

        window.console && window.console.error(e.message);
      }
    }


    // set the flags *before* we tweak the code with loop protection, etc.
    hasJS = !!js.trim();
    //hasCSS = !!$.trim(css);

    // Rewrite loops to detect infiniteness.
    // This is done by rewriting the for/while/do loops to perform a check at
    // the start of each iteration.
    js = loopProtect.rewriteLoops(js);

    // escape any script tags in the JS code, because that'll break the mushing together
    js = js.replace(re.script, '<\\/script');

    // redirect console logged to our custom log while debugging
    if (re.console.test(js)) {
      var replaceWith = 'window.runnerWindow.proxyConsole.';
      // yes, this code looks stupid, but in fact what it does is look for
      // 'console.' and then checks the position of the code. If it's inside
      // an openning script tag, it'll change it to window.top._console,
      // otherwise it'll leave it.
      js = js.replace(re.console, function (all, str, arg, pos) {
        return replaceWith + arg;
      });
    }

    // note that I'm using split and reconcat instead of replace, because if the js var
    // contains '$$' it's replaced to '$' - thus breaking Prototype code. This method
    // gets around the problem.
    if (!hasHTML && hasJS) {
      source = "<pre>\n" + js.replace(/[<>&]/g, function (m) {
        if (m == '<') return '&lt;';
        if (m == '>') return '&gt;';
        // if (m == '"') return '&quot;';
        if (m == '&') return '&amp;';
      }) + "</pre>";
    } else if (re.code.test(source)) {
      parts = source.split('%code%');
      source = parts[0] + js + parts[1];
    } else if (hasJS) {
      close = '';
      if (source.indexOf('</head>') !== -1) {
        parts.push(source.substring(0, source.lastIndexOf('</head>')));
        parts.push(source.substring(source.lastIndexOf('</head>')));

        source = parts[0];
        close = parts.length == 2 && parts[1] ? parts[1] : '';
      }

      // RS: not sure why I ran this in closure, but it means the expected globals are no longer so
      // js = "window.onload = function(){" + js + "\n}\n";
      //var type = jsbin.panels.panels.javascript.type ? ' type="text/' + jsbin.panels.panels.javascript.type + '"' : '';

      source += "<script type='text/javascript'>" + js + "\n</script>\n" + close;
    }

    // reapply the same proxyConsole - but to all the source code, since
    if (re.console.test(source)) {
      var replaceWith = 'window.runnerWindow.proxyConsole.';
      // yes, this code looks stupid, but in fact what it does is look for
      // 'console.' and then checks the position of the code. If it's inside
      // an openning script tag, it'll change it to window.top._console,
      // otherwise it'll leave it.
      source = source.replace(re.console, function (all, str, arg, pos) {
        var open = source.lastIndexOf('<script', pos),
            close = source.lastIndexOf('</script', pos);

        if (open > close) {
          return replaceWith + arg;
        } else {
          return all;
        }
      });
    }

/*
    if (!hasHTML && !hasJS && hasCSS) {
      source = "<pre>\n" + css.replace(/[<>&]/g, function (m) {
            if (m == '<') return '&lt;';
            if (m == '>') return '&gt;';
            if (m == '"') return '&quot;';
          }) + "</pre>";
    } else if (re.csscode.test(source)) {
      parts = source.split('%css%');
      source = parts[0] + css + parts[1];
    } else if (css && hasHTML) {
      parts = [];
      close = '';
      if (source.indexOf('</head>') !== -1) {
        parts.push(source.substring(0, source.lastIndexOf('</head>')));
        parts.push(source.substring(source.lastIndexOf('</head>')));

        source = parts[0];
        close = parts.length == 2 && parts[1] ? parts[1] : '';
      }
      source += '<style>\n' + css + '\n</style>\n' + close;
    }
*/

    // Add defer to all inline script tags in IE.
    // This is because IE runs scripts as it loads them, so variables that
    // scripts like jQuery add to the global scope are undefined.
    // See http://jsbin.com/ijapom/5
    if (jsbin.ie && re.scriptopen.test(source)) {
      source = source.replace(/<script(.*?)>/gi, function (all, match) {
        if (match.indexOf('src') !== -1) {
          return all;
        } else {
          return '<script defer' + match + '>';
        }
      });
    }

    // read the element out of the source code and plug it in to our document.title
    var newDocTitle = source.match(re.title);
    if (newDocTitle !== null && newDocTitle[1] !== documentTitle) {
      documentTitle = newDocTitle[1].trim();
      if (documentTitle) {
        document.title = documentTitle + ' - ' + 'JS Bin';
      } else {
        document.title = 'JS Bin';
      }
    }

    return source;
  }

}());
