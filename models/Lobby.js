class Lobby{
    constructor(id){
        this.id =id;
        this.players = [];
        this.status = 'waiting'
        this.readyCount = 0;
    }
    addPlayer(player){
        this.players.push(player);
    }
    removePlayer(socketId){
        this.players = this.players.filter(player => player.socketId !== socketId);
    }
    getPlayerById(socketId){
        return this.players.find(player => player.socketId === socketId);
    }

    startGame(){
        this.status = 'playing';
        this.players.forEach(player => {
            player.ready = false;
            player.health = 100;
            player.solvedCount = 0;
            player.isAlive = true;
        });
    }
    endGame() {
        this.status = 'results';
        const winner = this.players.filter(player => player.isAlive);
        winner.rank = 1;
    }
}
module.exports = Lobby;