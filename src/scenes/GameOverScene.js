export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'fundo');
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7).setOrigin(0);

        const gameOverStyle = {
            fontFamily: '"Press Start 2P"',

            fontSize: '80px',

            color: '#ffffff',

            stroke: '#042A2B',
            strokeThickness: 4,

            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 0.4, 
                stroke: true,
                fill: true
            }
        };

        const gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'GAME OVER', gameOverStyle)
            .setOrigin(0.5);


        gameOverText.setAlpha(0);

        this.tweens.add({
            targets: gameOverText,
            alpha: 1,
            scale: 1, 
            duration: 500,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                // Animação de piscar em loop
                this.tweens.add({
                    targets: gameOverText,
                    alpha: 0.2,
                    duration: 400,
                    ease: 'Cubic.easeInOut',
                    yoyo: true,
                    repeat: -1
                });
            }
        });


        // botões com um delay para que um apareça depois do outro
        this.time.delayedCall(300, () => {
            this.createAnimatedButton('Tentar Novamente', this.cameras.main.centerY + 50, () => {
                this.scene.start('MainScene');
            });
        });

        this.time.delayedCall(500, () => {
            this.createAnimatedButton('Menu Principal', this.cameras.main.centerY + 120, () => {
                window.location.href = 'index.html';
            });
        });
    }

    /**
         * Cria um botão de texto com animações profissionais de entrada, hover e clique.
         * @param {string} text O texto a ser exibido no botão.
         * @param {number} y A posição vertical (Y) do botão.
         * @param {Function} onClick A função a ser executada quando o botão for clicado.
         */
    createAnimatedButton(text, y, onClick) {
        const buttonStyle = {
            fontFamily: '"Press Start 2P"',
            fontSize: '32px',
            color: '#E0E0E0',
            stroke: '#000000',
            strokeThickness: 5,
        };

        const button = this.add.text(this.cameras.main.centerX, y, text, buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        // Animações de entrada e hover 
        button.setAlpha(0).setScale(0.8);
        this.tweens.add({
            targets: button,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Cubic.easeOut'
        });
        button.on('pointerover', () => {
            this.tweens.killTweensOf(button);
            this.tweens.add({
                targets: button,
                scale: 1.1,
                duration: 200,
                ease: 'Cubic.easeOut'
            });
        });
        button.on('pointerout', () => {
            this.tweens.killTweensOf(button);
            this.tweens.add({
                targets: button,
                scale: 1.0,
                duration: 200,
                ease: 'Cubic.easeOut'
            });
        });

        // Evento: Botão é clicado
        button.on('pointerdown', () => {
            // Para outras animações e trava o botão
            this.tweens.killTweensOf(button);
            button.disableInteractive();

            this.tweens.add({
                targets: button,
                scale: 0.9,
                duration: 100,
                ease: 'Cubic.easeIn',
                // Quando a animação 1 terminar, a função onComplete é chamada...
                onComplete: () => {
                    this.tweens.add({
                        targets: button,
                        scale: 1.0,
                        duration: 100,
                        ease: 'Cubic.easeOut',
                        // Quando a animação 2 terminar...
                        onComplete: () => {
                            //...a ação final é executada com segurança.
                            onClick();
                        }
                    });
                }
            });
        });
    }
}