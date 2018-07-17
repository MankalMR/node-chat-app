const path = require('path');
const express = require('express');
const fs = require('fs');

const publicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(publicPath + '/index.html');
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
