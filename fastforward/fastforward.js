(function(document) {

var scroll = 0;

var KEYS = {
  SPACE : 32
};

document.addEventListener("scroll", function() {
  scroll = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
});


document.addEventListener("keypress", function(e) {
  var height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  if (height != (scroll + document.documentElement.clientHeight)) {
    return;
  }
  if (e.keyCode == KEYS.SPACE) {
    loadNext();
  }
});

function loadNext() {
  var aTags = document.getElementsByTagName("a");
  var aTagNum = aTags.length;
  for (var i = 0; i < aTagNum; i++) {
    if (isNextTag(aTags[i])) {
      console.log("found: " + i);
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

