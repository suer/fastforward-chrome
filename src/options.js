function save_options() {
  var nextwordsTag = document.getElementById("nextwords");
  var nexts = nextwordsTag.children;
  var nexts_num = nexts.length;
  var nextwords = "";
  
  for (var i = 0; i < nexts_num; i++) {
    if (nexts[i].firstChild.value == "") {
      continue;
    }
    
    nextwords += nexts[i].firstChild.value + "\n";
  }
  
  localStorage["fffc_nextwords"] = nextwords;
  if (document.getElementById("debug").checked) {
    localStorage["fffc_isDebugEnabled"] = "true";
  } else {
    localStorage["fffc_isDebugEnabled"] = "false";
  }
  
  history.go(0);
}

function reset_options() {
  if(confirm("Reset all optoins?")) {
    load_defaults();
    history.go(0);
  }
}

function restore_options() {
  if (localStorage["fffc_isDebugEnabled"] != null && localStorage["fffc_isDebugEnabled"] == "true") {
    document.getElementById("debug").checked = true;
  }

  if (localStorage["fffc_nextwords"] == null) {
    empty_option();
    return;
  }
  
  var keywords = localStorage["fffc_nextwords"].trim().split("\n");
  var stored_keywords_num = keywords.length;
  
  if (stored_keywords_num == 0) {
    empty_option();
    return;
  }
  
  for (var i = 0; i < stored_keywords_num; i++) {
    if (keywords[i] == null || keywords[i] == "") {
      continue;
    }

    add_option(keywords[i]);
  }
}

function empty_option() {
  var nextwords = document.getElementById("nextwords");
  var nextword = document.createElement("div");
  
  nextword.id = "nextword"
  
  var nexttext = document.createElement("input");
  
  nexttext.id = "nexttext";
  nextword.appendChild(nexttext);
  nextwords.appendChild(nextword);
}

function add_option(value) {
  var nextwords = document.getElementById("nextwords");
  var nextword = document.createElement("div");
  
  nextword.class = "nextword";
  nextword.setAttribute("class", "nextword");
  
  var nexttext = document.createElement("input");
  
  nexttext.class = "nexttext";
  if(isString(value)) {
    nexttext.value = value;
  }
  nextword.appendChild(nexttext);
  nextwords.appendChild(nextword);
}

function isString(o) {
    return typeof o == "string" || (typeof o == "object" && o.constructor === String);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
document.querySelector('#addword').addEventListener('click', add_option);
document.querySelector('#reset').addEventListener('click', reset_options);