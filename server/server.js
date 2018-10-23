const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

// app.get('/', (req, res) => {
//     res.sendFile(publicPath + '/index.html');
// });
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New User Connected!');

  socket.on('joinRoom', (params, callback) => {
    const { displayName, roomName } = params;
    if (!isRealString(displayName) || !isRealString(roomName)) {
      return callback('Display Name and Room Name are required!');
    }

    socket.join(roomName);
    //leave the room using socket.leave(params.roomName)
    users.removeUser(socket.id);
    users.addUser(socket.id, displayName, roomName);

    io.to(roomName).emit('updateUserList', users.getUserList(roomName));

    socket.emit('newMessage', {
      from: 'Admin',
      text: `${displayName}, Welcome to the Chat App!`,
      createdAt: new Date().toDateString()
    });

    socket.broadcast.to(roomName).emit('newMessage', {
      from: 'Admin',
      text: `${displayName} Joined!`,
      createdAt: new Date().toDateString()
    });

    //io.emit -> io.to(roomName).emit()
    //socket.broadcast.emit -> socket.broadcast.to(roomName).emit()
    //socket.emit
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
    const removedUser = users.removeUser(socket.id);

    if (removedUser) {
      const userName = removedUser.name;
      const room = removedUser.room;
      const usersList = users.getUserList(room);

      io.to(room).emit('updateUserList', usersList);
      io.to(room).emit('newMessage', {
        from: 'Admin',
        text: `${removedUser.name} left!`,
        createdAt: new Date().toDateString()
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Started on port ${port}`);
});
