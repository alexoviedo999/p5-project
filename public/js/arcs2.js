var amplitude;
var soundFile;
var backgroundColor;
var canvas1;
var scaleLevel;
var level;
var num = 7;
var sw = 20; 
var r = 2;
var rs;
var hsbBright;
var numLevel;
var endLevel;
var rColor1Slider;
var gColor1Slider;
var bColor1Slider;
var rColor2Slider;
var gColor2Slider;
var bColor2Slider;
var rColor1;
var gColor1;
var bColor1;




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
  canvas1 = createCanvas(windowWidth, windowHeight);
  // angleMode(DEGREES);
  soundFile.play();
  // frameRate(3);


  // colorMode(HSB, 360, 100, 100);
  noFill();
  rs = random(100);
  strokeWeight(sw);
  strokeCap(SQUARE);

  thicknessSlider = createSlider(15, 25, 20);
  thicknessSlider.position(25, 25); 
  lineNumSlider = createSlider(3, 8, 5);
  lineNumSlider.position(25, 45);

  rColor1Slider = createSlider(0, 255, 100);
  gColor1Slider = createSlider(0, 255, 100);
  bColor1Slider = createSlider(0, 255, 100);

  rColor2Slider = createSlider(0, 255, 100);
  gColor2Slider = createSlider(0, 255, 100);
  bColor2Slider = createSlider(0, 255, 100);

  rColor1Slider.position(25, 65); 
  gColor1Slider.position(25, 85); 
  bColor1Slider.position(25, 105);

  rColor2Slider.position(25, 125); 
  gColor2Slider.position(25, 145); 
  bColor2Slider.position(25, 165); 


  amplitude = new p5.Amplitude();
}
 
function draw(){
  
  level = amplitude.getLevel();
  detectBeat(level);
  randomSeed(rs);

  sw = thicknessSlider.value();
  text("Thickness: " + thicknessSlider.value(), width/2, height/2); 

  num = lineNumSlider.value();
  text("Lines: " + lineNumSlider.value(), width/2, height/2);

  rColor1 = rColor1Slider.value();
  gColor1 = gColor1Slider.value();
  bColor1 = bColor1Slider.value(); 
  rColor2 = rColor2Slider.value();
  gColor2 = gColor2Slider.value();
  bColor2 = bColor2Slider.value(); 


  // background(backgroundColor);
  background(0);
  for (i=0; i<3; i++) {
    arcs(width/2, height/2);
  }
}


function arcs(x, y){
  var lerpAmount;
  var color1;
  var color2;
  var colors;
  push();
  // controlable value range
  scaleLevel = map(level, 0, 1, 1.0, 1.2);
  scale(scaleLevel);
  hsbBright = map(level, 0, 1, 200, 500);
  
  // controlable value range
  numLevel = map(level, 0, 1, 5, 8);
  endLevel = map(level, 0, 1, 0.6, 0.99);

  // controlable value range
  arcScalLevel = map(level, 0, 1, 0.4, 1.8);
  translate(x, y);
  rotate(r);

  for (i=0; i<num; i++) {
    // stroke(360.0/numLevel*i, 100, 100, hsbBright);

    color1 = color(rColor1,gColor1,bColor1);
    color2 = color(rColor2,gColor2,bColor2);

    lerpAmount = 1.0/num*i;
    colors = lerpColor(color1, color2, lerpAmount);
    stroke(colors, 220);

    start = random(TWO_PI);
    end = start + random(PI/5, PI/3);
    // end = start + endLevel;
    scal = map(sin(r+TWO_PI/num*i), -1, 1, .5, 2);
    // arc(0, 0, width*.9-i*3*sw, height*.9-i*3*sw, start, end*scal);
    arc(0, 0, 800*.7-i*3*sw, 800*.7-i*3*sw, start, end*arcScalLevel);
  }

  // controlable value range
  r = r + 0.0523/2;
  pop();
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