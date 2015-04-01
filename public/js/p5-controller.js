  var posX;
  var tp;

  var sketch = function(s){
    s.setup = function() {
      tp = s.createCanvas(s.windowWidth, s.windowHeight*0.5);
      tp.parent('touch-pad');
      s.textSize(32);
      s.text("touch-pad", s.windowWidth/3, s.windowHeight*0.25);
      s.fill(255);
      s.noStroke();
      timeSlider = s.createSlider(1, 5, 3);
      s.textSize(20);
      timeSlider.parent('knob-pad');
      timeSlider.id('slider1').class('nunchuck-slider');
      $('#slider1').before('<p>Rotation Speed</p>');
      squareCountSlider = s.createSlider(10, 30, 20);
      s.textSize(20);
      squareCountSlider.parent('knob-pad');
      squareCountSlider.id('slider2').class('nunchuck-slider');
      $('#slider2').before('<p>Square Count</p>');
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
      if(tHeight !== s.windowHeight){
        tp = s.createCanvas(s.windowWidth, s.windowHeight*0.5);
      }
      
      slider1 = timeSlider.value()/1000;
      slider2 = squareCountSlider.value();
      s.textSize(32);
      s.text("touch-pad", s.windowWidth/3, s.windowHeight*0.25);
      s.fill(255);
      s.noStroke() 
    }
  }

  window.onload = function(){

  /*
     Retrieve the canvas created in index.html and
     set it as the p5 target
  */
  containerNode = document.getElementById('touch-pad' );
  myp5Ctrl = new p5(sketch, containerNode);


}
