var amplitude;
var soundFile;
var backgroundColor;
var canvas1;
var target;
var points = [];
var x;
var y;
var d;
var angle = 0;
var ease = 0.9;
var easing = true;
var num = 540;
var frames = 165;
var distance;
var velocity;
var point;













// nunchuck stuff

var socket = io();
var n = nunchuck.init('host', socket);
var users = {};

n.onJoin(function(data){
  var userName = data.username;
  console.log(data)
  users[data.username] = data;
  usersCount = Object.keys(users).length;
  // addUser(userName);
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

$(document).ready(function(){

  n.receive(function(data){
    userData = data;
    if (!users[data.username]){
      var el = $('<h3></h3>');
      users[data.username] = el;
      $('body').append(el);
    }
    if (users[data.username]){
       // users[data.username].text(JSON.stringify(data,null,2));

      // for(var i = 0; i < particles.length; i++){
      //   if(particles[i].user.username == data.username){
      //     // betaAngle = userData.orientation.beta;

      //     posX = Math.abs(data.touchPad.posX);
      //     posY = Math.abs(data.touchPad.posY);


      //     var touch = createVector(posX, posY);
      //     touch.mult(2.5);

      //     // console.log('poxX: '+ posX + 'touch x: ' + touch.x)
      //     // console.log('poxY: '+ posY + 'touch y: ' + touch.y)
      //     particles[i].position.x = touch.x;
      //     particles[i].position.y = touch.y;



      //     function toggleStrobe(){
      //       // btnPressCount = userData.buttons.length;
      //       if(userData.buttons.length == 1){
      //         userData.buttons = [];

      //         strobeInterval = setInterval(function(){
      //           for (var i = 0; i < particles.length; i++) {
      //             particles[i].color = color(random(0, 255), random(0, 255), random(0, 255));
      //           }
      //         },200)
      //       }
      //       else if(userData.buttons.length == 0){
      //         clearInterval(strobeInterval);
      //       }
      //     }
      //     toggleStrobe();
      //   }
      // }


    }
    // users[data.username].text(JSON.stringify(data,null,2))
  });
  $('.room-id').append(n.roomId);
})



// function addUser(user){
//   // ps = new ParticleSystem(new p5.Vector(width/(usersCount * 2), 50));
//   ps = new Particle()
//   ps.user =  users[user]
//   particles.push(ps)
// }





/*
 Beat Detect Variables
*/
// how many draw loop frames before the beatCutoff starts to decay
// so that another beat can be triggered.
// frameRate() is usually around 60 frames per second,
// so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
// we wont respond to every beat.
var beatHoldFrames = 20;

// what amplitude level can trigger a beat?
var beatThreshold = 0.11;

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
var beatCutoff = 0;
var beatDecayRate = 0.95; // how fast does beat cutoff decay?
var framesSinceLastbeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.

function preload() {
  soundFile = loadSound('../music/tiesto_zero_76.mp3');
}


function setup() {
  // set canvas size
  // canvas1 = createCanvas(500, 500);
  canvas1 = createCanvas(windowWidth, windowHeight);
  soundFile.play();
  amplitude = new p5.Amplitude();

  for (i=0; i<num; i++) {
    points[i] = new p5.Vector(width/2, height/2);
  }

}


function draw(){
  level = amplitude.getLevel();
  // detectBeat(level);
  numLevel = map(level, 0, 1, 250, 540);
  scaleLevel = map(level, 0, 1, 1, 1.0004);
  hsbLevel = map(level, 0, 0.5, 100, 100);
  gridLevel = map(level, 0, 0.5, 1.5, 3.5);

  // Grid code
  push();
  strokeWeight(2);
  // console.log(gridLevel);
  translate(0, height/2);
  lines();
  scale(1, -1);
  lines();
  pop();

  // Worm code
  push();
  colorMode(HSB,360,100,100);
  noStroke();
  d = 150;
  x = width/2+cos(angle)*d;
  y = height/2+sin(angle*2)*d;
  // if (mouseX) {
    target = new p5.Vector(mouseX, mouseY);
    leader = new p5.Vector(target.x, target.y);
  // } else if (touchX){
    // target = new p5.Vector(touchX, touchY);
    // leader = new p5.Vector(target.x, target.y);
  // }

  for (i=0; i<num; i++) {
    fill(180.0/numLevel*i,100,100);
    point = points[i];
    scale(scaleLevel);
    distance = p5.Vector.sub(leader, point);
    velocity = p5.Vector.mult(distance, ease);
    point.add(velocity);
    ellipse(point.x, point.y, 70, 150);
    leader = point;
  }
  angle = angle + TWO_PI/frames;
  pop();
}

function lines(){
  stroke(0,255,0);
  for(i = 0; i < 30; i++){
    y = pow(((i+frameCount/10.0)%20), 2.5);
    line(0, y, width, y);
  }
  for(i = 0; i < width; i+=20){
    line(i, 0, (i-width/2)*20, height);
  }
  noStroke();
  for(i = 0; i < height; i+= 10){
    fill(0, 255-(i/height * 255)*gridLevel);
    rect(0, i-2, width*2, 10);// use -2 instead of extra call to rectMode(CENTER)
  }
}

function detectBeat(level) {
    if (level > beatCutoff && level > beatThreshold) {
        onBeat();
        beatCutoff = level * 1.1;
        framesSinceLastbeat = 0;
    } else {
        // offBeat();
        if (framesSinceLastbeat <= beatHoldFrames) {
            framesSinceLastbeat++;
        } else {
            beatCutoff *= beatDecayRate;
            beatCutoff = Math.max(beatCutoff, beatThreshold);
        }
    }
}

var onBeat = function() {
    bColor = Math.round(map(level, 0, 1, 0, 360));
    color2 = map(level, 0, 1, 0, 100)
    backgroundColor = color(bColor, color2, random(0, 100));
}

var offBeat = function(){
  image(imageArches, -imgWidth, -imgHeight, imgWidth*2, imgHeight*2);
}
