let height = 25;
let width = 75;
let roundNum = 2;
let spacing = 30;
let canvasHeight = 600;
let canvasWidth = 600;
let whatif = false;
let database; 
let teamRef, roundRef;

function setup(){
	var firebaseConfig = {
        apiKey: "AIzaSyDsyncBL9S4kjp8yWzXmAKwx1BZflAgARs",
        authDomain: "debatetracker-5d5a2.firebaseapp.com",
        databaseURL: "https://debatetracker-5d5a2.firebaseio.com",
        projectId: "debatetracker-5d5a2",
        storageBucket: "debatetracker-5d5a2.appspot.com",
        messagingSenderId: "598560336145",
        appId: "1:598560336145:web:bc590e03c11e2385a504b0",
        measurementId: "G-H3VN7FHD7H"
    };
     // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

	database = firebase.database();
	teamRef = database.ref('teams');
	roundRef = database.ref('rounds');
	teamRef.on('value', updateTeamsFromDb);
	roundRef.on('value', updateRoundsFromDb);

	createCanvas(canvasWidth,canvasHeight);
	background(255);
	newTeamCode = createInput().attribute('placeholder','Code');
	newTeamCode.position(canvasWidth + 1, 0)
	newTeamName = createInput().attribute('placeholder','Name');
	newTeamName.position(canvasWidth+1,spacing*1);
	addTeamBtn = createButton("Add Team");
	addTeamBtn.position(canvasWidth + 175 + 1,spacing);
	addTeamBtn.mousePressed(addTeam);
	roundNumberInput = createInput().attribute('placeholder','Round number');
	roundNumberInput.position(canvasWidth + 1,spacing*2);
	team1 = createInput().attribute('placeholder','Up');
	team1.position(canvasWidth + 1,spacing*3);
	side = createInput().attribute('placeholder','Which side were they on?');
	side.position(canvasWidth + 175 + 1,spacing*3);
	team2 = createInput().attribute('placeholder','Down');
	team2.position(canvasWidth + 1,spacing*4);
	clearDb = createButton("Clear Database");
	clearDb.position(canvasWidth + (2*canvasWidth)/3, 0);
	clearDb.mousePressed(clearDatabase);
	whatifBtn = createButton("What if...?");
	whatifBtn.position(canvasWidth + 1, spacing*6);
	whatifBtn.mousePressed(flipSwitch);

	var submit = createButton("Submit");
	submit.position(canvasWidth + 1,spacing*5);
	submit.mousePressed(submitRound);
	showTable();
}

function showTable(){
	clear();
	stroke(0);
	textAlign(CENTER, CENTER);
	for(var i = 0; i <= teams.length; i++){
		for(var j = 0; j <= roundNum+1; j++){
			fill(getFill(i,j));
			rect(j*width, i*height, width, height);
		}
	}
	fill(0);
	for(var i = 1; i <= teams.length; i++){
		text(teams[i-1].code, width/2, i*height + height/2);
		text(teams[i-1].name, width +  width/2, i*height + height/2);
	}
	fill(0);
	for(var i = 2; i <= roundNum+1; i++){
		text("Round "+ (i-1),i*width + width/2, height/2);
	}
	for(var i = 0; i < rounds.length; i++){
		console.log(rounds[i]);
		text(rounds[i].loser.name + " ↑ " + rounds[i].side, (rounds[i].num+1)*width+ width/2, (rounds[i].winner.id+1) * height +height/2);
		if(rounds[i].side == "pro"){
			text(rounds[i].winner.name + " ↓ con", (rounds[i].num+1)*width+ width/2, (rounds[i].loser.id+1) * height +height/2);
		}
		else{
			text(rounds[i].winner.name + " ↓ pro", (rounds[i].num+1)*width+ width/2, (rounds[i].loser.id+1) * height +height/2);
		}
	}
}
function getFill(i,j){
	if (i == 0){
		return 255;
	}
	if(teams[i-1].status == "up" && j < 2){
		return 'green';
	}
	else if (teams[i-1].status == "down" && j < 2){
		return 'red';
	}
	if (teams[i-1].status == "out"){
		return 'grey';
	}
	return 255;
}
function addTeam(){
	if(newTeamCode.value() == ""){
		alert("Sorry! You need a team code!");
		return;
	}
	var parsedTeamCode = parseInt(newTeamCode.value());
	if(isNaN(parsedTeamCode)){
		console.log("Your team code isn't a number");
		return;
	}
	if(newTeamName.value() == ""){
		alert("Sorry! You need a team name!");
		return;
	}
	for(var k = 0; k < teams.length; k++){
		if(newTeamName.value().toLowerCase() == teams[k].name){
			alert("That team name already exists!");
			return;
		}
		if(parseInt(newTeamCode.value()) == teams[k].code){
			alert("That team code already exists!");
			return;
		}
	}
	if(whatif == false){
		var dat = {
			code: parsedTeamCode,
			name: newTeamName.value().toLowerCase(),
			id: teams.length
		}
		teamRef.push(dat);
	}
	else{
		teams.push(new Team(parsedTeamCode,newTeamName.value().toLowerCase(), teams.length));
	}

	newTeamName.value("");
	newTeamCode.value("");
}
function submitRound(){
	var winner, loser;
	var found = 0;
	if(isNaN(parseInt(roundNumberInput.value()))){
		alert("Invalid Round Number");
		return;
	}
	if(parseInt(roundNumberInput.value()) > roundNum){
		roundNum++;
		showTable();
	}
	if( team1.value() == team2.value()){
		alert("You can't debate yourself");
		return;
	}
	if(isNaN(parseInt(team1.value()))){
		for(var k = 0; k < teams.length; k++){
			if(teams[k].name == team1.value().toLowerCase()){
				winner = teams[k];
				found++;
			}
			if(teams[k].name == team2.value().toLowerCase()){
				loser = teams[k];
				found++;
			}
		}
	}
	else{
		for(var k = 0; k < teams.length; k++){
			if(teams[k].code == parseInt(team1.value())){
				winner = teams[k];
				found++;
			}
			if(teams[k].code == parseInt(team2.value())){
				loser = teams[k];
				found++;
			}
		}
	}
	if(found < 2){
		alert("Check that your team names are spelled correctly");
		return;
	}
	for(var k = 0; k < rounds.length; k++){
		if(rounds[k].num == parseInt(roundNumberInput.value()) && (rounds[k].winner == winner || rounds[k].loser == loser || rounds[k].loser == winner  || rounds[k].winner == loser )){
			alert("Sorry! This person already debated this round. Try changing the round number!");
			return;
		}
	}
	if(winner.status == "out" || loser.status == "out"){
		alert("Sorry! One of the teams you entered is out and can't debate anymore!");
		return;
	}
	if(side.value().toLowerCase() != "pro" && side.value().toLowerCase() != "con"){
		alert("Sorry! I can't figure out which side team " + team1.value() + " is supposed to be on");
		return;
	}
	if(whatif == false){
		var dat = {
			winner: winner.id,
			loser: loser.id,
			side: side.value().toLowerCase(),
			rNum: parseInt(roundNumberInput.value())
		}
		roundRef.push(dat);
	}else{
		rounds.push(new Round(winner, loser, side.value().toLowerCase(), parseInt(roundNumberInput.value())));
		showTable();
	}

	team1.value("");
	team2.value("");
	side.value("");
}

