// Arquivo: EndScene.js
import IntroScene from "./IntroScene";
export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene'); // Nome único para a cena final
    }

    preload() {
        // Não precisamos carregar o vídeo aqui, pois ele já foi carregado na MainScene.
        // Se não fosse, a linha seria:
        // this.load.video('videoHugo', 'src/assets/cutscenes/final.mp4');
    }

    create() {
        
        const finalVideo = this.add.video( 683, 300, 'videoHugo');
        finalVideo.setDisplaySize(650, 252);
        finalVideo.play(false);

        // --- ALTERAÇÃO AQUI ---
        // Quando o vídeo terminar, redireciona o navegador para a página de créditos.
        finalVideo.on('complete', () => {
            window.location.href = 'credits.html';
        });

    }
}