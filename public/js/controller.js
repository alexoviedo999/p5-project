var socket = io();
var n = nunchuck.init('player', socket);

n.onJoin(function(data, err) {
  if (!err) {
    bounceIn('controller');
    bounceOut('join');
    $('canvas').css('display', 'block');
    $('section#join').css('display', 'none');
    $('#slider1').css('display', 'block');
  } else {
    alert(err.msg)
  }
});

function bounceOut(id) {
  $('#' + id)
    .removeClass('animate bounceIn')
    .addClass('animate bounceOut')
    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $(this)
        .css('display', 'none')
        .removeClass('animate bounceOut');
      });
}

function join() {
  var audioPick = document.querySelector('input[name="audio-selector"]:checked').value;
  n.join($('#username').val(), $('#roomId').val(), audioPick);
}

function bounceIn(id) {
  $('#' + id)
  .addClass('animate bounceIn')
  .css('display', 'block');

}