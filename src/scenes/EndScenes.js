export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene'); 
    }

    create() {
        
        const finalVideo = this.add.video( 683, 300, 'videoHugo');
        finalVideo.setDisplaySize(650, 252);
        finalVideo.play(false);

        // Quando o vídeo terminar, redireciona o navegador para a página de créditos.
        finalVideo.on('complete', () => {
            window.location.href = 'credits.html';
        });

    }
}