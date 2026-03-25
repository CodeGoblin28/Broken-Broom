import { CollisionAnimation } from "./collisionAnimation.js";

class Enemy {
    constructor(){
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.markForDeletion = false;

        this.hitbox = {
            offsetX: 0,
            offsetY: 0,
            width: 0,
            height: 0
        };
    }
    update(deltaTime){
        const dt = deltaTime * 0.001;
        const fpsScale = 150;

        this.x -= this.speedX * this.game.speed * fpsScale * dt;
        this.y += this.speedY * fpsScale * dt;

        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }

        if (this.x + this.width < 0) this.markForDeletion = true;
    }
    draw(context){
        if (this.game.debug) {
            context.strokeStyle = "lime"; 
            context.strokeRect(this.x, this.y, this.width, this.height)
            
            context.strokeStyle = "yellow";
            context.strokeRect(
            this.x + this.hitbox.offsetX,
            this.y + this.hitbox.offsetY,
            this.hitbox.width,
            this.hitbox.height);
        };
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

export class FlyingEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = 1;
    }
}


///////////////////////////////////////////
// FOREST //
//////////////////////////////////////////
export class Fly extends FlyingEnemy {
    constructor(game){
        super(game);
        this.width = 60;
        this.height = 44;
        this.speedX = Math.random() * 0.5 + 0.5;
        this.speedY = 0;
        this.maxFrame = 5;
        this.image = document.getElementById('enemy_fly');
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;

        this.hitbox = {
            offsetX: 0,
            offsetY: 0,
            width: this.width,
            height: this.height
        };
    }
    update(deltaTime){
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}

export class Tulip extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 62.18;
        this.height = 100;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('enemy_plant');
        this.speedX = 0.8;
        this.speedY = 0;    
        this.maxFrame = 10;

        this.hitbox = {
            offsetX: 0,
            offsetY: 20,
            width: this.width,
            height: this.height -20
        };
    }
}

export class Wolf extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 192;
        this.height = 120;
        this.x = this.game.width + this.width; // fully off-screen right
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('wolf');
        this.speedX = 2;
        this.speedY = 0;    
        this.maxFrame = 8;

        this.hitbox = {
            offsetX: 20,
            offsetY: 35,
            width: this.width - 40,
            height: this.height -35
        };

        // Warning phase
        this.warningDuration = 1000; // 1 second
        this.warningTimer = 0;
        this.isFalling = false;
        this.warningSoundPlayed = false;

        this.warningImage = document.getElementById('warning');

    }
    update(deltaTime){
        if(!this.isFalling){
            if (!this.warningSoundPlayed) {
                this.game.audio.play('warning');
                this.warningSoundPlayed = true;
            }
            // Warning phase
            this.warningTimer += deltaTime;
            if(this.warningTimer >= this.warningDuration){
                this.isFalling = true; // branch starts falling
            }
        } else {
            // Falling phase
            super.update(deltaTime);
            if (this.warningSoundPlayed) {
                this.game.audio.play('wolf_growl');
                this.warningSoundPlayed = false;
            }
        }
    }
    draw(context){
        if(!this.isFalling){
            // Draw warning at top of screen
            const warningSize = 70; // size in px, square
            context.drawImage(
                this.warningImage,
                this.game.width - warningSize - 20, // right side with padding
                this.y + this.height / 2 - warningSize / 2,
                warningSize,                           // width
                warningSize                            // height
            );
        } else {
            super.draw(context);
        }
    }
}


