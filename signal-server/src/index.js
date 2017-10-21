var io = require('socket.io')(8001)
var signal = require('simple-signal-server')(io)


var ids = {}
var rooms = {}
signal.on('discover', function (request) {
  var room = request.metadata.room
  if (!room) return // need to specify a room (bad client)
  if (!ids[room]) {
    ids[room] = []
  }
  request.discover(ids[room])
  ids[room].push(request.initiator.id)
  rooms[request.initiator.id] = room
})

signal.on('disconnect', function (socket) {
  var room = rooms[socket.id]
  delete rooms[socket.id]
  if (!ids[room]) return // leaving a nonexistent room (bad client)
  ids[room].splice(ids[room].indexOf(socket.id), 1)
})