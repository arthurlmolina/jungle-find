import Fireball from "./Fireball";

export default class Cobra extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'worm_idle');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);

        // DADOS DE EXEMPLO - SUBSTITUA PELOS VALORES REAIS DA SUA IMAGEM
        const frameWidth = 80;    // Largura total do quadro (frame) da sua imagem 'Cobra'
        const frameHeight = 60;   // Altura total do quadro (frame) da sua imagem 'Cobra'
        const cobraVisualWidth = 30;  // A largura real SÓ da parte desenhada da cobra
        const cobraVisualHeight = 28; // A altura real SÓ da parte desenhada da cobra

        this.body.setSize(cobraVisualWidth, cobraVisualHeight);

        // Calcula o offset para centralizar o corpo de física no visual
        const offsetX = (frameWidth - cobraVisualWidth) / 2;
        const offsetY = (frameHeight - cobraVisualHeight) / 2; // Ajuste se a cobra não estiver verticalmente centrada

        // ATENÇÃO: Se você usa setOrigin(0.5, 1), a origem Y está na base.
        // O offset ainda é do topo, então você pode precisar de um ajuste fino aqui.
        // O ideal é usar o debug visual para acertar.
        // Comece com o cálculo centralizado e ajuste.
        this.body.setOffset(offsetX, frameHeight - cobraVisualHeight - 2);

        this.fireCooldown = 2000;
        this.lastFireTime = 0;
        this.visionRadius = 250;
        this.target = null;
        this.health = 4;
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

            // GARANTA QUE APENAS ESTA LINHA EXISTA PARA CRIAR O TIMER.
            // ELA CRIA O TIMER E O ARMAZENA PARA QUE POSSA SER CANCELADO.
            this.attackTimer = this.scene.time.delayedCall(1100, () => {
                // Verificação de segurança: só cria a bola de fogo se AINDA estiver atacando.
                if (this.isAttacking) {
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
        // Posição de onde a fireball vai sair
        const spawnX = this.body.center.x + (this.flipX ? -40 : 40);
        const spawnY = this.body.center.y - 10;

        // 1. Pede uma fireball (nova ou reutilizada) para o grupo da cena
        const fireball = this.scene.fireballs.get();

        // 2. Se o grupo conseguiu nos dar uma fireball...
        if (fireball) {
            // 3. Chame o método 'launch' para configurá-la e dispará-la!
            fireball.launch(spawnX, spawnY, this.flipX);
        }
    }

    takeHit() {
        // A verificação de invencibilidade e morte continua essencial
        if (!this.isHittable || this.isDead) {
            return;
        }

        // A lógica de interrupção de ataque foi REMOVIDA daqui.

        // A lógica de dano e feedback continua:
        this.isHittable = false;
        this.health--;

        this.setTint(0xff0000);
        this.scene.time.delayedCall(150, () => {
            this.clearTint();
        });

        if (this.health <= 0) {
            this.die();
        }

        // O timer para se tornar vulnerável novamente continua aqui.
        this.scene.time.delayedCall(500, () => {
            this.isHittable = true;
        });
    }

    // Também adicione este método 'die()' para organizar o código da morte
    die() {
        this.isDead = true;
        this.play('worm_death', true);

        // Desativa a física para que o inimigo não possa mais interagir
        this.body.enable = false;

        // Opcional: fazer o corpo desaparecer após a animação de morte
        this.once('animationcomplete-worm_death', () => {
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.destroy(); // Remove completamente o inimigo da cena
                }
            });
        });
    }
}
