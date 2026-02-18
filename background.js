class Layer{
    constructor(game, width, height, speedModifier, image){
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;
        this.x = 0;
        this.y = -160;
    }
    update(){
        if(this.x < -this.width) this.x = 0;
        else this.x -= this.game.speed * this.speedModifier;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

export class BackgroundForest {
    constructor(game){
        this.game = game;
        this.width = 1668;
        this.height = 909;
        this.layer1Image = document.getElementById('layer1');
        this.layer2Image = document.getElementById('layer2');
        this.layer3Image = document.getElementById('layer3');
        this.layer4Image = document.getElementById('layer4');
        this.layer1 = new Layer(this.game, this.width, this.height, 0.1, this.layer1Image);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer2Image);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.8, this.layer3Image);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer4Image);
        this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4];
    }
    update(){
        this.backgroundLayers.forEach(layer => {
            layer.update();
        })
    }
    draw(context){
        this.backgroundLayers.forEach(layer => {
            layer.draw(context);
        })
    }
}

export class BackgroundCave {
    constructor(game){
        this.game = game;
        this.width = 1600;
        this.height = 900;
        this.layer1Image = document.getElementById('layerCave1');
        this.layer2Image = document.getElementById('layerCave2');
        this.layer3Image = document.getElementById('layerCave3');
        this.layer4Image = document.getElementById('layerCave4');
        this.layer5Image = document.getElementById('layerCave5');
        this.layer6Image = document.getElementById('layerCave6');
        this.layer7Image = document.getElementById('layerCave7');
        this.layer1 = new Layer(this.game, this.width, this.height, 0, this.layer7Image);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer6Image);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.3, this.layer5Image);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.4, this.layer4Image);
        this.layer5 = new Layer(this.game, this.width, this.height, 0.5, this.layer3Image);
        this.layer6 = new Layer(this.game, this.width, this.height, 0.7, this.layer2Image);
        this.layer7 = new Layer(this.game, this.width, this.height, 0.8, this.layer1Image);
        this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5, this.layer6, this.layer7];
    }
    update(){
        this.backgroundLayers.forEach(layer => {
            layer.update();
        })
    }
    draw(context){
        this.backgroundLayers.forEach(layer => {
            layer.draw(context);
        })
    }
}

export class BackgroundVolcano {
    constructor(game){
        this.game = game;
        this.width = 2048;
        this.height = 900;
        this.layer1Image = document.getElementById('layerVol1');
        this.layer2Image = document.getElementById('layerVol2');
        this.layer3Image = document.getElementById('layerVol3');
        this.layer4Image = document.getElementById('layerVol4');
        this.layer5Image = document.getElementById('layerVol5');
        this.layer1 = new Layer(this.game, this.width, this.height, 0.1, this.layer5Image);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer4Image);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.3, this.layer3Image);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.4, this.layer2Image);
        this.layer5 = new Layer(this.game, this.width, this.height, 0.8, this.layer1Image);
        this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];
    }
    update(){
        this.backgroundLayers.forEach(layer => {
            layer.update();
        })
    }
    draw(context){
        this.backgroundLayers.forEach(layer => {
            layer.draw(context);
        })
    }
}

export class BackgroundSky {
    constructor(game){
        this.game = game;
        this.width = 1552;
        this.height = 900;
        this.layer1Image = document.getElementById('layerSky1');
        this.layer2Image = document.getElementById('layerSky2');
        this.layer3Image = document.getElementById('layerSky3');
        this.layer4Image = document.getElementById('layerSky4');
        this.layer5Image = document.getElementById('layerSky5');
        this.layer1 = new Layer(this.game, this.width, this.height, 0.1, this.layer1Image);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer2Image);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.3, this.layer3Image);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.4, this.layer4Image);
        this.layer5 = new Layer(this.game, this.width, this.height, 0.8, this.layer5Image);
        this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];
    }
    update(){
        this.backgroundLayers.forEach(layer => {
            layer.update();
        })
    }
    draw(context){
        this.backgroundLayers.forEach(layer => {
            layer.draw(context);
        })
    }
}