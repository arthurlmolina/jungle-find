export default class Arrow extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, direction) {
        super(scene, x, y, 'arrow');
        this.createAnimations();
        this.lifespanTimer = null;
    }

    launch(x, y, facing) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.enable = true;

        // Limpa timer antigo
        if (this.lifespanTimer) {
            this.lifespanTimer.remove();
        }

        this.body.setAllowGravity(false);
        this.body.setSize(20, 5); // Ajuste o tamanho da caixa de colisão da flecha
        this.setScale(3.1)

        const speed = 800;
        const velocityX = (facing === 'right') ? speed : -speed;
        this.setVelocityX(velocityX);

        // Vira a imagem da flecha
        this.setFlipX(facing === 'left');

        this.play('arrow', true);

    }

    createAnimations() {
        if (!this.scene.anims.exists('arrow')) {
            this.scene.anims.create({
                key: 'arrow',
                frames: this.scene.anims.generateFrameNumbers('arrow', { start: 0, end: 1 }),
                frameRate: 12,
                repeat: -1
            });
        }
    }

    // Método chamado quando a flecha atinge algo
    hitTarget() {
        if (!this.active) return;

        if (this.lifespanTimer) {
            this.lifespanTimer.remove();
        }

        this.body.setVelocity(0, 0);
        this.body.enable = false;
        this.setActive(false);
        this.setVisible(false);
    }

}