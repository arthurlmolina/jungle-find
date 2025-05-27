import MainScene from "./scenes/MainScene.js";

var config = {
    //configurações gerais do phaser
    type: Phaser.AUTO, //tipo adaptavel (WebGL ou Canvas)
    width: 800,
    height: 600,
    physics:{ //definindo a gravidade do jogo (tipo: arcade / simples e rapido)
        default: 'arcade',
        arcade:{ 
            gravity: {y:300},
            debug: false 
        }
    },
    scene: [MainScene]

};

var game = new Phaser.Game(config) //instância o jogo com as configurações pré-definidas

