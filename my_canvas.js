var my_canvas = {
	init: function(){
		var my_line = new Canvas.Palette.Line(100, 100, 100, 0);
		my_line.stroke.width = 10;
		my_line.stroke.color = "green";
		my_line.alpha = 80;
		this.drawing.add("my_line", my_line);
		
		// var my_grad = new Canvas.Palette.Gradient(-50, -25, 50, 25);
		var my_grad = new Canvas.Palette.Radial(50);
		my_grad.addStop(0, "green");
		my_grad.addStop(1, "blue");
		// var my_grad = new Canvas.Palette.Pattern("http://www.irishtimes.com/homepage/images/commercialfeatures/1224243151612.jpg?ts=1237547084");
		
		var my_rect = new Canvas.Palette.Rectangle(200, 200, 100, 50);
		my_rect.stroke.width = 10;
		my_rect.stroke.color = "black";
		my_rect.origin.x = -50;
		my_rect.origin.y = -25;
		my_rect.fill = my_grad;
		my_rect.stroke.join = "round";
		
		this.drawing.add("my_rect", my_rect);
		
		
		/*
		var my_arc = new Canvas.Palette.Quadratic(50, 150, 150, 150, 200, 10);
		my_arc.stroke.cap = "butt";
		my_arc.stroke.width = 10;
		my_arc.stroke.color = "pink";
		my_arc.origin.x = 0;
		my_arc.origin.y = 0;
		// my_arc.fill = my_grad;
		
		this.drawing.add("my_circle", my_arc);
		*/
		// var my_img = new Canvas.Palette.Image(20, 20, "http://www.irishtimes.com/homepage/images/commercialfeatures/1224243151612.jpg?ts=1237547084");
		// my_img.origin.x = +50;
		// my_img.origin.y = +50;
		// this.drawing.add("my_img", my_img);
		/*
		// var my_bez = new Palette.Bezier();
		// this.drawing.add("line1", my_line);
		// this.drawing.add("rect1", my_rect);
		// this.drawing.add("oval1", my_oval);
		*/
		
		// var my_video = new Canvas.Palette.Video(0, 0, "http://podcast.louisville.edu/filedata/0a/fb/39ed4e0f6d1001634db1172a7cd7_sample_300kbit.mov");
		//var my_video = new Canvas.Palette.Video(0, 0, "http://upload.wikimedia.org/wikipedia/commons/9/9b/1993-06-08-Jeep-Safari-bei-Moab-%28Utah%29.ogg");
		//my_video.clip.x = 250;
		//my_video.clip.y = 250;
		// this.drawing.add("my_video", my_video);

		
		// var my_audio = new Canvas.Palette.Audio("http://www.rdrop.com/~mulara/drone.wav");
		// this.drawing.add("my_audio", my_audio);

		
		var my_text = new Canvas.Palette.Text(100, 100, "Hello World2!");
		my_text.shadow.color = "black";
		my_text.baseline = "middle";
		my_text.align = "center";
		my_text.yscale = 250;
		
		this.drawing.add("my_text", my_text);
		
		this.drawing.draw();
		
		this.drawing.animation.callback = this.callback;
	},

	callback : function(){
		document.getElementById("tb").value = my_canvas.drawing.scene["my_line"].y1;
		my_canvas.drawing.scene["my_line"].rotation += 2;
	}
};

my_canvas.oliver_doT = function(){
	// alert("doing");
	  Canvas.Tweener.doTween(this.drawing.scene["my_line"], {
	      transition: 'linear',
		  onComplete: function() { },
	      y1: 350,
	      y2: 250
	  });
	};