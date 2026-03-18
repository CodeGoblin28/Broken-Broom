import {Idle, Running, Jumping, Falling, Flying, TakeOff} from './playerState.js';
import { CollisionAnimation } from "./collisionAnimation.js";


export class Player{
    constructor(game){
        this.game = game;
        this.width = 128;
        this.height = 128;

        this.frameWidth = 128;
        this.frameHeight = 128;

        // HITBOX (configurable)
        this.hitbox = {
            offsetX: 40,
            offsetY: 30,
            width: 60,
            height: 90
        };

        this.sprite = {
            x: 45,
            y: 37,
            width: 43,
            height: 45
        };

        this.scale = 3;

        if (this.game.world === "sky" || this.game.world === "volcano") {
            this.x = 50;
            this.y = this.game.height / 2 - this.height / 2;
        } else {
            this.x = 0;
            this.y = this.game.height - this.height - this.game.groundMargin          
        }

        this.vy = 0;

        this.speed = 0;
        this.maxSpeed = 300;
        this.gravity = 2000;

        this.jumpForce = 1000;


        // SKIN SYSTEM
        const equippedSkin = localStorage.getItem("equippedSkin") || "default";

        const skinMap = {
            default: "player",
            blue: "player-blue",
            red: "player-red",
            pink: "player-pink"
        };

        const skinId = skinMap[equippedSkin] || "player";

        this.image = document.getElementById(skinId);
        

        this.maxFrame;
        this.frameX = 0;
        this.frameY = 2;

        this.fps = 10;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;

        this.states = [
            new Idle(this), 
            new Running(this), 
            new Jumping(this), 
            new Falling(this), 
            new Flying(this),
            new TakeOff(this)
        ];

        this.currentState = this.states[0];
        this.currentState.enter();

        this.dead = false;

        this.lavaBounceForce = 900;
        this.invulnerableTimer = 0;
        this.invulnerableDuration = 500;
    }
    update(input, deltaTime){
        if (this.dead) return;

        // Force flying state in sky/volcano world
        if (this.game.world === "sky" || this.game.world === "volcano" ) {
            if (this.currentState !== this.states[4]) {
                this.setState(4); // FLYING
            }
        }

        if(!this.game.gameStarted){
            this.gravity = 0;
        } else {
            this.gravity = 2000;
        }

        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= deltaTime;
        }

        this.currentState.handleInput(input);

        const dt = deltaTime * 0.001;

        // Horizontal Movement
        if(input.includes('ArrowRight') || input.includes('d')) this.speed = this.maxSpeed;
        else if(input.includes('ArrowLeft') || input.includes('a')) this.speed = -this.maxSpeed;
        else this.speed = 0;

        this.x += this.speed * dt;

        if (this.x < 0 ) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        this.y += this.vy * dt;

        // Top boundary
        if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
        }

        // Bottom boundary
        if (this.game.world === "volcano") {
            this.handleLavaFloor();
        } else {
            if (this.y > this.game.height - this.height) {
                this.y = this.game.height - this.height;
                this.vy = 0;
            }
        }

        // Gravity
        if (this.game.world !== "sky") {
            if (this.game.world !== "volcano") {
                if (!this.onGround()){ 
                    this.vy += this.gravity * dt;
                } else {
                    this.vy = 0;
                    this.y = this.game.height - this.height - this.game.groundMargin;
                }
            } else {
                this.vy += this.gravity * dt;
            }
        }

        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;

            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
        } else {
            this.frameTimer += deltaTime;
        }

        this.checkCollision();
    }
    draw(context){
        if (this.dead) return;

        if (this.game.debug) {
            context.strokeStyle = "lime"; 
            context.strokeRect(this.x, this.y, this.width, this.height);

            context.strokeStyle = "yellow";
            context.strokeRect(
                this.x + this.hitbox.offsetX,
                this.y + this.hitbox.offsetY,
                this.hitbox.width,
                this.hitbox.height
            );
        
        
            }
        context.drawImage(
            this.image,
            this.frameX * this.frameWidth + this.sprite.x,
            this.frameY * this.frameHeight + this.sprite.y,
            this.sprite.width,
            this.sprite.height,
            this.x,
            this.y,
            this.sprite.width * this.scale,
            this.sprite.height * this.scale
        )
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state){
        this.currentState = this.states[state];
        this.currentState.enter();
    }

    handleLavaFloor(){
        if (this.dead) return;

        const lavaY = this.game.height - this.height - this.game.groundMargin;

        if (this.y >= lavaY) {
            this.y = lavaY;
            this.vy = -this.lavaBounceForce;

            // If player already won, only bounce and do not lose life
            if (this.game.win) return;

            // Prevent losing multiple lives instantly
            if (this.invulnerableTimer <= 0) {
                this.loseLife(true); // true = play player collision effect
                this.invulnerableTimer = this.invulnerableDuration;
            }
        }
    }

    loseLife(playPlayerEffect = false){
        if (this.dead) return;

        this.game.lives--;

        if (playPlayerEffect) {
            this.game.collisions.push(
                new CollisionAnimation(
                    this.game,
                    this.x + this.width * 0.5,
                    this.y + this.height * 0.5
                )
            );
        }

        if (this.game.lives <= 0) {
            this.game.lives = 0;
            this.game.gameOver = true;

            // Only play death effect if it wasn't already played
            if (!playPlayerEffect) {
                this.game.collisions.push(
                    new CollisionAnimation(
                        this.game,
                        this.x + this.width * 0.5,
                        this.y + this.height * 0.5
                    )
                );
            }

            this.dead = true;
        }
    }
    
    checkCollision(){
        if (this.dead) return;

        this.game.enemies.forEach(enemy => {
            const playerLeft   = this.x + this.hitbox.offsetX;
            const playerRight  = playerLeft + this.hitbox.width;
            const playerTop    = this.y + this.hitbox.offsetY;
            const playerBottom = playerTop + this.hitbox.height;

            const enemyLeft   = enemy.x + enemy.hitbox.offsetX;
            const enemyRight  = enemyLeft + enemy.hitbox.width;
            const enemyTop    = enemy.y + enemy.hitbox.offsetY;
            const enemyBottom = enemyTop + enemy.hitbox.height;

            if (
                playerLeft < enemyRight &&
                playerRight > enemyLeft &&
                playerTop < enemyBottom &&
                playerBottom > enemyTop
            ) {
                enemy.markForDeletion = true;

                // Enemy effect only
                this.game.collisions.push(
                    new CollisionAnimation(
                        this.game,
                        enemy.x + enemy.width * 0.5,
                        enemy.y + enemy.height * 0.5
                    )
                );

                if (this.invulnerableTimer <= 0) {
                    // Only play player effect if this hit will kill the player
                    const willDie = this.game.lives <= 1;
                    this.loseLife(willDie);
                    this.invulnerableTimer = this.invulnerableDuration;
                }
            }
        });
    }
}