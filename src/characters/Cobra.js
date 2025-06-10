<<<<<<< Updated upstream
=======
import Fireball from "./Fireball";

>>>>>>> Stashed changes
export default class Cobra extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'worm_idle');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);

<<<<<<< Updated upstream
        const frameWidth = 80;    // Largura total do hitbox
        const frameHeight = 60;   // Altura total do  hitbox
        const cobraVisualWidth = 30;  // A largura real SÓ da parte desenhada da cobra
        const cobraVisualHeight = 40; // A altura real SÓ da parte desenhada da cobra

        this.body.setSize(cobraVisualWidth, cobraVisualHeight);

        // Calcula o offset para centralizar o corpo de física no hitbox
=======
        const frameWidth = 80;    // Largura total do quadro (frame) da sua imagem 'Cobra'
        const frameHeight = 60;   // Altura total do quadro (frame) da sua imagem 'Cobra'
        const cobraVisualWidth = 30;  // A largura real SÓ da parte desenhada da cobra
        const cobraVisualHeight = 30; // A altura real SÓ da parte desenhada da cobra

        this.body.setSize(cobraVisualWidth, cobraVisualHeight);

        // Calcula o offset para centralizar o corpo de física no visual
>>>>>>> Stashed changes
        const offsetX = (frameWidth - cobraVisualWidth) / 2;
        const offsetY = (frameHeight - cobraVisualHeight) / 2; // Ajuste se a cobra não estiver verticalmente centrada

        this.body.setOffset(offsetX, frameHeight - cobraVisualHeight - 2);

        this.fireCooldown = 2000;
        this.lastFireTime = 0;
        this.visionRadius = 250;
        this.target = null;
        this.health = 10;
        this.isDead = false;
        this.isAttacking = false;
        this.attackCooldown = false;
        this.isHittable = true;

        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDragX(1);

        this.createAnimations();
        this.play('worm_idle'); // TOCA A ANIMAÇÃO

        this.setScale(4.8); //alterar o tamanho do personagem 
        this.setDepth(0);

        this.setFlipX(true);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
    }

    createAnimations() {
        // só cria se ainda não existir
        if (!this.scene.anims.exists('worm_idle')) {
            this.scene.anims.create({
                key: 'worm_idle',
                frames: this.scene.anims.generateFrameNumbers('worm_idle', { start: 0, end: 8 }),
                frameRate: 9,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('worm_attack')) {
            this.scene.anims.create({
                key: 'worm_attack',
                frames: this.scene.anims.generateFrameNumbers('worm_attack', { start: 0, end: 15 }),
                frameRate: 11,
                repeat: 0
            });
        }

        if (!this.scene.anims.exists('worm_death')) {
            this.scene.anims.create({
                key: 'worm_death',
                frames: this.scene.anims.generateFrameNumbers('worm_death', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: 0
            });
        }
    }

    update(arqueiro) {
        // Se estiver morto, atacando, ou se recuperando de um hit, não faz nada.
        if (this.isDead || this.isAttacking) return;

        const distancia = Phaser.Math.Distance.Between(this.x, this.y, arqueiro.x, arqueiro.y);

        // Lógica para iniciar o ataque
        if (distancia < 750) {
            this.isAttacking = true;
            this.play('worm_attack', true);

<<<<<<< Updated upstream
=======
            // GARANTA QUE APENAS ESTA LINHA EXISTA PARA CRIAR O TIMER.
            // ELA CRIA O TIMER E O ARMAZENA PARA QUE POSSA SER CANCELADO.
>>>>>>> Stashed changes
            this.attackTimer = this.scene.time.delayedCall(1100, () => {
                // Verificação de segurança: só cria a bola de fogo se AINDA estiver atacando.
                if (this.isAttacking) {
                    this.scene.somFireball.play();
                    this.createFireball();
                }
            });

            // Evento para quando a animação de ataque termina normalmente.
            this.once('animationcomplete-worm_attack', () => {
                if (this.isAttacking) {
                    this.isAttacking = false;
                    this.play('worm_idle', true);
                }
            });
        }
    }

    createFireball() {
<<<<<<< Updated upstream
        // posição de onde a fireball vai sair
        const spawnX = this.body.center.x + (this.flipX ? -50 : 50);
        const spawnY = this.body.center.y + 15;

        // pede uma fireball (nova ou reutilizada) para o grupo da cena
        const fireball = this.scene.fireballs.get();

        // se o grupo conseguiu nos dar uma fireball
        if (fireball) {
            // chama o método 'launch' para configurá-la e dispará-la!
=======
        // Posição de onde a fireball vai sair
        const spawnX = this.body.center.x + (this.flipX ? -40 : 40);
        const spawnY = this.body.center.y - 10;

        // 1. Pede uma fireball (nova ou reutilizada) para o grupo da cena
        const fireball = this.scene.fireballs.get();

        // 2. Se o grupo conseguiu nos dar uma fireball...
        if (fireball) {
            // 3. Chame o método 'launch' para configurá-la e dispará-la!
>>>>>>> Stashed changes
            fireball.launch(spawnX, spawnY, this.flipX);
        }
    }

    takeHit() {
<<<<<<< Updated upstream
        // a verificação de invencibilidade e morte continua essencial
=======
        // A verificação de invencibilidade e morte continua essencial
>>>>>>> Stashed changes
        if (!this.isHittable || this.isDead) {
            return;
        }

        // lógica de dano e feedback (piscar a worm de vermelho para sinalizar o dano)
        this.isHittable = false;
        this.health--;

        this.setTint(0xff0000);
        this.scene.time.delayedCall(150, () => {
            this.clearTint();
        });

        if (this.health <= 0) {
            this.die();
        }

<<<<<<< Updated upstream
        // o timer para se tornar vulnerável
=======
        // O timer para se tornar vulnerável novamente continua aqui.
>>>>>>> Stashed changes
        this.scene.time.delayedCall(500, () => {
            this.isHittable = true;
        });
    }

<<<<<<< Updated upstream
=======
    // Também adicione este método 'die()' para organizar o código da morte
>>>>>>> Stashed changes
    die() {
        this.isAttacking = false;

        this.isDead = true;
        this.play('worm_death', true);

<<<<<<< Updated upstream
        // desativa a física para que o inimigo não possa mais interagir
        this.body.enable = false;

        // remover a worm apos a morte
=======
        // Desativa a física para que o inimigo não possa mais interagir
        this.body.enable = false;

        // Opcional: fazer o corpo desaparecer após a animação de morte
>>>>>>> Stashed changes
        this.once('animationcomplete-worm_death', () => {
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 300,
                onComplete: () => {
<<<<<<< Updated upstream
                    this.destroy(); // remove completamente o inimigo da cena
=======
                    this.destroy(); // Remove completamente o inimigo da cena
>>>>>>> Stashed changes
                }
            });
        });
    }
}
