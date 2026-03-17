class CollisionAnimation{
    constructor(game, x, y){
        this.game = game;
        this.image = document.GetElementById('collisionAnimation');
        this.spriteWidth = 100;
        this.spriteHeight = 90
        this.sizeModifier = Math.random() + 0.5;
        this.width = this.spriteWidth * this.sizeModifier;
        this.width = this.spriteHeight * this.sizeModifier;
        this.x = x - this.width * 0.5;
        this.y = y - this.width * 0.5;
        this.frameX = 0;
        this.maxFrame = 4;
        this.markForDeletion = false;
    }
    draw(){
        context.drawImage(this.image, this.frameX * this.spriteWidth, 0 , this.spriteWidth, this.spriteWidth)
    
    }
}