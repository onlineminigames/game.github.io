document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const menuScreen = document.getElementById('menu');
    const gameScreen = document.getElementById('game');
    const startGameBtn = document.getElementById('start-game');
    const backToMenuBtn = document.getElementById('back-to-menu');
    const currentScoreElement = document.getElementById('current-score');
    const highScoreElement = document.getElementById('high-score');
    const canvas = document.getElementById('game-board');
    const ctx = canvas.getContext('2d');

    const GRID_SIZE = 20;
    const SNAKE_COLOR = '#4CAF50';
    const FOOD_COLOR = '#FF4136';

    let snake, food, direction, gameLoop, score, highScore;

    function initGame() {
        canvas.width = gameContainer.clientWidth - 20;
        canvas.height = gameContainer.clientHeight - 100;

        snake = [{ x: 5, y: 5 }];
        food = generateFood();
        direction = 'right';
        score = 0;
        highScore = localStorage.getItem('snakeHighScore') || 0;
        currentScoreElement.textContent = score;
        highScoreElement.textContent = highScore;
    }

    function generateFood() {
        const x = Math.floor(Math.random() * (canvas.width / GRID_SIZE));
        const y = Math.floor(Math.random() * (canvas.height / GRID_SIZE));
        return { x, y };
    }

    function drawSnake() {
        ctx.fillStyle = SNAKE_COLOR;
        snake.forEach(segment => {
            ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
        });
    }

    function drawFood() {
        ctx.fillStyle = FOOD_COLOR;
        ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
    }

    function moveSnake() {
        const head = { ...snake[0] };

        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            food = generateFood();
            score++;
            currentScoreElement.textContent = score;
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
        } else {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];
        return (
            head.x < 0 || head.x >= canvas.width / GRID_SIZE ||
            head.y < 0 || head.y >= canvas.height / GRID_SIZE ||
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    function gameOver() {
        clearInterval(gameLoop);
        alert(`Game Over! Your score: ${score}`);
        showScreen(menuScreen);
    }

    function updateGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        moveSnake();
        if (checkCollision()) {
            gameOver();
            return;
        }
        drawSnake();
        drawFood();
    }

    function startGame() {
        showScreen(gameScreen);
        initGame();
        gameLoop = setInterval(updateGame, 100);
    }

    function showScreen(screen) {
        menuScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        screen.classList.add('active');
    }

    startGameBtn.addEventListener('click', startGame);
    backToMenuBtn.addEventListener('click', () => {
        clearInterval(gameLoop);
        showScreen(menuScreen);
    });

    // Touch controls
    let touchStartX, touchStartY;

    gameContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    gameContainer.addEventListener('touchmove', (e) => {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? 'right' : 'left';
        } else {
            direction = dy > 0 ? 'down' : 'up';
        }

        touchStartX = touchEndX;
        touchStartY = touchEndY;
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp': direction = 'up'; break;
            case 'ArrowDown': direction = 'down'; break;
            case 'ArrowLeft': direction = 'left'; break;
            case 'ArrowRight': direction = 'right'; break;
        }
    });

    // Initialize the game
    showScreen(menuScreen);
});

