export default class Cobra extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'worm_idle');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);

        const frameWidth = 80;    
        const frameHeight = 60;   
        const cobraVisualWidth = 30;  
        const cobraVisualHeight = 40; 

        this.body.setSize(cobraVisualWidth, cobraVisualHeight);

        const offsetX = (frameWidth - cobraVisualWidth) / 2;
        const offsetY = (frameHeight - cobraVisualHeight) / 2;

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
        this.play('worm_idle'); 

        this.setScale(4.8); 
        this.setDepth(0);

        this.setFlipX(true);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
    }

    createAnimations() {
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
        if (this.isDead || this.isAttacking) return;

        const distancia = Phaser.Math.Distance.Between(this.x, this.y, arqueiro.x, arqueiro.y);

        if (distancia < 750) {
            this.isAttacking = true;
            this.play('worm_attack', true);

            this.attackTimer = this.scene.time.delayedCall(1100, () => {
                if (this.isAttacking) {
                    this.scene.somFireball.play();
                    this.createFireball();
                }
            });

            this.once('animationcomplete-worm_attack', () => {
                if (this.isAttacking) {
                    this.isAttacking = false;
                    this.play('worm_idle', true);
                }
            });
        }
    }

    createFireball() {
        const spawnX = this.body.center.x + (this.flipX ? -50 : 50);
        const spawnY = this.body.center.y + 15;

        const fireball = this.scene.fireballs.get();

        if (fireball) {
            fireball.launch(spawnX, spawnY, this.flipX);
        }
    }

    takeHit() {
        if (!this.isHittable || this.isDead) {
            return;
        }

        this.isHittable = false;
        this.health--;

        this.setTint(0xff0000);
        this.scene.time.delayedCall(150, () => {
            this.clearTint();
        });

        if (this.health <= 0) {
            this.die();
        }

        this.scene.time.delayedCall(500, () => {
            this.isHittable = true;
        });
    }

    die() {
        this.isAttacking = false;

        this.isDead = true;
        this.play('worm_death', true);

        this.body.enable = false;

        this.once('animationcomplete-worm_death', () => {
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.destroy();
                }
            });
        });
    }
}
