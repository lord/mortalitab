window.onload = function() {
  var browser_width = window.innerWidth ||
              html.clientWidth  ||
              body.clientWidth  ||
              screen.availWidth;

  var browser_height = window.innerHeight ||
               html.clientHeight  ||
               body.clientHeight  ||
               screen.availHeight;

  var life_years = 80;
  var birthday = new Date(1990, 1, 1);
  var hours_lived = Math.floor(((new Date()).getTime() - birthday.getTime()) / 3600000);
  var life_hours = life_years * 365.24 * 24;

  var canvas_width = browser_width - 40;
  canvas_width = Math.min(canvas_width, 1200);
  var canvas_height = Math.ceil(life_hours / canvas_width);

  var current_row = Math.floor(hours_lived / canvas_width);
  var current_col = (hours_lived - (current_row * canvas_width))-1;

  var canny = document.getElementById('canvas');
  canny.height = canvas_height;
  canny.width = canvas_width;
  var ctx = canny.getContext("2d");
  ctx.fillStyle = "rgba(56, 56, 56, 1)";
  ctx.fillRect(0, 0, canvas_width, current_row);
  ctx.fillRect(0, current_row, current_col, 1);
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillRect(current_col, current_row, 1, 1);

  var last_frame = new Date();
  var blink_opacity = 1;
  var blink_going_up = false;
  var blink = function() {
    var dt = (new Date()).getTime() - last_frame.getTime();
    last_frame = new Date();
    if (blink_going_up) {
      blink_opacity += dt / 1000;
    } else {
      blink_opacity -= dt / 1000;
    }

    if (blink_opacity > 1) {
      blink_going_up = false;
      blink_opacity = 1;
    } else if (blink_opacity < 0) {
      blink_going_up = true;
      blink_opacity = 0;
    }

    ctx.fillStyle = "rgb(103, 104, 108)";
    ctx.fillRect(current_col, current_row, 1, 1);
    ctx.fillStyle = "rgba(255, 255, 255, " + blink_opacity + ")";
    ctx.fillRect(current_col, current_row, 1, 1);

    requestAnimationFrame(blink);
  };

  requestAnimationFrame(blink);
};
