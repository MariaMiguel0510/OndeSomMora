let mediaRecorder;
let audioChunks = [];
let audioBlob;

const controlBtn = document.getElementById('control');
const audioPlayer = document.getElementById('audioPlayer');

let state = 'idle'; // idle | recording | finished

controlBtn.onclick = async (e) => {
  if (state === 'idle') {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioURL = URL.createObjectURL(audioBlob);
      audioPlayer.src = audioURL;
      audioPlayer.play();

      // Muda para o estado final (loop com opções)
      state = 'finished';
      updateUI();
    };

    mediaRecorder.start();
    state = 'recording';
    updateUI();

  } else if (state === 'recording') {
    mediaRecorder.stop();
  } else if (state === 'finished') {
    const isLeft = e.offsetX < controlBtn.offsetWidth / 2;
    if (isLeft) {
      // Regravar
      audioPlayer.pause();
      audioPlayer.src = '';
      state = 'idle';
      updateUI();
    } else {
      // Enviar para o servidor
      const formData = new FormData();
      formData.append('audio', audioBlob, 'emotion.webm');

      fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        console.log('Áudio guardado!', data);
        alert('Áudio guardado com sucesso!');
        // Aqui podes avançar para outro ecrã se quiseres
      })
      .catch(err => {
        console.error('Erro ao guardar áudio:', err);
      });
    }
  }
};

function updateUI() {
  controlBtn.className = ''; // reset

  if (state === 'idle') {
    controlBtn.classList.add('start');
    controlBtn.innerHTML = '';
  } else if (state === 'recording') {
    controlBtn.classList.add('recording');
    controlBtn.innerHTML = '';
  } else if (state === 'finished') {
    controlBtn.classList.add('finished');
    controlBtn.innerHTML = ''; // conteúdo gerado por CSS
  }
}
