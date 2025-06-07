import Archer from '../characters/Archer.js'
import Cobra from '../characters/Cobra.js'
import Fireball from '../characters/Fireball.js';
import Arrow from '../characters/Arrow.js';


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
        this.load.image('p-quatro', 'src/assets/plataforma-grande.png');
        this.load.image('porta', 'src/assets/porta.png')
        this.load.image('dica', 'src/assets/dica.png');
        this.load.image('CoracaoCheio', 'src/assets/vida/CoracaoCheio.png');

        //audios
        this.load.audio('trilha-inicial', 'src/audios/trilha-jogo.mp3');
        this.load.audio('trilha-final', 'src/audios/trilha-final.mp3');
        this.load.audio('somBau', 'src/audios/som-bau.mp3');
        this.load.audio('somAcerto', 'src/audios/som-acerto.mp3');
        this.load.audio('somErro', 'src/audios/som-erro.mp3');
        this.load.audio('somTeleporte', 'src/audios/som-teleporte.mp3');


        //Adiciona o Arqueiro
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

        //Adiciona a Cobra
        this.load.spritesheet('worm_idle', 'src/assets/mobs/Cobra/Worm/Idle.png', {
            frameWidth: 90,
            frameHeight: 80
        });

        this.load.spritesheet('worm_attack', 'src/assets/mobs/Cobra/Worm/Attack.png', {
            frameWidth: 90,
            frameHeight: 80
        });

        this.load.spritesheet('worm_death', 'src/assets/mobs/Cobra/Worm/Death.png', {
            frameWidth: 90,
            frameHeight: 80
        });

        this.load.spritesheet('fireball', 'src/assets/mobs/Cobra/Fire Ball/Move.png', {
            frameWidth: 46,
            frameHeight: 46
        });

        this.load.spritesheet('fireball_explode', 'src/assets/mobs/Cobra/Fire Ball/Explosion.png', {
            frameWidth: 46,
            frameHeight: 46
        });
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000); // Ou qualquer cor de fundo que você tenha

        // ADICIONE ESTA LINHA:
        const mainCamera = this.cameras.main;
        //criando os efeitos sonoros
        this.somBau = this.sound.add('somBau', { loop: false, volume: 7 });
        this.somAcerto = this.sound.add('somAcerto', { loop: false, volume: 7 });
        this.somErro = this.sound.add('somErro', { loop: false, volume: 7 });
        this.somTeleporte = this.sound.add('somBau', { loop: false, volume: 7 });

        this.podeMover = true;
        this.dicaVisivel = false;
        this.painelVisivel = false;
        this.painelConcluido = false;
        this.painelSenha = document.getElementById('painel-senha');
        this.background = this.add.image(0, 300, 'fundo')//posicionando a imagem na posição x=0 y=300
        this.background.setOrigin(0, 0.5); //para fazer a imagem começar do inicio no ponto definida na linha acima

        this.plataformas = this.physics.add.staticGroup(); //criando um novo grupo de fisica estática, objetos que não serão afetados pela física, exemplo: chão e plataformas

        this.plataformas.create(0, 554, 'chao').setOrigin(0.01, 0.5).refreshBody();

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
        this.dica = this.add.image(683, 300, 'dica').setVisible(false).setScrollFactor(0);
        this.dica.setDepth(1);

        //adiciona a tecla e na variavel 
        this.teclaE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        //área de intereção com o baú
        this.areaInteracaoBau = this.add.zone(2070, 340, 100, 100);
        this.physics.world.enable(this.areaInteracaoBau);
        this.areaInteracaoBau.body.setAllowGravity(false); //desativando a força da gravidade da área 
        this.areaInteracaoBau.body.setImmovable(true);     //manter a área imovel ao personagem colidir com ela 

        //mensagem para a interação com o baú 
        this.mensagemInteracaoBau = this.add.text(683, 450, 'Pressione a tecla E para abrir o baú', {
            fontSize: '20px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(3);

        this.mensagemSairInteracaoBau = this.add.text(683, 570, 'Pressione a tecla E para fechar o baú', {
            fontSize: '20px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(2);



        //adicionando a porta
        this.plataformas.create(2742, 283, 'porta');

        //área de intereção com o porta
        this.areaInteracaoPorta = this.add.zone(2742, 283, 450, 470);
        this.physics.world.enable(this.areaInteracaoPorta);
        this.areaInteracaoPorta.body.setAllowGravity(false);
        this.areaInteracaoPorta.body.setImmovable(true);

        //mensagem para a interação com a porta
        this.mensagemInteracaoPorta = this.add.text(683, 450, 'Pressione a tecla E para acessar painel', {
            fontSize: '20px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(3);

        this.mensagemSairInteracaoPorta = this.add.text(683, 450, 'Pressione a tecla E para sair do painel', {
            fontSize: '20px',
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(300);

        //adicionar as trilhas do jogo
        this.trilhaAtual = this.sound.add('trilha-inicial', { loop: true, volume: 1 });
        this.trilhaAtual.play();
        this.trilhaTrocada = false;

        //configurando a câmera que seguirá o personagem 
        this.cameras.main.setBounds(0, 0, 4063, 600);

        // Criar o arqueiro
        this.arqueiro = new Archer(this, 50, 533);

        this.arqueiro.on('health_changed', this.updateHeartsUI, this);

        this.physics.add.collider(this.arqueiro, this.plataformas); //adiciona colisao entre o arqueiro e plataformas

        //Criar Cobra
        this.cobra = new Cobra(this, 1800, 300);

        this.physics.add.collider(this.cobra, this.plataformas); //adiciona colisao entre a cobra e plataformas

        this.cameras.main.startFollow(this.arqueiro); //fazer a camera seguir o arqueiro
        this.cameras.main.setLerp(0.1, 0.1); //suaviza movimento da camera

        this.cursors = this.input.keyboard.createCursorKeys(); //referencia as teclas de seta do teclado

        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Adiciona a tecla SPACE para atirar

        //área de interação com as flechas
        this.areaInteracaoFlechas = this.add.zone(1394, 191, 70, 30);
        this.physics.world.enable(this.areaInteracaoFlechas);
        this.areaInteracaoFlechas.body.setAllowGravity(false);
        this.areaInteracaoFlechas.body.setImmovable(true);

        //mensagem para interação com as flechas
        this.mensagemInteracaoFlechas = this.add.text(683, 450, 'Pressione a tecla E para coletar as flechas', {
            fontSize: '20px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(3);

        this.flechasColetadas = false;

        this.CoracaoCheio1 = this.add.image(50, 40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.CoracaoCheio2 = this.add.image(90, 40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.CoracaoCheio3 = this.add.image(130, 40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.CoracaoCheio4 = this.add.image(170, 40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.CoracaoCheio5 = this.add.image(210, 40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);

        this.heartsUI = [this.CoracaoCheio1, this.CoracaoCheio2, this.CoracaoCheio3, this.CoracaoCheio4, this.CoracaoCheio5];

        this.fireballs = this.physics.add.group({
            classType: Fireball, // O grupo criará objetos da classe Fireball
            runChildUpdate: true,

            createCallback: (fireball) => {
                // Esta função é chamada toda vez que um NOVO objeto é criado pelo grupo.
                // 'fireball' é a instância que acabou de ser criada e JÁ TEM um corpo de física.
                const bodyWidth = 10;
                const bodyHeight = 10;
                fireball.body.setSize(bodyWidth, bodyHeight);

                const bodyOffsetX = 17;
                const bodyOffsetY = 19;
                fireball.body.setOffset(bodyOffsetX, bodyOffsetY);
            }
        });

        this.physics.add.collider(this.fireballs, this.plataformas, (fireball, plataforma) => {
            // Esta função é executada no momento exato da colisão.
            // 'fireball' é a instância específica que colidiu.
            fireball.emit('explode');
        });

        this.arrows = this.physics.add.group({
            classType: Arrow, // A classe que o grupo vai usar
            runChildUpdate: true
        });

        this.physics.add.overlap(
            this.cobra, // O grupo de flechas
            this.arrows,   // O grupo de inimigos (ou uma instância única 'this.worm')
            (cobra, arrow) => {
                // Esta função é chamada quando uma flecha acerta um worm

                // O worm toma o dano
                cobra.takeHit();

                // A flecha é desativada
                arrow.hitTarget();
            },
            null,
            this
        );

        this.physics.add.overlap(
            this.arqueiro,
            this.fireballs,
            (arqueiro, fireball) => {
                // A bola de fogo SEMPRE explode ao tocar no jogador.
                fireball.emit('explode');

                // MAS, o dano só é aplicado se o arqueiro puder ser atingido.
                // Verificamos a invencibilidade AQUI DENTRO.
                if (arqueiro.isHittable) {
                    arqueiro.takeDamage(1);
                }
            },
            null, // Removemos a função de 'gatekeeper' daqui. Deixamos como null.
            this
        );
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

        if (this.estaAreaBau && Phaser.Input.Keyboard.JustDown(this.teclaE)) {
            if (!this.dica.visible) {
                this.somBau.play();
                this.dica.setVisible(true);
                this.podeMover = false;
                this.dicaVisivel = true;
                this.arqueiro.body.setVelocity(0);
            } else {
                this.dica.setVisible(false);
                this.podeMover = true;
                this.dicaVisivel = false;
            }
        }

        // if(this.painelSenha && Phaser.Input.Keyboard.JustDown(this.teclaE)){
        //         this.painelSenha.style.display="none"; 
        //         this.podeMover=true;
        //         this.mensagemSairInteracaoPorta.setVisible(false);
        //     }

        //reconhecer personagem na porta
        if (!this.painelConcluido) {
            this.estaAreaPorta = Phaser.Geom.Intersects.RectangleToRectangle(this.arqueiro.getBounds(), this.areaInteracaoPorta.getBounds());

            if (this.estaAreaPorta && !this.painelVisivel) {
                this.mensagemInteracaoPorta.setVisible(true);
                this.mensagemSairInteracaoPorta.setVisible(false);
            } else {
                this.mensagemInteracaoPorta.setVisible(false);
            }

            if (this.estaAreaPorta && this.painelVisivel) {
                this.mensagemSairInteracaoPorta.setVisible(true);
            }

            if (this.estaAreaPorta && Phaser.Input.Keyboard.JustDown(this.teclaE)) {
                if (!this.painelVisivel) {
                    this.arqueiro.setVelocity(0);
                    this.podeMover = false;
                    this.painelVisivel = true;
                    this.verificaSenha();
                } else {
                    this.podeMover = true;
                    this.painelVisivel = false;
                }
            }
        } else {
            this.areaInteracaoPorta.destroy()
            this.mensagemInteracaoPorta.setVisible(false);
            this.mensagemSairInteracaoPorta.setVisible(false);
        }




        //reconhecer personagem na área de interação das flechas
        const estaSobreposto = this.physics.world.overlap(this.arqueiro, this.areaInteracaoFlechas);

        // Mostra/esconde a mensagem baseado na sobreposição FÍSICA
        if (estaSobreposto && !this.flechasColetadas) {
            this.mensagemInteracaoFlechas.setVisible(true);
        } else {
            this.mensagemInteracaoFlechas.setVisible(false);
        }

        // Lógica de interação para coletar flechas usa a mesma verificação precisa
        if (estaSobreposto && Phaser.Input.Keyboard.JustDown(this.teclaE) && !this.flechasColetadas) {
            this.arqueiro.collectArrows(); // Coleta flechas
            this.flechasColetaveis.setVisible(false); // Remove a imagem das flechas do mapa
            this.flechasColetadas = true; // Marca como coletadas
            this.mensagemInteracaoFlechas.setVisible(false); // Garante que a mensagem suma após coletar
        }


        this.cobra.update(this.arqueiro);
    } //fim update


    //função para trocar de trilha
    trocarTrilha(novaTrilha) {
        if (this.trilhaAtual) {
            this.trilhaAtual.stop();
        }
        this.trilhaAtual = this.sound.add(novaTrilha, { loop: true, volume: 0.1 });
        this.trilhaAtual.play();
    }


    verificaSenha() {
        this.painelSenha.style.display = "block";
        const senha = document.getElementById('campo-senha');
        const btn = document.getElementById('btn-porta');
        const mensagem = document.getElementById('mensagem');
        const efeito = document.getElementById('idEfeito');

        btn.addEventListener('click', () => {
            const resposta = senha.value.toLowerCase();

            if (resposta !== 'cidão') {
                efeito.classList.add('erro');
                mensagem.classList.add('erroMensagem')
                mensagem.textContent = "ERRO@R% ERROR2032!."
                this.somErro.play();
                setTimeout(() => {
                    efeito.classList.remove('erro');
                    mensagem.classList.remove('erroMensagem')
                    mensagem.textContent = ""
                }, 3000);

            } else {
                this.somAcerto.play();
                efeito.classList.add('acerto');
                mensagem.classList.add('acertoMensagem')
                mensagem.textContent = "Chave autenticada com sucesso!"

                setTimeout(() => {
                    //teletransportando o jogador
                    this.somTeleporte.play();
                    this.podeMover = true;
                    this.painelSenha.style.display = "none";
                    this.painelVisivel = false;
                    this.painelConcluido = true;
                    this.arqueiro.setX(2970);
                    this.arqueiro.setY(533);
                }, 4000);
            }
        }) //fim evento click
    }

    updateHeartsUI() {
        // Itera por todos os corações da UI
        for (let i = 0; i < this.heartsUI.length; i++) {
            // Se o índice do coração (0 a 4) for menor que a vida atual do arqueiro (5, 4, 3...),
            // o coração fica visível. Senão, fica invisível.
            if (i < this.arqueiro.health) {
                this.heartsUI[i].setVisible(true);
            } else {
                this.heartsUI[i].setVisible(false);
            }
        }
    }

    flashScreen() {
        this.cameras.main.flash(200, 255, 0, 0); // Duração de 200ms, cor vermelha (RGB 255, 0, 0)
    }
}