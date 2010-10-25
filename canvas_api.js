/*
 * Canvas API: a JavaScript API for working with the HTML 5 canvas tag.
 *
 * Copyright © 2010 Oliver Moran <oliver.moran@N0!spam@gmail.com>
 * Contributors: Yuichi Tateno, John Resig
 *
 */

/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */

/**
 * Contains the source code of the Canvas API. 
 * @file canvas_api.js
 */

/**
 * Canvas API
 * @project Canvas API
 * @description A JavaScript API for working with the HTML 5 canvas tag.
 * @author Oliver Moran
 * @version 0.2
 * @timestamp
 */

/**
 * The static Canvas class.
 * @class {public static} Canvas
 * @author Oliver Moran
 * @since 0.2
 */
var Canvas = {
	/**
	 * Drawing objects available for drawing.
	 * @object {static} Canvas.drawings
	 * @author Oliver Moran
	 * @since 0.2
	 */
	Drawings: new Object(),
	/**
	 * Called when the DOM is ready. Creates new Drawing objects for each canvas tag and calls the init function in an object of the same name as the tag's ID.
	 * @function {public static void} Canvas.init
	 * @return Nothing
	 * @author Oliver Moran
	 * @since 0.2
	 */
	init: function(){
		if (!document.getElementsByTagName) return false; // not HTML 5
		
		// get the array of canvas tags
		var canvasElements = document.getElementsByTagName('canvas');
		
		// loop through the canvas tags
		for (var i=0; i<canvasElements.length; i++)
			// if it has an ID and an object with the same name as that ID exists...
			if (canvasElements[i] != undefined && typeof eval(canvasElements[i].id).init == "function"){
				// create a new drawing with that name
				Canvas.Drawings[canvasElements[i].id] = new Canvas.Drawing(canvasElements[i]);
				// create a reference to that drawing in the object of the same name
				eval(canvasElements[i].id).drawing = Canvas.Drawings[canvasElements[i].id];
				// call the init function in that drawing
				eval(canvasElements[i].id).init();
				// draw it (there may be a delay between now and the start of animation)
				eval(canvasElements[i].id).drawing.draw();
				// auto start the animation
				eval(canvasElements[i].id).drawing.start();
			}
	},
	
	Utils : {
		/**
		 * Bequeaths the attributes of ancestor onto descendent.
		 * @function {private static void} Canvas.Utils.inherit
		 * @param {Object} descendant The object to bequeath attributes to.
		 * @param {Object} ancestor The object to inherit attributes from.
		 * @return Nothing
		 * @author Oliver Moran
		 * @since 0.2
		 */
		inherit : function(descendant, ancestor){
			for (var prop in ancestor) {
				if (typeof ancestor[prop] == "object") {
					descendant[prop] = new Object();
					Canvas.Utils.inherit(descendant[prop], ancestor[prop]);
				}
				descendant[prop] = ancestor[prop];
			}
		},
		/**
		 * Creates a new array from an existing one, pushes a new element onto it and returns the new array.
		 * @function {private static void} Canvas.Utils.inherit
		 * @param {Array} array The array to copy.
		 * @param {Object} item The item to be pushed onto the copy.
		 * @return A new array.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		pushArray : function(array, item){
			var copy = new Array();
			for (var i=0; i<array.length; i++){
				copy.push(array[i]);
			}
			copy.push(item);
			return copy;
		}
	}
};


/**
 * Creates an instance of a Drawing and inserts a canvas tag onto the web page.
 * @constructor {public} Canvas.Drawing
 * @param {HTMLDOMElement} canvas A reference to the HTML DOM element for the canvas.
 * @return Nothing
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Drawing = function(canvas){
	
	// CANVAS TAG PROPERTIES
	
	/**
	 * A reference to the HTML canvas element for the drawing.
	 * @property {read HTMLDOMElement} Drawing.canvas
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.canvas = canvas;
	/**
	 * The 2D rendering context of the drawing.
	 * @property {read CanvasRenderingContext2D} Drawing.context
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.context = canvas.getContext('2d');
	/**
	 * A reference to the JavaScript object that controls the drawing.
	 * @property {read Object} Drawing.object
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.object = eval(this.canvas.id);
	
	// MOUSE EVENTS
	
	/**
	 * The x coordinate of the position in pixels relative to the Drawing.
	 * @property {read Number} Drawing.mousex
	 * @see Drawing.mousey
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.mousex = undefined;
	/**
	 * The y coordinate of the position in pixels relative to the Drawing.
	 * @property {read Number} Drawing.mousey
	 * @see Drawing.mousex
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.mousey = undefined;

	this.context.canvas.onmouseup = function(){
		// mouse up events
	};
	this.context.canvas.onmousedown = function(){
		// mouse down events
	};
	this.context.canvas.onmousemove = function(){
		// move over events
		// mouse out events
		// update local mouse coords
	};

	// ANIMATION
	
	/**
	 * The frame rate in fames per second of animations.
	 * @property {read write Number} Drawing.framerate
	 * @see Drawing.start
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.framerate = 12;
	/**
	 * A function called immediately before the drawing is drawn.
	 * @function {public void} Drawing.onBeforeDraw
	 * @param {Object} _this A reference to the Canvas.drawing object because this is lost though the onTimeOut function
	 * @see Drawing.onDraw
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.onBeforeDraw = function(_this){};
	/**
	 * A function called immediately after the drawing is drawn.
	 * @function {public void} Drawing.onDraw
	 * @param {Object} _this A reference to the Canvas.drawing object because this is lost though the onTimeOut function
	 * @return Nothing
	 * @see Drawing.onBeforeDraw
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.onDraw = function(_this){};
	/**
	 * Starts animation (calls draw at regular intervals). Called by default when intialising a drawing object.
	 * @function {public static void} Drawing.start
	 * @return Nothing
	 * @see Drawing.framerate
	 * @see Drawing.stop
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.start = function(){
		this.stop();
		var self = this;
		this.interval = setInterval(function(){
				if (!self.skipFrame) self.draw();
			}, 1000/this.framerate);
	};
	/**
	 * Stops animation.
	 * @function {public void} Drawing.stop
	 * @return Nothing
	 * @see Drawing.start
	 * @return Nothing
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stop = function(){
		clearInterval(this.interval);
	};
	

	// MANAGE THE SCENE
	
	this.scene = {}; // an object that holds the "scene"
	
	/**
	 * Adds a Palette object to the Drawing.
	 * @function {public void} Drawing.add
	 * @param {String} name An instance name for the object
	 * @param {Object} obj The object to be added
	 * @param {optional Boolean} copy Whether to (deep) copy of the object. Defaults to false, which adds a shallow copy of the object is added to the drawing.
	 * @return Nothing
	 * @see Drawing.remove
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.add = function(name, obj, copy){
		if (copy) this.scene[name] = obj.copy();
		else this.scene[name] = obj;
	};
	
	/**
	 * Removes a Palette object from the Drawing.
	 * @function {public void} Drawing.remove
	 * @return Nothing
	 * @see Drawing.add
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.remove = function(name){
		delete this.scene[name];
	};
	
	/**
	 * Determines if the drawing is ready to be rendered (i.e. if the necessary images, etc. have been downloaded)
	 * @function {public Boolean} Drawing.ready
	 * @return true if the drawing is ready to be rendered otherwise false.
	 * @see Drawing.remove
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.ready = function(){
		var c = 0;
		for (var obj in this.scene){
			for (var prop in this.scene[obj]){
				try {
					// Opera throws exceptions around instanceof, we we dance around it
					if (this.scene[obj].audio != undefined && !this.scene[obj].audio.complete)
						c++; // audio
					else if (this.scene[obj].video != undefined && !this.scene[obj].video.complete)
						c++; // audio
					else if (this.scene[obj].image != undefined && !this.scene[obj].image.complete)
						c++; // images
					else if (this.scene[obj][prop].image && !this.scene[obj][prop].image.complete)
						c++; // fills
				} catch(err){
					// An exception may be throw owing to properties appearing and disappearing asynchronously.
					// If an exception is thrown, it can normally be safely be ignored but causes the method to reurn false.
					c++;
				}
			}
		}
		
		return (c == 0);
	};
	
	
	/**
	 * A method to bubble sort the objects in the scene by layer.
	 * @function {private static void} Canvas.sceneByLayer
	 * @param {Array} array The object to bequeath attributes to.
	 * @return An array containing the objects in the scene.
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.sceneByLayer = function() {
		var array = new Array();
		for (var obj in this.scene)
			array.push(this.scene[obj]);
		
		for(var i = 0; i < array.length; i++) {
			for(var j = 0; j < (array.length-1); j++) {
				if(array[j].layer > array[j+1].layer) {
					var tmp = array[j+1];
					array[j+1] = array[j];
					array[j] = tmp;
				}
			}
		}
		return array;
	};
	
	/**
	 * Paints the Drawing. If the drawing is not ready to be painted, the method will retry at a rate of once every 1 miliseconds.
	 * @function {public void} Drawing.draw
	 * @return Nothing
	 * @see Drawing.animation.start
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.skipFrame = false; // basic frame skipping
	this.draw = function(){
		if (!this.ready()){
			this.skipFrame = true;
			// if images are not loaded then set a timeout that continually checks that they have
			var self = this;
			setTimeout(function(){
					self.draw();
				}, 1);
			return;
		}
		this.skipFrame = false;
		
		this.onBeforeDraw();

		var draw_start_time = new Date();
		
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		var layers = this.sceneByLayer();
		for (var i in layers) if (layers[i]) layers[i].draw([this], this.context);
		
		var draw_end_time = new Date();
		
		if (this.object.debug === true){
			this.debug.addRenderTime(draw_end_time.getTime()-draw_start_time.getTime());
			this.debug.show(this);
		}
		
		this.onDraw();
	};
	
	// DEBUG
	
	this.debug = {};
	this.debug.renderTimes = new Array();
	this.debug.addRenderTime = function(time){
		this.renderTimes.push(time);
		if (this.renderTimes.length > 100) this.renderTimes.shift();
	};
	this.debug.calculateAverageRenderTime = function(){
		var total = 0;
		for (var time in this.renderTimes) total += this.renderTimes[time];
		return (total/this.renderTimes.length).toFixed(2);
	};
	this.debug.show = function(_this){
		var debug_rect = new Canvas.Palette.Rectangle(0, _this.canvas.height-15, _this.canvas.width, 15);
		debug_rect.stroke.color = "transparent";
		debug_rect.fill = "lightGrey";
		debug_rect.draw([this], _this.context);
		
		var debug_text = new Canvas.Palette.Text(3, _this.canvas.height-14, "Render time: " + _this.debug.renderTimes[_this.debug.renderTimes.length-1] + "ms (avg.: "+_this.debug.calculateAverageRenderTime()+"ms)");
		debug_text.font = "10px 'Courier', monospace";
		if (_this.debug.renderTimes[_this.debug.renderTimes.length-1] > 1000/_this.framerate) debug_text.fill = "red";
		debug_text.draw([this], _this.context);
		
		var debug_line = new Canvas.Palette.Line(0, _this.canvas.height-15, _this.canvas.width, _this.canvas.height-15);
		debug_line.stroke.color = "grey";
		debug_line.stroke.width = 1;
		debug_line.draw([this], _this.context);
	};
};


/**
 * The static Library class where images and other media are stored.
 * @object {static} Canvas.Library
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Library = {};
/**
 * The array of images in the Canvas API library.
 * @property {Array} Library.images
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Library.images = new Array();
/**
 * Adds an image to the Canvas API library.
 * @function {public static void} Library.addImage
 * @param {String} src The URL of an image file.
 * @return A reference to the image in the library.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Library.addImage = function(src){
	var image = new Image();
	image.onload = function(){
		// loaded
	};
	// image.onerror
	// image.onabort
	image.src = src;
	
	Canvas.Library.images.push(image);
	return Canvas.Library.images[Canvas.Library.images.length-1];
};
/**
 * The array of audio files in the Canvas API library.
 * @property {Array} Library.audio
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Library.audio = new Array();
/**
 * Adds an audio file to the Canvas API library.
 * @function {public static void} Library.addAudio
 * @param {String} src The URL of an audio file.
 * @return A reference to the audio file in the library.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Library.addAudio = function(src){
	var audio = new Audio();
	// audio.onerror
	// audio.onabort
	audio.src = src;
	audio.load();
	var checkIfLoaded = function(){
		if (isNaN(audio.duration))
			setTimeout(function(){
					checkIfLoaded();
				}, 10);
		else {
			// loaded
			audio.complete = true;
		}
	};
	checkIfLoaded();

	Canvas.Library.audio.push(audio);
	return Canvas.Library.audio[Canvas.Library.audio.length-1];
};
/**
 * The array of video files in the Canvas API library.
 * @property {Array} Library.video
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Library.videos = new Array();
/**
 * Adds a video file to the Canvas API library.
 * @function {public static void} Library.addVideo
 * @param {String} src The URL of a video file.
 * @return A reference to the video file in the library.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Library.addVideo = function(src){
	var video = document.createElement("video");
	video.setAttribute("src", src);
	video.setAttribute("preload", "preload");
	video.setAttribute("controls", "controls");
	video.setAttribute("hidden", "hidden");
	video.setAttribute("style", "display:none;");
	document.body.appendChild(video);
	// video.onerror
	// video.onabort
	var checkIfLoaded = function(){
		if (isNaN(video.duration) || video.duration==0)
			setTimeout(function(){
					checkIfLoaded();
				}, 10);
		else {
			// loaded
			video.complete = true;
		}
	};
	checkIfLoaded();

	Canvas.Library.videos.push(video);
	return Canvas.Library.videos[Canvas.Library.videos.length-1];
};







/**
 * The static Palette class, which contains the range of drawing objects available in the Canvas API.
 * @class {static} Canvas.Palette
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette = {};

/**
 * The prototypical Palette Object. All Palette Objects (except Gradients) inherit these values, although some properties are reduntant for certain objects.
 * @constructor {public} Palette.Object
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Object = function(){
	// DEFAULT STYLES FOR PALETTE OBJECTS
	
	/**
	 * The stroke style Pallet objects.
	 * @object {static} Palette.Object.stroke
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke = new Object();
	/**
	 * The stroke colour to be used for new Pallet objects. A CSS colour name, a hex value or a gradient.
	 * @property {read write String} Palette.Object.stroke.color
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke.color = "black";
	/**
	 * The stroke width in pixels to be used for new Pallet objects.
	 * @property {read write Number} Palette.Object.stroke.width
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke.width = 3;
	/**
	 * The stroke cap to be used for new Pallet objects. Valid values are "butt", "round" or "square".
	 * @property {read write String} Palette.Object.stroke.cap
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke.cap = "butt";
	/**
	 * The way to join strokes used for new Pallet objects. Valid values are "bevel", "round" or "miter".
	 * @property {read write String} Palette.Object.stroke.join
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.stroke.join = "miter";
	/**
	 * The fill colour to be used for new Pallet objects. Either a CSS colour name, a hex colour value or a gradient.
	 * @property {read write String} Palette.Object.fill
	 * @seePalette.Gradient
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.fill = "white";
	/**
	 * Whether to closed (true) or leave open (false) new Palette objects.
	 * @property {read write Boolean} Palette.Object.close
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.close = false;
	/**
	 * The rotation of the Palette object in degrees around its origin.
	 * @property {read write Number} Palette.Object.rotation
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.rotation = 0;
	/**
	 * The location of the Palette object's pivot point relative to the object's origin. Rotation of the object happens around this point.
	 * @object {static} Palette.Object.origin
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.pivot = {};
	/**
	 * The x coordinate of the Palette object's pivot relative to the object's origin.
	 * @property {read write Number} Palette.Object.pivot.x
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.pivot.x = 0;
	/**
	 * The y coordinate of the Palette object's pivot point relative to the objects natural origin.
	 * @property {read write Number} Palette.Object.pivot.y
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.pivot.y = 0;
	/**
	 * The shadow to be applied to the Palette object.
	 * @object {static} Palette.Object.shadow
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow = {};
	/**
	 * The x offset of the Palette object's shadow.
	 * @property {read write Number} Palette.Object.shadow.x
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow.color = "transparent";
	/**
	 * The x offset of the Palette object's shadow.
	 * @property {read write Number} Palette.Object.shadow.x
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow.x = 5;
	/**
	 * The y offset of the Palette object's shadow.
	 * @property {read write Number} Palette.Object.shadow.y
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow.y = 5;
	/**
	 * The blur radius of the Palette object's shadow.
	 * @property {read write Number} Palette.Object.shadow.blur
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.shadow.blur = 10;
	/**
	 * The transparancy (alpha) of the Palette object ranging from 0 (fully transparent) to 100 (fully opaque).
	 * @property {read write Number} Palette.Object.alpha
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.alpha = 100;
	/**
	 * The start angle of a Circle object in degrees.
	 * @property {read write Number} Palette.Object.start
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.start = 0;
	/**
	 * The end angle of a Circle object in degrees.
	 * @property {read write Number} Palette.Object.end
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.end = 360;
	/**
	 * Whether a Circle object is drawn clockwise (true) or anti-clockwise (false).
	 * @property {read write Boolean} Palette.Object.clockwise
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.clockwise = true;
	/**
	 * The font used by the Text circle object. Uses a format analogous to the CSS font property.
	 * @property {read write String} Palette.Object.font
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.font = "24px Helvetica,Verdana,Arial,sans-serif";
	/** The alignent of the Text object. Valid values are "start", "end", "left", "right", "center". The default is "start".
	 * The font used by the Text circle object. Uses a format analogous to the CSS font property.
	 * @property {read write String} Palette.Object.align
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.align = "start";
	/** The baseline alignment of a Text object. Valid values are "top", "hanging", "middle", "alphabetic", "ideographic", "bottom". The default is "alphabetic".
	 * The font used by the Text circle object. Uses a format analogous to the CSS font property.
	 * @property {read write String} Palette.Object.baseline
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.baseline = "top";
	/**
	 * The horizontal scaling to be applied to a Pallet object. 100 is original size. 50 is half size. 200 is double size.
	 * @property {read write Number} Palette.Object.xscale
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.xscale = 100;
	/**
	 * The vertical scaling to be applied to a Pallet object. 100 is original size. 50 is half size. 200 is double size.
	 * @property {read write Number} Palette.Object.yscale
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.yscale = 100;
	/**
	 * Clipping to be applied to the source of images and video.
	 * @object {static} Palette.Object.clip
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.clip = {};
	/**
	 * The x coordinate of the top-left corner of the clipping area of an image or video relative to the image or video.
	 * @property {read write Number} Palette.Object.clip.x
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.clip.x = 0;
	/**
	 * The y coordinate of the top-left corner of the clipping area of an image or video relative to the image or video.
	 * @property {read write Number} Palette.Object.clip.y
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.clip.y = 0;
	/**
	 * The width of the clipping area of an image or video.
	 * @property {read write Number} Palette.Object.clip.width
	 * @author Oliver Moran
	 * @since 0.2
	 */
	// this.clip.width = undefined;
	/**
	 * The height of the clipping area of an image or video.
	 * @property {read write Number} Palette.Object.clip.height
	 * @author Oliver Moran
	 * @since 0.2
	 */
	// this.clip.height = undefined;
	/**
	 * A number representing the z-order of layers in which objects are ordered. Objects with higher layer numbers are layerd above objects with lower layer numbers.
	 * @property {read write Number} Palette.Object.layer
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.layer = 0;
	/**
	 * The skew in degrees along the x-axis to be applied to the object.
	 * @property {read write Number} Palette.Object.xskew
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.xskew = 0;
	/**
	 * The skew in degrees along the y-axis to be applied to the object.
	 * @property {read write Number} Palette.Object.yskew
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.yskew = 0;
	/**
	 * The mask object for this object.
	 * @property {read write Canvas.Palette.Mask} Palette.Object.mask
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.mask = {};
	/**
	 * The hitArea object for this object. If properly defined the object will fire click events.
	 * @property {read write Canvas.Palette.Mask} Palette.Object.mask
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.hitArea = {};

	
	// COMMON METHODS
	
	/* A private function that sets the style just before the object is drawn. */
	this.setStyle = function(context){
		/*
		if (this.alpha < 0 || this.alpha > 100 || isNaN(this.alpha) || Math.round(this.alpha) == Infinity) {
			this.alpha = Canvas.Palette.Object.alpha;
		}
		*/
		
		context.lineWidth = this.stroke.width;
		context.lineCap = this.stroke.cap;
		context.lineJoin = this.stroke.join;
		context.shadowOffsetX = this.shadow.x;
		context.shadowOffsetY = this.shadow.y;  
		context.shadowBlur = this.shadow.blur;
		
		context.strokeStyle = this.stroke.color;
		context.shadowColor = this.shadow.color;
		if (this.fill instanceof Canvas.Palette.Gradient || 
			this.fill instanceof Canvas.Palette.Radial || 
			this.fill instanceof Canvas.Palette.Pattern){
				context.fillStyle = this.fill.draw([this], context);
		} else {
			context.fillStyle = this.fill;
		}
		
		if (this instanceof Canvas.Palette.Text){
			context.font = this.font;
			context.textAlign = this.align;
			context.textBaseline = this.baseline;
		}
	};
	
	
	/**
	 * Returns a deep copy of the object.
	 * @function {public void} Palette.Object.copy
	 * @return A deep copy of the object.
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.copy = function(obj){
		var obj2;
		if (obj == null) {
			obj = this;
			// create new object
			if (this instanceof Canvas.Palette.Line) obj2 = new Canvas.Palette.Line();
			else if (this instanceof Canvas.Palette.Polygon) obj2 = new Canvas.Palette.Polygon();
			else if (this instanceof Canvas.Palette.Rectangle) obj2 = new Canvas.Palette.Rectangle();
			else if (this instanceof Canvas.Palette.Circle) { obj2 = new Canvas.Palette.Circle(); }
			else if (this instanceof Canvas.Palette.Arc) obj2 = new Canvas.Palette.Arc();
			else if (this instanceof Canvas.Palette.Bezier) obj2 = new Canvas.Palette.Bezier();
			else if (this instanceof Canvas.Palette.Quadratic) obj2 = new Canvas.Palette.Quadratic();
			else if (this instanceof Canvas.Palette.Image) obj2 = new Canvas.Palette.Image();
			else if (this instanceof Canvas.Palette.Audio) obj2 = new Canvas.Palette.Audio();
			else if (this instanceof Canvas.Palette.Video) obj2 = new Canvas.Palette.Video();
			else if (this instanceof Canvas.Palette.Text) obj2 = new Canvas.Palette.Text();
			else if (this instanceof Canvas.Palette.Group) obj2 = new Canvas.Palette.Group();
			else return undefined; // uh-oh!
		} else {
			if (obj instanceof Array) obj2 = new Array();
			else if (obj instanceof Canvas.Palette.Gradient) obj2 = new Canvas.Palette.Gradient();
			else if (obj instanceof Canvas.Palette.Radial) obj2 = new Canvas.Palette.Radial();
			else if (obj instanceof Canvas.Palette.Pattern) obj2 = new Canvas.Palette.Pattern();
			else if (obj instanceof Canvas.Palette.Mask) obj2 = new Canvas.Palette.Mask();
			else if (obj && obj.constructor == Object) obj2 = new Object();
			else return obj; // all other types we return as references
		}

		for (var prop in obj) {
			obj2[prop] = this.copy(obj[prop]);
		}
		
		return obj2;
	};
	



	this.isMaskingObject = function(senders){
		for (var i=0; i<senders.length; i++)
			if (senders[i] instanceof Canvas.Palette.Mask) return true;
		return false;
	};
	
	this.beforeDrawObject = function(x, y, senders, context){
		if (!this.isMaskingObject(senders)) {
			if (this.mask instanceof Canvas.Palette.Mask) {
				context.save();
				context.translate(x, y);
				this.mask.draw(Canvas.Utils.pushArray(senders, this), context);
				context.translate(-x, -y);
			}
			this.setStyle(context); // restore the style parameters
			context.globalAlpha *= (this.alpha/100); // handled slightly differently so as to allow for multiplication
		}
	
		// translate
		context.translate(x, y);
		// rotate
		context.rotate(this.rotation * Math.PI/180);
		// scale and skew
		context.transform(this.xscale/100, (this.xskew * Math.PI/180), (this.yskew * -Math.PI/180), this.yscale/100, 0, 0);
	};
	
	this.afterDrawObject = function(x, y, senders, context){
		// reverse the transformations in series
		context.transform(this.xscale/100, (this.xskew * -Math.PI/180), (this.yskew * Math.PI/180), this.yscale/100, 0, 0);
		context.rotate(this.rotation * -Math.PI/180);
		context.translate(x, y);

		if (!this.isMaskingObject(senders)) {
			if (this.mask instanceof Canvas.Palette.Mask) context.restore();
			context.globalAlpha /= (this.alpha/100); // undo the multiplication
		}
	};
};


/**
 * Creates a Line.
 * @constructor {public} Palette.Line
 * @param {Number} x1 The x coordinate of the first point in the Line in pixels.
 * @param {Number} y1 The y coordinate of the first point in the Line in pixels.
 * @param {Number} x2 The x coordinate of the second point in the Line in pixels.
 * @param {Number} y2 The y coordinate of the second point in the Line in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Line = function (x1, y1, x2, y2){
	Canvas.Utils.inherit(this, new Canvas.Palette.Object());
	
	if ((x1 && y1 && x2 && y2) != undefined){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		
		// The private draw function
		this.draw = function(senders, context){
			this.beforeDrawObject(this.x1+this.pivot.x, this.y1+this.pivot.y, senders, context);
				
			if (!this.isMaskingObject(senders)) context.beginPath();
			context.moveTo(-this.pivot.x, -this.pivot.y);
			context.lineTo((this.x2-this.x1)-this.pivot.x, (this.y2-this.y1)-this.pivot.y);
			if (!this.isMaskingObject(senders)) context.stroke();

			this.afterDrawObject(-(this.x1+this.pivot.x), -(this.y1+this.pivot.y), senders, context);
		};
	}
};


/**
 * Creates a Polygon.
 * @constructor {public} Palette.Polygon
 * @param {optional Number} x The x coordinate of the first point in the Line in pixels.
 * @param {optional Number} y The y coordinate of the first point in the Line in pixels.
 * @param {optional Number} ... Any number of pairs or x, y coordinates
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Polygon = function (){
	Canvas.Utils.inherit(this, new Canvas.Palette.Object());
	
	if (arguments.length%2 == 0){
		this.points = new Array();
		this.addPoint = function(x, y){
			var point = new Object();
			point.x = x;
			point.y = y;
			this.points.push(point);
		};
		for (var i=0; i<arguments.length; i+=2){
			this.addPoint(arguments[i], arguments[i+1]);
		}
		
		this.draw = function(senders, context){
			if (this.points.length < 2) return; // get out of here if we don't have enough points
			
			this.beforeDrawObject(this.points[0].x+this.pivot.x, this.points[0].y+this.pivot.y, senders, context);
			
			if (!this.isMaskingObject(senders)) context.beginPath();
			context.moveTo(-this.pivot.x, -this.pivot.y);
			for (var i=1; i<this.points.length; i++)
				context.lineTo((this.points[i].x-this.points[0].x)-this.pivot.x, (this.points[i].y-this.points[0].y)-this.pivot.y);
			if (this.close == true) context.closePath();
			context.fill();
			if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			if (!this.isMaskingObject(senders)) context.stroke();

			this.afterDrawObject(-(this.points[0].x+this.pivot.x), -(this.points[0].y+this.pivot.y), senders, context);
		};
	}
};


/**
 * Creates a Rectangle.
 * @constructor {public} Palette.Rectangle
 * @param {Number} x The x coordinate of the top left corder of the Rectangle in pixels.
 * @param {Number} y The x coordinate of the top left corder of the Rectangle in pixels.
 * @param {Number} width The width of the Rectangle in pixels.
 * @param {Number} height The height of the Rectangle in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Rectangle = function(x, y, width, height){
	Canvas.Utils.inherit(this, new Canvas.Palette.Object());

	if ((x && y && width && height) != undefined){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		
		this.draw = function(senders, context){
			var w2 = this.width/2;
			var h2 = this.height/2;
			var o_x = this.x + w2 + this.pivot.x;
			var o_y = this.y + h2 + this.pivot.y;

			this.beforeDrawObject(o_x, o_y, senders, context);

			
			if (!this.isMaskingObject(senders)) context.beginPath();
			context.fillRect(-(w2+this.pivot.x), -(h2+this.pivot.y), this.width, this.height);
			if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			context.strokeRect(-(w2+this.pivot.x), -(h2+this.pivot.y), this.width, this.height);
			if (!this.isMaskingObject(senders)) context.stroke();

			this.afterDrawObject(-o_x, -o_y, senders, context);
		};
	}
};


/**
 * Creates a Circle.
 * @constructor {public} Palette.Circle
 * @param {Number} x The x coordinate of the centre point the Circle in pixels.
 * @param {Number} y The y coordinate of the centre point the Circle in pixels.
 * @param {Number} radius The radius of the circle in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Circle = function(x, y, radius){
	Canvas.Utils.inherit(this, new Canvas.Palette.Object());
	
	if ((x && y && radius) != undefined){
		this.x = x;
		this.y = y;
		this.radius = radius;

		this.draw = function(senders, context){
			this.beforeDrawObject(this.x+this.pivot.x, this.y+this.pivot.y, senders, context);
			
			if (!this.isMaskingObject(senders)) context.beginPath();
			context.arc(-this.pivot.x, -this.pivot.y, this.radius, this.start, this.end * Math.PI/180, this.clockwise);
			if (this.close == true) context.closePath();
			context.fill();
			if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			if (!this.isMaskingObject(senders)) context.stroke();
			
			this.afterDrawObject(-(this.x+this.pivot.x), -(this.y+this.pivot.y), senders, context);
		};
	}
};


/**
 * Creates an Arc. An Arc is defined by two intersecting lines defined by three co-ordinates. These are one points from each line and the point of intersection of the two lines. A portion of a circle of a defined radious is drawn that is tangental to two lines. The Arc is completed by two lines running  along each lines from the points of tangent to the point given from each line.
 * @constructor {public} Palette.Arc
 * @param {Number} x1 The x coordinate of a point on the first line in pixels.
 * @param {Number} y1 The y coordinate of a point on the first line in pixels.
 * @param {Number} x2 The x coordinate of the point where the first and second line intersect in pixels.
 * @param {Number} y2 The x coordinate of the point where the first and second line intersect in pixels.
 * @param {Number} x3 The x coordinate of a point on the second line in pixels.
 * @param {Number} y3 The y coordinate of a point on the second line in pixels.
 * @param {Number} radius The radius of the circle that forms the arc in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Arc = function(x1, y1, x2, y2, x3, y3, radius){
	Canvas.Utils.inherit(this, new Canvas.Palette.Object());

	if ((x1 && y1 && x2 && y2 && x3 && y3 && radius) != undefined){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3;
		this.radius = radius;
		
		this.draw = function(senders, context){
			var o_x = (this.x1 + this.x3)/2 + this.pivot.x;
			var o_y = (this.y1 + this.y3)/2 + this.pivot.y;
			
			this.beforeDrawObject(o_x, o_y, senders, context);
			
			if (!this.isMaskingObject(senders)) context.beginPath();
			context.moveTo(this.x1-o_x, this.y1-o_y);   // Same starting point as above.
			context.arcTo(this.x2-o_x, this.y2-o_y, this.x3-o_x, this.y3-o_y, this.radius); // Create an arc.
			context.lineTo(this.x3-o_x, this.y3-o_y);
			if (!this.isMaskingObject(senders)) context.stroke();
			
			if (this.close == true) context.closePath();
			context.fill();
			if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke

			this.afterDrawObject(-o_x, -o_y, senders, context);
		};
	}
};


/**
 * Creates an cubic BŽzier curve.
 * @constructor {public} Palette.Bezier
 * @param {Number} x1 The x coordinate of the start point of the curve in pixels.
 * @param {Number} y1 The y coordinate of the start point of the curve in pixels.
 * @param {Number} x2 The x coordinate of the end point of the curve in pixels.
 * @param {Number} y2 The y coordinate of the end point of the curve in pixels.
 * @param {Number} c_x1 The x coordinate of the first control point of the curve in pixels.
 * @param {Number} c_y1 The y coordinate of the first control point of the curve in pixels.
 * @param {Number} c_x2 The x coordinate of the second control point of the curve in pixels.
 * @param {Number} c_y2 The y coordinate of the second control point of the curve in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Bezier = function(x1, y1, x2, y2, c_x1, c_y1, c_x2, c_y2){
	Canvas.Utils.inherit(this, new Canvas.Palette.Object());

	if ((x1 && y1 && x2 && y2 && c_x1 && c_y1 && c_x2 && c_y2) != undefined){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.c_x1 = c_x1;
		this.c_y1 = c_y1;
		this.c_x2 = c_x2;
		this.c_y2 = c_y2;
		
		this.draw = function(senders, context){
			var o_x = (this.x1 + this.x2)/2 + this.pivot.x;
			var o_y = (this.y1 + this.y2)/2 + this.pivot.y;
			
			this.beforeDrawObject(o_x, o_y, senders, context);
			
			if (!this.isMaskingObject(senders)) context.beginPath();
			context.moveTo(this.x1-o_x, this.y1-o_y);   // Same starting point as above.
			context.bezierCurveTo(this.c_x1-o_x, this.c_y1-o_y, this.c_x2-o_x, this.c_y2-o_y, this.x2-o_x, this.y2-o_y); // Create an arc.
			if (this.close == true) context.closePath();
			context.fill();
			if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			if (!this.isMaskingObject(senders)) context.stroke();

			this.afterDrawObject(-o_x, -o_y, senders, context);
		};
	}
};


/**
 * Creates an quadratic BŽzier curve.
 * @constructor {public} Palette.Quadratic
 * @param {Number} x1 The x coordinate of the start point of the curve in pixels.
 * @param {Number} y1 The y coordinate of the start point of the curve in pixels.
 * @param {Number} x2 The x coordinate of the end point of the curve in pixels.
 * @param {Number} y2 The y coordinate of the end point of the curve in pixels.
 * @param {Number} c_x1 The x coordinate of the first control point of the curve in pixels.
 * @param {Number} c_y1 The y coordinate of the first control point of the curve in pixels.
 * @param {Number} c_x2 The x coordinate of the second control point of the curve in pixels.
 * @param {Number} c_y2 The y coordinate of the second control point of the curve in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Quadratic = function(x1, y1, x2, y2, c_x, c_y){
	Canvas.Utils.inherit(this, new Canvas.Palette.Object());

	if ((x1 && y1 && x2 && y2 && c_x && c_y) != undefined){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.c_x = c_x;
		this.c_y = c_y;
		
		this.draw = function(senders, context){
			var o_x = (this.x1 + this.x2)/2 + this.pivot.x;
			var o_y = (this.y1 + this.y2)/2 + this.pivot.y;
			
			this.beforeDrawObject(o_x, o_y, senders, context);
			
			if (!this.isMaskingObject(senders)) context.beginPath();
			context.moveTo(this.x1-o_x, this.y1-o_y);   // Same starting point as above.
			context.quadraticCurveTo(this.c_x-o_x, this.c_y-o_y, this.x2-o_x, this.y2-o_y); // Create an arc.
			if (this.close == true) context.closePath();
			context.fill();
			if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
			if (!this.isMaskingObject(senders)) context.stroke();

			this.afterDrawObject(-o_x, -o_y, senders, context);
		};
	}
};


/**
 * Creates an Image from a source file (.png, .gif, .svg, .jpg, etc.).
 * @constructor {public} Palette.Image
 * @param {Number} x The x coordinate of the top-left corder of the image in pixels.
 * @param {Number} y The y coordinate of the top-left corder of the image in pixels.
 * @param {String} src A URL to the source file for the image.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Image = function(x, y, src){
	Canvas.Utils.inherit(this, new Canvas.Palette.Object());

	if ((x && y && src) != undefined){
		this.x = x;
		this.y = y;
		this.image = Canvas.Library.addImage(src);
		
		this.draw = function(senders, context){
			this.beforeDrawObject(this.x+this.pivot.x, this.y+this.pivot.y, senders, context);
			
			if (this.clip.width == undefined) 
				this.clip.width = this.video.videoWidth - this.clip.x;
			if (this.clip.height == undefined) 
				this.clip.height = this.video.videoHeight - this.clip.y;

			context.drawImage(this.image, this.clip.x, this.clip.y, this.clip.width, this.clip.height, -this.pivot.x, -this.pivot.y, this.clip.width, this.clip.height);
			
			this.afterDrawObject(-(this.x+this.pivot.x), -(this.y+this.pivot.y), senders, context);
		};
	}
};


/**
 * Creates an Audio object from a source file (.ogg, .mp3, .wav, etc.).
 * @constructor {public} Palette.Audio
 * @param {String} src A URL to the source file for the image.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Audio = function(src){
	Canvas.Utils.inherit(this, new Canvas.Palette.Object());

	if ((src) != undefined){
		this.audio = Canvas.Library.addAudio(src);
		
		this.play = function(){
			this.audio.play();
		};
		this.stop = function(){
			this.audio.pause();
			this.audio.currentTime = 0;
		};
		this.pause = function(){
			this.audio.pause();
		};
		this.setTime = function(time){
			this.audio.currentTime = 0;
		};
		this.setVolume = function(volume){
			this.audio.volume = volume/100;
		};
		this.getDuration = function(){
			return this.audio.duration;
		};
		
		this.draw = function(senders, context){
			// an empty function solely to allow object this to be added to scenes
		};
	}
};


/**
 * Creates a Video object from a source file (.ogg, .mov, .mpg, etc.).
 * @constructor {public} Palette.Video
 * @param {Number} x The x coordinate of the top-left corder of the video in pixels.
 * @param {Number} y The y coordinate of the top-left corder of the video in pixels.
 * @param {String} src A URL to the source file for the video.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Video = function(x, y, src){
	Canvas.Utils.inherit(this, new Canvas.Palette.Object());

	if ((x && y && src) != undefined){
		this.x = x;
		this.y = y;
		this.video = Canvas.Library.addVideo(src);

		this.play = function(){
			this.video.play();
		};
		this.stop = function(){
			this.video.pause();
			this.video.currentTime = 0;
		};
		this.pause = function(){
			this.video.pause();
		};
		this.setTime = function(time){
			this.video.currentTime = 0;
		};
		this.setVolume = function(volume){
			this.video.volume = volume/100;
		};
		this.getDuration = function(){
			return this.video.duration;
		};
		
		this.draw = function(senders, context){
			this.beforeDrawObject(this.x+this.pivot.x, this.y+this.pivot.y, senders, context);
			
			if (this.clip.width == undefined) 
				this.clip.width = this.video.videoWidth - this.clip.x;
			if (this.clip.height == undefined) 
				this.clip.height = this.video.videoHeight - this.clip.y;
			
			context.drawImage(this.video, this.clip.x, this.clip.y, this.clip.width, this.clip.height, -this.pivot.x, -this.pivot.y, this.clip.width, this.clip.height);
			
			this.afterDrawObject(-(this.x+this.pivot.x), -(this.y+this.pivot.y), senders, context);
		};
	}
};


/**
 * Writes a text string on to the canvas
 * @constructor {public} Palette.Text
 * @param {Number} x The x coordinate of the top-left corder of the image in pixels.
 * @param {Number} y The y coordinate of the top-left corder of the image in pixels.
 * @param {String} src A URL to the source file for the image.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Text = function(x, y, text){
	Canvas.Utils.inherit(this, new Canvas.Palette.Object());

	if ((x && y && text) != undefined){
		this.x = x;
		this.y = y;
		this.text = text;
		
		this.fill = this.stroke.color;
		this.stroke.color = "transparent";
		
		this.draw = function(senders, context){
			this.beforeDrawObject(this.x+this.pivot.x, this.y+this.pivot.y, senders, context);

			try{ // stroke and fill text are not supported on Camino
				context.fillText(this.text, -this.pivot.x, -this.pivot.y);
				if (this.fill != "transparent") context.shadowColor = "transparent"; // hide the shadow before applying the stroke
				context.strokeText(this.text, -this.pivot.x, -this.pivot.y);
			} catch(err){}
			this.afterDrawObject(-(this.x+this.pivot.x), -(this.y+this.pivot.y), senders, context);
		};
		
		
		/**
		 * Returns the width of the text in CSS pixels.
		 * @function {public Number} Palette.Text.width
		 * @return The width of the text in CSS pixels.
		 * @author Oliver Moran
		 * @since 0.2
		 */
		// FIXME: This is broken because the context is unknown
	 	this.width = function(){
			this.setStyle(context);

			context.scale(this.xscale/100, this.yscale/100);
			var textMetrics = context.measureText(this.text);
			context.scale(100/this.xscale, 100/this.yscale);
			
			return textMetrics.width;
		};
	}
};


