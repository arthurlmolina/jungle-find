export default class Arrow extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y){
        super(scene, x, y, 'flechas');

        // Adiciona a flecha na cena
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configurações da flecha
        this.setScale(0.5);
        this.speed = 400;
        this.lifeTime = 3000; // 3 segundos de vida

        // Timer para autodestruição
        this.lifeTimer = scene.time.delayedCall(this.lifeTime, () => {
            this.destroy();
        });

        // Ajuste do corpo de colisão
        this.body.setSize(16, 4); // Flecha mais fina
    }


}