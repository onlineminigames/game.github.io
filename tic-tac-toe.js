// Game variables
const boardState = Array(9).fill(""); // Empty board
const player = "X";
const robot = "O";
const board = document.getElementById("tic-tac-toe-board");

// Initialize scores
let scores = {
  wins: 0,
  losses: 0,
  draws: 0,
};

// Load scores from localStorage
function loadScores() {
  const savedScores = JSON.parse(localStorage.getItem("tictactoe-scores"));
  if (savedScores) {
    scores = savedScores;
  }
  updateScoreboard();
}

// Save scores to localStorage
function saveScores() {
  localStorage.setItem("tictactoe-scores", JSON.stringify(scores));
}

// Update the scoreboard display
function updateScoreboard() {
  document.getElementById("wins").textContent = scores.wins;
  document.getElementById("losses").textContent = scores.losses;
  document.getElementById("draws").textContent = scores.draws;
}

// Create the Tic Tac Toe board
function createBoard() {
  board.innerHTML = ""; // Clear the board
  boardState.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.className = "cell"; // Class for styling
    cellElement.dataset.index = index; // Assign unique index
    cellElement.textContent = cell; // Add the current state (X, O, or empty)
    cellElement.addEventListener("click", handlePlayerMove); // Add click handler
    board.appendChild(cellElement); // Append to the board container
  });
}

// Handle player move
function handlePlayerMove(event) {
  const index = event.target.dataset.index;

  // Ignore clicks on filled cells or if the game is over
  if (boardState[index] !== "" || checkWinner()) return;

  boardState[index] = player; // Set player move
  createBoard();

  if (checkWinner() || isBoardFull()) return; // End if there's a winner or draw

  robotMove(); // Robot's turn
}

// Robot's move
function robotMove() {
  let emptyIndices = boardState
    .map((cell, index) => (cell === "" ? index : null))
    .filter((index) => index !== null);

  // Random move by the robot
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  boardState[randomIndex] = robot;
  createBoard();

  if (checkWinner() || isBoardFull()) return; // End if there's a winner or draw
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
      updateResult(boardState[a] === player ? "win" : "loss");
      return true;
    }
  }
  return false;
}

// Check if the board is full
function isBoardFull() {
  if (boardState.every((cell) => cell !== "")) {
    updateResult("draw");
    return true;
  }
  return false;
}

// Update game result
function updateResult(result) {
  const resultDisplay = document.getElementById("result");

  if (result === "win") {
    scores.wins++;
    resultDisplay.textContent = "You win!";
  } else if (result === "loss") {
    scores.losses++;
    resultDisplay.textContent = "You lose!";
  } else if (result === "draw") {
    scores.draws++;
    resultDisplay.textContent = "It's a draw!";
  }

  saveScores();
  updateScoreboard();
}

// Reset game
document.getElementById("reset-btn").addEventListener("click", () => {
  boardState.fill(""); // Clear board state
  document.getElementById("result").textContent = ""; // Clear result display
  createBoard(); // Recreate board
});

// Initialize game
document.addEventListener("DOMContentLoaded", () => {
  loadScores();
  createBoard();
});
