const Player = require('./models/Player.js');
const Lobby = require('./models/Lobby.js');

const handleSocketConnection=(io, lobbies, socketLobbies)=>{
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on('createLobby', (name) => {
            const lobbyId = Math.random().toString(36).substr(2, 9);
            const player = new Player(name, socket.id, lobbyId);
            const lobby = new Lobby(lobbyId);
            lobbies[lobbyId] = lobby;
            lobby.addPlayer(player);
            socket.join(lobbyId);
            socketLobbies[socket.id] = lobbyId;
            console.log(`User ${socket.id} created lobby ${lobbyId}`);
            io.to(socket.id).emit('lobbyJoined', lobby, player);
        });

        socket.on('joinLobby', (lobbyId, name) => {
            if (!lobbies[lobbyId]) {
                io.to(socket.id).emit('lobbyNotFound', 'Lobby not found');
                return;
            }
            if (lobbies[lobbyId].players.length >= 8) {
                io.to(socket.id).emit('lobbyFull', 'Lobby is full');
                return;
            }
            if (lobbies[lobbyId].status != 'waiting') {
                io.to(socket.id).emit('lobbyInGame', 'This lobby has already started playing. Please wait for the next game to join.')
            }
            else{
                const player = new Player(name, socket.id, lobbyId);
                lobbies[lobbyId].addPlayer(player);
                socket.join(lobbyId);
                socketLobbies[socket.id] = lobbyId;
                io.to(socket.id).emit('lobbyJoined', lobbies[lobbyId], player);
                io.to(lobbyId).emit('updateLobby', lobbies[lobbyId]);
            }
        });
        socket.on('exitLobby', () =>{
            if (socketLobbies[socket.id] && lobbies[socketLobbies[socket.id]]) {
                socket.leave(socketLobbies[socket.id]);
                const playerName = lobbies[socketLobbies[socket.id]].getPlayerById(socket.id).name;
                lobbies[socketLobbies[socket.id]].removePlayer(socket.id);
                if (lobbies[socketLobbies[socket.id]].players.length === 0) {
                    delete lobbies[socketLobbies[socket.id]];
                    console.log(`Lobby ${socketLobbies[socket.id]} deleted`);
                }
                else {
                    io.to(socketLobbies[socket.id]).emit('updateLobby', lobbies[socketLobbies[socket.id]]);
                    io.to(socketLobbies[socket.id]).emit('playerExited', `${playerName} has left the lobby`);
                }
                delete socketLobbies[socket.id];
            }
        });
        socket.on('playerReady', (lobbyId) => {
            if (lobbies[lobbyId]) {
                console.log('ready event received');
                const player = lobbies[lobbyId].getPlayerById(socket.id);
                player.ready = true;
                readyCount = lobbies[lobbyId].players.filter(player => player.ready).length;
                if(readyCount === lobbies[lobbyId].players.length){
                    io.to(lobbyId).emit('startGame', lobbies[lobbyId]);
                }
                io.to(lobbyId).emit('updateLobby', lobbies[lobbyId]);
                io.to(socket.id).emit('updatePlayer', player);
            }
        });
        socket.on('countdownFinished', (lobbyId) => {
            lobbies[lobbyId].startGame();
            const player = lobbies[lobbyId].getPlayerById(socket.id);
            io.to(socket.id).emit('updatePlayer', player);
            io.to(socket.id).emit('updateLobby', lobbies[lobbyId]);
        });

        socket.on('playerSolved', (lobbyId, damage) => {
            const player = lobbies[lobbyId].getPlayerById(socket.id);
            player.solvedCount++;
            otherPlayers = lobbies[lobbyId].players.filter(p => p.socketId !== player.socketId)
            .filter(p => p.isAlive);
            target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
            target.health -= damage;
            target.health = Math.max(target.health, 0);
            if (target.health <= 0) {
                target.isAlive = false;
                target.rank = otherPlayers.length + 1;
                socket.to(target.socketId).emit('playerDied');
            }
            if(lobbies[lobbyId].players.filter(p => p.isAlive).length === 1){
                lobbies[lobbyId].endGame();
            }
            io.to(lobbyId).emit('updateLobby', lobbies[lobbyId]);
            io.to(socket.id).emit('updatePlayer', player);
        });

        socket.on('backToLobby', () => {
            const lobby = lobbies[socketLobbies[socket.id]];
            const player = lobby.getPlayerById(socket.id);
            if(lobby.status !== 'waiting'){
                lobby.status = 'waiting';
                console.log('updated lobby status to waiting');
            }
            lobby.players.forEach(player => {
                player.reset();
                io.to(player.socketId).emit('updatePlayer', player);
            });
            io.to(lobby.id).emit('updateLobby', lobby);
        });

        socket.on('disconnect', () => {
            if (socketLobbies[socket.id]) {
                lobbies[socketLobbies[socket.id]].removePlayer(socket.id);
                if (lobbies[socketLobbies[socket.id]].players.length === 0) {
                    delete lobbies[socketLobbies[socket.id]];
                    console.log(`Lobby ${socketLobbies[socket.id]} deleted`);
                }
                else {
                    if(lobbies[socketLobbies[socket.id]].status === 'playing') {
                        if(lobbies[socketLobbies[socket.id]].players.filter(p => p.isAlive).length === 1 || lobbies[socketLobbies[socket.id]].players.length === 1){
                            lobbies[socketLobbies[socket.id]].endGame();
                        }
                    }
                    io.to(socketLobbies[socket.id]).emit('updateLobby', lobbies[socketLobbies[socket.id]]);
                    io.to(socketLobbies[socket.id]).emit('playerExited', `User ${socket.id} exited lobby ${socketLobbies[socket.id]}`);
                }
                delete socketLobbies[socket.id];
            }
        });
    });
};
module.exports = handleSocketConnection;