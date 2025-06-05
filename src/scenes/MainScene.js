import Archer from '../characters/Archer.js'
import Bomba from '../characters/Bomba.js'; // ADICIONADO: Import da classe Bomba

export default class MainScene extends Phaser.Scene {
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
        this.load.image('dica', 'src/assets/dica.png');
        this.load.image('CoracaoCheio','src/assets/vida/CoracaoCheio.png');
        this.load.image('CoracaoMetade','src/assets/vida/CoracaoMetade.png');
        this.load.image('CoracaoVazio','src/assets/vida/CoracaoVazio.png');

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

        this.load.spritesheet('arrow', 'src/assets/arqueiro/Arrow/Move.png', {
            frameWidth: 24,
            frameHeight: 5
        });

    }

    create(){
        this.podeMover = true;
        this.dicaVisivel = false;
        this.painelVisivel=false;
        this.background = this.add.image(0,300, 'fundo')//posicionando a imagem na posição x=0 y=300
        this.background.setOrigin(0, 0.5); //para fazer a imagem começar do inicio no ponto definida na linha acima

        this.plataformas = this.physics.add.staticGroup(); //criando um novo grupo de fisica estática, objetos que não serão afetados pela física, exemplo: chão e plataformas
    
        this.plataformas.create(0,554, 'chao').setOrigin(0.01,0.5).refreshBody();

        //configurando o tamanho do mundo do jogo 
        // (onde começa eixo x, onde começa eixo y, largura do mundo, altura do mundo)      
        this.physics.world.setBounds(0, 0, 4063, 600);

        //adicionando as plataformas para ir até a flecha
        this.plataformas.create(1003, 413, 'dupla').setScale(0.8).refreshBody();

        this.plataformas.create(1211, 308, 'dupla').setScale(0.8).refreshBody();

        this.plataformas.create(1394, 239, 'unica').setScale(0.8).refreshBody();

        //adicionando as flechas
        this.flechasColetaveis = this.add.image(1394, 191, 'flechas');

        //adiciona a plataforma e os baus
        this.plataformas.create(2027, 413, 'p-quatro').setScale(0.8).refreshBody();

        this.bau = this.plataformas.create(2070, 340, 'bau').setScale(0.8).refreshBody();

        //adiciona a dica na tela (no momento está invisível)
        this.dica = this.add.image(400, 300, 'dica').setVisible(false).setScrollFactor(0);
        this.dica.setDepth(1);

        //adiciona a tecla e na variavel 
        this.teclaE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        //área de intereção com o baú
        this.areaInteracaoBau = this.add.zone(2070, 340, 100, 100);
        this.physics.world.enable(this.areaInteracaoBau);
        this.areaInteracaoBau.body.setAllowGravity(false); //desativando a força da gravidade da área 
        this.areaInteracaoBau.body.setImmovable(true);     //manter a área imovel ao personagem colidir com ela 

        //mensagem para a interação com o baú 
        this.mensagemInteracaoBau = this.add.text(400, 450, 'Pressione a tecla E para abrir o baú', {
            fontSize: '20px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(3);

        this.mensagemSairInteracaoBau = this.add.text(400, 570, 'Pressione a tecla E para fechar o baú', {
            fontSize: '20px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(2);

        //adicionando a porta
        this.plataformas.create(2742, 283, 'porta')

        //adicionando a porta
        this.plataformas.create(2742, 283, 'porta')

        //área de intereção com o porta
        this.areaInteracaoPorta = this.add.zone(2742, 283, 450, 470);
        this.physics.world.enable(this.areaInteracaoPorta);
        this.areaInteracaoPorta.body.setAllowGravity(false);
        this.areaInteracaoPorta.body.setImmovable(true);

        //mensagem para a interação com a porta
        this.mensagemInteracaoPorta = this.add.text(400, 450, 'Pressione a tecla E para acessar painel', {
            fontSize: '20px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(3);

        this.mensagemSairInteracaoPorta = this.add.text(400, 450, 'Pressione a tecla E para sair do painel', {
            fontSize: '20px',
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(2);

        //adicionar as trilhas do jogo
        this.trilhaAtual = this.sound.add('trilha-inicial', { loop: true, volume: 0.3 });
        this.trilhaAtual.play();
        this.trilhaTrocada = false;

        //configurando a câmera que seguirá o personagem 
        this.cameras.main.setBounds(0, 0, 4063, 600);

        // Criar o arqueiro
        this.arqueiro = new Archer(this, 50, 533);
        this.arqueiro.setScale(2.5); //alterar o tamanho do personagem 
        this.arqueiro.setDepth(0);

        this.physics.add.collider(this.arqueiro, this.plataformas); //adiciona colisao entre o arqueiro e plataformas

        this.cameras.main.startFollow(this.arqueiro); //fazer a camera seguir o arqueiro

        this.cursors = this.input.keyboard.createCursorKeys(); //referencia as teclas de seta do teclado

        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Adiciona a tecla SPACE para atirar

        //área de interação com as flechas
        this.areaInteracaoFlechas = this.add.zone(1394, 191, 50, 50);
        this.physics.world.enable(this.areaInteracaoFlechas);
        this.areaInteracaoFlechas.body.setAllowGravity(false);
        this.areaInteracaoFlechas.body.setImmovable(true);

        //mensagem para interação com as flechas
        this.mensagemInteracaoFlechas = this.add.text(400, 450, 'Pressione a tecla E para coletar flechas', {
            fontSize: '20px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(3);

        this.flechasColetadas = false;

        this.CoracaoCheio1 = this.add.image(50,40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.CoracaoCheio2 = this.add.image(90,40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.CoracaoCheio3 = this.add.image(130,40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.CoracaoCheio4 = this.add.image(170,40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.CoracaoCheio5 = this.add.image(210,40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
       

    } 

    update() {
        if (this.podeMover) {
            this.arqueiro.move(this.cursors);
        }

        if (this.trilhaTrocada == false && this.arqueiro.x > 2970) { //trilhaTrocada adicionada pois essa função deve ser executada apenas uma vez no jogo
            this.trilhaTrocada = true;
            this.trocarTrilha('trilha-final');
        }
        //reconhecer personagem na área de interação do baú
        this.estaAreaBau = Phaser.Geom.Intersects.RectangleToRectangle(this.arqueiro.getBounds(), this.areaInteracaoBau.getBounds());

        if (this.estaAreaBau && !this.dica.visible) {
            this.mensagemInteracaoBau.setVisible(true);
            this.mensagemSairInteracaoBau.setVisible(false);
        } else {
            this.mensagemInteracaoBau.setVisible(false);
        }

        if (this.estaAreaBau && this.dica.visible) {
            this.mensagemSairInteracaoBau.setVisible(true);
        }

        if (this.estaAreaBau && Phaser.Input.Keyboard.JustDown(this.teclaE)){
            if(!this.dica.visible){
                this.dica.setVisible(true);
                this.podeMover=false;
                this.dicaVisivel=true;
                this.arqueiro.body.setVelocity(0);
            } else{
                this.dica.setVisible(false);
                this.podeMover = true;
                this.dicaVisivel=false;
            }
        } 

        //reconhecer personagem na porta
        this.estaAreaPorta = Phaser.Geom.Intersects.RectangleToRectangle(this.arqueiro.getBounds(), this.areaInteracaoPorta.getBounds());

        if (this.estaAreaPorta && !this.painelVisivel) {
            this.mensagemInteracaoPorta.setVisible(true);
            this.mensagemSairInteracaoPorta.setVisible(false);
            this.verificaSenha();
        } else {
            this.mensagemInteracaoPorta.setVisible(false);
        }

        if (this.estaAreaPorta && Phaser.Input.Keyboard.JustDown(this.teclaE)){

        }


        //reconhecer personagem na área de interação das flechas
        this.estaAreaFlechas = Phaser.Geom.Intersects.RectangleToRectangle(this.arqueiro.getBounds(), this.areaInteracaoFlechas.getBounds());

        if (this.estaAreaFlechas && !this.flechasColetadas) {
            this.mensagemInteracaoFlechas.setVisible(true);
        } else {
            this.mensagemInteracaoFlechas.setVisible(false);
        }

        // Interação para coletar flechas
        if (this.estaAreaFlechas && Phaser.Input.Keyboard.JustDown(this.teclaE) && !this.flechasColetadas) {
            this.arqueiro.collectArrows(); // Coleta flechas (infinitas)
            this.flechasColetaveis.setVisible(false); // Remove a imagem das flechas do mapa
            this.flechasColetadas = true; // Marca como coletadas
            this.mensagemInteracaoFlechas.setVisible(false);
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
    
    
    verificaSenha(){
        const painel = document.getElementById('painel-senha');
        painel.style.display="block";
        const senha = document.getElementById('campo-senha');
        const btn = document.getElementById('btn-porta');
        const mensagem = document.getElementById('mensagem');

        btn.addEventListener('click', function(){
            const resposta = senha.value.toLowerCase();

            if (resposta !== 'cidão'){
                painel.classList.add('erro');
                mensagem.textContent="ERRO@R% ERROR2032!"
                setTimeout(function(){
                    painel.classList.remove('erro');
                    mensagem.textContent=""
                }, 3000);
                mensagem.textContent="ERRO@R% ERROR2032!"
            } else{
                painel.classList.add('acerto');
                mensagem.textContent="Chave autenticada com sucesso!"
                setTimeout(function(){

                },2000);
            }
    })
    
    };
}