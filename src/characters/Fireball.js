export default class Fireball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // A chave aqui pode ser a da sua spritesheet, mas o grupo pode sobrescrever
        super(scene, x, y, 'fireball');

        // Esta parte é a de CONFIGURAÇÃO INICIAL (só precisa rodar uma vez)
        this.speed = 500;
        this.createAnimations();

        // A lógica do 'explode' também só precisa ser definida uma vez
        this.on('explode', () => {
            this.body.setVelocity(0);
            this.anims.play('fireball_explode', true);
            this.once('animationcomplete-fireball_explode', () => {
                // Para reutilizar, não destruímos. Apenas desativamos.
                this.setActive(false);
                this.setVisible(false);
            });
        });
    }

    launch(x, y, flipX) {
        // Reativa o corpo físico e o posiciona no lugar certo
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.setAllowGravity(false); // Garante que a gravidade está sempre desativada

        // Aplica escala e direção
        this.setScale(3);
        const direction = new Phaser.Math.Vector2(flipX ? -1 : 1, 0);
        this.setVelocity(direction.x * this.speed, 0);

        // Toca a animação de movimento
        this.anims.play('fireball_move', true);
        this.setFlipX(flipX); // Garante que a imagem está virada para o lado certo
    }

    createAnimations() {
        if (!this.scene.anims.exists('fireball_move')) {
            this.scene.anims.create({
                key: 'fireball_move',
                frames: this.scene.anims.generateFrameNumbers('fireball', { start: 0, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('fireball_explode')) {
            this.scene.anims.create({
                key: 'fireball_explode',
                frames: this.scene.anims.generateFrameNumbers('fireball_explode', { start: 0, end: 6 }),
                frameRate: 10,
                repeat: 0
            });
        }
    }
}
