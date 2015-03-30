
n.onJoin(function(data){
  var user = new User(data.username);
  var userName = user.username
  console.log(user);
  users[data.username] = data;
  usersCount = Object.keys(users).length;
  addUser(user);

  $('.users').html("Users Online: " + usersCount);
  if(data.audioPick === 'ourAudio' && soundFile.playing === false){
    soundFile.play();
  }
  else if(soundFile.playing === false){
    // Set p5 audio...
    mic = new p5.AudioIn();
    mic.start();
    amplitude.setInput(mic);  
  }
});

n.receive(function(data){
  if (users[data.username]){
    var itemData = function(){
      for(var i = 0; i < allUserItems.length; i++){
        if(allUserItems[i].user.username == data.username){

          var thisItem = allUserItems[i]

          // posX = Math.abs(data.touchPad.posX);
          // posY = Math.abs(data.touchPad.posY);
          // var touch = createVector(posX, posY);
          // var touchX = s.map(s.touch.x, 0, data.touchPad.tWidth, 0, s.windowWidth);
          // var touchY = s.map(s.touch.y, 0, data.touchPad.tHeight, 0, s.windowHeight);
          // touchPos.x = touchX;
          // touchPos.y = touchY;

          for(var j=0; j<data.sliders.length; j++){
            var sliderVal1 = data.sliders[j].value;
            thisItem.rTime = parseInt(sliderVal1)/200;
          }

          var returnItem = function(){
            return thisItem;
          }
          return returnItem;
        }
      }
    }

    var itemScope = itemData();
    itemScope();
  }
});




