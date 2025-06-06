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
        this.attackTimer = null;
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
                frameRate: 10,
                repeat: 0
            });
        }

        if (!this.scene.anims.exists('worm_hit')) {
            this.scene.anims.create({
                key: 'worm_hit',
                frames: this.scene.anims.generateFrameNumbers('worm_get_hit', { start: 0, end: 2 }),
                frameRate: 10,
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
        if (this.isDead || this.isAttacking || !this.isHittable) return;

        const distancia = Phaser.Math.Distance.Between(this.x, this.y, arqueiro.x, arqueiro.y);

        if (distancia < 750) {
            this.isAttacking = true;
            this.play('worm_attack', true);
            // Cria a bola de fogo após um pequeno delay (para sincronizar com a animação)
            this.scene.time.delayedCall(1200, () => {
                this.createFireball();
            });

            this.once('animationcomplete-worm_attack', () => {
                // Simula dano no arqueiro
                this.isAttacking = false;
                this.play('worm_idle', true);
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
        // Se não pode ser atingido ou já está morto, para tudo.
        if (!this.isHittable || this.isDead) return;
        

        // --- A MUDANÇA PRINCIPAL ESTÁ AQUI ---
        // O ato de ser atingido tem prioridade máxima e cancela o ataque ATUAL.

        // 1. Imediatamente define que não está mais atacando.
        this.isAttacking = false;

        // 2. Cancela qualquer fireball que estava prestes a ser criada.
        if (this.attackTimer) {
            this.attackTimer.remove();
        }
        // ------------------------------------

        // Agora, o resto da lógica de "hit"
        this.isHittable = false;
        this.health--;

        this.setTint(0xff0000);
        this.scene.time.delayedCall(150, () => {
            this.clearTint();
        });

        if (this.health <= 0) {
            this.die();
        } else {
            // Toca a animação de "hit", interrompendo qualquer outra que estivesse tocando.
            this.play('worm_hit', true);

            // Quando a animação de hit terminar, apenas volta para o estado 'idle'.
            // Não precisa mais mexer com a flag 'isAttacking' aqui.
            this.once('animationcomplete-worm_hit', () => {
                if (!this.isDead) {
                    this.play('worm_idle', true);
                }
            });
        }

        // O timer de invencibilidade continua igual.
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
