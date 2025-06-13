export default class Boss extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, target) {
        super(scene, x, y, 'boss_idle');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5, 1);
        this.setScale(2.6);

        this.health = 20;
        this.maxHealth = 20;
        this.speed = 120;
        this.modoFuriaSpeed = 160;
        this.visionRange = 800;
        this.attackRange = 180;
        this.damage = 1;

        this.target = target; 
        this.isDead = false;
        this.isAttacking = false;
        this.isHittable = true;
        this.modoFuria = false;

        this.setCollideWorldBounds(true);
        this.body.setImmovable(true);

        const frameWidth = this.frame.width;
        const frameHeight = this.frame.height;

        const bodyWidth = 40;
        const bodyHeight = 100;
        this.body.setSize(bodyWidth, bodyHeight);

        const offsetX = (frameWidth - bodyWidth) / 2;

        const ajusteVertical = 50;
        const offsetY = frameHeight - bodyHeight - ajusteVertical;

        this.body.setOffset(offsetX, offsetY);

        this.createAnimations();
        this.play('boss_idle');

        this.healthBar = this.scene.add.graphics();
        this.drawHealthBar(); 
    }

    createAnimations() {
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
                frames: this.scene.anims.generateFrameNumbers('boss_death', { start: 0, end: 6 }),
                frameRate: 10,
                repeat: 0
            });
        }
    }

    update() {
        if (!this.isDead && this.healthBar) {
            const verticalOffset = 420;
            this.healthBar.setPosition(this.x, this.y - verticalOffset);
        }

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

    chase() {
        const deadZone = 10;
        const distanceX = Math.abs(this.x - this.target.x);

        if (distanceX <= deadZone) {
            this.setVelocityX(0);
        }else if (this.target.x < this.x) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);
        }else {
            this.setVelocityX(this.speed);
            this.setFlipX(false);
        }

        if (this.body.velocity.x === 0) {
            this.anims.play('boss_idle', true);
        } else {
            this.anims.play('boss_run', true);
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

        const tempoDoGolpe = 500;

        this.scene.time.delayedCall(tempoDoGolpe, () => {
            if (this.isDead || !this.isAttacking) {
                return;
            }

            const offsetX = 130;
            const offsetY = 330;
            const hitboxWidth = 180;
            const hitboxHeight = 160;

            const hitboxX = this.x + (this.flipX ? -offsetX : offsetX);
            const hitboxY = this.y - offsetY;

            const attackHitbox = this.scene.add.zone(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
            this.scene.physics.world.enable(attackHitbox);
            attackHitbox.body.setAllowGravity(false);

            if (this.scene.physics.overlap(this.target, attackHitbox)) {
                this.target.takeDamage(this.damage);
            }

            attackHitbox.destroy();
        });

        this.once('animationcomplete-boss_attack', () => {
            this.isAttacking = false;
        });
    }

    takeDamage(damage) {
        if (!this.isHittable || this.isDead) return;

        this.health -= damage;
        this.drawHealthBar();
        this.isHittable = false;
        this.setTint(0xff0000); 

        this.scene.time.delayedCall(150, () => {
            if (this.modoFuria) {
                this.setTint(0xff0000); 
            } else {
                this.clearTint();
            }
        });

        if (this.health <= 0) {
            this.isDead = true;
            this.setVelocity(0, 0);
            this.anims.stop(); 

            this.scene.physics.world.timeScale = 4; 
            this.scene.time.timeScale = 0.4;     

            const slowMoDuration = 500; 

            this.scene.time.delayedCall(slowMoDuration, () => {

                this.scene.physics.world.timeScale = 1;
                this.scene.time.timeScale = 1;

                this.die();
            });

        } else {
            if (!this.modoFuria && this.health <= this.maxHealth / 2) {
                this.modoFuria = true;
                this.ativarModoFuria();
            }

            this.scene.time.delayedCall(500, () => {
                this.isHittable = true;
            });
        }
    }

    ativarModoFuria() {
        this.speed = this.modoFuriaSpeed;

        this.setTint(0xff0000);

        this.scene.cameras.main.shake(550, 0.01);
    }

    die() {
        this.body.enable = false;

        if (this.healthBar) {
            this.healthBar.destroy();
        }

        this.scene.somMorteBoss.play();

        this.anims.play('boss_death', true);
        this.once('animationcomplete-boss_death', () => {
            this.destroy();
        });
    }

    drawHealthBar() {
        this.healthBar.clear();

        const barWidth = 150; 
        const barHeight = 2;  
        const x = -barWidth / 2;
        const y = 0;

        this.healthBar.fillStyle(0x540d0d);
        this.healthBar.fillRect(x, y, barWidth, barHeight);

        const healthPercentage = this.health / this.maxHealth;
        const currentHealthWidth = barWidth * healthPercentage;
        this.healthBar.fillStyle(0x00ff00);
        this.healthBar.fillRect(x, y, currentHealthWidth, barHeight);
    }
}