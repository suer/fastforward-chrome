(function(document) {

var shiftKeyPress = false;

var KEYS = {
  SPACE : 32,
  SHIFT:16
};

document.addEventListener("keydown", function(e) {
  if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
    return;
  }
  var scroll = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
  var height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  var clientHeight = Math.min(document.documentElement.clientHeight, document.body.clientHeight);
  if (height != (scroll + clientHeight)) {
    return;
  }
  switch (e.keyCode) {
    case KEYS.SPACE:
      if (!shiftKeyPress) {
        loadNext();
      }
      break;
    case KEYS.SHIFT:
      shiftKeyPress = true;
      break;
    default:
      break;
  }
});

document.addEventListener("keyup", function(e) {
  if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
    return;
  }
  switch (e.keyCode) {
    case KEYS.SHIFT:
      shiftKeyPress = false;
      break;
    default:
      break;
  }
});

function loadNext() {
  var aTags = document.getElementsByTagName("a");
  var aTagNum = aTags.length;
  for (var i = 0; i < aTagNum; i++) {
    if (isNextTag(aTags[i])) {
      document.location.href = aTags[i].getAttribute("href");
    }
  }
}

function isNextTag(tag) {
  var len = NextWords.length;
  for (var i = 0; i < len; i++) {
    if (tag.textContent.indexOf(NextWords[i]) >= 0) {
      return true;
    }
  }
  return false;
}

})(document);

