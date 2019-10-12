function setup(){
	createCanvas(400,400);
	background(255);
	fill(0);
	stroke(0);

	console.log(teams);
	var i = selected;
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
	text("Overall Record: ", canvasWidth +1,spacing*5);
	fill(0,255,0);
	text(totalWins, canvasWidth + 50 + 1, spacing*5);
	fill(0);
	text("-",canvasWidth + 60 + 1, spacing*5);
	fill(255,0,0);
	text(totalLosses,canvasWidth + 70 + 1,spacing*5);

	fill(0);
	text("Pro Record: ", canvasWidth + 1,spacing*6);
	fill(0,255,0);
	text(proWins, canvasWidth + 50 + 1, spacing*6);
	fill(0);
	text("-",canvasWidth + 60 + 1, spacing*6);
	fill(255,0,0);
	text(proLosses,canvasWidth + 70 + 1,spacing*6);

	fill(0);
	text("Con Record: ", canvasWidth + 1,spacing*7);
	fill(0,255,0);
	text(conWins, canvasWidth + 50 + 1, spacing*7);
	fill(0);
	text("-",canvasWidth + 60 + 1, spacing*7);
	fill(255,0,0);
	text(conLosses,canvasWidth + 70 + 1,spacing*7);

}