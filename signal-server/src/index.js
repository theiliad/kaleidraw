var io = require('socket.io')(8000)
var signal = require('simple-signal-server')(io)


var ids = []
signal.on('discover', function (request) {
  request.discover(ids)
  ids.push(request.initiator.id)
})

signal.on('disconnect', function (socket) {
  ids.splice(ids.indexOf(socket.id), 1)
})