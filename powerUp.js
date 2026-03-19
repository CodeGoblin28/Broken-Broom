export class PowerUp {
    constructor(game, type){
        this.game = game;
        this.type = type;

        this.width = 64;
        this.height = 64;

        this.x = this.game.width + Math.random() * this.game.width * 0.3;

        // spawn position depends on world
        if (this.game.world === "sky" || this.game.world === "volcano") {
            this.y = Math.random() * (this.game.height - this.height - 100);
        } else {
            this.y = this.game.height - this.height - this.game.groundMargin - 50;
        }

        this.speedX = .8;
        this.markForDeletion = false;

        this.image = document.getElementById(type);

        this.hitbox = {
            offsetX: 0,
            offsetY: 0,
            width: this.width,
            height: this.height
        };
    }

    update(deltaTime){
        this.x -= this.speedX * this.game.speed;

        if (this.x + this.width < 0) {
            this.markForDeletion = true;
        }

        this.checkCollision();
    }

    draw(context){
        if (this.game.debug) {
            context.strokeStyle = "cyan";
            context.strokeRect(this.x, this.y, this.width, this.height);
        }

        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    checkCollision(){
        const player = this.game.player;

        const playerLeft   = player.x + player.hitbox.offsetX;
        const playerRight  = playerLeft + player.hitbox.width;
        const playerTop    = player.y + player.hitbox.offsetY;
        const playerBottom = playerTop + player.hitbox.height;

        const powerLeft   = this.x + this.hitbox.offsetX;
        const powerRight  = powerLeft + this.hitbox.width;
        const powerTop    = this.y + this.hitbox.offsetY;
        const powerBottom = powerTop + this.hitbox.height;

        if (
            playerLeft < powerRight &&
            playerRight > powerLeft &&
            playerTop < powerBottom &&
            playerBottom > powerTop
        ) {
            this.applyEffect();
            this.markForDeletion = true;
        }
    }

    applyEffect(){
        if (this.type === "bomb") {
            this.game.enemies.forEach(enemy => enemy.markForDeletion = true);
            this.game.powerUpMessage = "BOOOM! All enemies cleared!";
        } 
        else if (this.type === "potion") {
            this.game.lives++;
            this.game.powerUpMessage = "Potion! +1 Health!";
        } 
        else if (this.type === "shield") {
            this.game.player.shield += 1;
            this.game.powerUpMessage = "Shield gained!";
        }

        this.game.powerUpMessageTimer = 1500;
    }
}