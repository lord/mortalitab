var getHoursLived = function(birthday) {
  return Math.floor(((new Date()).getTime() - birthday.getTime()) / 3600000);
};

var renderLife = function() {
  hideInfoForm();
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
  canvas_width = Math.min(canvas_width, 1008);
  canvas_width = Math.max(canvas_width, 168);
  var canvas_height = Math.ceil(life_hours / canvas_width);

  var current_row = Math.floor(hours_lived / canvas_width);
  var current_col = (hours_lived - (current_row * canvas_width))-1;

  document.getElementById('weeks').textContent = canvas_width / 168;

  var canny = document.getElementById('canvas');
  canny.height = canvas_height;
  canny.width = canvas_width;
  var ctx = canny.getContext("2d");
  ctx.clearRect(0,0,canny.width, canny.height);
  ctx.fillStyle = "rgb(37, 37, 37)";
  ctx.fillRect(0, 0, canvas_width, current_row);
  ctx.fillRect(0, current_row, current_col, 1);
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillRect(current_col, current_row, 1, 1);

  var start_frame = new Date();
  var stop_blinking = false;
  var blink = function() {
    if (stop_blinking === false) {
      var dt = ((new Date()).getTime() - start_frame.getTime())/1000;

      var blink_opacity = (Math.sin(dt*3.142)/2)+0.5;

      ctx.fillStyle = "#343434";
      ctx.fillRect(current_col, current_row, 1, 1);
      ctx.fillStyle = "rgba(255, 255, 255, " + blink_opacity + ")";
      ctx.fillRect(current_col, current_row, 1, 1);

      requestAnimationFrame(blink);
    }
  };

  requestAnimationFrame(blink);

  var redrawLife = function() {
    stop_blinking = true;
    renderLife();
  };

  var resizeWindow = function() {
    el = document.getElementById('tutorial');
    el.classList.remove('visible');

    // -> triggering reflow /* The actual magic */
    // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
    el.offsetWidth = el.offsetWidth;

    el.classList.add('visible');

    redrawLife();
  };

  window.onresize = resizeWindow;
  setTimeout(redrawLife, 3600000 - (new Date()).getTime() % 3600000);
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

var showInfoForm = function(e) {
  document.getElementById('info_form').style.display = "block";
  document.getElementById('info_form').onsubmit = submitInfoForm;
  document.getElementById('canvas').style.display = "none";
  document.location.hash = "#settings";
};

var hideInfoForm = function(e) {
  document.getElementById('info_form').style.display = "none";
  document.getElementById('canvas').style.display = "block";
  document.location.hash = "";
};

window.onload = function() {
  if (localStorage.getItem('birthday') === null || localStorage.getItem('sex') === null || document.location.hash === "#settings") {
    showInfoForm();
  } else {
    renderLife();
  }
};