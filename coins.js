export class Coin {
    constructor(game){
        this.game = game;
        this.width = 40;
        this.height = 40;

        this.x = this.game.width + Math.random() * 200;
        this.y = this.game.height - this.height - this.game.groundMargin - Math.random() * 150;

        this.speedX = this.game.speed;
        this.markForDeletion = false;

        this.image = document.getElementById('coin'); // Add this image in HTML
    }

    update(deltaTime){
        this.x -= this.speedX;

        // Off screen
        if (this.x + this.width < 0) {
            this.markForDeletion = true;
        }

        // Collision with player
        if (this.checkCollision(this.game.player)) {
            this.game.addCoin();
            this.markForDeletion = true;
        }
    }

    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    checkCollision(player){
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}