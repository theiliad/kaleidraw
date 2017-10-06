var w = window,
d = document,
e = d.documentElement,
g = d.getElementsByTagName('body')[0],
x = w.innerWidth || e.clientWidth || g.clientWidth,
y = w.innerHeight|| e.clientHeight|| g.clientHeight;

var canvas = document.getElementById("main");
canvas.setAttribute('width', x);
canvas.setAttribute('height', y);

var ctx = canvas.getContext("2d");
ctx.fillStyle = "#FF0000";

document.addEventListener("click", function(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    ctx.fillRect(x, y, 3, 3);
});