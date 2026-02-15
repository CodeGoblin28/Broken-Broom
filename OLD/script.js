// ==================
// Canvas & Context
// ==================
let board;
let context;

// ==================
// Player
// ==================
let playerWidth = 36;
let playerHeight = 50;
let playerX = 0;
let playerY = 0;

let playerImg;

let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};

// ==================
// Obstacles
// ==================
let blockArray = [];

let block1Width = 93;
let block2Width = 70;
let block3Width = 102;
let blockHeight = 70;

let blockX = 0;

// ==================
// Physics
// ==================
let velocityX = -2;
let velocityY = 0;
let gravity = 0.1;
let jumpHeld = false;

// ==================
// Game State
// ==================
let gameOver = false;
let score = 0;
let lastTime = 0;

// ==================
// Assets
// ==================
let block1Img, block2Img, block3Img;
let bgImg;
let bgX = 0;

// ==================
// Resize
// ==================
function resizeCanvas() {
    board.width = window.innerWidth;
    board.height = window.innerHeight;

    player.x = board.width / 8;
    player.y = board.height - player.height;
    blockX = board.width;
}

// ==================
// Init
// ==================
window.onload = function () {
    board = document.getElementById("board");
    context = board.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Load images
    playerImg = new Image();
    playerImg.src = "./asset/player/player.png";

    block1Img = new Image();
    block1Img.src = "./asset/enemy/Spikes.png";

    block2Img = new Image();
    block2Img.src = "./asset/enemy/wheel.png";

    block3Img = new Image();
    block3Img.src = "./asset/enemy/enemy1.png";

    bgImg = new Image();
    bgImg.src = "./asset/origbig.png";

    setInterval(placeBlock, 900);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    requestAnimationFrame(update);
};

// ==================
// Main Loop
// ==================
function update(timestamp) {
    requestAnimationFrame(update);

    if (!lastTime) lastTime = timestamp;
    let deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    context.clearRect(0, 0, board.width, board.height);

    drawBackground();

    if (gameOver) {
        drawGameOver();
        return;
    }

    score += deltaTime;

    // Jump physics
    if (jumpHeld) velocityY -= 0.4;
    velocityY += gravity;
    velocityY = Math.max(velocityY, -4);

    player.y += velocityY;

    if (player.y < 0) {
        player.y = 0;
        velocityY = 0;
    }

    if (player.y + player.height > board.height) {
        player.y = board.height - player.height;
        velocityY = 0;
    }

    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Obstacles
    for (let block of blockArray) {
        block.x += velocityX;

        if (block.img === block2Img) {
            drawCircularImage(block.img, block.x, block.y, block.width);
            if (rectCircleCollision(player, block)) gameOver = true;
        } else {
            context.drawImage(block.img, block.x, block.y, block.width, block.height);
            if (detectCollision(player, block)) gameOver = true;
        }
    }

    // Cleanup
    while (blockArray.length && blockArray[0].x + blockArray[0].width < 0) {
        blockArray.shift();
    }

    // Score
    context.fillStyle = "white";
    context.font = "20px Courier New";
    context.fillText("Score: " + Math.floor(score), 60, 30);
}

// ==================
// Background Scroll
// ==================
function drawBackground() {
    bgX -= 1;
    context.drawImage(bgImg, bgX, 0, board.width, board.height);
    context.drawImage(bgImg, bgX + board.width, 0, board.width, board.height);

    if (bgX <= -board.width) bgX = 0;
}

// ==================
// Obstacles Spawn
// ==================
function placeBlock() {
    if (gameOver) return;

    let block = {
        img: null,
        x: blockX,
        y: 0,
        width: 0,
        height: blockHeight
    };

    let chance = Math.random();

    if (chance > 0.9) {
        block.img = block3Img;
        block.width = block3Width;
        block.y = Math.random() * (board.height - blockHeight);
    } else if (chance > 0.7) {
        block.img = block2Img;
        block.width = block2Width;
        block.y = Math.random() * (board.height - blockHeight);
    } else if (chance > 0.5) {
        block.img = block1Img;
        block.width = block1Width;
        block.y = board.height - blockHeight;
    } else {
        return;
    }

    blockArray.push(block);
}

// ==================
// Input
// ==================
function handleKeyDown(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        jumpHeld = true;
    }

    if (gameOver) resetGame();
}

function handleKeyUp(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        jumpHeld = false;
    }
}

// ==================
// Reset
// ==================
function resetGame() {
    player.y = board.height - player.height;
    velocityY = 0;
    blockArray = [];
    score = 0;
    gameOver = false;
}

// ==================
// Utils
// ==================
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function rectCircleCollision(rect, circle) {
    let cx = circle.x + circle.width / 2;
    let cy = circle.y + circle.width / 2;
    let r = circle.width / 2;

    let closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
    let closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));

    let dx = cx - closestX;
    let dy = cy - closestY;

    return dx * dx + dy * dy < r * r;
}

function drawCircularImage(img, x, y, size) {
    context.save();
    context.beginPath();
    context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    context.clip();
    context.drawImage(img, x, y, size, size);
    context.restore();
}

function drawGameOver() {
    context.fillStyle = "rgba(0,0,0,0.6)";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "white";
    context.font = "32px Courier New";
    context.textAlign = "center";
    context.fillText("GAME OVER", board.width / 2, board.height / 2);
    context.fillText("Press any jump key", board.width / 2, board.height / 2 + 40);
}
