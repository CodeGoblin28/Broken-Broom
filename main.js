import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { BackgroundForest, BackgroundCave, BackgroundVolcano, BackgroundSky } from "./background.js";
import { Fly, ClimbingSpider, FireSpirit, Ghost, meteor, Tulip, Spidercrawler, AngryCloud, Raven, Golem, Slime, Dragon, FallingBranch } from "./enemies.js";
import { Coin } from "./coins.js";
import { UI } from "./UI.js";
import { Stick, Web, Ruby } from "./questItems.js";
// import { Boss } from "./boss.js";

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
            this.speed = 0;

            this.playerStillTimer = 0;
            this.playerStillThreshold = 500; // 1.5 seconds
            this.lastPlayerX = 0;

            // Choose background based on world
            if (world === "cave") {
                this.background = new BackgroundCave(this);
            } else if(world === "volcano") {
                // Default = forest
                this.background = new BackgroundVolcano(this);
            } else if(world === "sky") {
                // Default = forest
                this.background = new BackgroundSky(this);
            } else {
                // Default = forest
                this.background = new BackgroundForest(this);
            }

            this.world = world;
            this.floorHeight = 50;

            // Coin
            this.coins = [];
            this.coinTimer = 0;
            this.coinInterval = 3000; // spawn every 3 seconds

            this.questItems = [];
            this.questItemTimer = 0;
            this.questItemInterval = 10000; // spawn every 10 seconds
            this.questItemAmount = 1;
            this.questComplete = false;

            this.questItemsCollected = 0;       // how many quest items collected
            this.questItemImage = null;         // image element of current world's quest item

            // Set the image based on the world
            if(this.world === "forest") this.questItemImage = document.getElementById('stick');
            else if(this.world === "cave") this.questItemImage = document.getElementById('web');
            else if(this.world === "volcano") this.questItemImage = document.getElementById('ruby');

            // Load saved coins
            this.coinCount = parseInt(localStorage.getItem("coins")) || 0;

            this.player = new Player(this);
            this.input = new InputHandler(this);

            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 2000;

            this.debug = false;

            this.ui = new UI(this);

            this.gameStarted = false;

            this.gameOver = true;

            this.damage = false;

        }
        update(deltaTime){
            // If Escape is pressed → go back to index
            if (this.input.keys.includes("Escape")) {
                window.location.href = "index.html";
            }

            const movementKeys = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','d','w','s'];

            if (!this.gameStarted) {
                if (this.input.keys.some(key => movementKeys.includes(key))) {
                    this.gameStarted = true;
                }
            }

            this.speed = this.gameStarted ? 2 : 0;

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

            // Check if quest is complete
            if (this.questItemsCollected >= this.questItemAmount && !this.questComplete) {
                this.questComplete = true;

                // Remove remaining quest items
                this.questItems.forEach(item => item.markForDeletion = true);

                console.log("Quest Complete! All quest items removed.");
            }

            // Spawn quest items only if quest not complete
            if(this.questItemsCollected < this.questItemAmount){
                if(this.questItemTimer > this.questItemInterval){
                    this.addQuestItem();
                    this.questItemTimer = 0;
                } else {
                    this.questItemTimer += deltaTime;
                }
            }

            // Update quest items
            this.questItems.forEach((item, index) => {
                item.update(deltaTime);
                if(item.markForDeletion) this.questItems.splice(index, 1);
            });


            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            // detect if player stopped moving
            if (Math.abs(this.player.x - this.lastPlayerX) < 1) {
                this.playerStillTimer += deltaTime;
            } else {
                this.playerStillTimer = 0;
            }

            this.lastPlayerX = this.player.x;

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

            this.drawFloor(context);

            this.enemies.forEach(enemy => {
                enemy.draw(context);
            })

            this.coins.forEach(coin => {
                coin.draw(context);
            });

            this.questItems.forEach(item => item.draw(context));

            this.ui.draw(context);
        }

        addQuestItem(){
            // Stop spawning if already reached the quest limit
            if(this.questItemsCollected >= this.questItemAmount) return;

            if(this.world === "forest"){
                this.questItems.push(new Stick(this));
            } else if(this.world === "cave"){
                this.questItems.push(new Web(this));
            } else if(this.world === "volcano"){
                this.questItems.push(new Ruby(this));
            }
            // add more worlds/items as needed
        }

        addQuest(){
            this.questItemsCollected++;
        }


        addEnemy(){
            if (this.speed <= 0) return;

            if(this.world === "forest") {
                if (Math.random() < 0.4){
                    this.enemies.push(new Tulip(this));
                } else if (Math.random() < 0.6) this.enemies.push(new Slime(this));

                if (this.playerStillTimer > this.playerStillThreshold){
                    this.enemies.push(new FallingBranch(this));
                    this.playerStillTimer = 0; // reset timer
                }
                // this.enemies.push(new Fly(this));
            }

            if(this.world === "cave") {
                if (Math.random() < 0.3) this.enemies.push(new Ghost(this));
                else if (Math.random() < 0.3) this.enemies.push(new ClimbingSpider(this));
                if (Math.random() < 0.3) this.enemies.push(new Spidercrawler(this));
            }

            if(this.world === "volcano") {
                if (this.speed > 0) this.enemies.push(new FireSpirit(this));
                if (Math.random() < 0.3) this.enemies.push(new Golem(this));
            }

            if(this.world === "sky") {
                if (Math.random() < 0.9) this.enemies.push(new Raven(this));
                if (Math.random() < 0.3) this.enemies.push(new meteor(this));
                if (Math.random() < 0.3) this.enemies.push(new AngryCloud(this));
                if (Math.random() < 0.3) this.enemies.push(new Dragon(this));
            }
            console.log(this.enemies);
        }


        addCoin(){
            this.coinCount++;
            localStorage.setItem("coins", this.coinCount);
        }

        drawFloor(context){
            if (this.world === "sky" || this.world === "forest" || this.world === "cave") return;

            context.save();

            if (this.world === "volcano") {
                context.fillStyle = "#5a0b0b"; // dark red
            } 


            context.fillRect(
                0,
                this.height - this.floorHeight,
                this.width,
                this.floorHeight
            );

            context.restore();
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