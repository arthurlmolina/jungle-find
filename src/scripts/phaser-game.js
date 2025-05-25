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
    this.load.image('chao', 'chao/chao.png');
}

function create(){
    this.background = this.add.image(0,300, 'fundo')//posicionando a imagem na posição x=0 y=300
    this.background.setOrigin(0, 0.5); //para fazer a imagem começar do inicio no ponto definida na linha acima
}

function update(){

}