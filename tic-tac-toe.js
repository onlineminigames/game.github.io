const boardElement = document.getElementById("board");
const resultElement = document.getElementById("result");
const resetButton = document.getElementById("reset");
let boardState = Array(9).fill(""); // Represents the board (3x3)
const player = "X";
const robot = "O";

// Load scoreboard
let scores = JSON.parse(localStorage.getItem("tictactoe-scores")) || {
  wins: 0,
  losses: 0,
  draws: 0,
};

// Flag to check if the game is over
let gameOver = false;
let winningCombo = [];

// Update scoreboard
function updateScoreboard() {
  document.getElementById("wins").textContent = scores.wins;
  document.getElementById("losses").textContent = scores.losses;
  document.getElementById("draws").textContent = scores.draws;
}

function saveScores() {
  localStorage.setItem("tictactoe-scores", JSON.stringify(scores));
}

// Initialize the board
function createBoard() {
  boardElement.innerHTML = ""; // Clear existing board
  boardState.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.className = "cell";
    cellElement.dataset.index = index;
    cellElement.textContent = cell;
    if (winningCombo.includes(index)) {
      cellElement.classList.add("winning-cell");
    }
    cellElement.addEventListener("click", handlePlayerMove);
    boardElement.appendChild(cellElement);
  });
}

// Handle player's move
function handlePlayerMove(event) {
  if (gameOver) return; // Prevent moves if the game is over

  const index = event.target.dataset.index;

  // Ignore clicks on already filled cells
  if (boardState[index] !== "" || checkWinner() || isBoardFull()) return;

  boardState[index] = player; // Player's move
  createBoard();

  if (checkWinner() || isBoardFull()) return;

  robotMove(); // Robot's turn
}

// Robot makes a smart move
function robotMove() {
  if (gameOver) return; // Prevent robot's move if game is over

  const bestMove = getBestMove();
  boardState[bestMove] = robot; // Robot's move
  createBoard();

  checkWinner(); // Check for winner after robot's move
  isBoardFull(); // Check for draw
}

// Function to get the best move for the robot
function getBestMove() {
  const winningMoves = getWinningMove(robot); 
  if (winningMoves.length > 0) {
    return winningMoves[0]; // Robot takes the winning spot
  }

  const blockingMoves = getWinningMove(player);
  if (blockingMoves.length > 0) {
    return blockingMoves[0]; // Block the player's winning move
  }

  // If no immediate win or block, pick a random move
  const emptyCells = boardState
    .map((cell, index) => (cell === "" ? index : null))
    .filter((index) => index !== null);

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Function to check for a winning move (for either player or robot)
function getWinningMove(symbol) {
  const winningMoves = [];
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  winningCombos.forEach((combo) => {
    const [a, b, c] = combo;
    const cells = [boardState[a], boardState[b], boardState[c]];
    const emptyIndex = cells.indexOf(""); // Check if there's an empty spot in the combo
    if (emptyIndex !== -1 && cells.filter(cell => cell === symbol).length === 2) {
      winningMoves.push(combo[emptyIndex]);
    }
  });

  return winningMoves;
}

// Check for winner
function checkWinner() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      gameOver = true;
      winningCombo = combo; // Store the winning combo to highlight the cells
      if (boardState[a] === player) {
        scores.wins++;
        resultElement.textContent = "You Win!";
      } else {
        scores.losses++;
        resultElement.textContent = "Robot Wins!";
      }
      saveScores();
      updateScoreboard();
      return true;
    }
  }
  return false;
}

// Check if the board is full (draw)
function isBoardFull() {
  if (boardState.every(cell => cell !== "")) {
    gameOver = true;
    scores.draws++;
    resultElement.textContent = "It's a Draw!";
    saveScores();
    updateScoreboard();
    return true;
  }
  return false;
}

// Reset the game
resetButton.addEventListener("click", () => {
  boardState = Array(9).fill("");
  gameOver = false;
  winningCombo = [];
  resultElement.textContent = "";
  createBoard();
});

// Initialize the game
createBoard();
updateScoreboard();
