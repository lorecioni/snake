var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var rect = canvas.getBoundingClientRect();

//Setting canvas resolution
setCanvasDPI(canvas, 300);

var img = new Image();
img.src = "img/fragola.png";	

var Game = {
	
	//Games variables
	Paused: true,
	New: false,
	Direction: 1, //Directions: 1 : 'right', 2 : 'left', 3 : 'up', 4 : 'down'
	Score: 0,
	Snake: [],
	Food: {},
	Bonus: {},
	Loop: 0,
	Fruits: [],
	PreviousScoreTime: new Date().getTime(),
	
	//Games methods
	Init: function(){
		Game.Direction = 1;
		Game.Score = 0;
		Game.CreateFood();
		Game.CreateSnake();
		Game.Bonus = {};
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
		Game.DrawFruit();
	},
	
	Update: function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	},
	
	Play: function(){
		if(Game.New){
			Game.Init();
		}
		$('#canvas-overlay').fadeOut('fast');
		$('#save').hide();
		Game.Loop = setInterval(Game.Tick, 1000/Settings.FPS);	
		Game.Paused = false;
		Game.New = false;
		$("#speed-fader").prop('disabled', true);
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
		var correct = false;
				
		while(!correct){
			Game.Food = {
				x: Math.round(Math.random()*(width - cw)/cw), 
				y: Math.round(Math.random()*(height - cw)/cw), 
			};
			correct = true;
			for(var i = 0; i < Game.Snake.length; i++){
				var c = Game.Snake[i];
				if(c.x == Game.Food.x && c.y == Game.Food.y){
					correct = false;
				}
			}
		}
		
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
		
		//Create tail and put it on first position of Snake
		if(headx == Game.Food.x && heady == Game.Food.y){
			var tail = {x: headx, y: heady};
			Game.AddScore(Settings.ScoreValue + Math.round(Settings.FPS * 0.3));
			//Create new food
			Game.CreateFood();
			Game.AddBonus();
		} else if(headx == Game.Bonus.x && heady == Game.Bonus.y){
			Game.AddScore(Game.Bonus.value);
			Game.Bonus = {};
			var tail = Game.Snake.pop();
			tail.x = headx; 
			tail.y = heady;
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
	
	AddScore: function(value){
		Game.Score += value;
		$('#score-num').text(Game.Score.toString());	
		var msg = $('<div></div>')
			.addClass('bonus-text')
			.text('+' + value)
			.show();
		$('#game-container').append(msg);
		setTimeout(function() {
			msg.addClass('big').fadeOut(500, function(){
				$(this).removeClass('big');
			});
		}, 100);
		
	},
	
	Lose: function(){
		clearInterval(Game.Loop);
		$('#canvas-overlay').fadeIn('fast');
		$('#overlay-text').text('Try Again!');
		Game.Paused = true;
		Game.New = true;
		$("#speed-fader").prop('disabled', false);
		$('#save').show();
	},
	
	AddBonus: function(){
		var percent = Math.random();
		if(percent > Settings.FruitPercentage && !Game.Bonus.active){
			//Adding bonus		
			var cw = Settings.BlockSize;
			var correct = false;
					
			while(!correct){
				Game.Bonus = {
					x: Math.round(Math.random()*(width - cw)/cw), 
					y: Math.round(Math.random()*(height - cw)/cw),
					active: true 
				};
				correct = true;
				for(var i = 0; i < Game.Snake.length; i++){
					var c = Game.Snake[i];
					if(c.x == Game.Bonus.x && c.y == Game.Bonus.y){
						correct = false;
					}
				}
			}
			
			var fruit = Game.Fruits[Math.floor(Math.random()*Game.Fruits.length)];
			Game.Bonus.img = fruit.img;
			Game.Bonus.value = fruit.value;
			Game.DrawFruit();
			setTimeout(function() { 
				//Remove fruit
				Game.Bonus = {};
			}, Settings.FruitDuration * 1000);
		}
		
	},
	
	DrawFruit: function(){
		if(Game.Bonus.active){
			var cw = Settings.BlockSize;
			ctx.drawImage(Game.Bonus.img, Game.Bonus.x * cw - 5, Game.Bonus.y * cw - 5, 
				Settings.BlockSize + 10, Settings.BlockSize + 10);
		}
	},

	UpdateDimensions: function(w, h){
		width = w;
		height = h;
		canvas.width = w;
		canvas.height = h;
	}
		

};

Game.Init();

$(document).on('click', '#overlay-text', function(){
	var action = $(this).data('action');
	if (action == 'play'){
		Game.Play();
	}
});

$(document).on('click', '#save', function(){
	$('#save-score-box').fadeIn('fast');
});

$(document).on('click', '#save-button', function(){
	var name = $('#save-name').val();
	if(name.length > 0 && name != ''){
		var score = Game.Score;
		$.ajax({
			url: Settings.InsertScoreUrl + '?name=' + name +'&score=' + score,
			type: 'GET',
			dataType: 'html',
			crossDomain:true,
			success: function(data){
				console.log('Score added correctly!');	
			}
		});
		$('#save-score-box').fadeOut('fast');
		$('#save').fadeOut('fast');
	}
});

$(document).on('click', '#cancel-button', function(){
	$('#save-score-box').fadeOut('fast');
});

$(document).on('keydown', function(e){
	var e = e || window.event;
	var c = e.keyCode;
	var d = Game.Direction;
	//Arrow keys
	//Directions: 1 : 'right', 2 : 'left', 3 : 'up', 4 : 'down'
	if((c == 37 || c == 100)&& d != 1) { Game.Direction = 2; return false;}
	else if((c == 38 || c == 104) && d != 4) { Game.Direction = 3; return false;}
	else if((c == 39 || c == 102)&& d != 2) { Game.Direction = 1; return false;}
	else if((c == 40 || c == 101) && d != 3) { Game.Direction = 4; return false;}
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
