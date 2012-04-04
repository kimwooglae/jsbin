if ($('#history').length) (function () {
  function render(url) {
    iframe.src = url + 'quiet';
    iframe.removeAttribute('hidden');
    viewing.innerHTML = window.location.hostname + url;
  }

  function matchNode(el, nodeName) {
    if (el.nodeName == nodeName) {
      return el;
    } else if (el.nodeName == 'BODY') {
      return false;
    } else {
      return matchNode(el.parentNode, nodeName);
    }
  }

  function removeHighlight() {
    var i = trs.length;
    while (i--) {
      trs[i].className = '';
    }
  }

  function visit() {
    window.location = this.getAttribute('data-url') + 'edit?live';
  }

  var preview = $('#history .preview'),
      iframe = $('#history iframe')[0];
      bins = $('#history'),
      trs = $('#history tr'),
      current = null,
      viewing = $('#history #viewing'),
      hoverTimer = null;

  trs.click(visit);
  // this is some nasty code - just because I couldn't be
  // bothered to bring jQuery to the party.
  bins.mouseover(function (event) {
    clearTimeout(hoverTimer);
    event = event || window.event;
    var url, target = event.target || event.srcElement;
    if (target = matchNode(event.target, 'TR')) {
      removeHighlight();
      if (target.getAttribute('data-type') !== 'spacer') {
        target.className = 'hover';
        // target.onclick = visit;
        url = target.getAttribute('data-url');
        if (current !== url) {
          hoverTimer = setTimeout(function () {
            current = url;
            render(url);
          }, 200);
        }
      }
    }
  });
})();