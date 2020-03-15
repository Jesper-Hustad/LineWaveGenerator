// a
// DEFINING VARIABLES -----------------------------
var SETTING = {
    rotOffset: 0,
    rotScal: 1,
    scalOffset: 0,
    scalScal: 1,
    resolution: 1,
    pushStrenght: 9,
    pushWidth: 10
};
var GLOBAL_SPACING = 8;
var pixelSize = 6;
//push effects
var strenght = 9; //the distance of the push
var widthScalar = 10; //the reach of the pusher
//boolean what to show
var displayPoints = false;
var displayLines = true;
var rotOffset = 3;
var rotScal = 4;
var scalOffset = 1;
var scalScal = 2;
//establish colors
var backgroundColor = "#c4c4c4";
var primaryColor = "#32bde3";
var height = 100;
var width = 130;
var rows = 4;
var collums = 3;
var resolution = 0.5; //more resolution means higher quality, but slower. Between {0,1}
//create canvas
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
c.canvas.width = 900;
c.canvas.height = 750;
c.fillStyle = backgroundColor;
c.fillRect(0, 0, canvas.width, canvas.height);
c.fillStyle = primaryColor;
// CODE ------------------------------------
var genPoints = function (wi, hi, col, row) {
    return Array.from(new Array(row * col), function (val, index) { return index + 1; }).map(function (i) {
        var x = i % col;
        var y = Math.ceil(i / col);
        return { x: x, y: y };
    }).map(function (p) {
        return { x: p.x * (wi / col), y: p.y * (hi / row) };
    });
};
var simP = genPoints(width, height, Math.round(width * resolution), Math.round(height * resolution)).map(function (p) { return { p: { x: p.x, y: p.y }, line: p.y }; });
var vecP = genPoints(width, height, collums, rows).map(function (p) { return { p: p, angle: Math.random() * 360, scalar: 8 }; });
//Adds the vector effect to the points
var simulate = function (points, vectors) {
    //go trough every point
    return points.map(function (sim) {
        //get the amount of offset applied to the point by going through every vector and adding it
        var sumVectorOffset = vectors.map(function (vec) { return addVector(vec, sim.p); }).reduce(function (a, b) { return sumPoints(a, b); });
        //add the sum of offset to the point
        return { p: sumPoints(sim.p, sumVectorOffset), line: sim.line };
    });
};
//adds a vectors offset to a single points
var addVector = function (vec, point) {
    var singleDelta = distance(vec.p, point); //distance from point to vector
    var scalStr = f(singleDelta); //scalar strenght from wave function, is a function of distance
    var vecPoint = vectorToOffset(vec); //the offset from the vector (from rotation and scalar)
    //calculated offset of current vector
    return { x: vecPoint.x * scalStr, y: vecPoint.y * scalStr };
};
//from polar form to x,y
var vectorToOffset = function (vec) { return { x: vec.scalar * Math.cos(vec.angle * (Math.PI / 180)), y: vec.scalar * Math.sin(vec.angle * (Math.PI / 180)) }; };
//distance formula
var distance = function (p1, p2) { return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)); };
// see the graph -> https://www.geogebra.org/graphing/eqterv22
var f = function (x) {
    var WSModifier = 1 + 1 / Math.pow(widthScalar, 2);
    return 1 / ((Math.pow(WSModifier, Math.pow(-1 * x, 2))));
};
// i fucked up on making the "line" element so this is really confusing, but it works so just don't touch it
function line(points) {
    //remove odd generated points (at the end of every line there is a point which is set on the next line, that shouldn't be there)
    for (var i = 0; i < points.length - 1; i++) {
        if (points[i].line != points[i + 1].line) {
            points.splice(i, 1);
        }
    }
    //previous method skips last point so we just pop it off
    points.pop();
    var S = GLOBAL_SPACING;
    var prevLine = -1;
    var p;
    points = points.filter(function (p) { return p.line % 2 == 0; });
    //this is all we should really need, but bc. of fuckup we had to do some other stuff
    //if previous line is not the same as current line we must be at start of new line
    //so we end the previous line and begin a new one
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        p = points_1[_i];
        // console.log(p.p);
        if (p.line != prevLine) {
            c.stroke();
            c.closePath();
            c.beginPath();
        }
        else {
            c.lineTo(p.p.x * S, p.p.y * S);
        }
        prevLine = p.line;
    }
}
function generateSimP(resolution) {
    return genPoints(width, height, Math.round(width * resolution), Math.round(height * resolution)).map(function (point) { return { p: { x: point.x, y: point.y }, line: point.y }; });
}
function update(s) {
    clear();
    var renderedPoints = simulate(generateSimP(s.resolution), vecP.map(function (v) { return { p: v.p, angle: v.angle + SETTING.rotOffset, scalar: v.scalar * SETTING.scalScal }; }));
    if (displayLines)
        line(renderedPoints);
    if (displayPoints)
        renderedPoints.map(function (s) { return s.p; }).forEach(drawPix);
}
function button() {
    vecP = genPoints(width, height, collums, rows).map(function (p) { return { p: p, angle: Math.random() * 360, scalar: 8 }; });
    update(SETTING);
}
// HELPER FUNCTIONS -----------------------------------------------
//return an array of number from bottom to top number
// function range(bottom : number,top:number):number[]{
//     return Array.from(new Array(top + bottom),(val,index)=>index+1+bottom);
// }
//adds two points together
function sumPoints(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
}
var zip = function (a, b) { return a.map(function (x, i) { return [x, b[i]]; }); };
function clear() { c.clearRect(0, 0, canvas.width, canvas.height); }
function drawPixel(x, y) {
    c.fillRect(((x * GLOBAL_SPACING) - pixelSize / 2), (y * GLOBAL_SPACING) - pixelSize / 2, pixelSize, pixelSize);
}
var drawPix = function (s) { return drawPixel(s.x, s.y); };
// let pointToSim = (point:point) : sim =>  { return {p:{x:point.x, y:point.y}, line:point.y};}
// USER FUNCTIONALITY -----------------------------------------------
var dotBox = document.getElementById("dotsBox");
var resSlider = document.getElementById("resRange");
var rotSlider = document.getElementById("rotRange");
var scalSlider = document.getElementById("scalRange");
var fxSlider = document.getElementById("fxRange");
var res = document.getElementById("res");
function togglePoints() {
    displayPoints = !displayPoints;
    update(SETTING);
}
function toggleLines() {
    displayLines = !displayLines;
    update(SETTING);
}
resSlider.oninput = function () {
    SETTING.resolution = parseInt(this.value) / 100;
    update(SETTING);
};
rotSlider.oninput = function () {
    SETTING.rotOffset = parseInt(this.value) * 3.6;
    update(SETTING);
};
scalSlider.oninput = function () {
    SETTING.scalScal = parseInt(this.value) / 50;
    update(SETTING);
};
fxSlider.oninput = function () {
    widthScalar = (0.0003 * Math.pow(parseInt(this.value) / 5, 4)) + 1;
    console.log(widthScalar);
    update(SETTING);
};
// DOWNLOAD FUNCTION -----------------------------------------------
function download() {
    var download = document.getElementById("download");
    var image = document.getElementById("canvas").toDataURL("image/png").replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}
//run once when webpage loads
window.onload = function () {
    update(SETTING);
};
