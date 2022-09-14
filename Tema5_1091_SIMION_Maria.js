
//preluare context canvas 
var canv = document.getElementById("gameCanvas");
var ctx = canv.getContext("2d");

const audio= new Audio();
audio.src="media/pew_pew_pew.mp3";

//setup handler de evenimente
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

//constante
const CPS = 30;//cadre pe secunde
const DIM_NAVA = 30;//pixeli
const VIT_ROTIRE = 360;// grade pe secunda - viteza rotirii

//nava
var nava = {
    x: canv.width / 2,
    y: canv.height / 2,
    r: DIM_NAVA / 2, //raza navei
    a: 90 / 180 * Math.PI, //unghiul- convertit in radiani
    rot: 0,//rotatia
    liberLansare: true,
    rachete: [],
    seMiscaSus: false,//boolean true or false
    seMiscaJos: false,
    seMiscaStanga: false,
    seMiscaDreapta: false,
    miscare: {
        x: 0,
        y: 0
    }
}

function lansareRacheta()
{
    //create laser function
    if(nava.liberLansare && nava.rachete.length< rachete_max)
        nava.rachete.push({//din varful navei
            x:  nava.x + 4 / 3 * nava.r * Math.cos(nava.a),
            y: nava.y - 4 / 3 * nava.r * Math.sin(nava.a),
            xv: viteza_racheta * Math.cos(nava.a)/CPS,
            yv: -viteza_racheta * Math.sin(nava.a)/CPS
        });
    //prevent further shooting
    liberLansare=false;
}
const INAINTARE_NAVA = 5;// cu cat accelereaza nava in pixeli pe secunda
const FRICTION = 0.7;// coeficient de frecare pentru a incetini nava
let nrAst = Math.floor(Math.random() * 7) + 1; //genereaza intre 1 si 7 inclusiv un nr aleator de asteroizi care apar pe ecran la inceputul jocului
//console.log(nrAst);


//setare bucla joc
setInterval(update, 1000 / CPS);
//asteroid
function newAsteroid() {
   
    var asteroid = {
        centerX: Math.floor(Math.random()*canv.width),
        centerY: Math.floor(Math.random()*canv.height),
        // xv: Math.random() * ROIDS_SPEED / CPS * (Math.random() < 0.5 ? 1 : -1), //x velocity- viteza
         //vrem random direction deci daca math random < 0.l5 atunci mergem intr-o directie pozitiba altfel mergem intr-o directie negativa
         //yv: Math.random() * ROIDS_SPEED / CPS * (Math.random() < 0.5 ? 1 : -1),
         //raza
        startAngle: 0,
        endAngle: 2 * Math.PI,
        nrVieti: Math.floor(Math.random() * 4) + 1,
        radius: 40, // 'this.nrVieti * 10'- nu merge!
        //speed: 10,
        xv: Math.floor(Math.random() * 4) + 1,//viteza asteroid
        yv: Math.floor(Math.random() * 4) + 1//viteza asteroid
    };

    return asteroid;
}

let asteroids = []


//setare culoare asteroizi in functie de nr de vieti ale asteroidului
function getColorBasedOnNrOfLives(nrOfLives){
    if(nrOfLives == 1) {
        return '#FF0000'
    }
    else if(nrOfLives == 2){
        return '#800080'
    }
    else if(nrOfLives == 3){
        return '#0000FF'
    }
    else if(nrOfLives == 4){
        return '#008000'
    }
    else {
        return '#FFFFFF'
    }
}

const rachete_max=10; //numar maxim de rachete 
const viteza_racheta=500;// viteza rachetei in pixeli pe secunda

// apasare tasta
function keyDown(event) {
    switch (event.keyCode) {
        case 90://z-rotire la stanga
            nava.rot = VIT_ROTIRE / 180 * Math.PI / CPS;// impart la 180 pentru a transforma in radiani
            break;
        case 67://c-rotire la dreapta
            nava.rot = -VIT_ROTIRE / 180 * Math.PI / CPS;
            break;
        case 37://sageata stanga
            nava.seMiscaStanga = true;
            break;
        case 38://sageata in sus 
            nava.seMiscaSus = true;
            break;
        case 39://sageata dreapta
            nava.seMiscaDreapta = true;
            break;
        case 40: //sageata jos
            nava.seMiscaJos = true;
            break;
         case 88://x - lansare racheta
            lansareRacheta();
            audio.play();
            break;


        //40 sageata in jos
        //39 dreapra
        //37 stanga
        //z rotire stanga 90
        //c rotire dreapta 67
        //x 88 lansare rachete
    }
}
//eliberare tasta
function keyUp(event) {
    switch (event.keyCode) {
        case 90://z-STOP rotire la stanga
            nava.rot = 0;
            break;
        case 67://c-STOP rotire la dreapta
            nava.rot = 0;
            break;
        case 37://sageata stanga
            nava.seMiscaStanga = false;
            break;
        case 38://sageata in sus 
            nava.seMiscaSus = false;
            break;
        case 39://sageata dreapta
            nava.seMiscaDreapta = false;
            break;
        case 40: //sageata jos
            nava.seMiscaJos = false;
            break;

        case 88://x - permite lansarea de noi rachete
            nava.liberLansare=true;
            break;
    }
}
//deseneaza fundal
function deseneazaFundal() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);
}
//desenare nava
function deseneazaNava() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = DIM_NAVA / 20;
    ctx.beginPath();


    ctx.moveTo(//varful
        nava.x + 4 / 3 * nava.r * Math.cos(nava.a),
        nava.y - 4 / 3 * nava.r * Math.sin(nava.a)
    );
    ctx.lineTo(//latura stanga
        nava.x - nava.r * (2 / 3 * Math.cos(nava.a) + Math.sin(nava.a)),
        nava.y + nava.r * (2 / 3 * Math.sin(nava.a) - Math.cos(nava.a))
    );

    ctx.lineTo(//latura dreapta 
        nava.x - nava.r * (2 / 3 * Math.cos(nava.a) - Math.sin(nava.a)),
        nava.y + nava.r * (2 / 3 * Math.sin(nava.a) + Math.cos(nava.a))
    );
    ctx.closePath();
    ctx.stroke();
}
//functie ce determina raza unui asteroid pe baza nr-ului de vieti ale acestuia

