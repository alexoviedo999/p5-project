  var posX;
  var tp;

  var sketch = function(s){
    s.setup = function() {
      tp = s.createCanvas(s.windowWidth, s.windowHeight);
      tp.parent('touch-pad');
      timeSlider = s.createSlider(1, 5, 3);
      timeSlider.id('slider1').class('nunchuck-slider').position(50, 50);
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
      slider1 = timeSlider.value()/1000
    }
  }

  window.onload = function(){

  /*
     Retrieve the canvas created in index.html and
     set it as the p5 target
  */
  containerNode = document.getElementById( 'canvas' );
  myp5Ctrl = new p5(sketch, containerNode);

}
