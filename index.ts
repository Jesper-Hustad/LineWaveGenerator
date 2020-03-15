// a

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

// DEFINING VARIABLES -----------------------------

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

const pixelSize = 6

//push effects
let strenght = 9; //the distance of the push
let widthScalar = 10; //the reach of the pusher

//boolean what to show
let displayPoints = false;
let displayLines = true;

let rotOffset = 3;
let rotScal = 4;

let scalOffset = 1;
let scalScal = 2;

//establish colors
const backgroundColor = "#c4c4c4";
const primaryColor = "#32bde3";

const height = 100;
const width = 130;
const rows = 4;
const collums = 3;
let resolution = 0.5; //more resolution means higher quality, but slower. Between {0,1}


//create canvas
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
c.canvas.width  = 900;
c.canvas.height = 750;
c.fillStyle = backgroundColor;
c.fillRect(0, 0, canvas.width, canvas.height);
c.fillStyle = primaryColor;




// CODE ------------------------------------

let genPoints = (wi:number,hi:number,col:number,row:number):point[] => 
    
        Array.from(new Array(row*col),(val,index)=>index+1).map(i => {
        const x = i%col;
        const y = Math.ceil(i/col);
        return {x:x,y:y};
    }).map(p => 
        {return {x:p.x*(wi/col),y:p.y*(hi/row)};
    });



var simP: sim[] = genPoints(width,height,Math.round(width*resolution),Math.round(height*resolution)).map(p =>{return {p:{x:p.x,y:p.y},line:p.y}});
var vecP: vec[] = genPoints(width,height,collums,rows).map(p => {return {p:p,angle:Math.random() * 360,scalar:8}});




//Adds the vector effect to the points
let simulate = (points:sim[],vectors:vec[]):sim[] => 

    //go trough every point
    points.map(sim => {
        
        //get the amount of offset applied to the point by going through every vector and adding it
        const sumVectorOffset = vectors.map(vec => addVector(vec,sim.p)).reduce((a,b)=> sumPoints(a,b));

        //add the sum of offset to the point
        return {p:sumPoints(sim.p,sumVectorOffset),line:sim.line};
    })


//adds a vectors offset to a single points
let addVector = (vec:vec,point:point) => {

    const singleDelta = distance(vec.p,point); //distance from point to vector

    const scalStr = f(singleDelta) //scalar strenght from wave function, is a function of distance

    const vecPoint = vectorToOffset(vec) //the offset from the vector (from rotation and scalar)

    //calculated offset of current vector
    return {x:vecPoint.x*scalStr,y:vecPoint.y*scalStr};

}

//from polar form to x,y
let vectorToOffset = (vec:vec) :point => {return {x:vec.scalar*Math.cos(vec.angle*(Math.PI/180)),y:vec.scalar*Math.sin(vec.angle*(Math.PI/180))}};

//distance formula
let distance = (p1:point,p2:point) => Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2))


// see the graph -> https://www.geogebra.org/graphing/eqterv22
let f = (x:number):number => {
    const WSModifier = 1 + 1/Math.pow(widthScalar,2);
    return 1/((Math.pow(WSModifier,Math.pow(-1*x,2))));
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


    points = points.filter(p=>p.line%2 == 0)

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


function generateSimP(resolution:number):sim[]{
    return genPoints(width,height,Math.round(width*resolution),Math.round(height*resolution)).map((point:point) => { return {p:{x:point.x, y:point.y}, line:point.y}})
}

function update(s:Settings){
    clear();
    const renderedPoints = simulate(generateSimP(s.resolution),vecP.map(v => {return {p:v.p,angle:v.angle+SETTING.rotOffset,scalar:v.scalar*SETTING.scalScal}}));
    if(displayLines) line(renderedPoints);
    if(displayPoints) renderedPoints.map(s => s.p).forEach(drawPix);
}


function button():void{

    vecP = genPoints(width,height,collums,rows).map(p => {return {p:p,angle:Math.random() * 360,scalar:8}});
    update(SETTING);
}



// HELPER FUNCTIONS -----------------------------------------------

    //return an array of number from bottom to top number
    // function range(bottom : number,top:number):number[]{
    //     return Array.from(new Array(top + bottom),(val,index)=>index+1+bottom);
    // }

    //adds two points together
    function sumPoints(a:point,b:point):point{
        return {x:a.x+b.x,y:a.y+b.y};
    }

    let zip = (a,b) => a.map((x,i) => [x,b[i]]);

    function clear(): void{ c.clearRect(0, 0, canvas.width, canvas.height);}
    
    function drawPixel(x:number,y:number): void{    
        c.fillRect(((x*GLOBAL_SPACING)-pixelSize/2), (y*GLOBAL_SPACING)-pixelSize/2, pixelSize, pixelSize);
    }
    
    const drawPix = (s:point) => drawPixel(s.x,s.y);

    // let pointToSim = (point:point) : sim =>  { return {p:{x:point.x, y:point.y}, line:point.y};}

// USER FUNCTIONALITY -----------------------------------------------

let dotBox = <HTMLInputElement>document.getElementById("dotsBox");
let resSlider = <HTMLInputElement>document.getElementById("resRange");
let rotSlider = <HTMLInputElement>document.getElementById("rotRange");
let scalSlider = <HTMLInputElement>document.getElementById("scalRange");
let fxSlider = <HTMLInputElement>document.getElementById("fxRange");
let res = <HTMLInputElement>document.getElementById("res");


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