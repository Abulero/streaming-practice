const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const server = http.createServer(app);

app.use(cors());

app.use((req, res, next) => {
    res.status(200).json(
        {
            data: 'It works!'
        })
});

server.listen(port);