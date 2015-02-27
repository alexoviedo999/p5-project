/*
  This is the basic example, it is boilerplate for getting started with the workshop

  + p5 to draw visuals and get touch events
  http://p5js.org/reference/

  + the web audio API to generate sounds.
  This is mostly contained in the Note.js script
  http://www.html5rocks.com/en/tutorials/webaudio/intro/

  + the browser accelerometer API to get motion
  https://developer.mozilla.org/en-US/docs/Web/Events/devicemotion

*/


/*
 Global Variables
*/
var test = {};
var posX, posY; // x and y position when you touch the screen
var acceleration; // for device motion
var data;
var userData;
var dir;
var tiltLR;
var tiltFB;
var isPressed = false; // is the screen pressed or not
var width = 640; // width of the canvas for visuals
var height = 640; // height of the canvas for visuals
var timemsg = new Date().getTime(); // for timing
var usersCount;
// var angle = 0;

// var synth;
/*
  This is the variable for the synth, as specified in Note.js
  usage is

  synth = new Note(); // creates the synth object
  synth.setPitch(440);
  synth.setFilter(440);
  synth.play();
  synth.stop();

*/





// nunchuck stuff

var socket = io();
var n = nunchuck.init('host', socket);
var users = {};

n.onJoin(function(data){
  console.log(data)
  users[data.username] = data;
  usersCount = Object.keys(users).length;

  $('.users').html("Users Online " + usersCount);
});

$(document).ready(function(){

  n.receive(function(data){
    userData = data;
    if (!users[data.username]){
      var el = $('<h3></h3>');
      users[data.username] = el;
      $('body').append(el);
    }
    if (users[data.username]){
      // users[data.username].text(JSON.stringify(data,null,2))
      // document.getElementById("beta").innerHTML = "Beta " + angle; 
    }
  });

  $('.room-id').append(n.roomId);
})



/*
  This is a sketch function which p5 takes. It consists of a 'setup' and 'draw' function.
  'setup' runs once.  'draw' runs over and over.

*/
var sketch = function(s){
  /*
    The sketch takes an object s.  This contains all of the methods available in p5.
    Whenever we use a method in p5 here, it will have an 's.' before it.

    You can see the full list of methods here: p5js.org/reference/
  */

  /* Setup runs once */
  s.setup = function(){

    /* Creates a canvas on which everything is drawn.
       width and height determine the size. You can change these
    */
    s.createCanvas(width, height);

    /*
       the color space HSB is more intuitive in my opinion than RGB.
       H is for Hue, it goes from 0 to 255 and runs through the color spectrum.
       S is Saturation, 0 to 255
       B is Brightness, 0 to 255
   */
    s.colorMode("hsb");
    // s.background(184, 174, 175, 50);

    s.noStroke();

    s.background(184, 174, 175, 90);

    /*
       This starts reading the accelerometer data and running the deviceMotionHandler function
       when new data is received
    */

    // if (window.DeviceMotionEvent) {
    //   document.getElementById("doAccelEvent").innerHTML = "Yes";
    //   window.addEventListener('devicemotion', deviceMotionHandler, false);
    // }
    // else{
    //   document.getElementById("doAccelEvent").innerHTML = "Not supported."
    // }

    // if (window.DeviceOrientationEvent) {
    //   document.getElementById("doOrientationEvent").innerHTML = "Yes";
    //   window.addEventListener('deviceorientation', devOrientHandler, false);
    // }
    // else{
    //   document.getElementById("doOrientationEvent").innerHTML = "Not supported."
    // }

  }


  /* Draw loops over and over after setup runs */
  s.draw = function(){
    
    /*
       Desktop has mouseX, phone has touchX
       This normalizes
    */
    posX = Math.max(s.mouseX, s.touchX);
    posY = Math.max(s.mouseY, s.touchY);

    /*
    Do the fun drawing stuff here!
    */

    if(isPressed){
      gesture(s);
    }
    else if (userData){
      nunchuckOrient(s);
    }

    if(!acceleration){acceleration=0;}

    //every 200 ms emit message
    var now = new Date().getTime();
    if(isPressed && (now - timemsg > 300)){
      socket.send({x: posX, y: posY});
      timemsg = new Date().getTime();
    }

  }


  //start
  s.touchStarted  = s.mousePressed = function(){
    isPressed = true;
  }

  //during
  s.touchMoved = s.mouseDragged =  function(){
    isPressed = true;
  }

  //end
  s.touchEnded = s.mouseReleased = function(){
    isPressed = false
  }


  deviceMotionHandler = function(accel){
    acceleration = accel.accelerationIncludingGravity.x;
    var aval = Math.abs(acceleration);
    if (isPressed && aval >5){
      // s.background(aval/20 * 255, 255, 255);
    }
  }

  devOrientHandler = function(eventData){
     // gamma is the left-to-right tilt in degrees, where right is positive
    tiltLR = eventData.gamma;

    // beta is the front-to-back tilt in degrees, where front is positive
    tiltFB = eventData.beta;

    // alpha is the compass direction the device is facing in degrees
    dir = eventData.alpha
  }

}

function nunchuckOrient(s) {
  s.background(184, 174, 175, 90);
  s.push();
  s.translate(width/4, height/4)
  angle = Math.max(userData.orientation.beta/100);
  s.rotate(angle);  
  s.rectMode(s.CENTER);
  s.rect(0, 0, 100, 100); 
  document.getElementById("beta").innerHTML = "Beta " + angle; 
  // s.pop();
}

function gesture(s){

 var posX10 = posX/100;
 var dir10 = dir/100;
 s.background(184, 174, 175, 90);
 s.push();

  if(dir10){
    s.translate(width/2, height/2)
    s.rotate(dir10);  
  }
  else{
    s.translate(width/4, height/4)
    s.rotate(posX10);  
  }
  s.rectMode(s.CENTER);
  // s.fill(184, 174, 175, 50)
  s.rect(0, 0, 100, 100); 
  s.pop();

  // $("#content").text("X: " +posX + ", Y: " + posY +", a:"+acceleration + ", pressed:"+ isPressed + ", direction: " + dir + ", tilt LR " + tiltLR + ", tilt FB " + tiltFB);
  document.getElementById("posX").innerHTML = Math.round(posX);  
  document.getElementById("posY").innerHTML = Math.round(posY);  
  // document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
  // document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
  // document.getElementById("doDirection").innerHTML = Math.round(dir);
}

var checkFeatureSupport = function(){
  try{
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch (err){
    alert('web audio not supported');
  }
}


/*
  This runs after everything loads
*/

window.onload = function(){
  checkFeatureSupport();

  /*
     Retrieve the canvas created in index.html and
     set it as the p5 target
  */
  containerNode = document.getElementById( 'canvas' );
  myp5 = new p5(sketch, containerNode);
}












