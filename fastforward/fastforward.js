(function(document) {

var scroll = 0;
var height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
var pageEnd = false;

var KEYS = {
  SPACE : 32
};

window.addEventListener("scroll", function() {
  scroll = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
});


window.addEventListener("keypress", function(e) {
  if (height != (scroll + document.documentElement.clientHeight)) {
    console.log("yet");
    return;
  }
  if (e.keyCode == KEYS.SPACE) {
    console.log("hoge");
    loadNext();
  }
});

function loadNext() {
  var aTags = document.getElementsByTagName("a");
  var aTagNum = aTags.length;
  for (var i = 0; i < aTagNum; i++) {
    if (isNextTag(aTags[i])) {
      console.log("found: " + i);
      location.href = aTags[i].getAttribute("href");
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

