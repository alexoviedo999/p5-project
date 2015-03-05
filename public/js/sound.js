var ps;
var data;
var userData;
var usersCount;
var soundFile;
var amplitude;
var particles = [];
var backgroundColor;
var mainCanvasWidth;
var mainCanvasHeight;
var btnPressCount;
var strobeInterval;


// nunchuck stuff

var socket = io();
var n = nunchuck.init('host', socket);
var users = {};

n.onJoin(function(data){
  var userName = data.username;
  console.log(data)
  users[data.username] = data;
  usersCount = Object.keys(users).length;
  addUser(userName);
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
      for(var i = 0; i < particles.length; i++){
        if(particles[i].user.username == data.username){
          // betaAngle = userData.orientation.beta;

          posX = Math.abs(data.touchPad.posX);
          posY = Math.abs(data.touchPad.posY);
          btnPressCount = userData.buttons.length;
          var touch = createVector(posX, posY);
          touch.mult(2.5);

          // console.log('poxX: '+ posX + 'touch x: ' + touch.x)
          // console.log('poxY: '+ posY + 'touch y: ' + touch.y)
          particles[i].position.x = touch.x;
          particles[i].position.y = touch.y;

          if(btnPressCount > 0){
            strobeInterval = setInterval(function(){
              for (var i = 0; i < particles.length; i++) {
                particles[i].color = color(random(0, 255), random(0, 255), random(0, 255));
              }
            },200)
          }
          else {
            clearInterval(strobeInterval);
          }
        }
      }
    }
    // users[data.username].text(JSON.stringify(data,null,2))
  });
  $('.room-id').append(n.roomId);
})



/*
  The detectBeat() function decides whether we have a beat or not
  based on amplitude level and Beat Detect Variables.
 */


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
  soundFile = loadSound('../../music/Eleanor_Rigby.mp3');
}

function setup() {
  c = createCanvas(windowWidth, windowHeight);
  c.parent('sound-canvas')
  mainCanvasWidth = windowWidth;
  mainCanvasHeight = windowHeight
  noStroke();
  amplitude = new p5.Amplitude();

  // make a single particle.
  // particles.push(new Particle());
}

function draw() {
  background(backgroundColor);
  var level = amplitude.getLevel();
  detectBeat(level);

  for(var i = 0; i < particles.length; i++) {
    particles[i].update(level);
    particles[i].draw();
  }
}


// function strobeColor(){
//   strobeInterval = setInterval(function(){
//     for (var i = 0; i < particles.length; i++) {
//       particles[i].color = color(random(0, 255), random(0, 255), random(0, 255));
//     }
//   },200)
// }

// function strobeColorEnd(){
//   clearInterval(strobeInterval);
// }

function addUser(user){
  // ps = new ParticleSystem(new p5.Vector(width/(usersCount * 2), 50));
  ps = new Particle()
  ps.user =  users[user]
  particles.push(ps)
}

function detectBeat(level) {
    if (level > beatCutoff && level > beatThreshold) {
        onBeat();
        beatCutoff = level * 1.1;
        framesSinceLastbeat = 0;
    } else {
        if (framesSinceLastbeat <= beatHoldFrames) {
            framesSinceLastbeat++;
        } else {
            beatCutoff *= beatDecayRate;
            beatCutoff = Math.max(beatCutoff, beatThreshold);
        }
    }
}

function onBeat() {
    backgroundColor = color(random(0, 255), random(0, 255), random(0, 255));
}


// ===============
// Particle class
// ===============

var Particle = function() {
    this.position = createVector(random(0, width), height / 2);
    this.scale = random(2, 4);
    this.speed = random(0, 10);
    this.color = color(random(0, 255), random(0, 255), random(0, 255));
    // this.name = text('name', this.position.x, this.position.y);
};

Particle.prototype.update = function(levelRaw) {
    this.diameter = map(levelRaw, 0, 1, 0, 400) * this.scale;
};

Particle.prototype.draw = function() {
    fill(this.color);
    ellipse(
        this.position.x, this.position.y,
        this.diameter, this.diameter
    );
    textSize(26);
    fill(255);
    text(this.user.username, this.position.x, this.position.y);
};



// ================
// Helper Functions
// ================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function keyPressed() {
  if (key == 'T') {
    toggleInput();
  }
}

// To prevent feedback, mic doesnt send its output.
// So we need to tell fft to listen to the mic, and then switch back.
// function toggleInput() {
//   if (soundFile.isPlaying() ) {
//     soundFile.pause();
//     mic.start();
//     particles.setInput(mic);
//   } else {
//     soundFile.play();
//     mic.stop();
//     particles.setInput(soundFile);
//   }
// }