function getRadiusSizeBasedOnNrOfLives(nrOfLives){
    if(nrOfLives == 1) {
        return 10
    }
    else if(nrOfLives == 2){
        return 20
    }
    else if(nrOfLives == 3){
        return 30
    }
    else if(nrOfLives == 4){
        return 40
    }
    else {
        return 8
    }
}
function deseneazaAsteroizi()
{
    for (let i = 0; i < nrAst; i++) {
        asteroids.push(newAsteroid())

        //schimbare dimensiune in functie de nr de vieti
        asteroids[i].radius=getRadiusSizeBasedOnNrOfLives(asteroids[i].nrVieti);

        // desenare cerc
        ctx.beginPath();
        ctx.arc(asteroids[i].centerX, asteroids[i].centerY, asteroids[i].radius, asteroids[i].startAngle, asteroids[i].endAngle);
        

        // umplere cerc cu o culoare
        ctx.fillStyle = getColorBasedOnNrOfLives(asteroids[i].nrVieti)
        ctx.fill()

        // desenare numar in interiorul cercului
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'white'
        ctx.font = "25px Times New Roman";
        ctx.fillText(asteroids[i].nrVieti, asteroids[i].centerX, asteroids[i].centerY)
        
        ctx.stroke();
      // console.log(asteroids)
    }
}

function update() {
    //desenare fundal:
    deseneazaFundal();
    //miscare nava
    if (nava.seMiscaDreapta) {
        nava.miscare.x += INAINTARE_NAVA / CPS;


    }
    else if (nava.seMiscaSus) {

        nava.miscare.y -= INAINTARE_NAVA / CPS;
    }
    else if (nava.seMiscaJos) {

        nava.miscare.y += INAINTARE_NAVA / CPS;
    }
    else if (nava.seMiscaStanga) {

        nava.miscare.x -= INAINTARE_NAVA / CPS;
    }
    else {
        nava.miscare.x -= FRICTION * nava.miscare.x / CPS;
        nava.miscare.y -= FRICTION * nava.miscare.y / CPS;
    }

    //desenare nava
    deseneazaNava();
   

    //desenare asteroizi
deseneazaAsteroizi();
    for (let i = 0; i < nrAst; i++) {
        

        //miscare asteroizi
        asteroids[i].centerX += asteroids[i].xv;
        asteroids[i].centerY += asteroids[i].yv;
        //console.log(asteroids[i].xv);
        //console.log(asteroids[i].yv);

        //conditii pentru marginea canvasului -asteroizi
        if (asteroids[i].centerX < 0 - asteroids[i].radius) {
            asteroids[i].centerX = canv.width + asteroids[i].radius;
        } else if (asteroids[i].centerX > canv.width + asteroids[i].radius) {
            asteroids[i].centerX = 0 - asteroids[i].radius
        }
        if (asteroids[i].centerY < 0 - asteroids[i].radius) {
            asteroids[i].centerY = canv.height + asteroids[i].radius;
        } else if (asteroids[i].centerY > canv.height + asteroids[i].radius) {
            asteroids[i].centerY = 0 - asteroids[i].radius
        }

    }

    //rotire nava
    nava.a += nava.rot;

    //miscare nava
    nava.x += nava.miscare.x;
    nava.y += nava.miscare.y;

    //conditii pentru marginea canvasului - nava
    if (nava.x < 0 - nava.r) {
        nava.x = canv.width + nava.r;
    }
    else if (nava.x > canv.width + nava.r) {
        nava.x = 0 - nava.r;
    }
    if (nava.y < 0 - nava.r) {
        nava.y = canv.height + nava.r;
    }
    else if (nava.y > canv.height + nava.r) {
        nava.y = 0 - nava.r;
    }

  

    //desenare racheta
    for(var i=0; i<nava.rachete.length; i++)
    {
        ctx.fillStyle="orange";
        ctx.beginPath();
        ctx.arc(nava.rachete[i].x, nava.rachete[i].y, 5, 0, Math.PI*2 );
        ctx.fill();
    }

    //lanseaza rachete in spatiu

  for (var i=0; i<nava.rachete.length; i++)
  {
      nava.rachete[i].x+= nava.rachete[i].xv;
      nava.rachete[i].y+= nava.rachete[i].yv;
  }


    
  
}
