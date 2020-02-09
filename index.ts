interface sim {
    p:point;
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

interface Settings {
    rotOffset : number;
    rotScal : number;

    scalOffset : number;
    scalScal : number;

    resolution : number;

    pushStrenght: number;
    pushWidth : number;    
}


let SETTING : Settings =  {

    rotOffset : 0,
    rotScal : 1,

    scalOffset : 0,
    scalScal : 1,

    resolution : 1,

    pushStrenght: 9,
    pushWidth : 10   

}

const GLOBAL_SPACING = 8;

let rotOffset = 3;
let rotScal = 4;

let scalOffset = 1;
let scalScal = 2;

//establish colors
const backgroundColor = "#c4c4c4";
const primaryColor = "#32bde3";


//create canvas
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
c.canvas.width  = 900;
c.canvas.height = 750;
c.fillStyle = backgroundColor;
c.fillRect(0, 0, canvas.width, canvas.height);
c.fillStyle = primaryColor;


function clear(): void{
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = primaryColor;
}

function drawPixel(x:number,y:number): void{
    const pixelSize = 6
    c.fillRect(((x*GLOBAL_SPACING)-pixelSize/2), (y*GLOBAL_SPACING)-pixelSize/2, pixelSize, pixelSize);
}

function draw(simulatedPoints:sim[]){
    simulatedPoints.forEach(s => drawPixel(s.p.x,s.p.y));
}

const drawPix = (s:point) => drawPixel(s.x,s.y);


const height = 100;
const width = 130;
const rows = 4;
const collums = 3;
let resolution = 0.5; //more resolution means higher quality, but slower. Between {0,1}


//for optimization, may want to use: Math.round(num * 100) / 100 to round to 2nd decimal!

var simP: sim[] = genPoints(width,height,Math.round(width*resolution),Math.round(height*resolution)).map(p =>{return {p:{x:p.x,y:p.y},line:p.y}});
var vecP: vec[] = genPoints(width,height,collums,rows).map(p => {return {p:p,angle:Math.random() * 360,scalar:8}});

function generateSimP(resolution:number):sim[]{
    return genPoints(width,height,Math.round(width*resolution),Math.round(height*resolution)).map(pointToSim);
}

let pointToSim = (point:point) : sim =>  { return {p:{x:point.x, y:point.y}, line:point.y};}


let strenght = 9; //the distance of the push
let widthScalar = 10; //the reach of the pusher


function f(x:number):number{

    const WSModifier = 1 + 1/Math.pow(widthScalar,2);
    return 1/((Math.pow(WSModifier,Math.pow(-1*x,2))));
}

function vectorToOffset(vec:vec):point{
    return {x:vec.scalar*Math.cos(vec.angle*(Math.PI/180)),y:vec.scalar*Math.sin(vec.angle*(Math.PI/180))};
}

function delta(p1:point,p2:point):number{
    return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
}

let cutoff = 99999;


function render(points:sim[],vectors:vec[]):sim[]{
    return points.map(sim => {
        
        const sumDelta = vectors.map(vec => {

            //distance from point to vector
            const singleDelta = delta(vec.p,sim.p);

            if(singleDelta >cutoff){return {x:0,y:0};}

            const scalStr = f(singleDelta) //scalar strenght from wave function
            
            const vecPoint = vectorToOffset(vec); //the offset from the vector (from rotation and scalar)


            return {x:vecPoint.x*scalStr,y:vecPoint.y*scalStr};
        }).reduce((a,b)=> {return sumPoints(a,b);});
        return {p:sumPoints(sim.p,sumDelta),line:sim.line};
    })
}



// i fucked up on making the "line" element so this is really confusing, but it works so just don't touch it
function line(points:sim[]):void{

    //remove odd generated points (at the end of every line there is a point which is set on the next line, that shouldn't be there)
    for (let i = 0; i < points.length-1; i++) {
        if(points[i].line!=points[i+1].line){
            points.splice(i,1);
        }
    }

    //previous method skips last point so we just pop it off
    points.pop();

    const S = GLOBAL_SPACING;
    let prevLine = -1;
    let p:sim;

    //this is all we should really need, but bc. of fuckup we had to do some other stuff

    //if previous line is not the same as current line we must be at start of new line
    //so we end the previous line and begin a new one
    for (p of points) {
        // console.log(p.p);

        if(p.line!=prevLine){
            c.stroke();
            c.closePath();
            c.beginPath();
        }else{
            c.lineTo(p.p.x*S,p.p.y*S);
        }
        prevLine = p.line;
    }
}

let displayPoints = false;
let displayLines = true;

function update(s:Settings){
    clear();
    const renderedPoints = render(generateSimP(s.resolution),vecP.map(v => {return {p:v.p,angle:v.angle+SETTING.rotOffset,scalar:v.scalar*SETTING.scalScal}}));
    if(displayLines) line(renderedPoints);
    if(displayPoints) renderedPoints.map(s => s.p).forEach(drawPix);
}


function vecModifier(vectors:vec[],rot:number,scalar:number):vec[]{
    return vectors.map(v => {return {p:v.p,angle:v.angle+rot,scalar:v.scalar*scalar};})
} 

let cycle = 0;
function button():void{

    vecP = genPoints(width,height,collums,rows).map(p => {return {p:p,angle:Math.random() * 360,scalar:8}});
    clear();
    update(SETTING);

}


function genPoints(wi:number,hi:number,col:number,row:number):point[]{
    
    return range(0,row*col).map(i => {
        const x = i%col;
        const y = Math.ceil(i/col);
        return {x:x,y:y};
    }).map(p => 
        {return {x:p.x*(wi/col),y:p.y*(hi/row)};
    });
}
// HELPER FUNCTIONS -----------------------------------------------

    //return an array of number from bottom to top number
    function range(bottom : number,top:number):number[]{
        return Array.from(new Array(top + bottom),(val,index)=>index+1+bottom);
    }

    //adds two points together
    function sumPoints(a:point,b:point):point{
        return {x:a.x+b.x,y:a.y+b.y};
    }

    let zip = (a,b) => a.map((x,i) => [x,b[i]]);


// USER FUNCTIONALITY -----------------------------------------------

let dotBox = document.getElementById("dotsBox");
let resSlider = document.getElementById("resRange");
let rotSlider = document.getElementById("rotRange");
let scalSlider = document.getElementById("scalRange");
let fxSlider = document.getElementById("fxRange");
let res = document.getElementById("res");


function togglePoints(){
    displayPoints = !displayPoints;
    update(SETTING);
}

function toggleLines(){
    displayLines = !displayLines;
    update(SETTING);
}

resSlider.oninput = function() {
    SETTING.resolution = parseInt(this.value)/100;
    update(SETTING);
  }

  rotSlider.oninput = function() {
    SETTING.rotOffset = parseInt(this.value)*3.6;
    update(SETTING);
  }

  scalSlider.oninput = function() {
    SETTING.scalScal = parseInt(this.value)/50;
    update(SETTING);
  }

  fxSlider.oninput = function() {
    widthScalar = (0.0003 * Math.pow(parseInt(this.value)/5,4) )+ 1 ;
    console.log(widthScalar);
    update(SETTING);
  }

// DOWNLOAD FUNCTION -----------------------------------------------

function download() {
    var download = document.getElementById("download");
    var image = document.getElementById("canvas").toDataURL("image/png").replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
    }


//run once when webpage loads
window.onload = function(){
    update(SETTING);
} 