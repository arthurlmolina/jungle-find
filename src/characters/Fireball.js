// No seu arquivo Fireball.js

export default class Fireball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Usa a textura base da fireball que você carregou no preload
        super(scene, x, y, 'fireball');

        // Adiciona um listener para o evento 'explode'.
        // Este é o "ouvido" que espera pelo grito da cena.
        this.on('explode', () => {
            // 1. Para o movimento e desativa o corpo de física imediatamente
            if (this.body.enable) {
                this.body.setVelocity(0);
            }
            
            // 2. Toca a animação de explosão
            this.play('fireball_explode', true);
            
            // 3. Ouve o evento de quando a animação de explosão TERMINAR
            this.once('animationcomplete-fireball_explode', () => {
                // 4. Desativa o objeto, devolvendo-o para o pool para ser reutilizado
                this.setVisible(false);
                this.setActive(false);
                this.body.enable = false;
            });
        });

        // Chama a criação de animações uma vez
        this.createAnimations();
    }

    createAnimations() {
        // Animação de movimento
        if (!this.scene.anims.exists('fireball_move')) {
            this.scene.anims.create({
                key: 'fireball_move',
                frames: this.scene.anims.generateFrameNumbers('fireball', { start: 0, end: 5 }),
                frameRate: 15,
                repeat: -1
            });
        }

        // Animação de explosão
        if (!this.scene.anims.exists('fireball_explode')) {
            this.scene.anims.create({
                key: 'fireball_explode',
                frames: this.scene.anims.generateFrameNumbers('fireball_explode', { start: 0, end: 6 }),
                frameRate: 15,
                repeat: 0
            });
        }
    }

    // Método para disparar a fireball (continua o mesmo)
    launch(x, y, flipX) {
        this.body.reset(x, y);
        this.body.enable = true; // Garante que a física está ativa ao ser lançada
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