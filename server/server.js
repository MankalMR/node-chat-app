const path = require('path');
const express = require('express');
const fs = require('fs');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
    res.sendFile(publicPath + '/index.html');
});
// app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New User Connected!');

  socket.on('disconnect', () => {
    console.log('User Disconnected!');
  });
});

server.listen(port, () => {
  console.log(`Started on port ${port}`);
});
