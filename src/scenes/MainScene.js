import Archer from '../characters/Archer.js'

export default class MainScene extends Phaser.Scene{ 
    player;
    
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
        this.load.image('p-quatro','src/assets/plataforma-grande.png');
        this.load.image('porta', 'src/assets/porta.png')
        //audios
        this.load.audio('trilha-inicial', 'src/audios/trilha-jogo.mp3');
        this.load.audio('trilha-final', 'src/audios/trilha-final.mp3');
        
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

        this.load.spritesheet('archer_fall', 'src/assets/arqueiro/Character/Fall.png', {
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
        this.plataformas.create(2027,413, 'p-quatro').setScale(0.8).refreshBody();
        this.plataformas.create(2070,340, 'bau').setScale(0.8).refreshBody();

        //adicionando a porta
        this.plataformas.create(2742, 283, 'porta')

        //adicionar as trilhas do jogo
        this.trilhaAtual = this.sound.add('trilha-inicial', {loop:true, volume:0.3});
        this.trilhaAtual.play();
        this.trilhaTrocada=false;

        //configurando a câmera que seguirá o personagem 
        this.cameras.main.setBounds(0, 0, 4063, 600);

        // Criar o arqueiro
        this.arqueiro = new Archer(this, 50, 533);
        this.arqueiro.setScale(2.5); //alterar o tamanho do personagem 

        this.physics.add.collider(this.arqueiro, this.plataformas); //adiciona colisao entre o arqueiro e plataformas

        this.cameras.main.startFollow(this.arqueiro); //fazer a camera seguir o arqueiro

        this.cursors = this.input.keyboard.createCursorKeys(); //referencia as teclas de seta do teclado

        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Adiciona a tecla SPACE para atirar



    }

    update(){
        this.arqueiro.move(this.cursors);

        if(this.trilhaTrocada==false && this.arqueiro.x>2970){ //trilhaTrocada adicionada pois essa função deve ser executada apenas uma vez no jogo
            this.trilhaTrocada=true;
            this.trocarTrilha('trilha-final');
        }
    }

    //função para trocar de trilha
    trocarTrilha(novaTrilha){
        if(this.trilhaAtual){
            this.trilhaAtual.stop();
        }
        this.trilhaAtual = this.sound.add(novaTrilha, {loop: true, volume: 0.3});
        this.trilhaAtual.play();
    }   
}