# Jungle Find 🌿

*Um jogo de plataforma 2D de aventura e quebra-cabeças, desenvolvido com Phaser 3 e Vite.js como projeto acadêmico do curso de Engenharia de Software.*

---

**[Documentação](https://docs.google.com/document/d/1AfUf7-m45dU6EoVHZVq22hm1oE3yYgRvDlJrvjdkCEQ/edit?tab=t.0#heading=h.p4paef8sa5jf)**

**[➡️ Jogue Agora! Clique aqui para acessar a versão ao vivo na Netlify](https://junglefind.netlify.app/)**

> **Nota sobre o Gameplay:** O jogo contém um quebra-cabeça com uma senha para progredir. A resposta é uma homenagem a um dos nossos professores do curso de Engenharia de Software. A pista para a solução pode ser encontrada dentro de um baú no jogo, mas para fins de avaliação, a senha é `cidão`.

---

## 📜 Índice

* [Sobre o Projeto](#-sobre-o-projeto)
* [Features Principais](#-features-principais)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Como Rodar o Projeto Localmente](#-como-rodar-o-projeto-localmente)
* [Lógica e Detalhes Técnicos](#-lógica-e-detalhes-técnicos)
* [Autores](#-autores)
* [Agradecimentos](#-agradecimentos)

---

## 🌳 Sobre o Projeto

**Jungle Find** é uma jornada de descoberta e combate em um mundo misterioso e selvagem. O jogador controla um arqueiro que acorda sem memórias e deve explorar o ambiente, enfrentar inimigos com diferentes comportamentos, resolver um quebra-cabeça para progredir e, por fim, lutar contra um chefe poderoso para desvendar a verdade sobre seu passado e o mundo de Nébula.

Este projeto foi desenvolvido como uma aplicação prática dos conceitos de engenharia de software e desenvolvimento frontend, com o desafio adicional de aprender o framework Phaser 3 e implementar o jogo completo em menos de um mês.

---

## ✨ Features Principais

* **Controle de Personagem Responsivo:** Movimentação fluida com pulo e uma habilidade de **pulo duplo** destravável.
* **Inimigos com Padrões de Ataque Distintos:** Enfrente a Worm com ataques de projéteis e um Chefe Final com comportamento de perseguição e ataques corpo a corpo.
* **Batalha de Chefe com Múltiplas Fases:** O chefe entra em um "Modo Fúria" com velocidade aumentada ao atingir 50% de vida.
* **Quebra-cabeças e Interação:** Um painel de senha integrado com elementos HTML/CSS que o jogador precisa resolver para avançar.
* **Narrativa Completa:** O jogo possui uma cena de introdução, um clímax com a batalha de chefe e uma cena de vídeo final, fechando o arco da história.
* **Estrutura de Projeto Moderna:** Construído com Vite.js, garantindo um ambiente de desenvolvimento rápido e um build otimizado para produção.

---

## 🛠️ Tecnologias Utilizadas

* **Motor de Jogo:** [Phaser 3](https://phaser.io/)
* **Linguagem:** JavaScript (ES6+)
* **Build Tool:** [Vite.js](https://vitejs.dev/)
* **Estrutura:** HTML5 / CSS3
* **Deploy:** [Netlify](https://www.netlify.com/)

---

## 🚀 Como Rodar o Projeto Localmente

Para rodar o projeto na sua máquina, siga os passos abaixo. É necessário ter o [Node.js](https://nodejs.org/) instalado.

```bash
# 1. Clone o repositório
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)

# 2. Navegue até a pasta do projeto
cd seu-repositorio

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```
Após o último comando, o terminal mostrará um endereço local (geralmente `http://localhost:5173`) para você abrir no seu navegador.

---

## 🧠 Lógica e Detalhes Técnicos

Esta seção detalha as soluções técnicas implementadas no projeto.

<details>
<summary><strong>Arquitetura Geral e Ferramentas</strong></summary>

O projeto foi estruturado como uma **Aplicação de Múltiplas Páginas (MPA)**, configurada no `vite.config.js` para gerenciar as diferentes páginas HTML (menu, jogo, créditos). Utilizamos o sistema de **módulos ES6** para componentizar o código em classes (Personagens, Cenas), facilitando a manutenção.
</details>

<details>
<summary><strong>Lógica do Arqueiro (Player)</strong></summary>

* **State Machine de Animação:** O método `move()` utiliza a velocidade (`velocity.x`, `velocity.y`) e o estado físico (`body.blocked.down`) para selecionar a animação correta (`idle`, `walk`, `jump`, `fall`), incluindo um "limiar de velocidade" para evitar trepidações em superfícies móveis.
* **Pulo Duplo Condicional:** A habilidade é controlada por uma flag `canDoubleJump`, ativada por um método público (`enableDoubleJump()`) chamado pela `MainScene` após o evento da porta, demonstrando uma comunicação limpa entre cena e sprite.
</details>

<details>
<summary><strong>Comportamento dos Inimigos e Mecânicas de Combate</strong></summary>

O jogo apresenta uma boa variedade de lógicas de comportamento para os inimigos.

* **Worm (Inimigo à Distância):** Implementa um comportamento simples baseado em raio de detecção. Ao jogador entrar na sua zona de ação, ela dispara projéteis (`Fireball`) em sua direção. As `Fireballs` possuem sua própria lógica para explodir ao colidir com o jogador ou com plataformas.

* **Chefe Final (Ameaça Melee Complexa):**
    * **Máquina de Estados Comportamental:** O método `update()` do chefe funciona como seu cérebro. A cada frame, ele calcula a distância para o jogador e decide entre três estados: `standBy` (parado), `chase` (perseguir) ou `meleeAttack` (atacar), com base nas propriedades `visionRange` e `attackRange`.
    * **"Zona Morta" de Perseguição:** A função `chase()` foi refinada com uma "dead zone" para resolver o bug de "tremida". Se a distância horizontal para o jogador for menor que um limiar, a velocidade horizontal do chefe é zerada, tornando seu **comportamento mais estável e previsível**.
    * **Hitbox de Ataque Dinâmica:** O ataque corpo a corpo é implementado através de uma hitbox temporária. Um `delayedCall` cria uma `Phaser.GameObjects.Zone` invisível e com física ativada na frente do chefe, sincronizada com a animação do golpe. Uma verificação de `overlap` com essa zona registra o dano, criando uma janela de acerto precisa.
    * **Batalha em Fases ("Modo Fúria"):** A função `takeDamage()` ativa uma flag `isEnraged` quando o chefe atinge 50% de vida (e garante que isso ocorra apenas uma vez), chamando um método que aumenta sua velocidade e aplica um `tint` visual para sinalizar a mudança de fase ao jogador.

</details>

<details>
<summary><strong>Interação com a Interface (Phaser + DOM)</strong></summary>

O projeto demonstra uma integração controlada entre o motor do jogo e a interface do navegador. A lógica de interação com o painel de senha é um exemplo de como o Phaser manipula elementos do DOM que existem fora de seu canvas.
</details>

---

## 👥 Autores

| Nome | LinkedIn | GitHub |
| :--- | :--- | :--- |
| Arthur L. Molina | [<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />](https://www.linkedin.com/in/arthurlmolina/) | [<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />](https://github.com/arthurlmolina) |
| Gabriel C. Gravena | [<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />](https://www.linkedin.com/in/gabriel-cesar-gravena/) | [<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />](https://github.com/Gabriel-Gravena) |
| Guilherme B. Rodrigues | [<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />](https://www.linkedin.com/in/guilhermedevs/) | [<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />](https://github.com/Guilherme-Bandeira-Rodrigues) |
| Gustavo S. Guimarães | [<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />](https://www.linkedin.com/in/gustavo-dos-santos-guimarães-1280a6294/) | [<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />](https://github.com/gustavo1610bo) |

---

## 🙏 Agradecimentos

Um agradecimento mais que especial ao nosso professor, Hugo, não só pela orientação durante o semestre, mas também por sua incrível atuação na cena final do jogo. Sua dedicação em garantir que aprendêssemos desenvolvimento front-end foi a inspiração para o plot twist!

---

## 📄 Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