/**
 * Creates an group container that contains other palette objects (including other groups).
 * @param {Number} x The x coordinate of the top-left corder of the group in pixels.
 * @param {Number} y The y coordinate of the top-left corder of the group in pixels.
 * @constructor {public} Palette.Group
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Group = function(x, y){
	Canvas.Utils.inherit(this, new Canvas.Palette.Object());

	if ((x && y) != undefined){
		this.x = x;
		this.y = y;
	}
	
	
	this.members = {}; // an object that holds the group's memebrs
	
	/**
	 * Adds a Palette object to the Group.
	 * @function {public void} Palette.Group
	 * @param {String} name An instance name for the object
	 * @param {Object} obj The object to be added
	 * @param {optional Boolean} copy Whether to (deep) copy of the object. Defaults to true, otherwise a shallow copy of the object is added to the drawing. 
	 * @return Nothing
	 * @see Palette.Group.remove
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.add = function(name, obj, copy){
		if (copy) this.members[name] = obj.copy();
		else this.members[name] = obj;
	};
	
	/**
	 * Removes a Palette object from the Group.
	 * @function {public void} Palette.Group.remove
	 * @return Nothing
	 * @see Palette.Group.add
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.remove = function(name){
		delete this.members[name];
	};
		
	/**
	 * A method to bubble sort the objects in the scene by layer.
	 * @function {private static void} Palette.Group.membersByLayer
	 * @param {Array} array The object to bequeath attributes to.
	 * @return An array containing the objects in the scene.
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.membersByLayer = function() {
		var array = new Array();
		for (var obj in this.members) 
			array.push(this.members[obj]);
		
		for(var i = 0; i < array.length; i++) {
			for(var j = 0; j < (array.length-1); j++) {
				if(array[j].layer > array[j+1].layer) {
					var tmp = array[j+1];
					array[j+1] = array[j];
					array[j] = tmp;
				}
			}
		}
		return array;
	};
	

	this.draw = function(senders, context){
		this.beforeDrawObject(this.x+this.pivot.x, this.y+this.pivot.y, senders, context);
		
		context.translate(-this.pivot.x, -this.pivot.y);
		// loop through the Group members
		var layers = this.membersByLayer();
		for (var i in layers)
			if (layers[i]) layers[i].draw(Canvas.Utils.pushArray(senders, this), context);
		context.translate(this.pivot.x, this.pivot.y);
		
		this.afterDrawObject(-(this.x+this.pivot.x), -(this.y+this.pivot.y), senders, context);
	};
};


/**
 * Creates a mask made up of other palette objects (including other groups).
 * @param {Number} x The x coordinate of the top-left corder of the mask in pixels.
 * @param {Number} y The y coordinate of the top-left corder of the mask in pixels.
 * @constructor {public} Palette.Mask
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Mask = function(x, y){
	Canvas.Utils.inherit(this, new Canvas.Palette.Object());

	if ((x && y) != undefined){
		this.x = x;
		this.y = y;
	}
	
	
	this.elements = {}; // an object that holds the masks elements
	
	/**
	 * Adds a Palette object to the Group.
	 * @function {public void} Palette.Group
	 * @param {String} name An instance name for the object
	 * @param {Object} obj The object to be added
	 * @param {optional Boolean} copy Whether to (deep) copy of the object. Defaults to true, otherwise a shallow copy of the object is added to the drawing. 
	 * @return Nothing
	 * @see Palette.Group.remove
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.add = function(name, obj, copy){
		if (copy) this.elements[name] = obj.copy();
		else this.elements[name] = obj;
	};
	
	/**
	 * Removes a Palette object from the Group.
	 * @function {public void} Palette.Group.remove
	 * @return Nothing
	 * @see Palette.Group.add
	 * @author Oliver Moran
	 * @since 0.2
	 */	
	this.remove = function(name){
		delete this.elements[name];
	};
		
	/**
	 * A method to bubble sort the objects in the scene by layer.
	 * @function {private static void} Palette.Group.membersByLayer
	 * @param {Array} array The object to bequeath attributes to.
	 * @return An array containing the objects in the scene.
	 * @author Oliver Moran
	 * @since 0.2
	 */
	this.elementsByLayer = function() {
		var array = new Array();
		for (var obj in this.elements) 
			array.push(this.elements[obj]);
		
		for(var i = 0; i < array.length; i++) {
			for(var j = 0; j < (array.length-1); j++) {
				if(array[j].layer > array[j+1].layer) {
					var tmp = array[j+1];
					array[j+1] = array[j];
					array[j] = tmp;
				}
			}
		}
		return array;
	};
	

	this.draw = function(senders, context){
		context.translate(-(this.x+this.pivot.x), -(this.y+this.pivot.y));
		context.rotate(this.rotation * Math.PI/180);
		context.transform(this.xscale/100, (this.xskew * Math.PI/180), (this.yskew * -Math.PI/180), this.yscale/100, 0, 0);

		context.strokeStyle = "transparent";
		context.shadowColor = "transparent";
		context.fillStyle = "transparent";
		
		context.beginPath();

		// loop through the Mask's elements
		var layers = this.elementsByLayer();
		for (var i in layers) if (layers[i]) 
			if (layers[i].draw) layers[i].draw(Canvas.Utils.pushArray(senders, this), context);
		context.clip();
		
		// reverse the transformations in series
		context.transform(this.xscale/100, (this.xskew * -Math.PI/180), (this.yskew * Math.PI/180), this.yscale/100, 0, 0);
		context.rotate(this.rotation * -Math.PI/180);
		context.translate(this.x+this.pivot.x, this.y+this.pivot.y);
	};
};


