export class Coin {
    constructor(game){
        this.game = game;
        this.width = 50;
        this.height = 50;

        this.x = this.game.width + Math.random() * 200;
        // this.y = this.game.height - this.height - this.game.groundMargin - Math.random() * 500;
        if (this.game.world === "forest") {
            // Ground only
            this.y = this.game.height - this.height - this.game.groundMargin - 50;
        } else {
            // Random height like coins
            this.y = this.game.height - this.height - this.game.groundMargin - Math.random() * 500;
        }


        this.speedX = this.game.speed * 0.8;
        this.markForDeletion = false;

        this.image = document.getElementById('coin');
    }

    update(deltaTime){
        const dt = deltaTime * 0.001;
        const fpsScale = 150;

        this.x -= this.speedX * fpsScale * dt;

        if (this.x + this.width < 0) {
            this.markForDeletion = true;
        }

        if (this.checkCollision(this.game.player)) {
            this.game.audio.play('coin');
            this.game.addCoin();
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

        const coinLeft   = this.x;
        const coinRight  = this.x + this.width;
        const coinTop    = this.y;
        const coinBottom = this.y + this.height;

        return (
            playerLeft < coinRight &&
            playerRight > coinLeft &&
            playerTop < coinBottom &&
            playerBottom > coinTop
        );
    }
}