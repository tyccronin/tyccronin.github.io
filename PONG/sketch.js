/*******************************************
 
 PONG (Table Tennis)
 
 This program will simulate a game of table tennis!
 
 The Keyboard player controls the left paddle with
 the up and down arrows & the Mouse player controls
 the right paddle with the left and right mouse buttons
 
 A single match will last until one player reaches a score
 of 11 points. That person is the winner.
 
 The ball will change direction upon resetting, and change
 speed relative to where it bounces off of a paddle
 
 Upon winning the game, you must restart the program
 if you wish to play again
 
 ALSO NOTE: If you run into an issue where the ball
 is constantly turning back around, please exit and
 restart the program. I have only encountered this 
 bug 3 times out of the hundred times I've run this
 game. 
 
 This is a faster game of Pong, since I felt I was
 growing a beard watching the ball move so slowly
 otherwise.
 
 So be ready!
 And of course
 Have fun!!

 Code by Ty Cronin
 *********************************************/

// These constants control the size of the paddles, and the ball
const BALL_DIAM = 10; // The diameter of the ball in pixels
const PADDLE_WIDTH = 10; // The width of the paddles in pixels
const PADDLE_HEIGHT = 60; // The height of the paddles in pixels

// These constants control the minimum and maximum speed of the ball
const MIN_SPEED = 3; // Minimum speed of the ball when hit in the center of the paddle
const MAX_SPEED = 5; // Maximum speed of the ball when hit on either edge of the paddle
const BALL_SPEED = 4; // The average speed of the ball

// These constants control the colours
const MAX_SHADE = 0; // Black 
const MAX_BRIGHT = 255; // White
const GREEN_TEXT = 240; // Green

// These variables control the X and Y coordinates for the ball and paddles
var centerX, centerY; // Center of the canvas
var ballX, ballY; // Center of the ball
var leftPaddleX, leftPaddleY; // X and Y coordinates for the left paddle
var rightPaddleX, rightPaddleY; // X and Y coordinates for the right paddle 
var thetaRandom; // The angle the ball will travel in from center

// These variables control the speed for the ball and paddles
var ballSpeedX, ballSpeedY; // the speed of the ball in pixels for X and Y coordinates
var paddleSpeed; // the speed of the paddles in pixels


// These variables control the X and Y coordinates and size of the screen boundaries
var screenTop, screenBottom, screenLeft, screenRight; 

// These variables control the score keeping for both the keyboard and mouse
var keyScore, mouseScore;

// This boolean controls whether the game is over or not
var game_Over;

//=======================================================================================================================

// Runs to initialize the program and set the canvas, background, and variables
function setup() {
  createCanvas(1000, 900); // Sets the canvas size 
  background(MAX_SHADE); // Sets the background to a black colour
  paddleSpeed = 5; // The speed of the paddle (Y axis only)
  thetaRandom = random(TWO_PI); // The angle used to calculate the new direction of the ball
  ballSpeedX = BALL_SPEED*cos(thetaRandom); // Calculates the new direction of the ball for X coordinate
  ballSpeedY = BALL_SPEED*sin(thetaRandom); // Calculates the new direction of the ball for Y coordinate
  centerX = width/2; // Center of the canvas on the X axis
  centerY = height/2; // Center of the canvas on the Y axis
  ballX = centerX; // Center of the ball on the X axis
  ballY = centerY; // Center of the ball on the Y axis
  leftPaddleX = (centerX - centerX) + PADDLE_WIDTH; // X coordinate for the left paddle
  leftPaddleY = centerY - PADDLE_HEIGHT/2; // Y coordinate for the left paddle
  rightPaddleX = width - PADDLE_WIDTH*2; // X coordinate for the right paddle
  rightPaddleY = centerY - PADDLE_HEIGHT/2; // Y coordinate for the right paddle
  screenTop = 0; // Coordinate for the top of the screen
  screenBottom = height; // size of the screen is equal to the size of the canvas
  screenLeft = 0; // Coordinate for the left of the screen
  screenRight = width; // size of the screen is equal to the size of the canvas
  keyScore = 0; // Starting score for the "mouse" player
  mouseScore = 0; // Starting score for the "keyboard" player
  game_Over = true; // Gameover condition
}

// Runs the program
function draw() {
  screenBoundaries(); // Set the screen boundaries
  ballBoundaries(); // Set the paddle boundaries in respect to the ball
  ballSpeedVarianceLeft(); // Determine the variance of the ball speed depending on where it hits the left paddle
  ballSpeedVarianceRight(); // Determine the variance of the ball speed depending on where it hits the right paddle
  movePaddles(); // Move the paddles up or down for both players
  moveBall(); // Move the ball in a random direction each time the ball is reset
  scoreBound(); // Keep score for the respective player
  drawGame(); // Draw the main assets of the game - the ball and the two paddles
  gameOver(); // Determine if and when a player has won the game and ends it
  document.addEventListener('contextmenu', event => event.preventDefault());
}

