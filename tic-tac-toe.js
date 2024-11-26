let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;
let playerScores = { X: { wins: 0, losses: 0, draws: 0 }, O: { wins: 0, losses: 0, draws: 0 } };

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
    playerScores[currentPlayer].wins++;
    playerScores[currentPlayer === "X" ? "O" : "X"].losses++;
    displayResult(`${currentPlayer} wins!`);
    drawWinningLine(getWinningCombination(currentPlayer));
  } else if (board.every(cell => cell !== "")) {
    gameOver = true;
    playerScores.X.draws++;
    playerScores.O.draws++;
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

  // Calculate coordinates for the winning line
  const [start, middle, end] = winningCombo;

  const startX = (start % 3) * 90 + 45;  // Start x position (middle of cell)
  const startY = Math.floor(start / 3) * 90 + 45;  // Start y position (middle of cell)
  const endX = (end % 3) * 90 + 45;  // End x position (middle of cell)
  const endY = Math.floor(end / 3) * 90 + 45;  // End y position (middle of cell)

  const angle = Math.atan2(endY - startY, endX - startX);
  const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);

  // Style the line
  line.style.top = `${startY - 1}px`;
  line.style.left = `${startX - 1}px`;
  line.style.width = `${distance}px`;
  line.style.height = '2px';
  line.style.transformOrigin = '0 50%';
  line.style.transform = `rotate(${angle}rad)`;
  
  boardContainer.appendChild(line);
}

// Display the game result
function displayResult(message) {
  document.getElementById('result').innerText = message;
  updateScoreboard();
}

// Update the scoreboard
function updateScoreboard() {
  document.getElementById('score-X').innerText = `X Wins: ${playerScores.X.wins} | X Losses: ${playerScores.X.losses} | X Draws: ${playerScores.X.draws}`;
  document.getElementById('score-O').innerText = `O Wins: ${playerScores.O.wins} | O Losses: ${playerScores.O.losses} | O Draws: ${playerScores.O.draws}`;
}

// Robot's move (O)
function robotMove() {
  const emptyCells = board.map((cell, index) => cell === "" ? index : -1).filter(index => index !== -1);
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
