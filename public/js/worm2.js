
// var Worm2Module = function() {


var canvas1;
var target;
var particles = [];
var num = 15;
var frames = 25;
var distance;
var target;
var leader;
var velocity;
var particle;
var allParticles = [];
var touchPos = {};
var usersCount;
var soundFile;

// nunchuck stuff

var socket = io();
var n = nunchuck.init('host', socket);
var users = {};

var User = function(name){
  this.id = Object.keys(users).length + 1;
  this.username = name;
}

audioSetup = function(){
  if(data.audioPick === 'ourAudio' && soundFile.playing === false){
    soundFile.play();
  }
  else if(soundFile.playing === false){
    mic = new p5.AudioIn();
    mic.start();
    amplitude.setInput(mic);  
  }
}

joinUser = function(data){

  var user = new User(data.username);
  var userName = user.username
  console.log(user);
  users[data.username] = data;
  usersCount = Object.keys(users).length;
  addUser(userName);

  $('.users').html("Users Online " + usersCount);

}

n.onJoin(joinUser);



n.receive(function(data){

  // if (!users[data.username]){
  //   var el = $('<h3></h3>');
  //   users[data.username] = el;
  //   $('body').append(el);
  // }

  if (users[data.username]){
    for(var i = 0; i < allParticles.length; i++){
      if(allParticles[i].user.username == data.username){
        posX = Math.abs(data.touchPad.posX);
        posY = Math.abs(data.touchPad.posY);
        var touch = createVector(posX, posY);
        var touchX = map(touch.x, 0, data.touchPad.tWidth, 0, windowWidth);
        var touchY = map(touch.y, 0, data.touchPad.tHeight, 0, windowHeight);
        touchPos.x = touchX;
        touchPos.y = touchY;
      }
    }
  }
});

$(document).ready(function(){
  $('.room-id').append(n.roomId);
});

 
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
var beatThreshold = 0.05;

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
var beatCutoff = 0;
var beatDecayRate = 0.95; // how fast does beat cutoff decay?
var framesSinceLastbeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.

function preload() {
  soundFile = loadSound('../../music/tiesto_zero_76.mp3');
}

function setup() {
  canvas1 = createCanvas(windowWidth, windowHeight);
  amplitude = new p5.Amplitude();
}

function Particle(width, height) {
  this.particle = new p5.Vector(width/2, height/2);
  var particle;
  this.display = function(){
    colorMode(HSB,360,100,100);
    noStroke();
    var ease = 0.050;
    var easing = true;
    this.target = new p5.Vector(touchPos.x, touchPos.y);
    this.leader = new p5.Vector(this.target.x, this.target.y);
    for (var i=0; i<num; i++) {
      fill(180.0/num*i,100,100);
      particle = particles[i].particle;
      this.distance = p5.Vector.sub(this.leader, particle);
      velocity = p5.Vector.mult(this.distance, ease);
      particle.add(velocity);
      ellipse(particle.x, particle.y, 70, 130);
      this.leader = particle;
    }     
  };
}

function ParticleSystem(location) {
  this.origin = location.get();
  this.particles = [];
}

ParticleSystem.prototype.run = function() {
  var p;
  
  // this.origin = width/angle, 50
  for (var i=0; i<num; i++) {
    p = this.particles[i];
    p.display();
  }
}
 
function draw(){
  level = amplitude.getLevel();
  // numLevel = map(level, 0, 1, 250, 540);
  // scaleLevel = map(level, 0, 1, 1, 1.0004);
  // hsbLevel = map(level, 0, 0.5, 100, 100);
  gridLevel = map(level, 0, 0.5, 1.5, 3.5);

  // Grid code
  strokeWeight(2);
  push()
  translate(0, height/2);
  lines();
  scale(1, -1);
  lines();
  pop();

  // Worm Code

  for(var i=0; i < allParticles.length; i++){
      // allParticles[i].origin.x = width/((i+1) * 2) + betaAngle;
      allParticles[i].run();
    }
}

function addUser(user, windowWidth){
  ps = new ParticleSystem(new p5.Vector(windowWidth/(usersCount * 2), 50));
  ps.user =  users[user]

  for (var i=0; i<num; i++) {
    particles[i] = new Particle();
  }
  ps.particles = particles;
  allParticles.push(ps);
}


function lines(){
  stroke(0,255,0);
  for(var i = 0; i < 30; i++){
    var y = pow(((i+frameCount/10.0)%20), 2.5);
    line(0, y, width, y);
  }
  for(var i = 0; i < width; i+=20){
    line(i, 0, (i-width/2)*20, height);
  }
  noStroke();
  for(var i = 0; i < height; i+= 10){
    fill(0, 255-(i/height * 255)*gridLevel);
    rect(0, i-2, width*2, 10);// use -2 instead of extra call to rectMode(CENTER)
  }
}


// };



