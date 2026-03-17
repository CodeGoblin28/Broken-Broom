export class UI {
    constructor(game){
        this.game = game;

        this.fontSize = 30;
        this.fontFamily = "Arial";
        this.color = "white";
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

        // Draw Boss Battle status if active (below quest item display)
        if(this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize * 1.5 + 'px ' + this.fontFamily;
            if(this.game.questItemsCollected == this.game.questItemAmount){
                context.fillText("Quest Items Has Been Collected!!!", this.game.width * .5 , this.game.height * .3 ); 
                context.font = this.fontSize * 1 + 'px ' + this.fontFamily;                
                context.fillText("Press ESC to Return!!!", this.game.width * .5 , this.game.height * .3 + 40 ); 
            }
        }

        context.restore();
    }    
}