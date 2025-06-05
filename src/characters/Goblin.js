// import Bomba from './Bomba.js';

// export default class Goblin extends Phaser.Physics.Arcade.Sprite {
//     constructor(scene, x, y){
//         super(scene, x, y, 'Ataque');
    
//         // Adiciona o goblin e a física na cena
//         scene.add.existing(this);
//         scene.physics.add.existing(this);

//         this.setOrigin(0.5, 1);
        
//         // Ajuste de tamanho do frame do personagem
//         const bodyWidth = 25;
//         const bodyHeight = 48;
//         this.body.setSize(bodyWidth, bodyHeight);

//         // Configurações de física
//         this.setCollideWorldBounds(true);
//         this.setBounce(0);
//         this.setDragX(1);
 
//         // Propriedades do goblin
//         this.lastShot = 0;
//         this.facing = 'left';
//         this.health = 100;
//         this.bombaCooldown = 2000; // 2 segundos entre bombas

//         this.createAnimations();
//         this.play('goblin_attack');
//     }

//     jogaBomba() {
//     const agora = this.scene.time.now;

//     if (agora - this.lastShot < this.bombaCooldown) {
//         return;
//     }

//     this.lastShot = agora;

//     // Inicia a animação de ataque
//     this.play('goblin_attack');

//     // Espera um tempo (ex: 400ms) até lançar a bomba — ajuste conforme necessário
//     this.scene.time.delayedCall(400, () => {
//         // Ajuste fino da posição da mão do goblin
//         const offsetY = - 245;
//         const offsetX = this.facing === 'left' ? -20 : 20;

//         const bombaX = this.x + offsetX;
//         const bombaY = this.y + offsetY;

//         const targetX = this.scene.arqueiro ? this.scene.arqueiro.x : bombaX + 200;
//         const targetY = this.scene.arqueiro ? this.scene.arqueiro.y - 20 : bombaY;

//         const bomba = new Bomba(this.scene, bombaX, bombaY, targetX, targetY);

//         if (this.scene.bombasGroup) {
//             this.scene.bombasGroup.add(bomba);
//         }

//         console.log('Goblin lançou bomba!');
//     });
//     }

//     update() {
//         // Determina direção baseada na posição do arqueiro
//         if (this.scene.arqueiro) {
//             if (this.scene.arqueiro.x < this.x) {
//                 this.facing = 'left';
//                 this.setFlipX(false);
//             } else {
//                 this.facing = 'right';
//                 this.setFlipX(true);
//             }
//         }
//     }

//     createAnimations(){
//         if (!this.scene.anims.exists('goblin_attack')) {
//             this.scene.anims.create({
//                 key: 'goblin_attack',
//                 frames: this.scene.anims.generateFrameNumbers('Ataque', { start: 11, end: 0 }),
//                 frameRate: 8,
//                 repeat: -1
//             });
//         }

//         // Escuta o evento do frame
//     this.on('animationupdate-goblin_attack', (anim, frame, gameObject) => {
//         if (frame.index === 5) { // Substitua 5 pelo índice certo do arremesso
//             this.jogaBomba();
//         }
//     });
//     }

//     takeDamage(amount) {
//         this.health -= amount;
//         if (this.health <= 0) {
//             this.die();
//         }
//     }

//     die() {
//         console.log('Goblin morreu!');
//         this.destroy();
//     }
// }