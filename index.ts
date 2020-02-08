console.log("hello wOOOrld")

const GLOBAL_SPACING = 10;

let SETTING : Settings =  {

    rotOffset : 0,
    rotScal : 1,

    scalOffset : 0,
    scalScal : 1,

    resolution : 1,

    pushStrenght: 9,
    pushWidth : 10   

}


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


function clear(): void{
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = backgroundColor;
}

function drawPixel(x:number,y:number): void{
    c.fillRect(x*GLOBAL_SPACING,y*GLOBAL_SPACING,GLOBAL_SPACING,GLOBAL_SPACING);
}

function draw(simulatedPoints:sim[]){
    simulatedPoints.forEach(s => drawPixel(s.p.x,s.p.y));
}

const height = 70;
const width = 80;
const rows = 4;
const collums = 3;
let resolution = 0.5; //more resolution means higher quality, but slower. Between {0,1}


//for optimization, may want to use: Math.round(num * 100) / 100 to round to 2nd decimal!

var simP: sim[] = genPoints(width,height,Math.round(width*resolution),Math.round(height*resolution)).map(p =>{return {p:{x:p.x,y:p.y},line:p.y}});
var vecP: vec[] = genPoints(width,height,collums,rows).map(p => {return {p:p,angle:Math.random() * 360,scalar:8}});

function generateSimP(resolution:number):sim[]{
    return genPoints(width,height,Math.round(width*resolution),Math.round(height*resolution)).map(p =>{return {p:{x:p.x,y:p.y},line:p.y}});
}


let strenght = 9; //the distance of the push
let widthScalar = 10; //the reach of the pusher


function f(x:number):number{

    const WSModifier = 1 + 1/Math.pow(widthScalar,2);
    return 1/((Math.pow(WSModifier,Math.pow(-1*x,2))));
}

function vectorToCords(vec:vec):point{
    return {x:vec.scalar*Math.cos(vec.angle*(Math.PI/180)),y:vec.scalar*Math.sin(vec.angle*(Math.PI/180))};
}

function delta(p1:point,p2:point):number{
    return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
}

let cutoff = 99999;

function render(points:sim[],vectors:vec[]):sim[]{
    return points.map(sim => {
        
        const sumDelta = vectors.map(vec => {
            // console.log("I am running with point x:" + vec.p.x + " y:" + vec.p.y);
            const singleDelta = delta(vec.p,sim.p);
            if(singleDelta >cutoff){return {x:0,y:0};}
            const vecPoint = vectorToCords(vec);
            return {x:vecPoint.x*f(singleDelta),y:vecPoint.y*f(singleDelta)};
        }).reduce((a,b)=> {return sumPoints(a,b);});
        return {p:sumPoints(sim.p,sumDelta),line:sim.line};
    })
}

function sumPoints(a:point,b:point):point{
    return {x:a.x+b.x,y:a.y+b.y};
}

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

function lines(points:sim[]){
    // console.log("Lenght is: " + points.length);
    // c.beginPath();
    // c.lineTo(points[0].p.x*GLOBAL_SPACING,points[0].p.y*GLOBAL_SPACING)
    line(points);
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


let resSlider = document.getElementById("resRange");
let res = document.getElementById("res");

res.innerHTML = resSlider.value;
resSlider.oninput = function() {
    res.innerHTML = this.value;
    SETTING.resolution = parseInt(this.value)/100;
    clear();
    update(SETTING);
  }

//   let rotSlider = document.getElementById("rotRange");
//   resSlider.oninput = function() {
//     SETTING.rotOffset = parseInt(this.value);
//     clear();
//     update(SETTING);
//   }


let rotOffset = 3;
let rotScal = 4;

let scalOffset = 1;
let scalScal = 2;



function update(s:Settings){
    lines(render(generateSimP(s.resolution),vecModifier(vecP,s.rotScal*Math.cos(s.rotOffset),s.scalScal*Math.cos(s.scalOffset))));
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


function vecModifier(vectors:vec[],rot:number,scalar:number):vec[]{
    return vectors.map(v => {return {p:v.p,angle:v.angle+rot,scalar:v.scalar*scalar};})
} 

let cycle = 0;
function button():void{
    switch(cycle){
        case 0:
            document.getElementById("info").innerHTML = "Push simP to generate wave illusion";

            clear();
            draw(simP);
            break;

        case 1:
            document.getElementById("info").innerHTML = "Now draw line between simP";
            clear();
            draw(render(simP,vecP));
            break;
        case 2:
            document.getElementById("info").innerHTML = "Et voila! Wave pattern generated";
            clear();
            lines(render(simP,vecP));
            break;

    }


    cycle= (cycle+1)%3;
}

//return an array of number from bottom to top number
function range(bottom : number,top:number):number[]{
    return Array.from(new Array(top + bottom),(val,index)=>index+1+bottom);
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
