console.log("hello wOOOrld");
//establish colors
var backgroundColor = "#c4c4c4";
var primaryColor = "#62858a";
//create canvas
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
c.canvas.width = 900;
c.canvas.height = 750;
c.fillStyle = backgroundColor;
c.fillRect(0, 0, canvas.width, canvas.height);
c.fillStyle = primaryColor;
function reDraw() {
    clear();
    points.forEach(function (p) { return drawPoint(p); });
}
function clear() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = backgroundColor;
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = primaryColor;
}
function drawPixel(x, y) {
    var scalar = 10;
    c.fillRect(x * scalar, y * scalar, scalar, scalar);
}
function drawPoint(pixel) {
    drawPixel(pixel.x, pixel.y);
}
var points = [];
var strenght = 9; //the distance of the push
var widthScalar = 10; //the reach of the push


//x,y point to push from and angle to push
function push(x, y, angle) {
    points = points.map(p=> {

        //distance between 2 points 
        var delta = dist(x, y, p);

        //create vector with angle, scalar from function: f(x)=1^(-x^2)
        var vec = getVector(angle, f(delta) * strenght);
        
        //add vector to point
        return { x: p.x + vec.x, y: p.y + vec.y, line: p.line };
    });
}

//x,y point to push from and angle to push
function verticalPush(x,str) {
    points = points.map(p=> {

        //create vector with angle, scalar from function: f(x)=1^(-x^2)
        var vec = getVector(270, f(Math.abs(x-p.x)) * str);
        
        //add vector to point
        return { x: p.x + vec.x, y: p.y + vec.y, line: p.line };
    });
}

function f(x) {
    var WSModifier = 1 + 1 / Math.pow(widthScalar, 2);
    return 1 / ((Math.pow(WSModifier, Math.pow(-1 * x, 2))));
}
function getVector(angle, scalar) {
    console.log("scalar:" + scalar.toFixed(3));
    return { x: scalar * Math.cos(angle * (Math.PI / 180)), y: scalar * Math.sin(angle * (Math.PI / 180)), line: 0 };
}
function dist(x, y, p) {
    return Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
}
function genPoints() {
    points = [];
    //create points
    var width = 70;
    var height = 55;
    var spacing = 1.2;
    for (var iY = 0; iY < height; iY++) {
        for (var iX = 0; iX < width; iX++) {
            points.push({ x: iX * spacing, y: iY * spacing, line: iY });
        }
    }
}
var cycle = 0;
function button() {
    switch (cycle) {
        case 0:
            document.getElementById("info").innerHTML = "Push vetically";
            genPoints();
            reDraw();
            break;
        case 1:
            document.getElementById("info").innerHTML = "Push points to generate wave illusion";
            verticalPush(-5,6);
            verticalPush(20,6);
            verticalPush(45,6);
            verticalPush(70,6);
            verticalPush(95,6);
            reDraw();
            break;
            
        case 2:
            document.getElementById("info").innerHTML = "Now draw line between points";
            clear();
            push(20, 30, 30);
            push(70, 30, 190);
            push(10, 40, 270);
            push(50, 10, 340);
            push(23, 10, 60);
            push(50, 60, 120);
            push(37, 40, 50);
            push(65, 40, 70);
            push(60, 24, 20);
            push(56, 18, 103);
            push(10, 60, 325);
            
            reDraw();
            break;
        case 3:
            document.getElementById("info").innerHTML = "Et voila! Wave pattern generated";
            clear();
            addLines();
            break;
    }
    cycle = (cycle + 1) % 4;
}
function addLines() {
    var S = 10;
    // c.beginPath();aa
    // c.moveTo(points[0].x*S,points[0].y*S);
    var prevLine = -1;
    var p;
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        p = points_1[_i];
        if (p.line != prevLine) {
            c.stroke();
            c.closePath();
            c.beginPath();
            c.moveTo(p.x * S, p.y * S);
        }
        else {
            c.lineTo(p.x * S, p.y * S);
        }
        prevLine = p.line;
    }
    c.stroke();
}
