/* var app = require('express').createServer()
  , io = require('socket.io').listen(app);

app.listen(8888); */

var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8999);
console.log('Socket running on port: 8999');

io.sockets.on('connection', function (socket) {
  socket.emit('allTweets', { msg: 'world' });

  socket.on('newTweet', function (data) {
    socket.emit('updateTweets', data); // Se envia la notificación al creador del tweet
    socket.broadcast.emit('updateTweets', data);
  });
});