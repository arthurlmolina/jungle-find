export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  preload() {
    this.load.video('intro', '/jungle-find/src/assets/cutscenes/Intro.mp4');
  }

  create() {
    const video = this.add.video(400, 300, 'intro');
    video.setDisplaySize(200, 250); // Tamanho do jogo
    video.setOrigin(0.5);
    video.play(false); // false = sem som, autoplay funciona em mais navegadores

    video.on('complete', () => {
      this.scene.start('MainScene'); // Vai para o jogo
      
    });
    
    // Se o usuário clicar com o botão esquerdo do mouse
    this.input.once('pointerdown', () => {
      video.stop(); // Para o vídeo (não obrigatório, mas evita problemas)
      this.scene.start('MainScene');
    });
  }

  
}