
var timeSlider;
var Square;
var sliderData;
var User = function(name){
  this.id = Object.keys(users).length + 1;
  this.username = name;
}

var addUser = function(user){
  var r = 0;
  var g = 0;
  var b = 0;
  var o = 70;

  if (user.id === 1){
    g = 255;
  }
  else if(user.id === 2) {
    b = 255;
    g = 20;
  }
  else if(user.id === 3) {
    r = 255;
  }
  var square = new Square(r, g, b, o, 0.002, 0);
  square['squareCount'] = 30;
  square['tTime'] = 0;
  var item = square;

  item.user = user;
  allUserItems.push(item);
}



var sketch = function(s){

  s.preload = function() {
    soundFile = s.loadSound('../../music/d_player_zero_original_mix.mp3');
  }

  s.setup = function() {
    var myCanvas = s.createCanvas(s.windowWidth, s.windowHeight);
    amplitude = new p5.Amplitude();
    s.smooth();
  }

  s.draw = function() {
    s.background(70, 70, 70);
    var xposDiff;
    var yposDiff;

    if(usersCount > 1 &&  allUserItems[allUserItems.length - 1].xpos > 0){
      xposDiff = Math.abs(allUserItems[1].xpos - allUserItems[0].xpos);
      yposDiff = Math.abs(allUserItems[1].ypos - allUserItems[0].ypos);  
    }

    for(var i=0; i<allUserItems.length; i++){

      if (xposDiff < 20 && yposDiff < 20){
        allUserItems[i].whiteTest = true;
      }
      else { 
        allUserItems[i].whiteTest = false;
      }

      allUserItems[i].display(); 
      allUserItems[i].update();  


    } 
  }


  Square = function(r, g, b, o, rTime, tTime, xpos, ypos, touchW, touchH, squareCount, whiteTest) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.o = o;
    this.rTime = rTime;
    this.tTime = tTime;
    this.xpos = xpos;
    this.ypos = ypos;
    this.touchW = touchW;
    this.touchH = touchH;
    this.squareCount = squareCount;
    this.whiteTest = false;
  }



  Square.prototype.display = function(){
      
    var level = amplitude.getLevel();
    var olevel = s.map(level, 0, 0.5, 80, 100);
    var strokeLevel = s.map(level, 0, 0.5, 1, 4);
    var squareNum = s.map(level, 0, 0.5, 30, 40);
    var squareSize = s.map(level, 0, 0.5, 250, 350);
    this.o = olevel;
    this.tTime += this.rTime
    s.push();

    if(this.xpos){
      var touchX = s.map(this.xpos, 0, this.touchW, 0, window.innerWidth);
      var touchY = s.map(this.ypos, 0, this.touchH, 0, window.innerHeight);
      s.translate(touchX, touchY);
    }
    else{
      s.translate(window.innerWidth/2, window.innerHeight/2);
    }

   

    for (var i = 0; i < this.squareCount; i++) {
      if (!this.whiteTest){
        var spinColor = this.o
        s.rotate(this.tTime);
        s.fill(this.r* spinColor,this.g*spinColor,this.b*spinColor,70);
        s.rect(i,i,i*5,i*5);
        s.fill(0, 0, 0, 5);
        s.noStroke();
        s.ellipseMode(s.CENTER);
        s.ellipse(0, 0, squareSize*(0.06*this.squareCount), squareSize*(0.06*this.squareCount));
      }
      else{
        s.strokeWeight(strokeLevel);
        s.stroke(255, 255, 255);
        var spinColor = this.o;
        s.rotate(this.tTime);
        s.fill(this.r* spinColor,this.g*spinColor,this.b*spinColor,95);
        s.rect(i,i,i*5,i*5);
        s.fill(0, 0, 0, 0);
        s.strokeWeight(strokeLevel);
        s.stroke(this.r* spinColor,this.g*spinColor,this.b*spinColor,95);
        s.ellipseMode(s.CENTER);
        s.ellipse(0, 0, squareSize*(0.06*this.squareCount), squareSize*(0.06*this.squareCount));
      }
    }
    s.pop();

  }


  Square.prototype.update = function(receiveData){
    if(receiveData){
      this.rTime += receiveData.sliderVal1.value/1000;
    }
  }

} // End Sketch

window.onload = function(){
  containerNode = document.getElementById( 'canvas' );
  myP5sketch = new p5(sketch, containerNode);
  $('.room-id span').append(n.roomId).css('color', '#0DFF92');
  $('.users').html("Users Online: " + usersCount);
}





