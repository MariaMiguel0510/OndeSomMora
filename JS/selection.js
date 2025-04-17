let glow = [document.getElementById('glow1'), document.getElementById('glow2')];
let x = [100, window.innerWidth - 100];
let y = [100, window.innerHeight - 100];
let speedX = [1, 1];
let speedY = [1, 1];
let cor = ['#FB5E4D', '#4ECAFF', '#E8A3FF', '#F1C103'];

let img = [document.getElementById('raiva'), document.getElementById('tristeza'),
document.getElementById('neutro'), document.getElementById('felicidade')];
let seta = document.querySelector(".seta polyline");


function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = -1;


    // Inicializa a posição dos glows no DOM
    glow[0].style.left = `${x[0]}px`;
    glow[0].style.top = `${y[0]}px`;
    glow[1].style.left = `${x[1]}px`;
    glow[1].style.top = `${y[1]}px`;

    for (let i = 0; i < img.length; i++) {
        img[i].addEventListener('click', () => {
            glow[0].style.background = cor[i];
            glow[1].style.background = cor[i];
            seta.style.stroke = cor[i];
            
            for (let j = 0; j < img.length; j++) {
                if (j !== i) {
                    img[j].style.filter = "blur(5px)"; // Adiciona um blur a todas as imagens
                }else{
                    img[i].style.filter = "blur(0px)"; //Tira o blur da imagem atual
                }
            }
        });
    }
}

function draw() {
    for (let i = 0; i < glow.length; i++) {
        // Atualiza a posição de cada glow
        x[i] += speedX[i];
        y[i] += speedY[i];

        // Verifica se o glow atingiu as bordas da tela e inverte a direção
        if (x[i] + 100 > window.innerWidth || x[i] < -100) {
            speedX[i] = -speedX[i];
        }
        if (y[i] + 100 > window.innerHeight || y[i] < -100) {
            speedY[i] = -speedY[i];
        }

        // Atualiza a posição do glow
        glow[i].style.left = `${x[i]}px`;
        glow[i].style.top = `${y[i]}px`;
    }
}



