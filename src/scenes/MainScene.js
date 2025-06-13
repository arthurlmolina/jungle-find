import Archer from '../characters/Archer.js'
import Cobra from '../characters/Cobra.js'
import Fireball from '../characters/Fireball.js';
import Arrow from '../characters/Arrow.js';
import Boss from '../characters/Boss.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene')
    }

    preload() {
        this.load.image('fundo', '/assets/Fundo.png');
        this.load.image('chao', '/assets/chao.png');
        this.load.image('dupla', '/assets/plataforma-dupla.png');
        this.load.image('unica', '/assets/plataforma-unica.png');
        this.load.image('flechas', '/assets/flechas.png');
        this.load.image('bau', '/assets/bau.png');
        this.load.image('p-quatro', '/assets/plataforma-grande.png');
        this.load.image('porta', '/assets/porta.png')
        this.load.image('dica', '/assets/dica.png');
        this.load.image('CoracaoCheio', '/assets/vida/CoracaoCheio.png');
        this.load.image('hugo', '/assets/hugo.png');
        this.load.image('flecha_apagada', '/assets/flecha_apagada.PNG')
        this.load.video('videoHugo', '/assets/cutscenes/final.mp4');
        this.load.image('infinito', '/assets/infinito.png')


        //audios
        this.load.audio('trilha-inicial', '/audios/trilha-jogo.mp3');
        this.load.audio('trilha-final', '/audios/trilha-final.mp3');
        this.load.audio('somBau', '/audios/som-bau.mp3');
        this.load.audio('somAcerto', '/audios/som-acerto.mp3');
        this.load.audio('somErro', '/audios/som-erro.mp3');
        this.load.audio('somTeleporte', '/audios/som-teleporte.mp3');
        this.load.audio('somFlecha', '/audios/flecha_saiu.mp3');
        this.load.audio('somFlechaColisao', '/audios/flecha_bateu.mp3');
        this.load.audio('somFireball', '/audios/audio_fireball.mp3');
        this.load.audio('somHitArqueiro', '/audios/audio_hit.mp3');
        this.load.audio('somPuloArqueiro', '/audios/som_pulo.mp3');
        this.load.audio('somGameOver', '/audios/game_over.mp3');
        this.load.audio('somMorteBoss', '/audios/som_bossMorte.mp3');

        this.load.spritesheet('archer_idle', '/assets/arqueiro/Character/Idle.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet('archer_walk', '/assets/arqueiro/Character/Run.png', {
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet('archer_shoot', '/assets/arqueiro/Character/Attack.png', {
            frameWidth: 100,
            frameHeight: 100
        });

        this.load.spritesheet('archer_jump', '/assets/arqueiro/Character/Jump.png', {
            frameWidth: 100,
            frameHeight: 100
        });

        this.load.spritesheet('archer_fall', '/assets/arqueiro/Character/Fall.png', {
            frameWidth: 100,
            frameHeight: 100
        });

        this.load.spritesheet('archer_death', '/assets/arqueiro/Character/Death.png', {
            frameWidth: 100,
            frameHeight: 100
        });

        this.load.spritesheet('arrow', '/assets/arqueiro/Arrow/Move.png', {
            frameWidth: 24,
            frameHeight: 5
        });

        this.load.spritesheet('worm_idle', '/assets/mobs/Cobra/Worm/Idle.png', {
            frameWidth: 90,
            frameHeight: 80
        });

        this.load.spritesheet('worm_attack', '/assets/mobs/Cobra/Worm/Attack.png', {
            frameWidth: 90,
            frameHeight: 80
        });

        this.load.spritesheet('worm_death', '/assets/mobs/Cobra/Worm/Death.png', {
            frameWidth: 90,
            frameHeight: 80
        });

        this.load.spritesheet('fireball', '/assets/mobs/Cobra/Fire Ball/Move.png', {
            frameWidth: 46,
            frameHeight: 46
        });

        this.load.spritesheet('fireball_explode', '/assets/mobs/Cobra/Fire Ball/Explosion.png', {
            frameWidth: 46,
            frameHeight: 46
        });

        this.load.spritesheet('boss_run', '/assets/mobs/FinalBoss/Run.png', {
            frameWidth: 250,
            frameHeight: 250
        });

        this.load.spritesheet('boss_attack', '/assets/mobs/FinalBoss/Attack1.png', {
            frameWidth: 250,
            frameHeight: 250
        });

        this.load.spritesheet('boss_death', '/assets/mobs/FinalBoss/Death.png', {
            frameWidth: 250,
            frameHeight: 250
        });

        this.load.spritesheet('boss_idle', '/assets/mobs/FinalBoss/Idle.png', {
            frameWidth: 250,
            frameHeight: 250
        });
    }

    create() {
        this.somBau = this.sound.add('somBau', { loop: false, volume: 7 });
        this.somAcerto = this.sound.add('somAcerto', { loop: false, volume: 7 });
        this.somErro = this.sound.add('somErro', { loop: false, volume: 1 });
        this.somTeleporte = this.sound.add('somBau', { loop: false, volume: 7 });
        this.somFlecha = this.sound.add('somFlecha', { loop: false, volume: 7 });
        this.somFlechaColisao = this.sound.add('somFlechaColisao', { loop: false, volume: 0.5 });
        this.somFireball = this.sound.add('somFireball', { loop: false, volume: 0.6 });
        this.somHitArqueiro = this.sound.add('somHitArqueiro', { loop: false, volume: 6 });
        this.somPuloArqueiro = this.sound.add('somPuloArqueiro', { loop: false, volume: 4.5 });
        this.somGameOver = this.sound.add('somGameOver', { loop: false, volume: 4.5 });
        this.somMorteBoss = this.sound.add('somMorteBoss', { loop: false, volume: 1.5 });

        this.podeMover = true;
        this.dicaVisivel = false;
        this.painelVisivel = false;
        this.painelConcluido = false;
        this.painelSenha = document.getElementById('painel-senha');
        this.background = this.add.image(0, 300, 'fundo')
        this.background.setOrigin(0, 0.5);

        this.plataformas = this.physics.add.staticGroup();

        this.plataformas.create(0, 554, 'chao').setOrigin(0.01, 0.5).refreshBody();
     
        this.physics.world.setBounds(0, 0, 4063, 600);

        this.plataformas.create(1003, 413, 'dupla').setScale(0.8).refreshBody();

        this.plataformas.create(1211, 308, 'dupla').setScale(0.8).refreshBody();

        this.plataformas.create(1394, 239, 'unica').setScale(0.8).refreshBody();

        this.plataformas.create(3350, 343, 'dupla').setScale(0.8).refreshBody();
        this.plataformas.create(3650, 343, 'dupla').setScale(0.8).refreshBody();

        this.flechasColetaveis = this.add.image(1394, 191, 'flechas');

        this.plataformas.create(2027, 413, 'p-quatro').setScale(0.8).refreshBody();

        this.bau = this.plataformas.create(2070, 340, 'bau').setScale(0.8).refreshBody();

        this.dica = this.add.image(683, 300, 'dica').setVisible(false).setScrollFactor(0);
        this.dica.setDepth(1);

        this.teclaE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        this.areaInteracaoBau = this.add.zone(2070, 340, 100, 100);
        this.physics.world.enable(this.areaInteracaoBau);
        this.areaInteracaoBau.body.setAllowGravity(false);
        this.areaInteracaoBau.body.setImmovable(true);

        this.mensagemInteracaoBau = this.add.text(683, 450, 'Pressione a tecla E para abrir o baú', {
            fontSize: '20px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(3);

        this.mensagemSairInteracaoBau = this.add.text(683, 570, 'Pressione a tecla E para fechar o baú', {
            fontSize: '20px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(2);

        this.plataformas.create(2742, 283, 'porta');

        this.areaInteracaoPorta = this.add.zone(2742, 283, 450, 470);
        this.physics.world.enable(this.areaInteracaoPorta);
        this.areaInteracaoPorta.body.setAllowGravity(false);
        this.areaInteracaoPorta.body.setImmovable(true);

        this.mensagemInteracaoPorta = this.add.text(683, 450, 'Pressione a tecla E para acessar o painel', {
            fontSize: '20px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(3);

        this.mensagemSairInteracaoPorta = this.add.text(683, 570, 'Pressione a tecla E para sair do painel', {
            fontSize: '20px',
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(300);

        this.trilhaAtual = this.sound.add('trilha-inicial', { loop: true, volume: 1 });
        this.trilhaAtual.play();
        this.trilhaTrocada = false;

        this.cameras.main.setBounds(0, 0, 4063, 600);

        this.arqueiro = new Archer(this, 50, 533);

        this.arqueiro.on('died', () => { 
            this.trilhaAtual.stop();
            this.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress) => {
                if (progress === 1) {
                    this.scene.start('GameOverScene');
                }
            });
        });

        this.arqueiro.on('health_changed', this.updateHeartsUI, this);

        this.physics.add.collider(this.arqueiro, this.plataformas);

        this.cobra = new Cobra(this, 1800, 614);

        this.physics.add.collider(this.cobra, this.plataformas);

        this.physics.add.collider(this.arqueiro, this.cobra);

        this.cameras.main.startFollow(this.arqueiro); 
        this.cameras.main.setLerp(0.1, 0.1); 

        this.cursors = this.input.keyboard.createCursorKeys();

        this.cursors.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.areaInteracaoFlechas = this.add.zone(1394, 191, 70, 30);
        this.physics.world.enable(this.areaInteracaoFlechas);
        this.areaInteracaoFlechas.body.setAllowGravity(false);
        this.areaInteracaoFlechas.body.setImmovable(true);

        this.mensagemInteracaoFlechas = this.add.text(683, 450, 'Pressione a tecla E para coletar as flechas', {
            fontSize: '20px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(3);

        this.flechasColetadas = false;

        this.CoracaoCheio1 = this.add.image(50, 40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.CoracaoCheio2 = this.add.image(90, 40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.CoracaoCheio3 = this.add.image(130, 40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.CoracaoCheio4 = this.add.image(170, 40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.CoracaoCheio5 = this.add.image(210, 40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.CoracaoCheio6 = this.add.image(250, 40, 'CoracaoCheio').setVisible(true).setScrollFactor(0).setScale(0.1).setOrigin(0.0).setDepth(10);
        this.flechaApagadaHud = this.add.image(1250, 10, 'flecha_apagada').setVisible(true).setScrollFactor(0).setOrigin(0.0).setDepth(10);
        this.flechaColetadaHud = this.add.image(1250, 10, 'flechas').setVisible(false).setScrollFactor(0).setOrigin(0.0).setDepth(10);
        this.iconeInfinito = this.add.image(1281, 51, 'infinito').setVisible(false).setScrollFactor(0).setOrigin(0.0).setDepth(10).setScale(0.06);

        this.heartsUI = [this.CoracaoCheio1, this.CoracaoCheio2, this.CoracaoCheio3, this.CoracaoCheio4, this.CoracaoCheio5, this.CoracaoCheio6]; 

        this.fireballs = this.physics.add.group({
            classType: Fireball, 
            runChildUpdate: true,

            createCallback: (fireball) => {
                const bodyWidth = 10;
                const bodyHeight = 10;
                fireball.body.setSize(bodyWidth, bodyHeight);

                const bodyOffsetX = 17;
                const bodyOffsetY = 19;
                fireball.body.setOffset(bodyOffsetX, bodyOffsetY);
            }
        });

        this.physics.add.collider(this.fireballs, this.plataformas, (fireball, plataforma) => {
            fireball.emit('explode');
        });

        this.arrows = this.physics.add.group({
            classType: Arrow, 
            runChildUpdate: true
        });

        this.physics.add.collider(this.arrows, this.plataformas, (arrow, plataforma) => {
                this.somFlechaColisao.play();
                arrow.hitTarget();
        });

        this.physics.add.overlap(
            this.cobra, 
            this.arrows,   
            (cobra, arrow) => {
                cobra.takeHit();
                arrow.hitTarget();
            },
            null,
            this
        );

        this.physics.add.overlap(
            this.arqueiro,
            this.fireballs,
            (arqueiro, fireball) => {
                fireball.emit('explode');
                if (arqueiro.isHittable) {
                    arqueiro.takeDamage(1);
                }
            },
            null, 
            this
        );

        this.plataformas.create(4000, 461, 'hugo');
        this.areaInteracaoHugo = this.add.zone(4000, 461, 150, 250);
        this.physics.world.enable(this.areaInteracaoHugo);
        this.areaInteracaoHugo.body.setAllowGravity(false);
        this.areaInteracaoHugo.body.setImmovable(true);
        this.mensagemInteracaoHugo = this.add.text(683, 550, 'Pressione a tecla E para liberar o Hugo', {
            fontSize: '20px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(3);


        
        this.boss = new Boss(this, 3800, 733, this.arqueiro);

        this.physics.add.collider(this.boss, this.plataformas);
        this.physics.add.collider(this.boss, this.arqueiro, (boss, arqueiro) => {
            if (arqueiro.body.touching.down && arqueiro.isHittable) { 
                arqueiro.takeDamage(1);
                arqueiro.setVelocityY(-550);
            }

        });

        this.physics.add.overlap(this.boss, this.arrows, (boss, arrow) => {
            boss.takeDamage(1);
            arrow.hitTarget();
        }, null, this);

        this.mensagemInteracaoDoubleJump = this.add.text(683, 540, 'Pulo duplo habilitado', {
            fontSize: '25px'
        }).setOrigin(0.5).setVisible(false).setScrollFactor(0).setDepth(3);
    }

    update() {
        this.boss.update();

        if (this.podeMover) {
            this.arqueiro.move(this.cursors);
        }

        if (this.trilhaTrocada == false && this.arqueiro.x > 2970) { 
            this.trilhaTrocada = true;
            this.trocarTrilha('trilha-final');
        }

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
                if (Phaser.Input.Keyboard.JustDown(this.teclaE)) {
                    this.painelSenha.style.display = "none";
                    this.podeMover = true;
                    this.painelVisivel = false;
                    this.mensagemSairInteracaoPorta.setVisible(false);
                }
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
            this.mensagemSairInteracaoPorta.setVisible(false);
        }

        const estaSobreposto = this.physics.world.overlap(this.arqueiro, this.areaInteracaoFlechas);

        if (estaSobreposto && !this.flechasColetadas) {
            this.mensagemInteracaoFlechas.setVisible(true);
        }else {
            this.mensagemInteracaoFlechas.setVisible(false);
        }

        if (estaSobreposto && Phaser.Input.Keyboard.JustDown(this.teclaE) && !this.flechasColetadas){
            this.arqueiro.collectArrows(); 
            this.flechasColetaveis.setVisible(false); 
            this.flechaApagadaHud.setVisible(false); 
            this.flechaColetadaHud.setVisible(true); 
            this.iconeInfinito.setVisible(true); 
            this.flechasColetadas = true; 
            this.mensagemInteracaoFlechas.setVisible(false);
        }


        this.cobra.update(this.arqueiro);
        const HugoSobreposto = this.physics.world.overlap(this.arqueiro, this.areaInteracaoHugo);

        this.mensagemInteracaoHugo.setVisible(HugoSobreposto && this.boss.isDead);

        if (HugoSobreposto && Phaser.Input.Keyboard.JustDown(this.teclaE) && this.boss.isDead) {
            this.cameras.main.shake(550, 0.025);

            this.time.delayedCall(400, () => {
                this.trilhaAtual.stop();
                this.scene.start('EndScene');
            })
        }
    } //fim update

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

        btn.replaceWith(btn.cloneNode(true));
        const novoBtn = document.getElementById('btn-porta');

        novoBtn.addEventListener('click', () => {
            const resposta = senha.value.toLowerCase();

            if (resposta !== 'cidão') {
                efeito.classList.add('erro');
                mensagem.classList.add('erroMensagem')
                mensagem.textContent = "ERRO@R% ERROR2032!."
                senha.value = "";
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
                senha.value = "";

                setTimeout(() => {
                    mensagem.textContent = "";
                    efeito.classList.remove('acerto');
                    mensagem.classList.remove('acertoMensagem')
                    this.somTeleporte.play();
                    this.podeMover = true;
                    this.painelSenha.style.display = "none";
                    this.painelVisivel = false;
                    this.painelConcluido = true;
                    this.arqueiro.setX(2995);
                    this.arqueiro.setY(533);

                    this.arqueiro.enableDoubleJump();
                    this.mensagemInteracaoDoubleJump.setVisible(true);
                    this.time.delayedCall(3000, () => {
                        this.mensagemInteracaoDoubleJump.setVisible(false);
                    });
                }, 4000);
            }
        }) 
    }

    updateHeartsUI() {
        for (let i = 0; i < this.heartsUI.length; i++) {
            if (i < this.arqueiro.health) {
                this.heartsUI[i].setVisible(true);
            } else {
                this.heartsUI[i].setVisible(false);
            }
        }
    }

    flashScreen() {
        this.cameras.main.flash(200, 255, 0, 0);
        this.cameras.main.shake(150, 0.005);
    }
}