export class FallingBranch extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 101;
        this.height = 38;

        // Spawn above player
        this.x = this.game.player.x + this.game.player.width / 2 - this.width / 2;
        this.y = 0 - this.height;

        this.image = document.getElementById('branch');
        this.speedX = 0;
        this.speedY = 5;    
        this.maxFrame = 0;

        // Warning phase
        this.warningDuration = 1000; // 1 second
        this.warningTimer = 0;
        this.isFalling = false;
        this.warningSoundPlayed = false;

        this.hitbox = {
            offsetX: 0,
            offsetY: 0,
            width: this.width,
            height: this.height
        };

        // Get the warning image
        this.warningImage = document.getElementById('warning');
    }

    update(deltaTime){
        if(!this.isFalling){
            if (!this.warningSoundPlayed) {
                this.game.audio.play('warning');
                this.warningSoundPlayed = true;
            }
            // Warning phase
            this.warningTimer += deltaTime;
            if(this.warningTimer >= this.warningDuration){
                this.isFalling = true; // branch starts falling
            }
        } else {
            // Falling phase
            super.update(deltaTime);

            if (this.warningSoundPlayed) {
                this.game.audio.play('branch_snap');
                this.warningSoundPlayed = false;
            }

            const ground = this.game.height - this.height - this.game.groundMargin;
            if(this.y > ground){
                this.markForDeletion = true;
            }
        }
    }

    draw(context){
        if(!this.isFalling){
            // Draw warning at top of screen
            const warningSize = 70; // size in px, square
            context.drawImage(
                this.warningImage,
                this.x + this.width/2 - warningSize/2, // center above branch
                50,                                   // fixed y
                warningSize,                           // width
                warningSize                            // height
            );
        } else {
            super.draw(context);
        }
    }
}

export class Slime extends Enemy {
    constructor(game){
        super();
        this.game = game;

        this.width = 80;
        this.height = 50;

        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;

        this.image = document.getElementById('slime');

        this.baseSpeed = 0.8;
        this.jumpSpeed = 2;
        this.speedX = this.baseSpeed;

        this.speedY = 0;
        this.maxFrame = 1;

        // jump physics
        this.vy = 0;
        this.gravity = 2500;
        this.jumpForce = 900;

        // jump timing
        this.jumpTimer = 0;
        this.jumpInterval = 500 + Math.random() * 1000;

        this.hitbox = {
            offsetX: 0,
            offsetY: 0,
            width: this.width,
            height: this.height
        };

    }

    update(deltaTime){
        super.update(deltaTime);

        const dt = deltaTime * 0.001;

        // gravity
        this.y += this.vy * dt;
        this.vy += this.gravity * dt;

        const ground = this.game.height - this.height - this.game.groundMargin;

        if(this.y >= ground){
            this.y = ground;
            this.vy = 0;

            // reset speed when landing
            this.speedX = this.baseSpeed;

            this.jumpTimer += deltaTime;

            if(this.jumpTimer > this.jumpInterval){
                this.vy = -this.jumpForce;
                this.speedX = this.jumpSpeed;
                this.jumpTimer = 0;
                this.game.audio.play('slime_splat');
            }
        }
    }
}


///////////////////////////////////////////
// CAVE //
//////////////////////////////////////////

export class Ghost extends FlyingEnemy {
    constructor(game){
        super(game);
        this.width = 72;
        this.height = 104;
        this.speedX = 0.75;
        this.speedY = 0;
        this.maxFrame = 3;
        this.image = document.getElementById('ghost');
        this.y = this.game.height - this.height - this.game.groundMargin - Math.random() * 600;

        this.angle = 20;
        this.va = Math.random() * 0.1 + 0.1;

        this.hitbox = {
            offsetX: 10,
            offsetY: 0,
            width: this.width - 10,
            height: this.height - 10
        };
    }
    update(deltaTime){
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}

export class Spidercrawler extends Enemy {
    constructor(game){
        super(game);
        this.game = game;
        this.width = 166.8;
        this.height = 72;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('spidercrawler');
        this.speedX = 1.5;
        this.speedY = 0;    
        this.maxFrame = 4;
        this.SoundPlayed = false;

        this.hitbox = {
            offsetX: 30,
            offsetY: 0,
            width: this.width - 30,
            height: this.height 
        };
    }