function mousePressed(){
	for (var c = 0; c <= teams.length; c++)
	{
		for(var r = 0; r <= teams.length; r++)
		{
			if(mouseX <= c*width + width && mouseX >= c*width)
			{
				if(mouseY <= r*height + height && mouseY >= r*height)
				{
					if (c < 2 && r != 0){
						showTeamStats(r-1);
					}
					return;
				}
			}
		}
	}
}
function showTeamStats(i){
	showTable();
	var totalWins = 0;
	var proWins = 0;
	var conWins = 0;
	var totalLosses = 0;
	var proLosses = 0;
	var conLosses = 0;
	var gridWidth = width * (roundNum+3);
	fill(0);
	text("Team Name: " + teams[i].name, gridWidth,spacing*1);
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
				conLosses++;
			}
			if(rounds[k].side == "con"){
				proLosses++;
			}
		}
	}
	text("Overall Record: ", gridWidth +1,spacing*2);
	fill(0,255,0);
	text(totalWins, gridWidth + 50 + 1, spacing*2);
	fill(0);
	text("-",gridWidth + 60 + 1, spacing*2);
	fill(255,0,0);
	text(totalLosses,gridWidth + 70 + 1,spacing*2);

	fill(0);
	text("Pro Record: ", gridWidth + 1,spacing*3);
	fill(0,255,0);
	text(proWins, gridWidth + 50 + 1, spacing*3);
	fill(0);
	text("-",gridWidth + 60 + 1, spacing*3);
	fill(255,0,0);
	text(proLosses,gridWidth + 70 + 1,spacing*3);

	fill(0);
	text("Con Record: ", gridWidth + 1,spacing*4);
	fill(0,255,0);
	text(conWins, gridWidth + 50 + 1, spacing*4);
	fill(0);
	text("-",gridWidth + 60 + 1, spacing*4);
	fill(255,0,0);
	text(conLosses,gridWidth + 70 + 1,spacing*4);
}
function updateTeamsFromDb(data){
	if(data.val() == null){
		return;
	}
	var rawData = data.val();
	teams = new Array();
	var keys = Object.keys(data.val());
	for(var i = 0; i < keys.length; i++){
		var key = keys[i];
		teams.push( new Team(rawData[key].code, rawData[key].name, rawData[key].id) );
	}
	for(var k = 0; k < rounds.length; k++){
		if(rounds[k].loser.status == "up"){
			teams[rounds[k].loser.id].status = "down";
		}
		if(rounds[k].loser.status == "down"){
			teams[rounds[k].loser.id].status = "down";
		}
	}
	console.log(teams);
	showTable();
}
function updateRoundsFromDb(data){
	if(data.val() == null){
		return;
	}
	var rawData = data.val();
	console.log("Raw data from round function: ");
	console.log(rawData);
	rounds = new Array();
	var keys = Object.keys(data.val());
	for(var i = 0; i < keys.length; i++){
		var key = keys[i];
		console.log(rawData[key]);
		if(rawData[key].rNum > roundNum){
			roundNum = rawData[key].rNum;
		}
		rounds.push(new Round(teams[parseInt(rawData[key].winner)], teams[parseInt(rawData[key].loser)], rawData[key].side, rawData[key].rNum));
	}
	console.log(rounds);
	showTable();
}
function clearDatabase(){
	var confirm = prompt("You are about to delete all of the data from this database. Are you sure you want to continue? Type 'Yes' to confirm");
	if(confirm == "Yes"){
		roundRef.remove();
		teamRef.remove();
		location.reload();		
	}
	else{
		alert("Deletion aborted");
	}
}
function flipSwitch(){
	if(whatif == true){
		teamRef.once('value').then('updateTeamsFromDb');
		roundRef.once('value').then('updateRoundsFromDb');
		whatif = false;
		location.reload();
		alert("What if has been turned off");
		whatifBtn.style('background-color', 200);
	}
	else{
		whatif = true;
		alert("what if has been turned on");
		whatifBtn.style('background-color', 'green');
	}
}