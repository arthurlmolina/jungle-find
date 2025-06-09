// Em src/characters/Boss.js

export default class Boss extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, target) {
        super(scene, x, y, 'boss_idle');

        // --- ORDEM DE INICIALIZAÇÃO CORRETA ---
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5, 1);
        this.setScale(2.6); // É bom definir a escala antes de calcular os offsets visuais

        // --- ATRIBUTOS DO CHEFE ---
        this.health = 5;
        this.speed = 120;
        this.visionRange = 800;
        this.attackRange = 180;
        this.damage = 1;

        // --- CONTROLE DE ESTADO ---
        this.target = target;
        this.isDead = false;
        this.isAttacking = false;
        this.isHittable = true;

        // --- CONFIGURAÇÃO DA FÍSICA (CORRIGIDA) ---
        this.setCollideWorldBounds(true);
        this.body.setImmovable(true);

        // Pega a largura e altura do frame original da animação 'idle' (218x250)
        const frameWidth = this.frame.width;
        const frameHeight = this.frame.height;

        // 1. Defina o tamanho do corpo da física.
        // Estes valores parecem razoáveis para o seu sprite.
        const bodyWidth = 40;
        const bodyHeight = 100;
        this.body.setSize(bodyWidth, bodyHeight);

        // 2. Calcule o deslocamento (offset) para posicionar a hitbox
        const offsetX = (frameWidth - bodyWidth) / 2; // Centraliza horizontalmente

        // A fórmula para alinhar na base, mais um ajuste fino.
        // ✅ É AQUI QUE VOCÊ VAI MEXER PARA O AJUSTE FINAL ✅
        const ajusteVertical = 50; // Comece com este valor e ajuste.
        const offsetY = frameHeight - bodyHeight - ajusteVertical;

        this.body.setOffset(offsetX, offsetY);

        // --- FIM DA CONFIGURAÇÃO DA FÍSICA ---

        this.createAnimations();
        this.play('boss_idle');
    }

    createAnimations() {
        // As suas animações continuam aqui, sem alterações.
        // Lembre-se de ajustar os valores de 'end' para o número correto de frames.
        if (!this.scene.anims.exists('boss_idle')) {
            this.scene.anims.create({
                key: 'boss_idle',
                frames: this.scene.anims.generateFrameNumbers('boss_idle', { start: 0, end: 7 }),
                frameRate: 8,
                repeat: -1
            });
        }
        if (!this.scene.anims.exists('boss_run')) {
            this.scene.anims.create({
                key: 'boss_run',
                frames: this.scene.anims.generateFrameNumbers('boss_run', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }
        if (!this.scene.anims.exists('boss_attack')) {
            this.scene.anims.create({
                key: 'boss_attack',
                frames: this.scene.anims.generateFrameNumbers('boss_attack', { start: 0, end: 7 }),
                frameRate: 12,
                repeat: 0
            });
        }
        if (!this.scene.anims.exists('boss_death')) {
            this.scene.anims.create({
                key: 'boss_death',
                frames: this.scene.anims.generateFrameNumbers('boss_death', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: 0
            });
        }
    }

    // O Cérebro do Chefe (update) agora é mais simples
    update() {
        // Se estiver morto ou atacando, não faz nada.
        // A checagem de '!this.isActive' foi removida.
        if (this.isDead || this.isAttacking || !this.target) {
            return;
        }

        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

        if (distance < this.attackRange) {
            this.meleeAttack();
        } else if (distance < this.visionRange) {
            this.chase();
        } else {
            this.standBy();
        }
    }

    // O método activate() foi removido pois não é mais necessário.

    // Os métodos chase(), standBy(), meleeAttack(), takeDamage() e die()
    // continuam exatamente os mesmos da resposta anterior.
    chase() {
        this.anims.play('boss_run', true);
        if (this.target.x < this.x) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
        } else {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
        }
    }

    standBy() {
        this.setVelocityX(0);
        this.anims.play('boss_idle', true);
    }

    meleeAttack() {
                this.isAttacking = true;
        this.setVelocityX(0);
        this.anims.play('boss_attack', true);

        // Use o tempo de golpe que você achou ideal durante os testes
        const tempoDoGolpe = 500; 

        // Usamos um único timer para criar e destruir a hitbox
        this.scene.time.delayedCall(tempoDoGolpe, () => {
            // Checagem de segurança
            if (this.isDead || !this.isAttacking) {
                return;
            }

            // Use os valores de posição e tamanho que você achou ideais nos testes
            const offsetX = 130;
            const offsetY = 330;
            const hitboxWidth = 180;
            const hitboxHeight = 160;

            const hitboxX = this.x + (this.flipX ? -offsetX : offsetX);
            const hitboxY = this.y - offsetY;

            // 1. Cria a 'zone' invisível
            const attackHitbox = this.scene.add.zone(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
            this.scene.physics.world.enable(attackHitbox);
            attackHitbox.body.setAllowGravity(false);

            // 2. Verifica se acertou o alvo e causa o dano
            if (this.scene.physics.overlap(this.target, attackHitbox)) {
                this.target.takeDamage(this.damage);
            }

            // 3. Destrói a hitbox IMEDIATAMENTE após a verificação.
            //    Isso garante que o dano só possa ser aplicado uma vez por ataque.
            attackHitbox.destroy();
        });

        // Quando a animação de ataque INTEIRA terminar, o chefe pode agir de novo
        this.once('animationcomplete-boss_attack', () => {
            this.isAttacking = false;
        });
    }

    takeDamage(damage) {
        if (!this.isHittable) return;
        this.health -= damage;
        this.isHittable = false;
        this.setTint(0xff0000);
        if (this.isAttacking) {
            this.isAttacking = false;
            this.clearTint();
            this.play('boss_idle', true);
        }
        this.scene.time.delayedCall(150, () => {
            this.clearTint();
        });
        if (this.health <= 0) {
            this.die();
        } else {
            this.scene.time.delayedCall(500, () => {
                this.isHittable = true;
            });
        }
    }

    die() {
        this.isDead = true;
        this.body.enable = false;
        this.anims.play('boss_death', true);
        this.once('animationcomplete-boss_death', () => {
            this.destroy();
        });
    }
}