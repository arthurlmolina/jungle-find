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
        this.speed = 200; //velocidade do arqueiro
        this.jump = 650; //força do pulo
        this.arrows = false; //começa sem flechas
        this.lastShot = 0;
        this.shootCooldown = 750; // 500ms entre tiros
        this.facing = 'right'; //começa virado para direita
        this.health = 100; //vida
        this.isShooting = false; //controlar se estiver atirando

        this.createAnimations();

        // Criar grupo de flechas
        this.arrowGroup = scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: 10,
            runChildUpdate: true
        });

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
            frames: this.scene.anims.generateFrameNumbers('archer_shoot', { start: 0, end: 5 }),
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

    if (!this.scene.anims.exists('archer_fall')) {
    this.scene.anims.create({
        key: 'archer_fall',
        frames: this.scene.anims.generateFrameNumbers('archer_fall', { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1
    });
    }

    this.play('archer_idle');       
    }

    move(cursors){
        if (!cursors) return;

        // Verifica se deve atirar (tecla SPACE ou CTRL)
        if (cursors.space && cursors.space.isDown && !this.isShooting) {
            this.shoot();
        }

        // Se estiver atirando, não permite movimento
        if (this.isShooting) {
            this.setVelocityX(0);
            return;
        }

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
            this.setVelocityY(-this.jump);
            this.anims.play('archer_jump', true);
        }

        // escolhe animação com base no estado
        if (!this.body.blocked.down) {
            if (this.body.velocity.y < 0) {
                this.anims.play('archer_jump', true);
            }
            // Se está descendo (velocidade Y positiva) = caindo
            else if (this.body.velocity.y > 0) {
                this.anims.play('archer_fall', true);
            }
        } else if (this.body.velocity.x !== 0) {
            //se tiver andando
            this.anims.play('archer_walk', true);
        } else {
            //se tiver parado
            this.anims.play('archer_idle', true);
        }
    }

    shoot(){
        const currentTime = this.scene.time.now; // pega o tempo que atirou

        // Verifica cooldown
        if (currentTime - this.lastShot < this.shootCooldown) {
            return;
        }

        this.isShooting = true; // atirando
        this.lastShot = currentTime; // atualiza o tempo da ultima flecha

        // Toca a animação de atirar
        this.anims.play('archer_shoot', true);

        // Cria a flecha após um pequeno delay (para sincronizar com a animação)
        this.scene.time.delayedCall(200, () => {
            this.createArrow();
        });

        // Reseta o estado de tiro quando a animação terminar
        this.once('animationcomplete-archer_shoot', () => {
            this.isShooting = false;
        });
        
    }

    createArrow(){

    }
}