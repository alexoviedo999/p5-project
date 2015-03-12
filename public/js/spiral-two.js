var img1, img2, img3;
var amplitude;
var soundFile;
var backgroundColor;
var imageOrig;
var imageGray;
var imageInvert;
var imageThresh;
var canvas1;
var angle = 0;
var scaleLevel;
var level;
var imgWidth;
var imgHeight;

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

function preload(){
  soundFile = loadSound('../../music/Eleanor_Rigby.mp3');
}

function setup(){
  canvas1 = createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  soundFile.play();
  // frameRate(3);
  imgWidth = 1200;
  imgHeight = 800;

  imageArches = loadImage("../images/colorful-arches.jpg");
  imageGray = loadImage("../images/colorful-arches.jpg", function(img2){
     img2.filter("gray");     
  });
  imageThresh = loadImage("../images/colorful-arches.jpg", function(img3){
     img3.filter("threshold", 0.5);
  }); 
  imageInvert = loadImage("../images/colorful-arches.jpg", function(img4){
     img4.filter("invert");
  })
  
  amplitude = new p5.Amplitude();
}
 
function draw(){
  level = amplitude.getLevel();
  background(34,32,36);
  push();
  scaleLevel = map(level, 0, 1, 1.0, 1.8);
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
  var randomNum = Math.floor(Math.random() * 3) + 1
  if(randomNum == 1){
    image(imageInvert, -imgWidth, -imgHeight, imgWidth*2, imgHeight*2);
  }
  if(randomNum == 2){
    image(imageGray, -imgWidth, -imgHeight, imgWidth*2, imgHeight*2);
  }
  if(randomNum == 3){
    image(imageThresh, -imgWidth, -imgHeight, imgWidth*2, imgHeight*2);
  }
  // backgroundColor = color(random(0, 255), random(0, 255), random(0, 255));
}

var offBeat = function(){
  image(imageArches, -imgWidth, -imgHeight, imgWidth*2, imgHeight*2);
}







