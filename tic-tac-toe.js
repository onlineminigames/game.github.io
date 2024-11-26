const board = document.getElementById("tic-tac-toe-board");
const result = document.getElementById("result");
const resetBtn = document.getElementById("reset-btn");

let currentPlayer = "X"; // Player is "X", robot is "O"
let boardState = ["", "", "", "", "", "", "", "", ""];
let scores = { wins: 0, losses: 0, draws: 0 };

// Initialize scores from localStorage
if (localStorage.getItem("ticTacToeScores")) {
  scores = JSON.parse(localStorage.getItem("ticTacToeScores"));
}
updateScoreboard();

// Create the board
function createBoard() {
  board.innerHTML = "";
  boardState.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.className = "cell";
    cellElement.dataset.index = index;
    cellElement.textContent = cell;
    cellElement.addEventListener("click", handlePlayerMove);
    board.appendChild(cellElement);
  });
}

// Handle player move
function handlePlayerMove(event) {
  const index = event.target.dataset.index;
  if (boardState[index] !== "" || currentPlayer !== "X") return;

  // Player's move
  boardState[index] = "X";
  event.target.textContent = "X";

  if (checkWinner("X")) {
    result.textContent = "You Win!";
    scores.wins++;
    saveScores();
    resetGame();
    return;
  }

  if (boardState.every(cell => cell !== "")) {
    result.textContent = "It's a Draw!";
    scores.draws++;
    saveScores();
    resetGame();
    return;
  }

  currentPlayer = "O"; // Switch to robot
  setTimeout(robotMove, 500); // Delay for robot's move
}

// Robot's move
function robotMove() {
  // Simple AI: Find the first empty cell
  const emptyCells = boardState.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
  if (emptyCells.length === 0) return;

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  boardState[randomIndex] = "O";

  const robotCell = document.querySelector(`.cell[data-index='${randomIndex}']`);
  robotCell.textContent = "O";

  if (checkWinner("O")) {
    result.textContent = "You Lose!";
    scores.losses++;
    saveScores();
    resetGame();
    return;
  }

  if (boardState.every(cell => cell !== "")) {
    result.textContent = "It's a Draw!";
    scores.draws++;
    saveScores();
    resetGame();
    return;
  }

  currentPlayer = "X"; // Switch back to player
}

// Check for a winner
function checkWinner(player) {
  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningPatterns.some(pattern => 
    pattern.every(index => boardState[index] === player)
  );
}

// Reset the game
function resetGame() {
  boardState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  result.textContent = "";
  createBoard();
}

// Save scores to localStorage
function saveScores() {
  localStorage.setItem("ticTacToeScores", JSON.stringify(scores));
  updateScoreboard();
}

// Update the scoreboard
function updateScoreboard() {
  document.getElementById("wins").textContent = scores.wins;
  document.getElementById("losses").textContent = scores.losses;
  document.getElementById("draws").textContent = scores.draws;
}

// Restart button functionality
resetBtn.addEventListener("click", resetGame);

// Initialize the game
createBoard();
