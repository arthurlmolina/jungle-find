export default class Archer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'archer_idle');

        //Adiciona o arqueiro e a fisica na cena
        scene.add.existing(this);
        scene.physics.add.existing(this);


        this.setOrigin(0.5, 1); // posicionamento do personagem na colisao (inferior esquerdo)

        //ajuste de tamanho da zona (hitbox) do personagem
        const bodyWidth = 20;
        const bodyHeight = 35;
        this.body.setSize(bodyWidth, bodyHeight);

        // Configurações de física
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDragX(1);

        // Propriedades do arqueiro
        this.speed = 290; //velocidade do arqueiro
        this.jump = 640; //força do pulo
        this.arrows = false; //começa sem flechas
        this.lastShot = 0;
        this.shootCooldown = 750; // 500ms entre tiros
        this.facing = 'right'; //começa virado para direita
        this.health = 6; //vida
        this.isHittable = true;
        this.isShooting = false; //controlar se estiver atirando
        this.isDead = false;
        this.canDoubleJump = false; // Começa FALSO. Só a MainScene pode ativar.
        this.jumpCount = 0;         // Contador de pulos.
        this.createAnimations();

        this.setScale(2.8); //alterar o tamanho do personagem 
        this.setDepth(0);
    }

    createAnimations() {
        //criação das animações
        if (!this.scene.anims.exists('archer_idle')) {
            this.scene.anims.create({
                key: 'archer_idle',
                frames: this.scene.anims.generateFrameNumbers('archer_idle', { start: 0, end: 9 }),
                frameRate: 9,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('archer_walk')) {
            this.scene.anims.create({
                key: 'archer_walk',
                frames: this.scene.anims.generateFrameNumbers('archer_walk', { start: 0, end: 7 }),
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

        if (!this.scene.anims.exists('archer_death')) {
            this.scene.anims.create({
                key: 'archer_death',
                frames: this.scene.anims.generateFrameNumbers('archer_death', { start: 0, end: 9 }),
                frameRate: 10,
                repeat: 0
            });
        }

        this.play('archer_idle');
    }

    move(cursors) {
        if (this.isDead || !cursors) return;

        // ... (lógica de atirar e movimento horizontal continua a mesma)
        if (cursors.space && cursors.space.isDown && this.arrows && !this.isShooting) {
            this.shoot();
        }
        if (this.isShooting) {
            this.setVelocityX(0);
            return;
        }
        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
            this.facing = 'left';
        } else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
            this.facing = 'right';
        } else {
            this.setVelocityX(0);
        }

        // Se o personagem está no chão, reseta o contador de pulos.
        if (this.body.blocked.down) {
            this.jumpCount = 0;
        }

        // Usamos JustDown para registrar o pulo apenas uma vez por aperto de tecla.
        const isJumpJustPressed = Phaser.Input.Keyboard.JustDown(cursors.up);

        // Lógica do Pulo
        if (isJumpJustPressed) {
            // Se está no chão, executa o primeiro pulo.
            if (this.body.blocked.down) {
                this.scene.somPuloArqueiro.play();
                this.setVelocityY(-this.jump);
                this.jumpCount = 1;
            }
            // Se NÃO está no chão, MAS PODE dar pulo duplo E ainda só pulou uma vez...
            else if (this.canDoubleJump && this.jumpCount < 2) {
                this.scene.somPuloArqueiro.play(); // Toca o som de novo
                this.setVelocityY(-this.jump);   // Aplica a força do pulo novamente
                this.jumpCount = 2;              // Contabiliza o segundo pulo
            }
        }

        // Lógica de Animações (baseado no estado atual)
        // Se o corpo NÃO está bloqueado embaixo (está no ar)
        if (!this.body.blocked.down) {
            // Se está subindo (velocidade Y negativa), toca a animação de pulo
            if (this.body.velocity.y < 0) {
                this.anims.play('archer_jump', true);
            }
            // Se está descendo E a velocidade da queda é maior que um pequeno limiar
            else if (this.body.velocity.y > 50) { 
                this.anims.play('archer_fall', true);
            }
        }
        // Se o corpo ESTÁ bloqueado embaixo (no chão ou em um inimigo)
        else if (this.body.velocity.x !== 0) {
            // E está se movendo para os lados, toca a animação de andar
            this.anims.play('archer_walk', true);
        } else {
            // E está parado, toca a animação de parado
            this.anims.play('archer_idle', true);
        }
    }

    enableDoubleJump() {
        this.canDoubleJump = true;
    }

    shoot() {
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
        this.scene.time.delayedCall(250, () => {
            this.scene.somFlecha.play();
            this.createArrow();
        });

        // Reseta o estado de tiro quando a animação terminar
        this.once('animationcomplete-archer_shoot', () => {
            this.isShooting = false;
        });

    }

    createArrow() {
        // Posição de spawn da flecha
        const offsetY = 15; // No meio da altura do corpo de física
        const offsetX = this.facing === 'right' ? 30 : -30;
        const arrowX = this.x + offsetX;
        const arrowY = this.body.y + offsetY; 

        // Pede uma flecha para o grupo da cena
        const arrow = this.scene.arrows.get();

        if (arrow) {
            // Dispara a flecha a partir da posição calculada
            arrow.launch(arrowX, arrowY, this.facing);
        }
    }

    takeDamage(damage) {
        // Se não pode ser atingido (está invencível) ou já está morto, não faz nada
        if (this.isDead || !this.isHittable) {
            return;
        }

        this.scene.somHitArqueiro.play();

        // Fica invencível
        this.isHittable = false;
        this.health -= damage; // Decrementa a vida

        // Emite um evento para a cena saber que a vida mudou e precisa atualizar a UI
        this.emit('health_changed');

        this.scene.flashScreen();

        // Se a vida chegar a zero, chama o método de morte
        if (this.health <= 0) {
            this.die();
        } else {
            this.scene.time.delayedCall(500, () => { // 1 segundo de invencibilidade
                this.isHittable = true;
            });
        }

        // Timer para voltar a ser vulnerável após um tempo

    }

    die() {
        // Impede que a função seja chamada várias vezes
        if (this.isDead) {
            return;
        }

        this.isDead = true;

        // Para o personagem no lugar e desativa a física do corpo
        this.setVelocity(0, 0);
        this.body.enable = false;

        this.scene.somGameOver.play();

        // Toca a animação de morte
        this.anims.play('archer_death', true);

        // Ouve o evento que avisa quando a animação de morte TERMINOU
        this.once('animationcomplete-archer_death', () => {
            // SÓ DEPOIS que a animação terminar, emite o evento 'died'
            // para a MainScene finalmente chamar a tela de Game Over.
            this.emit('died');
        });

    }

    // Método para coletar flechas 
    collectArrows() {
        this.arrows = true;
    }

    // Método para verificar se tem flechas
    hasArrows() {
        return this.arrows;
    }

}