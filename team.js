let teams = new Array();
let rounds = new Array();

class Team{
	constructor(name, id){
		this.name = name;
		this.id = id;
	}
}

class Round{
	constructor(t1, t2, s){
		this.winner = t1;
		this.loser = t2; 
		this.side = s;
	}
}