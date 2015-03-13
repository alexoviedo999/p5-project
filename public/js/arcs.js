var amplitude;
var soundFile;
var backgroundColor;
var canvas1;
var scaleLevel;
var level;
var num = 9;
var sw = 20; 
var r = 0;
var rs;
var hsbBright;
var numLevel;
var endLevel;


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
  canvas1 = createCanvas(800, 800);
  // angleMode(DEGREES);
  soundFile.play();
  // frameRate(3);


  colorMode(HSB, 360, 100, 100);
  noFill();
  rs = random(100);
  strokeWeight(sw);
  strokeCap(SQUARE);

  thicknessSlider = createSlider(15, 25, 20);
  thicknessSlider.position(25, 25); 
  lineNumSlider = createSlider(3, 10, 7);
  lineNumSlider.position(25, 40);

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

  // background(backgroundColor);
  background(0);
  for (i=0; i<3; i++) {
    arcs(width/2, height/2);
  }
}

function arcs(x, y){
  push();
  // controlable value range
  scaleLevel = map(level, 0, 1, 1.0, 1.5);
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
    stroke(360.0/numLevel*i, 100, 100, hsbBright);
    start = random(TWO_PI);
    end = start + random(PI/5, PI/3);
    // end = start + endLevel;
    scal = map(sin(r+TWO_PI/num*i), -1, 1, .5, 2);
    // arc(0, 0, width*.9-i*3*sw, height*.9-i*3*sw, start, end*scal);
    arc(0, 0, width*.9-i*3*sw, height*.9-i*3*sw, start, end*arcScalLevel);
  }

  // controlable value range
  r = r + 0.0823/2;
  pop();
}


function detectBeat(level) {
    if (level > beatCutoff && level > beatThreshold) {
        onBeat();
        beatCutoff = level * 1.2;
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