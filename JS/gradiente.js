let emocao = localStorage.getItem('emocaoSelecionada');

let glow = [document.getElementById('glow1'), document.getElementById('glow2')];

let storedX = JSON.parse(localStorage.getItem('glowX'));
let storedY = JSON.parse(localStorage.getItem('glowY'));

// Se existirem posições guardadas, usa-as, senão usa valores padrão
let x = storedX && storedX.length === 2 ? storedX : [100, window.innerWidth - 200];
let y = storedY && storedY.length === 2 ? storedY : [100, window.innerHeight - 200];

let speedX = [1, 1];
let speedY = [1, 1];

let cor = {
    raiva: '#FB5E4D',
    tristeza: '#4ECAFF',
    neutro: '#E8A3FF',
    felicidade: '#F1C103'
};

let corSelecionada = cor[emocao];

// Elementos opcionais
let seta = document.querySelector(".seta polyline");
let input = document.querySelector('input[name="word"]');
let botao = document.getElementById("control");

// Aplica estilos se os elementos existirem
if (seta) {
    seta.style.stroke = corSelecionada;
}

if (input) {
    input.style.borderBottom = `6px solid ${corSelecionada}`;
}

if (botao) {
    botao.style.backgroundColor = corSelecionada;
}

function setup() {
    let canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';

    for (let i = 0; i < glow.length; i++) {
        glow[i].style.background = corSelecionada;
        glow[i].style.left = `${x[i]}px`;
        glow[i].style.top = `${y[i]}px`;
        glow[i].style.position = 'absolute';
        glow[i].style.visibility = 'visible'; // <- aqui é o momento certo
    }
}


function draw() {
    for (let i = 0; i < glow.length; i++) {
        x[i] += speedX[i];
        y[i] += speedY[i];

        if (x[i] + 100 > window.innerWidth || x[i] < -100) speedX[i] *= -1;
        if (y[i] + 100 > window.innerHeight || y[i] < -100) speedY[i] *= -1;

        glow[i].style.left = `${x[i]}px`;
        glow[i].style.top = `${y[i]}px`;
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

window.addEventListener("beforeunload", () => {
    localStorage.setItem('glowX', JSON.stringify(x));
    localStorage.setItem('glowY', JSON.stringify(y));
});