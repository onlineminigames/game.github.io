const board = document.getElementById("tic-tac-toe-board");
const result = document.getElementById("result");
const resetBtn = document.getElementById("reset-btn");

let currentPlayer = "X";
let boardState = ["", "", "", "", "", "", "", "", ""];

// Create the board
function createBoard() {
  board.innerHTML = "";
  boardState.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.className = "cell";
    cellElement.dataset.index = index;
    cellElement.textContent = cell;
    cellElement.addEventListener("click", handleMove);
    board.appendChild(cellElement);
  });
}

// Handle player move
function handleMove(event) {
  const index = event.target.dataset.index;
  if (boardState[index] !== "") return;

  boardState[index] = currentPlayer;
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  event.target.textContent = boardState[index];

  checkWinner();
}

// Check winner
function checkWinner() {
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

  winningPatterns.forEach((pattern) => {
    const [a, b, c] = pattern;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      result.textContent = `${boardState[a]} Wins!`;
      boardState = ["", "", "", "", "", "", "", "", ""];
      createBoard();
    }
  });

  if (!boardState.includes("")) {
    result.textContent = "It's a Draw!";
  }
}

// Restart the game
resetBtn.addEventListener("click", () => {
  boardState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  result.textContent = "";
  createBoard();
});

// Initialize the game
createBoard();
