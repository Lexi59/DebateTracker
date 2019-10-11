let teamNum = 0;
let height = 25;
let width = 75;
let roundNum = 2;
let spacing = 30;
let canvasHeight = 600;
let canvasWidth = 600;

function setup(){
	createCanvas(canvasWidth,canvasHeight);
	background(255);
	newTeamName = createInput().attribute('placeholder','Name');
	newTeamName.position(canvasWidth+1,0);
	addTeamBtn = createButton("Add Team");
	addTeamBtn.position(canvasWidth + 175 + 1,0);
	addTeamBtn.mousePressed(addTeam);
	roundNumberInput = createInput().attribute('placeholder','Round number');
	roundNumberInput.position(canvasWidth + 1,spacing);
	team1 = createInput().attribute('placeholder','Up');
	team1.position(canvasWidth + 1,spacing*2);
	team2 = createInput().attribute('placeholder','Down');
	team2.position(canvasWidth + 1,spacing*3);
	side = createInput().attribute('placeholder','Which side were they on?');
	side.position(canvasWidth + 175 + 1,spacing*2);

	var submit = createButton("Submit");
	submit.position(canvasWidth + 1,spacing*4);
	submit.mousePressed(submitRound);
	showTable();
}

function showTable(){
	clear();
	stroke(0);
	textAlign(CENTER, CENTER);
	for(var i = 0; i <= teamNum; i++){
		for(var j = 0; j <= roundNum; j++){
			fill(getFill(i,j));
			rect(j*width, i*height, width, height);
		}
	}
	fill(0);
	for(var i = 1; i <= teamNum; i++){
		text(teams[i-1].name,width/2,i*height + height/2);
	}
	fill(0);
	for(var i = 1; i <= roundNum; i++){
		text("Round "+ i,i*width + width/2, height/2);
	}
	for(var i = 0; i < rounds.length; i++){
		text(rounds[i].loser.name + " ↑ " + rounds[i].side, rounds[i].num*width+ width/2, (rounds[i].winner.id+1) * height +height/2);
		if(rounds[i].side == "pro"){
			text(rounds[i].winner.name + " ↓ con", rounds[i].num*width+ width/2, (rounds[i].loser.id+1) * height +height/2);
		}
		else{
			text(rounds[i].winner.name + " ↓ pro", rounds[i].num*width+ width/2, (rounds[i].loser.id+1) * height +height/2);
		}
	}
}
function getFill(i,j){
	if (i == 0 || j != 0){
		return 255;
	}
	if(teams[i-1].status == "up"){
		return 'green';
	}
	else if (teams[i-1].status == "down"){
		return 'red';
	}
	else if (teams[i-1].status == "out"){
		return 'grey';
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
	if(parseInt(roundNumberInput.value()) > roundNum){
		roundNum++;
		showTable();
	}
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
	rounds.push(new Round(winner, loser, side.value().toLowerCase(), parseInt(roundNumberInput.value())));
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
			if(mouseX <= c*width + width && mouseX >= c*width)
			{
				if(mouseY <= r*height + height && mouseY >= r*height)
				{
					if (c == 0 && r != 0){
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