var socket = io();

    var n = nunchuck.init('host', socket);

    var users = {};

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
          document.body.style.webkitTransform = 'rotate(' + data.orientation.beta + 'deg)';
          users[data.username].text(JSON.stringify(data,null,2))
          // $('.beta').append(data.orientation.beta)
          document.getElementById("beta").innerHTML = data.orientation.beta; 
          return data;
        }

      });

      $('.room-id').append(n.roomId);
    })