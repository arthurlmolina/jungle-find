
    function typeWriter(elemento, delay = 50) {
      const html = elemento.innerHTML;              // Torna o elemento do html visivel
      elemento.innerHTML = '';                      // Limpa o conteúdo
      elemento.style.visibility = 'visible';        // Garante que o elemento se torne visivel
      let i = 0;                                    // Indice pra controlar aonde esta a "digitação"

      const escrever = () => {
         if (html[i] === '<') {                                // Verifica se tem alguma tag, se tiver ele vai copiar
            const fimTag = html.indexOf('>', i);
            elemento.innerHTML += html.substring(i, fimTag + 1);
           i = fimTag + 1;
          } else {
            elemento.innerHTML += html[i];          // senao, passa pro proximo caracter do texto
            i++;
          }

          if (i < html.length) {            // continua ate acabar o texto
            setTimeout(escrever, delay);  
          }
        };

       escrever();                     // começa a digitação
     } 

     window.onload = () => {                     //  cria o array com os elemento que vao receber o efeito
      const elementos = [
        document.querySelector('.titulo'),
        document.querySelector('.title-cred'),
        document.querySelector('.art'),
        document.querySelector('.gab'),
        document.querySelector('.gui'),
        document.querySelector('.gu'),
        document.querySelector('.text'),
        document.querySelector('.text-2')
      ];

      let delay = 0;
      for (const el of elementos) {
        setTimeout(() => typeWriter(el), delay);        //agenda o efeito para acontecer com atraso.
        delay += el.innerText.length * 100 + 1000;       //delay 
      }
    };

    // Áudio 

    const audio = document.getElementById('audio-menu');
    document.addEventListener('click', function () {
    audio.play();
    });
  