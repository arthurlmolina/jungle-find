export default class Fireball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'fireball');

        this.on('explode', () => {
            if (this.body.enable) {
                this.body.setVelocity(0);
            }

            this.body.enable = false;
            this.play('fireball_explode', true);
            
            this.once('animationcomplete-fireball_explode', () => {
                this.setVisible(false);
                this.setActive(false);
            });
        });

        this.createAnimations();
    }

    createAnimations() {
        if (!this.scene.anims.exists('fireball_move')) {
            this.scene.anims.create({
                key: 'fireball_move',
                frames: this.scene.anims.generateFrameNumbers('fireball', { start: 0, end: 5 }),
                frameRate: 15,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('fireball_explode')) {
            this.scene.anims.create({
                key: 'fireball_explode',
                frames: this.scene.anims.generateFrameNumbers('fireball_explode', { start: 0, end: 6 }),
                frameRate: 15,
                repeat: 0
            });
        }
    }

    launch(x, y, flipX) {
        this.body.reset(x, y);
        this.body.enable = true; 
        this.setActive(true);
        this.setVisible(true);

        this.body.setAllowGravity(false);
        this.body.setSize(10, 10);
        this.body.setOffset(17, 19);
        this.setScale(3);

        const speed = 500;
        const velocityX = flipX ? -speed : speed;
        this.setVelocityX(velocityX);

        this.play('fireball_move', true);
        this.setFlipX(flipX);
    }
}