/**
 * Creates an linear gradient for use in fills.
 * @constructor {public} Palette.Gradient
 * @param {Number} x1 The x coordinate of the start point of the gradient in pixels relative to the origin of the Palette object being filled.
 * @param {Number} y1 The y coordinate of the start point of the gradient in pixels relative to the origin of the Palette object being filled.
 * @param {Number} x2 The x coordinate of the end point of the gradient in pixels relative to the origin of the Palette object being filled.
 * @param {Number} y2 The y coordinate of the end point of the gradient in pixels relative to the origin of the Palette object being filled.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Gradient = function (x1, y1, x2, y2){
	if ((x1 && y1 && x2 && y2) != undefined){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		
		this.draw = function(senders, context){
			var x1 = this.x1 - senders[senders.length-1].pivot.x;
			var y1 = this.y1 - senders[senders.length-1].pivot.y;
			var x2 = this.x2 - senders[senders.length-1].pivot.x;
			var y2 = this.y2 - senders[senders.length-1].pivot.y;
			
			var gradient = context.createLinearGradient(x1, y1, x2, y2);
			for (var stop in this.stops)
				gradient.addColorStop(this.stops[stop].offset, this.stops[stop].color);
			
			return gradient;
		};
	}
	
	this.stops = new Array();
	this.addStop = function(offset, color){
		var stop = new Object();
		stop.offset = offset;
		stop.color = color;
		this.stops.push(stop);
	};
};


/**
 * Creates an radial gradient for use in fills.
 * @constructor {public} Palette.Radial
 * @param {optional Number} x1 The x coordinate of the centre point of the starting circle in pixels relative to the origin of the Palette object being filled.
 * @param {optional Number} y1 The y coordinate of the centre point of the starting circle in pixels relative to the origin of the Palette object being filled.
 * @param {optional Number} radius1 The radius of the starting circle in pixels.
 * @param {optional Number} x2 The x coordinate of the centre point of the ending circle in pixels relative to the origin of the Palette object being filled.
 * @param {optional Number} y2 The y coordinate of the centre point of the ending circle in pixels relative to the origin of the Palette object being filled.
 * @param {Number} radius2 The radius of the ending circle in pixels.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Radial = function (x1, y1, radius1, x2, y2, radius2){
	if (x1 != undefined && (y1 && radius1 && x2 && y2 && radius2) == undefined){
		radius2 = x1;
		x1 = 0;
		y1 = 0;
		x2 = 0;
		y2 = 0;
		radius1 = 0;
	}
	
	if ((x1 && y1 && radius1 && x2 && y2 && radius2) != undefined){
		this.x1 = x1;
		this.y1 = y1;
		this.radius1 = radius1;
		this.x2 = x2;
		this.y2 = y2;
		this.radius2 = radius2;
		
		this.draw = function(senders, context){
			var x1 = this.x1 - senders[senders.length-1].pivot.x;
			var y1 = this.y1 - senders[senders.length-1].pivot.y;
			var x2 = this.x2 - senders[senders.length-1].pivot.x;
			var y2 = this.y2 - senders[senders.length-1].pivot.y;
			
			var gradient = context.createRadialGradient(x1, y1, this.radius1, x2, y2, this.radius2);
			for (var stop in this.stops)
				gradient.addColorStop(this.stops[stop].offset, this.stops[stop].color);
			
			return gradient;
		};
	}
	
	this.stops = new Array();
	this.addStop = function(offset, color){
		var stop = new Object();
		stop.offset = offset;
		stop.color = color;
		this.stops.push(stop);
	};
};


/**
 * Creates an radial gradient for use in fills.
 * @constructor {public} Palette.Pattern
 * @param {String} src The URL of an image file.
 * @param {optional String} repeat How the patter should repeat. Valid values are repeat, repeat-x, repeat-y and no-repeat. Defaults to repeat.
 * @author Oliver Moran
 * @since 0.2
 */
