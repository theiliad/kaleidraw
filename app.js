var w = window,
d = document,
e = d.documentElement,
g = d.getElementsByTagName('body')[0],
screenWidth = w.innerWidth || e.clientWidth || g.clientWidth,
screenHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;

var PI = 3.14159265;

var canvas = document.getElementById("main");
canvas.setAttribute('width', screenWidth);
canvas.setAttribute('height', screenHeight);

var ctx = canvas.getContext("2d");
ctx.fillStyle = "#FF0000";

function drawPointOnScreen(x, y) {
    // var rect = canvas.getBoundingClientRect();
    // var x = e.clientX - rect.left;
    // var y = e.clientY - rect.top;
    // ctx.fillRect(x, y, 3, 3);

    ctx.fillRect(x, y, 2, 2);
}

function drawRadialPointOnScreen(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var centerX = (screenWidth / 2);
    var centerY = (screenHeight / 2);

    var deltaX = x - centerX;
    var deltaY = y - centerY;

    var radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    var theta = Math.atan((deltaY / deltaX)) * 180 / 3.14159265;
    var dozent = theta / ((12.0 / 36.0) * 30);

    drawPointOnScreen(x, y);

    for (var i = 0; i < 36; i++) {
        if (i != dozent) {
            var newTheta = (i * ((12.0 / 36) * 30)) + theta;
            var x = centerX + radius * (Math.cos(newTheta * PI / 180));
            var y = centerY + radius * (Math.sin(newTheta * PI / 180));

            drawPointOnScreen(x, y);
        }
    }
}

canvas.addEventListener("click", function(e) {
    drawRadialPointOnScreen(e);
});

canvas.addEventListener("mousedown", function(e) {    
    canvas.addEventListener("mousemove", drawRadialPointOnScreen);
});

canvas.addEventListener("mouseup", function(e) {    
    canvas.removeEventListener("mousemove", drawRadialPointOnScreen);
});