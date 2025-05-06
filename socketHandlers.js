import Player from './models/player.js';
import Lobby from './models/lobby.js';
const handleSocketConnection=(io, lobbies, socketLobbies)=>{
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on('createLobby', (lobbyId, name) => {
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
            const player = new Player(name, socket.id, lobbyId);
            lobbies[lobbyId].addPlayer(player);
            socket.join(lobbyId);
            socketLobbies[socket.id] = lobbyId;
            io.to(socket.id).emit('lobbyJoined', lobbies[lobbyId], player);
            io.to(lobbyId).emit('updateLobby', lobbies[lobbyId]);
        });
        socket.on('disconnect', () => {
            lobbies[socketLobbies[socket.id]].removePlayer(socket.id);
            if (lobbies[socketLobbies[socket.id]].players.length === 0) {
                delete lobbies[socketLobbies[socket.id]];
            }
            io.to(lobbyId).emit('updateLobby', lobbies[lobbyId]);
            console.log(`User disconnected: ${socket.id}`);
            delete socketLobbies[socket.id];
        });
    });

}
export default handleSocketConnection