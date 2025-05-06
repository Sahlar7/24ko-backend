class Lobby{
    constructor(id){
        this.id =id;
        this.players = [];
        this.status = 'waiting'
    }
    addPlayer(player){
        this.players.push(player);
    }
    removePlayer(playerId){
        this.players = this.players.filter(player => player.id !== playerId);
    }
    getPlayerById(socketId){
        return this.players.find(player => player.socketId === socketId);
    }

    startGame(){
        this.status = 'playing';
        this.players.forEach(player => {
            player.health = 100;
            player.solvedCount = 0;
            player.isAlive = true;
        });
    }
}
export default Lobby;