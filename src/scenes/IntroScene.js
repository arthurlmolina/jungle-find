export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  preload() {
    this.load.video('intro', '/assets/cutscenes/Intro.mp4');
    this.load.audio('type', '/audios/type.mp3');
  }

  create() {
    this.frases = [
      "Em um mundo selvagem chamado Nébula,",
      "um arqueiro acorda sem memórias em uma cabana",
      "de uma vila esquecida chamada Zalensk.",
      "Tudo ao redor parece abandonado,",
      "com máquinas antigas paradas há muito tempo.",
      "O mundo está envolto por uma mata densa e misteriosa",
      "que afeta a mente dos habitantes…",
      "mas algo ou alguém quer que você descubra a verdade.",
      "",
      "Ele acorda com uma única pista:"
    ];
    this.fraseFinal = 'um bilhete parcialmente queimado com a frase:';

    this.fraseIndex = 0;
    this.charIndex = 0;
    this.escrevendoFinal = false;
    this.tempoEntreLetras = 40;
    this.tempoEntreFrases = 100;

    this.texto = this.add.text(50, 50, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffffff',
      wordWrap: { width: 700 }
    });

    this.cursor = this.add.rectangle(50, 50, 8, 12, 0xffffff)
      .setOrigin(0, 0);
    this.cursorBlink();

    this.typeSound = this.sound.add('type', { volume: 0.2 });

    this.time.delayedCall(500, () => this.digitar());
  }

  cursorBlink() {
    this.tweens.add({
      targets: this.cursor,
      alpha: 0,
      duration: 500,
      ease: 'Linear',
      yoyo: true,
      repeat: -1
    });
  }

  atualizarCursor() {
    const lines = this.texto.text.split('\n');
    const lastLine = lines[lines.length - 1];

    const charWidth = 7;
    const fontSize = parseInt(this.texto.style.fontSize) || 12;
    const lineSpacing = 2;

    const x = this.texto.x + lastLine.length * charWidth;
    const y = this.texto.y + (lines.length - 1) * (fontSize + lineSpacing) - 1;

    this.cursor.setPosition(x, y);
  }

  digitar() {
    if (!this.escrevendoFinal && this.fraseIndex < this.frases.length) {
      const frase = this.frases[this.fraseIndex];
      if (this.charIndex < frase.length) {
        this.texto.text += frase.charAt(this.charIndex);
        if (frase.charAt(this.charIndex) !== " ") this.typeSound.play();
        this.charIndex++;

        this.atualizarCursor();

        this.time.delayedCall(this.tempoEntreLetras, () => this.digitar());
      } else {
        this.texto.text += "\n\n";
        this.fraseIndex++;
        this.charIndex = 0;

        this.atualizarCursor();

        this.time.delayedCall(this.tempoEntreFrases, () => this.digitar());
      }
    } else if (!this.escrevendoFinal) {
      this.escrevendoFinal = true;
      this.charIndex = 0;
      this.time.delayedCall(1000, () => this.digitarFinal());
    }
  }

  digitarFinal() {
    if (this.charIndex < this.fraseFinal.length) {
      this.texto.text += this.fraseFinal.charAt(this.charIndex);
      if (this.fraseFinal.charAt(this.charIndex) !== " ") this.typeSound.play();
      this.charIndex++;

      this.atualizarCursor();

      this.time.delayedCall(this.tempoEntreLetras, () => this.digitarFinal());
    } else {
      this.time.delayedCall(1500, () => this.mostrarVideo());
    }
  }

  mostrarVideo() {
    this.texto.setVisible(false);
    this.cursor.setVisible(false);

    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    const video = this.add.video(screenWidth / 2, screenHeight / 2, 'intro');

    video.play(false);

    video.on('ready', () => {
      const videoWidth = video.width;
      const videoHeight = video.height;

      const screenAspectRatio = screenWidth / screenHeight;
      const videoAspectRatio = videoWidth / videoHeight;

      let newWidth, newHeight;

      if (screenAspectRatio > videoAspectRatio) {
        newWidth = screenWidth;
        newHeight = screenWidth / videoAspectRatio;
      } else {
        newHeight = screenHeight;
        newWidth = screenHeight * videoAspectRatio;
      }

      video.setDisplaySize(newWidth, newHeight);
    });

    video.on('complete', () => {
      this.scene.start('MainScene');
    });

    this.input.once('pointerdown', () => {
      video.stop();
      this.scene.start('MainScene');
    });
  }
}
