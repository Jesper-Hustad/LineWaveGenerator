console.log("hello wOOOrld");
var GLOBAL_SPACING = 10;
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
function clear() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = backgroundColor;
}
function drawPixel(x, y) {
    c.fillRect(x * GLOBAL_SPACING, y * GLOBAL_SPACING, GLOBAL_SPACING, GLOBAL_SPACING);
}
function draw(simulatedPoints) {
    simulatedPoints.forEach(function (s) { return drawPixel(s.p.x, s.p.y); });
}
var height = 70;
var width = 80;
var rows = 4;
var collums = 3;
var resolution = 0.5; //more resolution means higher quality, but slower. Between {0,1}
//for optimization, may want to use: Math.round(num * 100) / 100 to round to 2nd decimal!
var simP = genPoints(width, height, Math.round(width * resolution), Math.round(height * resolution)).map(function (p) { return { p: { x: p.x, y: p.y }, line: p.y }; });
var vecP = genPoints(width, height, collums, rows).map(function (p) { return { p: p, angle: Math.random() * 360, scalar: 8 }; });
var strenght = 9; //the distance of the push
var widthScalar = 10; //the reach of the pusher
function f(x) {
    var WSModifier = 1 + 1 / Math.pow(widthScalar, 2);
    return 1 / ((Math.pow(WSModifier, Math.pow(-1 * x, 2))));
}
function vectorToCords(vec) {
    return { x: vec.scalar * Math.cos(vec.angle * (Math.PI / 180)), y: vec.scalar * Math.sin(vec.angle * (Math.PI / 180)) };
}
function delta(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
var cutoff = 99999;
function render(points) {
    return simP.map(function (sim) {
        var sumDelta = vecP.map(function (vec) {
            // console.log("I am running with point x:" + vec.p.x + " y:" + vec.p.y);
            var singleDelta = delta(vec.p, sim.p);
            if (singleDelta > cutoff) {
                return { x: 0, y: 0 };
            }
            var vecPoint = vectorToCords(vec);
            return { x: vecPoint.x * f(singleDelta), y: vecPoint.y * f(singleDelta) };
        }).reduce(function (a, b) { return sumPoints(a, b); });
        return { p: sumPoints(sim.p, sumDelta), line: sim.line };
    });
}
function sumPoints(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
}
function lines(points) {
    console.log("Lenght is: " + points.length);
    // c.beginPath();
    // c.lineTo(points[0].p.x*GLOBAL_SPACING,points[0].p.y*GLOBAL_SPACING)
    addLines(points);
}
// i fucked up on making the "line" element so this is really confusing, but it works so just don't touch it
function addLines(points) {
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
    //this is all we should really need, but bc. of fuckup we had to do some other stuff
    //if previous line is not the same as current line we must be at start of new line
    //so we end the previous line and begin a new one
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        p = points_1[_i];
        console.log(p.p);
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
var cycle = 0;
function button() {
    switch (cycle) {
        case 0:
            document.getElementById("info").innerHTML = "Push simP to generate wave illusion";
            clear();
            draw(simP);
            break;
        case 1:
            document.getElementById("info").innerHTML = "Now draw line between simP";
            clear();
            draw(render(simP));
            // push(20,30,30);
            // push(70,30,190);
            // push(10,40,270);
            // push(50,10,340);
            // push(23,10,60);
            // push(50,60,120);
            // push(37,40,50);
            // push(65,40,70);
            // push(60,24,20);
            // push(56,18,103);
            // push(10,60,325);
            // reDraw();
            break;
        case 2:
            document.getElementById("info").innerHTML = "Et voila! Wave pattern generated";
            clear();
            lines(render(simP));
            break;
    }
    cycle = (cycle + 1) % 3;
}
//return an array of number from bottom to top number
function range(bottom, top) {
    return Array.from(new Array(top + bottom), function (val, index) { return index + 1 + bottom; });
}
function genPoints(wi, hi, col, row) {
    return range(0, row * col).map(function (i) {
        var x = i % col;
        var y = Math.ceil(i / col);
        return { x: x, y: y };
    }).map(function (p) {
        return { x: p.x * (wi / col), y: p.y * (hi / row) };
    });
}
