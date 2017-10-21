require("./app.css");
const io = require("./dependencies/socket.io.js");
const SimpleSignalClient = require("./dependencies/simple-signal-client.min.js");

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
ctx.strokeStyle = "#FF0000";

// todo: move to another module (duh)
var util = {};
util.getParameterByName = function (name) {
  var url = window.location.href
  name = name.replace(/[[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  var results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

var room = util.getParameterByName('room') || '1'

var socket = io('https://kaleidraw-signal-server-bglcynwuea.now.sh');
var signal = new SimpleSignalClient(socket, {room: room});
var peers = [];

signal.on('ready', function (ids) {
    ids.forEach((id) => signal.connect(id));
});
signal.on('request', (request) => request.accept());
signal.on('peer', (peer) => {
    peer.on('data', (data) => {
        var oldColor = ctx.strokeStyle;
    
        data = JSON.parse(data);
        ctx.strokeStyle = data.color;
        drawRadialPointsOnScreen(peer.id, data.radius, data.theta)
        ctx.strokeStyle = oldColor; // reset color
    })
    peers.push(peer);
    var index = peers.length - 1
    peer.on('close', () => {
      peers.splice(index, 1)
    })
    peer.on('error', (err) => {
      console.error(err)
      peers.splice(index, 1)
    })
});



function sendToPeers(data) {
    peers.forEach((peer) => peer.write(JSON.stringify(data)));
}

function drawLineOnScreen(x1, y1, x2, y2) {
    // var rect = canvas.getBoundingClientRect();
    // var x = e.clientX - rect.left;
    // var y = e.clientY - rect.top;
    // ctx.fillRect(x, y, 3, 3);
  
    drawPool.push([x1, y1, x2, y2])
}

var drawPool = []
function draw () {
    drawPool.forEach((line) => {
        ctx.moveTo(line[0], line[1]);
        ctx.lineTo(line[2], line[3]);
        ctx.stroke();           
    });
    drawPool = []; //empty the pool
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

function drawNewPoints (e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var centerX = (screenWidth / 2);
    var centerY = (screenHeight / 2);

    var deltaX = x - centerX;
    var deltaY = y - centerY;

    var radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    var theta = Math.atan((deltaY / deltaX)) * 180 / 3.14159265;
  
    drawRadialPointsOnScreen(null, radius, theta)
  
    sendToPeers({
        color: ctx.strokeStyle,
        radius: radius,
        theta: theta
    });
}


var lastPoints = {};
function drawRadialPointsOnScreen (setID, radius, theta) {
    var dozent = theta / ((12.0 / 36.0) * 30);
  
    var centerX = (screenWidth / 2);
    var centerY = (screenHeight / 2);
  
    lastPoints[setID] = lastPoints[setID] || [];

    for (var i = 0; i < 36; i++) {
        if (i != dozent) {
            var newTheta = (i * ((12.0 / 36) * 30)) + theta;
            var x = centerX + radius * (Math.cos(newTheta * PI / 180));
            var y = centerY + radius * (Math.sin(newTheta * PI / 180));

            lastPoints[setID][i] = lastPoints[setID][i] || [x,y];
            drawLineOnScreen(lastPoints[setID][i][0], lastPoints[setID][i][1], x, y);
            lastPoints[setID][i] = [x, y];
        }
    }
}

canvas.addEventListener("click", function(e) {
    drawNewPoints(e);
});

canvas.addEventListener("mousedown", function(e) {    
    lastPoints[null] = []; //clear line connections
    canvas.addEventListener("mousemove", drawNewPoints);
});

canvas.addEventListener("mouseup", function(e) {    
    canvas.removeEventListener("mousemove", drawNewPoints);
});