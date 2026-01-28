
//board size
let board;
// let boardWidth = 750;
// let boardHeight = 250;

let boardWidth = 700;
let boardHeight = 460;
let context;

//Player size
let playerWidth = 30;
let playerHeight = 44;
let playerX = boardWidth/8;
let playerY = boardHeight;

let playerImg;

let player = {
    x : playerX,
    y : playerY,
    width : playerWidth,
    height : playerHeight
}

let blockArray = [];

let block1Width = 34;
let block2Width = 69;
let block3Width = 102;

let blockHeight = 70;
let blockX = boardWidth;
let blockY = boardHeight - blockHeight;

let block1Img;
let block2Img;
let block3Img;


//Game Physics
let velocityX = -2; //obstacle moving left, speed
let velocityY = 0; //player jump speed
let gravity = 0.1;

let jumpHeld = false;

let gameOver = false;
let score = 0;

let lastTime = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //load player image
    playerImg = new Image();
    playerImg.src = "./player.png";
    playerImg.onload = function() {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    block1Img = new Image();
    block1Img.src = "./block.png";

    block2Img = new Image();
    block2Img.src = "./block.png";

    block3Img = new Image();
    block3Img.src = "./block.png";

    this.requestAnimationFrame(update);
    // this.setInterval(placeObstacles, 1500); //every 1.5 sec
    setInterval(placeBlock, 500);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
}

function update(timestamp) {
    requestAnimationFrame(update)
    if (gameOver) {
        return;
    }

    if (!lastTime) lastTime = timestamp;
    let deltaTime = (timestamp - lastTime) / 1000; // seconds
    lastTime = timestamp;

    score += deltaTime; // +1 per second

    context.clearRect(0, 0, board.width, board.height)

    //PLayer

    if (jumpHeld) {
    velocityY -= 0.4; // smooth continuous lift
    }

    velocityY += gravity;
    player.y += velocityY;

    velocityY = Math.max(velocityY, -4);

    // top boundary
    if (player.y < 0) {
        player.y = 0;
        velocityY = 0;
    }

    // bottom boundary
    if (player.y + player.height > board.height) {
        player.y = board.height - player.height;
        velocityY = 0;
    }
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);
 
    //block
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        block.x += velocityX;
        context.drawImage(block.img, block.x, block.y, block.width, block.height);

        if (detectCollision(player, block)) {
            gameOver = true;
            playerImg.src = "./player.png";
            playerImg.onload = function() {
                context.drawImage(playerImg, player.x, player.y, player.width, player.height);
            }
        }
    }

    //clear obstacle
    // while (obstacleArray.length > 0 && obstacleArray[0].x < -obstacleWidth) {
    //     obstacleArray.shift(); //removes first element from array
    // }

    // clear off-screen blocks
    while (
        blockArray.length > 0 &&
        blockArray[0].x + blockArray[0].width < 0
    ) {
        blockArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.font = "20px Courier New";
    context.fillText("Score: " + Math.floor(score), 15, 30);

    if(gameOver) {
        context.fillText("GAME OVER", 15, 60);
    }
}

function placeBlock() {
    if (gameOver) {
        return;
    }

    //place block
    let block = {
        img : null,
        x : blockX,
        y : null,
        width : null,
        height: blockHeight
    }

    let placeBlockChance = Math.random(); //0 - 0.9999...

    if (placeBlockChance > .90) { //10% you get block3
        block.img = block3Img;
        block.width = block3Width;
        block.y = Math.random() * (boardHeight - blockHeight);
        blockArray.push(block);
    }
    else if (placeBlockChance > .70) { //30% you get block2
        block.img = block2Img;
        block.width = block2Width;
        block.y =  Math.random() * (boardHeight - blockHeight);
        blockArray.push(block);
    }
    else if (placeBlockChance > .50) { //50% you get block1
        block.img = block1Img;
        block.width = block1Width;
        block.y = blockY;
        blockArray.push(block);
    }

    if (blockArray.length > 5) {
        blockArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}

function handleKeyDown(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        jumpHeld = true;
    }

    if (gameOver) {
        player.y = playerY;
        blockArray = [];
        score = 0;
        lastTime = 0;
        gameOver = false;
    }
}

function handleKeyUp(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        jumpHeld = false;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}