var getHoursLived = function(birthday) {
  return Math.floor(((new Date()).getTime() - birthday.getTime()) / 3600000);
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

  window.location = "index.html";
  return true;
};


window.onload = function() {
  document.getElementById("info_form").onsubmit = submitInfoForm;
};