    update(deltaTime){
        super.update(deltaTime);

        if (!this.SoundPlayed) {
            this.game.audio.play('spider_crawl');
            this.SoundPlayed = true;
        }
    }
}

export class Spiderceiling extends Enemy {
    constructor(game){
        super(game);
        this.game = game;
        this.width = 166.8;
        this.height = 72;
        this.x = this.game.width;
        this.y = 0;
        this.image = document.getElementById('spiderceiling');
        this.speedX = 1.5;
        this.speedY = 0;    
        this.maxFrame = 4;
        this.SoundPlayed = false;

        this.hitbox = {
            offsetX: 30,
            offsetY: 0,
            width: this.width - 30,
            height: this.height 
        };
    }

    update(deltaTime){
        super.update(deltaTime);

        if (!this.SoundPlayed) {
            this.game.audio.play('spider_crawl');
            this.SoundPlayed = true;
        }
    }
}

export class ClimbingSpider extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 120;
        this.height = 144;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;


        this.speedX = 0.8;
        this.speedY = Math.random() > 0.5 ? 1 : -1;

        this.maxFrame = 5;
        this.image = document.getElementById('spider_big');


        this.hitbox = {
            offsetX: 10,
            offsetY: 10,
            width: this.width - 20,
            height: this.height - 20
        };
    }    
    update(deltaTime){
        super.update(deltaTime);
        if(this.y > this.game.height - this.height - this.game.groundMargin){
            this.speedY *= -1;
        }

        if(this.y < -this.height + this.height){
            this.speedY *= -1;
        }

    }    
    draw(context){
        super.draw(context);
        context.save();
        context.beginPath();
        context.moveTo(this.x + this.width/2,0);
        context.lineTo(this.x + this.width/2, this.y + 50);
        context.strokeStyle = "black";
        context.stroke();
        context.restore();
    }
}

export class Stalactite extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 60;
        this.height = 167;

        // Spawn above player
        this.x = this.game.player.x + this.game.player.width / 2 - this.width / 2;
        this.y = 0 - this.height;

        this.image = document.getElementById('stalactite');
        this.speedX = 0;
        this.speedY = 5;    
        this.maxFrame = 0;

        // Warning phase
        this.warningDuration = 1000; // 1 second
        this.warningTimer = 0;
        this.isFalling = false;
        this.warningSoundPlayed = false;

        this.hitbox = {
            offsetX: 0,
            offsetY: 0,
            width: this.width,
            height: this.height - 30
        };

        // Get the warning image
        this.warningImage = document.getElementById('warning');
    }

    update(deltaTime){
        if(!this.isFalling){
            if (!this.warningSoundPlayed) {
                this.game.audio.play('warning');
                this.warningSoundPlayed = true;
            }
            // Warning phase
            this.warningTimer += deltaTime;
            if(this.warningTimer >= this.warningDuration){
                this.isFalling = true; // branch starts falling
            }
        } else {
            // Falling phase
            super.update(deltaTime);

            if (this.warningSoundPlayed) {
                this.game.audio.play('crumble_stalactite');
                this.warningSoundPlayed = false;
            }

            const ground = this.game.height - this.height - this.game.groundMargin;
            if(this.y > ground){
                this.y = ground;

                // Ground impact animation
                this.game.collisions.push(
                    new CollisionAnimation(
                        this.game,
                        this.x + this.width * 0.5,
                        this.y + this.height
                    )
                );

                this.markForDeletion = true;
            }
        }
    }

    draw(context){
        if(!this.isFalling){
            // Draw warning at top of screen
            const warningSize = 70; // size in px, square
            context.drawImage(
                this.warningImage,
                this.x + this.width/2 - warningSize/2, // center above branch
                50,                                   // fixed y
                warningSize,                           // width
                warningSize                            // height
            );
        } else {
            super.draw(context);
        }
    }
}

