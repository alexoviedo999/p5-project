
n.onJoin(function(data){
  var user = new User(data.username);
  var userName = user.username
  console.log(user);
  users[data.username] = data;
  usersCount = Object.keys(users).length;
  addUser(user);

  $('.users').html("Users Online " + usersCount);
  if(data.audioPick === 'ourAudio' && soundFile.playing === false){
    soundFile.play();
  }
  else if(soundFile.playing === false){
    mic = new p5.AudioIn();
    mic.start();
    amplitude.setInput(mic);  
  }
});

n.receive(function(data){
  if (users[data.username]){
    var squareData = function(){
      for(var i = 0; i < allSquares.length; i++){
        if(allSquares[i].user.username == data.username){

          var thisSquare = allSquares[i]

          // posX = Math.abs(data.touchPad.posX);
          // posY = Math.abs(data.touchPad.posY);
          // var touch = createVector(posX, posY);
          // var touchX = s.map(s.touch.x, 0, data.touchPad.tWidth, 0, s.windowWidth);
          // var touchY = s.map(s.touch.y, 0, data.touchPad.tHeight, 0, s.windowHeight);
          // touchPos.x = touchX;
          // touchPos.y = touchY;

          for(var j=0; j<data.sliders.length; j++){
            var sliderVal1 = data.sliders[j].value;
            thisSquare.rTime = parseInt(sliderVal1)/200;
          }

          var returnSquare = function(){
            return thisSquare;
          }
          return returnSquare;
        }
      }
    }

    var squareScope = squareData();
    squareScope();
  }
});




