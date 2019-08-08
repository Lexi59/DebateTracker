//16 columns
//21 rows
rectW = 20;
rectH = 20;
rows = 20;
columns = 15;
let img, answerRef, submissionRef, rawAnswerData;
var boxes = new Array();
var answers = new Array();
class box{
	constructor(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.checked = false;
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
     answerRef.on('value',updateAnswers);
     //END FIREBASE
	createCanvas(windowWidth,windowHeight);
	colorMode(RGB);
	var fileInput = createFileInput(selectImage);
	fileInput.position(rectW * columns + 100, 50);
	background(255,255,255);
	for(var c = 0; c < columns; c++)
	{
		var row = new Array();
		for(var r = 0; r < rows; r++)
		{
			var b = new box(c*rectW,r*rectH,rectW,rectH);
			row.push(b);
		}
		boxes.push(row);
	}
	var tabString = "Answer Tab"
	if (findTab() == "Answer")
	{
		tabString = "Submission Tab"
		saveButton = createButton("Save");
		saveButton.position(rectW*columns+100,75);
		saveButton.mousePressed(saveAnswers);
	}
	else
	{
		scoreButton = createButton("Score");
		scoreButton.position(rectW*columns + 100, 75);
		scoreButton.mousePressed(calculateScore);
	}
	answerTabbutton = createButton(tabString);
  	answerTabbutton.position(rectW*columns + 100, 25);
  	answerTabbutton.mousePressed(switchTab);
}
function draw(){
	strokeWeight(2);
	stroke("black");
	if (img) 
	{
    	image(img, 0, 0, rectW*columns, rectH*rows);
  	}
	for(var r = 0; r < rows; r++)
	{
		for(var c = 0; c < columns; c++)
		{
			var b = boxes[c][r];
			if(b.checked)
			{
				fill("red");
			}
			else
			{
				noFill();
			}
			rect(b.x,b.y,b.w,b.h);			
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
    	img = null;
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
		if (boxes[0][r].checked)
		{
			score += 8;
			//Life Span section
			if(boxes[1][r].checked && answer.perennial)
			{
				score += 2;
			}
			else if (boxes[2][r].checked && answer.biennial)
			{
				score += 2;
			}
			else if (boxes[3][r].checked && answer.annual)
			{
				score += 2;
			}
			//Growth season section
			if(boxes[4][r].checked && answer.cool)
			{
				score += 2;
			}
			else if (boxes[5][r].checked && answer.warm)
			{
				score += 2;
			}
			//origin
			if(boxes[6][r].checked && !boxes[8][r].checked &&answer.native && !answer.invader)
			{
				score += 2;
			}
			else if (boxes[6][r].checked && boxes[8][r].checked && answer.native && answer.invader)
			{
				score += 2;
			}
			else if (boxes[7][r].checked && boxes[8][r].checked && answer.introduced && answer.invader)
			{
				score += 2;
			}
			//prairie Grouse food
			if (boxes[9][r].checked && answer.grouseFoodDe)
			{
				score += 2;
			}
			else if (boxes[10][r].checked && answer.grouseFoodUn)
			{
				score += 2;
			}
			//prairie grouse cover
			if (boxes[11][r].checked && answer.grouseCoverDe)
			{
				score += 2;
			}
			else if (boxes[12][r].checked && answer.grouseCoverUn)
			{
				score += 2;
			}
			//cattle food
			if (boxes[13][r].checked && answer.cattleFoodDe)
			{
				score += 2;
			}
			else if (boxes[14][r].checked && answer.cattleFoodUn)
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
			plantNum: row[0],
			perennial: row[1],
			biennial: row[2],
			annual: row[3],
			cool: row[4],
			warm: row[5],
			native: row[6],
			introduced: row[7],
			invader: row[8],
			grouseFoodDe: row[9],
			grouseFoodUn: row[10],
			grouseCoverDe: row[11],
			grouseCoverUn: row[12],
			cattleFoodDe: row[13],
			cattleFoodUn: row[14]
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