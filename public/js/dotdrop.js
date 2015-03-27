var particles = [];
var bubbles = [];
var num = 500;
var bubNum = 20;


function setup() {
	var myCanvas = createCanvas(600, 600);
	myCanvas.parent(dotdrop);

	//add background particles
	for (var i = 0; i < num; i++) {
		particles.push(new Particle());
	}

	// add bubbles 
	for (var j = 0; j < bubNum; j++) {
		bubbles.push(new Bubble());
	}
}

function draw() {
	background(0);

	
	
	for (var i = 0; i < bubbles.length; i++){
		if (bubbles[i].popped){
		for (var j = 0; j < particles.length; j++){
			
			particles[j].checkBubble(bubbles[i]);
			
			}
		}
		bubbles[i].update();
		bubbles[i].borders();
		bubbles[i].reset();
		bubbles[i].checkMouse();
		
		bubbles[i].display();
	}
	for (var i = 0; i < particles.length; i++) {
		particles[i].update();
		particles[i].borders();
		//particles[i].display();
	}
	
}

// =================
//	Bubble 
// =================


function Bubble() {
	this.popped = false;
	this.over = false;
	this.position = createVector(random(width), random(height/3));
	this.velocity = createVector(random(-1,1), random(-1,1));
	this.acceleration = createVector(0, 0);
	this.radius = random(30, 80);
	this.ri = this.radius;
	this.chain = [];
	this.counter = 0;
	this.angle = 0;
}


Bubble.prototype.display = function() {
	if (this.popped) {
		
		
		if (this.chain.length > 3){
			fill(245, 180, 40, 70);
		strokeWeight(2);
		stroke(250, 100, 55, 100);
			for (var k = 2; k < this.chain.length; k++) {
				
				var ax = this.chain[k-2].position.x;
				var ay = this.chain[k-2].position.y;
				var bx = this.chain[k-1].position.x;
				var by = this.chain[k-1].position.y;
				var cx = this.chain[k].position.x;
				var cy = this.chain[k].position.y;

				triangle(ax, ay, bx, by, cx, cy);
				//ellipse(ax, ay, 10, 10);
			}
			/*
			for (var i = 0; i < this.chain.length; i++) {
				ellipse(this.chain[i].position.x, this.chain[i].position.y, 15, 15);
			}
			*/
		}
		
	} else {
		noStroke();
		fill(50, 150, 255, 150);
		ellipse(this.position.x, this.position.y, this.radius, this.radius);
	}
	/*
	noStroke();
		fill(50, 150, 255, 150);
		ellipse(this.position.x, this.position.y, this.radius, this.radius);
		*/
}


Bubble.prototype.update = function() {
	if (this.popped) {
		this.acceleration = createVector(0, 2);
		this.counter++;
		if (this.chain.length > 1 && this.counter > 3) {
			this.chain[0].reset();
			this.chain = subset(this.chain, 1);
			this.counter = 0;
		}
	}
	

	this.velocity.add(this.acceleration);
	this.velocity.limit(3);
	this.position.add(this.velocity);
	this.acceleration.mult(0);
}

Bubble.prototype.borders = function() {
	if (this.popped == false) {
		if (this.position.x < 0 || this.position.x > width) {
			this.velocity.x *= -1;
		}
		if (this.position.y < 0 || this.position.y > height/3) {
			this.velocity.y *= -1;
		}
	}
}

Bubble.prototype.reset = function() {
	//reset
	if (this.position.y > height) {
		this.chain = [];
		this.popped = false;
		this.radius = random(30, 80);
		this.position = createVector(random(width), random(height/3));
		this.velocity = createVector(random(-1, 1), random(-1, 1));
		this.acceleration = new PVector(0, 0);
		
	}
}

Bubble.prototype.checkMouse = function() {
	var mouse = createVector(mouseX, mouseY);
	var d = p5.Vector.dist(mouse, this.position);
	if (d <= this.radius) {
		this.over = true;
		this.radius = this.ri + this.ri/2*sin(this.angle);
		this.angle += 0.05;
		if (mouseIsPressed) {
			this.popped = true;
		}
	}
}



// =================
//	Particle
// =================

function Particle() {
	this.addNew = true;
	this.position = createVector(random(width), random(height));
	this.velocity = createVector(random(-1, 1), random(-1, 1));
	this.r = random(20,50);
}

Particle.prototype.update = function() {
	this.velocity.limit(0.2);
	this.position.add(this.velocity);
}

Particle.prototype.reset = function() {
	this.addNew = true;
}

Particle.prototype.borders = function() {
	if (this.position.x < 0 || this.position.x > width) {
		this.velocity.x *= -1;
	}
	if (this.position.y < 0 || this.position.y > height) {
		this.velocity.y *= -1;
	}
}

Particle.prototype.checkBubble = function(b) {
	
	var d = p5.Vector.dist(this.position, b.position);

	if (d <= this.r && this.addNew == true && b.popped == true) {
		b.chain.push(this);
		this.addNew = false;
	}
	
}

Particle.prototype.display = function() {
	fill(255, 30);
	noStroke();
	ellipse(this.position.x, this.position.y, this.r, this.r);
}





