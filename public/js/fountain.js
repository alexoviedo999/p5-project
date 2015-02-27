var ps;
var data;
var userData;
var usersCount;
var allParticles = [];
var angle = 0;


// nunchuck stuff

var socket = io();
var n = nunchuck.init('host', socket);
var users = {};

n.onJoin(function(data){
  console.log(data)
  users[data.username] = data;
  usersCount = Object.keys(users).length;
  addUser(data);
  $('.users').html("Users Online " + usersCount);
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
      angle = userData.orientation.beta
    document.getElementById("beta").innerHTML = "Beta " + angle; 
      // document.getElementById("beta").innerHTML = "Beta " + angle; 
    }
  });

  $('.room-id').append(n.roomId);
})



function setup() {
  createCanvas(640, 360);
  // ps = new ParticleSystem(new p5.Vector(width/(usersCount * 2), 50));
}

function draw() {
  background(0);
  // nunchuckOrient();
  if (usersCount > 0){
    for(var i=0; i < allParticles.length; i++){
      allParticles[i].origin.x = angle;
      allParticles[i].addParticle();
      allParticles[i].run();
    }
  }
}

function addUser(data){

  ps = new ParticleSystem(new p5.Vector(width/(usersCount * 2), 50));
  allParticles.push(ps)
}

function nunchuckOrient() {
  if(userData){
    angle = userData.orientation.beta
    document.getElementById("beta").innerHTML = "Beta " + angle; 
    // s.pop();
  }
}

function Particle(lvector) {
  this.location = lvector.get();
  this.acceleration = new p5.Vector(0,0.05);

  var random1 = Math.random() * ((Math.random() > 0.5) ? -1 : 1);
  var random2 = Math.random() - ((Math.random() > 0.5) ? 1 : 2);

  this.velocity = new p5.Vector(random1, random2);

  this.lifespan = 255.0;
}

Particle.prototype.run = function() {
  this.update();
  this.display();
}

Particle.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.location.add(this.velocity);
  this.lifespan -= 1.0;
}

Particle.prototype.display = function() {
  stroke(255, this.lifespan);
  fill(255, this.lifespan);
  ellipse(this.location.x, this.location.y, 8, 8);    
}

Particle.prototype.isDead = function() {
  return (this.lifespan < 0);
}

function ParticleSystem(location) {
  this.origin = location.get();
  this.particles = [];
}

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
}

ParticleSystem.prototype.run = function() {
  var p;
  // this.origin = width/angle, 50
  for (var i = this.particles.length - 1; i >= 0; i--) {
    p = this.particles[i];
    p.run();
    if (p.isDead()) {
        this.particles.splice(i, 1);
    }
  }
}