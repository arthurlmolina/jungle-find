export default class Goblin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, target) {
        super(scene, x, y, 'goblin_idle');

        // Adiciona o goblin e a física na cena
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1); // posicionamento do personagem na colisão (inferior esquerdo)

        // Ajuste de tamanho do frame do personagem
        const bodyWidth = 20;
        const bodyHeight = 35;
        this.body.setSize(bodyWidth, bodyHeight);

        // Configurações de física
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDragX(1);

        // Propriedades do goblin
        this.speed = 50; // velocidade mais lenta
        this.jumpStrength = 650;
        this.facing = 'left';
        this.health = 100;
        this.visionRange = 200; // alcance para "ver" o arqueiro
        this.target = target; // referência ao arqueiro

        this.direction = -1; // começa indo para a esquerda
        this.changeDirectionTimer = 0;

        this.createAnimations();
        this.play('goblin_idle');
    }

    createAnimations() {
        const anims = this.scene.anims;

        if (!anims.exists('goblin_idle')) {
            anims.create({
                key: 'goblin_idle',
                frames: anims.generateFrameNumbers('goblin_idle', { start: 0, end: 10 }),
                frameRate: 9,
                repeat: -1
            });
        }

        if (!anims.exists('goblin_walk')) {
            anims.create({
                key: 'goblin_walk',
                frames: anims.generateFrameNumbers('goblin_walk', { start: 0, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!anims.exists('goblin_shoot')) {
            anims.create({
                key: 'goblin_shoot',
                frames: anims.generateFrameNumbers('goblin_shoot', { start: 0, end: 6 }),
                frameRate: 12,
                repeat: 0
            });
        }

        if (!anims.exists('goblin_jump')) {
            anims.create({
                key: 'goblin_jump',
                frames: anims.generateFrameNumbers('goblin_jump', { start: 0, end: 1 }),
                frameRate: 3,
                repeat: -1
            });
        }
    }

    update(time, delta) {
        const distanceToTarget = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

        if (distanceToTarget <= this.visionRange) {
            // Está vendo o arqueiro, para e ataca
            this.setVelocityX(0);
            this.attack();
        } else {
            // Movimento automático de patrulha
            this.patrol(delta);
        }
    }

    patrol(delta) {
        // Alterna a direção a cada 3 segundos
        this.changeDirectionTimer += delta;
        if (this.changeDirectionTimer > 3000) {
            this.direction *= -1;
            this.changeDirectionTimer = 0;
        }

        this.setVelocityX(this.direction * this.speed);
        this.setFlipX(this.direction > 0); // vira para a direção correta
        this.play('goblin_walk', true);
    }

    attack() {
        if (this.anims.currentAnim?.key !== 'goblin_shoot') {
            this.play('goblin_shoot', true);
        }
    }
}
