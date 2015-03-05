  var posX;
  var tp

  var sketch = function(s){
    s.setup = function() {
        tp = s.createCanvas(s.windowWidth*0.5, s.windowHeight*0.5);
        tp.parent('touch-pad');
        // strob = s.createButton('Strob', 'strob');
        // strob.parent('bottom-strip');

        s.colorMode("hsb");
        s.background(184, 174, 175, 90);
      }

    s.draw = function(){
      posX = s.touchX;
      posXp = Math.max(s.ptouchX);
      posY = s.touchY;
      posYp = Math.max(s.ptouchY);
      console.log("posX: "+ posX)
      console.log("posY: "+ posY)
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
