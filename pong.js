////////////////////////////////////////////////
// Variáveis =>

let fonteArcade;

//Variaveis do som
let iconeSomLigado, iconeSomDesligado;
let somAtivado = true;

// Variável da imagem de fundo
let imagemFundo;

// Variáveis da bola
let bolaX, bolaY, bolaVelX, bolaVelY, bolaRaio = 15;
let imagemBola;
let anguloBola = 0;
let somColisaoBola;

// Variáveis da raquete do jogador
let raqueteJogadorY;
const raqueteLargura = 15;
const raqueteAltura = 90;
const jogadorX = 20;
let imagemRaqueteJogador;
let somRaquetada;

// Variáveis da raquete do computador
let raqueteComputadorY;
const computadorX = 690;
let imagemRaqueteComputador;

// Tamanho da tela e das barras
const larguraTela = 720;
const alturaTela = 480;
const alturaBarra = 10;

//Variáveis do placar
let pontosJogador = 0;
let pontosComputador = 0;
let somGol;

let jogoPausado = false;
let vencedor = ''; // 'jogador' ou 'computador'



////////////////////////////////////////////////
// Funções =>

function preload() {
    fonteArcade = loadFont('Sprites/PressStart2P-Regular.ttf');
    imagemFundo = loadImage('Sprites/night time starry sky background 0611.jpg');
    imagemBola = loadImage('Sprites/bola.png');
    imagemRaqueteJogador = loadImage('Sprites/barra01.png');
    imagemRaqueteComputador = loadImage('Sprites/barra02.png');
    somColisaoBola = loadSound('Sprites/bollSound.wav');
    somRaquetada = loadSound('Sprites/raquetadaSound.wav');
    somGol = loadSound('Sprites/golSound.wav');
    iconeSomLigado = loadImage('Sprites/sound-on.png');
    iconeSomDesligado = loadImage('Sprites/sound-off.png');
}

const botaoSom = {
    x: larguraTela - 40,
    y: 10,
    tamanho: 30
};

function setup() {
    createCanvas(larguraTela, alturaTela);
    iniciarJogo();
}

function iniciarJogo() {
    bolaX = larguraTela / 2;
    bolaY = alturaTela / 2;
    bolaVelX = random(3, 4) * (random() > 0.5 ? 1 : -1);
    bolaVelY = random(2, 3) * (random() > 0.5 ? 1 : -1);
    
    raqueteJogadorY = alturaTela / 2 - raqueteAltura / 2;
    raqueteComputadorY = alturaTela / 2 - raqueteAltura / 2;
}

function draw() {
    background(imagemFundo);

    if (jogoPausado) {
        mostrarMensagemFinal();
        return;
    }

    desenharBarras();
    desenharPlacar();
    desenharBola();
    moverBola();
    checarFimDeJogo();
    desenharRaquete(jogadorX, raqueteJogadorY, imagemRaqueteJogador);
    desenharRaquete(computadorX, raqueteComputadorY, imagemRaqueteComputador);
    moverRaqueteJogador();
    moverRaqueteComputador();
    verificarColisoes();

    imageMode(CORNER);
    image(
        somAtivado ? iconeSomLigado : iconeSomDesligado,
        botaoSom.x,
        botaoSom.y,
        botaoSom.tamanho,
        botaoSom.tamanho
    );
}

function mousePressed() {
    if (jogoPausado) {
        pontosJogador = 0;
        pontosComputador = 0;
        jogoPausado = false;
        iniciarJogo();
        return;
    }

    if (
        mouseX >= botaoSom.x &&
        mouseX <= botaoSom.x + botaoSom.tamanho &&
        mouseY >= botaoSom.y &&
        mouseY <= botaoSom.y + botaoSom.tamanho
    ) {
        somAtivado = !somAtivado;
    }
}

function desenharBarras() {
    fill("#fff");
    rect(0, 0, larguraTela, alturaBarra);
    rect(0, alturaTela - alturaBarra, larguraTela, alturaBarra);
}

function desenharPlacar() {
    // Fundo do placar
    let larguraPlacar = 200;
    let alturaPlacar = 80;
    let x = width / 2 - larguraPlacar / 2;
    let y = 20;
  
    // Caixa escura com bordas arredondadas
    fill(0); // preto
    stroke(100); // borda cinza escura
    strokeWeight(4);
    rect(x, y, larguraPlacar, alturaPlacar, 20); // 20px de arredondamento
  
    // Texto do placar
    textFont(fonteArcade);
    textSize(30);
    fill(255); // branco
    noStroke();
    textAlign(CENTER, CENTER);
    text(`${pontosJogador} - ${pontosComputador}`, width / 2, y + alturaPlacar / 2);
  }

