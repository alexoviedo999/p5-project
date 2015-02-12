/*
 Global Variables
*/

var posX, posY; // x and y position when you touch the screen
var acceleration; // for device motion
var tiltLR = 0;
var tiltFB = 0;
// var pubnub;
// var uniqueid;
/*

*/
var isPressed = false; // is the screen pressed or not
var width = 640; // width of the canvas for visuals
var height = 640; // height of the canvas for visuals


var timemsg = new Date().getTime(); // for timing

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




function setup() {
    createCanvas(700, 500);
    translate(150, 150);
    colorMode("hsb");
    noStroke();
    backgroundColour = color(155, 55, 55);
    nodeColour = color(40, 168, 107);
    edgeColour = color(34, 68, 204);
    nodeSize = 8;

    var node0 = [-100, -100, -100];
    var node1 = [-100, -100, 100];
    var node2 = [-100, 100, -100];
    var node3 = [-100, 100, 100];
    var node4 = [100, -100, -100];
    var node5 = [100, -100, 100];
    var node6 = [100, 100, -100];
    var node7 = [100, 100, 100];
    nodes = [node0, node1, node2, node3, node4, node5, node6, node7];
    for (var x = -50; x <= 50; x += 100) {
      for (var y = -50; y <= 50; y += 100) {
        for (var z = -50; z <= 50; z += 100) {
          nodes.push([x, y, z]);
        }
      }
    }
    var edge0 = [0, 1];
    var edge1 = [1, 3];
    var edge2 = [3, 2];
    var edge3 = [2, 0];
    var edge4 = [4, 5];
    var edge5 = [5, 7];
    var edge6 = [7, 6];
    var edge7 = [6, 4];
    var edge8 = [0, 4];
    var edge9 = [1, 5];
    var edge10 = [2, 6];
    var edge11 = [3, 7];
    edges = [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11, 
      [11, 15],
      [15, 14],
      [14, 12],
      [12, 13],
      [13, 15],
      [10, 14],
      [10, 11],
      [12, 8],
      [8, 9],
      [9, 11],
      [8, 10],
      [9, 13],
      [13, 5],
      [14, 6],
      [15, 7],
      [12, 4],
      [11, 3],
      [10, 2],
      [9, 1],
      [8, 0]
    ];




    /*
       This starts reading the accelerometer data and running the deviceMotionHandler function
       when new data is received
    */

    if (window.DeviceMotionEvent) {
      document.getElementById("doAccelEvent").innerHTML = "Yes";
      window.addEventListener('devicemotion', deviceMotionHandler, false);
    }
    else{
      document.getElementById("doAccelEvent").innerHTML = "Not supported."
    }

    if (window.DeviceOrientationEvent) {
      document.getElementById("doOrientationEvent").innerHTML = "Yes";
      window.addEventListener('deviceorientation', devOrientHandler, false);
    }
    else{
      document.getElementById("doOrientationEvent").innerHTML = "Not supported."
    }

  }
  // Rotate shape around the z-axis
var rotateZ3D = function(theta) {
  var theta = theta/10;
  console.log('z ' + theta);
  var sin_t = sin(theta);
  var cos_t = cos(theta);

  for (var n = 0; n < nodes.length; n++) {
    var node = nodes[n];
    var x = node[0];
    var y = node[1];
    node[0] = x * cos_t - y * sin_t;
    node[1] = y * cos_t + x * sin_t;
  }
};

var rotateY3D = function(theta) {
  var theta = theta/10;
  console.log('y ' + theta);
  var sin_t = sin(theta);
  var cos_t = cos(theta);

  for (var n = 0; n < nodes.length; n++) {
    var node = nodes[n];
    var x = node[0];
    var z = node[2];
    node[0] = x * cos_t - z * sin_t;
    node[2] = z * cos_t + x * sin_t;
  }
};

var rotateX3D = function(theta) {
  var theta = theta/10;
  console.log('x ' + theta);
  var sin_t = sin(theta);
  var cos_t = cos(theta);

  for (var n = 0; n < nodes.length; n++) {
    var node = nodes[n];
    var y = node[1];
    var z = node[2];
    node[1] = y * cos_t - z * sin_t;
    node[2] = z * cos_t + y * sin_t;
  }
};

function draw() {
  background(backgroundColour);
  translate(180, 180);

  /*
     Desktop has mouseX, phone has touchX
     This normalizes
  */
  posX1 = Math.max(mouseX, touchX);
  posX = Math.round(posX1);
  posXp1 = Math.max(pmouseX, ptouchX);
  posXp = Math.round(posXp1);

  posY1 = Math.max(mouseY, touchY);
  posY = Math.round(posY1);
  posYp1 = Math.max(pmouseY, ptouchY);
  posYp = Math.round(posYp1);

  if(isPressed){
    touchControl();
  }
  else{ 

  }


  if(!acceleration){acceleration=0;}

  //every 200 ms emit message
  var now = new Date().getTime();
  if(isPressed && (now - timemsg > 300)){
    ws.send({x: posX, y: posY});
    timemsg = new Date().getTime();
  }



  // Draw edges
  stroke(edgeColour);
  for (var e = 0; e < edges.length; e++) {
    var n0 = edges[e][0];
    var n1 = edges[e][1];
    var node0 = nodes[n0];
    var node1 = nodes[n1];
    line(node0[0], node0[1], node1[0], node1[1]);
  }

  // Draw nodes
  fill(nodeColour);
  noStroke();
  for (var n = 0; n < nodes.length; n++) {
    var node = nodes[n];
    ellipse(node[0], node[1], nodeSize, nodeSize);
  }


};


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
  // dir = eventData.alpha

  console.log('fb ' + tiltFB + 'lr ' + tiltLR)
}





function touchControl(){
  document.getElementById("posX").innerHTML = posX;  
  document.getElementById("posXp").innerHTML = posXp;  
  document.getElementById("posY").innerHTML = posY;  
  document.getElementById("posYp").innerHTML = posYp;   
  document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
  document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
  // document.getElementById("doDirection").innerHTML = Math.round(dir);
}

function gestureControl(){

}



//start
touchStarted  = mousePressed = function(){
  isPressed = true;


  return false;
}

//during
touchMoved = mouseDragged =  function(){
  isPressed = true;
  // rotateY3D(posX - posXp);
  // rotateX3D(posY - posYp);

  setTimeout(function(){
    tiltLRp = tiltLR;
    tiltFBp = tiltFB;
  },200);

    rotateY3D(tiltLR - tiltLRp );
rotateX3D(tiltFB - tiltFBp );


  return false;
}

//end
touchEnded = mouseReleased = function(){
  isPressed = false;
  return false;
}













