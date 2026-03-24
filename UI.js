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

        // Endless timer OR Quest UI
        if (this.game.isEndless) {
            context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
            context.fillText("Time: " + (this.game.time * 0.001).toFixed(1), 20, 90);

            const bestTime = this.game.bestEndlessTime || 0;
            context.fillText("Best: " + bestTime.toFixed(1), 20, 125);
        }else if(this.game.questItemImage){
            const imgSize = 30;
            const x = 20;
            const y = 90;

            context.drawImage(this.game.questItemImage, x, y - imgSize + 5, imgSize, imgSize);

            context.fillText(
                "Collected: " + this.game.questItemsCollected + "/" + this.game.questItemAmount,
                x + imgSize + 10,
                y
            );
        }

        // Lives
        if (this.game.isEndless){
            for(let i = 0; i < this.game.lives; i++){
                context.drawImage(this.livesImage, 30 * i + 20, 140, 25, 25);
            }
        } else if(this.game.questItemImage){
            for(let i = 0; i < this.game.lives; i++){
                context.drawImage(this.livesImage, 30 * i + 20, 110, 25, 25);
            }            
        }


        // Event announcement
        if(this.game.eventAnnouncementTimer > 0 && this.game.eventAnnouncement){
            context.textAlign = 'center';
            context.font = this.fontSize * 1.2 + 'px ' + this.fontFamily;
            context.fillStyle = 'yellow';
            context.fillText(
                this.game.eventAnnouncement,
                this.game.width * 0.5,
                60
            );

            context.fillStyle = this.color;
            context.textAlign = 'left';
            context.font = this.fontSize + "px " + this.fontFamily;
        }

        // Shield count
        if (this.game.isEndless){
            if (this.game.player.shield > 0) {
                context.fillText("Shield: " + this.game.player.shield, 20, 190);
            }
        } else if(this.game.questItemImage){
            if (this.game.player.shield > 0) {
                context.fillText("Shield: " + this.game.player.shield, 20, 170);
            }        
        }

        // Power-up message
        if (this.game.powerUpMessageTimer > 0 && this.game.powerUpMessage) {
            context.textAlign = 'center';
            context.font = this.fontSize + 'px ' + this.fontFamily;
            context.fillStyle = 'cyan';
            context.fillText(
                this.game.powerUpMessage,
                this.game.width * 0.5,
                120
            );

            context.fillStyle = this.color;
            context.textAlign = 'left';
            context.font = this.fontSize + "px " + this.fontFamily;
        }

        // Game over screen
        if(this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize * 1.5 + 'px ' + this.fontFamily;

            if (this.game.isEndless) {
                const survived = (this.game.time * 0.001).toFixed(1);
                const best = (this.game.bestEndlessTime || 0).toFixed(1);

                context.fillText(
                    this.game.world.charAt(0).toUpperCase() + this.game.world.slice(1) + " Endless Run Over!",
                    this.game.width * .5,
                    this.game.height * .3
                );
                context.font = this.fontSize * 1 + 'px ' + this.fontFamily;
                context.fillText("Time Survived: " + survived + "s", this.game.width * .5 , this.game.height * .3 + 40);
                context.fillText("Best Time: " + best + "s", this.game.width * .5 , this.game.height * .3 + 80);
                context.fillText("Press ESC to Return!!! OR SPACE to Reset!!!", this.game.width * .5 , this.game.height * .3 + 120);
            }
            else if(this.game.questItemsCollected == this.game.questItemAmount){
                context.fillText("Quest Items Has Been Collected!!!", this.game.width * .5 , this.game.height * .3 ); 
                context.font = this.fontSize * 1 + 'px ' + this.fontFamily;    
                if(this.game.world !== 'sky'){
                    context.fillText("Press ESC to Return!!! Next World Has been Unlocked", this.game.width * .5 , this.game.height * .3 + 40 ); 
                } else {
                    context.fillText("Press ESC to Return!!! SOAR HIGH TO THE HORIZON!!!", this.game.width * .5 , this.game.height * .3 + 40 ); 
                }
            } else {
                context.fillText("Opps!!! You Died", this.game.width * .5 , this.game.height * .3 ); 
                context.font = this.fontSize * 1 + 'px ' + this.fontFamily;                
                context.fillText("Press ESC to Return!!! OR SPACE to Reset!!!", this.game.width * .5 , this.game.height * .3 + 40 );
            }
        }

        context.restore();
    }    
}