function desenharBola() {
    anguloBola += bolaVelX * 0.1;
    
    push();
    translate(bolaX, bolaY);
    rotate(anguloBola);
    image(imagemBola, -bolaRaio, -bolaRaio, bolaRaio * 2, bolaRaio * 2);
    pop();
}

function moverBola() {
    bolaX += bolaVelX;
    bolaY += bolaVelY;

    // Verifica colisão com a parte superior
    if (bolaY - bolaRaio <= alturaBarra) {
        bolaY = alturaBarra + bolaRaio; // reposiciona para evitar bug
        bolaVelY *= -1;
        if (somAtivado && somColisaoBola.isLoaded()) somColisaoBola.play();
    }

    // Verifica colisão com a parte inferior
    if (bolaY + bolaRaio >= alturaTela - alturaBarra) {
        bolaY = alturaTela - alturaBarra - bolaRaio;
        bolaVelY *= -1;
        if (somAtivado && somColisaoBola.isLoaded()) somColisaoBola.play();
    }

    // Gol do computador
    if (bolaX < 0) {
        pontosComputador++;
        if (somAtivado && somGol.isLoaded()) somGol.play();
        iniciarJogo();
    }

    // Gol do jogador
    if (bolaX > larguraTela) {
        pontosJogador++;
        if (somAtivado && somGol.isLoaded()) somGol.play();
        iniciarJogo();
    }
}

function desenharRaquete(x, y, imagemRaquete) {
    image(imagemRaquete, x, y, raqueteLargura, raqueteAltura);
}

function moverRaqueteJogador() {
    raqueteJogadorY = constrain(mouseY - raqueteAltura / 2, alturaBarra, alturaTela - alturaBarra - raqueteAltura);
}

function moverRaqueteComputador() {
    const velocidadeComputador = 5;
    
    if (bolaY < raqueteComputadorY + raqueteAltura / 2) {
        raqueteComputadorY -= velocidadeComputador;
    } else if (bolaY > raqueteComputadorY + raqueteAltura / 2) {
        raqueteComputadorY += velocidadeComputador;
    }

    raqueteComputadorY = constrain(raqueteComputadorY, alturaBarra, alturaTela - alturaBarra - raqueteAltura);
}

function verificarColisoes() {
    if (bolaX - bolaRaio <= jogadorX + raqueteLargura && bolaY >= raqueteJogadorY && bolaY <= raqueteJogadorY + raqueteAltura) {
        bolaVelX *= -1;
        ajustarVelocidadeEBola(1.2, 'jogador');
    }

    if (bolaX + bolaRaio >= computadorX && bolaY >= raqueteComputadorY && bolaY <= raqueteComputadorY + raqueteAltura) {
        bolaVelX *= -1;
        ajustarVelocidadeEBola(1.1, 'computador');
    }
}

function ajustarVelocidadeEBola(fator, raquete) {
    if (somAtivado) {
        if (somColisaoBola.isLoaded()) somColisaoBola.play();
        if (somRaquetada.isLoaded()) somRaquetada.play();
      }       

    let impacto = (bolaY - (bolaVelX < 0 ? raqueteJogadorY : raqueteComputadorY) - raqueteAltura / 2) / (raqueteAltura / 2);
    bolaVelY = impacto * 2;
    
    bolaVelX = constrain(bolaVelX * fator, -8, 8);
    bolaVelY = constrain(bolaVelY * fator, -8, 8);
}

function checarFimDeJogo() {
    if (pontosJogador >= 15) {
        jogoPausado = true;
        vencedor = 'jogador';
    } else if (pontosComputador >= 3) {
        jogoPausado = true;
        vencedor = 'computador';
    }
}

function mostrarMensagemFinal() {
    fill(0, 150);
    rect(0, 0, larguraTela, alturaTela);

    textFont(fonteArcade);
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(255);

    let mensagem = vencedor === 'jogador' ? 'Você Venceu!' : 'Você Perdeu!';
    text(mensagem, width / 2, height / 2 - 30);
    textSize(16);
    text('REINICIAR', width / 2, height / 2 + 20);
}

