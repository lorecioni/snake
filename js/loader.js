(function () {
	
/*
  // Preloading audio stuff
  var loadMusic = document.getElementById("start"),

*/	

  //Initialize Fastclick library for reducing delays
  FastClick.attach(document.body);
  
  var audios = [	
  ];

  var images = [
    'img/background.jpg',
	'img/yellow.jpg',
	'img/loader.gif'
  ];

  var fruit_images = [
    'img/ciliegia.png', 
	 'img/orange.png', 
	 'img/banana.png',
	 'img/pera.png', 
	 'img/apple.png', 
	 'img/fragola.png'
  ];
  
  var fruit_values = [15, 20, 25, 30, 35, 40];
	
  var size = images.length + fruit_images.length + audios.length;

  var counter = 0, percent = 0;

  var loading = $("#bar");
  var loader = $("#loader");
  var loadText = $("#loading-text");
  
  //Preload audios
  for(var i = 0; i < audios.length; i++) {
    var file = audios[i];

    if (isNaN(file.duration)) { 
      file.addEventListener("loadeddata", function() {
      counter++;
      percent = Math.floor((counter/size*100));
      loading.width(percent + "%");
      loadText.text("Loading... " + percent + "%");
      if(percent >= 100) {
        fadeOutLoader();
       }
     });
   } else {
     counter++;
     percent = Math.floor((counter/size*100));
     loading.width(percent + "%");
     loadText.text("Loading... " + percent + "%");

     if(percent >= 100) {
       fadeOutLoader();
      }
    }
  }
  
  //Preload images
  for(var k = 0; k < images.length; k++) {
    img = new Image();
	 img.src = fruit_images[k];
    img.onload = function() {
		  counter++;
		  percent = Math.floor(((counter)/size*100));
		  loading.width(percent + "%");
		  loadText.text("Loading... " + percent + "%");
		  
		  if(percent >= 100) {
			fadeOutLoader();
		  }
	  };
  }
  
  //Preload fruit images
  for(var j = 0; j < fruit_images.length; j++) {
    img = new Image();
    img.src = fruit_images[j];
    Game.Fruits.push({img: img, value: fruit_values[j]});	
    img.onload = function() {
		  counter++;
		  percent = Math.floor(((counter)/size*100));
		  loading.width(percent + "%");
		  loadText.text("Loading... " + percent + "%");
		  
		  if(percent >= 100) {
			fadeOutLoader();
		  }
	  };
  }
  
  
  function fadeOutLoader(){
	  console.log('Preloading complete!');
	  $('#container').show();
	  loader.fadeOut();
  }
}());

