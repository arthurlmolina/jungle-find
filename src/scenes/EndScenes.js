export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene'); 
    }

    create() {
        
        const finalVideo = this.add.video( 683, 300, 'videoHugo');
        finalVideo.setDisplaySize(650, 252);
        finalVideo.play(false);

        finalVideo.on('complete', () => {
            window.location.href = 'credits.html';
        });

    }
}