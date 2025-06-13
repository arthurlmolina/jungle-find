import './css/game.css';
import Phaser from 'phaser';

import MainScene from "./scenes/MainScene.js";
import EndScene from "./scenes/EndScenes.js";
import IntroScene from "./scenes/IntroScene.js";
import GameOverScene from "./scenes/GameOverScene.js";

var config = {
    type: Phaser.AUTO,
    pixelArt: true,
    roundPixels: true,
    width: 1366,
    height: 600,  
    physics:{ 
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
    scene: [IntroScene, MainScene, EndScene, GameOverScene]

};

WebFont.load({
    google: {
        families: ['Press Start 2P']
    },
    active: function() {
        const game = new Phaser.Game(config);
    }
});