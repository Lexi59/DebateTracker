//16 columns
//21 rows
rectW = 20;
rectH = 20;
rows = 21
columns = 16
var boxes = new Array();
class box{
	constructor(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.checked = false;
		this.color = "white";
	}
	mousePressed()
	{
		console.log(this.x,this.y);
	};
}
function setup(){
	createCanvas(windowWidth,windowHeight);
	colorMode(RGB);
	background(255,255,255);
	for(var c = 0; c < columns; c++)
	{
		for(var r = 0; r < rows; r++)
		{
			var b = new box(c*rectW,r*rectH,rectW,rectH);
			boxes.push(b);
		}
	}
	answerTabbutton = createButton('Answer Tab');
  	answerTabbutton.position(rectW*columns + 100, 25);
  	answerTabbutton.mousePressed(switchToAnswerTab);
  	Imagebutton = createButton('Browse for Image');
  	Imagebutton.position(rectW*columns + 100, 50);
  	Imagebutton.mousePressed(selectImage);
}
function draw(){
	strokeWeight(2);
	stroke("black");
	for(var i = 0; i < boxes.length; i++)
	{
		var b = boxes[i];
		fill(b.color);
		rect(b.x,b.y,b.w,b.h);
	}
}
function switchToAnswerTab()
{
	window.location.href = 'answerTab.html';
}
function selectImage()
{

}
function mousePressed(){
	for (var i = 0; i < boxes.length; i++)
	{
		var b = boxes[i];
		if(mouseX < b.x + rectW && mouseX > b.x)
		{
			if(mouseY < b.y + rectH && mouseY > b.y)
			{
				if (b.color == "red")
				{
					b.color = "white";
				}
				else
				{
					b.color = "red";
				}
				break;
			}
		}
	}

}