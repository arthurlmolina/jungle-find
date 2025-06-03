export default class Arrow extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, direction) {
        super(scene, x, y, 'arrow');

        // Adiciona a flecha na cena
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(true);
        this.body.setGravityY(100);
        this.setCollideWorldBounds(false);
        this.body.onWorldBounds = true;

        this.direction = direction;

        this.createAnimations();

        // Configurações da flecha
        this.setScale(3);
        this.speed = 600;
        this.direction = direction;
        this.lifeTime = 3000; // 3 segundos de vida

        // Ajuste do corpo de colisão
        this.body.setSize(20, 8);
        this.body.setOffset(2, 2);


        // Garante que não há gravidade aplicada
        this.body.setGravityY(0);
        this.body.gravity.y = 0;

        // Define a velocidade baseada na direção (DEPOIS das configurações de física)
        if (direction === 'left') {
            this.setVelocityX(-this.speed);
            this.setVelocityY(0); // Força velocidade Y = 0
            this.setFlipX(true);
        } else {
            this.setVelocityX(this.speed);
            this.setVelocityY(0); // Força velocidade Y = 0
            this.setFlipX(false);
        }

        this.play('arrow');

        // Timer para autodestruição
        this.lifeTimer = scene.time.delayedCall(this.lifeTime, () => {
            this.destroy();
        });

        // Configurações de física 
        this.body.setAllowGravity(false); // Desabilita gravidade PRIMEIRO
        this.setCollideWorldBounds(false);

        // Garante que não há gravidade aplicada
        this.body.setGravityY(0);
        this.body.gravity.y = 0;

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

}