const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

// app.get('/', (req, res) => {
//     res.sendFile(publicPath + '/index.html');
// });
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New User Connected!');

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the Chat App!',
    createdAt: new Date().toDateString()
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New User Joined!',
    createdAt: new Date().toDateString()
  });

  socket.on('createMessage', (message, callback) => {
    // This is used to emit to everyone connected.
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().toDateString()
    });

    // This is used to emit to everyone connected but the user creating the message.
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().toDateString()
    // });

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newMessage', {
      from: 'Admin',
      text: 'https://www.google.com/maps?q=' + coords.latitude + ',' + coords.longitude,
      createdAt: new Date().toDateString(),
      textAsLink: true
    });
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected!');
  });
});

server.listen(port, () => {
  console.log(`Started on port ${port}`);
});
