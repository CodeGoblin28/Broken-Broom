const states = {
    IDLE: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    FLYING: 4,
    TAKEOFF: 5,
}

class State {
    constructor(state){
        this.state = state;
    }
}

export class Idle extends State{
    constructor(player){
        super('IDLE');
        this.player = player;
    }
    enter(){
        this.player.frameX = 0;
        this.player.frameY = 0;
        this.player.maxFrame = 9;
    }
    handleInput(input){
        if (input.includes('ArrowLeft') || input.includes('ArrowRight') || input.includes('a') || input.includes('d')){
            this.player.setState(states.RUNNING);
        } else if (input.includes('ArrowUp') || input.includes('w')){
            if (this.player.game.world === "cave" || this.player.game.world === "volcano"){
                this.player.setState(states.TAKEOFF);
            } else {
                this.player.setState(states.JUMPING);
            }
        }
    }
}

export class Running extends State{
    constructor(player){
        super('RUNNING');
        this.player = player;
    }
    enter(){
        this.player.frameX = 0;
        this.player.frameY = 2;
        this.player.maxFrame = 9;
    }
    handleInput(input){
        if (input.includes('ArrowUp') || input.includes('w')){
            if (this.player.game.world === "cave" || this.player.game.world === "volcano"){
                this.player.setState(states.TAKEOFF);
            } else {
                this.player.setState(states.JUMPING);
            }
        }
    }
}

export class Jumping extends State{
    constructor(player){
        super('JUMPING');
        this.player = player;
    }
    enter(){
        this.player.vy = -this.player.jumpForce;
        this.player.frameX = 0;
        this.player.frameY = 3;
        this.player.maxFrame = 5;
        this.player.game.audio.play('jump');
    }
    handleInput(input){
        if (this.player.vy > 0){
            this.player.setState(states.FALLING);
        }
    }
}

export class Falling extends State{
    constructor(player){
        super('FALLING');
        this.player = player;
    }
    enter(){
        this.player.frameX = 0;
        this.player.frameY = 4;
        this.player.maxFrame = 3;
    }
    handleInput(input){
        if (this.player.onGround()){
            this.player.game.audio.play('landing');
            this.player.setState(states.RUNNING);
        }
        if (input.includes('ArrowDown') || input.includes('s')) {
            this.player.vy = 1000;
        } 
    }
}

export class Flying extends State{
    constructor(player){
        super('FLYING');
        this.player = player;
    }
    enter(){
        this.player.frameX = 0;
        this.player.frameY = 7;
        this.player.maxFrame = 3;
    }
    handleInput(input){
        const isSky = this.player.game.world === "sky";

        if (this.player.onGround() && !isSky){
            this.player.setState(states.RUNNING);
        }

        // const flySpeed = 500 * this.player.game.difficultyMultiplier;

        // Optional: allow vertical control
        if (input.includes('ArrowUp') || input.includes('w')) {
            this.player.vy = -500; 
        } 
        else if (input.includes('ArrowDown') || input.includes('s')) {
            this.player.vy = 500;  // down
        } 
        else {
            if (isSky) {
                // float in sky
                this.player.vy = 0;
            }    
        }
    }
}

export class TakeOff extends State{
    constructor(player){
        super('TAKEOFF');
        this.player = player;
    }
    enter(){
        this.player.frameX = 0;
        this.player.frameY = 6;
        this.player.maxFrame = 5;

        this.finished = false;
    }
    handleInput(input){
        // When animation finishes → go to flying
        if (!this.finished && this.player.frameX === this.player.maxFrame){
            this.finished = true;
            this.player.setState(states.FLYING);
        }

        if (input.includes('ArrowUp') || input.includes('w')) {
            this.player.vy = -500;
        } 
    }
}