//=========================================================================================================================

// This sets the screen boundaries
function screenBoundaries() {
  noFill(); // No fill for the box
  rect(screenLeft, screenTop, screenRight, screenBottom); // Draw the box or "boundaries"
}

// This draws the main assets of the game - the ball and the two paddles
function drawGame() {
  drawScore(); // Draw the scoreboard 

  // The Ball
  fill(MAX_BRIGHT); // Fill white
  stroke(MAX_BRIGHT); // Fill white
  ellipse(ballX, ballY, BALL_DIAM, BALL_DIAM); // Draw the ball

  // Left Paddle
  fill(MAX_BRIGHT); // Fill white
  stroke(MAX_BRIGHT); // Fill white
  rect(leftPaddleX, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT); // Draw the left paddle

  // Right Paddle
  fill(MAX_BRIGHT); // Fill white
  stroke(MAX_BRIGHT); // Fill white
  rect(rightPaddleX, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT); // Draw the right paddle
}

// This prints out the score displayed above the correct player sides
function drawScore() {
  fill(MAX_SHADE, GREEN_TEXT, MAX_SHADE); // Fill Green
  textSize(20); // Set the text size to 20
  var toPrint = "Keyboard: "+keyScore; // String variable to control what is printed on screen for the "keyboard" player
  text(toPrint, width/4-textWidth(toPrint)/2, 50); // Print the keyboard score on screen
  toPrint = "Mouse: "+mouseScore; // String variable to control what is printed on screen for the "mouse" player      
  text(toPrint, width*3/4-textWidth(toPrint)/2, 50); // Print the mouse score on screen
}

// This function helps to move the paddles up or down for both players
function movePaddles() {
  background (MAX_SHADE); // Reset the background to black

  //Left Paddle
 if (keyIsPressed) // Check to see if a Key is Pressed
    if (keyCode == UP_ARROW) { // If so, check to see if it's the up key
      leftPaddleY -= paddleSpeed; // If so, move the paddle up
    } else if (keyCode == DOWN_ARROW) { // If not, check to see if it's the down key
      leftPaddleY += paddleSpeed; // if so, move the paddle down
    }// Otherwise do nothing

  //Right Paddle
 if (mouseIsPressed) // Check to see if a mouse button is pressed
    if (mouseButton == RIGHT) { // If so, check to see if it's the right mouse button
      rightPaddleY -= paddleSpeed; // If so, move the paddle up
    } else if (mouseButton == LEFT) { // if not, check to see if it's the left mouse button
      rightPaddleY += paddleSpeed; // if so, move the paddle down
    }// Otherwise, do nothing

  // Paddle boundries     
  if (leftPaddleY>screenBottom-PADDLE_HEIGHT/2/2 || leftPaddleY<screenTop-PADDLE_HEIGHT/2/2) // Check to see if the left paddle leaves the bottom of the screen entirely (has some room)
    paddleSpeed = -paddleSpeed; // If so, bounce back in the other direction

  else if (rightPaddleY>screenBottom-PADDLE_HEIGHT/2/2 || rightPaddleY<screenTop-PADDLE_HEIGHT/2/2) // Check to see if the right paddle leaves the bottom of the screen entirely (has some room)
    paddleSpeed = -paddleSpeed; // If so, bounce back in the other direction
} // Otherwise, carry on going up and down as per user input!

// This function moves the ball in a random direction each time the ball is reset
function moveBall () {      
  ballX += ballSpeedX; // Add the speed of the ball to X
  ballY += ballSpeedY; // Add the speed of the ball to Y
}

// This function sets the paddle boundaries in respect to the ball
function ballBoundaries() 
{
  if (ballY>screenBottom-BALL_DIAM/2 || ballY<screenTop+BALL_DIAM/2) // Check to see if the ball touches the top or bottom of the screen
  {
    ballSpeedY = -ballSpeedY; // If so, make it bounce
  } else if (ballX - BALL_DIAM/2 < leftPaddleX + PADDLE_WIDTH && // Checl to see if the ball is touching the left paddle
    ballY + BALL_DIAM/2 > leftPaddleY && 
    ballY - BALL_DIAM/2 < leftPaddleY + PADDLE_HEIGHT) 
  {
    ballSpeedVarianceLeft();  // If so, make it bounce in respect to the minimum and maximum speeds
  } else if (ballX + BALL_DIAM/2 > rightPaddleX && // Check to see if the ball is touching the right paddle
    ballY + BALL_DIAM/2 > rightPaddleY &&
    ballY - BALL_DIAM/2 < rightPaddleY + PADDLE_HEIGHT) 
  {
    ballSpeedVarianceRight(); // If so, make it bounce in respect to the minimum and maximum speeds
  }
}

