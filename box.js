let teamNum = 0;
let size = 50;

function setup(){
	createCanvas(600,600);
	background(255);
	newTeamName = createInput().attribute('placeholder','Name');
	newTeamName.position(601,0);
	addTeamBtn = createButton("Add Team");
	addTeamBtn.position(776,0);
	addTeamBtn.mousePressed(addTeam);
	team1 = createInput().attribute('placeholder','Up');
	team1.position(601,30);
	team2 = createInput().attribute('placeholder','Down');
	team2.position(601,60);
	side = createInput().attribute('placeholder','Which side were they on?');
	side.position(776,30);
	var submit = createButton("Submit");
	submit.position(601,90);
	submit.mousePressed(submitRound);
	showTable();
}

function showTable(){
	stroke(0);
	textAlign(CENTER, CENTER);
	for(var i = 0; i <= teamNum; i++){
		for(var j = 0; j <= teamNum; j++){
			fill(getFill(i,j));
			rect(i*size, j*size, size, size);
		}
	}
	fill(0);
	for(var i = 1; i <= teamNum; i++){
		text(teams[i-1].name,size/2,i*size + size/2);
		text(teams[i-1].name,i*size + size/2,size/2);
	}
	for(var i = 0; i < rounds.length; i++){
		text(rounds[i].side, rounds[i].loser.id*size/2 + size/2, rounds[i].winner.id * size/2 +size/2);
	}
}
function getFill(i,j){
	if(i == j){
		return 0;
	}
	else if (i == 0 || j == 0){
		return 255;
	}
	for(var k = 0; k < rounds.length; k++){
		if(teams[i-1].name == rounds[k].winner.name && teams[j-1].name == rounds[k].loser.name){
			return 'red';
		}
		else if (teams[i-1].name == rounds[k].loser.name && teams[j-1].name == rounds[k].winner.name){
			return 'green';
		}
	}
	return 255;
}
function addTeam(){
	if(newTeamName.value() == ""){
		console.log("Sorry! You need a team name!");
		return;
	}
	for(var k = 0; k < teams.length; k++){
		if(newTeamName.value() == teams[k].name){
			console.log("That team already exists!");
			return;
		}
	}
	teamNum = teamNum + 1;
	teams.push(new Team(newTeamName.value(), teams.length));
	newTeamName.value("");
	showTable();
}
function submitRound(){
	var winner, loser;
	for(var k = 0; k < teams.length; k++){
		if(teams[k].name == team1.value()){
			winner = teams[k];
		}
		if(teams[k].name == team2.value()){
			loser = teams[k];
		}
	}
	if(winner == null && loser == null){
		console.log("Check that your team names are spelled correctly");
		return;
	}
	if(side.value().toLowerCase() != "pro" && side.value().toLowerCase() != "con"){
		console.log("Sorry! I can't figure out which side team " + team1.value() + " is supposed to be on");
		return;
	}
	rounds.push(new Round(winner, loser, side.value()));
	team1.value("");
	team2.value("");
	side.value("");
	showTable();
}

function mousePressed(){
	for (var c = 0; c <= teamNum; c++)
	{
		for(var r = 0; r <= teamNum; r++)
		{
			if(mouseX <= c*size + size && mouseX >= c*size)
			{
				if(mouseY <= r*size + size && mouseY >= r*size)
				{
					if(r == 0 && c!= 0){
						console.log("Opening team stats for team "+ teams[c-1].name);
					}
					else if (c == 0 && r != 0){
						console.log("Opening team stats for team " + teams[r-1].name);
					}
					return;
				}
			}
		}
	}
}
function populateTeamStats(i){
	var totalWins = 0;
	var proWins = 0;
	var conWins = 0;
	var totalLosses = 0;
	var proLosses = 0;
	var conLosses = 0;
	fill(0);
	text("Team Name: " + teams[i].name, 601,110);
	for(var k = 0; k < rounds.length; k++){
		if(rounds[k].winner.name == teams[i].name){
			totalWins++;
			if(rounds[k].side == "pro"){
				proWins++;
			}
			if(rounds[k].side == "con"){
				conWins++;
			}
		}
		if(rounds[k].loser.name == teams[i].name){
			totalLosses++;
			if(rounds[k].side == "pro"){
				proLosses++;
			}
			if(rounds[k].side == "con"){
				conLosses++;
			}
		}
	}
	text("Overall Record: ", 601,130);
	fill(0,255,0);
	text(totalWins, 651, 130);
	fill(0);
	text("-",660, 130);
	fill(255,0,0);
	text(totalLosses,669,130);

	text("Pro Record: ", 601,160);
	fill(0,255,0);
	text(proWins, 651, 160);
	fill(0);
	text("-",660, 160);
	fill(255,0,0);
	text(proLosses,669,160);

	text("Con Record: ", 601,190);
	fill(0,255,0);
	text(conWins, 651, 190);
	fill(0);
	text("-",660, 190);
	fill(255,0,0);
	text(conLosses,669,190);

}