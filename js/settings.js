var getHoursLived = function(birthday) {
  return Math.floor(((new Date()).getTime() - birthday.getTime()) / 3600000);
};

var submitInfoForm = function(e) {
  e.preventDefault();
  if (document.settings_form.birthday.valueAsDate === null) {
    alert('Please enter a birthday.');
    return false;
  }
  if (document.settings_form.sex.value === "") {
    alert('Please enter a sex.');
    return false;
  }

  localStorage.setItem('birthday', document.settings_form.birthday.valueAsDate);
  localStorage.setItem('sex', document.settings_form.sex.value);

  window.location = "index.html";
  return true;
};


window.onload = function() {
  document.getElementById("settings_form").onsubmit = submitInfoForm;
  if (localStorage.getItem('birthday')) {
    document.settings_form.birthday.valueAsDate = new Date(localStorage.getItem('birthday'));
  }
  if (localStorage.getItem('sex')) {
    document.settings_form.sex.value = localStorage.getItem('sex');
  }
};