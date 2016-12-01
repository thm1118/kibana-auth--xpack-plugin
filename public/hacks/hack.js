import $ from 'jquery';

$(document.body).on('keypress', function (event) {
  /*  [:]			 58  ，冒号*/
  if (event.which === 58) {
    alert('boo!');
  }
});
