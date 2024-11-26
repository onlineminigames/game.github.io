let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;
let playerScores = { X: 0, O: 0 }; // Save scores for both players

// Add event listeners to each cell
const cells = document.querySelectorAll('.cell');
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => handleCellClick(index));
});

// Handle cell click
function handleCellClick(index) {
  if (gameOver || board[index] !== "") return;

  // Mark the cell with the current player's symbol
  board[index] = currentPlayer;
  document.getElementById(`cell-${index}`).innerText = currentPlayer;

  // Check for a win or a draw
  if (checkWin(currentPlayer)) {
    gameOver = true;
    playerScores[currentPlayer]++;
    displayResult(`${currentPlayer} wins!`);
    drawWinningLine(getWinningCombination(currentPlayer));
  } else if (board.every(cell => cell !== "")) {
    gameOver = true;
    displayResult("It's a draw!");
  } else {
    // Switch to the next player
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    if (currentPlayer === "O" && !gameOver) {
      robotMove();
    }
  }
}

// Function to check for a win
function checkWin(player) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  return winningCombinations.some(combination => {
    return combination.every(index => board[index] === player);
  });
}

// Get the winning combination of cells
function getWinningCombination(player) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  return winningCombinations.find(combination => {
    return combination.every(index => board[index] === player);
  });
}

// Draw the winning line across the winning cells
function drawWinningLine(winningCombo) {
  const boardContainer = document.getElementById('board');
  
  // Remove any existing winning line
  const existingLine = document.querySelector('.winning-line');
  if (existingLine) existingLine.remove();

  const line = document.createElement('div');
  line.classList.add('winning-line');

  const isHorizontal = winningCombo[0] % 3 === winningCombo[1] % 3;
  const isVertical = winningCombo[0] / 3 === winningCombo[1] / 3;
  
  if (isHorizontal) {
    const row = Math.floor(winningCombo[0] / 3);
    line.style.top = `${row * 90}px`;
    line.style.left = '0';
    line.style.width = '270px'; // Full width of the grid
    line.style.height = '3px';
  } else if (isVertical) {
    const col = winningCombo[0] % 3;
    line.style.left = `${col * 90}px`;
    line.style.top = '0';
    line.style.height = '270px'; // Full height of the grid
    line.style.width = '3px';
  } else {
    line.style.left = '0';
    line.style.top = '0';
    line.style.width = '270px';
    line.style.height = '3px';
    line.style.transform = 'rotate(45deg)';
    line.style.transformOrigin = 'top left';
  }

  boardContainer.appendChild(line);
}

// Display the result message
function displayResult(message) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerText = message;

  // Update player scores
  const scoreX = document.getElementById('score-X');
  const scoreO = document.getElementById('score-O');
  scoreX.innerText = `X: ${playerScores.X}`;
  scoreO.innerText = `O: ${playerScores.O}`;
}

// Function to make the robot's move
function robotMove() {
  const emptyCells = board.map((value, index) => value === "" ? index : -1).filter(index => index !== -1);
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  setTimeout(() => handleCellClick(randomCell), 500); // Delay to simulate robot thinking
}

// Reset the game
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameOver = false;
  cells.forEach(cell => cell.innerText = "");
  document.getElementById('result').innerText = "";
}

document.getElementById('reset').addEventListener('click', resetGame);
