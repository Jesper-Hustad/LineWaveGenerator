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
    points.forEach(p=>drawPoint(p));
}

function clear(): void{
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = backgroundColor;
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = primaryColor;
}

function drawPixel(x:number,y:number): void{
    const scalar = 10;
    c.fillRect(x*scalar,y*scalar,scalar,scalar);
}

function drawPoint(pixel:Point):void{
    drawPixel(pixel.x,pixel.y);
}

var points: Point[] = [];

let strenght = 9; //the distance of the push
let widthScalar = 10; //the reach of the pusher

function push(x:number,y:number,angle:number):void{

    points = points.map(p=>{
        
        const delta = dist(x,y,p)

        const vec:Point = addVector(angle,f(delta)*strenght);

        return {x:p.x+vec.x,y:p.y+vec.y,line:p.line};

        drawPoint(p);
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





function genPoints():void{
points = [];
//create points
const width = 70;
const height = 55;
const spacing = 1.2;

for (let iY = 0; iY < height; iY++) {
    for (let iX = 0; iX < width; iX++) {
        points.push({x:iX*spacing,y:iY*spacing,line:iY});
    }
}
}



let cycle = 0;
function button():void{
    switch(cycle){
        case 0:
            document.getElementById("info").innerHTML = "Push points to generate wave illusion";

            genPoints();
            reDraw();
            break;

        case 1:
            document.getElementById("info").innerHTML = "Now draw line between points";
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



function addLines():void{
    const S = 10;
    // c.beginPath();aa
    // c.moveTo(points[0].x*S,points[0].y*S);
    let prevLine = -1;
    
    let p:Point;
    for (p of points) {
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