export class HangingStalactite extends Enemy {
    constructor(game){
        super(game);
        this.game = game;
        this.width = 60;
        this.height = 167;
        this.x = this.game.width;
        this.y = 0 - 50;
        this.image = document.getElementById('stalactite');
        this.speedX = 0.8;
        this.speedY = 0;    
        this.maxFrame = 0;

        this.hitbox = {
            offsetX: 0,
            offsetY: 0,
            width: this.width,
            height: this.height - 30
        };
    }
}

export class Boulder extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 168;
        this.height = 169;
        this.x = this.game.width + this.width; // fully off-screen right
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('boulder');
        this.speedX = 2;
        this.speedY = 0;    
        this.maxFrame = 0;

        this.rotation = 0;
        this.rotationSpeed = -0.05 * this.game.speed; // tweak this (0.05–0.2 feels good)

        this.hitbox = {
            offsetX: 5,
            offsetY: 5,
            width: this.width - 10,
            height: this.height -10
        };

        // Warning phase
        this.warningDuration = 1000; // 1 second
        this.warningTimer = 0;
        this.isFalling = false;
        this.warningSoundPlayed = false;

        this.warningImage = document.getElementById('warning');

    }
    update(deltaTime){
        if(!this.isFalling){
            if (!this.warningSoundPlayed) {
                this.game.audio.play('warning');
                this.game.audio.play('boulder');
                this.warningSoundPlayed = true;
            }
            // Warning phase
            this.warningTimer += deltaTime;
            if(this.warningTimer >= this.warningDuration){
                this.isFalling = true; // branch starts falling
            }
        } else {
            super.update(deltaTime);
            this.rotation += this.rotationSpeed;
        }
    }
    draw(context){
        if(!this.isFalling){
            const warningSize = 70;
            context.drawImage(
                this.warningImage,
                this.game.width - warningSize - 20,
                this.y + this.height / 2 - warningSize / 2,
                warningSize,
                warningSize
            );
        } else {
            context.save();

            // Move to center of boulder
            context.translate(
                this.x + this.width / 2,
                this.y + this.height / 2
            );

            // Rotate
            context.rotate(this.rotation);

            // Draw centered
            context.drawImage(
                this.image,
                this.frameX * this.width,
                this.frameY * this.height,
                this.width,
                this.height,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );

            context.restore();

            // Debug hitbox (optional)
            if (this.game.debug){
                context.strokeStyle = "yellow";
                context.strokeRect(
                    this.x + this.hitbox.offsetX,
                    this.y + this.hitbox.offsetY,
                    this.hitbox.width,
                    this.hitbox.height
                );
            }
        }
    }
}

///////////////////////////////////////////
// VOLCANO //
//////////////////////////////////////////

export class FireSpirit extends FlyingEnemy {
    constructor(game){
        super(game);
        this.width = 100;
        this.height = 92;
        this.speedX = 1.5;
        this.speedY = 0;
        this.maxFrame = 7;
        this.image = document.getElementById('fire_spirit');

        this.hitbox = {
            offsetX: 12.5,
            offsetY: 12.5,
            width: this.width - 25,
            height: this.height - 25
        };
    }    
}

export class Devil extends FlyingEnemy {
    constructor(game){
        super(game);
        this.width = 99.6;
        this.height = 64;
        this.speedX = 1;
        this.speedY = 0;
        this.maxFrame = 4;
        this.image = document.getElementById('devil');

        this.hitbox = {
            offsetX: 20,
            offsetY: 0,
            width: this.width - 40,
            height: this.height - 0
        };
    }    
}

