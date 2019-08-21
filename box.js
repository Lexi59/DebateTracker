//16 columns
//21 rows
customW = 360;
customH = 700;
rows = 20;
columns = 14;
rectW = customH/rows;
rectH = customW/columns;
startingPosition = [0,40];
let img, answerRef, submissionRef, rawAnswerData;
var boxes = new Array();
var numberInputs = new Array();
var answers = new Array();
class box{
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.checked = false;
	}
	show()
	{
		strokeWeight(2);
		stroke(0);
		if(this.checked){
			fill(255,0,0,60);
		}
		else
		{
			noFill();
		}
		rect(this.x + startingPosition[0],this.y + startingPosition[1],rectW,rectH);
	}
}
class entry{
	constructor(key){
		this.flagNum= rawAnswerData[key].flagNum;
		this.plantNum= rawAnswerData[key].plantNum;
		this.perennial= rawAnswerData[key].perennial;
		this.biennial= rawAnswerData[key].biennial;
		this.annual= rawAnswerData[key].annual;
		this.cool= rawAnswerData[key].cool;
		this.warm= rawAnswerData[key].warm;
		this.native= rawAnswerData[key].native;
		this.introduced= rawAnswerData[key].introduced;
		this.invader= rawAnswerData[key].invader;
		this.grouseFoodDe= rawAnswerData[key].grouseFoodDe;
		this.grouseFoodUn= rawAnswerData[key].grouseFoodUn;
		this.grouseCoverDe= rawAnswerData[key].grouseCoverDe;
		this.grouseCoverUn= rawAnswerData[key].grouseCoverUn;
		this.cattleFoodDe= rawAnswerData[key].cattleFoodDe;
		this.cattleFoodUn= rawAnswerData[key].cattleFoodUn;
	}
}
function setup(){
	//FIREBASE
	 var firebaseConfig = {
        apiKey: "AIzaSyAyTvplcy-0Q9S03RLs2gyEdj0-KCLWPB0",
        authDomain: "rangelanddaysscoring.firebaseapp.com",
        databaseURL: "https://rangelanddaysscoring.firebaseio.com",
        projectId: "rangelanddaysscoring",
        storageBucket: "rangelanddaysscoring.appspot.com",
        messagingSenderId: "1060084803108",
        appId: "1:1060084803108:web:93db28d80237eeb0"
      };
     firebase.initializeApp(firebaseConfig);
     var database = firebase.database();
     answerRef = database.ref('answers');
     submissionRef = database.ref('submissions');
     answerRef.once('value').then(updateAnswers);
     //END FIREBASE
	createCanvas(windowWidth,windowHeight);
	colorMode(RGB);
	var fileInput = createFileInput(selectImage);
	fileInput.position(rectW * columns + 105, 50);
	background(255,255,255);
	for(var r = 0; r < rows; r++)
	{
		var row = new Array();
		for(var c = 0; c < columns; c++)
		{
			var b = new box((c+1)*rectW,r*rectH);
			row.push(b);
		}
		boxes.push(row);
	}
	for (var i = 0; i < rows; i++)
	{
		inp = createInput();
		numberInputs.push(inp);
	}
	var tabString = "Answer Tab"
	if (findTab() == "Answer")
	{
		tabString = "Submission Tab"
		saveButton = createButton("Save");
		saveButton.position(rectW*columns+105,75);
		saveButton.mousePressed(saveAnswers);
	}
	else
	{
		scoreButton = createButton("Score");
		scoreButton.position(rectW*columns + 105, 75);
		scoreButton.mousePressed(calculateScore);

		kidNameInput = createInput().attribute('placeholder','Name');
		kidNameInput.position(rectW*columns + 105, 100);

		scorebox = createInput().attribute('placeholder','Score');
  		scorebox.position(rectW*columns+105,150);
	}
	answerTabbutton = createButton(tabString);
  	answerTabbutton.position(rectW*columns + 105, 25);
  	answerTabbutton.mousePressed(switchTab);

  	divisionInput = createInput().attribute('placeholder', 'Division');
  	divisionInput.position(rectW * columns + 105, 125);
}
function draw()
{
	clear();
	checkKeys();
	if(img){image(img, rectW, 0, 600,1000);}
	for (var r = 0; r < rows; r++)
	{
		numberInputs[r].size(rectW,rectH);
		numberInputs[r].position(0+startingPosition[0],r*rectH+startingPosition[1]);
		for(var c = 0; c < columns; c++)
		{
			boxes[r][c].show();
		}
	}
}
function switchTab()
{
	if( findTab() == "Answer")
	{
		window.location.href = 'index.html';
	}
	else 
	{
		pwd = prompt("Enter the password");
		if(pwd == "JeffIsAwesome"){
			window.location.href = 'answerTab.html';
		}
		else{
			alert("Sorry! Wrong password. You may not have access to change the answer sheet");
		}
	}
}
function selectImage(file)
{
	if (file.type === 'image')
	{
    	img = createImg(file.data);
    	img.hide();
  	} 
  	else
  	{
  		img= null;
  	}
}
function mousePressed(){
	for (var r = 0; r < rows; r++)
	{
		for(var c = 0; c < columns; c++)
		{
			var b = boxes[r][c];
			if(mouseX <= (b.x + startingPosition[0]) + rectW && mouseX >= (b.x+startingPosition[0]))
			{
				if(mouseY <= (b.y + startingPosition[1]) + rectH && mouseY >= (b.y+startingPosition[1]))
				{
					b.checked = !b.checked;
					return;
				}
			}
		}
	}
}
function checkKeys()
{
	if(keyIsDown(87))
	{
		startingPosition[1] -= 1;
		if(startingPosition[1] < 0)
			startingPosition[1] = 0
	}
	if(keyIsDown(83))
	{
		startingPosition[1]+=1;
		if(startingPosition[1] > windowHeight)
			startingPosition[1] = windowHeight;
	}
	if(keyIsDown(65))
	{
		startingPosition[0] -= 1;
		if(startingPosition[0] < 0)
			startingPosition[0] = 0;
	}
	if(keyIsDown(68))
	{
		startingPosition[0]+=1;
		if(startingPosition[0] > windowWidth)
			startingPosition[0] = windowWidth;
	}
	if(keyIsDown(88)){
		customW += 2;
		customH += 2;
		sizeChange();
	}
	if(keyIsDown(90)){
		customH -=2;
		customW -=2;
		sizeChange();
	}
}
function findTab()
{
	if( window.location.href.indexOf('answerTab.html') >= 0)
	{
		return "Answer"
	}
	else
	{
		return "Submission"
	}
}
function calculateScore()
{
	var score = 0;
	for(var r = 0; r < rows; r++)
	{
		var answer = answers[r];
		//if plant number is wrong, skip the row
		if (numberInputs[r].value()==answer.plantNum)
		{
			score += 8;
			//Life Span section
			if(boxes[r][0].checked && answer.perennial)
			{
				score += 2;
			}
			else if (boxes[r][1].checked && answer.biennial)
			{
				score += 2;
			}
			else if (boxes[r][2].checked && answer.annual)
			{
				score += 2;
			}
			//Growth season section
			if(boxes[r][3].checked && answer.cool)
			{
				score += 2;
			}
			else if (boxes[r][4].checked && answer.warm)
			{
				score += 2;
			}
			//origin
			if(boxes[r][5].checked && !boxes[r][7].checked &&answer.native && !answer.invader)
			{
				score += 2;
			}
			else if (boxes[r][5].checked && boxes[r][7].checked && answer.native && answer.invader)
			{
				score += 2;
			}
			else if (boxes[r][6].checked && boxes[r][7].checked && answer.introduced && answer.invader)
			{
				score += 2;
			}
			//prairie Grouse food
			if (boxes[r][8].checked && answer.grouseFoodDe)
			{
				score += 2;
			}
			else if (boxes[r][9].checked && answer.grouseFoodUn)
			{
				score += 2;
			}
			//prairie grouse cover
			if (boxes[r][10].checked && answer.grouseCoverDe)
			{
				score += 2;
			}
			else if (boxes[r][11].checked && answer.grouseCoverUn)
			{
				score += 2;
			}
			//cattle food
			if (boxes[r][12].checked && answer.cattleFoodDe)
			{
				score += 2;
			}
			else if (boxes[r][13].checked && answer.cattleFoodUn)
			{
				score += 2;
			}
		}
	}
	scorebox.value(score);
	submissionRef.once('value').then(submitScore);
	var dat = {
		name: kidNameInput.value(),
		division: divisionInput.value(),
		judgingScore: score
	}
	submissionRef.push(dat);
}
function submitScore(data){
	rawAnswerData = data.val();
	var keys = Object.keys(data.val());
	for(var i =0; i < keys.length; i++)
	{
		var x = rawAnswerData[keys[i]]
		if(x.name == kidNameInput.value() && x.division == divisionInput.value())
		{
			submissionRef.child(keys[i]).remove();
			return;
		}
	}
}
function saveAnswers()
{
	pwd = prompt("Are you sure you want to overwrite the current Answer sheet? Type yes");
	if(pwd != "yes"){
		alert("Operation cancelled");
		return;
	}
	answerRef.set(null);
	for(var r = 0; r < rows; r++)
	{
		var row = new Array();
		for(var c = 0; c < columns; c++)
		{
			row.push(boxes[r][c].checked);
		}
		var data = {
			flagNum: r+1,
			plantNum: numberInputs[r].value(),
			perennial: row[0],
			biennial: row[1],
			annual: row[2],
			cool: row[3],
			warm: row[4],
			native: row[5],
			introduced: row[6],
			invader: row[7],
			grouseFoodDe: row[8],
			grouseFoodUn: row[9],
			grouseCoverDe: row[10],
			grouseCoverUn: row[11],
			cattleFoodDe: row[12],
			cattleFoodUn: row[13]
		}
		answerRef.push(data)
	}
}
function updateAnswers(data)
{
	if (data.val() == null){
		return;
	}
	rawAnswerData = data.val();
	answers = new Array();
	var keys = Object.keys(data.val());
	for(var i =0; i < keys.length; i++)
	{
		answers.push(new entry(keys[i]));
	}
	console.log(answers);
}
function sizeChange(){
	rectW = customH/rows;
	rectH = customW/columns;
	for(var r = 0; r < rows; r++)
	{
		for(var c = 0; c < columns; c++)
		{
			var b = boxes[r][c];
			b.x = (c+1)*rectW;
			b.y = r*rectH;
		}
	}
}