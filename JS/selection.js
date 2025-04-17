let emocoes = document.querySelectorAll(".emocoes img");
let glowElement = document.querySelector('.glow');
let seta = document.querySelector(".seta polyline");

let x = 100;
let y = 100;
let speedX = 1;
let speedY = 1;
let animationId; // para poder parar/reiniciar se necessário

let cores = [
    '#FB5E4D',
    '#4ECAFF',
    '#E8A3FF',
    '#F1C103'
];

let index = 0; 

for (let i = 0; i < emocoes.length; i++) {
    emocoes[i].addEventListener("click", desfoque);
    emocoes[i].cor = cores[i];
}

function desfoque(event) {
    // Aplica blur a todas
    for (let i = 0; i < emocoes.length; i++) {
        emocoes[i].style.filter = "blur(5px)";
    }

    // Remove blur da imagem clicada
    event.currentTarget.style.filter = "blur(0px)";
    
    // Atualiza a cor do gradiente e da seta
    glowElement.style.background = event.currentTarget.cor;
    seta.style.stroke = event.currentTarget.cor;

    // Mostra o gradiente (não reinicia a animação)
    glowElement.style.display = "block";

    if (!animationId) {
        gradiente(); // Começa a animação se ela ainda não foi iniciada
    }
}

function gradiente() {
    // Atualiza posição
    x += speedX;
    y += speedY;

    // Verifica limites e inverte direção
    if (x + 100 > window.innerWidth || x < -100) speedX = -speedX;
    if (y + 100 > window.innerHeight || y < -100) speedY = -speedY;

    glowElement.style.left = `${x}px`;
    glowElement.style.top = `${y}px`;

    // Continua animação
    animationId = requestAnimationFrame(gradiente);
}
