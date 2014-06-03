var getHoursLived = function(birthday) {
  return Math.floor(((new Date()).getTime() - birthday.getTime()) / 3600000);
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

  document.getElementById('weeks').textContent = canvas_width / 168;

  // Create canvas
  var canny = document.getElementById('canny');
  canny.style.height = canvas_height + "px";
  canny.style.width = canvas_width + "px";
  canny.innerHTML=""; // delete any existing elements

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

var submitInfoForm = function(e) {
  e.preventDefault();
  if (document.info_form.birthday.valueAsDate === null) {
    alert('Please enter a birthday.');
    return false;
  }
  if (document.info_form.sex.value === "") {
    alert('Please enter a sex.');
    return false;
  }

  localStorage.setItem('birthday', document.info_form.birthday.valueAsDate);
  localStorage.setItem('sex', document.info_form.sex.value);
  document.getElementById('tutorial').classList.add('first-time');

  renderLife();
  return true;
};


window.onload = function() {
  if (localStorage.getItem('birthday') === null || localStorage.getItem('sex') === null || document.location.hash === "#settings") {
    window.location = "settings.html";
  } else {
    renderLife();
  }
};