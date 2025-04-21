function mostraTexto() {
    let texto = document.querySelectorAll('.texto');
    let nL = 3; // número de linhas de texto (h2)
    let i = 0; // variável para controlar qual das linhas é exibida

    function escreve() {

        if (i < nL) {
            // Esconde todas as frases
            texto.forEach(t => t.style.display = 'none');
            
            // Mostra a atual
            texto[i].style.display = 'block';
            i++;
        } else {
            // Quando todas já foram mostradas, espera 5s e redireciona
            setTimeout(() => {
                window.location.href = 'record.html';
            });
        }
    }

    // mostra a primeira frase
    escreve();

    // define o intervalo para trocar as frases a cada 5 segundos
    setInterval(escreve, 5000);
}

// Executa a função após o carregamento da página
window.onload = mostraTexto;
