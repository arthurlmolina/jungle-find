import MainScene from "/jungle-find/scenes/MainScene.js";
import EndScene from "/jungle-find/scenes/endScenes.js";
import IntroScene from "/jungle-find/scenes/IntroScene.js";
import GameOverScene from "/jungle-find/scenes/GameOverScene.js";

var config = {
    //configurações gerais do phaser
    type: Phaser.AUTO, //tipo adaptavel (WebGL ou Canvas)
    pixelArtnp: true,
    roundPixels: true,
    width: 1366,
    height: 600,  //650
    physics:{ //definindo a gravidade do jogo (tipo: arcade / simples e rapido)
        default: 'arcade',
        arcade:{ 
            gravity: {y:1500},
            debug: true 
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [IntroScene, MainScene, EndScene, GameOverScene]

};

var game = new Phaser.Game(config) //instância o jogo com as configurações pré-definidas

WebFont.load({
    // Carrega a fonte "Press Start 2P" do Google Fonts
    google: {
        families: ['Press Start 2P']
    }
});