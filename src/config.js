import MainScene from "./scenes/MainScene.js";
//import IntroScene from "./scenes/IntroScene.js";
var config = {
    //configurações gerais do phaser
    type: Phaser.AUTO, //tipo adaptavel (WebGL ou Canvas)
    pixelArt: true,
    roundPixels: true,
    width: 1366,
    height: 600,  //650
    physics:{ //definindo a gravidade do jogo (tipo: arcade / simples e rapido)
        default: 'arcade',
        arcade:{ 
            gravity: {y:1500},
            debug: false 
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [MainScene]

};

var game = new Phaser.Game(config) //instância o jogo com as configurações pré-definidas

