var angInc = 0.2;
var d,e,f;
var dfScale = 1.9;
var springBack = 0.96;
var m = 0;
var mScale = 0.005;
var num = 0;


var usersCount = 2;
var allSquares = [];
var timeSlider;
var time = 0;


var users = {
  user: {
    id: 1,
    name: 'joe'
  },
  user: {
    id: 2,
    name: 'tom'
  }
};

var users = [];

function setup() {
  var myCanvas = createCanvas(windowWidth, windowHeight);
  // myCanvas.parent('sketch');

  timeSlider = createSlider(1, 5, 3);
  timeSlider.position(25, 25)

  user1 = 1;
  user2 = 2;
  addUser(user1);
  addUser(user2);


  smooth();
}

function draw() {
 background(20);

  for(var i=0; i<allSquares.length; i++){
    allSquares[i].display();  
  }
  
}


// Square

var Square = function(r, g, b, opacity) {
  // this.location = translate(width/2, height/2);
  // this.location = userCount;
  this.r = r;
  this.g = g;
  this.b = b;
  this.opacity = opacity;
}

Square.prototype.display = function(){
  

  push();
  translate(windowWidth/(2*this.user), windowHeight/2);
  rotate(-time);
  fill(this.r, this.g, this.b, this.opacity);
  strokeWeight(3);
  stroke(this.r, this.g, this.b);
  rectMode(CENTER);
  rect(0, 0, 500, 500);

  time += timeSlider.value()/1000;
   
  for (var i = 0; i < 20; i++) {
    var spinColor = noise(time*5)
    rotate(time);
    fill(this.r* spinColor,this.g*spinColor,this.b*spinColor,80);
    rect(i,i,i*15,i*15);
  }

  pop();
}

function addUser(user){
  var r = 0;
  var g = 0;
  var b = 0;
  if (user === 1){
    g = 255;
  }
  else if(user === 2) {
    b = 255;
  }
  else if(user === 3) {
    r = 255;
  }

  square = new Square(r, g, b, 70, usersCount);
  square.user = user;
  allSquares.push(square)
}








