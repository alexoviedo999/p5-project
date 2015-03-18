
var canvas1;
var target;
var points = [];
var num = 20;
var frames = 20;
var distance;
var velocity;
var point;
 

function setup() {
  canvas1 = createCanvas(windowWidth, windowHeight);
  amplitude = new p5.Amplitude();
  for (var i=0; i<num; i++) {
    points[i] = new Point();
  }
}

function Point(width, height) {
  this.point = new p5.Vector(width/2, height/2);

  this.display = function(){
    colorMode(HSB,360,100,100);
    noStroke();
    var d = 20;
    var ease = 0.1;
    var easing = true;
    var target = new p5.Vector(mouseX, mouseY);
    var leader = new p5.Vector(target.x, target.y);
    for (var i=0; i<num; i++) {
      fill(180.0/num*i,100,100);
      point = points[i].point;
      this.distance = p5.Vector.sub(leader, point);
      velocity = p5.Vector.mult(this.distance, ease);
      point.add(velocity);
      ellipse(point.x, point.y, 70, 70);
      leader = point;
    }     
  };
}
 
function draw(){

  // Grid code
  strokeWeight(2);
  push()
  translate(0, height/2);
  lines();
  scale(1, -1);
  lines();
  pop();

  // Worm Code
  for (var i=0; i<num; i++) {
    points[i].display();
  }

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
    fill(0, 255-(i/height * 255)*1.5);
    rect(0, i-2, width*2, 10);// use -2 instead of extra call to rectMode(CENTER)
  }
}


