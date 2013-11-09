//= require "../chrome/storage"

var libraries = [
    { 
      "url":"/websquare_poc/websquare/javascriptPluginAll.wq?q=/bootloader",
      "label": "websquare_poc",
      "group": "WebSquare"
    },
    {
      "url":"/websquare_kt_poc/websquare/javascriptPluginAll.wq?q=/bootloader",
      "label": "websquare_kt_poc",
      "group": "WebSquare"
    },
    {
      "url":"/2.0_1.3162A.20130705.175511_1.5/websquare/javascriptPluginAll.wq?q=/bootloader",
      "label": "2.0_1.3162A.20130705.175511",
      "group": "WebSquare"
    },
    {
      "url":"/2.0_1.3080B.20130606.195501_1.5/websquare/javascriptPluginAll.wq?q=/bootloader",
      "label": "2.0_1.3080B.20130606.195501",
      "group": "WebSquare"
    },
    {
      "url":"/2.0_1.3067B.20130603.095501_1.5/websquare/javascriptPluginAll.wq?q=/bootloader",
      "label": "2.0_1.3067B.20130603.095501",
      "group": "WebSquare"
    },
    {
      "url":"/2.0_1.3066B.20130603.012007_1.5/websquare/javascriptPluginAll.wq?q=/bootloader",
      "label": "2.0_1.3066B.20130603.012007",
      "group": "WebSquare"
    },
    {
      "url":"/2.0_1.2945A.20130423.105428_1.5/websquare/javascriptPluginAll.wq?q=/bootloader",
      "label": "2.0_1.2945A.20130423.105428",
      "group": "WebSquare"
    },
    {
      "url":"/2.0_1.2909N.20130409.230901_1.5/websquare/javascriptPluginAll.wq?q=/bootloader",
      "label": "2.0_1.2909N.20130409.230901",
      "group": "WebSquare"
    },
    {
      "url":"/2.0_1.2758A.20130218.182758_1.5/websquare/javascriptPluginAll.wq?q=/bootloader",
      "label": "2.0_1.2758A.20130218.182758",
      "group": "WebSquare"
    },

    {
        "url": "http://code.jquery.com/jquery-git2.js",
        "label": "jQuery 2.x WIP (via git)",
        "group": "jQuery"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js",
        "label": "jQuery 2.0.2",
        "group": "jQuery"
    },
    {
        "url": "http://code.jquery.com/jquery-latest.js",
        "label": "jQuery 1.latest",
        "group": "jQuery"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js",
        "label": "jQuery 1.10.1",
        "group": "jQuery"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js",
        "label": "jQuery 1.8.3",
        "group": "jQuery"
    },
    {
        "url": [
            "http://code.jquery.com/mobile/latest/jquery.mobile.css",
            "http://code.jquery.com/jquery-1.9.1.min.js",
            "http://code.jquery.com/mobile/latest/jquery.mobile.js"
        ],
        "label": "jQuery Mobile Latest",
        "group": "jQuery Mobile"
    },
    {
        "url": [
            "http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.css",
            "http://code.jquery.com/jquery-1.8.2.min.js",
            "http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js"
        ],
        "label": "jQuery Mobile 1.3.1",
        "group": "jQuery Mobile"
    },
    {
        "url": [
            "http://code.jquery.com/mobile/1.2.1/jquery.mobile-1.2.1.min.css",
            "http://code.jquery.com/jquery-1.8.3.min.js",
            "http://code.jquery.com/mobile/1.2.1/jquery.mobile-1.2.1.min.js"
        ],
        "label": "jQuery Mobile 1.2.1",
        "group": "jQuery Mobile"
    },
    {
        "url": [
            "http://code.jquery.com/mobile/1.1.2/jquery.mobile-1.1.2.min.css",
            "http://code.jquery.com/jquery-1.6.4.min.js",
            "http://code.jquery.com/mobile/1.1.2/jquery.mobile-1.1.2.min.js"
        ],
        "label": "jQuery Mobile 1.1.2",
        "group": "jQuery Mobile"
    },
    {
    "url": [
            "http://code.jquery.com/jquery.min.js",
            "http://getbootstrap.com/dist/css/bootstrap.css",
            "http://getbootstrap.com/dist/js/bootstrap.js"
        ],
        "label": "Bootstrap Latest",
        "group": "Bootstrap"
    },
    {
    "url": [
            "http://code.jquery.com/jquery.min.js",
            "http://getbootstrap.com/2.3.2/assets/css/bootstrap.css",
            "http://getbootstrap.com/2.3.2/assets/css/bootstrap-responsive.css",
            "http://getbootstrap.com/2.3.2/assets/js/bootstrap.js"
        ],
        "label": "Bootstrap 2.3.3",
        "group": "Bootstrap"
    }
];

window.libraries = libraries; // expose a command line API

libraries.userSpecified = JSON.parse(localStorage.getItem('libraries') || "[]");
for (var i = 0; i < libraries.userSpecified.length; i++) {
  libraries.push(libraries.userSpecified[i]);
}

libraries.add = function (lib) {
  // Extract each script from a list (as documented) or use the default way
  if (lib.scripts) {
    lib.scripts.forEach(function (script) {
      script.group = lib.text;
      script.label = script.text;
      libraries.userSpecified.push(script);
      libraries.push(script);
    });
  } else {
    // Adding a lib according to the above schema
    lib.group = 'Custom';
    libraries.userSpecified.push(lib);
    libraries.push(lib);
  }
  try {
    localStorage.setItem('libraries', JSON.stringify(this.userSpecified));
  } catch (e) {} // just in case of DOM_22 error, makes me so sad to use this :(
  $('#library').trigger('init');
};

libraries.clear = function () {
  libraries.userSpecified = [];
  localStorage.removeItem('libraries');
  var length = libraries.length;
  for (var i = 0; i < length; i++) {
    if (libraries[i].group === 'Custom') {
      libraries.splice(i, 1);
      length--;
    }
  }
  // force a refresh?
  $('#library').trigger('init');
};
