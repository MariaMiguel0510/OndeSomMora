let media_recorder; // MediaRecorder: API responsável por capturar e gravar áudio
let audio_chunks = []; // blocos de dados de áudio capturados durante a gravação
let final_audio; // armazena o ficheiro final de áudio

let control_bottom = document.getElementById('control'); // botão de controlo (círculo)
let audio_player = document.getElementById('audioPlayer'); // player de áudio

let state = 'idle'; // Estado inicial: pode ser idle / recording / finished

// Clique no botão de controlo
control_bottom.onclick = async (e) => {
  
  // se estiver em estado 'idle', começa a gravar
  if (state === 'idle') {
    try {
      // pede permissão para usar o microfone e inicia a captura do áudio
      let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      media_recorder = new MediaRecorder(stream); // cria o MediaRecorder
      audio_chunks = []; // limpa os blocos anteriores

      // quando houver dados disponíveis, guarda-os no array
      media_recorder.ondataavailable = event => {
        if (event.data.size > 0) audio_chunks.push(event.data);
      };

      // quando a gravação parar
      media_recorder.onstop = () => {
        // cria um Blob com os dados de áudio recolhidos
        final_audio = new Blob(audio_chunks, { type: 'audio/webm' });

        // cria uma URL temporária para o Blob e atribui ao player
        let audio_url = URL.createObjectURL(final_audio);
        audio_player.src = audio_url;
        audio_player.play(); // reproduz automaticamente o áudio

        // muda o estado para 'finished' e atualiza a interface
        state = 'finished';
        update_interface();
      };

      // inicia a gravação
      media_recorder.start();
      state = 'recording';
      update_interface();

    } catch (err) {
      // se o utilizador negar permissão ou houver erro no microfone
      console.error('Erro ao aceder ao microfone:', err);
      alert('Erro ao aceder ao microfone.');
    }

  // se estiver a gravar, para a gravação
  } else if (state === 'recording') {
    if (media_recorder && media_recorder.state === 'recording') {
      media_recorder.stop();
    }

  // se a gravação já terminou
  } else if (state === 'finished') {
    console.log('Clique no estado FINISHED detectado');

    // verifica se o clique foi na metade esquerda ou direita
    let rect = control_bottom.getBoundingClientRect(); // obtém as coordenadas do botão
    let isLeft = e.clientX < rect.left + rect.width / 2; // compara a posição do clique com o centro
    console.log('isLeft:', isLeft);

    if (isLeft) {
      // se foi à esquerda: regravar
      console.log('Regravar selecionado');
      audio_player.pause(); // para a reprodução
      audio_player.src = ''; // limpa o player
      state = 'idle'; // volta ao estado inicial
      update_interface();
    } else {
      // se foi à direita: enviar o áudio para o servidor
      console.log('Enviar áudio ao servidor');
      alert('Preparado para enviar...');

      // protege contra envio sem áudio
      if (!final_audio) {
        alert('Erro: Nenhum áudio para enviar!');
        return;
      }

      // cria um FormData com o áudio
      let form_data = new FormData();
      form_data.append('audio', final_audio, 'emotion.webm');

      console.log('A enviar o ficheiro para o servidor...');

      // envia o áudio via POST para o servidor
      fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: form_data
      })
      .then(res => {
        if (!res.ok) throw new Error(`Erro no servidor: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Áudio guardado!', data);
        alert('Áudio guardado com sucesso!');
        // avançar aqui para o próximo ecrã!!!
      })
      .catch(err => {
        console.error('Erro ao guardar áudio:', err);
        alert('Erro ao guardar áudio. Ver consola para mais detalhes.');
      });
    }
  }
};

// Função para atualizar a interface do botão (consoante o estado)
function update_interface() {
  control_bottom.className = ''; // limpa classes anteriores
  control_bottom.innerHTML = ''; // limpa o conteúdo

  if (state === 'idle') {
    control_bottom.classList.add('start'); // estado inicial
  } else if (state === 'recording') {
    control_bottom.classList.add('recording'); // durante gravação
  } else if (state === 'finished') {
    control_bottom.classList.add('finished'); // após gravação

    // Criar botão SVG para repetir gravação
    let svg_repeat = document.createElement("img");
    svg_repeat.setAttribute("src", "/images/re_record.svg"); // <- substitui com o caminho correto
    svg_repeat.setAttribute("class", "seta");
    svg_repeat.setAttribute("alt", "Repetir");
    svg_repeat.style.width = "20%";

    // Criar botão SVG para avançar (seta para a direita)
    let svg_next = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg_next.setAttribute("class", "seta");
    svg_next.setAttribute("viewBox", "0 0 841.89 595.28");
    svg_next.innerHTML = `<polyline points="378.49,175.7 491.55,328.76 378.49,481.82" stroke-width="20" fill="none"/>`;

    control_bottom.appendChild(svg_repeat);
    control_bottom.appendChild(svg_next);
  }
}
