export default class Cobra extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'Cobra');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);
     
        const bodyWidth = 20;
        const bodyHeight = 35;
        this.body.setSize(bodyWidth, bodyHeight);
    
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDragX(1);

        this.createAnimations();
        this.play('Cobra_idle'); // TOCA A ANIMAÇÃO

        this.setFlipX(true); 
    }

    createAnimations() {
        // só cria se ainda não existir
        if (!this.scene.anims.exists('Cobra_idle')) {
            this.scene.anims.create({
                key: 'Cobra_idle',
                frames: this.scene.anims.generateFrameNumbers('Cobra', { start: 0, end: 8 }), // 9 frames
                frameRate: 9,
                repeat: -1
            });
        }
    }
}
