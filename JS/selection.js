let glow = [document.getElementById('glow1'), document.getElementById('glow2')];
let x = [100, window.innerWidth - 100];
let y = [100, window.innerHeight - 100];
let speedX = [1, 1];
let speedY = [1, 1];
let cor = {
    raiva: '#FB5E4D',
    tristeza: '#4ECAFF',
    neutro: '#E8A3FF',
    felicidade: '#F1C103'
};

let inputs = document.querySelectorAll('input[name="emocao"]');
let seta = document.querySelector(".seta polyline");

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = -1;

    // Posição inicial dos glows
    for (let i = 0; i < glow.length; i++) {
        glow[i].style.left = `${x[i]}px`;
        glow[i].style.top = `${y[i]}px`;
        glow[i].style.visibility = 'visible'; // <- só depois de posicionar
    }
    
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', function () {
            let val = inputs[i].value;
            //guarda o valor submetido no formulário
            localStorage.setItem('emocaoSelecionada', val);
            let color = cor[val];

            // Atualiza a cor dos glows e da seta
            glow[0].style.background = color;
            glow[1].style.background = color;
            seta.style.stroke = color;

            // Atualiza blur nas imagens
            for (let j = 0; j < inputs.length; j++) {
                let img = inputs[j].nextElementSibling;
                if (inputs[j].checked) {
                    img.style.filter = "blur(0px)";
                } else {
                    img.style.filter = "blur(5px)";
                }
            }
        });
    }
    document.querySelector("form.emocoes").addEventListener("submit", () => {
        localStorage.setItem('glowX', JSON.stringify(x));
        localStorage.setItem('glowY', JSON.stringify(y));
    });
}

function draw() {
    for (let i = 0; i < glow.length; i++) {
        x[i] += speedX[i];
        y[i] += speedY[i];

        if (x[i] + 100 > window.innerWidth || x[i] < -100) speedX[i] = -speedX[i];
        if (y[i] + 100 > window.innerHeight || y[i] < -100) speedY[i] = -speedY[i];

        glow[i].style.left = `${x[i]}px`;
        glow[i].style.top = `${y[i]}px`;
    }
}
