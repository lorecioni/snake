$(document).ready(function(e) {
    var height = $(window).height();
	$('body').css('height', height);
});



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
