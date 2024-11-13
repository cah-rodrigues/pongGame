////////////////////////////////////////////////
// Variáveis =>

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

////////////////////////////////////////////////
// Funções =>

function preload() {
    imagemFundo = loadImage('Sprites/fundo2.png');
    imagemBola = loadImage('Sprites/bola.png');
    imagemRaqueteJogador = loadImage('Sprites/barra01.png');
    imagemRaqueteComputador = loadImage('Sprites/barra02.png');
    somColisaoBola = loadSound('Sprites/bollSound.wav');
    somRaquetada = loadSound('Sprites/raquetadaSound.wav');
    somGol = loadSound('Sprites/golSound.wav');
}

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
    desenharBarras();
    desenharPlacar();
    desenharBola();
    moverBola();
    desenharRaquete(jogadorX, raqueteJogadorY, imagemRaqueteJogador);
    desenharRaquete(computadorX, raqueteComputadorY, imagemRaqueteComputador);
    moverRaqueteJogador();
    moverRaqueteComputador();
    verificarColisoes();
}

function desenharBarras() {
    fill("#2B3FD6");
    rect(0, 0, larguraTela, alturaBarra);
    rect(0, alturaTela - alturaBarra, larguraTela, alturaBarra);
}

function desenharPlacar(){
    textAlign(CENTER, TOP);
    textSize(32);
    stroke(0);
    strokeWeight(5);
    fill(255);
    text(`Jogador: ${pontosJogador}  -  Computador: ${pontosComputador}`, larguraTela / 2, 20);

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

    if (bolaY < alturaBarra + bolaRaio || bolaY > alturaTela - alturaBarra - bolaRaio) {
        bolaVelY *= -1;
        somColisaoBola.play();
    }

    if (bolaX < 0) {
        pontosComputador++;
        somGol.play();
        iniciarJogo();
    } else if (bolaX > larguraTela){
        pontosJogador++;
        somGol.play();
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
    somColisaoBola.play();
    somRaquetada.play();

    let impacto = (bolaY - (bolaVelX < 0 ? raqueteJogadorY : raqueteComputadorY) - raqueteAltura / 2) / (raqueteAltura / 2);
    bolaVelY = impacto * 3;
    
    bolaVelX = constrain(bolaVelX * fator, -8, 8);
    bolaVelY = constrain(bolaVelY * fator, -8, 8);
}
