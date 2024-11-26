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
    cellElement.addEventListener("click", handlePlayerMove);
    boardElement.appendChild(cellElement);
  });
}

// Handle player's move
function handlePlayerMove(event) {
  const index = event.target.dataset.index;

  // Ignore clicks on already filled cells or if the game is over
  if (boardState[index] !== "" || checkWinner() || isBoardFull()) return;

  boardState[index] = player; // Player's move
  createBoard();

  if (checkWinner() || isBoardFull()) return;

  robotMove(); // Robot's turn
}

// Robot makes a random move
function robotMove() {
  const emptyCells = boardState
    .map((cell, index) => (cell === "" ? index : null))
    .filter((index) => index !== null);

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  boardState[randomIndex] = robot; // Robot's move
  createBoard();

  checkWinner(); // Check for winner after robot's move
  isBoardFull(); // Check for draw
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

  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      resultElement.textContent =
        boardState[a] === player ? "You win!" : "You lose!";
      if (boardState[a] === player) scores.wins++;
      else scores.losses++;
      saveScores();
      updateScoreboard();
      return true;
    }
  }
  return false;
}

// Check for draw
function isBoardFull() {
  if (boardState.every((cell) => cell !== "")) {
    resultElement.textContent = "It's a draw!";
    scores.draws++;
    saveScores();
    updateScoreboard();
    return true;
  }
  return false;
}

// Reset the game
resetButton.addEventListener("click", () => {
  boardState = Array(9).fill("");
  resultElement.textContent = "";
  createBoard();
});

// Initialize the game
document.addEventListener("DOMContentLoaded", () => {
  updateScoreboard();
  createBoard();
});
