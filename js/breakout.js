//Setup the canvas
var ballRadius = 10;
var ballColor = "#D2691E"
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//Set the starting point
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

//Define a paddle to hit the ball
var paddleHeight = 10;
var paddleWidth = 120;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

//Setup some bricks
var brickRowCount = 10;
var brickColumnCount = 10;
var brickWidth = 60;
var brickHeight = 15;
var brickPadding = 10;
var brickOffsetTop = 40;
var brickOffsetLeft = 40;

//Add game lives
var lives = 3;

//Counting the Score
var score = 0;

//Game Sounds
var YOUWIN_SOUND = new Audio('sounds/youwin.wav');
var BOUNCE_SOUND = new Audio('sounds/bounce.wav');
var YOULOSE_SOUND = new Audio('sounds/youlose.wav');

//Hold the bricks in a two-dimensional array - think of it as rows and columns
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
	bricks[c] = [];
	for(r=0; r<brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 };
	}
}

//This function draws the bricks
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = ballColor;
                ctx.fill();
                ctx.closePath();
			}
		}
	}
}

//Draw the ball
function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 20, Math.PI*2);
	ctx.fillStyle = "#D2691E";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx. fillStyle = "#000000";
	ctx.fill();
	ctx.closePath();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//draw the ball
	drawBall();
	//draw the paddle
	drawPaddle();
	//draw the score
	drawScore();
	//Draw the lives
	drawLives();
	//draw the bricks
	drawBricks();
	//collision detection
	collisionDetection();
	
	x += dx;
	y += dy;
	
	//Bouncing the ball off three walls - if it drops off the bottom - Game Over!
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
		var ballColor = get_random_color();
    }
    if(y + dy < ballRadius) {
        dy = -dy;
		var ballColor = get_random_color();
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
				dy = -dy * 1.1;       
		}
        else {
            lives--;
            if(!lives) {
				YOULOSE_SOUND.play();
                alert("YOU LOSE! :(");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    

	//Move the paddle left and right
	if(rightPressed && paddleX < canvas.width-paddleWidth) {
		paddleX += 10;
	}
		else if(leftPressed && paddleX > 0) {
			paddleX -= 10;
		}
		
		function drawScore() {
		ctx.font = "16px Arial";
		ctx.fillStyle = "#0095DD";
		ctx.fillText("Score: "+score, 8, 20);
		document.getElementById("gamescore").innerHTML = "Score: " + score;
	}
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
//end of draw()

document.addEventListener("keydown" , keyDownHandler, false);
document.addEventListener("keyup" , keyUpHandler, false);
document.addEventListener("mousemove" , mouseMoveHandler, false);


function keyDownHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = true;
	}
	else if(e.keyCode == 37) {
		leftPressed = true;
	}
}

function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth/2;
	}
}

function keyUpHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = false;
	}
	else if(e.keyCode == 37) {
		leftPressed = false;
	}
}



function collisionDetection() {
	for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
					score++;
					BOUNCE_SOUND.play();
					if(score == brickRowCount*brickColumnCount) {
						YOUWIN_SOUND.play();
						alert("YOU WIN, CONGRATULATIONS!");
						var result = str.bold();;
						document.location.reload();
					
					}
                }
            }
        }
    }
}


setInterval(draw, 10);