chrome.extension.onMessage.addListener(
  function (message, sender, sendResponse) {
    if (message.name == "isDebugEnabled") {
      sendResponse({ isDebugEnabled: localStorage["fffc_isDebugEnabled"] });
    }
  }
);

chrome.extension.onMessage.addListener(
  function (message, sender, sendResponse) {
    if (message.name == "getNextWords") {
      if (localStorage["fffc_nextwords"] == null || localStorage["fffc_nextwords"].length == 0) {
        load_defaults();
      }
      
      sendResponse({ nextwords: localStorage["fffc_nextwords"] });
    }
  }
);
  
function load_defaults() {
  localStorage["fffc_nextwords"] = DefaultNextWords.join("\n");
}