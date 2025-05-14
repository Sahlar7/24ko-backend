class Player {
    constructor(name, socketId, lobbyId) {
        this.name = name;
        this.socketId = socketId;
        this.health = 100;
        this.solvedCount = 0;
        this.isAlive = true;
        this.lobbyId = lobbyId; 
        this.ready = false;
    }
    setHealth(health) {
        this.health = health;
    }
    setSolvedCount(solvedCount) {
        this.solvedCount = solvedCount;
    }
    setIsAlive(isAlive) {
        this.isAlive = isAlive;
    }
}

module.exports = Player;