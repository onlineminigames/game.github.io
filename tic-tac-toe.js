function createBoard() {
  board.innerHTML = ""; // Clear the board
  boardState.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.className = "cell"; // Apply styling for cells
    cellElement.dataset.index = index; // Assign a unique index
    cellElement.textContent = cell; // Add the current state (X, O, or empty)
    cellElement.addEventListener("click", handlePlayerMove); // Add click listener
    board.appendChild(cellElement); // Append cell to the board
  });
}
