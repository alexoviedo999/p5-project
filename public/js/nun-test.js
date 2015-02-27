var socket = io();
var n = nunchuck.init('host', socket);

var users = {};

var posX, posY; 

n.onJoin(function(data){
  console.log(data)
});

$(document).ready(function(){
  n.receive(function(data){
    if (!users[data.username]){
      var el = $('<h3></h3>');
      users[data.username] = el;
      $('body').append(el);
    }
    if (users[data.username]){
      // document.body.style.webkitTransform = 'rotate(' + data.orientation.beta + 'deg)';
      users[data.username].text(JSON.stringify(data,null,2))
    }
  });
  $('h2').append(n.roomId);
  $('#posX').html(posX);
})

  // document.getElementById("posX").innerHTML = posX;

