var angInc = 0.2;
var d,e,f;
var dfScale = 1.9;
var springBack = 0.96;
var m = 0;
var mScale = 0.005;
var num = 0;

function setup() {
  var myCanvas = createCanvas(640, 640);
  
  // myCanvas.parent('sketch');
  smooth();
}

function draw() {
 background(30);
 translate(width/2, height/2);
 fill(255, 180, 80, 30);
 noStroke();

 if(mouseIsPressed) {
 	d = map(mouseX, 0, width, -dfScale, dfScale);
  	e = map(mouseX, 0, width, -angInc, angInc);
  	f = map(mouseY, 0, width, -dfScale, dfScale);
   	m+=mScale;
  	} else {
    d *= springBack;
    e *= springBack;
    f *= springBack;
  }
 for (var i = 0; i < 20; i++) {
    var angle = i*e;
    var x = d*i;
    var y = f*i;
    translate(x, y);
    push();
    rotate(angle + m);
    rectMode(CENTER);
    rect(0, 0, 200, 200);
    pop();
  }
}