

export default class Goblin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, 'Ataque');
    
        //Adiciona o goblin e a fisica na cena
        scene.add.existing(this);
        scene.physics.add.existing(this);


        this.setOrigin(0.5, 1); // posicionamento do personagem na colisao
        
        //ajuste de tamanho do frame do personagem
        const bodyWidth = 20;
        const bodyHeight = 48; //35
        this.body.setSize(bodyWidth, bodyHeight);

        // Configurações de física
        this.setCollideWorldBounds(true);
        this.setBounce(0);
        this.setDragX(1);
 
        // Propriedades do goblin
        this.lastShot = 0;
        this.facing = 'left'; //começa virado para esquerda
        this.health = 100; //vida

        this.createAnimations();

        this.play('Ataque');

    }

    createAnimations(){

        if (!this.scene.anims.exists('Ataque')) {
            this.scene.anims.create({
                key: 'Ataque',
                frames: this.scene.anims.generateFrameNumbers('Ataque', { start: 11, end: 0 }), // ajuste "end" se necessário
                frameRate: 9,
                repeat: -1
             });
        }

    }
}