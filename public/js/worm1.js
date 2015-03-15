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
  // set canvas size
  // canvas1 = createCanvas(500, 500);
  canvas1 = createCanvas(windowWidth, windowHeight);
  soundFile.play();
  amplitude = new p5.Amplitude();

  colorMode(HSB,360,100,100);
  // points = new p5.Vector(num);

  for (i=0; i<num; i++) {
    points[i] = new p5.Vector(width/2, height/2);
  }
}

 
function draw(){
  level = amplitude.getLevel();
  detectBeat(level);
  numLevel = map(level, 0, 1, 250, 540);

  scaleLevel = map(level, 0, 1, 1, 1.0004);
  hsbLevel = map(level, 0, 1, 90, 100)
  
  // lerpAmount = 1.0/num*i;
  // col = lerpColor(#9E023B, #FFC675, lerpAmount);


  background(0);
  noStroke();
  d = 150;
  x = width/2+cos(angle)*d;
  y = height/2+sin(angle*2)*d;
  target = new p5.Vector(mouseX, mouseY);
  leader = new p5.Vector(target.x, target.y);
  for (i=0; i<num; i++) {
    fill(180.0/numLevel*i,hsbLevel,hsbLevel);
    point = points[i];
  scale(scaleLevel);

    distance = p5.Vector.sub(leader, point);
    velocity = p5.Vector.mult(distance, ease);
    point.add(velocity);
    ellipse(point.x, point.y, 50, 50);
    leader = point;
    
  }
  
  angle = angle + TWO_PI/frames;

}

function detectBeat(level) {
    if (level > beatCutoff && level > beatThreshold) {
        onBeat();
        beatCutoff = level * 1.9;
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