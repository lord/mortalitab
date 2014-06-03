var getHoursLived = function(birthday) {
  return Math.floor(((new Date()).getTime() - birthday.getTime()) / 3600000);
};

var getHoursBetween = function(date1, date2) {
  return Math.floor((date2.getTime() - date1.getTime()) / 3600000);
};

var renderLife = function() {
  var browser_width = window.innerWidth ||
              html.clientWidth  ||
              body.clientWidth  ||
              screen.availWidth;

  var browser_height = window.innerHeight ||
               html.clientHeight  ||
               body.clientHeight  ||
               screen.availHeight;

  var birthday = new Date(localStorage.getItem('birthday'));
  var sex = localStorage.getItem('sex');
  var hours_lived = getHoursLived(birthday);
  var age = Math.floor(hours_lived / (365.24 * 24));
  var life_years;
  if (sex == "female") {
    life_years = age + act_table[age].female_life_exp;
  } else if (sex == "male") {
    life_years = age + act_table[age].male_life_exp;
  } else {
    life_years = age + (act_table[age].female_life_exp + act_table[age].male_life_exp) / 2;
  }
  var life_hours = life_years * 365.24 * 24;

  var canvas_width = browser_width;
  canvas_width -= canvas_width % 168;
  canvas_width = Math.min(canvas_width, 1176);
  canvas_width = Math.max(canvas_width, 168);
  var canvas_height = Math.ceil(life_hours / canvas_width);

  var current_row = Math.floor(hours_lived / canvas_width);
  var current_col = (hours_lived - (current_row * canvas_width))-1;

  window.canvas_width = canvas_width;
  window.canvas_height = canvas_height;
  window.birthday = birthday;

  document.getElementById('weeks').textContent = canvas_width / 168;

  // Create canvas
  var canny = document.getElementById('canny');
  canny.style.height = canvas_height + "px";
  canny.style.width = canvas_width + "px";
  canny.innerHTML=""; // delete any existing elements
  window.canny = canny;

  var rect;

  // Add div for dead block behind
  rect = document.createElement("div");
  rect.classList.add("past");
  rect.style.left = "0px";
  rect.style.top = "0px";
  rect.style.width = canvas_width + "px";
  rect.style.height = current_row + "px";
  canny.appendChild(rect);

  // Add div for dead line in current row
  rect = document.createElement("div");
  rect.classList.add("past");
  rect.style.left = "0px";
  rect.style.top = current_row + "px";
  rect.style.width = current_col + "px";
  rect.style.height = "1px";
  canny.appendChild(rect);

  // Add div for current hour
  rect = document.createElement("div");
  rect.classList.add("current");
  rect.style.left = current_col + "px";
  rect.style.top = current_row + "px";
  canny.appendChild(rect);
  loadRedlist();

  var resizeWindow = function() {
    el = document.getElementById('tutorial');
    el.classList.remove('visible');

    // -> triggering reflow /* The actual magic */
    // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
    el.offsetWidth = el.offsetWidth;

    el.classList.add('visible');

    renderLife();
  };

  window.onresize = resizeWindow;
  setTimeout(renderLife, 3600000 - (new Date()).getTime() % 3600000);
};

var loadRedlist = function() {
  chrome.history.search({
    'text': '',
    'maxResults': 1000000000,
    'startTime': 0
    },
    processHistory.bind(null, 0)
  );
};

// thanks to https://github.com/mihaip/theres-a-web-app-for-that/blob/master/extension/options.html#L216
function processHistory(startIndex, historyItems) {
  var endIndex = startIndex + 1000;
  var isLastChunk = false;
  // TODO LOAD THIS FROM LOCALSTORAGE
  var redlist = ['metafilter.com', 'facebook.com'];
  if (endIndex > historyItems.length) {
    isLastChunk = true;
    endIndex = historyItems.length;
  }
  for (var i = startIndex; i < endIndex; i++) {
    var historyItem = historyItems[i];
    if (historyItem.url) {
      for(var r in redlist) {
        if (historyItem.url.match("([./])" + escapeRegExp(redlist[r])) !== null) {
          chrome.history.getVisits({"url": historyItem.url}, processVisits);
          break;
        }
      }
    }
  }

  if (!isLastChunk)
    setTimeout(processHistory.bind(null, endIndex, historyItems), 0);
}

function processVisits(visits) {
  for (var i in visits) {
    addRedDot(visits[i].visitTime);
  }
}

function addRedDot(date) {
  var birthday = new Date(localStorage.getItem('birthday'));
  var hours_lived = getHoursBetween(window.birthday, new Date(date));
  var age = Math.floor(hours_lived / (365.24 * 24));

  var current_row = Math.floor(hours_lived / window.canvas_width);
  var current_col = (hours_lived - (current_row * window.canvas_width))-1;

  // Add div for red dot
  var rect = document.createElement("div");
  rect.classList.add("tainted");
  rect.style.left = current_col + "px";
  rect.style.top = current_row + "px";
  window.canny.appendChild(rect);
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

window.onload = function() {
  if (localStorage.getItem('birthday') === null || localStorage.getItem('sex') === null || localStorage.getItem('redlist') === null) {
    window.location = "settings.html";
  } else {
    renderLife();
  }
};