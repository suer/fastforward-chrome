(function(document) {
  var shiftKeyPress = false;

  var KEYS = {
    SPACE : 32,
    SHIFT : 16
  };

  var nextwords = [];
  var isDebugEnabled = "false";
  
  chrome.extension.sendMessage({ name: "isDebugEnabled" }, 
    function(response) {
      isDebugEnabled = response.isDebugEnabled;
    }
  );

  chrome.extension.sendMessage({ name: "getNextWords" }, 
    function(response) {
      str = response.nextwords.trim();
      
      nextwords = response.nextwords.trim().split("\n");
      
      addListeners();
    }
  );
  
  function addListeners() {
    document.addEventListener("keydown", 
      function(e) {
        if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
          return;
        }
        
        switch (e.keyCode) {
          case KEYS.SPACE:
            if (!shiftKeyPress && pageBottom()) {
              loadNext();
            }
            break;
            
          case KEYS.SHIFT:
            shiftKeyPress = true;
            break;
            
          default:
            break;
        }
      }
    );

    document.addEventListener("keyup", 
      function(e) {
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
      }
    );
  }
  
  function pageBottom() {
    var height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    var scroll = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    var clientHeight = Math.min(document.documentElement.clientHeight, document.body.clientHeight);

    debugLog("pageLocations:");
    debugLog("  height: " + document.documentElement.scrollHeight + " scroll: " + document.documentElement.scrollTop + " clientHeight: " + document.documentElement.clientHeight);
    debugLog("  height: " + document.body.scrollHeight + " scroll: " + document.body.scrollTop + " clientHeight: " + document.body.clientHeight);
    debugLog("  result: " + (height <= (scroll + clientHeight)));
   
    return height <= (scroll + clientHeight) || document.documentElement.scrollHeight < document.documentElement.clientHeight;
  }
  
  function loadNext() {
    var tags = document.getElementsByTagName("link");
    if (hasRelNext(tags)) { return; }
    
    tags = document.getElementsByTagName("a");

    debugLog("All links on page:");
    for (var i = 0; i < tags.length; i++) {
      debugLog("  " + tags[i].textContent + " = " + tags[i].getAttribute("href"));
    }
    
    if (hasRelNext(tags)) { return; }
    if (hasNextWord(tags)) { return; }
  }
  
  function hasRelNext(tags) {
    for (var i = 0; i < tags.length; i++) {
      var rel = tags[i].getAttribute("rel");
    
      if (rel != null && rel.toLowerCase() == "next") {
        debugLog("Following: " + tags[i].textContent + " = " + tags[i].getAttribute("href"));
        
        document.location.href = tags[i].getAttribute("href");
        return true;
      }
    }
    
    return false;
  }
  
  function hasNextWord(tags) {
    // check for exact match
    for (var i = 0; i < nextwords.length; i++) {
      for (var j = 0; j < tags.length; j++) {
        if (tags[j].textContent.toLowerCase() === nextwords[i].toLowerCase()) {
          debugLog("Found: " + nextwords[i] + " Following: " + tags[j].textContent + ":" + tags[j].getAttribute("href"));
          
          document.location.href = tags[j].getAttribute("href");
          return true;
        }
      }
    }
    
    // check for any match
    for (var i = 0; i < nextwords.length; i++) {
      for (var j = 0; j < tags.length; j++) {
        if (tags[j].textContent.toLowerCase().indexOf(nextwords[i].toLowerCase()) >= 0) {
          debugLog("Found: " + nextwords[i] + " Following: " + tags[j].textContent + ":" + tags[j].getAttribute("href"));
          
          document.location.href = tags[j].getAttribute("href");
          return true;
        }
      }
    }
    
    return false;
  }

  function debugLog(text) {
    if (!isDebugEnabled) { return; }
    
    chrome.extension.sendMessage({ name: "debugLog", log: text }, 
      function(response) { }
    );
  }
})(document);