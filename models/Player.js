class Player {
    constructor(name, socketId, lobbyId) {
        this.name = name;
        this.socketId = socketId;
        this.health = 100;
        this.solvedCount = 0;
        this.isAlive = true;
        this.lobbyId = lobbyId; 
        this.ready = false;
        this.rank = 0;
    }
}

module.exports = Player;