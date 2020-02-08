console.log("hello wOOOrld")


//establish colors
const backgroundColor = "#c4c4c4";
const primaryColor = "#62858a";


//create canvas
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
c.canvas.width  = 900;
c.canvas.height = 750;
c.fillStyle = backgroundColor;
c.fillRect(0, 0, canvas.width, canvas.height);
c.fillStyle = primaryColor;



function reDraw():void{
    clear();
    simP.forEach(p=>drawPoint(p));
}

function clear(): void{
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = backgroundColor;
}

function drawPixel(x:number,y:number): void{
    const scalar = 10;
    c.fillRect(x*scalar,y*scalar,scalar,scalar);
}

function drawPoint(pixel:Point):void{
    drawPixel(pixel.x,pixel.y);
}

const height = 300;
const width = 350;
const rows = 6;
const collums = 8;
let resolution = 0.6; //more resolution means higher quality, but slower


var simP: Point[] = genPoints(width,height,Math.round(width*resolution),Math.round(height*resolution)).map(p =>{return {x:p.x,y:p.y,line:p.y}});
var vecP: vec[] = genPoints(width,height,collums,rows).map(p => {return {p:p,angle:Math.random() * 360,scalar:1}});




let strenght = 9; //the distance of the push
let widthScalar = 10; //the reach of the pusher

function push(x:number,y:number,angle:number):void{

    simP = simP.map(p=>{
        
        const delta = dist(x,y,p)

        const vec:Point = addVector(angle,f(delta)*strenght);

        return {x:p.x+vec.x,y:p.y+vec.y,line:p.line};

    });
}

function f(x:number):number{

    const WSModifier = 1 + 1/Math.pow(widthScalar,2);
    return 1/((Math.pow(WSModifier,Math.pow(-1*x,2))));
}

function addVector(angle:number,scalar:number):Point{
    console.log("scalar:" + scalar.toFixed(3));
    return {x:scalar*Math.cos(angle*(Math.PI/180)),y:scalar*Math.sin(angle*(Math.PI/180)),line:0};
}

function dist(x:number,y:number,p:Point):number{
    return Math.sqrt(Math.pow(p.x-x,2)+Math.pow(p.y-y,2));
}

interface Point {
    x: number;
    y: number;
    line: number;
}

interface vec {
    p:point
    angle:number;
    scalar:number;
}

interface point {
    x:number;
    y:number;
}


function addLines():void{
    const S = 10;
    // c.beginPath();aa
    // c.moveTo(simP[0].x*S,simP[0].y*S);
    let prevLine = -1;
    
    let p:Point;
    for (p of simP) {
        if(p.line!=prevLine){
            c.stroke();
            c.closePath();
            c.beginPath();
            c.moveTo(p.x*S,p.y*S);
        }else{
            c.lineTo(p.x*S,p.y*S);
        }
        prevLine = p.line;
    }

    c.stroke();

}

let cycle = 0;
function button():void{
    switch(cycle){
        case 0:
            document.getElementById("info").innerHTML = "Push simP to generate wave illusion";

            reDraw();
            break;

        case 1:
            document.getElementById("info").innerHTML = "Now draw line between simP";
            clear();
            push(20,30,30);
            push(70,30,190);
            push(10,40,270);
            push(50,10,340);
            push(23,10,60);
            push(50,60,120);
            push(37,40,50);
            push(65,40,70);
            push(60,24,20);
            push(56,18,103);
            push(10,60,325);
            reDraw();
            break;

        case 2:
            document.getElementById("info").innerHTML = "Et voila! Wave pattern generated";
            clear();
            addLines();
            break;

    }


    cycle= (cycle+1)%3;
}


function genPointPlane(wi:number,hi:number):point[]{
    return genPoints(wi,hi,wi,hi);
}

function genPoints(wi:number,hi:number,col:number,row:number):point[]{
    
    return Array.from(new Array((row)*(col)),(val,index)=>index+1).map(i => {
        const x = i%wi;
        const y = Math.ceil(i/wi);
        return {x:x,y:y};
    }).map(p => 
        {return {x:p.x*(wi/col),y:p.y*(hi/row)};
    });
}

//aasd
