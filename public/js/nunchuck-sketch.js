
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



