var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var rect = canvas.getBoundingClientRect();

//Setting canvas resolution
setCanvasDPI(canvas, 300);

var Game = {
	Paused: true,
	New: false,
	FPS: Settings.FPS,
	Direction: 1, //Directions: 1 : 'right', 2 : 'left', 3 : 'up', 4 : 'down'
	Score: 0,
	Snake: [],
	Food: {},
	Loop: 0,
	PreviousScoreTime: new Date().getTime(),
	Init: function(){
		Game.Direction = 1;
		Game.Score = 0;
		Game.CreateFood();
		Game.CreateSnake();
		$('#score-num').text(Game.Score.toString());	
	},
	
	Tick: function(){
		Game.Update();
		Game.Draw();
	},
	
	Draw: function(){
		Game.MoveSnake();
		Game.DrawSnake();
		Game.DrawFood();
	},
	
	Update: function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	},
	
	Play: function(){
		if(Game.New){
			Game.Init();
		}
		$('#canvas-overlay').fadeOut('fast');
		Game.Loop = setInterval(Game.Tick, 1000/Game.FPS);	
		Game.Paused = false;
		Game.New = false;
	},
	
	Pause: function(){
		clearInterval(Game.Loop);
		$('#canvas-overlay').fadeIn('fast');
		$('#overlay-text').text('Paused');
		Game.Paused = true;
	},
	
	CreateSnake: function(){
		Game.Snake = [];
		for(var i = Settings.SnakeLenght - 1; i >= 0; i--) {
			Game.Snake.push({x: i + Settings.InitialPosition.x, y: Settings.InitialPosition.y});
		}
		Game.DrawSnake();
	},
	
	DrawSnake: function(){
		for(var i = 0; i < Game.Snake.length; i++){
			var c = Game.Snake[i];
			Game.DrawPoint(c.x, c.y);
		}
	},
	
	DrawFood: function(){
		Game.DrawCircle(Game.Food.x, Game.Food.y);
	},
	
	CreateFood: function(){
		var cw = Settings.BlockSize;
		Game.Food = {
			x: Math.round(Math.random()*(width - cw)/cw), 
			y: Math.round(Math.random()*(height - cw)/cw), 
		};
		Game.DrawCircle(Game.Food.x, Game.Food.y);
	},
	
	MoveSnake: function(){
		var cw = Settings.BlockSize;
		var headx = Game.Snake[0].x;
		var heady = Game.Snake[0].y;
		
		var d = Game.Direction;
		
		if(d == 1) headx++;
		else if(d == 2) headx--;
		else if(d == 3) heady--;
		else if(d == 4) heady++;
		
		if(Game.CheckCollision(headx, heady)){
			Game.Lose();
			return;
		}
		
		//If Snake's head is in the Food position, Snake eats it and grow
		//Create tail and put it on first position of Snake
		if(headx == Game.Food.x && heady == Game.Food.y){
			var tail = {x: headx, y: heady};
			Game.AddScore();
			//Create new food
			Game.CreateFood();
		} else {
			var tail = Game.Snake.pop();
			tail.x = headx; 
			tail.y = heady;
		}
		
		//Puts back the tail as the first cell
		Game.Snake.unshift(tail); 

	},
	
	CheckCollision: function (x, y) {
		var cw = Settings.BlockSize;
		if(x == -1 || x >= width/cw 
			|| y == -1 || y >= height/cw){
			//Checks Snake's collisions on border
			return true;
		}
		//Checks Snake's collisions itself 
		for(var i = 0; i < Game.Snake.length; i++){
			if(Game.Snake[i].x == x && Game.Snake[i].y == y)
			 return true;
		}
		return false;
	},
	
	DrawPoint: function(x, y) {
		var cw = Settings.BlockSize;
		ctx.fillStyle = Settings.BlockColor;
		ctx.shadowBlur = 5;
		ctx.shadowOffsetX = 3;  
		ctx.shadowOffsetY = 3;  
		ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
		ctx.roundRect(x * cw, y * cw, cw - 1, cw - 1, 3).fill();
	},
	
	DrawCircle: function(x, y){
		var cw = Settings.BlockSize;
		ctx.fillStyle = Settings.FoodColor;
		ctx.beginPath();
		ctx.arc(x * cw + Settings.BlockSize/2, y * cw + Settings.BlockSize/2, Settings.BlockSize/2, 0, 2 * Math.PI);
		ctx.fill();
	},
	
	AddScore: function(){
		if(Settings.ScoreBasedOnTime){
			var time = new Date().getTime() - Game.PreviousScoreTime;
		} else {
			Game.Score += Settings.ScoreValue;
		}
		$('#score-num').text(Game.Score.toString());		
	},
	
	Lose: function(){
		clearInterval(Game.Loop);
		$('#canvas-overlay').fadeIn('fast');
		$('#overlay-text').text('Try Again!');
		Game.Paused = true;
		Game.New = true;
	}
};

Game.Init();

$(document).on('click', '#overlay-text', function(){
	var action = $(this).data('action');
	if (action == 'play'){
		Game.Play();
	}
});

$(document).on('keydown', function(e){
	var e = e || window.event;
	var c = e.keyCode;
	var d = Game.Direction;
	//Arrow keys
	if(c == 37 && d != 1) { Game.Direction = 2; }
	else if(c == 38 && d != 4) { Game.Direction = 3; }
	else if(c == 39 && d != 2) { Game.Direction = 1; }
	else if(c == 40 && d != 3) { Game.Direction = 4; }
	else if(c == 13) {
		//Press Enter
		if(Game.Paused){
			Game.Play();
		}
	} else if(c == 27 || c == 80){
		//Press Esc or 'p'
		if(!Game.Paused){
			Game.Pause();	
		}
	}
});
