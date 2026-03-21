import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { BackgroundForest, BackgroundCave, BackgroundVolcano, BackgroundSky } from "./background.js";
import { Fly, HangingStalactite, ClimbingSpider, FireSpirit, Ghost, meteor, Tulip, Spidercrawler, AngryCloud, Raven, Boulder, Golem, Slime, Dragon, FallingBranch, lava_shark, Devil, FireBall, Wolf, Tornado, Stalactite } from "./enemies.js";
import { Coin } from "./coins.js";
import { UI } from "./UI.js";
import { Stick, Web, Ruby, Scale } from "./questItems.js";
import { PowerUp } from "./powerUp.js";

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

            // =========================
            // Speed Difficulty
            // =========================            
            this.baseSpeed = 2;
            this.speed = this.baseSpeed;

            this.difficultyMultiplier = 1;
            this.difficultyIncreaseRate = 0.00001; // tweak this
            this.maxDifficultyMultiplier = 3;


            this.playerStillTimer = 0;
            this.playerStillThreshold = 500;
            this.lastPlayerX = 0;

            if (world === "cave") {
                this.background = new BackgroundCave(this);
            } else if(world === "volcano") {
                this.background = new BackgroundVolcano(this);
            } else if(world === "sky") {
                this.background = new BackgroundSky(this);
            } else {
                this.background = new BackgroundForest(this);
            }

            this.world = world;
            this.floorHeight = 50;

            // Coin
            this.coins = [];
            this.coinTimer = 0;
            this.coinInterval = 3000;

            this.powerUps = [];
            this.powerUpTimer = 0;
            this.powerUpInterval = 10000; // check every 10 sec
            this.powerUpChance = 0.10;   // 10% chance to spawn

            this.powerUpMessage = "";
            this.powerUpMessageTimer = 0;

            // =========================
            // Quest Item
            // =========================   
            this.questItems = [];
            this.questItemTimer = 0;
            this.questItemInterval = 10000;
            this.questItemAmount = 5;
            this.questComplete = false;

            this.questItemsCollected = 0;
            this.questItemImage = null;

            if(this.world === "forest") this.questItemImage = document.getElementById('stick');
            else if(this.world === "cave") this.questItemImage = document.getElementById('web');
            else if(this.world === "volcano") this.questItemImage = document.getElementById('ruby');
            else if(this.world === "sky") this.questItemImage = document.getElementById('scale');

            this.coinCount = parseInt(localStorage.getItem("coins")) || 0;

            // =========================
            // APPLY SHOP UPGRADES
            // =========================

            // Health Up
            const hasHealthUp = localStorage.getItem("healthUp") === "owned";
            if (hasHealthUp) {
                this.lives += 1;
            }

            // Starter Shield
            const hasShield = localStorage.getItem("upgrade_shield") === "owned";
            this.startWithShield = hasShield;

            this.lives = 5;

            this.player = new Player(this);
            this.input = new InputHandler(this);

            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1500;

            this.collisions = [];
            this.debug = false;
            this.ui = new UI(this);

            this.gameStarted = false;
            this.gameOver = false;
            this.restartPressed = false;
            this.win = false;


            this.time = 0;

            // =========================
            // WORLD EVENT SYSTEM
            // =========================
            this.eventActive = false;
            this.eventName = "";
            this.eventCheckTimer = 0;
            this.eventCheckInterval = 20000; // every 30 sec
            this.eventTimer = 0;
            this.eventDuration = 10000; // 10 sec

            // separate spawn rate for event enemies
            this.eventEnemyTimer = 0;
            this.eventEnemyInterval = 1000; // faster spawning during events

            // event announcement
            this.eventAnnouncement = "";
            this.eventAnnouncementTimer = 0;
            this.eventAnnouncementDuration = 4000;



        }

        update(deltaTime){
            if (this.input.keys.includes("Escape") && (game.gameOver || !this.gameStarted)) {
                window.location.href = "level-selection.html";
            }

            if (this.input.keys.includes(' ') && this.gameOver && !this.restartPressed) {
                this.restartPressed = true;

                if (this.win) {
                    this.continueGame();
                } else {
                    this.restartGame();
                }
            }

            if (!this.input.keys.includes(' ')){
                this.restartPressed = false;
            }

            if (this.gameStarted && !game.gameOver) this.time += deltaTime; 

            const movementKeys = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','d','w','s'];

            if (!this.gameStarted) {
                if (this.input.keys.some(key => movementKeys.includes(key))) {
                    this.gameStarted = true;
                }
            }

            if (this.questItemsCollected == this.questItemAmount && !this.win) {
                this.gameOver = true;
                this.win = true;
                this.unlockNextWorld();
            }

            this.baseSpeed = this.gameStarted ? 2 : 0;

            // Increase difficulty gradually
            this.difficultyMultiplier += deltaTime * this.difficultyIncreaseRate;

            // Clamp it so it doesn't go infinite
            if (this.difficultyMultiplier > this.maxDifficultyMultiplier) {
                this.difficultyMultiplier = this.maxDifficultyMultiplier;
            }

            // Apply to game speed
            this.speed = this.baseSpeed * this.difficultyMultiplier;      

            // Coin spawning
            if(!game.gameOver){
                if(this.coinTimer > this.coinInterval){
                    this.coins.push(new Coin(this));
                    this.coinTimer = 0;
                } else {
                    this.coinTimer += deltaTime;
                }
            }

            this.powerUps.forEach((powerUp, index) => {
                powerUp.update(deltaTime);
                if (powerUp.markForDeletion) this.powerUps.splice(index, 1);
            });

            // Power-up spawning
            if (!this.gameOver) {
                if (this.powerUpTimer > this.powerUpInterval) {
                    if (Math.random() < this.powerUpChance) {
                        this.addPowerUp();
                    }
                    this.powerUpTimer = 0;
                } else {
                    this.powerUpTimer += deltaTime;
                }
            }

            if (this.powerUpMessageTimer > 0) {
                this.powerUpMessageTimer -= deltaTime;
                if (this.powerUpMessageTimer <= 0) {
                    this.powerUpMessageTimer = 0;
                    this.powerUpMessage = "";
                }
            }

            this.coins.forEach(coin => {
                coin.update(deltaTime);
                if(coin.markForDeletion){
                    this.coins.splice(this.coins.indexOf(coin), 1);
                }
            });

            if ((this.questItemsCollected >= this.questItemAmount && !this.questComplete) || this.gameOver) {
                this.questComplete = true;
                this.questItems.forEach(item => item.markForDeletion = true);
                console.log("Quest Complete! All quest items removed.");
            }

            if(this.questItemsCollected < this.questItemAmount){
                if(this.questItemTimer > this.questItemInterval){
                    this.addQuestItem();
                    this.questItemTimer = 0;
                } else {
                    this.questItemTimer += deltaTime;
                }
            }

            if (this.gameOver) {
                this.enemies.forEach(enemy => enemy.markForDeletion = true);
                this.coins.forEach(coin => coin.markForDeletion = true);
                this.powerUps.forEach(powerUp => powerUp.markForDeletion = true);
            }

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

            // =========================
            // EVENT LOGIC
            // =========================
            if (this.gameStarted && !this.gameOver) {
                if (!this.eventActive) {
                    this.eventCheckTimer += deltaTime;

                    if (this.eventCheckTimer >= this.eventCheckInterval) {
                        this.eventCheckTimer = 0;

                        if (Math.random() < 0.5) {
                            this.startWorldEvent();
                        }
                    }
                } else {
                    this.eventTimer += deltaTime;

                    if (this.eventTimer >= this.eventDuration) {
                        this.stopWorldEvent();
                    }
                }
            }

            // Handles Enemies
            if (!this.eventActive) {
                if(this.enemyTimer > this.enemyInterval){
                    this.addEnemy();
                    this.enemyTimer = 0;
                } else {
                    this.enemyTimer += deltaTime;
                }
            } else {
                if(this.eventEnemyTimer > this.eventEnemyInterval){
                    this.addEventEnemy();
                    this.eventEnemyTimer = 0;
                } else {
                    this.eventEnemyTimer += deltaTime;
                }
            }

            // update event announcement timer
            if (this.eventAnnouncementTimer > 0) {
                this.eventAnnouncementTimer -= deltaTime;
                if (this.eventAnnouncementTimer <= 0) {
                    this.eventAnnouncementTimer = 0;
                    this.eventAnnouncement = "";
                }
            }

            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if(enemy.markForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            });

            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
                if (collision.markForDeletion) this.collisions.splice(index, 1);
            });
        }

        draw(context){
            this.background.draw(context);
            this.player.draw(context);

            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });

            this.coins.forEach(coin => {
                coin.draw(context);
            });

            this.collisions.forEach(collisions => {
                collisions.draw(context);
            });

            this.questItems.forEach(item => item.draw(context));

            this.powerUps.forEach(powerUp => {
                powerUp.draw(context);
            });

            this.ui.draw(context);
        }

        addQuestItem(){
            if(this.questItemsCollected >= this.questItemAmount) return;

            if(this.world === "forest"){
                this.questItems.push(new Stick(this));
            } else if(this.world === "cave"){
                this.questItems.push(new Web(this));
            } else if(this.world === "volcano"){
                this.questItems.push(new Ruby(this));
            } else if(this.world === "sky"){
                this.questItems.push(new Scale(this));
            }
        }

        addQuest(){
            this.questItemsCollected++;
        }

        startWorldEvent(){
            this.eventActive = true;
            this.eventTimer = 0;
            this.eventEnemyTimer = 0;

            if (this.world === "forest") {
                this.eventName = "Slime Rush";
            } else if (this.world === "cave") {
                this.eventName = "Spider Infestation";
            } else if (this.world === "volcano") {
                this.eventName = "Fire Rain";
            } else if (this.world === "sky") {
                this.eventName = "Storm Surge";
            }

            // show announcement for 4 seconds
            this.eventAnnouncement = this.eventName + "!";
            this.eventAnnouncementTimer = this.eventAnnouncementDuration;

            console.log("Event started:", this.eventName);
        }

        stopWorldEvent(){
            this.eventActive = false;
            this.eventName = "";
            this.eventTimer = 0;
            this.eventEnemyTimer = 0;
            this.enemyTimer = 0; // so normal spawn resumes cleanly

            console.log("Event ended");
        }

        addEventEnemy(){
            if (this.speed <= 0 || this.gameOver) return;

            if (this.world === "forest") {
                // only slimes
                this.enemies.push(new Slime(this));
            }

            else if (this.world === "cave") {
                // spider infestation
                this.enemies.push(new ClimbingSpider(this));
                this.enemies.push(new Spidercrawler(this));

                // optional extra danger
                if (Math.random() < 0.3) this.enemies.push(new HangingStalactite(this));
            }

            else if (this.world === "volcano") {
                // numerous fireballs
                this.enemies.push(new FireBall(this));
                this.enemies.push(new FireBall(this));
                if (Math.random() > 0.4) this.enemies.push(new FireBall(this));
                if (Math.random() < 0.4) this.enemies.push(new FireBall(this));
                if (Math.random() < 0.2) this.enemies.push(new FireBall(this));
            }

            else if (this.world === "sky") {
                // angry cloud + tornado spawns
                this.enemies.push(new AngryCloud(this));
                if (Math.random() < 0.6) this.enemies.push(new AngryCloud(this));
                if (Math.random() < 0.6) this.enemies.push(new Tornado(this));
            }
        }

        addEnemy(){
            if (this.speed <= 0 || game.gameOver || this.eventActive) return;

            if(this.world === "forest") {
                if (Math.random() < 0.4){
                    this.enemies.push(new Tulip(this));
                } else if (Math.random() < 0.6) {
                    this.enemies.push(new Slime(this));
                }

                if (this.playerStillTimer > this.playerStillThreshold){
                    this.enemies.push(new FallingBranch(this));
                    this.playerStillTimer = 0;
                }

                if (Math.random() < 0.1) this.enemies.push(new Wolf(this));
            }

            if(this.world === "cave") {
                if (Math.random() < 0.2) this.enemies.push(new Ghost(this));
                if (Math.random() < 0.3) this.enemies.push(new ClimbingSpider(this));
                if (Math.random() < 0.3) this.enemies.push(new Spidercrawler(this));
                if (Math.random() < 0.1) this.enemies.push(new Boulder(this));
                if (Math.random() < 0.3) this.enemies.push(new HangingStalactite(this));
                if (this.playerStillTimer > this.playerStillThreshold){
                    this.enemies.push(new Stalactite(this));
                    this.playerStillTimer = 0;
                }
            }

            if(this.world === "volcano") {
                if (Math.random() < 0.3) this.enemies.push(new FireSpirit(this));
                if (Math.random() < 0.5) this.enemies.push(new lava_shark(this));
                else if (Math.random() > 0.3) this.enemies.push(new Devil(this));
                if (Math.random() < 0.3) this.enemies.push(new FireBall(this));
            }

            if(this.world === "sky") {
                if (Math.random() < 0.9) this.enemies.push(new Raven(this));
                if (Math.random() < 0.3) this.enemies.push(new meteor(this));
                if (Math.random() < 0.3) this.enemies.push(new AngryCloud(this));
                if (Math.random() < 0.3) this.enemies.push(new Dragon(this));
                if (Math.random() < 0.1) this.enemies.push(new Tornado(this));
            }

            console.log(this.enemies);
        }

        unlockNextWorld() {
            const progression = {
                forest: "cave",
                cave: "volcano",
                volcano: "sky",
                sky: "sky"
            };

            const currentHighest = localStorage.getItem("highestUnlockedWorld") || "forest";
            const order = ["forest", "cave", "volcano", "sky"];

            const currentHighestIndex = order.indexOf(currentHighest);
            const nextWorld = progression[this.world];
            const nextWorldIndex = order.indexOf(nextWorld);

            if (nextWorldIndex > currentHighestIndex) {
                localStorage.setItem("highestUnlockedWorld", nextWorld);
            }
        }

        continueGame(){
            this.gameOver = false;
            this.win = false;

            this.enemies = [];
            this.coins = [];

            this.enemyTimer = 0;
            this.coinTimer = 0;

            // reset event state too
            this.eventActive = false;
            this.eventName = "";
            this.eventTimer = 0;
            this.eventEnemyTimer = 0;
            this.eventCheckTimer = 0;

            this.eventAnnouncement = "";
            this.eventAnnouncementTimer = 0;

            this.powerUps = [];
            this.powerUpTimer = 0;
            this.powerUpMessage = "";
            this.powerUpMessageTimer = 0;
        }

        restartGame(){
            this.gameOver = false;
            this.win = false;

            this.startWithShield = localStorage.getItem("upgrade_shield") === "owned";

            this.lives = 5;
            if (localStorage.getItem("healthUp") === "owned") {
                this.lives += 1;
            }

            this.player = new Player(this);

            this.time = 0;

            this.questItemsCollected = 0;
            this.questComplete = false;

            this.enemies = [];
            this.coins = [];
            this.questItems = [];
            this.collisions = [];

            this.enemyTimer = 0;
            this.coinTimer = 0;
            this.questItemTimer = 0;

            // reset event state too
            this.eventActive = false;
            this.eventName = "";
            this.eventTimer = 0;
            this.eventEnemyTimer = 0;
            this.eventCheckTimer = 0;

            this.eventAnnouncement = "";
            this.eventAnnouncementTimer = 0;

            this.powerUps = [];
            this.powerUpTimer = 0;
            this.powerUpMessage = "";
            this.powerUpMessageTimer = 0;

            this.gameStarted = false;
        }

        addCoin(){
            this.coinCount++;
            localStorage.setItem("coins", this.coinCount);
        }

        addPowerUp(){
            const types = ["bomb", "potion", "shield"];
            const randomType = types[Math.floor(Math.random() * types.length)];
            this.powerUps.push(new PowerUp(this, randomType));
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