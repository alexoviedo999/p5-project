
var allSquares = [];
var timeSlider;
var time = 0.0003;

// nunchuck stuff
var socket = io();
var n = nunchuck.init('host', socket);
var users = {};
var usersCount;
var Square;
var sliderData;

var User = function(name){
  this.id = Object.keys(users).length + 1;
  this.username = name;
}

var addUser = function(user){

  var r = 0;
  var g = 0;
  var b = 0;

  if (user.id === 1){
    g = 255;
  }
  else if(user.id === 2) {
    b = 255;
  }
  else if(user.id === 3) {
    r = 255;
  }
  square = new Square(r, g, b, 70, 0.002, 0);
  square.user = user;
  allSquares.push(square)
}


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
          thisSquare.rTime = parseInt(sliderVal1)/1000;
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


var sketch = function(s){

  s.preload = function() {
    soundFile = s.loadSound('../../music/tiesto_zero_76.mp3');
  }

  s.setup = function() {
    var myCanvas = s.createCanvas(s.windowWidth, s.windowHeight);
    // myCanvas.parent('sketch');
    // timeSlider = s.createSlider(1, 5, 3);
    // timeSlider.position(25, 50)
    // user1 = 1;
    // user2 = 2;
    // addUser(user1);
    // addUser(user2);
    s.smooth();
  }

  s.draw = function() {
    s.background(20);

    for(var i=0; i<allSquares.length; i++){
      allSquares[i].display(); 
      allSquares[i].update();  
    }
    
  }

  Square = function(r, g, b, o, rTime, tTime) {
    // this.location = translate(width/2, height/2);
    // this.location = userCount;
    this.r = r;
    this.g = g;
    this.b = b;
    this.o = o;
    this.rTime = rTime;
    this.tTime = tTime
  }

  Square.prototype.display = function(){
    this.tTime += this.rTime
    
    // this.rTime += this.tTime;

    // var rTime = this.rTime;
    // time += (parseInt(this.rTime))/1000;
    // this.rTime = time; 
    s.push();

    s.translate(s.windowWidth/(2*this.user.id), s.windowHeight/2);
    s.rotate(-this.tTime);
    s.fill(this.r, this.g, this.b, this.o);
    s.strokeWeight(2);
    s.stroke(this.r, this.g, this.b);
    s.rectMode(s.CENTER);
    s.rect(0, 0, 250, 250);
    
     
    for (var i = 0; i < 15; i++) {
      var spinColor = s.noise(this.tTime*15)
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
  boxesP5 = new p5(sketch, containerNode);
  $('.room-id').append(n.roomId);
}





