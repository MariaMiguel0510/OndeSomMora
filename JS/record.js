let media_recorder; // MediaRecorder: API responsável por capturar e gravar áudio (controla o início, fim e processamento da gravação)
let audio_chunks = []; // blocos de dados de áudio capturados durante a gravação
let final_audio; // armazena o ficheiro final de áudio

let control_bottom = document.getElementById('control'); // seleciona o botão de controlo e o player de áudio
let audio_player = document.getElementById('audioPlayer'); // seleciona o player de áudio

let state = 'idle'; // Estado inicial: pode ser idle/recording/finished

// Clique no botão de controlo
control_bottom.onclick = async (e) => {

  // se estiver em estado 'idle', começa a gravar
  if (state === 'idle') {
    // pede permissão para usar o microfone e inicia a captura do áudio
    let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    media_recorder = new MediaRecorder(stream);
    audio_chunks = [];

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
      update_interface(); // função  para atualizar a interface
    };

    // inicia a gravação
    media_recorder.start();
    state = 'recording';
    update_interface(); // função para atualizar a interface

    // se estiver a gravar, para a gravação
  } else if (state === 'recording') {
    media_recorder.stop();

    // se a gravação já terminou = estado 'finished'
  } else if (state === 'finished') {

    // verifica se o clique foi na metade esquerda ou direita
    let isLeft = e.offsetX < control_bottom.offsetWidth / 2;
    if (isLeft) {
      // se foi à esquerda: regravar
      audio_player.pause(); // para a reprodução
      audio_player.src = ''; // limpa o player
      state = 'idle'; // volta ao estado inicial
      update_interface(); 
    } else {
      // se foi à direita: enviar o áudio para o servidor
      let form_data = new FormData(); // cria um FormData com o áudio
      form_data.append('audio', final_audio, 'emotion.webm');

      // envia o áudio via POST para o servidor
      fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: form_data
      })
      .then(res => res.json())
      .then(data => {
        console.log('Áudio guardado!', data);
        alert('Áudio guardado com sucesso!');
        // avançar aqui para o próximo ecrã!!!
      })
      .catch(err => {
        console.error('Erro ao guardar áudio:', err);
      });
    }
  }
};

function update_interface() {
  control_bottom.className = ''; // limpa classes anteriores
  control_bottom.innerHTML = ''; // limpa o conteúdo 

  if (state === 'idle') {
    control_bottom.classList.add('start');
  } else if (state === 'recording') {
    control_bottom.classList.add('recording');
  } else if (state === 'finished') {
    control_bottom.classList.add('finished');

     // Criar botão SVG para repetir gravacao
    let svg_repeat = document.createElement("img");
    svg_repeat.setAttribute("src", "re_record.svg"); // <- substitui aqui com o path correto
    svg_repeat.setAttribute("class", "seta");
    svg_repeat.setAttribute("alt", "Repetir"); 
    svg_repeat.style.width = "20%";

    // Criar botão SVG para avançar
    let svg_next = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg_next.setAttribute("class", "seta");
    svg_next.setAttribute("viewBox", "0 0 841.89 595.28");
    svg_next.innerHTML = `<polyline points="378.49,175.7 491.55,328.76 378.49,481.82" stroke-width="20" fill="none"/>`;

    control_bottom.appendChild(svg_repeat);
    control_bottom.appendChild(svg_next);
  }
}