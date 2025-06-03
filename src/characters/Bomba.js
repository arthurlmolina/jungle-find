export default class Bomba extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, targetX, targetY) {
        super(scene, x, y, 'Bomba');

        // Adiciona a bomba na cena
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configurações da Bomba
        this.setScale(3);
        this.speed = 400;
        this.lifeTime = 5000; // 5 segundos de vida

        // Ajuste do corpo de colisão
        this.body.setSize(30, 20);
        this.body.setOffset(35, 35);

        // Habilita gravidade
        this.body.setAllowGravity(true);
        this.body.setGravityY(300);
        this.body.setBounce(0.3); // Um pouco de bounce para mais realismo

        this.setCollideWorldBounds(false);

        // Calcula a trajetória parabólica até o alvo
        this.calculateTrajectory(x, y, targetX, targetY);

        // Cria e inicia animações
        this.createAnimations();
        this.play('bomba_rotate');
        
        // Define profundidade
        this.setDepth(5);

        // Timer para autodestruição
        this.lifeTimer = scene.time.delayedCall(this.lifeTime, () => {
            this.explode();
        });

        console.log('Bomba criada:', x, y, '->', targetX, targetY);
    }

    calculateTrajectory(startX, startY, targetX, targetY) {
        // Calcula distância horizontal
        const deltaX = targetX - startX;
        const deltaY = targetY - startY;
        const distance = Math.abs(deltaX);
        
        // Velocidade horizontal baseada na distância
        const velocityX = deltaX > 0 ? this.speed : -this.speed;
        
        // Velocidade vertical para criar arco parabólico
        // Fórmula para projétil: considerando gravidade e distância
        const gravity = 300; // Mesma gravidade definida acima
        const time = distance / Math.abs(velocityX); // Tempo estimado de voo
        const velocityY = (deltaY / time) - (gravity * time / 2);
        
        // Define as velocidades
        this.setVelocity(velocityX, velocityY - 200); // -200 para dar mais arco
        
        // Define direção do sprite
        if (deltaX < 0) {
            this.setFlipX(true);
        }
    }

    createAnimations() {
        // Verifica se a animação já existe antes de criar
        if (!this.scene.anims.exists('bomba_rotate')) {
            this.scene.anims.create({
                key: 'bomba_rotate',
                frames: this.scene.anims.generateFrameNumbers('Bomba', { start: 0, end: 18 }),
                frameRate: 20, 
                repeat: -1
            });
        }
    }

    explode() {
        // Aqui você pode adicionar efeitos de explosão
        console.log('Bomba explodiu em:', this.x, this.y);
        
        // Remove a bomba
        if (this.lifeTimer) {
            this.lifeTimer.destroy();
        }
        this.destroy();
    }

    // Método chamado quando a bomba colide com algo
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        
        // Rotaciona a bomba baseada na velocidade para dar efeito visual
        if (this.body) {
            const angle = Math.atan2(this.body.velocity.y, this.body.velocity.x);
            this.setRotation(angle);
        }
    }
}