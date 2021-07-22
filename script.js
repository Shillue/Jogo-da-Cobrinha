let lastRenderTime = 0;
const velocidadeCobra = 5;
const grade = 21;

//posição da comida
function randomGridPosition(){
    return{
        x: Math.floor(Math.random() * grade) + 1,
        y: Math.floor(Math.random() * grade) + 1
    }
}

function obterRandomPositonComida(){
    let novaPositionComida
    while (novaPositionComida == null || umaCobra(novaPositionComida)) {
        novaPositionComida = randomGridPosition()      
    }
    return novaPositionComida
}

//verifica se a cobra está fora da grade
function foraDaGrade(position){
    return(position.x < 1 || position.x > grade || position.y < 1 || position.y > grade)

}

//cobra
const cobraBody = [{x:11, y:11}];
let novoSegmentos = 0;

function atualizarCobra(){
    adicionarSegment();

    const direcaoEntrada = obterDirecaoEntrada();
    for(let i = cobraBody.length - 2; i >= 0; i--){
        cobraBody[i + 1] = { ...cobraBody[i] }
    }

    cobraBody[0].x += direcaoEntrada.x;
    cobraBody[0].y += direcaoEntrada.y;
}

function drawCobra(){
    document.getElementById("tabuleiro").innerHTML = "";
    cobraBody.forEach(segment => {
        const cobraElemento = document.createElement("div");
        const tabuleiro = document.getElementById("tabuleiro");
        cobraElemento.style.gridRowStart = segment.y;
        cobraElemento.style.gridColumnStart = segment.x;
        cobraElemento.classList.add("cobra");
        tabuleiro.appendChild(cobraElemento);
    })

}

function expandeCobra(amount){
    novoSegmentos += amount;
}

function umaCobra(position, {ignoreHead = false} = {}){
    return cobraBody.some((segment, index) =>{
        if(ignoreHead && index === 0) return false
        return igualPosition(segment, position)
    })
}

//Função cabeça da cobra
function obterHeadCobra(){
    return cobraBody[0]
}
//Função para verifica quando a cobra se cruza
function cobraIntersection(){
    return umaCobra(cobraBody[0], {ignoreHead: true})
}

function igualPosition(pos1, pos2){
    return pos1.x === pos2.x && pos1.y === pos2.y;
}
function adicionarSegment(){
    for(let i = 0; i < novoSegmentos; i++){
        cobraBody.push ({ ...cobraBody [cobraBody.length -1]}) 
    }
    novoSegmentos = 0;
}

//entrada
let direcaoEntrada = {x:0, y:0};
let direcaoDaUltimaEntrada = {x:0, y:0}; 

window.addEventListener("keydown", e => {
    switch(e.key){
        case "ArrowUp": 
            if(direcaoDaUltimaEntrada.y !== 0) break
            direcaoEntrada = {x:0, y:-1}
            break
        case "ArrowDown":
            if(direcaoDaUltimaEntrada.y !== 0) break
            direcaoEntrada = {x:0, y:1}
            break
        case "ArrowLeft": 
            if(direcaoDaUltimaEntrada.x !== 0) break
            direcaoEntrada = {x:-1, y:0}
            break
        case "ArrowRight":  
            if(direcaoDaUltimaEntrada.x !== 0) break   
            direcaoEntrada = {x:1, y:0}
            break
    }
})

function obterDirecaoEntrada(){
    direcaoDaUltimaEntrada = direcaoEntrada
    return direcaoEntrada
}

//comida
let comida = obterRandomPositonComida();
const taxaExpansao = 1;

function atualizarComida(){
    if(umaCobra(comida)){
        expandeCobra(taxaExpansao)
        comida = obterRandomPositonComida()
    }
}

function drawComida(){
    const comidaElemento = document.createElement("div");
    const tabuleiro = document.getElementById("tabuleiro");
    comidaElemento.style.gridRowStart = comida.y;
    comidaElemento.style.gridColumnStart = comida.x;
    comidaElemento.classList.add("comida");
    tabuleiro.appendChild(comidaElemento);
}

//morte
let gameOver = false;

function checkDeath(){
    gameOver = foraDaGrade(obterHeadCobra()) || cobraIntersection();
}

//Principal
function principal (currentTime){
if(gameOver){
    if(confirm("Você Perdeu :(\nClick em OK para Reiniciar !")){
        window.location = "index.html";
    }
    return;
}

    window.requestAnimationFrame(principal);

    const segundosUltimaRender = (currentTime - lastRenderTime) / 1000;
    if(segundosUltimaRender < 1 / velocidadeCobra) {return}     

    console.log("Render");
    lastRenderTime = currentTime;

    atualizarCobra();
    drawCobra();

    atualizarComida();
    drawComida();

    checkDeath();
}

window.requestAnimationFrame(principal);