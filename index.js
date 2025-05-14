const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const { Server } = require('socket.io');
const handleSocketConnection = require('./socketHandlers.js');


const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'], credentials: true },
    transports: ['websocket', 'polling'],
});

lobbies = {};
socketLobbies = {};
handleSocketConnection(io, lobbies, socketLobbies);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});