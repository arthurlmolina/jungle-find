export default class Archer extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'archer_idle');

        //Adiciona o arqueiro e a fisica na cena
        scene.add.existing(this);
        scene.physics.add.existing(this);

        
        this.setOrigin(0.5, 1); // posicionamento do personagem na colisao (inferior esquerdo)
        
        //ajuste de tamanho do frame do personagem
        const bodyWidth = 20;
        const bodyHeight = 35;
        this.body.setSize(bodyWidth, bodyHeight);

        // Configurações de física
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDragX(1);

        // Propriedades do arqueiro
        this.speed = 250; //velocidade do arqueiro
        this.jumpStrength = 270; //força do pulo
        this.arrows = false; //começa sem flechas
        this.lastShot = 0;
        this.shootCooldown = 500; // 500ms entre tiros
        this.facing = 'right'; //começa virado para direita
        this.health = 100; //vida

        this.createAnimations();

    }

    createAnimations(){
    //criação das animações
    if (!this.scene.anims.exists('archer_idle')) {
        this.scene.anims.create({
            key: 'archer_idle',
            frames: this.scene.anims.generateFrameNumbers('archer_idle', { start: 0, end: 10 }),
            frameRate: 9,
            repeat: -1
        });
    }

    if (!this.scene.anims.exists('archer_walk')) {
        this.scene.anims.create({
            key: 'archer_walk',
            frames: this.scene.anims.generateFrameNumbers('archer_walk', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
    }

    if (!this.scene.anims.exists('archer_shoot')) {
        this.scene.anims.create({
            key: 'archer_shoot',
            frames: this.scene.anims.generateFrameNumbers('archer_shoot', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: 0
        });
    }

    if (!this.scene.anims.exists('archer_jump')) {
    this.scene.anims.create({
        key: 'archer_jump',
        frames: this.scene.anims.generateFrameNumbers('archer_jump', { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1
    });
    }

    this.play('archer_idle');       
    }

    move(cursors){
        if (!cursors) return;

        //se apertar a seta esquerda
        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.anims.play('archer_walk', true);
            this.setFlipX(true); // virar para a esquerda
            this.facing = 'left';
        }
        //se apertar a seta esquerda
        else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.anims.play('archer_walk', true);
            this.setFlipX(false); // virar para a direita
            this.facing = 'right';
        }

        //parado
        else {
            this.setVelocityX(0);
            this.anims.play('archer_idle', true);
        }

        //se apertar seta para cima = pular (verifica se está no chão)
        if (cursors.up.isDown && this.body.blocked.down) {
            this.setVelocityY(-this.jumpStrength);
            this.anims.play('archer_jump', true);
        }

        // escolhe animação com base no estado
        if (!this.body.blocked.down) {
            //se estiver no ar
            this.anims.play('archer_jump', true);
        } else if (this.body.velocity.x !== 0) {
            //se tiver andando
            this.anims.play('archer_walk', true);
        } else {
            //se tiver parado
            this.anims.play('archer_idle', true);
        }
    }
}