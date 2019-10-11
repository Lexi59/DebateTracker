let teams = new Array();
let rounds = new Array();

class Team{
	constructor(name, id){
		this.name = name;
		this.id = id;
		this.status = "up";
	}
}

class Round{
	constructor(t1, t2, s, n){
		this.winner = t1;
		this.loser = t2; 
		this.side = s;
		this.num = n;
		this.correctTeamStatuses();
	}
	correctTeamStatuses(){
		if(this.loser.status == "up"){
			this.loser.status = "down";
		}
		else if (this.loser.status == "down"){
			this.loser.status = "out";
		}
	}
}