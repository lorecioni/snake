$(document).ready(function(e) {
    var height = $(window).height();
	$('body').css('height', height);
	$('#loader').css('height', height);

	$(window).resize(function(){
		var height = $(window).height();
		$('body').css('height', height);
		$('#loader').css('height', height);
		if(Game != undefined){
			//Game.UpdateDimensions($('#canvas-container').width(), $('#canvas-container').height());
		}
		
	});
	
	$('#speed-fader').change(function(){
		Settings.FPS = $(this).val();
	});
	
	loadRanking();
});


function loadRanking(){	
	$.ajax({
			url: Settings.GetRankingUrl,
			type: 'GET',
			dataType: 'json',
			crossDomain:true,
			success: function(data){
				console.log('Ranking retrieved!');
				$('#standings-loader').hide();
				for(var rank in data){
					var li = $('<li></li>');
					var position = $('<span></span>')
						.addClass('position')
						.text(data[rank].position);
					var name = $('<span></span>')
						.addClass('name')
						.text(data[rank].name);
					var score = $('<span></span>')
						.addClass('score')
						.text(data[rank].score);
					li.append(position).append(name).append(score);
					$('#standing-list').append(li);	
				}
			}
		});	
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y,   x + w, y + h, r);
  this.arcTo(x + w, y + h, x,   y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x+w, y, r);
  this.closePath();
  return this;
}

function setCanvasDPI(canvas, dpi) {
    // Set up CSS size if it's not set up already
    if (!canvas.style.width)
        canvas.style.width = canvas.width + 'px';
    if (!canvas.style.height)
        canvas.style.height = canvas.height + 'px';

    var scaleFactor = dpi / 96;
    canvas.width = Math.ceil(canvas.width * scaleFactor);
    canvas.height = Math.ceil(canvas.height * scaleFactor);
    var ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
}