Canvas.Palette.Pattern = function (src, repeat){
	if (repeat == undefined) repeat = "repeat";

	if ((src && repeat) != undefined){
		this.image = Canvas.Library.addImage(src);
		this.repeat = repeat;
		
		this.draw = function(senders, context){
			var gradient = context.createPattern(this.image, this.repeat);
			return gradient;
		};
	}
};











/*
 * Yuichi Tateno. <hotchpotch@N0!spam@gmail.com>
 * http://rails2u.com/
 * 
 * The MIT License
 * --------
 * Copyright (c) 2007 Yuichi Tateno
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */
 
/* 
 * The following is based on JSTweener by Yuichi Tateno:
 * http://coderepos.org/share/wiki/JSTweener
 *
 * Adapted for use with Canvas API by Oliver Moran (2010)
 *
 */

/**
 * The static Tweener class, which contains a range of methods for animating Pallet Objects.
 * @class {static} Canvas.Tweener
 * @author Yuichi Tateno
 * @since 0.2
 */
Canvas.Tweener = {
    looping: false,
    objects: [],
    defaultOptions: {
	    framerate: 12,
        time: 1,
        transition: 'linear',
        delay: 0,
        onStart: undefined,
        onStartParams: undefined,
        onUpdate: undefined,
        onUpdateParams: undefined,
        onComplete: undefined,
        onCompleteParams: undefined
    },
    inited: false,
    easingFunctionsLowerCase: {},
    init: function() {
        this.inited = true;
        for (var key in Canvas.Tweener.easingFunctions) {
            this.easingFunctionsLowerCase[key.toLowerCase()] = Canvas.Tweener.easingFunctions[key];
        }
    },
	/**
	 * Applies a tween to a Palette Object.
	 * @function {public static void} Tweener.doTween
	 * @param {Object} obj The object to apply the tween to. This object may be the palette object itself or a sub-object (such as stroke).
	 * @param {Object} options An object containing parameters that define the behavior of the tween.
	 * @... {optional Number} time The duration in seconds of the tween. Defaults to 1.
	 * @... {optional String} transition The name of the tween to use. Valid values are "linear", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeOutInCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeOutInQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint", "easeOutInQuint", "easeInSine", "easeOutSine", "easeInOutSine", "easeOutInSine", "easeInExpo", "easeOutExpo", "easeInOutExpo", "easeOutInExpo", "easeInCirc", "easeOutCirc", "easeInOutCirc", "easeOutInCirc", "easeInElastic", "easeOutElastic", "easeInOutElastic", "easeOutInElastic", "easeInBack", "easeOutBack", "easeInOutBack", "easeOutInBack", "easeInBounce", "easeOutBounce", "easeInOutBounce", "easeOutInBounce". Default it "linear". 
	 * @... {optional Number} delay A delay in seconds before the tween begins.
	 * @... {optional Function} onComplete A function called on completion of the tween.
	 * @... {optional Object} onCompleteParams A custom object to be passed as a second argument to the onComplete function. The first argument is an object that describes the tween.
	 * @... {optional Function} onUpdate A function called on a each frame of the animation.
	 * @... {optional Object} onUpdateParams A custom object to be passed as a second argument to the onUpdate function. The first argument is an object that describes the tween.
	 * @... {optional Function} onStart A function called on start of the tween.
	 * @... {optional Object} onStartParams A custom object to be passed as a second argument to the onStart function. The first argument is an object that describes the tween.
	 * @... {Number} prop1 A property of obj to be tweened.
	 * @... {optional Number} propN (Any number of properties of obj may be passed.)
	 * @return Nothing
	 * @author Oliver Moran
	 * @since 0.2
	 */	
    doTween: function(obj, options) {
        var self = this;
        if (!this.inited) this.init();
        var o = {};
        o.target = obj;
        o.targetPropeties = {};
        
        for (var key in this.defaultOptions) {
            if (typeof options[key] != 'undefined') {
                o[key] = options[key];
                delete options[key];
            } else {
                o[key] = this.defaultOptions[key];
            }
        }

        if (typeof o.transition == 'function') {
            o.easing = o.transition;
        } else {
            o.easing = this.easingFunctionsLowerCase[o.transition.toLowerCase()];
        }

        for (var key in options) {
            var sB = obj[key];
            o.targetPropeties[key] = {
                b: sB,
                c: options[key] - sB
            };
        }

        setTimeout(function() {
            o.startTime = (new Date() - 0);
            o.endTime = o.time * 1000 + o.startTime;

            if (typeof o.onStart == 'function') {
                if (o.onStartParams) {
                    o.onStart.apply(o, o.onStartParams);
                } else {
                    o.onStart();
                }
            }

            self.objects.push(o);
            if (!self.looping) { 
                self.looping = true;
                self.eventLoop.call(self);
            }
        }, o.delay * 1000);
    },
    eventLoop: function() {
        var now = (new Date() - 0);
        for (var i = 0; i < this.objects.length; i++) {
            var o = this.objects[i];
            var t = now - o.startTime;
            var d = o.endTime - o.startTime;

            if (t >= d) {
                for (var property in o.targetPropeties) {
                    var tP = o.targetPropeties[property];
					o.target[property] = (tP.b + tP.c);
                }
                this.objects.splice(i, 1);

                if (typeof o.onUpdate == 'function') {
                    if (o.onUpdateParams) {
                        o.onUpdate.apply(o, o.onUpdateParams);
                    } else {
                        o.onUpdate();
                    }
                }

                if (typeof o.onComplete == 'function') {
                    if (o.onCompleteParams) {
                        o.onComplete.apply(o, o.onCompleteParams);
                    } else {
                        o.onComplete();
                    }
                }
            } else {
                for (var property in o.targetPropeties) {
                    var tP = o.targetPropeties[property];
                    o.target[property] = o.easing(t, tP.b, tP.c, d);
                }

                if (typeof o.onUpdate == 'function') {
                    if (o.onUpdateParams) {
                        o.onUpdate.apply(o, o.onUpdateParams);
                    } else {
                        o.onUpdate();
                    }
                }
            }
        }

        if (this.objects.length > 0) {
            var self = this;
            setTimeout(function() { self.eventLoop(); }, 1000/o.framerate);
        } else {
            this.looping = false;
        }
    }
};


