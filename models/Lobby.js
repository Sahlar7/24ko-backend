class Lobby{
    constructor(id){
        this.id =id;
        this.players = [];
        this.status = 'waiting'
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
            player.reset();
        });
    }
    endGame() {
        this.status = 'results';
        const winner = this.players.filter(player => player.isAlive);
        if (winner.length > 0)
            winner.rank = 1;
    }
}
module.exports = Lobby;