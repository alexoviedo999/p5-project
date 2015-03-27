  var posX;
  var tp;
  var strobe;

  var sketch = function(s){
    s.setup = function() {
        tp = s.createCanvas(s.windowWidth, s.windowHeight);
        tp.parent('touch-pad');
        // strobe = s.createButton('Strobe', 'strobe');
        // strobe.id('strobe-btn').class('nunchuck-button').position(s.windowWidth/20, s.windowHeight/20);
        // strobe.parent('bottom-strip');
        // strobe.touchEnded(strobeEnd);

        timeSlider = s.createSlider(1, 5, 3);
        timeSlider.position(100, 100)

        timeSlider.id('slider1').class('nunchuck-slider').position(s.windowWidth/20, s.windowHeight/20);
        // timeSlider.parent('bottom-strip');
        // timeSlider.parent('bottom-strip');
        // timeSlider.touchEnded(strobeEnd);

        s.colorMode("hsb");
        s.background(184, 174, 175, 90);
      }

    s.draw = function(){
      posX = s.touchX;
      posXp = Math.max(s.ptouchX);
      posY = s.touchY;
      posYp = Math.max(s.ptouchY);
      tWidth = s.windowWidth;
      tHeight = s.windowHeight
      // console.log("posX: "+ posX)
      // console.log("posY: "+ posY)

      slider1 = timeSlider.value()/1000
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
