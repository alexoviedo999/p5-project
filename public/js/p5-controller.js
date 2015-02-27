  var posX;

  var sketch = function(s){
    s.setup = function () {
        s.createCanvas(150, 300);
        s.colorMode("hsb");
        s.background(184, 174, 175, 90);
      }

    s.draw = function () {
      posX = Math.max(s.touchX);
      posXp = Math.max(s.ptouchX);
      posY = Math.max(s.touchY);
      posYp = Math.max(s.ptouchY);
      console.log("posX: "+ posX)
    }
  }

  window.onload = function(){

  /*
     Retrieve the canvas created in index.html and
     set it as the p5 target
  */
  containerNode = document.getElementById( 'canvas' );
  myp5 = new p5(sketch, containerNode);

}




  
// document.getElementById("posXp").innerHTML = posXp;  
// document.getElementById("posY").innerHTML = posY;  
// document.getElementById("posYp").innerHTML = posYp;