export default class MainScene extends Phaser.Scene{ 
    constructor() {
        super('MainScene') //nome da cena, utilizar caso o jogo tenha mais de uma cena 
    }

    preload() {
        this.load.image('fundo', 'src/assets/fundo.png');
        this.load.image('chao', 'src/assets/chao.png');
    }

    create(){
        this.background = this.add.image(0,300, 'fundo')//posicionando a imagem na posição x=0 y=300
        this.background.setOrigin(0, 0.5); //para fazer a imagem começar do inicio no ponto definida na linha acima

        this.plataformas = this.physics.add.staticGroup(); //criando um novo grupo de fisica estática, objetos que não serão afetados pela física, exemplo: chão e plataformas

    
        this.plataformas.create(0,554, 'chao').setOrigin(0.1,0.5);

        //configurando o tamanho do mundo do jogo 
        // (onde começa eixo x, onde começa eixo y, largura do mundo, altura do mundo)      
        this.physics.world.setBounds(0, 0, 4063, 600);

        //configurando a câmera que seguirá o personagem 
        this.cameras.main.setBounds(0, 0, 4063, 600);


        // this.cameras.main.scrollX = 1100 - 400; //testar imagem e plataformas

        

    }

    update(){

    }
}