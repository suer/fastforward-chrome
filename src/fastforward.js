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

      document.addEventListener("keydown", 
        function(e) {
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

      function loadNext() {
        var tags = document.getElementsByTagName("link");
        if (hasRelNext(tags)) { return; }
        
        tags = document.getElementsByTagName("a");

        if (isDebugEnabled == "true") {
          var str = "All links on page:\n";
          
          for (var i = 0; i < tags.length; i++) {
            str += tags[i].textContent + " = " + tags[i].getAttribute("href") + "\n";
          }

          debubBox(str);
        }
        
        if (hasRelNext(tags)) { return; }
        if (hasNextWord(tags)) { return; }
      }
      
      function hasRelNext(tags) {
        for (var i = 0; i < tags.length; i++) {
          if (isRelNext(tags[i])) {
            if (isDebugEnabled == "true") {
              debubBox("Following:\n" + tags[i].textContent + " = " + tags[i].getAttribute("href"));
            }
            
            document.location.href = tags[i].getAttribute("href");
            return true;
          }
        }
        
        return false;
      }
      
      function isRelNext(tag) {
        var rel = tag.getAttribute("rel");
        return (rel != null && rel.toLowerCase() == "next");
      }
      
      function hasNextWord(tags) {
        // check for exact match
        for (var i = 0; i < nextwords.length; i++) {
          for (var j = 0; j < tags.length; j++) {
            if (tags[j].textContent.toLowerCase() === nextwords[i].toLowerCase()) {
              if (isDebugEnabled == "true") {
                debubBox("Found:\n" + nextwords[i] + " Following: " + tags[j].textContent + ":" + tags[j].getAttribute("href"));
              }
              
              document.location.href = tags[j].getAttribute("href");
              return true;
            }
          }
        }
        
        // check for any match
        for (var i = 0; i < nextwords.length; i++) {
          for (var j = 0; j < tags.length; j++) {
            if (tags[j].textContent.toLowerCase().indexOf(nextwords[i].toLowerCase()) >= 0) {
              if (isDebugEnabled == "true") {
                debubBox("Found:\n" + nextwords[i] + " Following: " + tags[j].textContent + ":" + tags[j].getAttribute("href"));
              }
              
              document.location.href = tags[j].getAttribute("href");
              return true;
            }
          }
        }
        
        return false;
      }
    
      function debubBox(text){
        var ScreenWidth=window.screen.width;
        var ScreenHeight=window.screen.height;
        var movefromedge=0;
        
        placementx=(ScreenWidth/2)-((800)/2);
        placementy=(ScreenHeight/2)-((600+50)/2);
        
        WinPop=window.open("About:Blank","","width=800,height=600,toolbar=0,location=0,directories=0,status=0,scrollbars=0,menubar=0,resizable=0,left="+placementx+",top="+placementy+",scre enX="+placementx+",screenY="+placementy+",");
        
        WinPop.document.write("<html>\n<head>\n</head>\n<body>" + text.replace(/\n/g, "<br/>") + "</body></html>");
      }
    }
  );
})(document);