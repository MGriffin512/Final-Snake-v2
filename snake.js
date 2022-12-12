// SlitherSnake

// Board Variables 

// Pixel Width of the snake's squares
var squareSize = 35;
// How many squares down it is
var numRows = 20;
// How many squares across it is (can also be a number)
var numCols = numRows;
// Board's background
var gameBoard;
// used to apply styling to the different components in the canvas
var context;

// Snake Variables

// Valocity values
var snakeVelX = 0;
var snakeVelY = 0;

// Body -- Array (used to add more snake segments as the snake eats the apples)
var snakeSize = [];

// Game Over true/false
var gameOver = false;

window.onload = function () {
  score = document.getElementById('score');
  lastScore = document.getElementById('last-score');
  gameBoard = document.getElementById('snakeboard');
  // Set game board width and height based on number of cells on the board
  gameBoard.height = numRows * squareSize;
  gameBoard.width = numCols * squareSize;
  // Sets the context to a 2-dimensional space
  context = gameBoard.getContext('2d');
  // Sets last score based on the cookie taken after the last game ended
  lastScore.innerText = document.cookie;
  // Creates an event listener that listens for keystrokes according to the snakeControl() function
  document.addEventListener('keyup', snakeControl);
  placeApple();
  placeSnake();
  // Update the screen less often to save data
  setInterval(update, 1000 / 10); // 100 ms
};

function update() {
  // If the game over state is true then the game will set the previous score for the next game to the score achieved this game
  if (gameOver) {
    // Sets the score to a string to be read by the cookie
    newScore = snakeSize.length.toString();
    document.cookie = newScore;
    return;
  }
  // Board
  context.fillStyle = '#282828';
  // Fills the gameboard starting at X0 and Y0 up to the width and height of the board
  context.fillRect(0, 0, gameBoard.width, gameBoard.height);
  // Apple
  context.fillStyle = '#ff0800';
  // Fills the apple starting at the apples base x and y values up to the width and height of the apple, minus one to allow for the outline
  context.fillRect(appleX, appleY, squareSize - 1, squareSize - 1);
  context.strokeStyle = '#000';
  context.strokeRect(appleX, appleY, squareSize, squareSize);
  // Places Apple again randomly if Snake eats it (goes through the square the apple is on)
  if (snakeX == appleX && snakeY == appleY) {
    snakeSize.push([appleX, appleY]);
    placeApple();
  }

  // Grow snake size for every apple it eats
  for (let i = snakeSize.length - 1; i > 0; i--) {
    snakeSize[i] = snakeSize[i - 1];
  }
  if (snakeSize.length) {
    snakeSize[0] = [snakeX, snakeY];
  }

  // Snake
  context.fillStyle = '#66ff00';
  // Snakes X and Y are added to the square size multiplied by the current velocity for the drawing, ensures that the correct squares are filled with the snake's color
  snakeX += snakeVelX * squareSize;
  snakeY += snakeVelY * squareSize;
  // Fills the apple starting at the snake base x and y values (from the previous equations) up to the width and height of the snake, minus one to allow for the outline
  context.fillRect(snakeX, snakeY, squareSize - 1, squareSize - 1);
  context.strokeStyle = '#000';
  context.strokeRect(snakeX, snakeY, squareSize, squareSize);
  for (let i = 0; i < snakeSize.length; i++) {
    context.fillRect(snakeSize[i][0], snakeSize[i][1], squareSize, squareSize);
    context.strokeRect(
      snakeSize[i][0],
      snakeSize[i][1],
      squareSize,
      squareSize
    );
  }

  // Game Over if the snake is out of bounds
  if (
    snakeX < 0 ||
    snakeX > numCols * squareSize - 1 ||
    snakeY < 0 ||
    snakeY > numRows * squareSize - 1
  ) {
    gameOver = true;
    document.cookie = snakeSize.length;
    var restart = confirm(
      'Game Over! Would you like to play again? \n' +
        'Your score was: ' +
        snakeSize.length
    );
    if (restart == true) {
      window.location.reload();
    }
  }
  // Sets the game over state to true if the snake is inside of itself
  for (let i = 0; i < snakeSize.length; i++) {
    // Uses the snakeSize array to determine if the snake is inside itself at any point
    if (snakeX == snakeSize[i][0] && snakeY == snakeSize[i][1]) {
      gameOver = true;
      var restart = confirm(
        'Game Over! Would you like to play again? \n' +
          'Your score was: ' +
          snakeSize.length
      );
      if (restart == true) {
        window.location.reload();
      }
    }
  }
  // Sets the current score to the length of the snake - 1 (the number of apples eaten by the snake)
  score.innerText = snakeSize.length;
}

function snakeControl(e) {
  // Function controls the velocitys / direction of the snake based on which keys are pressed (WASD or up/left/down/right) 
  // and does not allow the change in direction if it is the direction opposite the current direction (for example you cannot move down if you are currently moving up)
  if (
    (e.code == 'KeyW' && snakeVelY != 1) ||
    (e.code == 'ArrowUp' && snakeVelY != 1)
  ) {
    snakeVelX = 0;
    snakeVelY = -1;
  } else if (
    (e.code == 'KeyS' && snakeVelY != -1) ||
    (e.code == 'ArrowDown' && snakeVelY != -1)
  ) {
    snakeVelX = 0;
    snakeVelY = +1;
  } else if (
    (e.code == 'KeyA' && snakeVelX != 1) ||
    (e.code == 'ArrowLeft' && snakeVelX != 1)
  ) {
    snakeVelX = -1;
    snakeVelY = 0;
  } else if (
    (e.code == 'KeyD' && snakeVelX != -1) ||
    (e.code == 'ArrowRight' && snakeVelX != -1)
  ) {
    // If none of these is active then the snake moves in the current direction 
    snakeVelX = +1;
    snakeVelY = 0;
  }
}

// Apple Coordinates
function placeApple() {
  // math floor calculations + random calculations
  let X = Math.floor(Math.random() * numCols);
  let Y = Math.floor(Math.random() * numRows);
  // Apple coordinates equal to the random number generated from the above functions and multiplied by the size of the square to ensure it does not get placed between rows or columns
  appleX = X * squareSize;
  appleY = Y * squareSize;
}

// Snake Starting Coordinates
function placeSnake() {
  // math floor calculations + random calculations
  let X = Math.floor(Math.random() * numCols);
  let Y = Math.floor(Math.random() * numRows);
  // Snake coordinates equal to the random number generated from the above functions and multiplied by the size of the square to ensure it does not get placed between rows or columns
  snakeX = X * squareSize;
  snakeY = Y * squareSize;
}
