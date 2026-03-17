class Objective {
    constructor(game, imageId, x, y, width = 60, height = 60, speedMultiplier = 0.8){
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedMultiplier = 0.8;
        this.markForDeletion = false;

        // Spawn position
        this.x = x !== undefined ? x : this.game.width + Math.random() * this.game.width * 0.5;
        this.y = y !== undefined ? y : Math.random() * (this.game.height - this.height - this.game.groundMargin);

        // Image
        this.image = document.getElementById(imageId);

        // Speed relative to game
        this.speedX = this.game.speed * this.speedMultiplier;
    }

    update(deltaTime){
        this.speedX = this.game.speed * this.speedMultiplier; // follow game speed
        this.x -= this.speedX;

        // Off screen
        if (this.x + this.width < 0) this.markForDeletion = true;

        // Collision with player
        if (this.checkCollision(this.game.player)) {
            if(this.game.addQuest) this.game.addQuest(); // call generic quest function
            this.markForDeletion = true;
        }
    }

    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    checkCollision(player){
        const playerLeft   = player.x + player.hitbox.offsetX;
        const playerRight  = playerLeft + player.hitbox.width;
        const playerTop    = player.y + player.hitbox.offsetY;
        const playerBottom = playerTop + player.hitbox.height;

        const objLeft   = this.x;
        const objRight  = this.x + this.width;
        const objTop    = this.y;
        const objBottom = this.y + this.height;

        return (
            playerLeft < objRight &&
            playerRight > objLeft &&
            playerTop < objBottom &&
            playerBottom > objTop
        );
    }
}

export class Stick extends Objective {
    constructor(game){
        const fixedY = game.height - 150 - game.groundMargin;
        super(game, 'stick', undefined, fixedY, 60, 60, 1); // imageId='bone', speedMultiplier=1
    }
}

export class Web extends Objective {
    constructor(game){
        const fixedY = game.height - 150 - game.groundMargin;
        super(game, 'web', undefined, fixedY, 60, 60, 1); // imageId='bone', speedMultiplier=1
    }
}

export class Ruby extends Objective {
    constructor(game){
        const fixedY = game.height - 150 - game.groundMargin;
        super(game, 'ruby', undefined, fixedY, 60, 60, 1); // imageId='bone', speedMultiplier=1
    }
}