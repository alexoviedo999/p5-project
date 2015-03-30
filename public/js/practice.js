
var timeSlider;
var Square;
var sliderData;
// var usersCount = 0;

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
  }
  else if(user.id === 3) {
    r = 255;
  }
  var square = new Square(r, g, b, o, 0.002, 0);
  var item = square;

  item.user = user;
  allUserItems.push(item);
}


var sketch = function(s){

  s.preload = function() {
    soundFile = s.loadSound('../../music/tiesto_zero_76.mp3');
  }

  s.setup = function() {
    var myCanvas = s.createCanvas(s.windowWidth, s.windowHeight);
    amplitude = new p5.Amplitude();
    s.smooth();
  }

  s.draw = function() {
    s.background(50, 50, 50);

    for(var i=0; i<allUserItems.length; i++){
      allUserItems[i].display(); 
      allUserItems[i].update();  
    } 
  }

  Square = function(r, g, b, o, rTime, tTime, xpos, ypos, touchW, touchH) {
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
  }

  Square.prototype.display = function(){
    var level = amplitude.getLevel();
    var olevel = s.map(level, 0, 0.5, 40, 100);
    var strokeLevel = s.map(level, 0, 0.5, 1, 8);
    var squareNum = s.map(level, 0, 0.5, 30, 40);
    var squareSize = s.map(level, 0, 0.5, 250, 350);
    this.o = olevel;
    this.tTime += this.rTime

    s.push();

    if(this.xpos){
      var touchX = s.map(this.xpos, 0, this.touchW, 0, s.windowWidth);
      var touchY = s.map(this.ypos, 0, this.touchH, 0, s.windowHeight);
      s.translate(touchX, touchY);
    }
    else{
      s.translate(s.windowWidth/(usersCount*2), s.windowHeight/(usersCount*2));
    }

    s.fill(this.r, this.g, this.b, this.o);
    s.strokeWeight(10);
    s.stroke(28);
    s.ellipseMode(s.CENTER);
    s.ellipse(0, 0, squareSize, squareSize);
     
    for (var i = 0; i < 15; i++) {
      s.strokeWeight(strokeLevel);
      s.stroke(this.r, this.g, this.b);
      var spinColor = s.noise(this.o)
      s.rotate(this.tTime);
      s.fill(this.r* spinColor,this.g*spinColor,this.b*spinColor,70);
      s.rect(i,i,i*5,i*5);
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