// This function determines the variance of the ball speed depending on where it hits the left paddle
function ballSpeedVarianceLeft() 
{
  if (ballY == leftPaddleY || ballY == leftPaddleY + PADDLE_HEIGHT) // Check to see if the ball touches the left paddle on the top or bottom edge
  {
    ballSpeedX = -MAX_SPEED; // If so, bounce back with max speed
  } else if (ballY == leftPaddleY + PADDLE_HEIGHT/2) // Check to see if the ball touches the left paddle in the middle
  {
    ballSpeedX = -MIN_SPEED; // If so, bounce back with min speed
  } else
  {
    ballSpeedX = -ballSpeedX; // Otherwise, bounce back with regular speed
  }
}

// This function determines the variance of the ball speed depending on where it hits the right paddle
function ballSpeedVarianceRight() 
{         
  if (ballY == rightPaddleY || ballY == rightPaddleY + PADDLE_HEIGHT) // Check to see if the ball touches the right paddle on the top or bottom edge
  {
    ballSpeedX = -MAX_SPEED; // If so, bounce back with max speed
  } else if (ballY == rightPaddleY + PADDLE_HEIGHT/2) // Check to see if the ball touches the right paddle in the middle
  {
    ballSpeedX = -MIN_SPEED; // If so, bounce back with min speed
  } else
  {
    ballSpeedX = -ballSpeedX; // Otherwise, bounce back with regular speed
  }
}

// Reset the ball to the center of the screen
function resetBall() 
{
  ballX = centerX;
  ballY = centerY;
}

// This function keeps score for the respective player
function scoreBound() 
{     
  if (ballX>screenRight) // Check if the ball goes past the right edge of the screen
  { 
    resetBall(); // if so, reset the ball
    keyScore = keyScore +1; // Also add 1 point to the keyboard players score
  } else if (ballX<screenLeft) { // Check if the ball goes past the left edge of the screen
    resetBall(); // If so, reset the ball
    mouseScore = mouseScore +1; // Also add 1 pont to the mouse players score
  }
}

// This function determines if and when a player has won the game and ends it
function gameOver()
{
  if (gameOver && mouseScore == 11) // Check to see if boolean gameOver is true, and if the mouse score is 11
  {
    ballX = centerX; // If so, set the ball to the center of the screen
    ballY = centerY; // Y coordinate inclusive
    // Also reset the paddles
    leftPaddleX = (centerX - centerX) + PADDLE_WIDTH; // X coordinate for the left paddle
    leftPaddleY = centerY - PADDLE_HEIGHT/2; // Y coordinate for the left paddle
    rightPaddleX = width - PADDLE_WIDTH*2; // X coordinate for the right paddle
    rightPaddleY = centerY - PADDLE_HEIGHT/2; // Y coordinate for the right paddle
    mouseWin(); // Print text on screen for the mouse player win
  } else if (gameOver && keyScore == 11) // Check to see if boolean gameOver is true, and if the keyboard score is 11
  {
    ballX = centerX; //If so, set the ball to the center of the screen
    ballY = centerY; // Y coordinate inclusive
    // Also reset the paddles
    leftPaddleX = (centerX - centerX) + PADDLE_WIDTH; // X coordinate for the left paddle
    leftPaddleY = centerY - PADDLE_HEIGHT/2; // Y coordinate for the left paddle
    rightPaddleX = width - PADDLE_WIDTH*2; // X coordinate for the right paddle
    rightPaddleY = centerY - PADDLE_HEIGHT/2; // Y coordinate for the right paddle
    keyWin(); // Print text on screen for the keyboard player win
  }
}

// This function displays a message indicating the keyboard player has won the game
function keyWin() 
{
  fill(MAX_SHADE, GREEN_TEXT, MAX_SHADE); // Fill green
  textSize(30); // Set the text size to 30
  var keyWin = " KeyBoard Wins!! \nPlease Exit Game"; // String variable declaring what will be printed on screen
  text(keyWin, centerX/2+centerX/2/2/2, centerY); // Print the message on screen
}

// This function displays a message indicating the mouse player has won the game
function mouseWin() 
{
  fill(MAX_SHADE, GREEN_TEXT, MAX_SHADE); // Fill green
  textSize(30); // Set the text size to 30
  var MouseWin = "   Mouse Wins!! \nPlease Exit Game"; // String variable declaring what will be printed on screen
  text(MouseWin, centerX/2+centerX/2/2/2, centerY); // Print the message on screen
}