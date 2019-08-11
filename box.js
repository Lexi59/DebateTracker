//16 columns
//21 rows
customW = 560;
customH = 800;
rows = 20;
columns = 14;
rectW = customH/rows;
rectH = customW/columns;
offset = rectW;
startingPosition = [0,0];
let img, answerRef, submissionRef, rawAnswerData;
var boxes = new Array();
var numberInputs = new Array();
var answers = new Array();
class box{
	constructor(x,y,w,h){
		this.x = x;
		this.y = y;
		this.checked = false;
	}
	show()
	{
		strokeWeight(2);
		stroke(0);
		if(this.checked){
			fill("red");
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
	for(var c = 0; c < columns; c++)
	{
		var row = new Array();
		for(var r = 0; r < rows; r++)
		{
			var b = new box(c*rectW + offset+5,r*rectH,rectW,rectH);
			row.push(b);
		}
		boxes.push(row);
	}
	for (var i = 0; i < rows; i++)
	{
		inp = createInput();
		inp.position(0,i*rectH);
		inp.size(offset,rectH);
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
	}
	answerTabbutton = createButton(tabString);
  	answerTabbutton.position(rectW*columns + 105, 25);
  	answerTabbutton.mousePressed(switchTab);
}
function draw()
{
	clear();
	checkKeys();
	if(img){image(img, offset, 0, rectW*columns, rectH*rows);}
	for (var r = 0; r < rows; r++)
	{

		for(var c = 0; c < columns; c++)
		{
			boxes[c][r].show();
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
		window.location.href = 'answerTab.html';
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
			var b = boxes[c][r];
			if(mouseX <= b.x + rectW && mouseX >= b.x)
			{
				if(mouseY <= b.y + rectH && mouseY >= b.y)
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
			if(boxes[0][r].checked && answer.perennial)
			{
				score += 2;
			}
			else if (boxes[1][r].checked && answer.biennial)
			{
				score += 2;
			}
			else if (boxes[2][r].checked && answer.annual)
			{
				score += 2;
			}
			//Growth season section
			if(boxes[3][r].checked && answer.cool)
			{
				score += 2;
			}
			else if (boxes[4][r].checked && answer.warm)
			{
				score += 2;
			}
			//origin
			if(boxes[5][r].checked && !boxes[7][r].checked &&answer.native && !answer.invader)
			{
				score += 2;
			}
			else if (boxes[5][r].checked && boxes[7][r].checked && answer.native && answer.invader)
			{
				score += 2;
			}
			else if (boxes[6][r].checked && boxes[7][r].checked && answer.introduced && answer.invader)
			{
				score += 2;
			}
			//prairie Grouse food
			if (boxes[8][r].checked && answer.grouseFoodDe)
			{
				score += 2;
			}
			else if (boxes[9][r].checked && answer.grouseFoodUn)
			{
				score += 2;
			}
			//prairie grouse cover
			if (boxes[10][r].checked && answer.grouseCoverDe)
			{
				score += 2;
			}
			else if (boxes[11][r].checked && answer.grouseCoverUn)
			{
				score += 2;
			}
			//cattle food
			if (boxes[12][r].checked && answer.cattleFoodDe)
			{
				score += 2;
			}
			else if (boxes[13][r].checked && answer.cattleFoodUn)
			{
				score += 2;
			}
		}
	}
	console.log(score);
}
function saveAnswers()
{
	for(var r = 0; r < rows; r++)
	{
		var row = new Array();
		for(var c = 0; c < columns; c++)
		{
			row.push(boxes[c][r].checked);
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
	rawAnswerData = data.val();
	var keys = Object.keys(data.val());
	for(var i =0; i < keys.length; i++)
	{
		answers.push(new entry(keys[i]));
	}
	console.log(answers);
}
function sizeChange(){
	boxes.
	rectW = customH/rows;
	rectH = customW/columns;
	for(var c = 0; c < columns; c++)
	{
		for(var r = 0; r < rows; r++)
		{
			var b = boxes[c][r];
			b.x = c * rectW + offset + 5;
			b.y = r * rectH;
		}
	}
}