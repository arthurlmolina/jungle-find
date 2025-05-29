import Archer from '../characters/Archer.js'

export default class MainScene extends Phaser.Scene{ 
    constructor() {
        super('MainScene') //nome da cena, utilizar caso o jogo tenha mais de uma cena 
    }

    preload() {
        this.load.image('fundo', 'src/assets/fundo.png');
        this.load.image('chao', 'src/assets/chao.png');
        this.load.image('dupla', 'src/assets/plataforma-dupla.png');
        this.load.image('unica', 'src/assets/plataforma-unica.png');
        this.load.image('flechas', 'src/assets/flechas.png');
        this.load.image('bau', 'src/assets/bau.png');
        
        this.load.spritesheet('archer_idle', 'src/assets/arqueiro/Character/Idle.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet('archer_walk', 'src/assets/arqueiro/Character/Run.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet('archer_shoot', 'src/assets/arqueiro/Character/Attack.png', {
            frameWidth: 100,
            frameHeight: 100
        });

        this.load.spritesheet('archer_jump', 'src/assets/arqueiro/Character/Jump.png', {
            frameWidth: 100,
            frameHeight: 100
        });
    }

    create(){
        this.background = this.add.image(0,300, 'fundo')//posicionando a imagem na posição x=0 y=300
        this.background.setOrigin(0, 0.5); //para fazer a imagem começar do inicio no ponto definida na linha acima

        this.plataformas = this.physics.add.staticGroup(); //criando um novo grupo de fisica estática, objetos que não serão afetados pela física, exemplo: chão e plataformas

    
        this.plataformas.create(0,554, 'chao').setOrigin(0.01,0.5).refreshBody();

        //configurando o tamanho do mundo do jogo 
        // (onde começa eixo x, onde começa eixo y, largura do mundo, altura do mundo)      
        this.physics.world.setBounds(0, 0, 4063, 600);
    
        //adicionando as plataformas para ir até a flecha
        this.plataformas.create(1003,413, 'dupla').setScale(0.8).refreshBody();

        this.plataformas.create(1211,308, 'dupla').setScale(0.8).refreshBody();

        this.plataformas.create(1394,239, 'unica').setScale(0.8).refreshBody();
        
        //adicionando as flechas
        this.add.image(1394, 191, 'flechas')

        //adiciona a plataforma e os baus
        this.plataformas.create(2027,413, 'dupla').setScale(0.8).refreshBody();
        this.plataformas.create(2027,340, 'bau').setScale(0.8).refreshBody();

        //configurando a câmera que seguirá o personagem 
        this.cameras.main.setBounds(0, 0, 4063, 600);

        // Criar o arqueiro
        this.arqueiro = new Archer(this, 50, 533);
        this.arqueiro.setScale(2.5); //alterar o tamanho do personagem 


        this.physics.add.collider(this.arqueiro, this.plataformas); //adiciona colisao entre o arqueiro e plataformas

        this.cameras.main.startFollow(this.arqueiro); //fazer a camera seguir o arqueiro

        this.cursors = this.input.keyboard.createCursorKeys(); //referencia as teclas de seta do teclado
    }

    update(){
        this.arqueiro.move(this.cursors);
    }
}