/*
 * Canvas.Tweener.easingFunctions is
 * Tweener's easing functions (Penner's Easing Equations) porting to JavaScript.
 * http://code.google.com/p/tweener/
 */

Canvas.Tweener.easingFunctions = {
    easeNone: function(t, b, c, d) {
        return c*t/d + b;
    },    
    easeInQuad: function(t, b, c, d) {
        return c*(t/=d)*t + b;
    },    
    easeOutQuad: function(t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },    
    easeInOutQuad: function(t, b, c, d) {
        if((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 *((--t)*(t-2) - 1) + b;
    },    
    easeInCubic: function(t, b, c, d) {
        return c*(t/=d)*t*t + b;
    },    
    easeOutCubic: function(t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    },    
    easeInOutCubic: function(t, b, c, d) {
        if((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    },    
    easeOutInCubic: function(t, b, c, d) {
        if(t < d/2) return Canvas.Tweener.easingFunctions.easeOutCubic(t*2, b, c/2, d);
        return Canvas.Tweener.easingFunctions.easeInCubic((t*2)-d, b+c/2, c/2, d);
    },    
    easeInQuart: function(t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },    
    easeOutQuart: function(t, b, c, d) {
        return -c *((t=t/d-1)*t*t*t - 1) + b;
    },    
    easeInOutQuart: function(t, b, c, d) {
        if((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 *((t-=2)*t*t*t - 2) + b;
    },    
    easeOutInQuart: function(t, b, c, d) {
        if(t < d/2) return Canvas.Tweener.easingFunctions.easeOutQuart(t*2, b, c/2, d);
        return Canvas.Tweener.easingFunctions.easeInQuart((t*2)-d, b+c/2, c/2, d);
    },    
    easeInQuint: function(t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
    },    
    easeOutQuint: function(t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },    
    easeInOutQuint: function(t, b, c, d) {
        if((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    },    
    easeOutInQuint: function(t, b, c, d) {
        if(t < d/2) return Canvas.Tweener.easingFunctions.easeOutQuint(t*2, b, c/2, d);
        return Canvas.Tweener.easingFunctions.easeInQuint((t*2)-d, b+c/2, c/2, d);
    },    
    easeInSine: function(t, b, c, d) {
        return -c * Math.cos(t/d *(Math.PI/2)) + c + b;
    },    
    easeOutSine: function(t, b, c, d) {
        return c * Math.sin(t/d *(Math.PI/2)) + b;
    },    
    easeInOutSine: function(t, b, c, d) {
        return -c/2 *(Math.cos(Math.PI*t/d) - 1) + b;
    },    
    easeOutInSine: function(t, b, c, d) {
        if(t < d/2) return Canvas.Tweener.easingFunctions.easeOutSine(t*2, b, c/2, d);
        return Canvas.Tweener.easingFunctions.easeInSine((t*2)-d, b+c/2, c/2, d);
    },    
    easeInExpo: function(t, b, c, d) {
        return(t==0) ? b : c * Math.pow(2, 10 *(t/d - 1)) + b - c * 0.001;
    },    
    easeOutExpo: function(t, b, c, d) {
        return(t==d) ? b+c : c * 1.001 *(-Math.pow(2, -10 * t/d) + 1) + b;
    },    
    easeInOutExpo: function(t, b, c, d) {
        if(t==0) return b;
        if(t==d) return b+c;
        if((t/=d/2) < 1) return c/2 * Math.pow(2, 10 *(t - 1)) + b - c * 0.0005;
        return c/2 * 1.0005 *(-Math.pow(2, -10 * --t) + 2) + b;
    },    
    easeOutInExpo: function(t, b, c, d) {
        if(t < d/2) return Canvas.Tweener.easingFunctions.easeOutExpo(t*2, b, c/2, d);
        return Canvas.Tweener.easingFunctions.easeInExpo((t*2)-d, b+c/2, c/2, d);
    },    
    easeInCirc: function(t, b, c, d) {
        return -c *(Math.sqrt(1 -(t/=d)*t) - 1) + b;
    },    
    easeOutCirc: function(t, b, c, d) {
        return c * Math.sqrt(1 -(t=t/d-1)*t) + b;
    },    
    easeInOutCirc: function(t, b, c, d) {
        if((t/=d/2) < 1) return -c/2 *(Math.sqrt(1 - t*t) - 1) + b;
        return c/2 *(Math.sqrt(1 -(t-=2)*t) + 1) + b;
    },    
    easeOutInCirc: function(t, b, c, d) {
        if(t < d/2) return Canvas.Tweener.easingFunctions.easeOutCirc(t*2, b, c/2, d);
        return Canvas.Tweener.easingFunctions.easeInCirc((t*2)-d, b+c/2, c/2, d);
    },    
    easeInElastic: function(t, b, c, d, a, p) {
        var s;
        if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
        if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
    },    
    easeOutElastic: function(t, b, c, d, a, p) {
        var s;
        if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
        if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
        return(a*Math.pow(2,-10*t) * Math.sin((t*d-s)*(2*Math.PI)/p ) + c + b);
    },    
    easeInOutElastic: function(t, b, c, d, a, p) {
        var s;
        if(t==0) return b;  if((t/=d/2)==2) return b+c;  if(!p) p=d*(.3*1.5);
        if(!a || a < Math.abs(c)) { a=c; s=p/4; }       else s = p/(2*Math.PI) * Math.asin(c/a);
        if(t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },    
    easeOutInElastic: function(t, b, c, d, a, p) {
        if(t < d/2) return Canvas.Tweener.easingFunctions.easeOutElastic(t*2, b, c/2, d, a, p);
        return Canvas.Tweener.easingFunctions.easeInElastic((t*2)-d, b+c/2, c/2, d, a, p);
    },    
    easeInBack: function(t, b, c, d, s) {
        if(s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },    
    easeOutBack: function(t, b, c, d, s) {
        if(s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },    
    easeInOutBack: function(t, b, c, d, s) {
        if(s == undefined) s = 1.70158;
        if((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },    
    easeOutInBack: function(t, b, c, d, s) {
        if(t < d/2) return Canvas.Tweener.easingFunctions.easeOutBack(t*2, b, c/2, d, s);
        return Canvas.Tweener.easingFunctions.easeInBack((t*2)-d, b+c/2, c/2, d, s);
    },    
    easeInBounce: function(t, b, c, d) {
        return c - Canvas.Tweener.easingFunctions.easeOutBounce(d-t, 0, c, d) + b;
    },    
    easeOutBounce: function(t, b, c, d) {
        if((t/=d) <(1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if(t <(2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if(t <(2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    },    
    easeInOutBounce: function(t, b, c, d) {
        if(t < d/2) return Canvas.Tweener.easingFunctions.easeInBounce(t*2, 0, c, d) * .5 + b;
        else return Canvas.Tweener.easingFunctions.easeOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
    },    
    easeOutInBounce: function(t, b, c, d) {
        if(t < d/2) return Canvas.Tweener.easingFunctions.easeOutBounce(t*2, b, c/2, d);
        return Canvas.Tweener.easingFunctions.easeInBounce((t*2)-d, b+c/2, c/2, d);
    }
};
Canvas.Tweener.easingFunctions.linear = Canvas.Tweener.easingFunctions.easeNone;






/*
 * Copyright (c) 2010 John Resig, http://jquery.com/
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
 
/* 
 * The following is code is based on domready:
 * http://code.google.com/p/domready/
 * 
 * Adapted for use with Canvas API by Oliver Moran (2010)
 *
 */

/**
 * The static DOMReady class that determines when the HTML DOM has loaded and initialises Canvas class.
 * @class {static} Canvas.DOMReady
 * @author John Resig
 * @since 0.2
 */
(function(){

    Canvas.DOMReady = window.DomReady = {};

	// Everything that has to do with properly supporting our document ready event. Brought over from the most awesome jQuery. 

    var userAgent = navigator.userAgent.toLowerCase();

    // Figure out what browser is being used
    var browser = {
    	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
    	safari: /webkit/.test(userAgent),
    	opera: /opera/.test(userAgent),
    	msie: (/msie/.test(userAgent)) && (!/opera/.test( userAgent )),
    	mozilla: (/mozilla/.test(userAgent)) && (!/(compatible|webkit)/.test(userAgent))
    };    

	var readyBound = false;	
	var isReady = false;
	var readyList = [];

	// Handle when the DOM is ready
	function domReady() {
		// Make sure that the DOM is not already loaded
		if(!isReady) {
			// Remember that the DOM is ready
			isReady = true;
        
	        if(readyList) {
	            for(var fn = 0; fn < readyList.length; fn++) {
	                readyList[fn].call(window, []);
	            }
            
	            readyList = [];
	        }
		}
	};

	// From Simon Willison. A safe way to fire onload w/o screwing up everyone else.
	function addLoadEvent(func) {
	  var oldonload = window.onload;
	  if (typeof window.onload != 'function') {
	    window.onload = func;
	  } else {
	    window.onload = function() {
	      if (oldonload) {
	        oldonload();
	      }
	      func();
	    };
	  }
	};

	// does the heavy work of working through the browsers idiosyncracies (let's call them that) to hook onload.
	function bindReady() {
		if(readyBound) {
		    return;
	    }
	
		readyBound = true;

		// Mozilla, Opera (see further below for it) and webkit nightlies currently support this event
		if (document.addEventListener && !browser.opera) {
			// Use the handy event callback
			document.addEventListener("DOMContentLoaded", domReady, false);
		}

		// If IE is used and is not in a frame
		// Continually check to see if the document is ready
		if (browser.msie && window == top) (function(){
			if (isReady) return;
			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch(error) {
				setTimeout(arguments.callee, 0);
				return;
			}
			// and execute any waiting functions
		    domReady();
		})();

		if(browser.opera) {
			document.addEventListener( "DOMContentLoaded", function () {
				if (isReady) return;
				for (var i = 0; i < document.styleSheets.length; i++)
					if (document.styleSheets[i].disabled) {
						setTimeout( arguments.callee, 0 );
						return;
					}
				// and execute any waiting functions
	            domReady();
			}, false);
		}

		if(browser.safari) {
		    var numStyles;
			(function(){
				if (isReady) return;
				if (document.readyState != "loaded" && document.readyState != "complete") {
					setTimeout( arguments.callee, 0 );
					return;
				}
				if (numStyles === undefined) {
	                var links = document.getElementsByTagName("link");
	                for (var i=0; i < links.length; i++) {
	                	if(links[i].getAttribute('rel') == 'stylesheet') {
	                	    numStyles++;
	                	}
	                }
	                var styles = document.getElementsByTagName("style");
	                numStyles += styles.length;
				}
				if (document.styleSheets.length != numStyles) {
					setTimeout( arguments.callee, 0 );
					return;
				}
			
				// and execute any waiting functions
				domReady();
			})();
		}

		// A fallback to window.onload, that will always work
	    addLoadEvent(domReady);
	};

	// This is the public function that people can use to hook up ready.
	Canvas.DOMReady.ready = function(fn, args) {
		// Attach the listeners
		bindReady();
    
		// If the DOM is already ready
		if (isReady) {
			// Execute the function immediately
			fn.call(window, []);
	    } else {
			// Add the function to the wait list
	        readyList.push( function() { return fn.call(window, []); } );
	    }
	};
	
	bindReady();
	
})();

// Call the init function when the DOM is ready
Canvas.DOMReady.ready(function() {
	Canvas.init();
});