(function(document) {

var shiftKeyPress = false;

var KEYS = {
SPACE : 32,
SHIFT:16
};

var nextwords = [];
chrome.extension.sendRequest({name: "getNextWords"},
  function(response) {
  str = response.nextwords;
  var len = str.length;
  var word = "";
  var j = 0;
  for (var i = 0; i < len; i++) {
    if (str[i] == "\n") {
      nextwords[j] = word;
      j++;
      word = "";
      continue;
    }
    word += str[i];
  }

  document.addEventListener("keydown", function(e) {
    if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
    return;
    }
    var scroll = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    var height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    var clientHeight = Math.min(document.documentElement.clientHeight, document.body.clientHeight);
    if (height > (scroll + clientHeight)) {
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
    var linkTags = document.getElementsByTagName("link");
    var linkTagNum = linkTags.length;

    for (var i = 0; i < linkTagNum; i++) {
      if (isNextLink(linkTags[i])) {
        document.location.href = linkTags[i].getAttribute("href");
      }
    }
    var aTags = document.getElementsByTagName("a");
    var aTagNum = aTags.length;

    for (i = 0; i < aTagNum; i++) {
      if (isNextTag(aTags[i])) {
        document.location.href = aTags[i].getAttribute("href");
      }
    }
  }

  function isNextLink(tag) {
    var rel = tag.getAttribute("rel");
    return (rel != null && rel.toLowerCase() == "next");
  }

  function isNextTag(tag) {
    var len = nextwords.length;
    for (var i = 0; i < len; i++) {
      if (tag.textContent.indexOf(nextwords[i]) >= 0) {
        return true;
      }
    }
    len = DefaultNextWords.length;
    for (var i = 0; i < len; i++) {
      if (tag.textContent.indexOf(DefaultNextWords[i]) >= 0) {
        return true;
      }
    }

    return false;
  }
  });

})(document);

