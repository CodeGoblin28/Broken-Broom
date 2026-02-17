export class Player{
    constructor(game){
        this.game = game;
        this.width = 128;
        this.height = 128;

        this.frameWidth = 128;
        this.frameHeight = 128;

        this.sprite = {
            x: 45,
            y: 35,
            width: 40,
            height: 45
        };

        this.scale = 3;

        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;

        this.vy = 0;

        this.speed = 0;
        this.maxSpeed = 300;
        this.gravity = 2000;
        this.jumpForce = 1000;


        this.image = document.getElementById('player');
        
        this.frameX = 0;
        this.frameY = 2;

    }
    update(input, deltaTime){
        const dt = deltaTime * 0.001; // convert ms → seconds

        //Horizontal Movement
        if(input.includes('ArrowRight')) this.speed = this.maxSpeed;
        else if(input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
        else this.speed = 0;

        this.x += this.speed * dt;

        if (this.x < 0 ) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;



        //Vertical Movement
        if(input.includes('ArrowUp') && this.onGround()) this.vy = -this.jumpForce;

        this.y += this.vy * dt;

        if (!this.onGround()){ 
            this.vy += this.gravity * dt;
        }
        else {
            this.vy = 0;
            this.y = this.game.height - this.height - this.game.groundMargin;

        }

        
    }
    draw(context){
        // context.fillStyle = 'red';
        // context.fillRect(this.x, this.y, this.width, this.height);
        // context.drawImage(this.image, 53, 48, this.width, this.height, this.x, this.y, this.width * 3, this.height * 3)
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
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
}