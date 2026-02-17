import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { BackgroundForest, BackgroundCave, BackgroundVolcano } from "./background.js";
import { Fly, FireSpirit, ClimbingEnemy, GroundEnemy } from "./enemies.js";
import { Coin } from "./coins.js";

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // Get selected world from URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedWorld = urlParams.get("world");

    class Game {
        constructor(width, height, world){
            this.width = width;
            this.height = height;
            this.groundMargin = 50;
            this.speed = 2;

            // Choose background based on world
            if (world === "cave") {
                this.background = new BackgroundCave(this);
            } else if(world === "volcano") {
                // Default = forest
                this.background = new BackgroundVolcano(this);
            } else {
                // Default = forest
                this.background = new BackgroundForest(this);
            }

            // Coin
            this.coins = [];
            this.coinTimer = 0;
            this.coinInterval = 3000; // spawn every 3 seconds

            // Load saved coins
            this.coinCount = parseInt(localStorage.getItem("coins")) || 0;

            this.player = new Player(this);
            this.input = new InputHandler(this);

            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 2000;

            this.debug = true;
        }
        update(deltaTime){
            // If Escape is pressed → go back to index
            if (this.input.keys.includes("Escape")) {
                window.location.href = "index.html";
            }

            // Coin spawning
            if(this.coinTimer > this.coinInterval){
                this.coins.push(new Coin(this));
                this.coinTimer = 0;
            } else {
                this.coinTimer += deltaTime;
            }

            this.coins.forEach(coin => {
                coin.update(deltaTime);
                if(coin.markForDeletion){
                    this.coins.splice(this.coins.indexOf(coin), 1);
                }
            });


            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            // Handles Enemies
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if(enemy.markForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            })
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            })

            this.coins.forEach(coin => {
                coin.draw(context);
            });

            // Draw coin counter UI
            context.fillStyle = "white";
            context.font = "30px Arial";
            context.fillText("Coins: " + this.coinCount, 20, 50);
        }
        addEnemy(){
            if (this.speed > 0 && Math.random() < 0.3) this.enemies.push(new GroundEnemy(this));
            this.enemies.push(new Fly(this));
            this.enemies.push(new FireSpirit(this));
            console.log(this.enemies);
        }
        addCoin(){
            this.coinCount++;
            localStorage.setItem("coins", this.coinCount);
        }
    }

    const game = new Game(canvas.width, canvas.height, selectedWorld);
    console.log(game);

    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});