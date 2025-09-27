const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;

// State
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    dy: BALL_SPEED * (Math.random() * 2 - 1)
};
let score = { left: 0, right: 0 };

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Middle line
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Left paddle
    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Right paddle (AI)
    ctx.fillStyle = "#F44336";
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.fillStyle = "#fff";
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
}

// Reset ball position and direction
function resetBall(direction) {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.dx = BALL_SPEED * (direction || (Math.random() > 0.5 ? 1 : -1));
    ball.dy = BALL_SPEED * (Math.random() * 2 - 1);
}

// Update game state
function update() {
    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top & bottom wall collision
    if (ball.y < 0) {
        ball.y = 0;
        ball.dy *= -1;
    }
    if (ball.y + BALL_SIZE > canvas.height) {
        ball.y = canvas.height - BALL_SIZE;
        ball.dy *= -1;
    }

    // Left paddle collision
    if (
        ball.x <= PLAYER_X + PADDLE_WIDTH &&
        ball.y + BALL_SIZE > playerY &&
        ball.y < playerY + PADDLE_HEIGHT
    ) {
        ball.x = PLAYER_X + PADDLE_WIDTH;
        ball.dx *= -1.05;
        // Add some "spin"
        let impactPoint = (ball.y + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ball.dy = impactPoint * 0.2;
    }

    // Right paddle (AI) collision
    if (
        ball.x + BALL_SIZE >= AI_X &&
        ball.y + BALL_SIZE > aiY &&
        ball.y < aiY + PADDLE_HEIGHT
    ) {
        ball.x = AI_X - BALL_SIZE;
        ball.dx *= -1.05;
        // Add some "spin"
        let impactPoint = (ball.y + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ball.dy = impactPoint * 0.2;
    }

    // Left or right wall (score)
    if (ball.x < 0) {
        score.right += 1;
        updateScore();
        resetBall(1);
    }
    if (ball.x + BALL_SIZE > canvas.width) {
        score.left += 1;
        updateScore();
        resetBall(-1);
    }

    // AI movement
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ball.y + BALL_SIZE / 2 - 10) {
        aiY += PADDLE_SPEED;
    } else if (aiCenter > ball.y + BALL_SIZE / 2 + 10) {
        aiY -= PADDLE_SPEED;
    }
    // Keep AI paddle in bounds
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function updateScore() {
    document.getElementById('score-left').textContent = score.left;
    document.getElementById('score-right').textContent = score.right;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
resetBall();
gameLoop();