export class FireBall extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 60;
        this.height = 92;

        // Spawn above player
        // this.x = this.game.player.x + this.game.player.width / 2 - this.width / 2;
        //Math.random() * this.game.height * 0.5
        this.x = Math.random() * this.game.width + 100;
        this.y = 0 - this.height;

        this.image = document.getElementById('fire_ball');
        this.speedX = 0;
        this.speedY = 3;    
        this.maxFrame = 3;

        // Warning phase
        this.warningDuration = 1000; // 1 second
        this.warningTimer = 0;
        this.isFalling = false;
        this.warningSoundPlayed = false;

        this.hitbox = {
            offsetX: 0,
            offsetY: 0,
            width: this.width,
            height: this.height
        };

        // Get the warning image
        this.warningImage = document.getElementById('warning');
    }

    update(deltaTime){
        if(!this.isFalling){
            if (!this.warningSoundPlayed) {
                this.game.audio.play('warning');
                this.warningSoundPlayed = true;
            }
            // Warning phase
            this.warningTimer += deltaTime;
            if(this.warningTimer >= this.warningDuration){
                this.isFalling = true; // branch starts falling
            }
        } else {
            // Falling phase
            super.update(deltaTime);

            if (this.warningSoundPlayed) {
                this.game.audio.play('fireball');
                this.warningSoundPlayed = false;
            }

            const ground = this.game.height - this.height - this.game.groundMargin;
            if(this.y > ground){
                this.markForDeletion = true;
            }
        }
    }

    draw(context){
        if(!this.isFalling){
            // Draw warning at top of screen
            const warningSize = 70; // size in px, square
            context.drawImage(
                this.warningImage,
                this.x + this.width/2 - warningSize/2, // center above branch
                50,                                   // fixed y
                warningSize,                           // width
                warningSize                            // height
            );
        } else {
            super.draw(context);
        }
    }
}

export class Golem extends Enemy {
    constructor(game){
        super(game);
        this.game = game;
        this.width = 120;
        this.height = 120;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('golem');
        this.speedX = 1;
        this.speedY = 0;    
        this.maxFrame = 9;

        this.hitbox = {
            offsetX: 15,
            offsetY: 30,
            width: this.width - 30,
            height: this.height -30
        };
    }
}

export class lava_shark extends Enemy {
    constructor(game){
        super(game);
        this.game = game;
        this.width = 176.63;
        this.height = 70;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.image = document.getElementById('lava_shark');
        this.speedY = 0;    
        this.maxFrame = 7;

        this.baseSpeed = 1.5;
        this.jumpSpeed = 2;
        this.speedX = this.baseSpeed;

        // jump physics
        this.vy = 0;
        this.gravity = 2500;
        this.jumpForce = 900;

        // jump timing
        this.jumpTimer = 0;
        this.jumpInterval = 500 + Math.random() * 1000;

        this.hitbox = {
            offsetX: 10,
            offsetY: 20,
            width: this.width - 10,
            height: this.height - 20
        };
    }
    update(deltaTime){
        super.update(deltaTime);
        const dt = deltaTime * 0.001;

        // gravity
        this.y += this.vy * dt;
        this.vy += this.gravity * dt;

        const ground = this.game.height - this.height - this.game.groundMargin + 20;

        if(this.y >= ground){
            this.y = ground;
            this.vy = 0;

            // reset speed when landing
            this.speedX = this.baseSpeed;

            this.jumpTimer += deltaTime;

            if(this.jumpTimer > this.jumpInterval){
                this.vy = -this.jumpForce;
                this.speedX = this.jumpSpeed;
                this.jumpTimer = 0;
            }
        }
    }
}

///////////////////////////////////////////
// SKY //
//////////////////////////////////////////

export class Raven extends FlyingEnemy {
    constructor(game){
        super(game);
        this.width = 97.83;
        this.height = 70;
        this.speedX = 1;
        this.speedY = 0;
        this.maxFrame = 5;
        this.image = document.getElementById('raven');
        this.y = Math.random() * (this.game.height - this.height);

        this.hitbox = {
            offsetX: 0,
            offsetY: 10,
            width: this.width,
            height: this.height - 20
        };
    }    
}

