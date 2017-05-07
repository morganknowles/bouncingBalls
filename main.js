// setup canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d'); //this is the fabric that will be painted
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
var MAX_BALLS = 15;
var counter = document.querySelector('p');
var ballCount = MAX_BALLS;
// function to generate random number
function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}


//define a random color
var randomColor = function() {
    return 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')'; //color information
};

var randomNumNoZero = function(){
    var i = random(-5,5);
    if(i === 0){
        i++;
    }
    return i++;
};

//define a Shape object (constructor)
function Shape() {
    
    this.velX = randomNumNoZero(); //velocity in the x direction

    this.velY = randomNumNoZero(); //velocity in the y direction
    
    this.exists = true;
    
    
}
//define a Bouncing Ball object (constructor)
function Ball(velX, velY, exists) {
    this.size = random(10, 25); //size (radius)
    Shape.call(this, velX, velY, exists);
    this.color = randomColor();
    this.x = random(0 + this.size,width - this.size); //x value for x position

    this.y = random(0 + this.size, height - this.size); //y value for y position
    

}

//define an EvilCircle object
function EvilCircle(exists){
    Shape.call(this, exists);
    this.color = 'rgb(255,255,255)' ;
    this.size = 10;
    this.velX = 20;
    this.velY = 20;
    this.x = random(0 + this.size,width - this.size); //x value for x position

    this.y = random(0 + this.size, height - this.size); //y value for y position

}
//define a draw method for EvilCircle
EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
    ctx.stroke();
};

//define checkBounds for EvilCircle
EvilCircle.prototype.checkBounds = function() {
     if (this.x >= width - this.size || this.x <= 0 + this.size){
        this.x = -(this.x) - this.size;
    }
    if (this.y >= height - this.size || this.y <= 0 + this.size){
        this.y = -(this.y) - this.size;
    }
   
};
//define setControls for EvilCircle
EvilCircle.prototype.checkBounds = function() {
    var _this = this;
    window.onkeydown = function(e) {
        if (e.keyCode === 65) {
            _this.x -= _this.velX;
        }else if (e.keyCode === 68) {
            _this.x += _this.velX;
        }else if (e.keyCode === 87) {
            _this.y -= _this.velY;
        }else if (e.keyCode === 83) {
            _this.y += _this.velY;
        }
    }
};
//define collision detection for EvilCircle
EvilCircle.prototype.collisionDetect = function() {
    
    for(var i=0; i < balls.length; i++){
        if(balls[i].exists){
            var dx = this.x - balls[i].x;
            var dy = this.y - balls[i].y;
            var distance = Math.sqrt((dx*dx) + (dy*dy));
            
            if(distance < this.size + balls[i].size) {
                balls[i].exists = false;
                ballCount--;
                
            }  
        }
    }
};
//define a draw method for Ball
Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
    ctx.fill(); 
};

//define how a Ball object moves (update)
Ball.prototype.update = function() {
    if (this.x >= width - this.size || this.x <= 0 + this.size){
        this.velX = -(this.velX);
    }
    if (this.y >= height - this.size || this.y <= 0 + this.size){
        this.velY = -(this.velY);
    }
    this.x += this.velX;
    this.y += this.velY;
    
};

//define collision detection for the ball objects
Ball.prototype.collisionDetect = function() {
    for(var i=0; i < balls.length; i++){
        if(this !== balls[i]){
            var dx = this.x - balls[i].x;
            var dy = this.y - balls[i].y;
            var distance = Math.sqrt((dx*dx) + (dy*dy));
            
            if(distance < this.size + balls[i].size) {
                balls[i].color = randomColor();
                this.velX = -(this.velX);
                this.velY = -(this.velY);
            }  
        }
    }
};
//setup the overall animation


var balls = [];
var evil = new EvilCircle();
function gameLoop() {
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0,0,width,height);
    while(balls.length < MAX_BALLS){
        var ball = new Ball();
        balls.push(ball);
    }
    for(var i = 0; i < balls.length; i++){
        if(balls[i].exists){
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }

    evil.draw();
    evil.checkBounds();
    evil.collisionDetect();
    if(ballCount > 0){
        counter.innerHTML = ballCount;
    }else {
        counter.innerHTML = "YOU WIN!!!!";
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();