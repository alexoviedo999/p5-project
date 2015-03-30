
var allUserItems = [];
var timeSlider;

// nunchuck stuff
var socket = io();
var n = nunchuck.init('host', socket);
var users = {};
var usersCount;
var Square;
var sliderData;
var usersCount = 0;

var User = function(name){
  this.id = Object.keys(users).length + 1;
  this.username = name;
}

var addUser = function(user){

  var r = 0;
  var g = 0;
  var b = 0;
  var o = 70;

  if (user.id === 1){
    g = 255;
  }
  else if(user.id === 2) {
    b = 255;
  }
  else if(user.id === 3) {
    r = 255;
  }
  var square = new Square(r, g, b, o, 0.002, 0);
  var item = square;

  item.user = user;
  allUserItems.push(item);
}




var sketch = function(s){

  s.preload = function() {
    soundFile = s.loadSound('../../music/tiesto_zero_76.mp3');
  }

  s.setup = function() {
    var myCanvas = s.createCanvas(s.windowWidth, s.windowHeight);
    amplitude = new p5.Amplitude();
    s.smooth();
  }

  s.draw = function() {
    s.background(50, 50, 50);

    for(var i=0; i<allUserItems.length; i++){
      allUserItems[i].display(); 
      allUserItems[i].update();  
    }
    
  }

  Square = function(r, g, b, o, rTime, tTime) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.o = o;
    this.rTime = rTime;
    this.tTime = tTime
  }

  Square.prototype.display = function(){
    var level = amplitude.getLevel();
    var olevel = s.map(level, 0, 0.5, 60, 100);
    var squareNum = s.map(level, 0, 0.5, 10, 20);
    var squareSize = s.map(level, 0, 0.5, 200, 300);
    this.o = olevel;
    this.tTime += this.rTime
    s.push();
    s.translate(s.windowWidth/(2*this.user.id), s.windowHeight/2);
    s.rotate(-this.tTime);
    s.fill(this.r, this.g, this.b, this.o);
    s.strokeWeight(2);
    s.stroke(this.r, this.g, this.b);
    s.rectMode(s.CENTER);
    s.rect(0, 0, squareSize, squareSize);
    
     
    for (var i = 0; i < 15; i++) {
      var spinColor = s.noise(this.o)
      s.rotate(this.tTime);
      s.fill(this.r* spinColor,this.g*spinColor,this.b*spinColor,70);
      s.rect(i,i,i*10,i*10);
    }
    s.pop();
  }

  Square.prototype.update = function(receiveData){

    if(receiveData){
      this.rTime += receiveData.sliderVal1.value/1000;
    }
    

  }

} // End Sketch



window.onload = function(){
  containerNode = document.getElementById( 'canvas' );
  myP5sketch = new p5(sketch, containerNode);
  $('.room-id').append(n.roomId);
  $('.users').html("Users Online: " + usersCount);
}





