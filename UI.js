export class UI {
    constructor(game){
        this.game = game;

        this.fontSize = 30;
        this.fontFamily = "Arial";
        this.color = "white";
        this.livesImage = document.getElementById('life');
    }

    draw(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black';
        context.shadowBlur = 0;

        context.fillStyle = this.color;
        context.font = this.fontSize + "px " + this.fontFamily;
        context.textAlign = "left";

        context.fillText("Coins: " + this.game.coinCount, 20, 50);

        // Quest Item
        if(this.game.questItemImage){
            const imgSize = 30;
            const x = 20;
            const y = 90;

            // Draw quest item image
            context.drawImage(this.game.questItemImage, x, y - imgSize + 5, imgSize, imgSize);

            // Draw collected count
            context.fillText(
                "Collected: " + this.game.questItemsCollected + "/" + this.game.questItemAmount,
                x + imgSize + 10,
                y
            );
        }

        //timer
        if(this.game.world == 'sky'){
            context.font = this.fontSize * .8 + 'px ' + this.fontFamily;   
            context.fillText("Time: " + (this.game.time * 0.001).toFixed(1), 20, 85 );  
        }



        // Lives
        for( let i = 0; i < this.game.lives; i++){
            context.drawImage(this.livesImage, 30 * i + 20, 100, 25, 25);
        }

        // Draw game over screen
        if(this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize * 1.5 + 'px ' + this.fontFamily;
            if(this.game.questItemsCollected == this.game.questItemAmount){
                context.fillText("Quest Items Has Been Collected!!!", this.game.width * .5 , this.game.height * .3 ); 
                context.font = this.fontSize * 1 + 'px ' + this.fontFamily;                
                context.fillText("Press ESC to Return!!! Or SPACE to Continue!!!", this.game.width * .5 , this.game.height * .3 + 40 ); 
            } else {
                context.font = this.fontSize * 1.5 + 'px ' + this.fontFamily;
                context.fillText("Opps!!! You Died", this.game.width * .5 , this.game.height * .3 ); 
                context.font = this.fontSize * 1 + 'px ' + this.fontFamily;                
                context.fillText("Press ESC to Return!!! OR SPACE to Reset!!!", this.game.width * .5 , this.game.height * .3 + 40 );
                if(this.game.world == 'sky'){
                    context.fillText("Time Survived: " + (this.game.time * 0.001).toFixed(1), this.game.width * .5 , this.game.height * .3 + 75);  
                }                                 
            }
        }

        context.restore();
    }    
}