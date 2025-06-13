export default class Archer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'archer_idle');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1); 

        const bodyWidth = 20;
        const bodyHeight = 35;
        this.body.setSize(bodyWidth, bodyHeight);

        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDragX(1);

        this.speed = 290;
        this.jump = 640; 
        this.arrows = false; 
        this.lastShot = 0;
        this.shootCooldown = 750; 
        this.facing = 'right';
        this.health = 6; 
        this.isHittable = true;
        this.isShooting = false; 
        this.isDead = false;
        this.canDoubleJump = false; 
        this.jumpCount = 0;        
         
        this.createAnimations();

        this.setScale(2.8); 
        this.setDepth(0);
    }

    createAnimations() {
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

        if (this.body.blocked.down) {
            this.jumpCount = 0;
        }

        const isJumpJustPressed = Phaser.Input.Keyboard.JustDown(cursors.up);

        if (isJumpJustPressed) {
            if (this.body.blocked.down) {
                this.scene.somPuloArqueiro.play();
                this.setVelocityY(-this.jump);
                this.jumpCount = 1;
            }
            else if (this.canDoubleJump && this.jumpCount < 2) {
                this.scene.somPuloArqueiro.play(); 
                this.setVelocityY(-this.jump);   
                this.jumpCount = 2;              
            }
        }

        
        if (!this.body.blocked.down) {
            if (this.body.velocity.y < 0) {
                this.anims.play('archer_jump', true);
            }
            else if (this.body.velocity.y > 50) { 
                this.anims.play('archer_fall', true);
            }
        }else if (this.body.velocity.x !== 0) {
            this.anims.play('archer_walk', true);
        } else {
            this.anims.play('archer_idle', true);
        }
    }

    enableDoubleJump() {
        this.canDoubleJump = true;
    }

    shoot() {
        const currentTime = this.scene.time.now; 

        if (currentTime - this.lastShot < this.shootCooldown) {
            return;
        }

        this.isShooting = true; 
        this.lastShot = currentTime;

        this.anims.play('archer_shoot', true);

        this.scene.time.delayedCall(250, () => {
            this.scene.somFlecha.play();
            this.createArrow();
        });

        this.once('animationcomplete-archer_shoot', () => {
            this.isShooting = false;
        });

    }

    createArrow() {
        const offsetY = 15; 
        const offsetX = this.facing === 'right' ? 30 : -30;
        const arrowX = this.x + offsetX;
        const arrowY = this.body.y + offsetY; 

        const arrow = this.scene.arrows.get();

        if (arrow) {
            arrow.launch(arrowX, arrowY, this.facing);
        }
    }

    takeDamage(damage) {
        if (this.isDead || !this.isHittable) {
            return;
        }

        this.scene.somHitArqueiro.play();

        this.isHittable = false;
        this.health -= damage; 

        this.emit('health_changed');

        this.scene.flashScreen();

        if (this.health <= 0) {
            this.die();
        } else {
            this.scene.time.delayedCall(500, () => { 
                this.isHittable = true;
            });
        }

    }

    die() {
        if (this.isDead) {
            return;
        }

        this.isDead = true;

        this.setVelocity(0, 0);
        this.body.enable = false;

        this.scene.somGameOver.play();

        this.anims.play('archer_death', true);

        this.once('animationcomplete-archer_death', () => {
            this.emit('died');
        });

    }

    collectArrows() {
        this.arrows = true;
    }

    hasArrows() {
        return this.arrows;
    }

}