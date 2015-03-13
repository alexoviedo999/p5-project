var img1, img2, img3;
var amplitude;
var soundFile;
var backgroundColor;
var imageOrig;
var imageGray;
var imageInvert;
var imageThresh;
var imageDarkBlue;
var imageBlueGold;
var imageBlueRedYellow;
var imageRed;
var canvas1;
var angle = 0;
var scaleLevel;
var level;

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

function setup(){
  canvas1 = createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  soundFile.play();
  // frameRate(3);

  imageDarkBlue = loadImage("../images/colorful-spiral-dark-blue.jpg");
  imageBlueGold = loadImage("../images/rectangle-spiral-blue-gold.jpg");
  imageRed = loadImage("../images/red-spiral.jpg");
  // imageGray = loadImage("../images/colorful-spiral-dark-blue.jpg", function(img2){
  //    img2.filter("gray");     
  // });
  // imageThresh = loadImage("../images/colorful-spiral-dark-blue.jpg", function(img3){
  //    img3.filter("threshold", 0.5);
  // }); 
  // imageInvert = loadImage("../images/colorful-spiral-dark-blue.jpg", function(img4){
  //    img4.filter("invert");
  // })

  amplitude = new p5.Amplitude();
}
 
function draw(){

  level = amplitude.getLevel();

  background(255);
  push();
  scaleLevel = map(level, 0, 1, 1.0, 2.0);
  scale(scaleLevel);
  translate(windowWidth/2, windowHeight/2);
  // rotate(frameCount);
  rotate(angle);
  angle = angle+2;
  detectBeat(level);

  // position should be negative half of the size.
  // image(imageBlueGold, -1000, -1000, 1000*2, 1000*2);
  pop();
}

function detectBeat(level) {
  if (level > beatCutoff && level > beatThreshold) {
    onBeat();
    beatCutoff = level * 0.9;
    framesSinceLastbeat = 0;
  } 
  else {
    offBeat();
    if (framesSinceLastbeat <= beatHoldFrames) {
      framesSinceLastbeat++;
    } 
    else {
      beatCutoff *= beatDecayRate;
      beatCutoff = Math.max(beatCutoff, beatThreshold);
    }
  }
}

var onBeat = function() {
  var randomNum = Math.floor(Math.random() * 2) + 1
  if(randomNum == 1){
    image(imageRed, -1000, -1000, 1000*2, 1000*2);
  }
  if(randomNum == 2){
    image(imageDarkBlue, -1000, -1000, 1000*2, 1000*2);
  }
}

var offBeat = function(){
  image(imageBlueGold, -1000, -1000, 1000*2, 1000*2);
}





