var config = {
    //configurações gerais do phaser
    type: Phaser.AUTO, //tipo adaptavel (WebGL ou Canvas)
    width: 800,
    height: 600,
    physics:{ //definindo a gravidade do jogo (tipo: arcade / simples e rapido)
        default: 'arcade',
        arcade:{ 
            gravity: {y:300},
            debug: false 
        }
    },
    scene: {  
        preload: preload, 
        create: create,
        update: update 
    }
};

var game = new Phaser.Game(config) //instância o jogo com as configurações pré-definidas

function preload() {
    this.load.image('fundo', 'src/assets/fundo.png');
    this.load.image('chao', 'src/assets/chao.png');
}

function create(){
    this.background = this.add.image(0,300, 'fundo')//posicionando a imagem na posição x=0 y=300
    this.background.setOrigin(0, 0.5); //para fazer a imagem começar do inicio no ponto definida na linha acima

    plataformas = this.physics.add.staticGroup(); //criando um novo grupo de fisica estática, objetos que não serão afetados pela física, exemplo: chão e plataformas

  
    plataformas.create(0,554, 'chao').setOrigin(0.1,0.5);

    //configurando o tamanho do mundo do jogo 
    // (onde começa eixo x, onde começa eixo y, largura do mundo, altura do mundo)      
    this.physics.world.setBounds(0, 0, 4063, 600);

    //configurando a câmera que seguirá o personagem 
    this.cameras.main.setBounds(0, 0, 4063, 600);


}

function update(){

}