export class AngryCloud extends FlyingEnemy {
    constructor(game){
        super(game);
        this.width = 58;
        this.height = 50;
        this.speedX = 1.5;
        this.speedY = 0;
        this.maxFrame = 3;
        this.image = document.getElementById('angry_cloud');
        this.y = Math.random() * this.game.height;
        this.followSpeed = .4;

        this.hitbox = {
            offsetX: 0,
            offsetY: 0,
            width: this.width,
            height: this.height
        };
    }    
    update(deltaTime){
        super.update(deltaTime);

        // Follow player Y smoothly
        const playerY = this.game.player.y;

        if (this.y < playerY) {
            this.y += this.followSpeed;
        } 
        else if (this.y > playerY) {
            this.y -= this.followSpeed;
        }
    }
}
export class meteor extends FlyingEnemy {
    constructor(game){
        super(game);
        this.width = 229;
        this.height = 193;
        this.speedX = 2;
        this.speedY = .5;
        this.maxFrame = 7;
        this.x = this.game.width;
        this.image = document.getElementById('meteor');
        this.y = Math.random() * this.game.height * 0.7;

        this.hitbox = {
            offsetX: 10,
            offsetY: 20,
            width: this.width - 80,
            height: this.height - 40
        };

        // Warning phase
        this.warningDuration = 1000; // 1 second
        this.warningTimer = 0;
        this.isFalling = false;
        this.warningSoundPlayed = false;

        this.warningImage = document.getElementById('warning');
    }
    update(deltaTime){
        if(!this.isFalling){
            if (!this.warningSoundPlayed) {
                this.game.audio.play('warning');
                this.warningSoundPlayed = true;
            }
            // Warning phase
            this.warningTimer += deltaTime;
            if(this.warningTimer >= this.warningDuration){
                this.isFalling = true; // branch starts falling
            }
        } else {
            // Falling phase
            super.update(deltaTime);
            if (this.warningSoundPlayed) {
                this.game.audio.play('meteor');
                this.warningSoundPlayed = false;
            }
        }
    }
    draw(context){
        if(!this.isFalling){
            // Draw warning at top of screen
            const warningSize = 70; // size in px, square
            context.drawImage(
                this.warningImage,
                this.game.width - warningSize - 20, // right side with padding
                this.y + this.height / 2 - warningSize / 2,
                warningSize,                           // width
                warningSize                            // height
            );
        } else {
            super.draw(context);
        }
    }
}

export class Dragon extends FlyingEnemy {
    constructor(game){
        super(game);
        this.width = 244;
        this.height = 261;
        this.speedX = 1.5;
        this.speedY = 0;
        this.frameY = 0;
        this.maxFrame = 5;
        this.image = document.getElementById('dragon');
        this.y = Math.random() * (this.game.height - this.height);

        this.hitbox = {
            offsetX: 25,
            offsetY: 75,
            width: this.width - 50,
            height: this.height - 150
        };
    }
}

export class Tornado extends FlyingEnemy {
    constructor(game){
        super(game);
        this.width = 200;
        this.height = 200;
        this.speedX = 1;
        this.speedY = 0;
        this.maxFrame = 14;
        this.image = document.getElementById('tornado');
        this.x = this.game.width;
        this.y = this.game.height - this.height;
        this.warningSoundPlayed = false;

        this.hitbox = {
            offsetX: 30,
            offsetY: 40,
            width: this.width - 100,
            height: this.height - 40
        };
    }    
    update(deltaTime){
        super.update(deltaTime);
        if (!this.warningSoundPlayed) {
            this.game.audio.play('windy');
            this.warningSoundPlayed = true;
        }
        

        const player = this.game.player;

        // Center positions
        const tornadoCenterX = this.x + this.width / 2;
        const tornadoCenterY = this.y + this.height / 2;

        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;

        // Distance
        const dx = tornadoCenterX - playerCenterX;
        const dy = tornadoCenterY - playerCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const pullRadius = 500; // range of effect

        if(distance < pullRadius){
            const strength = (pullRadius - distance) / pullRadius; // 0 → 1

            // Normalize direction
            const forceX = dx / distance;
            const forceY = dy / distance;

            // Apply pull (tweak multiplier for strength)
            player.x += forceX * strength * 3;
            player.y += forceY * strength * 3;
        }
    }
}

